# FDE Academy 시뮬레이터 목록

> **목적**: 커리큘럼 실습에 필요한 시뮬레이터/도구 정리
>
> **최종 업데이트**: 2025-12-06

---

## 기존 자산 현황

### 1. KSS-Fresh (32 모듈, 170+ 시뮬레이터)

교육용 시뮬레이터 플랫폼 - 이미 **SaaS 제품 수준**으로 구현됨!

| 모듈 | 챕터 수 | 시뮬레이터 | 활용 가능 커리큘럼 |
|------|--------|-----------|-------------------|
| **Smart Factory** | 16 | 8개 (생태계맵, AI최적화 등) | Phase 3 (산업 온톨로지) |
| **Stock Analysis** | 18 | 20개 (Pro Trading Chart, KIS API) | Phase 2 (시계열 분석) |
| **Data Science** | 12 | 다수 | Phase 2 (EDA, ML) |
| **Data Engineering** | 6 | 다수 | Phase 1 (파이프라인) |
| **LLM** | 8 | 5개 | Phase 5 (LLM 기초) |
| **RAG** | 17 | GraphRAG Explorer 등 | Phase 5 (RAG 구현) |
| **Multi-Agent** | 6 | 다수 | Phase 5 (에이전트) |
| **Agent MCP** | 6 | 다수 | Phase 5 (MCP) |
| **Computer Vision** | 8 | 5개 (Object Detection 등) | Phase 5 (AI 응용) |
| **DevOps CI/CD** | 8 | 다수 | Phase 4 (CI/CD) |
| **System Design** | 8 | Mermaid Editor | Phase 1, 4 (아키텍처) |
| **NEO4J** | 8 | 그래프 DB | Phase 3 (지식 그래프) |
| **Ontology** | 18 | RDF/OWL 시뮬레이터 | Phase 3 (온톨로지) |
| **Quantum Computing** | 8 | 양자 시뮬레이터 | 고급 선택 |
| **Bioinformatics** | 10 | 바이오 분석 | Phase 6 (헬스케어) |
| **Web3** | 8 | Crypto Prediction 등 | 선택 과정 |
| **AI Security** | 8 | 보안 시뮬레이터 | Phase 4 (보안) |
| **Physical AI** | 9 | 로보틱스 | 고급 선택 |
| **Probability Statistics** | 8 | 통계 시뮬레이터 | Phase 2 (통계) |
| **English Conversation** | 8 | 언어 학습 | - |
| 기타 12개 모듈 | 60+ | 다수 | 다양한 과정 |

**핵심 기능**:
- ✅ 공간 최적화 UI 시스템 (ResponsiveCanvas, AdaptiveLayout)
- ✅ Mermaid 다이어그램 에디터 (6개 전문 템플릿)
- ✅ Professional Trading Chart (KIS API 연동)
- ✅ 4단계 학습 경로 (초급→중급→고급→보충)
- ✅ 논문 연동 시스템 (arXiv 모니터링)
- ✅ 다크 모드, 반응형 디자인

---

### 2. Flux-Ontology (38 Phase 완료)

Palantir Foundry 클론 수준의 **엔터프라이즈 플랫폼**!

| 기능 | Phase | 활용 가능 커리큘럼 |
|------|-------|-------------------|
| Core Ontology Engine | 1-7 | Phase 3 (지식 그래프) |
| Neo4j Integration | 8-10 | Phase 3 (Cypher 쿼리) |
| Data Connectors (10+) | 11, 22 | Phase 1 (ETL) |
| ELT Pipeline | 11 | Phase 1 (Spark/파이프라인) |
| Real-time Sync (Kafka, WS) | 14 | Phase 1 (스트리밍) |
| ML Service (FastAPI) | 15 | Phase 2 (ML), Phase 5 (AI) |
| Elasticsearch Search | 15 | Phase 2 (검색) |
| Kubernetes Scaling | 16 | Phase 4 (K8s) |
| RBAC & Security | 17 | Phase 4 (보안) |
| SDK (TS, Python, CLI) | 18 | Phase 1, 5 (개발) |
| Multi-Region (Terraform) | 19 | Phase 4 (AWS) |
| Analytics Dashboard | 20 | Phase 2 (시각화) |
| **Visual Pipeline Builder** | 21 | Phase 1 (Airflow 대체) |
| **Data Governance** | 24 | Phase 2 (데이터 품질) |
| **Scheduler & Automation** | 27 | Phase 1 (스케줄링) |
| **Visual Ontology & Lineage** | 28 | Phase 3 (시각화) |
| **Query Builder UI** | 30 | Phase 3 (SPARQL/Cypher) |
| **AI Data Assistant** | 31 | Phase 5 (AI Agent) |
| Apache NiFi Integration | 34 | Phase 1 (ETL) |
| OpenMetadata Integration | 35 | Phase 2 (거버넌스) |
| **App Builder (Ontology→App)** | 36 | Phase 3, 6 (캡스톤) |

---

### 3. KSS-Ontology (현재 프로젝트)

뉴스 기반 투자 인사이트 서비스 - **실제 Triple Store 구현**

| 기능 | 설명 | 활용 가능 커리큘럼 |
|------|------|-------------------|
| PostgreSQL Triple Store | RDF Triple 저장 | Phase 3 |
| Triple 추출 엔진 | GPT-4o-mini 뉴스 분석 | Phase 5 |
| SPARQL-like 쿼리 엔진 | 패턴 매칭 쿼리 | Phase 3 |
| Reasoning Engine | RDFS/OWL 스타일 추론 | Phase 3 |
| vis-network 시각화 | 지식 그래프 시각화 | Phase 3 |
| 네이버 뉴스 API | 실시간 뉴스 연동 | Phase 1 |

---

## Phase별 시뮬레이터 매핑

### Phase 1: 데이터 엔지니어링 기초

| 시뮬레이터 | 출처 | 상태 |
|-----------|------|------|
| SQL Playground | 외부 (PostgreSQL) | 기존 도구 |
| Spark Notebook | 외부 (Databricks) | 기존 도구 |
| **Visual Pipeline Builder** | Flux Phase 21 | **재활용** |
| **Data Connectors (10+)** | Flux Phase 22 | **재활용** |
| **Scheduler & Automation** | Flux Phase 27 | **재활용** |
| **System Design (Mermaid)** | KSS-Fresh | **재활용** |
| **Data Engineering 모듈** | KSS-Fresh | **재활용** |

### Phase 2: 데이터 분석 & 컨설팅

| 시뮬레이터 | 출처 | 상태 |
|-----------|------|------|
| EDA Notebook | 외부 (Jupyter) | 기존 도구 |
| **ML Service (FastAPI)** | Flux Phase 15 | **재활용** |
| **Analytics Dashboard** | Flux Phase 20 | **재활용** |
| **Data Quality** | Flux Phase 24 | **재활용** |
| **Data Science 모듈** | KSS-Fresh | **재활용** |
| **Stock Analysis (20개 도구)** | KSS-Fresh | **재활용** |
| **Probability Statistics** | KSS-Fresh | **재활용** |

### Phase 3: 지식 그래프 ⭐

| 시뮬레이터 | 출처 | 상태 |
|-----------|------|------|
| **Ontology 모듈 (18챕터)** | KSS-Fresh | **재활용** |
| **NEO4J 모듈 (8챕터)** | KSS-Fresh | **재활용** |
| **Ontology Core Engine** | Flux Phase 1-7 | **재활용** |
| **Neo4j + Cypher** | Flux Phase 8-10 | **재활용** |
| **Visual Ontology & Lineage** | Flux Phase 28 | **재활용** |
| **Query Builder UI** | Flux Phase 30 | **재활용** |
| **Ontology Builder (CSV→KG)** | Flux Phase 36 | **재활용** |
| **Triple Store** | KSS-Ontology | **재활용** |
| **GraphRAG Explorer** | KSS-Fresh (RAG) | **재활용** |
| SPARQL Playground | 외부 (Wikidata) | 기존 도구 |

### Phase 4: 클라우드 & 인프라

| 시뮬레이터 | 출처 | 상태 |
|-----------|------|------|
| AWS Sandbox | 외부 (Free Tier) | 기존 도구 |
| **Terraform (Multi-Region)** | Flux Phase 19 | **재활용** |
| **K8s Deployments** | Flux Phase 16, 37 | **재활용** |
| Docker Lab | 외부 (Docker) | 기존 도구 |
| **Security (RBAC, MFA)** | Flux Phase 17 | **재활용** |
| **DevOps CI/CD 모듈** | KSS-Fresh | **재활용** |
| **AI Security 모듈** | KSS-Fresh | **재활용** |

### Phase 5: GenAI & 에이전트 ⭐

| 시뮬레이터 | 출처 | 상태 |
|-----------|------|------|
| **AI Data Assistant** | Flux Phase 31 | **재활용** |
| **LLM 모듈 (8챕터)** | KSS-Fresh | **재활용** |
| **RAG 모듈 (17챕터, 4단계)** | KSS-Fresh | **재활용** |
| **Multi-Agent 모듈** | KSS-Fresh | **재활용** |
| **Agent MCP 모듈** | KSS-Fresh | **재활용** |
| **Computer Vision 모듈** | KSS-Fresh | **재활용** |
| **ML Microservice** | Flux Phase 15 | **재활용** |
| RAG Builder | 외부 (LangChain) | 템플릿 |
| Prompt Lab | 외부 (OpenAI) | 기존 도구 |

### Phase 6: 산업별 프로젝트 & 취업

| 시뮬레이터 | 출처 | 상태 |
|-----------|------|------|
| **App Builder** | Flux Phase 36 | **재활용** |
| **Smart Factory 모듈** | KSS-Fresh | **재활용** |
| **Bioinformatics 모듈** | KSS-Fresh | **재활용** |
| **Stock Analysis Tools** | KSS-Fresh | **재활용** |
| Data Generator | 외부 (Synthea, Faker) | 기존 도구 |
| Portfolio Builder | 템플릿 | 템플릿 |
| Interview Simulator | - | 신규 개발 |

---

## 요약

### 기존 자산 통계

| 프로젝트 | 모듈/Phase | 시뮬레이터 | 챕터 |
|---------|-----------|-----------|------|
| **KSS-Fresh** | 32 모듈 | **170+** | 200+ |
| **Flux-Ontology** | 38 Phase | **20+** | - |
| **KSS-Ontology** | 1 서비스 | **5+** | - |
| **합계** | - | **195+** | 200+ |

### 재활용 vs 신규 개발

| 구분 | 개수 | 비율 |
|------|-----|------|
| **KSS-Fresh 재활용** | 170+ | 85% |
| **Flux-Ontology 재활용** | 20+ | 10% |
| **외부 도구 활용** | 8개 | 4% |
| **신규 개발 필요** | **1개** | **1%** |

### 신규 개발 필요

| 시뮬레이터 | Phase | 설명 |
|-----------|-------|------|
| Interview Simulator | 6 | AI 기반 모의 면접 (선택) |

---

## 결론

**KSS-Fresh + Flux-Ontology + KSS-Ontology 덕분에 시뮬레이터 개발이 거의 필요 없음!**

| 항목 | 내용 |
|------|------|
| **총 재활용 가능** | 195+ 시뮬레이터 |
| **학습 콘텐츠** | 200+ 챕터 |
| **신규 개발** | 1개만 (선택) |
| **결론** | FDE Academy는 기존 자산 활용으로 즉시 런칭 가능! |

---

## 주요 시뮬레이터 상세

### KSS-Fresh 핵심 시뮬레이터

| 시뮬레이터 | 모듈 | 설명 |
|-----------|------|------|
| **Pro Trading Chart** | Stock Analysis | TradingView급 캔들차트 + KIS API |
| **Mermaid Editor** | System Design | 6개 전문 템플릿 (마이크로서비스, CI/CD 등) |
| **GraphRAG Explorer** | RAG | Neo4j 스타일 지식그래프 |
| **Smart Factory Ecosystem** | Smart Factory | 21개 구성요소 시각화 |
| **Object Detection Lab** | Computer Vision | 실시간 객체 탐지 |
| **YouTube Summarizer** | System Tools | AI 기반 영상 요약 |

### Flux-Ontology 핵심 시뮬레이터

| 시뮬레이터 | Phase | 설명 |
|-----------|-------|------|
| **Visual Pipeline Builder** | 21 | 26개 노드 타입 (React Flow) |
| **Query Builder UI** | 30 | SQL/Cypher/GraphQL 변환 |
| **AI Data Assistant** | 31 | 자연어 → 쿼리 변환 |
| **App Builder** | 36 | CSV → Ontology → App |

---

## ⚠️ 개선 필요 사항

### 기존 자산의 한계

기존 시뮬레이터들은 **데모/프로토타입 수준**으로, FDE Academy의 **전문 교육**에 활용하려면 보강이 필요함.

| 문제점 | 설명 |
|--------|------|
| **겉핥기 수준** | 개념 소개만 있고 깊이 있는 실습 부족 |
| **실무 연결 부족** | 이론만 있고 실제 업무에서 어떻게 쓰는지 부족 |
| **평가 시스템 없음** | 학습 완료 여부 확인 불가 |
| **시나리오 부족** | 단편적 기능만 있고 End-to-End 시나리오 없음 |

### Phase별 보강 필요 항목

#### Phase 1: 데이터 엔지니어링
| 항목 | 현재 상태 | 보강 필요 |
|------|----------|----------|
| SQL 고급 | 기초 쿼리만 | 윈도우 함수, CTE, 실행계획 분석 |
| Spark | 개념만 | 실제 대용량 데이터셋 실습 |
| Airflow | 없음 | DAG 작성, 스케줄링, 모니터링 |
| 데이터 모델링 | 기초만 | Star Schema, SCD Type 2, ERD 설계 |

#### Phase 2: 데이터 분석 & 컨설팅
| 항목 | 현재 상태 | 보강 필요 |
|------|----------|----------|
| EDA | 기초만 | 실무 데이터셋 + 인사이트 도출 |
| 통계 | 이론만 | 가설검정, A/B 테스트 실습 |
| ML | 기초 모델만 | XGBoost 튜닝, Feature Store |
| 커뮤니케이션 | 없음 | Pyramid Principle 템플릿, 경영진 보고 |

#### Phase 3: 지식 그래프 ⭐
| 항목 | 현재 상태 | 보강 필요 |
|------|----------|----------|
| RDF/OWL | 개념만 | Protégé 실습, 온톨로지 설계 패턴 |
| SPARQL | 기초만 | 고급 쿼리, Federated Query |
| Neo4j | 기초만 | Cypher 고급, 성능 최적화 |
| Reasoning | 개념만 | OWL-DL, 추론 규칙 작성 |

#### Phase 4: 클라우드 & 인프라
| 항목 | 현재 상태 | 보강 필요 |
|------|----------|----------|
| AWS | 개념만 | 실제 인프라 구축 실습 |
| Terraform | 코드만 | 모듈화, State 관리, CI/CD 연동 |
| K8s | 기초만 | Helm, 오토스케일링, 모니터링 |
| 보안 | 기초만 | IAM 정책, 네트워크 보안, 감사 |

#### Phase 5: GenAI & 에이전트 ⭐
| 항목 | 현재 상태 | 보강 필요 |
|------|----------|----------|
| Prompt Engineering | 기초만 | 고급 기법, 평가 메트릭 |
| RAG | 개념만 | 청킹 전략, 하이브리드 검색, 평가 |
| Agent | 없음 | Function Calling, ReAct, MCP |
| Fine-tuning | 없음 | LoRA, PEFT, 데이터 준비 |

#### Phase 6: 산업별 프로젝트
| 항목 | 현재 상태 | 보강 필요 |
|------|----------|----------|
| 금융 | 기초만 | FIBO 실습, 규제 준수 |
| 의료 | 없음 | FHIR 연동, 임상 데이터 |
| 제조 | 개념만 | OPC-UA, Digital Twin |
| 포트폴리오 | 없음 | 프로젝트 템플릿, 문서화 |

### 보강 전략

#### 1단계: 핵심 시뮬레이터 심화 (즉시)
- Phase 3 (지식 그래프): RDF Triple Editor 고도화
- Phase 5 (AI): Agent Playground 신규 개발

#### 2단계: 실무 시나리오 추가 (단기)
- 각 Phase별 End-to-End 프로젝트 추가
- 실제 데이터셋 + 비즈니스 컨텍스트

#### 3단계: 평가 시스템 구축 (중기)
- 각 챕터별 퀴즈
- 실습 과제 자동 채점
- 수료증 발급

### 우선순위

| 순위 | 항목 | Phase | 난이도 | 비고 |
|-----|------|-------|--------|------|
| 1 | RDF Triple Editor 고도화 | 3 | 중 | 기존 KSS-Ontology 확장 |
| 2 | Agent Playground | 5 | 중 | 신규 개발 |
| 3 | 실무 시나리오 추가 | 전체 | 높음 | 콘텐츠 작업 |
| 4 | SQL 고급 실습 | 1 | 낮음 | 문제 추가 |
| 5 | RAG 평가 시스템 | 5 | 중 | RAGAS 연동 |

---

**문서 작성**: 2025-12-06
