'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface ProgressState {
  completedTasks: Set<string>
  loading: boolean
}

const STORAGE_KEY = 'fde-progress'

// localStorage에서 진행 상태 로드
function loadLocalProgress(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return data.completedTasks || []
    }
  } catch (e) {
    console.error('Failed to load local progress:', e)
  }
  return []
}

// localStorage에 진행 상태 저장
function saveLocalProgress(completedTasks: string[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completedTasks,
      updatedAt: new Date().toISOString()
    }))
  } catch (e) {
    console.error('Failed to save local progress:', e)
  }
}

export function useProgress(weekSlug?: string) {
  const { data: session, status } = useSession()
  const [state, setState] = useState<ProgressState>({
    completedTasks: new Set(),
    loading: true
  })

  // 진행 상태 로드
  const loadProgress = useCallback(async () => {
    if (status === 'loading') return

    if (session?.user) {
      // 로그인 상태: DB에서 로드
      try {
        const params = new URLSearchParams()
        if (weekSlug) params.set('weekSlug', weekSlug)

        const res = await fetch(`/api/progress?${params}`)
        if (res.ok) {
          const data = await res.json()
          const taskIds = data.progress
            .filter((p: { completed: boolean }) => p.completed)
            .map((p: { taskId: string }) => p.taskId)
          setState({ completedTasks: new Set(taskIds), loading: false })
        }
      } catch (e) {
        console.error('Failed to load progress from DB:', e)
        setState({ completedTasks: new Set(), loading: false })
      }
    } else {
      // 비로그인: localStorage에서 로드
      const localTasks = loadLocalProgress()
      setState({ completedTasks: new Set(localTasks), loading: false })
    }
  }, [session, status, weekSlug])

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  // 태스크 완료 상태 확인
  const isTaskComplete = useCallback((taskId: string): boolean => {
    return state.completedTasks.has(taskId)
  }, [state.completedTasks])

  // 태스크 완료 토글
  const toggleTaskComplete = useCallback(async (taskId: string, weekSlug: string): Promise<boolean> => {
    const currentlyCompleted = state.completedTasks.has(taskId)
    const newCompleted = !currentlyCompleted

    // Optimistic update
    setState(prev => {
      const newSet = new Set(prev.completedTasks)
      if (newCompleted) {
        newSet.add(taskId)
      } else {
        newSet.delete(taskId)
      }
      return { ...prev, completedTasks: newSet }
    })

    if (session?.user) {
      // 로그인 상태: DB에 저장
      try {
        const res = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId, weekSlug, completed: newCompleted })
        })
        if (!res.ok) throw new Error('Failed to save progress')
      } catch (e) {
        console.error('Failed to save progress to DB:', e)
        // Rollback on error
        setState(prev => {
          const newSet = new Set(prev.completedTasks)
          if (currentlyCompleted) {
            newSet.add(taskId)
          } else {
            newSet.delete(taskId)
          }
          return { ...prev, completedTasks: newSet }
        })
        return currentlyCompleted
      }
    } else {
      // 비로그인: localStorage에 저장
      const allTasks = Array.from(state.completedTasks)
      if (newCompleted) {
        allTasks.push(taskId)
      } else {
        const idx = allTasks.indexOf(taskId)
        if (idx > -1) allTasks.splice(idx, 1)
      }
      saveLocalProgress(allTasks)
    }

    return newCompleted
  }, [session, state.completedTasks])

  // Week 진행률 계산
  const getWeekProgress = useCallback((taskIds: string[]): { completed: number; total: number; percent: number } => {
    const completed = taskIds.filter(id => state.completedTasks.has(id)).length
    const total = taskIds.length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, percent }
  }, [state.completedTasks])

  return {
    isTaskComplete,
    toggleTaskComplete,
    getWeekProgress,
    loading: state.loading,
    isLoggedIn: !!session?.user
  }
}
