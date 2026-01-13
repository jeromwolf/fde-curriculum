// Phase 7, Week 6: Workshop & Application
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'workshop-deep-dive',
  title: 'Workshop 심화',
  totalDuration: 180,
  tasks: [
    {
      id: 'workshop-architecture',
      type: 'reading',
      title: 'Workshop 아키텍처',
      duration: 40,
      content: {
        objectives: [
          'Workshop 앱 아키텍처를 이해한다',
          '위젯 시스템을 파악한다',
          '데이터 바인딩을 이해한다'
        ],
        markdown: `
## Workshop 아키텍처

### Workshop 구성요소

\`\`\`
Workshop App:
├── Pages (페이지)
│   ├── Dashboard
│   ├── Detail
│   └── Form
├── Widgets (위젯)
│   ├── 데이터 표시
│   ├── 입력
│   └── 액션
├── Variables (변수)
│   ├── 상태 관리
│   └── 데이터 저장
├── Events (이벤트)
│   ├── 사용자 인터랙션
│   └── 시스템 이벤트
└── Data Sources (데이터 소스)
    ├── Object Sets
    └── Aggregations
\`\`\`

### 데이터 바인딩

\`\`\`
Data Flow:

Object Set (필터된 Objects)
       │
       ▼
   Variables
       │
   ┌───┴───┐
   ▼       ▼
Widget A  Widget B
   │
   ▼
  Event
   │
   ▼
 Action
\`\`\`

### 위젯 계층

\`\`\`
Layout Widgets:
├── Container
├── Tabs
├── Split Panel
└── Modal

Data Widgets:
├── Table
├── Chart
├── Map
└── KPI

Input Widgets:
├── Text Input
├── Dropdown
├── Date Picker
└── Slider

Action Widgets:
├── Button
├── Form
└── Link
\`\`\`
        `,
        externalLinks: [
          { title: 'Workshop Guide', url: 'https://learn.palantir.com/workshop' }
        ]
      }
    },
    {
      id: 'advanced-widgets',
      type: 'reading',
      title: '고급 위젯 활용',
      duration: 45,
      content: {
        objectives: [
          '복잡한 위젯 설정을 이해한다',
          '조건부 표시를 활용한다',
          '커스텀 스타일을 적용한다'
        ],
        markdown: `
## 고급 위젯 활용

### Table 위젯 심화

\`\`\`
고급 설정:
├── 컬럼 설정
│   ├── 타입별 렌더링
│   ├── 조건부 스타일
│   └── 커스텀 포맷
├── 인라인 편집
├── 행 선택 (단일/다중)
├── 그룹화
└── 합계 행
\`\`\`

### Chart 위젯

\`\`\`
차트 유형:
├── Bar/Column
├── Line/Area
├── Pie/Donut
├── Scatter
├── Heatmap
└── Combination

설정:
├── X/Y축 설정
├── 색상 팔레트
├── 범례
├── 애니메이션
└── 인터랙션
\`\`\`

### 조건부 표시

\`\`\`
Visibility Rules:
├── Variable 기반
│   └── showDetail === true
├── 권한 기반
│   └── user.role === 'admin'
├── 데이터 기반
│   └── objectSet.length > 0
└── 복합 조건
    └── A && (B || C)
\`\`\`

### 커스텀 스타일

\`\`\`
스타일 옵션:
├── 배경색, 테두리
├── 패딩, 마진
├── 폰트
├── 아이콘
└── CSS 클래스 (고급)
\`\`\`
        `,
        externalLinks: [
          { title: 'Widget Reference', url: 'https://www.palantir.com/docs/foundry/workshop/widgets/' }
        ]
      }
    },
    {
      id: 'workshop-exercise-1',
      type: 'code',
      title: '대시보드 구축 실습',
      duration: 60,
      content: {
        objectives: [
          '운영 대시보드를 구축한다',
          '다양한 위젯을 활용한다',
          '레이아웃을 구성한다'
        ],
        instructions: `
## 대시보드 구축 실습

### 목표
주문 관리 대시보드

### 레이아웃

\`\`\`
┌─────────────────────────────────────────┐
│            Header: 주문 관리              │
├─────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│ │ KPI │ │ KPI │ │ KPI │ │ KPI │        │
│ │총주문│ │대기중│ │완료율│ │매출 │        │
│ └─────┘ └─────┘ └─────┘ └─────┘        │
├─────────────────────────────────────────┤
│ [Filter: 기간] [Filter: 상태]            │
├────────────────────┬────────────────────┤
│                    │                    │
│   주문 목록        │   월별 추이        │
│   (Table)          │   (Line Chart)     │
│                    │                    │
└────────────────────┴────────────────────┘
\`\`\`

### 구현 단계

1. 레이아웃 구성
2. KPI 위젯 4개
3. 필터 위젯
4. 테이블 위젯
5. 차트 위젯
6. 연동

### 체크리스트

- [ ] 레이아웃 구성
- [ ] KPI 위젯 추가
- [ ] 필터 연동
- [ ] 테이블 설정
- [ ] 차트 설정
        `,
        starterCode: `# 대시보드 설계

## 위젯 목록
| 위젯 | 유형 | 데이터 소스 |
|------|------|------------|
| | | |
`,
        solutionCode: `# 대시보드 설계 완료

## 위젯 목록
| 위젯 | 유형 | 데이터 소스 |
|------|------|------------|
| 총 주문 | KPI | Order COUNT |
| 대기 중 | KPI | Order WHERE status='pending' |
| 완료율 | KPI | Order completed/total |
| 매출 | KPI | Order SUM(amount) |
| 주문 목록 | Table | Order (filtered) |
| 월별 추이 | Line Chart | Order by month |
`
      }
    },
    {
      id: 'day1-quiz',
      type: 'quiz',
      title: 'Workshop 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Variable의 역할은?',
            options: ['데이터 저장', '앱 상태 관리', '권한 제어', '로깅'],
            answer: 1,
            explanation: 'Variable은 앱의 상태(선택된 항목, 필터 값 등)를 관리합니다.'
          },
          {
            question: '조건부 표시의 사용 사례가 아닌 것은?',
            options: ['권한별 버튼 표시', '데이터 없을 때 메시지', '성능 최적화', '역할별 섹션'],
            answer: 2,
            explanation: '조건부 표시는 UI 제어용이며, 성능 최적화와는 관련이 없습니다.'
          }
        ]
      }
    },
    {
      id: 'day1-project',
      type: 'project',
      title: '앱 설계',
      duration: 20,
      content: {
        objectives: [
          '운영 앱의 페이지와 위젯을 설계한다'
        ],
        requirements: [
          '**앱 설계서**',
          '',
          '## 페이지 구조',
          '```',
          '[페이지 다이어그램]',
          '```',
          '',
          '## 위젯 목록',
          '| 페이지 | 위젯 | 유형 |',
          '|--------|------|------|'
        ],
        evaluationCriteria: [
          '설계 완성도'
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'variables-events',
  title: 'Variables & Events',
  totalDuration: 180,
  tasks: [
    {
      id: 'variables-deep',
      type: 'reading',
      title: 'Variables 심화',
      duration: 40,
      content: {
        objectives: [
          'Variable 유형을 이해한다',
          '상태 관리 패턴을 파악한다',
          '복잡한 상태를 처리한다'
        ],
        markdown: `
## Variables 심화

### Variable 유형

\`\`\`
1. Primitive Variables
   ├── String
   ├── Number
   ├── Boolean
   └── Date

2. Object Variables
   └── 선택된 Object 저장

3. Object Set Variables
   └── 필터된 Object 집합

4. Array Variables
   └── 다중 선택 저장

5. Derived Variables
   └── 다른 Variable에서 계산
\`\`\`

### 상태 관리 패턴

\`\`\`
Master-Detail 패턴:
├── masterList: Object Set (전체 목록)
├── selectedItem: Object (선택된 항목)
└── detailView: 선택에 따라 표시

Filter 패턴:
├── filterStatus: String
├── filterDateRange: [start, end]
└── filteredItems: Object Set (필터 적용)

Form 패턴:
├── formData: Object (입력 데이터)
├── isEditing: Boolean
├── validationErrors: Array
└── Submit → Action 실행
\`\`\`

### Derived Variables

\`\`\`
계산 예시:
├── totalAmount = orders.sum(amount)
├── avgRating = reviews.avg(rating)
├── isHighPriority = priority > 3
└── displayName = firstName + " " + lastName
\`\`\`
        `,
        externalLinks: [
          { title: 'Variables', url: 'https://learn.palantir.com/variables' }
        ]
      }
    },
    {
      id: 'events-actions',
      type: 'reading',
      title: 'Events & Actions 연동',
      duration: 45,
      content: {
        objectives: [
          'Event 유형을 이해한다',
          'Action 트리거를 설정한다',
          '복잡한 워크플로우를 구현한다'
        ],
        markdown: `
## Events & Actions 연동

### Event 유형

\`\`\`
User Events:
├── onClick
├── onSelect
├── onChange
├── onSubmit
└── onHover

System Events:
├── onLoad
├── onDataUpdate
├── onError
└── onTimer
\`\`\`

### Action 트리거

\`\`\`
Event → Action 매핑:

Button Click
    │
    ▼
[Validation Check]
    │
    ├── Pass → Execute Action
    │              │
    │              ▼
    │         [Success Handler]
    │              │
    │              ├── Update Variable
    │              ├── Show Toast
    │              └── Navigate
    │
    └── Fail → Show Error
\`\`\`

### 워크플로우 예시

\`\`\`
주문 승인 워크플로우:

1. 테이블에서 주문 선택
   └── Event: onRowSelect
   └── Action: selectedOrder = order

2. 승인 버튼 클릭
   └── Event: onClick
   └── Validation: amount < limit
   └── Action: order.approve()

3. 성공 시
   └── Update: orderList refresh
   └── Toast: "승인 완료"
   └── Variable: selectedOrder = null
\`\`\`

### 다중 Action

\`\`\`
Sequential Actions:
├── Action 1 완료 후
├── Action 2 실행
└── 최종 결과 처리

Parallel Actions:
├── Action 1
├── Action 2 (동시)
└── 모두 완료 후 처리
\`\`\`
        `,
        externalLinks: [
          { title: 'Events & Actions', url: 'https://learn.palantir.com/events' }
        ]
      }
    },
    {
      id: 'interaction-exercise',
      type: 'code',
      title: '인터랙션 구현 실습',
      duration: 60,
      content: {
        objectives: [
          'Master-Detail 패턴을 구현한다',
          'Event-Action 연동을 설정한다',
          '상태 관리를 구현한다'
        ],
        instructions: `
## 인터랙션 구현 실습

### 목표
주문 목록-상세 인터랙션

### 요구사항

1. **Master-Detail**
   - 왼쪽: 주문 목록 (Table)
   - 오른쪽: 선택된 주문 상세

2. **상태 관리**
   - selectedOrder: 선택된 주문
   - filterStatus: 상태 필터

3. **Actions**
   - 행 선택 → 상세 표시
   - 승인 버튼 → Action 실행
   - 성공 → 목록 갱신

### 체크리스트

- [ ] Variables 설정
- [ ] 테이블 선택 이벤트
- [ ] 상세 패널 바인딩
- [ ] Action 버튼
- [ ] 성공/실패 처리
        `,
        starterCode: `# 인터랙션 설계

## Variables
| 이름 | 타입 | 용도 |
|------|------|------|
| | | |

## Events
| 위젯 | Event | Action |
|------|-------|--------|
| | | |
`,
        solutionCode: `# 인터랙션 설계 완료

## Variables
| 이름 | 타입 | 용도 |
|------|------|------|
| selectedOrder | Order | 선택된 주문 |
| filterStatus | String | 상태 필터 |
| isLoading | Boolean | 로딩 상태 |

## Events
| 위젯 | Event | Action |
|------|-------|--------|
| OrderTable | onRowSelect | setSelectedOrder |
| ApproveBtn | onClick | approveOrder |
| StatusFilter | onChange | updateFilter |
`
      }
    },
    {
      id: 'day2-quiz',
      type: 'quiz',
      title: 'Variables & Events 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Derived Variable의 특징은?',
            options: ['사용자 입력', '다른 Variable에서 계산', '고정 값', '랜덤 생성'],
            answer: 1,
            explanation: 'Derived Variable은 다른 Variable에서 계산됩니다. 예: total = quantity * price'
          }
        ]
      }
    },
    {
      id: 'day2-project',
      type: 'project',
      title: '상태 관리 설계',
      duration: 20,
      content: {
        objectives: [
          '앱의 전체 상태 관리를 설계한다'
        ],
        requirements: [
          '**상태 관리 설계서**',
          '',
          '## Variables',
          '| 이름 | 타입 | 초기값 | 용도 |',
          '|------|------|-------|------|'
        ],
        evaluationCriteria: [
          '상태 설계 완성도'
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'forms-actions',
  title: 'Forms & Actions 통합',
  totalDuration: 180,
  tasks: [
    {
      id: 'form-building',
      type: 'reading',
      title: 'Form 구축',
      duration: 40,
      content: {
        objectives: [
          'Form 위젯을 이해한다',
          '입력 검증을 설정한다',
          'Action과 연동한다'
        ],
        markdown: `
## Form 구축

### Form 구성요소

\`\`\`
Form:
├── Input Fields
│   ├── Text Input
│   ├── Number Input
│   ├── Date Picker
│   ├── Dropdown
│   └── Checkbox
├── Validation
│   ├── Required
│   ├── Format
│   └── Custom
├── Submit Button
└── Error Display
\`\`\`

### 입력 검증

\`\`\`
검증 유형:
├── Required: 필수 값
├── Min/Max: 범위
├── Pattern: 정규식
├── Custom: 함수
└── Cross-field: 필드 간

예시:
├── email: required, email format
├── amount: required, > 0
├── endDate: > startDate
└── password: min 8 chars
\`\`\`

### Action 연동

\`\`\`
Form Submit 플로우:

[Form Data]
     │
     ▼
[Validation]
     │
     ├── Invalid → Show Errors
     │
     └── Valid → Execute Action
                      │
                      ▼
               [Success/Failure]
                      │
                      ├── Success → Toast, Reset, Navigate
                      └── Failure → Error Message
\`\`\`
        `,
        externalLinks: [
          { title: 'Forms', url: 'https://learn.palantir.com/forms' }
        ]
      }
    },
    {
      id: 'action-integration',
      type: 'reading',
      title: 'Ontology Action 통합',
      duration: 40,
      content: {
        objectives: [
          'Ontology Action을 Form과 연결한다',
          '파라미터 매핑을 설정한다',
          '결과 처리를 구현한다'
        ],
        markdown: `
## Ontology Action 통합

### Action 연결

\`\`\`
Workshop Form → Ontology Action

Form Fields          Action Parameters
├── orderAmount  →   ├── amount
├── customerId   →   ├── customer
├── notes        →   └── notes (optional)
└── [Submit]     →   execute()
\`\`\`

### 파라미터 매핑

\`\`\`
매핑 유형:
├── Direct: field → parameter
├── Variable: variable → parameter
├── Constant: fixed value
├── Computed: expression
└── Object Reference: selected object
\`\`\`

### 결과 처리

\`\`\`
Success:
├── Toast notification
├── Variable reset
├── Object Set refresh
├── Page navigation
└── Modal close

Failure:
├── Error toast
├── Field-level errors
├── Retry option
└── Log error
\`\`\`

### 권한 연동

\`\`\`
Action 권한 확인:
├── 버튼 표시/숨김
├── 버튼 비활성화
├── 에러 메시지
└── 감사 로그
\`\`\`
        `,
        externalLinks: [
          { title: 'Action Integration', url: 'https://learn.palantir.com/action-integration' }
        ]
      }
    },
    {
      id: 'form-exercise',
      type: 'code',
      title: 'Form & Action 실습',
      duration: 60,
      content: {
        objectives: [
          '주문 생성 Form을 구현한다',
          'Ontology Action을 연결한다',
          '검증과 결과 처리를 구현한다'
        ],
        instructions: `
## Form & Action 실습

### 목표
새 주문 생성 Form

### 요구사항

1. **Form Fields**
   - 고객 선택 (Object Picker)
   - 제품 선택 (Multi-select)
   - 수량 (Number)
   - 배송 주소 (Text)
   - 메모 (Text, optional)

2. **검증**
   - 고객: 필수
   - 수량: 필수, > 0
   - 주소: 필수

3. **Action 연동**
   - createOrder Action
   - 파라미터 매핑
   - 성공/실패 처리

### 체크리스트

- [ ] Form 레이아웃
- [ ] Input 필드
- [ ] 검증 규칙
- [ ] Action 연결
- [ ] 결과 처리
        `,
        starterCode: `# Form 설계

## Fields
| 필드 | 타입 | 검증 |
|------|------|------|
| | | |

## Action 매핑
| Field | Parameter |
|-------|-----------|
| | |
`,
        solutionCode: `# Form 설계 완료

## Fields
| 필드 | 타입 | 검증 |
|------|------|------|
| customer | Object Picker | required |
| products | Multi-select | required, min 1 |
| quantity | Number | required, > 0 |
| address | Text | required, min 10 chars |
| notes | Text | optional |

## Action 매핑
| Field | Parameter |
|-------|-----------|
| customer | customer_id |
| products | product_ids |
| quantity | quantity |
| address | shipping_address |
| notes | notes |
`
      }
    },
    {
      id: 'day3-quiz',
      type: 'quiz',
      title: 'Forms & Actions 퀴즈',
      duration: 20,
      content: {
        questions: [
          {
            question: 'Form 검증 실패 시 어떻게 해야 하는가?',
            options: ['무시', '에러 표시 및 Submit 차단', '경고 후 진행', '자동 수정'],
            answer: 1,
            explanation: '검증 실패 시 에러를 표시하고 Submit을 차단해야 합니다.'
          }
        ]
      }
    },
    {
      id: 'day3-project',
      type: 'project',
      title: 'Form 설계',
      duration: 20,
      content: {
        objectives: [
          '주요 Form을 설계한다'
        ],
        requirements: [
          '**Form 설계서**',
          '',
          '## Form 목록',
          '| Form | Action | Fields |',
          '|------|--------|--------|'
        ],
        evaluationCriteria: [
          'Form 설계 완성도'
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'quiver-analysis',
  title: 'Quiver & 분석',
  totalDuration: 180,
  tasks: [
    {
      id: 'quiver-intro',
      type: 'reading',
      title: 'Quiver 소개',
      duration: 40,
      content: {
        objectives: [
          'Quiver 분석 도구를 이해한다',
          'SQL과 Python 분석을 파악한다',
          'Ontology 연동을 익힌다'
        ],
        markdown: `
## Quiver 소개

### Quiver란?

\`\`\`
Quiver = 분석용 노트북 환경

특징:
├── SQL 쿼리
├── Python 분석
├── Ontology 연동
├── 시각화
└── 공유/협업
\`\`\`

### SQL 분석

\`\`\`sql
-- Object Set 쿼리
SELECT *
FROM [Ontology/Orders]
WHERE status = 'completed'
  AND amount > 1000
ORDER BY created_at DESC
LIMIT 100

-- 집계
SELECT
    customer_id,
    COUNT(*) as order_count,
    SUM(amount) as total_amount
FROM [Ontology/Orders]
GROUP BY customer_id
ORDER BY total_amount DESC
\`\`\`

### Python 분석

\`\`\`python
# Object Set 로드
orders = foundry.get_objects("Order")

# Pandas로 변환
import pandas as pd
df = orders.to_pandas()

# 분석
summary = df.groupby('customer_id').agg({
    'amount': ['sum', 'mean', 'count']
})

# 시각화
import matplotlib.pyplot as plt
df['amount'].hist(bins=50)
plt.show()
\`\`\`

### Workshop 연동

\`\`\`
Quiver → Workshop:
├── 쿼리 결과 저장
├── Widget 데이터 소스
└── 자동 갱신
\`\`\`
        `,
        externalLinks: [
          { title: 'Quiver', url: 'https://learn.palantir.com/quiver' }
        ]
      }
    },
    {
      id: 'analysis-exercise',
      type: 'code',
      title: '분석 실습',
      duration: 80,
      content: {
        objectives: [
          'Quiver에서 분석을 수행한다',
          '인사이트를 도출한다',
          'Workshop과 연동한다'
        ],
        instructions: `
## 분석 실습

### 목표
주문 데이터 분석 및 인사이트 도출

### 분석 과제

1. **기본 통계**
   - 총 주문 수
   - 평균 주문 금액
   - 상위 고객

2. **시계열 분석**
   - 월별 추이
   - 요일별 패턴
   - 성수기/비수기

3. **고객 세그먼트**
   - RFM 분석
   - 등급별 분포
   - 이탈 위험

### 체크리스트

- [ ] 기본 통계 쿼리
- [ ] 시계열 분석
- [ ] 시각화
- [ ] 인사이트 정리
        `,
        starterCode: `# 분석 결과

## 기본 통계
- 총 주문 수:
- 평균 금액:
- 상위 고객:

## 인사이트
1.
2.
3.
`,
        solutionCode: `# 분석 결과 완료

## 기본 통계
- 총 주문 수: 15,234
- 평균 금액: ₩85,000
- 상위 고객: Kim (₩2.5M), Lee (₩2.1M)

## 인사이트
1. 금요일 주문량이 평일 대비 40% 높음
2. Q4 매출이 연간의 45% 차지
3. 상위 10% 고객이 전체 매출의 60%
`
      }
    },
    {
      id: 'day4-quiz',
      type: 'quiz',
      title: 'Quiver 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Quiver의 주요 용도는?',
            options: ['운영 앱', '데이터 분석', '권한 관리', '스케줄링'],
            answer: 1,
            explanation: 'Quiver는 SQL/Python을 사용한 데이터 분석 도구입니다.'
          }
        ]
      }
    },
    {
      id: 'day4-project',
      type: 'project',
      title: '분석 리포트',
      duration: 45,
      content: {
        objectives: [
          '분석 리포트를 작성한다'
        ],
        requirements: [
          '**분석 리포트**',
          '',
          '## 분석 목적',
          '-',
          '',
          '## 주요 발견',
          '1.',
          '2.',
          '',
          '## 권장 사항',
          '-'
        ],
        evaluationCriteria: [
          '분석 깊이'
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'week6-checkpoint',
  title: 'Week 6 체크포인트',
  totalDuration: 180,
  tasks: [
    {
      id: 'workshop-project',
      type: 'project',
      title: 'Workshop 운영 앱 프로젝트',
      duration: 120,
      content: {
        objectives: [
          '완전한 운영 앱을 구축한다',
          '모든 기능을 통합한다'
        ],
        requirements: [
          '**Workshop 운영 앱 프로젝트**',
          '',
          '## 요구사항',
          '',
          '1. **페이지**',
          '   - 대시보드',
          '   - 목록/상세',
          '   - 생성/수정 Form',
          '',
          '2. **기능**',
          '   - CRUD 작업',
          '   - 검색/필터',
          '   - Actions',
          '',
          '3. **품질**',
          '   - 반응형',
          '   - 에러 처리',
          '   - 로딩 상태',
          '',
          '## 산출물',
          '- [ ] Workshop 앱',
          '- [ ] 사용자 가이드'
        ],
        evaluationCriteria: [
          '앱 완성도 (50%)',
          '기능 (30%)',
          'UX (20%)'
        ]
      }
    },
    {
      id: 'week6-review',
      type: 'challenge',
      title: 'Week 6 체크포인트',
      duration: 60,
      content: {
        objectives: [
          'Week 6 산출물을 점검한다',
          'Application Developer 자격증 준비'
        ],
        requirements: [
          '**Week 6 산출물 체크리스트**',
          '',
          '□ 대시보드',
          '□ Master-Detail',
          '□ Form + Action',
          '□ 분석 리포트',
          '□ **운영 앱**',
          '',
          '**자격증 준비**',
          '',
          '□ Application Developer 범위 학습',
          '□ 모의시험'
        ],
        evaluationCriteria: [
          '산출물 완성도'
        ]
      }
    }
  ]
}

export const foundryWorkshopWeek: Week = {
  slug: 'foundry-workshop',
  week: 6,
  phase: 7,
  month: 14,
  access: 'pro',
  title: 'Workshop & Application',
  topics: ['Workshop', 'Variables', 'Events', 'Forms', 'Quiver'],
  practice: '운영 앱 프로젝트',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
