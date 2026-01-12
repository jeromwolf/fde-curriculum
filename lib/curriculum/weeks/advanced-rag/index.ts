// Phase 5, Week 4: 고급 RAG 패턴
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'query-transformation',
  title: 'Query 변환 기법',
  totalDuration: 180,
  tasks: [
    {
      id: 'query-transform-video',
      type: 'video',
      title: 'Query Rewriting & Expansion',
      duration: 35,
      content: {
        objectives: ['쿼리 변환 기법을 이해한다', 'HyDE와 Multi-Query를 학습한다', '쿼리 확장으로 검색 품질을 개선한다'],
        videoUrl: 'https://www.youtube.com/watch?v=query-transform-placeholder',
        transcript: `
## Query 변환 기법

### 문제: 원본 쿼리의 한계

\`\`\`
사용자 질문: "RAG가 뭐야?"

문제점:
├── 너무 짧음
├── 컨텍스트 부족
├── 벡터 검색에 불리
└── 관련 문서 누락 가능
\`\`\`

### HyDE (Hypothetical Document Embeddings)

\`\`\`python
# 가상의 답변을 먼저 생성
hypothetical_answer = llm.invoke(
    "RAG가 무엇인지 설명하는 문단을 작성하세요."
)

# 가상 답변으로 검색
docs = retriever.invoke(hypothetical_answer)

# 실제 문서 기반 최종 답변 생성
\`\`\`

### Multi-Query

\`\`\`python
# 하나의 질문을 여러 관점으로 변환
original = "RAG가 뭐야?"

generated_queries = [
    "RAG (Retrieval-Augmented Generation)의 정의는?",
    "RAG 시스템의 구성 요소는?",
    "RAG와 일반 LLM의 차이점은?"
]

# 각 쿼리로 검색 후 결과 통합
\`\`\`
        `
      }
    },
    {
      id: 'query-transform-practice',
      type: 'code',
      title: 'Query 변환 실습',
      duration: 90,
      content: {
        objectives: ['HyDE와 Multi-Query를 구현한다'],
        instructions: 'Query 변환 기법을 적용한 RAG를 구현하세요.',
        starterCode: `# Query 변환 구현`,
        solutionCode: `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

class QueryTransformer:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)

    def hyde(self, question: str) -> str:
        """가상 문서 생성"""
        prompt = ChatPromptTemplate.from_template(
            "다음 질문에 대한 답변을 작성하세요 (1문단):\\n{question}"
        )
        chain = prompt | self.llm | StrOutputParser()
        return chain.invoke({"question": question})

    def multi_query(self, question: str, n: int = 3) -> list[str]:
        """다중 쿼리 생성"""
        prompt = ChatPromptTemplate.from_template(
            """다음 질문을 {n}개의 다른 표현으로 바꿔주세요.
각 줄에 하나씩 작성하세요.

원본 질문: {question}"""
        )
        chain = prompt | self.llm | StrOutputParser()
        result = chain.invoke({"question": question, "n": n})
        return [q.strip() for q in result.strip().split("\\n") if q.strip()]
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'reranking',
  title: 'Re-ranking & Fusion',
  totalDuration: 180,
  tasks: [
    {
      id: 'reranking-video',
      type: 'video',
      title: 'Re-ranking 전략',
      duration: 35,
      content: {
        objectives: ['Re-ranking의 필요성을 이해한다', 'Cross-encoder와 LLM 기반 리랭킹을 학습한다', 'Reciprocal Rank Fusion을 적용한다'],
        videoUrl: 'https://www.youtube.com/watch?v=reranking-placeholder',
        transcript: `
## Re-ranking

### 왜 Re-ranking인가?

\`\`\`
초기 검색 (Bi-encoder):
├── 빠르지만 정밀도 낮음
├── 의미적 유사성만 고려
└── 질문-문서 상호작용 부족

Re-ranking (Cross-encoder):
├── 느리지만 정밀도 높음
├── 질문과 문서를 함께 인코딩
└── 더 정확한 관련성 점수
\`\`\`

### Cohere Reranker

\`\`\`python
from langchain_cohere import CohereRerank

reranker = CohereRerank(model="rerank-english-v2.0")

reranked_docs = reranker.compress_documents(
    documents=docs,
    query=question
)
\`\`\`

### LLM 기반 Re-ranking

\`\`\`python
def llm_rerank(question: str, docs: list) -> list:
    prompt = f"""
    질문과 각 문서의 관련성을 0-10으로 평가하세요.
    질문: {question}
    """
    # LLM으로 점수 부여 후 정렬
\`\`\`

### Reciprocal Rank Fusion (RRF)

\`\`\`python
def rrf_score(rankings: list[list], k: int = 60) -> dict:
    scores = {}
    for ranking in rankings:
        for rank, doc_id in enumerate(ranking):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank + 1)
    return sorted(scores.items(), key=lambda x: -x[1])
\`\`\`
        `
      }
    },
    {
      id: 'reranking-practice',
      type: 'code',
      title: 'Re-ranking 실습',
      duration: 90,
      content: {
        objectives: ['다양한 리랭킹 기법을 구현하고 비교한다'],
        instructions: 'LLM 기반 리랭킹과 RRF를 구현하세요.',
        starterCode: `# Re-ranking 구현`,
        solutionCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
import json

class RelevanceScore(BaseModel):
    score: int = Field(ge=0, le=10)
    reason: str

class LLMReranker:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    def rerank(self, question: str, docs: list, top_k: int = 3) -> list:
        scored_docs = []
        for doc in docs:
            prompt = f"""질문과 문서의 관련성을 평가하세요.
질문: {question}
문서: {doc.page_content[:500]}
점수 (0-10):"""
            response = self.llm.invoke(prompt)
            try:
                score = int(response.content.strip().split()[0])
            except:
                score = 5
            scored_docs.append((doc, score))

        return [doc for doc, _ in sorted(scored_docs, key=lambda x: -x[1])[:top_k]]

def rrf_fusion(rankings: list[list], k: int = 60) -> list:
    """Reciprocal Rank Fusion"""
    scores = {}
    for ranking in rankings:
        for rank, doc in enumerate(ranking):
            doc_id = id(doc)
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank + 1)

    sorted_ids = sorted(scores.items(), key=lambda x: -x[1])
    return sorted_ids
`
      }
    }
  ]
}

const day3: Day = {
  slug: 'contextual-compression',
  title: 'Contextual Compression',
  totalDuration: 180,
  tasks: [
    {
      id: 'compression-video',
      type: 'video',
      title: 'Context 압축 기법',
      duration: 35,
      content: {
        objectives: ['컨텍스트 압축의 필요성을 이해한다', 'LLM 기반 압축을 구현한다', '관련 정보만 추출한다'],
        videoUrl: 'https://www.youtube.com/watch?v=compression-placeholder',
        transcript: `
## Contextual Compression

### 문제: 긴 컨텍스트

\`\`\`
검색된 문서 (각 1000토큰) × 5개 = 5000토큰
├── 토큰 비용 증가
├── 노이즈 포함
├── LLM 집중력 분산
└── 답변 품질 저하
\`\`\`

### LLM Extractor

\`\`\`python
from langchain.retrievers.document_compressors import LLMChainExtractor

compressor = LLMChainExtractor.from_llm(llm)

compressed_docs = compressor.compress_documents(
    documents=docs,
    query=question
)
# 관련 부분만 추출
\`\`\`

### Document Compressor Pipeline

\`\`\`python
from langchain.retrievers.document_compressors import DocumentCompressorPipeline
from langchain.retrievers.document_compressors import EmbeddingsFilter

# 임베딩 유사도 필터
embeddings_filter = EmbeddingsFilter(
    embeddings=embeddings,
    similarity_threshold=0.7
)

pipeline = DocumentCompressorPipeline(
    transformers=[embeddings_filter, compressor]
)
\`\`\`
        `
      }
    },
    {
      id: 'compression-practice',
      type: 'code',
      title: 'Context 압축 실습',
      duration: 90,
      content: {
        objectives: ['컨텍스트 압축 파이프라인을 구현한다'],
        instructions: '검색 결과를 압축하여 토큰을 절약하세요.',
        starterCode: `# Contextual Compression 구현`,
        solutionCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document

class ContextCompressor:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.prompt = ChatPromptTemplate.from_template("""
질문과 관련된 정보만 추출하세요.
관련 없으면 빈 문자열을 반환하세요.

질문: {question}
문서: {document}

관련 정보:""")

    def compress(self, question: str, docs: list[Document]) -> list[Document]:
        compressed = []
        for doc in docs:
            chain = self.prompt | self.llm
            result = chain.invoke({
                "question": question,
                "document": doc.page_content
            })
            if result.content.strip():
                compressed.append(Document(
                    page_content=result.content,
                    metadata=doc.metadata
                ))
        return compressed
`
      }
    }
  ]
}

const day4: Day = {
  slug: 'self-rag',
  title: 'Self-RAG & CRAG',
  totalDuration: 180,
  tasks: [
    {
      id: 'self-rag-video',
      type: 'video',
      title: 'Self-RAG & CRAG',
      duration: 35,
      content: {
        objectives: ['Self-RAG 패턴을 이해한다', 'CRAG (Corrective RAG)를 학습한다', '자기 교정 메커니즘을 구현한다'],
        videoUrl: 'https://www.youtube.com/watch?v=self-rag-placeholder',
        transcript: `
## Self-RAG & CRAG

### Self-RAG

\`\`\`
질문 → 검색 필요 판단 → [Yes] → 검색 → 관련성 평가
                     ↓
                   [No] → 직접 생성
                     ↓
           답변 생성 → 지지도 평가 → 유용성 평가 → 최종 답변
\`\`\`

### CRAG (Corrective RAG)

\`\`\`
검색 결과 평가:
├── Correct: 검색 결과 사용
├── Ambiguous: 웹 검색 보강
└── Incorrect: 웹 검색으로 대체

→ 검색 품질에 따라 동적 조정
\`\`\`
        `
      }
    },
    {
      id: 'self-rag-practice',
      type: 'code',
      title: 'Self-RAG 실습',
      duration: 90,
      content: {
        objectives: ['자기 교정 RAG를 구현한다'],
        instructions: '검색 결과 품질을 평가하고 교정하는 RAG를 구현하세요.',
        starterCode: `# Self-RAG 구현`,
        solutionCode: `from langchain_openai import ChatOpenAI
from enum import Enum

class RetrievalQuality(Enum):
    CORRECT = "correct"
    AMBIGUOUS = "ambiguous"
    INCORRECT = "incorrect"

class SelfRAG:
    def __init__(self, retriever):
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.retriever = retriever

    def _needs_retrieval(self, question: str) -> bool:
        prompt = f"이 질문에 답하려면 외부 정보가 필요한가요? (yes/no)\\n{question}"
        response = self.llm.invoke(prompt)
        return "yes" in response.content.lower()

    def _evaluate_relevance(self, question: str, docs: list) -> RetrievalQuality:
        if not docs:
            return RetrievalQuality.INCORRECT
        prompt = f"""검색 결과가 질문에 얼마나 관련있나요?
질문: {question}
결과: {docs[0].page_content[:200]}
평가 (correct/ambiguous/incorrect):"""
        response = self.llm.invoke(prompt)
        content = response.content.lower()
        if "correct" in content:
            return RetrievalQuality.CORRECT
        elif "incorrect" in content:
            return RetrievalQuality.INCORRECT
        return RetrievalQuality.AMBIGUOUS

    def query(self, question: str) -> str:
        if not self._needs_retrieval(question):
            return self.llm.invoke(question).content

        docs = self.retriever.invoke(question)
        quality = self._evaluate_relevance(question, docs)

        if quality == RetrievalQuality.INCORRECT:
            return "관련 정보를 찾을 수 없습니다."

        context = "\\n".join(d.page_content for d in docs[:3])
        prompt = f"컨텍스트:\\n{context}\\n\\n질문: {question}\\n답변:"
        return self.llm.invoke(prompt).content
`
      }
    }
  ]
}

const day5: Day = {
  slug: 'advanced-rag-project',
  title: '고급 RAG 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'advanced-rag-challenge',
      type: 'challenge',
      title: '프로덕션 RAG 시스템',
      duration: 180,
      content: {
        objectives: ['고급 RAG 기법을 통합한다', '프로덕션 수준의 품질을 달성한다'],
        requirements: [
          '**Query 처리**',
          '- HyDE 또는 Multi-Query',
          '- 쿼리 분류 및 라우팅',
          '',
          '**검색 최적화**',
          '- Re-ranking (Cohere/LLM)',
          '- Contextual Compression',
          '',
          '**품질 보장**',
          '- Self-RAG 패턴',
          '- 답변 검증',
          '- Fallback 처리'
        ],
        evaluationCriteria: ['Query 변환 (25%)', '검색 품질 (25%)', '답변 정확도 (25%)', '시스템 완성도 (25%)'],
        bonusPoints: ['하이브리드 검색', 'A/B 테스트 프레임워크', '평가 자동화', 'Streamlit 대시보드']
      }
    }
  ]
}

export const advancedRagWeek: Week = {
  slug: 'advanced-rag',
  week: 4,
  phase: 5,
  month: 10,
  access: 'pro',
  title: '고급 RAG 패턴',
  topics: ['HyDE', 'Multi-Query', 'Re-ranking', 'CRAG', 'Self-RAG', 'Compression'],
  practice: '프로덕션 RAG 시스템',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
