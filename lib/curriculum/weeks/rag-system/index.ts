// Phase 5, Week 3: RAG 시스템 구축
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'rag-fundamentals',
  title: 'RAG 기초 개념',
  totalDuration: 180,
  tasks: [
    {
      id: 'rag-intro-video',
      type: 'video',
      title: 'RAG란 무엇인가?',
      duration: 30,
      content: {
        objectives: [
          'RAG의 개념과 필요성을 이해한다',
          'RAG 아키텍처 구성 요소를 파악한다',
          'RAG vs Fine-tuning 차이를 이해한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=rag-intro-placeholder',
        transcript: `
## RAG (Retrieval-Augmented Generation)

### RAG란?

\`\`\`
RAG = 검색(Retrieval) + 생성(Generation)

LLM의 한계:
├── 학습 데이터 cutoff (최신 정보 부재)
├── 환각 (Hallucination)
├── 도메인 특화 지식 부족
└── 출처 불명확

RAG의 해결:
├── 외부 지식베이스 검색
├── 검색된 문서 기반 답변
├── 출처 명시 가능
└── 최신 정보 반영
\`\`\`

### RAG 아키텍처

\`\`\`
[사용자 질문]
      ↓
[Query Processing]
      ↓
[Retriever] ← [Vector Store] ← [Documents]
      ↓
[Retrieved Context]
      ↓
[LLM with Context]
      ↓
[Generated Answer + Sources]
\`\`\`

### RAG 파이프라인 단계

\`\`\`
1. Indexing (색인)
   문서 → 청킹 → 임베딩 → 벡터 저장

2. Retrieval (검색)
   질문 → 임베딩 → 유사도 검색 → 관련 문서

3. Generation (생성)
   질문 + 검색 결과 → LLM → 답변
\`\`\`

### RAG vs Fine-tuning

| 측면 | RAG | Fine-tuning |
|------|-----|-------------|
| 지식 업데이트 | 쉬움 (문서 교체) | 어려움 (재학습) |
| 비용 | 낮음 | 높음 |
| 출처 추적 | 가능 | 불가능 |
| 도메인 적응 | 빠름 | 느림 |
| 환각 감소 | 효과적 | 제한적 |
        `
      }
    },
    {
      id: 'embedding-video',
      type: 'video',
      title: '임베딩 & 벡터 스토어',
      duration: 30,
      content: {
        objectives: [
          '텍스트 임베딩의 원리를 이해한다',
          '벡터 스토어 종류와 선택 기준을 파악한다',
          '유사도 검색 방법을 학습한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=embedding-vector-placeholder',
        transcript: `
## 임베딩 & 벡터 스토어

### 텍스트 임베딩

\`\`\`python
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# 단일 텍스트 임베딩
vector = embeddings.embed_query("안녕하세요")
print(len(vector))  # 1536 차원

# 여러 텍스트 임베딩
vectors = embeddings.embed_documents([
    "Python은 프로그래밍 언어입니다",
    "JavaScript는 웹 개발에 사용됩니다"
])
\`\`\`

### 임베딩 모델 비교

| 모델 | 차원 | 특징 | 비용 |
|------|------|------|------|
| text-embedding-3-small | 1536 | 균형 | 저렴 |
| text-embedding-3-large | 3072 | 고품질 | 중간 |
| voyage-2 | 1024 | 검색 특화 | 중간 |

### 벡터 스토어

\`\`\`python
from langchain_chroma import Chroma
from langchain_community.vectorstores import FAISS

# Chroma (로컬)
vectorstore = Chroma.from_documents(
    documents=docs,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# FAISS (인메모리)
vectorstore = FAISS.from_documents(docs, embeddings)
\`\`\`

### 벡터 스토어 선택

| 스토어 | 특징 | 사용 사례 |
|--------|------|----------|
| Chroma | 로컬, 영구 저장 | 개발/프로토타입 |
| FAISS | 빠른 검색 | 대규모 데이터 |
| Pinecone | 클라우드, 확장성 | 프로덕션 |
| Weaviate | 하이브리드 검색 | 복잡한 쿼리 |
        `
      }
    },
    {
      id: 'rag-basic-practice',
      type: 'code',
      title: 'RAG 기본 구현 실습',
      duration: 90,
      content: {
        objectives: [
          '기본 RAG 파이프라인을 구현한다',
          '문서 로딩과 청킹을 수행한다',
          '벡터 스토어를 구축한다'
        ],
        instructions: `
## 실습: 기본 RAG 시스템

### 목표
텍스트 문서 기반 Q&A 시스템을 구축하세요.

### 단계
1. 문서 로딩
2. 텍스트 청킹
3. 임베딩 및 벡터 저장
4. 검색 및 답변 생성
        `,
        starterCode: `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

# 샘플 문서
documents = [
    Document(page_content="""
    Python은 1991년 귀도 반 로섬이 개발한 프로그래밍 언어입니다.
    간결하고 읽기 쉬운 문법이 특징이며, 다양한 분야에서 사용됩니다.
    데이터 과학, 웹 개발, 자동화, AI/ML 등에 널리 활용됩니다.
    """, metadata={"source": "python_intro.txt"}),
    Document(page_content="""
    JavaScript는 웹 브라우저에서 실행되는 스크립트 언어입니다.
    Node.js의 등장으로 서버 사이드 개발도 가능해졌습니다.
    React, Vue, Angular 등의 프레임워크가 인기입니다.
    """, metadata={"source": "javascript_intro.txt"})
]

class SimpleRAG:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings()
        self.llm = ChatOpenAI(model="gpt-4o-mini")
        self.vectorstore = None
        # TODO: 초기화

    def index_documents(self, docs: list[Document]):
        """문서 색인"""
        # TODO: 청킹 및 벡터 저장
        pass

    def query(self, question: str, k: int = 3) -> str:
        """질문 답변"""
        # TODO: 검색 및 생성
        pass

# 테스트
if __name__ == "__main__":
    rag = SimpleRAG()
    rag.index_documents(documents)

    questions = [
        "Python은 누가 만들었나요?",
        "JavaScript의 주요 프레임워크는?"
    ]

    for q in questions:
        print(f"Q: {q}")
        print(f"A: {rag.query(q)}\\n")
`,
        solutionCode: `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# 샘플 문서
documents = [
    Document(page_content="""
    Python은 1991년 귀도 반 로섬이 개발한 프로그래밍 언어입니다.
    간결하고 읽기 쉬운 문법이 특징이며, 다양한 분야에서 사용됩니다.
    데이터 과학, 웹 개발, 자동화, AI/ML 등에 널리 활용됩니다.
    """, metadata={"source": "python_intro.txt"}),
    Document(page_content="""
    JavaScript는 웹 브라우저에서 실행되는 스크립트 언어입니다.
    Node.js의 등장으로 서버 사이드 개발도 가능해졌습니다.
    React, Vue, Angular 등의 프레임워크가 인기입니다.
    """, metadata={"source": "javascript_intro.txt"})
]

class SimpleRAG:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.vectorstore = None

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )

        self.prompt = ChatPromptTemplate.from_template("""
다음 컨텍스트를 기반으로 질문에 답변하세요.
컨텍스트에 없는 정보는 "정보가 없습니다"라고 답하세요.

컨텍스트:
{context}

질문: {question}

답변:""")

    def index_documents(self, docs: list[Document]):
        """문서 색인"""
        # 청킹
        splits = self.text_splitter.split_documents(docs)
        print(f"문서 {len(docs)}개 → 청크 {len(splits)}개")

        # 벡터 스토어 생성
        self.vectorstore = Chroma.from_documents(
            documents=splits,
            embedding=self.embeddings
        )
        print("벡터 스토어 생성 완료")

    def _format_docs(self, docs):
        return "\\n\\n".join(
            f"[출처: {doc.metadata.get('source', 'unknown')}]\\n{doc.page_content}"
            for doc in docs
        )

    def query(self, question: str, k: int = 3) -> dict:
        """질문 답변"""
        if not self.vectorstore:
            return {"answer": "문서가 색인되지 않았습니다.", "sources": []}

        # 검색
        retriever = self.vectorstore.as_retriever(search_kwargs={"k": k})
        docs = retriever.invoke(question)

        # 체인 구성
        chain = (
            {"context": lambda x: self._format_docs(docs), "question": RunnablePassthrough()}
            | self.prompt
            | self.llm
            | StrOutputParser()
        )

        answer = chain.invoke(question)

        return {
            "answer": answer,
            "sources": [doc.metadata.get("source", "unknown") for doc in docs]
        }

# 테스트
if __name__ == "__main__":
    rag = SimpleRAG()
    rag.index_documents(documents)

    print("\\n" + "=" * 50)
    questions = [
        "Python은 누가 만들었나요?",
        "JavaScript의 주요 프레임워크는?",
        "Java에 대해 알려주세요"
    ]

    for q in questions:
        result = rag.query(q)
        print(f"\\nQ: {q}")
        print(f"A: {result['answer']}")
        print(f"출처: {result['sources']}")
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'document-processing',
  title: '문서 처리 & 청킹',
  totalDuration: 180,
  tasks: [
    {
      id: 'document-loaders-video',
      type: 'video',
      title: 'Document Loaders',
      duration: 30,
      content: {
        objectives: [
          '다양한 문서 형식을 로드한다',
          'PDF, HTML, 코드 파일을 처리한다',
          '메타데이터 관리를 학습한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=document-loaders-placeholder',
        transcript: `
## Document Loaders

### PDF 로더

\`\`\`python
from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader("document.pdf")
pages = loader.load()

for page in pages:
    print(f"페이지 {page.metadata['page']}: {page.page_content[:100]}")
\`\`\`

### 다양한 로더

\`\`\`python
# 웹 페이지
from langchain_community.document_loaders import WebBaseLoader
loader = WebBaseLoader("https://example.com")

# CSV
from langchain_community.document_loaders import CSVLoader
loader = CSVLoader("data.csv")

# 디렉토리 (여러 파일)
from langchain_community.document_loaders import DirectoryLoader
loader = DirectoryLoader("./docs", glob="**/*.txt")
\`\`\`
        `
      }
    },
    {
      id: 'chunking-video',
      type: 'video',
      title: '텍스트 청킹 전략',
      duration: 30,
      content: {
        objectives: [
          '청킹의 중요성을 이해한다',
          '다양한 청킹 전략을 비교한다',
          '최적의 청크 크기를 결정한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=chunking-placeholder',
        transcript: `
## 텍스트 청킹

### 청킹이 중요한 이유

\`\`\`
너무 작은 청크:
├── 문맥 손실
├── 검색 노이즈 증가
└── 토큰 낭비

너무 큰 청크:
├── 관련 없는 내용 포함
├── LLM 컨텍스트 낭비
└── 정밀도 감소
\`\`\`

### RecursiveCharacterTextSplitter

\`\`\`python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,       # 청크 최대 크기
    chunk_overlap=200,      # 청크 간 오버랩
    separators=["\\n\\n", "\\n", ". ", " ", ""]
)

chunks = splitter.split_documents(documents)
\`\`\`

### 시맨틱 청킹

\`\`\`python
from langchain_experimental.text_splitter import SemanticChunker

splitter = SemanticChunker(
    embeddings=embeddings,
    breakpoint_threshold_type="percentile"
)
\`\`\`
        `
      }
    },
    {
      id: 'document-practice',
      type: 'code',
      title: '문서 처리 실습',
      duration: 90,
      content: {
        objectives: [
          '다양한 문서를 로드하고 처리한다',
          '최적의 청킹 전략을 적용한다',
          '메타데이터를 활용한다'
        ],
        instructions: '다양한 형식의 문서를 로드하고 청킹하는 파이프라인을 구축하세요.',
        starterCode: `# 문서 처리 파이프라인 구현
from langchain_text_splitters import RecursiveCharacterTextSplitter

class DocumentProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        # TODO: 초기화
        pass

    def process_pdf(self, path: str):
        # TODO: PDF 처리
        pass

    def process_text(self, text: str, metadata: dict = None):
        # TODO: 텍스트 처리
        pass
`,
        solutionCode: `from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from typing import List, Optional
import os

class DocumentProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\\n\\n", "\\n", ". ", " ", ""]
        )

    def process_pdf(self, path: str) -> List[Document]:
        loader = PyPDFLoader(path)
        docs = loader.load()
        return self.splitter.split_documents(docs)

    def process_text(self, text: str, metadata: Optional[dict] = None) -> List[Document]:
        doc = Document(page_content=text, metadata=metadata or {})
        return self.splitter.split_documents([doc])

    def process_directory(self, path: str, extensions: List[str] = [".txt", ".md"]) -> List[Document]:
        all_docs = []
        for root, _, files in os.walk(path):
            for file in files:
                if any(file.endswith(ext) for ext in extensions):
                    filepath = os.path.join(root, file)
                    loader = TextLoader(filepath)
                    docs = loader.load()
                    all_docs.extend(self.splitter.split_documents(docs))
        return all_docs

# 테스트
if __name__ == "__main__":
    processor = DocumentProcessor(chunk_size=500, chunk_overlap=50)

    sample_text = "Python은 간결한 문법을 가진 언어입니다. " * 50
    chunks = processor.process_text(sample_text, {"source": "sample"})
    print(f"청크 수: {len(chunks)}")
    print(f"첫 청크: {chunks[0].page_content[:100]}...")
`
      }
    }
  ]
}

const day3: Day = {
  slug: 'retrieval-strategies',
  title: '검색 전략',
  totalDuration: 180,
  tasks: [
    {
      id: 'retrieval-video',
      type: 'video',
      title: '검색 전략 & 최적화',
      duration: 40,
      content: {
        objectives: [
          '다양한 검색 전략을 이해한다',
          '하이브리드 검색을 구현한다',
          '검색 품질을 평가한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=retrieval-strategies-placeholder',
        transcript: `
## 검색 전략

### 검색 방법 비교

| 방법 | 장점 | 단점 |
|------|------|------|
| 벡터 검색 | 의미적 유사성 | 키워드 매칭 약함 |
| 키워드 검색 | 정확한 매칭 | 유사어 처리 어려움 |
| 하이브리드 | 두 장점 결합 | 복잡성 증가 |

### MMR (Maximal Marginal Relevance)

\`\`\`python
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 5,
        "fetch_k": 20,  # 초기 검색 수
        "lambda_mult": 0.7  # 다양성 vs 관련성
    }
)
\`\`\`

### 메타데이터 필터링

\`\`\`python
retriever = vectorstore.as_retriever(
    search_kwargs={
        "k": 5,
        "filter": {"category": "tech"}
    }
)
\`\`\`
        `
      }
    },
    {
      id: 'retrieval-practice',
      type: 'code',
      title: '검색 최적화 실습',
      duration: 90,
      content: {
        objectives: ['다양한 검색 전략을 구현하고 비교한다'],
        instructions: 'MMR, 필터링, 하이브리드 검색을 구현하세요.',
        starterCode: `# 검색 전략 비교 구현`,
        solutionCode: `from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document

class AdvancedRetriever:
    def __init__(self, documents: list[Document]):
        self.embeddings = OpenAIEmbeddings()
        self.vectorstore = Chroma.from_documents(documents, self.embeddings)

    def similarity_search(self, query: str, k: int = 3):
        return self.vectorstore.similarity_search(query, k=k)

    def mmr_search(self, query: str, k: int = 3):
        return self.vectorstore.max_marginal_relevance_search(
            query, k=k, fetch_k=10, lambda_mult=0.7
        )

    def filtered_search(self, query: str, filter_dict: dict, k: int = 3):
        return self.vectorstore.similarity_search(query, k=k, filter=filter_dict)
`
      }
    }
  ]
}

const day4: Day = {
  slug: 'rag-chain',
  title: 'RAG Chain 구축',
  totalDuration: 180,
  tasks: [
    {
      id: 'rag-chain-video',
      type: 'video',
      title: 'RAG Chain 패턴',
      duration: 40,
      content: {
        objectives: [
          'RAG 체인 구조를 이해한다',
          '컨텍스트 통합 방법을 학습한다',
          '출처 추적을 구현한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=rag-chain-placeholder',
        transcript: `
## RAG Chain 구축

### 기본 RAG Chain

\`\`\`python
from langchain_core.runnables import RunnablePassthrough

def format_docs(docs):
    return "\\n\\n".join(doc.page_content for doc in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
\`\`\`

### 출처 포함 RAG

\`\`\`python
from langchain_core.runnables import RunnableParallel

rag_chain_with_sources = RunnableParallel(
    {"docs": retriever, "question": RunnablePassthrough()}
).assign(
    answer=lambda x: (prompt | llm | StrOutputParser()).invoke({
        "context": format_docs(x["docs"]),
        "question": x["question"]
    })
)
\`\`\`
        `
      }
    },
    {
      id: 'rag-chain-practice',
      type: 'code',
      title: 'RAG Chain 구현 실습',
      duration: 90,
      content: {
        objectives: ['완전한 RAG 파이프라인을 구현한다'],
        instructions: '출처 추적과 품질 평가가 포함된 RAG 체인을 구축하세요.',
        starterCode: `# 완전한 RAG Chain 구현`,
        solutionCode: `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableParallel

class RAGPipeline:
    def __init__(self, persist_directory: str = "./chroma_db"):
        self.embeddings = OpenAIEmbeddings()
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=self.embeddings
        )
        self._setup_chain()

    def _format_docs(self, docs):
        return "\\n\\n".join(
            f"[{i+1}] {doc.page_content}"
            for i, doc in enumerate(docs)
        )

    def _setup_chain(self):
        prompt = ChatPromptTemplate.from_template("""
컨텍스트를 기반으로 질문에 답하세요.
답변 끝에 사용한 출처 번호를 [1], [2] 형식으로 표시하세요.

컨텍스트:
{context}

질문: {question}

답변:""")

        retriever = self.vectorstore.as_retriever(search_kwargs={"k": 3})

        self.chain = (
            RunnableParallel(
                docs=retriever,
                question=RunnablePassthrough()
            )
            | RunnablePassthrough.assign(
                context=lambda x: self._format_docs(x["docs"])
            )
            | RunnablePassthrough.assign(
                answer=lambda x: (prompt | self.llm | StrOutputParser()).invoke({
                    "context": x["context"],
                    "question": x["question"]
                })
            )
        )

    def query(self, question: str) -> dict:
        result = self.chain.invoke(question)
        return {
            "answer": result["answer"],
            "sources": [doc.metadata for doc in result["docs"]]
        }
`
      }
    }
  ]
}

const day5: Day = {
  slug: 'rag-project',
  title: 'RAG 미니 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'rag-project-challenge',
      type: 'challenge',
      title: '기술 문서 Q&A 시스템',
      duration: 180,
      content: {
        objectives: [
          '실전 RAG 시스템을 구축한다',
          '문서 처리 파이프라인을 완성한다',
          '검색 품질을 최적화한다'
        ],
        requirements: [
          '**데이터 처리**',
          '- PDF/마크다운 문서 로드',
          '- 최적의 청킹 전략 적용',
          '- 메타데이터 관리',
          '',
          '**검색 시스템**',
          '- 벡터 스토어 구축',
          '- MMR 검색 적용',
          '- 메타데이터 필터링',
          '',
          '**답변 생성**',
          '- 컨텍스트 기반 답변',
          '- 출처 명시',
          '- "모름" 처리'
        ],
        evaluationCriteria: [
          '문서 처리 완성도 (25%)',
          '검색 품질 (25%)',
          '답변 정확도 (25%)',
          '코드 품질 (25%)'
        ],
        bonusPoints: [
          '대화 히스토리 통합',
          '검색 결과 리랭킹',
          'Streamlit UI',
          '평가 파이프라인'
        ]
      }
    }
  ]
}

export const ragSystemWeek: Week = {
  slug: 'rag-system',
  week: 3,
  phase: 5,
  month: 10,
  access: 'pro',
  title: 'RAG 시스템 구축',
  topics: ['RAG', 'Embedding', 'Vector Store', 'Retrieval', 'Document Processing'],
  practice: '기술 문서 Q&A 시스템',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
