// Pyodide Runner - 브라우저에서 Python 실행
// https://pyodide.org/

// Colab에서 실행 가능한 라이브러리 (브라우저 불가, Colab 가능)
export const COLAB_LIBS = [
  'langchain',
  'langchain_community',
  'langchain_openai',
  'chromadb',
  'openai',
  'anthropic',
  'torch',
  'pytorch',
  'tensorflow',
  'transformers',
  'neo4j',
  'pinecone',
  'faiss',
  'weaviate',
  'qdrant',
  'sentence_transformers',
  'huggingface_hub',
  'llama_index',
  'unstructured',
  'pypdf',
  'pdfplumber',
]

// 로컬 환경에서만 실행 가능한 라이브러리 (브라우저/Colab 모두 불가)
export const LOCAL_ONLY_LIBS = [
  'ollama',  // 로컬 Ollama 서버 필요
]

// 전체 지원 불가 라이브러리 (하위 호환성)
export const UNSUPPORTED_LIBS = [...COLAB_LIBS, ...LOCAL_ONLY_LIBS]

// 코드에서 지원 불가 라이브러리 사용 여부 확인
export function detectUnsupportedLibs(code: string): string[] {
  const detected: string[] = []

  for (const lib of UNSUPPORTED_LIBS) {
    // import lib, from lib import, import lib as
    const patterns = [
      new RegExp(`^\\s*import\\s+${lib}`, 'm'),
      new RegExp(`^\\s*from\\s+${lib}`, 'm'),
      new RegExp(`^\\s*import\\s+\\w+\\s*,\\s*${lib}`, 'm'),
    ]

    if (patterns.some(p => p.test(code))) {
      detected.push(lib)
    }
  }

  return detected
}

// 라이브러리 유형별 분류
export function categorizeUnsupportedLibs(libs: string[]): {
  colabLibs: string[]
  localLibs: string[]
} {
  return {
    colabLibs: libs.filter(lib => COLAB_LIBS.includes(lib)),
    localLibs: libs.filter(lib => LOCAL_ONLY_LIBS.includes(lib)),
  }
}

// Pyodide 인스턴스 (싱글톤)
let pyodideInstance: any = null
let pyodideLoading: Promise<any> | null = null

// Pyodide CDN URL (안정 버전 0.26.2)
const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/'

// 스크립트 로드 헬퍼 (타임아웃 포함)
function loadScript(src: string, timeout = 30000): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 로드된 경우
    if (document.querySelector(`script[src="${src}"]`)) {
      // loadPyodide 함수가 이미 있는지 확인
      if ((window as any).loadPyodide) {
        resolve()
        return
      }
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.crossOrigin = 'anonymous'

    const timeoutId = setTimeout(() => {
      reject(new Error(`Script load timeout (${timeout}ms): ${src}`))
    }, timeout)

    script.onload = () => {
      clearTimeout(timeoutId)
      resolve()
    }
    script.onerror = (e) => {
      clearTimeout(timeoutId)
      reject(new Error(`Failed to load script: ${src}. Check network or CORS settings.`))
    }
    document.head.appendChild(script)
  })
}

// Pyodide 로딩
export async function loadPyodideInstance(): Promise<any> {
  if (pyodideInstance) {
    return pyodideInstance
  }

  if (pyodideLoading) {
    return pyodideLoading
  }

  pyodideLoading = (async () => {
    // Pyodide 스크립트 로드 (전역 loadPyodide 함수 제공)
    await loadScript(`${PYODIDE_CDN}pyodide.js`)

    // 전역 loadPyodide 함수 사용
    const loadPyodide = (window as any).loadPyodide
    if (!loadPyodide) {
      throw new Error('Pyodide 로드 실패: loadPyodide 함수를 찾을 수 없습니다.')
    }

    pyodideInstance = await loadPyodide({
      indexURL: PYODIDE_CDN,
    })

    // 기본 패키지 로드 (선택적 - 시간이 오래 걸릴 수 있음)
    // await pyodideInstance.loadPackage(['micropip'])

    return pyodideInstance
  })()

  return pyodideLoading
}

// 실행 결과 타입
export interface ExecutionResult {
  success: boolean
  output: string
  error?: string
  executionTime: number
}

// Python 코드 실행
export async function runPythonCode(code: string): Promise<ExecutionResult> {
  const startTime = performance.now()

  try {
    const pyodide = await loadPyodideInstance()

    // stdout/stderr 캡처 설정
    await pyodide.runPythonAsync(`
import sys
from io import StringIO

# 출력 캡처
_stdout_capture = StringIO()
_stderr_capture = StringIO()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
`)

    // 사용자 코드 실행
    let result
    try {
      result = await pyodide.runPythonAsync(code)
    } catch (e: any) {
      // Python 에러 처리
      const executionTime = performance.now() - startTime

      // stderr 가져오기
      const stderr = await pyodide.runPythonAsync('_stderr_capture.getvalue()')

      // stdout/stderr 리셋
      await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`)

      return {
        success: false,
        output: stderr || '',
        error: e.message || String(e),
        executionTime,
      }
    }

    // stdout 가져오기
    const stdout = await pyodide.runPythonAsync('_stdout_capture.getvalue()')

    // stdout/stderr 리셋
    await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`)

    const executionTime = performance.now() - startTime

    // 결과 처리
    let output = stdout || ''
    if (result !== undefined && result !== null && String(result) !== 'None') {
      if (output) output += '\n'
      output += String(result)
    }

    return {
      success: true,
      output: output || '(출력 없음)',
      executionTime,
    }

  } catch (e: any) {
    const executionTime = performance.now() - startTime
    return {
      success: false,
      output: '',
      error: `Pyodide 오류: ${e.message || String(e)}`,
      executionTime,
    }
  }
}

// Pyodide 로딩 상태
export function isPyodideLoaded(): boolean {
  return pyodideInstance !== null
}

// Pyodide 로딩 진행 중 여부
export function isPyodideLoading(): boolean {
  return pyodideLoading !== null && pyodideInstance === null
}
