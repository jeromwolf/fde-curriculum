// Day 2: 임베딩 & 벡터 DB (Chroma, Pinecone)

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
} from './types'

export const day2EmbeddingsVectordb: Day = {
  slug: 'embeddings-vectordb',
  title: '임베딩 & 벡터 DB',
  totalDuration: 240,
  tasks: [
    createVideoTask('w5d2-embeddings-intro', '텍스트 임베딩 이해', 30, {
      introduction: `
# 텍스트 임베딩 이해

## 임베딩이란?

**임베딩(Embedding)** 은 텍스트를 고차원 벡터로 변환하는 것입니다.

\`\`\`
"고양이가 좋아요" → [0.12, -0.34, 0.56, ..., 0.78]  (1536차원)
"강아지가 좋아요" → [0.15, -0.32, 0.54, ..., 0.80]  (유사한 벡터)
"오늘 날씨 좋다" → [-0.45, 0.67, -0.12, ..., -0.23] (다른 벡터)
\`\`\`

## 왜 임베딩인가?

### 1. 의미적 유사도 계산

\`\`\`python
from sklearn.metrics.pairwise import cosine_similarity

# 비슷한 의미 → 높은 유사도
similarity("고양이가 좋아요", "강아지가 좋아요")  # 0.92

# 다른 의미 → 낮은 유사도
similarity("고양이가 좋아요", "오늘 날씨 좋다")  # 0.31
\`\`\`

### 2. 효율적인 검색

- 키워드 검색: "cat" → "고양이" 못 찾음 ❌
- 의미 검색: "cat" → "고양이" 찾음 ✅ (의미적으로 유사)

## 임베딩 모델 종류

| 모델 | 차원 | 특징 |
|------|------|------|
| **OpenAI text-embedding-3-small** | 1536 | 빠르고 저렴 |
| **OpenAI text-embedding-3-large** | 3072 | 고품질 |
| **Cohere embed-v3** | 1024 | 다국어 지원 |
| **sentence-transformers** | 384~768 | 오픈소스, 무료 |
| **intfloat/multilingual-e5** | 768 | 한국어 우수 |

## 코사인 유사도

\`\`\`
cos(A, B) = (A · B) / (||A|| × ||B||)

값 범위: -1 ~ 1
- 1: 완전히 같은 방향 (의미 동일)
- 0: 직교 (관련 없음)
- -1: 반대 방향 (의미 반대)
\`\`\`
      `,
      keyPoints: ['임베딩 = 텍스트 → 벡터 변환', '코사인 유사도로 의미적 거리 계산', '키워드 검색 대비 의미 검색 장점'],
      practiceGoal: '임베딩의 개념과 동작 원리를 이해한다',
    }),

    createCodeTask('w5d2-openai-embeddings', 'OpenAI 임베딩 실습', 40, {
      introduction: `
# OpenAI 임베딩 실습

## 설치 및 설정

\`\`\`bash
pip install openai numpy scikit-learn
\`\`\`

## 기본 사용법

\`\`\`python
from openai import OpenAI
import numpy as np

client = OpenAI()

def get_embedding(text: str, model: str = "text-embedding-3-small"):
    """텍스트를 임베딩 벡터로 변환"""
    response = client.embeddings.create(
        input=text,
        model=model
    )
    return response.data[0].embedding

# 테스트
text = "RAG는 검색 증강 생성 기술입니다"
embedding = get_embedding(text)
print(f"차원: {len(embedding)}")  # 1536
print(f"처음 5개 값: {embedding[:5]}")
\`\`\`

## 유사도 계산

\`\`\`python
from sklearn.metrics.pairwise import cosine_similarity

def compute_similarity(text1: str, text2: str) -> float:
    """두 텍스트의 코사인 유사도 계산"""
    emb1 = np.array(get_embedding(text1)).reshape(1, -1)
    emb2 = np.array(get_embedding(text2)).reshape(1, -1)
    return cosine_similarity(emb1, emb2)[0][0]

# 유사한 문장
sim1 = compute_similarity(
    "RAG는 검색 기반 생성 기술이다",
    "RAG는 retrieval augmented generation이다"
)
print(f"유사한 문장: {sim1:.3f}")  # ~0.90

# 다른 문장
sim2 = compute_similarity(
    "RAG는 검색 기반 생성 기술이다",
    "오늘 날씨가 좋습니다"
)
print(f"다른 문장: {sim2:.3f}")  # ~0.30
\`\`\`

## 배치 임베딩

\`\`\`python
def get_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """여러 텍스트를 한 번에 임베딩"""
    response = client.embeddings.create(
        input=texts,
        model="text-embedding-3-small"
    )
    return [item.embedding for item in response.data]

# 사용
texts = [
    "Python은 프로그래밍 언어이다",
    "JavaScript는 웹 개발에 사용된다",
    "오늘 점심은 김치찌개"
]
embeddings = get_embeddings_batch(texts)
print(f"임베딩 개수: {len(embeddings)}")
\`\`\`

## 비용 참고

| 모델 | 1M 토큰당 가격 |
|------|---------------|
| text-embedding-3-small | $0.02 |
| text-embedding-3-large | $0.13 |
| text-embedding-ada-002 | $0.10 |
      `,
      keyPoints: ['OpenAI API로 임베딩 생성', '코사인 유사도로 비교', '배치 처리로 효율성 향상'],
      practiceGoal: 'OpenAI 임베딩 API를 사용할 수 있다',
    }),

    createReadingTask('w5d2-vectordb-concepts', '벡터 데이터베이스 개념', 30, {
      introduction: `
# 벡터 데이터베이스 개념

## 왜 벡터 DB인가?

일반 DB에서는 의미 검색이 어렵습니다:

\`\`\`sql
-- 전통적인 검색: 키워드 매칭
SELECT * FROM documents WHERE content LIKE '%RAG%'

-- 문제: "검색 증강 생성"으로는 RAG 문서 못 찾음
\`\`\`

벡터 DB는 **유사도 기반 검색**을 지원:

\`\`\`python
# 의미 검색: 유사한 의미의 문서 찾기
results = vector_db.similarity_search(
    query_vector=embed("검색 증강 생성"),
    top_k=5
)
# RAG 관련 문서 찾음! ✅
\`\`\`

## 주요 개념

### 1. 인덱싱 알고리즘

| 알고리즘 | 특징 | 사용처 |
|----------|------|--------|
| **Flat (Brute Force)** | 정확도 100%, 느림 | 소규모 데이터 |
| **IVF (Inverted File)** | 클러스터 기반, 빠름 | 중규모 |
| **HNSW** | 그래프 기반, 매우 빠름 | 대규모, 실시간 |
| **PQ (Product Quantization)** | 압축, 메모리 효율적 | 초대규모 |

### 2. 유사도 측정 방식

- **Cosine Similarity**: 방향 기반 (가장 일반적)
- **Euclidean Distance**: 거리 기반
- **Dot Product**: 크기와 방향 모두 고려

### 3. 메타데이터

벡터와 함께 추가 정보 저장:

\`\`\`python
{
    "id": "doc_001",
    "vector": [0.12, -0.34, ...],
    "metadata": {
        "source": "blog_post.md",
        "author": "홍길동",
        "date": "2024-01-15",
        "category": "AI"
    }
}
\`\`\`

### 4. 필터링

메타데이터 기반 필터 + 벡터 검색:

\`\`\`python
results = vector_db.similarity_search(
    query_vector=query_emb,
    filter={"category": "AI", "date": {"$gte": "2024-01-01"}}
)
\`\`\`

## 주요 벡터 DB 비교

| DB | 타입 | 특징 | 가격 |
|----|------|------|------|
| **Chroma** | 로컬/임베디드 | 가볍고 간단, 프로토타이핑 | 무료 |
| **Pinecone** | 클라우드 | 관리형, 확장성 | Free tier + 유료 |
| **Weaviate** | 오픈소스 | GraphQL, 멀티모달 | 무료/클라우드 |
| **Milvus** | 오픈소스 | 대규모, 고성능 | 무료 |
| **Qdrant** | 오픈소스 | Rust 기반, 빠름 | 무료/클라우드 |
| **pgvector** | PostgreSQL 확장 | 기존 PG 활용 | 무료 |
      `,
      keyPoints: ['벡터 DB = 유사도 기반 검색 특화', 'HNSW가 가장 인기 있는 인덱싱', '메타데이터 필터링으로 정확도 향상'],
      practiceGoal: '벡터 DB의 핵심 개념과 종류를 이해한다',
    }),

    createCodeTask('w5d2-chroma-practice', 'Chroma 실습', 45, {
      introduction: `
# Chroma 실습

## Chroma란?

- **오픈소스** 벡터 데이터베이스
- **로컬/임베디드** 모드 지원
- **LangChain 통합** 우수
- **프로토타이핑에 최적**

## 설치

\`\`\`bash
pip install chromadb langchain-chroma
\`\`\`

## 기본 사용법

\`\`\`python
import chromadb
from chromadb.utils import embedding_functions

# 1. 클라이언트 생성
client = chromadb.Client()  # 인메모리
# client = chromadb.PersistentClient(path="./chroma_db")  # 영구 저장

# 2. 임베딩 함수 설정
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key="your-api-key",
    model_name="text-embedding-3-small"
)

# 3. 컬렉션 생성
collection = client.create_collection(
    name="my_documents",
    embedding_function=openai_ef
)

# 4. 문서 추가
collection.add(
    documents=[
        "RAG는 검색 증강 생성입니다",
        "벡터 DB는 임베딩을 저장합니다",
        "LangChain은 LLM 프레임워크입니다"
    ],
    metadatas=[
        {"source": "doc1", "category": "AI"},
        {"source": "doc2", "category": "DB"},
        {"source": "doc3", "category": "AI"}
    ],
    ids=["id1", "id2", "id3"]
)

# 5. 검색
results = collection.query(
    query_texts=["검색 기반 AI 기술"],
    n_results=2
)
print(results)
\`\`\`

## LangChain과 함께 사용

\`\`\`python
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document

# 문서 준비
docs = [
    Document(page_content="RAG는 검색 증강 생성입니다", metadata={"source": "doc1"}),
    Document(page_content="벡터 DB는 임베딩을 저장합니다", metadata={"source": "doc2"}),
]

# 임베딩
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Chroma 벡터 저장소 생성
vectorstore = Chroma.from_documents(
    documents=docs,
    embedding=embeddings,
    persist_directory="./chroma_langchain"
)

# 검색
results = vectorstore.similarity_search("AI 검색 기술", k=2)
for doc in results:
    print(f"- {doc.page_content}")

# 메타데이터 필터링
filtered = vectorstore.similarity_search(
    "AI",
    k=5,
    filter={"source": "doc1"}
)
\`\`\`

## 영구 저장 & 로드

\`\`\`python
# 저장 (이미 persist_directory 지정 시 자동)
vectorstore.persist()

# 나중에 로드
vectorstore = Chroma(
    persist_directory="./chroma_langchain",
    embedding_function=embeddings
)
\`\`\`
      `,
      keyPoints: ['Chroma는 로컬 프로토타이핑에 최적', 'LangChain 통합으로 쉬운 사용', 'persist_directory로 영구 저장'],
      practiceGoal: 'Chroma를 사용하여 벡터 저장소를 구축한다',
    }),

    createCodeTask('w5d2-pinecone-practice', 'Pinecone 실습', 45, {
      introduction: `
# Pinecone 실습

## Pinecone이란?

- **관리형** 벡터 데이터베이스
- **확장성** 우수 (수십억 벡터)
- **서버리스** 옵션
- **Free tier** 제공

## 설정

1. https://www.pinecone.io 가입
2. API 키 발급
3. 인덱스 생성

\`\`\`bash
pip install pinecone-client langchain-pinecone
\`\`\`

## 기본 사용법

\`\`\`python
from pinecone import Pinecone, ServerlessSpec
import os

# 1. 클라이언트 초기화
pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])

# 2. 인덱스 생성 (한 번만)
index_name = "rag-demo"
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=1536,  # OpenAI 임베딩 차원
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )

# 3. 인덱스 연결
index = pc.Index(index_name)

# 4. 벡터 업서트
vectors = [
    {
        "id": "vec1",
        "values": [0.1, 0.2, ...],  # 1536차원
        "metadata": {"text": "RAG는 검색 증강 생성"}
    },
    {
        "id": "vec2",
        "values": [0.3, 0.4, ...],
        "metadata": {"text": "벡터 DB는 임베딩 저장"}
    }
]
index.upsert(vectors=vectors)

# 5. 검색
results = index.query(
    vector=[0.1, 0.2, ...],  # 쿼리 벡터
    top_k=3,
    include_metadata=True
)
\`\`\`

## LangChain 통합

\`\`\`python
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document

# 임베딩
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# 문서
docs = [
    Document(page_content="RAG는 검색 증강 생성입니다", metadata={"source": "ai"}),
    Document(page_content="Pinecone은 벡터 DB입니다", metadata={"source": "db"}),
]

# Pinecone 벡터 저장소
vectorstore = PineconeVectorStore.from_documents(
    documents=docs,
    embedding=embeddings,
    index_name="rag-demo"
)

# 검색
results = vectorstore.similarity_search("AI 검색 기술", k=2)

# 메타데이터 필터
filtered = vectorstore.similarity_search(
    "기술",
    k=5,
    filter={"source": {"$eq": "ai"}}
)
\`\`\`

## Chroma vs Pinecone

| 항목 | Chroma | Pinecone |
|------|--------|----------|
| 타입 | 로컬/임베디드 | 클라우드 |
| 확장성 | 중소규모 | 대규모 |
| 설정 | 간단 | 계정 필요 |
| 비용 | 무료 | Free tier + 유료 |
| 사용처 | 프로토타입 | 프로덕션 |
      `,
      keyPoints: ['Pinecone은 관리형 클라우드 벡터 DB', 'ServerlessSpec으로 인덱스 생성', 'LangChain으로 쉽게 통합'],
      practiceGoal: 'Pinecone을 사용하여 클라우드 벡터 저장소를 구축한다',
    }),

    createQuizTask('w5d2-quiz', 'Day 2 복습 퀴즈', 15, {
      introduction: '# Day 2 복습 퀴즈',
      questions: [
        {
          id: 'w5d2-q1',
          question: '텍스트 임베딩의 주요 목적은?',
          options: ['텍스트 압축', '의미적 유사도 계산', '문법 검사', '번역'],
          correctAnswer: 1,
          explanation: '임베딩은 텍스트를 벡터로 변환하여 의미적 유사도를 계산할 수 있게 합니다.',
        },
        {
          id: 'w5d2-q2',
          question: 'OpenAI text-embedding-3-small의 차원 수는?',
          options: ['512', '768', '1536', '3072'],
          correctAnswer: 2,
          explanation: 'text-embedding-3-small은 1536차원 벡터를 생성합니다.',
        },
        {
          id: 'w5d2-q3',
          question: 'HNSW 인덱싱 알고리즘의 특징은?',
          options: ['정확도 100%', '메모리 효율적', '그래프 기반으로 빠름', '클러스터 기반'],
          correctAnswer: 2,
          explanation: 'HNSW(Hierarchical Navigable Small World)는 그래프 기반으로 빠른 검색을 지원합니다.',
        },
      ],
      keyPoints: ['임베딩 = 의미적 유사도 계산용', 'text-embedding-3-small = 1536차원', 'HNSW = 그래프 기반 빠른 검색'],
      practiceGoal: '임베딩과 벡터 DB 개념을 확인한다',
    }),
  ],
}
