'use client'

import { useState, useMemo } from 'react'
import { SparkJob, RDD, Stage, Task, SparkVisualizerProps } from './types'
import { sampleJobs, jobCategories } from './sampleJobs'

// RDD 노드 컬러
const getRDDColor = (rdd: RDD) => {
  if (rdd.cached) return 'bg-yellow-100 border-yellow-500'
  if (rdd.operation?.isWide) return 'bg-red-50 border-red-400'
  return 'bg-blue-50 border-blue-400'
}

// Stage 상태 컬러
const getStageStatusColor = (status: Stage['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-500'
    case 'running': return 'bg-blue-500 animate-pulse'
    case 'failed': return 'bg-red-500'
    default: return 'bg-gray-400'
  }
}

// Task 상태 컬러
const getTaskStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-400'
    case 'running': return 'bg-blue-400 animate-pulse'
    case 'failed': return 'bg-red-400'
    default: return 'bg-gray-300'
  }
}

export function SparkVisualizer({
  showCode = true,
  showPartitions = true,
  animateExecution = false,
}: SparkVisualizerProps) {
  const [selectedJobId, setSelectedJobId] = useState(sampleJobs[0].id)
  const [selectedRDD, setSelectedRDD] = useState<RDD | null>(null)
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null)
  const [activeTab, setActiveTab] = useState<'dag' | 'stages' | 'code'>('dag')

  const currentJob = useMemo(() => {
    return sampleJobs.find(job => job.id === selectedJobId) || sampleJobs[0]
  }, [selectedJobId])

  // 카테고리별 Job 그룹화
  const groupedJobs = useMemo(() => {
    const groups: Record<string, SparkJob[]> = {}
    sampleJobs.forEach(job => {
      if (!groups[job.category]) {
        groups[job.category] = []
      }
      groups[job.category].push(job)
    })
    return groups
  }, [])

  return (
    <div className="h-full flex flex-col">
      {/* 툴바 */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Job 선택 */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Spark Job:</label>
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value)
                setSelectedRDD(null)
                setSelectedStage(null)
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {Object.entries(groupedJobs).map(([category, jobs]) => (
                <optgroup key={category} label={jobCategories[category as keyof typeof jobCategories]}>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Job 통계 */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              <span className="font-medium">{currentJob.rdds.length}</span> RDDs
            </span>
            <span>
              <span className="font-medium">{currentJob.stages.length}</span> Stages
            </span>
            <span>
              <span className="font-medium">{currentJob.totalDuration}</span>ms
            </span>
          </div>

          {/* 탭 버튼 */}
          <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('dag')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'dag' ? 'bg-white shadow text-orange-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              DAG
            </button>
            <button
              onClick={() => setActiveTab('stages')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'stages' ? 'bg-white shadow text-orange-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Stages
            </button>
            {showCode && (
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activeTab === 'code' ? 'bg-white shadow text-orange-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Code
              </button>
            )}
          </div>
        </div>

        {/* Job 설명 */}
        <p className="mt-2 text-sm text-gray-600">{currentJob.description}</p>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'dag' && (
          <DAGView
            job={currentJob}
            selectedRDD={selectedRDD}
            onSelectRDD={setSelectedRDD}
            showPartitions={showPartitions}
          />
        )}
        {activeTab === 'stages' && (
          <StagesView
            job={currentJob}
            selectedStage={selectedStage}
            onSelectStage={setSelectedStage}
          />
        )}
        {activeTab === 'code' && (
          <CodeView code={currentJob.code} />
        )}
      </div>

      {/* 범례 */}
      <div className="bg-gray-50 border-t border-gray-200 p-3">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-50 border-2 border-blue-400"></div>
            <span className="text-gray-600">Narrow Transformation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-50 border-2 border-red-400"></div>
            <span className="text-gray-600">Wide Transformation (Shuffle)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border-2 border-yellow-500"></div>
            <span className="text-gray-600">Cached RDD</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-gray-400"></div>
            <span className="text-gray-600">Narrow Dependency</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-red-500" style={{ background: 'repeating-linear-gradient(90deg, #EF4444, #EF4444 2px, transparent 2px, transparent 4px)' }}></div>
            <span className="text-gray-600">Shuffle Dependency</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// DAG 뷰 컴포넌트
function DAGView({
  job,
  selectedRDD,
  onSelectRDD,
  showPartitions,
}: {
  job: SparkJob
  selectedRDD: RDD | null
  onSelectRDD: (rdd: RDD | null) => void
  showPartitions: boolean
}) {
  return (
    <div className="h-full flex">
      {/* DAG 그래프 */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex flex-col gap-4">
          {job.rdds.map((rdd, index) => (
            <div key={rdd.id} className="flex items-center gap-4">
              {/* 연결선 */}
              {index > 0 && (
                <div className="flex flex-col items-center w-8">
                  <div
                    className={`w-0.5 h-8 ${
                      rdd.operation?.isWide
                        ? 'bg-red-500'
                        : 'bg-gray-400'
                    }`}
                    style={rdd.operation?.isWide ? {
                      background: 'repeating-linear-gradient(180deg, #EF4444, #EF4444 4px, transparent 4px, transparent 8px)'
                    } : {}}
                  />
                  {rdd.operation?.isWide && (
                    <div className="text-xs text-red-500 font-medium">Shuffle</div>
                  )}
                </div>
              )}

              {/* RDD 노드 */}
              <button
                onClick={() => onSelectRDD(selectedRDD?.id === rdd.id ? null : rdd)}
                className={`
                  flex-1 p-4 rounded-lg border-2 text-left transition-all
                  ${getRDDColor(rdd)}
                  ${selectedRDD?.id === rdd.id ? 'ring-2 ring-orange-400 shadow-lg' : 'hover:shadow-md'}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{rdd.name}</span>
                  <div className="flex items-center gap-2">
                    {rdd.cached && (
                      <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded font-medium">
                        CACHED
                      </span>
                    )}
                    {rdd.operation && (
                      <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                        rdd.operation.isWide
                          ? 'bg-red-200 text-red-800'
                          : 'bg-blue-200 text-blue-800'
                      }`}>
                        {rdd.operation.isWide ? 'Wide' : 'Narrow'}
                      </span>
                    )}
                  </div>
                </div>

                {rdd.operation && (
                  <div className="text-sm text-gray-600 mb-2">
                    {rdd.operation.description}
                  </div>
                )}

                {/* 파티션 미리보기 */}
                {showPartitions && (
                  <div className="flex gap-1 mt-2">
                    {rdd.partitions.map((partition) => (
                      <div
                        key={partition.id}
                        className="flex-1 h-2 rounded"
                        style={{ backgroundColor: partition.color }}
                        title={`${partition.id}: ${partition.data.length} items`}
                      />
                    ))}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RDD 상세 패널 */}
      {selectedRDD && (
        <div className="w-80 border-l border-gray-200 bg-white p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">RDD Details</h3>
            <button
              onClick={() => onSelectRDD(null)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Name</div>
              <div className="text-gray-900">{selectedRDD.name}</div>
            </div>

            {selectedRDD.operation && (
              <>
                <div>
                  <div className="text-sm font-medium text-gray-500">Operation</div>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {selectedRDD.operation.code}
                  </code>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Type</div>
                  <div className={`inline-block px-2 py-1 rounded text-sm ${
                    selectedRDD.operation.isWide
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedRDD.operation.isWide ? 'Wide (Shuffle)' : 'Narrow (No Shuffle)'}
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">
                Partitions ({selectedRDD.partitions.length})
              </div>
              <div className="space-y-2">
                {selectedRDD.partitions.map((partition) => (
                  <div
                    key={partition.id}
                    className="p-2 bg-gray-50 rounded border"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: partition.color }}
                      />
                      <span className="text-sm font-medium">{partition.id}</span>
                    </div>
                    <div className="text-xs text-gray-600 font-mono overflow-hidden">
                      {partition.data.slice(0, 3).join(', ')}
                      {partition.data.length > 3 && '...'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Stages 뷰 컴포넌트
function StagesView({
  job,
  selectedStage,
  onSelectStage,
}: {
  job: SparkJob
  selectedStage: Stage | null
  onSelectStage: (stage: Stage | null) => void
}) {
  return (
    <div className="h-full flex">
      {/* Stages 목록 */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-4">
          {job.stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => onSelectStage(selectedStage?.id === stage.id ? null : stage)}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all
                ${selectedStage?.id === stage.id
                  ? 'border-orange-400 bg-orange-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:shadow-md'
                }
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStageStatusColor(stage.status)}`} />
                  <span className="font-semibold text-gray-900">{stage.name}</span>
                </div>
                <span className="text-sm text-gray-500">{stage.tasks.length} tasks</span>
              </div>

              {/* Task 바 */}
              <div className="flex gap-1 mb-3">
                {stage.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex-1 h-6 rounded ${getTaskStatusColor(task.status)}`}
                    title={`${task.id}: ${task.duration}ms`}
                  />
                ))}
              </div>

              {/* Shuffle 정보 */}
              <div className="flex items-center gap-4 text-sm">
                {stage.shuffleRead > 0 && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span>Read: {(stage.shuffleRead / 1024).toFixed(1)} KB</span>
                  </div>
                )}
                {stage.shuffleWrite > 0 && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span>Write: {(stage.shuffleWrite / 1024).toFixed(1)} KB</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stage 상세 패널 */}
      {selectedStage && (
        <div className="w-96 border-l border-gray-200 bg-white p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Stage Details</h3>
            <button
              onClick={() => onSelectStage(null)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Name</div>
              <div className="text-gray-900">{selectedStage.name}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Shuffle Read</div>
                <div className="text-gray-900">{(selectedStage.shuffleRead / 1024).toFixed(1)} KB</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Shuffle Write</div>
                <div className="text-gray-900">{(selectedStage.shuffleWrite / 1024).toFixed(1)} KB</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">
                Tasks ({selectedStage.tasks.length})
              </div>
              <div className="space-y-2">
                {selectedStage.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-gray-50 rounded border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getTaskStatusColor(task.status)}`} />
                        <span className="text-sm font-medium">{task.id}</span>
                      </div>
                      <span className="text-xs text-gray-500">{task.executor}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Duration</span>
                        <div className="font-medium">{task.duration}ms</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Input</span>
                        <div className="font-medium">{task.inputRows} rows</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Output</span>
                        <div className="font-medium">{task.outputRows} rows</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Code 뷰 컴포넌트
function CodeView({ code }: { code: string }) {
  return (
    <div className="h-full p-4 overflow-auto">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-auto">
        {code.split('\n').map((line, i) => (
          <div key={i} className="flex">
            <span className="w-8 text-gray-500 select-none">{i + 1}</span>
            <span className={
              line.trim().startsWith('#') || line.trim().startsWith('//')
                ? 'text-green-400'
                : line.includes('.map') || line.includes('.filter') || line.includes('.flatMap')
                  ? 'text-blue-300'
                  : line.includes('.reduceByKey') || line.includes('.groupByKey') || line.includes('.join') || line.includes('.sortByKey')
                    ? 'text-red-300'
                    : line.includes('.cache') || line.includes('.persist')
                      ? 'text-yellow-300'
                      : line.includes('.collect') || line.includes('.count') || line.includes('.take') || line.includes('.saveAs')
                        ? 'text-purple-300'
                        : ''
            }>
              {line}
            </span>
          </div>
        ))}
      </pre>

      {/* 코드 범례 */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">코드 색상 가이드</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-400"></div>
            <span>주석</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-300"></div>
            <span>Narrow Transformation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-300"></div>
            <span>Wide Transformation (Shuffle)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-300"></div>
            <span>캐싱</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-300"></div>
            <span>Action</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SparkVisualizer
