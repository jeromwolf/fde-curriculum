'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    Configuration: '서버 설정 오류가 발생했습니다.',
    AccessDenied: '접근이 거부되었습니다.',
    Verification: '인증 링크가 만료되었거나 이미 사용되었습니다.',
    OAuthSignin: 'OAuth 로그인을 시작할 수 없습니다.',
    OAuthCallback: 'OAuth 콜백 처리 중 오류가 발생했습니다.',
    OAuthCreateAccount: '이 OAuth 계정으로 사용자를 생성할 수 없습니다.',
    EmailCreateAccount: '이 이메일로 사용자를 생성할 수 없습니다.',
    Callback: '콜백 처리 중 오류가 발생했습니다.',
    OAuthAccountNotLinked: '다른 로그인 방법으로 이미 가입된 이메일입니다.',
    EmailSignin: '이메일 전송에 실패했습니다.',
    CredentialsSignin: '이메일 또는 비밀번호가 올바르지 않습니다.',
    SessionRequired: '로그인이 필요합니다.',
    Default: '인증 중 오류가 발생했습니다.',
  }

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        {/* 에러 아이콘 */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">로그인 오류</h1>

        <p className="text-gray-600 mb-8">{errorMessage}</p>

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="block w-full bg-[#03EF62] text-black font-semibold py-3 rounded-xl hover:bg-[#02d654] transition"
          >
            다시 로그인하기
          </Link>

          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-200 transition"
          >
            홈으로 돌아가기
          </Link>
        </div>

        {error && (
          <p className="mt-6 text-xs text-gray-400">
            오류 코드: {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
