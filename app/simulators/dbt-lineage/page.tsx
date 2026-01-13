'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const DbtLineage = dynamic(
  () => import('@/components/simulators/dbt-lineage').then(mod => ({ default: mod.DbtLineage })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-500">dbt Lineage Visualizer 로딩 중...</p>
        </div>
      </div>
    )
  }
)

export default function DbtLineagePage() {
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
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Phase 1</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Week 7.5</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">dbt</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">dbt Lineage Visualizer</h1>
              <p className="text-orange-100">
                dbt 프로젝트의 데이터 계보(Lineage)를 시각적으로 탐색하세요.
                모델 의존성, 레이어 구조, SQL 코드를 한눈에 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 학습 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900">Lineage Graph</h3>
            <p className="text-sm text-gray-600">
              모델 간 의존성 DAG 시각화
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🏗️</div>
            <h3 className="font-semibold text-gray-900">Layer Structure</h3>
            <p className="text-sm text-gray-600">
              staging → intermediate → marts
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📦</div>
            <h3 className="font-semibold text-gray-900">Materialization</h3>
            <p className="text-sm text-gray-600">
              view, table, incremental, ephemeral
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">✅</div>
            <h3 className="font-semibold text-gray-900">Tests</h3>
            <p className="text-sm text-gray-600">
              unique, not_null, relationships
            </p>
          </div>
        </div>

        {/* 메인 Lineage Visualizer */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" style={{ minHeight: '600px' }}>
          <DbtLineage showCode={true} showTests={true} />
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-50 rounded-xl p-6">
            <h3 className="font-semibold text-orange-900 mb-2">
              💡 dbt란?
            </h3>
            <p className="text-gray-700 text-sm">
              <strong>dbt (data build tool)</strong>는 ELT 파이프라인에서 Transform을 담당하는 도구입니다.
              SQL SELECT 문만으로 데이터 모델을 정의하고, 의존성 관리, 테스트, 문서화를 자동화합니다.
              Analytics Engineering의 핵심 도구로 Airbnb, GitLab, Spotify 등에서 사용됩니다.
            </p>
          </div>

          <div className="bg-amber-50 rounded-xl p-6">
            <h3 className="font-semibold text-amber-900 mb-2">
              🎯 FDE 커리큘럼 연계
            </h3>
            <p className="text-gray-700 text-sm">
              이 시뮬레이터는 FDE Academy Phase 1 Week 7.5 "dbt 기초" 과정의 실습 도구입니다.
              데이터 웨어하우스의 모델 계보를 시각화하고, dbt 프로젝트 구조를 이해하는 데 도움을 줍니다.
            </p>
          </div>
        </div>

        {/* dbt 레이어 설명 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">🏗️ dbt 레이어 구조</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-gray-400">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🗄️</span>
                <h4 className="font-medium text-gray-900">Sources</h4>
              </div>
              <p className="text-xs text-gray-600">
                원본 데이터 소스. 외부 시스템(DB, API, 파일)에서 추출된 raw 데이터.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔵</span>
                <h4 className="font-medium text-gray-900">Staging</h4>
              </div>
              <p className="text-xs text-gray-600">
                데이터 정제 레이어. 타입 캐스팅, 컬럼 리네이밍, 기본 필터링.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-400">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🟡</span>
                <h4 className="font-medium text-gray-900">Intermediate</h4>
              </div>
              <p className="text-xs text-gray-600">
                비즈니스 로직 레이어. 조인, 집계, 복잡한 변환 처리.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-400">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🟢</span>
                <h4 className="font-medium text-gray-900">Marts</h4>
              </div>
              <p className="text-xs text-gray-600">
                최종 분석 레이어. 팩트/디멘션 테이블, BI 리포트용 데이터.
              </p>
            </div>
          </div>
        </div>

        {/* Materialization 설명 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">📦 Materialization Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span>👁️</span>
                <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">view</code>
              </div>
              <p className="text-xs text-gray-600">가상 테이블, 쿼리 시 실행</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span>📦</span>
                <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">table</code>
              </div>
              <p className="text-xs text-gray-600">물리적 테이블로 저장</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span>📈</span>
                <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">incremental</code>
              </div>
              <p className="text-xs text-gray-600">변경분만 업데이트</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span>💨</span>
                <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">ephemeral</code>
              </div>
              <p className="text-xs text-gray-600">CTE로 인라인 삽입</p>
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
              href="/simulators/airflow-dag"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition"
            >
              Airflow DAG →
            </Link>
            <Link
              href="/simulators/spark-visualizer"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition"
            >
              Spark Visualizer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
