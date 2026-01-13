'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { TableData, Column } from './types'

interface TableNodeData {
  table: TableData
  onEditTable?: (tableId: string) => void
  onDeleteTable?: (tableId: string) => void
}

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    'INTEGER': 'text-blue-600',
    'BIGINT': 'text-blue-700',
    'SERIAL': 'text-blue-800',
    'VARCHAR': 'text-green-600',
    'TEXT': 'text-green-700',
    'BOOLEAN': 'text-purple-600',
    'DATE': 'text-orange-600',
    'TIMESTAMP': 'text-orange-700',
    'DECIMAL': 'text-red-600',
    'FLOAT': 'text-red-500',
    'JSON': 'text-yellow-600',
    'UUID': 'text-pink-600',
  }
  return colors[type] || 'text-gray-600'
}

function TableNode({ data, selected }: NodeProps<TableNodeData>) {
  const { table, onEditTable, onDeleteTable } = data

  return (
    <div
      className={`
        bg-white rounded-lg shadow-lg border-2 min-w-[200px] max-w-[280px]
        ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
      `}
    >
      {/* 테이블 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-t-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="font-semibold text-sm">{table.name}</span>
        </div>
        <div className="flex items-center gap-1">
          {onEditTable && (
            <button
              onClick={() => onEditTable(table.id)}
              className="p-1 hover:bg-blue-500 rounded transition-colors"
              title="테이블 편집"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
          {onDeleteTable && (
            <button
              onClick={() => onDeleteTable(table.id)}
              className="p-1 hover:bg-red-500 rounded transition-colors"
              title="테이블 삭제"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 컬럼 목록 */}
      <div className="divide-y divide-gray-100">
        {table.columns.map((column, index) => (
          <ColumnRow key={column.id} column={column} index={index} tableId={table.id} />
        ))}
      </div>

      {/* 테이블 설명 */}
      {table.description && (
        <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 rounded-b-md border-t">
          {table.description}
        </div>
      )}

      {/* React Flow 핸들 - 왼쪽 (입력) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
      />

      {/* React Flow 핸들 - 오른쪽 (출력) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-500 border-2 border-white"
      />
    </div>
  )
}

function ColumnRow({ column, index, tableId }: { column: Column; index: number; tableId: string }) {
  return (
    <div className="px-3 py-1.5 flex items-center justify-between text-xs hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-2">
        {/* PK/FK 아이콘 */}
        <div className="flex items-center gap-0.5 w-8">
          {column.isPrimaryKey && (
            <span className="text-yellow-500" title="Primary Key">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          {column.isForeignKey && (
            <span className="text-blue-500" title="Foreign Key">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>

        {/* 컬럼명 */}
        <span className={`font-medium ${column.isPrimaryKey ? 'text-yellow-700' : column.isForeignKey ? 'text-blue-700' : 'text-gray-800'}`}>
          {column.name}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* 데이터 타입 */}
        <span className={`font-mono ${getTypeColor(column.type)}`}>
          {column.type}
        </span>

        {/* 제약 조건 아이콘 */}
        <div className="flex items-center gap-0.5">
          {!column.isNullable && (
            <span className="text-red-400" title="NOT NULL">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          {column.isUnique && (
            <span className="text-purple-400" title="UNIQUE">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* FK 참조 표시 */}
      {column.references && (
        <Handle
          type="source"
          position={Position.Right}
          id={`${tableId}-${column.id}`}
          className="w-2 h-2 !bg-blue-400"
          style={{ top: `${(index + 1) * 28 + 44}px` }}
        />
      )}
    </div>
  )
}

export default memo(TableNode)
