# FDE Academy 커리큘럼 자료조사 (2024-2025)

> 조사일: 2025-12-04
> 버전: v2.0 커리큘럼 기준

---

## Phase 2: 데이터 분석 & 마이닝 (NEW)

### 1. Kaggle Feature Engineering Best Practices

**핵심 기법 (2024-2025 우승 솔루션 기준)**:

| 기법 | 설명 | 효과 |
|------|------|------|
| **Groupby Aggregations** | `groupby(COL1)[COL2].agg(STAT)` | 가장 강력한 피처 생성 기법 |
| **GPU 가속 (cuDF)** | NVIDIA cuDF-pandas로 10,000+ 피처 빠르게 테스트 | 1위 달성 (배낭 가격 예측) |
| **Stacking** | 3단계 모델 앙상블 | April 2025 Playground 1위 |
| **Pseudo-labeling** | 라벨 없는 데이터로 모델 강화 | 일반화 성능 향상 |

**Grandmaster 팁**:
- 토론 포럼을 논문처럼 읽어라 (데이터 누수 힌트, 창의적 피처 아이디어)
- Tree-based 모델 (XGBoost, LightGBM)은 피처 엔지니어링 부담 적음
- 적은 피처가 더 좋은 일반화 (Titanic: 5개 피처 80% vs 15개 피처 75%)

**출처**:
- [NVIDIA Grandmaster Pro Tip](https://developer.nvidia.com/blog/grandmaster-pro-tip-winning-first-place-in-kaggle-competition-with-feature-engineering-using-nvidia-cudf-pandas/)
- [Kaggle Feature Engineering Course](https://www.kaggle.com/learn/feature-engineering)

---

### 2. 이상탐지 (Anomaly Detection) 실무 사례

**금융 사기 탐지**:
| 기업 | 기술 | 성과 |
|------|------|------|
| **Mastercard** | Decision Intelligence | 연 1,600억 트랜잭션 분석, 50ms 이내, 탐지율 300% 향상, 오탐 85% 감소 |
| **PayPal** | Isolation Forest | 수백만 사용자 보호 |
| 금융 전반 | AI 이상탐지 | 미탐지 사기 67% 감소 |

**제조 불량 탐지**:
| 분야 | 기술 | 성과 |
|------|------|------|
| 예측 정비 | Autoencoder | 다운타임 40% 감소 |
| 근본 원인 분석 | AI (Siemens) | 문제 해결 시간 45% 단축 |

**시장 규모**:
- 제조 AI 시장: $5.94B (2024) → $231B (2034 예상)
- 이상탐지 시장: $10.5B (2035 예상), CAGR 12.48%

**출처**:
- [MentorMate - Anomaly Detection in Manufacturing](https://mentormate.com/blog/anomaly-detection-use-cases-and-benefits-in-manufacturing/)
- [IBM - Anomaly Detection](https://www.ibm.com/think/topics/anomaly-detection)

---

### 3. 시계열 예측 도구 비교

| 도구 | 출시 | 특징 | 추천 사용 사례 |
|------|------|------|---------------|
| **Prophet** | 2017 | Stan 기반, 업계 표준 | 1-2개 시계열, 간단한 예측 |
| **NeuralProphet** | 2020 | PyTorch 기반, AR-Net 추가 | Prophet보다 빠르고 정확, 대규모 처리 |
| **TimeGPT** | 2023 | Foundation Model, Zero-shot | 빠른 베이스라인, 다양한 데이터셋 |

**성능 비교**:
- NeuralProphet이 대부분 케이스에서 낮은(좋은) MAPE
- TimeGPT는 벤치마크 Top 3 (단, Nixtla 자체 벤치마크)
- 100,000개 시계열 (M5 대회 규모)에서 Prophet은 비현실적

**2025 추천**:
- 빠른 시작 → TimeGPT (zero-shot)
- 커스터마이징 필요 → NeuralProphet
- 전통적 접근 → ARIMA + ETS + CES 앙상블이 Amazon 모델보다 우수

**출처**:
- [Meta AI Blog - NeuralProphet](https://ai.meta.com/blog/neuralprophet-the-neural-evolution-of-facebooks-prophet/)
- [Analytics Vidhya - TimeGPT](https://www.analyticsvidhya.com/blog/2024/02/timegpt-revolutionizing-time-series-forecasting/)

---

## Phase 5: GenAI & Agents

### 1. LangChain vs LlamaIndex 비교 (2025)

| 항목 | LangChain | LlamaIndex |
|------|-----------|------------|
| **강점** | 복잡한 워크플로우 오케스트레이션 | 검색 & 데이터 연결 |
| **학습 곡선** | 가파름 (유연한 만큼 복잡) | 완만 (빠른 시작) |
| **2025 업데이트** | LangGraph로 워크플로우 제어 강화 | 검색 정확도 35% 향상 |
| **가격** | 오픈소스 (MIT), LangSmith 유료 | 사용량 기반 (무료 1,000 크레딧/일) |

**추천**:
- 검색 중심 RAG → **LlamaIndex**
- 복잡한 AI 파이프라인 → **LangChain/LangGraph**
- 엔터프라이즈 RAG → **둘 다 조합**

**출처**:
- [IBM - LlamaIndex vs LangChain](https://www.ibm.com/think/topics/llamaindex-vs-langchain)
- [Latenode - Complete RAG Framework Comparison](https://latenode.com/blog/langchain-vs-llamaindex-2025-complete-rag-framework-comparison)

---

### 2. Microsoft GraphRAG

**핵심 개념**:
- LLM으로 Knowledge Graph 자동 생성 → RAG 성능 향상
- 기존 RAG가 실패하는 "점 연결" 질문에 강함

**동작 방식**:
1. 텍스트를 TextUnit으로 분할
2. Entity, Relationship, Claim 추출
3. Leiden 알고리즘으로 커뮤니티 클러스터링
4. 커뮤니티별 요약 생성

**쿼리 모드**:
| 모드 | 용도 |
|------|------|
| **Global Search** | 전체 데이터에 대한 종합적 질문 |
| **Local Search** | 특정 엔티티 중심 질문 |

**주의사항**:
- 인덱싱 비용 높음 (데모만 해도 수 달러)
- LLM 의존으로 온톨로지 제어 어려움
- 확장성/비용 문제

**출처**:
- [Microsoft Research - GraphRAG](https://www.microsoft.com/en-us/research/blog/graphrag-unlocking-llm-discovery-on-narrative-private-data/)
- [GitHub - microsoft/graphrag](https://github.com/microsoft/graphrag)

---

### 3. AI Agent 프레임워크 비교

| 프레임워크 | 특징 | 추천 사용 사례 |
|-----------|------|---------------|
| **CrewAI** | 빠른 프로토타이핑, 역할 기반 | 스타트업, 빠른 MVP |
| **AutoGen** | 엔터프라이즈급, MS 생태계 | 기업 환경, 복잡한 문제 |
| **LangGraph** | 상태 관리, 복잡한 워크플로우 | 정밀한 제어 필요 시 |

**CrewAI**:
- 2계층 아키텍처: Crews (동적 협업) + Flows (결정적 오케스트레이션)
- 가장 빠른 컨셉→구현 경로

**AutoGen (Microsoft)**:
- Core (이벤트 기반) + AgentChat (대화형)
- 다양한 LLM 조합 가능 (OpenAI + Claude)
- 고급 에러 핸들링, 로깅

**출처**:
- [Analytics Vidhya - Top 7 AI Agent Frameworks](https://www.analyticsvidhya.com/blog/2024/07/ai-agent-frameworks/)
- [Datagrom - LangGraph vs AutoGen vs CrewAI](https://www.datagrom.com/data-science-machine-learning-ai-blog/langgraph-vs-autogen-vs-crewai-comparison-agentic-ai-frameworks)

---

### 4. Model Context Protocol (MCP) - Anthropic

**핵심 개념**:
- AI 어시스턴트를 데이터 소스/도구에 연결하는 오픈 표준
- "AI를 위한 USB-C 포트"

**지원 현황 (2025)**:
| 기업 | 상태 |
|------|------|
| Anthropic | 창시자, Claude Desktop/API 지원 |
| OpenAI | 2025년 3월 공식 채택 (ChatGPT, Agents SDK) |
| Google DeepMind | 2025년 4월 Gemini 지원 확인 |

**공식 MCP 서버** (Anthropic 제공):
- Google Drive, Slack, GitHub, Git
- Postgres, Puppeteer, Stripe

**보안 고려사항** (2025년 4월 분석):
- 프롬프트 인젝션 위험
- 도구 조합으로 파일 유출 가능
- 유사 도구로 신뢰 도구 대체 가능

**출처**:
- [Anthropic - Introducing MCP](https://www.anthropic.com/news/model-context-protocol)
- [Claude Docs - MCP](https://docs.anthropic.com/en/docs/build-with-claude/mcp)

---

## Phase 1: 데이터 엔지니어링

### Spark vs Polars 벤치마크 (2024-2025)

| 규모 | 추천 도구 | 이유 |
|------|----------|------|
| **10GB 이하** | Polars, DuckDB | 단일 머신에서 10배+ 빠름 |
| **10GB-1TB** | Polars (주의 필요) | 아직 대규모에서 불안정할 수 있음 |
| **1TB+** | Spark, Dask | 분산 처리 필수 |

**핵심 인사이트**:
- Spark는 사실상 업계 표준이지만, 성능은 가장 낮음
- Polars는 SIMD 활용으로 단일 머신에서 압도적
- 2024년 12월 벤치마크: 2-vCores에서 Polars > DuckDB > Spark

**추천**:
- 단일 머신 → **Polars**
- 분산 처리 → **Spark** (하지만 Dask가 2배 빠름)
- 빠른 분석 → **DuckDB**

**출처**:
- [Confessions of a Data Guy - Polars vs Spark](https://www.confessionsofadataguy.com/polars-vs-spark-real-talk/)
- [Coiled - TPC-H Benchmark](https://docs.coiled.io/blog/tpch.html)

---

### Airflow vs Dagster vs Prefect (2025)

| 항목 | Airflow | Dagster | Prefect |
|------|---------|---------|---------|
| **2024 다운로드** | 320M | 15M | 32M |
| **철학** | 태스크 중심 | 데이터 자산 중심 | 개발자 경험 중심 |
| **학습 곡선** | 가파름 | 중간 | 완만 |
| **2025 업데이트** | Airflow 3.0 (역대 최대) | Components GA | Python 3.10+ 전용 |

**2025 현황**:
- **Airflow**: 월 3,000만 다운로드, 8만+ 조직 사용, MLOps 30%, GenAI 10%
- **Dagster**: 자산 중심 오케스트레이터로 포지셔닝, dbt 통합 우수
- **Prefect**: 에러 핸들링 강점, Incidents 기능 추가

**추천**:
- 업계 표준, 대규모 → **Airflow**
- 데이터 리니지, dbt 통합 → **Dagster**
- 빠른 시작, 동적 워크플로우 → **Prefect**

**출처**:
- [ZenML - Orchestration Showdown](https://www.zenml.io/blog/orchestration-showdown-dagster-vs-prefect-vs-airflow)
- [PracData - State of Workflow Orchestration 2025](https://www.pracdata.io/p/state-of-workflow-orchestration-ecosystem-2025)

---

## Phase 4: 클라우드 & 인프라

### AWS SAA-C03 시험 (2024-2025)

**시험 정보**:
- 버전: SAA-C03 (2022년 8월 출시, 현재 유효)
- 시간: 130분, 65문제
- 합격: 720/1000 이상
- 비용: $150 USD

**도메인 가중치 변화** (C02 → C03):
| 도메인 | C02 | C03 | 변화 |
|--------|-----|-----|------|
| 보안 아키텍처 | 24% | **30%** | +6% ⬆️ |
| 복원력 아키텍처 | 26% | 22% | -4% |
| 고성능 아키텍처 | 24% | 20% | -4% |
| 비용 최적화 | 26% | 28% | +2% |

**핵심 출제 영역**:
- **보안 (30%)**: AWS Network Firewall, Security Hub, MFA, 암호화, IPSec, S3 Object Lock
- **데이터 분석**: Athena, Glue, Kinesis, MSK, OpenSearch, QuickSight, Lake Formation

**출처**:
- [AWS Certification](https://aws.amazon.com/certification/certified-solutions-architect-associate/)
- [Pluralsight - SAA-C03 Guide](https://www.pluralsight.com/resources/blog/cloud/new-aws-saa-c03-exam)

---

## 커리큘럼 반영 제안

### Phase 2 (데이터 분석) 업데이트
- [x] EDA/Feature Engineering 포함 ✅
- [ ] **추가 권장**: cuDF/GPU 가속 피처 생성 소개
- [ ] **추가 권장**: Stacking, Pseudo-labeling 앙상블 기법

### Phase 5 (GenAI) 업데이트
- [ ] **추가 권장**: MCP (Model Context Protocol) 실습
- [ ] **추가 권장**: GraphRAG 개념 및 한계
- [ ] **수정 권장**: Agent 프레임워크 - CrewAI 우선 (빠른 프로토타이핑)

### Phase 1 (데이터 엔지니어링) 업데이트
- [ ] **수정 권장**: Polars를 pandas 다음 필수로 격상
- [ ] **추가 권장**: Dagster 소개 (Airflow 대안)

### Phase 4 (클라우드) 업데이트
- [ ] **강조 권장**: 보안 도메인 30%로 가중치 증가 반영

---

## 추가 조사 (2025-12-04 저녁)

### 1. Terraform vs Pulumi (IaC)

| 항목 | Terraform | Pulumi |
|------|-----------|--------|
| **언어** | HCL (전용 DSL) | Python, TypeScript, Go, C#, Java 등 |
| **학습 곡선** | IaC 초보자에게 적합 | 개발자에게 적합 |
| **테스트** | Terratest (Go 라이브러리) | 네이티브 단위 테스트 (xUnit 등) |
| **상태 관리** | 로컬 파일 또는 원격 백엔드 | Pulumi 관리 서비스 (기본) |
| **시크릿** | 서드파티 도구 필요 | 기본 암호화 제공 |
| **라이선스** | BSL (제한적) | Apache 2.0 (완전 오픈소스) |

**선택 가이드**:
- **Terraform**: 업계 표준, 안정성, 방대한 커뮤니티
- **Pulumi**: 개발자 친화적, 복잡한 로직, Kubernetes 네이티브

**마이그레이션 사례**:
- Atlassian Bitbucket: Terraform → Pulumi 2일 만에 완료
- Starburst: 마이그레이션 후 배포 112배 빨라짐

**출처**:
- [Pulumi Docs - Terraform Comparison](https://www.pulumi.com/docs/iac/comparisons/terraform/)
- [env0 - Pulumi vs Terraform](https://www.env0.com/blog/pulumi-vs-terraform-an-in-depth-comparison)

---

### 2. Kubernetes 트렌드 2025

**채택 현황**:
- 기업 96%가 Kubernetes 사용 (역대 가장 빠른 기술 도입)
- 클라우드 호스팅 K8s 비율: 45% (2022) → 67% (2025)

**Serverless Kubernetes**:
| 서비스 | 특징 |
|--------|------|
| **AWS Fargate (EKS)** | 노드 관리 불필요, vCPU/시간 과금 |
| **GKE Autopilot** | TCO 최대 85% 절감 (Google 주장) |
| **Azure Container Apps** | 서버리스 컨테이너 |

**2025 핵심 트렌드**:
1. **Kubernetes AI** - 검색량 300% 증가 (2024 대비)
2. **GKE Gen AI 추론** - 비용 30% 절감, 지연 60% 감소, 처리량 40% 증가
3. **WebAssembly (Wasm)** - 컨테이너 대안으로 부상
4. **비용 최적화** - 2025년 필수 과제
5. **GitOps** - 인프라 관리 표준화

**주의사항**:
- Serverless K8s는 일정 부하에서 오히려 비용 증가 가능
- 스파이크 워크로드에 적합

**출처**:
- [Opcito - Kubernetes Trends 2025](https://www.opcito.com/blogs/kubernetes-trends-and-predictions-2025)
- [Mirantis - Best Managed K8s Providers](https://www.mirantis.com/blog/best-managed-kubernetes-providers-in-2025/)

---

### 3. dbt Cloud vs dbt Core

| 항목 | dbt Core | dbt Cloud |
|------|----------|-----------|
| **가격** | 무료 (Apache 2.0) | 유료 (Developer 티어 무료) |
| **실행 환경** | 로컬, VM, 컨테이너, CI/CD | 관리형 SaaS |
| **IDE** | VS Code + 확장 | 웹 기반 IDE |
| **스케줄링** | Airflow/Dagster/Prefect 연동 필요 | 내장 |
| **팀 기능** | 직접 구축 | RBAC, SSO, 감사 로그 |

**선택 가이드**:
- **dbt Core**: 완전한 제어, 비용 절감, 기존 오케스트레이터 있음
- **dbt Cloud**: 빠른 시작, DevOps 부담 없음, 엔터프라이즈 보안

**하이브리드 접근** (추천):
- 로컬 개발: dbt Core + VS Code
- 프로덕션: dbt Cloud 또는 Airflow/Dagster

**Dagster와의 통합**:
- dbt 모델 ↔ Dagster Asset 자동 매핑
- 몇 줄 코드로 전체 dbt 프로젝트 통합

**출처**:
- [Datacoves - dbt Core vs Cloud 2025](https://datacoves.com/post/dbt-core-key-differences)
- [Hevo - dbt Core vs dbt Cloud](https://hevodata.com/data-transformation/dbt-core-vs-dbt-cloud/)

---

### 4. Vector Database 비교 (RAG용)

| DB | 특징 | 추천 사용 사례 |
|----|------|---------------|
| **Pinecone** | 완전 관리형, 10억 벡터+, <10ms | 엔터프라이즈, 최소 운영 |
| **Weaviate** | 오픈소스, GraphQL, 지식 그래프 | 시맨틱 검색 + 구조 데이터 |
| **Qdrant** | Rust 기반, 필터링 강력, SOC2/HIPAA | 복잡한 메타데이터 필터링 |
| **Chroma** | 경량, 임베디드, 빠른 시작 | 프로토타이핑, 소규모 앱 |

**성능 벤치마크 (100만 벡터, 1536차원)**:
| DB | 삽입 속도 | 쿼리 속도 |
|----|----------|----------|
| Pinecone | 50,000/s | 5,000/s |
| Qdrant | 45,000/s | 4,500/s |
| Weaviate | 35,000/s | 3,500/s |
| Chroma | 25,000/s | - |

**Weaviate 1.30 신기능**:
- 네이티브 생성 모듈 (LLM 통합)
- 검색 → LLM → 응답을 단일 API로

**추천 전략**:
1. 프로토타이핑: **Chroma** 또는 **pgvector**
2. 프로덕션 스케일: **Pinecone** 또는 **Weaviate**
3. 복잡한 필터링: **Qdrant**

**출처**:
- [LiquidMetal AI - Vector DB Comparison 2025](https://liquidmetal.ai/casesAndBlogs/vector-comparison/)
- [DataCamp - Best Vector Databases](https://www.datacamp.com/blog/the-top-5-vector-databases)

---

## 최종 커리큘럼 반영 제안 (업데이트)

### Phase 1 (데이터 엔지니어링)
- [x] Spark vs Polars 비교 ✅
- [x] Airflow vs Dagster vs Prefect 비교 ✅
- [ ] **추가 권장**: dbt Core 실습 (Dagster 연동)

### Phase 4 (클라우드 & 인프라)
- [x] AWS SAA 시험 분석 ✅
- [ ] **추가 권장**: Terraform 기본 + Pulumi 소개
- [ ] **추가 권장**: GKE Autopilot / EKS Fargate 서버리스 K8s 실습
- [ ] **강조 권장**: K8s 비용 최적화 (2025 필수 역량)

### Phase 5 (GenAI & Agents)
- [x] LangChain vs LlamaIndex ✅
- [x] GraphRAG ✅
- [x] AI Agent 프레임워크 ✅
- [x] MCP ✅
- [ ] **추가 권장**: Vector DB 선택 가이드 (Chroma → Pinecone 마이그레이션)

---

*문서 작성: Claude Code*
*마지막 업데이트: 2025-12-04 (2차)*
