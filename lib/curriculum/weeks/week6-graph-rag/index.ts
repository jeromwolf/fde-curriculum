// Week 6: GraphRAG - 통합 모듈
import type { Week } from '../../types'
import { WEEK6_META } from './types'
import { day1GraphragConcepts } from './day1-graphrag-concepts'
import { day2LangchainNeo4j } from './day2-langchain-neo4j'
import { day3MsGraphrag } from './day3-ms-graphrag'
import { day4AdvancedTechniques } from './day4-advanced-techniques'
import { day5GraphragProject } from './day5-graphrag-project'

// Week 6 완성: GraphRAG
export const week6GraphRag: Week = {
  slug: WEEK6_META.slug,
  week: WEEK6_META.week,
  phase: WEEK6_META.phase,
  month: WEEK6_META.month,
  access: WEEK6_META.access,
  title: WEEK6_META.title,
  topics: WEEK6_META.topics,
  practice: WEEK6_META.practice,
  totalDuration: 1170, // 19.5시간 = 1170분
  days: [
    day1GraphragConcepts,     // Day 1: GraphRAG 개념 및 아키텍처
    day2LangchainNeo4j,       // Day 2: LangChain Neo4j 통합
    day3MsGraphrag,           // Day 3: Microsoft GraphRAG
    day4AdvancedTechniques,   // Day 4: GraphRAG 고급 기법
    day5GraphragProject       // Day 5: GraphRAG Q&A 프로젝트
  ]
}

// Week 메타데이터 재내보내기
export { WEEK6_META }

// 개별 Day 모듈 재내보내기
export {
  day1GraphragConcepts,
  day2LangchainNeo4j,
  day3MsGraphrag,
  day4AdvancedTechniques,
  day5GraphragProject
}

// 타입 재내보내기
export type { Day } from './types'
export {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask
} from './types'

// ============================================
// Week 6 통계
// ============================================
//
// 총 Task 수: 31개 (30 regular + 1 challenge)
// 총 학습 시간: ~19.5시간
//
// Day 1: GraphRAG 개념 및 아키텍처
//   - Tasks: 6개
//   - 시간: 220분 (~3.7시간)
//   - 주요: GraphRAG 개념, 아키텍처 패턴, 엔티티 추출
//
// Day 2: LangChain Neo4j 통합
//   - Tasks: 6개
//   - 시간: 230분 (~3.8시간)
//   - 주요: Neo4jGraph, GraphCypherQAChain, 벡터 인덱스
//
// Day 3: Microsoft GraphRAG
//   - Tasks: 6개
//   - 시간: 230분 (~3.8시간)
//   - 주요: MS GraphRAG 아키텍처, Local/Global Search
//
// Day 4: GraphRAG 고급 기법
//   - Tasks: 6개
//   - 시간: 220분 (~3.7시간)
//   - 주요: 쿼리 라우팅, Re-ranking, 대화형, 스트리밍
//
// Day 5: GraphRAG Q&A 프로젝트
//   - Tasks: 5개 + Challenge
//   - 시간: 270분 (4.5시간)
//   - 주요: KG 구축, 하이브리드 검색, Streamlit UI
//
// ============================================
// 학습 목표 달성 체크리스트
// ============================================
//
// ✅ GraphRAG 개념
//    - 기존 RAG의 한계와 GraphRAG 필요성
//    - 아키텍처 패턴 (Naive, Graph-First, Hybrid)
//    - 엔티티 추출 및 그래프 컨텍스트 생성
//
// ✅ LangChain Neo4j 통합
//    - Neo4jGraph 연결 및 스키마 추출
//    - GraphCypherQAChain 구현
//    - Neo4j 벡터 인덱스 활용
//
// ✅ Microsoft GraphRAG
//    - MS GraphRAG 파이프라인 이해
//    - Local Search vs Global Search
//    - 커뮤니티 탐지 및 요약
//
// ✅ 고급 기법
//    - 쿼리 라우팅 (Local/Global 자동 선택)
//    - Cross-Encoder Re-ranking
//    - 대화형 GraphRAG
//    - 스트리밍 응답
//
// ✅ 실습 프로젝트
//    - Knowledge Graph 자동 구축
//    - 하이브리드 검색 엔진
//    - Streamlit Q&A 인터페이스
//
// ============================================
