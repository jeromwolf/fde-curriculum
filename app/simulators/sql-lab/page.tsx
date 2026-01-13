'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SqlLab = dynamic(
  () => import('@/components/simulators/sql-lab').then(mod => ({ default: mod.SqlLab })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">SQL Lab 로딩 중...</p>
        </div>
      </div>
    )
  }
)

export default function SqlLabPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 네비게이션 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전 페이지로 돌아가기
          </button>
        </div>

        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Phase 1</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Week 3</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">DuckDB WASM</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">SQL Query Lab</h1>
              <p className="text-blue-100">
                브라우저에서 직접 SQL을 실행하세요. DuckDB WASM 기반으로 설치 없이
                윈도우 함수, CTE, 서브쿼리 등 고급 SQL을 학습할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 학습 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900">E-Commerce 스키마</h3>
            <p className="text-sm text-gray-600">
              고객, 주문, 상품 등 실무 데이터 구조
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🪟</div>
            <h3 className="font-semibold text-gray-900">윈도우 함수</h3>
            <p className="text-sm text-gray-600">
              ROW_NUMBER, RANK, LAG/LEAD 등
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="font-semibold text-gray-900">CTE</h3>
            <p className="text-sm text-gray-600">
              WITH 절을 활용한 복잡한 쿼리 구조화
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-semibold text-gray-900">다양한 JOIN</h3>
            <p className="text-sm text-gray-600">
              INNER, LEFT, Multiple JOINs 실습
            </p>
          </div>
        </div>

        {/* 메인 SQL Lab */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 min-h-[600px]">
          <SqlLab showSchema={true} showSampleQueries={true} showHistory={true} />
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 DuckDB란?
            </h3>
            <p className="text-gray-700 text-sm">
              DuckDB는 분석용 인메모리 데이터베이스입니다. WASM으로 컴파일되어
              브라우저에서 직접 실행되므로 서버 없이도 SQL을 연습할 수 있습니다.
              PostgreSQL과 유사한 문법을 지원합니다.
            </p>
          </div>

          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="font-semibold text-indigo-900 mb-2">
              🎯 FDE 커리큘럼 연계
            </h3>
            <p className="text-gray-700 text-sm">
              이 시뮬레이터는 FDE Academy Phase 1 Week 3 "SQL 심화" 과정의
              실습 도구입니다. 샘플 쿼리를 참고하여 윈도우 함수, CTE, 서브쿼리를 마스터하세요.
            </p>
          </div>
        </div>

        {/* 데이터셋 설명 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">📁 샘플 데이터셋</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">100</div>
              <div className="text-sm text-gray-600">고객</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">50</div>
              <div className="text-sm text-gray-600">상품</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">500</div>
              <div className="text-sm text-gray-600">주문</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1,500+</div>
              <div className="text-sm text-gray-600">주문 항목</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">10</div>
              <div className="text-sm text-gray-600">공급업체</div>
            </div>
          </div>
        </div>

        {/* 다음 단계 */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">다음 학습</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
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
              href="/simulators/cypher-playground"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
            >
              Cypher Playground →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
