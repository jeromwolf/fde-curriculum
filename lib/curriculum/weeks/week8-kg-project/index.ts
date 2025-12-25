// Week 8: 도메인 KG 프로젝트 - 통합 모듈

import type { Week } from '../../types'
import { WEEK8_META } from './types'
import { day1DomainDesign } from './day1-domain-design'
import { day2DataCollection } from './day2-data-collection'
import { day3KgConstruction } from './day3-kg-construction'
import { day4GraphragIntegration } from './day4-graphrag-integration'
import { day5Production } from './day5-production'

// Week 8 완성: 도메인 KG 프로젝트
export const week8KgProject: Week = {
  slug: WEEK8_META.slug,
  week: WEEK8_META.week,
  phase: WEEK8_META.phase,
  month: WEEK8_META.month,
  access: WEEK8_META.access,
  title: WEEK8_META.title,
  topics: WEEK8_META.topics,
  practice: WEEK8_META.practice,
  totalDuration: 1070, // ~18시간
  days: [
    day1DomainDesign,       // Day 1: 도메인 KG 설계
    day2DataCollection,     // Day 2: 데이터 수집/정제
    day3KgConstruction,     // Day 3: KG 구축
    day4GraphragIntegration,// Day 4: GraphRAG 통합
    day5Production          // Day 5: 프로덕션 배포
  ]
}

// Week 메타데이터 재내보내기
export { WEEK8_META }

// 개별 Day 모듈 재내보내기
export {
  day1DomainDesign,
  day2DataCollection,
  day3KgConstruction,
  day4GraphragIntegration,
  day5Production
}

// 타입 재내보내기
export type { Day } from './types'
export { createVideoTask, createReadingTask, createCodeTask, createQuizTask, createChallengeTask } from './types'

// ============================================
// Week 8 통계
// ============================================
//
// 총 Task 수: 26개 (25 regular + 1 challenge)
// 총 학습 시간: ~18시간
//
// Day 1: 도메인 KG 설계
//   - 주요: 프로젝트 개요, 도메인 선택, 온톨로지 설계, 스키마 검증
//
// Day 2: 데이터 수집/정제
//   - 주요: 데이터 소스, 수집기 구현, 정제/검증, 엔티티 추출
//
// Day 3: KG 구축
//   - 주요: 아키텍처, KG 빌더, 벡터 인덱스, 쿼리 엔진
//
// Day 4: GraphRAG 통합
//   - 주요: 통합 아키텍처, Query Router, Aggregator, Response Generator
//
// Day 5: 프로덕션 배포
//   - 주요: Streamlit 앱, 시각화, 배포, 문서화, 체크리스트
//
// ============================================
