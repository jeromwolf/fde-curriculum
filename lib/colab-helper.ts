// Google Colab 연결 헬퍼

/**
 * Python 코드를 Google Colab에서 열 수 있는 URL 생성
 *
 * Colab은 GitHub Gist를 통해 코드를 로드할 수 있지만,
 * 직접 코드를 전달하는 가장 간단한 방법은 코드를 클립보드에 복사하고
 * 빈 노트북을 여는 것입니다.
 *
 * 더 고급 방법: GitHub Gist API를 사용하여 임시 Gist 생성 후 연결
 */

// Colab 빈 노트북 URL
const COLAB_CREATE_URL = 'https://colab.research.google.com/#create=true'

// Colab에서 코드 열기 (새 탭)
export async function openInColab(code: string, title?: string): Promise<void> {
  // 코드를 클립보드에 복사 (완료될 때까지 대기)
  const copied = await copyToClipboard(code)

  if (copied) {
    // 사용자에게 안내 후 Colab 열기
    alert(
      '✅ 코드가 클립보드에 복사되었습니다!\n\n' +
      'Google Colab 노트북이 열립니다.\n' +
      '첫 번째 셀에 붙여넣기(Ctrl+V / Cmd+V)하여 실행하세요.'
    )
  } else {
    // 복사 실패 시 수동 복사 안내
    alert(
      '⚠️ 자동 복사에 실패했습니다.\n\n' +
      '아래 단계를 따라주세요:\n' +
      '1. 코드 에디터에서 코드를 직접 선택 (Ctrl+A / Cmd+A)\n' +
      '2. 복사 (Ctrl+C / Cmd+C)\n' +
      '3. Colab에서 붙여넣기 (Ctrl+V / Cmd+V)'
    )
  }

  // Colab 노트북 열기
  window.open(COLAB_CREATE_URL, '_blank')
}

// 클립보드에 복사
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      return true
    } catch {
      return false
    } finally {
      textArea.remove()
    }
  }
}

/**
 * 설치 명령어 포함한 Colab 코드 생성
 *
 * 필요한 pip 패키지가 있으면 !pip install 명령어를 코드 앞에 추가
 */
export function generateColabCode(code: string, packages?: string[]): string {
  let colabCode = ''

  // 필요한 패키지가 있으면 설치 명령어 추가
  if (packages && packages.length > 0) {
    colabCode += `# 필요한 패키지 설치\n`
    colabCode += `!pip install ${packages.join(' ')}\n\n`
  }

  // 원본 코드 추가
  colabCode += code

  return colabCode
}

/**
 * 코드에서 import된 패키지 추출
 */
export function extractImportedPackages(code: string): string[] {
  const packages = new Set<string>()

  // import xxx
  const importPattern = /^import\s+(\w+)/gm
  let match
  while ((match = importPattern.exec(code)) !== null) {
    packages.add(match[1])
  }

  // from xxx import
  const fromPattern = /^from\s+(\w+)/gm
  while ((match = fromPattern.exec(code)) !== null) {
    packages.add(match[1])
  }

  // 표준 라이브러리 제외
  const stdLibs = new Set([
    'os', 'sys', 'json', 'time', 'datetime', 'math', 'random',
    'collections', 'itertools', 'functools', 'typing', 're',
    'pathlib', 'io', 'pickle', 'csv', 'sqlite3', 'urllib',
    'http', 'email', 'html', 'xml', 'logging', 'unittest',
    'asyncio', 'threading', 'multiprocessing', 'subprocess',
    'copy', 'pprint', 'textwrap', 'string', 'struct',
    'hashlib', 'hmac', 'secrets', 'base64', 'binascii',
    'abc', 'contextlib', 'dataclasses', 'enum', 'warnings',
  ])

  return Array.from(packages).filter(p => !stdLibs.has(p))
}

/**
 * Colab 친화적인 코드인지 확인
 * (대부분의 Python 코드는 Colab에서 실행 가능)
 */
export function isColabCompatible(code: string): boolean {
  // Colab에서 실행 불가능한 패턴 감지
  const incompatiblePatterns = [
    /input\s*\(/,  // input() 함수 (Colab에서는 지원하지만 동작이 다름)
    /tkinter/i,   // GUI 라이브러리
    /pygame/i,    // 게임 라이브러리
  ]

  // 대부분의 경우 Colab에서 실행 가능
  return !incompatiblePatterns.some(p => p.test(code))
}
