// GraphRAG Pipeline Types

export interface PipelineStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'error'
  input?: string
  output?: string
  duration?: number
}

export interface Entity {
  id: string
  name: string
  type: 'person' | 'organization' | 'concept' | 'event' | 'location'
  properties?: Record<string, string>
}

export interface Relationship {
  source: string
  target: string
  type: string
  properties?: Record<string, string>
}

export interface GraphContext {
  entities: Entity[]
  relationships: Relationship[]
  textChunks: string[]
}

export interface QueryResult {
  query: string
  entities: Entity[]
  graphContext: GraphContext
  generatedAnswer: string
  sources: string[]
}

export interface SampleScenario {
  id: string
  name: string
  description: string
  query: string
  expectedEntities: Entity[]
  graphData: GraphContext
  expectedAnswer: string
}
