'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  userImage: string | null
  totalPoints: number
  level: number
  tasksCompleted: number
  currentStreak: number
  badges: { code: string; name: string; rarity: string }[]
}

interface UserProfile {
  level: number
  totalPoints: number
  rank: number | null
  percentile: number | null
  nextLevel: { current: number; needed: number; percentage: number } | null
  streak: { current: number; longest: number; totalDays: number }
  badges: any[]
  recentPoints: any[]
}

// 뱃지 희귀도 색상
const RARITY_COLORS: Record<string, string> = {
  COMMON: 'bg-gray-100 text-gray-600 border-gray-300',
  UNCOMMON: 'bg-green-100 text-green-700 border-green-300',
  RARE: 'bg-blue-100 text-blue-700 border-blue-300',
  EPIC: 'bg-purple-100 text-purple-700 border-purple-300',
  LEGENDARY: 'bg-yellow-100 text-yellow-700 border-yellow-400',
}

// 순위 색상
const RANK_STYLES: Record<number, string> = {
  1: 'bg-yellow-400 text-yellow-900',
  2: 'bg-gray-300 text-gray-700',
  3: 'bg-orange-400 text-orange-900',
}

export default function LeaderboardPage() {
  const { data: session } = useSession()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // 리더보드 조회
        const leaderboardRes = await fetch('/api/leaderboard?limit=50')
        const leaderboardData = await leaderboardRes.json()
        if (leaderboardData.success) {
          setEntries(leaderboardData.data.entries)
          setTotal(leaderboardData.data.total)
        }

        // 내 프로필 조회 (로그인된 경우)
        if (session?.user) {
          const profileRes = await fetch('/api/user/gamification')
          const profileData = await profileRes.json()
          if (profileData.success) {
            setMyProfile(profileData.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h1 className="text-xl font-bold text-gray-800">리더보드</h1>
          </Link>
          <Link
            href="/learn"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← 학습으로 돌아가기
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* My Stats Card (로그인된 경우) */}
        {myProfile && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-indigo-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">내 현황</h2>
              <div className="flex items-center gap-2">
                {myProfile.rank && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    전체 {myProfile.rank}위
                  </span>
                )}
                {myProfile.percentile !== null && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    상위 {100 - myProfile.percentile}%
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Level */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="text-3xl font-bold">Lv.{myProfile.level}</div>
                <div className="text-indigo-200 text-sm">레벨</div>
                {myProfile.nextLevel && (
                  <div className="mt-2">
                    <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all"
                        style={{ width: `${myProfile.nextLevel.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-indigo-200 mt-1">
                      {myProfile.nextLevel.current} / {myProfile.nextLevel.needed}
                    </div>
                  </div>
                )}
              </div>

              {/* Total Points */}
              <div className="bg-white border-2 border-yellow-200 rounded-xl p-4">
                <div className="text-3xl font-bold text-yellow-600">
                  {myProfile.totalPoints.toLocaleString()}
                </div>
                <div className="text-gray-500 text-sm">총 포인트</div>
              </div>

              {/* Streak */}
              <div className="bg-white border-2 border-orange-200 rounded-xl p-4">
                <div className="text-3xl font-bold text-orange-500">
                  🔥 {myProfile.streak.current}일
                </div>
                <div className="text-gray-500 text-sm">
                  연속 학습 (최장 {myProfile.streak.longest}일)
                </div>
              </div>

              {/* Badges */}
              <div className="bg-white border-2 border-purple-200 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-600">
                  {myProfile.badges.length}개
                </div>
                <div className="text-gray-500 text-sm">획득 뱃지</div>
              </div>
            </div>

            {/* My Badges */}
            {myProfile.badges.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">획득한 뱃지</h3>
                <div className="flex flex-wrap gap-2">
                  {myProfile.badges.slice(0, 10).map((badge: any) => (
                    <span
                      key={badge.code}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${RARITY_COLORS[badge.rarity]}`}
                      title={badge.description}
                    >
                      {badge.name}
                    </span>
                  ))}
                  {myProfile.badges.length > 10 && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      +{myProfile.badges.length - 10}개 더
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b bg-gradient-to-r from-indigo-500 to-purple-600">
            <h2 className="text-xl font-bold text-white">전체 순위</h2>
            <p className="text-indigo-200 text-sm mt-1">총 {total}명의 학습자</p>
          </div>

          {entries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="text-4xl mb-4">🏆</div>
              <p>아직 리더보드에 등록된 학습자가 없습니다.</p>
              <p className="text-sm mt-2">학습을 시작하고 첫 번째 랭커가 되어보세요!</p>
            </div>
          ) : (
            <div className="divide-y">
              {entries.map((entry) => (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                    session?.user?.id === entry.userId ? 'bg-indigo-50' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="w-12 flex-shrink-0">
                    {entry.rank <= 3 ? (
                      <span
                        className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${
                          RANK_STYLES[entry.rank]
                        }`}
                      >
                        {entry.rank}
                      </span>
                    ) : (
                      <span className="w-10 h-10 flex items-center justify-center text-gray-500 font-medium">
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {entry.userImage ? (
                      <Image
                        src={entry.userImage}
                        alt={entry.userName}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {entry.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {entry.userName}
                        {session?.user?.id === entry.userId && (
                          <span className="ml-2 text-xs text-indigo-600">(나)</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Lv.{entry.level} · {entry.tasksCompleted}개 완료
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                    {entry.badges.slice(0, 3).map((badge) => (
                      <span
                        key={badge.code}
                        className={`px-2 py-0.5 rounded text-xs font-medium border ${RARITY_COLORS[badge.rarity]}`}
                        title={badge.name}
                      >
                        {badge.name}
                      </span>
                    ))}
                    {entry.badges.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{entry.badges.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Streak */}
                  <div className="w-20 text-center flex-shrink-0 hidden sm:block">
                    {entry.currentStreak > 0 && (
                      <span className="text-orange-500 font-medium">
                        🔥 {entry.currentStreak}
                      </span>
                    )}
                  </div>

                  {/* Points */}
                  <div className="w-24 text-right flex-shrink-0">
                    <div className="font-bold text-indigo-600">
                      {entry.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">포인트</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Point System Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">포인트 획득 방법</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="font-bold text-blue-600">📺 비디오 시청</div>
              <div className="text-blue-500">+10 포인트</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="font-bold text-green-600">📖 읽기 자료</div>
              <div className="text-green-500">+5 포인트</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="font-bold text-purple-600">💻 코딩 과제</div>
              <div className="text-purple-500">+20 포인트</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="font-bold text-orange-600">❓ 퀴즈 완료</div>
              <div className="text-orange-500">+15 포인트</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="font-bold text-yellow-600">💯 퀴즈 만점</div>
              <div className="text-yellow-500">+10 보너스</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3">
              <div className="font-bold text-indigo-600">📅 주간 완료</div>
              <div className="text-indigo-500">+50 포인트</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-3">
              <div className="font-bold text-pink-600">🎯 Phase 완료</div>
              <div className="text-pink-500">+200 포인트</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="font-bold text-red-600">🔥 연속 학습</div>
              <div className="text-red-500">일수 x 5 포인트</div>
            </div>
          </div>
        </div>

        {/* Badge Rarity Legend */}
        <div className="mt-4 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">뱃지 등급</h2>
          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${RARITY_COLORS.COMMON}`}>
              일반
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${RARITY_COLORS.UNCOMMON}`}>
              비일반
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${RARITY_COLORS.RARE}`}>
              희귀
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${RARITY_COLORS.EPIC}`}>
              영웅
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${RARITY_COLORS.LEGENDARY}`}>
              전설
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
