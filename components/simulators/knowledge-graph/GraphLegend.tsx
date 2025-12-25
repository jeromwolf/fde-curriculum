'use client'

import { Zap, Info } from 'lucide-react'
import { PREDICATE_COLORS } from './types'

export function GraphLegend() {
  const legendItems = [
    { key: 'competes_with', ...PREDICATE_COLORS.competes_with },
    { key: 'supplies_to', ...PREDICATE_COLORS.supplies_to },
    { key: 'partners_with', ...PREDICATE_COLORS.partners_with },
    { key: 'influences', ...PREDICATE_COLORS.influences },
    { key: 'depends_on', ...PREDICATE_COLORS.depends_on },
    { key: 'type', ...PREDICATE_COLORS.type },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 엣지 색상 범례 */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          엣지 색상 (관계 유형)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {legendItems.map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <span
                className="w-6 h-1 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          선의 두께는 신뢰도를 나타냅니다 (굵을수록 높은 신뢰도)
        </p>
      </div>

      {/* Knowledge Graph 설명 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Knowledge Graph란?
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          Knowledge Graph는 엔티티(Entity)와 그들 간의 관계(Relationship)를
          그래프 구조로 표현한 것입니다.
        </p>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• <strong>노드(Node)</strong>: 엔티티 (사람, 회사, 장소 등)</li>
          <li>• <strong>엣지(Edge)</strong>: 관계 (경쟁, 협력, 소속 등)</li>
          <li>• <strong>속성(Property)</strong>: 신뢰도, 출처 등 메타데이터</li>
        </ul>
      </div>
    </div>
  )
}
