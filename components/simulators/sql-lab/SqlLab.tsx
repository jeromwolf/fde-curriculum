'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Editor from '@monaco-editor/react'
import * as duckdb from '@duckdb/duckdb-wasm'
import { SqlLabProps, QueryResult, QueryHistory } from './types'
import { tableSchemas, sampleQueries, initSQL, generateOrdersSQL } from './sampleData'

// DuckDB 번들 URL
const DUCKDB_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.28.0/dist/duckdb-mvp.wasm',
    mainWorker: 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.28.0/dist/duckdb-browser-mvp.worker.js',
  },
  eh: {
    mainModule: 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.28.0/dist/duckdb-eh.wasm',
    mainWorker: 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.28.0/dist/duckdb-browser-eh.worker.js',
  },
}

export function SqlLab({
  showSchema = true,
  showSampleQueries = true,
  showHistory = true,
  defaultQuery = 'SELECT * FROM customers LIMIT 10;',
}: SqlLabProps) {
  const [db, setDb] = useState<duckdb.AsyncDuckDB | null>(null)
  const [conn, setConn] = useState<duckdb.AsyncDuckDBConnection | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('DuckDB 초기화 중...')
  const [query, setQuery] = useState(defaultQuery)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [executing, setExecuting] = useState(false)
  const [history, setHistory] = useState<QueryHistory[]>([])
  const [activeTab, setActiveTab] = useState<'result' | 'schema' | 'samples'>('result')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const editorRef = useRef<unknown>(null)

  // DuckDB 초기화
  useEffect(() => {
    async function initDuckDB() {
      try {
        setLoadingMessage('DuckDB WASM 로딩 중...')

        // 번들 선택
        const bundle = await duckdb.selectBundle(DUCKDB_BUNDLES)

        // Worker 생성
        const worker = new Worker(bundle.mainWorker!)
        const logger = new duckdb.ConsoleLogger()

        // DuckDB 인스턴스 생성
        const database = new duckdb.AsyncDuckDB(logger, worker)
        await database.instantiate(bundle.mainModule)

        setLoadingMessage('데이터베이스 연결 중...')
        const connection = await database.connect()

        setLoadingMessage('샘플 데이터 로딩 중...')
        // 테이블 생성 및 데이터 삽입
        await connection.query(initSQL)

        // 주문 데이터 생성 (동적)
        const ordersSQL = generateOrdersSQL()
        await connection.query(ordersSQL)

        setDb(database)
        setConn(connection)
        setLoadingMessage('')
        setLoading(false)

        console.log('DuckDB initialized successfully')
      } catch (error) {
        console.error('Failed to initialize DuckDB:', error)
        setLoadingMessage('DuckDB 초기화 실패: ' + (error as Error).message)
      }
    }

    initDuckDB()

    return () => {
      conn?.close()
      db?.terminate()
    }
  }, [])

  // 쿼리 실행
  const executeQuery = useCallback(async () => {
    if (!conn || !query.trim()) return

    setExecuting(true)
    const startTime = performance.now()

    try {
      const result = await conn.query(query)
      const endTime = performance.now()
      const executionTime = Math.round(endTime - startTime)

      // Arrow Table을 JavaScript 배열로 변환
      const columns = result.schema.fields.map(f => f.name)
      const rows: Record<string, unknown>[] = []

      for (let i = 0; i < result.numRows; i++) {
        const row: Record<string, unknown> = {}
        for (const col of columns) {
          const value = result.getChild(col)?.get(i)
          // BigInt 처리
          row[col] = typeof value === 'bigint' ? Number(value) : value
        }
        rows.push(row)
      }

      const queryResult: QueryResult = {
        columns,
        rows,
        rowCount: result.numRows,
        executionTime,
      }

      setResult(queryResult)
      setActiveTab('result')

      // 히스토리 추가
      const historyEntry: QueryHistory = {
        id: Date.now().toString(),
        query: query.trim(),
        timestamp: new Date(),
        success: true,
        rowCount: result.numRows,
        executionTime,
      }
      setHistory(prev => [historyEntry, ...prev.slice(0, 19)])

    } catch (error) {
      const endTime = performance.now()
      const executionTime = Math.round(endTime - startTime)

      const errorResult: QueryResult = {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTime,
        error: (error as Error).message,
      }
      setResult(errorResult)

      // 히스토리에 실패 기록
      const historyEntry: QueryHistory = {
        id: Date.now().toString(),
        query: query.trim(),
        timestamp: new Date(),
        success: false,
        executionTime,
        error: (error as Error).message,
      }
      setHistory(prev => [historyEntry, ...prev.slice(0, 19)])
    } finally {
      setExecuting(false)
    }
  }, [conn, query])

  // 키보드 단축키
  const handleEditorMount = useCallback((editor: unknown) => {
    editorRef.current = editor
    // @ts-expect-error Monaco editor type
    editor.addAction({
      id: 'execute-query',
      label: 'Execute Query',
      keybindings: [
        // Ctrl/Cmd + Enter
        // @ts-expect-error Monaco KeyMod
        window.monaco?.KeyMod.CtrlCmd | window.monaco?.KeyCode.Enter,
      ],
      run: () => {
        executeQuery()
      },
    })
  }, [executeQuery])

  // 샘플 쿼리 로드
  const loadSampleQuery = useCallback((sampleQuery: string) => {
    setQuery(sampleQuery)
  }, [])

  // 카테고리 필터링된 샘플 쿼리
  const filteredSampleQueries = selectedCategory === 'all'
    ? sampleQueries
    : sampleQueries.filter(q => q.category === selectedCategory)

  // 로딩 화면
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">{loadingMessage}</p>
        <p className="text-xs text-gray-400">DuckDB WASM을 브라우저에서 로딩하고 있습니다...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* 상단: 에디터 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">SQL Editor</span>
            <span className="text-xs text-gray-400">Ctrl/Cmd + Enter로 실행</span>
          </div>
          <button
            onClick={executeQuery}
            disabled={executing}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              executing
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
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
          height="200px"
          defaultLanguage="sql"
          value={query}
          onChange={(value) => setQuery(value || '')}
          onMount={handleEditorMount}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            suggestOnTriggerCharacters: true,
          }}
        />
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('result')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'result'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          실행 결과
          {result && !result.error && (
            <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
              {result.rowCount}행
            </span>
          )}
        </button>
        {showSchema && (
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'schema'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            스키마
          </button>
        )}
        {showSampleQueries && (
          <button
            onClick={() => setActiveTab('samples')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'samples'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            샘플 쿼리
          </button>
        )}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="flex-1 overflow-auto">
        {/* 결과 탭 */}
        {activeTab === 'result' && (
          <div className="space-y-4">
            {result?.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <div>
                    <h4 className="font-medium text-red-800">쿼리 실행 오류</h4>
                    <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                      {result.error}
                    </pre>
                  </div>
                </div>
              </div>
            ) : result ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{result.rowCount}개 행</span>
                    <span>{result.executionTime}ms</span>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {result.columns.map((col) => (
                          <th
                            key={col}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {result.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          {result.columns.map((col) => (
                            <td
                              key={col}
                              className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap"
                            >
                              {row[col] === null ? (
                                <span className="text-gray-400 italic">NULL</span>
                              ) : (
                                String(row[col])
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                쿼리를 실행하면 결과가 여기에 표시됩니다.
              </div>
            )}

            {/* 히스토리 */}
            {showHistory && history.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">실행 히스토리</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      onClick={() => loadSampleQuery(entry.query)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        entry.success
                          ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          : 'border-red-200 bg-red-50 hover:border-red-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs ${entry.success ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.success ? '✓ 성공' : '✗ 실패'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {entry.timestamp.toLocaleTimeString()}
                          {entry.executionTime && ` · ${entry.executionTime}ms`}
                          {entry.rowCount !== undefined && ` · ${entry.rowCount}행`}
                        </span>
                      </div>
                      <code className="text-xs text-gray-700 line-clamp-2">{entry.query}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 스키마 탭 */}
        {activeTab === 'schema' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tableSchemas.map((table) => (
              <div
                key={table.name}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{table.name}</span>
                    <span className="text-xs text-gray-500">{table.rowCount}행</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{table.description}</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {table.columns.map((col) => (
                    <div key={col.name} className="px-4 py-2 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{col.name}</span>
                        <span className="text-xs text-blue-600 font-mono">{col.type}</span>
                      </div>
                      {col.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{col.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 샘플 쿼리 탭 */}
        {activeTab === 'samples' && (
          <div>
            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['all', 'basic', 'aggregate', 'join', 'window', 'cte', 'subquery'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? '전체' :
                   cat === 'basic' ? 'Basic' :
                   cat === 'aggregate' ? 'Aggregate' :
                   cat === 'join' ? 'JOIN' :
                   cat === 'window' ? 'Window' :
                   cat === 'cte' ? 'CTE' : 'Subquery'}
                </button>
              ))}
            </div>

            {/* 샘플 쿼리 목록 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredSampleQueries.map((sample) => (
                <div
                  key={sample.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-300 transition"
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
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {sample.category.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{sample.description}</p>
                  </div>
                  <div className="p-3 bg-gray-50">
                    <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap">
                      {sample.query}
                    </pre>
                  </div>
                  <div className="px-3 py-2 border-t border-gray-100">
                    <button
                      onClick={() => loadSampleQuery(sample.query)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
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
  )
}
