// Day 4: Property Graph vs RDF 비교

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day4PropertyGraphComparison: Day = {
  slug: 'property-graph-vs-rdf',
  title: 'Property Graph vs RDF',
  totalDuration: 240,
  tasks: [
    createVideoTask('w5d4-comparison-overview', '두 모델 비교 개요', 30, {
      introduction: `
# Property Graph vs RDF 비교

## 두 가지 그래프 데이터 모델

\`\`\`
Property Graph (Neo4j)          RDF (Semantic Web)
─────────────────────          ─────────────────────
[Node]──[Edge]──▶[Node]        Subject─Predicate─▶Object
 │ props  │ props                       (Triple)
 ▼        ▼
labels   type
\`\`\`

## 역사적 배경

| 연도 | Property Graph | RDF |
|------|----------------|-----|
| 1999 | - | RDF 1.0 W3C 권고 |
| 2004 | - | OWL 1.0 표준 |
| 2007 | Neo4j 1.0 | - |
| 2012 | - | RDF 1.1 |
| 2013 | Cypher 오픈소스 | - |
| 2019 | GQL 표준화 시작 | - |
| 2024 | GQL ISO 표준 | - |

## 핵심 차이

\`\`\`
Property Graph:
- 노드와 엣지에 속성을 직접 저장
- 스키마 유연 (Schema-optional)
- 개발자 친화적 쿼리 (Cypher)

RDF:
- 모든 것을 트리플로 표현
- 스키마 = 온톨로지 (OWL)
- 표준화된 쿼리 (SPARQL)
- 추론 (Reasoning) 내장
\`\`\`
      `,
      keyPoints: ['Property Graph는 실무 중심', 'RDF는 표준/학술 중심', '각각 다른 강점이 있음'],
      practiceGoal: '두 데이터 모델의 차이를 이해한다',
    }),

    createReadingTask('w5d4-data-model', '데이터 모델 비교', 35, {
      introduction: `
# 데이터 모델 비교

## Property Graph 모델

\`\`\`cypher
// 노드: 레이블 + 속성
CREATE (p:Person:Employee {
  name: "김철수",
  age: 35,
  email: "kim@example.com"
})

// 관계: 타입 + 속성 + 방향
CREATE (p)-[:WORKS_FOR {since: 2020, role: "Engineer"}]->(c:Company {name: "Samsung"})
\`\`\`

**특징:**
- 노드에 여러 레이블 가능
- 관계에 속성 저장 (가중치 등)
- 관계는 항상 방향 있음

## RDF 모델

\`\`\`turtle
# 모든 것이 트리플
ex:Kim rdf:type ex:Person, ex:Employee .
ex:Kim ex:name "김철수" .
ex:Kim ex:age 35 .
ex:Kim ex:email "kim@example.com" .

# 관계도 트리플
ex:Kim ex:worksFor ex:Samsung .

# 관계의 속성은 Reification 필요
ex:Kim ex:worksFor ex:Samsung .
_:stmt1 rdf:subject ex:Kim ;
        rdf:predicate ex:worksFor ;
        rdf:object ex:Samsung ;
        ex:since 2020 ;
        ex:role "Engineer" .
\`\`\`

**특징:**
- 모든 것이 트리플
- 관계에 속성 저장 어려움 (Reification)
- URI로 전역 식별

## 동일 데이터의 표현

**시나리오**: "김철수가 2020년부터 삼성에서 엔지니어로 일한다"

### Property Graph
\`\`\`cypher
(:Person {name: "김철수"})
  -[:WORKS_FOR {since: 2020, role: "Engineer"}]->
(:Company {name: "삼성"})
\`\`\`

### RDF (Reification)
\`\`\`turtle
ex:Kim ex:worksFor ex:Samsung .
[] a rdf:Statement ;
   rdf:subject ex:Kim ;
   rdf:predicate ex:worksFor ;
   rdf:object ex:Samsung ;
   ex:since 2020 ;
   ex:role "Engineer" .
\`\`\`

### RDF (Named Graph)
\`\`\`trig
GRAPH ex:employment1 {
  ex:Kim ex:worksFor ex:Samsung .
}
ex:employment1 ex:since 2020 ;
               ex:role "Engineer" .
\`\`\`
      `,
      keyPoints: ['PG는 관계에 속성 직접 저장', 'RDF는 Reification 또는 Named Graph 필요', 'PG가 관계 속성 표현에 유리'],
      practiceGoal: '데이터 표현 방식의 차이를 이해한다',
    }),

    createReadingTask('w5d4-query-comparison', '쿼리 언어 비교: Cypher vs SPARQL', 40, {
      introduction: `
# Cypher vs SPARQL

## 기본 조회

### 모든 사람 조회

**Cypher:**
\`\`\`cypher
MATCH (p:Person)
RETURN p.name, p.age
\`\`\`

**SPARQL:**
\`\`\`sparql
SELECT ?name ?age
WHERE {
  ?p rdf:type ex:Person .
  ?p ex:name ?name .
  OPTIONAL { ?p ex:age ?age }
}
\`\`\`

## 관계 탐색

### 친구의 친구

**Cypher:**
\`\`\`cypher
MATCH (p:Person {name: "김철수"})-[:KNOWS*2]->(fof:Person)
RETURN DISTINCT fof.name
\`\`\`

**SPARQL:**
\`\`\`sparql
SELECT DISTINCT ?fofName
WHERE {
  ex:Kim foaf:knows/foaf:knows ?fof .
  ?fof foaf:name ?fofName .
}
\`\`\`

## 조건 필터

### 30세 이상 직원

**Cypher:**
\`\`\`cypher
MATCH (e:Employee)
WHERE e.age >= 30
RETURN e.name, e.age
ORDER BY e.age DESC
\`\`\`

**SPARQL:**
\`\`\`sparql
SELECT ?name ?age
WHERE {
  ?e rdf:type ex:Employee ;
     ex:name ?name ;
     ex:age ?age .
  FILTER (?age >= 30)
}
ORDER BY DESC(?age)
\`\`\`

## 집계

### 부서별 직원 수

**Cypher:**
\`\`\`cypher
MATCH (e:Employee)-[:BELONGS_TO]->(d:Department)
RETURN d.name, COUNT(e) AS count
ORDER BY count DESC
\`\`\`

**SPARQL:**
\`\`\`sparql
SELECT ?deptName (COUNT(?e) AS ?count)
WHERE {
  ?e rdf:type ex:Employee ;
     ex:belongsTo ?d .
  ?d ex:name ?deptName .
}
GROUP BY ?deptName
ORDER BY DESC(?count)
\`\`\`

## 경로 탐색

### 최단 경로

**Cypher:**
\`\`\`cypher
MATCH path = shortestPath(
  (a:Person {name: "김철수"})-[*]-(b:Person {name: "이영희"})
)
RETURN path
\`\`\`

**SPARQL:**
\`\`\`sparql
# SPARQL 1.1 표준에 최단 경로 없음
# Property Path로 제한된 탐색만 가능
SELECT ?path
WHERE {
  ex:Kim (foaf:knows)+ ex:Lee .
}
\`\`\`

## 비교 요약

| 기능 | Cypher | SPARQL |
|------|--------|--------|
| 가독성 | 높음 (ASCII Art) | 중간 |
| 경로 탐색 | 강력 | 제한적 |
| 집계 | 유사 | 유사 |
| 서브쿼리 | 지원 | 지원 |
| 추론 | 없음 | Reasoner 연동 |
| 그래프 생성 | CREATE | CONSTRUCT |
      `,
      keyPoints: ['Cypher는 ASCII Art 패턴 매칭', 'SPARQL은 트리플 패턴', 'Cypher가 경로 탐색에 강점'],
      practiceGoal: '두 쿼리 언어를 비교할 수 있다',
    }),

    createReadingTask('w5d4-ecosystem', '에코시스템과 도구', 30, {
      introduction: `
# 에코시스템과 도구

## Property Graph 에코시스템

### 데이터베이스
| 제품 | 특징 |
|------|------|
| Neo4j | 가장 인기, 상용/커뮤니티 |
| Amazon Neptune | AWS 관리형 |
| TigerGraph | 분산 분석 |
| Memgraph | 인메모리, 실시간 |
| JanusGraph | 분산, 오픈소스 |

### 도구
- **Neo4j Browser**: 시각화, 쿼리
- **Neo4j Bloom**: 비개발자용 탐색
- **GraphQL**: API 연동
- **LangChain**: LLM 연동

### 라이브러리
\`\`\`python
# Neo4j Python Driver
from neo4j import GraphDatabase

# NetworkX (분석)
import networkx as nx

# PyVis (시각화)
from pyvis.network import Network
\`\`\`

## RDF 에코시스템

### Triple Stores
| 제품 | 특징 |
|------|------|
| Apache Jena | 오픈소스, 자바 |
| Virtuoso | 상용, 고성능 |
| GraphDB (Ontotext) | 추론 강력 |
| Stardog | 엔터프라이즈 |
| Amazon Neptune | PG + RDF 지원 |

### 도구
- **Protégé**: 온톨로지 편집기 (Stanford)
- **TopBraid**: 상용 온톨로지 도구
- **YASGUI**: SPARQL 편집기

### 라이브러리
\`\`\`python
# RDFLib
from rdflib import Graph, Namespace

# OWLReady2
from owlready2 import *

# SPARQLWrapper
from SPARQLWrapper import SPARQLWrapper
\`\`\`

## 연동 솔루션

\`\`\`
Neo4j ←→ RDF 변환
─────────────────
- neosemantics (n10s): Neo4j에서 RDF import/export
- RDF2PG: RDF를 Property Graph로 변환

예시 (neosemantics):
CALL n10s.rdf.import.fetch("http://example.org/data.ttl", "Turtle")
\`\`\`
      `,
      keyPoints: ['Neo4j가 PG 시장 선도', 'RDF는 Jena, Virtuoso 등', 'neosemantics로 Neo4j-RDF 연동 가능'],
      practiceGoal: '각 에코시스템의 도구를 파악한다',
    }),

    createReadingTask('w5d4-use-cases', '사용 사례와 선택 기준', 30, {
      introduction: `
# 사용 사례와 선택 기준

## Property Graph 적합 사례

### 1. 소셜 네트워크
\`\`\`cypher
// 친구 추천
MATCH (me:User {id: $userId})-[:FOLLOWS]->(:User)<-[:FOLLOWS]-(suggestion)
WHERE NOT (me)-[:FOLLOWS]->(suggestion) AND me <> suggestion
RETURN suggestion, COUNT(*) AS mutualFollowers
ORDER BY mutualFollowers DESC
LIMIT 10
\`\`\`

### 2. 추천 시스템
\`\`\`cypher
// 협업 필터링
MATCH (u:User {id: $userId})-[:PURCHASED]->(p:Product)<-[:PURCHASED]-(similar)
      -[:PURCHASED]->(rec:Product)
WHERE NOT (u)-[:PURCHASED]->(rec)
RETURN rec, COUNT(*) AS score
ORDER BY score DESC
\`\`\`

### 3. 사기 탐지
\`\`\`cypher
// 의심스러운 거래 패턴
MATCH (a:Account)-[:TRANSFERRED*3..5]->(a)
WHERE ALL(t IN relationships(path) WHERE t.amount > 10000)
RETURN a
\`\`\`

## RDF 적합 사례

### 1. 의료/생명과학
\`\`\`sparql
# 약물-질병 관계 (FHIR 온톨로지)
SELECT ?drug ?disease ?mechanism
WHERE {
  ?drug a fhir:Medication ;
        fhir:treats ?disease .
  ?disease a fhir:Condition .
  OPTIONAL { ?drug fhir:mechanism ?mechanism }
}
\`\`\`

### 2. 금융 규제 (FIBO)
\`\`\`sparql
# 금융 상품 분류 (추론 활용)
SELECT ?product ?category
WHERE {
  ?product a fibo:FinancialInstrument .
  ?product fibo:hasCategory ?category .
}
\`\`\`

### 3. 데이터 통합
\`\`\`sparql
# 이기종 데이터 통합
SELECT ?entity ?label
WHERE {
  { ?entity rdfs:label ?label } UNION
  { ?entity skos:prefLabel ?label } UNION
  { ?entity foaf:name ?label }
}
\`\`\`

## 선택 기준

| 기준 | Property Graph | RDF |
|------|---------------|-----|
| 팀 역량 | 개발자 친화적 | 온톨로지 전문가 필요 |
| 데이터 특성 | 관계 속성 중요 | 표준 어휘 중요 |
| 추론 필요 | 제한적 | 강력 |
| 표준화 | GQL (진행 중) | W3C 표준 |
| 생태계 | 활발, 성장 중 | 성숙, 학술 중심 |
| 사용처 | 기업 애플리케이션 | 정부, 의료, 연구 |

## 하이브리드 접근

\`\`\`
실무 권장:
1. 기본: Property Graph (Neo4j)
2. 외부 지식: RDF 엔드포인트 연동 (Wikidata, DBpedia)
3. 필요시: neosemantics로 RDF import

예시 아키텍처:
┌─────────────┐     ┌──────────────┐
│ Neo4j       │ ←── │ Wikidata     │
│ (운영 데이터)│     │ (외부 지식)   │
└─────────────┘     └──────────────┘
       ↓
┌─────────────┐
│ GraphRAG    │
│ (LLM 연동)  │
└─────────────┘
\`\`\`
      `,
      keyPoints: ['PG: 소셜, 추천, 사기 탐지', 'RDF: 의료, 금융, 데이터 통합', '하이브리드 접근이 실용적'],
      practiceGoal: '적절한 기술을 선택할 수 있다',
    }),

    createQuizTask('w5d4-quiz', 'Day 4 복습 퀴즈', 15, {
      introduction: '# Day 4 복습 퀴즈',
      questions: [
        {
          id: 'w5d4-q1',
          question: 'Property Graph에서 관계(Edge)의 특징은?',
          options: ['속성 저장 불가', '방향 없음', '속성 저장 가능, 방향 있음', '여러 타입 가능'],
          correctAnswer: 2,
          explanation: 'Property Graph의 관계는 속성을 직접 저장할 수 있고, 항상 방향이 있습니다.',
        },
        {
          id: 'w5d4-q2',
          question: 'RDF에서 관계의 속성을 표현하는 방법은?',
          options: ['직접 저장', 'Reification 또는 Named Graph', '불가능', 'Cypher 사용'],
          correctAnswer: 1,
          explanation: 'RDF는 트리플 기반이므로 관계 속성은 Reification이나 Named Graph로 표현합니다.',
        },
        {
          id: 'w5d4-q3',
          question: 'Neo4j에서 RDF를 import하는 도구는?',
          options: ['RDFLib', 'neosemantics (n10s)', 'SPARQL', 'Protégé'],
          correctAnswer: 1,
          explanation: 'neosemantics(n10s)는 Neo4j에서 RDF를 import/export하는 플러그인입니다.',
        },
      ],
      keyPoints: ['PG 관계는 속성+방향', 'RDF는 Reification 필요', 'n10s로 Neo4j-RDF 연동'],
      practiceGoal: '두 모델의 차이를 확인한다',
    }),
  ],

  challenge: createChallengeTask('w5d4-challenge', 'Challenge: 기술 비교 리포트', 60, {
    introduction: `
# Challenge: 기술 비교 리포트

## 과제

Property Graph와 RDF를 비교 분석하는 리포트를 작성하세요.

## 구성 (2-3페이지)

1. **데이터 모델 비교**
   - 동일 시나리오를 두 모델로 표현
   - 장단점 분석

2. **쿼리 비교**
   - 동일 질의를 Cypher와 SPARQL로 작성
   - 가독성, 성능 비교

3. **사용 사례 분석**
   - 각 모델이 적합한 상황
   - 실제 기업/기관 사례

4. **권장사항**
   - 프로젝트 상황별 선택 기준
   - 하이브리드 접근법

## 제출물

- PDF 리포트 (2-3페이지)
- 코드 예시 포함
    `,
    keyPoints: ['객관적 비교 분석', '코드 예시 포함', '실제 사례 조사'],
    practiceGoal: '기술 선택을 위한 분석 역량을 기른다',
  }),
}
