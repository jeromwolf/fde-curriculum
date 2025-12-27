import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// 인증이 필요한 경로
const protectedPaths = [
  '/profile',
  '/members',
  '/community/new',
  '/checkout',
  '/learn',
]

// 인증된 사용자는 접근할 수 없는 경로
const authPaths = [
  '/auth/login',
  '/auth/register',
]

// 관리자만 접근 가능한 경로
const adminPaths = [
  '/admin',
]

// 유료 회원만 접근 가능한 경로
// Phase 3는 무료 체험용으로 개방
const premiumPaths = [
  '/learn/phase/4',
  '/learn/phase/5',
  '/learn/phase/6',
]

// Rate limiting을 위한 간단한 메모리 저장소
// 프로덕션에서는 Redis 사용 권장
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limit 설정
const RATE_LIMIT_WINDOW = 60 * 1000 // 1분
const RATE_LIMIT_MAX_REQUESTS = 100 // 분당 최대 요청 수
const RATE_LIMIT_API_MAX_REQUESTS = 30 // API 분당 최대 요청 수

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return ip
}

function isRateLimited(key: string, maxRequests: number): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (record.count >= maxRequests) {
    return true
  }

  record.count++
  return false
}

// 주기적으로 오래된 rate limit 기록 정리 (메모리 누수 방지)
setInterval(() => {
  const now = Date.now()
  const keys = Array.from(rateLimitMap.keys())
  for (const key of keys) {
    const value = rateLimitMap.get(key)
    if (value && now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, RATE_LIMIT_WINDOW)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const clientIP = getClientIP(request)

  // 1. Rate Limiting
  const isApiRoute = pathname.startsWith('/api/')
  const rateLimitKey = `${clientIP}:${isApiRoute ? 'api' : 'page'}`
  const maxRequests = isApiRoute ? RATE_LIMIT_API_MAX_REQUESTS : RATE_LIMIT_MAX_REQUESTS

  if (isRateLimited(rateLimitKey, maxRequests)) {
    return new NextResponse(
      JSON.stringify({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      }
    )
  }

  // 2. 보안 헤더 추가
  const response = NextResponse.next()

  // XSS 방지
  response.headers.set('X-XSS-Protection', '1; mode=block')
  // Content Type Sniffing 방지
  response.headers.set('X-Content-Type-Options', 'nosniff')
  // Clickjacking 방지
  response.headers.set('X-Frame-Options', 'DENY')
  // Referrer 정책
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  // Content Security Policy (Pyodide CDN 허용 추가)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.tosspayments.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.tosspayments.com https://*.googleapis.com https://cdn.jsdelivr.net; worker-src 'self' blob:;"
  )

  // API 라우트는 인증 체크 스킵 (API 내부에서 처리)
  if (isApiRoute) {
    return response
  }

  // 3. 인증 체크 (Auth.js v5 호환)
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    cookieName: process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token',
  })

  const isAuthenticated = !!token
  const userAccessLevel = (token?.accessLevel as string) || 'FREE'

  // 인증된 사용자가 로그인/회원가입 페이지 접근 시 홈으로 리다이렉트
  if (isAuthenticated && authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 보호된 경로 접근 시 인증 체크
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(pathname)
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${callbackUrl}`, request.url)
      )
    }
  }

  // 관리자 경로 접근 체크 (향후 admin role 추가 시)
  if (adminPaths.some((path) => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    // TODO: admin role 체크
    // if (token?.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/', request.url))
    // }
  }

  // 유료 콘텐츠 접근 체크
  if (premiumPaths.some((path) => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(pathname)
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${callbackUrl}`, request.url)
      )
    }

    // 무료 사용자는 유료 콘텐츠 접근 불가
    if (userAccessLevel === 'FREE') {
      return NextResponse.redirect(
        new URL('/pricing?reason=premium', request.url)
      )
    }

    // BASIC 사용자는 Phase 3-4까지만
    if (userAccessLevel === 'BASIC') {
      const phase = parseInt(pathname.split('/phase/')[1] || '0')
      if (phase > 2) {
        return NextResponse.redirect(
          new URL('/pricing?reason=upgrade', request.url)
        )
      }
    }

    // PRO 사용자는 Phase 5-6 접근 불가
    if (userAccessLevel === 'PRO') {
      const phase = parseInt(pathname.split('/phase/')[1] || '0')
      if (phase > 4) {
        return NextResponse.redirect(
          new URL('/pricing?reason=upgrade', request.url)
        )
      }
    }
  }

  return response
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
