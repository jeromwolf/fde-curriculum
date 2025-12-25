'use client'

import React, { useState } from 'react'
import { Table, Network, AlertCircle, CheckCircle2, Clock, Copy, Check } from 'lucide-react'
import type { QueryResult, CypherError, Node, Relationship } from '../types'
import { LABEL_COLORS } from '../types'

interface ResultsViewProps {
  result: QueryResult | null
  error: CypherError | null
}

export function ResultsView({ result, error }: ResultsViewProps) {
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const content = JSON.stringify(result, null, 2)
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 에러 표시
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">
              쿼리 실행 오류
            </h4>
            <p className="text-red-700 dark:text-red-300 text-sm">
              {error.message}
            </p>
            {error.line && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-2">
                Line {error.line}, Column {error.column}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 결과 없음
  if (!result) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
        <Network className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          쿼리를 실행하면 결과가 여기에 표시됩니다
        </p>
      </div>
    )
  }

  // 빈 결과
  if (result.rows.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="text-yellow-800 dark:text-yellow-200 font-medium">
              쿼리가 실행되었지만 결과가 없습니다
            </p>
            {result.executionTime && (
              <p className="text-yellow-600 dark:text-yellow-400 text-sm flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                {result.executionTime.toFixed(2)}ms
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 결과 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            결과
          </h4>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {result.rows.length}개 행
          </span>
          {result.executionTime && (
            <span className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {result.executionTime.toFixed(2)}ms
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="결과 복사"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="테이블 뷰"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`p-2 rounded-md transition ${
                viewMode === 'json'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="JSON 뷰"
            >
              <code className="text-xs font-bold">{'{}'}</code>
            </button>
          </div>
        </div>
      </div>

      {/* 영향받은 노드/관계 */}
      {(result.nodesAffected !== undefined || result.relationshipsAffected !== undefined) && (
        <div className="flex gap-4 text-sm">
          {result.nodesAffected !== undefined && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
              노드 {result.nodesAffected}개 생성
            </span>
          )}
          {result.relationshipsAffected !== undefined && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
              관계 {result.relationshipsAffected}개 생성
            </span>
          )}
        </div>
      )}

      {/* 결과 테이블/JSON */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {result.columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {result.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    {result.columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-3 text-sm">
                        <CellValue value={row[col]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <pre className="p-4 text-sm font-mono bg-gray-900 text-gray-100 overflow-x-auto max-h-96">
            {JSON.stringify(result.rows, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

// 셀 값 렌더링 컴포넌트
function CellValue({ value }: { value: any }) {
  if (value === null || value === undefined) {
    return <span className="text-gray-400 italic">null</span>
  }

  // Node 객체
  if (value && typeof value === 'object' && 'labels' in value) {
    const node = value as Node
    const color = LABEL_COLORS[node.labels[0]] || LABEL_COLORS.default
    return (
      <div className="inline-flex items-center gap-2">
        <span
          className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          {node.labels[0]}
        </span>
        <span className="text-gray-700 dark:text-gray-300">
          {node.properties.name || node.id}
        </span>
      </div>
    )
  }

  // Relationship 객체
  if (value && typeof value === 'object' && 'type' in value && 'startNodeId' in value) {
    const rel = value as Relationship
    return (
      <span className="text-purple-600 dark:text-purple-400 font-medium">
        [{rel.type}]
      </span>
    )
  }

  // 기타 객체
  if (typeof value === 'object') {
    return (
      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
        {JSON.stringify(value)}
      </code>
    )
  }

  // 숫자
  if (typeof value === 'number') {
    return <span className="text-blue-600 dark:text-blue-400">{value}</span>
  }

  // 불리언
  if (typeof value === 'boolean') {
    return (
      <span className={value ? 'text-green-600' : 'text-red-600'}>
        {String(value)}
      </span>
    )
  }

  // 문자열
  return <span className="text-gray-900 dark:text-gray-100">{String(value)}</span>
}
