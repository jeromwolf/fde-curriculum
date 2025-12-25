'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Play, RotateCcw, Copy, Check } from 'lucide-react'
import type { ExampleQuery } from '../types'

interface CypherEditorProps {
  initialQuery?: string
  exampleQueries: ExampleQuery[]
  isLoading: boolean
  onExecute: (query: string) => void
  onQueryChange?: (query: string) => void
}

// Cypher 키워드 하이라이팅
const CYPHER_KEYWORDS = [
  'MATCH', 'WHERE', 'RETURN', 'CREATE', 'DELETE', 'DETACH', 'SET', 'REMOVE',
  'ORDER', 'BY', 'LIMIT', 'SKIP', 'AS', 'AND', 'OR', 'NOT', 'IN', 'WITH',
  'OPTIONAL', 'MERGE', 'ON', 'DISTINCT', 'ASC', 'DESC', 'NULL', 'TRUE', 'FALSE',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'UNION', 'ALL', 'UNWIND', 'FOREACH',
  'CALL', 'YIELD', 'type', 'count', 'collect', 'sum', 'avg', 'min', 'max'
]

export function CypherEditor({
  initialQuery = '',
  exampleQueries,
  isLoading,
  onExecute,
  onQueryChange
}: CypherEditorProps) {
  const [query, setQuery] = useState(initialQuery)
  const [copied, setCopied] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
    }
  }, [initialQuery])

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onQueryChange?.(newQuery)
  }

  const handleExecute = () => {
    if (query.trim()) {
      onExecute(query)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter로 실행
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleExecute()
    }
    // Tab 키로 들여쓰기
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = textareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newValue = query.substring(0, start) + '  ' + query.substring(end)
        setQuery(newValue)
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2
        }, 0)
      }
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(query)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setQuery('')
    textareaRef.current?.focus()
  }

  const loadExample = (example: ExampleQuery) => {
    setQuery(example.query)
    textareaRef.current?.focus()
  }

  const categories = ['all', ...Array.from(new Set(exampleQueries.map(q => q.category)))]
  const filteredQueries = selectedCategory === 'all'
    ? exampleQueries
    : exampleQueries.filter(q => q.category === selectedCategory)

  const categoryLabels: Record<string, string> = {
    all: '전체',
    read: '조회',
    create: '생성',
    update: '수정',
    delete: '삭제',
    pattern: '패턴'
  }

  return (
    <div className="space-y-4">
      {/* 에디터 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Cypher Query</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="쿼리 복사"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleClear}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="지우기"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 에디터 */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          className="w-full h-48 p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-xl border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
          placeholder="// Cypher 쿼리를 입력하세요&#10;MATCH (n:Person)&#10;RETURN n.name"
          spellCheck={false}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-500">
          Ctrl+Enter로 실행
        </div>
      </div>

      {/* 실행 버튼 */}
      <button
        onClick={handleExecute}
        disabled={isLoading || !query.trim()}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            실행 중...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            쿼리 실행
          </>
        )}
      </button>

      {/* 예제 쿼리 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">예제 쿼리</h4>
          <div className="flex gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 text-xs rounded-md transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2 max-h-64 overflow-y-auto pr-2">
          {filteredQueries.map((example, idx) => (
            <button
              key={idx}
              onClick={() => loadExample(example)}
              className="text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {example.title}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  example.category === 'read' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                  example.category === 'create' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                  example.category === 'pattern' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {categoryLabels[example.category]}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {example.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
