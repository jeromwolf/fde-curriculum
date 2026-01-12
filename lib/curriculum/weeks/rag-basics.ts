// Week: RAG 기초 (Phase 3, Week 5)
import type { Week } from '../types'

export const ragBasicsWeek: Week = {
  slug: 'rag-basics',
  week: 5,
  phase: 3,
  month: 6,
  access: 'core',
  title: 'RAG 기초',
  topics: ['임베딩', '벡터 검색', 'LangChain 기초', 'RAG 파이프라인'],
  practice: '문서 기반 Q&A 챗봇 구축',
  totalDuration: 720,
  days: [
    {
      slug: 'embeddings-basics',
      title: '임베딩과 벡터 검색',
      totalDuration: 180,
      tasks: [
        {
          id: 'embeddings-video',
          type: 'video',
          title: '텍스트 임베딩이란?',
          duration: 25,
          content: {
            objectives: [
              '임베딩의 개념과 원리를 이해한다',
              '다양한 임베딩 모델을 비교한다',
              '의미적 유사도 검색을 파악한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=embeddings-placeholder',
            transcript: `
## 텍스트 임베딩 (Text Embeddings)

### 임베딩이란?

**텍스트를 고차원 벡터로 변환**하는 것입니다.
의미적으로 유사한 텍스트는 벡터 공간에서 가까이 위치합니다.

\`\`\`
"강아지" → [0.2, 0.8, 0.1, ...]  (1536차원)
"개"     → [0.21, 0.79, 0.12, ...]  가까움!
"고양이" → [0.3, 0.7, 0.2, ...]   중간
"자동차" → [0.9, 0.1, 0.8, ...]   멀음
\`\`\`

### 왜 임베딩인가?

| 기존 검색 | 임베딩 검색 |
|-----------|-------------|
| 키워드 매칭 | 의미 매칭 |
| "강아지" ≠ "개" | "강아지" ≈ "개" |
| 동의어 처리 어려움 | 자동 동의어 이해 |
| 오타에 취약 | 오타에 강인 |

### 주요 임베딩 모델

| 모델 | 차원 | 특징 |
|------|------|------|
| OpenAI text-embedding-3-small | 1536 | 범용, 빠름 |
| OpenAI text-embedding-3-large | 3072 | 고정밀도 |
| Cohere embed-v3 | 1024 | 다국어 지원 |
| Sentence-BERT | 768 | 오픈소스 |
| BGE (BAAI) | 1024 | 한국어 우수 |

### 코사인 유사도

두 벡터 간 각도의 코사인 값:

\`\`\`python
from numpy import dot
from numpy.linalg import norm

def cosine_similarity(a, b):
    return dot(a, b) / (norm(a) * norm(b))

# 결과: -1 (반대) ~ 0 (무관) ~ 1 (동일)
\`\`\`

### Python으로 임베딩 생성

\`\`\`python
from openai import OpenAI

client = OpenAI()

response = client.embeddings.create(
    input="강아지가 공원에서 뛰어놀고 있다",
    model="text-embedding-3-small"
)

embedding = response.data[0].embedding
print(f"차원: {len(embedding)}")  # 1536
\`\`\`

### 배치 임베딩

\`\`\`python
texts = [
    "강아지가 공원에서 뛰어놀고 있다",
    "고양이가 햇볕에 누워 있다",
    "새가 하늘을 날고 있다"
]

response = client.embeddings.create(
    input=texts,
    model="text-embedding-3-small"
)

embeddings = [item.embedding for item in response.data]
\`\`\`
            `,
            simulators: [
              {
                id: 'embedding-visualizer',
                title: 'Embedding Visualizer',
                description: '텍스트 임베딩과 RAG 파이프라인을 시각적으로 체험해보세요',
                url: '/simulators/embedding-visualizer'
              }
            ]
          }
        },
        {
          id: 'vector-search-video',
          type: 'video',
          title: '벡터 데이터베이스와 검색',
          duration: 25,
          content: {
            objectives: [
              '벡터 데이터베이스의 역할을 이해한다',
              '주요 벡터 DB를 비교한다',
              '인덱싱과 검색 성능을 파악한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=vector-db-placeholder',
            transcript: `
## 벡터 데이터베이스

### 왜 벡터 DB인가?

수백만 개의 벡터에서 유사한 벡터를 빠르게 찾아야 합니다.
일반 DB로는 O(n) 비교가 필요하지만, 벡터 DB는 O(log n)에 근사 검색.

### 주요 벡터 데이터베이스

| 벡터 DB | 특징 | 가격 |
|---------|------|------|
| **Pinecone** | 완전 관리형, 쉬운 설정 | 유료 (Free tier 있음) |
| **Weaviate** | 하이브리드 검색, 모듈화 | 오픈소스/클라우드 |
| **Milvus** | 대규모 처리, 분산 | 오픈소스 |
| **Chroma** | 경량, 로컬 개발용 | 오픈소스 |
| **Qdrant** | Rust 기반, 고성능 | 오픈소스/클라우드 |
| **Neo4j Vector** | 그래프 + 벡터 통합 | Neo4j 내장 |

### ANN (Approximate Nearest Neighbor)

정확한 최근접 이웃 대신 **근사 최근접 이웃**을 빠르게 찾습니다.

알고리즘:
- **HNSW**: 계층적 탐색 그래프 (가장 인기)
- **IVF**: 클러스터링 기반
- **LSH**: 해시 기반

### Pinecone 사용 예시

\`\`\`python
from pinecone import Pinecone

pc = Pinecone(api_key="your-api-key")

# 인덱스 생성
pc.create_index(
    name="my-index",
    dimension=1536,
    metric="cosine"
)

index = pc.Index("my-index")

# 벡터 업서트
index.upsert(vectors=[
    {"id": "doc1", "values": embedding1, "metadata": {"text": "..."}},
    {"id": "doc2", "values": embedding2, "metadata": {"text": "..."}}
])

# 검색
results = index.query(
    vector=query_embedding,
    top_k=5,
    include_metadata=True
)
\`\`\`

### Chroma (로컬 개발)

\`\`\`python
import chromadb

client = chromadb.Client()
collection = client.create_collection("my-docs")

# 문서 추가
collection.add(
    documents=["텍스트1", "텍스트2"],
    ids=["doc1", "doc2"]
)

# 검색
results = collection.query(
    query_texts=["검색 쿼리"],
    n_results=5
)
\`\`\`

### Neo4j Vector Index

\`\`\`cypher
// 벡터 인덱스 생성
CREATE VECTOR INDEX doc_embeddings
FOR (d:Document)
ON d.embedding
OPTIONS {indexConfig: {
  \`vector.dimensions\`: 1536,
  \`vector.similarity_function\`: 'cosine'
}}

// 벡터 검색
MATCH (d:Document)
WHERE d.embedding IS NOT NULL
WITH d, vector.similarity.cosine(d.embedding, $query_vector) AS score
WHERE score > 0.7
RETURN d.title, d.content, score
ORDER BY score DESC
LIMIT 5
\`\`\`
            `
          }
        },
        {
          id: 'embeddings-practice-code',
          type: 'code',
          title: '임베딩 생성 및 검색 실습',
          duration: 45,
          content: {
            objectives: [
              'OpenAI API로 임베딩을 생성한다',
              '코사인 유사도로 검색을 구현한다',
              'Chroma로 벡터 저장 및 검색을 수행한다'
            ],
            instructions: `
## 실습: 문서 임베딩 및 검색

### 준비

\`\`\`bash
pip install openai chromadb numpy
\`\`\`

### 샘플 문서

\`\`\`python
documents = [
    "Neo4j는 그래프 데이터베이스입니다. 노드와 관계로 데이터를 저장합니다.",
    "Python은 다양한 분야에서 사용되는 프로그래밍 언어입니다.",
    "Knowledge Graph는 지식을 그래프 구조로 표현합니다.",
    "LangChain은 LLM 애플리케이션을 쉽게 구축할 수 있게 해줍니다.",
    "RAG는 검색 증강 생성으로, 외부 지식을 활용한 생성입니다."
]
\`\`\`

### 과제 1: 임베딩 생성

### 과제 2: 유사도 검색 (Numpy)

### 과제 3: Chroma 벡터 저장 및 검색
            `,
            starterCode: `from openai import OpenAI
import numpy as np
import chromadb

client = OpenAI()

documents = [
    "Neo4j는 그래프 데이터베이스입니다. 노드와 관계로 데이터를 저장합니다.",
    "Python은 다양한 분야에서 사용되는 프로그래밍 언어입니다.",
    "Knowledge Graph는 지식을 그래프 구조로 표현합니다.",
    "LangChain은 LLM 애플리케이션을 쉽게 구축할 수 있게 해줍니다.",
    "RAG는 검색 증강 생성으로, 외부 지식을 활용한 생성입니다."
]

# 1. 임베딩 생성
def get_embeddings(texts):
    """OpenAI API로 임베딩 생성"""
    # TODO: 구현
    pass

# 2. 코사인 유사도 검색
def search_similar(query, documents, embeddings, top_k=3):
    """가장 유사한 문서 top_k개 반환"""
    # TODO: 구현
    pass

# 3. Chroma 벡터 검색
def search_with_chroma(query, collection, top_k=3):
    """Chroma로 검색"""
    # TODO: 구현
    pass
`,
            solutionCode: `from openai import OpenAI
import numpy as np
import chromadb

client = OpenAI()

documents = [
    "Neo4j는 그래프 데이터베이스입니다. 노드와 관계로 데이터를 저장합니다.",
    "Python은 다양한 분야에서 사용되는 프로그래밍 언어입니다.",
    "Knowledge Graph는 지식을 그래프 구조로 표현합니다.",
    "LangChain은 LLM 애플리케이션을 쉽게 구축할 수 있게 해줍니다.",
    "RAG는 검색 증강 생성으로, 외부 지식을 활용한 생성입니다."
]

# 1. 임베딩 생성
def get_embeddings(texts):
    """OpenAI API로 임베딩 생성"""
    response = client.embeddings.create(
        input=texts,
        model="text-embedding-3-small"
    )
    return [item.embedding for item in response.data]

# 2. 코사인 유사도 검색
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def search_similar(query, documents, embeddings, top_k=3):
    """가장 유사한 문서 top_k개 반환"""
    query_embedding = get_embeddings([query])[0]

    similarities = []
    for i, doc_emb in enumerate(embeddings):
        sim = cosine_similarity(query_embedding, doc_emb)
        similarities.append((i, sim, documents[i]))

    # 유사도 내림차순 정렬
    similarities.sort(key=lambda x: x[1], reverse=True)

    return similarities[:top_k]

# 3. Chroma 벡터 검색
def setup_chroma(documents):
    """Chroma 컬렉션 설정"""
    chroma_client = chromadb.Client()

    # 기존 컬렉션 삭제 (있으면)
    try:
        chroma_client.delete_collection("my_docs")
    except:
        pass

    collection = chroma_client.create_collection(
        name="my_docs",
        metadata={"hnsw:space": "cosine"}
    )

    # 문서 추가
    collection.add(
        documents=documents,
        ids=[f"doc_{i}" for i in range(len(documents))]
    )

    return collection

def search_with_chroma(query, collection, top_k=3):
    """Chroma로 검색"""
    results = collection.query(
        query_texts=[query],
        n_results=top_k
    )
    return results

# 실행
print("=== 임베딩 생성 ===")
embeddings = get_embeddings(documents)
print(f"생성된 임베딩 수: {len(embeddings)}")
print(f"임베딩 차원: {len(embeddings[0])}")

print("\\n=== Numpy 유사도 검색 ===")
query = "그래프 데이터베이스란?"
results = search_similar(query, documents, embeddings)
for idx, sim, doc in results:
    print(f"[{sim:.4f}] {doc[:50]}...")

print("\\n=== Chroma 검색 ===")
collection = setup_chroma(documents)
chroma_results = search_with_chroma(query, collection)
for i, doc in enumerate(chroma_results['documents'][0]):
    print(f"[{i+1}] {doc[:50]}...")
`
          }
        }
      ]
    },
    {
      slug: 'langchain-basics',
      title: 'LangChain 기초',
      totalDuration: 180,
      tasks: [
        {
          id: 'langchain-intro-video',
          type: 'video',
          title: 'LangChain 소개',
          duration: 25,
          content: {
            objectives: [
              'LangChain의 핵심 컴포넌트를 이해한다',
              '프롬프트 템플릿과 체인을 학습한다',
              'LLM 통합 방법을 파악한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=langchain-intro-placeholder',
            transcript: `
## LangChain 소개

### LangChain이란?

**LLM 애플리케이션을 쉽게 구축하는 프레임워크**입니다.

\`\`\`
[문서] → [로더] → [분할] → [임베딩] → [벡터DB] → [검색] → [LLM] → [응답]
\`\`\`

### 핵심 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| **Document Loaders** | 다양한 소스에서 문서 로드 |
| **Text Splitters** | 긴 문서를 청크로 분할 |
| **Embeddings** | 텍스트를 벡터로 변환 |
| **Vector Stores** | 벡터 저장 및 검색 |
| **Retrievers** | 관련 문서 검색 |
| **LLMs/Chat Models** | 텍스트 생성 |
| **Chains** | 컴포넌트 조합 |
| **Prompts** | 프롬프트 템플릿 |

### 설치

\`\`\`bash
pip install langchain langchain-openai langchain-community
\`\`\`

### 기본 사용법

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

# 모델 초기화
llm = ChatOpenAI(model="gpt-4o-mini")

# 프롬프트 템플릿
prompt = ChatPromptTemplate.from_messages([
    ("system", "당신은 친절한 AI 어시스턴트입니다."),
    ("human", "{question}")
])

# 체인 생성
chain = prompt | llm

# 실행
response = chain.invoke({"question": "Python이란?"})
print(response.content)
\`\`\`

### Document Loaders

\`\`\`python
from langchain_community.document_loaders import (
    TextLoader,
    PyPDFLoader,
    WebBaseLoader
)

# 텍스트 파일
loader = TextLoader("document.txt")
docs = loader.load()

# PDF
loader = PyPDFLoader("report.pdf")
docs = loader.load()

# 웹 페이지
loader = WebBaseLoader("https://example.com")
docs = loader.load()
\`\`\`

### Text Splitters

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\\n\\n", "\\n", " ", ""]
)

chunks = splitter.split_documents(docs)
\`\`\`
            `
          }
        },
        {
          id: 'rag-pipeline-video',
          type: 'video',
          title: 'RAG 파이프라인 구축',
          duration: 30,
          content: {
            objectives: [
              'RAG의 전체 아키텍처를 이해한다',
              'Retrieval과 Generation을 연결한다',
              'RAG 품질 향상 전략을 학습한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=rag-pipeline-placeholder',
            transcript: `
## RAG (Retrieval-Augmented Generation)

### RAG란?

**외부 지식을 검색하여 LLM 응답을 보강**하는 기법입니다.

\`\`\`
사용자 질문
    ↓
[임베딩]
    ↓
[벡터 검색] → 관련 문서 top-k
    ↓
[프롬프트 구성] = 질문 + 검색된 문서
    ↓
[LLM 생성]
    ↓
응답
\`\`\`

### RAG의 장점

| 장점 | 설명 |
|------|------|
| 최신 정보 | 학습 시점 이후 정보 활용 |
| 도메인 특화 | 전문 문서 기반 답변 |
| 환각 감소 | 근거 기반 응답 |
| 출처 추적 | 답변의 근거 제시 |

### LangChain RAG 구현

\`\`\`python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# 1. 문서 로드 및 분할
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

loader = TextLoader("knowledge_base.txt")
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_documents(documents)

# 2. 벡터 저장소 생성
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(chunks, embeddings)

# 3. Retriever 설정
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}
)

# 4. RAG 체인 생성
llm = ChatOpenAI(model="gpt-4o-mini")

rag_prompt = PromptTemplate.from_template("""
다음 컨텍스트를 바탕으로 질문에 답하세요.
컨텍스트에 없는 내용은 "모르겠습니다"라고 답하세요.

컨텍스트:
{context}

질문: {question}
답변:
""")

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    chain_type_kwargs={"prompt": rag_prompt},
    return_source_documents=True
)

# 5. 실행
result = qa_chain.invoke({"query": "Neo4j란 무엇인가요?"})
print(result["result"])
print("출처:", result["source_documents"])
\`\`\`

### RAG 품질 향상 전략

1. **청크 크기 최적화**: 너무 작으면 맥락 부족, 너무 크면 노이즈
2. **Hybrid Search**: 키워드 + 벡터 검색 조합
3. **Reranking**: 검색 결과 재정렬
4. **Query Transformation**: 질문 재작성
5. **Metadata Filtering**: 메타데이터로 검색 범위 제한
            `,
            simulators: [
              {
                id: 'rag-pipeline',
                title: 'RAG Pipeline 시뮬레이터',
                description: 'RAG 파이프라인의 5단계(청킹, 임베딩, 검색, 컨텍스트 결합, 답변 생성)를 시각적으로 체험해보세요',
                url: '/simulators/rag-pipeline'
              }
            ]
          }
        },
        {
          id: 'rag-practice-code',
          type: 'code',
          title: 'RAG 챗봇 구축 실습',
          duration: 60,
          content: {
            objectives: [
              'LangChain으로 RAG 파이프라인을 구축한다',
              '문서 기반 Q&A 시스템을 구현한다',
              '검색 결과의 출처를 표시한다'
            ],
            instructions: `
## 실습: 문서 기반 Q&A 챗봇

### 시나리오

회사 내부 문서(FAQ, 정책 문서)를 기반으로 질문에 답하는 챗봇을 구축합니다.

### 준비

\`\`\`bash
pip install langchain langchain-openai langchain-community chromadb
\`\`\`

### 샘플 문서

\`\`\`python
company_docs = [
    "휴가 정책: 정규직 직원은 연간 15일의 유급 휴가를 사용할 수 있습니다. 입사 후 1년이 지나면 1일씩 추가됩니다.",
    "재택근무: 주 2일까지 재택근무가 가능합니다. 사전에 팀장 승인이 필요합니다.",
    "경비 처리: 업무 관련 경비는 월 50만원 한도 내에서 법인카드 사용이 가능합니다.",
    "교육 지원: 연간 200만원 한도로 외부 교육비를 지원합니다. HR팀 사전 승인 필요.",
    "보안 정책: 회사 자료는 개인 기기에 저장할 수 없습니다. 모든 업무는 회사 제공 기기에서 수행해야 합니다."
]
\`\`\`

### 과제 1: 문서 벡터화

### 과제 2: RAG 체인 구성

### 과제 3: 대화형 Q&A 구현
            `,
            starterCode: `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter

company_docs = [
    "휴가 정책: 정규직 직원은 연간 15일의 유급 휴가를 사용할 수 있습니다. 입사 후 1년이 지나면 1일씩 추가됩니다.",
    "재택근무: 주 2일까지 재택근무가 가능합니다. 사전에 팀장 승인이 필요합니다.",
    "경비 처리: 업무 관련 경비는 월 50만원 한도 내에서 법인카드 사용이 가능합니다.",
    "교육 지원: 연간 200만원 한도로 외부 교육비를 지원합니다. HR팀 사전 승인 필요.",
    "보안 정책: 회사 자료는 개인 기기에 저장할 수 없습니다. 모든 업무는 회사 제공 기기에서 수행해야 합니다."
]

# 1. 벡터 저장소 생성
def create_vectorstore(docs):
    """문서를 벡터화하여 저장"""
    # TODO: 구현
    pass

# 2. RAG 체인 생성
def create_rag_chain(vectorstore):
    """RAG 체인 구성"""
    # TODO: 구현
    pass

# 3. 대화형 Q&A
def chat_with_docs(chain, question):
    """질문에 대한 답변 생성"""
    # TODO: 구현
    pass
`,
            solutionCode: `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.schema import Document

company_docs = [
    "휴가 정책: 정규직 직원은 연간 15일의 유급 휴가를 사용할 수 있습니다. 입사 후 1년이 지나면 1일씩 추가됩니다.",
    "재택근무: 주 2일까지 재택근무가 가능합니다. 사전에 팀장 승인이 필요합니다.",
    "경비 처리: 업무 관련 경비는 월 50만원 한도 내에서 법인카드 사용이 가능합니다.",
    "교육 지원: 연간 200만원 한도로 외부 교육비를 지원합니다. HR팀 사전 승인 필요.",
    "보안 정책: 회사 자료는 개인 기기에 저장할 수 없습니다. 모든 업무는 회사 제공 기기에서 수행해야 합니다."
]

# 1. 벡터 저장소 생성
def create_vectorstore(docs):
    """문서를 벡터화하여 저장"""
    # Document 객체로 변환
    documents = [Document(page_content=doc) for doc in docs]

    # 임베딩 및 벡터 저장소 생성
    embeddings = OpenAIEmbeddings()
    vectorstore = Chroma.from_documents(
        documents,
        embeddings,
        collection_name="company_policy"
    )
    return vectorstore

# 2. RAG 체인 생성
def create_rag_chain(vectorstore):
    """RAG 체인 구성"""
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 2}
    )

    prompt = PromptTemplate.from_template("""
당신은 회사 정책에 대해 답변하는 HR 어시스턴트입니다.
아래 컨텍스트를 바탕으로 질문에 정확하게 답변하세요.
컨텍스트에 없는 내용은 "해당 정보를 찾을 수 없습니다. HR팀에 문의해주세요."라고 답하세요.

컨텍스트:
{context}

질문: {question}

답변:
""")

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": prompt},
        return_source_documents=True
    )

    return qa_chain

# 3. 대화형 Q&A
def chat_with_docs(chain, question):
    """질문에 대한 답변 생성"""
    result = chain.invoke({"query": question})

    print(f"\\n질문: {question}")
    print(f"답변: {result['result']}")
    print("\\n참조 문서:")
    for i, doc in enumerate(result['source_documents'], 1):
        print(f"  [{i}] {doc.page_content[:50]}...")

    return result

# 실행
print("=== 벡터 저장소 생성 ===")
vectorstore = create_vectorstore(company_docs)
print(f"문서 {len(company_docs)}개 벡터화 완료")

print("\\n=== RAG 체인 생성 ===")
chain = create_rag_chain(vectorstore)
print("RAG 체인 준비 완료")

print("\\n=== Q&A 테스트 ===")
questions = [
    "휴가는 몇 일 사용할 수 있나요?",
    "재택근무 신청은 어떻게 하나요?",
    "교육비 지원 한도가 어떻게 되나요?",
    "점심 식대 지원이 있나요?"  # 없는 정보
]

for q in questions:
    chat_with_docs(chain, q)
    print("-" * 50)
`
          }
        },
        {
          id: 'week5-challenge',
          type: 'challenge',
          title: 'Week 5 도전 과제: 다중 문서 RAG 시스템',
          duration: 60,
          content: {
            objectives: [
              '다양한 형식의 문서를 처리한다',
              '메타데이터 기반 필터링을 구현한다',
              '대화 기록을 유지하는 챗봇을 구축한다'
            ],
            requirements: [
              'PDF, TXT, 웹 페이지 등 3개 이상의 소스 처리',
              '문서 카테고리별 메타데이터 필터링',
              '이전 대화를 기억하는 ConversationalRetrievalChain',
              '검색 결과 출처 표시 및 신뢰도 점수'
            ],
            evaluationCriteria: [
              '다양한 문서 형식 처리',
              '답변의 정확성',
              '대화 맥락 유지',
              '코드 품질'
            ],
            bonusPoints: [
              'Hybrid Search (키워드 + 벡터) 구현',
              'Reranking 적용',
              'Streamlit/Gradio UI 구현'
            ]
          }
        }
      ]
    }
  ]
}
