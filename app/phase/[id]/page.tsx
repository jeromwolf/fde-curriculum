import Link from 'next/link'
import { getWeeksByPhase, formatDuration } from '@/lib/curriculum'

const phaseInfo: Record<string, { title: string; color: string; description: string }> = {
  '1': {
    title: '데이터 엔지니어링 기초',
    color: 'blue',
    description: 'Python, SQL, Spark, Airflow를 활용한 데이터 파이프라인 구축'
  },
  '2': {
    title: '데이터 분석 & 컨설팅',
    color: 'teal',
    description: 'ML 기반 데이터 분석과 비즈니스 인사이트 도출'
  },
  '3': {
    title: '지식 그래프',
    color: 'purple',
    description: 'Neo4j 기반 Knowledge Graph 구축과 GraphRAG'
  },
  '4': {
    title: '클라우드 & DevOps',
    color: 'green',
    description: 'AWS, Terraform, Kubernetes, CI/CD 파이프라인'
  },
  '5': {
    title: 'Generative AI',
    color: 'orange',
    description: 'LLM 활용, RAG 시스템, AI 에이전트 개발'
  },
  '6': {
    title: '산업별 프로젝트 & 취업',
    color: 'red',
    description: '도메인별 실전 프로젝트와 취업 준비'
  },
  '7': {
    title: 'Palantir Foundry 스페셜',
    color: 'indigo',
    description: 'Foundry 플랫폼 마스터 및 자격증 취득 (2개월 집중 과정)'
  },
}

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
  ]
}

export default async function PhasePage({ params }: { params: { id: string } }) {
  const { id } = params
  const info = phaseInfo[id]
  const phaseNum = parseInt(id)

  if (!info) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Phase를 찾을 수 없습니다</h1>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  // Phase에 해당하는 모든 Week 가져오기
  const weeks = getWeeksByPhase(phaseNum)

  const colorClasses: Record<string, { gradient: string; bg: string; text: string; border: string }> = {
    blue: { gradient: 'from-blue-600 to-blue-700', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    teal: { gradient: 'from-teal-600 to-teal-700', bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
    purple: { gradient: 'from-purple-600 to-purple-700', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    green: { gradient: 'from-green-600 to-green-700', bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    orange: { gradient: 'from-orange-600 to-orange-700', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    red: { gradient: 'from-red-600 to-red-700', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    indigo: { gradient: 'from-indigo-600 to-indigo-700', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
  }

  const colors = colorClasses[info.color]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`bg-gradient-to-r ${colors.gradient} text-white`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/curriculum" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            커리큘럼으로 돌아가기
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">Phase {id}</span>
            <span className="text-white/80">{weeks.length}주 과정</span>
          </div>
          <h1 className="text-3xl font-bold">{info.title}</h1>
          <p className="mt-2 text-white/90">{info.description}</p>
        </div>
      </header>

      {/* Phase Navigation */}
      <nav className="sticky top-0 bg-white border-b shadow-sm z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {Object.entries(phaseInfo).map(([phaseId, phaseData]) => (
            <Link
              key={phaseId}
              href={`/phase/${phaseId}`}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                phaseId === id
                  ? `${colors.bg} ${colors.text} font-bold`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Phase {phaseId}
            </Link>
          ))}
        </div>
      </nav>

      {/* Week Cards */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {weeks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {weeks.map((week) => (
              <Link
                key={week.slug}
                href={`/learn/week/${week.slug}`}
                className={`block bg-white rounded-xl border ${colors.border} hover:shadow-lg transition-all p-6 group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 ${colors.bg} ${colors.text} rounded text-xs font-bold`}>
                      Week {week.week}
                    </span>
                    {week.access === 'pro' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                        PRO
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDuration(week.totalDuration)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {week.title}
                </h3>

                {week.practice && (
                  <p className="text-sm text-gray-600 mb-3">
                    {week.practice}
                  </p>
                )}

                {week.topics && week.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {week.topics.slice(0, 5).map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                    {week.topics.length > 5 && (
                      <span className="px-2 py-0.5 text-gray-400 text-xs">
                        +{week.topics.length - 5}
                      </span>
                    )}
                  </div>
                )}

                {/* Day count */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {week.days.length}일 학습
                  </span>
                  <span className={`${colors.text} font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1`}>
                    학습 시작
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">준비 중입니다</h2>
            <p className="text-gray-600">Phase {id} 콘텐츠가 곧 추가될 예정입니다.</p>
          </div>
        )}

        {/* Phase Summary */}
        {weeks.length > 0 && (
          <div className={`mt-8 p-6 ${colors.bg} rounded-xl border ${colors.border}`}>
            <h3 className={`font-bold ${colors.text} mb-3`}>Phase {id} 요약</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600">총 학습 기간</div>
                <div className="font-bold text-gray-900">{weeks.length}주</div>
              </div>
              <div>
                <div className="text-gray-600">총 학습 시간</div>
                <div className="font-bold text-gray-900">
                  {formatDuration(weeks.reduce((sum, w) => sum + w.totalDuration, 0))}
                </div>
              </div>
              <div>
                <div className="text-gray-600">일일 학습</div>
                <div className="font-bold text-gray-900">
                  {weeks.reduce((sum, w) => sum + w.days.length, 0)}일
                </div>
              </div>
              <div>
                <div className="text-gray-600">주요 토픽</div>
                <div className="font-bold text-gray-900">
                  {Array.from(new Set(weeks.flatMap(w => w.topics || []))).length}개
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <Link href="/curriculum" className="text-blue-600 hover:underline">
            FDE Academy 커리큘럼
          </Link>
          {' '} | Phase {id}: {info.title}
        </div>
      </footer>
    </div>
  )
}
