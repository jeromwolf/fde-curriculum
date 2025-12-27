// Day 4: LangChain RAG 파이프라인 - 완전 리뉴얼 버전

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day4LangchainRag: Day = {
  slug: 'langchain-rag',
  title: 'LangChain RAG 파이프라인',
  totalDuration: 300, // 5시간
  tasks: [
    // ========================================
    // Task 1: LangChain 아키텍처와 LCEL 심화 (40분)
    // ========================================
    createVideoTask('w5d4-langchain-architecture', 'LangChain 아키텍처와 LCEL 심화', 40, {
      introduction: `
## 학습 목표
- LangChain의 핵심 아키텍처를 이해한다
- LCEL(LangChain Expression Language)을 마스터한다
- Runnable 인터페이스와 체인 구성을 학습한다

---

## LangChain 생태계 (2024-2025)

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    LangChain 생태계                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  langchain  │  │ langchain-  │  │ langchain-  │     │
│  │   (core)    │  │   openai    │  │   chroma    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│         │                │                │             │
│         └────────────────┴────────────────┘             │
│                          │                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  langgraph  │  │  langsmith  │  │  langserve  │     │
│  │  (에이전트)  │  │  (모니터링)  │  │   (배포)    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘

langchain: 핵심 추상화, 체인, 프롬프트
langchain-core: LCEL, Runnable 인터페이스
langchain-openai: OpenAI 통합
langchain-community: 100+ 통합 (Chroma, Pinecone, etc.)
langgraph: 복잡한 에이전트 워크플로우
langsmith: 추적, 평가, 모니터링
langserve: REST API로 배포
\`\`\`

---

## LCEL (LangChain Expression Language)

### LCEL이란?

\`\`\`python
# 전통적인 방식 (Legacy Chain)
from langchain.chains import LLMChain

chain = LLMChain(llm=llm, prompt=prompt)
result = chain.run(input_text)

# LCEL 방식 (현대적)
chain = prompt | llm | output_parser
result = chain.invoke(input_text)
\`\`\`

**LCEL의 장점:**
- 선언적이고 직관적인 문법
- 자동 스트리밍 지원
- 자동 배치 처리
- 자동 병렬 실행
- 타입 안전성
- LangSmith 통합

---

### Runnable 인터페이스

\`\`\`python
from langchain_core.runnables import Runnable

# 모든 LCEL 컴포넌트는 Runnable 인터페이스 구현
class Runnable:
    # 동기 실행
    def invoke(self, input) -> output:
        pass

    # 배치 실행
    def batch(self, inputs: list) -> list[output]:
        pass

    # 스트리밍 (동기)
    def stream(self, input) -> Iterator[output]:
        pass

    # 비동기 실행
    async def ainvoke(self, input) -> output:
        pass

    # 비동기 배치
    async def abatch(self, inputs: list) -> list[output]:
        pass

    # 비동기 스트리밍
    async def astream(self, input) -> AsyncIterator[output]:
        pass
\`\`\`

---

### 파이프 연산자 (|)

\`\`\`python
# | 연산자: 왼쪽 출력 → 오른쪽 입력

chain = prompt | llm | output_parser
#       ↓        ↓        ↓
#   PromptValue → Message → String

# 실행
result = chain.invoke({"question": "RAG란?"})
\`\`\`

---

### 주요 Runnable 클래스

\`\`\`python
from langchain_core.runnables import (
    RunnablePassthrough,   # 입력을 그대로 전달
    RunnableLambda,        # 함수를 Runnable로 래핑
    RunnableParallel,      # 병렬 실행
    RunnableBranch,        # 조건부 분기
    RunnableSequence,      # 순차 실행 (| 연산자)
)

# 1. RunnablePassthrough: 입력 그대로 전달
chain = {
    "context": retriever,
    "question": RunnablePassthrough()  # 입력된 질문 그대로
}

# 2. RunnableLambda: 함수 래핑
def format_docs(docs):
    return "\\n".join(doc.page_content for doc in docs)

chain = retriever | RunnableLambda(format_docs)

# 3. RunnableParallel: 병렬 실행
parallel = RunnableParallel({
    "context": retriever | format_docs,
    "question": RunnablePassthrough(),
    "history": get_history
})

# 4. RunnableBranch: 조건부 분기
from langchain_core.runnables import RunnableBranch

branch = RunnableBranch(
    (lambda x: "코드" in x, code_chain),
    (lambda x: "요약" in x, summary_chain),
    default_chain  # 기본값
)
\`\`\`

---

### itemgetter와 조합

\`\`\`python
from operator import itemgetter

# 딕셔너리에서 특정 키 추출
chain = (
    {
        "context": itemgetter("docs") | format_docs,
        "question": itemgetter("question")
    }
    | prompt
    | llm
)

# 사용
result = chain.invoke({
    "docs": [doc1, doc2],
    "question": "RAG란?"
})
\`\`\`

---

## 체인 구성 패턴

### 패턴 1: 기본 RAG 체인

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini")

prompt = ChatPromptTemplate.from_template("""
Context: {context}
Question: {question}
Answer:""")

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
\`\`\`

### 패턴 2: 소스 포함 RAG

\`\`\`python
from langchain_core.runnables import RunnableParallel

rag_with_sources = RunnableParallel({
    "answer": rag_chain,
    "sources": retriever | (lambda docs: [d.metadata for d in docs])
})

result = rag_with_sources.invoke("RAG란?")
# {"answer": "...", "sources": [{"source": "doc1.pdf"}, ...]}
\`\`\`

### 패턴 3: 재시도 래퍼

\`\`\`python
from langchain_core.runnables import RunnableWithFallbacks

reliable_llm = llm.with_retry(
    stop_after_attempt=3,
    wait_exponential_jitter=True
).with_fallbacks([backup_llm])

rag_chain = prompt | reliable_llm | StrOutputParser()
\`\`\`
      `,
      keyPoints: [
        'LCEL: 선언적이고 타입 안전한 체인 구성',
        'Runnable 인터페이스: invoke, batch, stream 지원',
        'RunnableParallel로 병렬 실행, RunnableBranch로 조건부 분기',
      ],
      practiceGoal: 'LangChain 아키텍처와 LCEL을 이해한다',
    }),

    // ========================================
    // Task 2: 프로덕션급 RAG 체인 구축 (50분)
    // ========================================
    createCodeTask('w5d4-production-rag-chain', '프로덕션급 RAG 체인 구축', 50, {
      introduction: `
## 왜 배우는가?

**문제**: LangChain 튜토리얼을 보면 "chain = prompt | llm"처럼 5줄로 RAG가 끝나는데, 프로덕션에 올리면 폭발합니다.
- API 에러 나면 시스템 전체 다운
- 느린 응답 (10초+)
- 소스 추적 불가능
- 비용 폭탄

**해결**: 재시도, 폴백, 캐싱, 소스 추적이 있는 프로덕션급 체인을 구축합니다.

---

## 비유: RAG 체인 = 자동차 공장 조립 라인

\`\`\`
튜토리얼 RAG = 수제 자동차
- 직접 조립 (느림)
- 고장 나면 멈춤
- 어디서 고장났는지 모름

프로덕션 RAG = 현대 자동차 공장
- 자동화 조립 라인 (빠름)
- 고장 나면 백업 라인으로 전환
- 각 단계 모니터링
- 품질 검사 (소스 추적)
\`\`\`

---

## 핵심 구현 (간소화)

\`\`\`python
# 📌 Step 1: 재시도 설정
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini").with_retry(
    stop_after_attempt=3,  # 3번까지 재시도
    wait_exponential_jitter=True  # 지수 백오프
)

# 📌 Step 2: RAG 체인 (소스 추적 포함)
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

chain = RunnableParallel({
    "docs": retriever,  # 문서 검색
    "question": RunnablePassthrough()
}) | RunnableParallel({
    "answer": (
        lambda x: {"context": format_docs(x["docs"]), "question": x["question"]}
        | prompt
        | llm
    ),
    "sources": lambda x: [d.metadata for d in x["docs"]]  # ✅ 소스 추적
})

result = chain.invoke("RAG란?")
print(f"Answer: {result['answer']}")
print(f"Sources: {result['sources']}")

# 📌 Step 3: 스트리밍
for chunk in chain.stream("RAG란?"):
    if "answer" in chunk:
        print(chunk["answer"], end="", flush=True)

# 📌 Step 4: 배치 처리
questions = ["RAG란?", "벡터 DB란?", "LangChain이란?"]
results = chain.batch(questions)
\`\`\`

---

## 전체 코드 (상세)

### 설치

\`\`\`bash
pip install langchain langchain-openai langchain-chroma chromadb
\`\`\`

---

## 프로덕션급 RAG 클래스

\`\`\`python
from dataclasses import dataclass
from typing import Optional
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.output_parsers import StrOutputParser
from langchain.schema import Document
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class RAGConfig:
    """RAG 설정"""
    model: str = "gpt-4o-mini"
    embedding_model: str = "text-embedding-3-small"
    chunk_size: int = 500
    chunk_overlap: int = 50
    k: int = 5
    temperature: float = 0
    max_retries: int = 3

@dataclass
class RAGResponse:
    """RAG 응답"""
    answer: str
    sources: list[dict]
    context: str

class ProductionRAGChain:
    """프로덕션급 RAG 체인"""

    def __init__(
        self,
        config: RAGConfig = RAGConfig(),
        persist_directory: Optional[str] = None
    ):
        self.config = config
        self.persist_directory = persist_directory

        # 컴포넌트 초기화
        self._init_components()

    def _init_components(self):
        """컴포넌트 초기화"""
        # 임베딩
        self.embeddings = OpenAIEmbeddings(
            model=self.config.embedding_model
        )

        # LLM (재시도 + 폴백 설정)
        self.llm = ChatOpenAI(
            model=self.config.model,
            temperature=self.config.temperature
        ).with_retry(
            stop_after_attempt=self.config.max_retries,
            wait_exponential_jitter=True
        )

        # 텍스트 분할기
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.config.chunk_size,
            chunk_overlap=self.config.chunk_overlap,
            separators=["\\n\\n", "\\n", ".", " ", ""]
        )

        # 프롬프트
        self.prompt = ChatPromptTemplate.from_template("""
당신은 주어진 컨텍스트를 기반으로 질문에 답하는 도우미입니다.

규칙:
1. 컨텍스트에 있는 정보만 사용하세요.
2. 확실하지 않으면 "잘 모르겠습니다"라고 답하세요.
3. 답변은 간결하고 정확하게 작성하세요.
4. 가능하면 근거를 함께 제시하세요.

컨텍스트:
{context}

질문: {question}

답변:""")

        # 벡터 저장소 (나중에 초기화)
        self.vectorstore = None
        self.retriever = None

    def load_documents(self, documents: list[Document]):
        """문서 로드 및 벡터 저장소 생성"""
        logger.info(f"Loading {len(documents)} documents...")

        # 문서 분할
        splits = self.splitter.split_documents(documents)
        logger.info(f"Split into {len(splits)} chunks")

        # 벡터 저장소 생성
        if self.persist_directory:
            self.vectorstore = Chroma.from_documents(
                splits,
                self.embeddings,
                persist_directory=self.persist_directory
            )
        else:
            self.vectorstore = Chroma.from_documents(
                splits,
                self.embeddings
            )

        # 검색기 생성
        self.retriever = self.vectorstore.as_retriever(
            search_kwargs={"k": self.config.k}
        )

        logger.info("Vector store created successfully")

    def _format_docs(self, docs: list[Document]) -> str:
        """문서 포매팅"""
        return "\\n\\n---\\n\\n".join(doc.page_content for doc in docs)

    def _extract_sources(self, docs: list[Document]) -> list[dict]:
        """소스 정보 추출"""
        sources = []
        for doc in docs:
            source = {
                "content_preview": doc.page_content[:100] + "...",
                **doc.metadata
            }
            sources.append(source)
        return sources

    def _build_chain(self):
        """RAG 체인 구성"""
        return (
            RunnableParallel({
                "docs": self.retriever,
                "question": RunnablePassthrough()
            })
            | RunnableParallel({
                "answer": (
                    lambda x: {
                        "context": self._format_docs(x["docs"]),
                        "question": x["question"]
                    }
                )
                | self.prompt
                | self.llm
                | StrOutputParser(),
                "sources": lambda x: self._extract_sources(x["docs"]),
                "context": lambda x: self._format_docs(x["docs"])
            })
        )

    def query(self, question: str) -> RAGResponse:
        """질문에 답변"""
        if not self.retriever:
            raise ValueError("문서를 먼저 로드하세요: load_documents()")

        chain = self._build_chain()

        try:
            result = chain.invoke(question)
            return RAGResponse(
                answer=result["answer"],
                sources=result["sources"],
                context=result["context"]
            )
        except Exception as e:
            logger.error(f"Query failed: {e}")
            raise

    def stream(self, question: str):
        """스트리밍 응답"""
        if not self.retriever:
            raise ValueError("문서를 먼저 로드하세요: load_documents()")

        # 스트리밍용 간소화된 체인
        stream_chain = (
            {"context": self.retriever | self._format_docs, "question": RunnablePassthrough()}
            | self.prompt
            | self.llm
            | StrOutputParser()
        )

        for chunk in stream_chain.stream(question):
            yield chunk

    def batch_query(self, questions: list[str]) -> list[RAGResponse]:
        """배치 질문"""
        if not self.retriever:
            raise ValueError("문서를 먼저 로드하세요: load_documents()")

        chain = self._build_chain()
        results = chain.batch(questions)

        return [
            RAGResponse(
                answer=r["answer"],
                sources=r["sources"],
                context=r["context"]
            )
            for r in results
        ]
\`\`\`

---

## 사용 예시

\`\`\`python
# 1. 문서 준비
documents = [
    Document(
        page_content="""
        RAG(Retrieval-Augmented Generation)는 2020년 Meta AI에서 발표한 기술입니다.
        외부 지식 베이스에서 관련 정보를 검색하여 LLM의 응답을 개선합니다.
        주요 장점으로는 환각 감소, 최신 정보 활용, 도메인 특화 등이 있습니다.
        """,
        metadata={"source": "rag_intro.md", "page": 1}
    ),
    Document(
        page_content="""
        LangChain은 LLM 애플리케이션 개발을 위한 프레임워크입니다.
        LCEL(LangChain Expression Language)을 통해 선언적으로 체인을 구성할 수 있습니다.
        다양한 벡터 저장소, LLM, 도구와 통합됩니다.
        """,
        metadata={"source": "langchain_intro.md", "page": 1}
    ),
    Document(
        page_content="""
        벡터 데이터베이스는 고차원 벡터를 효율적으로 저장하고 검색합니다.
        대표적인 벡터 DB로는 Chroma, Pinecone, Weaviate, Qdrant 등이 있습니다.
        HNSW, IVF 등의 인덱싱 알고리즘을 사용합니다.
        """,
        metadata={"source": "vectordb_intro.md", "page": 1}
    )
]

# 2. RAG 체인 생성
config = RAGConfig(
    model="gpt-4o-mini",
    k=3,
    temperature=0
)

rag = ProductionRAGChain(
    config=config,
    persist_directory="./production_rag_db"
)

# 3. 문서 로드
rag.load_documents(documents)

# 4. 질문
response = rag.query("RAG의 장점은 무엇인가요?")
print(f"Answer: {response.answer}")
print(f"Sources: {response.sources}")

# 5. 스트리밍
print("\\nStreaming: ", end="")
for chunk in rag.stream("LangChain이란?"):
    print(chunk, end="", flush=True)
print()

# 6. 배치 질문
questions = ["RAG란?", "벡터 DB란?", "LangChain의 특징은?"]
responses = rag.batch_query(questions)
for q, r in zip(questions, responses):
    print(f"\\nQ: {q}")
    print(f"A: {r.answer[:100]}...")
\`\`\`
      `,
      keyPoints: [
        '🔁 with_retry()로 재시도 로직 구현',
        '⚡ RunnableParallel로 소스와 컨텍스트 동시 추출',
        '📦 batch()로 배치 처리, stream()으로 스트리밍',
      ],
      practiceGoal: '프로덕션급 RAG 체인을 구축할 수 있다',
    }),

    // ========================================
    // Task 3: 대화형 RAG (History-aware RAG) (45분)
    // ========================================
    createCodeTask('w5d4-conversational-rag', '대화형 RAG (History-aware RAG)', 45, {
      introduction: `
## 왜 배우는가?

**문제**: 일반 RAG는 매 질문을 독립적으로 처리해서, "그것", "이전에" 같은 대명사를 이해 못 합니다.
- Q1: "RAG란?" → A1: "RAG는..."
- Q2: "그것의 장점은?" → A2: ??? ("그것"이 뭐지?)

**해결**: 대화 히스토리를 유지하고 질문을 재작성하면 자연스러운 대화가 가능합니다.

---

## 비유: 대화형 RAG = 기억하는 챗봇

\`\`\`
일반 RAG = 금붕어 (3초 기억)
- Q: "삼성전자 주가는?"
- A: "10만원입니다"
- Q: "그 회사 실적은?"
- A: ??? ("그 회사"가 뭐지?)

대화형 RAG = 인간 (문맥 기억)
- Q: "삼성전자 주가는?"
- A: "10만원입니다"
- Q: "그 회사 실적은?"
- → [질문 재작성: "삼성전자 실적은?"]
- A: "영업이익 15조원입니다"
\`\`\`

---

## 핵심 구현 (간소화)

\`\`\`python
# 📌 Step 1: 질문 재작성 프롬프트
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder

contextualize_prompt = ChatPromptTemplate.from_messages([
    ("system", "대화 히스토리를 보고 질문을 독립적으로 재작성하세요."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{question}")
])

# 📌 Step 2: 히스토리 관리
class ConversationalRAG:
    def __init__(self):
        self.history = []  # 대화 히스토리

    def query(self, question: str) -> str:
        # 1️⃣ 질문 재작성 (히스토리 있으면)
        if self.history:
            contextualized_q = (contextualize_prompt | llm).invoke({
                "history": self.history,
                "question": question
            })
        else:
            contextualized_q = question

        # 2️⃣ 검색 & 답변
        docs = retriever.invoke(contextualized_q)
        answer = (qa_prompt | llm).invoke({
            "context": format_docs(docs),
            "question": question
        })

        # 3️⃣ 히스토리 업데이트
        self.history.append(HumanMessage(content=question))
        self.history.append(AIMessage(content=answer))

        return answer

# 📌 Step 3: 사용
rag = ConversationalRAG()
print(rag.query("RAG란?"))
print(rag.query("그것의 장점은?"))  # ✅ "RAG의 장점은?"으로 재작성됨!
\`\`\`

---

## 전체 코드 (상세)

### 구현

\`\`\`python
from typing import Optional
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from langchain.schema import Document
from dataclasses import dataclass, field

@dataclass
class ConversationMessage:
    """대화 메시지"""
    role: str  # "human" or "ai"
    content: str

    def to_langchain(self) -> BaseMessage:
        if self.role == "human":
            return HumanMessage(content=self.content)
        return AIMessage(content=self.content)

class ConversationalRAG:
    """대화형 RAG 시스템"""

    def __init__(
        self,
        vectorstore: Chroma,
        model: str = "gpt-4o-mini",
        k: int = 5,
        max_history: int = 10
    ):
        self.vectorstore = vectorstore
        self.retriever = vectorstore.as_retriever(search_kwargs={"k": k})
        self.max_history = max_history

        # LLM
        self.llm = ChatOpenAI(model=model, temperature=0)

        # 대화 히스토리
        self.history: list[ConversationMessage] = []

        # 프롬프트 설정
        self._setup_prompts()

    def _setup_prompts(self):
        """프롬프트 설정"""
        # 1. 질문 재작성 프롬프트
        self.contextualize_prompt = ChatPromptTemplate.from_messages([
            ("system", """대화 히스토리와 최신 사용자 질문을 기반으로,
히스토리 없이도 이해할 수 있는 독립적인 질문으로 재작성하세요.

규칙:
1. 대명사(그것, 이것, 그)를 구체적인 명사로 바꾸세요.
2. 생략된 주어나 목적어를 추가하세요.
3. 재작성이 필요 없으면 원래 질문을 그대로 반환하세요.
4. 질문 형식을 유지하세요.

재작성된 질문만 출력하세요."""),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{question}")
        ])

        # 2. QA 프롬프트
        self.qa_prompt = ChatPromptTemplate.from_messages([
            ("system", """당신은 주어진 컨텍스트를 기반으로 질문에 답하는 도우미입니다.

규칙:
1. 컨텍스트의 정보만 사용하세요.
2. 확실하지 않으면 "잘 모르겠습니다"라고 답하세요.
3. 이전 대화를 참고하여 자연스럽게 답변하세요.

컨텍스트:
{context}"""),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{question}")
        ])

    def _get_history_messages(self) -> list[BaseMessage]:
        """히스토리를 LangChain 메시지로 변환"""
        # 최근 N개만 사용
        recent = self.history[-self.max_history:]
        return [msg.to_langchain() for msg in recent]

    def _contextualize_question(self, question: str) -> str:
        """질문 재작성 (필요한 경우)"""
        if not self.history:
            return question

        chain = self.contextualize_prompt | self.llm | StrOutputParser()

        contextualized = chain.invoke({
            "history": self._get_history_messages(),
            "question": question
        })

        return contextualized.strip()

    def _format_docs(self, docs: list[Document]) -> str:
        return "\\n\\n---\\n\\n".join(doc.page_content for doc in docs)

    def query(self, question: str) -> str:
        """질문에 답변"""
        # 1. 질문 재작성
        contextualized_q = self._contextualize_question(question)
        print(f"[Debug] Original: {question}")
        print(f"[Debug] Contextualized: {contextualized_q}")

        # 2. 검색
        docs = self.retriever.invoke(contextualized_q)
        context = self._format_docs(docs)

        # 3. 답변 생성
        chain = self.qa_prompt | self.llm | StrOutputParser()
        answer = chain.invoke({
            "context": context,
            "history": self._get_history_messages(),
            "question": question  # 원래 질문 사용
        })

        # 4. 히스토리 업데이트
        self.history.append(ConversationMessage("human", question))
        self.history.append(ConversationMessage("ai", answer))

        return answer

    def clear_history(self):
        """히스토리 초기화"""
        self.history = []

    def get_history(self) -> list[ConversationMessage]:
        """히스토리 반환"""
        return self.history.copy()
\`\`\`

---

## 사용 예시

\`\`\`python
# 1. 벡터 저장소 준비 (이전에 생성)
# vectorstore = ...

# 2. 대화형 RAG 생성
conv_rag = ConversationalRAG(
    vectorstore=vectorstore,
    max_history=10
)

# 3. 대화 시작
print("=== 대화형 RAG 테스트 ===\\n")

# 첫 번째 질문
q1 = "RAG란 무엇인가요?"
a1 = conv_rag.query(q1)
print(f"User: {q1}")
print(f"AI: {a1}\\n")

# 두 번째 질문 (대명사 사용)
q2 = "그것의 주요 장점은?"
a2 = conv_rag.query(q2)
print(f"User: {q2}")
print(f"AI: {a2}\\n")

# 세 번째 질문 (이전 맥락 참조)
q3 = "다른 기술과 어떻게 다른가요?"
a3 = conv_rag.query(q3)
print(f"User: {q3}")
print(f"AI: {a3}\\n")

# 히스토리 확인
print("=== 대화 히스토리 ===")
for msg in conv_rag.get_history():
    print(f"[{msg.role}]: {msg.content[:50]}...")

# 히스토리 초기화
conv_rag.clear_history()
print("\\n히스토리가 초기화되었습니다.")
\`\`\`

---

## 세션 관리 (멀티 유저)

\`\`\`python
from uuid import uuid4

class SessionManager:
    """세션별 대화 관리"""

    def __init__(self, vectorstore: Chroma):
        self.vectorstore = vectorstore
        self.sessions: dict[str, ConversationalRAG] = {}

    def get_or_create_session(self, session_id: str = None) -> tuple[str, ConversationalRAG]:
        """세션 가져오기 또는 생성"""
        if session_id is None:
            session_id = str(uuid4())

        if session_id not in self.sessions:
            self.sessions[session_id] = ConversationalRAG(
                vectorstore=self.vectorstore
            )

        return session_id, self.sessions[session_id]

    def delete_session(self, session_id: str):
        """세션 삭제"""
        if session_id in self.sessions:
            del self.sessions[session_id]

# 사용
manager = SessionManager(vectorstore)

# 유저 A
session_a, rag_a = manager.get_or_create_session()
rag_a.query("RAG란?")

# 유저 B (별도 세션)
session_b, rag_b = manager.get_or_create_session()
rag_b.query("벡터 DB란?")

# 각 세션은 독립적인 히스토리
print(f"Session A history: {len(rag_a.get_history())} messages")
print(f"Session B history: {len(rag_b.get_history())} messages")
\`\`\`
      `,
      keyPoints: [
        '💬 질문 재작성으로 대명사 해결',
        '📝 MessagesPlaceholder로 히스토리 관리',
        '👥 SessionManager로 멀티 유저 지원',
      ],
      practiceGoal: '대화형 RAG를 구현할 수 있다',
    }),

    // ========================================
    // Task 4: 고급 RAG 패턴 (40분)
    // ========================================
    createReadingTask('w5d4-advanced-patterns', '고급 RAG 패턴', 40, {
      introduction: `
## 학습 목표
- Self-Query Retriever를 이해한다
- Parent Document Retriever를 이해한다
- Multi-Query Retriever를 이해한다

---

## 1. Self-Query Retriever

### 문제

\`\`\`
사용자: "2024년 이후 AI 관련 기술 문서 찾아줘"

일반 검색: "2024년", "AI", "기술 문서" 키워드로 의미 검색
→ 2023년 문서도 반환될 수 있음

Self-Query: 쿼리 분석 → 필터 자동 생성
→ filter: {"year": {"$gte": 2024}, "category": "AI"}
→ 정확한 결과
\`\`\`

### 구현

\`\`\`python
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain.chains.query_constructor.schema import AttributeInfo

# 메타데이터 스키마 정의
metadata_field_info = [
    AttributeInfo(
        name="category",
        description="문서의 카테고리. 예: tech, business, science",
        type="string"
    ),
    AttributeInfo(
        name="year",
        description="문서 작성 연도",
        type="integer"
    ),
    AttributeInfo(
        name="author",
        description="문서 작성자",
        type="string"
    ),
]

# Self-Query Retriever 생성
self_query_retriever = SelfQueryRetriever.from_llm(
    llm=llm,
    vectorstore=vectorstore,
    document_contents="기술 문서 및 논문",
    metadata_field_info=metadata_field_info,
    verbose=True
)

# 사용
results = self_query_retriever.invoke("2024년 김철수가 쓴 AI 관련 문서")
# 내부적으로:
# query: "AI 관련 문서"
# filter: {"year": 2024, "author": "김철수"}
\`\`\`

---

## 2. Parent Document Retriever

### 문제

\`\`\`
작은 청크로 검색:
  ✅ 정확한 검색 (특정 문장 매칭)
  ❌ 컨텍스트 부족

큰 청크로 검색:
  ✅ 풍부한 컨텍스트
  ❌ 검색 정확도 저하

해결: 작은 청크로 검색, 큰 청크 반환!
\`\`\`

### 구현

\`\`\`python
from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore

# 작은 청크 (검색용)
child_splitter = RecursiveCharacterTextSplitter(
    chunk_size=200,
    chunk_overlap=20
)

# 큰 청크 (반환용)
parent_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=100
)

# 문서 저장소
docstore = InMemoryStore()

# Parent Document Retriever 생성
parent_retriever = ParentDocumentRetriever(
    vectorstore=vectorstore,
    docstore=docstore,
    child_splitter=child_splitter,
    parent_splitter=parent_splitter
)

# 문서 추가
parent_retriever.add_documents(documents)

# 검색 (작은 청크로 검색 → 부모 청크 반환)
results = parent_retriever.invoke("RAG의 검색 단계")
# 작은 청크에서 정확한 매칭 → 1000자 부모 청크 반환
\`\`\`

---

## 3. Multi-Query Retriever

### 문제

\`\`\`
단일 쿼리 검색:
  쿼리: "RAG 성능 향상"
  → 제한된 관점의 검색 결과

Multi-Query 검색:
  원본: "RAG 성능 향상"
  확장1: "RAG 최적화 방법"
  확장2: "검색 증강 생성 개선"
  확장3: "RAG 시스템 튜닝"
  → 다양한 관점의 검색 결과
\`\`\`

### 구현

\`\`\`python
from langchain.retrievers.multi_query import MultiQueryRetriever

# Multi-Query Retriever 생성
multi_query_retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
    llm=llm
)

# 검색 (내부적으로 여러 쿼리 생성)
results = multi_query_retriever.invoke("RAG 성능 향상 방법")

# 커스텀 쿼리 생성 프롬프트
from langchain.prompts import PromptTemplate

custom_prompt = PromptTemplate(
    input_variables=["question"],
    template="""당신은 AI 검색 최적화 전문가입니다.
다음 질문에 대해 3가지 다른 관점의 검색 쿼리를 생성하세요.
각 쿼리는 새 줄로 구분하세요.

원본 질문: {question}

대체 쿼리:"""
)

multi_query_custom = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(),
    llm=llm,
    prompt=custom_prompt
)
\`\`\`

---

## 4. Contextual Compression

### 문제

\`\`\`
긴 청크에서 관련 부분만 추출

원본 청크 (500자):
"... RAG는 검색 증강 생성입니다. 이 기술은 LLM의 환각을 줄입니다.
한편 날씨는 맑았고, 점심은 김치찌개였습니다. 다시 RAG로 돌아가면..."

질문: "RAG란?"

압축된 청크:
"RAG는 검색 증강 생성입니다. 이 기술은 LLM의 환각을 줄입니다."
\`\`\`

### 구현

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

# LLM 기반 압축기
compressor = LLMChainExtractor.from_llm(llm)

# Compression Retriever 생성
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vectorstore.as_retriever(search_kwargs={"k": 10})
)

# 검색 (관련 부분만 추출)
results = compression_retriever.invoke("RAG란?")
\`\`\`

---

## 패턴 조합

\`\`\`python
# 하이브리드 + Re-ranking + Compression
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

# 1. BM25 + 벡터 앙상블
bm25 = BM25Retriever.from_documents(docs, k=10)
vector = vectorstore.as_retriever(search_kwargs={"k": 10})
ensemble = EnsembleRetriever(
    retrievers=[bm25, vector],
    weights=[0.4, 0.6]
)

# 2. Re-ranking 추가
from langchain.retrievers.document_compressors import CohereRerank

reranker = CohereRerank(top_n=5)
reranking_retriever = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=ensemble
)

# 3. 최종 압축
final_retriever = ContextualCompressionRetriever(
    base_compressor=LLMChainExtractor.from_llm(llm),
    base_retriever=reranking_retriever
)
\`\`\`

---

## 패턴 선택 가이드

| 패턴 | 문제 상황 | 해결책 |
|------|----------|--------|
| Self-Query | 메타데이터 필터 자주 필요 | 자연어 → 필터 자동 변환 |
| Parent Document | 검색 정확도 vs 컨텍스트 | 작은 청크 검색, 큰 청크 반환 |
| Multi-Query | 단일 관점 한계 | 여러 쿼리로 다양한 결과 |
| Compression | 긴 청크에 노이즈 | 관련 부분만 추출 |
      `,
      keyPoints: [
        'Self-Query: 자연어에서 메타데이터 필터 자동 추출',
        'Parent Document: 작은 청크 검색, 큰 청크 반환',
        'Multi-Query: 여러 관점의 쿼리로 다양한 결과',
      ],
      practiceGoal: '고급 RAG 패턴을 이해하고 적용할 수 있다',
    }),

    // ========================================
    // Task 5: LangSmith 모니터링 & 평가 (35분)
    // ========================================
    createReadingTask('w5d4-langsmith', 'LangSmith 모니터링 & 평가', 35, {
      introduction: `
## 학습 목표
- LangSmith의 핵심 기능을 이해한다
- RAG 파이프라인 추적을 설정한다
- 자동화된 평가를 구현한다

---

## LangSmith란?

\`\`\`
LangSmith = LLM 애플리케이션을 위한 관측성 플랫폼

핵심 기능:
1. Tracing: 체인 실행 추적
2. Debugging: 에러 디버깅
3. Evaluation: 자동화된 평가
4. Datasets: 테스트 데이터셋 관리
5. Monitoring: 프로덕션 모니터링
\`\`\`

---

## 설정

\`\`\`bash
# 설치
pip install langsmith

# 환경 변수
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY=your-api-key
export LANGCHAIN_PROJECT=my-rag-project
\`\`\`

\`\`\`python
# Python에서 설정
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-api-key"
os.environ["LANGCHAIN_PROJECT"] = "my-rag-project"
\`\`\`

---

## 자동 추적

\`\`\`python
# 환경 변수 설정만 하면 자동으로 추적!
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

llm = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template("질문: {question}")

chain = prompt | llm

# 이 호출은 자동으로 LangSmith에 기록됨
result = chain.invoke({"question": "RAG란?"})
\`\`\`

---

## 커스텀 추적

\`\`\`python
from langsmith import traceable

@traceable(name="my_rag_pipeline")
def rag_pipeline(question: str) -> str:
    """RAG 파이프라인"""
    # 검색
    docs = retriever.invoke(question)

    # 답변 생성
    answer = chain.invoke({
        "context": format_docs(docs),
        "question": question
    })

    return answer

# 태그와 메타데이터 추가
@traceable(
    name="rag_with_metadata",
    tags=["production", "v2"],
    metadata={"version": "2.0", "team": "ml"}
)
def rag_v2(question: str) -> str:
    ...
\`\`\`

---

## 피드백 수집

\`\`\`python
from langsmith import Client

client = Client()

# 실행 후 피드백 추가
run = client.read_run(run_id)
client.create_feedback(
    run.id,
    key="user-rating",
    score=1.0,  # 0.0 ~ 1.0
    comment="정확한 답변"
)

# 프로그래밍 방식 피드백
client.create_feedback(
    run.id,
    key="retrieval-precision",
    score=0.8,
    comment="5개 중 4개 관련 문서"
)
\`\`\`

---

## 자동화된 평가

\`\`\`python
from langsmith.evaluation import LangChainStringEvaluator

# 1. 데이터셋 생성
dataset = client.create_dataset("rag-test-v1")

# 예시 추가
client.create_examples(
    dataset_id=dataset.id,
    inputs=[
        {"question": "RAG란?"},
        {"question": "벡터 DB의 장점은?"}
    ],
    outputs=[
        {"answer": "RAG는 검색 증강 생성입니다."},
        {"answer": "벡터 DB는 유사도 검색에 최적화되어 있습니다."}
    ]
)

# 2. 평가자 정의
from langsmith.evaluation import evaluate

evaluators = [
    # 정확도 평가
    LangChainStringEvaluator("qa"),
    # 컨텍스트 관련성
    LangChainStringEvaluator("context_qa"),
    # 길이 평가
    lambda inputs, outputs: {
        "key": "length",
        "score": 1.0 if len(outputs["output"]) < 500 else 0.5
    }
]

# 3. 평가 실행
results = evaluate(
    lambda inputs: rag_chain.invoke(inputs["question"]),
    data=dataset.name,
    evaluators=evaluators,
    experiment_prefix="rag-eval-v1"
)

print(results.to_pandas())
\`\`\`

---

## 프로덕션 모니터링

\`\`\`python
# 대시보드에서 확인할 수 있는 메트릭:

# 1. 지연 시간 (Latency)
# - P50, P95, P99 지연 시간
# - 단계별 지연 시간 분석

# 2. 토큰 사용량
# - 입력/출력 토큰 수
# - 비용 추정

# 3. 에러율
# - 에러 유형별 분류
# - 에러 발생 패턴

# 4. 피드백 점수
# - 사용자 만족도
# - 자동화된 평가 점수
\`\`\`

---

## 비용 최적화 팁

\`\`\`python
# 1. 샘플링
import os
os.environ["LANGCHAIN_TRACING_SAMPLE_RATE"] = "0.1"  # 10%만 추적

# 2. 개발 중에만 추적
if os.environ.get("ENV") == "development":
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
else:
    os.environ["LANGCHAIN_TRACING_V2"] = "false"

# 3. 특정 체인만 추적
from langchain.callbacks import tracing_v2_enabled

with tracing_v2_enabled():
    # 이 블록 내의 호출만 추적
    result = chain.invoke(input)
\`\`\`
      `,
      keyPoints: [
        'LangSmith: LLM 앱 관측성 플랫폼',
        '@traceable로 커스텀 추적',
        '자동화된 평가로 품질 관리',
      ],
      practiceGoal: 'LangSmith로 RAG 시스템을 모니터링하고 평가할 수 있다',
    }),

    // ========================================
    // Task 6: Day 4 종합 퀴즈 (20분)
    // ========================================
    createQuizTask('w5d4-quiz', 'Day 4 종합 퀴즈', 20, {
      introduction: `
## 퀴즈 안내

Day 4에서 학습한 LangChain RAG 파이프라인 개념을 확인합니다.
각 문제를 신중하게 읽고 답변해주세요.
      `,
      questions: [
        {
          id: 'w5d4-q1',
          question: 'LCEL에서 | (파이프) 연산자의 역할은?',
          options: [
            'OR 조건 연산',
            '컴포넌트를 순차적으로 연결',
            '병렬 실행',
            '조건부 분기',
          ],
          correctAnswer: 1,
          explanation: 'LCEL에서 | 연산자는 왼쪽 컴포넌트의 출력을 오른쪽 컴포넌트의 입력으로 전달하여 체인을 구성합니다.',
        },
        {
          id: 'w5d4-q2',
          question: 'RunnablePassthrough의 역할은?',
          options: [
            '에러를 무시하고 다음으로 전달',
            '입력을 변환 없이 그대로 전달',
            '출력을 캐싱',
            '병렬 실행 결과 병합',
          ],
          correctAnswer: 1,
          explanation: 'RunnablePassthrough는 입력을 어떤 변환도 없이 그대로 다음 컴포넌트로 전달합니다. 주로 딕셔너리 구성 시 원본 입력을 유지할 때 사용합니다.',
        },
        {
          id: 'w5d4-q3',
          question: '대화형 RAG에서 질문 재작성(Contextualization)이 필요한 이유는?',
          options: [
            '검색 속도 향상',
            '대명사 등 문맥 의존적 표현을 해결하기 위해',
            '토큰 비용 절감',
            '보안 강화',
          ],
          correctAnswer: 1,
          explanation: '대명사("그것", "이전에")나 생략된 주어 등 문맥 의존적 표현을 독립적인 질문으로 변환해야 검색이 정확합니다.',
        },
        {
          id: 'w5d4-q4',
          question: 'Parent Document Retriever의 핵심 원리는?',
          options: [
            '큰 청크로 검색, 작은 청크 반환',
            '작은 청크로 검색, 큰 청크(부모) 반환',
            '여러 쿼리로 검색, 결과 병합',
            '자연어에서 필터 자동 추출',
          ],
          correctAnswer: 1,
          explanation: 'Parent Document Retriever는 작은 청크로 정확한 검색을 수행하고, 검색된 청크의 부모(큰 청크)를 반환하여 풍부한 컨텍스트를 제공합니다.',
        },
        {
          id: 'w5d4-q5',
          question: 'LangSmith의 @traceable 데코레이터의 역할은?',
          options: [
            '함수 실행 결과를 캐싱',
            '함수 실행을 LangSmith에 추적 기록',
            '함수 에러를 자동 복구',
            '함수 실행을 병렬화',
          ],
          correctAnswer: 1,
          explanation: '@traceable 데코레이터는 함수의 입력, 출력, 실행 시간 등을 LangSmith에 자동으로 기록하여 디버깅과 모니터링에 활용합니다.',
        },
      ],
      keyPoints: [
        '| 연산자: 컴포넌트 순차 연결',
        '질문 재작성: 문맥 의존적 표현 해결',
        'Parent Document: 작은 청크 검색, 큰 청크 반환',
      ],
      practiceGoal: 'Day 4 핵심 개념을 이해했는지 확인한다',
    }),

    // ========================================
    // Challenge: 멀티모달 RAG 시스템 구축 (70분)
    // ========================================
    createChallengeTask('w5d4-challenge', '멀티 기능 RAG 시스템 구축', 70, {
      introduction: `
## 챌린지 시나리오

당신은 기술 문서 플랫폼의 AI 엔지니어입니다. 회사는 다음 기능을 갖춘 RAG 시스템을 구축하려 합니다:

1. **기본 RAG**: 문서 검색 기반 Q&A
2. **대화형 RAG**: 히스토리 유지
3. **Self-Query**: 메타데이터 필터링
4. **스트리밍**: 실시간 응답

**요구사항:**
- LangChain LCEL 사용
- 프로덕션 수준의 에러 처리
- LangSmith 통합 (선택)

---

## 평가 기준

| 항목 | 배점 | 기준 |
|------|------|------|
| 기본 RAG | 25점 | LCEL 체인 구성, 소스 추적 |
| 대화형 RAG | 25점 | 히스토리 관리, 질문 재작성 |
| Self-Query | 25점 | 메타데이터 스키마, 필터 추출 |
| 스트리밍 | 25점 | 동기/비동기 스트리밍 |

---

## 테스트 데이터

\`\`\`python
from langchain.schema import Document

TECH_DOCUMENTS = [
    Document(
        page_content="""
        RAG(Retrieval-Augmented Generation)는 2020년 Meta AI에서 발표되었습니다.
        외부 지식을 활용하여 LLM의 환각을 줄이고 최신 정보를 제공합니다.
        주요 구성요소: 검색기(Retriever), 생성기(Generator), 벡터 저장소
        """,
        metadata={"category": "AI", "year": 2024, "author": "김철수"}
    ),
    Document(
        page_content="""
        LangChain은 LLM 애플리케이션 개발 프레임워크입니다.
        LCEL(LangChain Expression Language)로 선언적 체인 구성이 가능합니다.
        100개 이상의 통합(OpenAI, Chroma, Pinecone 등)을 지원합니다.
        """,
        metadata={"category": "Framework", "year": 2024, "author": "이영희"}
    ),
    Document(
        page_content="""
        벡터 데이터베이스는 고차원 벡터를 저장하고 유사도 검색을 수행합니다.
        대표적인 인덱싱 알고리즘: HNSW, IVF, PQ
        주요 솔루션: Chroma(로컬), Pinecone(클라우드), pgvector(PostgreSQL)
        """,
        metadata={"category": "Database", "year": 2023, "author": "박지민"}
    ),
    Document(
        page_content="""
        프롬프트 엔지니어링은 LLM에서 원하는 출력을 얻기 위한 기술입니다.
        주요 기법: Few-shot, Chain-of-Thought, ReAct
        좋은 프롬프트는 명확한 지시, 충분한 컨텍스트, 예시를 포함합니다.
        """,
        metadata={"category": "AI", "year": 2023, "author": "김철수"}
    )
]
\`\`\`
      `,
      keyPoints: [
        'LCEL 기반 RAG 체인 (소스 추적 포함)',
        '대화형 RAG (히스토리 관리, 질문 재작성)',
        'Self-Query Retriever (category, year, author 필터)',
        '동기/비동기 스트리밍 지원',
      ],
      hints: [
        '**프로젝트 구조**: multi_rag/ 폴더에 chains/(basic_rag.py, conversational.py, self_query.py), retrievers.py, prompts.py, main.py 구성',
        '**기본 RAG 체인**: RunnableParallel로 docs와 question 병렬 처리, 소스 추출 포함',
        '**Self-Query**: AttributeInfo로 메타데이터 스키마 정의, "2024년 AI 문서" → {"category": "AI", "year": 2024} 자동 필터',
        '**통합 인터페이스**: mode 파라미터로 basic/conversational/self_query 전환, stream 메서드로 토큰 단위 출력',
      ],
    }),
  ],
}
