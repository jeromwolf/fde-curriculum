// Phase 2 Week 8: 시계열 분석 (Phase 2, Week 8)
import type { Week } from '../../types'
import { day1Tasks } from './day1-decomposition'
import { day2Tasks } from './day2-stationarity'
import { day3Tasks } from './day3-prophet'
import { day4Tasks } from './day4-ml-forecasting'
import { day5Tasks } from './day5-weekly-project'

export const timeSeriesWeek: Week = {
  slug: 'time-series',
  week: 8,
  phase: 2,
  month: 2,
  access: 'core',
  title: '시계열 분석',
  topics: ['시계열 분해', '정상성', 'Prophet', 'Lag 피처', 'TimeSeriesSplit'],
  practice: '수요 예측 모델',
  totalDuration: 555,
  days: [
    {
      slug: 'decomposition',
      title: '시계열 분해',
      totalDuration: 95,
      tasks: day1Tasks
    },
    {
      slug: 'stationarity',
      title: '정상성 & ACF/PACF',
      totalDuration: 95,
      tasks: day2Tasks
    },
    {
      slug: 'prophet',
      title: 'Prophet',
      totalDuration: 100,
      tasks: day3Tasks
    },
    {
      slug: 'ml-forecasting',
      title: 'ML 기반 시계열',
      totalDuration: 105,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: 수요 예측',
      totalDuration: 125,
      tasks: day5Tasks
    }
  ]
}
