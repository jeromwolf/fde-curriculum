// Day 1: RAG 아키텍처 심화
// 타겟: 중급 개발자 (Python, API 사용 경험 있음)

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day1RagArchitecture: Day = {
  slug: 'rag-architecture',
  title: 'RAG 아키텍처 심화',
  totalDuration: 280,
  tasks: [
    // ============================================
    // Task 1: RAG의 역사와 발전
    // ============================================
    createVideoTask('w5d1-rag-intro', 'RAG의 탄생과 진화', 35, {
      introduction: `
## RAG의 탄생 배경

2020년 Facebook AI Research(현 Meta AI)가 발표한 논문
**"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"**에서 RAG가 처음 소개되었습니다.

### 논문이 해결하려 했던 문제

\`\`\`
2020년 당시 LLM의 한계:

1. Parametric Memory만 의존
   - 모델 파라미터에 저장된 지식만 사용
   - 학습 후 지식 업데이트 불가능
   - 수십억 파라미터에도 "모든 것"을 기억할 수 없음

2. 환각(Hallucination) 문제
   - 모르는 것도 자신있게 대답
   - 사실과 다른 정보 생성
   - 출처 추적 불가능

3. 지식 업데이트의 어려움
   - 새 정보 반영 = 전체 재학습 필요
   - 비용: 수천만 달러
   - 시간: 수주~수개월
\`\`\`

### RAG의 핵심 아이디어

**기존 LLM (Parametric Memory Only):**

| 구성 요소 | 설명 |
|-----------|------|
| **입력** | 질문 |
| **처리** | LLM 파라미터 (학습 시점의 지식만 저장) |
| **출력** | 답변 (파라미터에서 "추론") |

> 한계: 학습 후 지식 업데이트 불가, 출처 추적 불가

**RAG (Parametric + Non-parametric Memory):**

| 단계 | 구성 요소 | 설명 |
|------|-----------|------|
| 1 | **External Knowledge Base** | 문서, DB (실시간 업데이트 가능!) |
| 2 | **검색 (Retrieval)** | 질문과 관련된 문서 검색 |
| 3 | **LLM 파라미터** | 질문 + 검색 결과를 입력 |
| 4 | **출력** | 답변 ("근거 기반" 생성) |

> 장점: 실시간 지식 업데이트, 출처 추적 가능, 환각 감소

---

## 2020년부터 2025년까지의 RAG 진화

RAG는 3단계로 진화해 왔습니다. 여기서는 큰 그림만 파악하고, 각 기술의 상세 구현은 이후 학습에서 다룹니다.

| Phase | 시기 | 핵심 특징 | 상세 학습 |
|-------|------|----------|-----------|
| **Naive RAG** | 2020-2021 | Query → Retrieve → Generate | Day 1 Task 3 |
| **Advanced RAG** | 2022-2023 | Hybrid Search, Re-ranking, Query Rewriting | Day 3 (청킹 & 검색) |
| **Agentic RAG** | 2024-2025 | Self-RAG, CRAG, GraphRAG | Day 4 (LangChain), Week 6 (GraphRAG) |

> **학습 로드맵**: 이번 주(Week 5)에서 Naive → Advanced RAG를 마스터하고, Week 6에서 GraphRAG를 심화 학습합니다.

---

## 왜 지금 RAG가 핵심 기술인가?

### 1. LLM의 한계는 구조적

| 한계 | 원인 | RAG 해결책 |
|------|------|-----------|
| 환각 | 확률적 생성 | 문서 기반 생성으로 근거 제공 |
| 지식 컷오프 | 학습 시점 고정 | 실시간 문서 업데이트 |
| 도메인 부족 | 일반 학습 데이터 | 전문 문서 추가 |
| 비용 | Fine-tuning 고비용 | 문서만 추가하면 됨 |

### 2. 실제 기업 적용 사례

| 서비스 | RAG 활용 | 사용자 경험 |
|--------|---------|-------------|
| **Notion AI** | 사용자 노트 검색 | "내 노트에서 프로젝트 마감일 찾아줘" |
| **GitHub Copilot** | 레포지토리 인덱싱 | "이 프로젝트에서 인증은 어떻게 처리해?" |
| **Perplexity AI** | 실시간 웹 검색 | 출처와 함께 최신 정보 제공 |
| **Cursor IDE** | 코드베이스 RAG | 프로젝트 컨텍스트 기반 코드 수정 |

### 3. FDE가 RAG를 알아야 하는 이유

> **FDE의 핵심 역할**: "고객의 데이터를 AI로 가치화"

| 고객사가 가진 것 | RAG 연결 후 가능한 것 |
|-----------------|---------------------|
| 사내 문서 (위키, 매뉴얼) | 자연어 Q&A 시스템 |
| 고객 데이터 (FAQ, 티켓) | 자동 고객 응대 |
| 도메인 지식 (규정, 전문 용어) | 전문가 수준 AI 어시스턴트 |

**결론: FDE = RAG 전문가** - RAG는 고객 데이터를 LLM에 연결하는 핵심 브릿지입니다.
      `,
      keyPoints: [
        'RAG는 2020년 Meta AI 논문에서 탄생 - LLM의 지식 한계를 외부 문서로 보완',
        'RAG 진화: Naive(Day1) → Advanced(Day3) → Agentic(Day4, Week6)',
        '실제 적용: Notion AI, GitHub Copilot, Perplexity, Cursor',
        'FDE = RAG 전문가: 고객 데이터를 AI로 가치화하는 핵심 기술',
      ],
      practiceGoal: 'RAG의 큰 그림을 이해하고, Week 5-6 학습 로드맵을 파악한다',
    }),

    // ============================================
    // Task 2: RAG vs Fine-tuning vs Prompt Engineering
    // ============================================
    createReadingTask('w5d1-rag-comparison', 'RAG vs Fine-tuning: 언제 무엇을 선택하나', 40, {
      introduction: `
## 세 가지 LLM 커스터마이징 방법

LLM을 특정 도메인/용도에 맞게 조정하는 세 가지 주요 방법이 있습니다.
각각의 작동 원리, 장단점, 적합한 상황을 깊이 이해해야 합니다.

---

## 1. Prompt Engineering

### 작동 원리

\`\`\`
모델 파라미터: 변경 없음
입력 프롬프트에 지시사항/예시를 추가

System Prompt:
"당신은 금융 전문가입니다. 다음 규칙을 따르세요:
1. 숫자는 항상 쉼표로 구분
2. 투자 조언은 면책 조항과 함께
3. 한국어로 답변..."

User: "삼성전자 주가 전망은?"
\`\`\`

### 장단점

| 장점 | 단점 |
|------|------|
| 즉시 적용 가능 | 컨텍스트 길이 제한 |
| 비용 없음 | 복잡한 지식 전달 어려움 |
| 실험/반복 빠름 | 일관성 유지 어려움 |
| 모델 변경 쉬움 | 프롬프트 엔지니어링 기술 필요 |

### 적합한 상황

\`\`\`
✅ 출력 형식/스타일 조정
✅ 간단한 규칙 적용
✅ Few-shot 예시로 충분한 경우
✅ 빠른 프로토타이핑

❌ 대량의 도메인 지식 필요
❌ 최신 정보 필요
❌ 복잡한 전문 지식
\`\`\`

---

## 2. Fine-tuning

### 작동 원리

\`\`\`
모델 파라미터: 실제로 수정됨
도메인 데이터로 추가 학습

학습 데이터 예시 (JSONL):
{"prompt": "환자가 두통을 호소합니다", "completion": "두통의 위치, 강도, 지속시간을..."}
{"prompt": "혈압이 180/110입니다", "completion": "고혈압 응급 상황으로..."}

학습 후:
모델이 의료 도메인의 "어투", "용어", "추론 패턴"을 학습
\`\`\`

### 장단점

| 장점 | 단점 |
|------|------|
| 깊은 도메인 이해 | 학습 비용 높음 ($1K~$100K+) |
| 일관된 스타일/어투 | 학습 시간 필요 (시간~일) |
| 복잡한 추론 가능 | 학습 데이터 준비 필요 |
| 추론 속도 동일 | 환각 여전히 발생 |
| | 지식 업데이트 = 재학습 |

### 적합한 상황

\`\`\`
✅ 특정 어투/스타일 필수 (고객사 브랜드)
✅ 복잡한 도메인 추론 (법률, 의료)
✅ 고정된 지식 베이스
✅ 대량 반복 사용

❌ 자주 변경되는 정보
❌ 출처 추적 필요
❌ 예산 제한
\`\`\`

### Fine-tuning 유형

\`\`\`
1. Full Fine-tuning
   - 전체 파라미터 수정
   - 가장 비쌈, 가장 강력
   - 대규모 학습 데이터 필요

2. LoRA (Low-Rank Adaptation)
   - 일부 레이어만 수정
   - 비용 90% 절감
   - 품질은 80-90% 수준

3. QLoRA (Quantized LoRA)
   - 양자화 + LoRA
   - 더 저렴, 로컬 GPU 가능
   - 오픈소스 모델에 인기
\`\`\`

---

## 3. RAG (Retrieval-Augmented Generation)

### 작동 원리

\`\`\`
모델 파라미터: 변경 없음
외부 지식을 검색하여 프롬프트에 주입

1. 문서 인덱싱 (오프라인)
   문서 → 청킹 → 임베딩 → 벡터 DB 저장

2. 쿼리 처리 (온라인)
   질문 → 임베딩 → 유사 문서 검색 →
   프롬프트 = 시스템 지시 + 검색 결과 + 질문 →
   LLM 답변 생성
\`\`\`

### 장단점

| 장점 | 단점 |
|------|------|
| 실시간 지식 업데이트 | 검색 품질에 의존 |
| 출처 추적 가능 | 지연시간 증가 |
| 환각 감소 | 복잡한 파이프라인 |
| 비용 효율적 | 청킹/검색 최적화 필요 |
| 민감 데이터 제어 | 임베딩 비용 발생 |

### 적합한 상황

\`\`\`
✅ 자주 변경되는 정보
✅ 출처 표시 필수 (법률, 의료, 금융)
✅ 사내 문서 기반 Q&A
✅ 최신 정보 반영 필요

❌ 특정 어투 필수
❌ 복잡한 도메인 추론
❌ 지연시간 극도로 민감
\`\`\`

---

## 결정 프레임워크

### 질문으로 판단하기

\`\`\`
Q1: 지식이 자주 변경되나요?
    예 → RAG 고려
    아니오 → Q2로

Q2: 출처 추적이 필요한가요?
    예 → RAG 고려
    아니오 → Q3로

Q3: 특정 스타일/어투가 필수인가요?
    예 → Fine-tuning 고려
    아니오 → Q4로

Q4: 복잡한 도메인 추론이 필요한가요?
    예 → Fine-tuning + RAG 조합 고려
    아니오 → Prompt Engineering으로 시작
\`\`\`

### 실전 조합 전략

\`\`\`
레벨 1: Prompt Engineering Only
- 빠른 프로토타입
- 간단한 용도
- 비용: $0

레벨 2: RAG
- 사내 문서 Q&A
- 지식 기반 챗봇
- 비용: 임베딩 비용만

레벨 3: Fine-tuning + RAG
- 도메인 어투 + 최신 지식
- 법률/의료/금융 전문 서비스
- 비용: Fine-tuning + 임베딩

레벨 4: Fine-tuning + RAG + Agents
- 복잡한 워크플로우
- 다단계 추론
- 엔터프라이즈 솔루션
\`\`\`

---

## 실제 사례: 법률 AI 서비스

\`\`\`
요구사항:
- 법률 용어 정확한 사용
- 최신 판례 반영
- 출처 (조항, 판례번호) 필수
- 법률 문서 스타일의 답변

솔루션:
1. Fine-tuning
   - 법률 문서 스타일 학습
   - 법률 추론 패턴 학습

2. RAG
   - 법령 DB 인덱싱
   - 판례 DB 인덱싱
   - 실시간 법률 뉴스 연동

결과:
Fine-tuned 모델이 RAG로 검색된 법령/판례를
법률 문서 스타일로 정리하여 답변
\`\`\`
      `,
      keyPoints: [
        'Prompt Engineering: 즉시 적용, 비용 없음, 복잡한 지식 전달 한계',
        'Fine-tuning: 깊은 도메인 이해, 스타일 학습, 지식 업데이트 어려움',
        'RAG: 실시간 업데이트, 출처 추적, 검색 품질에 의존',
        '실전에서는 조합 전략 (Fine-tuning + RAG)이 최적인 경우 많음',
      ],
      practiceGoal: '세 가지 방법의 작동 원리와 트레이드오프를 이해하고, 상황에 맞는 선택 기준을 세운다',
    }),

    // ============================================
    // Task 3: 프로덕션 RAG 아키텍처 패턴
    // ============================================
    createReadingTask('w5d1-production-patterns', '프로덕션 RAG 아키텍처 설계', 45, {
      introduction: `
## 프로덕션 RAG의 현실

개발 환경의 RAG와 프로덕션 RAG는 다릅니다.

\`\`\`
개발 환경:
- 문서 100개
- 동시 사용자 1명
- 지연시간 무관
- 비용 무관

프로덕션:
- 문서 100만개+
- 동시 사용자 1000명+
- 응답 2초 이내
- 월 $10K 이내
\`\`\`

---

## 프로덕션 RAG 아키텍처

### 전체 구조

| Layer | Component | Description |
|-------|-----------|-------------|
| **1. Entry** | Load Balancer | 트래픽 분산 |
| **2. Gateway** | API Gateway | Rate Limiting, Auth, Caching |
| **3. Core** | RAG Orchestrator | Query Router → Retrieval → Rerank → Generate |
| **4. Data** | Vector DB (Pinecone, Redis) | 벡터 검색 |
| **4. Data** | LLM API | OpenAI / Anthropic / Self-hosted |
| **5. Storage** | Document Store | S3 / PostgreSQL |

**데이터 흐름:**
1. **Client** → Load Balancer → API Gateway
2. **API Gateway** → RAG Orchestrator (쿼리 분석)
3. **Retrieval Service** → Vector DB (유사 문서 검색)
4. **Rerank Service** → 검색 결과 재정렬
5. **Generate Service** → LLM API (답변 생성)
6. **Response** → Client

---

## 핵심 설계 원칙

### 1. 검색과 생성의 분리

\`\`\`python
# Bad: 모놀리식
def answer(query):
    docs = vectorstore.search(query)  # 검색
    response = llm.generate(docs, query)  # 생성
    return response

# Good: 마이크로서비스
class RetrievalService:
    def search(self, query: str, filters: dict) -> List[Document]:
        # 검색 로직만 담당
        pass

class GenerationService:
    def generate(self, context: str, query: str) -> str:
        # 생성 로직만 담당
        pass

class RAGOrchestrator:
    def answer(self, query: str):
        docs = self.retrieval.search(query)
        reranked = self.reranker.rerank(docs, query)
        response = self.generation.generate(reranked, query)
        return response
\`\`\`

**이점:**
- 독립적 스케일링 (검색 트래픽 ≠ 생성 트래픽)
- 독립적 업데이트 (검색 로직만 변경 가능)
- 장애 격리 (생성 서비스 죽어도 검색 가능)

---

### 2. 캐싱 전략

\`\`\`python
# 다층 캐싱 구조

class MultiLayerCache:
    def __init__(self):
        self.l1_cache = {}  # 인메모리 (10초)
        self.l2_cache = Redis()  # Redis (5분)
        self.l3_cache = PostgreSQL()  # DB (1일)

    def get(self, query: str):
        # L1 체크
        if query in self.l1_cache:
            return self.l1_cache[query]

        # L2 체크
        cached = self.l2_cache.get(self.hash(query))
        if cached:
            self.l1_cache[query] = cached
            return cached

        # L3 체크 (정확한 쿼리만)
        cached = self.l3_cache.get_exact(query)
        if cached:
            self.l2_cache.set(self.hash(query), cached)
            self.l1_cache[query] = cached
            return cached

        return None

# 캐싱 대상
# 1. 임베딩 결과 (쿼리 임베딩)
# 2. 검색 결과 (동일 쿼리)
# 3. 최종 답변 (동일 쿼리)
\`\`\`

**비용 절감 효과:**
\`\`\`
캐시 히트율 50% 가정:
- LLM API 호출 50% 감소
- 검색 비용 50% 감소
- 응답 시간 90% 감소 (캐시 히트 시)
\`\`\`

---

### 3. 비동기 처리

\`\`\`python
import asyncio

async def answer_query(query: str):
    # 병렬 실행 가능한 작업들
    embedding_task = asyncio.create_task(
        embed_query(query)
    )

    # 임베딩 완료 대기
    query_embedding = await embedding_task

    # 여러 소스에서 병렬 검색
    search_tasks = [
        asyncio.create_task(search_vectordb(query_embedding)),
        asyncio.create_task(search_keyword_index(query)),
        asyncio.create_task(search_knowledge_graph(query)),
    ]

    results = await asyncio.gather(*search_tasks)

    # 결과 병합 및 Rerank
    merged = merge_results(results)
    reranked = await rerank(merged, query)

    # 스트리밍 생성
    async for chunk in generate_stream(reranked, query):
        yield chunk

# 응답 시간 비교
# 동기: 임베딩(0.3s) + 검색(0.5s) + 생성(2s) = 2.8s
# 비동기: 임베딩(0.3s) + 검색(0.5s) + 생성(2s) = 2.8s
#         (but 검색이 병렬이면) = 0.3 + 0.2 + 2 = 2.5s
# 스트리밍: 첫 토큰 0.8s 후 실시간 출력
\`\`\`

---

### 4. 모니터링 & 관찰성

\`\`\`python
from dataclasses import dataclass
from datetime import datetime
import logging

@dataclass
class RAGMetrics:
    query_id: str
    timestamp: datetime

    # 검색 메트릭
    retrieval_latency_ms: float
    num_docs_retrieved: int
    top_similarity_score: float

    # 생성 메트릭
    generation_latency_ms: float
    input_tokens: int
    output_tokens: int

    # 품질 메트릭
    user_feedback: Optional[int]  # 1-5
    was_helpful: Optional[bool]

class RAGObserver:
    def __init__(self):
        self.logger = logging.getLogger("rag")
        self.metrics_client = PrometheusClient()

    def log_query(self, metrics: RAGMetrics):
        # 로깅
        self.logger.info(f"Query {metrics.query_id}: "
                        f"retrieval={metrics.retrieval_latency_ms}ms, "
                        f"generation={metrics.generation_latency_ms}ms")

        # 메트릭 수집
        self.metrics_client.histogram(
            "rag_retrieval_latency",
            metrics.retrieval_latency_ms
        )
        self.metrics_client.histogram(
            "rag_generation_latency",
            metrics.generation_latency_ms
        )

        # 알림 조건 체크
        if metrics.retrieval_latency_ms > 1000:
            self.alert("Slow retrieval detected")

        if metrics.top_similarity_score < 0.5:
            self.alert("Low retrieval quality")
\`\`\`

**핵심 모니터링 지표:**
\`\`\`
1. 지연시간
   - P50, P95, P99 응답 시간
   - 검색 vs 생성 시간 분해

2. 품질
   - 평균 유사도 점수
   - 사용자 피드백 점수
   - 환각 감지율

3. 비용
   - 토큰 사용량 추이
   - 임베딩 API 호출 수
   - 캐시 히트율

4. 시스템
   - 벡터 DB 메모리 사용량
   - 인덱스 크기 증가율
   - 에러율
\`\`\`

---

## 규모별 아키텍처 권장

### 소규모 (문서 <10K, 사용자 <100)

\`\`\`
스택:
- Chroma (로컬 벡터 DB)
- OpenAI API
- 단일 서버

비용: ~$50/월
\`\`\`

### 중규모 (문서 <100K, 사용자 <1K)

\`\`\`
스택:
- Pinecone / Weaviate (관리형 벡터 DB)
- OpenAI API + 캐싱
- Kubernetes 2-3 노드

비용: ~$500/월
\`\`\`

### 대규모 (문서 >1M, 사용자 >10K)

\`\`\`
스택:
- Milvus / Qdrant (셀프 호스팅)
- 오픈소스 LLM (vLLM) + OpenAI 폴백
- Kubernetes 클러스터 + Auto-scaling

비용: $5,000+/월
\`\`\`
      `,
      keyPoints: [
        '검색/생성 서비스 분리로 독립적 스케일링과 장애 격리',
        '다층 캐싱 (인메모리 → Redis → DB)으로 비용 50%+ 절감 가능',
        '비동기 처리와 스트리밍으로 체감 응답 시간 개선',
        '지연시간, 품질, 비용, 시스템 4가지 축의 모니터링 필수',
      ],
      practiceGoal: '프로덕션 RAG 시스템의 아키텍처 설계 원칙과 규모별 권장 스택을 이해한다',
    }),

    // ============================================
    // Task 4: RAG 파이프라인 직접 구현
    // ============================================
    createCodeTask('w5d1-rag-implementation', '프로덕션급 RAG 파이프라인 구현', 60, {
      introduction: `
## 왜 배우는가?

**문제**: RAG를 처음 구현하면 흔히 "작동은 하는데... 프로덕션에서 쓸 수 있나?" 하는 의문이 생깁니다.
- 에러가 나면 시스템이 멈춘다
- 느린 응답 시간 (10초+)
- 비용 관리 불가능
- 디버깅이 어렵다

**해결**: 프로덕션 수준의 RAG는 **안정성, 성능, 관측성**을 모두 갖춰야 합니다.

---

## 비유: RAG 시스템 = 도서관 자동화

\`\`\`
프로토타입 RAG = 작은 서점
- 주인이 직접 책 찾아줌 (느림)
- 책 위치를 기억 (캐싱 없음)
- 문 닫으면 끝 (에러 처리 없음)

프로덕션 RAG = 대형 도서관
- 자동화 시스템 (빠름)
- 캐싱: 자주 찾는 책은 바로 꺼냄
- 백업: 메인 시스템 고장 시 서브 시스템
- 로그: 누가 무슨 책을 언제 찾았는지 기록
\`\`\`

---

## 프로젝트 구조

\`\`\`
rag_system/
├── config.py          # 설정
├── embeddings.py      # 임베딩 서비스
├── retrieval.py       # 검색 서비스
├── generation.py      # 생성 서비스
├── rag_pipeline.py    # 오케스트레이터
├── cache.py           # 캐싱
└── metrics.py         # 모니터링
\`\`\`

---

## 핵심 구현 (간소화)

\`\`\`python
# 📌 Step 1: 설정 관리
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str
    embedding_model: str = "text-embedding-3-small"
    retrieval_top_k: int = 5
    llm_model: str = "gpt-4o-mini"
    cache_ttl_seconds: int = 300

    class Config:
        env_file = ".env"

# 📌 Step 2: 캐싱이 있는 임베딩 서비스
class EmbeddingService:
    def __init__(self):
        self.client = OpenAI(api_key=Settings().openai_api_key)
        self._cache = {}

    def embed_query(self, text: str) -> list[float]:
        cache_key = hashlib.md5(text.encode()).hexdigest()
        if cache_key in self._cache:
            return self._cache[cache_key]  # 💰 캐시 히트 = 비용 0

        embedding = self.client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        ).data[0].embedding

        self._cache[cache_key] = embedding
        return embedding

# 📌 Step 3: 재시도가 있는 검색 서비스
class RetrievalService:
    def search(self, query: str, top_k: int = 5) -> list[Document]:
        try:
            query_embedding = self.embedding_service.embed_query(query)
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            return self._format_results(results)
        except Exception as e:
            logger.error(f"Search failed: {e}")
            return []  # 🛡️ 에러 시 빈 리스트 반환 (시스템 중단 방지)

# 📌 Step 4: RAG 파이프라인 오케스트레이터
class RAGPipeline:
    def query(self, question: str) -> RAGResponse:
        start_time = time.time()

        # 1️⃣ 검색
        documents = self.retrieval.search(question)
        if not documents:
            return RAGResponse(
                answer="관련 문서를 찾을 수 없습니다.",
                sources=[],
                metrics={"retrieval_time_ms": 0}
            )

        # 2️⃣ 답변 생성
        answer = self.generation.generate(question, documents)

        # 3️⃣ 메트릭 수집
        total_time = time.time() - start_time
        return RAGResponse(
            answer=answer,
            sources=[self._extract_source(d) for d in documents],
            metrics={"total_time_ms": total_time * 1000}
        )
\`\`\`

---

## 전체 코드 (상세)

### 1. 설정 (config.py)

\`\`\`python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # API Keys
    openai_api_key: str

    # Embedding
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536

    # Retrieval
    retrieval_top_k: int = 5
    similarity_threshold: float = 0.7

    # Generation
    llm_model: str = "gpt-4o-mini"
    llm_temperature: float = 0
    max_tokens: int = 1000

    # Cache
    cache_ttl_seconds: int = 300

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
\`\`\`

---

## 2. 임베딩 서비스 (embeddings.py)

\`\`\`python
from openai import OpenAI
import hashlib
from typing import List, Optional
from config import get_settings

class EmbeddingService:
    def __init__(self):
        self.settings = get_settings()
        self.client = OpenAI(api_key=self.settings.openai_api_key)
        self._cache = {}  # 간단한 인메모리 캐시

    def _cache_key(self, text: str) -> str:
        return hashlib.md5(text.encode()).hexdigest()

    def embed_query(self, text: str) -> List[float]:
        """단일 쿼리 임베딩 (캐싱 적용)"""
        cache_key = self._cache_key(text)

        if cache_key in self._cache:
            return self._cache[cache_key]

        response = self.client.embeddings.create(
            input=text,
            model=self.settings.embedding_model
        )
        embedding = response.data[0].embedding

        self._cache[cache_key] = embedding
        return embedding

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """다중 문서 임베딩 (배치 처리)"""
        # 캐시 확인
        results = [None] * len(texts)
        texts_to_embed = []
        indices_to_embed = []

        for i, text in enumerate(texts):
            cache_key = self._cache_key(text)
            if cache_key in self._cache:
                results[i] = self._cache[cache_key]
            else:
                texts_to_embed.append(text)
                indices_to_embed.append(i)

        # 캐시 미스된 것만 임베딩
        if texts_to_embed:
            response = self.client.embeddings.create(
                input=texts_to_embed,
                model=self.settings.embedding_model
            )

            for j, embedding_data in enumerate(response.data):
                idx = indices_to_embed[j]
                embedding = embedding_data.embedding
                results[idx] = embedding

                # 캐시 저장
                cache_key = self._cache_key(texts_to_embed[j])
                self._cache[cache_key] = embedding

        return results
\`\`\`

---

## 3. 검색 서비스 (retrieval.py)

\`\`\`python
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import numpy as np
from chromadb import PersistentClient
from embeddings import EmbeddingService
from config import get_settings

@dataclass
class RetrievedDocument:
    content: str
    metadata: Dict[str, Any]
    score: float

class RetrievalService:
    def __init__(self, collection_name: str = "documents"):
        self.settings = get_settings()
        self.embedding_service = EmbeddingService()

        # Chroma 클라이언트
        self.chroma = PersistentClient(path="./chroma_db")
        self.collection = self.chroma.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )

    def add_documents(
        self,
        documents: List[str],
        metadatas: Optional[List[Dict]] = None,
        ids: Optional[List[str]] = None
    ):
        """문서 추가"""
        if ids is None:
            ids = [f"doc_{i}" for i in range(len(documents))]

        if metadatas is None:
            metadatas = [{}] * len(documents)

        # 배치 임베딩
        embeddings = self.embedding_service.embed_documents(documents)

        self.collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )

        return len(documents)

    def search(
        self,
        query: str,
        top_k: Optional[int] = None,
        filter_metadata: Optional[Dict] = None
    ) -> List[RetrievedDocument]:
        """유사도 검색"""
        if top_k is None:
            top_k = self.settings.retrieval_top_k

        # 쿼리 임베딩
        query_embedding = self.embedding_service.embed_query(query)

        # 검색
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=filter_metadata,
            include=["documents", "metadatas", "distances"]
        )

        # 결과 변환
        documents = []
        for i in range(len(results["ids"][0])):
            # Chroma는 distance 반환, similarity로 변환
            distance = results["distances"][0][i]
            similarity = 1 - distance  # cosine distance to similarity

            # 임계값 필터링
            if similarity >= self.settings.similarity_threshold:
                documents.append(RetrievedDocument(
                    content=results["documents"][0][i],
                    metadata=results["metadatas"][0][i],
                    score=similarity
                ))

        return documents

    def hybrid_search(
        self,
        query: str,
        top_k: int = 5,
        vector_weight: float = 0.7
    ) -> List[RetrievedDocument]:
        """하이브리드 검색 (벡터 + 키워드)"""
        # 벡터 검색
        vector_results = self.search(query, top_k=top_k * 2)

        # 키워드 매칭 점수 추가
        query_terms = set(query.lower().split())

        for doc in vector_results:
            doc_terms = set(doc.content.lower().split())
            keyword_score = len(query_terms & doc_terms) / len(query_terms) if query_terms else 0

            # 하이브리드 점수
            doc.score = (
                vector_weight * doc.score +
                (1 - vector_weight) * keyword_score
            )

        # 재정렬
        vector_results.sort(key=lambda x: x.score, reverse=True)
        return vector_results[:top_k]
\`\`\`

---

## 4. 생성 서비스 (generation.py)

\`\`\`python
from openai import OpenAI
from typing import List, Generator
from retrieval import RetrievedDocument
from config import get_settings

class GenerationService:
    def __init__(self):
        self.settings = get_settings()
        self.client = OpenAI(api_key=self.settings.openai_api_key)

        self.system_prompt = """당신은 주어진 컨텍스트를 기반으로 정확하게 답변하는 AI 어시스턴트입니다.

규칙:
1. 컨텍스트에 있는 정보만 사용하세요.
2. 컨텍스트에 없는 정보는 "제공된 문서에서 해당 정보를 찾을 수 없습니다"라고 답하세요.
3. 답변에 사용한 정보의 출처를 언급하세요.
4. 불확실한 경우 그 점을 명시하세요."""

    def _format_context(self, documents: List[RetrievedDocument]) -> str:
        """검색 결과를 컨텍스트로 포매팅"""
        context_parts = []

        for i, doc in enumerate(documents, 1):
            source = doc.metadata.get("source", "Unknown")
            context_parts.append(
                f"[문서 {i}] (출처: {source}, 관련도: {doc.score:.2f})\\n"
                f"{doc.content}"
            )

        return "\\n\\n---\\n\\n".join(context_parts)

    def generate(
        self,
        query: str,
        documents: List[RetrievedDocument]
    ) -> str:
        """답변 생성"""
        context = self._format_context(documents)

        response = self.client.chat.completions.create(
            model=self.settings.llm_model,
            temperature=self.settings.llm_temperature,
            max_tokens=self.settings.max_tokens,
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": f"""컨텍스트:
{context}

질문: {query}

답변:"""}
            ]
        )

        return response.choices[0].message.content

    def generate_stream(
        self,
        query: str,
        documents: List[RetrievedDocument]
    ) -> Generator[str, None, None]:
        """스트리밍 답변 생성"""
        context = self._format_context(documents)

        stream = self.client.chat.completions.create(
            model=self.settings.llm_model,
            temperature=self.settings.llm_temperature,
            max_tokens=self.settings.max_tokens,
            stream=True,
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": f"""컨텍스트:
{context}

질문: {query}

답변:"""}
            ]
        )

        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
\`\`\`

---

## 5. RAG 오케스트레이터 (rag_pipeline.py)

\`\`\`python
from typing import List, Dict, Any, Optional, Generator
from dataclasses import dataclass
from datetime import datetime
import time

from retrieval import RetrievalService, RetrievedDocument
from generation import GenerationService
from config import get_settings

@dataclass
class RAGResponse:
    answer: str
    sources: List[Dict[str, Any]]
    metrics: Dict[str, Any]

class RAGPipeline:
    def __init__(self, collection_name: str = "documents"):
        self.settings = get_settings()
        self.retrieval = RetrievalService(collection_name)
        self.generation = GenerationService()

    def index_documents(
        self,
        documents: List[str],
        metadatas: Optional[List[Dict]] = None
    ) -> int:
        """문서 인덱싱"""
        return self.retrieval.add_documents(documents, metadatas)

    def query(
        self,
        question: str,
        use_hybrid: bool = False,
        top_k: Optional[int] = None
    ) -> RAGResponse:
        """RAG 쿼리 실행"""
        start_time = time.time()

        # 1. 검색
        retrieval_start = time.time()
        if use_hybrid:
            documents = self.retrieval.hybrid_search(question, top_k or 5)
        else:
            documents = self.retrieval.search(question, top_k)
        retrieval_time = time.time() - retrieval_start

        # 2. 검색 결과 없으면 조기 반환
        if not documents:
            return RAGResponse(
                answer="관련 문서를 찾을 수 없습니다. 질문을 다시 확인해주세요.",
                sources=[],
                metrics={
                    "retrieval_time_ms": retrieval_time * 1000,
                    "generation_time_ms": 0,
                    "total_time_ms": (time.time() - start_time) * 1000,
                    "num_documents": 0
                }
            )

        # 3. 답변 생성
        generation_start = time.time()
        answer = self.generation.generate(question, documents)
        generation_time = time.time() - generation_start

        # 4. 결과 조합
        total_time = time.time() - start_time

        return RAGResponse(
            answer=answer,
            sources=[
                {
                    "content": doc.content[:200] + "...",
                    "metadata": doc.metadata,
                    "score": doc.score
                }
                for doc in documents
            ],
            metrics={
                "retrieval_time_ms": retrieval_time * 1000,
                "generation_time_ms": generation_time * 1000,
                "total_time_ms": total_time * 1000,
                "num_documents": len(documents),
                "avg_similarity": sum(d.score for d in documents) / len(documents)
            }
        )

    def query_stream(
        self,
        question: str,
        use_hybrid: bool = False
    ) -> Generator[str, None, None]:
        """스트리밍 RAG 쿼리"""
        # 검색
        if use_hybrid:
            documents = self.retrieval.hybrid_search(question)
        else:
            documents = self.retrieval.search(question)

        if not documents:
            yield "관련 문서를 찾을 수 없습니다."
            return

        # 스트리밍 생성
        for chunk in self.generation.generate_stream(question, documents):
            yield chunk


# 사용 예시
if __name__ == "__main__":
    # 초기화
    rag = RAGPipeline()

    # 문서 인덱싱
    documents = [
        "RAG는 Retrieval-Augmented Generation의 약자입니다.",
        "RAG는 2020년 Facebook AI Research에서 발표되었습니다.",
        "RAG는 외부 지식을 검색하여 LLM의 답변 품질을 향상시킵니다.",
        "벡터 데이터베이스는 임베딩을 저장하고 유사도 검색을 수행합니다.",
        "Chroma는 오픈소스 벡터 데이터베이스입니다.",
    ]
    metadatas = [
        {"source": "rag_intro.md", "section": "정의"},
        {"source": "rag_intro.md", "section": "역사"},
        {"source": "rag_intro.md", "section": "장점"},
        {"source": "vectordb.md", "section": "개념"},
        {"source": "vectordb.md", "section": "도구"},
    ]

    rag.index_documents(documents, metadatas)
    print("문서 인덱싱 완료")

    # 쿼리
    response = rag.query("RAG가 뭐야?")
    print(f"\\n답변: {response.answer}")
    print(f"\\n출처: {response.sources}")
    print(f"\\n메트릭: {response.metrics}")

    # 스트리밍
    print("\\n스트리밍 답변: ", end="")
    for chunk in rag.query_stream("RAG의 장점은?"):
        print(chunk, end="", flush=True)
    print()
\`\`\`
      `,
      keyPoints: [
        '🏗️ 설정, 임베딩, 검색, 생성을 분리된 서비스로 구현',
        '💰 임베딩/검색 결과 캐싱으로 비용과 지연시간 절감',
        '🔍 하이브리드 검색 (벡터 + 키워드) 구현',
        '📊 메트릭 수집 기반 성능 모니터링 내장',
      ],
      practiceGoal: '프로덕션에서 사용 가능한 수준의 RAG 파이프라인을 직접 구현한다',
    }),

    // ============================================
    // Task 5: Day 1 퀴즈
    // ============================================
    createQuizTask('w5d1-quiz', 'Day 1 이해도 점검', 20, {
      introduction: '',
      questions: [
        {
          id: 'w5d1-q1',
          question: 'RAG가 최초로 발표된 연도와 기관은?',
          options: [
            '2019년 Google',
            '2020년 Facebook AI Research',
            '2021년 OpenAI',
            '2022년 Anthropic'
          ],
          correctAnswer: 1,
          explanation: 'RAG는 2020년 Facebook AI Research(현 Meta AI)에서 "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" 논문으로 처음 발표되었습니다.',
        },
        {
          id: 'w5d1-q2',
          question: 'Fine-tuning 대비 RAG의 가장 큰 장점은?',
          options: [
            '더 빠른 응답 속도',
            '더 저렴한 GPU 비용',
            '실시간 지식 업데이트와 출처 추적',
            '더 높은 답변 품질'
          ],
          correctAnswer: 2,
          explanation: 'RAG는 문서만 업데이트하면 즉시 새 지식이 반영되고, 답변의 근거가 된 문서를 출처로 제시할 수 있습니다. Fine-tuning은 재학습이 필요하고 출처 추적이 어렵습니다.',
        },
        {
          id: 'w5d1-q3',
          question: '프로덕션 RAG에서 캐싱의 주요 대상이 아닌 것은?',
          options: [
            '쿼리 임베딩 결과',
            '검색된 문서 목록',
            '모델 파라미터',
            'LLM 최종 답변'
          ],
          correctAnswer: 2,
          explanation: '모델 파라미터는 고정되어 있으므로 캐싱 대상이 아닙니다. 쿼리 임베딩, 검색 결과, 최종 답변은 동일 쿼리 반복 시 재사용할 수 있어 캐싱 효과가 큽니다.',
        },
        {
          id: 'w5d1-q4',
          question: '2024-2025 최신 RAG 트렌드가 아닌 것은?',
          options: [
            'Self-RAG (자가 검증)',
            'Corrective RAG (자동 수정)',
            'Naive RAG (단순 검색-생성)',
            'Agentic RAG (에이전트 기반)'
          ],
          correctAnswer: 2,
          explanation: 'Naive RAG는 2020-2021년의 초기 패턴입니다. 최신 트렌드는 Self-RAG, CRAG, Agentic RAG, GraphRAG 등 더 정교한 검증/추론 메커니즘을 포함합니다.',
        },
        {
          id: 'w5d1-q5',
          question: '하이브리드 검색이 벡터 검색만 사용하는 것보다 나은 이유는?',
          options: [
            '항상 더 빠르기 때문에',
            '키워드 정확 매칭과 의미 검색의 장점을 결합하기 때문에',
            '벡터 DB가 필요 없기 때문에',
            '임베딩 비용이 없기 때문에'
          ],
          correctAnswer: 1,
          explanation: '벡터 검색은 의미적 유사성에 강하지만 정확한 키워드를 놓칠 수 있고, 키워드 검색은 그 반대입니다. 하이브리드 검색은 두 방식의 장점을 결합하여 더 높은 검색 품질을 달성합니다.',
        },
      ],
      keyPoints: [
        'RAG 역사: 2020년 Meta AI 논문에서 시작',
        'RAG vs Fine-tuning: 실시간 업데이트, 출처 추적이 RAG의 핵심 장점',
        '프로덕션 최적화: 캐싱, 하이브리드 검색, 모니터링',
        '최신 트렌드: Self-RAG, CRAG, Agentic RAG',
      ],
      practiceGoal: 'Day 1 학습 내용의 핵심 개념을 정확히 이해했는지 확인한다',
    }),
  ],

  // ============================================
  // Day 1 Challenge
  // ============================================
  challenge: createChallengeTask('w5d1-challenge', 'Challenge: RAG 아키텍처 설계서 작성', 60, {
    introduction: `
## 과제 목표

가상의 고객사 시나리오를 바탕으로 **RAG 아키텍처 설계서**를 작성하세요.
이 과제는 FDE로서 고객에게 솔루션을 제안하는 실전 경험을 시뮬레이션합니다.

---

## 시나리오

**고객사: 미래법률사무소**

\`\`\`
업종: 법률 서비스
규모: 변호사 50명, 직원 100명
현재 상황:
- 10년간 축적된 판례 분석 자료 50,000건
- 내부 법률 의견서 10,000건
- 법령 DB 연동 필요 (국가법령정보센터)

요구사항:
1. 변호사들이 자연어로 판례/법령 검색
2. 관련 판례 + 법령 + 내부 의견서를 종합한 답변
3. 출처 (판례번호, 법령 조항, 의견서 번호) 필수 표시
4. 응답 시간 5초 이내
5. 월 예산 $3,000 이내
\`\`\`

---

## 제출물 (Markdown 형식)

### 1. 기술 선택 및 근거 (30%)

\`\`\`
다음 항목에 대한 선택과 이유를 작성:
- Prompt Engineering / Fine-tuning / RAG 중 선택 및 이유
- 임베딩 모델 선택
- 벡터 DB 선택
- LLM 선택
\`\`\`

### 2. 아키텍처 다이어그램 (30%)

\`\`\`
ASCII 아트 또는 설명으로 다음 포함:
- 데이터 흐름 (문서 수집 → 인덱싱 → 검색 → 생성)
- 컴포넌트 구성
- 캐싱 전략
- 에러 처리
\`\`\`

### 3. 비용 추정 (20%)

\`\`\`
월간 예상 비용 산출:
- 임베딩 비용 (문서 개수 × 토큰 × 단가)
- LLM 비용 (예상 쿼리 수 × 토큰 × 단가)
- 인프라 비용 (벡터 DB, 서버)
\`\`\`

### 4. 리스크 및 완화 방안 (20%)

\`\`\`
최소 3가지 리스크와 대응 방안:
예: 검색 품질 저하 → 하이브리드 검색 + Re-ranking
\`\`\`

---

## 평가 기준

| 항목 | 배점 | 기준 |
|------|------|------|
| 기술 선택 근거 | 30% | 요구사항과의 적합성, 논리적 근거 |
| 아키텍처 완성도 | 30% | 프로덕션 레벨의 고려사항 포함 |
| 비용 현실성 | 20% | 실제 가격 기반, 예산 내 |
| 리스크 분석 | 20% | 실질적 리스크 식별 및 대응 |

---

## 참고 가격 (2024년 기준)

\`\`\`
OpenAI:
- text-embedding-3-small: $0.02 / 1M 토큰
- text-embedding-3-large: $0.13 / 1M 토큰
- gpt-4o-mini: $0.15 / 1M 입력, $0.60 / 1M 출력
- gpt-4o: $2.50 / 1M 입력, $10 / 1M 출력

벡터 DB:
- Pinecone: Free tier (100K 벡터) + $70/월 (1M 벡터)
- Weaviate Cloud: $25/월~
- Chroma: 무료 (셀프 호스팅)

서버:
- AWS EC2 t3.medium: ~$30/월
- AWS EC2 m5.large: ~$70/월
\`\`\`
    `,
    hints: [
`# ============================================
# RAG 아키텍처 설계서 Pseudocode
# ============================================

# 1. 기술 선택
SECTION "기술 선택 및 근거":

    접근 방식:
        선택: RAG
        이유:
            - 판례/법령은 자주 업데이트됨 → Fine-tuning 부적합
            - 출처 표시 필수 → RAG의 핵심 장점
            - 기존 문서 활용 → 추가 학습 데이터 생성 불필요

    임베딩 모델:
        선택: text-embedding-3-small
        이유:
            - 비용 효율 ($0.02/1M)
            - 60K 문서 × 평균 1000 토큰 = 60M 토큰
            - 일회성 비용: $1.2

    벡터 DB:
        선택: Pinecone
        이유:
            - 관리형 → 운영 부담 감소
            - 60K 벡터 → Free tier로 가능
            - 필터링, 메타데이터 지원

    LLM:
        선택: gpt-4o-mini
        이유:
            - 비용 효율 ($0.15/1M 입력)
            - 법률 텍스트 이해력 충분
            - 응답 속도 빠름

# 2. 아키텍처
SECTION "아키텍처 다이어그램":

    [데이터 소스]
        ├── 판례 분석 자료 (50K건)
        ├── 내부 의견서 (10K건)
        └── 국가법령정보센터 API
             │
             ▼
    [문서 처리 파이프라인]
        ├── PDF/HWP 텍스트 추출
        ├── 청킹 (1000자, 100자 오버랩)
        └── 임베딩 (text-embedding-3-small)
             │
             ▼
    [벡터 저장소: Pinecone]
        └── 메타데이터: source, type, date, case_number
             │
             ▼
    [검색 서비스]
        ├── 하이브리드 검색 (벡터 70% + 키워드 30%)
        └── Re-ranking (Cohere)
             │
             ▼
    [생성 서비스]
        ├── 컨텍스트 구성 (출처 포함)
        ├── 프롬프트 템플릿 (법률 전용)
        └── LLM 생성 (gpt-4o-mini)
             │
             ▼
    [캐싱 레이어: Redis]
        └── 쿼리 결과 캐싱 (TTL: 1시간)
             │
             ▼
    [API Gateway]
        └── Rate limiting, Auth

# 3. 비용 추정
SECTION "월간 비용 추정":

    가정:
        - 월간 쿼리 수: 10,000건
        - 평균 검색 결과: 5개 문서
        - 평균 입력 토큰: 2,000 (컨텍스트 + 질문)
        - 평균 출력 토큰: 500

    임베딩 (일회성):
        - 60K 문서 × 1,000 토큰 = 60M 토큰
        - 비용: 60M × $0.02/1M = $1.2

    LLM (월간):
        - 입력: 10,000 × 2,000 = 20M 토큰
        - 출력: 10,000 × 500 = 5M 토큰
        - 비용: (20M × $0.15/1M) + (5M × $0.60/1M)
               = $3 + $3 = $6/월

    인프라:
        - Pinecone: Free tier ($0)
        - EC2 t3.medium: $30/월
        - Redis (ElastiCache): $15/월

    총 월간 비용: ~$51/월 (예산 $3,000의 1.7%)

# 4. 리스크 및 완화
SECTION "리스크 분석":

    리스크 1: 검색 품질 저하
        원인: 법률 용어의 다양한 표현
        완화:
            - 하이브리드 검색 적용
            - 법률 동의어 사전 구축
            - Re-ranking 적용

    리스크 2: 환각 (잘못된 판례 인용)
        원인: LLM의 본질적 한계
        완화:
            - 프롬프트에 "컨텍스트만 사용" 강조
            - 출처 검증 후처리 로직
            - 사용자 피드백 수집

    리스크 3: 응답 지연
        원인: 대용량 컨텍스트 처리
        완화:
            - Redis 캐싱 (반복 질문)
            - 스트리밍 응답
            - 비동기 처리

    리스크 4: 법령 업데이트 누락
        원인: 수동 업데이트 의존
        완화:
            - 국가법령정보센터 API 연동
            - 일일 배치 업데이트
            - 변경 알림 시스템`
    ],
    keyPoints: [
      '고객 요구사항 분석 → 기술 선택 근거 도출',
      '프로덕션 아키텍처 설계 (캐싱, 에러 처리 포함)',
      '현실적인 비용 추정 및 예산 준수',
      '리스크 식별 및 선제적 완화 방안',
    ],
    practiceGoal: 'FDE로서 고객에게 RAG 솔루션을 제안하는 설계서를 작성한다',
  }),
}
