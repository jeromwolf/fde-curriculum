'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Editor from 'react-simple-code-editor'

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
  blockId: string // 고유 ID (taskId + 블록 인덱스)
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
  const themeKey = 'codeEditorTheme' // 전역 테마 설정

  // localStorage에서 복원 + Prism 로드
  useEffect(() => {
    // localStorage에서 저장된 코드 복원
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setCode(saved)
    }
    // 테마 복원
    const savedTheme = localStorage.getItem(themeKey) as ThemeKey
    if (savedTheme && THEMES[savedTheme]) {
      setTheme(savedTheme)
    }
    // 하이라이트 복원
    const savedHighlights = localStorage.getItem(highlightKey)
    if (savedHighlights) {
      try {
        setHighlights(JSON.parse(savedHighlights))
      } catch (e) {}
    }

    // Prism 로드 (한 번만)
    if (prismLoaded) {
      setMounted(true)
      return
    }

    import('prismjs').then((mod) => {
      Prism = mod.default
      // 여러 언어 지원
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
  }, [storageKey])

  // 코드 변경 시 localStorage에 저장
  const handleChange = useCallback((newCode: string) => {
    setCode(newCode)
    localStorage.setItem(storageKey, newCode)
  }, [storageKey])

  // 초기화 (코드 + 하이라이트 모두)
  const handleReset = useCallback(() => {
    localStorage.removeItem(storageKey)
    localStorage.removeItem(highlightKey)
    setCode(initialCode)
    setHighlights([])
  }, [storageKey, highlightKey, initialCode])

  // 테마 변경
  const handleThemeChange = useCallback((newTheme: ThemeKey) => {
    setTheme(newTheme)
    localStorage.setItem(themeKey, newTheme)
    setShowThemeMenu(false)
  }, [themeKey])

  // 하이라이트 추가
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
      // 겹치는 하이라이트 제거
      !(h.start < end && h.end > start)
    ), newHighlight]

    setHighlights(newHighlights)
    localStorage.setItem(highlightKey, JSON.stringify(newHighlights))
    setShowHighlightMenu(false)
  }, [highlights, highlightKey])

  // 하이라이트 전체 삭제
  const clearHighlights = useCallback(() => {
    setHighlights([])
    localStorage.removeItem(highlightKey)
  }, [highlightKey])

  const currentTheme = THEMES[theme]

  // HTML에서 텍스트 인덱스를 HTML 인덱스로 매핑
  const applyHighlightsToHTML = useCallback((html: string, textLength: number) => {
    if (highlights.length === 0) return html

    // 텍스트 인덱스 -> HTML 인덱스 매핑 배열 생성
    const textToHtml: number[] = []
    let textIdx = 0
    let inTag = false

    for (let i = 0; i < html.length; i++) {
      if (html[i] === '<') {
        inTag = true
      } else if (html[i] === '>') {
        inTag = false
      } else if (!inTag) {
        // HTML 엔티티 처리 (&amp; &lt; &gt; 등)
        if (html[i] === '&') {
          const semiIdx = html.indexOf(';', i)
          if (semiIdx !== -1 && semiIdx - i < 8) {
            textToHtml[textIdx++] = i
            i = semiIdx // 세미콜론으로 이동
            continue
          }
        }
        textToHtml[textIdx++] = i
      }
    }
    textToHtml[textIdx] = html.length // 끝 위치

    // 하이라이트를 뒤에서부터 적용 (인덱스 밀림 방지)
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
      // Prism 없을 때는 텍스트에 직접 적용
      if (highlights.length === 0) return codeText
      return applyHighlightsToHTML(codeText, codeText.length)
    }

    const lang = Prism.languages[language] || Prism.languages.plaintext
    const prismHighlighted = Prism.highlight(codeText, lang, language)

    if (highlights.length === 0) return prismHighlighted

    // Prism HTML에 형광펜 적용 (기존 색상 유지)
    return applyHighlightsToHTML(prismHighlighted, codeText.length)
  }, [language, highlights, applyHighlightsToHTML])

  // 로딩 중
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
    </div>
  )
}
