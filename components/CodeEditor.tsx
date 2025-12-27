'use client'

import { useEffect, useState, useCallback } from 'react'
import Editor from 'react-simple-code-editor'
import {
  detectUnsupportedLibs,
  categorizeUnsupportedLibs,
  runPythonCode,
  isPyodideLoaded,
  loadPyodideInstance,
  type ExecutionResult,
} from '@/lib/pyodide-runner'
import { openInColab, generateColabCode, extractImportedPackages } from '@/lib/colab-helper'

// Prism 동적 로드
let Prism: any = null

interface CodeEditorProps {
  taskId: string
  initialCode: string
  language?: string
}

export default function CodeEditor({ taskId, initialCode, language = 'python' }: CodeEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [code, setCode] = useState(initialCode)
  const [isRunning, setIsRunning] = useState(false)
  const [isPyodideReady, setIsPyodideReady] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(false)
  const [output, setOutput] = useState<ExecutionResult | null>(null)
  const [showOutput, setShowOutput] = useState(false)
  const [unsupportedLibs, setUnsupportedLibs] = useState<string[]>([])

  const storageKey = `userCode_${taskId}`

  // localStorage에서 복원 + Prism 로드
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setCode(saved)
    } else {
      setCode(initialCode)
    }

    // Prism 로드
    import('prismjs').then((mod) => {
      Prism = mod.default
      import('prismjs/components/prism-python').then(() => {
        setMounted(true)
      })
    })

    // Pyodide 로드 상태 확인
    setIsPyodideReady(isPyodideLoaded())
  }, [taskId, storageKey, initialCode])

  // 코드 변경 시 지원 불가 라이브러리 감지
  useEffect(() => {
    if (language === 'python') {
      const libs = detectUnsupportedLibs(code)
      setUnsupportedLibs(libs)
    }
  }, [code, language])

  // 코드 변경 시 localStorage에 저장
  const handleChange = (newCode: string) => {
    setCode(newCode)
    localStorage.setItem(storageKey, newCode)
  }

  // 초기화
  const handleReset = () => {
    localStorage.removeItem(storageKey)
    setCode(initialCode)
    setOutput(null)
    setShowOutput(false)
  }

  // Pyodide 로드
  const loadPyodide = useCallback(async () => {
    if (isPyodideReady || pyodideLoading) return
    setPyodideLoading(true)
    try {
      await loadPyodideInstance()
      setIsPyodideReady(true)
    } catch (e) {
      console.error('Pyodide 로딩 실패:', e)
    } finally {
      setPyodideLoading(false)
    }
  }, [isPyodideReady, pyodideLoading])

  // 코드 실행
  const handleRun = async () => {
    if (language !== 'python') {
      setOutput({
        success: false,
        output: '',
        error: '현재 Python만 실행 가능합니다.',
        executionTime: 0,
      })
      setShowOutput(true)
      return
    }

    // 지원 불가 라이브러리 체크
    if (unsupportedLibs.length > 0) {
      setOutput({
        success: false,
        output: '',
        error: `브라우저에서 실행 불가: ${unsupportedLibs.join(', ')}\nGoogle Colab에서 실행해주세요.`,
        executionTime: 0,
      })
      setShowOutput(true)
      return
    }

    // Pyodide 로드
    if (!isPyodideReady) {
      await loadPyodide()
    }

    setIsRunning(true)
    setShowOutput(true)
    setOutput(null)

    try {
      const result = await runPythonCode(code)
      setOutput(result)
    } catch (e: any) {
      setOutput({
        success: false,
        output: '',
        error: e.message || String(e),
        executionTime: 0,
      })
    } finally {
      setIsRunning(false)
    }
  }

  // Colab에서 열기
  const handleOpenInColab = () => {
    const packages = extractImportedPackages(code)
    const colabCode = generateColabCode(code, packages)
    openInColab(colabCode)
  }

  const highlight = (codeStr: string) => {
    if (!Prism || !Prism.languages[language]) {
      return codeStr
    }
    return Prism.highlight(codeStr, Prism.languages[language], language)
  }

  // Python 전용 버튼 (실행, Colab)
  const isPython = language === 'python'

  // 로딩 중 placeholder
  if (!mounted) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-600 text-sm font-medium">✏️ 코드 에디터</div>
        </div>
        <div className="rounded-xl overflow-hidden border border-[#44475a] bg-[#282a36] p-5 min-h-[200px]">
          <pre className="text-[#f8f8f2] font-mono text-sm">{code}</pre>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* 헤더: 제목 + 버튼들 */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-600 text-sm font-medium">
          ✏️ 코드 에디터
          <span className="ml-2 text-xs text-[#50fa7b]">💾 자동 저장</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Colab 버튼 (Python만) */}
          {isPython && (
            <button
              onClick={handleOpenInColab}
              className="text-xs px-3 py-1.5 rounded bg-[#f59e0b] hover:bg-[#d97706] text-white font-medium transition flex items-center gap-1"
              title="Google Colab에서 열기"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.54 9.46L2.19 7.1a9.91 9.91 0 000 9.8l2.35-2.35a6.92 6.92 0 010-5.1zM21.81 7.1l-2.35 2.35a6.92 6.92 0 010 5.1l2.35 2.35a9.91 9.91 0 000-9.8zM12 2a9.95 9.95 0 00-4.9 1.29l2.35 2.35a6.92 6.92 0 015.1 0l2.35-2.35A9.95 9.95 0 0012 2zM12 22a9.95 9.95 0 004.9-1.29l-2.35-2.35a6.92 6.92 0 01-5.1 0l-2.35 2.35A9.95 9.95 0 0012 22z"/>
              </svg>
              Colab
            </button>
          )}

          {/* 실행 버튼 (Python만) */}
          {isPython && (
            <button
              onClick={handleRun}
              disabled={isRunning || pyodideLoading}
              className={`text-xs px-3 py-1.5 rounded font-medium transition flex items-center gap-1 ${
                isRunning || pyodideLoading
                  ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                  : 'bg-[#10b981] hover:bg-[#059669] text-white'
              }`}
              title={pyodideLoading ? 'Python 환경 로딩 중...' : '코드 실행'}
            >
              {isRunning ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  실행 중...
                </>
              ) : pyodideLoading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  로딩...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  실행
                </>
              )}
            </button>
          )}

          {/* 초기화 버튼 */}
          <button
            onClick={handleReset}
            className="text-xs text-[#6272a4] hover:text-[#f8f8f2] px-2 py-1 rounded hover:bg-[#44475a] transition"
          >
            ↺ 초기화
          </button>
        </div>
      </div>

      {/* 지원 불가 라이브러리 경고 */}
      {isPython && unsupportedLibs.length > 0 && (() => {
        const { colabLibs, localLibs } = categorizeUnsupportedLibs(unsupportedLibs)
        return (
          <div className="mb-2 space-y-1">
            {colabLibs.length > 0 && (
              <div className="px-3 py-1.5 bg-gray-800/50 border border-gray-600 rounded text-xs text-gray-400">
                ⚠️ <span className="text-gray-300">{colabLibs.join(', ')}</span> → <span className="text-white font-semibold">Colab에서 실행</span>
              </div>
            )}
            {localLibs.length > 0 && (
              <div className="px-3 py-1.5 bg-gray-800/50 border border-gray-600 rounded text-xs text-gray-400">
                💻 <span className="text-gray-300">{localLibs.join(', ')}</span> → <span className="text-white font-semibold">로컬 환경 필요</span>
              </div>
            )}
          </div>
        )
      })()}

      {/* 코드 에디터 */}
      <div className="rounded-xl overflow-hidden border border-[#44475a]">
        <Editor
          value={code}
          onValueChange={handleChange}
          highlight={highlight}
          padding={20}
          style={{
            fontFamily: '"Fira Code", "Fira Mono", Menlo, Consolas, monospace',
            fontSize: 14,
            backgroundColor: '#282a36',
            color: '#f8f8f2',
            minHeight: '200px',
            lineHeight: 1.6,
          }}
          className="code-editor"
          textareaClassName="code-editor-textarea"
        />
      </div>

      {/* 출력 패널 */}
      {showOutput && (
        <div className="mt-3">
          <div
            className="flex items-center justify-between px-3 py-2 bg-[#1e1e2e] rounded-t-lg border border-[#44475a] border-b-0 cursor-pointer"
            onClick={() => setShowOutput(!showOutput)}
          >
            <span className="text-sm font-medium text-gray-300">
              {output?.success ? '✅ 출력' : output?.error ? '❌ 오류' : '⏳ 실행 중...'}
              {output?.executionTime ? (
                <span className="ml-2 text-xs text-gray-500">
                  ({output.executionTime.toFixed(0)}ms)
                </span>
              ) : null}
            </span>
            <button className="text-xs text-gray-500 hover:text-gray-300">
              {showOutput ? '접기 ▲' : '펼치기 ▼'}
            </button>
          </div>
          <div className="bg-[#0d0d14] rounded-b-lg border border-[#44475a] p-4 font-mono text-sm max-h-[300px] overflow-auto">
            {isRunning ? (
              <div className="text-gray-400 flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                코드 실행 중...
              </div>
            ) : output?.error ? (
              <pre className="text-red-400 whitespace-pre-wrap">{output.error}</pre>
            ) : output?.output ? (
              <pre className="text-green-400 whitespace-pre-wrap">{output.output}</pre>
            ) : (
              <span className="text-gray-500">(출력 없음)</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
