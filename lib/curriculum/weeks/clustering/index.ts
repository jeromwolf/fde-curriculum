// Phase 2 Week 6: 클러스터링 & 세그멘테이션 (Phase 2, Week 6)
import type { Week } from '../../types'
import { day1Tasks } from './day1-kmeans'
import { day2Tasks } from './day2-hierarchical-dbscan'
import { day3Tasks } from './day3-rfm'
import { day4Tasks } from './day4-cluster-profiling'
import { day5Tasks } from './day5-weekly-project'

export const clusteringWeek: Week = {
  slug: 'clustering',
  week: 6,
  phase: 2,
  month: 2,
  access: 'core',
  title: '클러스터링 & 세그멘테이션',
  topics: ['K-means', 'DBSCAN', '계층적 클러스터링', 'RFM 분석', 'Silhouette Score'],
  practice: '고객 세그멘테이션',
  totalDuration: 530,
  days: [
    {
      slug: 'kmeans',
      title: 'K-means 클러스터링',
      totalDuration: 105,
      tasks: day1Tasks
    },
    {
      slug: 'hierarchical-dbscan',
      title: '계층적 클러스터링 & DBSCAN',
      totalDuration: 105,
      tasks: day2Tasks
    },
    {
      slug: 'rfm',
      title: 'RFM 분석',
      totalDuration: 80,
      tasks: day3Tasks
    },
    {
      slug: 'cluster-profiling',
      title: '클러스터 프로파일링 & 시각화',
      totalDuration: 100,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: 고객 세그멘테이션',
      totalDuration: 125,
      tasks: day5Tasks
    }
  ]
}
