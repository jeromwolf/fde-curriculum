// Week 7: 자연어 → Cypher - 통합 모듈
import type { Week } from '../../types'
import { WEEK7_META } from './types'
import { day1Text2cypherBasics } from './day1-text2cypher-basics'
import { day2FewShotLearning } from './day2-few-shot-learning'
import { day3ErrorHandling } from './day3-error-handling'
import { day4AdvancedT2c } from './day4-advanced-t2c'
import { day5T2cProject } from './day5-t2c-project'

// Week 7 완성: 자연어 → Cypher
export const week7Text2Cypher: Week = {
  slug: WEEK7_META.slug,
  week: WEEK7_META.week,
  phase: WEEK7_META.phase,
  month: WEEK7_META.month,
  access: WEEK7_META.access,
  title: WEEK7_META.title,
  topics: WEEK7_META.topics,
  practice: WEEK7_META.practice,
  totalDuration: 1075, // ~18시간
  days: [
    day1Text2cypherBasics,  // Day 1: Text2Cypher 기초
    day2FewShotLearning,    // Day 2: Few-shot Learning
    day3ErrorHandling,      // Day 3: 에러 처리
    day4AdvancedT2c,        // Day 4: 고급 기법
    day5T2cProject          // Day 5: 챗봇 프로젝트
  ]
}

// Week 메타데이터 재내보내기
export { WEEK7_META }

// 개별 Day 모듈 재내보내기
export {
  day1Text2cypherBasics,
  day2FewShotLearning,
  day3ErrorHandling,
  day4AdvancedT2c,
  day5T2cProject
}

// 타입 재내보내기
export type { Day } from './types'
export { createVideoTask, createReadingTask, createCodeTask, createQuizTask, createChallengeTask } from './types'

// ============================================
// Week 7 통계
// ============================================
//
// 총 Task 수: 30개 (29 regular + 1 challenge)
// 총 학습 시간: ~18시간
//
// Day 1: Text2Cypher 기초
//   - 주요: 개념, 스키마 프롬프팅, 기본 구현, 쿼리 검증
//
// Day 2: Few-shot Learning
//   - 주요: Few-shot 예시, 동적 선택, 프롬프트 엔지니어링
//
// Day 3: 에러 처리
//   - 주요: 에러 유형, 자동 재시도, Fallback, 모니터링
//
// Day 4: 고급 기법
//   - 주요: 멀티턴 대화, 복잡한 쿼리, 파라미터화, 캐싱
//
// Day 5: 챗봇 프로젝트
//   - 주요: 핵심 엔진, Streamlit UI, 결과 포맷팅, 배포
//
// ============================================
