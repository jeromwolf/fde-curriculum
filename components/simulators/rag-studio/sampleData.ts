// RAG Studio 샘플 데이터

import { SampleDataset, Document, Chunk, RAGConfig } from './types'

// 기본 RAG 설정
export const defaultConfig: RAGConfig = {
  chunkingStrategy: 'recursive',
  chunkSize: 500,
  chunkOverlap: 50,
  embeddingModel: 'text-embedding-3-small',
  retrievalMethod: 'similarity',
  topK: 3,
  similarityThreshold: 0.7,
}

// 청킹 전략 설명
export const chunkingStrategies = {
  'fixed-size': {
    name: '고정 크기',
    description: '문자 수 기준으로 균일하게 분할',
    pros: ['구현 간단', '예측 가능한 크기'],
    cons: ['문맥 단절 가능', '문장 중간 분할'],
  },
  'sentence': {
    name: '문장 단위',
    description: '문장 경계를 기준으로 분할',
    pros: ['문장 완결성 유지', '자연스러운 분할'],
    cons: ['크기 불균일', '긴 문장 처리 어려움'],
  },
  'paragraph': {
    name: '단락 단위',
    description: '단락(빈 줄)을 기준으로 분할',
    pros: ['주제별 분리', '문맥 유지'],
    cons: ['크기 편차 큼', '긴 단락 처리 필요'],
  },
  'semantic': {
    name: '의미 기반',
    description: '임베딩 유사도로 의미 단위 분할',
    pros: ['최적의 문맥 유지', '주제 일관성'],
    cons: ['계산 비용 높음', '복잡한 구현'],
  },
  'recursive': {
    name: '재귀적 분할',
    description: '계층적 구분자로 재귀 분할 (\\n\\n → \\n → . → 공백)',
    pros: ['유연한 분할', '문맥 보존 양호'],
    cons: ['구분자 의존적', '설정 필요'],
  },
}

// 임베딩 모델 정보
export const embeddingModels = {
  'text-embedding-ada-002': {
    name: 'Ada 002',
    provider: 'OpenAI',
    dimensions: 1536,
    maxTokens: 8191,
    cost: '$0.0001/1K tokens',
  },
  'text-embedding-3-small': {
    name: 'Embedding 3 Small',
    provider: 'OpenAI',
    dimensions: 1536,
    maxTokens: 8191,
    cost: '$0.00002/1K tokens',
  },
  'text-embedding-3-large': {
    name: 'Embedding 3 Large',
    provider: 'OpenAI',
    dimensions: 3072,
    maxTokens: 8191,
    cost: '$0.00013/1K tokens',
  },
  'bge-small': {
    name: 'BGE Small',
    provider: 'BAAI (Open Source)',
    dimensions: 384,
    maxTokens: 512,
    cost: 'Free (Self-hosted)',
  },
  'bge-large': {
    name: 'BGE Large',
    provider: 'BAAI (Open Source)',
    dimensions: 1024,
    maxTokens: 512,
    cost: 'Free (Self-hosted)',
  },
}

// 검색 방법 설명
export const retrievalMethods = {
  'similarity': {
    name: '유사도 검색',
    description: '코사인 유사도 기반 최근접 이웃 검색',
    pros: ['직관적', '빠른 검색'],
    cons: ['중복 결과 가능'],
  },
  'mmr': {
    name: 'MMR (Maximal Marginal Relevance)',
    description: '관련성과 다양성의 균형',
    pros: ['다양한 결과', '중복 감소'],
    cons: ['계산 비용 증가'],
  },
  'hybrid': {
    name: '하이브리드',
    description: 'BM25 (키워드) + 벡터 검색 결합',
    pros: ['키워드 정확도 + 의미 검색'],
    cons: ['복잡한 구현', '가중치 튜닝 필요'],
  },
}

// 기술 문서 데이터셋
const techDataset: SampleDataset = {
  id: 'tech-docs',
  name: '기술 문서',
  description: 'AI/ML 및 데이터 엔지니어링 관련 기술 문서',
  category: 'tech',
  documents: [
    {
      id: 'doc-1',
      title: 'RAG 아키텍처 개요',
      content: `RAG(Retrieval-Augmented Generation)는 대규모 언어 모델의 한계를 극복하기 위한 기술입니다. LLM은 학습 데이터에 포함된 정보만 알고 있으며, 최신 정보나 특정 도메인 지식이 부족할 수 있습니다.

RAG는 이 문제를 해결하기 위해 외부 지식 베이스에서 관련 정보를 검색하여 LLM에 제공합니다. 이를 통해 모델은 더 정확하고 최신의 답변을 생성할 수 있습니다.

RAG 파이프라인의 주요 구성 요소는 다음과 같습니다:
1. 문서 로더: PDF, HTML, 텍스트 등 다양한 형식의 문서를 로드
2. 텍스트 분할기: 긴 문서를 적절한 크기의 청크로 분할
3. 임베딩 모델: 텍스트를 벡터로 변환
4. 벡터 저장소: 임베딩을 저장하고 검색하는 데이터베이스
5. 검색기: 쿼리와 관련된 청크를 찾는 컴포넌트
6. LLM: 검색된 컨텍스트를 활용하여 응답을 생성

RAG의 장점은 할루시네이션 감소, 최신 정보 활용, 도메인 특화 가능성입니다.`,
      metadata: {
        source: 'internal-wiki',
        category: 'architecture',
        date: '2024-01-15',
      },
    },
    {
      id: 'doc-2',
      title: '벡터 데이터베이스 비교',
      content: `벡터 데이터베이스는 고차원 벡터를 효율적으로 저장하고 검색하는 특수 데이터베이스입니다. RAG 시스템에서 임베딩 저장소로 핵심적인 역할을 합니다.

주요 벡터 데이터베이스 비교:

Pinecone:
- 완전 관리형 서비스로 운영 부담 없음
- 실시간 인덱싱과 빠른 쿼리 성능
- 메타데이터 필터링 지원
- 단점: 비용이 높을 수 있음

Weaviate:
- 오픈소스로 자체 호스팅 가능
- GraphQL API 지원
- 하이브리드 검색 (벡터 + 키워드) 내장
- 모듈식 아키텍처

Milvus:
- 대규모 데이터셋에 최적화
- 다양한 인덱스 알고리즘 지원 (IVF, HNSW, ANNOY)
- 분산 아키텍처로 확장성 우수
- Kubernetes 네이티브

Chroma:
- 경량화되어 개발/프로토타이핑에 적합
- Python 네이티브, LangChain 통합 용이
- 임베딩 함수 내장
- 단점: 대규모 프로덕션에는 제한적`,
      metadata: {
        source: 'tech-blog',
        category: 'database',
        date: '2024-02-20',
      },
    },
    {
      id: 'doc-3',
      title: '청킹 전략 가이드',
      content: `효과적인 RAG 시스템을 위한 청킹 전략은 매우 중요합니다. 잘못된 청킹은 검색 품질을 크게 저하시킬 수 있습니다.

고정 크기 청킹:
가장 단순한 방법으로, 문자 수나 토큰 수로 균일하게 분할합니다. 구현은 쉽지만 문장이나 단락 중간에서 분할될 수 있어 문맥이 손실될 수 있습니다.

문장 기반 청킹:
NLTK나 spaCy 같은 NLP 라이브러리를 사용하여 문장 경계에서 분할합니다. 문장의 완결성이 유지되지만, 문장 길이에 따라 청크 크기가 불균일해질 수 있습니다.

재귀적 청킹:
LangChain의 RecursiveCharacterTextSplitter가 대표적입니다. 단락, 문장, 단어 순으로 계층적으로 분할하여 원하는 크기에 맞춥니다. 대부분의 경우 좋은 결과를 제공합니다.

의미 기반 청킹:
임베딩을 사용하여 의미적으로 유사한 문장들을 그룹화합니다. 가장 정교하지만 계산 비용이 높습니다. 복잡한 문서에서 효과적입니다.

청크 오버랩:
인접 청크 간에 일부 내용을 중복시켜 문맥 손실을 방지합니다. 일반적으로 10-20% 오버랩을 권장합니다.`,
      metadata: {
        source: 'best-practices',
        category: 'technique',
        date: '2024-03-10',
      },
    },
    {
      id: 'doc-4',
      title: '프롬프트 엔지니어링 for RAG',
      content: `RAG 시스템에서 프롬프트 설계는 응답 품질에 직접적인 영향을 미칩니다. 검색된 컨텍스트를 효과적으로 활용하는 프롬프트를 만드는 것이 중요합니다.

기본 RAG 프롬프트 구조:
1. 시스템 지시: 모델의 역할과 응답 방식 정의
2. 컨텍스트 섹션: 검색된 문서 청크들
3. 사용자 질문: 원본 쿼리
4. 응답 가이드: 답변 형식과 제약 조건

예시 프롬프트:
"당신은 기술 문서 전문가입니다. 아래 컨텍스트를 참고하여 질문에 답변하세요.
컨텍스트에 없는 정보는 추측하지 말고, 정보가 없다고 말하세요.

컨텍스트:
{context}

질문: {question}

답변:"

고급 기법:
- Chain-of-Thought: 단계별 추론 유도
- Self-Consistency: 여러 응답 생성 후 일관성 확인
- Confidence Scoring: 답변의 확신도 요청
- Source Attribution: 출처 인용 요구`,
      metadata: {
        source: 'prompt-guide',
        category: 'technique',
        date: '2024-03-25',
      },
    },
  ],
  sampleQueries: [
    {
      id: 'q1',
      query: 'RAG 파이프라인의 구성 요소는 무엇인가요?',
      description: 'RAG 아키텍처 관련 질문',
      expectedTopics: ['문서 로더', '텍스트 분할기', '임베딩 모델', '벡터 저장소'],
    },
    {
      id: 'q2',
      query: '어떤 벡터 데이터베이스를 선택해야 하나요?',
      description: '벡터 DB 비교 질문',
      expectedTopics: ['Pinecone', 'Weaviate', 'Milvus', 'Chroma'],
    },
    {
      id: 'q3',
      query: '청킹할 때 오버랩은 얼마나 설정해야 하나요?',
      description: '청킹 전략 질문',
      expectedTopics: ['오버랩', '10-20%', '문맥 손실 방지'],
    },
    {
      id: 'q4',
      query: 'RAG 프롬프트는 어떻게 구성하나요?',
      description: '프롬프트 엔지니어링 질문',
      expectedTopics: ['시스템 지시', '컨텍스트', '질문', '응답 가이드'],
    },
  ],
}

// 금융 문서 데이터셋
const financeDataset: SampleDataset = {
  id: 'finance-docs',
  name: '금융 문서',
  description: '투자 및 재무 관련 문서',
  category: 'finance',
  documents: [
    {
      id: 'fin-1',
      title: '주식 투자 기초',
      content: `주식 투자는 기업의 소유권 일부를 구매하는 것입니다. 주식을 보유하면 배당금을 받을 수 있고, 주가 상승 시 시세차익을 얻을 수 있습니다.

주요 투자 지표:
- PER (주가수익비율): 주가를 주당순이익으로 나눈 값. 낮을수록 저평가
- PBR (주가순자산비율): 주가를 주당순자산으로 나눈 값
- ROE (자기자본이익률): 순이익을 자기자본으로 나눈 비율
- 배당수익률: 주당 배당금을 현재 주가로 나눈 비율

투자 전략:
1. 가치투자: 내재가치 대비 저평가된 주식 매수
2. 성장투자: 높은 성장 가능성 기업에 투자
3. 배당투자: 안정적인 배당을 제공하는 기업 선호
4. 인덱스 투자: 시장 지수를 추종하는 ETF 투자`,
      metadata: {
        source: 'investment-guide',
        category: 'stock',
        date: '2024-01-20',
      },
    },
    {
      id: 'fin-2',
      title: '포트폴리오 분산 전략',
      content: `포트폴리오 분산은 투자 위험을 줄이는 핵심 전략입니다. "달걀을 한 바구니에 담지 마라"는 격언이 이를 잘 표현합니다.

자산 배분의 원칙:
- 상관관계가 낮은 자산들을 조합
- 주식, 채권, 부동산, 원자재 등 다양한 자산군 포함
- 지역적 분산: 국내, 선진국, 신흥국
- 섹터별 분산: IT, 헬스케어, 금융, 소비재 등

현대 포트폴리오 이론(MPT):
해리 마코위츠가 개발한 이론으로, 기대수익 대비 위험을 최소화하는 최적의 포트폴리오를 구성합니다. 효율적 프론티어는 주어진 위험 수준에서 최대 수익을 제공하는 포트폴리오의 집합입니다.

리밸런싱:
시간이 지나면 자산별 비중이 변합니다. 정기적으로 목표 비중으로 조정하여 위험을 관리합니다. 일반적으로 분기별 또는 연간 리밸런싱을 권장합니다.`,
      metadata: {
        source: 'portfolio-guide',
        category: 'strategy',
        date: '2024-02-15',
      },
    },
  ],
  sampleQueries: [
    {
      id: 'fq1',
      query: 'PER이 낮으면 좋은 주식인가요?',
      description: '투자 지표 해석 질문',
      expectedTopics: ['PER', '주가수익비율', '저평가'],
    },
    {
      id: 'fq2',
      query: '포트폴리오 리밸런싱은 얼마나 자주 해야 하나요?',
      description: '포트폴리오 관리 질문',
      expectedTopics: ['리밸런싱', '분기별', '연간'],
    },
  ],
}

export const sampleDatasets: SampleDataset[] = [techDataset, financeDataset]

// 간단한 토큰 카운터 (실제로는 tiktoken 등 사용)
export function countTokens(text: string): number {
  // 대략적인 추정: 4자당 1토큰 (영어 기준)
  // 한글은 2자당 1토큰 정도
  const koreanChars = (text.match(/[가-힣]/g) || []).length
  const otherChars = text.length - koreanChars
  return Math.ceil(koreanChars / 2 + otherChars / 4)
}

// 텍스트 청킹 함수
export function chunkText(
  text: string,
  strategy: string,
  chunkSize: number,
  overlap: number
): { content: string; start: number; end: number }[] {
  const chunks: { content: string; start: number; end: number }[] = []

  if (strategy === 'fixed-size') {
    let start = 0
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length)
      chunks.push({
        content: text.slice(start, end),
        start,
        end,
      })
      start = end - overlap
      if (start >= text.length - overlap) break
    }
  } else if (strategy === 'sentence') {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    let currentChunk = ''
    let chunkStart = 0
    let currentStart = 0

    sentences.forEach((sentence, i) => {
      if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.trim(),
          start: chunkStart,
          end: currentStart,
        })
        // 오버랩을 위해 마지막 문장 유지
        currentChunk = sentence
        chunkStart = currentStart
      } else {
        currentChunk += sentence
      }
      currentStart += sentence.length
    })

    if (currentChunk.trim()) {
      chunks.push({
        content: currentChunk.trim(),
        start: chunkStart,
        end: text.length,
      })
    }
  } else if (strategy === 'paragraph') {
    const paragraphs = text.split(/\n\n+/)
    let currentStart = 0

    paragraphs.forEach((para) => {
      if (para.trim()) {
        chunks.push({
          content: para.trim(),
          start: currentStart,
          end: currentStart + para.length,
        })
      }
      currentStart += para.length + 2 // +2 for \n\n
    })
  } else {
    // recursive (default)
    const separators = ['\n\n', '\n', '. ', ' ']

    const splitRecursive = (text: string, separatorIndex: number, start: number): void => {
      if (text.length <= chunkSize || separatorIndex >= separators.length) {
        if (text.trim()) {
          chunks.push({
            content: text.trim(),
            start,
            end: start + text.length,
          })
        }
        return
      }

      const separator = separators[separatorIndex]
      const parts = text.split(separator)
      let currentChunk = ''
      let currentStart = start

      parts.forEach((part, i) => {
        const addition = i === 0 ? part : separator + part
        if (currentChunk.length + addition.length > chunkSize) {
          if (currentChunk.length > chunkSize) {
            splitRecursive(currentChunk, separatorIndex + 1, currentStart)
          } else if (currentChunk.trim()) {
            chunks.push({
              content: currentChunk.trim(),
              start: currentStart,
              end: currentStart + currentChunk.length,
            })
          }
          currentChunk = part
          currentStart = start + text.indexOf(part, currentStart - start)
        } else {
          currentChunk += addition
        }
      })

      if (currentChunk.trim()) {
        if (currentChunk.length > chunkSize) {
          splitRecursive(currentChunk, separatorIndex + 1, currentStart)
        } else {
          chunks.push({
            content: currentChunk.trim(),
            start: currentStart,
            end: currentStart + currentChunk.length,
          })
        }
      }
    }

    splitRecursive(text, 0, 0)
  }

  return chunks
}

// 간단한 유사도 계산 (실제로는 코사인 유사도 사용)
export function calculateSimilarity(query: string, text: string): number {
  const queryWords = new Set(query.toLowerCase().split(/\s+/))
  const textWords = text.toLowerCase().split(/\s+/)
  const textWordSet = new Set(textWords)

  let matchCount = 0
  queryWords.forEach((word) => {
    if (textWordSet.has(word)) matchCount++
  })

  // TF-IDF 스타일 가중치 추가
  const queryTerms = Array.from(queryWords)
  let weightedScore = 0
  queryTerms.forEach((term) => {
    const termFreq = textWords.filter((w) => w === term).length
    if (termFreq > 0) {
      weightedScore += Math.log(1 + termFreq) / Math.log(textWords.length + 1)
    }
  })

  const jaccard = matchCount / (queryWords.size + textWordSet.size - matchCount)
  return Math.min(1, (jaccard * 0.5 + weightedScore * 0.5) * 1.5 + Math.random() * 0.1)
}

// 프롬프트 생성
export function generatePrompt(query: string, contexts: string[]): string {
  const contextText = contexts.map((c, i) => `[${i + 1}] ${c}`).join('\n\n')

  return `당신은 기술 문서 전문가입니다. 아래 컨텍스트를 참고하여 질문에 정확하게 답변하세요.
컨텍스트에 없는 정보는 추측하지 말고, 정보가 부족하다고 말하세요.

### 컨텍스트:
${contextText}

### 질문:
${query}

### 답변:`
}

// 시뮬레이션된 LLM 응답 생성
export function generateSimulatedResponse(query: string, contexts: string[]): string {
  // 실제로는 LLM API 호출
  // 여기서는 컨텍스트 기반 간단한 응답 시뮬레이션

  const keywords = query.toLowerCase().split(/\s+/)
  const relevantInfo: string[] = []

  contexts.forEach((context) => {
    const sentences = context.split(/[.!?]+/)
    sentences.forEach((sentence) => {
      const sentenceLower = sentence.toLowerCase()
      if (keywords.some((kw) => sentenceLower.includes(kw))) {
        relevantInfo.push(sentence.trim())
      }
    })
  })

  if (relevantInfo.length === 0) {
    return '제공된 컨텍스트에서 해당 질문에 대한 직접적인 답변을 찾을 수 없습니다.'
  }

  // 상위 3개 관련 문장 조합
  const topInfo = relevantInfo.slice(0, 3)
  return `컨텍스트를 기반으로 답변드리겠습니다.\n\n${topInfo.join('. ')}.\n\n이 정보는 검색된 문서에서 추출되었습니다.`
}
