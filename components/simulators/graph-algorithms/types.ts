// Graph Algorithms Simulator Types

export interface GraphNode {
  id: string
  label: string
  group?: string
  // Algorithm results
  pageRank?: number
  degreeCentrality?: number
  betweennessCentrality?: number
  closenessCentrality?: number
  communityId?: number
  // Visualization
  color?: string
  size?: number
  x?: number
  y?: number
}

export interface GraphEdge {
  id: string
  from: string
  to: string
  label?: string
  weight?: number
  // Visualization
  color?: string
  width?: number
  dashes?: boolean
}

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export type AlgorithmType =
  | 'pagerank'
  | 'degree'
  | 'betweenness'
  | 'closeness'
  | 'community'
  | 'shortestPath'

export interface AlgorithmResult {
  type: AlgorithmType
  nodes: Map<string, number>
  communities?: Map<string, number>
  path?: string[]
  pathLength?: number
  executionTime: number
  description: string
}

export interface AlgorithmConfig {
  // PageRank
  dampingFactor?: number
  iterations?: number
  // Shortest Path
  sourceNode?: string
  targetNode?: string
  // Community Detection
  resolution?: number
}
