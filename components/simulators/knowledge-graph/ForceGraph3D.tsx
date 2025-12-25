'use client'

import { useEffect, useRef, useMemo, useCallback } from 'react'
import ForceGraph3DLib from 'react-force-graph-3d'
import { Triple, PREDICATE_COLORS } from './types'

interface ForceGraph3DProps {
  triples: Triple[]
  height?: string
  onNodeSelect?: (nodeId: string | null) => void
}

interface Node {
  id: string
  name: string
  val: number
  color: string
  x?: number
  y?: number
  z?: number
}

interface Link {
  source: string
  target: string
  label: string
  color: string
  width: number
}

export function ForceGraph3D({ triples, height = '600px', onNodeSelect }: ForceGraph3DProps) {
  const fgRef = useRef<any>(null)

  // 그래프 데이터 변환
  const graphData = useMemo(() => {
    const nodeSet = new Map<string, Node>()
    const links: Link[] = []

    triples.forEach((triple) => {
      // 노드 추가/업데이트
      if (!nodeSet.has(triple.subject)) {
        nodeSet.set(triple.subject, {
          id: triple.subject,
          name: getNodeLabel(triple.subject),
          val: 1,
          color: '#4F46E5',
        })
      } else {
        const node = nodeSet.get(triple.subject)!
        node.val++
      }

      if (!nodeSet.has(triple.object)) {
        nodeSet.set(triple.object, {
          id: triple.object,
          name: getNodeLabel(triple.object),
          val: 1,
          color: triple.predicate.includes('type') ? '#10B981' : '#4F46E5',
        })
      } else {
        const node = nodeSet.get(triple.object)!
        node.val++
      }

      // 링크 추가
      const predType = triple.predicate.split(':')[1] || triple.predicate
      const colorConfig = PREDICATE_COLORS[predType] || PREDICATE_COLORS.default

      links.push({
        source: triple.subject,
        target: triple.object,
        label: colorConfig.label,
        color: colorConfig.color,
        width: triple.confidence * 2,
      })
    })

    return {
      nodes: Array.from(nodeSet.values()),
      links,
    }
  }, [triples])

  // 노드 클릭 핸들러
  const handleNodeClick = useCallback((node: Node) => {
    if (onNodeSelect) {
      onNodeSelect(node.id)
    }
    // 클릭한 노드로 카메라 이동
    if (fgRef.current) {
      const distance = 100
      const distRatio = 1 + distance / Math.hypot(node.x || 0, node.y || 0, node.z || 0)
      fgRef.current.cameraPosition(
        {
          x: (node.x || 0) * distRatio,
          y: (node.y || 0) * distRatio,
          z: (node.z || 0) * distRatio,
        },
        node,
        2000
      )
    }
  }, [onNodeSelect])

  // 백그라운드 클릭
  const handleBackgroundClick = useCallback(() => {
    if (onNodeSelect) {
      onNodeSelect(null)
    }
  }, [onNodeSelect])

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

  const heightNum = parseInt(height.replace('px', ''), 10) || 600

  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-900"
      style={{ height }}
    >
      <ForceGraph3DLib
        ref={fgRef}
        graphData={graphData}
        width={typeof window !== 'undefined' ? window.innerWidth * 0.7 : 800}
        height={heightNum}
        backgroundColor="#111827"
        nodeLabel={(node: any) => `<div style="background: rgba(0,0,0,0.8); padding: 4px 8px; border-radius: 4px; color: white;">${node.name}</div>`}
        nodeColor={(node: any) => node.color}
        nodeVal={(node: any) => Math.sqrt(node.val) * 3}
        nodeOpacity={0.9}
        linkLabel={(link: any) => link.label}
        linkColor={(link: any) => link.color}
        linkWidth={(link: any) => link.width}
        linkOpacity={0.6}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.1}
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        enableNavigationControls={true}
        showNavInfo={true}
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
