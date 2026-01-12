// Week 13: 가설 기반 분석 & 분류/회귀 (Phase 2, Week 5)
import type { Week } from '../../types'
import { day1Tasks } from './day1-hypothesis-driven'
import { day2Tasks } from './day2-classification'
import { day3Tasks } from './day3-regression'
import { day4Tasks } from './day4-tuning'
import { day5Tasks } from './day5-weekly-project'

export const supervisedLearningWeek: Week = {
  slug: 'supervised-learning',
  week: 13,
  phase: 2,
  month: 4,
  access: 'core',
  title: '가설 기반 분석 & 분류/회귀',
  topics: ['가설 기반 분석', '상관관계 vs 인과관계', 'XGBoost', 'LightGBM', 'Optuna'],
  practice: '고객 이탈 예측 모델',
  totalDuration: 545,
  days: [
    {
      slug: 'hypothesis-driven',
      title: '가설 기반 분석',
      totalDuration: 95,
      tasks: day1Tasks
    },
    {
      slug: 'classification',
      title: '분류 알고리즘',
      totalDuration: 100,
      tasks: day2Tasks
    },
    {
      slug: 'regression',
      title: '회귀 알고리즘',
      totalDuration: 80,
      tasks: day3Tasks
    },
    {
      slug: 'tuning',
      title: '하이퍼파라미터 튜닝',
      totalDuration: 75,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: 이탈 예측',
      totalDuration: 125,
      tasks: day5Tasks
    }
  ]
}
