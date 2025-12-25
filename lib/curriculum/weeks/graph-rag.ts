// Week: GraphRAG (Phase 3, Week 6)
import type { Week } from '../types'

export const graphRagWeek: Week = {
  slug: 'graph-rag',
  week: 6,
  phase: 3,
  month: 6,
  access: 'core',
  title: 'GraphRAG',
  topics: ['Knowledge Graph + RAG 통합', '하이브리드 검색', '그래프 기반 컨텍스트', 'Microsoft GraphRAG'],
  practice: 'Knowledge Graph 기반 Q&A 시스템 구축',
  totalDuration: 720,
  days: [
    {
      slug: 'graphrag-concepts',
      title: 'GraphRAG 개념',
      totalDuration: 150,
      tasks: [
        {
          id: 'graphrag-intro-video',
          type: 'video',
          title: 'GraphRAG: 왜 그래프가 필요한가?',
          duration: 30,
          content: {
            objectives: [
              'GraphRAG의 필요성을 이해한다',
              '기존 RAG의 한계를 파악한다',
              'Graph 기반 컨텍스트의 장점을 학습한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=graphrag-intro-placeholder',
            transcript: `
## GraphRAG: Knowledge Graph + RAG

### 기존 RAG의 한계

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

### 예시: 일반 RAG vs GraphRAG

**질문**: "삼성전자의 주요 경쟁사와 그들의 최근 동향은?"

**일반 RAG**:
- "삼성전자" 관련 청크 검색
- 경쟁사 정보가 분산되어 있으면 누락

**GraphRAG**:
1. 엔티티 추출: "삼성전자"
2. 그래프 탐색: \`삼성전자 -[:COMPETES_WITH]-> 경쟁사들\`
3. 경쟁사별 관련 청크 검색
4. 통합 컨텍스트로 종합 답변

### Microsoft GraphRAG

Microsoft Research에서 발표한 GraphRAG 프레임워크:

\`\`\`
Documents
    ↓
[Entity Extraction] → Entities + Relationships
    ↓
[Community Detection] → Topic Clusters
    ↓
[Summary Generation] → Community Summaries
    ↓
[Query] → Local + Global Search
\`\`\`

**핵심 개념**:
- **Local Search**: 특정 엔티티 기반 검색
- **Global Search**: 커뮤니티 요약 기반 검색
- **Community Summaries**: 주제별 요약 사전 생성
            `
          }
        },
        {
          id: 'graphrag-architecture-reading',
          type: 'reading',
          title: 'GraphRAG 아키텍처 패턴',
          duration: 25,
          content: {
            objectives: [
              '다양한 GraphRAG 아키텍처를 비교한다',
              '하이브리드 검색 전략을 이해한다',
              '구현 시 고려사항을 파악한다'
            ],
            markdown: `
## GraphRAG 아키텍처 패턴

### 패턴 1: Graph-First Retrieval

\`\`\`
질문 → 엔티티 추출 → Graph 탐색 → 관련 청크 검색 → LLM
\`\`\`

**장점**: 관계 기반 정확한 검색
**단점**: 엔티티 인식 실패 시 검색 불가

### 패턴 2: Vector-First Retrieval

\`\`\`
질문 → Vector 검색 → 청크에서 엔티티 추출 → Graph 확장 → LLM
\`\`\`

**장점**: 어떤 질문이든 결과 반환
**단점**: 초기 검색 품질에 의존

### 패턴 3: Hybrid Parallel

\`\`\`
질문 ─┬→ Vector 검색 → 청크
      │
      └→ Graph 검색 → 엔티티/관계
                   ↓
           [Fusion/Rerank]
                   ↓
                  LLM
\`\`\`

**장점**: 두 검색의 장점 결합
**단점**: 복잡성 증가

### Neo4j + Vector 통합

Neo4j 5.11+에서 벡터 인덱스 네이티브 지원:

\`\`\`cypher
// 벡터 인덱스 생성
CREATE VECTOR INDEX chunk_embeddings
FOR (c:Chunk)
ON c.embedding
OPTIONS {indexConfig: {
  \`vector.dimensions\`: 1536,
  \`vector.similarity_function\`: 'cosine'
}}

// 하이브리드 검색: 벡터 + 그래프
WITH $query_embedding AS qe
MATCH (c:Chunk)
WHERE c.embedding IS NOT NULL
WITH c, vector.similarity.cosine(c.embedding, qe) AS score
WHERE score > 0.7
MATCH (c)-[:MENTIONS]->(e:Entity)-[r]-(related:Entity)
RETURN c.text, score, collect({entity: e.name, rel: type(r), related: related.name})
ORDER BY score DESC
LIMIT 5
\`\`\`

### LangChain + Neo4j GraphRAG

\`\`\`python
from langchain_community.graphs import Neo4jGraph
from langchain_community.vectorstores import Neo4jVector
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

# Neo4j 연결
graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password"
)

# 벡터 저장소
vectorstore = Neo4jVector.from_existing_index(
    OpenAIEmbeddings(),
    index_name="chunk_embeddings"
)

# Graph + Vector 결합 쿼리
def hybrid_search(question):
    # 1. 엔티티 추출
    entities = extract_entities(question)

    # 2. 그래프 컨텍스트
    graph_context = graph.query('''
        MATCH (e:Entity)-[r]-(related)
        WHERE e.name IN $entities
        RETURN e.name, type(r), related.name
    ''', params={"entities": entities})

    # 3. 벡터 검색
    docs = vectorstore.similarity_search(question, k=3)

    # 4. 컨텍스트 통합
    context = format_context(graph_context, docs)
    return context
\`\`\`

### 구현 시 고려사항

| 고려사항 | 권장 사항 |
|----------|----------|
| **그래프 스키마** | 질문 유형에 맞는 설계 |
| **엔티티 정규화** | 동의어/별칭 처리 |
| **검색 순서** | 질문 유형별 최적 전략 |
| **캐싱** | 자주 사용되는 경로 캐싱 |
| **평가** | 검색 품질 지표 모니터링 |
            `
          }
        }
      ]
    },
    {
      slug: 'graphrag-implementation',
      title: 'GraphRAG 구현',
      totalDuration: 240,
      tasks: [
        {
          id: 'kg-construction-video',
          type: 'video',
          title: 'LLM으로 Knowledge Graph 구축',
          duration: 25,
          content: {
            objectives: [
              'LLM으로 엔티티/관계를 추출한다',
              '추출 결과를 Neo4j에 저장한다',
              '문서와 엔티티를 연결한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=kg-construction-placeholder',
            transcript: `
## LLM 기반 Knowledge Graph 구축

### 파이프라인

\`\`\`
[문서] → [청크 분할] → [LLM 추출] → [엔티티/관계] → [Neo4j 저장]
\`\`\`

### LLM 프롬프트 설계

\`\`\`python
EXTRACTION_PROMPT = """
다음 텍스트에서 엔티티와 관계를 추출하세요.

엔티티 유형: Person, Organization, Product, Location, Event
관계 유형: WORKS_AT, FOUNDED, COMPETES_WITH, LOCATED_IN, PARTNERS_WITH

텍스트:
{text}

JSON 형식으로 출력:
{{
  "entities": [
    {{"name": "...", "type": "...", "description": "..."}}
  ],
  "relationships": [
    {{"source": "...", "target": "...", "type": "...", "description": "..."}}
  ]
}}
"""
\`\`\`

### 구현

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from py2neo import Graph, Node, Relationship
import json

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
graph = Graph("bolt://localhost:7687", auth=("neo4j", "password"))

def extract_kg(text):
    """텍스트에서 KG 추출"""
    prompt = PromptTemplate.from_template(EXTRACTION_PROMPT)
    response = llm.invoke(prompt.format(text=text))

    # JSON 파싱
    result = json.loads(response.content)
    return result

def save_to_neo4j(extraction, chunk_id):
    """추출 결과를 Neo4j에 저장"""
    # 청크 노드
    chunk_node = Node("Chunk", id=chunk_id)
    graph.merge(chunk_node, "Chunk", "id")

    # 엔티티 저장
    for entity in extraction["entities"]:
        entity_node = Node(
            entity["type"],
            name=entity["name"],
            description=entity.get("description", "")
        )
        graph.merge(entity_node, entity["type"], "name")

        # 청크-엔티티 연결
        mentions = Relationship(chunk_node, "MENTIONS", entity_node)
        graph.merge(mentions)

    # 관계 저장
    for rel in extraction["relationships"]:
        query = '''
        MATCH (s {name: $source})
        MATCH (t {name: $target})
        MERGE (s)-[r:''' + rel["type"] + ''']->(t)
        SET r.description = $desc
        '''
        graph.run(query, source=rel["source"],
                  target=rel["target"], desc=rel.get("description", ""))
\`\`\`

### 대용량 처리

\`\`\`python
from tqdm import tqdm
import asyncio

async def process_documents(documents):
    """비동기 대용량 처리"""
    tasks = []
    for i, doc in enumerate(documents):
        task = asyncio.create_task(extract_and_save(doc, f"chunk_{i}"))
        tasks.append(task)

    results = await asyncio.gather(*tasks)
    return results
\`\`\`
            `
          }
        },
        {
          id: 'graphrag-practice-code',
          type: 'code',
          title: 'GraphRAG 시스템 구축 실습',
          duration: 90,
          content: {
            objectives: [
              '문서에서 Knowledge Graph를 구축한다',
              'Graph + Vector 하이브리드 검색을 구현한다',
              'GraphRAG 기반 Q&A를 완성한다'
            ],
            instructions: `
## 실습: GraphRAG 기반 Q&A 시스템

### 시나리오

기술 뉴스 기사를 기반으로 기업/인물 관계를 파악하고
질문에 답하는 GraphRAG 시스템을 구축합니다.

### 준비

\`\`\`bash
pip install langchain langchain-openai py2neo chromadb
\`\`\`

### 샘플 뉴스

\`\`\`python
news_articles = [
    "삼성전자의 이재용 회장이 NVIDIA의 젠슨 황 CEO와 AI 반도체 협력을 논의했다. 양사는 HBM 공급 계약을 확대하기로 합의했다.",
    "SK하이닉스는 TSMC와 첨단 패키징 기술 협력을 발표했다. 이를 통해 차세대 AI 칩 생산을 가속화할 예정이다.",
    "OpenAI의 샘 알트만 CEO가 마이크로소프트와 데이터센터 투자 계획을 공개했다. 양사는 100억 달러 규모의 투자를 진행한다.",
    "테슬라의 일론 머스크가 xAI를 설립하고 ChatGPT의 경쟁자를 개발 중이다. xAI는 X(구 트위터)의 데이터를 활용할 예정이다."
]
\`\`\`

### 과제 1: Knowledge Graph 구축

### 과제 2: 하이브리드 검색 구현

### 과제 3: GraphRAG Q&A 완성
            `,
            starterCode: `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.prompts import PromptTemplate
import chromadb
import json

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

news_articles = [
    "삼성전자의 이재용 회장이 NVIDIA의 젠슨 황 CEO와 AI 반도체 협력을 논의했다. 양사는 HBM 공급 계약을 확대하기로 합의했다.",
    "SK하이닉스는 TSMC와 첨단 패키징 기술 협력을 발표했다. 이를 통해 차세대 AI 칩 생산을 가속화할 예정이다.",
    "OpenAI의 샘 알트만 CEO가 마이크로소프트와 데이터센터 투자 계획을 공개했다. 양사는 100억 달러 규모의 투자를 진행한다.",
    "테슬라의 일론 머스크가 xAI를 설립하고 ChatGPT의 경쟁자를 개발 중이다. xAI는 X(구 트위터)의 데이터를 활용할 예정이다."
]

# 1. KG 추출
EXTRACTION_PROMPT = """
다음 뉴스에서 엔티티와 관계를 추출하세요.

엔티티 유형: Person, Company, Product, Technology
관계 유형: WORKS_AT, PARTNERS_WITH, COMPETES_WITH, FOUNDED, DEVELOPS

뉴스:
{text}

JSON 형식 (한글 유지):
"""

def extract_kg(text):
    """텍스트에서 KG 추출"""
    # TODO: 구현
    pass

# 2. 간단한 그래프 저장소 (dict 기반)
knowledge_graph = {
    "entities": [],
    "relationships": []
}

def add_to_graph(extraction):
    """추출 결과를 그래프에 추가"""
    # TODO: 구현
    pass

# 3. 그래프 검색
def search_graph(entity_name):
    """엔티티 관련 정보 검색"""
    # TODO: 구현
    pass

# 4. GraphRAG Q&A
def graphrag_qa(question):
    """GraphRAG 기반 질의응답"""
    # TODO: 구현
    pass
`,
            solutionCode: `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.prompts import PromptTemplate
import chromadb
import json
import re

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
embeddings = OpenAIEmbeddings()

news_articles = [
    "삼성전자의 이재용 회장이 NVIDIA의 젠슨 황 CEO와 AI 반도체 협력을 논의했다. 양사는 HBM 공급 계약을 확대하기로 합의했다.",
    "SK하이닉스는 TSMC와 첨단 패키징 기술 협력을 발표했다. 이를 통해 차세대 AI 칩 생산을 가속화할 예정이다.",
    "OpenAI의 샘 알트만 CEO가 마이크로소프트와 데이터센터 투자 계획을 공개했다. 양사는 100억 달러 규모의 투자를 진행한다.",
    "테슬라의 일론 머스크가 xAI를 설립하고 ChatGPT의 경쟁자를 개발 중이다. xAI는 X(구 트위터)의 데이터를 활용할 예정이다."
]

# 1. KG 추출
EXTRACTION_PROMPT = """
다음 뉴스에서 엔티티와 관계를 추출하세요.

엔티티 유형: Person, Company, Product, Technology
관계 유형: WORKS_AT, PARTNERS_WITH, COMPETES_WITH, FOUNDED, DEVELOPS

뉴스:
{text}

JSON 형식으로 출력 (한글 이름 유지):
{{"entities": [{{"name": "...", "type": "..."}}], "relationships": [{{"source": "...", "target": "...", "type": "...", "description": "..."}}]}}
"""

def extract_kg(text):
    """텍스트에서 KG 추출"""
    prompt = PromptTemplate.from_template(EXTRACTION_PROMPT)
    response = llm.invoke(prompt.format(text=text))

    # JSON 추출
    content = response.content
    json_match = re.search(r'\\{.*\\}', content, re.DOTALL)
    if json_match:
        return json.loads(json_match.group())
    return {"entities": [], "relationships": []}

# 2. 그래프 저장소
knowledge_graph = {
    "entities": {},  # name -> {type, sources}
    "relationships": []  # {source, target, type, description}
}

def add_to_graph(extraction, source_id):
    """추출 결과를 그래프에 추가"""
    for entity in extraction.get("entities", []):
        name = entity["name"]
        if name not in knowledge_graph["entities"]:
            knowledge_graph["entities"][name] = {
                "type": entity["type"],
                "sources": []
            }
        knowledge_graph["entities"][name]["sources"].append(source_id)

    for rel in extraction.get("relationships", []):
        knowledge_graph["relationships"].append({
            "source": rel["source"],
            "target": rel["target"],
            "type": rel["type"],
            "description": rel.get("description", ""),
            "source_id": source_id
        })

# 3. 벡터 저장소
chroma_client = chromadb.Client()
collection = chroma_client.create_collection("news")

def build_knowledge_base():
    """뉴스에서 KG 구축 및 벡터 저장"""
    for i, article in enumerate(news_articles):
        # KG 추출
        extraction = extract_kg(article)
        add_to_graph(extraction, f"news_{i}")

        # 벡터 저장
        collection.add(
            documents=[article],
            ids=[f"news_{i}"]
        )

    print(f"엔티티: {len(knowledge_graph['entities'])}개")
    print(f"관계: {len(knowledge_graph['relationships'])}개")

# 4. 그래프 검색
def search_graph(entity_name):
    """엔티티 관련 정보 검색"""
    results = {
        "entity": knowledge_graph["entities"].get(entity_name),
        "relationships": []
    }

    for rel in knowledge_graph["relationships"]:
        if rel["source"] == entity_name or rel["target"] == entity_name:
            results["relationships"].append(rel)

    return results

# 5. 하이브리드 검색
def hybrid_search(question, top_k=3):
    """Graph + Vector 하이브리드 검색"""
    # 벡터 검색
    vector_results = collection.query(
        query_texts=[question],
        n_results=top_k
    )

    # 엔티티 추출 (간단한 매칭)
    graph_context = []
    for entity_name in knowledge_graph["entities"]:
        if entity_name in question:
            graph_results = search_graph(entity_name)
            graph_context.append({
                "entity": entity_name,
                "relationships": graph_results["relationships"]
            })

    return {
        "documents": vector_results["documents"][0],
        "graph_context": graph_context
    }

# 6. GraphRAG Q&A
def graphrag_qa(question):
    """GraphRAG 기반 질의응답"""
    search_results = hybrid_search(question)

    # 컨텍스트 구성
    doc_context = "\\n".join(search_results["documents"])

    graph_context = ""
    for ctx in search_results["graph_context"]:
        graph_context += f"\\n[{ctx['entity']}]:\\n"
        for rel in ctx["relationships"]:
            graph_context += f"  - {rel['source']} --{rel['type']}--> {rel['target']}: {rel['description']}\\n"

    prompt = f"""
다음 정보를 바탕으로 질문에 답하세요.

=== 관련 문서 ===
{doc_context}

=== 지식 그래프 ===
{graph_context}

질문: {question}

답변:
"""

    response = llm.invoke(prompt)
    return {
        "answer": response.content,
        "sources": search_results["documents"],
        "graph_context": search_results["graph_context"]
    }

# 실행
print("=== Knowledge Base 구축 ===")
build_knowledge_base()

print("\\n=== 그래프 내용 ===")
for name, info in list(knowledge_graph["entities"].items())[:5]:
    print(f"  {name} ({info['type']})")

print("\\n=== GraphRAG Q&A 테스트 ===")
questions = [
    "삼성전자와 NVIDIA의 협력 내용은?",
    "일론 머스크가 설립한 AI 회사는?",
    "AI 반도체 관련 협력 관계를 설명해줘"
]

for q in questions:
    print(f"\\n질문: {q}")
    result = graphrag_qa(q)
    print(f"답변: {result['answer']}")
    print("-" * 50)
`
          }
        },
        {
          id: 'week6-challenge',
          type: 'challenge',
          title: 'Week 6 도전 과제: 도메인 GraphRAG 시스템',
          duration: 90,
          content: {
            objectives: [
              '특정 도메인의 Knowledge Graph를 구축한다',
              '멀티홉 추론이 가능한 GraphRAG를 구현한다',
              '시스템 성능을 평가한다'
            ],
            requirements: [
              '10개 이상의 문서로 Knowledge Graph 구축',
              '3개 이상의 엔티티 타입, 5개 이상의 관계 타입',
              '2홉 이상의 그래프 탐색 쿼리',
              '벡터 검색과 그래프 검색의 성능 비교'
            ],
            evaluationCriteria: [
              'KG 추출 정확도',
              '답변의 정확성 및 완전성',
              '멀티홉 추론 능력',
              '검색 성능 (응답 시간)'
            ],
            bonusPoints: [
              'Neo4j 실제 연동',
              '커뮤니티 요약 (Microsoft GraphRAG 스타일)',
              'Streamlit UI 구현',
              '평가 데이터셋 및 메트릭 구현'
            ]
          }
        }
      ]
    }
  ]
}
