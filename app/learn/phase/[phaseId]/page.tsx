'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getWeeksByPhase, formatDuration } from '@/lib/curriculum'
import { Navigation, Footer } from '@/components/learn'

// Phase 정보 (정적 데이터)
const phaseInfo: Record<number, {
  title: string
  description: string
  duration: string
  color: string
  gradient: string
}> = {
  1: {
    title: '데이터 엔지니어링 기초',
    description: 'Python, SQL, Spark, Airflow를 활용한 데이터 파이프라인 구축',
    duration: '2개월',
    color: '#3B82F6',
    gradient: 'from-blue-600 to-blue-700'
  },
  2: {
    title: '데이터 분석 & 컨설팅',
    description: 'EDA, Feature Engineering, ML 모델링, 비즈니스 커뮤니케이션',
    duration: '2개월',
    color: '#14B8A6',
    gradient: 'from-teal-500 to-teal-600'
  },
  3: {
    title: 'Knowledge Graph & 온톨로지',
    description: 'Neo4j, Cypher, RDF/OWL, Knowledge Graph 구축',
    duration: '2개월',
    color: '#8B5CF6',
    gradient: 'from-purple-600 to-purple-700'
  },
  4: {
    title: '클라우드 & MLOps',
    description: 'AWS/GCP, Kubernetes, ML 파이프라인, 모니터링',
    duration: '2개월',
    color: '#F97316',
    gradient: 'from-orange-500 to-orange-600'
  },
  5: {
    title: 'GenAI & LLM',
    description: 'LangChain, RAG, Vector DB, LLM 애플리케이션',
    duration: '2개월',
    color: '#EF4444',
    gradient: 'from-red-500 to-red-600'
  },
  6: {
    title: '도메인 특화 & 캡스톤',
    description: '금융/헬스케어/공급망 도메인, 최종 포트폴리오',
    duration: '2개월',
    color: '#6B7280',
    gradient: 'from-gray-600 to-gray-700'
  }
}

export default function PhaseMainPage() {
  const params = useParams()
  const phaseId = parseInt(params.phaseId as string)

  const phase = phaseInfo[phaseId]
  const weeks = getWeeksByPhase(phaseId)

  if (!phase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Phase를 찾을 수 없습니다</h1>
          <Link href="/curriculum" className="text-blue-600 hover:text-blue-700">
            ← 전체 커리큘럼 보기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${phase.gradient} text-white`}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link
            href="/curriculum"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            전체 커리큘럼
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              Phase {phaseId}
            </span>
            <span className="text-white/80 text-sm">{phase.duration}</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{phase.title}</h1>
          <p className="text-xl text-white/90 max-w-2xl">{phase.description}</p>

          {weeks.length > 0 && (
            <div className="mt-8 flex items-center gap-6">
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold">{weeks.length}</span>
                <span className="text-white/80 ml-2">코스</span>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold">
                  {formatDuration(weeks.reduce((acc, w) => acc + w.totalDuration, 0))}
                </span>
                <span className="text-white/80 ml-2">총 학습 시간</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Week Cards */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {weeks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">준비 중입니다</h2>
            <p className="text-gray-600 mb-8">
              Phase {phaseId} 콘텐츠가 곧 추가될 예정입니다.
            </p>
            <Link
              href="/curriculum"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              전체 커리큘럼 보기
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">학습 코스</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weeks.map((week, index) => {
                const moduleCount = week.days?.length || 0
                const taskCount = week.days?.reduce((acc, d) =>
                  acc + d.tasks.length + (d.challenge ? 1 : 0), 0
                ) || 0

                return (
                  <Link
                    key={week.slug}
                    href={`/learn/week/${week.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
                  >
                    {/* Card Header */}
                    <div
                      className="h-2"
                      style={{ backgroundColor: phase.color }}
                    />

                    <div className="p-6">
                      {/* Week Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium text-white"
                          style={{ backgroundColor: phase.color }}
                        >
                          Week {index + 1}
                        </span>
                        {week.access === 'free' && (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                            무료
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {week.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {week.practice}
                      </p>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {week.topics.slice(0, 3).map((topic, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                        {week.topics.length > 3 && (
                          <span className="text-gray-400 text-xs">
                            +{week.topics.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span>{moduleCount} 모듈</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>{taskCount} 레슨</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatDuration(week.totalDuration)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* Coming Soon Placeholder for empty phases */}
        {weeks.length > 0 && weeks.length < 4 && (
          <div className="mt-8 p-6 border-2 border-dashed border-gray-200 rounded-xl text-center">
            <p className="text-gray-500">
              더 많은 코스가 곧 추가됩니다
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
