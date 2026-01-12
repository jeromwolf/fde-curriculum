// Phase 1 Week 8: E2E Data Pipeline (Phase 1 Capstone Project)
import type { Week } from '../../types'
import { day1Tasks } from './day1-project-design'
import { day2Tasks } from './day2-data-ingestion'
import { day3Tasks } from './day3-transformation'
import { day4Tasks } from './day4-orchestration'
import { day5Tasks } from './day5-testing-presentation'

export const e2ePipelineWeek: Week = {
  slug: 'e2e-pipeline',
  week: 8,
  phase: 1,
  month: 2,
  access: 'core',
  title: 'E2E 데이터 파이프라인',
  topics: ['프로젝트 설계', '데이터 수집', 'Spark 변환', 'Airflow 오케스트레이션', '테스트 & 배포'],
  practice: 'Phase 1 캡스톤: SaaS 분석 플랫폼 E2E 파이프라인 구축',
  totalDuration: 720,
  days: [
    {
      slug: 'project-design',
      title: '프로젝트 설계 & 아키텍처',
      totalDuration: 145,
      tasks: day1Tasks
    },
    {
      slug: 'data-ingestion',
      title: '데이터 수집 파이프라인',
      totalDuration: 150,
      tasks: day2Tasks
    },
    {
      slug: 'transformation',
      title: '변환 & 적재 파이프라인',
      totalDuration: 150,
      tasks: day3Tasks
    },
    {
      slug: 'orchestration',
      title: '오케스트레이션 & 모니터링',
      totalDuration: 130,
      tasks: day4Tasks
    },
    {
      slug: 'testing-presentation',
      title: '통합 테스트 & 발표',
      totalDuration: 145,
      tasks: day5Tasks
    }
  ]
}
