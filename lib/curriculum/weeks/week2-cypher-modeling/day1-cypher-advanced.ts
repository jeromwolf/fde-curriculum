// Day 1: Cypher 고급 쿼리
// Week 2의 첫째 날 - 변수 길이 경로, 최단 경로, 파이프라인 쿼리
import type { Day } from './types'

export const day1CypherAdvanced: Day = {
  slug: 'cypher-advanced',
  title: 'Cypher 고급 쿼리',
  totalDuration: 240,
  tasks: [
    // ============================================
    // Task 1: Day 1 학습 목표 오버뷰
    // ============================================
    {
      id: 'day1-overview',
      type: 'reading',
      title: 'Day 1 학습 목표',
      duration: 5,
      content: {
        objectives: [
          'Cypher 고급 패턴 매칭 기법을 마스터한다',
          '변수 길이 경로와 최단 경로 알고리즘을 활용한다',
          '집계 함수와 파이프라인 쿼리로 복잡한 분석을 수행한다',
          'Cypher Playground에서 실시간 쿼리를 실습한다'
        ],
        markdown: `
## Day 1: Cypher 고급 쿼리

### 오늘 배울 내용

Week 1에서 기본 Cypher CRUD를 배웠다면, 오늘은 **실무에서 필요한 고급 쿼리 패턴**을 학습합니다.

| 주제 | 핵심 개념 | 실무 활용 |
|------|----------|----------|
| **변수 길이 경로** | \`*1..3\`, \`*\` | 소셜 네트워크 N촌 관계, 추천 시스템 |
| **최단 경로** | \`shortestPath\`, \`allShortestPaths\` | 네트워크 분석, 경로 최적화 |
| **파이프라인 쿼리** | \`WITH\`, \`UNWIND\` | 복잡한 다단계 분석 |
| **집계 함수** | \`collect\`, \`reduce\` | 통계, 리포트 생성 |
| **조건부 로직** | \`CASE\`, \`COALESCE\` | 동적 데이터 변환 |

### Week 1 복습 연결

> **기억하세요**: Week 1에서 배운 \`MATCH\`, \`CREATE\`, \`MERGE\`가 기초입니다.
> 오늘은 이 기초 위에 **패턴의 확장**과 **데이터 파이프라인**을 쌓습니다.

### 실습 환경

오늘의 모든 쿼리는 **Cypher Playground**에서 직접 실행할 수 있습니다.
각 섹션 끝에 있는 "실습하기" 버튼을 눌러 바로 테스트해보세요.

### 학습 순서

1. 📹 변수 길이 경로 (20분)
2. 📖 최단 경로 알고리즘 (15분)
3. 💻 경로 쿼리 실습 (30분)
4. 📹 WITH와 파이프라인 (20분)
5. 📖 집계 함수 심화 (15분)
6. 💻 집계 쿼리 실습 (30분)
7. ✅ Day 1 퀴즈 (15분)
8. 🏆 Day 1 도전 과제 (30분)

### 실무 적용 시나리오

오늘 배우는 기술은 다음과 같은 실무 상황에서 사용됩니다:

- **LinkedIn 스타일 추천**: "알 수도 있는 사람" 기능
- **사기 탐지**: 의심스러운 거래 네트워크 추적
- **공급망 분석**: 원자재부터 최종 제품까지의 경로
- **조직 분석**: 보고 라인, 의사결정 경로
- **영향력 분석**: 소셜 미디어 인플루언서 식별
        `
      }
    },

    // ============================================
    // Task 2: 변수 길이 경로 비디오
    // ============================================
    {
      id: 'variable-length-paths-video',
      type: 'video',
      title: 'Cypher 변수 길이 경로 패턴',
      duration: 20,
      content: {
        objectives: [
          '변수 길이 경로 문법을 완벽히 이해한다',
          '경로 범위 지정 방법을 익힌다',
          '실무 활용 사례를 파악한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=cypher-variable-paths',
        transcript: `
## 변수 길이 경로 (Variable-Length Paths)

### 왜 변수 길이 경로가 필요한가?

실제 그래프 데이터에서는 **정확히 몇 단계를 거쳐야 하는지 모르는 경우**가 많습니다.

**예시 상황:**
- 소셜 네트워크에서 "친구의 친구의 친구..."를 찾을 때
- 조직도에서 "부하 직원의 부하 직원..."을 찾을 때
- 공급망에서 "원자재부터 최종 제품까지" 추적할 때
- 금융에서 "자금 세탁 경로" 추적할 때

### 기본 문법 비교

\`\`\`cypher
// ❌ 고정 길이: 정확히 2단계만 매칭
MATCH (a)-[:KNOWS]->(b)-[:KNOWS]->(c)
RETURN a, b, c

// ✅ 변수 길이: 1~3단계 어디든 매칭
MATCH (a)-[:KNOWS*1..3]->(c)
RETURN a, c
\`\`\`

### 범위 지정 완전 가이드

| 패턴 | 의미 | 예시 |
|------|------|------|
| \`*1..3\` | 1단계에서 3단계 사이 | 1촌~3촌 친구 |
| \`*..3\` | 0단계에서 3단계 사이 (자기 포함) | 자기 자신도 포함할 때 |
| \`*2..\` | 2단계 이상 (상한 없음) | ⚠️ 위험! 성능 이슈 |
| \`*\` | 모든 길이 | ⚠️ 매우 위험! |
| \`*2\` | 정확히 2단계 | 2촌만 찾을 때 |
| \`*0..1\` | 0 또는 1단계 | 선택적 관계 |

### 경로 길이별 상세 예시

\`\`\`cypher
// 1촌 친구 (직접 연결)
MATCH (me:Person {name: 'Alice'})-[:KNOWS]->(friend)
RETURN friend.name as firstDegree

// 2촌 친구 (친구의 친구, 1촌 제외)
MATCH (me:Person {name: 'Alice'})-[:KNOWS*2]->(friend2)
WHERE NOT (me)-[:KNOWS]->(friend2)  // 이미 1촌이 아닌 경우만
  AND me <> friend2                  // 자기 자신 제외
RETURN DISTINCT friend2.name as secondDegree

// 1~3촌 모두 한번에
MATCH path = (me:Person {name: 'Alice'})-[:KNOWS*1..3]->(friend)
WHERE me <> friend
RETURN friend.name, length(path) as degree
ORDER BY degree
\`\`\`

### 경로 객체 활용

\`\`\`cypher
// path 변수로 경로 전체를 캡처
MATCH path = (start:Person)-[:KNOWS*1..4]->(end:Person)
RETURN
  path,                           // 전체 경로 객체
  nodes(path) as pathNodes,       // 경로의 모든 노드 [리스트]
  relationships(path) as pathRels, // 경로의 모든 관계 [리스트]
  length(path) as pathLength       // 경로 길이 (홉 수)

// 경로 노드를 문자열로 변환
MATCH path = (a:Person)-[:KNOWS*1..3]->(b:Person)
RETURN [node IN nodes(path) | node.name] as route
// 결과: ['Alice', 'Bob', 'Charlie']
\`\`\`

### 실무 예시: LinkedIn 스타일 추천

\`\`\`cypher
// "알 수도 있는 사람" 추천 (2촌)
MATCH (me:Person {name: 'Alice'})-[:CONNECTED]->(mutual)-[:CONNECTED]->(recommendation)
WHERE NOT (me)-[:CONNECTED]->(recommendation)  // 아직 연결 안됨
  AND me <> recommendation                      // 자기 자신 제외
WITH recommendation, count(mutual) as mutualCount, collect(mutual.name) as mutualNames
WHERE mutualCount >= 2  // 공통 연결이 2명 이상일 때만 추천
RETURN
  recommendation.name as suggestedConnection,
  mutualCount as sharedConnections,
  mutualNames[0..3] as sampleMutuals  // 공통 연결 3명만 표시
ORDER BY mutualCount DESC
LIMIT 10
\`\`\`

### 성능 최적화 필수 사항

\`\`\`cypher
// ⚠️ 절대 금지: 상한 없는 변수 길이
MATCH (a)-[:KNOWS*]->(b)  // 그래프 전체 탐색 가능!
RETURN a, b               // 메모리 폭발, 타임아웃

// ✅ 안전한 패턴 1: 상한 지정
MATCH (a)-[:KNOWS*1..5]->(b)
RETURN a, b

// ✅ 안전한 패턴 2: LIMIT 함께 사용
MATCH (a)-[:KNOWS*1..5]->(b)
RETURN a, b
LIMIT 100

// ✅ 안전한 패턴 3: 시작점 제한
MATCH (a:Person {name: 'Alice'})-[:KNOWS*1..5]->(b)
RETURN b
\`\`\`

### 관계 필터링

\`\`\`cypher
// 특정 속성을 가진 관계만 탐색
MATCH path = (a:Person)-[r:KNOWS*1..3]->(b:Person)
WHERE ALL(rel IN relationships(path) WHERE rel.since >= 2020)
RETURN path

// 여러 관계 타입 허용
MATCH path = (a:Person)-[:KNOWS|WORKS_WITH*1..3]->(b:Person)
RETURN path
\`\`\`

### 핵심 정리

1. **기본**: \`*min..max\` 형식으로 경로 길이 범위 지정
2. **경로 객체**: \`nodes(path)\`, \`relationships(path)\`, \`length(path)\`
3. **중복 제거**: \`DISTINCT\` 또는 \`collect(DISTINCT ...)\`
4. **필수 안전 규칙**: 항상 상한 지정, LIMIT 사용, 시작점 제한

> **다음 섹션**: 최단 경로 알고리즘으로 두 노드 간 가장 효율적인 경로를 찾는 방법을 배웁니다.
        `
      }
    },

    // ============================================
    // Task 3: 최단 경로 알고리즘 리딩
    // ============================================
    {
      id: 'shortest-path-reading',
      type: 'reading',
      title: '최단 경로 알고리즘',
      duration: 15,
      content: {
        objectives: [
          'shortestPath 함수 사용법을 익힌다',
          'allShortestPaths와의 차이를 이해한다',
          '조건부 경로 탐색을 구현한다'
        ],
        markdown: `
## 최단 경로 알고리즘

### shortestPath 함수

두 노드 사이의 **가장 짧은 경로 하나**를 찾습니다.

\`\`\`cypher
// 기본 사용법
MATCH path = shortestPath(
  (alice:Person {name: 'Alice'})-[:KNOWS*]-(bob:Person {name: 'Bob'})
)
RETURN path, length(path) as hops

// 경로 상세 정보
MATCH path = shortestPath(
  (start:Person {name: 'Alice'})-[:KNOWS*]-(end:Person {name: 'Frank'})
)
RETURN
  [node IN nodes(path) | node.name] as route,
  length(path) as totalHops
\`\`\`

### allShortestPaths

동일한 최단 거리를 가진 **모든 경로**를 반환합니다.

\`\`\`cypher
// 같은 길이의 모든 최단 경로
MATCH path = allShortestPaths(
  (alice:Person {name: 'Alice'})-[:KNOWS*]-(charlie:Person {name: 'Charlie'})
)
RETURN
  [node IN nodes(path) | node.name] as route,
  length(path) as hops
\`\`\`

### 함수 비교표

| 함수 | 반환 결과 | 사용 시점 | 성능 |
|------|----------|----------|------|
| \`shortestPath\` | 최단 경로 1개 | 빠른 결과 필요 시 | 빠름 |
| \`allShortestPaths\` | 모든 최단 경로 | 대안 경로 분석 | 상대적 느림 |

### 조건부 최단 경로

\`\`\`cypher
// 특정 노드를 반드시 경유
MATCH path = shortestPath(
  (start:Person {name: 'Alice'})-[:KNOWS*]-(end:Person {name: 'Charlie'})
)
WHERE ANY(node IN nodes(path) WHERE node.name = 'Bob')
RETURN path

// 특정 노드를 제외
MATCH path = shortestPath(
  (start:Person {name: 'Alice'})-[:KNOWS*]-(end:Person {name: 'Charlie'})
)
WHERE NONE(node IN nodes(path) WHERE node.name = 'Eve')
RETURN path

// 모든 노드가 특정 조건 충족
MATCH path = shortestPath(
  (start:Person {name: 'Alice'})-[:KNOWS*]-(end:Person {name: 'Charlie'})
)
WHERE ALL(node IN nodes(path) WHERE node.active = true)
RETURN path
\`\`\`

### 실무 예시: 조직도 분석

\`\`\`cypher
// 직원에서 CEO까지의 보고 라인
MATCH path = shortestPath(
  (employee:Employee {name: '김신입'})-[:REPORTS_TO*]->(ceo:Employee {title: 'CEO'})
)
RETURN
  [node IN nodes(path) | node.name + ' (' + node.title + ')'] as reportingChain,
  length(path) as levels

// 결과 예시:
// ['김신입 (주니어)', '박팀장 (팀장)', '이부장 (부장)', '최사장 (CEO)']
// levels: 3
\`\`\`

### 두 사람 간의 최소 공통 상사 찾기

\`\`\`cypher
// Alice와 Bob의 공통 상사 중 가장 가까운 사람
MATCH
  path1 = shortestPath((alice:Employee {name: 'Alice'})-[:REPORTS_TO*]->(boss)),
  path2 = shortestPath((bob:Employee {name: 'Bob'})-[:REPORTS_TO*]->(boss))
RETURN
  boss.name as commonManager,
  boss.title as title,
  length(path1) as aliceDistance,
  length(path2) as bobDistance,
  length(path1) + length(path2) as totalDistance
ORDER BY totalDistance
LIMIT 1
\`\`\`

### 경로 길이 제한

\`\`\`cypher
// 최대 5홉 이내의 최단 경로만
MATCH path = shortestPath(
  (a:Person)-[:KNOWS*..5]-(b:Person)
)
WHERE a.name = 'Alice' AND b.name = 'Zoe'
RETURN path

// 경로가 없으면 NULL 반환
// OPTIONAL 패턴으로 처리 가능
\`\`\`

### 가중치 경로 (참고)

기본 Cypher의 shortestPath는 **홉 수 기반**입니다.
**가중치(거리, 비용) 기반** 최단 경로는 APOC이나 GDS가 필요합니다.

\`\`\`cypher
// Day 4에서 다룰 APOC Dijkstra
CALL apoc.algo.dijkstra(
  startNode, endNode, 'ROAD', 'distance'
) YIELD path, weight
RETURN path, weight as totalDistance
\`\`\`

### 핵심 정리

| 개념 | 설명 |
|------|------|
| \`shortestPath\` | 가장 빠른 단일 최단 경로 |
| \`allShortestPaths\` | 동일 거리의 모든 경로 |
| \`ANY/ALL/NONE\` | 경로 조건 필터링 |
| 경로 길이 제한 | \`*..5\` 형식으로 상한 지정 |
        `
      }
    },

    // ============================================
    // Task 4: 경로 쿼리 실습
    // ============================================
    {
      id: 'path-query-practice',
      type: 'code',
      title: '경로 쿼리 실습',
      duration: 30,
      content: {
        objectives: [
          '변수 길이 경로 쿼리를 작성한다',
          '최단 경로 함수를 활용한다',
          '경로 분석 쿼리를 구현한다'
        ],
        instructions: `
## 🎯 왜 경로 쿼리를 배우는가?

### Week 1과의 연결
> **Week 1**에서 기본 MATCH, CREATE, MERGE를 배웠습니다.
> 하지만 "친구의 친구"를 찾으려면 \`-[:KNOWS]->()-[:KNOWS]->\` 처럼
> 관계를 일일이 나열해야 했습니다. 이제 **변수 길이 경로**로 이를 간소화합니다.

### 문제 상황
소셜 네트워크나 조직도에서 자주 발생하는 질문들:
- 👥 "나와 이 사람은 몇 촌일까?"
- 🔍 "A와 B 사이의 최단 연결은?"
- 📊 "공통 친구가 누구지?"
- 🌐 "나의 네트워크 영향력은 얼마나 될까?"

순수 MATCH로는 모든 경로 길이를 일일이 쿼리해야 하고,
최단 경로를 찾으려면 복잡한 로직이 필요합니다.

### 해결책: 변수 길이 경로 & shortestPath
> 🗺️ **비유**: 지도에서 목적지까지 가는 모든 길 vs 가장 빠른 길
>
> 변수 길이 경로 = 1~3시간 내 갈 수 있는 모든 장소 찾기
> shortestPath = 가장 빠른 길 찾기

---

## ⚠️ Common Pitfalls (자주 하는 실수)

### 1. [성능] 상한 없는 변수 길이 경로

**증상**: 쿼리가 타임아웃되거나 메모리 부족

\`\`\`cypher
// ❌ 잘못된 예시 - 상한 없음
MATCH (a)-[:KNOWS*]->(b)
RETURN a, b
\`\`\`

**왜 잘못되었나**: 그래프 전체를 탐색할 수 있어 기하급수적 복잡도

\`\`\`cypher
// ✅ 올바른 예시 - 상한 지정
MATCH (a)-[:KNOWS*1..5]->(b)
RETURN a, b
LIMIT 100
\`\`\`

> **기억하세요**: 변수 길이 경로는 항상 상한을 지정하세요. \`*..5\` 형식이 안전합니다.

---

### 2. [로직] 자기 자신 포함 문제

**증상**: 결과에 시작 노드가 포함됨

\`\`\`cypher
// ❌ 잘못된 예시 - 자기 자신 미제외
MATCH (alice:Person {name: 'Alice'})-[:KNOWS*1..3]->(friend)
RETURN friend.name
\`\`\`

**왜 잘못되었나**: 순환 경로가 있으면 Alice 자신도 결과에 포함될 수 있음

\`\`\`cypher
// ✅ 올바른 예시 - 자기 자신 제외
MATCH (alice:Person {name: 'Alice'})-[:KNOWS*1..3]->(friend)
WHERE alice <> friend
RETURN friend.name
\`\`\`

---

### 3. [중복] DISTINCT 미사용

**증상**: 같은 사람이 여러 번 나타남

\`\`\`cypher
// ❌ 잘못된 예시 - 여러 경로로 같은 사람 도달
MATCH (a)-[:KNOWS*1..3]->(b)
RETURN b.name
\`\`\`

\`\`\`cypher
// ✅ 올바른 예시 - 중복 제거
MATCH (a)-[:KNOWS*1..3]->(b)
RETURN DISTINCT b.name
\`\`\`

---

## 실습: 경로 쿼리

### 사전 준비: 소셜 네트워크 데이터

**Cypher Playground**에서 다음 데이터를 먼저 생성합니다:

\`\`\`cypher
// 소셜 네트워크 샘플 데이터
CREATE (alice:Person {name: 'Alice', age: 28, city: 'Seoul'})
CREATE (bob:Person {name: 'Bob', age: 32, city: 'Seoul'})
CREATE (charlie:Person {name: 'Charlie', age: 35, city: 'Busan'})
CREATE (diana:Person {name: 'Diana', age: 29, city: 'Seoul'})
CREATE (eve:Person {name: 'Eve', age: 31, city: 'Incheon'})
CREATE (frank:Person {name: 'Frank', age: 40, city: 'Busan'})
CREATE (grace:Person {name: 'Grace', age: 27, city: 'Seoul'})

// 친구 관계 (양방향 KNOWS)
CREATE (alice)-[:KNOWS {since: 2020}]->(bob)
CREATE (alice)-[:KNOWS {since: 2021}]->(diana)
CREATE (bob)-[:KNOWS {since: 2019}]->(charlie)
CREATE (bob)-[:KNOWS {since: 2022}]->(eve)
CREATE (charlie)-[:KNOWS {since: 2018}]->(frank)
CREATE (diana)-[:KNOWS {since: 2021}]->(eve)
CREATE (eve)-[:KNOWS {since: 2020}]->(frank)
CREATE (grace)-[:KNOWS {since: 2022}]->(alice)
CREATE (grace)-[:KNOWS {since: 2023}]->(diana)
\`\`\`

---

### 과제 1: N촌 관계 찾기 (15점)

Alice의 1촌, 2촌, 3촌 친구를 각각 찾으세요.
- 중복 제거 필수
- 자기 자신 제외
- 각 촌수별로 별도 쿼리 또는 UNION 사용

---

### 과제 2: 최단 경로 분석 (15점)

Alice에서 Frank까지의 최단 경로를 찾고:
- 경유하는 사람들의 이름을 리스트로 출력
- 총 홉 수 출력
- 가능한 모든 최단 경로도 찾기 (allShortestPaths)

---

### 과제 3: 공통 친구 분석 (10점)

Alice와 Eve의 공통 친구(1촌)를 찾고:
- 공통 친구의 이름 출력
- 각 공통 친구와 Alice, Eve가 언제부터 친구인지 출력

---

### 과제 4: 연결 강도 분석 (10점)

각 사람별로 2촌 이내의 연결 수를 계산하세요.
- 본인 제외
- 중복 제거
- 연결 수 내림차순 정렬

---

### 보너스: 네트워크 허브 찾기 (10점 추가)

가장 많은 1촌 연결을 가진 사람 3명을 찾고,
각자의 연결 목록도 함께 출력하세요.
        `,
        starterCode: `// 📌 Cypher Playground에서 실행하세요
// 먼저 위의 샘플 데이터를 생성해주세요!

// ========================================
// 과제 1: N촌 관계 찾기
// ========================================

// [WHY] 왜 변수 길이 경로를 사용하는가:
// - 고정 경로 (a)->()->(b)는 정확히 2촌만 매칭
// - 변수 경로 *1..3은 1~3촌을 한 번에 탐색
// - 각 촌수별로 분리하면 결과를 명확히 구분 가능

// [SELECTION GUIDE] 선택 기준:
// - *2 vs *1..2: *2는 "정확히 2촌", *1..2는 "1촌 또는 2촌"
// - 1촌 제외할 때: WHERE NOT (a)-[:KNOWS]->(b) 패턴 사용
// - 자기 자신 제외: WHERE a <> b 필수!

// 1촌 (직접 연결) - 예시 (완성됨)
MATCH (alice:Person {name: 'Alice'})-[:KNOWS]->(friend1)
RETURN '1촌' as degree, collect(friend1.name) as friends

// [TODO] 2촌 찾기 구현:
// Step 1: *2로 정확히 2촌 경로 매칭
// Step 2: 1촌 친구 제외 (이미 직접 연결된 사람)
// Step 3: 자기 자신 제외
// Step 4: DISTINCT로 중복 제거
// MATCH (alice:Person {name: 'Alice'})-[:KNOWS*2]->(friend2)
// WHERE NOT ... AND alice <> friend2
// RETURN ...

// [TODO] 3촌 찾기 구현:
// Step 1: *3으로 정확히 3촌 경로 매칭
// Step 2: 1촌, 2촌 모두 제외
// Step 3: 자기 자신 제외
// MATCH ...

// ----------------------------------------

// ========================================
// 과제 2: 최단 경로 분석
// ========================================

// [WHY] shortestPath vs allShortestPaths:
// - shortestPath: 가장 빠른 하나의 경로만 (성능 우선)
// - allShortestPaths: 같은 길이의 모든 경로 (분석 목적)
// - 실무에서는 보통 shortestPath로 빠른 결과 확인 후,
//   필요시 allShortestPaths로 대안 분석

// [SELECTION GUIDE] 파라미터:
// - *: 무제한 (위험! 사용 금지)
// - *..10: 최대 10홉까지만 (안전)
// - 방향: -> 단방향, - 양방향 (사회적 관계는 보통 양방향)

// [TODO] Alice → Frank 최단 경로 (단일)
// Step 1: shortestPath 함수 사용
// Step 2: 양방향 관계로 탐색 (친구 관계는 양방향)
// Step 3: nodes(path)로 경로 노드 추출
// MATCH path = shortestPath(
//   (alice:Person {name: 'Alice'})-[:KNOWS*]-(frank:Person {name: 'Frank'})
// )
// RETURN ...

// [TODO] Alice → Frank 모든 최단 경로
// allShortestPaths 사용
// MATCH path = allShortestPaths(...)
// RETURN ...

// ----------------------------------------

// ========================================
// 과제 3: 공통 친구 분석
// ========================================

// [WHY] 공통 친구 분석이 중요한 이유:
// - LinkedIn "알 수도 있는 사람" 추천의 핵심
// - 공통 친구가 많을수록 연결 가능성 높음

// [SELECTION GUIDE] 방향 선택:
// - ->: 단방향 (내가 친구 추가한 경우만)
// - -: 양방향 (서로 친구인 경우)
// - 소셜 네트워크에서는 보통 양방향 사용

// [TODO] Alice와 Eve의 공통 친구
// Step 1: Alice와 mutual 연결 (양방향)
// Step 2: mutual과 Eve 연결 (양방향)
// Step 3: since 속성으로 언제부터 친구인지 확인
// MATCH (alice:Person {name: 'Alice'})-[r1:KNOWS]-(mutual)-[r2:KNOWS]-(eve:Person {name: 'Eve'})
// WHERE alice <> eve
// RETURN ...

// ----------------------------------------

// ========================================
// 과제 4: 연결 강도 분석
// ========================================

// [WHY] 연결 강도 분석:
// - 네트워크에서 "영향력 있는 사람" 식별
// - 직접 연결(1촌) + 간접 연결(2촌)의 총합
// - 마케팅, 인플루언서 식별에 활용

// [SELECTION GUIDE]:
// - *1..2: 1촌과 2촌 동시 탐색
// - count(DISTINCT connected): 중복 제거된 연결 수
// - 자기 자신 제외 필수

// [TODO] 2촌 이내 연결 수 계산
// Step 1: 각 person에서 1~2촌 관계 매칭
// Step 2: 자기 자신 제외
// Step 3: DISTINCT로 중복 제거 후 카운트
// Step 4: 연결 수 내림차순 정렬
// MATCH (person:Person)-[:KNOWS*1..2]-(connected:Person)
// WHERE person <> connected
// WITH ...
// RETURN ...

// ----------------------------------------

// ========================================
// 보너스: 네트워크 허브
// ========================================

// [WHY] 허브 식별:
// - 가장 많은 연결을 가진 노드 = 네트워크의 허브
// - 정보 전파, 바이럴 마케팅의 핵심 타겟

// [TODO] 가장 많은 1촌 연결을 가진 사람 TOP 3
// Step 1: 각 person의 친구 관계 매칭
// Step 2: collect()로 친구 목록 수집
// Step 3: count()로 연결 수 계산
// Step 4: ORDER BY DESC + LIMIT 3
// MATCH (person:Person)-[:KNOWS]-(friend:Person)
// WITH person, collect(friend.name) as friendList, count(friend) as connectionCount
// RETURN ...
`,
        solutionCode: `// ========================================
// 과제 1: N촌 관계 찾기
// ========================================

// [WHY] 촌수별 분리 이유:
// 1촌, 2촌, 3촌을 한 번에 구하면 결과가 섞여서 구분이 어려움
// 각 촌수별로 쿼리를 나누면 명확한 결과 확인 가능

// [STEP 1] 1촌 (직접 연결된 친구)
// 가장 단순한 케이스: 한 홉 관계만 매칭
MATCH (alice:Person {name: 'Alice'})-[:KNOWS]->(friend1)
RETURN '1촌' as degree, collect(friend1.name) as friends

// [RESULT] 결과: [Bob, Diana]
// Alice가 직접 KNOWS 관계로 연결된 두 사람

// ----------------------------------------

// [STEP 2] 2촌 (친구의 친구, 1촌 제외)
// [WHY *2 선택]: 정확히 2홉 경로만 탐색
// [WHY NOT (alice)-[:KNOWS]->(friend2)]: 이미 1촌인 사람 제외
// [WHY alice <> friend2]: 순환 경로로 자기 자신 도달 방지
MATCH (alice:Person {name: 'Alice'})-[:KNOWS*2]->(friend2)
WHERE NOT (alice)-[:KNOWS]->(friend2)  // 1촌 제외
  AND alice <> friend2                  // 자기 자신 제외
RETURN '2촌' as degree, collect(DISTINCT friend2.name) as friends

// [RESULT] 결과: [Charlie, Eve]
// [EDGE CASE] 중복 발생 가능: Alice→Bob→Charlie, Alice→Diana→Charlie
// collect(DISTINCT ...)로 중복 제거

// ----------------------------------------

// [STEP 3] 3촌 (1촌, 2촌 모두 제외)
// [WHY 두 개의 NOT 조건]: 1촌과 2촌 모두 필터링해야 순수 3촌만 남음
MATCH (alice:Person {name: 'Alice'})-[:KNOWS*3]->(friend3)
WHERE NOT (alice)-[:KNOWS]->(friend3)        // 1촌 제외
  AND NOT (alice)-[:KNOWS*2]->(friend3)      // 2촌 제외
  AND alice <> friend3                        // 자기 자신 제외
RETURN '3촌' as degree, collect(DISTINCT friend3.name) as friends

// [RESULT] 결과: [Frank]
// [ALTERNATIVE] 성능이 중요하면 *1..3으로 한 번에 찾고 length(path)로 분류

// ----------------------------------------

// ========================================
// 과제 2: 최단 경로 분석
// ========================================

// [WHY shortestPath 사용]: 두 노드 간 가장 효율적인 경로를 찾음
// [WHY 양방향 -]: 친구 관계는 상호적이므로 방향 무시
// [ALTERNATIVE] 단방향 ->: 팔로우처럼 비대칭 관계에 사용

// [STEP 1] Alice → Frank 최단 경로 (단일)
MATCH path = shortestPath(
  (alice:Person {name: 'Alice'})-[:KNOWS*]-(frank:Person {name: 'Frank'})
)
// [WHY nodes(path)]: 경로의 모든 노드를 리스트로 추출
// [WHY 리스트 컴프리헨션]: 노드 객체에서 name 속성만 추출
RETURN
  [node IN nodes(path) | node.name] as route,
  length(path) as hops

// [RESULT] 결과: ['Alice', 'Bob', 'Charlie', 'Frank'], 3홉
// [EDGE CASE] 경로가 없으면 빈 결과 반환 (NULL 아님)

// ----------------------------------------

// [STEP 2] Alice → Frank 모든 최단 경로
// [WHY allShortestPaths]: 같은 거리의 대안 경로 모두 필요할 때
// [ALTERNATIVE] 비용 고려 시 APOC의 dijkstra 사용
MATCH path = allShortestPaths(
  (alice:Person {name: 'Alice'})-[:KNOWS*]-(frank:Person {name: 'Frank'})
)
RETURN
  [node IN nodes(path) | node.name] as route,
  length(path) as hops

// [RESULT] 여러 경로 반환 가능 (모두 같은 홉 수)

// ----------------------------------------

// ========================================
// 과제 3: 공통 친구 분석
// ========================================

// [WHY 공통 친구 분석]: LinkedIn "알 수도 있는 사람" 추천의 핵심
// 공통 친구가 많을수록 새로운 연결 추천에 적합

// [WHY 양방향 -[:KNOWS]-]: 친구 관계는 상호적
// [PARAM r1, r2]: 각 관계의 since 속성에 접근하기 위해 변수 할당
MATCH (alice:Person {name: 'Alice'})-[r1:KNOWS]-(mutual)-[r2:KNOWS]-(eve:Person {name: 'Eve'})
WHERE alice <> eve  // Alice와 Eve가 같은 노드가 아닌지 확인
RETURN DISTINCT
  mutual.name as commonFriend,
  r1.since as aliceFriendSince,
  r2.since as eveFriendSince

// [RESULT] 결과: Bob (2020, 2022), Diana (2021, 2021)
// [EDGE CASE] 공통 친구가 없으면 빈 결과

// ----------------------------------------

// ========================================
// 과제 4: 연결 강도 분석
// ========================================

// [WHY 연결 강도]: 네트워크에서 영향력 있는 노드 식별
// [WHY *1..2]: 직접 연결(1촌)과 간접 연결(2촌) 동시 탐색
// [ALTERNATIVE] 각각 따로 세어서 가중치 부여 가능 (1촌x2 + 2촌x1)

MATCH (person:Person)-[:KNOWS*1..2]-(connected:Person)
WHERE person <> connected  // 자기 자신 제외
// [WHY WITH + count(DISTINCT)]:
// 같은 connected에 여러 경로로 도달 가능 → 중복 제거 필수
WITH person, count(DISTINCT connected) as connections
RETURN person.name, connections
ORDER BY connections DESC

// [RESULT] 결과: Bob 5, Alice 4, Diana 4, ...
// [INSIGHT] Bob이 가장 많은 연결 = 네트워크의 허브

// ----------------------------------------

// ========================================
// 보너스: 네트워크 허브
// ========================================

// [WHY 허브 식별]: 정보 전파, 바이럴 마케팅의 핵심 타겟
// 허브를 통해 메시지를 전달하면 빠르게 퍼짐

// [STEP 1] 각 person의 친구 관계 매칭
MATCH (person:Person)-[:KNOWS]-(friend:Person)
// [WHY collect + count 함께 사용]:
// collect: 친구 목록 (누구인지)
// count: 연결 수 (몇 명인지)
WITH person, collect(friend.name) as friendList, count(friend) as connectionCount
RETURN
  person.name as hub,
  connectionCount,
  friendList
ORDER BY connectionCount DESC
LIMIT 3

// [RESULT] 결과: Bob (4), Alice (3), Diana (3) 등
// [EDGE CASE] 동점일 경우 이름 순으로 정렬하려면 ORDER BY connectionCount DESC, person.name
`,
        hints: [
          '💡 2촌을 찾을 때 1촌을 제외하려면 WHERE NOT (a)-[:KNOWS]->(b) 사용',
          '💡 nodes(path)는 경로의 모든 노드를 리스트로 반환합니다',
          '💡 공통 친구는 양방향 관계로 탐색: -[:KNOWS]- (방향 없음)',
          '💡 DISTINCT를 사용해 중복 제거',
          '💡 collect()는 그룹별로 값을 리스트로 모읍니다'
        ]
      }
    },

    // ============================================
    // Task 5: WITH와 파이프라인 비디오
    // ============================================
    {
      id: 'with-pipeline-video',
      type: 'video',
      title: 'WITH와 파이프라인 쿼리',
      duration: 20,
      content: {
        objectives: [
          'WITH 절의 역할과 필요성을 이해한다',
          '다단계 쿼리 파이프라인을 설계한다',
          'UNWIND로 리스트를 행으로 변환한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=cypher-with-pipeline',
        transcript: `
## WITH와 파이프라인 쿼리

### WITH가 필요한 이유

SQL에서 서브쿼리나 CTE(Common Table Expression)를 사용하듯이,
Cypher에서는 **WITH**를 사용해 쿼리를 여러 단계로 나눕니다.

\`\`\`
MATCH → WITH → MATCH → WITH → RETURN
  ↓        ↓       ↓        ↓       ↓
데이터   필터링   추가     집계    최종
 수집    /변환    조인    /정렬   출력
\`\`\`

### 기본 사용법

\`\`\`cypher
// 단계별 처리 예시
MATCH (p:Person)-[:WORKS_AT]->(c:Company)
WITH c, count(p) as employeeCount      // 1단계: 회사별 직원 수 집계
WHERE employeeCount > 10               // 2단계: 10명 초과만 필터
MATCH (c)-[:LOCATED_IN]->(city:City)   // 3단계: 위치 정보 조인
RETURN c.name, employeeCount, city.name
ORDER BY employeeCount DESC
\`\`\`

### WITH의 핵심 특징 4가지

#### 1. 스코프 제한
WITH 이후에는 WITH에서 명시한 변수만 접근 가능합니다.

\`\`\`cypher
MATCH (p:Person)-[:PURCHASED]->(product)
WITH p, collect(product) as products, count(product) as total
// ⚠️ 여기서 product 변수는 더 이상 접근 불가!
// ✅ p, products, total만 사용 가능
WHERE total > 5
RETURN p.name, size(products)
\`\`\`

#### 2. 집계 후 필터링
일반 WHERE는 집계 전에 적용되지만, WITH 후 WHERE는 집계 결과를 필터링합니다.

\`\`\`cypher
// SQL의 HAVING과 유사
MATCH (c:Customer)-[:PURCHASED]->(p:Product)
WITH c, sum(p.price) as totalSpent
WHERE totalSpent > 1000000  // 집계 결과에 조건 적용
RETURN c.name, totalSpent
\`\`\`

#### 3. 중간 정렬/제한
WITH 내에서 ORDER BY, LIMIT를 적용할 수 있습니다.

\`\`\`cypher
// Top 10 고객만 추가 분석
MATCH (c:Customer)-[:PURCHASED]->(p:Product)
WITH c, sum(p.price) as totalSpent
ORDER BY totalSpent DESC
LIMIT 10  // 상위 10명만
MATCH (c)-[:LIVES_IN]->(city:City)
RETURN c.name, totalSpent, city.name
\`\`\`

#### 4. 변수 변환
변수를 새 이름으로 재정의할 수 있습니다.

\`\`\`cypher
MATCH (p:Person)
WITH p.firstName + ' ' + p.lastName as fullName, p.age as age
RETURN fullName, age
\`\`\`

### 다단계 집계 패턴

\`\`\`cypher
// 1단계: 월별 매출 집계
MATCH (o:Order)
WITH o.year as year, o.month as month, sum(o.amount) as monthlyRevenue

// 2단계: 연도별 월 평균 계산
WITH year, avg(monthlyRevenue) as avgMonthly, count(*) as monthCount

// 3단계: 정렬 및 출력
ORDER BY year
RETURN year, round(avgMonthly) as avgMonthlyRevenue, monthCount
\`\`\`

### UNWIND: 리스트를 행으로 펼치기

\`\`\`cypher
// 기본: 리스트를 개별 행으로
WITH ['Apple', 'Google', 'Microsoft'] as companies
UNWIND companies as company
CREATE (c:Company {name: company})
RETURN c

// JSON 배열 스타일 데이터 처리
WITH {name: 'Alice', skills: ['Python', 'Cypher', 'SQL']} as data
UNWIND data.skills as skill
MERGE (p:Person {name: data.name})
MERGE (s:Skill {name: skill})
MERGE (p)-[:HAS_SKILL]->(s)
RETURN p, s
\`\`\`

### 고급 패턴: 순위(Rank) 계산

\`\`\`cypher
// 매출 순위 계산 (SQL의 ROW_NUMBER 대체)
MATCH (c:Customer)-[:PURCHASED]->(p:Product)
WITH c, sum(p.price) as totalSpent
ORDER BY totalSpent DESC
WITH collect({customer: c.name, spent: totalSpent}) as ranked
UNWIND range(0, size(ranked)-1) as idx
RETURN
  idx + 1 as rank,
  ranked[idx].customer as customer,
  ranked[idx].spent as totalSpent
\`\`\`

### 핵심 정리

| 절 | 역할 | SQL 대응 |
|-----|------|----------|
| \`WITH\` | 중간 결과 전달 + 스코프 제한 | CTE, 서브쿼리 |
| \`WITH ... WHERE\` | 집계 후 필터링 | HAVING |
| \`UNWIND\` | 리스트 → 개별 행 | UNNEST, LATERAL |
| \`ORDER BY\` + \`LIMIT\` (WITH 내) | 중간 정렬/제한 | Top-N 서브쿼리 |

> **다음 섹션**: 집계 함수를 더 깊이 살펴보고, 복잡한 분석 쿼리를 작성합니다.
        `
      }
    },

    // ============================================
    // Task 6: 집계 함수 심화 리딩
    // ============================================
    {
      id: 'aggregation-deep-dive',
      type: 'reading',
      title: '집계 함수 심화',
      duration: 15,
      content: {
        objectives: [
          '모든 Cypher 집계 함수를 숙지한다',
          'collect와 reduce를 활용한 고급 패턴을 익힌다',
          '리스트 함수와의 조합을 이해한다'
        ],
        markdown: `
## 집계 함수 심화

### Cypher 집계 함수 전체 목록

| 함수 | 설명 | 예시 | NULL 처리 |
|------|------|------|----------|
| \`count()\` | 개수 | \`count(n)\`, \`count(*)\` | NULL 제외 |
| \`count(DISTINCT)\` | 고유 개수 | \`count(DISTINCT n.city)\` | NULL 제외 |
| \`sum()\` | 합계 | \`sum(n.price)\` | NULL 무시 |
| \`avg()\` | 평균 | \`avg(n.score)\` | NULL 무시 |
| \`min()\` | 최소값 | \`min(n.age)\` | NULL 무시 |
| \`max()\` | 최대값 | \`max(n.salary)\` | NULL 무시 |
| \`collect()\` | 리스트 수집 | \`collect(n.name)\` | NULL 포함 |
| \`stDev()\` | 표준편차 (모집단) | \`stDev(n.value)\` | NULL 무시 |
| \`stDevP()\` | 표준편차 (표본) | \`stDevP(n.value)\` | NULL 무시 |
| \`percentileDisc()\` | 백분위수 (이산) | \`percentileDisc(n.score, 0.9)\` | - |
| \`percentileCont()\` | 백분위수 (연속) | \`percentileCont(n.score, 0.5)\` | - |

### collect() 활용 마스터

\`\`\`cypher
// 1. 기본: 값 수집
MATCH (c:Company)<-[:WORKS_AT]-(e:Employee)
RETURN c.name, collect(e.name) as employees

// 2. DISTINCT 수집 (중복 제거)
MATCH (p:Person)-[:VISITED]->(city:City)
RETURN p.name, collect(DISTINCT city.name) as visitedCities

// 3. 객체 수집 (여러 속성을 함께)
MATCH (c:Customer)-[r:PURCHASED]->(p:Product)
RETURN c.name, collect({
  product: p.name,
  price: p.price,
  date: r.purchaseDate
}) as purchaseHistory

// 4. 크기 제한 (최근 N개)
MATCH (p:Person)-[:POSTED]->(post:Post)
WITH p, post
ORDER BY post.createdAt DESC
WITH p, collect(post.title)[0..5] as recentPosts
RETURN p.name, recentPosts

// 5. 조건부 수집
MATCH (c:Customer)-[r:PURCHASED]->(p:Product)
RETURN c.name,
  collect(CASE WHEN p.category = 'Electronics' THEN p.name END) as electronics,
  collect(CASE WHEN p.category = 'Clothing' THEN p.name END) as clothing
\`\`\`

### reduce() 고급 패턴

reduce는 리스트를 순회하며 값을 누적 계산합니다.

\`\`\`cypher
// 1. 경로의 총 거리 계산
MATCH path = (a:City {name: 'Seoul'})-[:ROAD*]-(b:City {name: 'Busan'})
RETURN reduce(
  totalDistance = 0,
  r IN relationships(path) | totalDistance + r.distance
) as totalKm

// 2. 경로 노드 이름을 문자열로 연결
MATCH path = (a:Person)-[:KNOWS*1..3]->(b:Person)
RETURN reduce(
  route = '',
  n IN nodes(path) | route + n.name + ' → '
) as pathString
// 결과: 'Alice → Bob → Charlie → '

// 3. 조건부 누적 (특정 카테고리만 합산)
MATCH (c:Customer)-[:PURCHASED]->(p:Product)
WITH c, collect(p) as products
RETURN c.name, reduce(
  total = 0,
  prod IN products |
    CASE WHEN prod.category = 'Electronics'
         THEN total + prod.price
         ELSE total
    END
) as electronicsSpent

// 4. 최대값 찾기 (reduce로 구현)
WITH [5, 2, 8, 1, 9, 3] as numbers
RETURN reduce(
  maxVal = numbers[0],
  n IN numbers | CASE WHEN n > maxVal THEN n ELSE maxVal END
) as maximum
\`\`\`

### 리스트 함수 완전 가이드

\`\`\`cypher
// size(): 리스트 크기
WITH [1, 2, 3, 4, 5] as nums
RETURN size(nums)  // 5

// head(): 첫 번째 요소
RETURN head([1, 2, 3])  // 1

// last(): 마지막 요소
RETURN last([1, 2, 3])  // 3

// tail(): 첫 번째 제외한 나머지
RETURN tail([1, 2, 3])  // [2, 3]

// range(): 숫자 시퀀스 생성
RETURN range(1, 5)  // [1, 2, 3, 4, 5]
RETURN range(0, 10, 2)  // [0, 2, 4, 6, 8, 10] (step=2)

// reverse(): 역순
RETURN reverse([1, 2, 3])  // [3, 2, 1]

// 슬라이싱
WITH ['a', 'b', 'c', 'd', 'e'] as chars
RETURN chars[0..3]  // ['a', 'b', 'c']
RETURN chars[2..]   // ['c', 'd', 'e']
RETURN chars[..-1]  // ['a', 'b', 'c', 'd']
\`\`\`

### 리스트 컴프리헨션 (Python 스타일)

\`\`\`cypher
// 필터링 (WHERE)
WITH [1, 2, 3, 4, 5, 6] as numbers
RETURN [x IN numbers WHERE x > 3] as filtered
// 결과: [4, 5, 6]

// 변환 (map)
WITH [1, 2, 3] as numbers
RETURN [x IN numbers | x * 2] as doubled
// 결과: [2, 4, 6]

// 필터 + 변환 동시에
WITH [1, 2, 3, 4, 5] as numbers
RETURN [x IN numbers WHERE x > 2 | x * x] as squaredFiltered
// 결과: [9, 16, 25]

// 노드 속성 추출
MATCH (p:Person)
WITH collect(p) as people
RETURN [person IN people | person.name] as names
\`\`\`

### 실전 패턴: 카테고리별 Top 3

\`\`\`cypher
// 카테고리별 매출 Top 3 상품
MATCH (p:Product)
WITH p.category as category, p
ORDER BY p.totalSales DESC
WITH category, collect(p)[0..3] as topProducts
RETURN category,
  [prod IN topProducts | {
    name: prod.name,
    sales: prod.totalSales
  }] as top3
\`\`\`

### 핵심 정리

| 패턴 | 용도 | 예시 |
|------|------|------|
| \`collect()\` | 그룹별 값 수집 | 고객별 주문 목록 |
| \`collect()[0..N]\` | 상위 N개만 | 최근 5개 주문 |
| \`reduce()\` | 누적 계산 | 경로 총 거리 |
| \`[x IN list WHERE ... \\| ...]\` | 필터+변환 | 조건부 리스트 처리 |
        `
      }
    },

    // ============================================
    // Task 7: 집계 쿼리 실습
    // ============================================
    {
      id: 'aggregation-practice',
      type: 'code',
      title: '집계 쿼리 실습',
      duration: 30,
      content: {
        objectives: [
          '복합 집계 쿼리를 작성한다',
          'WITH 파이프라인으로 다단계 분석을 수행한다',
          '리스트 함수를 활용한 데이터 변환을 구현한다'
        ],
        instructions: `
## 🎯 왜 집계 쿼리를 배우는가?

### Week 1, Task 4와의 연결
> **경로 쿼리**에서 \`collect()\`와 \`count()\`를 사용해봤습니다.
> 이제 더 복잡한 **다단계 집계**와 **파이프라인 쿼리**를 배웁니다.
> SQL의 GROUP BY + HAVING을 Cypher로 표현하는 방법입니다.

### 문제 상황
비즈니스 분석에서 자주 필요한 작업들:
- 📊 "카테고리별 총 매출은?"
- 🏆 "가장 많이 구매한 고객은?"
- 📈 "월별 매출 추이는?"
- 🔍 "고객별 구매 패턴 분석"

단순 MATCH와 RETURN만으로는 그룹별 통계를 내기 어렵고,
다단계 집계는 매우 복잡해집니다.

### 해결책: WITH 파이프라인 + 집계 함수
> 🏭 **비유**: 공장 생산 라인
>
> 원재료(MATCH) → 1차 가공(WITH + 집계) → 2차 가공(WITH + 필터) → 완제품(RETURN)
> 각 단계에서 중간 결과를 다음 단계로 전달

---

## ⚠️ Common Pitfalls (자주 하는 실수)

### 1. [스코프] WITH 후 변수 접근 불가

**증상**: \`Variable 'product' not defined\` 에러

\`\`\`cypher
// ❌ 잘못된 예시
MATCH (c:Customer)-[:PURCHASED]->(p:Product)
WITH c, count(p) as total
RETURN c.name, p.price  // p는 이미 스코프에서 사라짐!
\`\`\`

**왜 잘못되었나**: WITH는 스코프를 제한함. WITH에 포함하지 않은 변수는 사라짐.

\`\`\`cypher
// ✅ 올바른 예시 - 필요한 값을 WITH에 포함
MATCH (c:Customer)-[:PURCHASED]->(p:Product)
WITH c, count(p) as total, collect(p.price) as prices
RETURN c.name, total, prices
\`\`\`

> **기억하세요**: WITH 이후 사용할 변수는 반드시 WITH에 포함시키세요.

---

### 2. [집계] 집계 함수 없이 그룹화 시도

**증상**: 예상과 다른 결과 또는 에러

\`\`\`cypher
// ❌ 잘못된 예시 - 그룹화 없이 집계
MATCH (c:Customer)-[:PURCHASED]->(p:Product)
RETURN c.name, sum(p.price)  // 어떻게 그룹화?
\`\`\`

**왜 잘못되었나**: Cypher는 암시적 GROUP BY. 집계되지 않은 속성이 그룹 키가 됨.

\`\`\`cypher
// ✅ 올바른 예시 - 명시적 WITH로 그룹화 의도 명확히
MATCH (c:Customer)-[:PURCHASED]->(p:Product)
WITH c, sum(p.price) as totalSpent  // c가 그룹 키
RETURN c.name, totalSpent
\`\`\`

---

### 3. [순서] ORDER BY 위치 오류

**증상**: 정렬이 안 되거나 잘못된 정렬

\`\`\`cypher
// ❌ 잘못된 예시 - 집계 전 ORDER BY
MATCH (c:Customer)-[:PURCHASED]->(p:Product)
ORDER BY p.price DESC  // 집계 전에 정렬해도 의미 없음
WITH c, sum(p.price) as total
RETURN c.name, total
\`\`\`

\`\`\`cypher
// ✅ 올바른 예시 - 집계 후 ORDER BY
MATCH (c:Customer)-[:PURCHASED]->(p:Product)
WITH c, sum(p.price) as total
ORDER BY total DESC  // 집계 결과로 정렬
RETURN c.name, total
\`\`\`

---

## 실습: 집계와 파이프라인

### 사전 준비: E-커머스 데이터

**Cypher Playground**에서 다음 데이터를 생성합니다:

\`\`\`cypher
// E-커머스 샘플 데이터
CREATE (electronics:Category {name: 'Electronics'})
CREATE (clothing:Category {name: 'Clothing'})
CREATE (books:Category {name: 'Books'})

CREATE (laptop:Product {name: 'MacBook Pro', price: 2500000, category: 'Electronics'})
CREATE (phone:Product {name: 'iPhone 15', price: 1200000, category: 'Electronics'})
CREATE (tablet:Product {name: 'iPad Pro', price: 1500000, category: 'Electronics'})
CREATE (shirt:Product {name: 'Basic T-Shirt', price: 30000, category: 'Clothing'})
CREATE (jeans:Product {name: 'Slim Jeans', price: 80000, category: 'Clothing'})
CREATE (jacket:Product {name: 'Winter Jacket', price: 150000, category: 'Clothing'})
CREATE (book1:Product {name: 'Clean Code', price: 35000, category: 'Books'})
CREATE (book2:Product {name: 'Design Patterns', price: 45000, category: 'Books'})

CREATE (alice:Customer {name: 'Alice', tier: 'Gold', joinDate: date('2020-01-15')})
CREATE (bob:Customer {name: 'Bob', tier: 'Silver', joinDate: date('2021-06-20')})
CREATE (charlie:Customer {name: 'Charlie', tier: 'Gold', joinDate: date('2019-03-10')})
CREATE (diana:Customer {name: 'Diana', tier: 'Bronze', joinDate: date('2023-01-05')})
CREATE (eve:Customer {name: 'Eve', tier: 'Silver', joinDate: date('2022-07-15')})

// 주문 데이터
CREATE (alice)-[:PURCHASED {date: date('2024-01-10'), quantity: 1}]->(laptop)
CREATE (alice)-[:PURCHASED {date: date('2024-01-15'), quantity: 2}]->(book1)
CREATE (alice)-[:PURCHASED {date: date('2024-02-01'), quantity: 1}]->(phone)
CREATE (bob)-[:PURCHASED {date: date('2024-01-20'), quantity: 1}]->(shirt)
CREATE (bob)-[:PURCHASED {date: date('2024-02-05'), quantity: 1}]->(jeans)
CREATE (bob)-[:PURCHASED {date: date('2024-02-10'), quantity: 1}]->(book2)
CREATE (charlie)-[:PURCHASED {date: date('2024-01-05'), quantity: 1}]->(laptop)
CREATE (charlie)-[:PURCHASED {date: date('2024-01-25'), quantity: 3}]->(book2)
CREATE (charlie)-[:PURCHASED {date: date('2024-02-15'), quantity: 1}]->(tablet)
CREATE (diana)-[:PURCHASED {date: date('2024-02-10'), quantity: 1}]->(shirt)
CREATE (diana)-[:PURCHASED {date: date('2024-02-20'), quantity: 2}]->(jeans)
CREATE (eve)-[:PURCHASED {date: date('2024-01-30'), quantity: 1}]->(jacket)
CREATE (eve)-[:PURCHASED {date: date('2024-02-25'), quantity: 1}]->(phone)
\`\`\`

---

### 과제 1: 고객별 총 구매액 (15점)

각 고객의 총 구매 금액을 계산하고, 높은 순으로 정렬하세요.
- quantity * price 고려
- 주문 건수도 함께 출력

---

### 과제 2: 카테고리별 매출 분석 (15점)

카테고리별로 다음을 계산하세요:
- 총 매출
- 주문 건수
- 평균 주문 금액
- 가장 많이 팔린 상품

---

### 과제 3: 멤버십 티어별 통계 (20점)

티어별로 다음을 분석하세요:
- 고객 수
- 총 매출
- 평균 구매액
- 최고 구매 고객

---

### 과제 4: 고객 구매 프로필 (20점)

각 고객에 대해 다음을 한 줄로 요약하세요:
- 구매한 상품 목록 (리스트)
- 총 구매액
- 가장 비싼 구매 상품
- 구매 카테고리 목록 (중복 제거)

---

### 보너스: 월별 매출 트렌드 (10점 추가)

2024년 월별 매출 추이를 계산하고, 전월 대비 증감도 표시하세요.
        `,
        starterCode: `// Cypher Playground에서 실행하세요
// 먼저 위의 E-커머스 데이터를 생성해주세요!

// ========================================
// 과제 1: 고객별 총 구매액
// ========================================

// [WHY] 왜 이 과제가 중요한가:
// - 고객 가치 분석의 기본 (VIP 고객 식별)
// - 마케팅 타겟팅, 보상 프로그램 설계에 필수

// [SELECTION GUIDE] 선택 기준:
// - sum() vs count(): sum은 금액 합계, count는 건수
// - quantity * price: 관계 속성(quantity)과 노드 속성(price) 조합
// - WITH가 필요한 이유: 집계 후 다른 처리(정렬, 필터)를 위해

// [TODO] 구현 순서:
// Step 1: MATCH로 고객-구매-상품 관계 매칭
// Step 2: WITH에서 sum(r.quantity * p.price)로 총액 계산
// Step 3: count(r)로 주문 건수 계산
// Step 4: ORDER BY로 높은 순 정렬
MATCH (c:Customer)-[r:PURCHASED]->(p:Product)
WITH c.name as customer,
     c.tier as tier,
     // TODO: sum으로 총 구매액 계산
     // TODO: count로 주문 건수 계산
RETURN customer, tier, totalSpent, orderCount
ORDER BY totalSpent DESC


// ========================================
// 과제 2: 카테고리별 매출 분석
// ========================================

// [WHY] 왜 이 과제가 중요한가:
// - 상품 카테고리별 성과 분석
// - 재고 관리, 마케팅 예산 배분에 활용

// [SELECTION GUIDE] 다단계 집계가 필요한 이유:
// 1단계: 카테고리별 매출 집계
// 2단계: topProduct를 찾기 위해 UNWIND → ORDER BY → collect()[0]
// - 한 번에 안 되는 이유: collect 후 정렬해야 top을 찾음

// [TODO] 구현 순서:
// Step 1: MATCH로 구매 관계 매칭
// Step 2: 첫 번째 WITH에서 category별 기본 집계
// Step 3: UNWIND로 products 펼쳐서 매출순 정렬
// Step 4: 두 번째 WITH에서 collect()[0]으로 top 추출
// MATCH ...
// WITH category, sum(...) as totalRevenue, ...
// UNWIND products as prod
// ORDER BY prod.revenue DESC
// WITH category, ..., collect(prod.name)[0] as topProduct
// RETURN ...


// ========================================
// 과제 3: 멤버십 티어별 통계
// ========================================

// [WHY] 왜 이 과제가 중요한가:
// - 멤버십 프로그램 효과 분석
// - 티어별 혜택 설계, 업그레이드 유도 전략

// [SELECTION GUIDE] 2단계 집계:
// 1단계: 고객별 구매액 집계 (c 단위)
// 2단계: 티어별 통계 집계 (tier 단위)
// - 왜 2단계?: 고객별 구매액을 먼저 계산해야 평균/최고 고객 구할 수 있음

// [TODO] 구현 순서:
// Step 1: 고객별 구매액 먼저 계산 (1단계 집계)
// Step 2: 티어별로 다시 집계 (2단계 집계)
// Step 3: topCustomer 찾기 (UNWIND + collect()[0] 패턴)
// MATCH ...
// WITH c.tier as tier, c, sum(...) as customerSpent  // 1단계
// WITH tier, count(DISTINCT c) as customerCount, ...  // 2단계
// ...


// ========================================
// 과제 4: 고객 구매 프로필
// ========================================

// [WHY] 왜 이 과제가 중요한가:
// - 고객 360도 뷰 생성
// - 개인화 추천, 마케팅 메시지 작성에 활용

// [SELECTION GUIDE] 여러 집계 함수 조합:
// - collect(p.name): 구매 상품 목록
// - sum(...): 총 구매액
// - max(p.price): 가장 비싼 상품 가격 (이름을 찾으려면 추가 MATCH 필요)
// - collect(DISTINCT p.category): 중복 제거된 카테고리 목록

// [TODO] 구현 순서:
// Step 1: 기본 집계 (collect, sum, max)
// Step 2: 가장 비싼 상품 이름 찾기 (추가 MATCH)
// MATCH ...
// WITH c, collect(...) as products, sum(...) as totalSpent, max(p.price) as maxPrice, ...
// MATCH (c)-[:PURCHASED]->(expensive:Product)
// WHERE expensive.price = maxPrice
// RETURN ...


// ========================================
// 보너스: 월별 매출 트렌드
// ========================================

// [WHY] 왜 이 과제가 중요한가:
// - 시계열 분석의 기초
// - 계절성, 성장 트렌드 파악

// [SELECTION GUIDE] 날짜 처리 방법:
// - r.date.year, r.date.month: Neo4j date 속성에서 연/월 추출
// - 전월 대비: collect → range + 인덱싱으로 이전 값 참조
// - 고급 패턴: CASE WHEN으로 증감 표시

// [TODO] 구현 순서:
// Step 1: 월별 매출 집계
// Step 2: collect로 월별 데이터 리스트화
// Step 3: range + UNWIND로 인덱스 기반 순회
// Step 4: 이전 월 매출과 비교
// MATCH ...
// WITH r.date.year as year, r.date.month as month, sum(...) as revenue
// ORDER BY year, month
// WITH collect({year: year, month: month, revenue: revenue}) as monthly
// UNWIND range(0, size(monthly)-1) as idx
// ...
`,
        solutionCode: `// ========================================
// 과제 1: 고객별 총 구매액
// ========================================

// [WHY] 이 쿼리가 필요한 이유:
// 고객 가치(Customer Lifetime Value) 분석의 첫 단계
// VIP 고객 식별, 보상 프로그램 설계에 활용

// [STEP 1] 고객-구매-상품 관계 매칭
MATCH (c:Customer)-[r:PURCHASED]->(p:Product)

// [STEP 2] 고객별 집계
// [WHY sum(r.quantity * p.price)]:
// quantity는 관계(r) 속성, price는 노드(p) 속성
// 3개 × 10,000원 = 30,000원 으로 총 구매액 계산
WITH c.name as customer,
     c.tier as tier,
     sum(r.quantity * p.price) as totalSpent,
     count(r) as orderCount
RETURN customer, tier, totalSpent, orderCount
ORDER BY totalSpent DESC

// [RESULT] 결과:
// Charlie, Gold, 4,135,000원, 3건 (VIP 1위)
// Alice, Gold, 3,770,000원, 3건
// Eve, Silver, 1,350,000원, 2건
// [INSIGHT] Gold 티어 고객이 상위권 차지 → 멤버십 프로그램 효과 확인

// ----------------------------------------

// ========================================
// 과제 2: 카테고리별 매출 분석
// ========================================

// [WHY] 카테고리별 분석이 필요한 이유:
// 상품 포트폴리오 최적화, 마케팅 예산 배분

// [STEP 1] 첫 번째 WITH: 기본 집계
MATCH (c:Customer)-[r:PURCHASED]->(p:Product)
WITH p.category as category,
     p,
     r,
     r.quantity * p.price as orderAmount

// [STEP 2] 두 번째 WITH: 카테고리별 집계
// [WHY collect 사용]: topProduct를 찾기 위해 상품별 매출 보존
WITH category,
     sum(orderAmount) as totalRevenue,
     count(r) as orderCount,
     avg(orderAmount) as avgOrderValue,
     collect({name: p.name, revenue: orderAmount}) as products

// [STEP 3] UNWIND + ORDER BY: 매출순 정렬
// [WHY 이 패턴]: collect 후 최대값을 찾으려면 펼쳐서 정렬해야 함
UNWIND products as prod
WITH category, totalRevenue, orderCount, avgOrderValue, prod
ORDER BY prod.revenue DESC

// [STEP 4] 세 번째 WITH: topProduct 추출
// [WHY collect()[0]]: 정렬된 상태에서 첫 번째 = 최고 매출 상품
WITH category, totalRevenue, orderCount, avgOrderValue,
     collect(prod.name)[0] as topProduct
RETURN category, totalRevenue, orderCount,
       round(avgOrderValue) as avgOrderValue, topProduct
ORDER BY totalRevenue DESC

// [RESULT] 결과:
// Electronics, 8,200,000원, 5건, 1,640,000원, MacBook Pro
// Clothing, 400,000원, 5건, 80,000원, Winter Jacket
// Books, 240,000원, 3건, 80,000원, Design Patterns
// [INSIGHT] Electronics가 압도적 매출 → 해당 카테고리 마케팅 강화

// ----------------------------------------

// ========================================
// 과제 3: 멤버십 티어별 통계
// ========================================

// [WHY] 티어별 분석이 필요한 이유:
// 멤버십 프로그램 ROI 분석, 티어별 혜택 최적화

// [STEP 1] 1단계 집계: 고객별 구매액
// [WHY 2단계 집계]: 고객별 구매액을 먼저 계산해야 티어별 평균/최고 고객 구할 수 있음
MATCH (c:Customer)-[r:PURCHASED]->(p:Product)
WITH c.tier as tier,
     c,
     sum(r.quantity * p.price) as customerSpent

// [STEP 2] 2단계 집계: 티어별 통계
// [WHY count(DISTINCT c)]: 같은 고객이 여러 번 나올 수 있으므로 중복 제거
WITH tier,
     count(DISTINCT c) as customerCount,
     sum(customerSpent) as totalRevenue,
     avg(customerSpent) as avgSpent,
     collect({name: c.name, spent: customerSpent}) as customers

// [STEP 3] topCustomer 찾기 (UNWIND + 정렬 + collect()[0] 패턴)
UNWIND customers as cust
WITH tier, customerCount, totalRevenue, avgSpent, cust
ORDER BY cust.spent DESC
WITH tier, customerCount, totalRevenue, avgSpent,
     collect(cust.name)[0] as topCustomer
RETURN tier, customerCount, totalRevenue,
       round(avgSpent) as avgSpent, topCustomer
ORDER BY totalRevenue DESC

// [RESULT] 결과:
// Gold, 2명, 7,905,000원, 3,952,500원, Charlie
// Silver, 2명, 1,505,000원, 752,500원, Eve
// Bronze, 1명, 190,000원, 190,000원, Diana
// [INSIGHT] Gold 평균 구매액이 Bronze의 20배 → 멤버십 업그레이드 유도 전략 수립

// ----------------------------------------

// ========================================
// 과제 4: 고객 구매 프로필
// ========================================

// [WHY] 고객 프로필이 필요한 이유:
// 개인화 마케팅, 상품 추천, 고객 세그멘테이션

// [STEP 1] 다양한 집계 함수 조합
// [WHY collect vs collect(DISTINCT)]:
// products: 같은 상품 여러 번 구매 시 모두 표시
// categories: 중복 제거된 카테고리만 표시
MATCH (c:Customer)-[r:PURCHASED]->(p:Product)
WITH c,
     collect(p.name) as products,
     sum(r.quantity * p.price) as totalSpent,
     max(p.price) as maxItemPrice,
     collect(DISTINCT p.category) as categories

// [STEP 2] 가장 비싼 상품 이름 찾기
// [WHY 추가 MATCH]: max(p.price)는 가격만 반환, 상품 이름은 별도 조회 필요
MATCH (c)-[r:PURCHASED]->(expensive:Product)
WHERE expensive.price = maxItemPrice
RETURN
  c.name as customer,
  c.tier as tier,
  products,
  totalSpent,
  expensive.name as mostExpensive,
  categories
ORDER BY totalSpent DESC

// [RESULT] 각 고객의 360도 뷰 생성
// [EDGE CASE] 같은 가격의 상품이 여러 개면 모두 반환됨

// ----------------------------------------

// ========================================
// 보너스: 월별 매출 트렌드
// ========================================

// [WHY] 시계열 분석이 필요한 이유:
// 계절성 파악, 성장 트렌드 분석, 예측 모델 기초 데이터

// [STEP 1] 월별 매출 집계
// [WHY r.date.year, r.date.month]: Neo4j date 타입에서 연/월 추출
MATCH (c:Customer)-[r:PURCHASED]->(p:Product)
WITH r.date.year as year,
     r.date.month as month,
     sum(r.quantity * p.price) as revenue
ORDER BY year, month

// [STEP 2] 리스트로 변환 (인덱스 접근을 위해)
// [WHY collect]: 순차 데이터를 리스트로 만들어 이전 값 참조 가능하게
WITH collect({year: year, month: month, revenue: revenue}) as monthly

// [STEP 3] 인덱스 기반 순회
// [WHY range + UNWIND]: 현재 인덱스(idx)와 이전 인덱스(idx-1) 접근
UNWIND range(0, size(monthly)-1) as idx
WITH monthly[idx] as current,
     CASE WHEN idx > 0 THEN monthly[idx-1].revenue ELSE null END as prevRevenue

// [STEP 4] 전월 대비 계산
// [WHY CASE WHEN]: 첫 번째 월은 이전 데이터 없음 → 'N/A' 표시
RETURN
  current.year as year,
  current.month as month,
  current.revenue as revenue,
  CASE
    WHEN prevRevenue IS NULL THEN 'N/A'
    WHEN current.revenue > prevRevenue THEN '+' + toString(current.revenue - prevRevenue)
    ELSE toString(current.revenue - prevRevenue)
  END as vsLastMonth

// [RESULT] 결과:
// 2024, 1, 6,305,000원, N/A (첫 달)
// 2024, 2, 3,535,000원, -2,770,000 (44% 감소)
// [INSIGHT] 2월 매출 급감 → 원인 분석 필요 (계절성? 마케팅 중단?)
`,
        hints: [
          '💡 quantity * price로 총 금액 계산 - 관계 속성과 노드 속성 조합',
          '💡 collect()로 여러 값을 리스트로 모으기',
          '💡 WITH로 중간 결과를 다음 단계로 전달',
          '💡 r.date.year, r.date.month로 날짜 분리 (Neo4j date 함수)',
          '💡 collect(DISTINCT ...)로 중복 없는 리스트 생성'
        ]
      }
    },

    // ============================================
    // Task 8: Day 1 퀴즈
    // ============================================
    {
      id: 'day1-quiz',
      type: 'quiz',
      title: 'Day 1 퀴즈: Cypher 고급 쿼리',
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
            explanation: '*min..max 형식으로 경로 길이의 범위를 지정합니다. *2..4는 2홉에서 4홉 사이의 모든 경로를 매칭합니다. 예: 2촌~4촌 관계를 한 번에 찾을 수 있습니다.'
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
            explanation: 'OPTIONAL MATCH는 SQL의 LEFT OUTER JOIN과 유사하게 동작합니다. 매칭되는 패턴이 없어도 기존 행을 유지하고 NULL을 반환합니다. 예: 친구가 없는 사람도 결과에 포함됩니다.'
          },
          {
            question: 'WITH 절의 주요 역할은?',
            options: [
              '쿼리 성능을 최적화한다',
              '변수 스코프를 제한하고 중간 결과를 전달한다',
              '인덱스를 자동 생성한다',
              '트랜잭션을 커밋한다'
            ],
            answer: 1,
            explanation: 'WITH는 쿼리를 여러 단계로 나누어 처리할 때 사용합니다. WITH 이후에는 WITH에서 명시한 변수만 접근 가능하며, 집계 후 필터링(HAVING처럼) 등에 필수적입니다.'
          },
          {
            question: 'shortestPath와 allShortestPaths의 차이는?',
            options: [
              'shortestPath가 더 빠르고 allShortestPaths는 더 정확하다',
              'shortestPath는 하나의 경로만, allShortestPaths는 같은 길이의 모든 경로를 반환한다',
              'shortestPath는 무방향, allShortestPaths는 방향이 있다',
              '차이가 없다'
            ],
            answer: 1,
            explanation: 'shortestPath는 최단 경로 하나만 반환하고, allShortestPaths는 동일한 최단 거리를 가진 모든 경로를 반환합니다. 대안 경로 분석이 필요할 때 allShortestPaths를 사용합니다.'
          },
          {
            question: 'collect() 함수의 결과는?',
            options: [
              '단일 값',
              '노드 객체',
              '리스트 (배열)',
              '맵 (객체)'
            ],
            answer: 2,
            explanation: 'collect()는 그룹화된 결과를 리스트로 수집합니다. collect(n.name)은 모든 name 값을 리스트로 반환합니다. [\'Alice\', \'Bob\', \'Charlie\'] 형태입니다.'
          },
          {
            question: '다음 중 변수 길이 경로 사용 시 가장 중요한 주의사항은?',
            options: [
              '항상 *를 사용해 모든 경로를 탐색해야 한다',
              '상한 없이 사용하면 성능 이슈가 발생할 수 있다',
              '변수 길이 경로는 방향을 지정할 수 없다',
              '최소 3 이상의 길이만 지정 가능하다'
            ],
            answer: 1,
            explanation: '*나 *2.. 같이 상한 없는 변수 길이 경로는 그래프 전체를 탐색할 수 있어 메모리 폭발이나 타임아웃이 발생할 수 있습니다. 항상 합리적인 상한(예: *1..5)을 지정하세요.'
          },
          {
            question: 'reduce() 함수의 용도는?',
            options: [
              '리스트 크기를 줄인다',
              '리스트를 순회하며 값을 누적 계산한다',
              '중복을 제거한다',
              '리스트를 정렬한다'
            ],
            answer: 1,
            explanation: 'reduce(초기값, x IN list | 누적식)은 리스트를 순회하며 값을 누적 계산합니다. 경로의 총 거리 계산, 문자열 연결 등에 사용됩니다.'
          },
          {
            question: 'UNWIND 절의 역할은?',
            options: [
              '쿼리를 되돌린다 (rollback)',
              '리스트를 개별 행으로 펼친다',
              '노드를 삭제한다',
              '인덱스를 생성한다'
            ],
            answer: 1,
            explanation: 'UNWIND는 리스트를 개별 행으로 펼칩니다. [1, 2, 3]을 UNWIND하면 3개의 행이 됩니다. JSON 배열 데이터 처리나 동적 노드 생성에 유용합니다.'
          }
        ]
      }
    },

    // ============================================
    // Task 9: Day 1 도전 과제
    // ============================================
    {
      id: 'day1-challenge',
      type: 'challenge',
      title: 'Day 1 도전 과제: 소셜 네트워크 영향력 분석',
      duration: 30,
      content: {
        objectives: [
          '변수 길이 경로를 활용한 네트워크 분석',
          'WITH 파이프라인을 사용한 복합 쿼리',
          '집계 함수를 활용한 영향력 지수 계산'
        ],
        requirements: [
          '**영향력 지수 공식**: (1촌 수 × 3) + (2촌 수 × 2) + (3촌 수 × 1)',
          '각 사람의 영향력 지수를 계산하고 순위 출력',
          '가장 영향력 있는 사람 3명 식별',
          'Top 3의 1촌 네트워크 목록도 함께 출력'
        ],
        evaluationCriteria: [
          '변수 길이 경로를 올바르게 사용했는가? (20%)',
          'WITH를 활용한 다단계 처리가 적절한가? (20%)',
          '중복 제거 (DISTINCT)를 올바르게 적용했는가? (20%)',
          '영향력 지수 계산이 정확한가? (20%)',
          '결과 출력이 명확한가? (20%)'
        ],
        bonusPoints: [
          '각 촌수별 구성원 목록도 함께 출력 (+10점)',
          '영향력 지수 기반 "알 수도 있는 사람" 추천 구현 (+15점)',
          '네트워크 클러스터(그룹) 식별 (+15점)',
          '시각화용 데이터 형식으로 출력 (+10점)'
        ]
      }
    },

    // ============================================
    // Task 10: Cypher Playground 실습
    // ============================================
    {
      id: 'day1-simulator',
      type: 'simulator',
      title: '실습: Cypher Playground',
      duration: 10,
      content: {
        objectives: [
          'Cypher Playground에서 오늘 배운 쿼리를 직접 실행한다',
          '실시간 결과를 확인하며 쿼리를 수정한다',
          '그래프 시각화로 결과를 검증한다'
        ],
        simulatorId: 'cypher-playground',
        instructions: `
## Cypher Playground 실습

오늘 배운 모든 쿼리를 **Cypher Playground**에서 직접 실행해보세요.

### 추천 실습 순서

1. **샘플 데이터 생성**
   - 소셜 네트워크 데이터 (7명, 9개 관계)
   - E-커머스 데이터 (5명 고객, 8개 상품)

2. **변수 길이 경로 테스트**
   - N촌 관계 쿼리 실행
   - 경로 길이에 따른 결과 변화 확인

3. **최단 경로 분석**
   - shortestPath 실행
   - 그래프 시각화로 경로 확인

4. **집계 쿼리 실습**
   - 고객별/카테고리별 통계
   - WITH 파이프라인 단계별 실행

### 실습 팁

- 쿼리 결과를 **Table**과 **Graph** 뷰로 번갈아 확인하세요
- 복잡한 쿼리는 WITH마다 끊어서 중간 결과 확인
- 에러가 나면 문법 확인 (특히 괄호, 콜론, 대소문자)

### 도전

- 본인만의 새로운 쿼리 패턴을 만들어보세요
- 더 복잡한 분석 쿼리에 도전해보세요
        `
      }
    }
  ]
}
