import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// POST /api/community/posts/[slug]/bookmark - 북마크 토글
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

    // 기존 북마크 확인
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        postId_userId: {
          postId: post.id,
          userId: session.user.id,
        },
      },
    })

    let isBookmarked: boolean

    if (existingBookmark) {
      // 북마크 취소
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      })
      isBookmarked = false
    } else {
      // 북마크 추가
      await prisma.bookmark.create({
        data: {
          postId: post.id,
          userId: session.user.id,
        },
      })
      isBookmarked = true
    }

    return NextResponse.json({
      success: true,
      isBookmarked,
    })
  } catch (error) {
    console.error('Bookmark POST error:', error)
    return NextResponse.json(
      { error: '북마크 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
