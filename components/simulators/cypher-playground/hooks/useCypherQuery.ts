/**
 * Cypher 쿼리 실행 Hook
 * React 환경에서 Cypher 쿼리를 실행하고 결과를 관리
 */

import { useState, useCallback } from 'react'
import type { PropertyGraph, QueryResult, CypherError } from '../types'
import { executeCypher, validateCypher } from '../lib/cypherParser'
import { cloneGraph } from '../lib/sampleData'

export interface UseCypherQueryOptions {
  graph: PropertyGraph
  onGraphChange?: (graph: PropertyGraph) => void
}

export interface UseCypherQueryReturn {
  result: QueryResult | null
  error: CypherError | null
  isLoading: boolean
  history: QueryHistoryItem[]
  executeQuery: (query: string) => void
  clearResult: () => void
  clearHistory: () => void
}

export interface QueryHistoryItem {
  id: string
  query: string
  timestamp: Date
  success: boolean
  executionTime?: number
  rowCount?: number
}

export function useCypherQuery({ graph, onGraphChange }: UseCypherQueryOptions): UseCypherQueryReturn {
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<CypherError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<QueryHistoryItem[]>([])

  const executeQuery = useCallback((query: string) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    // 비동기 처리를 위해 setTimeout 사용
    setTimeout(() => {
      try {
        // 쿼리 유효성 검사
        const validationError = validateCypher(query)
        if (validationError) {
          setError(validationError)
          addToHistory(query, false)
          setIsLoading(false)
          return
        }

        // CREATE 쿼리는 그래프 복사본에서 실행
        const workingGraph = query.toUpperCase().includes('CREATE')
          ? cloneGraph(graph)
          : graph

        // 쿼리 실행
        const queryResult = executeCypher(query, { graph: workingGraph })

        if ('message' in queryResult) {
          // 에러
          setError(queryResult as CypherError)
          addToHistory(query, false)
        } else {
          // 성공
          setResult(queryResult)
          addToHistory(query, true, queryResult.executionTime, queryResult.rows.length)

          // CREATE 쿼리의 경우 그래프 업데이트
          if (query.toUpperCase().includes('CREATE') && onGraphChange) {
            onGraphChange(workingGraph)
          }
        }
      } catch (e: any) {
        setError({ message: e.message || '알 수 없는 오류가 발생했습니다' })
        addToHistory(query, false)
      } finally {
        setIsLoading(false)
      }
    }, 100) // 약간의 딜레이로 UI 반응성 확보
  }, [graph, onGraphChange])

  const addToHistory = (query: string, success: boolean, executionTime?: number, rowCount?: number) => {
    setHistory(prev => [
      {
        id: `h${Date.now()}`,
        query: query.trim(),
        timestamp: new Date(),
        success,
        executionTime,
        rowCount
      },
      ...prev.slice(0, 49) // 최대 50개 유지
    ])
  }

  const clearResult = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return {
    result,
    error,
    isLoading,
    history,
    executeQuery,
    clearResult,
    clearHistory
  }
}
