import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// POST /api/community/comments/[commentId]/like - 댓글 좋아요 토글
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // 기존 좋아요 확인
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: session.user.id,
        },
      },
    })

    let isLiked: boolean
    let likeCount: number

    if (existingLike) {
      // 좋아요 취소
      await prisma.commentLike.delete({
        where: { id: existingLike.id },
      })
      await prisma.comment.update({
        where: { id: commentId },
        data: { likeCount: { decrement: 1 } },
      })
      isLiked = false
      likeCount = comment.likeCount - 1
    } else {
      // 좋아요 추가
      await prisma.commentLike.create({
        data: {
          commentId,
          userId: session.user.id,
        },
      })
      await prisma.comment.update({
        where: { id: commentId },
        data: { likeCount: { increment: 1 } },
      })
      isLiked = true
      likeCount = comment.likeCount + 1
    }

    return NextResponse.json({
      success: true,
      isLiked,
      likeCount,
    })
  } catch (error) {
    console.error('Comment Like POST error:', error)
    return NextResponse.json(
      { error: '좋아요 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
