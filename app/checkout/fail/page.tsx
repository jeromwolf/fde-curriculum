'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function FailContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const message = searchParams.get('message')

  const errorMessages: Record<string, string> = {
    PAY_PROCESS_CANCELED: '결제가 취소되었습니다.',
    PAY_PROCESS_ABORTED: '결제가 중단되었습니다.',
    REJECT_CARD_COMPANY: '카드사에서 결제를 거부했습니다.',
    INVALID_CARD_EXPIRATION: '카드 유효기간이 올바르지 않습니다.',
    INVALID_STOPPED_CARD: '정지된 카드입니다.',
    EXCEED_MAX_DAILY_PAYMENT_COUNT: '일일 결제 한도를 초과했습니다.',
    EXCEED_MAX_PAYMENT_AMOUNT: '결제 금액 한도를 초과했습니다.',
    INVALID_CARD_INSTALLMENT_PLAN: '할부 개월이 올바르지 않습니다.',
    INVALID_CARD_LOST_OR_STOLEN: '분실 또는 도난 카드입니다.',
    RESTRICTED_CARD: '사용이 제한된 카드입니다.',
    INVALID_CARD_NUMBER: '카드 번호가 올바르지 않습니다.',
    NOT_SUPPORTED_INSTALLMENT_PLAN_CARD_OR_MERCHANT: '할부가 지원되지 않는 카드입니다.',
    INVALID_CARD_BIN: '지원하지 않는 카드입니다.',
  }

  const displayMessage = code ? (errorMessages[code] || message || '결제 중 오류가 발생했습니다.') : '결제 중 오류가 발생했습니다.'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">결제 실패</h1>
        <p className="text-gray-600 mb-8">{displayMessage}</p>

        {code && (
          <p className="text-xs text-gray-400 mb-6">오류 코드: {code}</p>
        )}

        <div className="space-y-3">
          <Link
            href="/pricing"
            className="block w-full bg-[#03EF62] text-black font-semibold py-3 rounded-xl hover:bg-[#02d654] transition"
          >
            다시 시도하기
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-200 transition"
          >
            홈으로 돌아가기
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          문제가 계속되면{' '}
          <a href="mailto:support@fde-academy.ai.kr" className="text-[#03EF62] hover:underline">
            고객센터
          </a>
          로 문의해주세요.
        </p>
      </div>
    </div>
  )
}

export default function FailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    }>
      <FailContent />
    </Suspense>
  )
}
