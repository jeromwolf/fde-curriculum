'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ragScenarios, type ScenarioKey } from '@/components/simulators/rag-pipeline/sampleDocuments'
import type { RAGPipelineStep, Chunk, SearchResult, Document } from '@/components/simulators/rag-pipeline/types'

// 파이프라인 단계 정의
const initialSteps: RAGPipelineStep[] = [
  { id: 'chunk', name: '1. 문서 청킹', description: '문서를 작은 조각으로 분할', status: 'pending' },
  { id: 'embed', name: '2. 임베딩 생성', description: '청크를 벡터로 변환', status: 'pending' },
  { id: 'query', name: '3. 질문 임베딩', description: '질문을 벡터로 변환', status: 'pending' },
  { id: 'search', name: '4. 유사도 검색', description: '가장 관련있는 청크 찾기', status: 'pending' },
  { id: 'generate', name: '5. 답변 생성', description: 'LLM으로 최종 답변 생성', status: 'pending' },
]

// 간단한 텍스트 청킹 함수
function chunkText(text: string, chunkSize: number): string[] {
  const sentences = text.split(/[.!?]\s+/)
  const chunks: string[] = []
  let currentChunk = ''

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim())
      currentChunk = sentence + '. '
    } else {
      currentChunk += sentence + '. '
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }
  return chunks
}

// 간단한 유사도 계산 (키워드 매칭 기반)
function calculateSimilarity(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/)
  const textWords = text.toLowerCase()
  let matches = 0
  for (const word of queryWords) {
    if (word.length > 1 && textWords.includes(word)) {
      matches++
    }
  }
  // 0-1 범위로 정규화
  return Math.min(matches / Math.max(queryWords.length, 1), 1) * 0.6 + Math.random() * 0.3
}

// 간단한 답변 생성 (시뮬레이션)
function generateAnswer(query: string, contexts: SearchResult[]): string {
  if (contexts.length === 0) {
    return '관련 정보를 찾을 수 없습니다.'
  }

  const topContext = contexts[0]
  const relevantText = topContext.chunk.text

  // 질문 유형에 따른 답변 생성 시뮬레이션
  const q = query.toLowerCase()

  if (q.includes('무엇') || q.includes('뭐') || q.includes('란')) {
    return `${relevantText}\n\n(출처: ${topContext.documentTitle})`
  }

  if (q.includes('어떻게') || q.includes('방법')) {
    return `다음과 같이 진행하시면 됩니다:\n\n${relevantText}\n\n(출처: ${topContext.documentTitle})`
  }

  if (q.includes('얼마') || q.includes('며칠') || q.includes('몇')) {
    return `관련 정보입니다:\n\n${relevantText}\n\n(출처: ${topContext.documentTitle})`
  }

  return `질문에 대한 답변입니다:\n\n${relevantText}\n\n참고한 문서: ${contexts.map(c => c.documentTitle).join(', ')}`
}

// 텍스트 파일 읽기 함수 (PDF 대신 TXT 지원)
async function extractTextFromFile(file: File): Promise<string> {
  // TXT 파일만 지원 (PDF는 서버사이드에서만 가능)
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return await file.text()
  }

  // PDF는 현재 지원하지 않음 (향후 서버 API로 구현 예정)
  if (file.type === 'application/pdf') {
    throw new Error('PDF 파일은 현재 지원되지 않습니다. TXT 파일을 업로드해주세요.')
  }

  throw new Error('지원하지 않는 파일 형식입니다. TXT 파일을 업로드해주세요.')
}

export default function RAGPipelinePage() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('tech')
  const [steps, setSteps] = useState<RAGPipelineStep[]>(initialSteps)
  const [currentStep, setCurrentStep] = useState<number>(-1)
  const [isRunning, setIsRunning] = useState(false)
  const [chunks, setChunks] = useState<Chunk[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [generatedAnswer, setGeneratedAnswer] = useState<string>('')
  const [selectedQuery, setSelectedQuery] = useState<string>('')
  const [customQuery, setCustomQuery] = useState('')
  const [mode, setMode] = useState<'sample' | 'custom'>('sample')
  const [uploadedDoc, setUploadedDoc] = useState<Document | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [docSource, setDocSource] = useState<'scenario' | 'upload'>('scenario')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scenario = ragScenarios[selectedScenario]

  // 파일 업로드 처리 (TXT 지원)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const text = await extractTextFromFile(file)
      setUploadedDoc({
        id: 'uploaded',
        title: file.name.replace(/\.(txt|pdf)$/i, ''),
        content: text,
        source: file.name
      })
      setDocSource('upload')
      // 기존 결과 초기화
      setChunks([])
      setSearchResults([])
      setGeneratedAnswer('')
      setSelectedQuery('')
    } catch (error) {
      console.error('파일 파싱 오류:', error)
      alert(error instanceof Error ? error.message : '파일을 읽는 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  // 파이프라인 실행
  const runPipeline = async (query: string, isCustom: boolean = false) => {
    if (!query.trim()) return

    // 업로드 모드인데 문서가 없으면 경고
    if (docSource === 'upload' && !uploadedDoc) {
      alert('먼저 PDF 파일을 업로드해주세요.')
      return
    }

    setMode(isCustom ? 'custom' : 'sample')
    setSelectedQuery(query)
    setIsRunning(true)
    setSteps(initialSteps)
    setCurrentStep(0)
    setChunks([])
    setSearchResults([])
    setGeneratedAnswer('')

    // 사용할 문서 결정
    const documents = docSource === 'upload' && uploadedDoc
      ? [uploadedDoc]
      : scenario.documents
    const chunkSize = docSource === 'upload' ? 200 : scenario.chunkSize

    // Step 1: 문서 청킹
    await simulateStep(0, `${documents.length}개 문서`, '')
    const allChunks: Chunk[] = []
    let chunkId = 0
    for (const doc of documents) {
      const textChunks = chunkText(doc.content, chunkSize)
      for (const text of textChunks) {
        allChunks.push({
          id: `chunk-${chunkId++}`,
          documentId: doc.id,
          text,
          startIndex: 0,
          endIndex: text.length,
        })
      }
    }
    setChunks(allChunks)
    setSteps(prev => prev.map((s, i) =>
      i === 0 ? { ...s, status: 'completed', output: `${allChunks.length}개 청크 생성`, duration: 120 + Math.random() * 80 } : s
    ))

    // Step 2: 임베딩 생성
    await simulateStep(1, `${allChunks.length}개 청크`, '')
    setSteps(prev => prev.map((s, i) =>
      i === 1 ? { ...s, status: 'completed', output: `${allChunks.length}개 벡터 생성 (768차원)`, duration: 200 + Math.random() * 100 } : s
    ))

    // Step 3: 질문 임베딩
    await simulateStep(2, query, '')
    setSteps(prev => prev.map((s, i) =>
      i === 2 ? { ...s, status: 'completed', output: '질문 벡터 생성 완료', duration: 50 + Math.random() * 30 } : s
    ))

    // Step 4: 유사도 검색
    const topK = docSource === 'upload' ? 3 : scenario.topK
    await simulateStep(3, `Top-${topK} 검색`, '')
    const results: SearchResult[] = allChunks
      .map(chunk => {
        const doc = documents.find(d => d.id === chunk.documentId)
        return {
          chunk,
          similarity: calculateSimilarity(query, chunk.text),
          documentTitle: doc?.title || 'Unknown'
        }
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
    setSearchResults(results)
    setSteps(prev => prev.map((s, i) =>
      i === 3 ? { ...s, status: 'completed', output: `상위 ${results.length}개 청크 검색 완료`, duration: 30 + Math.random() * 20 } : s
    ))

    // Step 5: 답변 생성
    await simulateStep(4, '컨텍스트 + 질문 → LLM', '')
    const answer = generateAnswer(query, results)
    setGeneratedAnswer(answer)
    setSteps(prev => prev.map((s, i) =>
      i === 4 ? { ...s, status: 'completed', output: '답변 생성 완료', duration: 300 + Math.random() * 200 } : s
    ))

    setIsRunning(false)
  }

  // 단계 시뮬레이션
  const simulateStep = async (stepIndex: number, input: string, output: string) => {
    setCurrentStep(stepIndex)
    setSteps(prev => prev.map((s, i) =>
      i === stepIndex ? { ...s, status: 'running', input } : s
    ))
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))
  }

  // 시나리오 변경
  const handleScenarioChange = (key: ScenarioKey) => {
    setSelectedScenario(key)
    setSteps(initialSteps)
    setCurrentStep(-1)
    setChunks([])
    setSearchResults([])
    setGeneratedAnswer('')
    setSelectedQuery('')
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
                  RAG Pipeline Simulator
                </h1>
                <p className="text-sm text-gray-500">
                  Retrieval-Augmented Generation 파이프라인 시뮬레이션
                </p>
              </div>
            </div>
            <Link
              href="/simulators/graphrag-pipeline"
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200"
            >
              GraphRAG와 비교하기 →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 시나리오 & 파이프라인 */}
          <div className="space-y-6">
            {/* 문서 소스 선택 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📚 문서 소스</h2>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setDocSource('scenario')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    docSource === 'scenario'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  샘플 문서
                </button>
                <button
                  onClick={() => setDocSource('upload')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    docSource === 'upload'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  파일 업로드
                </button>
              </div>

              {docSource === 'scenario' ? (
                <div className="space-y-2">
                  {(Object.keys(ragScenarios) as ScenarioKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => handleScenarioChange(key)}
                      disabled={isRunning}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedScenario === key
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="font-medium">{ragScenarios[key].name}</div>
                      <div className="text-xs text-gray-500">
                        {ragScenarios[key].description}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {ragScenarios[key].documents.length}개 문서
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isRunning}
                    className={`w-full py-4 border-2 border-dashed rounded-lg transition-colors ${
                      isUploading
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-green-400 hover:border-green-500 hover:bg-green-50'
                    }`}
                  >
                    {isUploading ? (
                      <span className="text-gray-500">⏳ 파일 분석 중...</span>
                    ) : (
                      <span className="text-green-600">📄 TXT 파일 선택</span>
                    )}
                  </button>

                  {uploadedDoc && (
                    <div className={`p-3 rounded-lg border ${
                      uploadedDoc.content.length > 0
                        ? 'bg-green-50 border-green-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className={`font-medium text-sm ${
                        uploadedDoc.content.length > 0 ? 'text-green-800' : 'text-yellow-800'
                      }`}>
                        {uploadedDoc.content.length > 0 ? '✅' : '⚠️'} {uploadedDoc.title}
                      </div>
                      <div className={`text-xs mt-1 ${
                        uploadedDoc.content.length > 0 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {uploadedDoc.content.length > 0
                          ? `${uploadedDoc.content.length.toLocaleString()}자 추출됨`
                          : '텍스트 추출 실패 (이미지 PDF일 수 있음)'}
                      </div>
                      {uploadedDoc.content.length > 0 ? (
                        <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {uploadedDoc.content.slice(0, 150)}...
                        </div>
                      ) : (
                        <div className="text-xs text-yellow-700 mt-2">
                          텍스트가 포함된 PDF를 업로드해주세요
                        </div>
                      )}
                    </div>
                  )}

                  {!uploadedDoc && (
                    <p className="text-xs text-gray-500 text-center">
                      TXT 파일을 업로드하면 내용을 읽어<br />RAG 파이프라인을 테스트할 수 있습니다.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 파이프라인 단계 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">⚡ 파이프라인 단계</h2>
              <div className="space-y-3">
                {steps.map((step) => (
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
            </div>

            {/* 직접 입력 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">✏️ 직접 질문하기</h2>
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="문서에 대해 질문하세요..."
                className="w-full h-20 p-3 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isRunning}
              />
              <button
                onClick={() => runPipeline(customQuery, true)}
                disabled={isRunning || !customQuery.trim()}
                className={`w-full mt-3 py-2 rounded-lg font-medium transition-colors ${
                  isRunning || !customQuery.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isRunning && mode === 'custom' ? '⏳ 검색 중...' : '🔍 RAG 검색'}
              </button>
            </div>
          </div>

          {/* 오른쪽: 결과 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 샘플 질문 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">❓ 샘플 질문</h2>
              <div className="flex flex-wrap gap-2">
                {scenario.sampleQueries.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => runPipeline(query, false)}
                    disabled={isRunning}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      selectedQuery === query
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {query}
                  </button>
                ))}
              </div>
              {selectedQuery && (
                <div className={`mt-4 p-4 rounded-lg ${mode === 'custom' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <div className="flex gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${mode === 'sample' ? 'bg-gray-200' : 'bg-blue-200'}`}>
                      {mode === 'sample' ? '샘플' : '직접 입력'}
                    </span>
                  </div>
                  <p className="font-medium">"{selectedQuery}"</p>
                </div>
              )}
            </div>

            {/* 청킹 결과 */}
            {chunks.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">📄 생성된 청크 ({chunks.length}개)</h2>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {chunks.slice(0, 6).map((chunk, idx) => (
                    <div key={chunk.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>청크 #{idx + 1}</span>
                        <span>{chunk.text.length}자</span>
                      </div>
                      <p className="text-gray-700 line-clamp-2">{chunk.text}</p>
                    </div>
                  ))}
                  {chunks.length > 6 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      ... 외 {chunks.length - 6}개 청크
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 검색 결과 */}
            {searchResults.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">🎯 검색 결과 (Top-{searchResults.length})</h2>
                <div className="space-y-3">
                  {searchResults.map((result, idx) => (
                    <div key={result.chunk.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-blue-600">
                          #{idx + 1} - {result.documentTitle}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          result.similarity > 0.7 ? 'bg-green-100 text-green-700' :
                          result.similarity > 0.5 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          유사도: {(result.similarity * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{result.chunk.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 생성된 답변 */}
            {generatedAnswer && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">💬 생성된 답변</h2>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                    {generatedAnswer}
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  ⚠️ 이것은 키워드 기반 시뮬레이션입니다. 실제 RAG 시스템은 LLM을 사용하여 더 정교한 답변을 생성합니다.
                </p>
              </div>
            )}

            {/* 설명 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📚 RAG란?</h2>
              <div className="prose prose-sm max-w-none">
                <p>
                  <strong>RAG (Retrieval-Augmented Generation)</strong>는 LLM의 한계를 극복하기 위한 기술입니다.
                  외부 지식 베이스에서 관련 정보를 검색하여 LLM에 제공합니다.
                </p>

                <h3>RAG 파이프라인 단계</h3>
                <ol>
                  <li><strong>문서 청킹</strong>: 긴 문서를 검색 가능한 작은 조각으로 분할</li>
                  <li><strong>임베딩 생성</strong>: 각 청크를 벡터로 변환 (예: OpenAI text-embedding-3)</li>
                  <li><strong>벡터 저장</strong>: 벡터 DB에 저장 (Pinecone, Chroma, Milvus 등)</li>
                  <li><strong>유사도 검색</strong>: 질문과 가장 유사한 청크 검색</li>
                  <li><strong>답변 생성</strong>: 검색된 컨텍스트와 질문을 LLM에 전달</li>
                </ol>

                <h3>RAG vs GraphRAG</h3>
                <table className="text-sm">
                  <thead>
                    <tr>
                      <th>항목</th>
                      <th>RAG</th>
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
                      <td>암묵적 (텍스트 내)</td>
                      <td>명시적 (엣지)</td>
                    </tr>
                    <tr>
                      <td>다단계 추론</td>
                      <td>제한적</td>
                      <td>그래프 순회로 가능</td>
                    </tr>
                    <tr>
                      <td>구현 복잡도</td>
                      <td>낮음</td>
                      <td>높음</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
