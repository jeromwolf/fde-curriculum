'use client'

import React, { useEffect, useRef, useMemo, useState } from 'react'
import type { PropertyGraph, Node, Relationship } from '../types'
import { LABEL_COLORS, RELATIONSHIP_COLORS } from '../types'

interface GraphVisualizationProps {
  graph: PropertyGraph
  width?: number
  height?: number
  onNodeClick?: (node: Node) => void
  highlightNodeIds?: string[]
}

interface VisNode {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  label: string
  color: string
  labels: string[]
}

interface VisLink {
  source: string
  target: string
  type: string
  color: string
}

export function GraphVisualization({
  graph,
  width = 600,
  height = 400,
  onNodeClick,
  highlightNodeIds = []
}: GraphVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<VisNode | null>(null)
  const [selectedNode, setSelectedNode] = useState<VisNode | null>(null)
  const animationRef = useRef<number | null>(null)
  const nodesRef = useRef<VisNode[]>([])
  const linksRef = useRef<VisLink[]>([])

  // 그래프 데이터를 시각화용으로 변환
  const { nodes, links } = useMemo(() => {
    const visNodes: VisNode[] = graph.nodes.map((node, i) => {
      // 원형 배치
      const angle = (2 * Math.PI * i) / graph.nodes.length
      const radius = Math.min(width, height) * 0.3
      return {
        id: node.id,
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
        label: String(node.properties.name || node.id),
        color: LABEL_COLORS[node.labels[0]] || LABEL_COLORS.default,
        labels: node.labels
      }
    })

    const visLinks: VisLink[] = graph.relationships.map(rel => ({
      source: rel.startNodeId,
      target: rel.endNodeId,
      type: rel.type,
      color: RELATIONSHIP_COLORS[rel.type] || RELATIONSHIP_COLORS.default
    }))

    return { nodes: visNodes, links: visLinks }
  }, [graph, width, height])

  // Force simulation
  useEffect(() => {
    nodesRef.current = nodes.map(n => ({ ...n }))
    linksRef.current = links

    const simulate = () => {
      const ns = nodesRef.current
      const ls = linksRef.current

      // 반발력 (노드 간)
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[j].x - ns[i].x
          const dy = ns[j].y - ns[i].y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = 2000 / (dist * dist)
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          ns[i].vx -= fx
          ns[i].vy -= fy
          ns[j].vx += fx
          ns[j].vy += fy
        }
      }

      // 연결력 (링크)
      for (const link of ls) {
        const source = ns.find(n => n.id === link.source)
        const target = ns.find(n => n.id === link.target)
        if (source && target) {
          const dx = target.x - source.x
          const dy = target.y - source.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = (dist - 100) * 0.05
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          source.vx += fx
          source.vy += fy
          target.vx -= fx
          target.vy -= fy
        }
      }

      // 중심력
      for (const n of ns) {
        n.vx += (width / 2 - n.x) * 0.01
        n.vy += (height / 2 - n.y) * 0.01
      }

      // 위치 업데이트
      for (const n of ns) {
        n.vx *= 0.9 // 감쇠
        n.vy *= 0.9
        n.x += n.vx
        n.y += n.vy
        // 경계 제한
        n.x = Math.max(30, Math.min(width - 30, n.x))
        n.y = Math.max(30, Math.min(height - 30, n.y))
      }

      draw()
      animationRef.current = requestAnimationFrame(simulate)
    }

    simulate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [nodes, links, width, height])

  // 캔버스 그리기
  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const ns = nodesRef.current
    const ls = linksRef.current

    // 클리어
    ctx.fillStyle = '#1F2937'
    ctx.fillRect(0, 0, width, height)

    // 링크 그리기
    for (const link of ls) {
      const source = ns.find(n => n.id === link.source)
      const target = ns.find(n => n.id === link.target)
      if (source && target) {
        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
        ctx.strokeStyle = link.color + '80'
        ctx.lineWidth = 2
        ctx.stroke()

        // 화살표
        const angle = Math.atan2(target.y - source.y, target.x - source.x)
        const arrowLen = 10
        const arrowX = target.x - 25 * Math.cos(angle)
        const arrowY = target.y - 25 * Math.sin(angle)
        ctx.beginPath()
        ctx.moveTo(arrowX, arrowY)
        ctx.lineTo(
          arrowX - arrowLen * Math.cos(angle - Math.PI / 6),
          arrowY - arrowLen * Math.sin(angle - Math.PI / 6)
        )
        ctx.lineTo(
          arrowX - arrowLen * Math.cos(angle + Math.PI / 6),
          arrowY - arrowLen * Math.sin(angle + Math.PI / 6)
        )
        ctx.closePath()
        ctx.fillStyle = link.color
        ctx.fill()

        // 관계 타입 레이블
        const midX = (source.x + target.x) / 2
        const midY = (source.y + target.y) / 2
        ctx.fillStyle = '#9CA3AF'
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(link.type, midX, midY - 5)
      }
    }

    // 노드 그리기
    for (const node of ns) {
      const isHighlighted = highlightNodeIds.includes(node.id)
      const isSelected = selectedNode?.id === node.id
      const isHovered = hoveredNode?.id === node.id
      const radius = isHighlighted || isSelected ? 25 : 20

      // 노드 원
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = node.color
      ctx.fill()

      // 선택/하이라이트 테두리
      if (isSelected || isHovered) {
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 3
        ctx.stroke()
      } else if (isHighlighted) {
        ctx.strokeStyle = '#FCD34D'
        ctx.lineWidth = 3
        ctx.stroke()
      }

      // 노드 레이블
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const label = node.label.length > 8 ? node.label.substring(0, 7) + '...' : node.label
      ctx.fillText(label, node.x, node.y)

      // 레이블 태그
      if (node.labels[0]) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.font = '9px sans-serif'
        ctx.fillText(`:${node.labels[0]}`, node.x, node.y + radius + 12)
      }
    }

    // 호버된 노드 툴팁
    if (hoveredNode) {
      const tooltipX = hoveredNode.x + 30
      const tooltipY = hoveredNode.y - 20
      ctx.fillStyle = 'rgba(0,0,0,0.8)'
      ctx.fillRect(tooltipX, tooltipY, 120, 40)
      ctx.fillStyle = '#fff'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(hoveredNode.label, tooltipX + 8, tooltipY + 16)
      ctx.fillStyle = '#9CA3AF'
      ctx.font = '10px sans-serif'
      ctx.fillText(hoveredNode.labels.join(', '), tooltipX + 8, tooltipY + 30)
    }
  }

  // 마우스 이벤트 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ns = nodesRef.current
    let found: VisNode | null = null
    for (const node of ns) {
      const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2)
      if (dist < 25) {
        found = node
        break
      }
    }
    setHoveredNode(found)
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ns = nodesRef.current
    for (const visNode of ns) {
      const dist = Math.sqrt((visNode.x - x) ** 2 + (visNode.y - y) ** 2)
      if (dist < 25) {
        setSelectedNode(visNode)
        const originalNode = graph.nodes.find(n => n.id === visNode.id)
        if (originalNode && onNodeClick) {
          onNodeClick(originalNode)
        }
        return
      }
    }
    setSelectedNode(null)
  }

  if (graph.nodes.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-800 rounded-xl"
        style={{ width, height }}
      >
        <p className="text-gray-400">그래프 데이터가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-xl cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
        onClick={handleClick}
      />
      {/* 범례 */}
      <div className="absolute bottom-2 left-2 bg-black/50 rounded-lg px-3 py-2">
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(LABEL_COLORS).filter(([k]) => k !== 'default').map(([label, color]) => (
            <div key={label} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-300">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
