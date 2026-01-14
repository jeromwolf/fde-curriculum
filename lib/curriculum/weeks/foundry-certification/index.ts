// Phase 7, Week 8: Certification & Final Review
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'certification-overview',
  title: '자격증 시험 개요',
  totalDuration: 180,
  tasks: [
    {
      id: 'cert-tracks',
      type: 'reading',
      title: 'Foundry 자격증 트랙',
      duration: 45,
      content: {
        objectives: [
          'Foundry 자격증 체계를 이해한다',
          '각 트랙의 요구사항을 파악한다',
          '시험 형식을 숙지한다'
        ],
        markdown: `
## Foundry 자격증 트랙

### 자격증 체계

\`\`\`
Palantir Foundry Certifications:

├── Data Engineer Track
│   ├── Foundry Data Engineer Associate
│   └── Foundry Data Engineer Professional
│
├── Application Developer Track
│   ├── Foundry App Developer Associate
│   └── Foundry App Developer Professional
│
└── Specialist Tracks
    ├── Ontology Specialist
    ├── AIP Specialist
    └── Pipeline Specialist
\`\`\`

### Data Engineer 트랙

\`\`\`
Associate (입문):
├── Data Connection & Integration
├── Pipeline Builder 기초
├── Transform 기초
├── Scheduling & Monitoring
└── 시험: 60문항, 90분

Professional (전문):
├── 복잡한 파이프라인 설계
├── PySpark Transform 고급
├── 성능 최적화
├── CI/CD & Best Practices
└── 시험: 50문항 + 실기, 120분
\`\`\`

### Application Developer 트랙

\`\`\`
Associate (입문):
├── Ontology 기초
├── Object Types & Links
├── Workshop 기초
├── Action 구현
└── 시험: 60문항, 90분

Professional (전문):
├── 복잡한 Ontology 설계
├── Workshop 고급 기능
├── TypeScript Functions
├── AIP 통합
└── 시험: 50문항 + 실기, 120분
\`\`\`

### 시험 형식

| 항목 | Associate | Professional |
|------|-----------|--------------|
| 문항 수 | 60문항 | 50문항 + 실기 |
| 시간 | 90분 | 120분 |
| 합격 점수 | 70% | 75% |
| 유효 기간 | 2년 | 2년 |
| 응시료 | $200 | $350 |
        `,
        externalLinks: [
          { title: 'Palantir Foundry Docs', url: 'https://www.palantir.com/docs/foundry/' },
          { title: 'Foundry Training', url: 'https://www.palantir.com/docs/foundry/getting-started/' }
        ]
      }
    },
    {
      id: 'exam-domains',
      type: 'reading',
      title: '시험 도메인',
      duration: 45,
      content: {
        objectives: [
          '각 도메인별 출제 비중을 파악한다',
          '중점 학습 영역을 식별한다'
        ],
        markdown: `
## 시험 도메인

### Data Engineer Associate 도메인

| 도메인 | 비중 | 핵심 토픽 |
|--------|------|-----------|
| **Data Connection** | 20% | Sync, Source 설정, 스키마 |
| **Pipeline Builder** | 30% | Transform, Join, Filter |
| **Code Transforms** | 25% | PySpark, @transform |
| **Scheduling** | 15% | Build, Schedule, Alert |
| **Best Practices** | 10% | Naming, Documentation |

### Application Developer Associate 도메인

| 도메인 | 비중 | 핵심 토픽 |
|--------|------|-----------|
| **Ontology Basics** | 25% | Object Type, Property |
| **Link Types** | 20% | 관계 정의, Cardinality |
| **Workshop** | 30% | Widget, Layout, Variable |
| **Actions** | 15% | Action 정의, 실행 |
| **Best Practices** | 10% | 설계 패턴, 문서화 |

### 도메인별 가중치 시각화

\`\`\`
Data Engineer:
Pipeline Builder ████████████████ 30%
Code Transforms  █████████████ 25%
Data Connection  ██████████ 20%
Scheduling       ███████ 15%
Best Practices   █████ 10%

App Developer:
Workshop         ████████████████ 30%
Ontology Basics  █████████████ 25%
Link Types       ██████████ 20%
Actions          ███████ 15%
Best Practices   █████ 10%
\`\`\`

### 주요 출제 토픽

**자주 출제되는 토픽:**
- Transform 종류와 차이점
- PySpark DataFrame 연산
- Object Type 속성 정의
- Workshop Variable 바인딩
- Action 파라미터 처리
        `,
        externalLinks: [
          { title: 'Foundry Concepts', url: 'https://www.palantir.com/docs/foundry/getting-started/key-concepts/' }
        ]
      }
    },
    {
      id: 'study-plan',
      type: 'code',
      title: '학습 계획 수립',
      duration: 60,
      content: {
        objectives: [
          '자신의 강점/약점을 파악한다',
          '맞춤형 학습 계획을 수립한다'
        ],
        instructions: `
## 학습 계획 수립

### 자가 진단

각 도메인별로 자신감 수준을 평가하세요 (1-5):

**Data Engineer:**
- Data Connection: __/5
- Pipeline Builder: __/5
- Code Transforms: __/5
- Scheduling: __/5

**App Developer:**
- Ontology: __/5
- Link Types: __/5
- Workshop: __/5
- Actions: __/5

### 학습 우선순위

\`\`\`
우선순위 = 출제 비중 × (5 - 자신감)

높은 점수 → 먼저 학습
\`\`\`

### 학습 계획 템플릿

| 도메인 | 자신감 | 비중 | 우선순위 | 학습 시간 |
|--------|--------|------|----------|-----------|
| | | | | |

### 체크리스트

- [ ] 자가 진단 완료
- [ ] 우선순위 계산
- [ ] 학습 계획 수립
        `,
        starterCode: `# 학습 계획

## 자가 진단 (1-5)

### Data Engineer
| 도메인 | 점수 |
|--------|------|
| Data Connection | |
| Pipeline Builder | |
| Code Transforms | |
| Scheduling | |

### App Developer
| 도메인 | 점수 |
|--------|------|
| Ontology | |
| Link Types | |
| Workshop | |
| Actions | |

## 학습 우선순위 (우선순위 = 비중 × (5-점수))

| 도메인 | 우선순위 점수 | 학습 시간 |
|--------|--------------|-----------|
| | | |

## 학습 일정
Day 2:
Day 3:
Day 4:
`,
        solutionCode: `# 학습 계획 (예시)

## 자가 진단 (1-5)

### Data Engineer
| 도메인 | 점수 |
|--------|------|
| Data Connection | 4 |
| Pipeline Builder | 3 |
| Code Transforms | 2 |
| Scheduling | 4 |

### App Developer
| 도메인 | 점수 |
|--------|------|
| Ontology | 3 |
| Link Types | 3 |
| Workshop | 4 |
| Actions | 2 |

## 학습 우선순위 (우선순위 = 비중 × (5-점수))

| 도메인 | 우선순위 점수 | 학습 시간 |
|--------|--------------|-----------|
| Code Transforms | 25×3=75 | 3시간 |
| Actions | 15×3=45 | 2시간 |
| Pipeline Builder | 30×2=60 | 2시간 |
| Link Types | 20×2=40 | 1.5시간 |
| Ontology | 25×2=50 | 1.5시간 |

## 학습 일정
Day 2: Code Transforms 집중 복습
Day 3: Pipeline Builder + Ontology
Day 4: Actions + Link Types + Workshop
`
      }
    },
    {
      id: 'day1-quiz',
      type: 'quiz',
      title: '자격증 개요 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Foundry Data Engineer Associate 시험의 합격 점수는?',
            options: ['60%', '70%', '75%', '80%'],
            answer: 1,
            explanation: 'Associate 레벨은 70%, Professional 레벨은 75%가 합격 기준입니다.'
          },
          {
            question: 'Data Engineer 시험에서 가장 비중이 높은 도메인은?',
            options: ['Data Connection', 'Pipeline Builder', 'Scheduling', 'Best Practices'],
            answer: 1,
            explanation: 'Pipeline Builder가 30%로 가장 높은 비중을 차지합니다.'
          }
        ]
      }
    },
    {
      id: 'day1-project',
      type: 'project',
      title: '학습 계획서',
      duration: 15,
      content: {
        objectives: [
          '개인 맞춤 학습 계획을 완성한다'
        ],
        requirements: [
          '**학습 계획서**',
          '',
          '## 목표 자격증:',
          '## 시험 예정일:',
          '## 학습 우선순위:',
          '## 일별 학습 계획:'
        ],
        evaluationCriteria: [
          '계획의 구체성'
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'data-engineer-review',
  title: 'Data Engineer 복습',
  totalDuration: 180,
  tasks: [
    {
      id: 'pipeline-review',
      type: 'reading',
      title: 'Pipeline Builder 핵심 복습',
      duration: 45,
      content: {
        objectives: [
          'Pipeline Builder 핵심 개념을 복습한다',
          '자주 출제되는 패턴을 학습한다'
        ],
        markdown: `
## Pipeline Builder 핵심 복습

### Transform 종류

\`\`\`
Transform Types:
├── Join
│   ├── Inner Join: 교집합
│   ├── Left Join: 왼쪽 기준 + 매칭
│   ├── Right Join: 오른쪽 기준 + 매칭
│   └── Full Outer: 합집합
│
├── Filter
│   ├── Row Filter: 행 필터링
│   └── Column Filter: 열 선택
│
├── Aggregate
│   ├── Group By: 그룹화
│   ├── Sum, Count, Avg, Min, Max
│   └── Window Functions
│
├── Union
│   └── 동일 스키마 병합
│
└── Pivot / Unpivot
    └── 행↔열 변환
\`\`\`

### 자주 출제되는 문제 유형

**1. Join 결과 예측**
\`\`\`
Table A: [1, 2, 3]
Table B: [2, 3, 4]

Q: Inner Join 결과는?
A: [2, 3]

Q: Left Join 결과는?
A: [1, 2, 3] (1은 null)
\`\`\`

**2. Aggregate 결과**
\`\`\`
Orders: (customer, amount)
[(A, 100), (A, 200), (B, 150)]

Q: Group By customer, SUM(amount)?
A: [(A, 300), (B, 150)]
\`\`\`

**3. Pipeline 순서**
\`\`\`
Q: 필터링은 Join 전/후 어디가 효율적?
A: 전 (데이터 감소 → 성능 향상)
\`\`\`

### Best Practices

| Practice | 이유 |
|----------|------|
| 필터 먼저 | 데이터 감소 → 성능 |
| 컬럼 선택 | 불필요한 데이터 제거 |
| Broadcast Join | 작은 테이블 복제 |
| 캐싱 | 재사용 데이터셋 |
        `,
        externalLinks: [
          { title: 'Pipeline Builder', url: 'https://www.palantir.com/docs/foundry/pipeline-builder/' }
        ]
      }
    },
    {
      id: 'transforms-review',
      type: 'reading',
      title: 'Code Transforms 핵심 복습',
      duration: 45,
      content: {
        objectives: [
          'PySpark Transform 핵심을 복습한다',
          '자주 출제되는 API를 숙지한다'
        ],
        markdown: `
## Code Transforms 핵심 복습

### @transform 데코레이터

\`\`\`python
from transforms.api import transform, Input, Output

@transform(
    source=Input("/path/to/input"),
    output=Output("/path/to/output")
)
def compute(source, output):
    df = source.dataframe()
    # 처리 로직
    output.write_dataframe(df)
\`\`\`

### 자주 사용되는 PySpark API

\`\`\`python
# Select
df.select("col1", "col2")

# Filter
df.filter(col("amount") > 100)
df.where(col("status") == "active")

# Group & Aggregate
df.groupBy("category").agg(
    sum("amount").alias("total"),
    count("*").alias("count")
)

# Join
df1.join(df2, df1.id == df2.id, "inner")

# Window
from pyspark.sql.window import Window
window = Window.partitionBy("customer").orderBy("date")
df.withColumn("running_total", sum("amount").over(window))

# UDF
from pyspark.sql.functions import udf
@udf("string")
def custom_func(value):
    return value.upper()
df.withColumn("upper", custom_func(col("name")))
\`\`\`

### Incremental Transform

\`\`\`python
from transforms.api import transform, incremental

@incremental()
@transform(...)
def compute(ctx, source, output):
    # ctx.is_incremental: 증분 여부
    # 이전 실행 이후 새 데이터만 처리
    pass
\`\`\`

### 자주 출제되는 문제

**1. API 결과 예측**
\`\`\`python
df.filter(col("x") > 10).select("y")
# Q: 어떤 컬럼이 남는가?
# A: y만 남음
\`\`\`

**2. Join 조건**
\`\`\`python
df1.join(df2, "id")  # Natural Join
df1.join(df2, df1.id == df2.id)  # Explicit
# 차이점: 결과 컬럼 수
\`\`\`

**3. Window vs GroupBy**
\`\`\`
GroupBy: 집계 결과만 반환
Window: 원본 + 집계 함께 반환
\`\`\`
        `,
        externalLinks: [
          { title: 'Transforms Python', url: 'https://www.palantir.com/docs/foundry/transforms-python/' }
        ]
      }
    },
    {
      id: 'de-practice',
      type: 'code',
      title: 'Data Engineer 연습 문제',
      duration: 60,
      content: {
        objectives: [
          '실전 문제를 풀어본다',
          '약점을 파악한다'
        ],
        instructions: `
## Data Engineer 연습 문제

### 문제 1: Pipeline Builder
다음 상황에서 최적의 Pipeline을 설계하세요:
- Input: 주문 테이블 (1000만 건), 고객 테이블 (10만 건)
- 목표: VIP 고객의 최근 1년 주문 합계

### 문제 2: Transform 결과
\`\`\`python
df = spark.createDataFrame([
    (1, "A", 100),
    (2, "A", 200),
    (3, "B", 150)
], ["id", "category", "amount"])

result = df.groupBy("category").agg(
    sum("amount").alias("total"),
    count("*").alias("cnt")
)
\`\`\`
result의 스키마와 데이터는?

### 문제 3: 성능 최적화
아래 코드의 문제점과 개선 방안은?
\`\`\`python
big_df.join(small_df, "id")
      .filter(col("date") > "2024-01-01")
      .select("col1", "col2")
\`\`\`
        `,
        starterCode: `# 연습 문제 답안

## 문제 1 답안
Pipeline 설계:
1.
2.
3.

## 문제 2 답안
스키마:
데이터:

## 문제 3 답안
문제점:
개선 방안:
`,
        solutionCode: `# 연습 문제 답안

## 문제 1 답안
Pipeline 설계:
1. 주문 테이블 필터 (최근 1년)
2. 고객 테이블 필터 (VIP)
3. Join (Broadcast 고객)
4. Group By + Sum

## 문제 2 답안
스키마: [category: string, total: long, cnt: long]
데이터:
| category | total | cnt |
|----------|-------|-----|
| A        | 300   | 2   |
| B        | 150   | 1   |

## 문제 3 답안
문제점:
- Filter가 Join 후에 실행됨
- Select가 마지막에 실행됨

개선 방안:
\`\`\`python
# 1. 먼저 필터
filtered_big = big_df.filter(col("date") > "2024-01-01")
                     .select("id", "col1", "col2")

# 2. Broadcast Join
from pyspark.sql.functions import broadcast
filtered_big.join(broadcast(small_df), "id")
\`\`\`
`
      }
    },
    {
      id: 'day2-quiz',
      type: 'quiz',
      title: 'Data Engineer 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'PySpark에서 Window Function과 GroupBy의 차이점은?',
            options: ['성능 차이', 'Window는 원본 행 유지', '문법 차이', '차이 없음'],
            answer: 1,
            explanation: 'Window는 원본 데이터에 집계 결과를 추가하고, GroupBy는 집계 결과만 반환합니다.'
          },
          {
            question: 'Join 전에 Filter를 적용하는 이유는?',
            options: ['문법 요구사항', '데이터 감소로 성능 향상', '결과 정확도', '필수 순서'],
            answer: 1,
            explanation: 'Join 전 필터링으로 처리할 데이터량을 줄여 성능을 향상시킵니다.'
          }
        ]
      }
    },
    {
      id: 'day2-project',
      type: 'project',
      title: 'DE 모의고사 1회',
      duration: 15,
      content: {
        objectives: [
          '모의고사를 풀고 점수를 확인한다'
        ],
        requirements: [
          '**모의고사 결과**',
          '',
          '## 점수: __/100',
          '## 틀린 문제:',
          '## 복습 필요 영역:'
        ],
        evaluationCriteria: [
          '목표 점수 70% 이상'
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'app-developer-review',
  title: 'App Developer 복습',
  totalDuration: 180,
  tasks: [
    {
      id: 'ontology-review',
      type: 'reading',
      title: 'Ontology 핵심 복습',
      duration: 45,
      content: {
        objectives: [
          'Ontology 핵심 개념을 복습한다',
          '자주 출제되는 패턴을 학습한다'
        ],
        markdown: `
## Ontology 핵심 복습

### Object Type 구성요소

\`\`\`
Object Type:
├── Primary Key: 고유 식별자
├── Properties: 속성들
│   ├── String, Integer, Double
│   ├── Date, Timestamp
│   ├── Boolean
│   ├── Array
│   └── GeoPoint, GeoShape
├── Title Property: 표시 이름
├── Description: 설명
└── Backing Dataset: 데이터 소스
\`\`\`

### Link Types

\`\`\`
Link Type:
├── Source Object Type
├── Target Object Type
├── Cardinality
│   ├── One-to-One (1:1)
│   ├── One-to-Many (1:N)
│   └── Many-to-Many (M:N)
├── Foreign Key 설정
└── Reverse Link
\`\`\`

### 자주 출제되는 문제

**1. Cardinality 선택**
\`\`\`
고객 → 주문: 1:N (한 고객이 여러 주문)
주문 → 제품: M:N (한 주문에 여러 제품, 한 제품이 여러 주문)
직원 → 부서: N:1 (여러 직원이 한 부서)
\`\`\`

**2. Primary Key 선택**
\`\`\`
좋은 PK:
✓ 고유함 (중복 없음)
✓ 불변함 (변경 안됨)
✓ 의미 있음 (식별 가능)

나쁜 PK:
✗ 이름 (중복 가능)
✗ 날짜 (변경 가능)
✗ 복합키 (복잡)
\`\`\`

**3. Property Type 선택**
\`\`\`
금액: Double (소수점)
수량: Integer (정수)
이름: String
생년월일: Date
생성시간: Timestamp
활성화: Boolean
태그: Array<String>
위치: GeoPoint
\`\`\`

### Ontology Best Practices

| Practice | 설명 |
|----------|------|
| 명확한 이름 | Customer (O), Cust (X) |
| 일관된 컨벤션 | camelCase or snake_case |
| 적절한 Cardinality | 비즈니스 규칙 반영 |
| Title Property | 의미 있는 표시명 |
        `,
        externalLinks: [
          { title: 'Ontology Overview', url: 'https://www.palantir.com/docs/foundry/ontology/' }
        ]
      }
    },
    {
      id: 'workshop-review',
      type: 'reading',
      title: 'Workshop 핵심 복습',
      duration: 45,
      content: {
        objectives: [
          'Workshop 핵심 개념을 복습한다',
          '자주 출제되는 패턴을 학습한다'
        ],
        markdown: `
## Workshop 핵심 복습

### Widget 종류

\`\`\`
Widgets:
├── Display
│   ├── Table: 데이터 테이블
│   ├── Chart: 차트
│   ├── Map: 지도
│   └── Card: 정보 카드
│
├── Input
│   ├── Text Input: 텍스트 입력
│   ├── Select: 선택
│   ├── Date Picker: 날짜
│   └── Toggle: 토글
│
├── Layout
│   ├── Container: 컨테이너
│   ├── Tabs: 탭
│   └── Modal: 모달
│
└── Action
    ├── Button: 버튼
    └── Form: 폼
\`\`\`

### Variable 바인딩

\`\`\`
Variable Types:
├── Object Set: 객체 집합
├── Object: 단일 객체
├── Property: 속성값
├── String, Number, Boolean
└── Array

바인딩 패턴:
Widget Input → Variable → Widget Display
Select      → selectedCustomer → Table Filter
\`\`\`

### Event 처리

\`\`\`
Events:
├── onClick: 클릭
├── onChange: 값 변경
├── onSelect: 선택
└── onSubmit: 제출

Event → Action:
├── Set Variable
├── Execute Action
├── Navigate
└── Show Modal
\`\`\`

### 자주 출제되는 문제

**1. Variable 연결**
\`\`\`
Q: 테이블 행 선택 → 상세 표시
A: Table onSelect → Variable (selectedObject) → Detail Widget
\`\`\`

**2. 필터 구현**
\`\`\`
Q: 드롭다운으로 테이블 필터링
A: Select → Variable → Table filter property
\`\`\`

**3. Action 연결**
\`\`\`
Q: 버튼 클릭으로 Action 실행
A: Button onClick → Execute Action → Action 선택 → Parameter 바인딩
\`\`\`
        `,
        externalLinks: [
          { title: 'Workshop', url: 'https://www.palantir.com/docs/foundry/workshop/' }
        ]
      }
    },
    {
      id: 'app-practice',
      type: 'code',
      title: 'App Developer 연습 문제',
      duration: 60,
      content: {
        objectives: [
          '실전 문제를 풀어본다',
          '약점을 파악한다'
        ],
        instructions: `
## App Developer 연습 문제

### 문제 1: Ontology 설계
E-commerce 시스템에서 필요한 Object Type과 Link를 설계하세요:
- 고객, 주문, 제품, 카테고리

### 문제 2: Workshop 설계
다음 화면을 구현하기 위한 Widget과 Variable을 설계하세요:
- 고객 목록 (테이블)
- 고객 선택 시 주문 내역 표시
- 주문 상태 변경 버튼

### 문제 3: Action 설계
주문 상태 변경 Action을 설계하세요:
- 입력: 주문 ID, 새 상태
- 검증: 유효한 상태 전이인지 확인
- 실행: 상태 업데이트
        `,
        starterCode: `# 연습 문제 답안

## 문제 1 답안
Object Types:
-

Links:
-

## 문제 2 답안
Widgets:
Variables:
Event Flow:

## 문제 3 답안
Action 설계:
`,
        solutionCode: `# 연습 문제 답안

## 문제 1 답안
Object Types:
- Customer (id, name, email, grade)
- Order (id, orderDate, status, totalAmount)
- Product (id, name, price, stock)
- Category (id, name, description)

Links:
- Customer → Order (1:N)
- Order → Product (M:N, via OrderItem)
- Product → Category (N:1)

## 문제 2 답안
Widgets:
- Table (customers)
- Table (orders, filtered)
- Button (changeStatus)

Variables:
- selectedCustomer (Object)
- customerOrders (Object Set, derived)
- newStatus (String)

Event Flow:
1. Customer Table onSelect → set selectedCustomer
2. selectedCustomer change → filter orders
3. Button onClick → execute changeStatus Action

## 문제 3 답안
Action 설계:
Name: updateOrderStatus
Parameters:
- orderId: String (required)
- newStatus: String (enum: pending, processing, shipped, delivered)

Validation:
- pending → processing ✓
- processing → shipped ✓
- shipped → delivered ✓
- 기타 → Error

Logic:
1. Get Order by orderId
2. Validate status transition
3. Update order.status = newStatus
4. Log status change
`
      }
    },
    {
      id: 'day3-quiz',
      type: 'quiz',
      title: 'App Developer 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Object Type의 Primary Key로 적절하지 않은 것은?',
            options: ['UUID', '이메일', '사원번호', '이름'],
            answer: 3,
            explanation: '이름은 중복될 수 있어 Primary Key로 부적절합니다. PK는 고유해야 합니다.'
          },
          {
            question: 'Workshop에서 테이블 행 선택을 다른 위젯에 전달하는 방법은?',
            options: ['직접 연결', 'Variable 바인딩', 'API 호출', '새로고침'],
            answer: 1,
            explanation: 'Variable을 통해 선택된 객체를 저장하고 다른 위젯에서 참조합니다.'
          }
        ]
      }
    },
    {
      id: 'day3-project',
      type: 'project',
      title: 'AD 모의고사 1회',
      duration: 15,
      content: {
        objectives: [
          '모의고사를 풀고 점수를 확인한다'
        ],
        requirements: [
          '**모의고사 결과**',
          '',
          '## 점수: __/100',
          '## 틀린 문제:',
          '## 복습 필요 영역:'
        ],
        evaluationCriteria: [
          '목표 점수 70% 이상'
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'mock-exam',
  title: '종합 모의시험',
  totalDuration: 180,
  tasks: [
    {
      id: 'mock-exam-de',
      type: 'challenge',
      title: 'Data Engineer 모의시험',
      duration: 90,
      content: {
        objectives: [
          '실전 환경에서 시험을 경험한다',
          '시간 관리 능력을 기른다'
        ],
        requirements: [
          '**Data Engineer Associate 모의시험**',
          '',
          '## 시험 조건',
          '- 문항: 30문항 (실제 60문항의 절반)',
          '- 시간: 45분',
          '- 합격: 70% (21문항)',
          '',
          '## 문제 예시',
          '',
          '**Q1. Pipeline Builder에서 Inner Join의 결과는?**',
          '- A와 B 테이블의 교집합',
          '',
          '**Q2. @transform 데코레이터의 역할은?**',
          '- Transform 함수 정의',
          '',
          '**Q3. 성능 최적화를 위한 Best Practice는?**',
          '- Join 전 Filter 적용',
          '',
          '## 시험 전략',
          '- 문항당 1.5분',
          '- 모르는 문제 표시 후 진행',
          '- 마지막에 재검토'
        ],
        evaluationCriteria: [
          '70% 이상 정답'
        ]
      }
    },
    {
      id: 'mock-exam-ad',
      type: 'challenge',
      title: 'App Developer 모의시험',
      duration: 90,
      content: {
        objectives: [
          '실전 환경에서 시험을 경험한다',
          '시간 관리 능력을 기른다'
        ],
        requirements: [
          '**App Developer Associate 모의시험**',
          '',
          '## 시험 조건',
          '- 문항: 30문항 (실제 60문항의 절반)',
          '- 시간: 45분',
          '- 합격: 70% (21문항)',
          '',
          '## 문제 예시',
          '',
          '**Q1. Object Type의 Primary Key 조건은?**',
          '- 고유성, 불변성',
          '',
          '**Q2. 1:N 관계의 예시는?**',
          '- 고객 → 주문',
          '',
          '**Q3. Workshop Variable의 역할은?**',
          '- Widget 간 데이터 전달',
          '',
          '## 시험 전략',
          '- 문항당 1.5분',
          '- 모르는 문제 표시 후 진행',
          '- 마지막에 재검토'
        ],
        evaluationCriteria: [
          '70% 이상 정답'
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'final-review',
  title: '최종 점검 & 포트폴리오',
  totalDuration: 180,
  tasks: [
    {
      id: 'portfolio-review',
      type: 'project',
      title: '포트폴리오 정리',
      duration: 90,
      content: {
        objectives: [
          '8주간 프로젝트를 정리한다',
          '포트폴리오를 완성한다'
        ],
        requirements: [
          '**Foundry 포트폴리오**',
          '',
          '## 프로젝트 목록',
          '',
          '### Week 1-2: Foundation',
          '- [ ] Foundry 환경 구성',
          '- [ ] 데이터 탐색 프로젝트',
          '',
          '### Week 3-4: Data Engineering',
          '- [ ] 파이프라인 프로젝트',
          '- [ ] PySpark Transform 프로젝트',
          '',
          '### Week 5-6: Application',
          '- [ ] Ontology 설계 문서',
          '- [ ] Workshop 앱',
          '',
          '### Week 7-8: Advanced',
          '- [ ] AIP 프로젝트',
          '- [ ] 종합 프로젝트',
          '',
          '## 각 프로젝트별 포함 항목',
          '- 문제 정의',
          '- 솔루션 설계',
          '- 구현 (스크린샷/코드)',
          '- 결과 및 배운 점'
        ],
        evaluationCriteria: [
          '프로젝트 완성도',
          '문서화 품질',
          '기술적 깊이'
        ]
      }
    },
    {
      id: 'certification-checklist',
      type: 'reading',
      title: '시험 당일 체크리스트',
      duration: 30,
      content: {
        objectives: [
          '시험 준비 상태를 최종 점검한다'
        ],
        markdown: `
## 시험 당일 체크리스트

### 시험 전 준비

**환경 점검:**
- [ ] 안정적인 인터넷 연결
- [ ] 조용한 시험 환경
- [ ] 신분증 준비
- [ ] 시험 링크 확인

**마인드셋:**
- [ ] 충분한 수면
- [ ] 간단한 복습만 (벼락치기 X)
- [ ] 긍정적 마인드

### 시험 중 전략

\`\`\`
시간 배분 (90분, 60문항):
├── 1차 풀이: 60분 (문항당 1분)
├── 표시된 문제 재검토: 20분
└── 최종 확인: 10분

모르는 문제:
1. 일단 표시
2. 다음 문제로
3. 마지막에 재시도
\`\`\`

### 시험 후

- [ ] 결과 확인
- [ ] 약점 영역 파악
- [ ] Professional 준비 계획 (선택)

### 유용한 팁

1. **문제 키워드 파악**
   - "가장 적절한" = 최선의 답
   - "~이 아닌 것" = 오답 찾기
   - "모두 맞는 것" = 복수 정답

2. **소거법 활용**
   - 확실히 틀린 것 제외
   - 남은 것 중 선택

3. **시간 관리**
   - 한 문제에 2분 이상 X
   - 표시하고 넘어가기
        `,
        externalLinks: [
          { title: 'Foundry Best Practices', url: 'https://www.palantir.com/docs/foundry/best-practices/' }
        ]
      }
    },
    {
      id: 'final-project',
      type: 'project',
      title: 'Foundry 스페셜 수료',
      duration: 60,
      content: {
        objectives: [
          '8주 과정을 마무리한다',
          '다음 단계를 계획한다'
        ],
        requirements: [
          '**Foundry 스페셜 과정 수료**',
          '',
          '## 달성 항목',
          '',
          '### 기술 역량',
          '- [ ] Foundry 플랫폼 이해',
          '- [ ] Pipeline Builder 활용',
          '- [ ] PySpark Transform 구현',
          '- [ ] Ontology 설계',
          '- [ ] Workshop 앱 개발',
          '- [ ] AIP 통합',
          '',
          '### 자격증 준비',
          '- [ ] Data Engineer Associate 준비 완료',
          '- [ ] App Developer Associate 준비 완료',
          '',
          '### 포트폴리오',
          '- [ ] 프로젝트 6개+ 완성',
          '- [ ] 문서화 완료',
          '',
          '## 다음 단계',
          '',
          '**단기 (1-2주):**',
          '- 자격증 시험 응시',
          '',
          '**중기 (1-3개월):**',
          '- Professional 자격증 준비',
          '- 실제 프로젝트 경험',
          '',
          '**장기:**',
          '- FDE 포지션 지원',
          '- Specialist 자격증'
        ],
        evaluationCriteria: [
          '과정 완주',
          '자격증 준비도',
          '명확한 다음 계획'
        ]
      }
    }
  ]
}

export const foundryCertificationWeek: Week = {
  slug: 'foundry-certification',
  week: 8,
  phase: 7,
  month: 14,
  access: 'pro',
  title: 'Certification & Final Review',
  topics: ['자격증 트랙', '모의시험', 'Data Engineer', 'App Developer', '포트폴리오'],
  practice: '자격증 취득 & 과정 수료',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
