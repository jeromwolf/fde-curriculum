// Phase 4, Week 6: Vector DB 운영
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'vector-db-intro',
  title: 'Vector DB 개념 & 비교',
  totalDuration: 180,
  tasks: [
    {
      id: 'vector-db-intro-video',
      type: 'video',
      title: 'Vector Database 개요',
      duration: 30,
      content: {
        objectives: ['벡터 DB의 필요성 이해', '주요 벡터 DB 비교', 'ANN 알고리즘 학습'],
        videoUrl: 'https://www.youtube.com/watch?v=vector-db-intro-placeholder',
        transcript: `
## Vector Database

### 왜 Vector DB인가?

\`\`\`
전통적 DB                       Vector DB
├── 정확한 매칭 (=)              ├── 유사도 검색 (≈)
├── 구조화된 쿼리                ├── 의미 기반 검색
└── B-Tree 인덱스               └── ANN 인덱스
\`\`\`

### 주요 Vector DB 비교

| DB | 특징 | 호스팅 | 가격 |
|----|------|--------|------|
| **Pinecone** | 완전 관리형, 쉬운 설정 | 클라우드 | Free tier 있음 |
| **Weaviate** | 하이브리드 검색, GraphQL | 둘 다 | 오픈소스 |
| **Milvus** | 대규모, 분산 처리 | 셀프/Zilliz | 오픈소스 |
| **Qdrant** | Rust 기반, 고성능 | 둘 다 | 오픈소스 |
| **Chroma** | 경량, 로컬 개발 | 로컬 | 오픈소스 |
| **pgvector** | PostgreSQL 확장 | 셀프/RDS | 무료 |

### ANN 알고리즘

\`\`\`
HNSW (Hierarchical Navigable Small World)
├── 계층적 그래프 구조
├── 높은 정확도
└── 메모리 사용량 높음

IVF (Inverted File Index)
├── 클러스터링 기반
├── 빌드 시간 빠름
└── 정확도 조절 가능

PQ (Product Quantization)
├── 벡터 압축
├── 메모리 효율적
└── 정확도 손실 있음
\`\`\`
        `
      }
    },
    {
      id: 'pinecone-video',
      type: 'video',
      title: 'Pinecone 실습',
      duration: 30,
      content: {
        objectives: ['Pinecone 인덱스 생성', '벡터 업서트 및 쿼리', '메타데이터 필터링'],
        videoUrl: 'https://www.youtube.com/watch?v=pinecone-placeholder',
        transcript: `
## Pinecone

### 설정

\`\`\`python
from pinecone import Pinecone

pc = Pinecone(api_key="your-api-key")

# 인덱스 생성
pc.create_index(
    name="my-index",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1")
)

index = pc.Index("my-index")
\`\`\`

### 벡터 업서트

\`\`\`python
# 단일 업서트
index.upsert(vectors=[
    {
        "id": "doc1",
        "values": [0.1, 0.2, ...],  # 1536 차원
        "metadata": {"text": "...", "source": "wiki"}
    }
])

# 배치 업서트
index.upsert(vectors=vectors_list, batch_size=100)
\`\`\`

### 쿼리

\`\`\`python
results = index.query(
    vector=query_embedding,
    top_k=5,
    include_metadata=True,
    filter={"source": {"$eq": "wiki"}}
)

for match in results['matches']:
    print(f"Score: {match['score']}, Text: {match['metadata']['text']}")
\`\`\`
        `
      }
    }
  ]
}

const day2: Day = {
  slug: 'pgvector',
  title: 'pgvector & PostgreSQL',
  totalDuration: 180,
  tasks: [
    {
      id: 'pgvector-video',
      type: 'video',
      title: 'PostgreSQL로 벡터 검색',
      duration: 30,
      content: {
        objectives: ['pgvector 설치 및 설정', 'HNSW 인덱스 생성', 'SQL로 벡터 검색'],
        videoUrl: 'https://www.youtube.com/watch?v=pgvector-placeholder',
        transcript: `
## pgvector

### 설치

\`\`\`sql
-- 확장 설치
CREATE EXTENSION vector;

-- 테이블 생성
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(1536)
);
\`\`\`

### 인덱스 생성

\`\`\`sql
-- HNSW 인덱스 (권장)
CREATE INDEX ON documents
USING hnsw (embedding vector_cosine_ops);

-- IVFFlat 인덱스
CREATE INDEX ON documents
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
\`\`\`

### 벡터 검색

\`\`\`sql
-- 코사인 유사도 (가까울수록 유사)
SELECT id, content, 1 - (embedding <=> query_vector) AS similarity
FROM documents
ORDER BY embedding <=> query_vector
LIMIT 5;

-- L2 거리
SELECT * FROM documents
ORDER BY embedding <-> query_vector
LIMIT 5;
\`\`\`

### Python 연동

\`\`\`python
import psycopg2
from pgvector.psycopg2 import register_vector

conn = psycopg2.connect(...)
register_vector(conn)

# 삽입
cur.execute(
    "INSERT INTO documents (content, embedding) VALUES (%s, %s)",
    (text, embedding)
)

# 검색
cur.execute(
    "SELECT content FROM documents ORDER BY embedding <=> %s LIMIT 5",
    (query_embedding,)
)
\`\`\`
        `
      }
    }
  ]
}

const day3: Day = {
  slug: 'vector-scaling',
  title: '벡터 DB 스케일링',
  totalDuration: 180,
  tasks: [
    {
      id: 'scaling-video',
      type: 'video',
      title: '대규모 벡터 DB 운영',
      duration: 35,
      content: {
        objectives: ['샤딩 전략', '레플리케이션 설정', '성능 최적화'],
        videoUrl: 'https://www.youtube.com/watch?v=vector-scaling-placeholder',
        transcript: `
## 벡터 DB 스케일링

### 용량 계획

\`\`\`
메모리 계산:
1536 차원 × 4 bytes × 1M 벡터 = ~6 GB
+ 인덱스 오버헤드 (~50%) = ~9 GB

1억 벡터 → ~900 GB
\`\`\`

### 샤딩 전략

\`\`\`
해시 샤딩
├── 균등 분배
└── 범위 쿼리 어려움

범위 샤딩
├── 연속 데이터
└── 핫스팟 가능성

하이브리드
├── 네임스페이스 분리
└── 테넌트별 인덱스
\`\`\`

### 성능 최적화

\`\`\`
1. 적절한 차원 선택 (256-1536)
2. 배치 업서트 (100-1000개)
3. 메타데이터 필터링 활용
4. 적절한 top_k (과도하게 크지 않게)
5. 인덱스 파라미터 튜닝
\`\`\`
        `
      }
    }
  ]
}

const day4: Day = {
  slug: 'rag-integration',
  title: 'RAG 시스템 통합',
  totalDuration: 180,
  tasks: [
    {
      id: 'rag-architecture-video',
      type: 'video',
      title: 'Production RAG 아키텍처',
      duration: 35,
      content: {
        objectives: ['RAG 파이프라인 설계', '청킹 전략', '리랭킹 적용'],
        videoUrl: 'https://www.youtube.com/watch?v=rag-architecture-placeholder',
        transcript: `
## Production RAG

### 아키텍처

\`\`\`
문서 인제스트 파이프라인
├── 문서 로드 (S3, Web)
├── 청킹 (Recursive, Semantic)
├── 임베딩 (OpenAI, Cohere)
└── 벡터 DB 저장

쿼리 파이프라인
├── 쿼리 임베딩
├── 벡터 검색 (top_k=20)
├── 리랭킹 (top_k=5)
├── 프롬프트 구성
└── LLM 생성
\`\`\`

### 청킹 전략

| 방법 | 특징 |
|------|------|
| Fixed size | 간단, 문맥 깨짐 가능 |
| Recursive | 구분자 기반, 유연 |
| Semantic | 의미 단위, 고품질 |
| Sentence | 문장 단위 |

### 리랭킹

\`\`\`python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

# 검색 결과 리랭킹
pairs = [[query, doc.page_content] for doc in results]
scores = reranker.predict(pairs)

# 점수로 정렬
reranked = sorted(zip(results, scores), key=lambda x: x[1], reverse=True)
\`\`\`
        `
      }
    }
  ]
}

const day5: Day = {
  slug: 'vector-project',
  title: '🏆 Week 6 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'week6-challenge',
      type: 'challenge',
      title: 'Production-Ready RAG 시스템',
      duration: 120,
      content: {
        objectives: ['확장 가능한 RAG 시스템 구축', '다중 소스 문서 처리', '성능 최적화'],
        requirements: [
          '문서 인제스트 파이프라인 (S3 → Lambda → Vector DB)',
          '벡터 DB 선택 및 설정 (Pinecone 또는 pgvector)',
          '하이브리드 검색 (벡터 + 키워드)',
          '리랭킹 적용 (Cross-Encoder)',
          'API 서버 (FastAPI)',
          '모니터링 (지연시간, 정확도)'
        ],
        evaluationCriteria: ['시스템 완성도 (30%)', '검색 품질 (25%)', '확장성 (25%)', '문서화 (20%)'],
        bonusPoints: ['실시간 문서 업데이트', 'Multi-tenancy', 'Caching 전략']
      }
    }
  ]
}

export const vectorDbWeek: Week = {
  slug: 'vector-db',
  week: 6,
  phase: 4,
  month: 8,
  access: 'pro',
  title: 'Vector DB 운영',
  topics: ['Pinecone', 'pgvector', 'Weaviate', 'RAG', '벡터 검색', '스케일링'],
  practice: 'Production RAG 시스템',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
