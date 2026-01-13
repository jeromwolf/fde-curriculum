// RAG Studio 타입 정의

export type ChunkingStrategy =
  | 'fixed-size'
  | 'sentence'
  | 'paragraph'
  | 'semantic'
  | 'recursive'

export type EmbeddingModel =
  | 'text-embedding-ada-002'
  | 'text-embedding-3-small'
  | 'text-embedding-3-large'
  | 'bge-small'
  | 'bge-large'

export type RetrievalMethod =
  | 'similarity'
  | 'mmr'  // Maximal Marginal Relevance
  | 'hybrid'  // BM25 + Vector

export interface Document {
  id: string
  title: string
  content: string
  metadata: {
    source: string
    category: string
    date?: string
    [key: string]: any
  }
}

export interface Chunk {
  id: string
  documentId: string
  content: string
  startIndex: number
  endIndex: number
  tokens: number
  embedding?: number[]  // 시뮬레이션용 간소화된 임베딩
}

export interface SearchResult {
  chunk: Chunk
  score: number
  highlight?: string
}

export interface RAGConfig {
  chunkingStrategy: ChunkingStrategy
  chunkSize: number
  chunkOverlap: number
  embeddingModel: EmbeddingModel
  retrievalMethod: RetrievalMethod
  topK: number
  similarityThreshold: number
}

export interface RAGPipeline {
  id: string
  name: string
  description: string
  config: RAGConfig
  documents: Document[]
  chunks: Chunk[]
}

export interface QueryResult {
  query: string
  retrievedChunks: SearchResult[]
  context: string
  prompt: string
  response: string
  processingSteps: ProcessingStep[]
}

export interface ProcessingStep {
  name: string
  description: string
  input: string
  output: string
  duration: number
}

export interface RAGStudioProps {
  showConfig?: boolean
  showVisualization?: boolean
  defaultPipeline?: string
}

export interface SampleQuery {
  id: string
  query: string
  description: string
  expectedTopics: string[]
}

export interface SampleDataset {
  id: string
  name: string
  description: string
  category: 'tech' | 'finance' | 'legal' | 'medical'
  documents: Document[]
  sampleQueries: SampleQuery[]
}
