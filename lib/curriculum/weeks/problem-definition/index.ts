// Phase 2 Week 1: 비즈니스 문제 정의 & EDA 기초
import type { Week } from '../../types'
import { day1Tasks } from './day1-problem-framing'
import { day2Tasks } from './day2-statistics-basics'
import { day3Tasks } from './day3-visualization'
import { day4Tasks } from './day4-missing-outliers'
import { day5Tasks } from './day5-weekly-project'

export const problemDefinitionWeek: Week = {
  slug: 'problem-definition',
  week: 1,
  phase: 2,
  month: 1,
  access: 'core',
  title: '비즈니스 문제 정의 & EDA 기초',
  topics: ['5 Whys & MECE', '기술 통계', '시각화 (Matplotlib/Seaborn/Plotly)', '결측치 & 이상치 처리'],
  practice: 'EDA 리포트 작성 프로젝트',
  totalDuration: 650,
  days: [
    {
      slug: 'problem-framing',
      title: '비즈니스 문제 정의',
      totalDuration: 115,
      tasks: day1Tasks
    },
    {
      slug: 'statistics-basics',
      title: '기술 통계 기초',
      totalDuration: 130,
      tasks: day2Tasks
    },
    {
      slug: 'visualization',
      title: '데이터 시각화',
      totalDuration: 130,
      tasks: day3Tasks
    },
    {
      slug: 'missing-outliers',
      title: '결측치 & 이상치 처리',
      totalDuration: 145,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: EDA 리포트',
      totalDuration: 130,
      tasks: day5Tasks
    }
  ]
}
