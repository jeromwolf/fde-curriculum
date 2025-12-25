// Property Graph 타입 정의

export interface NodeLabel {
  name: string
  color: string
}

export interface Node {
  id: string
  labels: string[]
  properties: Record<string, string | number | boolean>
}

export interface Relationship {
  id: string
  type: string
  startNodeId: string
  endNodeId: string
  properties: Record<string, string | number | boolean>
}

export interface PropertyGraph {
  nodes: Node[]
  relationships: Relationship[]
}

export interface QueryResult {
  columns: string[]
  rows: Record<string, any>[]
  nodesAffected?: number
  relationshipsAffected?: number
  executionTime?: number
}

export interface CypherError {
  message: string
  line?: number
  column?: number
}

// 샘플 쿼리 타입
export interface ExampleQuery {
  title: string
  description: string
  query: string
  category: 'read' | 'create' | 'update' | 'delete' | 'pattern'
}

// 노드 레이블 색상
export const LABEL_COLORS: Record<string, string> = {
  Person: '#4F46E5',      // indigo
  Company: '#059669',     // emerald
  Movie: '#DC2626',       // red
  City: '#D97706',        // amber
  Product: '#7C3AED',     // violet
  default: '#6B7280',     // gray
}

// 관계 타입 색상
export const RELATIONSHIP_COLORS: Record<string, string> = {
  KNOWS: '#3B82F6',       // blue
  WORKS_AT: '#10B981',    // green
  LIVES_IN: '#F59E0B',    // yellow
  ACTED_IN: '#EF4444',    // red
  DIRECTED: '#8B5CF6',    // purple
  PURCHASED: '#EC4899',   // pink
  default: '#9CA3AF',     // gray
}
