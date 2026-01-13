// SQL Lab 타입 정의

export interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  executionTime: number
  error?: string
}

export interface TableSchema {
  name: string
  columns: ColumnInfo[]
  rowCount: number
  description: string
}

export interface ColumnInfo {
  name: string
  type: string
  nullable: boolean
  description?: string
}

export interface SampleQuery {
  id: string
  title: string
  description: string
  query: string
  category: 'basic' | 'join' | 'window' | 'cte' | 'aggregate' | 'subquery'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface QueryHistory {
  id: string
  query: string
  timestamp: Date
  success: boolean
  rowCount?: number
  executionTime?: number
  error?: string
}

export interface SqlLabProps {
  showSchema?: boolean
  showSampleQueries?: boolean
  showHistory?: boolean
  defaultQuery?: string
}
