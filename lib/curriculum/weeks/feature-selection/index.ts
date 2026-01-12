// Phase 2 Week 4: Feature Selection & 차원 축소 (Phase 2, Week 4)
import type { Week } from '../../types'
import { day1Tasks } from './day1-filter-methods'
import { day2Tasks } from './day2-wrapper-embedded'
import { day3Tasks } from './day3-dimensionality-reduction'
import { day4Tasks } from './day4-practical-tips'
import { day5Tasks } from './day5-weekly-project'

export const featureSelectionWeek: Week = {
  slug: 'feature-selection',
  week: 4,
  phase: 2,
  month: 1,
  access: 'core',
  title: 'Feature Selection & 차원 축소',
  topics: ['Filter Methods', 'Wrapper Methods', 'Embedded Methods', 'PCA', 't-SNE', 'UMAP'],
  practice: '고차원 데이터 피처 선택 프로젝트',
  totalDuration: 555,
  days: [
    {
      slug: 'filter-methods',
      title: 'Filter Methods',
      totalDuration: 75,
      tasks: day1Tasks
    },
    {
      slug: 'wrapper-embedded',
      title: 'Wrapper & Embedded Methods',
      totalDuration: 95,
      tasks: day2Tasks
    },
    {
      slug: 'dimensionality-reduction',
      title: '차원 축소 (PCA, t-SNE, UMAP)',
      totalDuration: 105,
      tasks: day3Tasks
    },
    {
      slug: 'practical-tips',
      title: '실무 전략',
      totalDuration: 80,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: 피처 선택',
      totalDuration: 125,
      tasks: day5Tasks
    }
  ]
}
