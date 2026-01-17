// Day 5: 프로덕션 RAG 시스템 구축 - Week 5 최종 프로젝트

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
  title: '프로덕션 RAG 시스템 구축',
  totalDuration: 300,
  tasks: [
    // ========================================
    // Task 1: 프로덕션 RAG 아키텍처 설계 (40분)
    // ========================================
    createVideoTask('w5d5-prod-architecture', '프로덕션 RAG 아키텍처 설계', 40, {
      introduction: `
## Week 5 최종 프로젝트 개요

Day 1-4에서 학습한 모든 내용을 종합하여 **프로덕션 수준의 RAG 시스템**을 구축합니다.

> "The difference between a demo and production is about 10x the effort."
> — 실제 AI 스타트업에서 자주 들리는 말

## 데모 vs 프로덕션 RAG

| 측면 | 데모 RAG | 프로덕션 RAG |
|------|----------|--------------|
| **문서** | 1개 PDF | 수천 개 문서, 다양한 포맷 |
| **사용자** | 개발자 1명 | 수백/수천 동시 사용자 |
| **응답시간** | 10초도 OK | < 3초 목표 |
| **정확도** | "대충 맞으면 OK" | 99%+ 정확도 필요 |
| **에러** | 에러 무시 | 우아한 에러 처리 |
| **모니터링** | print문 | 전체 파이프라인 추적 |
| **비용** | 신경 안 씀 | 토큰당 비용 최적화 |

## 프로덕션 RAG 아키텍처

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Production RAG Architecture                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────── Data Ingestion Pipeline ─────────────────────────┐   │
│  │                                                                           │   │
│  │  [Sources]           [Processors]          [Chunking]        [Indexing]  │   │
│  │  ├─ PDF              ├─ OCR               ├─ Semantic        ├─ Vector   │   │
│  │  ├─ Word             ├─ Table Extract     ├─ Recursive       ├─ Keyword  │   │
│  │  ├─ HTML             ├─ Image Caption     ├─ Markdown        ├─ Hybrid   │   │
│  │  ├─ Notion           ├─ Code Parse        ├─ Code            └───────────│   │
│  │  └─ Confluence       └─ Metadata          └──────────────────────────────│   │
│  │                                                                           │   │
│  └───────────────────────────────────────────────────────────────────────────┘   │
│                                       ↓                                          │
│  ┌───────────────────────── Vector Database Layer ──────────────────────────┐   │
│  │                                                                           │   │
│  │   ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────┐  │   │
│  │   │   Primary   │    │   Backup    │    │      Metadata Store         │  │   │
│  │   │  (Pinecone) │    │  (Chroma)   │    │      (PostgreSQL)           │  │   │
│  │   └─────────────┘    └─────────────┘    └─────────────────────────────┘  │   │
│  │                                                                           │   │
│  └───────────────────────────────────────────────────────────────────────────┘   │
│                                       ↓                                          │
│  ┌──────────────────────── Retrieval Pipeline ──────────────────────────────┐   │
│  │                                                                           │   │
│  │  [Query Analysis]  →  [Multi-Query]  →  [Hybrid Search]  →  [Re-ranking] │   │
│  │  ├─ Intent         ├─ Expansion      ├─ Vector + BM25    ├─ Cross-Enc   │   │
│  │  ├─ Entity         ├─ Translation    ├─ Filter           ├─ MMR         │   │
│  │  └─ Language       └─ Decomposition  └─ Fusion           └─ Diversity   │   │
│  │                                                                           │   │
│  └───────────────────────────────────────────────────────────────────────────┘   │
│                                       ↓                                          │
│  ┌──────────────────────── Generation Pipeline ─────────────────────────────┐   │
│  │                                                                           │   │
│  │  [Context Assembly]  →  [Prompt Engineering]  →  [LLM Call]  →  [Output] │   │
│  │  ├─ Compression       ├─ System Prompt         ├─ Streaming   ├─ Source  │   │
│  │  ├─ Ordering          ├─ Few-shot              ├─ Fallback    ├─ Cache   │   │
│  │  └─ Deduplication     └─ Format Control        └─ Retry       └─ Log     │   │
│  │                                                                           │   │
│  └───────────────────────────────────────────────────────────────────────────┘   │
│                                       ↓                                          │
│  ┌───────────────────────── Monitoring & Observability ─────────────────────┐   │
│  │                                                                           │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │   │
│  │  │LangSmith│  │  Logs   │  │ Metrics │  │ Alerts  │  │ User Feedback   │ │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │   │
│  │                                                                           │   │
│  └───────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
\`\`\`

## 핵심 설계 원칙 (Production-Ready 5원칙)

### 1. Fail-Safe (안전한 실패)
\`\`\`python
class FailSafeRAG:
    """어떤 상황에서도 안전하게 동작하는 RAG"""

    def __init__(self):
        self.primary_llm = ChatOpenAI(model="gpt-4o-mini")
        self.fallback_llm = ChatAnthropic(model="claude-3-haiku")
        self.cache = RedisCache()

    async def answer(self, question: str) -> RAGResponse:
        try:
            # 1차: 캐시 확인
            cached = await self.cache.get(question)
            if cached:
                return RAGResponse(answer=cached, source="cache")

            # 2차: Primary LLM
            try:
                answer = await self._rag_with_llm(question, self.primary_llm)
                await self.cache.set(question, answer)
                return RAGResponse(answer=answer, source="primary")
            except RateLimitError:
                # 3차: Fallback LLM
                answer = await self._rag_with_llm(question, self.fallback_llm)
                return RAGResponse(answer=answer, source="fallback")

        except Exception as e:
            # 4차: 안전한 기본 응답
            logger.error(f"RAG failed: {e}")
            return RAGResponse(
                answer="죄송합니다. 현재 시스템에 문제가 있습니다. 잠시 후 다시 시도해주세요.",
                source="error_fallback"
            )
\`\`\`

### 2. Observable (관찰 가능)
\`\`\`python
from langsmith import traceable
from datadog import statsd
import structlog

logger = structlog.get_logger()

class ObservableRAG:
    @traceable(name="rag_pipeline")  # LangSmith 추적
    async def answer(self, question: str) -> RAGResponse:
        start_time = time.time()

        # 검색 단계 추적
        with logger.contextualize(step="retrieval"):
            docs = await self._retrieve(question)
            statsd.histogram("rag.retrieval.doc_count", len(docs))

        # 생성 단계 추적
        with logger.contextualize(step="generation"):
            answer = await self._generate(question, docs)
            statsd.histogram("rag.generation.token_count", count_tokens(answer))

        # 전체 지연시간
        latency = time.time() - start_time
        statsd.histogram("rag.latency_seconds", latency)

        # 구조화된 로그
        logger.info(
            "rag_completed",
            question=question[:100],
            doc_count=len(docs),
            latency=latency
        )

        return RAGResponse(answer=answer, latency=latency)
\`\`\`

### 3. Scalable (확장 가능)
\`\`\`python
from asyncio import Semaphore
from functools import lru_cache

class ScalableRAG:
    def __init__(self, max_concurrent: int = 10):
        self.semaphore = Semaphore(max_concurrent)  # 동시 요청 제한
        self.embedding_cache = lru_cache(maxsize=10000)

    async def batch_answer(self, questions: list[str]) -> list[RAGResponse]:
        """배치 처리로 효율성 극대화"""

        # 1. 임베딩 배치 처리 (API 호출 최소화)
        unique_questions = list(set(questions))
        embeddings = await self.embed_batch(unique_questions)

        # 2. 병렬 검색 (세마포어로 동시성 제어)
        async def retrieve_one(q: str, emb: list[float]):
            async with self.semaphore:
                return await self._retrieve(q, emb)

        docs_list = await asyncio.gather(*[
            retrieve_one(q, emb) for q, emb in zip(unique_questions, embeddings)
        ])

        # 3. 답변 생성
        return [self._generate(q, docs) for q, docs in zip(questions, docs_list)]
\`\`\`

### 4. Cost-Efficient (비용 효율적)
\`\`\`python
class CostEfficientRAG:
    def __init__(self):
        self.router = QueryRouter()  # 쿼리 복잡도 분류

        # 비용/성능 티어
        self.tiers = {
            "simple": ChatOpenAI(model="gpt-4o-mini"),      # $0.15/1M
            "complex": ChatOpenAI(model="gpt-4o"),          # $2.50/1M
            "expert": ChatAnthropic(model="claude-opus-4")  # $15/1M
        }

    async def answer(self, question: str) -> RAGResponse:
        # 쿼리 복잡도에 따라 모델 선택
        tier = self.router.classify(question)
        llm = self.tiers[tier]

        # 비용 추적
        with CostTracker() as tracker:
            answer = await self._generate(question, llm)

        logger.info(f"Query tier: {tier}, Cost: \${tracker.total_cost:.6f}")
        return answer

# 결과:
# - Simple 쿼리 (80%): $0.15/1M tokens
# - Complex 쿼리 (18%): $2.50/1M tokens
# - Expert 쿼리 (2%): $15/1M tokens
# 평균 비용: 80% * 0.15 + 18% * 2.50 + 2% * 15 = $0.87/1M (vs $2.50 단일 모델)
\`\`\`

### 5. Secure (보안)
\`\`\`python
from pydantic import BaseModel, field_validator
import re

class SecureRAG:
    # 프롬프트 인젝션 방지 패턴
    INJECTION_PATTERNS = [
        r"ignore previous instructions",
        r"forget your instructions",
        r"you are now",
        r"\\[system\\]",
    ]

    def sanitize_input(self, text: str) -> str:
        """사용자 입력 검증"""
        for pattern in self.INJECTION_PATTERNS:
            if re.search(pattern, text.lower()):
                raise ValueError("Potential injection detected")
        return text.strip()[:2000]  # 길이 제한

    def filter_output(self, answer: str) -> str:
        """민감 정보 필터링"""
        # 개인정보 마스킹
        answer = re.sub(r'\\b\\d{6}-\\d{7}\\b', '[주민번호]', answer)
        answer = re.sub(r'\\b\\d{3}-\\d{4}-\\d{4}\\b', '[전화번호]', answer)
        return answer

    async def answer(self, question: str) -> RAGResponse:
        # 입력 검증
        safe_question = self.sanitize_input(question)

        # RAG 실행
        answer = await self._rag(safe_question)

        # 출력 필터링
        safe_answer = self.filter_output(answer)

        return RAGResponse(answer=safe_answer)
\`\`\`

## 기술 스택 결정 매트릭스

프로젝트 규모에 따른 기술 스택 가이드:

| 규모 | 벡터DB | LLM | 프레임워크 | 인프라 |
|------|--------|-----|-----------|--------|
| **PoC** | Chroma (로컬) | GPT-4o-mini | LangChain | 로컬/Colab |
| **MVP** | Pinecone Free | GPT-4o-mini + Claude Haiku | LangChain | Vercel/Railway |
| **Scale-up** | Pinecone Standard | GPT-4o + Fallback | LangGraph | AWS ECS/GCP Cloud Run |
| **Enterprise** | pgvector + Pinecone | Fine-tuned + GPT-4 | Custom | Kubernetes |

## 📊 실제 적용 사례 + ROI

### 실제 기업 RAG 도입 사례

| 분야 | 적용 사례 | Before | After | ROI |
|------|----------|--------|-------|-----|
| **고객 상담** | 연말정산 챗봇 | 상담사 1명당 일 50건 | 챗봇이 80% 자동 처리 | **인건비 60% 절감** |
| **사내 지식** | 신입 온보딩 | 질문→선배 시간 낭비 | 사내문서 RAG로 자동 답변 | **온보딩 2주→3일** |
| **법률/금융** | 계약서 검토 | 변호사 2시간/건 | AI 초안 + 변호사 확인 | **검토시간 70% 단축** |
| **제조업** | 설비 매뉴얼 | 매뉴얼 뒤지기 30분 | 음성 질문→즉시 답변 | **설비 가동률 15%↑** |

### ROI 계산 방법

\`\`\`python
# 예시: 연말정산 챗봇 ROI 계산

# Before (상담사 운영)
daily_queries = 1000           # 일일 질문 수
avg_handling_time = 10         # 건당 평균 처리시간 (분)
hourly_wage = 25000           # 상담사 시급 (원)
monthly_labor_cost = (daily_queries * avg_handling_time / 60) * hourly_wage * 22
# = 1000 * 10/60 * 25000 * 22 = 91,666,667원/월

# After (RAG 챗봇)
chatbot_coverage = 0.8        # 챗봇 자동 처리율 80%
api_cost_per_query = 50       # GPT-4o-mini 비용 (약 50원/건)
monthly_api_cost = daily_queries * chatbot_coverage * api_cost_per_query * 22
# = 1000 * 0.8 * 50 * 22 = 880,000원/월

# ROI 계산
monthly_savings = monthly_labor_cost - monthly_api_cost
# = 91,666,667 - 880,000 = 약 9,080만원/월 절감!

roi_percentage = (monthly_savings / monthly_labor_cost) * 100
# = 99% ROI (거의 전액 절감)
\`\`\`

### 성공적인 RAG 도입 체크리스트

\`\`\`markdown
□ 명확한 비즈니스 문제 정의
  - "직원들이 내부 문서를 못 찾아서 시간 낭비"
  - "고객 문의 응답 시간이 너무 김"

□ 측정 가능한 KPI 설정
  - 응답 시간: 5분 → 10초
  - 정확도: 70% → 95%
  - 처리량: 일 100건 → 1000건

□ 작게 시작 (PoC)
  - 전체 문서가 아닌 핵심 문서 100개부터
  - 전체 사용자가 아닌 파일럿 그룹 10명부터

□ 피드백 루프 구축
  - 👍/👎 버튼으로 답변 품질 수집
  - 주간 리뷰 → 프롬프트/청킹 개선
\`\`\`

> 💡 **핵심 포인트**
>
> RAG 프로젝트는 기술이 아니라 **비즈니스 문제 해결**입니다.
> "어떤 문제를 풀 것인가?"가 "어떤 모델을 쓸 것인가?"보다 100배 중요합니다.
      `,
      keyPoints: [
        '프로덕션 RAG는 데모의 10배 복잡도',
        '5원칙: Fail-Safe, Observable, Scalable, Cost-Efficient, Secure',
        '규모에 맞는 기술 스택 선택',
        '📊 ROI 중심 사고: 비즈니스 문제 → 기술 선택',
      ],
      practiceGoal: '프로덕션 수준 RAG 시스템의 아키텍처와 설계 원칙을 이해한다',
    }),

    // ========================================
    // Task 2: 멀티 포맷 문서 처리 파이프라인 (50분)
    // ========================================
    createCodeTask('w5d5-document-pipeline', '멀티 포맷 문서 처리 파이프라인', 50, {
      introduction: `
## 왜 배우는가?

**문제**: RAG 튜토리얼은 항상 "PDF 하나만" 다루는데, 실제 기업은 PDF, Word, Excel, HTML, 코드 등 수십 가지 포맷이 섞여 있습니다.
- 각 포맷마다 다른 라이브러리 필요
- 테이블, 이미지 누락
- 메타데이터 손실
- 통합 처리 어려움

**해결**: 모든 포맷을 표준화된 ProcessedDocument로 변환하는 파이프라인을 구축합니다.

---

## 비유: 문서 처리 = 번역기

\`\`\`
문제:
- PDF 말하는 사람
- Word 말하는 사람
- HTML 말하는 사람
→ 서로 못 알아듣음!

해결:
모든 언어(포맷) → 영어(ProcessedDocument) 번역
→ 통합 처리 가능!

ProcessedDocument = {
  content: "추출된 텍스트"
  metadata: {"source": "file.pdf", "page": 1}
  tables: [...]  # 테이블 데이터
}
\`\`\`

---

## 핵심 구현 (간소화)

\`\`\`python
# 📌 Step 1: 통합 문서 로더
class UniversalDocumentLoader:
    def __init__(self):
        self.loaders = {
            ".pdf": PDFLoader(),
            ".docx": DocxLoader(),
            ".html": HTMLLoader(),
            ".md": MarkdownLoader(),
            ".py": CodeLoader()
        }

    def load(self, path: str) -> ProcessedDocument:
        ext = Path(path).suffix.lower()
        loader = self.loaders.get(ext)
        if not loader:
            raise ValueError(f"Unsupported format: {ext}")
        return loader.load(path)

# 📌 Step 2: 사용
loader = UniversalDocumentLoader()

# PDF 처리
pdf_doc = loader.load("report.pdf")
print(f"Text: {pdf_doc.content[:100]}")
print(f"Tables: {len(pdf_doc.tables)}")

# Word 처리
word_doc = loader.load("proposal.docx")
print(f"Text: {word_doc.content[:100]}")

# 📌 Step 3: 배치 처리
import os

docs = []
for file in os.listdir("./documents"):
    try:
        doc = loader.load(f"./documents/{file}")
        docs.append(doc)
    except ValueError:
        print(f"Skipped unsupported file: {file}")

print(f"Loaded {len(docs)} documents")

# 📌 Step 4: 청킹 & 벡터화
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(chunk_size=500)
all_chunks = []

for doc in docs:
    chunks = splitter.split_text(doc.content)
    all_chunks.extend(chunks)

print(f"Total chunks: {len(all_chunks)}")
\`\`\`

---

## 실무 문서 포맷의 다양성

실제 기업 환경에서는 PDF만 있는 게 아닙니다:

\`\`\`
📁 실제 기업 문서 현황
├── 📄 PDF (40%) - 계약서, 매뉴얼, 보고서
├── 📝 Word/Docx (25%) - 제안서, 기획서
├── 📊 Excel/CSV (15%) - 데이터, 리포트
├── 🌐 HTML/Web (10%) - 사내 위키, 포탈
├── 📓 Notion/Confluence (5%) - 기술 문서
└── 💻 Code (5%) - README, 주석
\`\`\`

---

## 전체 코드 (상세)

### 통합 문서 로더 구현

\`\`\`python
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional
from dataclasses import dataclass
from enum import Enum
import mimetypes

class DocumentType(Enum):
    PDF = "pdf"
    DOCX = "docx"
    XLSX = "xlsx"
    HTML = "html"
    MARKDOWN = "markdown"
    CODE = "code"
    TEXT = "text"
    UNKNOWN = "unknown"

@dataclass
class ProcessedDocument:
    """처리된 문서의 표준 형식"""
    content: str                    # 추출된 텍스트
    metadata: dict                  # 메타데이터
    source_type: DocumentType       # 원본 형식
    chunks: list[str] = None        # 청킹 결과 (선택적)
    tables: list[dict] = None       # 테이블 데이터 (선택적)
    images: list[dict] = None       # 이미지 설명 (선택적)

class BaseDocumentLoader(ABC):
    """문서 로더 베이스 클래스"""

    @abstractmethod
    def load(self, path: str) -> ProcessedDocument:
        pass

    @abstractmethod
    def supports(self, path: str) -> bool:
        pass

class PDFLoader(BaseDocumentLoader):
    """PDF 문서 로더 - 테이블, 이미지 포함"""

    def __init__(self, ocr_enabled: bool = False):
        self.ocr_enabled = ocr_enabled

    def supports(self, path: str) -> bool:
        return path.lower().endswith('.pdf')

    def load(self, path: str) -> ProcessedDocument:
        import fitz  # PyMuPDF
        from tabula import read_pdf

        doc = fitz.open(path)
        full_text = []
        tables = []
        images = []

        for page_num, page in enumerate(doc):
            # 텍스트 추출
            text = page.get_text("text")

            # OCR 필요 시 (스캔 PDF)
            if not text.strip() and self.ocr_enabled:
                text = self._ocr_page(page)

            full_text.append(f"[Page {page_num + 1}]\\n{text}")

            # 이미지 추출 (선택적)
            for img in page.get_images():
                img_data = self._extract_image(doc, img)
                if img_data:
                    images.append({
                        "page": page_num + 1,
                        "data": img_data
                    })

        # 테이블 추출 (tabula-py)
        try:
            df_list = read_pdf(path, pages='all')
            for i, df in enumerate(df_list):
                if not df.empty:
                    tables.append({
                        "index": i,
                        "data": df.to_dict('records'),
                        "markdown": df.to_markdown()
                    })
        except Exception:
            pass  # 테이블 없는 PDF

        return ProcessedDocument(
            content="\\n\\n".join(full_text),
            metadata={
                "source": path,
                "page_count": len(doc),
                "table_count": len(tables),
                "image_count": len(images)
            },
            source_type=DocumentType.PDF,
            tables=tables,
            images=images
        )

    def _ocr_page(self, page) -> str:
        """OCR로 텍스트 추출"""
        import pytesseract
        from PIL import Image
        import io

        pix = page.get_pixmap()
        img = Image.open(io.BytesIO(pix.tobytes()))
        return pytesseract.image_to_string(img, lang='kor+eng')

class DocxLoader(BaseDocumentLoader):
    """Word 문서 로더"""

    def supports(self, path: str) -> bool:
        return path.lower().endswith(('.docx', '.doc'))

    def load(self, path: str) -> ProcessedDocument:
        from docx import Document
        from docx.table import Table

        doc = Document(path)
        paragraphs = []
        tables = []

        for element in doc.element.body:
            if element.tag.endswith('p'):  # 단락
                for para in doc.paragraphs:
                    if para._element == element:
                        paragraphs.append(para.text)
                        break
            elif element.tag.endswith('tbl'):  # 테이블
                for table in doc.tables:
                    if table._tbl == element:
                        table_data = []
                        for row in table.rows:
                            table_data.append([cell.text for cell in row.cells])
                        tables.append({
                            "data": table_data,
                            "markdown": self._table_to_markdown(table_data)
                        })
                        break

        return ProcessedDocument(
            content="\\n\\n".join(paragraphs),
            metadata={"source": path, "table_count": len(tables)},
            source_type=DocumentType.DOCX,
            tables=tables
        )

    def _table_to_markdown(self, data: list[list[str]]) -> str:
        if not data:
            return ""
        headers = data[0]
        md = "| " + " | ".join(headers) + " |\\n"
        md += "| " + " | ".join(["---"] * len(headers)) + " |\\n"
        for row in data[1:]:
            md += "| " + " | ".join(row) + " |\\n"
        return md

class HTMLLoader(BaseDocumentLoader):
    """HTML/웹 페이지 로더"""

    def supports(self, path: str) -> bool:
        return path.lower().endswith(('.html', '.htm')) or path.startswith('http')

    def load(self, path: str) -> ProcessedDocument:
        from bs4 import BeautifulSoup
        import requests

        if path.startswith('http'):
            response = requests.get(path, timeout=10)
            html = response.text
        else:
            with open(path, 'r', encoding='utf-8') as f:
                html = f.read()

        soup = BeautifulSoup(html, 'html.parser')

        # 불필요한 요소 제거
        for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
            tag.decompose()

        # 텍스트 추출
        text = soup.get_text(separator='\\n', strip=True)

        # 제목 추출
        title = soup.find('title')
        title_text = title.string if title else "Unknown"

        return ProcessedDocument(
            content=text,
            metadata={"source": path, "title": title_text},
            source_type=DocumentType.HTML
        )

class CodeLoader(BaseDocumentLoader):
    """소스 코드 로더 - 구조 보존"""

    CODE_EXTENSIONS = {
        '.py': 'python', '.js': 'javascript', '.ts': 'typescript',
        '.java': 'java', '.go': 'go', '.rs': 'rust', '.cpp': 'cpp'
    }

    def supports(self, path: str) -> bool:
        return Path(path).suffix in self.CODE_EXTENSIONS

    def load(self, path: str) -> ProcessedDocument:
        import ast

        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        ext = Path(path).suffix
        language = self.CODE_EXTENSIONS.get(ext, 'text')

        # Python인 경우 구조 분석
        structure = None
        if ext == '.py':
            try:
                tree = ast.parse(content)
                structure = self._analyze_python(tree)
            except SyntaxError:
                pass

        return ProcessedDocument(
            content=content,
            metadata={
                "source": path,
                "language": language,
                "structure": structure,
                "line_count": len(content.split('\\n'))
            },
            source_type=DocumentType.CODE
        )

    def _analyze_python(self, tree) -> dict:
        """Python AST 분석"""
        import ast

        classes = []
        functions = []
        imports = []

        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                methods = [n.name for n in node.body if isinstance(n, ast.FunctionDef)]
                classes.append({"name": node.name, "methods": methods})
            elif isinstance(node, ast.FunctionDef):
                if node.col_offset == 0:  # 최상위 함수만
                    functions.append(node.name)
            elif isinstance(node, (ast.Import, ast.ImportFrom)):
                imports.append(ast.unparse(node))

        return {"classes": classes, "functions": functions, "imports": imports}
\`\`\`

## 통합 문서 프로세서

\`\`\`python
class UnifiedDocumentProcessor:
    """통합 문서 처리 파이프라인"""

    def __init__(self, ocr_enabled: bool = False):
        self.loaders = [
            PDFLoader(ocr_enabled=ocr_enabled),
            DocxLoader(),
            HTMLLoader(),
            CodeLoader(),
        ]

    def process(self, path: str) -> ProcessedDocument:
        """파일 형식에 맞는 로더로 자동 처리"""
        for loader in self.loaders:
            if loader.supports(path):
                return loader.load(path)

        # 기본: 텍스트로 읽기
        with open(path, 'r', encoding='utf-8') as f:
            return ProcessedDocument(
                content=f.read(),
                metadata={"source": path},
                source_type=DocumentType.TEXT
            )

    def process_directory(
        self,
        directory: str,
        patterns: list[str] = None,
        recursive: bool = True
    ) -> list[ProcessedDocument]:
        """디렉토리 내 모든 문서 처리"""
        from pathlib import Path
        import fnmatch

        directory = Path(directory)
        patterns = patterns or ['*']
        docs = []

        # 파일 검색
        if recursive:
            files = list(directory.rglob('*'))
        else:
            files = list(directory.glob('*'))

        # 패턴 필터링
        matched_files = []
        for f in files:
            if f.is_file():
                for pattern in patterns:
                    if fnmatch.fnmatch(f.name, pattern):
                        matched_files.append(f)
                        break

        # 병렬 처리
        from concurrent.futures import ThreadPoolExecutor

        with ThreadPoolExecutor(max_workers=4) as executor:
            results = list(executor.map(
                lambda f: self._safe_process(f),
                matched_files
            ))

        return [doc for doc in results if doc is not None]

    def _safe_process(self, path: Path) -> Optional[ProcessedDocument]:
        """안전한 문서 처리 (에러 시 None)"""
        try:
            return self.process(str(path))
        except Exception as e:
            print(f"Error processing {path}: {e}")
            return None
\`\`\`

## 스마트 청킹 with 메타데이터

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

class SmartChunker:
    """문서 타입에 따른 스마트 청킹"""

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk(self, doc: ProcessedDocument) -> list[Document]:
        """문서 타입에 맞는 청킹 전략 적용"""

        if doc.source_type == DocumentType.CODE:
            return self._chunk_code(doc)
        elif doc.source_type == DocumentType.MARKDOWN:
            return self._chunk_markdown(doc)
        else:
            return self._chunk_default(doc)

    def _chunk_default(self, doc: ProcessedDocument) -> list[Document]:
        """기본 재귀적 청킹"""
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            separators=["\\n\\n", "\\n", ". ", " ", ""]
        )

        texts = splitter.split_text(doc.content)

        # 테이블 텍스트 추가
        if doc.tables:
            for table in doc.tables:
                texts.append(f"[Table Data]\\n{table['markdown']}")

        return [
            Document(
                page_content=text,
                metadata={
                    **doc.metadata,
                    "chunk_index": i,
                    "source_type": doc.source_type.value
                }
            )
            for i, text in enumerate(texts)
        ]

    def _chunk_code(self, doc: ProcessedDocument) -> list[Document]:
        """코드용 청킹 - 함수/클래스 단위"""
        from langchain.text_splitter import PythonCodeTextSplitter

        if doc.metadata.get("language") == "python":
            splitter = PythonCodeTextSplitter(
                chunk_size=self.chunk_size,
                chunk_overlap=self.chunk_overlap
            )
        else:
            splitter = RecursiveCharacterTextSplitter.from_language(
                language=doc.metadata.get("language", "python"),
                chunk_size=self.chunk_size,
                chunk_overlap=self.chunk_overlap
            )

        texts = splitter.split_text(doc.content)

        return [
            Document(
                page_content=text,
                metadata={
                    **doc.metadata,
                    "chunk_index": i,
                    "source_type": "code"
                }
            )
            for i, text in enumerate(texts)
        ]

    def _chunk_markdown(self, doc: ProcessedDocument) -> list[Document]:
        """마크다운용 청킹 - 헤더 구조 보존"""
        from langchain.text_splitter import MarkdownHeaderTextSplitter

        headers_to_split_on = [
            ("#", "h1"),
            ("##", "h2"),
            ("###", "h3"),
        ]

        splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=headers_to_split_on
        )

        splits = splitter.split_text(doc.content)

        return [
            Document(
                page_content=split.page_content,
                metadata={
                    **doc.metadata,
                    **split.metadata,  # 헤더 정보 포함
                    "chunk_index": i,
                    "source_type": "markdown"
                }
            )
            for i, split in enumerate(splits)
        ]
\`\`\`

## 전체 Ingestion 파이프라인

\`\`\`python
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

class IngestionPipeline:
    """문서 수집 → 처리 → 저장 파이프라인"""

    def __init__(
        self,
        persist_directory: str = "./chroma_db",
        embedding_model: str = "text-embedding-3-small"
    ):
        self.processor = UnifiedDocumentProcessor(ocr_enabled=True)
        self.chunker = SmartChunker()
        self.embeddings = OpenAIEmbeddings(model=embedding_model)
        self.persist_directory = persist_directory

    def ingest(self, source: str) -> dict:
        """단일 파일 또는 디렉토리 수집"""
        from pathlib import Path

        path = Path(source)

        if path.is_file():
            docs = [self.processor.process(str(path))]
        else:
            docs = self.processor.process_directory(str(path))

        # 청킹
        all_chunks = []
        for doc in docs:
            chunks = self.chunker.chunk(doc)
            all_chunks.extend(chunks)

        # 벡터 저장소에 저장
        vectorstore = Chroma.from_documents(
            documents=all_chunks,
            embedding=self.embeddings,
            persist_directory=self.persist_directory
        )

        return {
            "total_documents": len(docs),
            "total_chunks": len(all_chunks),
            "persist_directory": self.persist_directory
        }

    def ingest_incremental(self, source: str) -> dict:
        """증분 수집 - 변경된 파일만"""
        import hashlib
        import json

        # 기존 해시 로드
        hash_file = Path(self.persist_directory) / "file_hashes.json"
        if hash_file.exists():
            with open(hash_file) as f:
                existing_hashes = json.load(f)
        else:
            existing_hashes = {}

        # 변경된 파일 확인
        path = Path(source)
        files = list(path.rglob('*')) if path.is_dir() else [path]

        changed_files = []
        new_hashes = {}

        for f in files:
            if f.is_file():
                file_hash = hashlib.md5(f.read_bytes()).hexdigest()
                new_hashes[str(f)] = file_hash

                if existing_hashes.get(str(f)) != file_hash:
                    changed_files.append(str(f))

        if not changed_files:
            return {"message": "No changes detected", "files_updated": 0}

        # 변경된 파일만 처리
        result = self.ingest(changed_files[0] if len(changed_files) == 1 else source)

        # 해시 저장
        existing_hashes.update(new_hashes)
        with open(hash_file, 'w') as f:
            json.dump(existing_hashes, f)

        return {**result, "files_updated": len(changed_files)}

# 사용 예시
pipeline = IngestionPipeline()

# 전체 디렉토리 수집
result = pipeline.ingest("./documents")
print(f"수집 완료: {result['total_documents']}개 문서, {result['total_chunks']}개 청크")

# 증분 수집 (변경된 파일만)
result = pipeline.ingest_incremental("./documents")
print(f"업데이트: {result.get('files_updated', 0)}개 파일")
\`\`\`

---

## 💥 Common Pitfalls (자주 하는 실수)

### 1. [인코딩] PDF/Word 파일 인코딩 문제

\`\`\`python
# ❌ 잘못된 예시: 인코딩 처리 없이 읽기
text = Path(file_path).read_text()  # 🔴 한글 PDF에서 깨짐

# ✅ 올바른 예시: 라이브러리가 바이너리로 처리
from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader(file_path)  # ✅ 바이너리 처리
docs = loader.load()
\`\`\`

**기억할 점**: PDF/Word는 텍스트 파일 아님. 전용 로더 사용 필수.

---

### 2. [메모리] 대용량 파일 일괄 로드

\`\`\`python
# ❌ 잘못된 예시: 모든 파일 한 번에 메모리에 로드
all_docs = []
for path in glob.glob("*.pdf"):
    loader = PyPDFLoader(path)
    all_docs.extend(loader.load())  # 🔴 1000개 PDF → 메모리 부족

# ✅ 올바른 예시: 스트리밍 + 배치 처리
for batch in chunked(file_paths, size=50):
    docs = []
    for path in batch:
        loader = PyPDFLoader(path)
        docs.extend(loader.load())
    vectorstore.add_documents(docs)  # 배치별로 저장
    docs = []  # 메모리 해제
\`\`\`

**기억할 점**: 대용량 수집 시 배치 처리 + 명시적 메모리 해제.

---

### 3. [증분 수집] 파일 해시만으로 변경 감지

\`\`\`python
# ❌ 잘못된 예시: 파일 해시만 확인
def is_changed(file_path):
    current_hash = hashlib.md5(Path(file_path).read_bytes()).hexdigest()
    return current_hash != self.cache.get(file_path)
# 문제: 삭제된 파일 감지 못함, 메타데이터 변경 무시

# ✅ 올바른 예시: 해시 + mtime + 삭제 감지
def detect_changes(self, directory):
    current_files = set(glob.glob(f"{directory}/**/*", recursive=True))
    cached_files = set(self.cache.keys())

    new_files = current_files - cached_files      # 신규
    deleted_files = cached_files - current_files  # 삭제됨
    modified_files = [f for f in current_files & cached_files
                      if self._is_modified(f)]    # 수정됨
    return new_files, deleted_files, modified_files
\`\`\`

**기억할 점**: 신규/삭제/수정 세 가지 상태 모두 감지해야 완전한 증분 수집.

---

## 🖼️ 멀티모달 RAG: 이미지/표 처리

### 멀티모달의 필요성

실제 문서는 텍스트만 있지 않습니다:

\`\`\`
📁 실제 문서 구성
├── 텍스트 설명
├── 📊 세율표 (이미지)
├── 📈 계산 예시 (표)
├── 📋 신청서 양식 (이미지)
└── 📉 공제 한도표 (표)
\`\`\`

**문제**:
- 기존 RAG = 텍스트만 처리
- 표/이미지 정보 손실
- "세율표 보여줘" → 답변 불가

---

### 멀티모달 RAG 구조

\`\`\`
[PDF 문서]
    ↓
┌────────────────────────────────────────┐
│ 텍스트 추출    │ → 청킹 → 벡터DB       │
│ 표 추출        │ → 마크다운 변환 → 벡터DB│
│ 이미지 추출    │ → Vision LLM 설명 → 벡터DB│
└────────────────────────────────────────┘
    ↓
[통합 검색] → [LLM 답변]
\`\`\`

---

### Vision LLM으로 이미지 설명 생성

\`\`\`python
from langchain_ollama import OllamaLLM
import base64

def describe_image(image_path: str) -> str:
    """이미지를 설명하는 텍스트 생성 (Vision LLM 활용)"""

    # 이미지를 base64로 인코딩
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode()

    # Vision 모델로 설명 생성
    llm = OllamaLLM(model="llava:7b")  # Vision 모델

    prompt = f"""이 이미지를 자세히 설명해주세요.
    표가 있다면 내용을 텍스트로 변환해주세요.
    숫자와 데이터가 있다면 정확히 기록해주세요.

    [이미지 데이터]
    data:image/png;base64,{image_data}
    """

    return llm.invoke(prompt)

# 사용 예시
description = describe_image("세율표.png")
print(description)
# 출력: "이 이미지는 2024년 소득세율표입니다.
#        - 1,200만원 이하: 6%
#        - 1,200만원~4,600만원: 15%
#        - ..."
\`\`\`

---

### 표 추출 및 마크다운 변환

\`\`\`python
import pdfplumber

def extract_tables(pdf_path: str) -> list[str]:
    """PDF에서 표 추출 → 마크다운 변환"""
    tables_md = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            for table in page.extract_tables():
                # 표 → 마크다운 변환
                md_table = convert_to_markdown(table)
                tables_md.append(md_table)

    return tables_md

def convert_to_markdown(table: list) -> str:
    """2D 리스트 → 마크다운 테이블"""
    if not table:
        return ""

    header = table[0]
    rows = table[1:]

    # 헤더
    md = "| " + " | ".join(str(h) for h in header) + " |\\n"
    md += "| " + " | ".join("---" for _ in header) + " |\\n"

    # 데이터 행
    for row in rows:
        md += "| " + " | ".join(str(c) for c in row) + " |\\n"

    return md
\`\`\`

---

### 통합 멀티모달 Document 생성

\`\`\`python
from langchain.schema import Document

def create_multimodal_documents(pdf_path: str) -> list[Document]:
    """PDF에서 텍스트 + 표 + 이미지 모두 추출"""

    documents = []

    # 1. 텍스트 추출
    text = extract_text(pdf_path)
    documents.append(Document(
        page_content=text,
        metadata={"type": "text", "source": pdf_path}
    ))

    # 2. 표 추출 (마크다운)
    tables = extract_tables(pdf_path)
    for i, table_md in enumerate(tables):
        documents.append(Document(
            page_content=f"[표 {i+1}]\\n{table_md}",
            metadata={"type": "table", "source": pdf_path}
        ))

    # 3. 이미지 추출 및 설명 생성
    images = extract_images(pdf_path)
    for img in images:
        description = describe_image(img['path'])
        documents.append(Document(
            page_content=f"[이미지 설명]\\n{description}",
            metadata={"type": "image", "page": img['page'], "source": pdf_path}
        ))

    return documents
\`\`\`

---

### 멀티모달 검색 (타입별 가중치)

\`\`\`python
def multimodal_search(query: str, retriever, k: int = 5) -> list[Document]:
    """멀티모달 검색 with 타입 가중치"""

    # 기본 검색
    docs = retriever.invoke(query)

    # 쿼리 분석하여 타입별 가중치 적용
    if "표" in query or "테이블" in query:
        # 표 문서 우선
        docs = sorted(docs, key=lambda d:
            1 if d.metadata.get('type') == 'table' else 0,
            reverse=True
        )

    elif "이미지" in query or "그림" in query or "사진" in query:
        # 이미지 설명 문서 우선
        docs = sorted(docs, key=lambda d:
            1 if d.metadata.get('type') == 'image' else 0,
            reverse=True
        )

    return docs[:k]

# 사용 예시
results = multimodal_search("세율표 보여줘", retriever)
for doc in results:
    print(f"[{doc.metadata['type']}] {doc.page_content[:100]}...")
\`\`\`

---

### 💡 멀티모달 RAG 핵심 정리

| 콘텐츠 타입 | 처리 방법 | 저장 형태 |
|------------|----------|----------|
| **텍스트** | 직접 추출 | 원본 텍스트 |
| **표** | pdfplumber → 마크다운 | 마크다운 테이블 |
| **이미지** | Vision LLM (llava) | 텍스트 설명 |

**Vision 모델 옵션**:
- **llava:7b** (Ollama): 무료, 로컬 실행
- **GPT-4V**: 최고 성능, API 비용
- **Claude 3**: 우수한 이미지 이해력
      `,
      keyPoints: [
        '📄 PDF, Word, HTML, Code 등 다양한 포맷 처리',
        '✂️ 문서 타입별 최적화된 청킹 전략',
        '🔄 증분 수집으로 효율적 업데이트',
        '🖼️ Vision LLM으로 이미지를 텍스트 설명으로 변환',
        '📊 표를 마크다운으로 변환하여 검색 가능하게',
        '🔀 쿼리 분석으로 콘텐츠 타입별 가중치 적용',
      ],
      practiceGoal: '실무에서 사용되는 다양한 문서 포맷을 처리하는 파이프라인을 구축한다',
    }),

    // ========================================
    // Task 3: 고급 RAG 체인 구현 (45분)
    // ========================================
    createCodeTask('w5d5-advanced-rag-chain', '고급 RAG 체인 구현', 45, {
      introduction: `
## 프로덕션급 RAG 체인

Day 4에서 배운 내용을 실제 서비스 수준으로 발전시킵니다.

\`\`\`python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
from pydantic import BaseModel, Field
from typing import Optional, Literal
from dataclasses import dataclass
from enum import Enum
import time

# ──────────────────────────────────────────────
# 1. 응답 스키마 정의
# ──────────────────────────────────────────────

class AnswerQuality(str, Enum):
    HIGH = "high"           # 컨텍스트에서 직접 답변 가능
    MEDIUM = "medium"       # 추론 필요
    LOW = "low"             # 불확실
    NOT_FOUND = "not_found" # 정보 없음

class RAGResponse(BaseModel):
    """구조화된 RAG 응답"""
    answer: str = Field(description="질문에 대한 답변")
    confidence: float = Field(ge=0, le=1, description="신뢰도 (0-1)")
    quality: AnswerQuality = Field(description="답변 품질")
    sources: list[dict] = Field(description="참조 문서 정보")
    reasoning: Optional[str] = Field(default=None, description="추론 과정")
    follow_up_questions: list[str] = Field(default=[], description="후속 질문 제안")

# ──────────────────────────────────────────────
# 2. 쿼리 분석기
# ──────────────────────────────────────────────

class QueryAnalysis(BaseModel):
    """쿼리 분석 결과"""
    intent: Literal["factual", "analytical", "comparison", "procedural"] = Field(
        description="질문 의도"
    )
    entities: list[str] = Field(description="추출된 엔티티")
    keywords: list[str] = Field(description="검색 키워드")
    requires_multi_hop: bool = Field(description="멀티홉 추론 필요 여부")
    language: str = Field(description="질문 언어")

class QueryAnalyzer:
    """LLM 기반 쿼리 분석"""

    def __init__(self, llm: ChatOpenAI):
        self.llm = llm.with_structured_output(QueryAnalysis)
        self.prompt = ChatPromptTemplate.from_template("""
        Analyze the following question and extract:
        1. Intent: factual (단순 사실), analytical (분석), comparison (비교), procedural (방법)
        2. Entities: 주요 개체 (회사명, 제품명, 기술명 등)
        3. Keywords: 검색에 사용할 키워드
        4. Multi-hop: 여러 문서 조합이 필요한지
        5. Language: 질문 언어

        Question: {question}
        """)

    async def analyze(self, question: str) -> QueryAnalysis:
        chain = self.prompt | self.llm
        return await chain.ainvoke({"question": question})

# ──────────────────────────────────────────────
# 3. 적응형 검색기
# ──────────────────────────────────────────────

class AdaptiveRetriever:
    """쿼리 분석에 따른 적응형 검색"""

    def __init__(self, vectorstore: Chroma, llm: ChatOpenAI):
        self.vectorstore = vectorstore
        self.llm = llm

        # 기본 검색기들
        self.similarity_retriever = vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 5}
        )

        self.mmr_retriever = vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={"k": 5, "fetch_k": 20, "lambda_mult": 0.7}
        )

        # 컨텍스트 압축 검색기
        compressor = LLMChainExtractor.from_llm(llm)
        self.compression_retriever = ContextualCompressionRetriever(
            base_compressor=compressor,
            base_retriever=self.similarity_retriever
        )

    async def retrieve(self, question: str, analysis: QueryAnalysis) -> list:
        """분석 결과에 따른 최적 검색 전략 선택"""

        # 비교 질문: MMR로 다양한 관점 확보
        if analysis.intent == "comparison":
            docs = await self.mmr_retriever.ainvoke(question)

        # 분석 질문: 압축으로 관련 부분만 추출
        elif analysis.intent == "analytical":
            docs = await self.compression_retriever.ainvoke(question)

        # 멀티홉 필요: 더 많은 문서 검색
        elif analysis.requires_multi_hop:
            docs = await self.vectorstore.asimilarity_search(question, k=10)

        # 기본: 유사도 검색
        else:
            docs = await self.similarity_retriever.ainvoke(question)

        return docs

# ──────────────────────────────────────────────
# 4. 프로덕션 RAG 체인
# ──────────────────────────────────────────────

class ProductionRAGChain:
    """프로덕션 수준 RAG 체인"""

    def __init__(
        self,
        vectorstore: Chroma,
        model: str = "gpt-4o-mini",
        temperature: float = 0
    ):
        self.llm = ChatOpenAI(model=model, temperature=temperature)
        self.analyzer = QueryAnalyzer(self.llm)
        self.retriever = AdaptiveRetriever(vectorstore, self.llm)

        self.generation_prompt = ChatPromptTemplate.from_template("""
You are an AI assistant answering questions based on provided documents.

## Instructions
1. Answer ONLY based on the context provided
2. If information is not in context, say "문서에서 해당 정보를 찾을 수 없습니다"
3. Cite sources with [Source: filename, page X]
4. Be concise but complete
5. For comparison questions, use tables or bullet points
6. Suggest 2-3 follow-up questions

## Context
{context}

## Question
{question}

## Query Analysis
- Intent: {intent}
- Key entities: {entities}

## Answer (in Korean)
""")

        # 구조화된 출력용 LLM
        self.structured_llm = self.llm.with_structured_output(RAGResponse)

    async def ainvoke(self, question: str) -> RAGResponse:
        """비동기 RAG 실행"""
        start_time = time.time()

        # 1. 쿼리 분석
        analysis = await self.analyzer.analyze(question)

        # 2. 적응형 검색
        docs = await self.retriever.retrieve(question, analysis)

        if not docs:
            return RAGResponse(
                answer="관련 문서를 찾을 수 없습니다.",
                confidence=0.0,
                quality=AnswerQuality.NOT_FOUND,
                sources=[],
                follow_up_questions=[]
            )

        # 3. 컨텍스트 구성
        context = self._format_context(docs)

        # 4. 답변 생성
        prompt_input = {
            "context": context,
            "question": question,
            "intent": analysis.intent,
            "entities": ", ".join(analysis.entities)
        }

        chain = self.generation_prompt | self.structured_llm
        response = await chain.ainvoke(prompt_input)

        # 5. 소스 정보 추가
        response.sources = [
            {
                "source": doc.metadata.get("source", "Unknown"),
                "page": doc.metadata.get("page", "N/A"),
                "chunk_index": doc.metadata.get("chunk_index", 0)
            }
            for doc in docs
        ]

        # 6. 신뢰도 계산
        response.confidence = self._calculate_confidence(response, docs)

        return response

    def _format_context(self, docs: list) -> str:
        """컨텍스트 포맷팅"""
        formatted = []
        for i, doc in enumerate(docs):
            source = doc.metadata.get("source", "Unknown")
            page = doc.metadata.get("page", "N/A")
            formatted.append(
                f"[Document {i+1}] [Source: {source}, Page: {page}]\\n"
                f"{doc.page_content}\\n"
            )
        return "\\n---\\n".join(formatted)

    def _calculate_confidence(self, response: RAGResponse, docs: list) -> float:
        """신뢰도 계산"""
        # 기본 신뢰도 (답변 품질 기반)
        quality_scores = {
            AnswerQuality.HIGH: 0.9,
            AnswerQuality.MEDIUM: 0.7,
            AnswerQuality.LOW: 0.4,
            AnswerQuality.NOT_FOUND: 0.1
        }

        base_confidence = quality_scores.get(response.quality, 0.5)

        # 문서 수에 따른 조정 (더 많은 문서 = 더 높은 신뢰도)
        doc_factor = min(len(docs) / 5, 1.0)  # 최대 5개까지 고려

        return base_confidence * 0.7 + doc_factor * 0.3

# ──────────────────────────────────────────────
# 5. 스트리밍 RAG
# ──────────────────────────────────────────────

class StreamingRAGChain:
    """스트리밍 응답 RAG"""

    def __init__(self, vectorstore: Chroma, model: str = "gpt-4o-mini"):
        self.llm = ChatOpenAI(model=model, streaming=True)
        self.retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

        self.prompt = ChatPromptTemplate.from_template("""
Context: {context}
Question: {question}
Answer (cite sources with [Source: filename]):""")

    async def astream(self, question: str):
        """스트리밍 응답 생성"""

        # 1. 문서 검색 (스트리밍 전)
        docs = await self.retriever.ainvoke(question)
        context = "\\n\\n".join(d.page_content for d in docs)

        # 2. 스트리밍 응답
        chain = self.prompt | self.llm | StrOutputParser()

        async for chunk in chain.astream({
            "context": context,
            "question": question
        }):
            yield chunk

        # 3. 소스 정보 (마지막에)
        yield "\\n\\n---\\n**참조 문서:**\\n"
        for doc in docs:
            source = doc.metadata.get("source", "Unknown")
            yield f"- {source}\\n"

# ──────────────────────────────────────────────
# 사용 예시
# ──────────────────────────────────────────────

async def main():
    # 벡터스토어 로드
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    vectorstore = Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings
    )

    # 1. 구조화된 RAG
    rag = ProductionRAGChain(vectorstore)
    response = await rag.ainvoke("삼성전자의 2024년 반도체 전략은?")

    print(f"답변: {response.answer}")
    print(f"신뢰도: {response.confidence:.2f}")
    print(f"품질: {response.quality}")
    print(f"소스: {response.sources}")
    print(f"후속 질문: {response.follow_up_questions}")

    # 2. 스트리밍 RAG
    streaming_rag = StreamingRAGChain(vectorstore)

    print("\\n스트리밍 응답:")
    async for chunk in streaming_rag.astream("AI 반도체 시장 전망은?"):
        print(chunk, end="", flush=True)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
\`\`\`
      `,
      keyPoints: [
        '쿼리 분석 → 적응형 검색 → 구조화된 응답',
        'Pydantic으로 타입 안전한 응답 스키마',
        '스트리밍으로 사용자 경험 개선',
      ],
      practiceGoal: '쿼리 분석, 적응형 검색, 구조화된 응답을 갖춘 프로덕션급 RAG 체인을 구현한다',
    }),

    // ========================================
    // Task 4: 에러 핸들링 & 모니터링 (40분)
    // ========================================
    createCodeTask('w5d5-error-monitoring', '에러 핸들링 & 모니터링', 40, {
      introduction: `
## 프로덕션 RAG의 현실

**실제 서비스에서 발생하는 문제들:**

\`\`\`
📊 실제 RAG 서비스 장애 통계 (가상)
├── API Rate Limit: 35%
├── Timeout: 25%
├── Empty Results: 20%
├── Hallucination: 12%
├── Invalid Input: 5%
└── Unknown: 3%
\`\`\`

## 강건한 에러 핸들링

\`\`\`python
from enum import Enum
from typing import TypeVar, Generic, Union
from dataclasses import dataclass
import asyncio
import time
from functools import wraps

# ──────────────────────────────────────────────
# 1. 에러 타입 정의
# ──────────────────────────────────────────────

class RAGErrorType(Enum):
    RATE_LIMIT = "rate_limit"
    TIMEOUT = "timeout"
    EMPTY_CONTEXT = "empty_context"
    GENERATION_FAILED = "generation_failed"
    INVALID_INPUT = "invalid_input"
    VECTOR_DB_ERROR = "vector_db_error"
    EMBEDDING_ERROR = "embedding_error"
    UNKNOWN = "unknown"

@dataclass
class RAGError:
    """구조화된 에러 정보"""
    type: RAGErrorType
    message: str
    recoverable: bool
    retry_after: float = 0  # 재시도 대기 시간
    details: dict = None

T = TypeVar('T')

@dataclass
class Result(Generic[T]):
    """성공/실패를 명시적으로 표현하는 Result 타입"""
    success: bool
    value: T = None
    error: RAGError = None

    @classmethod
    def ok(cls, value: T) -> 'Result[T]':
        return cls(success=True, value=value)

    @classmethod
    def fail(cls, error: RAGError) -> 'Result[T]':
        return cls(success=False, error=error)

# ──────────────────────────────────────────────
# 2. 재시도 데코레이터
# ──────────────────────────────────────────────

def retry_with_exponential_backoff(
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 60.0,
    exponential_base: float = 2.0,
    retryable_errors: tuple = (Exception,)
):
    """지수 백오프 재시도 데코레이터"""

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            delay = base_delay
            last_error = None

            for attempt in range(max_retries + 1):
                try:
                    return await func(*args, **kwargs)

                except retryable_errors as e:
                    last_error = e

                    if attempt == max_retries:
                        raise

                    # Rate limit 에러 시 Retry-After 헤더 사용
                    if hasattr(e, 'retry_after'):
                        delay = e.retry_after

                    print(f"Attempt {attempt + 1} failed: {e}")
                    print(f"Retrying in {delay:.2f} seconds...")

                    await asyncio.sleep(delay)
                    delay = min(delay * exponential_base, max_delay)

            raise last_error

        return wrapper
    return decorator

# ──────────────────────────────────────────────
# 3. Fallback 패턴
# ──────────────────────────────────────────────

class FallbackRAG:
    """다중 폴백을 지원하는 RAG"""

    def __init__(self):
        from langchain_openai import ChatOpenAI
        from langchain_anthropic import ChatAnthropic

        self.llms = [
            ("openai_primary", ChatOpenAI(model="gpt-4o-mini")),
            ("openai_backup", ChatOpenAI(model="gpt-3.5-turbo")),
            ("anthropic", ChatAnthropic(model="claude-3-haiku-20240307")),
        ]

        self.cached_responses = {}

    async def generate(self, prompt: str) -> Result[str]:
        """순차적 폴백 시도"""

        # 1. 캐시 확인
        cache_key = hash(prompt)
        if cache_key in self.cached_responses:
            return Result.ok(self.cached_responses[cache_key])

        errors = []

        # 2. 순차적 시도
        for name, llm in self.llms:
            try:
                response = await llm.ainvoke(prompt)
                answer = response.content

                # 캐시 저장
                self.cached_responses[cache_key] = answer

                return Result.ok(answer)

            except Exception as e:
                error = RAGError(
                    type=self._classify_error(e),
                    message=str(e),
                    recoverable=True,
                    details={"provider": name}
                )
                errors.append(error)
                continue

        # 3. 모든 시도 실패
        return Result.fail(RAGError(
            type=RAGErrorType.GENERATION_FAILED,
            message="All LLM providers failed",
            recoverable=False,
            details={"errors": [e.message for e in errors]}
        ))

    def _classify_error(self, e: Exception) -> RAGErrorType:
        """에러 분류"""
        error_str = str(e).lower()

        if "rate" in error_str or "429" in error_str:
            return RAGErrorType.RATE_LIMIT
        elif "timeout" in error_str or "timed out" in error_str:
            return RAGErrorType.TIMEOUT
        else:
            return RAGErrorType.UNKNOWN

# ──────────────────────────────────────────────
# 4. 서킷 브레이커 패턴
# ──────────────────────────────────────────────

class CircuitBreaker:
    """서킷 브레이커 - 연속 실패 시 차단"""

    def __init__(
        self,
        failure_threshold: int = 5,
        recovery_timeout: float = 60.0,
        half_open_requests: int = 1
    ):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.half_open_requests = half_open_requests

        self.failure_count = 0
        self.last_failure_time = None
        self.state = "closed"  # closed, open, half_open

    async def call(self, func, *args, **kwargs):
        """서킷 브레이커를 통한 함수 호출"""

        # Open 상태: 바로 실패
        if self.state == "open":
            if self._should_attempt_reset():
                self.state = "half_open"
            else:
                raise CircuitBreakerOpenError(
                    f"Circuit breaker is open. Retry after {self._time_until_reset():.1f}s"
                )

        try:
            result = await func(*args, **kwargs)

            # 성공 시 리셋
            self._on_success()
            return result

        except Exception as e:
            self._on_failure()
            raise

    def _on_success(self):
        """성공 시 상태 리셋"""
        self.failure_count = 0
        self.state = "closed"

    def _on_failure(self):
        """실패 시 카운트 증가"""
        self.failure_count += 1
        self.last_failure_time = time.time()

        if self.failure_count >= self.failure_threshold:
            self.state = "open"

    def _should_attempt_reset(self) -> bool:
        """복구 시도 여부"""
        if self.last_failure_time is None:
            return True
        return time.time() - self.last_failure_time >= self.recovery_timeout

    def _time_until_reset(self) -> float:
        """복구까지 남은 시간"""
        if self.last_failure_time is None:
            return 0
        return max(0, self.recovery_timeout - (time.time() - self.last_failure_time))

class CircuitBreakerOpenError(Exception):
    pass

# ──────────────────────────────────────────────
# 5. 모니터링 & 로깅
# ──────────────────────────────────────────────

import structlog
from dataclasses import dataclass, field
from datetime import datetime
from collections import deque

# 구조화된 로거 설정
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ]
)

logger = structlog.get_logger()

@dataclass
class RAGMetrics:
    """RAG 파이프라인 메트릭"""
    request_id: str
    question: str
    start_time: datetime = field(default_factory=datetime.now)

    # 타이밍
    embedding_time: float = 0
    retrieval_time: float = 0
    generation_time: float = 0
    total_time: float = 0

    # 결과
    doc_count: int = 0
    token_count: int = 0
    success: bool = True
    error_type: str = None

    def to_dict(self) -> dict:
        return {
            "request_id": self.request_id,
            "question_preview": self.question[:50],
            "embedding_time_ms": self.embedding_time * 1000,
            "retrieval_time_ms": self.retrieval_time * 1000,
            "generation_time_ms": self.generation_time * 1000,
            "total_time_ms": self.total_time * 1000,
            "doc_count": self.doc_count,
            "token_count": self.token_count,
            "success": self.success,
            "error_type": self.error_type
        }

class MetricsCollector:
    """메트릭 수집기"""

    def __init__(self, window_size: int = 1000):
        self.metrics_buffer = deque(maxlen=window_size)

    def record(self, metrics: RAGMetrics):
        """메트릭 기록"""
        self.metrics_buffer.append(metrics)

        # 구조화된 로그
        logger.info(
            "rag_request_completed",
            **metrics.to_dict()
        )

    def get_stats(self) -> dict:
        """통계 계산"""
        if not self.metrics_buffer:
            return {}

        total = len(self.metrics_buffer)
        success_count = sum(1 for m in self.metrics_buffer if m.success)

        avg_latency = sum(m.total_time for m in self.metrics_buffer) / total
        p95_latency = sorted(m.total_time for m in self.metrics_buffer)[int(total * 0.95)]

        return {
            "total_requests": total,
            "success_rate": success_count / total,
            "avg_latency_ms": avg_latency * 1000,
            "p95_latency_ms": p95_latency * 1000,
            "avg_doc_count": sum(m.doc_count for m in self.metrics_buffer) / total
        }

# ──────────────────────────────────────────────
# 6. 통합: 모니터링 RAG
# ──────────────────────────────────────────────

class MonitoredRAG:
    """모니터링이 통합된 RAG"""

    def __init__(self, vectorstore, llm):
        self.vectorstore = vectorstore
        self.llm = llm
        self.metrics_collector = MetricsCollector()
        self.circuit_breaker = CircuitBreaker()

    async def answer(self, question: str) -> Result[str]:
        import uuid

        metrics = RAGMetrics(
            request_id=str(uuid.uuid4()),
            question=question
        )

        try:
            # 서킷 브레이커 적용
            answer = await self.circuit_breaker.call(
                self._answer_impl,
                question,
                metrics
            )

            metrics.total_time = (datetime.now() - metrics.start_time).total_seconds()
            self.metrics_collector.record(metrics)

            return Result.ok(answer)

        except CircuitBreakerOpenError as e:
            metrics.success = False
            metrics.error_type = "circuit_breaker_open"
            self.metrics_collector.record(metrics)

            return Result.fail(RAGError(
                type=RAGErrorType.UNKNOWN,
                message=str(e),
                recoverable=True,
                retry_after=self.circuit_breaker._time_until_reset()
            ))

        except Exception as e:
            metrics.success = False
            metrics.error_type = str(type(e).__name__)
            self.metrics_collector.record(metrics)
            raise

    @retry_with_exponential_backoff(max_retries=3)
    async def _answer_impl(self, question: str, metrics: RAGMetrics) -> str:
        # 검색
        start = time.time()
        docs = await self.vectorstore.asimilarity_search(question, k=5)
        metrics.retrieval_time = time.time() - start
        metrics.doc_count = len(docs)

        # 생성
        start = time.time()
        context = "\\n".join(d.page_content for d in docs)
        response = await self.llm.ainvoke(f"Context: {context}\\n\\nQ: {question}")
        metrics.generation_time = time.time() - start

        return response.content

# 사용 예시
async def demo():
    rag = MonitoredRAG(vectorstore, llm)

    # 여러 질문 처리
    questions = ["질문1", "질문2", "질문3"]

    for q in questions:
        result = await rag.answer(q)
        if result.success:
            print(f"✅ {result.value[:100]}...")
        else:
            print(f"❌ Error: {result.error.message}")

    # 통계 확인
    stats = rag.metrics_collector.get_stats()
    print(f"\\n📊 성공률: {stats['success_rate']:.1%}")
    print(f"📊 평균 지연: {stats['avg_latency_ms']:.1f}ms")
    print(f"📊 P95 지연: {stats['p95_latency_ms']:.1f}ms")

# ──────────────────────────────────────────────
# 7. JSONL 구조화 로깅 시스템
# ──────────────────────────────────────────────

import json
from datetime import datetime
from pathlib import Path

class RAGLogger:
    """JSONL 포맷으로 RAG 로그 저장"""

    def __init__(self, log_dir: str = "./logs"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.log_file = self.log_dir / f"rag_{datetime.now():%Y%m%d}.jsonl"

    def log(self, query: str, answer: str, sources: list, latency: float, success: bool = True):
        """로그 엔트리 저장"""
        entry = {
            "timestamp": datetime.now().isoformat(),
            "query": query,
            "answer": answer[:500],  # 답변 500자 제한
            "source_count": len(sources),
            "sources": [s[:100] for s in sources[:3]],  # 상위 3개 소스
            "latency_ms": round(latency * 1000, 2),
            "success": success
        }

        with open(self.log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\\n")

    def get_logs(self, limit: int = 100) -> list:
        """최근 로그 조회"""
        logs = []
        if self.log_file.exists():
            with open(self.log_file, "r", encoding="utf-8") as f:
                for line in f:
                    logs.append(json.loads(line))
        return logs[-limit:]

# 사용 예시
logger = RAGLogger()
# RAG 호출 후
# logger.log(query, answer, sources, latency)

# ──────────────────────────────────────────────
# 8. Streamlit 분석 대시보드
# ──────────────────────────────────────────────

# dashboard.py
import streamlit as st
import pandas as pd
import plotly.express as px

def show_analytics():
    """RAG 분석 대시보드"""
    st.title("📊 RAG 분석 대시보드")

    # 로그 데이터 로드
    logger = RAGLogger()
    logs = logger.get_logs(limit=1000)

    if not logs:
        st.warning("아직 로그 데이터가 없습니다.")
        return

    df = pd.DataFrame(logs)
    df['timestamp'] = pd.to_datetime(df['timestamp'])

    # 핵심 지표
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("총 쿼리 수", len(df))
    with col2:
        success_rate = df['success'].mean() * 100
        st.metric("성공률", f"{success_rate:.1f}%")
    with col3:
        avg_latency = df['latency_ms'].mean()
        st.metric("평균 응답시간", f"{avg_latency:.0f}ms")
    with col4:
        p95_latency = df['latency_ms'].quantile(0.95)
        st.metric("P95 응답시간", f"{p95_latency:.0f}ms")

    # 시간별 요청 추이
    st.subheader("📈 시간별 요청 추이")
    hourly = df.set_index('timestamp').resample('H').size()
    fig = px.line(x=hourly.index, y=hourly.values,
                  labels={'x': '시간', 'y': '요청 수'})
    st.plotly_chart(fig, use_container_width=True)

    # 응답시간 분포
    st.subheader("⏱️ 응답시간 분포")
    fig = px.histogram(df, x='latency_ms', nbins=30,
                       labels={'latency_ms': '응답시간 (ms)'})
    st.plotly_chart(fig, use_container_width=True)

    # 최근 쿼리 목록
    st.subheader("📝 최근 쿼리")
    recent = df.tail(10)[['timestamp', 'query', 'latency_ms', 'success']]
    st.dataframe(recent, use_container_width=True)

# ──────────────────────────────────────────────
# 9. Slack 알림 시스템
# ──────────────────────────────────────────────

import requests

def send_slack_alert(webhook_url: str, message: str, level: str = "warning"):
    """Slack으로 알림 전송"""
    emoji = {"info": "ℹ️", "warning": "⚠️", "error": "🚨"}.get(level, "📢")

    payload = {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"{emoji} *RAG 시스템 알림*\\n{message}"
                }
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": f"발생 시간: {datetime.now():%Y-%m-%d %H:%M:%S}"
                    }
                ]
            }
        ]
    }

    try:
        response = requests.post(webhook_url, json=payload, timeout=5)
        response.raise_for_status()
    except Exception as e:
        print(f"Slack 알림 실패: {e}")

# 알림 조건 예시
def check_and_alert(metrics_collector, slack_webhook: str):
    """메트릭 기반 알림 체크"""
    stats = metrics_collector.get_stats()

    # 성공률 90% 미만 시 경고
    if stats.get('success_rate', 1) < 0.9:
        send_slack_alert(
            slack_webhook,
            f"성공률 저하: {stats['success_rate']:.1%}",
            level="warning"
        )

    # P95 응답시간 3초 초과 시 경고
    if stats.get('p95_latency_ms', 0) > 3000:
        send_slack_alert(
            slack_webhook,
            f"응답 지연: P95 = {stats['p95_latency_ms']:.0f}ms",
            level="error"
        )

# ──────────────────────────────────────────────
# 10. 사용자 피드백 수집
# ──────────────────────────────────────────────

# Streamlit UI에서 피드백 수집
def show_feedback_buttons(query: str, answer: str, query_id: str):
    """👍/👎 피드백 버튼 표시"""
    col1, col2, col3 = st.columns([1, 1, 8])

    with col1:
        if st.button("👍", key=f"up_{query_id}"):
            save_feedback(query_id, query, answer, positive=True)
            st.success("감사합니다!")

    with col2:
        if st.button("👎", key=f"down_{query_id}"):
            save_feedback(query_id, query, answer, positive=False)
            st.info("피드백이 기록되었습니다.")

def save_feedback(query_id: str, query: str, answer: str, positive: bool):
    """피드백 저장"""
    feedback_file = Path("./logs/feedback.jsonl")
    feedback_file.parent.mkdir(parents=True, exist_ok=True)

    entry = {
        "timestamp": datetime.now().isoformat(),
        "query_id": query_id,
        "query": query,
        "answer": answer[:500],
        "positive": positive
    }

    with open(feedback_file, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\\n")

# 피드백 분석
def analyze_feedback():
    """부정 피드백 분석"""
    feedback_file = Path("./logs/feedback.jsonl")
    if not feedback_file.exists():
        return []

    negative_feedback = []
    with open(feedback_file, "r", encoding="utf-8") as f:
        for line in f:
            entry = json.loads(line)
            if not entry.get("positive"):
                negative_feedback.append(entry)

    return negative_feedback

# 부정 피드백은 RAG 개선의 핵심 자료!
# - 어떤 질문에서 실패했는지 분석
# - 문서 추가 또는 프롬프트 개선에 활용
\`\`\`
      `,
      keyPoints: [
        'Result 타입으로 성공/실패 명시적 처리',
        '지수 백오프 + 서킷 브레이커로 장애 대응',
        '구조화된 메트릭으로 성능 모니터링',
        '📊 JSONL 로깅으로 쿼리/응답/지연시간 기록',
        '📈 Streamlit 대시보드로 실시간 분석',
        '🔔 Slack 알림으로 이상 징후 즉시 감지',
        '👍👎 사용자 피드백으로 지속적 품질 개선',
      ],
      practiceGoal: '프로덕션 환경에서 안정적으로 동작하는 에러 핸들링과 모니터링을 구현한다',
    }),

    // ========================================
    // Task 5: Streamlit 프로덕션 UI (35분)
    // ========================================
    createCodeTask('w5d5-streamlit-prod', 'Streamlit 프로덕션 UI', 35, {
      introduction: `
## 프로덕션급 Streamlit UI

\`\`\`python
# app.py - 프로덕션급 RAG 웹 애플리케이션

import streamlit as st
import asyncio
from datetime import datetime
from pathlib import Path
import os

# ──────────────────────────────────────────────
# 1. 페이지 설정 & 스타일
# ──────────────────────────────────────────────

st.set_page_config(
    page_title="📚 Enterprise Document Q&A",
    page_icon="📚",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 커스텀 CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2rem;
        font-weight: bold;
        color: #1a1a2e;
        margin-bottom: 1rem;
    }
    .source-card {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 12px;
        margin: 8px 0;
        border-left: 4px solid #4CAF50;
    }
    .confidence-high { color: #4CAF50; font-weight: bold; }
    .confidence-medium { color: #FFC107; font-weight: bold; }
    .confidence-low { color: #F44336; font-weight: bold; }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
        padding: 20px;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# ──────────────────────────────────────────────
# 2. 세션 상태 초기화
# ──────────────────────────────────────────────

def init_session_state():
    defaults = {
        "vectorstore": None,
        "messages": [],
        "processed_docs": [],
        "total_chunks": 0,
        "query_count": 0,
        "avg_latency": 0,
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value

init_session_state()

# ──────────────────────────────────────────────
# 3. 사이드바 - 설정 & 문서 업로드
# ──────────────────────────────────────────────

with st.sidebar:
    st.markdown("## ⚙️ Settings")

    # API Key (환경변수 또는 입력)
    api_key = os.getenv("OPENAI_API_KEY") or st.text_input(
        "OpenAI API Key",
        type="password",
        help="API 키는 저장되지 않습니다"
    )

    if api_key:
        os.environ["OPENAI_API_KEY"] = api_key

    st.divider()

    # RAG 설정
    st.markdown("### 🔧 RAG Configuration")

    chunk_size = st.slider("Chunk Size", 200, 2000, 1000, 100)
    chunk_overlap = st.slider("Chunk Overlap", 0, 500, 200, 50)
    k_results = st.slider("Top-K Results", 1, 10, 5)

    search_type = st.selectbox(
        "Search Type",
        ["similarity", "mmr"],
        help="MMR: 다양성 확보를 위한 검색"
    )

    st.divider()

    # 문서 업로드
    st.markdown("### 📁 Document Upload")

    uploaded_files = st.file_uploader(
        "Upload Documents",
        type=["pdf", "docx", "txt", "md"],
        accept_multiple_files=True,
        help="PDF, Word, TXT, Markdown 지원"
    )

    if uploaded_files and api_key:
        if st.button("🚀 Process Documents", use_container_width=True):
            with st.spinner("Processing documents..."):
                process_documents(uploaded_files, chunk_size, chunk_overlap)

    # 처리된 문서 표시
    if st.session_state.processed_docs:
        st.markdown("### 📚 Loaded Documents")
        for doc in st.session_state.processed_docs:
            st.markdown(f"- {doc['name']} ({doc['chunks']} chunks)")

        st.metric("Total Chunks", st.session_state.total_chunks)

# ──────────────────────────────────────────────
# 4. 문서 처리 함수
# ──────────────────────────────────────────────

def process_documents(files, chunk_size, chunk_overlap):
    from langchain_openai import OpenAIEmbeddings
    from langchain_chroma import Chroma
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain_community.document_loaders import (
        PyPDFLoader, Docx2txtLoader, TextLoader
    )
    import tempfile

    all_docs = []
    processed_info = []

    for file in files:
        # 임시 파일로 저장
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.name).suffix) as tmp:
            tmp.write(file.getvalue())
            tmp_path = tmp.name

        # 파일 형식에 따른 로더 선택
        ext = Path(file.name).suffix.lower()
        if ext == ".pdf":
            loader = PyPDFLoader(tmp_path)
        elif ext == ".docx":
            loader = Docx2txtLoader(tmp_path)
        else:
            loader = TextLoader(tmp_path)

        docs = loader.load()

        # 청킹
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
        chunks = splitter.split_documents(docs)

        all_docs.extend(chunks)
        processed_info.append({
            "name": file.name,
            "chunks": len(chunks)
        })

        os.unlink(tmp_path)

    # 벡터 저장소 생성
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    st.session_state.vectorstore = Chroma.from_documents(
        documents=all_docs,
        embedding=embeddings
    )

    st.session_state.processed_docs = processed_info
    st.session_state.total_chunks = len(all_docs)

    st.success(f"✅ Processed {len(files)} files, {len(all_docs)} chunks")

# ──────────────────────────────────────────────
# 5. 메인 영역 - 채팅 인터페이스
# ──────────────────────────────────────────────

st.markdown('<p class="main-header">📚 Enterprise Document Q&A</p>', unsafe_allow_html=True)

# 메트릭 표시
if st.session_state.vectorstore:
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("📄 Documents", len(st.session_state.processed_docs))
    with col2:
        st.metric("📦 Chunks", st.session_state.total_chunks)
    with col3:
        st.metric("❓ Queries", st.session_state.query_count)
    with col4:
        st.metric("⚡ Avg Latency", f"{st.session_state.avg_latency:.2f}s")

st.divider()

# 대화 히스토리 표시
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

        # 소스 표시 (assistant 메시지)
        if msg["role"] == "assistant" and "sources" in msg:
            with st.expander("📚 View Sources"):
                for src in msg["sources"]:
                    st.markdown(f"""
                    <div class="source-card">
                        <strong>{src['source']}</strong><br>
                        Page {src.get('page', 'N/A')} |
                        Chunk {src.get('chunk_index', 0)}
                    </div>
                    """, unsafe_allow_html=True)

        # 신뢰도 표시
        if msg["role"] == "assistant" and "confidence" in msg:
            conf = msg["confidence"]
            conf_class = "high" if conf > 0.8 else "medium" if conf > 0.5 else "low"
            st.markdown(f"""
                <span class="confidence-{conf_class}">
                    Confidence: {conf:.0%}
                </span>
            """, unsafe_allow_html=True)

# ──────────────────────────────────────────────
# 6. 사용자 입력 처리
# ──────────────────────────────────────────────

if st.session_state.vectorstore:
    if question := st.chat_input("Ask a question about your documents..."):
        # 사용자 메시지 추가
        st.session_state.messages.append({"role": "user", "content": question})

        with st.chat_message("user"):
            st.markdown(question)

        # RAG 실행
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                start_time = datetime.now()
                answer, sources, confidence = run_rag(question, k_results, search_type)
                latency = (datetime.now() - start_time).total_seconds()

                # 스트리밍 효과
                placeholder = st.empty()
                full_response = ""
                for char in answer:
                    full_response += char
                    placeholder.markdown(full_response + "▌")
                    import time
                    time.sleep(0.01)
                placeholder.markdown(full_response)

                # 소스 표시
                with st.expander("📚 View Sources"):
                    for src in sources:
                        st.markdown(f"- **{src['source']}**, Page {src.get('page', 'N/A')}")

                # 신뢰도
                conf_class = "high" if confidence > 0.8 else "medium" if confidence > 0.5 else "low"
                st.markdown(f"<span class='confidence-{conf_class}'>Confidence: {confidence:.0%}</span>",
                           unsafe_allow_html=True)

        # 메시지 저장
        st.session_state.messages.append({
            "role": "assistant",
            "content": answer,
            "sources": sources,
            "confidence": confidence
        })

        # 메트릭 업데이트
        st.session_state.query_count += 1
        n = st.session_state.query_count
        st.session_state.avg_latency = (
            (st.session_state.avg_latency * (n - 1) + latency) / n
        )

else:
    st.info("👈 Upload documents in the sidebar to get started!")

# ──────────────────────────────────────────────
# 7. RAG 실행 함수
# ──────────────────────────────────────────────

def run_rag(question: str, k: int, search_type: str):
    from langchain_openai import ChatOpenAI
    from langchain.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser
    from langchain_core.runnables import RunnablePassthrough

    # 검색
    retriever = st.session_state.vectorstore.as_retriever(
        search_type=search_type,
        search_kwargs={"k": k}
    )

    docs = retriever.invoke(question)

    # 소스 정보 추출
    sources = [
        {
            "source": doc.metadata.get("source", "Unknown"),
            "page": doc.metadata.get("page"),
            "chunk_index": doc.metadata.get("chunk_index", 0)
        }
        for doc in docs
    ]

    # 컨텍스트 구성
    context = "\\n\\n---\\n\\n".join(
        f"[Source: {doc.metadata.get('source', 'Unknown')}]\\n{doc.page_content}"
        for doc in docs
    )

    # 프롬프트
    prompt = ChatPromptTemplate.from_template("""
You are an expert assistant answering questions based on provided documents.

Instructions:
1. Answer based ONLY on the context provided
2. If unsure, say "I couldn't find this information in the documents"
3. Be concise and accurate
4. Use Korean for the response

Context:
{context}

Question: {question}

Answer:""")

    # 체인
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    chain = prompt | llm | StrOutputParser()

    answer = chain.invoke({"context": context, "question": question})

    # 신뢰도 계산 (단순화)
    confidence = min(len(docs) / k, 1.0) * 0.8 + 0.2

    return answer, sources, confidence

# ──────────────────────────────────────────────
# 8. 푸터
# ──────────────────────────────────────────────

st.divider()
st.markdown("""
<div style='text-align: center; color: #666; font-size: 0.8rem;'>
    Built with LangChain + Streamlit |
    <a href='https://github.com/your-repo'>GitHub</a>
</div>
""", unsafe_allow_html=True)
\`\`\`

## 실행 방법

\`\`\`bash
# 설치
pip install streamlit langchain langchain-openai langchain-chroma chromadb pypdf python-docx

# 실행
streamlit run app.py

# 환경변수로 API 키 설정 (선택)
OPENAI_API_KEY=sk-... streamlit run app.py
\`\`\`
      `,
      keyPoints: [
        '커스텀 CSS로 전문적인 UI',
        '실시간 메트릭 대시보드',
        '스트리밍 효과와 신뢰도 표시',
      ],
      practiceGoal: '프로덕션급 RAG 웹 애플리케이션을 Streamlit으로 구현한다',
    }),

    // ========================================
    // Task 6: 종합 퀴즈 (20분)
    // ========================================
    createQuizTask('w5d5-quiz', 'Day 5 종합 퀴즈', 20, {
      introduction: `
## Day 5 핵심 개념 점검

프로덕션 RAG 시스템 구축에 필요한 핵심 개념을 확인합니다.
      `,
      questions: [
        {
          id: 'w5d5-q1',
          question: '프로덕션 RAG의 5가지 설계 원칙 중 "연속 실패 시 일정 시간 동안 요청을 차단하여 시스템을 보호하는 패턴"은?',
          options: [
            'Retry with Backoff',
            'Circuit Breaker',
            'Rate Limiter',
            'Load Balancer'
          ],
          correctAnswer: 1,
          explanation: 'Circuit Breaker는 연속 실패 시 일정 시간 동안 요청을 차단(Open)하고, 복구 시간 후 Half-Open 상태에서 테스트 요청을 보내 시스템을 보호합니다.',
        },
        {
          id: 'w5d5-q2',
          question: '다음 중 프로덕션 RAG에서 비용을 최적화하는 방법으로 적절하지 않은 것은?',
          options: [
            '쿼리 복잡도에 따른 모델 티어링 (simple: mini, complex: GPT-4)',
            '임베딩 결과 캐싱',
            '모든 쿼리에 GPT-4o 사용하여 품질 극대화',
            '적절한 청크 크기로 토큰 절약'
          ],
          correctAnswer: 2,
          explanation: '모든 쿼리에 최고급 모델을 사용하면 비용이 급증합니다. 쿼리 복잡도에 따라 적절한 모델을 선택하는 티어링이 비용 효율적입니다.',
        },
        {
          id: 'w5d5-q3',
          question: 'RAG 시스템에서 프롬프트 인젝션 공격을 방지하는 방법은?',
          options: [
            '더 큰 LLM 모델 사용',
            '입력 검증 및 위험 패턴 필터링',
            '청크 크기 줄이기',
            '검색 결과 수 늘리기'
          ],
          correctAnswer: 1,
          explanation: '프롬프트 인젝션은 "ignore previous instructions" 같은 악의적 패턴을 탐지하여 필터링하거나, 입력 길이 제한, 특수 문자 이스케이프 등으로 방지합니다.',
        },
        {
          id: 'w5d5-q4',
          question: 'Streamlit에서 RAG 응답의 스트리밍 효과를 구현할 때 사용하는 방법은?',
          options: [
            'st.cache_data 데코레이터',
            'st.empty()와 placeholder.markdown() 조합',
            'st.session_state 직접 수정',
            'st.rerun() 반복 호출'
          ],
          correctAnswer: 1,
          explanation: 'st.empty()로 플레이스홀더를 생성하고, 응답의 각 문자/청크를 placeholder.markdown()으로 업데이트하면 타이핑 효과를 구현할 수 있습니다.',
        },
        {
          id: 'w5d5-q5',
          question: '멀티 포맷 문서 처리에서 스캔된 PDF(이미지 PDF)의 텍스트를 추출하는 기술은?',
          options: [
            'Text Splitter',
            'OCR (Optical Character Recognition)',
            'Embedding',
            'Re-ranking'
          ],
          correctAnswer: 1,
          explanation: 'OCR은 이미지에서 텍스트를 인식하는 기술로, 스캔된 PDF나 사진 속 텍스트를 추출할 때 사용합니다. Pytesseract, EasyOCR 등을 활용합니다.',
        },
      ],
      keyPoints: [
        'Circuit Breaker = 연속 실패 시 차단',
        '쿼리 복잡도별 모델 티어링으로 비용 최적화',
        '입력 검증으로 프롬프트 인젝션 방지',
        'st.empty() + placeholder로 스트리밍 효과',
        'OCR로 스캔 PDF 텍스트 추출',
      ],
      practiceGoal: '프로덕션 RAG 시스템의 핵심 개념을 확인한다',
    }),
  ],

  // ========================================
  // Challenge: 엔터프라이즈 RAG 시스템 구축 (70분)
  // ========================================
  challenge: createChallengeTask('w5d5-challenge', 'Challenge: 엔터프라이즈 RAG 시스템 구축', 70, {
    introduction: `
## 🏆 Week 5 최종 프로젝트

Week 5에서 학습한 모든 내용을 종합하여 **실제 서비스 수준의 RAG 시스템**을 구축합니다.

## 📋 시나리오

> **상황**: 당신은 스타트업의 AI 엔지니어입니다.
> 회사 내부 문서(기술 문서, 정책, 가이드라인)를 기반으로
> 직원들이 질문할 수 있는 "사내 AI 어시스턴트"를 구축해야 합니다.

## ✅ 필수 요구사항 (MVP)

### 1. 멀티 포맷 문서 지원
- [ ] PDF, Word, Markdown 파일 처리
- [ ] 여러 파일 동시 업로드
- [ ] 처리 진행률 표시

### 2. 고급 검색
- [ ] 하이브리드 검색 (Vector + BM25) 또는 MMR
- [ ] 검색 결과 수 조절 가능

### 3. 대화형 RAG
- [ ] 대화 히스토리 유지
- [ ] 출처와 신뢰도 표시

### 4. 프로덕션 품질
- [ ] 에러 핸들링 (API 실패, 빈 결과 등)
- [ ] 로딩 상태 표시
- [ ] 기본적인 입력 검증

### 5. UI/UX
- [ ] 깔끔한 Streamlit 인터페이스
- [ ] 모바일 반응형 (기본 Streamlit)

## 🌟 보너스 요구사항 (선택)

### 레벨 1: 향상된 기능
- [ ] 스트리밍 응답 (타이핑 효과)
- [ ] 후속 질문 제안
- [ ] 대화 내역 내보내기 (TXT/JSON)

### 레벨 2: 고급 기능
- [ ] Re-ranking 적용
- [ ] 쿼리 분석 및 의도 표시
- [ ] 메트릭 대시보드 (쿼리 수, 평균 지연 등)

### 레벨 3: 엔터프라이즈 기능
- [ ] 멀티 LLM 폴백 (OpenAI → Anthropic)
- [ ] 서킷 브레이커 패턴
- [ ] 사용자 피드백 수집 (👍/👎)

## 📊 평가 기준

| 항목 | 배점 | 기준 |
|------|------|------|
| 필수 기능 완성도 | 50% | 5개 필수 요구사항 구현 |
| 코드 품질 | 20% | 타입 힌트, 에러 핸들링, 모듈화 |
| UI/UX | 15% | 사용성, 디자인 |
| 보너스 기능 | 15% | 레벨별 추가 점수 |

## 📁 제출물

1. **GitHub 저장소**
   - 전체 소스 코드
   - README.md (설치 방법, 스크린샷)
   - requirements.txt

2. **데모 영상** (선택)
   - 30초-2분 사용 시연

3. **배포 URL** (선택)
   - Streamlit Cloud 또는 기타 플랫폼

## 💡 힌트

아래 의사 코드를 참고하여 구현하세요.
    `,
    hints: [
`# ============================================
# 엔터프라이즈 RAG 시스템 Pseudocode
# ============================================
#
# 이 Pseudocode는 Week 5 전체 내용을 종합합니다:
# - Day 1: RAG 아키텍처
# - Day 2: 임베딩 & 벡터DB
# - Day 3: 청킹 & 검색 최적화
# - Day 4: LangChain RAG
# - Day 5: 프로덕션 패턴

# ─────────────────────────────────────────────
# Part 1: 프로젝트 구조
# ─────────────────────────────────────────────
#
# enterprise-rag/
# ├── app.py                    # Streamlit 메인
# ├── requirements.txt          # 의존성
# ├── README.md                 # 문서
# │
# ├── core/
# │   ├── __init__.py
# │   ├── document_processor.py # 멀티포맷 문서 처리
# │   ├── chunker.py            # 스마트 청킹
# │   ├── retriever.py          # 하이브리드 검색
# │   └── rag_chain.py          # RAG 체인
# │
# ├── utils/
# │   ├── __init__.py
# │   ├── error_handler.py      # 에러 핸들링
# │   ├── metrics.py            # 메트릭 수집
# │   └── validators.py         # 입력 검증
# │
# └── config/
#     └── settings.py           # 설정 관리

# ─────────────────────────────────────────────
# Part 2: 문서 처리 (core/document_processor.py)
# ─────────────────────────────────────────────

IMPORT PyPDFLoader, Docx2txtLoader
IMPORT tempfile, pathlib

CLASS DocumentProcessor:

    FUNCTION process_file(self, file) -> list[Document]:
        # 1. 임시 파일 저장
        WITH tempfile.NamedTemporaryFile(suffix=file.suffix) AS tmp:
            tmp.write(file.read())
            tmp_path = tmp.name

        # 2. 파일 형식별 로더 선택
        ext = pathlib.Path(file.name).suffix.lower()

        IF ext == ".pdf":
            loader = PyPDFLoader(tmp_path)
        ELIF ext == ".docx":
            loader = Docx2txtLoader(tmp_path)
        ELIF ext IN [".md", ".txt"]:
            loader = TextLoader(tmp_path)
        ELSE:
            RAISE ValueError(f"Unsupported format: {ext}")

        # 3. 문서 로드
        docs = loader.load()

        # 4. 메타데이터 추가
        FOR doc IN docs:
            doc.metadata["source_file"] = file.name
            doc.metadata["processed_at"] = datetime.now().isoformat()

        RETURN docs

    FUNCTION process_multiple(self, files, progress_callback) -> list[Document]:
        all_docs = []

        FOR i, file IN enumerate(files):
            docs = self.process_file(file)
            all_docs.extend(docs)

            # 진행률 콜백
            IF progress_callback:
                progress_callback((i + 1) / len(files))

        RETURN all_docs

# ─────────────────────────────────────────────
# Part 3: 스마트 청킹 (core/chunker.py)
# ─────────────────────────────────────────────

IMPORT RecursiveCharacterTextSplitter
IMPORT MarkdownHeaderTextSplitter

CLASS SmartChunker:

    FUNCTION __init__(self, chunk_size=1000, overlap=200):
        self.chunk_size = chunk_size
        self.overlap = overlap

    FUNCTION chunk(self, docs: list[Document]) -> list[Document]:
        all_chunks = []

        FOR doc IN docs:
            # 파일 형식에 따른 청킹 전략
            IF doc.metadata.get("source_file", "").endswith(".md"):
                chunks = self._chunk_markdown(doc)
            ELSE:
                chunks = self._chunk_default(doc)

            all_chunks.extend(chunks)

        RETURN all_chunks

    FUNCTION _chunk_default(self, doc) -> list[Document]:
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.overlap,
            separators=["\\n\\n", "\\n", ". ", " ", ""]
        )
        RETURN splitter.split_documents([doc])

    FUNCTION _chunk_markdown(self, doc) -> list[Document]:
        # 헤더 기반 분할
        headers_to_split = [("#", "h1"), ("##", "h2"), ("###", "h3")]
        md_splitter = MarkdownHeaderTextSplitter(headers_to_split)

        splits = md_splitter.split_text(doc.page_content)

        # Document 객체로 변환
        RETURN [
            Document(
                page_content=split.page_content,
                metadata={**doc.metadata, **split.metadata}
            )
            FOR split IN splits
        ]

# ─────────────────────────────────────────────
# Part 4: 하이브리드 검색 (core/retriever.py)
# ─────────────────────────────────────────────

FROM langchain.retrievers IMPORT EnsembleRetriever
FROM langchain_community.retrievers IMPORT BM25Retriever

CLASS HybridRetriever:

    FUNCTION __init__(self, vectorstore, k=5, use_mmr=False):
        self.vectorstore = vectorstore
        self.k = k
        self.use_mmr = use_mmr

    FUNCTION get_retriever(self, docs=None):
        # 벡터 검색기
        IF self.use_mmr:
            vector_retriever = self.vectorstore.as_retriever(
                search_type="mmr",
                search_kwargs={"k": self.k, "fetch_k": self.k * 4, "lambda_mult": 0.7}
            )
        ELSE:
            vector_retriever = self.vectorstore.as_retriever(
                search_kwargs={"k": self.k}
            )

        # BM25 검색기 (하이브리드용)
        IF docs:
            bm25_retriever = BM25Retriever.from_documents(docs)
            bm25_retriever.k = self.k

            # 앙상블
            ensemble = EnsembleRetriever(
                retrievers=[bm25_retriever, vector_retriever],
                weights=[0.4, 0.6]
            )
            RETURN ensemble

        RETURN vector_retriever

    FUNCTION retrieve(self, query: str, retriever) -> list[Document]:
        docs = retriever.invoke(query)

        # 중복 제거
        seen = set()
        unique_docs = []
        FOR doc IN docs:
            content_hash = hash(doc.page_content[:100])
            IF content_hash NOT IN seen:
                seen.add(content_hash)
                unique_docs.append(doc)

        RETURN unique_docs[:self.k]

# ─────────────────────────────────────────────
# Part 5: RAG 체인 (core/rag_chain.py)
# ─────────────────────────────────────────────

FROM langchain_openai IMPORT ChatOpenAI
FROM langchain.prompts IMPORT ChatPromptTemplate, MessagesPlaceholder
FROM langchain_core.runnables IMPORT RunnablePassthrough

CLASS RAGChain:

    FUNCTION __init__(self, model="gpt-4o-mini", temperature=0):
        self.llm = ChatOpenAI(model=model, temperature=temperature)

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """당신은 사내 문서 기반 AI 어시스턴트입니다.

규칙:
1. 제공된 컨텍스트만 사용하여 답변하세요
2. 정보를 찾을 수 없으면 정직하게 말하세요
3. 출처를 [Source: 파일명] 형식으로 인용하세요
4. 간결하고 정확하게 답변하세요"""),

            MessagesPlaceholder("chat_history"),

            ("human", """컨텍스트:
{context}

질문: {question}"""),
        ])

    FUNCTION build_chain(self, retriever):

        FUNCTION format_docs(docs):
            formatted = []
            FOR i, doc IN enumerate(docs):
                source = doc.metadata.get("source_file", "Unknown")
                formatted.append(f"[Document {i+1}] [Source: {source}]\\n{doc.page_content}")
            RETURN "\\n\\n---\\n\\n".join(formatted)

        chain = (
            {
                "context": retriever | format_docs,
                "question": RunnablePassthrough(),
                "chat_history": lambda x: x.get("chat_history", [])
            }
            | self.prompt
            | self.llm
        )

        RETURN chain

    FUNCTION invoke(self, question: str, retriever, chat_history=None) -> dict:
        chain = self.build_chain(retriever)

        # 검색 결과 가져오기
        docs = retriever.invoke(question)

        # 응답 생성
        response = chain.invoke({
            "question": question,
            "chat_history": chat_history or []
        })

        RETURN {
            "answer": response.content,
            "sources": [
                {"source": doc.metadata.get("source_file", "Unknown"),
                 "page": doc.metadata.get("page", "N/A")}
                FOR doc IN docs
            ],
            "confidence": self._calculate_confidence(docs)
        }

    FUNCTION _calculate_confidence(self, docs) -> float:
        IF NOT docs:
            RETURN 0.1
        # 검색된 문서 수 기반 (최대 5개 기준)
        RETURN min(len(docs) / 5, 1.0) * 0.8 + 0.2

# ─────────────────────────────────────────────
# Part 6: 에러 핸들링 (utils/error_handler.py)
# ─────────────────────────────────────────────

FROM functools IMPORT wraps
IMPORT asyncio

CLASS ErrorHandler:

    @staticmethod
    FUNCTION safe_execute(func):
        """에러를 안전하게 처리하는 데코레이터"""
        @wraps(func)
        FUNCTION wrapper(*args, **kwargs):
            TRY:
                RETURN {"success": True, "result": func(*args, **kwargs)}
            EXCEPT RateLimitError AS e:
                RETURN {"success": False, "error": "API 요청 한도 초과. 잠시 후 다시 시도해주세요.", "retry_after": 60}
            EXCEPT TimeoutError AS e:
                RETURN {"success": False, "error": "요청 시간 초과. 질문을 짧게 다시 시도해주세요."}
            EXCEPT Exception AS e:
                RETURN {"success": False, "error": f"오류가 발생했습니다: {str(e)}"}
        RETURN wrapper

    @staticmethod
    FUNCTION retry_with_backoff(max_retries=3, base_delay=1.0):
        """지수 백오프 재시도 데코레이터"""
        FUNCTION decorator(func):
            @wraps(func)
            FUNCTION wrapper(*args, **kwargs):
                delay = base_delay
                FOR attempt IN range(max_retries + 1):
                    TRY:
                        RETURN func(*args, **kwargs)
                    EXCEPT Exception AS e:
                        IF attempt == max_retries:
                            RAISE
                        time.sleep(delay)
                        delay *= 2
            RETURN wrapper
        RETURN decorator

# ─────────────────────────────────────────────
# Part 7: 입력 검증 (utils/validators.py)
# ─────────────────────────────────────────────

IMPORT re

CLASS InputValidator:

    # 위험 패턴 (프롬프트 인젝션 방지)
    DANGEROUS_PATTERNS = [
        r"ignore previous",
        r"forget your",
        r"you are now",
        r"\\[system\\]",
        r"<\\|",
    ]

    @classmethod
    FUNCTION validate_question(cls, question: str) -> tuple[bool, str]:
        # 1. 빈 입력
        IF NOT question OR NOT question.strip():
            RETURN False, "질문을 입력해주세요."

        # 2. 길이 제한
        IF len(question) > 2000:
            RETURN False, "질문은 2000자 이하로 입력해주세요."

        # 3. 위험 패턴 검사
        FOR pattern IN cls.DANGEROUS_PATTERNS:
            IF re.search(pattern, question.lower()):
                RETURN False, "허용되지 않는 입력입니다."

        RETURN True, question.strip()

    @classmethod
    FUNCTION validate_file(cls, file) -> tuple[bool, str]:
        # 1. 파일 크기 (10MB 제한)
        IF file.size > 10 * 1024 * 1024:
            RETURN False, f"{file.name}: 파일 크기가 10MB를 초과합니다."

        # 2. 확장자 확인
        ext = Path(file.name).suffix.lower()
        IF ext NOT IN [".pdf", ".docx", ".doc", ".txt", ".md"]:
            RETURN False, f"{file.name}: 지원하지 않는 형식입니다."

        RETURN True, ""

# ─────────────────────────────────────────────
# Part 8: 메트릭 수집 (utils/metrics.py)
# ─────────────────────────────────────────────

FROM dataclasses IMPORT dataclass, field
FROM collections IMPORT deque
FROM datetime IMPORT datetime

@dataclass
CLASS QueryMetrics:
    question: str
    latency: float
    doc_count: int
    success: bool
    timestamp: datetime = field(default_factory=datetime.now)

CLASS MetricsCollector:

    FUNCTION __init__(self, max_size=100):
        self.metrics = deque(maxlen=max_size)

    FUNCTION record(self, metrics: QueryMetrics):
        self.metrics.append(metrics)

    FUNCTION get_summary(self) -> dict:
        IF NOT self.metrics:
            RETURN {"queries": 0, "avg_latency": 0, "success_rate": 0}

        total = len(self.metrics)
        successes = sum(1 FOR m IN self.metrics IF m.success)
        avg_latency = sum(m.latency FOR m IN self.metrics) / total

        RETURN {
            "queries": total,
            "avg_latency": round(avg_latency, 2),
            "success_rate": round(successes / total * 100, 1)
        }

# ─────────────────────────────────────────────
# Part 9: Streamlit 앱 (app.py)
# ─────────────────────────────────────────────

IMPORT streamlit AS st
FROM core.document_processor IMPORT DocumentProcessor
FROM core.chunker IMPORT SmartChunker
FROM core.retriever IMPORT HybridRetriever
FROM core.rag_chain IMPORT RAGChain
FROM utils.error_handler IMPORT ErrorHandler
FROM utils.validators IMPORT InputValidator
FROM utils.metrics IMPORT MetricsCollector, QueryMetrics

# ─── 페이지 설정 ───
st.set_page_config(
    page_title="📚 Enterprise RAG",
    layout="wide"
)

# ─── 세션 상태 초기화 ───
IF "vectorstore" NOT IN st.session_state:
    st.session_state.vectorstore = None
    st.session_state.chunks = []
    st.session_state.messages = []
    st.session_state.metrics = MetricsCollector()

# ─── 사이드바 ───
WITH st.sidebar:
    st.header("⚙️ Settings")

    # API Key
    api_key = st.text_input("OpenAI API Key", type="password")
    IF api_key:
        os.environ["OPENAI_API_KEY"] = api_key

    # RAG 설정
    chunk_size = st.slider("Chunk Size", 500, 2000, 1000)
    k_results = st.slider("Top-K", 3, 10, 5)
    use_mmr = st.checkbox("Use MMR", value=True)

    st.divider()

    # 파일 업로드
    files = st.file_uploader(
        "Upload Documents",
        type=["pdf", "docx", "txt", "md"],
        accept_multiple_files=True
    )

    IF files AND api_key:
        IF st.button("🚀 Process"):
            # 파일 검증
            FOR file IN files:
                valid, error = InputValidator.validate_file(file)
                IF NOT valid:
                    st.error(error)
                    CONTINUE

            # 처리
            progress = st.progress(0)
            processor = DocumentProcessor()
            chunker = SmartChunker(chunk_size=chunk_size)

            docs = processor.process_multiple(files, lambda p: progress.progress(p))
            chunks = chunker.chunk(docs)

            # 벡터 저장소
            embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
            st.session_state.vectorstore = Chroma.from_documents(chunks, embeddings)
            st.session_state.chunks = chunks

            st.success(f"✅ {len(files)} files, {len(chunks)} chunks")

    # 메트릭
    IF st.session_state.metrics.metrics:
        st.divider()
        st.header("📊 Metrics")
        summary = st.session_state.metrics.get_summary()
        st.metric("Queries", summary["queries"])
        st.metric("Avg Latency", f"{summary['avg_latency']}s")
        st.metric("Success Rate", f"{summary['success_rate']}%")

# ─── 메인 영역 ───
st.title("📚 Enterprise RAG")

# 대화 히스토리
FOR msg IN st.session_state.messages:
    WITH st.chat_message(msg["role"]):
        st.write(msg["content"])
        IF msg.get("sources"):
            WITH st.expander("📚 Sources"):
                FOR src IN msg["sources"]:
                    st.write(f"- {src['source']}")

# 사용자 입력
IF st.session_state.vectorstore:
    IF question := st.chat_input("질문을 입력하세요..."):
        # 입력 검증
        valid, validated = InputValidator.validate_question(question)
        IF NOT valid:
            st.error(validated)
        ELSE:
            # 사용자 메시지
            st.session_state.messages.append({"role": "user", "content": validated})
            WITH st.chat_message("user"):
                st.write(validated)

            # RAG 실행
            WITH st.chat_message("assistant"):
                WITH st.spinner("Thinking..."):
                    start = datetime.now()

                    TRY:
                        retriever = HybridRetriever(
                            st.session_state.vectorstore,
                            k=k_results,
                            use_mmr=use_mmr
                        ).get_retriever(st.session_state.chunks)

                        rag = RAGChain()
                        result = rag.invoke(
                            validated,
                            retriever,
                            st.session_state.messages[-10:]  # 최근 10개 대화
                        )

                        latency = (datetime.now() - start).total_seconds()

                        # 응답 표시
                        st.write(result["answer"])

                        WITH st.expander("📚 Sources"):
                            FOR src IN result["sources"]:
                                st.write(f"- {src['source']}, Page {src['page']}")

                        st.caption(f"Confidence: {result['confidence']:.0%} | Latency: {latency:.2f}s")

                        # 메시지 저장
                        st.session_state.messages.append({
                            "role": "assistant",
                            "content": result["answer"],
                            "sources": result["sources"]
                        })

                        # 메트릭 기록
                        st.session_state.metrics.record(QueryMetrics(
                            question=validated,
                            latency=latency,
                            doc_count=len(result["sources"]),
                            success=True
                        ))

                    EXCEPT Exception AS e:
                        st.error(f"오류: {str(e)}")
                        st.session_state.metrics.record(QueryMetrics(
                            question=validated,
                            latency=0,
                            doc_count=0,
                            success=False
                        ))

ELSE:
    st.info("👈 왼쪽 사이드바에서 문서를 업로드하세요!")

# ─── 푸터 ───
st.divider()
st.caption("Built with LangChain + Streamlit | Week 5 Final Project")

# ─────────────────────────────────────────────
# requirements.txt
# ─────────────────────────────────────────────
#
# streamlit>=1.28.0
# langchain>=0.1.0
# langchain-openai>=0.0.5
# langchain-chroma>=0.1.0
# chromadb>=0.4.0
# pypdf>=3.17.0
# python-docx>=1.0.0
# rank-bm25>=0.2.2
# python-dotenv>=1.0.0

# ─────────────────────────────────────────────
# 실행
# ─────────────────────────────────────────────
#
# 1. 설치
#    pip install -r requirements.txt
#
# 2. 실행
#    streamlit run app.py
#
# 3. 접속
#    http://localhost:8501`
    ],
    keyPoints: [
      'Week 5 전체 내용 종합: RAG 아키텍처 → 임베딩 → 청킹 → 검색 → 프로덕션',
      '멀티포맷, 하이브리드 검색, 대화형 RAG, 에러 핸들링',
      '실제 서비스 수준의 코드 품질',
    ],
    practiceGoal: 'Week 5에서 배운 모든 내용을 종합하여 프로덕션 수준의 RAG 시스템을 완성한다',
  }),
}
