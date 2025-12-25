// Week: 그래프 알고리즘 (Phase 3, Week 3)
import type { Week } from '../types'

export const graphAlgorithmsWeek: Week = {
  slug: 'graph-algorithms',
  week: 3,
  phase: 3,
  month: 5,
  access: 'core',
  title: '그래프 알고리즘',
  topics: ['중심성 알고리즘', '커뮤니티 탐지', '유사도 알고리즘', '경로 탐색'],
  practice: '소셜 네트워크 분석 및 추천 시스템 구현',
  totalDuration: 720,
  days: [
    {
      slug: 'centrality-algorithms',
      title: '중심성 알고리즘 (Centrality)',
      totalDuration: 180,
      tasks: [
        {
          id: 'centrality-intro-video',
          type: 'video',
          title: '네트워크에서 중요한 노드 찾기',
          duration: 25,
          content: {
            objectives: [
              '중심성(Centrality)의 개념을 이해한다',
              'PageRank, Betweenness, Closeness 알고리즘을 학습한다',
              'GDS 라이브러리 사용법을 익힌다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=centrality-placeholder',
            transcript: `
## 중심성 알고리즘 (Centrality)

### 중심성이란?

네트워크에서 **중요한 노드**를 찾는 방법입니다.
"중요하다"의 정의에 따라 다양한 알고리즘이 존재합니다.

### 주요 중심성 알고리즘

| 알고리즘 | 정의 | 활용 |
|----------|------|------|
| **Degree** | 연결된 이웃 수 | 인기도, 허브 탐지 |
| **PageRank** | 중요한 노드에서 받은 링크 가중치 | 영향력, 권위 |
| **Betweenness** | 최단 경로에 포함된 빈도 | 브로커, 병목 |
| **Closeness** | 다른 노드까지의 평균 거리 | 정보 전파 속도 |

### Degree Centrality

가장 단순한 중심성: **연결 수**

\`\`\`cypher
// 연결이 많은 상위 5명
MATCH (p:Person)-[r]-()
RETURN p.name, count(r) as degree
ORDER BY degree DESC
LIMIT 5
\`\`\`

### PageRank

Google 창업자들이 개발한 알고리즘.
**"중요한 노드에서 링크를 받으면 더 중요하다"**

\`\`\`cypher
// GDS로 PageRank 실행
CALL gds.pageRank.stream('myGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
LIMIT 10
\`\`\`

**PageRank 핵심 개념:**
- Damping Factor (기본 0.85): 랜덤 점프 확률
- 반복 수렴: 점수가 안정될 때까지 계산
- 아웃링크 분배: 자신의 점수를 이웃에게 분배

### Betweenness Centrality

**"최단 경로에 자주 등장하는 노드"**

\`\`\`cypher
CALL gds.betweenness.stream('myGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
LIMIT 10
\`\`\`

**활용 사례:**
- 조직 내 정보 브로커 탐지
- 네트워크 취약점 분석
- 공급망 핵심 허브 식별

### Closeness Centrality

**"다른 모든 노드에 빨리 도달할 수 있는 노드"**

\`\`\`cypher
CALL gds.closeness.stream('myGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
LIMIT 10
\`\`\`

### GDS (Graph Data Science) 라이브러리

Neo4j의 그래프 알고리즘 라이브러리입니다.

\`\`\`cypher
// 1. 프로젝션 생성
CALL gds.graph.project(
  'myGraph',
  'Person',
  'KNOWS'
)

// 2. 알고리즘 실행
CALL gds.pageRank.stream('myGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name, score

// 3. 결과 저장 (mutate)
CALL gds.pageRank.mutate('myGraph', {mutateProperty: 'pagerank'})

// 4. 정리
CALL gds.graph.drop('myGraph')
\`\`\`
            `,
            simulators: [
              {
                id: 'graph-algorithms',
                title: 'Graph Algorithms Simulator',
                description: '중심성, 커뮤니티 탐지, 유사도, 경로 탐색 알고리즘을 시각적으로 실습해보세요',
                url: '/simulators/graph-algorithms'
              }
            ]
          }
        },
        {
          id: 'centrality-practice-code',
          type: 'code',
          title: '중심성 알고리즘 실습',
          duration: 45,
          content: {
            objectives: [
              'GDS 프로젝션을 생성한다',
              '다양한 중심성 알고리즘을 비교한다',
              '결과를 해석하고 시각화한다'
            ],
            instructions: `
## 실습: 소셜 네트워크 중심성 분석

### 준비: 샘플 소셜 네트워크 생성

\`\`\`cypher
// 소셜 네트워크 데이터 생성
CREATE (alice:Person {name: 'Alice'})
CREATE (bob:Person {name: 'Bob'})
CREATE (charlie:Person {name: 'Charlie'})
CREATE (diana:Person {name: 'Diana'})
CREATE (eve:Person {name: 'Eve'})
CREATE (frank:Person {name: 'Frank'})

CREATE (alice)-[:FOLLOWS]->(bob)
CREATE (alice)-[:FOLLOWS]->(charlie)
CREATE (bob)-[:FOLLOWS]->(charlie)
CREATE (bob)-[:FOLLOWS]->(diana)
CREATE (charlie)-[:FOLLOWS]->(diana)
CREATE (charlie)-[:FOLLOWS]->(eve)
CREATE (diana)-[:FOLLOWS]->(eve)
CREATE (eve)-[:FOLLOWS]->(frank)
CREATE (frank)-[:FOLLOWS]->(alice)
\`\`\`

### 과제 1: GDS 프로젝션 생성

### 과제 2: PageRank 계산

### 과제 3: 중심성 비교 분석
            `,
            starterCode: `// 1. GDS 프로젝션 생성
// CALL gds.graph.project(...)

// 2. PageRank
// CALL gds.pageRank.stream(...)

// 3. Betweenness
// CALL gds.betweenness.stream(...)

// 4. 결과 비교
`,
            solutionCode: `// 1. GDS 프로젝션 생성
CALL gds.graph.project(
  'socialNetwork',
  'Person',
  {FOLLOWS: {orientation: 'NATURAL'}}
);

// 2. PageRank 계산
CALL gds.pageRank.stream('socialNetwork')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS person, score
RETURN person.name AS name, round(score, 4) AS pagerank
ORDER BY pagerank DESC;

// 3. Betweenness Centrality
CALL gds.betweenness.stream('socialNetwork')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS person, score
RETURN person.name AS name, round(score, 4) AS betweenness
ORDER BY betweenness DESC;

// 4. 종합 비교 (결과를 노드에 저장)
CALL gds.pageRank.mutate('socialNetwork', {mutateProperty: 'pagerank'});
CALL gds.betweenness.mutate('socialNetwork', {mutateProperty: 'betweenness'});

// 결과 조회
CALL gds.graph.nodeProperties.stream('socialNetwork', ['pagerank', 'betweenness'])
YIELD nodeId, propertyValue
WITH gds.util.asNode(nodeId) AS person, propertyValue
RETURN person.name,
  propertyValue.pagerank AS pagerank,
  propertyValue.betweenness AS betweenness
ORDER BY pagerank DESC;

// 5. 정리
CALL gds.graph.drop('socialNetwork');
`
          }
        }
      ]
    },
    {
      slug: 'community-detection',
      title: '커뮤니티 탐지 (Community Detection)',
      totalDuration: 180,
      tasks: [
        {
          id: 'community-video',
          type: 'video',
          title: '그래프에서 그룹 찾기',
          duration: 25,
          content: {
            objectives: [
              '커뮤니티 탐지의 개념을 이해한다',
              'Louvain, Label Propagation 알고리즘을 학습한다',
              'Modularity 지표를 해석한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=community-placeholder',
            transcript: `
## 커뮤니티 탐지 (Community Detection)

### 커뮤니티란?

그래프에서 **밀접하게 연결된 노드 그룹**입니다.
- 그룹 내부: 연결이 많음
- 그룹 외부: 연결이 적음

### 활용 사례

| 분야 | 커뮤니티 의미 |
|------|--------------|
| 소셜 네트워크 | 친구 그룹, 관심사 그룹 |
| 생물학 | 단백질 복합체, 유전자 모듈 |
| 금융 | 사기 조직, 거래 그룹 |
| 마케팅 | 고객 세그먼트 |

### Louvain 알고리즘

가장 널리 사용되는 커뮤니티 탐지 알고리즘입니다.

**원리:**
1. 각 노드를 개별 커뮤니티로 시작
2. 노드를 이웃 커뮤니티로 옮겨 Modularity 향상 시도
3. 커뮤니티를 슈퍼노드로 압축
4. 1-3 반복

\`\`\`cypher
// Louvain 커뮤니티 탐지
CALL gds.louvain.stream('myGraph')
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId).name AS name, communityId
ORDER BY communityId
\`\`\`

### Modularity (모듈성)

커뮤니티 품질을 측정하는 지표입니다.
- 범위: -0.5 ~ 1.0
- 0.3 이상: 의미 있는 커뮤니티 구조
- 0.7 이상: 강한 커뮤니티 구조

### Label Propagation Algorithm (LPA)

빠르고 간단한 커뮤니티 탐지:

\`\`\`cypher
CALL gds.labelPropagation.stream('myGraph')
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId).name, communityId
\`\`\`

**특징:**
- 매우 빠름 (O(m) 복잡도)
- 결과가 비결정적 (실행마다 다를 수 있음)
- 대규모 그래프에 적합

### Weakly Connected Components (WCC)

연결된 컴포넌트를 찾습니다:

\`\`\`cypher
CALL gds.wcc.stream('myGraph')
YIELD nodeId, componentId
WITH componentId, count(*) AS size
RETURN componentId, size
ORDER BY size DESC
\`\`\`

**활용:**
- 고립된 노드 그룹 탐지
- 데이터 품질 검증
- 네트워크 분절 분석
            `
          }
        },
        {
          id: 'community-practice-code',
          type: 'code',
          title: '커뮤니티 탐지 실습',
          duration: 45,
          content: {
            objectives: [
              'Louvain 알고리즘으로 커뮤니티를 탐지한다',
              '탐지된 커뮤니티를 분석한다',
              '결과를 시각화에 활용한다'
            ],
            instructions: `
## 실습: 소셜 네트워크 커뮤니티 분석

### 데이터: 더 큰 소셜 네트워크

\`\`\`cypher
// 3개의 명확한 커뮤니티가 있는 네트워크 생성
// 커뮤니티 1: Tech Group
CREATE (p1:Person {name: 'Alice', interest: 'tech'})
CREATE (p2:Person {name: 'Bob', interest: 'tech'})
CREATE (p3:Person {name: 'Charlie', interest: 'tech'})
CREATE (p1)-[:KNOWS]->(p2)
CREATE (p2)-[:KNOWS]->(p3)
CREATE (p3)-[:KNOWS]->(p1)

// 커뮤니티 2: Art Group
CREATE (p4:Person {name: 'Diana', interest: 'art'})
CREATE (p5:Person {name: 'Eve', interest: 'art'})
CREATE (p6:Person {name: 'Frank', interest: 'art'})
CREATE (p4)-[:KNOWS]->(p5)
CREATE (p5)-[:KNOWS]->(p6)
CREATE (p6)-[:KNOWS]->(p4)

// 커뮤니티 3: Sports Group
CREATE (p7:Person {name: 'Grace', interest: 'sports'})
CREATE (p8:Person {name: 'Henry', interest: 'sports'})
CREATE (p9:Person {name: 'Ivan', interest: 'sports'})
CREATE (p7)-[:KNOWS]->(p8)
CREATE (p8)-[:KNOWS]->(p9)
CREATE (p9)-[:KNOWS]->(p7)

// 커뮤니티 간 브릿지
CREATE (p3)-[:KNOWS]->(p4)
CREATE (p6)-[:KNOWS]->(p7)
\`\`\`

### 과제 1: Louvain 커뮤니티 탐지

### 과제 2: 커뮤니티별 통계 분석

### 과제 3: 브릿지 노드 탐지
            `,
            starterCode: `// 1. 프로젝션 생성
// CALL gds.graph.project(...)

// 2. Louvain 실행
// CALL gds.louvain.stream(...)

// 3. 커뮤니티별 통계
// ...

// 4. 브릿지 노드 (커뮤니티 간 연결)
// ...
`,
            solutionCode: `// 1. 프로젝션 생성
CALL gds.graph.project(
  'socialGraph',
  'Person',
  {KNOWS: {orientation: 'UNDIRECTED'}}
);

// 2. Louvain 커뮤니티 탐지
CALL gds.louvain.stream('socialGraph')
YIELD nodeId, communityId
WITH gds.util.asNode(nodeId) AS person, communityId
RETURN person.name, person.interest, communityId
ORDER BY communityId, person.name;

// 3. 커뮤니티별 통계
CALL gds.louvain.stream('socialGraph')
YIELD nodeId, communityId
WITH communityId, collect(gds.util.asNode(nodeId)) AS members
RETURN communityId,
  size(members) AS memberCount,
  [m IN members | m.name] AS names,
  [m IN members | m.interest][0] AS dominantInterest
ORDER BY memberCount DESC;

// 4. 브릿지 노드 탐지 (Betweenness + Community)
CALL gds.louvain.mutate('socialGraph', {mutateProperty: 'community'});
CALL gds.betweenness.stream('socialGraph')
YIELD nodeId, score
WHERE score > 0
WITH gds.util.asNode(nodeId) AS person, score
RETURN person.name, score AS bridgeScore
ORDER BY bridgeScore DESC;

// 5. Modularity 확인
CALL gds.louvain.stats('socialGraph')
YIELD modularity, communityCount
RETURN modularity, communityCount;

// 6. 정리
CALL gds.graph.drop('socialGraph');
`
          }
        }
      ]
    },
    {
      slug: 'similarity-pathfinding',
      title: '유사도 & 경로 탐색 알고리즘',
      totalDuration: 180,
      tasks: [
        {
          id: 'similarity-video',
          type: 'video',
          title: '유사한 노드 찾기',
          duration: 25,
          content: {
            objectives: [
              '노드 유사도의 개념을 이해한다',
              'Jaccard, Cosine, Overlap 유사도를 학습한다',
              '추천 시스템에 적용하는 방법을 파악한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=similarity-placeholder',
            transcript: `
## 유사도 알고리즘

### 왜 유사도가 중요한가?

- **추천**: "이 상품을 좋아하신다면..."
- **중복 탐지**: 유사한 고객, 유사한 문서
- **링크 예측**: 아직 연결되지 않은 유사 노드

### Jaccard Similarity

**공통 이웃의 비율**

\`\`\`
Jaccard(A, B) = |A ∩ B| / |A ∪ B|
\`\`\`

\`\`\`cypher
// 공통 친구 기반 유사도
MATCH (p1:Person {name: 'Alice'})-[:KNOWS]-(friend)-[:KNOWS]-(p2:Person)
WHERE p1 <> p2
WITH p1, p2, count(DISTINCT friend) AS commonFriends
MATCH (p1)-[:KNOWS]-(f1)
WITH p1, p2, commonFriends, count(DISTINCT f1) AS p1Friends
MATCH (p2)-[:KNOWS]-(f2)
WITH p1, p2, commonFriends, p1Friends, count(DISTINCT f2) AS p2Friends
RETURN p2.name,
  commonFriends,
  toFloat(commonFriends) / (p1Friends + p2Friends - commonFriends) AS jaccard
ORDER BY jaccard DESC
\`\`\`

### GDS 유사도 알고리즘

\`\`\`cypher
// Node Similarity (Jaccard 기반)
CALL gds.nodeSimilarity.stream('myGraph')
YIELD node1, node2, similarity
RETURN gds.util.asNode(node1).name AS person1,
       gds.util.asNode(node2).name AS person2,
       similarity
ORDER BY similarity DESC
LIMIT 10
\`\`\`

### K-Nearest Neighbors (kNN)

유사도 기반으로 가장 가까운 이웃 찾기:

\`\`\`cypher
CALL gds.knn.stream('myGraph', {
  nodeProperties: ['age', 'income'],
  topK: 5
})
YIELD node1, node2, similarity
RETURN gds.util.asNode(node1).name,
       gds.util.asNode(node2).name,
       similarity
\`\`\`
            `
          }
        },
        {
          id: 'pathfinding-video',
          type: 'video',
          title: '경로 탐색 알고리즘',
          duration: 20,
          content: {
            objectives: [
              '최단 경로 알고리즘을 이해한다',
              'Dijkstra, A* 알고리즘을 학습한다',
              '가중치 기반 경로 최적화를 파악한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=pathfinding-placeholder',
            transcript: `
## 경로 탐색 알고리즘

### 최단 경로 유형

| 알고리즘 | 용도 | 가중치 |
|----------|------|--------|
| BFS | 홉 수 최소화 | 없음 |
| Dijkstra | 비용 최소화 | 양수 |
| A* | 휴리스틱 최적화 | 양수 |
| Bellman-Ford | 음수 가중치 | 양수/음수 |

### Cypher 내장 최단 경로

\`\`\`cypher
// 최단 경로 (홉 수 기준)
MATCH path = shortestPath(
  (start:Person {name: 'Alice'})-[:KNOWS*]-(end:Person {name: 'Eve'})
)
RETURN path, length(path) as hops
\`\`\`

### GDS Dijkstra

\`\`\`cypher
// 가중치 기반 최단 경로
CALL gds.shortestPath.dijkstra.stream('myGraph', {
  sourceNode: id(alice),
  targetNode: id(eve),
  relationshipWeightProperty: 'cost'
})
YIELD path, totalCost
RETURN nodes(path) AS route, totalCost
\`\`\`

### All Pairs Shortest Path

\`\`\`cypher
// 모든 노드 쌍 간 최단 경로
CALL gds.allShortestPaths.stream('myGraph')
YIELD sourceNodeId, targetNodeId, distance
WHERE sourceNodeId < targetNodeId
RETURN gds.util.asNode(sourceNodeId).name AS source,
       gds.util.asNode(targetNodeId).name AS target,
       distance
\`\`\`
            `
          }
        },
        {
          id: 'recommendation-practice-code',
          type: 'code',
          title: '추천 시스템 실습',
          duration: 50,
          content: {
            objectives: [
              '유사도 기반 추천을 구현한다',
              '협업 필터링 패턴을 적용한다',
              '추천 결과를 검증한다'
            ],
            instructions: `
## 실습: 영화 추천 시스템

### 데이터: 사용자-영화 평점

\`\`\`cypher
// 영화 생성
CREATE (m1:Movie {title: 'Inception', genre: 'Sci-Fi'})
CREATE (m2:Movie {title: 'Matrix', genre: 'Sci-Fi'})
CREATE (m3:Movie {title: 'Titanic', genre: 'Romance'})
CREATE (m4:Movie {title: 'Notebook', genre: 'Romance'})

// 사용자 생성
CREATE (u1:User {name: 'Alice'})
CREATE (u2:User {name: 'Bob'})
CREATE (u3:User {name: 'Charlie'})

// 평점 (1-5)
CREATE (u1)-[:RATED {score: 5}]->(m1)
CREATE (u1)-[:RATED {score: 4}]->(m2)
CREATE (u2)-[:RATED {score: 5}]->(m1)
CREATE (u2)-[:RATED {score: 5}]->(m2)
CREATE (u2)-[:RATED {score: 3}]->(m3)
CREATE (u3)-[:RATED {score: 5}]->(m3)
CREATE (u3)-[:RATED {score: 5}]->(m4)
\`\`\`

### 과제 1: 사용자 유사도 계산

### 과제 2: 협업 필터링 추천

### 과제 3: 컨텐츠 기반 추천
            `,
            starterCode: `// 1. 사용자 유사도 (공통 영화 기반)
// MATCH (u1:User)-[:RATED]->(m)<-[:RATED]-(u2:User)
// ...

// 2. 협업 필터링 (유사 사용자가 본 영화)
// ...

// 3. 컨텐츠 기반 (같은 장르 영화)
// ...
`,
            solutionCode: `// 1. 사용자 유사도 (Jaccard)
MATCH (u1:User)-[:RATED]->(m:Movie)<-[:RATED]-(u2:User)
WHERE u1 <> u2
WITH u1, u2, count(m) AS commonMovies
MATCH (u1)-[:RATED]->(m1:Movie)
WITH u1, u2, commonMovies, count(m1) AS u1Movies
MATCH (u2)-[:RATED]->(m2:Movie)
WITH u1, u2, commonMovies, u1Movies, count(m2) AS u2Movies
RETURN u1.name AS user1, u2.name AS user2,
  toFloat(commonMovies) / (u1Movies + u2Movies - commonMovies) AS similarity
ORDER BY similarity DESC;

// 2. 협업 필터링: Alice에게 추천
MATCH (alice:User {name: 'Alice'})-[:RATED]->(m:Movie)<-[:RATED]-(similar:User)
WHERE alice <> similar
WITH alice, similar, count(m) AS commonMovies
ORDER BY commonMovies DESC
LIMIT 3
MATCH (similar)-[:RATED {score: 5}]->(rec:Movie)
WHERE NOT (alice)-[:RATED]->(rec)
RETURN rec.title AS recommended, count(*) AS votes
ORDER BY votes DESC;

// 3. 컨텐츠 기반: Alice가 좋아한 장르
MATCH (alice:User {name: 'Alice'})-[r:RATED]->(m:Movie)
WHERE r.score >= 4
WITH alice, m.genre AS likedGenre
MATCH (rec:Movie)
WHERE rec.genre = likedGenre
AND NOT (alice)-[:RATED]->(rec)
RETURN rec.title, rec.genre
\`\`\`
            `
          }
        },
        {
          id: 'week3-challenge',
          type: 'challenge',
          title: 'Week 3 도전 과제: 소셜 네트워크 분석 리포트',
          duration: 60,
          content: {
            objectives: [
              '실제 데이터셋으로 네트워크를 분석한다',
              '다양한 알고리즘을 조합한다',
              '분석 결과를 리포트로 작성한다'
            ],
            requirements: [
              '최소 100개 노드, 300개 관계의 그래프 분석',
              '중심성 알고리즘 3개 이상 적용 및 비교',
              '커뮤니티 탐지 및 특성 분석',
              '추천 시스템 또는 경로 최적화 구현'
            ],
            evaluationCriteria: [
              '알고리즘 선택의 적절성',
              '결과 해석의 정확성',
              '비즈니스 인사이트 도출',
              '시각화 품질'
            ],
            bonusPoints: [
              '실제 공개 데이터셋 활용 (Kaggle 등)',
              '대화형 시각화 구현',
              '성능 벤치마크 포함'
            ]
          }
        }
      ]
    }
  ]
}
