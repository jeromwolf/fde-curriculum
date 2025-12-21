import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/members - 회원 목록 조회 (리멤버형)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const skill = searchParams.get('skill') || ''
    const isOpenToCollab = searchParams.get('openToCollab') === 'true'
    const roleType = searchParams.get('roleType') || ''
    const lookingFor = searchParams.get('lookingFor') || ''
    const canOffer = searchParams.get('canOffer') || ''

    const skip = (page - 1) * limit

    // 기본 조건
    const whereClause: any = {
      // 프로필이 있는 사용자만 표시
      profile: {
        isNot: null,
      },
    }

    // 검색 조건 (확장: headline, location, industry 추가)
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { profile: { headline: { contains: search, mode: 'insensitive' } } },
        { profile: { jobTitle: { contains: search, mode: 'insensitive' } } },
        { profile: { company: { contains: search, mode: 'insensitive' } } },
        { profile: { bio: { contains: search, mode: 'insensitive' } } },
        { profile: { location: { contains: search, mode: 'insensitive' } } },
        { profile: { industry: { contains: search, mode: 'insensitive' } } },
      ]
    }

    // 협업 가능 필터
    if (isOpenToCollab) {
      whereClause.profile = {
        ...whereClause.profile,
        isOpenToCollab: true,
      }
    }

    // 역할 유형 필터
    if (roleType) {
      whereClause.profile = {
        ...whereClause.profile,
        roleType: roleType,
      }
    }

    // 찾는 것 필터 (배열에 포함)
    if (lookingFor) {
      whereClause.profile = {
        ...whereClause.profile,
        lookingFor: { has: lookingFor },
      }
    }

    // 제공 가능 필터 (배열에 포함)
    if (canOffer) {
      whereClause.profile = {
        ...whereClause.profile,
        canOffer: { has: canOffer },
      }
    }

    // 스킬 필터
    if (skill) {
      whereClause.profile = {
        ...whereClause.profile,
        skills: {
          some: {
            skill: {
              name: { equals: skill, mode: 'insensitive' },
            },
          },
        },
      }
    }

    // 전체 수 조회
    const total = await prisma.user.count({
      where: whereClause,
    })

    // 회원 목록 조회
    const members = await prisma.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: [
        { profile: { isOpenToCollab: 'desc' } },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        image: true,
        accessLevel: true,
        createdAt: true,
        profile: {
          select: {
            headline: true,
            bio: true,
            roleType: true,
            jobTitle: true,
            company: true,
            location: true,
            industry: true,
            yearsOfExp: true,
            isOpenToCollab: true,
            lookingFor: true,
            canOffer: true,
            interests: true,
            githubUrl: true,
            linkedinUrl: true,
            skills: {
              include: {
                skill: true,
              },
              take: 5, // 상위 5개 스킬만
            },
            services: {
              where: { status: 'ACTIVE' },
              take: 2,
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
          },
        },
      },
    })

    // 인기 스킬 목록 (필터용)
    const popularSkills = await prisma.skill.findMany({
      orderBy: {
        users: {
          _count: 'desc',
        },
      },
      take: 20,
      select: {
        id: true,
        name: true,
        category: true,
        _count: {
          select: { users: true },
        },
      },
    })

    return NextResponse.json({
      members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      popularSkills,
    })
  } catch (error) {
    console.error('Members GET error:', error)
    return NextResponse.json(
      { error: '회원 목록 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
