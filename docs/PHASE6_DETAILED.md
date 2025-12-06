# Phase 6: 산업 프로젝트 & 캡스톤 (8주)

> **Week 41-48** | 실제 산업 도메인에서 FDE 역량 검증
>
> 이 Phase에서는 지금까지 배운 모든 기술을 실제 산업 문제에 적용하고, FDE로서의 역량을 포트폴리오로 증명합니다.

---

## 🚀 Phase 6를 시작하며

Phase 1-5에서 FDE에 필요한 모든 기술을 학습했습니다.

이제 **실제 산업 문제**에 적용할 차례입니다.

Phase 6에서는:
- 산업 도메인 심화 (금융/헬스케어/제조 중 선택)
- 모든 기술을 통합한 캡스톤 프로젝트
- 포트폴리오 완성
- 면접 대비

> **Phase 1-5의 기술 역량 + Phase 6의 도메인 전문성 = FDE Ready**

---

## 📚 Phase 6 전체 목표

이 Phase를 완료하면 다음을 할 수 있습니다:

- [ ] 실제 산업 도메인의 데이터 문제 해결
- [ ] End-to-End 데이터 플랫폼 설계 및 구축
- [ ] 산업별 온톨로지/Knowledge Graph 구축
- [ ] AI 기반 인사이트 시스템 개발
- [ ] 프로덕션 수준의 완성된 프로젝트 포트폴리오
- [ ] FDE 역량 증명 (기술 면접 대비)

---

## Phase 6 구조

```
Week 41-42: 산업 도메인 심화 학습
Week 43-44: 캡스톤 프로젝트 Part 1 (설계 & 데이터)
Week 45-46: 캡스톤 프로젝트 Part 2 (핵심 기능 구현)
Week 47-48: 캡스톤 프로젝트 Part 3 (완성 & 발표)
```

---

## Week 41-42: 산업 도메인 심화 학습

### 학습 목표
- [ ] 3개 산업 도메인 중 1개 선택 및 심화 학습
- [ ] 도메인별 데이터 특성 이해
- [ ] 산업별 온톨로지/표준 학습
- [ ] 도메인 전문가 관점 습득

### 선택 가능한 도메인

#### Option A: 금융/핀테크

```markdown
## 금융 도메인 개요

### 핵심 데이터
- 시장 데이터: 주가, 거래량, 호가
- 거래 데이터: 주문, 체결, 결제
- 리스크 데이터: 신용, 시장, 운영 리스크
- 규제 데이터: 공시, 감독 보고서

### 주요 온톨로지/표준
- **FIBO** (Financial Industry Business Ontology)
  - 금융 상품, 계약, 조직 정의
  - 2,457개 클래스 (2025)
- **FIX Protocol** (거래 메시지 표준)
- **ISO 20022** (금융 메시징 표준)

### 도메인 특수성
- 실시간 처리 요구 (밀리초 단위)
- 규제 준수 필수 (KYC/AML, Basel)
- 높은 데이터 정합성 요구
- 감사 추적 (Audit Trail) 필수

### 참고 자료
- [FIBO GitHub](https://github.com/edmcouncil/fibo)
- [야후 파이낸스 API](https://pypi.org/project/yfinance/)
- [한국거래소 공시 API](https://data.krx.co.kr/)
```

#### Option B: 헬스케어/바이오

```markdown
## 헬스케어 도메인 개요

### 핵심 데이터
- 임상 데이터: EMR/EHR, 진단, 처방
- 유전체 데이터: DNA 시퀀싱, 변이
- 영상 데이터: X-Ray, MRI, CT
- 연구 데이터: 임상시험, 논문

### 주요 온톨로지/표준
- **FHIR** (Fast Healthcare Interoperability Resources)
  - 157개 리소스 (R5 기준)
  - REST API 기반
- **SNOMED-CT** (의학 용어 표준)
- **ICD-10/11** (질병 분류 코드)
- **Gene Ontology** (유전자 기능 분류)

### 도메인 특수성
- 개인정보 보호 (HIPAA, 개인정보보호법)
- 데이터 익명화/가명화 필수
- 높은 정확도 요구 (생명 관련)
- 상호운용성 중요

### 참고 자료
- [FHIR Documentation](https://www.hl7.org/fhir/)
- [SNOMED CT Browser](https://browser.ihtsdotools.org/)
- [Gene Ontology](http://geneontology.org/)
```

#### Option C: 제조/공급망

```markdown
## 제조 도메인 개요

### 핵심 데이터
- IoT 센서 데이터: 온도, 압력, 진동
- 생산 데이터: 작업지시, 실적, 품질
- 설비 데이터: 가동률, 고장, 유지보수
- 공급망 데이터: 주문, 재고, 물류

### 주요 온톨로지/표준
- **OPC-UA** (산업 통신 표준)
- **ISA-95** (제조 통합 표준)
- **Digital Twin** 개념
- **Supply Chain Ontology**

### 도메인 특수성
- 시계열 데이터 중심
- Edge Computing 요구
- 예측 정비 (Predictive Maintenance)
- 실시간 모니터링

### 참고 자료
- [OPC Foundation](https://opcfoundation.org/)
- [ISA-95 Documentation](https://www.isa.org/isa95/)
- [Azure Digital Twins](https://azure.microsoft.com/en-us/products/digital-twins)
```

### 산업별 핵심 문제 유형

| 산업 | 핵심 문제 | 데이터 특성 | 기술 요구 |
|------|----------|------------|----------|
| **금융** | 사기 탐지, 신용 평가, 포트폴리오 최적화 | 정형, 실시간 | 스트리밍, ML |
| **헬스케어** | 질병 예측, 약물 상호작용, 진단 보조 | 비정형, 민감 | NLP, KG |
| **제조** | 예측 정비, 품질 관리, 공급망 최적화 | 시계열, 대용량 | IoT, 시계열 ML |

### 실습: 도메인 리서치 리포트

```markdown
## 과제 6-1: 도메인 리서치 리포트

### 요구사항

1. 3개 도메인 중 1개 선택
2. 리서치 리포트 작성 (A4 10페이지 이상):
   - 도메인 개요 및 시장 현황
   - 핵심 데이터 유형 및 흐름
   - 주요 온톨로지/표준 분석
   - 데이터 문제 및 기회 (3개 이상)
   - FDE로서 해결 가능한 프로젝트 제안

3. 실제 데이터 확보 계획:
   - 공개 데이터셋 조사
   - API 접근 방법
   - 합성 데이터 생성 계획

### 평가 기준
- 도메인 이해도 (30점)
- 기술적 분석 깊이 (30점)
- 프로젝트 실현 가능성 (20점)
- 데이터 확보 계획 (20점)
```

---

## Week 43-44: 캡스톤 프로젝트 Part 1

### 학습 목표
- [ ] 프로젝트 범위 정의 및 설계
- [ ] 데이터 파이프라인 구축
- [ ] 온톨로지/스키마 설계
- [ ] 개발 환경 구성

### 캡스톤 프로젝트 옵션

#### Option A: 금융 인텔리전스 플랫폼

```markdown
## 프로젝트: AI 금융 인텔리전스 플랫폼

### 프로젝트 개요
실시간 금융 데이터를 수집, 분석하여 투자 인사이트를 제공하는
End-to-End 플랫폼 구축

### 기술 스택
- **데이터 수집**: Airflow, Python
- **스트리밍**: Kafka (또는 Kinesis)
- **저장소**: PostgreSQL, Neo4j, Pinecone
- **분석**: Spark, pandas
- **AI**: LangChain, RAG, Multi-Agent
- **인프라**: AWS, Docker, Kubernetes
- **프론트엔드**: Next.js

### 핵심 기능

#### 1. 데이터 파이프라인
- 실시간 주가 수집 (Yahoo Finance API)
- 뉴스 수집 및 분석 (네이버 뉴스 API)
- 공시 데이터 수집 (DART API)
- 재무제표 ETL

#### 2. Knowledge Graph
- FIBO 기반 금융 온톨로지
- 기업 관계 그래프 (경쟁, 공급, 투자)
- 이벤트 영향 전파 추론

#### 3. AI 분석 시스템
- RAG 기반 리포트 Q&A
- GraphRAG 기반 관계 분석
- Multi-Agent 리서치 시스템
- 자동 투자 리포트 생성

#### 4. 대시보드
- 실시간 시장 현황
- Knowledge Graph 시각화
- AI 인사이트 표시
- 알림 시스템

### 데이터 소스
- Yahoo Finance API (무료)
- 네이버 뉴스 API (무료)
- DART 공시 API (무료)
- 한국투자증권 API (무료/유료)

### 아키텍처

┌────────────────────────────────────────────────────────────┐
│                Financial Intelligence Platform              │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  [데이터 소스]                                               │
│  ├── Yahoo Finance API                                     │
│  ├── 네이버 뉴스 API                                        │
│  ├── DART 공시 API                                         │
│  └── 한국투자증권 API                                       │
│                                                             │
│  [데이터 수집 레이어]                                        │
│  ├── Airflow (배치)                                        │
│  └── Kafka/Kinesis (실시간)                                │
│                                                             │
│  [저장 레이어]                                               │
│  ├── PostgreSQL (정형 데이터)                               │
│  ├── Neo4j (Knowledge Graph)                               │
│  └── Pinecone (Vector Store)                               │
│                                                             │
│  [분석 레이어]                                               │
│  ├── Spark/pandas (데이터 분석)                             │
│  ├── RAG Engine (문서 Q&A)                                 │
│  ├── GraphRAG (관계 분석)                                   │
│  └── Multi-Agent (리서치)                                   │
│                                                             │
│  [서비스 레이어]                                             │
│  ├── FastAPI (백엔드)                                       │
│  ├── MCP Server (Claude 연동)                              │
│  └── Next.js (프론트엔드)                                   │
│                                                             │
│  [인프라]                                                    │
│  ├── AWS (EKS, RDS, S3)                                    │
│  ├── Docker/Kubernetes                                     │
│  └── Terraform (IaC)                                       │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

#### Option B: 헬스케어 인사이트 플랫폼

```markdown
## 프로젝트: AI 헬스케어 인사이트 플랫폼

### 프로젝트 개요
의료 데이터를 통합하고 AI로 분석하여 임상 의사결정을 지원하는 플랫폼

### 기술 스택
- **데이터**: FHIR, SNOMED-CT
- **저장소**: PostgreSQL, Neo4j
- **AI**: LangChain, Medical NLP
- **인프라**: AWS (HIPAA 고려)

### 핵심 기능

#### 1. FHIR 데이터 통합
- Patient, Observation, Condition 리소스 처리
- 다양한 EMR 시스템 데이터 통합
- 데이터 정규화 및 매핑

#### 2. Medical Knowledge Graph
- SNOMED-CT 기반 질병-증상 관계
- 약물 상호작용 그래프
- 환자-진단-처방 관계

#### 3. AI 임상 지원
- 유사 환자 검색
- 진단 보조 (증상 기반)
- 약물 상호작용 경고
- 문헌 기반 Q&A (PubMed)

### 데이터 소스 (합성/공개)
- MIMIC-IV (MIT 의료 데이터, 신청 필요)
- Synthea (합성 환자 데이터, 무료)
- PubMed (의학 논문, 무료)
- RxNorm (약물 데이터, 무료)

### 주의사항
- 실제 환자 데이터 사용 불가 (개인정보)
- Synthea로 합성 데이터 생성
- HIPAA 준수 설계 학습
```

#### Option C: 스마트 제조 플랫폼

```markdown
## 프로젝트: AI 스마트 제조 플랫폼

### 프로젝트 개요
제조 IoT 데이터를 분석하여 예측 정비 및 품질 관리를 수행하는 플랫폼

### 기술 스택
- **데이터**: 시계열 센서 데이터
- **스트리밍**: Kafka, Spark Streaming
- **저장소**: TimescaleDB, InfluxDB
- **AI**: 이상탐지, 시계열 예측

### 핵심 기능

#### 1. IoT 데이터 파이프라인
- 센서 데이터 실시간 수집
- Edge 전처리 시뮬레이션
- 시계열 DB 저장

#### 2. 예측 정비
- 이상 탐지 (Isolation Forest, Autoencoder)
- 잔여 수명 예측 (RUL)
- 정비 스케줄링 최적화

#### 3. 품질 관리
- SPC (통계적 공정 관리)
- 불량 예측 및 원인 분석
- Digital Twin 시각화

### 데이터 소스
- NASA Turbofan Engine Degradation (공개)
- SECOM Manufacturing (Kaggle)
- 합성 IoT 데이터 생성
```

### Part 1 마일스톤

```markdown
## Week 43-44 마일스톤

### Week 43: 설계 단계

#### Day 1-2: 프로젝트 정의
- [ ] 프로젝트 범위 문서화 (PRD)
- [ ] 핵심 기능 목록 (MVP 정의)
- [ ] 성공 기준 정의

#### Day 3-4: 아키텍처 설계
- [ ] 시스템 아키텍처 다이어그램
- [ ] 데이터 흐름 다이어그램
- [ ] 기술 스택 확정
- [ ] 인프라 설계 (비용 추정 포함)

#### Day 5: 온톨로지/스키마 설계
- [ ] 도메인 온톨로지 설계
- [ ] DB 스키마 설계
- [ ] API 인터페이스 설계

### Week 44: 데이터 파이프라인

#### Day 1-2: 개발 환경 구성
- [ ] GitHub 저장소 설정
- [ ] Docker Compose 환경
- [ ] CI/CD 파이프라인 기본 구성

#### Day 3-4: 데이터 수집 구현
- [ ] 데이터 소스 연동
- [ ] ETL 파이프라인 구현 (Airflow)
- [ ] 데이터 품질 검증

#### Day 5: 저장소 구축
- [ ] PostgreSQL 스키마 적용
- [ ] Neo4j 초기 데이터 로딩
- [ ] Vector Store 설정

### 산출물
1. 프로젝트 정의서 (PRD)
2. 아키텍처 문서
3. 온톨로지/스키마 문서
4. 동작하는 데이터 파이프라인
5. 개발 환경 (Docker Compose)
```

---

## Week 45-46: 캡스톤 프로젝트 Part 2

### 학습 목표
- [ ] 핵심 기능 구현
- [ ] AI/ML 컴포넌트 개발
- [ ] Knowledge Graph 구축
- [ ] API 개발

### Part 2 마일스톤

```markdown
## Week 45-46 마일스톤

### Week 45: 핵심 기능 구현

#### Day 1-2: Knowledge Graph
- [ ] 온톨로지 Neo4j 구현
- [ ] 데이터 → Triple 변환
- [ ] 기본 추론 규칙 구현
- [ ] 그래프 시각화

#### Day 3-4: RAG 시스템
- [ ] 문서 처리 파이프라인
- [ ] Vector Store 인덱싱
- [ ] RAG Chain 구현
- [ ] 기본 Q&A 테스트

#### Day 5: API 개발
- [ ] FastAPI 엔드포인트 구현
- [ ] 인증/인가
- [ ] API 문서화 (OpenAPI)

### Week 46: AI 기능 구현

#### Day 1-2: Advanced RAG
- [ ] Hybrid Search 구현
- [ ] Re-ranking 적용
- [ ] GraphRAG 연동

#### Day 3-4: Agent 시스템
- [ ] Multi-Agent 설계
- [ ] Tool 구현
- [ ] Agent 테스트

#### Day 5: 통합 테스트
- [ ] E2E 테스트
- [ ] 성능 테스트
- [ ] 버그 수정

### 산출물
1. 동작하는 Knowledge Graph
2. RAG 시스템 (평가 포함)
3. Multi-Agent 시스템
4. API 서버
5. 테스트 결과 리포트
```

### 품질 기준

```markdown
## 캡스톤 품질 기준

### 코드 품질
- [ ] Type hints 적용 (Python)
- [ ] 문서화 (docstring)
- [ ] 단위 테스트 커버리지 ≥ 60%
- [ ] 린팅 통과 (ruff/pylint)

### AI 품질
- [ ] RAG Faithfulness ≥ 0.8
- [ ] RAG Relevancy ≥ 0.75
- [ ] Agent 성공률 ≥ 80%

### 성능
- [ ] API 응답 시간 < 2초 (일반)
- [ ] Agent 응답 시간 < 30초
- [ ] 데이터 파이프라인 SLA 준수

### 보안
- [ ] 인증/인가 구현
- [ ] 입력 검증
- [ ] 민감 정보 보호
```

---

## Week 47-48: 캡스톤 프로젝트 Part 3

### 학습 목표
- [ ] 프론트엔드 및 대시보드 완성
- [ ] 프로덕션 배포
- [ ] 문서화 및 발표 준비
- [ ] 포트폴리오 완성

### Part 3 마일스톤

```markdown
## Week 47-48 마일스톤

### Week 47: 완성 및 배포

#### Day 1-2: 프론트엔드
- [ ] Next.js 대시보드
- [ ] Knowledge Graph 시각화
- [ ] AI 인사이트 UI
- [ ] 반응형 디자인

#### Day 3-4: 배포
- [ ] Kubernetes 배포 (또는 Vercel/Railway)
- [ ] 환경 변수 관리
- [ ] SSL/HTTPS 설정
- [ ] 모니터링 설정

#### Day 5: QA
- [ ] UAT (User Acceptance Test)
- [ ] 버그 수정
- [ ] 성능 최적화

### Week 48: 문서화 및 발표

#### Day 1-2: 문서화
- [ ] README.md 완성
- [ ] 아키텍처 문서 최종화
- [ ] API 문서 완성
- [ ] 배포 가이드

#### Day 3: 데모 준비
- [ ] 데모 시나리오 작성
- [ ] 데모 데이터 준비
- [ ] 스크린캐스트 녹화

#### Day 4-5: 발표
- [ ] 발표 자료 작성 (10-15분)
- [ ] 발표 리허설
- [ ] 최종 발표

### 산출물
1. 배포된 플랫폼 (URL)
2. GitHub 저장소 (완성)
3. 기술 문서
4. 발표 자료
5. 데모 영상 (5-10분)
```

---

## 📊 캡스톤 평가 기준

### 전체 평가 (100점)

```markdown
## 캡스톤 평가 루브릭

### 1. 기술 구현 (40점)

#### 데이터 파이프라인 (10점)
- [ ] 데이터 수집 자동화 (3점)
- [ ] ETL/ELT 파이프라인 (4점)
- [ ] 데이터 품질 검증 (3점)

#### Knowledge Graph (10점)
- [ ] 온톨로지 설계 적절성 (3점)
- [ ] Triple 추출 정확도 (4점)
- [ ] 추론 규칙 구현 (3점)

#### AI/RAG 시스템 (10점)
- [ ] RAG 품질 (Faithfulness ≥ 0.8) (4점)
- [ ] Agent 기능 동작 (3점)
- [ ] 에러 핸들링 (3점)

#### 인프라 (10점)
- [ ] 클라우드 배포 (4점)
- [ ] CI/CD 파이프라인 (3점)
- [ ] 모니터링 (3점)

### 2. 코드 품질 (20점)

- [ ] 코드 가독성/구조 (5점)
- [ ] 테스트 커버리지 (5점)
- [ ] 문서화 (5점)
- [ ] 보안 고려 (5점)

### 3. 비즈니스 가치 (20점)

- [ ] 문제 정의 명확성 (5점)
- [ ] 솔루션 적합성 (5점)
- [ ] 사용자 경험 (5점)
- [ ] 확장 가능성 (5점)

### 4. 발표 및 커뮤니케이션 (20점)

- [ ] 발표 구성 및 흐름 (5점)
- [ ] 기술 설명 명확성 (5점)
- [ ] 데모 품질 (5점)
- [ ] Q&A 대응 (5점)

### 등급 기준
- 90점 이상: A (FDE Ready)
- 80점 이상: B (Good)
- 70점 이상: C (Needs Improvement)
- 70점 미만: D (Incomplete)
```

---

## 📁 포트폴리오 구성

### GitHub 저장소 구조

```
capstone-project/
├── README.md                    # 프로젝트 개요
├── docs/
│   ├── ARCHITECTURE.md          # 아키텍처 문서
│   ├── API.md                   # API 문서
│   ├── DEPLOYMENT.md            # 배포 가이드
│   └── EVALUATION.md            # 평가 결과
├── src/
│   ├── data/                    # 데이터 파이프라인
│   ├── graph/                   # Knowledge Graph
│   ├── ai/                      # AI/RAG/Agent
│   ├── api/                     # Backend API
│   └── web/                     # Frontend
├── tests/                       # 테스트
├── infra/                       # Terraform/K8s
├── docker-compose.yml
└── .github/workflows/           # CI/CD
```

### README.md 템플릿

```markdown
# [프로젝트명]

> [한 줄 설명]

## 데모

- **라이브 데모**: [URL]
- **데모 영상**: [YouTube 링크]

## 스크린샷

[대시보드 스크린샷]

## 기술 스택

| 영역 | 기술 |
|------|------|
| 데이터 파이프라인 | Airflow, Spark, Delta Lake |
| 저장소 | PostgreSQL, Neo4j, Pinecone |
| AI/ML | LangChain, RAG, CrewAI |
| 인프라 | AWS, Kubernetes, Terraform |
| 프론트엔드 | Next.js, Tailwind CSS |

## 아키텍처

[아키텍처 다이어그램]

## 주요 기능

### 1. [기능 1]
- 설명
- 기술적 특징

### 2. [기능 2]
...

## 설치 및 실행

```bash
# 클론
git clone [repo-url]
cd [project]

# 환경 변수
cp .env.example .env

# 실행
docker-compose up -d
```

## API 문서

[Swagger UI 링크]

## 평가 결과

| 메트릭 | 결과 |
|--------|------|
| RAG Faithfulness | 0.85 |
| Agent 성공률 | 82% |
| API 응답 시간 | 1.2초 |

## 배운 점 / 도전

...

## 향후 계획

...

## 라이선스

MIT
```

---

## 📚 면접 대비

### FDE 기술 면접 예상 질문

```markdown
## 데이터 엔지니어링

1. **파이프라인 설계**
   - "데이터 파이프라인 장애 대응 전략은?"
   - "배치 vs 스트리밍 선택 기준은?"
   - "데이터 품질 보장 방법은?"

2. **분산 시스템**
   - "Spark에서 OOM이 발생하면?"
   - "Airflow DAG 설계 원칙은?"
   - "Delta Lake의 ACID는 어떻게 동작하는가?"

## Knowledge Graph

3. **온톨로지**
   - "온톨로지와 스키마의 차이점은?"
   - "Triple Store의 장단점은?"
   - "SPARQL vs Cypher 비교"

4. **Graph 알고리즘**
   - "PageRank의 원리와 활용?"
   - "커뮤니티 탐지 알고리즘?"
   - "GraphRAG가 일반 RAG보다 좋은 경우?"

## GenAI

5. **LLM 활용**
   - "RAG vs Fine-tuning 선택 기준?"
   - "Hallucination 줄이는 방법?"
   - "프롬프트 엔지니어링 기법?"

6. **Agent**
   - "Agent 루프의 동작 원리?"
   - "Multi-Agent 시스템 설계 원칙?"
   - "MCP의 목적과 장점?"

## 클라우드/인프라

7. **AWS**
   - "서버리스 vs 컨테이너 선택 기준?"
   - "VPC 설계 원칙?"
   - "비용 최적화 전략?"

8. **Kubernetes**
   - "Pod vs Deployment vs StatefulSet?"
   - "서비스 메시의 필요성?"
   - "Auto-scaling 전략?"
```

### 포트폴리오 발표 가이드

```markdown
## 10분 발표 구성

### 1. 문제 정의 (2분)
- 어떤 문제를 해결하려 했는가?
- 왜 이 문제가 중요한가?
- 기존 솔루션의 한계는?

### 2. 솔루션 개요 (2분)
- 핵심 아이디어는?
- 어떤 기술을 왜 선택했는가?
- 아키텍처 개요

### 3. 핵심 기술 Deep Dive (3분)
- 가장 도전적이었던 기술적 문제
- 어떻게 해결했는가?
- 배운 점

### 4. 데모 (2분)
- 핵심 기능 시연
- 실제 동작 화면

### 5. 결과 및 향후 계획 (1분)
- 정량적 성과
- 개선 계획
- Q&A 유도

### 발표 팁
- 기술적 깊이와 비즈니스 가치 균형
- "왜"에 집중 (기술 선택 이유)
- 실패 경험도 솔직하게
- 데모는 사전에 충분히 테스트
```

---

## ✅ Phase 6 완료 체크리스트

Phase 6를 완료하면 다음을 보유해야 합니다:

### 산출물
- [ ] 완성된 캡스톤 프로젝트 (GitHub)
- [ ] 배포된 라이브 서비스
- [ ] 기술 문서 (아키텍처, API, 배포)
- [ ] 데모 영상 (5-10분)
- [ ] 발표 자료

### 역량
- [ ] 산업 도메인 지식
- [ ] End-to-End 시스템 설계 능력
- [ ] 프로덕션 배포 경험
- [ ] 기술 커뮤니케이션 능력
- [ ] FDE 면접 대비

### 포트폴리오
- [ ] Phase 1: 데이터 파이프라인 프로젝트
- [ ] Phase 2: 이상탐지 시스템
- [ ] Phase 3: Knowledge Graph 시스템
- [ ] Phase 4: 클라우드 네이티브 프로젝트
- [ ] Phase 5: AI 어시스턴트
- [ ] Phase 6: 캡스톤 (통합 프로젝트)

---

## 🎓 FDE Academy 수료 후

### 커리어 경로

```
                    ┌─────────────────────┐
                    │   FDE Academy 수료   │
                    └─────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
           ▼                  ▼                  ▼
    ┌────────────┐    ┌────────────┐    ┌────────────┐
    │    FDE     │    │   Data     │    │    AI      │
    │  (현장 배치) │    │  Engineer  │    │  Engineer  │
    └────────────┘    └────────────┘    └────────────┘
           │                  │                  │
           │                  │                  │
           ▼                  ▼                  ▼
    ┌────────────┐    ┌────────────┐    ┌────────────┐
    │  Solutions │    │    Lead    │    │    ML      │
    │  Architect │    │  Engineer  │    │  Engineer  │
    └────────────┘    └────────────┘    └────────────┘
```

### 추천 자격증

| 자격증 | 난이도 | 추천 시기 |
|--------|--------|----------|
| AWS SAA | 중 | Phase 4 후 |
| AWS Data Analytics | 중상 | Phase 6 후 |
| Databricks Data Engineer | 중상 | Phase 6 후 |
| Neo4j Certified | 중 | Phase 3 후 |
| GCP Professional Data Engineer | 상 | 취업 후 |

### 지속적 학습

```markdown
## 추천 학습 경로

### 1. 심화 기술
- MLOps (MLflow, Kubeflow)
- 실시간 ML (Feature Store)
- LLMOps (프롬프트 관리, 평가)

### 2. 도메인 전문화
- 금융: Quant 개발
- 헬스케어: FDA 규제, 임상시험
- 제조: Digital Twin, 로보틱스

### 3. 리더십
- 아키텍처 설계
- 팀 리딩
- 기술 컨설팅
```

---

## 📚 추가 학습 자료

### 필수 도서

1. **Designing Data-Intensive Applications** (O'Reilly)
   - 분산 시스템 원리 (필독)

2. **Building Machine Learning Pipelines** (O'Reilly)
   - MLOps 실무

3. **Knowledge Graphs** (MIT Press)
   - KG 이론 및 응용

### 온라인 리소스

- [DataEngBytes](https://dataengbytes.com/) - 데이터 엔지니어링 커뮤니티
- [Locally Optimistic](https://locallyoptimistic.com/) - 데이터 리더십
- [AI Engineering](https://www.latent.space/) - AI 엔지니어링 팟캐스트

### 커뮤니티

- dbt Community (Slack)
- LangChain Discord
- MLOps Community

---

*작성일: 2025-12-05*
*버전: v1.0*
*FDE Academy 커리큘럼 최종본*
