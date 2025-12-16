// 학습 진행 상태 관리 (localStorage 기반)

const STORAGE_KEY = 'fde-progress'

export interface Progress {
  completedTasks: string[]  // 완료된 task id 목록
  lastAccessed?: string     // 마지막 접근 task id
  updatedAt?: string        // 마지막 업데이트 시간
}

// 진행 상태 가져오기
export function getProgress(): Progress {
  if (typeof window === 'undefined') {
    return { completedTasks: [] }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load progress:', e)
  }

  return { completedTasks: [] }
}

// 진행 상태 저장
function saveProgress(progress: Progress): void {
  if (typeof window === 'undefined') return

  try {
    progress.updatedAt = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (e) {
    console.error('Failed to save progress:', e)
  }
}

// 태스크 완료 표시
export function markTaskComplete(taskId: string): void {
  const progress = getProgress()
  if (!progress.completedTasks.includes(taskId)) {
    progress.completedTasks.push(taskId)
    saveProgress(progress)
  }
}

// 태스크 완료 취소
export function markTaskIncomplete(taskId: string): void {
  const progress = getProgress()
  progress.completedTasks = progress.completedTasks.filter(id => id !== taskId)
  saveProgress(progress)
}

// 태스크 완료 토글
export function toggleTaskComplete(taskId: string): boolean {
  const progress = getProgress()
  const isCompleted = progress.completedTasks.includes(taskId)

  if (isCompleted) {
    markTaskIncomplete(taskId)
    return false
  } else {
    markTaskComplete(taskId)
    return true
  }
}

// 태스크 완료 여부 확인
export function isTaskComplete(taskId: string): boolean {
  const progress = getProgress()
  return progress.completedTasks.includes(taskId)
}

// 마지막 접근 태스크 업데이트
export function updateLastAccessed(taskId: string): void {
  const progress = getProgress()
  progress.lastAccessed = taskId
  saveProgress(progress)
}

// 완료된 태스크 수
export function getCompletedCount(): number {
  return getProgress().completedTasks.length
}

// 진행률 계산 (특정 Week 기준)
export function getWeekProgress(taskIds: string[]): { completed: number; total: number; percent: number } {
  const progress = getProgress()
  const completed = taskIds.filter(id => progress.completedTasks.includes(id)).length
  const total = taskIds.length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return { completed, total, percent }
}

// 진행 상태 초기화
export function resetProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
