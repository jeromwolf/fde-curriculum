'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const RAGStudio = dynamic(
  () => import('@/components/simulators/rag-studio').then(mod => ({ default: mod.RAGStudio })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">RAG Studio 로딩 중...</p>
        </div>
      </div>
    )
  }
)

export default function RAGStudioPage() {
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
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Phase 5</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Week 2-4</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">GenAI</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">RAG Studio</h1>
              <p className="text-purple-100">
                RAG(Retrieval-Augmented Generation) 파이프라인을 직접 구성하고 테스트해보세요.
                문서 청킹, 임베딩, 벡터 검색, LLM 응답 생성까지 전 과정을 시각적으로 이해할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 학습 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">✂️</div>
            <h3 className="font-semibold text-gray-900">청킹 전략</h3>
            <p className="text-sm text-gray-600">
              Fixed, Sentence, Recursive, Semantic
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔢</div>
            <h3 className="font-semibold text-gray-900">임베딩</h3>
            <p className="text-sm text-gray-600">
              텍스트 → 벡터 변환
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-semibold text-gray-900">벡터 검색</h3>
            <p className="text-sm text-gray-600">
              유사도, MMR, 하이브리드
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold text-gray-900">응답 생성</h3>
            <p className="text-sm text-gray-600">
              컨텍스트 + LLM 프롬프트
            </p>
          </div>
        </div>

        {/* 메인 RAG Studio */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" style={{ minHeight: '700px' }}>
          <RAGStudio showConfig={true} showVisualization={true} />
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="font-semibold text-purple-900 mb-2">
              💡 RAG란?
            </h3>
            <p className="text-gray-700 text-sm">
              RAG(Retrieval-Augmented Generation)는 LLM의 한계를 극복하기 위한 기술입니다.
              외부 지식 베이스에서 관련 정보를 검색하여 LLM에 제공함으로써
              더 정확하고 최신의 답변을 생성할 수 있습니다.
            </p>
          </div>

          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="font-semibold text-indigo-900 mb-2">
              🎯 FDE 커리큘럼 연계
            </h3>
            <p className="text-gray-700 text-sm">
              이 시뮬레이터는 FDE Academy Phase 5 "GenAI & RAG" 과정의 실습 도구입니다.
              RAG 파이프라인의 각 단계를 직접 조작하며 이해도를 높이세요.
            </p>
          </div>
        </div>

        {/* RAG 파이프라인 설명 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">📚 RAG 파이프라인 단계</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl mb-2 text-center">📄</div>
              <h4 className="font-medium text-gray-900 text-center mb-1">1. 문서 로딩</h4>
              <p className="text-xs text-gray-600 text-center">
                PDF, HTML, TXT 등 다양한 형식 지원
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl mb-2 text-center">✂️</div>
              <h4 className="font-medium text-gray-900 text-center mb-1">2. 청킹</h4>
              <p className="text-xs text-gray-600 text-center">
                적절한 크기로 문서 분할
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl mb-2 text-center">🔢</div>
              <h4 className="font-medium text-gray-900 text-center mb-1">3. 임베딩</h4>
              <p className="text-xs text-gray-600 text-center">
                텍스트를 벡터로 변환
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl mb-2 text-center">🗄️</div>
              <h4 className="font-medium text-gray-900 text-center mb-1">4. 저장 & 검색</h4>
              <p className="text-xs text-gray-600 text-center">
                벡터 DB에 저장, 유사도 검색
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl mb-2 text-center">🤖</div>
              <h4 className="font-medium text-gray-900 text-center mb-1">5. 생성</h4>
              <p className="text-xs text-gray-600 text-center">
                컨텍스트 + 질문 → LLM 응답
              </p>
            </div>
          </div>
        </div>

        {/* 청킹 전략 비교 */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">✂️ 청킹 전략 비교</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">고정 크기</h4>
              <p className="text-xs text-gray-600 mb-2">문자/토큰 수로 균일 분할</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">구현 간단</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">문맥 단절</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">문장 단위</h4>
              <p className="text-xs text-gray-600 mb-2">문장 경계에서 분할</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">문장 완결</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">크기 불균일</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">재귀적 분할</h4>
              <p className="text-xs text-gray-600 mb-2">계층적 구분자로 분할</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">균형 잡힘</span>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">권장</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">의미 기반</h4>
              <p className="text-xs text-gray-600 mb-2">임베딩으로 의미 단위 분할</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">최적 문맥</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">비용 높음</span>
              </div>
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
              href="/simulators/embedding-visualizer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Embedding Visualizer →
            </Link>
            <Link
              href="/simulators/graphrag-pipeline"
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
            >
              GraphRAG Pipeline →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
