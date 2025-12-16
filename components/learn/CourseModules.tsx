'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Module, formatDuration } from '@/lib/curriculum'
import { getTaskIcon, taskTypeLabels, TrophyIcon, CheckIcon } from './Icons'
import { getPhaseColors } from './constants'

interface CourseModulesProps {
  modules: Module[]
  phase: number
  isTaskComplete: (taskId: string) => boolean
  getModuleProgress: (taskIds: string[]) => { completed: number; total: number; percent: number }
}

export function CourseModules({
  modules,
  phase,
  isTaskComplete,
  getModuleProgress
}: CourseModulesProps) {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]))
  const colors = getPhaseColors(phase)

  const toggleModule = (index: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // 안전 체크
  if (!modules || modules.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">교육 과정</h2>
        <p className="text-gray-500">모듈을 불러오는 중...</p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-6">교육 과정</h2>
      <div className="space-y-4">
        {modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(moduleIndex)
          const moduleTaskIds = [...module.tasks.map(t => t.id), ...(module.challenge ? [module.challenge.id] : [])]
          const { completed: moduleCompleted, total: moduleTotal } = getModuleProgress(moduleTaskIds)
          const isComplete = moduleCompleted === moduleTotal

          return (
            <div
              key={module.slug}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(moduleIndex)}
                className="w-full flex items-center gap-4 p-5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: isComplete ? '#10B981' : colors.primary }}
                >
                  {isComplete ? '✓' : String(moduleIndex + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {module.tasks.length + (module.challenge ? 1 : 0)} Lessons · {formatDuration(module.totalDuration)}
                    {isComplete && <span className="ml-2 text-green-600">완료</span>}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Module Lessons */}
              {isExpanded && (
                <div className="border-t border-gray-200">
                  {module.tasks.map((task) => {
                    const taskComplete = isTaskComplete(task.id)
                    return (
                      <Link
                        key={task.id}
                        href={`/learn/task/${task.id}`}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          taskComplete
                            ? 'bg-green-500 text-white'
                            : 'border-2 border-gray-300'
                        }`}>
                          {taskComplete && <CheckIcon />}
                        </span>
                        <span className={`flex-shrink-0 ${taskComplete ? 'text-gray-400' : 'text-gray-500'}`}>
                          {getTaskIcon(task.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            taskComplete ? 'text-gray-400' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {taskTypeLabels[task.type]} · {task.duration}분
                          </p>
                        </div>
                      </Link>
                    )
                  })}

                  {/* Challenge */}
                  {module.challenge && (
                    <Link
                      href={`/learn/task/${module.challenge.id}`}
                      className="flex items-center gap-4 p-4 bg-amber-50 hover:bg-amber-100 transition-colors"
                    >
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isTaskComplete(module.challenge.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {isTaskComplete(module.challenge.id) ? (
                          <CheckIcon />
                        ) : (
                          <TrophyIcon />
                        )}
                      </span>
                      <span className="text-amber-600">
                        <TrophyIcon />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-amber-900 truncate">
                          Challenge: {module.challenge.title}
                        </p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          {module.challenge.duration}분 · {module.challenge.description}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
