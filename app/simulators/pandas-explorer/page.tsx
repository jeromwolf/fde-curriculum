'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const PandasExplorer = dynamic(
  () => import('@/components/simulators/pandas-explorer').then(mod => ({ default: mod.PandasExplorer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Pandas Explorer 로딩 중...</p>
        </div>
      </div>
    )
  }
)

export default function PandasExplorerPage() {
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
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Week 2</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">pandas</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Pandas Data Explorer</h1>
              <p className="text-orange-100">
                브라우저에서 직접 pandas로 데이터를 탐색하세요. 실제 데이터셋으로
                선택, 필터링, 그룹화, 피벗 등 데이터 분석 기법을 실습할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 학습 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">👆</div>
            <h3 className="font-semibold text-gray-900">데이터 선택</h3>
            <p className="text-sm text-gray-600">
              loc, iloc, Boolean indexing
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900">GroupBy</h3>
            <p className="text-sm text-gray-600">
              그룹 집계, transform, apply
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔀</div>
            <h3 className="font-semibold text-gray-900">피벗 테이블</h3>
            <p className="text-sm text-gray-600">
              pivot_table, stack, unstack
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-semibold text-gray-900">데이터 프로파일</h3>
            <p className="text-sm text-gray-600">
              결측치, 분포, 통계 요약
            </p>
          </div>
        </div>

        {/* 메인 Pandas Explorer */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 min-h-[700px]">
          <PandasExplorer showProfile={true} showSamples={true} />
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-50 rounded-xl p-6">
            <h3 className="font-semibold text-orange-900 mb-2">
              💡 pandas란?
            </h3>
            <p className="text-gray-700 text-sm">
              pandas는 Python의 데이터 분석 라이브러리입니다.
              DataFrame이라는 2차원 데이터 구조를 통해 SQL과 유사한
              데이터 조작을 Python에서 수행할 수 있습니다.
            </p>
          </div>

          <div className="bg-amber-50 rounded-xl p-6">
            <h3 className="font-semibold text-amber-900 mb-2">
              🎯 FDE 커리큘럼 연계
            </h3>
            <p className="text-gray-700 text-sm">
              이 시뮬레이터는 FDE Academy Phase 1 Week 2 "pandas & 데이터 처리" 과정의
              실습 도구입니다. 샘플 코드를 참고하여 데이터 분석 기법을 마스터하세요.
            </p>
          </div>
        </div>

        {/* 데이터셋 설명 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">📁 제공 데이터셋</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-1">E-Commerce 주문</h4>
              <p className="text-sm text-gray-600 mb-2">고객, 주문, 상품 정보</p>
              <div className="text-xs text-gray-500">1,000행 × 12열</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-1">일별 매출</h4>
              <p className="text-sm text-gray-600 mb-2">시계열 매출 데이터</p>
              <div className="text-xs text-gray-500">730행 × 8열 (2년)</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-1">주식 가격</h4>
              <p className="text-sm text-gray-600 mb-2">5개 종목 OHLCV</p>
              <div className="text-xs text-gray-500">500행 × 7열</div>
            </div>
          </div>
        </div>

        {/* 샘플 코드 카테고리 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">📚 샘플 코드 카테고리</h3>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">선택</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">필터링</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">GroupBy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">변환</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">피벗</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">시각화</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-gray-600">총 샘플</div>
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
              href="/simulators/python-console"
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
            >
              Python Console →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
