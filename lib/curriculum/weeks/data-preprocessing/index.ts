// Phase 2 Week 2: 데이터 이해 & 전처리 (Phase 2, Week 2)
import type { Week } from '../../types'
import { day1Tasks } from './day1-data-sources'
import { day2Tasks } from './day2-missing-values'
import { day3Tasks } from './day3-outliers'
import { day4Tasks } from './day4-transformation'
import { day5Tasks } from './day5-weekly-project'

export const dataPreprocessingWeek: Week = {
  slug: 'data-preprocessing',
  week: 2,
  phase: 2,
  month: 1,
  access: 'core',
  title: '데이터 이해 & 전처리',
  topics: ['데이터 소스 매핑', '데이터 품질 6차원', '결측치 처리', '이상치 처리', 'sklearn Pipeline'],
  practice: '데이터 정제 파이프라인 프로젝트',
  totalDuration: 700,
  days: [
    {
      slug: 'data-sources',
      title: '데이터 소스 & 품질',
      totalDuration: 100,
      tasks: day1Tasks
    },
    {
      slug: 'missing-values',
      title: '결측치 처리',
      totalDuration: 100,
      tasks: day2Tasks
    },
    {
      slug: 'outliers',
      title: '이상치 탐지 & 처리',
      totalDuration: 100,
      tasks: day3Tasks
    },
    {
      slug: 'transformation',
      title: '변환 & 인코딩',
      totalDuration: 105,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: 데이터 정제 파이프라인',
      totalDuration: 125,
      tasks: day5Tasks
    }
  ]
}
