// dbt Lineage Visualizer 타입 정의

export type MaterializationType = 'view' | 'table' | 'incremental' | 'ephemeral'

export type ModelLayer = 'staging' | 'intermediate' | 'marts' | 'source'

export type TestType = 'unique' | 'not_null' | 'accepted_values' | 'relationships' | 'custom'

export interface DbtTest {
  name: string
  type: TestType
  column?: string
  severity: 'warn' | 'error'
  config?: Record<string, any>
}

export interface DbtSource {
  id: string
  name: string
  database: string
  schema: string
  tables: {
    name: string
    columns: string[]
    freshness?: {
      warn_after: { count: number; period: string }
      error_after: { count: number; period: string }
    }
  }[]
  description?: string
}

export interface DbtModel {
  id: string
  name: string
  layer: ModelLayer
  materialization: MaterializationType
  schema: string
  description: string
  sql: string
  columns: {
    name: string
    type: string
    description?: string
    tests?: TestType[]
  }[]
  depends_on: string[]  // model or source IDs
  tests: DbtTest[]
  tags?: string[]
  meta?: Record<string, any>
}

export interface DbtProject {
  id: string
  name: string
  description: string
  version: string
  sources: DbtSource[]
  models: DbtModel[]
  vars?: Record<string, any>
}

export interface LineageNode {
  id: string
  type: 'source' | 'model'
  name: string
  layer: ModelLayer
  materialization?: MaterializationType
  x?: number
  y?: number
}

export interface LineageEdge {
  from: string
  to: string
}

export interface DbtLineageProps {
  showCode?: boolean
  showTests?: boolean
  interactive?: boolean
}

// Layer colors
export const layerColors: Record<ModelLayer, { bg: string; border: string; text: string }> = {
  source: { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700' },
  staging: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700' },
  intermediate: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700' },
  marts: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700' },
}

// Materialization icons
export const materializationIcons: Record<MaterializationType, string> = {
  view: '👁️',
  table: '📦',
  incremental: '📈',
  ephemeral: '💨',
}
