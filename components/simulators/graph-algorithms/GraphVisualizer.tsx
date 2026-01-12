'use client'

import { useEffect, useRef, useState } from 'react'
import { Network, Options, Edge, Node } from 'vis-network/standalone'
import type { Graph, AlgorithmResult } from './types'

interface GraphVisualizerProps {
  graph: Graph
  algorithmResult?: AlgorithmResult
  onNodeClick?: (nodeId: string) => void
  height?: string
}

// 알고리즘 결과에 따른 노드 색상 계산
function getNodeColor(score: number, maxScore: number, algorithmType?: string): string {
  if (!algorithmType) return '#6366f1' // 기본 인디고

  const normalized = maxScore > 0 ? score / maxScore : 0

  // 점수에 따른 색상 그라데이션 (낮음: 파랑 → 높음: 빨강)
  const r = Math.round(255 * normalized)
  const g = Math.round(100 * (1 - normalized))
  const b = Math.round(255 * (1 - normalized))

  return `rgb(${r}, ${g}, ${b})`
}

// 커뮤니티 색상 팔레트
const communityColors = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
]

export default function GraphVisualizer({
  graph,
  algorithmResult,
  onNodeClick,
  height = '500px'
}: GraphVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<Network | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 최대 점수 계산
    let maxScore = 0
    if (algorithmResult) {
      algorithmResult.nodes.forEach((score) => {
        if (score > maxScore) maxScore = score
      })
    }

    // 노드 데이터 변환
    const nodes: Node[] = graph.nodes.map((node) => {
      const score = algorithmResult?.nodes.get(node.id) || 0
      const communityId = algorithmResult?.communities?.get(node.id)

      let color = '#6366f1' // 기본 색상
      let size = 25 // 기본 크기

      if (algorithmResult) {
        if (algorithmResult.type === 'community' && communityId !== undefined) {
          color = communityColors[communityId % communityColors.length]
        } else if (algorithmResult.type === 'shortestPath') {
          const isOnPath = algorithmResult.path?.includes(node.id)
          color = isOnPath ? '#22c55e' : '#9ca3af'
          size = isOnPath ? 35 : 20
        } else {
          color = getNodeColor(score, maxScore, algorithmResult.type)
          size = 20 + (score / maxScore) * 25
        }
      }

      return {
        id: node.id,
        label: node.label,
        color: {
          background: color,
          border: color,
          highlight: { background: '#fbbf24', border: '#f59e0b' }
        },
        size,
        font: { color: '#1f2937', size: 14 },
        title: `${node.label}\n점수: ${score.toFixed(4)}`,
      }
    })

    // 엣지 데이터 변환
    const edges: Edge[] = graph.edges.map((edge) => {
      const isOnPath = algorithmResult?.type === 'shortestPath' &&
        algorithmResult.path &&
        algorithmResult.path.includes(edge.from) &&
        algorithmResult.path.includes(edge.to) &&
        Math.abs(algorithmResult.path.indexOf(edge.from) - algorithmResult.path.indexOf(edge.to)) === 1

      return {
        id: edge.id,
        from: edge.from,
        to: edge.to,
        label: edge.label,
        color: isOnPath ? '#22c55e' : '#9ca3af',
        width: isOnPath ? 4 : (edge.weight ? Math.log(edge.weight + 1) : 1),
        font: { size: 10, color: '#6b7280' },
      }
    })

    // 네트워크 옵션
    const options: Options = {
      nodes: {
        shape: 'dot',
        borderWidth: 2,
        shadow: true,
      },
      edges: {
        smooth: {
          enabled: true,
          type: 'continuous',
          roundness: 0.5
        },
        arrows: {
          to: { enabled: false }
        }
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -3000,
          centralGravity: 0.3,
          springLength: 150,
          springConstant: 0.04,
          damping: 0.09
        },
        stabilization: {
          enabled: true,
          iterations: 100,
          updateInterval: 25
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        navigationButtons: true,
        keyboard: true
      }
    }

    // 네트워크 생성
    const network = new Network(
      containerRef.current,
      { nodes, edges },
      options
    )

    networkRef.current = network

    // 클릭 이벤트
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0] as string
        setSelectedNode(nodeId)
        onNodeClick?.(nodeId)
      } else {
        setSelectedNode(null)
      }
    })

    // 안정화 완료 후 물리 엔진 비활성화
    network.on('stabilizationIterationsDone', () => {
      network.setOptions({ physics: { enabled: false } })
    })

    return () => {
      network.destroy()
    }
  }, [graph, algorithmResult, onNodeClick])

  // 선택된 노드 정보
  const selectedNodeData = selectedNode
    ? graph.nodes.find((n) => n.id === selectedNode)
    : null
  const selectedScore = selectedNode && algorithmResult
    ? algorithmResult.nodes.get(selectedNode)
    : null

  return (
    <div className="relative">
      <div
        ref={containerRef}
        style={{ height, width: '100%' }}
        className="bg-gray-50 rounded-lg border border-gray-200"
      />

      {/* 선택된 노드 정보 패널 */}
      {selectedNodeData && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
          <h4 className="font-bold text-lg mb-2">{selectedNodeData.label}</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>ID: {selectedNodeData.id}</p>
            {selectedNodeData.group && <p>그룹: {selectedNodeData.group}</p>}
            {selectedScore !== null && selectedScore !== undefined && (
              <p className="text-indigo-600 font-medium">
                점수: {selectedScore.toFixed(4)}
              </p>
            )}
            {algorithmResult?.communities && (
              <p>
                커뮤니티: {algorithmResult.communities.get(selectedNode!) ?? 'N/A'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 범례 */}
      {algorithmResult && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow border text-xs">
          {algorithmResult.type === 'community' ? (
            <div>
              <p className="font-medium mb-2">커뮤니티 색상</p>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const uniqueComms: number[] = []
                  algorithmResult.communities?.forEach((commId) => {
                    if (!uniqueComms.includes(commId)) uniqueComms.push(commId)
                  })
                  return uniqueComms.map((commId) => (
                    <div key={commId} className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: communityColors[commId % communityColors.length] }}
                      />
                      <span>C{commId}</span>
                    </div>
                  ))
                })()}
              </div>
            </div>
          ) : algorithmResult.type === 'shortestPath' ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>경로</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span>기타</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>낮음</span>
              <div className="flex">
                <div className="w-4 h-3 bg-blue-500" />
                <div className="w-4 h-3 bg-purple-500" />
                <div className="w-4 h-3 bg-red-400" />
                <div className="w-4 h-3 bg-red-600" />
              </div>
              <span>높음</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
