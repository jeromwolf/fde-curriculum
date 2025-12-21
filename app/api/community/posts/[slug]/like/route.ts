import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// POST /api/community/posts/[slug]/like - 좋아요 토글
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { slug },
    })

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // 기존 좋아요 확인
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId: post.id,
          userId: session.user.id,
        },
      },
    })

    let isLiked: boolean
    let likeCount: number

    if (existingLike) {
      // 좋아요 취소
      await prisma.postLike.delete({
        where: { id: existingLike.id },
      })
      await prisma.post.update({
        where: { id: post.id },
        data: { likeCount: { decrement: 1 } },
      })
      isLiked = false
      likeCount = post.likeCount - 1
    } else {
      // 좋아요 추가
      await prisma.postLike.create({
        data: {
          postId: post.id,
          userId: session.user.id,
        },
      })
      await prisma.post.update({
        where: { id: post.id },
        data: { likeCount: { increment: 1 } },
      })
      isLiked = true
      likeCount = post.likeCount + 1
    }

    return NextResponse.json({
      success: true,
      isLiked,
      likeCount,
    })
  } catch (error) {
    console.error('Like POST error:', error)
    return NextResponse.json(
      { error: '좋아요 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
