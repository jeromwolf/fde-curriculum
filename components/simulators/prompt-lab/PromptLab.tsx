'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  PromptTemplate,
  PromptConfig,
  PromptResult,
  PromptLabProps,
  techniqueStyles,
  modelInfo,
  categoryColors,
  ModelType,
  PromptTechnique,
} from './types'
import {
  promptTemplates,
  techniqueDescriptions,
  bestPractices,
  sampleResponses,
} from './sampleTemplates'

const defaultConfig: PromptConfig = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1000,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
}

export const PromptLab: React.FC<PromptLabProps> = ({
  showTechniques = true,
  showComparison = true,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>(promptTemplates[0])
  const [config, setConfig] = useState<PromptConfig>(defaultConfig)
  const [systemPrompt, setSystemPrompt] = useState(promptTemplates[0].systemPrompt)
  const [userPrompt, setUserPrompt] = useState(promptTemplates[0].userPromptTemplate)
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [response, setResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'techniques' | 'tips'>('editor')
  const [filterTechnique, setFilterTechnique] = useState<PromptTechnique | 'all'>('all')
  const [history, setHistory] = useState<PromptResult[]>([])

  // Filter templates by technique
  const filteredTemplates = useMemo(() => {
    if (filterTechnique === 'all') return promptTemplates
    return promptTemplates.filter(t => t.technique === filterTechnique)
  }, [filterTechnique])

  // Handle template selection
  const handleSelectTemplate = useCallback((template: PromptTemplate) => {
    setSelectedTemplate(template)
    setSystemPrompt(template.systemPrompt)
    setUserPrompt(template.userPromptTemplate)
    setVariables({})
    setResponse('')
  }, [])

  // Build final prompt with variables
  const buildFinalPrompt = useCallback(() => {
    let finalPrompt = userPrompt
    Object.entries(variables).forEach(([key, value]) => {
      finalPrompt = finalPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })
    return finalPrompt
  }, [userPrompt, variables])

  // Simulate API call
  const handleRun = useCallback(async () => {
    setIsLoading(true)
    setResponse('')

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate simulated response
    const finalPrompt = buildFinalPrompt()
    let simulatedResponse = sampleResponses[selectedTemplate.id] ||
      `## AI 응답 (시뮬레이션)\n\n입력된 프롬프트를 분석하여 응답을 생성했습니다.\n\n**System Prompt:**\n${systemPrompt.slice(0, 100)}...\n\n**User Prompt:**\n${finalPrompt.slice(0, 200)}...\n\n---\n\n*이것은 시뮬레이션된 응답입니다. 실제 API 연동 시 실제 LLM 응답이 표시됩니다.*`

    setResponse(simulatedResponse)

    // Add to history
    const result: PromptResult = {
      id: Date.now().toString(),
      prompt: finalPrompt,
      response: simulatedResponse,
      config: { ...config },
      technique: selectedTemplate.technique,
      timestamp: Date.now(),
      tokenCount: {
        prompt: Math.floor(finalPrompt.length / 4),
        completion: Math.floor(simulatedResponse.length / 4),
        total: Math.floor((finalPrompt.length + simulatedResponse.length) / 4),
      },
    }
    setHistory(prev => [result, ...prev].slice(0, 10))

    setIsLoading(false)
  }, [buildFinalPrompt, config, selectedTemplate, systemPrompt])

  // Render variable inputs
  const renderVariableInputs = () => {
    const vars = selectedTemplate.variables || []
    if (vars.length === 0) return null

    return (
      <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="text-sm font-medium text-purple-800 mb-2">변수 입력</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {vars.map(varName => (
            <div key={varName}>
              <label className="block text-xs text-purple-600 mb-1">
                {`{{${varName}}}`}
              </label>
              <input
                type="text"
                value={variables[varName] || ''}
                onChange={(e) => setVariables(prev => ({ ...prev, [varName]: e.target.value }))}
                placeholder={`${varName} 입력...`}
                className="w-full px-3 py-1.5 border border-purple-200 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <select
            value={filterTechnique}
            onChange={(e) => setFilterTechnique(e.target.value as PromptTechnique | 'all')}
            className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Techniques</option>
            {Object.entries(techniqueStyles).map(([tech, style]) => (
              <option key={tech} value={tech}>{style.icon} {style.label}</option>
            ))}
          </select>

          <select
            value={config.model}
            onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value as ModelType }))}
            className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            {Object.entries(modelInfo).map(([model, info]) => (
              <option key={model} value={model}>{model} ({info.provider})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Temperature:</span>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={config.temperature}
            onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
            className="w-20"
          />
          <span className="w-8">{config.temperature}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: 'editor', label: 'Prompt Editor', icon: '✏️' },
          { id: 'techniques', label: 'Techniques', icon: '📚' },
          { id: 'tips', label: 'Best Practices', icon: '💡' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-purple-500 text-purple-600 bg-purple-50'
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
        {activeTab === 'editor' && (
          <>
            {/* Template Sidebar */}
            <div className="w-64 border-r bg-gray-50 overflow-auto">
              <div className="p-3">
                <div className="text-sm font-medium text-gray-700 mb-2">Templates</div>
                <div className="space-y-2">
                  {filteredTemplates.map(template => {
                    const style = techniqueStyles[template.technique]
                    const isSelected = selectedTemplate.id === template.id
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className={`w-full text-left p-2 rounded-lg transition-all ${
                          isSelected
                            ? 'bg-purple-100 border-2 border-purple-400'
                            : 'bg-white border border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span>{style.icon}</span>
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {template.name}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <span className={`px-1.5 py-0.5 rounded text-xs ${style.color}`}>
                            {style.label}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-xs ${categoryColors[template.category]}`}>
                            {template.category}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Main Editor */}
            <div className="flex-1 flex flex-col overflow-auto">
              <div className="p-4 space-y-4">
                {/* Selected Template Info */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{selectedTemplate.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${techniqueStyles[selectedTemplate.technique].color}`}>
                      {techniqueStyles[selectedTemplate.technique].icon} {techniqueStyles[selectedTemplate.technique].label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                </div>

                {/* System Prompt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    System Prompt
                  </label>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Variable Inputs */}
                {renderVariableInputs()}

                {/* User Prompt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Prompt Template
                  </label>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Tips */}
                {selectedTemplate.tips && selectedTemplate.tips.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div className="text-sm font-medium text-yellow-800 mb-1">💡 Tips</div>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      {selectedTemplate.tips.map((tip, idx) => (
                        <li key={idx}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Run Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRun}
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      isLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Generating...
                      </span>
                    ) : (
                      <span>▶ Run Prompt</span>
                    )}
                  </button>
                  <span className="text-xs text-gray-500">
                    Model: {config.model} | Temp: {config.temperature}
                  </span>
                </div>

                {/* Response */}
                {response && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-3 py-2 border-b flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Response</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(response)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <div className="p-4 bg-white">
                      <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800">
                        {response}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* History Sidebar */}
            {history.length > 0 && (
              <div className="w-64 border-l bg-gray-50 overflow-auto">
                <div className="p-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">History</div>
                  <div className="space-y-2">
                    {history.map((item, idx) => (
                      <div key={item.id} className="bg-white p-2 rounded border text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`px-1.5 py-0.5 rounded ${techniqueStyles[item.technique].color}`}>
                            {techniqueStyles[item.technique].label}
                          </span>
                          <span className="text-gray-400">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-gray-600 truncate">{item.prompt.slice(0, 50)}...</div>
                        {item.tokenCount && (
                          <div className="text-gray-400 mt-1">
                            Tokens: {item.tokenCount.total}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'techniques' && (
          <div className="flex-1 overflow-auto p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Prompt Engineering Techniques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(techniqueDescriptions).map(([tech, info]) => {
                const style = techniqueStyles[tech as PromptTechnique]
                return (
                  <div key={tech} className="bg-white rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{style.icon}</span>
                      <h4 className="font-bold text-gray-900">{info.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{info.description}</p>
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">Best for:</div>
                      <div className="flex flex-wrap gap-1">
                        {info.bestFor.map((use, idx) => (
                          <span key={idx} className={`px-2 py-0.5 rounded text-xs ${style.color}`}>
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="flex-1 overflow-auto p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bestPractices.map((practice, idx) => (
                <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-gray-900">{practice.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{practice.description}</p>
                </div>
              ))}
            </div>

            {/* Model Comparison */}
            <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Model Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Model</th>
                    <th className="px-4 py-2 text-left">Provider</th>
                    <th className="px-4 py-2 text-right">Context Window</th>
                    <th className="px-4 py-2 text-right">Cost/1K tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(modelInfo).map(([model, info]) => (
                    <tr key={model} className="border-b">
                      <td className="px-4 py-2 font-mono">{model}</td>
                      <td className="px-4 py-2">{info.provider}</td>
                      <td className="px-4 py-2 text-right">{info.contextWindow.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">${info.costPer1K}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
