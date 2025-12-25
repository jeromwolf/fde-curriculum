// Day 1: RAG 아키텍처 개요

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day1RagArchitecture: Day = {
  slug: 'rag-architecture',
  title: 'RAG 아키텍처 개요',
  totalDuration: 240,
  tasks: [
    createVideoTask('w5d1-rag-intro', 'RAG란 무엇인가?', 30, {
      introduction: `
# RAG (Retrieval-Augmented Generation) 개요

## RAG의 정의

**RAG**는 LLM의 생성 능력에 **외부 지식 검색**을 결합한 아키텍처입니다.

\`\`\`
전통적인 LLM:
  질문 → [LLM] → 답변 (학습 데이터에만 의존)

RAG 시스템:
  질문 → [검색] → 관련 문서 → [LLM + 컨텍스트] → 답변
\`\`\`

## RAG가 필요한 이유

### 1. LLM의 한계

| 한계 | 설명 |
|------|------|
| **지식 컷오프** | 학습 이후 정보 모름 |
| **환각(Hallucination)** | 사실이 아닌 내용 생성 |
| **도메인 특화 부족** | 전문 분야 지식 한계 |
| **비용** | 모든 것을 학습시키면 비용 폭발 |

### 2. RAG의 장점

- ✅ **최신 정보 반영**: 검색 기반으로 실시간 업데이트
- ✅ **사실 기반 답변**: 출처 명시 가능
- ✅ **비용 효율적**: Fine-tuning 없이 지식 확장
- ✅ **도메인 적응**: 회사 내부 문서 등 활용

## RAG vs Fine-tuning

| 방식 | 장점 | 단점 |
|------|------|------|
| **RAG** | 빠른 업데이트, 출처 추적 | 검색 품질에 의존 |
| **Fine-tuning** | 깊은 패턴 학습 | 비용, 시간, 재학습 필요 |
| **RAG + Fine-tuning** | 최적의 조합 | 복잡도 증가 |

## 활용 사례

1. **기업 지식 챗봇**: 내부 문서 Q&A
2. **고객 지원**: FAQ + 매뉴얼 검색
3. **코드 어시스턴트**: 코드베이스 이해
4. **연구 도우미**: 논문 검색 및 요약
      `,
      keyPoints: ['RAG = 검색 + 생성의 결합', 'LLM 한계(환각, 컷오프) 해결', 'Fine-tuning 대비 비용 효율적'],
      practiceGoal: 'RAG의 개념과 필요성을 이해한다',
    }),

    createReadingTask('w5d1-rag-components', 'RAG 핵심 컴포넌트', 35, {
      introduction: `
# RAG 핵심 컴포넌트

## 아키텍처 개요

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                     RAG 파이프라인                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [문서]     [청킹]     [임베딩]     [벡터 DB]                  │
│    ↓         ↓          ↓           ↓                       │
│  PDF  →  Chunks  →  Vectors  →  저장/인덱싱                  │
│  TXT     (500자)    (1536dim)                                │
│  HTML                                                        │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                     쿼리 시점                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [질문]  →  [임베딩]  →  [유사도 검색]  →  [Top-K 청크]       │
│                              ↓                               │
│              [프롬프트 + 컨텍스트]  →  [LLM]  →  [답변]       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 1. 문서 로더 (Document Loader)

다양한 소스에서 텍스트 추출:

\`\`\`python
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    WebBaseLoader,
    UnstructuredHTMLLoader,
)

# PDF 로드
loader = PyPDFLoader("document.pdf")
pages = loader.load()

# 웹페이지 로드
web_loader = WebBaseLoader("https://example.com/article")
docs = web_loader.load()
\`\`\`

## 2. 텍스트 분할기 (Text Splitter)

문서를 적절한 크기의 청크로 분할:

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,        # 청크 크기
    chunk_overlap=50,      # 중첩 (문맥 유지)
    separators=["\\n\\n", "\\n", " ", ""]
)

chunks = splitter.split_documents(pages)
\`\`\`

## 3. 임베딩 모델 (Embedding Model)

텍스트를 벡터로 변환:

\`\`\`python
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small"  # 1536 차원
)

# 단일 텍스트 임베딩
vector = embeddings.embed_query("RAG란 무엇인가?")
print(len(vector))  # 1536
\`\`\`

## 4. 벡터 저장소 (Vector Store)

임베딩을 저장하고 검색:

\`\`\`python
from langchain_community.vectorstores import Chroma

# 벡터 DB 생성
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# 유사도 검색
results = vectorstore.similarity_search(
    "RAG 아키텍처",
    k=3  # Top-3
)
\`\`\`

## 5. 검색기 (Retriever)

벡터 저장소를 검색 인터페이스로 래핑:

\`\`\`python
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}
)

docs = retriever.invoke("RAG의 장점은?")
\`\`\`

## 6. LLM + 프롬프트

검색된 컨텍스트로 답변 생성:

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

llm = ChatOpenAI(model="gpt-4o-mini")

prompt = ChatPromptTemplate.from_template("""
다음 컨텍스트를 기반으로 질문에 답하세요.
컨텍스트에 없는 내용은 "모르겠습니다"라고 답하세요.

컨텍스트:
{context}

질문: {question}

답변:
""")
\`\`\`
      `,
      keyPoints: ['6개 핵심 컴포넌트: 로더, 분할기, 임베딩, 벡터DB, 검색기, LLM', '인덱싱 단계와 쿼리 단계 분리', 'LangChain으로 컴포넌트 조합'],
      practiceGoal: 'RAG 파이프라인의 각 컴포넌트 역할을 이해한다',
    }),

    createCodeTask('w5d1-simple-rag', '간단한 RAG 구현', 50, {
      introduction: `
# 간단한 RAG 시스템 구현

## 목표

텍스트 파일 기반의 간단한 Q&A 시스템을 구축합니다.

## 설치

\`\`\`bash
pip install langchain langchain-openai chromadb
\`\`\`

## 전체 코드

\`\`\`python
import os
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# 1. 환경 설정
os.environ["OPENAI_API_KEY"] = "your-api-key"

# 2. 샘플 문서
documents = [
    "RAG는 Retrieval-Augmented Generation의 약자입니다.",
    "RAG는 검색과 생성을 결합한 AI 아키텍처입니다.",
    "벡터 데이터베이스는 임베딩을 저장하고 유사도 검색을 수행합니다.",
    "Chroma는 오픈소스 벡터 데이터베이스입니다.",
    "LangChain은 LLM 애플리케이션 프레임워크입니다.",
]

# 3. 텍스트 분할 (이미 짧아서 생략 가능)
splitter = RecursiveCharacterTextSplitter(
    chunk_size=200,
    chunk_overlap=20
)

# Document 객체로 변환
from langchain.schema import Document
docs = [Document(page_content=text) for text in documents]

# 4. 임베딩 & 벡터 저장소
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(docs, embeddings)

# 5. 검색기
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

# 6. 프롬프트
prompt = ChatPromptTemplate.from_template("""
다음 컨텍스트를 기반으로 질문에 답하세요:

{context}

질문: {question}
답변:""")

# 7. LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# 8. 체인 구성
def format_docs(docs):
    return "\\n\\n".join(doc.page_content for doc in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# 9. 질문하기
question = "RAG가 뭐야?"
answer = rag_chain.invoke(question)
print(f"Q: {question}")
print(f"A: {answer}")
\`\`\`

## 실행 결과

\`\`\`
Q: RAG가 뭐야?
A: RAG는 Retrieval-Augmented Generation의 약자로,
검색과 생성을 결합한 AI 아키텍처입니다.
\`\`\`

## 실습 과제

1. 자신만의 문서 5개 추가하기
2. 다양한 질문으로 테스트
3. k값 변경하며 결과 비교
      `,
      keyPoints: ['LangChain으로 RAG 체인 구성', 'LCEL(|) 문법으로 파이프라인 연결', 'format_docs로 컨텍스트 포매팅'],
      practiceGoal: '간단한 RAG 시스템을 직접 구현한다',
    }),

    createReadingTask('w5d1-rag-patterns', 'RAG 패턴과 변형', 30, {
      introduction: `
# RAG 패턴과 변형

## 기본 RAG (Naive RAG)

\`\`\`
질문 → 검색 → Top-K → LLM → 답변
\`\`\`

단순하지만 효과적. 대부분의 사용 사례에 충분.

## Advanced RAG 패턴

### 1. Query Transformation

질문을 검색에 최적화된 형태로 변환:

\`\`\`python
# 원래 질문
"RAG에서 청킹 사이즈는 어떻게 정하면 되나요?"

# 변환된 쿼리
"RAG chunking size best practices optimal settings"
\`\`\`

### 2. Hypothetical Document Embedding (HyDE)

가상의 답변을 먼저 생성하고 그것으로 검색:

\`\`\`
질문 → [LLM: 가상 답변 생성] → [임베딩] → 검색
\`\`\`

### 3. Multi-Query RAG

하나의 질문을 여러 관점으로 분해:

\`\`\`python
원래: "RAG 시스템의 성능을 어떻게 개선할 수 있나요?"

분해:
- "RAG 검색 정확도 향상 방법"
- "RAG 응답 품질 개선"
- "RAG 시스템 최적화 기법"
\`\`\`

### 4. Self-RAG

LLM이 스스로 검색 필요 여부 판단:

\`\`\`
질문 → [검색 필요?] → Yes → 검색 → [관련성 평가] → 답변
                    → No → 직접 답변
\`\`\`

### 5. Corrective RAG (CRAG)

검색 결과의 품질을 평가하고 보정:

\`\`\`
검색 결과 → [품질 평가]
  → 좋음: 그대로 사용
  → 애매함: 웹 검색으로 보완
  → 나쁨: 쿼리 재작성 후 재검색
\`\`\`

## 패턴 선택 가이드

| 패턴 | 사용 상황 | 복잡도 |
|------|----------|--------|
| Naive RAG | 대부분의 경우 | 낮음 |
| Query Transform | 전문 용어가 많을 때 | 중간 |
| Multi-Query | 복잡한 질문 | 중간 |
| HyDE | 검색 품질이 낮을 때 | 중간 |
| Self-RAG | 다양한 질문 유형 | 높음 |
| CRAG | 높은 정확도 필요 | 높음 |

## 권장 접근법

1. **Naive RAG로 시작**
2. 성능 측정 (정확도, 응답 품질)
3. 병목 지점 파악
4. 필요한 패턴만 선택적 적용
      `,
      keyPoints: ['Naive RAG로 시작이 기본', 'Query Transformation으로 검색 개선', 'Self-RAG, CRAG는 고급 패턴'],
      practiceGoal: '다양한 RAG 패턴의 특징과 사용 시점을 이해한다',
    }),

    createReadingTask('w5d1-rag-evaluation', 'RAG 평가 지표', 25, {
      introduction: `
# RAG 평가 지표

## 평가의 중요성

RAG 시스템은 **검색**과 **생성** 두 단계를 모두 평가해야 합니다.

## 1. 검색 품질 평가

### Precision@K

상위 K개 중 관련 문서 비율:

\`\`\`
Precision@3 = 관련 문서 수 / 3

예: [관련, 비관련, 관련] → 2/3 = 0.67
\`\`\`

### Recall@K

전체 관련 문서 중 검색된 비율:

\`\`\`
Recall@5 = 검색된 관련 문서 / 전체 관련 문서

예: 전체 10개 중 5개 검색 → 5/10 = 0.5
\`\`\`

### MRR (Mean Reciprocal Rank)

첫 번째 관련 문서의 순위:

\`\`\`
RR = 1 / (첫 관련 문서 순위)

예: 3번째에 첫 관련 문서 → 1/3 = 0.33
\`\`\`

## 2. 생성 품질 평가

### Faithfulness (충실도)

답변이 컨텍스트에 근거하는지:

\`\`\`
컨텍스트: "RAG는 2020년에 발표되었다"
답변: "RAG는 2020년에 처음 소개되었습니다" ✅
답변: "RAG는 2018년에 개발되었습니다" ❌
\`\`\`

### Answer Relevance (답변 관련성)

질문에 적절히 답했는지:

\`\`\`
질문: "RAG의 장점은?"
답변: "RAG의 장점은 최신 정보 반영..." ✅
답변: "RAG는 2020년에 발표되었습니다" ❌
\`\`\`

### Context Relevance (컨텍스트 관련성)

검색된 컨텍스트가 질문과 관련 있는지:

## 3. RAGAS 프레임워크

\`\`\`python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)

# 평가 데이터셋 준비
dataset = {
    "question": ["RAG가 뭐야?"],
    "answer": ["RAG는 검색 증강 생성입니다"],
    "contexts": [["RAG는 Retrieval-Augmented..."]],
    "ground_truth": ["검색 기반 생성 AI"]
}

# 평가 실행
result = evaluate(
    dataset,
    metrics=[faithfulness, answer_relevancy]
)
print(result)
\`\`\`

## 평가 체크리스트

- [ ] 검색이 관련 문서를 가져오는가?
- [ ] 답변이 컨텍스트에 근거하는가?
- [ ] 답변이 질문에 적절한가?
- [ ] 환각(hallucination)이 없는가?
      `,
      keyPoints: ['검색 평가: Precision, Recall, MRR', '생성 평가: Faithfulness, Relevance', 'RAGAS로 자동화된 평가'],
      practiceGoal: 'RAG 시스템의 품질을 측정하는 방법을 이해한다',
    }),

    createQuizTask('w5d1-quiz', 'Day 1 복습 퀴즈', 15, {
      introduction: '# Day 1 복습 퀴즈',
      questions: [
        {
          id: 'w5d1-q1',
          question: 'RAG에서 R은 무엇의 약자인가?',
          options: ['Response', 'Retrieval', 'Reasoning', 'Representation'],
          correctAnswer: 1,
          explanation: 'RAG는 Retrieval-Augmented Generation의 약자입니다.',
        },
        {
          id: 'w5d1-q2',
          question: 'RAG의 주요 장점이 아닌 것은?',
          options: ['최신 정보 반영', '환각 감소', '학습 데이터 불필요', '도메인 특화 가능'],
          correctAnswer: 2,
          explanation: 'RAG도 LLM을 사용하므로 LLM의 기본 학습 데이터는 여전히 필요합니다.',
        },
        {
          id: 'w5d1-q3',
          question: 'RAG 파이프라인에서 텍스트를 벡터로 변환하는 단계는?',
          options: ['Chunking', 'Embedding', 'Retrieval', 'Generation'],
          correctAnswer: 1,
          explanation: 'Embedding 단계에서 텍스트를 고차원 벡터로 변환합니다.',
        },
      ],
      keyPoints: ['RAG = Retrieval-Augmented Generation', 'RAG는 검색 + 생성 결합', 'Embedding으로 텍스트 벡터화'],
      practiceGoal: 'RAG 기초 개념을 확인한다',
    }),
  ],

  challenge: createChallengeTask('w5d1-challenge', 'Challenge: 나만의 RAG 시스템', 55, {
    introduction: `
# Challenge: 나만의 RAG 시스템

## 과제

자신의 관심 분야 문서로 RAG 시스템을 구축하세요.

## 요구사항

1. **문서 준비** (최소 5개)
   - 블로그 글, 논문 요약, 강의 노트 등
   - 또는 위키피디아 문서 크롤링

2. **RAG 파이프라인 구축**
   - 문서 로드 및 청킹
   - 벡터 저장소 생성
   - 검색기 + LLM 체인

3. **테스트 질문 5개**
   - 다양한 유형의 질문 준비
   - 예상 답변과 실제 답변 비교

4. **결과 분석**
   - 어떤 질문에서 잘 작동하는가?
   - 실패하는 케이스는?

## 제출물

- Python 코드 (.py 또는 .ipynb)
- 테스트 결과 스크린샷
- 간단한 분석 리포트 (300자)
    `,
    keyPoints: ['나만의 도메인 문서 활용', '전체 파이프라인 구축', '결과 분석 및 개선점 도출'],
    practiceGoal: '실제 RAG 시스템을 처음부터 끝까지 구축한다',
  }),
}
