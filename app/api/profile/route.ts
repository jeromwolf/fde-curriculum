import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/profile - 내 프로필 조회
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
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
            email: true,
            image: true,
            accessLevel: true,
            createdAt: true,
          },
        },
      },
    })

    if (!profile) {
      // 프로필이 없으면 빈 프로필 반환
      return NextResponse.json({
        profile: null,
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        },
      })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { error: '프로필 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// PUT /api/profile - 프로필 수정
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      bio,
      jobTitle,
      company,
      yearsOfExp,
      isOpenToCollab,
      interests,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      blogUrl,
    } = data

    // 프로필 업데이트 또는 생성
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        bio,
        jobTitle,
        company,
        yearsOfExp: yearsOfExp ? parseInt(yearsOfExp) : null,
        isOpenToCollab: isOpenToCollab ?? false,
        interests: interests || [],
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        blogUrl,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        bio,
        jobTitle,
        company,
        yearsOfExp: yearsOfExp ? parseInt(yearsOfExp) : null,
        isOpenToCollab: isOpenToCollab ?? false,
        interests: interests || [],
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        blogUrl,
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    })

    // 이름 업데이트 (User 테이블)
    if (data.name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: data.name },
      })
    }

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json(
      { error: '프로필 수정 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
