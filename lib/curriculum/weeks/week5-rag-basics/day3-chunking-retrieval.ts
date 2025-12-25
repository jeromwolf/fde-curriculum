// Day 3: 청킹 전략 & 검색 최적화

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
} from './types'

export const day3ChunkingRetrieval: Day = {
  slug: 'chunking-retrieval',
  title: '청킹 전략 & 검색 최적화',
  totalDuration: 240,
  tasks: [
    createVideoTask('w5d3-chunking-intro', '청킹의 중요성', 25, {
      introduction: `
# 청킹의 중요성

## 청킹이란?

**청킹(Chunking)** 은 긴 문서를 작은 조각으로 나누는 과정입니다.

\`\`\`
원본 문서 (10,000자)
    ↓ 청킹
[청크1: 500자] [청크2: 500자] ... [청크20: 500자]
\`\`\`

## 왜 청킹이 필요한가?

### 1. LLM 컨텍스트 제한

\`\`\`
GPT-4o: 128K 토큰
Claude: 200K 토큰

하지만 너무 긴 컨텍스트는:
- 비용 증가
- 응답 품질 저하 ("Lost in the Middle" 문제)
\`\`\`

### 2. 검색 정확도

\`\`\`
청크가 너무 크면: 불필요한 내용 포함
청크가 너무 작으면: 문맥 손실

적절한 크기가 핵심!
\`\`\`

## 청킹 크기 가이드라인

| 문서 유형 | 권장 청크 크기 | 이유 |
|----------|--------------|------|
| 기술 문서 | 500-1000자 | 개념 단위 보존 |
| 대화/채팅 | 200-500자 | 짧은 발화 단위 |
| 법률/계약 | 1000-2000자 | 조항 단위 |
| 코드 | 함수/클래스 단위 | 논리적 단위 |
| Q&A | 질문+답변 쌍 | 의미 단위 |

## Overlap의 역할

\`\`\`
[청크1: "RAG는 검색 증강 생성 기술입니다. 이 기술은"]
              [청크2: "기술입니다. 이 기술은 LLM의 한계를 극복"]

Overlap = 50자 → 문맥 연결 유지
\`\`\`
      `,
      keyPoints: ['청킹 = 문서를 작은 조각으로 분할', '적절한 크기가 검색 품질 결정', 'Overlap으로 문맥 연결 유지'],
      practiceGoal: '청킹의 개념과 중요성을 이해한다',
    }),

    createCodeTask('w5d3-chunking-strategies', '청킹 전략 실습', 45, {
      introduction: `
# 청킹 전략 실습

## 1. 고정 크기 청킹 (Fixed Size)

가장 단순한 방법:

\`\`\`python
from langchain.text_splitter import CharacterTextSplitter

# 문자 수 기반
splitter = CharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separator="\\n"
)

chunks = splitter.split_text(long_text)
\`\`\`

## 2. 재귀적 청킹 (Recursive)

여러 구분자를 순차적으로 시도:

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\\n\\n", "\\n", ". ", " ", ""]
)

# 우선순위:
# 1. 문단 (\\n\\n)
# 2. 줄바꿈 (\\n)
# 3. 문장 (. )
# 4. 공백 ( )
# 5. 문자 ("")
\`\`\`

## 3. 의미적 청킹 (Semantic)

임베딩 유사도 기반 분할:

\`\`\`python
from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings()

# 의미가 바뀌는 지점에서 분할
splitter = SemanticChunker(
    embeddings=embeddings,
    breakpoint_threshold_type="percentile",
    breakpoint_threshold_amount=95
)

chunks = splitter.split_text(document)
\`\`\`

## 4. 문서 구조 기반 청킹

마크다운 헤더 기반:

\`\`\`python
from langchain.text_splitter import MarkdownHeaderTextSplitter

headers_to_split = [
    ("#", "Header 1"),
    ("##", "Header 2"),
    ("###", "Header 3"),
]

splitter = MarkdownHeaderTextSplitter(headers_to_split)
chunks = splitter.split_text(markdown_text)

# 각 청크에 헤더 메타데이터 포함
for chunk in chunks:
    print(chunk.metadata)  # {"Header 1": "소개", "Header 2": "배경"}
\`\`\`

## 5. 코드 청킹

프로그래밍 언어별 분할:

\`\`\`python
from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
    Language
)

python_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.PYTHON,
    chunk_size=500,
    chunk_overlap=50
)

# 함수, 클래스 단위로 분할
chunks = python_splitter.split_text(python_code)
\`\`\`

## 전략 선택 가이드

| 전략 | 사용 상황 | 장점 | 단점 |
|------|----------|------|------|
| Fixed | 단순한 텍스트 | 빠름, 예측 가능 | 의미 무시 |
| Recursive | 일반 문서 | 구조 존중 | 설정 필요 |
| Semantic | 복잡한 문서 | 의미 보존 | 느림, 비용 |
| Markdown | 구조화된 문서 | 계층 보존 | MD 전용 |
| Code | 소스 코드 | 논리 단위 | 언어별 설정 |
      `,
      keyPoints: ['RecursiveCharacterTextSplitter가 가장 일반적', 'SemanticChunker로 의미 기반 분할', '문서 유형에 맞는 전략 선택'],
      practiceGoal: '다양한 청킹 전략을 구현하고 비교한다',
    }),

    createReadingTask('w5d3-retrieval-basics', '검색 기초', 30, {
      introduction: `
# 검색 기초

## 검색 방식 비교

### 1. 키워드 검색 (Sparse)

\`\`\`
쿼리: "RAG 아키텍처"
→ "RAG"와 "아키텍처" 단어 포함 문서 검색

장점: 정확한 키워드 매칭
단점: 동의어, 유사 표현 못 찾음
\`\`\`

### 2. 의미 검색 (Dense/Vector)

\`\`\`
쿼리: "검색 기반 생성 AI"
→ "RAG", "Retrieval-Augmented Generation" 등 찾음

장점: 의미적 유사성 포착
단점: 정확한 키워드 누락 가능
\`\`\`

### 3. 하이브리드 검색

\`\`\`
키워드 검색 점수 + 벡터 검색 점수 결합

hybrid_score = α × keyword_score + (1-α) × vector_score
\`\`\`

## 검색 방식 비교표

| 방식 | 알고리즘 | 장점 | 단점 |
|------|----------|------|------|
| Sparse | BM25, TF-IDF | 정확한 키워드 | 의미 무시 |
| Dense | 벡터 유사도 | 의미 포착 | 키워드 약함 |
| Hybrid | 결합 | 균형 | 복잡도 |

## LangChain 검색기 유형

\`\`\`python
# 1. 기본 유사도 검색
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}
)

# 2. MMR (Maximal Marginal Relevance)
# 유사도 + 다양성 균형
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 4, "fetch_k": 10}
)

# 3. 유사도 점수 임계값
retriever = vectorstore.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"score_threshold": 0.7}
)
\`\`\`

## MMR 이해하기

\`\`\`
Top-10 중 Top-4 선택 시:

일반 검색: 가장 유사한 4개 (중복될 수 있음)
MMR: 유사하면서 서로 다른 4개 선택

fetch_k=10: 후보군 크기
k=4: 최종 선택 개수
lambda_mult: 유사도 vs 다양성 비율 (0~1)
\`\`\`
      `,
      keyPoints: ['Sparse(키워드) vs Dense(벡터) 검색', 'Hybrid 검색으로 장점 결합', 'MMR로 다양성 확보'],
      practiceGoal: '검색 방식의 차이와 특징을 이해한다',
    }),

    createCodeTask('w5d3-retrieval-optimization', '검색 최적화 실습', 45, {
      introduction: `
# 검색 최적화 실습

## 1. Re-ranking

초기 검색 결과를 다시 정렬:

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CohereRerank

# Cohere Reranker
reranker = CohereRerank(
    cohere_api_key="your-key",
    top_n=3
)

compression_retriever = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=vectorstore.as_retriever(search_kwargs={"k": 10})
)

# 10개 검색 → 3개로 re-rank
results = compression_retriever.invoke("RAG 최적화 방법")
\`\`\`

## 2. Query Expansion

쿼리를 확장하여 더 많은 결과 검색:

\`\`\`python
from langchain.retrievers import MultiQueryRetriever
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

# 하나의 쿼리를 여러 관점으로 확장
retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(),
    llm=llm
)

# 내부적으로 여러 쿼리 생성
# "RAG 성능 향상" →
# - "RAG 최적화 방법"
# - "검색 증강 생성 개선 전략"
# - "RAG 시스템 튜닝"
\`\`\`

## 3. Ensemble Retriever

여러 검색기 결합:

\`\`\`python
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

# BM25 (키워드) 검색기
bm25_retriever = BM25Retriever.from_documents(documents)
bm25_retriever.k = 4

# 벡터 검색기
vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# 앙상블 (하이브리드)
ensemble = EnsembleRetriever(
    retrievers=[bm25_retriever, vector_retriever],
    weights=[0.4, 0.6]  # BM25 40%, 벡터 60%
)

results = ensemble.invoke("RAG 아키텍처")
\`\`\`

## 4. 메타데이터 필터링

\`\`\`python
# 특정 조건의 문서만 검색
results = vectorstore.similarity_search(
    "AI 기술",
    k=5,
    filter={
        "category": "tech",
        "year": {"$gte": 2023}
    }
)
\`\`\`

## 5. Parent Document Retriever

작은 청크로 검색, 큰 청크로 반환:

\`\`\`python
from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore

# 작은 청크 (검색용)
child_splitter = RecursiveCharacterTextSplitter(chunk_size=200)

# 큰 청크 (컨텍스트용)
parent_splitter = RecursiveCharacterTextSplitter(chunk_size=1000)

store = InMemoryStore()

retriever = ParentDocumentRetriever(
    vectorstore=vectorstore,
    docstore=store,
    child_splitter=child_splitter,
    parent_splitter=parent_splitter
)

# 작은 청크로 정확한 검색 → 큰 청크로 풍부한 컨텍스트
\`\`\`

## 최적화 체크리스트

- [ ] 적절한 청크 크기 설정
- [ ] MMR로 다양성 확보
- [ ] Re-ranking 적용
- [ ] 하이브리드 검색 고려
- [ ] 메타데이터 필터링 활용
      `,
      keyPoints: ['Re-ranking으로 검색 품질 향상', 'MultiQuery로 쿼리 확장', 'Ensemble로 하이브리드 검색'],
      practiceGoal: '다양한 검색 최적화 기법을 적용한다',
    }),

    createReadingTask('w5d3-best-practices', '청킹 & 검색 베스트 프랙티스', 25, {
      introduction: `
# 청킹 & 검색 베스트 프랙티스

## 청킹 베스트 프랙티스

### 1. 적절한 청크 크기

\`\`\`
너무 작으면: 문맥 손실
너무 크면: 노이즈 포함

권장: 500-1000자 (한국어 기준)
\`\`\`

### 2. Overlap 설정

\`\`\`
청크 크기의 10-20%가 적당
예: chunk_size=500 → overlap=50-100
\`\`\`

### 3. 메타데이터 보존

\`\`\`python
# 출처 정보를 메타데이터에 포함
Document(
    page_content="청크 내용",
    metadata={
        "source": "manual.pdf",
        "page": 5,
        "section": "Chapter 2"
    }
)
\`\`\`

## 검색 베스트 프랙티스

### 1. k값 튜닝

\`\`\`
k가 너무 작으면: 관련 정보 누락
k가 너무 크면: 노이즈 증가, 비용 증가

시작점: k=4
평가 후 조정: 3-10 범위
\`\`\`

### 2. 점수 임계값

\`\`\`python
# 낮은 유사도 결과 필터링
retriever = vectorstore.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"score_threshold": 0.7}
)
\`\`\`

### 3. 결과 검증

\`\`\`python
def validate_results(query, results):
    """검색 결과 검증"""
    if not results:
        return "검색 결과 없음"

    # 최소 유사도 확인
    for doc in results:
        print(f"내용: {doc.page_content[:100]}...")
        print(f"출처: {doc.metadata.get('source', 'N/A')}")
\`\`\`

## 흔한 실수 피하기

| 실수 | 해결책 |
|------|--------|
| 청크가 너무 큼 | 500-1000자로 제한 |
| Overlap 없음 | 10-20% overlap 추가 |
| 메타데이터 누락 | 출처, 날짜 등 포함 |
| k값 고정 | 평가 후 튜닝 |
| 단일 검색 방식 | 하이브리드 검색 시도 |

## 성능 측정 지표

\`\`\`
1. 검색 정확도
   - Precision@K
   - Recall@K
   - MRR

2. 응답 품질
   - Faithfulness
   - Answer Relevance

3. 시스템 성능
   - 검색 지연시간
   - 토큰 사용량
\`\`\`
      `,
      keyPoints: ['청크 500-1000자, Overlap 10-20%', 'k값은 평가 후 튜닝', '메타데이터로 출처 추적'],
      practiceGoal: '청킹과 검색의 베스트 프랙티스를 적용한다',
    }),

    createQuizTask('w5d3-quiz', 'Day 3 복습 퀴즈', 15, {
      introduction: '# Day 3 복습 퀴즈',
      questions: [
        {
          id: 'w5d3-q1',
          question: 'RecursiveCharacterTextSplitter의 특징은?',
          options: ['고정 크기만 지원', '여러 구분자를 순차적으로 시도', '의미 기반 분할', '코드 전용'],
          correctAnswer: 1,
          explanation: 'RecursiveCharacterTextSplitter는 \\n\\n, \\n, . , 공백 등 여러 구분자를 순차적으로 시도합니다.',
        },
        {
          id: 'w5d3-q2',
          question: 'MMR(Maximal Marginal Relevance)의 목적은?',
          options: ['검색 속도 향상', '유사도와 다양성 균형', '메모리 절약', '비용 절감'],
          correctAnswer: 1,
          explanation: 'MMR은 유사도가 높으면서도 서로 다른 문서를 선택하여 다양성을 확보합니다.',
        },
        {
          id: 'w5d3-q3',
          question: '하이브리드 검색의 장점은?',
          options: ['속도가 빠름', '키워드와 의미 검색의 장점 결합', '메모리 효율적', '설정이 간단'],
          correctAnswer: 1,
          explanation: '하이브리드 검색은 키워드(BM25) 검색과 벡터(의미) 검색을 결합하여 더 정확한 결과를 얻습니다.',
        },
      ],
      keyPoints: ['Recursive = 여러 구분자 순차 시도', 'MMR = 유사도 + 다양성', 'Hybrid = 키워드 + 벡터'],
      practiceGoal: '청킹과 검색 최적화 개념을 확인한다',
    }),
  ],
}
