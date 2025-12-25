'use client'

import { X } from 'lucide-react'
import { Triple, PREDICATE_COLORS } from './types'

interface NodeDetailsProps {
  nodeId: string
  triples: Triple[]
  onClose: () => void
}

export function NodeDetails({ nodeId, triples, onClose }: NodeDetailsProps) {
  // 해당 노드와 관련된 트리플 필터링
  const asSubject = triples.filter(t => t.subject === nodeId)
  const asObject = triples.filter(t => t.object === nodeId)

  const label = getNodeLabel(nodeId)

  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300">
          {label}
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">
        URI: <code className="bg-indigo-100 dark:bg-indigo-900/50 px-1.5 py-0.5 rounded">{nodeId}</code>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 주체로서의 관계 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            나가는 관계 ({asSubject.length})
          </h4>
          {asSubject.length > 0 ? (
            <ul className="space-y-1.5">
              {asSubject.map((t, idx) => {
                const predType = t.predicate.split(':')[1] || t.predicate
                const colorConfig = PREDICATE_COLORS[predType] || PREDICATE_COLORS.default
                return (
                  <li key={idx} className="text-xs flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colorConfig.color }}
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      <strong>{colorConfig.label}</strong> → {getNodeLabel(t.object)}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 ml-auto">
                      {(t.confidence * 100).toFixed(0)}%
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">없음</p>
          )}
        </div>

        {/* 대상으로서의 관계 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            들어오는 관계 ({asObject.length})
          </h4>
          {asObject.length > 0 ? (
            <ul className="space-y-1.5">
              {asObject.map((t, idx) => {
                const predType = t.predicate.split(':')[1] || t.predicate
                const colorConfig = PREDICATE_COLORS[predType] || PREDICATE_COLORS.default
                return (
                  <li key={idx} className="text-xs flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colorConfig.color }}
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      {getNodeLabel(t.subject)} → <strong>{colorConfig.label}</strong>
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 ml-auto">
                      {(t.confidence * 100).toFixed(0)}%
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">없음</p>
          )}
        </div>
      </div>
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
