# FDE Academy 커리큘럼 v2.0

> 실무 중심 재설계 | 12개월 | 2025-12-04

---

## 변경 요약

| 항목 | v1.0 | v2.0 |
|------|------|------|
| 데이터 마이닝 | 없음 | **Phase 2 신설 (2개월)** |
| 온톨로지 | RDF/OWL 학술 중심 | **Neo4j/Cypher 실무 중심** |
| RDF/OWL | 2개월 | 1주 (개념만) |
| 전통 ML | Spark ML만 (1주) | **별도 Phase로 분리** |
| 총 기간 | 12개월 | 12개월 (유지) |

---

## 전체 구조 (12개월)

```
Phase 1: 데이터 엔지니어링 기초 (2개월)
   └─ Python, SQL, Spark, 파이프라인

Phase 2: 데이터 분석 & 마이닝 (2개월) ← 신규
   └─ EDA, Feature Engineering, ML 모델링, 이상탐지

Phase 3: 지식 그래프 (2개월) ← 실무 중심 재설계
   └─ Neo4j, Cypher, 그래프 알고리즘, GraphRAG

Phase 4: 클라우드 & 인프라 (2개월)
   └─ AWS, Docker, Kubernetes, IaC

Phase 5: GenAI & 에이전트 (2개월)
   └─ LLM, 프롬프트, RAG, AI Agent

Phase 6: 산업별 프로젝트 & 취업 (2개월)
   └─ 도메인 심화, 캡스톤 프로젝트, 취업 준비
```

---

## Phase 1: 데이터 엔지니어링 기초 (2개월)

### Month 1: Python & SQL 심화

#### Week 1: Python 심화
| 토픽 | 내용 |
|------|------|
| 제너레이터 & 이터레이터 | yield, lazy evaluation, 메모리 효율 |
| 데코레이터 패턴 | @decorator, functools.wraps, 실행 시간 측정 |
| 컨텍스트 매니저 | with문, __enter__/__exit__, 리소스 관리 |
| Type Hints | mypy, 정적 타입 검사, 코드 품질 |

**실습**: 데코레이터 기반 로깅 & 캐싱 시스템 구현
**산출물**: Python 유틸리티 라이브러리

#### Week 2: pandas & 데이터 처리
| 토픽 | 내용 |
|------|------|
| 대용량 데이터 처리 | chunk 처리, memory_map, dtype 최적화 |
| 고급 pandas | MultiIndex, pivot, melt, merge 전략 |
| 성능 최적화 | apply vs vectorize, numba, bottleneck |
| Polars 소개 | pandas 대안, Rust 기반, 성능 비교 |

**실습**: 1GB+ CSV 처리 파이프라인
**산출물**: 데이터 처리 벤치마크 리포트

#### Week 3: SQL 심화
| 토픽 | 내용 |
|------|------|
| 윈도우 함수 | ROW_NUMBER, RANK, LAG/LEAD, NTILE |
| CTE & 재귀 쿼리 | WITH절, 계층 구조 쿼리 |
| 실행 계획 분석 | EXPLAIN, 인덱스 전략, 쿼리 튜닝 |
| 트랜잭션 & 락 | ACID, isolation level, deadlock |

**실습**: 복잡한 분석 쿼리 20개 작성
**산출물**: SQL 쿼리 포트폴리오

#### Week 4: 데이터 모델링
| 토픽 | 내용 |
|------|------|
| 정규화 | 1NF ~ 3NF, BCNF, 역정규화 |
| 분석용 스키마 | Star Schema, Snowflake, Data Vault |
| SCD | Type 1/2/3, 이력 관리 |
| 실무 설계 | 이커머스, 금융, 로그 데이터 |

**실습**: 이커머스 데이터 웨어하우스 설계
**산출물**: ERD + DDL 스크립트

---

### Month 2: Spark & 파이프라인

#### Week 5: Apache Spark
| 토픽 | 내용 |
|------|------|
| Spark 아키텍처 | Driver, Executor, 파티셔닝, Shuffle |
| DataFrame API | select, filter, groupBy, join, window |
| Catalyst & Tungsten | 쿼리 최적화, 메모리 관리 |
| PySpark UDF | pandas UDF, Arrow 최적화 |

**실습**: 대용량 로그 분석 파이프라인
**환경**: Databricks Community Edition

#### Week 6: Spark 심화 & Delta Lake
| 토픽 | 내용 |
|------|------|
| Spark Streaming | Structured Streaming, watermark, window |
| Delta Lake | ACID, Time Travel, Schema Evolution |
| 성능 튜닝 | 파티션, 캐싱, broadcast join |
| 모니터링 | Spark UI, 메트릭 해석 |

**실습**: 실시간 데이터 처리 + Delta Lake 저장
**산출물**: Databricks 노트북 프로젝트

#### Week 7: 워크플로우 오케스트레이션
| 토픽 | 내용 |
|------|------|
| Apache Airflow | DAG, Operator, Sensor, XCom |
| 스케줄링 | Cron 표현식, catchup, backfill |
| 에러 핸들링 | retry, alerting, SLA |
| 대안 도구 | Prefect, Dagster 비교 |

**실습**: ETL 워크플로우 자동화
**산출물**: Airflow DAG 3개

#### Week 8: E2E 파이프라인 프로젝트
| 토픽 | 내용 |
|------|------|
| 아키텍처 설계 | 소스 → 처리 → 저장 → 서빙 |
| 데이터 품질 | Great Expectations, 검증 규칙 |
| 모니터링 | 로깅, 메트릭, 알림 |
| 문서화 | README, 아키텍처 다이어그램 |

**실습**: E2E 데이터 파이프라인 구축
**산출물**: **포트폴리오 #1: 데이터 파이프라인**

---

## Phase 2: 데이터 분석 & 마이닝 (2개월) ← 신규

### Month 3: EDA & Feature Engineering

#### Week 9: 탐색적 데이터 분석 (EDA)
| 토픽 | 내용 |
|------|------|
| 통계 기초 복습 | 분포, 중심 경향, 산포도, 상관관계 |
| 시각화 | matplotlib, seaborn, plotly |
| 결측치 분석 | 패턴 파악, MCAR/MAR/MNAR |
| 이상치 탐지 (기초) | IQR, Z-score, 시각적 탐지 |

**실습**: 실제 데이터셋 EDA 리포트 작성
**데이터**: Kaggle 대회 데이터셋

#### Week 10: 데이터 전처리 & 정제
| 토픽 | 내용 |
|------|------|
| 결측치 처리 | 삭제, 대체 (mean/median/mode), 보간 |
| 이상치 처리 | Winsorizing, 변환, 제거 기준 |
| 데이터 변환 | 로그, Box-Cox, 표준화, 정규화 |
| 인코딩 | Label, One-hot, Target, Frequency |

**실습**: 지저분한 데이터 정제 파이프라인
**산출물**: 재사용 가능한 전처리 모듈

#### Week 11: Feature Engineering
| 토픽 | 내용 |
|------|------|
| 수치형 피처 | binning, polynomial, interaction |
| 범주형 피처 | 희귀 카테고리, 그룹화 |
| 시간 피처 | 요일, 월, 계절, lag features |
| 텍스트 피처 | TF-IDF, 길이, 특수문자 비율 |

**실습**: Kaggle 대회 피처 엔지니어링
**산출물**: Feature Engineering 노트북

#### Week 12: Feature Selection & 차원 축소
| 토픽 | 내용 |
|------|------|
| Filter 방법 | 상관관계, 분산, 카이제곱 |
| Wrapper 방법 | RFE, Forward/Backward Selection |
| Embedded 방법 | Lasso, Tree importance |
| 차원 축소 | PCA, t-SNE, UMAP |

**실습**: 고차원 데이터 차원 축소 & 시각화
**산출물**: Feature Selection 가이드

---

### Month 4: ML 모델링 & 이상탐지

#### Week 13: 분류 & 회귀
| 토픽 | 내용 |
|------|------|
| 분류 모델 | Logistic, Decision Tree, Random Forest |
| 회귀 모델 | Linear, Ridge, Lasso, ElasticNet |
| 앙상블 | Bagging, Boosting (XGBoost, LightGBM) |
| 평가 지표 | Accuracy, Precision, Recall, F1, AUC, RMSE |

**실습**: 고객 이탈 예측 모델
**도구**: scikit-learn, XGBoost

#### Week 14: 클러스터링 & 세그멘테이션
| 토픽 | 내용 |
|------|------|
| K-means | 초기화, K 선택 (Elbow, Silhouette) |
| 계층적 클러스터링 | Dendrogram, 거리 척도 |
| DBSCAN | density 기반, 노이즈 처리 |
| 고객 세그멘테이션 | RFM 분석, 페르소나 도출 |

**실습**: 고객 세그멘테이션 프로젝트
**산출물**: 세그먼트별 프로파일 리포트

#### Week 15: 이상 탐지 (Anomaly Detection)
| 토픽 | 내용 |
|------|------|
| 통계적 방법 | Z-score, IQR, Grubbs Test |
| 밀도 기반 | LOF, DBSCAN |
| 모델 기반 | Isolation Forest, One-class SVM |
| 딥러닝 기반 | Autoencoder |

**실습**: 금융 사기 탐지 시스템
**산출물**: 이상 탐지 파이프라인

#### Week 16: 시계열 분석
| 토픽 | 내용 |
|------|------|
| 시계열 기초 | 추세, 계절성, 정상성 |
| 전통 모델 | ARIMA, SARIMA, Prophet |
| ML 접근 | lag features, sliding window |
| 평가 | MAE, MAPE, 교차 검증 (TimeSeriesSplit) |

**실습**: 수요 예측 모델
**산출물**: **포트폴리오 #2: 데이터 분석 프로젝트**

---

## Phase 3: 지식 그래프 (2개월) ← 실무 중심 재설계

### Month 5: Property Graph & Neo4j

#### Week 17: 그래프 데이터베이스 기초
| 토픽 | 내용 |
|------|------|
| 그래프 vs 관계형 | 언제 그래프 DB를 쓰는가 |
| Property Graph 모델 | Node, Relationship, Property |
| Neo4j 설치 & 설정 | Desktop, Aura (클라우드) |
| 데이터 모델링 | 노드 레이블, 관계 타입 설계 |

**실습**: Neo4j 환경 구축 + 샘플 데이터 로드
**환경**: Neo4j Aura Free Tier

#### Week 18: Cypher 쿼리 마스터
| 토픽 | 내용 |
|------|------|
| 기본 쿼리 | MATCH, WHERE, RETURN |
| 생성 & 수정 | CREATE, MERGE, SET, DELETE |
| 패턴 매칭 | 경로 탐색, 가변 길이 관계 |
| 집계 & 정렬 | COUNT, SUM, ORDER BY, LIMIT |

**실습**: 영화 데이터셋 Cypher 쿼리 30개
**산출물**: Cypher 쿼리 치트시트

#### Week 19: 그래프 알고리즘
| 토픽 | 내용 |
|------|------|
| 경로 탐색 | Shortest Path, All Paths |
| 중심성 | PageRank, Betweenness, Closeness |
| 커뮤니티 탐지 | Louvain, Label Propagation |
| 유사도 | Node Similarity, Jaccard |

**실습**: 소셜 네트워크 분석 (인플루언서 찾기)
**도구**: Neo4j Graph Data Science Library

#### Week 20: 실무 KG 구축
| 토픽 | 내용 |
|------|------|
| 데이터 import | CSV, JSON, JDBC 연결 |
| 스키마 설계 | 도메인 모델링, 제약 조건 |
| 성능 최적화 | 인덱스, 쿼리 프로파일링 |
| 시각화 | Neo4j Bloom, 커스텀 시각화 |

**실습**: 비즈니스 도메인 KG 구축 (회사-제품-고객)
**산출물**: 도메인 지식 그래프

---

### Month 6: 고급 KG & 통합

#### Week 21: Entity Resolution & 데이터 통합
| 토픽 | 내용 |
|------|------|
| Entity Resolution 개념 | 중복 탐지, 레코드 연결 |
| 매칭 기법 | 규칙 기반, ML 기반 |
| 도구 | splink, dedupe |
| KG에서 ER | 노드 병합, 관계 정리 |

**실습**: 여러 소스 데이터 통합 + 중복 제거
**산출물**: Entity Resolution 파이프라인

#### Week 22: 지식 추출 & NLP
| 토픽 | 내용 |
|------|------|
| NER (개체명 인식) | spaCy, 커스텀 모델 |
| 관계 추출 | 규칙 기반, LLM 활용 |
| 엔티티 연결 | KG와 매핑 |
| 자동 KG 구축 | 텍스트 → 트리플 |

**실습**: 뉴스 기사에서 자동 KG 구축
**산출물**: 텍스트 → KG 파이프라인

#### Week 23: GraphRAG & LLM 통합
| 토픽 | 내용 |
|------|------|
| GraphRAG 개념 | 왜 KG + RAG인가 |
| 구현 방법 | LangChain + Neo4j |
| 쿼리 생성 | 자연어 → Cypher (LLM) |
| 하이브리드 검색 | 벡터 + 그래프 |

**실습**: GraphRAG Q&A 시스템
**도구**: LangChain, Neo4j, OpenAI

#### Week 24: KG 프로젝트
| 토픽 | 내용 |
|------|------|
| 프로젝트 설계 | 요구사항, 데이터 소스, 아키텍처 |
| 구현 | 데이터 수집 → KG 구축 → 애플리케이션 |
| 시각화 & API | 대시보드, REST API |
| 발표 | 데모, 문서화 |

**실습**: 종합 KG 프로젝트
**산출물**: **포트폴리오 #3: 지식 그래프 애플리케이션**

---

### [참고] RDF/OWL 개념 (Week 17에 1-2시간 포함)

실무에서 직접 쓰지 않더라도 알아야 하는 개념:
- RDF Triple (Subject-Predicate-Object) 개념
- 온톨로지란 무엇인가 (철학적 배경)
- SPARQL 기본 문법 (30분)
- Wikidata, FIBO 소개
- Property Graph vs RDF 비교

**목표**: "아, 그런 게 있구나" 수준의 이해
**심화**: 필요 시 Foundry 과정 또는 자율 학습

---

## Phase 4: 클라우드 & 인프라 (2개월)

### Month 7: AWS 핵심 서비스

#### Week 25: 컴퓨팅 & 네트워킹
| 토픽 | 내용 |
|------|------|
| EC2 | 인스턴스 유형, AMI, EBS |
| VPC | Subnet, Route Table, NAT, Security Group |
| Load Balancing | ALB, NLB, Target Group |
| Auto Scaling | Launch Template, Scaling Policy |

**실습**: 고가용성 웹 아키텍처 구축

#### Week 26: 스토리지 & 데이터베이스
| 토픽 | 내용 |
|------|------|
| S3 | 버킷 정책, Lifecycle, 버전 관리 |
| RDS & Aurora | MySQL, PostgreSQL, Read Replica |
| DynamoDB | 파티션 키, GSI, LSI |
| ElastiCache | Redis, 캐싱 전략 |

**실습**: 데이터 티어 아키텍처 구축

#### Week 27: 서버리스 & 이벤트
| 토픽 | 내용 |
|------|------|
| Lambda | 핸들러, 레이어, 콜드 스타트 |
| API Gateway | REST API, WebSocket |
| Step Functions | 상태 머신, 워크플로우 |
| EventBridge | 이벤트 라우팅, 스케줄링 |

**실습**: 서버리스 데이터 처리 파이프라인
**자격증**: AWS SAA 준비 시작

#### Week 28: IaC & 모니터링
| 토픽 | 내용 |
|------|------|
| Terraform | HCL, State, 모듈 |
| CloudFormation | 템플릿, 스택 |
| CloudWatch | 메트릭, 로그, 알람 |
| IAM | 정책, 역할, 최소 권한 |

**실습**: Terraform으로 전체 인프라 코드화
**산출물**: AWS SAA 자격증 응시

---

### Month 8: 컨테이너 & Kubernetes

#### Week 29: Docker 심화
| 토픽 | 내용 |
|------|------|
| Dockerfile | Multi-stage, 캐싱 최적화 |
| Docker Compose | 멀티 컨테이너, 네트워크 |
| 이미지 관리 | 태깅, 레지스트리, 스캐닝 |
| 보안 | 루트리스, 시크릿 관리 |

**실습**: 마이크로서비스 컨테이너화

#### Week 30: Kubernetes 기초
| 토픽 | 내용 |
|------|------|
| 아키텍처 | Control Plane, Node, kubelet |
| 워크로드 | Pod, Deployment, ReplicaSet |
| 서비스 | ClusterIP, NodePort, LoadBalancer |
| 설정 | ConfigMap, Secret |

**실습**: 로컬 K8s 클러스터 (minikube/kind)

#### Week 31: Kubernetes 심화
| 토픽 | 내용 |
|------|------|
| 스토리지 | PV, PVC, StorageClass |
| 네트워킹 | Ingress, NetworkPolicy |
| 패키징 | Helm, Kustomize |
| 운영 | HPA, 리소스 관리, 헬스체크 |

**실습**: Helm 차트 작성 및 배포

#### Week 32: 프로덕션 K8s
| 토픽 | 내용 |
|------|------|
| 관리형 K8s | EKS, GKE 비교 |
| 모니터링 | Prometheus, Grafana |
| CI/CD | GitHub Actions, ArgoCD |
| GitOps | 선언적 배포, 자동 동기화 |

**실습**: EKS 클러스터 + GitOps 파이프라인
**산출물**: **포트폴리오 #4: 클라우드 인프라**

---

## Phase 5: GenAI & 에이전트 (2개월)

### Month 9: LLM & RAG

#### Week 33: LLM 기초
| 토픽 | 내용 |
|------|------|
| Transformer 개념 | Attention, 토큰화 |
| 주요 모델 | GPT, Claude, Gemini, Llama |
| API 사용 | OpenAI, Anthropic SDK |
| 비용 관리 | 토큰 계산, 최적화 |

**실습**: 다양한 LLM API 실험

#### Week 34: 프롬프트 엔지니어링
| 토픽 | 내용 |
|------|------|
| 기본 기법 | Zero-shot, Few-shot, CoT |
| 고급 기법 | Self-consistency, Tree of Thought |
| 시스템 프롬프트 | 역할 설정, 가드레일 |
| 평가 | 일관성, 정확도, 안전성 |

**실습**: 프롬프트 라이브러리 구축

#### Week 35: 임베딩 & 벡터 DB
| 토픽 | 내용 |
|------|------|
| 텍스트 임베딩 | OpenAI, Cohere, 오픈소스 |
| 벡터 DB | Pinecone, Weaviate, Chroma, pgvector |
| 유사도 검색 | 코사인, 유클리드, 하이브리드 |
| 인덱싱 | HNSW, IVF, 성능 튜닝 |

**실습**: 시맨틱 검색 엔진

#### Week 36: RAG 시스템
| 토픽 | 내용 |
|------|------|
| RAG 아키텍처 | Indexing → Retrieval → Generation |
| 청킹 전략 | Fixed, Semantic, Parent-Child |
| 검색 최적화 | 하이브리드, Re-ranking, Query Expansion |
| 평가 | Retrieval 정확도, 답변 품질 |

**실습**: 문서 Q&A RAG 시스템
**도구**: LangChain, LlamaIndex

---

### Month 10: AI 에이전트 & 프로덕션

#### Week 37: AI 에이전트 기초
| 토픽 | 내용 |
|------|------|
| 에이전트 개념 | 자율성, 도구 사용, 계획 |
| Function Calling | OpenAI, Claude 도구 사용 |
| ReAct 패턴 | Reasoning + Acting |
| LangGraph | 상태 기반 워크플로우 |

**실습**: 도구 사용 에이전트 구축

#### Week 38: 고급 에이전트
| 토픽 | 내용 |
|------|------|
| 멀티 에이전트 | 협업, 위임, 감독 |
| 메모리 | 단기/장기 메모리, 요약 |
| 계획 & 반성 | Plan-and-Execute, Self-Reflection |
| 에이전트 평가 | 작업 완료율, 효율성 |

**실습**: 멀티 에이전트 시스템

#### Week 39: 프로덕션 배포
| 토픽 | 내용 |
|------|------|
| API 서버 | FastAPI, 스트리밍 응답 |
| 캐싱 | Semantic 캐시, Redis |
| 모니터링 | LangSmith, 비용 추적 |
| 보안 | Rate limiting, Input validation |

**실습**: RAG API 서버 배포

#### Week 40: GenAI 프로젝트
| 토픽 | 내용 |
|------|------|
| 프로젝트 설계 | 요구사항, 아키텍처 |
| 구현 | RAG + Agent 통합 |
| 평가 & 개선 | 사용자 피드백, A/B 테스트 |
| 발표 | 데모, 문서화 |

**실습**: 종합 GenAI 애플리케이션
**산출물**: **포트폴리오 #5: AI 애플리케이션**

---

## Phase 6: 산업별 프로젝트 & 취업 (2개월)

### Month 11: 도메인 심화 & 캡스톤

#### Week 41-42: 도메인 선택 (택 1)

**Option A: 금융**
- 투자 포트폴리오 분석
- 리스크 모델링
- 사기 탐지
- 규제 준수 (KYC/AML)

**Option B: 의료/헬스케어**
- 환자 데이터 분석
- 의료 영상 (기초)
- 임상 NLP
- FHIR 데이터 활용

**Option C: 제조/공급망**
- 수요 예측
- 품질 관리
- 예지 정비
- 공급망 최적화

**Option D: 사이버보안**
- 위협 탐지
- 로그 분석
- MITRE ATT&CK
- SIEM 연동

#### Week 43-44: 캡스톤 프로젝트
| 주차 | 활동 |
|------|------|
| Week 43 | 기획 + 데이터 수집 + 파이프라인 |
| Week 44 | AI 통합 + 배포 + 문서화 |

**산출물**: **최종 포트폴리오 프로젝트**

---

### Month 12: 취업 준비

#### Week 45: 포트폴리오 완성
| 활동 | 내용 |
|------|------|
| GitHub 정리 | README, 코드 리팩토링, 라이선스 |
| 기술 블로그 | 프로젝트 회고, 학습 기록 |
| LinkedIn | 프로필 최적화, 프로젝트 공유 |
| 데모 영상 | 5분 프로젝트 시연 영상 |

#### Week 46: 기술 면접 준비
| 영역 | 내용 |
|------|------|
| Data Engineering | SQL, Spark, 파이프라인 설계 |
| ML/AI | 알고리즘, 평가 지표, 실무 경험 |
| 시스템 디자인 | 확장성, 가용성, 트레이드오프 |
| 코딩 테스트 | LeetCode Medium 수준 |

**실습**: 모의 기술 면접 3회

#### Week 47: 행동 면접 & 지원
| 활동 | 내용 |
|------|------|
| STAR 기법 | 상황-과제-행동-결과 스토리 |
| 자기소개 | 30초, 1분, 3분 버전 |
| 회사 리서치 | 타겟 기업 분석 |
| 지원 | 이력서, 커버레터 |

#### Week 48: 최종 준비 & 수료
| 활동 | 내용 |
|------|------|
| 모의 면접 | 피드백 반영 |
| 연봉 협상 | 시장 조사, 협상 전략 |
| 네트워킹 | 커뮤니티, 밋업 |
| 수료식 | 발표, 네트워킹 |

**산출물**: 취업!

---

## 자격증 로드맵

| 자격증 | 시점 | 비용 |
|--------|------|------|
| AWS Solutions Architect Associate | Month 7 (Week 28) | $150 |
| (선택) Databricks Data Engineer | Month 2 (Week 8) | $200 |
| (선택) Neo4j Certified Professional | Month 6 (Week 24) | 무료 |

---

## 포트폴리오 요약

| # | 프로젝트 | Phase | 기술 스택 |
|---|---------|-------|-----------|
| 1 | E2E 데이터 파이프라인 | Phase 1 | Python, Spark, Airflow, Delta Lake |
| 2 | 데이터 분석 프로젝트 | Phase 2 | pandas, scikit-learn, XGBoost |
| 3 | 지식 그래프 애플리케이션 | Phase 3 | Neo4j, GraphRAG, LangChain |
| 4 | 클라우드 인프라 | Phase 4 | AWS, Terraform, K8s, ArgoCD |
| 5 | AI 애플리케이션 | Phase 5 | RAG, AI Agent, FastAPI |
| 6 | 캡스톤 (도메인 특화) | Phase 6 | 전체 통합 |

---

## 주간 학습 시간

| 항목 | 시간 |
|------|------|
| 이론 학습 (강의/문서) | 8시간 |
| 실습 & 코딩 | 20시간 |
| 프로젝트 작업 | 8시간 |
| 복습 & 퀴즈 | 4시간 |
| **총계** | **40시간/주** |

---

## 선수 과목

| 스킬 | 수준 | 설명 |
|------|------|------|
| Python 기초 | 필수 | 변수, 함수, 클래스, 모듈 |
| SQL 기초 | 필수 | SELECT, JOIN, GROUP BY |
| Git 기초 | 필수 | clone, commit, push, branch |
| 영어 문서 독해 | 권장 | 기술 문서 읽기 가능 |
| 통계 기초 | 권장 | 평균, 분산, 분포 개념 |

---

## v1.0 대비 변경 사항 요약

1. **Phase 2 (데이터 분석 & 마이닝) 신설**: EDA, Feature Engineering, 분류/회귀, 클러스터링, 이상탐지, 시계열
2. **Phase 3 (온톨로지) 완전 재설계**: RDF/OWL 2개월 → Neo4j/Cypher 2개월 + RDF 개념 1-2시간
3. **GraphRAG 추가**: KG + LLM 통합, 최신 트렌드 반영
4. **전통 ML 강화**: Spark ML 1주 → 별도 Phase로 4주
5. **포트폴리오 6개**: 각 Phase별 산출물 명확화
