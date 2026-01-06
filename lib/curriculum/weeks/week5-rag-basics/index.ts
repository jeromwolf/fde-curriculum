// Week 5: RAG 기초 - 통합 모듈
import type { Week } from '../../types'
import { WEEK5_META } from './types'
import { day1RagArchitecture } from './day1-rag-architecture'
import { day2EmbeddingsVectordb } from './day2-embeddings-vectordb'
import { day3ChunkingRetrieval } from './day3-chunking-retrieval'
import { day4LangchainRag } from './day4-langchain-rag'
import { day5RagProject } from './day5-rag-project'
import { day6SllmRag } from './day6-sllm-rag'
import { day7LanggraphAgent } from './day7-langgraph-agent'
import { day8DomainAgents } from './day8-domain-agents'

// Week 5 완성: RAG 기초
export const week5RagBasics: Week = {
  slug: WEEK5_META.slug,
  week: WEEK5_META.week,
  phase: WEEK5_META.phase,
  month: WEEK5_META.month,
  access: WEEK5_META.access,
  title: WEEK5_META.title,
  topics: WEEK5_META.topics,
  practice: WEEK5_META.practice,
  totalDuration: 2220, // 37시간 = 2220분 (기존 26시간 + LangGraph 5시간 + Domain Agent 6시간)
  days: [
    day1RagArchitecture,      // Day 1: RAG 아키텍처 개요
    day2EmbeddingsVectordb,   // Day 2: 임베딩 & 벡터 DB
    day3ChunkingRetrieval,    // Day 3: 청킹 전략 & 검색 최적화
    day4LangchainRag,         // Day 4: LangChain RAG 파이프라인
    day5RagProject,           // Day 5: 프로덕션 RAG 시스템
    day6SllmRag,              // Day 6: 로컬 LLM과 RAG 통합 (sLLM)
    day7LanggraphAgent,       // Day 7: LangGraph Agent 심화 (NEW)
    day8DomainAgents          // Day 8: 도메인 특화 Agent & 실전 도구 (NEW)
  ]
}

// Week 메타데이터 재내보내기
export { WEEK5_META }

// 개별 Day 모듈 재내보내기
export {
  day1RagArchitecture,
  day2EmbeddingsVectordb,
  day3ChunkingRetrieval,
  day4LangchainRag,
  day5RagProject,
  day6SllmRag,
  day7LanggraphAgent,
  day8DomainAgents
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
// Week 5 통계
// ============================================
//
// 총 Task 수: 37개 (기존 30개 + Day 6 7개)
// 총 학습 시간: ~26시간
//
// Day 1: RAG 아키텍처 개요
//   - Tasks: 6개
//   - 시간: 240분 (4시간)
//   - 주요: RAG 개념, 컴포넌트, 패턴, 평가
//
// Day 2: 임베딩 & 벡터 DB
//   - Tasks: 6개
//   - 시간: 240분 (4시간)
//   - 주요: OpenAI 임베딩, Chroma, Pinecone
//
// Day 3: 청킹 전략 & 검색 최적화
//   - Tasks: 6개
//   - 시간: 240분 (4시간)
//   - 주요: 청킹 전략, 검색 방식, 최적화
//
// Day 4: LangChain RAG 파이프라인
//   - Tasks: 6개
//   - 시간: 240분 (4시간)
//   - 주요: LCEL, 대화형 RAG, 스트리밍
//
// Day 5: 프로덕션 RAG 시스템
//   - Tasks: 6개 + Challenge
//   - 시간: 300분 (5시간)
//   - 주요: PDF 처리, Streamlit, 배포
//
// Day 6: 로컬 LLM과 RAG 통합 (sLLM)
//   - Tasks: 6개 + Challenge
//   - 시간: 300분 (5시간)
//   - 주요: Ollama, 시스템 요구사항, sLLM RAG 통합
//
// ============================================
// 학습 목표 달성 체크리스트
// ============================================
//
// ✅ RAG 아키텍처
//    - RAG 개념과 필요성
//    - 핵심 컴포넌트 이해
//    - RAG 패턴 (Naive, Advanced)
//
// ✅ 임베딩 & 벡터 DB
//    - 텍스트 임베딩 원리
//    - OpenAI 임베딩 API
//    - Chroma, Pinecone 사용
//
// ✅ 청킹 & 검색
//    - 다양한 청킹 전략
//    - 검색 최적화 기법
//    - Re-ranking, Hybrid 검색
//
// ✅ LangChain RAG
//    - LCEL 문법
//    - RAG 체인 구성
//    - 대화형, 스트리밍 RAG
//
// ✅ 실습 프로젝트
//    - PDF 문서 처리
//    - Streamlit UI
//    - 배포 및 최적화
//
// ✅ sLLM (로컬 LLM)
//    - sLLM 선택 기준 (Llama, Mistral, Qwen)
//    - VRAM/양자화 이해
//    - Ollama 설치 및 사용
//    - sLLM + RAG 통합
//    - 프로덕션 배포 (Docker, vLLM)
//
// ============================================
