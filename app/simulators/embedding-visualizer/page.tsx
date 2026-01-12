'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { sampleDatasets, type DatasetKey } from '@/components/simulators/embedding-visualizer/sampleEmbeddings'
import type { EmbeddingPoint } from '@/components/simulators/embedding-visualizer/types'

// Three.js는 SSR에서 동작하지 않으므로 동적 임포트
const EmbeddingVisualizer3D = dynamic(
  () => import('@/components/simulators/embedding-visualizer/EmbeddingVisualizer3D'),
  { ssr: false, loading: () => <div className="h-[500px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">3D 시각화 로딩 중...</div> }
)

// 코사인 유사도 계산
function cosineSimilarity(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }): number {
  const dotProduct = a.x * b.x + a.y * b.y + a.z * b.z
  const magnitudeA = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)
  const magnitudeB = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z)
  return dotProduct / (magnitudeA * magnitudeB)
}

export default function EmbeddingVisualizerPage() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetKey>('words')
  const [highlightCategory, setHighlightCategory] = useState<string | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<EmbeddingPoint | null>(null)
  const [showLabels, setShowLabels] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const currentDataset = sampleDatasets[selectedDataset]

  // 선택된 포인트와 유사한 포인트 찾기
  const similarPoints = useMemo(() => {
    if (!selectedPoint) return []

    return currentDataset.points
      .filter(p => p.id !== selectedPoint.id)
      .map(p => ({
        point: p,
        similarity: cosineSimilarity(selectedPoint.coordinates, p.coordinates)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
  }, [selectedPoint, currentDataset.points])

  // 검색 결과
  const searchResults = useMemo(() => {
    if (!searchQuery) return []
    const query = searchQuery.toLowerCase()
    return currentDataset.points.filter(p =>
      p.text.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
  }, [searchQuery, currentDataset.points])

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
                  Embedding Visualizer
                </h1>
                <p className="text-sm text-gray-500">
                  Phase 3 Week 5 - 벡터 임베딩 시각화
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 왼쪽: 컨트롤 패널 */}
          <div className="space-y-6">
            {/* 데이터셋 선택 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📊 데이터셋</h2>
              <div className="space-y-2">
                {(Object.keys(sampleDatasets) as DatasetKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedDataset(key)
                      setSelectedPoint(null)
                      setHighlightCategory(null)
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedDataset === key
                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="font-medium">{sampleDatasets[key].name}</div>
                    <div className="text-xs text-gray-500">
                      {sampleDatasets[key].description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">🏷️ 카테고리 필터</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setHighlightCategory(null)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    highlightCategory === null
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  전체
                </button>
                {currentDataset.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setHighlightCategory(cat)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      highlightCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 설정 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">⚙️ 설정</h2>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">라벨 표시</span>
              </label>
            </div>

            {/* 검색 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">🔍 검색</h2>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="단어/문장 검색..."
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              {searchResults.length > 0 && (
                <div className="mt-2 space-y-1">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPoint(p)}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      {p.text} <span className="text-gray-400">({p.category})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 시각화 영역 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 3D 시각화 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                🌐 {currentDataset.name} - 3D 시각화
              </h2>
              <div className="h-[500px] rounded-lg overflow-hidden border">
                <EmbeddingVisualizer3D
                  dataset={currentDataset}
                  onPointClick={setSelectedPoint}
                  highlightCategory={highlightCategory || undefined}
                  showLabels={showLabels}
                />
              </div>
            </div>

            {/* 유사도 결과 */}
            {selectedPoint && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">
                  📐 "{selectedPoint.text}"와 유사한 항목
                </h2>
                <div className="space-y-2">
                  {similarPoints.map(({ point, similarity }) => (
                    <div
                      key={point.id}
                      className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{point.text}</span>
                        <span className="ml-2 text-xs text-gray-500">({point.category})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500"
                            style={{ width: `${Math.max(0, similarity) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono w-16 text-right">
                          {(similarity * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 설명 카드 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📚 임베딩이란?</h2>
              <div className="prose prose-sm max-w-none">
                <p>
                  <strong>임베딩(Embedding)</strong>은 단어, 문장, 이미지 등을
                  고정된 크기의 벡터(숫자 배열)로 변환하는 기술입니다.
                </p>

                <h3>핵심 개념</h3>
                <ul>
                  <li><strong>벡터 공간</strong>: 의미가 유사한 항목은 가까운 위치에 배치됩니다</li>
                  <li><strong>코사인 유사도</strong>: 두 벡터 사이의 각도로 유사도를 측정합니다</li>
                  <li><strong>차원 축소</strong>: 고차원 벡터를 2D/3D로 시각화합니다 (t-SNE, UMAP)</li>
                </ul>

                <h3>유명한 예제: King - Man + Woman = Queen</h3>
                <p>
                  Word2Vec에서 발견된 흥미로운 특성입니다.
                  "왕"에서 "남자" 의미를 빼고 "여자" 의미를 더하면 "여왕"에 가까운 벡터가 됩니다.
                  이는 임베딩이 의미적 관계를 수학적으로 표현할 수 있음을 보여줍니다.
                </p>

                <h3>활용 분야</h3>
                <ul>
                  <li><strong>검색</strong>: 유사한 문서/상품 찾기</li>
                  <li><strong>추천</strong>: 비슷한 취향의 콘텐츠 추천</li>
                  <li><strong>RAG</strong>: 관련 문서를 찾아 LLM에 제공</li>
                  <li><strong>분류</strong>: 텍스트/이미지 카테고리 분류</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
