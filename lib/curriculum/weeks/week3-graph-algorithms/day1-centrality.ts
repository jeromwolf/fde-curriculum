// Day 1: 중심성 알고리즘 (Centrality)
import type { Day } from './types'
import {
  createReadingTask,
  createVideoTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
  createSimulatorTask
} from './types'

// =============================================================================
// DAY 1: 중심성 알고리즘 - 네트워크에서 중요한 노드 찾기
// =============================================================================

const day1OverviewContent = `# Day 1: 중심성 알고리즘 (Centrality)

## 학습 목표

중심성 알고리즘은 네트워크에서 **가장 중요한 노드**를 찾는 방법입니다.
"중요하다"의 정의에 따라 다양한 알고리즘이 존재합니다.

### 오늘 배울 내용

1. **중심성의 개념**
   - 왜 중심성이 중요한가?
   - 중심성의 다양한 정의

2. **Degree Centrality**
   - 가장 단순한 중심성
   - 연결 수 기반 중요도

3. **PageRank**
   - Google의 핵심 알고리즘
   - "중요한 노드에서 받은 링크는 더 가치있다"

4. **Betweenness Centrality**
   - 최단 경로의 브로커
   - 정보 흐름의 병목점

5. **Closeness Centrality**
   - 모든 노드에 빠르게 도달
   - 정보 전파 효율성

6. **Neo4j GDS 라이브러리**
   - Graph Data Science 설치
   - 그래프 프로젝션
   - 알고리즘 실행

## 중심성 알고리즘 비교

| 알고리즘 | 질문 | 활용 사례 |
|----------|------|----------|
| **Degree** | 누가 가장 많이 연결되어 있나? | 인플루언서, 허브 |
| **PageRank** | 누가 가장 영향력 있나? | 검색 랭킹, 권위 |
| **Betweenness** | 누가 정보의 브로커인가? | 조직 분석, 병목 |
| **Closeness** | 누가 가장 빨리 모두에게 도달하나? | 마케팅 시드 |

## 실습 환경

오늘 실습에서는 소셜 네트워크 데이터를 사용합니다:

\`\`\`cypher
// 소셜 네트워크 샘플 데이터 생성
CREATE (alice:Person {name: 'Alice', age: 28})
CREATE (bob:Person {name: 'Bob', age: 32})
CREATE (charlie:Person {name: 'Charlie', age: 25})
CREATE (diana:Person {name: 'Diana', age: 30})
CREATE (eve:Person {name: 'Eve', age: 27})
CREATE (frank:Person {name: 'Frank', age: 35})
CREATE (grace:Person {name: 'Grace', age: 29})

// 친구 관계
CREATE (alice)-[:FRIENDS_WITH]->(bob)
CREATE (alice)-[:FRIENDS_WITH]->(charlie)
CREATE (alice)-[:FRIENDS_WITH]->(diana)
CREATE (bob)-[:FRIENDS_WITH]->(charlie)
CREATE (bob)-[:FRIENDS_WITH]->(eve)
CREATE (charlie)-[:FRIENDS_WITH]->(diana)
CREATE (diana)-[:FRIENDS_WITH]->(eve)
CREATE (diana)-[:FRIENDS_WITH]->(frank)
CREATE (eve)-[:FRIENDS_WITH]->(grace)
CREATE (frank)-[:FRIENDS_WITH]->(grace)
\`\`\`

## GDS 라이브러리 설치

\`\`\`bash
# Neo4j Desktop: Plugins에서 GDS 설치
# Neo4j Aura: GDS가 기본 포함

# 설치 확인
RETURN gds.version()
\`\`\`

준비되셨나요? 네트워크의 핵심 인물을 찾아봅시다!
`

const gdsSetupVideoTranscript = `
안녕하세요! 오늘은 Neo4j Graph Data Science (GDS) 라이브러리를 사용하여
중심성 알고리즘을 실행하는 방법을 배우겠습니다.

GDS는 Neo4j의 공식 그래프 분석 라이브러리로,
60개 이상의 그래프 알고리즘을 제공합니다.

먼저 GDS 설치부터 시작하겠습니다.

Neo4j Desktop을 사용하신다면:
1. 프로젝트에서 Database를 선택합니다
2. Plugins 탭을 클릭합니다
3. Graph Data Science Library에서 Install을 클릭합니다
4. 데이터베이스를 재시작합니다

Neo4j Aura를 사용하신다면 GDS가 이미 설치되어 있습니다.

설치 확인은 이 쿼리로 할 수 있습니다:
RETURN gds.version()

GDS를 사용할 때 가장 중요한 개념이 있습니다.
바로 "그래프 프로젝션"입니다.

GDS 알고리즘은 Neo4j의 실제 그래프가 아닌,
메모리에 올린 "프로젝션 그래프"에서 실행됩니다.

프로젝션 생성 방법을 보겠습니다:

CALL gds.graph.project(
  'myGraph',           // 프로젝션 이름
  'Person',            // 노드 레이블
  'FRIENDS_WITH'       // 관계 타입
)

이렇게 하면 Person 노드와 FRIENDS_WITH 관계만
메모리에 올려서 빠르게 분석할 수 있습니다.

프로젝션이 생성되면 이제 알고리즘을 실행할 수 있습니다.

알고리즘은 세 가지 모드로 실행할 수 있습니다:
1. stream: 결과를 스트림으로 반환
2. write: 결과를 노드 속성에 저장
3. mutate: 프로젝션에만 결과 저장

다음 섹션에서 각 중심성 알고리즘을 자세히 살펴보겠습니다!
`

const degreeCentralityContent = `# Degree Centrality - 연결 수 중심성

## 개념

Degree Centrality는 가장 단순한 중심성 지표입니다.
**노드에 연결된 엣지의 수**가 곧 중요도입니다.

\`\`\`
Degree(v) = 노드 v에 연결된 엣지 수
\`\`\`

### 방향 그래프에서의 구분

| 종류 | 설명 | 의미 |
|------|------|------|
| **In-Degree** | 들어오는 엣지 수 | 인기도, 수신자 |
| **Out-Degree** | 나가는 엣지 수 | 활동성, 발신자 |
| **Total Degree** | In + Out | 전체 연결성 |

## 순수 Cypher로 계산

\`\`\`cypher
// 전체 Degree (무방향)
MATCH (p:Person)-[r]-()
RETURN p.name AS name, count(r) AS degree
ORDER BY degree DESC

// In-Degree (방향 그래프)
MATCH (p:Person)<-[r]-()
RETURN p.name AS name, count(r) AS inDegree
ORDER BY inDegree DESC

// Out-Degree (방향 그래프)
MATCH (p:Person)-[r]->()
RETURN p.name AS name, count(r) AS outDegree
ORDER BY outDegree DESC
\`\`\`

## GDS로 계산

\`\`\`cypher
// 그래프 프로젝션 생성
CALL gds.graph.project(
  'socialGraph',
  'Person',
  {
    FRIENDS_WITH: {
      orientation: 'UNDIRECTED'
    }
  }
)

// Degree Centrality 실행
CALL gds.degree.stream('socialGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score AS degree
ORDER BY degree DESC
\`\`\`

## 정규화

네트워크 크기에 관계없이 비교하려면 정규화가 필요합니다:

\`\`\`
정규화 Degree = Degree / (n - 1)
\`\`\`

여기서 n은 전체 노드 수입니다.

\`\`\`cypher
// 정규화된 Degree
MATCH (p:Person)-[r]-()
WITH p, count(r) AS degree
MATCH (total:Person)
WITH p.name AS name, degree, count(total) AS n
RETURN name, degree, toFloat(degree) / (n - 1) AS normalizedDegree
ORDER BY degree DESC
\`\`\`

## 활용 사례

### 1. 소셜 네트워크 인플루언서

\`\`\`cypher
// 팔로워가 가장 많은 사용자 (In-Degree)
MATCH (u:User)<-[:FOLLOWS]-(follower)
RETURN u.username, count(follower) AS followers
ORDER BY followers DESC
LIMIT 10
\`\`\`

### 2. 논문 인용 분석

\`\`\`cypher
// 가장 많이 인용된 논문 (In-Degree)
MATCH (paper:Paper)<-[:CITES]-(citing)
RETURN paper.title, count(citing) AS citations
ORDER BY citations DESC
LIMIT 10
\`\`\`

### 3. 제품 구매 패턴

\`\`\`cypher
// 가장 많이 함께 구매된 제품
MATCH (p:Product)-[r:BOUGHT_TOGETHER]-()
RETURN p.name, count(r) AS coOccurrence
ORDER BY coOccurrence DESC
LIMIT 10
\`\`\`

## 한계점

Degree Centrality는 단순히 연결 수만 봅니다.
- **연결의 질**을 고려하지 않음
- 중요한 노드에서 온 연결과 그렇지 않은 연결을 동일하게 취급

이 한계를 극복한 것이 바로 **PageRank**입니다!
`

const pageRankContent = `# PageRank - 영향력 중심성

## 개념

PageRank는 Google 창업자 Larry Page와 Sergey Brin이 개발한 알고리즘입니다.
핵심 아이디어: **"중요한 노드에서 받은 링크는 더 가치있다"**

\`\`\`
PR(A) = (1-d) + d × Σ(PR(T)/C(T))
\`\`\`

- **d**: Damping Factor (기본 0.85)
- **PR(T)**: 노드 T의 PageRank
- **C(T)**: 노드 T의 아웃링크 수

## 직관적 이해

Random Surfer Model:
1. 웹 서퍼가 무작위로 링크를 클릭
2. 가끔(15%) 완전히 새로운 페이지로 점프
3. 오랜 시간 후 각 페이지에 머문 시간 비율 = PageRank

## GDS로 PageRank 실행

\`\`\`cypher
// 그래프 프로젝션 (방향 그래프)
CALL gds.graph.project(
  'webGraph',
  'Page',
  'LINKS_TO'
)

// PageRank 실행
CALL gds.pageRank.stream('webGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
LIMIT 10
\`\`\`

### 파라미터 조정

\`\`\`cypher
CALL gds.pageRank.stream('webGraph', {
  maxIterations: 50,       // 반복 횟수 (기본 20)
  dampingFactor: 0.85,     // 댐핑 팩터
  tolerance: 0.0001        // 수렴 임계값
})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
\`\`\`

## 결과를 노드에 저장

\`\`\`cypher
// write 모드: 실제 노드 속성에 저장
CALL gds.pageRank.write('webGraph', {
  writeProperty: 'pageRank'
})
YIELD nodePropertiesWritten, ranIterations

// 저장된 값 확인
MATCH (p:Page)
RETURN p.name, p.pageRank
ORDER BY p.pageRank DESC
\`\`\`

## Personalized PageRank

특정 노드의 관점에서 중요도를 계산합니다.

\`\`\`cypher
// Alice 관점에서의 PageRank
MATCH (alice:Person {name: 'Alice'})
CALL gds.pageRank.stream('socialGraph', {
  sourceNodes: [alice]
})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
\`\`\`

## 활용 사례

### 1. 검색 엔진 랭킹

\`\`\`cypher
// 검색 결과 정렬
MATCH (page:Page)
WHERE page.content CONTAINS $searchTerm
RETURN page.url, page.title, page.pageRank
ORDER BY page.pageRank DESC
LIMIT 10
\`\`\`

### 2. 논문 영향력 분석

\`\`\`cypher
// 영향력 있는 논문
CALL gds.pageRank.stream('citationGraph')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS paper, score
RETURN paper.title, paper.year, score AS influence
ORDER BY influence DESC
LIMIT 20
\`\`\`

### 3. 소셜 미디어 영향력

\`\`\`cypher
// 트위터 영향력자
CALL gds.pageRank.stream('twitterGraph')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS user, score
RETURN user.username, user.followers, score AS influence
ORDER BY influence DESC
LIMIT 10
\`\`\`

### 4. 사기 탐지

\`\`\`cypher
// 의심스러운 계정 네트워크
// 가짜 팔로워를 가진 계정은 PageRank가 낮음
CALL gds.pageRank.stream('followGraph')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS user, score
WHERE user.followers > 10000 AND score < 0.001
RETURN user.username AS suspiciousAccount, user.followers, score
\`\`\`

## PageRank vs Degree

| 측면 | Degree | PageRank |
|------|--------|----------|
| 계산 | 단순 카운트 | 반복 수렴 |
| 고려 요소 | 연결 수 | 연결의 질 |
| 계산 비용 | O(E) | O(k×E) |
| 적합한 경우 | 빠른 분석 | 정밀한 영향력 |

## 주의사항

1. **Sink 노드**: 아웃링크가 없는 노드는 PageRank가 빠져나감
2. **Spider Traps**: 자기 참조 링크는 PageRank를 가둠
3. **Dead Ends**: 연결이 끊어진 컴포넌트

해결책: Damping Factor로 랜덤 점프 허용
`

const betweennessCentralityContent = `# Betweenness Centrality - 매개 중심성

## 개념

Betweenness Centrality는 **최단 경로에 자주 등장하는 노드**를 찾습니다.
네트워크에서 정보가 흐르는 **브로커 역할**을 하는 노드입니다.

\`\`\`
BC(v) = Σ(σ(s,t|v) / σ(s,t))
\`\`\`

- **σ(s,t)**: s에서 t로 가는 최단 경로 수
- **σ(s,t|v)**: s에서 t로 가는 최단 경로 중 v를 지나는 경로 수

## 직관적 이해

\`\`\`
      A
     / \\
    B   C
     \\ /
      D  ← 높은 Betweenness
     / \\
    E   F
\`\`\`

노드 D는 위쪽 그룹(A,B,C)과 아래쪽 그룹(E,F) 사이의
모든 최단 경로에 포함됩니다.

## GDS로 Betweenness 계산

\`\`\`cypher
// 그래프 프로젝션
CALL gds.graph.project(
  'socialGraph',
  'Person',
  {
    FRIENDS_WITH: {
      orientation: 'UNDIRECTED'
    }
  }
)

// Betweenness Centrality 실행
CALL gds.betweenness.stream('socialGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score AS betweenness
ORDER BY betweenness DESC
\`\`\`

### 샘플링으로 대규모 그래프 처리

전체 경로 계산은 O(n³)으로 매우 비쌉니다.
대규모 그래프에서는 샘플링을 사용합니다.

\`\`\`cypher
CALL gds.betweenness.stream('socialGraph', {
  samplingSize: 100,      // 샘플 노드 수
  samplingSeed: 42        // 재현성을 위한 시드
})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
\`\`\`

## 결과 저장

\`\`\`cypher
CALL gds.betweenness.write('socialGraph', {
  writeProperty: 'betweenness'
})
YIELD nodePropertiesWritten, centralityDistribution

// 확인
MATCH (p:Person)
RETURN p.name, p.betweenness
ORDER BY p.betweenness DESC
\`\`\`

## 활용 사례

### 1. 조직 내 브로커 식별

\`\`\`cypher
// 부서 간 정보 브로커
CALL gds.betweenness.stream('orgGraph')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS employee, score
MATCH (employee)-[:WORKS_IN]->(dept:Department)
RETURN employee.name, dept.name, score AS brokerScore
ORDER BY brokerScore DESC
LIMIT 10
\`\`\`

### 2. 교통 네트워크 병목

\`\`\`cypher
// 교통 허브 식별
CALL gds.betweenness.stream('roadGraph')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS intersection, score
WHERE score > 1000
RETURN intersection.name, intersection.location, score AS trafficCritical
ORDER BY trafficCritical DESC
\`\`\`

### 3. 공급망 취약점

\`\`\`cypher
// 공급망 핵심 허브
CALL gds.betweenness.stream('supplyChainGraph')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS supplier, score
RETURN supplier.name, supplier.country, score AS supplyChainRisk
ORDER BY supplyChainRisk DESC
LIMIT 5
\`\`\`

### 4. 소셜 네트워크 게이트키퍼

\`\`\`cypher
// 커뮤니티 간 연결자
CALL gds.betweenness.stream('socialGraph')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS user, score
WHERE user.followers > 1000
RETURN user.username, user.community, score AS gatekeeperScore
ORDER BY gatekeeperScore DESC
LIMIT 10
\`\`\`

## 정규화

네트워크 크기에 관계없이 비교:

\`\`\`cypher
// 정규화된 Betweenness
CALL gds.betweenness.stream('socialGraph')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS node, score
MATCH (n:Person)
WITH node, score, count(n) AS n
RETURN node.name,
       score,
       score * 2.0 / ((n-1) * (n-2)) AS normalizedBetweenness
ORDER BY score DESC
\`\`\`

## Betweenness의 한계

1. **계산 비용**: O(n²×E) - 대규모 그래프에서 느림
2. **최단 경로 의존**: 실제 정보 흐름은 최단 경로만 사용하지 않음
3. **동적 네트워크**: 네트워크 변화 시 재계산 필요

## Edge Betweenness

노드 대신 엣지의 중요도를 계산할 수도 있습니다.
커뮤니티 탐지 알고리즘(Girvan-Newman)에서 사용됩니다.

\`\`\`cypher
// 중요한 관계 식별
CALL gds.betweenness.stream('socialGraph', {
  relationshipWeightProperty: null
})
YIELD nodeId, score
// Edge betweenness는 별도 알고리즘 필요
\`\`\`
`

const closenessCentralityContent = `# Closeness Centrality - 근접 중심성

## 개념

Closeness Centrality는 **다른 모든 노드에 빨리 도달할 수 있는 노드**를 찾습니다.
정보를 가장 효율적으로 전파할 수 있는 위치입니다.

\`\`\`
CC(v) = (n-1) / Σd(v,u)
\`\`\`

- **d(v,u)**: 노드 v에서 u까지의 최단 경로 길이
- **n**: 전체 노드 수

## 직관적 이해

\`\`\`
    A---B---C---D---E
         \\       /
          \\     /
           \\   /
            \\ /
             F
\`\`\`

노드 F는 모든 노드에 비교적 가깝습니다.
A에서 E로 가려면 4홉이 필요하지만,
F에서는 대부분 2홉 이내입니다.

## GDS로 Closeness 계산

\`\`\`cypher
// 그래프 프로젝션
CALL gds.graph.project(
  'socialGraph',
  'Person',
  {
    FRIENDS_WITH: {
      orientation: 'UNDIRECTED'
    }
  }
)

// Closeness Centrality 실행
CALL gds.closeness.stream('socialGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score AS closeness
ORDER BY closeness DESC
\`\`\`

### Wasserman-Faust 정규화

연결되지 않은 노드 처리:

\`\`\`cypher
CALL gds.closeness.stream('socialGraph', {
  useWassermanFaust: true
})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
\`\`\`

## 결과 저장

\`\`\`cypher
CALL gds.closeness.write('socialGraph', {
  writeProperty: 'closeness'
})
YIELD nodePropertiesWritten

// 확인
MATCH (p:Person)
RETURN p.name, p.closeness
ORDER BY p.closeness DESC
\`\`\`

## 활용 사례

### 1. 바이럴 마케팅 시드 선정

\`\`\`cypher
// 정보 전파에 최적인 사용자
CALL gds.closeness.stream('socialGraph')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS user, score
WHERE user.verified = true
RETURN user.username, user.followers, score AS spreadPotential
ORDER BY spreadPotential DESC
LIMIT 5
\`\`\`

### 2. 물류 센터 위치 선정

\`\`\`cypher
// 모든 고객에게 빠르게 배송 가능한 위치
CALL gds.closeness.stream('deliveryGraph')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS location, score
WHERE location.type = 'warehouse_candidate'
RETURN location.city, location.address, score AS accessibility
ORDER BY accessibility DESC
LIMIT 3
\`\`\`

### 3. 응급 서비스 배치

\`\`\`cypher
// 응급 시설 최적 위치
CALL gds.closeness.stream('cityGraph')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS area, score
RETURN area.name, area.population, score AS responseEfficiency
ORDER BY score DESC
LIMIT 10
\`\`\`

### 4. 지식 네트워크 핵심 개념

\`\`\`cypher
// 다른 개념과 가장 연결된 핵심 개념
CALL gds.closeness.stream('knowledgeGraph')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS concept, score
RETURN concept.name, concept.domain, score AS centrality
ORDER BY centrality DESC
LIMIT 10
\`\`\`

## Harmonic Centrality

연결되지 않은 그래프에서 더 적합한 변형:

\`\`\`
HC(v) = Σ(1/d(v,u))
\`\`\`

연결되지 않은 노드 쌍은 기여도 0으로 처리합니다.

\`\`\`cypher
CALL gds.closeness.stream('socialGraph', {
  useWassermanFaust: true  // Harmonic 방식과 유사
})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
\`\`\`

## 중심성 비교 분석

\`\`\`cypher
// 모든 중심성 지표 비교
CALL gds.degree.stream('socialGraph') YIELD nodeId, score AS degree
WITH collect({nodeId: nodeId, degree: score}) AS degrees

CALL gds.pageRank.stream('socialGraph') YIELD nodeId, score AS pagerank
WITH degrees, collect({nodeId: nodeId, pagerank: score}) AS pageranks

CALL gds.betweenness.stream('socialGraph') YIELD nodeId, score AS betweenness
WITH degrees, pageranks, collect({nodeId: nodeId, betweenness: score}) AS betweennesses

CALL gds.closeness.stream('socialGraph') YIELD nodeId, score AS closeness
WITH degrees, pageranks, betweennesses, collect({nodeId: nodeId, closeness: score}) AS closenesses

// 결합하여 반환
UNWIND degrees AS d
WITH d.nodeId AS nodeId, d.degree AS degree, pageranks, betweennesses, closenesses
UNWIND pageranks AS pr
WITH nodeId, degree, pr.pagerank AS pagerank, betweennesses, closenesses
WHERE pr.nodeId = nodeId
// ... (계속)
\`\`\`

## 더 간단한 비교 방법

\`\`\`cypher
// 중심성 계산 후 노드에 저장
CALL gds.degree.write('socialGraph', {writeProperty: 'degree'});
CALL gds.pageRank.write('socialGraph', {writeProperty: 'pagerank'});
CALL gds.betweenness.write('socialGraph', {writeProperty: 'betweenness'});
CALL gds.closeness.write('socialGraph', {writeProperty: 'closeness'});

// 한 번에 조회
MATCH (p:Person)
RETURN p.name,
       p.degree,
       p.pagerank,
       p.betweenness,
       p.closeness
ORDER BY p.pagerank DESC
\`\`\`
`

const centralityPracticeInstructions = `# 중심성 알고리즘 실습

## 🎯 왜 배우는가?

### Week 2와의 연결
> **Week 2**에서 Cypher 고급 쿼리와 Object Type 설계를 배웠습니다.
> 이제 **GDS (Graph Data Science)** 라이브러리로 그래프 분석 알고리즘을 실행합니다.
> 단순 쿼리를 넘어 **과학적 그래프 분석**의 영역으로 진입합니다.

### 문제 상황
회사 조직에서 "누가 진짜 핵심 인물인가?"를 파악하기 어렵습니다.
- 직급으로는 매니저지만, 실제 영향력은 낮을 수 있음
- 네트워크 허브 역할을 하는 사람이 따로 있을 수 있음
- 조직도만으로는 실제 협업 구조를 알 수 없음

### 해결책: 중심성 알고리즘
> 🍕 **비유**: 피자 파티 초대 전략
> - **Degree**: 친구가 가장 많은 사람 (인기도)
> - **PageRank**: 인기있는 사람의 친구 (영향력)
> - **Betweenness**: 다른 그룹을 연결하는 사람 (브로커)
> - **Closeness**: 모두에게 빨리 전달 가능한 사람 (전파력)

---

## ⚠️ Common Pitfalls (자주 하는 실수)

### 1. [프로젝션] 그래프 프로젝션 없이 알고리즘 실행

**증상**: \`Unknown graph\` 에러

\`\`\`cypher
// ❌ 잘못된 예시 - 프로젝션 생성 없이 바로 실행
CALL gds.pageRank.stream('myGraph')  // Error: Unknown graph 'myGraph'
\`\`\`

\`\`\`cypher
// ✅ 올바른 예시 - 프로젝션 먼저 생성
CALL gds.graph.project('myGraph', 'Person', 'KNOWS')  // 1) 프로젝션 생성
CALL gds.pageRank.stream('myGraph')                    // 2) 알고리즘 실행
\`\`\`

> **기억하세요**: GDS 알고리즘은 반드시 프로젝션된 그래프에서 실행됩니다.

---

### 2. [방향성] UNDIRECTED 미설정으로 잘못된 결과

**증상**: 예상보다 낮은 Degree, Closeness 값

\`\`\`cypher
// ❌ 잘못된 예시 - 친구 관계를 단방향으로 처리
CALL gds.graph.project('graph', 'Person', 'FRIENDS_WITH')
// FRIENDS_WITH는 양방향이어야 하는데, A→B만 계산됨
\`\`\`

\`\`\`cypher
// ✅ 올바른 예시 - 양방향 관계 명시
CALL gds.graph.project('graph', 'Person',
  {FRIENDS_WITH: {orientation: 'UNDIRECTED'}})
\`\`\`

---

### 3. [모드 선택] stream vs write vs mutate 혼동

**증상**: 결과가 저장되지 않거나, 불필요한 저장으로 성능 저하

| 모드 | 결과 저장 위치 | 사용 시점 |
|------|---------------|----------|
| **stream** | 반환만 (저장 X) | 탐색, 테스트 |
| **write** | 노드 속성에 저장 | 영구 저장 필요 시 |
| **mutate** | 프로젝션에만 저장 | 연속 알고리즘 실행 시 |

\`\`\`cypher
// 탐색 단계: stream 사용 (빠름, 저장 X)
CALL gds.pageRank.stream('graph') YIELD nodeId, score ...

// 분석 완료 후: write 사용 (영구 저장)
CALL gds.pageRank.write('graph', {writeProperty: 'pagerank'})
\`\`\`

---

## 목표
GDS 라이브러리를 사용하여 소셜 네트워크에서 핵심 인물을 찾습니다.

## 시나리오
IT 회사의 내부 협업 네트워크를 분석합니다.
- **Employee**: 직원 노드
- **COLLABORATES_WITH**: 협업 관계
- **REPORTS_TO**: 보고 관계
- **MENTORS**: 멘토링 관계

## 데이터 생성

\`\`\`cypher
// 직원 생성
CREATE (ceo:Employee {name: 'CEO Kim', department: 'Executive', level: 1})
CREATE (cto:Employee {name: 'CTO Park', department: 'Engineering', level: 2})
CREATE (cfo:Employee {name: 'CFO Lee', department: 'Finance', level: 2})
CREATE (vp1:Employee {name: 'VP Engineering', department: 'Engineering', level: 3})
CREATE (vp2:Employee {name: 'VP Product', department: 'Product', level: 3})
CREATE (mgr1:Employee {name: 'Manager A', department: 'Engineering', level: 4})
CREATE (mgr2:Employee {name: 'Manager B', department: 'Engineering', level: 4})
CREATE (mgr3:Employee {name: 'Manager C', department: 'Product', level: 4})
CREATE (dev1:Employee {name: 'Developer 1', department: 'Engineering', level: 5})
CREATE (dev2:Employee {name: 'Developer 2', department: 'Engineering', level: 5})
CREATE (dev3:Employee {name: 'Developer 3', department: 'Engineering', level: 5})
CREATE (dev4:Employee {name: 'Developer 4', department: 'Engineering', level: 5})
CREATE (pm1:Employee {name: 'PM 1', department: 'Product', level: 5})
CREATE (pm2:Employee {name: 'PM 2', department: 'Product', level: 5})
CREATE (analyst:Employee {name: 'Analyst', department: 'Finance', level: 5})

// 보고 관계
CREATE (cto)-[:REPORTS_TO]->(ceo)
CREATE (cfo)-[:REPORTS_TO]->(ceo)
CREATE (vp1)-[:REPORTS_TO]->(cto)
CREATE (vp2)-[:REPORTS_TO]->(cto)
CREATE (mgr1)-[:REPORTS_TO]->(vp1)
CREATE (mgr2)-[:REPORTS_TO]->(vp1)
CREATE (mgr3)-[:REPORTS_TO]->(vp2)
CREATE (dev1)-[:REPORTS_TO]->(mgr1)
CREATE (dev2)-[:REPORTS_TO]->(mgr1)
CREATE (dev3)-[:REPORTS_TO]->(mgr2)
CREATE (dev4)-[:REPORTS_TO]->(mgr2)
CREATE (pm1)-[:REPORTS_TO]->(mgr3)
CREATE (pm2)-[:REPORTS_TO]->(mgr3)
CREATE (analyst)-[:REPORTS_TO]->(cfo)

// 협업 관계 (부서 간)
CREATE (dev1)-[:COLLABORATES_WITH]->(pm1)
CREATE (dev2)-[:COLLABORATES_WITH]->(pm1)
CREATE (dev3)-[:COLLABORATES_WITH]->(pm2)
CREATE (mgr1)-[:COLLABORATES_WITH]->(mgr3)
CREATE (vp1)-[:COLLABORATES_WITH]->(vp2)
CREATE (analyst)-[:COLLABORATES_WITH]->(mgr1)

// 멘토링 관계
CREATE (mgr1)-[:MENTORS]->(dev1)
CREATE (mgr1)-[:MENTORS]->(dev2)
CREATE (mgr2)-[:MENTORS]->(dev3)
CREATE (vp1)-[:MENTORS]->(mgr1)
\`\`\`

## 과제

### 과제 1: 그래프 프로젝션 생성
협업 네트워크를 분석하기 위한 프로젝션을 생성하세요.

### 과제 2: Degree Centrality
가장 많은 협업 관계를 가진 직원을 찾으세요.

### 과제 3: PageRank
조직에서 가장 영향력 있는 직원을 찾으세요.

### 과제 4: Betweenness Centrality
부서 간 협업의 브로커 역할을 하는 직원을 찾으세요.

### 과제 5: 종합 분석
모든 중심성 지표를 계산하고 비교하세요.
어떤 직원이 "핵심 인물"인가요?
`

const centralityPracticeStarterCode = `// ============================================
// 중심성 알고리즘 실습
// ============================================

// ========================================
// 과제 1: 그래프 프로젝션 생성
// ========================================

// [WHY] 왜 그래프 프로젝션이 필요한가?
// - GDS 알고리즘은 Neo4j DB를 직접 조회하지 않습니다
// - 메모리에 최적화된 그래프 구조를 생성해야 빠른 분석 가능
// - 필요한 노드/관계만 선택하여 메모리 효율성 확보

// [SELECTION GUIDE] 프로젝션 설정 선택 기준:
// - 노드 레이블: 분석 대상만 선택 (불필요한 노드 제외)
// - 관계 방향성:
//   * NATURAL: 원본 방향 유지 (예: FOLLOWS - 누가 누구를 팔로우)
//   * REVERSE: 방향 반전 (예: 역방향 영향력 분석)
//   * UNDIRECTED: 무방향 (예: 협업, 친구 관계 - 양방향 동등)

// [TODO] 구현할 내용:
// Step 1: 노드 레이블 지정 - 'Employee'
// Step 2: 관계 유형 3개 설정 (COLLABORATES_WITH, REPORTS_TO, MENTORS)
// Step 3: 모든 관계를 UNDIRECTED로 설정 (조직 네트워크는 양방향 영향)

// [HINT] 관계 설정 형식:
// { RELATION_NAME: {orientation: 'UNDIRECTED'} }

CALL gds.graph.project(
  'orgGraph',
  // TODO: 노드 레이블 지정
  ,
  // TODO: 관계 설정 - 3개 관계, 모두 UNDIRECTED
  {

  }
)
YIELD graphName, nodeCount, relationshipCount
RETURN graphName, nodeCount, relationshipCount;


// ========================================
// 과제 2: Degree Centrality
// ========================================

// [WHY] Degree Centrality는 무엇을 측정하는가?
// - 노드의 직접 연결 수 = 가장 단순한 중심성 지표
// - 비즈니스 의미: "가장 많은 사람과 직접 일하는 직원"
// - 높은 Degree = 정보 전파의 허브, 과부하 위험

// [SELECTION GUIDE] 언제 Degree Centrality를 사용?
// - 직접적인 연결 수가 중요할 때
// - 네트워크의 허브를 빠르게 찾을 때
// - 계산 비용이 가장 낮음 (O(n))

// [TODO] 구현할 내용:
// Step 1: gds.degree.stream('orgGraph') 호출
// Step 2: YIELD nodeId, score로 결과 받기
// Step 3: gds.util.asNode(nodeId)로 노드 속성 접근
// Step 4: ORDER BY score DESC, LIMIT 5

CALL gds.degree.stream('orgGraph')
// TODO: YIELD, RETURN, ORDER BY, LIMIT 추가


// ========================================
// 과제 3: PageRank
// ========================================

// [WHY] PageRank는 Degree와 어떻게 다른가?
// - Degree: 직접 연결 수만 계산
// - PageRank: "중요한 노드와 연결되면 나도 중요" (간접 영향력)
// - 비즈니스 의미: "영향력 있는 사람들과 연결된 직원"

// [SELECTION GUIDE] PageRank 파라미터:
// - maxIterations (기본: 20): 수렴 반복 횟수
//   * 작은 그래프: 10-20 충분
//   * 큰 그래프: 50-100 필요할 수 있음
// - dampingFactor (기본: 0.85): 랜덤 점프 확률
//   * 0.85: 표준값 (85% 링크 따라감, 15% 랜덤)
//   * 높을수록 링크 구조 중시, 낮을수록 균등 분배

// [TODO] 구현할 내용:
// Step 1: gds.pageRank.stream 호출
// Step 2: maxIterations: 20, dampingFactor: 0.85 설정
// Step 3: score를 소수점 3자리로 반올림: round(score * 1000) / 1000

CALL gds.pageRank.stream('orgGraph', {
  // TODO: 파라미터 설정
})
// TODO: YIELD, RETURN, ORDER BY, LIMIT 추가


// ========================================
// 과제 4: Betweenness Centrality
// ========================================

// [WHY] Betweenness는 무엇을 측정하는가?
// - "다른 노드들 사이의 최단 경로에 얼마나 자주 등장하는가"
// - 비즈니스 의미: "정보 흐름의 병목점/브로커 역할"
// - 높은 Betweenness = 부서 간 소통의 핵심 인물

// [SELECTION GUIDE] Betweenness vs 다른 중심성:
// - 부서 간 협업 브로커 찾기 → Betweenness
// - 전체 영향력 측정 → PageRank
// - 단순 연결 수 → Degree
// - 정보 전파 속도 → Closeness

// [TODO] 구현할 내용:
// Step 1: gds.betweenness.stream 호출
// Step 2: brokerScore로 별칭 지정
// Step 3: round(score * 100) / 100 으로 소수점 처리

CALL gds.betweenness.stream('orgGraph')
// TODO: YIELD, RETURN, ORDER BY, LIMIT 추가


// ========================================
// 과제 5: 종합 분석
// ========================================

// [WHY] 왜 여러 중심성을 비교해야 하는가?
// - 각 중심성은 다른 측면을 측정
// - 종합적으로 봐야 진정한 "핵심 인물" 파악 가능
// - 예: PageRank 높지만 Betweenness 낮음 = 영향력은 있지만 병목점은 아님

// [SELECTION GUIDE] stream vs write 선택:
// - stream: 즉시 결과 확인, 저장 X, 탐색용
// - write: DB에 영구 저장, 후속 쿼리에서 사용 가능
// - mutate: 프로젝션에만 저장, DB에는 X

// [TODO] 구현할 내용:
// Step 1: 4개 지표를 write 모드로 저장 (degree, pagerank, betweenness, closeness)
// Step 2: MATCH로 Employee 노드 조회
// Step 3: 저장된 속성으로 종합 비교

// 지표 저장
CALL gds.degree.write('orgGraph', {writeProperty: 'degree'});
// TODO: pagerank, betweenness, closeness도 write

// 종합 비교
// TODO: MATCH (e:Employee) RETURN ... ORDER BY pagerank DESC
`

const centralityPracticeSolutionCode = `// ============================================
// 중심성 알고리즘 실습 - 정답
// ============================================


// ========================================
// 과제 1: 그래프 프로젝션 생성
// ========================================

// [WHY] 왜 프로젝션이 GDS의 첫 단계인가?
// - GDS 알고리즘은 메모리 최적화된 그래프 구조에서만 실행됩니다
// - 원본 DB가 아닌 프로젝션을 대상으로 연산하여 성능 최적화
// - 필요한 노드/관계만 선택하여 메모리 효율성 확보

// [STEP 1] gds.graph.project 호출
// [PARAM] 'orgGraph': 프로젝션 이름 (나중에 알고리즘에서 참조)
// [PARAM] 'Employee': 분석 대상 노드 레이블
// [PARAM] orientation: 'UNDIRECTED': 양방향 관계로 변환
//   - 조직 네트워크에서 협업/보고/멘토링은 양방향 영향력이 있음
//   - NATURAL은 원본 방향 유지, REVERSE는 방향 반전
CALL gds.graph.project(
  'orgGraph',
  'Employee',
  {
    COLLABORATES_WITH: {orientation: 'UNDIRECTED'},
    REPORTS_TO: {orientation: 'UNDIRECTED'},
    MENTORS: {orientation: 'UNDIRECTED'}
  }
)
YIELD graphName, nodeCount, relationshipCount
RETURN graphName, nodeCount, relationshipCount;

// [RESULT] 예상 결과:
// | graphName | nodeCount | relationshipCount |
// | 'orgGraph' | 15        | 42               |
// (15명 직원, 관계 수는 UNDIRECTED로 인해 양방향 카운트)


// ========================================
// 과제 2: Degree Centrality
// ========================================

// [WHY] Degree Centrality를 먼저 분석하는 이유?
// - 가장 단순하고 직관적인 지표 (연결 수)
// - 계산 비용이 가장 낮음 O(n)
// - 네트워크의 기본 구조를 파악하는 첫 단계

// [STEP 1] gds.degree.stream 호출
// [PARAM] 'orgGraph': 위에서 생성한 프로젝션 이름
// [ALTERNATIVE] stream vs write: 탐색 단계에서는 stream이 적절 (결과만 확인)
CALL gds.degree.stream('orgGraph')
YIELD nodeId, score
// [STEP 2] gds.util.asNode(nodeId)로 원본 노드 속성 접근
// nodeId는 내부 ID이므로 변환 필요
RETURN gds.util.asNode(nodeId).name AS employee,
       gds.util.asNode(nodeId).department AS department,
       score AS connections
ORDER BY connections DESC
LIMIT 5;

// [RESULT] 예상 결과:
// | employee        | department   | connections |
// | VP Engineering  | Engineering  | 6           | ← 다양한 관계 허브
// | Manager A       | Engineering  | 5           |
// | CTO Park        | Engineering  | 4           |
// [INSIGHT] 높은 Degree = 과부하 위험, 병목점이 될 수 있음


// ========================================
// 과제 3: PageRank
// ========================================

// [WHY] PageRank가 Degree보다 더 의미있는 이유?
// - Degree: 단순 연결 수
// - PageRank: "중요한 노드와 연결되면 나도 중요" (간접 영향력 포함)
// - CEO와 연결된 사람 vs 신입과 연결된 사람 → PageRank가 구분

// [STEP 1] gds.pageRank.stream 호출 with 파라미터
// [PARAM] maxIterations: 20 - 알고리즘 수렴 반복 횟수
//   - 작은 그래프(100 노드 미만)에서는 10-20이면 충분
//   - 큰 그래프에서는 50-100 필요할 수 있음
// [PARAM] dampingFactor: 0.85 - Google 논문의 표준값
//   - 85% 확률로 링크 따라감, 15% 확률로 랜덤 점프
//   - 높을수록 링크 구조 중시, 낮을수록 균등 분배
CALL gds.pageRank.stream('orgGraph', {
  maxIterations: 20,
  dampingFactor: 0.85
})
YIELD nodeId, score
// [STEP 2] score를 round로 소수점 처리 (가독성)
// round(score * 1000) / 1000 → 소수점 3자리
RETURN gds.util.asNode(nodeId).name AS employee,
       gds.util.asNode(nodeId).department AS department,
       round(score * 1000) / 1000 AS influence
ORDER BY influence DESC
LIMIT 5;

// [RESULT] 예상 결과:
// | employee       | department   | influence |
// | CEO Kim        | Executive    | 2.156     | ← 최고 의사결정권자
// | CTO Park       | Engineering  | 1.892     |
// | VP Engineering | Engineering  | 1.543     |
// [INSIGHT] PageRank는 조직 계층과 상관관계가 높음
// BUT Degree와 순위가 다를 수 있음 (양보다 질)


// ========================================
// 과제 4: Betweenness Centrality
// ========================================

// [WHY] Betweenness가 조직 분석에서 중요한 이유?
// - "다른 사람들 사이의 최단 경로에 얼마나 자주 등장하는가"
// - 높은 Betweenness = 정보 흐름의 병목점/브로커
// - 부서 간 협업의 핵심 인물 식별에 최적

// [STEP 1] gds.betweenness.stream 호출
// Betweenness는 계산 비용이 높음 O(n*e) - 큰 그래프에서 주의
CALL gds.betweenness.stream('orgGraph')
YIELD nodeId, score
// [STEP 2] brokerScore로 별칭 지정 (비즈니스 의미 부여)
// round(score * 100) / 100 → 소수점 2자리
RETURN gds.util.asNode(nodeId).name AS employee,
       gds.util.asNode(nodeId).department AS department,
       round(score * 100) / 100 AS brokerScore
ORDER BY brokerScore DESC
LIMIT 5;

// [RESULT] 예상 결과:
// | employee       | department   | brokerScore |
// | Manager A      | Engineering  | 45.67       | ← 부서 간 브로커!
// | VP Engineering | Engineering  | 32.15       |
// | CTO Park       | Engineering  | 28.90       |
// [INSIGHT] Betweenness TOP ≠ PageRank TOP
// Manager A는 영향력(PageRank)보다 연결 중개(Betweenness)에서 더 중요


// ========================================
// 과제 5: 종합 분석 - 모든 지표 저장
// ========================================

// [WHY] 왜 write 모드로 저장하는가?
// - stream: 즉시 결과 확인, 저장 X (탐색용)
// - write: DB에 영구 저장 → 후속 쿼리에서 사용 가능
// - 종합 분석에서 여러 지표를 비교하려면 저장 필요

// [STEP 1] 4개 중심성 지표를 DB에 저장
// [PARAM] writeProperty: 저장할 속성 이름
CALL gds.degree.write('orgGraph', {writeProperty: 'degree'});
CALL gds.pageRank.write('orgGraph', {writeProperty: 'pagerank'});
CALL gds.betweenness.write('orgGraph', {writeProperty: 'betweenness'});
CALL gds.closeness.write('orgGraph', {writeProperty: 'closeness'});

// [STEP 2] 종합 비교 - 저장된 속성으로 조회
MATCH (e:Employee)
RETURN e.name AS employee,
       e.department AS department,
       e.level AS level,
       e.degree AS degree,
       round(e.pagerank * 1000) / 1000 AS pagerank,
       round(e.betweenness * 100) / 100 AS betweenness,
       round(e.closeness * 1000) / 1000 AS closeness
ORDER BY e.pagerank DESC;

// [RESULT] 각 직원의 4가지 중심성 지표를 한눈에 비교
// 다른 지표에서 높은 사람이 다를 수 있음!


// ========================================
// 보너스: 핵심 인물 종합 점수
// ========================================

// [WHY] 종합 점수가 필요한 이유?
// - 각 중심성은 다른 측면을 측정
// - 단일 지표로 "핵심 인물"을 정의하기 어려움
// - 정규화 후 합산으로 종합적 평가

// [STEP 1] Window 함수로 최대값 계산 (정규화용)
// [PARAM] max() OVER (): 전체 데이터셋에서 최대값
MATCH (e:Employee)
WITH e,
     e.degree AS degree,
     e.pagerank AS pr,
     e.betweenness AS bt,
     e.closeness AS cl
WITH e, degree, pr, bt, cl,
     max(degree) OVER () AS maxDeg,
     max(pr) OVER () AS maxPR,
     max(bt) OVER () AS maxBT,
     max(cl) OVER () AS maxCL
// [STEP 2] 정규화 후 합산 (각 지표 0-1 범위로 변환)
// * 25: 총점 100점 만점 (4개 지표 × 25)
RETURN e.name AS employee,
       e.department AS department,
       round((degree/maxDeg + pr/maxPR + bt/maxBT + cl/maxCL) * 25) AS compositeScore
ORDER BY compositeScore DESC
LIMIT 5;

// [RESULT] 예상 결과:
// | employee       | department   | compositeScore |
// | VP Engineering | Engineering  | 87             | ← 종합 1위!
// | CTO Park       | Engineering  | 82             |
// | Manager A      | Engineering  | 79             |
// [INSIGHT] 종합 점수 TOP = 진정한 "핵심 인물"
// 여러 측면에서 고르게 높은 중심성을 가진 사람


// ========================================
// 정리: 프로젝션 삭제
// ========================================

// [WHY] 프로젝션을 삭제하는 이유?
// - 프로젝션은 메모리에 상주 → 불필요 시 메모리 낭비
// - 같은 이름으로 새 프로젝션 생성 시 충돌
// - 분석 완료 후 항상 정리하는 습관!
CALL gds.graph.drop('orgGraph');
`

const day1QuizQuestions = [
  {
    question: 'PageRank의 Damping Factor(기본값 0.85)의 의미는?',
    options: [
      '알고리즘 반복 횟수',
      '랜덤 서퍼가 링크를 따라가는 확률',
      '최소 점수 임계값',
      '노드 가중치'
    ],
    answer: 1,
    explanation: 'Damping Factor 0.85는 85% 확률로 링크를 따라가고, 15% 확률로 완전히 새로운 페이지로 점프한다는 의미입니다.'
  },
  {
    question: 'Betweenness Centrality가 높은 노드의 특징은?',
    options: [
      '연결 수가 가장 많다',
      '다른 노드에 가장 가깝다',
      '최단 경로에 자주 포함된다',
      'PageRank가 가장 높다'
    ],
    answer: 2,
    explanation: 'Betweenness Centrality는 네트워크의 최단 경로에 자주 등장하는 노드를 측정합니다. 정보 흐름의 브로커 역할을 합니다.'
  },
  {
    question: 'GDS 그래프 프로젝션의 목적은?',
    options: [
      '그래프를 시각화하기 위해',
      '알고리즘 실행을 위해 메모리에 최적화된 구조로 로드',
      '그래프를 파일로 저장',
      '노드 레이블을 변경'
    ],
    answer: 1,
    explanation: 'GDS 프로젝션은 알고리즘 실행을 위해 그래프를 메모리에 최적화된 형태로 로드합니다. 이를 통해 빠른 분석이 가능합니다.'
  },
  {
    question: 'Closeness Centrality가 높은 노드는 어떤 용도에 적합한가?',
    options: [
      '네트워크 보안 강화',
      '바이럴 마케팅의 시드 사용자',
      '데이터베이스 인덱싱',
      '파일 압축'
    ],
    answer: 1,
    explanation: 'Closeness가 높은 노드는 모든 다른 노드에 빨리 도달할 수 있어, 정보를 빠르게 전파해야 하는 바이럴 마케팅에 적합합니다.'
  },
  {
    question: 'GDS 알고리즘의 세 가지 실행 모드 중 결과를 스트림으로 반환하는 것은?',
    options: [
      'write',
      'mutate',
      'stream',
      'return'
    ],
    answer: 2,
    explanation: 'stream 모드는 결과를 직접 반환합니다. write는 노드 속성에 저장, mutate는 프로젝션에만 저장합니다.'
  },
  {
    question: 'Degree Centrality의 한계점은?',
    options: [
      '계산이 너무 느리다',
      '연결의 질(중요도)을 고려하지 않는다',
      '방향 그래프에서 사용할 수 없다',
      '음수 값이 나올 수 있다'
    ],
    answer: 1,
    explanation: 'Degree Centrality는 단순히 연결 수만 세기 때문에, 중요한 노드에서 온 연결과 그렇지 않은 연결을 동일하게 취급합니다.'
  },
  {
    question: 'Personalized PageRank는 무엇을 계산하는가?',
    options: [
      '모든 노드의 전역 중요도',
      '특정 노드 관점에서의 상대적 중요도',
      '노드의 개인 정보',
      '사용자 맞춤 추천'
    ],
    answer: 1,
    explanation: 'Personalized PageRank는 특정 노드(sourceNodes)의 관점에서 다른 노드들의 상대적 중요도를 계산합니다.'
  },
  {
    question: 'Betweenness Centrality 계산의 시간 복잡도는?',
    options: [
      'O(n)',
      'O(n log n)',
      'O(n² × E)',
      'O(1)'
    ],
    answer: 2,
    explanation: 'Betweenness는 모든 노드 쌍 간의 최단 경로를 계산해야 하므로 O(n² × E)입니다. 대규모 그래프에서는 샘플링이 필요합니다.'
  }
]

const day1ChallengeContent = {
  objectives: [
    '실제 소셜 네트워크 데이터에 중심성 알고리즘 적용',
    '다양한 중심성 지표의 의미 해석',
    '비즈니스 인사이트 도출',
    'GDS 라이브러리 숙달'
  ],
  requirements: [
    '최소 20개 노드, 50개 관계의 소셜 네트워크 데이터 생성',
    '4가지 중심성 알고리즘 모두 실행 (Degree, PageRank, Betweenness, Closeness)',
    '각 알고리즘별 상위 5개 노드 분석',
    '종합 중심성 점수 계산 및 "핵심 인물" 식별',
    '분석 결과를 비즈니스 관점에서 해석'
  ],
  evaluationCriteria: [
    '데이터 모델링의 적절성 (20%)',
    'GDS 사용법 정확성 (25%)',
    '분석 결과의 정확성 (25%)',
    '비즈니스 인사이트 품질 (30%)'
  ],
  bonusPoints: [
    'Personalized PageRank 활용',
    '시각화 (Neo4j Bloom 또는 외부 도구)',
    '실제 데이터셋 활용 (Twitter, LinkedIn 등)',
    '시계열 분석 (중심성 변화 추적)'
  ]
}

// Day 1 완성
export const day1Centrality: Day = {
  slug: 'centrality-algorithms',
  title: '중심성 알고리즘 (Centrality)',
  totalDuration: 240,
  tasks: [
    // Task 1: Day 1 개요
    createReadingTask(
      'day1-overview',
      'Day 1 개요: 중심성 알고리즘',
      15,
      [
        '중심성의 개념 이해',
        '다양한 중심성 알고리즘 비교',
        'GDS 라이브러리 소개'
      ],
      day1OverviewContent
    ),

    // Task 2: GDS 설정 영상
    createVideoTask(
      'gds-setup-video',
      'Neo4j GDS 설치와 그래프 프로젝션',
      20,
      [
        'GDS 라이브러리 설치',
        '그래프 프로젝션 개념',
        '알고리즘 실행 모드 (stream/write/mutate)'
      ],
      'https://example.com/gds-setup',
      gdsSetupVideoTranscript
    ),

    // Task 3: Degree Centrality
    createReadingTask(
      'degree-centrality',
      'Degree Centrality - 연결 수 중심성',
      20,
      [
        'Degree Centrality 개념',
        'In-Degree vs Out-Degree',
        '정규화 방법'
      ],
      degreeCentralityContent
    ),

    // Task 4: PageRank
    createReadingTask(
      'pagerank',
      'PageRank - 영향력 중심성',
      25,
      [
        'PageRank 알고리즘 이해',
        'Damping Factor',
        'Personalized PageRank'
      ],
      pageRankContent
    ),

    // Task 5: Betweenness Centrality
    createReadingTask(
      'betweenness-centrality',
      'Betweenness Centrality - 매개 중심성',
      25,
      [
        'Betweenness 개념',
        '브로커 노드 식별',
        '샘플링 기법'
      ],
      betweennessCentralityContent
    ),

    // Task 6: Closeness Centrality
    createReadingTask(
      'closeness-centrality',
      'Closeness Centrality - 근접 중심성',
      20,
      [
        'Closeness 개념',
        'Harmonic Centrality',
        '중심성 비교 분석'
      ],
      closenessCentralityContent
    ),

    // Task 7: 실습
    createCodeTask(
      'centrality-practice',
      '중심성 알고리즘 실습',
      40,
      [
        '📊 GDS 그래프 프로젝션 생성',
        '🎯 4가지 중심성 알고리즘 실행',
        '🔍 결과 비교 분석'
      ],
      centralityPracticeInstructions,
      centralityPracticeStarterCode,
      centralityPracticeSolutionCode,
      [
        'gds.graph.project로 프로젝션 먼저 생성',
        'UNDIRECTED orientation으로 양방향 관계',
        'stream 모드는 결과를 직접 반환',
        'write 모드로 노드 속성에 저장 가능'
      ]
    ),

    // Task 8: 퀴즈
    createQuizTask(
      'day1-quiz',
      '중심성 알고리즘 퀴즈',
      20,
      day1QuizQuestions
    ),

    // Task 9: 챌린지
    createChallengeTask(
      'day1-challenge',
      'Day 1 챌린지: 소셜 네트워크 핵심 인물 분석',
      40,
      day1ChallengeContent.objectives,
      day1ChallengeContent.requirements,
      day1ChallengeContent.evaluationCriteria,
      day1ChallengeContent.bonusPoints
    ),

    // Task 10: 시뮬레이터
    createSimulatorTask(
      'day1-simulator',
      '중심성 알고리즘 시뮬레이터',
      15,
      [
        '실시간 중심성 계산',
        '결과 시각화',
        '파라미터 조정 실험'
      ],
      'centrality-simulator',
      `## 중심성 알고리즘 시뮬레이터

이 시뮬레이터에서 다양한 중심성 알고리즘을 실험할 수 있습니다.

### 기능

1. **네트워크 생성**
   - 노드/엣지 추가
   - 샘플 네트워크 로드

2. **알고리즘 실행**
   - Degree, PageRank, Betweenness, Closeness
   - 파라미터 조정

3. **시각화**
   - 노드 크기 = 중심성 점수
   - 색상 = 알고리즘 유형

시뮬레이터를 열어 직접 실험해보세요!`
    )
  ]
}
