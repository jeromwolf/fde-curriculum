// Week 6 Day 2: LangChain Neo4j 통합

import type { Day } from './types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
} from './types'

// Task 1: LangChain Neo4j 소개
const task1 = createVideoTask(
  'w6d2-langchain-neo4j-intro',
  'LangChain의 Neo4j 통합 기능',
  25,
  {
    introduction: `
## LangChain Neo4j 통합

LangChain은 Neo4j와의 강력한 통합 기능을 제공합니다.

### 핵심 컴포넌트

| 컴포넌트 | 역할 | 용도 |
|---------|------|------|
| **Neo4jGraph** | DB 연결 및 스키마 추출 | 기본 연결 |
| **GraphCypherQAChain** | 자연어 → Cypher 변환 | Text2Cypher |
| **Neo4jVector** | 벡터 인덱스 | 하이브리드 검색 |
| **Neo4jChatMessageHistory** | 대화 기록 저장 | 메모리 |

### 설치

\`\`\`bash
pip install langchain langchain-community langchain-openai neo4j
\`\`\`

### 기본 연결

\`\`\`python
from langchain_community.graphs import Neo4jGraph

graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password"
)

# 스키마 자동 추출
print(graph.schema)
# Node properties:
# - Company: name, industry, founded
# - Person: name, role
# Relationships:
# - WORKS_AT: since
# - COMPETES_WITH: (no properties)
\`\`\`

### 스키마의 중요성

LLM이 정확한 Cypher를 생성하려면 스키마를 알아야 합니다:
- 어떤 노드 레이블이 있는지
- 어떤 속성이 있는지
- 어떤 관계 타입이 있는지
`,
    keyPoints: [
      'LangChain은 Neo4jGraph, GraphCypherQAChain 등 제공',
      'Neo4jGraph로 자동 스키마 추출',
      'LLM이 Cypher 생성하려면 스키마 정보 필수',
    ],
    practiceGoal: 'LangChain Neo4j 통합 컴포넌트 이해',
  }
)

// Task 2: Neo4jGraph 활용
const task2 = createCodeTask(
  'w6d2-neo4j-graph',
  '실습: Neo4jGraph 설정 및 스키마 추출',
  40,
  {
    introduction: `
## Neo4jGraph 상세 활용

### 연결 설정

\`\`\`python
from langchain_community.graphs import Neo4jGraph
import os

# 환경 변수로 설정 (권장)
os.environ["NEO4J_URI"] = "bolt://localhost:7687"
os.environ["NEO4J_USERNAME"] = "neo4j"
os.environ["NEO4J_PASSWORD"] = "password"

# 자동으로 환경 변수 사용
graph = Neo4jGraph()

# 또는 직접 지정
graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
    database="neo4j"  # 기본 DB
)
\`\`\`

### 스키마 확인

\`\`\`python
# 전체 스키마 출력
print(graph.schema)

# 스키마 새로고침 (DB 변경 후)
graph.refresh_schema()
\`\`\`

### 직접 쿼리 실행

\`\`\`python
# Cypher 쿼리 직접 실행
results = graph.query('''
    MATCH (c:Company)-[:COMPETES_WITH]->(competitor)
    RETURN c.name as company, competitor.name as competitor
    LIMIT 5
''')

for row in results:
    print(f"{row['company']} vs {row['competitor']}")
\`\`\`

### 샘플 데이터 생성

\`\`\`python
# 테스트용 데이터 삽입
graph.query('''
    MERGE (samsung:Company {name: '삼성전자', industry: '반도체'})
    MERGE (sk:Company {name: 'SK하이닉스', industry: '반도체'})
    MERGE (apple:Company {name: 'Apple', industry: '소비자전자'})
    MERGE (samsung)-[:COMPETES_WITH]->(sk)
    MERGE (samsung)-[:SUPPLIES_TO]->(apple)
''')
\`\`\`
`,
    keyPoints: [
      '환경 변수 또는 직접 파라미터로 연결 설정',
      'graph.schema로 스키마 자동 추출',
      'graph.query()로 직접 Cypher 실행 가능',
      'refresh_schema()로 스키마 갱신',
    ],
    practiceGoal: 'Neo4jGraph 연결 및 기본 사용법 실습',
    codeExample: `from langchain_community.graphs import Neo4jGraph

# Neo4j 연결
graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password"
)

# 스키마 확인
print("=== Schema ===")
print(graph.schema)

# 샘플 데이터 생성
graph.query('''
    MERGE (a:Company {name: '삼성전자'})
    MERGE (b:Company {name: 'SK하이닉스'})
    MERGE (a)-[:COMPETES_WITH]->(b)
''')

# 쿼리 실행
results = graph.query('''
    MATCH (c:Company)
    RETURN c.name as name
    LIMIT 5
''')
print("\\n=== Companies ===")
for r in results:
    print(r['name'])`,
  }
)

// Task 3: GraphCypherQAChain
const task3 = createCodeTask(
  'w6d2-cypher-qa-chain',
  '실습: GraphCypherQAChain 구현',
  50,
  {
    introduction: `
## GraphCypherQAChain

자연어 질문을 Cypher로 변환하고 결과를 자연어로 응답합니다.

### 기본 사용법

\`\`\`python
from langchain_community.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain
from langchain_openai import ChatOpenAI

# 연결
graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password"
)

# LLM 설정
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Chain 생성
chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph,
    verbose=True,  # 생성된 Cypher 출력
    return_intermediate_steps=True  # 중간 단계 반환
)

# 질문하기
result = chain.invoke({"query": "삼성전자의 경쟁사는 누구인가요?"})
print(result['result'])
\`\`\`

### 커스텀 프롬프트

\`\`\`python
from langchain_core.prompts import PromptTemplate

CYPHER_GENERATION_TEMPLATE = '''
당신은 Neo4j Cypher 쿼리 전문가입니다.
주어진 스키마를 기반으로 질문에 답하는 Cypher 쿼리를 생성하세요.

스키마:
{schema}

규칙:
1. MATCH로 시작하는 읽기 전용 쿼리만 생성
2. LIMIT 10 이하로 제한
3. 존재하지 않는 레이블이나 관계 사용 금지

질문: {question}

Cypher 쿼리:
'''

cypher_prompt = PromptTemplate(
    template=CYPHER_GENERATION_TEMPLATE,
    input_variables=["schema", "question"]
)

chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph,
    cypher_prompt=cypher_prompt,
    verbose=True
)
\`\`\`

### 쿼리 검증

\`\`\`python
def validate_cypher(query: str) -> bool:
    """위험한 쿼리 차단"""
    forbidden = ['DELETE', 'CREATE', 'SET', 'REMOVE', 'DROP', 'MERGE']
    query_upper = query.upper()
    return not any(word in query_upper for word in forbidden)

# Chain에 검증 추가
chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph,
    validate_cypher=True,  # 기본 검증 활성화
    verbose=True
)
\`\`\`
`,
    keyPoints: [
      'GraphCypherQAChain: 자연어 → Cypher → 결과 → 자연어 응답',
      '커스텀 프롬프트로 도메인 특화 가능',
      'validate_cypher로 위험한 쿼리 차단',
      'verbose=True로 생성된 Cypher 확인',
    ],
    practiceGoal: 'GraphCypherQAChain 구현 및 커스터마이징',
    codeExample: `from langchain_community.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain
from langchain_openai import ChatOpenAI

# 연결
graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password"
)

# LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Chain 생성
chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph,
    verbose=True,
    return_intermediate_steps=True
)

# 질문
result = chain.invoke({"query": "삼성전자와 경쟁하는 회사들은?"})
print("Answer:", result['result'])
print("Cypher:", result['intermediate_steps'][0]['query'])`,
  }
)

// Task 4: Neo4j 벡터 인덱스
const task4 = createCodeTask(
  'w6d2-neo4j-vector',
  '실습: Neo4j 벡터 인덱스 활용',
  45,
  {
    introduction: `
## Neo4j 벡터 인덱스

Neo4j 5.11+에서는 네이티브 벡터 인덱스를 지원합니다.

### 벡터 인덱스 생성

\`\`\`cypher
// Cypher로 벡터 인덱스 생성
CREATE VECTOR INDEX document_embeddings IF NOT EXISTS
FOR (d:Document)
ON d.embedding
OPTIONS {
    indexConfig: {
        \`vector.dimensions\`: 1536,
        \`vector.similarity_function\`: 'cosine'
    }
}
\`\`\`

### LangChain Neo4jVector

\`\`\`python
from langchain_community.vectorstores import Neo4jVector
from langchain_openai import OpenAIEmbeddings

# 임베딩 모델
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# 벡터 스토어 생성 (기존 데이터 연결)
vector_store = Neo4jVector.from_existing_graph(
    embedding=embeddings,
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
    index_name="document_embeddings",
    node_label="Document",
    text_node_properties=["content"],  # 임베딩할 속성
    embedding_node_property="embedding"  # 임베딩 저장 속성
)

# 유사도 검색
results = vector_store.similarity_search(
    "반도체 시장 전망",
    k=3
)
for doc in results:
    print(doc.page_content)
\`\`\`

### 하이브리드 검색 (벡터 + 키워드)

\`\`\`python
# 하이브리드 검색 지원
results = vector_store.similarity_search(
    "삼성전자 반도체",
    k=5,
    search_type="hybrid"  # 벡터 + 전문검색
)
\`\`\`

### 메타데이터 필터링

\`\`\`python
# 필터와 함께 검색
results = vector_store.similarity_search(
    "AI 기술",
    k=3,
    filter={"category": "technology"}
)
\`\`\`
`,
    keyPoints: [
      'Neo4j 5.11+에서 네이티브 벡터 인덱스 지원',
      'LangChain Neo4jVector로 쉽게 연동',
      '하이브리드 검색 (벡터 + 키워드) 가능',
      '메타데이터 필터링으로 검색 범위 제한',
    ],
    practiceGoal: 'Neo4j 벡터 인덱스와 LangChain 연동',
    codeExample: `from langchain_community.vectorstores import Neo4jVector
from langchain_openai import OpenAIEmbeddings

# 임베딩 모델
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# 문서로 벡터 스토어 생성
texts = [
    "삼성전자는 반도체 분야 글로벌 1위 기업이다",
    "SK하이닉스는 메모리 반도체 전문 기업이다",
    "NVIDIA는 GPU와 AI 칩 분야를 선도한다"
]

vector_store = Neo4jVector.from_texts(
    texts=texts,
    embedding=embeddings,
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
    index_name="company_docs"
)

# 검색
results = vector_store.similarity_search("반도체 기업", k=2)
for doc in results:
    print(doc.page_content)`,
  }
)

// Task 5: 하이브리드 GraphRAG 구현
const task5 = createCodeTask(
  'w6d2-hybrid-graphrag',
  '실습: 하이브리드 GraphRAG 파이프라인',
  50,
  {
    introduction: `
## 하이브리드 GraphRAG 파이프라인

그래프 검색과 벡터 검색을 결합한 파이프라인을 구현합니다.

### 전체 아키텍처

\`\`\`
질문
  ↓
[엔티티 추출] ──→ [그래프 검색]
  ↓                    ↓
[벡터 검색]       그래프 컨텍스트
  ↓                    ↓
벡터 컨텍스트    ←──┘
  ↓
[컨텍스트 통합]
  ↓
[LLM 응답 생성]
\`\`\`

### 구현 코드

\`\`\`python
from langchain_community.graphs import Neo4jGraph
from langchain_community.vectorstores import Neo4jVector
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

class HybridGraphRAG:
    def __init__(self, neo4j_url, neo4j_user, neo4j_password):
        # 그래프 연결
        self.graph = Neo4jGraph(
            url=neo4j_url,
            username=neo4j_user,
            password=neo4j_password
        )

        # 벡터 스토어
        self.vector_store = Neo4jVector.from_existing_index(
            embedding=OpenAIEmbeddings(),
            url=neo4j_url,
            username=neo4j_user,
            password=neo4j_password,
            index_name="document_embeddings"
        )

        # LLM
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    def extract_entities(self, question: str) -> list:
        """질문에서 엔티티 추출"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", "텍스트에서 기업명, 인물명을 추출하세요. 쉼표로 구분해서 반환하세요."),
            ("human", "{question}")
        ])
        chain = prompt | self.llm | StrOutputParser()
        result = chain.invoke({"question": question})
        return [e.strip() for e in result.split(",") if e.strip()]

    def get_graph_context(self, entities: list) -> str:
        """엔티티 기반 그래프 컨텍스트"""
        context_parts = []
        for entity in entities:
            results = self.graph.query('''
                MATCH (e {name: $name})-[r]-(n)
                RETURN e.name, type(r), n.name
                LIMIT 10
            ''', params={"name": entity})

            for r in results:
                context_parts.append(f"{r['e.name']} -[{r['type(r)']}]-> {r['n.name']}")

        return "\\n".join(context_parts)

    def get_vector_context(self, question: str) -> str:
        """벡터 검색 컨텍스트"""
        docs = self.vector_store.similarity_search(question, k=3)
        return "\\n".join([doc.page_content for doc in docs])

    def answer(self, question: str) -> str:
        """하이브리드 검색으로 답변 생성"""
        # 1. 엔티티 추출
        entities = self.extract_entities(question)

        # 2. 그래프 컨텍스트
        graph_ctx = self.get_graph_context(entities) if entities else ""

        # 3. 벡터 컨텍스트
        vector_ctx = self.get_vector_context(question)

        # 4. 답변 생성
        prompt = ChatPromptTemplate.from_messages([
            ("system", '''다음 정보를 바탕으로 질문에 답하세요.

그래프 관계:
{graph_context}

관련 문서:
{vector_context}
'''),
            ("human", "{question}")
        ])

        chain = prompt | self.llm | StrOutputParser()
        return chain.invoke({
            "graph_context": graph_ctx,
            "vector_context": vector_ctx,
            "question": question
        })
\`\`\`
`,
    keyPoints: [
      '엔티티 추출 → 그래프 검색 → 벡터 검색 → 통합 → 응답',
      'Neo4jGraph와 Neo4jVector 동시 활용',
      '그래프 컨텍스트: 관계 정보 제공',
      '벡터 컨텍스트: 관련 문서 제공',
    ],
    practiceGoal: '하이브리드 GraphRAG 파이프라인 구현',
    codeExample: `# HybridGraphRAG 사용 예시
rag = HybridGraphRAG(
    neo4j_url="bolt://localhost:7687",
    neo4j_user="neo4j",
    neo4j_password="password"
)

# 질문 응답
answer = rag.answer("삼성전자의 주요 경쟁사와 그들의 특징은?")
print(answer)

# 내부 동작:
# 1. 엔티티 추출: ["삼성전자"]
# 2. 그래프 검색: 삼성전자의 COMPETES_WITH 관계
# 3. 벡터 검색: "삼성전자 경쟁사" 유사 문서
# 4. 통합 컨텍스트로 GPT 응답`,
  }
)

// Task 6: 퀴즈
const task6 = createQuizTask(
  'w6d2-quiz',
  'Day 2 복습 퀴즈',
  20,
  {
    questions: [
      {
        id: 'q1',
        question: 'LangChain에서 Neo4j 스키마를 자동으로 추출하는 컴포넌트는?',
        options: [
          'Neo4jVector',
          'Neo4jGraph',
          'GraphCypherQAChain',
          'Neo4jChatHistory',
        ],
        correctAnswer: 1,
        explanation: 'Neo4jGraph는 연결 시 자동으로 노드, 관계, 속성 스키마를 추출합니다.',
      },
      {
        id: 'q2',
        question: 'GraphCypherQAChain에서 validate_cypher의 역할은?',
        options: [
          '쿼리 성능 최적화',
          '위험한 쿼리 (DELETE 등) 차단',
          '결과 캐싱',
          '병렬 실행',
        ],
        correctAnswer: 1,
        explanation: 'validate_cypher는 DELETE, CREATE 등 데이터 수정 쿼리를 차단합니다.',
      },
      {
        id: 'q3',
        question: 'Neo4j 벡터 인덱스에서 지원하는 유사도 함수가 아닌 것은?',
        options: [
          'cosine',
          'euclidean',
          'manhattan',
          'dot product',
        ],
        correctAnswer: 2,
        explanation: 'Neo4j는 cosine, euclidean 유사도를 지원합니다. manhattan은 지원하지 않습니다.',
      },
      {
        id: 'q4',
        question: '하이브리드 GraphRAG에서 그래프 검색의 주요 역할은?',
        options: [
          '문서 내용 검색',
          '엔티티 간 관계 정보 제공',
          '이미지 분석',
          '음성 인식',
        ],
        correctAnswer: 1,
        explanation: '그래프 검색은 엔티티 간 명시적 관계 정보를 제공합니다.',
      },
    ],
    keyPoints: [
      'LangChain Neo4j 컴포넌트 역할 이해',
      '쿼리 검증의 중요성',
      '하이브리드 검색의 구성 요소',
    ],
    practiceGoal: 'Day 2 학습 내용 복습',
  }
)

// Day 2 Export
export const day2LangchainNeo4j: Day = {
  slug: 'langchain-neo4j',
  title: 'LangChain Neo4j 통합',
  totalDuration: 230,
  tasks: [task1, task2, task3, task4, task5, task6],
}
