'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const AirflowDAG = dynamic(
  () => import('@/components/simulators/airflow-dag').then(mod => ({ default: mod.AirflowDAG })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Airflow DAG Simulator 로딩 중...</p>
        </div>
      </div>
    )
  }
)

export default function AirflowDAGPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 네비게이션 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전 페이지로 돌아가기
          </button>
        </div>

        {/* 헤더 */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Phase 1</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Week 7</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Airflow</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Airflow DAG Simulator</h1>
              <p className="text-teal-100">
                Apache Airflow DAG의 실행 흐름을 시각적으로 이해하세요.
                Task 의존성, Trigger Rules, 병렬 실행을 직접 시뮬레이션해볼 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 학습 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔀</div>
            <h3 className="font-semibold text-gray-900">DAG 구조</h3>
            <p className="text-sm text-gray-600">
              Directed Acyclic Graph 이해
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900">Task 의존성</h3>
            <p className="text-sm text-gray-600">
              Upstream / Downstream 관계
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900">Trigger Rules</h3>
            <p className="text-sm text-gray-600">
              all_success, none_failed 등
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔧</div>
            <h3 className="font-semibold text-gray-900">Operators</h3>
            <p className="text-sm text-gray-600">
              Python, Bash, SQL, HTTP
            </p>
          </div>
        </div>

        {/* 메인 Airflow DAG */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" style={{ minHeight: '700px' }}>
          <AirflowDAG showCode={true} showLogs={true} animateExecution={true} />
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-teal-50 rounded-xl p-6">
            <h3 className="font-semibold text-teal-900 mb-2">
              💡 Airflow란?
            </h3>
            <p className="text-gray-700 text-sm">
              Apache Airflow는 워크플로우를 프로그래밍 방식으로 작성, 스케줄링, 모니터링하는
              플랫폼입니다. DAG(Directed Acyclic Graph)로 복잡한 데이터 파이프라인을 정의하고
              관리할 수 있습니다.
            </p>
          </div>

          <div className="bg-cyan-50 rounded-xl p-6">
            <h3 className="font-semibold text-cyan-900 mb-2">
              🎯 FDE 커리큘럼 연계
            </h3>
            <p className="text-gray-700 text-sm">
              이 시뮬레이터는 FDE Academy Phase 1 Week 7 "Airflow & 워크플로우 오케스트레이션" 과정의
              실습 도구입니다. DAG 실행을 직접 시뮬레이션하며 학습하세요.
            </p>
          </div>
        </div>

        {/* 샘플 DAG 설명 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">🎮 샘플 DAG</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">ETL</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Basic ETL Pipeline</h4>
              <p className="text-xs text-gray-600">Extract → Transform → Load 기본 플로우</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-medium">Branch</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Branching DAG</h4>
              <p className="text-xs text-gray-600">조건에 따른 분기 처리</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">Parallel</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Parallel Processing</h4>
              <p className="text-xs text-gray-600">다중 소스 병렬 처리</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded font-medium">ML</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">ML Training Pipeline</h4>
              <p className="text-xs text-gray-600">모델 학습부터 배포까지</p>
            </div>
          </div>
        </div>

        {/* Operator 종류 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">🔧 주요 Operators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <div className="flex items-center gap-2 bg-white p-2 rounded border">
              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">Python</span>
              <span className="text-xs text-gray-600">Python 함수 실행</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded border">
              <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">Bash</span>
              <span className="text-xs text-gray-600">쉘 명령어</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded border">
              <span className="px-2 py-1 bg-cyan-600 text-white text-xs rounded">SQL</span>
              <span className="text-xs text-gray-600">SQL 쿼리</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded border">
              <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">Branch</span>
              <span className="text-xs text-gray-600">조건 분기</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded border">
              <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">HTTP</span>
              <span className="text-xs text-gray-600">API 호출</span>
            </div>
          </div>
        </div>

        {/* Trigger Rules */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">🎯 Trigger Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">all_success</code>
              <p className="text-xs text-gray-600 mt-1">모든 상위 태스크 성공 시 실행 (기본값)</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">all_done</code>
              <p className="text-xs text-gray-600 mt-1">모든 상위 태스크 완료 시 실행 (성공/실패 무관)</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">none_failed</code>
              <p className="text-xs text-gray-600 mt-1">실패 없이 완료 시 실행 (스킵 허용)</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">one_success</code>
              <p className="text-xs text-gray-600 mt-1">하나라도 성공 시 실행</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">one_failed</code>
              <p className="text-xs text-gray-600 mt-1">하나라도 실패 시 실행</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">all_failed</code>
              <p className="text-xs text-gray-600 mt-1">모든 상위 태스크 실패 시 실행</p>
            </div>
          </div>
        </div>

        {/* 다음 단계 */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">다음 학습</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition"
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
              href="/simulators/spark-visualizer"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition"
            >
              Spark Visualizer →
            </Link>
            <Link
              href="/simulators/sql-lab"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              SQL Query Lab →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
