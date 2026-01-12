// Week 5: Apache Spark (Phase 1, Week 5)
import type { Week } from '../../types'
import { day1Tasks } from './day1-architecture'
import { day2Tasks } from './day2-dataframe-api'
import { day3Tasks } from './day3-catalyst'
import { day4Tasks } from './day4-udf'
import { day5Tasks } from './day5-weekly-project'

export const sparkWeek: Week = {
  slug: 'spark',
  week: 5,
  phase: 1,
  month: 2,
  access: 'core',
  title: 'Apache Spark',
  topics: ['Spark 아키텍처', 'DataFrame API', 'Catalyst Optimizer', 'UDF & Pandas UDF'],
  practice: '대용량 로그 분석 파이프라인 구축',
  totalDuration: 720,
  days: [
    {
      slug: 'architecture',
      title: 'Spark 아키텍처 기초',
      totalDuration: 145,
      tasks: day1Tasks
    },
    {
      slug: 'dataframe-api',
      title: 'DataFrame API 마스터',
      totalDuration: 150,
      tasks: day2Tasks
    },
    {
      slug: 'catalyst',
      title: 'Catalyst 최적화 & 실행계획',
      totalDuration: 130,
      tasks: day3Tasks
    },
    {
      slug: 'udf',
      title: 'UDF & Pandas UDF',
      totalDuration: 135,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: 대용량 로그 분석',
      totalDuration: 160,
      tasks: day5Tasks
    }
  ]
}
