// Phase 5, Week 8: GenAI Capstone 프로젝트
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'project-planning',
  title: '프로젝트 기획',
  totalDuration: 180,
  tasks: [
    {
      id: 'genai-project-intro-video',
      type: 'video',
      title: 'Capstone 프로젝트 소개',
      duration: 30,
      content: {
        objectives: [
          '프로젝트 범위와 목표를 정의한다',
          '기술 스택을 선정한다',
          '일정을 계획한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=genai-project-placeholder',
        transcript: `
## Phase 5 Capstone 프로젝트

### 프로젝트 목표

\`\`\`
완성 목표:
├── 프로덕션 수준의 GenAI 애플리케이션
├── RAG 또는 Agent 기반 시스템
├── LLMOps 적용
├── 배포 및 운영
└── 포트폴리오 문서화
\`\`\`

### 프로젝트 옵션

| 옵션 | 난이도 | 핵심 기술 |
|------|--------|----------|
| **Enterprise RAG** | 중상 | RAG, 벡터DB, LLMOps |
| **AI Agent Platform** | 상 | Multi-Agent, LangGraph |
| **Code Assistant** | 중상 | RAG, Code Analysis |
| **Customer Support Bot** | 중 | RAG, Memory, Tools |

### 아키텍처 예시 (Enterprise RAG)

\`\`\`
[사용자]
    │
    ▼
[Frontend (Streamlit/Next.js)]
    │
    ▼
[API Server (FastAPI)]
    │
    ├─→ [RAG Pipeline]
    │   ├── Embedding Service
    │   ├── Vector Store (Pinecone/Chroma)
    │   └── Re-ranker
    │
    ├─→ [LLM Router]
    │   ├── GPT-4o
    │   ├── Claude
    │   └── Fallback
    │
    └─→ [LLMOps]
        ├── Langfuse (Observability)
        ├── Cache (Redis)
        └── Guardrails
\`\`\`

### 기술 스택

| 레이어 | 기술 |
|--------|------|
| Frontend | Streamlit / Next.js |
| Backend | FastAPI / LangServe |
| LLM | OpenAI / Anthropic |
| Vector DB | Pinecone / Chroma |
| Observability | Langfuse / LangSmith |
| 배포 | Docker + Cloud Run |
        `
      }
    },
    {
      id: 'architecture-design',
      type: 'reading',
      title: '아키텍처 설계 문서',
      duration: 60,
      content: {
        objectives: ['설계 문서 작성', 'ADR 작성', '다이어그램 작성'],
        markdown: `
## 아키텍처 설계 문서 (ADR)

### 작성 항목

1. **컨텍스트**: 왜 이 시스템이 필요한가?
2. **목표**: 무엇을 달성하려 하는가?
3. **제약조건**: 기술적/비즈니스적 제약
4. **결정**: 어떤 기술/아키텍처를 선택했는가?
5. **대안**: 고려한 다른 옵션
6. **결과**: 예상되는 장단점

### 문서 템플릿

\`\`\`markdown
# ADR-001: RAG 시스템 벡터 스토어 선택

## 컨텍스트
기술 문서 기반 Q&A 시스템에 벡터 스토어가 필요함

## 결정
Pinecone 선택

## 대안
- Chroma: 로컬, 무료, 확장성 제한
- Weaviate: 하이브리드 검색, 셀프호스팅 필요
- FAISS: 인메모리, 영속성 없음

## 결과
장점:
- 관리형 서비스
- 빠른 시작
- 확장성

단점:
- 비용
- 벤더 종속
\`\`\`
        `
      }
    },
    {
      id: 'project-setup',
      type: 'code',
      title: '프로젝트 설정',
      duration: 90,
      content: {
        objectives: ['프로젝트 구조 설정', '개발 환경 구축', 'CI/CD 기초 설정'],
        instructions: '프로젝트 기본 구조를 설정하세요.',
        starterCode: `# 프로젝트 구조 설정
# requirements.txt, Dockerfile, 기본 코드 구조`,
        solutionCode: `# 프로젝트 구조
"""
genai-project/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI 앱
│   ├── config.py        # 설정
│   ├── rag/
│   │   ├── __init__.py
│   │   ├── pipeline.py  # RAG 파이프라인
│   │   └── retriever.py # 검색
│   ├── llm/
│   │   ├── __init__.py
│   │   ├── router.py    # 모델 라우팅
│   │   └── client.py    # LLM 클라이언트
│   └── utils/
│       ├── __init__.py
│       ├── cache.py
│       └── guardrails.py
├── tests/
├── docs/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
"""

# requirements.txt
requirements = """
fastapi==0.109.0
uvicorn==0.27.0
langchain==0.1.0
langchain-openai==0.0.3
langchain-anthropic==0.0.2
langchain-chroma==0.1.0
pydantic==2.5.0
python-dotenv==1.0.0
redis==5.0.0
langfuse==2.0.0
"""

# Dockerfile
dockerfile = """
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
"""

# app/main.py
main_py = '''
from fastapi import FastAPI
from app.rag.pipeline import RAGPipeline
from pydantic import BaseModel

app = FastAPI(title="GenAI Project")
rag = RAGPipeline()

class Query(BaseModel):
    question: str
    session_id: str = "default"

@app.post("/ask")
async def ask(query: Query):
    result = rag.query(query.question)
    return {"answer": result["answer"], "sources": result["sources"]}

@app.get("/health")
async def health():
    return {"status": "ok"}
'''
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'core-implementation',
  title: '핵심 기능 구현',
  totalDuration: 180,
  tasks: [
    {
      id: 'rag-implementation',
      type: 'code',
      title: 'RAG 파이프라인 구현',
      duration: 120,
      content: {
        objectives: ['핵심 RAG/Agent 기능을 구현한다', 'LangChain 컴포넌트를 통합한다'],
        instructions: '프로젝트의 핵심 기능을 구현하세요.',
        starterCode: `# RAG 파이프라인 구현`,
        solutionCode: `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from typing import List, Dict

class RAGPipeline:
    def __init__(self, persist_directory: str = "./data/chroma"):
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=self.embeddings
        )
        self._setup_chain()

    def _format_docs(self, docs) -> str:
        return "\\n\\n".join(
            f"[{i+1}] {doc.page_content}"
            for i, doc in enumerate(docs)
        )

    def _setup_chain(self):
        self.prompt = ChatPromptTemplate.from_template("""
당신은 기술 문서 전문가입니다.
주어진 컨텍스트를 기반으로 질문에 답변하세요.
컨텍스트에 없는 정보는 "해당 정보를 찾을 수 없습니다"라고 답하세요.

컨텍스트:
{context}

질문: {question}

답변:""")

        self.retriever = self.vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={"k": 5, "fetch_k": 10}
        )

    def index_documents(self, documents: List) -> int:
        self.vectorstore.add_documents(documents)
        return len(documents)

    def query(self, question: str) -> Dict:
        # 검색
        docs = self.retriever.invoke(question)

        # 체인 실행
        chain = (
            {"context": lambda x: self._format_docs(docs), "question": RunnablePassthrough()}
            | self.prompt
            | self.llm
            | StrOutputParser()
        )

        answer = chain.invoke(question)

        return {
            "answer": answer,
            "sources": [
                {"content": doc.page_content[:200], "metadata": doc.metadata}
                for doc in docs
            ]
        }
`
      }
    },
    {
      id: 'llm-router-implementation',
      type: 'code',
      title: 'LLM 라우터 구현',
      duration: 60,
      content: {
        objectives: ['모델 라우팅과 폴백을 구현한다'],
        instructions: '비용 효율적인 LLM 라우터를 구현하세요.',
        starterCode: `# LLM 라우터`,
        solutionCode: `from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from typing import Optional
import time

class LLMRouter:
    def __init__(self):
        self.models = {
            "gpt-4o-mini": ChatOpenAI(model="gpt-4o-mini"),
            "gpt-4o": ChatOpenAI(model="gpt-4o"),
            "claude-3-5-sonnet": ChatAnthropic(model="claude-3-5-sonnet-20241022")
        }
        self.fallback_order = ["gpt-4o-mini", "claude-3-5-sonnet", "gpt-4o"]

    def _classify_complexity(self, prompt: str) -> str:
        if len(prompt) > 2000 or any(w in prompt.lower() for w in ["분석", "복잡한", "상세"]):
            return "high"
        return "low"

    def _select_model(self, complexity: str) -> str:
        if complexity == "high":
            return "gpt-4o"
        return "gpt-4o-mini"

    def invoke(self, prompt: str, model: Optional[str] = None) -> str:
        if not model:
            complexity = self._classify_complexity(prompt)
            model = self._select_model(complexity)

        for fallback_model in [model] + [m for m in self.fallback_order if m != model]:
            try:
                response = self.models[fallback_model].invoke(prompt)
                return response.content
            except Exception as e:
                print(f"Model {fallback_model} failed: {e}")
                time.sleep(1)

        raise Exception("All models failed")
`
      }
    }
  ]
}

const day3: Day = {
  slug: 'llmops-integration',
  title: 'LLMOps 통합',
  totalDuration: 180,
  tasks: [
    {
      id: 'observability-integration',
      type: 'code',
      title: 'Observability 통합',
      duration: 90,
      content: {
        objectives: ['Langfuse/LangSmith 통합', '메트릭 수집 설정'],
        instructions: '관측성 도구를 통합하세요.',
        starterCode: `# Observability 통합`,
        solutionCode: `import os
from langfuse.callback import CallbackHandler
from langchain_core.callbacks import BaseCallbackHandler
from datetime import datetime
import json

class ObservabilityManager:
    def __init__(self):
        self.langfuse_handler = None
        self.custom_handler = CustomMetricsHandler()

        if os.getenv("LANGFUSE_PUBLIC_KEY"):
            self.langfuse_handler = CallbackHandler(
                public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
                secret_key=os.getenv("LANGFUSE_SECRET_KEY")
            )

    def get_callbacks(self):
        callbacks = [self.custom_handler]
        if self.langfuse_handler:
            callbacks.append(self.langfuse_handler)
        return callbacks

class CustomMetricsHandler(BaseCallbackHandler):
    def __init__(self):
        self.metrics = {
            "total_calls": 0,
            "total_tokens": 0,
            "errors": 0,
            "latencies": []
        }
        self.current_start = None

    def on_llm_start(self, *args, **kwargs):
        self.current_start = datetime.now()
        self.metrics["total_calls"] += 1

    def on_llm_end(self, response, **kwargs):
        if self.current_start:
            latency = (datetime.now() - self.current_start).total_seconds()
            self.metrics["latencies"].append(latency)

        if response.llm_output:
            tokens = response.llm_output.get("token_usage", {}).get("total_tokens", 0)
            self.metrics["total_tokens"] += tokens

    def on_llm_error(self, error, **kwargs):
        self.metrics["errors"] += 1

    def get_summary(self):
        return {
            "total_calls": self.metrics["total_calls"],
            "total_tokens": self.metrics["total_tokens"],
            "avg_latency": sum(self.metrics["latencies"]) / len(self.metrics["latencies"]) if self.metrics["latencies"] else 0,
            "error_rate": self.metrics["errors"] / self.metrics["total_calls"] if self.metrics["total_calls"] > 0 else 0
        }
`
      }
    },
    {
      id: 'guardrails-integration',
      type: 'code',
      title: '가드레일 통합',
      duration: 90,
      content: {
        objectives: ['안전성 가드레일 적용'],
        instructions: '입출력 가드레일을 통합하세요.',
        starterCode: `# 가드레일 통합`,
        solutionCode: `import re
from typing import Tuple, Optional

class Guardrails:
    def __init__(self):
        self.injection_patterns = [
            r"ignore.*previous.*instructions",
            r"disregard.*system.*prompt",
            r"you are now",
            r"act as"
        ]
        self.pii_patterns = {
            "email": r"[\\w.-]+@[\\w.-]+\\.\\w+",
            "phone": r"\\d{2,3}-\\d{3,4}-\\d{4}",
            "ssn": r"\\d{6}-\\d{7}"
        }

    def check_input(self, text: str) -> Tuple[bool, Optional[str]]:
        text_lower = text.lower()
        for pattern in self.injection_patterns:
            if re.search(pattern, text_lower):
                return False, "Potential prompt injection detected"
        return True, None

    def mask_pii(self, text: str) -> str:
        result = text
        for pii_type, pattern in self.pii_patterns.items():
            result = re.sub(pattern, f"[{pii_type.upper()}_MASKED]", result)
        return result

    def check_output(self, text: str) -> Tuple[bool, Optional[str]]:
        for pii_type, pattern in self.pii_patterns.items():
            if re.search(pattern, text):
                return False, f"Output contains {pii_type}"
        return True, None

    def process(self, input_text: str, output_text: str) -> Tuple[str, str, dict]:
        meta = {"input_blocked": False, "output_blocked": False}

        # 입력 검사
        safe, reason = self.check_input(input_text)
        if not safe:
            meta["input_blocked"] = True
            meta["input_reason"] = reason
            return "", "", meta

        # PII 마스킹
        masked_input = self.mask_pii(input_text)
        masked_output = self.mask_pii(output_text)

        return masked_input, masked_output, meta
`
      }
    }
  ]
}

const day4: Day = {
  slug: 'deployment',
  title: '배포 & 운영',
  totalDuration: 180,
  tasks: [
    {
      id: 'deployment-video',
      type: 'video',
      title: '배포 전략',
      duration: 30,
      content: {
        objectives: ['Docker 컨테이너화', 'Cloud Run 배포', '환경 설정 관리'],
        videoUrl: 'https://www.youtube.com/watch?v=deployment-placeholder',
        transcript: `
## 배포

### Docker 빌드

\`\`\`bash
# 빌드
docker build -t genai-project .

# 테스트
docker run -p 8000:8000 --env-file .env genai-project
\`\`\`

### Cloud Run 배포

\`\`\`bash
# GCR에 푸시
docker tag genai-project gcr.io/PROJECT_ID/genai-project
docker push gcr.io/PROJECT_ID/genai-project

# Cloud Run 배포
gcloud run deploy genai-project \\
  --image gcr.io/PROJECT_ID/genai-project \\
  --platform managed \\
  --region asia-northeast3 \\
  --allow-unauthenticated \\
  --set-env-vars "OPENAI_API_KEY=..."
\`\`\`
        `
      }
    },
    {
      id: 'deployment-practice',
      type: 'code',
      title: '배포 실습',
      duration: 120,
      content: {
        objectives: ['실제 배포를 수행한다'],
        instructions: 'Docker 빌드 및 클라우드 배포를 완료하세요.',
        starterCode: `# 배포 스크립트`,
        solutionCode: `# deploy.sh
#!/bin/bash

PROJECT_ID="your-project-id"
REGION="asia-northeast3"
SERVICE_NAME="genai-project"

# 빌드
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME .

# 푸시
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME

# 배포
gcloud run deploy $SERVICE_NAME \\
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \\
  --platform managed \\
  --region $REGION \\
  --memory 2Gi \\
  --cpu 2 \\
  --min-instances 0 \\
  --max-instances 10 \\
  --set-env-vars "OPENAI_API_KEY=$OPENAI_API_KEY" \\
  --set-env-vars "LANGFUSE_PUBLIC_KEY=$LANGFUSE_PUBLIC_KEY"
`
      }
    }
  ]
}

const day5: Day = {
  slug: 'final-presentation',
  title: '최종 발표',
  totalDuration: 180,
  tasks: [
    {
      id: 'final-challenge',
      type: 'challenge',
      title: 'Phase 5 Capstone: GenAI 애플리케이션',
      duration: 180,
      content: {
        objectives: [
          '완전한 GenAI 애플리케이션 구축',
          '운영 가능한 수준의 시스템',
          '포트폴리오 문서화'
        ],
        requirements: [
          '**핵심 기능 (필수)**',
          '- RAG 또는 Agent 기반 시스템',
          '- 최소 3개 이상의 데이터 소스',
          '- 사용자 인터페이스 (Streamlit/Web)',
          '',
          '**LLMOps (필수)**',
          '- Observability (Langfuse/LangSmith)',
          '- 비용 추적',
          '- 캐싱',
          '',
          '**안전성 (필수)**',
          '- 입출력 가드레일',
          '- 에러 핸들링',
          '',
          '**배포 (필수)**',
          '- Docker 컨테이너',
          '- 클라우드 배포',
          '',
          '**문서화 (필수)**',
          '- README',
          '- 아키텍처 문서',
          '- 데모 영상'
        ],
        evaluationCriteria: [
          '기술 완성도 (25%)',
          'LLMOps 적용 (25%)',
          '사용자 경험 (25%)',
          '문서화 및 발표 (25%)'
        ],
        bonusPoints: [
          '멀티 에이전트 시스템',
          'A/B 테스트 프레임워크',
          'CI/CD 파이프라인',
          '성능 벤치마크'
        ]
      }
    }
  ]
}

export const genaiProjectWeek: Week = {
  slug: 'genai-project',
  week: 8,
  phase: 5,
  month: 11,
  access: 'pro',
  title: 'GenAI 프로젝트',
  topics: ['Capstone', 'Full Stack', 'RAG', 'LLMOps', 'Deployment'],
  practice: '프로덕션 GenAI 애플리케이션',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
