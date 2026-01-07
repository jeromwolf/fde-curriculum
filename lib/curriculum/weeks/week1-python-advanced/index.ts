// Week 1: Python 심화 (Phase 1, Week 1)
import type { Week } from '../../types'
import { day1Tasks } from './day1-iterators'
import { day2Tasks } from './day2-decorators'
import { day3Tasks } from './day3-context-managers'
import { day4Tasks } from './day4-type-hints'
import { day5Tasks } from './day5-weekly-project'

export const pythonAdvancedWeek: Week = {
  slug: 'python-advanced',
  week: 1,
  phase: 1,
  month: 1,
  access: 'free',  // 첫 번째 Week은 무료 체험
  title: 'Python 심화',
  topics: ['제너레이터 & 이터레이터', '데코레이터 패턴', '컨텍스트 매니저', 'Type Hints & mypy'],
  practice: '데코레이터 기반 로깅 & 캐싱 시스템 구축',
  totalDuration: 750,
  days: [
    {
      slug: 'iterators',
      title: '이터레이터 & 제너레이터',
      totalDuration: 150,
      tasks: day1Tasks
    },
    {
      slug: 'decorators',
      title: '데코레이터 패턴',
      totalDuration: 150,
      tasks: day2Tasks
    },
    {
      slug: 'context-managers',
      title: '컨텍스트 매니저',
      totalDuration: 120,
      tasks: day3Tasks
    },
    {
      slug: 'type-hints',
      title: 'Type Hints & mypy',
      totalDuration: 150,
      tasks: day4Tasks
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: 로깅 & 캐싱 시스템',
      totalDuration: 180,
      tasks: day5Tasks
    }
  ]
}
