'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Editor from '@monaco-editor/react'
import Script from 'next/script'
import { PythonConsoleProps, ExecutionResult, ExecutionHistory, PyodideInterface } from './types'
import { sampleCodes, categories } from './sampleCode'

const DEFAULT_CODE = `# Python Console에 오신 것을 환영합니다!
# Ctrl/Cmd + Enter로 코드를 실행하세요

def greet(name):
    return f"안녕하세요, {name}님!"

# 테스트
message = greet("Python")
print(message)

# 리스트 컴프리헨션
squares = [x**2 for x in range(10)]
print(f"제곱수: {squares}")
`

export function PythonConsole({
  showSamples = true,
  showHistory = true,
  defaultCode = DEFAULT_CODE,
}: PythonConsoleProps) {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Pyodide 로딩 준비 중...')
  const [code, setCode] = useState(defaultCode)
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [executing, setExecuting] = useState(false)
  const [history, setHistory] = useState<ExecutionHistory[]>([])
  const [activeTab, setActiveTab] = useState<'output' | 'samples'>('output')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [pyodideReady, setPyodideReady] = useState(false)
  const editorRef = useRef<unknown>(null)

  // Pyodide 초기화
  const initPyodide = useCallback(async () => {
    if (typeof window === 'undefined' || !window.loadPyodide) return

    try {
      setLoadingMessage('Pyodide 초기화 중... (약 5-10초 소요)')

      const pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      })

      // stdout/stderr 캡처 설정
      await pyodideInstance.runPythonAsync(`
import sys
from io import StringIO

class OutputCapture:
    def __init__(self):
        self.stdout = StringIO()
        self.stderr = StringIO()

    def get_output(self):
        return self.stdout.getvalue()

    def get_error(self):
        return self.stderr.getvalue()

    def clear(self):
        self.stdout = StringIO()
        self.stderr = StringIO()

_output_capture = OutputCapture()
      `)

      setPyodide(pyodideInstance)
      setPyodideReady(true)
      setLoading(false)
      setLoadingMessage('')

      console.log('Pyodide initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Pyodide:', error)
      setLoadingMessage('Pyodide 초기화 실패: ' + (error as Error).message)
    }
  }, [])

  // Pyodide 스크립트 로드 완료 핸들러
  const handlePyodideLoad = useCallback(() => {
    console.log('Pyodide script loaded')
    initPyodide()
  }, [initPyodide])

  // 코드 실행
  const executeCode = useCallback(async () => {
    if (!pyodide || !code.trim()) return

    setExecuting(true)
    const startTime = performance.now()

    try {
      // 출력 캡처 준비
      await pyodide.runPythonAsync(`
_output_capture.clear()
sys.stdout = _output_capture.stdout
sys.stderr = _output_capture.stderr
      `)

      // 사용자 코드 실행
      await pyodide.runPythonAsync(code)

      // 출력 수집
      const output = await pyodide.runPythonAsync(`_output_capture.get_output()`)
      const error = await pyodide.runPythonAsync(`_output_capture.get_error()`)

      // stdout/stderr 복원
      await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
      `)

      const endTime = performance.now()
      const executionTime = Math.round(endTime - startTime)

      const execResult: ExecutionResult = {
        output: String(output || ''),
        error: String(error || '') || undefined,
        executionTime,
      }

      setResult(execResult)
      setActiveTab('output')

      // 히스토리 추가
      const historyEntry: ExecutionHistory = {
        id: Date.now().toString(),
        code: code.trim(),
        timestamp: new Date(),
        success: !error,
        output: String(output || ''),
        error: String(error || '') || undefined,
        executionTime,
      }
      setHistory(prev => [historyEntry, ...prev.slice(0, 19)])

    } catch (error) {
      const endTime = performance.now()
      const executionTime = Math.round(endTime - startTime)

      // stdout/stderr 복원
      try {
        await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
        `)
      } catch {
        // ignore
      }

      const execResult: ExecutionResult = {
        output: '',
        error: (error as Error).message,
        executionTime,
      }
      setResult(execResult)

      // 히스토리에 실패 기록
      const historyEntry: ExecutionHistory = {
        id: Date.now().toString(),
        code: code.trim(),
        timestamp: new Date(),
        success: false,
        error: (error as Error).message,
        executionTime,
      }
      setHistory(prev => [historyEntry, ...prev.slice(0, 19)])
    } finally {
      setExecuting(false)
    }
  }, [pyodide, code])

  // 키보드 단축키
  const handleEditorMount = useCallback((editor: unknown) => {
    editorRef.current = editor
    // @ts-expect-error Monaco editor type
    editor.addAction({
      id: 'execute-python',
      label: 'Execute Python',
      keybindings: [
        // @ts-expect-error Monaco KeyMod
        window.monaco?.KeyMod.CtrlCmd | window.monaco?.KeyCode.Enter,
      ],
      run: () => {
        executeCode()
      },
    })
  }, [executeCode])

  // 샘플 코드 로드
  const loadSampleCode = useCallback((sampleCode: string) => {
    setCode(sampleCode)
  }, [])

  // 카테고리 필터링된 샘플 코드
  const filteredSamples = selectedCategory === 'all'
    ? sampleCodes
    : sampleCodes.filter(s => s.category === selectedCategory)

  // 로딩 화면
  if (loading && !pyodideReady) {
    return (
      <>
        <Script
          src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"
          onLoad={handlePyodideLoad}
          strategy="afterInteractive"
        />
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="text-gray-600">{loadingMessage}</p>
          <p className="text-xs text-gray-400">Python 런타임을 브라우저에서 로딩하고 있습니다...</p>
          <p className="text-xs text-gray-400">처음 로딩 시 약 10-20MB를 다운로드합니다.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"
        onLoad={handlePyodideLoad}
        strategy="afterInteractive"
      />
      <div className="flex flex-col h-full space-y-4">
        {/* 상단: 에디터 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Python Editor</span>
              <span className="text-xs text-gray-400">Ctrl/Cmd + Enter로 실행</span>
              {pyodideReady && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                  Pyodide Ready
                </span>
              )}
            </div>
            <button
              onClick={executeCode}
              disabled={executing || !pyodideReady}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                executing || !pyodideReady
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {executing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  실행 중...
                </span>
              ) : (
                '실행 (Ctrl+Enter)'
              )}
            </button>
          </div>
          <Editor
            height="280px"
            defaultLanguage="python"
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorMount}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 4,
              insertSpaces: true,
            }}
          />
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('output')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'output'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            실행 결과
          </button>
          {showSamples && (
            <button
              onClick={() => setActiveTab('samples')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'samples'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              샘플 코드
              <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                {sampleCodes.length}
              </span>
            </button>
          )}
        </div>

        {/* 탭 컨텐츠 */}
        <div className="flex-1 overflow-auto">
          {/* 출력 탭 */}
          {activeTab === 'output' && (
            <div className="space-y-4">
              {/* 실행 결과 */}
              <div className="bg-gray-900 rounded-lg p-4 min-h-[150px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-mono">Output</span>
                  {result && (
                    <span className="text-xs text-gray-500">{result.executionTime}ms</span>
                  )}
                </div>
                {result?.error ? (
                  <pre className="text-red-400 font-mono text-sm whitespace-pre-wrap">
                    {result.error}
                  </pre>
                ) : result?.output ? (
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                    {result.output}
                  </pre>
                ) : (
                  <p className="text-gray-500 text-sm">
                    코드를 실행하면 결과가 여기에 표시됩니다.
                  </p>
                )}
              </div>

              {/* 히스토리 */}
              {showHistory && history.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">실행 히스토리</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {history.map((entry) => (
                      <div
                        key={entry.id}
                        onClick={() => loadSampleCode(entry.code)}
                        className={`p-3 rounded-lg border cursor-pointer transition ${
                          entry.success
                            ? 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                            : 'border-red-200 bg-red-50 hover:border-red-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs ${entry.success ? 'text-green-600' : 'text-red-600'}`}>
                            {entry.success ? '✓ 성공' : '✗ 에러'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {entry.timestamp.toLocaleTimeString()} · {entry.executionTime}ms
                          </span>
                        </div>
                        <code className="text-xs text-gray-700 line-clamp-2 block">
                          {entry.code.split('\n')[0]}...
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 샘플 코드 탭 */}
          {activeTab === 'samples' && (
            <div>
              {/* 카테고리 필터 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-sm transition flex items-center gap-1 ${
                      selectedCategory === cat.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* 샘플 코드 목록 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredSamples.map((sample) => (
                  <div
                    key={sample.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-green-300 transition"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{sample.title}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            sample.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                            sample.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {sample.difficulty === 'beginner' ? '초급' :
                             sample.difficulty === 'intermediate' ? '중급' : '고급'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{sample.description}</p>
                    </div>
                    <div className="p-3 bg-gray-50 max-h-32 overflow-y-auto">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {sample.code.slice(0, 300)}
                        {sample.code.length > 300 && '...'}
                      </pre>
                    </div>
                    <div className="px-3 py-2 border-t border-gray-100">
                      <button
                        onClick={() => loadSampleCode(sample.code)}
                        className="text-sm text-green-600 hover:text-green-800 font-medium"
                      >
                        에디터에 로드 →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
