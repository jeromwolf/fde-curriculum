// Week 4: Entity Resolution & Python - 통합 모듈
import type { Week } from '../../types'
import { WEEK4_META } from './types'
import { day1EntityResolution } from './day1-entity-resolution'
import { day2Neo4jPython } from './day2-neo4j-python'
import { day3Visualization } from './day3-visualization'
import { day4MultiSourceKG } from './day4-multi-source-kg'
import { day5Project } from './day5-project'

// Week 4 완성: Entity Resolution & Python
export const week4EntityResolution: Week = {
  slug: WEEK4_META.slug,
  week: WEEK4_META.week,
  phase: WEEK4_META.phase,
  month: WEEK4_META.month,
  access: WEEK4_META.access,
  title: WEEK4_META.title,
  topics: WEEK4_META.topics,
  practice: WEEK4_META.practice,
  totalDuration: 1320, // 22시간 = 1320분
  days: [
    day1EntityResolution,   // Day 1: Entity Resolution 기초
    day2Neo4jPython,        // Day 2: Neo4j Python Driver
    day3Visualization,      // Day 3: NetworkX & PyVis 시각화
    day4MultiSourceKG,      // Day 4: 다중 소스 KG 구축
    day5Project             // Day 5: 기업 KG 프로젝트
  ]
}

// Week 메타데이터 재내보내기
export { WEEK4_META }

// 개별 Day 모듈 재내보내기
export {
  day1EntityResolution,
  day2Neo4jPython,
  day3Visualization,
  day4MultiSourceKG,
  day5Project
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
// Week 4 통계
// ============================================
//
// 총 라인 수: ~5,500줄
// 총 Task 수: 45개
// 총 학습 시간: ~22시간
//
// Day 1: Entity Resolution 기초
//   - Tasks: 8개
//   - 시간: 240분 (4시간)
//   - 주요: 유사도 알고리즘, recordlinkage, Neo4j ER
//
// Day 2: Neo4j Python Driver
//   - Tasks: 7개
//   - 시간: 240분 (4시간)
//   - 주요: 공식 드라이버, py2neo OGM, pandas 연동
//
// Day 3: NetworkX & PyVis 시각화
//   - Tasks: 7개
//   - 시간: 240분 (4시간)
//   - 주요: NetworkX 분석, PyVis 인터랙티브, Streamlit
//
// Day 4: 다중 소스 KG 구축
//   - Tasks: 6개
//   - 시간: 240분 (4시간)
//   - 주요: 소스 수집, 데이터 통합, 출처 추적
//
// Day 5: 기업 KG 프로젝트
//   - Tasks: 7개
//   - 시간: 360분 (6시간)
//   - 주요: 전체 파이프라인 통합, 대시보드 구축
//
// ============================================
// 학습 목표 달성 체크리스트
// ============================================
//
// ✅ Entity Resolution 기법
//    - 문자열 유사도 알고리즘 (Jaro-Winkler, Levenshtein)
//    - recordlinkage 파이프라인 (Index → Compare → Classify)
//    - Neo4j APOC으로 노드 병합
//
// ✅ Neo4j Python 연동
//    - 공식 드라이버 사용법
//    - py2neo OGM
//    - pandas DataFrame 연동
//
// ✅ 그래프 시각화
//    - NetworkX 분석 메트릭
//    - PyVis 인터랙티브 그래프
//    - Streamlit 대시보드
//
// ✅ 다중 소스 KG 구축
//    - CSV, API, Wikidata 수집
//    - 스키마 매핑 및 정규화
//    - 출처 추적 (Provenance)
//
// ✅ 종합 프로젝트
//    - 기업 Knowledge Graph 구축
//    - 시각화 대시보드 구현
//    - 문서화
//
// ============================================
