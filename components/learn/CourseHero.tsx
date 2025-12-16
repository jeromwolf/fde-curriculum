'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Week, formatDuration } from '@/lib/curriculum'
import { ClockIcon, BookmarkIcon, ChevronRightIcon } from './Icons'
import { getPhaseColors } from './constants'

interface CourseHeroProps {
  week: Week
  firstTaskId: string
  progress: number
  completedTasks: number
  totalTasks: number
}

export function CourseHero({
  week,
  firstTaskId,
  progress,
  completedTasks,
  totalTasks
}: CourseHeroProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const colors = getPhaseColors(week.phase)

  return (
    <section className="border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/curriculum" className="hover:text-gray-900">Courses</Link>
          <ChevronRightIcon />
          <span style={{ color: colors.primary }}>Phase {week.phase}</span>
          <ChevronRightIcon />
          <span className="text-gray-900">Week {week.week}</span>
        </div>

        {/* Title & Meta */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {week.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: colors.light, color: colors.text }}
          >
            <ClockIcon />
            {formatDuration(week.totalDuration)}
          </span>
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: colors.light, color: colors.text }}
          >
            Phase {week.phase} · Week {week.week}
          </span>
        </div>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 max-w-3xl leading-relaxed">
          {week.topics.join(', ')}을(를) 학습합니다.
          실습을 통해 <strong>{week.practice}</strong>을 완성합니다.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href={`/learn/task/${firstTaskId}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: colors.primary }}
          >
            {progress > 0 ? '이어서 학습하기' : '학습 시작하기'}
            <ChevronRightIcon />
          </Link>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
          >
            <BookmarkIcon filled={isFavorite} />
            {isFavorite ? '저장됨' : '저장하기'}
          </button>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mt-8 max-w-md">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">진행률</span>
              <span className="font-medium text-gray-900">{completedTasks}/{totalTasks} 완료</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: colors.primary }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
