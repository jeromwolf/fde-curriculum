'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [isProcessing, setIsProcessing] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const paymentKey = searchParams.get('paymentKey')
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')
  const plan = searchParams.get('plan')

  useEffect(() => {
    const confirmPayment = async () => {
      if (!paymentKey || !orderId || !amount || !plan) {
        setError('결제 정보가 올바르지 않습니다.')
        setIsProcessing(false)
        return
      }

      try {
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount),
            plan,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '결제 확인에 실패했습니다.')
        }

        setIsSuccess(true)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsProcessing(false)
      }
    }

    confirmPayment()
  }, [paymentKey, orderId, amount, plan])

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#03EF62] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">결제를 처리하고 있습니다...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">결제 처리 실패</h1>
          <p className="text-gray-600 mb-8">{error}</p>
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-[#03EF62]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[#03EF62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 완료!</h1>
        <p className="text-gray-600 mb-8">
          FDE Academy 구독이 시작되었습니다.<br />
          이제 모든 콘텐츠를 이용하실 수 있습니다.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">결제 정보</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">주문번호</span>
              <span className="text-gray-900 font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">결제금액</span>
              <span className="text-gray-900">₩{parseInt(amount || '0').toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">플랜</span>
              <span className="text-gray-900">{plan}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/curriculum"
            className="block w-full bg-[#03EF62] text-black font-semibold py-3 rounded-xl hover:bg-[#02d654] transition"
          >
            학습 시작하기
          </Link>
          <Link
            href="/profile"
            className="block w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-200 transition"
          >
            내 프로필 보기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
