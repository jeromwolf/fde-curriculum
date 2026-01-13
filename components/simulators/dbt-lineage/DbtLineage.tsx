'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
  DbtProject,
  DbtModel,
  DbtSource,
  DbtLineageProps,
  layerColors,
  materializationIcons,
  ModelLayer,
} from './types'
import {
  sampleProjects,
  dbtCommands,
  materializationDescriptions,
  layerDescriptions,
} from './sampleProjects'

interface NodePosition {
  x: number
  y: number
}

export const DbtLineage: React.FC<DbtLineageProps> = ({
  showCode = true,
  showTests = true,
}) => {
  const [selectedProject, setSelectedProject] = useState<DbtProject>(sampleProjects[0])
  const [selectedNode, setSelectedNode] = useState<DbtModel | DbtSource | null>(null)
  const [selectedNodeType, setSelectedNodeType] = useState<'model' | 'source' | null>(null)
  const [activeTab, setActiveTab] = useState<'lineage' | 'code' | 'tests' | 'commands'>('lineage')
  const [highlightedPath, setHighlightedPath] = useState<string[]>([])
  const [filterLayer, setFilterLayer] = useState<ModelLayer | 'all'>('all')
  const canvasRef = useRef<HTMLDivElement>(null)

  // Calculate node positions for DAG layout
  const nodePositions = useMemo(() => {
    const positions: Record<string, NodePosition> = {}
    const layers: Record<ModelLayer, string[]> = {
      source: [],
      staging: [],
      intermediate: [],
      marts: [],
    }

    // Add source
    selectedProject.sources.forEach(src => {
      layers.source.push(src.id)
    })

    // Add models by layer
    selectedProject.models.forEach(model => {
      layers[model.layer].push(model.id)
    })

    // Calculate positions
    const layerOrder: ModelLayer[] = ['source', 'staging', 'intermediate', 'marts']
    const layerX = { source: 50, staging: 250, intermediate: 450, marts: 650 }
    const nodeHeight = 70
    const startY = 30

    layerOrder.forEach(layer => {
      const nodes = layers[layer]
      nodes.forEach((nodeId, idx) => {
        positions[nodeId] = {
          x: layerX[layer],
          y: startY + idx * nodeHeight,
        }
      })
    })

    return positions
  }, [selectedProject])

  // Get all edges for lineage
  const edges = useMemo(() => {
    const result: { from: string; to: string }[] = []

    selectedProject.models.forEach(model => {
      model.depends_on.forEach(depId => {
        // Check if dependency is a source
        const isSource = selectedProject.sources.some(s => s.id === depId)
        if (isSource || selectedProject.models.some(m => m.id === depId)) {
          result.push({ from: depId, to: model.id })
        }
      })
    })

    return result
  }, [selectedProject])

  // Handle node click
  const handleNodeClick = useCallback((nodeId: string, type: 'model' | 'source') => {
    if (type === 'model') {
      const model = selectedProject.models.find(m => m.id === nodeId)
      setSelectedNode(model || null)
      setSelectedNodeType('model')
    } else {
      const source = selectedProject.sources.find(s => s.id === nodeId)
      setSelectedNode(source || null)
      setSelectedNodeType('source')
    }

    // Highlight path (upstream and downstream)
    const path: string[] = [nodeId]

    // Find upstream
    const findUpstream = (id: string) => {
      const model = selectedProject.models.find(m => m.id === id)
      if (model) {
        model.depends_on.forEach(depId => {
          if (!path.includes(depId)) {
            path.push(depId)
            findUpstream(depId)
          }
        })
      }
    }

    // Find downstream
    const findDownstream = (id: string) => {
      selectedProject.models.forEach(model => {
        if (model.depends_on.includes(id) && !path.includes(model.id)) {
          path.push(model.id)
          findDownstream(model.id)
        }
      })
    }

    findUpstream(nodeId)
    findDownstream(nodeId)
    setHighlightedPath(path)
  }, [selectedProject])

  // Clear selection
  const clearSelection = () => {
    setSelectedNode(null)
    setSelectedNodeType(null)
    setHighlightedPath([])
  }

  // Filter models by layer
  const filteredModels = useMemo(() => {
    if (filterLayer === 'all') return selectedProject.models
    return selectedProject.models.filter(m => m.layer === filterLayer)
  }, [selectedProject, filterLayer])

  // Render SVG edges
  const renderEdges = () => {
    return edges.map((edge, idx) => {
      const fromPos = nodePositions[edge.from]
      const toPos = nodePositions[edge.to]

      if (!fromPos || !toPos) return null

      const isHighlighted = highlightedPath.includes(edge.from) && highlightedPath.includes(edge.to)
      const fromFiltered = filterLayer === 'all' ||
        selectedProject.sources.some(s => s.id === edge.from) ||
        selectedProject.models.find(m => m.id === edge.from)?.layer === filterLayer
      const toFiltered = filterLayer === 'all' ||
        selectedProject.models.find(m => m.id === edge.to)?.layer === filterLayer

      if (!fromFiltered && !toFiltered) return null

      // Calculate control points for curved line
      const midX = (fromPos.x + 140 + toPos.x) / 2

      return (
        <path
          key={idx}
          d={`M ${fromPos.x + 140} ${fromPos.y + 25} Q ${midX} ${fromPos.y + 25} ${midX} ${(fromPos.y + toPos.y) / 2 + 25} Q ${midX} ${toPos.y + 25} ${toPos.x} ${toPos.y + 25}`}
          fill="none"
          stroke={isHighlighted ? '#6366f1' : '#cbd5e1'}
          strokeWidth={isHighlighted ? 2.5 : 1.5}
          strokeDasharray={isHighlighted ? '' : ''}
          markerEnd="url(#arrowhead)"
          className="transition-all duration-200"
        />
      )
    })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <select
            value={selectedProject.id}
            onChange={(e) => {
              const project = sampleProjects.find(p => p.id === e.target.value)
              if (project) {
                setSelectedProject(project)
                clearSelection()
              }
            }}
            className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {sampleProjects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Layer:</span>
            <select
              value={filterLayer}
              onChange={(e) => setFilterLayer(e.target.value as ModelLayer | 'all')}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="all">All Layers</option>
              <option value="source">Source</option>
              <option value="staging">Staging</option>
              <option value="intermediate">Intermediate</option>
              <option value="marts">Marts</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {selectedProject.models.length} models | {selectedProject.sources.length} sources
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: 'lineage', label: 'Lineage Graph', icon: '🔀' },
          { id: 'code', label: 'SQL Code', icon: '📝' },
          { id: 'tests', label: 'Tests', icon: '✅' },
          { id: 'commands', label: 'dbt Commands', icon: '⌨️' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-600 bg-orange-50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Panel */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'lineage' && (
            <div className="relative h-full min-h-[500px]" ref={canvasRef}>
              {/* Layer Labels */}
              <div className="absolute top-2 left-0 right-0 flex justify-around text-xs font-medium text-gray-500">
                <span className="w-36 text-center">Sources</span>
                <span className="w-36 text-center">Staging</span>
                <span className="w-36 text-center">Intermediate</span>
                <span className="w-36 text-center">Marts</span>
              </div>

              {/* SVG for edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '500px' }}>
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                  </marker>
                </defs>
                {renderEdges()}
              </svg>

              {/* Source Nodes */}
              {(filterLayer === 'all' || filterLayer === 'source') && selectedProject.sources.map(source => {
                const pos = nodePositions[source.id]
                if (!pos) return null
                const isSelected = selectedNode && 'tables' in selectedNode && selectedNode.id === source.id
                const isInPath = highlightedPath.includes(source.id)

                return (
                  <div
                    key={source.id}
                    onClick={() => handleNodeClick(source.id, 'source')}
                    className={`absolute w-36 cursor-pointer transition-all duration-200 ${
                      isSelected ? 'ring-2 ring-indigo-500 shadow-lg scale-105' : ''
                    } ${isInPath ? 'opacity-100' : highlightedPath.length > 0 ? 'opacity-40' : ''}`}
                    style={{ left: pos.x, top: pos.y }}
                  >
                    <div className={`p-2 rounded-lg border-2 ${layerColors.source.bg} ${layerColors.source.border}`}>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-sm">🗄️</span>
                        <span className="text-xs font-bold text-gray-700 truncate">{source.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {source.tables.length} tables
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Model Nodes */}
              {filteredModels.map(model => {
                const pos = nodePositions[model.id]
                if (!pos) return null
                const isSelected = selectedNode && 'sql' in selectedNode && selectedNode.id === model.id
                const isInPath = highlightedPath.includes(model.id)
                const colors = layerColors[model.layer]

                return (
                  <div
                    key={model.id}
                    onClick={() => handleNodeClick(model.id, 'model')}
                    className={`absolute w-36 cursor-pointer transition-all duration-200 ${
                      isSelected ? 'ring-2 ring-indigo-500 shadow-lg scale-105' : ''
                    } ${isInPath ? 'opacity-100' : highlightedPath.length > 0 ? 'opacity-40' : ''}`}
                    style={{ left: pos.x, top: pos.y }}
                  >
                    <div className={`p-2 rounded-lg border-2 ${colors.bg} ${colors.border}`}>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-sm">{materializationIcons[model.materialization]}</span>
                        <span className={`text-xs font-bold truncate ${colors.text}`}>{model.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{model.materialization}</span>
                        {model.tests.length > 0 && (
                          <span className="text-green-600">✓ {model.tests.length}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg border shadow-sm">
                <div className="text-xs font-bold text-gray-700 mb-2">Legend</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(layerColors).map(([layer, colors]) => (
                    <div key={layer} className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded ${colors.bg} ${colors.border} border`}></div>
                      <span className="capitalize">{layer}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t grid grid-cols-2 gap-1 text-xs">
                  {Object.entries(materializationIcons).map(([mat, icon]) => (
                    <div key={mat} className="flex items-center gap-1">
                      <span>{icon}</span>
                      <span className="capitalize">{mat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && selectedNode && selectedNodeType === 'model' && 'sql' in selectedNode && (
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{selectedNode.name}</h3>
                <p className="text-sm text-gray-600">{selectedNode.description}</p>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
                <code>{selectedNode.sql}</code>
              </pre>
            </div>
          )}

          {activeTab === 'code' && (!selectedNode || selectedNodeType !== 'model') && (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📝</div>
                <p>Lineage 탭에서 모델을 선택하면 SQL 코드를 볼 수 있습니다</p>
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">dbt Tests</h3>
              <div className="space-y-3">
                {selectedProject.models
                  .filter(m => m.columns.some(c => c.tests && c.tests.length > 0))
                  .map(model => (
                    <div key={model.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-gray-900 mb-2">{model.name}</div>
                      <div className="space-y-1">
                        {model.columns
                          .filter(c => c.tests && c.tests.length > 0)
                          .map(col => (
                            <div key={col.name} className="flex items-center gap-2 text-sm">
                              <span className="text-gray-600">{col.name}:</span>
                              <div className="flex gap-1">
                                {col.tests?.map(test => (
                                  <span
                                    key={test}
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                                      test === 'unique' ? 'bg-purple-100 text-purple-700' :
                                      test === 'not_null' ? 'bg-red-100 text-red-700' :
                                      test === 'accepted_values' ? 'bg-blue-100 text-blue-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {test}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'commands' && (
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">dbt CLI Commands</h3>
              <div className="space-y-2">
                {dbtCommands.map((cmd, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <code className="px-2 py-1 bg-gray-900 text-green-400 rounded text-sm font-mono">
                      {cmd.command}
                    </code>
                    <span className="text-sm text-gray-600">{cmd.description}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="font-bold text-gray-900 mb-3">Selector Examples</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-blue-50 rounded">
                    <code className="text-blue-700">--select model_name</code>
                    <span className="text-gray-600 ml-2">특정 모델</span>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <code className="text-blue-700">--select +model_name</code>
                    <span className="text-gray-600 ml-2">모델 + upstream</span>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <code className="text-blue-700">--select model_name+</code>
                    <span className="text-gray-600 ml-2">모델 + downstream</span>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <code className="text-blue-700">--select tag:marts</code>
                    <span className="text-gray-600 ml-2">특정 태그</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel - Node Details */}
        {selectedNode && (
          <div className="w-80 border-l bg-gray-50 overflow-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">
                  {selectedNodeType === 'model' ? 'Model Details' : 'Source Details'}
                </h3>
                <button
                  onClick={clearSelection}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {selectedNodeType === 'model' && 'sql' in selectedNode && (
                <>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{materializationIcons[selectedNode.materialization]}</span>
                      <span className="font-bold text-gray-900">{selectedNode.name}</span>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${layerColors[selectedNode.layer].bg} ${layerColors[selectedNode.layer].text}`}>
                      {selectedNode.layer}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-1">Description</div>
                    <p className="text-sm text-gray-700">{selectedNode.description}</p>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-1">Materialization</div>
                    <p className="text-sm text-gray-700">{materializationDescriptions[selectedNode.materialization]}</p>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-2">Columns ({selectedNode.columns.length})</div>
                    <div className="space-y-1 max-h-40 overflow-auto">
                      {selectedNode.columns.map(col => (
                        <div key={col.name} className="flex items-center justify-between text-xs bg-white p-2 rounded">
                          <span className="font-mono text-gray-800">{col.name}</span>
                          <span className="text-gray-500">{col.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-2">Dependencies</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.depends_on.map(dep => (
                        <span key={dep} className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                          {dep.replace('src_', '').replace('stg_', '').replace('int_', '')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedNode.tags && selectedNode.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-medium text-gray-500 mb-2">Tags</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedNode.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedNodeType === 'source' && 'tables' in selectedNode && (
                <>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🗄️</span>
                      <span className="font-bold text-gray-900">{selectedNode.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedNode.database}.{selectedNode.schema}
                    </div>
                  </div>

                  {selectedNode.description && (
                    <div className="mb-4">
                      <div className="text-xs font-medium text-gray-500 mb-1">Description</div>
                      <p className="text-sm text-gray-700">{selectedNode.description}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-2">Tables ({selectedNode.tables.length})</div>
                    <div className="space-y-2">
                      {selectedNode.tables.map(table => (
                        <div key={table.name} className="bg-white p-2 rounded border">
                          <div className="font-medium text-sm text-gray-800 mb-1">{table.name}</div>
                          <div className="flex flex-wrap gap-1">
                            {table.columns.map(col => (
                              <span key={col} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">
                                {col}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Layer Descriptions */}
      <div className="border-t bg-gray-50 px-4 py-3">
        <div className="flex flex-wrap gap-4 text-xs">
          {Object.entries(layerDescriptions).map(([layer, desc]) => (
            <div key={layer} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${layerColors[layer as ModelLayer].bg} ${layerColors[layer as ModelLayer].border} border`}></div>
              <span className="font-medium capitalize">{layer}:</span>
              <span className="text-gray-600">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
