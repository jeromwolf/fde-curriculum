'use client'

import { useEffect, useRef } from 'react'
import { Network, Options } from 'vis-network/standalone'
import type { GraphContext } from './types'

interface Props {
  context: GraphContext
  height?: string
}

// 엔티티 타입별 색상
const entityColors: Record<string, string> = {
  person: '#3b82f6',
  organization: '#22c55e',
  concept: '#8b5cf6',
  event: '#f59e0b',
  location: '#ef4444',
}

// 관계 타입별 색상
const relationshipColors: Record<string, string> = {
  competes_with: '#ef4444',
  partners_with: '#22c55e',
  supplies_to: '#3b82f6',
  causes: '#f59e0b',
  prevents: '#22c55e',
  affects: '#8b5cf6',
  directed: '#6366f1',
  similar_to: '#ec4899',
}

export default function MiniGraph({ context, height = '300px' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || context.entities.length === 0) return

    // 노드 생성
    const nodes = context.entities.map((entity) => ({
      id: entity.id,
      label: entity.name,
      color: {
        background: entityColors[entity.type] || '#6b7280',
        border: entityColors[entity.type] || '#6b7280',
      },
      font: { color: '#1f2937', size: 12 },
      size: 20,
    }))

    // 엣지 생성
    const edges = context.relationships.map((rel, idx) => ({
      id: `e${idx}`,
      from: rel.source,
      to: rel.target,
      label: rel.type.replace(/_/g, ' '),
      color: relationshipColors[rel.type] || '#9ca3af',
      font: { size: 10, color: '#6b7280' },
      arrows: { to: { enabled: true, scaleFactor: 0.5 } },
    }))

    // 옵션
    const options: Options = {
      nodes: {
        shape: 'dot',
        borderWidth: 2,
      },
      edges: {
        smooth: { enabled: true, type: 'continuous', roundness: 0.5 },
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -2000,
          springLength: 100,
        },
        stabilization: { iterations: 50 },
      },
      interaction: {
        zoomView: true,
        dragView: true,
      },
    }

    const network = new Network(
      containerRef.current,
      { nodes, edges },
      options
    )

    network.on('stabilizationIterationsDone', () => {
      network.setOptions({ physics: { enabled: false } })
    })

    return () => network.destroy()
  }, [context])

  if (context.entities.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
        <p className="text-gray-400 text-sm">파이프라인을 실행하면 그래프가 표시됩니다</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="bg-gray-50 rounded-lg border"
    />
  )
}
