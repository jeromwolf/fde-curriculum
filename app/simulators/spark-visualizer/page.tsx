'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SparkVisualizer = dynamic(
  () => import('@/components/simulators/spark-visualizer').then(mod => ({ default: mod.SparkVisualizer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Spark Visualizer 로딩 중...</p>
        </div>
      </div>
    )
  }
)

export default function SparkVisualizerPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 네비게이션 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-orange-600 hover:text-orange-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전 페이지로 돌아가기
          </button>
        </div>

        {/* 헤더 */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Phase 1</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Week 6</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Spark</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Spark DAG Visualizer</h1>
              <p className="text-orange-100">
                Apache Spark의 실행 원리를 시각적으로 이해하세요. DAG, Stage, Task의 개념과
                Narrow/Wide Transformation의 차이점을 직접 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 학습 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔀</div>
            <h3 className="font-semibold text-gray-900">DAG 실행</h3>
            <p className="text-sm text-gray-600">
              RDD Lineage와 Lazy Evaluation
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900">Shuffle</h3>
            <p className="text-sm text-gray-600">
              Wide vs Narrow Transformation
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900">Stage & Task</h3>
            <p className="text-sm text-gray-600">
              병렬 처리와 파티셔닝
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">💾</div>
            <h3 className="font-semibold text-gray-900">캐싱</h3>
            <p className="text-sm text-gray-600">
              RDD 캐싱으로 성능 최적화
            </p>
          </div>
        </div>

        {/* 메인 Spark Visualizer */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" style={{ minHeight: '700px' }}>
          <SparkVisualizer showCode={true} showPartitions={true} />
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-50 rounded-xl p-6">
            <h3 className="font-semibold text-orange-900 mb-2">
              💡 Spark란?
            </h3>
            <p className="text-gray-700 text-sm">
              Apache Spark는 대용량 데이터 처리를 위한 통합 분석 엔진입니다.
              인메모리 처리로 Hadoop MapReduce보다 최대 100배 빠른 성능을 제공합니다.
            </p>
          </div>

          <div className="bg-red-50 rounded-xl p-6">
            <h3 className="font-semibold text-red-900 mb-2">
              🎯 FDE 커리큘럼 연계
            </h3>
            <p className="text-gray-700 text-sm">
              이 시뮬레이터는 FDE Academy Phase 1 Week 6 "Spark & 분산 처리" 과정의
              실습 도구입니다. DAG 실행 원리를 직접 확인하며 학습하세요.
            </p>
          </div>
        </div>

        {/* 핵심 개념 설명 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">📚 핵심 개념</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Narrow Transformation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 각 파티션이 독립적으로 처리됨</li>
                <li>• Shuffle 발생하지 않음</li>
                <li>• 예: map, filter, flatMap</li>
                <li>• 같은 Stage 내에서 실행</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Wide Transformation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 여러 파티션 데이터가 필요함</li>
                <li>• Shuffle (네트워크 I/O) 발생</li>
                <li>• 예: reduceByKey, groupByKey, join</li>
                <li>• 새로운 Stage 생성</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 샘플 Job 설명 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">🎮 샘플 Spark Job</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">기본</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Word Count</h4>
              <p className="text-sm text-gray-600">텍스트 파일에서 단어별 빈도 계산</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-medium">Join</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Join Operation</h4>
              <p className="text-sm text-gray-600">두 RDD를 조인하는 예제</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">집계</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">GroupBy Aggregation</h4>
              <p className="text-sm text-gray-600">그룹별 집계 연산</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">최적화</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Caching Optimization</h4>
              <p className="text-sm text-gray-600">RDD 캐싱을 통한 반복 연산 최적화</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded font-medium">비교</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Narrow vs Wide</h4>
              <p className="text-sm text-gray-600">변환 유형별 성능 차이</p>
            </div>
          </div>
        </div>

        {/* 다음 단계 */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">다음 학습</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition"
            >
              이전 학습으로 돌아가기
            </button>
            <Link
              href="/curriculum"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition"
            >
              전체 커리큘럼 보기
            </Link>
            <Link
              href="/simulators/sql-lab"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              SQL Query Lab →
            </Link>
            <Link
              href="/simulators/erd-designer"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              ERD Designer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
