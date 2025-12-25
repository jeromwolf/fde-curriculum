// Week 5: RDF/OWL & 시맨틱 웹 - 통합 모듈
import type { Week } from '../../types'
import { WEEK5_META } from './types'
import { day1RdfBasics } from './day1-rdf-basics'
import { day2Sparql } from './day2-sparql'
import { day3OwlOntology } from './day3-owl-ontology'
import { day4PropertyGraphComparison } from './day4-property-graph-comparison'
import { day5SemanticWebPractice } from './day5-semantic-web-practice'

// Week 5 완성: RDF/OWL & 시맨틱 웹
export const week5RdfOwl: Week = {
  slug: WEEK5_META.slug,
  week: WEEK5_META.week,
  phase: WEEK5_META.phase,
  month: WEEK5_META.month,
  access: WEEK5_META.access,
  title: WEEK5_META.title,
  topics: WEEK5_META.topics,
  practice: WEEK5_META.practice,
  totalDuration: 1260, // 21시간 = 1260분
  days: [
    day1RdfBasics,             // Day 1: RDF 기초
    day2Sparql,                // Day 2: SPARQL 쿼리
    day3OwlOntology,           // Day 3: OWL 온톨로지
    day4PropertyGraphComparison, // Day 4: Property Graph vs RDF
    day5SemanticWebPractice    // Day 5: 시맨틱 웹 실습
  ]
}

// Week 메타데이터 재내보내기
export { WEEK5_META }

// 개별 Day 모듈 재내보내기
export {
  day1RdfBasics,
  day2Sparql,
  day3OwlOntology,
  day4PropertyGraphComparison,
  day5SemanticWebPractice
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
// Week 5 통계
// ============================================
//
// 총 라인 수: ~4,500줄
// 총 Task 수: 35개
// 총 학습 시간: ~21시간
//
// Day 1: RDF 기초
//   - Tasks: 7개
//   - 시간: 240분 (4시간)
//   - 주요: RDF 트리플, Turtle 형식, 표준 어휘
//
// Day 2: SPARQL 쿼리
//   - Tasks: 6개
//   - 시간: 240분 (4시간)
//   - 주요: 기본/고급 쿼리, Wikidata 실습
//
// Day 3: OWL 온톨로지
//   - Tasks: 6개
//   - 시간: 240분 (4시간)
//   - 주요: 클래스, 프로퍼티, 추론
//
// Day 4: Property Graph vs RDF
//   - Tasks: 6개
//   - 시간: 240분 (4시간)
//   - 주요: 모델 비교, 쿼리 비교, 선택 기준
//
// Day 5: 시맨틱 웹 실습
//   - Tasks: 7개
//   - 시간: 300분 (5시간)
//   - 주요: Wikidata 수집, 그래프 변환, 분석
//
// ============================================
// 학습 목표 달성 체크리스트
// ============================================
//
// ✅ RDF 트리플
//    - Subject-Predicate-Object 구조
//    - Turtle, JSON-LD 형식
//    - 표준 네임스페이스 (FOAF, DC, Schema.org)
//
// ✅ SPARQL 쿼리
//    - 기본 패턴 (SELECT, FILTER, OPTIONAL)
//    - 고급 기능 (Property Paths, 집계, CONSTRUCT)
//    - Wikidata 실습
//
// ✅ OWL 온톨로지
//    - 클래스 계층과 프로퍼티
//    - Transitive, Symmetric 등 특성
//    - Reasoner와 추론
//
// ✅ Property Graph vs RDF
//    - 데이터 모델 차이
//    - Cypher vs SPARQL
//    - 사용 사례별 선택 기준
//
// ✅ 시맨틱 웹 실습
//    - Wikidata 데이터 수집
//    - RDF → NetworkX 변환
//    - 그래프 분석 및 시각화
//
// ============================================
