// Day 3: NetworkX & PyVis 시각화

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day3Visualization: Day = {
  slug: 'networkx-pyvis-visualization',
  title: 'NetworkX & PyVis 시각화',
  totalDuration: 240,
  tasks: [
    createVideoTask('w4d3-networkx-intro', 'NetworkX 기초', 30, {
      introduction: `
# NetworkX 기초

## 설치

\`\`\`bash
pip install networkx matplotlib
\`\`\`

## 그래프 생성

\`\`\`python
import networkx as nx

# 방향 그래프
G = nx.DiGraph()

# 노드 추가
G.add_node("Kim", age=30, city="Seoul")
G.add_nodes_from(["Lee", "Park", "Choi"])

# 엣지 추가
G.add_edge("Kim", "Lee", weight=1.0, relation="friend")
G.add_edges_from([("Kim", "Park"), ("Lee", "Choi")])

print(f"노드 수: {G.number_of_nodes()}")
print(f"엣지 수: {G.number_of_edges()}")
\`\`\`

## Neo4j에서 NetworkX로

\`\`\`python
def neo4j_to_networkx(driver, query):
    G = nx.DiGraph()
    with driver.session() as session:
        result = session.run(query)
        for record in result:
            G.add_edge(
                record["source"],
                record["target"],
                **record.get("props", {})
            )
    return G

query = """
MATCH (a:Person)-[r:KNOWS]->(b:Person)
RETURN a.name AS source, b.name AS target
"""
G = neo4j_to_networkx(driver, query)
\`\`\`
      `,
      keyPoints: ['NetworkX로 그래프 생성 및 조작', 'Neo4j 데이터를 NetworkX로 변환', '노드/엣지 속성 관리'],
      practiceGoal: 'NetworkX의 기본 사용법을 익힌다',
    }),

    createCodeTask('w4d3-graph-analysis', '그래프 분석 메트릭', 35, {
      introduction: `
# 그래프 분석 메트릭

## 🎯 왜 그래프 메트릭이 필요한가?

### 문제 상황
Knowledge Graph에서 중요한 노드나 연결 패턴을 어떻게 찾을까?
- 누가 가장 영향력 있나? (중심성)
- 어떤 그룹이 강하게 연결되었나? (클러스터링)
- 최단 경로는? (경로 탐색)

### 해결책
> 📊 **비유**: 그래프 메트릭은 **도시 통계**입니다.
>
> - PageRank = 인구 밀도 (중요도)
> - Clustering = 동네 결속력
> - Shortest Path = 최단 지하철 경로

\`\`\`python
import networkx as nx

# 기본 통계
print(f"노드 수: {G.number_of_nodes()}")
print(f"엣지 수: {G.number_of_edges()}")
print(f"밀도: {nx.density(G):.4f}")

# 연결 컴포넌트
if G.is_directed():
    components = list(nx.weakly_connected_components(G))
else:
    components = list(nx.connected_components(G))
print(f"컴포넌트 수: {len(components)}")

# 중심성
degree_cent = nx.degree_centrality(G)
betweenness = nx.betweenness_centrality(G)
pagerank = nx.pagerank(G)

# 상위 5개 노드
top_pagerank = sorted(pagerank.items(), key=lambda x: x[1], reverse=True)[:5]
print("PageRank Top 5:", top_pagerank)

# 클러스터링 계수
if not G.is_directed():
    clustering = nx.clustering(G)
    avg_clustering = nx.average_clustering(G)
    print(f"평균 클러스터링: {avg_clustering:.4f}")

# 최단 경로
if nx.has_path(G, "Kim", "Choi"):
    path = nx.shortest_path(G, "Kim", "Choi")
    print(f"최단 경로: {path}")
\`\`\`
      `,
      keyPoints: ['📊 밀도, 연결 컴포넌트 분석', '⭐ 중심성 메트릭 계산', '🛣️ 최단 경로 탐색'],
      practiceGoal: 'NetworkX로 그래프 분석 메트릭을 계산할 수 있다',
    }),

    createCodeTask('w4d3-matplotlib-viz', 'Matplotlib 시각화', 30, {
      introduction: `
# Matplotlib으로 그래프 시각화

\`\`\`python
import networkx as nx
import matplotlib.pyplot as plt

# 기본 시각화
plt.figure(figsize=(12, 8))
pos = nx.spring_layout(G, seed=42)
nx.draw(G, pos, with_labels=True, node_color='lightblue',
        node_size=500, font_size=10, arrows=True)
plt.title("Social Network")
plt.savefig("graph.png", dpi=150, bbox_inches='tight')
plt.show()

# 속성 기반 시각화
node_colors = [pagerank[node] * 1000 for node in G.nodes()]
node_sizes = [degree_cent[node] * 2000 + 100 for node in G.nodes()]

plt.figure(figsize=(14, 10))
nx.draw(G, pos,
        node_color=node_colors,
        node_size=node_sizes,
        cmap=plt.cm.Reds,
        with_labels=True,
        font_size=8,
        arrows=True,
        edge_color='gray',
        alpha=0.7)
plt.colorbar(plt.cm.ScalarMappable(cmap=plt.cm.Reds), label='PageRank')
plt.title("Network by PageRank")
plt.savefig("pagerank_graph.png")
\`\`\`
      `,
      keyPoints: ['🎨 spring_layout으로 레이아웃 계산', '🔵 노드 크기/색상으로 메트릭 표현', '📊 colorbar로 범례 추가'],
      practiceGoal: 'Matplotlib으로 그래프를 시각화할 수 있다',
    }),

    createCodeTask('w4d3-pyvis', 'PyVis 인터랙티브 시각화', 40, {
      introduction: `
# PyVis 인터랙티브 시각화

## 🎯 왜 PyVis가 필요한가?

### 문제 상황
Matplotlib 정적 이미지는 탐색이 어렵습니다.
- 줌 불가
- 노드 클릭 정보 없음
- 레이아웃 조정 불가

### 해결책
> 🕹️ **비유**: PyVis는 **구글맵**입니다.
>
> Matplotlib(종이 지도) vs PyVis(인터랙티브 맵)
> 드래그, 줌, 클릭으로 자유롭게 탐색!

## 설치

\`\`\`bash
pip install pyvis
\`\`\`

## 기본 사용

\`\`\`python
from pyvis.network import Network

# 네트워크 생성
net = Network(height="600px", width="100%", bgcolor="#222222", font_color="white")

# NetworkX에서 변환
net.from_nx(G)

# HTML 저장
net.show("graph.html", notebook=False)
\`\`\`

## 커스터마이징

\`\`\`python
net = Network(height="700px", width="100%", directed=True)

# 물리 시뮬레이션 설정
net.barnes_hut(gravity=-8000, central_gravity=0.3, spring_length=200)

# 노드 추가 (스타일 포함)
for node in G.nodes():
    size = pagerank[node] * 50 + 10
    color = "#ff6b6b" if degree_cent[node] > 0.3 else "#4ecdc4"
    net.add_node(node, label=node, size=size, color=color, title=f"PR: {pagerank[node]:.3f}")

# 엣지 추가
for source, target in G.edges():
    net.add_edge(source, target, arrows="to")

# 옵션 설정
net.set_options('''
var options = {
  "nodes": {
    "borderWidth": 2,
    "shadow": true
  },
  "edges": {
    "smooth": {"type": "continuous"}
  },
  "physics": {
    "enabled": true,
    "stabilization": {"iterations": 100}
  }
}
''')

net.show("interactive_graph.html")
\`\`\`

## Neo4j 직접 연동

\`\`\`python
def create_pyvis_from_neo4j(driver, query):
    net = Network(height="600px", width="100%", directed=True)

    with driver.session() as session:
        result = session.run(query)
        for record in result:
            net.add_node(record["source"], label=record["source"])
            net.add_node(record["target"], label=record["target"])
            net.add_edge(record["source"], record["target"])

    return net

query = "MATCH (a)-[r]->(b) RETURN a.name AS source, b.name AS target LIMIT 100"
net = create_pyvis_from_neo4j(driver, query)
net.show("neo4j_graph.html")
\`\`\`
      `,
      keyPoints: ['🕹️ PyVis로 인터랙티브 HTML 그래프 생성', '🔄 from_nx()로 NetworkX 변환', '⚙️ 물리 시뮬레이션 설정'],
      practiceGoal: 'PyVis로 인터랙티브 그래프를 생성할 수 있다',
    }),

    createReadingTask('w4d3-viz-best-practices', '시각화 베스트 프랙티스', 25, {
      introduction: `
# 시각화 베스트 프랙티스

## 노드 수에 따른 도구 선택

| 노드 수 | 권장 도구 |
|---------|----------|
| ~100 | Matplotlib, PyVis |
| ~1000 | PyVis, Gephi |
| ~10000 | Gephi, Neo4j Bloom |
| 10000+ | 집계/샘플링 후 시각화 |

## 레이아웃 알고리즘

- **spring_layout**: 일반적 용도
- **circular_layout**: 작은 그래프, 사이클 강조
- **kamada_kawai_layout**: 미적으로 우수
- **spectral_layout**: 클러스터 구분

## 색상 가이드라인

- 노드 타입별 다른 색상
- 메트릭을 색상 그라데이션으로
- 중요 노드는 강조색

## 성능 최적화

\`\`\`python
# 큰 그래프는 샘플링
if G.number_of_nodes() > 500:
    # 상위 PageRank 노드만
    top_nodes = sorted(pagerank.items(), key=lambda x: x[1], reverse=True)[:100]
    subgraph = G.subgraph([n for n, _ in top_nodes])
\`\`\`
      `,
      keyPoints: ['그래프 크기에 따른 도구 선택', '레이아웃 알고리즘 특성', '대용량 그래프는 샘플링'],
      practiceGoal: '효과적인 그래프 시각화 전략을 수립할 수 있다',
    }),

    createCodeTask('w4d3-dashboard', 'Streamlit 대시보드', 35, {
      introduction: `
# Streamlit 그래프 대시보드

## 🎯 왜 Streamlit 대시보드가 필요한가?

### 문제 상황
HTML 파일만으로는 동적 필터링과 실시간 분석이 어렵습니다.
- 노드 수 조정 불가
- 메트릭 재계산 번거로움
- 공유와 배포 어려움

### 해결책
> 📊 **비유**: Streamlit은 **엑셀 피벗 테이블**입니다.
>
> 슬라이더 조작 → 즉시 재계산 → 시각화 업데이트
> Python 코드 몇 줄로 전문 대시보드!

\`\`\`python
import streamlit as st
import networkx as nx
from pyvis.network import Network
import streamlit.components.v1 as components

st.title("Knowledge Graph Explorer")

# 사이드바 옵션
node_count = st.sidebar.slider("노드 수", 10, 200, 50)
layout = st.sidebar.selectbox("레이아웃", ["spring", "circular", "kamada_kawai"])

# 그래프 생성 (예: Neo4j에서 로드)
@st.cache_data
def load_graph():
    # 실제로는 Neo4j에서 로드
    G = nx.barabasi_albert_graph(node_count, 3)
    return G

G = load_graph()

# 메트릭 계산
col1, col2, col3 = st.columns(3)
col1.metric("노드", G.number_of_nodes())
col2.metric("엣지", G.number_of_edges())
col3.metric("밀도", f"{nx.density(G):.4f}")

# PyVis 시각화
net = Network(height="500px", width="100%")
net.from_nx(G)
net.save_graph("temp_graph.html")

with open("temp_graph.html", "r") as f:
    html = f.read()
components.html(html, height=550)

# 중심성 테이블
st.subheader("Top 10 by PageRank")
pagerank = nx.pagerank(G)
top_nodes = sorted(pagerank.items(), key=lambda x: x[1], reverse=True)[:10]
st.table(top_nodes)
\`\`\`
      `,
      keyPoints: ['⚡ Streamlit으로 빠른 대시보드', '🔌 PyVis HTML을 components.html로 임베드', '💾 cache_data로 성능 최적화'],
      practiceGoal: 'Streamlit으로 그래프 분석 대시보드를 구축할 수 있다',
    }),

    createQuizTask('w4d3-quiz', 'Day 3 복습 퀴즈', 15, {
      introduction: '# Day 3 복습 퀴즈',
      questions: [
        {
          id: 'w4d3-q1',
          question: 'NetworkX에서 방향 그래프를 생성하는 클래스는?',
          options: ['Graph', 'DiGraph', 'DirectedGraph', 'DGraph'],
          correctAnswer: 1,
          explanation: 'DiGraph는 방향 그래프(Directed Graph)를 생성합니다.',
        },
        {
          id: 'w4d3-q2',
          question: 'PyVis에서 NetworkX 그래프를 변환하는 메서드는?',
          options: ['load_nx()', 'from_nx()', 'import_nx()', 'convert_nx()'],
          correctAnswer: 1,
          explanation: 'from_nx() 메서드로 NetworkX 그래프를 PyVis로 변환합니다.',
        },
        {
          id: 'w4d3-q3',
          question: '1000개 이상 노드의 그래프 시각화에 권장되는 도구는?',
          options: ['Matplotlib', 'PyVis만', 'Gephi 또는 Neo4j Bloom', '시각화 불가'],
          correctAnswer: 2,
          explanation: '대규모 그래프는 Gephi, Neo4j Bloom 등 전문 도구가 적합합니다.',
        },
      ],
      keyPoints: ['DiGraph로 방향 그래프', 'from_nx()로 NetworkX 변환', '대규모 그래프는 전문 도구'],
      practiceGoal: '그래프 시각화 도구의 특성을 확인한다',
    }),
  ],

  challenge: createChallengeTask('w4d3-challenge', 'Challenge: 기업 관계 시각화 대시보드', 40, {
    introduction: `
# Challenge: 기업 관계 시각화 대시보드

## 과제
Neo4j의 기업 Knowledge Graph를 시각화하는 Streamlit 대시보드를 구축하세요.

## 요구사항
1. Neo4j 연결 및 데이터 로드
2. 기본 통계 메트릭 표시
3. PyVis 인터랙티브 그래프
4. 중심성 기반 노드 크기/색상
5. 필터링 옵션 (산업, 관계 유형)
    `,
    keyPoints: ['Neo4j + NetworkX + PyVis 통합', 'Streamlit 대시보드', '인터랙티브 필터링'],
    practiceGoal: '완전한 그래프 시각화 대시보드를 구축한다',
  }),
}
