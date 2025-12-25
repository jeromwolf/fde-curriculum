// Day 5: 시맨틱 웹 실습 프로젝트

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
  createSimulatorTask,
} from './types'

export const day5SemanticWebPractice: Day = {
  slug: 'semantic-web-practice',
  title: '시맨틱 웹 실습',
  totalDuration: 300,
  tasks: [
    createVideoTask('w5d5-project-overview', '실습 프로젝트 개요', 25, {
      introduction: `
# 실습 프로젝트 개요

## 프로젝트 목표

이번 주 학습 내용을 종합하여 **실제 Linked Data를 활용한 분석 프로젝트**를 수행합니다.

## 프로젝트 구성

\`\`\`
1. Wikidata에서 한국 기업 데이터 수집
2. SPARQL로 관계 데이터 추출
3. Property Graph (NetworkX)로 변환
4. 그래프 분석 및 시각화
5. 인사이트 도출
\`\`\`

## 기술 스택

\`\`\`python
# 데이터 수집
from SPARQLWrapper import SPARQLWrapper, JSON

# 그래프 분석
import networkx as nx
import pandas as pd

# 시각화
from pyvis.network import Network
import matplotlib.pyplot as plt
\`\`\`

## 결과물

1. SPARQL 쿼리 모음 (5개 이상)
2. Python 분석 스크립트
3. 시각화 결과 (HTML/PNG)
4. 분석 리포트
      `,
      keyPoints: ['Wikidata 데이터 수집', 'SPARQL → NetworkX 변환', '그래프 분석 및 시각화'],
      practiceGoal: '전체 파이프라인을 구축한다',
    }),

    createCodeTask('w5d5-sparql-collection', 'Wikidata SPARQL 데이터 수집', 45, {
      introduction: `
# Wikidata SPARQL 데이터 수집

## Python에서 SPARQL 실행

\`\`\`python
from SPARQLWrapper import SPARQLWrapper, JSON
import pandas as pd

def query_wikidata(sparql_query):
    """Wikidata SPARQL 쿼리 실행"""
    endpoint = "https://query.wikidata.org/sparql"
    sparql = SPARQLWrapper(endpoint)
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)

    results = sparql.query().convert()

    # DataFrame으로 변환
    data = []
    for result in results["results"]["bindings"]:
        row = {k: v["value"] for k, v in result.items()}
        data.append(row)

    return pd.DataFrame(data)
\`\`\`

## 한국 기업 데이터 수집

\`\`\`python
# 한국 IT 기업 조회
query_companies = """
SELECT ?company ?companyLabel ?founded ?employees ?revenue
WHERE {
  ?company wdt:P31 wd:Q4830453 ;        # instance of 기업
           wdt:P17 wd:Q884 ;             # 국가 = 한국
           wdt:P452 wd:Q11661 .          # 산업 = IT

  OPTIONAL { ?company wdt:P571 ?founded }
  OPTIONAL { ?company wdt:P1128 ?employees }
  OPTIONAL { ?company wdt:P2139 ?revenue }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "ko,en" }
}
ORDER BY DESC(?employees)
LIMIT 100
"""

companies_df = query_wikidata(query_companies)
print(f"수집된 기업: {len(companies_df)}개")
companies_df.head(10)
\`\`\`

## 기업 간 관계 수집

\`\`\`python
# 모회사-자회사 관계
query_subsidiaries = """
SELECT ?parent ?parentLabel ?subsidiary ?subsidiaryLabel
WHERE {
  ?subsidiary wdt:P749 ?parent .         # 모회사
  ?subsidiary wdt:P17 wd:Q884 .          # 한국 기업

  SERVICE wikibase:label { bd:serviceParam wikibase:language "ko,en" }
}
LIMIT 500
"""

# 경쟁사 관계
query_competitors = """
SELECT ?company1 ?company1Label ?company2 ?company2Label
WHERE {
  ?company1 wdt:P3373 ?company2 .        # 경쟁사
  ?company1 wdt:P17 wd:Q884 .

  SERVICE wikibase:label { bd:serviceParam wikibase:language "ko,en" }
}
LIMIT 200
"""

subsidiaries_df = query_wikidata(query_subsidiaries)
competitors_df = query_wikidata(query_competitors)
\`\`\`

## 인물-기업 관계

\`\`\`python
# CEO 정보
query_ceos = """
SELECT ?company ?companyLabel ?ceo ?ceoLabel ?startDate
WHERE {
  ?company wdt:P17 wd:Q884 ;
           wdt:P169 ?ceo .

  OPTIONAL {
    ?company p:P169 ?stmt .
    ?stmt ps:P169 ?ceo ;
          pq:P580 ?startDate .
  }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "ko,en" }
}
LIMIT 200
"""

ceos_df = query_wikidata(query_ceos)
\`\`\`
      `,
      keyPoints: ['SPARQLWrapper로 쿼리 실행', 'DataFrame으로 변환', '여러 관계 데이터 수집'],
      practiceGoal: 'Wikidata에서 데이터를 수집할 수 있다',
    }),

    createCodeTask('w5d5-graph-conversion', 'RDF → Property Graph 변환', 40, {
      introduction: `
# RDF → Property Graph 변환

## NetworkX 그래프 생성

\`\`\`python
import networkx as nx

def create_company_graph(companies_df, subsidiaries_df, competitors_df, ceos_df):
    """Wikidata 결과를 NetworkX 그래프로 변환"""
    G = nx.DiGraph()

    # 1. 기업 노드 추가
    for _, row in companies_df.iterrows():
        company_id = row['company'].split('/')[-1]  # Q번호 추출
        G.add_node(company_id,
                   label=row.get('companyLabel', company_id),
                   type='Company',
                   founded=row.get('founded', ''),
                   employees=row.get('employees', 0))

    # 2. 모회사-자회사 관계
    for _, row in subsidiaries_df.iterrows():
        parent_id = row['parent'].split('/')[-1]
        sub_id = row['subsidiary'].split('/')[-1]

        # 노드가 없으면 추가
        if parent_id not in G:
            G.add_node(parent_id, label=row.get('parentLabel', parent_id), type='Company')
        if sub_id not in G:
            G.add_node(sub_id, label=row.get('subsidiaryLabel', sub_id), type='Company')

        G.add_edge(parent_id, sub_id, relation='subsidiary_of')

    # 3. 경쟁사 관계 (무방향으로 처리)
    for _, row in competitors_df.iterrows():
        c1_id = row['company1'].split('/')[-1]
        c2_id = row['company2'].split('/')[-1]

        if c1_id not in G:
            G.add_node(c1_id, label=row.get('company1Label', c1_id), type='Company')
        if c2_id not in G:
            G.add_node(c2_id, label=row.get('company2Label', c2_id), type='Company')

        G.add_edge(c1_id, c2_id, relation='competes_with')
        G.add_edge(c2_id, c1_id, relation='competes_with')

    # 4. CEO 관계
    for _, row in ceos_df.iterrows():
        company_id = row['company'].split('/')[-1]
        ceo_id = row['ceo'].split('/')[-1]

        if ceo_id not in G:
            G.add_node(ceo_id, label=row.get('ceoLabel', ceo_id), type='Person')

        G.add_edge(ceo_id, company_id, relation='ceo_of')

    return G

# 그래프 생성
G = create_company_graph(companies_df, subsidiaries_df, competitors_df, ceos_df)
print(f"노드: {G.number_of_nodes()}, 엣지: {G.number_of_edges()}")
\`\`\`

## 그래프 통계

\`\`\`python
# 기본 통계
print(f"노드 수: {G.number_of_nodes()}")
print(f"엣지 수: {G.number_of_edges()}")
print(f"밀도: {nx.density(G):.4f}")

# 노드 타입별 통계
node_types = {}
for node, attrs in G.nodes(data=True):
    t = attrs.get('type', 'Unknown')
    node_types[t] = node_types.get(t, 0) + 1
print(f"노드 타입: {node_types}")

# 관계 타입별 통계
edge_types = {}
for _, _, attrs in G.edges(data=True):
    r = attrs.get('relation', 'Unknown')
    edge_types[r] = edge_types.get(r, 0) + 1
print(f"관계 타입: {edge_types}")
\`\`\`
      `,
      keyPoints: ['Wikidata URI에서 ID 추출', '노드/엣지에 속성 추가', '그래프 통계 확인'],
      practiceGoal: 'RDF 데이터를 Property Graph로 변환할 수 있다',
    }),

    createCodeTask('w5d5-graph-analysis', '그래프 분석', 45, {
      introduction: `
# 그래프 분석

## 중심성 분석

\`\`\`python
import networkx as nx

# Degree Centrality
degree_cent = nx.degree_centrality(G)
top_degree = sorted(degree_cent.items(), key=lambda x: x[1], reverse=True)[:10]
print("Top 10 Degree Centrality:")
for node, score in top_degree:
    label = G.nodes[node].get('label', node)
    print(f"  {label}: {score:.4f}")

# PageRank
pagerank = nx.pagerank(G)
top_pagerank = sorted(pagerank.items(), key=lambda x: x[1], reverse=True)[:10]
print("\\nTop 10 PageRank:")
for node, score in top_pagerank:
    label = G.nodes[node].get('label', node)
    print(f"  {label}: {score:.4f}")

# Betweenness Centrality (매개 중심성)
betweenness = nx.betweenness_centrality(G)
top_betweenness = sorted(betweenness.items(), key=lambda x: x[1], reverse=True)[:10]
print("\\nTop 10 Betweenness Centrality:")
for node, score in top_betweenness:
    label = G.nodes[node].get('label', node)
    print(f"  {label}: {score:.4f}")
\`\`\`

## 커뮤니티 탐지

\`\`\`python
from networkx.algorithms import community

# Louvain 커뮤니티 (무방향 그래프로 변환)
G_undirected = G.to_undirected()
communities = community.louvain_communities(G_undirected, seed=42)

print(f"탐지된 커뮤니티: {len(communities)}개")
for i, comm in enumerate(communities[:5]):
    labels = [G.nodes[n].get('label', n) for n in list(comm)[:5]]
    print(f"커뮤니티 {i+1} ({len(comm)}개): {labels}...")

# 노드에 커뮤니티 할당
node_community = {}
for i, comm in enumerate(communities):
    for node in comm:
        node_community[node] = i
nx.set_node_attributes(G, node_community, 'community')
\`\`\`

## 경로 분석

\`\`\`python
# 두 기업 간 최단 경로
def find_path(G, source_label, target_label):
    # 레이블로 노드 ID 찾기
    source = None
    target = None
    for node, attrs in G.nodes(data=True):
        if attrs.get('label') == source_label:
            source = node
        if attrs.get('label') == target_label:
            target = node

    if source and target and nx.has_path(G, source, target):
        path = nx.shortest_path(G, source, target)
        path_labels = [G.nodes[n].get('label', n) for n in path]
        return path_labels
    return None

# 예시
path = find_path(G, "삼성전자", "SK하이닉스")
if path:
    print(f"경로: {' → '.join(path)}")
\`\`\`

## 분석 결과 DataFrame

\`\`\`python
# 중심성 결과를 DataFrame으로
analysis_df = pd.DataFrame({
    'node': list(G.nodes()),
    'label': [G.nodes[n].get('label', n) for n in G.nodes()],
    'type': [G.nodes[n].get('type', '') for n in G.nodes()],
    'degree': [degree_cent[n] for n in G.nodes()],
    'pagerank': [pagerank[n] for n in G.nodes()],
    'betweenness': [betweenness[n] for n in G.nodes()],
    'community': [node_community.get(n, -1) for n in G.nodes()]
})

# 기업만 필터
company_analysis = analysis_df[analysis_df['type'] == 'Company']
company_analysis = company_analysis.sort_values('pagerank', ascending=False)
company_analysis.head(20)
\`\`\`
      `,
      keyPoints: ['중심성 분석으로 핵심 기업 발견', '커뮤니티 탐지로 그룹화', '경로 분석으로 연결 파악'],
      practiceGoal: '그래프 알고리즘으로 인사이트를 도출할 수 있다',
    }),

    createCodeTask('w5d5-visualization', '시각화', 40, {
      introduction: `
# 그래프 시각화

## PyVis 인터랙티브 시각화

\`\`\`python
from pyvis.network import Network

def visualize_graph(G, filename="company_graph.html"):
    # PyVis 네트워크 생성
    net = Network(height="700px", width="100%",
                  bgcolor="#222222", font_color="white",
                  directed=True)

    # 물리 시뮬레이션 설정
    net.barnes_hut(gravity=-8000, central_gravity=0.3, spring_length=200)

    # 색상 맵
    type_colors = {
        'Company': '#4ecdc4',
        'Person': '#ff6b6b'
    }

    relation_colors = {
        'subsidiary_of': '#45b7d1',
        'competes_with': '#ff6b6b',
        'ceo_of': '#98d85b'
    }

    # 노드 추가
    for node, attrs in G.nodes(data=True):
        label = attrs.get('label', node)
        node_type = attrs.get('type', 'Unknown')
        color = type_colors.get(node_type, '#888888')

        # PageRank 기반 크기
        size = 10 + pagerank.get(node, 0) * 500

        net.add_node(node, label=label, color=color, size=size,
                     title=f"{label}\\nType: {node_type}\\nPageRank: {pagerank.get(node, 0):.4f}")

    # 엣지 추가
    for source, target, attrs in G.edges(data=True):
        relation = attrs.get('relation', '')
        color = relation_colors.get(relation, '#888888')
        net.add_edge(source, target, color=color, title=relation)

    # HTML 저장
    net.save_graph(filename)
    print(f"시각화 저장: {filename}")

visualize_graph(G)
\`\`\`

## Matplotlib 정적 시각화

\`\`\`python
import matplotlib.pyplot as plt

def plot_static_graph(G, top_n=50):
    # 상위 노드만 추출
    top_nodes = sorted(pagerank.items(), key=lambda x: x[1], reverse=True)[:top_n]
    subgraph = G.subgraph([n for n, _ in top_nodes])

    plt.figure(figsize=(16, 12))
    pos = nx.spring_layout(subgraph, seed=42, k=2)

    # 노드 색상
    node_colors = ['#4ecdc4' if subgraph.nodes[n].get('type') == 'Company'
                   else '#ff6b6b' for n in subgraph.nodes()]

    # 노드 크기
    node_sizes = [pagerank.get(n, 0.01) * 10000 for n in subgraph.nodes()]

    # 그리기
    nx.draw_networkx_nodes(subgraph, pos, node_color=node_colors,
                          node_size=node_sizes, alpha=0.8)
    nx.draw_networkx_edges(subgraph, pos, alpha=0.3, arrows=True)

    # 레이블
    labels = {n: subgraph.nodes[n].get('label', n)[:10] for n in subgraph.nodes()}
    nx.draw_networkx_labels(subgraph, pos, labels, font_size=8)

    plt.title("Korean Company Network (Top 50 by PageRank)")
    plt.axis('off')
    plt.tight_layout()
    plt.savefig("company_network.png", dpi=150, bbox_inches='tight')
    plt.show()

plot_static_graph(G)
\`\`\`

## 커뮤니티별 시각화

\`\`\`python
import matplotlib.cm as cm

def plot_communities(G, communities):
    plt.figure(figsize=(14, 10))
    pos = nx.spring_layout(G.to_undirected(), seed=42)

    # 커뮤니티별 색상
    colors = cm.rainbow(np.linspace(0, 1, len(communities)))

    for i, (comm, color) in enumerate(zip(communities[:10], colors)):
        nx.draw_networkx_nodes(G, pos, nodelist=list(comm),
                              node_color=[color], alpha=0.7,
                              label=f"Community {i+1}")

    nx.draw_networkx_edges(G, pos, alpha=0.2)
    plt.legend()
    plt.title("Company Communities")
    plt.axis('off')
    plt.savefig("communities.png", dpi=150)
    plt.show()
\`\`\`
      `,
      keyPoints: ['PyVis로 인터랙티브 HTML', 'Matplotlib으로 정적 이미지', 'PageRank로 노드 크기 조절'],
      practiceGoal: '그래프를 효과적으로 시각화할 수 있다',
    }),

    createReadingTask('w5d5-week-summary', '주간 학습 정리', 20, {
      introduction: `
# Week 5 학습 정리

## 이번 주 배운 내용

### Day 1: RDF 기초
- 시맨틱 웹과 Linked Data
- RDF 트리플 구조 (S-P-O)
- Turtle, JSON-LD 등 직렬화 형식
- 표준 네임스페이스 (FOAF, DC, Schema.org)

### Day 2: SPARQL
- 기본 쿼리 패턴 (SELECT, FILTER, OPTIONAL)
- 고급 기능 (Property Paths, 집계)
- Wikidata 쿼리 실습

### Day 3: OWL 온톨로지
- 클래스와 프로퍼티 정의
- 프로퍼티 특성 (Transitive, Symmetric 등)
- 추론 (Reasoning)

### Day 4: Property Graph vs RDF
- 데이터 모델 비교
- Cypher vs SPARQL
- 사용 사례와 선택 기준

### Day 5: 실습 프로젝트
- Wikidata 데이터 수집
- RDF → NetworkX 변환
- 그래프 분석 및 시각화

## 핵심 교훈

\`\`\`
1. RDF/OWL은 표준화와 추론에 강점
2. Property Graph는 실무 애플리케이션에 적합
3. 두 기술은 상호 보완적 - 하이브리드 접근 권장
4. Wikidata 등 공개 Linked Data 활용 가치 높음
\`\`\`

## 다음 단계

- GraphRAG: Property Graph + LLM 연동
- 도메인 KG 구축 프로젝트
- 실제 비즈니스 문제에 적용
      `,
      keyPoints: ['RDF/OWL: 표준, 추론', 'Property Graph: 실무, 성능', '하이브리드 접근이 최선'],
      practiceGoal: '주간 학습 내용을 정리한다',
    }),

    createQuizTask('w5d5-quiz', 'Week 5 종합 퀴즈', 20, {
      introduction: '# Week 5 종합 퀴즈',
      questions: [
        {
          id: 'w5d5-q1',
          question: 'Wikidata에서 "instance of"를 나타내는 프로퍼티는?',
          options: ['P17', 'P31', 'P279', 'P571'],
          correctAnswer: 1,
          explanation: 'P31은 instance of (타입), P279는 subclass of, P17은 country입니다.',
        },
        {
          id: 'w5d5-q2',
          question: 'RDF를 NetworkX로 변환할 때 트리플의 Predicate는?',
          options: ['노드 속성', '노드 레이블', '엣지 타입/속성', '그래프 이름'],
          correctAnswer: 2,
          explanation: 'Predicate는 관계를 나타내므로 엣지의 타입이나 속성이 됩니다.',
        },
        {
          id: 'w5d5-q3',
          question: '시맨틱 웹에서 데이터 통합에 유리한 이유는?',
          options: ['빠른 쿼리 속도', '표준 URI와 어휘로 의미 명확', '단순한 데이터 구조', '추론 기능 없음'],
          correctAnswer: 1,
          explanation: '표준 URI와 공통 어휘를 사용하여 이기종 데이터를 의미적으로 통합할 수 있습니다.',
        },
      ],
      keyPoints: ['P31 = instance of', 'Predicate → Edge', '표준화가 데이터 통합의 핵심'],
      practiceGoal: 'Week 5 전체 내용을 확인한다',
    }),
  ],

  challenge: createChallengeTask('w5d5-challenge', 'Challenge: Linked Data 분석 프로젝트', 65, {
    introduction: `
# Challenge: Linked Data 분석 프로젝트

## 최종 프로젝트

Wikidata를 활용한 도메인 분석 프로젝트를 완성하세요.

## 요구사항

### 1. 데이터 수집 (SPARQL)
- 최소 3개 유형의 엔티티
- 최소 5개 관계 유형
- 100개 이상의 트리플

### 2. 데이터 변환
- RDF → NetworkX 그래프
- 노드/엣지 속성 보존
- 데이터 정제 (중복 제거 등)

### 3. 분석
- 중심성 분석 (Degree, PageRank, Betweenness)
- 커뮤니티 탐지
- 최소 3개의 분석 인사이트

### 4. 시각화
- PyVis 인터랙티브 그래프
- 정적 시각화 2개 이상

### 5. 리포트
- 데이터 설명
- 분석 방법론
- 주요 발견
- 한계점 및 개선 방향

## 제출물

1. Python 노트북 (.ipynb)
2. HTML 시각화 파일
3. 분석 리포트 (PDF/MD)

## 도메인 예시

- 한국 영화/배우 네트워크
- K-POP 아티스트 관계
- 한국 스타트업 생태계
- 역사적 인물 관계
    `,
    keyPoints: ['전체 파이프라인 구현', '분석 인사이트 도출', '시각화와 리포트'],
    practiceGoal: 'Linked Data 분석 프로젝트를 완수한다',
  }),
}
