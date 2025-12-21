import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// POST /api/community/posts/[slug]/comments - 댓글 작성
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

    if (post.isLocked) {
      return NextResponse.json(
        { error: '댓글이 잠긴 게시글입니다' },
        { status: 403 }
      )
    }

    const { content, parentId } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: '댓글 내용을 입력해주세요' },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: '댓글은 2000자 이내로 작성해주세요' },
        { status: 400 }
      )
    }

    // 대댓글인 경우 부모 댓글 확인
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      })

      if (!parentComment || parentComment.postId !== post.id) {
        return NextResponse.json(
          { error: '부모 댓글을 찾을 수 없습니다' },
          { status: 404 }
        )
      }
    }

    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        postId: post.id,
        authorId: session.user.id,
        content: content.trim(),
        parentId: parentId || null,
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

    // 댓글 수 증가
    await prisma.post.update({
      where: { id: post.id },
      data: { commentCount: { increment: 1 } },
    })

    // 멘션 처리 (@username)
    const mentionRegex = /@(\w+)/g
    const mentions = content.match(mentionRegex)

    if (mentions) {
      for (const mention of mentions) {
        const username = mention.slice(1)
        const mentionedUser = await prisma.user.findFirst({
          where: { name: { equals: username, mode: 'insensitive' } },
        })

        if (mentionedUser && mentionedUser.id !== session.user.id) {
          await prisma.mention.create({
            data: {
              mentionedId: mentionedUser.id,
              mentionerId: session.user.id,
              postId: post.id,
              commentId: comment.id,
            },
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      comment,
    })
  } catch (error) {
    console.error('Comment POST error:', error)
    return NextResponse.json(
      { error: '댓글 작성 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
