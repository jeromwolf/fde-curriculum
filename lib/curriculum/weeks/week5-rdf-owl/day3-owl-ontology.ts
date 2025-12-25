// Day 3: OWL 온톨로지 - 지식의 구조화

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day3OwlOntology: Day = {
  slug: 'owl-ontology',
  title: 'OWL 온톨로지',
  totalDuration: 240,
  tasks: [
    createVideoTask('w5d3-ontology-intro', '온톨로지 개념', 30, {
      introduction: `
# 온톨로지 개념

## 온톨로지란?

**온톨로지(Ontology)**는 특정 도메인의 개념과 관계를 형식적으로 정의한 것입니다.

\`\`\`
철학: "존재에 대한 연구"
컴퓨터 과학: "개념의 명시적 명세"

목적:
- 용어의 의미를 명확히 정의
- 기계가 추론할 수 있는 지식 표현
- 데이터 통합과 공유
\`\`\`

## 온톨로지 구성 요소

\`\`\`
┌─────────────────────────────────┐
│ 클래스 (Classes)                │
│ - 개념의 유형 정의               │
│ - 예: Person, Company, Product  │
├─────────────────────────────────┤
│ 프로퍼티 (Properties)           │
│ - 클래스 간 관계                 │
│ - 예: worksFor, competesWith    │
├─────────────────────────────────┤
│ 인스턴스 (Instances)            │
│ - 클래스의 실제 개체             │
│ - 예: Samsung, 김철수            │
├─────────────────────────────────┤
│ 공리 (Axioms)                   │
│ - 제약 조건과 규칙               │
│ - 예: CEO는 Person이어야 함     │
└─────────────────────────────────┘
\`\`\`

## RDFS vs OWL

| 항목 | RDFS | OWL |
|------|------|-----|
| 목적 | 기본 스키마 | 풍부한 온톨로지 |
| 클래스 | rdfs:Class | owl:Class |
| 계층 | rdfs:subClassOf | + 동치, 교집합 등 |
| 프로퍼티 | rdfs:domain/range | + Functional, Transitive |
| 추론 | 제한적 | 강력한 DL Reasoner |
      `,
      keyPoints: ['온톨로지는 도메인 개념의 형식적 정의', '클래스, 프로퍼티, 인스턴스, 공리', 'OWL은 RDFS보다 표현력이 풍부'],
      practiceGoal: '온톨로지의 개념과 구성 요소를 이해한다',
    }),

    createReadingTask('w5d3-owl-classes', 'OWL 클래스와 계층', 35, {
      introduction: `
# OWL 클래스와 계층

## 클래스 선언

\`\`\`turtle
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ex: <http://example.org/> .

# 클래스 선언
ex:Person a owl:Class ;
    rdfs:label "사람"@ko, "Person"@en ;
    rdfs:comment "인간 개체를 나타내는 클래스" .

ex:Company a owl:Class ;
    rdfs:label "회사"@ko ;
    rdfs:comment "법인 조직" .
\`\`\`

## 클래스 계층 (Subsumption)

\`\`\`turtle
# 서브클래스 관계
ex:Student rdfs:subClassOf ex:Person .
ex:Employee rdfs:subClassOf ex:Person .
ex:Manager rdfs:subClassOf ex:Employee .

# 계층 구조
# Person
#   ├── Student
#   └── Employee
#         └── Manager
\`\`\`

## 동치 클래스 (Equivalent Class)

\`\`\`turtle
# 두 클래스가 같은 인스턴스를 가짐
ex:Human owl:equivalentClass ex:Person .

# 조건부 동치
ex:Adult owl:equivalentClass [
    a owl:Class ;
    owl:intersectionOf (
        ex:Person
        [ a owl:Restriction ;
          owl:onProperty ex:age ;
          owl:hasValue 18
        ]
    )
] .
\`\`\`

## 클래스 연산

\`\`\`turtle
# 교집합 (AND)
ex:StudentEmployee a owl:Class ;
    owl:intersectionOf ( ex:Student ex:Employee ) .

# 합집합 (OR)
ex:PersonOrCompany a owl:Class ;
    owl:unionOf ( ex:Person ex:Company ) .

# 여집합 (NOT)
ex:NonEmployee a owl:Class ;
    owl:complementOf ex:Employee .

# 서로소 (Disjoint)
ex:Person owl:disjointWith ex:Company .
# Person과 Company는 동시에 속할 수 없음
\`\`\`

## 열거 클래스

\`\`\`turtle
# 인스턴스를 나열하여 클래스 정의
ex:Weekday a owl:Class ;
    owl:oneOf ( ex:Monday ex:Tuesday ex:Wednesday
                ex:Thursday ex:Friday ) .

ex:Color a owl:Class ;
    owl:oneOf ( ex:Red ex:Green ex:Blue ) .
\`\`\`
      `,
      keyPoints: ['owl:Class로 클래스 선언', 'rdfs:subClassOf로 계층', 'intersectionOf, unionOf로 복합 클래스'],
      practiceGoal: 'OWL 클래스를 정의하고 계층을 구성할 수 있다',
    }),

    createReadingTask('w5d3-owl-properties', 'OWL 프로퍼티', 35, {
      introduction: `
# OWL 프로퍼티

## 프로퍼티 유형

\`\`\`turtle
# Object Property: 개체 간 관계
ex:worksFor a owl:ObjectProperty ;
    rdfs:domain ex:Person ;
    rdfs:range ex:Company .

# Datatype Property: 개체와 값
ex:age a owl:DatatypeProperty ;
    rdfs:domain ex:Person ;
    rdfs:range xsd:integer .

# Annotation Property: 메타데이터
ex:creator a owl:AnnotationProperty .
\`\`\`

## 프로퍼티 특성

\`\`\`turtle
# Functional: 값이 최대 하나
ex:hasSSN a owl:FunctionalProperty .
# 한 사람은 주민번호 하나만 가짐

# Inverse Functional: 역방향이 유일
ex:ssn a owl:InverseFunctionalProperty .
# 주민번호로 사람을 유일하게 식별

# Symmetric: 양방향 동일
ex:friendOf a owl:SymmetricProperty .
# A가 B의 친구면 B도 A의 친구

# Asymmetric: 양방향 불가
ex:parentOf a owl:AsymmetricProperty .
# A가 B의 부모면 B는 A의 부모가 아님

# Transitive: 전이적
ex:ancestorOf a owl:TransitiveProperty .
# A→B, B→C면 A→C

# Reflexive: 자기 자신 포함
ex:knows a owl:ReflexiveProperty .
# 모든 사람은 자기 자신을 안다

# Irreflexive: 자기 자신 제외
ex:parentOf a owl:IrreflexiveProperty .
# 자기 자신의 부모일 수 없음
\`\`\`

## 프로퍼티 관계

\`\`\`turtle
# 역관계
ex:hasEmployee owl:inverseOf ex:worksFor .
# A가 B에서 일하면, B는 A를 고용

# 서브 프로퍼티
ex:hasMother rdfs:subPropertyOf ex:hasParent .
# 어머니가 있으면 부모도 있음

# 프로퍼티 체인
ex:hasGrandparent owl:propertyChainAxiom ( ex:hasParent ex:hasParent ) .
# 부모의 부모 = 조부모
\`\`\`

## 프로퍼티 제약

\`\`\`turtle
ex:CEO a owl:Class ;
    rdfs:subClassOf [
        a owl:Restriction ;
        owl:onProperty ex:manages ;
        owl:someValuesFrom ex:Company  # 적어도 하나
    ] ;
    rdfs:subClassOf [
        a owl:Restriction ;
        owl:onProperty ex:worksFor ;
        owl:cardinality 1  # 정확히 하나
    ] .
\`\`\`
      `,
      keyPoints: ['ObjectProperty vs DatatypeProperty', 'Functional, Transitive 등 특성', 'inverseOf, propertyChainAxiom 관계'],
      practiceGoal: 'OWL 프로퍼티와 특성을 정의할 수 있다',
    }),

    createCodeTask('w5d3-ontology-design', '온톨로지 설계 실습', 40, {
      introduction: `
# 온톨로지 설계 실습

## 실습: 기업 도메인 온톨로지

다음 요구사항에 맞는 온톨로지를 설계하세요.

**도메인**: 기업 및 직원 관계

**요구사항**:
1. 클래스: Person, Company, Department, Product
2. 관계: worksFor, manages, produces, competesWith
3. 제약: CEO는 정확히 1개 회사에서 일함

\`\`\`turtle
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix ex: <http://example.org/corp#> .

# 온톨로지 메타데이터
<http://example.org/corp> a owl:Ontology ;
    rdfs:label "기업 온톨로지" ;
    owl:versionInfo "1.0" .

# ===== 클래스 =====

ex:Person a owl:Class ;
    rdfs:label "사람" .

ex:Employee a owl:Class ;
    rdfs:subClassOf ex:Person ;
    rdfs:label "직원" .

ex:CEO a owl:Class ;
    rdfs:subClassOf ex:Employee ;
    rdfs:label "CEO" ;
    rdfs:subClassOf [
        a owl:Restriction ;
        owl:onProperty ex:worksFor ;
        owl:cardinality 1
    ] .

ex:Company a owl:Class ;
    rdfs:label "회사" ;
    owl:disjointWith ex:Person .

ex:Department a owl:Class ;
    rdfs:label "부서" .

ex:Product a owl:Class ;
    rdfs:label "제품" .

# ===== Object Properties =====

ex:worksFor a owl:ObjectProperty ;
    rdfs:domain ex:Employee ;
    rdfs:range ex:Company ;
    rdfs:label "근무" .

ex:hasEmployee a owl:ObjectProperty ;
    owl:inverseOf ex:worksFor ;
    rdfs:label "고용" .

ex:manages a owl:ObjectProperty ;
    rdfs:domain ex:Employee ;
    rdfs:range ex:Department ;
    rdfs:label "관리" .

ex:produces a owl:ObjectProperty ;
    rdfs:domain ex:Company ;
    rdfs:range ex:Product ;
    rdfs:label "생산" .

ex:competesWith a owl:ObjectProperty, owl:SymmetricProperty ;
    rdfs:domain ex:Company ;
    rdfs:range ex:Company ;
    rdfs:label "경쟁" .

ex:subsidiaryOf a owl:ObjectProperty, owl:TransitiveProperty ;
    rdfs:domain ex:Company ;
    rdfs:range ex:Company ;
    rdfs:label "자회사" .

# ===== Datatype Properties =====

ex:name a owl:DatatypeProperty, owl:FunctionalProperty ;
    rdfs:range xsd:string .

ex:foundedYear a owl:DatatypeProperty, owl:FunctionalProperty ;
    rdfs:domain ex:Company ;
    rdfs:range xsd:gYear .

ex:employeeCount a owl:DatatypeProperty ;
    rdfs:domain ex:Company ;
    rdfs:range xsd:integer .
\`\`\`
      `,
      keyPoints: ['owl:Ontology로 메타데이터', '클래스와 프로퍼티 분리 정의', 'Restriction으로 제약 조건'],
      practiceGoal: '도메인 온톨로지를 설계할 수 있다',
    }),

    createReadingTask('w5d3-reasoning', '추론 (Reasoning)', 30, {
      introduction: `
# 추론 (Reasoning)

## Reasoner란?

**Reasoner**는 온톨로지의 명시적 지식에서 **암묵적 지식을 도출**합니다.

\`\`\`
명시적:
- Kim은 Employee다
- Employee는 Person의 서브클래스다

추론:
→ Kim은 Person이다 (자동 도출)
\`\`\`

## 추론 유형

### 1. 분류 (Classification)

\`\`\`turtle
# 명시
ex:Kim ex:age 35 .
ex:Adult owl:equivalentClass [ ... ex:age >= 18 ] .

# 추론
→ ex:Kim a ex:Adult .
\`\`\`

### 2. 인스턴스 체크

\`\`\`turtle
# 명시
ex:Kim ex:worksFor ex:Samsung .
ex:worksFor rdfs:domain ex:Employee .

# 추론
→ ex:Kim a ex:Employee .
\`\`\`

### 3. 프로퍼티 추론

\`\`\`turtle
# 명시
ex:hasParent owl:inverseOf ex:hasChild .
ex:Kim ex:hasParent ex:Father .

# 추론
→ ex:Father ex:hasChild ex:Kim .
\`\`\`

### 4. 전이적 추론

\`\`\`turtle
# 명시
ex:ancestorOf a owl:TransitiveProperty .
ex:Kim ex:ancestorOf ex:Lee .
ex:Lee ex:ancestorOf ex:Park .

# 추론
→ ex:Kim ex:ancestorOf ex:Park .
\`\`\`

## OWL 프로파일

| 프로파일 | 복잡도 | 용도 |
|----------|-------|------|
| OWL 2 Full | 결정 불가 | 이론적 |
| OWL 2 DL | NExpTime | 일반 온톨로지 |
| OWL 2 EL | PTime | 대규모 분류 |
| OWL 2 QL | NLogSpace | 데이터베이스 |
| OWL 2 RL | PTime | 규칙 기반 |

## 주요 Reasoner

- **HermiT**: OWL 2 DL 지원
- **Pellet**: 상용/오픈소스
- **FaCT++**: 빠른 분류
- **ELK**: OWL 2 EL 특화 (대규모)
      `,
      keyPoints: ['Reasoner가 암묵적 지식 도출', '분류, 인스턴스 체크, 전이적 추론', 'OWL 프로파일에 따라 복잡도 다름'],
      practiceGoal: '온톨로지 추론의 개념을 이해한다',
    }),

    createQuizTask('w5d3-quiz', 'Day 3 복습 퀴즈', 15, {
      introduction: '# Day 3 복습 퀴즈',
      questions: [
        {
          id: 'w5d3-q1',
          question: 'owl:TransitiveProperty의 의미는?',
          options: ['양방향 관계', 'A→B, B→C면 A→C', '값이 최대 하나', '자기 자신 포함'],
          correctAnswer: 1,
          explanation: 'TransitiveProperty는 A→B, B→C일 때 A→C를 추론합니다.',
        },
        {
          id: 'w5d3-q2',
          question: 'owl:disjointWith의 의미는?',
          options: ['같은 클래스', '서브클래스', '서로 겹치지 않음', '역관계'],
          correctAnswer: 2,
          explanation: 'disjointWith는 두 클래스가 공통 인스턴스를 가질 수 없음을 의미합니다.',
        },
        {
          id: 'w5d3-q3',
          question: 'ObjectProperty와 DatatypeProperty의 차이는?',
          options: ['없음', 'ObjectProperty는 개체 간, DatatypeProperty는 개체-값', 'ObjectProperty만 제약 가능', 'DatatypeProperty만 추론 가능'],
          correctAnswer: 1,
          explanation: 'ObjectProperty는 개체 간 관계, DatatypeProperty는 개체와 리터럴 값의 관계입니다.',
        },
      ],
      keyPoints: ['Transitive = A→B→C', 'Disjoint = 서로소', 'Object vs Datatype Property'],
      practiceGoal: 'OWL 개념을 확인한다',
    }),
  ],

  challenge: createChallengeTask('w5d3-challenge', 'Challenge: 도메인 온톨로지 설계', 55, {
    introduction: `
# Challenge: 도메인 온톨로지 설계

## 과제

선택한 도메인의 온톨로지를 설계하세요.

## 도메인 선택 (택 1)

1. **전자상거래**: Product, Category, Order, Customer
2. **의료**: Patient, Doctor, Disease, Treatment
3. **교육**: Course, Student, Instructor, Certificate

## 요구사항

1. 최소 5개 클래스 (계층 포함)
2. 최소 8개 프로퍼티 (Object + Datatype)
3. 프로퍼티 특성 활용 (Transitive, Symmetric 등)
4. 최소 2개 제약 조건 (Restriction)
5. 샘플 인스턴스 5개 이상

## 제출물

- Turtle 파일 (.ttl)
- 온톨로지 다이어그램 (선택)
    `,
    keyPoints: ['실제 도메인 모델링', '클래스 계층 설계', '프로퍼티 특성 활용'],
    practiceGoal: '완전한 도메인 온톨로지를 설계할 수 있다',
  }),
}
