// Week 6 Day 1: GraphRAG 개념 및 아키텍처

import type { Day } from './types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
} from './types'

// Task 1: GraphRAG 소개
const task1 = createVideoTask(
  'w6d1-graphrag-intro',
  'GraphRAG: 왜 그래프가 필요한가?',
  30,
  {
    introduction: `
## GraphRAG: Knowledge Graph + RAG

### 기존 RAG의 한계

일반적인 RAG(Retrieval-Augmented Generation)는 문서를 청크 단위로 분할하고
벡터 유사도로 검색합니다. 하지만 이 접근법에는 한계가 있습니다:

| 한계 | 설명 | 예시 |
|------|------|------|
| **지역적 검색** | 청크 단위 검색, 전체 맥락 부족 | "회사 전체 조직도" 질문에 부분만 검색 |
| **관계 부재** | 엔티티 간 연결 정보 없음 | "A와 B의 관계" 추론 불가 |
| **중복 정보** | 유사 청크 반복 검색 | 같은 내용 다른 표현 중복 |
| **추론 불가** | 명시적 정보만 검색 | 간접 관계 파악 어려움 |

### GraphRAG란?

**Knowledge Graph를 활용하여 RAG를 보강**하는 접근법입니다.

\`\`\`
[질문] → [키워드/엔티티 추출]
           ↓
    [Graph 검색] → 관련 엔티티 + 관계
           ↓
    [Vector 검색] → 관련 문서 청크
           ↓
    [컨텍스트 통합]
           ↓
    [LLM 응답 생성]
\`\`\`

### GraphRAG의 장점

1. **구조화된 지식**: 엔티티와 관계가 명확
2. **멀티홉 추론**: 연결된 정보 탐색
3. **글로벌 컨텍스트**: 전체 지식 구조 활용
4. **설명 가능성**: 추론 경로 추적 가능
`,
    keyPoints: [
      'GraphRAG는 Knowledge Graph와 RAG를 결합한 접근법',
      '기존 RAG의 관계 부재, 지역적 검색 한계 극복',
      '멀티홉 추론과 글로벌 컨텍스트 제공',
      '설명 가능한 AI 구현 가능',
    ],
    practiceGoal: 'GraphRAG의 필요성과 기존 RAG 대비 장점 이해',
  }
)

// Task 2: GraphRAG 아키텍처
const task2 = createReadingTask(
  'w6d1-architecture',
  'GraphRAG 아키텍처 패턴',
  40,
  {
    introduction: `
## GraphRAG 아키텍처 패턴

### 1. Naive GraphRAG

가장 기본적인 패턴으로, 벡터 검색 결과에 그래프 정보를 추가합니다.

\`\`\`
질문 → 벡터 검색 → 청크 목록
                      ↓
              엔티티 추출
                      ↓
              그래프 확장 (1-hop neighbors)
                      ↓
              통합 컨텍스트 → LLM
\`\`\`

### 2. Graph-First GraphRAG

그래프 검색을 우선으로 하고 벡터 검색으로 보완합니다.

\`\`\`
질문 → 엔티티 추출 → 그래프 검색
                          ↓
                   관련 엔티티 + 관계
                          ↓
                   벡터 검색 (엔티티 기반)
                          ↓
                   통합 컨텍스트 → LLM
\`\`\`

### 3. Hybrid GraphRAG

두 검색을 병렬로 수행하고 결과를 융합합니다.

\`\`\`
질문 → [벡터 검색] ──┐
   └→ [그래프 검색] ─┴→ 결과 융합 → Re-ranking → LLM
\`\`\`

### 4. Microsoft GraphRAG

문서로부터 Knowledge Graph를 자동 구축하는 접근법입니다.

\`\`\`
Documents → Entity Extraction → Graph Construction
                                      ↓
                              Community Detection
                                      ↓
                              Community Summaries
                                      ↓
Query → Local Search (엔티티 기반)
    └→ Global Search (커뮤니티 기반)
\`\`\`

### 아키텍처 선택 가이드

| 패턴 | 적합한 상황 | 복잡도 |
|------|------------|--------|
| Naive | 기존 RAG에 그래프 추가 | 낮음 |
| Graph-First | 명확한 엔티티 중심 질문 | 중간 |
| Hybrid | 범용 Q&A | 높음 |
| MS GraphRAG | 대규모 문서 분석 | 매우 높음 |
`,
    keyPoints: [
      'Naive, Graph-First, Hybrid, MS GraphRAG 4가지 주요 패턴',
      'Naive는 기존 RAG에 그래프 정보 추가',
      'Graph-First는 엔티티 중심 검색 우선',
      'MS GraphRAG는 커뮤니티 기반 글로벌 검색 지원',
    ],
    practiceGoal: '상황에 맞는 GraphRAG 아키텍처 패턴 선택 능력',
  }
)

// Task 3: 벡터 vs 그래프 검색
const task3 = createReadingTask(
  'w6d1-vector-vs-graph',
  '벡터 검색 vs 그래프 검색 비교',
  35,
  {
    introduction: `
## 벡터 검색 vs 그래프 검색

### 벡터 검색의 특징

**장점**:
- 의미적 유사성 포착
- 비정형 텍스트에 강함
- 확장성 좋음 (ANN 알고리즘)

**단점**:
- 구조적 관계 무시
- 정확한 키워드 매칭 약함
- 설명 가능성 부족

\`\`\`python
# 벡터 검색 예시
query_embedding = embed("삼성전자의 경쟁사는?")
results = vector_db.similarity_search(query_embedding, k=5)
# → 관련 문서 청크 반환 (관계 정보 없음)
\`\`\`

### 그래프 검색의 특징

**장점**:
- 명시적 관계 탐색
- 멀티홉 추론 가능
- 경로 추적 가능 (설명 가능성)

**단점**:
- 스키마 설계 필요
- 자연어 쿼리 변환 필요
- 비정형 텍스트 처리 어려움

\`\`\`cypher
// 그래프 검색 예시
MATCH (c:Company {name: '삼성전자'})-[:COMPETES_WITH]->(competitor)
RETURN competitor.name, competitor.industry
// → 명시적 경쟁사 관계 반환
\`\`\`

### 하이브리드 검색의 강점

\`\`\`python
# 하이브리드 검색 예시
def hybrid_search(question):
    # 1. 엔티티 추출
    entities = extract_entities(question)  # ['삼성전자']

    # 2. 그래프 검색: 관계 정보
    graph_context = neo4j.query('''
        MATCH (c:Company {name: $name})-[r]->(related)
        RETURN type(r) as relation, related.name
    ''', name=entities[0])

    # 3. 벡터 검색: 관련 문서
    vector_results = vector_db.search(question, k=3)

    # 4. 컨텍스트 통합
    return merge_context(graph_context, vector_results)
\`\`\`

### 검색 방식 선택 기준

| 질문 유형 | 추천 방식 |
|----------|----------|
| "X와 Y의 관계는?" | 그래프 우선 |
| "X에 대해 설명해줘" | 벡터 우선 |
| "X의 경쟁사들의 최근 동향은?" | 하이브리드 |
| "전체 시장 트렌드는?" | MS GraphRAG |
`,
    keyPoints: [
      '벡터 검색: 의미적 유사성, 비정형 텍스트에 강함',
      '그래프 검색: 명시적 관계, 멀티홉 추론 가능',
      '하이브리드: 두 방식의 장점 결합',
      '질문 유형에 따라 적절한 검색 방식 선택',
    ],
    practiceGoal: '벡터와 그래프 검색의 차이점과 적절한 활용 시점 이해',
  }
)

// Task 4: 엔티티 추출 기법
const task4 = createCodeTask(
  'w6d1-entity-extraction',
  '실습: LLM 기반 엔티티 추출',
  45,
  {
    introduction: `
## LLM 기반 엔티티 추출

GraphRAG에서 질문으로부터 엔티티를 추출하는 것은 핵심 단계입니다.

### 엔티티 추출 방법

1. **규칙 기반**: NER 모델 (spaCy, Flair)
2. **LLM 기반**: GPT-4, Claude로 엔티티 추출
3. **하이브리드**: 규칙 + LLM 결합

### LLM 프롬프트 설계

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# 엔티티 추출 프롬프트
entity_prompt = ChatPromptTemplate.from_messages([
    ("system", """당신은 텍스트에서 엔티티를 추출하는 전문가입니다.
다음 유형의 엔티티를 추출하세요:
- Person: 인물
- Company: 기업
- Product: 제품
- Technology: 기술
- Location: 장소

JSON 형식으로 응답하세요:
{{"entities": [{{"name": "엔티티명", "type": "유형"}}]}}"""),
    ("human", "{question}")
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
chain = entity_prompt | llm

# 실행
result = chain.invoke({"question": "삼성전자의 이재용 회장이 NVIDIA의 젠슨 황과 만났다"})
# → {"entities": [
#      {"name": "삼성전자", "type": "Company"},
#      {"name": "이재용", "type": "Person"},
#      {"name": "NVIDIA", "type": "Company"},
#      {"name": "젠슨 황", "type": "Person"}
#    ]}
\`\`\`

### 엔티티 정규화

추출된 엔티티를 Knowledge Graph의 엔티티와 매칭합니다.

\`\`\`python
def normalize_entity(extracted_name, kg_entities):
    """추출된 엔티티를 KG 엔티티와 매칭"""
    # 1. 정확히 일치
    if extracted_name in kg_entities:
        return extracted_name

    # 2. 별칭 매칭
    for entity, aliases in kg_entities.items():
        if extracted_name.lower() in [a.lower() for a in aliases]:
            return entity

    # 3. 유사도 기반 매칭 (Fuzzy matching)
    from rapidfuzz import fuzz
    best_match = max(kg_entities.keys(),
                     key=lambda e: fuzz.ratio(extracted_name.lower(), e.lower()))
    if fuzz.ratio(extracted_name.lower(), best_match.lower()) > 80:
        return best_match

    return None  # 매칭 실패
\`\`\`
`,
    keyPoints: [
      'LLM으로 질문에서 엔티티(Person, Company, Product 등) 추출',
      '구조화된 JSON 출력을 위한 프롬프트 설계',
      '엔티티 정규화로 KG 노드와 매칭',
      'Fuzzy matching으로 유사한 엔티티 연결',
    ],
    practiceGoal: 'LLM 기반 엔티티 추출 및 정규화 구현',
    codeExample: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import json

# 엔티티 추출 프롬프트
entity_prompt = ChatPromptTemplate.from_messages([
    ("system", """텍스트에서 엔티티를 추출하세요.
유형: Person, Company, Product, Technology, Location
JSON 형식: {{"entities": [{{"name": "...", "type": "..."}}]}}"""),
    ("human", "{question}")
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

def extract_entities(question: str) -> list:
    """질문에서 엔티티 추출"""
    chain = entity_prompt | llm
    result = chain.invoke({"question": question})
    return json.loads(result.content)["entities"]

# 테스트
question = "테슬라의 일론 머스크가 새로운 AI 칩을 발표했다"
entities = extract_entities(question)
print(entities)
# [{"name": "테슬라", "type": "Company"},
#  {"name": "일론 머스크", "type": "Person"}, ...]`,
  }
)

// Task 5: 그래프 컨텍스트 생성
const task5 = createCodeTask(
  'w6d1-graph-context',
  '실습: 그래프 컨텍스트 생성',
  50,
  {
    introduction: `
## 그래프 컨텍스트 생성

추출된 엔티티로부터 Knowledge Graph를 탐색하여 컨텍스트를 생성합니다.

### 1-Hop 이웃 탐색

\`\`\`python
from neo4j import GraphDatabase

def get_graph_context(entity_name: str, driver) -> str:
    """엔티티의 1-hop 이웃 정보를 컨텍스트로 변환"""

    query = '''
    MATCH (e {name: $name})-[r]-(neighbor)
    RETURN e.name as entity,
           type(r) as relation,
           neighbor.name as neighbor_name,
           labels(neighbor)[0] as neighbor_type
    LIMIT 20
    '''

    with driver.session() as session:
        results = session.run(query, name=entity_name)

        context_parts = []
        for record in results:
            context_parts.append(
                f"{record['entity']} --[{record['relation']}]--> "
                f"{record['neighbor_name']} ({record['neighbor_type']})"
            )

        return "\\n".join(context_parts)

# 사용 예시
context = get_graph_context("삼성전자", driver)
# 삼성전자 --[COMPETES_WITH]--> SK하이닉스 (Company)
# 삼성전자 --[SUPPLIES_TO]--> Apple (Company)
# 삼성전자 --[HAS_CEO]--> 이재용 (Person)
\`\`\`

### 멀티홉 탐색

\`\`\`python
def get_multihop_context(entity_name: str, driver, hops: int = 2) -> str:
    """멀티홉 경로 탐색"""

    query = f'''
    MATCH path = (e {{name: $name}})-[*1..{hops}]-(connected)
    WHERE e <> connected
    WITH path, connected,
         [r IN relationships(path) | type(r)] as relations,
         [n IN nodes(path) | n.name] as node_names
    RETURN DISTINCT
           node_names,
           relations
    LIMIT 30
    '''

    with driver.session() as session:
        results = session.run(query, name=entity_name)

        paths = []
        for record in results:
            path_str = " -> ".join([
                f"{record['node_names'][i]} --[{record['relations'][i]}]-->"
                for i in range(len(record['relations']))
            ]) + f" {record['node_names'][-1]}"
            paths.append(path_str)

        return "\\n".join(paths)
\`\`\`

### 컨텍스트 포맷팅

\`\`\`python
def format_graph_context(graph_data: list) -> str:
    """LLM에 전달할 컨텍스트 포맷팅"""

    context = "=== Knowledge Graph 정보 ===\\n\\n"

    # 엔티티 정보
    context += "## 관련 엔티티 관계:\\n"
    for item in graph_data:
        context += f"- {item['source']} → [{item['relation']}] → {item['target']}\\n"

    return context
\`\`\`
`,
    keyPoints: [
      '1-hop 이웃 탐색으로 직접 연결된 정보 수집',
      '멀티홉 탐색으로 간접 관계까지 파악',
      'LLM이 이해하기 쉬운 텍스트 포맷으로 변환',
      'LIMIT으로 컨텍스트 크기 제한',
    ],
    practiceGoal: 'Neo4j에서 엔티티 기반 그래프 컨텍스트 생성',
    codeExample: `from neo4j import GraphDatabase

def get_graph_context(entity_name: str, uri: str, auth: tuple) -> str:
    """엔티티의 관계 정보를 컨텍스트로 변환"""
    driver = GraphDatabase.driver(uri, auth=auth)

    query = '''
    MATCH (e {name: $name})-[r]-(neighbor)
    RETURN e.name as entity,
           type(r) as relation,
           neighbor.name as neighbor_name
    LIMIT 15
    '''

    with driver.session() as session:
        results = session.run(query, name=entity_name)
        context = []
        for record in results:
            context.append(
                f"{record['entity']} -[{record['relation']}]-> {record['neighbor_name']}"
            )

    driver.close()
    return "\\n".join(context)

# 테스트
context = get_graph_context(
    "삼성전자",
    "bolt://localhost:7687",
    ("neo4j", "password")
)
print(context)`,
  }
)

// Task 6: 퀴즈
const task6 = createQuizTask(
  'w6d1-quiz',
  'Day 1 복습 퀴즈',
  20,
  {
    questions: [
      {
        id: 'q1',
        question: 'GraphRAG에서 기존 RAG의 가장 큰 한계는?',
        options: [
          '속도가 느림',
          '엔티티 간 관계 정보 부재',
          '메모리 사용량이 큼',
          '한국어 지원 부족',
        ],
        correctAnswer: 1,
        explanation: '기존 RAG는 청크 단위 벡터 검색으로 엔티티 간 관계 정보를 파악하기 어렵습니다.',
      },
      {
        id: 'q2',
        question: 'Microsoft GraphRAG의 핵심 특징은?',
        options: [
          '실시간 스트리밍',
          '커뮤니티 기반 글로벌 검색',
          '무료 오픈소스',
          '모바일 최적화',
        ],
        correctAnswer: 1,
        explanation: 'MS GraphRAG는 커뮤니티 탐지와 요약을 통해 글로벌 검색을 지원합니다.',
      },
      {
        id: 'q3',
        question: '"A와 B의 관계는?" 질문에 가장 적합한 검색 방식은?',
        options: [
          '벡터 검색 우선',
          '그래프 검색 우선',
          '키워드 검색',
          '풀텍스트 검색',
        ],
        correctAnswer: 1,
        explanation: '관계 질문은 그래프에서 명시적으로 표현되므로 그래프 검색이 적합합니다.',
      },
      {
        id: 'q4',
        question: '엔티티 정규화의 목적은?',
        options: [
          '엔티티 삭제',
          '추출된 엔티티를 KG 노드와 매칭',
          '엔티티 암호화',
          '엔티티 번역',
        ],
        correctAnswer: 1,
        explanation: '엔티티 정규화는 추출된 텍스트를 Knowledge Graph의 실제 노드와 연결합니다.',
      },
    ],
    keyPoints: [
      'GraphRAG의 핵심 개념 이해',
      '아키텍처 패턴별 특징 파악',
      '검색 방식 선택 기준 습득',
    ],
    practiceGoal: 'Day 1 학습 내용 복습 및 점검',
  }
)

// Day 1 Export
export const day1GraphragConcepts: Day = {
  slug: 'graphrag-concepts',
  title: 'GraphRAG 개념 및 아키텍처',
  totalDuration: 220,
  tasks: [task1, task2, task3, task4, task5, task6],
}
