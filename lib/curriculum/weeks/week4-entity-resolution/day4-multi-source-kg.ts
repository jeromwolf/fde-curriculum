// Day 4: 다중 소스 Knowledge Graph 구축

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day4MultiSourceKG: Day = {
  slug: 'multi-source-kg',
  title: '다중 소스 KG 구축',
  totalDuration: 240,
  tasks: [
    createVideoTask('w4d4-multi-source-overview', '다중 소스 KG 아키텍처', 30, {
      introduction: `
# 다중 소스 Knowledge Graph 아키텍처

## 일반적인 데이터 소스

| 소스 유형 | 예시 | 특징 |
|-----------|------|------|
| 내부 DB | PostgreSQL, MySQL | 구조화, 신뢰도 높음 |
| API | REST, GraphQL | 실시간, 형식 다양 |
| 파일 | CSV, JSON, Excel | 배치 처리 |
| 웹 크롤링 | 뉴스, 공시 | 비정형, 정제 필요 |
| 공개 데이터 | Wikidata, DBpedia | 외부 연결 |

## 통합 파이프라인

\`\`\`
┌─────────────┐
│  Source 1   │──┐
│  (CSV)      │  │
└─────────────┘  │     ┌─────────────┐     ┌─────────────┐
                 ├────▶│  Transform  │────▶│   Neo4j     │
┌─────────────┐  │     │  & Merge    │     │   KG        │
│  Source 2   │──┤     └─────────────┘     └─────────────┘
│  (API)      │  │           │
└─────────────┘  │           ▼
                 │     ┌─────────────┐
┌─────────────┐  │     │  Entity     │
│  Source 3   │──┘     │  Resolution │
│  (Wikidata) │        └─────────────┘
└─────────────┘
\`\`\`

## 스키마 매핑

\`\`\`python
SCHEMA_MAPPING = {
    "source1": {
        "company_name": "name",
        "emp_count": "employees",
        "sector": "industry"
    },
    "source2": {
        "companyName": "name",
        "employeeCount": "employees",
        "industry": "industry"
    }
}

def normalize_record(record, source):
    mapping = SCHEMA_MAPPING[source]
    return {mapping[k]: v for k, v in record.items() if k in mapping}
\`\`\`
      `,
      keyPoints: ['다양한 데이터 소스 유형 이해', 'ETL 파이프라인 설계', '스키마 매핑으로 통합'],
      practiceGoal: '다중 소스 KG 구축의 아키텍처를 이해한다',
    }),

    createCodeTask('w4d4-csv-api-ingestion', 'CSV와 API 데이터 수집', 35, {
      introduction: `
# CSV와 API 데이터 수집

## 🎯 왜 다양한 소스에서 수집하는가?

### 문제 상황
기업 정보가 여러 곳에 흩어져 있습니다.
- 내부 DB: 국내 기업 (한글)
- REST API: 글로벌 기업 (영문)
- Wikidata: 공개 지식 그래프

### 해결책
> 🌊 **비유**: 데이터 수집은 **댐 건설**입니다.
>
> 여러 강(소스)의 물(데이터)을 하나의 저수지(KG)로 모으기
> CSV(파일 강) + API(실시간 강) + Wikidata(공개 강)

## CSV 처리

\`\`\`python
import pandas as pd

def load_csv_companies(filepath):
    df = pd.read_csv(filepath)
    df['source'] = 'csv'

    # 정규화
    df['name'] = df['name'].str.strip()
    df['employees'] = pd.to_numeric(df['employees'], errors='coerce')

    return df.to_dict('records')
\`\`\`

## REST API 수집

\`\`\`python
import requests

def fetch_api_companies(api_url, api_key=None):
    headers = {"Authorization": f"Bearer {api_key}"} if api_key else {}

    response = requests.get(api_url, headers=headers)
    response.raise_for_status()

    data = response.json()
    companies = []

    for item in data.get('companies', []):
        companies.append({
            'name': item['companyName'],
            'employees': item.get('employeeCount'),
            'industry': item.get('sector'),
            'source': 'api'
        })

    return companies
\`\`\`

## Wikidata SPARQL

\`\`\`python
from SPARQLWrapper import SPARQLWrapper, JSON

def fetch_wikidata_companies(country_qid="Q884"):
    endpoint = SPARQLWrapper("https://query.wikidata.org/sparql")

    query = f"""
    SELECT ?company ?companyLabel ?employees
    WHERE {{
      ?company wdt:P31 wd:Q4830453 .  # business enterprise
      ?company wdt:P17 wd:{country_qid} .  # country
      OPTIONAL {{ ?company wdt:P1128 ?employees }}
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "ko,en" }}
    }}
    LIMIT 100
    """

    endpoint.setQuery(query)
    endpoint.setReturnFormat(JSON)
    results = endpoint.query().convert()

    companies = []
    for r in results["results"]["bindings"]:
        companies.append({
            'name': r['companyLabel']['value'],
            'employees': int(r['employees']['value']) if 'employees' in r else None,
            'wikidata_id': r['company']['value'].split('/')[-1],
            'source': 'wikidata'
        })

    return companies
\`\`\`
      `,
      keyPoints: ['📄 CSV를 pandas로 처리', '🌐 REST API로 데이터 수집', '🔍 Wikidata SPARQL 쿼리'],
      practiceGoal: '다양한 소스에서 데이터를 수집할 수 있다',
    }),

    createCodeTask('w4d4-data-fusion', '데이터 통합과 병합', 40, {
      introduction: `
# 데이터 통합과 병합

## 🎯 왜 데이터 통합 파이프라인이 필요한가?

### 문제 상황
수집한 데이터를 그냥 합치면?
- "삼성전자" + "Samsung" = 2개 회사?
- 속성 충돌 (직원수 270k vs 267k)
- 중복 증가

### 해결책
> 🏭 **비유**: 데이터 통합은 **재활용 공장**입니다.
>
> 1) 분류(Indexing) → 2) 유사도 측정(Comparison)
> → 3) 병합(Merging) → 깨끗한 데이터!

## 전체 파이프라인

\`\`\`python
import pandas as pd
import recordlinkage

class KGBuilder:
    def __init__(self, neo4j_client):
        self.client = neo4j_client
        self.all_records = []

    def add_source(self, records, source_name):
        for r in records:
            r['_source'] = source_name
        self.all_records.extend(records)

    def deduplicate(self, threshold=0.8):
        df = pd.DataFrame(self.all_records)

        # Indexing
        indexer = recordlinkage.Index()
        indexer.sortedneighbourhood('name', window=5)
        pairs = indexer.index(df)

        # Comparison
        compare = recordlinkage.Compare()
        compare.string('name', 'name', method='jarowinkler', label='name')
        features = compare.compute(pairs, df)

        # Classification
        matches = features[features['name'] > threshold]

        # Clustering
        import networkx as nx
        G = nx.Graph()
        G.add_edges_from(matches.index.tolist())
        clusters = list(nx.connected_components(G))

        # Merge
        merged = []
        matched_indices = set()
        for cluster in clusters:
            cluster_records = df.loc[list(cluster)]
            merged.append(self._merge_records(cluster_records))
            matched_indices.update(cluster)

        # 매칭 안 된 레코드
        for idx in df.index:
            if idx not in matched_indices:
                merged.append(df.loc[idx].to_dict())

        self.all_records = merged
        return len(clusters)

    def _merge_records(self, records):
        # 대표 이름 선정 (한글 우선, 가장 짧은 것)
        korean = records[records['name'].str.contains('[가-힣]', regex=True, na=False)]
        if len(korean) > 0:
            name = korean.sort_values('name', key=lambda x: x.str.len()).iloc[0]['name']
        else:
            name = records.iloc[0]['name']

        # 별칭 수집
        aliases = list(records['name'].unique())
        if name in aliases:
            aliases.remove(name)

        # 속성 병합
        return {
            'name': name,
            'aliases': aliases,
            'employees': records['employees'].dropna().max() if 'employees' in records else None,
            'industry': records['industry'].mode().iloc[0] if 'industry' in records and len(records['industry'].dropna()) > 0 else None,
            'sources': list(records['_source'].unique()),
            'wikidata_id': records.get('wikidata_id', pd.Series()).dropna().iloc[0] if 'wikidata_id' in records and len(records['wikidata_id'].dropna()) > 0 else None
        }

    def load_to_neo4j(self):
        query = """
        UNWIND $companies AS c
        MERGE (company:Company {name: c.name})
        SET company.employees = c.employees,
            company.industry = c.industry,
            company.aliases = c.aliases,
            company.sources = c.sources,
            company.wikidata_id = c.wikidata_id
        """
        self.client.execute(query, {"companies": self.all_records})
        return len(self.all_records)
\`\`\`

## 사용 예

\`\`\`python
builder = KGBuilder(neo4j_client)

# 소스 추가
builder.add_source(load_csv_companies("companies.csv"), "csv")
builder.add_source(fetch_api_companies("https://api.example.com/companies"), "api")
builder.add_source(fetch_wikidata_companies(), "wikidata")

# 중복 제거
merged_count = builder.deduplicate(threshold=0.8)
print(f"병합된 클러스터: {merged_count}")

# Neo4j 로드
loaded = builder.load_to_neo4j()
print(f"Neo4j에 로드: {loaded}개 회사")
\`\`\`
      `,
      keyPoints: ['🏗️ KGBuilder 클래스로 파이프라인 캡슐화', '🔍 recordlinkage로 중복 제거', '⬆️ MERGE로 Neo4j 업서트'],
      practiceGoal: '다중 소스 데이터를 통합하여 KG로 로드할 수 있다',
    }),

    createReadingTask('w4d4-data-lineage', '데이터 출처 추적 (Provenance)', 25, {
      introduction: `
# 데이터 출처 추적

## 왜 중요한가?

- 데이터 품질 검증
- 충돌 해결 (어느 소스가 더 신뢰?)
- 감사 및 규정 준수
- 디버깅

## Neo4j에서 출처 모델링

\`\`\`cypher
// 소스 노드 생성
CREATE (:DataSource {name: 'csv', type: 'file', last_updated: datetime()})
CREATE (:DataSource {name: 'api', type: 'api', url: 'https://...'})
CREATE (:DataSource {name: 'wikidata', type: 'public_kg'})

// 엔티티-소스 관계
MATCH (c:Company {name: '삼성전자'})
MATCH (s:DataSource {name: 'csv'})
CREATE (c)-[:SOURCED_FROM {
  imported_at: datetime(),
  confidence: 0.95
}]->(s)
\`\`\`

## 충돌 해결 전략

| 전략 | 설명 |
|------|------|
| 최신 우선 | 가장 최근 소스 값 사용 |
| 신뢰도 우선 | 높은 신뢰도 소스 사용 |
| 다수결 | 여러 소스 동의 시 채택 |
| 수동 검토 | 충돌 플래그 후 검토 |
      `,
      keyPoints: ['데이터 출처 모델링', 'SOURCED_FROM 관계로 추적', '충돌 해결 전략'],
      practiceGoal: '데이터 출처를 추적하고 충돌을 해결하는 방법을 이해한다',
    }),

    createCodeTask('w4d4-incremental-update', '증분 업데이트 구현', 35, {
      introduction: `
# 증분 업데이트

## 🎯 왜 증분 업데이트가 필요한가?

### 문제 상황
매일 전체 데이터를 다시 로드하면?
- 시간 낭비 (몇 시간 소요)
- 리소스 낭비 (CPU, 메모리)
- 변경 이력 손실

### 해결책
> ⚙️ **비유**: 증분 업데이트는 **패치**입니다.
>
> 전체 재설치(Full Load) vs 업데이트(Incremental)
> 변경된 부분만 추가/수정/삭제!

## 변경 감지

\`\`\`python
def detect_changes(new_records, existing_records):
    existing_names = {r['name'] for r in existing_records}
    new_names = {r['name'] for r in new_records}

    added = [r for r in new_records if r['name'] not in existing_names]
    removed = [r for r in existing_records if r['name'] not in new_names]

    # 변경된 레코드
    modified = []
    for new_r in new_records:
        if new_r['name'] in existing_names:
            old_r = next(r for r in existing_records if r['name'] == new_r['name'])
            if has_changes(old_r, new_r):
                modified.append(new_r)

    return {'added': added, 'removed': removed, 'modified': modified}

def has_changes(old, new, fields=['employees', 'industry']):
    return any(old.get(f) != new.get(f) for f in fields)
\`\`\`

## 증분 로드

\`\`\`cypher
// 추가
UNWIND $added AS c
CREATE (company:Company {name: c.name})
SET company += c

// 수정
UNWIND $modified AS c
MATCH (company:Company {name: c.name})
SET company += c, company.updated_at = datetime()

// 삭제 (soft delete)
UNWIND $removed AS c
MATCH (company:Company {name: c.name})
SET company.deleted = true, company.deleted_at = datetime()
\`\`\`

## 히스토리 유지

\`\`\`cypher
// 변경 전 스냅샷 저장
MATCH (c:Company {name: $name})
CREATE (h:CompanyHistory)
SET h = properties(c), h.snapshot_at = datetime()
CREATE (c)-[:HAS_HISTORY]->(h)

// 새 값으로 업데이트
SET c.employees = $new_employees
\`\`\`
      `,
      keyPoints: ['🔍 변경 감지 로직', '⚡ 증분 CRUD 쿼리', '📜 히스토리 유지'],
      practiceGoal: '증분 업데이트 파이프라인을 구현할 수 있다',
    }),

    createQuizTask('w4d4-quiz', 'Day 4 복습 퀴즈', 15, {
      introduction: '# Day 4 복습 퀴즈',
      questions: [
        {
          id: 'w4d4-q1',
          question: '다중 소스 KG 구축에서 스키마 매핑의 목적은?',
          options: ['보안 강화', '서로 다른 소스의 필드명을 통일', '쿼리 최적화', '데이터 암호화'],
          correctAnswer: 1,
          explanation: '스키마 매핑은 각 소스의 다른 필드명(company_name, companyName 등)을 공통 스키마로 통일합니다.',
        },
        {
          id: 'w4d4-q2',
          question: '데이터 충돌 해결에서 "다수결" 전략이란?',
          options: ['가장 최근 값 사용', '가장 신뢰도 높은 값 사용', '여러 소스가 동의하는 값 채택', '관리자가 결정'],
          correctAnswer: 2,
          explanation: '다수결 전략은 여러 소스 중 다수가 동의하는 값을 채택합니다.',
        },
        {
          id: 'w4d4-q3',
          question: '증분 업데이트에서 "soft delete"란?',
          options: ['물리적 삭제', 'deleted 플래그로 표시', '백업 후 삭제', '관계만 삭제'],
          correctAnswer: 1,
          explanation: 'Soft delete는 실제 삭제 대신 deleted 플래그를 설정하여 데이터를 유지하면서 논리적으로 삭제합니다.',
        },
      ],
      keyPoints: ['스키마 매핑으로 통일', '다수결로 충돌 해결', 'Soft delete로 히스토리 유지'],
      practiceGoal: '다중 소스 KG 구축의 핵심 개념을 확인한다',
    }),
  ],

  challenge: createChallengeTask('w4d4-challenge', 'Challenge: 기업 KG 통합 파이프라인', 40, {
    introduction: `
# Challenge: 기업 KG 통합 파이프라인

## 과제
3개 이상의 데이터 소스에서 기업 정보를 수집하여 통합 Knowledge Graph를 구축하세요.

## 요구사항
1. CSV, API, Wikidata 중 3개 이상 소스
2. 스키마 매핑 및 정규화
3. Entity Resolution
4. Neo4j 로드 (출처 추적 포함)
5. 증분 업데이트 지원
    `,
    keyPoints: ['다중 소스 수집', 'ER 파이프라인', '출처 추적', '증분 업데이트'],
    practiceGoal: '완전한 다중 소스 KG 구축 파이프라인을 구현한다',
  }),
}
