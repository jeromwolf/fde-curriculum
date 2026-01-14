// Phase 7, Week 5: Ontology 심화
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'ontology-manager',
  title: 'Ontology Manager 심화',
  totalDuration: 180,
  tasks: [
    {
      id: 'object-type-creation',
      type: 'reading',
      title: 'Object Type 생성',
      duration: 45,
      content: {
        objectives: [
          'Object Type 생성 프로세스를 이해한다',
          'Property 정의와 타입을 파악한다',
          'Primary Key 설정을 익힌다'
        ],
        markdown: `
## Object Type 생성

### 생성 프로세스

\`\`\`
1. Ontology Manager 접속
2. New Object Type 클릭
3. 기본 정보 입력
   ├── Name
   ├── Description
   └── Icon/Color
4. Backing Dataset 연결
5. Properties 매핑
6. Primary Key 설정
7. 저장 & 게시
\`\`\`

### Property 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| String | 텍스트 | 이름, 설명 |
| Integer | 정수 | 수량, ID |
| Double | 실수 | 가격, 비율 |
| Boolean | 참/거짓 | 활성 여부 |
| Timestamp | 날짜/시간 | 생성일, 수정일 |
| Date | 날짜만 | 생년월일 |
| GeoPoint | 위치 | 좌표 |
| Array | 배열 | 태그, 리스트 |

### Primary Key

\`\`\`
Primary Key = 고유 식별자

요구사항:
├── 유일해야 함
├── NULL 불가
├── 변경 불가 (권장)
└── 의미 있는 값 (권장)

예시:
├── customer_id (Good)
├── order_number (Good)
├── row_number (Bad - 의미 없음)
└── name (Bad - 중복 가능)
\`\`\`

### 베스트 프랙티스

\`\`\`
✅ DO:
├── 명확한 이름 사용
├── 설명 작성
├── 적절한 타입 선택
├── 검색 가능 Property 설정
└── 표시 이름 Property 지정

❌ DON'T:
├── 너무 많은 Property (50개 이하 권장)
├── 불명확한 이름
├── 복합 Primary Key (피하기)
└── 자주 변하는 Primary Key
\`\`\`
        `,
        externalLinks: [
          { title: 'Object Types', url: 'https://www.palantir.com/docs/foundry/ontology/object-types/' },
          { title: 'Ontology Overview', url: 'https://www.palantir.com/docs/foundry/ontology/' }
        ]
      }
    },
    {
      id: 'properties-advanced',
      type: 'reading',
      title: 'Property 고급 설정',
      duration: 40,
      content: {
        objectives: [
          '계산된 Property를 이해한다',
          '검색 및 필터 설정을 파악한다',
          '시계열 Property를 활용한다'
        ],
        markdown: `
## Property 고급 설정

### 계산된 Property

\`\`\`
Derived Property = 다른 Property에서 계산

예시:
├── full_name = first_name + " " + last_name
├── age = current_date - birth_date
├── total = quantity * price
└── status_label = CASE status WHEN 1 THEN "Active" ...
\`\`\`

### 검색 설정

\`\`\`
Searchable Properties:
├── 전체 텍스트 검색 가능
├── Object Explorer에서 검색
└── 인덱싱됨

Filterable Properties:
├── 필터 조건에 사용
├── Workshop 필터
└── 성능 최적화 필요

Sortable Properties:
├── 정렬 기준
├── 인덱스 필요
└── 숫자/날짜 권장
\`\`\`

### 시계열 Property

\`\`\`
Time Series = 시간에 따라 변하는 값

예시:
├── 주가: 시간별 가격
├── 센서: 분 단위 온도
└── 재고: 일별 수량

설정:
├── Timestamp Property
├── Value Property
└── 집계 방식 (last, avg, sum)
\`\`\`

### 표시 설정

\`\`\`
Display Configuration:
├── Title Property: 객체 이름으로 표시
├── Subtitle Property: 보조 정보
├── Description Property: 상세 설명
└── Thumbnail: 이미지 URL
\`\`\`
        `,
        externalLinks: [
          { title: 'Property Types', url: 'https://www.palantir.com/docs/foundry/ontology/object-type-properties/' }
        ]
      }
    },
    {
      id: 'object-type-exercise',
      type: 'code',
      title: 'Object Type 생성 실습',
      duration: 60,
      content: {
        objectives: [
          '실제 Object Type을 생성한다',
          'Property를 설정한다',
          'Dataset과 연결한다'
        ],
        instructions: `
## Object Type 생성 실습

### 목표
Customer Object Type 생성

### 단계

1. **기본 정보**
   - Name: Customer
   - Description: 고객 마스터 데이터

2. **Backing Dataset 연결**
   - /training/curated/customers

3. **Properties 설정**
   | Property | 타입 | 설정 |
   |----------|------|------|
   | customer_id | String | PK, 검색 |
   | name | String | 표시, 검색 |
   | email | String | 검색 |
   | tier | String | 필터 |
   | created_at | Timestamp | 정렬 |
   | total_spent | Double | - |

4. **고급 설정**
   - 계산된 Property: tier_label
   - 검색 가능: name, email
   - 필터 가능: tier

### 체크리스트

- [ ] Object Type 생성
- [ ] Properties 매핑
- [ ] Primary Key 설정
- [ ] 검색/필터 설정
- [ ] 저장 & 게시
        `,
        starterCode: `# Object Type 설계

## Customer Object Type

### 기본 정보
- Name:
- Description:
- Icon:

### Properties
| Property | Type | Source Column | Settings |
|----------|------|---------------|----------|
| | | | |

### Primary Key
-

### 검색/필터
- Searchable:
- Filterable:
`,
        solutionCode: `# Object Type 설계 완료

## Customer Object Type

### 기본 정보
- Name: Customer
- Description: 고객 마스터 데이터
- Icon: person

### Properties
| Property | Type | Source Column | Settings |
|----------|------|---------------|----------|
| customer_id | String | id | PK |
| name | String | customer_name | Title, Searchable |
| email | String | email | Searchable |
| tier | String | tier | Filterable |
| created_at | Timestamp | created_at | Sortable |
| total_spent | Double | total_amount | - |

### Primary Key
- customer_id

### 검색/필터
- Searchable: name, email
- Filterable: tier, created_at
`
      }
    },
    {
      id: 'day1-quiz',
      type: 'quiz',
      title: 'Object Type 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Primary Key의 필수 조건은?',
            options: ['숫자여야 함', '유일하고 NULL 불가', '자주 변경됨', '복합키'],
            answer: 1,
            explanation: 'Primary Key는 유일해야 하고 NULL이 불가능합니다.'
          },
          {
            question: 'Title Property의 역할은?',
            options: ['정렬 기준', '객체 이름으로 표시', '필터 조건', '검색 제외'],
            answer: 1,
            explanation: 'Title Property는 Object Explorer 등에서 객체의 이름으로 표시됩니다.'
          }
        ]
      }
    },
    {
      id: 'day1-project',
      type: 'project',
      title: 'Object Type 설계',
      duration: 20,
      content: {
        objectives: [
          '프로젝트의 전체 Object Type을 설계한다'
        ],
        requirements: [
          '**Object Type 설계서**',
          '',
          '## Object Type 목록',
          '| Object Type | PK | 주요 Properties | 용도 |',
          '|-------------|-----|-----------------|------|',
          '| | | | |'
        ],
        evaluationCriteria: [
          '설계 완성도'
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'link-types',
  title: 'Link Types & 관계',
  totalDuration: 180,
  tasks: [
    {
      id: 'link-type-concepts',
      type: 'reading',
      title: 'Link Type 개념',
      duration: 40,
      content: {
        objectives: [
          'Link Type의 역할을 이해한다',
          '관계 유형과 카디널리티를 파악한다',
          'Link 설정 방법을 익힌다'
        ],
        markdown: `
## Link Type 개념

### Link Type이란?

\`\`\`
Link Type = Object 간 관계 정의

Customer ──places──→ Order
   │                    │
   └── 1:N 관계 ────────┘
\`\`\`

### 카디널리티

\`\`\`
1:1 (One-to-One)
├── Person ── has ── Passport
└── 드물게 사용

1:N (One-to-Many)
├── Customer ── places ── Order
├── Department ── contains ── Employee
└── 가장 일반적

M:N (Many-to-Many)
├── Student ── enrolls ── Course
├── Product ── belongsTo ── Category
└── 중간 테이블 필요 (옵션)
\`\`\`

### Link 설정

\`\`\`
Link Type 생성:
├── Source Object Type: Customer
├── Target Object Type: Order
├── Link Name: places
├── Cardinality: 1:N
└── Foreign Key: order.customer_id = customer.customer_id
\`\`\`

### 양방향 Link

\`\`\`
Forward: Customer → places → Order
Reverse: Order → placedBy → Customer

설정:
├── Forward name: places
├── Reverse name: placedBy
└── 양쪽에서 접근 가능
\`\`\`
        `,
        externalLinks: [
          { title: 'Link Types', url: 'https://www.palantir.com/docs/foundry/ontology/link-types/' }
        ]
      }
    },
    {
      id: 'link-patterns',
      type: 'reading',
      title: '관계 패턴',
      duration: 35,
      content: {
        objectives: [
          '일반적인 관계 패턴을 이해한다',
          '계층 구조를 모델링한다',
          '복잡한 관계를 처리한다'
        ],
        markdown: `
## 관계 패턴

### 기본 패턴

\`\`\`
1. 마스터-트랜잭션
Customer ── places ── Order
Product ── contains ── OrderLine

2. 계층 구조
Company ── has ── Division
Division ── has ── Department
Department ── has ── Employee

3. 자기 참조
Employee ── reportsTo ── Employee (관리자)

4. 다대다
Product ←→ Category
(중간 테이블: product_category)
\`\`\`

### 계층 구조 모델링

\`\`\`
방법 1: 직접 Link
├── Parent ── has ── Child
└── 단순, 깊이 제한

방법 2: 경로 저장
├── /Company/Division/Department
└── 쿼리 용이, 변경 복잡

방법 3: Nested Set
├── left, right 값
└── 복잡, 고성능 읽기
\`\`\`

### 복잡한 관계

\`\`\`
시간 기반 관계:
├── Employee ── worksAt (start, end) ── Department
└── 이력 보존 필요

조건부 관계:
├── Customer ── primaryContact ── Contact
├── Customer ── billingContact ── Contact
└── 역할로 구분
\`\`\`
        `,
        externalLinks: [
          { title: 'Ontology Best Practices', url: 'https://www.palantir.com/docs/foundry/ontology/best-practices/' }
        ]
      }
    },
    {
      id: 'link-exercise',
      type: 'code',
      title: 'Link Type 생성 실습',
      duration: 60,
      content: {
        objectives: [
          'Link Type을 생성한다',
          '양방향 관계를 설정한다',
          'Object Explorer에서 확인한다'
        ],
        instructions: `
## Link Type 생성 실습

### 목표
Customer-Order 관계 설정

### 단계

1. **Link Type 생성**
   - Source: Customer
   - Target: Order
   - Forward: places
   - Reverse: placedBy
   - Cardinality: 1:N

2. **Foreign Key 설정**
   - Order.customer_id = Customer.customer_id

3. **검증**
   - Object Explorer에서 Customer 선택
   - 연결된 Order 확인
   - 역방향도 확인

### 추가 Link

Order ── contains ── Product
- Cardinality: M:N (OrderLine 통해)

### 체크리스트

- [ ] Customer-Order Link 생성
- [ ] Order-Product Link 생성
- [ ] Object Explorer 확인
- [ ] 양방향 네비게이션 테스트
        `,
        starterCode: `# Link Type 설계

## Link 목록
| Source | Link | Target | Cardinality |
|--------|------|--------|-------------|
| | | | |
`,
        solutionCode: `# Link Type 설계 완료

## Link 목록
| Source | Link | Target | Cardinality |
|--------|------|--------|-------------|
| Customer | places | Order | 1:N |
| Order | contains | Product | M:N |
| Product | belongsTo | Category | M:N |
| Employee | reportsTo | Employee | N:1 |
`
      }
    },
    {
      id: 'day2-quiz',
      type: 'quiz',
      title: 'Link Type 퀴즈',
      duration: 20,
      content: {
        questions: [
          {
            question: '가장 일반적인 관계 카디널리티는?',
            options: ['1:1', '1:N', 'M:N', 'N:N'],
            answer: 1,
            explanation: '1:N (One-to-Many)이 가장 일반적입니다. 예: 고객-주문 관계.'
          },
          {
            question: '자기 참조 Link의 예시는?',
            options: ['Customer-Order', 'Employee-Manager', 'Product-Category', 'Order-Payment'],
            answer: 1,
            explanation: 'Employee가 다른 Employee(관리자)를 참조하는 것이 자기 참조 예시입니다.'
          }
        ]
      }
    },
    {
      id: 'day2-project',
      type: 'project',
      title: 'Link 설계 완성',
      duration: 25,
      content: {
        objectives: [
          '프로젝트의 전체 Link를 설계한다'
        ],
        requirements: [
          '**Link 설계서**',
          '',
          '## Ontology 다이어그램',
          '```',
          '[Object 관계도]',
          '```',
          '',
          '## Link 목록',
          '| Source | Link (Forward) | Target | Cardinality | Reverse |',
          '|--------|---------------|--------|-------------|---------|'
        ],
        evaluationCriteria: [
          '관계 완성도'
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'actions',
  title: 'Actions & 비즈니스 로직',
  totalDuration: 180,
  tasks: [
    {
      id: 'actions-intro',
      type: 'reading',
      title: 'Actions 개요',
      duration: 40,
      content: {
        objectives: [
          'Actions의 역할을 이해한다',
          'Action 유형을 파악한다',
          '비즈니스 로직 구현 방법을 익힌다'
        ],
        markdown: `
## Actions 개요

### Actions란?

\`\`\`
Actions = Object에 대한 비즈니스 작업

예시:
├── Order.approve() → 주문 승인
├── Customer.updateContact() → 연락처 수정
├── Invoice.sendReminder() → 알림 전송
└── Task.assign(employee) → 담당자 지정
\`\`\`

### Action 유형

\`\`\`
1. Edit Action
   └── Object Property 수정
   └── 예: updateStatus, setPrice

2. Create Action
   └── 새 Object 생성
   └── 예: createOrder, addCustomer

3. Delete Action
   └── Object 삭제 (소프트/하드)
   └── 예: archiveOrder, removeItem

4. Custom Action
   └── 복잡한 비즈니스 로직
   └── 예: processPayment, generateReport
\`\`\`

### Action 구성요소

\`\`\`
Action 정의:
├── Name: approve
├── Description: 주문 승인
├── Parameters:
│   ├── approver_id: String
│   └── notes: String (optional)
├── Rules:
│   ├── 검증 규칙
│   └── 권한 규칙
└── Logic:
    ├── Property 변경
    └── 부수 효과
\`\`\`
        `,
        externalLinks: [
          { title: 'Actions', url: 'https://www.palantir.com/docs/foundry/action-types/' }
        ]
      }
    },
    {
      id: 'action-implementation',
      type: 'reading',
      title: 'Action 구현',
      duration: 45,
      content: {
        objectives: [
          'Action 파라미터를 정의한다',
          '검증 규칙을 설정한다',
          '권한을 구성한다'
        ],
        markdown: `
## Action 구현

### 파라미터 정의

\`\`\`
파라미터 타입:
├── Primitive: String, Integer, Boolean
├── Object Reference: 다른 Object
├── Array: 다중 값
└── Optional: 선택적 입력

예시: assignTask Action
├── task: Task (대상)
├── assignee: Employee (필수)
├── priority: String (optional)
└── due_date: Date (optional)
\`\`\`

### 검증 규칙

\`\`\`
검증 유형:
├── 필수 값 확인
├── 범위 검증
├── 비즈니스 규칙
└── 상태 전이 규칙

예시: approveOrder Action
├── 현재 상태가 'pending'인지 확인
├── 금액이 승인 한도 이하인지
├── 승인자가 권한 있는지
└── 필수 정보 완료됐는지
\`\`\`

### 권한 구성

\`\`\`
권한 설정:
├── Role-based: 역할 기반
├── Object-based: 소유자 등
├── Condition-based: 조건 기반
└── Hierarchy-based: 계층 기반

예시:
├── approve: Manager 이상
├── edit: Owner 또는 Admin
├── view: 모든 인증 사용자
└── delete: Admin만
\`\`\`

### 부수 효과

\`\`\`
Action 실행 후:
├── 다른 Object 업데이트
├── 알림 전송
├── 로그 기록
├── 외부 시스템 연동
└── 워크플로우 트리거
\`\`\`
        `,
        externalLinks: [
          { title: 'Action Configuration', url: 'https://www.palantir.com/docs/foundry/action-types/action-configuration/' }
        ]
      }
    },
    {
      id: 'action-exercise',
      type: 'code',
      title: 'Action 구현 실습',
      duration: 60,
      content: {
        objectives: [
          'Edit Action을 생성한다',
          '검증 규칙을 설정한다',
          'Workshop에서 테스트한다'
        ],
        instructions: `
## Action 구현 실습

### 목표
Order.updateStatus Action 구현

### 요구사항

1. **파라미터**
   - new_status: String (pending, approved, shipped, delivered)
   - notes: String (optional)

2. **검증 규칙**
   - 유효한 상태 전이인지 확인
   - pending → approved ✅
   - pending → shipped ❌

3. **로직**
   - status 업데이트
   - updated_at 갱신
   - status_history에 추가 (선택)

### 체크리스트

- [ ] Action 생성
- [ ] 파라미터 정의
- [ ] 검증 규칙 설정
- [ ] 권한 설정
- [ ] Workshop에서 테스트
        `,
        starterCode: `# Action 설계

## updateStatus Action

### 파라미터
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| | | | |

### 검증 규칙
1.
2.

### 상태 전이 규칙
| From | To | 허용 |
|------|-----|------|
| | | |
`,
        solutionCode: `# Action 설계 완료

## updateStatus Action

### 파라미터
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| new_status | String | Yes | 새 상태 |
| notes | String | No | 메모 |

### 검증 규칙
1. new_status는 유효한 값이어야 함
2. 허용된 상태 전이만 가능

### 상태 전이 규칙
| From | To | 허용 |
|------|-----|------|
| pending | approved | Yes |
| approved | shipped | Yes |
| shipped | delivered | Yes |
| pending | cancelled | Yes |
`
      }
    },
    {
      id: 'day3-quiz',
      type: 'quiz',
      title: 'Actions 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Action의 주요 목적은?',
            options: ['데이터 조회', '비즈니스 작업 수행', '권한 관리', '스케줄링'],
            answer: 1,
            explanation: 'Actions는 Object에 대한 비즈니스 작업(승인, 수정, 생성 등)을 수행합니다.'
          },
          {
            question: '검증 규칙의 목적은?',
            options: ['성능 향상', '비즈니스 규칙 적용', '로깅', '캐싱'],
            answer: 1,
            explanation: '검증 규칙은 유효한 상태 전이, 권한 확인 등 비즈니스 규칙을 적용합니다.'
          }
        ]
      }
    },
    {
      id: 'day3-project',
      type: 'project',
      title: 'Actions 설계',
      duration: 20,
      content: {
        objectives: [
          '프로젝트의 핵심 Actions를 설계한다'
        ],
        requirements: [
          '**Actions 설계서**',
          '',
          '## Action 목록',
          '| Object | Action | 파라미터 | 설명 |',
          '|--------|--------|---------|------|',
          '| | | | |'
        ],
        evaluationCriteria: [
          'Action 설계 완성도'
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'object-explorer',
  title: 'Object Explorer & Views',
  totalDuration: 180,
  tasks: [
    {
      id: 'object-explorer-usage',
      type: 'reading',
      title: 'Object Explorer 활용',
      duration: 40,
      content: {
        objectives: [
          'Object Explorer 기능을 이해한다',
          '검색과 필터를 활용한다',
          '운영 사용자 관점을 익힌다'
        ],
        markdown: `
## Object Explorer 활용

### Object Explorer란?

\`\`\`
Object Explorer = Ontology 기반 데이터 탐색 도구

용도:
├── Object 검색
├── 상세 정보 확인
├── 관계 탐색
├── Actions 실행
└── 운영 업무
\`\`\`

### 기본 기능

\`\`\`
1. 검색
   ├── 전체 텍스트 검색
   ├── Property 기반 검색
   └── 고급 필터

2. 목록 보기
   ├── 테이블 뷰
   ├── 카드 뷰
   └── 커스텀 레이아웃

3. 상세 보기
   ├── Property 표시
   ├── Link 네비게이션
   └── 타임라인

4. Actions
   ├── 인라인 Action
   ├── 벌크 Action
   └── 조건부 Action
\`\`\`

### 운영 시나리오

\`\`\`
예시: 고객 서비스 담당자

1. 고객 검색 (전화번호, 이름)
2. 고객 상세 정보 확인
3. 관련 주문 목록 확인
4. 주문 상태 업데이트 (Action)
5. 메모 추가
\`\`\`
        `,
        externalLinks: [
          { title: 'Object Explorer', url: 'https://www.palantir.com/docs/foundry/object-explorer/' }
        ]
      }
    },
    {
      id: 'views-config',
      type: 'reading',
      title: 'Views 구성',
      duration: 35,
      content: {
        objectives: [
          'Object Views를 설정한다',
          '커스텀 레이아웃을 만든다',
          '사용자별 뷰를 구성한다'
        ],
        markdown: `
## Views 구성

### View 유형

\`\`\`
1. List View
   └── Object 목록 표시
   └── 컬럼 선택, 정렬

2. Detail View
   └── 단일 Object 상세
   └── Property 그룹화

3. Card View
   └── 카드 형식
   └── 미리보기

4. Timeline View
   └── 시간순 표시
   └── 이벤트 기반
\`\`\`

### View 설정

\`\`\`
List View 설정:
├── 표시 컬럼 선택
├── 기본 정렬
├── 기본 필터
├── 페이지 크기
└── 그룹화 옵션

Detail View 설정:
├── Property 섹션
├── Link 섹션
├── Action 버튼
└── 사이드바 구성
\`\`\`

### 권한별 View

\`\`\`
역할별 View:
├── Admin: 전체 Property
├── Manager: 핵심 Property + Actions
├── User: 읽기 전용 Property
└── Guest: 공개 Property만
\`\`\`
        `,
        externalLinks: [
          { title: 'Object Views', url: 'https://www.palantir.com/docs/foundry/object-views/' }
        ]
      }
    },
    {
      id: 'explorer-exercise',
      type: 'code',
      title: 'Object Explorer 실습',
      duration: 60,
      content: {
        objectives: [
          'Object Explorer로 데이터를 탐색한다',
          'Views를 설정한다',
          'Actions를 실행한다'
        ],
        instructions: `
## Object Explorer 실습

### 실습 1: 검색 & 필터

1. Customer Object 검색
2. tier = 'Gold' 필터
3. 결과 정렬 (total_spent DESC)

### 실습 2: 상세 정보

1. 특정 Customer 선택
2. 관련 Orders 확인
3. Order 상세로 이동

### 실습 3: Actions 실행

1. Order 선택
2. updateStatus Action 실행
3. 결과 확인

### 실습 4: View 설정

1. Customer List View 커스터마이징
2. 컬럼 추가/제거
3. 저장

### 체크리스트

- [ ] 검색 & 필터 수행
- [ ] Link 네비게이션
- [ ] Action 실행
- [ ] View 설정
        `,
        starterCode: `# Object Explorer 실습 결과

## 검색 결과
- 조건:
- 결과 수:

## 실행한 Actions
| Object | Action | 결과 |
|--------|--------|------|
| | | |

## View 설정
- 변경 사항:
`,
        solutionCode: `# Object Explorer 실습 결과

## 검색 결과
- 조건: tier = 'Gold', total_spent > 100000
- 결과 수: 25

## 실행한 Actions
| Object | Action | 결과 |
|--------|--------|------|
| Order-001 | updateStatus | approved |
| Order-002 | updateStatus | shipped |

## View 설정
- 변경 사항:
  - 컬럼 추가: last_order_date
  - 정렬: total_spent DESC
  - 필터 저장: VIP Customers
`
      }
    },
    {
      id: 'day4-quiz',
      type: 'quiz',
      title: 'Object Explorer 퀴즈',
      duration: 20,
      content: {
        questions: [
          {
            question: 'Object Explorer의 주요 사용자는?',
            options: ['개발자', '운영 담당자', 'DBA', '시스템 관리자'],
            answer: 1,
            explanation: 'Object Explorer는 주로 운영 담당자가 일상 업무에 사용합니다.'
          }
        ]
      }
    },
    {
      id: 'day4-project',
      type: 'project',
      title: 'Views 설계',
      duration: 25,
      content: {
        objectives: [
          '역할별 Views를 설계한다'
        ],
        requirements: [
          '**Views 설계서**',
          '',
          '## 역할별 View',
          '| 역할 | Object | View 유형 | 표시 Property |',
          '|------|--------|----------|--------------|',
          '| | | | |'
        ],
        evaluationCriteria: [
          'View 설계 완성도'
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'week5-checkpoint',
  title: 'Week 5 체크포인트',
  totalDuration: 180,
  tasks: [
    {
      id: 'ontology-project',
      type: 'project',
      title: 'Ontology 종합 프로젝트',
      duration: 120,
      content: {
        objectives: [
          '완전한 Ontology를 구축한다',
          'Object Types, Links, Actions를 구현한다'
        ],
        requirements: [
          '**Ontology 종합 프로젝트**',
          '',
          '## 요구사항',
          '',
          '1. **Object Types**',
          '   - 최소 5개 Object Type',
          '   - 적절한 Properties',
          '',
          '2. **Link Types**',
          '   - 최소 5개 Link',
          '   - 양방향 설정',
          '',
          '3. **Actions**',
          '   - 최소 3개 Action',
          '   - 검증 규칙 포함',
          '',
          '4. **Views**',
          '   - 역할별 View 설정',
          '',
          '## 산출물',
          '- [ ] Ontology (게시됨)',
          '- [ ] Object Explorer 테스트',
          '- [ ] 문서'
        ],
        evaluationCriteria: [
          'Ontology 완성도 (40%)',
          'Actions (25%)',
          'Views (20%)',
          '문서화 (15%)'
        ]
      }
    },
    {
      id: 'week5-review',
      type: 'challenge',
      title: 'Week 5 체크포인트',
      duration: 60,
      content: {
        objectives: [
          'Week 5 산출물을 점검한다',
          'Application Developer 자격증 준비'
        ],
        requirements: [
          '**Week 5 산출물 체크리스트**',
          '',
          '□ Object Types (5개+)',
          '□ Link Types (5개+)',
          '□ Actions (3개+)',
          '□ Views 설정',
          '□ **Ontology 프로젝트**',
          '',
          '**Week 6 계획: Workshop Application**'
        ],
        evaluationCriteria: [
          '산출물 완성도'
        ]
      }
    }
  ]
}

export const foundryOntologyWeek: Week = {
  slug: 'foundry-ontology',
  week: 5,
  phase: 7,
  month: 14,
  access: 'pro',
  title: 'Ontology 심화',
  topics: ['Object Types', 'Link Types', 'Actions', 'Object Explorer', 'Views'],
  practice: 'Ontology 종합 프로젝트',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
