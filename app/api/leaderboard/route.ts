import { NextRequest, NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/services/gamification'

/**
 * GET /api/leaderboard
 * 리더보드 조회
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') ?? '50')
    const offset = parseInt(searchParams.get('offset') ?? '0')
    const period = (searchParams.get('period') ?? 'all') as 'all' | 'month' | 'week'

    const { entries, total } = await getLeaderboard({ limit, offset, period })

    return NextResponse.json({
      success: true,
      data: {
        entries,
        total,
        limit,
        offset,
        hasMore: offset + entries.length < total,
      },
    })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json(
      { success: false, error: '리더보드를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
