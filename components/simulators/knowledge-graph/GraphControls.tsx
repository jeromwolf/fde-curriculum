'use client'

import { Search, RotateCcw, Database, Box } from 'lucide-react'
import { GraphFilters, ViewMode, PREDICATE_COLORS } from './types'

interface GraphControlsProps {
  filters: GraphFilters
  onFiltersChange: (filters: GraphFilters) => void
  predicateTypes: string[]
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  dataSource: 'sample' | 'rdf-editor' | 'database'
  onLoadFromDB?: () => void
  onReset: () => void
  loading?: boolean
}

export function GraphControls({
  filters,
  onFiltersChange,
  predicateTypes,
  viewMode,
  onViewModeChange,
  dataSource,
  onLoadFromDB,
  onReset,
  loading = false,
}: GraphControlsProps) {
  return (
    <div className="space-y-4">
      {/* 상단 컨트롤 바 */}
      <div className="flex flex-wrap items-center gap-4">
        {/* 뷰 모드 전환 */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('2d')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === '2d'
                ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            2D Graph
          </button>
          <button
            onClick={() => onViewModeChange('3d')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
              viewMode === '3d'
                ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Box className="w-4 h-4" />
            3D Graph
          </button>
        </div>

        {/* 데이터 소스 표시 */}
        <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
          dataSource === 'database'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            : dataSource === 'rdf-editor'
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}>
          {dataSource === 'database' ? 'DB 데이터' : dataSource === 'rdf-editor' ? 'RDF Editor' : '샘플 데이터'}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2 ml-auto">
          {onLoadFromDB && (
            <button
              onClick={onLoadFromDB}
              disabled={loading}
              className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <Database className="w-4 h-4" />
              {loading ? '로딩...' : 'DB에서 로드'}
            </button>
          )}
          <button
            onClick={onReset}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="샘플 데이터로 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 검색 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              검색
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
                placeholder="노드 검색..."
                className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* 신뢰도 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              최소 신뢰도: {(filters.minConfidence * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={filters.minConfidence}
              onChange={(e) => onFiltersChange({ ...filters, minConfidence: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* 관계 유형 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              관계 유형
            </label>
            <div className="flex flex-wrap gap-1">
              {predicateTypes.slice(0, 6).map((predType) => {
                const colorConfig = PREDICATE_COLORS[predType] || PREDICATE_COLORS.default
                const isSelected = filters.selectedPredicates.length === 0 || filters.selectedPredicates.includes(predType)

                return (
                  <button
                    key={predType}
                    onClick={() => {
                      const newSelected = filters.selectedPredicates.includes(predType)
                        ? filters.selectedPredicates.filter(p => p !== predType)
                        : [...filters.selectedPredicates, predType]
                      onFiltersChange({ ...filters, selectedPredicates: newSelected })
                    }}
                    className={`px-2 py-1 rounded text-xs font-medium transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-40'
                    }`}
                    style={{ backgroundColor: colorConfig.color + '20', color: colorConfig.color }}
                  >
                    {colorConfig.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
