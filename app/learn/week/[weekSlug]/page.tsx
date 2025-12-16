'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getWeekBySlug, curriculum } from '@/lib/curriculum'
import { useProgress } from '@/lib/useProgress'
import {
  Navigation,
  CourseHero,
  LearningObjectives,
  CourseModules,
  CourseSidebar,
  RelatedCourses,
  Footer
} from '@/components/learn'

export default function CourseDetailPage() {
  const params = useParams()
  const courseSlug = params.weekSlug as string

  const courseData = getWeekBySlug(courseSlug)
  const { isTaskComplete, getWeekProgress } = useProgress(courseSlug)

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">코스를 찾을 수 없습니다</h1>
          <Link href="/curriculum" className="text-blue-600 hover:text-blue-700">
            ← 전체 코스 보기
          </Link>
        </div>
      </div>
    )
  }

  // modules = days (하위 호환성)
  const modules = courseData.days || []

  // 모듈이 없으면 에러 페이지
  if (modules.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">코스 콘텐츠를 불러올 수 없습니다</h1>
          <Link href="/curriculum" className="text-blue-600 hover:text-blue-700">
            ← 전체 코스 보기
          </Link>
        </div>
      </div>
    )
  }

  // 첫 번째 태스크 ID (안전 접근)
  const firstTaskId = modules[0]?.tasks?.[0]?.id || ''

  // 전체 진행률 계산
  const allTaskIds = modules.flatMap(m => [
    ...m.tasks.map(t => t.id),
    ...(m.challenge ? [m.challenge.id] : [])
  ])
  const { completed: completedTasks, total: totalTasks, percent: progress } = getWeekProgress(allTaskIds)

  // 콘텐츠 타입별 카운트
  const contentCounts = modules.reduce((acc, module) => {
    module.tasks.forEach(task => {
      acc[task.type] = (acc[task.type] || 0) + 1
    })
    if (module.challenge) acc.challenge = (acc.challenge || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // 관련 코스 (같은 Phase의 다른 코스)
  const relatedCourses = curriculum.filter(c => c.phase === courseData.phase && c.slug !== courseData.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <CourseHero
        week={courseData}
        firstTaskId={firstTaskId}
        progress={progress}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Course Details */}
          <div className="lg:col-span-2 space-y-12">
            <LearningObjectives
              topics={courseData.topics}
              phase={courseData.phase}
            />

            <CourseModules
              modules={modules}
              phase={courseData.phase}
              isTaskComplete={isTaskComplete}
              getModuleProgress={getWeekProgress}
            />
          </div>

          {/* Right Column - Sidebar */}
          <CourseSidebar
            phase={courseData.phase}
            practice={courseData.practice}
            contentCounts={contentCounts}
          />
        </div>

        <RelatedCourses courses={relatedCourses} />
      </div>

      <Footer />
    </div>
  )
}
