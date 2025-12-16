# 온톨로지 & Knowledge Graph 전문 커리큘럼 (12주)

> **목표**: 온톨로지의 기초부터 실무 Knowledge Graph 구축, GraphRAG까지 마스터
>
> **기간**: 12주 (주 10-15시간)
>
> **선수 조건**: 프로그래밍 기초 (Python), 데이터베이스 기초
>
> **실습 환경**:
> - KSS-Ontology 시뮬레이터: https://ontology.kss.ai.kr
> - Protégé: https://protege.stanford.edu
> - Apache Fuseki (SPARQL 서버)
> - Neo4j Desktop / Aura

---

## 📚 목차

1. [커리큘럼 설계 원칙](#커리큘럼-설계-원칙)
2. [커리큘럼 개요](#커리큘럼-개요)
3. [Module 1: 온톨로지 기초](#module-1-온톨로지-기초-week-1-2) (Week 1-2)
4. [Module 2: RDF & 트리플](#module-2-rdf--트리플-week-3-4) (Week 3-4)
5. [Module 3: RDFS & OWL](#module-3-rdfs--owl-week-5-6) (Week 5-6)
6. [Module 4: SPARQL](#module-4-sparql-week-7-8) (Week 7-8)
7. [Module 5: Knowledge Graph 구축](#module-5-knowledge-graph-구축-week-9-10) (Week 9-10)
8. [Module 6: GraphRAG & LLM 통합](#module-6-graphrag--llm-통합-week-11-12) (Week 11-12)
9. [부록 A: KSS 시뮬레이터 활용 가이드](#부록-a-kss-시뮬레이터-활용-가이드)
10. [부록 B: 추천 자료](#부록-b-추천-자료)
11. [부록 C: 자격증 로드맵](#부록-c-자격증-로드맵)
12. [부록 D: 프로젝트 아이디어](#부록-d-프로젝트-아이디어)

---

## 커리큘럼 설계 원칙

이 커리큘럼은 다음 원칙에 따라 설계되었습니다:

1. **핵심 질문 중심**: 매주 답해야 할 핵심 질문으로 시작
2. **실습 우선**: 이론 30% + 실습 70% 비율
3. **한국 데이터 활용**: 서울시 공공데이터 등 실제 한국 데이터로 실습
4. **결과물 중심**: 매 모듈마다 포트폴리오에 넣을 수 있는 산출물
5. **도구 다양성**: Protégé, Fuseki, Neo4j, LangChain 등 실무 도구

---

## 참고 자료 및 영감

| 출처 | 활용 포인트 |
|------|------------|
| [Stanford CS520](https://web.stanford.edu/class/cs520/) | 핵심 질문 구조, 산업 사례 |
| [Neo4j GraphAcademy](https://graphacademy.neo4j.com/) | 모듈식 실습, 인증 체계 |
| [RPI Ontology Engineering](https://tw.rpi.edu/courses/Ontologies) | 프로젝트 기반, Protégé 심화 |
| 서울시 공공데이터 온톨로지 | 한국 실무 데이터, Fuseki 실습 |

---

## 커리큘럼 개요

| 주차 | 모듈 | 핵심 질문 | 결과물 |
|------|------|----------|--------|
| 1-2 | Module 1 | **온톨로지란 무엇이고, 왜 필요한가?** | 미니 온톨로지 설계서 |
| 3-4 | Module 2 | **데이터를 어떻게 트리플로 표현하는가?** | RDF 데이터셋 (한국 데이터) |
| 5-6 | Module 3 | **스키마와 추론은 어떻게 작동하는가?** | OWL 온톨로지 + 추론 결과 |
| 7-8 | Module 4 | **Knowledge Graph에서 어떻게 질문하는가?** | SPARQL 쿼리 모음 + Fuseki 서버 |
| 9-10 | Module 5 | **실무에서 KG를 어떻게 구축하는가?** | Neo4j 기반 도메인 KG |
| 11-12 | Module 6 | **KG와 LLM을 어떻게 통합하는가?** | GraphRAG 챗봇 (최종 프로젝트) |

### 학습 시간 배분

```
각 모듈 (2주): 총 20-30시간
├── 이론 학습: 6시간 (30%)
├── 실습/코딩: 10시간 (50%)
└── 프로젝트: 4시간 (20%)
```

---

## Module 1: 온톨로지 기초 (Week 1-2)

> **왜 배우는가?**
> 온톨로지는 Knowledge Graph의 "설계도"입니다. 건물을 짓기 전에 설계도가 필요하듯,
> 지식 그래프를 구축하기 전에 "어떤 개념이 있고, 어떻게 연결되는가"를 정의해야 합니다.
> 이 모듈에서는 개념 모델링 사고방식을 익히고, 실제 도구(Protégé)를 사용해봅니다.

### Week 1: 온톨로지란 무엇인가?

#### 학습 목표
- [ ] 온톨로지의 정의와 목적을 설명할 수 있다
- [ ] 온톨로지와 데이터베이스의 차이를 이해할 수 있다
- [ ] 실제 온톨로지 사용 사례를 3가지 이상 설명할 수 있다
- [ ] 기본적인 개념 모델링을 할 수 있다
- [ ] **Protégé를 설치하고 기본 조작을 할 수 있다** ⭐

#### 핵심 개념

**1. 온톨로지의 정의**
```
철학적 정의:
- 존재론(存在論): 존재하는 것들의 본질과 구조에 대한 탐구

정보과학적 정의:
- "공유된 개념화의 명시적 명세" (Gruber, 1993)
- 특정 도메인의 개념, 관계, 제약조건을 형식적으로 표현한 것

쉬운 설명:
- "세상을 어떻게 이해하고 분류할 것인가"에 대한 합의된 모델
- 컴퓨터가 이해할 수 있는 형태로 지식을 표현하는 방법

실생활 비유:
┌─────────────────────────────────────────────────────────┐
│ 도서관 분류 체계 = 온톨로지                               │
├─────────────────────────────────────────────────────────┤
│ • 000 총류                                               │
│   ├── 010 도서관학                                       │
│   ├── 020 문헌정보학                                     │
│   └── ...                                               │
│ • 100 철학                                               │
│ • 200 종교                                               │
│ ...                                                     │
│                                                         │
│ → 모든 책이 어디에 속하는지 "합의된 체계"                  │
│ → 새 책이 와도 어디에 넣을지 "규칙"이 있음                 │
│ → 컴퓨터가 이해하면? → 지식 그래프!                       │
└─────────────────────────────────────────────────────────┘
```

**2. 온톨로지 vs 다른 데이터 모델**

| 구분 | 관계형 DB | NoSQL | 온톨로지 |
|------|----------|-------|----------|
| 목적 | 데이터 저장 | 유연한 저장 | 지식 표현 |
| 스키마 | 엄격 (테이블) | 유연 | 의미론적 |
| 관계 | 외래키 | 임베딩/참조 | 명시적 의미 |
| 추론 | 불가능 | 불가능 | 가능 |
| 표준 | SQL | 다양 | RDF/OWL |

**3. 온톨로지의 구성 요소**
```
1. 클래스 (Class): 개념의 범주
   - 예: Person, Organization, Event

2. 인스턴스 (Instance): 클래스의 구체적 개체
   - 예: "홍길동"은 Person의 인스턴스

3. 속성 (Property): 개체의 특성
   - 데이터 속성: hasName, hasAge (값)
   - 객체 속성: worksFor, knows (다른 개체)

4. 관계 (Relationship): 개체 간 연결
   - 예: 홍길동 worksFor 삼성전자

5. 제약조건 (Constraint): 규칙
   - 예: Person은 반드시 hasName을 가진다
```

**4. 실제 사용 사례**

| 도메인 | 온톨로지 | 설명 |
|--------|----------|------|
| 검색 | Google Knowledge Graph | 검색 결과 향상 |
| 의료 | SNOMED CT, FHIR | 질병/증상 표준화 |
| 금융 | FIBO | 금융 개념 표준화 |
| 생명과학 | Gene Ontology | 유전자 기능 분류 |
| 일반 | Schema.org | 웹 데이터 구조화 |
| 백과사전 | Wikidata | 구조화된 지식 |

#### 실습: 개념 모델링

**실습 1: 대학교 도메인 모델링**
```
요구사항:
대학교의 주요 개념들을 온톨로지로 모델링하세요.

포함해야 할 개념:
- 사람 (학생, 교수, 직원)
- 조직 (학과, 단과대학)
- 교육 (강좌, 학기)
- 시설 (건물, 강의실)

산출물:
1. 클래스 계층도 (그림)
2. 주요 속성 목록
3. 관계 정의 5개 이상
```

**실습 2: 온라인 쇼핑몰 모델링**
```
개념:
- Customer, Product, Order, Category, Review

관계:
- Customer places Order
- Order contains Product
- Product belongsTo Category
- Customer writes Review about Product

질문:
1. "이 고객이 구매한 모든 제품은?"
2. "이 제품을 산 다른 고객들은?"
3. "이 카테고리에서 가장 인기 있는 제품은?"

→ 온톨로지로 이런 질문에 쉽게 답할 수 있음
```

#### 🛠️ 실습: Protégé 시작하기

**Protégé란?**
- Stanford 대학에서 개발한 무료 온톨로지 편집기
- 전 세계 온톨로지 연구자/개발자가 사용하는 표준 도구
- OWL/RDF 온톨로지 생성, 편집, 시각화 지원

**설치 (필수)**
```bash
# 다운로드: https://protege.stanford.edu/
# 권장 버전: Protégé Desktop 5.6.x

# macOS
brew install --cask protege

# Windows/Linux
# 공식 사이트에서 직접 다운로드
```

**첫 온톨로지 만들기**
```
1. Protégé 실행 → File → New Ontology
2. IRI 설정: http://example.org/my-first-ontology
3. Classes 탭에서 클래스 추가:
   - owl:Thing (루트)
     ├── Person
     │   ├── Student
     │   └── Professor
     └── Organization
         ├── University
         └── Company

4. Object Properties 탭에서 관계 추가:
   - worksFor (domain: Person, range: Organization)
   - enrolledIn (domain: Student, range: University)
   - teaches (domain: Professor)

5. Individuals 탭에서 인스턴스 추가:
   - 홍길동 (type: Student)
   - 서울대학교 (type: University)
   - 홍길동 enrolledIn 서울대학교

6. File → Save as → Turtle (.ttl) 형식으로 저장
```

**실습 과제 1: Pizza 온톨로지 분석**
```
유명한 튜토리얼 온톨로지를 분석해보세요:

1. 다운로드: https://protege.stanford.edu/ontologies/pizza/pizza.owl
2. Protégé에서 열기
3. 다음 질문에 답하세요:
   - 최상위 클래스는 무엇인가?
   - Pizza 클래스의 하위 클래스는 몇 개인가?
   - hasTopping 속성의 domain과 range는?
   - MargheritaPizza의 정의는 무엇인가?
   - 추론기(Reasoner) 실행 후 추가되는 정보는?

산출물:
- 답변 문서 (PDF/MD)
- 스크린샷 3장 이상
```

**실습 과제 2: 커피숍 온톨로지 설계**
```
스타벅스 같은 커피숍 도메인을 온톨로지로 모델링하세요:

요구사항:
1. 클래스 10개 이상
   - Beverage (Coffee, Tea, Smoothie...)
   - Size (Tall, Grande, Venti)
   - Ingredient (Milk, Sugar, Syrup...)
   - Customer, Order, Employee...

2. 속성 5개 이상
   - hasSize, hasIngredient, orderedBy, preparedBy...

3. 인스턴스 5개 이상
   - 아메리카노, 카페라떼, 고객1, 주문1...

4. Protégé로 구현 후 .ttl 파일로 저장

산출물:
- coffee-shop.ttl 파일
- 클래스 계층도 스크린샷
- 설계 설명 문서
```

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 영상 | What is an Ontology? | https://www.youtube.com/watch?v=LQ4iW3PO36E |
| 문서 | W3C Ontology Overview | https://www.w3.org/standards/semanticweb/ontology |
| 도구 | Protégé 공식 사이트 | https://protege.stanford.edu/ |
| 튜토리얼 | Protégé Pizza Tutorial | https://protegewiki.stanford.edu/wiki/Protege4Pizzas10Minutes |
| 실습 | KSS 온톨로지 시뮬레이터 | https://ontology.kss.ai.kr/simulators |

#### 평가 체크리스트 (Week 1)

| 항목 | 완료 기준 | 체크 |
|------|----------|------|
| Protégé 설치 | 정상 실행 확인 | ☐ |
| Pizza 온톨로지 분석 | 5개 질문 답변 | ☐ |
| 커피숍 온톨로지 | .ttl 파일 제출 | ☐ |
| 개념 이해 | 퀴즈 70% 이상 | ☐ |

---

### Week 2: 시맨틱 웹의 역사와 비전

#### 학습 목표
- [ ] 시맨틱 웹의 탄생 배경을 설명할 수 있다
- [ ] 시맨틱 웹 레이어 케이크를 이해할 수 있다
- [ ] 현재 시맨틱 웹 기술의 성공과 한계를 분석할 수 있다
- [ ] Knowledge Graph와 시맨틱 웹의 관계를 설명할 수 있다

#### 핵심 개념

**1. 시맨틱 웹의 탄생 (Tim Berners-Lee, 2001)**
```
문제:
- 웹은 사람을 위한 것 (HTML = 표현)
- 컴퓨터는 웹 내용을 "이해"하지 못함
- 검색은 키워드 매칭에 의존

비전:
- 기계가 이해할 수 있는 웹
- 데이터가 서로 연결되어 추론 가능
- 에이전트가 자동으로 정보 처리

"I have a dream for the Web in which computers become capable
of analyzing all the data on the Web – the content, links,
and transactions between people and computers."
- Tim Berners-Lee, 2001
```

**2. 시맨틱 웹 레이어 케이크**
```
┌─────────────────────────────────────┐
│           Trust                     │ ← 신뢰 계층
├─────────────────────────────────────┤
│           Proof                     │ ← 증명
├─────────────────────────────────────┤
│      Logic / Rules                  │ ← 규칙 (SWRL)
├─────────────────────────────────────┤
│         Ontology (OWL)              │ ← 온톨로지 ★
├─────────────────────────────────────┤
│      Schema (RDFS)                  │ ← 스키마 ★
├─────────────────────────────────────┤
│      Data Model (RDF)               │ ← 데이터 ★
├─────────────────────────────────────┤
│     Query (SPARQL)                  │ ← 쿼리 ★
├─────────────────────────────────────┤
│    Identifiers (URI/IRI)            │ ← 식별자 ★
├─────────────────────────────────────┤
│    Syntax (XML, JSON, Turtle)       │ ← 문법
├─────────────────────────────────────┤
│    Character Set (Unicode)          │ ← 문자
└─────────────────────────────────────┘

★ = 이 커리큘럼에서 다룸
```

**3. 시맨틱 웹의 성공 사례**

| 프로젝트 | 설명 | 영향 |
|----------|------|------|
| Google Knowledge Graph | 검색 결과 패널 | 수십억 엔티티 |
| Wikidata | 구조화된 위키피디아 | 1억+ 항목 |
| Schema.org | 웹 구조화 표준 | 수백만 사이트 |
| DBpedia | 위키피디아 추출 | 오픈 데이터 |
| FHIR | 의료 데이터 교환 | 전 세계 병원 |

**4. 시맨틱 웹의 한계와 현실**
```
이상 vs 현실:

이상:
- 모든 웹 데이터가 RDF로 연결
- 자동 추론으로 새로운 지식 발견
- 지능형 에이전트가 인터넷 탐색

현실:
- RDF 채택률 낮음 (기업 대부분 Property Graph 사용)
- 학습 곡선 높음 (SPARQL, OWL)
- 도구 복잡
- LLM이 대안으로 부상

교훈:
- 핵심 개념(온톨로지, 지식 그래프)은 살아남음
- 구현 방식은 진화 (RDF → Property Graph)
- LLM + KG 결합이 새로운 트렌드
```

**5. Knowledge Graph의 부상**
```
2012: Google Knowledge Graph 발표
"Things, not strings"

변화:
- "시맨틱 웹" → "Knowledge Graph" 용어 선호
- RDF 교조주의 → 실용적 접근
- 학술 → 기업 채택

현재 트렌드:
1. Neo4j 등 Property Graph DB 인기
2. GraphRAG: LLM + Knowledge Graph
3. Enterprise Knowledge Graph 구축
4. AI/ML과 KG 통합
```

#### 실습: Wikidata 탐색

**실습: Wikidata SPARQL 체험**
```
1. https://query.wikidata.org/ 접속

2. 간단한 쿼리 실행:

# 한국의 모든 도시
SELECT ?city ?cityLabel ?population
WHERE {
  ?city wdt:P31 wd:Q515.  # instance of city
  ?city wdt:P17 wd:Q884.  # country is South Korea
  OPTIONAL { ?city wdt:P1082 ?population. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "ko,en". }
}
ORDER BY DESC(?population)
LIMIT 20

3. 결과 분석:
   - 엔티티 ID (Q로 시작)
   - 속성 ID (P로 시작)
   - 다국어 레이블
```

#### 🛠️ 실습: 실제 온톨로지 탐색

**실습 1: BioPortal 탐색**
```
1. https://bioportal.bioontology.org/ 접속
2. "disease" 검색 → DOID (Disease Ontology) 클릭
3. 탐색할 것:
   - 클래스 계층 구조 확인
   - "diabetes" 검색 → 하위 유형 확인
   - 속성(Properties) 탭 확인
   - Mappings 탭에서 다른 온톨로지와의 연결 확인

질문:
- 온톨로지가 질병을 어떻게 분류하는가?
- "Type 2 Diabetes"는 어떤 계층에 속하는가?
- SNOMED-CT와 어떻게 매핑되어 있는가?
```

**실습 2: Schema.org 탐색**
```
1. https://schema.org/ 접속
2. "LocalBusiness" 클릭
3. 탐색:
   - 상위 클래스 (subClassOf)
   - 하위 클래스 (Restaurant, Store...)
   - 속성 (address, openingHours...)

실습:
- 여러분의 단골 음식점을 Schema.org로 표현해보세요
- JSON-LD 형식으로 작성
```

**실습 3: 한국 온톨로지 탐색**
```
한국에서 사용되는 온톨로지 사례:

1. 국립중앙도서관 주제명표목표
   - https://lod.nl.go.kr/
   - Linked Open Data로 공개
   - 도서 분류 체계

2. 한국어 WordNet (KorLex)
   - 단어 간 의미 관계
   - 동의어, 반의어, 상하위어

3. 공공데이터포털 표준데이터
   - https://www.data.go.kr/
   - 행정표준코드, 공간정보

과제:
- 위 3개 중 1개를 탐색하고 리포트 작성
- 어떤 클래스/속성이 있는지
- 어떤 분야에 활용 가능한지
```

#### 📊 Week 2 프로젝트: 미니 온톨로지 설계서

```
본인의 관심 도메인을 선택하여 온톨로지 설계서를 작성하세요.

추천 도메인 (택 1):
A) K-POP 아이돌 도메인
   - 그룹, 멤버, 앨범, 팬덤, 소속사 등

B) 한국 음식 도메인
   - 음식, 재료, 조리법, 영양소, 지역 등

C) 게임 캐릭터 도메인
   - 캐릭터, 직업, 스킬, 장비, 퀘스트 등

D) 본인 선택 도메인

요구사항:
1. 도메인 선정 이유 (1페이지)
2. 클래스 계층도 (15개 이상)
3. 속성 목록 (10개 이상, domain/range 명시)
4. 인스턴스 예시 (10개 이상)
5. SPARQL로 답할 수 있는 질문 5개

산출물:
- 설계서 문서 (PDF, 5-10페이지)
- Protégé 파일 (.owl 또는 .ttl)
```

#### 평가 기준 (Module 1 종합)

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| Protégé 실습 | Pizza 분석 + 커피숍 구현 | 25% |
| 개념 이해 | 온톨로지 vs DB 차이 설명 | 15% |
| Wikidata 실습 | SPARQL 쿼리 3개 | 20% |
| 미니 프로젝트 | 설계서 + 구현 파일 | 40% |

**통과 기준**: 총점 70% 이상

---

## Module 2: RDF & 트리플 (Week 3-4)

> **왜 배우는가?**
> RDF는 온톨로지의 "데이터 표현 언어"입니다. 모든 지식은 "주어-술어-목적어"
> 트리플로 표현됩니다. 이 단순한 구조가 어떻게 복잡한 지식을 표현하는지 배웁니다.
> 실제로 RDF를 작성하고, 다양한 형식으로 변환하는 실습을 합니다.

### Week 3: RDF 기초 - 트리플의 세계

#### 학습 목표
- [ ] RDF 트리플의 구조를 이해하고 작성할 수 있다
- [ ] URI/IRI의 개념과 중요성을 설명할 수 있다
- [ ] Turtle 문법으로 RDF를 작성할 수 있다
- [ ] 리터럴과 데이터 타입을 올바르게 사용할 수 있다

#### 핵심 개념

**1. RDF 트리플 (Resource Description Framework)**
```
기본 구조: Subject - Predicate - Object (SPO)

┌─────────┐    ┌─────────────┐    ┌─────────┐
│ Subject │───▶│  Predicate  │───▶│ Object  │
│  (주어)  │    │   (서술어)   │    │  (목적어) │
└─────────┘    └─────────────┘    └─────────┘
     │               │                 │
   리소스          속성/관계        리소스 or 값

예시:
<홍길동>  <worksFor>  <삼성전자>     # 객체
<홍길동>  <hasAge>    "35"^^xsd:integer  # 값(리터럴)
```

**2. URI (Uniform Resource Identifier)**
```
왜 URI인가?
- 전 세계적으로 유일한 식별자
- 웹에서 참조 가능 (선택적)
- 다른 데이터와 연결 가능

구조:
http://example.org/person/홍길동
└─────────────────────────────────┘
         URI (Uniform Resource Identifier)

축약 (Prefix):
@prefix ex: <http://example.org/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

ex:홍길동 foaf:name "홍길동" .
# 전체: <http://example.org/홍길동> <http://xmlns.com/foaf/0.1/name> "홍길동" .
```

**3. Turtle 문법**
```turtle
# 네임스페이스 선언
@prefix ex: <http://example.org/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

# 기본 트리플
ex:홍길동 foaf:name "홍길동" .
ex:홍길동 foaf:age "35"^^xsd:integer .
ex:홍길동 ex:worksFor ex:삼성전자 .

# 같은 주어 축약 (세미콜론)
ex:홍길동
    foaf:name "홍길동" ;
    foaf:age "35"^^xsd:integer ;
    ex:worksFor ex:삼성전자 .

# 같은 주어+서술어 축약 (콤마)
ex:홍길동 ex:knows ex:이영희, ex:김철수, ex:박민수 .

# 빈 노드 (익명 리소스)
ex:홍길동 ex:hasAddress [
    ex:city "서울" ;
    ex:street "강남대로 123"
] .
```

**4. 리터럴과 데이터 타입**
```turtle
# 문자열
"Hello World"                    # 단순 문자열
"안녕하세요"@ko                   # 언어 태그
"Hello"@en

# 숫자
"42"^^xsd:integer
"3.14"^^xsd:decimal
"3.14E0"^^xsd:double

# 날짜/시간
"2024-01-15"^^xsd:date
"2024-01-15T09:30:00"^^xsd:dateTime

# 불리언
"true"^^xsd:boolean

# 일반적 축약
42      # → "42"^^xsd:integer
3.14    # → "3.14"^^xsd:decimal
true    # → "true"^^xsd:boolean
```

**5. RDF 그래프 시각화**
```
                    foaf:name
        ┌─────────────────────────────▶ "홍길동"
        │
        │           foaf:age
   ex:홍길동 ─────────────────────────▶ "35"^^xsd:integer
        │
        │           ex:worksFor
        └─────────────────────────────▶ ex:삼성전자
                                            │
                                            │ foaf:name
                                            ▼
                                      "삼성전자"
```

#### 실습: RDF Triple Editor

**실습 환경**: https://ontology.kss.ai.kr/simulators/rdf-editor

**과제 1: 가족 관계 모델링**
```turtle
# 다음 가족 관계를 RDF로 표현하세요:
# - 홍길동(남, 35세)
# - 이영희(여, 33세) - 홍길동의 배우자
# - 홍민수(남, 8세) - 홍길동과 이영희의 자녀

@prefix ex: <http://example.org/family/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix rel: <http://purl.org/vocab/relationship/> .

# 여기에 작성하세요
```

**과제 2: 영화 데이터 모델링**
```turtle
# 다음 영화 정보를 RDF로 표현하세요:
# - 영화: 기생충 (2019)
# - 감독: 봉준호
# - 배우: 송강호, 이선균, 조여정
# - 수상: 아카데미 작품상

@prefix movie: <http://example.org/movie/> .
@prefix person: <http://example.org/person/> .
@prefix award: <http://example.org/award/> .

# 여기에 작성하세요
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 트리플 이해 | SPO 구조 설명 | 20% |
| URI 작성 | 올바른 네임스페이스 사용 | 20% |
| Turtle 문법 | 축약 문법 활용 | 30% |
| 실습 완료 | 2개 과제 제출 | 30% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 표준 | RDF 1.1 Primer | https://www.w3.org/TR/rdf11-primer/ |
| 표준 | Turtle 문법 | https://www.w3.org/TR/turtle/ |
| 실습 | KSS RDF Editor | https://ontology.kss.ai.kr/simulators/rdf-editor |

---

### Week 4: RDF 심화 - 다양한 직렬화 형식

#### 학습 목표
- [ ] RDF의 다양한 직렬화 형식을 이해할 수 있다
- [ ] JSON-LD를 읽고 작성할 수 있다
- [ ] 형식 간 변환을 수행할 수 있다
- [ ] 실제 데이터를 RDF로 변환할 수 있다

#### 핵심 개념

**1. RDF 직렬화 형식 비교**

| 형식 | 확장자 | 특징 | 사용처 |
|------|--------|------|--------|
| Turtle | .ttl | 사람이 읽기 쉬움 | 개발, 교육 |
| N-Triples | .nt | 한 줄 한 트리플 | 대용량 처리 |
| JSON-LD | .jsonld | JSON 호환 | 웹 API |
| RDF/XML | .rdf | XML 기반 | 레거시 |
| N-Quads | .nq | 그래프 이름 포함 | 다중 그래프 |

**2. JSON-LD (JSON for Linking Data)**
```json
{
  "@context": {
    "@vocab": "http://schema.org/",
    "name": "http://schema.org/name",
    "worksFor": "http://schema.org/worksFor",
    "Person": "http://schema.org/Person",
    "Organization": "http://schema.org/Organization"
  },
  "@type": "Person",
  "@id": "http://example.org/홍길동",
  "name": "홍길동",
  "worksFor": {
    "@type": "Organization",
    "@id": "http://example.org/삼성전자",
    "name": "삼성전자"
  }
}
```

**3. 동일한 데이터, 다른 형식**

```turtle
# Turtle
@prefix ex: <http://example.org/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

ex:홍길동 a foaf:Person ;
    foaf:name "홍길동" ;
    ex:worksFor ex:삼성전자 .
```

```
# N-Triples
<http://example.org/홍길동> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
<http://example.org/홍길동> <http://xmlns.com/foaf/0.1/name> "홍길동" .
<http://example.org/홍길동> <http://example.org/worksFor> <http://example.org/삼성전자> .
```

```xml
<!-- RDF/XML -->
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:foaf="http://xmlns.com/foaf/0.1/"
         xmlns:ex="http://example.org/">
  <foaf:Person rdf:about="http://example.org/홍길동">
    <foaf:name>홍길동</foaf:name>
    <ex:worksFor rdf:resource="http://example.org/삼성전자"/>
  </foaf:Person>
</rdf:RDF>
```

**4. Python에서 RDF 다루기 (rdflib)**
```python
from rdflib import Graph, Namespace, Literal, URIRef
from rdflib.namespace import RDF, FOAF, XSD

# 그래프 생성
g = Graph()

# 네임스페이스 정의
EX = Namespace("http://example.org/")
g.bind("ex", EX)
g.bind("foaf", FOAF)

# 트리플 추가
g.add((EX.홍길동, RDF.type, FOAF.Person))
g.add((EX.홍길동, FOAF.name, Literal("홍길동")))
g.add((EX.홍길동, FOAF.age, Literal(35, datatype=XSD.integer)))
g.add((EX.홍길동, EX.worksFor, EX.삼성전자))

# 다양한 형식으로 출력
print(g.serialize(format='turtle'))
print(g.serialize(format='json-ld'))
print(g.serialize(format='xml'))
print(g.serialize(format='nt'))

# 파일에서 읽기
g2 = Graph()
g2.parse("data.ttl", format="turtle")

# 쿼리
for s, p, o in g:
    print(f"{s} -- {p} --> {o}")
```

#### 실습: 데이터 변환 파이프라인

**과제: CSV → RDF 변환**
```python
"""
입력: employees.csv
name,age,department,manager
홍길동,35,개발팀,김부장
이영희,28,마케팅팀,박부장
김철수,42,개발팀,
...

출력: employees.ttl (Turtle 형식)
"""

import pandas as pd
from rdflib import Graph, Namespace, Literal, URIRef
from rdflib.namespace import RDF, FOAF, XSD

# 코드 작성
def csv_to_rdf(csv_path, output_path):
    # 1. CSV 읽기
    df = pd.read_csv(csv_path)

    # 2. 그래프 생성
    g = Graph()
    EX = Namespace("http://example.org/")
    ORG = Namespace("http://www.w3.org/ns/org#")

    g.bind("ex", EX)
    g.bind("foaf", FOAF)
    g.bind("org", ORG)

    # 3. 각 행을 트리플로 변환
    for _, row in df.iterrows():
        person = URIRef(EX[row['name'].replace(' ', '_')])

        g.add((person, RDF.type, FOAF.Person))
        g.add((person, FOAF.name, Literal(row['name'])))
        g.add((person, FOAF.age, Literal(int(row['age']), datatype=XSD.integer)))

        dept = URIRef(EX[row['department'].replace(' ', '_')])
        g.add((person, ORG.memberOf, dept))

        if pd.notna(row['manager']):
            manager = URIRef(EX[row['manager'].replace(' ', '_')])
            g.add((person, ORG.reportsTo, manager))

    # 4. 저장
    g.serialize(destination=output_path, format='turtle')

    return g

# 실행
g = csv_to_rdf('employees.csv', 'employees.ttl')
print(f"생성된 트리플 수: {len(g)}")
```

#### 평가 기준 (Module 2 종합)

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 트리플 이해 | SPO 구조 설명 | 15% |
| Turtle 문법 | 가족 관계 트리플 작성 | 20% |
| 형식 이해 | 4개 형식 비교 설명 | 15% |
| JSON-LD | 올바른 @context 작성 | 15% |
| **CSV → RDF 변환** | Python 코드 동작 | 20% |
| **KSS RDF Editor** | 트리플 20개 이상 입력 | 15% |

**통과 기준**: 총점 70% 이상

---

## Module 3: RDFS & OWL (Week 5-6)

> **왜 배우는가?**
> RDF는 데이터를 표현하지만, "이 데이터가 무엇을 의미하는지"는 정의하지 않습니다.
> RDFS와 OWL은 **스키마**를 정의하여 "Person은 클래스다", "knows는 대칭 관계다" 같은
> 규칙을 명시합니다. 이를 통해 **자동 추론**이 가능해집니다.

### Week 5: RDFS - 스키마 정의하기

#### 학습 목표
- [ ] RDFS의 역할과 RDF와의 관계를 설명할 수 있다
- [ ] 클래스와 속성을 정의할 수 있다
- [ ] 상속(subClassOf, subPropertyOf)을 활용할 수 있다
- [ ] Domain과 Range를 설정할 수 있다

#### 핵심 개념

**1. RDFS란?**
```
RDF: "데이터" 표현 (트리플)
RDFS: "데이터에 대한 데이터" 표현 (스키마/메타데이터)

역할:
- 클래스 정의: "Person은 클래스다"
- 속성 정의: "hasName은 속성이다"
- 계층 구조: "Student는 Person의 하위 클래스다"
- 제약 조건: "hasName의 주어는 Person이다"
```

**2. 클래스 정의**
```turtle
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ex: <http://example.org/> .

# 클래스 정의
ex:Person a rdfs:Class ;
    rdfs:label "사람"@ko ;
    rdfs:comment "인간을 나타내는 클래스"@ko .

ex:Student a rdfs:Class ;
    rdfs:subClassOf ex:Person ;
    rdfs:label "학생"@ko .

ex:Professor a rdfs:Class ;
    rdfs:subClassOf ex:Person ;
    rdfs:label "교수"@ko .

# 클래스 계층
#        Person
#        /    \
#   Student  Professor
```

**3. 속성 정의**
```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ex: <http://example.org/> .

# 데이터 속성
ex:hasName a rdf:Property ;
    rdfs:label "이름"@ko ;
    rdfs:domain ex:Person ;     # 주어의 타입
    rdfs:range rdfs:Literal .   # 목적어의 타입

ex:hasAge a rdf:Property ;
    rdfs:domain ex:Person ;
    rdfs:range xsd:integer .

# 객체 속성
ex:knows a rdf:Property ;
    rdfs:domain ex:Person ;
    rdfs:range ex:Person .

ex:enrolledIn a rdf:Property ;
    rdfs:subPropertyOf ex:memberOf ;
    rdfs:domain ex:Student ;
    rdfs:range ex:Course .
```

**4. Domain과 Range**
```
domain: 속성의 주어가 속하는 클래스
range: 속성의 목적어가 속하는 클래스

예시:
ex:teaches rdfs:domain ex:Professor .
ex:teaches rdfs:range ex:Course .

추론:
ex:김교수 ex:teaches ex:AI개론 .
→ ex:김교수 rdf:type ex:Professor . (domain 추론)
→ ex:AI개론 rdf:type ex:Course .    (range 추론)
```

**5. RDFS 추론 예시**
```turtle
# 스키마
ex:Student rdfs:subClassOf ex:Person .
ex:hasStudentID rdfs:subPropertyOf ex:hasID .

# 데이터
ex:홍길동 a ex:Student ;
    ex:hasStudentID "2024001" .

# 추론 결과 (자동 도출)
ex:홍길동 a ex:Person .           # subClassOf 추론
ex:홍길동 ex:hasID "2024001" .    # subPropertyOf 추론
```

#### 실습: 대학교 온톨로지 스키마

**과제: 대학교 도메인 RDFS 스키마 작성**
```turtle
# 다음 요구사항에 맞는 RDFS 스키마를 작성하세요

# 클래스 계층:
# Thing
# ├── Person
# │   ├── Student
# │   │   ├── UndergraduateStudent
# │   │   └── GraduateStudent
# │   └── Staff
# │       ├── Professor
# │       └── Administrator
# ├── Organization
# │   ├── University
# │   ├── College
# │   └── Department
# └── AcademicEntity
#     ├── Course
#     └── Degree

# 속성:
# - hasName (Person → Literal)
# - memberOf (Person → Organization)
# - teaches (Professor → Course)
# - enrolledIn (Student → Course)
# - hasHead (Department → Professor)
# - partOf (Department → College)

# 여기에 작성하세요
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ex: <http://example.org/university/> .
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 클래스 정의 | 10개 이상 클래스 | 30% |
| 속성 정의 | 6개 이상 속성 | 30% |
| Domain/Range | 모든 속성에 적용 | 20% |
| 계층 구조 | subClassOf 활용 | 20% |

---

### Week 6: OWL - 풍부한 의미론

#### 학습 목표
- [ ] OWL의 RDFS 대비 확장 기능을 이해할 수 있다
- [ ] 속성 특성(Transitive, Symmetric 등)을 정의할 수 있다
- [ ] 클래스 제약조건을 표현할 수 있다
- [ ] 추론 엔진을 사용하여 새로운 지식을 도출할 수 있다

#### 핵심 개념

**1. OWL이 RDFS보다 강력한 이유**

| 기능 | RDFS | OWL |
|------|------|-----|
| 클래스 계층 | ✅ | ✅ |
| 속성 정의 | ✅ | ✅ |
| 동치 (equivalentClass) | ❌ | ✅ |
| 상호 배타 (disjointWith) | ❌ | ✅ |
| 속성 특성 (transitive 등) | ❌ | ✅ |
| 카디널리티 제약 | ❌ | ✅ |
| 추론 능력 | 제한적 | 강력 |

**2. 속성 특성**
```turtle
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix ex: <http://example.org/> .

# Symmetric (대칭): A knows B → B knows A
ex:knows a owl:SymmetricProperty .

# Transitive (전이): A locatedIn B, B locatedIn C → A locatedIn C
ex:locatedIn a owl:TransitiveProperty .

# Inverse (역관계): A hasChild B ↔ B hasParent A
ex:hasChild owl:inverseOf ex:hasParent .

# Functional (함수적): 하나의 값만 가능
ex:hasBirthDate a owl:FunctionalProperty .

# InverseFunctional (역함수적): 유일하게 식별
ex:hasSSN a owl:InverseFunctionalProperty .
```

**3. 클래스 정의 (복합)**
```turtle
# 교집합 (intersection)
ex:WorkingStudent a owl:Class ;
    owl:intersectionOf (ex:Student ex:Employee) .

# 합집합 (union)
ex:Person a owl:Class ;
    owl:unionOf (ex:Man ex:Woman) .

# 보집합 (complement)
ex:NonStudent a owl:Class ;
    owl:complementOf ex:Student .

# 열거 (enumeration)
ex:Weekday a owl:Class ;
    owl:oneOf (ex:Monday ex:Tuesday ex:Wednesday
               ex:Thursday ex:Friday) .
```

**4. 속성 제약 (Restrictions)**
```turtle
# 존재 제약: 적어도 하나의 값 필요
ex:Parent a owl:Class ;
    rdfs:subClassOf [
        a owl:Restriction ;
        owl:onProperty ex:hasChild ;
        owl:someValuesFrom ex:Person
    ] .

# 전칭 제약: 모든 값이 특정 클래스
ex:VegetarianRestaurant a owl:Class ;
    rdfs:subClassOf [
        a owl:Restriction ;
        owl:onProperty ex:servesFood ;
        owl:allValuesFrom ex:VegetarianFood
    ] .

# 카디널리티 제약
ex:Marriage a owl:Class ;
    rdfs:subClassOf [
        a owl:Restriction ;
        owl:onProperty ex:hasSpouse ;
        owl:cardinality "1"^^xsd:nonNegativeInteger
    ] .
```

**5. 추론 예시**

```turtle
# 온톨로지 정의
ex:Seoul ex:locatedIn ex:Korea .
ex:Korea ex:locatedIn ex:Asia .
ex:locatedIn a owl:TransitiveProperty .

# 추론 결과
ex:Seoul ex:locatedIn ex:Asia .  # 자동 도출!
```

#### 실습: 추론 엔진 체험

**실습 환경**: https://ontology.kss.ai.kr/simulators/reasoning-engine

**과제: 추론 규칙 테스트**
```turtle
# 다음 온톨로지를 입력하고 추론 결과를 확인하세요

@prefix ex: <http://example.org/> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .

# 속성 정의
ex:knows a owl:SymmetricProperty .
ex:ancestorOf a owl:TransitiveProperty .
ex:hasParent owl:inverseOf ex:hasChild .

# 데이터
ex:Alice ex:knows ex:Bob .
ex:Charlie ex:ancestorOf ex:Bob .
ex:Bob ex:ancestorOf ex:David .
ex:Alice ex:hasParent ex:Eve .

# 예상 추론 결과:
# 1. ex:Bob ex:knows ex:Alice .        (symmetric)
# 2. ex:Charlie ex:ancestorOf ex:David . (transitive)
# 3. ex:Eve ex:hasChild ex:Alice .     (inverse)
```

#### 평가 기준 (Module 3 종합)

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| RDFS 스키마 | 대학교 온톨로지 10+ 클래스 | 25% |
| OWL 이해 | RDFS와 차이 설명 | 15% |
| 속성 특성 | 4개 이상 활용 | 20% |
| 클래스 제약 | 2개 이상 정의 | 15% |
| **KSS 추론 엔진 실습** | 3개 추론 확인 스크린샷 | 25% |

**통과 기준**: 총점 70% 이상

---

## Module 4: SPARQL (Week 7-8)

> **왜 배우는가?**
> 데이터를 저장하는 것만으로는 부족합니다. **질문**할 수 있어야 합니다.
> SPARQL은 Knowledge Graph의 SQL입니다. 복잡한 패턴 매칭, 그래프 탐색,
> 집계까지 가능합니다. 또한 **Fuseki 서버**를 구축하여 자신만의 SPARQL 엔드포인트를 운영합니다.

### Week 7: SPARQL 기초

#### 학습 목표
- [ ] SPARQL의 기본 구조를 이해할 수 있다
- [ ] SELECT, ASK, CONSTRUCT 쿼리를 작성할 수 있다
- [ ] 패턴 매칭과 변수 바인딩을 활용할 수 있다
- [ ] FILTER로 조건을 추가할 수 있다

#### 핵심 개념

**1. SPARQL 쿼리 구조**
```sparql
# 기본 구조
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX ex: <http://example.org/>

SELECT ?name ?age          # 반환할 변수
WHERE {                    # 패턴 매칭
    ?person a foaf:Person .
    ?person foaf:name ?name .
    ?person foaf:age ?age .
}
ORDER BY ?age              # 정렬
LIMIT 10                   # 제한
```

**2. 쿼리 유형**
```sparql
# SELECT: 변수 바인딩 반환
SELECT ?s ?p ?o WHERE { ?s ?p ?o . }

# ASK: 존재 여부 (true/false)
ASK WHERE { ex:홍길동 foaf:knows ex:이영희 . }

# CONSTRUCT: 새 그래프 생성
CONSTRUCT {
    ?person ex:isAdult true .
}
WHERE {
    ?person foaf:age ?age .
    FILTER (?age >= 18)
}

# DESCRIBE: 리소스 설명
DESCRIBE ex:홍길동
```

**3. 패턴 매칭**
```sparql
# 변수 (?로 시작)
?person, ?name, ?age

# 트리플 패턴
?person foaf:name ?name .

# 여러 패턴 (AND)
?person foaf:name ?name .
?person foaf:age ?age .

# 선택적 패턴 (OPTIONAL)
?person foaf:name ?name .
OPTIONAL { ?person foaf:email ?email . }

# 대안 패턴 (UNION)
{ ?person foaf:name ?name }
UNION
{ ?person ex:nickname ?name }
```

**4. FILTER**
```sparql
# 비교 연산
FILTER (?age > 30)
FILTER (?age >= 20 && ?age <= 30)

# 문자열 함수
FILTER (CONTAINS(?name, "김"))
FILTER (STRSTARTS(?name, "김"))
FILTER (REGEX(?email, "@gmail\\.com$", "i"))

# 타입 검사
FILTER (isIRI(?resource))
FILTER (isLiteral(?value))
FILTER (datatype(?value) = xsd:integer)

# 존재 여부
FILTER EXISTS { ?person foaf:email ?email }
FILTER NOT EXISTS { ?person foaf:phone ?phone }
```

**5. 집계**
```sparql
# COUNT
SELECT (COUNT(?person) AS ?count)
WHERE { ?person a foaf:Person . }

# GROUP BY
SELECT ?department (COUNT(?person) AS ?count)
WHERE {
    ?person ex:worksIn ?department .
}
GROUP BY ?department
HAVING (COUNT(?person) > 5)

# 기타 집계
SELECT
    (SUM(?salary) AS ?total)
    (AVG(?salary) AS ?average)
    (MIN(?salary) AS ?min)
    (MAX(?salary) AS ?max)
WHERE { ?person ex:hasSalary ?salary . }
```

#### 실습: SPARQL Playground

**실습 환경**: https://ontology.kss.ai.kr/simulators/sparql-playground

**과제: 기본 쿼리 작성**
```sparql
# 샘플 데이터에 대해 다음 쿼리를 작성하세요

# 1. 모든 사람의 이름 조회
SELECT ?name
WHERE {
    ?person a :Person .
    ?person :hasName ?name .
}

# 2. 30세 이상인 사람
SELECT ?name ?age
WHERE {
    ?person :hasName ?name .
    ?person :hasAge ?age .
    FILTER (?age >= 30)
}

# 3. 특정 회사의 직원
SELECT ?employee ?name
WHERE {
    ?employee :worksAt :테크코프 .
    ?employee :hasName ?name .
}

# 4. 친구의 친구 찾기
SELECT ?fof ?name
WHERE {
    :김철수 :knows ?friend .
    ?friend :knows ?fof .
    ?fof :hasName ?name .
    FILTER (?fof != :김철수)
}

# 5. 회사별 직원 수
SELECT ?company (COUNT(?emp) AS ?count)
WHERE {
    ?emp :worksAt ?company .
}
GROUP BY ?company
ORDER BY DESC(?count)
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| SELECT | 기본 쿼리 5개 | 30% |
| FILTER | 조건부 쿼리 3개 | 25% |
| OPTIONAL/UNION | 고급 패턴 2개 | 25% |
| 집계 | GROUP BY 쿼리 2개 | 20% |

---

### Week 8: SPARQL 심화 & Fuseki 서버 구축

#### 학습 목표
- [ ] Property Path를 활용할 수 있다
- [ ] 서브쿼리를 작성할 수 있다
- [ ] **Apache Fuseki 서버를 설치하고 운영할 수 있다** ⭐
- [ ] Wikidata, DBpedia에서 데이터를 조회할 수 있다
- [ ] **자신만의 SPARQL 엔드포인트를 구축할 수 있다** ⭐

#### 핵심 개념

**1. Property Path**
```sparql
# 기본 경로
?a foaf:knows ?b .

# 연결 (/): A → B → C
?a foaf:knows/foaf:knows ?c .

# 대안 (|): A → B 또는 A → C
?a foaf:knows|foaf:follows ?b .

# 0개 이상 (*): 전이적 경로
?a ex:partOf* ?root .

# 1개 이상 (+): 최소 1단계
?a ex:parentOf+ ?descendant .

# 0 또는 1개 (?)
?a foaf:knows? ?b .

# 역방향 (^)
?child ^ex:hasChild ?parent .

# 부정 (!)
?a !rdf:type ?b .
```

**2. 서브쿼리**
```sparql
# 각 부서에서 최고 연봉자
SELECT ?dept ?person ?maxSalary
WHERE {
    ?person ex:worksIn ?dept .
    ?person ex:hasSalary ?maxSalary .
    {
        SELECT ?dept (MAX(?salary) AS ?maxSalary)
        WHERE {
            ?p ex:worksIn ?dept .
            ?p ex:hasSalary ?salary .
        }
        GROUP BY ?dept
    }
}

# BIND: 계산 결과 할당
SELECT ?person ?age ?category
WHERE {
    ?person foaf:age ?age .
    BIND(
        IF(?age < 20, "청소년",
        IF(?age < 65, "성인", "노인"))
        AS ?category
    )
}

# VALUES: 값 목록
SELECT ?person ?name
WHERE {
    VALUES ?person { ex:홍길동 ex:이영희 ex:김철수 }
    ?person foaf:name ?name .
}
```

**3. Wikidata SPARQL**
```sparql
# Wikidata 엔드포인트: https://query.wikidata.org/

# 한국 출신 노벨상 수상자
SELECT ?person ?personLabel ?awardLabel
WHERE {
    ?person wdt:P166 ?award .           # 수상
    ?award wdt:P31/wdt:P279* wd:Q7191 . # 노벨상 또는 하위
    ?person wdt:P27 wd:Q884 .           # 국적: 한국

    SERVICE wikibase:label {
        bd:serviceParam wikibase:language "ko,en" .
    }
}

# 서울에 있는 대학교
SELECT ?uni ?uniLabel ?founded
WHERE {
    ?uni wdt:P31 wd:Q3918 .      # 대학교
    ?uni wdt:P131 wd:Q8684 .     # 위치: 서울
    OPTIONAL { ?uni wdt:P571 ?founded . }

    SERVICE wikibase:label {
        bd:serviceParam wikibase:language "ko,en" .
    }
}
ORDER BY ?founded
```

**4. DBpedia SPARQL**
```sparql
# DBpedia 엔드포인트: https://dbpedia.org/sparql

# 한국 영화 목록
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbr: <http://dbpedia.org/resource/>

SELECT ?film ?title ?director ?year
WHERE {
    ?film a dbo:Film .
    ?film dbo:country dbr:South_Korea .
    ?film rdfs:label ?title .
    OPTIONAL { ?film dbo:director ?director . }
    OPTIONAL { ?film dbo:releaseDate ?year . }

    FILTER (lang(?title) = "ko" || lang(?title) = "en")
}
LIMIT 100
```

#### 실습: 실제 엔드포인트 활용

**과제 1: Wikidata 탐색**
```
https://query.wikidata.org/ 에서 다음 쿼리 작성:

1. 한국의 모든 국립공원 (Q46169)
2. BTS 멤버들과 그들의 생년월일
3. 삼성전자의 자회사 목록
4. 한국 출신 올림픽 금메달리스트

각 쿼리에 대해:
- SPARQL 쿼리 코드
- 실행 결과 스크린샷
- 사용된 Wikidata 속성 ID 설명
```

**과제 2: SPARQL 페더레이션**
```sparql
# 두 엔드포인트 연결 (개념 이해)
SELECT ?person ?wikidata
WHERE {
    # 로컬 그래프
    ?person ex:name "홍길동" .
    ?person ex:sameAs ?wikidata .

    # Wikidata에서 추가 정보
    SERVICE <https://query.wikidata.org/sparql> {
        ?wikidata wdt:P569 ?birthDate .
    }
}
```

#### 🛠️ 실습: Apache Fuseki 서버 구축

**Fuseki란?**
- Apache Jena 프로젝트의 SPARQL 서버
- RDF 데이터를 저장하고 SPARQL로 쿼리 가능
- 자신만의 Knowledge Graph 엔드포인트 운영 가능

**설치 및 실행**
```bash
# 다운로드
wget https://dlcdn.apache.org/jena/binaries/apache-jena-fuseki-4.10.0.zip
unzip apache-jena-fuseki-4.10.0.zip
cd apache-jena-fuseki-4.10.0

# 실행
./fuseki-server --mem /mydata

# 접속: http://localhost:3030
```

**Docker로 실행 (권장)**
```bash
docker run -p 3030:3030 \
  -v $(pwd)/data:/fuseki/databases \
  stain/jena-fuseki
```

**실습 과제: 나만의 SPARQL 엔드포인트**
```
1. Fuseki 서버 실행
2. 이전에 만든 RDF 데이터(.ttl) 업로드
3. 웹 UI에서 SPARQL 쿼리 실행
4. Python에서 SPARQLWrapper로 접근:

from SPARQLWrapper import SPARQLWrapper, JSON

sparql = SPARQLWrapper("http://localhost:3030/mydata/query")
sparql.setQuery("""
    SELECT ?s ?p ?o
    WHERE { ?s ?p ?o }
    LIMIT 10
""")
sparql.setReturnFormat(JSON)
results = sparql.query().convert()

산출물:
- Fuseki 서버 실행 스크린샷
- Python 쿼리 코드 + 결과
```

**실습 과제: 한국 공공데이터 SPARQL 서비스**
```
서울 열린데이터광장의 데이터를 RDF로 변환하여
자신만의 SPARQL 엔드포인트를 구축하세요.

데이터 예시:
- 서울시 문화시설 현황
- 서울시 지하철 역 정보
- 서울시 공원 정보

과정:
1. CSV 다운로드 (data.seoul.go.kr)
2. Python으로 RDF 변환 (rdflib)
3. Fuseki에 업로드
4. SPARQL 쿼리 작성 (5개 이상)

질문 예시:
- "강남구에 있는 모든 문화시설은?"
- "2호선 역들과 인접한 공원은?"
```

#### 평가 기준 (Module 4 종합)

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| Property Path | 경로 쿼리 3개 | 20% |
| 서브쿼리 | 복합 쿼리 2개 | 20% |
| Wikidata/DBpedia | 4개 쿼리 완료 | 20% |
| **Fuseki 서버 구축** | 서버 실행 + 쿼리 | 25% |
| **한국 데이터 실습** | 공공데이터 RDF 변환 | 15% |

**통과 기준**: 총점 70% 이상

---

## Module 5: Knowledge Graph 구축 (Week 9-10)

> **왜 배우는가?**
> 지금까지 RDF/SPARQL 이론을 배웠다면, 이제 **실제 KG를 구축**합니다.
> 데이터 수집 → 엔티티 추출 → 관계 매핑 → 저장 → 서비스까지
> 전체 파이프라인을 경험합니다. Neo4j Property Graph도 함께 다룹니다.

### Week 9: 실무 Knowledge Graph 아키텍처

#### 학습 목표
- [ ] KG 구축 파이프라인을 설계할 수 있다
- [ ] Neo4j Property Graph와 RDF의 차이를 이해할 수 있다
- [ ] 데이터 소스에서 엔티티/관계를 추출할 수 있다
- [ ] Entity Resolution을 수행할 수 있다

#### 핵심 개념

**1. Knowledge Graph 아키텍처**
```
┌─────────────────────────────────────────────────────────────┐
│                    Data Sources                              │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│ Structured  │ Semi-struct │ Unstructured│ External KG       │
│ (DB, CSV)   │ (JSON, XML) │ (Text, PDF) │ (Wikidata)        │
└──────┬──────┴──────┬──────┴──────┬──────┴────────┬─────────┘
       │             │             │               │
       ▼             ▼             ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Extraction Pipeline                         │
├─────────────────────────────────────────────────────────────┤
│  • Entity Recognition (NER)                                  │
│  • Relation Extraction                                       │
│  • Schema Mapping                                            │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Integration Layer                           │
├─────────────────────────────────────────────────────────────┤
│  • Entity Resolution (deduplication)                         │
│  • Schema Alignment                                          │
│  • Quality Validation                                        │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Knowledge Graph                             │
├─────────────────────────────────────────────────────────────┤
│  Option A: RDF Triple Store (Virtuoso, Blazegraph)           │
│  Option B: Property Graph (Neo4j, Memgraph)                  │
│  Option C: Hybrid (Neo4j + Vector Index)                     │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Application Layer                           │
├─────────────────────────────────────────────────────────────┤
│  • Query API (SPARQL / Cypher)                               │
│  • Search & Discovery                                        │
│  • Reasoning & Inference                                     │
│  • GraphRAG + LLM                                            │
└─────────────────────────────────────────────────────────────┘
```

**2. RDF vs Property Graph**

| 항목 | RDF Triple Store | Property Graph (Neo4j) |
|------|------------------|------------------------|
| 모델 | Subject-Predicate-Object | Node-Relationship-Node |
| 쿼리 | SPARQL | Cypher |
| 관계 속성 | 어려움 (reification) | 자연스러움 |
| 추론 | 내장 (RDFS/OWL) | 제한적 |
| 도구 생태계 | 학술적 | 상업적 |
| LLM 통합 | 어려움 | 쉬움 (LangChain) |

**추천**: 실무에서는 Neo4j + GraphRAG 조합이 효과적

**3. 엔티티/관계 추출**
```python
import spacy
from transformers import pipeline

# 한국어 NER (spaCy + KoNLPy)
# pip install konlpy
from konlpy.tag import Okt

okt = Okt()
text = "삼성전자 이재용 회장이 서울에서 기자회견을 열었다."
morphs = okt.pos(text)
# [('삼성전자', 'Noun'), ('이재용', 'Noun'), ('회장', 'Noun'), ...]

# Hugging Face NER (영어)
ner = pipeline("ner", model="dslim/bert-base-NER")
entities = ner("Samsung's Jay Y. Lee met with executives in Seoul.")

# 관계 추출 (triplet extraction)
from transformers import pipeline
triplet_extractor = pipeline('text2text-generation',
                             model='Babelscape/rebel-large')

text = "Apple CEO Tim Cook announced new products in California."
triplets = triplet_extractor(text)
# [("Apple", "CEO", "Tim Cook"), ("Tim Cook", "announced in", "California")]
```

**4. Entity Resolution**
```python
import recordlinkage

# 유사 엔티티 찾기
indexer = recordlinkage.Index()
indexer.block('industry')  # 같은 산업만 비교

pairs = indexer.index(df)

compare = recordlinkage.Compare()
compare.string('name', 'name', method='jarowinkler', threshold=0.85)
compare.exact('country', 'country')

features = compare.compute(pairs, df)
matches = features[features.sum(axis=1) >= 1.5]

# 병합
merged_entities = merge_duplicates(df, matches)
```

#### 실습: 뉴스 기반 KG 구축

**과제: 뉴스에서 Knowledge Graph 추출**
```python
"""
1. 뉴스 기사 10개 수집 (네이버 뉴스 API 또는 크롤링)
2. 엔티티 추출 (KoNLPy)
3. 관계 추론 (키워드 기반 또는 GPT)
4. Neo4j에 저장
5. 시각화
"""

# 구현 코드 작성
```

---

### Week 10: Neo4j & GraphRAG 실습

#### 학습 목표
- [ ] Neo4j에 데이터를 로드하고 쿼리할 수 있다
- [ ] Cypher 쿼리를 작성할 수 있다
- [ ] 그래프 알고리즘을 적용할 수 있다
- [ ] LangChain으로 GraphRAG를 구현할 수 있다

#### 핵심 개념

**1. Neo4j 설치 & 기본 사용**
```bash
# Docker로 Neo4j 실행
docker run \
    --name neo4j \
    -p 7474:7474 -p 7687:7687 \
    -e NEO4J_AUTH=neo4j/password123 \
    neo4j:latest

# 접속: http://localhost:7474
```

**2. Cypher 기초**
```cypher
// 노드 생성
CREATE (p:Person {name: '홍길동', age: 35})
RETURN p

// 관계 생성
MATCH (a:Person {name: '홍길동'}), (b:Person {name: '이영희'})
CREATE (a)-[:KNOWS {since: 2020}]->(b)

// 조회
MATCH (p:Person)-[:KNOWS]->(friend)
WHERE p.name = '홍길동'
RETURN friend.name

// 경로 탐색
MATCH path = (a:Person {name: '홍길동'})-[:KNOWS*1..3]->(b)
RETURN path
```

**3. GraphRAG with LangChain**
```python
from langchain_community.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain
from langchain_openai import ChatOpenAI

# 연결
graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password123"
)

# 자연어 → Cypher
llm = ChatOpenAI(model="gpt-4")
chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph,
    verbose=True
)

# 질문
response = chain.invoke({
    "query": "홍길동과 연결된 모든 사람을 알려줘"
})
print(response)
```

#### 실습: 도메인 KG + QA 시스템

**과제: 영화 Knowledge Graph + 챗봇**
```
요구사항:
1. 영화 데이터 수집 (TMDB API 또는 CSV)
   - 영화 50개 이상
   - 배우, 감독, 장르 정보

2. Neo4j에 로드
   - 노드: Movie, Person, Genre
   - 관계: ACTED_IN, DIRECTED, BELONGS_TO

3. GraphRAG 구현
   - 자연어 질문 → Cypher → 답변
   - 예: "봉준호 감독의 영화는?"
   - 예: "송강호와 함께 출연한 배우들은?"

4. Streamlit 데모

산출물:
- Neo4j 그래프
- Python 코드
- 데모 영상/스크린샷
```

#### 평가 기준 (Module 5 종합)

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 아키텍처 이해 | RDF vs Property Graph 비교 | 15% |
| 데이터 파이프라인 | CSV → RDF/Neo4j 변환 | 20% |
| Neo4j 실습 | Cypher 쿼리 10개 이상 | 20% |
| **영화 KG 프로젝트** | 50+ 노드, GraphRAG 동작 | 30% |
| **KSS 시각화** | Knowledge Graph Visualizer 활용 | 15% |

**통과 기준**: 총점 70% 이상

---

## Module 6: GraphRAG & LLM 통합 (Week 11-12)

> **왜 배우는가?**
> Knowledge Graph의 **최신 활용처**는 LLM과의 통합입니다.
> 단순 RAG를 넘어 **GraphRAG**로 구조화된 지식을 활용하고,
> **LangGraph/AutoGen**으로 멀티 에이전트 시스템을 구축합니다.

### Week 11: 고급 GraphRAG 패턴

#### 학습 목표
- [ ] 하이브리드 검색 (Vector + Graph)을 구현할 수 있다
- [ ] Microsoft GraphRAG 접근법을 이해할 수 있다
- [ ] 커뮤니티 기반 요약을 구현할 수 있다
- [ ] **LangChain/LangGraph로 KG 기반 에이전트를 만들 수 있다** ⭐

#### 핵심 개념

**1. 하이브리드 검색**
```python
from langchain_community.vectorstores.neo4j_vector import Neo4jVector
from langchain_openai import OpenAIEmbeddings

# 벡터 인덱스 생성
vector_store = Neo4jVector.from_existing_graph(
    OpenAIEmbeddings(),
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
    index_name="movie_index",
    node_label="Movie",
    text_node_properties=["title", "overview"],
    embedding_node_property="embedding"
)

# 하이브리드 검색
def hybrid_search(query):
    # 1. 벡터 검색
    vector_results = vector_store.similarity_search(query, k=5)

    # 2. 그래프 탐색
    cypher = """
    MATCH (m:Movie)-[:ACTED_IN]-(a:Actor)
    WHERE m.title IN $titles
    RETURN m, a
    """
    graph_context = graph.query(cypher, {
        "titles": [r.metadata['title'] for r in vector_results]
    })

    # 3. LLM에 전달
    return llm_answer(query, vector_results, graph_context)
```

**2. Microsoft GraphRAG 스타일**
```
문서 → 엔티티/관계 추출 → 커뮤니티 탐지 → 요약

Local Search:
- 특정 엔티티 중심
- 1-2 hop 관계 탐색
- 상세 답변

Global Search:
- 커뮤니티 요약 활용
- 전체적 질문에 답변
- "이 데이터셋의 주요 테마는?"
```

**3. 추론 체인**
```python
# Multi-hop reasoning
def answer_complex_question(question):
    # 1. 질문 분해
    sub_questions = decompose_question(question)

    # 2. 각 하위 질문 답변
    intermediate_answers = []
    for sq in sub_questions:
        answer = chain.invoke({"query": sq})
        intermediate_answers.append(answer)

    # 3. 종합 답변
    final_answer = synthesize(question, intermediate_answers)
    return final_answer
```

**4. LangGraph로 KG 에이전트 구축**
```python
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_community.graphs import Neo4jGraph

# 상태 정의
class AgentState(TypedDict):
    question: str
    cypher_query: str
    graph_result: str
    final_answer: str

# 노드 함수들
def generate_cypher(state):
    """자연어 → Cypher 쿼리 생성"""
    llm = ChatOpenAI(model="gpt-4o")
    prompt = f"Convert to Cypher: {state['question']}"
    cypher = llm.invoke(prompt).content
    return {"cypher_query": cypher}

def execute_query(state):
    """Neo4j에서 쿼리 실행"""
    graph = Neo4jGraph(url="bolt://localhost:7687", ...)
    result = graph.query(state['cypher_query'])
    return {"graph_result": str(result)}

def synthesize_answer(state):
    """결과를 자연어로 변환"""
    llm = ChatOpenAI(model="gpt-4o")
    prompt = f"Question: {state['question']}\nData: {state['graph_result']}"
    answer = llm.invoke(prompt).content
    return {"final_answer": answer}

# 그래프 구성
workflow = StateGraph(AgentState)
workflow.add_node("generate_cypher", generate_cypher)
workflow.add_node("execute_query", execute_query)
workflow.add_node("synthesize", synthesize_answer)

workflow.set_entry_point("generate_cypher")
workflow.add_edge("generate_cypher", "execute_query")
workflow.add_edge("execute_query", "synthesize")
workflow.add_edge("synthesize", END)

app = workflow.compile()

# 실행
result = app.invoke({"question": "삼성전자와 경쟁하는 회사는?"})
print(result["final_answer"])
```

#### 🛠️ 실습: 멀티 에이전트 KG 시스템

**과제: KG 분석 에이전트 팀 구축**
```
LangGraph를 사용하여 3개의 에이전트가 협력하는 시스템 구축:

에이전트 1: Query Planner
- 사용자 질문을 분석
- 필요한 쿼리 유형 결정 (SPARQL vs Cypher vs 혼합)

에이전트 2: Graph Explorer
- 실제 쿼리 실행
- 결과 검증 및 추가 탐색

에이전트 3: Answer Synthesizer
- 결과를 종합하여 답변 생성
- 신뢰도 점수 부여

산출물:
- LangGraph 워크플로우 코드
- 3개 에이전트 간 상호작용 다이어그램
- 테스트 질문 10개와 답변 결과
```

---

### Week 12: 최종 프로젝트

#### 프로젝트: 도메인 Knowledge Graph 시스템

**요구사항**
```
1. 도메인 선택 (권장)
   - 기술 문서 KG (API, 라이브러리 관계)
   - 뉴스 KG (기업, 인물, 이벤트)
   - 영화/음악 KG (작품, 아티스트)
   - 학술 KG (논문, 저자, 주제)

2. 파이프라인 구축
   - 데이터 수집 (API, 크롤링, CSV)
   - 엔티티/관계 추출
   - Entity Resolution
   - Neo4j 저장

3. GraphRAG 구현
   - 자연어 → Cypher
   - 하이브리드 검색
   - 복합 질문 처리

4. 애플리케이션
   - Streamlit 챗봇
   - 그래프 시각화
   - 검색 인터페이스

5. 배포
   - Docker Compose
   - 문서화 (README)
```

**평가 기준**

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 데이터 | 500+ 노드, 1000+ 관계 | 20% |
| 파이프라인 | 자동화된 ETL | 20% |
| GraphRAG | 질문 10개 테스트 통과 | 25% |
| 애플리케이션 | 사용 가능한 UI | 20% |
| 문서화 | README, 아키텍처 | 15% |

---

## 부록 A: KSS 시뮬레이터 활용 가이드

각 모듈에서 KSS Ontology 시뮬레이터를 활용하는 방법:

| 모듈 | 시뮬레이터 | 활용 방법 |
|------|-----------|----------|
| Module 1-2 | **RDF Triple Editor** | 트리플 직접 작성, 시각화 확인 |
| Module 3 | **Inference Engine** | OWL 추론 규칙 테스트 |
| Module 4 | **SPARQL Playground** | 쿼리 실습, Wikidata 연동 |
| Module 5-6 | **Knowledge Graph Visualizer** | 구축한 KG 시각화 |

**접속**: https://ontology.kss.ai.kr/simulators

### 시뮬레이터별 실습 과제

**1. RDF Triple Editor**
```
- 가족 관계 트리플 20개 작성
- 영화 데이터 트리플 30개 작성
- JSON 내보내기 후 Fuseki에 업로드
```

**2. Inference Engine**
```
- Symmetric Property 테스트 (knows)
- Transitive Property 테스트 (locatedIn)
- Inverse Property 테스트 (hasChild/hasParent)
- 추론 결과 스크린샷 저장
```

**3. SPARQL Playground**
```
- 기본 SELECT 쿼리 5개
- FILTER, OPTIONAL 활용
- Wikidata 연동 쿼리
- 결과 CSV 다운로드
```

**4. Knowledge Graph Visualizer**
```
- 신뢰도 필터 조절 실험
- 노드 클러스터링 관찰
- RDF Editor → KG Visualizer 연동
```

---

## 부록 B: 추천 자료

### 온라인 강의
| 강의 | 제공처 | 특징 |
|------|--------|------|
| [Stanford CS520](https://web.stanford.edu/class/cs520/) | Stanford | 산업 사례 중심 |
| [Neo4j GraphAcademy](https://graphacademy.neo4j.com/) | Neo4j | 무료 인증 |
| [Knowledge Graphs Course](https://tetherless-world.github.io/ontology-engineering/) | RPI | 프로젝트 기반 |
| [W3C RDF Tutorials](https://www.w3.org/wiki/SPARQL) | W3C | 공식 표준 |

### 도서
| 책 제목 | 저자 | 난이도 |
|--------|------|--------|
| Knowledge Graphs | Aidan Hogan et al. | ⭐⭐⭐ |
| Semantic Web for Working Ontologist | Dean Allemang | ⭐⭐ |
| Graph Databases | Ian Robinson | ⭐⭐ |
| Ontology Engineering | Kendall & McGuinness | ⭐⭐⭐ |
| Designing KG Enterprise | Sequeda & Lassila | ⭐⭐⭐ |

### 도구 요약
| 용도 | 도구 | 비용 |
|------|------|------|
| 온톨로지 편집 | Protégé | 무료 |
| RDF 저장소 | Apache Fuseki | 무료 |
| Property Graph | Neo4j Aura | 무료 티어 |
| Python RDF | rdflib | 무료 |
| SPARQL 클라이언트 | SPARQLWrapper | 무료 |
| LLM 통합 | LangChain, LangGraph | 무료 |

---

## 부록 C: 자격증 로드맵

이 커리큘럼 이수 후 도전할 수 있는 자격증:

| 자격증 | 제공처 | 관련 모듈 |
|--------|--------|----------|
| **Neo4j Certified Professional** | Neo4j | Module 5 |
| **Neo4j GDS Certification** | Neo4j | Module 5-6 |
| **AWS Machine Learning** | AWS | Module 6 |
| **Google Cloud Data Engineer** | GCP | Module 4-5 |

### 학습 경로
```
이 커리큘럼 (12주)
    ↓
Neo4j Certified Professional (1-2주 준비)
    ↓
GDS Certification (2주 준비)
    ↓
클라우드 자격증 (별도 학습)
```

---

## 부록 D: 프로젝트 아이디어

최종 프로젝트 또는 포트폴리오용 아이디어:

### 초급 (Module 1-4 수준)
1. **개인 독서 KG**: 읽은 책, 저자, 장르, 인용구 관계
2. **음식 레시피 KG**: 재료, 조리법, 영양소 연결
3. **K-POP 아이돌 KG**: 그룹, 멤버, 앨범, 수상 내역

### 중급 (Module 5 수준)
4. **뉴스 KG**: 실시간 뉴스에서 엔티티/관계 추출
5. **학술 논문 KG**: 논문, 저자, 인용 관계 네트워크
6. **영화 추천 KG**: TMDB 데이터 기반 추천 시스템

### 고급 (Module 6 수준)
7. **의료 QA 시스템**: FHIR + GraphRAG 챗봇
8. **금융 분석 KG**: 기업 관계 + 뉴스 기반 인사이트
9. **법률 문서 KG**: 판례, 법조문, 키워드 연결 + 검색

### 한국 특화 아이디어
10. **서울시 공공시설 KG**: 문화시설, 공원, 교통 연계
11. **한국 역사 KG**: 왕조, 인물, 사건, 문화재 연결
12. **K-Food KG**: 한식 레시피, 지역 특산물, 건강 효능

---

*이 커리큘럼은 FDE Academy의 일부입니다.*
*최종 업데이트: 2025-12-15*

**참고 출처:**
- [Stanford CS520](https://web.stanford.edu/class/cs520/)
- [Neo4j GraphAcademy](https://graphacademy.neo4j.com/)
- [RPI Ontology Engineering](https://tw.rpi.edu/courses/Ontologies)
