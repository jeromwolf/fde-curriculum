// Week 7: Apache Airflow (Phase 1, Week 7)
import type { Week } from '../../types'
import { day1Tasks } from './day1-airflow-basics'
import { day2Tasks } from './day2-dag-operators'
import { day3Tasks } from './day3-scheduling'
import { day4Tasks } from './day4-error-handling'
import { day5Tasks } from './day5-weekly-project'

export const airflowWeek: Week = {
  slug: 'airflow',
  week: 7,
  phase: 1,
  month: 2,
  access: 'core',
  title: 'Apache Airflow',
  topics: ['DAG 설계', 'Operators', '스케줄링', '에러 핸들링', '모니터링'],
  practice: 'ETL 워크플로우 자동화 시스템 구축',
  totalDuration: 720,
  days: [
    {
      slug: 'airflow-basics',
      title: 'Airflow 기초 & 아키텍처',
      totalDuration: 145,
      tasks: day1Tasks
    },
    {
      slug: 'dag-operators',
      title: 'DAG 작성 & Operators',
      totalDuration: 145,
      tasks: day2Tasks
    },
    {
      slug: 'scheduling',
      title: '스케줄링 & 의존성 관리',
      totalDuration: 130,
      tasks: day3Tasks
    },
    {
      slug: 'error-handling',
      title: '에러 핸들링 & 모니터링',
      totalDuration: 105,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: ETL 워크플로우 자동화',
      totalDuration: 190,
      tasks: day5Tasks
    }
  ]
}
