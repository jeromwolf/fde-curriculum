/**
 * API Rate Limiter
 * 프로덕션에서는 Redis 사용 권장
 */

interface RateLimitConfig {
  interval: number // 밀리초
  maxRequests: number
}

interface RateLimitRecord {
  count: number
  resetTime: number
}

// 메모리 기반 저장소 (서버리스 환경에서는 Redis 사용 권장)
const store = new Map<string, RateLimitRecord>()

// 기본 설정
const defaultConfigs: Record<string, RateLimitConfig> = {
  // 일반 API
  default: {
    interval: 60 * 1000, // 1분
    maxRequests: 60,
  },
  // 인증 관련 (더 엄격)
  auth: {
    interval: 60 * 1000, // 1분
    maxRequests: 10,
  },
  // 결제 관련 (가장 엄격)
  payment: {
    interval: 60 * 1000, // 1분
    maxRequests: 5,
  },
  // 글 작성 (스팸 방지)
  write: {
    interval: 60 * 1000, // 1분
    maxRequests: 10,
  },
  // 검색
  search: {
    interval: 60 * 1000, // 1분
    maxRequests: 30,
  },
}

export type RateLimitType = keyof typeof defaultConfigs

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

/**
 * Rate Limit 체크
 */
export function checkRateLimit(
  key: string,
  type: RateLimitType = 'default'
): RateLimitResult {
  const config = defaultConfigs[type]
  const now = Date.now()

  const record = store.get(key)

  // 기록이 없거나 만료된 경우
  if (!record || now > record.resetTime) {
    store.set(key, {
      count: 1,
      resetTime: now + config.interval,
    })

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.interval,
    }
  }

  // 제한 초과
  if (record.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    }
  }

  // 카운트 증가
  record.count++

  return {
    success: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  }
}

/**
 * Rate Limit 키 생성
 */
export function createRateLimitKey(
  ip: string,
  userId?: string,
  endpoint?: string
): string {
  const parts = [ip]
  if (userId) parts.push(userId)
  if (endpoint) parts.push(endpoint)
  return parts.join(':')
}

/**
 * 요청에서 IP 추출
 */
export function getIpFromRequest(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return 'unknown'
}

/**
 * Rate Limit 미들웨어 헬퍼
 * API 라우트에서 사용
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  type: RateLimitType = 'default'
) {
  return async (request: Request): Promise<Response> => {
    const ip = getIpFromRequest(request)
    const key = createRateLimitKey(ip, undefined, request.url)

    const result = checkRateLimit(key, type)

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetTime.toString(),
            'Retry-After': result.retryAfter?.toString() || '60',
          },
        }
      )
    }

    const response = await handler(request)

    // Rate limit 헤더 추가
    const headers = new Headers(response.headers)
    headers.set('X-RateLimit-Remaining', result.remaining.toString())
    headers.set('X-RateLimit-Reset', result.resetTime.toString())

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }
}

/**
 * 오래된 기록 정리 (메모리 관리)
 */
export function cleanupExpiredRecords(): void {
  const now = Date.now()
  const keys = Array.from(store.keys())
  for (const key of keys) {
    const record = store.get(key)
    if (record && now > record.resetTime) {
      store.delete(key)
    }
  }
}

// 주기적 정리 (5분마다)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredRecords, 5 * 60 * 1000)
}
