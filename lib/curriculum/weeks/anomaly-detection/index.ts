// Phase 2 Week 7: 이상 탐지 (Phase 2, Week 7)
import type { Week } from '../../types'
import { day1Tasks } from './day1-statistical-methods'
import { day2Tasks } from './day2-density-based'
import { day3Tasks } from './day3-isolation-forest'
import { day4Tasks } from './day4-autoencoder'
import { day5Tasks } from './day5-weekly-project'

export const anomalyDetectionWeek: Week = {
  slug: 'anomaly-detection',
  week: 7,
  phase: 2,
  month: 2,
  access: 'core',
  title: '이상 탐지',
  topics: ['Z-score', 'IQR', 'LOF', 'Isolation Forest', 'Autoencoder'],
  practice: '금융 사기 탐지',
  totalDuration: 530,
  days: [
    {
      slug: 'statistical-methods',
      title: '통계적 이상탐지',
      totalDuration: 95,
      tasks: day1Tasks
    },
    {
      slug: 'density-based',
      title: 'LOF & DBSCAN',
      totalDuration: 95,
      tasks: day2Tasks
    },
    {
      slug: 'isolation-forest',
      title: 'Isolation Forest',
      totalDuration: 100,
      tasks: day3Tasks
    },
    {
      slug: 'autoencoder',
      title: 'Autoencoder',
      totalDuration: 105,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: 사기 탐지',
      totalDuration: 125,
      tasks: day5Tasks
    }
  ]
}
