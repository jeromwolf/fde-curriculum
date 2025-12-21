import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { checkRateLimit, getIpFromRequest, createRateLimitKey } from '@/lib/rate-limiter'
import { isValidEmail, checkPasswordStrength, sanitizeInput, truncate } from '@/lib/security'
import { sendWelcomeEmail } from '@/lib/services/email'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (auth 타입 - 더 엄격)
    const ip = getIpFromRequest(request)
    const rateLimitKey = createRateLimitKey(ip, undefined, 'register')
    const rateLimitResult = checkRateLimit(rateLimitKey, 'auth')

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
          },
        }
      )
    }

    const { email, password, name } = await request.json()

    // 입력값 정리
    const cleanEmail = sanitizeInput(email?.trim() || '')
    const cleanName = name ? truncate(sanitizeInput(name.trim()), 50) : null

    // 유효성 검사
    if (!cleanEmail || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호는 필수입니다' },
        { status: 400 }
      )
    }

    // 이메일 형식 검사 (보안 유틸리티 사용)
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다' },
        { status: 400 }
      )
    }

    // 비밀번호 강도 검사 (보안 유틸리티 사용)
    const passwordCheck = checkPasswordStrength(password)
    if (!passwordCheck.isValid) {
      return NextResponse.json(
        { error: passwordCheck.feedback.join(', ') || '비밀번호는 8자 이상이어야 합니다' },
        { status: 400 }
      )
    }

    // 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 등록된 이메일입니다' },
        { status: 409 }
      )
    }

    // 비밀번호 해시
    const hashedPassword = await bcrypt.hash(password, 12)

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        name: cleanName || cleanEmail.split('@')[0],
        password: hashedPassword,
      },
    })

    // 프로필 자동 생성
    await prisma.profile.create({
      data: {
        userId: user.id,
      },
    })

    // 환영 이메일 발송 (비동기, 실패해도 회원가입은 성공)
    sendWelcomeEmail(user.email, user.name || user.email.split('@')[0])
      .then((result) => {
        if (result.success) {
          console.log('Welcome email sent to:', user.email)
        } else {
          console.warn('Welcome email failed:', result.error)
        }
      })
      .catch((err) => console.error('Welcome email error:', err))

    return NextResponse.json({
      success: true,
      message: '회원가입이 완료되었습니다',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
