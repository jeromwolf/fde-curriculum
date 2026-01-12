// Week 6: Spark 심화 & Delta Lake (Phase 1, Week 6)
import type { Week } from '../../types'
import { day1Tasks } from './day1-structured-streaming'
import { day2Tasks } from './day2-delta-lake'
import { day3Tasks } from './day3-performance-tuning'
import { day4Tasks } from './day4-spark-ui'
import { day5Tasks } from './day5-weekly-project'

export const sparkAdvancedWeek: Week = {
  slug: 'spark-advanced',
  week: 6,
  phase: 1,
  month: 2,
  access: 'core',
  title: 'Spark 심화 & Delta Lake',
  topics: ['Structured Streaming', 'Delta Lake', '성능 튜닝', 'Spark UI'],
  practice: '실시간 주문 처리 파이프라인 구축',
  totalDuration: 720,
  days: [
    {
      slug: 'structured-streaming',
      title: 'Structured Streaming',
      totalDuration: 145,
      tasks: day1Tasks
    },
    {
      slug: 'delta-lake',
      title: 'Delta Lake 기초',
      totalDuration: 155,
      tasks: day2Tasks
    },
    {
      slug: 'performance-tuning',
      title: 'Spark 성능 튜닝',
      totalDuration: 120,
      tasks: day3Tasks
    },
    {
      slug: 'spark-ui',
      title: 'Spark UI & 모니터링',
      totalDuration: 105,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: 실시간 주문 파이프라인',
      totalDuration: 160,
      tasks: day5Tasks
    }
  ]
}
