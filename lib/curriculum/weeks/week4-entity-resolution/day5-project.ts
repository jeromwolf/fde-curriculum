// Day 5: 기업 Knowledge Graph 프로젝트

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
  createSimulatorTask,
} from './types'

export const day5Project: Day = {
  slug: 'enterprise-kg-project',
  title: '기업 KG 프로젝트',
  totalDuration: 360,
  tasks: [
    createVideoTask('w4d5-project-overview', '프로젝트 개요 및 설계', 30, {
      introduction: `
# 기업 Knowledge Graph 프로젝트

## 프로젝트 목표

**"한국 기업 Knowledge Graph + 시각화 대시보드"**

다중 소스에서 기업 데이터를 수집하고, Entity Resolution으로 통합한 후,
인터랙티브 대시보드로 탐색할 수 있는 시스템을 구축합니다.

## 아키텍처

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Data Sources                              │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│  CSV Files  │  공공 API   │  Wikidata   │  Web Scraping    │
└──────┬──────┴──────┬──────┴──────┬──────┴────────┬─────────┘
       │             │             │               │
       └─────────────┴──────┬──────┴───────────────┘
                            ▼
              ┌─────────────────────────┐
              │   Data Collection       │
              │   (Python)              │
              └───────────┬─────────────┘
                          ▼
              ┌─────────────────────────┐
              │   Entity Resolution     │
              │   (recordlinkage)       │
              └───────────┬─────────────┘
                          ▼
              ┌─────────────────────────┐
              │   Neo4j Knowledge Graph │
              │   (Company, Industry,   │
              │    Relations)           │
              └───────────┬─────────────┘
                          ▼
              ┌─────────────────────────┐
              │   Visualization         │
              │   (Streamlit + PyVis)   │
              └─────────────────────────┘
\`\`\`

## 데이터 모델

\`\`\`cypher
// 노드 타입
(:Company {name, employees, founded, aliases, wikidata_id})
(:Industry {name, sector})
(:City {name, country})
(:DataSource {name, type, url})

// 관계 타입
(:Company)-[:IN_INDUSTRY]->(:Industry)
(:Company)-[:HEADQUARTERED_IN]->(:City)
(:Company)-[:COMPETES_WITH]->(:Company)
(:Company)-[:SUPPLIES_TO]->(:Company)
(:Company)-[:SUBSIDIARY_OF]->(:Company)
(:Company)-[:SOURCED_FROM]->(:DataSource)
\`\`\`

## 평가 기준

| 항목 | 배점 |
|------|------|
| 데이터 수집 (3+ 소스) | 20% |
| Entity Resolution | 20% |
| Neo4j 데이터 모델 | 20% |
| 시각화 대시보드 | 25% |
| 코드 품질 및 문서화 | 15% |
      `,
      keyPoints: ['다중 소스 → ER → Neo4j → 시각화', '기업/산업/도시 데이터 모델', 'Streamlit + PyVis 대시보드'],
      practiceGoal: '프로젝트 아키텍처와 요구사항을 이해한다',
    }),

    createCodeTask('w4d5-data-collection', '데이터 수집 모듈 구현', 45, {
      introduction: `
# 데이터 수집 모듈

## 프로젝트 구조

\`\`\`
enterprise_kg/
├── collectors/
│   ├── __init__.py
│   ├── csv_collector.py
│   ├── api_collector.py
│   └── wikidata_collector.py
├── processors/
│   ├── __init__.py
│   └── entity_resolver.py
├── loaders/
│   ├── __init__.py
│   └── neo4j_loader.py
├── dashboard/
│   └── app.py
├── config.py
└── main.py
\`\`\`

## CSV Collector

\`\`\`python
# collectors/csv_collector.py
import pandas as pd
from typing import List, Dict

class CSVCollector:
    def __init__(self, filepath: str):
        self.filepath = filepath

    def collect(self) -> List[Dict]:
        df = pd.read_csv(self.filepath)

        # 정규화
        df['name'] = df['name'].str.strip()
        df['employees'] = pd.to_numeric(df['employees'], errors='coerce')

        records = df.to_dict('records')
        for r in records:
            r['_source'] = 'csv'

        return records
\`\`\`

## Wikidata Collector

\`\`\`python
# collectors/wikidata_collector.py
from SPARQLWrapper import SPARQLWrapper, JSON
from typing import List, Dict

class WikidataCollector:
    def __init__(self):
        self.endpoint = SPARQLWrapper("https://query.wikidata.org/sparql")

    def collect_korean_companies(self, limit: int = 100) -> List[Dict]:
        query = """
        SELECT ?company ?companyLabel ?employees ?industryLabel ?cityLabel
        WHERE {
          ?company wdt:P31 wd:Q4830453 .      # business enterprise
          ?company wdt:P17 wd:Q884 .          # South Korea

          OPTIONAL { ?company wdt:P1128 ?employees }
          OPTIONAL { ?company wdt:P452 ?industry }
          OPTIONAL { ?company wdt:P159 ?hq. ?hq wdt:P131* ?city. ?city wdt:P31 wd:Q515 }

          SERVICE wikibase:label { bd:serviceParam wikibase:language "ko,en" }
        }
        LIMIT """ + str(limit)

        self.endpoint.setQuery(query)
        self.endpoint.setReturnFormat(JSON)
        results = self.endpoint.query().convert()

        companies = []
        for r in results["results"]["bindings"]:
            companies.append({
                'name': r.get('companyLabel', {}).get('value'),
                'employees': int(r['employees']['value']) if 'employees' in r else None,
                'industry': r.get('industryLabel', {}).get('value'),
                'city': r.get('cityLabel', {}).get('value'),
                'wikidata_id': r['company']['value'].split('/')[-1],
                '_source': 'wikidata'
            })

        return companies
\`\`\`

## Main Collector

\`\`\`python
# main.py (수집 부분)
from collectors.csv_collector import CSVCollector
from collectors.wikidata_collector import WikidataCollector

def collect_all_data():
    all_companies = []

    # CSV
    csv_collector = CSVCollector("data/korean_companies.csv")
    all_companies.extend(csv_collector.collect())
    print(f"CSV: {len(csv_collector.collect())}개")

    # Wikidata
    wiki_collector = WikidataCollector()
    wiki_companies = wiki_collector.collect_korean_companies(limit=200)
    all_companies.extend(wiki_companies)
    print(f"Wikidata: {len(wiki_companies)}개")

    print(f"총 수집: {len(all_companies)}개")
    return all_companies
\`\`\`
      `,
      keyPoints: ['모듈화된 Collector 클래스', 'CSV와 Wikidata 수집', '통일된 인터페이스'],
      practiceGoal: '데이터 수집 모듈을 구현한다',
    }),

    createCodeTask('w4d5-entity-resolver', 'Entity Resolution 모듈 구현', 45, {
      introduction: `
# Entity Resolution 모듈

\`\`\`python
# processors/entity_resolver.py
import pandas as pd
import recordlinkage
import networkx as nx
from typing import List, Dict, Tuple

class EntityResolver:
    def __init__(self, threshold: float = 0.8):
        self.threshold = threshold

    def resolve(self, records: List[Dict]) -> Tuple[List[Dict], int]:
        if len(records) < 2:
            return records, 0

        df = pd.DataFrame(records)

        # Indexing (Blocking)
        indexer = recordlinkage.Index()
        indexer.sortedneighbourhood('name', window=7)
        pairs = indexer.index(df)

        if len(pairs) == 0:
            return records, 0

        # Comparison
        compare = recordlinkage.Compare()
        compare.string('name', 'name', method='jarowinkler', label='name_sim')

        if 'industry' in df.columns:
            compare.string('industry', 'industry', method='jarowinkler',
                          label='industry_sim', missing_value=0.5)

        features = compare.compute(pairs, df)

        # Classification
        if 'industry_sim' in features.columns:
            matches = features[(features['name_sim'] > self.threshold) |
                              (features.sum(axis=1) > self.threshold + 0.3)]
        else:
            matches = features[features['name_sim'] > self.threshold]

        if len(matches) == 0:
            return records, 0

        # Clustering
        G = nx.Graph()
        G.add_edges_from(matches.index.tolist())
        clusters = list(nx.connected_components(G))

        # Merge
        merged = []
        matched_indices = set()

        for cluster in clusters:
            cluster_records = df.loc[list(cluster)]
            merged.append(self._merge_cluster(cluster_records))
            matched_indices.update(cluster)

        # 매칭 안 된 레코드
        for idx in df.index:
            if idx not in matched_indices:
                merged.append(df.loc[idx].to_dict())

        return merged, len(clusters)

    def _merge_cluster(self, records: pd.DataFrame) -> Dict:
        # 한글 이름 우선
        korean = records[records['name'].str.contains('[가-힣]', regex=True, na=False)]
        if len(korean) > 0:
            name = korean.sort_values('name', key=lambda x: x.str.len()).iloc[0]['name']
        else:
            name = records.iloc[0]['name']

        aliases = list(records['name'].unique())
        if name in aliases:
            aliases.remove(name)

        # 속성 병합
        result = {
            'name': name,
            'aliases': aliases,
            '_sources': list(records['_source'].unique())
        }

        # 선택적 속성
        for col in ['employees', 'industry', 'city', 'wikidata_id', 'founded']:
            if col in records.columns:
                valid = records[col].dropna()
                if len(valid) > 0:
                    if col == 'employees':
                        result[col] = int(valid.max())
                    elif col in ['industry', 'city']:
                        result[col] = valid.mode().iloc[0] if len(valid.mode()) > 0 else valid.iloc[0]
                    else:
                        result[col] = valid.iloc[0]

        return result
\`\`\`

## 사용

\`\`\`python
from processors.entity_resolver import EntityResolver

resolver = EntityResolver(threshold=0.8)
merged_companies, cluster_count = resolver.resolve(all_companies)

print(f"원본: {len(all_companies)}개")
print(f"통합 후: {len(merged_companies)}개")
print(f"병합된 클러스터: {cluster_count}개")
\`\`\`
      `,
      keyPoints: ['recordlinkage + NetworkX 통합', '한글 이름 우선 병합', '다중 속성 병합 전략'],
      practiceGoal: 'Entity Resolution 모듈을 구현한다',
    }),

    createCodeTask('w4d5-neo4j-loader', 'Neo4j 로더 구현', 40, {
      introduction: `
# Neo4j 로더

\`\`\`python
# loaders/neo4j_loader.py
from neo4j import GraphDatabase
from typing import List, Dict

class Neo4jLoader:
    def __init__(self, uri: str, user: str, password: str):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def clear_database(self):
        with self.driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n")

    def create_indexes(self):
        with self.driver.session() as session:
            session.run("CREATE INDEX company_name IF NOT EXISTS FOR (c:Company) ON (c.name)")
            session.run("CREATE INDEX industry_name IF NOT EXISTS FOR (i:Industry) ON (i.name)")
            session.run("CREATE INDEX city_name IF NOT EXISTS FOR (c:City) ON (c.name)")

    def load_companies(self, companies: List[Dict]):
        query = """
        UNWIND $companies AS c
        MERGE (company:Company {name: c.name})
        SET company.employees = c.employees,
            company.aliases = c.aliases,
            company.wikidata_id = c.wikidata_id,
            company.sources = c._sources

        // Industry
        FOREACH (ind IN CASE WHEN c.industry IS NOT NULL THEN [c.industry] ELSE [] END |
            MERGE (industry:Industry {name: ind})
            MERGE (company)-[:IN_INDUSTRY]->(industry)
        )

        // City
        FOREACH (ct IN CASE WHEN c.city IS NOT NULL THEN [c.city] ELSE [] END |
            MERGE (city:City {name: ct})
            MERGE (company)-[:HEADQUARTERED_IN]->(city)
        )
        """

        with self.driver.session() as session:
            session.run(query, companies=companies)

        return len(companies)

    def add_relationships(self):
        # 같은 산업의 기업들을 COMPETES_WITH로 연결 (예시)
        query = """
        MATCH (a:Company)-[:IN_INDUSTRY]->(i:Industry)<-[:IN_INDUSTRY]-(b:Company)
        WHERE a.name < b.name
        MERGE (a)-[:COMPETES_WITH]->(b)
        """
        with self.driver.session() as session:
            result = session.run(query)
            return result.consume().counters.relationships_created

    def get_stats(self) -> Dict:
        with self.driver.session() as session:
            result = session.run("""
                MATCH (c:Company) WITH count(c) AS companies
                MATCH (i:Industry) WITH companies, count(i) AS industries
                MATCH (ct:City) WITH companies, industries, count(ct) AS cities
                MATCH ()-[r]->() WITH companies, industries, cities, count(r) AS relations
                RETURN companies, industries, cities, relations
            """)
            return result.single().data()
\`\`\`

## main.py

\`\`\`python
from loaders.neo4j_loader import Neo4jLoader

# Neo4j 로드
loader = Neo4jLoader("bolt://localhost:7687", "neo4j", "password")
loader.clear_database()
loader.create_indexes()

loaded = loader.load_companies(merged_companies)
print(f"로드 완료: {loaded}개 회사")

relations = loader.add_relationships()
print(f"관계 생성: {relations}개")

stats = loader.get_stats()
print(f"통계: {stats}")

loader.close()
\`\`\`
      `,
      keyPoints: ['MERGE로 중복 방지', 'FOREACH로 조건부 관계 생성', '통계 쿼리'],
      practiceGoal: 'Neo4j 로더를 구현하여 KG를 구축한다',
    }),

    createCodeTask('w4d5-dashboard', 'Streamlit 대시보드 구현', 50, {
      introduction: `
# Streamlit 대시보드

\`\`\`python
# dashboard/app.py
import streamlit as st
import pandas as pd
import networkx as nx
from pyvis.network import Network
import streamlit.components.v1 as components
from neo4j import GraphDatabase

st.set_page_config(page_title="기업 KG 대시보드", layout="wide")

# Neo4j 연결
@st.cache_resource
def get_driver():
    return GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))

driver = get_driver()

# 사이드바
st.sidebar.title("필터")
industry_filter = st.sidebar.multiselect("산업", get_industries(driver))
min_employees = st.sidebar.number_input("최소 직원수", 0, 1000000, 0)

# 메인 영역
st.title("한국 기업 Knowledge Graph")

# 통계 카드
col1, col2, col3, col4 = st.columns(4)
stats = get_stats(driver)
col1.metric("기업", stats['companies'])
col2.metric("산업", stats['industries'])
col3.metric("도시", stats['cities'])
col4.metric("관계", stats['relations'])

# 그래프 시각화
st.subheader("기업 네트워크")

G = load_graph(driver, industry_filter, min_employees)

net = Network(height="500px", width="100%", bgcolor="#ffffff")
net.from_nx(G)
net.save_graph("temp_graph.html")

with open("temp_graph.html", "r", encoding="utf-8") as f:
    html = f.read()
components.html(html, height=550)

# 기업 목록
st.subheader("기업 목록")
companies_df = get_companies_df(driver, industry_filter, min_employees)
st.dataframe(companies_df, use_container_width=True)

# 검색
st.subheader("기업 검색")
search_query = st.text_input("기업명 검색")
if search_query:
    results = search_company(driver, search_query)
    for r in results:
        st.write(f"**{r['name']}** - {r.get('industry', 'N/A')} ({r.get('employees', 'N/A')}명)")

# 헬퍼 함수들
def get_industries(driver):
    with driver.session() as session:
        result = session.run("MATCH (i:Industry) RETURN i.name ORDER BY i.name")
        return [r["i.name"] for r in result]

def get_stats(driver):
    with driver.session() as session:
        result = session.run("""
            MATCH (c:Company) WITH count(c) AS companies
            MATCH (i:Industry) WITH companies, count(i) AS industries
            MATCH (ct:City) WITH companies, industries, count(ct) AS cities
            MATCH ()-[r]->() RETURN companies, industries, cities, count(r) AS relations
        """)
        return result.single().data()

def load_graph(driver, industries, min_emp):
    G = nx.DiGraph()
    query = """
    MATCH (c:Company)
    WHERE ($industries IS NULL OR size($industries) = 0 OR
           EXISTS((c)-[:IN_INDUSTRY]->(:Industry) WHERE any(i IN $industries WHERE i = i.name)))
      AND coalesce(c.employees, 0) >= $min_emp
    OPTIONAL MATCH (c)-[:IN_INDUSTRY]->(i:Industry)
    OPTIONAL MATCH (c)-[:COMPETES_WITH]->(c2:Company)
    RETURN c.name AS company, i.name AS industry, collect(c2.name) AS competitors
    LIMIT 100
    """
    with driver.session() as session:
        result = session.run(query, industries=industries or [], min_emp=min_emp)
        for r in result:
            G.add_node(r["company"], type="company")
            if r["industry"]:
                G.add_node(r["industry"], type="industry")
                G.add_edge(r["company"], r["industry"])
            for comp in r["competitors"]:
                if comp:
                    G.add_edge(r["company"], comp)
    return G

def get_companies_df(driver, industries, min_emp):
    query = """
    MATCH (c:Company)
    OPTIONAL MATCH (c)-[:IN_INDUSTRY]->(i:Industry)
    OPTIONAL MATCH (c)-[:HEADQUARTERED_IN]->(ct:City)
    WHERE coalesce(c.employees, 0) >= $min_emp
    RETURN c.name AS name, c.employees AS employees, i.name AS industry, ct.name AS city
    ORDER BY c.employees DESC
    LIMIT 100
    """
    with driver.session() as session:
        result = session.run(query, min_emp=min_emp)
        return pd.DataFrame([r.data() for r in result])

def search_company(driver, query):
    cypher = """
    MATCH (c:Company)
    WHERE c.name CONTAINS $query OR any(a IN c.aliases WHERE a CONTAINS $query)
    OPTIONAL MATCH (c)-[:IN_INDUSTRY]->(i:Industry)
    RETURN c.name AS name, c.employees AS employees, i.name AS industry
    LIMIT 10
    """
    with driver.session() as session:
        result = session.run(cypher, query=query)
        return [r.data() for r in result]
\`\`\`

## 실행

\`\`\`bash
streamlit run dashboard/app.py
\`\`\`
      `,
      keyPoints: ['Streamlit으로 빠른 대시보드', 'PyVis 그래프 임베딩', '필터링과 검색'],
      practiceGoal: 'Streamlit 대시보드를 구현한다',
    }),

    createReadingTask('w4d5-final-checklist', '프로젝트 최종 점검', 20, {
      introduction: `
# 프로젝트 최종 점검

## 체크리스트

### 데이터 수집 (20%)
- [ ] 3개 이상 데이터 소스
- [ ] 각 소스별 100+ 레코드
- [ ] 에러 핸들링

### Entity Resolution (20%)
- [ ] recordlinkage 파이프라인
- [ ] 임계값 튜닝
- [ ] 병합 전략 구현

### Neo4j 데이터 모델 (20%)
- [ ] Company, Industry, City 노드
- [ ] 관계 타입 정의
- [ ] 인덱스 생성

### 시각화 대시보드 (25%)
- [ ] Streamlit 앱 동작
- [ ] PyVis 그래프
- [ ] 필터링 기능
- [ ] 검색 기능

### 코드 품질 (15%)
- [ ] 모듈화
- [ ] README.md
- [ ] 설치/실행 가이드

## 제출물

1. GitHub 저장소 URL
2. 스크린샷 3장 이상
3. 간단한 데모 영상 (선택)
      `,
      keyPoints: ['5개 영역 체크리스트', '제출물 확인', '문서화'],
      practiceGoal: '프로젝트 완성도를 점검한다',
    }),

    createQuizTask('w4d5-quiz', 'Week 4 종합 퀴즈', 20, {
      introduction: '# Week 4 종합 퀴즈\n이번 주 학습 내용을 종합적으로 확인합니다.',
      questions: [
        {
          id: 'w4d5-q1',
          question: 'Entity Resolution의 올바른 파이프라인 순서는?',
          options: [
            'Compare → Index → Classify → Cluster',
            'Index → Compare → Classify → Cluster',
            'Classify → Index → Compare → Cluster',
            'Index → Classify → Compare → Cluster',
          ],
          correctAnswer: 1,
          explanation: '올바른 순서는 Index(Blocking) → Compare → Classify → Cluster입니다.',
        },
        {
          id: 'w4d5-q2',
          question: 'Neo4j Python Driver에서 읽기/쓰기 트랜잭션을 구분하는 이유는?',
          options: [
            '보안을 위해',
            '클러스터에서 읽기를 replica로 라우팅하기 위해',
            '코드 가독성을 위해',
            '에러 처리를 위해',
          ],
          correctAnswer: 1,
          explanation: 'execute_read는 클러스터 환경에서 읽기 전용 replica로 라우팅되어 성능이 향상됩니다.',
        },
        {
          id: 'w4d5-q3',
          question: 'PyVis에서 NetworkX 그래프를 변환할 때 사용하는 메서드는?',
          options: ['load()', 'import_graph()', 'from_nx()', 'add_nx()'],
          correctAnswer: 2,
          explanation: 'from_nx() 메서드로 NetworkX 그래프를 PyVis Network로 변환합니다.',
        },
        {
          id: 'w4d5-q4',
          question: '다중 소스 KG 구축에서 데이터 충돌 해결 시 "신뢰도 우선" 전략이란?',
          options: [
            '가장 최근 데이터 사용',
            '가장 신뢰할 수 있는 소스의 값 사용',
            '다수결로 결정',
            '모두 저장',
          ],
          correctAnswer: 1,
          explanation: '신뢰도 우선 전략은 더 신뢰할 수 있는 소스(예: 공식 DB > 뉴스)의 값을 사용합니다.',
        },
        {
          id: 'w4d5-q5',
          question: 'Streamlit에서 데이터베이스 연결을 캐싱할 때 사용하는 데코레이터는?',
          options: ['@st.cache', '@st.cache_data', '@st.cache_resource', '@st.cached'],
          correctAnswer: 2,
          explanation: '@st.cache_resource는 데이터베이스 연결 같은 리소스를 캐싱합니다.',
        },
      ],
      keyPoints: ['ER 파이프라인 순서', '트랜잭션 분리 이유', 'from_nx() 변환', '@st.cache_resource 캐싱'],
      practiceGoal: 'Week 4 전체 내용을 종합적으로 확인한다',
    }),
  ],

  challenge: createChallengeTask('w4d5-challenge', 'Challenge: 프로젝트 완성 및 발표', 90, {
    introduction: `
# Challenge: 기업 KG 프로젝트 완성

## 최종 과제

이번 주 학습 내용을 종합하여 완전한 기업 Knowledge Graph 시스템을 구축하세요.

## 요구사항

### 필수
1. **데이터 수집**: 3개 이상 소스에서 100+ 기업
2. **Entity Resolution**: recordlinkage 파이프라인
3. **Neo4j KG**: Company, Industry, City 노드 + 관계
4. **대시보드**: Streamlit + PyVis
5. **문서화**: README.md

### 선택 (가산점)
- 추가 데이터 소스 (뉴스 API 등)
- 고급 시각화 (클러스터 색상 구분)
- 검색 고도화 (별칭 검색)
- 증분 업데이트 기능

## 평가 기준

| 항목 | 배점 |
|------|------|
| 데이터 수집 | 20% |
| Entity Resolution | 20% |
| Neo4j 모델 | 20% |
| 대시보드 | 25% |
| 문서화 | 15% |

## 제출

- GitHub 저장소 URL
- 스크린샷 3장
- README.md (설치/실행 가이드)
    `,
    keyPoints: ['전체 파이프라인 완성', '다중 소스 통합', '시각화 대시보드', '문서화'],
    practiceGoal: 'Week 4 학습 내용을 종합한 완전한 프로젝트를 완성한다',
  }),
}
