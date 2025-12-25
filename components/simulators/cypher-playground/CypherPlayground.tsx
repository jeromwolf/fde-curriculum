'use client'

import React, { useState, useCallback } from 'react'
import { Database, Network, History, RefreshCw, Trash2, HelpCircle, X } from 'lucide-react'
import { CypherEditor } from './components/CypherEditor'
import { ResultsView } from './components/ResultsView'
import { GraphVisualization } from './components/GraphVisualization'
import { useCypherQuery } from './hooks/useCypherQuery'
import { usePropertyGraph } from './hooks/usePropertyGraph'
import { exampleQueries } from './lib/sampleData'
import type { Node } from './types'

interface CypherPlaygroundProps {
  showGraph?: boolean
  showHistory?: boolean
  className?: string
}

export function CypherPlayground({
  showGraph = true,
  showHistory = true,
  className = ''
}: CypherPlaygroundProps) {
  const [showHelp, setShowHelp] = useState(false)
  const [activeTab, setActiveTab] = useState<'results' | 'graph' | 'history'>('results')
  const [selectedGraphNode, setSelectedGraphNode] = useState<Node | null>(null)

  const {
    graph,
    nodeCount,
    relationshipCount,
    labels,
    relationshipTypes,
    loadSampleData,
    clearGraph,
    setGraph
  } = usePropertyGraph()

  const {
    result,
    error,
    isLoading,
    history,
    executeQuery,
    clearResult,
    clearHistory
  } = useCypherQuery({
    graph,
    onGraphChange: setGraph
  })

  const handleNodeClick = useCallback((node: Node) => {
    setSelectedGraphNode(node)
  }, [])

  return (
    <div className={`max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Cypher Query Playground
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Neo4j의 Cypher 쿼리 언어를 직접 실습해보세요
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowHelp(true)}
            className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 flex items-center gap-2 text-sm"
          >
            <HelpCircle className="w-4 h-4" />
            도움말
          </button>
          <button
            onClick={loadSampleData}
            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 flex items-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            샘플 로드
          </button>
          <button
            onClick={clearGraph}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center gap-2 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            초기화
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">노드</span>
          </div>
          <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{nodeCount}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
            <Network className="w-4 h-4" />
            <span className="text-sm font-medium">관계</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{relationshipCount}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
            <span className="text-sm font-medium">레이블</span>
          </div>
          <p className="text-lg font-medium text-purple-900 dark:text-purple-100">
            {labels.join(', ') || '-'}
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
            <span className="text-sm font-medium">관계 타입</span>
          </div>
          <p className="text-lg font-medium text-orange-900 dark:text-orange-100 truncate">
            {relationshipTypes.slice(0, 3).join(', ') || '-'}
          </p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽: 에디터 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <CypherEditor
            exampleQueries={exampleQueries}
            isLoading={isLoading}
            onExecute={executeQuery}
          />
        </div>

        {/* 오른쪽: 결과/그래프/히스토리 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          {/* 탭 */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'results'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              결과
            </button>
            {showGraph && (
              <button
                onClick={() => setActiveTab('graph')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                  activeTab === 'graph'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                그래프
              </button>
            )}
            {showHistory && (
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
                  activeTab === 'history'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <History className="w-4 h-4" />
                히스토리
                {history.length > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
                    {history.length}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* 탭 컨텐츠 */}
          <div className="min-h-[400px]">
            {activeTab === 'results' && (
              <ResultsView result={result} error={error} />
            )}
            {activeTab === 'graph' && showGraph && (
              <div className="space-y-4">
                <GraphVisualization
                  graph={graph}
                  width={500}
                  height={400}
                  onNodeClick={handleNodeClick}
                />
                {selectedGraphNode && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium mb-2">선택된 노드</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="text-gray-500">ID:</span> {selectedGraphNode.id}</p>
                      <p><span className="text-gray-500">레이블:</span> {selectedGraphNode.labels.join(', ')}</p>
                      <p><span className="text-gray-500">속성:</span></p>
                      <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
                        {JSON.stringify(selectedGraphNode.properties, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'history' && showHistory && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">쿼리 히스토리</h4>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      전체 삭제
                    </button>
                  )}
                </div>
                {history.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    아직 실행된 쿼리가 없습니다
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {history.map(item => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border ${
                          item.success
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <code className="text-xs font-mono text-gray-700 dark:text-gray-300 line-clamp-2">
                            {item.query}
                          </code>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            item.success
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                          }`}>
                            {item.success ? '성공' : '실패'}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>{item.timestamp.toLocaleTimeString()}</span>
                          {item.executionTime && <span>{item.executionTime.toFixed(2)}ms</span>}
                          {item.rowCount !== undefined && <span>{item.rowCount}개 행</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 도움말 모달 */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">Cypher 쿼리 가이드</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* 기본 문법 */}
              <section>
                <h3 className="font-semibold mb-3">기본 문법</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <code className="text-indigo-600 dark:text-indigo-400">MATCH</code>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">- 패턴 매칭으로 데이터 조회</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <code className="text-indigo-600 dark:text-indigo-400">WHERE</code>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">- 필터 조건 지정</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <code className="text-indigo-600 dark:text-indigo-400">RETURN</code>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">- 결과 반환</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <code className="text-green-600 dark:text-green-400">CREATE</code>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">- 노드/관계 생성</span>
                  </div>
                </div>
              </section>

              {/* 패턴 */}
              <section>
                <h3 className="font-semibold mb-3">패턴 문법</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-lg">
                    <p>(n:Person) <span className="text-gray-500">// 레이블이 Person인 노드</span></p>
                  </div>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-lg">
                    <p>(n:Person {'{'} name: 'Alice' {'}'}) <span className="text-gray-500">// 속성 조건</span></p>
                  </div>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-lg">
                    <p>(a)-[:KNOWS]-{'>'} (b) <span className="text-gray-500">// 방향 있는 관계</span></p>
                  </div>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-lg">
                    <p>(a)-[:KNOWS*2]-(b) <span className="text-gray-500">// 2단계 관계</span></p>
                  </div>
                </div>
              </section>

              {/* 예제 */}
              <section>
                <h3 className="font-semibold mb-3">예제 쿼리</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  <pre>{`// 모든 사람 조회
MATCH (p:Person)
RETURN p.name, p.age

// 친구 찾기
MATCH (a:Person {name: 'Alice'})-[:KNOWS]->(friend)
RETURN friend.name

// 새 노드 생성
CREATE (n:Person {name: 'Bob', age: 25})`}</pre>
                </div>
              </section>

              {/* 단축키 */}
              <section>
                <h3 className="font-semibold mb-3">단축키</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <span>쿼리 실행</span>
                    <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Ctrl+Enter</kbd>
                  </div>
                  <div className="flex justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <span>들여쓰기</span>
                    <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Tab</kbd>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
