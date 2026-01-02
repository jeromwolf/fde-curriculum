/**
 * Gamification Service
 * 포인트 & 뱃지 시스템 관리
 */

import prisma from '@/lib/prisma'
import { PointReason, BadgeCategory, BadgeRarity } from '@prisma/client'

// ============================================
// 포인트 설정
// ============================================

export const POINT_VALUES: Record<PointReason, number> = {
  VIDEO_COMPLETE: 10,
  READING_COMPLETE: 5,
  CODE_COMPLETE: 20,
  QUIZ_COMPLETE: 15,
  QUIZ_PERFECT: 10,      // 만점 보너스
  WEEK_COMPLETE: 50,
  PHASE_COMPLETE: 200,
  STREAK_BONUS: 5,       // 연속일 * 5
  FIRST_LOGIN: 10,
  PROFILE_COMPLETE: 20,
  POST_CREATED: 5,
  COMMENT_HELPFUL: 10,
  BADGE_EARNED: 0,       // 뱃지별로 다름
  ADMIN_ADJUST: 0,       // 가변
}

// 레벨 계산 (100포인트당 1레벨, 점진적 증가)
export function calculateLevel(totalPoints: number): number {
  // 레벨 1: 0-99, 레벨 2: 100-249, 레벨 3: 250-449, ...
  // 공식: level = floor(sqrt(points / 50)) + 1
  return Math.floor(Math.sqrt(totalPoints / 50)) + 1
}

// 다음 레벨까지 필요한 포인트
export function pointsToNextLevel(totalPoints: number): { current: number; needed: number; percentage: number } {
  const currentLevel = calculateLevel(totalPoints)
  const currentLevelPoints = (currentLevel - 1) ** 2 * 50
  const nextLevelPoints = currentLevel ** 2 * 50
  const progress = totalPoints - currentLevelPoints
  const needed = nextLevelPoints - currentLevelPoints

  return {
    current: progress,
    needed: needed,
    percentage: Math.round((progress / needed) * 100),
  }
}

// ============================================
// 포인트 관리
// ============================================

/**
 * 포인트 지급
 */
export async function awardPoints(
  userId: string,
  reason: PointReason,
  options?: {
    description?: string
    taskId?: string
    weekSlug?: string
    customPoints?: number  // ADMIN_ADJUST 등에서 사용
  }
): Promise<{ points: number; newTotal: number; levelUp: boolean; newLevel: number }> {
  const points = options?.customPoints ?? POINT_VALUES[reason]

  // 포인트 이력 추가
  await prisma.pointHistory.create({
    data: {
      userId,
      points,
      reason,
      description: options?.description,
      taskId: options?.taskId,
      weekSlug: options?.weekSlug,
    },
  })

  // UserLevel 업데이트 또는 생성
  const userLevel = await prisma.userLevel.upsert({
    where: { userId },
    update: {
      totalPoints: { increment: points },
    },
    create: {
      userId,
      totalPoints: points,
      level: 1,
    },
  })

  const newTotal = userLevel.totalPoints
  const newLevel = calculateLevel(newTotal)
  const levelUp = newLevel > userLevel.level

  // 레벨 업데이트
  if (levelUp) {
    await prisma.userLevel.update({
      where: { userId },
      data: { level: newLevel },
    })
  }

  return { points, newTotal, levelUp, newLevel }
}

/**
 * 태스크 완료 시 포인트 자동 지급
 */
export async function awardTaskPoints(
  userId: string,
  taskId: string,
  taskType: 'video' | 'reading' | 'code' | 'quiz',
  weekSlug: string,
  quizScore?: number
): Promise<{ points: number; bonusPoints: number }> {
  // 이미 지급 여부 확인
  const existing = await prisma.pointHistory.findFirst({
    where: { userId, taskId },
  })

  if (existing) {
    return { points: 0, bonusPoints: 0 }
  }

  // 기본 포인트 지급
  const reasonMap: Record<string, PointReason> = {
    video: 'VIDEO_COMPLETE',
    reading: 'READING_COMPLETE',
    code: 'CODE_COMPLETE',
    quiz: 'QUIZ_COMPLETE',
  }

  const result = await awardPoints(userId, reasonMap[taskType], {
    taskId,
    weekSlug,
    description: `${taskType} 완료: ${taskId}`,
  })

  let bonusPoints = 0

  // 퀴즈 만점 보너스
  if (taskType === 'quiz' && quizScore === 100) {
    const bonus = await awardPoints(userId, 'QUIZ_PERFECT', {
      taskId,
      weekSlug,
      description: '퀴즈 만점 달성!',
    })
    bonusPoints = bonus.points
  }

  // 연속 학습 업데이트
  await updateStreak(userId)

  // 뱃지 확인
  await checkAndAwardBadges(userId)

  return { points: result.points, bonusPoints }
}

// ============================================
// 연속 학습 (Streak) 관리
// ============================================

/**
 * 연속 학습 업데이트
 */
export async function updateStreak(userId: string): Promise<{
  currentStreak: number
  isNewDay: boolean
  bonusAwarded: number
}> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const streak = await prisma.streak.findUnique({ where: { userId } })

  if (!streak) {
    // 첫 활동
    await prisma.streak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        totalActiveDays: 1,
        lastActiveAt: today,
      },
    })
    return { currentStreak: 1, isNewDay: true, bonusAwarded: 0 }
  }

  const lastActive = new Date(streak.lastActiveAt)
  lastActive.setHours(0, 0, 0, 0)

  const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    // 같은 날 - 변화 없음
    return { currentStreak: streak.currentStreak, isNewDay: false, bonusAwarded: 0 }
  }

  let newStreak: number
  let bonusAwarded = 0

  if (diffDays === 1) {
    // 연속 유지
    newStreak = streak.currentStreak + 1

    // 연속 학습 보너스 (7일, 30일, 100일)
    if ([7, 14, 30, 60, 100].includes(newStreak)) {
      const bonus = await awardPoints(userId, 'STREAK_BONUS', {
        customPoints: newStreak * 5,
        description: `${newStreak}일 연속 학습 달성!`,
      })
      bonusAwarded = bonus.points
    }
  } else {
    // 연속 끊김
    newStreak = 1
  }

  await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(streak.longestStreak, newStreak),
      totalActiveDays: streak.totalActiveDays + 1,
      lastActiveAt: today,
    },
  })

  return { currentStreak: newStreak, isNewDay: true, bonusAwarded }
}

// ============================================
// 뱃지 시스템
// ============================================

// 기본 뱃지 정의
export const DEFAULT_BADGES = [
  // Milestone
  { code: 'first_login', name: '첫 발걸음', description: '첫 로그인 완료', category: 'MILESTONE', rarity: 'COMMON', bonusPoints: 10 },
  { code: 'first_task', name: '시작이 반', description: '첫 태스크 완료', category: 'MILESTONE', rarity: 'COMMON', bonusPoints: 10 },
  { code: 'first_week', name: '주간 정복자', description: '첫 주차 완료', category: 'MILESTONE', rarity: 'UNCOMMON', bonusPoints: 30 },
  { code: 'first_phase', name: 'Phase 마스터', description: '첫 Phase 완료', category: 'MILESTONE', rarity: 'RARE', bonusPoints: 100 },

  // Streak
  { code: 'streak_7', name: '일주일 전사', description: '7일 연속 학습', category: 'STREAK', rarity: 'UNCOMMON', bonusPoints: 35 },
  { code: 'streak_14', name: '2주의 끈기', description: '14일 연속 학습', category: 'STREAK', rarity: 'RARE', bonusPoints: 70 },
  { code: 'streak_30', name: '한 달의 헌신', description: '30일 연속 학습', category: 'STREAK', rarity: 'EPIC', bonusPoints: 150 },
  { code: 'streak_100', name: '백일의 전설', description: '100일 연속 학습', category: 'STREAK', rarity: 'LEGENDARY', bonusPoints: 500 },

  // Mastery
  { code: 'quiz_perfect', name: '완벽주의자', description: '퀴즈 만점 달성', category: 'MASTERY', rarity: 'UNCOMMON', bonusPoints: 20 },
  { code: 'quiz_master', name: '퀴즈 마스터', description: '10개 퀴즈 만점', category: 'MASTERY', rarity: 'RARE', bonusPoints: 50 },
  { code: 'code_ninja', name: '코드 닌자', description: '50개 코딩 과제 완료', category: 'MASTERY', rarity: 'EPIC', bonusPoints: 100 },

  // Community
  { code: 'first_post', name: '목소리를 내다', description: '첫 게시글 작성', category: 'COMMUNITY', rarity: 'COMMON', bonusPoints: 10 },
  { code: 'helpful', name: '도움의 손길', description: '도움이 된 댓글 10개', category: 'COMMUNITY', rarity: 'UNCOMMON', bonusPoints: 30 },

  // Special
  { code: 'early_adopter', name: '얼리 어답터', description: '베타 테스터 참여', category: 'SPECIAL', rarity: 'RARE', bonusPoints: 50 },
  { code: 'all_complete', name: 'FDE 마스터', description: '전체 커리큘럼 완료', category: 'SPECIAL', rarity: 'LEGENDARY', bonusPoints: 1000 },
]

/**
 * 뱃지 초기화 (시딩)
 */
export async function seedBadges(): Promise<void> {
  for (const badge of DEFAULT_BADGES) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: {},
      create: {
        code: badge.code,
        name: badge.name,
        description: badge.description,
        category: badge.category as BadgeCategory,
        rarity: badge.rarity as BadgeRarity,
        bonusPoints: badge.bonusPoints,
      },
    })
  }
}

/**
 * 뱃지 지급
 */
export async function awardBadge(userId: string, badgeCode: string): Promise<boolean> {
  const badge = await prisma.badge.findUnique({ where: { code: badgeCode } })
  if (!badge) return false

  // 이미 획득했는지 확인
  const existing = await prisma.userBadge.findFirst({
    where: { userId, badgeId: badge.id },
  })

  if (existing) return false

  // 뱃지 지급
  await prisma.userBadge.create({
    data: { userId, badgeId: badge.id },
  })

  // 보너스 포인트 지급
  if (badge.bonusPoints > 0) {
    await awardPoints(userId, 'BADGE_EARNED', {
      customPoints: badge.bonusPoints,
      description: `뱃지 획득: ${badge.name}`,
    })
  }

  return true
}

/**
 * 조건에 맞는 뱃지 자동 확인 및 지급
 */
export async function checkAndAwardBadges(userId: string): Promise<string[]> {
  const awarded: string[] = []

  // 사용자 통계 조회
  const [userLevel, streak, taskCount, quizPerfectCount, postCount] = await Promise.all([
    prisma.userLevel.findUnique({ where: { userId } }),
    prisma.streak.findUnique({ where: { userId } }),
    prisma.progress.count({ where: { userId, completed: true } }),
    prisma.progress.count({ where: { userId, score: 100 } }),
    prisma.post.count({ where: { authorId: userId } }),
  ])

  // Milestone 뱃지
  if (taskCount >= 1) {
    if (await awardBadge(userId, 'first_task')) awarded.push('first_task')
  }

  // Streak 뱃지
  if (streak) {
    if (streak.currentStreak >= 7) {
      if (await awardBadge(userId, 'streak_7')) awarded.push('streak_7')
    }
    if (streak.currentStreak >= 14) {
      if (await awardBadge(userId, 'streak_14')) awarded.push('streak_14')
    }
    if (streak.currentStreak >= 30) {
      if (await awardBadge(userId, 'streak_30')) awarded.push('streak_30')
    }
    if (streak.currentStreak >= 100) {
      if (await awardBadge(userId, 'streak_100')) awarded.push('streak_100')
    }
  }

  // Mastery 뱃지
  if (quizPerfectCount >= 1) {
    if (await awardBadge(userId, 'quiz_perfect')) awarded.push('quiz_perfect')
  }
  if (quizPerfectCount >= 10) {
    if (await awardBadge(userId, 'quiz_master')) awarded.push('quiz_master')
  }

  // Community 뱃지
  if (postCount >= 1) {
    if (await awardBadge(userId, 'first_post')) awarded.push('first_post')
  }

  return awarded
}

// ============================================
// 리더보드
// ============================================

export interface LeaderboardEntry {
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

/**
 * 리더보드 조회
 */
export async function getLeaderboard(
  options?: {
    limit?: number
    offset?: number
    period?: 'all' | 'month' | 'week'
  }
): Promise<{ entries: LeaderboardEntry[]; total: number }> {
  const limit = options?.limit ?? 50
  const offset = options?.offset ?? 0

  // 전체 기간 리더보드
  const userLevels = await prisma.userLevel.findMany({
    orderBy: { totalPoints: 'desc' },
    take: limit,
    skip: offset,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          badges: {
            include: { badge: true },
            orderBy: { earnedAt: 'desc' },
            take: 5,
          },
          streak: true,
        },
      },
    },
  })

  const total = await prisma.userLevel.count()

  const entries: LeaderboardEntry[] = userLevels.map((ul, index) => ({
    rank: offset + index + 1,
    userId: ul.userId,
    userName: ul.user.name ?? '익명',
    userImage: ul.user.image,
    totalPoints: ul.totalPoints,
    level: ul.level,
    tasksCompleted: ul.tasksCompleted,
    currentStreak: ul.user.streak?.currentStreak ?? 0,
    badges: ul.user.badges.map((ub) => ({
      code: ub.badge.code,
      name: ub.badge.name,
      rarity: ub.badge.rarity,
    })),
  }))

  return { entries, total }
}

/**
 * 사용자 순위 조회
 */
export async function getUserRank(userId: string): Promise<{
  rank: number
  totalUsers: number
  percentile: number
} | null> {
  const userLevel = await prisma.userLevel.findUnique({
    where: { userId },
  })

  if (!userLevel) return null

  const higherCount = await prisma.userLevel.count({
    where: { totalPoints: { gt: userLevel.totalPoints } },
  })

  const total = await prisma.userLevel.count()
  const rank = higherCount + 1
  const percentile = Math.round((1 - rank / total) * 100)

  return { rank, totalUsers: total, percentile }
}

/**
 * 사용자 게이미피케이션 프로필 조회
 */
export async function getUserGamificationProfile(userId: string) {
  const [userLevel, streak, badges, recentPoints] = await Promise.all([
    prisma.userLevel.findUnique({ where: { userId } }),
    prisma.streak.findUnique({ where: { userId } }),
    prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    }),
    prisma.pointHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  const rank = await getUserRank(userId)
  const nextLevel = userLevel ? pointsToNextLevel(userLevel.totalPoints) : null

  return {
    level: userLevel?.level ?? 1,
    totalPoints: userLevel?.totalPoints ?? 0,
    rank: rank?.rank ?? null,
    percentile: rank?.percentile ?? null,
    nextLevel,
    streak: {
      current: streak?.currentStreak ?? 0,
      longest: streak?.longestStreak ?? 0,
      totalDays: streak?.totalActiveDays ?? 0,
    },
    badges: badges.map((ub) => ({
      ...ub.badge,
      earnedAt: ub.earnedAt,
    })),
    recentPoints,
  }
}
