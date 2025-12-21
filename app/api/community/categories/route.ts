import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/community/categories - 카테고리 목록 조회
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Categories GET error:', error)
    return NextResponse.json(
      { error: '카테고리 목록 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
