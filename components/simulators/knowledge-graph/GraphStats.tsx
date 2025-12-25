'use client'

import { GraphStats as GraphStatsType } from './types'

interface GraphStatsProps {
  stats: GraphStatsType
}

export function GraphStats({ stats }: GraphStatsProps) {
  const items = [
    { label: '총 트리플', value: stats.totalTriples, color: 'text-gray-900 dark:text-white' },
    { label: '표시 중', value: stats.filteredTriples, color: 'text-indigo-600 dark:text-indigo-400' },
    { label: '평균 신뢰도', value: `${(stats.avgConfidence * 100).toFixed(0)}%`, color: 'text-green-600 dark:text-green-400' },
    { label: '고유 주어', value: stats.uniqueSubjects, color: 'text-blue-600 dark:text-blue-400' },
    { label: '고유 술어', value: stats.uniquePredicates, color: 'text-purple-600 dark:text-purple-400' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center"
        >
          <div className={`text-2xl font-bold ${item.color}`}>
            {item.value}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
