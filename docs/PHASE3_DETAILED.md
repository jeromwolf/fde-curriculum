# Phase 3: Knowledge Graph (8주) - 실무 중심 재설계

> 목표: Neo4j 기반 Knowledge Graph를 구축하고, GraphRAG로 LLM과 연동할 수 있다.
>
> 기간: 2개월 (8주)
>
> 포트폴리오: 도메인 Knowledge Graph + GraphRAG 시스템
>
> 핵심 변경: RDF/OWL 학술 중심 → Neo4j/Cypher 실무 중심

---

## 🚀 Phase 3를 시작하며

Phase 2에서 데이터 분석과 ML 모델링을 배웠습니다.

하지만 현실의 데이터는 단순한 테이블이 아닙니다.
**기업, 제품, 사람, 이벤트가 복잡하게 연결**되어 있습니다.

예를 들어:
- "삼성전자와 관련된 모든 협력사는?"
- "이 환자와 비슷한 증상을 보인 다른 환자들은?"
- "이 제품을 산 고객이 함께 구매한 다른 제품은?"

이런 **관계 기반 질문**에 답하려면 Knowledge Graph가 필요합니다.

Phase 3에서는:
- 엔티티 간 관계를 모델링하고 (Neo4j)
- 그래프 알고리즘으로 인사이트를 도출하고 (PageRank, 커뮤니티 탐지)
- LLM과 그래프를 연결합니다 (GraphRAG)

> **Phase 2의 ML + Phase 3의 KG = 구조화된 지식 기반 AI**

---

## 왜 Neo4j/Property Graph인가?

| 항목 | RDF/OWL | Property Graph (Neo4j) |
|------|---------|------------------------|
| 학습 곡선 | 가파름 (SPARQL, 온톨로지 이론) | 완만 (Cypher, SQL과 유사) |
| 실무 채택률 | 낮음 (연구/정부) | 높음 (기업 대부분) |
| 도구 생태계 | 제한적 | 풍부 (Neo4j, GraphRAG, LangChain) |
| LLM 통합 | 어려움 | GraphRAG, LangChain 네이티브 |
| 취업 시장 | 극소수 | 활발 |

**RDF/OWL은 1주차에 개념만 소개하고, 나머지는 Neo4j 집중**

---

## Month 5: 그래프 데이터베이스 기초

---

### Week 17: 그래프 이론 & 그래프 DB 입문

#### 학습 목표
- [ ] 그래프 데이터 모델의 개념과 장점을 설명할 수 있다
- [ ] Neo4j 또는 Memgraph를 설치하고 기본 조작을 할 수 있다
- [ ] Cypher 기본 문법으로 CRUD를 수행할 수 있다
- [ ] 관계형 DB와 그래프 DB의 차이를 이해할 수 있다
- [ ] Neo4j와 Memgraph의 차이점을 설명할 수 있다

#### 핵심 개념

**1. 그래프 데이터 모델**
```
Property Graph 구성 요소:

    ┌─────────────┐
    │   Node      │
    │ (노드/정점)  │
    │ - labels    │
    │ - properties│
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │ Relationship│
    │ (관계/엣지)  │
    │ - type      │
    │ - properties│
    │ - direction │
    └─────────────┘

예시:
(Person:User {name: "Kim", age: 30})
    -[:FOLLOWS {since: 2023}]->
(Person:User {name: "Lee", age: 28})
```

**관계형 vs 그래프**
```sql
-- 관계형: 3단계 친구 찾기 (복잡한 JOIN)
SELECT DISTINCT f3.name
FROM users u
JOIN friendships f1 ON u.id = f1.user_id
JOIN friendships f2 ON f1.friend_id = f2.user_id
JOIN friendships f3 ON f2.friend_id = f3.user_id
JOIN users u3 ON f3.friend_id = u3.id
WHERE u.name = 'Kim' AND u3.id != u.id;
```

```cypher
// 그래프: 동일 쿼리 (직관적)
MATCH (u:User {name: 'Kim'})-[:FRIEND*3]->(friend)
RETURN DISTINCT friend.name
```

**2. 그래프 DB 설치 & 설정**

**Neo4j vs Memgraph 비교**

| 항목 | Neo4j | Memgraph |
|------|-------|----------|
| 라이선스 | Community (무료) / Enterprise | 완전 무료 (BSL) |
| 쿼리 언어 | Cypher | Cypher (호환) |
| 성능 | 디스크 기반 | 인메모리 (빠름) |
| 클라우드 | Aura (무료 티어 있음) | Cloud (무료 티어) |
| 알고리즘 | GDS (유료) | MAGE (무료) |
| 시각화 | Bloom (유료) | Lab (무료) |
| 추천 | 학습용, 프로덕션 | 비용 민감, 고성능 필요 시 |

```bash
# Option 1: Neo4j Docker (권장 - 생태계 풍부)
docker run \
    --name neo4j \
    -p 7474:7474 -p 7687:7687 \
    -e NEO4J_AUTH=neo4j/password123 \
    -v $HOME/neo4j/data:/data \
    neo4j:latest

# 접속
# Browser: http://localhost:7474
# Bolt: bolt://localhost:7687

# Option 2: Memgraph Docker (무료 대안 - 고성능)
docker run \
    --name memgraph \
    -p 7687:7687 -p 3000:3000 \
    memgraph/memgraph-platform

# 접속
# Memgraph Lab: http://localhost:3000
# Bolt: bolt://localhost:7687

# 💡 Cypher 문법이 동일하므로, 어느 것을 선택해도 학습 내용 적용 가능
```

**3. Cypher 기초**
```cypher
// CREATE - 노드 생성
CREATE (p:Person {name: 'Kim', age: 30, city: 'Seoul'})
RETURN p

// CREATE - 관계 생성
MATCH (a:Person {name: 'Kim'}), (b:Person {name: 'Lee'})
CREATE (a)-[:KNOWS {since: 2020}]->(b)

// READ - 노드 조회
MATCH (p:Person)
WHERE p.age > 25
RETURN p.name, p.age
ORDER BY p.age DESC
LIMIT 10

// READ - 관계 조회
MATCH (a:Person)-[r:KNOWS]->(b:Person)
RETURN a.name, type(r), b.name

// UPDATE
MATCH (p:Person {name: 'Kim'})
SET p.age = 31, p.updated = datetime()
RETURN p

// DELETE
MATCH (p:Person {name: 'Temp'})
DETACH DELETE p  // 관계도 함께 삭제
```

**4. 패턴 매칭**
```cypher
// 단순 패턴
MATCH (a)-[:KNOWS]->(b)

// 양방향
MATCH (a)-[:KNOWS]-(b)

// 가변 길이 (1~3 hop)
MATCH (a)-[:KNOWS*1..3]->(b)

// 여러 관계 유형
MATCH (a)-[:KNOWS|FOLLOWS]->(b)

// 필터링
MATCH (a:Person)-[r:KNOWS]->(b:Person)
WHERE a.age > 25 AND r.since > 2020
RETURN a, r, b
```

#### 실습 과제

**과제: 소셜 네트워크 그래프 구축**

```
요구사항:
1. Neo4j 환경 설정 (Docker 또는 Aura Free)
2. 데이터 모델링:
   - Person 노드 (name, age, city, interests)
   - KNOWS, FOLLOWS, WORKS_AT 관계
   - Company 노드 (name, industry)
3. 샘플 데이터 생성 (30+ 노드, 50+ 관계)
4. Cypher 쿼리 작성:
   - 특정 사용자의 친구 목록
   - 2촌 친구 찾기
   - 공통 친구 찾기
   - 같은 회사 동료
   - 특정 관심사를 가진 사람들
5. Neo4j Browser에서 시각화

산출물:
- Cypher 스크립트 (create_data.cypher)
- 쿼리 모음 (queries.cypher)
- 그래프 시각화 스크린샷
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 환경 설정 | Neo4j 정상 동작 | 15% |
| 데이터 모델 | 3개 노드 타입, 3개 관계 | 25% |
| 데이터 생성 | 30+ 노드, 50+ 관계 | 20% |
| Cypher 쿼리 | 5개 쿼리 정확 | 30% |
| 시각화 | 의미 있는 그래프 표현 | 10% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 공식 | Neo4j Getting Started | https://neo4j.com/docs/getting-started/ |
| 무료 | Neo4j Aura Free | https://neo4j.com/cloud/aura-free/ |
| 코스 | Neo4j GraphAcademy | https://graphacademy.neo4j.com/ |
| 영상 | Neo4j Fundamentals | https://www.youtube.com/watch?v=8jNPelugC2s |
| 치트시트 | Cypher Refcard | https://neo4j.com/docs/cypher-refcard/current/ |

---

### Week 18: Cypher 심화 & 데이터 모델링

#### 학습 목표
- [ ] 복잡한 Cypher 쿼리를 작성할 수 있다
- [ ] 집계, 서브쿼리, APOC을 활용할 수 있다
- [ ] 효과적인 그래프 데이터 모델을 설계할 수 있다
- [ ] 관계형 데이터를 그래프로 마이그레이션할 수 있다

#### 핵심 개념

**1. Cypher 심화**
```cypher
// 집계
MATCH (p:Person)-[:KNOWS]->(friend)
RETURN p.name, count(friend) as friend_count
ORDER BY friend_count DESC

// COLLECT (배열로 수집)
MATCH (p:Person)-[:KNOWS]->(friend)
RETURN p.name, collect(friend.name) as friends

// WITH (파이프라인)
MATCH (p:Person)-[:KNOWS]->(friend)
WITH p, count(friend) as cnt
WHERE cnt > 5
RETURN p.name, cnt

// UNWIND (배열 풀기)
WITH ['Seoul', 'Busan', 'Incheon'] as cities
UNWIND cities as city
CREATE (:City {name: city})

// CASE 문
MATCH (p:Person)
RETURN p.name,
       CASE
         WHEN p.age < 20 THEN 'Teen'
         WHEN p.age < 40 THEN 'Adult'
         ELSE 'Senior'
       END as age_group

// 서브쿼리 (EXISTS)
MATCH (p:Person)
WHERE EXISTS {
  MATCH (p)-[:WORKS_AT]->(:Company {industry: 'Tech'})
}
RETURN p.name
```

**2. APOC (Awesome Procedures on Cypher)**
```cypher
// 설치 확인
CALL apoc.help('apoc')

// JSON 로드
CALL apoc.load.json('https://api.example.com/data')
YIELD value
CREATE (p:Person {name: value.name})

// CSV 벌크 로드
LOAD CSV WITH HEADERS FROM 'file:///users.csv' AS row
CREATE (p:Person {
  name: row.name,
  age: toInteger(row.age)
})

// 배치 처리
CALL apoc.periodic.iterate(
  "MATCH (p:Person) RETURN p",
  "SET p.processed = true",
  {batchSize: 1000, parallel: true}
)

// 경로 탐색
MATCH (start:Person {name: 'Kim'}), (end:Person {name: 'Lee'})
CALL apoc.algo.dijkstra(start, end, 'KNOWS', 'weight')
YIELD path, weight
RETURN path, weight

// 그래프 내보내기
CALL apoc.export.json.all('graph.json', {})
```

**3. 그래프 데이터 모델링**
```
모델링 원칙:

1. 노드는 "명사" (Person, Product, Order)
2. 관계는 "동사" (PURCHASED, KNOWS, WORKS_AT)
3. 속성은 노드/관계의 특성 (name, since, amount)

안티 패턴:
❌ 관계를 노드로 만들기 (FRIENDSHIP 노드)
✅ 관계에 속성 추가 ([:KNOWS {since: 2020}])

❌ 배열 속성으로 관계 표현
✅ 명시적 관계로 연결
```

**이커머스 예시:**
```cypher
// 모델
(:Customer)-[:PLACED]->(:Order)-[:CONTAINS]->(:Product)
(:Product)-[:BELONGS_TO]->(:Category)
(:Customer)-[:REVIEWED {rating: 5}]->(:Product)

// 추천 쿼리: 같은 상품을 산 다른 고객이 구매한 상품
MATCH (c:Customer {id: $customerId})-[:PLACED]->(:Order)-[:CONTAINS]->(p:Product)
      <-[:CONTAINS]-(:Order)<-[:PLACED]-(other:Customer)
      -[:PLACED]->(:Order)-[:CONTAINS]->(rec:Product)
WHERE NOT (c)-[:PLACED]->(:Order)-[:CONTAINS]->(rec)
RETURN rec.name, count(*) as score
ORDER BY score DESC
LIMIT 10
```

**4. 관계형 → 그래프 마이그레이션**
```cypher
// 1. 테이블 → 노드
LOAD CSV WITH HEADERS FROM 'file:///customers.csv' AS row
CREATE (:Customer {
  id: row.customer_id,
  name: row.name,
  email: row.email
})

// 2. 외래키 → 관계
LOAD CSV WITH HEADERS FROM 'file:///orders.csv' AS row
MATCH (c:Customer {id: row.customer_id})
CREATE (c)-[:PLACED]->(:Order {
  id: row.order_id,
  date: date(row.order_date),
  total: toFloat(row.total)
})

// 3. 조인 테이블 → 관계
LOAD CSV WITH HEADERS FROM 'file:///order_items.csv' AS row
MATCH (o:Order {id: row.order_id}), (p:Product {id: row.product_id})
CREATE (o)-[:CONTAINS {quantity: toInteger(row.quantity)}]->(p)
```

#### 실습 과제

**과제: 이커머스 Knowledge Graph 구축**

```
데이터: 제공된 CSV 또는 Kaggle 이커머스 데이터

요구사항:
1. 데이터 모델 설계:
   - ERD → 그래프 모델 변환
   - 노드: Customer, Order, Product, Category
   - 관계: PLACED, CONTAINS, BELONGS_TO, REVIEWED
2. 데이터 마이그레이션:
   - CSV 로드
   - 관계 생성
3. 비즈니스 쿼리 10개:
   - 고객별 주문 이력
   - 카테고리별 베스트셀러
   - 함께 구매된 상품 (장바구니 분석)
   - 고객 세그먼트별 선호 카테고리
   - 리뷰 기반 추천
4. 성능 최적화:
   - 인덱스 생성
   - 쿼리 프로파일링 (PROFILE)

산출물:
- 그래프 모델 다이어그램
- 마이그레이션 스크립트
- 비즈니스 쿼리 10개 + 설명
- 성능 최적화 리포트
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 모델 설계 | 4개 노드, 4개 관계 | 25% |
| 마이그레이션 | 데이터 정확히 로드 | 25% |
| 비즈니스 쿼리 | 10개 중 8개 정확 | 30% |
| 성능 | 인덱스 + PROFILE | 20% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 문서 | APOC Documentation | https://neo4j.com/labs/apoc/ |
| 가이드 | Graph Data Modeling | https://neo4j.com/developer/guide-data-modeling/ |
| 영상 | Graph Modeling Tips | https://www.youtube.com/watch?v=oXziS-PPIUA |

---

### Week 19: 그래프 알고리즘

#### 학습 목표
- [ ] 중심성 알고리즘을 적용하여 중요 노드를 찾을 수 있다
- [ ] 커뮤니티 탐지로 클러스터를 발견할 수 있다
- [ ] 유사도 알고리즘으로 추천을 구현할 수 있다
- [ ] 경로 탐색 알고리즘을 활용할 수 있다

#### 핵심 개념

**1. 그래프 알고리즘 라이브러리**

> **Neo4j GDS** (Graph Data Science) 또는 **Memgraph MAGE** 사용
>
> | 항목 | Neo4j GDS | Memgraph MAGE |
> |------|-----------|---------------|
> | 비용 | Enterprise (유료) | 완전 무료 |
> | 알고리즘 | 65+ 알고리즘 | 40+ 알고리즘 |
> | 설치 | 별도 플러그인 | 기본 포함 |
> | Cypher 호환 | ✅ | ✅ (일부 문법 차이) |

```cypher
-- Neo4j GDS 사용 시 --

// GDS 설치 확인
CALL gds.list()

// 그래프 프로젝션 (메모리에 로드)
CALL gds.graph.project(
  'myGraph',
  'Person',
  'KNOWS',
  {
    nodeProperties: ['age'],
    relationshipProperties: ['weight']
  }
)

// 프로젝션 확인
CALL gds.graph.list()
```

```cypher
-- Memgraph MAGE 사용 시 (무료 대안) --

// MAGE 모듈 확인
CALL mg.procedures() YIELD name
WHERE name STARTS WITH 'pagerank' OR name STARTS WITH 'community'
RETURN name;

// Memgraph는 프로젝션 없이 직접 쿼리 가능
// 예: PageRank
CALL pagerank.get() YIELD node, rank
RETURN node.name, rank
ORDER BY rank DESC LIMIT 10;
```

**2. 중심성 (Centrality)**
```cypher
// PageRank - 영향력 있는 노드
CALL gds.pageRank.stream('myGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
LIMIT 10

// Betweenness - 브릿지 역할 노드
CALL gds.betweenness.stream('myGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC

// Degree - 연결 수
CALL gds.degree.stream('myGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
```

| 알고리즘 | 의미 | 비즈니스 활용 |
|----------|------|--------------|
| PageRank | 중요도/영향력 | 인플루언서 발견 |
| Betweenness | 중개자 역할 | 정보 흐름 병목 |
| Closeness | 접근성 | 빠른 전파 가능 노드 |
| Degree | 연결 수 | 허브 노드 |

**3. 커뮤니티 탐지**
```cypher
// Louvain - 모듈성 기반 커뮤니티
CALL gds.louvain.stream('myGraph')
YIELD nodeId, communityId
RETURN communityId, collect(gds.util.asNode(nodeId).name) AS members
ORDER BY size(members) DESC

// Label Propagation - 빠른 커뮤니티 탐지
CALL gds.labelPropagation.stream('myGraph')
YIELD nodeId, communityId
RETURN communityId, count(*) AS size

// 결과를 노드에 저장
CALL gds.louvain.write('myGraph', {writeProperty: 'community'})
```

**4. 유사도 & 링크 예측**
```cypher
// Node Similarity (Jaccard)
CALL gds.nodeSimilarity.stream('myGraph')
YIELD node1, node2, similarity
RETURN gds.util.asNode(node1).name AS person1,
       gds.util.asNode(node2).name AS person2,
       similarity
ORDER BY similarity DESC
LIMIT 10

// KNN (K-Nearest Neighbors)
CALL gds.knn.stream('myGraph', {
  nodeProperties: ['age', 'income'],
  topK: 5
})
YIELD node1, node2, similarity
RETURN gds.util.asNode(node1).name, gds.util.asNode(node2).name, similarity

// 링크 예측: 미래 연결 가능성
CALL gds.linkPrediction.adamicAdar(
  gds.util.asNode($node1Id),
  gds.util.asNode($node2Id)
) YIELD score
RETURN score
```

**5. 경로 탐색**
```cypher
// 최단 경로
MATCH (start:Person {name: 'Kim'}), (end:Person {name: 'Lee'})
CALL gds.shortestPath.dijkstra.stream('myGraph', {
  sourceNode: start,
  targetNode: end,
  relationshipWeightProperty: 'weight'
})
YIELD path, totalCost
RETURN [node IN nodes(path) | node.name] AS path, totalCost

// 모든 최단 경로
MATCH (start:Person {name: 'Kim'}), (end:Person {name: 'Lee'})
MATCH path = allShortestPaths((start)-[*]-(end))
RETURN path
```

#### 실습 과제

**과제: 소셜 네트워크 분석**

```
데이터: Week 17 소셜 네트워크 확장 (100+ 노드)

요구사항:
1. 그래프 프로젝션 생성
2. 중심성 분석:
   - PageRank (인플루언서 Top 10)
   - Betweenness (브릿지 Top 5)
   - 중심성 점수를 노드에 저장
3. 커뮤니티 탐지:
   - Louvain 알고리즘 적용
   - 커뮤니티별 특성 분석
   - 시각화
4. 유사도 & 추천:
   - 친구 추천 (Node Similarity)
   - "알 수도 있는 친구" 구현
5. 경로 분석:
   - 두 사용자 간 분리 정도
   - 영향력 전파 경로

산출물:
- Cypher 스크립트
- 분석 결과 리포트
- 시각화 (Neo4j Browser, Memgraph Lab, 또는 Python)
- 비즈니스 인사이트 3개

> 💡 **시각화 도구 선택:**
> - Neo4j Bloom: 유료 (Enterprise)
> - Memgraph Lab: **무료** - http://localhost:3000
> - Python (NetworkX/PyVis): 무료, 커스터마이징 가능
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 중심성 | 3개 알고리즘 적용 | 25% |
| 커뮤니티 | 탐지 + 해석 | 25% |
| 유사도 | 추천 시스템 동작 | 25% |
| 인사이트 | 비즈니스 활용 제안 | 15% |
| 시각화 | 명확한 표현 | 10% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 문서 | GDS Documentation | https://neo4j.com/docs/graph-data-science/ |
| 코스 | Graph Algorithms | https://graphacademy.neo4j.com/courses/gds-product-introduction/ |
| 영상 | PageRank Explained | https://www.youtube.com/watch?v=P8Kt6Abq_rM |

---

### Week 20: RDF/OWL 개념 & 시맨틱 웹 (1주 집중)

#### 학습 목표
- [ ] RDF 트리플의 구조를 이해할 수 있다
- [ ] OWL 온톨로지의 개념을 설명할 수 있다
- [ ] Property Graph와 RDF의 차이를 이해할 수 있다
- [ ] 시맨틱 웹의 역사와 현재를 파악할 수 있다

#### 핵심 개념 (개념 위주, 실습 최소화)

**1. RDF (Resource Description Framework)**
```
구조: Subject - Predicate - Object (트리플)

예시:
<http://example.org/person/Kim>
    <http://xmlns.com/foaf/0.1/name>
    "Kim Cheolsu" .

<http://example.org/person/Kim>
    <http://xmlns.com/foaf/0.1/knows>
    <http://example.org/person/Lee> .

형식: Turtle, RDF/XML, JSON-LD, N-Triples
```

**2. SPARQL (SQL for RDF)**
```sparql
# 모든 사람과 이름 조회
SELECT ?person ?name
WHERE {
  ?person rdf:type foaf:Person .
  ?person foaf:name ?name .
}

# 특정 사람의 친구
SELECT ?friendName
WHERE {
  :Kim foaf:knows ?friend .
  ?friend foaf:name ?friendName .
}
```

**3. OWL (Web Ontology Language)**
```
클래스 계층:
Thing
├── Agent
│   ├── Person
│   └── Organization
└── Event
    ├── Meeting
    └── Conference

관계 정의:
- ObjectProperty: knows (Person → Person)
- DatatypeProperty: age (Person → Integer)
- Transitive: ancestorOf
- Symmetric: marriedTo
- Inverse: hasFather ↔ isFatherOf
```

**4. Property Graph vs RDF**

| 항목 | Property Graph (Neo4j) | RDF |
|------|------------------------|-----|
| 데이터 모델 | 노드 + 관계 + 속성 | 트리플 (S-P-O) |
| 쿼리 언어 | Cypher | SPARQL |
| 스키마 | 유연 (선택적) | 온톨로지 (OWL) |
| 추론 | 제한적 | 내장 (Reasoner) |
| 생태계 | Neo4j, TigerGraph | Apache Jena, Virtuoso |
| 사용처 | 기업 애플리케이션 | 연구, 정부, 의료 |

**5. 시맨틱 웹 현황**
```
성공 사례:
- Google Knowledge Graph (검색 향상)
- Wikidata (구조화된 위키피디아)
- FIBO (금융 온톨로지)
- FHIR (의료 데이터 표준)

한계:
- 학습 곡선 높음
- 도구 복잡
- 기업 채택 저조
- Property Graph가 실무에서 승리

현재 트렌드:
- Property Graph + LLM (GraphRAG)
- RDF는 특수 도메인 (의료, 금융, 정부)에서 사용
```

#### 실습 (간단히)

**과제: RDF/SPARQL 맛보기**

```
요구사항 (2시간 분량):
1. Wikidata SPARQL 엔드포인트 사용:
   https://query.wikidata.org/
2. 간단한 SPARQL 쿼리 5개:
   - 모든 한국 도시
   - 특정 인물의 정보
   - 노벨상 수상자 목록
3. RDF/Property Graph 비교 리포트 (1페이지)

산출물:
- SPARQL 쿼리 5개
- 비교 리포트
```

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 튜토리얼 | Wikidata SPARQL | https://www.wikidata.org/wiki/Wikidata:SPARQL_tutorial |
| 문서 | RDF Primer | https://www.w3.org/TR/rdf11-primer/ |
| 영상 | Semantic Web Explained | https://www.youtube.com/watch?v=OGg8A2zfWKg |

---

## Month 6: 고급 Knowledge Graph & GraphRAG

---

### Week 21: Entity Resolution & Knowledge Graph 구축

#### 학습 목표
- [ ] Entity Resolution으로 중복 엔티티를 통합할 수 있다
- [ ] 다양한 소스에서 Knowledge Graph를 구축할 수 있다
- [ ] 데이터 품질을 관리할 수 있다
- [ ] 그래프 스키마를 진화시킬 수 있다

#### 핵심 개념

**1. Entity Resolution (ER)**
```python
# 문제: 같은 엔티티, 다른 표현
# "삼성전자", "Samsung Electronics", "Samsung", "SEC"

import recordlinkage

# 인덱싱 (비교 쌍 생성)
indexer = recordlinkage.Index()
indexer.block('city')  # 같은 도시만 비교
candidate_pairs = indexer.index(df)

# 비교
compare = recordlinkage.Compare()
compare.string('name', 'name', method='jarowinkler', threshold=0.85)
compare.exact('industry', 'industry')
features = compare.compute(candidate_pairs, df)

# 분류
matches = features[features.sum(axis=1) >= 2]
```

```cypher
// Neo4j에서 Entity Resolution
// 1. 유사 노드 찾기
MATCH (a:Company), (b:Company)
WHERE a.id < b.id
  AND apoc.text.jaroWinklerDistance(a.name, b.name) > 0.85
RETURN a.name, b.name, apoc.text.jaroWinklerDistance(a.name, b.name) as similarity

// 2. 병합
MATCH (a:Company {name: 'Samsung'}), (b:Company {name: '삼성전자'})
CALL apoc.refactor.mergeNodes([a, b], {
  properties: 'combine',
  mergeRels: true
})
YIELD node
RETURN node
```

**2. 다중 소스 통합**
```
소스 예시:
- 내부 DB (고객, 제품)
- 외부 API (뉴스, SNS)
- 문서 (PDF, 계약서)
- 공개 데이터 (Wikidata, DBpedia)

통합 파이프라인:
1. Extract: 각 소스에서 엔티티/관계 추출
2. Normalize: 스키마 정규화
3. Match: Entity Resolution
4. Merge: 통합 그래프 생성
5. Validate: 품질 검증
```

**3. 데이터 품질**
```cypher
// 고아 노드 (관계 없는 노드)
MATCH (n)
WHERE NOT (n)--()
RETURN labels(n), count(n)

// 중복 관계
MATCH (a)-[r1]->(b), (a)-[r2]->(b)
WHERE id(r1) < id(r2) AND type(r1) = type(r2)
RETURN a, b, count(*) as duplicates

// 필수 속성 누락
MATCH (p:Person)
WHERE p.name IS NULL OR p.email IS NULL
RETURN p

// 무결성 검사
MATCH (o:Order)-[:PLACED_BY]->(c:Customer)
WHERE c IS NULL
RETURN o.id as orphan_order
```

**4. 스키마 진화**
```cypher
// 새 속성 추가
MATCH (p:Person)
SET p.createdAt = datetime()

// 레이블 추가
MATCH (p:Person)
WHERE p.isEmployee = true
SET p:Employee

// 관계 타입 변경
MATCH (a)-[r:KNOWS]->(b)
CREATE (a)-[:FRIEND {since: r.since}]->(b)
DELETE r

// 마이그레이션 스크립트
CALL apoc.periodic.iterate(
  "MATCH (p:Person) WHERE NOT EXISTS(p.status) RETURN p",
  "SET p.status = 'active'",
  {batchSize: 1000}
)
```

#### 실습 과제

**과제: 기업 Knowledge Graph 구축**

```
데이터 소스:
1. 기업 정보 CSV (회사명, 산업, 직원수)
2. 뉴스 API (기업 관련 기사)
3. 관계 데이터 (협력, 경쟁, 투자)

요구사항:
1. 다중 소스 통합:
   - CSV 로드
   - 뉴스에서 기업명 추출 (NER)
     - 영어: spaCy, Hugging Face Transformers
     - **한국어: KoNLPy (Okt, Komoran), Kiwi, Pororo**
2. Entity Resolution:
   - 기업명 정규화 (삼성전자 = Samsung = SEC)
   - 중복 통합
3. 관계 추출:
   - 뉴스에서 관계 추론 (키워드 기반)
   - 한국어 뉴스 처리 시 형태소 분석 활용
4. 품질 관리:
   - 고아 노드 제거
   - 무결성 검사
5. 시각화 대시보드

산출물:
- 통합 파이프라인 코드
- Entity Resolution 결과
- 품질 리포트
- Neo4j Browser 시각화
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 소스 통합 | 3개 소스 처리 | 25% |
| Entity Resolution | 정확도 80% 이상 | 25% |
| 관계 추출 | 의미 있는 관계 | 20% |
| 품질 관리 | 검증 쿼리 5개 | 20% |
| 문서화 | 파이프라인 설명 | 10% |

#### 추천 자료 (한국어 NLP)

| 유형 | 제목 | 링크 |
|------|------|------|
| 라이브러리 | KoNLPy (한국어 NLP) | https://konlpy.org/ko/latest/ |
| 라이브러리 | Kiwi (빠른 형태소 분석) | https://github.com/bab2min/Kiwi |
| 라이브러리 | Pororo (카카오브레인) | https://github.com/kakaobrain/pororo |
| 튜토리얼 | 한국어 NER 실습 | https://wikidocs.net/30682 |

---

### Week 22: Neo4j + Python 통합

#### 학습 목표
- [ ] Python에서 Neo4j를 연동할 수 있다
- [ ] 그래프 데이터를 DataFrame으로 분석할 수 있다
- [ ] 시각화 도구를 활용할 수 있다
- [ ] ML과 그래프를 결합할 수 있다

#### 핵심 개념

**1. Neo4j Python Driver**
```python
from neo4j import GraphDatabase

class Neo4jConnection:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def query(self, query, parameters=None):
        with self.driver.session() as session:
            result = session.run(query, parameters)
            return [record.data() for record in result]

# 사용
conn = Neo4jConnection("bolt://localhost:7687", "neo4j", "password")

# 조회
results = conn.query("""
    MATCH (p:Person)-[:KNOWS]->(friend)
    WHERE p.name = $name
    RETURN friend.name as name, friend.age as age
""", {"name": "Kim"})

# DataFrame으로 변환
import pandas as pd
df = pd.DataFrame(results)
```

**2. py2neo (고수준 OGM)**
```python
from py2neo import Graph, Node, Relationship

graph = Graph("bolt://localhost:7687", auth=("neo4j", "password"))

# 노드 생성
person = Node("Person", name="Kim", age=30)
graph.create(person)

# 관계 생성
friend = Node("Person", name="Lee", age=28)
knows = Relationship(person, "KNOWS", friend, since=2020)
graph.create(knows)

# OGM (Object Graph Mapping)
from py2neo.ogm import GraphObject, Property, RelatedTo

class Person(GraphObject):
    __primarykey__ = "name"

    name = Property()
    age = Property()
    friends = RelatedTo("Person", "KNOWS")

# 사용
kim = Person()
kim.name = "Kim"
kim.age = 30
graph.push(kim)
```

**3. 시각화**
```python
# NetworkX + Matplotlib
import networkx as nx
import matplotlib.pyplot as plt

# Neo4j → NetworkX
query = """
MATCH (a:Person)-[r:KNOWS]->(b:Person)
RETURN a.name as source, b.name as target
"""
edges = conn.query(query)

G = nx.DiGraph()
for edge in edges:
    G.add_edge(edge['source'], edge['target'])

plt.figure(figsize=(12, 8))
pos = nx.spring_layout(G)
nx.draw(G, pos, with_labels=True, node_color='lightblue',
        node_size=500, font_size=10, arrows=True)
plt.savefig('graph.png')

# PyVis (인터랙티브)
from pyvis.network import Network

net = Network(notebook=True, height="600px", width="100%")
net.from_nx(G)
net.show("graph.html")

# neovis.js (Neo4j 전용)
# HTML에서 직접 Neo4j 연결
```

**4. Graph + ML**
```python
# Node2Vec - 그래프 임베딩
from node2vec import Node2Vec

node2vec = Node2Vec(G, dimensions=64, walk_length=30, num_walks=200)
model = node2vec.fit(window=10, min_count=1)

# 노드 벡터 얻기
vector = model.wv['Kim']

# 유사 노드 찾기
similar = model.wv.most_similar('Kim', topn=5)

# 임베딩 → 분류/클러스터링
from sklearn.cluster import KMeans

embeddings = [model.wv[node] for node in G.nodes()]
kmeans = KMeans(n_clusters=5)
clusters = kmeans.fit_predict(embeddings)
```

#### 실습 과제

**과제: 그래프 분석 대시보드**

```
요구사항:
1. Neo4j 연결 유틸리티 클래스
2. 분석 함수:
   - 기본 통계 (노드 수, 관계 수, 밀도)
   - 중심성 분석 결과 DataFrame
   - 커뮤니티 분포
3. 시각화:
   - NetworkX 정적 그래프
   - PyVis 인터랙티브 그래프
4. Node2Vec 임베딩:
   - 노드 임베딩 생성
   - 유사 노드 검색
   - 클러스터링 시각화
5. Streamlit 대시보드

산출물:
- Python 패키지 구조
- Streamlit 앱
- 문서화 (README)
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 연결 | 안정적 연결 | 15% |
| 분석 | 3개 분석 함수 | 25% |
| 시각화 | 2가지 방식 | 25% |
| 임베딩 | Node2Vec 동작 | 20% |
| 대시보드 | Streamlit 완성 | 15% |

---

### Week 23: GraphRAG 구현

#### 학습 목표
- [ ] GraphRAG의 개념과 장점을 설명할 수 있다
- [ ] Neo4j + LLM을 연동할 수 있다
- [ ] Knowledge Graph 기반 RAG를 구현할 수 있다
- [ ] 벡터 검색과 그래프 탐색을 결합할 수 있다

#### 핵심 개념

**1. GraphRAG란?**
```
기존 RAG:
Query → 벡터 검색 → 관련 청크 → LLM → 답변

문제:
- 문서 간 관계 놓침
- 다단계 추론 어려움
- "전체 맥락" 질문에 약함

GraphRAG:
Query → 그래프 탐색 + 벡터 검색 → 관련 엔티티/관계 → LLM → 답변

장점:
- 엔티티 간 관계 활용
- 다단계 추론 가능
- 구조화된 지식 활용
```

**2. LangChain + Neo4j**
```python
from langchain_community.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain
from langchain_openai import ChatOpenAI

# 그래프 연결
graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password"
)

# 스키마 확인
print(graph.schema)

# 자연어 → Cypher 변환
llm = ChatOpenAI(model="gpt-4", temperature=0)
chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph,
    verbose=True,
    validate_cypher=True
)

# 질문
response = chain.invoke({
    "query": "김철수와 연결된 사람들은 누구인가요?"
})
print(response)
```

**3. 하이브리드 검색 (Vector + Graph)**
```python
from langchain_community.vectorstores.neo4j_vector import Neo4jVector
from langchain_openai import OpenAIEmbeddings

# 벡터 인덱스 생성
vector_store = Neo4jVector.from_existing_graph(
    OpenAIEmbeddings(),
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
    index_name="person_index",
    node_label="Person",
    text_node_properties=["bio", "description"],
    embedding_node_property="embedding"
)

# 하이브리드 검색
def hybrid_search(query, k=5):
    # 1. 벡터 검색
    vector_results = vector_store.similarity_search(query, k=k)

    # 2. 엔티티 추출
    entities = extract_entities(query)

    # 3. 그래프 탐색
    cypher = """
    MATCH (e)-[r*1..2]-(related)
    WHERE e.name IN $entities
    RETURN DISTINCT related
    LIMIT $limit
    """
    graph_results = graph.query(cypher, {"entities": entities, "limit": k})

    # 4. 결합 및 랭킹
    return combine_and_rank(vector_results, graph_results)
```

**4. Microsoft GraphRAG (참고)**
```python
# Microsoft GraphRAG 스타일 (개념)

# 1. 문서 → 엔티티/관계 추출
# 2. 커뮤니티 탐지 (Leiden)
# 3. 커뮤니티별 요약 생성
# 4. 쿼리 시:
#    - Local Search: 특정 엔티티 중심
#    - Global Search: 커뮤니티 요약 활용

# 장점: 전체 맥락 질문 가능
# 단점: 인덱싱 비용 높음 (LLM 호출 많음)
```

#### 실습 과제

**과제: 도메인 Knowledge Graph + QA 시스템**

```
도메인 선택 (1개):
1. 영화/드라마 (IMDb 스타일)
2. 뉴스 기사 (기업/인물 관계)
3. 기술 문서 (API/라이브러리 관계)

요구사항:
1. Knowledge Graph 구축:
   - 100+ 노드
   - 다양한 관계 유형
2. 벡터 인덱스 추가:
   - 설명/내용 임베딩
3. GraphRAG 구현:
   - 자연어 → Cypher
   - 하이브리드 검색
4. 평가:
   - 질문 10개 테스트
   - 기존 RAG 대비 개선 확인
5. 데모:
   - Streamlit 챗봇

산출물:
- Knowledge Graph
- GraphRAG 파이프라인
- 평가 결과
- 데모 앱
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| KG 구축 | 100+ 노드, 3+ 관계유형 | 25% |
| 벡터 인덱스 | 임베딩 생성 완료 | 20% |
| GraphRAG | QA 동작 | 25% |
| 평가 | 정량적 비교 | 15% |
| 데모 | 사용 가능한 UI | 15% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 문서 | LangChain Neo4j | https://python.langchain.com/docs/integrations/graphs/neo4j_cypher |
| GitHub | Microsoft GraphRAG | https://github.com/microsoft/graphrag |
| 영상 | GraphRAG Explained | https://www.youtube.com/watch?v=r09tJfON6kE |
| 블로그 | Neo4j + LLM | https://neo4j.com/developer-blog/knowledge-graph-rag-application/ |

---

### Week 24: 도메인 Knowledge Graph 프로젝트

#### 학습 목표
- [ ] 실제 도메인에 맞는 Knowledge Graph를 설계할 수 있다
- [ ] E2E KG 파이프라인을 구축할 수 있다
- [ ] GraphRAG 기반 애플리케이션을 배포할 수 있다
- [ ] 프로젝트를 문서화하고 발표할 수 있다

#### 프로젝트 개요

**포트폴리오 #3: 도메인 Knowledge Graph + GraphRAG 시스템**

```
아키텍처:

[Data Sources]     [Processing]      [Knowledge Graph]    [Application]
┌─────────┐       ┌─────────┐       ┌─────────────┐      ┌─────────┐
│  CSV    │──────▶│ Entity  │──────▶│             │      │ Streamlit│
│  API    │       │ Extract │       │    Neo4j    │◀────▶│ ChatBot  │
│  Docs   │       │ + NER   │       │             │      │          │
└─────────┘       └─────────┘       └─────────────┘      └─────────┘
                       │                   │
                       ▼                   ▼
                  ┌─────────┐        ┌─────────┐
                  │ Entity  │        │ Vector  │
                  │ Resolve │        │ Index   │
                  └─────────┘        └─────────┘
                                          │
                                          ▼
                                     ┌─────────┐
                                     │GraphRAG │
                                     │  + LLM  │
                                     └─────────┘
```

#### 도메인 옵션

| 도메인 | 노드 예시 | 관계 예시 | 난이도 |
|--------|----------|----------|--------|
| 영화/엔터 | 영화, 배우, 감독 | ACTED_IN, DIRECTED | 중 |
| 기술 문서 | API, 라이브러리, 함수 | DEPENDS_ON, IMPLEMENTS | 중 |
| 의료 | 질병, 증상, 약물 | TREATS, CAUSES | 상 |
| 금융 | 회사, 인물, 거래 | INVESTED_IN, ACQUIRED | 상 |
| 학술 | 논문, 저자, 주제 | CITED_BY, AUTHORED | 중 |

#### 프로젝트 요구사항

**1. 데이터 수집 & 처리**
- 최소 3개 데이터 소스
- 500+ 노드, 1000+ 관계
- Entity Resolution 적용

**2. Knowledge Graph**
- 잘 설계된 스키마
- 인덱스 최적화
- 품질 검증

**3. GraphRAG**
- 자연어 → Cypher
- 하이브리드 검색
- 10+ 질문 테스트

**4. 애플리케이션**
- Streamlit 챗봇
- 그래프 시각화
- 배포 (Streamlit Cloud)

**5. 문서화**
- README.md
- 아키텍처 다이어그램
- API 문서 (선택)

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| **데이터** | 3소스, 500+ 노드 | 15% |
| **KG 설계** | 명확한 스키마, 품질 | 20% |
| **GraphRAG** | QA 정확도 80%+ | 25% |
| **앱** | 배포 완료, 사용 가능 | 20% |
| **문서화** | README, 다이어그램 | 10% |
| **발표** | 5분 데모 | 10% |

#### 프로젝트 일정

| 일차 | 활동 | 산출물 |
|------|------|--------|
| 1-2 | 도메인 선정, 설계 | 스키마, 아키텍처 |
| 3-4 | 데이터 수집 | 원본 데이터 |
| 5-6 | KG 구축 | Neo4j 그래프 |
| 7-8 | Entity Resolution | 정제된 그래프 |
| 9-10 | GraphRAG 구현 | QA 시스템 |
| 11 | 앱 개발 | Streamlit 앱 |
| 12 | 문서화 & 발표 | 최종 산출물 |

---

## Phase 3 완료 기준

### 필수 산출물
1. [ ] Week 17: 소셜 네트워크 그래프
2. [ ] Week 18: 이커머스 Knowledge Graph
3. [ ] Week 19: 그래프 알고리즘 분석 리포트
4. [ ] Week 20: RDF/SPARQL 비교 리포트
5. [ ] Week 21: 기업 Knowledge Graph
6. [ ] Week 22: 그래프 분석 대시보드
7. [ ] Week 23: GraphRAG QA 시스템
8. [ ] **Week 24: 포트폴리오 #3 - 도메인 KG + GraphRAG**

### 역량 체크리스트
- [ ] Cypher로 복잡한 그래프 쿼리를 작성할 수 있다
- [ ] 그래프 알고리즘을 적용하여 인사이트를 도출할 수 있다
- [ ] 다중 소스에서 Knowledge Graph를 구축할 수 있다
- [ ] GraphRAG로 LLM과 그래프를 연동할 수 있다
- [ ] 도메인 KG 프로젝트를 E2E로 완수할 수 있다

### 자격증 (선택)
- Neo4j Certified Professional: https://graphacademy.neo4j.com/

---

*Phase 3 완료 → Phase 4: 클라우드 & 인프라로 이동*
