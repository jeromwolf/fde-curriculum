// Python Console 타입 정의

export interface ExecutionResult {
  output: string
  error?: string
  executionTime: number
}

export interface SampleCode {
  id: string
  title: string
  description: string
  code: string
  category: 'decorator' | 'generator' | 'iterator' | 'context-manager' | 'dataclass' | 'async' | 'functools' | 'typing'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface ExecutionHistory {
  id: string
  code: string
  timestamp: Date
  success: boolean
  output?: string
  error?: string
  executionTime: number
}

export interface PythonConsoleProps {
  showSamples?: boolean
  showHistory?: boolean
  defaultCode?: string
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
