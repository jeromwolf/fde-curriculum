// Phase 6, Week 2: 캡스톤 프로젝트 정의
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'project-ideation',
  title: '프로젝트 아이디어 구체화',
  totalDuration: 180,
  tasks: [
    {
      id: 'capstone-options-reading',
      type: 'reading',
      title: '캡스톤 프로젝트 옵션 분석',
      duration: 45,
      content: {
        objectives: [
          '도메인별 캡스톤 프로젝트 옵션을 분석한다',
          '자신의 강점과 관심사에 맞는 프로젝트를 선택한다',
          'MVP 범위를 현실적으로 설정한다'
        ],
        markdown: `
## 캡스톤 프로젝트 옵션

### Option A: 금융 인텔리전스 플랫폼

\`\`\`
프로젝트: AI 금융 인텔리전스 플랫폼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

목표: 실시간 금융 데이터를 수집, 분석하여
      투자 인사이트를 제공하는 End-to-End 플랫폼

핵심 기능:
├── 데이터 파이프라인
│   ├── 실시간 주가 수집 (Yahoo Finance)
│   ├── 뉴스 수집 및 감성 분석
│   └── 공시 데이터 ETL (DART)
│
├── Knowledge Graph
│   ├── FIBO 기반 금융 온톨로지
│   ├── 기업 관계 그래프 (경쟁, 공급, 투자)
│   └── 이벤트 영향 전파 추론
│
├── AI 분석 시스템
│   ├── RAG 기반 리포트 Q&A
│   ├── GraphRAG 관계 분석
│   └── Multi-Agent 리서치
│
└── 대시보드
    ├── 실시간 시장 현황
    ├── Knowledge Graph 시각화
    └── AI 인사이트 표시
\`\`\`

**참고 GitHub 프로젝트**:
- [FinGPT](https://github.com/AI4Finance-Foundation/FinGPT) - 금융 LLM
- [OpenBB](https://github.com/OpenBB-finance/OpenBB) - 투자 리서치 플랫폼
- [Qlib](https://github.com/microsoft/qlib) - 퀀트 투자 플랫폼

### Option B: 헬스케어 인사이트 플랫폼

\`\`\`
프로젝트: AI 헬스케어 인사이트 플랫폼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

목표: 의료 데이터를 통합하고 AI로 분석하여
      임상 의사결정을 지원하는 플랫폼

핵심 기능:
├── FHIR 데이터 통합
│   ├── Patient, Observation, Condition 처리
│   ├── 다양한 소스 데이터 정규화
│   └── Synthea 합성 데이터 활용
│
├── Medical Knowledge Graph
│   ├── SNOMED-CT 기반 질병-증상 관계
│   ├── 약물 상호작용 그래프
│   └── 환자-진단-처방 관계
│
├── AI 임상 지원
│   ├── 유사 환자 검색
│   ├── 진단 보조 (증상 기반)
│   └── 문헌 기반 Q&A (PubMed)
│
└── 대시보드
    ├── 환자 타임라인
    ├── Knowledge Graph 탐색
    └── AI 추천 표시
\`\`\`

**참고 GitHub 프로젝트**:
- [Synthea](https://github.com/synthetichealth/synthea) - 합성 환자 데이터
- [MedCAT](https://github.com/CogStack/MedCAT) - 의료 NER
- [PrimeKG](https://github.com/mims-harvard/PrimeKG) - 의학 Knowledge Graph

### Option C: 스마트 제조 플랫폼

\`\`\`
프로젝트: AI 스마트 제조 플랫폼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

목표: 제조 IoT 데이터를 분석하여
      예측 정비 및 품질 관리를 수행하는 플랫폼

핵심 기능:
├── IoT 데이터 파이프라인
│   ├── 센서 데이터 실시간 수집
│   ├── Edge 전처리 시뮬레이션
│   └── 시계열 DB 저장
│
├── 예측 정비 시스템
│   ├── 이상 탐지 (Isolation Forest)
│   ├── 잔여 수명 예측 (RUL)
│   └── 정비 스케줄링
│
├── 품질 관리 시스템
│   ├── SPC (통계적 공정 관리)
│   ├── 불량 예측
│   └── 원인 분석
│
└── Digital Twin 대시보드
    ├── 실시간 설비 상태
    ├── 예측 알림
    └── 3D 시각화 (선택)
\`\`\`

**참고 GitHub 프로젝트**:
- [Eclipse Ditto](https://github.com/eclipse/ditto) - Digital Twin
- [tsai](https://github.com/timeseriesAI/tsai) - 시계열 AI
- [pyod](https://github.com/yzhao062/pyod) - 이상 탐지

### 난이도 & 시간 비교

| 옵션 | 난이도 | 데이터 확보 | 고유 기술 | 포트폴리오 가치 |
|------|--------|------------|----------|----------------|
| **금융** | ★★★☆☆ | 쉬움 (API) | 실시간, KG | 높음 (핀테크) |
| **헬스케어** | ★★★★☆ | 중간 (합성) | FHIR, NLP | 높음 (디지털헬스) |
| **제조** | ★★★★★ | 어려움 (시뮬) | IoT, 시계열 | 높음 (스마트팩토리) |
        `,
        externalLinks: [
          { title: 'FinGPT GitHub', url: 'https://github.com/AI4Finance-Foundation/FinGPT' },
          { title: 'Synthea GitHub', url: 'https://github.com/synthetichealth/synthea' },
          { title: 'Eclipse Ditto', url: 'https://github.com/eclipse/ditto' }
        ]
      }
    },
    {
      id: 'project-canvas',
      type: 'project',
      title: '프로젝트 캔버스 작성',
      duration: 60,
      content: {
        objectives: [
          '프로젝트의 전체 그림을 한 페이지로 정리한다',
          '핵심 가치 제안을 명확히 한다',
          '이해관계자와 사용자를 정의한다'
        ],
        requirements: [
          '**프로젝트 캔버스 (1페이지)**',
          '',
          '┌────────────────────────────────────────────────────────┐',
          '│                    프로젝트 이름                        │',
          '├────────────────────────────────────────────────────────┤',
          '│                                                        │',
          '│  [문제]              │  [솔루션]                       │',
          '│  어떤 문제를         │  어떻게 해결하나?                │',
          '│  해결하나?           │                                 │',
          '│                      │                                 │',
          '├──────────────────────┼─────────────────────────────────┤',
          '│  [타겟 사용자]       │  [핵심 가치 제안]               │',
          '│  누구를 위한         │  왜 우리 솔루션을               │',
          '│  솔루션인가?         │  사용해야 하나?                 │',
          '│                      │                                 │',
          '├──────────────────────┼─────────────────────────────────┤',
          '│  [핵심 기능 (MVP)]   │  [기술 스택]                    │',
          '│  1.                  │  - 데이터:                      │',
          '│  2.                  │  - AI:                          │',
          '│  3.                  │  - 인프라:                      │',
          '│                      │                                 │',
          '├──────────────────────┴─────────────────────────────────┤',
          '│  [성공 지표]                                           │',
          '│  - 정량적:                                             │',
          '│  - 정성적:                                             │',
          '└────────────────────────────────────────────────────────┘'
        ],
        evaluationCriteria: [
          '문제-솔루션 적합성',
          '가치 제안의 명확성',
          'MVP 범위의 현실성'
        ]
      }
    },
    {
      id: 'user-stories',
      type: 'project',
      title: '사용자 스토리 작성',
      duration: 45,
      content: {
        objectives: [
          '핵심 사용자 페르소나를 정의한다',
          '사용자 스토리를 작성한다',
          '우선순위를 결정한다'
        ],
        requirements: [
          '**사용자 페르소나 (2-3개)**',
          '',
          '## 페르소나 1: [이름]',
          '- 역할:',
          '- 배경:',
          '- 목표:',
          '- 고충점 (Pain Points):',
          '',
          '**사용자 스토리 (10개 이상)**',
          '',
          '형식: "As a [사용자], I want to [행동] so that [가치]"',
          '',
          '| ID | 사용자 스토리 | 우선순위 | MVP |',
          '|----|--------------|---------|-----|',
          '| US-1 | As a 투자자, I want to 기업 관계를 시각화해서 볼 수 있도록 so that 투자 결정에 참고할 수 있다 | 높음 | ✓ |',
          '| US-2 | ... | ... | ... |',
          '',
          '**우선순위 기준**:',
          '- MoSCoW: Must / Should / Could / Won\'t',
          '- 또는: 높음 / 중간 / 낮음'
        ],
        evaluationCriteria: [
          '페르소나의 구체성',
          '사용자 스토리의 명확성',
          '우선순위 결정의 논리성'
        ]
      }
    },
    {
      id: 'competitive-analysis',
      type: 'project',
      title: '경쟁 솔루션 분석',
      duration: 30,
      content: {
        objectives: [
          '유사 솔루션을 조사한다',
          '차별화 포인트를 도출한다',
          '벤치마킹 기준을 설정한다'
        ],
        requirements: [
          '**경쟁 분석 매트릭스**',
          '',
          '| 기준 | 우리 프로젝트 | 경쟁 A | 경쟁 B | 경쟁 C |',
          '|------|-------------|--------|--------|--------|',
          '| 핵심 기능 | | | | |',
          '| 타겟 사용자 | | | | |',
          '| 기술 스택 | | | | |',
          '| 데이터 소스 | | | | |',
          '| 가격/접근성 | | | | |',
          '| 차별점 | | | | |',
          '',
          '**우리의 차별화 포인트**:',
          '1. ...',
          '2. ...',
          '3. ...'
        ],
        evaluationCriteria: [
          '분석의 깊이',
          '차별화 포인트의 명확성'
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'prd-writing',
  title: 'PRD (Product Requirements Document) 작성',
  totalDuration: 180,
  tasks: [
    {
      id: 'prd-template-reading',
      type: 'reading',
      title: 'PRD 작성 가이드',
      duration: 30,
      content: {
        objectives: [
          'PRD의 구성요소를 이해한다',
          '효과적인 요구사항 작성 방법을 학습한다',
          '실제 기업의 PRD 예시를 분석한다'
        ],
        markdown: `
## PRD (Product Requirements Document) 가이드

### PRD란?

\`\`\`
PRD = 무엇을(What) + 왜(Why) 만드는지 정의하는 문서
     (어떻게(How)는 기술 설계 문서에서)

PRD의 목적:
├── 팀 간 명확한 커뮤니케이션
├── 범위 결정 및 우선순위 설정
├── 개발 방향 가이드
└── 성공 기준 정의
\`\`\`

### PRD 구조

\`\`\`
1. Overview (개요)
   ├── 프로젝트 배경
   ├── 목표 및 목적
   └── 성공 지표

2. Problem Statement (문제 정의)
   ├── 현재 상황
   ├── 문제점
   └── 기회

3. Solution (솔루션)
   ├── 제안 솔루션 개요
   ├── 핵심 가치 제안
   └── MVP 범위

4. User Requirements (사용자 요구사항)
   ├── 타겟 사용자
   ├── 사용자 스토리
   └── 사용자 여정 (User Journey)

5. Functional Requirements (기능 요구사항)
   ├── 핵심 기능
   ├── 부가 기능
   └── 제외 기능

6. Non-Functional Requirements (비기능 요구사항)
   ├── 성능
   ├── 확장성
   ├── 보안
   └── 접근성

7. Technical Considerations (기술 고려사항)
   ├── 기술 스택
   ├── 통합 요구사항
   └── 기술적 제약

8. Timeline & Milestones (일정)
   ├── 마일스톤
   ├── 의존성
   └── 리스크

9. Success Metrics (성공 지표)
   ├── KPI 정의
   ├── 측정 방법
   └── 목표값

10. Appendix (부록)
    ├── 와이어프레임
    ├── 데이터 모델
    └── 참고 자료
\`\`\`

### 좋은 요구사항의 특성 (SMART)

\`\`\`
S - Specific (구체적)
    ❌ "빠른 응답 시간"
    ✅ "API 응답 시간 < 2초 (p95)"

M - Measurable (측정 가능)
    ❌ "좋은 사용자 경험"
    ✅ "첫 화면 로딩 < 3초"

A - Achievable (달성 가능)
    ❌ "모든 언어 지원"
    ✅ "한국어, 영어 지원"

R - Relevant (관련성)
    ❌ "소셜 로그인 지원" (B2B 서비스에서)
    ✅ "SSO 연동 지원"

T - Time-bound (기한)
    ❌ "추후 지원 예정"
    ✅ "MVP에서 제외, Phase 2에서 지원"
\`\`\`

### 참고할 PRD 템플릿

| 회사 | 특징 | 링크 |
|------|------|------|
| Notion | 상세하고 구조화 | [PRD Template](https://www.notion.so/templates/product-requirements-document) |
| Coda | 인터랙티브 | [PRD Template](https://coda.io/t/product-requirements-document) |
| Atlassian | 애자일 친화적 | [PRD Guide](https://www.atlassian.com/agile/product-management/requirements) |
        `,
        externalLinks: [
          { title: 'Notion PRD Template', url: 'https://www.notion.so/templates/product-requirements-document' },
          { title: 'Atlassian PRD Guide', url: 'https://www.atlassian.com/agile/product-management/requirements' }
        ]
      }
    },
    {
      id: 'prd-writing-project',
      type: 'project',
      title: 'PRD 작성',
      duration: 120,
      content: {
        objectives: [
          '캡스톤 프로젝트의 PRD를 작성한다',
          '요구사항을 명확히 정의한다',
          '성공 기준을 구체화한다'
        ],
        requirements: [
          '**PRD (Product Requirements Document)**',
          '',
          '# [프로젝트 이름] PRD',
          '',
          '## 1. Overview',
          '### 1.1 배경',
          '### 1.2 목표',
          '### 1.3 성공 지표 요약',
          '',
          '## 2. Problem Statement',
          '### 2.1 현재 상황',
          '### 2.2 문제점',
          '### 2.3 기회',
          '',
          '## 3. Solution',
          '### 3.1 제안 솔루션',
          '### 3.2 핵심 가치 제안',
          '### 3.3 MVP 범위',
          '',
          '## 4. User Requirements',
          '### 4.1 타겟 사용자',
          '### 4.2 사용자 스토리',
          '### 4.3 사용자 여정',
          '',
          '## 5. Functional Requirements',
          '',
          '| ID | 기능 | 설명 | 우선순위 | MVP |',
          '|----|------|------|---------|-----|',
          '| FR-1 | 데이터 수집 | ... | 높음 | ✓ |',
          '| FR-2 | Knowledge Graph | ... | 높음 | ✓ |',
          '| ... | ... | ... | ... | ... |',
          '',
          '## 6. Non-Functional Requirements',
          '',
          '| ID | 항목 | 요구사항 |',
          '|----|------|---------|',
          '| NFR-1 | 성능 | API 응답 < 2초 |',
          '| NFR-2 | 가용성 | 99% uptime |',
          '| ... | ... | ... |',
          '',
          '## 7. Technical Considerations',
          '### 7.1 기술 스택',
          '### 7.2 통합 요구사항',
          '### 7.3 제약 조건',
          '',
          '## 8. Timeline',
          '',
          '| Week | 마일스톤 | 산출물 |',
          '|------|---------|--------|',
          '| Week 3-4 | 데이터 파이프라인 | 동작하는 ETL |',
          '| Week 5-6 | 핵심 기능 | KG, RAG, Agent |',
          '| Week 7-8 | 완성 & 배포 | 라이브 서비스 |',
          '',
          '## 9. Success Metrics',
          '',
          '| 지표 | 측정 방법 | 목표값 |',
          '|------|----------|--------|',
          '| RAG 품질 | Faithfulness | ≥ 0.8 |',
          '| 응답 시간 | p95 Latency | < 2초 |',
          '| ... | ... | ... |',
          '',
          '## 10. Appendix',
          '### 10.1 와이어프레임',
          '### 10.2 데이터 모델',
          '### 10.3 참고 자료'
        ],
        evaluationCriteria: [
          'PRD의 완성도',
          '요구사항의 구체성 (SMART)',
          '현실적인 범위 설정'
        ]
      }
    },
    {
      id: 'wireframe-sketch',
      type: 'project',
      title: '와이어프레임 스케치',
      duration: 30,
      content: {
        objectives: [
          '핵심 화면의 와이어프레임을 스케치한다',
          '사용자 흐름을 시각화한다',
          '기능과 UI의 연결을 확인한다'
        ],
        requirements: [
          '**와이어프레임 (손스케치 또는 도구 사용)**',
          '',
          '## 필수 화면',
          '',
          '### 1. 메인 대시보드',
          '- 핵심 지표 카드',
          '- 최근 인사이트',
          '- 빠른 액션 버튼',
          '',
          '### 2. Knowledge Graph 탐색',
          '- 그래프 시각화 영역',
          '- 필터/검색',
          '- 노드 상세 패널',
          '',
          '### 3. AI 분석 화면',
          '- 질문 입력',
          '- 응답 표시',
          '- 소스 참조',
          '',
          '**도구 추천**:',
          '- [Excalidraw](https://excalidraw.com/) - 손스케치 스타일',
          '- [Figma](https://figma.com/) - 상세 디자인',
          '- [Balsamiq](https://balsamiq.com/) - 로우파이'
        ],
        evaluationCriteria: [
          '핵심 화면 포함 여부',
          '사용자 흐름의 논리성'
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'architecture-design',
  title: '아키텍처 상세 설계',
  totalDuration: 180,
  tasks: [
    {
      id: 'architecture-patterns-reading',
      type: 'reading',
      title: '아키텍처 패턴 학습',
      duration: 45,
      content: {
        objectives: [
          '데이터 플랫폼 아키텍처 패턴을 학습한다',
          '선택한 패턴의 장단점을 이해한다',
          '프로젝트에 적합한 패턴을 결정한다'
        ],
        markdown: `
## 데이터 플랫폼 아키텍처 패턴

### 1. Lambda Architecture

\`\`\`
       ┌─────────────────────────────────────┐
       │          Data Source                │
       └─────────────┬───────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│ Batch Layer  │          │ Speed Layer  │
│  (Spark)     │          │  (Flink)     │
└──────────────┘          └──────────────┘
        │                         │
        └────────────┬────────────┘
                     │
                     ▼
           ┌──────────────┐
           │ Serving Layer│
           │  (Query)     │
           └──────────────┘

장점: 재처리 가능, 정확성
단점: 복잡도, 코드 중복
\`\`\`

### 2. Kappa Architecture

\`\`\`
       ┌─────────────────────────────────────┐
       │          Data Source                │
       └─────────────┬───────────────────────┘
                     │
                     ▼
           ┌──────────────┐
           │  Streaming   │
           │   (Kafka)    │
           └──────────────┘
                     │
                     ▼
           ┌──────────────┐
           │   Process    │
           │   (Flink)    │
           └──────────────┘
                     │
                     ▼
           ┌──────────────┐
           │   Serving    │
           │              │
           └──────────────┘

장점: 단순함, 단일 코드베이스
단점: 대규모 재처리 어려움
\`\`\`

### 3. Lakehouse Architecture (추천)

\`\`\`
       ┌─────────────────────────────────────┐
       │       Multiple Data Sources         │
       └─────────────┬───────────────────────┘
                     │
                     ▼
           ┌──────────────┐
           │   Ingestion  │
           │  (Airbyte)   │
           └──────────────┘
                     │
                     ▼
           ┌──────────────┐
           │  Data Lake   │
           │ (Delta Lake) │  ← ACID, Time Travel
           └──────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌────────┐   ┌────────┐   ┌────────┐
   │  SQL   │   │   ML   │   │  BI    │
   │ Engine │   │        │   │        │
   └────────┘   └────────┘   └────────┘

장점: 단일 저장소, 유연성, ACID
적합: 중소규모 프로젝트
\`\`\`

### 캡스톤 추천 아키텍처

\`\`\`
┌──────────────────────────────────────────────────────────┐
│                  Capstone Architecture                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  [Data Sources]                                           │
│  ├── APIs (Yahoo Finance, DART, News)                    │
│  ├── Files (CSV, JSON)                                   │
│  └── Databases (External)                                │
│              │                                            │
│              ▼                                            │
│  [Ingestion Layer]                                        │
│  ├── Airflow (Orchestration)                             │
│  └── Python Scripts (ETL)                                │
│              │                                            │
│              ▼                                            │
│  [Storage Layer]                                          │
│  ├── PostgreSQL (Structured Data)                        │
│  ├── Neo4j (Knowledge Graph)                             │
│  ├── ChromaDB/Pinecone (Vector Store)                    │
│  └── MinIO/S3 (Files)                                    │
│              │                                            │
│              ▼                                            │
│  [Processing Layer]                                       │
│  ├── dbt (Transformations)                               │
│  └── Pandas/Spark (Analysis)                             │
│              │                                            │
│              ▼                                            │
│  [AI Layer]                                               │
│  ├── LangChain (RAG, Chains)                             │
│  ├── LangGraph (Agents)                                  │
│  └── OpenAI/Claude (LLM)                                 │
│              │                                            │
│              ▼                                            │
│  [Service Layer]                                          │
│  ├── FastAPI (Backend)                                   │
│  ├── Redis (Cache)                                       │
│  └── Next.js (Frontend)                                  │
│              │                                            │
│              ▼                                            │
│  [Infrastructure]                                         │
│  ├── Docker Compose (Local)                              │
│  ├── GitHub Actions (CI/CD)                              │
│  └── Vercel/Railway/AWS (Deploy)                         │
│                                                           │
└──────────────────────────────────────────────────────────┘
\`\`\`

### 참고 GitHub 아키텍처

| 프로젝트 | 아키텍처 특징 |
|---------|--------------|
| [data-engineering-zoomcamp](https://github.com/DataTalksClub/data-engineering-zoomcamp) | 종합 데이터 엔지니어링 |
| [airbyte](https://github.com/airbytehq/airbyte) | 데이터 통합 플랫폼 |
| [dagster](https://github.com/dagster-io/dagster) | 데이터 오케스트레이션 |
| [dbt-core](https://github.com/dbt-labs/dbt-core) | 데이터 변환 |
        `,
        externalLinks: [
          { title: 'Data Engineering Zoomcamp', url: 'https://github.com/DataTalksClub/data-engineering-zoomcamp' },
          { title: 'Airbyte', url: 'https://github.com/airbytehq/airbyte' },
          { title: 'Dagster', url: 'https://github.com/dagster-io/dagster' }
        ]
      }
    },
    {
      id: 'architecture-document-project',
      type: 'project',
      title: '아키텍처 문서 작성',
      duration: 90,
      content: {
        objectives: [
          '캡스톤 프로젝트의 상세 아키텍처를 문서화한다',
          '컴포넌트 간 인터페이스를 정의한다',
          '기술적 결정의 근거를 기록한다'
        ],
        requirements: [
          '**아키텍처 설계 문서 (Architecture Design Document)**',
          '',
          '# [프로젝트] 아키텍처 설계',
          '',
          '## 1. 아키텍처 개요',
          '### 1.1 시스템 컨텍스트 다이어그램',
          '### 1.2 설계 원칙',
          '### 1.3 주요 결정 사항 (ADR)',
          '',
          '## 2. 시스템 아키텍처',
          '### 2.1 전체 아키텍처 다이어그램',
          '```mermaid',
          'graph TB',
          '    A[Data Sources] --> B[Ingestion]',
          '    B --> C[Storage]',
          '    C --> D[Processing]',
          '    D --> E[AI Layer]',
          '    E --> F[API]',
          '    F --> G[Frontend]',
          '```',
          '',
          '### 2.2 컴포넌트 상세',
          '',
          '| 컴포넌트 | 기술 | 역할 | 인터페이스 |',
          '|---------|------|------|----------|',
          '| Ingestion | Airflow | 데이터 수집 | REST API |',
          '| Storage | PostgreSQL | 정형 데이터 | SQL |',
          '| Graph | Neo4j | Knowledge Graph | Cypher |',
          '| ... | ... | ... | ... |',
          '',
          '## 3. 데이터 아키텍처',
          '### 3.1 데이터 흐름 다이어그램',
          '### 3.2 데이터 모델 (ERD)',
          '### 3.3 Knowledge Graph 스키마',
          '',
          '## 4. AI 아키텍처',
          '### 4.1 RAG 파이프라인',
          '### 4.2 Agent 시스템',
          '### 4.3 프롬프트 전략',
          '',
          '## 5. 인프라 아키텍처',
          '### 5.1 배포 환경',
          '### 5.2 CI/CD 파이프라인',
          '### 5.3 모니터링',
          '',
          '## 6. 보안 아키텍처',
          '### 6.1 인증/인가',
          '### 6.2 데이터 보호',
          '',
          '## 7. 기술적 결정 기록 (ADR)',
          '',
          '### ADR-001: [결정 제목]',
          '- **상태**: 승인/제안/폐기',
          '- **컨텍스트**: 왜 이 결정이 필요했나?',
          '- **결정**: 무엇을 결정했나?',
          '- **결과**: 어떤 영향이 있나?',
          '- **대안**: 고려한 다른 옵션은?'
        ],
        evaluationCriteria: [
          '아키텍처의 명확성',
          '컴포넌트 간 인터페이스 정의',
          '기술적 결정의 근거'
        ]
      }
    },
    {
      id: 'data-model-design',
      type: 'project',
      title: '데이터 모델 설계',
      duration: 45,
      content: {
        objectives: [
          '정형 데이터의 스키마를 설계한다',
          'Knowledge Graph의 온톨로지를 정의한다',
          '데이터 흐름을 명확히 한다'
        ],
        requirements: [
          '**데이터 모델 설계 문서**',
          '',
          '## 1. 정형 데이터 스키마 (PostgreSQL)',
          '',
          '```sql',
          '-- 예시: 금융 도메인',
          'CREATE TABLE companies (',
          '    id SERIAL PRIMARY KEY,',
          '    ticker VARCHAR(10) UNIQUE,',
          '    name VARCHAR(200),',
          '    sector VARCHAR(100),',
          '    created_at TIMESTAMP DEFAULT NOW()',
          ');',
          '',
          'CREATE TABLE stock_prices (',
          '    id SERIAL PRIMARY KEY,',
          '    company_id INTEGER REFERENCES companies(id),',
          '    date DATE,',
          '    open_price DECIMAL(10,2),',
          '    close_price DECIMAL(10,2),',
          '    volume BIGINT',
          ');',
          '```',
          '',
          '## 2. Knowledge Graph 온톨로지',
          '',
          '```',
          '노드 타입:',
          '├── Company',
          '├── Person',
          '├── Event',
          '└── Document',
          '',
          '엣지 타입:',
          '├── COMPETES_WITH',
          '├── SUPPLIES_TO',
          '├── INVESTED_IN',
          '└── MENTIONED_IN',
          '```',
          '',
          '## 3. 데이터 흐름 매핑',
          '',
          '| 소스 | 변환 | 대상 | 주기 |',
          '|------|------|------|------|',
          '| Yahoo Finance | 정규화 | stock_prices | 실시간 |',
          '| DART | 파싱 → NER | Neo4j | 일 1회 |',
          '| ... | ... | ... | ... |'
        ],
        evaluationCriteria: [
          '스키마의 적절성',
          '온톨로지 설계의 명확성',
          '데이터 흐름의 논리성'
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'tech-validation',
  title: '기술 스택 검증 (PoC)',
  totalDuration: 180,
  tasks: [
    {
      id: 'poc-planning',
      type: 'reading',
      title: 'PoC 계획 수립',
      duration: 30,
      content: {
        objectives: [
          'PoC의 목적과 범위를 이해한다',
          '검증해야 할 기술적 리스크를 식별한다',
          'PoC 계획을 수립한다'
        ],
        markdown: `
## PoC (Proof of Concept) 가이드

### PoC란?

\`\`\`
PoC = 핵심 기술 가설을 최소 비용으로 검증

목적:
├── 기술적 실현 가능성 확인
├── 리스크 조기 발견
├── 팀 학습
└── 이해관계자 설득
\`\`\`

### 검증해야 할 것들

**공통**:
- [ ] LLM API 연동 (OpenAI/Claude)
- [ ] Neo4j 연결 및 쿼리
- [ ] Vector Store 연동 (Chroma/Pinecone)
- [ ] RAG 기본 파이프라인

**금융 도메인**:
- [ ] Yahoo Finance API 데이터 수집
- [ ] 뉴스 감성 분석
- [ ] 기업 관계 Triple 추출

**헬스케어 도메인**:
- [ ] Synthea 데이터 생성 및 파싱
- [ ] FHIR 리소스 처리
- [ ] 의료 NER (증상, 진단)

**제조 도메인**:
- [ ] 시계열 데이터 생성/처리
- [ ] 이상 탐지 알고리즘
- [ ] 시계열 예측 모델

### PoC 범위 설정

\`\`\`
좋은 PoC:
├── 1-2일 내 완료 가능
├── 핵심 기술 1-2개에 집중
├── 성공/실패 기준 명확
└── 재사용 가능한 코드

나쁜 PoC:
├── 전체 시스템 구현 시도
├── 완벽한 에러 핸들링
├── UI 개발
└── 최적화
\`\`\`
        `
      }
    },
    {
      id: 'poc-implementation',
      type: 'code',
      title: 'PoC 구현',
      duration: 120,
      content: {
        objectives: [
          '핵심 기술 통합을 검증한다',
          '예상 문제점을 조기에 발견한다',
          'PoC 결과를 문서화한다'
        ],
        instructions: `
## PoC 구현 가이드

### PoC 1: LLM + Knowledge Graph 통합

\`\`\`python
# poc_llm_kg.py
from neo4j import GraphDatabase
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

# Neo4j 연결
driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=("neo4j", "password")
)

# LLM 설정
llm = ChatOpenAI(model="gpt-4o-mini")

# Knowledge Graph 쿼리 함수
def query_kg(question: str) -> str:
    """질문에서 엔티티를 추출하고 KG 쿼리"""
    # 1. 엔티티 추출
    extract_prompt = ChatPromptTemplate.from_template(
        "Extract company names from: {question}"
    )
    entities = llm.invoke(extract_prompt.format(question=question))

    # 2. Cypher 쿼리
    with driver.session() as session:
        result = session.run("""
            MATCH (c:Company {name: $name})-[r]->(related)
            RETURN type(r) as relation, related.name as target
            LIMIT 10
        """, name=entities.content)
        return list(result)

# 테스트
result = query_kg("삼성전자와 관련된 기업은?")
print(result)
\`\`\`

### PoC 2: RAG 파이프라인

\`\`\`python
# poc_rag.py
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA

# 문서 로딩 및 분할
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

# 테스트 문서
docs = text_splitter.create_documents([
    "삼성전자는 한국의 대표적인 전자회사로...",
    "SK하이닉스는 메모리 반도체 분야에서..."
])

# Vector Store 생성
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(docs, embeddings)

# RAG Chain
llm = ChatOpenAI(model="gpt-4o-mini")
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# 테스트
result = qa_chain.invoke("삼성전자에 대해 알려줘")
print(result)
\`\`\`

### PoC 3: 도메인별 데이터 수집

\`\`\`python
# poc_data_collection.py

# 금융: Yahoo Finance
import yfinance as yf
ticker = yf.Ticker("005930.KS")  # 삼성전자
print(ticker.info)
print(ticker.history(period="1mo"))

# 헬스케어: Synthea 데이터 파싱
import json
with open("synthea_output/fhir/Patient.json") as f:
    patients = json.load(f)
    print(f"환자 수: {len(patients['entry'])}")

# 제조: 시계열 데이터 생성
import numpy as np
import pandas as pd

# 시뮬레이션 센서 데이터
np.random.seed(42)
n = 1000
data = pd.DataFrame({
    'timestamp': pd.date_range('2024-01-01', periods=n, freq='1min'),
    'temperature': 25 + np.random.randn(n) * 2,
    'vibration': 0.1 + np.random.randn(n) * 0.02,
    'pressure': 100 + np.random.randn(n) * 5
})
print(data.head())
\`\`\`
        `,
        starterCode: `# poc_combined.py
"""
캡스톤 프로젝트 PoC
- 목표: 핵심 기술 통합 검증
- 기한: 2시간
"""

import os
from dotenv import load_dotenv

load_dotenv()

# TODO: 도메인에 맞는 PoC 구현

def poc_data_collection():
    """데이터 수집 테스트"""
    pass

def poc_knowledge_graph():
    """Knowledge Graph 연동 테스트"""
    pass

def poc_rag_pipeline():
    """RAG 파이프라인 테스트"""
    pass

def poc_integration():
    """통합 테스트"""
    pass

if __name__ == "__main__":
    print("=== PoC 시작 ===")
    poc_data_collection()
    poc_knowledge_graph()
    poc_rag_pipeline()
    poc_integration()
    print("=== PoC 완료 ===")
`
      }
    },
    {
      id: 'poc-report',
      type: 'project',
      title: 'PoC 결과 보고서',
      duration: 30,
      content: {
        objectives: [
          'PoC 결과를 문서화한다',
          '발견된 문제점과 해결 방안을 기록한다',
          '다음 단계 계획을 수립한다'
        ],
        requirements: [
          '**PoC 결과 보고서**',
          '',
          '## 1. PoC 개요',
          '- 목적:',
          '- 범위:',
          '- 기간:',
          '',
          '## 2. 검증 항목별 결과',
          '',
          '| 항목 | 결과 | 비고 |',
          '|------|------|------|',
          '| LLM API 연동 | ✅ / ❌ | ... |',
          '| Neo4j 연동 | ✅ / ❌ | ... |',
          '| RAG 파이프라인 | ✅ / ❌ | ... |',
          '| 데이터 수집 | ✅ / ❌ | ... |',
          '',
          '## 3. 발견된 문제점',
          '',
          '| 문제 | 심각도 | 해결 방안 |',
          '|------|--------|----------|',
          '| ... | 상/중/하 | ... |',
          '',
          '## 4. 성능 측정 (해당 시)',
          '- 응답 시간:',
          '- 정확도:',
          '',
          '## 5. 결론 및 다음 단계',
          '- 진행 여부: Go / No-Go',
          '- 조정 필요 사항:',
          '- Week 3 계획 수정:'
        ],
        evaluationCriteria: [
          '검증의 충분성',
          '문제점 분석의 깊이',
          '해결 방안의 구체성'
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'project-kickoff',
  title: '프로젝트 킥오프',
  totalDuration: 180,
  tasks: [
    {
      id: 'github-setup-project',
      type: 'project',
      title: 'GitHub 저장소 완성',
      duration: 60,
      content: {
        objectives: [
          'GitHub 저장소를 완성한다',
          'README, Contributing Guide 등을 작성한다',
          'Issue 템플릿과 PR 템플릿을 설정한다'
        ],
        requirements: [
          '**GitHub 저장소 체크리스트**',
          '',
          '## 필수 파일',
          '- [ ] README.md (프로젝트 개요)',
          '- [ ] LICENSE (MIT 또는 Apache 2.0)',
          '- [ ] .gitignore',
          '- [ ] .env.example',
          '- [ ] docker-compose.yml',
          '',
          '## 문서',
          '- [ ] docs/ARCHITECTURE.md',
          '- [ ] docs/SETUP.md (개발 환경 설정)',
          '- [ ] docs/API.md (추후 작성)',
          '',
          '## GitHub 설정',
          '- [ ] .github/ISSUE_TEMPLATE/bug_report.md',
          '- [ ] .github/ISSUE_TEMPLATE/feature_request.md',
          '- [ ] .github/pull_request_template.md',
          '',
          '## CI/CD',
          '- [ ] .github/workflows/ci.yml',
          '',
          '**README 구조**:',
          '```markdown',
          '# [프로젝트 이름]',
          '',
          '> [한 줄 설명]',
          '',
          '## Features',
          '## Architecture',
          '## Quick Start',
          '## Development',
          '## Documentation',
          '## License',
          '```'
        ],
        evaluationCriteria: [
          '저장소의 완성도',
          '문서의 품질',
          'CI/CD 설정'
        ]
      }
    },
    {
      id: 'milestone-planning',
      type: 'project',
      title: '마일스톤 & 이슈 계획',
      duration: 60,
      content: {
        objectives: [
          'Week 3-8 마일스톤을 GitHub에 생성한다',
          '각 마일스톤의 이슈를 생성한다',
          '우선순위를 설정한다'
        ],
        requirements: [
          '**GitHub 마일스톤 & 이슈 설정**',
          '',
          '## 마일스톤 (6개)',
          '',
          '| 마일스톤 | 기간 | 목표 |',
          '|---------|------|------|',
          '| M1: 데이터 파이프라인 | Week 3 | 데이터 수집 & ETL |',
          '| M2: Knowledge Graph | Week 4 | 온톨로지 & Neo4j |',
          '| M3: RAG 시스템 | Week 5 | RAG & GraphRAG |',
          '| M4: Agent 시스템 | Week 6 | Multi-Agent |',
          '| M5: 프론트엔드 & 배포 | Week 7 | 대시보드 & 배포 |',
          '| M6: 완성 & 발표 | Week 8 | 문서화 & 발표 |',
          '',
          '## 이슈 라벨',
          '- `feature` - 새 기능',
          '- `bug` - 버그 수정',
          '- `docs` - 문서',
          '- `infra` - 인프라',
          '- `priority:high` / `priority:medium` / `priority:low`',
          '',
          '## Week 3 이슈 예시',
          '- [ ] #1 데이터 소스 API 연동',
          '- [ ] #2 ETL 파이프라인 구현',
          '- [ ] #3 데이터 품질 검증',
          '- [ ] #4 PostgreSQL 스키마 적용'
        ],
        evaluationCriteria: [
          '마일스톤의 적절성',
          '이슈의 구체성',
          '우선순위 설정'
        ]
      }
    },
    {
      id: 'week2-checkpoint',
      type: 'challenge',
      title: 'Week 2 체크포인트 & 킥오프',
      duration: 60,
      content: {
        objectives: [
          'Week 1-2 산출물을 최종 점검한다',
          '프로젝트 킥오프를 완료한다',
          'Week 3 계획을 확정한다'
        ],
        requirements: [
          '**Week 2 최종 체크리스트**',
          '',
          '## 산출물',
          '- [ ] 프로젝트 캔버스',
          '- [ ] 사용자 스토리',
          '- [ ] PRD (Product Requirements Document)',
          '- [ ] 와이어프레임 스케치',
          '- [ ] 아키텍처 설계 문서',
          '- [ ] 데이터 모델 설계',
          '- [ ] PoC 결과 보고서',
          '- [ ] GitHub 저장소 (완성)',
          '- [ ] 마일스톤 & 이슈 설정',
          '',
          '## 킥오프 완료 확인',
          '- [ ] 개발 환경 동작 확인 (Docker Compose)',
          '- [ ] 팀원 (해당 시) 역할 분담',
          '- [ ] Week 3 작업 계획 수립',
          '',
          '**Week 3 목표**:',
          '- 데이터 소스 연동 완료',
          '- ETL 파이프라인 동작',
          '- 초기 데이터 저장소 구축'
        ],
        evaluationCriteria: [
          '산출물 완성도',
          '프로젝트 시작 준비 상태',
          'Week 3 계획의 구체성'
        ]
      }
    }
  ]
}

export const capstoneDefinitionWeek: Week = {
  slug: 'capstone-definition',
  week: 2,
  phase: 6,
  month: 11,
  access: 'pro',
  title: '캡스톤 프로젝트 정의',
  topics: ['PRD', 'Architecture Design', 'Data Modeling', 'PoC', 'Project Management'],
  practice: 'PRD & 아키텍처 문서',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
