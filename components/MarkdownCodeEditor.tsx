'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Editor from 'react-simple-code-editor'
import {
  detectUnsupportedLibs,
  runPythonCode,
  isPyodideLoaded,
  loadPyodideInstance,
  type ExecutionResult,
} from '@/lib/pyodide-runner'
import { openInColab, generateColabCode, extractImportedPackages } from '@/lib/colab-helper'

// Prism 동적 로드
let Prism: any = null
let prismLoaded = false

// 하이라이트 색상
const HIGHLIGHT_COLORS = {
  yellow: { name: '노랑', bg: 'rgba(255, 255, 0, 0.3)', border: '#ffd700' },
  green: { name: '초록', bg: 'rgba(80, 250, 123, 0.3)', border: '#50fa7b' },
  pink: { name: '핑크', bg: 'rgba(255, 121, 198, 0.3)', border: '#ff79c6' },
  blue: { name: '파랑', bg: 'rgba(139, 233, 253, 0.3)', border: '#8be9fd' },
}

type HighlightColor = keyof typeof HIGHLIGHT_COLORS

interface Highlight {
  start: number
  end: number
  color: HighlightColor
}

// 테마 정의
const THEMES = {
  dracula: {
    name: 'Dracula',
    bg: '#282a36',
    text: '#f8f8f2',
    border: '#44475a',
    comment: '#6272a4',
  },
  monokai: {
    name: 'Monokai',
    bg: '#272822',
    text: '#f8f8f2',
    border: '#49483e',
    comment: '#75715e',
  },
  github: {
    name: 'GitHub Dark',
    bg: '#0d1117',
    text: '#c9d1d9',
    border: '#30363d',
    comment: '#8b949e',
  },
  nord: {
    name: 'Nord',
    bg: '#2e3440',
    text: '#d8dee9',
    border: '#4c566a',
    comment: '#616e88',
  },
}

type ThemeKey = keyof typeof THEMES

interface MarkdownCodeEditorProps {
  initialCode: string
  language: string
  blockId: string
}

export default function MarkdownCodeEditor({ initialCode, language, blockId }: MarkdownCodeEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [code, setCode] = useState(initialCode)
  const [theme, setTheme] = useState<ThemeKey>('dracula')
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [showHighlightMenu, setShowHighlightMenu] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const storageKey = `mdCode_${blockId}`
  const highlightKey = `mdHighlight_${blockId}`
  const themeKey = 'codeEditorTheme'

  // Python 실행 관련 상태
  const [isRunning, setIsRunning] = useState(false)
  const [isPyodideReady, setIsPyodideReady] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(false)
  const [output, setOutput] = useState<ExecutionResult | null>(null)
  const [showOutput, setShowOutput] = useState(false)

  const isPython = language === 'python'

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setCode(saved)
    }
    const savedTheme = localStorage.getItem(themeKey) as ThemeKey
    if (savedTheme && THEMES[savedTheme]) {
      setTheme(savedTheme)
    }
    const savedHighlights = localStorage.getItem(highlightKey)
    if (savedHighlights) {
      try {
        setHighlights(JSON.parse(savedHighlights))
      } catch (e) {}
    }

    if (prismLoaded) {
      setMounted(true)
      return
    }

    import('prismjs').then((mod) => {
      Prism = mod.default
      Promise.all([
        import('prismjs/components/prism-python'),
        import('prismjs/components/prism-sql'),
        import('prismjs/components/prism-javascript'),
        import('prismjs/components/prism-typescript'),
        import('prismjs/components/prism-bash'),
        import('prismjs/components/prism-json'),
      ]).then(() => {
        prismLoaded = true
        setMounted(true)
      })
    })

    // Pyodide 상태 확인
    setIsPyodideReady(isPyodideLoaded())
  }, [storageKey])

  const handleChange = useCallback((newCode: string) => {
    setCode(newCode)
    localStorage.setItem(storageKey, newCode)
  }, [storageKey])

  const handleReset = useCallback(() => {
    localStorage.removeItem(storageKey)
    localStorage.removeItem(highlightKey)
    setCode(initialCode)
    setHighlights([])
    setOutput(null)
    setShowOutput(false)
  }, [storageKey, highlightKey, initialCode])

  const handleThemeChange = useCallback((newTheme: ThemeKey) => {
    setTheme(newTheme)
    localStorage.setItem(themeKey, newTheme)
    setShowThemeMenu(false)
  }, [themeKey])

  const addHighlight = useCallback((color: HighlightColor) => {
    const textarea = editorRef.current?.querySelector('textarea')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    if (start === end) {
      alert('텍스트를 먼저 선택해주세요!')
      return
    }

    const newHighlight: Highlight = { start, end, color }
    const newHighlights = [...highlights.filter(h =>
      !(h.start < end && h.end > start)
    ), newHighlight]

    setHighlights(newHighlights)
    localStorage.setItem(highlightKey, JSON.stringify(newHighlights))
    setShowHighlightMenu(false)
  }, [highlights, highlightKey])

  const clearHighlights = useCallback(() => {
    setHighlights([])
    localStorage.removeItem(highlightKey)
  }, [highlightKey])

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
    const unsupportedLibs = detectUnsupportedLibs(code)
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

  const currentTheme = THEMES[theme]

  const applyHighlightsToHTML = useCallback((html: string, textLength: number) => {
    if (highlights.length === 0) return html

    const textToHtml: number[] = []
    let textIdx = 0
    let inTag = false

    for (let i = 0; i < html.length; i++) {
      if (html[i] === '<') {
        inTag = true
      } else if (html[i] === '>') {
        inTag = false
      } else if (!inTag) {
        if (html[i] === '&') {
          const semiIdx = html.indexOf(';', i)
          if (semiIdx !== -1 && semiIdx - i < 8) {
            textToHtml[textIdx++] = i
            i = semiIdx
            continue
          }
        }
        textToHtml[textIdx++] = i
      }
    }
    textToHtml[textIdx] = html.length

    const sortedHighlights = [...highlights].sort((a, b) => b.start - a.start)
    let result = html

    for (const hl of sortedHighlights) {
      if (hl.start >= textLength || hl.end > textLength) continue

      const htmlStart = textToHtml[hl.start]
      const htmlEnd = textToHtml[hl.end] ?? result.length
      const color = HIGHLIGHT_COLORS[hl.color]

      const before = result.slice(0, htmlStart)
      const highlighted = result.slice(htmlStart, htmlEnd)
      const after = result.slice(htmlEnd)

      result = `${before}<mark style="background:${color.bg};border-radius:2px;">${highlighted}</mark>${after}`
    }

    return result
  }, [highlights])

  const highlight = useCallback((codeText: string) => {
    if (!Prism) {
      if (highlights.length === 0) return codeText
      return applyHighlightsToHTML(codeText, codeText.length)
    }

    const lang = Prism.languages[language] || Prism.languages.plaintext
    const prismHighlighted = Prism.highlight(codeText, lang, language)

    if (highlights.length === 0) return prismHighlighted

    return applyHighlightsToHTML(prismHighlighted, codeText.length)
  }, [language, highlights, applyHighlightsToHTML])

  if (!mounted) {
    return (
      <div className="rounded-xl overflow-hidden border my-4" style={{ borderColor: currentTheme.border, backgroundColor: currentTheme.bg }}>
        <div className="flex items-center justify-between px-4 py-2 border-b" style={{ backgroundColor: `${currentTheme.border}80`, borderColor: currentTheme.border }}>
          <span className="text-xs font-mono" style={{ color: currentTheme.comment }}>{language}</span>
        </div>
        <pre className="p-4 font-mono text-sm overflow-x-auto" style={{ color: currentTheme.text }}>
          <code>{initialCode}</code>
        </pre>
      </div>
    )
  }

  return (
    <div ref={editorRef} className="rounded-xl overflow-hidden border my-4 relative" style={{ borderColor: currentTheme.border }}>
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ backgroundColor: `${currentTheme.border}80`, borderColor: currentTheme.border }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: currentTheme.comment }}>{language}</span>
          <span className="text-xs" style={{ color: '#50fa7b' }}>✏️ 편집 가능</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Python 전용: Colab 버튼 */}
          {isPython && (
            <button
              onClick={handleOpenInColab}
              className="text-xs px-2 py-1 rounded bg-[#f59e0b] hover:bg-[#d97706] text-white font-medium transition flex items-center gap-1"
              title="Google Colab에서 열기"
            >
              Colab
            </button>
          )}

          {/* Python 전용: 실행 버튼 */}
          {isPython && (
            <button
              onClick={handleRun}
              disabled={isRunning || pyodideLoading}
              className={`text-xs px-2 py-1 rounded font-medium transition flex items-center gap-1 ${
                isRunning || pyodideLoading
                  ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                  : 'bg-[#10b981] hover:bg-[#059669] text-white'
              }`}
              title={pyodideLoading ? 'Python 환경 로딩 중...' : '코드 실행'}
            >
              {isRunning || pyodideLoading ? (
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
              {isRunning ? '실행 중' : pyodideLoading ? '로딩' : '실행'}
            </button>
          )}

          {/* 형광펜 버튼 */}
          <div className="relative">
            <button
              onClick={() => setShowHighlightMenu(!showHighlightMenu)}
              className="text-xs px-2 py-1 rounded transition flex items-center gap-1"
              style={{ color: currentTheme.comment, backgroundColor: showHighlightMenu ? currentTheme.border : 'transparent' }}
            >
              🖍️ 형광펜
            </button>
            {showHighlightMenu && (
              <div
                className="absolute right-0 top-full mt-1 rounded-lg shadow-lg z-10 min-w-[100px] py-1"
                style={{ backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.border}` }}
              >
                {(Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).map((color) => (
                  <button
                    key={color}
                    onClick={() => addHighlight(color)}
                    className="w-full text-left text-xs px-3 py-1.5 transition flex items-center gap-2"
                    style={{ color: currentTheme.text }}
                  >
                    <span
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: HIGHLIGHT_COLORS[color].border }}
                    />
                    {HIGHLIGHT_COLORS[color].name}
                  </button>
                ))}
                {highlights.length > 0 && (
                  <>
                    <div className="border-t my-1" style={{ borderColor: currentTheme.border }} />
                    <button
                      onClick={clearHighlights}
                      className="w-full text-left text-xs px-3 py-1.5 transition"
                      style={{ color: '#ff5555' }}
                    >
                      🗑️ 전체 삭제
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          <button
            onClick={handleReset}
            className="text-xs px-2 py-1 rounded transition"
            style={{ color: currentTheme.comment }}
          >
            ↺ 초기화
          </button>
        </div>
      </div>
      <Editor
        value={code}
        onValueChange={handleChange}
        highlight={highlight}
        padding={16}
        style={{
          fontFamily: '"Fira Code", "Fira Mono", Menlo, Consolas, monospace',
          fontSize: 14,
          backgroundColor: currentTheme.bg,
          color: currentTheme.text,
          minHeight: '100px',
          lineHeight: 1.6,
        }}
        className="code-editor"
        textareaClassName="code-editor-textarea"
      />

      {/* Python 출력 패널 */}
      {isPython && showOutput && (
        <div className="border-t" style={{ borderColor: currentTheme.border }}>
          <div
            className="flex items-center justify-between px-4 py-1.5 cursor-pointer"
            style={{ backgroundColor: `${currentTheme.border}40` }}
            onClick={() => setShowOutput(!showOutput)}
          >
            <span className="text-xs font-medium" style={{ color: currentTheme.text }}>
              {output?.success ? '✅ 출력' : output?.error ? '❌ 오류' : '⏳ 실행 중...'}
              {output?.executionTime ? (
                <span className="ml-1" style={{ color: currentTheme.comment }}>
                  ({output.executionTime.toFixed(0)}ms)
                </span>
              ) : null}
            </span>
            <span className="text-xs" style={{ color: currentTheme.comment }}>
              {showOutput ? '▲' : '▼'}
            </span>
          </div>
          <div
            className="p-3 font-mono text-xs max-h-[200px] overflow-auto"
            style={{ backgroundColor: '#0d0d14' }}
          >
            {isRunning ? (
              <div className="text-gray-400 flex items-center gap-2">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
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
