'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  RAGStudioProps,
  RAGConfig,
  Document,
  Chunk,
  SearchResult,
  ChunkingStrategy,
} from './types'
import {
  sampleDatasets,
  defaultConfig,
  chunkingStrategies,
  embeddingModels,
  retrievalMethods,
  chunkText,
  countTokens,
  calculateSimilarity,
  generatePrompt,
  generateSimulatedResponse,
} from './sampleData'

export function RAGStudio({
  showConfig = true,
  showVisualization = true,
}: RAGStudioProps) {
  const [selectedDataset, setSelectedDataset] = useState(sampleDatasets[0].id)
  const [config, setConfig] = useState<RAGConfig>(defaultConfig)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'documents' | 'chunks' | 'search' | 'generate'>('documents')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [generatedResponse, setGeneratedResponse] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedChunk, setSelectedChunk] = useState<Chunk | null>(null)

  const currentDataset = useMemo(() => {
    return sampleDatasets.find((d) => d.id === selectedDataset) || sampleDatasets[0]
  }, [selectedDataset])

  // 문서를 청크로 분할
  const chunks = useMemo(() => {
    const allChunks: Chunk[] = []
    let chunkId = 0

    currentDataset.documents.forEach((doc) => {
      const docChunks = chunkText(
        doc.content,
        config.chunkingStrategy,
        config.chunkSize,
        config.chunkOverlap
      )

      docChunks.forEach((chunk) => {
        allChunks.push({
          id: `chunk-${chunkId++}`,
          documentId: doc.id,
          content: chunk.content,
          startIndex: chunk.start,
          endIndex: chunk.end,
          tokens: countTokens(chunk.content),
        })
      })
    })

    return allChunks
  }, [currentDataset, config.chunkingStrategy, config.chunkSize, config.chunkOverlap])

  // 검색 실행
  const handleSearch = useCallback(() => {
    if (!query.trim()) return

    setIsProcessing(true)
    setActiveTab('search')

    // 시뮬레이션된 지연
    setTimeout(() => {
      const results: SearchResult[] = chunks
        .map((chunk) => ({
          chunk,
          score: calculateSimilarity(query, chunk.content),
        }))
        .filter((r) => r.score >= config.similarityThreshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, config.topK)

      setSearchResults(results)
      setIsProcessing(false)
    }, 500)
  }, [query, chunks, config.similarityThreshold, config.topK])

  // 응답 생성
  const handleGenerate = useCallback(() => {
    if (searchResults.length === 0) {
      alert('먼저 검색을 실행하세요.')
      return
    }

    setIsProcessing(true)
    setActiveTab('generate')

    setTimeout(() => {
      const contexts = searchResults.map((r) => r.chunk.content)
      const prompt = generatePrompt(query, contexts)
      const response = generateSimulatedResponse(query, contexts)

      setGeneratedPrompt(prompt)
      setGeneratedResponse(response)
      setIsProcessing(false)
    }, 800)
  }, [query, searchResults])

  // 샘플 쿼리 선택
  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery)
    setSearchResults([])
    setGeneratedPrompt('')
    setGeneratedResponse('')
  }

  return (
    <div className="h-full flex flex-col">
      {/* 툴바 */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 데이터셋 선택 */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">데이터셋:</label>
            <select
              value={selectedDataset}
              onChange={(e) => {
                setSelectedDataset(e.target.value)
                setSearchResults([])
                setGeneratedPrompt('')
                setGeneratedResponse('')
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            >
              {sampleDatasets.map((dataset) => (
                <option key={dataset.id} value={dataset.id}>
                  {dataset.name}
                </option>
              ))}
            </select>
          </div>

          {/* 통계 */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              <span className="font-medium">{currentDataset.documents.length}</span> 문서
            </span>
            <span>
              <span className="font-medium">{chunks.length}</span> 청크
            </span>
            <span>
              <span className="font-medium">
                {chunks.reduce((acc, c) => acc + c.tokens, 0).toLocaleString()}
              </span> 토큰
            </span>
          </div>

          {/* 탭 버튼 */}
          <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-1">
            {(['documents', 'chunks', 'search', 'generate'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white shadow text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'documents' && '문서'}
                {tab === 'chunks' && '청크'}
                {tab === 'search' && '검색'}
                {tab === 'generate' && '생성'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측: 설정 패널 */}
        {showConfig && (
          <div className="w-72 border-r border-gray-200 bg-white p-4 overflow-auto">
            <h3 className="font-semibold text-gray-900 mb-4">RAG 설정</h3>

            {/* 청킹 전략 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                청킹 전략
              </label>
              <select
                value={config.chunkingStrategy}
                onChange={(e) =>
                  setConfig({ ...config, chunkingStrategy: e.target.value as ChunkingStrategy })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {Object.entries(chunkingStrategies).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {chunkingStrategies[config.chunkingStrategy].description}
              </p>
            </div>

            {/* 청크 크기 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                청크 크기: {config.chunkSize}자
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={config.chunkSize}
                onChange={(e) =>
                  setConfig({ ...config, chunkSize: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* 오버랩 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                오버랩: {config.chunkOverlap}자
              </label>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={config.chunkOverlap}
                onChange={(e) =>
                  setConfig({ ...config, chunkOverlap: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* 임베딩 모델 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                임베딩 모델
              </label>
              <select
                value={config.embeddingModel}
                onChange={(e) =>
                  setConfig({ ...config, embeddingModel: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {Object.entries(embeddingModels).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name} ({value.dimensions}d)
                  </option>
                ))}
              </select>
            </div>

            {/* 검색 방법 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                검색 방법
              </label>
              <select
                value={config.retrievalMethod}
                onChange={(e) =>
                  setConfig({ ...config, retrievalMethod: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {Object.entries(retrievalMethods).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Top-K */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Top-K: {config.topK}개
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={config.topK}
                onChange={(e) =>
                  setConfig({ ...config, topK: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* 유사도 임계값 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                유사도 임계값: {(config.similarityThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.similarityThreshold * 100}
                onChange={(e) =>
                  setConfig({ ...config, similarityThreshold: parseInt(e.target.value) / 100 })
                }
                className="w-full"
              />
            </div>

            {/* 샘플 쿼리 */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">샘플 쿼리</h4>
              <div className="space-y-2">
                {currentDataset.sampleQueries.map((sq) => (
                  <button
                    key={sq.id}
                    onClick={() => handleSampleQuery(sq.query)}
                    className="w-full text-left px-3 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm text-purple-700 transition-colors"
                  >
                    {sq.query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 우측: 메인 영역 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 검색 바 */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="질문을 입력하세요..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                onClick={handleSearch}
                disabled={isProcessing || !query.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                검색
              </button>
              <button
                onClick={handleGenerate}
                disabled={isProcessing || searchResults.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                생성
              </button>
            </div>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'documents' && (
              <DocumentsView documents={currentDataset.documents} />
            )}
            {activeTab === 'chunks' && (
              <ChunksView
                chunks={chunks}
                documents={currentDataset.documents}
                selectedChunk={selectedChunk}
                onSelectChunk={setSelectedChunk}
              />
            )}
            {activeTab === 'search' && (
              <SearchView
                results={searchResults}
                documents={currentDataset.documents}
                isProcessing={isProcessing}
                query={query}
              />
            )}
            {activeTab === 'generate' && (
              <GenerateView
                prompt={generatedPrompt}
                response={generatedResponse}
                isProcessing={isProcessing}
              />
            )}
          </div>
        </div>
      </div>

      {/* 파이프라인 시각화 */}
      {showVisualization && (
        <div className="bg-gray-50 border-t border-gray-200 p-3">
          <div className="flex items-center justify-center gap-2 text-xs">
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              <span>📄</span>
              <span>Documents</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
              <span>✂️</span>
              <span>Chunking</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
              <span>🔢</span>
              <span>Embedding</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
              <span>🔍</span>
              <span>Vector Search</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full">
              <span>🤖</span>
              <span>LLM Generation</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 문서 뷰
function DocumentsView({ documents }: { documents: Document[] }) {
  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div key={doc.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{doc.title}</h3>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                {doc.metadata.category}
              </span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">
                {doc.metadata.source}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-6">
            {doc.content}
          </p>
          <div className="mt-2 text-xs text-gray-400">
            {doc.content.length}자 · {countTokens(doc.content)} 토큰
          </div>
        </div>
      ))}
    </div>
  )
}

// 청크 뷰
function ChunksView({
  chunks,
  documents,
  selectedChunk,
  onSelectChunk,
}: {
  chunks: Chunk[]
  documents: Document[]
  selectedChunk: Chunk | null
  onSelectChunk: (chunk: Chunk | null) => void
}) {
  const getDocumentTitle = (docId: string) => {
    return documents.find((d) => d.id === docId)?.title || docId
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {chunks.map((chunk, index) => (
        <button
          key={chunk.id}
          onClick={() => onSelectChunk(selectedChunk?.id === chunk.id ? null : chunk)}
          className={`text-left p-4 rounded-lg border-2 transition-all ${
            selectedChunk?.id === chunk.id
              ? 'border-purple-400 bg-purple-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-purple-600">Chunk #{index + 1}</span>
            <span className="text-xs text-gray-500">{chunk.tokens} tokens</span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-4">{chunk.content}</p>
          <div className="mt-2 text-xs text-gray-400">
            from: {getDocumentTitle(chunk.documentId)}
          </div>
        </button>
      ))}
    </div>
  )
}

// 검색 뷰
function SearchView({
  results,
  documents,
  isProcessing,
  query,
}: {
  results: SearchResult[]
  documents: Document[]
  isProcessing: boolean
  query: string
}) {
  const getDocumentTitle = (docId: string) => {
    return documents.find((d) => d.id === docId)?.title || docId
  }

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">검색 중...</p>
        </div>
      </div>
    )
  }

  if (!query) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        질문을 입력하고 검색 버튼을 클릭하세요.
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        검색 결과가 없습니다. 다른 질문을 시도해보세요.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        {results.length}개의 관련 청크를 찾았습니다.
      </div>
      {results.map((result, index) => (
        <div
          key={result.chunk.id}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                #{index + 1}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {getDocumentTitle(result.chunk.documentId)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${result.score * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-purple-600">
                {(result.score * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {result.chunk.content}
          </p>
        </div>
      ))}
    </div>
  )
}

// 생성 뷰
function GenerateView({
  prompt,
  response,
  isProcessing,
}: {
  prompt: string
  response: string
  isProcessing: boolean
}) {
  if (isProcessing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">응답 생성 중...</p>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        검색을 먼저 실행한 후, 생성 버튼을 클릭하세요.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 프롬프트 */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Prompt</span>
          생성된 프롬프트
        </h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-auto max-h-80">
          {prompt}
        </pre>
      </div>

      {/* 응답 */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Response</span>
          LLM 응답 (시뮬레이션)
        </h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-gray-800 whitespace-pre-line">{response}</p>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          * 실제 서비스에서는 OpenAI GPT-4, Claude 등의 LLM API를 호출합니다.
        </p>
      </div>
    </div>
  )
}

export default RAGStudio
