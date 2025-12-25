# FDE Academy v3.6 커리큘럼 구조

> **버전**: v3.6 (AI-Native, 단순화)
> **작성일**: 2025-12-25
> **컨셉**: "Day 1부터 AI와 함께 일하는 Forward Deployed Engineer"

---

## 핵심 변경 (v3.5 → v3.6)

| 항목 | v3.5 | v3.6 | 변경 이유 |
|------|------|------|----------|
| **Phase 5** | 1.5개월 | **2개월** | AI Agent/MCP는 급변 분야, 충분한 시간 필요 |
| **구조** | 하이브리드 복잡 | **Core → Specialization 단순화** | 마케팅 메시지 명확화 |
| **총 기간** | 12개월 | **12.5개월** | Phase 5 확장으로 +0.5개월 |

---

## 전체 구조 (단순화)

```
┌─────────────────────────────────────────────────────────────┐
│                     CORE (6개월, 순차 필수)                  │
│                                                             │
│    Phase 1 ────────▶ Phase 2 ────────▶ Phase 3             │
│    (2개월)           (2개월)           (2개월)              │
│                                                             │
│    데이터            분석 &           지식 그래프           │
│    엔지니어링         컨설팅           & GraphRAG           │
│    + AI 도구         + AI 분석                              │
│                                                             │
│    포트폴리오 #1      포트폴리오 #2     포트폴리오 #3        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │  Core 완료!    │
                   │  (6개월)       │
                   └────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   옵션 A     │   │   옵션 B     │   │   옵션 C     │
│  취업 준비   │   │  클라우드    │   │  AI Agent   │
│  (Phase 6)   │   │  (Phase 4)   │   │  (Phase 5)   │
│  2.5개월     │   │  2개월       │   │  2개월       │
└──────────────┘   └──────────────┘   └──────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ▼
                   ┌────────────────┐
                   │  Phase 6      │
                   │  캡스톤       │
                   │  (2.5개월)    │
                   └────────────────┘
```

---

## Phase별 상세

### CORE TRACK (6개월, 순차 필수)

#### Phase 1: 데이터 엔지니어링 + AI 도구 (2개월)

| Month | 주제 | AI 통합 |
|-------|------|---------|
| 1 | Python & SQL 심화 | Copilot/Claude로 코드 작성 |
| 2 | Spark & 파이프라인 | AI로 디버깅, 자연어→SQL |

**핵심 내용:**
- Python 심화 (비동기, 데코레이터, 타입 힌트)
- SQL 심화 (윈도우 함수, CTE, 최적화)
- Docker 기초
- dbt (Modern Data Stack)
- Spark & Airflow
- **AI 코딩 도구 활용** (Day 1부터)

**포트폴리오 #1:** E2E 데이터 파이프라인 (Spark + dbt + Airflow)

---

#### Phase 2: 데이터 분석 & AI 분석 (2개월)

| Month | 주제 | AI 통합 |
|-------|------|---------|
| 3 | EDA, 시각화, 통계 | AI로 인사이트 추출 |
| 4 | 비즈니스 분석, 컨설팅 | LLM으로 리포트 생성 |

**핵심 내용:**
- Pandas & Visualization 심화
- 통계 & A/B 테스트
- 비즈니스 분석 프레임워크
- AutoML (PyCaret)
- **LLM 기반 분석 자동화**

**포트폴리오 #2:** AI-assisted 데이터 분석 & 컨설팅 리포트

---

#### Phase 3: 지식 그래프 & GraphRAG (2개월 = 8주)

| Month | 주제 | 핵심 내용 |
|-------|------|----------|
| 5 | Neo4j & Ontology | 그래프 DB + **Ontology 설계 철학** |
| 6 | GraphRAG & 프로젝트 | Entity Resolution + **GraphRAG 통합** |

**Week별 상세:**

| Week | 주제 | 내용 |
|------|------|------|
| 1 | 그래프 이론 & Neo4j 입문 | Ontology vs KG vs Graph DB, Property Graph, Cypher CRUD |
| 2 | Cypher 심화 & 데이터 모델링 | Object Type 설계, 좋은/나쁜 스키마, APOC |
| 3 | 그래프 알고리즘 | PageRank, Louvain, Jaccard, 경로 탐색 |
| 4 | Entity Resolution & Python | 중복 탐지, py2neo, NetworkX |
| 5 | RAG 기초 | 임베딩, 벡터 검색, LangChain 기초 |
| 6 | GraphRAG | KG + RAG 통합, 하이브리드 검색 |
| 7 | 자연어 → Cypher | LLM으로 Cypher 생성, Text2Cypher |
| 8 | 프로젝트 | 도메인 KG + GraphRAG 시스템 |

**포트폴리오 #3:** 도메인 Knowledge Graph + GraphRAG 시스템

---

### SPECIALIZATION (Core 완료 후 선택)

#### Phase 4: 클라우드 & AI 인프라 (2개월)

| Month | 주제 | AI 인프라 |
|-------|------|----------|
| 7 | AWS, Terraform | SageMaker 소개 |
| 8 | K8s, CI/CD | LLM 서빙 (vLLM), 벡터 DB |

**핵심 내용:**
- AWS Solutions Architect 수준
- Terraform (IaC)
- Kubernetes & 컨테이너 오케스트레이션
- **AI 인프라:** 벡터 DB 운영, LLM 배포, LLMOps

**포트폴리오 #4:** 클라우드 AI 인프라 (K8s + LLM 서빙)

---

#### Phase 5: AI Agent & 자동화 (2개월) ← v3.5에서 복원

| Week | 주제 |
|------|------|
| 1-2 | AI Agent 아키텍처, Tool Use |
| 3-4 | MCP (Model Context Protocol) |
| 5-6 | 멀티에이전트, 워크플로우 자동화 |
| 7-8 | 프로젝트 |

**핵심 내용:**
- AI Agent 설계 패턴
- Function Calling & Tool Use
- MCP 활용
- 멀티에이전트 시스템
- 비즈니스 워크플로우 자동화

**포트폴리오 #5:** AI Agent 기반 자동화 시스템

---

### CAPSTONE (Core 완료 필수)

#### Phase 6: 산업별 프로젝트 & 취업 (2.5개월)

| Week | 주제 |
|------|------|
| 1-4 | 산업별 AI 솔루션 프로젝트 |
| 5-6 | 포트폴리오 통합 & 정제 |
| 7-8 | 이력서, 모의 면접 |
| 9-10 | 취업 지원, 네트워킹 |

**산업 도메인:**
- 금융 (Fraud Detection, Risk)
- 헬스케어 (Clinical NLP)
- 제조 (Predictive Maintenance)
- 리테일 (Recommendation)

**포트폴리오 #6:** 캡스톤 프로젝트 (전체 기술 통합)

---

## 수강 경로

### 경로 1: Full Course (12.5개월)
```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
(Core 6개월)         (Specialization 4개월)  (Capstone 2.5개월)
```
**포트폴리오:** 6개

### 경로 2: Core + Capstone (8.5개월)
```
Phase 1 → Phase 2 → Phase 3 → Phase 6
(Core 6개월)                   (Capstone 2.5개월)
```
**포트폴리오:** 4개 (빠른 취업 목표)

### 경로 3: Core Only (6개월)
```
Phase 1 → Phase 2 → Phase 3
(Core 6개월)
```
**포트폴리오:** 3개 (기초 완성)

### 경로 4: Core + Cloud (8개월)
```
Phase 1 → Phase 2 → Phase 3 → Phase 4
(Core 6개월)                   (클라우드 2개월)
```
**포트폴리오:** 4개 (인프라 특화)

### 경로 5: Core + AI Agent (8개월)
```
Phase 1 → Phase 2 → Phase 3 → Phase 5
(Core 6개월)                   (AI Agent 2개월)
```
**포트폴리오:** 4개 (AI 특화)

---

## 기간 요약

| Phase | 기간 | 누적 |
|-------|------|------|
| Phase 1 | 2개월 | 2개월 |
| Phase 2 | 2개월 | 4개월 |
| Phase 3 | 2개월 | **6개월 (Core 완료)** |
| Phase 4 | 2개월 | 8개월 |
| Phase 5 | 2개월 | 8개월 |
| Phase 6 | 2.5개월 | 10.5-12.5개월 |

---

## 다음 작업

### 구조 확정 ✅
- [x] v3.6 전체 구조 확정
- [x] Phase 5 2개월 복원
- [x] Core → Specialization 단순화

### Phase별 상세 설계
- [ ] Phase 3 v3.6 Week별 상세 (8주)
- [ ] 기존 graph-intro.ts → Week 1 매핑 확인
- [ ] Week 5-6 RAG 콘텐츠 설계
- [ ] Week 7 Text2Cypher 콘텐츠 설계

---

## 마케팅 메시지

### 단순화된 슬로건
```
"6개월 Core → 선택 Specialization"
"AI-Native Forward Deployed Engineer"
```

### 핵심 메시지
1. **Core 6개월**: 데이터 엔지니어링 + 분석 + Knowledge Graph
2. **Specialization 선택**: 클라우드 OR AI Agent OR 바로 취업
3. **AI 통합**: Day 1부터 Copilot/Claude와 함께

---

*FDE Academy v3.6 - 2025-12-25*
