// Phase 7, Week 2: Foundry 핵심 도구 입문
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'pipeline-builder-intro',
  title: 'Pipeline Builder 입문',
  totalDuration: 180,
  tasks: [
    {
      id: 'pipeline-builder-overview',
      type: 'reading',
      title: 'Pipeline Builder 개요',
      duration: 30,
      content: {
        objectives: [
          'Pipeline Builder의 역할을 이해한다',
          '노코드 vs 코드 기반 변환의 차이를 파악한다',
          'Pipeline Builder UI를 익힌다'
        ],
        markdown: `
## Pipeline Builder 개요

### Pipeline Builder란?

\`\`\`
Pipeline Builder = 노코드 데이터 변환 도구

특징:
├── 드래그 앤 드롭 인터페이스
├── 시각적 데이터 흐름 설계
├── 실시간 미리보기
└── 스케줄링 및 모니터링
\`\`\`

### 노코드 vs 코드 기반

| 기능 | Pipeline Builder | Code Repositories |
|------|-----------------|-------------------|
| 복잡도 | 간단/중간 | 복잡 |
| 학습 곡선 | 낮음 | 높음 |
| 유연성 | 제한적 | 완전한 제어 |
| 재사용성 | 중간 | 높음 |
| 권장 상황 | 빠른 프로토타입 | 프로덕션 로직 |

### 핵심 개념

\`\`\`
Pipeline 구성요소:

[Input Board]
    │
    └── 데이터셋 선택
            │
            ▼
[Transform Steps]
    │
    ├── Filter (필터)
    ├── Join (조인)
    ├── Aggregate (집계)
    ├── Select (컬럼 선택)
    └── ...
            │
            ▼
[Output Board]
    │
    └── 결과 데이터셋
\`\`\`

### Pipeline Builder UI

\`\`\`
┌─────────────────────────────────────────────────────┐
│  Pipeline Builder                                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐                                        │
│  │ Input DS │──┐                                    │
│  └──────────┘  │                                    │
│                ▼                                    │
│           ┌────────┐                                │
│           │ Filter │                                │
│           └────┬───┘                                │
│                │                                    │
│                ▼                                    │
│           ┌────────┐                                │
│           │  Join  │←── [Another DS]               │
│           └────┬───┘                                │
│                │                                    │
│                ▼                                    │
│           ┌────────┐                                │
│           │Aggregate                                │
│           └────┬───┘                                │
│                │                                    │
│                ▼                                    │
│           ┌──────────┐                              │
│           │Output DS │                              │
│           └──────────┘                              │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Preview  │  Schema  │  Lineage                     │
└─────────────────────────────────────────────────────┘
\`\`\`
        `,
        externalLinks: [
          { title: 'Pipeline Builder 문서', url: 'https://learn.palantir.com/pipeline-builder' },
          { title: 'Training: Data Engineering', url: 'https://learn.palantir.com/page/training-track-data-engineer' }
        ]
      }
    },
    {
      id: 'basic-transforms',
      type: 'reading',
      title: '기본 변환 작업',
      duration: 45,
      content: {
        objectives: [
          'Filter, Select, Join 변환을 이해한다',
          '각 변환의 설정 방법을 익힌다',
          '변환 순서의 중요성을 파악한다'
        ],
        markdown: `
## 기본 변환 작업

### Filter (필터)

\`\`\`
용도: 조건에 맞는 행만 선택

설정:
├── Column: 필터할 컬럼
├── Operator: =, !=, >, <, contains, etc.
└── Value: 비교 값

예시:
├── status = 'active'
├── amount > 1000
├── name contains 'Samsung'
└── date >= '2024-01-01'

다중 조건:
├── AND: 모든 조건 충족
└── OR: 하나 이상 충족
\`\`\`

### Select (컬럼 선택)

\`\`\`
용도: 필요한 컬럼만 선택

설정:
├── 포함할 컬럼 선택
├── 제외할 컬럼 선택
└── 컬럼 이름 변경 (optional)

예시:
Select: id, name, amount
Rename: customer_id → cust_id
\`\`\`

### Join (조인)

\`\`\`
용도: 두 데이터셋 결합

조인 유형:
├── Inner: 양쪽에 있는 것만
├── Left: 왼쪽 기준
├── Right: 오른쪽 기준
├── Full: 모두 포함
└── Cross: 카테시안 곱

설정:
├── Left dataset
├── Right dataset
├── Join key(s)
└── Join type
\`\`\`

### Aggregate (집계)

\`\`\`
용도: 그룹별 집계

설정:
├── Group by: 그룹화 기준 컬럼
└── Aggregations:
    ├── SUM(amount) → total_amount
    ├── COUNT(*) → row_count
    ├── AVG(price) → avg_price
    ├── MIN(date) → first_date
    └── MAX(date) → last_date
\`\`\`

### 변환 순서

\`\`\`
권장 순서:

1. Filter (먼저 데이터 줄이기)
   ↓
2. Join (필요한 데이터 결합)
   ↓
3. Select (필요한 컬럼만)
   ↓
4. Aggregate (집계)
   ↓
5. Sort (정렬)

💡 팁: Filter를 먼저 하면 성능 향상!
\`\`\`
        `,
        externalLinks: [
          { title: 'Transform Types 문서', url: 'https://learn.palantir.com/transforms' }
        ]
      }
    },
    {
      id: 'pipeline-builder-exercise',
      type: 'code',
      title: 'Pipeline Builder 실습',
      duration: 60,
      content: {
        objectives: [
          '첫 번째 Pipeline을 생성한다',
          '기본 변환을 적용한다',
          '결과를 확인하고 저장한다'
        ],
        instructions: `
## Pipeline Builder 실습

### 실습 1: Pipeline 생성

1. 새 Pipeline Builder 생성
2. 이름: \`my-first-pipeline\`
3. 입력 데이터셋 추가

### 실습 2: 기본 변환

\`\`\`
변환 단계:

1. Filter
   - Column: status
   - Operator: equals
   - Value: 'active'

2. Select
   - 선택: id, name, amount, date

3. Aggregate
   - Group by: name
   - Aggregation: SUM(amount) as total
\`\`\`

### 실습 3: 조인 연습

\`\`\`
1. 두 번째 데이터셋 추가
2. Join 변환 추가
3. Join key 설정
4. 결과 확인
\`\`\`

### 실습 4: 출력 저장

1. Output 데이터셋 경로 설정
2. 스키마 확인
3. 빌드 실행
4. 결과 데이터셋 검증

### 체크리스트

- [ ] Pipeline 생성
- [ ] Filter 적용
- [ ] Join 수행
- [ ] Aggregate 수행
- [ ] 출력 저장
        `,
        starterCode: `# Pipeline 설계

## 입력 데이터셋
- Dataset 1:
- Dataset 2 (조인용):

## 변환 단계
1. Filter:
2. Join:
3. Aggregate:

## 출력 데이터셋
- Path:
- 예상 Row 수:
`,
        solutionCode: `# Pipeline 설계 예시

## 입력 데이터셋
- Dataset 1: orders (주문 데이터)
- Dataset 2: customers (고객 데이터)

## 변환 단계
1. Filter: status = 'completed'
2. Join: orders.customer_id = customers.id
3. Aggregate:
   - Group by: customer_name
   - SUM(order_amount) as total_spent

## 출력 데이터셋
- Path: /training/output/customer_summary
- 예상 Row 수: ~1000 (고유 고객 수)
`
      }
    },
    {
      id: 'day1-quiz',
      type: 'quiz',
      title: 'Pipeline Builder 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Pipeline Builder의 주요 장점은?',
            options: ['복잡한 ML 모델 학습', '노코드 데이터 변환', '실시간 스트리밍', '권한 관리'],
            answer: 1,
            explanation: 'Pipeline Builder는 노코드/로우코드 도구로, 드래그 앤 드롭으로 데이터 변환을 수행합니다.'
          },
          {
            question: '성능을 위해 Filter 변환은 언제 적용해야 하는가?',
            options: ['마지막에', '가능한 먼저', '조인 후에', '집계 후에'],
            answer: 1,
            explanation: 'Filter를 먼저 적용하면 처리해야 할 데이터 양이 줄어 성능이 향상됩니다.'
          },
          {
            question: 'Left Join의 결과는?',
            options: ['양쪽에 있는 데이터만', '왼쪽 데이터 + 매칭된 오른쪽', '오른쪽 데이터 + 매칭된 왼쪽', '모든 데이터'],
            answer: 1,
            explanation: 'Left Join은 왼쪽 데이터셋의 모든 행을 유지하고, 매칭되는 오른쪽 데이터를 결합합니다.'
          }
        ]
      }
    },
    {
      id: 'day1-project',
      type: 'project',
      title: 'Pipeline 설계 문서',
      duration: 30,
      content: {
        objectives: [
          '학습 기간 동안 만들 Pipeline을 계획한다',
          '각 Pipeline의 목적과 변환 단계를 정의한다'
        ],
        requirements: [
          '**Pipeline 설계 문서**',
          '',
          '## Pipeline 목록',
          '',
          '### Pipeline 1: 데이터 정제',
          '- 입력:',
          '- 변환:',
          '- 출력:',
          '',
          '### Pipeline 2: 조인 & 집계',
          '- 입력:',
          '- 변환:',
          '- 출력:',
          '',
          '### Pipeline 3: 고급 변환',
          '- 입력:',
          '- 변환:',
          '- 출력:'
        ],
        evaluationCriteria: [
          'Pipeline 설계의 명확성',
          '변환 단계의 적절성',
          '실현 가능성'
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'ontology-concepts',
  title: 'Ontology 개념 이해',
  totalDuration: 180,
  tasks: [
    {
      id: 'ontology-intro',
      type: 'reading',
      title: 'Ontology란 무엇인가',
      duration: 45,
      content: {
        objectives: [
          'Foundry Ontology의 핵심 개념을 이해한다',
          'Object Type, Link Type, Property를 파악한다',
          '왜 Ontology가 Foundry의 핵심인지 이해한다'
        ],
        markdown: `
## Ontology란 무엇인가

### 핵심 개념

\`\`\`
Ontology = 비즈니스 객체의 통합 모델

테이블/데이터셋 중심:
┌─────────────────────────────────────┐
│  orders 테이블  │  customers 테이블 │
├─────────────────────────────────────┤
│  SQL JOIN으로   │  관계 추론       │
│  연결 필요      │  어려움          │
└─────────────────────────────────────┘

Ontology 중심:
┌─────────────────────────────────────┐
│          Ontology Layer             │
├─────────────────────────────────────┤
│                                     │
│   Customer ──places──→ Order        │
│      │                    │         │
│      │                    │         │
│      └──contains──→ Product         │
│                                     │
│   모든 관계가 명시적!               │
└─────────────────────────────────────┘
\`\`\`

### Object Type (객체 유형)

\`\`\`
Object Type = 비즈니스 객체의 정의

예시:
├── Customer (고객)
│   ├── Properties: id, name, email, segment
│   └── Actions: updateContact, sendEmail
│
├── Order (주문)
│   ├── Properties: id, date, amount, status
│   └── Actions: approve, cancel, fulfill
│
└── Product (제품)
    ├── Properties: id, name, price, category
    └── Actions: updatePrice, discontinue
\`\`\`

### Link Type (관계 유형)

\`\`\`
Link Type = 객체 간 관계 정의

예시:
├── Customer --places--> Order
│   (고객이 주문을 생성)
│
├── Order --contains--> Product
│   (주문이 제품을 포함)
│
└── Product --belongsTo--> Category
    (제품이 카테고리에 속함)

관계 특성:
├── Cardinality: 1:1, 1:N, M:N
└── Direction: 단방향, 양방향
\`\`\`

### Property (속성)

\`\`\`
Property = 객체의 속성

타입:
├── String: 텍스트
├── Integer: 정수
├── Double: 실수
├── Boolean: 참/거짓
├── Timestamp: 날짜/시간
├── GeoPoint: 위치
└── Array: 배열

예시 (Customer):
├── id: String (Primary Key)
├── name: String
├── email: String
├── segment: String
├── created_at: Timestamp
└── is_active: Boolean
\`\`\`

### 왜 Ontology가 핵심인가?

\`\`\`
Ontology의 가치:

1. 통합된 데이터 모델
   └── 여러 소스의 데이터를 하나의 모델로

2. 비즈니스 언어
   └── 기술자가 아닌 사용자도 이해 가능

3. 운영 애플리케이션의 기반
   └── Workshop, Object Explorer의 데이터 소스

4. 권한 관리
   └── Object 수준 세밀한 접근 제어

5. AI 통합 (AIP)
   └── LLM이 Ontology를 통해 데이터 이해
\`\`\`
        `,
        externalLinks: [
          { title: 'Ontology 소개', url: 'https://learn.palantir.com/ontology' },
          { title: 'Object Types 문서', url: 'https://www.palantir.com/docs/foundry/ontology/' }
        ]
      }
    },
    {
      id: 'ontology-design',
      type: 'reading',
      title: 'Ontology 설계 원칙',
      duration: 40,
      content: {
        objectives: [
          'Ontology 설계 베스트 프랙티스를 이해한다',
          '모델링 패턴을 파악한다',
          '흔한 실수를 피하는 방법을 익힌다'
        ],
        markdown: `
## Ontology 설계 원칙

### 설계 원칙

\`\`\`
1. 비즈니스 중심 모델링
   ├── 기술적 구현이 아닌 비즈니스 개념
   ├── "orders 테이블" ❌
   └── "Order (주문)" ✅

2. 명확한 Object Type
   ├── 하나의 Object Type = 하나의 비즈니스 개념
   └── 너무 넓거나 좁지 않게

3. 의미 있는 관계
   ├── 실제 비즈니스 관계 반영
   └── 불필요한 관계 피하기

4. 확장 가능한 구조
   ├── 미래 요구사항 고려
   └── 과도한 복잡성 피하기
\`\`\`

### 모델링 패턴

**기본 패턴: 마스터-트랜잭션**
\`\`\`
[Master Data]        [Transaction Data]
┌──────────┐         ┌──────────┐
│ Customer │◄────────│  Order   │
│ Product  │         │ Payment  │
│ Employee │         │  Event   │
└──────────┘         └──────────┘
\`\`\`

**계층 구조 패턴**
\`\`\`
Company
├── Division
│   ├── Department
│   │   └── Team
│   │       └── Employee
\`\`\`

**이벤트 패턴**
\`\`\`
Entity ──triggers──→ Event ──affects──→ State
\`\`\`

### 네이밍 컨벤션

\`\`\`
Object Type:
├── PascalCase: Customer, SalesOrder
├── 단수형: Customer (Customers ❌)
└── 명확한 이름: SalesOrder (SO ❌)

Property:
├── camelCase: customerId, orderDate
└── 명확한 이름: totalAmount (amt ❌)

Link Type:
├── 동사형: places, contains, belongsTo
└── 방향 명확: customerPlacesOrder
\`\`\`

### 흔한 실수

\`\`\`
❌ 피해야 할 것:

1. 테이블 이름 그대로 사용
   - "dim_customer" ❌
   - "Customer" ✅

2. 너무 많은 Property
   - 100개 Property ❌
   - 핵심 20-30개 + 확장 ✅

3. 불필요한 관계
   - 모든 것을 연결 ❌
   - 의미 있는 관계만 ✅

4. 불명확한 Primary Key
   - 자연키 의존 ❌
   - 명확한 고유 식별자 ✅
\`\`\`
        `,
        externalLinks: [
          { title: 'Ontology 설계 가이드', url: 'https://learn.palantir.com/ontology-design' }
        ]
      }
    },
    {
      id: 'ontology-mapping',
      type: 'reading',
      title: 'Dataset → Ontology 매핑',
      duration: 35,
      content: {
        objectives: [
          'Dataset을 Object Type에 매핑하는 방법을 이해한다',
          'Backing dataset의 개념을 파악한다',
          '매핑 설정 방법을 익힌다'
        ],
        markdown: `
## Dataset → Ontology 매핑

### Backing Dataset

\`\`\`
Backing Dataset = Object Type의 데이터 소스

Dataset (테이블)    →    Object Type (객체)
┌─────────────┐          ┌──────────────┐
│ customers   │   매핑    │   Customer   │
│ ─────────── │  ──────→ │ ──────────── │
│ id          │          │ id (PK)      │
│ name        │          │ name         │
│ email       │          │ email        │
│ segment     │          │ segment      │
└─────────────┘          └──────────────┘
\`\`\`

### 매핑 설정

\`\`\`
매핑 구성:

1. Primary Key 설정
   └── 고유 식별자 컬럼 선택

2. Property 매핑
   ├── 컬럼 → Property
   └── 타입 변환 (필요시)

3. 표시 이름 설정
   └── Object의 제목으로 표시할 Property

4. 검색 가능 설정
   └── 검색에 포함할 Property

5. Link 설정
   └── 다른 Object Type과의 관계
\`\`\`

### 예시: 고객-주문 매핑

\`\`\`
[customers 테이블]
id | name | email | created_at
───┼──────┼───────┼───────────
1  | Kim  | k@... | 2024-01-01

        ↓ 매핑

[Customer Object Type]
├── id (PK)
├── name (표시 이름)
├── email (검색 가능)
└── created_at

────────────────────────────

[orders 테이블]
id | customer_id | amount | status
───┼─────────────┼────────┼────────
101| 1           | 50000  | completed

        ↓ 매핑

[Order Object Type]
├── id (PK)
├── amount
├── status
└── Link: Customer (via customer_id)
\`\`\`

### 고급 매핑

\`\`\`
1. 계산된 Property
   └── 다른 Property에서 파생된 값

2. 다중 Backing Dataset
   └── 여러 소스에서 Object 생성

3. 타입 브랜치
   └── 하나의 Object Type, 여러 하위 유형

4. 시계열 Property
   └── 시간에 따라 변하는 값
\`\`\`
        `,
        externalLinks: [
          { title: 'Object Type Backing', url: 'https://learn.palantir.com/object-backing' }
        ]
      }
    },
    {
      id: 'ontology-design-exercise',
      type: 'project',
      title: 'Ontology 설계 실습',
      duration: 45,
      content: {
        objectives: [
          '도메인에 맞는 Ontology를 설계한다',
          'Object Type과 Link Type을 정의한다',
          '설계 문서를 작성한다'
        ],
        requirements: [
          '**Ontology 설계 문서**',
          '',
          '## 1. 도메인 분석',
          '- 도메인: [선택한 도메인]',
          '- 핵심 비즈니스 개념:',
          '',
          '## 2. Object Types',
          '| Object Type | Primary Key | 주요 Properties | 설명 |',
          '|-------------|-------------|-----------------|------|',
          '| | | | |',
          '',
          '## 3. Link Types',
          '| Source | Link Type | Target | Cardinality |',
          '|--------|-----------|--------|-------------|',
          '| | | | |',
          '',
          '## 4. Ontology 다이어그램',
          '```',
          '[Object A] --relation--> [Object B]',
          '```'
        ],
        evaluationCriteria: [
          '도메인 분석의 깊이',
          'Object Type 정의의 적절성',
          'Link Type의 명확성'
        ]
      }
    },
    {
      id: 'day2-quiz',
      type: 'quiz',
      title: 'Ontology 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Object Type이란?',
            options: ['데이터베이스 테이블', '비즈니스 객체의 정의', 'API 엔드포인트', '사용자 그룹'],
            answer: 1,
            explanation: 'Object Type은 Customer, Order와 같은 비즈니스 객체를 정의합니다.'
          },
          {
            question: 'Link Type의 역할은?',
            options: ['Property 그룹화', 'Object 간 관계 정의', '데이터 암호화', '접근 제어'],
            answer: 1,
            explanation: 'Link Type은 Object 간의 관계(예: Customer --places--> Order)를 정의합니다.'
          },
          {
            question: 'Backing Dataset이란?',
            options: ['백업 데이터', 'Object Type의 데이터 소스', '캐시 저장소', '로그 데이터'],
            answer: 1,
            explanation: 'Backing Dataset은 Object Type에 데이터를 제공하는 원본 Dataset입니다.'
          }
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'workshop-intro',
  title: 'Workshop 입문',
  totalDuration: 180,
  tasks: [
    {
      id: 'workshop-overview',
      type: 'reading',
      title: 'Workshop 개요',
      duration: 30,
      content: {
        objectives: [
          'Workshop의 역할과 기능을 이해한다',
          'Workshop UI 구조를 파악한다',
          '애플리케이션 유형을 이해한다'
        ],
        markdown: `
## Workshop 개요

### Workshop이란?

\`\`\`
Workshop = 드래그 앤 드롭 앱 빌더

특징:
├── 노코드 애플리케이션 개발
├── Ontology 기반 데이터 연결
├── 실시간 업데이트
└── 권한 통합
\`\`\`

### Workshop 앱 유형

| 유형 | 용도 | 예시 |
|------|------|------|
| **대시보드** | 데이터 시각화 | KPI 대시보드 |
| **운영 앱** | 일상 업무 | 주문 관리 |
| **의사결정 앱** | 분석 기반 결정 | 리스크 평가 |
| **워크플로우** | 프로세스 자동화 | 승인 플로우 |

### Workshop UI 구조

\`\`\`
┌─────────────────────────────────────────────────────┐
│  Workshop                                  [저장]    │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│  위젯    │          캔버스                          │
│  라이브러리│                                          │
│          │  ┌────────┐ ┌────────┐ ┌────────┐       │
│ ┌──────┐ │  │  KPI   │ │ Chart  │ │ Table  │       │
│ │Chart │ │  │ Widget │ │ Widget │ │ Widget │       │
│ └──────┘ │  └────────┘ └────────┘ └────────┘       │
│ ┌──────┐ │                                          │
│ │Table │ │  ┌──────────────────────────────┐       │
│ └──────┘ │  │                              │       │
│ ┌──────┐ │  │      Filter/Search           │       │
│ │Filter│ │  │                              │       │
│ └──────┘ │  └──────────────────────────────┘       │
│          │                                          │
├──────────┴──────────────────────────────────────────┤
│  Properties  │  Variables  │  Data Sources          │
└─────────────────────────────────────────────────────┘
\`\`\`

### 핵심 개념

\`\`\`
1. 위젯 (Widget)
   └── UI 구성요소 (차트, 테이블, 버튼)

2. 변수 (Variable)
   └── 상태 관리 (선택 값, 필터)

3. 이벤트 (Event)
   └── 사용자 인터랙션 (클릭, 선택)

4. 액션 (Action)
   └── 데이터 변경, 페이지 이동

5. 데이터 소스 (Data Source)
   └── Ontology Object 연결
\`\`\`
        `,
        externalLinks: [
          { title: 'Workshop 소개', url: 'https://learn.palantir.com/workshop' },
          { title: 'Workshop 위젯 갤러리', url: 'https://www.palantir.com/docs/foundry/workshop/' }
        ]
      }
    },
    {
      id: 'workshop-widgets',
      type: 'reading',
      title: 'Workshop 위젯',
      duration: 40,
      content: {
        objectives: [
          '주요 위젯 유형을 이해한다',
          '각 위젯의 사용 사례를 파악한다',
          '위젯 설정 방법을 익힌다'
        ],
        markdown: `
## Workshop 위젯

### 데이터 표시 위젯

**테이블 (Table)**
\`\`\`
용도: 데이터 목록 표시
설정:
├── Object Type 연결
├── 컬럼 선택
├── 정렬/필터
└── 페이지네이션
\`\`\`

**차트 (Chart)**
\`\`\`
유형:
├── Bar Chart (막대)
├── Line Chart (선)
├── Pie Chart (파이)
├── Scatter (산점도)
└── Map (지도)
\`\`\`

**KPI 위젯**
\`\`\`
용도: 핵심 지표 표시
설정:
├── 집계 값 (SUM, COUNT, AVG)
├── 비교 값 (전월 대비)
└── 색상 조건
\`\`\`

### 입력 위젯

**필터 (Filter)**
\`\`\`
유형:
├── Dropdown (선택)
├── Checkbox (다중 선택)
├── Date Picker (날짜)
├── Search (검색)
└── Slider (범위)
\`\`\`

**폼 (Form)**
\`\`\`
용도: 데이터 입력
구성:
├── Text Input
├── Number Input
├── Date Input
└── Submit Button
\`\`\`

### 액션 위젯

**버튼 (Button)**
\`\`\`
용도: 액션 트리거
설정:
├── Label
├── On Click: Action
└── 조건부 표시
\`\`\`

**모달 (Modal)**
\`\`\`
용도: 팝업 대화상자
설정:
├── Trigger 버튼
├── 내용 (위젯들)
└── 확인/취소 버튼
\`\`\`

### 위젯 설정 예시

\`\`\`
[Table Widget 설정]

Object Type: Order
Columns:
├── id → 주문 번호
├── date → 주문일
├── customer.name → 고객명
├── amount → 금액
└── status → 상태

Sorting: date DESC
Filter: status = 'pending'
Pagination: 10 rows
\`\`\`
        `,
        externalLinks: [
          { title: 'Widget Reference', url: 'https://www.palantir.com/docs/foundry/workshop/widgets/' }
        ]
      }
    },
    {
      id: 'workshop-first-app',
      type: 'code',
      title: 'Workshop 첫 앱 만들기',
      duration: 60,
      content: {
        objectives: [
          '첫 번째 Workshop 앱을 생성한다',
          '기본 위젯을 배치한다',
          '데이터를 연결한다'
        ],
        instructions: `
## Workshop 첫 앱 만들기

### 실습 1: 앱 생성

1. 새 Workshop 앱 생성
2. 이름: \`my-first-app\`
3. 빈 캔버스 확인

### 실습 2: 위젯 추가

\`\`\`
레이아웃:
┌─────────────────────────────────────┐
│          Header                      │
├─────────────────────────────────────┤
│  ┌────────┐  ┌────────┐  ┌────────┐ │
│  │  KPI 1 │  │  KPI 2 │  │  KPI 3 │ │
│  └────────┘  └────────┘  └────────┘ │
├─────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────┐ │
│  │                │  │            │ │
│  │   Table        │  │   Chart    │ │
│  │                │  │            │ │
│  └────────────────┘  └────────────┘ │
└─────────────────────────────────────┘
\`\`\`

### 실습 3: 데이터 연결

1. 데이터 소스 추가
2. Object Type 선택
3. 테이블에 데이터 바인딩
4. 차트에 집계 데이터 연결

### 실습 4: 상호작용 추가

1. Filter 위젯 추가
2. 테이블 선택 → 차트 연동
3. 버튼 → 액션 연결

### 체크리스트

- [ ] 앱 생성
- [ ] 위젯 3개 이상 배치
- [ ] 데이터 연결
- [ ] 상호작용 구현
- [ ] 앱 저장 및 공유
        `,
        starterCode: `# Workshop 앱 설계

## 앱 목적
-

## 위젯 목록
| 위젯 | 유형 | 데이터 소스 |
|------|------|------------|
| | | |

## 상호작용
1.
2.
`,
        solutionCode: `# Workshop 앱 설계 예시

## 앱 목적
주문 현황 대시보드

## 위젯 목록
| 위젯 | 유형 | 데이터 소스 |
|------|------|------------|
| 총 주문 수 | KPI | Order COUNT |
| 총 매출 | KPI | Order SUM(amount) |
| 주문 목록 | Table | Order (최근 100건) |
| 월별 매출 | Line Chart | Order aggregate |

## 상호작용
1. 날짜 필터 → 모든 위젯 업데이트
2. 테이블 행 선택 → 상세 모달 표시
`
      }
    },
    {
      id: 'day3-quiz',
      type: 'quiz',
      title: 'Workshop 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Workshop의 주요 용도는?',
            options: ['데이터 수집', '노코드 앱 개발', 'ML 모델 학습', '권한 관리'],
            answer: 1,
            explanation: 'Workshop은 드래그 앤 드롭으로 애플리케이션을 개발하는 도구입니다.'
          },
          {
            question: 'Variable의 역할은?',
            options: ['데이터 저장', '앱 상태 관리', '사용자 인증', '로그 기록'],
            answer: 1,
            explanation: 'Variable은 필터 선택 값, 현재 선택된 항목 등 앱 상태를 관리합니다.'
          },
          {
            question: 'Workshop 앱의 데이터 소스는 주로 무엇과 연결되는가?',
            options: ['외부 API', 'Ontology Object', 'CSV 파일', '로컬 데이터베이스'],
            answer: 1,
            explanation: 'Workshop은 Ontology와 연결되어 Object Type의 데이터를 사용합니다.'
          }
        ]
      }
    },
    {
      id: 'day3-project',
      type: 'project',
      title: 'Workshop 앱 계획',
      duration: 35,
      content: {
        objectives: [
          '학습 기간 동안 만들 Workshop 앱을 계획한다',
          '요구사항과 와이어프레임을 정의한다'
        ],
        requirements: [
          '**Workshop 앱 계획서**',
          '',
          '## 1. 앱 개요',
          '- 앱 이름:',
          '- 목적:',
          '- 사용자:',
          '',
          '## 2. 요구사항',
          '- 기능 1:',
          '- 기능 2:',
          '- 기능 3:',
          '',
          '## 3. 와이어프레임',
          '```',
          '[레이아웃 스케치]',
          '```',
          '',
          '## 4. 데이터 소스',
          '- Object Type 1:',
          '- Object Type 2:'
        ],
        evaluationCriteria: [
          '요구사항의 명확성',
          '와이어프레임의 구체성',
          '데이터 소스 계획'
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'integration-practice',
  title: '통합 실습',
  totalDuration: 180,
  tasks: [
    {
      id: 'data-to-app-flow',
      type: 'reading',
      title: 'Data → Ontology → App 플로우',
      duration: 30,
      content: {
        objectives: [
          '전체 데이터 플로우를 이해한다',
          '각 단계의 역할을 명확히 한다',
          '통합 시 고려사항을 파악한다'
        ],
        markdown: `
## Data → Ontology → App 플로우

### 전체 플로우

\`\`\`
[1. Data Layer]
    │
    ├── Data Connection (외부 소스 연결)
    │         │
    │         ▼
    ├── Pipeline Builder (변환)
    │         │
    │         ▼
    └── Curated Datasets (정제된 데이터)
              │
              ▼
[2. Semantic Layer]
    │
    ├── Object Types (비즈니스 객체)
    │         │
    │         ▼
    ├── Link Types (관계)
    │         │
    │         ▼
    └── Actions (비즈니스 로직)
              │
              ▼
[3. Application Layer]
    │
    ├── Workshop (운영 앱)
    ├── Quiver (분석)
    ├── Object Explorer (탐색)
    └── OSDK (외부 연동)
\`\`\`

### 각 단계 역할

\`\`\`
Data Layer:
├── 원본 데이터 수집
├── 데이터 정제 및 변환
└── 분석용 데이터셋 생성

Semantic Layer:
├── 비즈니스 모델 정의
├── 데이터 통합
└── 접근 제어

Application Layer:
├── 사용자 인터페이스
├── 인터랙션
└── 워크플로우
\`\`\`

### 통합 고려사항

\`\`\`
1. 데이터 품질
   ├── 정제 → Object 생성 전에
   └── NULL, 중복, 형식 오류 처리

2. 스키마 일관성
   ├── 컬럼 이름 표준화
   └── 타입 매핑 명확화

3. 권한 관리
   ├── Dataset → Object → App 권한 전파
   └── 최소 권한 원칙

4. 성능
   ├── 적절한 인덱싱
   └── 집계 데이터셋 활용
\`\`\`
        `,
        externalLinks: [
          { title: 'E2E 가이드', url: 'https://learn.palantir.com/e2e-guide' }
        ]
      }
    },
    {
      id: 'integration-exercise',
      type: 'code',
      title: '통합 실습: Pipeline → Workshop',
      duration: 90,
      content: {
        objectives: [
          'Pipeline에서 생성한 데이터를 Workshop에 연결한다',
          '전체 플로우를 경험한다',
          '통합 시 문제를 해결한다'
        ],
        instructions: `
## 통합 실습

### 목표
Pipeline Builder로 만든 데이터셋을 Workshop 앱에서 사용

### 단계 1: Pipeline 확인

Day 1에서 만든 Pipeline 확인:
- 입력 데이터셋
- 변환 로직
- 출력 데이터셋

### 단계 2: Object Type 생성 (개념)

\`\`\`
※ 실제 Object Type 생성은 Week 5에서 진행
여기서는 개념적으로 설계만

Object Type 설계:
├── 이름:
├── Primary Key:
├── Properties:
└── 예상 Links:
\`\`\`

### 단계 3: Workshop 앱 생성

1. 새 Workshop 앱 생성
2. Dataset 직접 연결 (Object 없이)
3. 테이블 위젯 추가
4. 차트 위젯 추가
5. 필터 연결

### 단계 4: 검증

\`\`\`
확인 사항:
□ 데이터가 올바르게 표시되는가?
□ 필터가 작동하는가?
□ 차트가 정확한가?
□ 성능은 적절한가?
\`\`\`

### 체크리스트

- [ ] Pipeline 데이터셋 확인
- [ ] Object Type 설계 (문서)
- [ ] Workshop 앱 생성
- [ ] 데이터 연결 성공
- [ ] 상호작용 동작 확인
        `,
        starterCode: `# 통합 실습 결과

## 사용한 Pipeline
- 이름:
- 출력 데이터셋:

## Object Type 설계
- 이름:
- Properties:

## Workshop 앱
- 이름:
- 위젯 목록:

## 발생한 문제 & 해결
1.
2.
`,
        solutionCode: `# 통합 실습 결과 예시

## 사용한 Pipeline
- 이름: customer_order_summary
- 출력 데이터셋: /training/output/order_summary

## Object Type 설계
- 이름: OrderSummary
- Properties: customer_id, customer_name, total_orders, total_amount

## Workshop 앱
- 이름: Order Dashboard
- 위젯: KPI (총 주문), Table (고객별 요약), Bar Chart (Top 10)

## 발생한 문제 & 해결
1. 데이터셋 권한 → 공유 설정 추가
2. NULL 값 표시 → Filter로 제외
`
      }
    },
    {
      id: 'day4-quiz',
      type: 'quiz',
      title: '통합 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Semantic Layer의 핵심 구성요소는?',
            options: ['Pipeline Builder', 'Ontology', 'Workshop', 'Data Connection'],
            answer: 1,
            explanation: 'Ontology는 Semantic Layer의 핵심으로, 비즈니스 객체와 관계를 정의합니다.'
          },
          {
            question: '데이터 품질 처리는 어느 단계에서 해야 하는가?',
            options: ['Application Layer', 'Object Type 생성 후', 'Object Type 생성 전', 'Workshop에서'],
            answer: 2,
            explanation: '데이터 품질 처리(NULL, 중복, 형식)는 Object Type 생성 전, Data Layer에서 해야 합니다.'
          },
          {
            question: 'OSDK의 용도는?',
            options: ['데이터 수집', 'ML 학습', '외부 앱에서 Ontology 접근', '권한 관리'],
            answer: 2,
            explanation: 'OSDK (Ontology SDK)는 외부 애플리케이션에서 Ontology 데이터에 접근할 수 있게 합니다.'
          }
        ]
      }
    },
    {
      id: 'day4-review',
      type: 'project',
      title: 'Week 2 중간 점검',
      duration: 45,
      content: {
        objectives: [
          'Day 1-4 학습 내용을 정리한다',
          '부족한 부분을 파악한다',
          'Day 5 프로젝트를 준비한다'
        ],
        requirements: [
          '**Week 2 중간 점검**',
          '',
          '## 1. 학습 요약',
          '',
          '### Pipeline Builder',
          '- 이해도: [높음/중간/낮음]',
          '- 핵심 개념:',
          '- 추가 학습 필요:',
          '',
          '### Ontology',
          '- 이해도: [높음/중간/낮음]',
          '- 핵심 개념:',
          '- 추가 학습 필요:',
          '',
          '### Workshop',
          '- 이해도: [높음/중간/낮음]',
          '- 핵심 개념:',
          '- 추가 학습 필요:',
          '',
          '## 2. Day 5 프로젝트 준비',
          '- 목표:',
          '- 필요한 데이터:',
          '- 예상 결과물:'
        ],
        evaluationCriteria: [
          '자기 평가의 정확성',
          '학습 계획의 구체성',
          '프로젝트 준비도'
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'week2-project',
  title: 'Week 2 종합 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'mini-project-2',
      type: 'project',
      title: 'E2E 프로젝트: 대시보드 구축',
      duration: 120,
      content: {
        objectives: [
          'Pipeline → (Ontology 설계) → Workshop 전체 플로우를 구현한다',
          '실제 사용 가능한 대시보드를 만든다',
          '학습한 내용을 종합 적용한다'
        ],
        requirements: [
          '**Week 2 종합 프로젝트**',
          '',
          '## 프로젝트 요구사항',
          '',
          '1. **데이터 파이프라인** (Pipeline Builder)',
          '   - 최소 2개 입력 데이터셋',
          '   - 조인, 필터, 집계 포함',
          '   - 명확한 출력 데이터셋',
          '',
          '2. **Ontology 설계** (문서)',
          '   - Object Type 2개 이상 정의',
          '   - Link Type 1개 이상 정의',
          '   - Property 매핑 문서화',
          '',
          '3. **Workshop 대시보드**',
          '   - KPI 위젯 2개 이상',
          '   - 테이블 또는 차트 2개 이상',
          '   - 필터/상호작용',
          '',
          '## 산출물',
          '',
          '- [ ] Pipeline (빌드 성공)',
          '- [ ] Ontology 설계 문서',
          '- [ ] Workshop 대시보드 (링크)',
          '- [ ] 프로젝트 문서 (README)'
        ],
        evaluationCriteria: [
          'Pipeline 완성도 (30%)',
          'Ontology 설계 품질 (25%)',
          'Workshop 대시보드 (30%)',
          '문서화 (15%)'
        ],
        bonusPoints: [
          '3개 이상의 데이터셋 활용',
          '고급 변환 (윈도우 함수 등)',
          '모바일 반응형 대시보드'
        ]
      }
    },
    {
      id: 'week2-checkpoint',
      type: 'challenge',
      title: 'Week 2 체크포인트',
      duration: 60,
      content: {
        objectives: [
          'Week 2 산출물을 점검한다',
          '학습 진도를 평가한다',
          'Week 3-4 계획을 확정한다'
        ],
        requirements: [
          '**Week 2 산출물 체크리스트**',
          '',
          '□ Pipeline Builder 실습 (2개 이상)',
          '□ Ontology 설계 문서',
          '□ Workshop 앱 (1개 이상)',
          '□ 통합 실습 완료',
          '□ **Week 2 종합 프로젝트**',
          '',
          '**학습 평가**',
          '',
          '| 주제 | 이해도 | 실습 완료 |',
          '|------|--------|----------|',
          '| Pipeline Builder | /10 | □ |',
          '| Ontology 개념 | /10 | □ |',
          '| Workshop | /10 | □ |',
          '| 통합 플로우 | /10 | □ |',
          '',
          '**Week 3-4 계획**',
          '',
          '- Week 3: Pipeline Builder 심화',
          '- Week 4: Code Transforms (PySpark)',
          '- 목표: Data Engineer 자격증 준비'
        ],
        evaluationCriteria: [
          '산출물 완성도',
          '자기 평가 정확성',
          '다음 주 계획'
        ]
      }
    }
  ]
}

export const foundryToolsWeek: Week = {
  slug: 'foundry-tools',
  week: 2,
  phase: 7,
  month: 13,
  access: 'pro',
  title: 'Foundry 핵심 도구',
  topics: ['Pipeline Builder', 'Ontology Concepts', 'Workshop', 'E2E Integration'],
  practice: 'E2E 대시보드 프로젝트',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
