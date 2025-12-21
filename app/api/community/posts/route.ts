import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/community/posts - 게시글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    const tag = searchParams.get('tag') || ''

    const skip = (page - 1) * limit

    // 조건 빌드
    const where: any = {
      isPublished: true,
    }

    if (category) {
      where.category = { name: category }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (tag) {
      where.tags = {
        some: {
          tag: { name: tag },
        },
      }
    }

    // 전체 수 조회
    const total = await prisma.post.count({ where })

    // 게시글 목록 조회
    const posts = await prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            displayName: true,
            color: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
          take: 5,
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Posts GET error:', error)
    return NextResponse.json(
      { error: '게시글 목록 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// POST /api/community/posts - 게시글 작성
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const { title, content, categoryId, tags } = await request.json()

    // 유효성 검사
    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: '제목, 내용, 카테고리는 필수입니다' },
        { status: 400 }
      )
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: '제목은 200자 이내로 작성해주세요' },
        { status: 400 }
      )
    }

    // 슬러그 생성
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50)
    const slug = `${baseSlug}-${Date.now()}`

    // 게시글 생성
    const post = await prisma.post.create({
      data: {
        authorId: session.user.id,
        categoryId,
        title,
        content,
        slug,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
      },
    })

    // 태그 처리
    if (tags && tags.length > 0) {
      for (const tagName of tags.slice(0, 5)) {
        // 태그가 존재하는지 확인, 없으면 생성
        let tag = await prisma.tag.findUnique({
          where: { name: tagName.trim().toLowerCase() },
        })

        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName.trim().toLowerCase() },
          })
        }

        // PostTag 생성
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
      post,
    })
  } catch (error) {
    console.error('Posts POST error:', error)
    return NextResponse.json(
      { error: '게시글 작성 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
