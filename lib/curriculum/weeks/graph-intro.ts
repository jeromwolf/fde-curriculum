// Week: 그래프 이론 & Neo4j 입문 (Phase 3, Week 1)
import type { Week } from '../types'

export const graphIntroWeek: Week = {
  slug: 'graph-intro',
  week: 1,
  phase: 3,
  month: 5,
  access: 'free',  // Phase 3 첫 번째 Week은 무료 체험
  title: '그래프 이론 & Neo4j 입문',
  topics: ['Property Graph 모델', 'Neo4j vs Memgraph', 'Cypher 기초 CRUD', '관계형 vs 그래프 DB'],
  practice: '소셜 네트워크 그래프 구축 (30+ 노드, 50+ 관계)',
  totalDuration: 720,
  days: [
    {
      slug: 'graph-fundamentals',
      title: '그래프 데이터 모델 기초',
      totalDuration: 150,
      tasks: [
        {
          id: 'graph-intro-video',
          type: 'video',
          title: '왜 그래프 데이터베이스인가? (관계 중심 사고)',
          duration: 15,
          content: {
            objectives: [
              '관계형 데이터베이스의 한계를 이해한다',
              '그래프 사고(Graph Thinking)의 개념을 파악한다',
              '그래프 DB가 적합한 문제 유형을 식별할 수 있다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=vY0-BcEz1_0',
            transcript: `
## 왜 그래프 데이터베이스인가?

### 관계형 데이터베이스의 한계

관계형 데이터베이스(RDBMS)는 40년 이상 데이터 저장의 표준이었습니다. 하지만 **관계(relationship)**가 핵심인 데이터를 다룰 때 심각한 한계에 부딪힙니다.

**예시: "친구의 친구의 친구 찾기"**

\`\`\`sql
-- 3촌 친구를 찾는 SQL 쿼리
SELECT DISTINCT f3.name
FROM users u1
JOIN friendships f1 ON u1.id = f1.user_id
JOIN users f1_user ON f1.friend_id = f1_user.id
JOIN friendships f2 ON f1_user.id = f2.user_id
JOIN users f2_user ON f2.friend_id = f2_user.id
JOIN friendships f3 ON f2_user.id = f3.user_id
JOIN users f3_user ON f3.friend_id = f3_user.id
WHERE u1.name = 'Alice';
\`\`\`

이 쿼리의 문제점:
- **복잡성**: JOIN이 6개나 필요
- **성능**: 관계 깊이가 늘어날수록 기하급수적으로 느려짐
- **가독성**: 비즈니스 의도가 코드에서 보이지 않음

### 그래프 사고 (Graph Thinking)

그래프 DB에서는 같은 질문이 자연스럽게 표현됩니다:

\`\`\`cypher
// 3촌 친구 찾기 - Cypher 쿼리
MATCH (alice:Person {name: 'Alice'})-[:KNOWS*3]->(friend)
RETURN DISTINCT friend.name
\`\`\`

**핵심 통찰**:
- 데이터는 원래 **연결**되어 있다
- 관계가 **일급 시민(first-class citizen)**이다
- 패턴 매칭으로 직관적인 쿼리 가능

> **일급 시민(First-Class Citizen)이란?**
>
> 프로그래밍에서 "일급 시민"은 다른 요소들과 동등한 권리를 가진 존재를 의미합니다:
> - **변수에 저장** 가능
> - **함수의 인자**로 전달 가능
> - **함수의 반환값**으로 사용 가능
> - **고유한 식별자**를 가짐
>
> 관계형 DB에서 "관계"는 외래키(FK)로 간접 표현되는 **이급 시민**입니다.
> 반면 그래프 DB에서 "관계"는 노드와 동등하게 **속성, 타입, 방향**을 가진 독립적 객체입니다.
>
> 예: \`(Alice)-[:KNOWS {since: 2020}]->(Bob)\`에서 KNOWS 관계는 "since" 속성을 가진 실체입니다.

### 그래프 DB가 빛나는 순간

| 사용 사례 | 왜 그래프? |
|-----------|-----------|
| 소셜 네트워크 | 사용자 간 관계, 영향력 분석 |
| 추천 엔진 | "이 상품을 산 사람들이 본 다른 상품" |
| 사기 탐지 | 비정상적인 거래 패턴 탐지 |
| 지식 그래프 | 개념 간 연결, 추론 |
| 네트워크 분석 | IT 인프라, 공급망 |

### 핵심 메시지

> "관계형 DB는 데이터를 **테이블**로 본다. 그래프 DB는 데이터를 **네트워크**로 본다."

다음 강의에서 Property Graph의 구성 요소를 자세히 살펴보겠습니다.
            `,
            keyPoints: [
              'RDBMS는 복잡한 관계 쿼리에서 JOIN 폭발 문제 발생',
              '그래프 DB는 관계를 일급 시민으로 취급',
              '패턴 매칭으로 직관적인 쿼리 가능',
              '소셜, 추천, 사기 탐지, 지식 그래프에 적합'
            ]
          }
        },
        {
          id: 'graph-concepts-reading',
          type: 'reading',
          title: 'Property Graph 구성 요소 (노드, 관계, 속성, 레이블)',
          duration: 10,
          content: {
            objectives: [
              'Property Graph의 4가지 핵심 구성 요소를 이해한다',
              '노드, 관계, 속성, 레이블의 차이를 구분할 수 있다',
              '실제 데이터를 Property Graph로 모델링할 수 있다'
            ],
            markdown: `
# Property Graph 구성 요소

Property Graph 모델은 4가지 핵심 요소로 구성됩니다.

## 1. 노드 (Node)

노드는 **엔티티(entity)**를 나타냅니다. 사람, 장소, 사물, 개념 등 무엇이든 될 수 있습니다.

\`\`\`
(alice)  // 노드
(neo4j)  // 노드
(seoul)  // 노드
\`\`\`

**비유**: 노드는 명사입니다 - "사람", "회사", "도시"

## 2. 관계 (Relationship)

관계는 두 노드를 **연결**합니다. 관계는 항상 **방향**을 가집니다.

\`\`\`
(alice)-[:KNOWS]->(bob)     // alice가 bob을 안다
(alice)-[:WORKS_AT]->(neo4j) // alice가 neo4j에서 일한다
\`\`\`

**비유**: 관계는 동사입니다 - "알다", "근무하다", "사다"

### 관계의 특징
- **방향성**: 시작 노드 → 끝 노드
- **타입**: KNOWS, WORKS_AT, PURCHASED 등
- **유일성**: 같은 두 노드 사이에 여러 관계 가능

## 3. 속성 (Property)

속성은 노드나 관계에 붙는 **키-값 쌍**입니다.

\`\`\`
// 노드의 속성
(alice:Person {name: 'Alice', age: 30, city: 'Seoul'})

// 관계의 속성
(alice)-[:KNOWS {since: 2020, strength: 'close'}]->(bob)
\`\`\`

**지원 타입**: 문자열, 숫자, 불리언, 날짜, 리스트

## 4. 레이블 (Label)

레이블은 노드를 **분류**합니다. 하나의 노드에 여러 레이블 가능.

\`\`\`
(alice:Person)              // 1개 레이블
(alice:Person:Employee)     // 2개 레이블
(neo4j:Company:Tech:Startup) // 3개 레이블
\`\`\`

**용도**:
- 노드 그룹핑
- 인덱스 생성
- 쿼리 필터링

## 전체 예시

\`\`\`
(alice:Person {name: 'Alice', age: 30})
  -[:WORKS_AT {since: 2022, role: 'Engineer'}]->
(neo4j:Company {name: 'Neo4j', founded: 2007})
\`\`\`

| 요소 | 예시 |
|------|-----|
| 노드 | alice, neo4j |
| 레이블 | Person, Company |
| 관계 | WORKS_AT |
| 속성 | name, age, since, role |

## 핵심 정리

| 구성 요소 | 역할 | 비유 |
|----------|-----|------|
| 노드 | 엔티티 표현 | 명사 |
| 관계 | 연결 표현 | 동사 |
| 속성 | 상세 정보 | 형용사/부사 |
| 레이블 | 분류 | 카테고리 |
            `,
            externalLinks: [
              { title: 'Neo4j Graph Data Modeling', url: 'https://neo4j.com/developer/data-modeling/' },
              { title: 'Property Graph Model (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Graph_database#Labeled-property_graph' }
            ],
            keyPoints: [
              '노드(Node): 엔티티를 표현하는 점',
              '관계(Relationship): 노드를 연결하는 방향성 있는 선',
              '속성(Property): 노드/관계에 붙는 키-값 데이터',
              '레이블(Label): 노드를 분류하는 태그'
            ]
          }
        },
        {
          id: 'graph-vs-rdb-video',
          type: 'video',
          title: '관계형 DB vs 그래프 DB 비교 (사기 탐지 사례)',
          duration: 15,
          content: {
            objectives: [
              'RDBMS와 Graph DB의 데이터 저장 방식 차이를 이해한다',
              '사기 탐지 시나리오에서 두 DB의 쿼리 방식을 비교한다',
              '각 DB가 적합한 상황을 구분할 수 있다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=Axdg3avChI8',
            transcript: `
## 관계형 DB vs 그래프 DB: 사기 탐지 사례

### 시나리오: 금융 사기 탐지

은행에서 **순환 거래 사기(Ring Fraud)**를 탐지하려고 합니다.

범죄자들은 돈세탁을 위해 여러 계좌를 거쳐 돈을 이체합니다:
\`\`\`
계좌A → 계좌B → 계좌C → 계좌D → 계좌A (다시 원점!)
\`\`\`

이런 **순환 패턴**을 찾아야 합니다.

### 데이터 저장 방식 비교

**관계형 DB (RDBMS)**
\`\`\`
accounts 테이블         transactions 테이블
+----+--------+        +----+------+--------+--------+
| id | owner  |        | id | from | to     | amount |
+----+--------+        +----+------+--------+--------+
| 1  | 김철수 |        | 1  | 1    | 2      | 1000만 |
| 2  | 이영희 |        | 2  | 2    | 3      | 950만  |
| 3  | 박민수 |        | 3  | 3    | 4      | 900만  |
| 4  | 최지영 |        | 4  | 4    | 1      | 850만  |
+----+--------+        +----+------+--------+--------+
\`\`\`

**그래프 DB**
\`\`\`
(김철수)--[1000만]-->(이영희)--[950만]-->(박민수)
    ^                                      |
    |                                      v
    +-------[850만]---(최지영)<--[900만]---+
\`\`\`

### JOIN vs 패턴 매칭

**"3~5단계를 거쳐 원래 계좌로 돌아오는 순환 거래 찾기"**

SQL (JOIN 사용):
\`\`\`sql
-- 4단계 순환만 찾아도 이렇게 복잡...
SELECT a1.owner, a2.owner, a3.owner, a4.owner
FROM transactions t1
JOIN transactions t2 ON t1.to_account = t2.from_account
JOIN transactions t3 ON t2.to_account = t3.from_account
JOIN transactions t4 ON t3.to_account = t4.from_account
JOIN accounts a1 ON t1.from_account = a1.id
JOIN accounts a2 ON t2.from_account = a2.id
JOIN accounts a3 ON t3.from_account = a3.id
JOIN accounts a4 ON t4.from_account = a4.id
WHERE t4.to_account = t1.from_account  -- 순환 조건
  AND t1.amount > 500만
  AND t1.created_at > NOW() - INTERVAL '24 hours';
\`\`\`

Cypher (패턴 매칭):
\`\`\`cypher
// 3~5단계 순환 거래 탐지 - 한 줄!
MATCH path = (start:Account)-[:TRANSFER*3..5]->(start)
WHERE ALL(t IN relationships(path) WHERE t.amount > 5000000)
  AND ALL(t IN relationships(path) WHERE t.timestamp > datetime() - duration('P1D'))
RETURN path, [t IN relationships(path) | t.amount] AS amounts
\`\`\`

**차이점:**
- SQL: 순환 길이(3,4,5)마다 별도 쿼리 필요
- Cypher: \`*3..5\`로 가변 길이 패턴 한 번에 탐색

### 성능 비교 (100만 계좌, 1000만 거래)

| 쿼리 유형 | RDBMS | Graph DB |
|----------|-------|----------|
| 단순 조회 (1 hop) | 0.01초 | 0.01초 |
| 2단계 거래 추적 | 0.5초 | 0.02초 |
| 3단계 순환 탐지 | 30초 | 0.1초 |
| **4단계 순환 탐지** | **5분+** | **0.5초** |
| 5단계 순환 탐지 | 타임아웃 | 2초 |

**왜 이런 차이가?**
- RDBMS: 모든 거래 테이블을 반복 스캔 (Cartesian Product)
- Graph DB: 연결된 노드만 따라가며 탐색 (Index-free Adjacency)

### 추가 사기 패턴들

그래프 DB가 빛나는 다른 사기 탐지 패턴:

**1. 공유 정보 탐지**
\`\`\`cypher
// 같은 전화번호/주소를 공유하는 계좌들
MATCH (a1:Account)-[:HAS_PHONE]->(phone)<-[:HAS_PHONE]-(a2:Account)
WHERE a1 <> a2
RETURN a1, a2, phone
\`\`\`

**2. 대포통장 네트워크**
\`\`\`cypher
// 짧은 시간 내 다수 계좌로 분산 이체
MATCH (source:Account)-[t:TRANSFER]->(targets:Account)
WHERE t.timestamp > datetime() - duration('PT1H')
WITH source, COUNT(DISTINCT targets) AS target_count
WHERE target_count > 10
RETURN source, target_count
\`\`\`

### 언제 무엇을 쓸까?

| 상황 | 추천 DB |
|-----|---------|
| 거래 기록 저장 (ACID) | RDBMS |
| 일별/월별 거래 집계 | RDBMS |
| **순환 거래 탐지** | **Graph DB** |
| **관계 패턴 분석** | **Graph DB** |
| 실시간 사기 알림 | Graph DB + 스트리밍 |

### 함께 쓰기 (Polyglot Persistence)

실무에서는 여러 DB를 함께 사용합니다:
- **PostgreSQL**: 거래 원장 (트랜잭션 보장)
- **Neo4j**: 사기 패턴 탐지, 관계 분석
- **Kafka**: 실시간 거래 스트리밍
- **Redis**: 알림 캐싱
            `,
            keyPoints: [
              '순환 거래 같은 복잡한 패턴은 Graph DB가 압도적으로 유리',
              'SQL은 순환 길이마다 별도 쿼리, Cypher는 가변 길이 한 번에 탐색',
              'Index-free Adjacency: 연결된 노드만 탐색하여 성능 우위',
              '실무에서는 RDBMS(원장) + Graph DB(분석) 함께 사용'
            ]
          }
        },
        {
          id: 'graph-usecase-quiz',
          type: 'quiz',
          title: '그래프 DB 적합성 판단 퀴즈',
          duration: 5,
          content: {
            objectives: [
              '그래프 DB가 적합한 상황을 판단할 수 있다'
            ],
            questions: [
              {
                question: '다음 중 그래프 데이터베이스가 가장 적합한 사용 사례는?',
                options: [
                  '월별 매출 집계 리포트',
                  '소셜 미디어 친구 추천 시스템',
                  '단순한 사용자 로그인 인증',
                  '정적인 제품 카탈로그 저장'
                ],
                answer: 1,
                explanation: '소셜 미디어 친구 추천은 사용자 간 관계(친구, 팔로우)를 깊이 탐색해야 하므로 그래프 DB가 최적입니다.'
              },
              {
                question: 'RDBMS에서 "친구의 친구의 친구"를 찾을 때 발생하는 주요 문제는?',
                options: [
                  '저장 공간 부족',
                  'JOIN 폭발로 인한 성능 저하',
                  '데이터 타입 불일치',
                  '트랜잭션 충돌'
                ],
                answer: 1,
                explanation: '관계 깊이가 늘어날수록 JOIN 수가 기하급수적으로 증가하여 성능이 급격히 저하됩니다.'
              },
              {
                question: 'Property Graph의 4가지 구성 요소가 아닌 것은?',
                options: [
                  '노드 (Node)',
                  '테이블 (Table)',
                  '관계 (Relationship)',
                  '속성 (Property)'
                ],
                answer: 1,
                explanation: 'Property Graph는 노드, 관계, 속성, 레이블로 구성됩니다. 테이블은 RDBMS의 개념입니다.'
              },
              {
                question: '그래프 DB가 빠른 관계 탐색을 가능하게 하는 핵심 기술은?',
                options: [
                  'SQL 최적화',
                  'Index-free adjacency',
                  'B-Tree 인덱스',
                  '파티셔닝'
                ],
                answer: 1,
                explanation: 'Index-free adjacency는 각 노드가 인접 노드에 대한 직접 포인터를 가지고 있어 인덱스 없이도 빠른 탐색이 가능합니다.'
              },
              {
                question: '다음 중 RDBMS가 그래프 DB보다 더 적합한 경우는?',
                options: [
                  '실시간 사기 탐지',
                  '지식 그래프 구축',
                  '월별 매출 SUM/AVG 집계',
                  '경로 최적화 알고리즘'
                ],
                answer: 2,
                explanation: '집계 함수(SUM, AVG, COUNT)를 사용한 분석 쿼리는 RDBMS가 더 효율적입니다.'
              }
            ]
          }
        },
        {
          id: 'property-graph-video',
          type: 'video',
          title: 'Property Graph 모델 상세 (노드, 관계, 방향)',
          duration: 15,
          content: {
            objectives: [
              'Property Graph의 4가지 핵심 구성 요소를 완벽히 이해한다',
              '관계의 방향성과 그 의미를 파악한다',
              '실제 도메인을 Property Graph로 모델링할 수 있다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=JNhDJTVdGnY',
            transcript: `
## Property Graph 모델 심화

### Property Graph란?

Property Graph는 데이터를 **노드(Nodes)**와 **관계(Relationships)**로 표현하며,
둘 다 **속성(Properties)**을 가질 수 있는 그래프 모델입니다.

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Property Graph                        │
│                                                          │
│   ┌──────────┐        [:KNOWS]          ┌──────────┐   │
│   │  :Person │  ──────────────────────> │  :Person │   │
│   │──────────│      since: 2020         │──────────│   │
│   │name:Alice│      strength: "best"    │name: Bob │   │
│   │ age: 30  │                          │ age: 28  │   │
│   │city:Seoul│                          │city:Busan│   │
│   └──────────┘                          └──────────┘   │
│      노드              관계 (속성 포함)        노드       │
│    (레이블+속성)                           (레이블+속성)  │
└─────────────────────────────────────────────────────────┘
\`\`\`

### 1. 노드 (Nodes) - 개체

노드는 그래프의 **핵심 개체**입니다.

**특징:**
- **레이블(Label)**: 노드의 종류/타입 (예: Person, Product, Company)
- **속성(Properties)**: key-value 쌍 (예: name: "Alice", age: 30)
- **고유 ID**: 시스템이 자동 부여

\`\`\`cypher
// 노드 생성 예시
CREATE (alice:Person {name: 'Alice', age: 30, city: 'Seoul'})
CREATE (neo4j:Company {name: 'Neo4j', founded: 2007})
CREATE (laptop:Product {name: 'MacBook', price: 2000000})

// 다중 레이블 (노드가 여러 역할)
CREATE (elon:Person:CEO:Founder {name: 'Elon Musk'})
\`\`\`

**레이블 vs 속성 선택 기준:**
| 기준 | 레이블 사용 | 속성 사용 |
|------|-----------|----------|
| 값의 종류 | 적음 (10개 미만) | 많음 (수백~무한) |
| 쿼리 패턴 | 자주 필터링 | 가끔 필터링 |
| 예시 | :Customer, :Admin | status: "active" |

### 2. 관계 (Relationships) - 연결

관계는 노드 간의 **의미 있는 연결**입니다.

**관계의 3요소:**
\`\`\`
(시작 노드)-[관계 타입 {속성}]->(끝 노드)
     ↓           ↓         ↓        ↓
   Start      Type    Properties   End
\`\`\`

**필수 특성:**
1. **방향(Direction)**: 반드시 시작과 끝이 있음
2. **타입(Type)**: 반드시 하나의 타입을 가짐
3. **연결**: 반드시 두 노드를 연결 (허공에 떠 있을 수 없음)

\`\`\`cypher
// 관계 생성 예시
CREATE (alice)-[:KNOWS {since: 2020, strength: 'best_friend'}]->(bob)
CREATE (alice)-[:WORKS_AT {role: 'Engineer', since: 2019}]->(company)
CREATE (alice)-[:PURCHASED {date: date('2024-01-15')}]->(laptop)
\`\`\`

### 3. 방향성 (Direction)

모든 관계는 **시작 노드**와 **끝 노드**를 가집니다.

\`\`\`
(alice)-[:FOLLOWS]->(bob)      Alice → Bob 팔로우
(bob)-[:FOLLOWS]->(alice)      Bob → Alice 팔로우 (다른 관계!)
\`\`\`

**방향의 의미:**
| 관계 | 방향 의미 |
|------|----------|
| FOLLOWS | 팔로우 하는 방향 |
| REPORTS_TO | 보고 체계 |
| PURCHASED | 구매자 → 상품 |
| LOCATED_IN | 위치 포함 관계 |

**쿼리에서 방향 다루기:**
\`\`\`cypher
// 나가는 방향 (outgoing)
MATCH (a)-[:FOLLOWS]->(b) RETURN b

// 들어오는 방향 (incoming)
MATCH (a)<-[:FOLLOWS]-(b) RETURN b

// 방향 무시 (양방향)
MATCH (a)-[:KNOWS]-(b) RETURN b
\`\`\`

### 4. 속성 (Properties)

노드와 관계 모두 **key-value 속성**을 가질 수 있습니다.

**지원하는 데이터 타입:**
| 타입 | 예시 |
|------|------|
| String | \`"Alice"\`, \`"서울"\` |
| Integer | \`30\`, \`2024\` |
| Float | \`3.14\`, \`99.9\` |
| Boolean | \`true\`, \`false\` |
| Date/DateTime | \`date('2024-01-01')\` |
| List | \`['a', 'b', 'c']\` |
| Point (공간) | \`point({x:1, y:2})\` |

\`\`\`cypher
// 다양한 속성 타입
CREATE (p:Person {
  name: 'Alice',           // String
  age: 30,                 // Integer
  salary: 5000000.50,      // Float
  isActive: true,          // Boolean
  skills: ['Python', 'Neo4j'],  // List
  joinDate: date('2020-03-15')  // Date
})
\`\`\`

### 5. 다중 관계와 자기 참조

**같은 노드 쌍 사이에 여러 관계:**
\`\`\`
(alice)-[:KNOWS]->(bob)
(alice)-[:WORKS_WITH]->(bob)
(alice)-[:MANAGES]->(bob)
\`\`\`

**자기 참조 관계:**
\`\`\`
(company)-[:SUBSIDIARY_OF]->(company)  // 지주회사 구조
(category)-[:PARENT_OF]->(category)    // 카테고리 계층
(person)-[:FRIEND_OF]->(person)        // 친구 관계
\`\`\`

### Property Graph vs RDF

| 특성 | Property Graph | RDF |
|------|---------------|-----|
| 데이터 단위 | 노드 + 관계 | Triple (S-P-O) |
| 속성 | 노드/관계에 직접 | 별도 Triple로 표현 |
| 쿼리 언어 | Cypher, Gremlin | SPARQL |
| 주요 DB | Neo4j, Memgraph | Virtuoso, Stardog |
| 강점 | 직관적, 성능 | 표준화, 추론 |

### 도메인별 모델링 예시

**1. 소셜 네트워크:**
\`\`\`
(:User)-[:FOLLOWS]->(:User)
(:User)-[:POSTED]->(:Post)
(:User)-[:LIKED]->(:Post)
(:Post)-[:TAGGED]->(:Topic)
\`\`\`

**2. 이커머스:**
\`\`\`
(:Customer)-[:PURCHASED]->(:Order)-[:CONTAINS]->(:Product)
(:Product)-[:BELONGS_TO]->(:Category)
(:Customer)-[:REVIEWED {rating: 5}]->(:Product)
\`\`\`

**3. 금융/사기 탐지:**
\`\`\`
(:Account)-[:TRANSFER {amount: 1000}]->(:Account)
(:Person)-[:OWNS]->(:Account)
(:Person)-[:HAS_ADDRESS]->(:Address)
(:Account)-[:FLAGGED_AS]->(:RiskLevel)
\`\`\`

**4. IT 인프라:**
\`\`\`
(:Server)-[:CONNECTS_TO]->(:Server)
(:Application)-[:RUNS_ON]->(:Server)
(:Service)-[:DEPENDS_ON]->(:Service)
\`\`\`

### 모델링 베스트 프랙티스

1. **명사 → 노드**: 사람, 장소, 사물, 개념
2. **동사 → 관계**: 행동, 연결, 상태 변화
3. **형용사/부사 → 속성**: 특징, 수량, 시간

**좋은 모델의 특징:**
- 비즈니스 질문에 쉽게 답할 수 있음
- 화이트보드 그림이 코드로 자연스럽게 변환됨
- 과도한 노드/관계 없이 간결함
            `,
            keyPoints: [
              '노드는 레이블(타입)과 속성(key-value)을 가진 개체',
              '관계는 반드시 방향, 타입, 두 노드 연결을 가짐',
              '속성은 노드와 관계 모두에 다양한 타입으로 저장 가능',
              '명사→노드, 동사→관계, 형용사→속성 규칙으로 모델링'
            ]
          }
        },
        {
          id: 'graph-modeling-code',
          type: 'code',
          title: '간단한 소셜 네트워크 모델 설계 (Person, KNOWS)',
          duration: 20,
          content: {
            objectives: [
              'Cypher로 노드와 관계를 생성할 수 있다',
              '소셜 네트워크를 Property Graph로 모델링할 수 있다'
            ],
            instructions: `
# 소셜 네트워크 모델 설계 실습

이번 실습에서는 간단한 소셜 네트워크를 Property Graph로 모델링합니다.

## 목표
- 5명의 Person 노드 생성
- KNOWS 관계로 연결
- 속성 추가 (name, age, city)

## 단계별 진행

### 1. 노드 생성
먼저 5명의 사용자를 생성합니다.

### 2. 관계 생성
KNOWS 관계로 연결합니다. since 속성을 추가하여 언제부터 알았는지 기록합니다.

### 3. 쿼리 테스트
- 모든 노드 조회
- 특정 사용자의 친구 찾기
- 친구의 친구 찾기
            `,
            starterCode: `// 1. Person 노드 생성
// TODO: 5명의 Person 노드를 생성하세요
// 속성: name, age, city

CREATE (alice:Person {name: 'Alice', age: 30, city: 'Seoul'})

// 여기에 나머지 4명을 추가하세요
// Bob (28, Seoul)
// Carol (35, Busan)
// David (25, Seoul)
// Eve (32, Incheon)


// 2. KNOWS 관계 생성
// TODO: 친구 관계를 생성하세요
// Alice-Bob, Alice-Carol, Bob-David, Carol-Eve, David-Eve

MATCH (a:Person {name: 'Alice'}), (b:Person {name: 'Bob'})
CREATE (a)-[:KNOWS {since: 2020}]->(b)

// 여기에 나머지 관계를 추가하세요


// 3. 쿼리 테스트
// Alice의 친구 찾기
MATCH (alice:Person {name: 'Alice'})-[:KNOWS]->(friend)
RETURN friend.name

// Alice의 친구의 친구 찾기 (2촌)
// TODO: 이 쿼리를 완성하세요
`,
            solutionCode: `// 1. Person 노드 생성
CREATE (alice:Person {name: 'Alice', age: 30, city: 'Seoul'})
CREATE (bob:Person {name: 'Bob', age: 28, city: 'Seoul'})
CREATE (carol:Person {name: 'Carol', age: 35, city: 'Busan'})
CREATE (david:Person {name: 'David', age: 25, city: 'Seoul'})
CREATE (eve:Person {name: 'Eve', age: 32, city: 'Incheon'})

// 2. KNOWS 관계 생성
MATCH (a:Person {name: 'Alice'}), (b:Person {name: 'Bob'})
CREATE (a)-[:KNOWS {since: 2020}]->(b)

MATCH (a:Person {name: 'Alice'}), (c:Person {name: 'Carol'})
CREATE (a)-[:KNOWS {since: 2019}]->(c)

MATCH (b:Person {name: 'Bob'}), (d:Person {name: 'David'})
CREATE (b)-[:KNOWS {since: 2021}]->(d)

MATCH (c:Person {name: 'Carol'}), (e:Person {name: 'Eve'})
CREATE (c)-[:KNOWS {since: 2018}]->(e)

MATCH (d:Person {name: 'David'}), (e:Person {name: 'Eve'})
CREATE (d)-[:KNOWS {since: 2022}]->(e)

// 3. Alice의 친구의 친구 찾기 (2촌)
MATCH (alice:Person {name: 'Alice'})-[:KNOWS*2]->(fof)
WHERE fof <> alice
RETURN DISTINCT fof.name AS friend_of_friend`,
            hints: [
              'CREATE 문으로 노드를 생성합니다',
              'MATCH로 노드를 찾은 후 CREATE로 관계를 만듭니다',
              '[:KNOWS*2]는 2 hop 떨어진 노드를 찾습니다'
            ]
          }
        },
        {
          id: 'rdf-comparison-reading',
          type: 'reading',
          title: 'Property Graph vs RDF 비교 (왜 Neo4j를 선택하는가)',
          duration: 10,
          content: {
            objectives: [
              'Property Graph와 RDF의 차이를 이해한다',
              '각 모델의 장단점을 파악한다',
              '프로젝트에 맞는 그래프 모델을 선택할 수 있다'
            ],
            markdown: `
# Property Graph vs RDF

두 가지 주요 그래프 데이터 모델을 비교합니다.

## Property Graph

**대표 DB**: Neo4j, Amazon Neptune, TigerGraph

\`\`\`
(alice:Person {name: 'Alice', age: 30})
  -[:KNOWS {since: 2020}]->
(bob:Person {name: 'Bob'})
\`\`\`

**특징**:
- 노드와 관계에 **속성(property)** 저장 가능
- 직관적인 모델링
- 쿼리 언어: Cypher, Gremlin

## RDF (Resource Description Framework)

**대표 DB**: Stardog, GraphDB, Amazon Neptune

\`\`\`turtle
@prefix ex: <http://example.org/> .

ex:Alice a ex:Person ;
         ex:name "Alice" ;
         ex:age 30 ;
         ex:knows ex:Bob .

ex:Bob a ex:Person ;
       ex:name "Bob" .
\`\`\`

**특징**:
- **트리플(Triple)** 구조: Subject-Predicate-Object
- 웹 표준 (W3C)
- 쿼리 언어: SPARQL
- 온톨로지/추론 지원 (OWL, RDFS)

## 비교표

| 특성 | Property Graph | RDF |
|-----|---------------|-----|
| 데이터 모델 | 노드-관계-속성 | 트리플 (S-P-O) |
| 관계에 속성 | ✅ 가능 | ❌ 불가 (Reification 필요) |
| 표준화 | 없음 (벤더별) | W3C 표준 |
| 추론/온톨로지 | 제한적 | 강력 (OWL, RDFS) |
| 쿼리 언어 | Cypher, Gremlin | SPARQL |
| 학습 곡선 | 낮음 | 높음 |
| 주요 용도 | 앱 개발, 분석 | 지식 그래프, 데이터 통합 |

## 관계에 속성이 필요할 때

Property Graph:
\`\`\`
(alice)-[:KNOWS {since: 2020, strength: 0.8}]->(bob)
\`\`\`

RDF (Reification 필요):
\`\`\`turtle
ex:relationship1 a rdf:Statement ;
    rdf:subject ex:Alice ;
    rdf:predicate ex:knows ;
    rdf:object ex:Bob ;
    ex:since 2020 ;
    ex:strength 0.8 .
\`\`\`

## 언제 무엇을 선택할까?

### Property Graph (Neo4j) 선택
- 애플리케이션 개발 중심
- 빠른 프로토타이핑 필요
- 관계에 속성이 많이 필요
- 팀이 SQL에 익숙함

### RDF 선택
- 데이터 통합/연결이 주목적
- 추론/온톨로지 기능 필요
- 웹 표준 준수 필수
- 외부 지식 베이스와 연동 (DBpedia, Wikidata)

## FDE Academy 선택 이유

이 과정에서는 **Property Graph (Neo4j)**를 먼저 학습합니다:
1. 학습 곡선이 낮음
2. 산업계에서 더 널리 사용됨
3. Cypher가 SQL과 유사하여 친숙함
4. Phase 3 후반에 RDF/SPARQL도 다룸
            `,
            externalLinks: [
              { title: 'Neo4j: RDF vs Property Graph', url: 'https://neo4j.com/blog/rdf-vs-property-graphs-knowledge-graphs/' },
              { title: 'W3C RDF Primer', url: 'https://www.w3.org/TR/rdf11-primer/' }
            ],
            keyPoints: [
              'Property Graph: 속성 저장 용이, 직관적, 앱 개발에 적합',
              'RDF: 트리플 구조, W3C 표준, 추론/온톨로지에 강함',
              '관계에 속성 저장은 Property Graph가 훨씬 간단',
              '실무 앱 개발에는 Neo4j, 지식 그래프 연동에는 RDF'
            ]
          }
        },
        {
          id: 'graph-model-quiz',
          type: 'quiz',
          title: '그래프 모델링 개념 퀴즈',
          duration: 5,
          content: {
            objectives: [
              'Property Graph 모델링 개념을 확인한다'
            ],
            questions: [
              {
                question: 'Property Graph에서 "Alice가 Bob을 2020년부터 알고 있다"를 표현할 때, "2020"은 어디에 저장해야 할까요?',
                options: [
                  'Alice 노드의 속성',
                  'Bob 노드의 속성',
                  'KNOWS 관계의 속성',
                  '별도의 Year 노드'
                ],
                answer: 2,
                explanation: '"since: 2020"은 Alice와 Bob 사이의 KNOWS 관계에 대한 정보이므로 관계의 속성으로 저장합니다.'
              },
              {
                question: 'RDF와 비교했을 때 Property Graph의 가장 큰 장점은?',
                options: [
                  'W3C 표준을 따른다',
                  '관계에 속성을 쉽게 저장할 수 있다',
                  '온톨로지 추론이 강력하다',
                  'SPARQL 쿼리를 사용할 수 있다'
                ],
                answer: 1,
                explanation: 'Property Graph는 관계에 직접 속성을 저장할 수 있어 모델링이 직관적입니다. RDF는 Reification이 필요합니다.'
              },
              {
                question: '다음 중 올바른 Cypher 패턴은?',
                options: [
                  '(alice)-[KNOWS]->(bob)',
                  '(alice)-[:KNOWS]->(bob)',
                  '[alice]-(:KNOWS)->[bob]',
                  '<alice>-[:KNOWS]-><bob>'
                ],
                answer: 1,
                explanation: 'Cypher에서 노드는 (), 관계는 -[:TYPE]->로 표현합니다.'
              },
              {
                question: '한 Person 노드에 여러 레이블을 붙일 수 있나요?',
                options: [
                  '불가능하다',
                  '가능하다 (예: Person:Employee)',
                  '최대 2개까지만 가능하다',
                  '레이블은 관계에만 붙일 수 있다'
                ],
                answer: 1,
                explanation: 'Property Graph에서 노드는 여러 레이블을 가질 수 있습니다. 예: (:Person:Employee:Manager)'
              }
            ]
          }
        },
        {
          id: 'realworld-cases-video',
          type: 'video',
          title: '실제 활용 사례 (추천, 사기 탐지, 지식 그래프)',
          duration: 15,
          content: {
            objectives: [
              '그래프 DB의 실제 산업 활용 사례를 파악한다',
              '각 사례에서 그래프 모델이 어떻게 적용되는지 이해한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=GMaNgYPBaM4',
            transcript: `
## 그래프 DB 실제 활용 사례

### 1. 추천 시스템 (Netflix, Amazon)

**문제**: "이 상품을 산 사람들이 본 다른 상품"

\`\`\`cypher
// 협업 필터링
MATCH (me:User)-[:PURCHASED]->(product)<-[:PURCHASED]-(other:User)
      -[:PURCHASED]->(rec:Product)
WHERE me.id = $userId AND NOT (me)-[:PURCHASED]->(rec)
RETURN rec, count(*) AS score
ORDER BY score DESC
LIMIT 10
\`\`\`

**Netflix 사례**:
- 1억+ 사용자, 수십억 개 관계
- 실시간 추천 응답 < 100ms
- 그래프 기반으로 콘텐츠 탐색 경험 개선

### 2. 사기 탐지 (금융, 이커머스)

**문제**: "비정상적인 거래 패턴 탐지"

\`\`\`cypher
// 돈세탁 패턴 탐지: 자금이 5번 이상 이동 후 원점 복귀
MATCH path = (a:Account)-[:TRANSFER*5..10]->(a)
WHERE all(r IN relationships(path) WHERE r.amount > 10000)
RETURN path
\`\`\`

**실제 성과**:
- PayPal: 사기 탐지율 30% 향상
- HSBC: 의심 거래 분석 시간 90% 단축
- eBay: 실시간 사기 차단

### 3. 지식 그래프 (Google, Palantir)

**문제**: "엔티티 간 관계를 통한 인사이트 도출"

\`\`\`cypher
// 기업 관계 분석: 공급망 리스크
MATCH (supplier:Company)-[:SUPPLIES]->(part:Part)
      <-[:USES]-(product:Product)<-[:SELLS]-(us:Company {name: 'OurCo'})
WHERE supplier.country IN ['RU', 'BY']
RETURN supplier, part, product
\`\`\`

**활용 분야**:
- Google Knowledge Graph: 검색 결과 강화
- Palantir Foundry: 기업 데이터 통합
- 제약사: 약물 상호작용 분석

### 4. 네트워크 & IT 운영

**문제**: "장애 발생 시 영향 범위 파악"

\`\`\`cypher
// 서버 장애 영향 분석
MATCH (failed:Server {status: 'DOWN'})
      <-[:CONNECTS*1..3]-(affected)
RETURN affected, length(path) AS hops
ORDER BY hops
\`\`\`

**성과**:
- Cisco: 네트워크 장애 진단 시간 80% 단축
- Airbnb: 마이크로서비스 의존성 시각화

### 5. 신약 개발 (제약/바이오)

**문제**: "기존 약물의 새로운 용도 발견 (Drug Repurposing)"

\`\`\`cypher
// 약물-질병 연결 탐색
MATCH (drug:Drug)-[:TARGETS]->(protein:Protein)
      <-[:ASSOCIATED_WITH]-(disease:Disease)
WHERE NOT (drug)-[:TREATS]->(disease)
RETURN drug.name, disease.name, protein.name
\`\`\`

**사례**:
- AstraZeneca: Knowledge Graph로 신약 후보 발굴
- COVID-19: 기존 약물 중 치료제 후보 탐색
            `,
            keyPoints: [
              '추천 시스템: 협업 필터링을 그래프 쿼리로 구현',
              '사기 탐지: 순환 패턴, 비정상 경로 탐지',
              '지식 그래프: 엔티티 간 관계로 인사이트 도출',
              '네트워크 분석: 장애 영향 범위 파악',
              '신약 개발: Drug Repurposing, 단백질-질병 연결'
            ]
          }
        },
        {
          id: 'when-not-graph-reading',
          type: 'reading',
          title: '그래프 DB를 쓰지 말아야 할 때',
          duration: 10,
          content: {
            objectives: [
              '그래프 DB가 적합하지 않은 상황을 이해한다',
              'DB 선택 시 고려해야 할 요소를 파악한다'
            ],
            markdown: `
# 그래프 DB를 쓰지 말아야 할 때

그래프 DB는 강력하지만, **만능이 아닙니다**. 잘못된 선택은 오히려 복잡성과 비용을 증가시킵니다.

## 1. 단순 CRUD 애플리케이션

**예시**: 블로그 포스트 저장, 사용자 프로필 관리

\`\`\`
// 이런 단순한 구조에는 RDBMS가 더 적합
Posts: id, title, content, author_id, created_at
\`\`\`

**이유**:
- 관계가 단순함 (1:N 정도)
- 그래프 DB의 장점을 활용할 수 없음
- PostgreSQL이 더 성숙하고 비용 효율적

## 2. 대규모 집계 쿼리

**예시**: 월별 매출 합계, 일일 활성 사용자 수

\`\`\`sql
-- 이런 쿼리는 RDBMS/DW가 더 빠름
SELECT DATE_TRUNC('month', order_date), SUM(amount)
FROM orders
GROUP BY 1
ORDER BY 1
\`\`\`

**이유**:
- 그래프 DB는 집계에 최적화되지 않음
- 컬럼형 DB (ClickHouse, BigQuery)가 더 효율적
- 파티셔닝, 인덱스 최적화가 제한적

## 3. 고빈도 쓰기 작업

**예시**: IoT 센서 데이터, 로그 수집

\`\`\`
// 초당 수만 건 쓰기 → 시계열 DB 사용
INSERT INTO sensor_data (timestamp, value) VALUES (...)
\`\`\`

**이유**:
- 그래프 DB는 읽기 최적화
- 쓰기 성능은 시계열 DB (InfluxDB, TimescaleDB)가 우수
- 복잡한 관계가 필요 없음

## 4. 스키마가 완전히 고정된 경우

**예시**: 금융 거래 기록, 규제 준수 데이터

**이유**:
- RDBMS의 스키마 강제가 오히려 장점
- 외래 키, 제약 조건으로 데이터 무결성 보장
- 감사(audit) 요구사항 충족

## 5. 작은 데이터셋

**예시**: 100명 미만 사용자, 수천 건 데이터

**이유**:
- 그래프 DB 라이선스 비용 대비 효과 낮음
- SQLite나 PostgreSQL로 충분
- 복잡성만 증가

## 결정 가이드

| 질문 | Yes → | No → |
|-----|-------|------|
| 관계 깊이가 3 이상인가? | Graph DB | RDBMS |
| 경로 탐색이 핵심인가? | Graph DB | RDBMS |
| 집계 쿼리가 많은가? | RDBMS/DW | Graph DB |
| 초당 수만 건 쓰기인가? | 시계열 DB | Graph DB |
| 데이터가 100만 건 미만인가? | RDBMS | 검토 필요 |

## 핵심 메시지

> "그래프 DB는 **관계가 복잡하고 깊은 탐색이 필요한 경우**에 빛납니다.
> 모든 문제에 그래프 DB를 적용하려 하지 마세요."

## Polyglot Persistence

실무에서는 여러 DB를 조합합니다:

\`\`\`
사용자/주문 → PostgreSQL
추천 그래프 → Neo4j
검색 → Elasticsearch
캐싱 → Redis
로그 → ClickHouse
\`\`\`
            `,
            keyPoints: [
              '단순 CRUD에는 RDBMS가 더 적합',
              '대규모 집계 쿼리에는 컬럼형 DB 사용',
              '고빈도 쓰기에는 시계열 DB 고려',
              '작은 데이터셋에는 비용 대비 효과 낮음',
              '실무에서는 Polyglot Persistence 전략 사용'
            ]
          }
        }
      ],
      challenge: {
        id: 'domain-model-challenge',
        type: 'challenge',
        title: '도메인 모델 설계 챌린지',
        duration: 30,
        description: '선택한 도메인(이커머스, 영화, 학술)의 그래프 모델 설계 및 설명',
        content: {
          objectives: [
            '실제 도메인을 Property Graph로 모델링할 수 있다',
            '모델링 결정의 근거를 설명할 수 있다'
          ],
          requirements: [
            '도메인 선택 (이커머스, 영화/OTT, 학술/논문 중 1개)',
            '최소 5개의 노드 타입(레이블) 정의',
            '최소 7개의 관계 타입 정의',
            '각 노드/관계에 적절한 속성 추가',
            '모델링 결정의 근거 설명 (왜 이렇게 설계했는가?)'
          ],
          evaluationCriteria: [
            '노드/관계 타입이 도메인을 잘 표현하는가? (30%)',
            '속성이 적절하게 설계되었는가? (20%)',
            '관계의 방향성이 의미 있게 설정되었는가? (20%)',
            '실제 비즈니스 쿼리를 수행할 수 있는 구조인가? (30%)'
          ],
          bonusPoints: [
            '추천 시스템 쿼리 예시 작성',
            '잠재적 성능 이슈 분석',
            '확장 가능한 설계 고려'
          ],
          instructions: `
# 도메인 모델 설계 챌린지

## 도메인 선택 (택 1)

### A. 이커머스
- 고객, 상품, 주문, 카테고리, 리뷰 등
- 추천, 장바구니, 구매 이력 분석

### B. 영화/OTT
- 사용자, 영화, 배우, 감독, 장르 등
- 시청 이력, 평점, 추천

### C. 학술/논문
- 연구자, 논문, 학회, 기관, 키워드 등
- 인용 관계, 공동 저자, 연구 트렌드

## 제출 형식

1. **도메인 선택 이유** (1-2문장)

2. **노드 타입 정의**
   \`\`\`
   (:Customer {id, name, email, joined_at})
   (:Product {id, name, price, category})
   ...
   \`\`\`

3. **관계 타입 정의**
   \`\`\`
   (Customer)-[:PURCHASED {date, quantity}]->(Product)
   (Product)-[:BELONGS_TO]->(Category)
   ...
   \`\`\`

4. **샘플 데이터** (Cypher CREATE 문)

5. **비즈니스 쿼리 3개** (예: 추천, 분석)

6. **설계 결정 근거**
   - 왜 이 관계를 이 방향으로 설정했는가?
   - 어떤 속성을 노드 vs 관계에 넣었는가?
          `
        }
      }
    },
    {
      slug: 'neo4j-setup',
      title: 'Neo4j 환경 설정 & 첫 실행',
      totalDuration: 140,
      tasks: [
        {
          id: 'neo4j-overview-video',
          type: 'video',
          title: 'Neo4j 생태계 소개 (Desktop, Aura, Browser)',
          duration: 10,
          content: {
            objectives: [
              'Neo4j의 주요 제품군을 이해한다',
              '로컬 개발과 클라우드 옵션의 차이를 파악한다',
              '학습에 적합한 환경을 선택할 수 있다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=placeholder',
            transcript: `
## Neo4j 생태계 소개

### Neo4j란?

Neo4j는 **세계에서 가장 널리 사용되는 그래프 데이터베이스**입니다. 2007년 스웨덴에서 시작해, 현재 Fortune 500 기업의 75% 이상이 사용합니다.

### Neo4j 제품군

#### 1. Neo4j Desktop (로컬 개발)

개발자를 위한 **로컬 개발 환경**입니다.

**특징:**
- 무료 다운로드
- 여러 프로젝트/데이터베이스 관리
- 플러그인 설치 (APOC, GDS 등)
- 오프라인 개발 가능

**적합한 경우:**
- 학습 및 프로토타이핑
- 로컬에서 실험하고 싶을 때
- 네트워크 없이 개발할 때

#### 2. Neo4j Aura (클라우드)

**완전 관리형 클라우드 서비스**입니다.

**티어:**
| 티어 | 노드/관계 | 가격 |
|-----|----------|-----|
| Free | 50K 노드, 175K 관계 | 무료 |
| Professional | 무제한 | $65/월~ |
| Enterprise | 무제한 + SLA | 문의 |

**적합한 경우:**
- 설치 없이 바로 시작
- 팀 협업
- 프로덕션 배포

#### 3. Neo4j Browser

모든 Neo4j 환경에서 사용하는 **웹 기반 쿼리 도구**입니다.

**기능:**
- Cypher 쿼리 실행
- 결과 시각화 (그래프/테이블)
- 쿼리 저장 및 공유
- 가이드 튜토리얼

#### 4. Docker 이미지

개발 환경 표준화를 위한 **컨테이너 옵션**입니다.

\`\`\`bash
docker run -p 7474:7474 -p 7687:7687 neo4j:latest
\`\`\`

**장점:**
- 환경 일관성
- CI/CD 통합 용이
- 버전 관리 편리

### 어떤 환경을 선택할까?

| 상황 | 추천 환경 |
|-----|----------|
| 처음 배우는 학습자 | **Aura Free** (설치 없음) |
| 로컬 개발 선호 | **Docker** |
| GUI 선호, Mac/Windows | **Neo4j Desktop** |
| 팀 프로젝트 | **Aura Professional** |

### 이 과정에서는?

**두 가지 환경을 모두 설정합니다:**
1. Docker (로컬) - 오프라인, 빠른 실험
2. Aura Free (클라우드) - 어디서든 접속

다음 강의에서 Docker로 Neo4j를 설치합니다!
            `,
            keyPoints: [
              'Neo4j Desktop: 로컬 개발용 무료 도구',
              'Neo4j Aura: 완전 관리형 클라우드 (Free 티어 존재)',
              'Neo4j Browser: 웹 기반 쿼리/시각화 도구',
              'Docker: 환경 표준화, CI/CD 통합에 적합'
            ]
          }
        },
        {
          id: 'neo4j-memgraph-reading',
          type: 'reading',
          title: 'Neo4j vs Memgraph 비교 (비용, 성능, 생태계)',
          duration: 10,
          content: {
            objectives: [
              'Neo4j와 Memgraph의 차이점을 이해한다',
              '프로젝트 요구사항에 맞는 DB를 선택할 수 있다'
            ],
            markdown: `
# Neo4j vs Memgraph 비교

그래프 데이터베이스 시장의 두 주요 플레이어를 비교합니다.

## 기본 정보

| 항목 | Neo4j | Memgraph |
|-----|-------|----------|
| 설립 | 2007년 (스웨덴) | 2016년 (크로아티아) |
| 라이선스 | GPL + 상용 | BSL + 상용 |
| 쿼리 언어 | Cypher | Cypher (호환) |
| 저장 방식 | 디스크 기반 | **인메모리** |

## 성능 비교

### Memgraph의 강점: 인메모리

\`\`\`
벤치마크: 100만 노드, 1000만 관계
- 단순 조회: Memgraph 5x 빠름
- 경로 탐색: Memgraph 10x 빠름
- 쓰기 작업: Memgraph 3x 빠름
\`\`\`

**단, 메모리에 다 들어가야 함!**

### Neo4j의 강점: 대용량 처리

\`\`\`
- 수십 TB 데이터 처리 가능
- 디스크 기반으로 메모리 제약 없음
- 클러스터링으로 수평 확장
\`\`\`

## 비용 비교

### Neo4j

| 에디션 | 가격 | 특징 |
|-------|-----|------|
| Community | 무료 | 단일 노드, 기본 기능 |
| Aura Free | 무료 | 50K 노드 제한 |
| Aura Pro | $65/월~ | 무제한, SLA |
| Enterprise | $100K/년~ | 클러스터, 보안 |

### Memgraph

| 에디션 | 가격 | 특징 |
|-------|-----|------|
| Community | 무료 | 제한 없음! |
| Cloud | $0.125/시간~ | 관리형 |
| Enterprise | 문의 | 지원, SLA |

**핵심 차이**: Memgraph Community는 기능 제한이 거의 없음

## 생태계 비교

| 항목 | Neo4j | Memgraph |
|-----|-------|----------|
| 커뮤니티 크기 | 매우 큼 | 작음 |
| 문서/튜토리얼 | 풍부 | 적음 |
| 드라이버 | 모든 언어 | 주요 언어 |
| 시각화 도구 | Bloom, Browser | Lab |
| 플러그인 | APOC, GDS | MAGE |
| 클라우드 통합 | AWS, GCP, Azure | AWS, GCP |
| 채용 시장 | 많음 | 적음 |

## 언제 무엇을 선택?

### Neo4j 선택

- 대용량 데이터 (메모리 초과)
- 엔터프라이즈 지원 필요
- 팀에 Neo4j 경험자 있음
- 풍부한 생태계/자료 필요

### Memgraph 선택

- 실시간 분석 (초저지연)
- 데이터가 메모리에 들어감
- 비용 절감 중요 (무료 버전 강력)
- 스트리밍 데이터 처리

## FDE Academy 선택: Neo4j

이 과정에서 Neo4j를 선택한 이유:

1. **산업 표준**: 채용 시장에서 압도적
2. **학습 자료**: 문서, 튜토리얼 풍부
3. **커뮤니티**: 문제 해결 쉬움
4. **Cypher 숙달**: Memgraph도 Cypher 사용

> Cypher를 익히면 Memgraph로 전환은 쉽습니다!
            `,
            externalLinks: [
              { title: 'Neo4j 공식 사이트', url: 'https://neo4j.com/' },
              { title: 'Memgraph 공식 사이트', url: 'https://memgraph.com/' },
              { title: 'DB-Engines Ranking', url: 'https://db-engines.com/en/ranking/graph+dbms' }
            ],
            keyPoints: [
              'Memgraph: 인메모리로 빠름, 무료 버전 강력',
              'Neo4j: 대용량 처리, 풍부한 생태계',
              '학습/취업 목적이라면 Neo4j가 유리',
              'Cypher는 양쪽 모두 사용 가능'
            ]
          }
        },
        {
          id: 'docker-neo4j-code',
          type: 'code',
          title: 'Docker로 Neo4j 설치 및 실행',
          duration: 15,
          content: {
            objectives: [
              'Docker로 Neo4j 컨테이너를 실행할 수 있다',
              'Neo4j의 포트 구성을 이해한다',
              'Neo4j Browser에 접속할 수 있다'
            ],
            instructions: `
# Docker로 Neo4j 설치하기

## 사전 요구사항

- Docker 설치됨 (Docker Desktop 또는 Docker Engine)
- 터미널/명령 프롬프트 사용 가능

## 단계별 진행

### 1. Docker 설치 확인

\`\`\`bash
docker --version
# Docker version 24.x.x 이상
\`\`\`

### 2. Neo4j 이미지 다운로드 및 실행

아래 명령어를 실행하세요.

### 3. 브라우저에서 접속

- URL: http://localhost:7474
- 초기 인증: neo4j / neo4j
- 새 비밀번호 설정 필요

### 4. 연결 테스트

\`\`\`cypher
// 노드 하나 생성
CREATE (n:Test {message: 'Hello, Neo4j!'})
RETURN n

// 확인
MATCH (n:Test) RETURN n
\`\`\`
            `,
            starterCode: `# Neo4j Docker 실행 명령어

# 기본 실행 (비밀번호: test1234)
docker run \\
  --name neo4j-local \\
  -p 7474:7474 \\
  -p 7687:7687 \\
  -e NEO4J_AUTH=neo4j/test1234 \\
  -d neo4j:latest

# 포트 설명:
# 7474 - HTTP (Browser UI)
# 7687 - Bolt (드라이버 연결)

# 실행 확인
docker ps | grep neo4j

# 로그 확인
docker logs neo4j-local

# 접속: http://localhost:7474
# 인증: neo4j / test1234`,
            solutionCode: `# 데이터 영속화 버전 (권장)

# 데이터 디렉토리 생성
mkdir -p ~/neo4j/data ~/neo4j/logs ~/neo4j/plugins

# 영속화 + APOC 플러그인 포함
docker run \\
  --name neo4j-dev \\
  -p 7474:7474 \\
  -p 7687:7687 \\
  -v ~/neo4j/data:/data \\
  -v ~/neo4j/logs:/logs \\
  -v ~/neo4j/plugins:/plugins \\
  -e NEO4J_AUTH=neo4j/devpassword123 \\
  -e NEO4J_PLUGINS='["apoc"]' \\
  -d neo4j:latest

# 컨테이너 관리 명령어
docker stop neo4j-dev    # 중지
docker start neo4j-dev   # 시작
docker rm neo4j-dev      # 삭제

# 데이터 백업
docker exec neo4j-dev neo4j-admin dump --to=/data/backup.dump`,
            hints: [
              'Docker가 실행 중인지 확인하세요 (docker ps)',
              '포트 충돌 시 -p 7475:7474로 변경',
              '비밀번호는 8자 이상이어야 합니다',
              '로그에서 Started. 메시지 확인'
            ]
          }
        },
        {
          id: 'setup-quiz',
          type: 'quiz',
          title: 'Neo4j 설정 퀴즈 (포트, 인증)',
          duration: 5,
          content: {
            objectives: [
              'Neo4j 기본 설정을 확인한다'
            ],
            questions: [
              {
                question: 'Neo4j Browser에 접속하기 위한 기본 포트는?',
                options: ['3000', '7474', '7687', '8080'],
                answer: 1,
                explanation: '7474는 HTTP 포트로 Browser UI에 접속할 때 사용합니다. 7687은 Bolt 프로토콜 포트입니다.'
              },
              {
                question: 'Neo4j 드라이버가 연결할 때 사용하는 Bolt 프로토콜의 기본 포트는?',
                options: ['7474', '7687', '443', '5432'],
                answer: 1,
                explanation: 'Bolt 프로토콜은 7687 포트를 사용합니다. 애플리케이션 드라이버가 이 포트로 연결합니다.'
              },
              {
                question: 'Neo4j Docker 컨테이너의 초기 인증 정보는?',
                options: [
                  'admin / admin',
                  'neo4j / neo4j',
                  'root / password',
                  '인증 없음'
                ],
                answer: 1,
                explanation: '기본 사용자는 neo4j이고, 초기 비밀번호도 neo4j입니다. 첫 로그인 시 변경해야 합니다.'
              },
              {
                question: 'Docker에서 Neo4j 데이터를 영속화하려면 어느 디렉토리를 마운트해야 할까요?',
                options: ['/var/neo4j', '/data', '/db', '/neo4j/storage'],
                answer: 1,
                explanation: '/data 디렉토리에 Neo4j의 모든 데이터베이스 파일이 저장됩니다.'
              }
            ]
          }
        },
        {
          id: 'neo4j-browser-video',
          type: 'video',
          title: 'Neo4j Browser 인터페이스 탐색',
          duration: 10,
          content: {
            objectives: [
              'Neo4j Browser의 주요 기능을 파악한다',
              '쿼리 실행 및 결과 확인 방법을 익힌다',
              '시각화 옵션을 활용할 수 있다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=placeholder',
            transcript: `
## Neo4j Browser 인터페이스 탐색

### Browser 접속

\`\`\`
URL: http://localhost:7474
또는 Aura: https://xxxxx.databases.neo4j.io/browser/
\`\`\`

### 화면 구성

\`\`\`
┌─────────────────────────────────────────┐
│  [★ Favorites] [📚 Docs] [⚙️ Settings] │ ← 상단 메뉴
├─────────────────────────────────────────┤
│  $ MATCH (n) RETURN n                   │ ← 에디터
│  [▶ Run]                                │
├─────────────────────────────────────────┤
│  ┌────┐    ┌────┐                       │
│  │ A  │───│ B  │                        │ ← 결과 (그래프)
│  └────┘    └────┘                       │
│                                         │
│  [Graph] [Table] [Text] [Code]          │ ← 뷰 전환
└─────────────────────────────────────────┘
\`\`\`

### 주요 기능

#### 1. 에디터 (쿼리 입력)

**단축키:**
- \`Ctrl+Enter\`: 쿼리 실행
- \`Ctrl+/\`: 주석 토글
- \`Ctrl+Shift+Up/Down\`: 이전/다음 쿼리

**자동완성:**
- 노드 레이블
- 관계 타입
- 속성명
- Cypher 키워드

#### 2. 결과 뷰

**Graph View:**
- 노드/관계 시각화
- 드래그로 배치 조정
- 더블클릭으로 확장
- 노드 클릭 → 상세 정보

**Table View:**
- 행/열 형태 결과
- CSV 내보내기 가능

**Text View:**
- 텍스트 형태 결과
- 복사하기 편함

**Code View:**
- 실행된 Cypher 확인
- 쿼리 공유용

#### 3. 사이드바

**Favorites (★):**
- 자주 쓰는 쿼리 저장
- 폴더로 구성 가능

**Database Info:**
- 노드/관계 통계
- 레이블/타입 목록
- 인덱스 정보

#### 4. 스타일링

노드를 클릭하고 하단 패널에서:
- **색상** 변경
- **크기** 조정
- **캡션** (표시할 속성) 선택

### 유용한 명령어

\`\`\`cypher
// 데이터베이스 정보
:sysinfo

// 스키마 확인
CALL db.schema.visualization()

// 모든 레이블 보기
CALL db.labels()

// 모든 관계 타입 보기
CALL db.relationshipTypes()

// 도움말
:help
:help cypher
:help match
\`\`\`

### 가이드 튜토리얼

\`\`\`
:play start        // 시작 가이드
:play cypher       // Cypher 기초
:play movies       // 영화 데이터셋 튜토리얼
:play northwind    // Northwind 데이터셋
\`\`\`

다음 강의에서 직접 노드를 만들어 봅시다!
            `,
            keyPoints: [
              'Ctrl+Enter로 쿼리 실행',
              'Graph/Table/Text 뷰로 결과 확인',
              'Favorites에 자주 쓰는 쿼리 저장',
              ':play 명령으로 튜토리얼 실행 가능'
            ]
          }
        },
        {
          id: 'first-node-code',
          type: 'code',
          title: '첫 번째 노드와 관계 생성 (Hello Graph)',
          duration: 15,
          content: {
            objectives: [
              'CREATE로 노드를 생성할 수 있다',
              '관계를 생성하고 연결할 수 있다',
              'MATCH로 생성된 데이터를 확인할 수 있다'
            ],
            instructions: `
# Hello Graph! 첫 노드와 관계 만들기

## 목표

간단한 소셜 네트워크를 만들어 봅시다:
- Alice, Bob 두 사람 생성
- KNOWS 관계로 연결
- 결과 확인

## 순서

1. 첫 번째 노드 생성
2. 두 번째 노드 생성
3. 관계 생성
4. 데이터 확인
5. 데이터 정리
            `,
            starterCode: `// 1. 첫 번째 Person 노드 생성
CREATE (alice:Person {name: 'Alice', age: 30})
RETURN alice

// 2. 두 번째 Person 노드 생성
// TODO: Bob (age: 28) 노드를 생성하세요


// 3. 두 노드를 KNOWS 관계로 연결
// TODO: Alice -> KNOWS -> Bob 관계를 만드세요
// 힌트: MATCH로 노드를 찾고 CREATE로 관계 생성


// 4. 모든 데이터 확인
// TODO: Person 노드와 KNOWS 관계 모두 조회


// 5. (선택) 데이터 삭제
// MATCH (n:Person) DETACH DELETE n`,
            solutionCode: `// 1. 첫 번째 Person 노드 생성
CREATE (alice:Person {name: 'Alice', age: 30})
RETURN alice

// 2. 두 번째 Person 노드 생성
CREATE (bob:Person {name: 'Bob', age: 28})
RETURN bob

// 3. 두 노드를 KNOWS 관계로 연결
MATCH (a:Person {name: 'Alice'}), (b:Person {name: 'Bob'})
CREATE (a)-[r:KNOWS {since: 2020}]->(b)
RETURN a, r, b

// 4. 모든 데이터 확인
MATCH (p:Person)-[r:KNOWS]->(friend)
RETURN p, r, friend

// 또는 전체 그래프 보기
MATCH (n) RETURN n

// 5. 데이터 삭제 (필요시)
// MATCH (n:Person) DETACH DELETE n`,
            hints: [
              'CREATE (변수:레이블 {속성: 값})',
              'MATCH로 기존 노드를 찾은 후 CREATE로 관계 생성',
              '관계도 속성을 가질 수 있음: [:KNOWS {since: 2020}]',
              'DETACH DELETE는 노드와 연결된 관계를 함께 삭제'
            ]
          }
        },
        {
          id: 'aura-free-code',
          type: 'code',
          title: 'Neo4j Aura Free 계정 생성 (클라우드 옵션)',
          duration: 15,
          content: {
            objectives: [
              'Neo4j Aura Free 계정을 생성할 수 있다',
              '클라우드 인스턴스에 접속할 수 있다',
              'Aura와 로컬 환경의 차이를 이해한다'
            ],
            instructions: `
# Neo4j Aura Free 설정하기

## Aura Free란?

- **무료** 클라우드 Neo4j 인스턴스
- 50,000 노드, 175,000 관계 제한
- 설치 없이 브라우저에서 바로 사용
- 학습용으로 충분한 용량

## 계정 생성 단계

### 1. 가입

1. https://neo4j.com/cloud/aura-free/ 접속
2. "Start Free" 클릭
3. Google/GitHub/이메일로 가입

### 2. 인스턴스 생성

1. "New Instance" 클릭
2. 설정:
   - Name: \`fde-academy\`
   - Region: \`asia-southeast1\` (싱가포르, 가장 가까움)
   - Type: Free (자동 선택)
3. "Create" 클릭

### 3. 연결 정보 저장

⚠️ **중요**: 생성 시 표시되는 비밀번호를 반드시 저장!

\`\`\`
Connection URI: neo4j+s://xxxxx.databases.neo4j.io
Username: neo4j
Password: (생성 시 표시됨)
\`\`\`

### 4. 접속

- "Open" 버튼 클릭 → Browser 열림
- 또는 직접 접속: https://xxxxx.databases.neo4j.io/browser/

## 연결 테스트
            `,
            starterCode: `// Neo4j Aura에서 실행

// 1. 연결 테스트
RETURN 'Hello, Aura!' AS message

// 2. 데이터베이스 정보
CALL dbms.components() YIELD name, versions, edition
RETURN name, versions, edition

// 3. 간단한 노드 생성
CREATE (test:Test {message: 'Aura works!', created: datetime()})
RETURN test

// 4. 확인 후 삭제
MATCH (t:Test) RETURN t
// MATCH (t:Test) DELETE t

// 5. Python/Node.js 연결 코드 확인
// Aura 대시보드 → Instance → Connect → Drivers`,
            solutionCode: `// Aura 연결 후 영화 데이터셋 로드

// 1. 영화 가이드 시작
:play movies

// 2. 가이드에서 데이터 로드 (복사해서 실행)
// CREATE 문이 자동 생성됨

// 3. 데이터 확인
MATCH (m:Movie) RETURN m LIMIT 5

MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
RETURN p.name, m.title LIMIT 10

// 4. Tom Hanks 출연작
MATCH (tom:Person {name: 'Tom Hanks'})-[:ACTED_IN]->(movie)
RETURN movie.title

// 5. 같이 출연한 배우
MATCH (tom:Person {name: 'Tom Hanks'})-[:ACTED_IN]->(m)<-[:ACTED_IN]-(coActor)
RETURN coActor.name, count(*) AS movies
ORDER BY movies DESC`,
            hints: [
              '비밀번호는 생성 시 한 번만 표시됨 (반드시 저장!)',
              'Free 티어는 일정 시간 미사용 시 일시 중지됨',
              ':play movies로 샘플 데이터 로드 가능',
              'Bolt URI는 neo4j+s:// (TLS 암호화)'
            ]
          }
        },
        {
          id: 'browser-quiz',
          type: 'quiz',
          title: 'Neo4j Browser 기능 퀴즈',
          duration: 5,
          content: {
            objectives: [
              'Neo4j Browser 사용법을 확인한다'
            ],
            questions: [
              {
                question: 'Neo4j Browser에서 쿼리를 실행하는 단축키는?',
                options: ['Enter', 'Ctrl+Enter', 'Shift+Enter', 'F5'],
                answer: 1,
                explanation: 'Ctrl+Enter (Mac: Cmd+Enter)로 에디터의 쿼리를 실행합니다.'
              },
              {
                question: ':play movies 명령어의 기능은?',
                options: [
                  '영화 목록을 출력',
                  '영화 데이터셋 튜토리얼을 실행',
                  '영화 그래프를 시각화',
                  '영화 데이터를 삭제'
                ],
                answer: 1,
                explanation: ':play 명령어는 내장 튜토리얼 가이드를 실행합니다. movies는 대표적인 샘플 데이터셋입니다.'
              },
              {
                question: 'Neo4j Browser에서 쿼리 결과를 표시하는 뷰가 아닌 것은?',
                options: ['Graph', 'Table', 'Text', 'JSON'],
                answer: 3,
                explanation: 'Browser는 Graph, Table, Text, Code 뷰를 제공합니다. JSON 뷰는 없습니다.'
              },
              {
                question: '자주 사용하는 쿼리를 저장하는 기능은?',
                options: ['Bookmarks', 'Favorites', 'History', 'Snippets'],
                answer: 1,
                explanation: 'Favorites(★)에 쿼리를 저장하고 폴더로 구성할 수 있습니다.'
              }
            ]
          }
        },
        {
          id: 'memgraph-setup-code',
          type: 'code',
          title: '(선택) Memgraph 설치 및 Lab 접속',
          duration: 15,
          content: {
            objectives: [
              'Memgraph를 Docker로 설치할 수 있다',
              'Memgraph Lab에 접속할 수 있다',
              'Neo4j와의 호환성을 확인한다'
            ],
            instructions: `
# Memgraph 설치 (선택 사항)

## 왜 Memgraph도 알아야 할까?

- **Cypher 호환**: Neo4j에서 배운 쿼리 그대로 사용
- **인메모리**: 실시간 분석에 강점
- **무료 버전 강력**: 기능 제한 거의 없음
- **스트리밍 통합**: Kafka 직접 연결

## 설치 및 실행

Docker로 Memgraph + Memgraph Lab을 함께 실행합니다.
            `,
            starterCode: `# Memgraph + Memgraph Lab 실행

# 1. Memgraph Platform (DB + Lab 포함)
docker run -it -p 7687:7687 -p 3000:3000 \\
  --name memgraph-platform \\
  memgraph/memgraph-platform

# 포트:
# 7687 - Bolt (쿼리 연결)
# 3000 - Memgraph Lab (웹 UI)

# 2. Memgraph Lab 접속
# http://localhost:3000

# 3. Quick Connect (기본 설정)
# Host: localhost
# Port: 7687
# (인증 없음)

# 4. Cypher 테스트 (Neo4j와 동일!)
# CREATE (n:Test {message: 'Hello Memgraph!'})
# MATCH (n) RETURN n`,
            solutionCode: `# 영속화 버전 (데이터 유지)

# 데이터 디렉토리 생성
mkdir -p ~/memgraph/data ~/memgraph/log

# 영속화 포함 실행
docker run -d \\
  --name memgraph-dev \\
  -p 7688:7687 \\
  -p 3001:3000 \\
  -v ~/memgraph/data:/var/lib/memgraph \\
  -v ~/memgraph/log:/var/log/memgraph \\
  memgraph/memgraph-platform

# 접속: http://localhost:3001
# Bolt: localhost:7688

# Neo4j와 Memgraph 동시 실행 시 포트 구분:
# Neo4j: 7687, 7474
# Memgraph: 7688, 3001

# Cypher 호환성 테스트
CREATE (alice:Person {name: 'Alice', age: 30})
CREATE (bob:Person {name: 'Bob', age: 28})
MATCH (a:Person {name: 'Alice'}), (b:Person {name: 'Bob'})
CREATE (a)-[:KNOWS {since: 2020}]->(b)
RETURN a, b`,
            hints: [
              'Neo4j와 동시에 실행하려면 포트를 다르게 설정',
              'Memgraph Lab은 Neo4j Browser와 유사한 UI',
              'Cypher 쿼리는 대부분 호환됨',
              '인메모리이므로 컨테이너 재시작 시 데이터 손실 (볼륨 마운트 필요)'
            ]
          }
        },
        {
          id: 'env-comparison-reading',
          type: 'reading',
          title: '로컬 vs 클라우드 환경 선택 가이드',
          duration: 10,
          content: {
            objectives: [
              '로컬과 클라우드 환경의 장단점을 비교한다',
              '상황에 맞는 환경을 선택할 수 있다'
            ],
            markdown: `
# 로컬 vs 클라우드 환경 선택 가이드

## 비교표

| 항목 | 로컬 (Docker) | 클라우드 (Aura) |
|-----|--------------|----------------|
| 설치 | Docker 필요 | 설치 없음 |
| 비용 | 무료 | 무료 (Free 티어) |
| 성능 | PC 사양에 의존 | 일정함 |
| 용량 | 무제한 | 50K 노드 제한 |
| 접속 | localhost만 | 어디서든 |
| 협업 | 어려움 | 쉬움 |
| 오프라인 | 가능 | 불가능 |
| 관리 | 직접 | 자동 |

## 상황별 추천

### 로컬 (Docker) 선택

\`\`\`
✅ 추천 상황:
- 오프라인에서 학습하고 싶을 때
- 대용량 데이터 실험
- Docker 사용에 익숙할 때
- 비용 0원 유지 필수
- CI/CD 파이프라인 구축 시

❌ 피해야 할 상황:
- Docker 설치가 어려운 환경 (회사 PC 등)
- 다른 기기에서도 접속 필요
- 팀 협업 프로젝트
\`\`\`

### 클라우드 (Aura Free) 선택

\`\`\`
✅ 추천 상황:
- 설치 없이 바로 시작하고 싶을 때
- 여러 기기에서 접속 필요
- 팀원과 같은 데이터 공유
- 프로덕션 환경과 유사한 경험

❌ 피해야 할 상황:
- 50K 노드 이상 데이터
- 오프라인 환경
- 민감한 데이터
\`\`\`

## FDE Academy 권장 설정

**두 환경 모두 설정하세요!**

\`\`\`
일상 학습 → Aura Free
- 어디서든 접속
- 설정 신경 쓸 필요 없음

실험/대용량 → Docker
- 제한 없는 데이터
- 플러그인(APOC, GDS) 설치
- 오프라인 작업
\`\`\`

## 환경 전환 팁

### 1. 쿼리는 동일

두 환경 모두 Cypher 쿼리가 동일하게 작동합니다.

### 2. 연결 문자열만 변경

\`\`\`javascript
// 로컬
const driver = neo4j.driver('bolt://localhost:7687', auth)

// Aura
const driver = neo4j.driver('neo4j+s://xxx.databases.neo4j.io', auth)
\`\`\`

### 3. 데이터 마이그레이션

\`\`\`bash
# 로컬 → Aura (작은 데이터)
# APOC 사용하여 JSON 내보내기/가져오기

# 대용량
# neo4j-admin dump/load
\`\`\`

## 체크리스트

학습을 시작하기 전 확인:

- [ ] Docker Neo4j 실행됨 (localhost:7474)
- [ ] Aura Free 계정 생성됨
- [ ] 두 환경 모두 접속 가능
- [ ] 각 환경에서 CREATE/MATCH 테스트 완료
            `,
            keyPoints: [
              '로컬: 무제한 용량, 오프라인 가능, 관리 필요',
              '클라우드: 설치 없음, 어디서든 접속, 용량 제한',
              '두 환경 모두 설정해두면 유연하게 사용 가능',
              'Cypher 쿼리는 양쪽 환경에서 동일하게 작동'
            ]
          }
        }
      ],
      challenge: {
        id: 'multi-env-challenge',
        type: 'challenge',
        title: '다중 환경 설정 챌린지',
        duration: 30,
        description: 'Docker Neo4j + Aura Free 모두 설정하고 연결 테스트',
        content: {
          objectives: [
            '로컬과 클라우드 환경을 모두 설정한다',
            '각 환경에서 데이터를 생성하고 확인한다'
          ],
          requirements: [
            'Docker로 Neo4j 컨테이너 실행 (포트 7474, 7687)',
            'Neo4j Aura Free 계정 생성 및 인스턴스 생성',
            '두 환경 모두에서 동일한 테스트 데이터 생성',
            '각 환경에서 MATCH 쿼리로 데이터 확인',
            '스크린샷 또는 쿼리 결과 캡처'
          ],
          evaluationCriteria: [
            'Docker Neo4j 정상 실행 (30%)',
            'Aura Free 인스턴스 생성 완료 (30%)',
            '두 환경에서 동일한 쿼리 실행 성공 (30%)',
            '결과 문서화 (10%)'
          ],
          bonusPoints: [
            'Memgraph도 추가로 설정',
            'Python/Node.js 드라이버로 연결 테스트',
            '환경별 성능 비교 (간단한 쿼리 시간 측정)'
          ],
          instructions: `
# 다중 환경 설정 챌린지

## 제출물

1. **Docker Neo4j**
   - \`docker ps\` 결과 스크린샷
   - Browser 접속 화면 (localhost:7474)
   - 테스트 쿼리 실행 결과

2. **Aura Free**
   - Aura 대시보드 스크린샷
   - Browser 접속 화면
   - 동일한 테스트 쿼리 실행 결과

3. **테스트 쿼리**

\`\`\`cypher
// 두 환경 모두에서 실행
CREATE (me:Person {name: '내 이름', enrolled: datetime()})
CREATE (course:Course {name: 'FDE Academy', phase: 3})
CREATE (me)-[:ENROLLED_IN]->(course)
RETURN me, course
\`\`\`

## 보너스

Memgraph 설정 또는 드라이버 연결 코드 작성 시 추가 점수!
          `
        }
      }
    },
    {
      slug: 'cypher-crud',
      title: 'Cypher 기초 CRUD',
      totalDuration: 160,
      tasks: [
        {
          id: 'cypher-intro-video',
          type: 'video',
          title: 'Cypher 언어 소개 (ASCII Art 패턴)',
          duration: 15,
          content: {
            objectives: [
              'Cypher 언어의 탄생 배경과 설계 철학 이해',
              'ASCII Art 패턴 문법의 직관적 표현 방식 학습',
              'SQL과 Cypher의 핵심 차이점 파악'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=placeholder-cypher-intro',
            transcript: `
## Cypher 언어란?

Cypher는 Neo4j가 개발한 **선언적(declarative) 그래프 쿼리 언어**입니다. 2011년에 처음 등장하여 현재는 openCypher 프로젝트를 통해 표준화가 진행 중입니다.

### ASCII Art 패턴의 마법

Cypher의 가장 독특한 특징은 **ASCII Art 패턴** 문법입니다:

\`\`\`
(alice)-[:KNOWS]->(bob)
\`\`\`

이 한 줄이 "Alice가 Bob을 안다"라는 관계를 표현합니다!

### 문법 요소 분해

\`\`\`
노드:     ( )
관계:     -[ ]->
레이블:   :Person
속성:     {name: 'Alice'}
\`\`\`

실제 예시:
\`\`\`cypher
// Alice라는 Person 노드
(alice:Person {name: 'Alice'})

// alice -> bob 방향의 KNOWS 관계
(alice)-[:KNOWS {since: 2020}]->(bob)
\`\`\`

### SQL vs Cypher 비교

**"3촌 이내 친구 찾기" 쿼리:**

SQL (JOIN 지옥):
\`\`\`sql
SELECT DISTINCT f3.name
FROM friends f1
JOIN friends f2 ON f1.friend_id = f2.person_id
JOIN friends f3 ON f2.friend_id = f3.person_id
WHERE f1.person_id = 1
  AND f3.person_id != 1
\`\`\`

Cypher (직관적):
\`\`\`cypher
MATCH (p:Person {id: 1})-[:KNOWS*1..3]-(friend)
WHERE friend <> p
RETURN DISTINCT friend.name
\`\`\`

### Cypher 키워드 카테고리

| 카테고리 | 키워드 | 용도 |
|---------|--------|------|
| 읽기 | MATCH | 패턴 매칭 |
| 생성 | CREATE | 노드/관계 생성 |
| 수정 | SET, REMOVE | 속성 변경 |
| 삭제 | DELETE | 노드/관계 삭제 |
| 필터 | WHERE | 조건 필터링 |
| 반환 | RETURN | 결과 반환 |

### 왜 Cypher인가?

1. **가독성**: 그래프 구조가 코드에 그대로 보임
2. **생산성**: SQL 대비 코드량 70-80% 감소
3. **표현력**: 복잡한 경로 탐색을 자연스럽게 표현
4. **표준화**: openCypher로 벤더 종속 최소화

다음 강의에서는 Cypher 공식 문서를 통해 CREATE와 MATCH의 상세 문법을 학습합니다.
            `,
            keyPoints: [
              'Cypher = Neo4j의 선언적 그래프 쿼리 언어',
              'ASCII Art 패턴: (노드)-[:관계]->(노드)',
              'SQL JOIN vs Cypher 패턴 매칭: 코드량 70-80% 감소'
            ]
          }
        },
        {
          id: 'cypher-docs-reading',
          type: 'reading',
          title: 'Cypher 공식 문서: CREATE, MATCH 기초',
          duration: 10,
          content: {
            objectives: [
              'CREATE 문의 기본 문법 숙지',
              'MATCH 문의 패턴 매칭 원리 이해',
              'RETURN 절의 다양한 활용법 학습'
            ],
            markdown: `
## Cypher 핵심 문법 가이드

### 1. CREATE - 노드와 관계 생성

#### 노드 생성

\`\`\`cypher
// 기본 노드
CREATE (n)

// 레이블 있는 노드
CREATE (n:Person)

// 속성이 있는 노드
CREATE (n:Person {name: 'Alice', age: 30})

// 여러 레이블
CREATE (n:Person:Employee)
\`\`\`

#### 관계 생성

\`\`\`cypher
// 두 노드와 관계를 한번에
CREATE (a:Person {name: 'Alice'})-[:KNOWS]->(b:Person {name: 'Bob'})

// 기존 노드에 관계 추가
MATCH (a:Person {name: 'Alice'}), (b:Person {name: 'Bob'})
CREATE (a)-[:KNOWS {since: 2020}]->(b)
\`\`\`

### 2. MATCH - 패턴 매칭

#### 기본 매칭

\`\`\`cypher
// 모든 노드
MATCH (n) RETURN n

// 특정 레이블
MATCH (p:Person) RETURN p

// 속성으로 필터
MATCH (p:Person {name: 'Alice'}) RETURN p
\`\`\`

#### 관계 매칭

\`\`\`cypher
// 나가는 관계
MATCH (a)-[:KNOWS]->(b) RETURN a, b

// 들어오는 관계
MATCH (a)<-[:KNOWS]-(b) RETURN a, b

// 양방향 관계
MATCH (a)-[:KNOWS]-(b) RETURN a, b
\`\`\`

### 3. RETURN - 결과 반환

\`\`\`cypher
// 전체 노드
RETURN n

// 특정 속성
RETURN n.name, n.age

// 별칭 사용
RETURN n.name AS personName

// 여러 값
RETURN a.name, b.name, type(r) AS relationshipType
\`\`\`

### 실습 준비 체크리스트

- [ ] Neo4j Browser 접속 확인
- [ ] 빈 데이터베이스 또는 새 데이터베이스 선택
- [ ] Cypher 쿼리 입력창 확인
            `,
            externalLinks: [
              { title: 'Neo4j Cypher Manual', url: 'https://neo4j.com/docs/cypher-manual/current/' },
              { title: 'Cypher Refcard (치트시트)', url: 'https://neo4j.com/docs/cypher-refcard/current/' }
            ],
            keyPoints: [
              'CREATE: 노드(n:Label {props}), 관계 -[:TYPE {props}]->',
              'MATCH: 패턴 매칭으로 기존 데이터 조회',
              'RETURN: 결과 반환, AS로 별칭 지정 가능'
            ]
          }
        },
        {
          id: 'create-nodes-code',
          type: 'code',
          title: 'CREATE로 노드 생성 (Person, Company)',
          duration: 15,
          content: {
            objectives: [
              '다양한 레이블의 노드 생성 실습',
              '속성(properties) 설정 방법 익히기',
              '생성된 노드 확인 방법 학습'
            ],
            instructions: `
## 노드 생성 실습

이번 실습에서는 Person과 Company 노드를 생성합니다.

### Step 1: Person 노드 생성

Neo4j Browser에서 다음 쿼리를 실행하세요:

\`\`\`cypher
CREATE (alice:Person {
  name: 'Alice Kim',
  age: 28,
  city: 'Seoul',
  skills: ['Python', 'SQL', 'Cypher']
})
RETURN alice
\`\`\`

### Step 2: 여러 Person 노드 한번에 생성

\`\`\`cypher
CREATE
  (bob:Person {name: 'Bob Lee', age: 32, city: 'Busan'}),
  (carol:Person {name: 'Carol Park', age: 25, city: 'Seoul'}),
  (david:Person {name: 'David Choi', age: 35, city: 'Daegu'})
RETURN bob, carol, david
\`\`\`

### Step 3: Company 노드 생성

\`\`\`cypher
CREATE (neo4j:Company {
  name: 'Neo4j Inc.',
  founded: 2007,
  headquarters: 'San Mateo, CA',
  industry: 'Database'
})
RETURN neo4j
\`\`\`

### Step 4: 생성된 노드 확인

\`\`\`cypher
// 모든 Person 노드
MATCH (p:Person) RETURN p

// 모든 Company 노드
MATCH (c:Company) RETURN c

// 노드 개수 확인
MATCH (n) RETURN labels(n), count(n)
\`\`\`

### 확인 사항

- [ ] Alice, Bob, Carol, David 4명의 Person 노드 생성됨
- [ ] Neo4j Inc. Company 노드 생성됨
- [ ] 각 노드의 속성이 올바르게 설정됨
            `,
            starterCode: `// 여기에 Person 노드를 생성하세요
// 이름: 'Eve Jung', 나이: 29, 도시: 'Incheon'

CREATE (eve:Person {
  // 속성을 채워주세요
})
RETURN eve`,
            solutionCode: `// Person 노드 생성
CREATE (eve:Person {
  name: 'Eve Jung',
  age: 29,
  city: 'Incheon'
})
RETURN eve`,
            hints: [
              'CREATE 다음에 (변수:레이블 {속성들}) 형식을 사용합니다',
              '문자열은 작은따옴표로 감싸세요',
              'RETURN으로 생성된 노드를 확인할 수 있습니다'
            ],
            keyPoints: [
              'CREATE (변수:Label {key: value})',
              '여러 노드: CREATE (a:L1), (b:L2)',
              '배열 속성: skills: [\"a\", \"b\"]'
            ]
          }
        },
        {
          id: 'create-quiz',
          type: 'quiz',
          title: 'CREATE 문법 퀴즈',
          duration: 5,
          content: {
            questions: [
              {
                question: 'Person 레이블과 name 속성을 가진 노드를 생성하는 올바른 Cypher는?',
                options: [
                  'CREATE (p:Person {name: "Alice"})',
                  'INSERT INTO Person (name) VALUES ("Alice")',
                  'CREATE Person SET name = "Alice"',
                  'NEW (p:Person {name: "Alice"})'
                ],
                answer: 0,
                explanation: 'Cypher에서 노드 생성은 CREATE (변수:레이블 {속성}) 형식입니다.'
              },
              {
                question: '다음 중 올바르지 않은 CREATE 문은?',
                options: [
                  'CREATE (n)',
                  'CREATE (n:Person)',
                  'CREATE (n:Person:Employee)',
                  'CREATE n:Person'
                ],
                answer: 3,
                explanation: '노드는 반드시 괄호 ()로 감싸야 합니다. CREATE (n:Person)이 올바른 형식입니다.'
              },
              {
                question: '배열 타입 속성을 포함한 노드 생성 시 올바른 문법은?',
                options: [
                  'CREATE (n {tags: ["a", "b"]})',
                  'CREATE (n {tags: ARRAY("a", "b")})',
                  'CREATE (n {tags: LIST("a", "b")})',
                  'CREATE (n {tags: {"a", "b"}})'
                ],
                answer: 0,
                explanation: 'Cypher에서 배열은 대괄호 []를 사용합니다.'
              }
            ]
          }
        },
        {
          id: 'create-rels-video',
          type: 'video',
          title: 'CREATE로 관계 생성 (KNOWS, WORKS_AT)',
          duration: 10,
          content: {
            objectives: [
              '관계 생성의 방향성 이해',
              '관계 타입과 속성 설정 방법',
              'MATCH + CREATE 조합 패턴 학습'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=placeholder-create-rels',
            transcript: `
## 관계(Relationship) 생성하기

### 관계의 기본 구조

\`\`\`
(시작노드)-[:관계타입 {속성}]->(끝노드)
\`\`\`

**핵심 포인트:**
- 관계는 **항상 방향**이 있습니다
- 관계 타입은 대문자_언더스코어 컨벤션 (예: WORKS_AT)
- 관계도 속성을 가질 수 있습니다

### 방법 1: 노드와 함께 생성

\`\`\`cypher
CREATE (alice:Person {name: 'Alice'})
       -[:KNOWS {since: 2020}]->
       (bob:Person {name: 'Bob'})
RETURN alice, bob
\`\`\`

### 방법 2: 기존 노드에 관계 추가 (MATCH + CREATE)

\`\`\`cypher
// 먼저 노드 찾기
MATCH (alice:Person {name: 'Alice Kim'})
MATCH (neo4j:Company {name: 'Neo4j Inc.'})
// 관계 생성
CREATE (alice)-[:WORKS_AT {role: 'Engineer', since: 2023}]->(neo4j)
RETURN alice, neo4j
\`\`\`

### 자주 사용하는 관계 타입

| 관계 타입 | 의미 | 예시 |
|----------|------|------|
| KNOWS | 아는 사이 | 친구, 지인 |
| WORKS_AT | 근무 | 직원-회사 |
| LIVES_IN | 거주 | 사람-도시 |
| FOLLOWS | 팔로우 | SNS 관계 |
| REPORTS_TO | 보고 | 조직도 |

### 관계 생성 시 주의사항

1. **방향 결정**: 비즈니스 로직에 맞는 방향 선택
2. **관계 타입 명명**: 동사형, 대문자, 언더스코어
3. **속성 활용**: since, weight, role 등 메타데이터

### 생성된 관계 확인

\`\`\`cypher
// 특정 관계 타입 조회
MATCH (a)-[r:KNOWS]->(b)
RETURN a.name, type(r), r.since, b.name

// 모든 관계 시각화
MATCH (a)-[r]->(b)
RETURN a, r, b
\`\`\`
            `,
            keyPoints: [
              '관계: -[:TYPE {props}]-> (항상 방향 필요)',
              'MATCH + CREATE: 기존 노드에 관계 추가',
              '관계 명명: 동사형_대문자 (WORKS_AT, KNOWS)'
            ]
          }
        },
        {
          id: 'match-read-code',
          type: 'code',
          title: 'MATCH로 노드/관계 조회',
          duration: 15,
          content: {
            objectives: [
              'MATCH 패턴의 다양한 형태 실습',
              '노드와 관계 함께 조회하기',
              'RETURN으로 원하는 데이터만 추출'
            ],
            instructions: `
## MATCH 조회 실습

### 준비: 샘플 데이터 생성

먼저 테스트용 데이터를 생성합니다:

\`\`\`cypher
CREATE (alice:Person {name: 'Alice', age: 28})
CREATE (bob:Person {name: 'Bob', age: 32})
CREATE (carol:Person {name: 'Carol', age: 25})
CREATE (neo4j:Company {name: 'Neo4j'})
CREATE (alice)-[:KNOWS {since: 2020}]->(bob)
CREATE (bob)-[:KNOWS {since: 2021}]->(carol)
CREATE (alice)-[:WORKS_AT {role: 'Engineer'}]->(neo4j)
CREATE (bob)-[:WORKS_AT {role: 'Manager'}]->(neo4j)
\`\`\`

### Step 1: 기본 노드 조회

\`\`\`cypher
// 모든 Person 노드
MATCH (p:Person)
RETURN p

// 이름이 'Alice'인 Person
MATCH (p:Person {name: 'Alice'})
RETURN p

// 특정 속성만 반환
MATCH (p:Person)
RETURN p.name, p.age
\`\`\`

### Step 2: 관계 패턴 조회

\`\`\`cypher
// Alice가 아는 사람들 (나가는 관계)
MATCH (alice:Person {name: 'Alice'})-[:KNOWS]->(friend)
RETURN friend.name

// Bob을 아는 사람들 (들어오는 관계)
MATCH (bob:Person {name: 'Bob'})<-[:KNOWS]-(person)
RETURN person.name

// 양방향 (방향 무관)
MATCH (bob:Person {name: 'Bob'})-[:KNOWS]-(person)
RETURN person.name
\`\`\`

### Step 3: 관계 정보 포함 조회

\`\`\`cypher
// 관계 변수로 캡처
MATCH (a:Person)-[r:KNOWS]->(b:Person)
RETURN a.name, r.since, b.name

// 관계 타입 확인
MATCH (a)-[r]->(b)
RETURN a.name, type(r), b.name
\`\`\`

### 실습 과제

1. Neo4j 회사에서 일하는 모든 사람을 조회하세요
2. 각 직원의 역할(role)도 함께 표시하세요
            `,
            starterCode: `// Neo4j에서 일하는 사람들과 그들의 역할을 조회하세요
MATCH // 패턴을 완성하세요
RETURN // 결과를 반환하세요`,
            solutionCode: `// Neo4j에서 일하는 사람들과 그들의 역할을 조회
MATCH (p:Person)-[r:WORKS_AT]->(c:Company {name: 'Neo4j'})
RETURN p.name AS employee, r.role AS role, c.name AS company`,
            hints: [
              'WORKS_AT 관계를 사용합니다',
              '관계에 변수 r을 할당하여 r.role에 접근하세요',
              'Company 노드의 name 속성으로 필터링합니다'
            ],
            keyPoints: [
              'MATCH (a)-[:REL]->(b): 패턴 매칭',
              '방향: -> 나가는, <- 들어오는, - 양방향',
              '관계 변수: [r:TYPE]으로 속성 접근'
            ]
          }
        },
        {
          id: 'where-filter-code',
          type: 'code',
          title: 'WHERE 절로 필터링 (조건, 비교 연산자)',
          duration: 15,
          content: {
            objectives: [
              'WHERE 절의 다양한 조건 표현 학습',
              '비교, 논리, 문자열 연산자 활용',
              'NULL 처리와 존재 여부 확인'
            ],
            instructions: `
## WHERE 절 필터링 실습

### 비교 연산자

\`\`\`cypher
// 나이 30 이상
MATCH (p:Person)
WHERE p.age >= 30
RETURN p.name, p.age

// 나이 범위
MATCH (p:Person)
WHERE p.age >= 25 AND p.age <= 35
RETURN p.name, p.age
\`\`\`

### 문자열 연산자

\`\`\`cypher
// STARTS WITH
MATCH (p:Person)
WHERE p.name STARTS WITH 'A'
RETURN p.name

// CONTAINS
MATCH (p:Person)
WHERE p.name CONTAINS 'ob'
RETURN p.name

// 정규표현식 (대소문자 무시)
MATCH (p:Person)
WHERE p.name =~ '(?i)alice.*'
RETURN p.name
\`\`\`

### IN 연산자

\`\`\`cypher
// 리스트에 포함
MATCH (p:Person)
WHERE p.name IN ['Alice', 'Bob', 'Carol']
RETURN p.name
\`\`\`

### NULL 처리

\`\`\`cypher
// 속성 존재 여부
MATCH (p:Person)
WHERE p.email IS NOT NULL
RETURN p.name, p.email

// 속성이 없는 노드
MATCH (p:Person)
WHERE p.email IS NULL
RETURN p.name
\`\`\`

### 논리 연산자 조합

\`\`\`cypher
// AND, OR, NOT 조합
MATCH (p:Person)
WHERE (p.age > 25 AND p.city = 'Seoul')
   OR (p.age < 30 AND p.city = 'Busan')
RETURN p.name, p.age, p.city
\`\`\`

### 실습 과제

서울에 살고 나이가 27세 이상인 Person을 찾아 이름과 나이를 반환하세요.
            `,
            starterCode: `// 서울에 살고 나이 27세 이상인 Person 조회
MATCH (p:Person)
WHERE // 조건을 작성하세요
RETURN p.name, p.age`,
            solutionCode: `// 서울에 살고 나이 27세 이상인 Person 조회
MATCH (p:Person)
WHERE p.city = 'Seoul' AND p.age >= 27
RETURN p.name, p.age`,
            hints: [
              'AND로 두 조건을 연결하세요',
              '문자열 비교는 = 연산자 사용',
              '숫자 비교는 >= 연산자 사용'
            ],
            keyPoints: [
              '비교: =, <>, <, >, <=, >=',
              '문자열: STARTS WITH, CONTAINS, =~',
              '논리: AND, OR, NOT, IN, IS NULL'
            ]
          }
        },
        {
          id: 'read-quiz',
          type: 'quiz',
          title: 'MATCH/WHERE 퀴즈',
          duration: 5,
          content: {
            questions: [
              {
                question: 'Alice가 아는(KNOWS) 모든 사람을 찾는 올바른 쿼리는?',
                options: [
                  'MATCH (a:Person {name: "Alice"})-[:KNOWS]->(b) RETURN b',
                  'SELECT * FROM Person WHERE knows = "Alice"',
                  'MATCH (a:Person)-[:KNOWS]-(b) WHERE a = "Alice" RETURN b',
                  'FIND Person KNOWS Person WHERE name = "Alice"'
                ],
                answer: 0,
                explanation: 'Cypher에서 나가는 관계는 -[:REL]-> 형식으로 표현합니다.'
              },
              {
                question: '나이가 30 이상이고 서울에 사는 Person을 찾는 WHERE 절은?',
                options: [
                  'WHERE p.age >= 30 AND p.city = "Seoul"',
                  'WHERE p.age >= 30, p.city = "Seoul"',
                  'WHERE age >= 30 && city == "Seoul"',
                  'WHERE p.age >= 30 & p.city = "Seoul"'
                ],
                answer: 0,
                explanation: 'Cypher는 AND로 조건을 연결하고, 문자열 비교는 = 연산자를 사용합니다.'
              },
              {
                question: '이름이 "A"로 시작하는 Person을 찾는 WHERE 절은?',
                options: [
                  'WHERE p.name STARTS WITH "A"',
                  'WHERE p.name LIKE "A%"',
                  'WHERE p.name.startsWith("A")',
                  'WHERE LEFT(p.name, 1) = "A"'
                ],
                answer: 0,
                explanation: 'Cypher는 STARTS WITH 키워드를 사용합니다 (SQL의 LIKE와 다름).'
              }
            ]
          }
        },
        {
          id: 'update-set-video',
          type: 'video',
          title: 'SET으로 속성 업데이트',
          duration: 10,
          content: {
            objectives: [
              'SET 문의 다양한 사용법 이해',
              '속성 추가, 수정, 복사 방법 학습',
              'REMOVE로 속성 삭제하기'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=placeholder-set-update',
            transcript: `
## SET으로 데이터 업데이트

### 기본 속성 설정

\`\`\`cypher
// 단일 속성 설정
MATCH (p:Person {name: 'Alice'})
SET p.email = 'alice@example.com'
RETURN p

// 여러 속성 동시 설정
MATCH (p:Person {name: 'Alice'})
SET p.email = 'alice@example.com',
    p.phone = '010-1234-5678'
RETURN p
\`\`\`

### 속성 수정 패턴

\`\`\`cypher
// 기존 값 기반 수정
MATCH (p:Person {name: 'Alice'})
SET p.age = p.age + 1
RETURN p.name, p.age

// 조건부 업데이트 (CASE)
MATCH (p:Person)
SET p.status = CASE
  WHEN p.age >= 30 THEN 'Senior'
  ELSE 'Junior'
END
RETURN p.name, p.age, p.status
\`\`\`

### += 연산자 (속성 병합)

\`\`\`cypher
// 기존 속성 유지하며 추가/수정
MATCH (p:Person {name: 'Alice'})
SET p += {city: 'Seoul', department: 'Engineering'}
RETURN p
\`\`\`

### 레이블 추가/수정

\`\`\`cypher
// 레이블 추가
MATCH (p:Person {name: 'Alice'})
SET p:Employee:Manager
RETURN p, labels(p)
\`\`\`

### REMOVE로 속성/레이블 삭제

\`\`\`cypher
// 속성 삭제
MATCH (p:Person {name: 'Alice'})
REMOVE p.phone
RETURN p

// 레이블 삭제
MATCH (p:Person:Manager {name: 'Alice'})
REMOVE p:Manager
RETURN p, labels(p)
\`\`\`

### SET vs REMOVE 비교

| 작업 | 명령어 | 예시 |
|-----|--------|------|
| 속성 추가 | SET | SET p.new = 'value' |
| 속성 수정 | SET | SET p.existing = 'new' |
| 속성 삭제 | REMOVE | REMOVE p.old |
| 레이블 추가 | SET | SET p:NewLabel |
| 레이블 삭제 | REMOVE | REMOVE p:OldLabel |
            `,
            keyPoints: [
              'SET p.prop = value: 속성 추가/수정',
              'SET p += {}: 속성 병합 (기존 유지)',
              'REMOVE p.prop: 속성 삭제'
            ]
          }
        },
        {
          id: 'update-code',
          type: 'code',
          title: 'SET, REMOVE로 노드/관계 수정',
          duration: 15,
          content: {
            objectives: [
              '노드 속성 추가 및 수정 실습',
              '관계 속성 업데이트 실습',
              '레이블 조작 실습'
            ],
            instructions: `
## 속성 수정 실습

### Step 1: 속성 추가

\`\`\`cypher
// Alice에게 이메일 추가
MATCH (p:Person {name: 'Alice'})
SET p.email = 'alice@neo4j.com'
RETURN p
\`\`\`

### Step 2: 여러 속성 동시 수정

\`\`\`cypher
// Bob의 정보 업데이트
MATCH (p:Person {name: 'Bob'})
SET p.age = 33,
    p.title = 'Senior Manager',
    p.department = 'Engineering'
RETURN p
\`\`\`

### Step 3: 관계 속성 수정

\`\`\`cypher
// WORKS_AT 관계의 role 수정
MATCH (p:Person {name: 'Alice'})-[r:WORKS_AT]->(:Company)
SET r.role = 'Senior Engineer',
    r.promoted = date('2024-01-01')
RETURN p.name, r.role, r.promoted
\`\`\`

### Step 4: 레이블 추가

\`\`\`cypher
// Alice에게 Engineer 레이블 추가
MATCH (p:Person {name: 'Alice'})
SET p:Engineer
RETURN p, labels(p)
\`\`\`

### Step 5: 속성 삭제

\`\`\`cypher
// 불필요한 속성 제거
MATCH (p:Person {name: 'Bob'})
REMOVE p.title
RETURN p
\`\`\`

### 실습 과제

Carol의 나이를 26으로 수정하고, city를 'Incheon'으로 변경하세요.
            `,
            starterCode: `// Carol의 나이를 26으로, city를 'Incheon'으로 수정
MATCH (p:Person {name: 'Carol'})
// SET 절을 작성하세요
RETURN p`,
            solutionCode: `// Carol의 나이를 26으로, city를 'Incheon'으로 수정
MATCH (p:Person {name: 'Carol'})
SET p.age = 26, p.city = 'Incheon'
RETURN p`,
            hints: [
              'SET 다음에 속성을 쉼표로 구분하여 나열합니다',
              'p.age = 26으로 숫자 설정',
              'p.city = "Incheon"으로 문자열 설정'
            ],
            keyPoints: [
              'SET p.a = x, p.b = y: 여러 속성 동시 수정',
              'SET p:Label: 레이블 추가',
              'REMOVE p.prop: 속성 삭제'
            ]
          }
        },
        {
          id: 'delete-code',
          type: 'code',
          title: 'DELETE, DETACH DELETE로 삭제',
          duration: 10,
          content: {
            objectives: [
              'DELETE와 DETACH DELETE의 차이 이해',
              '안전한 삭제 패턴 학습',
              '관계만 삭제하는 방법'
            ],
            instructions: `
## 삭제 연산 실습

### DELETE vs DETACH DELETE

- **DELETE**: 관계가 없는 노드만 삭제 가능
- **DETACH DELETE**: 연결된 관계와 함께 노드 삭제

### Step 1: 관계만 삭제

\`\`\`cypher
// 특정 관계 삭제
MATCH (a:Person {name: 'Alice'})-[r:KNOWS]->(b:Person {name: 'Bob'})
DELETE r
RETURN a, b
\`\`\`

### Step 2: 관계 없는 노드 삭제 (DELETE)

\`\`\`cypher
// 먼저 고립된 노드 생성
CREATE (temp:Person {name: 'Temp'})

// 관계 없는 노드 삭제
MATCH (p:Person {name: 'Temp'})
DELETE p
\`\`\`

### Step 3: 노드와 관계 함께 삭제 (DETACH DELETE)

\`\`\`cypher
// 노드와 연결된 모든 관계 삭제
MATCH (p:Person {name: 'David'})
DETACH DELETE p
\`\`\`

### 주의: DELETE 오류 상황

\`\`\`cypher
// 이 쿼리는 오류 발생! (관계가 있는 노드)
MATCH (p:Person {name: 'Alice'})
DELETE p
// Error: Cannot delete node with relationships
\`\`\`

### 조건부 삭제

\`\`\`cypher
// 특정 조건의 관계만 삭제
MATCH (a)-[r:KNOWS]-(b)
WHERE r.since < 2020
DELETE r
\`\`\`

### 대량 삭제 (주의!)

\`\`\`cypher
// 모든 데이터 삭제 (위험!)
MATCH (n)
DETACH DELETE n

// 특정 레이블 노드만 삭제
MATCH (p:TempPerson)
DETACH DELETE p
\`\`\`

### 실습 과제

테스트용 Person 노드 'Test User'를 생성한 후 삭제하세요.
            `,
            starterCode: `// 1. 테스트 노드 생성
CREATE (t:Person {name: 'Test User', temp: true})

// 2. 노드 삭제 (DELETE 또는 DETACH DELETE)
// 쿼리를 작성하세요`,
            solutionCode: `// 1. 테스트 노드 생성
CREATE (t:Person {name: 'Test User', temp: true})

// 2. 노드 삭제 (관계가 없으므로 DELETE 가능)
MATCH (t:Person {name: 'Test User'})
DELETE t`,
            hints: [
              '새로 만든 노드는 관계가 없으므로 DELETE만으로 삭제 가능',
              '관계가 있다면 DETACH DELETE 필요',
              'MATCH로 먼저 노드를 찾아야 합니다'
            ],
            keyPoints: [
              'DELETE: 관계 없는 노드만 삭제',
              'DETACH DELETE: 관계와 함께 노드 삭제',
              'DELETE r: 관계만 삭제'
            ]
          }
        },
        {
          id: 'crud-quiz',
          type: 'quiz',
          title: 'CRUD 종합 퀴즈',
          duration: 5,
          content: {
            questions: [
              {
                question: '관계가 있는 노드를 삭제하려면 어떤 명령을 사용해야 하나요?',
                options: [
                  'DETACH DELETE n',
                  'DELETE n CASCADE',
                  'DELETE n FORCE',
                  'DELETE n WITH RELATIONS'
                ],
                answer: 0,
                explanation: 'DETACH DELETE는 노드와 연결된 모든 관계를 함께 삭제합니다.'
              },
              {
                question: 'Alice의 나이를 1 증가시키는 올바른 쿼리는?',
                options: [
                  'MATCH (p:Person {name: "Alice"}) SET p.age = p.age + 1',
                  'UPDATE Person SET age = age + 1 WHERE name = "Alice"',
                  'MATCH (p:Person {name: "Alice"}) p.age++',
                  'MATCH (p:Person {name: "Alice"}) INCREMENT p.age'
                ],
                answer: 0,
                explanation: 'SET p.age = p.age + 1 형식으로 기존 값을 기반으로 수정합니다.'
              },
              {
                question: 'REMOVE 명령으로 할 수 없는 작업은?',
                options: [
                  '노드 삭제',
                  '속성 삭제',
                  '레이블 삭제',
                  '인덱스 삭제 (DROP INDEX)'
                ],
                answer: 0,
                explanation: 'REMOVE는 속성과 레이블 삭제용입니다. 노드 삭제는 DELETE를 사용합니다.'
              },
              {
                question: 'Person 노드에 Employee 레이블을 추가하는 올바른 방법은?',
                options: [
                  'SET p:Employee',
                  'ADD LABEL Employee TO p',
                  'ALTER p ADD LABEL Employee',
                  'UPDATE p SET label = Employee'
                ],
                answer: 0,
                explanation: 'SET p:LabelName 형식으로 레이블을 추가합니다.'
              }
            ]
          }
        }
      ],
      challenge: {
        id: 'crud-practice-challenge',
        type: 'challenge',
        title: 'CRUD 종합 실습',
        duration: 30,
        description: '10개 노드, 15개 관계 생성 후 조회, 수정, 삭제 연습',
        content: {
          objectives: [
            'CRUD 전 과정을 하나의 시나리오로 실습',
            '실제 비즈니스 시나리오 구현',
            '데이터 정합성 확인'
          ],
          requirements: [
            '최소 10개의 노드 생성 (Person, Company, City 등)',
            '최소 15개의 관계 생성 (KNOWS, WORKS_AT, LIVES_IN 등)',
            '각 노드에 2개 이상의 속성 설정',
            'WHERE 절을 활용한 조회 쿼리 3개 작성',
            'SET을 사용한 업데이트 쿼리 2개 작성',
            '관계 삭제 및 노드 삭제 쿼리 작성'
          ],
          evaluationCriteria: [
            '노드/관계 생성 정확성 (30점)',
            '조회 쿼리 정확성 (25점)',
            '업데이트 로직 정확성 (20점)',
            '삭제 연산 안전성 (15점)',
            '코드 가독성 및 주석 (10점)'
          ],
          instructions: `
## 챌린지: 회사 조직도 구축

### 시나리오
스타트업 "TechStart Inc."의 조직도를 그래프로 모델링합니다.

### 요구사항

#### 1. 노드 생성 (10개 이상)
\`\`\`cypher
// Company 1개
CREATE (techstart:Company {name: 'TechStart Inc.', founded: 2020, industry: 'Tech'})

// City 2개
CREATE (seoul:City {name: 'Seoul', country: 'Korea'})
CREATE (busan:City {name: 'Busan', country: 'Korea'})

// Person 7명 이상 (CEO, CTO, 팀장, 팀원 등)
// 직접 작성하세요!
\`\`\`

#### 2. 관계 생성 (15개 이상)
- WORKS_AT (직원 -> 회사)
- REPORTS_TO (부하 -> 상사)
- LIVES_IN (사람 -> 도시)
- KNOWS (동료 관계)

#### 3. 조회 쿼리 작성
- 서울에 사는 직원 목록
- 특정 팀장에게 보고하는 팀원들
- 2촌 이내 아는 사람들

#### 4. 업데이트 실행
- 승진: role 속성 변경
- 이직: WORKS_AT 관계 수정

#### 5. 삭제 연습
- 퇴사자 처리 (관계 정리 후 노드 삭제)

### 제출 형식
모든 쿼리를 순서대로 작성하고, 각 쿼리에 주석으로 목적을 설명하세요.
          `,
          bonusPoints: [
            '조직도 시각화 스크린샷 첨부',
            'OPTIONAL MATCH 활용',
            'WITH 절을 사용한 복합 쿼리'
          ]
        }
      }
    },
    {
      slug: 'pattern-matching',
      title: 'Cypher 패턴 매칭',
      totalDuration: 150,
      tasks: [
        {
          id: 'pattern-intro-video',
          type: 'video',
          title: '패턴 매칭 개념 (ASCII Art 문법)',
          duration: 15,
          content: {
            objectives: [
              '그래프 패턴의 개념과 표현 방식 이해',
              'ASCII Art 패턴 문법의 구성 요소 학습',
              '패턴 매칭의 동작 원리 파악'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=placeholder-pattern-intro',
            transcript: `
## 패턴 매칭이란?

패턴 매칭은 Cypher의 **핵심 기능**입니다. 그래프에서 특정 구조를 찾아내는 방식으로, ASCII Art 문법을 사용합니다.

### 기본 패턴 구조

\`\`\`
(노드)-[관계]->(노드)
\`\`\`

**구성 요소:**
- \`( )\`: 노드를 표현
- \`-[ ]->\`: 방향이 있는 관계
- \`-[ ]-\`: 방향이 없는 관계

### 패턴 예시들

#### 1. 가장 단순한 패턴
\`\`\`cypher
// 모든 노드
MATCH (n)
RETURN n
\`\`\`

#### 2. 레이블이 있는 노드
\`\`\`cypher
// Person 레이블을 가진 모든 노드
MATCH (p:Person)
RETURN p
\`\`\`

#### 3. 관계 패턴
\`\`\`cypher
// KNOWS 관계로 연결된 두 노드
MATCH (a)-[:KNOWS]->(b)
RETURN a, b
\`\`\`

### 패턴의 시각적 표현

실제 그래프:
\`\`\`
Alice --KNOWS--> Bob --KNOWS--> Carol
  |                |
  v                v
 Neo4j          Startup
(WORKS_AT)    (WORKS_AT)
\`\`\`

이를 찾는 Cypher:
\`\`\`cypher
MATCH (a:Person)-[:KNOWS]->(b:Person)-[:KNOWS]->(c:Person)
RETURN a.name, b.name, c.name
\`\`\`

### 패턴 매칭 동작 원리

1. **패턴 정의**: MATCH 절에서 찾고자 하는 구조 정의
2. **그래프 탐색**: Neo4j가 그래프를 탐색하며 패턴과 일치하는 부분 검색
3. **결과 바인딩**: 일치하는 노드/관계를 변수에 바인딩
4. **결과 반환**: RETURN 절에서 필요한 데이터 추출

### 패턴 매칭 vs SQL JOIN

| 개념 | SQL | Cypher |
|-----|-----|--------|
| 테이블 조인 | FROM t1 JOIN t2 ON... | (a)-[:REL]->(b) |
| 다중 조인 | 복잡한 JOIN 체인 | 직관적인 패턴 확장 |
| 가독성 | 조인 조건 파악 어려움 | 그래프 구조가 코드에 보임 |

다음 강의에서는 패턴 문법 가이드를 통해 상세 문법을 학습합니다.
            `,
            keyPoints: [
              '패턴 매칭 = 그래프에서 특정 구조 찾기',
              'ASCII Art: (노드)-[:관계]->(노드)',
              'SQL JOIN 대비 직관적이고 간결한 표현'
            ]
          }
        },
        {
          id: 'pattern-docs-reading',
          type: 'reading',
          title: 'Cypher 패턴 문법 가이드',
          duration: 10,
          content: {
            objectives: [
              '패턴의 다양한 구성 요소 숙지',
              '변수 바인딩 방법 이해',
              '패턴 조합의 기본 규칙 학습'
            ],
            markdown: `
## Cypher 패턴 문법 레퍼런스

### 1. 노드 패턴

\`\`\`cypher
()                    // 익명 노드
(n)                   // 변수 바인딩
(p:Person)            // 레이블 지정
(p:Person:Employee)   // 다중 레이블
(p {name: 'Alice'})   // 속성 필터
(p:Person {age: 30})  // 레이블 + 속성
\`\`\`

### 2. 관계 패턴

\`\`\`cypher
-[]-                  // 익명 관계, 방향 무관
-[]->                 // 나가는 방향
<-[]-                 // 들어오는 방향
-[r]->                // 변수 바인딩
-[:KNOWS]->           // 관계 타입 지정
-[r:KNOWS]->          // 타입 + 변수
-[r:KNOWS {since: 2020}]->  // 속성 포함
\`\`\`

### 3. 패턴 조합

\`\`\`cypher
// 체인 패턴
(a)-[:KNOWS]->(b)-[:KNOWS]->(c)

// 분기 패턴
(a)-[:KNOWS]->(b), (a)-[:WORKS_AT]->(c)

// 여러 관계 타입
(a)-[:KNOWS|FOLLOWS]->(b)

// 가변 길이 경로
(a)-[:KNOWS*]->(b)    // 0개 이상
(a)-[:KNOWS*1..]->(b) // 1개 이상
(a)-[:KNOWS*..3]->(b) // 3개 이하
(a)-[:KNOWS*1..3]->(b) // 1~3개
\`\`\`

### 4. 옵셔널 패턴

\`\`\`cypher
// 관계가 없어도 노드 반환
MATCH (p:Person)
OPTIONAL MATCH (p)-[:WORKS_AT]->(c:Company)
RETURN p.name, c.name
\`\`\`

### 5. 패턴 변수 활용

\`\`\`cypher
// 경로 변수
MATCH path = (a)-[:KNOWS*]->(b)
RETURN path, length(path)

// 관계 리스트
MATCH (a)-[rels:KNOWS*1..3]->(b)
RETURN rels
\`\`\`

### 패턴 문법 치트시트

| 요소 | 문법 | 예시 |
|-----|------|------|
| 노드 | (n:Label) | (p:Person) |
| 관계 | -[r:TYPE]-> | -[k:KNOWS]-> |
| 방향 없음 | -[r:TYPE]- | -[:FRIENDS]- |
| 다중 타입 | [:A\|B] | [:KNOWS\|FOLLOWS] |
| 가변 길이 | *min..max | *1..3 |
| 속성 필터 | {key: value} | {name: 'Alice'} |
            `,
            externalLinks: [
              { title: 'Cypher Pattern Matching', url: 'https://neo4j.com/docs/cypher-manual/current/patterns/' },
              { title: 'Variable-length patterns', url: 'https://neo4j.com/docs/cypher-manual/current/patterns/variable-length-patterns/' }
            ],
            keyPoints: [
              '노드: (변수:레이블 {속성})',
              '관계: -[변수:타입 {속성}]->',
              '가변 길이: *min..max'
            ]
          }
        },
        {
          id: 'simple-pattern-code',
          type: 'code',
          title: '단순 패턴: (a)-[:KNOWS]->(b)',
          duration: 15,
          content: {
            objectives: [
              '기본 관계 패턴 실습',
              '노드와 관계 변수 바인딩 연습',
              '다양한 방향의 패턴 작성'
            ],
            instructions: `
## 단순 패턴 실습

### 준비: 테스트 데이터 생성

\`\`\`cypher
// 기존 데이터 삭제 (선택적)
MATCH (n) DETACH DELETE n;

// 새 데이터 생성
CREATE (alice:Person {name: 'Alice', age: 28})
CREATE (bob:Person {name: 'Bob', age: 32})
CREATE (carol:Person {name: 'Carol', age: 25})
CREATE (david:Person {name: 'David', age: 35})
CREATE (eve:Person {name: 'Eve', age: 29})

CREATE (alice)-[:KNOWS {since: 2020}]->(bob)
CREATE (alice)-[:KNOWS {since: 2021}]->(carol)
CREATE (bob)-[:KNOWS {since: 2019}]->(carol)
CREATE (bob)-[:KNOWS {since: 2022}]->(david)
CREATE (carol)-[:KNOWS {since: 2021}]->(eve)
CREATE (david)-[:KNOWS {since: 2020}]->(eve)
\`\`\`

### Step 1: 기본 관계 패턴

\`\`\`cypher
// Alice가 아는 모든 사람
MATCH (a:Person {name: 'Alice'})-[:KNOWS]->(friend)
RETURN friend.name

// 관계 정보도 함께
MATCH (a:Person {name: 'Alice'})-[r:KNOWS]->(friend)
RETURN friend.name, r.since
\`\`\`

### Step 2: 방향별 패턴

\`\`\`cypher
// 나가는 관계 (Alice -> ?)
MATCH (alice:Person {name: 'Alice'})-[:KNOWS]->(b)
RETURN 'Alice knows ' + b.name AS result

// 들어오는 관계 (? -> Bob)
MATCH (a)-[:KNOWS]->(bob:Person {name: 'Bob'})
RETURN a.name + ' knows Bob' AS result

// 양방향 (Alice와 연결된 모든 사람)
MATCH (alice:Person {name: 'Alice'})-[:KNOWS]-(connected)
RETURN connected.name
\`\`\`

### Step 3: 패턴 체인

\`\`\`cypher
// 2단계 연결: Alice -> ? -> ?
MATCH (alice:Person {name: 'Alice'})-[:KNOWS]->(mid)-[:KNOWS]->(end)
RETURN alice.name, mid.name, end.name
\`\`\`

### 실습 과제

Bob이 직접 아는 사람들의 이름과 관계 시작 연도(since)를 조회하세요.
            `,
            starterCode: `// Bob이 아는 사람들과 관계 시작 연도 조회
MATCH // 패턴을 완성하세요
RETURN // 결과를 반환하세요`,
            solutionCode: `// Bob이 아는 사람들과 관계 시작 연도 조회
MATCH (bob:Person {name: 'Bob'})-[r:KNOWS]->(friend)
RETURN friend.name AS name, r.since AS since`,
            hints: [
              'Bob을 시작 노드로 설정합니다',
              '관계에 변수 r을 할당하여 r.since에 접근합니다',
              'RETURN에서 AS로 별칭을 지정할 수 있습니다'
            ],
            keyPoints: [
              '(a)-[:REL]->(b): 기본 관계 패턴',
              '-[r:REL]->: 관계 변수로 속성 접근',
              '방향: ->, <-, - (양방향)'
            ]
          }
        },
        {
          id: 'pattern-quiz-1',
          type: 'quiz',
          title: '패턴 문법 퀴즈',
          duration: 5,
          content: {
            questions: [
              {
                question: 'Alice를 아는(KNOWS 관계가 들어오는) 모든 사람을 찾는 패턴은?',
                options: [
                  '(a)-[:KNOWS]->(alice:Person {name: "Alice"})',
                  '(alice:Person {name: "Alice"})-[:KNOWS]->(a)',
                  '(a)-[:KNOWS]-(alice:Person {name: "Alice"})',
                  '(alice:Person {name: "Alice"})<-[:KNOWS]-(a)'
                ],
                answer: 0,
                explanation: '화살표 방향이 Alice를 향하므로, (a)-[:KNOWS]->(alice) 또는 (alice)<-[:KNOWS]-(a) 모두 가능합니다.'
              },
              {
                question: '익명 노드(변수 없음)와 익명 관계(타입만 지정)를 사용한 올바른 패턴은?',
                options: [
                  '()-[:KNOWS]->()',
                  '(a)-[]->(b)',
                  '(n)-[:?]->(m)',
                  '(*)-[:KNOWS]->(*)'
                ],
                answer: 0,
                explanation: '() 는 익명 노드, -[:TYPE]-> 는 관계 타입만 지정한 익명 관계입니다.'
              },
              {
                question: 'Person 레이블과 Employee 레이블을 모두 가진 노드를 매칭하는 패턴은?',
                options: [
                  '(n:Person:Employee)',
                  '(n:Person AND Employee)',
                  '(n:Person, n:Employee)',
                  '(n:[Person, Employee])'
                ],
                answer: 0,
                explanation: '다중 레이블은 :Label1:Label2 형식으로 콜론을 연속해서 사용합니다.'
              }
            ]
          }
        },
        {
          id: 'bidirectional-video',
          type: 'video',
          title: '양방향 패턴: (a)-[:KNOWS]-(b)',
          duration: 10,
          content: {
            objectives: [
              '방향 있는 관계 vs 방향 없는 패턴의 차이 이해',
              '양방향 탐색의 활용 사례 학습',
              '중복 결과 처리 방법'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=placeholder-bidirectional',
            transcript: `
## 양방향 패턴 이해하기

### 방향의 의미

Neo4j에서 **관계는 항상 방향이 있습니다**. 하지만 **쿼리할 때는 방향을 무시**할 수 있습니다.

### 패턴 비교

\`\`\`cypher
// 나가는 방향만
MATCH (a)-[:KNOWS]->(b) RETURN a.name, b.name

// 들어오는 방향만
MATCH (a)<-[:KNOWS]-(b) RETURN a.name, b.name

// 양방향 (방향 무시)
MATCH (a)-[:KNOWS]-(b) RETURN a.name, b.name
\`\`\`

### 실제 예시

그래프 상태:
\`\`\`
Alice --KNOWS--> Bob
Bob --KNOWS--> Carol
\`\`\`

#### 나가는 방향 쿼리
\`\`\`cypher
MATCH (a:Person {name: 'Alice'})-[:KNOWS]->(b)
RETURN b.name
// 결과: Bob
\`\`\`

#### 양방향 쿼리
\`\`\`cypher
MATCH (b:Person {name: 'Bob'})-[:KNOWS]-(connected)
RETURN connected.name
// 결과: Alice, Carol (둘 다!)
\`\`\`

### 중복 결과 주의

양방향 패턴은 같은 쌍을 두 번 반환할 수 있습니다:

\`\`\`cypher
MATCH (a:Person)-[:KNOWS]-(b:Person)
RETURN a.name, b.name
// Alice-Bob, Bob-Alice (중복!)
\`\`\`

#### 중복 제거 방법

\`\`\`cypher
// 방법 1: id() 비교
MATCH (a:Person)-[:KNOWS]-(b:Person)
WHERE id(a) < id(b)
RETURN a.name, b.name

// 방법 2: DISTINCT
MATCH (a:Person)-[:KNOWS]-(b:Person)
RETURN DISTINCT
  CASE WHEN a.name < b.name THEN a.name ELSE b.name END AS person1,
  CASE WHEN a.name < b.name THEN b.name ELSE a.name END AS person2
\`\`\`

### 활용 사례

1. **상호 연결 찾기**: 누가 서로 알고 있는지
2. **네트워크 분석**: 연결된 컴포넌트 탐색
3. **친구 추천**: 공통 연결 찾기

양방향 패턴은 **방향이 중요하지 않은** 관계 탐색에 유용합니다.
            `,
            keyPoints: [
              '관계는 항상 방향이 있지만, 쿼리에서 무시 가능',
              '양방향 패턴: -[:TYPE]-',
              '중복 결과 주의: WHERE id(a) < id(b)'
            ]
          }
        },
        {
          id: 'variable-length-code',
          type: 'code',
          title: '가변 길이 패턴: *1..3 (1~3 hop)',
          duration: 15,
          content: {
            objectives: [
              '가변 길이 경로 문법 숙지',
              '다양한 hop 범위 설정 방법',
              'shortestPath 함수 활용'
            ],
            instructions: `
## 가변 길이 패턴 실습

### 가변 길이 문법

\`\`\`cypher
// 기본 형태: *min..max
-[:KNOWS*1..3]->  // 1~3 hop
-[:KNOWS*..3]->   // 0~3 hop
-[:KNOWS*1..]->   // 1~무한 hop
-[:KNOWS*]->      // 0~무한 hop (위험!)
\`\`\`

### Step 1: 2촌 친구 찾기

\`\`\`cypher
// 정확히 2 hop
MATCH (alice:Person {name: 'Alice'})-[:KNOWS*2]->(friend)
RETURN friend.name

// 경로 확인
MATCH path = (alice:Person {name: 'Alice'})-[:KNOWS*2]->(friend)
RETURN [n IN nodes(path) | n.name] AS names
\`\`\`

### Step 2: 1~3촌 친구 찾기

\`\`\`cypher
MATCH (alice:Person {name: 'Alice'})-[:KNOWS*1..3]->(friend)
WHERE friend.name <> 'Alice'  // 자기 자신 제외
RETURN DISTINCT friend.name, length(
  shortestPath((alice)-[:KNOWS*]-(friend))
) AS distance
\`\`\`

### Step 3: 최단 경로

\`\`\`cypher
// shortestPath 사용
MATCH path = shortestPath(
  (alice:Person {name: 'Alice'})-[:KNOWS*]-(eve:Person {name: 'Eve'})
)
RETURN [n IN nodes(path) | n.name] AS route,
       length(path) AS hops
\`\`\`

### Step 4: 모든 경로 찾기

\`\`\`cypher
// allShortestPaths - 같은 길이의 모든 최단 경로
MATCH path = allShortestPaths(
  (alice:Person {name: 'Alice'})-[:KNOWS*]-(eve:Person {name: 'Eve'})
)
RETURN [n IN nodes(path) | n.name] AS route
\`\`\`

### 주의사항

\`\`\`cypher
// 위험! 무한 탐색 가능
MATCH (a)-[*]->(b) RETURN a, b

// 안전: 항상 상한 설정
MATCH (a)-[*..10]->(b) RETURN a, b
\`\`\`

### 실습 과제

Alice에서 시작하여 정확히 2 hop 거리에 있는 모든 사람의 이름을 찾으세요. (자기 자신 제외)
            `,
            starterCode: `// Alice에서 2 hop 거리의 사람들 찾기
MATCH // 패턴을 완성하세요
WHERE // 조건을 추가하세요
RETURN // 결과를 반환하세요`,
            solutionCode: `// Alice에서 2 hop 거리의 사람들 찾기
MATCH (alice:Person {name: 'Alice'})-[:KNOWS*2]->(friend:Person)
WHERE friend.name <> 'Alice'
RETURN DISTINCT friend.name`,
            hints: [
              '*2는 정확히 2 hop을 의미합니다',
              'friend.name <> "Alice"로 자기 자신 제외',
              'DISTINCT로 중복 제거'
            ],
            keyPoints: [
              '*N: 정확히 N hop',
              '*min..max: min~max hop 범위',
              'shortestPath(): 최단 경로 찾기'
            ]
          }
        },
        {
          id: 'multi-rel-code',
          type: 'code',
          title: '여러 관계 유형: [:KNOWS|FOLLOWS]',
          duration: 15,
          content: {
            objectives: [
              '다중 관계 타입 패턴 작성',
              '관계 타입 필터링 방법',
              '복합 패턴 조합 기술'
            ],
            instructions: `
## 다중 관계 유형 실습

### 준비: 추가 관계 생성

\`\`\`cypher
// FOLLOWS 관계 추가
MATCH (alice:Person {name: 'Alice'}), (carol:Person {name: 'Carol'})
CREATE (alice)-[:FOLLOWS]->(carol)

MATCH (bob:Person {name: 'Bob'}), (eve:Person {name: 'Eve'})
CREATE (bob)-[:FOLLOWS]->(eve)

MATCH (carol:Person {name: 'Carol'}), (david:Person {name: 'David'})
CREATE (carol)-[:FOLLOWS]->(david)
\`\`\`

### Step 1: OR 패턴 - 여러 관계 타입

\`\`\`cypher
// KNOWS 또는 FOLLOWS 관계
MATCH (alice:Person {name: 'Alice'})-[:KNOWS|FOLLOWS]->(connected)
RETURN connected.name, 'connected' AS type
\`\`\`

### Step 2: 관계 타입 표시

\`\`\`cypher
// 관계 타입도 함께 반환
MATCH (alice:Person {name: 'Alice'})-[r:KNOWS|FOLLOWS]->(connected)
RETURN connected.name, type(r) AS relationshipType
\`\`\`

### Step 3: 모든 관계 타입 탐색

\`\`\`cypher
// 관계 타입 지정 없이 모든 관계
MATCH (alice:Person {name: 'Alice'})-[r]->(connected)
RETURN connected.name, type(r) AS relType
\`\`\`

### Step 4: 복합 패턴

\`\`\`cypher
// KNOWS로 연결되고 같은 사람을 FOLLOWS하는 패턴
MATCH (a:Person)-[:KNOWS]->(b:Person),
      (a)-[:FOLLOWS]->(c:Person),
      (b)-[:FOLLOWS]->(c)
RETURN a.name, b.name, c.name AS commonFollow
\`\`\`

### Step 5: NOT 패턴 (없는 관계 찾기)

\`\`\`cypher
// KNOWS하지만 FOLLOWS하지 않는 경우
MATCH (a:Person)-[:KNOWS]->(b:Person)
WHERE NOT (a)-[:FOLLOWS]->(b)
RETURN a.name, b.name
\`\`\`

### 실습 과제

Alice가 KNOWS 또는 FOLLOWS하는 모든 사람과 그 관계 타입을 조회하세요.
            `,
            starterCode: `// Alice의 KNOWS/FOLLOWS 관계 모두 조회
MATCH // 패턴을 작성하세요
RETURN // 이름과 관계 타입 반환`,
            solutionCode: `// Alice의 KNOWS/FOLLOWS 관계 모두 조회
MATCH (alice:Person {name: 'Alice'})-[r:KNOWS|FOLLOWS]->(person)
RETURN person.name AS name, type(r) AS relationType`,
            hints: [
              '[:KNOWS|FOLLOWS]로 두 관계 타입 모두 매칭',
              'type(r)로 관계 타입 이름 반환',
              '관계에 변수 r을 할당해야 type() 사용 가능'
            ],
            keyPoints: [
              '[:A|B]: A 또는 B 타입 관계',
              'type(r): 관계 타입 이름 반환',
              '-[r]->: 모든 관계 타입 매칭'
            ]
          }
        },
        {
          id: 'pattern-quiz-2',
          type: 'quiz',
          title: '고급 패턴 퀴즈',
          duration: 5,
          content: {
            questions: [
              {
                question: '1~3 hop 거리의 KNOWS 관계를 찾는 올바른 패턴은?',
                options: [
                  '(a)-[:KNOWS*1..3]->(b)',
                  '(a)-[:KNOWS{1,3}]->(b)',
                  '(a)-[:KNOWS RANGE 1 TO 3]->(b)',
                  '(a)-[:KNOWS REPEAT 1..3]->(b)'
                ],
                answer: 0,
                explanation: '*min..max 형식으로 가변 길이를 표현합니다.'
              },
              {
                question: 'KNOWS 또는 FOLLOWS 관계를 매칭하는 패턴은?',
                options: [
                  '(a)-[:KNOWS|FOLLOWS]->(b)',
                  '(a)-[:KNOWS OR FOLLOWS]->(b)',
                  '(a)-[:KNOWS, :FOLLOWS]->(b)',
                  '(a)-[:KNOWS AND FOLLOWS]->(b)'
                ],
                answer: 0,
                explanation: '파이프(|)로 여러 관계 타입을 OR 조건으로 연결합니다.'
              },
              {
                question: 'shortestPath 함수의 올바른 사용법은?',
                options: [
                  'MATCH path = shortestPath((a)-[:KNOWS*]-(b)) RETURN path',
                  'MATCH shortestPath((a)-[:KNOWS*]-(b)) AS path RETURN path',
                  'RETURN shortestPath((a)-[:KNOWS*]-(b)) FROM a, b',
                  'SELECT shortestPath FROM a TO b WHERE KNOWS'
                ],
                answer: 0,
                explanation: 'shortestPath()는 MATCH에서 path 변수에 할당하여 사용합니다.'
              }
            ]
          }
        },
        {
          id: 'return-order-video',
          type: 'video',
          title: 'RETURN, ORDER BY, LIMIT',
          duration: 10,
          content: {
            objectives: [
              'RETURN 절의 다양한 표현식 학습',
              'ORDER BY로 결과 정렬하기',
              'LIMIT, SKIP으로 페이징 구현'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=placeholder-return-order',
            transcript: `
## 결과 반환과 정렬

### RETURN 절 표현식

\`\`\`cypher
// 기본
RETURN n

// 속성
RETURN n.name, n.age

// 별칭
RETURN n.name AS personName

// 연산
RETURN n.name, n.age + 10 AS ageIn10Years

// 리스트
RETURN [n.name, n.age] AS info

// 맵
RETURN {name: n.name, age: n.age} AS person
\`\`\`

### ORDER BY 정렬

\`\`\`cypher
// 오름차순 (기본)
MATCH (p:Person)
RETURN p.name, p.age
ORDER BY p.age

// 내림차순
MATCH (p:Person)
RETURN p.name, p.age
ORDER BY p.age DESC

// 다중 정렬
MATCH (p:Person)
RETURN p.name, p.age
ORDER BY p.age DESC, p.name ASC
\`\`\`

### LIMIT와 SKIP

\`\`\`cypher
// 상위 N개
MATCH (p:Person)
RETURN p.name, p.age
ORDER BY p.age DESC
LIMIT 3

// 페이징 (2페이지, 페이지당 5개)
MATCH (p:Person)
RETURN p.name, p.age
ORDER BY p.name
SKIP 5 LIMIT 5

// TOP N 패턴
MATCH (p:Person)-[r:KNOWS]->()
RETURN p.name, count(r) AS connections
ORDER BY connections DESC
LIMIT 3
\`\`\`

### DISTINCT

\`\`\`cypher
// 중복 제거
MATCH (a)-[:KNOWS]-(b)
RETURN DISTINCT a.name

// 조합 중복 제거
MATCH (a)-[r]->(b)
RETURN DISTINCT type(r)
\`\`\`

### NULL 처리

\`\`\`cypher
// NULL 값 정렬 (항상 마지막)
MATCH (p:Person)
RETURN p.name, p.email
ORDER BY p.email  // NULL은 마지막

// NULL 체크
MATCH (p:Person)
RETURN p.name, coalesce(p.email, 'No email') AS email
\`\`\`

ORDER BY + LIMIT 조합은 **Top-N 쿼리**의 핵심 패턴입니다.
            `,
            keyPoints: [
              'RETURN: 속성, 표현식, 별칭, 맵/리스트',
              'ORDER BY: ASC(기본), DESC',
              'LIMIT/SKIP: Top-N, 페이징'
            ]
          }
        },
        {
          id: 'aggregation-code',
          type: 'code',
          title: '집계: count(), collect()',
          duration: 15,
          content: {
            objectives: [
              '기본 집계 함수 사용법 숙지',
              'GROUP BY 없이 그룹화하는 방법',
              'collect()로 리스트 만들기'
            ],
            instructions: `
## 집계 함수 실습

### 기본 집계 함수

\`\`\`cypher
// count - 개수
MATCH (p:Person)
RETURN count(p) AS totalPeople

// sum, avg, min, max
MATCH (p:Person)
RETURN sum(p.age) AS totalAge,
       avg(p.age) AS averageAge,
       min(p.age) AS youngest,
       max(p.age) AS oldest
\`\`\`

### 그룹별 집계 (암시적 GROUP BY)

\`\`\`cypher
// 각 사람별 친구 수 (비집계 컬럼이 그룹 키)
MATCH (p:Person)-[:KNOWS]->(friend)
RETURN p.name, count(friend) AS friendCount
ORDER BY friendCount DESC
\`\`\`

### collect() - 리스트 생성

\`\`\`cypher
// 친구 이름 리스트
MATCH (p:Person {name: 'Alice'})-[:KNOWS]->(friend)
RETURN collect(friend.name) AS friends

// 그룹별 리스트
MATCH (p:Person)-[:KNOWS]->(friend)
RETURN p.name, collect(friend.name) AS friends
\`\`\`

### 고급 집계

\`\`\`cypher
// DISTINCT count
MATCH (p:Person)-[:KNOWS]-(connected)
RETURN p.name, count(DISTINCT connected) AS uniqueConnections

// 조건부 count
MATCH (p:Person)-[:KNOWS]->(friend)
RETURN p.name,
       count(friend) AS totalFriends,
       count(CASE WHEN friend.age > 30 THEN 1 END) AS olderFriends
\`\`\`

### WITH 절과 집계

\`\`\`cypher
// 중간 집계 후 필터링
MATCH (p:Person)-[:KNOWS]->(friend)
WITH p, count(friend) AS friendCount
WHERE friendCount >= 2
RETURN p.name, friendCount
\`\`\`

### 실습 과제

각 사람별로 KNOWS 관계로 연결된 친구 수를 계산하고, 친구가 2명 이상인 사람만 내림차순으로 정렬하여 반환하세요.
            `,
            starterCode: `// 친구가 2명 이상인 사람 (친구 수 내림차순)
MATCH // 패턴
// 집계와 필터링
RETURN // 결과`,
            solutionCode: `// 친구가 2명 이상인 사람 (친구 수 내림차순)
MATCH (p:Person)-[:KNOWS]->(friend)
WITH p, count(friend) AS friendCount
WHERE friendCount >= 2
RETURN p.name, friendCount
ORDER BY friendCount DESC`,
            hints: [
              'WITH로 중간 집계 결과를 저장합니다',
              'WHERE는 WITH 이후에 사용합니다',
              'ORDER BY는 RETURN 이후에 사용합니다'
            ],
            keyPoints: [
              'count(), sum(), avg(), min(), max()',
              'collect(): 리스트로 수집',
              'WITH: 중간 결과 저장 + 필터링'
            ]
          }
        },
        {
          id: 'final-quiz',
          type: 'quiz',
          title: '패턴 매칭 종합 퀴즈',
          duration: 5,
          content: {
            questions: [
              {
                question: '친구 수가 가장 많은 상위 3명을 찾는 쿼리의 올바른 순서는?',
                options: [
                  'MATCH, WITH/count, ORDER BY DESC, LIMIT 3',
                  'MATCH, ORDER BY, LIMIT 3, count',
                  'SELECT, GROUP BY, ORDER BY, TOP 3',
                  'MATCH, LIMIT 3, count, ORDER BY'
                ],
                answer: 0,
                explanation: 'MATCH로 패턴 찾기 → WITH/count로 집계 → ORDER BY DESC로 정렬 → LIMIT 3'
              },
              {
                question: 'collect() 함수의 용도는?',
                options: [
                  '그룹별로 값들을 리스트로 수집',
                  '노드를 삭제',
                  '관계를 생성',
                  '트랜잭션을 커밋'
                ],
                answer: 0,
                explanation: 'collect()는 그룹별로 값들을 배열/리스트로 수집합니다.'
              },
              {
                question: '페이지당 10개씩 보여줄 때 3페이지를 가져오는 쿼리는?',
                options: [
                  'SKIP 20 LIMIT 10',
                  'SKIP 30 LIMIT 10',
                  'LIMIT 10 OFFSET 20',
                  'PAGE 3 SIZE 10'
                ],
                answer: 0,
                explanation: '3페이지는 20개를 건너뛰고(0-19 = 1,2페이지) 10개를 가져옵니다. SKIP 20 LIMIT 10'
              },
              {
                question: '양방향 관계 패턴에서 중복 결과를 방지하는 방법은?',
                options: [
                  'WHERE id(a) < id(b)',
                  'WHERE a != b',
                  'DISTINCT ALL',
                  'UNIQUE PAIRS'
                ],
                answer: 0,
                explanation: 'WHERE id(a) < id(b)로 한 방향의 쌍만 선택하여 중복을 방지합니다.'
              }
            ]
          }
        }
      ],
      challenge: {
        id: 'friend-of-friend-challenge',
        type: 'challenge',
        title: '친구의 친구 찾기 챌린지',
        duration: 30,
        description: '2촌 친구, 3촌 친구, 공통 친구를 찾는 쿼리 작성',
        content: {
          objectives: [
            '다양한 hop 거리의 연결 찾기',
            '공통 연결 패턴 구현',
            '친구 추천 알고리즘 기초 이해'
          ],
          requirements: [
            '특정 사용자의 2촌 친구 목록 조회',
            '특정 사용자의 3촌 이내 모든 친구 조회',
            '두 사용자의 공통 친구 찾기',
            '친구 추천: 내가 모르지만 친구가 많이 아는 사람',
            '최단 경로로 두 사람 사이 연결 찾기'
          ],
          evaluationCriteria: [
            '쿼리 정확성 (40점)',
            '효율적인 패턴 사용 (20점)',
            '결과 가독성 (20점)',
            '추가 인사이트 도출 (20점)'
          ],
          instructions: `
## 챌린지: 소셜 네트워크 분석

### 시나리오
소셜 네트워크에서 친구 관계를 분석하여 새로운 친구를 추천하는 기능을 구현합니다.

### 쿼리 작성 과제

#### 1. 2촌 친구 찾기
\`\`\`cypher
// Alice의 2촌 친구 (친구의 친구지만 직접 친구는 아닌)
// 힌트: *2 패턴 + NOT 조건
\`\`\`

#### 2. 3촌 이내 모든 친구
\`\`\`cypher
// Alice에서 1~3 hop 거리의 모든 사람
// 힌트: *1..3 패턴 + DISTINCT
\`\`\`

#### 3. 공통 친구 찾기
\`\`\`cypher
// Alice와 Eve의 공통 친구
// 힌트: 두 개의 MATCH 패턴
\`\`\`

#### 4. 친구 추천 (People You May Know)
\`\`\`cypher
// Alice가 모르지만, Alice의 친구들이 많이 아는 사람
// 힌트: collect() + count() + NOT
\`\`\`

#### 5. 최단 경로
\`\`\`cypher
// Alice에서 Eve까지 최단 경로
// 힌트: shortestPath()
\`\`\`

### 보너스 과제

- 가장 인기 있는 사람 (가장 많은 KNOWS 받는 사람)
- 네트워크 분리도 (연결되지 않은 그룹 찾기)
- 브릿지 노드 (삭제 시 네트워크가 분리되는 노드)

### 제출 형식
각 쿼리와 결과 스크린샷을 포함하세요.
          `,
          bonusPoints: [
            '페이지네이션이 적용된 친구 목록',
            '관계 강도(weight)를 고려한 추천',
            '시각화 결과 캡처'
          ]
        }
      }
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project: 소셜 네트워크 그래프',
      totalDuration: 180,
      tasks: [
        {
          id: 'kg-project-requirements-reading',
          type: 'reading',
          title: '프로젝트 요구사항 분석',
          duration: 15,
          content: {
            objectives: [
              '프로젝트 전체 범위와 요구사항 파악',
              '평가 기준 이해',
              '작업 계획 수립'
            ],
            markdown: `
## Weekly Project: 소셜 네트워크 그래프

### 프로젝트 개요

이번 주 학습한 내용을 종합하여 **소셜 네트워크 그래프 데이터베이스**를 구축합니다.

### 시나리오

"TechHub"는 IT 전문가들을 위한 소셜 네트워킹 플랫폼입니다. 이 플랫폼의 핵심 데이터를 Neo4j 그래프 데이터베이스로 모델링하고, 다양한 비즈니스 쿼리를 구현합니다.

### 요구사항

#### 1. 데이터 모델 (30점)
- **노드 타입**: Person, Company, Skill
- **관계 타입**: KNOWS, WORKS_AT, HAS_SKILL, FOLLOWS
- 각 노드/관계에 적절한 속성 설정

#### 2. 데이터 생성 (20점)
- 최소 30개 Person 노드
- 최소 5개 Company 노드
- 최소 10개 Skill 노드
- 최소 50개 관계

#### 3. 비즈니스 쿼리 (30점)
다음 5개 쿼리 구현:
1. 특정 기술을 가진 사람들
2. 같은 회사 동료 찾기
3. 2촌 이내 네트워크
4. 인기 있는 기술 순위
5. 친구 추천 (공통 연결 기반)

#### 4. 시각화 (10점)
- Neo4j Browser에서 그래프 시각화
- 주요 쿼리 결과 스크린샷

#### 5. 문서화 (10점)
- 데이터 모델 다이어그램
- 쿼리 설명 주석
- 실행 결과 캡처

### 제출물

1. \`schema.cypher\` - 스키마 정의
2. \`data.cypher\` - 데이터 생성 쿼리
3. \`queries.cypher\` - 비즈니스 쿼리
4. \`README.md\` - 프로젝트 설명
5. 스크린샷 폴더

### 평가 기준

| 항목 | 배점 | 기준 |
|-----|-----|------|
| 데이터 모델 | 30점 | 적절한 노드/관계 설계 |
| 데이터 양 | 20점 | 충분한 테스트 데이터 |
| 쿼리 정확성 | 30점 | 5개 쿼리 모두 동작 |
| 시각화 | 10점 | 깔끔한 시각화 결과 |
| 문서화 | 10점 | 명확한 설명 |

### 일정 가이드

| 단계 | 예상 시간 |
|-----|---------|
| 요구사항 분석 | 15분 |
| 스키마 설계 | 30분 |
| 데이터 생성 | 45분 |
| 쿼리 작성 | 40분 |
| 시각화 | 20분 |
| 리뷰 & 문서화 | 30분 |
| **총** | **3시간** |
            `,
            keyPoints: [
              '노드: Person, Company, Skill',
              '관계: KNOWS, WORKS_AT, HAS_SKILL, FOLLOWS',
              '최소 30 노드, 50 관계, 5개 비즈니스 쿼리'
            ]
          }
        },
        {
          id: 'kg-schema-design-code',
          type: 'code',
          title: '데이터 모델 설계 (Person, Company, KNOWS, WORKS_AT)',
          duration: 30,
          content: {
            objectives: [
              'Property Graph 모델 설계 원칙 적용',
              '노드 레이블과 속성 결정',
              '관계 타입과 방향 설계'
            ],
            instructions: `
## 데이터 모델 설계

### Step 1: 노드 설계

#### Person 노드
\`\`\`cypher
// Person 노드 스키마
// 필수 속성: name, email
// 선택 속성: age, title, bio
(:Person {
  name: STRING,
  email: STRING,
  age: INTEGER,
  title: STRING,
  bio: STRING
})
\`\`\`

#### Company 노드
\`\`\`cypher
// Company 노드 스키마
(:Company {
  name: STRING,
  industry: STRING,
  size: STRING,  // 'startup', 'mid', 'enterprise'
  founded: INTEGER,
  headquarters: STRING
})
\`\`\`

#### Skill 노드
\`\`\`cypher
// Skill 노드 스키마
(:Skill {
  name: STRING,
  category: STRING,  // 'programming', 'database', 'cloud', 'soft'
  level: STRING      // 'beginner', 'intermediate', 'advanced'
})
\`\`\`

### Step 2: 관계 설계

\`\`\`cypher
// 관계 스키마
(:Person)-[:KNOWS {since: DATE, context: STRING}]->(:Person)
(:Person)-[:WORKS_AT {role: STRING, since: DATE}]->(:Company)
(:Person)-[:HAS_SKILL {level: INTEGER, certified: BOOLEAN}]->(:Skill)
(:Person)-[:FOLLOWS]->(:Person)
\`\`\`

### Step 3: 제약 조건 (선택)

\`\`\`cypher
// 유니크 제약조건
CREATE CONSTRAINT person_email IF NOT EXISTS
FOR (p:Person) REQUIRE p.email IS UNIQUE;

CREATE CONSTRAINT company_name IF NOT EXISTS
FOR (c:Company) REQUIRE c.name IS UNIQUE;

CREATE CONSTRAINT skill_name IF NOT EXISTS
FOR (s:Skill) REQUIRE s.name IS UNIQUE;
\`\`\`

### Step 4: 인덱스 (선택)

\`\`\`cypher
// 검색 성능 향상을 위한 인덱스
CREATE INDEX person_name IF NOT EXISTS
FOR (p:Person) ON (p.name);

CREATE INDEX skill_category IF NOT EXISTS
FOR (s:Skill) ON (s.category);
\`\`\`

### 실습: 스키마 파일 작성

위 내용을 바탕으로 \`schema.cypher\` 파일을 작성하세요.
            `,
            starterCode: `// schema.cypher
// TechHub 소셜 네트워크 스키마

// === 제약 조건 ===
// Person email 유니크

// Company name 유니크

// Skill name 유니크

// === 인덱스 ===
// Person name 인덱스

// Skill category 인덱스

// 완성하세요!`,
            solutionCode: `// schema.cypher
// TechHub 소셜 네트워크 스키마

// === 제약 조건 ===
CREATE CONSTRAINT person_email IF NOT EXISTS
FOR (p:Person) REQUIRE p.email IS UNIQUE;

CREATE CONSTRAINT company_name IF NOT EXISTS
FOR (c:Company) REQUIRE c.name IS UNIQUE;

CREATE CONSTRAINT skill_name IF NOT EXISTS
FOR (s:Skill) REQUIRE s.name IS UNIQUE;

// === 인덱스 ===
CREATE INDEX person_name IF NOT EXISTS
FOR (p:Person) ON (p.name);

CREATE INDEX skill_category IF NOT EXISTS
FOR (s:Skill) ON (s.category);`,
            hints: [
              'CREATE CONSTRAINT ... IF NOT EXISTS 사용',
              'CREATE INDEX ... IF NOT EXISTS 사용',
              'FOR (변수:레이블) REQUIRE 속성 조건'
            ],
            keyPoints: [
              '노드: Person, Company, Skill',
              '관계: KNOWS, WORKS_AT, HAS_SKILL, FOLLOWS',
              '제약조건: UNIQUE, 인덱스로 성능 최적화'
            ]
          }
        },
        {
          id: 'kg-data-generation-code',
          type: 'code',
          title: '샘플 데이터 생성 (30+ 노드, 50+ 관계)',
          duration: 45,
          content: {
            objectives: [
              '현실적인 테스트 데이터 생성',
              '대량 데이터 생성 기법 학습',
              'UNWIND를 활용한 배치 생성'
            ],
            instructions: `
## 샘플 데이터 생성

### Step 1: Company 노드 (5개)

\`\`\`cypher
CREATE (neo4j:Company {name: 'Neo4j', industry: 'Database', size: 'mid', founded: 2007})
CREATE (google:Company {name: 'Google', industry: 'Tech', size: 'enterprise', founded: 1998})
CREATE (startup1:Company {name: 'DataFlow', industry: 'Data', size: 'startup', founded: 2020})
CREATE (startup2:Company {name: 'CloudNine', industry: 'Cloud', size: 'startup', founded: 2019})
CREATE (kakao:Company {name: 'Kakao', industry: 'Tech', size: 'enterprise', founded: 2010})
\`\`\`

### Step 2: Skill 노드 (10개)

\`\`\`cypher
UNWIND [
  {name: 'Cypher', category: 'database'},
  {name: 'Python', category: 'programming'},
  {name: 'JavaScript', category: 'programming'},
  {name: 'Neo4j', category: 'database'},
  {name: 'AWS', category: 'cloud'},
  {name: 'Docker', category: 'devops'},
  {name: 'React', category: 'frontend'},
  {name: 'GraphQL', category: 'api'},
  {name: 'Machine Learning', category: 'ai'},
  {name: 'Communication', category: 'soft'}
] AS skill
CREATE (s:Skill {name: skill.name, category: skill.category})
\`\`\`

### Step 3: Person 노드 (30개) - UNWIND 활용

\`\`\`cypher
UNWIND range(1, 30) AS i
CREATE (p:Person {
  name: 'User' + i,
  email: 'user' + i + '@techhub.com',
  age: 25 + (i % 20),
  title: CASE i % 4
    WHEN 0 THEN 'Engineer'
    WHEN 1 THEN 'Manager'
    WHEN 2 THEN 'Designer'
    ELSE 'Analyst'
  END
})
\`\`\`

### Step 4: WORKS_AT 관계

\`\`\`cypher
// 각 회사에 직원 배치
MATCH (p:Person), (c:Company)
WHERE p.name STARTS WITH 'User'
WITH p, c, rand() AS r
ORDER BY r
WITH p, collect(c)[0] AS company
CREATE (p)-[:WORKS_AT {since: date('2020-01-01') + duration({months: toInteger(rand()*48)})}]->(company)
\`\`\`

### Step 5: KNOWS 관계 (랜덤)

\`\`\`cypher
// 랜덤 친구 관계 생성
MATCH (p1:Person), (p2:Person)
WHERE p1 <> p2 AND rand() < 0.1
CREATE (p1)-[:KNOWS {since: date('2019-01-01') + duration({months: toInteger(rand()*60)})}]->(p2)
\`\`\`

### Step 6: HAS_SKILL 관계

\`\`\`cypher
// 각 Person에게 2-4개 스킬 할당
MATCH (p:Person), (s:Skill)
WHERE rand() < 0.3
CREATE (p)-[:HAS_SKILL {level: toInteger(rand()*5)+1}]->(s)
\`\`\`

### 실습: data.cypher 파일 완성

위 쿼리들을 조합하여 data.cypher 파일을 완성하세요.
            `,
            starterCode: `// data.cypher
// TechHub 샘플 데이터

// === 기존 데이터 삭제 (주의!) ===
MATCH (n) DETACH DELETE n;

// === Company 노드 ===
// 5개 회사 생성

// === Skill 노드 ===
// 10개 스킬 생성 (UNWIND 사용)

// === Person 노드 ===
// 30개 사용자 생성 (UNWIND 사용)

// === 관계 생성 ===
// WORKS_AT, KNOWS, HAS_SKILL

// 완성하세요!`,
            solutionCode: `// data.cypher
// TechHub 샘플 데이터

// === 기존 데이터 삭제 (주의!) ===
MATCH (n) DETACH DELETE n;

// === Company 노드 ===
CREATE (neo4j:Company {name: 'Neo4j', industry: 'Database', size: 'mid', founded: 2007})
CREATE (google:Company {name: 'Google', industry: 'Tech', size: 'enterprise', founded: 1998})
CREATE (dataflow:Company {name: 'DataFlow', industry: 'Data', size: 'startup', founded: 2020})
CREATE (cloudnine:Company {name: 'CloudNine', industry: 'Cloud', size: 'startup', founded: 2019})
CREATE (kakao:Company {name: 'Kakao', industry: 'Tech', size: 'enterprise', founded: 2010});

// === Skill 노드 ===
UNWIND [
  {name: 'Cypher', category: 'database'},
  {name: 'Python', category: 'programming'},
  {name: 'JavaScript', category: 'programming'},
  {name: 'Neo4j', category: 'database'},
  {name: 'AWS', category: 'cloud'},
  {name: 'Docker', category: 'devops'},
  {name: 'React', category: 'frontend'},
  {name: 'GraphQL', category: 'api'},
  {name: 'Machine Learning', category: 'ai'},
  {name: 'Communication', category: 'soft'}
] AS skill
CREATE (s:Skill {name: skill.name, category: skill.category});

// === Person 노드 ===
UNWIND range(1, 30) AS i
CREATE (p:Person {
  name: 'User' + i,
  email: 'user' + i + '@techhub.com',
  age: 25 + (i % 20),
  title: CASE i % 4
    WHEN 0 THEN 'Engineer'
    WHEN 1 THEN 'Manager'
    WHEN 2 THEN 'Designer'
    ELSE 'Analyst'
  END
});

// === WORKS_AT 관계 ===
MATCH (p:Person), (c:Company)
WITH p, c, rand() AS r
ORDER BY r
WITH p, collect(c)[0] AS company
CREATE (p)-[:WORKS_AT {since: date('2020-01-01')}]->(company);

// === KNOWS 관계 ===
MATCH (p1:Person), (p2:Person)
WHERE p1 <> p2 AND rand() < 0.15
CREATE (p1)-[:KNOWS]->(p2);

// === HAS_SKILL 관계 ===
MATCH (p:Person), (s:Skill)
WHERE rand() < 0.25
CREATE (p)-[:HAS_SKILL {level: toInteger(rand()*5)+1}]->(s);`,
            hints: [
              'UNWIND로 리스트를 행으로 변환',
              'rand() < 0.1로 10% 확률 관계 생성',
              'CASE WHEN으로 조건부 값 할당'
            ],
            keyPoints: [
              'UNWIND: 리스트를 행으로 확장',
              'rand(): 랜덤 값 (0-1)',
              'range(1, 30): 1부터 30까지 리스트'
            ]
          }
        },
        {
          id: 'kg-queries-writing-code',
          type: 'code',
          title: '비즈니스 쿼리 5개 작성',
          duration: 40,
          content: {
            objectives: [
              '실제 비즈니스 요구사항을 Cypher로 구현',
              '다양한 패턴 매칭 기법 활용',
              '집계와 정렬 적용'
            ],
            instructions: `
## 비즈니스 쿼리 작성

### Query 1: 특정 기술을 가진 사람들

Python 스킬을 가진 사람과 그들의 레벨을 조회합니다.

\`\`\`cypher
MATCH (p:Person)-[r:HAS_SKILL]->(s:Skill {name: 'Python'})
RETURN p.name, p.title, r.level
ORDER BY r.level DESC
\`\`\`

### Query 2: 같은 회사 동료 찾기

특정 사용자(User1)와 같은 회사에서 일하는 동료를 찾습니다.

\`\`\`cypher
MATCH (me:Person {name: 'User1'})-[:WORKS_AT]->(c:Company)<-[:WORKS_AT]-(colleague:Person)
WHERE colleague <> me
RETURN c.name AS company, collect(colleague.name) AS colleagues
\`\`\`

### Query 3: 2촌 이내 네트워크

User1의 1촌, 2촌 친구를 모두 찾습니다.

\`\`\`cypher
MATCH (me:Person {name: 'User1'})-[:KNOWS*1..2]-(friend:Person)
WHERE friend <> me
WITH DISTINCT friend,
     shortestPath((me)-[:KNOWS*]-(friend)) AS path
RETURN friend.name, length(path) AS distance
ORDER BY distance
\`\`\`

### Query 4: 인기 있는 기술 순위

가장 많은 사람이 보유한 스킬 Top 5를 조회합니다.

\`\`\`cypher
MATCH (p:Person)-[:HAS_SKILL]->(s:Skill)
RETURN s.name, s.category, count(p) AS holders
ORDER BY holders DESC
LIMIT 5
\`\`\`

### Query 5: 친구 추천 (공통 연결 기반)

User1이 모르지만, User1의 친구들이 많이 아는 사람을 추천합니다.

\`\`\`cypher
MATCH (me:Person {name: 'User1'})-[:KNOWS]->(friend)-[:KNOWS]->(recommended)
WHERE NOT (me)-[:KNOWS]-(recommended) AND recommended <> me
RETURN recommended.name,
       count(friend) AS mutualFriends,
       collect(friend.name) AS throughFriends
ORDER BY mutualFriends DESC
LIMIT 5
\`\`\`

### 실습: queries.cypher 파일 작성

위 5개 쿼리를 queries.cypher 파일에 정리하세요.
            `,
            starterCode: `// queries.cypher
// TechHub 비즈니스 쿼리

// === Query 1: 특정 기술 보유자 ===
// Python 스킬을 가진 사람들

// === Query 2: 같은 회사 동료 ===
// User1의 동료들

// === Query 3: 2촌 네트워크 ===
// User1의 1-2촌 친구들

// === Query 4: 인기 기술 Top 5 ===
// 가장 많은 사람이 보유한 스킬

// === Query 5: 친구 추천 ===
// 공통 친구 기반 추천

// 완성하세요!`,
            solutionCode: `// queries.cypher
// TechHub 비즈니스 쿼리

// === Query 1: 특정 기술 보유자 ===
MATCH (p:Person)-[r:HAS_SKILL]->(s:Skill {name: 'Python'})
RETURN p.name, p.title, r.level
ORDER BY r.level DESC;

// === Query 2: 같은 회사 동료 ===
MATCH (me:Person {name: 'User1'})-[:WORKS_AT]->(c:Company)<-[:WORKS_AT]-(colleague)
WHERE colleague <> me
RETURN c.name AS company, collect(colleague.name) AS colleagues;

// === Query 3: 2촌 네트워크 ===
MATCH (me:Person {name: 'User1'})-[:KNOWS*1..2]-(friend:Person)
WHERE friend <> me
RETURN DISTINCT friend.name;

// === Query 4: 인기 기술 Top 5 ===
MATCH (p:Person)-[:HAS_SKILL]->(s:Skill)
RETURN s.name, s.category, count(p) AS holders
ORDER BY holders DESC
LIMIT 5;

// === Query 5: 친구 추천 ===
MATCH (me:Person {name: 'User1'})-[:KNOWS]->(friend)-[:KNOWS]->(recommended)
WHERE NOT (me)-[:KNOWS]-(recommended) AND recommended <> me
RETURN recommended.name, count(friend) AS mutualFriends
ORDER BY mutualFriends DESC
LIMIT 5;`,
            hints: [
              '공통 패턴: (a)-[:REL]->(b)<-[:REL]-(c)',
              'NOT (a)-[:REL]-(b)로 관계 없음 체크',
              'collect()로 리스트 생성'
            ],
            keyPoints: [
              '동료 찾기: 공통 회사 패턴',
              '친구 추천: 2hop + NOT 필터',
              '인기 순위: count() + ORDER BY + LIMIT'
            ]
          }
        },
        {
          id: 'kg-visualization-code',
          type: 'code',
          title: 'Neo4j Browser에서 시각화',
          duration: 20,
          content: {
            objectives: [
              'Neo4j Browser의 시각화 기능 활용',
              '효과적인 그래프 시각화 기법',
              '결과 캡처 및 공유'
            ],
            instructions: `
## Neo4j Browser 시각화

### 기본 시각화

#### 전체 그래프 보기
\`\`\`cypher
MATCH (n) RETURN n LIMIT 100
\`\`\`

#### 특정 패턴 시각화
\`\`\`cypher
// Person-Company 관계만
MATCH (p:Person)-[r:WORKS_AT]->(c:Company)
RETURN p, r, c
\`\`\`

### 시각화 커스터마이징

Neo4j Browser에서 다음 설정을 조정하세요:

1. **노드 색상**
   - Person: 파란색
   - Company: 녹색
   - Skill: 주황색

2. **노드 크기**
   - 연결 수에 비례

3. **관계 두께**
   - 관계 속성 값에 비례

### 시각화 쿼리 예시

#### 회사별 직원 네트워크
\`\`\`cypher
MATCH (c:Company)<-[:WORKS_AT]-(p:Person)
RETURN c, p
\`\`\`

#### 기술 허브 시각화
\`\`\`cypher
MATCH (p:Person)-[:HAS_SKILL]->(s:Skill)
RETURN p, s
LIMIT 50
\`\`\`

#### 친구 네트워크 (특정 사용자 중심)
\`\`\`cypher
MATCH (me:Person {name: 'User1'})-[:KNOWS*1..2]-(friend)
RETURN me, friend
\`\`\`

### 스크린샷 가이드

1. **전체 네트워크**: 모든 노드와 관계
2. **회사별 그룹**: 회사를 중심으로 클러스터링
3. **스킬 맵**: 스킬-사용자 연결
4. **특정 쿼리 결과**: 비즈니스 쿼리 실행 결과

### 내보내기

- **이미지**: 그래프 우클릭 → Export as PNG
- **데이터**: RETURN 결과 → Download CSV

실습: 위 쿼리들을 실행하고 스크린샷을 캡처하세요.
            `,
            starterCode: `// visualization.cypher
// 시각화용 쿼리 모음

// === 전체 네트워크 ===
MATCH (n) RETURN n LIMIT 100;

// === 회사-직원 네트워크 ===
// 완성하세요

// === 기술 허브 ===
// 완성하세요

// === 친구 네트워크 (User1 중심) ===
// 완성하세요`,
            solutionCode: `// visualization.cypher
// 시각화용 쿼리 모음

// === 전체 네트워크 ===
MATCH (n) RETURN n LIMIT 100;

// === 회사-직원 네트워크 ===
MATCH (c:Company)<-[:WORKS_AT]-(p:Person)
RETURN c, p;

// === 기술 허브 ===
MATCH (p:Person)-[:HAS_SKILL]->(s:Skill)
RETURN p, s
LIMIT 50;

// === 친구 네트워크 (User1 중심) ===
MATCH (me:Person {name: 'User1'})-[:KNOWS*1..2]-(friend)
RETURN me, friend;`,
            hints: [
              'LIMIT으로 노드 수 제한 (성능)',
              '노드와 관계 모두 RETURN해야 시각화',
              '너무 많은 노드는 브라우저 성능 저하'
            ],
            keyPoints: [
              'RETURN n으로 노드 시각화',
              '노드 색상/크기 커스터마이징',
              'Export as PNG로 이미지 저장'
            ]
          }
        },
        {
          id: 'kg-code-review-reading',
          type: 'reading',
          title: '코드 리뷰 체크리스트 & 자가 점검',
          duration: 15,
          content: {
            objectives: [
              '프로젝트 품질 자가 점검',
              '코드 리뷰 기준 학습',
              '개선점 식별'
            ],
            markdown: `
## 코드 리뷰 체크리스트

### 1. 데이터 모델 검토

- [ ] 노드 레이블이 명확한가? (단수형, PascalCase)
- [ ] 관계 타입이 동사형인가? (KNOWS, WORKS_AT)
- [ ] 속성 이름이 일관성 있는가? (camelCase)
- [ ] 필수 속성이 모두 정의되어 있는가?

### 2. 데이터 품질 검토

- [ ] 최소 30개 노드가 생성되었는가?
- [ ] 최소 50개 관계가 생성되었는가?
- [ ] 고아 노드(관계 없는 노드)가 없는가?
- [ ] 중복 데이터가 없는가?

### 3. 쿼리 품질 검토

- [ ] 5개 비즈니스 쿼리가 모두 동작하는가?
- [ ] 쿼리에 적절한 주석이 있는가?
- [ ] 결과가 의도한 대로 반환되는가?
- [ ] 성능이 적절한가? (LIMIT 사용 등)

### 4. 시각화 검토

- [ ] 그래프가 명확하게 표시되는가?
- [ ] 노드 타입별 색상 구분이 되어 있는가?
- [ ] 스크린샷이 캡처되어 있는가?

### 5. 문서화 검토

- [ ] README.md가 작성되어 있는가?
- [ ] 데이터 모델 다이어그램이 있는가?
- [ ] 각 파일의 목적이 설명되어 있는가?

### 흔한 실수들

| 실수 | 해결 방법 |
|-----|---------|
| 관계 방향 누락 | 항상 -> 또는 <- 명시 |
| 중복 관계 생성 | MERGE 사용 고려 |
| 고아 노드 | 모든 노드에 최소 1개 관계 |
| 성능 저하 | 인덱스 생성, LIMIT 사용 |

### 개선 포인트

1. **데이터 현실성**: 실제 회사명, 기술명 사용
2. **관계 풍부성**: 더 다양한 관계 타입 추가
3. **쿼리 복잡도**: WITH, CASE 활용
4. **시각화 품질**: 색상, 레이아웃 최적화

### 제출 전 최종 점검

\`\`\`
□ schema.cypher 실행 확인
□ data.cypher 실행 확인
□ queries.cypher 5개 모두 동작
□ 스크린샷 4장 이상
□ README.md 작성 완료
\`\`\`

축하합니다! 이번 주 학습을 완료했습니다. 🎉
            `,
            keyPoints: [
              '노드: 단수형 PascalCase',
              '관계: 동사형 UPPER_SNAKE_CASE',
              '최소 30노드, 50관계, 5쿼리'
            ]
          }
        }
      ],
      challenge: {
        id: 'kg-project-extension-challenge',
        type: 'challenge',
        title: '프로젝트 확장 챌린지',
        duration: 30,
        description: '추가 노드 타입(City, Interest) 및 관계 추가, 복잡한 추천 쿼리 구현',
        access: 'pro',
        content: {
          objectives: [
            '데이터 모델 확장 능력 향상',
            '복잡한 추천 알고리즘 구현',
            '실전 프로젝트 경험'
          ],
          requirements: [
            'City 노드 추가 (서울, 부산, 판교 등)',
            'Interest 노드 추가 (여행, 음악, 운동 등)',
            'LIVES_IN, INTERESTED_IN 관계 추가',
            '같은 도시 + 같은 관심사 친구 추천 쿼리',
            '기술 기반 회사 추천 쿼리'
          ],
          evaluationCriteria: [
            '확장 모델 설계 (30점)',
            '추가 데이터 생성 (20점)',
            '복잡한 추천 쿼리 (30점)',
            '창의적 인사이트 (20점)'
          ],
          instructions: `
## 챌린지: 프로젝트 확장

### 추가 노드

\`\`\`cypher
// City 노드
CREATE (seoul:City {name: 'Seoul', country: 'Korea'})
CREATE (busan:City {name: 'Busan', country: 'Korea'})
CREATE (pangyo:City {name: 'Pangyo', country: 'Korea'})

// Interest 노드
CREATE (travel:Interest {name: 'Travel'})
CREATE (music:Interest {name: 'Music'})
CREATE (sports:Interest {name: 'Sports'})
CREATE (gaming:Interest {name: 'Gaming'})
\`\`\`

### 추가 관계

\`\`\`cypher
// LIVES_IN 관계
MATCH (p:Person), (c:City)
WHERE rand() < 0.3
CREATE (p)-[:LIVES_IN]->(c)

// INTERESTED_IN 관계
MATCH (p:Person), (i:Interest)
WHERE rand() < 0.4
CREATE (p)-[:INTERESTED_IN]->(i)
\`\`\`

### 고급 추천 쿼리

#### 같은 도시 + 같은 관심사 친구 추천
\`\`\`cypher
MATCH (me:Person {name: 'User1'})-[:LIVES_IN]->(city)<-[:LIVES_IN]-(neighbor)
MATCH (me)-[:INTERESTED_IN]->(interest)<-[:INTERESTED_IN]-(neighbor)
WHERE NOT (me)-[:KNOWS]-(neighbor) AND neighbor <> me
RETURN neighbor.name,
       city.name AS sameCity,
       collect(interest.name) AS sharedInterests,
       count(interest) AS interestScore
ORDER BY interestScore DESC
LIMIT 5
\`\`\`

#### 기술 기반 회사 추천
\`\`\`cypher
MATCH (me:Person {name: 'User1'})-[:HAS_SKILL]->(skill)<-[:HAS_SKILL]-(other)-[:WORKS_AT]->(company)
WHERE NOT (me)-[:WORKS_AT]->(company)
RETURN company.name,
       collect(DISTINCT skill.name) AS matchingSkills,
       count(DISTINCT other) AS employeesWithSameSkills
ORDER BY employeesWithSameSkills DESC
LIMIT 3
\`\`\`

### 보너스

- 가중치 기반 추천 점수 계산
- 회사 성장률 예측 쿼리
- 네트워크 중심성 분석
          `,
          bonusPoints: [
            'PageRank 알고리즘 적용',
            '시계열 데이터 분석',
            '대시보드 UI 구현'
          ]
        }
      }
    }
  ]
}
