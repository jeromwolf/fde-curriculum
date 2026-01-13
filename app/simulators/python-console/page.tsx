'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const PythonConsole = dynamic(
  () => import('@/components/simulators/python-console').then(mod => ({ default: mod.PythonConsole })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Python Console 로딩 중...</p>
        </div>
      </div>
    )
  }
)

export default function PythonConsolePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 네비게이션 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전 페이지로 돌아가기
          </button>
        </div>

        {/* 헤더 */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Phase 1</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Week 1</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Pyodide</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Python Interactive Console</h1>
              <p className="text-green-100">
                브라우저에서 직접 Python을 실행하세요. Pyodide 기반으로 설치 없이
                데코레이터, 제너레이터, 이터레이터 등 고급 Python을 학습할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 학습 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🎀</div>
            <h3 className="font-semibold text-gray-900">데코레이터</h3>
            <p className="text-sm text-gray-600">
              함수를 감싸서 기능 확장하기
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="font-semibold text-gray-900">제너레이터</h3>
            <p className="text-sm text-gray-600">
              yield로 lazy evaluation 구현
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📦</div>
            <h3 className="font-semibold text-gray-900">컨텍스트 매니저</h3>
            <p className="text-sm text-gray-600">
              with 문으로 리소스 관리
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-900">데이터클래스</h3>
            <p className="text-sm text-gray-600">
              @dataclass로 보일러플레이트 제거
            </p>
          </div>
        </div>

        {/* 메인 Python Console */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 min-h-[600px]">
          <PythonConsole showSamples={true} showHistory={true} />
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="font-semibold text-green-900 mb-2">
              💡 Pyodide란?
            </h3>
            <p className="text-gray-700 text-sm">
              Pyodide는 WebAssembly로 컴파일된 Python 인터프리터입니다.
              브라우저에서 직접 실행되므로 서버 없이도 Python을 연습할 수 있습니다.
              NumPy, Pandas 등의 라이브러리도 지원합니다.
            </p>
          </div>

          <div className="bg-teal-50 rounded-xl p-6">
            <h3 className="font-semibold text-teal-900 mb-2">
              🎯 FDE 커리큘럼 연계
            </h3>
            <p className="text-gray-700 text-sm">
              이 시뮬레이터는 FDE Academy Phase 1 Week 1 "Python 심화" 과정의
              실습 도구입니다. 샘플 코드를 참고하여 고급 Python 문법을 마스터하세요.
            </p>
          </div>
        </div>

        {/* 샘플 코드 카테고리 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">📚 샘플 코드 카테고리</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-gray-600">데코레이터</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-gray-600">제너레이터</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600">이터레이터</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600">컨텍스트 매니저</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600">데이터클래스</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">functools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600">타입 힌트</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">19</div>
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
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
          </div>
        </div>
      </div>
    </div>
  )
}
