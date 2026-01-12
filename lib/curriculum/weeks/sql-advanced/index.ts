// Phase 1 Week 3: SQL 심화 (Phase 1, Week 3)
import type { Week } from '../../types'
import { day1Tasks } from './day1-window-basics'
import { day2Tasks } from './day2-window-advanced'
import { day3Tasks } from './day3-cte-recursive'
import { day4Tasks } from './day4-execution-plan'
import { day5Tasks } from './day5-weekly-project'

export const sqlAdvancedWeek: Week = {
  slug: 'sql-advanced',
  week: 3,
  phase: 1,
  month: 1,
  access: 'core',
  title: 'SQL 심화',
  topics: ['윈도우 함수', 'CTE & 재귀 쿼리', '실행 계획 분석', '쿼리 튜닝'],
  practice: 'SQL 분석 쿼리 20개 작성',
  totalDuration: 750,
  days: [
    {
      slug: 'window-basics',
      title: '윈도우 함수 기초',
      totalDuration: 150,
      tasks: day1Tasks
    },
    {
      slug: 'window-advanced',
      title: '윈도우 함수 심화',
      totalDuration: 150,
      tasks: day2Tasks
    },
    {
      slug: 'cte-recursive',
      title: 'CTE & 재귀 쿼리',
      totalDuration: 150,
      tasks: day3Tasks
    },
    {
      slug: 'execution-plan',
      title: '실행 계획 분석 & 쿼리 튜닝',
      totalDuration: 150,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: SQL 분석 쿼리 20개',
      totalDuration: 150,
      tasks: day5Tasks
    }
  ]
}
