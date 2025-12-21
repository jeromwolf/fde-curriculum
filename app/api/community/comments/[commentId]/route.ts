import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// PUT /api/community/comments/[commentId] - 댓글 수정
export async function PUT(
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

    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: '수정 권한이 없습니다' },
        { status: 403 }
      )
    }

    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: '댓글 내용을 입력해주세요' },
        { status: 400 }
      )
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      comment: updatedComment,
    })
  } catch (error) {
    console.error('Comment PUT error:', error)
    return NextResponse.json(
      { error: '댓글 수정 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// DELETE /api/community/comments/[commentId] - 댓글 삭제 (소프트 삭제)
export async function DELETE(
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
      include: { post: true },
    })

    if (!comment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: '삭제 권한이 없습니다' },
        { status: 403 }
      )
    }

    // 소프트 삭제
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        isDeleted: true,
        content: '삭제된 댓글입니다.',
        updatedAt: new Date(),
      },
    })

    // 댓글 수 감소
    await prisma.post.update({
      where: { id: comment.postId },
      data: { commentCount: { decrement: 1 } },
    })

    return NextResponse.json({
      success: true,
      message: '댓글이 삭제되었습니다',
    })
  } catch (error) {
    console.error('Comment DELETE error:', error)
    return NextResponse.json(
      { error: '댓글 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
