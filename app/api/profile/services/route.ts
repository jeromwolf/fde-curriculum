import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/profile/services - 내 서비스 목록 조회
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
        services: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    return NextResponse.json({
      services: profile?.services || [],
    })
  } catch (error) {
    console.error('Services GET error:', error)
    return NextResponse.json(
      { error: '서비스 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// POST /api/profile/services - 새 서비스 추가
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { name, description, url, logoUrl, status } = data

    if (!name) {
      return NextResponse.json(
        { error: '서비스 이름은 필수입니다' },
        { status: 400 }
      )
    }

    // 프로필이 없으면 먼저 생성
    let profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: session.user.id,
        },
      })
    }

    const service = await prisma.service.create({
      data: {
        profileId: profile.id,
        name,
        description: description || null,
        url: url || null,
        logoUrl: logoUrl || null,
        status: status || 'ACTIVE',
      },
    })

    return NextResponse.json({
      success: true,
      service,
    })
  } catch (error) {
    console.error('Services POST error:', error)
    return NextResponse.json(
      { error: '서비스 추가 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// PUT /api/profile/services - 서비스 수정
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
    const { id, name, description, url, logoUrl, status } = data

    if (!id) {
      return NextResponse.json(
        { error: '서비스 ID가 필요합니다' },
        { status: 400 }
      )
    }

    // 본인 소유 확인
    const existingService = await prisma.service.findFirst({
      where: {
        id,
        profile: {
          userId: session.user.id,
        },
      },
    })

    if (!existingService) {
      return NextResponse.json(
        { error: '서비스를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        description: description || null,
        url: url || null,
        logoUrl: logoUrl || null,
        status: status || 'ACTIVE',
      },
    })

    return NextResponse.json({
      success: true,
      service,
    })
  } catch (error) {
    console.error('Services PUT error:', error)
    return NextResponse.json(
      { error: '서비스 수정 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// DELETE /api/profile/services - 서비스 삭제
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: '서비스 ID가 필요합니다' },
        { status: 400 }
      )
    }

    // 본인 소유 확인
    const existingService = await prisma.service.findFirst({
      where: {
        id,
        profile: {
          userId: session.user.id,
        },
      },
    })

    if (!existingService) {
      return NextResponse.json(
        { error: '서비스를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    await prisma.service.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Services DELETE error:', error)
    return NextResponse.json(
      { error: '서비스 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
