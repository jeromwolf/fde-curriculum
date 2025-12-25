# FDE Academy v3.6 전체 커리큘럼

> **버전**: v3.6 Final
> **업데이트**: 2025-12-25
> **컨셉**: "Day 1부터 AI와 함께 일하는 Forward Deployed Engineer"

---

## 전체 구조

```
┌─────────────────────────────────────────────────────────────┐
│                     CORE (6개월, 순차 필수)                  │
│                                                             │
│    Phase 1 ────────▶ Phase 2 ────────▶ Phase 3             │
│    (2개월)           (2개월)           (2개월)              │
│                                                             │
│    데이터            분석 &           지식 그래프           │
│    엔지니어링         컨설팅           & GraphRAG           │
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
│  클라우드    │   │  AI Agent   │   │   바로      │
│  (Phase 4)   │   │  (Phase 5)   │   │   취업      │
│  2개월       │   │  2개월       │   │   준비      │
└──────────────┘   └──────────────┘   └──────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │  Phase 6      │
                   │  캡스톤 & 취업 │
                   │  (2개월)       │
                   └────────────────┘
```

---

## Phase 1: 데이터 엔지니어링 기초 (2개월)

### Month 1: Python & SQL 심화

| Week | 주제 | 토픽 | 실습 |
|------|------|------|------|
| 1 | Python 심화 + Docker 기초 | 제너레이터, 데코레이터, Type Hints, **Docker 기초** | 로깅 시스템 + 컨테이너화 |
| 2 | pandas & 데이터 처리 | 대용량 chunk 처리, MultiIndex, Polars | 1GB+ CSV 파이프라인 |
| 3 | SQL 심화 | 윈도우 함수, CTE, 실행 계획, 트랜잭션 | 분석 쿼리 20개 |
| 4 | 데이터 모델링 | 정규화, Star/Snowflake, SCD Type 1/2/3 | 이커머스 DW 설계 |

**AI 도구**: GitHub Copilot으로 코드 작성, Claude로 디버깅

### Month 2: Spark & 파이프라인

| Week | 주제 | 토픽 | 실습 |
|------|------|------|------|
| 1 | Apache Spark | Driver/Executor, DataFrame API, PySpark UDF | 로그 분석 파이프라인 |
| 2 | Spark 심화 & Delta Lake | Structured Streaming, ACID, Time Travel | 실시간 처리 + Delta |
| 3 | Airflow & **dbt** | DAG, Operator, **dbt models/tests/docs** | ETL + dbt 레이어 |
| 4 | E2E 파이프라인 프로젝트 | 아키텍처, Great Expectations, 모니터링 | **포트폴리오 #1** |

**포트폴리오 #1**: E2E 데이터 파이프라인 (Spark + dbt + Airflow)

---

## Phase 2: 데이터 분석 & 컨설팅 (2개월)

### Month 3: 문제 정의 & EDA

| Week | 주제 | 토픽 | 실습 |
|------|------|------|------|
| 1 | 비즈니스 문제 정의 & EDA | 5 Whys, MECE, 통계 기초, 시각화 | 문제 정의서 + EDA 리포트 |
| 2 | 데이터 이해 & 전처리 | 데이터 품질 6차원, 결측치/이상치 처리 | 데이터 정제 파이프라인 |
| 3 | Feature Engineering | 수치형/범주형/시간 피처, TF-IDF | Kaggle 피처 엔지니어링 |
| 4 | Feature Selection & 차원 축소 | Filter/Wrapper/Embedded, PCA, t-SNE | 고차원 데이터 시각화 |

**AI 도구**: Claude/GPT로 데이터 패턴 해석, 인사이트 추출

### Month 4: ML 모델링 & 커뮤니케이션

| Week | 주제 | 토픽 | 실습 |
|------|------|------|------|
| 1 | 가설 기반 분석 & 분류/회귀 | 상관관계 vs 인과관계, XGBoost, LightGBM | 이탈 예측 모델 |
| 2 | 클러스터링 & 세그멘테이션 | K-means, RFM, Pyramid Principle | 세그멘테이션 + 전략 |
| 3 | 이상 탐지 | Z-score, Isolation Forest, Autoencoder | 금융 사기 탐지 |
| 4 | 시계열 분석 & 발표 | Prophet, 수요 예측, 데이터 스토리텔링 | **포트폴리오 #2** |

**AI 도구**: LLM으로 리포트 초안 생성, 경영진 발표 자료

**포트폴리오 #2**: AI-assisted 데이터 분석 & 컨설팅 리포트

**복선**: "구조화된 지식으로 더 나은 분석을 하려면? → Phase 3 Knowledge Graph"

---

## Phase 3: 지식 그래프 & GraphRAG (2개월 = 8주)

### Month 5: Neo4j & Ontology

| Week | 주제 | 토픽 | 실습 |
|------|------|------|------|
| 1 | 그래프 이론 & Neo4j 입문 | **Ontology vs KG vs Graph DB**, Property Graph, Cypher CRUD | Neo4j 환경 + 소셜 네트워크 |
| 2 | Cypher 심화 & 데이터 모델링 | WITH, APOC, 서브쿼리, 스키마 설계 | 이커머스 KG 구축 |
| 3 | 그래프 알고리즘 | PageRank, Louvain, Jaccard, Dijkstra | 인플루언서 분석 |
| 4 | Entity Resolution & Python | 중복 탐지, py2neo, NetworkX, PyVis | 기업 KG + 시각화 |

### Month 6: GraphRAG & 프로젝트

| Week | 주제 | 토픽 | 실습 |
|------|------|------|------|
| 1 | RAG 기초 | 임베딩, 벡터 DB (Chroma, Pinecone), 청킹 | 문서 Q&A 시스템 |
| 2 | GraphRAG | KG + RAG 통합, 하이브리드 검색, 멀티홉 추론 | GraphRAG 챗봇 |
| 3 | 자연어 → Cypher | LLM Cypher 생성, 스키마 프롬프팅, 쿼리 검증 | Text2Cypher 인터페이스 |
| 4 | 도메인 KG 프로젝트 | 300+ 노드, 2+ 소스, E2E 파이프라인, Streamlit | **포트폴리오 #3** |

**포트폴리오 #3**: 도메인 Knowledge Graph + GraphRAG 시스템

---

## Phase 4: 클라우드 & AI 인프라 (2개월) - Specialization

### Month 7: AWS 핵심 서비스

| Week | 주제 | 토픽 | 실습 |
|------|------|------|------|
| 1 | 컴퓨팅 & 네트워킹 | EC2, VPC, ALB/NLB, Auto Scaling | 고가용성 웹 아키텍처 |
| 2 | 스토리지 & 데이터베이스 | S3, RDS/Aurora, DynamoDB, ElastiCache | 데이터 티어 아키텍처 |
| 3 | 서버리스 & 이벤트 | Lambda, API Gateway, Step Functions | 서버리스 데이터 처리 |
| 4 | IaC & 모니터링 | Terraform, CloudWatch, IAM, **AWS SAA 준비** | Terraform 인프라 코드화 |

### Month 8: 컨테이너 & Kubernetes

| Week | 주제 | 토픽 | 실습 |
|------|------|------|------|
| 1 | Docker 심화 | Multi-stage, Compose, 이미지 최적화 | 마이크로서비스 컨테이너화 |
| 2 | Kubernetes 기초 | Control Plane, Pod, Deployment, Service | 로컬 K8s 클러스터 |
| 3 | Kubernetes 심화 | PV/PVC, Ingress, Helm, HPA | Helm 차트 작성 |
| 4 | 프로덕션 K8s & **AI 인프라** | EKS/GKE, ArgoCD, **vLLM, 벡터 DB 운영** | **포트폴리오 #4** |

**포트폴리오 #4**: 클라우드 AI 인프라 (K8s + LLM 서빙)

**자격증**: AWS Solutions Architect Associate

---

## Phase 5: GenAI & 에이전트 (2개월) - Specialization

### Month 9: LLM & RAG

| Week | 주제 | 토픽 | 실습 |
|------|------|------|------|
| 1 | LLM 기초 | Transformer, 토큰화, GPT/Claude/Gemini, 비용 관리 | 다양한 LLM API 실험 |
| 2 | 프롬프트 엔지니어링 | Zero-shot, Few-shot, CoT, ToT, 가드레일 | 프롬프트 라이브러리 |
| 3 | 임베딩 & 벡터 DB | OpenAI/Cohere 임베딩, Pinecone/Weaviate, HNSW | 시맨틱 검색 엔진 |
| 4 | RAG 시스템 | 청킹 전략, Re-ranking, Query Expansion, 평가 | 문서 Q&A RAG |

### Month 10: AI 에이전트 & 프로덕션

| Week | 주제 | 토픽 | 실습 |
|------|------|------|------|
| 1 | AI 에이전트 기초 | Function Calling, ReAct, LangGraph | 도구 사용 에이전트 |
| 2 | 고급 에이전트 & **MCP** | 멀티 에이전트, **MCP 아키텍처, MCP 서버 구축** | **MCP 기반 도구 통합** |
| 3 | 프로덕션 배포 | FastAPI, Semantic 캐시, LangSmith, Rate limiting | RAG API 서버 배포 |
| 4 | GenAI 프로젝트 | RAG + Agent 통합, A/B 테스트, 평가 | **포트폴리오 #5** |

**포트폴리오 #5**: AI Agent 기반 자동화 시스템 (MCP 포함)

---

## Phase 6: 산업별 프로젝트 & 취업 (2개월) - Capstone

### Month 11: 도메인 심화 & 캡스톤

| Week | 주제 | 토픽 | 실습 |
|------|------|------|------|
| 1 | 도메인 선택 | 금융(사기탐지), 의료(FHIR), 제조(예지정비), 사이버보안(ATT&CK) | 도메인 리서치 |
| 2 | 도메인 심화 | 산업 표준, 규제, 실무 사례 | 도메인 분석 리포트 |
| 3 | 캡스톤 (1) | 문제 정의, 데이터 파이프라인, KG/ML 모델 | 백엔드 개발 |
| 4 | 캡스톤 (2) | AI 기능 통합, UI/대시보드, 테스트 | **포트폴리오 #6** |

### Month 12: 취업 준비

| Week | 주제 | 토픽 | 실습 |
|------|------|------|------|
| 1 | 포트폴리오 완성 | GitHub README, 기술 블로그, LinkedIn, 5분 데모 영상 | 포트폴리오 사이트 |
| 2 | 기술 면접 준비 | SQL/Spark, ML/AI, 시스템 디자인, LeetCode | 모의 기술 면접 3회 |
| 3 | 행동 면접 & 지원 | STAR 기법, 자기소개, 이력서/커버레터 | 실제 지원 시작 |
| 4 | 최종 준비 & 수료 | 모의 면접, 연봉 협상, 네트워킹 | **취업!** |

**포트폴리오 #6**: 캡스톤 프로젝트 (전체 기술 통합)

---

## 수강 경로

| 경로 | Phase | 기간 | 포트폴리오 | 목표 |
|------|-------|------|-----------|------|
| **Full Course** | 1→2→3→4→5→6 | 12개월 | 6개 | 완전체 FDE |
| **Core + Capstone** | 1→2→3→6 | 8개월 | 4개 | 빠른 취업 |
| **Core Only** | 1→2→3 | 6개월 | 3개 | 기초 완성 |
| **Core + Cloud** | 1→2→3→4 | 8개월 | 4개 | 인프라 특화 |
| **Core + AI** | 1→2→3→5 | 8개월 | 4개 | AI 특화 |

---

## 기간 요약

| Phase | 주제 | 기간 | 누적 |
|-------|------|------|------|
| Phase 1 | 데이터 엔지니어링 | 2개월 | 2개월 |
| Phase 2 | 분석 & 컨설팅 | 2개월 | 4개월 |
| Phase 3 | 지식 그래프 & GraphRAG | 2개월 | **6개월 (Core 완료)** |
| Phase 4 | 클라우드 & AI 인프라 | 2개월 | 8개월 |
| Phase 5 | GenAI & 에이전트 | 2개월 | 8개월 |
| Phase 6 | 캡스톤 & 취업 | 2개월 | 10-12개월 |

---

## 포트폴리오 로드맵

| # | 프로젝트 | Phase | 기술 스택 |
|---|----------|-------|----------|
| 1 | E2E 데이터 파이프라인 | 1 | Python, Spark, dbt, Airflow, Delta Lake |
| 2 | AI-assisted 분석 리포트 | 2 | pandas, XGBoost, LLM, 경영진 발표 |
| 3 | 도메인 KG + GraphRAG | 3 | Neo4j, Cypher, LangChain, Streamlit |
| 4 | 클라우드 AI 인프라 | 4 | AWS, Terraform, K8s, vLLM |
| 5 | AI Agent 자동화 시스템 | 5 | RAG, MCP, LangGraph, FastAPI |
| 6 | 캡스톤 (도메인 특화) | 6 | 전체 기술 통합 |

---

## 자격증

| 자격증 | Phase | 비용 |
|--------|-------|------|
| Neo4j Certified Professional | 3 | 무료 |
| AWS Solutions Architect Associate | 4 | $150 |

---

## AI-Native 학습

| 도구 | 용도 |
|------|------|
| GitHub Copilot | 코드 자동완성, 리팩토링, 테스트 생성 |
| Claude / ChatGPT | 개념 설명, 디버깅, 아키텍처 설계 |
| Cursor / Windsurf | AI 통합 IDE |

---

## 주요 변경 (v3.5 → v3.6)

| 항목 | 변경 내용 |
|------|----------|
| Phase 1 | Docker 기초, dbt 추가 |
| Phase 3 | 6주 → 8주 확장, Ontology 개념 명시 |
| Phase 4 | AI 인프라 (vLLM, 벡터 DB) 추가 |
| Phase 5 | MCP (Model Context Protocol) 추가 |
| 전체 | AI-Native 학습 방식 통합 |

---

*FDE Academy v3.6 Final - 2025-12-25*
