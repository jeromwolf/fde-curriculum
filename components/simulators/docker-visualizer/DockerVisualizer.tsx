'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  DockerComposeConfig,
  DockerContainer,
  DockerVisualizerProps,
  containerStateColors,
  networkDriverColors,
  volumeTypeIcons,
  ContainerState,
} from './types'
import {
  sampleConfigs,
  dockerCommands,
  stateDescriptions,
  networkDriverDescriptions,
} from './sampleConfigs'

export const DockerVisualizer: React.FC<DockerVisualizerProps> = ({
  showYaml = true,
  interactive = true,
}) => {
  const [selectedConfig, setSelectedConfig] = useState<DockerComposeConfig>(sampleConfigs[0])
  const [selectedContainer, setSelectedContainer] = useState<DockerContainer | null>(null)
  const [activeTab, setActiveTab] = useState<'diagram' | 'yaml' | 'commands'>('diagram')
  const [containerStates, setContainerStates] = useState<Record<string, ContainerState>>({})

  // Get container state (simulated)
  const getContainerState = useCallback((containerId: string): ContainerState => {
    return containerStates[containerId] || selectedConfig.containers.find(c => c.id === containerId)?.state || 'stopped'
  }, [containerStates, selectedConfig])

  // Toggle container state (simulation)
  const toggleContainerState = useCallback((containerId: string) => {
    if (!interactive) return
    setContainerStates(prev => {
      const currentState = prev[containerId] || selectedConfig.containers.find(c => c.id === containerId)?.state || 'stopped'
      const newState: ContainerState = currentState === 'running' ? 'stopped' : 'running'
      return { ...prev, [containerId]: newState }
    })
  }, [interactive, selectedConfig])

  // Start all containers
  const startAllContainers = useCallback(() => {
    const newStates: Record<string, ContainerState> = {}
    selectedConfig.containers.forEach(c => {
      newStates[c.id] = 'running'
    })
    setContainerStates(newStates)
  }, [selectedConfig])

  // Stop all containers
  const stopAllContainers = useCallback(() => {
    const newStates: Record<string, ContainerState> = {}
    selectedConfig.containers.forEach(c => {
      newStates[c.id] = 'stopped'
    })
    setContainerStates(newStates)
  }, [selectedConfig])

  // Group containers by network
  const containersByNetwork = useMemo(() => {
    const groups: Record<string, DockerContainer[]> = {}
    selectedConfig.networks.forEach(net => {
      groups[net.name] = selectedConfig.containers.filter(c => c.networks.includes(net.name))
    })
    return groups
  }, [selectedConfig])

  // Render container card
  const renderContainerCard = (container: DockerContainer) => {
    const state = getContainerState(container.id)
    const colors = containerStateColors[state]
    const isSelected = selectedContainer?.id === container.id

    return (
      <div
        key={container.id}
        onClick={() => setSelectedContainer(container)}
        className={`
          p-3 rounded-lg border-2 cursor-pointer transition-all
          ${colors.bg} ${colors.border}
          ${isSelected ? 'ring-2 ring-blue-500 shadow-lg scale-105' : 'hover:shadow-md'}
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} ${state === 'running' ? 'animate-pulse' : ''}`}></div>
            <span className="font-bold text-gray-900 text-sm">{container.name}</span>
          </div>
          {interactive && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleContainerState(container.id)
              }}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                state === 'running'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {state === 'running' ? 'Stop' : 'Start'}
            </button>
          )}
        </div>

        <div className="text-xs text-gray-600 mb-2">
          <span className="font-mono bg-gray-100 px-1 rounded">{container.image}:{container.tag}</span>
        </div>

        {container.ports.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {container.ports.map((port, idx) => (
              <span key={idx} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-mono">
                {port.host}:{port.container}
              </span>
            ))}
          </div>
        )}

        {container.dependsOn && container.dependsOn.length > 0 && (
          <div className="text-xs text-gray-500">
            depends_on: {container.dependsOn.join(', ')}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <select
            value={selectedConfig.id}
            onChange={(e) => {
              const config = sampleConfigs.find(c => c.id === e.target.value)
              if (config) {
                setSelectedConfig(config)
                setSelectedContainer(null)
                setContainerStates({})
              }
            }}
            className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {sampleConfigs.map(config => (
              <option key={config.id} value={config.id}>
                {config.name}
              </option>
            ))}
          </select>

          <span className="text-xs text-gray-500">
            {selectedConfig.containers.length} containers | {selectedConfig.networks.length} networks | {selectedConfig.volumes.length} volumes
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startAllContainers}
            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
          >
            ▶ Start All
          </button>
          <button
            onClick={stopAllContainers}
            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
          >
            ■ Stop All
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: 'diagram', label: 'Container Diagram', icon: '🐳' },
          { id: 'yaml', label: 'docker-compose.yml', icon: '📄' },
          { id: 'commands', label: 'Commands', icon: '⌨️' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
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
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'diagram' && (
            <div className="space-y-6">
              {/* Networks with Containers */}
              {selectedConfig.networks.map(network => {
                const containers = containersByNetwork[network.name] || []
                if (containers.length === 0) return null

                return (
                  <div
                    key={network.id}
                    className="rounded-xl border-2 border-dashed border-gray-300 p-4 bg-gray-50"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">🌐</span>
                      <span className="font-bold text-gray-700">{network.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${networkDriverColors[network.driver]}`}>
                        {network.driver}
                      </span>
                      {network.internal && (
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">
                          internal
                        </span>
                      )}
                      {network.subnet && (
                        <span className="text-xs text-gray-500 font-mono">{network.subnet}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {containers.map(renderContainerCard)}
                    </div>
                  </div>
                )
              })}

              {/* Volumes */}
              {selectedConfig.volumes.length > 0 && (
                <div className="rounded-xl border border-gray-200 p-4 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">💾</span>
                    <span className="font-bold text-gray-700">Volumes</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedConfig.volumes.map(vol => (
                      <div
                        key={vol.id}
                        className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg"
                      >
                        <div className="font-medium text-purple-800 text-sm">{vol.name}</div>
                        <div className="text-xs text-purple-600">driver: {vol.driver}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Container States:</span>
                </div>
                {Object.entries(containerStateColors).map(([state, colors]) => (
                  <div key={state} className="flex items-center gap-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`}></div>
                    <span className="capitalize">{state}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'yaml' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">docker-compose.yml</h3>
                <button
                  onClick={() => navigator.clipboard.writeText(selectedConfig.yaml)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  📋 Copy
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm font-mono leading-relaxed">
                {selectedConfig.yaml}
              </pre>
            </div>
          )}

          {activeTab === 'commands' && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Docker Compose Commands</h3>
              <div className="space-y-2 mb-8">
                {dockerCommands.map((cmd, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <code className="px-2 py-1 bg-gray-900 text-green-400 rounded text-sm font-mono whitespace-nowrap">
                      {cmd.command}
                    </code>
                    <span className="text-sm text-gray-600">{cmd.description}</span>
                  </div>
                ))}
              </div>

              <h4 className="font-bold text-gray-900 mb-3">Network Drivers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {Object.entries(networkDriverDescriptions).map(([driver, desc]) => (
                  <div key={driver} className="p-3 bg-gray-50 rounded-lg">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-1 ${networkDriverColors[driver as keyof typeof networkDriverColors]}`}>
                      {driver}
                    </span>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Side Panel - Container Details */}
        {selectedContainer && (
          <div className="w-80 border-l bg-gray-50 overflow-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Container Details</h3>
                <button
                  onClick={() => setSelectedContainer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Container Info */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🐳</span>
                    <span className="font-bold text-lg text-gray-900">{selectedContainer.name}</span>
                  </div>
                  <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                    {selectedContainer.image}:{selectedContainer.tag}
                  </div>
                </div>

                {/* State */}
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">State</div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${containerStateColors[getContainerState(selectedContainer.id)].dot}`}></div>
                    <span className="capitalize font-medium">{getContainerState(selectedContainer.id)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stateDescriptions[getContainerState(selectedContainer.id)]}</p>
                </div>

                {/* Ports */}
                {selectedContainer.ports.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">Ports</div>
                    <div className="space-y-1">
                      {selectedContainer.ports.map((port, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span className="font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {port.host}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                            {port.container}/{port.protocol}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Environment Variables */}
                {selectedContainer.environment.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">Environment</div>
                    <div className="space-y-1 max-h-32 overflow-auto">
                      {selectedContainer.environment.map((env, idx) => (
                        <div key={idx} className="text-xs font-mono bg-white p-2 rounded border">
                          <span className="text-purple-600">{env.key}</span>
                          <span className="text-gray-400">=</span>
                          <span className={env.secret ? 'text-red-500' : 'text-gray-700'}>
                            {env.secret ? '********' : env.value}
                          </span>
                          {env.secret && <span className="ml-1 text-red-400">🔒</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Volumes */}
                {selectedContainer.volumes.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">Volumes</div>
                    <div className="space-y-1">
                      {selectedContainer.volumes.map((vol, idx) => (
                        <div key={idx} className="text-xs bg-white p-2 rounded border">
                          <div className="flex items-center gap-1 mb-1">
                            <span>{volumeTypeIcons[vol.type]}</span>
                            <span className="font-medium text-gray-700">{vol.type}</span>
                            {vol.readonly && <span className="text-orange-500 text-xs">(ro)</span>}
                          </div>
                          <div className="font-mono text-gray-600 truncate" title={vol.source}>
                            {vol.source}
                          </div>
                          <div className="text-gray-400">↓</div>
                          <div className="font-mono text-gray-600 truncate" title={vol.target}>
                            {vol.target}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Networks */}
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-2">Networks</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedContainer.networks.map(net => (
                      <span key={net} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                        {net}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dependencies */}
                {selectedContainer.dependsOn && selectedContainer.dependsOn.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">Depends On</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedContainer.dependsOn.map(dep => (
                        <span key={dep} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Restart Policy */}
                {selectedContainer.restart && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Restart Policy</div>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                      {selectedContainer.restart}
                    </span>
                  </div>
                )}

                {/* Command */}
                {selectedContainer.command && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Command</div>
                    <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded block">
                      {selectedContainer.command}
                    </code>
                  </div>
                )}

                {/* Health Check */}
                {selectedContainer.healthCheck && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Health Check</div>
                    <div className="text-xs bg-white p-2 rounded border">
                      <code className="text-purple-600">{selectedContainer.healthCheck.test.join(' ')}</code>
                      <div className="mt-1 text-gray-500">
                        interval: {selectedContainer.healthCheck.interval} | timeout: {selectedContainer.healthCheck.timeout}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
