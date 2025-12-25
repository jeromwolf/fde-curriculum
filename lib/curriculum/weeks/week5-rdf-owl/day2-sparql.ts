// Day 2: SPARQL - RDF를 위한 쿼리 언어

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day2Sparql: Day = {
  slug: 'sparql-query',
  title: 'SPARQL 쿼리',
  totalDuration: 240,
  tasks: [
    createVideoTask('w5d2-sparql-intro', 'SPARQL 개요', 25, {
      introduction: `
# SPARQL 개요

## SPARQL이란?

**SPARQL** (SPARQL Protocol and RDF Query Language)은 RDF 데이터를 쿼리하는 표준 언어입니다.

\`\`\`
SQL : 관계형 DB = SPARQL : RDF 그래프

SELECT * FROM users WHERE age > 30
↓
SELECT ?name WHERE { ?person foaf:age ?age . FILTER(?age > 30) }
\`\`\`

## 기본 구조

\`\`\`sparql
PREFIX foaf: <http://xmlns.com/foaf/0.1/>    # 네임스페이스

SELECT ?name ?age                             # 반환할 변수
WHERE {                                       # 그래프 패턴
  ?person rdf:type foaf:Person .
  ?person foaf:name ?name .
  ?person foaf:age ?age .
}
ORDER BY DESC(?age)                           # 정렬
LIMIT 10                                      # 제한
\`\`\`

## 변수 표기

\`\`\`sparql
?name   # 바인딩할 변수
$name   # 같은 의미 (? 또는 $ 사용)
\`\`\`

## 쿼리 유형

| 유형 | 용도 |
|------|------|
| SELECT | 변수 값 반환 (테이블) |
| CONSTRUCT | 새 RDF 그래프 생성 |
| ASK | 참/거짓 반환 |
| DESCRIBE | 리소스 설명 반환 |
      `,
      keyPoints: ['SPARQL은 RDF 쿼리 언어', '?변수로 바인딩', 'SELECT, CONSTRUCT, ASK, DESCRIBE'],
      practiceGoal: 'SPARQL의 기본 구조를 이해한다',
    }),

    createCodeTask('w5d2-basic-queries', '기본 쿼리 패턴', 40, {
      introduction: `
# 기본 쿼리 패턴

## Triple Pattern

가장 기본적인 패턴은 **트리플 패턴**입니다.

\`\`\`sparql
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

# 모든 사람 조회
SELECT ?person ?name
WHERE {
  ?person rdf:type foaf:Person .
  ?person foaf:name ?name .
}
\`\`\`

## 축약 표현

\`\`\`sparql
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

# 'a'는 rdf:type의 축약
SELECT ?person ?name
WHERE {
  ?person a foaf:Person ;        # 세미콜론으로 같은 주어
          foaf:name ?name .
}
\`\`\`

## OPTIONAL - 선택적 패턴

\`\`\`sparql
SELECT ?name ?email
WHERE {
  ?person a foaf:Person ;
          foaf:name ?name .
  OPTIONAL { ?person foaf:mbox ?email }  # 이메일이 없어도 OK
}
\`\`\`

## FILTER - 조건 필터

\`\`\`sparql
SELECT ?name ?age
WHERE {
  ?person a foaf:Person ;
          foaf:name ?name ;
          foaf:age ?age .
  FILTER (?age >= 30)             # 나이 필터
  FILTER (LANG(?name) = "ko")     # 언어 필터
  FILTER (CONTAINS(?name, "김"))  # 문자열 포함
}
\`\`\`

## UNION - OR 조건

\`\`\`sparql
SELECT ?entity ?name
WHERE {
  { ?entity a foaf:Person ; foaf:name ?name }
  UNION
  { ?entity a foaf:Organization ; foaf:name ?name }
}
\`\`\`

## BIND - 변수 바인딩

\`\`\`sparql
SELECT ?name ?birthYear
WHERE {
  ?person foaf:name ?name ;
          foaf:birthday ?birthday .
  BIND (YEAR(?birthday) AS ?birthYear)
}
\`\`\`
      `,
      keyPoints: ['트리플 패턴으로 그래프 매칭', 'OPTIONAL로 선택적 데이터', 'FILTER로 조건 필터링'],
      practiceGoal: '기본 SPARQL 쿼리 패턴을 작성할 수 있다',
    }),

    createCodeTask('w5d2-advanced-queries', '고급 쿼리 패턴', 40, {
      introduction: `
# 고급 쿼리 패턴

## 집계 함수

\`\`\`sparql
PREFIX ex: <http://example.org/>

# 그룹별 집계
SELECT ?country (COUNT(?person) AS ?count)
WHERE {
  ?person a foaf:Person ;
          ex:country ?country .
}
GROUP BY ?country
HAVING (COUNT(?person) > 10)
ORDER BY DESC(?count)
\`\`\`

## 서브쿼리

\`\`\`sparql
SELECT ?name ?avgAge
WHERE {
  ?person foaf:name ?name ;
          ex:country ?country .
  {
    SELECT ?country (AVG(?age) AS ?avgAge)
    WHERE {
      ?p ex:country ?country ;
         foaf:age ?age .
    }
    GROUP BY ?country
  }
}
\`\`\`

## 경로 표현식 (Property Paths)

\`\`\`sparql
# 직접 친구
?person foaf:knows ?friend .

# 친구의 친구 (2단계)
?person foaf:knows/foaf:knows ?fof .

# N단계 이내 친구
?person foaf:knows+ ?anyFriend .      # 1회 이상
?person foaf:knows* ?anyFriend .      # 0회 이상

# 역방향
?person ^foaf:knows ?follower .       # ?follower가 ?person을 안다

# 대안
?person foaf:knows|foaf:follows ?connection .
\`\`\`

## VALUES - 값 목록

\`\`\`sparql
SELECT ?company ?name
WHERE {
  VALUES ?company { ex:Samsung ex:Apple ex:Google }
  ?company foaf:name ?name .
}
\`\`\`

## MINUS - 차집합

\`\`\`sparql
# CEO가 아닌 직원
SELECT ?employee
WHERE {
  ?employee a ex:Employee .
  MINUS { ?company ex:ceo ?employee }
}
\`\`\`

## NOT EXISTS

\`\`\`sparql
# 이메일이 없는 사람
SELECT ?person ?name
WHERE {
  ?person a foaf:Person ;
          foaf:name ?name .
  FILTER NOT EXISTS { ?person foaf:mbox ?email }
}
\`\`\`
      `,
      keyPoints: ['COUNT, AVG 등 집계 함수', 'Property Paths로 경로 탐색', 'MINUS와 NOT EXISTS로 부정 조건'],
      practiceGoal: '복잡한 SPARQL 쿼리를 작성할 수 있다',
    }),

    createReadingTask('w5d2-construct-ask', 'CONSTRUCT와 ASK', 25, {
      introduction: `
# CONSTRUCT와 ASK

## CONSTRUCT - RDF 그래프 생성

쿼리 결과로 새로운 RDF 그래프를 만듭니다.

\`\`\`sparql
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX ex: <http://example.org/>

CONSTRUCT {
  ?person ex:fullName ?fullName ;
          ex:isAdult true .
}
WHERE {
  ?person foaf:givenName ?first ;
          foaf:familyName ?last ;
          foaf:age ?age .
  FILTER (?age >= 18)
  BIND (CONCAT(?first, " ", ?last) AS ?fullName)
}
\`\`\`

**결과 (Turtle):**
\`\`\`turtle
ex:Kim ex:fullName "Cheolsu Kim" ;
       ex:isAdult true .
\`\`\`

## ASK - 참/거짓 확인

패턴이 존재하는지 확인합니다.

\`\`\`sparql
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

# Kim이라는 사람이 있는가?
ASK {
  ?person foaf:name "Kim" .
}
\`\`\`

**결과:** \`true\` 또는 \`false\`

## DESCRIBE - 리소스 설명

리소스에 대한 모든 정보를 반환합니다.

\`\`\`sparql
DESCRIBE <http://example.org/Kim>
\`\`\`

**결과 (그래프):**
\`\`\`turtle
<http://example.org/Kim>
    a foaf:Person ;
    foaf:name "김철수" ;
    foaf:knows <http://example.org/Lee> .
\`\`\`

## 활용 예시

\`\`\`sparql
# CONSTRUCT로 데이터 변환
CONSTRUCT {
  ?s schema:name ?name .
  ?s schema:founder ?ceo .
}
WHERE {
  ?s foaf:name ?name .
  ?s ex:ceo ?ceo .
}

# ASK로 데이터 검증
ASK {
  ?company a ex:Company .
  FILTER NOT EXISTS { ?company ex:headquarters ?hq }
}
# true면 본사 정보 없는 회사 있음
\`\`\`
      `,
      keyPoints: ['CONSTRUCT로 그래프 변환', 'ASK로 존재 여부 확인', 'DESCRIBE로 리소스 전체 정보'],
      practiceGoal: 'SELECT 외의 쿼리 유형을 활용할 수 있다',
    }),

    createCodeTask('w5d2-wikidata-practice', 'Wikidata SPARQL 실습', 45, {
      introduction: `
# Wikidata SPARQL 실습

## Wikidata 소개

Wikidata는 위키미디어 재단의 **구조화된 지식 베이스**입니다.

- **엔드포인트**: https://query.wikidata.org/
- **1억+ 아이템**
- **무료 API 접근**

## Wikidata 구조

\`\`\`
Q 아이템: 엔티티 (Q2 = 지구, Q30 = 미국)
P 프로퍼티: 관계 (P31 = instance of, P17 = country)

예: Q30 P31 Q6256 (미국은 나라의 인스턴스)
\`\`\`

## 기본 쿼리

\`\`\`sparql
# 한국의 모든 도시
SELECT ?city ?cityLabel
WHERE {
  ?city wdt:P31 wd:Q515 .        # instance of 도시
  ?city wdt:P17 wd:Q884 .        # 국가가 한국
  SERVICE wikibase:label { bd:serviceParam wikibase:language "ko,en" }
}
LIMIT 50
\`\`\`

## 실습 쿼리들

\`\`\`sparql
# 1. 삼성전자 정보
SELECT ?prop ?propLabel ?value ?valueLabel
WHERE {
  wd:Q20718 ?prop ?value .       # Q20718 = 삼성전자
  SERVICE wikibase:label { bd:serviceParam wikibase:language "ko,en" }
}
LIMIT 50

# 2. 한국 IT 기업들
SELECT ?company ?companyLabel ?founded
WHERE {
  ?company wdt:P31 wd:Q4830453 ;  # instance of 기업
           wdt:P17 wd:Q884 ;       # 국가 = 한국
           wdt:P452 wd:Q11661 .    # 산업 = 정보기술
  OPTIONAL { ?company wdt:P571 ?founded }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "ko,en" }
}
ORDER BY ?founded
LIMIT 50

# 3. 노벨상 수상자 (한국)
SELECT ?person ?personLabel ?award ?awardLabel ?year
WHERE {
  ?person wdt:P27 wd:Q884 ;       # 국적 = 한국
          wdt:P166 ?award .       # 수상
  ?award wdt:P31/wdt:P279* wd:Q7191 .  # 노벨상 종류
  OPTIONAL { ?person wdt:P585 ?year }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "ko,en" }
}

# 4. 서울에서 태어난 유명인
SELECT ?person ?personLabel ?birthDate
WHERE {
  ?person wdt:P19 wd:Q8684 ;      # 출생지 = 서울
          wdt:P31 wd:Q5 ;          # instance of 인간
          wdt:P569 ?birthDate .
  FILTER (YEAR(?birthDate) >= 1980)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "ko,en" }
}
ORDER BY DESC(?birthDate)
LIMIT 100
\`\`\`

## 주요 프로퍼티

| 코드 | 의미 |
|------|------|
| P31 | instance of (타입) |
| P279 | subclass of (상위 클래스) |
| P17 | country (국가) |
| P571 | inception (설립일) |
| P159 | headquarters (본사) |
| P169 | CEO |
| P452 | industry (산업) |
      `,
      keyPoints: ['Wikidata는 공개 지식 베이스', 'Q 아이템, P 프로퍼티', 'SERVICE로 레이블 조회'],
      practiceGoal: 'Wikidata SPARQL 쿼리를 작성할 수 있다',
    }),

    createQuizTask('w5d2-quiz', 'Day 2 복습 퀴즈', 15, {
      introduction: '# Day 2 복습 퀴즈',
      questions: [
        {
          id: 'w5d2-q1',
          question: 'SPARQL에서 변수를 표기하는 방법은?',
          options: ['$name 또는 @name', '?name 또는 $name', ':name 또는 #name', '[name] 또는 {name}'],
          correctAnswer: 1,
          explanation: 'SPARQL에서 변수는 ?name 또는 $name으로 표기합니다.',
        },
        {
          id: 'w5d2-q2',
          question: 'OPTIONAL 절의 역할은?',
          options: ['필수 조건 추가', '결과 정렬', '선택적 패턴 매칭', '결과 제한'],
          correctAnswer: 2,
          explanation: 'OPTIONAL은 해당 패턴이 없어도 결과에 포함됩니다 (LEFT JOIN과 유사).',
        },
        {
          id: 'w5d2-q3',
          question: 'foaf:knows+ 경로 표현식의 의미는?',
          options: ['정확히 1번', '0번 이상', '1번 이상', '최대 1번'],
          correctAnswer: 2,
          explanation: '+는 1번 이상의 반복을 의미합니다. *는 0번 이상입니다.',
        },
      ],
      keyPoints: ['?변수 표기', 'OPTIONAL로 선택적 매칭', '+는 1회 이상 반복'],
      practiceGoal: 'SPARQL 문법을 확인한다',
    }),
  ],

  challenge: createChallengeTask('w5d2-challenge', 'Challenge: Wikidata 분석 쿼리', 50, {
    introduction: `
# Challenge: Wikidata 분석 쿼리

## 과제

Wikidata SPARQL 엔드포인트에서 다음 쿼리를 작성하세요.

## 요구사항

1. **한국 대학 목록**: 설립일순 정렬
2. **한국 출신 노벨상 후보**: 분야별 그룹핑
3. **글로벌 IT 기업 TOP 20**: 시가총액 기준
4. **서울 역사 유적지**: 지도 시각화용 좌표 포함
5. **한국 기업 간 관계**: 자회사, 모회사 관계

## 힌트

- 엔드포인트: https://query.wikidata.org/
- 한국 Q884, 서울 Q8684, 대학 Q3918
- 시각화: #defaultView:Map, #defaultView:Graph
    `,
    keyPoints: ['복잡한 Wikidata 쿼리', 'GROUP BY 집계', '시각화 옵션'],
    practiceGoal: '실제 지식 베이스에서 인사이트를 추출할 수 있다',
  }),
}
