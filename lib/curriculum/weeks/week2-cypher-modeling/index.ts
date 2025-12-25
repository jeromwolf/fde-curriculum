// Week 2: Cypher 심화 & 데이터 모델링 - 통합 모듈
import type { Week } from '../../types'
import { WEEK2_META } from './types'
import { day1CypherAdvanced } from './day1-cypher-advanced'
import { day2ObjectType } from './day2-object-type'
import { day3SchemaPatterns } from './day3-schema-patterns'
import { day4Apoc } from './day4-apoc'
import { day5WeeklyProject } from './day5-weekly-project'

// Week 2 완성: Cypher 심화 & 데이터 모델링
export const week2CypherModeling: Week = {
  slug: WEEK2_META.slug,
  week: WEEK2_META.week,
  phase: WEEK2_META.phase,
  month: WEEK2_META.month,
  access: WEEK2_META.access,
  title: WEEK2_META.title,
  topics: WEEK2_META.topics,
  practice: WEEK2_META.practice,
  totalDuration: 1140, // 19시간 = 1140분
  days: [
    day1CypherAdvanced,   // Day 1: Cypher 고급 쿼리 (~600줄)
    day2ObjectType,        // Day 2: Object Type 설계 (~750줄)
    day3SchemaPatterns,    // Day 3: 스키마 패턴 (~700줄)
    day4Apoc,              // Day 4: APOC 라이브러리 (~750줄)
    day5WeeklyProject      // Day 5: 주간 프로젝트 (~900줄)
  ]
}

// Week 메타데이터 재내보내기
export { WEEK2_META }

// 개별 Day 모듈 재내보내기
export {
  day1CypherAdvanced,
  day2ObjectType,
  day3SchemaPatterns,
  day4Apoc,
  day5WeeklyProject
}

// 타입 재내보내기
export type { Day } from './types'
export {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
  createSimulatorTask
} from './types'

// ============================================
// Week 2 통계
// ============================================
//
// 총 라인 수: ~3,700줄
// 총 Task 수: 52개
// 총 학습 시간: ~19시간
//
// Day 1: Cypher 고급 쿼리
//   - Tasks: 10개
//   - 시간: 240분 (4시간)
//   - 주요: 가변 길이 경로, WITH 파이프라인, 집계
//
// Day 2: Object Type 설계
//   - Tasks: 10개
//   - 시간: 240분 (4시간)
//   - 주요: Palantir 스타일, 네이밍 컨벤션, 스키마 진화
//
// Day 3: 스키마 패턴
//   - Tasks: 10개
//   - 시간: 220분 (~3.7시간)
//   - 주요: Intermediate Node, Supernode 방지, 안티패턴
//
// Day 4: APOC 라이브러리
//   - Tasks: 12개
//   - 시간: 240분 (4시간)
//   - 주요: 데이터 로드, 텍스트 처리, 배치 처리
//
// Day 5: 주간 프로젝트
//   - Tasks: 10개
//   - 시간: 360분 (6시간)
//   - 주요: 이커머스 도메인, 전체 워크플로우
//
// ============================================
