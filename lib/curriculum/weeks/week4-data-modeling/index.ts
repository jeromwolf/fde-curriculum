// Week 4: 데이터 모델링 (Phase 1, Week 4)
import type { Week } from '../../types'
import { day1Tasks } from './day1-normalization'
import { day2Tasks } from './day2-dimensional-modeling'
import { day3Tasks } from './day3-scd'
import { day4Tasks } from './day4-erd-patterns'
import { day5Tasks } from './day5-weekly-project'

export const dataModelingWeek: Week = {
  slug: 'data-modeling',
  week: 4,
  phase: 1,
  month: 1,
  access: 'core',
  title: '데이터 모델링',
  topics: ['정규화', 'Star/Snowflake 스키마', 'SCD', 'ERD 설계'],
  practice: '이커머스 데이터 웨어하우스 설계 프로젝트',
  totalDuration: 720,
  days: [
    {
      slug: 'normalization',
      title: '정규화 원칙',
      totalDuration: 135,
      tasks: day1Tasks
    },
    {
      slug: 'dimensional-modeling',
      title: 'Star & Snowflake 스키마',
      totalDuration: 140,
      tasks: day2Tasks
    },
    {
      slug: 'scd',
      title: 'SCD (Slowly Changing Dimension)',
      totalDuration: 115,
      tasks: day3Tasks
    },
    {
      slug: 'erd-patterns',
      title: 'ERD 설계 & 실무 패턴',
      totalDuration: 135,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: 이커머스 DW 설계',
      totalDuration: 160,
      tasks: day5Tasks
    }
  ]
}
