'use client'

import { useEffect, useState } from 'react'
import Editor from 'react-simple-code-editor'

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
  const storageKey = `userCode_${taskId}`

  // localStorage에서 복원 + Prism 로드
  useEffect(() => {
    // localStorage에서 저장된 코드 복원
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
  }, [taskId, storageKey, initialCode])

  // 코드 변경 시 localStorage에 저장
  const handleChange = (newCode: string) => {
    setCode(newCode)
    localStorage.setItem(storageKey, newCode)
  }

  // 초기화 - localStorage 삭제 + 원래 코드로
  const handleReset = () => {
    localStorage.removeItem(storageKey)
    setCode(initialCode)
  }

  const highlight = (code: string) => {
    if (!Prism || !Prism.languages[language]) {
      return code
    }
    return Prism.highlight(code, Prism.languages[language], language)
  }

  if (!mounted) {
    // 로딩 중 placeholder
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-600 text-sm font-medium">✏️ 코드 에디터 (직접 수정 가능)</div>
          <button
            onClick={handleReset}
            className="text-xs text-[#6272a4] hover:text-[#f8f8f2] px-2 py-1 rounded hover:bg-[#44475a] transition"
          >
            ↺ 초기화
          </button>
        </div>
        <div className="rounded-xl overflow-hidden border border-[#44475a] bg-[#282a36] p-5 min-h-[200px]">
          <pre className="text-[#f8f8f2] font-mono text-sm">{code}</pre>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-600 text-sm font-medium">
          ✏️ 코드 에디터 (직접 수정 가능)
          <span className="ml-2 text-xs text-[#50fa7b]">💾 자동 저장됨</span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-[#6272a4] hover:text-[#f8f8f2] px-2 py-1 rounded hover:bg-[#44475a] transition"
        >
          ↺ 초기화
        </button>
      </div>
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
    </div>
  )
}
