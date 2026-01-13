'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Editor from '@monaco-editor/react'
import Script from 'next/script'
import { PandasExplorerProps, ExecutionResult, DataProfile, PyodideInterface } from './types'
import { datasets, datasetGenerators, sampleOperations, categories } from './sampleData'

const DEFAULT_CODE = `# Pandas Explorer에 오신 것을 환영합니다!
# 먼저 좌측에서 데이터셋을 선택하고 "데이터 로드" 버튼을 클릭하세요.

# 데이터 미리보기
print(df.head())

# 기본 정보
print(f"\\nShape: {df.shape}")
print(f"\\nColumns: {list(df.columns)}")
`

export function PandasExplorer({
  showProfile = true,
  showSamples = true,
  defaultDataset = 'ecommerce',
}: PandasExplorerProps) {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Pyodide 로딩 준비 중...')
  const [packagesLoaded, setPackagesLoaded] = useState(false)
  const [code, setCode] = useState(DEFAULT_CODE)
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [executing, setExecuting] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState(defaultDataset)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [profile, setProfile] = useState<DataProfile | null>(null)
  const [activeTab, setActiveTab] = useState<'output' | 'profile' | 'samples'>('output')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [pyodideReady, setPyodideReady] = useState(false)
  const editorRef = useRef<unknown>(null)

  // Pyodide 초기화
  const initPyodide = useCallback(async () => {
    if (typeof window === 'undefined' || !window.loadPyodide) return

    try {
      setLoadingMessage('Pyodide 초기화 중...')

      const pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      })

      setLoadingMessage('pandas, numpy 패키지 로딩 중... (30-60초 소요)')

      // pandas, numpy 로드
      await pyodideInstance.loadPackage(['pandas', 'numpy'])

      // stdout 캡처 설정
      await pyodideInstance.runPythonAsync(`
import sys
from io import StringIO
import pandas as pd
import numpy as np

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

# pandas 출력 설정
pd.set_option('display.max_columns', 20)
pd.set_option('display.max_rows', 50)
pd.set_option('display.width', 200)
pd.set_option('display.max_colwidth', 50)
      `)

      setPyodide(pyodideInstance)
      setPackagesLoaded(true)
      setPyodideReady(true)
      setLoading(false)
      setLoadingMessage('')

      console.log('Pyodide with pandas initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Pyodide:', error)
      setLoadingMessage('Pyodide 초기화 실패: ' + (error as Error).message)
    }
  }, [])

  // 데이터셋 로드
  const loadDataset = useCallback(async () => {
    if (!pyodide || !packagesLoaded) return

    setExecuting(true)
    setLoadingMessage('데이터셋 생성 중...')

    try {
      // 출력 캡처 준비
      await pyodide.runPythonAsync(`
_output_capture.clear()
sys.stdout = _output_capture.stdout
sys.stderr = _output_capture.stderr
      `)

      // 데이터셋 생성 코드 실행
      const generatorCode = datasetGenerators[selectedDataset]
      await pyodide.runPythonAsync(generatorCode)

      // 데이터 프로파일 생성
      await pyodide.runPythonAsync(`
import json

def get_profile():
    profile = {
        "shape": list(df.shape),
        "memoryUsage": f"{df.memory_usage(deep=True).sum() / 1024:.1f} KB",
        "duplicateRows": int(df.duplicated().sum()),
        "columns": []
    }

    for col in df.columns:
        col_info = {
            "name": col,
            "dtype": str(df[col].dtype),
            "count": int(df[col].count()),
            "missing": int(df[col].isnull().sum()),
            "missingPct": round(df[col].isnull().sum() / len(df) * 100, 1),
            "unique": int(df[col].nunique())
        }

        if df[col].dtype in ['int64', 'float64']:
            col_info["mean"] = round(float(df[col].mean()), 2) if not df[col].isnull().all() else None
            col_info["std"] = round(float(df[col].std()), 2) if not df[col].isnull().all() else None
            col_info["min"] = float(df[col].min()) if not df[col].isnull().all() else None
            col_info["max"] = float(df[col].max()) if not df[col].isnull().all() else None
            col_info["median"] = float(df[col].median()) if not df[col].isnull().all() else None
        elif df[col].dtype == 'object' or str(df[col].dtype) == 'category':
            top_values = df[col].value_counts().head(5)
            col_info["topValues"] = [{"value": str(v), "count": int(c)} for v, c in top_values.items()]

        profile["columns"].append(col_info)

    return json.dumps(profile)

_profile_json = get_profile()
      `)

      const profileJson = await pyodide.runPythonAsync(`_profile_json`)
      const profileData = JSON.parse(String(profileJson))
      setProfile(profileData)

      // stdout 복원
      await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
      `)

      setDataLoaded(true)
      setLoadingMessage('')

      // 결과 표시
      const output = await pyodide.runPythonAsync(`_output_capture.get_output()`)
      setResult({
        output: String(output),
        executionTime: 0,
      })
      setActiveTab('output')

    } catch (error) {
      console.error('Failed to load dataset:', error)
      setResult({
        output: '',
        error: (error as Error).message,
        executionTime: 0,
      })
    } finally {
      setExecuting(false)
    }
  }, [pyodide, packagesLoaded, selectedDataset])

  // 코드 실행
  const executeCode = useCallback(async () => {
    if (!pyodide || !dataLoaded) return

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

      // stdout 복원
      await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
      `)

      const endTime = performance.now()

      setResult({
        output: String(output || ''),
        error: String(error || '') || undefined,
        executionTime: Math.round(endTime - startTime),
      })
      setActiveTab('output')

    } catch (error) {
      const endTime = performance.now()

      try {
        await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
        `)
      } catch {
        // ignore
      }

      setResult({
        output: '',
        error: (error as Error).message,
        executionTime: Math.round(endTime - startTime),
      })
    } finally {
      setExecuting(false)
    }
  }, [pyodide, dataLoaded, code])

  // 키보드 단축키
  const handleEditorMount = useCallback((editor: unknown) => {
    editorRef.current = editor
    // @ts-expect-error Monaco editor type
    editor.addAction({
      id: 'execute-pandas',
      label: 'Execute Code',
      keybindings: [
        // @ts-expect-error Monaco KeyMod
        window.monaco?.KeyMod.CtrlCmd | window.monaco?.KeyCode.Enter,
      ],
      run: () => {
        executeCode()
      },
    })
  }, [executeCode])

  // Pyodide 스크립트 로드 핸들러
  const handlePyodideLoad = useCallback(() => {
    initPyodide()
  }, [initPyodide])

  // 샘플 코드 로드
  const loadSampleCode = useCallback((sampleCode: string) => {
    setCode(sampleCode)
  }, [])

  // 카테고리 필터링된 샘플
  const filteredSamples = selectedCategory === 'all'
    ? sampleOperations
    : sampleOperations.filter(s => s.category === selectedCategory)

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="text-gray-600">{loadingMessage}</p>
          <p className="text-xs text-gray-400">pandas, numpy를 브라우저에서 로딩하고 있습니다...</p>
          <p className="text-xs text-gray-400">처음 로딩 시 약 30-60MB를 다운로드합니다.</p>
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
        {/* 데이터셋 선택 */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">데이터셋</label>
              <select
                value={selectedDataset}
                onChange={(e) => {
                  setSelectedDataset(e.target.value)
                  setDataLoaded(false)
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              >
                {datasets.map((ds) => (
                  <option key={ds.id} value={ds.id}>
                    {ds.name} ({ds.rows.toLocaleString()}행)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                {datasets.find(d => d.id === selectedDataset)?.description}
              </p>
            </div>
            <button
              onClick={loadDataset}
              disabled={executing || !packagesLoaded}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                executing || !packagesLoaded
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : dataLoaded
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {executing ? '로딩 중...' : dataLoaded ? '✓ 로드됨' : '데이터 로드'}
            </button>
          </div>
          {dataLoaded && profile && (
            <div className="mt-3 flex gap-4 text-sm text-gray-600">
              <span>📊 {profile.shape[0].toLocaleString()}행 × {profile.shape[1]}열</span>
              <span>💾 {profile.memoryUsage}</span>
              <span>🔄 중복: {profile.duplicateRows}행</span>
            </div>
          )}
        </div>

        {/* 에디터 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Python + pandas</span>
              <span className="text-xs text-gray-400">Ctrl/Cmd + Enter로 실행</span>
              {pyodideReady && packagesLoaded && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                  pandas Ready
                </span>
              )}
            </div>
            <button
              onClick={executeCode}
              disabled={executing || !dataLoaded}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                executing || !dataLoaded
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {executing ? '실행 중...' : !dataLoaded ? '먼저 데이터 로드' : '실행'}
            </button>
          </div>
          <Editor
            height="200px"
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
            }}
          />
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('output')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'output'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            실행 결과
          </button>
          {showProfile && profile && (
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'profile'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              데이터 프로파일
            </button>
          )}
          {showSamples && (
            <button
              onClick={() => setActiveTab('samples')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'samples'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              샘플 코드
              <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                {sampleOperations.length}
              </span>
            </button>
          )}
        </div>

        {/* 탭 컨텐츠 */}
        <div className="flex-1 overflow-auto">
          {/* 출력 탭 */}
          {activeTab === 'output' && (
            <div className="bg-gray-900 rounded-lg p-4 min-h-[200px]">
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
                  {dataLoaded
                    ? '코드를 실행하면 결과가 여기에 표시됩니다.'
                    : '먼저 데이터셋을 로드하세요.'}
                </p>
              )}
            </div>
          )}

          {/* 프로파일 탭 */}
          {activeTab === 'profile' && profile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-orange-600">{profile.shape[0].toLocaleString()}</div>
                  <div className="text-sm text-gray-600">행</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-orange-600">{profile.shape[1]}</div>
                  <div className="text-sm text-gray-600">열</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-orange-600">{profile.memoryUsage}</div>
                  <div className="text-sm text-gray-600">메모리</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-orange-600">{profile.duplicateRows}</div>
                  <div className="text-sm text-gray-600">중복 행</div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">컬럼</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">타입</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">결측</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">고유값</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">통계/빈출값</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {profile.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{col.name}</td>
                        <td className="px-4 py-2 text-sm text-blue-600 font-mono">{col.dtype}</td>
                        <td className="px-4 py-2 text-sm">
                          {col.missing > 0 ? (
                            <span className="text-red-600">{col.missing} ({col.missingPct}%)</span>
                          ) : (
                            <span className="text-green-600">0</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">{col.unique}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {col.mean !== undefined ? (
                            <span>
                              평균: {col.mean?.toLocaleString()} |
                              범위: {col.min?.toLocaleString()} ~ {col.max?.toLocaleString()}
                            </span>
                          ) : col.topValues ? (
                            <span>
                              {col.topValues.slice(0, 2).map(v => `${v.value}(${v.count})`).join(', ')}
                            </span>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* 샘플 목록 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredSamples.map((sample) => (
                  <div
                    key={sample.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-orange-300 transition"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{sample.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          sample.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          sample.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {sample.difficulty === 'beginner' ? '초급' :
                           sample.difficulty === 'intermediate' ? '중급' : '고급'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{sample.description}</p>
                    </div>
                    <div className="p-3 bg-gray-50 max-h-32 overflow-y-auto">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {sample.code.slice(0, 250)}...
                      </pre>
                    </div>
                    <div className="px-3 py-2 border-t border-gray-100">
                      <button
                        onClick={() => loadSampleCode(sample.code)}
                        disabled={!dataLoaded}
                        className={`text-sm font-medium ${
                          dataLoaded
                            ? 'text-orange-600 hover:text-orange-800'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {dataLoaded ? '에디터에 로드 →' : '먼저 데이터 로드'}
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
