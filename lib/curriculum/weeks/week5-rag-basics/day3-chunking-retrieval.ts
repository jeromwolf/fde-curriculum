// Day 3: 청킹 전략 & 검색 최적화 - 완전 리뉴얼 버전

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day3ChunkingRetrieval: Day = {
  slug: 'chunking-retrieval',
  title: '청킹 전략 & 검색 최적화',
  totalDuration: 300, // 5시간
  tasks: [
    // ========================================
    // Task 1: 청킹의 과학 - 이론과 원리 (40분)
    // ========================================
    createVideoTask('w5d3-chunking-science', '청킹의 과학 - 이론과 원리', 40, {
      introduction: `
## 학습 목표
- 청킹이 RAG 성능에 미치는 영향을 이해한다
- "Lost in the Middle" 현상과 해결책을 학습한다
- 최적의 청크 크기를 결정하는 과학적 근거를 이해한다

---

## 청킹이 RAG 성능을 결정한다

### RAG 파이프라인에서 청킹의 위치

\`\`\`
문서 수집 → [청킹] → 임베딩 → 저장 → 검색 → 생성

청킹이 잘못되면:
- 임베딩 품질 저하 (쓰레기 넣으면 쓰레기 나온다)
- 검색 정확도 저하
- 생성 품질 저하 → 환각 증가
\`\`\`

### 청킹이 중요한 이유

**1. 임베딩 품질 결정**

\`\`\`
청크가 너무 작으면:
  "RAG는 검색 증강" → 의미 불완전
  임베딩이 전체 문맥을 표현 못함

청크가 너무 크면:
  "RAG는... (1000자)... 그래서 벡터 DB..." → 너무 많은 주제
  임베딩이 희석됨 (어떤 주제도 잘 표현 못함)
\`\`\`

**2. 검색 정밀도 결정**

\`\`\`
적절한 청크:
  쿼리: "RAG의 검색 단계"
  매칭: [RAG 검색 단계 설명 청크] ← 정확히 원하는 내용

부적절한 청크:
  쿼리: "RAG의 검색 단계"
  매칭: [RAG 전체 설명... 검색... 생성... 평가...] ← 불필요한 내용 포함
\`\`\`

**3. 컨텍스트 효율성 결정**

\`\`\`
LLM 컨텍스트 창: 128K 토큰 (GPT-4o 기준)

청크 500자 × 5개 = 2,500자 → 효율적
청크 2000자 × 5개 = 10,000자 → 비효율적 (비용 4배, 노이즈 증가)
\`\`\`

---

## "Lost in the Middle" 현상

### 2023년 스탠포드 연구 발견

\`\`\`
논문: "Lost in the Middle: How Language Models Use Long Contexts"

실험: 정답이 컨텍스트의 다른 위치에 있을 때 성능 측정

결과:
┌────────────────────────────────────────────────┐
│ 정확도                                         │
│ 100% ┤ ●                               ●      │
│  80% ┤   ●                           ●        │
│  60% ┤     ●     ●     ●     ●     ●          │
│  40% ┤       ●●●●●●●●●●●●●●●●●                │
│  20% ┤                                        │
│   0% └────────────────────────────────────────│
│       처음      ← 중간 →      끝              │
│                 위치                          │
└────────────────────────────────────────────────┘

정답이 처음이나 끝에 있으면 잘 찾지만,
중간에 있으면 "잃어버린다" (Lost in the Middle)
\`\`\`

### RAG에서의 시사점

\`\`\`
문제:
- 관련 청크 5개를 검색해서 LLM에 전달
- 가장 중요한 청크가 중간에 위치하면 무시될 수 있음

해결책:
1. 검색 결과를 관련성 역순으로 정렬 (중요한 것을 처음과 끝에)
2. 적은 수의 고품질 청크 사용 (5개 이하)
3. 청크 크기 최적화 (불필요한 내용 제거)
\`\`\`

---

## 최적의 청크 크기: 과학적 접근

### 청크 크기 연구 결과

\`\`\`
Pinecone Research (2023):

테스트: 다양한 청크 크기로 RAG 성능 측정
데이터셋: SQuAD, Natural Questions

결과:
- 512 토큰: 가장 좋은 검색 정확도
- 256 토큰: 검색은 좋지만 컨텍스트 부족
- 1024 토큰: 컨텍스트 풍부하지만 검색 정확도 저하
\`\`\`

### 문서 유형별 최적 청크 크기

\`\`\`python
# 청크 크기 가이드라인 (토큰 기준)
CHUNK_SIZE_GUIDE = {
    # 구조화된 문서
    "technical_docs": {
        "chunk_size": 512,      # ~2000자 (한국어)
        "chunk_overlap": 50,    # 10%
        "reason": "개념 단위 보존, 검색 정확도 최적"
    },

    # 대화형 콘텐츠
    "chat_logs": {
        "chunk_size": 256,      # ~1000자
        "chunk_overlap": 25,
        "reason": "짧은 발화 단위, 문맥 연결"
    },

    # 법률/계약 문서
    "legal_docs": {
        "chunk_size": 1024,     # ~4000자
        "chunk_overlap": 100,
        "reason": "조항 단위 보존, 맥락 유지"
    },

    # 코드
    "source_code": {
        "chunk_size": "function",  # 함수 단위
        "chunk_overlap": 0,
        "reason": "논리적 단위 보존"
    },

    # Q&A
    "faq": {
        "chunk_size": "qa_pair",   # 질문+답변 쌍
        "chunk_overlap": 0,
        "reason": "의미 단위 보존"
    }
}
\`\`\`

### 청크 크기 선택 프레임워크

\`\`\`
Step 1: 문서 특성 분석
  - 평균 문장 길이
  - 단락 구조
  - 주제 밀도 (한 단락에 몇 개 주제?)

Step 2: 사용 사례 고려
  - 질문 유형 (사실 확인 vs 요약 vs 분석)
  - 정확도 vs 컨텍스트 trade-off
  - 비용 제약

Step 3: 실험 및 평가
  - A/B 테스트
  - 검색 정확도 측정
  - 응답 품질 평가
\`\`\`

---

## Overlap(중첩)의 역할

### Overlap이 필요한 이유

\`\`\`
Overlap 없이 분할:
  청크1: "RAG는 검색 증강 생성입니다. 이 기술은"
  청크2: "LLM의 환각을 줄여줍니다. 외부 지식을"

  → "이 기술은"이 무엇을 가리키는지 알 수 없음
  → 문맥 단절

Overlap으로 분할:
  청크1: "RAG는 검색 증강 생성입니다. 이 기술은 LLM의"
  청크2: "이 기술은 LLM의 환각을 줄여줍니다. 외부 지식을"

  → 중첩된 부분이 문맥을 연결
  → 의미 보존
\`\`\`

### 최적의 Overlap 비율

\`\`\`python
# 연구 기반 권장값
def calculate_overlap(chunk_size: int, doc_type: str) -> int:
    """문서 유형에 따른 최적 overlap 계산"""

    ratios = {
        "narrative": 0.15,     # 서사형 (15%)
        "technical": 0.10,     # 기술 문서 (10%)
        "structured": 0.05,    # 구조화된 문서 (5%)
        "qa_pairs": 0.0,       # Q&A (0%)
    }

    ratio = ratios.get(doc_type, 0.10)
    return int(chunk_size * ratio)

# 예시
overlap = calculate_overlap(500, "technical")  # 50자
\`\`\`
      `,
      keyPoints: [
        '청킹 품질이 RAG 전체 성능을 결정한다',
        'Lost in the Middle: 중간 컨텍스트 정보 손실 현상',
        '512 토큰(~2000자)이 대부분 최적, Overlap 10-15%',
      ],
      practiceGoal: '청킹의 과학적 원리와 최적화 전략을 이해한다',
    }),

    // ========================================
    // Task 2: 청킹 전략 심층 실습 (50분)
    // ========================================
    createCodeTask('w5d3-chunking-strategies', '청킹 전략 심층 실습', 50, {
      introduction: `
## 학습 목표
- 5가지 주요 청킹 전략을 구현한다
- 각 전략의 장단점을 비교한다
- 문서 유형에 맞는 전략을 선택한다

---

## 1. 고정 크기 청킹 (Fixed Size Chunking)

### 기본 구현

\`\`\`python
from langchain.text_splitter import CharacterTextSplitter

def fixed_size_chunking(text: str, chunk_size: int = 500, overlap: int = 50):
    """고정 크기 청킹 - 가장 단순한 방법"""

    splitter = CharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap,
        separator="\\n",           # 줄바꿈 우선
        length_function=len,      # 문자 수 기준
        is_separator_regex=False
    )

    chunks = splitter.split_text(text)
    return chunks

# 사용
text = "긴 문서 내용..."
chunks = fixed_size_chunking(text, chunk_size=500, overlap=50)

for i, chunk in enumerate(chunks):
    print(f"Chunk {i+1}: {len(chunk)}자")
    print(chunk[:100] + "...")
    print("-" * 50)
\`\`\`

### 장단점

\`\`\`
장점:
  ✅ 구현이 가장 간단
  ✅ 예측 가능한 청크 크기
  ✅ 처리 속도가 빠름

단점:
  ❌ 문장/단락 중간에서 잘릴 수 있음
  ❌ 의미 단위 무시
  ❌ 중요 정보가 분리될 수 있음
\`\`\`

---

## 2. 재귀적 청킹 (Recursive Chunking) - 가장 권장

### 구현

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

def recursive_chunking(text: str, chunk_size: int = 500, overlap: int = 50):
    """재귀적 청킹 - 가장 일반적으로 사용"""

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap,
        separators=[
            "\\n\\n\\n",  # 섹션 구분 (가장 우선)
            "\\n\\n",    # 단락 구분
            "\\n",       # 줄바꿈
            "。",        # 한국어 마침표
            ".",         # 영어 마침표
            "！",
            "？",
            "!",
            "?",
            "；",
            ";",
            "，",
            ",",
            " ",         # 공백
            ""           # 문자 단위 (최후의 수단)
        ],
        length_function=len,
        is_separator_regex=False
    )

    chunks = splitter.split_text(text)
    return chunks
\`\`\`

### 작동 원리

\`\`\`
입력: "RAG 시스템 개요\\n\\nRAG는 검색 증강 생성입니다.\\n이 기술은..."

Step 1: \\n\\n로 분할 시도
  → ["RAG 시스템 개요", "RAG는 검색 증강 생성입니다.\\n이 기술은..."]

Step 2: 각 청크가 chunk_size 초과하면 다음 구분자로 재분할
  → 첫 번째 청크는 OK
  → 두 번째 청크가 크면 \\n로 분할

Step 3: 반복...

결과: 구조를 최대한 보존하면서 적절한 크기로 분할
\`\`\`

---

## 3. 의미적 청킹 (Semantic Chunking)

### 구현

\`\`\`python
from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai import OpenAIEmbeddings
import numpy as np

def semantic_chunking(text: str, threshold_type: str = "percentile"):
    """의미적 청킹 - 임베딩 유사도 기반 분할"""

    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

    splitter = SemanticChunker(
        embeddings=embeddings,
        breakpoint_threshold_type=threshold_type,  # percentile, standard_deviation, interquartile
        breakpoint_threshold_amount=95             # 상위 5%에서 분할
    )

    chunks = splitter.split_text(text)
    return chunks
\`\`\`

### 작동 원리

\`\`\`
Step 1: 문장 단위로 분할
  ["RAG는 검색 기술이다.", "LLM과 결합한다.", "오늘 날씨가 좋다."]

Step 2: 각 문장 임베딩 생성
  [vec1, vec2, vec3]

Step 3: 인접 문장 간 유사도 계산
  sim(vec1, vec2) = 0.85  (높음 → 같은 청크)
  sim(vec2, vec3) = 0.30  (낮음 → 분할점!)

Step 4: 임계값 이하에서 분할
  청크1: ["RAG는 검색 기술이다.", "LLM과 결합한다."]
  청크2: ["오늘 날씨가 좋다."]
\`\`\`

### 장단점

\`\`\`
장점:
  ✅ 의미적으로 일관된 청크
  ✅ 주제 변화에 따른 자연스러운 분할
  ✅ 검색 품질 향상

단점:
  ❌ 임베딩 비용 발생
  ❌ 처리 속도 느림
  ❌ 임계값 튜닝 필요
\`\`\`

---

## 4. 문서 구조 기반 청킹

### 마크다운 헤더 기반

\`\`\`python
from langchain.text_splitter import MarkdownHeaderTextSplitter

def markdown_chunking(markdown_text: str):
    """마크다운 헤더 기반 청킹"""

    headers_to_split = [
        ("#", "h1"),
        ("##", "h2"),
        ("###", "h3"),
    ]

    splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=headers_to_split,
        strip_headers=False  # 헤더 유지
    )

    chunks = splitter.split_text(markdown_text)

    # 각 청크에 헤더 메타데이터 포함
    for chunk in chunks:
        print(f"Content: {chunk.page_content[:50]}...")
        print(f"Metadata: {chunk.metadata}")
        print("-" * 50)

    return chunks

# 입력 예시
markdown = """
# RAG 시스템

## 개요
RAG는 검색 증강 생성입니다.

## 구성요소
### 검색기
벡터 검색을 사용합니다.

### 생성기
LLM을 사용합니다.
"""

chunks = markdown_chunking(markdown)
# Chunk 1: metadata={"h1": "RAG 시스템", "h2": "개요"}
# Chunk 2: metadata={"h1": "RAG 시스템", "h2": "구성요소", "h3": "검색기"}
\`\`\`

### HTML 구조 기반

\`\`\`python
from langchain.text_splitter import HTMLHeaderTextSplitter

def html_chunking(html_text: str):
    """HTML 헤더 기반 청킹"""

    headers_to_split = [
        ("h1", "Header 1"),
        ("h2", "Header 2"),
        ("h3", "Header 3"),
    ]

    splitter = HTMLHeaderTextSplitter(headers_to_split_on=headers_to_split)
    chunks = splitter.split_text(html_text)
    return chunks
\`\`\`

---

## 5. 코드 청킹

### 언어별 최적화

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter, Language

def code_chunking(code: str, language: Language):
    """프로그래밍 언어에 최적화된 청킹"""

    splitter = RecursiveCharacterTextSplitter.from_language(
        language=language,
        chunk_size=1000,
        chunk_overlap=100
    )

    chunks = splitter.split_text(code)
    return chunks

# 지원 언어 목록
supported_languages = [
    Language.PYTHON,
    Language.JS,
    Language.TYPESCRIPT,
    Language.JAVA,
    Language.GO,
    Language.RUST,
    Language.CPP,
    Language.RUBY,
    Language.PHP,
    Language.SWIFT,
    Language.KOTLIN,
    Language.SCALA,
]

# Python 코드 청킹
python_code = '''
class RAGPipeline:
    """RAG 파이프라인 클래스"""

    def __init__(self, vectorstore, llm):
        self.vectorstore = vectorstore
        self.llm = llm

    def retrieve(self, query: str, k: int = 5):
        """문서 검색"""
        return self.vectorstore.similarity_search(query, k=k)

    def generate(self, query: str, context: list):
        """응답 생성"""
        prompt = f"Context: {context}\\n\\nQuestion: {query}"
        return self.llm.invoke(prompt)
'''

chunks = code_chunking(python_code, Language.PYTHON)
# 함수/클래스 단위로 분할됨
\`\`\`

---

## 청킹 전략 비교 프레임워크

\`\`\`python
def compare_chunking_strategies(text: str):
    """여러 청킹 전략 비교"""

    results = {}

    # 1. 고정 크기
    fixed_chunks = fixed_size_chunking(text)
    results["fixed"] = {
        "count": len(fixed_chunks),
        "avg_size": sum(len(c) for c in fixed_chunks) / len(fixed_chunks),
        "pros": "빠름, 예측 가능",
        "cons": "의미 무시"
    }

    # 2. 재귀적
    recursive_chunks = recursive_chunking(text)
    results["recursive"] = {
        "count": len(recursive_chunks),
        "avg_size": sum(len(c) for c in recursive_chunks) / len(recursive_chunks),
        "pros": "구조 존중",
        "cons": "설정 필요"
    }

    # 3. 의미적
    semantic_chunks = semantic_chunking(text)
    results["semantic"] = {
        "count": len(semantic_chunks),
        "avg_size": sum(len(c) for c in semantic_chunks) / len(semantic_chunks),
        "pros": "의미 보존",
        "cons": "느림, 비용"
    }

    # 비교 표 출력
    print(f"{'Strategy':<15} {'Count':<10} {'Avg Size':<10}")
    print("-" * 35)
    for strategy, data in results.items():
        print(f"{strategy:<15} {data['count']:<10} {data['avg_size']:<10.1f}")

    return results
\`\`\`
      `,
      keyPoints: [
        'RecursiveCharacterTextSplitter가 가장 범용적',
        'SemanticChunker는 비용 대비 품질 최고',
        '문서 유형에 따라 전략 선택',
      ],
      practiceGoal: '다양한 청킹 전략을 구현하고 비교할 수 있다',
    }),

    // ========================================
    // Task 3: 검색 최적화 심층 분석 (45분)
    // ========================================
    createReadingTask('w5d3-retrieval-deep', '검색 최적화 심층 분석', 45, {
      introduction: `
## 학습 목표
- Sparse vs Dense 검색의 차이를 이해한다
- 하이브리드 검색의 원리를 학습한다
- Re-ranking의 효과와 구현 방법을 이해한다

---

## 검색 방식의 진화

### 1세대: 키워드 검색 (Sparse)

\`\`\`
알고리즘: TF-IDF, BM25

작동 원리:
  쿼리: "RAG 아키텍처"
  → "RAG"와 "아키텍처" 단어가 포함된 문서 검색
  → 단어 빈도와 문서 빈도로 점수 계산

BM25 공식:
  score(D, Q) = Σ IDF(qi) × (f(qi, D) × (k1 + 1)) / (f(qi, D) + k1 × (1 - b + b × |D|/avgdl))

장점:
  ✅ 정확한 키워드 매칭
  ✅ 빠른 속도
  ✅ 설명 가능 (어떤 단어가 매칭되었는지)
  ✅ 저비용

단점:
  ❌ 동의어 인식 불가 ("AI" vs "인공지능")
  ❌ 의미적 유사성 무시
  ❌ 어휘 불일치 문제 (Vocabulary Mismatch)
\`\`\`

### 2세대: 의미 검색 (Dense/Vector)

\`\`\`
알고리즘: 임베딩 기반 코사인 유사도

작동 원리:
  쿼리: "검색 기반 생성 AI"
  → 쿼리 임베딩 생성
  → 저장된 문서 임베딩과 유사도 계산
  → 가장 유사한 문서 반환

장점:
  ✅ 의미적 유사성 포착
  ✅ 동의어, 유사 표현 처리
  ✅ 다국어 검색 가능

단점:
  ❌ 정확한 키워드 매칭 약함
  ❌ 임베딩 품질에 의존
  ❌ 설명하기 어려움
  ❌ 희귀 용어/전문 용어 약함
\`\`\`

### 3세대: 하이브리드 검색

\`\`\`
키워드 검색의 정확성 + 의미 검색의 이해력 결합

hybrid_score = α × sparse_score + (1-α) × dense_score

α 값 선택:
  - α = 0.3: 의미 검색 위주 (일반 Q&A)
  - α = 0.5: 균형 (대부분의 경우)
  - α = 0.7: 키워드 검색 위주 (전문 용어, 코드)

연구 결과 (2023):
  - 하이브리드가 단독 방식보다 10-15% 성능 향상
  - 특히 전문 용어가 많은 도메인에서 효과적
\`\`\`

---

## Re-ranking: 검색 품질의 마지막 단계

### Re-ranking이란?

\`\`\`
1차 검색 → [Top-20 문서] → Re-ranker → [Top-5 문서]

1차 검색: 빠르지만 대략적인 검색 (recall 중시)
Re-ranking: 느리지만 정밀한 재정렬 (precision 중시)

비유:
  1차 검색 = 그물로 물고기 잡기 (많이 잡음)
  Re-ranking = 좋은 물고기만 골라내기 (품질 향상)
\`\`\`

### Cross-Encoder vs Bi-Encoder

\`\`\`
Bi-Encoder (임베딩 기반):
  ┌─────────┐     ┌─────────┐
  │  쿼리   │     │  문서   │
  └────┬────┘     └────┬────┘
       ↓                ↓
  ┌────┴────┐     ┌────┴────┐
  │ Encoder │     │ Encoder │
  └────┬────┘     └────┬────┘
       ↓                ↓
    [쿼리 벡터]    [문서 벡터]
            ╲      ╱
         코사인 유사도
              ↓
           점수

  특징: 빠름, 문서 벡터 미리 계산 가능

Cross-Encoder (Re-ranking):
  ┌─────────────────────────┐
  │   [쿼리] [SEP] [문서]   │
  └───────────┬─────────────┘
              ↓
  ┌───────────┴─────────────┐
  │       Transformer       │
  └───────────┬─────────────┘
              ↓
            점수

  특징: 정확함, 쿼리마다 재계산 필요 (느림)
\`\`\`

### Re-ranker 종류

\`\`\`
1. Cohere Rerank API
   - 상용 서비스, 고품질
   - 가격: $0.002/검색
   - 다국어 지원

2. BGE Reranker (오픈소스)
   - BAAI에서 개발
   - 로컬 실행 가능
   - 한국어 지원

3. Cross-Encoder (sentence-transformers)
   - 완전 오픈소스
   - 커스터마이징 가능
   - GPU 권장

4. ColBERT
   - 토큰 단위 상호작용
   - 매우 정확
   - 인덱싱 필요
\`\`\`

---

## MMR (Maximal Marginal Relevance)

### 문제: 검색 결과의 다양성 부족

\`\`\`
쿼리: "파이썬 데이터 분석"

일반 검색 Top-5:
  1. "파이썬 데이터 분석 입문"
  2. "파이썬 데이터 분석 기초"  ← 거의 동일
  3. "파이썬 데이터 분석 첫걸음"  ← 거의 동일
  4. "파이썬 데이터 분석 시작"  ← 거의 동일
  5. "파이썬 데이터 분석 개요"  ← 거의 동일

문제: 중복된 정보, 다양한 관점 부족
\`\`\`

### MMR 해결책

\`\`\`
MMR Score = λ × Relevance(doc, query)
          - (1-λ) × max[Similarity(doc, selected_docs)]

λ = 1.0: 순수 관련성 (다양성 무시)
λ = 0.5: 관련성과 다양성 균형
λ = 0.0: 순수 다양성 (관련성 무시)

결과:
  1. "파이썬 데이터 분석 입문" (관련성 높음)
  2. "Pandas 튜토리얼" (다른 관점)
  3. "NumPy로 시작하는 과학 계산" (다른 관점)
  4. "데이터 시각화 Matplotlib" (다른 관점)
  5. "Jupyter Notebook 사용법" (다른 관점)
\`\`\`

---

## Query Transformation 기법

### 1. Query Expansion (쿼리 확장)

\`\`\`
원본 쿼리: "RAG 성능 향상"

LLM으로 확장:
  → "RAG 최적화 방법"
  → "검색 증강 생성 개선 전략"
  → "RAG 시스템 튜닝 기법"
  → "Retrieval Augmented Generation 성능"

각 쿼리로 검색 → 결과 통합 → 중복 제거
\`\`\`

### 2. HyDE (Hypothetical Document Embedding)

\`\`\`
원본 쿼리: "RAG 성능 향상 방법은?"

Step 1: LLM으로 가상의 답변 생성
  "RAG 성능을 향상시키려면 청킹 전략 최적화,
   하이브리드 검색 도입, Re-ranking 적용이 효과적입니다..."

Step 2: 가상 답변을 임베딩

Step 3: 가상 답변 임베딩으로 검색

장점: 질문보다 답변과 유사한 문서 검색
단점: LLM 호출 비용, 환각 위험
\`\`\`

### 3. Step-back Prompting

\`\`\`
원본 쿼리: "GPT-4의 컨텍스트 창 크기는?"

Step-back 쿼리: "GPT-4의 아키텍처와 특징은?"

더 넓은 범위의 문서 검색 → 세부 정보 포함 확률 높음
\`\`\`
      `,
      keyPoints: [
        '하이브리드 검색이 대부분 최적 (키워드 + 의미)',
        'Re-ranking으로 10-15% 정확도 향상',
        'MMR로 검색 결과 다양성 확보',
      ],
      practiceGoal: '검색 최적화 기법들의 원리와 효과를 이해한다',
    }),

    // ========================================
    // Task 4: 하이브리드 검색 & Re-ranking 실습 (50분)
    // ========================================
    createCodeTask('w5d3-hybrid-reranking', '하이브리드 검색 & Re-ranking 실습', 50, {
      introduction: `
## 학습 목표
- 하이브리드 검색을 구현한다
- Re-ranking을 적용한다
- 검색 파이프라인을 구축한다

---

## 1. BM25 검색기 구현

\`\`\`python
from langchain_community.retrievers import BM25Retriever
from langchain.schema import Document

def create_bm25_retriever(documents: list[Document], k: int = 5):
    """BM25 키워드 검색기 생성"""

    retriever = BM25Retriever.from_documents(
        documents,
        k=k
    )

    return retriever

# 사용
docs = [
    Document(page_content="RAG는 검색 증강 생성입니다.", metadata={"source": "doc1"}),
    Document(page_content="벡터 검색은 임베딩을 사용합니다.", metadata={"source": "doc2"}),
    Document(page_content="BM25는 키워드 검색 알고리즘입니다.", metadata={"source": "doc3"}),
]

bm25 = create_bm25_retriever(docs, k=3)
results = bm25.invoke("검색 알고리즘")

for doc in results:
    print(f"[BM25] {doc.page_content[:50]}...")
\`\`\`

---

## 2. 하이브리드 검색 (Ensemble Retriever)

\`\`\`python
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

def create_hybrid_retriever(
    documents: list[Document],
    vectorstore: Chroma,
    bm25_weight: float = 0.4,
    vector_weight: float = 0.6,
    k: int = 5
):
    """하이브리드 검색기 생성"""

    # BM25 검색기
    bm25_retriever = BM25Retriever.from_documents(
        documents,
        k=k
    )

    # 벡터 검색기
    vector_retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k}
    )

    # 앙상블 검색기
    ensemble = EnsembleRetriever(
        retrievers=[bm25_retriever, vector_retriever],
        weights=[bm25_weight, vector_weight]
    )

    return ensemble

# 사용 예시
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(docs, embeddings)

hybrid = create_hybrid_retriever(
    documents=docs,
    vectorstore=vectorstore,
    bm25_weight=0.4,  # 키워드 40%
    vector_weight=0.6  # 벡터 60%
)

results = hybrid.invoke("검색 기반 AI 기술")
for doc in results:
    print(f"[Hybrid] {doc.page_content[:50]}...")
\`\`\`

---

## 3. Re-ranking with Cohere

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CohereRerank
from langchain_community.retrievers import BM25Retriever
import os

def create_reranking_retriever(
    base_retriever,
    top_n: int = 5,
    initial_k: int = 20
):
    """Cohere Re-ranker가 적용된 검색기"""

    # Cohere Reranker
    reranker = CohereRerank(
        cohere_api_key=os.environ["COHERE_API_KEY"],
        top_n=top_n,
        model="rerank-multilingual-v3.0"  # 다국어 지원
    )

    # 압축 검색기 (1차 검색 → Re-ranking)
    compression_retriever = ContextualCompressionRetriever(
        base_compressor=reranker,
        base_retriever=base_retriever
    )

    return compression_retriever

# 사용 예시
base_retriever = vectorstore.as_retriever(search_kwargs={"k": 20})
reranking_retriever = create_reranking_retriever(base_retriever, top_n=5)

# 20개 검색 → 5개로 Re-rank
results = reranking_retriever.invoke("RAG 시스템 최적화 방법")
\`\`\`

---

## 4. 오픈소스 Re-ranker (BGE)

\`\`\`python
from sentence_transformers import CrossEncoder
import numpy as np

class BGEReranker:
    """BGE Cross-Encoder 기반 Re-ranker"""

    def __init__(self, model_name: str = "BAAI/bge-reranker-base"):
        self.model = CrossEncoder(model_name)

    def rerank(
        self,
        query: str,
        documents: list[Document],
        top_n: int = 5
    ) -> list[Document]:
        """문서 재정렬"""

        # 쿼리-문서 쌍 생성
        pairs = [(query, doc.page_content) for doc in documents]

        # 점수 계산
        scores = self.model.predict(pairs)

        # 정렬
        sorted_indices = np.argsort(scores)[::-1][:top_n]

        # 상위 N개 반환
        return [documents[i] for i in sorted_indices]

# 사용
reranker = BGEReranker()

# 1차 검색
initial_results = vectorstore.similarity_search("RAG 최적화", k=20)

# Re-ranking
final_results = reranker.rerank("RAG 최적화", initial_results, top_n=5)
\`\`\`

---

## 5. MMR 검색

\`\`\`python
def create_mmr_retriever(
    vectorstore: Chroma,
    k: int = 5,
    fetch_k: int = 20,
    lambda_mult: float = 0.5
):
    """MMR 검색기 생성"""

    retriever = vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": k,              # 최종 반환 개수
            "fetch_k": fetch_k,  # 후보군 크기
            "lambda_mult": lambda_mult  # 다양성 가중치 (0=다양성, 1=관련성)
        }
    )

    return retriever

# 다양성 중시
diverse_retriever = create_mmr_retriever(vectorstore, lambda_mult=0.3)

# 관련성 중시
relevant_retriever = create_mmr_retriever(vectorstore, lambda_mult=0.7)
\`\`\`

---

## 6. 전체 검색 파이프라인

\`\`\`python
from dataclasses import dataclass
from typing import Optional
from langchain.schema import Document

@dataclass
class SearchConfig:
    """검색 설정"""
    use_hybrid: bool = True
    bm25_weight: float = 0.4
    use_reranking: bool = True
    use_mmr: bool = True
    initial_k: int = 20
    final_k: int = 5
    mmr_lambda: float = 0.5

class AdvancedRetriever:
    """프로덕션급 검색 파이프라인"""

    def __init__(
        self,
        vectorstore: Chroma,
        documents: list[Document],
        config: SearchConfig
    ):
        self.vectorstore = vectorstore
        self.documents = documents
        self.config = config

        # 검색기 초기화
        self._setup_retrievers()

    def _setup_retrievers(self):
        """검색기 설정"""
        if self.config.use_hybrid:
            # 하이브리드 검색기
            bm25 = BM25Retriever.from_documents(
                self.documents,
                k=self.config.initial_k
            )
            vector = self.vectorstore.as_retriever(
                search_kwargs={"k": self.config.initial_k}
            )
            self.base_retriever = EnsembleRetriever(
                retrievers=[bm25, vector],
                weights=[self.config.bm25_weight, 1 - self.config.bm25_weight]
            )
        else:
            self.base_retriever = self.vectorstore.as_retriever(
                search_kwargs={"k": self.config.initial_k}
            )

        if self.config.use_reranking:
            self.reranker = BGEReranker()

    def search(self, query: str) -> list[Document]:
        """검색 실행"""
        # 1차 검색
        results = self.base_retriever.invoke(query)

        # Re-ranking
        if self.config.use_reranking:
            results = self.reranker.rerank(query, results, self.config.final_k)
        else:
            results = results[:self.config.final_k]

        return results

# 사용
config = SearchConfig(
    use_hybrid=True,
    bm25_weight=0.4,
    use_reranking=True,
    initial_k=20,
    final_k=5
)

retriever = AdvancedRetriever(vectorstore, docs, config)
results = retriever.search("RAG 시스템 구축 방법")
\`\`\`
      `,
      keyPoints: [
        'EnsembleRetriever로 하이브리드 검색 구현',
        'Cohere/BGE로 Re-ranking 적용',
        '파이프라인으로 전체 검색 프로세스 통합',
      ],
      practiceGoal: '하이브리드 검색과 Re-ranking을 구현할 수 있다',
    }),

    // ========================================
    // Task 5: RAG 평가 지표와 벤치마킹 (35분)
    // ========================================
    createReadingTask('w5d3-rag-evaluation', 'RAG 평가 지표와 벤치마킹', 35, {
      introduction: `
## 학습 목표
- RAG 시스템의 주요 평가 지표를 이해한다
- 검색 품질과 생성 품질을 측정하는 방법을 학습한다
- 자동화된 평가 파이프라인을 설계한다

---

## RAG 평가의 두 축

\`\`\`
RAG 시스템 = 검색 + 생성

┌─────────────────┬─────────────────┐
│  검색 품질 평가  │  생성 품질 평가  │
├─────────────────┼─────────────────┤
│ - Precision@K   │ - Faithfulness  │
│ - Recall@K      │ - Answer Relevance│
│ - MRR           │ - Context Relevance│
│ - NDCG          │ - Hallucination Rate│
└─────────────────┴─────────────────┘
\`\`\`

---

## 검색 품질 평가 지표

### 1. Precision@K

\`\`\`python
def precision_at_k(relevant_docs: set, retrieved_docs: list, k: int) -> float:
    """
    상위 K개 중 관련 문서 비율

    Precision@K = (관련 문서 수) / K
    """
    top_k = set(retrieved_docs[:k])
    relevant_in_top_k = len(relevant_docs & top_k)
    return relevant_in_top_k / k

# 예시
relevant = {"doc1", "doc3", "doc5"}
retrieved = ["doc1", "doc2", "doc3", "doc4", "doc5"]

print(f"Precision@3: {precision_at_k(relevant, retrieved, 3)}")  # 0.67
print(f"Precision@5: {precision_at_k(relevant, retrieved, 5)}")  # 0.60
\`\`\`

### 2. Recall@K

\`\`\`python
def recall_at_k(relevant_docs: set, retrieved_docs: list, k: int) -> float:
    """
    관련 문서 중 상위 K개에 포함된 비율

    Recall@K = (상위 K개에서 찾은 관련 문서) / (전체 관련 문서)
    """
    top_k = set(retrieved_docs[:k])
    relevant_in_top_k = len(relevant_docs & top_k)
    return relevant_in_top_k / len(relevant_docs)

# 예시
print(f"Recall@3: {recall_at_k(relevant, retrieved, 3)}")  # 0.67
print(f"Recall@5: {recall_at_k(relevant, retrieved, 5)}")  # 1.00
\`\`\`

### 3. MRR (Mean Reciprocal Rank)

\`\`\`python
def mrr(queries_results: list[tuple[set, list]]) -> float:
    """
    첫 번째 관련 문서의 역순위 평균

    MRR = (1/N) × Σ (1/rank_i)
    """
    reciprocal_ranks = []

    for relevant, retrieved in queries_results:
        for rank, doc in enumerate(retrieved, 1):
            if doc in relevant:
                reciprocal_ranks.append(1 / rank)
                break
        else:
            reciprocal_ranks.append(0)

    return sum(reciprocal_ranks) / len(reciprocal_ranks)

# 예시
queries = [
    ({"doc3"}, ["doc1", "doc2", "doc3"]),  # 1/3
    ({"doc1"}, ["doc1", "doc2"]),          # 1/1
    ({"doc5"}, ["doc1", "doc2", "doc3"]),  # 0 (못 찾음)
]
print(f"MRR: {mrr(queries)}")  # 0.44
\`\`\`

---

## 생성 품질 평가 지표

### 1. Faithfulness (충실도)

\`\`\`
정의: 생성된 답변이 검색된 컨텍스트에 근거하는지

측정 방법 (LLM-as-Judge):
  프롬프트: "다음 답변의 각 주장이 컨텍스트에서 지지되는지 평가하세요"

  컨텍스트: "RAG는 2020년 Meta AI에서 발표되었습니다."
  답변: "RAG는 2020년에 Google이 발표했습니다."

  평가: "RAG 발표 시기는 맞지만, 발표 주체가 틀림 → Faithfulness: 0.5"

점수: 0.0 ~ 1.0 (높을수록 좋음)
\`\`\`

### 2. Answer Relevance (답변 관련성)

\`\`\`
정의: 답변이 질문에 적절히 대응하는지

측정 방법:
  질문: "RAG의 장점은?"
  답변: "RAG는 2020년에 발표되었습니다." ← 관련 없음!

  올바른 답변: "RAG의 장점은 환각 감소, 최신 정보 활용..." ← 관련 있음

방법 1: LLM-as-Judge
방법 2: 답변에서 질문 재생성 → 원래 질문과 유사도 측정
\`\`\`

### 3. Context Relevance (컨텍스트 관련성)

\`\`\`
정의: 검색된 컨텍스트가 질문과 관련 있는지

중요성:
  - 관련 없는 컨텍스트 → 토큰 낭비
  - 관련 없는 컨텍스트 → 환각 유발 가능
  - 관련 없는 컨텍스트 → 응답 품질 저하

측정:
  질문: "RAG의 검색 단계는?"
  컨텍스트1: "RAG의 검색 단계는 쿼리 임베딩..." ← 관련 높음
  컨텍스트2: "오늘 서울 날씨는 맑음..." ← 관련 없음

  Context Relevance = 관련 컨텍스트 / 전체 컨텍스트
\`\`\`

---

## RAGAS 프레임워크

\`\`\`python
# RAGAS: RAG Assessment 프레임워크
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall
)
from datasets import Dataset

# 평가 데이터 준비
data = {
    "question": ["RAG란 무엇인가?"],
    "answer": ["RAG는 검색 증강 생성으로..."],
    "contexts": [["RAG는 Retrieval Augmented Generation의 약자로..."]],
    "ground_truth": ["RAG는 검색과 생성을 결합한 기술입니다."]
}

dataset = Dataset.from_dict(data)

# 평가 실행
result = evaluate(
    dataset,
    metrics=[
        faithfulness,
        answer_relevancy,
        context_precision,
        context_recall
    ]
)

print(result)
# {'faithfulness': 0.95, 'answer_relevancy': 0.88, ...}
\`\`\`

---

## 실용적인 평가 파이프라인

\`\`\`python
from dataclasses import dataclass
from typing import Optional
import json

@dataclass
class EvaluationResult:
    """평가 결과"""
    query: str
    precision_at_5: float
    recall_at_5: float
    mrr: float
    faithfulness: float
    answer_relevance: float

class RAGEvaluator:
    """RAG 시스템 평가기"""

    def __init__(self, rag_pipeline, llm_judge):
        self.rag = rag_pipeline
        self.judge = llm_judge

    def evaluate_retrieval(
        self,
        query: str,
        relevant_docs: set[str],
        k: int = 5
    ) -> dict:
        """검색 품질 평가"""
        results = self.rag.retrieve(query)
        retrieved_ids = [doc.metadata.get("id") for doc in results]

        return {
            "precision": precision_at_k(relevant_docs, retrieved_ids, k),
            "recall": recall_at_k(relevant_docs, retrieved_ids, k),
            "mrr": self._calculate_mrr(relevant_docs, retrieved_ids)
        }

    def evaluate_generation(
        self,
        query: str,
        answer: str,
        contexts: list[str]
    ) -> dict:
        """생성 품질 평가 (LLM-as-Judge)"""

        # Faithfulness 평가
        faithfulness_prompt = f"""
        Context: {contexts}
        Answer: {answer}

        위 답변이 컨텍스트에 근거하는지 0-1 점수로 평가하세요.
        JSON 형식으로 출력: {{"score": 0.0-1.0, "reason": "..."}}
        """
        faithfulness_result = json.loads(self.judge.invoke(faithfulness_prompt))

        # Answer Relevance 평가
        relevance_prompt = f"""
        Question: {query}
        Answer: {answer}

        답변이 질문에 적절한지 0-1 점수로 평가하세요.
        JSON 형식으로 출력: {{"score": 0.0-1.0, "reason": "..."}}
        """
        relevance_result = json.loads(self.judge.invoke(relevance_prompt))

        return {
            "faithfulness": faithfulness_result["score"],
            "answer_relevance": relevance_result["score"]
        }

    def full_evaluation(
        self,
        test_cases: list[dict]
    ) -> list[EvaluationResult]:
        """전체 평가 실행"""
        results = []

        for case in test_cases:
            # RAG 실행
            response = self.rag.invoke(case["query"])

            # 검색 평가
            retrieval_scores = self.evaluate_retrieval(
                case["query"],
                set(case["relevant_doc_ids"])
            )

            # 생성 평가
            generation_scores = self.evaluate_generation(
                case["query"],
                response["answer"],
                response["contexts"]
            )

            results.append(EvaluationResult(
                query=case["query"],
                precision_at_5=retrieval_scores["precision"],
                recall_at_5=retrieval_scores["recall"],
                mrr=retrieval_scores["mrr"],
                faithfulness=generation_scores["faithfulness"],
                answer_relevance=generation_scores["answer_relevance"]
            ))

        return results
\`\`\`
      `,
      keyPoints: [
        '검색 평가: Precision@K, Recall@K, MRR',
        '생성 평가: Faithfulness, Answer Relevance',
        'RAGAS 프레임워크로 자동화된 평가',
      ],
      practiceGoal: 'RAG 시스템의 평가 지표와 측정 방법을 이해한다',
    }),

    // ========================================
    // Task 6: Day 3 종합 퀴즈 (20분)
    // ========================================
    createQuizTask('w5d3-quiz', 'Day 3 종합 퀴즈', 20, {
      introduction: `
## 퀴즈 안내

Day 3에서 학습한 청킹 전략과 검색 최적화 개념을 확인합니다.
각 문제를 신중하게 읽고 답변해주세요.
      `,
      questions: [
        {
          id: 'w5d3-q1',
          question: '"Lost in the Middle" 현상은 무엇을 의미하나요?',
          options: [
            'LLM이 긴 컨텍스트의 중간 부분 정보를 잘 활용하지 못하는 현상',
            '청킹 시 문서 중간 부분이 누락되는 현상',
            '검색 결과에서 중간 순위 문서가 무시되는 현상',
            '임베딩 시 중간 단어가 잘 표현되지 않는 현상',
          ],
          correctAnswer: 0,
          explanation: '"Lost in the Middle"은 2023년 스탠포드 연구에서 발견된 현상으로, LLM이 컨텍스트의 처음과 끝 정보는 잘 활용하지만 중간 부분은 무시하는 경향입니다.',
        },
        {
          id: 'w5d3-q2',
          question: 'RecursiveCharacterTextSplitter의 주요 특징은?',
          options: [
            '고정 크기로만 분할',
            '여러 구분자를 우선순위에 따라 순차적으로 시도',
            '임베딩 유사도 기반 분할',
            '마크다운 헤더 기반 분할',
          ],
          correctAnswer: 1,
          explanation: 'RecursiveCharacterTextSplitter는 \\n\\n, \\n, 마침표, 공백 등 여러 구분자를 우선순위에 따라 시도하여 문서 구조를 최대한 보존합니다.',
        },
        {
          id: 'w5d3-q3',
          question: '하이브리드 검색의 공식 hybrid_score = α × sparse_score + (1-α) × dense_score에서 α = 0.7일 때의 의미는?',
          options: [
            '의미 검색 70%, 키워드 검색 30%',
            '키워드 검색 70%, 의미 검색 30%',
            '두 검색 방식이 동일한 비중',
            'α 값은 검색 결과 개수를 의미',
          ],
          correctAnswer: 1,
          explanation: 'α = 0.7은 sparse(키워드) 검색에 70% 가중치를 부여하고, dense(의미) 검색에 30% 가중치를 부여합니다. 전문 용어가 많은 도메인에서 유용합니다.',
        },
        {
          id: 'w5d3-q4',
          question: 'Re-ranking에서 Cross-Encoder가 Bi-Encoder보다 정확한 이유는?',
          options: [
            'Cross-Encoder가 더 큰 모델을 사용하기 때문',
            'Cross-Encoder는 쿼리와 문서를 함께 입력받아 상호작용을 고려하기 때문',
            'Cross-Encoder가 더 많은 데이터로 학습되었기 때문',
            'Cross-Encoder가 GPU를 사용하기 때문',
          ],
          correctAnswer: 1,
          explanation: 'Cross-Encoder는 쿼리와 문서를 [CLS] 쿼리 [SEP] 문서 형태로 함께 입력받아 Transformer가 양쪽을 동시에 보고 상호작용을 고려할 수 있습니다. Bi-Encoder는 각각 독립적으로 임베딩합니다.',
        },
        {
          id: 'w5d3-q5',
          question: 'RAG 평가에서 Faithfulness 지표는 무엇을 측정하나요?',
          options: [
            '검색된 문서의 관련성',
            '생성된 답변이 검색된 컨텍스트에 근거하는 정도',
            '답변이 질문에 적절히 대응하는 정도',
            '검색 속도와 효율성',
          ],
          correctAnswer: 1,
          explanation: 'Faithfulness(충실도)는 생성된 답변의 각 주장이 검색된 컨텍스트에서 지지되는지를 측정합니다. 환각(Hallucination) 여부를 판단하는 핵심 지표입니다.',
        },
      ],
      keyPoints: [
        'Lost in the Middle: LLM은 컨텍스트 중간 정보를 잘 활용 못함',
        'RecursiveCharacterTextSplitter: 여러 구분자 순차 시도',
        'Faithfulness: 답변이 컨텍스트에 근거하는 정도',
      ],
      practiceGoal: 'Day 3 핵심 개념을 이해했는지 확인한다',
    }),

    // ========================================
    // Challenge: 청킹 & 검색 최적화 시스템 구축 (60분)
    // ========================================
    createChallengeTask('w5d3-challenge', '청킹 & 검색 최적화 시스템 구축', 60, {
      introduction: `
## 챌린지 시나리오

당신은 법률 스타트업의 AI 엔지니어입니다. 회사는 법률 문서 Q&A 시스템을 구축하려 하는데,
법률 문서의 특성상 정확한 검색과 신뢰할 수 있는 답변이 매우 중요합니다.

**요구사항:**
1. 법률 문서에 최적화된 청킹 전략 설계
2. 하이브리드 검색 + Re-ranking 파이프라인 구축
3. 검색 품질 평가 시스템 구현
4. 성능 벤치마크 및 최적화

---

## 평가 기준

| 항목 | 배점 | 기준 |
|------|------|------|
| 청킹 전략 | 25점 | 법률 문서에 최적화된 전략 |
| 검색 파이프라인 | 25점 | 하이브리드 + Re-ranking |
| 평가 시스템 | 25점 | Precision, Recall, MRR 측정 |
| 최적화 및 분석 | 25점 | 성능 개선 및 결과 분석 |

---

## 테스트 데이터

\`\`\`python
# 법률 문서 샘플
LEGAL_DOCUMENTS = [
    {
        "id": "law001",
        "title": "개인정보 보호법 제1조",
        "content": """
        제1조(목적) 이 법은 개인정보의 처리 및 보호에 관한 사항을 정함으로써
        개인의 자유와 권리를 보호하고, 나아가 개인의 존엄과 가치를 구현함을
        목적으로 한다.
        """
    },
    {
        "id": "law002",
        "title": "개인정보 보호법 제2조",
        "content": """
        제2조(정의) 이 법에서 사용하는 용어의 뜻은 다음과 같다.
        1. "개인정보"란 살아 있는 개인에 관한 정보로서 다음 각 목의 어느
           하나에 해당하는 정보를 말한다.
        가. 성명, 주민등록번호 및 영상 등을 통하여 개인을 알아볼 수 있는 정보
        나. 해당 정보만으로는 특정 개인을 알아볼 수 없더라도 다른 정보와
            쉽게 결합하여 알아볼 수 있는 정보
        """
    },
    # ... 더 많은 법률 문서
]

# 평가용 테스트 케이스
TEST_CASES = [
    {
        "query": "개인정보 보호법의 목적은?",
        "relevant_doc_ids": ["law001"],
        "expected_answer_contains": ["개인의 자유와 권리", "존엄과 가치"]
    },
    {
        "query": "개인정보의 법적 정의는?",
        "relevant_doc_ids": ["law002"],
        "expected_answer_contains": ["살아 있는 개인", "성명", "주민등록번호"]
    }
]
\`\`\`
      `,
      keyPoints: [
        '법률 문서 특성에 맞는 청킹 전략 구현 (조항 단위 보존)',
        '하이브리드 검색 (BM25 + 벡터) + Re-ranking 파이프라인',
        'Precision@K, Recall@K, MRR 자동 측정 시스템',
        '최소 3가지 설정 비교 및 최적 파라미터 도출',
      ],
      hints: [
        '**법률 문서 청킹**: "제X조", "항", "호" 패턴으로 분할, 조항 단위 보존이 핵심',
        '**하이브리드 검색**: BM25 + Vector 결합 (가중치 0.5:0.5 시작), Re-ranking으로 정밀도 향상',
        '**평가 지표**: Precision@5, Recall@5, MRR 계산하여 설정별 비교',
        '**최적화**: 가중 점수(Precision 0.4 + Recall 0.3 + MRR 0.3)로 최적 설정 도출',
      ],
    }),
  ],
}
