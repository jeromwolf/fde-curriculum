// Day 4: LangChain RAG 파이프라인

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
} from './types'

export const day4LangchainRag: Day = {
  slug: 'langchain-rag',
  title: 'LangChain RAG 파이프라인',
  totalDuration: 240,
  tasks: [
    createVideoTask('w5d4-langchain-intro', 'LangChain 개요', 25, {
      introduction: `
# LangChain 개요

## LangChain이란?

**LangChain**은 LLM 애플리케이션 개발을 위한 프레임워크입니다.

\`\`\`
LangChain = LLM + 체인 + 도구 + 메모리 + 에이전트
\`\`\`

## 핵심 구성요소

### 1. Models (모델)

\`\`\`python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

# LLM
llm = ChatOpenAI(model="gpt-4o-mini")

# 임베딩
embeddings = OpenAIEmbeddings()
\`\`\`

### 2. Prompts (프롬프트)

\`\`\`python
from langchain.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("""
컨텍스트: {context}
질문: {question}
답변:""")
\`\`\`

### 3. Chains (체인)

\`\`\`python
# LCEL (LangChain Expression Language)
chain = prompt | llm | output_parser
\`\`\`

### 4. Retrievers (검색기)

\`\`\`python
retriever = vectorstore.as_retriever()
\`\`\`

### 5. Memory (메모리)

\`\`\`python
from langchain.memory import ConversationBufferMemory
memory = ConversationBufferMemory()
\`\`\`

## LCEL 문법

**|** (파이프) 연산자로 컴포넌트 연결:

\`\`\`python
# 왼쪽 출력 → 오른쪽 입력
chain = component1 | component2 | component3

# 실행
result = chain.invoke(input_data)
\`\`\`

## LangChain 생태계

| 패키지 | 용도 |
|--------|------|
| langchain | 코어 기능 |
| langchain-openai | OpenAI 통합 |
| langchain-community | 커뮤니티 통합 |
| langchain-chroma | Chroma 통합 |
| langgraph | 에이전트 워크플로우 |
| langsmith | 모니터링/평가 |
      `,
      keyPoints: ['LangChain = LLM 애플리케이션 프레임워크', 'LCEL로 체인 구성', '다양한 통합 패키지 제공'],
      practiceGoal: 'LangChain의 핵심 개념을 이해한다',
    }),

    createCodeTask('w5d4-basic-rag-chain', '기본 RAG 체인 구축', 45, {
      introduction: `
# 기본 RAG 체인 구축

## 설치

\`\`\`bash
pip install langchain langchain-openai langchain-chroma chromadb
\`\`\`

## 전체 코드

\`\`\`python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain.schema import Document

# 1. 샘플 문서
documents = [
    Document(page_content="LangChain은 LLM 애플리케이션 개발 프레임워크입니다."),
    Document(page_content="RAG는 Retrieval-Augmented Generation의 약자입니다."),
    Document(page_content="벡터 데이터베이스는 임베딩을 저장하고 유사도 검색을 합니다."),
    Document(page_content="Chroma는 오픈소스 벡터 데이터베이스입니다."),
    Document(page_content="LCEL은 LangChain Expression Language입니다."),
]

# 2. 텍스트 분할 (이미 짧으므로 생략 가능)
splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
splits = splitter.split_documents(documents)

# 3. 벡터 저장소 생성
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(splits, embeddings)

# 4. 검색기
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# 5. 프롬프트
prompt = ChatPromptTemplate.from_template("""
다음 컨텍스트를 기반으로 질문에 답하세요.
컨텍스트에 없는 내용은 "잘 모르겠습니다"라고 답하세요.

컨텍스트:
{context}

질문: {question}

답변:""")

# 6. LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# 7. 컨텍스트 포매팅 함수
def format_docs(docs):
    return "\\n\\n".join(doc.page_content for doc in docs)

# 8. RAG 체인 구성 (LCEL)
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# 9. 질문하기
question = "LangChain이 뭐야?"
answer = rag_chain.invoke(question)
print(f"Q: {question}")
print(f"A: {answer}")

# 10. 여러 질문 테스트
questions = [
    "RAG가 뭐야?",
    "Chroma의 특징은?",
    "LCEL이 뭔가요?",
]

for q in questions:
    print(f"\\nQ: {q}")
    print(f"A: {rag_chain.invoke(q)}")
\`\`\`

## 체인 분석

\`\`\`
{"context": retriever | format_docs, "question": RunnablePassthrough()}
    ↓
context와 question을 딕셔너리로 구성

    ↓ prompt
프롬프트 템플릿에 값 삽입

    ↓ llm
LLM에 프롬프트 전달

    ↓ StrOutputParser()
문자열로 출력 파싱
\`\`\`
      `,
      keyPoints: ['LCEL로 RAG 체인 구성', 'RunnablePassthrough로 입력 전달', 'format_docs로 컨텍스트 포매팅'],
      practiceGoal: 'LangChain LCEL로 기본 RAG 체인을 구축한다',
    }),

    createCodeTask('w5d4-conversational-rag', '대화형 RAG 구현', 45, {
      introduction: `
# 대화형 RAG 구현

대화 히스토리를 유지하는 RAG 시스템을 구축합니다.

## 핵심 개념

\`\`\`
일반 RAG:
  질문 → 검색 → 답변

대화형 RAG:
  [이전 대화] + 질문 → 질문 재작성 → 검색 → 답변
\`\`\`

## 구현

\`\`\`python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# 벡터 저장소 (이전에 생성한 것 사용)
# vectorstore = ...

retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# 1. 질문 재작성 프롬프트
contextualize_prompt = ChatPromptTemplate.from_messages([
    ("system", """대화 히스토리와 최신 질문을 보고,
    히스토리 없이도 이해할 수 있는 독립적인 질문으로 재작성하세요.
    재작성이 필요 없으면 그대로 반환하세요."""),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}")
])

# 2. 질문 재작성 체인
contextualize_chain = contextualize_prompt | llm | StrOutputParser()

# 3. QA 프롬프트
qa_prompt = ChatPromptTemplate.from_messages([
    ("system", """다음 컨텍스트를 기반으로 질문에 답하세요.
    컨텍스트에 없는 내용은 "잘 모르겠습니다"라고 답하세요.

    컨텍스트:
    {context}"""),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}")
])

# 4. 컨텍스트 포매팅
def format_docs(docs):
    return "\\n\\n".join(doc.page_content for doc in docs)

# 5. 대화형 RAG 함수
def conversational_rag(question: str, chat_history: list):
    # 히스토리가 있으면 질문 재작성
    if chat_history:
        contextualized_q = contextualize_chain.invoke({
            "chat_history": chat_history,
            "input": question
        })
    else:
        contextualized_q = question

    # 검색
    docs = retriever.invoke(contextualized_q)
    context = format_docs(docs)

    # 답변 생성
    response = qa_prompt | llm | StrOutputParser()
    answer = response.invoke({
        "context": context,
        "chat_history": chat_history,
        "input": question
    })

    return answer

# 6. 대화 테스트
chat_history = []

# 첫 번째 질문
q1 = "LangChain이 뭐야?"
a1 = conversational_rag(q1, chat_history)
print(f"Q: {q1}")
print(f"A: {a1}\\n")

# 히스토리에 추가
chat_history.append(HumanMessage(content=q1))
chat_history.append(AIMessage(content=a1))

# 두 번째 질문 (대명사 사용)
q2 = "그것의 주요 특징은?"  # "그것" = LangChain
a2 = conversational_rag(q2, chat_history)
print(f"Q: {q2}")
print(f"A: {a2}\\n")

# 히스토리에 추가
chat_history.append(HumanMessage(content=q2))
chat_history.append(AIMessage(content=a2))

# 세 번째 질문
q3 = "RAG랑 어떻게 같이 쓸 수 있어?"
a3 = conversational_rag(q3, chat_history)
print(f"Q: {q3}")
print(f"A: {a3}")
\`\`\`

## 질문 재작성 예시

\`\`\`
히스토리: "LangChain이 뭐야?" → "LangChain은 LLM 프레임워크입니다"
질문: "그것의 주요 특징은?"

재작성된 질문: "LangChain의 주요 특징은?"
\`\`\`
      `,
      keyPoints: ['대화 히스토리로 문맥 유지', '질문 재작성으로 대명사 해결', 'MessagesPlaceholder로 히스토리 관리'],
      practiceGoal: '대화형 RAG 시스템을 구현한다',
    }),

    createReadingTask('w5d4-advanced-patterns', '고급 RAG 패턴', 30, {
      introduction: `
# 고급 RAG 패턴

## 1. Self-Query Retriever

자연어 쿼리에서 메타데이터 필터 자동 추출:

\`\`\`python
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain.chains.query_constructor.schema import AttributeInfo

# 메타데이터 스키마 정의
metadata_field_info = [
    AttributeInfo(
        name="category",
        description="문서 카테고리 (tech, business, etc)",
        type="string"
    ),
    AttributeInfo(
        name="year",
        description="문서 작성 연도",
        type="integer"
    ),
]

retriever = SelfQueryRetriever.from_llm(
    llm=llm,
    vectorstore=vectorstore,
    document_contents="기술 문서",
    metadata_field_info=metadata_field_info
)

# "2024년 tech 관련 문서에서 RAG 찾아줘"
# → filter: {"category": "tech", "year": 2024}
#   query: "RAG"
\`\`\`

## 2. Multi-Vector Retriever

하나의 문서에 대해 여러 임베딩 생성:

\`\`\`python
# 원본 문서 → 요약 → 요약 임베딩으로 검색
# 검색 결과 → 원본 문서 반환

from langchain.retrievers.multi_vector import MultiVectorRetriever
from langchain.storage import InMemoryStore

# 요약 생성
summaries = [llm.invoke(f"요약: {doc.page_content}") for doc in docs]

# 요약으로 벡터 저장소 생성
vectorstore = Chroma.from_texts(summaries, embeddings)

# 원본 문서 저장소
docstore = InMemoryStore()
for i, doc in enumerate(docs):
    docstore.mset([(str(i), doc)])

retriever = MultiVectorRetriever(
    vectorstore=vectorstore,
    docstore=docstore,
    id_key="doc_id"
)
\`\`\`

## 3. Contextual Compression

검색 결과에서 관련 부분만 추출:

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

compressor = LLMChainExtractor.from_llm(llm)

compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=retriever
)

# 긴 문서 → 질문 관련 부분만 추출
\`\`\`

## 4. Time-Weighted Retriever

최신 문서에 가중치:

\`\`\`python
from langchain.retrievers import TimeWeightedVectorStoreRetriever

retriever = TimeWeightedVectorStoreRetriever(
    vectorstore=vectorstore,
    decay_rate=0.01,  # 시간 경과에 따른 감쇠율
    k=4
)
\`\`\`

## 패턴 선택 가이드

| 패턴 | 사용 상황 |
|------|----------|
| Self-Query | 메타데이터 필터링이 자주 필요할 때 |
| Multi-Vector | 긴 문서, 요약 기반 검색 |
| Compression | 검색 결과 정제 필요 |
| Time-Weighted | 최신 정보가 중요할 때 |
      `,
      keyPoints: ['Self-Query로 자동 필터 추출', 'Multi-Vector로 요약 기반 검색', 'Compression으로 결과 정제'],
      practiceGoal: '고급 RAG 패턴의 활용 방법을 이해한다',
    }),

    createCodeTask('w5d4-streaming-rag', '스트리밍 RAG 구현', 40, {
      introduction: `
# 스트리밍 RAG 구현

실시간으로 응답을 스트리밍하는 RAG 시스템을 구현합니다.

## 왜 스트리밍인가?

\`\`\`
일반 응답: 전체 생성 완료까지 대기 (5-10초)
스트리밍: 토큰 단위로 즉시 표시 (체감 빠름)
\`\`\`

## 동기 스트리밍

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, streaming=True)

prompt = ChatPromptTemplate.from_template("""
컨텍스트: {context}
질문: {question}
답변:""")

# 체인 구성
chain = prompt | llm | StrOutputParser()

# 스트리밍 실행
for chunk in chain.stream({
    "context": "RAG는 검색 증강 생성입니다.",
    "question": "RAG가 뭐야?"
}):
    print(chunk, end="", flush=True)
\`\`\`

## 비동기 스트리밍

\`\`\`python
import asyncio

async def stream_rag(question: str, context: str):
    async for chunk in chain.astream({
        "context": context,
        "question": question
    }):
        print(chunk, end="", flush=True)

# 실행
asyncio.run(stream_rag("RAG가 뭐야?", "RAG는 검색 증강 생성입니다."))
\`\`\`

## 전체 RAG 스트리밍

\`\`\`python
from langchain_core.runnables import RunnablePassthrough

def format_docs(docs):
    return "\\n\\n".join(doc.page_content for doc in docs)

# RAG 체인
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# 스트리밍 실행
question = "LangChain의 특징은?"
print(f"Q: {question}\\nA: ", end="")

for chunk in rag_chain.stream(question):
    print(chunk, end="", flush=True)
print()
\`\`\`

## FastAPI 스트리밍 엔드포인트

\`\`\`python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

async def generate_stream(question: str):
    async for chunk in rag_chain.astream(question):
        yield chunk

@app.get("/chat")
async def chat(question: str):
    return StreamingResponse(
        generate_stream(question),
        media_type="text/plain"
    )
\`\`\`

## 클라이언트 측 (JavaScript)

\`\`\`javascript
async function streamChat(question) {
    const response = await fetch(\`/chat?question=\${question}\`);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        document.getElementById('answer').textContent += chunk;
    }
}
\`\`\`
      `,
      keyPoints: ['streaming=True로 스트리밍 활성화', '.stream()으로 동기 스트리밍', '.astream()으로 비동기 스트리밍'],
      practiceGoal: '스트리밍 RAG를 구현한다',
    }),

    createQuizTask('w5d4-quiz', 'Day 4 복습 퀴즈', 15, {
      introduction: '# Day 4 복습 퀴즈',
      questions: [
        {
          id: 'w5d4-q1',
          question: 'LCEL에서 | 연산자의 역할은?',
          options: ['OR 조건', '컴포넌트 연결', '필터링', '병렬 실행'],
          correctAnswer: 1,
          explanation: 'LCEL에서 | (파이프)는 컴포넌트를 연결하여 체인을 구성합니다.',
        },
        {
          id: 'w5d4-q2',
          question: 'RunnablePassthrough의 역할은?',
          options: ['입력을 그대로 전달', '출력을 파싱', '에러 처리', '캐싱'],
          correctAnswer: 0,
          explanation: 'RunnablePassthrough는 입력을 그대로 다음 컴포넌트에 전달합니다.',
        },
        {
          id: 'w5d4-q3',
          question: '대화형 RAG에서 질문 재작성이 필요한 이유는?',
          options: ['검색 속도 향상', '대명사 등 문맥 의존적 표현 해결', '비용 절감', '보안'],
          correctAnswer: 1,
          explanation: '"그것", "이전에" 등 대명사나 문맥 의존적 표현을 독립적인 질문으로 변환해야 검색이 정확합니다.',
        },
      ],
      keyPoints: ['| = 컴포넌트 연결', 'RunnablePassthrough = 입력 전달', '질문 재작성 = 문맥 해결'],
      practiceGoal: 'LangChain RAG 개념을 확인한다',
    }),
  ],
}
