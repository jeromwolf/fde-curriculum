/**
 * 보안 유틸리티 함수
 */

/**
 * HTML 특수문자 이스케이프 (XSS 방지)
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * SQL Injection 방지를 위한 문자열 정리
 * (Prisma ORM 사용 시에도 추가 보안 레이어로 활용)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[;'"\\]/g, '') // SQL 특수문자 제거
    .trim()
}

/**
 * 안전한 슬러그 생성
 */
export function createSafeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '') // 안전한 문자만 허용
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100)
}

/**
 * URL 유효성 검사
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * 이메일 유효성 검사
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 비밀번호 강도 검사
 */
export function checkPasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('8자 이상이어야 합니다')
  }

  if (password.length >= 12) {
    score += 1
  }

  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('소문자를 포함해야 합니다')
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  }

  if (/[0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push('숫자를 포함해야 합니다')
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1
  }

  return {
    isValid: password.length >= 8,
    score,
    feedback,
  }
}

/**
 * CSRF 토큰 생성
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * 안전한 리다이렉트 URL 검증
 * (Open Redirect 공격 방지)
 */
export function isValidRedirectUrl(url: string, allowedHosts: string[]): boolean {
  // 상대 경로는 허용
  if (url.startsWith('/') && !url.startsWith('//')) {
    return true
  }

  try {
    const parsed = new URL(url)
    return allowedHosts.includes(parsed.host)
  } catch {
    return false
  }
}

/**
 * 사용자 입력 길이 제한
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength)
}

/**
 * IP 주소 마스킹 (로깅용)
 */
export function maskIp(ip: string): string {
  const parts = ip.split('.')
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.xxx.xxx`
  }
  // IPv6 또는 기타
  return ip.slice(0, ip.length / 2) + '...'
}

/**
 * 민감한 정보 마스킹
 */
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars) {
    return '*'.repeat(data.length)
  }
  return data.slice(0, visibleChars) + '*'.repeat(data.length - visibleChars)
}

/**
 * 요청 속도 제한을 위한 토큰 버킷 알고리즘
 */
export class TokenBucket {
  private tokens: number
  private lastRefill: number
  private readonly maxTokens: number
  private readonly refillRate: number // 초당 토큰 수

  constructor(maxTokens: number, refillRate: number) {
    this.maxTokens = maxTokens
    this.refillRate = refillRate
    this.tokens = maxTokens
    this.lastRefill = Date.now()
  }

  consume(count: number = 1): boolean {
    this.refill()

    if (this.tokens >= count) {
      this.tokens -= count
      return true
    }

    return false
  }

  private refill(): void {
    const now = Date.now()
    const timePassed = (now - this.lastRefill) / 1000
    const tokensToAdd = timePassed * this.refillRate

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd)
    this.lastRefill = now
  }

  getTokens(): number {
    this.refill()
    return this.tokens
  }
}
