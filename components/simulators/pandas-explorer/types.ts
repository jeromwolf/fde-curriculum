// Pandas Explorer 타입 정의

export interface DatasetInfo {
  id: string
  name: string
  description: string
  rows: number
  columns: number
  size: string
  category: 'ecommerce' | 'finance' | 'timeseries' | 'sample'
}

export interface ColumnProfile {
  name: string
  dtype: string
  count: number
  missing: number
  missingPct: number
  unique: number
  mean?: number
  std?: number
  min?: number
  max?: number
  median?: number
  mode?: string | number
  topValues?: Array<{ value: string | number; count: number }>
}

export interface DataProfile {
  shape: [number, number]
  columns: ColumnProfile[]
  memoryUsage: string
  duplicateRows: number
}

export interface SampleOperation {
  id: string
  title: string
  description: string
  code: string
  category: 'selection' | 'filtering' | 'groupby' | 'transform' | 'merge' | 'pivot' | 'visualization'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface ExecutionResult {
  output: string
  html?: string
  error?: string
  executionTime: number
}

export interface PandasExplorerProps {
  showProfile?: boolean
  showSamples?: boolean
  defaultDataset?: string
}

// Pyodide 타입
export interface PyodideInterface {
  runPython: (code: string) => unknown
  runPythonAsync: (code: string) => Promise<unknown>
  loadPackage: (packages: string | string[]) => Promise<void>
  globals: {
    get: (name: string) => unknown
    set: (name: string, value: unknown) => void
  }
}

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>
  }
}
