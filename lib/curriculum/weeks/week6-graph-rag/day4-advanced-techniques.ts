// Week 6 Day 4: GraphRAG 고급 기법

import type { Day } from './types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
} from './types'

// Task 1: 쿼리 라우팅
const task1 = createVideoTask(
  'w6d4-query-routing',
  '쿼리 라우팅: Local vs Global 자동 선택',
  30,
  {
    introduction: `
## 쿼리 라우팅

사용자 질문을 분석하여 Local Search와 Global Search 중
적절한 방식을 자동으로 선택합니다.

### 라우팅 기준

| 질문 유형 | 검색 방식 | 예시 |
|----------|----------|------|
| 특정 엔티티 | Local | "삼성전자의 CEO는?" |
| 비교 질문 | Local (멀티) | "삼성과 SK의 차이점?" |
| 요약/트렌드 | Global | "반도체 산업 전망은?" |
| 목록 요청 | Global | "주요 AI 기업들을 알려줘" |

### LLM 기반 라우팅

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

ROUTING_PROMPT = '''
다음 질문을 분석하여 검색 방식을 결정하세요.

질문: {question}

검색 방식:
- LOCAL: 특정 엔티티, 관계, 비교 질문
- GLOBAL: 요약, 트렌드, 전체 목록, 일반적인 질문

답변 형식: LOCAL 또는 GLOBAL (한 단어만)
'''

def route_query(question: str, llm) -> str:
    prompt = ChatPromptTemplate.from_template(ROUTING_PROMPT)
    chain = prompt | llm
    result = chain.invoke({"question": question})
    return result.content.strip().upper()

# 예시
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
print(route_query("삼성전자의 경쟁사는?", llm))  # LOCAL
print(route_query("반도체 산업의 트렌드는?", llm))  # GLOBAL
\`\`\`

### 규칙 기반 라우팅 (Fallback)

\`\`\`python
import re

def rule_based_routing(question: str) -> str:
    # 특정 엔티티 패턴
    entity_patterns = [
        r"(.+)의 (.+)(는|은)",  # "X의 Y는"
        r"(.+)와 (.+)의",       # "X와 Y의"
        r"(.+) 회사",           # "X 회사"
    ]

    # 글로벌 키워드
    global_keywords = ['전체', '요약', '트렌드', '주요', '목록', '모든']

    # 글로벌 키워드 체크
    if any(kw in question for kw in global_keywords):
        return "GLOBAL"

    # 엔티티 패턴 체크
    if any(re.search(p, question) for p in entity_patterns):
        return "LOCAL"

    return "LOCAL"  # 기본값
\`\`\`
`,
    keyPoints: [
      'LLM으로 질문 유형 분석하여 라우팅',
      '규칙 기반 라우팅을 fallback으로 사용',
      '특정 엔티티 → Local, 요약/트렌드 → Global',
      '적절한 라우팅으로 검색 품질 향상',
    ],
    practiceGoal: '쿼리 라우팅 전략 이해 및 구현',
  }
)

// Task 2: Re-ranking
const task2 = createCodeTask(
  'w6d4-reranking',
  '실습: Cross-Encoder Re-ranking',
  45,
  {
    introduction: `
## Re-ranking

초기 검색 결과를 더 정교한 모델로 재정렬합니다.

### Re-ranking이 필요한 이유

- Bi-encoder (임베딩): 빠르지만 정밀도 낮음
- Cross-encoder: 느리지만 정밀도 높음
- 전략: Bi-encoder로 후보 추출 → Cross-encoder로 재정렬

### Cross-Encoder 사용

\`\`\`python
from sentence_transformers import CrossEncoder

# Re-ranker 모델 로드
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def rerank_results(question: str, documents: list, top_k: int = 5) -> list:
    """검색 결과 재정렬"""
    # (질문, 문서) 쌍 생성
    pairs = [(question, doc.page_content) for doc in documents]

    # 점수 계산
    scores = reranker.predict(pairs)

    # 점수로 정렬
    scored_docs = list(zip(documents, scores))
    scored_docs.sort(key=lambda x: x[1], reverse=True)

    return [doc for doc, _ in scored_docs[:top_k]]

# 사용 예시
initial_results = vector_store.similarity_search(question, k=20)
reranked = rerank_results(question, initial_results, top_k=5)
\`\`\`

### Cohere Rerank API

\`\`\`python
import cohere

co = cohere.Client('your-api-key')

def cohere_rerank(question: str, documents: list, top_k: int = 5) -> list:
    """Cohere Rerank API 사용"""
    doc_texts = [doc.page_content for doc in documents]

    results = co.rerank(
        query=question,
        documents=doc_texts,
        top_n=top_k,
        model='rerank-english-v2.0'
    )

    return [documents[r.index] for r in results.results]
\`\`\`

### GraphRAG에서의 Re-ranking

\`\`\`python
class GraphRAGWithReranking:
    def __init__(self, graph_search, vector_search, reranker):
        self.graph = graph_search
        self.vector = vector_search
        self.reranker = reranker

    def search(self, question: str) -> list:
        # 1. 그래프 검색 결과
        graph_results = self.graph.search(question, k=10)

        # 2. 벡터 검색 결과
        vector_results = self.vector.search(question, k=10)

        # 3. 결과 통합
        all_results = graph_results + vector_results

        # 4. Re-ranking
        reranked = self.reranker.rerank(question, all_results, top_k=5)

        return reranked
\`\`\`
`,
    keyPoints: [
      'Bi-encoder (빠름) → Cross-encoder (정확) 2단계',
      'Cross-Encoder로 (질문, 문서) 쌍 점수 계산',
      'Cohere Rerank API로 쉽게 구현 가능',
      '그래프 + 벡터 결과 통합 후 Re-ranking',
    ],
    practiceGoal: 'Cross-Encoder Re-ranking 구현',
    codeExample: `from sentence_transformers import CrossEncoder

# Re-ranker 초기화
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

# 샘플 데이터
question = "삼성전자의 반도체 사업은?"
documents = [
    "삼성전자는 메모리 반도체 세계 1위 기업이다.",
    "삼성전자의 스마트폰 사업부는...",
    "반도체 산업은 AI 수요로 성장 중이다.",
    "삼성전자 반도체 부문 매출은 전년 대비 증가했다."
]

# Re-ranking
pairs = [(question, doc) for doc in documents]
scores = reranker.predict(pairs)

# 결과 출력
for doc, score in sorted(zip(documents, scores), key=lambda x: -x[1]):
    print(f"{score:.3f}: {doc[:50]}...")`,
  }
)

// Task 3: 대화형 GraphRAG
const task3 = createCodeTask(
  'w6d4-conversational',
  '실습: 대화형 GraphRAG 구현',
  50,
  {
    introduction: `
## 대화형 GraphRAG

대화 기록을 유지하면서 연속적인 질문에 답합니다.

### 대화 기록 관리

\`\`\`python
from langchain_core.messages import HumanMessage, AIMessage

class ConversationalGraphRAG:
    def __init__(self, graphrag, llm):
        self.graphrag = graphrag
        self.llm = llm
        self.history = []

    def reformulate_question(self, question: str) -> str:
        """대화 맥락을 반영하여 질문 재구성"""
        if not self.history:
            return question

        prompt = f"""
이전 대화:
{self._format_history()}

현재 질문: {question}

대화 맥락을 반영하여 독립적인 질문으로 재구성하세요.
재구성된 질문:
"""
        result = self.llm.invoke(prompt)
        return result.content.strip()

    def chat(self, question: str) -> str:
        # 1. 질문 재구성
        standalone_question = self.reformulate_question(question)

        # 2. GraphRAG 검색
        answer = self.graphrag.search(standalone_question)

        # 3. 대화 기록 업데이트
        self.history.append(HumanMessage(content=question))
        self.history.append(AIMessage(content=answer))

        return answer

    def _format_history(self) -> str:
        parts = []
        for msg in self.history[-6:]:  # 최근 3턴
            role = "사용자" if isinstance(msg, HumanMessage) else "AI"
            parts.append(f"{role}: {msg.content}")
        return "\\n".join(parts)

    def clear_history(self):
        self.history = []
\`\`\`

### Neo4j 대화 기록 저장

\`\`\`python
from langchain_community.chat_message_histories import Neo4jChatMessageHistory

# Neo4j에 대화 기록 저장
history = Neo4jChatMessageHistory(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
    session_id="user_123"
)

# 메시지 추가
history.add_user_message("삼성전자의 경쟁사는?")
history.add_ai_message("삼성전자의 주요 경쟁사는 SK하이닉스...")

# 기록 조회
messages = history.messages
\`\`\`

### 대화 예시

\`\`\`
User: 삼성전자에 대해 알려줘
AI: 삼성전자는 반도체, 스마트폰 등을 제조하는...

User: 그 회사의 경쟁사는?
       ↓ 재구성: "삼성전자의 경쟁사는?"
AI: 삼성전자의 주요 경쟁사로는 SK하이닉스...

User: 그들 중 가장 큰 회사는?
       ↓ 재구성: "삼성전자의 경쟁사 중 가장 큰 회사는?"
AI: 시가총액 기준으로 삼성전자가 가장 크고...
\`\`\`
`,
    keyPoints: [
      '대화 기록으로 맥락 유지',
      '질문 재구성으로 독립적인 검색 질문 생성',
      'Neo4jChatMessageHistory로 영구 저장',
      '최근 N턴만 사용하여 컨텍스트 제한',
    ],
    practiceGoal: '대화형 GraphRAG 시스템 구현',
    codeExample: `class ConversationalGraphRAG:
    def __init__(self, graphrag, llm):
        self.graphrag = graphrag
        self.llm = llm
        self.history = []

    def chat(self, question: str) -> str:
        # 맥락 반영 질문 재구성
        if self.history:
            context = "\\n".join([f"{m[0]}: {m[1]}" for m in self.history[-4:]])
            prompt = f"대화 맥락:\\n{context}\\n\\n현재 질문: {question}\\n독립 질문:"
            question = self.llm.invoke(prompt).content

        # 검색 및 응답
        answer = self.graphrag.search(question)
        self.history.append(("User", question))
        self.history.append(("AI", answer))
        return answer

# 사용
conv_rag = ConversationalGraphRAG(graphrag, llm)
conv_rag.chat("삼성전자에 대해 알려줘")
conv_rag.chat("그 회사의 경쟁사는?")  # "삼성전자"로 이해`,
  }
)

// Task 4: 스트리밍 응답
const task4 = createCodeTask(
  'w6d4-streaming',
  '실습: 스트리밍 GraphRAG 응답',
  40,
  {
    introduction: `
## 스트리밍 응답

검색 결과를 기반으로 LLM 응답을 스트리밍합니다.

### LangChain 스트리밍

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

async def stream_graphrag_response(question: str, context: str):
    llm = ChatOpenAI(model="gpt-4o-mini", streaming=True)

    prompt = ChatPromptTemplate.from_messages([
        ("system", "다음 컨텍스트를 바탕으로 질문에 답하세요:\\n{context}"),
        ("human", "{question}")
    ])

    chain = prompt | llm | StrOutputParser()

    async for chunk in chain.astream({
        "context": context,
        "question": question
    }):
        print(chunk, end="", flush=True)

# 실행
import asyncio
asyncio.run(stream_graphrag_response(
    "삼성전자의 경쟁사는?",
    "삼성전자 -[COMPETES_WITH]-> SK하이닉스\\n삼성전자 -[COMPETES_WITH]-> TSMC"
))
\`\`\`

### FastAPI 스트리밍 엔드포인트

\`\`\`python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

@app.get("/graphrag/stream")
async def stream_answer(question: str):
    async def generate():
        # 1. GraphRAG 검색 (비스트리밍)
        context = graphrag.search(question)

        # 2. LLM 스트리밍 응답
        async for chunk in llm.astream(f"Context: {context}\\nQ: {question}"):
            yield chunk.content

    return StreamingResponse(generate(), media_type="text/plain")
\`\`\`

### Streamlit 스트리밍

\`\`\`python
import streamlit as st

def stream_in_streamlit(question: str, context: str):
    response_placeholder = st.empty()
    full_response = ""

    for chunk in llm.stream(f"Context: {context}\\nQ: {question}"):
        full_response += chunk.content
        response_placeholder.markdown(full_response + "▌")

    response_placeholder.markdown(full_response)
\`\`\`
`,
    keyPoints: [
      'LangChain astream으로 비동기 스트리밍',
      'FastAPI StreamingResponse로 API 스트리밍',
      'Streamlit에서 실시간 응답 표시',
      '검색은 일반 실행, LLM 응답만 스트리밍',
    ],
    practiceGoal: '스트리밍 GraphRAG 응답 구현',
    codeExample: `from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", streaming=True)

# 동기 스트리밍
def stream_response(question: str, context: str):
    prompt = f"Context: {context}\\n\\nQuestion: {question}"
    for chunk in llm.stream(prompt):
        print(chunk.content, end="", flush=True)

# 테스트
stream_response(
    "삼성전자의 경쟁사는?",
    "삼성전자 -[COMPETES_WITH]-> SK하이닉스, Intel"
)`,
  }
)

// Task 5: 평가 및 최적화
const task5 = createReadingTask(
  'w6d4-evaluation',
  'GraphRAG 평가 지표 및 최적화',
  35,
  {
    introduction: `
## GraphRAG 평가

### 평가 지표

| 지표 | 설명 | 측정 방법 |
|------|------|----------|
| **Relevance** | 검색 결과의 관련성 | LLM Judge, 사람 평가 |
| **Faithfulness** | 답변이 컨텍스트에 기반하는지 | 환각 탐지 |
| **Answer Quality** | 답변의 정확성, 완전성 | Ground Truth 비교 |
| **Latency** | 응답 시간 | ms 측정 |

### RAGAS 평가 프레임워크

\`\`\`python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall
)
from datasets import Dataset

# 평가 데이터 준비
eval_data = {
    "question": ["삼성전자의 CEO는?"],
    "answer": ["삼성전자의 CEO는 이재용입니다."],
    "contexts": [["삼성전자의 이재용 회장은..."]],
    "ground_truth": ["이재용"]
}

dataset = Dataset.from_dict(eval_data)

# 평가 실행
result = evaluate(
    dataset,
    metrics=[faithfulness, answer_relevancy, context_precision]
)
print(result)
\`\`\`

### 최적화 전략

**1. 검색 최적화**
- 청크 크기 조정 (500-1500 토큰)
- 오버랩 비율 조정 (10-20%)
- 메타데이터 필터링 추가

**2. 그래프 최적화**
- 인덱스 추가 (노드 속성)
- 관계 타입 세분화
- 그래프 통계 캐싱

**3. LLM 최적화**
- 프롬프트 엔지니어링
- 모델 선택 (속도 vs 품질)
- 캐싱 (동일 질문)

**4. 전체 파이프라인**
- 병렬 검색 (그래프 + 벡터)
- 조기 종료 (충분한 결과 시)
- 배치 처리 (대량 질문)
`,
    keyPoints: [
      'RAGAS로 자동 평가 (Faithfulness, Relevancy 등)',
      '검색, 그래프, LLM 각 단계별 최적화',
      '청크 크기, 오버랩, 인덱스가 성능에 영향',
      '병렬 처리와 캐싱으로 latency 개선',
    ],
    practiceGoal: 'GraphRAG 평가 지표 및 최적화 전략 이해',
  }
)

// Task 6: 퀴즈
const task6 = createQuizTask(
  'w6d4-quiz',
  'Day 4 복습 퀴즈',
  20,
  {
    questions: [
      {
        id: 'q1',
        question: '쿼리 라우팅에서 "반도체 산업 전망은?" 질문의 적절한 검색 방식은?',
        options: [
          'Local Search',
          'Global Search',
          'Keyword Search',
          'Full-text Search',
        ],
        correctAnswer: 1,
        explanation: '트렌드/전망 질문은 커뮤니티 요약 기반의 Global Search가 적합합니다.',
      },
      {
        id: 'q2',
        question: 'Re-ranking에서 Cross-Encoder의 역할은?',
        options: [
          '임베딩 생성',
          '(질문, 문서) 쌍의 관련성 점수 계산',
          '문서 요약',
          '엔티티 추출',
        ],
        correctAnswer: 1,
        explanation: 'Cross-Encoder는 질문과 문서를 함께 입력받아 관련성 점수를 계산합니다.',
      },
      {
        id: 'q3',
        question: '대화형 GraphRAG에서 질문 재구성의 목적은?',
        options: [
          '맞춤법 교정',
          '대화 맥락을 반영한 독립적인 검색 질문 생성',
          '질문 번역',
          '감정 분석',
        ],
        correctAnswer: 1,
        explanation: '"그 회사의"를 "삼성전자의"로 바꿔 독립적인 검색 질문으로 만듭니다.',
      },
      {
        id: 'q4',
        question: 'RAGAS 평가에서 Faithfulness가 측정하는 것은?',
        options: [
          '응답 속도',
          '답변이 컨텍스트에 기반하는지 (환각 여부)',
          '문법 정확성',
          '사용자 만족도',
        ],
        correctAnswer: 1,
        explanation: 'Faithfulness는 답변이 검색된 컨텍스트에 충실한지 측정합니다.',
      },
    ],
    keyPoints: [
      '쿼리 라우팅 기준',
      'Re-ranking 원리',
      '대화형 시스템 구현',
      '평가 지표 이해',
    ],
    practiceGoal: 'Day 4 학습 내용 복습',
  }
)

// Day 4 Export
export const day4AdvancedTechniques: Day = {
  slug: 'advanced-techniques',
  title: 'GraphRAG 고급 기법',
  totalDuration: 220,
  tasks: [task1, task2, task3, task4, task5, task6],
}
