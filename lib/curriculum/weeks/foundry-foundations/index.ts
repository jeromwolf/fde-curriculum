// Phase 7, Week 1: Foundry Foundations
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'foundry-overview',
  title: 'Foundry 플랫폼 개요',
  totalDuration: 180,
  tasks: [
    {
      id: 'foundry-intro-reading',
      type: 'reading',
      title: 'Palantir Foundry 소개',
      duration: 30,
      content: {
        objectives: [
          'Palantir Foundry의 역사와 비전을 이해한다',
          'Foundry가 해결하는 핵심 문제를 파악한다',
          'Foundry vs 다른 데이터 플랫폼 차별점을 이해한다'
        ],
        markdown: `
## Palantir Foundry 소개

### Palantir의 역사

\`\`\`
2003: Palantir 설립 (Peter Thiel, Alex Karp)
      ├── 초기: 정보 기관용 분석 플랫폼 (Gotham)
      └── 2016: 기업용 플랫폼 Foundry 출시

2020: NYSE 상장 ($PLTR)

현재:
├── Gotham: 정부/국방
├── Foundry: 기업
└── AIP: AI 통합 플랫폼
\`\`\`

### Foundry가 해결하는 문제

**기존 데이터 플랫폼의 한계**:
\`\`\`
데이터 사일로 문제:
┌─────────┐  ┌─────────┐  ┌─────────┐
│ 영업 DB  │  │ 물류 DB  │  │ 고객 DB  │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     └──── 연결 어려움! ────────┘
\`\`\`

**Foundry의 해결책**:
\`\`\`
Ontology 기반 통합:
┌─────────────────────────────────────┐
│           Palantir Foundry           │
├─────────────────────────────────────┤
│  ┌──────────────────────────────┐   │
│  │         Ontology              │   │
│  │  (통합 데이터 모델)           │   │
│  │  Customer ─ Order ─ Product   │   │
│  └──────────────────────────────┘   │
│         ↑         ↑         ↑       │
│    영업 DB    물류 DB    고객 DB    │
└─────────────────────────────────────┘
\`\`\`

### Foundry 핵심 구성요소

| 구성요소 | 역할 | 비유 |
|---------|------|------|
| **Data Connection** | 외부 데이터 연결 | 입구 |
| **Pipeline Builder** | 데이터 변환 | 공장 라인 |
| **Ontology** | 통합 데이터 모델 | 설계도 |
| **Workshop** | 운영 앱 빌더 | 조립 도구 |
| **AIP** | AI 통합 | 두뇌 |

### Foundry vs 경쟁 플랫폼

| 기능 | Foundry | Databricks | Snowflake |
|------|---------|------------|-----------|
| **온톨로지** | ✅ 핵심 | ❌ | ❌ |
| **운영 앱** | ✅ Workshop | ❌ | ❌ |
| **AI 통합** | ✅ AIP | ✅ MLflow | ❌ |
| **데이터 처리** | ✅ Spark | ✅ Spark | ✅ SQL |
| **가격** | 💰💰💰 | 💰💰 | 💰 |

### FDE에게 Foundry란?

\`\`\`
Palantir FDE = Foundry 전문가

핵심 역량:
├── Pipeline Builder로 데이터 파이프라인 구축
├── Ontology 설계 및 Object Type 정의
├── Workshop으로 운영 애플리케이션 개발
└── AIP로 AI 워크플로우 배포

→ Foundry를 모르면 Palantir FDE가 될 수 없다!
\`\`\`
        `,
        externalLinks: [
          { title: 'Palantir Foundry 공식', url: 'https://www.palantir.com/platforms/foundry/' },
          { title: 'Palantir Learn', url: 'https://learn.palantir.com/' },
          { title: 'Foundry 문서', url: 'https://www.palantir.com/docs/foundry/' }
        ]
      }
    },
    {
      id: 'foundry-architecture-reading',
      type: 'reading',
      title: 'Foundry 아키텍처 이해',
      duration: 45,
      content: {
        objectives: [
          'Foundry의 전체 아키텍처를 이해한다',
          '각 컴포넌트의 역할과 연결을 파악한다',
          'Data → Ontology → Application 플로우를 이해한다'
        ],
        markdown: `
## Foundry 아키텍처

### 전체 아키텍처 다이어그램

\`\`\`
┌───────────────────────────────────────────────────────────────────┐
│                       Palantir Foundry                             │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [Data Layer]                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                        │
│  │Data      │  │Pipeline  │  │Code      │                        │
│  │Connection│→ │Builder   │→ │Repos     │                        │
│  │(수집)    │  │(변환)    │  │(트랜스폼)│                        │
│  └──────────┘  └──────────┘  └──────────┘                        │
│       │              │              │                              │
│       └──────────────┼──────────────┘                              │
│                      ▼                                             │
│  [Semantic Layer - Ontology]                                       │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Ontology Manager                                           │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │   │
│  │  │Object   │──│ Link    │──│Actions  │                     │   │
│  │  │Types    │  │Types    │  │         │                     │   │
│  │  └─────────┘  └─────────┘  └─────────┘                     │   │
│  └────────────────────────────────────────────────────────────┘   │
│                      │                                             │
│                      ▼                                             │
│  [Application Layer]                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │Workshop  │  │Quiver    │  │Object    │  │OSDK      │          │
│  │(앱 빌더) │  │(분석)    │  │Explorer  │  │(SDK)     │          │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │
│                                                                    │
│  [AI Layer - AIP]                                                  │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  AIP Logic  │  Agentic Workflows  │  Model Integration      │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
\`\`\`

### Data Layer 상세

**Data Connection**:
- 외부 시스템과 Foundry 연결
- 지원 소스: SQL DB, S3, SFTP, API, Kafka
- 동기화: 배치/스트리밍

**Pipeline Builder**:
- 노코드/로우코드 데이터 변환
- 드래그 앤 드롭 인터페이스
- 조인, 필터, 집계, 피벗

**Code Repositories**:
- Python/PySpark 트랜스폼
- Git 통합 (브랜치, PR)
- 테스트 및 CI/CD

### Semantic Layer - Ontology

\`\`\`
Ontology = Foundry의 핵심!

Object Type (객체 유형):
├── Customer (고객)
├── Order (주문)
├── Product (제품)
└── ...

Link Type (관계 유형):
├── Customer --places--> Order
├── Order --contains--> Product
└── ...

Actions (액션):
├── Create Order (주문 생성)
├── Update Customer (고객 수정)
└── Approve Request (요청 승인)
\`\`\`

### Application Layer

**Workshop**:
- 드래그 앤 드롭 앱 빌더
- 위젯 기반 UI 구성
- 실시간 데이터 연결

**Quiver**:
- 분석용 노트북 환경
- SQL + Python
- 시각화 도구

**Object Explorer**:
- 온톨로지 객체 탐색/검색
- 운영 사용자용 인터페이스

**OSDK (Ontology SDK)**:
- 외부 앱에서 온톨로지 접근
- TypeScript/Python SDK
- REST API

### 데이터 흐름 예시

\`\`\`
[실제 시나리오: 재고 관리]

1. Data Connection
   └── SAP, WMS, POS → Foundry

2. Pipeline Builder
   └── 데이터 정제, 조인

3. Ontology
   └── Inventory Object Type
       Properties: item_id, quantity, location

4. Workshop App
   └── 재고 대시보드, 발주 버튼

5. AIP
   └── 수요 예측 AI, 자동 발주 추천
\`\`\`
        `,
        externalLinks: [
          { title: 'Foundry 아키텍처 문서', url: 'https://www.palantir.com/docs/foundry/' },
          { title: 'Ontology 개념', url: 'https://learn.palantir.com/ontology' }
        ]
      }
    },
    {
      id: 'foundry-access-setup',
      type: 'code',
      title: 'Foundry 환경 접근 설정',
      duration: 45,
      content: {
        objectives: [
          'Foundry 개발자 환경에 접근한다',
          'AIP Developer Tier 계정을 설정한다',
          '기본 네비게이션을 익힌다'
        ],
        instructions: `
## Foundry 환경 접근

### 옵션 1: AIP Developer Tier (무료)

\`\`\`
1. https://www.palantir.com/platforms/aip/ 접속
2. "Get Started for Free" 클릭
3. 계정 생성 (전화번호 인증 필요)

⚠️ 주의사항:
• 전화번호는 1회만 사용 가능
• 일부 기능 제한됨 (학습용으로는 충분)
• 미국 외 지역에서 제한될 수 있음
\`\`\`

### 옵션 2: 소속 기업 Foundry 환경

회사에서 Foundry를 사용 중이라면 관리자에게 접근 요청

### 옵션 3: 파트너 교육 (Ontologize)

\`\`\`
https://ontologize.com/
• 전 Palantir 직원들이 운영
• Foundry 공인 교육
• 실습 환경 제공 (유료)
\`\`\`

### 기본 네비게이션

\`\`\`
Foundry 주요 메뉴:

Home
├── Recent (최근 작업)
├── Favorites (즐겨찾기)
└── Projects (프로젝트)

Compass (탐색)
├── 파일/폴더 탐색
├── 데이터셋 검색
└── 프로젝트 구조

Data Lineage (리니지)
├── 데이터 흐름 추적
└── 의존성 시각화

Ontology Manager
├── Object Types 정의
├── Link Types 정의
└── Actions 정의

Workshop
├── 앱 빌더
└── 위젯 라이브러리
\`\`\`

### 첫 번째 탐색

1. **Compass**에서 샘플 데이터셋 찾기
2. **Preview**로 데이터 확인
3. **Lineage**로 데이터 흐름 파악
4. **Ontology Manager** 메뉴 확인
        `,
        starterCode: `# Foundry 접근 체크리스트

## 1. 계정 설정
- [ ] Developer Tier 가입 또는 기업 환경 접근
- [ ] 2FA 설정 (권장)
- [ ] 프로필 설정

## 2. 기본 탐색
- [ ] Home 화면 확인
- [ ] Compass 탐색
- [ ] 샘플 프로젝트 확인

## 3. 문서 북마크
- [ ] learn.palantir.com 계정 생성
- [ ] Training Tracks 확인
- [ ] Foundry Docs 북마크
`,
        solutionCode: `# 탐색 결과 기록

## 발견한 샘플 프로젝트:
-

## Compass에서 찾은 데이터셋:
-

## Ontology Manager 첫인상:
-
`
      }
    },
    {
      id: 'foundry-quiz-1',
      type: 'quiz',
      title: 'Foundry 기초 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Palantir Foundry의 핵심 차별화 요소는?',
            options: ['저렴한 가격', 'Ontology 기반 데이터 통합', '빠른 처리 속도', '오픈소스'],
            answer: 1,
            explanation: 'Foundry의 핵심은 Ontology입니다. 데이터를 비즈니스 객체(Object Type)로 모델링하여 통합합니다.'
          },
          {
            question: 'Foundry에서 데이터 변환을 담당하는 컴포넌트는?',
            options: ['Workshop', 'Ontology Manager', 'Pipeline Builder', 'Quiver'],
            answer: 2,
            explanation: 'Pipeline Builder는 노코드/로우코드 인터페이스로 데이터 변환을 수행합니다.'
          },
          {
            question: 'Foundry의 Application Layer에 포함되지 않는 것은?',
            options: ['Workshop', 'Quiver', 'Data Connection', 'Object Explorer'],
            answer: 2,
            explanation: 'Data Connection은 Data Layer의 구성요소입니다. 외부 시스템과 Foundry를 연결합니다.'
          },
          {
            question: 'AIP는 무엇의 약자인가?',
            options: ['Artificial Intelligence Platform', 'Application Integration Protocol', 'Advanced Insight Processing', 'Automated Information Pipeline'],
            answer: 0,
            explanation: 'AIP는 Artificial Intelligence Platform의 약자로, Foundry에 AI 기능을 통합합니다.'
          }
        ]
      }
    },
    {
      id: 'foundry-learning-plan',
      type: 'project',
      title: '학습 계획 수립',
      duration: 45,
      content: {
        objectives: [
          '8주 Foundry 학습 목표를 설정한다',
          '자격증 트랙을 선택한다',
          '학습 리소스를 정리한다'
        ],
        requirements: [
          '**학습 계획 문서**',
          '',
          '## 1. 목표 설정',
          '- 8주 후 달성 목표:',
          '- 취득할 자격증: [Data Engineer / Application Developer]',
          '',
          '## 2. 현재 역량 평가',
          '- Python/Spark: [초급/중급/고급]',
          '- 데이터 파이프라인: [초급/중급/고급]',
          '- 온톨로지/KG: [초급/중급/고급]',
          '',
          '## 3. 주차별 목표',
          '| 주차 | 목표 | 산출물 |',
          '|-----|------|-------|',
          '| Week 1-2 | Foundations 배지 | 미니 프로젝트 |',
          '| Week 3-4 | 파이프라인 마스터 | 파이프라인 3개 |',
          '| Week 5-6 | 온톨로지 & 앱 | Workshop 앱 2개 |',
          '| Week 7-8 | AIP & 자격증 | 🎯 자격증 취득! |',
          '',
          '## 4. 학습 리소스',
          '- Palantir Learn 코스:',
          '- Exam Guide:',
          '- 참고 자료:'
        ],
        evaluationCriteria: [
          '목표의 구체성',
          '현실적인 계획',
          '리소스 정리 완성도'
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'workspace-navigation',
  title: 'Workspace & Navigation',
  totalDuration: 180,
  tasks: [
    {
      id: 'compass-deep-dive',
      type: 'reading',
      title: 'Compass & 프로젝트 구조',
      duration: 40,
      content: {
        objectives: [
          'Compass를 이용한 탐색 방법을 익힌다',
          'Foundry 프로젝트 구조를 이해한다',
          '효율적인 파일 구성 방법을 배운다'
        ],
        markdown: `
## Compass & 프로젝트 구조

### Compass 개요

Compass = Foundry의 파일 탐색기

\`\`\`
Compass 기능:
├── 프로젝트/폴더 탐색
├── 데이터셋 검색
├── 리소스 관리
└── 권한 설정
\`\`\`

### 프로젝트 구조 베스트 프랙티스

\`\`\`
📁 my-project/
├── 📁 raw/              # 원본 데이터
│   ├── source_a/
│   └── source_b/
├── 📁 staging/          # 정제된 데이터
│   ├── cleaned/
│   └── transformed/
├── 📁 curated/          # 분석용 데이터
│   ├── marts/
│   └── aggregates/
├── 📁 ontology/         # 온톨로지 백킹 데이터셋
│   └── object_types/
├── 📁 pipelines/        # 파이프라인 정의
│   ├── ingestion/
│   └── transform/
├── 📁 apps/             # Workshop 애플리케이션
│   ├── dashboards/
│   └── operational/
└── 📁 docs/             # 문서
\`\`\`

### 데이터셋 명명 규칙

\`\`\`
권장 패턴:
[source]_[domain]_[entity]_[version]

예시:
├── sap_finance_invoices_v1
├── salesforce_crm_customers_v2
├── raw_orders_2024
└── curated_daily_sales_summary
\`\`\`

### 검색 팁

\`\`\`
Compass 검색 연산자:

type:dataset         # 데이터셋만
type:ontology        # 온톨로지만
type:workshop        # Workshop만
owner:me             # 내 소유
modified:today       # 오늘 수정된
tags:production      # 태그로 필터

조합 예시:
type:dataset owner:me modified:week
\`\`\`

### 즐겨찾기 & 정리

\`\`\`
효율적인 작업을 위해:
1. 자주 사용하는 리소스 즐겨찾기
2. 프로젝트별 Workspace 구성
3. 태그 활용 (dev, staging, prod)
4. 명확한 설명(description) 작성
\`\`\`
        `,
        externalLinks: [
          { title: 'Compass 사용 가이드', url: 'https://learn.palantir.com/compass' }
        ]
      }
    },
    {
      id: 'data-preview-lineage',
      type: 'reading',
      title: '데이터 Preview & Lineage',
      duration: 40,
      content: {
        objectives: [
          'Dataset Preview 기능을 활용한다',
          'Data Lineage로 의존성을 파악한다',
          '데이터 품질을 빠르게 확인하는 방법을 익힌다'
        ],
        markdown: `
## 데이터 Preview & Lineage

### Dataset Preview

\`\`\`
Preview 기능:
├── 데이터 샘플 확인 (기본 100행)
├── 스키마(컬럼) 정보
├── 통계 요약 (NULL, 분포)
└── 필터/정렬 가능
\`\`\`

**Preview 활용**:
1. 데이터 구조 파악
2. 데이터 품질 확인
3. 샘플 기반 쿼리 테스트

### Data Lineage

\`\`\`
Lineage = 데이터 혈통 추적

           ┌─────────┐
           │ Source A │
           └────┬────┘
                │
           ┌────▼────┐
           │ Pipeline│
           └────┬────┘
                │
     ┌──────────┼──────────┐
     ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Dataset1│ │Dataset2│ │Dataset3│
└────┬───┘ └────┬───┘ └────────┘
     │          │
     └────┬─────┘
          ▼
    ┌──────────┐
    │ Final DS │
    └──────────┘
\`\`\`

### Lineage 활용

**Upstream (상류)**:
- 이 데이터가 어디서 왔는가?
- 소스 시스템 파악
- 데이터 품질 문제 추적

**Downstream (하류)**:
- 이 데이터가 어디에 사용되는가?
- 영향 범위 파악
- 변경 시 영향도 분석

### 데이터 품질 빠른 체크

\`\`\`python
# Preview에서 확인할 항목

1. Row count (행 수)
   - 예상과 맞는가?

2. Column types (컬럼 타입)
   - 문자열로 저장된 숫자?
   - 날짜 형식?

3. NULL 비율
   - 필수 컬럼에 NULL?
   - NULL이 너무 많은 컬럼?

4. 유니크 값
   - Primary key 중복?
   - 카디널리티 확인

5. 값 범위
   - 이상치 존재?
   - 음수 값?
\`\`\`
        `,
        externalLinks: [
          { title: 'Data Lineage 문서', url: 'https://learn.palantir.com/lineage' }
        ]
      }
    },
    {
      id: 'compass-exercise',
      type: 'code',
      title: 'Compass 실습',
      duration: 45,
      content: {
        objectives: [
          '샘플 프로젝트를 탐색한다',
          '데이터셋 Preview를 활용한다',
          'Lineage를 추적한다'
        ],
        instructions: `
## Compass 실습

### 실습 1: 프로젝트 탐색

1. Compass에서 샘플 프로젝트 찾기
2. 프로젝트 구조 파악
3. README 또는 설명 확인

### 실습 2: 데이터셋 검색

\`\`\`
검색 연습:
1. type:dataset 검색
2. 특정 키워드로 필터링 (예: sales, customer)
3. 결과 중 하나 선택
\`\`\`

### 실습 3: Preview 활용

선택한 데이터셋에서:
1. 스키마 확인
2. 첫 100행 검토
3. 특정 컬럼 필터링
4. NULL 값 확인

### 실습 4: Lineage 추적

1. 데이터셋의 Lineage 탭 열기
2. Upstream (소스) 확인
3. Downstream (사용처) 확인
4. 전체 데이터 흐름 다이어그램 파악

### 체크리스트

- [ ] 샘플 프로젝트 발견 (3개 이상)
- [ ] 데이터셋 Preview 확인 (5개 이상)
- [ ] Lineage 추적 완료 (2개 이상)
- [ ] 즐겨찾기 등록 (3개 이상)
        `,
        starterCode: `# Compass 실습 결과

## 발견한 프로젝트:
1.
2.
3.

## 분석한 데이터셋:
| 데이터셋 | Row 수 | 컬럼 수 | 주요 특징 |
|---------|--------|--------|----------|
| | | | |
| | | | |

## Lineage 분석:
- 데이터셋:
- Upstream 소스:
- Downstream 사용처:
`,
        solutionCode: `# 예시 결과

## 발견한 프로젝트:
1. Airline Demo
2. Supply Chain Example
3. Healthcare Analytics

## 분석한 데이터셋:
| 데이터셋 | Row 수 | 컬럼 수 | 주요 특징 |
|---------|--------|--------|----------|
| flights | 100K | 12 | 항공편 데이터 |
| customers | 50K | 8 | 고객 마스터 |

## Lineage 분석:
- 데이터셋: daily_flight_summary
- Upstream: flights, airports, airlines
- Downstream: operational_dashboard
`
      }
    },
    {
      id: 'rbac-security',
      type: 'reading',
      title: '권한 & 보안 모델',
      duration: 30,
      content: {
        objectives: [
          'Foundry 권한 모델을 이해한다',
          'RBAC와 Marking의 개념을 파악한다',
          '보안 베스트 프랙티스를 익힌다'
        ],
        markdown: `
## 권한 & 보안 모델

### Foundry 권한 구조

\`\`\`
권한 계층:
Organization
├── Groups (그룹)
│   ├── Data Engineers
│   ├── Analysts
│   └── Operations
└── Users (사용자)
\`\`\`

### RBAC (Role-Based Access Control)

\`\`\`
기본 역할:
├── Viewer: 읽기만
├── Editor: 수정 가능
├── Owner: 전체 제어
└── Admin: 관리 기능
\`\`\`

**프로젝트 레벨 권한**:
\`\`\`
Project 권한:
├── project:discover  - 프로젝트 발견
├── project:read      - 내용 읽기
├── project:write     - 내용 수정
└── project:admin     - 권한 관리
\`\`\`

### Marking (마킹)

\`\`\`
Marking = 데이터 분류 시스템

예시 마킹:
├── PII (개인식별정보)
├── PHI (의료정보)
├── Confidential (기밀)
└── Internal Only (내부용)

적용:
Dataset A (PII) → PII 접근 권한 있는 사용자만 접근
\`\`\`

### 보안 베스트 프랙티스

\`\`\`
✅ DO:
├── 최소 권한 원칙 적용
├── 그룹 기반 권한 관리
├── 민감 데이터에 Marking 적용
├── 정기적 권한 검토
└── 데이터 분류 체계 수립

❌ DON'T:
├── 개인에게 직접 권한 부여 (그룹 사용)
├── 과도한 권한 부여
├── Marking 없이 민감 데이터 저장
└── 권한 검토 없이 방치
\`\`\`

### 감사 추적 (Audit)

\`\`\`
Foundry Audit 기능:
├── 누가 접근했는가?
├── 무엇을 했는가? (읽기/쓰기/삭제)
├── 언제 했는가?
└── 어디서 했는가? (IP, 세션)

→ 규제 준수 (SOX, HIPAA) 지원
\`\`\`
        `,
        externalLinks: [
          { title: 'Foundry 보안 문서', url: 'https://www.palantir.com/docs/foundry/security/' }
        ]
      }
    },
    {
      id: 'day2-quiz',
      type: 'quiz',
      title: 'Workspace & Navigation 퀴즈',
      duration: 10,
      content: {
        questions: [
          {
            question: 'Foundry에서 파일 탐색기 역할을 하는 도구는?',
            options: ['Workshop', 'Compass', 'Quiver', 'Ontology Manager'],
            answer: 1,
            explanation: 'Compass는 Foundry의 파일 탐색기입니다. 프로젝트, 데이터셋, 리소스를 탐색할 수 있습니다.'
          },
          {
            question: 'Data Lineage의 Upstream은 무엇을 의미하는가?',
            options: ['데이터 사용처', '데이터 출처', '데이터 크기', '데이터 타입'],
            answer: 1,
            explanation: 'Upstream은 데이터의 출처(소스)를 의미합니다. 반대로 Downstream은 데이터 사용처입니다.'
          },
          {
            question: 'Marking의 목적은?',
            options: ['성능 최적화', '데이터 분류 및 접근 제어', '버전 관리', '검색 편의'],
            answer: 1,
            explanation: 'Marking은 데이터 분류 시스템으로, PII, 기밀 등의 마킹을 통해 접근을 제어합니다.'
          }
        ]
      }
    },
    {
      id: 'day2-project',
      type: 'project',
      title: '프로젝트 구조 설계',
      duration: 15,
      content: {
        objectives: [
          '8주 과정에서 사용할 프로젝트 구조를 설계한다',
          '폴더/데이터셋 명명 규칙을 정한다',
          '권한 설정 계획을 수립한다'
        ],
        requirements: [
          '**프로젝트 구조 설계 문서**',
          '',
          '## 1. 프로젝트 폴더 구조',
          '```',
          '📁 foundry-training-[이름]/',
          '├── 📁 raw/',
          '├── 📁 staging/',
          '├── 📁 curated/',
          '├── 📁 ontology/',
          '├── 📁 pipelines/',
          '├── 📁 apps/',
          '└── 📁 docs/',
          '```',
          '',
          '## 2. 명명 규칙',
          '- 데이터셋:',
          '- 파이프라인:',
          '- Object Type:',
          '',
          '## 3. 권한 계획',
          '- 공개 범위:',
          '- 민감 데이터 처리:'
        ],
        evaluationCriteria: [
          '구조의 명확성',
          '명명 규칙의 일관성',
          '권한 계획의 적절성'
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'data-exploration',
  title: '데이터 탐색 & 분석',
  totalDuration: 180,
  tasks: [
    {
      id: 'dataset-types',
      type: 'reading',
      title: 'Dataset 유형과 특성',
      duration: 30,
      content: {
        objectives: [
          'Foundry Dataset의 유형을 이해한다',
          '파일 기반 vs 테이블 기반 데이터셋 차이를 파악한다',
          '스키마 관리 방법을 익힌다'
        ],
        markdown: `
## Dataset 유형과 특성

### Foundry Dataset 구조

\`\`\`
Dataset = 폴더 + 트랜잭션 기록

/dataset_path/
├── files/              # 실제 데이터 파일
│   ├── part-001.parquet
│   ├── part-002.parquet
│   └── ...
├── schema/             # 스키마 정보
└── transactions/       # 변경 이력
\`\`\`

### 파일 형식

| 형식 | 용도 | 특징 |
|------|------|------|
| **Parquet** | 분석용 (기본) | 컬럼 기반, 압축, 빠른 쿼리 |
| **CSV** | 외부 교환 | 범용, 비압축 |
| **JSON** | API 응답 | 중첩 구조 지원 |
| **Avro** | 스트리밍 | 스키마 포함 |

### 테이블 vs 파일 데이터셋

\`\`\`
테이블 데이터셋 (정형):
├── 명확한 스키마
├── SQL 쿼리 가능
├── Preview 지원
└── 대부분의 분석용

파일 데이터셋 (비정형):
├── 이미지, PDF, 영상
├── 자유 형식
├── 별도 처리 필요
└── AIP로 처리 가능
\`\`\`

### 스키마 관리

\`\`\`
스키마 정보:
├── 컬럼 이름
├── 데이터 타입
├── Nullable 여부
└── 설명 (description)

스키마 진화:
├── 컬럼 추가: ✅ 호환
├── 컬럼 삭제: ⚠️ 주의
├── 타입 변경: ⚠️ 제한적
└── 이름 변경: ❌ 새 컬럼 취급
\`\`\`

### 트랜잭션과 버전

\`\`\`
모든 변경 = 새 트랜잭션

Transaction 1: Initial load (2024-01-01)
Transaction 2: Daily update (2024-01-02)
Transaction 3: Schema change (2024-01-05)
...

특징:
├── 모든 버전 접근 가능
├── 롤백 지원
└── 변경 이력 추적
\`\`\`
        `,
        externalLinks: [
          { title: 'Dataset 문서', url: 'https://learn.palantir.com/datasets' }
        ]
      }
    },
    {
      id: 'contour-analysis',
      type: 'reading',
      title: 'Contour로 데이터 분석',
      duration: 40,
      content: {
        objectives: [
          'Contour 분석 도구를 이해한다',
          '필터, 그룹화, 집계를 활용한다',
          '시각화 차트를 만든다'
        ],
        markdown: `
## Contour 데이터 분석

### Contour 개요

\`\`\`
Contour = Foundry의 데이터 분석 도구

특징:
├── 노코드 데이터 분석
├── 드래그 앤 드롭 인터페이스
├── 실시간 시각화
└── 협업 지원
\`\`\`

### 기본 작업

**필터링**:
\`\`\`
필터 유형:
├── 값 필터: status = 'active'
├── 범위 필터: amount > 1000
├── 날짜 필터: date >= '2024-01-01'
└── 다중 필터: status = 'active' AND amount > 1000
\`\`\`

**그룹화 & 집계**:
\`\`\`
Group By:
├── 카테고리별 그룹
├── 날짜별 그룹 (일/주/월/년)
└── 다중 그룹

Aggregation:
├── COUNT: 행 수
├── SUM: 합계
├── AVG: 평균
├── MIN/MAX: 최소/최대
└── DISTINCT: 고유 값 수
\`\`\`

### 시각화

\`\`\`
차트 유형:
├── 막대 그래프 (Bar)
├── 선 그래프 (Line)
├── 파이 차트 (Pie)
├── 산점도 (Scatter)
├── 히트맵 (Heatmap)
└── 지도 (Map)
\`\`\`

### 분석 예시

\`\`\`
시나리오: 월별 매출 분석

1. 데이터셋 선택: sales_transactions

2. 필터:
   - year = 2024
   - status = 'completed'

3. 그룹화:
   - Group by: month
   - Aggregate: SUM(amount)

4. 시각화:
   - 선 그래프
   - X축: month
   - Y축: total_amount

5. 저장 & 공유
\`\`\`

### Contour vs Quiver

| 기능 | Contour | Quiver |
|------|---------|--------|
| 노코드 | ✅ | ❌ |
| SQL 지원 | ❌ | ✅ |
| Python | ❌ | ✅ |
| 빠른 탐색 | ✅ | ❌ |
| 복잡한 분석 | ❌ | ✅ |
        `,
        externalLinks: [
          { title: 'Contour 가이드', url: 'https://learn.palantir.com/contour' }
        ]
      }
    },
    {
      id: 'data-exploration-exercise',
      type: 'code',
      title: '데이터 탐색 실습',
      duration: 60,
      content: {
        objectives: [
          '샘플 데이터셋을 탐색한다',
          'Contour로 기본 분석을 수행한다',
          '분석 결과를 시각화한다'
        ],
        instructions: `
## 데이터 탐색 실습

### 실습 1: 데이터셋 선택

1. Compass에서 샘플 데이터셋 찾기
   - 예: flights, sales, customers
2. Preview로 구조 파악
3. 스키마 문서화

### 실습 2: Contour 분석

1. 새 Contour 분석 생성
2. 데이터셋 추가
3. 기본 탐색:
   - 총 행 수 확인
   - 주요 컬럼 분포 확인
   - NULL 값 비율

### 실습 3: 필터 & 집계

\`\`\`
분석 과제:
1. 특정 조건으로 필터링
2. 카테고리별 그룹화
3. 합계/평균/개수 계산
4. 결과 정렬
\`\`\`

### 실습 4: 시각화

1. 적절한 차트 유형 선택
2. X축, Y축 설정
3. 레이블 추가
4. 색상 커스터마이징

### 체크리스트

- [ ] 데이터셋 3개 이상 탐색
- [ ] Contour 분석 2개 이상 생성
- [ ] 시각화 차트 3개 이상 생성
- [ ] 분석 결과 저장
        `,
        starterCode: `# 데이터 탐색 결과

## 분석한 데이터셋

### 데이터셋 1:
- 이름:
- 행 수:
- 컬럼 수:
- 주요 컬럼:

### 발견한 인사이트

1.
2.
3.

## 생성한 시각화

| 차트 | 유형 | 내용 |
|------|------|------|
| | | |
`,
        solutionCode: `# 예시 결과

## 분석한 데이터셋

### flights:
- 이름: airline_flights
- 행 수: 150,000
- 컬럼 수: 15
- 주요 컬럼: flight_id, origin, dest, delay_min

### 발견한 인사이트

1. 평균 지연 시간: 15분
2. 가장 많은 지연: JFK → LAX 노선
3. 계절별 지연 패턴: 12월 최다

## 생성한 시각화

| 차트 | 유형 | 내용 |
|------|------|------|
| delay_by_carrier | Bar | 항공사별 평균 지연 |
| monthly_trend | Line | 월별 지연 추이 |
| delay_distribution | Histogram | 지연 시간 분포 |
`
      }
    },
    {
      id: 'day3-quiz',
      type: 'quiz',
      title: '데이터 탐색 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Foundry의 기본 데이터 파일 형식은?',
            options: ['CSV', 'JSON', 'Parquet', 'Excel'],
            answer: 2,
            explanation: 'Foundry는 기본적으로 Parquet 형식을 사용합니다. 컬럼 기반 저장으로 분석 쿼리에 효율적입니다.'
          },
          {
            question: 'Contour의 주요 용도는?',
            options: ['코드 작성', '노코드 데이터 분석', '데이터 수집', '권한 관리'],
            answer: 1,
            explanation: 'Contour는 노코드 데이터 분석 도구입니다. 드래그 앤 드롭으로 필터, 집계, 시각화가 가능합니다.'
          },
          {
            question: 'Dataset 트랜잭션의 장점이 아닌 것은?',
            options: ['버전 관리', '롤백 가능', '변경 이력 추적', '저장 공간 절약'],
            answer: 3,
            explanation: '트랜잭션 기반은 모든 버전을 저장하므로 저장 공간은 더 사용됩니다. 대신 버전 관리, 롤백, 이력 추적이 가능합니다.'
          }
        ]
      }
    },
    {
      id: 'day3-summary',
      type: 'project',
      title: '데이터 탐색 요약',
      duration: 35,
      content: {
        objectives: [
          '오늘 학습한 내용을 정리한다',
          '데이터 탐색 결과를 문서화한다',
          '다음 학습 계획을 세운다'
        ],
        requirements: [
          '**Day 3 학습 요약**',
          '',
          '## 1. 학습한 개념',
          '- Dataset 유형과 특성:',
          '- Contour 분석 도구:',
          '- 시각화 차트:',
          '',
          '## 2. 실습 결과',
          '- 탐색한 데이터셋 수:',
          '- 생성한 분석 수:',
          '- 주요 발견:',
          '',
          '## 3. 다음 학습 계획',
          '- Day 4 목표:',
          '- 추가로 연습할 것:'
        ],
        evaluationCriteria: [
          '학습 내용 정리',
          '실습 완성도',
          '계획의 구체성'
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'code-repositories',
  title: 'Code Repositories & Git',
  totalDuration: 180,
  tasks: [
    {
      id: 'code-repos-intro',
      type: 'reading',
      title: 'Code Repositories 개요',
      duration: 30,
      content: {
        objectives: [
          'Foundry Code Repositories의 역할을 이해한다',
          'Git 통합 방식을 파악한다',
          'Transform 코드 작성 환경을 이해한다'
        ],
        markdown: `
## Code Repositories 개요

### 역할

\`\`\`
Code Repositories = Foundry의 코드 관리 시스템

용도:
├── Python/PySpark Transform 코드
├── 테스트 코드
├── 설정 파일
└── 문서
\`\`\`

### Git 통합

\`\`\`
Git 워크플로우:
├── 브랜치 생성
├── 코드 작성/수정
├── Pull Request (PR)
├── 코드 리뷰
└── 머지
\`\`\`

**브랜치 전략**:
\`\`\`
main (production)
├── develop (integration)
│   ├── feature/new-transform
│   ├── feature/data-quality
│   └── bugfix/null-handling
\`\`\`

### Transform 구조

\`\`\`python
# 기본 Transform 구조
from transforms.api import transform, Input, Output

@transform(
    output=Output("/path/to/output/dataset"),
    source_a=Input("/path/to/source/a"),
    source_b=Input("/path/to/source/b"),
)
def compute(output, source_a, source_b):
    # PySpark 로직
    df_a = source_a.dataframe()
    df_b = source_b.dataframe()

    result = df_a.join(df_b, "key_column")

    output.write_dataframe(result)
\`\`\`

### 디렉토리 구조

\`\`\`
my-repo/
├── src/
│   └── myproject/
│       ├── __init__.py
│       ├── transforms/
│       │   ├── __init__.py
│       │   ├── ingest.py
│       │   └── transform.py
│       └── utils/
│           └── helpers.py
├── tests/
│   └── test_transforms.py
├── conda_recipe/
│   └── meta.yaml
└── build.gradle
\`\`\`
        `,
        externalLinks: [
          { title: 'Code Repositories 문서', url: 'https://learn.palantir.com/code-repositories' },
          { title: 'Transforms API', url: 'https://www.palantir.com/docs/foundry/transforms/' }
        ]
      }
    },
    {
      id: 'transforms-basics',
      type: 'reading',
      title: 'Transforms API 기초',
      duration: 45,
      content: {
        objectives: [
          '@transform 데코레이터 사용법을 익힌다',
          'Input/Output 정의 방법을 이해한다',
          '기본 PySpark 변환을 작성한다'
        ],
        markdown: `
## Transforms API 기초

### @transform 데코레이터

\`\`\`python
from transforms.api import transform, Input, Output

@transform(
    output=Output("/path/to/output"),  # 출력 데이터셋 경로
    input1=Input("/path/to/input1"),   # 입력 데이터셋 1
    input2=Input("/path/to/input2"),   # 입력 데이터셋 2
)
def compute(output, input1, input2):
    # 함수 인자 이름 = 데코레이터 인자 이름
    pass
\`\`\`

### DataFrame 작업

\`\`\`python
@transform(
    output=Output("/demo/transformed"),
    source=Input("/demo/raw"),
)
def compute(output, source):
    # DataFrame 읽기
    df = source.dataframe()

    # 변환 작업
    result = (
        df
        .filter(df.status == "active")
        .select("id", "name", "amount")
        .withColumn("amount_usd", df.amount * 1.1)
    )

    # 출력 쓰기
    output.write_dataframe(result)
\`\`\`

### 자주 사용하는 변환

**필터링**:
\`\`\`python
df.filter(df.amount > 1000)
df.filter((df.status == "A") | (df.status == "B"))
df.filter(df.name.isNotNull())
\`\`\`

**컬럼 선택/추가**:
\`\`\`python
df.select("col1", "col2")
df.drop("unwanted_col")
df.withColumn("new_col", df.existing * 2)
df.withColumnRenamed("old_name", "new_name")
\`\`\`

**조인**:
\`\`\`python
df_a.join(df_b, "key_column")
df_a.join(df_b, df_a.key == df_b.key, "left")
\`\`\`

**그룹화 & 집계**:
\`\`\`python
from pyspark.sql import functions as F

df.groupBy("category").agg(
    F.sum("amount").alias("total"),
    F.count("*").alias("count"),
    F.avg("price").alias("avg_price")
)
\`\`\`

### 테스트 작성

\`\`\`python
# tests/test_transforms.py
from myproject.transforms.transform import compute

def test_compute(spark_session):
    # 테스트 데이터 생성
    input_df = spark_session.createDataFrame([
        (1, "active", 100),
        (2, "inactive", 200),
    ], ["id", "status", "amount"])

    # Transform 실행
    result = compute(input_df)

    # 검증
    assert result.count() == 1
    assert result.filter(result.status == "active").count() == 1
\`\`\`
        `,
        externalLinks: [
          { title: 'PySpark DataFrame API', url: 'https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/dataframe.html' },
          { title: 'Transforms 예제', url: 'https://learn.palantir.com/transforms-examples' }
        ]
      }
    },
    {
      id: 'code-repos-exercise',
      type: 'code',
      title: 'Code Repository 실습',
      duration: 60,
      content: {
        objectives: [
          'Code Repository를 생성한다',
          '간단한 Transform을 작성한다',
          '브랜치와 커밋을 연습한다'
        ],
        instructions: `
## Code Repository 실습

### 실습 1: Repository 생성

1. Compass에서 새 Code Repository 생성
2. 이름: \`foundry-training-transforms\`
3. 기본 구조 확인

### 실습 2: 간단한 Transform 작성

\`\`\`python
# src/myproject/transforms/first_transform.py

from transforms.api import transform, Input, Output

@transform(
    output=Output("/training/output/filtered_data"),
    source=Input("/training/input/sample_data"),
)
def compute(output, source):
    """첫 번째 Transform: 데이터 필터링"""
    df = source.dataframe()

    # 간단한 필터링
    result = df.filter(df.amount > 100)

    output.write_dataframe(result)
\`\`\`

### 실습 3: Git 워크플로우

\`\`\`bash
# 1. 새 브랜치 생성
git checkout -b feature/first-transform

# 2. 코드 작성

# 3. 커밋
git add .
git commit -m "Add first transform"

# 4. PR 생성 (Foundry UI에서)

# 5. 리뷰 후 머지
\`\`\`

### 실습 4: 빌드 & 실행

1. Builds 메뉴에서 빌드 트리거
2. 로그 확인
3. 출력 데이터셋 검증

### 체크리스트

- [ ] Repository 생성
- [ ] Transform 코드 작성
- [ ] 브랜치 생성 & 커밋
- [ ] 빌드 성공
- [ ] 출력 데이터셋 확인
        `,
        starterCode: `# first_transform.py

from transforms.api import transform, Input, Output

@transform(
    output=Output("/training/output/my_first_transform"),
    source=Input("/training/input/sample"),
)
def compute(output, source):
    """
    TODO: 간단한 Transform 구현

    요구사항:
    1. source 데이터셋 읽기
    2. 특정 조건으로 필터링
    3. 결과 저장
    """
    df = source.dataframe()

    # TODO: 변환 로직 구현
    result = df

    output.write_dataframe(result)
`,
        solutionCode: `# first_transform.py

from transforms.api import transform, Input, Output
from pyspark.sql import functions as F

@transform(
    output=Output("/training/output/my_first_transform"),
    source=Input("/training/input/sample"),
)
def compute(output, source):
    """
    첫 번째 Transform: 데이터 정제 및 필터링
    """
    df = source.dataframe()

    # 변환 로직
    result = (
        df
        # NULL 값 제거
        .filter(df.id.isNotNull())
        # 활성 상태만 필터
        .filter(df.status == "active")
        # 금액 양수만
        .filter(df.amount > 0)
        # 새 컬럼 추가
        .withColumn("processed_date", F.current_date())
    )

    output.write_dataframe(result)
`
      }
    },
    {
      id: 'day4-quiz',
      type: 'quiz',
      title: 'Code Repositories 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: '@transform 데코레이터에서 Output의 역할은?',
            options: ['입력 데이터셋 정의', '출력 데이터셋 경로 정의', '변환 로직 정의', 'Git 브랜치 정의'],
            answer: 1,
            explanation: 'Output은 Transform의 결과가 저장될 데이터셋 경로를 정의합니다.'
          },
          {
            question: 'Code Repository에서 코드 변경 후 다음 단계는?',
            options: ['바로 배포', '브랜치에서 PR 생성', '직접 main에 푸시', '서버 재시작'],
            answer: 1,
            explanation: 'Git 워크플로우를 따릅니다. 브랜치에서 작업 후 PR을 생성하여 리뷰를 받습니다.'
          },
          {
            question: 'PySpark에서 조인 시 사용하는 기본 방법은?',
            options: ['df.merge()', 'df.join()', 'df.concat()', 'df.union()'],
            answer: 1,
            explanation: 'PySpark에서는 df.join() 메서드를 사용하여 DataFrame을 조인합니다.'
          }
        ]
      }
    },
    {
      id: 'day4-project',
      type: 'project',
      title: 'Transform 설계',
      duration: 30,
      content: {
        objectives: [
          '학습 기간 동안 작성할 Transform을 계획한다',
          '입출력 데이터셋을 정의한다',
          'Transform 간 의존성을 파악한다'
        ],
        requirements: [
          '**Transform 설계 문서**',
          '',
          '## 1. Transform 목록',
          '| 이름 | 입력 | 출력 | 설명 |',
          '|------|------|------|------|',
          '| ingest_raw | Source | raw_data | 원본 수집 |',
          '| clean_data | raw_data | cleaned | 정제 |',
          '| aggregate | cleaned | summary | 집계 |',
          '',
          '## 2. 의존성 다이어그램',
          '```',
          'Source → ingest_raw → clean_data → aggregate',
          '```',
          '',
          '## 3. 구현 계획',
          '- Week 3: ingest_raw, clean_data',
          '- Week 4: aggregate, 고급 변환'
        ],
        evaluationCriteria: [
          'Transform 목록 완성도',
          '의존성 파악',
          '구현 계획의 현실성'
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'week1-project',
  title: 'Week 1 미니 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'e2e-workflow-intro',
      type: 'reading',
      title: 'E2E 워크플로우 개요',
      duration: 30,
      content: {
        objectives: [
          'Data → Ontology → App 전체 플로우를 이해한다',
          '미니 프로젝트 요구사항을 파악한다',
          '성공 기준을 명확히 한다'
        ],
        markdown: `
## E2E 워크플로우 개요

### 전체 플로우

\`\`\`
Week 1 미니 프로젝트: 첫 번째 E2E 워크플로우

[1. 데이터 수집]
    │
    └── 샘플 데이터셋 선택/생성
            │
            ▼
[2. 데이터 탐색]
    │
    └── Contour로 분석, 인사이트 발굴
            │
            ▼
[3. 데이터 변환]
    │
    └── Pipeline Builder 또는 Transform
            │
            ▼
[4. 온톨로지 연결] (Week 5-6에서 심화)
    │
    └── 데이터 → Object Type 매핑 (개념 이해)
            │
            ▼
[5. 결과 문서화]
    │
    └── 분석 결과 리포트
\`\`\`

### 미니 프로젝트 목표

\`\`\`
목표:
├── Foundry 기본 기능 숙달
├── 데이터 → 인사이트 플로우 경험
├── 첫 번째 산출물 완성
└── Foundations 배지 준비
\`\`\`

### 평가 기준

| 항목 | 기준 | 배점 |
|------|------|------|
| 데이터 탐색 | 3개 이상 분석 | 20% |
| 변환 | 1개 이상 Transform/Pipeline | 30% |
| 문서화 | 발견한 인사이트 정리 | 30% |
| 완성도 | 전체 플로우 연결 | 20% |

### 샘플 시나리오

\`\`\`
시나리오 1: 항공 데이터 분석
├── 데이터: flights, airports, airlines
├── 분석: 지연 패턴, 노선 분석
├── 변환: 일별 요약, 항공사별 통계
└── 인사이트: 지연 원인, 최적 노선

시나리오 2: 판매 데이터 분석
├── 데이터: sales, products, customers
├── 분석: 매출 트렌드, 고객 세그먼트
├── 변환: 월별 집계, 고객 분류
└── 인사이트: 베스트셀러, 타겟 고객

시나리오 3: 로그 데이터 분석
├── 데이터: server_logs, events
├── 분석: 에러 패턴, 트래픽 분석
├── 변환: 시간별 집계, 에러 분류
└── 인사이트: 이상 탐지, 최적화 포인트
\`\`\`
        `,
        externalLinks: [
          { title: 'Speedrun: Your First E2E Workflow', url: 'https://learn.palantir.com/speedrun-your-first-e2e-workflow' }
        ]
      }
    },
    {
      id: 'mini-project-work',
      type: 'project',
      title: 'E2E 미니 프로젝트 구현',
      duration: 120,
      content: {
        objectives: [
          '샘플 데이터셋으로 E2E 워크플로우를 구현한다',
          'Contour 분석과 Transform을 연결한다',
          '결과를 문서화한다'
        ],
        requirements: [
          '**E2E 미니 프로젝트 구현**',
          '',
          '## 1. 데이터 선택',
          '- 선택한 데이터셋:',
          '- 행 수:',
          '- 주요 컬럼:',
          '',
          '## 2. 데이터 탐색 (Contour)',
          '- 분석 1:',
          '- 분석 2:',
          '- 분석 3:',
          '',
          '## 3. 데이터 변환',
          '- Transform 이름:',
          '- 입력:',
          '- 출력:',
          '- 변환 로직:',
          '',
          '## 4. 발견한 인사이트',
          '1.',
          '2.',
          '3.',
          '',
          '## 5. 다음 단계 계획',
          '- 추가 분석:',
          '- 온톨로지 연결 (Week 5-6):'
        ],
        evaluationCriteria: [
          '데이터 탐색 완성도',
          'Transform 구현',
          '인사이트의 가치',
          '문서화 품질'
        ],
        bonusPoints: [
          '복수 데이터셋 조인',
          '시각화 차트 3개 이상',
          '자동화된 파이프라인'
        ]
      }
    },
    {
      id: 'week1-checkpoint',
      type: 'challenge',
      title: 'Week 1 체크포인트',
      duration: 30,
      content: {
        objectives: [
          'Week 1 산출물을 점검한다',
          'Foundations 배지 준비 상태를 확인한다',
          'Week 2 계획을 확정한다'
        ],
        requirements: [
          '**Week 1 산출물 체크리스트**',
          '',
          '□ Foundry 환경 접근 설정',
          '□ 학습 계획 문서',
          '□ 프로젝트 구조 설계',
          '□ 데이터 탐색 실습 (Contour 분석 2개+)',
          '□ Code Repository 실습 (Transform 1개+)',
          '□ **E2E 미니 프로젝트**',
          '',
          '**Foundations 배지 준비**',
          '',
          '□ Palantir Learn 등록',
          '□ Foundry Foundations 코스 수강',
          '□ 모의 퀴즈 연습',
          '',
          '**Week 2 계획**',
          '',
          '- Pipeline Builder 심화',
          '- 온톨로지 개념 학습',
          '- Workshop 입문'
        ],
        evaluationCriteria: [
          '산출물 완성도',
          '학습 진도',
          'Week 2 계획의 구체성'
        ]
      }
    }
  ]
}

export const foundryFoundationsWeek: Week = {
  slug: 'foundry-foundations',
  week: 1,
  phase: 7,
  month: 13,
  access: 'pro',
  title: 'Foundry Foundations',
  topics: ['Palantir Foundry', 'Compass', 'Data Exploration', 'Code Repositories', 'Transforms'],
  practice: 'E2E 미니 프로젝트',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
