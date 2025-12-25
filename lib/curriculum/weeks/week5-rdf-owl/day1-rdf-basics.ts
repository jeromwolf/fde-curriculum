// Day 1: RDF 기초 - 트리플과 시맨틱 웹의 기반

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day1RdfBasics: Day = {
  slug: 'rdf-basics',
  title: 'RDF 기초',
  totalDuration: 240,
  tasks: [
    createVideoTask('w5d1-semantic-web-overview', '시맨틱 웹과 RDF 개요', 30, {
      introduction: `
# 시맨틱 웹과 RDF 개요

## 시맨틱 웹이란?

시맨틱 웹(Semantic Web)은 팀 버너스-리가 제안한 **기계가 이해할 수 있는 웹**입니다.

\`\`\`
현재 웹: 사람이 읽고 이해
시맨틱 웹: 기계가 의미를 이해하고 추론

예시:
현재: "Apple" → 사과? 회사?
시맨틱: <http://dbpedia.org/resource/Apple_Inc> → 명확히 Apple 회사
\`\`\`

## 시맨틱 웹 계층 구조

\`\`\`
┌─────────────────────────────────┐
│         Trust (신뢰)            │
├─────────────────────────────────┤
│         Proof (증명)            │
├─────────────────────────────────┤
│      Rules (규칙/추론)          │
├─────────────────────────────────┤
│   OWL (온톨로지 언어)           │
├─────────────────────────────────┤
│   RDFS (스키마)                 │
├─────────────────────────────────┤
│   RDF (데이터 모델)             │ ← 오늘 배울 내용
├─────────────────────────────────┤
│   XML + URI + Unicode           │
└─────────────────────────────────┘
\`\`\`

## 왜 RDF가 필요한가?

| 문제 | RDF 해결책 |
|------|-----------|
| 데이터 형식 파편화 | 표준 데이터 모델 |
| 의미 모호성 | URI로 명확한 식별 |
| 데이터 연결 어려움 | 링크드 데이터 |
| 추론 불가 | 온톨로지 + Reasoner |
      `,
      keyPoints: ['시맨틱 웹은 기계가 이해하는 웹', 'RDF는 시맨틱 웹의 데이터 모델', 'URI로 모든 것을 식별'],
      practiceGoal: '시맨틱 웹의 개념과 RDF의 역할을 이해한다',
    }),

    createReadingTask('w5d1-rdf-triple', 'RDF 트리플 구조', 35, {
      introduction: `
# RDF 트리플 구조

## 트리플이란?

RDF의 기본 단위는 **트리플(Triple)**입니다.

\`\`\`
Subject - Predicate - Object
(주어)    (서술어)    (목적어)

예시:
Kim - knows - Lee
삼성전자 - hasHeadquarters - 수원

영문으로:
<Subject> <Predicate> <Object> .
\`\`\`

## URI (Uniform Resource Identifier)

모든 것은 URI로 식별됩니다.

\`\`\`
<http://example.org/person/Kim>     # 주어: Kim이라는 사람
<http://xmlns.com/foaf/0.1/knows>   # 서술어: knows 관계
<http://example.org/person/Lee>     # 목적어: Lee라는 사람

네임스페이스 사용:
@prefix ex: <http://example.org/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

ex:Kim foaf:knows ex:Lee .
\`\`\`

## 리터럴 (Literal)

목적어는 URI 대신 **리터럴**(값)일 수 있습니다.

\`\`\`turtle
ex:Kim foaf:name "김철수" .              # 문자열
ex:Kim foaf:age "30"^^xsd:integer .     # 정수
ex:Kim foaf:birthDate "1994-05-15"^^xsd:date .  # 날짜

언어 태그:
ex:Kim foaf:name "Kim Cheolsu"@en .
ex:Kim foaf:name "김철수"@ko .
\`\`\`

## 공백 노드 (Blank Node)

URI 없이 익명 노드를 만들 수 있습니다.

\`\`\`turtle
ex:Kim foaf:address [
  ex:city "Seoul" ;
  ex:country "Korea"
] .

# 또는
ex:Kim foaf:address _:addr1 .
_:addr1 ex:city "Seoul" .
_:addr1 ex:country "Korea" .
\`\`\`

## 트리플 예시

\`\`\`turtle
@prefix ex: <http://example.org/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

# Kim은 Person 타입
ex:Kim rdf:type foaf:Person .

# Kim의 속성들
ex:Kim foaf:name "김철수" .
ex:Kim foaf:age "30"^^xsd:integer .
ex:Kim foaf:mbox <mailto:kim@example.org> .

# Kim은 Lee를 안다
ex:Kim foaf:knows ex:Lee .

# Lee도 Person
ex:Lee rdf:type foaf:Person .
ex:Lee foaf:name "이영희" .
\`\`\`
      `,
      keyPoints: ['트리플 = Subject + Predicate + Object', 'URI로 리소스 식별', '리터럴로 값 표현', '공백 노드로 익명 구조'],
      practiceGoal: 'RDF 트리플의 구조를 이해하고 작성할 수 있다',
    }),

    createReadingTask('w5d1-rdf-formats', 'RDF 직렬화 형식', 30, {
      introduction: `
# RDF 직렬화 형식

RDF 그래프는 다양한 형식으로 저장/전송됩니다.

## 1. Turtle (.ttl) - 가장 읽기 쉬움

\`\`\`turtle
@prefix ex: <http://example.org/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

ex:Kim a foaf:Person ;
    foaf:name "김철수" ;
    foaf:knows ex:Lee, ex:Park .

ex:Lee a foaf:Person ;
    foaf:name "이영희" .
\`\`\`

**특징**:
- 사람이 읽기 쉬움
- 'a'는 rdf:type의 축약
- ';'로 같은 주어 연속
- ','로 같은 서술어 연속

## 2. N-Triples (.nt) - 한 줄 한 트리플

\`\`\`
<http://example.org/Kim> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
<http://example.org/Kim> <http://xmlns.com/foaf/0.1/name> "김철수" .
<http://example.org/Kim> <http://xmlns.com/foaf/0.1/knows> <http://example.org/Lee> .
\`\`\`

**특징**:
- 네임스페이스 축약 없음
- 한 줄에 한 트리플
- 파싱이 단순 (빅데이터 처리)

## 3. JSON-LD (.jsonld) - 웹 친화적

\`\`\`json
{
  "@context": {
    "foaf": "http://xmlns.com/foaf/0.1/",
    "name": "foaf:name",
    "knows": { "@id": "foaf:knows", "@type": "@id" }
  },
  "@id": "http://example.org/Kim",
  "@type": "foaf:Person",
  "name": "김철수",
  "knows": "http://example.org/Lee"
}
\`\`\`

**특징**:
- JSON 형식으로 웹 개발자 친화적
- Schema.org와 함께 SEO에 사용
- @context로 의미 부여

## 4. RDF/XML (.rdf) - 원래 표준

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:foaf="http://xmlns.com/foaf/0.1/">
  <foaf:Person rdf:about="http://example.org/Kim">
    <foaf:name>김철수</foaf:name>
    <foaf:knows rdf:resource="http://example.org/Lee"/>
  </foaf:Person>
</rdf:RDF>
\`\`\`

**특징**:
- 원래 RDF 표준 형식
- 장황하고 읽기 어려움
- 현재는 Turtle 선호

## 형식 비교

| 형식 | 확장자 | 장점 | 단점 | 용도 |
|------|-------|------|------|------|
| Turtle | .ttl | 읽기 쉬움 | - | 일반 작업 |
| N-Triples | .nt | 파싱 단순 | 장황함 | 빅데이터 |
| JSON-LD | .jsonld | 웹 친화적 | 복잡한 그래프 어려움 | SEO, API |
| RDF/XML | .rdf | 표준 | 읽기 어려움 | 레거시 |
      `,
      keyPoints: ['Turtle이 가장 읽기 쉬움', 'JSON-LD는 웹 개발에 유용', 'N-Triples는 빅데이터 처리에 적합'],
      practiceGoal: '다양한 RDF 형식을 이해하고 Turtle을 읽고 쓸 수 있다',
    }),

    createCodeTask('w5d1-turtle-practice', 'Turtle 형식 실습', 40, {
      introduction: `
# Turtle 형식 실습

## 실습 1: 기본 트리플 작성

다음 정보를 Turtle로 표현하세요:
- 삼성전자는 회사(Company)이다
- 삼성전자의 본사는 수원이다
- 삼성전자는 1969년에 설립되었다
- 삼성전자는 SK하이닉스와 경쟁한다

\`\`\`turtle
@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

# 여기에 작성
ex:Samsung rdf:type ex:Company .
ex:Samsung ex:headquarters "Suwon" .
ex:Samsung ex:foundedYear "1969"^^xsd:gYear .
ex:Samsung ex:competesWith ex:SKHynix .
\`\`\`

## 실습 2: 축약 문법 활용

\`\`\`turtle
@prefix ex: <http://example.org/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

# 같은 주어 축약 (;)
ex:Kim a foaf:Person ;
    foaf:name "김철수" ;
    foaf:age "30"^^xsd:integer ;
    foaf:mbox <mailto:kim@example.org> .

# 같은 서술어 축약 (,)
ex:Kim foaf:knows ex:Lee, ex:Park, ex:Choi .
\`\`\`

## 실습 3: 공백 노드

\`\`\`turtle
@prefix ex: <http://example.org/> .

ex:Samsung ex:ceo [
    a foaf:Person ;
    foaf:name "이재용" ;
    ex:title "회장"
] .

# 동일한 표현 (명시적 공백 노드)
ex:Samsung ex:ceo _:ceo1 .
_:ceo1 a foaf:Person .
_:ceo1 foaf:name "이재용" .
_:ceo1 ex:title "회장" .
\`\`\`

## 실습 4: 컬렉션

\`\`\`turtle
@prefix ex: <http://example.org/> .

# 순서 있는 목록 (rdf:List)
ex:Samsung ex:subsidiaries (
    ex:SamsungElectronics
    ex:SamsungDisplay
    ex:SamsungSDI
) .

# 순서 없는 집합 (Bag)
ex:Samsung ex:products [
    a rdf:Bag ;
    rdf:_1 "Galaxy S24" ;
    rdf:_2 "QLED TV" ;
    rdf:_3 "SSD"
] .
\`\`\`

## 온라인 도구

- **RDF Playground**: https://rdfplayground.dcc.uchile.cl/
- **EasyRDF Converter**: https://www.easyrdf.org/converter
      `,
      keyPoints: ['네임스페이스 선언으로 URI 축약', "';'로 같은 주어, ','로 같은 서술어 축약", '공백 노드로 익명 구조 표현'],
      practiceGoal: 'Turtle 형식으로 RDF 그래프를 작성할 수 있다',
    }),

    createReadingTask('w5d1-namespaces', '표준 네임스페이스와 어휘', 25, {
      introduction: `
# 표준 네임스페이스와 어휘

## 핵심 네임스페이스

\`\`\`turtle
# RDF 핵심
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .

# 일반 어휘
@prefix foaf: <http://xmlns.com/foaf/0.1/> .     # Friend of a Friend
@prefix dc: <http://purl.org/dc/elements/1.1/> . # Dublin Core
@prefix schema: <http://schema.org/> .           # Schema.org
@prefix skos: <http://www.w3.org/2004/02/skos/core#> . # 지식 조직
\`\`\`

## FOAF (Friend of a Friend)

사람과 소셜 네트워크를 표현합니다.

\`\`\`turtle
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

ex:Kim a foaf:Person ;
    foaf:name "김철수" ;
    foaf:givenName "철수" ;
    foaf:familyName "김" ;
    foaf:mbox <mailto:kim@example.org> ;
    foaf:homepage <http://kim.example.org> ;
    foaf:knows ex:Lee ;
    foaf:interest <http://dbpedia.org/resource/Programming> .
\`\`\`

## Dublin Core (DC)

문서/리소스 메타데이터의 표준입니다.

\`\`\`turtle
@prefix dc: <http://purl.org/dc/elements/1.1/> .
@prefix dcterms: <http://purl.org/dc/terms/> .

ex:MyBook a dcterms:BibliographicResource ;
    dc:title "시맨틱 웹 입문" ;
    dc:creator "김철수" ;
    dc:date "2024-01-15" ;
    dc:subject "Semantic Web", "RDF" ;
    dc:language "ko" ;
    dc:format "application/pdf" .
\`\`\`

## Schema.org

검색 엔진이 이해하는 웹 페이지 구조화 데이터입니다.

\`\`\`json-ld
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "삼성전자",
  "url": "https://www.samsung.com",
  "logo": "https://www.samsung.com/logo.png",
  "foundingDate": "1969-01-13",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "수원",
    "addressCountry": "KR"
  }
}
\`\`\`

## 주요 URI 조회

| 도메인 | 용도 | URI |
|--------|------|-----|
| DBpedia | 위키피디아 데이터 | http://dbpedia.org/resource/ |
| Wikidata | 구조화된 위키 | http://www.wikidata.org/entity/ |
| GeoNames | 지리 정보 | http://sws.geonames.org/ |
| FIBO | 금융 온톨로지 | https://spec.edmcouncil.org/fibo/ |
      `,
      keyPoints: ['FOAF: 사람/소셜 네트워크', 'Dublin Core: 문서 메타데이터', 'Schema.org: SEO/검색 최적화'],
      practiceGoal: '표준 어휘를 사용하여 RDF를 작성할 수 있다',
    }),

    createCodeTask('w5d1-rdf-graph', 'RDF 그래프 실습', 35, {
      introduction: `
# RDF 그래프 실습

## 실습: 기업 Knowledge Graph를 RDF로 표현

다음 정보를 Turtle로 작성하세요:

**요구사항:**
1. 삼성전자, SK하이닉스, NVIDIA 회사 정보
2. 각 회사의 CEO, 본사, 설립년도
3. 회사 간 관계 (경쟁, 공급)

\`\`\`turtle
@prefix ex: <http://example.org/company/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix schema: <http://schema.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

# 삼성전자
ex:Samsung a schema:Organization ;
    schema:name "삼성전자"@ko, "Samsung Electronics"@en ;
    schema:foundingDate "1969-01-13"^^xsd:date ;
    schema:location [
        a schema:Place ;
        schema:name "수원" ;
        schema:addressCountry "KR"
    ] ;
    ex:ceo [
        a foaf:Person ;
        foaf:name "이재용"
    ] ;
    ex:competesWith ex:SKHynix ;
    ex:suppliesTo ex:Apple, ex:NVIDIA .

# SK하이닉스
ex:SKHynix a schema:Organization ;
    schema:name "SK하이닉스"@ko, "SK Hynix"@en ;
    schema:foundingDate "1983-02-01"^^xsd:date ;
    schema:location [
        a schema:Place ;
        schema:name "이천" ;
        schema:addressCountry "KR"
    ] ;
    ex:competesWith ex:Samsung, ex:Micron ;
    ex:suppliesTo ex:NVIDIA, ex:Apple .

# NVIDIA
ex:NVIDIA a schema:Organization ;
    schema:name "NVIDIA" ;
    schema:foundingDate "1993-01-01"^^xsd:date ;
    schema:location [
        a schema:Place ;
        schema:name "Santa Clara" ;
        schema:addressCountry "US"
    ] ;
    ex:competesWith ex:AMD, ex:Intel .
\`\`\`

## 그래프 시각화

\`\`\`
Samsung ──competesWith──▶ SKHynix
   │                         │
   │ suppliesTo             │ suppliesTo
   ▼                         ▼
Apple ◀─────────────────────┘

Samsung ──suppliesTo──▶ NVIDIA ──competesWith──▶ AMD
\`\`\`
      `,
      keyPoints: ['schema:Organization으로 회사 표현', '다국어 지원 (@ko, @en)', '관계는 커스텀 프로퍼티로 정의'],
      practiceGoal: '실제 도메인 데이터를 RDF로 모델링할 수 있다',
    }),

    createQuizTask('w5d1-quiz', 'Day 1 복습 퀴즈', 15, {
      introduction: '# Day 1 복습 퀴즈',
      questions: [
        {
          id: 'w5d1-q1',
          question: 'RDF 트리플의 세 가지 구성 요소는?',
          options: ['Node, Edge, Property', 'Subject, Predicate, Object', 'Class, Instance, Relation', 'Entity, Attribute, Value'],
          correctAnswer: 1,
          explanation: 'RDF 트리플은 Subject(주어), Predicate(서술어), Object(목적어)로 구성됩니다.',
        },
        {
          id: 'w5d1-q2',
          question: '가장 읽기 쉬운 RDF 직렬화 형식은?',
          options: ['RDF/XML', 'N-Triples', 'Turtle', 'N-Quads'],
          correctAnswer: 2,
          explanation: 'Turtle은 네임스페이스 축약과 간결한 문법으로 사람이 읽고 쓰기 가장 쉽습니다.',
        },
        {
          id: 'w5d1-q3',
          question: 'Turtle에서 rdf:type의 축약 표현은?',
          options: ['@type', 'type:', 'a', ':type'],
          correctAnswer: 2,
          explanation: 'Turtle에서 "a"는 rdf:type의 축약입니다. ex:Kim a foaf:Person .',
        },
      ],
      keyPoints: ['트리플 = S-P-O', 'Turtle이 가장 읽기 쉬움', 'a = rdf:type'],
      practiceGoal: 'RDF 기본 개념을 확인한다',
    }),
  ],

  challenge: createChallengeTask('w5d1-challenge', 'Challenge: 개인 프로필 RDF 작성', 30, {
    introduction: `
# Challenge: 개인 프로필 RDF 작성

## 과제

자신의 프로필 정보를 FOAF와 Schema.org 어휘를 사용하여 Turtle로 작성하세요.

## 요구사항

1. **기본 정보**: 이름, 이메일, 홈페이지
2. **소셜 관계**: 아는 사람 3명 이상
3. **관심사**: 3개 이상 (DBpedia URI 사용)
4. **소속 조직**: 회사/학교 정보

## 힌트

\`\`\`turtle
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix schema: <http://schema.org/> .
@prefix dbr: <http://dbpedia.org/resource/> .

<http://example.org/me> a foaf:Person ;
    foaf:name "..." ;
    foaf:interest dbr:Machine_learning ;
    schema:worksFor [ a schema:Organization ; ... ] .
\`\`\`
    `,
    keyPoints: ['FOAF 어휘 활용', 'DBpedia URI 연결', 'Schema.org 조직 정보'],
    practiceGoal: '실제 정보를 RDF로 표현하는 능력을 기른다',
  }),
}
