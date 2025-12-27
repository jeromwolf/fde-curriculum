// Day 2: 임베딩 & 벡터 DB (Chroma, Pinecone) - 완전 리뉴얼 버전

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day2EmbeddingsVectordb: Day = {
  slug: 'embeddings-vectordb',
  title: '임베딩 & 벡터 DB',
  totalDuration: 300, // 5시간
  tasks: [
    // ========================================
    // Task 1: 임베딩의 역사와 원리 (40분)
    // ========================================
    createVideoTask('w5d2-embeddings-history', '임베딩의 역사와 수학적 원리', 40, {
      introduction: `
## 학습 목표
- 임베딩 기술의 발전 역사를 이해한다
- 임베딩의 수학적 원리를 이해한다
- 주요 임베딩 모델들의 특징을 비교한다

---

## 임베딩의 역사: Word2Vec에서 LLM까지

### 1세대: 통계 기반 (2003-2012)

**TF-IDF (Term Frequency-Inverse Document Frequency)**

\`\`\`python
# 전통적인 문서 표현 방식
from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer()
documents = [
    "고양이가 방에서 잔다",
    "강아지가 마당에서 논다",
    "고양이와 강아지가 친구다"
]

# 희소 벡터 (대부분 0)
tfidf_matrix = vectorizer.fit_transform(documents)
print(f"차원: {tfidf_matrix.shape}")  # (3, 8) - 단어 수만큼
print(f"비영 요소 비율: {tfidf_matrix.nnz / tfidf_matrix.size:.2%}")  # ~25%
\`\`\`

**한계점:**
- 단어 순서 무시 ("개가 사람을 물었다" vs "사람이 개를 물었다")
- 동의어 인식 불가 ("차" vs "자동차")
- 희소 벡터 → 메모리 비효율

---

### 2세대: 신경망 기반 Word Embeddings (2013-2017)

**Word2Vec (2013, Google)**

Mikolov et al.의 혁신적 논문 "Efficient Estimation of Word Representations in Vector Space"

\`\`\`
핵심 아이디어: 비슷한 문맥에서 등장하는 단어는 비슷한 의미를 가진다

"나는 [커피]를 마신다"
"나는 [차]를 마신다"
→ "커피"와 "차"는 유사한 벡터
\`\`\`

**두 가지 학습 방식:**

\`\`\`
CBOW (Continuous Bag of Words):
  - 주변 단어로 중심 단어 예측
  - [나는, 를, 마신다] → [커피] 예측
  - 빠른 학습, 빈번한 단어에 유리

Skip-gram:
  - 중심 단어로 주변 단어 예측
  - [커피] → [나는, 를, 마신다] 예측
  - 희귀 단어, 작은 데이터셋에 유리
\`\`\`

**Word2Vec의 놀라운 성질 - 벡터 연산:**

\`\`\`python
# 유명한 예시
vector("King") - vector("Man") + vector("Woman") ≈ vector("Queen")

# 실제 코드
from gensim.models import Word2Vec

# 사전 학습된 모델 로드
import gensim.downloader as api
model = api.load('word2vec-google-news-300')

# 벡터 연산
result = model.most_similar(
    positive=['king', 'woman'],
    negative=['man'],
    topn=1
)
print(result)  # [('queen', 0.7118)]
\`\`\`

**GloVe (2014, Stanford)**

Global Vectors for Word Representation - 전역 통계 정보 활용

\`\`\`
Word2Vec: 로컬 문맥만 학습
GloVe: 전체 코퍼스의 동시 출현 통계 활용
→ 더 안정적인 임베딩
\`\`\`

**FastText (2016, Facebook)**

서브워드(subword) 기반 - 미등록 단어 처리 가능

\`\`\`
"자연어처리" → ["자연", "연어", "어처", "처리", ...]
→ 학습에 없는 단어도 서브워드 조합으로 임베딩 생성
\`\`\`

---

### 3세대: Transformer 기반 (2018-현재)

**BERT (2018, Google)**

Bidirectional Encoder Representations from Transformers

\`\`\`
핵심 혁신: 양방향 문맥 이해

Word2Vec/GloVe: "bank"는 항상 같은 벡터
BERT: 문맥에 따라 다른 벡터
  - "I went to the bank to deposit money" → 금융 bank
  - "I sat on the river bank" → 강둑 bank
\`\`\`

**Sentence-BERT (2019)**

문장 단위 임베딩에 최적화

\`\`\`python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

sentences = [
    "오늘 날씨가 좋다",
    "The weather is nice today",  # 같은 의미, 다른 언어
    "주식 시장이 폭락했다"
]

embeddings = model.encode(sentences)
# 첫 두 문장은 유사한 벡터, 세 번째는 다름
\`\`\`

**OpenAI Embeddings (2022-2024)**

\`\`\`
text-embedding-ada-002 (2022): 1536차원, $0.0001/1K tokens
text-embedding-3-small (2024): 1536차원, $0.00002/1K tokens (80% 저렴!)
text-embedding-3-large (2024): 3072차원, $0.00013/1K tokens
\`\`\`

---

## 임베딩의 수학적 원리

### 벡터 공간 모델 (Vector Space Model)

\`\`\`
N차원 공간에서 각 점(벡터)은 텍스트의 "의미"를 표현

예: 3차원으로 단순화
    동물 축  음식 축  기술 축
고양이: [0.9,   0.1,   0.0]
강아지: [0.8,   0.2,   0.0]
피자:   [0.0,   0.9,   0.1]
컴퓨터: [0.0,   0.1,   0.9]

→ 고양이와 강아지는 가깝고, 피자와는 멀다
\`\`\`

### 유사도 측정 방법

**1. 코사인 유사도 (Cosine Similarity) - 가장 일반적**

\`\`\`python
import numpy as np

def cosine_similarity(a, b):
    """
    코사인 유사도 = 두 벡터의 각도
    - 방향만 고려, 크기 무시
    - 텍스트 길이에 무관
    """
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# 값 범위: -1 ~ 1
# 1: 완전히 같은 방향 (의미 동일)
# 0: 직교 (관련 없음)
# -1: 반대 방향 (의미 반대)

vec_cat = np.array([0.9, 0.8, 0.1])
vec_dog = np.array([0.85, 0.75, 0.15])
vec_pizza = np.array([0.1, 0.2, 0.9])

print(f"고양이-강아지: {cosine_similarity(vec_cat, vec_dog):.3f}")  # ~0.99
print(f"고양이-피자: {cosine_similarity(vec_cat, vec_pizza):.3f}")  # ~0.35
\`\`\`

**2. 유클리드 거리 (Euclidean Distance)**

\`\`\`python
def euclidean_distance(a, b):
    """
    유클리드 거리 = 두 점 사이의 직선 거리
    - 크기도 고려
    - 작을수록 유사
    """
    return np.linalg.norm(a - b)

# 주의: 거리이므로 작을수록 유사!
print(f"고양이-강아지 거리: {euclidean_distance(vec_cat, vec_dog):.3f}")
\`\`\`

**3. 내적 (Dot Product)**

\`\`\`python
def dot_product(a, b):
    """
    내적 = 크기 × 방향
    - 정규화된 벡터에서는 코사인 유사도와 동일
    - 빠른 계산
    """
    return np.dot(a, b)
\`\`\`

**언제 어떤 측정 방법을?**

| 방법 | 사용 상황 | 특징 |
|------|----------|------|
| **코사인 유사도** | 일반적인 텍스트 검색 | 길이 무관, 의미만 비교 |
| **유클리드 거리** | 클러스터링, 이상치 탐지 | 절대적 위치 중요 |
| **내적** | 추천 시스템, 정규화된 벡터 | 빠른 계산 |

---

## 차원의 저주와 해결책

\`\`\`
문제: 고차원에서는 모든 점이 비슷하게 "멀리" 보임

1536차원에서:
- 무작위 두 벡터의 코사인 유사도는 거의 0에 가까움
- 유사한 벡터만 높은 유사도 → 좋은 분별력
\`\`\`

**차원 축소 기법:**

\`\`\`python
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import umap

# PCA: 빠르지만 선형적
pca = PCA(n_components=2)
reduced_pca = pca.fit_transform(embeddings)

# t-SNE: 시각화에 좋음, 느림
tsne = TSNE(n_components=2)
reduced_tsne = tsne.fit_transform(embeddings)

# UMAP: t-SNE보다 빠르고 전역 구조 보존
reducer = umap.UMAP(n_components=2)
reduced_umap = reducer.fit_transform(embeddings)
\`\`\`
      `,
      keyPoints: [
        'Word2Vec(2013) → GloVe → FastText → BERT → OpenAI 임베딩 발전사',
        '코사인 유사도: 방향 기반, 텍스트 길이 무관',
        '고차원 벡터는 의미적 분별력이 높음',
      ],
      practiceGoal: '임베딩의 역사와 수학적 원리를 이해한다',
    }),

    // ========================================
    // Task 2: 임베딩 모델 비교 & 선택 가이드 (45분)
    // ========================================
    createReadingTask('w5d2-embedding-models', '임베딩 모델 비교 & 선택 가이드', 45, {
      introduction: `
## 학습 목표
- 주요 임베딩 모델들의 특성을 비교한다
- 상황에 맞는 최적의 임베딩 모델을 선택한다
- 다국어 및 한국어 전용 모델을 이해한다

---

## 주요 임베딩 모델 종합 비교

### OpenAI Embeddings (2024 기준)

| 모델 | 차원 | 가격/1M 토큰 | 최대 토큰 | 특징 |
|------|------|-------------|----------|------|
| **text-embedding-3-small** | 1536 | $0.02 | 8191 | 가성비 최고, 대부분 충분 |
| **text-embedding-3-large** | 3072 | $0.13 | 8191 | 최고 품질, 복잡한 도메인 |
| text-embedding-ada-002 | 1536 | $0.10 | 8191 | 레거시, 사용 지양 |

\`\`\`python
from openai import OpenAI
client = OpenAI()

# 3-small: 대부분의 RAG에 충분
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="검색 증강 생성 기술",
    encoding_format="float"
)

# 차원 축소 옵션 (새로운 기능!)
response_reduced = client.embeddings.create(
    model="text-embedding-3-large",
    input="검색 증강 생성 기술",
    dimensions=1024  # 3072 → 1024로 축소
)
# 저장 공간 절약 + 성능 유지
\`\`\`

---

### 오픈소스 임베딩 모델

**Sentence-Transformers (Hugging Face)**

| 모델 | 차원 | 언어 | 속도 | 품질 |
|------|------|------|------|------|
| all-MiniLM-L6-v2 | 384 | 영어 | ⚡️⚡️⚡️ | ⭐️⭐️⭐️ |
| all-mpnet-base-v2 | 768 | 영어 | ⚡️⚡️ | ⭐️⭐️⭐️⭐️ |
| paraphrase-multilingual-MiniLM-L12-v2 | 384 | 50+ | ⚡️⚡️⚡️ | ⭐️⭐️⭐️ |
| **multilingual-e5-large** | 1024 | 100+ | ⚡️ | ⭐️⭐️⭐️⭐️⭐️ |

\`\`\`python
from sentence_transformers import SentenceTransformer

# 영어 전용 - 빠르고 가벼움
model_en = SentenceTransformer('all-MiniLM-L6-v2')

# 다국어 - 한국어 포함
model_multi = SentenceTransformer('intfloat/multilingual-e5-large')

# 임베딩 생성
texts = [
    "query: RAG 시스템이란?",  # E5 모델은 "query:" 프리픽스 필요
    "passage: RAG는 검색 증강 생성입니다"  # 문서는 "passage:"
]
embeddings = model_multi.encode(texts)
\`\`\`

---

### 한국어 특화 모델

| 모델 | 차원 | 특징 | 추천 상황 |
|------|------|------|----------|
| **KoSentenceT5** | 768 | 한국어 특화 | 순수 한국어 문서 |
| **ko-sbert-nli** | 768 | 한국어 NLI 학습 | 의미적 유사도 |
| **KoSimCSE** | 768 | 대조 학습 | 비지도 학습 |
| **multilingual-e5** | 1024 | 100개 언어 | 다국어 혼합 |

\`\`\`python
from sentence_transformers import SentenceTransformer

# 한국어 특화 모델
model_ko = SentenceTransformer('jhgan/ko-sroberta-multitask')

korean_texts = [
    "인공지능 기술이 발전하고 있다",
    "AI 기술이 진보하고 있다",
    "오늘 점심은 김치찌개"
]

embeddings = model_ko.encode(korean_texts)
\`\`\`

---

## 임베딩 모델 선택 의사결정 트리

\`\`\`
시작
├── 예산이 있는가?
│   ├── 있다 → OpenAI
│   │   ├── 일반 RAG → text-embedding-3-small
│   │   └── 고품질 필요 → text-embedding-3-large
│   │
│   └── 없다 (무료) → 오픈소스
│       ├── 영어만? → all-MiniLM-L6-v2 (빠름)
│       ├── 다국어? → multilingual-e5-large
│       └── 한국어? → ko-sroberta-multitask
│
├── 도메인 특수성이 있는가?
│   ├── 법률/의료 → Fine-tuning 고려
│   ├── 코드 → CodeBERT, text-embedding-3-large
│   └── 일반 → 범용 모델
│
└── 지연 시간 요구사항?
    ├── 실시간 (<100ms) → 로컬 모델 + 캐싱
    └── 배치 가능 → OpenAI API
\`\`\`

---

## 벤치마크: MTEB (Massive Text Embedding Benchmark)

\`\`\`
MTEB: 임베딩 모델 성능 평가 표준

7가지 태스크:
1. Retrieval (검색)
2. Semantic Textual Similarity (의미적 유사도)
3. Clustering (클러스터링)
4. Classification (분류)
5. Reranking (재순위)
6. Pair Classification (쌍 분류)
7. Summarization (요약)

2024년 상위 모델 (검색 태스크 기준):
1. text-embedding-3-large (OpenAI): 64.6
2. multilingual-e5-large-instruct: 62.4
3. text-embedding-3-small (OpenAI): 62.3
4. all-mpnet-base-v2: 57.8
\`\`\`

---

## 프로덕션 고려사항

### 1. 비용 계산

\`\`\`python
def calculate_embedding_cost():
    """
    예시: 100만 개 문서 (평균 500 토큰)
    """
    documents = 1_000_000
    avg_tokens = 500
    total_tokens = documents * avg_tokens  # 500M 토큰

    costs = {
        "text-embedding-3-small": total_tokens / 1_000_000 * 0.02,
        "text-embedding-3-large": total_tokens / 1_000_000 * 0.13,
        "ada-002 (legacy)": total_tokens / 1_000_000 * 0.10,
        "오픈소스": 0  # GPU 비용 별도
    }

    for model, cost in costs.items():
        print(f"{model}: \${cost:,.2f}")

# text-embedding-3-small: $10.00 ← 가성비!
# text-embedding-3-large: $65.00
# ada-002 (legacy): $50.00
\`\`\`

### 2. 지연 시간 비교

| 방식 | 지연 시간 | 장단점 |
|------|----------|--------|
| OpenAI API | 100-500ms | 간편, 네트워크 의존 |
| 로컬 CPU | 50-200ms | GPU 불필요, 중간 속도 |
| 로컬 GPU | 5-20ms | 빠름, GPU 필요 |
| 캐싱 | <1ms | 가장 빠름, 히트율 중요 |

### 3. 임베딩 캐싱 전략

\`\`\`python
import hashlib
import redis
import json
import numpy as np

class EmbeddingCache:
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis = redis.from_url(redis_url)
        self.ttl = 86400 * 30  # 30일

    def _hash_text(self, text: str, model: str) -> str:
        """텍스트와 모델 조합의 해시"""
        content = f"{model}:{text}"
        return hashlib.sha256(content.encode()).hexdigest()

    def get(self, text: str, model: str) -> np.ndarray | None:
        """캐시에서 임베딩 조회"""
        key = self._hash_text(text, model)
        cached = self.redis.get(key)
        if cached:
            return np.array(json.loads(cached))
        return None

    def set(self, text: str, model: str, embedding: list):
        """캐시에 임베딩 저장"""
        key = self._hash_text(text, model)
        self.redis.setex(key, self.ttl, json.dumps(embedding))

# 사용 예시
cache = EmbeddingCache()

def get_embedding_with_cache(text: str, model: str = "text-embedding-3-small"):
    # 1. 캐시 확인
    cached = cache.get(text, model)
    if cached is not None:
        return cached

    # 2. API 호출
    response = client.embeddings.create(model=model, input=text)
    embedding = response.data[0].embedding

    # 3. 캐시 저장
    cache.set(text, model, embedding)

    return embedding
\`\`\`
      `,
      keyPoints: [
        'text-embedding-3-small이 대부분의 RAG에 충분 (가성비 최고)',
        '한국어는 multilingual-e5 또는 ko-sroberta 추천',
        '임베딩 캐싱으로 비용과 지연시간 최적화',
      ],
      practiceGoal: '상황에 맞는 임베딩 모델을 선택할 수 있다',
    }),

    // ========================================
    // Task 3: 벡터 데이터베이스 심층 이해 (45분)
    // ========================================
    createReadingTask('w5d2-vectordb-deep', '벡터 데이터베이스 심층 이해', 45, {
      introduction: `
## 학습 목표
- 벡터 DB의 내부 동작 원리를 이해한다
- 주요 인덱싱 알고리즘을 비교한다
- 벡터 DB 선택 기준을 학습한다

---

## 벡터 데이터베이스란?

### 일반 DB vs 벡터 DB

\`\`\`
일반 데이터베이스 (PostgreSQL, MySQL):
- B-Tree 인덱스: 정확한 값 매칭
- 범위 쿼리: WHERE price > 100
- 텍스트 검색: LIKE '%keyword%'
❌ "비슷한 의미" 검색 불가

벡터 데이터베이스:
- ANN 인덱스: 근사 최근접 이웃 검색
- 유사도 쿼리: 가장 비슷한 K개 찾기
- 의미 검색: "행복" 검색 → "기쁨", "즐거움" 포함
✅ 의미적 유사성 기반 검색
\`\`\`

---

## 인덱싱 알고리즘 심층 분석

### 1. Flat Index (Brute Force)

\`\`\`
방법: 모든 벡터와 쿼리 벡터를 직접 비교

장점:
- 정확도 100% (정확한 최근접 이웃)
- 구현 간단

단점:
- O(n) 시간 복잡도
- 대규모 데이터에서 매우 느림

사용처:
- 10만 개 이하 데이터
- 정확도가 최우선인 경우
\`\`\`

### 2. IVF (Inverted File Index)

\`\`\`
방법: 벡터를 클러스터로 그룹화, 해당 클러스터만 검색

┌─────────────────────────────────────┐
│  ●   ●      ●●  ●    ●   ●        │
│    ●  ╔═══╗ ●      ╔═══╗    ●     │
│  ●    ║ C1║   ●    ║ C2║  ●   ●   │
│     ● ╚═══╝  ●  ●  ╚═══╝     ●    │
│   ●   ●   ●     ●    ●   ●   ●    │
└─────────────────────────────────────┘

검색 과정:
1. 쿼리 벡터가 속할 클러스터 찾기 (nprobe개)
2. 해당 클러스터 내 벡터만 비교

파라미터:
- nlist: 클러스터 개수 (보통 √n)
- nprobe: 검색할 클러스터 수 (정확도↔속도 트레이드오프)
\`\`\`

\`\`\`python
import faiss
import numpy as np

# IVF 인덱스 생성
dimension = 1536
nlist = 100  # 100개 클러스터

# 양자화기 + IVF
quantizer = faiss.IndexFlatL2(dimension)
index = faiss.IndexIVFFlat(quantizer, dimension, nlist)

# 학습 필요 (클러스터 중심점 계산)
vectors = np.random.rand(10000, dimension).astype('float32')
index.train(vectors)
index.add(vectors)

# 검색
index.nprobe = 10  # 10개 클러스터 검색
D, I = index.search(query_vector, k=5)
\`\`\`

### 3. HNSW (Hierarchical Navigable Small World)

\`\`\`
방법: 다층 그래프 구조로 효율적인 탐색

Layer 2 (sparse):    ●───────────────●
                      ╲             ╱
Layer 1 (medium):  ●───●───●───●───●
                    ╲ ╱ ╲ ╱ ╲ ╱ ╲ ╱
Layer 0 (dense):  ●●●●●●●●●●●●●●●●●

검색 과정:
1. 최상위 레이어에서 시작
2. 그래프 엣지 따라 이동
3. 하위 레이어로 내려가며 정밀 탐색

장점:
- 매우 빠른 검색 (O(log n))
- 높은 재현율 (recall)
- 동적 추가 가능

단점:
- 메모리 사용량 높음 (그래프 저장)
- 삭제 어려움
\`\`\`

\`\`\`python
# HNSW 인덱스 (FAISS)
index = faiss.IndexHNSWFlat(dimension, M=32)
# M: 각 노드의 연결 수 (높을수록 정확, 느림)

# HNSW 인덱스 (Chroma 기본값)
# Chroma는 내부적으로 HNSW 사용
\`\`\`

### 4. PQ (Product Quantization)

\`\`\`
방법: 벡터를 서브벡터로 분할 후 양자화

원본: [0.12, -0.34, 0.56, 0.78, -0.23, 0.45, 0.67, -0.89]
       └── sub1 ──┘  └── sub2 ──┘  └── sub3 ──┘  └── sub4 ──┘
                ↓         ↓           ↓           ↓
양자화:      [code1]   [code2]     [code3]     [code4]
               ↓         ↓           ↓           ↓
결과:        [42,       17,         89,         3]

장점:
- 메모리 90% 절약 (1536D float → 수십 바이트)
- 수십억 벡터 처리 가능

단점:
- 정확도 손실 (근사)
- 학습 필요
\`\`\`

### 인덱싱 알고리즘 비교표

| 알고리즘 | 속도 | 정확도 | 메모리 | 동적 추가 | 사용처 |
|----------|------|--------|--------|----------|--------|
| Flat | ⚡ | 💯100% | 📊높음 | ✅ | <10만 |
| IVF | ⚡⚡ | 95-99% | 📊중간 | ❌ (재학습) | 10만-1000만 |
| HNSW | ⚡⚡⚡ | 95-99% | 📊높음 | ✅ | 100만-1억 |
| PQ | ⚡⚡ | 85-95% | 📊낮음 | ❌ (재학습) | 1억+ |
| IVF+PQ | ⚡⚡⚡ | 90-95% | 📊매우낮음 | ❌ | 10억+ |

---

## 주요 벡터 데이터베이스 비교

### 1. Chroma

\`\`\`
유형: 임베디드/로컬
인덱싱: HNSW
특징:
- 설치 없이 시작 (pip install chromadb)
- LangChain 완벽 통합
- 영구 저장 지원

사용처: 프로토타이핑, 소규모 프로덕션
가격: 무료 (오픈소스)
\`\`\`

### 2. Pinecone

\`\`\`
유형: 관리형 클라우드
인덱싱: 독자 알고리즘 (최적화된 HNSW)
특징:
- 서버리스 옵션
- 수십억 벡터 지원
- 99.9% SLA

사용처: 대규모 프로덕션
가격: Free tier (100K 벡터) + $0.096/1M 벡터/월
\`\`\`

### 3. Weaviate

\`\`\`
유형: 오픈소스/클라우드
인덱싱: HNSW
특징:
- GraphQL API
- 자체 임베딩 생성 가능
- 멀티모달 지원

사용처: GraphQL 선호, 멀티모달
가격: 무료 (셀프호스트) / 클라우드 유료
\`\`\`

### 4. Qdrant

\`\`\`
유형: 오픈소스/클라우드
인덱싱: HNSW + 양자화
특징:
- Rust 기반 고성능
- 풍부한 필터링
- gRPC 지원

사용처: 고성능 요구, 복잡한 필터링
가격: 무료 (셀프호스트) / 클라우드 유료
\`\`\`

### 5. pgvector (PostgreSQL 확장)

\`\`\`
유형: PostgreSQL 확장
인덱싱: IVFFlat, HNSW
특징:
- 기존 PostgreSQL 활용
- SQL로 벡터 검색
- ACID 보장

사용처: 이미 PostgreSQL 사용 중
가격: 무료 (오픈소스)
\`\`\`

\`\`\`sql
-- pgvector 예시
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(1536)
);

CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

-- 유사 문서 검색
SELECT id, content, 1 - (embedding <=> query_embedding) AS similarity
FROM documents
ORDER BY embedding <=> query_embedding
LIMIT 5;
\`\`\`

---

## 벡터 DB 선택 의사결정 트리

\`\`\`
시작
├── 이미 PostgreSQL 사용 중?
│   └── Yes → pgvector (기존 인프라 활용)
│
├── 프로토타이핑 단계?
│   └── Yes → Chroma (가장 쉬운 시작)
│
├── 관리 부담 최소화?
│   └── Yes → Pinecone (완전 관리형)
│
├── 고성능 + 복잡한 필터링?
│   └── Yes → Qdrant
│
├── GraphQL 선호?
│   └── Yes → Weaviate
│
└── 최대 확장성 + 셀프호스트?
    └── Yes → Milvus
\`\`\`
      `,
      keyPoints: [
        'HNSW: 대부분의 사용 사례에 최적 (빠르고 정확)',
        '데이터 규모에 따라 인덱싱 알고리즘 선택',
        'Chroma(프로토타입) → Pinecone(프로덕션) 성장 경로',
      ],
      practiceGoal: '벡터 DB의 내부 동작과 선택 기준을 이해한다',
    }),

    // ========================================
    // Task 4: Chroma 프로덕션 패턴 (50분)
    // ========================================
    createCodeTask('w5d2-chroma-production', 'Chroma 프로덕션 패턴 실습', 50, {
      introduction: `
## 학습 목표
- Chroma를 프로덕션 환경에서 사용하는 방법을 학습한다
- 영구 저장, 메타데이터 필터링, 배치 처리를 구현한다
- LangChain과 통합하여 RAG 시스템을 구축한다

---

## 설치 및 기본 설정

\`\`\`bash
pip install chromadb langchain-chroma langchain-openai
\`\`\`

---

## Chroma 클라이언트 모드

\`\`\`python
import chromadb
from chromadb.config import Settings

# 1. 인메모리 (개발/테스트용)
client_memory = chromadb.Client()

# 2. 영구 저장 (프로덕션 권장)
client_persistent = chromadb.PersistentClient(
    path="./chroma_db",
    settings=Settings(
        anonymized_telemetry=False,  # 텔레메트리 비활성화
        allow_reset=True  # 리셋 허용 (개발 시)
    )
)

# 3. 클라이언트-서버 모드 (분산 환경)
client_http = chromadb.HttpClient(
    host="localhost",
    port=8000,
    settings=Settings(
        chroma_client_auth_provider="chromadb.auth.token.TokenAuthClientProvider",
        chroma_client_auth_credentials="your-token"
    )
)
\`\`\`

---

## 프로덕션급 벡터 저장소 클래스

\`\`\`python
from dataclasses import dataclass
from typing import Optional
import chromadb
from chromadb.utils import embedding_functions
from openai import OpenAI
import hashlib
import json

@dataclass
class Document:
    """문서 데이터 클래스"""
    id: str
    content: str
    metadata: dict

class ChromaVectorStore:
    """프로덕션급 Chroma 벡터 저장소"""

    def __init__(
        self,
        collection_name: str,
        persist_directory: str = "./chroma_db",
        embedding_model: str = "text-embedding-3-small"
    ):
        # Chroma 클라이언트
        self.client = chromadb.PersistentClient(path=persist_directory)

        # OpenAI 임베딩 함수
        self.embedding_fn = embedding_functions.OpenAIEmbeddingFunction(
            model_name=embedding_model
        )

        # 컬렉션 생성 또는 로드
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=self.embedding_fn,
            metadata={
                "description": f"RAG collection: {collection_name}",
                "embedding_model": embedding_model,
                "hnsw:space": "cosine"  # 유사도 측정 방식
            }
        )

    def _generate_id(self, content: str) -> str:
        """콘텐츠 기반 ID 생성 (중복 방지)"""
        return hashlib.sha256(content.encode()).hexdigest()[:16]

    def add_documents(
        self,
        documents: list[Document],
        batch_size: int = 100
    ) -> int:
        """문서 배치 추가"""
        added = 0

        for i in range(0, len(documents), batch_size):
            batch = documents[i:i + batch_size]

            ids = [doc.id or self._generate_id(doc.content) for doc in batch]
            contents = [doc.content for doc in batch]
            metadatas = [doc.metadata for doc in batch]

            # 중복 체크
            existing = self.collection.get(ids=ids)
            new_indices = [
                j for j, id_ in enumerate(ids)
                if id_ not in existing['ids']
            ]

            if new_indices:
                self.collection.add(
                    ids=[ids[j] for j in new_indices],
                    documents=[contents[j] for j in new_indices],
                    metadatas=[metadatas[j] for j in new_indices]
                )
                added += len(new_indices)

            print(f"Progress: {min(i + batch_size, len(documents))}/{len(documents)}")

        return added

    def search(
        self,
        query: str,
        k: int = 5,
        filter: Optional[dict] = None,
        include_distances: bool = True
    ) -> list[dict]:
        """유사 문서 검색"""
        results = self.collection.query(
            query_texts=[query],
            n_results=k,
            where=filter,
            include=["documents", "metadatas", "distances"]
        )

        # 결과 포맷팅
        formatted = []
        for i in range(len(results['ids'][0])):
            doc = {
                "id": results['ids'][0][i],
                "content": results['documents'][0][i],
                "metadata": results['metadatas'][0][i]
            }
            if include_distances:
                doc["distance"] = results['distances'][0][i]
                doc["similarity"] = 1 - results['distances'][0][i]  # cosine → 유사도
            formatted.append(doc)

        return formatted

    def search_with_filter(
        self,
        query: str,
        k: int = 5,
        category: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> list[dict]:
        """복잡한 필터 조건으로 검색"""
        where_conditions = []

        if category:
            where_conditions.append({"category": {"$eq": category}})

        if date_from:
            where_conditions.append({"date": {"$gte": date_from}})

        if date_to:
            where_conditions.append({"date": {"$lte": date_to}})

        # 조건 조합
        filter_dict = None
        if len(where_conditions) == 1:
            filter_dict = where_conditions[0]
        elif len(where_conditions) > 1:
            filter_dict = {"$and": where_conditions}

        return self.search(query, k=k, filter=filter_dict)

    def delete(self, ids: list[str]) -> int:
        """문서 삭제"""
        existing = self.collection.get(ids=ids)
        valid_ids = existing['ids']
        if valid_ids:
            self.collection.delete(ids=valid_ids)
        return len(valid_ids)

    def get_stats(self) -> dict:
        """컬렉션 통계"""
        return {
            "name": self.collection.name,
            "count": self.collection.count(),
            "metadata": self.collection.metadata
        }
\`\`\`

---

## 사용 예시

\`\`\`python
# 1. 벡터 저장소 초기화
store = ChromaVectorStore(
    collection_name="tech_articles",
    persist_directory="./production_db"
)

# 2. 문서 추가
documents = [
    Document(
        id="doc1",
        content="RAG는 검색 증강 생성으로, LLM의 환각을 줄여줍니다.",
        metadata={"category": "AI", "date": "2024-01-15", "author": "홍길동"}
    ),
    Document(
        id="doc2",
        content="벡터 데이터베이스는 고차원 벡터를 효율적으로 검색합니다.",
        metadata={"category": "DB", "date": "2024-01-20", "author": "김철수"}
    ),
    Document(
        id="doc3",
        content="LangChain은 LLM 애플리케이션 개발 프레임워크입니다.",
        metadata={"category": "AI", "date": "2024-02-01", "author": "이영희"}
    )
]

added = store.add_documents(documents)
print(f"추가된 문서: {added}개")

# 3. 기본 검색
results = store.search("LLM 환각 방지 기술", k=2)
for r in results:
    print(f"[{r['similarity']:.2%}] {r['content'][:50]}...")

# 4. 필터 검색
ai_results = store.search_with_filter(
    query="인공지능 기술",
    k=5,
    category="AI",
    date_from="2024-01-01"
)

# 5. 통계 확인
stats = store.get_stats()
print(f"컬렉션: {stats['name']}, 문서 수: {stats['count']}")
\`\`\`

---

## LangChain 통합

\`\`\`python
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.schema import Document as LCDocument
from langchain.chains import RetrievalQA

# 1. 임베딩 & 벡터스토어
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

vectorstore = Chroma(
    collection_name="langchain_demo",
    embedding_function=embeddings,
    persist_directory="./langchain_chroma"
)

# 2. 문서 추가
docs = [
    LCDocument(
        page_content="RAG 시스템은 검색과 생성을 결합합니다.",
        metadata={"source": "tutorial", "page": 1}
    ),
    LCDocument(
        page_content="임베딩은 텍스트를 벡터로 변환합니다.",
        metadata={"source": "tutorial", "page": 2}
    )
]

vectorstore.add_documents(docs)

# 3. Retriever 생성
retriever = vectorstore.as_retriever(
    search_type="mmr",  # Maximum Marginal Relevance (다양성 고려)
    search_kwargs={
        "k": 5,
        "fetch_k": 20,  # MMR 후보군
        "lambda_mult": 0.5  # 다양성 가중치
    }
)

# 4. QA 체인
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True
)

# 5. 질의
result = qa_chain.invoke({"query": "RAG와 임베딩의 관계는?"})
print(f"답변: {result['result']}")
print(f"참조: {[doc.metadata for doc in result['source_documents']]}")
\`\`\`

---

## Chroma 서버 모드 (분산 환경)

\`\`\`bash
# 서버 시작
chroma run --path ./chroma_server_data --port 8000

# Docker로 실행
docker run -p 8000:8000 -v ./chroma_data:/chroma/chroma chromadb/chroma
\`\`\`

\`\`\`python
# 클라이언트에서 연결
import chromadb

client = chromadb.HttpClient(host="localhost", port=8000)
collection = client.get_or_create_collection("my_collection")
\`\`\`
      `,
      keyPoints: [
        'PersistentClient로 영구 저장',
        '메타데이터 필터링으로 정밀 검색',
        'LangChain 통합으로 RAG 파이프라인 구축',
      ],
      practiceGoal: 'Chroma를 프로덕션 수준으로 활용할 수 있다',
    }),

    // ========================================
    // Task 5: Pinecone 프로덕션 패턴 (50분)
    // ========================================
    createCodeTask('w5d2-pinecone-production', 'Pinecone 프로덕션 패턴 실습', 50, {
      introduction: `
## 학습 목표
- Pinecone을 대규모 프로덕션 환경에서 사용하는 방법을 학습한다
- 네임스페이스, 메타데이터 필터링, 배치 업서트를 구현한다
- 하이브리드 검색 (Dense + Sparse)을 이해한다

---

## Pinecone 계정 설정

\`\`\`
1. https://www.pinecone.io 가입
2. 새 프로젝트 생성
3. API 키 발급 (Settings → API Keys)
4. 환경 변수 설정

export PINECONE_API_KEY="your-api-key"
\`\`\`

---

## 설치 및 기본 설정

\`\`\`bash
pip install pinecone-client langchain-pinecone
\`\`\`

---

## 프로덕션급 Pinecone 벡터 저장소

\`\`\`python
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
from dataclasses import dataclass
from typing import Optional
import hashlib
import os
import time

@dataclass
class PineconeDocument:
    """문서 데이터 클래스"""
    id: str
    content: str
    metadata: dict
    embedding: Optional[list[float]] = None

class PineconeVectorStore:
    """프로덕션급 Pinecone 벡터 저장소"""

    def __init__(
        self,
        index_name: str,
        dimension: int = 1536,
        metric: str = "cosine",
        create_if_not_exists: bool = True
    ):
        # 클라이언트 초기화
        self.pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
        self.openai = OpenAI()
        self.dimension = dimension
        self.index_name = index_name

        # 인덱스 생성 또는 연결
        if create_if_not_exists:
            self._ensure_index(metric)

        self.index = self.pc.Index(index_name)

    def _ensure_index(self, metric: str):
        """인덱스가 없으면 생성"""
        existing = [idx.name for idx in self.pc.list_indexes()]

        if self.index_name not in existing:
            print(f"Creating index: {self.index_name}")
            self.pc.create_index(
                name=self.index_name,
                dimension=self.dimension,
                metric=metric,
                spec=ServerlessSpec(
                    cloud="aws",
                    region="us-east-1"
                )
            )
            # 인덱스 준비 대기
            while not self.pc.describe_index(self.index_name).status['ready']:
                time.sleep(1)
            print(f"Index {self.index_name} ready!")

    def _get_embedding(self, text: str) -> list[float]:
        """OpenAI 임베딩 생성"""
        response = self.openai.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding

    def _get_embeddings_batch(self, texts: list[str]) -> list[list[float]]:
        """배치 임베딩 생성"""
        response = self.openai.embeddings.create(
            model="text-embedding-3-small",
            input=texts
        )
        return [item.embedding for item in response.data]

    def upsert_documents(
        self,
        documents: list[PineconeDocument],
        namespace: str = "",
        batch_size: int = 100
    ) -> int:
        """문서 배치 업서트"""
        total_upserted = 0

        for i in range(0, len(documents), batch_size):
            batch = documents[i:i + batch_size]

            # 임베딩이 없는 문서는 생성
            texts_to_embed = [
                (j, doc.content)
                for j, doc in enumerate(batch)
                if doc.embedding is None
            ]

            if texts_to_embed:
                indices, texts = zip(*texts_to_embed)
                embeddings = self._get_embeddings_batch(list(texts))
                for idx, emb in zip(indices, embeddings):
                    batch[idx].embedding = emb

            # 업서트 벡터 준비
            vectors = [
                {
                    "id": doc.id,
                    "values": doc.embedding,
                    "metadata": {
                        "content": doc.content[:1000],  # 메타데이터 크기 제한
                        **doc.metadata
                    }
                }
                for doc in batch
            ]

            # 업서트
            self.index.upsert(vectors=vectors, namespace=namespace)
            total_upserted += len(vectors)
            print(f"Progress: {min(i + batch_size, len(documents))}/{len(documents)}")

        return total_upserted

    def search(
        self,
        query: str,
        k: int = 5,
        namespace: str = "",
        filter: Optional[dict] = None,
        include_metadata: bool = True
    ) -> list[dict]:
        """유사 문서 검색"""
        # 쿼리 임베딩
        query_embedding = self._get_embedding(query)

        # 검색
        results = self.index.query(
            vector=query_embedding,
            top_k=k,
            namespace=namespace,
            filter=filter,
            include_values=False,
            include_metadata=include_metadata
        )

        # 결과 포맷팅
        formatted = []
        for match in results.matches:
            doc = {
                "id": match.id,
                "score": match.score,
                "content": match.metadata.get("content", ""),
                "metadata": {
                    k: v for k, v in match.metadata.items()
                    if k != "content"
                }
            }
            formatted.append(doc)

        return formatted

    def search_with_filter(
        self,
        query: str,
        k: int = 5,
        namespace: str = "",
        category: Optional[str] = None,
        date_from: Optional[str] = None,
        min_score: Optional[float] = None
    ) -> list[dict]:
        """복잡한 필터 조건으로 검색"""
        filter_conditions = {}

        if category:
            filter_conditions["category"] = {"$eq": category}

        if date_from:
            filter_conditions["date"] = {"$gte": date_from}

        results = self.search(
            query=query,
            k=k * 2 if min_score else k,  # 필터링 여유분
            namespace=namespace,
            filter=filter_conditions if filter_conditions else None
        )

        # 최소 점수 필터링
        if min_score:
            results = [r for r in results if r["score"] >= min_score][:k]

        return results

    def delete(
        self,
        ids: Optional[list[str]] = None,
        namespace: str = "",
        delete_all: bool = False
    ):
        """벡터 삭제"""
        if delete_all:
            self.index.delete(delete_all=True, namespace=namespace)
        elif ids:
            self.index.delete(ids=ids, namespace=namespace)

    def get_stats(self) -> dict:
        """인덱스 통계"""
        return self.index.describe_index_stats()
\`\`\`

---

## 네임스페이스 활용

\`\`\`python
# 네임스페이스: 동일 인덱스 내 논리적 분리

store = PineconeVectorStore(index_name="multi-tenant-app")

# 고객별 네임스페이스
store.upsert_documents(customer_a_docs, namespace="customer_a")
store.upsert_documents(customer_b_docs, namespace="customer_b")

# 고객 A의 문서만 검색
results_a = store.search("질문", namespace="customer_a")

# 고객 B의 문서만 검색
results_b = store.search("질문", namespace="customer_b")

# 네임스페이스별 통계
stats = store.get_stats()
for ns, ns_stats in stats['namespaces'].items():
    print(f"Namespace {ns}: {ns_stats['vector_count']} vectors")
\`\`\`

---

## 사용 예시

\`\`\`python
# 1. 벡터 저장소 초기화
store = PineconeVectorStore(
    index_name="rag-production",
    dimension=1536
)

# 2. 문서 추가
documents = [
    PineconeDocument(
        id="doc1",
        content="RAG는 검색 증강 생성으로, 외부 지식을 활용합니다.",
        metadata={"category": "AI", "date": "2024-01-15", "source": "blog"}
    ),
    PineconeDocument(
        id="doc2",
        content="Pinecone은 대규모 벡터 검색에 최적화된 데이터베이스입니다.",
        metadata={"category": "DB", "date": "2024-01-20", "source": "docs"}
    ),
    PineconeDocument(
        id="doc3",
        content="하이브리드 검색은 키워드와 의미 검색을 결합합니다.",
        metadata={"category": "AI", "date": "2024-02-01", "source": "paper"}
    )
]

store.upsert_documents(documents)

# 3. 기본 검색
results = store.search("벡터 데이터베이스란?", k=2)
for r in results:
    print(f"[{r['score']:.3f}] {r['content'][:50]}...")

# 4. 필터 검색
ai_results = store.search_with_filter(
    query="검색 기술",
    k=5,
    category="AI",
    min_score=0.7
)

# 5. 통계
stats = store.get_stats()
print(f"총 벡터 수: {stats['total_vector_count']}")
\`\`\`

---

## LangChain 통합

\`\`\`python
from langchain_pinecone import PineconeVectorStore as LCPinecone
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.schema import Document
from langchain.chains import RetrievalQA

# 1. 임베딩 & 벡터스토어
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

vectorstore = LCPinecone.from_existing_index(
    index_name="rag-production",
    embedding=embeddings,
    namespace="langchain"
)

# 또는 새로 생성
docs = [
    Document(
        page_content="Pinecone과 LangChain의 통합은 간단합니다.",
        metadata={"source": "tutorial"}
    )
]

vectorstore = LCPinecone.from_documents(
    docs,
    embeddings,
    index_name="rag-production",
    namespace="langchain"
)

# 2. Retriever
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5}
)

# 3. QA 체인
qa = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4o-mini"),
    retriever=retriever
)

answer = qa.invoke("Pinecone과 LangChain을 어떻게 통합하나요?")
\`\`\`

---

## Chroma vs Pinecone 최종 비교

| 항목 | Chroma | Pinecone |
|------|--------|----------|
| **타입** | 로컬/임베디드 | 관리형 클라우드 |
| **확장성** | ~100만 벡터 | 수십억 벡터 |
| **시작** | pip install | 계정 생성 필요 |
| **비용** | 무료 | Free tier + 유료 |
| **운영** | 직접 관리 | 완전 관리형 |
| **사용처** | 프로토타입, 소규모 | 대규모 프로덕션 |
| **성장 경로** | 개발 → Pinecone 이전 | 바로 프로덕션 |
      `,
      keyPoints: [
        'Pinecone은 대규모 프로덕션에 최적화된 관리형 서비스',
        '네임스페이스로 멀티테넌트 구현',
        'LangChain 통합으로 빠른 RAG 구축',
      ],
      practiceGoal: 'Pinecone을 프로덕션 수준으로 활용할 수 있다',
    }),

    // ========================================
    // Task 6: Day 2 종합 퀴즈 (20분)
    // ========================================
    createQuizTask('w5d2-quiz', 'Day 2 종합 퀴즈', 20, {
      introduction: `
## 퀴즈 안내

Day 2에서 학습한 임베딩과 벡터 데이터베이스 개념을 확인합니다.
각 문제를 신중하게 읽고 답변해주세요.
      `,
      questions: [
        {
          id: 'w5d2-q1',
          question: 'Word2Vec의 "King - Man + Woman = Queen" 예시가 보여주는 임베딩의 특성은?',
          options: [
            '텍스트 압축 효율성',
            '벡터 공간에서의 의미적 연산 가능성',
            '문법 오류 검출 능력',
            '다국어 번역 정확도',
          ],
          correctAnswer: 1,
          explanation: 'Word2Vec 임베딩은 벡터 공간에서 의미적 관계를 산술 연산으로 표현할 수 있습니다. "King - Man + Woman ≈ Queen"은 성별 관계가 벡터 연산으로 표현됨을 보여줍니다.',
        },
        {
          id: 'w5d2-q2',
          question: '코사인 유사도의 장점으로 올바른 것은?',
          options: [
            '계산이 유클리드 거리보다 느림',
            '텍스트 길이(벡터 크기)에 영향받지 않음',
            '음수 값을 반환하지 않음',
            '정수만 반환하여 비교가 쉬움',
          ],
          correctAnswer: 1,
          explanation: '코사인 유사도는 벡터의 방향만 비교하므로, 텍스트 길이(벡터 크기)에 무관합니다. 짧은 문장과 긴 문장도 의미가 같으면 높은 유사도를 가집니다.',
        },
        {
          id: 'w5d2-q3',
          question: 'HNSW 인덱싱 알고리즘의 주요 특징은?',
          options: [
            '정확도 100%, 가장 느림',
            '클러스터 기반, 재학습 필요',
            '그래프 기반, 빠르고 동적 추가 가능',
            '압축 기반, 메모리 최소화',
          ],
          correctAnswer: 2,
          explanation: 'HNSW(Hierarchical Navigable Small World)는 다층 그래프 구조로 O(log n) 시간에 검색하며, 새 벡터를 동적으로 추가할 수 있습니다.',
        },
        {
          id: 'w5d2-q4',
          question: 'OpenAI text-embedding-3-small과 text-embedding-3-large의 주요 차이점은?',
          options: [
            'small은 영어만, large는 다국어 지원',
            'small은 1536차원, large는 3072차원',
            'small은 무료, large는 유료',
            'small은 CPU, large는 GPU 필요',
          ],
          correctAnswer: 1,
          explanation: 'text-embedding-3-small은 1536차원, large는 3072차원 벡터를 생성합니다. large는 더 높은 품질이지만 비용이 약 6.5배 높습니다.',
        },
        {
          id: 'w5d2-q5',
          question: 'Chroma와 Pinecone의 가장 큰 차이점은?',
          options: [
            'Chroma는 Python, Pinecone은 JavaScript',
            'Chroma는 로컬/임베디드, Pinecone은 관리형 클라우드',
            'Chroma는 HNSW, Pinecone은 IVF 사용',
            'Chroma는 유료, Pinecone은 무료',
          ],
          correctAnswer: 1,
          explanation: 'Chroma는 로컬/임베디드로 프로토타이핑에 적합하고, Pinecone은 관리형 클라우드로 대규모 프로덕션에 최적화되어 있습니다.',
        },
      ],
      keyPoints: [
        'Word2Vec: 벡터 공간에서 의미적 연산 가능',
        '코사인 유사도: 벡터 크기 무관, 방향만 비교',
        'HNSW: 그래프 기반, 빠르고 동적 추가 가능',
      ],
      practiceGoal: 'Day 2 핵심 개념을 이해했는지 확인한다',
    }),

    // ========================================
    // Challenge: 임베딩 성능 벤치마크 시스템 구축 (60분)
    // ========================================
    createChallengeTask('w5d2-challenge', '임베딩 성능 벤치마크 시스템 구축', 60, {
      introduction: `
## 챌린지 시나리오

당신은 AI 스타트업의 데이터 엔지니어입니다. 회사는 RAG 시스템을 구축하려 하는데,
어떤 임베딩 모델과 벡터 DB 조합이 최적인지 결정해야 합니다.

**요구사항:**
1. 3가지 이상의 임베딩 모델 비교
2. Chroma와 Pinecone 성능 비교
3. 비용, 속도, 정확도 측정
4. 최종 권장 사항 도출

---

## 평가 기준

| 항목 | 배점 | 기준 |
|------|------|------|
| 임베딩 모델 비교 | 25점 | 3개 이상 모델 테스트 |
| 벡터 DB 비교 | 25점 | Chroma, Pinecone 동일 조건 비교 |
| 측정 지표 | 25점 | 속도, 정확도, 비용 모두 측정 |
| 분석 보고서 | 25점 | 결과 해석 및 권장 사항 |

---

## 테스트 데이터셋

\`\`\`python
# 한국어 RAG 테스트용 샘플 데이터
SAMPLE_DOCUMENTS = [
    "인공지능(AI)은 기계가 인간의 지능을 모방하는 기술입니다.",
    "머신러닝은 데이터에서 패턴을 학습하는 AI의 하위 분야입니다.",
    "딥러닝은 인공 신경망을 사용한 머신러닝 기법입니다.",
    "자연어처리(NLP)는 컴퓨터가 인간 언어를 이해하는 분야입니다.",
    "RAG는 검색 증강 생성으로 LLM의 환각을 줄여줍니다.",
    "벡터 데이터베이스는 고차원 벡터를 효율적으로 검색합니다.",
    "임베딩은 텍스트를 수치 벡터로 변환하는 기술입니다.",
    "Transformer는 어텐션 메커니즘 기반의 딥러닝 아키텍처입니다.",
    "GPT는 생성형 사전학습 Transformer 모델입니다.",
    "BERT는 양방향 인코더 기반 언어 모델입니다."
]

SAMPLE_QUERIES = [
    ("AI 기술이란?", 0),  # 정답 인덱스
    ("머신러닝과 딥러닝의 관계는?", 1),
    ("언어 모델의 종류는?", 8),
    ("검색 기반 AI 기술은?", 4),
    ("벡터 검색이란?", 5)
]
\`\`\`
      `,
      keyPoints: [
        '3개 이상의 임베딩 모델 테스트 (OpenAI, 오픈소스 등)',
        'Chroma와 Pinecone에서 동일 데이터로 비교',
        '검색 속도(ms), 정확도(Top-1/Top-5), 비용($) 측정',
        '결과 분석 및 최종 권장 사항 보고서 작성',
      ],
      hints: [
        `**프로젝트 구조**: embedding-benchmark/ 폴더에 config.py, embeddings.py, vectorstores.py, benchmark.py, report.py, main.py 구성`,
        `**임베딩 모델 래퍼**: OpenAI와 로컬 모델(SentenceTransformer)을 통합 인터페이스로 래핑하여 embed(texts) 함수로 일관된 API 제공`,
        `**벤치마크 측정 항목**: 임베딩 생성 시간, 검색 시간, Top-1/Top-5 정확도, 비용 추정`,
        `**권장 조합**: 프로토타입은 text-embedding-3-small + Chroma, 프로덕션은 Pinecone 사용`,
      ],
    }),
  ],
}
