'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { sampleScenarios, type ScenarioKey } from '@/components/simulators/graphrag-pipeline/sampleScenarios'
import type { PipelineStep, Entity, GraphContext } from '@/components/simulators/graphrag-pipeline/types'

// vis-network는 SSR에서 동작하지 않음
const MiniGraph = dynamic(
  () => import('@/components/simulators/graphrag-pipeline/MiniGraph'),
  { ssr: false, loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg" /> }
)

// 파이프라인 단계 정의
const initialSteps: PipelineStep[] = [
  { id: 'query', name: '1. 질문 입력', description: '사용자 질문 수신', status: 'pending' },
  { id: 'entity', name: '2. 엔티티 추출', description: 'NER로 핵심 개체 식별', status: 'pending' },
  { id: 'graph', name: '3. 그래프 탐색', description: 'Knowledge Graph에서 관련 정보 검색', status: 'pending' },
  { id: 'context', name: '4. 컨텍스트 구성', description: '그래프 + 텍스트 청크 결합', status: 'pending' },
  { id: 'generate', name: '5. 답변 생성', description: 'LLM으로 최종 답변 생성', status: 'pending' },
]

// 엔티티 타입별 색상
const entityColors: Record<string, string> = {
  person: 'bg-blue-100 text-blue-800',
  organization: 'bg-green-100 text-green-800',
  concept: 'bg-purple-100 text-purple-800',
  event: 'bg-yellow-100 text-yellow-800',
  location: 'bg-red-100 text-red-800',
}

// 간단한 엔티티 추출 시뮬레이션
function extractEntitiesSimple(query: string): Entity[] {
  const entities: Entity[] = []
  const q = query.toLowerCase()

  // 키워드 기반 엔티티 추출
  if (q.includes('삼성') || q.includes('samsung')) {
    entities.push({ id: 'samsung', name: '삼성전자', type: 'organization' })
  }
  if (q.includes('애플') || q.includes('apple')) {
    entities.push({ id: 'apple', name: 'Apple', type: 'organization' })
  }
  if (q.includes('테슬라') || q.includes('tesla')) {
    entities.push({ id: 'tesla', name: 'Tesla', type: 'organization' })
  }
  if (q.includes('현대') || q.includes('hyundai')) {
    entities.push({ id: 'hyundai', name: '현대자동차', type: 'organization' })
  }
  if (q.includes('ceo') || q.includes('대표')) {
    entities.push({ id: 'ceo', name: 'CEO', type: 'person' })
  }
  if (q.includes('경쟁') || q.includes('compete')) {
    entities.push({ id: 'competition', name: '경쟁관계', type: 'concept' })
  }
  if (q.includes('협력') || q.includes('partner')) {
    entities.push({ id: 'partnership', name: '협력관계', type: 'concept' })
  }

  // 기본 엔티티 (추출 안 되면)
  if (entities.length === 0) {
    entities.push({ id: 'query', name: query.slice(0, 20), type: 'concept' })
  }

  return entities
}

export default function GraphRAGPipelinePage() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('company')
  const [steps, setSteps] = useState<PipelineStep[]>(initialSteps)
  const [currentStep, setCurrentStep] = useState<number>(-1)
  const [isRunning, setIsRunning] = useState(false)
  const [extractedEntities, setExtractedEntities] = useState<Entity[]>([])
  const [generatedAnswer, setGeneratedAnswer] = useState<string>('')
  const [showGraph, setShowGraph] = useState(false)
  const [mode, setMode] = useState<'sample' | 'custom'>('sample')
  const [customQuery, setCustomQuery] = useState('')
  const [customAnswer, setCustomAnswer] = useState('')

  const scenario = sampleScenarios[selectedScenario]

  // 파이프라인 실행
  const runPipeline = async () => {
    setIsRunning(true)
    setSteps(initialSteps)
    setCurrentStep(0)
    setExtractedEntities([])
    setGeneratedAnswer('')
    setShowGraph(false)

    // Step 1: 질문 입력
    await simulateStep(0, scenario.query, '질문 수신 완료')

    // Step 2: 엔티티 추출
    await simulateStep(1, scenario.query, `${scenario.expectedEntities.length}개 엔티티 추출`)
    setExtractedEntities(scenario.expectedEntities)

    // Step 3: 그래프 탐색
    await simulateStep(
      2,
      `엔티티: ${scenario.expectedEntities.map(e => e.name).join(', ')}`,
      `${scenario.graphData.entities.length}개 노드, ${scenario.graphData.relationships.length}개 관계 탐색`
    )
    setShowGraph(true)

    // Step 4: 컨텍스트 구성
    await simulateStep(
      3,
      `그래프 데이터 + ${scenario.graphData.textChunks.length}개 텍스트 청크`,
      '컨텍스트 구성 완료'
    )

    // Step 5: 답변 생성
    await simulateStep(4, '컨텍스트 → LLM', '답변 생성 완료')
    setGeneratedAnswer(scenario.expectedAnswer)

    setIsRunning(false)
  }

  // 단계 시뮬레이션
  const simulateStep = async (stepIndex: number, input: string, output: string) => {
    setCurrentStep(stepIndex)
    setSteps(prev => prev.map((s, i) =>
      i === stepIndex ? { ...s, status: 'running', input } : s
    ))

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500))

    setSteps(prev => prev.map((s, i) =>
      i === stepIndex ? { ...s, status: 'completed', output, duration: Math.random() * 200 + 100 } : s
    ))
  }

  // 시나리오 변경 시 리셋
  const handleScenarioChange = (key: ScenarioKey) => {
    setSelectedScenario(key)
    setSteps(initialSteps)
    setCurrentStep(-1)
    setExtractedEntities([])
    setGeneratedAnswer('')
    setShowGraph(false)
    setMode('sample')
  }

  // 사용자 입력 파이프라인 실행
  const runCustomPipeline = async () => {
    if (!customQuery.trim()) return

    setMode('custom')
    setIsRunning(true)
    setSteps(initialSteps)
    setCurrentStep(0)
    setExtractedEntities([])
    setGeneratedAnswer('')
    setCustomAnswer('')
    setShowGraph(false)

    // Step 1: 질문 입력
    await simulateStep(0, customQuery, '질문 수신 완료')

    // Step 2: 엔티티 추출 (시뮬레이션)
    const extractedEnts = extractEntitiesSimple(customQuery)
    await simulateStep(1, customQuery, `${extractedEnts.length}개 엔티티 추출`)
    setExtractedEntities(extractedEnts)

    // Step 3: 그래프 탐색 (현재 시나리오의 그래프 데이터 사용)
    await simulateStep(
      2,
      `엔티티: ${extractedEnts.map(e => e.name).join(', ')}`,
      `${scenario.graphData.entities.length}개 노드, ${scenario.graphData.relationships.length}개 관계 탐색`
    )
    setShowGraph(true)

    // Step 4: 컨텍스트 구성
    await simulateStep(
      3,
      `그래프 데이터 + ${scenario.graphData.textChunks.length}개 텍스트 청크`,
      '컨텍스트 구성 완료'
    )

    // Step 5: 답변 생성 (시뮬레이션)
    await simulateStep(4, '컨텍스트 → LLM', '답변 생성 완료')
    const answer = `질문 "${customQuery}"에 대한 분석 결과입니다.\n\n` +
      `추출된 엔티티: ${extractedEnts.map(e => e.name).join(', ')}\n\n` +
      `Knowledge Graph에서 ${scenario.graphData.relationships.length}개의 관계를 탐색했습니다.\n\n` +
      `(이것은 시뮬레이션입니다. 실제 GraphRAG 시스템은 LLM을 사용하여 더 정교한 답변을 생성합니다.)`
    setCustomAnswer(answer)
    setGeneratedAnswer(answer)

    setIsRunning(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                ← 돌아가기
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  GraphRAG Pipeline Simulator
                </h1>
                <p className="text-sm text-gray-500">
                  Phase 3 Week 6 - Knowledge Graph + RAG 파이프라인
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 시나리오 선택 & 파이프라인 */}
          <div className="space-y-6">
            {/* 시나리오 선택 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📋 시나리오 선택</h2>
              <div className="space-y-2">
                {(Object.keys(sampleScenarios) as ScenarioKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleScenarioChange(key)}
                    disabled={isRunning}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedScenario === key
                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-medium">{sampleScenarios[key].name}</div>
                    <div className="text-xs text-gray-500">
                      {sampleScenarios[key].description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 파이프라인 단계 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">⚡ 파이프라인 단계</h2>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      step.status === 'running'
                        ? 'border-yellow-400 bg-yellow-50'
                        : step.status === 'completed'
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{step.name}</span>
                      <span className="text-xs">
                        {step.status === 'running' && '⏳ 처리 중...'}
                        {step.status === 'completed' && `✅ ${step.duration?.toFixed(0)}ms`}
                        {step.status === 'pending' && '⏸️ 대기'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                    {step.output && (
                      <p className="text-xs text-green-700 mt-1 font-medium">
                        → {step.output}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* 실행 버튼 */}
              <button
                onClick={runPipeline}
                disabled={isRunning}
                className={`w-full mt-4 py-3 rounded-xl font-semibold transition-colors ${
                  isRunning
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isRunning ? '⏳ 실행 중...' : '🚀 파이프라인 실행'}
              </button>
            </div>

            {/* 직접 입력 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">✏️ 직접 질문하기</h2>
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Knowledge Graph에 질문하세요...&#10;예: 삼성전자와 경쟁하는 기업은?&#10;예: 테슬라의 파트너사는?&#10;예: 현대자동차 CEO 정보"
                className="w-full h-24 p-3 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isRunning}
              />
              <button
                onClick={runCustomPipeline}
                disabled={isRunning || !customQuery.trim()}
                className={`w-full mt-3 py-2 rounded-lg font-medium transition-colors ${
                  isRunning || !customQuery.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isRunning && mode === 'custom' ? '⏳ 분석 중...' : '🔍 GraphRAG 분석'}
              </button>
              <p className="mt-2 text-xs text-gray-500">
                💡 키워드: 삼성, 애플, 테슬라, 현대, CEO, 경쟁, 협력
              </p>
            </div>
          </div>

          {/* 오른쪽: 질문 & 결과 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 질문 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">❓ 질문</h2>
              <div className="flex gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  mode === 'sample' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  샘플 시나리오
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  mode === 'custom' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  직접 입력
                </span>
              </div>
              <div className={`p-4 rounded-lg ${mode === 'custom' ? 'bg-purple-50' : 'bg-gray-50'}`}>
                <p className="text-lg">
                  {mode === 'sample' ? scenario.query : (customQuery || '질문을 입력하세요...')}
                </p>
              </div>
            </div>

            {/* 추출된 엔티티 */}
            {extractedEntities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">🏷️ 추출된 엔티티</h2>
                <div className="flex flex-wrap gap-2">
                  {extractedEntities.map((entity) => (
                    <span
                      key={entity.id}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${entityColors[entity.type] || 'bg-gray-100'}`}
                    >
                      {entity.name}
                      <span className="ml-1 text-xs opacity-70">({entity.type})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 그래프 시각화 */}
            {showGraph && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">🕸️ Knowledge Graph 시각화</h2>
                <MiniGraph context={scenario.graphData} height="300px" />
              </div>
            )}

            {/* 그래프 컨텍스트 */}
            {currentStep >= 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">🔗 Knowledge Graph 컨텍스트</h2>

                {/* 노드 */}
                <div className="mb-4">
                  <h3 className="font-medium text-sm text-gray-700 mb-2">노드 ({scenario.graphData.entities.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {scenario.graphData.entities.map((entity) => (
                      <span
                        key={entity.id}
                        className={`px-2 py-1 rounded text-xs ${entityColors[entity.type] || 'bg-gray-100'}`}
                      >
                        {entity.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 관계 */}
                <div className="mb-4">
                  <h3 className="font-medium text-sm text-gray-700 mb-2">관계 ({scenario.graphData.relationships.length})</h3>
                  <div className="space-y-1">
                    {scenario.graphData.relationships.map((rel, idx) => (
                      <div key={idx} className="text-xs bg-gray-50 px-2 py-1 rounded">
                        <span className="font-medium">{rel.source}</span>
                        <span className="mx-2 text-indigo-600">—[{rel.type}]→</span>
                        <span className="font-medium">{rel.target}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 텍스트 청크 */}
                <div>
                  <h3 className="font-medium text-sm text-gray-700 mb-2">관련 텍스트 ({scenario.graphData.textChunks.length})</h3>
                  <div className="space-y-2">
                    {scenario.graphData.textChunks.map((chunk, idx) => (
                      <div key={idx} className="text-xs bg-blue-50 text-blue-800 px-3 py-2 rounded">
                        "{chunk}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 생성된 답변 */}
            {generatedAnswer && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">💬 생성된 답변</h2>
                <div className={`p-4 rounded-lg ${
                  mode === 'custom'
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50'
                    : 'bg-gradient-to-r from-indigo-50 to-purple-50'
                }`}>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                    {generatedAnswer}
                  </div>
                </div>
                {mode === 'custom' && (
                  <p className="mt-3 text-xs text-purple-600">
                    ⚠️ 이것은 키워드 기반 시뮬레이션입니다. 실제 GraphRAG 시스템은 LLM + Knowledge Graph를 사용하여 더 정교한 답변을 생성합니다.
                  </p>
                )}
              </div>
            )}

            {/* 설명 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📚 GraphRAG란?</h2>
              <div className="prose prose-sm max-w-none">
                <p>
                  <strong>GraphRAG</strong>는 Knowledge Graph와 RAG(Retrieval-Augmented Generation)를
                  결합한 방식입니다. 기존 벡터 기반 RAG의 한계를 극복합니다.
                </p>

                <h3>기존 RAG vs GraphRAG</h3>
                <table className="text-sm">
                  <thead>
                    <tr>
                      <th>항목</th>
                      <th>기존 RAG</th>
                      <th>GraphRAG</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>검색 방식</td>
                      <td>벡터 유사도</td>
                      <td>그래프 탐색 + 벡터</td>
                    </tr>
                    <tr>
                      <td>관계 표현</td>
                      <td>암묵적</td>
                      <td>명시적 (엣지)</td>
                    </tr>
                    <tr>
                      <td>다단계 추론</td>
                      <td>제한적</td>
                      <td>그래프 순회로 가능</td>
                    </tr>
                    <tr>
                      <td>설명 가능성</td>
                      <td>낮음</td>
                      <td>높음 (경로 추적)</td>
                    </tr>
                  </tbody>
                </table>

                <h3>파이프라인 단계</h3>
                <ol>
                  <li><strong>엔티티 추출</strong>: NER로 질문에서 핵심 개체 식별</li>
                  <li><strong>그래프 탐색</strong>: 추출된 엔티티를 시작점으로 관련 노드/엣지 탐색</li>
                  <li><strong>컨텍스트 구성</strong>: 그래프 구조 + 관련 텍스트 청크 결합</li>
                  <li><strong>답변 생성</strong>: 풍부한 컨텍스트로 LLM이 정확한 답변 생성</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
