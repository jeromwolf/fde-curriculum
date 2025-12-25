'use client'

import { useEffect, useRef, useState } from 'react'
import { Network } from 'vis-network'
import type { Data, Options } from 'vis-network'
import { GraphData, Triple, PREDICATE_COLORS } from './types'

interface ForceGraph2DProps {
  triples: Triple[]
  height?: string
  onNodeSelect?: (nodeId: string | null) => void
}

export function ForceGraph2D({ triples, height = '600px', onNodeSelect }: ForceGraph2DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<Network | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current || triples.length === 0) {
      setLoading(false)
      return
    }

    // Triple 데이터를 vis-network 형식으로 변환
    const nodes = new Set<string>()
    const edges: any[] = []

    triples.forEach((triple) => {
      nodes.add(triple.subject)
      nodes.add(triple.object)

      const predType = triple.predicate.split(':')[1] || triple.predicate
      const colorConfig = PREDICATE_COLORS[predType] || PREDICATE_COLORS.default

      edges.push({
        from: triple.subject,
        to: triple.object,
        label: colorConfig.label,
        color: {
          color: colorConfig.color,
          highlight: colorConfig.highlight,
        },
        width: triple.confidence * 3,
        arrows: { to: { enabled: true, scaleFactor: 0.5 } },
        font: { size: 10, color: '#666', strokeWidth: 0, align: 'top' },
        smooth: { type: 'curvedCW', roundness: 0.2 },
        title: `${colorConfig.label}<br/>신뢰도: ${(triple.confidence * 100).toFixed(0)}%`,
      })
    })

    const nodeData = Array.from(nodes).map((nodeId) => {
      const connections = triples.filter(t => t.subject === nodeId || t.object === nodeId).length
      const label = getNodeLabel(nodeId)

      return {
        id: nodeId,
        label,
        title: `${label}<br/>연결: ${connections}개`,
        shape: 'box',
        color: {
          background: '#4F46E5',
          border: '#3730A3',
          highlight: { background: '#6366F1', border: '#4F46E5' },
        },
        font: { color: '#ffffff', size: 14, face: 'system-ui' },
        borderWidth: 2,
        borderWidthSelected: 3,
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
      }
    })

    const data: Data = { nodes: nodeData, edges }

    const options: Options = {
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -8000,
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.1,
        },
        stabilization: { iterations: 150 },
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        navigationButtons: true,
        keyboard: true,
      },
      nodes: {
        shadow: { enabled: true, color: 'rgba(0,0,0,0.1)', size: 5, x: 2, y: 2 },
      },
      edges: {
        shadow: { enabled: true, color: 'rgba(0,0,0,0.05)', size: 3, x: 1, y: 1 },
      },
    }

    const network = new Network(containerRef.current, data, options)
    networkRef.current = network

    network.on('stabilizationIterationsDone', () => {
      setLoading(false)
      network.setOptions({ physics: { enabled: false } })
    })

    network.on('selectNode', (params) => {
      if (params.nodes.length > 0 && onNodeSelect) {
        onNodeSelect(params.nodes[0])
      }
    })

    network.on('deselectNode', () => {
      if (onNodeSelect) onNodeSelect(null)
    })

    return () => {
      network.destroy()
      networkRef.current = null
    }
  }, [triples, onNodeSelect])

  if (triples.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="text-center">
          <p className="text-lg mb-2">표시할 데이터가 없습니다</p>
          <p className="text-sm">필터를 조정하거나 데이터를 로드하세요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10 rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">그래프 생성 중...</p>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        style={{ height }}
        className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
      />
    </div>
  )
}

function getNodeLabel(uri: string): string {
  const companyMatch = uri.match(/Company_(.+)$/)
  if (companyMatch) {
    const nameMap: Record<string, string> = {
      Samsung: '삼성전자', SKHynix: 'SK하이닉스', TSMC: 'TSMC', Intel: '인텔',
      Apple: '애플', Nvidia: '엔비디아', AMD: 'AMD', Tesla: '테슬라',
    }
    return nameMap[companyMatch[1]] || companyMatch[1]
  }
  const colonMatch = uri.match(/:(.+)$/)
  return colonMatch ? colonMatch[1] : uri
}
