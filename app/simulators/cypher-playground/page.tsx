'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CypherPlayground = dynamic(
  () => import('@/components/simulators/cypher-playground').then(mod => ({ default: mod.CypherPlayground })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cypher Playground 로딩 중...</p>
        </div>
      </div>
    )
  }
)

export default function CypherPlaygroundPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 네비게이션 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전 페이지로 돌아가기
          </button>
        </div>

        {/* 헤더 */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Phase 3</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Week 1</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Cypher Query Playground</h1>
              <p className="text-purple-100">
                Neo4j의 Cypher 쿼리 언어를 브라우저에서 직접 실습해보세요.
                실제 Neo4j 없이도 Property Graph의 핵심 개념을 배울 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 학습 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold text-gray-900">MATCH 패턴</h3>
            <p className="text-sm text-gray-600">
              ASCII Art 스타일의 직관적인 패턴 매칭
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-semibold text-gray-900">관계 탐색</h3>
            <p className="text-sm text-gray-600">
              방향성, 타입, 가변 길이 관계 쿼리
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">➕</div>
            <h3 className="font-semibold text-gray-900">CREATE</h3>
            <p className="text-sm text-gray-600">
              노드와 관계를 동적으로 생성
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900">시각화</h3>
            <p className="text-sm text-gray-600">
              실시간 그래프 시각화로 결과 확인
            </p>
          </div>
        </div>

        {/* 메인 Playground */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <CypherPlayground showGraph={true} showHistory={true} />
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 Cypher vs SQL
            </h3>
            <p className="text-gray-700 text-sm">
              SQL에서 복잡한 JOIN이 필요한 관계 쿼리가 Cypher에서는 직관적인 패턴으로 표현됩니다.
              <code className="bg-blue-100 px-1 rounded mx-1">
                (a)-[:KNOWS]-&gt;(b)
              </code>
              처럼 화살표로 관계를 표현하세요.
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="font-semibold text-purple-900 mb-2">
              🎯 FDE 커리큘럼 연계
            </h3>
            <p className="text-gray-700 text-sm">
              이 시뮬레이터는 FDE Academy Phase 3 Week 1 "그래프 이론 & Neo4j 입문" 과정의
              실습 도구입니다. Cypher CRUD와 패턴 매칭을 마스터하세요.
            </p>
          </div>
        </div>

        {/* 다음 단계 */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">다음 학습</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
            >
              이전 학습으로 돌아가기
            </button>
            <Link
              href="/curriculum"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition"
            >
              전체 커리큘럼 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
