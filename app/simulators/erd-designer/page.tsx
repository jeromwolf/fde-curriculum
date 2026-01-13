'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ERDDesigner = dynamic(
  () => import('@/components/simulators/erd-designer').then(mod => ({ default: mod.ERDDesigner })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">ERD Designer 로딩 중...</p>
        </div>
      </div>
    )
  }
)

export default function ERDDesignerPage() {
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
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">SQL</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">ERD Designer</h1>
              <p className="text-blue-100">
                시각적으로 데이터베이스 스키마를 설계하세요. 테이블과 관계를 드래그 앤 드롭으로
                배치하고, 자동으로 SQL DDL을 생성할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 학습 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900">OLTP vs OLAP</h3>
            <p className="text-sm text-gray-600">
              운영용과 분석용 스키마 비교
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">⭐</div>
            <h3 className="font-semibold text-gray-900">Star Schema</h3>
            <p className="text-sm text-gray-600">
              Fact 테이블 + Dimension 테이블
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">❄️</div>
            <h3 className="font-semibold text-gray-900">Snowflake Schema</h3>
            <p className="text-sm text-gray-600">
              정규화된 Dimension 구조
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-semibold text-gray-900">관계 모델링</h3>
            <p className="text-sm text-gray-600">
              1:1, 1:N, N:M 관계 이해
            </p>
          </div>
        </div>

        {/* 메인 ERD Designer */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" style={{ minHeight: '700px' }}>
          <ERDDesigner showSamples={true} showDDL={true} />
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 ERD란?
            </h3>
            <p className="text-gray-700 text-sm">
              ERD(Entity-Relationship Diagram)는 데이터베이스 설계에서 엔티티(테이블)와
              그들 간의 관계를 시각적으로 표현하는 다이어그램입니다.
              데이터 모델링의 핵심 도구입니다.
            </p>
          </div>

          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="font-semibold text-indigo-900 mb-2">
              🎯 FDE 커리큘럼 연계
            </h3>
            <p className="text-gray-700 text-sm">
              이 시뮬레이터는 FDE Academy Phase 1 Week 3 "SQL & 관계형 데이터베이스" 과정의
              실습 도구입니다. OLTP/OLAP, Star/Snowflake 스키마를 직접 탐색해보세요.
            </p>
          </div>
        </div>

        {/* 스키마 유형 설명 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">📁 샘플 스키마 종류</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">OLTP</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">E-Commerce</h4>
              <p className="text-sm text-gray-600">3NF 정규화된 운영용 스키마</p>
              <div className="text-xs text-gray-500 mt-2">6 테이블 · 7 관계</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">Star</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Sales Analytics</h4>
              <p className="text-sm text-gray-600">비정규화된 분석용 스키마</p>
              <div className="text-xs text-gray-500 mt-2">5 테이블 · 4 관계</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-medium">Snowflake</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Inventory</h4>
              <p className="text-sm text-gray-600">부분 정규화된 분석용 스키마</p>
              <div className="text-xs text-gray-500 mt-2">7 테이블 · 6 관계</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-medium">Template</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Empty</h4>
              <p className="text-sm text-gray-600">빈 스키마 템플릿</p>
              <div className="text-xs text-gray-500 mt-2">직접 설계 시작</div>
            </div>
          </div>
        </div>

        {/* 관계 유형 설명 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">🔗 관계 유형</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-0.5 bg-green-500"></div>
                <span className="font-medium text-gray-900">1:1 (One-to-One)</span>
              </div>
              <p className="text-sm text-gray-600">
                한 레코드가 다른 테이블의 정확히 하나의 레코드와 연결됩니다.
                예: 사용자 - 프로필
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-0.5 bg-blue-500"></div>
                <span className="font-medium text-gray-900">1:N (One-to-Many)</span>
              </div>
              <p className="text-sm text-gray-600">
                한 레코드가 다른 테이블의 여러 레코드와 연결됩니다.
                예: 고객 - 주문
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-0.5 bg-purple-500"></div>
                <span className="font-medium text-gray-900">N:M (Many-to-Many)</span>
              </div>
              <p className="text-sm text-gray-600">
                여러 레코드가 서로 여러 레코드와 연결됩니다. 중간 테이블 필요.
                예: 학생 - 강의
              </p>
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
              href="/simulators/sql-lab"
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
            >
              SQL Query Lab →
            </Link>
            <Link
              href="/simulators/pandas-explorer"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition"
            >
              Pandas Explorer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
