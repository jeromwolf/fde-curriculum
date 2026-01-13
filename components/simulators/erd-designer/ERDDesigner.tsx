'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'

import TableNode from './TableNode'
import { ERDSchema, ERDDesignerProps, TableData, Relationship, RelationType } from './types'
import { sampleSchemas, generateDDL } from './sampleSchemas'

const nodeTypes = {
  table: TableNode,
}

// 관계 유형별 엣지 스타일
const getEdgeStyle = (type: RelationType) => {
  switch (type) {
    case '1:1':
      return {
        stroke: '#10B981',
        strokeWidth: 2,
        label: '1:1',
      }
    case '1:N':
      return {
        stroke: '#3B82F6',
        strokeWidth: 2,
        label: '1:N',
      }
    case 'N:M':
      return {
        stroke: '#8B5CF6',
        strokeWidth: 2,
        label: 'N:M',
      }
  }
}

// 스키마를 React Flow 노드/엣지로 변환
function schemaToFlow(schema: ERDSchema): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = schema.tables.map((table, index) => {
    // 간단한 그리드 레이아웃
    const cols = 3
    const col = index % cols
    const row = Math.floor(index / cols)

    return {
      id: table.id,
      type: 'table',
      position: { x: col * 350 + 50, y: row * 300 + 50 },
      data: { table },
    }
  })

  const edges: Edge[] = schema.relationships.map((rel) => {
    const style = getEdgeStyle(rel.type)
    return {
      id: rel.id,
      source: rel.sourceTable,
      target: rel.targetTable,
      sourceHandle: `${rel.sourceTable}-${rel.sourceColumn}`,
      targetHandle: undefined,
      label: style.label,
      labelStyle: { fontSize: 12, fontWeight: 600 },
      labelBgStyle: { fill: '#fff', fillOpacity: 0.9 },
      labelBgPadding: [4, 4] as [number, number],
      labelBgBorderRadius: 4,
      style: { stroke: style.stroke, strokeWidth: style.strokeWidth },
      animated: rel.type === 'N:M',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: style.stroke,
      },
    }
  })

  return { nodes, edges }
}

export function ERDDesigner({ showSamples = true, showDDL = true, defaultSchema }: ERDDesignerProps) {
  const [selectedSchema, setSelectedSchema] = useState<string>(defaultSchema || 'ecommerce')
  const [currentSchema, setCurrentSchema] = useState<ERDSchema | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [showDDLModal, setShowDDLModal] = useState(false)
  const [ddlOutput, setDdlOutput] = useState('')

  // 스키마 로드
  const loadSchema = useCallback((schemaId: string) => {
    const schema = sampleSchemas.find((s) => s.id === schemaId)
    if (schema) {
      setCurrentSchema(schema.schema)
      const { nodes: newNodes, edges: newEdges } = schemaToFlow(schema.schema)
      setNodes(newNodes)
      setEdges(newEdges)
    }
  }, [setNodes, setEdges])

  // 초기 스키마 로드
  useEffect(() => {
    loadSchema(selectedSchema)
  }, [])

  // 스키마 선택 변경
  const handleSchemaChange = (schemaId: string) => {
    setSelectedSchema(schemaId)
    loadSchema(schemaId)
  }

  // 연결 추가
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#3B82F6', strokeWidth: 2 },
    }, eds)),
    [setEdges]
  )

  // DDL 생성
  const handleGenerateDDL = () => {
    if (currentSchema) {
      const ddl = generateDDL(currentSchema)
      setDdlOutput(ddl)
      setShowDDLModal(true)
    }
  }

  // DDL 복사
  const handleCopyDDL = () => {
    navigator.clipboard.writeText(ddlOutput)
  }

  // 카테고리별 스키마 그룹화
  const groupedSchemas = useMemo(() => {
    const groups: Record<string, typeof sampleSchemas> = {
      oltp: [],
      olap: [],
      star: [],
      snowflake: [],
    }
    sampleSchemas.forEach((schema) => {
      if (groups[schema.category]) {
        groups[schema.category].push(schema)
      }
    })
    return groups
  }, [])

  const categoryLabels: Record<string, string> = {
    oltp: 'OLTP (운영)',
    olap: 'OLAP (분석)',
    star: 'Star Schema',
    snowflake: 'Snowflake Schema',
  }

  return (
    <div className="h-full flex flex-col">
      {/* 툴바 */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 스키마 선택 */}
          {showSamples && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">샘플 스키마:</label>
              <select
                value={selectedSchema}
                onChange={(e) => handleSchemaChange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(groupedSchemas).map(([category, schemas]) => (
                  schemas.length > 0 && (
                    <optgroup key={category} label={categoryLabels[category]}>
                      {schemas.map((schema) => (
                        <option key={schema.id} value={schema.id}>
                          {schema.name}
                        </option>
                      ))}
                    </optgroup>
                  )
                ))}
              </select>
            </div>
          )}

          {/* 현재 스키마 정보 */}
          {currentSchema && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                <span className="font-medium">{currentSchema.tables.length}</span> 테이블
              </span>
              <span>
                <span className="font-medium">
                  {currentSchema.tables.reduce((acc, t) => acc + t.columns.length, 0)}
                </span> 컬럼
              </span>
              <span>
                <span className="font-medium">
                  {currentSchema.relationships.length}
                </span> 관계
              </span>
            </div>
          )}

          {/* DDL 생성 버튼 */}
          {showDDL && (
            <button
              onClick={handleGenerateDDL}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              DDL 생성
            </button>
          )}
        </div>
      </div>

      {/* React Flow 캔버스 */}
      <div className="flex-1" style={{ minHeight: '500px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultEdgeOptions={{
            type: 'smoothstep',
          }}
        >
          <Controls />
          <MiniMap
            nodeStrokeColor={(node) => {
              return '#3B82F6'
            }}
            nodeColor={(node) => {
              return '#fff'
            }}
            nodeBorderRadius={8}
          />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        </ReactFlow>
      </div>

      {/* 범례 */}
      <div className="bg-gray-50 border-t border-gray-200 p-3">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-gray-600">Primary Key</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-gray-600">Foreign Key</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-green-500"></div>
            <span className="text-gray-600">1:1 관계</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-blue-500"></div>
            <span className="text-gray-600">1:N 관계</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-purple-500 animate-pulse"></div>
            <span className="text-gray-600">N:M 관계</span>
          </div>
        </div>
      </div>

      {/* DDL 모달 */}
      {showDDLModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">생성된 DDL</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyDDL}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  복사
                </button>
                <button
                  onClick={() => setShowDDLModal(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
                {ddlOutput}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ERDDesigner
