// 커리큘럼 메인 진입점
// 모든 Week 데이터와 유틸리티 함수 export

export * from './types'
export * from './packages'

// Week 데이터 import
import { pythonAdvancedWeek } from './weeks/python-advanced'
import { graphIntroWeek } from './weeks/graph-intro'
// 추후 추가:
// import { pandasDataWeek } from './weeks/pandas-data'
// import { sqlDeepWeek } from './weeks/sql-deep'

import type { Week, Task, Day, Module, Course, TaskContent, QuizQuestion } from './types'

// 전체 커리큘럼 (Week 배열)
export const curriculum: Week[] = [
  pythonAdvancedWeek,
  graphIntroWeek,
  // 추후 추가...
]

// Week slug로 찾기
export function getWeekBySlug(slug: string): Week | undefined {
  return curriculum.find(w => w.slug === slug)
}

// Task ID로 찾기 (Week, Day 정보 포함)
export function getTaskById(taskId: string): {
  task: Task
  week: Week
  day: Day
  dayIndex: number
  taskIndex: number
} | undefined {
  for (const week of curriculum) {
    for (let dayIndex = 0; dayIndex < week.days.length; dayIndex++) {
      const day = week.days[dayIndex]

      // 일반 태스크에서 찾기
      const taskIndex = day.tasks.findIndex(t => t.id === taskId)
      if (taskIndex !== -1) {
        return { task: day.tasks[taskIndex], week, day, dayIndex, taskIndex }
      }

      // 챌린지에서 찾기
      if (day.challenge && day.challenge.id === taskId) {
        return { task: day.challenge, week, day, dayIndex, taskIndex: day.tasks.length }
      }
    }
  }
  return undefined
}

// 전체 태스크 목록 (순서대로)
export function getAllTasks(): Array<{ task: Task; week: Week; day: Day }> {
  const result: Array<{ task: Task; week: Week; day: Day }> = []

  for (const week of curriculum) {
    for (const day of week.days) {
      for (const task of day.tasks) {
        result.push({ task, week, day })
      }
      if (day.challenge) {
        result.push({ task: day.challenge, week, day })
      }
    }
  }

  return result
}

// Week 내 모든 태스크 목록
export function getTasksInWeek(weekSlug: string): Array<{ task: Task; day: Day; dayIndex: number }> {
  const week = getWeekBySlug(weekSlug)
  if (!week) return []

  const result: Array<{ task: Task; day: Day; dayIndex: number }> = []

  for (let dayIndex = 0; dayIndex < week.days.length; dayIndex++) {
    const day = week.days[dayIndex]
    for (const task of day.tasks) {
      result.push({ task, day, dayIndex })
    }
    if (day.challenge) {
      result.push({ task: day.challenge, day, dayIndex })
    }
  }

  return result
}

// 시간 포맷 헬퍼
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`
}

// 첫 번째 학습 콘텐츠 (무료 체험용)
export function getFirstLesson(): { weekSlug: string; taskId: string } {
  const firstWeek = curriculum[0]
  const firstTask = firstWeek.days[0].tasks[0]
  return { weekSlug: firstWeek.slug, taskId: firstTask.id }
}

// Phase의 첫 번째 Week 가져오기
export function getFirstWeekOfPhase(phase: number): Week | undefined {
  return curriculum.find(w => w.phase === phase)
}

// Phase에 Week 데이터가 있는지 확인
export function hasWeekData(phase: number): boolean {
  return curriculum.some(w => w.phase === phase)
}

// Phase의 모든 Week 목록 가져오기
export function getWeeksByPhase(phase: number): Week[] {
  return curriculum.filter(w => w.phase === phase)
}

// 다음 태스크 가져오기
export function getNextTask(currentTaskId: string): { task: Task; week: Week; day: Day } | undefined {
  const allTasks = getAllTasks()
  const currentIndex = allTasks.findIndex(t => t.task.id === currentTaskId)

  if (currentIndex === -1 || currentIndex >= allTasks.length - 1) {
    return undefined
  }

  return allTasks[currentIndex + 1]
}

// 이전 태스크 가져오기
export function getPrevTask(currentTaskId: string): { task: Task; week: Week; day: Day } | undefined {
  const allTasks = getAllTasks()
  const currentIndex = allTasks.findIndex(t => t.task.id === currentTaskId)

  if (currentIndex <= 0) {
    return undefined
  }

  return allTasks[currentIndex - 1]
}

// 태스크 인덱스 정보
export function getTaskProgress(taskId: string): { current: number; total: number } | undefined {
  const allTasks = getAllTasks()
  const currentIndex = allTasks.findIndex(t => t.task.id === taskId)

  if (currentIndex === -1) {
    return undefined
  }

  return { current: currentIndex + 1, total: allTasks.length }
}
