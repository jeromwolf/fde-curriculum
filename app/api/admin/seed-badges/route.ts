import { NextResponse } from 'next/server'
import { seedBadges } from '@/lib/services/gamification'

/**
 * POST /api/admin/seed-badges
 * 뱃지 초기 데이터 시딩 (관리자 전용)
 */
export async function POST() {
  try {
    // TODO: 관리자 권한 확인 추가
    await seedBadges()

    return NextResponse.json({
      success: true,
      message: '뱃지 시딩 완료',
    })
  } catch (error) {
    console.error('Seed badges error:', error)
    return NextResponse.json(
      { success: false, error: '뱃지 시딩 실패' },
      { status: 500 }
    )
  }
}
