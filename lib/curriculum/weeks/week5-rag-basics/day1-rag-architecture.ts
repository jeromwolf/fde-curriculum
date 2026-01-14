// Day 1: RAG 아키텍처 개요
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
  title: 'RAG 아키텍처 개요',
  totalDuration: 280,
  tasks: [
    // ============================================
    // Task 1: RAG의 역사와 발전
    // ============================================
    createVideoTask('w5d1-rag-intro', 'RAG의 탄생과 진화', 35, {
      videoUrl: 'https://www.youtube.com/watch?v=RGttus5EyYo',
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
      videoUrl: 'https://youtu.be/sTs7hSHEzhc',
      introduction: `
## 프로덕션 RAG의 현실

> 💡 **핵심 메시지**: 개발 환경에서 잘 돌아가는 RAG가 프로덕션에서 실패하는 이유를 이해하고, 이를 해결하는 설계 패턴을 배웁니다.

### 왜 프로덕션은 다를까?

개발할 때는 문서 몇 개로 테스트하고, 혼자 사용하죠. 하지만 실제 서비스는 완전히 다른 세상입니다.

\`\`\`
📦 개발 환경              🏭 프로덕션 환경
──────────────────────────────────────────
문서 100개          →    문서 100만개+
동시 사용자 1명     →    동시 사용자 1000명+
지연시간 무관       →    응답 2초 이내 필수
비용 무관           →    월 $10K 이내

"개발에서 1초 걸리던 검색이 프로덕션에서 10초 걸릴 수 있습니다"
\`\`\`

---

## 프로덕션 RAG 아키텍처

### 전체 구조 - 5개 레이어

프로덕션 RAG는 마치 **대형 물류센터**와 같습니다:
- **Entry Layer**: 입구 경비원 (트래픽 분산)
- **Gateway Layer**: 접수 데스크 (인증, 제한)
- **Core Layer**: 작업자들 (실제 RAG 로직)
- **Data Layer**: 창고 (벡터 DB, LLM)
- **Storage Layer**: 원본 보관소 (S3, DB)

| Layer | Component | 역할 | 비유 |
|-------|-----------|------|------|
| 1. Entry | Load Balancer | 트래픽 분산 | 여러 입구로 손님 분산 |
| 2. Gateway | API Gateway | Rate Limiting, 인증, 캐싱 | 접수 데스크에서 신원 확인 |
| 3. Core | RAG Orchestrator | 쿼리 분석 → 검색 → 재정렬 → 생성 | 작업 지시자 |
| 4. Data | Vector DB + LLM | 검색 엔진 + AI 모델 | 창고 + 전문가 |
| 5. Storage | Document Store | 원본 문서 저장 | 원본 보관소 |

**실제 데이터 흐름 (사용자 질문 → 답변):**
\`\`\`
1. 사용자 → Load Balancer → API Gateway (인증 체크)
2. API Gateway → RAG Orchestrator (쿼리 분석)
3. Retrieval Service → Vector DB (유사 문서 검색)
4. Rerank Service → 검색 결과 재정렬 (관련성 높은 것 위로)
5. Generate Service → LLM API (답변 생성)
6. Response → 사용자
\`\`\`

---

## 핵심 설계 원칙

### 원칙 1: 검색과 생성의 분리 🔀

> 💡 **왜 분리해야 할까요?**
>
> 레스토랑을 생각해보세요. 주방장이 직접 재료도 사오고, 요리도 하고, 서빙까지 한다면?
> 손님이 많아지면 바로 터집니다.
>
> **역할 분리**가 핵심입니다: 재료 담당 / 요리 담당 / 서빙 담당

아래 두 코드를 비교해보세요:

\`\`\`python
# ❌ Bad: 모놀리식 (모든 것을 하나에서 처리)
# 문제점: 검색만 바꾸고 싶어도 전체를 배포해야 함
def answer(query):
    docs = vectorstore.search(query)  # 검색
    response = llm.generate(docs, query)  # 생성
    return response

# ✅ Good: 마이크로서비스 (역할별 분리)
# 장점: 검색 서비스만 독립적으로 수정/확장 가능
class RetrievalService:
    """검색만 담당 - 벡터 DB에서 관련 문서 찾기"""
    def search(self, query: str, filters: dict) -> List[Document]:
        pass

class GenerationService:
    """생성만 담당 - LLM으로 답변 만들기"""
    def generate(self, context: str, query: str) -> str:
        pass

class RAGOrchestrator:
    """지휘자 역할 - 전체 흐름 조율"""
    def answer(self, query: str):
        docs = self.retrieval.search(query)        # 1. 검색
        reranked = self.reranker.rerank(docs, query)  # 2. 재정렬
        response = self.generation.generate(reranked, query)  # 3. 생성
        return response
\`\`\`

**분리의 이점 3가지:**
| 이점 | 설명 | 예시 |
|------|------|------|
| 독립적 스케일링 | 검색 트래픽 ≠ 생성 트래픽 | 검색 서버만 10대로 늘리기 |
| 독립적 업데이트 | 검색 로직만 변경 가능 | 벡터 DB 바꿔도 생성 서비스 무관 |
| 장애 격리 | 하나 죽어도 나머지 동작 | 생성 서비스 장애 시 검색은 정상 |

---

### 원칙 2: 캐싱 전략 💾

> 💡 **왜 캐싱이 중요할까요?**
>
> 같은 질문이 100번 들어오면 100번 다 LLM API를 호출할 건가요?
> OpenAI API 비용이 어마어마해집니다!
>
> **캐싱 = 한 번 계산한 결과를 저장해뒀다가 재사용**

### 다층 캐싱 구조 (L1 → L2 → L3)

캐시도 **계층 구조**로 만듭니다. 마치 CPU 캐시처럼요:
- **L1 (인메모리)**: 가장 빠름, 용량 작음, 10초 유지
- **L2 (Redis)**: 빠름, 중간 용량, 5분 유지
- **L3 (DB)**: 느림, 대용량, 1일 유지

\`\`\`python
# 다층 캐싱 구조 예제
# "자주 묻는 질문은 메모리에, 가끔 묻는 질문은 Redis에, 드문 질문은 DB에"

class MultiLayerCache:
    def __init__(self):
        self.l1_cache = {}        # 인메모리 (10초) - 가장 빠름!
        self.l2_cache = Redis()   # Redis (5분) - 네트워크 1회
        self.l3_cache = PostgreSQL()  # DB (1일) - 디스크 접근

    def get(self, query: str):
        # 1단계: L1 체크 (메모리에 있으면 즉시 반환)
        if query in self.l1_cache:
            return self.l1_cache[query]  # ⚡ 0.001ms

        # 2단계: L2 체크 (Redis에서 찾기)
        cached = self.l2_cache.get(self.hash(query))
        if cached:
            self.l1_cache[query] = cached  # L1에도 저장
            return cached  # ⚡ ~1ms

        # 3단계: L3 체크 (DB에서 찾기)
        cached = self.l3_cache.get_exact(query)
        if cached:
            self.l2_cache.set(self.hash(query), cached)
            self.l1_cache[query] = cached
            return cached  # ⚡ ~10ms

        return None  # 캐시 미스 → 새로 계산 필요
\`\`\`

**무엇을 캐싱할까요?**
| 캐싱 대상 | 효과 | 예시 |
|----------|------|------|
| 쿼리 임베딩 | 임베딩 API 비용 절감 | "RAG란?" 임베딩 재사용 |
| 검색 결과 | 벡터 검색 시간 절감 | 동일 쿼리 → 동일 문서 |
| 최종 답변 | LLM API 비용 대폭 절감 | FAQ는 캐시에서 즉시 반환 |

**💰 비용 절감 효과 (캐시 히트율 50% 가정):**
\`\`\`
Before (캐싱 없음)     After (캐싱 적용)
─────────────────────────────────────
LLM API 비용 100%  →  50% (절반으로!)
검색 비용 100%     →  50%
평균 응답 시간 2초  →  0.2초 (캐시 히트 시)
\`\`\`

---

### 원칙 3: 비동기 처리 ⚡

> 💡 **왜 비동기가 필요할까요?**
>
> 라면 끓일 때 물 끓을 때까지 가만히 기다리나요?
> 물 올려놓고 → 재료 손질하고 → 그릇 준비하잖아요.
>
> **비동기 = 기다리는 동안 다른 일 하기**

### 병렬 처리로 응답 시간 단축

\`\`\`python
import asyncio

async def answer_query(query: str):
    # 🚀 Step 1: 임베딩 시작 (비동기로)
    embedding_task = asyncio.create_task(embed_query(query))

    # 임베딩 완료 대기
    query_embedding = await embedding_task

    # 🚀 Step 2: 여러 소스에서 "동시에" 검색 (이게 핵심!)
    search_tasks = [
        asyncio.create_task(search_vectordb(query_embedding)),   # 벡터 DB
        asyncio.create_task(search_keyword_index(query)),        # 키워드 검색
        asyncio.create_task(search_knowledge_graph(query)),      # 지식 그래프
    ]

    # 세 검색이 동시에 실행되고, 모두 끝날 때까지 대기
    results = await asyncio.gather(*search_tasks)

    # 🚀 Step 3: 결과 병합 및 재정렬
    merged = merge_results(results)
    reranked = await rerank(merged, query)

    # 🚀 Step 4: 스트리밍 생성 (한 글자씩 실시간 출력)
    async for chunk in generate_stream(reranked, query):
        yield chunk  # ChatGPT처럼 글자가 쭉쭉 나옴

# ⏱️ 응답 시간 비교
# ───────────────────────────────────────────────
# 동기 (순차 실행):
#   임베딩(0.3s) → 검색A(0.5s) → 검색B(0.4s) → 검색C(0.3s) → 생성(2s)
#   = 3.5초 😱
#
# 비동기 (병렬 실행):
#   임베딩(0.3s) → [검색A,B,C 동시](0.5s) → 생성(2s)
#   = 2.8초 ✅ (0.7초 단축!)
#
# 스트리밍 추가:
#   첫 토큰 0.8초 후 → 실시간 출력 (체감 훨씬 빠름!)
\`\`\`

---

### 원칙 4: 모니터링 & 관찰성 📊

> 💡 **왜 모니터링이 필수일까요?**
>
> "측정하지 않으면 개선할 수 없다" - 피터 드러커
>
> RAG 시스템은 여러 단계가 있어서 어디서 병목이 생기는지,
> 어디서 품질이 떨어지는지 모니터링 없이는 알 수 없습니다.

### 무엇을 측정해야 할까요?

**4가지 핵심 축:**

| 축 | 측정 항목 | 왜 중요한가 |
|----|----------|------------|
| ⏱️ 지연시간 | P50, P95, P99 응답 시간 | 사용자 체감 속도 |
| 🎯 품질 | 유사도 점수, 사용자 피드백 | 답변이 정확한가 |
| 💰 비용 | 토큰 사용량, API 호출 수 | 예산 관리 |
| 🖥️ 시스템 | 메모리, 에러율 | 안정성 |

\`\`\`python
from dataclasses import dataclass
from datetime import datetime
import logging

@dataclass
class RAGMetrics:
    """RAG 시스템의 모든 메트릭을 담는 클래스"""
    query_id: str
    timestamp: datetime

    # ⏱️ 지연시간 메트릭
    retrieval_latency_ms: float    # 검색에 걸린 시간
    num_docs_retrieved: int        # 검색된 문서 수
    top_similarity_score: float    # 가장 높은 유사도

    # 🎯 생성 메트릭
    generation_latency_ms: float   # LLM 생성에 걸린 시간
    input_tokens: int              # 입력 토큰 수
    output_tokens: int             # 출력 토큰 수

    # 👍 품질 메트릭 (사용자 피드백)
    user_feedback: Optional[int]   # 1-5점
    was_helpful: Optional[bool]    # 도움됐는가?

class RAGObserver:
    """RAG 시스템 모니터링 클래스"""
    def __init__(self):
        self.logger = logging.getLogger("rag")
        self.metrics_client = PrometheusClient()  # Grafana와 연동

    def log_query(self, metrics: RAGMetrics):
        # 📝 로깅 (디버깅용)
        self.logger.info(
            f"Query {metrics.query_id}: "
            f"검색={metrics.retrieval_latency_ms}ms, "
            f"생성={metrics.generation_latency_ms}ms"
        )

        # 📈 메트릭 수집 (대시보드용)
        self.metrics_client.histogram("rag_retrieval_latency", metrics.retrieval_latency_ms)
        self.metrics_client.histogram("rag_generation_latency", metrics.generation_latency_ms)

        # 🚨 알림 조건 체크
        if metrics.retrieval_latency_ms > 1000:
            self.alert("🐢 검색이 1초 이상 걸림!")

        if metrics.top_similarity_score < 0.5:
            self.alert("⚠️ 검색 품질 낮음 - 관련 문서 못 찾았을 수 있음")
\`\`\`

**핵심 모니터링 지표 체크리스트:**
\`\`\`
📊 운영팀이 매일 봐야 할 대시보드

1. ⏱️ 지연시간 (응답 느려지면 사용자 이탈)
   ├─ P50 응답 시간: 1초 이내 목표
   ├─ P95 응답 시간: 3초 이내 목표
   └─ 검색 vs 생성 시간 비율 (어디가 병목인지)

2. 🎯 품질 (답변이 이상하면 신뢰 하락)
   ├─ 평균 유사도 점수: 0.7 이상 유지
   ├─ 사용자 피드백 점수: 4.0/5.0 이상
   └─ "도움 안 됨" 비율: 10% 이하

3. 💰 비용 (예산 초과 방지)
   ├─ 일별 토큰 사용량 추이
   ├─ 임베딩 API 호출 수
   └─ 캐시 히트율: 50% 이상 목표

4. 🖥️ 시스템 (장애 예방)
   ├─ 벡터 DB 메모리: 80% 이하
   ├─ 에러율: 1% 이하
   └─ 인덱스 크기 증가율
\`\`\`

---

## 규모별 아키텍처 권장 📐

> 💡 **핵심 원칙: 작게 시작하고, 필요할 때 확장하세요!**
>
> 처음부터 대규모 아키텍처를 구축하면 비용만 낭비됩니다.
> 아래 가이드를 참고해서 현재 규모에 맞는 스택을 선택하세요.

### 🏠 소규모 (문서 <10K, 사용자 <100)

**적합한 경우**: MVP, PoC, 사내 도구, 개인 프로젝트

\`\`\`
📦 권장 스택
─────────────────────────────────────
벡터 DB    : Chroma (로컬, 무료)
LLM        : OpenAI API (gpt-4o-mini)
인프라      : 단일 서버 (t3.medium)
캐싱       : 인메모리 (dict)

💰 예상 비용: ~$50/월
⏱️ 구축 시간: 1-2일
\`\`\`

### 🏢 중규모 (문서 <100K, 사용자 <1K)

**적합한 경우**: B2B SaaS, 기업 내부 서비스, 스타트업 프로덕션

\`\`\`
📦 권장 스택
─────────────────────────────────────
벡터 DB    : Pinecone / Weaviate (관리형)
LLM        : OpenAI API + 응답 캐싱
인프라      : Kubernetes 2-3 노드
캐싱       : Redis (캐시 히트율 50%+ 목표)
모니터링    : Grafana + Prometheus

💰 예상 비용: ~$500/월
⏱️ 구축 시간: 1-2주
\`\`\`

### 🏭 대규모 (문서 >1M, 사용자 >10K)

**적합한 경우**: B2C 서비스, 대기업, 글로벌 서비스

\`\`\`
📦 권장 스택
─────────────────────────────────────
벡터 DB    : Milvus / Qdrant (셀프 호스팅)
LLM        : vLLM (오픈소스) + OpenAI 폴백
인프라      : Kubernetes 클러스터 + Auto-scaling
캐싱       : Redis Cluster + CDN
모니터링    : Full observability stack

💰 예상 비용: $5,000+/월
⏱️ 구축 시간: 1-3개월
\`\`\`

### 📊 규모별 비교 요약

| 구분 | 소규모 | 중규모 | 대규모 |
|------|--------|--------|--------|
| 문서 수 | <10K | <100K | >1M |
| 동시 사용자 | <100 | <1K | >10K |
| 벡터 DB | Chroma | Pinecone | Milvus |
| 월 비용 | ~$50 | ~$500 | $5,000+ |
| 구축 난이도 | ⭐ | ⭐⭐ | ⭐⭐⭐ |

**🎯 핵심 조언**: 대부분의 프로젝트는 **중규모**로 충분합니다!
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
      videoUrl: 'https://youtu.be/tAHJhLlfkpE',
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

## 전체 코드 (상세) - 파일별 구현

> 💡 **이 섹션의 목표**
>
> 위의 핵심 코드를 **실제 프로젝트 구조**로 분리해서 구현합니다.
> 각 파일이 **하나의 책임**만 갖도록 설계했습니다. (단일 책임 원칙)

### 1. 설정 관리 (config.py)

> 🎯 **이 파일의 역할**: 모든 설정을 한 곳에서 관리
>
> **왜 필요할까요?**
> - API 키, 모델명 등을 코드 여기저기 하드코딩하면 나중에 바꾸기 어려움
> - \`.env\` 파일로 환경별 설정 분리 (개발/스테이징/프로덕션)
> - \`pydantic-settings\`로 타입 안전성 + 자동 검증

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

### 2. 임베딩 서비스 (embeddings.py)

> 🎯 **이 파일의 역할**: 텍스트 → 벡터 변환
>
> **임베딩이란?**
> - 텍스트를 숫자 배열(벡터)로 변환하는 것
> - 예: "고양이" → [0.12, -0.34, 0.56, ...]
> - 비슷한 의미 = 비슷한 벡터 (유사도 검색의 핵심!)
>
> **이 서비스의 핵심 기능:**
> 1. **캐싱**: 같은 텍스트는 다시 API 호출 안 함 → 비용 절감
> 2. **배치 처리**: 여러 문서를 한 번에 임베딩 → 속도 향상

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

### 3. 검색 서비스 (retrieval.py)

> 🎯 **이 파일의 역할**: 질문과 관련된 문서 찾기
>
> **검색 서비스가 하는 일:**
> 1. 질문을 벡터로 변환 (임베딩 서비스 사용)
> 2. 벡터 DB에서 가장 비슷한 문서 찾기
> 3. 유사도 점수와 함께 반환
>
> **핵심 개념:**
> - \`top_k\`: 상위 몇 개 문서를 가져올지 (기본 5개)
> - \`similarity_threshold\`: 최소 유사도 기준 (0.7 = 70% 이상만)
> - \`hybrid_search\`: 벡터 검색 + 키워드 검색 조합 (더 정확함)

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

### 4. 생성 서비스 (generation.py)

> 🎯 **이 파일의 역할**: 검색된 문서를 바탕으로 답변 생성
>
> **생성 서비스가 하는 일:**
> 1. 검색된 문서들을 컨텍스트로 포매팅
> 2. 시스템 프롬프트 + 컨텍스트 + 질문을 LLM에 전달
> 3. LLM의 답변 반환 (스트리밍 지원)
>
> **핵심 포인트:**
> - \`system_prompt\`: LLM의 행동 규칙 정의 (환각 방지!)
> - \`_format_context\`: 문서를 LLM이 이해하기 좋게 정리
> - \`generate_stream\`: ChatGPT처럼 한 글자씩 실시간 출력

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

### 5. RAG 오케스트레이터 (rag_pipeline.py)

> 🎯 **이 파일의 역할**: 모든 서비스를 조율하는 지휘자
>
> **오케스트레이터가 하는 일:**
> 1. 검색 서비스 호출 → 관련 문서 가져오기
> 2. 생성 서비스 호출 → 답변 만들기
> 3. 메트릭 수집 → 성능 측정
> 4. 결과 포매팅 → 깔끔한 응답 반환
>
> **왜 분리할까요?**
> - 각 서비스를 독립적으로 테스트 가능
> - 나중에 검색 서비스만 바꾸기 쉬움 (예: Chroma → Pinecone)
> - 에러 처리를 한 곳에서 관리

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

---

### 6. 사용 예시 (main.py) 해설

> 🎯 **이 섹션의 목표**: 위에서 만든 모든 서비스를 조합해서 실제로 실행해보기
>
> **실행 흐름 한눈에 보기:**
> \`\`\`
> 1. RAGPipeline() 초기화
>      └→ 내부에서 RetrievalService, GenerationService 생성
>
> 2. index_documents() 호출
>      └→ 문서 → 임베딩 → Chroma DB 저장
>
> 3. query("RAG가 뭐야?") 호출
>      └→ 검색 → 생성 → RAGResponse 반환
>          ├─ answer: "RAG는 Retrieval-Augmented..."
>          ├─ sources: [문서1, 문서2, ...]
>          └─ metrics: {retrieval_time: 50ms, ...}
>
> 4. query_stream() 호출
>      └→ ChatGPT처럼 한 글자씩 실시간 출력
> \`\`\`
>
> **💡 팁**: 실제 프로덕션에서는 문서 인덱싱은 별도 스크립트로 분리하고,
> 쿼리 부분만 API 서버(FastAPI 등)로 만듭니다.

---

## 📋 전체 흐름 요약

> 💡 **이 RAG 시스템을 한 문장으로 설명하면?**
>
> "질문이 들어오면 → 관련 문서를 찾고 → 그 문서를 바탕으로 답변을 생성한다"

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                        RAG 파이프라인                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [사용자 질문] "RAG가 뭐야?"                                      │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────────────────────────────────────┐                  │
│  │ 1. EmbeddingService.embed_query()        │                  │
│  │    - 질문을 벡터로 변환                    │                  │
│  │    - 캐시 확인 후 없으면 OpenAI API 호출    │                  │
│  └──────────────────────────────────────────┘                  │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────────────────────────────────────┐                  │
│  │ 2. RetrievalService.search()             │                  │
│  │    - Chroma DB에서 유사 문서 검색          │                  │
│  │    - 유사도 임계값(0.7) 이상만 반환         │                  │
│  └──────────────────────────────────────────┘                  │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────────────────────────────────────┐                  │
│  │ 3. GenerationService.generate()          │                  │
│  │    - 검색된 문서를 컨텍스트로 포매팅        │                  │
│  │    - System Prompt + Context + 질문       │                  │
│  │    - LLM이 답변 생성                       │                  │
│  └──────────────────────────────────────────┘                  │
│       │                                                         │
│       ▼                                                         │
│  [RAGResponse]                                                  │
│    ├─ answer: "RAG는 Retrieval-Augmented Generation..."        │
│    ├─ sources: [{content, metadata, score}, ...]               │
│    └─ metrics: {retrieval_time_ms, generation_time_ms, ...}    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## ⚠️ Common Pitfalls (자주 하는 실수)

> 💡 **이 섹션의 목표**
>
> RAG를 처음 구현할 때 많이 하는 실수 3가지와 해결 방법을 알아봅니다.
> "아, 이거 나도 했었는데!" 하는 실수들이에요 😅

---

### 1. 🔴 [임베딩 불일치] 문서와 쿼리에 다른 모델 사용

> **비유**: 한국어 사전으로 번역한 글을 영어 사전으로 찾으려는 것과 같아요.
> 당연히 안 찾아지죠!

**증상**: 검색 결과가 이상하거나 관련 없는 문서만 반환
\`\`\`python
# ❌ 잘못된 예시 - 모델 불일치
doc_embedding = embed_with_ada002(doc)      # text-embedding-ada-002 (구형)
query_embedding = embed_with_3_small(query)  # text-embedding-3-small (신형) 💥

# 이렇게 되면:
# - "고양이" 문서 벡터: [0.1, 0.2, 0.3, ...]  (ada-002 기준)
# - "고양이" 쿼리 벡터: [0.5, -0.1, 0.8, ...] (3-small 기준)
# - 같은 단어인데 벡터가 완전 다름 → 유사도 = 거의 0 😱
\`\`\`
**왜 잘못되었나**: 다른 모델은 다른 벡터 공간 → 유사도 계산 무의미
\`\`\`python
# ✅ 올바른 예시 - 동일 모델 사용
embedding_model = "text-embedding-3-small"  # 하나만 정하고
doc_embedding = embed(doc, model=embedding_model)    # 문서도 이걸로
query_embedding = embed(query, model=embedding_model) # 쿼리도 이걸로
\`\`\`
**🎯 기억할 점**: 문서 인덱싱과 쿼리에 **항상 동일한** 임베딩 모델 사용!

---

### 2. 🔴 [컨텍스트 오버플로우] 검색 결과 너무 많이 넣기

> **비유**: 시험 볼 때 교과서 전체를 커닝페이퍼로 가져가면?
> 오히려 뭐가 어딨는지 못 찾아서 더 못 풀어요!

**증상**: 토큰 제한 에러, 비용 폭발, 답변 품질 저하
\`\`\`python
# ❌ 잘못된 예시 - 모든 검색 결과 포함
documents = retrieval.search(query, top_k=20)  # 20개 문서 다 가져와서
context = "\\n".join([d.content for d in documents])  # 전부 붙임 💥

# 결과:
# - 컨텍스트: 100,000+ 토큰 (비용 폭발!)
# - LLM: "토큰 제한 초과" 에러 또는
# - LLM: 너무 많은 정보에 혼란 → 답변 품질 저하
\`\`\`
**왜 잘못되었나**: LLM 컨텍스트 윈도우 초과, 불필요한 비용
\`\`\`python
# ✅ 올바른 예시 - top_k 제한 + 토큰 카운팅
MAX_CONTEXT_TOKENS = 4000  # 컨텍스트는 전체 윈도우의 50% 이하로!

documents = retrieval.search(query, top_k=5)  # 상위 5개만
context = ""
for doc in documents:
    if count_tokens(context + doc.content) < MAX_CONTEXT_TOKENS:
        context += doc.content + "\\n---\\n"
    else:
        break  # 토큰 한도 도달하면 멈춤
\`\`\`
**🎯 기억할 점**: top_k는 **3-7개**, 컨텍스트는 전체 윈도우의 **50% 이하**

---

### 3. 🔴 [캐시 무효화] 문서 업데이트 후 캐시 안 지움

> **비유**: 새 책을 도서관에 넣었는데 카탈로그를 안 업데이트하면?
> 검색해도 안 나오죠!

**증상**: 새 문서를 추가했는데 검색 결과에 안 나옴
\`\`\`python
# ❌ 잘못된 예시 - 캐시 무효화 누락
def add_document(doc):
    embed_and_store(doc)  # 새 문서 저장 ✅
    # 캐시는 그대로 → 이전 검색 결과가 계속 반환됨 💥

# 사용자: "새로 추가한 문서 관련 질문인데 왜 안 나와요?"
# 개발자: "분명히 추가했는데... 왜지?" (😱 캐시 때문!)
\`\`\`
**왜 잘못되었나**: 캐시된 검색 결과가 새 문서를 반영하지 않음
\`\`\`python
# ✅ 올바른 예시 - 문서 변경 시 캐시 무효화
def add_document(doc):
    embed_and_store(doc)
    cache.clear()  # 방법 1: 전체 캐시 삭제 (간단)

    # 방법 2: 관련 캐시만 삭제 (더 효율적)
    # cache.delete_by_pattern("search:*")

    # 방법 3: TTL 기반 자동 만료 (설정만 잘 하면 편함)
    # cache.set(key, value, ttl=300)  # 5분 후 자동 만료
\`\`\`
**🎯 기억할 점**: 문서 추가/수정/삭제 시 **반드시** 관련 캐시 무효화!
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
