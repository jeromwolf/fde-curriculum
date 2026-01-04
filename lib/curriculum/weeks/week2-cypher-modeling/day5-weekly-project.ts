// Day 5: 주간 프로젝트 - 비즈니스 도메인 그래프 설계
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
// DAY 5: 주간 프로젝트 - 비즈니스 도메인 그래프 스키마 설계 및 APOC 활용
// =============================================================================

const projectOverviewContent = `# Day 5: 주간 프로젝트 - 비즈니스 도메인 그래프 설계

## 프로젝트 개요

이번 주에 배운 모든 내용을 종합하여 실제 비즈니스 도메인의
그래프 스키마를 설계하고 구현하는 프로젝트입니다.

### 학습 목표

1. **Cypher 고급 쿼리** (Day 1) 활용
   - 가변 길이 경로로 관계 탐색
   - WITH 파이프라인으로 복잡한 분석
   - 집계 함수로 비즈니스 인사이트 도출

2. **Object Type 설계** (Day 2) 적용
   - Palantir 스타일 도메인 모델링
   - Property vs Relationship 결정
   - 일관된 네이밍 컨벤션

3. **스키마 패턴** (Day 3) 활용
   - Intermediate Node 패턴
   - Supernode 방지 전략
   - 안티패턴 회피

4. **APOC 라이브러리** (Day 4) 통합
   - 외부 데이터 로드
   - 텍스트 정제 파이프라인
   - 배치 처리로 대용량 데이터 핸들링

## 프로젝트 주제

다음 중 하나를 선택하세요:

### Option A: 이커머스 플랫폼 (권장)
- 고객, 제품, 주문, 리뷰, 카테고리
- 추천 시스템을 위한 관계 모델링
- 재고 관리와 공급망

### Option B: 금융 네트워크
- 계좌, 거래, 고객, 지점
- 사기 탐지를 위한 패턴 분석
- 규제 준수 (KYC/AML)

### Option C: 소셜 네트워크
- 사용자, 게시물, 댓글, 좋아요
- 인플루언서 분석
- 커뮤니티 탐지

### Option D: 의료 데이터 (고급)
- 환자, 의사, 진단, 처방, 검사
- FHIR 표준 참조
- 환자 여정 분석

## 프로젝트 단계

\`\`\`
Phase 1: 요구사항 분석 (1시간)
├── 비즈니스 시나리오 정의
├── 핵심 질문 5개 도출
└── 데이터 소스 파악

Phase 2: 스키마 설계 (1.5시간)
├── Object Type 정의
├── 관계 모델링
├── 속성 설계
└── 인덱스 전략

Phase 3: 데이터 로드 (1시간)
├── APOC으로 외부 데이터 로드
├── 텍스트 정제 파이프라인
└── 배치 처리 구현

Phase 4: 쿼리 개발 (1.5시간)
├── 핵심 질문별 Cypher 쿼리
├── 성능 최적화
└── 결과 분석

Phase 5: 문서화 (30분)
├── 스키마 다이어그램
├── 쿼리 설명
└── 개선 제안
\`\`\`

## 평가 기준

| 영역 | 배점 | 평가 항목 |
|------|------|----------|
| 스키마 설계 | 30% | Object Type, 관계, 패턴 적용 |
| 데이터 로드 | 20% | APOC 활용, 에러 핸들링 |
| 쿼리 개발 | 30% | 정확성, 효율성, 가독성 |
| 문서화 | 20% | 명확성, 완성도 |

## 준비물

- Neo4j Desktop 또는 Aura
- APOC 플러그인 설치
- 샘플 데이터 (JSON/CSV)
- 이 프로젝트 가이드

시작해볼까요? 먼저 요구사항 분석부터 시작합니다!
`

const requirementsAnalysisContent = `# Phase 1: 요구사항 분석

## 이커머스 플랫폼 시나리오 (Option A)

### 비즈니스 배경

"ShopGraph"는 온라인 쇼핑몰로, 고객 행동 분석과 개인화 추천을 위해
그래프 데이터베이스 도입을 결정했습니다.

### 현재 상황

- 월간 활성 고객: 100,000명
- 제품 수: 50,000개
- 일일 주문: 5,000건
- 리뷰: 200,000개
- 카테고리: 500개 (3단계 계층)

### 핵심 비즈니스 질문

그래프 DB로 답해야 할 5가지 핵심 질문:

\`\`\`
Q1. 특정 고객에게 어떤 제품을 추천해야 하는가?
    → "이 제품을 산 고객이 함께 구매한 상품"
    → "비슷한 취향의 고객이 높게 평가한 상품"

Q2. 어떤 제품이 교차 판매에 효과적인가?
    → 함께 구매되는 빈도가 높은 제품 쌍
    → 카테고리 간 교차 구매 패턴

Q3. VIP 고객은 누구이며, 어떤 특성이 있는가?
    → 구매 금액, 빈도, 리뷰 활동
    → VIP 고객의 구매 패턴

Q4. 특정 카테고리의 인기 트렌드는?
    → 시간별 판매량 변화
    → 카테고리 간 이동 패턴

Q5. 사기 주문을 어떻게 탐지하는가?
    → 비정상적인 구매 패턴
    → 동일 IP/카드에서 다량 주문
\`\`\`

### 데이터 소스

\`\`\`json
// customers.json
{
  "customers": [
    {
      "id": "C001",
      "name": "김철수",
      "email": "kim@example.com",
      "joinDate": "2022-01-15",
      "tier": "gold"
    }
  ]
}

// products.json
{
  "products": [
    {
      "id": "P001",
      "name": "스마트폰 케이스",
      "price": 15000,
      "categoryPath": ["전자제품", "모바일", "액세서리"]
    }
  ]
}

// orders.json
{
  "orders": [
    {
      "id": "O001",
      "customerId": "C001",
      "items": [
        {"productId": "P001", "quantity": 2, "price": 30000}
      ],
      "totalAmount": 30000,
      "orderDate": "2024-01-10T14:30:00Z"
    }
  ]
}

// reviews.json
{
  "reviews": [
    {
      "id": "R001",
      "customerId": "C001",
      "productId": "P001",
      "rating": 5,
      "text": "정말 좋은 제품입니다!",
      "date": "2024-01-11"
    }
  ]
}
\`\`\`

## 요구사항 체크리스트

### 기능 요구사항

- [ ] 고객별 구매 이력 조회
- [ ] 제품별 리뷰 통계
- [ ] 카테고리 계층 탐색
- [ ] 협업 필터링 추천
- [ ] 함께 구매한 상품 분석
- [ ] VIP 고객 식별
- [ ] 시간대별 판매 분석

### 비기능 요구사항

- [ ] 실시간 추천 응답 (< 100ms)
- [ ] 일일 배치 데이터 로드
- [ ] 100만 노드 이상 확장성
- [ ] 데이터 무결성 보장

### 제약 조건

- Neo4j Community Edition
- APOC Core만 사용 가능
- 외부 API 연동 없음 (파일 기반)

이제 스키마 설계 단계로 넘어갑시다!
`

const schemaDesignVideoTranscript = `
안녕하세요! 이제 요구사항을 바탕으로 스키마를 설계해보겠습니다.

먼저 핵심 엔티티를 식별합니다.
Customer, Product, Order, Review, Category 다섯 가지가 핵심입니다.

각 엔티티를 Object Type으로 정의해볼까요?

Customer는 고객 정보를 담습니다.
id, name, email, joinDate, tier 속성이 필요합니다.
tier는 bronze, silver, gold, platinum 중 하나입니다.

Product는 제품 정보입니다.
id, name, price, description 그리고 재고 관련 속성도 넣을 수 있겠네요.

Order는 주문 정보인데, 여기서 중요한 설계 결정이 필요합니다.
주문과 제품의 관계를 어떻게 모델링할까요?

첫 번째 방법은 Order 노드에 items 배열을 저장하는 것입니다.
하지만 이건 안티패턴이에요. 왜냐하면 "어떤 제품이 가장 많이 팔렸나?"
같은 쿼리가 어려워지기 때문입니다.

두 번째 방법은 OrderItem이라는 Intermediate Node를 만드는 것입니다.
Order에서 OrderItem으로 CONTAINS 관계,
OrderItem에서 Product로 FOR_PRODUCT 관계를 연결합니다.
이렇게 하면 수량, 가격 같은 정보를 OrderItem에 저장할 수 있습니다.

Category는 계층 구조입니다.
PARENT_OF 관계로 자기 참조 구조를 만들거나,
Category 간에 SUBCATEGORY_OF 관계를 만들 수 있습니다.

Review는 Customer와 Product 사이의 Intermediate Node로 볼 수 있습니다.
Customer가 WROTE 관계로 Review를 연결하고,
Review가 FOR_PRODUCT 관계로 Product를 연결합니다.

이제 관계를 정리해볼까요?

Customer -[PLACED]-> Order
Order -[CONTAINS]-> OrderItem
OrderItem -[FOR_PRODUCT]-> Product
Product -[IN_CATEGORY]-> Category
Category -[PARENT_OF]-> Category (자기 참조)
Customer -[WROTE]-> Review
Review -[FOR_PRODUCT]-> Product

이 설계의 장점을 설명드리겠습니다.

첫째, Intermediate Node 패턴을 사용해서 다대다 관계에서도
관계 속성을 쉽게 관리할 수 있습니다.

둘째, 추천 쿼리가 자연스럽습니다.
"이 제품을 산 고객이 다른 어떤 제품을 샀나?"를 표현하기 쉽습니다.

셋째, 카테고리 계층 탐색이 Cypher의 가변 길이 경로로 가능합니다.

다음으로 인덱스 전략을 세워봅시다!
`

const schemaDesignPracticeInstructions = `# Phase 2: 스키마 설계 실습

## 과제 1: Object Type 정의

이커머스 도메인의 5개 핵심 엔티티를 Cypher 제약조건으로 정의하세요.

### 요구사항

1. **Customer** - 고객
   - 필수 속성: id (고유), name, email, joinDate
   - 선택 속성: tier, totalPurchase

2. **Product** - 제품
   - 필수 속성: id (고유), name, price
   - 선택 속성: description, stockQuantity

3. **Order** - 주문
   - 필수 속성: id (고유), orderDate, totalAmount
   - 선택 속성: status, shippingAddress

4. **OrderItem** - 주문 항목 (Intermediate Node)
   - 필수 속성: quantity, unitPrice
   - 계산 속성: subtotal (quantity * unitPrice)

5. **Category** - 카테고리
   - 필수 속성: id (고유), name, level
   - 선택 속성: description

### 힌트

\`\`\`cypher
// 제약조건 예시
CREATE CONSTRAINT customer_id_unique
FOR (c:Customer) REQUIRE c.id IS UNIQUE;

// 인덱스 예시
CREATE INDEX customer_email_index
FOR (c:Customer) ON (c.email);
\`\`\`

## 과제 2: 관계 모델링

다음 관계를 정의하고 샘플 데이터를 생성하세요.

### 관계 목록

| 시작 노드 | 관계 | 종료 노드 | 관계 속성 |
|-----------|------|-----------|-----------|
| Customer | PLACED | Order | - |
| Order | CONTAINS | OrderItem | - |
| OrderItem | FOR_PRODUCT | Product | - |
| Product | IN_CATEGORY | Category | - |
| Category | PARENT_OF | Category | - |
| Customer | WROTE | Review | - |
| Review | FOR_PRODUCT | Product | - |
| Customer | VIEWED | Product | viewedAt, duration |
| Customer | ADDED_TO_CART | Product | addedAt |

### 샘플 데이터 생성

\`\`\`cypher
// 카테고리 계층 생성
CREATE (root:Category {id: 'C0', name: '전체', level: 0})
CREATE (electronics:Category {id: 'C1', name: '전자제품', level: 1})
CREATE (mobile:Category {id: 'C2', name: '모바일', level: 2})
CREATE (accessories:Category {id: 'C3', name: '액세서리', level: 3})

CREATE (root)-[:PARENT_OF]->(electronics)
CREATE (electronics)-[:PARENT_OF]->(mobile)
CREATE (mobile)-[:PARENT_OF]->(accessories)

// 제품 생성
CREATE (p1:Product {id: 'P001', name: '스마트폰 케이스', price: 15000})
CREATE (p2:Product {id: 'P002', name: '무선 이어폰', price: 89000})
CREATE (p3:Product {id: 'P003', name: '충전 케이블', price: 12000})

CREATE (p1)-[:IN_CATEGORY]->(accessories)
CREATE (p2)-[:IN_CATEGORY]->(mobile)
CREATE (p3)-[:IN_CATEGORY]->(accessories)

// 고객 생성
CREATE (c1:Customer {id: 'C001', name: '김철수', email: 'kim@example.com', tier: 'gold'})
CREATE (c2:Customer {id: 'C002', name: '이영희', email: 'lee@example.com', tier: 'silver'})

// 주문 생성 (Intermediate Node 패턴)
CREATE (o1:Order {id: 'O001', orderDate: date('2024-01-10'), totalAmount: 119000})
CREATE (oi1:OrderItem {quantity: 2, unitPrice: 15000})
CREATE (oi2:OrderItem {quantity: 1, unitPrice: 89000})

CREATE (c1)-[:PLACED]->(o1)
CREATE (o1)-[:CONTAINS]->(oi1)
CREATE (o1)-[:CONTAINS]->(oi2)
CREATE (oi1)-[:FOR_PRODUCT]->(p1)
CREATE (oi2)-[:FOR_PRODUCT]->(p2)

// 리뷰 생성
CREATE (r1:Review {id: 'R001', rating: 5, text: '정말 좋아요!', date: date('2024-01-11')})
CREATE (c1)-[:WROTE]->(r1)
CREATE (r1)-[:FOR_PRODUCT]->(p1)
\`\`\`

## 과제 3: 인덱스 전략

쿼리 성능을 위한 인덱스를 설계하세요.

### 분석해야 할 쿼리 패턴

1. 고객 ID로 주문 조회
2. 제품 이름으로 검색
3. 카테고리별 제품 목록
4. 날짜 범위 주문 조회
5. 평점 높은 제품 조회

### 인덱스 유형

\`\`\`cypher
// 고유 제약조건 (자동 인덱스 생성)
CREATE CONSTRAINT product_id_unique
FOR (p:Product) REQUIRE p.id IS UNIQUE

// 범위 검색용 인덱스
CREATE INDEX order_date_index
FOR (o:Order) ON (o.orderDate)

// 전문 검색용 (APOC 또는 Full-text)
CREATE FULLTEXT INDEX product_search
FOR (p:Product) ON EACH [p.name, p.description]
\`\`\`
`

const schemaDesignStarterCode = `// ============================================
// 이커머스 그래프 스키마 설계 실습
// ============================================

// 과제 1: 제약조건 정의
// TODO: 5개 Object Type에 대한 고유 제약조건 생성

// Customer 제약조건


// Product 제약조건


// Order 제약조건


// Category 제약조건


// Review 제약조건



// 과제 2: 인덱스 생성
// TODO: 성능 최적화를 위한 인덱스 생성

// 이메일 검색용 인덱스


// 주문 날짜 범위 검색용 인덱스


// 제품명 전문 검색용 인덱스



// 과제 3: 샘플 데이터 생성
// TODO: 카테고리 계층, 제품, 고객, 주문, 리뷰 생성

// 카테고리 계층 (3단계)


// 제품 (최소 5개)


// 고객 (최소 3명)


// 주문 (Intermediate Node 패턴 사용)


// 리뷰 (최소 3개)
`

const schemaDesignSolutionCode = `// ============================================
// 이커머스 그래프 스키마 설계 - 정답
// ============================================

// ===== 과제 1: 제약조건 정의 =====

// Customer 제약조건
CREATE CONSTRAINT customer_id_unique IF NOT EXISTS
FOR (c:Customer) REQUIRE c.id IS UNIQUE;

// Product 제약조건
CREATE CONSTRAINT product_id_unique IF NOT EXISTS
FOR (p:Product) REQUIRE p.id IS UNIQUE;

// Order 제약조건
CREATE CONSTRAINT order_id_unique IF NOT EXISTS
FOR (o:Order) REQUIRE o.id IS UNIQUE;

// Category 제약조건
CREATE CONSTRAINT category_id_unique IF NOT EXISTS
FOR (cat:Category) REQUIRE cat.id IS UNIQUE;

// Review 제약조건
CREATE CONSTRAINT review_id_unique IF NOT EXISTS
FOR (r:Review) REQUIRE r.id IS UNIQUE;


// ===== 과제 2: 인덱스 생성 =====

// 이메일 검색용 인덱스
CREATE INDEX customer_email_index IF NOT EXISTS
FOR (c:Customer) ON (c.email);

// 주문 날짜 범위 검색용 인덱스
CREATE INDEX order_date_index IF NOT EXISTS
FOR (o:Order) ON (o.orderDate);

// 제품 가격 범위 검색용 인덱스
CREATE INDEX product_price_index IF NOT EXISTS
FOR (p:Product) ON (p.price);

// 카테고리 레벨 인덱스
CREATE INDEX category_level_index IF NOT EXISTS
FOR (cat:Category) ON (cat.level);

// 제품명 전문 검색용 인덱스
CREATE FULLTEXT INDEX product_search IF NOT EXISTS
FOR (p:Product) ON EACH [p.name, p.description];


// ===== 과제 3: 샘플 데이터 생성 =====

// 카테고리 계층 (3단계)
CREATE (root:Category {id: 'CAT-ROOT', name: '전체', level: 0})
CREATE (electronics:Category {id: 'CAT-ELEC', name: '전자제품', level: 1})
CREATE (fashion:Category {id: 'CAT-FASH', name: '패션', level: 1})
CREATE (mobile:Category {id: 'CAT-MOB', name: '모바일', level: 2})
CREATE (laptop:Category {id: 'CAT-LAP', name: '노트북', level: 2})
CREATE (accessories:Category {id: 'CAT-ACC', name: '액세서리', level: 3})

CREATE (root)-[:PARENT_OF]->(electronics)
CREATE (root)-[:PARENT_OF]->(fashion)
CREATE (electronics)-[:PARENT_OF]->(mobile)
CREATE (electronics)-[:PARENT_OF]->(laptop)
CREATE (mobile)-[:PARENT_OF]->(accessories)


// 제품 (5개)
CREATE (p1:Product {
  id: 'PROD-001',
  name: '프리미엄 스마트폰 케이스',
  price: 25000,
  description: '충격 방지 기능의 고급 케이스',
  stockQuantity: 100
})
CREATE (p2:Product {
  id: 'PROD-002',
  name: '무선 블루투스 이어폰',
  price: 89000,
  description: '노이즈 캔슬링 지원',
  stockQuantity: 50
})
CREATE (p3:Product {
  id: 'PROD-003',
  name: '고속 충전 케이블 (2m)',
  price: 15000,
  description: 'USB-C to USB-C, 100W 지원',
  stockQuantity: 200
})
CREATE (p4:Product {
  id: 'PROD-004',
  name: '경량 노트북 파우치',
  price: 35000,
  description: '14인치 노트북용',
  stockQuantity: 80
})
CREATE (p5:Product {
  id: 'PROD-005',
  name: '무선 마우스',
  price: 45000,
  description: 'Bluetooth 5.0, 저소음',
  stockQuantity: 120
})

CREATE (p1)-[:IN_CATEGORY]->(accessories)
CREATE (p2)-[:IN_CATEGORY]->(mobile)
CREATE (p3)-[:IN_CATEGORY]->(accessories)
CREATE (p4)-[:IN_CATEGORY]->(laptop)
CREATE (p5)-[:IN_CATEGORY]->(laptop)


// 고객 (3명)
CREATE (c1:Customer {
  id: 'CUST-001',
  name: '김철수',
  email: 'kim@example.com',
  joinDate: date('2022-01-15'),
  tier: 'gold',
  totalPurchase: 580000
})
CREATE (c2:Customer {
  id: 'CUST-002',
  name: '이영희',
  email: 'lee@example.com',
  joinDate: date('2023-03-20'),
  tier: 'silver',
  totalPurchase: 230000
})
CREATE (c3:Customer {
  id: 'CUST-003',
  name: '박민수',
  email: 'park@example.com',
  joinDate: date('2024-01-05'),
  tier: 'bronze',
  totalPurchase: 45000
})


// 주문 (Intermediate Node 패턴)
// 주문 1: 김철수의 주문
CREATE (o1:Order {
  id: 'ORD-001',
  orderDate: date('2024-01-10'),
  totalAmount: 139000,
  status: 'delivered'
})
CREATE (oi1a:OrderItem {quantity: 2, unitPrice: 25000})
CREATE (oi1b:OrderItem {quantity: 1, unitPrice: 89000})

CREATE (c1)-[:PLACED]->(o1)
CREATE (o1)-[:CONTAINS]->(oi1a)
CREATE (o1)-[:CONTAINS]->(oi1b)
CREATE (oi1a)-[:FOR_PRODUCT]->(p1)
CREATE (oi1b)-[:FOR_PRODUCT]->(p2)

// 주문 2: 이영희의 주문
CREATE (o2:Order {
  id: 'ORD-002',
  orderDate: date('2024-01-15'),
  totalAmount: 104000,
  status: 'delivered'
})
CREATE (oi2a:OrderItem {quantity: 1, unitPrice: 89000})
CREATE (oi2b:OrderItem {quantity: 1, unitPrice: 15000})

CREATE (c2)-[:PLACED]->(o2)
CREATE (o2)-[:CONTAINS]->(oi2a)
CREATE (o2)-[:CONTAINS]->(oi2b)
CREATE (oi2a)-[:FOR_PRODUCT]->(p2)
CREATE (oi2b)-[:FOR_PRODUCT]->(p3)


// 리뷰 (3개)
CREATE (r1:Review {
  id: 'REV-001',
  rating: 5,
  text: '케이스 품질이 정말 좋습니다. 추천합니다!',
  date: date('2024-01-11')
})
CREATE (c1)-[:WROTE]->(r1)
CREATE (r1)-[:FOR_PRODUCT]->(p1)

CREATE (r2:Review {
  id: 'REV-002',
  rating: 4,
  text: '이어폰 음질 좋아요. 배터리가 조금 아쉽네요.',
  date: date('2024-01-12')
})
CREATE (c1)-[:WROTE]->(r2)
CREATE (r2)-[:FOR_PRODUCT]->(p2)

CREATE (r3:Review {
  id: 'REV-003',
  rating: 5,
  text: '빠른 충전! 완전 만족합니다.',
  date: date('2024-01-16')
})
CREATE (c2)-[:WROTE]->(r3)
CREATE (r3)-[:FOR_PRODUCT]->(p3)


// 행동 데이터 (VIEWED, ADDED_TO_CART)
CREATE (c1)-[:VIEWED {viewedAt: datetime('2024-01-09T10:30:00'), duration: 120}]->(p1)
CREATE (c1)-[:VIEWED {viewedAt: datetime('2024-01-09T10:35:00'), duration: 90}]->(p2)
CREATE (c1)-[:ADDED_TO_CART {addedAt: datetime('2024-01-09T10:40:00')}]->(p1)
CREATE (c1)-[:ADDED_TO_CART {addedAt: datetime('2024-01-09T10:41:00')}]->(p2)

CREATE (c3)-[:VIEWED {viewedAt: datetime('2024-01-20T14:00:00'), duration: 45}]->(p5)
CREATE (c3)-[:ADDED_TO_CART {addedAt: datetime('2024-01-20T14:05:00')}]->(p5)
`

const dataLoadingContent = `# Phase 3: APOC을 활용한 데이터 로드

## 외부 데이터 로드 파이프라인

실제 프로젝트에서는 JSON, CSV 파일이나 API에서 데이터를 로드합니다.
APOC을 사용하여 효율적인 데이터 파이프라인을 구축합니다.

## 1. JSON 데이터 로드

### 고객 데이터 로드

\`\`\`cypher
// customers.json 로드
CALL apoc.load.json('file:///customers.json') YIELD value
UNWIND value.customers AS customer

// 텍스트 정제
WITH customer,
     apoc.text.trim(customer.name) AS cleanName,
     apoc.text.lowerCase(customer.email) AS cleanEmail

// 중복 방지 MERGE
MERGE (c:Customer {id: customer.id})
SET c.name = cleanName,
    c.email = cleanEmail,
    c.joinDate = date(customer.joinDate),
    c.tier = coalesce(customer.tier, 'bronze'),
    c.updatedAt = datetime()

RETURN count(c) AS customersLoaded
\`\`\`

### 제품 데이터 로드 (카테고리 연결 포함)

\`\`\`cypher
// products.json 로드
CALL apoc.load.json('file:///products.json') YIELD value
UNWIND value.products AS product

// 제품 생성
MERGE (p:Product {id: product.id})
SET p.name = apoc.text.trim(product.name),
    p.price = toFloat(product.price),
    p.description = product.description,
    p.updatedAt = datetime()

// 카테고리 경로 처리
WITH p, product.categoryPath AS path
WHERE path IS NOT NULL AND size(path) > 0

// 마지막 카테고리와 연결
WITH p, path[size(path)-1] AS leafCategory
MATCH (cat:Category {name: leafCategory})
MERGE (p)-[:IN_CATEGORY]->(cat)

RETURN count(p) AS productsLoaded
\`\`\`

## 2. 주문 데이터 로드 (Intermediate Node 패턴)

\`\`\`cypher
// orders.json 로드
CALL apoc.load.json('file:///orders.json') YIELD value
UNWIND value.orders AS order

// 고객 찾기
MATCH (c:Customer {id: order.customerId})

// 주문 생성
CREATE (o:Order {
  id: order.id,
  orderDate: datetime(order.orderDate),
  totalAmount: toFloat(order.totalAmount),
  status: coalesce(order.status, 'pending')
})
CREATE (c)-[:PLACED]->(o)

// 주문 항목 처리
WITH o, order.items AS items
UNWIND items AS item

// 제품 찾기
MATCH (p:Product {id: item.productId})

// OrderItem 생성 (Intermediate Node)
CREATE (oi:OrderItem {
  quantity: toInteger(item.quantity),
  unitPrice: toFloat(item.price)
})
CREATE (o)-[:CONTAINS]->(oi)
CREATE (oi)-[:FOR_PRODUCT]->(p)

RETURN count(DISTINCT o) AS ordersLoaded
\`\`\`

## 3. 배치 처리로 대용량 데이터 로드

### 10만 고객 로드

\`\`\`cypher
CALL apoc.periodic.iterate(
  // 소스: CSV 로드
  'CALL apoc.load.csv("file:///customers_large.csv") YIELD map RETURN map',

  // 실행: 고객 생성
  'MERGE (c:Customer {id: map.id})
   SET c.name = apoc.text.trim(map.name),
       c.email = apoc.text.lowerCase(map.email),
       c.joinDate = date(map.joinDate),
       c.tier = coalesce(map.tier, "bronze")',

  {batchSize: 5000, parallel: false}
) YIELD batches, total, timeTaken
RETURN "Loaded " + total + " customers in " + timeTaken + "ms"
\`\`\`

### 50만 주문 로드

\`\`\`cypher
CALL apoc.periodic.iterate(
  'CALL apoc.load.csv("file:///orders_large.csv") YIELD map RETURN map',

  'MATCH (c:Customer {id: map.customerId})
   CREATE (o:Order {
     id: map.orderId,
     orderDate: date(map.orderDate),
     totalAmount: toFloat(map.amount)
   })
   CREATE (c)-[:PLACED]->(o)',

  {batchSize: 10000, parallel: false}
) YIELD total, timeTaken
RETURN total, timeTaken
\`\`\`

## 4. 데이터 정제 파이프라인

### 이름 정규화

\`\`\`cypher
CALL apoc.periodic.iterate(
  'MATCH (c:Customer) WHERE c.name IS NOT NULL RETURN c',

  'SET c.name = apoc.text.capitalizeAll(
     apoc.text.trim(
       apoc.text.replace(c.name, "\\\\s+", " ")
     )
   )',

  {batchSize: 10000, parallel: true}
)
\`\`\`

### 이메일 정규화

\`\`\`cypher
CALL apoc.periodic.iterate(
  'MATCH (c:Customer) WHERE c.email IS NOT NULL RETURN c',

  'SET c.email = apoc.text.lowerCase(apoc.text.trim(c.email)),
       c.emailDomain = apoc.text.split(c.email, "@")[1]',

  {batchSize: 10000, parallel: true}
)
\`\`\`

### 카테고리 레벨 자동 계산

\`\`\`cypher
// 루트 카테고리 레벨 설정
MATCH (root:Category)
WHERE NOT (root)<-[:PARENT_OF]-()
SET root.level = 0

// 하위 카테고리 레벨 전파
CALL apoc.periodic.iterate(
  'MATCH path = (parent:Category)-[:PARENT_OF*]->(child:Category)
   WHERE parent.level IS NOT NULL AND child.level IS NULL
   RETURN child, parent',

  'SET child.level = parent.level + 1',

  {batchSize: 1000, parallel: false, iterateList: true}
)
\`\`\`

## 5. 데이터 검증

\`\`\`cypher
// 필수 속성 검증
MATCH (c:Customer)
WHERE c.id IS NULL OR c.email IS NULL
RETURN "Invalid Customer" AS issue, count(c) AS count

UNION ALL

MATCH (p:Product)
WHERE p.id IS NULL OR p.price IS NULL
RETURN "Invalid Product" AS issue, count(p) AS count

UNION ALL

MATCH (o:Order)
WHERE NOT (o)<-[:PLACED]-(:Customer)
RETURN "Orphan Order" AS issue, count(o) AS count
\`\`\`
`

const queryDevelopmentContent = `# Phase 4: 핵심 비즈니스 쿼리 개발

## 핵심 질문에 대한 Cypher 쿼리

### Q1. 협업 필터링 추천

**"이 제품을 산 고객이 함께 구매한 상품"**

\`\`\`cypher
// 특정 제품을 산 고객이 함께 구매한 다른 제품 추천
MATCH (target:Product {id: 'PROD-001'})

// 이 제품을 산 고객 찾기
MATCH (target)<-[:FOR_PRODUCT]-(:OrderItem)<-[:CONTAINS]-(:Order)<-[:PLACED]-(c:Customer)

// 그 고객이 산 다른 제품 찾기
MATCH (c)-[:PLACED]->(:Order)-[:CONTAINS]->(:OrderItem)-[:FOR_PRODUCT]->(other:Product)
WHERE other <> target

// 함께 구매된 빈도 집계
WITH other, count(DISTINCT c) AS coCustomers

// 상위 5개 추천
ORDER BY coCustomers DESC
LIMIT 5

RETURN other.name AS recommendedProduct,
       coCustomers AS sharedCustomers
\`\`\`

**"비슷한 취향의 고객이 높게 평가한 상품"**

\`\`\`cypher
// 특정 고객과 구매 패턴이 비슷한 고객 찾기
MATCH (me:Customer {id: 'CUST-001'})

// 내가 산 제품
MATCH (me)-[:PLACED]->(:Order)-[:CONTAINS]->(:OrderItem)-[:FOR_PRODUCT]->(myProduct:Product)
WITH me, collect(DISTINCT myProduct) AS myProducts

// 비슷한 제품을 산 다른 고객
MATCH (other:Customer)-[:PLACED]->(:Order)-[:CONTAINS]->(:OrderItem)-[:FOR_PRODUCT]->(p:Product)
WHERE other <> me AND p IN myProducts
WITH me, myProducts, other, count(p) AS overlap
WHERE overlap >= 2  // 최소 2개 이상 겹침

// 비슷한 고객이 높게 평가한 제품
MATCH (other)-[:WROTE]->(r:Review)-[:FOR_PRODUCT]->(rec:Product)
WHERE NOT rec IN myProducts AND r.rating >= 4

RETURN rec.name AS recommendedProduct,
       avg(r.rating) AS avgRating,
       count(DISTINCT other) AS recommenders
ORDER BY recommenders DESC, avgRating DESC
LIMIT 10
\`\`\`

### Q2. 교차 판매 분석

**"함께 구매되는 빈도가 높은 제품 쌍"**

\`\`\`cypher
// 같은 주문에 함께 포함된 제품 쌍
MATCH (o:Order)-[:CONTAINS]->(oi1:OrderItem)-[:FOR_PRODUCT]->(p1:Product)
MATCH (o)-[:CONTAINS]->(oi2:OrderItem)-[:FOR_PRODUCT]->(p2:Product)
WHERE id(p1) < id(p2)  // 중복 방지

WITH p1, p2, count(DISTINCT o) AS coOccurrence

// 최소 3번 이상 함께 구매
WHERE coOccurrence >= 3

RETURN p1.name AS product1,
       p2.name AS product2,
       coOccurrence AS purchasedTogether
ORDER BY coOccurrence DESC
LIMIT 10
\`\`\`

### Q3. VIP 고객 분석

**"VIP 고객 식별 (RFM 분석)"**

\`\`\`cypher
// RFM: Recency, Frequency, Monetary
MATCH (c:Customer)
OPTIONAL MATCH (c)-[:PLACED]->(o:Order)

WITH c,
     // Recency: 마지막 주문 후 경과일
     duration.inDays(max(o.orderDate), date()).days AS recency,
     // Frequency: 총 주문 횟수
     count(o) AS frequency,
     // Monetary: 총 구매 금액
     sum(o.totalAmount) AS monetary

WHERE frequency > 0

// 각 지표 기준 점수 (1-5점)
WITH c, recency, frequency, monetary,
     CASE
       WHEN recency <= 30 THEN 5
       WHEN recency <= 60 THEN 4
       WHEN recency <= 90 THEN 3
       WHEN recency <= 180 THEN 2
       ELSE 1
     END AS R,
     CASE
       WHEN frequency >= 10 THEN 5
       WHEN frequency >= 7 THEN 4
       WHEN frequency >= 4 THEN 3
       WHEN frequency >= 2 THEN 2
       ELSE 1
     END AS F,
     CASE
       WHEN monetary >= 1000000 THEN 5
       WHEN monetary >= 500000 THEN 4
       WHEN monetary >= 200000 THEN 3
       WHEN monetary >= 100000 THEN 2
       ELSE 1
     END AS M

// RFM 총점
WITH c, recency, frequency, monetary, R, F, M, (R + F + M) AS rfmScore

// VIP: 12점 이상
WHERE rfmScore >= 12

RETURN c.name AS customer,
       c.tier AS currentTier,
       recency AS daysSinceLastOrder,
       frequency AS totalOrders,
       monetary AS totalSpent,
       rfmScore AS vipScore
ORDER BY rfmScore DESC
\`\`\`

### Q4. 카테고리 트렌드 분석

**"카테고리별 월간 판매 추이"**

\`\`\`cypher
// 최근 6개월 카테고리별 판매량
MATCH (o:Order)-[:CONTAINS]->(oi:OrderItem)-[:FOR_PRODUCT]->(p:Product)
MATCH (p)-[:IN_CATEGORY]->(cat:Category)
WHERE o.orderDate >= date() - duration('P6M')

WITH cat.name AS category,
     o.orderDate.year AS year,
     o.orderDate.month AS month,
     sum(oi.quantity) AS unitsSold,
     sum(oi.quantity * oi.unitPrice) AS revenue

RETURN category, year, month, unitsSold, revenue
ORDER BY category, year, month
\`\`\`

### Q5. 이상 패턴 탐지

**"비정상적인 구매 패턴 탐지"**

\`\`\`cypher
// 단일 주문에서 비정상적으로 많은 수량
MATCH (c:Customer)-[:PLACED]->(o:Order)-[:CONTAINS]->(oi:OrderItem)
WITH c, o, sum(oi.quantity) AS totalItems

// 고객별 평균 주문 수량 계산
MATCH (c)-[:PLACED]->(allOrders:Order)-[:CONTAINS]->(allItems:OrderItem)
WITH c, o, totalItems,
     avg(toFloat(sum(allItems.quantity))) AS avgItems,
     stDev(toFloat(sum(allItems.quantity))) AS stdItems

// 평균 + 3 표준편차 초과
WHERE totalItems > avgItems + 3 * stdItems

RETURN c.name AS customer,
       o.id AS orderId,
       totalItems AS itemsInOrder,
       avgItems AS customerAverage,
       "Unusual quantity" AS alertType
\`\`\`

## 쿼리 성능 최적화

### EXPLAIN으로 실행 계획 확인

\`\`\`cypher
EXPLAIN
MATCH (c:Customer {id: 'CUST-001'})-[:PLACED]->(o:Order)
RETURN o
\`\`\`

### PROFILE로 실제 성능 측정

\`\`\`cypher
PROFILE
MATCH (c:Customer)-[:PLACED]->(o:Order)-[:CONTAINS]->(oi:OrderItem)
WHERE o.orderDate >= date('2024-01-01')
RETURN c.name, count(oi) AS items
ORDER BY items DESC
LIMIT 10
\`\`\`

### 인덱스 활용 확인

\`\`\`cypher
// 인덱스 사용 여부 확인
CALL db.indexes() YIELD name, type, labelsOrTypes, properties
RETURN *
\`\`\`
`

const documentationContent = `# Phase 5: 문서화

## 프로젝트 문서화 가이드

좋은 문서화는 프로젝트의 가치를 높입니다.
다음 템플릿을 참고하여 문서를 작성하세요.

## 1. 스키마 문서

### 스키마 다이어그램 (ASCII)

\`\`\`
                    ┌──────────────┐
                    │   Customer   │
                    │   (고객)      │
                    └──────┬───────┘
                           │ PLACED
                           ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Category   │◄───│    Order     │───►│    Review    │
│   (카테고리)  │    │   (주문)      │    │   (리뷰)     │
└──────────────┘    └──────┬───────┘    └──────┬───────┘
       ▲                   │ CONTAINS           │
       │ IN_CATEGORY       ▼                    │ FOR_PRODUCT
       │            ┌──────────────┐            │
       │            │  OrderItem   │            │
       │            │ (주문 항목)   │            │
       │            └──────┬───────┘            │
       │                   │ FOR_PRODUCT        │
       │                   ▼                    │
       │            ┌──────────────┐            │
       └────────────│   Product    │◄───────────┘
                    │   (제품)      │
                    └──────────────┘
\`\`\`

### Object Type 정의

| Object Type | 설명 | 핵심 속성 | 인덱스 |
|-------------|------|----------|--------|
| Customer | 고객 정보 | id, name, email, tier | id (unique), email |
| Product | 제품 정보 | id, name, price | id (unique), name (fulltext) |
| Order | 주문 정보 | id, orderDate, totalAmount | id (unique), orderDate |
| OrderItem | 주문 항목 | quantity, unitPrice | - |
| Category | 카테고리 | id, name, level | id (unique) |
| Review | 리뷰 | id, rating, text, date | id (unique) |

### 관계 정의

| 관계 | 시작 → 종료 | 설명 | 속성 |
|------|-------------|------|------|
| PLACED | Customer → Order | 고객이 주문함 | - |
| CONTAINS | Order → OrderItem | 주문에 항목 포함 | - |
| FOR_PRODUCT | OrderItem → Product | 항목이 제품 참조 | - |
| IN_CATEGORY | Product → Category | 제품 카테고리 | - |
| PARENT_OF | Category → Category | 상위 카테고리 | - |
| WROTE | Customer → Review | 고객이 리뷰 작성 | - |
| FOR_PRODUCT | Review → Product | 리뷰 대상 제품 | - |
| VIEWED | Customer → Product | 고객이 제품 조회 | viewedAt, duration |

## 2. 쿼리 문서

### 핵심 쿼리 목록

| ID | 쿼리명 | 설명 | 예상 성능 |
|----|--------|------|----------|
| Q1 | 협업 필터링 추천 | 함께 구매한 상품 | < 50ms |
| Q2 | 교차 판매 분석 | 제품 쌍 빈도 | < 200ms |
| Q3 | VIP 고객 분석 | RFM 점수 계산 | < 100ms |
| Q4 | 카테고리 트렌드 | 월간 판매 추이 | < 500ms |
| Q5 | 이상 패턴 탐지 | 비정상 주문 | < 300ms |

### 쿼리 사용 예시

\`\`\`markdown
## Q1: 협업 필터링 추천

### 용도
특정 제품 페이지에서 "이 상품을 구매한 고객이 함께 구매한 상품" 표시

### 입력 파라미터
- productId: 대상 제품 ID (예: 'PROD-001')

### 출력
- recommendedProduct: 추천 제품명
- sharedCustomers: 공통 구매 고객 수

### 성능
- 평균 응답 시간: 35ms
- 최대 결과 수: 5개
\`\`\`

## 3. 개선 제안

### 즉시 개선 가능

1. **복합 인덱스 추가**
   \`\`\`cypher
   CREATE INDEX order_date_status FOR (o:Order) ON (o.orderDate, o.status)
   \`\`\`

2. **캐싱 레이어 도입**
   - 인기 추천 결과 Redis 캐싱
   - TTL: 1시간

### 중기 개선 계획

1. **그래프 알고리즘 도입**
   - PageRank로 인기 제품 점수화
   - Community Detection으로 고객 세그먼트

2. **시계열 최적화**
   - Time Tree 패턴 적용
   - 날짜별 인덱스 파티셔닝

### 장기 로드맵

1. **Neo4j GDS 라이브러리**
   - 고급 추천 알고리즘
   - 유사도 계산 최적화

2. **스트리밍 통합**
   - Kafka 연동
   - 실시간 그래프 업데이트
`

const finalQuizQuestions = [
  {
    question: '이커머스 도메인에서 주문과 제품의 관계를 모델링할 때 Intermediate Node를 사용하는 이유는?',
    options: [
      '쿼리 성능 향상',
      '수량, 가격 같은 관계 속성 저장',
      '데이터 중복 감소',
      '인덱스 활용 최적화'
    ],
    answer: 1,
    explanation: 'OrderItem Intermediate Node를 사용하면 주문별 수량, 단가 등의 속성을 저장할 수 있습니다. 단순 PURCHASED 관계로는 이런 정보를 담을 수 없습니다.'
  },
  {
    question: 'APOC을 사용하여 대용량 CSV를 로드할 때 권장되는 방법은?',
    options: [
      'LOAD CSV를 직접 사용',
      'apoc.load.csv와 apoc.periodic.iterate 조합',
      'apoc.export.csv 사용',
      'CREATE 문으로 수동 입력'
    ],
    answer: 1,
    explanation: 'apoc.periodic.iterate와 함께 사용하면 배치 단위로 트랜잭션을 분할하여 메모리 문제 없이 대용량 데이터를 로드할 수 있습니다.'
  },
  {
    question: '협업 필터링 추천 쿼리에서 "이 제품을 산 고객이 함께 구매한 상품"을 찾기 위한 패턴은?',
    options: [
      '(product)<-[:PURCHASED]-(customer)-[:PURCHASED]->(other)',
      '(product)<-[:FOR_PRODUCT]-(:OrderItem)<-[:CONTAINS]-(:Order)<-[:PLACED]-(customer)',
      '(product)-[:SIMILAR_TO]->(other)',
      '(product)<-[:REVIEWED]-(customer)-[:REVIEWED]->(other)'
    ],
    answer: 1,
    explanation: 'Intermediate Node(OrderItem)를 통해 제품 → 주문 항목 → 주문 → 고객 경로를 역추적한 후, 같은 고객의 다른 구매를 찾습니다.'
  },
  {
    question: 'RFM 분석에서 각 요소의 의미는?',
    options: [
      'Revenue, Frequency, Marketing',
      'Recency, Frequency, Monetary',
      'Rating, Feedback, Membership',
      'Return, Fee, Margin'
    ],
    answer: 1,
    explanation: 'RFM은 Recency(최근성), Frequency(구매 빈도), Monetary(구매 금액)의 약자로, 고객 가치를 측정하는 마케팅 분석 기법입니다.'
  },
  {
    question: '카테고리 계층 구조에서 모든 하위 카테고리를 찾는 쿼리에 사용할 패턴은?',
    options: [
      '(parent)-[:PARENT_OF]->(child)',
      '(parent)-[:PARENT_OF*]->(descendant)',
      '(parent)<-[:CHILD_OF]-(child)',
      '(parent)-[:HAS_CATEGORY]->(child)'
    ],
    answer: 1,
    explanation: '가변 길이 경로 [:PARENT_OF*]를 사용하면 모든 깊이의 하위 카테고리를 한 번에 찾을 수 있습니다.'
  },
  {
    question: '그래프 스키마 설계에서 Property Explosion 안티패턴을 피하는 방법은?',
    options: [
      '모든 정보를 속성으로 저장',
      '연관 데이터를 별도 노드로 분리',
      '인덱스를 많이 생성',
      '관계에만 속성 저장'
    ],
    answer: 1,
    explanation: '배열이나 동적 키를 속성으로 저장하면 쿼리가 어려워집니다. 별도 노드로 분리하여 관계로 연결하는 것이 그래프 패턴에 맞습니다.'
  },
  {
    question: 'Cypher 쿼리 성능을 분석할 때 사용하는 키워드는?',
    options: [
      'ANALYZE와 DESCRIBE',
      'EXPLAIN과 PROFILE',
      'DEBUG와 TRACE',
      'SHOW와 INDEX'
    ],
    answer: 1,
    explanation: 'EXPLAIN은 예상 실행 계획을, PROFILE은 실제 실행 결과와 성능 지표를 보여줍니다.'
  },
  {
    question: '교차 판매 분석에서 중복 제품 쌍을 방지하기 위한 조건은?',
    options: [
      'p1.id <> p2.id',
      'id(p1) < id(p2)',
      'p1.name < p2.name',
      'NOT (p1)--(p2)'
    ],
    answer: 1,
    explanation: 'id(p1) < id(p2) 조건을 사용하면 (A,B)와 (B,A)를 중복 없이 한 쌍만 선택합니다. Neo4j 내부 ID를 비교하는 효율적인 방법입니다.'
  }
]

const projectChallengeContent = {
  objectives: [
    '실제 비즈니스 도메인의 그래프 스키마 설계',
    'APOC을 활용한 데이터 파이프라인 구축',
    '핵심 비즈니스 질문에 대한 Cypher 쿼리 개발',
    '성능 최적화 및 문서화'
  ],
  requirements: [
    '최소 5개 Object Type 정의 (제약조건 포함)',
    '최소 8개 관계 유형 정의',
    'Intermediate Node 패턴 1개 이상 적용',
    'APOC 데이터 로드 파이프라인 구현',
    '핵심 비즈니스 쿼리 5개 개발',
    '스키마 다이어그램 및 쿼리 문서 작성'
  ],
  evaluationCriteria: [
    '스키마 설계의 적절성 - 패턴 적용, 안티패턴 회피 (30%)',
    '데이터 파이프라인 - APOC 활용, 에러 핸들링 (20%)',
    '쿼리 품질 - 정확성, 효율성, 가독성 (30%)',
    '문서화 - 명확성, 완성도, 개선 제안 (20%)'
  ],
  bonusPoints: [
    'GDS 알고리즘 활용 (PageRank, Community Detection)',
    '실시간 데이터 업데이트 메커니즘',
    'A/B 테스트 설계',
    '벤치마크 테스트 결과 포함'
  ]
}

// Day 5 완성
export const day5WeeklyProject: Day = {
  slug: 'weekly-project',
  title: '주간 프로젝트: 비즈니스 도메인 그래프 설계',
  totalDuration: 360, // 6시간
  tasks: [
    // Task 1: 프로젝트 개요
    createReadingTask(
      'project-overview',
      '프로젝트 개요 및 학습 목표',
      20,
      [
        '주간 학습 내용 종합',
        '프로젝트 주제 선택',
        '평가 기준 이해'
      ],
      projectOverviewContent
    ),

    // Task 2: 요구사항 분석
    createReadingTask(
      'requirements-analysis',
      'Phase 1: 요구사항 분석',
      30,
      [
        '비즈니스 시나리오 이해',
        '핵심 질문 도출',
        '데이터 소스 파악'
      ],
      requirementsAnalysisContent
    ),

    // Task 3: 스키마 설계 영상
    createVideoTask(
      'schema-design-video',
      '스키마 설계 가이드',
      20,
      [
        'Object Type 식별 방법',
        'Intermediate Node 패턴 적용',
        '관계 모델링 전략'
      ],
      'https://example.com/schema-design-guide',
      schemaDesignVideoTranscript
    ),

    // Task 4: 스키마 설계 실습
    createCodeTask(
      'schema-design-practice',
      'Phase 2: 스키마 설계 실습',
      60,
      [
        '제약조건 및 인덱스 정의',
        '관계 모델링 구현',
        '샘플 데이터 생성'
      ],
      schemaDesignPracticeInstructions,
      schemaDesignStarterCode,
      schemaDesignSolutionCode,
      [
        'IF NOT EXISTS를 사용하면 중복 생성 에러 방지',
        'MERGE는 중복 방지, CREATE는 항상 생성',
        'Intermediate Node는 속성을 가진 관계에 사용'
      ],
      `
## 💥 Common Pitfalls (자주 하는 실수)

### 1. [제약조건 순서] 데이터 로드 후 제약조건 생성
**증상**: 중복 데이터로 인해 제약조건 생성 실패

\`\`\`cypher
// ❌ 잘못된 예시: 데이터 먼저, 제약조건 나중
CREATE (c1:Customer {id: 'C001', name: 'Kim'})
CREATE (c2:Customer {id: 'C001', name: 'Lee'})  // 중복 ID

CREATE CONSTRAINT customer_id FOR (c:Customer) REQUIRE c.id IS UNIQUE
// ERROR: 이미 중복 데이터 존재!

// ✅ 올바른 예시: 제약조건 먼저, 데이터 나중
CREATE CONSTRAINT customer_id FOR (c:Customer) REQUIRE c.id IS UNIQUE

CREATE (c1:Customer {id: 'C001', name: 'Kim'})  // 성공
CREATE (c2:Customer {id: 'C001', name: 'Lee'})  // 즉시 에러로 차단
\`\`\`

💡 **기억할 점**: 스키마 정의(제약조건, 인덱스) → 데이터 로드 순서 필수

---

### 2. [Intermediate Node ID] OrderItem에 고유 ID 미부여
**증상**: 특정 주문 항목을 직접 조회하거나 업데이트할 수 없음

\`\`\`cypher
// ❌ 잘못된 예시: OrderItem에 ID 없음
CREATE (oi:OrderItem {quantity: 2, unitPrice: 25000})
// 나중에 이 OrderItem만 찾으려면?

// ✅ 올바른 예시: Intermediate Node에도 고유 ID
CREATE (oi:OrderItem {
  id: 'OI-' + randomUUID(),  // 고유 식별자
  quantity: 2,
  unitPrice: 25000
})

// 직접 조회 가능
MATCH (oi:OrderItem {id: 'OI-xxx'})
SET oi.quantity = 3
\`\`\`

💡 **기억할 점**: 모든 노드에 고유 ID 부여 (randomUUID() 또는 시퀀스)

---

### 3. [카테고리 계층 방향] PARENT_OF vs CHILD_OF 혼동
**증상**: 하위 카테고리 조회 쿼리 방향 오류

\`\`\`cypher
// ❌ 잘못된 예시: 방향 혼동
// PARENT_OF: 부모 → 자식
(Electronics)-[:PARENT_OF]->(Mobile)

// 하위 카테고리 조회 시
MATCH (root:Category {name: 'Electronics'})<-[:PARENT_OF*]-(child)
// 결과: 없음! 방향이 반대

// ✅ 올바른 예시: 방향 명확히 이해
// PARENT_OF: 부모 → 자식 방향
MATCH (root:Category {name: 'Electronics'})-[:PARENT_OF*]->(child)
// 결과: Mobile, Accessories 등 모든 하위 카테고리
\`\`\`

💡 **기억할 점**: 관계 방향은 일관되게, 쿼리 시 화살표 방향 확인
`
    ),

    // Task 5: 데이터 로드
    createReadingTask(
      'data-loading',
      'Phase 3: APOC 데이터 로드',
      40,
      [
        'JSON/CSV 데이터 로드',
        '배치 처리 구현',
        '데이터 정제 파이프라인'
      ],
      dataLoadingContent
    ),

    // Task 6: 쿼리 개발
    createReadingTask(
      'query-development',
      'Phase 4: 핵심 비즈니스 쿼리',
      50,
      [
        '협업 필터링 추천',
        'VIP 고객 분석 (RFM)',
        '이상 패턴 탐지'
      ],
      queryDevelopmentContent
    ),

    // Task 7: 문서화
    createReadingTask(
      'documentation',
      'Phase 5: 프로젝트 문서화',
      20,
      [
        '스키마 다이어그램 작성',
        '쿼리 문서화',
        '개선 제안'
      ],
      documentationContent
    ),

    // Task 8: 종합 퀴즈
    createQuizTask(
      'weekly-quiz',
      'Week 2 종합 퀴즈',
      25,
      finalQuizQuestions
    ),

    // Task 9: 최종 프로젝트 챌린지
    createChallengeTask(
      'final-project-challenge',
      '최종 프로젝트 제출',
      60,
      projectChallengeContent.objectives,
      projectChallengeContent.requirements,
      projectChallengeContent.evaluationCriteria,
      projectChallengeContent.bonusPoints
    ),

    // Task 10: 시뮬레이터 - 통합 실습 환경
    createSimulatorTask(
      'integrated-simulator',
      '통합 실습 환경',
      35,
      [
        '전체 워크플로우 실습',
        '실시간 피드백',
        '성능 테스트'
      ],
      'ecommerce-graph-lab',
      `## 이커머스 그래프 실습 랩

이 시뮬레이터에서 주간 프로젝트 전체를 실습할 수 있습니다.

### 실습 환경

1. **샘플 데이터 로드**
   - 고객 100명
   - 제품 500개
   - 주문 1,000건
   - 리뷰 2,000개

2. **제공 기능**
   - 스키마 시각화
   - 쿼리 실행 및 EXPLAIN
   - 성능 프로파일링
   - 결과 시각화

3. **과제 제출**
   - 스키마 정의 (DDL)
   - 핵심 쿼리 5개
   - 문서 (Markdown)

시뮬레이터를 열어 프로젝트를 완성하세요!`
    )
  ]
}
