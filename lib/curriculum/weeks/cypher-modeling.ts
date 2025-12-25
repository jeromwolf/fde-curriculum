// Week: Cypher 심화 & 데이터 모델링 (Phase 3, Week 2)
import type { Week } from '../types'

export const cypherModelingWeek: Week = {
  slug: 'cypher-modeling',
  week: 2,
  phase: 3,
  month: 5,
  access: 'core',
  title: 'Cypher 심화 & 데이터 모델링',
  topics: ['Cypher 고급 패턴', 'Object Type 설계', '좋은/나쁜 스키마', 'APOC 라이브러리'],
  practice: '비즈니스 도메인 그래프 스키마 설계 및 APOC 활용',
  totalDuration: 720,
  days: [
    {
      slug: 'cypher-advanced',
      title: 'Cypher 고급 쿼리',
      totalDuration: 150,
      tasks: [
        {
          id: 'cypher-patterns-video',
          type: 'video',
          title: 'Cypher 고급 패턴 매칭',
          duration: 20,
          content: {
            objectives: [
              '변수 길이 경로 패턴을 이해한다',
              'OPTIONAL MATCH와 CASE 표현식을 활용한다',
              'WITH 절을 사용한 파이프라인 쿼리를 작성한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=cypher-advanced-placeholder',
            transcript: `
## Cypher 고급 패턴

### 변수 길이 경로 (Variable-Length Paths)

\`\`\`cypher
// 1~3 홉 거리의 모든 연결 찾기
MATCH path = (start:Person {name: 'Alice'})-[:KNOWS*1..3]->(end)
RETURN path

// 최단 경로 찾기
MATCH path = shortestPath(
  (start:Person {name: 'Alice'})-[:KNOWS*]-(end:Person {name: 'Bob'})
)
RETURN path, length(path) as hops
\`\`\`

### OPTIONAL MATCH

\`\`\`cypher
// 친구가 없어도 결과 반환
MATCH (p:Person)
OPTIONAL MATCH (p)-[:KNOWS]->(friend)
RETURN p.name, collect(friend.name) as friends
\`\`\`

### WITH 파이프라인

\`\`\`cypher
// 단계별 처리
MATCH (p:Person)-[:WORKS_AT]->(c:Company)
WITH c, count(p) as employeeCount
WHERE employeeCount > 10
MATCH (c)-[:LOCATED_IN]->(city:City)
RETURN c.name, employeeCount, city.name
\`\`\`

### CASE 표현식

\`\`\`cypher
MATCH (p:Person)
RETURN p.name,
  CASE
    WHEN p.age < 20 THEN '청소년'
    WHEN p.age < 40 THEN '청년'
    WHEN p.age < 60 THEN '중년'
    ELSE '시니어'
  END as ageGroup
\`\`\`

### 집계 함수

\`\`\`cypher
MATCH (p:Person)-[:PURCHASED]->(product)
RETURN p.name,
  count(product) as totalPurchases,
  sum(product.price) as totalSpent,
  avg(product.price) as avgPrice,
  collect(product.name)[0..5] as recentProducts
\`\`\`
            `
          }
        },
        {
          id: 'cypher-practice-code',
          type: 'code',
          title: '고급 Cypher 쿼리 실습',
          duration: 40,
          content: {
            objectives: [
              '변수 길이 경로를 사용한 쿼리를 작성한다',
              'WITH와 집계를 조합한 복잡한 쿼리를 구현한다'
            ],
            instructions: `
## 실습: 고급 Cypher 쿼리

### 준비: 샘플 데이터 생성

먼저 Cypher Playground에서 다음 데이터를 생성합니다:

\`\`\`cypher
// 회사 및 직원 데이터 생성
CREATE (techCorp:Company {name: 'TechCorp', industry: 'Tech'})
CREATE (financeInc:Company {name: 'FinanceInc', industry: 'Finance'})
CREATE (seoul:City {name: 'Seoul'})
CREATE (techCorp)-[:LOCATED_IN]->(seoul)
CREATE (financeInc)-[:LOCATED_IN]->(seoul)

CREATE (alice:Person {name: 'Alice', age: 28})
CREATE (bob:Person {name: 'Bob', age: 35})
CREATE (charlie:Person {name: 'Charlie', age: 42})
CREATE (diana:Person {name: 'Diana', age: 31})

CREATE (alice)-[:WORKS_AT {since: 2020}]->(techCorp)
CREATE (bob)-[:WORKS_AT {since: 2018}]->(techCorp)
CREATE (charlie)-[:WORKS_AT {since: 2015}]->(financeInc)
CREATE (diana)-[:WORKS_AT {since: 2021}]->(financeInc)

CREATE (alice)-[:KNOWS]->(bob)
CREATE (bob)-[:KNOWS]->(charlie)
CREATE (charlie)-[:KNOWS]->(diana)
CREATE (alice)-[:KNOWS]->(diana)
\`\`\`

### 과제 1: 2촌 관계 찾기

Alice에서 2홉 거리에 있는 모든 사람을 찾으세요.

\`\`\`cypher
// 여기에 쿼리 작성
MATCH (alice:Person {name: 'Alice'})-[:KNOWS*2]->(friend)
RETURN DISTINCT friend.name
\`\`\`

### 과제 2: 회사별 직원 통계

각 회사별 직원 수와 평균 나이를 계산하세요.

### 과제 3: 연결 경로 분석

Alice와 Charlie 사이의 모든 가능한 경로를 찾으세요.
            `,
            starterCode: `// Cypher Playground에서 실행하세요

// 과제 1: Alice의 2촌 찾기
// MATCH ...

// 과제 2: 회사별 통계
// MATCH (p:Person)-[:WORKS_AT]->(c:Company)
// ...

// 과제 3: Alice-Charlie 경로
// MATCH path = ...
`,
            solutionCode: `// 과제 1: Alice의 2촌 찾기
MATCH (alice:Person {name: 'Alice'})-[:KNOWS*2]->(friend)
RETURN DISTINCT friend.name as twoHopFriends

// 과제 2: 회사별 통계
MATCH (p:Person)-[:WORKS_AT]->(c:Company)
RETURN c.name as company,
  count(p) as employees,
  round(avg(p.age), 1) as avgAge
ORDER BY employees DESC

// 과제 3: Alice-Charlie 경로
MATCH path = (alice:Person {name: 'Alice'})-[:KNOWS*1..4]-(charlie:Person {name: 'Charlie'})
RETURN path, length(path) as hops
ORDER BY hops
`,
            hints: [
              '변수 길이 경로는 *1..3 형식으로 범위를 지정합니다',
              'DISTINCT를 사용해 중복 결과를 제거하세요',
              '양방향 경로는 -[:KNOWS*]- 처럼 방향 없이 작성합니다'
            ]
          }
        },
        {
          id: 'cypher-quiz',
          type: 'quiz',
          title: 'Cypher 고급 패턴 퀴즈',
          duration: 15,
          content: {
            questions: [
              {
                question: 'MATCH (a)-[:KNOWS*2..4]->(b)에서 *2..4의 의미는?',
                options: [
                  '2개에서 4개의 KNOWS 관계를 거친 경로',
                  '2초에서 4초 사이의 응답 시간',
                  '2번째부터 4번째 노드까지 선택',
                  '최소 2개, 최대 4개의 노드 반환'
                ],
                answer: 0,
                explanation: '*min..max 형식으로 경로 길이의 범위를 지정합니다. *2..4는 2홉에서 4홉 사이의 모든 경로를 매칭합니다.'
              },
              {
                question: 'OPTIONAL MATCH와 MATCH의 차이점은?',
                options: [
                  'OPTIONAL MATCH는 성능이 더 좋다',
                  'OPTIONAL MATCH는 매칭 실패 시에도 NULL을 반환한다',
                  'OPTIONAL MATCH는 첫 번째 결과만 반환한다',
                  'OPTIONAL MATCH는 인덱스를 사용하지 않는다'
                ],
                answer: 1,
                explanation: 'OPTIONAL MATCH는 LEFT OUTER JOIN과 유사하게 동작합니다. 매칭되는 패턴이 없어도 기존 행을 유지하고 NULL을 반환합니다.'
              }
            ]
          }
        }
      ]
    },
    {
      slug: 'object-type-design',
      title: 'Object Type 설계 (Palantir 스타일)',
      totalDuration: 180,
      tasks: [
        {
          id: 'object-type-video',
          type: 'video',
          title: 'Object Type이란? (Palantir Foundry 철학)',
          duration: 25,
          content: {
            objectives: [
              'Object Type의 개념과 필요성을 이해한다',
              'Palantir Foundry의 온톨로지 접근 방식을 파악한다',
              '잘 설계된 Object Type의 특징을 식별한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=object-type-placeholder',
            transcript: `
## Object Type 설계

### Object Type이란?

**Object Type**은 비즈니스 개념을 표현하는 스키마입니다.
단순한 데이터 구조가 아니라, **도메인 지식**을 담은 설계입니다.

> Palantir Foundry에서 Object Type은 온톨로지의 핵심 구성 요소입니다.
> 데이터를 단순히 저장하는 것이 아니라, 비즈니스 의미를 부여합니다.

### Object Type 정의 템플릿

\`\`\`yaml
# Object Type: 고객 (Customer)
name: Customer
description: 우리 서비스를 이용하는 개인 또는 법인

# Primary Key
primary_key: customer_id

# Properties (속성)
properties:
  - name: customer_id
    type: string
    description: 고유 식별자
    required: true

  - name: name
    type: string
    description: 고객 이름 (개인명 또는 법인명)
    required: true

  - name: customer_type
    type: enum[individual, corporate]
    description: 개인/법인 구분
    required: true

  - name: created_at
    type: datetime
    description: 가입일

  - name: lifetime_value
    type: decimal
    description: 고객 생애 가치 (계산 속성)
    derived: true

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
\`\`\`

### 좋은 Object Type의 특징

| 특징 | 설명 |
|------|------|
| **명확한 정체성** | 고유하게 식별 가능한 Primary Key |
| **비즈니스 의미** | 기술 용어가 아닌 비즈니스 용어 사용 |
| **적절한 추상화** | 너무 구체적이지도, 추상적이지도 않음 |
| **명시적 관계** | 다른 Object Type과의 연결이 명확 |
| **진화 가능성** | 새로운 속성 추가에 유연 |

### Anti-Pattern: 나쁜 스키마 예시

\`\`\`
// 나쁜 예: 모든 것을 하나에
(:Entity {
  type: 'customer',
  data: '{...json...}',
  meta: '{...}'
})

// 좋은 예: 명확한 타입 분리
(:Customer {
  id: 'C001',
  name: '홍길동',
  type: 'individual'
})
\`\`\`
            `
          }
        },
        {
          id: 'schema-design-reading',
          type: 'reading',
          title: '그래프 스키마 설계 원칙',
          duration: 20,
          content: {
            objectives: [
              '노드와 관계의 명명 규칙을 이해한다',
              '속성 vs 관계 결정 기준을 학습한다',
              '스키마 진화 전략을 파악한다'
            ],
            markdown: `
## 그래프 스키마 설계 원칙

### 1. 명명 규칙 (Naming Convention)

| 요소 | 규칙 | 예시 |
|------|------|------|
| 노드 라벨 | PascalCase, 단수형 | \`Person\`, \`Company\`, \`Product\` |
| 관계 타입 | SCREAMING_SNAKE_CASE | \`WORKS_AT\`, \`PURCHASED\`, \`KNOWS\` |
| 속성 | camelCase | \`firstName\`, \`createdAt\`, \`totalAmount\` |

### 2. 속성 vs 관계: 결정 기준

**속성으로 모델링**:
- 값이 단순한 스칼라 (문자열, 숫자, 날짜)
- 해당 값에 대한 추가 정보가 없음
- 값으로 직접 조회하는 경우가 적음

\`\`\`cypher
// 속성으로 적합
(:Person {
  name: '홍길동',
  age: 30,
  email: 'hong@example.com'
})
\`\`\`

**관계로 모델링**:
- 값 자체가 독립적인 엔티티
- 값에 대한 추가 속성이 있음
- 값으로 자주 조회하거나 그룹핑

\`\`\`cypher
// 관계로 적합
(:Person)-[:LIVES_IN {since: 2020}]->(:City {name: '서울'})
(:Person)-[:HAS_SKILL {level: 'expert'}]->(:Skill {name: 'Python'})
\`\`\`

### 3. 관계 방향성

- **의미적 방향**: 비즈니스 의미가 자연스러운 방향
- **조회 패턴 최적화**: 자주 탐색하는 방향

\`\`\`cypher
// 자연스러운 방향
(:Employee)-[:REPORTS_TO]->(:Manager)
(:Customer)-[:PURCHASED]->(:Product)

// 역방향 탐색도 가능
MATCH (manager)<-[:REPORTS_TO]-(employee)
\`\`\`

### 4. 인덱스 전략

\`\`\`cypher
// 자주 검색하는 속성에 인덱스
CREATE INDEX person_name FOR (p:Person) ON (p.name)
CREATE INDEX product_sku FOR (p:Product) ON (p.sku)

// 고유성 제약조건
CREATE CONSTRAINT customer_id
FOR (c:Customer) REQUIRE c.customerId IS UNIQUE
\`\`\`

### 5. 스키마 진화 전략

1. **속성 추가**: 기존 노드에 영향 없이 가능
2. **라벨 추가**: 다중 라벨로 분류 세분화
3. **관계 타입 변경**: 마이그레이션 스크립트 필요
4. **버전 관리**: 스키마 변경 이력 문서화

\`\`\`cypher
// 라벨 추가로 분류 세분화
MATCH (c:Customer)
WHERE c.type = 'corporate'
SET c:CorporateCustomer

// 마이그레이션 예시
MATCH (a)-[old:FRIEND]->(b)
CREATE (a)-[:KNOWS {type: 'friend'}]->(b)
DELETE old
\`\`\`
            `
          }
        },
        {
          id: 'schema-design-practice',
          type: 'code',
          title: '도메인 스키마 설계 실습',
          duration: 45,
          content: {
            objectives: [
              '실제 비즈니스 도메인을 그래프로 모델링한다',
              'Object Type 정의서를 작성한다',
              'Cypher로 스키마를 구현한다'
            ],
            instructions: `
## 실습: E-커머스 도메인 스키마 설계

### 시나리오

온라인 쇼핑몰의 핵심 도메인을 그래프로 모델링합니다.

**핵심 개념:**
- 고객 (Customer)
- 상품 (Product)
- 카테고리 (Category)
- 주문 (Order)
- 리뷰 (Review)

### 과제 1: Object Type 정의

각 Object Type의 속성과 관계를 정의하세요.

### 과제 2: Cypher 스키마 구현

\`\`\`cypher
// 제약조건 생성
CREATE CONSTRAINT customer_id
FOR (c:Customer) REQUIRE c.customerId IS UNIQUE;

CREATE CONSTRAINT product_sku
FOR (p:Product) REQUIRE p.sku IS UNIQUE;

// 인덱스 생성
CREATE INDEX product_category
FOR (p:Product) ON (p.category);
\`\`\`

### 과제 3: 샘플 데이터 생성

설계한 스키마에 맞는 샘플 데이터를 생성하세요.
            `,
            starterCode: `// Object Type 정의 (주석으로 작성)

// Customer
// - customerId (PK, string)
// - name (string)
// - email (string)
// - membershipTier (enum: bronze, silver, gold)
// - createdAt (datetime)

// Product
// - sku (PK, string)
// - name (string)
// - price (decimal)
// - stock (integer)

// 관계:
// Customer -[PURCHASED]-> Product
// Customer -[REVIEWED]-> Product
// Product -[BELONGS_TO]-> Category

// Cypher 스키마 구현
// 여기에 작성...
`,
            solutionCode: `// 1. 제약조건 생성
CREATE CONSTRAINT customer_id FOR (c:Customer) REQUIRE c.customerId IS UNIQUE;
CREATE CONSTRAINT product_sku FOR (p:Product) REQUIRE p.sku IS UNIQUE;
CREATE CONSTRAINT order_id FOR (o:Order) REQUIRE o.orderId IS UNIQUE;
CREATE CONSTRAINT category_name FOR (cat:Category) REQUIRE cat.name IS UNIQUE;

// 2. 인덱스 생성
CREATE INDEX customer_email FOR (c:Customer) ON (c.email);
CREATE INDEX product_name FOR (p:Product) ON (p.name);

// 3. 샘플 데이터 생성
// 카테고리
CREATE (electronics:Category {name: 'Electronics', slug: 'electronics'})
CREATE (clothing:Category {name: 'Clothing', slug: 'clothing'})

// 상품
CREATE (laptop:Product {
  sku: 'LAPTOP-001',
  name: 'MacBook Pro 14',
  price: 2499000,
  stock: 50
})
CREATE (tshirt:Product {
  sku: 'SHIRT-001',
  name: 'Basic T-Shirt',
  price: 29000,
  stock: 200
})

// 카테고리 연결
CREATE (laptop)-[:BELONGS_TO]->(electronics)
CREATE (tshirt)-[:BELONGS_TO]->(clothing)

// 고객
CREATE (customer1:Customer {
  customerId: 'C001',
  name: '김철수',
  email: 'kim@example.com',
  membershipTier: 'gold',
  createdAt: datetime()
})

// 주문
CREATE (order1:Order {
  orderId: 'ORD-001',
  orderDate: datetime(),
  totalAmount: 2528000
})

// 관계
CREATE (customer1)-[:PLACED]->(order1)
CREATE (order1)-[:CONTAINS {quantity: 1}]->(laptop)
CREATE (order1)-[:CONTAINS {quantity: 1}]->(tshirt)
CREATE (customer1)-[:REVIEWED {rating: 5, comment: '최고입니다!'}]->(laptop)
`
          }
        }
      ]
    },
    {
      slug: 'apoc-library',
      title: 'APOC 라이브러리 활용',
      totalDuration: 150,
      tasks: [
        {
          id: 'apoc-intro-video',
          type: 'video',
          title: 'APOC: Neo4j의 스위스 아미 나이프',
          duration: 20,
          content: {
            objectives: [
              'APOC 라이브러리의 주요 기능을 파악한다',
              '자주 사용되는 APOC 프로시저를 학습한다',
              '데이터 가져오기/내보내기 방법을 이해한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=apoc-intro-placeholder',
            transcript: `
## APOC 라이브러리

### APOC이란?

**APOC** = Awesome Procedures On Cypher

Neo4j의 확장 라이브러리로, 450개 이상의 프로시저와 함수를 제공합니다.

### 주요 기능 카테고리

| 카테고리 | 예시 함수 | 용도 |
|----------|-----------|------|
| 데이터 변환 | apoc.convert.* | JSON, XML, CSV 변환 |
| 텍스트 처리 | apoc.text.* | 문자열 조작, 정규식 |
| 컬렉션 | apoc.coll.* | 리스트, 맵 처리 |
| 시간 | apoc.date.* | 날짜/시간 변환 |
| 가져오기 | apoc.load.* | CSV, JSON, JDBC |
| 내보내기 | apoc.export.* | CSV, JSON, GraphML |
| 경로 탐색 | apoc.path.* | 확장 경로 알고리즘 |
| 리팩토링 | apoc.refactor.* | 스키마 마이그레이션 |

### 자주 사용하는 프로시저

\`\`\`cypher
// JSON 파일 로드
CALL apoc.load.json('https://api.example.com/data.json')
YIELD value
MERGE (p:Person {id: value.id})
SET p.name = value.name

// CSV 파일 로드
CALL apoc.load.csv('file:///import/customers.csv')
YIELD map
CREATE (c:Customer)
SET c = map

// 주기적 커밋으로 대용량 처리
CALL apoc.periodic.iterate(
  'MATCH (n:OldLabel) RETURN n',
  'SET n:NewLabel REMOVE n:OldLabel',
  {batchSize: 1000}
)

// 문자열 유사도 (Levenshtein)
RETURN apoc.text.levenshteinSimilarity('graph', 'grape') // 0.8
\`\`\`

### 데이터 내보내기

\`\`\`cypher
// Cypher 결과를 JSON으로
CALL apoc.export.json.query(
  'MATCH (c:Customer)-[:PURCHASED]->(p:Product) RETURN c, p',
  'customers-products.json',
  {}
)

// 전체 그래프를 GraphML로
CALL apoc.export.graphml.all('full-graph.graphml', {})
\`\`\`
            `
          }
        },
        {
          id: 'apoc-practice-code',
          type: 'code',
          title: 'APOC 실습: 데이터 가져오기 & 변환',
          duration: 40,
          content: {
            objectives: [
              'APOC으로 외부 데이터를 가져온다',
              '텍스트 처리 함수를 활용한다',
              '대용량 데이터 처리 패턴을 익힌다'
            ],
            instructions: `
## APOC 실습

### 과제 1: JSON 데이터 가져오기

공개 API에서 데이터를 가져와 그래프로 변환합니다.

\`\`\`cypher
// 샘플: JSONPlaceholder API
CALL apoc.load.json('https://jsonplaceholder.typicode.com/users')
YIELD value
MERGE (u:User {id: value.id})
SET u.name = value.name,
    u.email = value.email,
    u.phone = value.phone
\`\`\`

### 과제 2: 텍스트 정규화

이름과 이메일을 정규화합니다.

### 과제 3: 대용량 데이터 처리

1000개 이상의 노드를 배치로 처리합니다.
            `,
            starterCode: `// APOC 프로시저 실습

// 1. JSON 데이터 가져오기
// CALL apoc.load.json(...)

// 2. 텍스트 정규화
// RETURN apoc.text.clean(...)

// 3. 배치 처리
// CALL apoc.periodic.iterate(...)
`,
            solutionCode: `// 1. JSON 데이터 가져오기
CALL apoc.load.json('https://jsonplaceholder.typicode.com/users')
YIELD value
MERGE (u:User {id: value.id})
SET u.name = value.name,
    u.email = apoc.text.clean(value.email),
    u.company = value.company.name

// 회사별 그룹핑
MATCH (u:User)
WITH u.company as companyName, collect(u) as employees
MERGE (c:Company {name: companyName})
WITH c, employees
UNWIND employees as emp
MERGE (emp)-[:WORKS_AT]->(c);

// 2. 텍스트 정규화 및 유사도
MATCH (u1:User), (u2:User)
WHERE u1.id < u2.id
WITH u1, u2, apoc.text.levenshteinSimilarity(u1.name, u2.name) as similarity
WHERE similarity > 0.5
RETURN u1.name, u2.name, similarity
ORDER BY similarity DESC;

// 3. 대용량 배치 처리
CALL apoc.periodic.iterate(
  'MATCH (u:User) RETURN u',
  'SET u.normalized_name = apoc.text.clean(u.name)',
  {batchSize: 100, parallel: false}
)
YIELD batches, total
RETURN batches, total;
`
          }
        },
        {
          id: 'week2-challenge',
          type: 'challenge',
          title: 'Week 2 도전 과제: 도메인 온톨로지 설계',
          duration: 60,
          content: {
            objectives: [
              '실제 비즈니스 도메인을 분석한다',
              'Object Type과 관계를 설계한다',
              'Cypher로 구현하고 검증한다'
            ],
            requirements: [
              '선택한 도메인의 핵심 Object Type 5개 이상 정의',
              '각 Object Type당 최소 3개의 속성 정의',
              'Object Type 간 관계 5개 이상 정의',
              '샘플 데이터로 검증 쿼리 작성'
            ],
            evaluationCriteria: [
              '비즈니스 의미가 명확한가?',
              '속성 vs 관계 결정이 적절한가?',
              '명명 규칙을 준수했는가?',
              '확장 가능한 구조인가?'
            ],
            bonusPoints: [
              'APOC을 활용한 데이터 가져오기',
              '인덱스 및 제약조건 설계',
              '마이그레이션 시나리오 문서화'
            ]
          }
        }
      ]
    }
  ]
}
