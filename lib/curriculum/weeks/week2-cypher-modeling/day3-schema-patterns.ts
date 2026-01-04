// Day 3: 스키마 패턴 (좋은/나쁜 설계)
// Week 2의 셋째 날 - 설계 패턴, 안티패턴, 성능 최적화
import type { Day } from './types'

export const day3SchemaPatterns: Day = {
  slug: 'schema-patterns',
  title: '스키마 패턴 (좋은/나쁜 설계)',
  totalDuration: 220,
  tasks: [
    // ============================================
    // Task 1: Day 3 학습 목표 오버뷰
    // ============================================
    {
      id: 'day3-overview',
      type: 'reading',
      title: 'Day 3 학습 목표',
      duration: 5,
      content: {
        objectives: [
          '그래프 스키마 설계의 베스트 프랙티스를 학습한다',
          '흔히 발생하는 안티패턴을 식별하고 해결한다',
          '성능을 고려한 스키마 설계 전략을 이해한다',
          '실제 사례를 통해 패턴 적용 능력을 기른다'
        ],
        markdown: `
## Day 3: 스키마 패턴 (좋은/나쁜 설계)

### 오늘 배울 내용

Day 2에서 Object Type 설계의 기본을 배웠다면,
오늘은 **"어떻게 하면 더 좋은 스키마를 설계할 수 있는가"**를 다룹니다.

| 주제 | 핵심 개념 | 실무 영향 |
|------|----------|----------|
| **설계 패턴** | 검증된 모델링 솔루션 | 유지보수성, 확장성 |
| **안티패턴** | 피해야 할 설계 | 성능 저하, 복잡도 증가 |
| **성능 고려** | 인덱스, 카디널리티 | 쿼리 응답 시간 |
| **리팩토링** | 기존 스키마 개선 | 기술 부채 해소 |

### 왜 패턴이 중요한가?

> **"스키마는 한 번 정하면 바꾸기 어렵다."**

잘못된 스키마 설계의 비용:
- 쿼리 성능 저하 (10x ~ 100x 느려짐)
- 코드 복잡도 증가
- 확장 어려움
- 마이그레이션 비용

### 오늘 다룰 패턴

**✅ Good Patterns (배울 것)**
1. 중간 노드 패턴 (Intermediate Node)
2. 슈퍼노드 방지 패턴
3. 시간 트리 패턴 (Time Tree)
4. 버전 관리 패턴

**❌ Anti-Patterns (피할 것)**
1. 속성 폭발 (Property Explosion)
2. 일반 노드 (Generic Node)
3. 깊은 계층 구조
4. 순환 관계 미관리

### 학습 순서

1. 📹 설계 패턴 개요 (20분)
2. 📖 중간 노드 패턴 심화 (15분)
3. 📖 슈퍼노드 방지 전략 (15분)
4. 💻 패턴 적용 실습 (35분)
5. 📹 안티패턴과 해결책 (20분)
6. 💻 안티패턴 리팩토링 실습 (30분)
7. ✅ Day 3 퀴즈 (15분)
8. 🏆 Day 3 도전 과제 (30분)
        `
      }
    },

    // ============================================
    // Task 2: 설계 패턴 개요 비디오
    // ============================================
    {
      id: 'design-patterns-video',
      type: 'video',
      title: '그래프 스키마 설계 패턴',
      duration: 20,
      content: {
        objectives: [
          '주요 그래프 설계 패턴을 이해한다',
          '각 패턴의 적용 시점을 파악한다',
          '패턴 간의 트레이드오프를 이해한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=graph-design-patterns',
        transcript: `
## 그래프 스키마 설계 패턴

### 1. 중간 노드 패턴 (Intermediate Node Pattern)

**문제**: 관계에 너무 많은 속성이 필요하거나, 관계 자체를 쿼리해야 할 때

\`\`\`cypher
// ❌ Before: 관계에 많은 속성
(:Person)-[:WORKS_AT {
  startDate: date(),
  endDate: date(),
  salary: 80000000,
  department: 'Engineering',
  title: 'Senior Engineer',
  manager: 'Kim',
  performanceReviews: [...],
  benefits: [...]
}]->(:Company)

// ✅ After: 중간 노드로 분리
(:Person)-[:HAS_EMPLOYMENT]->(e:Employment {
  startDate: date('2020-01-15'),
  endDate: null,
  salary: 80000000,
  title: 'Senior Engineer'
})-[:AT_COMPANY]->(:Company)

(e)-[:IN_DEPARTMENT]->(:Department {name: 'Engineering'})
(e)-[:REPORTS_TO]->(:Person {name: 'Kim'})
\`\`\`

**장점**:
- 관계를 노드처럼 쿼리 가능
- 추가 관계 연결 가능
- 이력 관리 용이

### 2. 슈퍼노드 방지 패턴

**문제**: 한 노드에 수백만 개의 관계가 연결되면 성능 저하

\`\`\`cypher
// ❌ 슈퍼노드 문제
(:Country {name: 'Korea'})<-[:LIVES_IN]-(:Person)
// 5천만 명의 한국 거주자가 모두 이 노드와 연결!

// ✅ 해결책 1: 계층 분리
(:Person)-[:LIVES_IN]->(:City)-[:IN_PROVINCE]->(:Province)-[:IN_COUNTRY]->(:Country)

// ✅ 해결책 2: Fan-Out 노드
(:Person)-[:LIVES_IN]->(:CountryBucket {country: 'Korea', bucket: 'bucket_123'})
\`\`\`

### 3. 시간 트리 패턴 (Time Tree)

**문제**: 날짜 기반 쿼리가 많을 때 효율적인 탐색 필요

\`\`\`cypher
// 시간 트리 구조
(:Year {value: 2024})
  -[:HAS_MONTH]->(:Month {value: 1})
    -[:HAS_DAY]->(:Day {value: 15})
      -[:HAS_EVENT]->(:Event {title: 'Meeting'})

// 월별 이벤트 조회가 빠름
MATCH (y:Year {value: 2024})-[:HAS_MONTH]->(m:Month {value: 1})
      -[:HAS_DAY]->(d:Day)-[:HAS_EVENT]->(e:Event)
RETURN d.value, collect(e.title)
\`\`\`

### 4. 버전 관리 패턴

**문제**: 엔티티의 변경 이력 추적이 필요할 때

\`\`\`cypher
// 현재 버전과 이력 분리
(:Product {productId: 'P001'})
  -[:CURRENT_VERSION]->(:ProductVersion {
    version: 3,
    name: 'iPhone 15 Pro',
    price: 1500000,
    validFrom: datetime()
  })
  -[:PREVIOUS_VERSION]->(:ProductVersion {
    version: 2,
    name: 'iPhone 15 Pro',
    price: 1400000,
    validFrom: datetime('2023-09-01'),
    validTo: datetime('2024-01-01')
  })

// 현재 가격 조회
MATCH (p:Product {productId: 'P001'})-[:CURRENT_VERSION]->(v)
RETURN v.price

// 특정 시점 가격 조회
MATCH (p:Product {productId: 'P001'})-[:CURRENT_VERSION|PREVIOUS_VERSION*]->(v)
WHERE v.validFrom <= datetime('2023-10-01')
  AND (v.validTo IS NULL OR v.validTo > datetime('2023-10-01'))
RETURN v.price
\`\`\`

### 5. 태그/분류 패턴

**문제**: 유연한 분류 체계가 필요할 때

\`\`\`cypher
// 다대다 태깅
(:Article)-[:TAGGED_WITH]->(:Tag {name: 'Technology'})
(:Article)-[:TAGGED_WITH]->(:Tag {name: 'AI'})
(:Article)-[:TAGGED_WITH]->(:Tag {name: 'Business'})

// 태그 계층
(:Tag {name: 'Machine Learning'})-[:SUBCATEGORY_OF]->(:Tag {name: 'AI'})
(:Tag {name: 'AI'})-[:SUBCATEGORY_OF]->(:Tag {name: 'Technology'})
\`\`\`

### 패턴 선택 가이드

| 상황 | 권장 패턴 |
|------|----------|
| 관계에 복잡한 데이터 | 중간 노드 |
| 수백만 관계 노드 | 슈퍼노드 방지 |
| 날짜 기반 분석 | 시간 트리 |
| 변경 이력 추적 | 버전 관리 |
| 유연한 분류 | 태그 패턴 |

### 핵심 정리

1. **중간 노드**: 복잡한 관계 → 노드로 승격
2. **슈퍼노드 방지**: 계층 분리 또는 버킷팅
3. **시간 트리**: 날짜 기반 쿼리 최적화
4. **버전 관리**: 현재/이력 분리
5. **태그**: 다대다 분류에 유연성 제공
        `
      }
    },

    // ============================================
    // Task 3: 중간 노드 패턴 심화
    // ============================================
    {
      id: 'intermediate-node-deep-dive',
      type: 'reading',
      title: '중간 노드 패턴 심화',
      duration: 15,
      content: {
        objectives: [
          '중간 노드 패턴의 다양한 적용 사례를 학습한다',
          '언제 중간 노드를 도입할지 결정 기준을 이해한다',
          '구현 시 주의사항을 파악한다'
        ],
        markdown: `
## 중간 노드 패턴 심화

### 중간 노드가 필요한 신호

| 신호 | 설명 |
|------|------|
| 관계 속성 5개 이상 | 관계가 너무 복잡해짐 |
| 관계 자체를 쿼리 | "어떤 고용 관계가..." |
| 관계에 관계 필요 | 고용→부서, 고용→매니저 |
| 같은 쌍에 여러 관계 | A가 B에 여러 번 고용됨 |
| 이력 추적 필요 | 관계의 시작/종료 관리 |

### 사례 1: 고용 관계

\`\`\`cypher
// Before: 단순 관계
(:Person)-[:WORKS_AT {since: 2020, role: 'Engineer'}]->(:Company)

// 문제:
// - 한 회사에 여러 번 입사/퇴사하면?
// - 부서 이동 이력은?
// - 급여 변경 이력은?

// After: Employment 중간 노드
(:Person)-[:HAS_EMPLOYMENT]->(emp:Employment {
  startDate: date('2020-01-15'),
  endDate: null,
  initialRole: 'Junior Engineer'
})-[:AT_COMPANY]->(:Company)

(emp)-[:IN_DEPARTMENT]->(dept:Department)
(emp)-[:HAS_ROLE_HISTORY]->(role:RoleAssignment {
  title: 'Senior Engineer',
  startDate: date('2022-01-01'),
  salary: 90000000
})
\`\`\`

### 사례 2: 주문-상품 관계

\`\`\`cypher
// Before: 관계 속성으로 수량, 가격 표현
(:Order)-[:CONTAINS {quantity: 2, unitPrice: 25000, discount: 0.1}]->(:Product)

// 문제:
// - 같은 상품을 다른 조건으로 주문하면?
// - 프로모션, 쿠폰 적용 이력은?
// - 부분 환불/교환은?

// After: OrderItem 중간 노드
(:Order)-[:HAS_ITEM]->(item:OrderItem {
  quantity: 2,
  unitPrice: 25000,
  discount: 0.1,
  finalPrice: 45000,  // 계산된 값
  status: 'delivered'
})-[:FOR_PRODUCT]->(:Product)

(item)-[:APPLIED_PROMOTION]->(:Promotion {code: 'SUMMER10'})
(item)-[:REFUNDED_VIA]->(refund:Refund {amount: 22500, reason: 'defect'})
\`\`\`

### 사례 3: 투표/평가

\`\`\`cypher
// Before: 단순 관계
(:User)-[:VOTED {score: 5}]->(:Movie)

// 문제:
// - 투표 시간은?
// - 수정 이력은?
// - 투표 취소는?

// After: Vote 중간 노드
(:User)-[:CAST]->(vote:Vote {
  score: 5,
  createdAt: datetime(),
  updatedAt: datetime(),
  comment: '최고의 영화!'
})-[:FOR_MOVIE]->(:Movie)

// 투표 수정 이력
(vote)-[:PREVIOUS_VOTE]->(oldVote:Vote {
  score: 4,
  createdAt: datetime('2024-01-01')
})
\`\`\`

### 중간 노드 도입 체크리스트

\`\`\`
□ 관계 속성이 5개 이상인가?
□ 같은 두 노드 사이에 여러 관계가 가능한가?
□ 관계 자체에 대한 쿼리가 필요한가?
□ 관계에 또 다른 관계가 연결되어야 하는가?
□ 관계의 이력 추적이 필요한가?

→ 2개 이상 YES면 중간 노드 고려
\`\`\`

### 주의사항

1. **과도한 사용 금지**: 단순한 관계까지 노드로 만들면 복잡도 증가
2. **쿼리 성능**: 조인이 하나 더 늘어남을 고려
3. **일관성**: 같은 유형의 관계는 같은 패턴 적용
4. **명명**: 중간 노드는 명사로 (Employment, Vote, OrderItem)
        `
      }
    },

    // ============================================
    // Task 4: 슈퍼노드 방지 전략
    // ============================================
    {
      id: 'supernode-prevention',
      type: 'reading',
      title: '슈퍼노드 방지 전략',
      duration: 15,
      content: {
        objectives: [
          '슈퍼노드의 정의와 문제점을 이해한다',
          '슈퍼노드 방지 전략을 학습한다',
          '실제 적용 사례를 파악한다'
        ],
        markdown: `
## 슈퍼노드 방지 전략

### 슈퍼노드란?

**슈퍼노드(Supernode)**: 수백만 개 이상의 관계가 연결된 노드

\`\`\`
예시:
- (:Country {name: 'USA'}): 3억+ LIVES_IN 관계
- (:Company {name: 'Google'}): 20만+ WORKS_AT 관계
- (:Celebrity {name: 'Taylor Swift'}): 1억+ FOLLOWS 관계
\`\`\`

### 슈퍼노드의 문제

| 문제 | 설명 |
|------|------|
| **성능 저하** | 슈퍼노드 관련 쿼리 10x~100x 느림 |
| **메모리 폭발** | 관계 탐색 시 메모리 급증 |
| **락 경합** | 동시 쓰기 시 병목 |
| **불균형 분산** | 클러스터 환경에서 핫스팟 |

### 전략 1: 계층 분리 (Hierarchy)

\`\`\`cypher
// ❌ Before: 직접 연결
(:Person)-[:LIVES_IN]->(:Country {name: 'Korea'})
// 5천만 명이 하나의 Country 노드에 연결!

// ✅ After: 계층 구조로 분산
(:Person)-[:LIVES_IN]->(:City {name: 'Seoul'})
(:City)-[:IN_PROVINCE]->(:Province {name: 'Seoul'})
(:Province)-[:IN_COUNTRY]->(:Country {name: 'Korea'})

// 쿼리: 한국 거주자 수
MATCH (:Country {name: 'Korea'})<-[:IN_COUNTRY]-(:Province)
      <-[:IN_PROVINCE]-(:City)<-[:LIVES_IN]-(p:Person)
RETURN count(p)
\`\`\`

### 전략 2: 버킷팅 (Bucketing)

\`\`\`cypher
// ❌ Before: 단일 태그 노드
(:Article)-[:TAGGED_WITH]->(:Tag {name: 'Technology'})
// 100만 개 기사가 하나의 Tag에 연결!

// ✅ After: 해시 기반 버킷
(:Article {articleId: 'A12345'})-[:TAGGED_WITH]->(
  :TagBucket {
    tagName: 'Technology',
    bucketId: hash('A12345') % 100  // 0~99 버킷
  }
)

// 태그 조회 시 모든 버킷 집계
MATCH (tb:TagBucket {tagName: 'Technology'})<-[:TAGGED_WITH]-(a:Article)
RETURN count(a)
\`\`\`

### 전략 3: 팬아웃 노드 (Fan-Out)

\`\`\`cypher
// ❌ Before: 직접 팔로우
(:User)-[:FOLLOWS]->(:Celebrity)
// 유명인에게 1억 개 FOLLOWS 관계!

// ✅ After: Fan-Out 구조
(:User)-[:FOLLOWS]->(:FollowerGroup {
  targetUserId: 'celeb123',
  groupIndex: 42,
  createdAt: datetime()
})-[:FOLLOWS_TARGET]->(:User {userId: 'celeb123'})

// 팔로워 수 조회
MATCH (u:User {userId: 'celeb123'})<-[:FOLLOWS_TARGET]-(g:FollowerGroup)
RETURN count(g) * 10000 as estimatedFollowers  // 그룹당 평균 팔로워 수
\`\`\`

### 전략 4: 인덱스 + 속성 (Dense Node 회피)

\`\`\`cypher
// ❌ Before: 관계로 필터링
MATCH (:Country {name: 'Korea'})<-[:CITIZEN_OF]-(p:Person)
WHERE p.age > 20
RETURN p

// ✅ After: 속성 + 인덱스로 필터링
// 인덱스 생성
CREATE INDEX person_country_age FOR (p:Person) ON (p.country, p.age)

// 관계 대신 속성으로 조회
MATCH (p:Person)
WHERE p.country = 'Korea' AND p.age > 20
RETURN p
\`\`\`

### 슈퍼노드 식별 쿼리

\`\`\`cypher
// 관계 수가 많은 노드 찾기
MATCH (n)
WITH n, size((n)--()) as degree
WHERE degree > 10000
RETURN labels(n)[0] as label,
  n.name as nodeName,
  degree
ORDER BY degree DESC
LIMIT 10
\`\`\`

### 전략 선택 가이드

| 상황 | 권장 전략 |
|------|----------|
| 자연스러운 계층이 있음 | 계층 분리 (City → Province → Country) |
| 무작위 분산 필요 | 버킷팅 (hash 기반) |
| 쓰기 분산 필요 | 팬아웃 노드 |
| 단순 필터링만 필요 | 속성 + 인덱스 |

### 핵심 정리

1. **슈퍼노드**: 수백만 관계 → 성능 저하
2. **계층 분리**: 자연스러운 구조 활용
3. **버킷팅**: 해시로 균등 분산
4. **팬아웃**: 쓰기 부하 분산
5. **모니터링**: 관계 수 10,000 이상 노드 주시
        `
      }
    },

    // ============================================
    // Task 5: 패턴 적용 실습
    // ============================================
    {
      id: 'pattern-practice',
      type: 'code',
      title: '패턴 적용 실습',
      duration: 35,
      content: {
        objectives: [
          '중간 노드 패턴을 실제로 구현한다',
          '슈퍼노드 방지 전략을 적용한다',
          '패턴 적용 전후 성능 차이를 이해한다'
        ],
        instructions: `
## 🎯 왜 설계 패턴을 배우는가?

### 문제 상황
그래프 데이터베이스 운영 중 발생하는 문제들:
- 🐌 "인플루언서 프로필 조회가 10초씩 걸려요"
- 💥 "100만 개 댓글에 답글을 달 수가 없어요"
- 🔥 "인기 게시물 통계 쿼리가 메모리 부족으로 죽어요"

이런 문제들은 잘못된 스키마 설계에서 비롯됩니다.

### 해결책: 검증된 설계 패턴 적용
> 🏛️ **비유**: 건축 디자인 패턴
>
> "계단을 어떻게 설계하면 안전할까?" → 이미 검증된 패턴 존재
> "슈퍼노드를 어떻게 피할까?" → Fan-Out 패턴
> "복잡한 관계를 어떻게 표현할까?" → 중간 노드 패턴

---

## 실습: 설계 패턴 적용

### 시나리오: 소셜 네트워크 플랫폼

다음 요구사항을 가진 소셜 네트워크를 설계합니다:
- 사용자는 다른 사용자를 팔로우할 수 있다
- 사용자는 게시물을 작성한다
- 사용자는 게시물에 좋아요/댓글을 남긴다
- 일부 사용자는 수백만 팔로워를 가진 인플루언서다

---

### 과제 1: 기본 스키마 (문제점 식별) (15점)

아래 기본 스키마의 문제점을 식별하고 설명하세요.

\`\`\`cypher
// 기본 스키마
(:User)-[:FOLLOWS]->(:User)
(:User)-[:POSTED]->(:Post)
(:User)-[:LIKES]->(:Post)
(:User)-[:COMMENTED {text: '...', createdAt: ...}]->(:Post)
\`\`\`

---

### 과제 2: 중간 노드 패턴 적용 (30점)

댓글을 중간 노드로 분리하세요:
- Comment 노드 생성
- 댓글에 대한 답글 지원
- 댓글 좋아요 지원

---

### 과제 3: 슈퍼노드 방지 (30점)

인플루언서의 팔로워 관리를 위한 Fan-Out 패턴을 적용하세요:
- FollowerGroup 노드 도입
- 각 그룹당 최대 1000명 팔로워
- 팔로워 수 조회 쿼리 작성

---

### 과제 4: 시간 기반 쿼리 최적화 (25점)

게시물의 시간 기반 조회를 최적화하세요:
- 시간 트리 패턴 적용
- 특정 월의 게시물 조회 쿼리
- 일별 게시물 통계 쿼리
        `,
        starterCode: `// ========================================
// 📌 Step 1: 기본 스키마 문제점 분석
// ========================================

/*
문제점 1: 댓글 관계
- COMMENTED 관계에 text, createdAt 속성
- 문제: (여기에 작성)

문제점 2: 인플루언서 팔로워
- 인기 사용자에게 수백만 FOLLOWS 관계
- 문제: (여기에 작성)

문제점 3: 게시물 시간 조회
- 모든 게시물을 스캔해야 함
- 문제: (여기에 작성)
*/


// ========================================
// 📌 Step 2: Comment 노드 제약조건 생성
// ========================================

// CREATE CONSTRAINT comment_id ...

// ========================================
// 📌 Step 3: Comment 데이터 생성
// ========================================

// 샘플 유저와 포스트 먼저 생성
// CREATE (u1:User {userId: 'user1', name: 'Alice'})
// CREATE (p1:Post {postId: 'post1', content: '첫 번째 게시물'})

// Comment 생성 쿼리
// MATCH (u:User {userId: 'user1'}), (p:Post {postId: 'post1'})
// CREATE ...

// ========================================
// 📌 Step 4: 답글과 좋아요 추가
// ========================================

// 답글 추가
// MATCH (c:Comment {commentId: 'comment1'})
// CREATE ...

// 댓글 좋아요
// ...


// ========================================
// 과제 3: 슈퍼노드 방지 (FollowerGroup)
// ========================================

// FollowerGroup 노드 정의
// ...

// 팔로우 추가 함수 (새 그룹 생성 또는 기존 그룹에 추가)
// ...

// 팔로워 수 조회 쿼리
// ...


// ========================================
// 과제 4: 시간 트리 패턴
// ========================================

// 시간 트리 구조 생성
// ...

// 게시물과 시간 트리 연결
// ...

// 특정 월 게시물 조회
// ...

// 일별 게시물 통계
// ...
`,
        solutionCode: `// ========================================
// 과제 1: 기본 스키마 문제점 분석
// ========================================

/*
문제점 1: 댓글 관계
- COMMENTED 관계에 text, createdAt 속성
- 문제:
  * 댓글에 답글을 달 수 없음 (관계에 관계 연결 불가)
  * 댓글 수정/삭제 추적 어려움
  * 댓글에 좋아요를 달 수 없음

문제점 2: 인플루언서 팔로워
- 인기 사용자에게 수백만 FOLLOWS 관계
- 문제:
  * 슈퍼노드 발생 → 쿼리 성능 급락
  * 팔로워 조회 시 메모리 폭발
  * 동시 팔로우 시 락 경합

문제점 3: 게시물 시간 조회
- 모든 게시물을 스캔해야 함
- 문제:
  * 날짜 범위 쿼리 비효율
  * 인덱스만으로는 날짜 기반 집계 느림
  * 월별/일별 통계 쿼리 성능 저하
*/


// ========================================
// 과제 2: 중간 노드 패턴 (Comment)
// ========================================

// Comment 노드 제약조건
CREATE CONSTRAINT comment_id FOR (c:Comment) REQUIRE c.commentId IS UNIQUE;

// 샘플 데이터 준비
CREATE (u1:User {userId: 'user1', name: 'Alice'})
CREATE (u2:User {userId: 'user2', name: 'Bob'})
CREATE (u3:User {userId: 'user3', name: 'Charlie'})
CREATE (p1:Post {postId: 'post1', content: '첫 번째 게시물', createdAt: datetime()});

// Comment 생성
MATCH (u:User {userId: 'user2'}), (p:Post {postId: 'post1'})
CREATE (u)-[:WROTE]->(c:Comment {
  commentId: 'comment1',
  text: '좋은 게시물이네요!',
  createdAt: datetime()
})-[:ON_POST]->(p)
RETURN c;

// 답글 추가 (Comment에 Reply)
MATCH (u:User {userId: 'user3'}), (parent:Comment {commentId: 'comment1'})
CREATE (u)-[:WROTE]->(reply:Comment {
  commentId: 'comment2',
  text: '저도 동의합니다!',
  createdAt: datetime()
})-[:REPLY_TO]->(parent)
RETURN reply;

// 댓글 좋아요
MATCH (u:User {userId: 'user1'}), (c:Comment {commentId: 'comment1'})
CREATE (u)-[:LIKES {likedAt: datetime()}]->(c)
RETURN u.name, c.text;

// 게시물의 모든 댓글과 답글 조회
MATCH (p:Post {postId: 'post1'})<-[:ON_POST]-(c:Comment)<-[:WROTE]-(author:User)
OPTIONAL MATCH (c)<-[:REPLY_TO]-(reply:Comment)<-[:WROTE]-(replyAuthor:User)
RETURN c.text as comment, author.name as author,
  collect({reply: reply.text, author: replyAuthor.name}) as replies;


// ========================================
// 과제 3: 슈퍼노드 방지 (FollowerGroup)
// ========================================

// 인플루언서 생성
CREATE (influencer:User:Influencer {userId: 'celeb1', name: 'K-Pop Star', isInfluencer: true});

// FollowerGroup 제약조건
CREATE CONSTRAINT follower_group FOR (fg:FollowerGroup)
  REQUIRE (fg.targetUserId, fg.groupIndex) IS UNIQUE;

// 팔로우 추가 프로시저 (개념적 구현)
// 1. 현재 그룹 중 1000명 미만인 그룹 찾기
// 2. 없으면 새 그룹 생성
// 3. 그룹에 팔로워 추가

// 새 그룹 생성
CREATE (fg:FollowerGroup {
  targetUserId: 'celeb1',
  groupIndex: 0,
  followerCount: 0,
  createdAt: datetime()
})-[:FOLLOWS_TARGET]->(:User {userId: 'celeb1'});

// 팔로워 추가 (그룹에 공간이 있는 경우)
MATCH (follower:User {userId: 'user1'})
MATCH (fg:FollowerGroup {targetUserId: 'celeb1'})
WHERE fg.followerCount < 1000
WITH follower, fg ORDER BY fg.groupIndex LIMIT 1
CREATE (follower)-[:MEMBER_OF]->(fg)
SET fg.followerCount = fg.followerCount + 1
RETURN fg.groupIndex, fg.followerCount;

// 총 팔로워 수 조회 (효율적)
MATCH (:User {userId: 'celeb1'})<-[:FOLLOWS_TARGET]-(fg:FollowerGroup)
RETURN sum(fg.followerCount) as totalFollowers;

// 특정 사용자가 팔로우 중인지 확인
MATCH (u:User {userId: 'user1'})-[:MEMBER_OF]->(fg:FollowerGroup)
      -[:FOLLOWS_TARGET]->(target:User {userId: 'celeb1'})
RETURN count(*) > 0 as isFollowing;


// ========================================
// 과제 4: 시간 트리 패턴
// ========================================

// 시간 트리 구조 생성
CREATE (y2024:Year {value: 2024})
CREATE (m01:Month {value: 1})
CREATE (m02:Month {value: 2})
CREATE (y2024)-[:HAS_MONTH]->(m01)
CREATE (y2024)-[:HAS_MONTH]->(m02)

// 1월 일자 생성
UNWIND range(1, 31) as day
MATCH (m:Month {value: 1})
CREATE (m)-[:HAS_DAY]->(d:Day {value: day, date: date('2024-01-' +
  CASE WHEN day < 10 THEN '0' + day ELSE '' + day END)});

// 게시물과 시간 트리 연결
MATCH (p:Post {postId: 'post1'})
MATCH (d:Day {date: date(p.createdAt)})
CREATE (d)-[:HAS_POST]->(p);

// 또는 새 게시물 생성 시 자동 연결
CREATE (newPost:Post {
  postId: 'post2',
  content: '새 게시물',
  createdAt: datetime('2024-01-15T10:00:00')
})
WITH newPost
MATCH (d:Day {date: date(newPost.createdAt)})
CREATE (d)-[:HAS_POST]->(newPost)
RETURN newPost;

// 특정 월 게시물 조회 (효율적!)
MATCH (y:Year {value: 2024})-[:HAS_MONTH]->(m:Month {value: 1})
      -[:HAS_DAY]->(d:Day)-[:HAS_POST]->(p:Post)
RETURN p.postId, p.content, d.date
ORDER BY d.value;

// 일별 게시물 통계
MATCH (y:Year {value: 2024})-[:HAS_MONTH]->(m:Month {value: 1})
      -[:HAS_DAY]->(d:Day)
OPTIONAL MATCH (d)-[:HAS_POST]->(p:Post)
RETURN d.date, count(p) as postCount
ORDER BY d.date;

// 월별 게시물 추이
MATCH (y:Year {value: 2024})-[:HAS_MONTH]->(m:Month)
OPTIONAL MATCH (m)-[:HAS_DAY]->(d:Day)-[:HAS_POST]->(p:Post)
RETURN m.value as month, count(p) as postCount
ORDER BY m.value;
`,
        hints: [
          '💡 중간 노드는 관계를 노드로 승격시키는 것',
          '💡 FollowerGroup은 팔로워 1000명당 하나씩 생성',
          '💡 시간 트리는 Year → Month → Day 계층 구조',
          '💡 OPTIONAL MATCH로 데이터가 없는 경우도 처리'
        ],
        keyPoints: [
          '중간 노드 패턴: 관계에 복잡한 데이터나 추가 관계가 필요할 때 사용',
          '슈퍼노드 방지: 계층 분리, 버킷팅, Fan-Out 노드로 해결',
          '시간 트리 패턴: 날짜 기반 쿼리 성능 최적화'
        ],
        commonPitfalls: `
## 💥 Common Pitfalls (자주 하는 실수)

### 1. [과도한 중간 노드] 단순한 관계도 노드로 만들기
**증상**: 모든 관계를 Intermediate Node로 만들어 스키마가 복잡해짐

\`\`\`cypher
// ❌ 잘못된 예시: 단순 관계에 불필요한 중간 노드
(:User)-[:HAS_FOLLOW]->(:Follow {createdAt: datetime()})-[:FOLLOWS]->(:User)

// 왜 잘못되었나:
// - 단순 팔로우에는 관계 속성으로 충분
// - 조인이 늘어나 쿼리 성능 저하
// - 스키마 복잡도만 증가

// ✅ 올바른 예시: 관계 속성으로 충분한 경우
(:User)-[:FOLLOWS {createdAt: datetime()}]->(:User)
\`\`\`

💡 **기억할 점**: 관계 속성이 5개 미만이고, 관계에 관계를 연결할 필요 없으면 단순 관계 사용

---

### 2. [버킷 크기 오류] Fan-Out 그룹 크기를 너무 작게 설정
**증상**: 그룹 수가 폭증하여 관리 오버헤드 증가

\`\`\`cypher
// ❌ 잘못된 예시: 그룹당 10명으로 너무 작게 설정
(:FollowerGroup {maxSize: 10, targetUserId: 'celeb1'})
// 1억 팔로워 = 1천만 개 그룹 노드! 관리 불가

// ✅ 올바른 예시: 적절한 그룹 크기 (1000-10000)
(:FollowerGroup {maxSize: 10000, targetUserId: 'celeb1'})
// 1억 팔로워 = 1만 개 그룹 노드로 관리 가능
\`\`\`

💡 **기억할 점**: 버킷 크기는 쓰기 빈도와 읽기 패턴에 따라 1,000 ~ 10,000 사이 권장

---

### 3. [시간 트리 범위 오류] 필요 이상으로 상세한 시간 계층
**증상**: 초 단위까지 시간 트리를 만들어 노드 수 폭발

\`\`\`cypher
// ❌ 잘못된 예시: 초 단위까지 시간 트리
(:Year)-[:HAS_MONTH]->(:Month)-[:HAS_DAY]->(:Day)
  -[:HAS_HOUR]->(:Hour)-[:HAS_MINUTE]->(:Minute)-[:HAS_SECOND]->(:Second)
// 1년 = 31,536,000개 Second 노드!

// ✅ 올바른 예시: 비즈니스 요구에 맞는 수준
// 일별 집계면 Day까지, 시간별 분석이면 Hour까지
(:Year)-[:HAS_MONTH]->(:Month)-[:HAS_DAY]->(:Day)
// 1년 = 약 365개 Day 노드로 충분
\`\`\`

💡 **기억할 점**: 시간 트리 깊이는 실제 쿼리 패턴에 맞춰 최소화
`
      }
    },

    // ============================================
    // Task 6: 안티패턴과 해결책 비디오
    // ============================================
    {
      id: 'antipatterns-video',
      type: 'video',
      title: '안티패턴과 해결책',
      duration: 20,
      content: {
        objectives: [
          '흔히 발생하는 그래프 안티패턴을 식별한다',
          '각 안티패턴의 문제점과 해결책을 이해한다',
          '리팩토링 전략을 학습한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=graph-antipatterns',
        transcript: `
## 안티패턴과 해결책

### 안티패턴 1: 속성 폭발 (Property Explosion)

\`\`\`cypher
// ❌ 안티패턴: 동적 속성
(:Product {
  color_1: 'red',
  color_2: 'blue',
  color_3: 'green',
  size_S: true,
  size_M: true,
  size_L: false,
  tag_1: 'summer',
  tag_2: 'sale'
})
// 문제: 스키마 파악 불가, 쿼리 복잡

// ✅ 해결책: 관계로 분리
(:Product)-[:HAS_COLOR]->(:Color {name: 'red'})
(:Product)-[:HAS_SIZE]->(:Size {name: 'S', available: true})
(:Product)-[:TAGGED_WITH]->(:Tag {name: 'summer'})
\`\`\`

### 안티패턴 2: 일반 노드 (Generic Node)

\`\`\`cypher
// ❌ 안티패턴: 모든 것이 Entity
(:Entity {type: 'person', data: '{"name": "홍길동"}'})
(:Entity {type: 'company', data: '{"name": "ABC Corp"}'})
(:Entity)-[:RELATES_TO {type: 'works_at'}]->(:Entity)

// 문제:
// - 타입 안전성 없음
// - JSON 파싱 오버헤드
// - 인덱스 활용 불가
// - 쿼리 복잡

// ✅ 해결책: 명시적 라벨
(:Person {name: '홍길동'})
(:Company {name: 'ABC Corp'})
(:Person)-[:WORKS_AT]->(:Company)
\`\`\`

### 안티패턴 3: 깊은 계층 구조 (Deep Hierarchy)

\`\`\`cypher
// ❌ 안티패턴: 과도하게 깊은 계층
(:Category)-[:HAS_CHILD]->(:Category)-[:HAS_CHILD]->
(:Category)-[:HAS_CHILD]->(:Category)-[:HAS_CHILD]->
(:Category)-[:HAS_CHILD]->(:Category)-[:HAS_CHILD]->(:Product)
// 6단계 이상 → 조회 성능 저하

// ✅ 해결책 1: 직접 연결 추가
(:Product)-[:IN_CATEGORY]->(:Category)  // 직접 연결
(:Category)-[:HAS_ANCESTOR*]->(:Category)  // 조상 관계

// ✅ 해결책 2: Materialized Path
(:Category {
  name: 'Laptop',
  path: '/Electronics/Computers/Laptop',
  depth: 3
})
\`\`\`

### 안티패턴 4: 순환 관계 미관리

\`\`\`cypher
// ❌ 안티패턴: 순환 가능성 무시
MATCH path = (a:Person)-[:MANAGES*]->(b:Person)
WHERE a = b  // 자기 자신으로 돌아오는 순환!
// 무한 루프 또는 스택 오버플로우

// ✅ 해결책: 순환 방지 규칙
// 1. 생성 시 검증
MATCH (newManager:Person {id: $managerId})
MATCH (employee:Person {id: $employeeId})
WHERE NOT EXISTS {
  MATCH (employee)-[:MANAGES*]->(newManager)
}
CREATE (newManager)-[:MANAGES]->(employee)

// 2. 쿼리 시 깊이 제한
MATCH path = (a)-[:MANAGES*1..10]->(b)  // 최대 10단계
\`\`\`

### 안티패턴 5: 날짜를 문자열로 저장

\`\`\`cypher
// ❌ 안티패턴
(:Order {createdAt: '2024-01-15'})  // 문자열
(:Order {createdAt: '01/15/2024'})  // 다른 형식

// 문제: 비교, 정렬, 계산 불가

// ✅ 해결책: 네이티브 타입 사용
(:Order {createdAt: datetime('2024-01-15T10:30:00')})
(:Order {orderDate: date('2024-01-15')})

// 날짜 비교 가능
MATCH (o:Order)
WHERE o.createdAt > datetime('2024-01-01')
RETURN o
\`\`\`

### 안티패턴 6: 과도한 역정규화

\`\`\`cypher
// ❌ 안티패턴: 모든 데이터를 복사
(:Order {
  customerName: '홍길동',      // 고객에서 복사
  customerEmail: 'hong@...',   // 고객에서 복사
  productName: 'iPhone',       // 상품에서 복사
  productPrice: 1000000,       // 상품에서 복사
  categoryName: 'Electronics'  // 카테고리에서 복사
})

// 문제: 데이터 불일치 위험, 업데이트 복잡

// ✅ 해결책: 관계 활용
(:Order)-[:PLACED_BY]->(:Customer {name: '홍길동'})
(:Order)-[:CONTAINS]->(:Product)-[:IN_CATEGORY]->(:Category)
\`\`\`

### 리팩토링 전략

1. **점진적 마이그레이션**: 새 구조와 기존 구조 병행 → 검증 → 전환
2. **Shadow 쓰기**: 새 구조에도 함께 쓰기 → 동기화 확인
3. **Feature Flag**: 점진적으로 새 쿼리로 전환
4. **Batch 처리**: 대용량 데이터는 배치로 마이그레이션

### 핵심 정리

| 안티패턴 | 문제 | 해결책 |
|---------|------|--------|
| 속성 폭발 | 스키마 혼란 | 관계로 분리 |
| 일반 노드 | 타입 안전성 없음 | 명시적 라벨 |
| 깊은 계층 | 쿼리 성능 저하 | 직접 연결, Materialized Path |
| 순환 미관리 | 무한 루프 | 생성 검증, 깊이 제한 |
| 문자열 날짜 | 비교 불가 | 네이티브 타입 |
| 과도한 역정규화 | 불일치 | 관계 활용 |
        `
      }
    },

    // ============================================
    // Task 7: 안티패턴 리팩토링 실습
    // ============================================
    {
      id: 'antipattern-refactoring',
      type: 'code',
      title: '안티패턴 리팩토링 실습',
      duration: 30,
      content: {
        objectives: [
          '실제 안티패턴 코드를 분석한다',
          '리팩토링 스크립트를 작성한다',
          '개선된 스키마로 쿼리를 재작성한다'
        ],
        instructions: `
## 실습: 안티패턴 리팩토링

### 시나리오

레거시 시스템에서 마이그레이션된 그래프 데이터에 여러 안티패턴이 발견되었습니다.
이를 분석하고 리팩토링하세요.

---

### 과제 1: 속성 폭발 리팩토링 (30점)

아래 안티패턴을 수정하세요:

\`\`\`cypher
// 현재 상태 (안티패턴)
(:Product {
  productId: 'P001',
  name: 'T-Shirt',
  color_1: 'red',
  color_2: 'blue',
  color_3: null,
  color_4: null,
  color_5: null,
  size_XS: false,
  size_S: true,
  size_M: true,
  size_L: true,
  size_XL: false
})
\`\`\`

---

### 과제 2: 일반 노드 리팩토링 (30점)

아래 안티패턴을 수정하세요:

\`\`\`cypher
// 현재 상태 (안티패턴)
(:Entity {type: 'person', name: '홍길동', age: 30})
(:Entity {type: 'company', name: 'ABC Corp', industry: 'Tech'})
(:Entity {type: 'person'})-[:RELATION {type: 'works_at'}]->(:Entity {type: 'company'})
\`\`\`

---

### 과제 3: 순환 방지 구현 (20점)

조직도에서 순환이 발생하지 않도록 검증 로직을 추가하세요:

\`\`\`cypher
// 현재 상태
(:Employee {name: 'Alice'})-[:REPORTS_TO]->(:Employee {name: 'Bob'})
(:Employee {name: 'Bob'})-[:REPORTS_TO]->(:Employee {name: 'Charlie'})
// Charlie가 Alice에게 보고하면 순환 발생!
\`\`\`

---

### 과제 4: 개선된 쿼리 작성 (20점)

리팩토링된 스키마에서 다음 쿼리를 작성하세요:
1. 특정 색상의 모든 상품 조회
2. 특정 회사의 모든 직원 조회
3. 특정 직원의 모든 상위 보고 라인 조회
        `,
        starterCode: `// ========================================
// 과제 1: 속성 폭발 리팩토링
// ========================================

// 현재 안티패턴 데이터 (주어진 상태)
CREATE (p:Product {
  productId: 'P001',
  name: 'T-Shirt',
  color_1: 'red',
  color_2: 'blue',
  color_3: null,
  color_4: null,
  color_5: null,
  size_XS: false,
  size_S: true,
  size_M: true,
  size_L: true,
  size_XL: false
});

// 리팩토링 스크립트 작성
// 1. Color 노드 생성 및 연결
// MATCH (p:Product {productId: 'P001'})
// ...

// 2. Size 노드 생성 및 연결
// ...

// 3. 기존 속성 제거
// ...


// ========================================
// 과제 2: 일반 노드 리팩토링
// ========================================

// 현재 안티패턴 데이터 (주어진 상태)
CREATE (e1:Entity {type: 'person', name: '홍길동', age: 30})
CREATE (e2:Entity {type: 'company', name: 'ABC Corp', industry: 'Tech'})
CREATE (e1)-[:RELATION {type: 'works_at'}]->(e2);

// 리팩토링 스크립트 작성
// 1. Person 라벨 추가
// ...

// 2. Company 라벨 추가
// ...

// 3. 관계 타입 변경
// ...


// ========================================
// 과제 3: 순환 방지 구현
// ========================================

// 조직도 데이터
CREATE (alice:Employee {name: 'Alice'})
CREATE (bob:Employee {name: 'Bob'})
CREATE (charlie:Employee {name: 'Charlie'})
CREATE (alice)-[:REPORTS_TO]->(bob)
CREATE (bob)-[:REPORTS_TO]->(charlie);

// 순환 검증 쿼리: Charlie → Alice 보고 관계 추가 시도
// 순환이 발생하면 생성하지 않음
// MATCH ...
// WHERE NOT EXISTS { ... }
// CREATE ...


// ========================================
// 과제 4: 개선된 쿼리
// ========================================

// 쿼리 1: 'red' 색상의 모든 상품
// MATCH ...

// 쿼리 2: 'ABC Corp' 회사의 모든 직원
// MATCH ...

// 쿼리 3: 'Alice'의 모든 상위 보고 라인
// MATCH ...
`,
        solutionCode: `// ========================================
// 과제 1: 속성 폭발 리팩토링
// ========================================

// 현재 안티패턴 데이터
CREATE (p:Product {
  productId: 'P001',
  name: 'T-Shirt',
  color_1: 'red',
  color_2: 'blue',
  color_3: null,
  color_4: null,
  color_5: null,
  size_XS: false,
  size_S: true,
  size_M: true,
  size_L: true,
  size_XL: false
});

// 1. Color 노드 생성 (중복 방지)
MERGE (red:Color {name: 'red'})
MERGE (blue:Color {name: 'blue'});

// 2. Product와 Color 연결
MATCH (p:Product {productId: 'P001'})
MATCH (red:Color {name: 'red'})
MATCH (blue:Color {name: 'blue'})
CREATE (p)-[:HAS_COLOR]->(red)
CREATE (p)-[:HAS_COLOR]->(blue);

// 3. Size 노드 생성 및 연결
UNWIND ['XS', 'S', 'M', 'L', 'XL'] as sizeName
MERGE (s:Size {name: sizeName});

MATCH (p:Product {productId: 'P001'})
MATCH (s:Size {name: 'S'}) CREATE (p)-[:AVAILABLE_IN]->(s);
MATCH (p:Product {productId: 'P001'})
MATCH (m:Size {name: 'M'}) CREATE (p)-[:AVAILABLE_IN]->(m);
MATCH (p:Product {productId: 'P001'})
MATCH (l:Size {name: 'L'}) CREATE (p)-[:AVAILABLE_IN]->(l);

// 4. 기존 속성 제거
MATCH (p:Product {productId: 'P001'})
REMOVE p.color_1, p.color_2, p.color_3, p.color_4, p.color_5,
       p.size_XS, p.size_S, p.size_M, p.size_L, p.size_XL;


// ========================================
// 과제 2: 일반 노드 리팩토링
// ========================================

// 현재 안티패턴 데이터
CREATE (e1:Entity {type: 'person', name: '홍길동', age: 30})
CREATE (e2:Entity {type: 'company', name: 'ABC Corp', industry: 'Tech'})
CREATE (e1)-[:RELATION {type: 'works_at'}]->(e2);

// 1. Person 라벨 추가 및 Entity 제거
MATCH (e:Entity)
WHERE e.type = 'person'
SET e:Person
REMOVE e:Entity, e.type;

// 2. Company 라벨 추가 및 Entity 제거
MATCH (e:Entity)
WHERE e.type = 'company'
SET e:Company
REMOVE e:Entity, e.type;

// 3. 관계 타입 변경 (RELATION → WORKS_AT)
MATCH (p:Person)-[old:RELATION {type: 'works_at'}]->(c:Company)
CREATE (p)-[:WORKS_AT]->(c)
DELETE old;

// 검증
MATCH (p:Person)-[:WORKS_AT]->(c:Company)
RETURN p.name, c.name;


// ========================================
// 과제 3: 순환 방지 구현
// ========================================

// 조직도 데이터
CREATE (alice:Employee {name: 'Alice'})
CREATE (bob:Employee {name: 'Bob'})
CREATE (charlie:Employee {name: 'Charlie'})
CREATE (alice)-[:REPORTS_TO]->(bob)
CREATE (bob)-[:REPORTS_TO]->(charlie);

// 순환 검증 쿼리: Charlie → Alice 보고 관계 추가 시도
// 순환이 발생하면 생성하지 않음
MATCH (newSubordinate:Employee {name: 'Alice'})
MATCH (newManager:Employee {name: 'Charlie'})
WHERE NOT EXISTS {
  MATCH (newSubordinate)-[:REPORTS_TO*]->(newManager)
}
CREATE (newManager)-[:REPORTS_TO]->(newSubordinate)
RETURN 'Created' as result;
// 결과: 순환 경로가 존재하므로 생성되지 않음

// 순환 여부 확인 쿼리
MATCH (a:Employee)-[:REPORTS_TO*]->(b:Employee)
WHERE a = b
RETURN a.name as cyclicEmployee;

// 안전한 관계 추가 (순환 없는 경우)
MATCH (newSubordinate:Employee {name: 'Charlie'})  // Charlie가
MATCH (newManager:Employee {name: 'Alice'})         // Alice에게 보고? → 순환!
OPTIONAL MATCH cyclePath = (newSubordinate)-[:REPORTS_TO*]->(newManager)
WITH newSubordinate, newManager, cyclePath
WHERE cyclePath IS NULL  // 순환 경로가 없을 때만
CREATE (newManager)-[:REPORTS_TO]->(newSubordinate)
RETURN CASE WHEN cyclePath IS NULL THEN 'Created' ELSE 'Blocked: Cycle detected' END;


// ========================================
// 과제 4: 개선된 쿼리
// ========================================

// 쿼리 1: 'red' 색상의 모든 상품
MATCH (p:Product)-[:HAS_COLOR]->(c:Color {name: 'red'})
RETURN p.productId, p.name, collect(c.name) as colors;

// 색상별 상품 수
MATCH (c:Color)<-[:HAS_COLOR]-(p:Product)
RETURN c.name as color, count(p) as productCount
ORDER BY productCount DESC;

// 쿼리 2: 'ABC Corp' 회사의 모든 직원
MATCH (c:Company {name: 'ABC Corp'})<-[:WORKS_AT]-(p:Person)
RETURN p.name, p.age;

// 회사별 직원 통계
MATCH (c:Company)<-[:WORKS_AT]-(p:Person)
RETURN c.name, count(p) as employeeCount, avg(p.age) as avgAge;

// 쿼리 3: 'Alice'의 모든 상위 보고 라인
MATCH path = (e:Employee {name: 'Alice'})-[:REPORTS_TO*]->(manager)
RETURN [node IN nodes(path) | node.name] as reportingChain,
       length(path) as levels;

// 전체 조직도 트리
MATCH path = (e:Employee)-[:REPORTS_TO*0..]->(top:Employee)
WHERE NOT (top)-[:REPORTS_TO]->()  // 최상위만
RETURN e.name as employee,
       [node IN nodes(path)[1..] | node.name] as managers,
       length(path) as level
ORDER BY level, e.name;
`,
        hints: [
          '💡 MERGE로 중복 노드 생성 방지',
          '💡 SET으로 라벨 추가, REMOVE로 라벨/속성 제거',
          '💡 NOT EXISTS { }로 특정 패턴이 없는지 확인',
          '💡 순환 검사는 *를 사용해 모든 경로 확인'
        ],
        keyPoints: [
          '속성 폭발: 동적 속성을 별도 노드로 분리하여 관계로 연결',
          '일반 노드: Entity {type: "..."} 대신 명시적 라벨 사용',
          '순환 방지: 관계 생성 전 NOT EXISTS로 순환 경로 검증'
        ],
        commonPitfalls: `
## 💥 Common Pitfalls (자주 하는 실수)

### 1. [라벨 변경 순서] 기존 라벨 제거 전 새 라벨 미추가
**증상**: 라벨 없는 "고아 노드" 발생, 인덱스 쿼리 불가

\`\`\`cypher
// ❌ 잘못된 예시: 라벨 제거 먼저, 추가 나중
MATCH (e:Entity {type: 'person'})
REMOVE e:Entity
// 이 시점에 노드에 라벨이 없음!
SET e:Person

// ✅ 올바른 예시: 새 라벨 먼저 추가, 기존 라벨 나중 제거
MATCH (e:Entity {type: 'person'})
SET e:Person
REMOVE e:Entity, e.type
\`\`\`

💡 **기억할 점**: SET으로 라벨 추가 후 REMOVE로 기존 라벨 제거

---

### 2. [순환 검증 범위] 깊이 제한 없이 순환 검사
**증상**: 대규모 그래프에서 순환 검사가 너무 오래 걸림

\`\`\`cypher
// ❌ 잘못된 예시: 무제한 깊이 탐색
WHERE NOT EXISTS {
  MATCH (a)-[:REPORTS_TO*]->(b)  // 전체 그래프 탐색!
}

// ✅ 올바른 예시: 합리적인 깊이 제한
WHERE NOT EXISTS {
  MATCH (a)-[:REPORTS_TO*1..20]->(b)  // 최대 20단계까지만
}
\`\`\`

💡 **기억할 점**: 조직도 깊이가 보통 10단계 이내이므로 실용적 제한 설정

---

### 3. [관계 타입 변경] APOC 없이 관계 타입 변경 시도
**증상**: 순수 Cypher로 관계 타입 변경 불가

\`\`\`cypher
// ❌ 잘못된 예시: 관계 타입 직접 변경 (불가능)
MATCH (p)-[r:RELATION {type: 'works_at'}]->(c)
SET type(r) = 'WORKS_AT'  // ERROR: 관계 타입은 변경 불가

// ✅ 올바른 예시: 새 관계 생성 후 기존 삭제
MATCH (p)-[old:RELATION {type: 'works_at'}]->(c)
CREATE (p)-[:WORKS_AT]->(c)
DELETE old
\`\`\`

💡 **기억할 점**: 관계 타입은 변경 불가, 새로 생성 후 기존 삭제 필요
`
      }
    },

    // ============================================
    // Task 8: Day 3 퀴즈
    // ============================================
    {
      id: 'day3-quiz',
      type: 'quiz',
      title: 'Day 3 퀴즈: 스키마 패턴',
      duration: 15,
      content: {
        questions: [
          {
            question: '중간 노드 패턴(Intermediate Node)을 적용해야 하는 상황은?',
            options: [
              '노드에 속성이 많을 때',
              '관계에 복잡한 데이터가 있거나 관계 자체를 쿼리해야 할 때',
              '쿼리 성능을 향상시키고 싶을 때',
              '노드 수를 줄이고 싶을 때'
            ],
            answer: 1,
            explanation: '중간 노드 패턴은 관계에 많은 속성이 있거나, 관계 자체를 노드처럼 쿼리해야 할 때, 또는 관계에 다른 관계를 연결해야 할 때 사용합니다.'
          },
          {
            question: '슈퍼노드(Supernode)의 문제점이 아닌 것은?',
            options: [
              '쿼리 성능 저하',
              '메모리 사용량 증가',
              '데이터 무결성 문제',
              '동시 쓰기 시 락 경합'
            ],
            answer: 2,
            explanation: '슈퍼노드는 성능과 동시성 문제를 일으키지만, 데이터 무결성 자체에는 영향을 주지 않습니다.'
          },
          {
            question: '속성 폭발(Property Explosion) 안티패턴의 해결책은?',
            options: [
              '인덱스 추가',
              '동적 속성을 관계로 분리',
              '더 많은 속성 추가',
              'JSON 문자열로 저장'
            ],
            answer: 1,
            explanation: 'color_1, color_2 같은 동적 속성은 별도 노드(Color)로 분리하고 관계로 연결하는 것이 좋습니다.'
          },
          {
            question: '시간 트리 패턴의 장점은?',
            options: [
              '저장 공간 절약',
              '날짜 범위 쿼리와 시간 기반 집계 성능 향상',
              '관계 수 감소',
              '스키마 단순화'
            ],
            answer: 1,
            explanation: '시간 트리 패턴은 Year → Month → Day 계층 구조를 통해 날짜 기반 쿼리와 집계를 효율적으로 수행할 수 있게 합니다.'
          },
          {
            question: '순환 관계를 방지하는 방법으로 적절한 것은?',
            options: [
              '모든 관계를 양방향으로 만든다',
              '관계 생성 전 순환 경로 존재 여부를 검증한다',
              '관계 속성에 깊이를 저장한다',
              '순환은 방지할 수 없다'
            ],
            answer: 1,
            explanation: 'NOT EXISTS { MATCH (a)-[:RELATION*]->(b) }와 같은 패턴으로 관계 생성 전에 순환 경로가 있는지 검증할 수 있습니다.'
          },
          {
            question: '일반 노드(Generic Node) 안티패턴 (:Entity {type: "person"})의 문제점은?',
            options: [
              '저장 공간 낭비',
              '타입 안전성 없음, 인덱스 활용 불가, 쿼리 복잡',
              '관계 설정 불가',
              '성능 문제 없음'
            ],
            answer: 1,
            explanation: '일반 노드는 라벨 기반 쿼리 최적화를 활용할 수 없고, 스키마가 명확하지 않아 유지보수가 어렵습니다.'
          }
        ]
      }
    },

    // ============================================
    // Task 9: Day 3 도전 과제
    // ============================================
    {
      id: 'day3-challenge',
      type: 'challenge',
      title: 'Day 3 도전 과제: 레거시 스키마 리팩토링',
      duration: 30,
      content: {
        objectives: [
          '복잡한 레거시 스키마를 분석한다',
          '여러 안티패턴을 식별한다',
          '종합적인 리팩토링 계획을 수립하고 실행한다'
        ],
        requirements: [
          '**주어진 레거시 스키마**에서 최소 3개의 안티패턴 식별',
          '각 안티패턴에 대한 **문제점 설명**',
          '**리팩토링 스크립트** 작성 (단계별)',
          '**검증 쿼리** 작성 (리팩토링 전후 비교)',
          '**개선된 스키마**로 비즈니스 쿼리 3개 작성'
        ],
        evaluationCriteria: [
          '안티패턴을 정확히 식별했는가? (25%)',
          '문제점 분석이 정확한가? (15%)',
          '리팩토링 스크립트가 올바른가? (25%)',
          '검증 쿼리가 충분한가? (15%)',
          '개선된 쿼리가 효율적인가? (20%)'
        ],
        bonusPoints: [
          '성능 비교 분석 (쿼리 실행 계획 또는 예상) (+10점)',
          '마이그레이션 롤백 스크립트 (+10점)',
          '추가 패턴 적용 (시간 트리, 버전 관리 등) (+15점)',
          '문서화 (Before/After 다이어그램) (+10점)'
        ]
      }
    },

    // ============================================
    // Task 10: 실습 마무리
    // ============================================
    {
      id: 'day3-simulator',
      type: 'simulator',
      title: '실습: 패턴 적용 및 검증',
      duration: 10,
      content: {
        objectives: [
          'Cypher Playground에서 패턴을 적용한다',
          '안티패턴 리팩토링을 실습한다',
          'Knowledge Graph Visualizer로 결과를 확인한다'
        ],
        simulatorId: 'cypher-playground',
        instructions: `
## Day 3 실습 마무리

### Cypher Playground에서 실습

1. **패턴 적용**
   - 중간 노드 패턴: Comment 노드 구현
   - 슈퍼노드 방지: FollowerGroup 구현
   - 시간 트리: 게시물 시간 인덱싱

2. **안티패턴 리팩토링**
   - 속성 폭발 → 관계로 분리
   - 일반 노드 → 명시적 라벨
   - 순환 방지 쿼리 테스트

3. **Knowledge Graph Visualizer로 확인**
   - 리팩토링 전후 구조 비교
   - 관계 패턴 시각화

### 체크포인트

- [ ] 중간 노드 패턴 최소 1개 구현
- [ ] 슈퍼노드 방지 구조 이해
- [ ] 안티패턴 2개 이상 리팩토링
- [ ] 개선된 쿼리 작성 및 테스트
        `
      }
    }
  ]
}
