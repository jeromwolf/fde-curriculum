import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getUserGamificationProfile, getUserRank } from '@/lib/services/gamification'

/**
 * GET /api/user/gamification
 * 현재 사용자의 게이미피케이션 프로필 조회
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const profile = await getUserGamificationProfile(session.user.id)

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error('User gamification error:', error)
    return NextResponse.json(
      { success: false, error: '프로필을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
