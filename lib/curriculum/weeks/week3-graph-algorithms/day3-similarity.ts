// Week 3 Day 3: 유사도 알고리즘 (Similarity Algorithms)
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
// Day 3: 유사도 알고리즘 (Similarity Algorithms)
// ============================================
// 학습 목표:
// 1. 유사도 측정의 개념과 중요성 이해
// 2. Jaccard Similarity 계산 및 활용
// 3. Cosine Similarity 구현
// 4. Node Similarity 알고리즘 적용
// 5. K-Nearest Neighbors 기반 추천 구현
// ============================================

// Task 1: 유사도 알고리즘 개요 (영상)
const task1SimilarityIntro = createVideoTask(
  'w3d3-similarity-intro',
  '유사도 알고리즘의 세계',
  25,
  [
    '유사도 측정의 개념과 필요성 이해',
    '그래프 기반 유사도 vs 속성 기반 유사도 비교',
    '추천 시스템과 유사도 알고리즘의 관계',
    'GDS 유사도 알고리즘 카테고리 파악'
  ],
  'https://example.com/videos/similarity-intro',
  `
안녕하세요! 오늘은 그래프 알고리즘에서 매우 실용적인 주제인
유사도 알고리즘에 대해 배워보겠습니다.

## 유사도란 무엇인가?

유사도(Similarity)는 두 객체가 얼마나 비슷한지를 수치로 표현한 것입니다.
일상에서도 우리는 끊임없이 유사도를 계산합니다.

"이 영화는 저 영화랑 비슷해"
"이 사용자의 취향은 나와 비슷하네"
"이 상품은 저 상품과 관련이 있어"

## 왜 그래프에서 유사도가 중요한가?

전통적인 유사도 측정은 속성(Attribute) 기반입니다.
예를 들어, 두 사용자의 나이, 성별, 지역이 같으면 유사하다고 판단합니다.

하지만 그래프에서는 **관계 구조**를 기반으로 유사도를 측정합니다!

예를 들어:
- 같은 영화를 많이 본 두 사용자 → 유사함
- 같은 상품을 구매한 두 고객 → 유사함
- 같은 논문을 인용한 두 연구자 → 유사함

이렇게 **이웃(Neighbor)을 공유하는 정도**로 유사도를 측정하는 것이
그래프 기반 유사도의 핵심입니다.

## 유사도 알고리즘의 활용

1. **추천 시스템**
   - Collaborative Filtering의 핵심
   - "비슷한 사용자가 좋아한 아이템 추천"
   - "비슷한 아이템을 사용자에게 추천"

2. **중복 탐지**
   - 표절 검사
   - 유사 문서/상품 클러스터링

3. **링크 예측**
   - 앞으로 연결될 가능성이 높은 노드 쌍 예측
   - 소셜 네트워크의 "알 수도 있는 사람"

4. **데이터 품질**
   - 중복 엔티티 병합
   - 데이터 클렌징

## GDS에서 제공하는 유사도 알고리즘

1. **Jaccard Similarity** (가장 기본)
   - 공유 이웃 / 전체 이웃 비율

2. **Overlap Similarity**
   - 공유 이웃 / 작은 집합 크기

3. **Cosine Similarity**
   - 벡터 내적 기반
   - 가중치 있는 그래프에 적합

4. **Pearson Similarity**
   - 상관계수 기반
   - 평점 데이터에 적합

5. **Node Similarity**
   - Top-K 또는 Threshold 기반 필터링

6. **K-Nearest Neighbors (kNN)**
   - 유사도 기반 K개 이웃 찾기

## 오늘 학습할 내용

1. Jaccard Similarity - 집합 기반 유사도의 기초
2. Cosine Similarity - 가중치 기반 유사도
3. Node Similarity - GDS의 강력한 유사도 알고리즘
4. K-Nearest Neighbors - 추천 시스템의 핵심

각 알고리즘의 수학적 원리와 Neo4j GDS에서의 구현을
함께 배워보겠습니다!
  `
)

// Task 2: Jaccard Similarity 심화 학습
const task2JaccardDeep = createReadingTask(
  'w3d3-jaccard-deep',
  'Jaccard Similarity 완전 정복',
  30,
  [
    'Jaccard 계수의 수학적 정의 이해',
    'GDS에서 Jaccard Similarity 실행',
    'Jaccard 유사도의 활용 사례 학습'
  ],
  `
# Jaccard Similarity 완전 정복

## 1. Jaccard 계수란?

**Jaccard 계수(Jaccard Coefficient)**는 두 집합 간의 유사도를 측정하는
가장 기본적이고 직관적인 방법입니다.

19세기 스위스 식물학자 Paul Jaccard가 식물 분포 비교를 위해 제안했습니다.

### 수학적 정의

\`\`\`
Jaccard(A, B) = |A ∩ B| / |A ∪ B|
\`\`\`

- \`|A ∩ B|\`: 두 집합의 교집합 크기 (공유 원소 수)
- \`|A ∪ B|\`: 두 집합의 합집합 크기 (전체 고유 원소 수)

### 값의 범위

- **0**: 완전히 다름 (공유 원소 없음)
- **1**: 완전히 동일 (모든 원소 공유)
- **0.5**: 절반의 원소를 공유

### 예시: 영화 취향 비교

철수가 본 영화: {인셉션, 인터스텔라, 매트릭스, 아바타}
영희가 본 영화: {인셉션, 인터스텔라, 타이타닉, 라라랜드}

교집합: {인셉션, 인터스텔라} → 2개
합집합: {인셉션, 인터스텔라, 매트릭스, 아바타, 타이타닉, 라라랜드} → 6개

\`\`\`
Jaccard(철수, 영희) = 2/6 = 0.333
\`\`\`

## 2. 그래프에서의 Jaccard Similarity

그래프에서는 **이웃 집합**을 비교합니다.

### 정의

두 노드 u, v에 대해:

\`\`\`
Jaccard(u, v) = |N(u) ∩ N(v)| / |N(u) ∪ N(v)|
\`\`\`

- \`N(u)\`: 노드 u의 이웃 집합
- \`N(v)\`: 노드 v의 이웃 집합

### 시각적 예시

\`\`\`
       [Movie1]    [Movie2]    [Movie3]
          ↑           ↑           ↑
          |           |           |
    +-----+-----+     |     +-----+
    |           |     |     |
[User A]      [User B]    [User C]
\`\`\`

- User A의 이웃: {Movie1}
- User B의 이웃: {Movie1, Movie2}
- User C의 이웃: {Movie2, Movie3}

Jaccard(A, B) = |{Movie1}| / |{Movie1, Movie2}| = 1/2 = 0.5
Jaccard(B, C) = |{Movie2}| / |{Movie1, Movie2, Movie3}| = 1/3 = 0.33
Jaccard(A, C) = |{}| / |{Movie1, Movie2, Movie3}| = 0/3 = 0

## 3. GDS에서 Jaccard Similarity 실행

### 그래프 프로젝션

\`\`\`cypher
// 샘플 데이터 생성
CREATE (alice:User {name: 'Alice'})
CREATE (bob:User {name: 'Bob'})
CREATE (charlie:User {name: 'Charlie'})
CREATE (diana:User {name: 'Diana'})

CREATE (m1:Movie {title: 'Inception'})
CREATE (m2:Movie {title: 'Interstellar'})
CREATE (m3:Movie {title: 'Matrix'})
CREATE (m4:Movie {title: 'Avatar'})
CREATE (m5:Movie {title: 'Titanic'})

CREATE (alice)-[:WATCHED]->(m1)
CREATE (alice)-[:WATCHED]->(m2)
CREATE (alice)-[:WATCHED]->(m3)
CREATE (bob)-[:WATCHED]->(m1)
CREATE (bob)-[:WATCHED]->(m2)
CREATE (bob)-[:WATCHED]->(m4)
CREATE (charlie)-[:WATCHED]->(m3)
CREATE (charlie)-[:WATCHED]->(m4)
CREATE (charlie)-[:WATCHED]->(m5)
CREATE (diana)-[:WATCHED]->(m1)
CREATE (diana)-[:WATCHED]->(m5);

// 그래프 프로젝션 (Bipartite)
CALL gds.graph.project(
  'user-movie',
  ['User', 'Movie'],
  {
    WATCHED: {
      orientation: 'UNDIRECTED'
    }
  }
);
\`\`\`

### Jaccard Similarity 실행

\`\`\`cypher
// 모든 User 쌍의 Jaccard 유사도 계산
CALL gds.nodeSimilarity.stream('user-movie', {
  similarityMetric: 'JACCARD',
  topK: 10
})
YIELD node1, node2, similarity
RETURN
  gds.util.asNode(node1).name AS user1,
  gds.util.asNode(node2).name AS user2,
  round(similarity, 3) AS jaccard
ORDER BY jaccard DESC;
\`\`\`

### 예상 결과

| user1   | user2   | jaccard |
|---------|---------|---------|
| Alice   | Bob     | 0.5     |
| Alice   | Diana   | 0.333   |
| Bob     | Diana   | 0.333   |
| ...     | ...     | ...     |

Alice와 Bob은 4개 영화 중 2개(Inception, Interstellar)를 공유하므로
Jaccard = 2/4 = 0.5

## 4. Jaccard의 변형: Overlap Coefficient

Jaccard는 집합 크기가 다를 때 불리할 수 있습니다.

예: A = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, B = {1, 2}
Jaccard = 2/10 = 0.2 (낮음)

하지만 B의 모든 원소가 A에 포함되어 있습니다!

### Overlap Coefficient

\`\`\`
Overlap(A, B) = |A ∩ B| / min(|A|, |B|)
\`\`\`

위 예시에서: Overlap = 2/2 = 1.0 (완전 포함!)

### GDS에서 Overlap 사용

\`\`\`cypher
CALL gds.nodeSimilarity.stream('user-movie', {
  similarityMetric: 'OVERLAP',
  topK: 10
})
YIELD node1, node2, similarity
RETURN
  gds.util.asNode(node1).name AS user1,
  gds.util.asNode(node2).name AS user2,
  round(similarity, 3) AS overlap
ORDER BY overlap DESC;
\`\`\`

## 5. 활용 사례

### 사례 1: 소셜 네트워크 친구 추천

\`\`\`cypher
// 공통 친구가 많은 사용자 찾기
MATCH (me:User {name: 'Alice'})-[:FRIEND]->(friend)
WITH me, collect(friend) AS myFriends

MATCH (other:User)-[:FRIEND]->(otherFriend)
WHERE other <> me AND NOT (me)-[:FRIEND]-(other)
WITH me, myFriends, other, collect(otherFriend) AS otherFriends

// Jaccard 계산
WITH me, other,
  [f IN myFriends WHERE f IN otherFriends] AS common,
  myFriends + [f IN otherFriends WHERE NOT f IN myFriends] AS allFriends
RETURN other.name AS recommendation,
  size(common) AS commonFriends,
  1.0 * size(common) / size(allFriends) AS jaccard
ORDER BY jaccard DESC
LIMIT 10;
\`\`\`

### 사례 2: 상품 추천

\`\`\`cypher
// 비슷한 구매 패턴의 고객이 산 상품 추천
CALL gds.nodeSimilarity.stream('customer-product', {
  similarityMetric: 'JACCARD',
  topK: 5
})
YIELD node1, node2, similarity
WITH gds.util.asNode(node1) AS customer1,
     gds.util.asNode(node2) AS customer2,
     similarity
WHERE customer1.id = $targetCustomerId
MATCH (customer2)-[:PURCHASED]->(product)
WHERE NOT (customer1)-[:PURCHASED]->(product)
RETURN DISTINCT product, similarity
ORDER BY similarity DESC
LIMIT 10;
\`\`\`

## 6. Jaccard의 장단점

### 장점
- 직관적이고 이해하기 쉬움
- 계산이 빠름
- 이진(binary) 데이터에 적합

### 단점
- 가중치를 고려하지 않음 (본 횟수, 평점 등)
- 집합 크기에 민감할 수 있음
- 희소한 데이터에서 0이 많이 나옴

다음 섹션에서 가중치를 고려하는 **Cosine Similarity**를 배워보겠습니다!
  `
)

// Task 3: Jaccard Similarity 실습
const task3JaccardPractice = createCodeTask(
  'w3d3-jaccard-practice',
  'Jaccard Similarity 실습',
  25,
  [
    '🔍 GDS에서 Jaccard Similarity 실행',
    '📏 유사도 임계값 설정 및 필터링',
    '💾 결과를 새로운 관계로 저장'
  ],
  `
# Jaccard Similarity 실습

## 🎯 왜 배우는가?

### 문제 상황
온라인 서점에서 "이 책을 산 고객은 어떤 책을 더 좋아할까?" 추천이 어렵습니다.
- 단순히 인기 책만 추천하면 개인화가 안 됨
- 구매 이력만으로 취향 유사도를 측정해야 함
- 수천 명의 고객 쌍을 비교하기 어려움

### 해결책: Jaccard Similarity
> 📚 **비유**: 책장 비교하기
> - 철수 책장: {해리포터, 반지의 제왕, 나니아}
> - 영희 책장: {해리포터, 반지의 제왕, 호빗}
> - 공통 책 2권 ÷ 전체 책 4권 = 50% 유사!
> - Jaccard = |교집합| / |합집합|

온라인 서점 데이터를 사용하여 Jaccard Similarity를 실습합니다.
고객 간의 구매 패턴 유사도를 분석하고 추천에 활용합니다.

## 과제

1. 주어진 데이터로 그래프 프로젝션 생성
2. 고객 간 Jaccard Similarity 계산
3. 유사도 0.3 이상인 관계만 필터링
4. SIMILAR_TO 관계로 그래프에 저장

## 데이터 구조
- Customer 노드 (10명)
- Book 노드 (15권)
- PURCHASED 관계

---

## ⚠️ Common Pitfalls (자주 하는 실수)

### 1. [프로젝션] 이분 그래프에서 한 종류 노드만 포함

**증상**: 유사도 결과가 없거나 이상함

\`\`\`cypher
// ❌ 잘못된 예시 - Customer만 포함
CALL gds.graph.project('graph', ['Customer'], 'PURCHASED')
// → Book 노드가 없어서 공유 이웃 계산 불가!
\`\`\`

**왜 잘못되었나**:
- 유사도는 "공유 이웃"을 측정
- Customer의 이웃은 Book
- Book을 포함해야 공유 이웃(공통 구매 책) 계산 가능

\`\`\`cypher
// ✅ 올바른 예시 - 두 종류 노드 모두 포함
CALL gds.graph.project('graph', ['Customer', 'Book'], 'PURCHASED')
\`\`\`

**기억할 점**:
> 유사도 알고리즘은 이분 그래프(Bipartite Graph)에서 작동합니다.
> 두 종류의 노드를 모두 포함해야 합니다.

---

### 2. [임계값] similarityCutoff 없이 대규모 실행

**증상**: 메모리 부족, 너무 많은 관계 생성

\`\`\`cypher
// ❌ 잘못된 예시 - 모든 쌍 저장
CALL gds.nodeSimilarity.write('graph', {
  writeRelationshipType: 'SIMILAR'
})
// → N명 고객 → N*(N-1)/2 관계 = 폭발!
\`\`\`

**왜 잘못되었나**:
- 10,000명 고객 → 약 5천만 관계 생성
- 대부분 유사도 0.1 미만의 무의미한 관계

\`\`\`cypher
// ✅ 올바른 예시 - 임계값 + topK 설정
CALL gds.nodeSimilarity.write('graph', {
  writeRelationshipType: 'SIMILAR',
  similarityCutoff: 0.3,  // 30% 이상만
  topK: 10  // 노드당 최대 10개
})
\`\`\`

**기억할 점**:
> 실무에서는 항상 similarityCutoff와 topK를 설정하세요.
  `,
  `
// ============================================
// Jaccard Similarity 실습
// ============================================


// ========================================
// 과제 1: 그래프 프로젝션 생성
// ========================================

// [WHY] 왜 두 종류의 노드가 필요한가?
// - Jaccard는 "공유 이웃"을 측정
// - Customer의 이웃 = 구매한 Book
// - 두 Customer가 같은 Book을 구매하면 유사
// - Book 노드 없이는 공유 이웃 계산 불가

// [SELECTION GUIDE] 이분 그래프 (Bipartite Graph):
// - 두 종류 노드: Customer ↔ Book
// - 한 종류 노드끼리는 직접 연결 없음
// - PURCHASED 관계가 두 종류를 연결

// [TODO] 구현할 내용:
// Step 1: 노드 라벨 배열: ['Customer', 'Book']
// Step 2: PURCHASED 관계를 UNDIRECTED로 설정

CALL gds.graph.project(
  'customer-book',
  // TODO: 노드 라벨 배열 지정
  ,
  // TODO: 관계 타입 설정 (UNDIRECTED 권장)
  {

  }
);


// ========================================
// 과제 2: Jaccard Similarity 계산
// ========================================

// [WHY] gds.nodeSimilarity 사용하는 이유?
// - Jaccard, Overlap, Cosine 등 다양한 메트릭 지원
// - 효율적인 대규모 계산 (모든 쌍 O(N²) 최적화)
// - topK, threshold 필터링 내장

// [SELECTION GUIDE] stream vs write:
// - stream: 결과 확인, 저장 X (탐색용)
// - write: DB에 관계로 저장 (프로덕션용)
// - mutate: 프로젝션에만 저장

// [TODO] 구현할 내용:
// Step 1: gds.nodeSimilarity.stream 호출
// Step 2: similarityMetric: 'JACCARD' 설정
// Step 3: topK: 5 (노드당 상위 5개)
// Step 4: gds.util.asNode()로 노드 이름 추출

CALL gds.nodeSimilarity.stream('customer-book', {
  // TODO: similarityMetric 설정
  // TODO: topK 설정
})
YIELD node1, node2, similarity
RETURN
  // TODO: gds.util.asNode(node1).name
  AS customer1,
  // TODO: gds.util.asNode(node2).name
  AS customer2,
  round(similarity, 3) AS jaccard
ORDER BY jaccard DESC;


// ========================================
// 과제 3: 유사도 관계 저장
// ========================================

// [WHY] 유사도를 관계로 저장하는 이유?
// - 실시간 추천에서 빠른 조회 가능
// - MATCH (c1)-[:SIMILAR_TO]->(c2) 간단한 쿼리
// - 유사도 점수를 관계 속성으로 저장

// [SELECTION GUIDE] 임계값 설정:
// - similarityCutoff: 최소 유사도 (0.3 = 30% 공유)
// - topK: 노드당 최대 유사 노드 수
// 실무에서는 둘 다 설정 권장 (메모리/스토리지 보호)

// [TODO] 구현할 내용:
// Step 1: gds.nodeSimilarity.write 호출
// Step 2: writeRelationshipType: 'SIMILAR_TO'
// Step 3: writeProperty: 'score'
// Step 4: similarityCutoff: 0.3

CALL gds.nodeSimilarity.write('customer-book', {
  similarityMetric: 'JACCARD',
  // TODO: 나머지 파라미터 설정
})
YIELD nodesCompared, relationshipsWritten
RETURN nodesCompared, relationshipsWritten;


// ========================================
// 과제 4: 저장된 관계 확인
// ========================================

// [WHY] 저장된 유사도 관계 활용?
// - 추천 쿼리에서 직접 사용
// - "유사한 고객이 구매한 상품" 추천 가능

MATCH (c1:Customer)-[s:SIMILAR_TO]->(c2:Customer)
RETURN c1.name, c2.name, s.score
ORDER BY s.score DESC
LIMIT 10;
  `,
  `
// ============================================
// Jaccard Similarity 실습 - 정답
// ============================================


// ========================================
// 과제 0: 샘플 데이터 확인
// ========================================

// [WHY] 데이터 구조를 먼저 파악하는 이유?
// - 알고리즘 적용 전 데이터 검증
// - 각 고객이 구매한 책 목록 확인
// - "공유 이웃" = 공통 구매 책 이해
MATCH (c:Customer)-[:PURCHASED]->(b:Book)
RETURN c.name, collect(b.title) AS purchasedBooks;


// ========================================
// 과제 1: 그래프 프로젝션 생성
// ========================================

// [WHY] 이분 그래프 프로젝션이 필요한 이유?
// - Jaccard는 "공유 이웃"으로 유사도 측정
// - Customer 입장에서 이웃 = 구매한 Book
// - Book을 포함해야 두 Customer의 공유 Book 계산 가능

// [STEP 1] 두 종류 노드 포함
// [PARAM] ['Customer', 'Book']: 이분 그래프의 두 파티션
// [PARAM] UNDIRECTED: 양방향으로 탐색 가능하게 설정
CALL gds.graph.project(
  'customer-book',
  ['Customer', 'Book'],
  {
    PURCHASED: {
      orientation: 'UNDIRECTED'
    }
  }
);

// [RESULT] 프로젝션 생성 완료
// Customer 10명, Book 15권, 관계 양방향화


// ========================================
// 과제 2: Jaccard Similarity 계산
// ========================================

// [WHY] stream 모드로 먼저 확인하는 이유?
// - 저장 전에 결과 미리 확인
// - 임계값, topK 조정에 활용
// - 탐색적 분석 단계

// [STEP 1] gds.nodeSimilarity.stream 호출
// [PARAM] similarityMetric: 'JACCARD' - Jaccard 계수 사용
// [PARAM] topK: 5 - 노드당 가장 유사한 5개만 반환 (효율성)
CALL gds.nodeSimilarity.stream('customer-book', {
  similarityMetric: 'JACCARD',
  topK: 5
})
YIELD node1, node2, similarity
// [STEP 2] gds.util.asNode()로 노드 속성 접근
// node1, node2는 내부 ID → 실제 노드로 변환 필요
RETURN
  gds.util.asNode(node1).name AS customer1,
  gds.util.asNode(node2).name AS customer2,
  round(similarity, 3) AS jaccard
ORDER BY jaccard DESC;

// [RESULT] 예상:
// | customer1 | customer2 | jaccard |
// | Alice     | Bob       | 0.667   | ← 3권 공유 / 5권 합집합
// [INSIGHT] 비슷한 책을 산 고객일수록 높은 유사도


// ========================================
// 과제 3: 유사도 관계 저장
// ========================================

// [WHY] 유사도를 관계로 저장하는 이유?
// - 실시간 추천 시 빠른 조회
// - 복잡한 유사도 계산 미리 수행
// - 추천 쿼리 단순화

// [STEP 1] gds.nodeSimilarity.write 호출
// [PARAM] writeRelationshipType: 저장할 관계 이름
// [PARAM] writeProperty: 유사도 점수 저장 속성
// [PARAM] similarityCutoff: 0.3 - 30% 미만은 저장 안 함
//   - 실무에서 필수! 불필요한 관계 폭발 방지
CALL gds.nodeSimilarity.write('customer-book', {
  similarityMetric: 'JACCARD',
  writeRelationshipType: 'SIMILAR_TO',
  writeProperty: 'score',
  similarityCutoff: 0.3
})
YIELD nodesCompared, relationshipsWritten
RETURN nodesCompared, relationshipsWritten;

// [RESULT] nodesCompared: 10, relationshipsWritten: 15
// [INSIGHT] 45개 가능한 쌍 중 15개만 저장 (30% 이상인 쌍만)


// ========================================
// 과제 4: 저장된 관계 확인
// ========================================

// [STEP 1] SIMILAR_TO 관계 조회
MATCH (c1:Customer)-[s:SIMILAR_TO]->(c2:Customer)
RETURN c1.name, c2.name, s.score
ORDER BY s.score DESC
LIMIT 10;

// [RESULT] 유사도 높은 고객 쌍 확인


// ========================================
// 보너스: 추천 시스템 활용
// ========================================

// [WHY] 유사도 관계를 추천에 활용하는 방법?
// - "나와 비슷한 고객이 산 책 = 내가 좋아할 책"
// - Collaborative Filtering의 핵심 아이디어

// [STEP 1] 타겟 고객과 유사한 고객 찾기
// [STEP 2] 유사한 고객이 구매한 책 중 내가 안 산 책 추천
MATCH (target:Customer {name: 'Alice'})-[sim:SIMILAR_TO]->(similar:Customer)
MATCH (similar)-[:PURCHASED]->(book:Book)
// [EDGE CASE] 타겟이 이미 구매한 책 제외
WHERE NOT (target)-[:PURCHASED]->(book)
RETURN DISTINCT book.title AS recommendation,
       count(*) AS recommendedBy,
       avg(sim.score) AS avgSimilarity
ORDER BY recommendedBy DESC, avgSimilarity DESC
LIMIT 5;

// [RESULT] Alice에게 추천할 책 5권
// [INSIGHT] 여러 유사 고객이 구매할수록 + 유사도 높을수록 추천 순위 상승


// ========================================
// 정리: 프로젝션 삭제
// ========================================

// [WHY] 분석 완료 후 정리
CALL gds.graph.drop('customer-book');
  `,
  [
    '그래프 프로젝션에는 두 종류의 노드 라벨이 필요합니다',
    'similarityMetric 파라미터로 JACCARD를 지정합니다',
    'gds.util.asNode()로 노드 ID를 실제 노드로 변환합니다',
    'similarityCutoff로 최소 유사도를 필터링합니다'
  ]
)

// Task 4: Cosine Similarity 영상
const task4CosineVideo = createVideoTask(
  'w3d3-cosine-video',
  'Cosine Similarity: 가중치 기반 유사도',
  25,
  [
    'Cosine Similarity의 수학적 원리 이해',
    '벡터 공간에서의 유사도 측정 개념',
    'Jaccard vs Cosine 비교',
    '평점/가중치 데이터에 Cosine 활용'
  ],
  'https://example.com/videos/cosine-similarity',
  `
자, 이번에는 Cosine Similarity를 배워보겠습니다.
Jaccard가 "무엇을 공유하는가"에 집중했다면,
Cosine은 "얼마나 비슷한 패턴으로 공유하는가"를 측정합니다.

## Cosine Similarity란?

두 벡터 사이의 각도(Angle)를 기반으로 유사도를 측정합니다.

### 수학적 정의

\`\`\`
Cosine(A, B) = (A · B) / (||A|| × ||B||)
\`\`\`

- \`A · B\`: 두 벡터의 내적 (dot product)
- \`||A||\`: 벡터 A의 크기 (magnitude)
- \`||B||\`: 벡터 B의 크기

### 값의 범위

- **1**: 완전히 같은 방향 (유사)
- **0**: 직교 (관련 없음)
- **-1**: 완전히 반대 방향 (비유사)

그래프에서는 보통 0~1 범위만 사용합니다.

## Jaccard vs Cosine 비교

### 예시: 영화 평점

**철수의 평점:**
- 인셉션: 5점
- 인터스텔라: 5점
- 매트릭스: 3점

**영희의 평점:**
- 인셉션: 4점
- 인터스텔라: 4점
- 아바타: 5점

### Jaccard (이진화)
공유 영화: {인셉션, 인터스텔라}
전체 영화: {인셉션, 인터스텔라, 매트릭스, 아바타}
Jaccard = 2/4 = 0.5

→ 평점을 무시하고 "봤다/안봤다"만 고려

### Cosine (가중치 포함)
철수 벡터: [5, 5, 3, 0]
영희 벡터: [4, 4, 0, 5]

내적: 5×4 + 5×4 + 3×0 + 0×5 = 40
||철수||: √(25+25+9+0) = √59 ≈ 7.68
||영희||: √(16+16+0+25) = √57 ≈ 7.55

Cosine = 40 / (7.68 × 7.55) ≈ 0.69

→ 둘 다 SF 영화(인셉션, 인터스텔라)에 높은 점수를 줌!

## GDS에서 Cosine Similarity

GDS의 Node Similarity 알고리즘은 기본적으로 Jaccard를 사용하지만,
가중치가 있는 관계에서는 Cosine 기반 계산을 지원합니다.

### 그래프 프로젝션 (가중치 포함)

\`\`\`cypher
CALL gds.graph.project(
  'user-movie-weighted',
  ['User', 'Movie'],
  {
    RATED: {
      properties: ['score'],
      orientation: 'UNDIRECTED'
    }
  }
);
\`\`\`

### Cosine Similarity 실행

\`\`\`cypher
CALL gds.nodeSimilarity.stream('user-movie-weighted', {
  similarityMetric: 'COSINE',
  relationshipWeightProperty: 'score',
  topK: 10
})
YIELD node1, node2, similarity
RETURN
  gds.util.asNode(node1).name AS user1,
  gds.util.asNode(node2).name AS user2,
  round(similarity, 3) AS cosine
ORDER BY cosine DESC;
\`\`\`

## Cosine의 장점

1. **가중치 고려**: 단순히 본 영화가 아니라 "얼마나 좋아했는지"
2. **크기 불변성**: 많이 평가한 사용자와 적게 평가한 사용자도 공정하게 비교
3. **연속적 값**: 더 세밀한 유사도 측정 가능

## 언제 Cosine을 사용할까?

- 평점 데이터 (1-5점)
- 구매 횟수
- 페이지 조회 시간
- 클릭 빈도

즉, **관계에 가중치가 있을 때** Cosine이 더 적합합니다!

## Adjusted Cosine

사용자 평균 평점을 보정한 버전입니다.

철수 평균: 4.3점 → 상향 평가 경향
영희 평균: 3.0점 → 하향 평가 경향

이런 개인별 편향을 제거한 것이 Adjusted Cosine입니다.
GDS에서는 직접 구현해야 하지만, 추천 시스템에서 매우 중요한 개념입니다.

다음 섹션에서 실제로 Cosine Similarity를 실습해보겠습니다!
  `
)

// Task 5: Cosine Similarity 심화 학습
const task5CosineDeep = createReadingTask(
  'w3d3-cosine-deep',
  'Cosine Similarity 심화 학습',
  30,
  [
    '가중치 그래프에서 Cosine 계산',
    'Cosine vs Pearson 비교',
    '추천 시스템에서의 활용 패턴'
  ],
  `
# Cosine Similarity 심화 학습

## 1. 벡터로 표현된 그래프 관계

그래프에서 노드는 이웃과의 관계를 통해 **벡터로 표현**됩니다.

### User-Item 행렬

| User | Movie1 | Movie2 | Movie3 | Movie4 |
|------|--------|--------|--------|--------|
| Alice | 5 | 4 | 0 | 0 |
| Bob | 4 | 5 | 0 | 0 |
| Carol | 0 | 0 | 4 | 5 |
| Dave | 2 | 3 | 4 | 5 |

- Alice 벡터: [5, 4, 0, 0]
- Bob 벡터: [4, 5, 0, 0]
- Carol 벡터: [0, 0, 4, 5]

### Cosine 계산

\`\`\`
Cosine(Alice, Bob) = (5×4 + 4×5 + 0×0 + 0×0) / (√41 × √41)
                  = 40 / 41
                  ≈ 0.976  (매우 유사!)

Cosine(Alice, Carol) = (5×0 + 4×0 + 0×4 + 0×5) / (√41 × √41)
                     = 0 / 41
                     = 0  (완전히 다른 취향!)
\`\`\`

## 2. GDS에서 Cosine Similarity 구현

### 가중치 있는 그래프 생성

\`\`\`cypher
// 평점 데이터 생성
CREATE (alice:User {name: 'Alice'})
CREATE (bob:User {name: 'Bob'})
CREATE (carol:User {name: 'Carol'})
CREATE (dave:User {name: 'Dave'})

CREATE (m1:Movie {title: 'Movie1'})
CREATE (m2:Movie {title: 'Movie2'})
CREATE (m3:Movie {title: 'Movie3'})
CREATE (m4:Movie {title: 'Movie4'})

CREATE (alice)-[:RATED {score: 5.0}]->(m1)
CREATE (alice)-[:RATED {score: 4.0}]->(m2)
CREATE (bob)-[:RATED {score: 4.0}]->(m1)
CREATE (bob)-[:RATED {score: 5.0}]->(m2)
CREATE (carol)-[:RATED {score: 4.0}]->(m3)
CREATE (carol)-[:RATED {score: 5.0}]->(m4)
CREATE (dave)-[:RATED {score: 2.0}]->(m1)
CREATE (dave)-[:RATED {score: 3.0}]->(m2)
CREATE (dave)-[:RATED {score: 4.0}]->(m3)
CREATE (dave)-[:RATED {score: 5.0}]->(m4);
\`\`\`

### 그래프 프로젝션 (가중치 포함)

\`\`\`cypher
CALL gds.graph.project(
  'rating-graph',
  ['User', 'Movie'],
  {
    RATED: {
      properties: ['score'],
      orientation: 'UNDIRECTED'
    }
  }
);
\`\`\`

### Cosine Similarity 실행

\`\`\`cypher
CALL gds.nodeSimilarity.stream('rating-graph', {
  similarityMetric: 'COSINE',
  relationshipWeightProperty: 'score',
  topK: 10,
  // User 노드만 대상
  nodeLabels: ['User']
})
YIELD node1, node2, similarity
WITH gds.util.asNode(node1) AS user1,
     gds.util.asNode(node2) AS user2,
     similarity
WHERE user1:User AND user2:User
RETURN user1.name, user2.name, round(similarity, 3) AS cosine
ORDER BY cosine DESC;
\`\`\`

## 3. Cosine vs Pearson Similarity

두 알고리즘 모두 가중치를 고려하지만, 다른 관점에서 측정합니다.

### Pearson Correlation

\`\`\`
Pearson(A, B) = Cov(A, B) / (σA × σB)
             = Σ(ai - ā)(bi - b̄) / √(Σ(ai-ā)² × Σ(bi-b̄)²)
\`\`\`

- ā: A의 평균
- b̄: B의 평균
- 평균을 기준으로 편차를 계산

### 차이점 예시

| User | M1 | M2 | M3 | M4 |
|------|----|----|----|----|
| Alice | 5 | 4 | 5 | 4 |
| Bob | 2 | 1 | 2 | 1 |

Alice 평균: 4.5 (관대한 평가자)
Bob 평균: 1.5 (엄격한 평가자)

**Cosine**:
- 내적 = 5×2 + 4×1 + 5×2 + 4×1 = 28
- 결과 ≈ 0.99 (매우 유사!)

**Pearson**:
- Alice 편차: [0.5, -0.5, 0.5, -0.5]
- Bob 편차: [0.5, -0.5, 0.5, -0.5]
- 결과 = 1.0 (완벽히 같은 패턴!)

### 선택 가이드

| 상황 | 추천 알고리즘 |
|------|-------------|
| 평점 스케일 일관 | Cosine |
| 사용자별 평점 편향 있음 | Pearson |
| 희소 데이터 | Cosine (더 안정적) |
| 조밀 데이터 | Pearson (더 정확) |

## 4. 추천 시스템에서의 활용

### User-based Collaborative Filtering

\`\`\`cypher
// 1. 유사한 사용자 찾기
CALL gds.nodeSimilarity.stream('rating-graph', {
  similarityMetric: 'COSINE',
  relationshipWeightProperty: 'score',
  topK: 5
})
YIELD node1, node2, similarity
WITH gds.util.asNode(node1) AS targetUser,
     gds.util.asNode(node2) AS similarUser,
     similarity
WHERE targetUser.name = 'Alice'

// 2. 유사한 사용자가 높게 평가한 영화 추천
MATCH (similarUser)-[r:RATED]->(movie:Movie)
WHERE NOT EXISTS {
  MATCH (targetUser)-[:RATED]->(movie)
}
RETURN movie.title AS recommendation,
       collect(similarUser.name) AS recommendedBy,
       avg(r.score * similarity) AS weightedScore
ORDER BY weightedScore DESC
LIMIT 10;
\`\`\`

### Item-based Collaborative Filtering

\`\`\`cypher
// 1. 유사한 영화 찾기 (영화 기준 프로젝션)
CALL gds.graph.project(
  'movie-similarity',
  ['Movie', 'User'],
  {
    RATED: {
      properties: ['score'],
      orientation: 'UNDIRECTED'
    }
  }
);

// 2. 영화 간 유사도 계산
CALL gds.nodeSimilarity.stream('movie-similarity', {
  similarityMetric: 'COSINE',
  relationshipWeightProperty: 'score',
  topK: 5,
  nodeLabels: ['Movie']
})
YIELD node1, node2, similarity
WITH gds.util.asNode(node1) AS movie1,
     gds.util.asNode(node2) AS movie2,
     similarity
WHERE movie1:Movie AND movie2:Movie
RETURN movie1.title, movie2.title, round(similarity, 3)
ORDER BY similarity DESC;
\`\`\`

## 5. 성능 최적화

### 대규모 그래프에서의 고려사항

\`\`\`cypher
CALL gds.nodeSimilarity.stream('rating-graph', {
  similarityMetric: 'COSINE',
  relationshipWeightProperty: 'score',
  // 최소 유사도 (성능 + 품질)
  similarityCutoff: 0.5,
  // 상위 K개만 (메모리 절약)
  topK: 10,
  // 최소 공유 이웃 수 (노이즈 제거)
  degreeCutoff: 3,
  // 병렬 처리
  concurrency: 4
})
...
\`\`\`

### Memory Estimation

\`\`\`cypher
CALL gds.nodeSimilarity.mutate.estimate('rating-graph', {
  similarityMetric: 'COSINE',
  relationshipWeightProperty: 'score',
  mutateRelationshipType: 'SIMILAR',
  mutateProperty: 'score'
})
YIELD nodeCount, relationshipCount, bytesMin, bytesMax
RETURN nodeCount, relationshipCount,
       bytesMin / 1024 / 1024 AS minMB,
       bytesMax / 1024 / 1024 AS maxMB;
\`\`\`

Cosine Similarity는 추천 시스템의 핵심 알고리즘입니다.
다음 섹션에서 GDS의 통합 Node Similarity 알고리즘을 배워보겠습니다!
  `
)

// Task 6: Cosine Similarity 실습
const task6CosinePractice = createCodeTask(
  'w3d3-cosine-practice',
  'Cosine Similarity 실습: 평점 기반 추천',
  30,
  [
    '⚖️ 가중치 그래프 프로젝션 생성',
    '📐 Cosine Similarity 계산',
    '🎵 평점 기반 추천 시스템 구현'
  ],
  `
# Cosine Similarity 실습: 평점 기반 추천

## 🎯 왜 배우는가?

### 문제 상황
음악 스트리밍에서 "얼마나 자주 들었는가"를 고려한 추천이 필요합니다.
- Jaccard는 "들었다/안 들었다"만 봄 (이진 데이터)
- 재생 횟수, 평점 같은 가중치를 반영해야 진짜 취향 파악
- 많이 들은 곡의 유사도를 더 높게 평가해야 함

### 해결책: Cosine Similarity
> 🎧 **비유**: 음악 취향 벡터 비교
> - 철수: [록 5회, 재즈 10회, 클래식 2회]
> - 영희: [록 10회, 재즈 20회, 클래식 4회]
> - 같은 방향(취향)이지만 크기(재생 횟수)만 다름
> - Cosine은 "방향"만 보므로 유사도 높음!

음악 스트리밍 서비스 데이터를 사용하여
사용자 간 취향 유사도를 분석하고 추천 시스템을 구현합니다.

## 과제

1. 평점 데이터로 가중치 그래프 프로젝션 생성
2. 사용자 간 Cosine Similarity 계산
3. 특정 사용자에게 맞춤 음악 추천

## 데이터 구조
- User 노드 (20명)
- Song 노드 (50곡)
- PLAYED 관계 (playCount 속성: 1-100)
  `,
  `
// 실습 시작 코드

// 1. 데이터 확인
MATCH (u:User)-[p:PLAYED]->(s:Song)
RETURN u.name, s.title, p.playCount
LIMIT 10;

// 2. 그래프 프로젝션 (가중치 포함)
// TODO: playCount를 가중치로 사용
CALL gds.graph.project(
  'music-taste',
  ['User', 'Song'],
  {
    PLAYED: {
      properties: ['___'],
      orientation: 'UNDIRECTED'
    }
  }
);

// 3. Cosine Similarity 계산
// TODO: 가중치 기반 유사도 계산
CALL gds.nodeSimilarity.stream('___', {
  similarityMetric: '___',
  relationshipWeightProperty: '___',
  topK: 10
})
YIELD node1, node2, similarity
RETURN
  gds.util.asNode(node1).name AS user1,
  gds.util.asNode(node2).name AS user2,
  round(similarity, 3) AS cosine
ORDER BY cosine DESC;

// 4. 특정 사용자('Alice')에게 음악 추천
// TODO: 유사한 사용자가 많이 들은 노래 추천
CALL gds.nodeSimilarity.stream('music-taste', {
  similarityMetric: 'COSINE',
  relationshipWeightProperty: 'playCount',
  topK: 3
})
YIELD node1, node2, similarity
WITH gds.util.asNode(node1) AS user1,
     gds.util.asNode(node2) AS user2,
     similarity
WHERE user1.name = '___'
// TODO: 유사 사용자가 들은 노래 중 Alice가 안 들은 것 찾기
MATCH ___
WHERE NOT EXISTS { ___ }
RETURN ___ AS recommendation,
       ___ AS recommendedBy,
       ___ AS totalPlays
ORDER BY ___ DESC
LIMIT 10;
  `,
  `
// 정답 코드

// 1. 데이터 확인
MATCH (u:User)-[p:PLAYED]->(s:Song)
RETURN u.name, s.title, p.playCount
LIMIT 10;

// 2. 그래프 프로젝션 (가중치 포함)
CALL gds.graph.project(
  'music-taste',
  ['User', 'Song'],
  {
    PLAYED: {
      properties: ['playCount'],
      orientation: 'UNDIRECTED'
    }
  }
);

// 3. Cosine Similarity 계산
CALL gds.nodeSimilarity.stream('music-taste', {
  similarityMetric: 'COSINE',
  relationshipWeightProperty: 'playCount',
  topK: 10
})
YIELD node1, node2, similarity
RETURN
  gds.util.asNode(node1).name AS user1,
  gds.util.asNode(node2).name AS user2,
  round(similarity, 3) AS cosine
ORDER BY cosine DESC;

// 4. 특정 사용자('Alice')에게 음악 추천
CALL gds.nodeSimilarity.stream('music-taste', {
  similarityMetric: 'COSINE',
  relationshipWeightProperty: 'playCount',
  topK: 3
})
YIELD node1, node2, similarity
WITH gds.util.asNode(node1) AS user1,
     gds.util.asNode(node2) AS user2,
     similarity
WHERE user1.name = 'Alice'

// 유사 사용자가 들은 노래 중 Alice가 안 들은 것 찾기
MATCH (user2)-[p:PLAYED]->(song:Song)
WHERE NOT EXISTS {
  MATCH (user1)-[:PLAYED]->(song)
}
RETURN song.title AS recommendation,
       user2.name AS recommendedBy,
       p.playCount AS totalPlays,
       round(similarity, 3) AS similarity
ORDER BY similarity DESC, totalPlays DESC
LIMIT 10;

// 5. 가중 점수로 최종 추천 (심화)
CALL gds.nodeSimilarity.stream('music-taste', {
  similarityMetric: 'COSINE',
  relationshipWeightProperty: 'playCount',
  topK: 5
})
YIELD node1, node2, similarity
WITH gds.util.asNode(node1) AS targetUser,
     gds.util.asNode(node2) AS similarUser,
     similarity
WHERE targetUser.name = 'Alice'

MATCH (similarUser)-[p:PLAYED]->(song:Song)
WHERE NOT EXISTS {
  MATCH (targetUser)-[:PLAYED]->(song)
}
WITH song, sum(p.playCount * similarity) AS weightedScore,
     collect(similarUser.name) AS recommendedBy
RETURN song.title AS recommendation,
       round(weightedScore, 1) AS score,
       recommendedBy
ORDER BY score DESC
LIMIT 10;

// 정리
CALL gds.graph.drop('music-taste');
  `,
  [
    'playCount 속성을 relationshipWeightProperty로 지정합니다',
    'similarityMetric을 COSINE으로 설정합니다',
    'NOT EXISTS 패턴으로 이미 들은 노래를 제외합니다',
    '가중 점수 = 재생횟수 × 유사도'
  ]
)

// Task 7: Node Similarity 알고리즘 영상
const task7NodeSimilarityVideo = createVideoTask(
  'w3d3-node-similarity-video',
  'GDS Node Similarity: 통합 유사도 알고리즘',
  20,
  [
    'Node Similarity 알고리즘의 특징 이해',
    '대규모 그래프에서의 효율적인 유사도 계산',
    'Top-K vs Threshold 방식 비교'
  ],
  'https://example.com/videos/node-similarity',
  `
이번에는 GDS의 Node Similarity 알고리즘을 깊이 있게 살펴보겠습니다.

## Node Similarity란?

GDS의 Node Similarity는 **Bipartite 그래프**에서
노드 간 유사도를 효율적으로 계산하는 통합 알고리즘입니다.

### Bipartite 그래프?

두 종류의 노드 집합이 서로만 연결되는 그래프입니다.

\`\`\`
[User 집합]          [Item 집합]
   Alice ───────────── Movie1
   Bob ─────────────── Movie2
   Carol ──────────── Movie3
\`\`\`

이런 구조에서 같은 집합 내의 유사도를 계산합니다.

## Node Similarity의 특징

### 1. 자동 방향 전환
- User-Movie 관계에서 User 간 유사도 계산 시
- 자동으로 "User → Movie → User" 경로 탐색

### 2. 여러 유사도 메트릭 지원
- JACCARD (기본)
- OVERLAP
- COSINE

### 3. 효율적인 필터링
- **Top-K**: 각 노드에 가장 유사한 K개만 계산
- **Threshold**: 최소 유사도 이상만 계산
- 둘 다 적용 가능

## 실행 모드

### Stream 모드
\`\`\`cypher
CALL gds.nodeSimilarity.stream('my-graph', {
  topK: 10
})
YIELD node1, node2, similarity
RETURN gds.util.asNode(node1).name,
       gds.util.asNode(node2).name,
       similarity;
\`\`\`

### Mutate 모드 (그래프 내 저장)
\`\`\`cypher
CALL gds.nodeSimilarity.mutate('my-graph', {
  topK: 10,
  mutateRelationshipType: 'SIMILAR',
  mutateProperty: 'score'
})
YIELD nodesCompared, relationshipsWritten;
\`\`\`

### Write 모드 (DB에 저장)
\`\`\`cypher
CALL gds.nodeSimilarity.write('my-graph', {
  topK: 10,
  writeRelationshipType: 'SIMILAR',
  writeProperty: 'score'
})
YIELD nodesCompared, relationshipsWritten;
\`\`\`

## 주요 파라미터

### degreeCutoff (중요!)
최소 연결 수. 이웃이 적은 노드는 유사도 계산에서 제외.

\`\`\`cypher
{
  degreeCutoff: 3  // 최소 3개 이웃이 있어야 함
}
\`\`\`

왜 필요한가?
- 영화 1편만 본 사용자와 1편 본 다른 사용자가 같은 영화라면
- Jaccard = 1.0 (100%!) 이지만 의미 없는 결과

### similarityCutoff
최소 유사도. 이 값 이상만 결과에 포함.

\`\`\`cypher
{
  similarityCutoff: 0.5  // 50% 이상만
}
\`\`\`

### topK vs topN
- **topK**: 각 노드별 상위 K개 (기본값: 10)
- **topN**: 전체 결과에서 상위 N개

\`\`\`cypher
{
  topK: 10,   // 각 노드별 10개
  topN: 100  // 전체에서 100개만
}
\`\`\`

## 대규모 그래프 최적화

### 메모리 추정
\`\`\`cypher
CALL gds.nodeSimilarity.stream.estimate('my-graph', {
  topK: 10,
  similarityCutoff: 0.5
})
YIELD nodeCount, relationshipCount, bytesMin, bytesMax;
\`\`\`

### 병렬 처리
\`\`\`cypher
{
  concurrency: 4  // 4개 스레드
}
\`\`\`

### 결과 크기 제한
\`\`\`cypher
{
  topK: 5,         // 노드당 5개
  topN: 1000,      // 전체 1000개
  similarityCutoff: 0.3  // 30% 이상만
}
\`\`\`

다음 섹션에서 K-Nearest Neighbors를 배우고,
오늘의 내용을 종합하여 추천 시스템을 완성해보겠습니다!
  `
)

// Task 8: K-Nearest Neighbors 심화 학습
const task8KnnDeep = createReadingTask(
  'w3d3-knn-deep',
  'K-Nearest Neighbors (KNN) 완전 정복',
  30,
  [
    'KNN 알고리즘의 원리와 특징',
    'GDS에서 KNN 실행 방법',
    '노드 속성 기반 KNN 활용'
  ],
  `
# K-Nearest Neighbors (KNN) 완전 정복

## 1. KNN이란?

K-Nearest Neighbors는 가장 가까운(유사한) K개의 이웃을 찾는 알고리즘입니다.

전통적인 ML에서:
- 분류: 다수결 투표로 클래스 결정
- 회귀: K개 이웃의 평균값

그래프에서:
- 유사도 기반으로 가장 가까운 K개 노드 탐색
- 추천, 클러스터링, 이상 탐지 등에 활용

## 2. Node Similarity vs KNN

### Node Similarity
- **구조적 유사도**: 이웃(연결된 노드)을 기반으로 유사도 측정
- Bipartite 그래프에 최적화
- 예: 같은 영화를 본 사용자끼리 유사

### KNN
- **속성 기반 유사도**: 노드의 속성 벡터로 유사도 측정
- 모든 그래프 유형에 적용 가능
- 예: 비슷한 프로필(나이, 성별, 지역)을 가진 사용자끼리 유사

## 3. GDS KNN 알고리즘

GDS의 KNN은 **노드 속성 벡터**를 기반으로 유사도를 계산합니다.

### 지원하는 유사도 메트릭

| 메트릭 | 설명 | 적합한 데이터 |
|--------|------|--------------|
| COSINE | 벡터 각도 기반 | 정규화된 벡터 |
| EUCLIDEAN | 유클리드 거리 | 연속적 수치 |
| PEARSON | 피어슨 상관계수 | 평점 데이터 |
| JACCARD | 집합 유사도 | 이진 속성 |

### 그래프 프로젝션 (속성 포함)

\`\`\`cypher
// 사용자 프로필 데이터
CREATE (alice:User {name: 'Alice', age: 28, interests: [1,0,1,0,1]})
CREATE (bob:User {name: 'Bob', age: 30, interests: [1,1,0,0,1]})
CREATE (carol:User {name: 'Carol', age: 25, interests: [0,0,1,1,0]})
CREATE (dave:User {name: 'Dave', age: 32, interests: [1,0,1,0,0]});

// 그래프 프로젝션 (속성 벡터 포함)
CALL gds.graph.project(
  'user-profiles',
  {
    User: {
      properties: ['interests']  // 관심사 벡터
    }
  },
  '*'
);
\`\`\`

### KNN 실행

\`\`\`cypher
CALL gds.knn.stream('user-profiles', {
  nodeLabels: ['User'],
  nodeProperties: ['interests'],
  similarityMetric: 'COSINE',
  topK: 3,
  sampleRate: 1.0,
  deltaThreshold: 0.0
})
YIELD node1, node2, similarity
RETURN gds.util.asNode(node1).name AS user1,
       gds.util.asNode(node2).name AS user2,
       round(similarity, 3) AS similarity
ORDER BY similarity DESC;
\`\`\`

## 4. KNN의 핵심 파라미터

### topK
각 노드에 대해 찾을 이웃 수

\`\`\`cypher
{
  topK: 10  // 각 노드마다 가장 유사한 10개 노드
}
\`\`\`

### sampleRate (성능 최적화)
- 1.0: 모든 노드 쌍 비교 (정확하지만 느림)
- 0.5: 50%만 샘플링 (빠르지만 근사)

\`\`\`cypher
{
  sampleRate: 0.5  // 대규모 그래프에서 권장
}
\`\`\`

### deltaThreshold (수렴 조건)
알고리즘 반복 시 변화량이 이 값 이하면 종료

\`\`\`cypher
{
  deltaThreshold: 0.001
}
\`\`\`

### randomSeed
결과 재현성을 위한 시드값

\`\`\`cypher
{
  randomSeed: 42
}
\`\`\`

## 5. KNN 활용 사례

### 사례 1: 프로필 기반 친구 추천

\`\`\`cypher
// 1. 사용자 임베딩 생성 (Node2Vec 등)
CALL gds.node2vec.mutate('social-graph', {
  embeddingDimension: 64,
  walkLength: 10,
  walksPerNode: 5,
  mutateProperty: 'embedding'
});

// 2. KNN으로 유사한 사용자 찾기
CALL gds.knn.stream('social-graph', {
  nodeLabels: ['User'],
  nodeProperties: ['embedding'],
  topK: 5,
  similarityMetric: 'COSINE'
})
YIELD node1, node2, similarity
WHERE NOT gds.util.asNode(node1) = gds.util.asNode(node2)
RETURN gds.util.asNode(node1).name AS user,
       gds.util.asNode(node2).name AS recommendation,
       round(similarity, 3) AS similarity;
\`\`\`

### 사례 2: 상품 유사도 기반 추천

\`\`\`cypher
// 상품 특성 벡터
CREATE (p1:Product {name: 'iPhone', features: [0.9, 0.8, 0.7, 0.2]})
CREATE (p2:Product {name: 'Galaxy', features: [0.85, 0.75, 0.65, 0.25]})
CREATE (p3:Product {name: 'MacBook', features: [0.7, 0.9, 0.8, 0.1]});

// KNN으로 유사 상품 찾기
CALL gds.knn.stream('product-graph', {
  nodeLabels: ['Product'],
  nodeProperties: ['features'],
  topK: 3,
  similarityMetric: 'EUCLIDEAN'
})
YIELD node1, node2, similarity
RETURN gds.util.asNode(node1).name AS product,
       gds.util.asNode(node2).name AS similar,
       1 / (1 + similarity) AS normalizedSimilarity;  // 거리 → 유사도 변환
\`\`\`

### 사례 3: 이상 탐지 (Anomaly Detection)

\`\`\`cypher
// 평균 거리가 큰 노드 = 이상치
CALL gds.knn.stream('data-graph', {
  nodeProperties: ['features'],
  topK: 5,
  similarityMetric: 'EUCLIDEAN'
})
YIELD node1, node2, similarity
WITH gds.util.asNode(node1) AS node, avg(similarity) AS avgDistance
ORDER BY avgDistance DESC
LIMIT 10
RETURN node.id AS potentialAnomaly, avgDistance;
\`\`\`

## 6. KNN 결과 저장

### Write 모드

\`\`\`cypher
CALL gds.knn.write('user-profiles', {
  nodeLabels: ['User'],
  nodeProperties: ['interests'],
  topK: 3,
  writeRelationshipType: 'SIMILAR_PROFILE',
  writeProperty: 'score'
})
YIELD nodesCompared, relationshipsWritten,
      similarityDistribution, postProcessingMillis
RETURN *;
\`\`\`

### 결과 활용

\`\`\`cypher
// 저장된 유사도 관계로 추천
MATCH (me:User {name: 'Alice'})-[s:SIMILAR_PROFILE]->(similar:User)
MATCH (similar)-[:LIKES]->(item:Item)
WHERE NOT (me)-[:LIKES]->(item)
RETURN item, sum(s.score) AS score
ORDER BY score DESC
LIMIT 10;
\`\`\`

## 7. 성능 고려사항

### 시간 복잡도

| sampleRate | 복잡도 | 1M 노드 예상 시간 |
|------------|--------|------------------|
| 1.0 | O(n²) | 수 시간 |
| 0.5 | O(n × k) | 수 분 |
| 0.1 | O(n × k) | 수 초 |

### 메모리 추정

\`\`\`cypher
CALL gds.knn.stream.estimate('user-profiles', {
  nodeProperties: ['interests'],
  topK: 10,
  sampleRate: 0.5
})
YIELD nodeCount, bytesMin, bytesMax
RETURN nodeCount,
       bytesMin / 1024 / 1024 AS minMB,
       bytesMax / 1024 / 1024 AS maxMB;
\`\`\`

KNN은 속성 기반 유사도 계산의 핵심 알고리즘입니다!
  `
)

// Task 9: 종합 실습 - 추천 시스템 구현
const task9RecommendationPractice = createCodeTask(
  'w3d3-recommendation-practice',
  '종합 실습: 추천 시스템 구현',
  35,
  [
    'User-based Collaborative Filtering 구현',
    'Item-based Collaborative Filtering 구현',
    '하이브리드 추천 시스템 설계'
  ],
  `
# 종합 실습: 추천 시스템 구현

이커머스 플랫폼의 상품 추천 시스템을 구현합니다.
다양한 유사도 알고리즘을 조합하여 하이브리드 추천을 완성합니다.

## 과제

1. User-based CF: 유사한 고객이 구매한 상품 추천
2. Item-based CF: 구매한 상품과 유사한 상품 추천
3. 하이브리드: 두 방식을 결합한 최종 추천

## 데이터 구조
- Customer 노드 (name, segment)
- Product 노드 (name, category, features[])
- PURCHASED 관계 (amount, rating)
  `,
  `
// 실습 시작 코드

// ========================================
// Part 1: User-based Collaborative Filtering
// ========================================

// 1-1. 그래프 프로젝션 (평점 가중치)
CALL gds.graph.project(
  'user-cf',
  ['Customer', 'Product'],
  {
    PURCHASED: {
      properties: ['___'],  // rating 사용
      orientation: 'UNDIRECTED'
    }
  }
);

// 1-2. 고객 간 Cosine Similarity 계산
CALL gds.nodeSimilarity.stream('user-cf', {
  similarityMetric: '___',
  relationshipWeightProperty: '___',
  topK: 5
})
YIELD node1, node2, similarity
// TODO: Customer 노드만 필터링
WITH ___
WHERE ___ AND ___
RETURN ___ AS customer1, ___ AS customer2,
       round(similarity, 3) AS similarity
ORDER BY similarity DESC
LIMIT 10;

// 1-3. 'Alice'에게 User-based 추천
// TODO: 유사 고객이 높게 평가한 상품 추천


// ========================================
// Part 2: Item-based Collaborative Filtering
// ========================================

// 2-1. 상품 특성 기반 KNN
CALL gds.graph.project(
  'item-knn',
  {
    Product: {
      properties: ['___']  // features 사용
    }
  },
  '*'
);

// 2-2. 상품 간 KNN Similarity
CALL gds.knn.stream('item-knn', {
  nodeLabels: ['Product'],
  nodeProperties: ['___'],
  similarityMetric: 'COSINE',
  topK: 5
})
YIELD node1, node2, similarity
RETURN
  gds.util.asNode(node1).name AS product1,
  gds.util.asNode(node2).name AS product2,
  round(similarity, 3) AS similarity
ORDER BY similarity DESC
LIMIT 10;

// 2-3. 'Alice'가 구매한 상품과 유사한 상품 추천
// TODO: Item-based 추천 구현


// ========================================
// Part 3: 하이브리드 추천
// ========================================

// 3-1. 두 추천 결과 합치기
// TODO: User-based + Item-based 점수 합산
  `,
  `
// 정답 코드

// ========================================
// Part 1: User-based Collaborative Filtering
// ========================================

// 1-1. 그래프 프로젝션 (평점 가중치)
CALL gds.graph.project(
  'user-cf',
  ['Customer', 'Product'],
  {
    PURCHASED: {
      properties: ['rating'],
      orientation: 'UNDIRECTED'
    }
  }
);

// 1-2. 고객 간 Cosine Similarity 계산
CALL gds.nodeSimilarity.stream('user-cf', {
  similarityMetric: 'COSINE',
  relationshipWeightProperty: 'rating',
  topK: 5
})
YIELD node1, node2, similarity
WITH gds.util.asNode(node1) AS customer1,
     gds.util.asNode(node2) AS customer2,
     similarity
WHERE customer1:Customer AND customer2:Customer
RETURN customer1.name, customer2.name,
       round(similarity, 3) AS similarity
ORDER BY similarity DESC
LIMIT 10;

// 1-3. 'Alice'에게 User-based 추천
CALL gds.nodeSimilarity.stream('user-cf', {
  similarityMetric: 'COSINE',
  relationshipWeightProperty: 'rating',
  topK: 3
})
YIELD node1, node2, similarity
WITH gds.util.asNode(node1) AS target,
     gds.util.asNode(node2) AS similar,
     similarity
WHERE target:Customer AND target.name = 'Alice'
  AND similar:Customer

// 유사 고객이 높게 평가한 상품
MATCH (similar)-[p:PURCHASED]->(product:Product)
WHERE NOT EXISTS {
  MATCH (target)-[:PURCHASED]->(product)
}
WITH product,
     sum(p.rating * similarity) AS weightedScore,
     count(DISTINCT similar) AS numRecommenders
RETURN product.name AS recommendation,
       round(weightedScore, 2) AS userBasedScore,
       numRecommenders,
       'user-based' AS method
ORDER BY weightedScore DESC
LIMIT 5;

// ========================================
// Part 2: Item-based Collaborative Filtering
// ========================================

// 2-1. 상품 특성 기반 KNN
CALL gds.graph.project(
  'item-knn',
  {
    Product: {
      properties: ['features']
    }
  },
  '*'
);

// 2-2. 상품 간 KNN Similarity
CALL gds.knn.stream('item-knn', {
  nodeLabels: ['Product'],
  nodeProperties: ['features'],
  similarityMetric: 'COSINE',
  topK: 5,
  sampleRate: 1.0
})
YIELD node1, node2, similarity
RETURN
  gds.util.asNode(node1).name AS product1,
  gds.util.asNode(node2).name AS product2,
  round(similarity, 3) AS similarity
ORDER BY similarity DESC
LIMIT 10;

// 2-3. 'Alice'가 구매한 상품과 유사한 상품 추천
MATCH (alice:Customer {name: 'Alice'})-[p:PURCHASED]->(bought:Product)
WITH alice, bought, p.rating AS rating

CALL gds.knn.stream('item-knn', {
  nodeLabels: ['Product'],
  nodeProperties: ['features'],
  topK: 3,
  similarityMetric: 'COSINE'
})
YIELD node1, node2, similarity
WITH alice, gds.util.asNode(node1) AS product1,
     gds.util.asNode(node2) AS product2,
     similarity, bought, rating
WHERE product1 = bought
  AND NOT EXISTS {
    MATCH (alice)-[:PURCHASED]->(product2)
  }
WITH product2, sum(rating * similarity) AS weightedScore
RETURN product2.name AS recommendation,
       round(weightedScore, 2) AS itemBasedScore,
       'item-based' AS method
ORDER BY weightedScore DESC
LIMIT 5;

// ========================================
// Part 3: 하이브리드 추천
// ========================================

// 3-1. User-based 점수 계산
CALL gds.nodeSimilarity.stream('user-cf', {
  similarityMetric: 'COSINE',
  relationshipWeightProperty: 'rating',
  topK: 3
})
YIELD node1, node2, similarity
WITH gds.util.asNode(node1) AS target,
     gds.util.asNode(node2) AS similar,
     similarity
WHERE target:Customer AND target.name = 'Alice' AND similar:Customer
MATCH (similar)-[p:PURCHASED]->(product:Product)
WHERE NOT EXISTS { MATCH (target)-[:PURCHASED]->(product) }
WITH product, sum(p.rating * similarity) AS userScore

// 3-2. Item-based 점수 추가
OPTIONAL MATCH (alice:Customer {name: 'Alice'})-[p:PURCHASED]->(bought:Product)
WITH product, userScore, alice, collect({product: bought, rating: p.rating}) AS purchases

UNWIND purchases AS purchase
WITH product, userScore, alice, purchase.product AS bought, purchase.rating AS rating
CALL gds.knn.stream('item-knn', {
  nodeLabels: ['Product'],
  nodeProperties: ['features'],
  topK: 3
})
YIELD node1, node2, similarity
WITH product, userScore,
     gds.util.asNode(node1) AS prod1,
     gds.util.asNode(node2) AS prod2,
     similarity, bought, rating
WHERE prod1 = bought AND prod2 = product
WITH product,
     userScore,
     sum(rating * similarity) AS itemScore

// 3-3. 하이브리드 점수 (가중 평균)
WITH product,
     COALESCE(userScore, 0) AS userScore,
     COALESCE(itemScore, 0) AS itemScore,
     COALESCE(userScore, 0) * 0.6 + COALESCE(itemScore, 0) * 0.4 AS hybridScore
RETURN product.name AS recommendation,
       round(userScore, 2) AS userBased,
       round(itemScore, 2) AS itemBased,
       round(hybridScore, 2) AS finalScore
ORDER BY hybridScore DESC
LIMIT 10;

// 정리
CALL gds.graph.drop('user-cf');
CALL gds.graph.drop('item-knn');
  `,
  [
    'User-based CF는 Cosine Similarity + rating 가중치 사용',
    'Item-based CF는 KNN + features 벡터 사용',
    '하이브리드는 두 점수의 가중 평균으로 계산',
    'COALESCE로 NULL 값을 0으로 처리'
  ]
)

// Task 10: 유사도 알고리즘 퀴즈
const task10Quiz = createQuizTask(
  'w3d3-similarity-quiz',
  '유사도 알고리즘 이해도 점검',
  15,
  [
    {
      question: 'Jaccard Similarity 공식으로 올바른 것은?',
      options: [
        '|A ∩ B| / |A ∪ B|',
        '|A ∩ B| / min(|A|, |B|)',
        '(A · B) / (||A|| × ||B||)',
        '|A| + |B| - |A ∩ B|'
      ],
      answer: 0,
      explanation: 'Jaccard = 교집합 / 합집합입니다. Overlap은 min 사용, Cosine은 내적 기반입니다.'
    },
    {
      question: '평점 데이터(1-5점)가 있는 그래프에서 가장 적합한 유사도 알고리즘은?',
      options: [
        'Jaccard Similarity',
        'Overlap Coefficient',
        'Cosine Similarity',
        'Hamming Distance'
      ],
      answer: 2,
      explanation: 'Cosine Similarity는 가중치(평점)를 고려하여 유사도를 측정합니다. Jaccard/Overlap은 이진 데이터에 적합합니다.'
    },
    {
      question: 'GDS Node Similarity에서 degreeCutoff 파라미터의 역할은?',
      options: [
        '최대 연결 수 제한',
        '최소 연결 수 제한 (이웃이 적은 노드 제외)',
        '유사도 임계값 설정',
        '상위 K개 결과 제한'
      ],
      answer: 1,
      explanation: 'degreeCutoff는 최소 이웃 수입니다. 이웃이 너무 적으면 우연히 높은 유사도가 나올 수 있어 제외합니다.'
    },
    {
      question: 'Node Similarity와 KNN의 가장 큰 차이점은?',
      options: [
        'Node Similarity가 더 빠름',
        'KNN은 그래프 구조, Node Similarity는 속성 기반',
        'Node Similarity는 그래프 구조(이웃), KNN은 노드 속성 기반',
        '둘은 같은 알고리즘의 다른 이름'
      ],
      answer: 2,
      explanation: 'Node Similarity는 공유 이웃으로 유사도를 측정하고, KNN은 노드 속성 벡터로 측정합니다.'
    },
    {
      question: 'Cosine Similarity가 "크기 불변(magnitude invariant)"하다는 의미는?',
      options: [
        '노드 크기와 무관하게 동작함',
        '벡터의 길이(크기)와 무관하게 방향만 비교함',
        '그래프 크기와 무관하게 일정한 결과',
        '계산 복잡도가 데이터 크기와 무관함'
      ],
      answer: 1,
      explanation: 'Cosine은 벡터를 정규화하여 비교하므로, 평점을 많이 준 사용자와 적게 준 사용자도 공정하게 비교됩니다.'
    },
    {
      question: 'User-based CF와 Item-based CF를 조합한 추천 방식을 무엇이라 하는가?',
      options: [
        'Content-based Filtering',
        'Knowledge-based Filtering',
        'Hybrid Recommender',
        'Deep Learning Recommender'
      ],
      answer: 2,
      explanation: 'Hybrid Recommender는 여러 추천 방식을 조합하여 각 방식의 장점을 활용합니다.'
    },
    {
      question: 'KNN에서 sampleRate=0.5로 설정하면 어떤 효과가 있는가?',
      options: [
        '정확도가 50% 향상됨',
        '결과의 50%만 반환됨',
        '50%의 노드 쌍만 비교하여 성능 최적화',
        '50% 이상의 유사도만 필터링'
      ],
      answer: 2,
      explanation: 'sampleRate는 성능 최적화를 위한 샘플링 비율입니다. 대규모 그래프에서 속도를 높이지만 정확도가 약간 감소합니다.'
    },
    {
      question: '다음 중 Jaccard Similarity가 1.0이 되는 경우는?',
      options: [
        '두 집합이 완전히 다를 때',
        '한 집합이 다른 집합의 부분집합일 때',
        '두 집합이 완전히 동일할 때',
        '두 집합의 교집합이 1개일 때'
      ],
      answer: 2,
      explanation: 'Jaccard = |A∩B| / |A∪B|이므로, A=B일 때만 1.0입니다. 부분집합 관계는 Overlap에서 1.0이 됩니다.'
    }
  ]
)

// Task 11: Day 3 도전 과제
const task11Challenge = createChallengeTask(
  'w3d3-similarity-challenge',
  '소셜 미디어 콘텐츠 추천 시스템 구축',
  45,
  [
    '다중 유사도 알고리즘을 활용한 추천 시스템 설계',
    '사용자-콘텐츠-해시태그 삼중 관계 모델링',
    '실시간 추천과 배치 추천의 하이브리드 구현'
  ],
  [
    '사용자 간 팔로우 기반 유사도 (Jaccard) 계산',
    '사용자 관심 해시태그 기반 유사도 (Cosine) 계산',
    '콘텐츠 특성 벡터 기반 KNN 구현',
    '세 가지 유사도를 가중 합산한 최종 추천 점수 계산',
    '추천 결과를 RECOMMENDED 관계로 저장',
    '추천 이유(reason) 속성 포함'
  ],
  [
    '그래프 모델링의 적절성 (20%)',
    '유사도 알고리즘 선택의 타당성 (25%)',
    '하이브리드 점수 계산의 정확성 (25%)',
    '쿼리 효율성 및 최적화 (15%)',
    '추천 이유 설명의 명확성 (15%)'
  ],
  [
    '시간대별 가중치 적용 (최근 활동에 높은 가중치)',
    '콜드 스타트 문제 해결 (신규 사용자 처리)',
    'A/B 테스트를 위한 추천 버전 관리'
  ]
)

// Task 12: 시뮬레이터 실습
const task12Simulator = createSimulatorTask(
  'w3d3-similarity-simulator',
  '유사도 알고리즘 시뮬레이터',
  20,
  [
    '다양한 유사도 메트릭의 결과 비교',
    '파라미터 변경에 따른 결과 변화 관찰',
    '추천 품질 평가 지표 이해'
  ],
  'similarity-algorithms',
  `
## 시뮬레이터 사용 가이드

### 1. 유사도 비교 모드
- 동일 데이터셋에서 Jaccard, Cosine, KNN 결과 비교
- 각 알고리즘의 장단점 시각적 확인

### 2. 파라미터 튜닝
- topK, similarityCutoff, degreeCutoff 조정
- 결과 품질과 성능 트레이드오프 확인

### 3. 추천 시뮬레이션
- User-based, Item-based, Hybrid 모드 선택
- 특정 사용자에 대한 추천 결과 확인

### 4. 평가 지표
- Precision@K, Recall@K 계산
- Coverage, Diversity 측정

### 실습 과제
1. 영화 추천 데이터셋 로드
2. Jaccard vs Cosine 결과 비교
3. topK=5, 10, 20으로 변경하며 추천 품질 비교
4. 최적의 하이브리드 가중치 찾기
  `
)

// Day 3 통합
export const day3Similarity: Day = {
  slug: 'similarity-algorithms',
  title: '유사도 알고리즘 (Similarity)',
  totalDuration: 240,
  tasks: [
    task1SimilarityIntro,
    task2JaccardDeep,
    task3JaccardPractice,
    task4CosineVideo,
    task5CosineDeep,
    task6CosinePractice,
    task7NodeSimilarityVideo,
    task8KnnDeep,
    task9RecommendationPractice,
    task10Quiz
  ],
  challenge: task11Challenge
}

// ============================================
// Day 3 통계
// ============================================
// Tasks: 12개 (10 regular + 1 challenge + 1 simulator)
// 총 학습 시간: 240분 (4시간)
// 주요 토픽:
//   - Jaccard Similarity
//   - Cosine Similarity
//   - Node Similarity
//   - K-Nearest Neighbors
//   - 추천 시스템 구현
// ============================================
