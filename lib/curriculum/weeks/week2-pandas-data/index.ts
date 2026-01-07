// Week 2: pandas & 데이터 처리 (Phase 1, Week 2)
import type { Week } from '../../types'
import { day1Tasks } from './day1-large-data'
import { day2Tasks } from './day2-advanced-operations'
import { day3Tasks } from './day3-performance'
import { day4Tasks } from './day4-polars'
import { day5Tasks } from './day5-weekly-project'

export const pandasDataWeek: Week = {
  slug: 'pandas-data',
  week: 2,
  phase: 1,
  month: 1,
  access: 'core',
  title: 'pandas & 데이터 처리',
  topics: ['대용량 데이터 처리', 'MultiIndex & Pivot', '성능 최적화', 'Polars'],
  practice: 'NYC Taxi 1GB+ 데이터 분석 파이프라인',
  totalDuration: 750,
  days: [
    {
      slug: 'large-data',
      title: '대용량 데이터 처리',
      totalDuration: 150,
      tasks: day1Tasks
    },
    {
      slug: 'advanced-operations',
      title: '고급 pandas 연산',
      totalDuration: 150,
      tasks: day2Tasks
    },
    {
      slug: 'performance',
      title: '성능 최적화',
      totalDuration: 150,
      tasks: day3Tasks
    },
    {
      slug: 'polars',
      title: 'Polars 소개',
      totalDuration: 120,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: NYC Taxi 분석',
      totalDuration: 180,
      tasks: day5Tasks
    }
  ]
}
