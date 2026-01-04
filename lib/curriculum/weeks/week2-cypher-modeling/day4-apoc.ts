// Day 4: APOC 라이브러리
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
// DAY 4: APOC 라이브러리 - Neo4j 확장 프로시저
// =============================================================================

const day4OverviewContent = `# Day 4: APOC 라이브러리 - Neo4j의 스위스 아미 나이프

## 학습 목표

APOC(Awesome Procedures on Cypher)는 Neo4j의 공식 확장 라이브러리로,
450개 이상의 프로시저와 함수를 제공합니다. 오늘은 실무에서 가장 많이 사용되는
핵심 기능들을 마스터합니다.

### 오늘 배울 내용

1. **APOC 개요와 설치**
   - APOC Core vs APOC Extended
   - Neo4j 버전별 호환성
   - 보안 설정 (allowlist)

2. **데이터 Import/Export**
   - JSON, CSV, XML 로드
   - 외부 API 호출
   - 데이터 내보내기

3. **텍스트 처리**
   - 문자열 조작
   - 정규표현식
   - 전화번호/이메일 포맷팅

4. **컬렉션 연산**
   - 리스트 조작
   - 맵 연산
   - 집합 연산

5. **배치 처리**
   - 대용량 데이터 처리
   - 트랜잭션 분할
   - 진행 상황 모니터링

6. **그래프 알고리즘**
   - 경로 확장
   - 서브그래프 추출
   - 노드/관계 복제

## 왜 APOC인가?

### Cypher의 한계

\`\`\`cypher
// 순수 Cypher로는 어려운 작업들:

// 1. JSON 파일에서 데이터 로드
// ❌ Cypher만으로는 불가능

// 2. 외부 API 호출
// ❌ Cypher만으로는 불가능

// 3. 100만 개 노드 일괄 업데이트
// ⚠️ 메모리 부족으로 실패 가능

// 4. 동적 레이블/관계 생성
// ❌ Cypher만으로는 불가능
\`\`\`

### APOC으로 해결

\`\`\`cypher
// 1. JSON 파일 로드
CALL apoc.load.json('https://api.example.com/data.json')
YIELD value
CREATE (n:Data) SET n = value

// 2. 외부 API 호출
CALL apoc.load.jsonParams(
  'https://api.company.com/employees',
  {Authorization: 'Bearer token123'},
  null
) YIELD value
RETURN value

// 3. 100만 개 노드 배치 업데이트
CALL apoc.periodic.iterate(
  'MATCH (n:User) RETURN n',
  'SET n.verified = true',
  {batchSize: 10000, parallel: true}
)

// 4. 동적 레이블 생성
CALL apoc.create.node(['User', 'Premium'], {name: 'Alice'})
\`\`\`

## APOC 카테고리 맵

\`\`\`
apoc
├── load          # 외부 데이터 로드
│   ├── json
│   ├── csv
│   ├── xml
│   └── jdbc
├── export        # 데이터 내보내기
│   ├── json
│   ├── csv
│   └── cypher
├── text          # 문자열 처리
│   ├── join
│   ├── split
│   └── regexGroups
├── coll          # 컬렉션 연산
│   ├── flatten
│   ├── partition
│   └── union
├── periodic      # 배치 처리
│   ├── iterate
│   ├── commit
│   └── rock_n_roll
├── create        # 동적 생성
│   ├── node
│   ├── relationship
│   └── setProperty
├── path          # 경로 연산
│   ├── expand
│   ├── subgraphNodes
│   └── spanningTree
├── date          # 날짜/시간
│   ├── parse
│   ├── format
│   └── add
└── util          # 유틸리티
    ├── sleep
    ├── validate
    └── md5
\`\`\`

## 실습 환경

오늘 실습에서는 다음 데이터셋을 사용합니다:

\`\`\`cypher
// 샘플 데이터 생성
CREATE (samsung:Company {
  name: '삼성전자',
  founded: 1969,
  revenue: 279600000000000,
  employees: 267937
})
CREATE (sk:Company {
  name: 'SK하이닉스',
  founded: 1983,
  revenue: 44700000000000,
  employees: 28000
})
CREATE (apple:Company {
  name: 'Apple',
  founded: 1976,
  revenue: 383000000000,
  employees: 161000
})

CREATE (samsung)-[:SUPPLIES_TO {product: 'Memory', since: 2010}]->(apple)
CREATE (sk)-[:SUPPLIES_TO {product: 'NAND Flash', since: 2015}]->(apple)
CREATE (samsung)-[:COMPETES_WITH]->(sk)
\`\`\`

준비되셨나요? APOC의 강력한 기능들을 하나씩 마스터해 봅시다!
`

const apocOverviewVideoTranscript = `
안녕하세요! 오늘은 APOC 라이브러리에 대해 알아보겠습니다.

APOC은 "Awesome Procedures on Cypher"의 약자로, Neo4j의 공식 확장 라이브러리입니다.
450개 이상의 프로시저와 함수를 제공하며, 순수 Cypher로는 할 수 없는 많은 작업을 가능하게 합니다.

APOC에는 두 가지 버전이 있습니다:
1. APOC Core - Neo4j에 기본 포함, 핵심 기능
2. APOC Extended - 추가 설치 필요, 고급 기능

설치 방법을 살펴볼까요?

Neo4j Desktop을 사용하신다면:
1. Database 선택
2. Plugins 탭 클릭
3. APOC 설치 버튼 클릭

Neo4j Aura(클라우드)를 사용하신다면 APOC Core가 이미 설치되어 있습니다.

Docker를 사용하신다면:
NEO4J_PLUGINS 환경 변수에 apoc을 추가하면 됩니다.

중요한 보안 설정이 있는데요, neo4j.conf 파일에서 APOC 프로시저의 allowlist를 설정해야 합니다.
dbms.security.procedures.allowlist=apoc.* 이렇게 설정하면 모든 APOC 프로시저를 사용할 수 있습니다.

설치가 완료되었다면, CALL apoc.help('load') 명령으로 load 관련 프로시저들을 확인할 수 있습니다.

다음 섹션에서는 실제로 APOC을 사용하여 외부 데이터를 로드하는 방법을 알아보겠습니다.
`

const dataImportExportContent = `# APOC 데이터 Import/Export

## 1. JSON 데이터 로드

### apoc.load.json - 기본 사용법

\`\`\`cypher
// 로컬 JSON 파일 로드
CALL apoc.load.json('file:///companies.json')
YIELD value
RETURN value

// URL에서 JSON 로드
CALL apoc.load.json('https://api.example.com/companies.json')
YIELD value
UNWIND value.companies AS company
CREATE (c:Company {
  name: company.name,
  founded: company.founded,
  industry: company.industry
})
\`\`\`

### JSON 파일 예시

\`\`\`json
{
  "companies": [
    {"name": "삼성전자", "founded": 1969, "industry": "Electronics"},
    {"name": "SK하이닉스", "founded": 1983, "industry": "Semiconductor"},
    {"name": "현대자동차", "founded": 1967, "industry": "Automotive"}
  ]
}
\`\`\`

### apoc.load.jsonParams - 인증이 필요한 API

\`\`\`cypher
// API 키 인증
CALL apoc.load.jsonParams(
  'https://api.company.com/data',
  {
    \`Authorization\`: 'Bearer YOUR_API_KEY',
    \`Content-Type\`: 'application/json'
  },
  null
) YIELD value
RETURN value

// POST 요청으로 데이터 전송
CALL apoc.load.jsonParams(
  'https://api.company.com/search',
  {\`Content-Type\`: 'application/json'},
  '{"query": "semiconductor", "limit": 10}'
) YIELD value
RETURN value
\`\`\`

## 2. CSV 데이터 로드

### apoc.load.csv - 대용량 CSV 처리

\`\`\`cypher
// 기본 CSV 로드
CALL apoc.load.csv('file:///transactions.csv')
YIELD lineNo, map, list
RETURN lineNo, map

// 필드 매핑과 함께 로드
CALL apoc.load.csv(
  'file:///products.csv',
  {
    header: true,
    sep: ',',
    mapping: {
      price: {type: 'float'},
      quantity: {type: 'int'},
      date: {type: 'date', format: 'yyyy-MM-dd'}
    }
  }
) YIELD map
CREATE (p:Product)
SET p = map
\`\`\`

### CSV 파일 예시

\`\`\`csv
id,name,price,quantity,date
1,스마트폰,1200000,50,2024-01-15
2,태블릿,800000,30,2024-01-16
3,노트북,1500000,20,2024-01-17
\`\`\`

## 3. XML 데이터 로드

\`\`\`cypher
// XML 로드
CALL apoc.load.xml('file:///catalog.xml')
YIELD value
UNWIND value._children AS product
CREATE (p:Product {
  name: product.name,
  price: toFloat(product.price)
})

// XPath 사용
CALL apoc.load.xml(
  'file:///catalog.xml',
  '/catalog/product[@category="electronics"]'
) YIELD value
RETURN value
\`\`\`

## 4. 데이터 내보내기

### apoc.export.json

\`\`\`cypher
// 전체 그래프를 JSON으로 내보내기
CALL apoc.export.json.all('export/full-graph.json', {})

// 특정 쿼리 결과만 내보내기
CALL apoc.export.json.query(
  'MATCH (c:Company)-[r:SUPPLIES_TO]->(c2:Company) RETURN c, r, c2',
  'export/supply-chain.json',
  {}
)

// 특정 노드/관계만 내보내기
MATCH (c:Company {industry: 'Semiconductor'})
WITH collect(c) AS nodes
CALL apoc.export.json.data(nodes, [], 'export/semiconductors.json', {})
YIELD file, nodes, relationships
RETURN file, nodes, relationships
\`\`\`

### apoc.export.csv

\`\`\`cypher
// CSV로 내보내기
CALL apoc.export.csv.query(
  'MATCH (c:Company) RETURN c.name AS name, c.founded AS founded, c.employees AS employees',
  'export/companies.csv',
  {}
)

// 특정 필드만 선택하여 내보내기
CALL apoc.export.csv.query(
  'MATCH (c:Company)-[r:SUPPLIES_TO]->(c2:Company)
   RETURN c.name AS supplier, c2.name AS customer, r.product AS product',
  'export/supply-relations.csv',
  {delim: ',', quotes: true}
)
\`\`\`

### apoc.export.cypher - 마이그레이션용

\`\`\`cypher
// 전체 그래프를 Cypher 스크립트로 내보내기
CALL apoc.export.cypher.all('export/migration.cypher', {
  format: 'cypher-shell',
  separateFiles: true
})

// 스키마만 내보내기
CALL apoc.export.cypher.schema('export/schema.cypher', {})
\`\`\`

## 5. JDBC 연결 (관계형 DB)

\`\`\`cypher
// MySQL에서 데이터 로드
CALL apoc.load.jdbc(
  'jdbc:mysql://localhost:3306/company_db?user=root&password=secret',
  'SELECT id, name, founded FROM companies WHERE industry = "Tech"'
) YIELD row
CREATE (c:Company {
  id: row.id,
  name: row.name,
  founded: row.founded
})

// PostgreSQL에서 데이터 로드
CALL apoc.load.jdbc(
  'jdbc:postgresql://localhost:5432/analytics',
  'SELECT * FROM transactions WHERE amount > 1000000'
) YIELD row
CREATE (t:Transaction)
SET t = row
\`\`\`

## 실전 예제: 네이버 뉴스 API 연동

\`\`\`cypher
// 네이버 뉴스 검색 결과 로드 (실제 API 키 필요)
CALL apoc.load.jsonParams(
  'https://openapi.naver.com/v1/search/news.json?query=삼성전자&display=10',
  {
    \`X-Naver-Client-Id\`: 'YOUR_CLIENT_ID',
    \`X-Naver-Client-Secret\`: 'YOUR_CLIENT_SECRET'
  },
  null
) YIELD value
UNWIND value.items AS item
CREATE (n:News {
  title: item.title,
  description: item.description,
  link: item.link,
  pubDate: item.pubDate
})
\`\`\`

## 주의사항

1. **파일 경로**: Neo4j 설정에서 apoc.import.file.enabled=true 필요
2. **URL 호출**: apoc.import.file.use_neo4j_config=false 설정 권장
3. **대용량 데이터**: 배치 처리와 함께 사용 권장
4. **보안**: API 키는 환경 변수나 설정 파일에서 관리

이제 다음 섹션에서 텍스트 처리 기능을 알아보겠습니다!
`

const textProcessingContent = `# APOC 텍스트 처리

## apoc.text 함수들

APOC은 강력한 텍스트 처리 기능을 제공합니다.
데이터 정제, 검색, 변환에 필수적인 기능들입니다.

## 1. 기본 문자열 조작

### 연결과 분리

\`\`\`cypher
// 문자열 합치기
RETURN apoc.text.join(['Samsung', 'Electronics', 'Co'], ' ')
// "Samsung Electronics Co"

// 문자열 분리
RETURN apoc.text.split('삼성전자,SK하이닉스,LG화학', ',')
// ["삼성전자", "SK하이닉스", "LG화학"]

// 구분자로 분리 (정규식 지원)
RETURN apoc.text.regexGroups(
  'Samsung: $279.6B, SK: $44.7B',
  '([A-Za-z]+): \\$([0-9.]+)B'
)
// [["Samsung: $279.6B", "Samsung", "279.6"], ["SK: $44.7B", "SK", "44.7"]]
\`\`\`

### 대소문자 변환

\`\`\`cypher
// 소문자로
RETURN apoc.text.lowerCase('SAMSUNG ELECTRONICS')
// "samsung electronics"

// 대문자로
RETURN apoc.text.upperCase('samsung electronics')
// "SAMSUNG ELECTRONICS"

// 카멜케이스로
RETURN apoc.text.camelCase('company_name_field')
// "companyNameField"

// 스네이크케이스로
RETURN apoc.text.snakeCase('companyNameField')
// "company_name_field"

// 타이틀케이스
RETURN apoc.text.capitalize('samsung electronics')
// "Samsung electronics"

RETURN apoc.text.capitalizeAll('samsung electronics')
// "Samsung Electronics"
\`\`\`

## 2. 정규표현식

### 패턴 매칭

\`\`\`cypher
// 이메일 검증
WITH 'user@example.com' AS email
RETURN apoc.text.regexGroups(
  email,
  '^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,})$'
) AS parts
// [["user@example.com", "user", "example", "com"]]

// 전화번호 추출
WITH '연락처: 010-1234-5678, 대표전화: 02-123-4567' AS text
RETURN apoc.text.regexGroups(
  text,
  '(\\d{2,3})-(\\d{3,4})-(\\d{4})'
) AS phones
// [["010-1234-5678", "010", "1234", "5678"], ["02-123-4567", "02", "123", "4567"]]
\`\`\`

### 패턴 대체

\`\`\`cypher
// 민감 정보 마스킹
WITH '계좌번호: 123-45-67890' AS text
RETURN apoc.text.replace(
  text,
  '\\d{3}-\\d{2}-\\d{5}',
  '***-**-*****'
)
// "계좌번호: ***-**-*****"

// HTML 태그 제거
WITH '<p>삼성전자 <b>주가</b> 상승</p>' AS html
RETURN apoc.text.replace(html, '<[^>]+>', '')
// "삼성전자 주가 상승"

// 모든 공백 정규화
WITH '삼성   전자    반도체' AS text
RETURN apoc.text.replace(text, '\\s+', ' ')
// "삼성 전자 반도체"
\`\`\`

## 3. 검색과 유사도

### 퍼지 매칭

\`\`\`cypher
// Levenshtein 거리 (편집 거리)
RETURN apoc.text.distance('삼성전자', '삼성젼자') AS distance
// 1

// 유사도 (0-1)
RETURN apoc.text.levenshteinSimilarity('Samsung', 'Samsong') AS similarity
// 0.857...

// 소리 기반 유사도 (영어)
RETURN apoc.text.phonetic('Samsung')
// "S5252" (Soundex)

// 유사한 회사 찾기
MATCH (c:Company)
WHERE apoc.text.levenshteinSimilarity(c.name, '삼성젼자') > 0.7
RETURN c.name, apoc.text.levenshteinSimilarity(c.name, '삼성젼자') AS similarity
ORDER BY similarity DESC
\`\`\`

### 포함 여부 검사

\`\`\`cypher
// 문자열 포함 여부
RETURN apoc.text.contains('삼성전자 반도체 사업부', '반도체')
// true

// 시작/끝 검사
RETURN apoc.text.startsWith('Samsung Electronics', 'Sam')
// true

RETURN apoc.text.endsWith('samsung.com', '.com')
// true

// 단어 포함 여부 (공백 기준)
RETURN apoc.text.containsWord('Samsung Electronics Co Ltd', 'Electronics')
// true
\`\`\`

## 4. 포맷팅

### 숫자 포맷팅

\`\`\`cypher
// 통화 형식
WITH 279600000000000 AS revenue
RETURN apoc.text.format('%,d', [revenue]) AS formatted
// "279,600,000,000,000"

// 소수점 자릿수
WITH 3.14159265 AS pi
RETURN apoc.text.format('%.2f', [pi]) AS formatted
// "3.14"

// 백분율
WITH 0.8567 AS ratio
RETURN apoc.text.format('%.1f%%', [ratio * 100]) AS formatted
// "85.7%"
\`\`\`

### 템플릿 문자열

\`\`\`cypher
// 변수 치환
WITH {company: '삼성전자', product: '반도체', year: 2024} AS data
RETURN apoc.text.format(
  '%s의 %s 사업은 %d년에 성장할 것으로 예상됩니다.',
  [data.company, data.product, data.year]
)
// "삼성전자의 반도체 사업은 2024년에 성장할 것으로 예상됩니다."
\`\`\`

## 5. 정제와 변환

### 공백 처리

\`\`\`cypher
// 앞뒤 공백 제거
RETURN apoc.text.trim('  삼성전자  ')
// "삼성전자"

// 모든 공백 제거
RETURN apoc.text.replace('삼 성 전 자', '\\s', '')
// "삼성전자"

// 연속 공백을 하나로
RETURN apoc.text.clean('삼성    전자')
// "삼성 전자"
\`\`\`

### 해시와 인코딩

\`\`\`cypher
// MD5 해시
RETURN apoc.util.md5(['password123'])
// "482c811da5d5b4bc6d497ffa98491e38"

// SHA256 해시
RETURN apoc.util.sha256(['password123'])
// "ef92b778bafe771e89245b89ecbc..."

// Base64 인코딩
RETURN apoc.text.base64Encode('삼성전자')
// "7IK87ISx7KCE7J6Q"

// Base64 디코딩
RETURN apoc.text.base64Decode('7IK87ISx7KCE7J6Q')
// "삼성전자"

// URL 인코딩
RETURN apoc.text.urlencode('삼성전자 뉴스')
// "%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EB%89%B4%EC%8A%A4"
\`\`\`

## 실전 예제: 데이터 정제 파이프라인

\`\`\`cypher
// 뉴스 타이틀 정제
WITH '<b>삼성전자</b> 2024년  실적   발표...' AS rawTitle

// 1. HTML 태그 제거
WITH apoc.text.replace(rawTitle, '<[^>]+>', '') AS step1

// 2. 연속 공백 정규화
WITH apoc.text.replace(step1, '\\s+', ' ') AS step2

// 3. 앞뒤 공백 제거
WITH apoc.text.trim(step2) AS step3

// 4. 말줄임표 처리
WITH apoc.text.replace(step3, '\\.{2,}', '...') AS cleaned

RETURN cleaned
// "삼성전자 2024년 실적 발표..."
\`\`\`

이제 컬렉션 연산으로 넘어가겠습니다!
`

const collectionOperationsVideoTranscript = `
안녕하세요! 이번에는 APOC의 컬렉션 연산 기능을 알아보겠습니다.

Cypher에도 기본적인 리스트 연산이 있지만, APOC의 apoc.coll 함수들은
훨씬 더 강력하고 다양한 기능을 제공합니다.

먼저 기본적인 컬렉션 생성부터 볼까요?

apoc.coll.zip 함수는 두 개의 리스트를 하나로 합칩니다.
예를 들어 회사 이름 리스트와 매출 리스트가 있다면,
zip으로 합쳐서 [['삼성전자', 279], ['SK하이닉스', 44]] 이런 형태로 만들 수 있습니다.

apoc.coll.partition은 리스트를 균등하게 나눕니다.
1000개의 요소를 100개씩 10개의 그룹으로 나눌 때 유용하죠.
배치 처리할 때 많이 사용됩니다.

apoc.coll.flatten은 중첩된 리스트를 1차원으로 펼칩니다.
[[1,2], [3,4], [5,6]]을 [1,2,3,4,5,6]으로 만들 수 있습니다.

집합 연산도 강력합니다.
apoc.coll.union은 합집합,
apoc.coll.intersection은 교집합,
apoc.coll.subtract는 차집합을 구합니다.

중복 제거가 필요하면 apoc.coll.toSet을 사용하세요.
정렬은 apoc.coll.sort와 apoc.coll.sortNodes가 있습니다.

실전에서 자주 쓰는 패턴은 groupBy입니다.
apoc.coll.groupBy를 사용하면 특정 속성 기준으로 노드들을 그룹화할 수 있습니다.

다음 실습 시간에 직접 이 함수들을 사용해 보겠습니다!
`

const collectionPracticeContent = `# APOC 컬렉션 연산 실습

## 연습 목표
apoc.coll 함수들을 사용하여 복잡한 데이터 변환을 수행합니다.

## 문제 1: 리스트 조작

### 시작 데이터
\`\`\`cypher
WITH ['삼성전자', 'SK하이닉스', 'LG화학', '현대자동차', '네이버'] AS companies,
     [279.6, 44.7, 31.2, 142.5, 6.8] AS revenues
\`\`\`

### 과제
1. 두 리스트를 하나의 맵 리스트로 결합 [{name: '삼성전자', revenue: 279.6}, ...]
2. 매출 100조 이상 기업만 필터링
3. 매출 기준 내림차순 정렬

### 정답
\`\`\`cypher
WITH ['삼성전자', 'SK하이닉스', 'LG화학', '현대자동차', '네이버'] AS companies,
     [279.6, 44.7, 31.2, 142.5, 6.8] AS revenues

// 1. zip으로 결합
WITH apoc.coll.zip(companies, revenues) AS pairs
UNWIND pairs AS pair
WITH {name: pair[0], revenue: pair[1]} AS company

// 2. 100조 이상 필터링
WHERE company.revenue >= 100
WITH collect(company) AS filtered

// 3. 매출 기준 정렬
UNWIND filtered AS c
RETURN c.name, c.revenue
ORDER BY c.revenue DESC
\`\`\`

## 문제 2: 집합 연산

### 시나리오
두 개의 투자 포트폴리오가 있습니다. 공통 종목과 차이를 분석하세요.

\`\`\`cypher
WITH ['삼성전자', 'SK하이닉스', 'LG화학', '카카오'] AS portfolio_a,
     ['삼성전자', 'POSCO', '카카오', '셀트리온'] AS portfolio_b
\`\`\`

### 과제
1. 두 포트폴리오의 공통 종목 (교집합)
2. 포트폴리오 A에만 있는 종목 (차집합)
3. 전체 보유 종목 (합집합, 중복 제거)

### 정답
\`\`\`cypher
WITH ['삼성전자', 'SK하이닉스', 'LG화학', '카카오'] AS portfolio_a,
     ['삼성전자', 'POSCO', '카카오', '셀트리온'] AS portfolio_b

RETURN
  // 1. 교집합
  apoc.coll.intersection(portfolio_a, portfolio_b) AS common,

  // 2. 차집합 (A - B)
  apoc.coll.subtract(portfolio_a, portfolio_b) AS only_in_a,

  // 3. 합집합
  apoc.coll.union(portfolio_a, portfolio_b) AS all_stocks
\`\`\`

## 문제 3: 그룹화와 집계

### 시나리오
거래 데이터를 카테고리별로 그룹화하여 분석하세요.

\`\`\`cypher
WITH [
  {category: 'tech', company: '삼성전자', amount: 5000000},
  {category: 'tech', company: 'SK하이닉스', amount: 3000000},
  {category: 'bio', company: '셀트리온', amount: 2000000},
  {category: 'tech', company: '네이버', amount: 1500000},
  {category: 'bio', company: '삼성바이오', amount: 4000000},
  {category: 'auto', company: '현대자동차', amount: 2500000}
] AS transactions
\`\`\`

### 과제
1. 카테고리별로 거래를 그룹화
2. 각 카테고리별 총 거래액 계산
3. 거래액이 가장 큰 카테고리 찾기

### 정답
\`\`\`cypher
WITH [
  {category: 'tech', company: '삼성전자', amount: 5000000},
  {category: 'tech', company: 'SK하이닉스', amount: 3000000},
  {category: 'bio', company: '셀트리온', amount: 2000000},
  {category: 'tech', company: '네이버', amount: 1500000},
  {category: 'bio', company: '삼성바이오', amount: 4000000},
  {category: 'auto', company: '현대자동차', amount: 2500000}
] AS transactions

// 1. 카테고리별 그룹화
WITH apoc.map.groupBy(transactions, 'category') AS grouped

// 2. 각 카테고리별 총액 계산
UNWIND keys(grouped) AS category
WITH category,
     grouped[category] AS txns,
     reduce(total = 0, t IN grouped[category] | total + t.amount) AS totalAmount

// 3. 정렬하여 가장 큰 카테고리 찾기
RETURN category, totalAmount
ORDER BY totalAmount DESC
LIMIT 1
\`\`\`

## 문제 4: 리스트 변환

### 과제
노드 리스트를 다양한 형태로 변환하세요.

\`\`\`cypher
// 샘플 데이터 생성
CREATE (c1:Company {name: '삼성전자', industry: 'tech', employees: 267937})
CREATE (c2:Company {name: 'SK하이닉스', industry: 'tech', employees: 28000})
CREATE (c3:Company {name: '셀트리온', industry: 'bio', employees: 3200})
CREATE (c4:Company {name: '현대자동차', industry: 'auto', employees: 75000})
\`\`\`

### 변환 과제
1. 모든 회사명을 쉼표로 구분된 문자열로
2. 산업별로 회사 그룹화
3. 직원 수 기준 상위 2개 회사

### 정답
\`\`\`cypher
MATCH (c:Company)
WITH collect(c) AS companies

// 1. 회사명 문자열로
WITH companies,
     apoc.text.join([c IN companies | c.name], ', ') AS companyNames

// 2. 산업별 그룹화
WITH companies, companyNames,
     apoc.coll.groupBy([c IN companies | {industry: c.industry, name: c.name}], 'industry') AS byIndustry

// 3. 직원 수 상위 2개
WITH companies, companyNames, byIndustry,
     [c IN apoc.coll.sortNodes(companies, 'employees')[..-3] | c.name] AS top2

RETURN companyNames, byIndustry, top2
\`\`\`
`

const batchProcessingVideoTranscript = `
안녕하세요! 이번에는 APOC의 가장 강력한 기능 중 하나인 배치 처리를 알아보겠습니다.

대용량 데이터를 처리할 때, 순수 Cypher로 모든 노드를 한번에 업데이트하면 어떤 문제가 생길까요?

예를 들어 100만 개의 노드에 새 속성을 추가한다고 해봅시다.
MATCH (n) SET n.newProp = 'value'
이렇게 하면 Neo4j는 100만 개의 변경을 하나의 트랜잭션에서 처리합니다.
메모리 사용량이 급증하고, 트랜잭션이 너무 오래 걸리면 타임아웃이 발생할 수 있습니다.

APOC의 apoc.periodic.iterate를 사용하면 이 문제를 해결할 수 있습니다.

이 프로시저는 두 개의 쿼리를 받습니다:
첫 번째는 데이터 소스 쿼리 - 처리할 대상을 찾는 쿼리입니다.
두 번째는 실행 쿼리 - 각 대상에 대해 실행할 작업입니다.

batchSize 옵션으로 한 번에 처리할 개수를 지정합니다.
예를 들어 batchSize: 10000으로 설정하면,
100만 개를 100번의 트랜잭션으로 나눠서 처리합니다.

parallel: true 옵션을 주면 여러 배치를 병렬로 처리할 수 있어서 더 빠릅니다.
하지만 병렬 처리는 쓰기 충돌이 없을 때만 사용해야 합니다.

retries 옵션은 실패 시 재시도 횟수입니다.
일시적인 락 충돌이 발생할 수 있기 때문에 2-3으로 설정하는 것이 좋습니다.

진행 상황을 모니터링하고 싶다면 Neo4j Browser에서
CALL dbms.listTransactions() 또는
CALL apoc.periodic.list()를 사용하세요.

실제 사용 예제를 함께 살펴보겠습니다!
`

const batchPracticeInstructions = `# APOC 배치 처리 실습

## 🎯 왜 배치 처리를 배우는가?

### 문제 상황
대용량 데이터 업데이트 시 발생하는 문제:
- 💥 "100만 개 노드를 한 번에 업데이트하다 메모리 부족으로 죽었어요"
- ⏰ "대량 삭제 쿼리가 타임아웃돼요"
- 🔒 "대용량 업데이트 중 다른 쿼리가 블로킹돼요"

순수 Cypher의 MATCH ... SET은 모든 변경을 하나의 트랜잭션에서 처리하려고 합니다.

### 해결책: apoc.periodic.iterate
> 🍕 **비유**: 피자를 한입에 먹기 vs 한 조각씩 먹기
>
> 100만 개 = 하나의 트랜잭션 → 메모리 폭발
> 1만 개씩 100번 = 100개의 트랜잭션 → 안전

---

## 목표
apoc.periodic.iterate를 사용하여 대용량 데이터를 안전하게 처리하는 방법을 익힙니다.

## 시나리오
100만 개의 거래 노드가 있고, 모든 거래에 대해 수수료 계산과 상태 업데이트가 필요합니다.

## 실습 1: 기본 배치 업데이트

순수 Cypher (❌ 메모리 문제 발생 가능):
\`\`\`cypher
MATCH (t:Transaction)
SET t.fee = t.amount * 0.01,
    t.status = 'processed',
    t.processedAt = datetime()
\`\`\`

APOC 배치 처리 (✅ 권장):
\`\`\`cypher
CALL apoc.periodic.iterate(
  // 소스 쿼리: 처리할 대상
  'MATCH (t:Transaction) WHERE t.status = "pending" RETURN t',

  // 실행 쿼리: 각 노드에 대해 실행
  'SET t.fee = t.amount * 0.01,
       t.status = "processed",
       t.processedAt = datetime()',

  // 옵션
  {
    batchSize: 10000,      // 한 트랜잭션당 처리 개수
    parallel: true,         // 병렬 처리
    concurrency: 4,         // 동시 실행 스레드 수
    retries: 3,            // 실패 시 재시도
    batchMode: "BATCH"     // 배치 모드
  }
) YIELD batches, total, timeTaken, committedOperations, failedOperations
RETURN batches, total, timeTaken, committedOperations, failedOperations
\`\`\`

## 실습 2: 조건부 노드 생성

CSV 파일에서 100만 개의 제품을 로드:
\`\`\`cypher
CALL apoc.periodic.iterate(
  // 소스: CSV 로드
  'CALL apoc.load.csv("file:///products.csv") YIELD map RETURN map',

  // 실행: MERGE로 중복 방지
  'MERGE (p:Product {id: map.id})
   SET p.name = map.name,
       p.price = toFloat(map.price),
       p.category = map.category',

  {batchSize: 5000, parallel: false}  // MERGE는 병렬 처리 X
)
\`\`\`

## 실습 3: 관계 대량 생성

고객-제품 구매 관계 생성:
\`\`\`cypher
CALL apoc.periodic.iterate(
  // 소스: 구매 기록 조회
  'MATCH (c:Customer), (p:Product)
   WHERE c.id IN p.purchasedBy
   RETURN c, p',

  // 실행: 관계 생성
  'CREATE (c)-[:PURCHASED {date: date()}]->(p)',

  {batchSize: 10000, parallel: true}
)
\`\`\`

## 실습 4: 노드 대량 삭제

오래된 로그 노드 정리:
\`\`\`cypher
CALL apoc.periodic.iterate(
  // 30일 이상 된 로그
  'MATCH (log:Log)
   WHERE log.createdAt < datetime() - duration("P30D")
   RETURN log',

  // 관계와 함께 삭제
  'DETACH DELETE log',

  {batchSize: 10000, parallel: false}  // 삭제는 순차 처리 권장
)
\`\`\`

## 실습 5: 속성 대량 변환

가격을 달러에서 원화로 변환:
\`\`\`cypher
CALL apoc.periodic.iterate(
  'MATCH (p:Product) WHERE p.currency = "USD" RETURN p',

  'SET p.priceKRW = p.priceUSD * 1300,
       p.currency = "KRW"',

  {batchSize: 10000, parallel: true}
)
\`\`\`

## 진행 상황 모니터링

\`\`\`cypher
// 현재 실행 중인 배치 작업 확인
CALL apoc.periodic.list() YIELD name, count, rate
RETURN name, count, rate

// 작업 취소
CALL apoc.periodic.cancel('job-name')
\`\`\`

## 과제

아래 시나리오에 대한 배치 처리 쿼리를 작성하세요:

1. 모든 Company 노드에 'verified' 속성을 true로 설정
2. 모든 Person 노드의 이름을 대문자로 변환
3. 1년 이상 활동이 없는 User 노드에 'inactive' 레이블 추가
`

const batchPracticeStarterCode = `// ========================================
// 📌 Step 1: Company 검증 속성 설정
// ========================================
// TODO: apoc.periodic.iterate 사용

CALL apoc.periodic.iterate(
  // 소스 쿼리를 작성하세요
  '',

  // 실행 쿼리를 작성하세요
  '',

  // 옵션을 설정하세요 (batchSize, parallel)
  {}
)


// ========================================
// 📌 Step 2: Person 이름 대문자 변환
// ========================================
// 힌트: apoc.text.upperCase 사용

CALL apoc.periodic.iterate(
  '',
  '',
  {}
)


// ========================================
// 📌 Step 3: 비활동 User 레이블 추가
// ========================================
// 힌트: apoc.create.addLabels 사용

CALL apoc.periodic.iterate(
  '',
  '',
  {}
)`

const batchPracticeSolutionCode = `// 과제 1: 모든 Company 노드에 verified 속성 설정
CALL apoc.periodic.iterate(
  'MATCH (c:Company) RETURN c',
  'SET c.verified = true, c.verifiedAt = datetime()',
  {batchSize: 10000, parallel: true}
) YIELD batches, total, timeTaken
RETURN 'Company verified: ' + total + ' nodes in ' + timeTaken + 'ms'


// 과제 2: 모든 Person 노드의 이름을 대문자로 변환
CALL apoc.periodic.iterate(
  'MATCH (p:Person) WHERE p.name IS NOT NULL RETURN p',
  'SET p.name = apoc.text.upperCase(p.name)',
  {batchSize: 10000, parallel: true}
) YIELD batches, total, timeTaken
RETURN 'Person names uppercased: ' + total + ' nodes in ' + timeTaken + 'ms'


// 과제 3: 1년 이상 비활동 User에 inactive 레이블 추가
CALL apoc.periodic.iterate(
  'MATCH (u:User)
   WHERE u.lastActive < datetime() - duration("P365D")
   RETURN u',
  'CALL apoc.create.addLabels(u, ["Inactive"]) YIELD node
   RETURN node',
  {batchSize: 5000, parallel: false}
) YIELD batches, total, timeTaken
RETURN 'Inactive users labeled: ' + total + ' nodes in ' + timeTaken + 'ms'


// 보너스: 진행 상황 확인
CALL apoc.periodic.list() YIELD name, delay, rate, done, cancelled
RETURN name, delay, rate, done, cancelled`

const graphAlgorithmsContent = `# APOC 그래프 알고리즘

## 경로 확장과 서브그래프 추출

APOC은 강력한 그래프 탐색 기능을 제공합니다.
순수 Cypher의 가변 길이 경로보다 더 세밀한 제어가 가능합니다.

## 1. apoc.path.expand - 경로 확장

### 기본 사용법

\`\`\`cypher
// 삼성전자에서 최대 3홉까지 연결된 모든 회사
MATCH (samsung:Company {name: '삼성전자'})
CALL apoc.path.expand(
  samsung,           // 시작 노드
  'SUPPLIES_TO|COMPETES_WITH',  // 관계 유형 (|로 구분)
  'Company',         // 종료 노드 레이블
  1,                 // 최소 홉
  3                  // 최대 홉
) YIELD path
RETURN path
\`\`\`

### 방향 지정

\`\`\`cypher
// > : 나가는 방향
// < : 들어오는 방향
// 없음: 양방향

MATCH (samsung:Company {name: '삼성전자'})
CALL apoc.path.expand(
  samsung,
  'SUPPLIES_TO>|<COMPETES_WITH',  // SUPPLIES_TO는 나가는, COMPETES_WITH는 들어오는
  'Company',
  1, 3
) YIELD path
RETURN path
\`\`\`

### 고급 옵션

\`\`\`cypher
MATCH (samsung:Company {name: '삼성전자'})
CALL apoc.path.expandConfig(
  samsung,
  {
    relationshipFilter: 'SUPPLIES_TO>|COMPETES_WITH',
    labelFilter: '+Company|-Competitor',  // Company 포함, Competitor 제외
    minLevel: 1,
    maxLevel: 5,
    bfs: true,                            // BFS 탐색 (기본값)
    uniqueness: 'NODE_GLOBAL',            // 노드 중복 방지
    limit: 100                            // 최대 결과 수
  }
) YIELD path
RETURN path
\`\`\`

## 2. apoc.path.subgraphNodes - 서브그래프 추출

### 연결된 모든 노드 가져오기

\`\`\`cypher
MATCH (samsung:Company {name: '삼성전자'})
CALL apoc.path.subgraphNodes(
  samsung,
  {
    maxLevel: 3,
    relationshipFilter: 'SUPPLIES_TO|INVESTS_IN|COMPETES_WITH'
  }
) YIELD node
RETURN node
\`\`\`

### 서브그래프 시각화

\`\`\`cypher
MATCH (samsung:Company {name: '삼성전자'})
CALL apoc.path.subgraphAll(
  samsung,
  {
    maxLevel: 2,
    relationshipFilter: 'SUPPLIES_TO|COMPETES_WITH'
  }
) YIELD nodes, relationships
RETURN nodes, relationships
\`\`\`

## 3. apoc.path.spanningTree - 스패닝 트리

\`\`\`cypher
// 최소 스패닝 트리 (모든 노드를 연결하는 최소 경로)
MATCH (samsung:Company {name: '삼성전자'})
CALL apoc.path.spanningTree(
  samsung,
  {
    maxLevel: 5,
    relationshipFilter: 'SUPPLIES_TO|COMPETES_WITH'
  }
) YIELD path
RETURN path
\`\`\`

## 4. 동적 노드/관계 생성

### apoc.create.node - 동적 레이블로 노드 생성

\`\`\`cypher
// 레이블을 변수로 전달
WITH 'Semiconductor' AS industry
CALL apoc.create.node(
  ['Company', industry],  // 동적 레이블
  {name: 'NewCo', founded: 2024}
) YIELD node
RETURN node
\`\`\`

### apoc.create.relationship - 동적 관계 생성

\`\`\`cypher
MATCH (a:Company {name: '삼성전자'})
MATCH (b:Company {name: 'SK하이닉스'})
WITH a, b, 'PARTNERS_WITH' AS relType

CALL apoc.create.relationship(
  a,
  relType,  // 동적 관계 타입
  {since: 2020, description: '반도체 협력'},
  b
) YIELD rel
RETURN rel
\`\`\`

### apoc.create.setProperty - 동적 속성 설정

\`\`\`cypher
MATCH (c:Company {name: '삼성전자'})
WITH c, 'marketCap' AS propName, 500000000000000 AS propValue

CALL apoc.create.setProperty(c, propName, propValue) YIELD node
RETURN node
\`\`\`

## 5. 노드/관계 복제

### apoc.refactor.cloneNodes

\`\`\`cypher
// 노드 복제 (관계 포함)
MATCH (c:Company {name: '삼성전자'})
CALL apoc.refactor.cloneNodes([c], true, ['name'])
YIELD input, output
SET output.name = output.name + ' (복제본)'
RETURN output
\`\`\`

### apoc.refactor.mergeNodes

\`\`\`cypher
// 중복 노드 병합
MATCH (a:Company {name: '삼성전자'})
MATCH (b:Company {name: 'Samsung Electronics'})
CALL apoc.refactor.mergeNodes(
  [a, b],
  {
    properties: 'combine',       // 속성 병합 전략
    mergeRels: true             // 관계도 병합
  }
) YIELD node
RETURN node
\`\`\`

## 6. 실전 예제: 공급망 분석

\`\`\`cypher
// 삼성전자의 3단계 공급망 추출
MATCH (samsung:Company {name: '삼성전자'})

// 1. 공급망 서브그래프 추출
CALL apoc.path.subgraphAll(
  samsung,
  {
    maxLevel: 3,
    relationshipFilter: 'SUPPLIES_TO>'
  }
) YIELD nodes, relationships

// 2. 노드 정보 정리
WITH nodes, relationships
UNWIND nodes AS n
WITH collect(DISTINCT {
  id: id(n),
  name: n.name,
  type: labels(n)[0]
}) AS nodeList,
relationships

// 3. 관계 정보 정리
UNWIND relationships AS r
WITH nodeList, collect({
  source: startNode(r).name,
  target: endNode(r).name,
  type: type(r)
}) AS relList

RETURN nodeList, relList
\`\`\`

## 주요 함수 요약

| 함수 | 용도 |
|------|------|
| apoc.path.expand | 경로 확장 |
| apoc.path.expandConfig | 고급 경로 확장 |
| apoc.path.subgraphNodes | 서브그래프 노드 추출 |
| apoc.path.subgraphAll | 서브그래프 전체 추출 |
| apoc.path.spanningTree | 스패닝 트리 |
| apoc.create.node | 동적 노드 생성 |
| apoc.create.relationship | 동적 관계 생성 |
| apoc.refactor.cloneNodes | 노드 복제 |
| apoc.refactor.mergeNodes | 노드 병합 |
`

const day4QuizQuestions = [
  {
    question: 'APOC에서 외부 JSON API를 호출할 때 사용하는 프로시저는?',
    options: [
      'apoc.load.json',
      'apoc.load.jsonParams',
      'apoc.import.json',
      'apoc.fetch.json'
    ],
    answer: 1,
    explanation: 'apoc.load.jsonParams는 HTTP 헤더(인증 등)와 POST body를 함께 전달할 수 있어 API 호출에 적합합니다. apoc.load.json은 단순 GET 요청에 사용됩니다.'
  },
  {
    question: '100만 개의 노드를 안전하게 업데이트할 때 권장되는 APOC 프로시저는?',
    options: [
      'apoc.do.when',
      'apoc.periodic.iterate',
      'apoc.cypher.run',
      'apoc.batch.update'
    ],
    answer: 1,
    explanation: 'apoc.periodic.iterate는 대용량 데이터를 배치 단위로 나누어 처리합니다. batchSize와 parallel 옵션으로 성능을 최적화할 수 있습니다.'
  },
  {
    question: 'apoc.text.levenshteinSimilarity 함수의 반환값 범위는?',
    options: [
      '-1 ~ 1',
      '0 ~ 100',
      '0 ~ 1',
      '편집 거리 (정수)'
    ],
    answer: 2,
    explanation: 'levenshteinSimilarity는 0(완전히 다름)에서 1(완전히 같음) 사이의 유사도를 반환합니다. 편집 거리 자체는 apoc.text.distance가 반환합니다.'
  },
  {
    question: '두 리스트 [1,2,3]과 [2,3,4]의 교집합을 구하는 APOC 함수는?',
    options: [
      'apoc.coll.union([1,2,3], [2,3,4])',
      'apoc.coll.intersection([1,2,3], [2,3,4])',
      'apoc.coll.subtract([1,2,3], [2,3,4])',
      'apoc.coll.merge([1,2,3], [2,3,4])'
    ],
    answer: 1,
    explanation: 'apoc.coll.intersection은 두 리스트의 교집합을 반환합니다. 결과는 [2,3]입니다. union은 합집합, subtract는 차집합입니다.'
  },
  {
    question: 'apoc.path.expandConfig에서 uniqueness: "NODE_GLOBAL"의 의미는?',
    options: [
      '각 경로 내에서 노드 중복 허용',
      '전체 결과에서 노드 중복 허용',
      '각 경로 내에서 노드 중복 방지',
      '전체 결과에서 노드 중복 방지'
    ],
    answer: 3,
    explanation: 'NODE_GLOBAL은 전체 탐색에서 한 번 방문한 노드를 다시 방문하지 않습니다. NODE_PATH는 현재 경로 내에서만 중복을 방지합니다.'
  },
  {
    question: '동적으로 레이블을 추가할 때 사용하는 APOC 프로시저는?',
    options: [
      'SET n:NewLabel',
      'apoc.create.addLabels(n, ["NewLabel"])',
      'apoc.label.add(n, "NewLabel")',
      'CALL apoc.node.addLabel(n, "NewLabel")'
    ],
    answer: 1,
    explanation: 'apoc.create.addLabels는 변수로 전달된 레이블을 노드에 추가할 수 있습니다. 순수 Cypher의 SET n:Label은 레이블명이 고정되어야 합니다.'
  },
  {
    question: 'CSV 로드 시 숫자 필드를 올바른 타입으로 변환하는 방법은?',
    options: [
      'toFloat(map.price) 사용',
      'mapping 옵션에 타입 지정',
      '자동으로 변환됨',
      '불가능, 문자열로만 로드됨'
    ],
    answer: 1,
    explanation: 'apoc.load.csv의 mapping 옵션에서 {price: {type: "float"}}와 같이 타입을 지정하면 로드 시 자동 변환됩니다. 더 효율적입니다.'
  },
  {
    question: 'apoc.periodic.iterate에서 parallel: true 사용 시 주의사항은?',
    options: [
      '항상 더 빠르므로 무조건 사용',
      'MERGE 작업에서는 충돌 발생 가능',
      '읽기 작업에서만 사용 가능',
      '메모리 사용량이 감소함'
    ],
    answer: 1,
    explanation: 'parallel: true는 여러 배치를 동시에 처리합니다. MERGE처럼 동일 노드를 여러 스레드에서 접근할 수 있는 작업에서는 락 충돌이 발생할 수 있습니다.'
  }
]

const day4ChallengeContent = {
  objectives: [
    'APOC을 활용한 데이터 파이프라인 구축',
    '외부 데이터 로드와 변환 자동화',
    '배치 처리로 대용량 데이터 핸들링',
    '그래프 알고리즘으로 네트워크 분석'
  ],
  requirements: [
    'JSON API에서 기업 데이터 로드 (최소 50개 기업)',
    '텍스트 정규화 파이프라인 구축 (이름 표준화, 공백 정리)',
    '기업 간 관계 자동 추론 (같은 산업 = COMPETES_WITH)',
    '배치 처리로 모든 기업에 신뢰도 점수 계산',
    '3단계 네트워크 분석으로 핵심 허브 기업 식별'
  ],
  evaluationCriteria: [
    'APOC 프로시저의 적절한 선택 (25%)',
    '에러 핸들링과 안정성 (25%)',
    '성능 최적화 (batchSize, parallel 활용) (25%)',
    '코드 가독성과 문서화 (25%)'
  ],
  bonusPoints: [
    'JDBC로 관계형 DB 연동',
    '실시간 진행 상황 로깅',
    '중간 결과 체크포인트 저장',
    '경쟁사 클러스터 시각화 데이터 생성'
  ]
}

// Day 4 완성
export const day4Apoc: Day = {
  slug: 'apoc-library',
  title: 'APOC 라이브러리',
  totalDuration: 240,
  tasks: [
    // Task 1: Day 4 개요
    createReadingTask(
      'day4-overview',
      'Day 4 개요: APOC 라이브러리',
      15,
      [
        'APOC의 개념과 필요성 이해',
        'APOC 카테고리 맵 파악',
        '순수 Cypher의 한계 인식'
      ],
      day4OverviewContent
    ),

    // Task 2: APOC 개요 영상
    createVideoTask(
      'apoc-overview-video',
      'APOC 개요와 설치',
      15,
      [
        'APOC Core vs Extended 구분',
        'Neo4j 버전별 설치 방법',
        '보안 설정 (allowlist)'
      ],
      'https://example.com/apoc-overview',
      apocOverviewVideoTranscript
    ),

    // Task 3: 데이터 Import/Export
    createReadingTask(
      'data-import-export',
      'APOC 데이터 Import/Export',
      25,
      [
        'apoc.load.json/csv/xml 마스터',
        'apoc.load.jsonParams로 API 호출',
        'apoc.export로 데이터 내보내기',
        'JDBC 연결로 RDB 연동'
      ],
      dataImportExportContent
    ),

    // Task 4: 텍스트 처리
    createReadingTask(
      'text-processing',
      'APOC 텍스트 처리',
      20,
      [
        '문자열 조작 (join, split, case)',
        '정규표현식 패턴 매칭',
        '퍼지 매칭과 유사도',
        '해시와 인코딩'
      ],
      textProcessingContent
    ),

    // Task 5: 컬렉션 연산 영상
    createVideoTask(
      'collection-operations-video',
      '컬렉션 연산 기초',
      15,
      [
        'apoc.coll 함수들 이해',
        '집합 연산 (union, intersection)',
        '리스트 변환과 그룹화'
      ],
      'https://example.com/apoc-collections',
      collectionOperationsVideoTranscript
    ),

    // Task 6: 컬렉션 연산 실습
    createCodeTask(
      'collection-practice',
      '컬렉션 연산 실습',
      25,
      [
        'zip, partition, flatten 활용',
        '집합 연산 실습',
        '그룹화와 집계'
      ],
      collectionPracticeContent,
      `// 실습 환경에서 직접 실행해보세요

// 문제 1: 리스트 조작
WITH ['삼성전자', 'SK하이닉스', 'LG화학'] AS companies,
     [279.6, 44.7, 31.2] AS revenues

// TODO: zip으로 결합


// 문제 2: 집합 연산
WITH ['삼성전자', 'SK하이닉스', 'LG화학'] AS portfolio_a,
     ['삼성전자', 'POSCO', '셀트리온'] AS portfolio_b

// TODO: 교집합 구하기`,
      `// 문제 1 정답
WITH ['삼성전자', 'SK하이닉스', 'LG화학'] AS companies,
     [279.6, 44.7, 31.2] AS revenues
WITH apoc.coll.zip(companies, revenues) AS pairs
UNWIND pairs AS pair
RETURN {name: pair[0], revenue: pair[1]} AS company

// 문제 2 정답
WITH ['삼성전자', 'SK하이닉스', 'LG화학'] AS portfolio_a,
     ['삼성전자', 'POSCO', '셀트리온'] AS portfolio_b
RETURN apoc.coll.intersection(portfolio_a, portfolio_b) AS common`,
      [
        '💡 apoc.coll.zip은 두 리스트를 쌍으로 묶습니다',
        '💡 apoc.coll.intersection은 공통 요소를 반환합니다',
        '💡 결과는 배열 형태로 반환됩니다'
      ],
      `
## 💥 Common Pitfalls (자주 하는 실수)

### 1. [리스트 길이 불일치] zip 시 리스트 길이가 다름
**증상**: 짧은 리스트 기준으로 잘림, 데이터 손실

\`\`\`cypher
// ❌ 잘못된 예시: 길이가 다른 리스트 zip
WITH ['A', 'B', 'C'] AS names, [1, 2] AS values
RETURN apoc.coll.zip(names, values)
// 결과: [['A', 1], ['B', 2]] - 'C'가 누락됨!

// ✅ 올바른 예시: 길이 확인 후 처리
WITH ['A', 'B', 'C'] AS names, [1, 2] AS values
WHERE size(names) = size(values)
RETURN apoc.coll.zip(names, values)
// 또는 기본값으로 패딩
\`\`\`

💡 **기억할 점**: zip 전에 size()로 리스트 길이가 같은지 확인

---

### 2. [집합 연산 순서] subtract의 방향 혼동
**증상**: A-B와 B-A 결과가 다른데 혼동

\`\`\`cypher
// ❌ 잘못된 예시: subtract 방향 혼동
WITH [1,2,3] AS a, [2,3,4] AS b
RETURN apoc.coll.subtract(a, b) AS result
// 결과: [1] (a에만 있는 요소)

// 반대로 하면?
RETURN apoc.coll.subtract(b, a) AS result
// 결과: [4] (b에만 있는 요소)

// ✅ 명확하게 사용
// A - B = A에는 있지만 B에는 없는 요소
\`\`\`

💡 **기억할 점**: subtract(A, B)는 "A에서 B를 뺀다" = A에만 있는 요소

---

### 3. [null 처리] 컬렉션에 null 포함 시 예상치 못한 결과
**증상**: null이 포함된 리스트 연산에서 오류 또는 누락

\`\`\`cypher
// ❌ 잘못된 예시: null 포함 리스트
WITH [1, null, 3] AS list
RETURN apoc.coll.sum(list)
// 결과: null (전체가 null이 됨!)

// ✅ 올바른 예시: null 제거 후 연산
WITH [1, null, 3] AS list
RETURN apoc.coll.sum([x IN list WHERE x IS NOT NULL])
// 결과: 4
\`\`\`

💡 **기억할 점**: 컬렉션 연산 전 [x IN list WHERE x IS NOT NULL]로 null 제거
`
    ),

    // Task 7: 배치 처리 영상
    createVideoTask(
      'batch-processing-video',
      '배치 처리 심화',
      15,
      [
        'apoc.periodic.iterate 이해',
        'batchSize와 parallel 최적화',
        '진행 상황 모니터링'
      ],
      'https://example.com/apoc-batch',
      batchProcessingVideoTranscript
    ),

    // Task 8: 배치 처리 실습
    createCodeTask(
      'batch-practice',
      '배치 처리 실습',
      30,
      [
        '대용량 데이터 안전 처리',
        '배치 업데이트 최적화',
        '진행 상황 모니터링'
      ],
      batchPracticeInstructions,
      batchPracticeStarterCode,
      batchPracticeSolutionCode,
      [
        '💡 소스 쿼리는 RETURN으로 끝나야 합니다',
        '💡 실행 쿼리에서 소스 쿼리의 변수를 사용합니다',
        '💡 삭제 작업은 parallel: false를 권장합니다',
        '💡 apoc.create.addLabels로 동적 레이블 추가'
      ],
      `
## 💥 Common Pitfalls (자주 하는 실수)

### 1. [MERGE + parallel] MERGE 작업에 parallel: true 사용
**증상**: 중복 노드 생성, 데드락, 트랜잭션 실패

\`\`\`cypher
// ❌ 잘못된 예시: MERGE에 병렬 처리
CALL apoc.periodic.iterate(
  'CALL apoc.load.csv("file:///users.csv") YIELD map RETURN map',
  'MERGE (u:User {id: map.id}) SET u.name = map.name',
  {batchSize: 10000, parallel: true}  // 동일 노드에 동시 접근!
)
// 결과: 중복 노드 생성 또는 데드락

// ✅ 올바른 예시: MERGE는 반드시 순차 처리
CALL apoc.periodic.iterate(
  'CALL apoc.load.csv("file:///users.csv") YIELD map RETURN map',
  'MERGE (u:User {id: map.id}) SET u.name = map.name',
  {batchSize: 10000, parallel: false}  // 순차 처리로 안전
)
\`\`\`

💡 **기억할 점**: MERGE, CREATE (동일 키), DELETE는 parallel: false 필수

---

### 2. [소스 쿼리 오류] 소스 쿼리에 RETURN 누락
**증상**: 실행 쿼리에서 변수를 찾을 수 없음

\`\`\`cypher
// ❌ 잘못된 예시: RETURN 없음
CALL apoc.periodic.iterate(
  'MATCH (n:User)',  // RETURN 없음!
  'SET n.verified = true',
  {batchSize: 1000}
)
// ERROR: Variable 'n' not defined

// ✅ 올바른 예시: RETURN으로 변수 전달
CALL apoc.periodic.iterate(
  'MATCH (n:User) RETURN n',  // n을 반환
  'SET n.verified = true',
  {batchSize: 1000}
)
\`\`\`

💡 **기억할 점**: 소스 쿼리는 반드시 RETURN으로 끝나야 함

---

### 3. [batchSize 과대] 배치 크기를 너무 크게 설정
**증상**: 메모리 부족, 트랜잭션 타임아웃

\`\`\`cypher
// ❌ 잘못된 예시: 배치 크기 100만
CALL apoc.periodic.iterate(
  'MATCH (n:Log) RETURN n',
  'DETACH DELETE n',
  {batchSize: 1000000}  // 한 트랜잭션에 100만 개!
)
// 결과: 메모리 부족 또는 타임아웃

// ✅ 올바른 예시: 적절한 배치 크기 (1,000 ~ 50,000)
CALL apoc.periodic.iterate(
  'MATCH (n:Log) RETURN n',
  'DETACH DELETE n',
  {batchSize: 10000}  // 1만 개씩 안전하게
)
\`\`\`

💡 **기억할 점**: batchSize는 1,000 ~ 50,000 사이, 삭제는 10,000 이하 권장
`
    ),

    // Task 9: 그래프 알고리즘
    createReadingTask(
      'graph-algorithms',
      'APOC 그래프 알고리즘',
      25,
      [
        'apoc.path.expand로 경로 확장',
        '서브그래프 추출 기법',
        '동적 노드/관계 생성',
        '노드 복제와 병합'
      ],
      graphAlgorithmsContent
    ),

    // Task 10: Day 4 퀴즈
    createQuizTask(
      'day4-quiz',
      'APOC 라이브러리 퀴즈',
      20,
      day4QuizQuestions
    ),

    // Task 11: Day 4 챌린지
    createChallengeTask(
      'day4-challenge',
      'Day 4 종합 챌린지: 데이터 파이프라인 구축',
      40,
      day4ChallengeContent.objectives,
      day4ChallengeContent.requirements,
      day4ChallengeContent.evaluationCriteria,
      day4ChallengeContent.bonusPoints
    ),

    // Task 12: 시뮬레이터 연결
    createSimulatorTask(
      'day4-simulator',
      'APOC 실습 랩',
      20,
      [
        'APOC 프로시저 직접 실행',
        '배치 처리 성능 테스트',
        '그래프 알고리즘 시각화'
      ],
      'apoc-lab',
      `## APOC 실습 랩

이 시뮬레이터에서 APOC 프로시저를 직접 실행해볼 수 있습니다.

### 실습 시나리오

1. **데이터 로드**
   - JSON 파일에서 기업 데이터 로드
   - CSV에서 거래 데이터 로드

2. **텍스트 처리**
   - 기업명 정규화
   - 유사 기업 매칭

3. **배치 처리**
   - 대량 업데이트 실행
   - 진행 상황 모니터링

4. **그래프 탐색**
   - 공급망 네트워크 추출
   - 핵심 허브 기업 식별

시뮬레이터를 열어 직접 실습해보세요!`
    )
  ]
}
