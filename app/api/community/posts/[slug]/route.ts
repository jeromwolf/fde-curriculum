import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/community/posts/[slug] - 게시글 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await auth()

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          where: { isDeleted: false, parentId: null },
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            replies: {
              where: { isDeleted: false },
              orderBy: { createdAt: 'asc' },
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
                _count: {
                  select: { likes: true },
                },
              },
            },
            _count: {
              select: { likes: true },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            bookmarks: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // 조회수 증가
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    })

    // 로그인한 사용자의 좋아요/북마크 상태 확인
    let isLiked = false
    let isBookmarked = false

    if (session?.user?.id) {
      const [like, bookmark] = await Promise.all([
        prisma.postLike.findUnique({
          where: {
            postId_userId: {
              postId: post.id,
              userId: session.user.id,
            },
          },
        }),
        prisma.bookmark.findUnique({
          where: {
            postId_userId: {
              postId: post.id,
              userId: session.user.id,
            },
          },
        }),
      ])

      isLiked = !!like
      isBookmarked = !!bookmark
    }

    return NextResponse.json({
      post: {
        ...post,
        viewCount: post.viewCount + 1, // 현재 조회 포함
      },
      isLiked,
      isBookmarked,
    })
  } catch (error) {
    console.error('Post GET error:', error)
    return NextResponse.json(
      { error: '게시글 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// PUT /api/community/posts/[slug] - 게시글 수정
export async function PUT(
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

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: '수정 권한이 없습니다' },
        { status: 403 }
      )
    }

    const { title, content, categoryId, tags } = await request.json()

    // 게시글 업데이트
    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: {
        title: title || post.title,
        content: content || post.content,
        categoryId: categoryId || post.categoryId,
        updatedAt: new Date(),
      },
    })

    // 태그 업데이트
    if (tags !== undefined) {
      // 기존 태그 삭제
      await prisma.postTag.deleteMany({
        where: { postId: post.id },
      })

      // 새 태그 추가
      for (const tagName of tags.slice(0, 5)) {
        let tag = await prisma.tag.findUnique({
          where: { name: tagName.trim().toLowerCase() },
        })

        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName.trim().toLowerCase() },
          })
        }

        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      post: updatedPost,
    })
  } catch (error) {
    console.error('Post PUT error:', error)
    return NextResponse.json(
      { error: '게시글 수정 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// DELETE /api/community/posts/[slug] - 게시글 삭제
export async function DELETE(
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

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: '삭제 권한이 없습니다' },
        { status: 403 }
      )
    }

    await prisma.post.delete({
      where: { id: post.id },
    })

    return NextResponse.json({
      success: true,
      message: '게시글이 삭제되었습니다',
    })
  } catch (error) {
    console.error('Post DELETE error:', error)
    return NextResponse.json(
      { error: '게시글 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
