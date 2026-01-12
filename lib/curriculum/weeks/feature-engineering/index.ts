// Phase 2 Week 3: Feature Engineering (Phase 2, Week 3)
import type { Week } from '../../types'
import { day1Tasks } from './day1-numerical-features'
import { day2Tasks } from './day2-categorical-features'
import { day3Tasks } from './day3-temporal-features'
import { day4Tasks } from './day4-feature-importance'
import { day5Tasks } from './day5-weekly-project'

export const featureEngineeringWeek: Week = {
  slug: 'feature-engineering',
  week: 3,
  phase: 2,
  month: 1,
  access: 'core',
  title: 'Feature Engineering',
  topics: ['수치형 피처 생성', '범주형 피처 처리', '시간/텍스트 피처', 'Groupby 집계', '피처 중요도'],
  practice: 'Kaggle 스타일 FE 프로젝트 (50개+ 피처)',
  totalDuration: 580,
  days: [
    {
      slug: 'numerical-features',
      title: '수치형 피처 엔지니어링',
      totalDuration: 105,
      tasks: day1Tasks
    },
    {
      slug: 'categorical-features',
      title: '범주형 피처 엔지니어링',
      totalDuration: 80,
      tasks: day2Tasks
    },
    {
      slug: 'temporal-features',
      title: '시간 & 텍스트 피처',
      totalDuration: 95,
      tasks: day3Tasks
    },
    {
      slug: 'feature-importance',
      title: '피처 중요도 분석',
      totalDuration: 80,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: FE 프로젝트',
      totalDuration: 125,
      tasks: day5Tasks
    }
  ]
}
