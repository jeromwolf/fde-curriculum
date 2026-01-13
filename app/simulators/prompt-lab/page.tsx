'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const PromptLab = dynamic(
  () => import('@/components/simulators/prompt-lab').then(mod => ({ default: mod.PromptLab })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Prompt Lab 로딩 중...</p>
        </div>
      </div>
    )
  }
)

export default function PromptLabPage() {
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Phase 5</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">GenAI</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Prompt Engineering</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Prompt Lab</h1>
              <p className="text-purple-100">
                다양한 프롬프트 엔지니어링 기법을 실습하고 비교하세요.
                Zero-Shot, Few-Shot, Chain-of-Thought 등 핵심 기법을 직접 테스트할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 학습 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900">Zero-Shot</h3>
            <p className="text-sm text-gray-600">
              예시 없이 직접 지시
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-semibold text-gray-900">Few-Shot</h3>
            <p className="text-sm text-gray-600">
              예시로 패턴 학습
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-semibold text-gray-900">Chain-of-Thought</h3>
            <p className="text-sm text-gray-600">
              단계별 추론 유도
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🎭</div>
            <h3 className="font-semibold text-gray-900">Role-Playing</h3>
            <p className="text-sm text-gray-600">
              전문가 역할 부여
            </p>
          </div>
        </div>

        {/* 메인 Prompt Lab */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" style={{ minHeight: '700px' }}>
          <PromptLab showTechniques={true} showComparison={true} />
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="font-semibold text-purple-900 mb-2">
              💡 프롬프트 엔지니어링이란?
            </h3>
            <p className="text-gray-700 text-sm">
              <strong>프롬프트 엔지니어링</strong>은 AI 모델에서 원하는 출력을 얻기 위해
              입력(프롬프트)을 설계하고 최적화하는 기술입니다. 적절한 프롬프트는
              AI 성능을 크게 향상시키고, 복잡한 작업도 효과적으로 수행할 수 있게 합니다.
            </p>
          </div>

          <div className="bg-pink-50 rounded-xl p-6">
            <h3 className="font-semibold text-pink-900 mb-2">
              🎯 FDE 커리큘럼 연계
            </h3>
            <p className="text-gray-700 text-sm">
              이 시뮬레이터는 FDE Academy Phase 5 "GenAI & RAG" 과정의 실습 도구입니다.
              다양한 프롬프트 기법을 직접 테스트하고, 최적의 프롬프트를 설계하는 방법을 학습합니다.
            </p>
          </div>
        </div>

        {/* Techniques Overview */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">🔧 주요 프롬프트 기법</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🎯</span>
                <h4 className="font-medium text-gray-900">Zero-Shot</h4>
              </div>
              <p className="text-xs text-gray-600">
                예시 없이 명확한 지시만으로 작업 수행. 간단한 분류, 요약에 효과적.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📚</span>
                <h4 className="font-medium text-gray-900">Few-Shot</h4>
              </div>
              <p className="text-xs text-gray-600">
                몇 개의 예시로 패턴 학습. 특정 형식, 스타일 출력에 유용.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔗</span>
                <h4 className="font-medium text-gray-900">Chain-of-Thought</h4>
              </div>
              <p className="text-xs text-gray-600">
                단계별 추론 유도. 수학, 논리 문제에 효과적.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📋</span>
                <h4 className="font-medium text-gray-900">Structured Output</h4>
              </div>
              <p className="text-xs text-gray-600">
                JSON, Markdown 등 특정 형식으로 출력 구조화.
              </p>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">✨ Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-400">
              <h4 className="font-medium text-gray-900 mb-1">명확하고 구체적으로</h4>
              <p className="text-xs text-gray-600">모호한 표현을 피하고 원하는 것을 정확히 설명하세요.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-pink-400">
              <h4 className="font-medium text-gray-900 mb-1">출력 형식 지정</h4>
              <p className="text-xs text-gray-600">원하는 출력 형식을 명시하면 일관된 결과를 얻을 수 있습니다.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
              <h4 className="font-medium text-gray-900 mb-1">맥락 제공</h4>
              <p className="text-xs text-gray-600">충분한 배경 정보를 제공하여 더 정확한 응답을 유도하세요.</p>
            </div>
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
            <Link
              href="/simulators/rag-studio"
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
            >
              RAG Studio →
            </Link>
            <Link
              href="/simulators/rag-pipeline"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              RAG Pipeline →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
