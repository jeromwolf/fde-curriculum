// Day 2: 커뮤니티 탐지 (Community Detection)
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
// DAY 2: 커뮤니티 탐지 - 그래프에서 그룹 찾기
// =============================================================================

const day2OverviewContent = `# Day 2: 커뮤니티 탐지 (Community Detection)

## 학습 목표

커뮤니티 탐지는 네트워크에서 **밀접하게 연결된 노드 그룹**을 찾는 것입니다.
소셜 네트워크의 친구 그룹, 조직의 팀, 웹의 주제 클러스터 등을 발견할 수 있습니다.

### 오늘 배울 내용

1. **커뮤니티의 정의**
   - 내부 연결 밀도 > 외부 연결 밀도
   - Modularity (모듈성) 개념

2. **Louvain 알고리즘**
   - 가장 널리 사용되는 알고리즘
   - Modularity 최적화
   - 계층적 커뮤니티

3. **Label Propagation**
   - 빠른 커뮤니티 탐지
   - 레이블 전파 메커니즘

4. **Connected Components**
   - Weakly Connected Components (WCC)
   - Strongly Connected Components (SCC)

5. **Triangle Count & Clustering**
   - 삼각형 수 세기
   - 클러스터링 계수

## 커뮤니티 탐지가 필요한 이유

\`\`\`
Before:                     After:
  A---B---C                   [Group 1]
  |   |   |                   A---B---C
  D---E---F                   |   |   |
      |                       D---E---F
      G---H---I
      |   |   |               [Group 2]
      J---K---L               G---H---I
                              |   |   |
                              J---K---L
\`\`\`

## 알고리즘 비교

| 알고리즘 | 속도 | 품질 | 특징 |
|----------|------|------|------|
| **Louvain** | 빠름 | 높음 | 계층적, Modularity 최적화 |
| **Label Propagation** | 매우 빠름 | 중간 | 비결정적, 실시간 처리 |
| **WCC** | 빠름 | - | 연결 여부만 판단 |
| **SCC** | 중간 | - | 방향 그래프용 |

## 실습 데이터

\`\`\`cypher
// 커뮤니티 샘플 데이터
// 그룹 1: IT 팀
CREATE (a:Person {name: 'Alice', dept: 'IT'})
CREATE (b:Person {name: 'Bob', dept: 'IT'})
CREATE (c:Person {name: 'Charlie', dept: 'IT'})
CREATE (a)-[:WORKS_WITH]->(b)
CREATE (b)-[:WORKS_WITH]->(c)
CREATE (a)-[:WORKS_WITH]->(c)

// 그룹 2: 마케팅 팀
CREATE (d:Person {name: 'Diana', dept: 'Marketing'})
CREATE (e:Person {name: 'Eve', dept: 'Marketing'})
CREATE (f:Person {name: 'Frank', dept: 'Marketing'})
CREATE (d)-[:WORKS_WITH]->(e)
CREATE (e)-[:WORKS_WITH]->(f)
CREATE (d)-[:WORKS_WITH]->(f)

// 그룹 간 연결 (약한 연결)
CREATE (c)-[:WORKS_WITH]->(d)
\`\`\`

준비되셨나요? 네트워크에서 숨겨진 그룹을 찾아봅시다!
`

const modularityConceptContent = `# Modularity (모듈성) 개념

## 커뮤니티의 수학적 정의

좋은 커뮤니티 분할이란?
- **내부 연결**: 같은 커뮤니티 내 노드 간 연결이 많음
- **외부 연결**: 다른 커뮤니티 노드와 연결이 적음

## Modularity 공식

\`\`\`
Q = (1/2m) × Σ[(Aij - kikj/2m) × δ(ci, cj)]
\`\`\`

- **m**: 전체 엣지 수
- **Aij**: 노드 i, j 사이 엣지 존재 여부
- **ki, kj**: 노드 i, j의 degree
- **δ(ci, cj)**: i, j가 같은 커뮤니티면 1, 아니면 0

## 직관적 이해

Modularity = 실제 내부 연결 - 기대 내부 연결

\`\`\`
Q가 높을수록:
- 커뮤니티 내부 연결이 많음
- 무작위 네트워크보다 구조가 뚜렷함

Q 값 범위: -0.5 ~ 1.0
- Q > 0.3: 커뮤니티 구조가 있음
- Q > 0.7: 매우 뚜렷한 커뮤니티
\`\`\`

## 예시

\`\`\`
커뮤니티 A: [1, 2, 3]  (삼각형)
커뮤니티 B: [4, 5, 6]  (삼각형)
연결: 3 -- 4 (브릿지)

내부 연결: 6개 (각 삼각형 3개씩)
외부 연결: 1개 (브릿지)

→ 높은 Modularity!
\`\`\`

## GDS에서 Modularity 확인

\`\`\`cypher
// Louvain 실행 후 Modularity 확인
CALL gds.louvain.stats('myGraph')
YIELD modularity, communityCount
RETURN modularity, communityCount
\`\`\`

## Resolution 파라미터

Modularity 계산에 영향을 주는 파라미터:
- **낮은 resolution**: 큰 커뮤니티 선호
- **높은 resolution**: 작은 커뮤니티 선호

\`\`\`cypher
// resolution 조정
CALL gds.louvain.stream('myGraph', {
  resolution: 0.5  // 기본값 1.0
})
\`\`\`
`

const louvainAlgorithmVideoTranscript = `
안녕하세요! 오늘은 가장 인기 있는 커뮤니티 탐지 알고리즘인
Louvain 알고리즘을 배우겠습니다.

Louvain은 2008년 벨기에 루뱅 대학에서 개발되었고,
지금까지도 가장 널리 사용되는 알고리즘입니다.

Louvain의 핵심 아이디어는 "Modularity 최적화"입니다.
네트워크를 분할했을 때 Modularity가 최대가 되는 분할을 찾습니다.

알고리즘은 두 단계를 반복합니다:

Phase 1: Local Moving
- 각 노드를 이웃 커뮤니티로 이동해봅니다
- Modularity가 증가하면 이동, 아니면 유지
- 더 이상 개선이 없을 때까지 반복

Phase 2: Aggregation
- 같은 커뮤니티의 노드들을 하나의 슈퍼노드로 합침
- 슈퍼노드 간 관계로 새로운 그래프 생성
- Phase 1로 돌아가 반복

이 과정을 통해 계층적 커뮤니티 구조를 발견합니다.
작은 커뮤니티들이 더 큰 커뮤니티로 합쳐지는 구조입니다.

GDS에서 Louvain을 실행하는 방법을 보겠습니다.

먼저 그래프 프로젝션을 생성합니다:
CALL gds.graph.project('socialGraph', 'Person', 'KNOWS')

그 다음 Louvain을 실행합니다:
CALL gds.louvain.stream('socialGraph')
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId).name AS name, communityId
ORDER BY communityId

결과에서 같은 communityId를 가진 노드들이 하나의 커뮤니티입니다.

다음으로 Label Propagation 알고리즘을 살펴보겠습니다!
`

const louvainDeepDiveContent = `# Louvain 알고리즘 심화

## 알고리즘 동작 원리

### Phase 1: Local Optimization

\`\`\`
초기 상태: 각 노드가 자신만의 커뮤니티

반복:
  for each 노드 v:
    현재 커뮤니티에서 v 제거
    for each 이웃 커뮤니티 C:
      v를 C에 추가했을 때 ΔQ 계산
    v를 ΔQ가 최대인 커뮤니티로 이동

  변화가 없으면 Phase 2로
\`\`\`

### Phase 2: Network Aggregation

\`\`\`
커뮤니티들을 슈퍼노드로 합침:
- 커뮤니티 내 엣지 → 슈퍼노드의 self-loop
- 커뮤니티 간 엣지 → 슈퍼노드 간 엣지

새로운 그래프에서 Phase 1 반복
\`\`\`

## GDS에서 Louvain 실행

### 기본 실행

\`\`\`cypher
// 그래프 프로젝션
CALL gds.graph.project(
  'socialGraph',
  'Person',
  {
    KNOWS: {
      orientation: 'UNDIRECTED'
    }
  }
)

// Louvain 실행 (stream 모드)
CALL gds.louvain.stream('socialGraph')
YIELD nodeId, communityId, intermediateCommunityIds
RETURN gds.util.asNode(nodeId).name AS name,
       communityId,
       intermediateCommunityIds
ORDER BY communityId, name
\`\`\`

### 파라미터 조정

\`\`\`cypher
CALL gds.louvain.stream('socialGraph', {
  maxLevels: 10,           // 최대 계층 수
  maxIterations: 10,       // 각 레벨당 최대 반복
  tolerance: 0.0001,       // 수렴 임계값
  includeIntermediateCommunities: true,  // 중간 커뮤니티 포함
  resolution: 1.0          // 해상도 (작을수록 큰 커뮤니티)
})
YIELD nodeId, communityId, intermediateCommunityIds
RETURN *
\`\`\`

### 결과 저장

\`\`\`cypher
CALL gds.louvain.write('socialGraph', {
  writeProperty: 'community'
})
YIELD modularity, communityCount, ranLevels

// 확인
MATCH (p:Person)
RETURN p.community AS communityId, collect(p.name) AS members
ORDER BY communityId
\`\`\`

## 계층적 커뮤니티

\`\`\`cypher
// 중간 커뮤니티까지 저장
CALL gds.louvain.write('socialGraph', {
  writeProperty: 'community',
  includeIntermediateCommunities: true
})

// Level 0 (가장 세분화된)
MATCH (p:Person)
RETURN p.community[0] AS level0, collect(p.name) AS members

// Level 1 (더 큰 그룹)
MATCH (p:Person)
WHERE size(p.community) > 1
RETURN p.community[1] AS level1, collect(p.name) AS members
\`\`\`

## Seeded Louvain

미리 알고 있는 커뮤니티 정보를 초기값으로 사용:

\`\`\`cypher
// 부서 정보를 시드로 사용
MATCH (p:Person)
SET p.seedCommunity = CASE p.department
  WHEN 'Engineering' THEN 0
  WHEN 'Marketing' THEN 1
  WHEN 'Sales' THEN 2
  ELSE 3
END

// Seeded Louvain 실행
CALL gds.louvain.stream('socialGraph', {
  seedProperty: 'seedCommunity'
})
YIELD nodeId, communityId
RETURN *
\`\`\`

## 가중치 적용

\`\`\`cypher
// 가중치 있는 그래프 프로젝션
CALL gds.graph.project(
  'weightedGraph',
  'Person',
  {
    KNOWS: {
      orientation: 'UNDIRECTED',
      properties: 'strength'
    }
  }
)

// 가중치 기반 Louvain
CALL gds.louvain.stream('weightedGraph', {
  relationshipWeightProperty: 'strength'
})
YIELD nodeId, communityId
RETURN *
\`\`\`

## 활용 사례

### 1. 소셜 미디어 그룹 발견

\`\`\`cypher
CALL gds.louvain.write('socialGraph', {writeProperty: 'community'})

// 커뮤니티별 주요 키워드
MATCH (p:Person)-[:POSTED]->(post:Post)
WITH p.community AS community, post.hashtags AS tags
UNWIND tags AS tag
RETURN community, tag, count(*) AS frequency
ORDER BY community, frequency DESC
\`\`\`

### 2. 고객 세그먼테이션

\`\`\`cypher
// 구매 패턴 기반 고객 그룹
CALL gds.louvain.write('purchaseGraph', {writeProperty: 'segment'})

MATCH (c:Customer)
WITH c.segment AS segment, collect(c) AS customers
RETURN segment,
       size(customers) AS count,
       avg([c IN customers | c.totalPurchase]) AS avgPurchase
\`\`\`

### 3. 논문 주제 클러스터링

\`\`\`cypher
CALL gds.louvain.write('citationGraph', {writeProperty: 'topicCluster'})

MATCH (p:Paper)
WITH p.topicCluster AS cluster, collect(p.title) AS papers
RETURN cluster, papers[0..5] AS sampleTitles, size(papers) AS count
ORDER BY count DESC
\`\`\`
`

const labelPropagationContent = `# Label Propagation Algorithm (LPA)

## 개념

Label Propagation은 가장 빠른 커뮤니티 탐지 알고리즘입니다.
아이디어: **"각 노드는 이웃 중 가장 많은 레이블을 선택한다"**

## 알고리즘 동작

\`\`\`
1. 초기화: 각 노드에 고유 레이블 부여
2. 반복:
   - 모든 노드를 무작위 순서로 방문
   - 각 노드는 이웃 중 최빈 레이블로 변경
   - 동점이면 무작위 선택
3. 수렴: 더 이상 변화가 없으면 종료
\`\`\`

## 장단점

### 장점
- **매우 빠름**: Near-linear time O(E)
- **간단한 구현**
- **확장성**: 수억 노드도 처리 가능

### 단점
- **비결정적**: 실행마다 결과가 다를 수 있음
- **안정성**: 작은 변화에도 결과가 크게 바뀔 수 있음
- **Resolution Limit**: 작은 커뮤니티 탐지 어려움

## GDS에서 LPA 실행

### 기본 실행

\`\`\`cypher
CALL gds.labelPropagation.stream('socialGraph')
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId).name AS name, communityId
ORDER BY communityId
\`\`\`

### 파라미터

\`\`\`cypher
CALL gds.labelPropagation.stream('socialGraph', {
  maxIterations: 10,       // 최대 반복 횟수
  nodeWeightProperty: 'weight',  // 노드 가중치
  relationshipWeightProperty: 'strength'  // 관계 가중치
})
YIELD nodeId, communityId
RETURN *
\`\`\`

### 결과 저장

\`\`\`cypher
CALL gds.labelPropagation.write('socialGraph', {
  writeProperty: 'lpaCommunity'
})
YIELD communityCount, ranIterations, didConverge
RETURN *
\`\`\`

## Seeded Label Propagation

기존 레이블을 시드로 사용:

\`\`\`cypher
// 일부 노드에 미리 레이블 지정
MATCH (p:Person) WHERE p.name IN ['Alice', 'Bob']
SET p.seedLabel = 1
MATCH (p:Person) WHERE p.name IN ['Charlie', 'Diana']
SET p.seedLabel = 2

// Seeded LPA
CALL gds.labelPropagation.stream('socialGraph', {
  seedProperty: 'seedLabel'
})
YIELD nodeId, communityId
RETURN *
\`\`\`

## Louvain vs Label Propagation

\`\`\`cypher
// 두 알고리즘 비교
CALL gds.louvain.write('socialGraph', {writeProperty: 'louvain'});
CALL gds.labelPropagation.write('socialGraph', {writeProperty: 'lpa'});

MATCH (p:Person)
WITH p.louvain AS louvainComm, p.lpa AS lpaComm,
     collect(p.name) AS members
RETURN louvainComm, lpaComm, members
ORDER BY louvainComm, lpaComm
\`\`\`

## 활용 사례

### 실시간 커뮤니티 탐지

\`\`\`cypher
// 빠른 속도로 대규모 그래프 처리
CALL gds.labelPropagation.stream('largeGraph', {
  maxIterations: 5  // 빠른 근사해
})
YIELD nodeId, communityId
WITH communityId, count(*) AS size
WHERE size > 100
RETURN communityId, size
ORDER BY size DESC
\`\`\`

### 스트리밍 데이터

\`\`\`cypher
// 새 노드가 추가되면 빠르게 재분류
// 기존 커뮤니티를 시드로 사용하여 증분 업데이트
CALL gds.labelPropagation.stream('socialGraph', {
  seedProperty: 'existingCommunity',
  maxIterations: 3
})
\`\`\`
`

const connectedComponentsContent = `# Connected Components

## Weakly Connected Components (WCC)

방향을 무시하고 연결된 노드 그룹을 찾습니다.

\`\`\`
WCC: 무방향으로 연결된 컴포넌트

A → B → C      D → E
    ↑              ↓
    └──────────────┘

WCC1: {A, B, C, D, E} (모두 연결됨)
\`\`\`

### GDS에서 WCC

\`\`\`cypher
// WCC 실행
CALL gds.wcc.stream('myGraph')
YIELD nodeId, componentId
RETURN gds.util.asNode(nodeId).name AS name, componentId
ORDER BY componentId

// 컴포넌트 통계
CALL gds.wcc.stats('myGraph')
YIELD componentCount, componentDistribution
RETURN componentCount, componentDistribution
\`\`\`

### 결과 저장

\`\`\`cypher
CALL gds.wcc.write('myGraph', {
  writeProperty: 'wccComponent'
})
YIELD componentCount, nodePropertiesWritten

// 가장 큰 컴포넌트
MATCH (n)
WITH n.wccComponent AS component, count(*) AS size
RETURN component, size
ORDER BY size DESC
LIMIT 5
\`\`\`

## Strongly Connected Components (SCC)

방향을 고려하여 양방향으로 도달 가능한 노드 그룹:

\`\`\`
SCC: 양방향 도달 가능한 노드들

A → B → C
↑       ↓
└── D ←─┘

SCC1: {A, B, C, D} (모두 양방향 도달 가능)

---

A → B → C → D → E
        ↓
        F

SCC1: {C} (자기 자신만)
기타: 각각 별도 SCC
\`\`\`

### GDS에서 SCC

\`\`\`cypher
// SCC 실행
CALL gds.scc.stream('directedGraph')
YIELD nodeId, componentId
RETURN gds.util.asNode(nodeId).name AS name, componentId
ORDER BY componentId
\`\`\`

## 활용 사례

### 1. 데이터 품질 검증

\`\`\`cypher
// 연결되지 않은 노드 찾기
CALL gds.wcc.write('dataGraph', {writeProperty: 'component'})

// 고립된 노드
MATCH (n)
WITH n.component AS comp, count(*) AS size
WHERE size = 1
MATCH (isolated) WHERE isolated.component = comp
RETURN isolated.id AS isolatedNode
\`\`\`

### 2. 네트워크 분할 감지

\`\`\`cypher
// 메인 네트워크에서 분리된 그룹
CALL gds.wcc.stream('networkGraph')
YIELD nodeId, componentId
WITH componentId, count(*) AS size
ORDER BY size DESC
WITH collect(componentId)[0] AS mainComponent
MATCH (n) WHERE n.component <> mainComponent
RETURN n.name AS isolatedNode, n.component AS subNetwork
\`\`\`

### 3. 순환 의존성 탐지

\`\`\`cypher
// 코드 모듈 간 순환 의존성
CALL gds.scc.stream('dependencyGraph')
YIELD nodeId, componentId
WITH componentId, collect(gds.util.asNode(nodeId).name) AS modules
WHERE size(modules) > 1
RETURN componentId AS cyclicDependency, modules
\`\`\`
`

const triangleClusteringContent = `# Triangle Count & Clustering Coefficient

## Triangle Count

삼각형: 세 노드가 모두 서로 연결된 구조

\`\`\`
    A
   / \\
  B---C   ← 삼각형!
\`\`\`

삼각형이 많을수록 네트워크가 밀집되어 있습니다.

### GDS에서 Triangle Count

\`\`\`cypher
// 전체 삼각형 수
CALL gds.triangleCount.stream('socialGraph')
YIELD nodeId, triangleCount
RETURN gds.util.asNode(nodeId).name AS name, triangleCount
ORDER BY triangleCount DESC

// 총 삼각형 수
CALL gds.triangleCount.stats('socialGraph')
YIELD globalTriangleCount, nodeCount
RETURN globalTriangleCount, nodeCount
\`\`\`

## Local Clustering Coefficient

노드의 이웃들이 서로 얼마나 연결되어 있는지:

\`\`\`
CC(v) = 2T / (k × (k-1))

T: v를 포함한 삼각형 수
k: v의 이웃 수
\`\`\`

### GDS에서 Clustering Coefficient

\`\`\`cypher
CALL gds.localClusteringCoefficient.stream('socialGraph')
YIELD nodeId, localClusteringCoefficient
RETURN gds.util.asNode(nodeId).name AS name,
       round(localClusteringCoefficient * 1000) / 1000 AS clustering
ORDER BY clustering DESC
\`\`\`

## 해석

\`\`\`
Clustering Coefficient = 1.0
→ 이웃들이 모두 서로 연결됨 (완전 그래프)

Clustering Coefficient = 0.0
→ 이웃들이 전혀 연결되지 않음 (스타 구조)

일반적인 소셜 네트워크: 0.1 ~ 0.5
\`\`\`

## 활용 사례

### 1. 사기 탐지

\`\`\`cypher
// 정상 사용자는 친구의 친구와도 연결됨
// 가짜 계정은 clustering이 낮음
CALL gds.localClusteringCoefficient.stream('socialGraph')
YIELD nodeId, localClusteringCoefficient
WITH gds.util.asNode(nodeId) AS user, localClusteringCoefficient AS cc
WHERE user.followers > 1000 AND cc < 0.1
RETURN user.username AS suspiciousAccount, cc
\`\`\`

### 2. 밀집 그룹 탐지

\`\`\`cypher
// 삼각형이 많은 노드 = 밀집된 커뮤니티의 핵심
CALL gds.triangleCount.stream('socialGraph')
YIELD nodeId, triangleCount
WITH gds.util.asNode(nodeId) AS person, triangleCount
WHERE triangleCount > 10
RETURN person.name, triangleCount, person.community
ORDER BY triangleCount DESC
\`\`\`

### 3. 네트워크 구조 분석

\`\`\`cypher
// 전역 클러스터링 계수
CALL gds.localClusteringCoefficient.stats('socialGraph')
YIELD averageClusteringCoefficient, nodeCount
RETURN averageClusteringCoefficient,
       CASE
         WHEN averageClusteringCoefficient > 0.5 THEN 'High Clustering'
         WHEN averageClusteringCoefficient > 0.2 THEN 'Medium Clustering'
         ELSE 'Low Clustering'
       END AS networkType
\`\`\`
`

const communityPracticeInstructions = `# 커뮤니티 탐지 실습

## 🎯 왜 배우는가?

### 문제 상황
대규모 네트워크에서 "어떤 그룹들이 존재하는가?"를 알기 어렵습니다.
- 수천 개의 연결 속에서 숨겨진 패턴 발견 불가
- 부서/팀 구분이 실제 협업 패턴과 다를 수 있음
- 학제 간 연구 그룹을 자동으로 찾고 싶음

### 해결책: 커뮤니티 탐지
> 🏘️ **비유**: 아파트 단지 찾기
> - 같은 단지 안에서는 왕래가 많음 (내부 연결 밀집)
> - 단지 간에는 왕래가 적음 (외부 연결 희소)
> - **Louvain**: 단지를 자동으로 찾아줌
> - **Label Propagation**: 이웃을 보고 "나도 같은 단지" 결정

## 목표
다양한 커뮤니티 탐지 알고리즘을 적용하고 결과를 비교합니다.

## 시나리오
대학 연구 협업 네트워크를 분석합니다.
- **Researcher**: 연구자 노드
- **COAUTHORED**: 공동 저자 관계
- **CITED**: 인용 관계
- **SAME_DEPARTMENT**: 같은 학과

## 데이터 생성

\`\`\`cypher
// 컴퓨터 과학과
CREATE (cs1:Researcher {name: 'Prof. Kim', dept: 'CS', papers: 50})
CREATE (cs2:Researcher {name: 'Dr. Lee', dept: 'CS', papers: 30})
CREATE (cs3:Researcher {name: 'Dr. Park', dept: 'CS', papers: 25})
CREATE (cs4:Researcher {name: 'PhD. Cho', dept: 'CS', papers: 10})

// 물리학과
CREATE (ph1:Researcher {name: 'Prof. Jung', dept: 'Physics', papers: 60})
CREATE (ph2:Researcher {name: 'Dr. Yoon', dept: 'Physics', papers: 35})
CREATE (ph3:Researcher {name: 'PhD. Han', dept: 'Physics', papers: 15})

// 수학과
CREATE (ma1:Researcher {name: 'Prof. Lim', dept: 'Math', papers: 45})
CREATE (ma2:Researcher {name: 'Dr. Song', dept: 'Math', papers: 20})

// 학과 내 협업 (밀집)
CREATE (cs1)-[:COAUTHORED {papers: 10}]->(cs2)
CREATE (cs1)-[:COAUTHORED {papers: 8}]->(cs3)
CREATE (cs2)-[:COAUTHORED {papers: 5}]->(cs3)
CREATE (cs2)-[:COAUTHORED {papers: 3}]->(cs4)
CREATE (cs3)-[:COAUTHORED {papers: 2}]->(cs4)

CREATE (ph1)-[:COAUTHORED {papers: 12}]->(ph2)
CREATE (ph1)-[:COAUTHORED {papers: 6}]->(ph3)
CREATE (ph2)-[:COAUTHORED {papers: 4}]->(ph3)

CREATE (ma1)-[:COAUTHORED {papers: 7}]->(ma2)

// 학과 간 협업 (희소)
CREATE (cs1)-[:COAUTHORED {papers: 2}]->(ph1)  // 학제 간 연구
CREATE (cs2)-[:COAUTHORED {papers: 1}]->(ma1)  // 학제 간 연구
CREATE (ph1)-[:COAUTHORED {papers: 1}]->(ma1)  // 학제 간 연구

// 인용 관계
CREATE (cs4)-[:CITED]->(cs1)
CREATE (cs4)-[:CITED]->(ph1)
CREATE (ph3)-[:CITED]->(cs1)
\`\`\`

## 과제

### 과제 1: Louvain 알고리즘
학과별로 커뮤니티가 형성되는지 확인하세요.

### 과제 2: Label Propagation
Louvain과 결과를 비교하세요.

### 과제 3: WCC
연결 컴포넌트를 분석하세요.

### 과제 4: Triangle Count
가장 밀집된 협업 그룹을 찾으세요.

### 과제 5: 종합 분석
어떤 연구자가 학제 간 협업의 브릿지 역할을 하나요?

---

## ⚠️ Common Pitfalls (자주 하는 실수)

### 1. [알고리즘 선택] 모든 상황에 Louvain만 사용

**증상**: 대규모 실시간 처리에서 성능 저하

\`\`\`cypher
// ❌ 잘못된 예시 - 10억 노드에 Louvain
CALL gds.louvain.stream('hugeGraph')
// → 매우 느림, 메모리 부족
\`\`\`

**왜 잘못되었나**:
- Louvain은 품질 좋지만 대규모에서 느림
- 실시간 처리에는 Label Propagation이 적합

\`\`\`cypher
// ✅ 올바른 예시 - 상황에 맞는 알고리즘 선택
// 빠른 근사해가 필요하면 LPA
CALL gds.labelPropagation.stream('hugeGraph', {
  maxIterations: 5
})
// → O(E) 복잡도, 매우 빠름
\`\`\`

**기억할 점**:
> 정확도 vs 속도 트레이드오프를 고려하세요.
> - 품질 중시: Louvain
> - 속도 중시: Label Propagation
> - 연결 여부만: WCC

---

### 2. [파라미터] resolution 의미 오해

**증상**: 원하는 크기의 커뮤니티를 못 찾음

\`\`\`cypher
// ❌ 잘못된 예시 - resolution의 효과 모름
CALL gds.louvain.stream('graph', {
  resolution: 2.0  // "더 정밀하게"라고 생각
})
// → 실제로는 더 작은 커뮤니티 생성
\`\`\`

**왜 잘못되었나**:
- resolution 높음 = 작은 커뮤니티 선호
- resolution 낮음 = 큰 커뮤니티 선호
- 직관과 반대일 수 있음

\`\`\`cypher
// ✅ 올바른 예시 - resolution 이해하고 사용
// 큰 그룹을 찾고 싶다면
CALL gds.louvain.stream('graph', {resolution: 0.5})

// 세분화된 그룹을 찾고 싶다면
CALL gds.louvain.stream('graph', {resolution: 1.5})
\`\`\`

**기억할 점**:
> resolution↑ = 커뮤니티 크기↓, resolution↓ = 커뮤니티 크기↑

---

### 3. [결과 해석] LPA 결과가 매번 다름

**증상**: 같은 데이터인데 커뮤니티가 계속 바뀜

\`\`\`cypher
// ❌ 문제 상황 - LPA 첫 실행
CALL gds.labelPropagation.stream('graph')
// 결과: A,B → 커뮤니티 1

// LPA 두 번째 실행 (같은 데이터)
CALL gds.labelPropagation.stream('graph')
// 결과: A,B → 커뮤니티 2  // 바뀜!
\`\`\`

**왜 이런 현상?**:
- LPA는 비결정적 알고리즘
- 노드 방문 순서가 무작위
- 동점일 때 무작위 선택

\`\`\`cypher
// ✅ 해결책 1: Seeded LPA로 안정화
CALL gds.labelPropagation.stream('graph', {
  seedProperty: 'existingCommunity'  // 초기값 지정
})

// ✅ 해결책 2: 결정적 결과 필요하면 Louvain
CALL gds.louvain.stream('graph')  // 결정적
\`\`\`

**기억할 점**:
> LPA는 빠르지만 비결정적입니다. 재현성이 필요하면 Louvain이나 Seeded LPA를 사용하세요.
`

const communityPracticeStarterCode = `// ============================================
// 커뮤니티 탐지 실습
// ============================================


// ========================================
// 과제 1: 그래프 프로젝션 생성
// ========================================

// [WHY] 왜 공동저자 관계에 가중치를 사용하는가?
// - 단순 연결보다 "협업 강도"가 커뮤니티 형성에 중요
// - 논문 10편 공저 vs 1편 공저는 다른 의미
// - 가중치 기반 커뮤니티 탐지가 더 정확

// [SELECTION GUIDE] 프로젝션 설정:
// - UNDIRECTED: 공저 관계는 양방향 (A와 B가 공저 = B와 A가 공저)
// - properties: 'papers': 공동 저술 논문 수를 가중치로 사용

CALL gds.graph.project(
  'researchGraph',
  'Researcher',
  {
    COAUTHORED: {
      orientation: 'UNDIRECTED',
      properties: 'papers'
    }
  }
)


// ========================================
// 과제 2: Louvain 알고리즘
// ========================================

// [WHY] Louvain을 먼저 실행하는 이유?
// - 가장 높은 품질의 커뮤니티 탐지
// - Modularity 최적화 = 이론적으로 가장 좋은 분할
// - 기준선(baseline)으로 사용

// [SELECTION GUIDE] Louvain 파라미터:
// - relationshipWeightProperty: 가중치 사용 여부
// - resolution: 커뮤니티 크기 조절 (기본 1.0)
//   * < 1.0: 큰 커뮤니티
//   * > 1.0: 작은 커뮤니티

// [TODO] 구현할 내용:
// Step 1: gds.louvain.stream 호출
// Step 2: relationshipWeightProperty: 'papers' 설정
// Step 3: communityId별로 멤버 그룹화
// Step 4: Modularity 확인 (gds.louvain.stats)

CALL gds.louvain.stream('researchGraph', {
  // TODO: 가중치 파라미터 추가
})
// TODO: YIELD, RETURN 추가


// ========================================
// 과제 3: Label Propagation
// ========================================

// [WHY] LPA를 Louvain과 비교하는 이유?
// - LPA는 매우 빠름 (O(E) vs Louvain O(n log n))
// - 대규모 그래프에서 실용적
// - 두 알고리즘 결과가 얼마나 일치하는지 확인

// [SELECTION GUIDE] 언제 LPA를 선택?
// - 속도가 중요할 때
// - 실시간/스트리밍 처리
// - 초기 탐색 단계
// 주의: 비결정적 (매번 다른 결과 가능)

// [TODO] 구현할 내용:
// Step 1: gds.labelPropagation.stream 호출
// Step 2: 가중치 적용 (relationshipWeightProperty)
// Step 3: Louvain 결과와 비교 (커뮤니티 수, 크기 분포)

CALL gds.labelPropagation.stream('researchGraph', {
  // TODO: 가중치 파라미터 추가
})
// TODO: YIELD, RETURN 추가


// ========================================
// 과제 4: WCC (Weakly Connected Components)
// ========================================

// [WHY] WCC를 실행하는 이유?
// - 가장 기본적인 그래프 구조 확인
// - "연결되어 있는가?" 질문에 답변
// - 고립된 그룹/노드 발견

// [SELECTION GUIDE] WCC vs SCC:
// - WCC: 방향 무시, 연결 여부만 (무방향 그래프에 적합)
// - SCC: 양방향 도달 가능성 (방향 그래프에 적합)
// 여기서는 UNDIRECTED 그래프이므로 WCC 사용

// [TODO] 구현할 내용:
// Step 1: gds.wcc.stream 호출
// Step 2: componentId별 노드 수 계산
// Step 3: 고립된 노드 또는 작은 컴포넌트 확인

CALL gds.wcc.stream('researchGraph')
// TODO: YIELD, WITH, RETURN 추가


// ========================================
// 과제 5: Triangle Count & Clustering
// ========================================

// [WHY] 삼각형을 세는 이유?
// - 삼각형 = 밀집된 관계의 기본 단위
// - 삼각형이 많은 노드 = 응집력 있는 그룹의 핵심
// - Clustering Coefficient로 "친구의 친구도 친구인 정도" 측정

// [SELECTION GUIDE] Triangle Count vs Clustering Coefficient:
// - Triangle Count: 절대적 삼각형 수
// - Clustering Coefficient: 가능한 삼각형 대비 실제 비율
// 둘 다 보면 밀집도의 절대값과 비율 파악 가능

// [TODO] 구현할 내용:
// Step 1: gds.triangleCount.stream 호출
// Step 2: gds.localClusteringCoefficient.stream 호출
// Step 3: 높은 값을 가진 연구자 = 밀집 그룹의 핵심

CALL gds.triangleCount.stream('researchGraph')
// TODO: YIELD, RETURN 추가


// ========================================
// 과제 6: 브릿지 분석 (종합)
// ========================================

// [WHY] 브릿지 연구자를 찾는 이유?
// - 학제 간 협업 = 혁신의 원천
// - 브릿지 = 다른 커뮤니티 간 정보 흐름의 핵심
// - 조직에서 중요한 연결 역할

// [SELECTION GUIDE] 브릿지 식별 방법:
// 1. Betweenness Centrality: 최단 경로 위치
// 2. 커뮤니티 간 연결 수: 다른 커뮤니티와 연결된 이웃 수
// 두 지표를 결합하면 더 정확한 브릿지 식별

// [TODO] 구현할 내용:
// Step 1: Louvain으로 커뮤니티 저장 (write 모드)
// Step 2: Betweenness Centrality 계산
// Step 3: 학제 간 협업 수 계산 (다른 학과 공저자 수)
// Step 4: 종합 점수로 브릿지 순위화

// 커뮤니티 저장
CALL gds.louvain.write('researchGraph', {
  writeProperty: 'community',
  // TODO: 가중치 파라미터 추가
});

// 브릿지 분석
// TODO: Betweenness + 학제 간 연결 수 결합
`

const communityPracticeSolutionCode = `// ============================================
// 커뮤니티 탐지 실습 - 정답
// ============================================


// ========================================
// 과제 1: 그래프 프로젝션 생성
// ========================================

// [WHY] 가중치 프로젝션을 생성하는 이유?
// - 공저 논문 수(papers)가 협업 강도를 나타냄
// - 강한 협업 = 같은 커뮤니티에 속할 가능성 높음
// - 가중치 없이 탐지하면 실제 그룹과 다를 수 있음

CALL gds.graph.project(
  'researchGraph',
  'Researcher',
  {
    COAUTHORED: {
      orientation: 'UNDIRECTED',
      properties: 'papers'
    }
  }
);

// [RESULT] 프로젝션 생성 완료
// nodeCount: 9, relationshipCount: 22 (UNDIRECTED이므로 양방향)


// ========================================
// 과제 2: Louvain 알고리즘
// ========================================

// [WHY] Louvain을 기준선으로 사용하는 이유?
// - Modularity 최적화 = 이론적으로 가장 좋은 분할
// - 품질이 높고 결정적 (매번 같은 결과)
// - 다른 알고리즘과 비교할 기준

// [STEP 1] Louvain 실행 with 가중치
// [PARAM] relationshipWeightProperty: 'papers'
//   - 공저 논문 수를 가중치로 사용
//   - 많은 논문 공저 = 더 강한 연결
CALL gds.louvain.stream('researchGraph', {
  relationshipWeightProperty: 'papers'
})
YIELD nodeId, communityId
// [STEP 2] 커뮤니티별 멤버 그룹화
WITH gds.util.asNode(nodeId) AS researcher, communityId
RETURN communityId,
       collect(researcher.name) AS members,
       collect(researcher.dept)[0] AS mainDept
ORDER BY communityId;

// [RESULT] 예상 결과:
// | communityId | members                          | mainDept |
// | 0           | [Prof. Kim, Dr. Lee, ...]        | CS       |
// | 1           | [Prof. Jung, Dr. Yoon, ...]      | Physics  |
// | 2           | [Prof. Lim, Dr. Song]            | Math     |
// [INSIGHT] 학과별로 커뮤니티가 형성됨 (실제 협업 패턴 반영)


// [STEP 3] Modularity 확인
// [WHY] Modularity 값으로 커뮤니티 품질 평가
// Q > 0.3: 커뮤니티 구조 존재
// Q > 0.7: 매우 뚜렷한 커뮤니티
CALL gds.louvain.stats('researchGraph', {
  relationshipWeightProperty: 'papers'
})
YIELD modularity, communityCount
RETURN modularity, communityCount;

// [RESULT] modularity ≈ 0.45, communityCount = 3
// [INSIGHT] 중간 수준의 커뮤니티 구조 (학과 간 협업 존재)


// ========================================
// 과제 3: Label Propagation
// ========================================

// [WHY] LPA로 Louvain과 비교하는 이유?
// - 속도 차이 확인 (LPA가 훨씬 빠름)
// - 결과 일치도 확인 (유사하면 둘 다 신뢰)
// - 비결정적 특성 이해

// [STEP 1] LPA 실행
// [ALTERNATIVE] Louvain vs LPA:
//   - Louvain: 느리지만 정확, 결정적
//   - LPA: 빠르지만 비결정적
CALL gds.labelPropagation.stream('researchGraph', {
  relationshipWeightProperty: 'papers'
})
YIELD nodeId, communityId AS lpaComm
WITH gds.util.asNode(nodeId) AS researcher, lpaComm
RETURN lpaComm,
       collect(researcher.name) AS members,
       size(collect(researcher.name)) AS count
ORDER BY count DESC;

// [RESULT] 대체로 Louvain과 유사한 결과
// [INSIGHT] 두 알고리즘이 비슷한 결과 = 커뮤니티 구조가 뚜렷함


// ========================================
// 과제 4: WCC (Weakly Connected Components)
// ========================================

// [WHY] WCC로 기본 연결 구조 확인?
// - 네트워크가 하나로 연결되어 있는지 확인
// - 고립된 노드/그룹 발견
// - 커뮤니티 탐지 전 데이터 품질 검증

// [STEP 1] WCC 실행
CALL gds.wcc.stream('researchGraph')
YIELD nodeId, componentId
// [STEP 2] 컴포넌트별 크기 계산
WITH componentId, count(*) AS size, collect(gds.util.asNode(nodeId).name) AS members
RETURN componentId, size, members
ORDER BY size DESC;

// [RESULT] componentId=0, size=9, members=[모든 연구자]
// [INSIGHT] 하나의 연결 컴포넌트 = 모든 연구자가 직간접적으로 연결됨
// 학제 간 협업이 네트워크를 하나로 묶는 역할


// ========================================
// 과제 5: Triangle Count & Clustering
// ========================================

// [WHY] 삼각형 분석이 중요한 이유?
// - 삼각형 = "친구의 친구도 친구" 관계
// - 많은 삼각형 = 밀집된 협업 그룹
// - Clustering Coefficient = 밀집도의 비율 표현

// [STEP 1] Triangle Count
CALL gds.triangleCount.stream('researchGraph')
YIELD nodeId, triangleCount
WITH gds.util.asNode(nodeId) AS researcher, triangleCount
WHERE triangleCount > 0
RETURN researcher.name AS name,
       researcher.dept AS department,
       triangleCount
ORDER BY triangleCount DESC;

// [RESULT] 예상:
// | name      | department | triangleCount |
// | Prof. Kim | CS         | 3             | ← 학과 내 밀집 협업
// [INSIGHT] 삼각형이 많은 연구자 = 학과 내 핵심 협업자


// [STEP 2] Local Clustering Coefficient
// [WHY] 비율로 밀집도를 보는 이유?
// - 절대 수는 연결 많으면 자동으로 높음
// - 비율은 "이웃들 간 연결 밀도" 측정
// - CC = 1.0: 이웃들이 모두 서로 연결 (완전 그래프)
CALL gds.localClusteringCoefficient.stream('researchGraph')
YIELD nodeId, localClusteringCoefficient
WITH gds.util.asNode(nodeId) AS researcher, localClusteringCoefficient AS cc
RETURN researcher.name,
       researcher.dept,
       round(cc * 1000) / 1000 AS clusteringCoeff
ORDER BY clusteringCoeff DESC;

// [RESULT] PhD 학생들이 높은 CC (학과 내에서만 협업)
// [INSIGHT] 높은 CC + 낮은 삼각형 = 작은 밀집 그룹
//          낮은 CC + 높은 삼각형 = 큰 그룹의 허브


// ========================================
// 과제 6: 브릿지 분석 (종합)
// ========================================

// [WHY] 브릿지 연구자 식별이 중요한 이유?
// - 학제 간 협업 = 혁신의 원천
// - 브릿지가 빠지면 네트워크 분리될 수 있음
// - 조직에서 핵심 인물 파악

// [STEP 1] 커뮤니티 정보를 DB에 저장
// [PARAM] writeProperty: 노드 속성으로 저장
CALL gds.louvain.write('researchGraph', {
  writeProperty: 'community',
  relationshipWeightProperty: 'papers'
});

// [STEP 2] Betweenness Centrality 계산
// [WHY] Betweenness = 최단 경로 위치
// 높은 Betweenness = 정보 흐름의 병목점
CALL gds.betweenness.stream('researchGraph')
YIELD nodeId, score AS betweenness
WITH gds.util.asNode(nodeId) AS researcher, betweenness

// [STEP 3] 학제 간 협업 수 계산
// [WHY] 다른 학과와 협업 = 실제 브릿지 역할
MATCH (researcher)-[:COAUTHORED]-(coauthor:Researcher)
WHERE researcher.dept <> coauthor.dept
WITH researcher, betweenness, count(DISTINCT coauthor) AS interdisciplinaryLinks

// [STEP 4] 결과 반환
RETURN researcher.name AS bridgeResearcher,
       researcher.dept AS department,
       round(betweenness * 100) / 100 AS betweennessScore,
       interdisciplinaryLinks
ORDER BY betweennessScore DESC
LIMIT 5;

// [RESULT] 예상:
// | bridgeResearcher | department | betweennessScore | interdisciplinaryLinks |
// | Prof. Kim        | CS         | 15.5             | 1                      |
// | Prof. Jung       | Physics    | 12.3             | 2                      |
// [INSIGHT] Prof. Kim과 Prof. Jung이 학제 간 브릿지 역할
// 이들이 빠지면 CS-Physics-Math 협업 네트워크가 단절됨


// ========================================
// 정리: 프로젝션 삭제
// ========================================

// [WHY] 분석 완료 후 정리하는 이유?
// - 프로젝션은 메모리에 상주
// - 불필요한 메모리 낭비 방지
// - 같은 이름 재사용 시 충돌 방지
CALL gds.graph.drop('researchGraph');
`

const day2QuizQuestions = [
  {
    question: 'Modularity가 높은 네트워크의 특징은?',
    options: [
      '모든 노드가 서로 연결됨',
      '커뮤니티 내부 연결이 외부 연결보다 많음',
      '노드 수가 많음',
      '방향 그래프임'
    ],
    answer: 1,
    explanation: 'Modularity는 커뮤니티 내부 연결이 무작위 네트워크보다 많은 정도를 측정합니다. 높을수록 뚜렷한 커뮤니티 구조입니다.'
  },
  {
    question: 'Louvain 알고리즘의 두 단계는?',
    options: [
      'Initialization, Termination',
      'Local Optimization, Network Aggregation',
      'Training, Testing',
      'Forward, Backward'
    ],
    answer: 1,
    explanation: 'Louvain은 Local Optimization(노드를 최적 커뮤니티로 이동)과 Network Aggregation(커뮤니티를 슈퍼노드로 합침)을 반복합니다.'
  },
  {
    question: 'Label Propagation의 가장 큰 장점은?',
    options: [
      '높은 정확도',
      '결정적 결과',
      '매우 빠른 속도',
      '적은 메모리 사용'
    ],
    answer: 2,
    explanation: 'Label Propagation은 Near-linear time O(E)로 매우 빠릅니다. 단, 비결정적이라 실행마다 결과가 다를 수 있습니다.'
  },
  {
    question: 'WCC와 SCC의 차이점은?',
    options: [
      'WCC는 방향을 무시, SCC는 방향을 고려',
      'WCC는 느림, SCC는 빠름',
      'WCC는 가중치 사용, SCC는 미사용',
      '차이 없음'
    ],
    answer: 0,
    explanation: 'WCC(Weakly Connected)는 방향을 무시하고 연결 여부만 봅니다. SCC(Strongly Connected)는 양방향 도달 가능성을 확인합니다.'
  },
  {
    question: 'Local Clustering Coefficient가 1.0인 노드의 특징은?',
    options: [
      '연결이 전혀 없음',
      '이웃들이 모두 서로 연결됨',
      '가장 많은 연결을 가짐',
      '중심에 위치함'
    ],
    answer: 1,
    explanation: 'Clustering Coefficient 1.0은 노드의 모든 이웃이 서로 연결되어 있다는 의미입니다. 완전 그래프(clique) 구조입니다.'
  },
  {
    question: 'Louvain의 resolution 파라미터를 낮추면?',
    options: [
      '더 많은 작은 커뮤니티',
      '더 적은 큰 커뮤니티',
      '같은 결과',
      '알고리즘 속도 증가'
    ],
    answer: 1,
    explanation: 'resolution이 낮으면 커뮤니티를 합치는 경향이 강해져 더 적은 수의 큰 커뮤니티가 형성됩니다.'
  },
  {
    question: 'Triangle Count가 높은 노드는?',
    options: [
      '고립된 노드',
      '밀집된 커뮤니티의 일원',
      '허브 노드',
      '브릿지 노드'
    ],
    answer: 1,
    explanation: '삼각형이 많다는 것은 이웃들이 서로도 연결되어 있다는 의미로, 밀집된 커뮤니티에 속한 노드입니다.'
  },
  {
    question: 'Seeded 알고리즘의 용도는?',
    options: [
      '알고리즘 속도 향상',
      '사전 지식을 초기값으로 활용',
      '결과를 파일로 저장',
      '그래프 시각화'
    ],
    answer: 1,
    explanation: 'Seeded 알고리즘은 부서, 지역 등 사전에 알고 있는 정보를 초기 레이블로 사용하여 더 의미 있는 결과를 얻습니다.'
  }
]

const day2ChallengeContent = {
  objectives: [
    '다양한 커뮤니티 탐지 알고리즘 비교',
    '계층적 커뮤니티 구조 분석',
    '네트워크 밀집도 측정',
    '비즈니스 인사이트 도출'
  ],
  requirements: [
    '최소 30개 노드의 네트워크 데이터 생성',
    'Louvain, LPA, WCC 세 가지 알고리즘 실행',
    '각 알고리즘의 커뮤니티 수와 크기 분포 비교',
    'Triangle Count와 Clustering Coefficient 분석',
    '결과를 해석하여 네트워크 구조 설명'
  ],
  evaluationCriteria: [
    '데이터 모델링 (20%)',
    '알고리즘 실행 정확성 (25%)',
    '결과 비교 분석 (25%)',
    '인사이트 도출 (30%)'
  ],
  bonusPoints: [
    '계층적 Louvain 분석 (intermediate communities)',
    '가중치 기반 커뮤니티 탐지',
    '시각화 (Bloom, D3.js 등)',
    '시간에 따른 커뮤니티 변화 분석'
  ]
}

// Day 2 완성
export const day2Community: Day = {
  slug: 'community-detection',
  title: '커뮤니티 탐지 (Community Detection)',
  totalDuration: 240,
  tasks: [
    createReadingTask(
      'day2-overview',
      'Day 2 개요: 커뮤니티 탐지',
      15,
      [
        '커뮤니티의 정의 이해',
        '알고리즘 비교',
        '활용 사례'
      ],
      day2OverviewContent
    ),

    createReadingTask(
      'modularity-concept',
      'Modularity (모듈성) 개념',
      15,
      [
        'Modularity 공식',
        'Resolution 파라미터',
        '좋은 커뮤니티 분할의 기준'
      ],
      modularityConceptContent
    ),

    createVideoTask(
      'louvain-video',
      'Louvain 알고리즘 소개',
      20,
      [
        'Louvain 동작 원리',
        'GDS 사용법',
        '계층적 커뮤니티'
      ],
      'https://example.com/louvain-algorithm',
      louvainAlgorithmVideoTranscript
    ),

    createReadingTask(
      'louvain-deep-dive',
      'Louvain 알고리즘 심화',
      25,
      [
        '파라미터 조정',
        'Seeded Louvain',
        '가중치 적용'
      ],
      louvainDeepDiveContent
    ),

    createReadingTask(
      'label-propagation',
      'Label Propagation Algorithm',
      20,
      [
        'LPA 동작 원리',
        '장단점',
        'Louvain과 비교'
      ],
      labelPropagationContent
    ),

    createReadingTask(
      'connected-components',
      'Connected Components (WCC/SCC)',
      20,
      [
        'WCC vs SCC',
        '활용 사례',
        '네트워크 분할 감지'
      ],
      connectedComponentsContent
    ),

    createReadingTask(
      'triangle-clustering',
      'Triangle Count & Clustering',
      20,
      [
        '삼각형 수 계산',
        'Clustering Coefficient',
        '밀집도 측정'
      ],
      triangleClusteringContent
    ),

    createCodeTask(
      'community-practice',
      '커뮤니티 탐지 실습',
      40,
      [
        '🔄 다양한 알고리즘 실행',
        '📊 결과 비교',
        '🌉 브릿지 노드 식별'
      ],
      communityPracticeInstructions,
      communityPracticeStarterCode,
      communityPracticeSolutionCode,
      [
        'Louvain은 가중치를 지원합니다',
        'LPA는 빠르지만 결과가 매번 다를 수 있습니다',
        'WCC는 연결 여부만 확인합니다',
        '브릿지는 Betweenness와 커뮤니티 정보를 결합'
      ]
    ),

    createQuizTask(
      'day2-quiz',
      '커뮤니티 탐지 퀴즈',
      20,
      day2QuizQuestions
    ),

    createChallengeTask(
      'day2-challenge',
      'Day 2 챌린지: 네트워크 커뮤니티 분석',
      35,
      day2ChallengeContent.objectives,
      day2ChallengeContent.requirements,
      day2ChallengeContent.evaluationCriteria,
      day2ChallengeContent.bonusPoints
    ),

    createSimulatorTask(
      'day2-simulator',
      '커뮤니티 탐지 시뮬레이터',
      10,
      [
        '실시간 커뮤니티 시각화',
        '알고리즘 비교',
        '파라미터 실험'
      ],
      'community-simulator',
      `## 커뮤니티 탐지 시뮬레이터

다양한 커뮤니티 탐지 알고리즘을 실험하세요.

### 기능
1. 네트워크 생성/로드
2. Louvain, LPA, WCC 실행
3. 커뮤니티 색상 시각화
4. 파라미터 조정`
    )
  ]
}
