// Day 2: Object Type 설계 (Palantir 스타일)
// Week 2의 둘째 날 - Palantir Foundry 철학, Object Type 정의, 스키마 설계
import type { Day } from './types'

export const day2ObjectType: Day = {
  slug: 'object-type-design',
  title: 'Object Type 설계 (Palantir 스타일)',
  totalDuration: 240,
  tasks: [
    // ============================================
    // Task 1: Day 2 학습 목표 오버뷰
    // ============================================
    {
      id: 'day2-overview',
      type: 'reading',
      title: 'Day 2 학습 목표',
      duration: 5,
      content: {
        objectives: [
          'Object Type의 개념과 Palantir Foundry 철학을 이해한다',
          '비즈니스 도메인을 그래프 스키마로 모델링한다',
          '속성 vs 관계 결정 기준을 마스터한다',
          '명명 규칙과 설계 베스트 프랙티스를 적용한다'
        ],
        markdown: `
## Day 2: Object Type 설계

### 오늘 배울 내용

Day 1에서 Cypher 고급 쿼리를 배웠다면, 오늘은 **데이터를 어떻게 구조화할 것인가**를 다룹니다.
좋은 쿼리는 좋은 스키마에서 시작됩니다.

| 주제 | 핵심 개념 | 실무 활용 |
|------|----------|----------|
| **Object Type** | 비즈니스 엔티티 정의 | 도메인 모델링 |
| **Palantir 철학** | Ontology 중심 설계 | 엔터프라이즈 데이터 플랫폼 |
| **속성 vs 관계** | 모델링 결정 기준 | 스키마 최적화 |
| **명명 규칙** | PascalCase, SCREAMING_SNAKE | 일관된 코드베이스 |
| **스키마 진화** | 마이그레이션 전략 | 프로덕션 운영 |

### Palantir와 Object Type

> **"Object Type은 단순한 데이터 구조가 아니라, 비즈니스 지식을 담은 설계입니다."**
> — Palantir Foundry 철학

Palantir Foundry에서:
- **Object Type** = 비즈니스 엔티티의 스키마
- **Ontology** = Object Type들의 연결된 네트워크
- 기술 용어보다 **비즈니스 용어**를 사용

### 오늘의 실습 미리보기

1. **E-커머스 도메인 모델링**
   - Customer, Order, Product, Review
   - 속성과 관계 설계

2. **Cypher로 스키마 구현**
   - 제약조건, 인덱스
   - 샘플 데이터 생성

3. **스키마 검증 쿼리**
   - 설계 의도대로 동작하는지 확인

### 학습 순서

1. 📹 Object Type이란? (25분)
2. 📖 속성 vs 관계 결정 가이드 (15분)
3. 📖 그래프 스키마 명명 규칙 (10분)
4. 💻 E-커머스 도메인 설계 실습 (40분)
5. 📹 스키마 진화 전략 (15분)
6. 💻 스키마 마이그레이션 실습 (25분)
7. ✅ Day 2 퀴즈 (15분)
8. 🏆 Day 2 도전 과제 (30분)
        `
      }
    },

    // ============================================
    // Task 2: Object Type 개념 비디오
    // ============================================
    {
      id: 'object-type-concept-video',
      type: 'video',
      title: 'Object Type이란? (Palantir Foundry 철학)',
      duration: 25,
      content: {
        objectives: [
          'Object Type의 개념과 필요성을 이해한다',
          'Palantir Foundry의 온톨로지 접근 방식을 파악한다',
          '잘 설계된 Object Type의 특징을 식별한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=object-type-intro',
        transcript: `
## Object Type 설계

### Object Type이란?

**Object Type**은 비즈니스 개념을 표현하는 스키마입니다.
단순한 데이터 구조가 아니라, **도메인 지식**을 담은 설계입니다.

\`\`\`
┌─────────────────────────────────────┐
│          Object Type: Customer      │
├─────────────────────────────────────┤
│ Properties (속성)                    │
│   - customerId (PK)                 │
│   - name                            │
│   - email                           │
│   - membershipTier                  │
│   - createdAt                       │
├─────────────────────────────────────┤
│ Links (관계)                         │
│   → placed_orders: Order[]          │
│   → assigned_manager: Employee      │
│   → lives_in: City                  │
└─────────────────────────────────────┘
\`\`\`

### Palantir Foundry의 Ontology 철학

> Palantir Foundry에서 **Ontology**는 데이터 플랫폼의 핵심입니다.
> 모든 데이터는 **Object Type**으로 정의되고, **Link**로 연결됩니다.

**핵심 원칙:**

1. **비즈니스 중심 설계**
   - 기술 용어 (table, column) 대신 비즈니스 용어 (Customer, Order)
   - 개발자가 아닌 비즈니스 사용자도 이해 가능

2. **명확한 정체성**
   - 모든 Object는 고유하게 식별 가능한 Primary Key
   - URI 기반 식별자 권장 (예: \`kss:Customer_C001\`)

3. **명시적 관계**
   - 암묵적 Foreign Key 대신 명시적 Link
   - 관계의 의미와 방향성이 명확

### Object Type 정의 템플릿

\`\`\`yaml
# Object Type: 고객 (Customer)
name: Customer
description: 우리 서비스를 이용하는 개인 또는 법인

# Primary Key
primary_key: customerId

# Properties (속성)
properties:
  - name: customerId
    type: string
    description: 고유 식별자 (UUID 또는 비즈니스 코드)
    required: true
    indexed: true

  - name: name
    type: string
    description: 고객 이름 (개인명 또는 법인명)
    required: true

  - name: customerType
    type: enum[individual, corporate]
    description: 개인/법인 구분
    required: true

  - name: email
    type: string
    description: 이메일 주소
    unique: true

  - name: membershipTier
    type: enum[bronze, silver, gold, platinum]
    description: 멤버십 등급
    default: bronze

  - name: lifetimeValue
    type: decimal
    description: 고객 생애 가치 (계산 속성)
    derived: true  # 다른 데이터에서 계산

  - name: createdAt
    type: datetime
    description: 가입일

# Links (관계)
links:
  - name: placed_orders
    target: Order
    cardinality: one-to-many
    description: 고객이 주문한 내역

  - name: assigned_manager
    target: Employee
    cardinality: many-to-one
    description: 담당 매니저

  - name: lives_in
    target: City
    cardinality: many-to-one
    description: 거주 도시
\`\`\`

### 좋은 Object Type의 5가지 특징

| 특징 | 설명 | 예시 |
|------|------|------|
| **명확한 정체성** | 고유하게 식별 가능 | \`customerId\` PK |
| **비즈니스 의미** | 기술 용어 아닌 비즈니스 용어 | \`Customer\` not \`tbl_cust\` |
| **적절한 추상화** | 너무 구체적/추상적이지 않음 | \`Order\` (적절) vs \`Transaction\` (너무 추상) |
| **명시적 관계** | 다른 Object Type과의 연결 명확 | \`Customer → Order\` |
| **진화 가능성** | 새로운 속성 추가에 유연 | Optional 속성 허용 |

### Anti-Pattern: 나쁜 설계 예시

\`\`\`cypher
// ❌ 나쁜 예 1: 모든 것을 하나의 Entity로
(:Entity {
  type: 'customer',
  data: '{"name": "홍길동", ...}'  // JSON blob
})
// 문제: 쿼리 불가, 타입 안전성 없음

// ❌ 나쁜 예 2: 속성 폭발
(:Customer {
  name: '홍길동',
  skill1: 'Python',
  skill2: 'SQL',
  skill3: 'Cypher',
  skill4: null,
  skill5: null
  // ... skill100까지?
})
// 문제: 확장성 없음, NULL 폭발

// ✅ 좋은 예: 명확한 타입과 관계
(:Customer {id: 'C001', name: '홍길동'})
  -[:HAS_SKILL]->(:Skill {name: 'Python'})
  -[:HAS_SKILL]->(:Skill {name: 'SQL'})
\`\`\`

### Cypher로 Object Type 구현

\`\`\`cypher
// 1. 제약조건으로 정체성 보장
CREATE CONSTRAINT customer_id
FOR (c:Customer) REQUIRE c.customerId IS UNIQUE;

// 2. 인덱스로 검색 성능 최적화
CREATE INDEX customer_email
FOR (c:Customer) ON (c.email);

// 3. 노드 생성
CREATE (c:Customer {
  customerId: 'C001',
  name: '홍길동',
  customerType: 'individual',
  email: 'hong@example.com',
  membershipTier: 'gold',
  createdAt: datetime()
})

// 4. 관계 생성
MATCH (c:Customer {customerId: 'C001'})
MATCH (city:City {name: 'Seoul'})
CREATE (c)-[:LIVES_IN {since: date('2020-01-01')}]->(city)
\`\`\`

### 핵심 정리

1. **Object Type = 비즈니스 엔티티의 청사진**
2. **Palantir 철학**: 비즈니스 중심, 명시적 관계, 진화 가능
3. **좋은 설계**: 명확한 정체성, 적절한 추상화, 확장 가능
4. **Cypher 구현**: 제약조건 + 인덱스 + 명확한 라벨
        `
      }
    },

    // ============================================
    // Task 3: 속성 vs 관계 결정 가이드
    // ============================================
    {
      id: 'property-vs-relationship',
      type: 'reading',
      title: '속성 vs 관계 결정 가이드',
      duration: 15,
      content: {
        objectives: [
          '속성으로 모델링할 때와 관계로 모델링할 때를 구분한다',
          '결정 기준을 체계적으로 적용한다',
          '실제 사례를 통해 판단력을 기른다'
        ],
        markdown: `
## 속성 vs 관계: 결정 가이드

그래프 모델링에서 가장 중요한 결정 중 하나는 **"이것을 속성으로 할까, 관계로 할까?"**입니다.

### 결정 플로우차트

\`\`\`
                    ┌──────────────────┐
                    │ 이 값이 독립적인 │
                    │ 엔티티인가?      │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
         [예: 엔티티]                   [아니오: 값]
              │                             │
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ 이 값에 추가     │           │ 이 값으로 자주   │
    │ 속성이 있는가?   │           │ 검색하는가?      │
    └────────┬────────┘           └────────┬────────┘
             │                             │
     ┌───────┴───────┐             ┌───────┴───────┐
     ▼               ▼             ▼               ▼
   [예]            [아니오]      [예]            [아니오]
     │               │             │               │
     ▼               ▼             ▼               ▼
  ┌─────┐        ┌─────────┐   ┌─────────┐     ┌─────┐
  │관계 │        │경우에    │   │관계로   │     │속성 │
  │필수 │        │따라 판단 │   │모델링   │     │으로 │
  └─────┘        └─────────┘   │가능     │     └─────┘
                               └─────────┘
\`\`\`

### 속성으로 모델링하는 경우

**조건:**
- 값이 단순한 스칼라 (문자열, 숫자, 날짜, boolean)
- 해당 값에 대한 **추가 정보가 없음**
- 값으로 직접 조회하는 경우가 **적음**
- 값의 **종류가 제한적**이지 않음 (enum이 아닌 경우)

\`\`\`cypher
// ✅ 속성으로 적합한 경우
(:Person {
  name: '홍길동',        // 단순 문자열
  age: 30,              // 단순 숫자
  email: 'hong@ex.com', // 단순 문자열
  isActive: true,       // boolean
  createdAt: datetime() // 날짜
})
\`\`\`

### 관계로 모델링하는 경우

**조건:**
- 값 자체가 **독립적인 엔티티**
- 값에 대한 **추가 속성**이 있거나 있을 수 있음
- 값으로 **자주 조회**하거나 **그룹핑**
- **여러 노드가 공유**할 수 있는 값

\`\`\`cypher
// ✅ 관계로 적합한 경우

// 도시 (여러 사람이 같은 도시에 살 수 있음)
(:Person)-[:LIVES_IN {since: 2020}]->(:City {name: '서울', population: 10000000})

// 스킬 (추가 속성: 숙련도)
(:Person)-[:HAS_SKILL {level: 'expert', since: 2018}]->(:Skill {name: 'Python'})

// 카테고리 (계층 구조 가능)
(:Product)-[:BELONGS_TO]->(:Category {name: 'Electronics'})-[:SUBCATEGORY_OF]->(:Category {name: 'Consumer Goods'})
\`\`\`

### 실제 사례 분석

#### 사례 1: 사람의 국적

\`\`\`cypher
// 옵션 A: 속성
(:Person {name: '홍길동', nationality: 'Korean'})

// 옵션 B: 관계
(:Person {name: '홍길동'})-[:CITIZEN_OF]->(:Country {name: 'Korea', code: 'KR'})
\`\`\`

**결정 기준:**
- 국가에 대한 추가 정보(인구, GDP, 지역)가 필요한가? → 관계
- 국가로 그룹핑해서 통계를 내는가? → 관계
- 단순히 표시만 하는가? → 속성도 가능

**권장**: 대부분의 경우 **관계**가 더 유연

#### 사례 2: 주문의 상태

\`\`\`cypher
// 옵션 A: 속성 (권장)
(:Order {
  orderId: 'ORD-001',
  status: 'shipped',  // pending, confirmed, shipped, delivered, cancelled
  statusUpdatedAt: datetime()
})

// 옵션 B: 관계 (과도할 수 있음)
(:Order)-[:HAS_STATUS]->(:OrderStatus {name: 'shipped'})
\`\`\`

**결정 기준:**
- 상태 값이 고정된 enum인가? → 속성
- 상태별 추가 정보가 필요한가? → 관계
- 상태 이력을 추적해야 하는가? → 상태 이력 노드 별도 생성

**권장**: 단순 상태는 **속성**, 이력 추적이 필요하면 **이력 노드**

#### 사례 3: 상품의 가격

\`\`\`cypher
// 옵션 A: 속성 (현재 가격만)
(:Product {name: 'iPhone', price: 1200000})

// 옵션 B: 관계 (가격 이력)
(:Product)-[:HAS_PRICE {validFrom: date('2024-01-01'), validTo: date('2024-06-30')}]->
  (:Price {amount: 1200000, currency: 'KRW'})
\`\`\`

**결정 기준:**
- 가격 이력을 추적해야 하는가? → 관계
- 통화 변환이 필요한가? → 관계
- 현재 가격만 필요한가? → 속성

### 관계 속성 활용

관계 자체에도 속성을 넣을 수 있습니다.

\`\`\`cypher
// 관계 속성 예시
(:Person)-[:WORKS_AT {
  since: date('2020-01-15'),
  role: 'Engineer',
  department: 'Engineering',
  isActive: true
}]->(:Company)

// 복잡한 관계 데이터는 중간 노드로
(:Person)-[:HAS_EMPLOYMENT]->(e:Employment {
  startDate: date('2020-01-15'),
  endDate: null,
  salary: 80000000,
  benefits: ['health', 'dental', '401k']
})-[:AT_COMPANY]->(:Company)
\`\`\`

### 결정 체크리스트

| 질문 | 예 → 관계 | 아니오 → 속성 |
|------|----------|--------------|
| 이 값이 독립적 엔티티인가? | ✓ | |
| 이 값에 추가 속성이 있는가? | ✓ | |
| 여러 노드가 이 값을 공유하는가? | ✓ | |
| 이 값으로 자주 그룹핑/검색하는가? | ✓ | |
| 이 값이 계층 구조를 가지는가? | ✓ | |

### 핵심 정리

1. **속성**: 단순 값, 추가 정보 없음, 검색 빈도 낮음
2. **관계**: 독립 엔티티, 추가 속성 있음, 공유/그룹핑 필요
3. **관계 속성**: 관계 자체의 메타데이터 (시작일, 역할 등)
4. **원칙**: 확실하지 않으면 **관계**로 - 나중에 속성으로 바꾸기 어려움
        `
      }
    },

    // ============================================
    // Task 4: 명명 규칙
    // ============================================
    {
      id: 'naming-conventions',
      type: 'reading',
      title: '그래프 스키마 명명 규칙',
      duration: 10,
      content: {
        objectives: [
          '노드 라벨, 관계 타입, 속성의 명명 규칙을 이해한다',
          '일관된 명명으로 가독성을 높인다',
          'Neo4j 커뮤니티 표준을 따른다'
        ],
        markdown: `
## 그래프 스키마 명명 규칙

일관된 명명 규칙은 코드 가독성과 유지보수성을 크게 높입니다.

### Neo4j 커뮤니티 표준

| 요소 | 규칙 | 예시 | 안티패턴 |
|------|------|------|----------|
| **노드 라벨** | PascalCase, 단수형 | \`Person\`, \`Company\` | \`person\`, \`PERSON\`, \`People\` |
| **관계 타입** | SCREAMING_SNAKE_CASE | \`WORKS_AT\`, \`PURCHASED\` | \`worksAt\`, \`Works_At\` |
| **속성** | camelCase | \`firstName\`, \`createdAt\` | \`first_name\`, \`FirstName\` |

### 노드 라벨 규칙

\`\`\`cypher
// ✅ 좋은 예: PascalCase, 단수형
(:Person), (:Company), (:Product), (:OrderItem)

// ❌ 나쁜 예
(:person)       // 소문자
(:PERSON)       // 전체 대문자
(:People)       // 복수형
(:order_item)   // snake_case
\`\`\`

**다중 라벨:**
\`\`\`cypher
// 다중 라벨로 분류 세분화
(:Person:Employee {name: '홍길동'})
(:Person:Customer {name: '김철수'})
(:Company:Startup {name: 'TechCo'})
(:Company:Enterprise {name: 'MegaCorp'})
\`\`\`

### 관계 타입 규칙

\`\`\`cypher
// ✅ 좋은 예: SCREAMING_SNAKE_CASE, 동사 + 전치사
(:Person)-[:WORKS_AT]->(:Company)
(:Person)-[:KNOWS]->(:Person)
(:Customer)-[:PURCHASED]->(:Product)
(:Employee)-[:REPORTS_TO]->(:Manager)
(:Product)-[:BELONGS_TO]->(:Category)

// ❌ 나쁜 예
(:Person)-[:worksAt]->(:Company)      // camelCase
(:Person)-[:Works_At]->(:Company)     // Mixed case
(:Person)-[:WORKS]->(:Company)        // 불명확한 의미
\`\`\`

**관계 명명 가이드:**

| 패턴 | 용도 | 예시 |
|------|------|------|
| \`동사\` | 단순 행위 | \`KNOWS\`, \`LIKES\`, \`FOLLOWS\` |
| \`동사_전치사\` | 방향성 있는 관계 | \`WORKS_AT\`, \`LIVES_IN\`, \`REPORTS_TO\` |
| \`HAS_명사\` | 소유 관계 | \`HAS_SKILL\`, \`HAS_ADDRESS\` |
| \`IS_명사\` | 상태/역할 | \`IS_MEMBER_OF\`, \`IS_AUTHOR_OF\` |

### 속성 명명 규칙

\`\`\`cypher
// ✅ 좋은 예: camelCase
{
  firstName: '길동',
  lastName: '홍',
  emailAddress: 'hong@example.com',
  dateOfBirth: date('1990-01-15'),
  isActive: true,
  createdAt: datetime(),
  updatedAt: datetime()
}

// ❌ 나쁜 예
{
  first_name: '길동',    // snake_case
  FirstName: '길동',     // PascalCase
  FIRST_NAME: '길동',    // SCREAMING
  firstname: '길동'      // 구분 없음
}
\`\`\`

**속성 명명 패턴:**

| 타입 | 접두/접미사 | 예시 |
|------|------------|------|
| Boolean | \`is\`, \`has\`, \`can\` | \`isActive\`, \`hasDiscount\`, \`canEdit\` |
| 날짜 | \`At\`, \`Date\`, \`On\` | \`createdAt\`, \`birthDate\`, \`validOn\` |
| 수량 | \`Count\`, \`Total\`, \`Num\` | \`orderCount\`, \`totalAmount\` |
| ID | \`Id\`, \`Code\` | \`customerId\`, \`productCode\` |

### 실전 예시: E-커머스 스키마

\`\`\`cypher
// 완전한 명명 규칙 적용 예시

// 노드 라벨: PascalCase, 단수형
(:Customer {
  // 속성: camelCase
  customerId: 'C001',
  fullName: '홍길동',
  emailAddress: 'hong@example.com',
  membershipTier: 'gold',
  isActive: true,
  createdAt: datetime(),
  lastLoginAt: datetime()
})

// 관계 타입: SCREAMING_SNAKE_CASE
-[:PURCHASED {
  purchaseDate: date('2024-01-15'),
  quantity: 2,
  totalPrice: 50000
}]->

(:Product {
  productId: 'P001',
  productName: 'Basic T-Shirt',
  unitPrice: 25000,
  stockCount: 100,
  isAvailable: true
})

-[:BELONGS_TO]->

(:Category {
  categoryId: 'CAT001',
  categoryName: 'Clothing',
  displayOrder: 1
})
\`\`\`

### 일관성 유지 팁

1. **프로젝트 시작 시 규칙 문서화**
2. **코드 리뷰에서 명명 규칙 확인**
3. **자동화된 린터 도구 사용** (가능한 경우)
4. **예외는 최소화하고 문서화**

### 핵심 정리

| 요소 | 규칙 | 이유 |
|------|------|------|
| 노드 라벨 | PascalCase, 단수 | 클래스명처럼 취급 |
| 관계 타입 | SCREAMING_SNAKE | 상수처럼 취급, 눈에 잘 띔 |
| 속성 | camelCase | 변수명처럼 취급 |
        `
      }
    },

    // ============================================
    // Task 5: E-커머스 도메인 설계 실습
    // ============================================
    {
      id: 'ecommerce-design-practice',
      type: 'code',
      title: 'E-커머스 도메인 설계 실습',
      duration: 40,
      content: {
        objectives: [
          '실제 비즈니스 도메인을 그래프로 모델링한다',
          'Object Type 정의서를 작성한다',
          'Cypher로 스키마를 구현하고 검증한다'
        ],
        instructions: `
## 실습: E-커머스 도메인 설계

### 시나리오

온라인 쇼핑몰의 핵심 도메인을 그래프로 모델링합니다.

**비즈니스 요구사항:**
- 고객이 상품을 주문할 수 있다
- 상품은 카테고리에 속한다
- 고객은 상품에 리뷰를 작성할 수 있다
- 고객은 상품을 위시리스트에 추가할 수 있다
- 배송 정보를 추적해야 한다

### 과제 1: Object Type 정의 (30점)

다음 Object Type을 정의하세요:
- **Customer**: 고객 정보
- **Product**: 상품 정보
- **Category**: 상품 카테고리
- **Order**: 주문
- **Review**: 상품 리뷰

각 Object Type에 대해:
- 필수 속성 (최소 3개)
- 선택 속성 (최소 2개)
- 관계 (다른 Object Type과의 연결)

---

### 과제 2: Cypher 스키마 구현 (40점)

1. **제약조건 생성** (10점)
   - 각 Object Type의 Primary Key에 UNIQUE 제약조건

2. **인덱스 생성** (10점)
   - 자주 검색되는 속성에 인덱스

3. **샘플 데이터 생성** (20점)
   - 고객 3명
   - 상품 5개 (2개 카테고리)
   - 주문 4건
   - 리뷰 3개

---

### 과제 3: 스키마 검증 쿼리 (30점)

설계가 제대로 되었는지 확인하는 쿼리 작성:

1. 특정 카테고리의 모든 상품과 평균 평점
2. 특정 고객의 주문 이력과 총 구매액
3. 평점 4점 이상의 상품과 리뷰어 목록
        `,
        starterCode: `// ========================================
// 과제 1: Object Type 정의 (주석으로 작성)
// ========================================

/*
Object Type: Customer
Description: 쇼핑몰 고객
Primary Key: customerId

Properties:
  - customerId (string, required, unique): 고객 고유 ID
  - name (string, required): 고객 이름
  - email (string, required, unique): 이메일
  - ... (추가 속성 정의)

Links:
  - PLACED -> Order (one-to-many)
  - ... (추가 관계 정의)
*/

// 나머지 Object Type 정의...
// Product, Category, Order, Review


// ========================================
// 과제 2: Cypher 스키마 구현
// ========================================

// 1. 제약조건 생성
// CREATE CONSTRAINT customer_id FOR (c:Customer) REQUIRE c.customerId IS UNIQUE;
// ... 추가 제약조건

// 2. 인덱스 생성
// CREATE INDEX product_name FOR (p:Product) ON (p.name);
// ... 추가 인덱스

// 3. 샘플 데이터 생성
// 카테고리
// CREATE (electronics:Category {...})
// CREATE (clothing:Category {...})

// 상품
// CREATE (laptop:Product {...})-[:BELONGS_TO]->(electronics)
// ...

// 고객
// CREATE (alice:Customer {...})
// ...

// 주문 및 리뷰
// ...


// ========================================
// 과제 3: 스키마 검증 쿼리
// ========================================

// 쿼리 1: 카테고리별 상품과 평균 평점
// MATCH ...

// 쿼리 2: 고객별 주문 이력과 총 구매액
// MATCH ...

// 쿼리 3: 평점 4점 이상 상품과 리뷰어
// MATCH ...
`,
        solutionCode: `// ========================================
// 과제 1: Object Type 정의
// ========================================

/*
Object Type: Customer
Description: 쇼핑몰 고객
Primary Key: customerId

Properties:
  - customerId (string, required, unique): 고객 고유 ID
  - name (string, required): 고객 이름
  - email (string, required, unique): 이메일
  - phone (string, optional): 전화번호
  - membershipTier (enum, optional): bronze/silver/gold
  - createdAt (datetime, required): 가입일

Links:
  - PLACED -> Order (one-to-many): 주문 내역
  - REVIEWED -> Product (one-to-many): 리뷰 작성
  - WISHLISTED -> Product (one-to-many): 위시리스트
*/

/*
Object Type: Product
Primary Key: productId

Properties:
  - productId (string, required, unique)
  - name (string, required, indexed)
  - price (integer, required)
  - description (string, optional)
  - stockCount (integer, required, default: 0)
  - isAvailable (boolean, required, default: true)

Links:
  - BELONGS_TO -> Category (many-to-one)
*/

/*
Object Type: Category
Primary Key: categoryId

Properties:
  - categoryId (string, required, unique)
  - name (string, required, unique)
  - description (string, optional)

Links:
  - SUBCATEGORY_OF -> Category (many-to-one, optional)
*/

/*
Object Type: Order
Primary Key: orderId

Properties:
  - orderId (string, required, unique)
  - orderDate (datetime, required)
  - status (enum, required): pending/confirmed/shipped/delivered
  - totalAmount (integer, required)
  - shippingAddress (string, required)

Links:
  - PLACED_BY -> Customer (many-to-one)
  - CONTAINS -> Product (many-to-many, with quantity)
*/

/*
Object Type: Review
Primary Key: reviewId

Properties:
  - reviewId (string, required, unique)
  - rating (integer, required): 1-5
  - comment (string, optional)
  - createdAt (datetime, required)

Links:
  - WRITTEN_BY -> Customer (many-to-one)
  - FOR_PRODUCT -> Product (many-to-one)
*/


// ========================================
// 과제 2: Cypher 스키마 구현
// ========================================

// 1. 제약조건 생성
CREATE CONSTRAINT customer_id FOR (c:Customer) REQUIRE c.customerId IS UNIQUE;
CREATE CONSTRAINT product_id FOR (p:Product) REQUIRE p.productId IS UNIQUE;
CREATE CONSTRAINT category_id FOR (cat:Category) REQUIRE cat.categoryId IS UNIQUE;
CREATE CONSTRAINT order_id FOR (o:Order) REQUIRE o.orderId IS UNIQUE;
CREATE CONSTRAINT review_id FOR (r:Review) REQUIRE r.reviewId IS UNIQUE;
CREATE CONSTRAINT customer_email FOR (c:Customer) REQUIRE c.email IS UNIQUE;

// 2. 인덱스 생성
CREATE INDEX product_name FOR (p:Product) ON (p.name);
CREATE INDEX customer_name FOR (c:Customer) ON (c.name);
CREATE INDEX order_status FOR (o:Order) ON (o.status);
CREATE INDEX review_rating FOR (r:Review) ON (r.rating);

// 3. 샘플 데이터 생성

// 카테고리
CREATE (electronics:Category {
  categoryId: 'CAT001',
  name: 'Electronics',
  description: '전자제품'
})
CREATE (clothing:Category {
  categoryId: 'CAT002',
  name: 'Clothing',
  description: '의류'
})

// 상품
CREATE (laptop:Product {
  productId: 'P001',
  name: 'MacBook Pro 14',
  price: 2500000,
  description: 'Apple M3 Pro 칩셋',
  stockCount: 50,
  isAvailable: true
})
CREATE (phone:Product {
  productId: 'P002',
  name: 'iPhone 15 Pro',
  price: 1500000,
  description: 'A17 Pro 칩셋',
  stockCount: 100,
  isAvailable: true
})
CREATE (headphones:Product {
  productId: 'P003',
  name: 'AirPods Pro',
  price: 350000,
  stockCount: 200,
  isAvailable: true
})
CREATE (shirt:Product {
  productId: 'P004',
  name: 'Premium Cotton Shirt',
  price: 80000,
  stockCount: 300,
  isAvailable: true
})
CREATE (jeans:Product {
  productId: 'P005',
  name: 'Slim Fit Jeans',
  price: 120000,
  stockCount: 150,
  isAvailable: true
})

// 카테고리 연결
CREATE (laptop)-[:BELONGS_TO]->(electronics)
CREATE (phone)-[:BELONGS_TO]->(electronics)
CREATE (headphones)-[:BELONGS_TO]->(electronics)
CREATE (shirt)-[:BELONGS_TO]->(clothing)
CREATE (jeans)-[:BELONGS_TO]->(clothing)

// 고객
CREATE (alice:Customer {
  customerId: 'C001',
  name: 'Alice Kim',
  email: 'alice@example.com',
  phone: '010-1234-5678',
  membershipTier: 'gold',
  createdAt: datetime('2023-01-15T10:00:00')
})
CREATE (bob:Customer {
  customerId: 'C002',
  name: 'Bob Lee',
  email: 'bob@example.com',
  membershipTier: 'silver',
  createdAt: datetime('2023-06-20T14:30:00')
})
CREATE (charlie:Customer {
  customerId: 'C003',
  name: 'Charlie Park',
  email: 'charlie@example.com',
  membershipTier: 'bronze',
  createdAt: datetime('2024-01-05T09:15:00')
})

// 주문
CREATE (order1:Order {
  orderId: 'ORD001',
  orderDate: datetime('2024-01-10T11:00:00'),
  status: 'delivered',
  totalAmount: 2850000,
  shippingAddress: '서울시 강남구'
})
CREATE (order2:Order {
  orderId: 'ORD002',
  orderDate: datetime('2024-01-15T14:00:00'),
  status: 'shipped',
  totalAmount: 1500000,
  shippingAddress: '서울시 서초구'
})
CREATE (order3:Order {
  orderId: 'ORD003',
  orderDate: datetime('2024-01-20T10:30:00'),
  status: 'pending',
  totalAmount: 200000,
  shippingAddress: '부산시 해운대구'
})
CREATE (order4:Order {
  orderId: 'ORD004',
  orderDate: datetime('2024-01-25T16:00:00'),
  status: 'confirmed',
  totalAmount: 2500000,
  shippingAddress: '대전시 유성구'
})

// 주문-고객 연결
CREATE (alice)-[:PLACED]->(order1)
CREATE (alice)-[:PLACED]->(order2)
CREATE (bob)-[:PLACED]->(order3)
CREATE (charlie)-[:PLACED]->(order4)

// 주문-상품 연결 (관계 속성으로 수량 표시)
CREATE (order1)-[:CONTAINS {quantity: 1}]->(laptop)
CREATE (order1)-[:CONTAINS {quantity: 1}]->(headphones)
CREATE (order2)-[:CONTAINS {quantity: 1}]->(phone)
CREATE (order3)-[:CONTAINS {quantity: 2}]->(shirt)
CREATE (order3)-[:CONTAINS {quantity: 1}]->(jeans)
CREATE (order4)-[:CONTAINS {quantity: 1}]->(laptop)

// 리뷰
CREATE (review1:Review {
  reviewId: 'R001',
  rating: 5,
  comment: '최고의 노트북입니다! 성능이 뛰어나요.',
  createdAt: datetime('2024-01-20T10:00:00')
})
CREATE (review2:Review {
  reviewId: 'R002',
  rating: 4,
  comment: '좋은 제품이지만 가격이 조금 비싸요.',
  createdAt: datetime('2024-01-22T15:30:00')
})
CREATE (review3:Review {
  reviewId: 'R003',
  rating: 5,
  comment: '음질이 정말 좋아요. 노이즈캔슬링 최고!',
  createdAt: datetime('2024-01-25T09:00:00')
})

// 리뷰 연결
CREATE (alice)-[:WROTE]->(review1)
CREATE (review1)-[:FOR_PRODUCT]->(laptop)
CREATE (bob)-[:WROTE]->(review2)
CREATE (review2)-[:FOR_PRODUCT]->(phone)
CREATE (alice)-[:WROTE]->(review3)
CREATE (review3)-[:FOR_PRODUCT]->(headphones)

// 위시리스트
CREATE (bob)-[:WISHLISTED]->(laptop)
CREATE (charlie)-[:WISHLISTED]->(phone)
CREATE (charlie)-[:WISHLISTED]->(headphones);


// ========================================
// 과제 3: 스키마 검증 쿼리
// ========================================

// 쿼리 1: 카테고리별 상품과 평균 평점
MATCH (cat:Category)<-[:BELONGS_TO]-(p:Product)
OPTIONAL MATCH (p)<-[:FOR_PRODUCT]-(r:Review)
WITH cat.name as category, p, avg(r.rating) as avgRating
RETURN category,
  collect({
    product: p.name,
    price: p.price,
    avgRating: coalesce(avgRating, 0)
  }) as products,
  round(avg(avgRating), 1) as categoryAvgRating
ORDER BY category

// 쿼리 2: 고객별 주문 이력과 총 구매액
MATCH (c:Customer)-[:PLACED]->(o:Order)
WITH c, o
ORDER BY o.orderDate DESC
WITH c,
  collect({
    orderId: o.orderId,
    date: o.orderDate,
    amount: o.totalAmount,
    status: o.status
  }) as orders,
  sum(o.totalAmount) as totalSpent,
  count(o) as orderCount
RETURN
  c.name as customer,
  c.membershipTier as tier,
  totalSpent,
  orderCount,
  orders
ORDER BY totalSpent DESC

// 쿼리 3: 평점 4점 이상 상품과 리뷰어
MATCH (r:Review)-[:FOR_PRODUCT]->(p:Product)
WHERE r.rating >= 4
MATCH (c:Customer)-[:WROTE]->(r)
WITH p, collect({
  reviewer: c.name,
  rating: r.rating,
  comment: r.comment
}) as reviews,
avg(r.rating) as avgRating
WHERE avgRating >= 4
RETURN
  p.name as product,
  p.price as price,
  avgRating,
  size(reviews) as reviewCount,
  reviews
ORDER BY avgRating DESC
`,
        hints: [
          'Object Type 정의 시 각 속성의 타입과 제약조건을 명확히 하세요',
          'UNIQUE 제약조건은 자동으로 인덱스를 생성합니다',
          '관계 속성(예: quantity)은 -[:CONTAINS {quantity: 1}]-> 형식으로',
          'OPTIONAL MATCH는 리뷰가 없는 상품도 결과에 포함시킵니다'
        ]
      }
    },

    // ============================================
    // Task 6: 스키마 진화 전략 비디오
    // ============================================
    {
      id: 'schema-evolution-video',
      type: 'video',
      title: '스키마 진화 전략',
      duration: 15,
      content: {
        objectives: [
          '스키마 변경의 종류와 영향을 이해한다',
          '안전한 마이그레이션 전략을 학습한다',
          '버전 관리 및 롤백 방법을 파악한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=schema-evolution',
        transcript: `
## 스키마 진화 전략

### 왜 스키마 진화가 중요한가?

프로덕션 환경에서 스키마는 항상 변화합니다:
- 새로운 비즈니스 요구사항
- 성능 최적화 필요
- 데이터 품질 개선
- 기술 부채 해소

**핵심 원칙**: 서비스 중단 없이, 데이터 손실 없이 변경

### 스키마 변경의 종류

| 변경 유형 | 난이도 | 예시 |
|----------|--------|------|
| 속성 추가 | ⭐ 쉬움 | 새 필드 추가 |
| 선택 속성을 필수로 | ⭐⭐ 중간 | NULL 처리 필요 |
| 라벨 추가 | ⭐ 쉬움 | 다중 라벨 |
| 라벨 이름 변경 | ⭐⭐⭐ 어려움 | 모든 쿼리 수정 필요 |
| 관계 타입 변경 | ⭐⭐⭐ 어려움 | 마이그레이션 스크립트 |
| 관계 방향 변경 | ⭐⭐⭐⭐ 매우 어려움 | 데이터 재구성 |

### 안전한 변경: 속성 추가

\`\`\`cypher
// ✅ 가장 안전한 변경
// 기존 노드에 영향 없이 새 속성 추가

// 1. 새 노드에는 속성 포함
CREATE (c:Customer {
  customerId: 'C999',
  name: '새 고객',
  email: 'new@example.com',
  phoneNumber: '010-0000-0000'  // 새 속성
})

// 2. 기존 노드에 속성 추가 (필요시)
MATCH (c:Customer)
WHERE c.phoneNumber IS NULL
SET c.phoneNumber = 'unknown'
\`\`\`

### 라벨 추가로 분류 세분화

\`\`\`cypher
// 기존 고객 중 기업 고객에게 라벨 추가
MATCH (c:Customer)
WHERE c.customerType = 'corporate'
SET c:CorporateCustomer

// 기존 고객 중 개인 고객에게 라벨 추가
MATCH (c:Customer)
WHERE c.customerType = 'individual'
SET c:IndividualCustomer

// 이제 타입별로 쿼리 가능
MATCH (c:CorporateCustomer)
RETURN c.name
\`\`\`

### 관계 타입 변경 (마이그레이션 필요)

\`\`\`cypher
// 시나리오: FRIEND → KNOWS 로 변경

// 1. 새 관계 생성 (데이터 복사)
MATCH (a)-[old:FRIEND]->(b)
CREATE (a)-[new:KNOWS {
  since: old.since,
  strength: old.strength
}]->(b)

// 2. 검증: 데이터 일치 확인
MATCH (a)-[:FRIEND]->(b)
WITH count(*) as friendCount
MATCH (a)-[:KNOWS]->(b)
WITH friendCount, count(*) as knowsCount
RETURN friendCount = knowsCount as migrationValid

// 3. 기존 관계 삭제 (검증 후에만!)
MATCH ()-[old:FRIEND]->()
DELETE old
\`\`\`

### 마이그레이션 안전 체크리스트

\`\`\`
□ 1. 백업 생성
□ 2. 스테이징 환경에서 테스트
□ 3. 마이그레이션 스크립트 작성
□ 4. 검증 쿼리 준비
□ 5. 롤백 스크립트 준비
□ 6. 서비스 영향도 분석
□ 7. 마이그레이션 실행
□ 8. 검증 쿼리 실행
□ 9. 애플리케이션 쿼리 업데이트
□ 10. 기존 스키마 정리 (optional)
\`\`\`

### 버전 관리

\`\`\`cypher
// 스키마 버전 노드로 관리
CREATE (v:SchemaVersion {
  version: '2.0.0',
  description: 'Customer에 phoneNumber 속성 추가',
  appliedAt: datetime(),
  appliedBy: 'admin'
})

// 버전 이력 조회
MATCH (v:SchemaVersion)
RETURN v.version, v.description, v.appliedAt
ORDER BY v.appliedAt DESC
\`\`\`

### 대용량 마이그레이션

\`\`\`cypher
// ❌ 위험: 대용량 데이터 한 번에 처리
MATCH (c:Customer)
SET c.newField = 'default'  // 수백만 개면 메모리 폭발

// ✅ 안전: 배치 처리 (APOC 사용)
CALL apoc.periodic.iterate(
  'MATCH (c:Customer) WHERE c.newField IS NULL RETURN c',
  'SET c.newField = "default"',
  {batchSize: 1000, parallel: false}
)
YIELD batches, total
RETURN batches, total
\`\`\`

### 핵심 정리

1. **속성 추가**: 가장 안전, 즉시 가능
2. **라벨 추가**: 안전, 기존 쿼리 영향 없음
3. **관계/라벨 변경**: 마이그레이션 필요, 충분한 테스트 필수
4. **대용량**: 배치 처리로 메모리 관리
5. **버전 관리**: 스키마 변경 이력 기록
        `
      }
    },

    // ============================================
    // Task 7: 스키마 마이그레이션 실습
    // ============================================
    {
      id: 'schema-migration-practice',
      type: 'code',
      title: '스키마 마이그레이션 실습',
      duration: 25,
      content: {
        objectives: [
          '실제 스키마 변경 시나리오를 경험한다',
          '마이그레이션 스크립트를 작성한다',
          '검증 쿼리로 마이그레이션을 확인한다'
        ],
        instructions: `
## 실습: 스키마 마이그레이션

### 시나리오

E-커머스 플랫폼의 스키마를 업그레이드해야 합니다.

**변경 요구사항:**
1. Customer에 \`phoneNumber\` 속성 추가
2. Product에 \`discount\` 속성 추가
3. Order의 \`status\` 속성을 별도 노드로 분리 (상태 이력 추적)
4. \`PURCHASED\` 관계를 \`ORDERED\` + \`CONTAINS\` 구조로 변경

---

### 과제 1: 속성 추가 마이그레이션 (20점)

Customer와 Product에 새 속성을 추가하세요.
- 기존 노드에 기본값 설정
- 새 노드에는 속성 필수로 적용

---

### 과제 2: 상태 노드 분리 (40점)

Order의 status를 별도 OrderStatus 노드로 분리하고,
상태 변경 이력을 추적할 수 있도록 구조를 변경하세요.

\`\`\`
Before: (Order {status: 'shipped'})
After:  (Order)-[:HAS_STATUS {changedAt: ...}]->(OrderStatus {name: 'shipped'})
\`\`\`

---

### 과제 3: 검증 쿼리 작성 (20점)

마이그레이션이 제대로 되었는지 확인하는 쿼리를 작성하세요.
- 모든 Order가 상태를 가지고 있는지
- 기존 데이터가 손실되지 않았는지

---

### 과제 4: 롤백 스크립트 (20점)

문제가 발생했을 때 원래 상태로 돌아갈 수 있는 롤백 스크립트를 작성하세요.
        `,
        starterCode: `// ========================================
// 과제 1: 속성 추가 마이그레이션
// ========================================

// 1-1. Customer에 phoneNumber 추가
// 기존 고객에 기본값 설정
// MATCH (c:Customer)
// WHERE c.phoneNumber IS NULL
// SET ...

// 1-2. Product에 discount 추가
// 기존 상품은 할인율 0으로 설정
// MATCH (p:Product)
// ...


// ========================================
// 과제 2: 상태 노드 분리
// ========================================

// 2-1. OrderStatus 노드 생성 (고유 상태값별)
// CREATE (pending:OrderStatus {name: 'pending', description: '주문 대기'})
// ...

// 2-2. 기존 Order의 status를 OrderStatus 관계로 마이그레이션
// MATCH (o:Order)
// WHERE o.status IS NOT NULL
// ...

// 2-3. 기존 status 속성 제거 (검증 후)
// ...


// ========================================
// 과제 3: 검증 쿼리
// ========================================

// 3-1. 모든 Order가 상태를 가지고 있는지 확인
// MATCH (o:Order)
// OPTIONAL MATCH (o)-[:HAS_STATUS]->(s:OrderStatus)
// RETURN ...

// 3-2. 마이그레이션 전후 데이터 수 비교
// ...


// ========================================
// 과제 4: 롤백 스크립트
// ========================================

// 4-1. OrderStatus 관계를 다시 속성으로
// MATCH (o:Order)-[r:HAS_STATUS]->(s:OrderStatus)
// SET o.status = s.name
// DELETE r

// 4-2. OrderStatus 노드 삭제
// ...
`,
        solutionCode: `// ========================================
// 과제 1: 속성 추가 마이그레이션
// ========================================

// 1-1. Customer에 phoneNumber 추가
MATCH (c:Customer)
WHERE c.phoneNumber IS NULL
SET c.phoneNumber = 'not-provided'
RETURN count(c) as updatedCustomers;

// 1-2. Product에 discount 추가 (기본값 0)
MATCH (p:Product)
WHERE p.discount IS NULL
SET p.discount = 0,
    p.originalPrice = p.price  // 원가 보존
RETURN count(p) as updatedProducts;


// ========================================
// 과제 2: 상태 노드 분리
// ========================================

// 2-1. OrderStatus 노드 생성 (고유 상태값별)
CREATE (pending:OrderStatus {
  name: 'pending',
  description: '주문 대기',
  displayOrder: 1
})
CREATE (confirmed:OrderStatus {
  name: 'confirmed',
  description: '주문 확인',
  displayOrder: 2
})
CREATE (shipped:OrderStatus {
  name: 'shipped',
  description: '배송 중',
  displayOrder: 3
})
CREATE (delivered:OrderStatus {
  name: 'delivered',
  description: '배송 완료',
  displayOrder: 4
})
CREATE (cancelled:OrderStatus {
  name: 'cancelled',
  description: '주문 취소',
  displayOrder: 99
});

// 2-2. 기존 Order의 status를 OrderStatus 관계로 마이그레이션
MATCH (o:Order)
WHERE o.status IS NOT NULL
MATCH (s:OrderStatus {name: o.status})
CREATE (o)-[:HAS_STATUS {
  changedAt: coalesce(o.statusUpdatedAt, o.orderDate),
  changedBy: 'migration-script',
  note: 'Migrated from status property'
}]->(s)
RETURN count(*) as migratedOrders;

// 2-3. 검증 후 기존 status 속성 제거
// (검증 완료 후에만 실행!)
MATCH (o:Order)
WHERE (o)-[:HAS_STATUS]->()
REMOVE o.status, o.statusUpdatedAt
RETURN count(o) as cleanedOrders;


// ========================================
// 과제 3: 검증 쿼리
// ========================================

// 3-1. 모든 Order가 상태를 가지고 있는지 확인
MATCH (o:Order)
OPTIONAL MATCH (o)-[:HAS_STATUS]->(s:OrderStatus)
WITH o, s
RETURN
  count(o) as totalOrders,
  count(s) as ordersWithStatus,
  count(o) - count(s) as ordersMissingStatus,
  count(o) = count(s) as migrationComplete;

// 3-2. 상태별 주문 수 (마이그레이션 전후 비교용)
MATCH (o:Order)-[:HAS_STATUS]->(s:OrderStatus)
RETURN s.name as status, count(o) as orderCount
ORDER BY s.displayOrder;

// 3-3. 상태가 없는 주문 찾기 (문제 있는 데이터)
MATCH (o:Order)
WHERE NOT (o)-[:HAS_STATUS]->()
RETURN o.orderId, o.orderDate
LIMIT 10;


// ========================================
// 과제 4: 롤백 스크립트
// ========================================

// 4-1. OrderStatus 관계를 다시 속성으로 복원
MATCH (o:Order)-[r:HAS_STATUS]->(s:OrderStatus)
SET o.status = s.name,
    o.statusUpdatedAt = r.changedAt
DELETE r
RETURN count(*) as rolledBackOrders;

// 4-2. OrderStatus 노드 삭제 (관계가 없는 경우만)
MATCH (s:OrderStatus)
WHERE NOT ()-[:HAS_STATUS]->(s)
DELETE s
RETURN count(*) as deletedStatusNodes;

// 4-3. 롤백 검증
MATCH (o:Order)
WHERE o.status IS NOT NULL
RETURN count(o) as ordersWithStatusProperty,
  collect(DISTINCT o.status) as statusValues;
`,
        hints: [
          'SET은 NULL 속성에만 적용하려면 WHERE ... IS NULL 사용',
          'COALESCE(a, b)는 a가 NULL이면 b를 반환',
          '마이그레이션은 항상 검증 전에 실제 삭제하지 마세요',
          '롤백 스크립트는 마이그레이션 전에 미리 준비'
        ]
      }
    },

    // ============================================
    // Task 8: Day 2 퀴즈
    // ============================================
    {
      id: 'day2-quiz',
      type: 'quiz',
      title: 'Day 2 퀴즈: Object Type 설계',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Palantir Foundry에서 Object Type의 역할은?',
            options: [
              '데이터베이스 테이블을 정의한다',
              '비즈니스 엔티티를 표현하는 스키마이다',
              '쿼리 성능을 최적화한다',
              '사용자 권한을 관리한다'
            ],
            answer: 1,
            explanation: 'Object Type은 비즈니스 개념을 표현하는 스키마입니다. 단순한 데이터 구조가 아니라 도메인 지식을 담은 설계입니다.'
          },
          {
            question: '"도시(City)" 정보를 모델링할 때, 어떤 방식이 더 적합한가?',
            options: [
              '속성으로 모델링: (:Person {city: "Seoul"})',
              '관계로 모델링: (:Person)-[:LIVES_IN]->(:City {name: "Seoul"})',
              '둘 다 동일하게 적합하다',
              '별도 테이블로 분리해야 한다'
            ],
            answer: 1,
            explanation: '도시는 독립적인 엔티티로, 인구, 위치 등 추가 속성을 가질 수 있고, 여러 사람이 같은 도시에 살 수 있으므로 관계로 모델링하는 것이 더 적합합니다.'
          },
          {
            question: 'Neo4j에서 관계 타입의 올바른 명명 규칙은?',
            options: [
              'camelCase: worksAt',
              'PascalCase: WorksAt',
              'SCREAMING_SNAKE_CASE: WORKS_AT',
              'snake_case: works_at'
            ],
            answer: 2,
            explanation: '관계 타입은 SCREAMING_SNAKE_CASE를 사용합니다. 예: WORKS_AT, PURCHASED, BELONGS_TO'
          },
          {
            question: '스키마 변경 중 가장 안전한 것은?',
            options: [
              '노드 라벨 이름 변경',
              '관계 타입 변경',
              '새 속성 추가',
              '관계 방향 변경'
            ],
            answer: 2,
            explanation: '새 속성 추가는 기존 노드에 영향을 주지 않아 가장 안전합니다. 기존 노드는 해당 속성이 NULL로 유지됩니다.'
          },
          {
            question: '다음 중 Object Type 정의에 포함되어야 하는 것은?',
            options: [
              'Primary Key와 속성만',
              'Primary Key, 속성, 관계(Links)',
              '속성과 인덱스만',
              '관계와 제약조건만'
            ],
            answer: 1,
            explanation: 'Object Type은 Primary Key, 속성(Properties), 관계(Links)를 모두 정의해야 완전한 비즈니스 엔티티를 표현할 수 있습니다.'
          },
          {
            question: '대용량 데이터 마이그레이션 시 권장되는 방법은?',
            options: [
              '한 번에 모든 데이터 처리',
              'APOC을 사용한 배치 처리',
              '수동으로 하나씩 처리',
              '마이그레이션 불필요, 스키마만 변경'
            ],
            answer: 1,
            explanation: '대용량 데이터는 apoc.periodic.iterate 등을 사용해 배치로 처리해야 메모리 문제를 방지할 수 있습니다.'
          }
        ]
      }
    },

    // ============================================
    // Task 9: Day 2 도전 과제
    // ============================================
    {
      id: 'day2-challenge',
      type: 'challenge',
      title: 'Day 2 도전 과제: 도메인 온톨로지 설계',
      duration: 30,
      content: {
        objectives: [
          '실제 비즈니스 도메인을 완전히 모델링한다',
          'Object Type 정의서를 전문적으로 작성한다',
          'Cypher로 구현하고 검증 쿼리를 작성한다'
        ],
        requirements: [
          '**도메인 선택**: 아래 중 하나를 선택 (또는 자유 주제)',
          '  - 병원 예약 시스템 (환자, 의사, 예약, 진료과)',
          '  - 도서관 시스템 (회원, 도서, 대출, 저자)',
          '  - 소셜 네트워크 (사용자, 게시물, 댓글, 팔로우)',
          '**Object Type 최소 5개** 정의 (각 3개 이상 속성)',
          '**관계 최소 6개** 정의 (속성 포함)',
          '**Cypher 스키마** 구현 (제약조건, 인덱스)',
          '**샘플 데이터** 생성 (각 타입당 최소 3개)',
          '**검증 쿼리 3개** 이상 작성'
        ],
        evaluationCriteria: [
          '비즈니스 의미가 명확한가? (20%)',
          '속성 vs 관계 결정이 적절한가? (20%)',
          '명명 규칙을 준수했는가? (15%)',
          '제약조건/인덱스가 적절한가? (15%)',
          '검증 쿼리가 설계를 잘 테스트하는가? (15%)',
          '문서화가 충실한가? (15%)'
        ],
        bonusPoints: [
          'Palantir Object Type 정의서 형식으로 문서화 (+10점)',
          '스키마 진화 시나리오 및 마이그레이션 스크립트 (+15점)',
          '성능 고려사항 (인덱스 전략, 쿼리 최적화) 문서화 (+10점)',
          '실제 비즈니스 요구사항 기반 쿼리 5개 이상 (+15점)'
        ]
      }
    },

    // ============================================
    // Task 10: Cypher Playground 실습
    // ============================================
    {
      id: 'day2-simulator',
      type: 'simulator',
      title: '실습: Cypher Playground로 스키마 테스트',
      duration: 10,
      content: {
        objectives: [
          '설계한 스키마를 Cypher Playground에서 구현한다',
          '제약조건과 인덱스를 테스트한다',
          '검증 쿼리로 설계를 확인한다'
        ],
        simulatorId: 'cypher-playground',
        instructions: `
## Cypher Playground에서 스키마 테스트

오늘 설계한 스키마를 **Cypher Playground**에서 직접 구현해보세요.

### 실습 순서

1. **제약조건 생성**
   - 각 Object Type의 Primary Key에 UNIQUE 제약조건
   - 에러 메시지 확인 (중복 키 삽입 시)

2. **샘플 데이터 생성**
   - 각 Object Type당 3개 이상 노드
   - 관계 연결

3. **검증 쿼리 실행**
   - 설계 의도대로 동작하는지 확인
   - 그래프 시각화로 구조 검증

### 체크포인트

- [ ] 모든 Primary Key에 UNIQUE 제약조건 적용
- [ ] 자주 검색하는 속성에 인덱스 생성
- [ ] 샘플 데이터로 관계 구조 확인
- [ ] 검증 쿼리 최소 3개 실행

### 도전

- 도전 과제의 도메인을 Cypher Playground에서 완전히 구현해보세요
- Knowledge Graph Visualizer로 결과를 시각화해보세요
        `
      }
    }
  ]
}
