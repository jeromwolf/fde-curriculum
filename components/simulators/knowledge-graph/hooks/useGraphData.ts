'use client'

import { useState, useEffect, useCallback } from 'react'
import { Triple, GraphData, GraphNode, GraphEdge, GraphStats, GraphFilters, PREDICATE_COLORS, COMPANY_NAME_MAP } from '../types'

// 샘플 트리플 데이터
const SAMPLE_TRIPLES: Triple[] = [
  // 인물 관계
  { subject: ':John', predicate: ':knows', object: ':Mary', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Mary', predicate: ':knows', object: ':Bob', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Bob', predicate: ':knows', object: ':Alice', confidence: 0.9, validatedBy: 'gpt' },
  { subject: ':Alice', predicate: ':marriedTo', object: ':John', confidence: 1.0, validatedBy: 'baseline' },

  // 타입 정보
  { subject: ':John', predicate: ':type', object: ':Person', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Mary', predicate: ':type', object: ':Person', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Bob', predicate: ':type', object: ':Person', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Alice', predicate: ':type', object: ':Person', confidence: 1.0, validatedBy: 'baseline' },

  // 지리 관계
  { subject: ':Seoul', predicate: ':locatedIn', object: ':Korea', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Korea', predicate: ':locatedIn', object: ':Asia', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Samsung', predicate: ':locatedIn', object: ':Seoul', confidence: 1.0, validatedBy: 'baseline' },

  // 기업 관계
  { subject: ':Samsung', predicate: ':type', object: ':Company', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Samsung', predicate: ':competes_with', object: ':SKHynix', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':SKHynix', predicate: ':type', object: ':Company', confidence: 1.0, validatedBy: 'baseline' },

  // 교육 관계
  { subject: ':Prof_Kim', predicate: ':teaches', object: ':AI_Course', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Student_Lee', predicate: ':enrolledIn', object: ':AI_Course', confidence: 0.95, validatedBy: 'gpt' },
  { subject: ':AI_Course', predicate: ':type', object: ':Course', confidence: 1.0, validatedBy: 'baseline' },
]

interface UseGraphDataOptions {
  initialTriples?: Triple[]
  fetchFromDB?: boolean
}

export function useGraphData(options: UseGraphDataOptions = {}) {
  const { initialTriples, fetchFromDB = false } = options

  const [triples, setTriples] = useState<Triple[]>(initialTriples || SAMPLE_TRIPLES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'sample' | 'rdf-editor' | 'database'>('sample')

  const [filters, setFilters] = useState<GraphFilters>({
    minConfidence: 0.7,
    selectedPredicates: [],
    searchTerm: '',
  })

  // DB에서 데이터 가져오기
  const fetchFromDatabase = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/ontology/graph')
      if (!response.ok) throw new Error('Failed to fetch graph data')

      const data = await response.json()
      if (data.triples && Array.isArray(data.triples)) {
        setTriples(data.triples)
        setDataSource('database')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  // RDF Editor에서 데이터 로드
  const loadFromRDFEditor = useCallback(() => {
    const savedData = localStorage.getItem('rdf-editor-triples-for-kg')
    if (!savedData) return false

    try {
      const parsed = JSON.parse(savedData)
      localStorage.removeItem('rdf-editor-triples-for-kg')

      const timestamp = new Date(parsed.timestamp)
      const now = new Date()
      const diffMinutes = (now.getTime() - timestamp.getTime()) / (1000 * 60)

      if (diffMinutes < 5 && parsed.triples && Array.isArray(parsed.triples)) {
        const convertedTriples: Triple[] = parsed.triples.map((t: any) => ({
          subject: t.subject,
          predicate: t.predicate,
          object: t.object,
          confidence: t.confidence || 1.0,
          validatedBy: t.validatedBy || 'user'
        }))
        setTriples(convertedTriples)
        setDataSource('rdf-editor')
        return true
      }
    } catch (error) {
      console.error('Error loading from RDF Editor:', error)
    }
    return false
  }, [])

  // 필터링된 트리플
  const filteredTriples = triples.filter(t => {
    // 신뢰도 필터
    if (t.confidence < filters.minConfidence) return false

    // 관계 유형 필터
    if (filters.selectedPredicates.length > 0) {
      const predType = t.predicate.split(':')[1] || t.predicate
      if (!filters.selectedPredicates.includes(predType)) return false
    }

    // 검색어 필터
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase()
      const subjectMatch = t.subject.toLowerCase().includes(search)
      const objectMatch = t.object.toLowerCase().includes(search)
      if (!subjectMatch && !objectMatch) return false
    }

    return true
  })

  // 그래프 데이터 변환
  const graphData: GraphData = (() => {
    const nodeSet = new Map<string, GraphNode>()
    const edges: GraphEdge[] = []

    filteredTriples.forEach((triple, idx) => {
      // 노드 추가
      if (!nodeSet.has(triple.subject)) {
        nodeSet.set(triple.subject, {
          id: triple.subject,
          label: getNodeLabel(triple.subject),
          type: 'entity',
          connections: 0,
        })
      }
      if (!nodeSet.has(triple.object)) {
        nodeSet.set(triple.object, {
          id: triple.object,
          label: getNodeLabel(triple.object),
          type: triple.predicate.includes('type') ? 'class' : 'entity',
          connections: 0,
        })
      }

      // 연결 수 증가
      const subjectNode = nodeSet.get(triple.subject)!
      const objectNode = nodeSet.get(triple.object)!
      subjectNode.connections++
      objectNode.connections++

      // 엣지 추가
      const predType = triple.predicate.split(':')[1] || triple.predicate
      const colorConfig = PREDICATE_COLORS[predType] || PREDICATE_COLORS.default

      edges.push({
        id: `edge-${idx}`,
        source: triple.subject,
        target: triple.object,
        label: colorConfig.label,
        confidence: triple.confidence,
        color: colorConfig.color,
        width: triple.confidence * 3,
      })
    })

    return {
      nodes: Array.from(nodeSet.values()),
      edges,
    }
  })()

  // 통계 계산
  const stats: GraphStats = {
    totalTriples: triples.length,
    filteredTriples: filteredTriples.length,
    avgConfidence: triples.length > 0
      ? triples.reduce((sum, t) => sum + t.confidence, 0) / triples.length
      : 0,
    uniqueSubjects: new Set(triples.map(t => t.subject)).size,
    uniquePredicates: new Set(triples.map(t => t.predicate)).size,
    uniqueObjects: new Set(triples.map(t => t.object)).size,
  }

  // 고유 관계 유형 목록
  const predicateTypes = Array.from(new Set(triples.map(t => {
    return t.predicate.split(':')[1] || t.predicate
  })))

  // 초기 로드
  useEffect(() => {
    if (fetchFromDB) {
      fetchFromDatabase()
    } else {
      loadFromRDFEditor()
    }
  }, [fetchFromDB, fetchFromDatabase, loadFromRDFEditor])

  const resetToSample = () => {
    setTriples(SAMPLE_TRIPLES)
    setDataSource('sample')
  }

  return {
    // 데이터
    triples,
    filteredTriples,
    graphData,
    stats,
    predicateTypes,

    // 상태
    loading,
    error,
    dataSource,

    // 필터
    filters,
    setFilters,

    // 액션
    fetchFromDatabase,
    loadFromRDFEditor,
    resetToSample,
    setTriples,
  }
}

// 노드 레이블 추출
function getNodeLabel(uri: string): string {
  // kss:Company_Samsung → 삼성전자
  const companyMatch = uri.match(/Company_(.+)$/)
  if (companyMatch) {
    return COMPANY_NAME_MAP[companyMatch[1]] || companyMatch[1]
  }

  // :Something → Something
  const colonMatch = uri.match(/:(.+)$/)
  if (colonMatch) {
    return colonMatch[1]
  }

  return uri
}
