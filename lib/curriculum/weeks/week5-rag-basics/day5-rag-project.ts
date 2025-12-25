// Day 5: 문서 Q&A RAG 시스템 실습

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day5RagProject: Day = {
  slug: 'rag-project',
  title: '문서 Q&A RAG 시스템',
  totalDuration: 300,
  tasks: [
    createVideoTask('w5d5-project-overview', '프로젝트 개요', 20, {
      introduction: `
# 프로젝트 개요: 문서 Q&A RAG 시스템

## 목표

PDF 문서를 업로드하면 질문에 답하는 **Q&A 챗봇**을 구축합니다.

## 시스템 아키텍처

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    문서 Q&A RAG 시스템                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [PDF 업로드]                                                 │
│       ↓                                                      │
│  [텍스트 추출] → [청킹] → [임베딩] → [Chroma 저장]             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [사용자 질문]                                                │
│       ↓                                                      │
│  [임베딩] → [유사도 검색] → [Top-K 청크]                       │
│       ↓                                                      │
│  [프롬프트 + 컨텍스트] → [GPT-4o-mini] → [답변]               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 기술 스택

| 컴포넌트 | 기술 |
|----------|------|
| 문서 로딩 | PyPDFLoader |
| 청킹 | RecursiveCharacterTextSplitter |
| 임베딩 | OpenAI text-embedding-3-small |
| 벡터 DB | Chroma |
| LLM | GPT-4o-mini |
| 프레임워크 | LangChain |
| UI | Streamlit |

## 학습 목표

1. PDF 문서 처리 파이프라인 구축
2. 효과적인 청킹 전략 적용
3. 벡터 저장소 구축 및 검색
4. LangChain RAG 체인 구성
5. Streamlit UI 개발
      `,
      keyPoints: ['PDF → 청킹 → 임베딩 → 벡터 DB', 'LangChain + Chroma + OpenAI', 'Streamlit으로 웹 UI'],
      practiceGoal: '프로젝트 전체 구조를 이해한다',
    }),

    createCodeTask('w5d5-pdf-processing', 'PDF 문서 처리', 45, {
      introduction: `
# PDF 문서 처리

## 설치

\`\`\`bash
pip install langchain langchain-openai langchain-chroma chromadb pypdf
\`\`\`

## PDF 로딩

\`\`\`python
from langchain_community.document_loaders import PyPDFLoader

# 단일 PDF 로드
loader = PyPDFLoader("document.pdf")
pages = loader.load()

print(f"총 {len(pages)} 페이지")
print(f"첫 페이지 내용: {pages[0].page_content[:200]}...")
print(f"메타데이터: {pages[0].metadata}")
# {'source': 'document.pdf', 'page': 0}
\`\`\`

## 여러 PDF 로드

\`\`\`python
from langchain_community.document_loaders import DirectoryLoader

# 폴더 내 모든 PDF 로드
loader = DirectoryLoader(
    "./documents",
    glob="**/*.pdf",
    loader_cls=PyPDFLoader
)
all_docs = loader.load()
print(f"총 {len(all_docs)} 페이지 로드됨")
\`\`\`

## 텍스트 분할

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\\n\\n", "\\n", ". ", " ", ""]
)

chunks = splitter.split_documents(pages)
print(f"총 {len(chunks)} 청크 생성")

# 청크 확인
for i, chunk in enumerate(chunks[:3]):
    print(f"\\n--- 청크 {i+1} ---")
    print(f"내용: {chunk.page_content[:100]}...")
    print(f"메타데이터: {chunk.metadata}")
\`\`\`

## 벡터 저장소 생성

\`\`\`python
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Chroma 벡터 저장소 생성
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

print(f"벡터 저장소 생성 완료: {len(chunks)} 청크")
\`\`\`

## 전체 파이프라인

\`\`\`python
def process_pdf(pdf_path: str, persist_dir: str = "./chroma_db"):
    """PDF를 처리하여 벡터 저장소 생성"""

    # 1. PDF 로드
    loader = PyPDFLoader(pdf_path)
    pages = loader.load()
    print(f"✅ {len(pages)} 페이지 로드")

    # 2. 청킹
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.split_documents(pages)
    print(f"✅ {len(chunks)} 청크 생성")

    # 3. 벡터 저장소
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_dir
    )
    print(f"✅ 벡터 저장소 생성 완료")

    return vectorstore

# 실행
vectorstore = process_pdf("my_document.pdf")
\`\`\`
      `,
      keyPoints: ['PyPDFLoader로 PDF 로드', 'RecursiveCharacterTextSplitter로 청킹', 'Chroma.from_documents로 벡터 저장소'],
      practiceGoal: 'PDF 문서를 처리하여 벡터 저장소를 생성한다',
    }),

    createCodeTask('w5d5-rag-chain', 'RAG 체인 구성', 45, {
      introduction: `
# RAG 체인 구성

## 검색기 설정

\`\`\`python
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

# 기존 벡터 저장소 로드
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

# 검색기 생성
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}
)
\`\`\`

## RAG 체인

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# 프롬프트
prompt = ChatPromptTemplate.from_template("""
당신은 문서 기반 Q&A 어시스턴트입니다.
다음 컨텍스트를 기반으로 질문에 답하세요.

규칙:
1. 컨텍스트에 있는 정보만 사용하세요.
2. 컨텍스트에 없는 내용은 "문서에서 해당 정보를 찾을 수 없습니다"라고 답하세요.
3. 답변은 명확하고 간결하게 작성하세요.
4. 가능하면 문서의 관련 부분을 인용하세요.

컨텍스트:
{context}

질문: {question}

답변:""")

# 컨텍스트 포매팅
def format_docs(docs):
    return "\\n\\n---\\n\\n".join(
        f"[출처: {doc.metadata.get('source', 'Unknown')}, 페이지: {doc.metadata.get('page', 'N/A')}]\\n{doc.page_content}"
        for doc in docs
    )

# RAG 체인
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
\`\`\`

## 출처 포함 RAG

\`\`\`python
from langchain_core.runnables import RunnableParallel

# 출처와 답변 모두 반환
rag_with_sources = RunnableParallel(
    answer=rag_chain,
    sources=retriever
)

result = rag_with_sources.invoke("주요 내용이 뭐야?")
print(f"답변: {result['answer']}")
print(f"\\n출처:")
for doc in result['sources']:
    print(f"  - {doc.metadata}")
\`\`\`

## Q&A 함수

\`\`\`python
def ask_question(question: str, show_sources: bool = False):
    """문서에 대한 질문에 답변"""

    if show_sources:
        result = rag_with_sources.invoke(question)
        answer = result['answer']
        sources = result['sources']

        print(f"Q: {question}")
        print(f"A: {answer}")
        print(f"\\n📚 참조 문서:")
        for doc in sources:
            src = doc.metadata.get('source', 'Unknown')
            page = doc.metadata.get('page', 'N/A')
            print(f"  - {src}, 페이지 {page}")
    else:
        answer = rag_chain.invoke(question)
        print(f"Q: {question}")
        print(f"A: {answer}")

    return answer

# 테스트
ask_question("이 문서의 핵심 내용은 무엇인가요?", show_sources=True)
\`\`\`
      `,
      keyPoints: ['검색기 + 프롬프트 + LLM 체인', 'format_docs로 출처 정보 포함', 'RunnableParallel로 답변 + 출처'],
      practiceGoal: '출처를 포함한 RAG 체인을 구성한다',
    }),

    createCodeTask('w5d5-streamlit-ui', 'Streamlit UI 개발', 50, {
      introduction: `
# Streamlit UI 개발

## 설치

\`\`\`bash
pip install streamlit
\`\`\`

## 기본 앱 구조

\`\`\`python
# app.py
import streamlit as st
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
import tempfile
import os

st.set_page_config(page_title="📚 문서 Q&A", page_icon="📚")
st.title("📚 문서 Q&A 시스템")

# 사이드바: API 키 입력
with st.sidebar:
    st.header("⚙️ 설정")
    api_key = st.text_input("OpenAI API Key", type="password")
    if api_key:
        os.environ["OPENAI_API_KEY"] = api_key

# 세션 상태 초기화
if "vectorstore" not in st.session_state:
    st.session_state.vectorstore = None
if "messages" not in st.session_state:
    st.session_state.messages = []

# PDF 업로드
uploaded_file = st.file_uploader("PDF 파일 업로드", type="pdf")

if uploaded_file and api_key:
    if st.button("문서 처리"):
        with st.spinner("문서 처리 중..."):
            # 임시 파일로 저장
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                tmp.write(uploaded_file.getvalue())
                tmp_path = tmp.name

            # PDF 로드 및 처리
            loader = PyPDFLoader(tmp_path)
            pages = loader.load()

            splitter = RecursiveCharacterTextSplitter(
                chunk_size=500, chunk_overlap=50
            )
            chunks = splitter.split_documents(pages)

            embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
            st.session_state.vectorstore = Chroma.from_documents(
                chunks, embeddings
            )

            os.unlink(tmp_path)  # 임시 파일 삭제
            st.success(f"✅ {len(pages)} 페이지, {len(chunks)} 청크 처리 완료!")

# 대화 인터페이스
if st.session_state.vectorstore:
    # 대화 히스토리 표시
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.write(msg["content"])

    # 사용자 입력
    if question := st.chat_input("질문을 입력하세요"):
        st.session_state.messages.append({"role": "user", "content": question})
        with st.chat_message("user"):
            st.write(question)

        # RAG 실행
        with st.chat_message("assistant"):
            with st.spinner("답변 생성 중..."):
                retriever = st.session_state.vectorstore.as_retriever(
                    search_kwargs={"k": 4}
                )
                llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

                prompt = ChatPromptTemplate.from_template("""
                컨텍스트를 기반으로 질문에 답하세요.
                컨텍스트에 없으면 "문서에서 찾을 수 없습니다"라고 하세요.

                컨텍스트: {context}
                질문: {question}
                답변:""")

                def format_docs(docs):
                    return "\\n\\n".join(d.page_content for d in docs)

                chain = (
                    {"context": retriever | format_docs, "question": RunnablePassthrough()}
                    | prompt | llm | StrOutputParser()
                )

                answer = chain.invoke(question)
                st.write(answer)
                st.session_state.messages.append({"role": "assistant", "content": answer})
else:
    st.info("👆 PDF 파일을 업로드하고 '문서 처리' 버튼을 클릭하세요.")
\`\`\`

## 실행

\`\`\`bash
streamlit run app.py
\`\`\`

브라우저에서 http://localhost:8501 접속
      `,
      keyPoints: ['st.file_uploader로 PDF 업로드', 'st.session_state로 상태 관리', 'st.chat_message로 대화 UI'],
      practiceGoal: 'Streamlit으로 RAG 웹 앱을 개발한다',
    }),

    createReadingTask('w5d5-deployment', '배포 및 최적화', 30, {
      introduction: `
# 배포 및 최적화

## 1. 환경 변수 관리

\`\`\`python
# .env 파일
OPENAI_API_KEY=sk-...

# 코드에서 로드
from dotenv import load_dotenv
load_dotenv()
\`\`\`

## 2. 벡터 저장소 최적화

\`\`\`python
# 영구 저장
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"  # 영구 저장
)

# 로드
vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings
)
\`\`\`

## 3. 캐싱

\`\`\`python
import streamlit as st

@st.cache_resource
def load_vectorstore():
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    return Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings
    )
\`\`\`

## 4. Streamlit Cloud 배포

\`\`\`
1. GitHub 저장소 생성
2. requirements.txt 작성:
   langchain
   langchain-openai
   langchain-chroma
   chromadb
   pypdf
   streamlit
   python-dotenv

3. streamlit.io에서 배포
4. Secrets에 API 키 설정
\`\`\`

## 5. 비용 최적화

| 항목 | 최적화 방법 |
|------|------------|
| 임베딩 | text-embedding-3-small 사용 |
| LLM | gpt-4o-mini 사용 |
| 캐싱 | 동일 질문 캐싱 |
| 청크 | 적절한 크기로 토큰 절약 |

## 6. 성능 모니터링

\`\`\`python
import time

def timed_query(question: str):
    start = time.time()
    answer = rag_chain.invoke(question)
    elapsed = time.time() - start
    print(f"응답 시간: {elapsed:.2f}초")
    return answer
\`\`\`
      `,
      keyPoints: ['환경 변수로 API 키 관리', 'Streamlit Cloud로 무료 배포', '캐싱과 적절한 모델로 비용 절약'],
      practiceGoal: 'RAG 시스템을 배포하고 최적화한다',
    }),

    createQuizTask('w5d5-quiz', 'Day 5 복습 퀴즈', 15, {
      introduction: '# Day 5 복습 퀴즈',
      questions: [
        {
          id: 'w5d5-q1',
          question: 'PyPDFLoader의 역할은?',
          options: ['PDF 생성', 'PDF 텍스트 추출', 'PDF 압축', 'PDF 암호화'],
          correctAnswer: 1,
          explanation: 'PyPDFLoader는 PDF 파일에서 텍스트를 추출합니다.',
        },
        {
          id: 'w5d5-q2',
          question: 'Streamlit의 st.session_state 용도는?',
          options: ['파일 저장', '세션 간 상태 유지', '네트워크 통신', '로그 기록'],
          correctAnswer: 1,
          explanation: 'st.session_state는 사용자 세션 동안 상태(벡터 저장소, 대화 히스토리 등)를 유지합니다.',
        },
        {
          id: 'w5d5-q3',
          question: 'RAG 비용 최적화 방법으로 적절하지 않은 것은?',
          options: ['text-embedding-3-small 사용', 'gpt-4o-mini 사용', '청크 크기 무한대로', '동일 질문 캐싱'],
          correctAnswer: 2,
          explanation: '청크 크기를 무한대로 하면 토큰 사용량이 증가하여 비용이 늘어납니다.',
        },
      ],
      keyPoints: ['PyPDFLoader = PDF 텍스트 추출', 'session_state = 세션 상태 유지', '적절한 청크 크기로 비용 절약'],
      practiceGoal: 'RAG 프로젝트 개념을 확인한다',
    }),
  ],

  challenge: createChallengeTask('w5d5-challenge', 'Challenge: 나만의 문서 Q&A 서비스', 75, {
    introduction: `
# Challenge: 나만의 문서 Q&A 서비스

## 과제

실제 사용 가능한 문서 Q&A 서비스를 완성하세요.

## 기본 요구사항

1. **PDF 업로드 & 처리**
   - 여러 PDF 업로드 지원
   - 처리 진행 상황 표시

2. **RAG 체인**
   - 유사도 검색
   - 출처 표시
   - 대화 히스토리 유지

3. **Streamlit UI**
   - 깔끔한 인터페이스
   - 에러 처리

## 보너스 요구사항 (선택)

1. **검색 최적화**
   - MMR 검색 적용
   - Re-ranking 추가

2. **다중 문서 비교**
   - "문서 A와 B의 차이점은?"

3. **내보내기**
   - 대화 내역 다운로드

## 제출물

- GitHub 저장소 링크
- README.md (설치 방법, 스크린샷)
- (선택) 배포된 URL

## 평가 기준

| 항목 | 배점 |
|------|------|
| 기본 기능 동작 | 40% |
| 코드 품질 | 20% |
| UI/UX | 20% |
| 보너스 기능 | 20% |
    `,
    keyPoints: ['전체 RAG 파이프라인 구축', 'Streamlit 웹 앱 완성', 'GitHub 저장소로 제출'],
    practiceGoal: '실제 사용 가능한 RAG 서비스를 완성한다',
  }),
}
