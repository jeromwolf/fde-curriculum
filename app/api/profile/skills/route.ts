import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/profile/skills - 스킬 목록 조회
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json({ skills })
  } catch (error) {
    console.error('Skills GET error:', error)
    return NextResponse.json(
      { error: '스킬 목록 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// POST /api/profile/skills - 사용자 스킬 추가/수정
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const { skills } = await request.json()

    // 프로필 확인 또는 생성
    let profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      profile = await prisma.profile.create({
        data: { userId: session.user.id },
      })
    }

    // 기존 스킬 삭제
    await prisma.userSkill.deleteMany({
      where: { profileId: profile.id },
    })

    // 새 스킬 추가
    if (skills && skills.length > 0) {
      for (const skill of skills) {
        // 스킬이 존재하는지 확인, 없으면 생성
        let skillRecord = await prisma.skill.findUnique({
          where: { name: skill.name },
        })

        if (!skillRecord) {
          skillRecord = await prisma.skill.create({
            data: {
              name: skill.name,
              category: skill.category || 'Other',
            },
          })
        }

        // UserSkill 생성
        await prisma.userSkill.create({
          data: {
            profileId: profile.id,
            skillId: skillRecord.id,
            level: skill.level || 'BEGINNER',
          },
        })
      }
    }

    // 업데이트된 프로필 조회
    const updatedProfile = await prisma.profile.findUnique({
      where: { id: profile.id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    })
  } catch (error) {
    console.error('Skills POST error:', error)
    return NextResponse.json(
      { error: '스킬 수정 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
