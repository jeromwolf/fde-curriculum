// RAG Pipeline Types

export interface Document {
  id: string
  title: string
  content: string
  source: string
}

export interface Chunk {
  id: string
  documentId: string
  text: string
  startIndex: number
  endIndex: number
  embedding?: number[] // 시뮬레이션용 간단한 벡터
}

export interface SearchResult {
  chunk: Chunk
  similarity: number
  documentTitle: string
}

export interface RAGPipelineStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed'
  input?: string
  output?: string
  duration?: number
}

export interface RAGScenario {
  id: string
  name: string
  description: string
  documents: Document[]
  sampleQueries: string[]
  chunkSize: number
  topK: number
}
