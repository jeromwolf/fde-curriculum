// Week 3 Day 4: 경로 탐색 알고리즘 (Path Finding)
import type { Day } from './types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
  createSimulatorTask
} from './types'

// ============================================
// Day 4: 경로 탐색 알고리즘 (Path Finding)
// ============================================
// 학습 목표:
// 1. 그래프 탐색의 기본 개념 이해
// 2. 최단 경로 알고리즘 (Dijkstra, BFS)
// 3. 가중치 그래프에서의 경로 탐색
// 4. All Pairs / Single Source 최단 경로
// 5. 실제 문제에 경로 탐색 적용
// ============================================

// Task 1: 경로 탐색 개요 (영상)
const task1PathFindingIntro = createVideoTask(
  'w3d4-pathfinding-intro',
  '경로 탐색 알고리즘의 세계',
  25,
  [
    '그래프 탐색의 기본 개념 이해',
    'BFS vs DFS 차이점',
    '최단 경로 문제의 정의',
    'GDS 경로 탐색 알고리즘 개요'
  ],
  'https://example.com/videos/pathfinding-intro',
  `
안녕하세요! 오늘은 그래프 알고리즘의 가장 실용적인 분야인
경로 탐색(Path Finding)에 대해 배워보겠습니다.

## 경로 탐색이란?

그래프에서 두 노드 사이의 경로를 찾는 문제입니다.

### 실제 활용 사례

1. **네비게이션**: A 지점에서 B 지점까지 최단 경로
2. **네트워크 라우팅**: 패킷의 최적 전송 경로
3. **소셜 네트워크**: 두 사람 간의 연결 고리
4. **추천 시스템**: 사용자-상품 간의 관계 경로
5. **공급망**: 제품 배송의 최적 경로

## 그래프 탐색의 기초

### BFS (Breadth-First Search)

\`\`\`
너비 우선 탐색: 레벨별로 탐색
       A
      / \\
     B   C      Level 1
    /|   |\\
   D E   F G    Level 2
\`\`\`

- **특징**: 가장 가까운 노드부터 방문
- **장점**: 무가중치 그래프에서 최단 경로 보장
- **활용**: 최소 홉 수 경로, 연결 여부 확인

### DFS (Depth-First Search)

\`\`\`
깊이 우선 탐색: 한 방향으로 끝까지
       A
      / \\
     B   C
    /|
   D E → 먼저 깊이 탐색
\`\`\`

- **특징**: 한 경로를 끝까지 탐색 후 백트랙
- **장점**: 메모리 효율적, 경로 존재 여부 빠른 확인
- **활용**: 사이클 탐지, 위상 정렬

## 최단 경로 문제의 종류

### 1. Single Source Shortest Path (SSSP)
- 하나의 시작점에서 모든 노드까지의 최단 경로
- 알고리즘: Dijkstra, Bellman-Ford

### 2. Single Pair Shortest Path
- 특정 두 노드 사이의 최단 경로
- 알고리즘: A*, Bidirectional Search

### 3. All Pairs Shortest Path (APSP)
- 모든 노드 쌍 사이의 최단 경로
- 알고리즘: Floyd-Warshall, Johnson's

## GDS의 경로 탐색 알고리즘

### 기본 알고리즘
- **BFS**: 무가중치 최단 경로
- **DFS**: 경로 탐색 및 사이클 탐지

### 최단 경로
- **Dijkstra**: 가중치 그래프의 최단 경로
- **A\***: 휴리스틱 기반 효율적 탐색
- **Delta-Stepping**: 병렬 최단 경로

### 전체 경로
- **All Shortest Paths**: 모든 최단 경로
- **Random Walk**: 확률적 경로 탐색

### 스패닝 트리
- **Minimum Spanning Tree**: 최소 비용 연결
- **Spanning Tree**: 모든 노드 연결

## Cypher의 기본 경로 탐색

Neo4j는 Cypher 문법으로도 경로 탐색을 지원합니다.

\`\`\`cypher
// 최단 경로 (무가중치)
MATCH p = shortestPath(
  (start:Node {name: 'A'})-[*]-(end:Node {name: 'B'})
)
RETURN p, length(p);

// 모든 최단 경로
MATCH p = allShortestPaths(
  (start:Node)-[*]-(end:Node)
)
WHERE start.name = 'A' AND end.name = 'B'
RETURN p;
\`\`\`

하지만 대규모 그래프나 가중치 경로에서는 GDS를 사용해야 합니다!

오늘 배울 내용:
1. Dijkstra 알고리즘 - 가중치 최단 경로의 기본
2. 경로 탐색 실습 - 실제 문제 해결
3. Delta-Stepping - 병렬 최단 경로
4. Minimum Spanning Tree - 네트워크 최적화

시작해볼까요?
  `
)

// Task 2: Dijkstra 알고리즘 심화 학습
const task2DijkstraDeep = createReadingTask(
  'w3d4-dijkstra-deep',
  'Dijkstra 알고리즘 완전 정복',
  35,
  [
    'Dijkstra 알고리즘의 원리와 동작 방식',
    '우선순위 큐 기반 구현 이해',
    'GDS에서 Dijkstra 실행'
  ],
  `
# Dijkstra 알고리즘 완전 정복

## 1. Dijkstra란?

1956년 네덜란드 컴퓨터 과학자 Edsger Dijkstra가 발명한
**가중치 그래프에서 최단 경로**를 찾는 알고리즘입니다.

### 핵심 아이디어

"현재까지 알려진 가장 가까운 노드부터 탐색"

### 조건
- **양수 가중치만** 지원 (음수 가중치 X)
- 음수 가중치가 있으면 Bellman-Ford 사용

## 2. 알고리즘 동작 원리

### 단계별 설명

1. 시작 노드의 거리를 0으로, 나머지는 ∞로 초기화
2. 방문하지 않은 노드 중 거리가 가장 작은 노드 선택
3. 선택한 노드의 이웃들의 거리 갱신 (Relaxation)
4. 선택한 노드를 방문 처리
5. 모든 노드를 방문할 때까지 2-4 반복

### 시각적 예시

\`\`\`
초기 그래프:
    A --5-- B
    |       |
    2       3
    |       |
    C --1-- D

단계 1: 시작 노드 A
  거리: A=0, B=∞, C=∞, D=∞

단계 2: A에서 이웃 갱신
  거리: A=0, B=5, C=2, D=∞

단계 3: 가장 가까운 C 선택, 이웃 갱신
  거리: A=0, B=5, C=2, D=3 (C를 통해)

단계 4: D 선택, 이웃 갱신
  거리: A=0, B=5, C=2, D=3 (B는 D를 통해 6이므로 유지)

단계 5: B 선택 (남은 것)
  최종: A=0, B=5, C=2, D=3
\`\`\`

### 경로 추적

각 노드에 "이전 노드(predecessor)"를 기록하면 실제 경로도 구할 수 있습니다.

\`\`\`
A → B: A → B (직접, 거리 5)
A → D: A → C → D (경유, 거리 3)
\`\`\`

## 3. 시간 복잡도

### 기본 구현
- O(V²): 인접 행렬 + 선형 탐색

### 우선순위 큐 사용 (Heap)
- O((V + E) log V): 훨씬 효율적!

### 피보나치 힙 사용
- O(E + V log V): 이론적 최적

## 4. GDS에서 Dijkstra 실행

### 그래프 프로젝션 (가중치 포함)

\`\`\`cypher
// 도시 네트워크 생성
CREATE (seoul:City {name: 'Seoul'})
CREATE (busan:City {name: 'Busan'})
CREATE (daegu:City {name: 'Daegu'})
CREATE (gwangju:City {name: 'Gwangju'})
CREATE (daejeon:City {name: 'Daejeon'})

CREATE (seoul)-[:ROAD {distance: 140}]->(daejeon)
CREATE (seoul)-[:ROAD {distance: 325}]->(busan)
CREATE (daejeon)-[:ROAD {distance: 120}]->(daegu)
CREATE (daejeon)-[:ROAD {distance: 170}]->(gwangju)
CREATE (daegu)-[:ROAD {distance: 90}]->(busan)
CREATE (gwangju)-[:ROAD {distance: 200}]->(busan);

// 그래프 프로젝션
CALL gds.graph.project(
  'city-network',
  'City',
  {
    ROAD: {
      properties: ['distance'],
      orientation: 'UNDIRECTED'
    }
  }
);
\`\`\`

### Dijkstra Source-Target (두 노드 간)

\`\`\`cypher
// 서울 → 부산 최단 경로
MATCH (source:City {name: 'Seoul'}), (target:City {name: 'Busan'})
CALL gds.shortestPath.dijkstra.stream('city-network', {
  sourceNode: source,
  targetNode: target,
  relationshipWeightProperty: 'distance'
})
YIELD index, sourceNode, targetNode, totalCost, nodeIds, costs, path
RETURN
  [nodeId IN nodeIds | gds.util.asNode(nodeId).name] AS route,
  totalCost AS totalDistance,
  costs AS distancesAtEachStep;
\`\`\`

### 예상 결과

| route | totalDistance | distancesAtEachStep |
|-------|---------------|---------------------|
| [Seoul, Daejeon, Daegu, Busan] | 350 | [0, 140, 260, 350] |

### Dijkstra Single Source (하나에서 모든 노드로)

\`\`\`cypher
// 서울에서 모든 도시까지의 최단 거리
MATCH (source:City {name: 'Seoul'})
CALL gds.allShortestPaths.dijkstra.stream('city-network', {
  sourceNode: source,
  relationshipWeightProperty: 'distance'
})
YIELD sourceNode, targetNode, totalCost, nodeIds
RETURN
  gds.util.asNode(sourceNode).name AS from,
  gds.util.asNode(targetNode).name AS to,
  totalCost AS distance,
  [nodeId IN nodeIds | gds.util.asNode(nodeId).name] AS path
ORDER BY distance;
\`\`\`

## 5. 경로 결과 저장

### Write 모드

\`\`\`cypher
MATCH (source:City {name: 'Seoul'}), (target:City {name: 'Busan'})
CALL gds.shortestPath.dijkstra.write('city-network', {
  sourceNode: source,
  targetNode: target,
  relationshipWeightProperty: 'distance',
  writeRelationshipType: 'SHORTEST_PATH',
  writeNodeIds: true,
  writeCosts: true
})
YIELD relationshipsWritten, totalCost
RETURN relationshipsWritten, totalCost;
\`\`\`

### 저장된 결과 확인

\`\`\`cypher
MATCH (source:City {name: 'Seoul'})-[sp:SHORTEST_PATH]->(target:City {name: 'Busan'})
RETURN sp.totalCost, sp.nodeIds, sp.costs;
\`\`\`

## 6. Dijkstra의 한계와 대안

### 음수 가중치

\`\`\`
A --(-2)-- B
 \\        /
  \\--3--/
\`\`\`

Dijkstra: A → B (거리 -2) ✗ 정확하지 않을 수 있음
Bellman-Ford: 음수 가중치 처리 가능

### 대규모 그래프

- Dijkstra: 순차적, 단일 스레드
- Delta-Stepping: 병렬화 가능, 대규모에 적합

### 휴리스틱 탐색 (A*)

목적지 방향으로 "유도"하여 불필요한 탐색 감소

\`\`\`cypher
// A* 알고리즘 (latitdue, longitude 사용)
CALL gds.shortestPath.astar.stream('city-network', {
  sourceNode: source,
  targetNode: target,
  latitudeProperty: 'latitude',
  longitudeProperty: 'longitude',
  relationshipWeightProperty: 'distance'
})
...
\`\`\`

## 7. 실제 활용 패턴

### 패턴 1: 경유지 포함 경로

\`\`\`cypher
// 서울 → 대전 → 부산 (대전 필수 경유)
MATCH (start:City {name: 'Seoul'}),
      (waypoint:City {name: 'Daejeon'}),
      (end:City {name: 'Busan'})

// 구간별 최단 경로 계산
CALL gds.shortestPath.dijkstra.stream('city-network', {
  sourceNode: start,
  targetNode: waypoint,
  relationshipWeightProperty: 'distance'
})
YIELD totalCost AS cost1, nodeIds AS path1

CALL gds.shortestPath.dijkstra.stream('city-network', {
  sourceNode: waypoint,
  targetNode: end,
  relationshipWeightProperty: 'distance'
})
YIELD totalCost AS cost2, nodeIds AS path2

RETURN cost1 + cost2 AS totalCost,
       path1 + tail(path2) AS fullPath;
\`\`\`

### 패턴 2: K개의 최단 경로

\`\`\`cypher
// 상위 3개 최단 경로 (Yen's K-Shortest Paths)
CALL gds.shortestPath.yens.stream('city-network', {
  sourceNode: source,
  targetNode: target,
  k: 3,
  relationshipWeightProperty: 'distance'
})
YIELD index, totalCost, nodeIds
RETURN index + 1 AS rank,
       totalCost,
       [n IN nodeIds | gds.util.asNode(n).name] AS path;
\`\`\`

Dijkstra는 경로 탐색의 기본입니다!
다음 섹션에서 실습으로 깊이 이해해봅시다.
  `
)

// Task 3: Dijkstra 실습
const task3DijkstraPractice = createCodeTask(
  'w3d4-dijkstra-practice',
  'Dijkstra 알고리즘 실습',
  30,
  [
    'GDS에서 Dijkstra 실행',
    '경로 결과 해석',
    '다양한 경로 쿼리 작성'
  ],
  `
# Dijkstra 알고리즘 실습

물류 네트워크 데이터를 사용하여 최적 배송 경로를 찾습니다.

## 과제

1. 물류 네트워크 그래프 프로젝션 생성
2. 출발지에서 목적지까지 최단 경로 계산
3. 단일 출발지에서 모든 창고까지의 경로 계산
4. K개의 대안 경로 찾기

## 데이터 구조
- Warehouse 노드 (10개 창고)
- ROUTE 관계 (cost, time 속성)
  `,
  `
// 실습 시작 코드

// 1. 그래프 프로젝션 (비용 가중치)
CALL gds.graph.project(
  'logistics-network',
  '___',  // 노드 라벨
  {
    ROUTE: {
      properties: ['___'],  // cost 사용
      orientation: '___'
    }
  }
);

// 2. 본사(HQ)에서 창고 E까지 최단 경로
MATCH (source:Warehouse {name: 'HQ'}),
      (target:Warehouse {name: 'Warehouse_E'})
CALL gds.shortestPath.dijkstra.stream('___', {
  sourceNode: ___,
  targetNode: ___,
  relationshipWeightProperty: '___'
})
YIELD totalCost, nodeIds, costs
RETURN
  [nodeId IN nodeIds | gds.util.asNode(nodeId).name] AS route,
  totalCost AS totalCost,
  costs;

// 3. 본사에서 모든 창고까지의 최단 거리
MATCH (source:Warehouse {name: 'HQ'})
CALL gds.allShortestPaths.dijkstra.stream('___', {
  sourceNode: ___,
  relationshipWeightProperty: '___'
})
YIELD targetNode, totalCost, nodeIds
RETURN
  gds.util.asNode(targetNode).name AS destination,
  totalCost,
  size(nodeIds) - 1 AS hops
ORDER BY totalCost;

// 4. 본사 → 창고 E 대안 경로 3개 (Yen's K-shortest)
MATCH (source:Warehouse {name: 'HQ'}),
      (target:Warehouse {name: 'Warehouse_E'})
CALL gds.shortestPath.yens.stream('___', {
  sourceNode: ___,
  targetNode: ___,
  k: ___,
  relationshipWeightProperty: '___'
})
YIELD index, totalCost, nodeIds
RETURN
  index + 1 AS rank,
  totalCost,
  [n IN nodeIds | gds.util.asNode(n).name] AS path;

// 5. 비용 vs 시간 비교 (두 번째 프로젝션)
// TODO: time 속성으로 새 프로젝션 만들고 비교
  `,
  `
// 정답 코드

// 1. 그래프 프로젝션 (비용 가중치)
CALL gds.graph.project(
  'logistics-network',
  'Warehouse',
  {
    ROUTE: {
      properties: ['cost'],
      orientation: 'UNDIRECTED'
    }
  }
);

// 2. 본사(HQ)에서 창고 E까지 최단 경로
MATCH (source:Warehouse {name: 'HQ'}),
      (target:Warehouse {name: 'Warehouse_E'})
CALL gds.shortestPath.dijkstra.stream('logistics-network', {
  sourceNode: source,
  targetNode: target,
  relationshipWeightProperty: 'cost'
})
YIELD totalCost, nodeIds, costs
RETURN
  [nodeId IN nodeIds | gds.util.asNode(nodeId).name] AS route,
  totalCost AS totalCost,
  costs;

// 3. 본사에서 모든 창고까지의 최단 거리
MATCH (source:Warehouse {name: 'HQ'})
CALL gds.allShortestPaths.dijkstra.stream('logistics-network', {
  sourceNode: source,
  relationshipWeightProperty: 'cost'
})
YIELD targetNode, totalCost, nodeIds
RETURN
  gds.util.asNode(targetNode).name AS destination,
  totalCost,
  size(nodeIds) - 1 AS hops
ORDER BY totalCost;

// 4. 본사 → 창고 E 대안 경로 3개 (Yen's K-shortest)
MATCH (source:Warehouse {name: 'HQ'}),
      (target:Warehouse {name: 'Warehouse_E'})
CALL gds.shortestPath.yens.stream('logistics-network', {
  sourceNode: source,
  targetNode: target,
  k: 3,
  relationshipWeightProperty: 'cost'
})
YIELD index, totalCost, nodeIds
RETURN
  index + 1 AS rank,
  totalCost,
  [n IN nodeIds | gds.util.asNode(n).name] AS path;

// 5. 비용 vs 시간 비교
// 시간 기준 프로젝션
CALL gds.graph.project(
  'logistics-time',
  'Warehouse',
  {
    ROUTE: {
      properties: ['time'],
      orientation: 'UNDIRECTED'
    }
  }
);

// 비용 최적 경로
MATCH (source:Warehouse {name: 'HQ'}),
      (target:Warehouse {name: 'Warehouse_E'})
CALL gds.shortestPath.dijkstra.stream('logistics-network', {
  sourceNode: source,
  targetNode: target,
  relationshipWeightProperty: 'cost'
})
YIELD totalCost AS cost, nodeIds AS costPath
WITH source, target, cost, costPath

// 시간 최적 경로
CALL gds.shortestPath.dijkstra.stream('logistics-time', {
  sourceNode: source,
  targetNode: target,
  relationshipWeightProperty: 'time'
})
YIELD totalCost AS time, nodeIds AS timePath

RETURN
  'Cost Optimal' AS strategy,
  cost AS totalCost,
  [n IN costPath | gds.util.asNode(n).name] AS route
UNION ALL
SELECT
  'Time Optimal' AS strategy,
  time AS totalTime,
  [n IN timePath | gds.util.asNode(n).name] AS route;

// 정리
CALL gds.graph.drop('logistics-network');
CALL gds.graph.drop('logistics-time');
  `,
  [
    'Warehouse 라벨과 ROUTE 관계를 프로젝션합니다',
    'relationshipWeightProperty로 가중치 속성을 지정합니다',
    'nodeIds를 gds.util.asNode로 변환하여 이름을 얻습니다',
    'Yen 알고리즘은 k 파라미터로 대안 경로 수를 지정합니다'
  ]
)

// Task 4: BFS와 단순 경로 영상
const task4BfsVideo = createVideoTask(
  'w3d4-bfs-video',
  'BFS와 무가중치 최단 경로',
  20,
  [
    'BFS 알고리즘의 동작 원리',
    '무가중치 그래프에서의 최단 경로',
    'Cypher shortestPath와 GDS BFS 비교'
  ],
  'https://example.com/videos/bfs-pathfinding',
  `
이번에는 BFS(너비 우선 탐색)를 활용한 경로 탐색을 배워보겠습니다.

## BFS vs Dijkstra

| 특성 | BFS | Dijkstra |
|------|-----|----------|
| 그래프 종류 | 무가중치 | 가중치 |
| 최단 의미 | 최소 홉 수 | 최소 비용 |
| 시간 복잡도 | O(V + E) | O((V+E) log V) |
| 사용 사례 | SNS 촌수, 인터넷 홉 | 네비게이션, 물류 |

## BFS가 최단인 이유

BFS는 레벨(깊이)별로 탐색합니다.

\`\`\`
레벨 0: A (시작)
레벨 1: B, C (A의 이웃)
레벨 2: D, E, F (B, C의 이웃)
...
\`\`\`

가장 먼저 발견한 경로 = 가장 짧은 경로 (홉 수 기준)

## Cypher의 shortestPath

\`\`\`cypher
// 무가중치 최단 경로
MATCH p = shortestPath(
  (alice:Person {name: 'Alice'})-[*]-(bob:Person {name: 'Bob'})
)
RETURN p, length(p) AS hops;

// 관계 타입 제한
MATCH p = shortestPath(
  (alice)-[:KNOWS*]-(bob)
)
RETURN p;

// 최대 깊이 제한
MATCH p = shortestPath(
  (alice)-[*..5]-(bob)  // 최대 5홉
)
RETURN p;
\`\`\`

### 성능 주의사항

\`\`\`cypher
// ❌ 위험: 무한 탐색 가능
MATCH p = shortestPath((a)-[*]-(b))

// ✅ 안전: 깊이 제한
MATCH p = shortestPath((a)-[*..10]-(b))
\`\`\`

## GDS BFS

GDS는 대규모 그래프에서 더 효율적입니다.

\`\`\`cypher
// 그래프 프로젝션
CALL gds.graph.project(
  'social',
  'Person',
  'KNOWS'
);

// BFS 탐색
MATCH (source:Person {name: 'Alice'})
CALL gds.bfs.stream('social', {
  sourceNode: source,
  targetNodes: [target]
})
YIELD path
RETURN path;
\`\`\`

## 모든 최단 경로 (All Shortest Paths)

두 노드 사이에 동일 길이의 경로가 여러 개 있을 수 있습니다.

\`\`\`cypher
// Cypher
MATCH p = allShortestPaths(
  (alice:Person {name: 'Alice'})-[*]-(bob:Person {name: 'Bob'})
)
RETURN p, length(p);

// GDS
CALL gds.allShortestPaths.stream('social', {
  sourceNode: alice
})
YIELD targetNode, distance, path
...
\`\`\`

## 실제 활용: 6단계 분리 법칙

"지구상의 모든 사람은 6다리 이내로 연결되어 있다"

\`\`\`cypher
// 두 사람 간의 연결 단계
MATCH p = shortestPath(
  (me:Person {name: 'Alice'})-[:KNOWS*]-(celebrity:Person {name: 'Celebrity'})
)
RETURN length(p) AS degrees_of_separation;

// 6단계 이내의 모든 연결 가능한 사람 수
MATCH (me:Person {name: 'Alice'})-[:KNOWS*1..6]-(connected:Person)
RETURN count(DISTINCT connected) AS reachable_people;
\`\`\`

BFS는 단순하지만 강력합니다!
다음은 Delta-Stepping으로 대규모 병렬 경로 탐색을 배워봅시다.
  `
)

// Task 5: Delta-Stepping 심화 학습
const task5DeltaSteppingDeep = createReadingTask(
  'w3d4-delta-stepping-deep',
  'Delta-Stepping: 병렬 최단 경로',
  25,
  [
    'Delta-Stepping 알고리즘의 원리',
    'Dijkstra와의 비교',
    '대규모 그래프에서의 성능 최적화'
  ],
  `
# Delta-Stepping: 병렬 최단 경로

## 1. 왜 Delta-Stepping인가?

Dijkstra는 **순차적** 알고리즘입니다.
- 한 번에 하나의 노드만 처리
- 병렬화가 어려움
- 대규모 그래프에서 느림

Delta-Stepping은 **병렬화 가능한** 최단 경로 알고리즘입니다!

## 2. 알고리즘 원리

### Delta (Δ) 파라미터

경로 거리를 "버킷"으로 나눕니다.

\`\`\`
Δ = 3인 경우:
버킷 0: 거리 [0, 3)
버킷 1: 거리 [3, 6)
버킷 2: 거리 [6, 9)
...
\`\`\`

### 처리 방식

1. 각 버킷 내의 노드들은 **병렬로** 처리 가능
2. 버킷 내에서 이웃 노드 갱신
3. 갱신된 노드가 같은 버킷이면 다시 처리
4. 버킷이 비면 다음 버킷으로 이동

### Light vs Heavy Edges

\`\`\`
Light Edge: 가중치 < Δ (버킷 내 이동)
Heavy Edge: 가중치 ≥ Δ (버킷 간 이동)
\`\`\`

Light Edge는 즉시 처리, Heavy Edge는 나중에 처리

## 3. GDS에서 Delta-Stepping

\`\`\`cypher
// 그래프 프로젝션
CALL gds.graph.project(
  'road-network',
  'City',
  {
    ROAD: {
      properties: ['distance'],
      orientation: 'UNDIRECTED'
    }
  }
);

// Delta-Stepping 최단 경로
MATCH (source:City {name: 'Seoul'}),
      (target:City {name: 'Busan'})
CALL gds.shortestPath.deltaStepping.stream('road-network', {
  sourceNode: source,
  targetNode: target,
  delta: 3.0,
  relationshipWeightProperty: 'distance'
})
YIELD totalCost, nodeIds
RETURN totalCost,
       [n IN nodeIds | gds.util.asNode(n).name] AS path;
\`\`\`

### Delta 선택 가이드

| Delta | 효과 |
|-------|------|
| 작음 (0.5) | 더 많은 버킷, 더 많은 동기화, 정확한 결과 |
| 큼 (5.0) | 더 적은 버킷, 더 적은 동기화, 빠르지만 더 많은 재계산 |

### 자동 Delta 설정

\`\`\`cypher
CALL gds.shortestPath.deltaStepping.stream('road-network', {
  sourceNode: source,
  targetNode: target,
  relationshipWeightProperty: 'distance'
  // delta 생략 시 자동 계산
})
...
\`\`\`

## 4. Dijkstra vs Delta-Stepping 성능

### 소규모 그래프 (< 10K 노드)
- Dijkstra가 더 빠를 수 있음
- 병렬화 오버헤드가 이점보다 큼

### 대규모 그래프 (> 100K 노드)
- Delta-Stepping이 훨씬 빠름
- 병렬화 이점이 극대화

### 벤치마크 예시

| 그래프 크기 | Dijkstra | Delta-Stepping (4 cores) |
|------------|----------|-------------------------|
| 10K 노드 | 50ms | 60ms |
| 100K 노드 | 800ms | 300ms |
| 1M 노드 | 15s | 4s |

## 5. Single Source vs All Pairs

### Single Source Shortest Path (SSSP)

\`\`\`cypher
// 하나의 출발지에서 모든 노드까지
MATCH (source:City {name: 'Seoul'})
CALL gds.allShortestPaths.deltaStepping.stream('road-network', {
  sourceNode: source,
  delta: 3.0,
  relationshipWeightProperty: 'distance'
})
YIELD targetNode, totalCost
RETURN gds.util.asNode(targetNode).name AS destination,
       totalCost
ORDER BY totalCost;
\`\`\`

### All Pairs (APSP) - 주의!

모든 쌍의 최단 경로는 매우 비쌉니다.

\`\`\`
노드 수 N → N² 쌍
1,000 노드 → 1,000,000 경로
10,000 노드 → 100,000,000 경로!
\`\`\`

대안:
- 샘플링으로 대표 경로만 계산
- 특정 노드 쌍에 대해서만 계산

## 6. 병렬 처리 설정

\`\`\`cypher
CALL gds.shortestPath.deltaStepping.stream('road-network', {
  sourceNode: source,
  targetNode: target,
  relationshipWeightProperty: 'distance',
  concurrency: 4  // 병렬 스레드 수
})
...
\`\`\`

### 메모리 추정

\`\`\`cypher
CALL gds.shortestPath.deltaStepping.stream.estimate('road-network', {
  sourceNode: source,
  targetNode: target,
  relationshipWeightProperty: 'distance'
})
YIELD nodeCount, relationshipCount, bytesMin, bytesMax
RETURN nodeCount, relationshipCount,
       bytesMin / 1024 / 1024 AS minMB,
       bytesMax / 1024 / 1024 AS maxMB;
\`\`\`

## 7. 실제 활용 패턴

### 물류 네트워크 최적화

\`\`\`cypher
// 모든 배송 센터에서 가장 가까운 창고 찾기
UNWIND ['Center_A', 'Center_B', 'Center_C'] AS centerName
MATCH (center:DeliveryCenter {name: centerName})

CALL gds.allShortestPaths.deltaStepping.stream('logistics', {
  sourceNode: center,
  relationshipWeightProperty: 'time'
})
YIELD targetNode, totalCost
WITH center, gds.util.asNode(targetNode) AS warehouse, totalCost
WHERE warehouse:Warehouse
WITH center, warehouse, totalCost
ORDER BY totalCost
WITH center, collect({warehouse: warehouse.name, time: totalCost})[0] AS nearest
RETURN center.name, nearest.warehouse, nearest.time;
\`\`\`

Delta-Stepping은 대규모 그래프의 필수 도구입니다!
  `
)

// Task 6: 최단 경로 종합 실습
const task6PathPractice = createCodeTask(
  'w3d4-path-practice',
  '최단 경로 종합 실습',
  30,
  [
    'BFS, Dijkstra, Delta-Stepping 비교',
    '다양한 경로 쿼리 작성',
    '성능 측정 및 분석'
  ],
  `
# 최단 경로 종합 실습

항공 노선 네트워크를 분석하여 최적 경로를 찾습니다.

## 과제

1. Cypher shortestPath로 최소 환승 경로 찾기
2. Dijkstra로 최소 비용 경로 찾기
3. Delta-Stepping으로 대규모 경로 계산
4. 경유지 포함 경로 최적화

## 데이터 구조
- Airport 노드 (code, name, city)
- FLIGHT 관계 (price, duration)
  `,
  `
// 실습 시작 코드

// ========================================
// Part 1: Cypher 최단 경로 (최소 환승)
// ========================================

// 1-1. ICN → LAX 최소 환승 경로
MATCH p = shortestPath(
  (start:Airport {code: '___'})-[:FLIGHT*]-(end:Airport {code: '___'})
)
RETURN
  [n IN nodes(p) | n.code] AS route,
  length(p) AS transfers;

// 1-2. 모든 최단 경로 (동일 환승 수)
MATCH p = allShortestPaths(
  (start:Airport {code: 'ICN'})-[:___*]-(end:Airport {code: 'LAX'})
)
RETURN
  [n IN nodes(p) | n.code] AS route,
  length(p) AS transfers;


// ========================================
// Part 2: Dijkstra (최소 비용)
// ========================================

// 2-1. 그래프 프로젝션
CALL gds.graph.project(
  'flights-price',
  'Airport',
  {
    FLIGHT: {
      properties: ['___'],
      orientation: 'UNDIRECTED'
    }
  }
);

// 2-2. ICN → LAX 최소 비용 경로
MATCH (start:Airport {code: 'ICN'}),
      (end:Airport {code: 'LAX'})
CALL gds.shortestPath.dijkstra.stream('___', {
  sourceNode: ___,
  targetNode: ___,
  relationshipWeightProperty: '___'
})
YIELD totalCost, nodeIds
RETURN
  [n IN nodeIds | gds.util.asNode(n).code] AS route,
  totalCost AS totalPrice;


// ========================================
// Part 3: Delta-Stepping (대규모)
// ========================================

// 3-1. ICN에서 모든 공항까지의 최소 비용
MATCH (source:Airport {code: 'ICN'})
CALL gds.allShortestPaths.deltaStepping.stream('flights-price', {
  sourceNode: ___,
  relationshipWeightProperty: '___'
})
YIELD targetNode, totalCost
RETURN
  gds.util.asNode(targetNode).code AS destination,
  totalCost AS price
ORDER BY totalCost
LIMIT 10;


// ========================================
// Part 4: 경유지 포함 경로
// ========================================

// 4-1. ICN → NRT (도쿄 경유) → LAX
// TODO: 두 구간의 합이 최소인 경로
  `,
  `
// 정답 코드

// ========================================
// Part 1: Cypher 최단 경로 (최소 환승)
// ========================================

// 1-1. ICN → LAX 최소 환승 경로
MATCH p = shortestPath(
  (start:Airport {code: 'ICN'})-[:FLIGHT*]-(end:Airport {code: 'LAX'})
)
RETURN
  [n IN nodes(p) | n.code] AS route,
  length(p) AS transfers;

// 1-2. 모든 최단 경로 (동일 환승 수)
MATCH p = allShortestPaths(
  (start:Airport {code: 'ICN'})-[:FLIGHT*]-(end:Airport {code: 'LAX'})
)
RETURN
  [n IN nodes(p) | n.code] AS route,
  length(p) AS transfers;


// ========================================
// Part 2: Dijkstra (최소 비용)
// ========================================

// 2-1. 그래프 프로젝션
CALL gds.graph.project(
  'flights-price',
  'Airport',
  {
    FLIGHT: {
      properties: ['price'],
      orientation: 'UNDIRECTED'
    }
  }
);

// 2-2. ICN → LAX 최소 비용 경로
MATCH (start:Airport {code: 'ICN'}),
      (end:Airport {code: 'LAX'})
CALL gds.shortestPath.dijkstra.stream('flights-price', {
  sourceNode: start,
  targetNode: end,
  relationshipWeightProperty: 'price'
})
YIELD totalCost, nodeIds
RETURN
  [n IN nodeIds | gds.util.asNode(n).code] AS route,
  totalCost AS totalPrice;


// ========================================
// Part 3: Delta-Stepping (대규모)
// ========================================

// 3-1. ICN에서 모든 공항까지의 최소 비용
MATCH (source:Airport {code: 'ICN'})
CALL gds.allShortestPaths.deltaStepping.stream('flights-price', {
  sourceNode: source,
  relationshipWeightProperty: 'price'
})
YIELD targetNode, totalCost
RETURN
  gds.util.asNode(targetNode).code AS destination,
  totalCost AS price
ORDER BY totalCost
LIMIT 10;


// ========================================
// Part 4: 경유지 포함 경로
// ========================================

// 4-1. ICN → NRT (도쿄 경유) → LAX
MATCH (start:Airport {code: 'ICN'}),
      (waypoint:Airport {code: 'NRT'}),
      (end:Airport {code: 'LAX'})

// 구간 1: ICN → NRT
CALL gds.shortestPath.dijkstra.stream('flights-price', {
  sourceNode: start,
  targetNode: waypoint,
  relationshipWeightProperty: 'price'
})
YIELD totalCost AS cost1, nodeIds AS path1

// 구간 2: NRT → LAX
CALL gds.shortestPath.dijkstra.stream('flights-price', {
  sourceNode: waypoint,
  targetNode: end,
  relationshipWeightProperty: 'price'
})
YIELD totalCost AS cost2, nodeIds AS path2

RETURN
  [n IN path1 | gds.util.asNode(n).code] +
  [n IN tail(path2) | gds.util.asNode(n).code] AS fullRoute,
  cost1 + cost2 AS totalPrice,
  cost1 AS legPrice1,
  cost2 AS legPrice2;


// ========================================
// Part 5: 비용 vs 환승 트레이드오프
// ========================================

// 5-1. 최소 환승 경로의 비용 계산
MATCH p = shortestPath(
  (start:Airport {code: 'ICN'})-[:FLIGHT*]-(end:Airport {code: 'LAX'})
)
WITH nodes(p) AS airports, length(p) AS transfers
UNWIND range(0, size(airports)-2) AS i
MATCH (airports[i])-[f:FLIGHT]-(airports[i+1])
WITH transfers, sum(f.price) AS minTransferPrice
RETURN 'Min Transfer' AS strategy, transfers, minTransferPrice

UNION ALL

// 5-2. 최소 비용 경로의 환승 수
MATCH (start:Airport {code: 'ICN'}),
      (end:Airport {code: 'LAX'})
CALL gds.shortestPath.dijkstra.stream('flights-price', {
  sourceNode: start,
  targetNode: end,
  relationshipWeightProperty: 'price'
})
YIELD totalCost, nodeIds
RETURN 'Min Price' AS strategy,
       size(nodeIds) - 1 AS transfers,
       totalCost AS minTransferPrice;


// 정리
CALL gds.graph.drop('flights-price');
  `,
  [
    'shortestPath는 최소 홉 수, Dijkstra는 최소 가중치입니다',
    '경유지 경로는 두 구간을 따로 계산 후 합칩니다',
    'tail() 함수로 첫 번째 원소(경유지)의 중복을 제거합니다',
    '같은 문제에도 최적화 기준에 따라 다른 경로가 나옵니다'
  ]
)

// Task 7: Minimum Spanning Tree 영상
const task7MstVideo = createVideoTask(
  'w3d4-mst-video',
  'Minimum Spanning Tree: 최소 비용 연결',
  20,
  [
    'Spanning Tree의 개념',
    'MST 알고리즘 (Prim, Kruskal)',
    '실제 활용 사례'
  ],
  'https://example.com/videos/mst',
  `
마지막으로 Minimum Spanning Tree(MST)를 배워보겠습니다.

## Spanning Tree란?

그래프의 모든 노드를 **사이클 없이** 연결하는 부분 그래프입니다.

\`\`\`
원본 그래프:
A---B
|\\ /|
| X |
|/ \\|
C---D

Spanning Tree (하나의 예):
A---B
|   |
|   |
C---D
(A-D, B-C 간선 제거)
\`\`\`

### 특성
- N개 노드 → N-1개 간선
- 모든 노드 연결
- 사이클 없음

## Minimum Spanning Tree

모든 Spanning Tree 중 **간선 가중치 합이 최소**인 것!

### 활용 사례

1. **네트워크 설계**: 최소 케이블로 모든 컴퓨터 연결
2. **도로 건설**: 최소 비용으로 모든 도시 연결
3. **클러스터링**: 데이터 포인트 그룹화
4. **근사 알고리즘**: TSP 등의 근사해 도출

## MST 알고리즘

### Prim's Algorithm
- 시작 노드에서 시작
- 가장 가까운 노드를 하나씩 추가
- O((V + E) log V)

### Kruskal's Algorithm
- 모든 간선을 가중치 순으로 정렬
- 사이클이 생기지 않는 간선만 추가
- O(E log E)

## GDS에서 MST

### Minimum Spanning Tree (Prim)

\`\`\`cypher
CALL gds.graph.project(
  'network',
  'Node',
  {
    CONNECTED: {
      properties: ['cost'],
      orientation: 'UNDIRECTED'
    }
  }
);

CALL gds.spanningTree.stream('network', {
  relationshipWeightProperty: 'cost'
})
YIELD nodeId, parentId, cost
RETURN gds.util.asNode(nodeId).name AS node,
       gds.util.asNode(parentId).name AS parent,
       cost;
\`\`\`

### 결과 예시

| node | parent | cost |
|------|--------|------|
| A | null | 0 |
| B | A | 2 |
| C | A | 3 |
| D | C | 1 |

총 비용: 2 + 3 + 1 = 6

### Write 모드

\`\`\`cypher
CALL gds.spanningTree.write('network', {
  relationshipWeightProperty: 'cost',
  writeRelationshipType: 'MST_EDGE',
  writeProperty: 'cost'
})
YIELD effectiveNodeCount, totalWeight
RETURN effectiveNodeCount, totalWeight;
\`\`\`

## 실제 활용 예시

### 네트워크 인프라 최적화

\`\`\`cypher
// 데이터 센터 연결 최적화
CALL gds.graph.project(
  'datacenter-network',
  'DataCenter',
  {
    POTENTIAL_LINK: {
      properties: ['constructionCost'],
      orientation: 'UNDIRECTED'
    }
  }
);

CALL gds.spanningTree.stream('datacenter-network', {
  relationshipWeightProperty: 'constructionCost'
})
YIELD nodeId, parentId, cost
WITH gds.util.asNode(nodeId) AS dc,
     gds.util.asNode(parentId) AS parent,
     cost
WHERE parent IS NOT NULL
RETURN dc.name AS datacenter,
       parent.name AS connectedTo,
       cost AS constructionCost
ORDER BY cost;
\`\`\`

### 클러스터링 활용

MST의 가장 긴 간선을 제거하면 클러스터가 됩니다!

\`\`\`cypher
// MST 생성 후 최장 간선 제거 → 2개 클러스터
CALL gds.spanningTree.stream('network', {
  relationshipWeightProperty: 'distance'
})
YIELD nodeId, parentId, cost
WITH collect({node: nodeId, parent: parentId, cost: cost}) AS mstEdges

// 최장 간선 찾기
UNWIND mstEdges AS edge
WITH edge ORDER BY edge.cost DESC LIMIT 1
WITH edge.node AS cutNode, edge.parent AS cutParent

// 두 클러스터로 분리
MATCH (n)
...
\`\`\`

MST는 네트워크 최적화의 기본 도구입니다!
오늘 배운 경로 탐색 알고리즘을 퀴즈로 정리해봅시다.
  `
)

// Task 8: Random Walk 심화 학습
const task8RandomWalkDeep = createReadingTask(
  'w3d4-random-walk-deep',
  'Random Walk: 확률적 그래프 탐색',
  25,
  [
    'Random Walk의 개념과 특성',
    '그래프 임베딩에서의 활용',
    'Node2Vec, DeepWalk와의 관계'
  ],
  `
# Random Walk: 확률적 그래프 탐색

## 1. Random Walk란?

그래프 위를 **무작위로 걸어다니는** 탐색 방법입니다.

\`\`\`
A → B → D → C → A → ...
(각 단계에서 이웃 중 랜덤 선택)
\`\`\`

### 특징
- 비결정적 (매번 다른 경로)
- 확률 분포 기반
- 그래프 구조 "샘플링"

## 2. 왜 Random Walk를 사용하는가?

### 1) 그래프 임베딩 (Node2Vec, DeepWalk)

노드를 벡터로 변환할 때 Random Walk로 "문맥"을 생성합니다.

\`\`\`
Walk: A → B → C → D → E

마치 문장처럼 처리:
"A B C D E"

Word2Vec 적용 → 노드 임베딩!
\`\`\`

### 2) 페이지 순위 계산

PageRank도 본질적으로 Random Walk입니다.

"무작위로 웹 페이지를 방문할 때, 각 페이지에 도착할 확률"

### 3) 커뮤니티 탐지

Random Walk가 오래 머무는 영역 = 커뮤니티

### 4) 추천 시스템

"이 사용자가 다음에 방문할 가능성이 높은 상품"

## 3. GDS Random Walk

### 기본 실행

\`\`\`cypher
CALL gds.graph.project(
  'social',
  'Person',
  'KNOWS'
);

MATCH (start:Person {name: 'Alice'})
CALL gds.randomWalk.stream('social', {
  sourceNodes: [start],
  walkLength: 10,
  walksPerNode: 5
})
YIELD nodeIds, path
RETURN [nodeId IN nodeIds | gds.util.asNode(nodeId).name] AS walk;
\`\`\`

### 결과 예시

\`\`\`
["Alice", "Bob", "Carol", "Alice", "Dave", "Eve", ...]
["Alice", "Carol", "Bob", "Dave", "Alice", "Bob", ...]
["Alice", "Dave", "Bob", "Carol", "Eve", "Dave", ...]
["Alice", "Bob", "Alice", "Carol", "Dave", "Bob", ...]
["Alice", "Carol", "Dave", "Eve", "Carol", "Alice", ...]
\`\`\`

## 4. 주요 파라미터

### walkLength
각 Walk의 길이 (몇 홉을 이동할지)

\`\`\`cypher
{
  walkLength: 80  // Node2Vec 논문 권장
}
\`\`\`

### walksPerNode
각 시작 노드당 생성할 Walk 수

\`\`\`cypher
{
  walksPerNode: 10  // 더 많은 샘플 = 더 안정적인 결과
}
\`\`\`

### 가중치 고려

\`\`\`cypher
{
  relationshipWeightProperty: 'strength'
  // 가중치가 높은 간선으로 이동할 확률 높음
}
\`\`\`

## 5. Biased Random Walk (Node2Vec)

Node2Vec은 **편향된** Random Walk를 사용합니다.

### Return Parameter (p)
- p < 1: 이전 노드로 돌아갈 확률 높음 (지역 탐색)
- p > 1: 이전 노드로 돌아갈 확률 낮음 (멀리 탐색)

### In-Out Parameter (q)
- q < 1: 더 멀리 탐색 (DFS 스타일)
- q > 1: 가까이 탐색 (BFS 스타일)

\`\`\`cypher
CALL gds.randomWalk.stream('social', {
  sourceNodes: [start],
  walkLength: 80,
  walksPerNode: 10,
  // Node2Vec 스타일 파라미터
  returnFactor: 1.0,   // p
  inOutFactor: 1.0     // q
})
...
\`\`\`

## 6. 활용 패턴

### 패턴 1: 그래프 임베딩 생성

\`\`\`cypher
// Random Walk 생성
CALL gds.randomWalk.stream('social', {
  walkLength: 40,
  walksPerNode: 10
})
YIELD nodeIds
WITH collect(nodeIds) AS walks

// 이후 Python 등에서 Word2Vec 학습
// walks → embedding vectors
\`\`\`

### 패턴 2: Node2Vec 직접 실행

\`\`\`cypher
// Node2Vec (Random Walk + Skip-gram)
CALL gds.node2vec.stream('social', {
  embeddingDimension: 64,
  walkLength: 40,
  walksPerNode: 10,
  returnFactor: 1.0,
  inOutFactor: 1.0
})
YIELD nodeId, embedding
RETURN gds.util.asNode(nodeId).name AS person,
       embedding;
\`\`\`

### 패턴 3: 경로 다양성 분석

\`\`\`cypher
// Random Walk로 도달 빈도 분석
MATCH (start:Person {name: 'Alice'})
CALL gds.randomWalk.stream('social', {
  sourceNodes: [start],
  walkLength: 10,
  walksPerNode: 100
})
YIELD nodeIds
UNWIND nodeIds AS nodeId
WITH gds.util.asNode(nodeId) AS person, count(*) AS visitCount
WHERE person.name <> 'Alice'
RETURN person.name, visitCount
ORDER BY visitCount DESC;
\`\`\`

## 7. PageRank와의 관계

PageRank = Random Walk의 정상 상태(Stationary Distribution)

\`\`\`
무한히 많은 Random Walk를 수행했을 때,
각 노드에 방문하는 비율 = PageRank 점수
\`\`\`

실제로 GDS의 PageRank는 Power Iteration으로 계산하지만,
개념적으로는 Random Walk와 동일합니다!

Random Walk는 그래프 분석의 강력한 도구입니다!
  `
)

// Task 9: 경로 탐색 퀴즈
const task9Quiz = createQuizTask(
  'w3d4-pathfinding-quiz',
  '경로 탐색 알고리즘 이해도 점검',
  15,
  [
    {
      question: 'Dijkstra 알고리즘의 제약 조건은?',
      options: [
        '무방향 그래프에서만 동작',
        '음수 가중치를 허용하지 않음',
        '가중치가 1인 경우에만 동작',
        '연결 그래프에서만 동작'
      ],
      answer: 1,
      explanation: 'Dijkstra는 양수 가중치만 지원합니다. 음수 가중치가 있으면 Bellman-Ford를 사용해야 합니다.'
    },
    {
      question: 'BFS가 최단 경로를 보장하는 경우는?',
      options: [
        '모든 그래프',
        '가중치 그래프',
        '무가중치 그래프 (또는 모든 가중치가 동일)',
        '방향 그래프만'
      ],
      answer: 2,
      explanation: 'BFS는 무가중치 그래프에서 최소 홉 수 = 최단 경로를 보장합니다.'
    },
    {
      question: 'Delta-Stepping이 Dijkstra보다 유리한 상황은?',
      options: [
        '소규모 그래프',
        '대규모 그래프에서 병렬 처리 가능할 때',
        '음수 가중치가 있을 때',
        '최단 경로가 아닌 모든 경로를 찾을 때'
      ],
      answer: 1,
      explanation: 'Delta-Stepping은 병렬화 가능하여 대규모 그래프에서 성능 이점이 있습니다.'
    },
    {
      question: 'Minimum Spanning Tree의 특성으로 틀린 것은?',
      options: [
        'N개 노드를 N-1개 간선으로 연결',
        '사이클이 없음',
        '모든 노드 간 최단 경로를 포함',
        '간선 가중치 합이 최소'
      ],
      answer: 2,
      explanation: 'MST는 모든 노드를 최소 비용으로 연결하지만, 노드 간 최단 경로를 보장하지는 않습니다.'
    },
    {
      question: 'Cypher의 shortestPath와 allShortestPaths의 차이는?',
      options: [
        'shortestPath는 가중치 고려, allShortestPaths는 무가중치',
        'shortestPath는 하나만, allShortestPaths는 동일 길이의 모든 경로',
        'shortestPath는 무방향, allShortestPaths는 방향',
        '차이 없음'
      ],
      answer: 1,
      explanation: 'allShortestPaths는 동일한 최단 길이를 가진 모든 경로를 반환합니다.'
    },
    {
      question: 'Random Walk가 주로 활용되는 분야는?',
      options: [
        '최단 경로 계산',
        '그래프 임베딩 (Node2Vec, DeepWalk)',
        '사이클 탐지',
        '위상 정렬'
      ],
      answer: 1,
      explanation: 'Random Walk는 Node2Vec, DeepWalk 등 그래프 임베딩의 핵심 기법입니다.'
    },
    {
      question: 'Yen\'s K-Shortest Paths 알고리즘의 목적은?',
      options: [
        '가장 긴 경로 찾기',
        '모든 경로 찾기',
        '상위 K개의 최단 경로 찾기',
        'K홉 이내의 경로만 찾기'
      ],
      answer: 2,
      explanation: 'Yen 알고리즘은 최단 경로뿐 아니라 2번째, 3번째... K번째로 짧은 경로도 찾습니다.'
    },
    {
      question: 'Single Source Shortest Path (SSSP)의 의미는?',
      options: [
        '단일 경로만 찾기',
        '하나의 출발지에서 모든 노드까지의 최단 경로',
        '특정 두 노드 간의 최단 경로',
        '모든 노드 쌍 간의 최단 경로'
      ],
      answer: 1,
      explanation: 'SSSP는 하나의 시작점에서 그래프의 모든 다른 노드까지의 최단 경로를 계산합니다.'
    }
  ]
)

// Task 10: Day 4 도전 과제
const task10Challenge = createChallengeTask(
  'w3d4-pathfinding-challenge',
  '스마트 물류 네트워크 최적화',
  45,
  [
    '다중 기준 경로 최적화 (비용, 시간, 거리)',
    '실시간 교통 상황을 반영한 동적 경로 탐색',
    '배송 차량 라우팅 문제 해결'
  ],
  [
    '물류 창고, 배송지, 도로 네트워크 모델링',
    '비용/시간/거리 각각의 최적 경로 계산 (Dijkstra)',
    '파레토 최적 경로 분석 (trade-off 시각화)',
    '교통 혼잡 시 대안 경로 (K-Shortest Paths)',
    '다중 배송지 순회 최적화 (TSP 근사)',
    '최소 비용으로 모든 창고 연결 (MST)'
  ],
  [
    '그래프 모델링의 적절성 (15%)',
    '최적화 알고리즘 선택의 타당성 (25%)',
    '다중 기준 trade-off 분석 (20%)',
    '대안 경로 생성의 실용성 (20%)',
    '코드 효율성 및 문서화 (20%)'
  ],
  [
    '실시간 가중치 업데이트 (교통 상황 반영)',
    '차량 용량 제약 조건 추가',
    '시간대별 비용 변동 반영'
  ]
)

// Task 11: 시뮬레이터 실습
const task11Simulator = createSimulatorTask(
  'w3d4-pathfinding-simulator',
  '경로 탐색 시뮬레이터',
  20,
  [
    '다양한 경로 탐색 알고리즘 시각적 비교',
    '가중치 변경에 따른 경로 변화 관찰',
    '대규모 그래프에서의 성능 측정'
  ],
  'pathfinding-algorithms',
  `
## 시뮬레이터 사용 가이드

### 1. 알고리즘 비교 모드
- BFS, Dijkstra, Delta-Stepping 동시 실행
- 탐색 과정 애니메이션으로 확인
- 방문 노드 수, 실행 시간 비교

### 2. 가중치 편집
- 간선 클릭으로 가중치 변경
- 변경 후 경로 자동 재계산
- 가중치 분포 시각화

### 3. 대규모 테스트
- 10K, 100K, 1M 노드 그래프 생성
- Delta-Stepping 병렬 성능 확인
- 메모리 사용량 모니터링

### 4. MST 시각화
- Prim vs Kruskal 비교
- 간선 선택 과정 애니메이션
- 최종 트리 하이라이팅

### 실습 과제
1. 100개 노드 그래프에서 BFS vs Dijkstra 비교
2. 가중치를 변경하여 경로가 달라지는 경우 찾기
3. 10K 노드에서 Dijkstra vs Delta-Stepping 성능 비교
4. MST로 네트워크 비용 최적화
  `
)

// Day 4 통합
export const day4Pathfinding: Day = {
  slug: 'pathfinding-algorithms',
  title: '경로 탐색 알고리즘 (Path Finding)',
  totalDuration: 240,
  tasks: [
    task1PathFindingIntro,
    task2DijkstraDeep,
    task3DijkstraPractice,
    task4BfsVideo,
    task5DeltaSteppingDeep,
    task6PathPractice,
    task7MstVideo,
    task8RandomWalkDeep,
    task9Quiz
  ],
  challenge: task10Challenge
}

// ============================================
// Day 4 통계
// ============================================
// Tasks: 11개 (9 regular + 1 challenge + 1 simulator)
// 총 학습 시간: 240분 (4시간)
// 주요 토픽:
//   - BFS/DFS 기초
//   - Dijkstra 알고리즘
//   - Delta-Stepping
//   - Minimum Spanning Tree
//   - Random Walk
//   - K-Shortest Paths
// ============================================
