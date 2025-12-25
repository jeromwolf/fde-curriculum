/**
 * Property Graph 상태 관리 Hook
 */

import { useState, useCallback } from 'react'
import type { Node, Relationship, PropertyGraph } from '../types'
import { createSampleGraph, createEmptyGraph, cloneGraph } from '../lib/sampleData'

export interface UsePropertyGraphReturn {
  graph: PropertyGraph
  nodeCount: number
  relationshipCount: number
  labels: string[]
  relationshipTypes: string[]
  addNode: (node: Omit<Node, 'id'>) => string
  removeNode: (id: string) => void
  updateNode: (id: string, updates: Partial<Node>) => void
  addRelationship: (rel: Omit<Relationship, 'id'>) => string
  removeRelationship: (id: string) => void
  loadSampleData: () => void
  clearGraph: () => void
  setGraph: (graph: PropertyGraph) => void
  getNode: (id: string) => Node | undefined
  getNodesByLabel: (label: string) => Node[]
  getRelationshipsByType: (type: string) => Relationship[]
  getConnectedNodes: (nodeId: string) => { incoming: Node[], outgoing: Node[] }
}

export function usePropertyGraph(initialGraph?: PropertyGraph): UsePropertyGraphReturn {
  const [graph, setGraphState] = useState<PropertyGraph>(
    initialGraph || createSampleGraph()
  )

  // 통계
  const nodeCount = graph.nodes.length
  const relationshipCount = graph.relationships.length

  // 고유 레이블 목록
  const labels = Array.from(new Set(graph.nodes.flatMap(n => n.labels)))

  // 고유 관계 타입 목록
  const relationshipTypes = Array.from(new Set(graph.relationships.map(r => r.type)))

  // 노드 추가
  const addNode = useCallback((nodeData: Omit<Node, 'id'>): string => {
    const id = `n${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newNode: Node = { id, ...nodeData }

    setGraphState(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }))

    return id
  }, [])

  // 노드 삭제 (연결된 관계도 삭제)
  const removeNode = useCallback((id: string) => {
    setGraphState(prev => ({
      nodes: prev.nodes.filter(n => n.id !== id),
      relationships: prev.relationships.filter(
        r => r.startNodeId !== id && r.endNodeId !== id
      )
    }))
  }, [])

  // 노드 업데이트
  const updateNode = useCallback((id: string, updates: Partial<Node>) => {
    setGraphState(prev => ({
      ...prev,
      nodes: prev.nodes.map(n =>
        n.id === id ? { ...n, ...updates } : n
      )
    }))
  }, [])

  // 관계 추가
  const addRelationship = useCallback((relData: Omit<Relationship, 'id'>): string => {
    const id = `r${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newRel: Relationship = { id, ...relData }

    setGraphState(prev => ({
      ...prev,
      relationships: [...prev.relationships, newRel]
    }))

    return id
  }, [])

  // 관계 삭제
  const removeRelationship = useCallback((id: string) => {
    setGraphState(prev => ({
      ...prev,
      relationships: prev.relationships.filter(r => r.id !== id)
    }))
  }, [])

  // 샘플 데이터 로드
  const loadSampleData = useCallback(() => {
    setGraphState(createSampleGraph())
  }, [])

  // 그래프 초기화
  const clearGraph = useCallback(() => {
    setGraphState(createEmptyGraph())
  }, [])

  // 그래프 설정
  const setGraph = useCallback((newGraph: PropertyGraph) => {
    setGraphState(cloneGraph(newGraph))
  }, [])

  // 노드 조회
  const getNode = useCallback((id: string): Node | undefined => {
    return graph.nodes.find(n => n.id === id)
  }, [graph])

  // 레이블로 노드 조회
  const getNodesByLabel = useCallback((label: string): Node[] => {
    return graph.nodes.filter(n => n.labels.includes(label))
  }, [graph])

  // 타입으로 관계 조회
  const getRelationshipsByType = useCallback((type: string): Relationship[] => {
    return graph.relationships.filter(r => r.type === type)
  }, [graph])

  // 연결된 노드 조회
  const getConnectedNodes = useCallback((nodeId: string): { incoming: Node[], outgoing: Node[] } => {
    const incoming: Node[] = []
    const outgoing: Node[] = []

    for (const rel of graph.relationships) {
      if (rel.startNodeId === nodeId) {
        const target = graph.nodes.find(n => n.id === rel.endNodeId)
        if (target) outgoing.push(target)
      }
      if (rel.endNodeId === nodeId) {
        const source = graph.nodes.find(n => n.id === rel.startNodeId)
        if (source) incoming.push(source)
      }
    }

    return { incoming, outgoing }
  }, [graph])

  return {
    graph,
    nodeCount,
    relationshipCount,
    labels,
    relationshipTypes,
    addNode,
    removeNode,
    updateNode,
    addRelationship,
    removeRelationship,
    loadSampleData,
    clearGraph,
    setGraph,
    getNode,
    getNodesByLabel,
    getRelationshipsByType,
    getConnectedNodes
  }
}
