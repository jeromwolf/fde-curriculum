'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { runAlgorithm } from '@/components/simulators/graph-algorithms/algorithms'
import { sampleGraphs, type SampleGraphKey } from '@/components/simulators/graph-algorithms/sampleGraphs'
import type { Graph, AlgorithmResult, AlgorithmConfig, AlgorithmType } from '@/components/simulators/graph-algorithms/types'

// vis-network는 SSR에서 동작하지 않으므로 동적 임포트
const GraphVisualizer = dynamic(
  () => import('@/components/simulators/graph-algorithms/GraphVisualizer'),
  { ssr: false, loading: () => <div className="h-[500px] bg-gray-100 animate-pulse rounded-lg" /> }
)

const algorithms: { id: AlgorithmType; name: string; description: string }[] = [
  {
    id: 'degree',
    name: 'Degree Centrality',
    description: '노드의 연결 수를 기반으로 중요도 측정'
  },
  {
    id: 'pagerank',
    name: 'PageRank',
    description: '링크 구조 기반 중요도 (Google 알고리즘)'
  },
  {
    id: 'betweenness',
    name: 'Betweenness Centrality',
    description: '최단 경로에 얼마나 자주 등장하는지 측정'
  },
  {
    id: 'closeness',
    name: 'Closeness Centrality',
    description: '다른 모든 노드까지의 평균 거리 기반'
  },
  {
    id: 'community',
    name: 'Community Detection',
    description: 'Label Propagation으로 커뮤니티 탐지'
  },
  {
    id: 'shortestPath',
    name: 'Shortest Path',
    description: 'Dijkstra 알고리즘으로 최단 경로 탐색'
  }
]

export default function GraphAlgorithmsPage() {
  const [selectedGraph, setSelectedGraph] = useState<SampleGraphKey>('social')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('degree')
  const [algorithmResult, setAlgorithmResult] = useState<AlgorithmResult | null>(null)
  const [config, setConfig] = useState<AlgorithmConfig>({
    dampingFactor: 0.85,
    iterations: 20,
    sourceNode: '',
    targetNode: ''
  })
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const currentGraph = sampleGraphs[selectedGraph].graph

  // 알고리즘 실행
  const handleRunAlgorithm = () => {
    const finalConfig = { ...config }

    // 최단 경로일 때 기본값 설정
    if (selectedAlgorithm === 'shortestPath') {
      if (!finalConfig.sourceNode) {
        finalConfig.sourceNode = currentGraph.nodes[0]?.id
      }
      if (!finalConfig.targetNode) {
        finalConfig.targetNode = currentGraph.nodes[currentGraph.nodes.length - 1]?.id
      }
    }

    const result = runAlgorithm(selectedAlgorithm, currentGraph, finalConfig)
    setAlgorithmResult(result)
  }

  // 그래프 변경 시 결과 초기화
  const handleGraphChange = (key: SampleGraphKey) => {
    setSelectedGraph(key)
    setAlgorithmResult(null)
    setConfig(prev => ({ ...prev, sourceNode: '', targetNode: '' }))
  }

  // 상위 N개 노드 랭킹
  const topNodes = useMemo(() => {
    if (!algorithmResult || algorithmResult.type === 'shortestPath') return []

    const entries: [string, number][] = []
    algorithmResult.nodes.forEach((score, id) => {
      entries.push([id, score])
    })

    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, score]) => ({
        id,
        label: currentGraph.nodes.find(n => n.id === id)?.label || id,
        score
      }))
  }, [algorithmResult, currentGraph.nodes])

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
                  Graph Algorithms 시뮬레이터
                </h1>
                <p className="text-sm text-gray-500">
                  Phase 3 Week 3 - 그래프 알고리즘 학습
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 컨트롤 패널 */}
          <div className="space-y-6">
            {/* 그래프 선택 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📊 샘플 그래프</h2>
              <div className="space-y-2">
                {(Object.keys(sampleGraphs) as SampleGraphKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleGraphChange(key)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedGraph === key
                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="font-medium">{sampleGraphs[key].name}</div>
                    <div className="text-xs text-gray-500">
                      {sampleGraphs[key].description}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {sampleGraphs[key].graph.nodes.length}개 노드, {sampleGraphs[key].graph.edges.length}개 엣지
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 알고리즘 선택 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">🧮 알고리즘</h2>
              <div className="space-y-2">
                {algorithms.map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => {
                      setSelectedAlgorithm(algo.id)
                      setAlgorithmResult(null)
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedAlgorithm === algo.id
                        ? 'bg-green-100 text-green-700 border-2 border-green-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="font-medium">{algo.name}</div>
                    <div className="text-xs text-gray-500">{algo.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 알고리즘 설정 */}
            {selectedAlgorithm === 'pagerank' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">⚙️ PageRank 설정</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Damping Factor (d)
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="0.99"
                      step="0.01"
                      value={config.dampingFactor}
                      onChange={(e) => setConfig({ ...config, dampingFactor: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500 text-center">
                      {config.dampingFactor?.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      반복 횟수
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={config.iterations}
                      onChange={(e) => setConfig({ ...config, iterations: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedAlgorithm === 'shortestPath' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">⚙️ 최단 경로 설정</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      출발 노드
                    </label>
                    <select
                      value={config.sourceNode}
                      onChange={(e) => setConfig({ ...config, sourceNode: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">선택하세요</option>
                      {currentGraph.nodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      도착 노드
                    </label>
                    <select
                      value={config.targetNode}
                      onChange={(e) => setConfig({ ...config, targetNode: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">선택하세요</option>
                      {currentGraph.nodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 실행 버튼 */}
            <button
              onClick={handleRunAlgorithm}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              🚀 알고리즘 실행
            </button>
          </div>

          {/* 오른쪽: 시각화 영역 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 그래프 시각화 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                🔗 {sampleGraphs[selectedGraph].name}
              </h2>
              <GraphVisualizer
                graph={currentGraph}
                algorithmResult={algorithmResult || undefined}
                onNodeClick={setSelectedNode}
                height="500px"
              />
            </div>

            {/* 알고리즘 결과 */}
            {algorithmResult && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">📈 실행 결과</h2>

                {/* 설명 */}
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-4">
                  {algorithmResult.description}
                </div>

                {/* 실행 시간 */}
                <div className="text-sm text-gray-500 mb-4">
                  실행 시간: {algorithmResult.executionTime.toFixed(2)}ms
                </div>

                {/* 최단 경로 결과 */}
                {algorithmResult.type === 'shortestPath' && algorithmResult.path && (
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">경로</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {algorithmResult.path.map((nodeId, idx) => (
                        <span key={nodeId} className="flex items-center">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {currentGraph.nodes.find(n => n.id === nodeId)?.label || nodeId}
                          </span>
                          {idx < algorithmResult.path!.length - 1 && (
                            <span className="mx-1 text-gray-400">→</span>
                          )}
                        </span>
                      ))}
                    </div>
                    {algorithmResult.pathLength !== undefined && algorithmResult.pathLength !== Infinity && (
                      <p className="mt-2 text-sm text-gray-600">
                        총 거리: {algorithmResult.pathLength}
                      </p>
                    )}
                  </div>
                )}

                {/* 상위 노드 랭킹 */}
                {topNodes.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">상위 5개 노드</h3>
                    <div className="space-y-2">
                      {topNodes.map((node, idx) => (
                        <div
                          key={node.id}
                          className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`
                              w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                              ${idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                                idx === 1 ? 'bg-gray-300 text-gray-700' :
                                idx === 2 ? 'bg-orange-300 text-orange-900' :
                                'bg-gray-200 text-gray-600'}
                            `}>
                              {idx + 1}
                            </span>
                            <span className="font-medium">{node.label}</span>
                          </div>
                          <span className="text-sm text-gray-600 font-mono">
                            {node.score.toFixed(4)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 알고리즘 설명 카드 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📚 알고리즘 설명</h2>
              <div className="prose prose-sm max-w-none">
                {selectedAlgorithm === 'degree' && (
                  <>
                    <h3>Degree Centrality (연결 중심성)</h3>
                    <p>
                      가장 간단한 중심성 지표입니다. 노드에 연결된 엣지의 수를 측정합니다.
                    </p>
                    <pre className="bg-gray-50 p-3 rounded">
                      C_D(v) = deg(v) / (n-1)
                    </pre>
                    <p>
                      <strong>해석:</strong> 값이 높을수록 많은 노드와 직접 연결되어 있습니다.
                      SNS에서는 "팔로워가 많은 사람"을 의미합니다.
                    </p>
                  </>
                )}
                {selectedAlgorithm === 'pagerank' && (
                  <>
                    <h3>PageRank</h3>
                    <p>
                      Google 검색 엔진의 핵심 알고리즘입니다. 링크 구조를 분석하여
                      페이지의 중요도를 측정합니다.
                    </p>
                    <pre className="bg-gray-50 p-3 rounded">
                      PR(p) = (1-d)/N + d × Σ(PR(q)/L(q))
                    </pre>
                    <p>
                      <strong>d (Damping Factor):</strong> 랜덤 점프 확률 (보통 0.85)
                    </p>
                    <p>
                      <strong>해석:</strong> 중요한 페이지로부터 링크를 받으면 더 중요해집니다.
                      "추천받은 사람이 영향력 있으면 나도 영향력 있다"는 개념입니다.
                    </p>
                  </>
                )}
                {selectedAlgorithm === 'betweenness' && (
                  <>
                    <h3>Betweenness Centrality (매개 중심성)</h3>
                    <p>
                      노드가 다른 노드 쌍 사이의 최단 경로에 얼마나 자주 포함되는지 측정합니다.
                    </p>
                    <pre className="bg-gray-50 p-3 rounded">
                      C_B(v) = Σ σ_st(v) / σ_st
                    </pre>
                    <p>
                      <strong>해석:</strong> 값이 높을수록 "다리" 역할을 합니다.
                      이 노드를 제거하면 네트워크가 분리될 수 있습니다.
                    </p>
                  </>
                )}
                {selectedAlgorithm === 'closeness' && (
                  <>
                    <h3>Closeness Centrality (근접 중심성)</h3>
                    <p>
                      다른 모든 노드까지의 평균 최단 거리의 역수입니다.
                    </p>
                    <pre className="bg-gray-50 p-3 rounded">
                      C_C(v) = (n-1) / Σ d(v,u)
                    </pre>
                    <p>
                      <strong>해석:</strong> 값이 높을수록 네트워크의 중심에 위치합니다.
                      정보가 빠르게 전파되는 위치입니다.
                    </p>
                  </>
                )}
                {selectedAlgorithm === 'community' && (
                  <>
                    <h3>Community Detection (커뮤니티 탐지)</h3>
                    <p>
                      Label Propagation 알고리즘을 사용하여 밀집 연결된 노드 그룹을 찾습니다.
                    </p>
                    <p>
                      <strong>알고리즘:</strong> 각 노드는 이웃 중 가장 빈번한 레이블을 채택합니다.
                      수렴할 때까지 반복합니다.
                    </p>
                    <p>
                      <strong>해석:</strong> 같은 색상의 노드는 같은 커뮤니티에 속합니다.
                      SNS에서는 "친구 그룹"을 의미합니다.
                    </p>
                  </>
                )}
                {selectedAlgorithm === 'shortestPath' && (
                  <>
                    <h3>Shortest Path (최단 경로)</h3>
                    <p>
                      Dijkstra 알고리즘을 사용하여 두 노드 사이의 최단 경로를 찾습니다.
                    </p>
                    <p>
                      <strong>알고리즘:</strong> 출발점에서 시작하여 가장 가까운 노드부터
                      거리를 업데이트합니다. 모든 노드를 방문할 때까지 반복합니다.
                    </p>
                    <p>
                      <strong>시간 복잡도:</strong> O((V + E) log V)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
