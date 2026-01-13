'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { AirflowDAGProps, DAG, Task, TaskState } from './types'
import {
  sampleDAGs,
  dagCategories,
  operatorDescriptions,
  taskStateColors,
  schedulePresets,
  simulateTaskExecution,
} from './sampleDAGs'

export function AirflowDAG({
  showCode = true,
  showLogs = true,
  animateExecution = true,
}: AirflowDAGProps) {
  const [selectedDAGId, setSelectedDAGId] = useState(sampleDAGs[0].id)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [executionLogs, setExecutionLogs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'graph' | 'code' | 'logs'>('graph')
  const runningRef = useRef(false)

  const currentDAG = useMemo(() => {
    return sampleDAGs.find((d) => d.id === selectedDAGId) || sampleDAGs[0]
  }, [selectedDAGId])

  // DAG 변경 시 태스크 초기화
  useEffect(() => {
    setTasks(currentDAG.dag.tasks.map((t) => ({ ...t, state: 'none' as TaskState })))
    setExecutionLogs([])
    setSelectedTask(null)
  }, [currentDAG])

  // DAG 실행
  const runDAG = useCallback(async () => {
    if (isRunning) return

    setIsRunning(true)
    runningRef.current = true
    setExecutionLogs([`[${new Date().toISOString()}] DAG ${currentDAG.dag.name} 실행 시작`])

    // 모든 태스크 초기화
    setTasks((prev) => prev.map((t) => ({ ...t, state: 'scheduled' as TaskState })))

    // 토폴로지 정렬로 실행 순서 결정
    const taskMap = new Map(currentDAG.dag.tasks.map((t) => [t.id, t]))
    const executed = new Set<string>()
    const queue: string[] = currentDAG.dag.tasks
      .filter((t) => t.upstreamIds.length === 0)
      .map((t) => t.id)

    while (queue.length > 0 && runningRef.current) {
      const currentBatch = [...queue]
      queue.length = 0

      // 현재 배치의 태스크들을 병렬로 실행
      await Promise.all(
        currentBatch.map(async (taskId) => {
          const task = taskMap.get(taskId)
          if (!task || executed.has(taskId)) return

          // 상위 태스크 상태 확인
          const upstreamStates = task.upstreamIds.map((id) => {
            const upTask = tasks.find((t) => t.id === id)
            return upTask?.state || 'none'
          })

          // 상위 태스크가 모두 완료될 때까지 대기
          const allUpstreamDone = task.upstreamIds.every((id) => executed.has(id))
          if (!allUpstreamDone && task.upstreamIds.length > 0) {
            queue.push(taskId)
            return
          }

          // 실행 중 상태로 변경
          setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, state: 'running' as TaskState } : t))
          )

          setExecutionLogs((prev) => [
            ...prev,
            `[${new Date().toISOString()}] Task ${task.name} 실행 중...`,
          ])

          // 시뮬레이션 실행
          await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1500))

          const currentTaskStates = task.upstreamIds.map((id) => {
            const t = currentDAG.dag.tasks.find((x) => x.id === id)
            return tasks.find((x) => x.id === id)?.state || 'none'
          })

          const result = simulateTaskExecution(task, currentTaskStates as TaskState[])

          // 결과 적용
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId
                ? { ...t, state: result.newState, logs: result.logs }
                : t
            )
          )

          setExecutionLogs((prev) => [
            ...prev,
            ...result.logs.map((log) => `[${task.name}] ${log}`),
          ])

          executed.add(taskId)

          // 하위 태스크를 큐에 추가
          task.downstreamIds.forEach((downId) => {
            if (!queue.includes(downId) && !executed.has(downId)) {
              queue.push(downId)
            }
          })
        })
      )

      // 다음 실행 전 약간의 딜레이
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    setExecutionLogs((prev) => [
      ...prev,
      `[${new Date().toISOString()}] DAG 실행 완료`,
    ])
    setIsRunning(false)
    runningRef.current = false
  }, [currentDAG, isRunning, tasks])

  // DAG 중지
  const stopDAG = useCallback(() => {
    runningRef.current = false
    setIsRunning(false)
    setExecutionLogs((prev) => [...prev, `[${new Date().toISOString()}] DAG 실행 중지됨`])
  }, [])

  // DAG 리셋
  const resetDAG = useCallback(() => {
    runningRef.current = false
    setIsRunning(false)
    setTasks(currentDAG.dag.tasks.map((t) => ({ ...t, state: 'none' as TaskState })))
    setExecutionLogs([])
    setSelectedTask(null)
  }, [currentDAG])

  return (
    <div className="h-full flex flex-col">
      {/* 툴바 */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* DAG 선택 */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">DAG:</label>
            <select
              value={selectedDAGId}
              onChange={(e) => setSelectedDAGId(e.target.value)}
              disabled={isRunning}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            >
              {Object.entries(dagCategories).map(([category, label]) => {
                const dags = sampleDAGs.filter((d) => d.category === category)
                if (dags.length === 0) return null
                return (
                  <optgroup key={category} label={label}>
                    {dags.map((dag) => (
                      <option key={dag.id} value={dag.id}>
                        {dag.name}
                      </option>
                    ))}
                  </optgroup>
                )
              })}
            </select>
          </div>

          {/* DAG 정보 */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              <span className="font-medium">{tasks.length}</span> Tasks
            </span>
            <span>
              Schedule: <span className="font-medium">{schedulePresets[currentDAG.dag.schedule as keyof typeof schedulePresets] || currentDAG.dag.schedule}</span>
            </span>
          </div>

          {/* 실행 버튼 */}
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={runDAG}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                실행
              </button>
            ) : (
              <button
                onClick={stopDAG}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                중지
              </button>
            )}
            <button
              onClick={resetDAG}
              disabled={isRunning}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              리셋
            </button>
          </div>

          {/* 탭 버튼 */}
          <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-1">
            {(['graph', 'code', 'logs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white shadow text-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'graph' && 'DAG'}
                {tab === 'code' && 'Code'}
                {tab === 'logs' && 'Logs'}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600">{currentDAG.description}</p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측: DAG 그래프 / 코드 / 로그 */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'graph' && (
            <DAGGraph
              tasks={tasks}
              selectedTask={selectedTask}
              onSelectTask={setSelectedTask}
            />
          )}
          {activeTab === 'code' && showCode && (
            <CodeView code={currentDAG.pythonCode} />
          )}
          {activeTab === 'logs' && showLogs && (
            <LogsView logs={executionLogs} />
          )}
        </div>

        {/* 우측: Task 상세 */}
        {selectedTask && (
          <div className="w-80 border-l border-gray-200 bg-white p-4 overflow-auto">
            <TaskDetail
              task={tasks.find((t) => t.id === selectedTask.id) || selectedTask}
              onClose={() => setSelectedTask(null)}
            />
          </div>
        )}
      </div>

      {/* 상태 범례 */}
      <div className="bg-gray-50 border-t border-gray-200 p-3">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          {Object.entries(taskStateColors).slice(0, 6).map(([state, colors]) => (
            <div key={state} className="flex items-center gap-1">
              <div className={`w-4 h-4 rounded ${colors.bg}`}></div>
              <span className="text-gray-600">{colors.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// DAG 그래프 컴포넌트
function DAGGraph({
  tasks,
  selectedTask,
  onSelectTask,
}: {
  tasks: Task[]
  selectedTask: Task | null
  onSelectTask: (task: Task | null) => void
}) {
  // 태스크를 레벨별로 그룹화 (토폴로지 정렬)
  const levels = useMemo(() => {
    const taskMap = new Map(tasks.map((t) => [t.id, t]))
    const levels: Task[][] = []
    const assigned = new Set<string>()

    // 레벨 0: 상위 태스크가 없는 것들
    const level0 = tasks.filter((t) => t.upstreamIds.length === 0)
    if (level0.length > 0) {
      levels.push(level0)
      level0.forEach((t) => assigned.add(t.id))
    }

    // 나머지 레벨
    while (assigned.size < tasks.length) {
      const nextLevel: Task[] = []
      tasks.forEach((task) => {
        if (assigned.has(task.id)) return
        const allUpstreamAssigned = task.upstreamIds.every((id) => assigned.has(id))
        if (allUpstreamAssigned) {
          nextLevel.push(task)
        }
      })
      if (nextLevel.length === 0) break
      levels.push(nextLevel)
      nextLevel.forEach((t) => assigned.add(t.id))
    }

    return levels
  }, [tasks])

  // 태스크 위치 계산
  const taskPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {}
    const levelWidth = 200
    const taskHeight = 60
    const taskGap = 20

    levels.forEach((level, levelIndex) => {
      const totalHeight = level.length * taskHeight + (level.length - 1) * taskGap
      const startY = (400 - totalHeight) / 2

      level.forEach((task, taskIndex) => {
        positions[task.id] = {
          x: 50 + levelIndex * levelWidth,
          y: startY + taskIndex * (taskHeight + taskGap),
        }
      })
    })

    return positions
  }, [levels])

  return (
    <div className="relative" style={{ minHeight: '400px', minWidth: levels.length * 200 + 100 }}>
      {/* 연결선 */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
        {tasks.map((task) =>
          task.downstreamIds.map((downId) => {
            const from = taskPositions[task.id]
            const to = taskPositions[downId]
            if (!from || !to) return null

            const fromX = from.x + 150
            const fromY = from.y + 25
            const toX = to.x
            const toY = to.y + 25

            return (
              <g key={`${task.id}-${downId}`}>
                <path
                  d={`M ${fromX} ${fromY} C ${fromX + 50} ${fromY}, ${toX - 50} ${toY}, ${toX} ${toY}`}
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            )
          })
        )}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
          </marker>
        </defs>
      </svg>

      {/* 태스크 노드 */}
      {tasks.map((task) => {
        const pos = taskPositions[task.id]
        if (!pos) return null

        const stateColors = taskStateColors[task.state]
        const operatorInfo = operatorDescriptions[task.operator]

        return (
          <button
            key={task.id}
            onClick={() => onSelectTask(selectedTask?.id === task.id ? null : task)}
            className={`
              absolute w-[150px] p-3 rounded-lg border-2 text-left transition-all
              ${stateColors.bg} ${stateColors.text}
              ${selectedTask?.id === task.id ? 'ring-2 ring-teal-400 shadow-lg' : 'hover:shadow-md'}
              ${task.state === 'running' ? 'animate-pulse' : ''}
            `}
            style={{ left: pos.x, top: pos.y }}
          >
            <div className="flex items-center gap-1 mb-1">
              <span className={`px-1.5 py-0.5 text-[10px] rounded ${operatorInfo.color} text-white`}>
                {operatorInfo.name}
              </span>
            </div>
            <div className="text-sm font-medium truncate">{task.name}</div>
          </button>
        )
      })}
    </div>
  )
}

// Task 상세 패널
function TaskDetail({ task, onClose }: { task: Task; onClose: () => void }) {
  const stateColors = taskStateColors[task.state]
  const operatorInfo = operatorDescriptions[task.operator]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Task Details</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-500">Name</div>
          <div className="text-gray-900">{task.name}</div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-500">Operator</div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded ${operatorInfo.color} text-white`}>
              {operatorInfo.name}
            </span>
            <span className="text-sm text-gray-600">{operatorInfo.description}</span>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-500">State</div>
          <span className={`inline-block px-2 py-1 rounded text-sm ${stateColors.bg} ${stateColors.text}`}>
            {stateColors.label}
          </span>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-500">Trigger Rule</div>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{task.triggerRule}</code>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-500">Retries</div>
            <div className="text-gray-900">{task.retries}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Retry Delay</div>
            <div className="text-gray-900">{task.retryDelay}s</div>
          </div>
        </div>

        {task.upstreamIds.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-500">Upstream Tasks</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {task.upstreamIds.map((id) => (
                <span key={id} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}

        {task.downstreamIds.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-500">Downstream Tasks</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {task.downstreamIds.map((id) => (
                <span key={id} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}

        {task.code && (
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Code</div>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-auto">
              {task.code}
            </pre>
          </div>
        )}

        {task.logs && task.logs.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Logs</div>
            <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono max-h-40 overflow-auto">
              {task.logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 코드 뷰
function CodeView({ code }: { code: string }) {
  return (
    <div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-auto">
        {code.split('\n').map((line, i) => (
          <div key={i} className="flex">
            <span className="w-8 text-gray-500 select-none text-right pr-4">{i + 1}</span>
            <span className={
              line.trim().startsWith('#') ? 'text-green-400' :
              line.includes('from ') || line.includes('import ') ? 'text-purple-400' :
              line.includes('def ') ? 'text-yellow-400' :
              line.includes('with DAG') ? 'text-cyan-400' :
              line.includes('Operator') ? 'text-blue-400' :
              line.includes('>>') ? 'text-orange-400' :
              ''
            }>
              {line}
            </span>
          </div>
        ))}
      </pre>
    </div>
  )
}

// 로그 뷰
function LogsView({ logs }: { logs: string[] }) {
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        DAG를 실행하면 로그가 여기에 표시됩니다.
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm max-h-[500px] overflow-auto">
      {logs.map((log, i) => (
        <div
          key={i}
          className={
            log.includes('ERROR') ? 'text-red-400' :
            log.includes('완료') || log.includes('success') ? 'text-green-400' :
            log.includes('실행 중') || log.includes('started') ? 'text-blue-400' :
            ''
          }
        >
          {log}
        </div>
      ))}
      <div ref={logsEndRef} />
    </div>
  )
}

export default AirflowDAG
