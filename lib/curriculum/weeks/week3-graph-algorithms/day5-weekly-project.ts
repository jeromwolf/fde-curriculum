// Week 3 Day 5: 주간 프로젝트 - 소셜 네트워크 분석 플랫폼
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
// Day 5: 주간 프로젝트 - 소셜 네트워크 분석 플랫폼
// ============================================
// 프로젝트 목표:
// 1. Week 3에서 배운 모든 그래프 알고리즘 통합 적용
// 2. 실제 소셜 네트워크 데이터 분석
// 3. 인플루언서 탐지, 커뮤니티 분석, 추천 시스템 구축
// 4. 분석 결과 시각화 및 리포트 작성
// ============================================

// Task 1: 프로젝트 개요 및 설계
const task1ProjectOverview = createVideoTask(
  'w3d5-project-overview',
  '주간 프로젝트: 소셜 네트워크 분석 플랫폼',
  20,
  [
    '프로젝트 목표와 범위 이해',
    '소셜 네트워크 분석의 비즈니스 가치',
    '분석 파이프라인 설계',
    '평가 기준 확인'
  ],
  'https://example.com/videos/week3-project-overview',
  `
안녕하세요! Week 3의 마지막 날, 주간 프로젝트 시간입니다.

## 프로젝트 소개

이번 주에 배운 **4가지 그래프 알고리즘 카테고리**를 모두 활용하여
완전한 소셜 네트워크 분석 플랫폼을 구축합니다.

### 사용할 알고리즘

| Day | 카테고리 | 적용 |
|-----|---------|------|
| Day 1 | 중심성 | 인플루언서 탐지 |
| Day 2 | 커뮤니티 | 사용자 그룹 분석 |
| Day 3 | 유사도 | 친구 추천 시스템 |
| Day 4 | 경로 탐색 | 연결 관계 분석 |

## 비즈니스 시나리오

당신은 새로운 소셜 미디어 스타트업의 데이터 분석가입니다.

**요구사항:**
1. 가장 영향력 있는 사용자(인플루언서) 식별
2. 자연스러운 사용자 그룹(커뮤니티) 발견
3. "알 수도 있는 친구" 추천 시스템 구현
4. 두 사용자 간의 연결 경로 시각화
5. 네트워크 건강도 대시보드 구축

## 데이터셋

**SocialNet 데이터셋:**
- 10,000 사용자 (User 노드)
- 50,000 팔로우 관계 (FOLLOWS 관계)
- 30,000 포스트 (Post 노드)
- 100,000 좋아요 (LIKED 관계)
- 사용자 프로필 속성 (interests, location, joinDate)

## 프로젝트 구조

\`\`\`
Part 1: 데이터 모델링 및 프로젝션 (30분)
Part 2: 인플루언서 분석 (45분)
Part 3: 커뮤니티 분석 (45분)
Part 4: 추천 시스템 (45분)
Part 5: 연결 분석 (30분)
Part 6: 통합 대시보드 (45분)
\`\`\`

## 평가 기준

| 항목 | 배점 |
|------|------|
| 데이터 모델링 | 15% |
| 알고리즘 적용 정확성 | 30% |
| 결과 해석 및 인사이트 | 25% |
| 코드 품질 | 15% |
| 최종 리포트 | 15% |

## 제출물

1. **Cypher 쿼리 파일** (.cypher)
2. **분석 리포트** (마크다운 또는 PDF)
3. **시각화 스크린샷** (선택)

자, 시작해볼까요? 먼저 데이터 모델링부터 진행합니다!
  `
)

// Task 2: 데이터 모델링 및 프로젝션
const task2DataModeling = createReadingTask(
  'w3d5-data-modeling',
  'Part 1: 데이터 모델링 및 GDS 프로젝션',
  25,
  [
    '소셜 네트워크 그래프 모델 이해',
    '다중 GDS 프로젝션 설계',
    '분석 목적별 프로젝션 전략'
  ],
  `
# Part 1: 데이터 모델링 및 GDS 프로젝션

## 1. 소셜 네트워크 그래프 모델

### 노드 타입

\`\`\`cypher
// User 노드
(:User {
  id: STRING,
  name: STRING,
  username: STRING,
  bio: STRING,
  interests: LIST<STRING>,
  location: STRING,
  joinDate: DATE,
  followerCount: INTEGER,
  followingCount: INTEGER,
  postCount: INTEGER
})

// Post 노드
(:Post {
  id: STRING,
  content: STRING,
  createdAt: DATETIME,
  likeCount: INTEGER,
  commentCount: INTEGER,
  hashtags: LIST<STRING>
})

// Hashtag 노드
(:Hashtag {
  name: STRING,
  usageCount: INTEGER
})
\`\`\`

### 관계 타입

\`\`\`cypher
// 사용자 간 관계
(:User)-[:FOLLOWS {since: DATE}]->(:User)
(:User)-[:BLOCKS]->(:User)

// 콘텐츠 관계
(:User)-[:POSTED {at: DATETIME}]->(:Post)
(:User)-[:LIKED {at: DATETIME}]->(:Post)
(:User)-[:COMMENTED {at: DATETIME, content: STRING}]->(:Post)
(:User)-[:SHARED {at: DATETIME}]->(:Post)

// 해시태그 관계
(:Post)-[:TAGGED]->(:Hashtag)
(:User)-[:INTERESTED_IN {weight: FLOAT}]->(:Hashtag)
\`\`\`

## 2. 분석별 GDS 프로젝션

### 프로젝션 1: 팔로우 네트워크 (인플루언서 분석용)

\`\`\`cypher
CALL gds.graph.project(
  'follow-network',
  'User',
  {
    FOLLOWS: {
      orientation: 'NATURAL'  // 방향 유지
    }
  }
);
\`\`\`

**용도:**
- PageRank (인플루언서 점수)
- In-Degree Centrality (팔로워 수)
- Betweenness (정보 브로커)

### 프로젝션 2: 상호 팔로우 네트워크 (커뮤니티 분석용)

\`\`\`cypher
// 상호 팔로우 관계 생성
MATCH (a:User)-[:FOLLOWS]->(b:User)-[:FOLLOWS]->(a)
WHERE id(a) < id(b)  // 중복 방지
MERGE (a)-[:MUTUAL_FOLLOW]->(b);

// 프로젝션
CALL gds.graph.project(
  'mutual-network',
  'User',
  {
    MUTUAL_FOLLOW: {
      orientation: 'UNDIRECTED'
    }
  }
);
\`\`\`

**용도:**
- Louvain (커뮤니티 탐지)
- Label Propagation
- Triangle Count

### 프로젝션 3: 좋아요 네트워크 (추천 시스템용)

\`\`\`cypher
CALL gds.graph.project(
  'like-network',
  ['User', 'Post'],
  {
    LIKED: {
      orientation: 'UNDIRECTED'
    }
  }
);
\`\`\`

**용도:**
- Node Similarity (유사 사용자)
- Collaborative Filtering

### 프로젝션 4: 관심사 네트워크 (KNN 추천용)

\`\`\`cypher
// 관심사 벡터 생성
MATCH (u:User)
OPTIONAL MATCH (u)-[:INTERESTED_IN]->(h:Hashtag)
WITH u, collect(h.name) AS interests
SET u.interestVector = gds.util.encode(interests, 50);

// 프로젝션
CALL gds.graph.project(
  'interest-network',
  {
    User: {
      properties: ['interestVector']
    }
  },
  '*'
);
\`\`\`

**용도:**
- KNN (관심사 유사 사용자)

## 3. 데이터 로드

### 샘플 데이터 생성 쿼리

\`\`\`cypher
// 사용자 생성 (간략화)
UNWIND range(1, 100) AS i
CREATE (u:User {
  id: 'user_' + i,
  name: 'User ' + i,
  username: 'user' + i,
  interests: CASE WHEN i % 3 = 0 THEN ['tech', 'music']
                  WHEN i % 3 = 1 THEN ['sports', 'travel']
                  ELSE ['food', 'art'] END,
  location: CASE WHEN i % 5 = 0 THEN 'Seoul'
                  WHEN i % 5 = 1 THEN 'Busan'
                  WHEN i % 5 = 2 THEN 'Daegu'
                  WHEN i % 5 = 3 THEN 'Incheon'
                  ELSE 'Gwangju' END,
  joinDate: date('2020-01-01') + duration({days: i * 10}),
  followerCount: toInteger(rand() * 1000),
  followingCount: toInteger(rand() * 500)
});

// 팔로우 관계 생성 (Preferential Attachment 스타일)
MATCH (a:User), (b:User)
WHERE a <> b AND rand() < 0.02
CREATE (a)-[:FOLLOWS {since: date()}]->(b);
\`\`\`

## 4. 프로젝션 확인

\`\`\`cypher
// 모든 프로젝션 목록
CALL gds.graph.list()
YIELD graphName, nodeCount, relationshipCount
RETURN graphName, nodeCount, relationshipCount;

// 개별 프로젝션 상세 정보
CALL gds.graph.list('follow-network')
YIELD graphName, nodeLabels, relationshipTypes, nodeCount, relationshipCount
RETURN *;
\`\`\`

다음 파트에서 인플루언서 분석을 시작합니다!
  `
)

// Task 3: 인플루언서 분석 실습
const task3InfluencerAnalysis = createCodeTask(
  'w3d5-influencer-analysis',
  'Part 2: 인플루언서 분석',
  45,
  [
    '다양한 중심성 알고리즘으로 인플루언서 점수 계산',
    '복합 인플루언서 점수 설계',
    '인플루언서 티어 분류'
  ],
  `
# Part 2: 인플루언서 분석

여러 중심성 알고리즘을 조합하여 인플루언서를 식별합니다.

## 과제

1. PageRank로 전체 영향력 점수 계산
2. In-Degree로 팔로워 수 기반 인기도
3. Betweenness로 정보 브로커 역할
4. 복합 점수 계산 및 티어 분류

## 인플루언서 티어
- Mega: 상위 1%
- Macro: 상위 1-5%
- Micro: 상위 5-20%
- Nano: 상위 20-50%
- Regular: 하위 50%

---

## 💡 핵심 팁

### 프로젝션 방향성
- **NATURAL**: 원본 방향 유지 (A→B는 A follows B)
- **REVERSE**: 방향 반전 (In-Degree 계산에 필수)
- **UNDIRECTED**: 양방향 (커뮤니티 탐지에 적합)

### 알고리즘 선택 가이드
| 목적 | 알고리즘 |
|-----|---------|
| 전체 영향력 | PageRank |
| 팔로워 수 | In-Degree (REVERSE) |
| 정보 브로커 | Betweenness |
| 근접성 | Closeness |

### mutate vs write
- **mutate**: 프로젝션에만 저장 (빠름, 후속 계산용)
- **write**: DB에 영구 저장 (쿼리에서 사용)
  `,
  `
// ============================================
// Part 2: 인플루언서 분석
// ============================================


// ========================================
// Step 1: 그래프 프로젝션
// ========================================

// [WHY] FOLLOWS 방향이 중요한 이유?
// - A→B: A가 B를 팔로우
// - In-Degree(B) = B의 팔로워 수 = 인기 지표
// - NATURAL로 방향 유지해야 올바른 분석

CALL gds.graph.project(
  'follow-network',
  'User',
  {
    FOLLOWS: {
      // TODO: orientation 설정 (NATURAL 권장)
      orientation: '___'
    }
  }
);


// ========================================
// Step 2: PageRank 계산
// ========================================
CALL gds.pageRank.stream('follow-network')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS user, score
ORDER BY score DESC
LIMIT 20
RETURN user.username, user.name, round(score, 4) AS pagerank;

// PageRank 결과 저장 (Mutate)
CALL gds.pageRank.mutate('follow-network', {
  mutateProperty: '___'
})
YIELD nodePropertiesWritten;


// ========================================
// Step 3: In-Degree Centrality
// ========================================
CALL gds.degree.stream('follow-network', {
  orientation: '___'  // REVERSE = In-Degree
})
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS user, score AS followers
ORDER BY followers DESC
LIMIT 20
RETURN user.username, followers;

// In-Degree 결과 저장
CALL gds.degree.mutate('follow-network', {
  orientation: 'REVERSE',
  mutateProperty: '___'
})
YIELD nodePropertiesWritten;


// ========================================
// Step 4: Betweenness Centrality
// ========================================
CALL gds.betweenness.stream('follow-network')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS user, score
ORDER BY score DESC
LIMIT 20
RETURN user.username, round(score, 2) AS betweenness;

// Betweenness 결과 저장
CALL gds.betweenness.mutate('follow-network', {
  mutateProperty: '___'
})
YIELD nodePropertiesWritten;


// ========================================
// Step 5: 복합 인플루언서 점수 계산
// ========================================
// TODO: pagerank, inDegree, betweenness를 결합한 복합 점수 계산
// 가중치: PageRank 50%, InDegree 30%, Betweenness 20%

CALL gds.graph.nodeProperties.stream('follow-network', ['pagerank', 'inDegree', 'betweenness'])
YIELD nodeId, propertyValue
// ... 복합 점수 계산


// ========================================
// Step 6: 인플루언서 티어 분류
// ========================================
// TODO: 백분위 기준으로 티어 할당
  `,
  `
// 정답 코드

// ========================================
// Step 1: 그래프 프로젝션
// ========================================
CALL gds.graph.project(
  'follow-network',
  'User',
  {
    FOLLOWS: {
      orientation: 'NATURAL'
    }
  }
);


// ========================================
// Step 2: PageRank 계산
// ========================================
CALL gds.pageRank.stream('follow-network')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS user, score
ORDER BY score DESC
LIMIT 20
RETURN user.username, user.name, round(score, 4) AS pagerank;

// PageRank 결과 저장 (Mutate)
CALL gds.pageRank.mutate('follow-network', {
  mutateProperty: 'pagerank'
})
YIELD nodePropertiesWritten;


// ========================================
// Step 3: In-Degree Centrality
// ========================================
CALL gds.degree.stream('follow-network', {
  orientation: 'REVERSE'
})
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS user, score AS followers
ORDER BY followers DESC
LIMIT 20
RETURN user.username, followers;

// In-Degree 결과 저장
CALL gds.degree.mutate('follow-network', {
  orientation: 'REVERSE',
  mutateProperty: 'inDegree'
})
YIELD nodePropertiesWritten;


// ========================================
// Step 4: Betweenness Centrality
// ========================================
CALL gds.betweenness.stream('follow-network')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS user, score
ORDER BY score DESC
LIMIT 20
RETURN user.username, round(score, 2) AS betweenness;

// Betweenness 결과 저장
CALL gds.betweenness.mutate('follow-network', {
  mutateProperty: 'betweenness'
})
YIELD nodePropertiesWritten;


// ========================================
// Step 5: 복합 인플루언서 점수 계산
// ========================================
// 정규화 값 계산
CALL gds.graph.nodeProperties.stream('follow-network', ['pagerank', 'inDegree', 'betweenness'])
YIELD nodeId, nodeProperty, propertyValue
WITH nodeId,
     CASE nodeProperty
       WHEN 'pagerank' THEN propertyValue
       ELSE null
     END AS pr,
     CASE nodeProperty
       WHEN 'inDegree' THEN propertyValue
       ELSE null
     END AS deg,
     CASE nodeProperty
       WHEN 'betweenness' THEN propertyValue
       ELSE null
     END AS btw
WITH nodeId, max(pr) AS pagerank, max(deg) AS inDegree, max(btw) AS betweenness
WITH nodeId, pagerank, inDegree, betweenness,
     // 간단한 Min-Max 정규화
     max(pagerank) OVER () AS maxPR,
     max(inDegree) OVER () AS maxDeg,
     max(betweenness) OVER () AS maxBtw
WITH nodeId,
     (pagerank / maxPR) * 0.5 +
     (inDegree / maxDeg) * 0.3 +
     (betweenness / maxBtw) * 0.2 AS influencerScore
WITH gds.util.asNode(nodeId) AS user, influencerScore
ORDER BY influencerScore DESC
LIMIT 50
RETURN user.username, user.name, round(influencerScore, 4) AS score;


// ========================================
// Step 6: 인플루언서 티어 분류 (전체 사용자 대상)
// ========================================
CALL gds.graph.nodeProperties.stream('follow-network', ['pagerank', 'inDegree', 'betweenness'])
YIELD nodeId, nodeProperty, propertyValue
WITH nodeId,
     collect({property: nodeProperty, value: propertyValue}) AS props
WITH nodeId,
     [p IN props WHERE p.property = 'pagerank'][0].value AS pagerank,
     [p IN props WHERE p.property = 'inDegree'][0].value AS inDegree,
     [p IN props WHERE p.property = 'betweenness'][0].value AS betweenness
WITH nodeId, pagerank, inDegree, betweenness
ORDER BY pagerank DESC
WITH collect({nodeId: nodeId, pagerank: pagerank, inDegree: inDegree, betweenness: betweenness}) AS all,
     count(*) AS total
UNWIND range(0, total - 1) AS idx
WITH all[idx] AS item, idx, total
WITH gds.util.asNode(item.nodeId) AS user,
     item.pagerank AS pagerank,
     item.inDegree AS inDegree,
     1.0 * idx / total AS percentile
WITH user, pagerank, inDegree,
     CASE
       WHEN percentile <= 0.01 THEN 'Mega'
       WHEN percentile <= 0.05 THEN 'Macro'
       WHEN percentile <= 0.20 THEN 'Micro'
       WHEN percentile <= 0.50 THEN 'Nano'
       ELSE 'Regular'
     END AS tier
RETURN tier, count(*) AS count, avg(pagerank) AS avgPageRank
ORDER BY CASE tier
  WHEN 'Mega' THEN 1
  WHEN 'Macro' THEN 2
  WHEN 'Micro' THEN 3
  WHEN 'Nano' THEN 4
  ELSE 5
END;


// ========================================
// Step 7: 결과 DB에 저장
// ========================================
CALL gds.pageRank.write('follow-network', {
  writeProperty: 'pagerank'
});

CALL gds.degree.write('follow-network', {
  orientation: 'REVERSE',
  writeProperty: 'inDegree'
});

CALL gds.betweenness.write('follow-network', {
  writeProperty: 'betweenness'
});

// 티어 할당
MATCH (u:User)
WITH u, u.pagerank AS pr
ORDER BY pr DESC
WITH collect(u) AS users, count(*) AS total
UNWIND range(0, total - 1) AS idx
WITH users[idx] AS user, 1.0 * idx / total AS percentile
SET user.influencerTier = CASE
  WHEN percentile <= 0.01 THEN 'Mega'
  WHEN percentile <= 0.05 THEN 'Macro'
  WHEN percentile <= 0.20 THEN 'Micro'
  WHEN percentile <= 0.50 THEN 'Nano'
  ELSE 'Regular'
END;

// 결과 확인
MATCH (u:User)
RETURN u.influencerTier AS tier, count(*) AS count
ORDER BY count DESC;
  `,
  [
    'PageRank, In-Degree, Betweenness를 각각 계산합니다',
    'mutate 모드로 결과를 프로젝션에 저장합니다',
    '복합 점수는 정규화 후 가중 합산합니다',
    '백분위로 티어를 분류합니다'
  ]
)

// Task 4: 커뮤니티 분석 실습
const task4CommunityAnalysis = createCodeTask(
  'w3d5-community-analysis',
  'Part 3: 커뮤니티 분석',
  45,
  [
    '상호 팔로우 네트워크 구성',
    'Louvain 알고리즘으로 커뮤니티 탐지',
    '커뮤니티별 특성 분석'
  ],
  `
# Part 3: 커뮤니티 분석

상호 팔로우 관계를 기반으로 자연스러운 사용자 그룹을 발견합니다.

## 과제

1. 상호 팔로우 관계 생성 및 프로젝션
2. Louvain 알고리즘으로 커뮤니티 탐지
3. 각 커뮤니티의 특성 분석 (관심사, 지역 등)
4. 커뮤니티 인플루언서 식별
  `,
  `
// 커뮤니티 분석 시작

// ========================================
// Step 1: 상호 팔로우 관계 생성
// ========================================
// 양방향 팔로우 관계를 찾아 MUTUAL_FOLLOW 생성
MATCH (a:User)-[:FOLLOWS]->(b:User)-[:FOLLOWS]->(a)
WHERE id(a) < id(b)
MERGE (a)-[:MUTUAL_FOLLOW]->(b);

// 생성된 관계 수 확인
MATCH ()-[r:MUTUAL_FOLLOW]->()
RETURN count(r) AS mutualFollowCount;


// ========================================
// Step 2: 커뮤니티 분석용 프로젝션
// ========================================
CALL gds.graph.project(
  'mutual-network',
  '___',
  {
    MUTUAL_FOLLOW: {
      orientation: '___'  // 무방향
    }
  }
);


// ========================================
// Step 3: Louvain 커뮤니티 탐지
// ========================================
CALL gds.louvain.stream('mutual-network')
YIELD nodeId, communityId
WITH communityId, count(*) AS size
ORDER BY size DESC
LIMIT 20
RETURN communityId, size;

// Louvain 결과 저장
CALL gds.louvain.write('mutual-network', {
  writeProperty: '___'
})
YIELD communityCount, modularity;


// ========================================
// Step 4: 커뮤니티별 특성 분석
// ========================================
// TODO: 각 커뮤니티의 주요 관심사, 평균 팔로워, 지역 분포 분석


// ========================================
// Step 5: 커뮤니티 인플루언서 식별
// ========================================
// TODO: 각 커뮤니티 내 PageRank 상위 3명 추출
  `,
  `
// 정답 코드

// ========================================
// Step 1: 상호 팔로우 관계 생성
// ========================================
MATCH (a:User)-[:FOLLOWS]->(b:User)-[:FOLLOWS]->(a)
WHERE id(a) < id(b)
MERGE (a)-[:MUTUAL_FOLLOW]->(b);

// 생성된 관계 수 확인
MATCH ()-[r:MUTUAL_FOLLOW]->()
RETURN count(r) AS mutualFollowCount;


// ========================================
// Step 2: 커뮤니티 분석용 프로젝션
// ========================================
CALL gds.graph.project(
  'mutual-network',
  'User',
  {
    MUTUAL_FOLLOW: {
      orientation: 'UNDIRECTED'
    }
  }
);


// ========================================
// Step 3: Louvain 커뮤니티 탐지
// ========================================
CALL gds.louvain.stream('mutual-network')
YIELD nodeId, communityId
WITH communityId, count(*) AS size
ORDER BY size DESC
LIMIT 20
RETURN communityId, size;

// Louvain 결과 저장
CALL gds.louvain.write('mutual-network', {
  writeProperty: 'communityId'
})
YIELD communityCount, modularity
RETURN communityCount, round(modularity, 4) AS modularity;


// ========================================
// Step 4: 커뮤니티별 특성 분석
// ========================================
// 4-1. 커뮤니티별 크기 및 기본 통계
MATCH (u:User)
WHERE u.communityId IS NOT NULL
WITH u.communityId AS community,
     count(*) AS size,
     avg(u.inDegree) AS avgFollowers,
     avg(u.pagerank) AS avgPageRank
ORDER BY size DESC
LIMIT 10
RETURN community, size,
       round(avgFollowers, 1) AS avgFollowers,
       round(avgPageRank, 4) AS avgPageRank;


// 4-2. 커뮤니티별 주요 관심사
MATCH (u:User)
WHERE u.communityId IS NOT NULL
WITH u.communityId AS community, u.interests AS interests
UNWIND interests AS interest
WITH community, interest, count(*) AS cnt
ORDER BY community, cnt DESC
WITH community, collect({interest: interest, count: cnt})[0..3] AS topInterests
RETURN community, topInterests;


// 4-3. 커뮤니티별 지역 분포
MATCH (u:User)
WHERE u.communityId IS NOT NULL
WITH u.communityId AS community, u.location AS location, count(*) AS cnt
ORDER BY community, cnt DESC
WITH community, collect({location: location, count: cnt})[0..3] AS topLocations
RETURN community, topLocations;


// ========================================
// Step 5: 커뮤니티 인플루언서 식별
// ========================================
// 각 커뮤니티 내 PageRank 상위 3명
MATCH (u:User)
WHERE u.communityId IS NOT NULL AND u.pagerank IS NOT NULL
WITH u.communityId AS community, u
ORDER BY u.pagerank DESC
WITH community, collect(u)[0..3] AS topInfluencers
RETURN community,
       [inf IN topInfluencers | {
         username: inf.username,
         pagerank: round(inf.pagerank, 4),
         tier: inf.influencerTier
       }] AS influencers;


// ========================================
// Step 6: 커뮤니티 연결도 분석 (Inter-community edges)
// ========================================
MATCH (a:User)-[:FOLLOWS]->(b:User)
WHERE a.communityId <> b.communityId
WITH a.communityId AS fromCommunity,
     b.communityId AS toCommunity,
     count(*) AS connections
ORDER BY connections DESC
LIMIT 20
RETURN fromCommunity, toCommunity, connections;


// ========================================
// Step 7: 커뮤니티 요약 리포트
// ========================================
MATCH (u:User)
WHERE u.communityId IS NOT NULL
WITH u.communityId AS community,
     count(*) AS size,
     sum(u.inDegree) AS totalFollowers,
     sum(CASE WHEN u.influencerTier IN ['Mega', 'Macro'] THEN 1 ELSE 0 END) AS topInfluencers,
     collect(DISTINCT u.location) AS locations
RETURN community,
       size,
       totalFollowers,
       topInfluencers,
       size(locations) AS locationDiversity
ORDER BY size DESC
LIMIT 10;
  `,
  [
    '상호 팔로우는 양방향 FOLLOWS가 있는 경우입니다',
    'Louvain의 writeProperty로 communityId를 저장합니다',
    'UNWIND + collect로 관심사/지역 빈도를 계산합니다',
    '커뮤니티 간 연결은 다른 communityId를 가진 관계입니다'
  ]
)

// Task 5: 추천 시스템 실습
const task5RecommendationSystem = createCodeTask(
  'w3d5-recommendation-system',
  'Part 4: 친구 추천 시스템',
  45,
  [
    '공통 팔로우 기반 추천 (Jaccard)',
    '관심사 기반 추천 (KNN)',
    '하이브리드 추천 시스템 구현'
  ],
  `
# Part 4: 친구 추천 시스템

다양한 유사도 알고리즘을 조합하여 "알 수도 있는 친구"를 추천합니다.

## 과제

1. 공통 팔로우 기반 추천 (Jaccard Similarity)
2. 관심사 기반 추천 (KNN)
3. 하이브리드 추천 (두 점수 결합)
4. 특정 사용자에 대한 최종 추천 목록 생성
  `,
  `
// 친구 추천 시스템 구현

// ========================================
// Step 1: 팔로우 네트워크 프로젝션 (추천용)
// ========================================
// 사용자가 팔로우하는 사람들을 기반으로 유사도 계산
CALL gds.graph.project(
  'follow-similarity',
  'User',
  {
    FOLLOWS: {
      orientation: 'NATURAL'
    }
  }
);


// ========================================
// Step 2: Jaccard 유사도 계산
// ========================================
// 같은 사람을 팔로우하는 사용자끼리 유사
CALL gds.nodeSimilarity.stream('follow-similarity', {
  similarityMetric: '___',
  topK: 10
})
YIELD node1, node2, similarity
WITH gds.util.asNode(node1) AS user1,
     gds.util.asNode(node2) AS user2,
     similarity
WHERE user1.username = 'user1'  // 특정 사용자
  AND NOT (user1)-[:FOLLOWS]->(user2)  // 이미 팔로우 X
RETURN user2.username AS recommendation,
       round(similarity, 3) AS jaccardScore
ORDER BY jaccardScore DESC
LIMIT 10;


// ========================================
// Step 3: KNN 기반 관심사 유사도
// ========================================
// 사용자 관심사를 벡터화
MATCH (u:User)
SET u.interestVector = [
  CASE WHEN 'tech' IN u.interests THEN 1.0 ELSE 0.0 END,
  CASE WHEN 'music' IN u.interests THEN 1.0 ELSE 0.0 END,
  CASE WHEN 'sports' IN u.interests THEN 1.0 ELSE 0.0 END,
  CASE WHEN 'travel' IN u.interests THEN 1.0 ELSE 0.0 END,
  CASE WHEN 'food' IN u.interests THEN 1.0 ELSE 0.0 END,
  CASE WHEN 'art' IN u.interests THEN 1.0 ELSE 0.0 END
];

// KNN 프로젝션
CALL gds.graph.project(
  'interest-knn',
  {
    User: {
      properties: ['___']
    }
  },
  '*'
);

// KNN 실행
CALL gds.knn.stream('interest-knn', {
  nodeLabels: ['User'],
  nodeProperties: ['interestVector'],
  topK: ___,
  similarityMetric: 'COSINE'
})
YIELD node1, node2, similarity
// TODO: 특정 사용자에 대한 추천


// ========================================
// Step 4: 하이브리드 추천
// ========================================
// TODO: Jaccard(50%) + KNN(50%) 결합 점수
  `,
  `
// 정답 코드

// ========================================
// Step 1: 팔로우 네트워크 프로젝션 (추천용)
// ========================================
CALL gds.graph.project(
  'follow-similarity',
  'User',
  {
    FOLLOWS: {
      orientation: 'NATURAL'
    }
  }
);


// ========================================
// Step 2: Jaccard 유사도 계산 및 저장
// ========================================
CALL gds.nodeSimilarity.write('follow-similarity', {
  similarityMetric: 'JACCARD',
  topK: 10,
  writeRelationshipType: 'SIMILAR_FOLLOWS',
  writeProperty: 'score'
})
YIELD nodesCompared, relationshipsWritten;

// 특정 사용자에 대한 Jaccard 기반 추천
MATCH (me:User {username: 'user1'})-[sim:SIMILAR_FOLLOWS]->(other:User)
WHERE NOT (me)-[:FOLLOWS]->(other)
RETURN other.username AS recommendation,
       round(sim.score, 3) AS jaccardScore
ORDER BY jaccardScore DESC
LIMIT 10;


// ========================================
// Step 3: KNN 기반 관심사 유사도
// ========================================
// 사용자 관심사를 벡터화
MATCH (u:User)
SET u.interestVector = [
  CASE WHEN 'tech' IN u.interests THEN 1.0 ELSE 0.0 END,
  CASE WHEN 'music' IN u.interests THEN 1.0 ELSE 0.0 END,
  CASE WHEN 'sports' IN u.interests THEN 1.0 ELSE 0.0 END,
  CASE WHEN 'travel' IN u.interests THEN 1.0 ELSE 0.0 END,
  CASE WHEN 'food' IN u.interests THEN 1.0 ELSE 0.0 END,
  CASE WHEN 'art' IN u.interests THEN 1.0 ELSE 0.0 END
];

// KNN 프로젝션
CALL gds.graph.project(
  'interest-knn',
  {
    User: {
      properties: ['interestVector']
    }
  },
  '*'
);

// KNN 실행 및 저장
CALL gds.knn.write('interest-knn', {
  nodeLabels: ['User'],
  nodeProperties: ['interestVector'],
  topK: 10,
  similarityMetric: 'COSINE',
  writeRelationshipType: 'SIMILAR_INTERESTS',
  writeProperty: 'score'
})
YIELD nodesCompared, relationshipsWritten;

// 특정 사용자에 대한 KNN 기반 추천
MATCH (me:User {username: 'user1'})-[sim:SIMILAR_INTERESTS]->(other:User)
WHERE NOT (me)-[:FOLLOWS]->(other)
RETURN other.username AS recommendation,
       round(sim.score, 3) AS interestScore
ORDER BY interestScore DESC
LIMIT 10;


// ========================================
// Step 4: 하이브리드 추천
// ========================================
// 두 유사도 점수 결합
MATCH (me:User {username: 'user1'})

// Jaccard 점수
OPTIONAL MATCH (me)-[jac:SIMILAR_FOLLOWS]->(other:User)
WHERE NOT (me)-[:FOLLOWS]->(other)
WITH me, other, COALESCE(jac.score, 0) AS jaccardScore

// KNN 점수
OPTIONAL MATCH (me)-[knn:SIMILAR_INTERESTS]->(other)
WITH me, other, jaccardScore, COALESCE(knn.score, 0) AS interestScore

// 하이브리드 점수 계산 (각 50%)
WITH other,
     jaccardScore,
     interestScore,
     jaccardScore * 0.5 + interestScore * 0.5 AS hybridScore
WHERE other IS NOT NULL
RETURN other.username AS recommendation,
       round(jaccardScore, 3) AS followSimilarity,
       round(interestScore, 3) AS interestSimilarity,
       round(hybridScore, 3) AS finalScore
ORDER BY hybridScore DESC
LIMIT 10;


// ========================================
// Step 5: 추천 이유 포함
// ========================================
MATCH (me:User {username: 'user1'})
OPTIONAL MATCH (me)-[jac:SIMILAR_FOLLOWS]->(other:User)
WHERE NOT (me)-[:FOLLOWS]->(other)
OPTIONAL MATCH (me)-[knn:SIMILAR_INTERESTS]->(other)

WITH me, other,
     COALESCE(jac.score, 0) AS jaccardScore,
     COALESCE(knn.score, 0) AS interestScore
WHERE other IS NOT NULL

// 공통 팔로우 수
OPTIONAL MATCH (me)-[:FOLLOWS]->(common:User)<-[:FOLLOWS]-(other)
WITH other, jaccardScore, interestScore, count(common) AS mutualFollows

// 공통 관심사
WITH other, jaccardScore, interestScore, mutualFollows,
     [i IN me.interests WHERE i IN other.interests] AS commonInterests

RETURN other.username AS recommendation,
       round(jaccardScore * 0.5 + interestScore * 0.5, 3) AS score,
       mutualFollows,
       commonInterests,
       CASE
         WHEN jaccardScore > interestScore THEN 'Similar followers'
         ELSE 'Similar interests'
       END AS mainReason
ORDER BY score DESC
LIMIT 10;


// 정리
CALL gds.graph.drop('follow-similarity');
CALL gds.graph.drop('interest-knn');
  `,
  [
    'Jaccard는 공통 팔로우 기반, KNN은 관심사 벡터 기반입니다',
    'write 모드로 유사도 관계를 저장하면 조회가 빠릅니다',
    'COALESCE로 NULL 점수를 0으로 처리합니다',
    '추천 이유를 함께 보여주면 사용자 신뢰도가 높아집니다'
  ]
)

// Task 6: 연결 분석 실습
const task6ConnectionAnalysis = createCodeTask(
  'w3d5-connection-analysis',
  'Part 5: 연결 분석',
  30,
  [
    '두 사용자 간 최단 연결 경로',
    '연결 단계(Degrees of Separation) 분석',
    '네트워크 도달 가능성 분석'
  ],
  `
# Part 5: 연결 분석

경로 탐색 알고리즘으로 사용자 간 연결 관계를 분석합니다.

## 과제

1. 특정 두 사용자 간 최단 연결 경로
2. 네트워크 전체의 평균 연결 단계
3. 특정 사용자의 도달 가능 범위 분석
  `,
  `
// 연결 분석 시작

// ========================================
// Step 1: 두 사용자 간 최단 경로
// ========================================
MATCH p = shortestPath(
  (a:User {username: 'user1'})-[:FOLLOWS*]-(b:User {username: 'user50'})
)
RETURN [n IN nodes(p) | n.username] AS path,
       length(p) AS degrees;

// 모든 최단 경로 (동일 길이)
MATCH p = allShortestPaths(
  (a:User {username: 'user1'})-[:FOLLOWS*..6]-(b:User {username: 'user50'})
)
RETURN [n IN nodes(p) | n.username] AS path,
       length(p) AS degrees
LIMIT 5;


// ========================================
// Step 2: 평균 연결 단계 (샘플링)
// ========================================
// 무작위 100쌍에 대해 최단 경로 계산
MATCH (a:User), (b:User)
WHERE rand() < 0.001 AND a <> b
WITH a, b LIMIT 100
MATCH p = shortestPath((a)-[:FOLLOWS*..10]-(b))
WITH length(p) AS distance
WHERE distance IS NOT NULL
RETURN avg(distance) AS avgDegrees,
       min(distance) AS minDegrees,
       max(distance) AS maxDegrees;


// ========================================
// Step 3: 특정 사용자의 도달 범위
// ========================================
// TODO: user1에서 1~6홉 내에 도달 가능한 사용자 수
MATCH (start:User {username: 'user1'})
UNWIND range(1, 6) AS depth
// ... 각 depth별 도달 가능 사용자 수 계산
  `,
  `
// 정답 코드

// ========================================
// Step 1: 두 사용자 간 최단 경로
// ========================================
MATCH p = shortestPath(
  (a:User {username: 'user1'})-[:FOLLOWS*]-(b:User {username: 'user50'})
)
RETURN [n IN nodes(p) | n.username] AS path,
       length(p) AS degrees;

// 모든 최단 경로 (동일 길이)
MATCH p = allShortestPaths(
  (a:User {username: 'user1'})-[:FOLLOWS*..6]-(b:User {username: 'user50'})
)
RETURN [n IN nodes(p) | n.username] AS path,
       length(p) AS degrees
LIMIT 5;


// ========================================
// Step 2: 평균 연결 단계 (샘플링)
// ========================================
MATCH (a:User), (b:User)
WHERE rand() < 0.001 AND a <> b
WITH a, b LIMIT 100
MATCH p = shortestPath((a)-[:FOLLOWS*..10]-(b))
WITH length(p) AS distance
WHERE distance IS NOT NULL
RETURN avg(distance) AS avgDegrees,
       min(distance) AS minDegrees,
       max(distance) AS maxDegrees,
       count(*) AS pathsFound;


// ========================================
// Step 3: 특정 사용자의 도달 범위
// ========================================
MATCH (start:User {username: 'user1'})
WITH start

// 각 홉별 도달 가능 사용자 수
UNWIND range(1, 6) AS depth
CALL {
  WITH start, depth
  MATCH (start)-[:FOLLOWS*1..6]->(reached:User)
  WHERE size(shortestPath((start)-[:FOLLOWS*]->(reached))) = depth
  RETURN count(DISTINCT reached) AS reachable
}
RETURN depth AS hop, reachable AS newUsersReached;


// 더 효율적인 버전 (누적)
MATCH (start:User {username: 'user1'})
WITH start
CALL {
  WITH start
  MATCH path = (start)-[:FOLLOWS*1..1]->(u1:User)
  RETURN 1 AS hop, count(DISTINCT u1) AS reached
  UNION ALL
  MATCH path = (start)-[:FOLLOWS*2..2]->(u2:User)
  RETURN 2 AS hop, count(DISTINCT u2) AS reached
  UNION ALL
  MATCH path = (start)-[:FOLLOWS*3..3]->(u3:User)
  RETURN 3 AS hop, count(DISTINCT u3) AS reached
  UNION ALL
  MATCH path = (start)-[:FOLLOWS*4..4]->(u4:User)
  RETURN 4 AS hop, count(DISTINCT u4) AS reached
  UNION ALL
  MATCH path = (start)-[:FOLLOWS*5..5]->(u5:User)
  RETURN 5 AS hop, count(DISTINCT u5) AS reached
  UNION ALL
  MATCH path = (start)-[:FOLLOWS*6..6]->(u6:User)
  RETURN 6 AS hop, count(DISTINCT u6) AS reached
}
RETURN hop, reached
ORDER BY hop;


// ========================================
// Step 4: 연결 경로 시각화용 데이터
// ========================================
MATCH p = shortestPath(
  (a:User {username: 'user1'})-[:FOLLOWS*]-(b:User {username: 'user50'})
)
WITH nodes(p) AS pathNodes, relationships(p) AS pathRels
UNWIND range(0, size(pathNodes) - 1) AS i
WITH pathNodes[i] AS node, i AS position
RETURN position,
       node.username AS user,
       node.influencerTier AS tier,
       node.communityId AS community;


// ========================================
// Step 5: 네트워크 연결성 통계
// ========================================
// Connected Components로 연결된 컴포넌트 확인
CALL gds.graph.project(
  'wcc-network',
  'User',
  {
    FOLLOWS: {
      orientation: 'UNDIRECTED'
    }
  }
);

CALL gds.wcc.stream('wcc-network')
YIELD nodeId, componentId
WITH componentId, count(*) AS size
ORDER BY size DESC
RETURN componentId, size
LIMIT 10;

// 가장 큰 컴포넌트 비율
CALL gds.wcc.stream('wcc-network')
YIELD nodeId, componentId
WITH componentId, count(*) AS size
ORDER BY size DESC
WITH collect({component: componentId, size: size}) AS components,
     sum(size) AS total
RETURN components[0].size AS largestComponent,
       total AS totalUsers,
       round(100.0 * components[0].size / total, 1) AS percentageInLargest;

CALL gds.graph.drop('wcc-network');
  `,
  [
    'shortestPath는 무가중치 최단 경로 (홉 수 기준)입니다',
    '대규모 그래프에서는 샘플링으로 평균을 추정합니다',
    'WCC(Weakly Connected Components)로 네트워크 분리 여부를 확인합니다',
    '6단계 분리 법칙: 대부분의 소셜 네트워크에서 6홉 이내 연결'
  ]
)

// Task 7: 통합 대시보드 설계
const task7Dashboard = createReadingTask(
  'w3d5-dashboard',
  'Part 6: 분석 대시보드 구축',
  30,
  [
    '핵심 지표(KPI) 정의',
    '대시보드 쿼리 작성',
    '시각화 권장사항'
  ],
  `
# Part 6: 분석 대시보드 구축

분석 결과를 종합하여 소셜 네트워크 대시보드를 설계합니다.

## 1. 핵심 지표 (KPIs)

### 네트워크 건강도

| 지표 | 설명 | 목표 |
|------|------|------|
| 평균 연결 단계 | 사용자 간 평균 홉 수 | < 5 |
| 클러스터링 계수 | 삼각 연결 밀도 | > 0.1 |
| 모듈성 | 커뮤니티 분리도 | > 0.3 |
| 최대 컴포넌트 비율 | 연결된 사용자 비율 | > 90% |

### 사용자 참여도

| 지표 | 설명 | 산출 |
|------|------|------|
| 활성 인플루언서 수 | Macro 이상 인플루언서 | count(tier IN [Mega, Macro]) |
| 커뮤니티 수 | Louvain 커뮤니티 | communityCount |
| 평균 팔로워 수 | 사용자당 평균 In-Degree | avg(inDegree) |
| 상호 팔로우 비율 | 양방향 관계 비율 | mutual / total |

## 2. 대시보드 쿼리

### 네트워크 개요

\`\`\`cypher
// 전체 네트워크 통계
MATCH (u:User)
WITH count(u) AS totalUsers
MATCH ()-[f:FOLLOWS]->()
WITH totalUsers, count(f) AS totalFollows
MATCH ()-[m:MUTUAL_FOLLOW]->()
RETURN totalUsers,
       totalFollows,
       count(m) AS mutualFollows,
       round(100.0 * count(m) * 2 / totalFollows, 1) AS mutualRatio;
\`\`\`

### 인플루언서 분포

\`\`\`cypher
MATCH (u:User)
WHERE u.influencerTier IS NOT NULL
RETURN u.influencerTier AS tier,
       count(*) AS count,
       round(avg(u.pagerank), 4) AS avgPageRank,
       round(avg(u.inDegree), 1) AS avgFollowers
ORDER BY CASE tier
  WHEN 'Mega' THEN 1 WHEN 'Macro' THEN 2
  WHEN 'Micro' THEN 3 WHEN 'Nano' THEN 4 ELSE 5
END;
\`\`\`

### 커뮤니티 개요

\`\`\`cypher
MATCH (u:User)
WHERE u.communityId IS NOT NULL
WITH u.communityId AS community,
     count(*) AS size,
     avg(u.inDegree) AS avgFollowers,
     sum(CASE WHEN u.influencerTier IN ['Mega', 'Macro'] THEN 1 ELSE 0 END) AS topInfluencers
ORDER BY size DESC
LIMIT 10
RETURN community, size, round(avgFollowers, 1) AS avgFollowers, topInfluencers;
\`\`\`

### 추천 효과 예측

\`\`\`cypher
// 추천 관계 중 실제 팔로우로 전환 가능성 분석
MATCH (a:User)-[rec:SIMILAR_FOLLOWS|SIMILAR_INTERESTS]->(b:User)
WHERE NOT (a)-[:FOLLOWS]->(b)
WITH a, b, rec.score AS similarity,
     a.communityId = b.communityId AS sameCommunity,
     size([i IN a.interests WHERE i IN b.interests]) AS commonInterests
RETURN sameCommunity,
       avg(similarity) AS avgSimilarity,
       avg(commonInterests) AS avgCommonInterests,
       count(*) AS potentialConnections;
\`\`\`

## 3. 시각화 권장사항

### 그래프 시각화 (Neo4j Browser / Bloom)

\`\`\`cypher
// 상위 인플루언서 + 연결 시각화
MATCH (inf:User)
WHERE inf.influencerTier IN ['Mega', 'Macro']
OPTIONAL MATCH (inf)-[:FOLLOWS]->(following:User)
WHERE following.influencerTier IN ['Mega', 'Macro']
RETURN inf, following;
\`\`\`

### 커뮤니티별 색상 매핑

\`\`\`
커뮤니티 ID → 색상 매핑
- Community 0: 빨강
- Community 1: 파랑
- Community 2: 초록
- ...
\`\`\`

### 노드 크기 = PageRank

\`\`\`
PageRank 값에 비례하여 노드 크기 조정
- Mega: 가장 큰 노드
- Regular: 가장 작은 노드
\`\`\`

## 4. 리포트 템플릿

\`\`\`markdown
# 소셜 네트워크 분석 리포트

## Executive Summary
- 총 사용자: XX명
- 총 팔로우 관계: XX개
- 발견된 커뮤니티: XX개
- 주요 인플루언서: XX명

## 인플루언서 분석
- Mega 인플루언서: [이름 목록]
- 특징: [분석 내용]

## 커뮤니티 분석
- 최대 커뮤니티: [특성]
- 커뮤니티 간 연결: [분석]

## 추천 시스템
- 추천 정확도: [예상치]
- 개선 방안: [제안]

## 권장 사항
1. ...
2. ...
3. ...
\`\`\`

이제 최종 프로젝트 챌린지로 모든 것을 통합합니다!
  `
)

// Task 8: 주간 프로젝트 퀴즈
const task8Quiz = createQuizTask(
  'w3d5-project-quiz',
  'Week 3 종합 이해도 점검',
  15,
  [
    {
      question: '소셜 네트워크에서 인플루언서를 식별하는 데 가장 적합한 알고리즘 조합은?',
      options: [
        'BFS + DFS',
        'PageRank + In-Degree + Betweenness',
        'Louvain + Label Propagation',
        'Jaccard + Cosine'
      ],
      answer: 1,
      explanation: 'PageRank(전체 영향력), In-Degree(팔로워 수), Betweenness(정보 브로커 역할)의 조합이 다각적인 인플루언서 분석에 적합합니다.'
    },
    {
      question: '커뮤니티 탐지에서 "모듈성(Modularity)"이 높다는 것의 의미는?',
      options: [
        '커뮤니티 수가 많다',
        '커뮤니티 내 연결이 밀접하고 커뮤니티 간 연결이 적다',
        '모든 노드가 하나의 커뮤니티에 속한다',
        '그래프가 완전 연결되어 있다'
      ],
      answer: 1,
      explanation: '모듈성은 커뮤니티 내부 연결 밀도와 외부 연결 희소성의 차이를 측정합니다. 높을수록 명확한 커뮤니티 구조입니다.'
    },
    {
      question: '"알 수도 있는 친구" 추천에 Jaccard Similarity를 사용하는 이유는?',
      options: [
        '가중치 기반 계산이 가능해서',
        '노드 속성을 비교할 수 있어서',
        '공통 팔로우(공유 이웃)를 기반으로 유사도를 측정해서',
        '최단 경로를 계산해서'
      ],
      answer: 2,
      explanation: 'Jaccard는 공유 이웃(공통 팔로우)을 기반으로 유사도를 측정합니다. "같은 사람을 팔로우하면 관심사가 비슷할 것" 가정입니다.'
    },
    {
      question: '그래프 프로젝션에서 orientation을 UNDIRECTED로 설정하는 경우는?',
      options: [
        'PageRank 계산 시',
        '커뮤니티 탐지 시 (Louvain 등)',
        'In-Degree 계산 시',
        '방향성이 중요한 경로 탐색 시'
      ],
      answer: 1,
      explanation: 'Louvain 등 커뮤니티 탐지 알고리즘은 무방향 그래프에서 동작합니다. 상호 팔로우는 관계의 방향보다 연결 자체가 중요합니다.'
    },
    {
      question: 'Delta-Stepping이 Dijkstra보다 유리한 상황은?',
      options: [
        '소규모 그래프',
        '음수 가중치가 있는 그래프',
        '대규모 그래프에서 병렬 처리 가능할 때',
        '무가중치 그래프'
      ],
      answer: 2,
      explanation: 'Delta-Stepping은 병렬화가 가능하여 대규모 그래프에서 Dijkstra보다 빠릅니다.'
    },
    {
      question: '하이브리드 추천 시스템의 장점은?',
      options: [
        '단일 알고리즘보다 계산이 빠름',
        '여러 관점의 유사도를 결합하여 추천 품질 향상',
        '데이터가 적어도 정확함',
        '실시간 계산이 가능함'
      ],
      answer: 1,
      explanation: '하이브리드는 여러 유사도(구조적, 속성 기반 등)를 결합하여 각 방식의 한계를 보완합니다.'
    },
    {
      question: 'WCC(Weakly Connected Components)로 알 수 있는 정보는?',
      options: [
        '각 노드의 중요도',
        '네트워크가 몇 개의 분리된 그룹으로 나뉘는지',
        '최단 경로 길이',
        '인플루언서 순위'
      ],
      answer: 1,
      explanation: 'WCC는 연결된 컴포넌트(서로 도달 가능한 노드 그룹)를 찾습니다. 네트워크 분리 여부를 확인할 수 있습니다.'
    },
    {
      question: '인플루언서 티어 분류 시 백분위를 사용하는 이유는?',
      options: [
        '절대적 점수보다 상대적 순위가 더 의미 있어서',
        '계산이 더 빨라서',
        '데이터 정규화가 필요 없어서',
        '모든 사용자가 같은 티어가 되어서'
      ],
      answer: 0,
      explanation: '백분위는 상대적 순위를 나타냅니다. 네트워크마다 절대 점수 범위가 다르지만, 백분위는 일관된 비교가 가능합니다.'
    }
  ]
)

// Task 9: 최종 프로젝트 챌린지
const task9FinalChallenge = createChallengeTask(
  'w3d5-final-challenge',
  '소셜 네트워크 분석 플랫폼 완성',
  90,
  [
    'Week 3 전체 알고리즘 통합 적용',
    '실제 비즈니스 인사이트 도출',
    '완전한 분석 리포트 작성'
  ],
  [
    '데이터 모델링 및 최소 3개의 GDS 프로젝션 생성',
    '인플루언서 분석: 3가지 이상 중심성 지표 + 티어 분류',
    '커뮤니티 분석: Louvain + 커뮤니티별 특성 분석',
    '추천 시스템: 최소 2가지 유사도 알고리즘 결합',
    '연결 분석: 최단 경로 + 도달 가능성 분석',
    '대시보드: 최소 5개 KPI 쿼리 작성',
    '분석 리포트: Executive Summary + 상세 분석 + 권장사항'
  ],
  [
    '데이터 모델링 및 프로젝션 설계 (10%)',
    '알고리즘 적용의 정확성 및 적절성 (25%)',
    '결과 해석 및 비즈니스 인사이트 (25%)',
    '코드 품질 및 문서화 (15%)',
    '리포트의 완성도 및 명확성 (15%)',
    '창의적 확장 및 추가 분석 (10%)'
  ],
  [
    '시간대별 네트워크 변화 분석 (Temporal Analysis)',
    '봇/스팸 계정 탐지 (이상치 탐지)',
    '바이럴 콘텐츠 전파 경로 시뮬레이션',
    '인플루언서 협업 네트워크 분석',
    '예측 모델: 신규 사용자의 잠재 인플루언서 여부'
  ]
)

// Task 10: 시뮬레이터 실습
const task10Simulator = createSimulatorTask(
  'w3d5-project-simulator',
  '소셜 네트워크 분석 시뮬레이터',
  30,
  [
    '실제 소셜 네트워크 데이터셋으로 실습',
    '모든 그래프 알고리즘 통합 테스트',
    '대시보드 시각화 체험'
  ],
  'social-network-analysis',
  `
## 시뮬레이터 사용 가이드

### 1. 데이터셋 선택
- Small (1K Users): 학습용
- Medium (10K Users): 실습용
- Large (100K Users): 성능 테스트

### 2. 분석 파이프라인
1. 인플루언서 분석 → 중심성 결과 확인
2. 커뮤니티 탐지 → 그룹 시각화
3. 추천 생성 → 특정 사용자 선택 후 추천 확인
4. 경로 분석 → 두 사용자 간 연결 시각화

### 3. 대시보드 모드
- KPI 실시간 모니터링
- 인플루언서 티어 분포
- 커뮤니티 크기 분포
- 네트워크 건강도 지표

### 4. 리포트 생성
- 분석 결과 자동 요약
- PDF/마크다운 내보내기
- 시각화 스크린샷 포함

### 실습 과제
1. Medium 데이터셋 로드
2. 전체 분석 파이프라인 실행
3. 상위 10명 인플루언서 식별
4. 가장 큰 커뮤니티의 특성 분석
5. 특정 사용자에게 5명 친구 추천
6. 리포트 생성 및 내보내기
  `
)

// Day 5 통합
export const day5WeeklyProject: Day = {
  slug: 'weekly-project',
  title: '주간 프로젝트: 소셜 네트워크 분석 플랫폼',
  totalDuration: 360,
  tasks: [
    task1ProjectOverview,
    task2DataModeling,
    task3InfluencerAnalysis,
    task4CommunityAnalysis,
    task5RecommendationSystem,
    task6ConnectionAnalysis,
    task7Dashboard,
    task8Quiz
  ],
  challenge: task9FinalChallenge
}

// ============================================
// Day 5 통계
// ============================================
// Tasks: 10개 (8 regular + 1 challenge + 1 simulator)
// 총 학습 시간: 360분 (6시간)
// 프로젝트 구성:
//   - Part 1: 데이터 모델링 (25분)
//   - Part 2: 인플루언서 분석 (45분)
//   - Part 3: 커뮤니티 분석 (45분)
//   - Part 4: 추천 시스템 (45분)
//   - Part 5: 연결 분석 (30분)
//   - Part 6: 대시보드 (30분)
//   - 퀴즈 + 챌린지 (90분)
// ============================================
