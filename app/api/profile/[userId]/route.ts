import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/profile/[userId] - 특정 사용자 프로필 조회 (공개)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            accessLevel: true,
            createdAt: true,
            // email은 공개하지 않음
          },
        },
      },
    })

    if (!profile) {
      // 프로필이 없어도 사용자 정보만 반환
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          image: true,
          accessLevel: true,
          createdAt: true,
        },
      })

      if (!user) {
        return NextResponse.json(
          { error: '사용자를 찾을 수 없습니다' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        profile: null,
        user,
      })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile [userId] GET error:', error)
    return NextResponse.json(
      { error: '프로필 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
