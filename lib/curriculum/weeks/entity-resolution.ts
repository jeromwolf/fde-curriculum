// Week: Entity Resolution & Python (Phase 3, Week 4)
import type { Week } from '../types'

export const entityResolutionWeek: Week = {
  slug: 'entity-resolution',
  week: 4,
  phase: 3,
  month: 5,
  access: 'core',
  title: 'Entity Resolution & Python',
  topics: ['중복 탐지', 'Record Linkage', 'py2neo', 'NetworkX 통합'],
  practice: '대규모 데이터셋에서 중복 엔티티 탐지 및 병합',
  totalDuration: 720,
  days: [
    {
      slug: 'entity-resolution-concepts',
      title: 'Entity Resolution 개념',
      totalDuration: 150,
      tasks: [
        {
          id: 'er-intro-video',
          type: 'video',
          title: 'Entity Resolution이란?',
          duration: 25,
          content: {
            objectives: [
              'Entity Resolution의 필요성을 이해한다',
              '중복 탐지와 Record Linkage의 차이를 파악한다',
              '블로킹과 유사도 매칭 전략을 학습한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=er-intro-placeholder',
            transcript: `
## Entity Resolution (ER)

### Entity Resolution이란?

**같은 실체(Entity)를 다르게 표현한 레코드를 연결하는 것**

예시:
- "Samsung Electronics" = "삼성전자" = "SAMSUNG"
- "홍길동 (010-1234-5678)" = "Hong Gil-dong (010.1234.5678)"

### 왜 중요한가?

| 분야 | 문제 | 영향 |
|------|------|------|
| 고객 데이터 | 한 고객이 여러 레코드 | 마케팅 비용 낭비 |
| 금융 | 동일인 탐지 실패 | 사기, 규제 위반 |
| 의료 | 환자 기록 분산 | 진료 품질 저하 |
| Knowledge Graph | 중복 노드 | 쿼리 정확도 저하 |

### ER 파이프라인

\`\`\`
[Raw Data] → [전처리] → [블로킹] → [유사도 매칭] → [클러스터링] → [병합]
\`\`\`

### 1. 전처리 (Preprocessing)

\`\`\`python
# 이름 정규화
def normalize_name(name):
    name = name.lower().strip()
    name = re.sub(r'[^a-z가-힣0-9\\s]', '', name)
    return name

# 예: "Samsung Electronics Co., Ltd."
#  → "samsung electronics co ltd"
\`\`\`

### 2. 블로킹 (Blocking)

모든 쌍을 비교하면 O(n²) 복잡도.
**블로킹**으로 후보 쌍을 줄입니다.

\`\`\`python
# 첫 글자 블로킹
blocks = {}
for record in records:
    key = record['name'][0].lower()
    blocks.setdefault(key, []).append(record)
\`\`\`

### 3. 유사도 매칭

| 알고리즘 | 특징 | 용도 |
|----------|------|------|
| Levenshtein | 편집 거리 | 오타 |
| Jaro-Winkler | 접두사 가중치 | 이름 |
| Soundex | 발음 유사도 | 영어 이름 |
| TF-IDF + Cosine | 벡터 유사도 | 긴 텍스트 |

### 4. 클러스터링

유사한 레코드를 그룹화:

\`\`\`python
# Transitive Closure
# A ≈ B, B ≈ C → A, B, C 모두 같은 엔티티
from networkx import Graph, connected_components

G = Graph()
for (r1, r2, sim) in matches:
    if sim > 0.8:
        G.add_edge(r1, r2)

clusters = list(connected_components(G))
\`\`\`

### 그래프 기반 ER의 장점

1. **Transitive Closure** 자동 처리
2. **연결 컨텍스트** 활용 (공통 이웃)
3. **시각화**로 검증 용이
4. **확장성** - 병렬 처리 가능
            `
          }
        },
        {
          id: 'er-graph-reading',
          type: 'reading',
          title: '그래프 기반 Entity Resolution',
          duration: 20,
          content: {
            objectives: [
              '그래프로 ER을 표현하는 방법을 이해한다',
              'Neo4j에서 ER을 구현하는 패턴을 학습한다',
              '대규모 ER의 성능 최적화를 파악한다'
            ],
            markdown: `
## 그래프 기반 Entity Resolution

### ER 그래프 모델

\`\`\`cypher
// 원본 레코드
(:Record {
  id: 'R001',
  name: 'Samsung Electronics',
  source: 'CRM'
})

// 정규화된 엔티티
(:Entity {
  id: 'E001',
  canonicalName: '삼성전자'
})

// 매핑 관계
(:Record)-[:RESOLVED_TO {confidence: 0.95}]->(:Entity)
\`\`\`

### Neo4j ER 패턴

#### 1. 후보 쌍 생성 (블로킹)

\`\`\`cypher
// 같은 도시의 회사 중 이름이 유사한 쌍
MATCH (c1:Company), (c2:Company)
WHERE c1.city = c2.city
AND id(c1) < id(c2)
AND apoc.text.levenshteinSimilarity(c1.name, c2.name) > 0.7
RETURN c1.name, c2.name,
  apoc.text.levenshteinSimilarity(c1.name, c2.name) AS similarity
\`\`\`

#### 2. 매칭 관계 생성

\`\`\`cypher
MATCH (c1:Company), (c2:Company)
WHERE c1.city = c2.city
AND id(c1) < id(c2)
WITH c1, c2, apoc.text.levenshteinSimilarity(c1.name, c2.name) AS sim
WHERE sim > 0.8
MERGE (c1)-[r:MAYBE_SAME]->(c2)
SET r.similarity = sim
\`\`\`

#### 3. 클러스터 탐지 (WCC)

\`\`\`cypher
CALL gds.graph.project('erGraph', 'Company', 'MAYBE_SAME')

CALL gds.wcc.stream('erGraph')
YIELD nodeId, componentId
WITH componentId, collect(gds.util.asNode(nodeId)) AS members
WHERE size(members) > 1
RETURN componentId, size(members), [m IN members | m.name]
\`\`\`

#### 4. 정규 엔티티 생성

\`\`\`cypher
// 클러스터별 마스터 레코드 선택
CALL gds.wcc.stream('erGraph')
YIELD nodeId, componentId
WITH componentId, collect(gds.util.asNode(nodeId)) AS members
WHERE size(members) > 1
WITH componentId, members, members[0] AS master
MERGE (e:Entity {clusterId: componentId})
SET e.canonicalName = master.name
WITH e, members
UNWIND members AS member
MERGE (member)-[:RESOLVED_TO]->(e)
\`\`\`

### 성능 최적화

| 전략 | 설명 |
|------|------|
| 블로킹 인덱스 | 블로킹 키에 인덱스 생성 |
| 배치 처리 | apoc.periodic.iterate 사용 |
| 병렬 비교 | 독립적인 블록 병렬 처리 |
| 확률적 블로킹 | LSH (Locality Sensitive Hashing) |

### 평가 지표

- **Precision**: 매칭 중 실제 매칭 비율
- **Recall**: 실제 매칭 중 탐지 비율
- **F1 Score**: Precision과 Recall의 조화 평균

\`\`\`python
precision = true_positives / (true_positives + false_positives)
recall = true_positives / (true_positives + false_negatives)
f1 = 2 * precision * recall / (precision + recall)
\`\`\`
            `
          }
        }
      ]
    },
    {
      slug: 'python-neo4j',
      title: 'Python과 Neo4j 통합',
      totalDuration: 180,
      tasks: [
        {
          id: 'py2neo-video',
          type: 'video',
          title: 'py2neo: Python에서 Neo4j 다루기',
          duration: 25,
          content: {
            objectives: [
              'py2neo 라이브러리 사용법을 익힌다',
              'OGM (Object Graph Mapping)을 이해한다',
              'Python 객체와 그래프 노드 간 매핑을 구현한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=py2neo-placeholder',
            transcript: `
## py2neo: Python Neo4j 드라이버

### 설치

\`\`\`bash
pip install py2neo
\`\`\`

### 연결

\`\`\`python
from py2neo import Graph

# 로컬 연결
graph = Graph("bolt://localhost:7687", auth=("neo4j", "password"))

# Neo4j Aura 연결
graph = Graph(
    "neo4j+s://xxxx.databases.neo4j.io",
    auth=("neo4j", "your-password")
)
\`\`\`

### 기본 쿼리

\`\`\`python
# Cypher 실행
result = graph.run("MATCH (p:Person) RETURN p.name LIMIT 5")
for record in result:
    print(record["p.name"])

# 파라미터 바인딩
result = graph.run(
    "MATCH (p:Person {name: $name}) RETURN p",
    name="Alice"
)
\`\`\`

### 노드 생성

\`\`\`python
from py2neo import Node, Relationship

# 노드 생성
alice = Node("Person", name="Alice", age=30)
bob = Node("Person", name="Bob", age=25)

# 관계 생성
knows = Relationship(alice, "KNOWS", bob, since=2020)

# 트랜잭션으로 저장
tx = graph.begin()
tx.create(alice)
tx.create(bob)
tx.create(knows)
tx.commit()
\`\`\`

### OGM (Object Graph Mapping)

\`\`\`python
from py2neo.ogm import GraphObject, Property, RelatedTo

class Person(GraphObject):
    __primarykey__ = "name"

    name = Property()
    age = Property()
    friends = RelatedTo("Person", "KNOWS")

# 사용
alice = Person()
alice.name = "Alice"
alice.age = 30

bob = Person()
bob.name = "Bob"

alice.friends.add(bob)
graph.push(alice)
\`\`\`

### 대용량 처리

\`\`\`python
# 배치 생성
from py2neo import Transaction

tx = graph.begin()
for i, data in enumerate(large_dataset):
    node = Node("Record", **data)
    tx.create(node)

    # 1000개마다 커밋
    if i % 1000 == 0:
        tx.commit()
        tx = graph.begin()

tx.commit()
\`\`\`
            `
          }
        },
        {
          id: 'networkx-video',
          type: 'video',
          title: 'NetworkX: Python 그래프 라이브러리',
          duration: 20,
          content: {
            objectives: [
              'NetworkX 기본 사용법을 익힌다',
              'Neo4j와 NetworkX 간 데이터 변환을 이해한다',
              '로컬 그래프 분석을 수행한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=networkx-placeholder',
            transcript: `
## NetworkX: Python 그래프 분석

### 설치

\`\`\`bash
pip install networkx matplotlib
\`\`\`

### 기본 사용법

\`\`\`python
import networkx as nx

# 그래프 생성
G = nx.Graph()  # 무방향
D = nx.DiGraph()  # 방향

# 노드 추가
G.add_node("Alice", age=30)
G.add_nodes_from([("Bob", {"age": 25}), ("Charlie", {"age": 35})])

# 엣지 추가
G.add_edge("Alice", "Bob", weight=1.0)
G.add_edges_from([("Bob", "Charlie"), ("Charlie", "Alice")])

# 노드/엣지 속성
print(G.nodes["Alice"])  # {'age': 30}
print(G.edges["Alice", "Bob"])  # {'weight': 1.0}
\`\`\`

### 그래프 알고리즘

\`\`\`python
# 중심성
centrality = nx.pagerank(G)
betweenness = nx.betweenness_centrality(G)
closeness = nx.closeness_centrality(G)

# 커뮤니티 탐지
from networkx.algorithms.community import louvain_communities
communities = louvain_communities(G)

# 최단 경로
path = nx.shortest_path(G, "Alice", "Charlie")
distance = nx.shortest_path_length(G, "Alice", "Charlie")

# Connected Components
components = list(nx.connected_components(G))
\`\`\`

### 시각화

\`\`\`python
import matplotlib.pyplot as plt

# 기본 시각화
nx.draw(G, with_labels=True)
plt.show()

# 레이아웃 커스터마이징
pos = nx.spring_layout(G)
nx.draw_networkx_nodes(G, pos, node_size=700)
nx.draw_networkx_edges(G, pos)
nx.draw_networkx_labels(G, pos)
plt.show()
\`\`\`

### Neo4j ↔ NetworkX 변환

\`\`\`python
def neo4j_to_networkx(graph, query):
    """Neo4j 쿼리 결과를 NetworkX 그래프로 변환"""
    result = graph.run(query)
    G = nx.DiGraph()

    for record in result:
        source = record["source"]
        target = record["target"]
        G.add_node(source["id"], **dict(source))
        G.add_node(target["id"], **dict(target))
        G.add_edge(source["id"], target["id"])

    return G

# 사용
query = """
MATCH (a:Person)-[:KNOWS]->(b:Person)
RETURN a as source, b as target
"""
G = neo4j_to_networkx(graph, query)
\`\`\`
            `
          }
        },
        {
          id: 'er-practice-code',
          type: 'code',
          title: 'Entity Resolution 실습',
          duration: 60,
          content: {
            objectives: [
              'Python으로 ER 파이프라인을 구현한다',
              'py2neo로 결과를 Neo4j에 저장한다',
              'NetworkX로 클러스터를 분석한다'
            ],
            instructions: `
## 실습: 고객 데이터 중복 탐지

### 시나리오

두 개의 CRM 시스템에서 수집된 고객 데이터에서 중복을 탐지합니다.

### 샘플 데이터

\`\`\`python
customers_crm1 = [
    {"id": "C001", "name": "홍길동", "email": "hong@example.com", "phone": "010-1234-5678"},
    {"id": "C002", "name": "김철수", "email": "kim@example.com", "phone": "010-2345-6789"},
    {"id": "C003", "name": "이영희", "email": "lee@example.com", "phone": "010-3456-7890"},
]

customers_crm2 = [
    {"id": "D001", "name": "Hong Gil-dong", "email": "gdhong@example.com", "phone": "01012345678"},
    {"id": "D002", "name": "김 철수", "email": "chulsu.kim@example.com", "phone": "010-2345-6789"},
    {"id": "D003", "name": "박민수", "email": "park@example.com", "phone": "010-4567-8901"},
]
\`\`\`

### 과제 1: 전처리 함수 구현

### 과제 2: 유사도 매칭

### 과제 3: 클러스터링 및 Neo4j 저장
            `,
            starterCode: `import re
from py2neo import Graph, Node, Relationship
import networkx as nx

# 샘플 데이터
customers_crm1 = [
    {"id": "C001", "name": "홍길동", "email": "hong@example.com", "phone": "010-1234-5678"},
    {"id": "C002", "name": "김철수", "email": "kim@example.com", "phone": "010-2345-6789"},
    {"id": "C003", "name": "이영희", "email": "lee@example.com", "phone": "010-3456-7890"},
]

customers_crm2 = [
    {"id": "D001", "name": "Hong Gil-dong", "email": "gdhong@example.com", "phone": "01012345678"},
    {"id": "D002", "name": "김 철수", "email": "chulsu.kim@example.com", "phone": "010-2345-6789"},
    {"id": "D003", "name": "박민수", "email": "park@example.com", "phone": "010-4567-8901"},
]

# 1. 전처리
def normalize_phone(phone):
    """전화번호 정규화: 숫자만 추출"""
    # TODO: 구현
    pass

def normalize_name(name):
    """이름 정규화: 소문자, 공백 제거"""
    # TODO: 구현
    pass

# 2. 유사도 계산
def calculate_similarity(c1, c2):
    """두 고객 레코드의 유사도 계산"""
    # TODO: 전화번호, 이름, 이메일 기반 유사도
    pass

# 3. 매칭 및 클러스터링
def find_matches(customers1, customers2, threshold=0.7):
    """매칭 쌍 탐지"""
    # TODO: 구현
    pass

# 4. Neo4j 저장
def save_to_neo4j(graph, customers, matches):
    """결과를 Neo4j에 저장"""
    # TODO: 구현
    pass
`,
            solutionCode: `import re
from py2neo import Graph, Node, Relationship
import networkx as nx
from difflib import SequenceMatcher

# 샘플 데이터
customers_crm1 = [
    {"id": "C001", "name": "홍길동", "email": "hong@example.com", "phone": "010-1234-5678"},
    {"id": "C002", "name": "김철수", "email": "kim@example.com", "phone": "010-2345-6789"},
    {"id": "C003", "name": "이영희", "email": "lee@example.com", "phone": "010-3456-7890"},
]

customers_crm2 = [
    {"id": "D001", "name": "Hong Gil-dong", "email": "gdhong@example.com", "phone": "01012345678"},
    {"id": "D002", "name": "김 철수", "email": "chulsu.kim@example.com", "phone": "010-2345-6789"},
    {"id": "D003", "name": "박민수", "email": "park@example.com", "phone": "010-4567-8901"},
]

# 1. 전처리
def normalize_phone(phone):
    """전화번호 정규화: 숫자만 추출"""
    return re.sub(r'[^0-9]', '', phone)

def normalize_name(name):
    """이름 정규화: 소문자, 공백 제거"""
    name = name.lower().strip()
    name = re.sub(r'\\s+', '', name)
    name = re.sub(r'[^a-z가-힣]', '', name)
    return name

# 2. 유사도 계산
def calculate_similarity(c1, c2):
    """두 고객 레코드의 유사도 계산"""
    phone1 = normalize_phone(c1['phone'])
    phone2 = normalize_phone(c2['phone'])

    # 전화번호 완전 일치: 높은 가중치
    if phone1 == phone2:
        return 1.0

    # 이름 유사도
    name1 = normalize_name(c1['name'])
    name2 = normalize_name(c2['name'])
    name_sim = SequenceMatcher(None, name1, name2).ratio()

    # 이메일 도메인 전 부분 유사도
    email1 = c1['email'].split('@')[0].lower()
    email2 = c2['email'].split('@')[0].lower()
    email_sim = SequenceMatcher(None, email1, email2).ratio()

    # 가중 평균
    return 0.5 * name_sim + 0.3 * email_sim + 0.2 * (1 if phone1 == phone2 else 0)

# 3. 매칭 탐지
def find_matches(customers1, customers2, threshold=0.6):
    """매칭 쌍 탐지"""
    matches = []
    for c1 in customers1:
        for c2 in customers2:
            sim = calculate_similarity(c1, c2)
            if sim >= threshold:
                matches.append((c1['id'], c2['id'], sim))
    return matches

# 4. 클러스터링 (NetworkX)
def cluster_matches(matches):
    """매칭 결과를 클러스터로 그룹화"""
    G = nx.Graph()
    for id1, id2, sim in matches:
        G.add_edge(id1, id2, weight=sim)

    clusters = list(nx.connected_components(G))
    return clusters

# 5. Neo4j 저장
def save_to_neo4j(graph, customers1, customers2, matches, clusters):
    """결과를 Neo4j에 저장"""
    all_customers = {c['id']: c for c in customers1 + customers2}

    # 고객 노드 생성
    for cid, data in all_customers.items():
        node = Node("Customer", id=cid, **data)
        graph.merge(node, "Customer", "id")

    # 매칭 관계 생성
    for id1, id2, sim in matches:
        query = '''
        MATCH (c1:Customer {id: $id1})
        MATCH (c2:Customer {id: $id2})
        MERGE (c1)-[r:MAYBE_SAME]->(c2)
        SET r.similarity = $sim
        '''
        graph.run(query, id1=id1, id2=id2, sim=sim)

    # 클러스터 엔티티 생성
    for i, cluster in enumerate(clusters):
        entity_id = f"E{i+1:03d}"
        entity = Node("Entity", id=entity_id)
        graph.merge(entity, "Entity", "id")

        for cid in cluster:
            query = '''
            MATCH (c:Customer {id: $cid})
            MATCH (e:Entity {id: $eid})
            MERGE (c)-[:RESOLVED_TO]->(e)
            '''
            graph.run(query, cid=cid, eid=entity_id)

# 실행
matches = find_matches(customers_crm1, customers_crm2)
print("Matches found:", matches)

clusters = cluster_matches(matches)
print("Clusters:", clusters)

# Neo4j 저장 (연결 시)
# graph = Graph("bolt://localhost:7687", auth=("neo4j", "password"))
# save_to_neo4j(graph, customers_crm1, customers_crm2, matches, clusters)
`
          }
        },
        {
          id: 'week4-challenge',
          type: 'challenge',
          title: 'Week 4 도전 과제: 대규모 Entity Resolution',
          duration: 60,
          content: {
            objectives: [
              '실제 규모의 데이터셋으로 ER을 수행한다',
              '성능을 측정하고 최적화한다',
              '결과를 평가하고 리포트를 작성한다'
            ],
            requirements: [
              '1,000개 이상 레코드의 데이터셋 처리',
              '블로킹 전략 구현으로 비교 횟수 감소',
              'Precision, Recall, F1 Score 계산',
              'Neo4j에 결과 저장 및 시각화'
            ],
            evaluationCriteria: [
              '블로킹 효율성 (비교 횟수 감소율)',
              '매칭 정확도 (F1 Score)',
              '처리 시간',
              '코드 품질'
            ],
            bonusPoints: [
              '다중 속성 블로킹 (Multi-attribute Blocking)',
              'Active Learning으로 임계값 최적화',
              'Jupyter Notebook으로 분석 리포트'
            ]
          }
        }
      ]
    }
  ]
}
