'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'

const PLANS: Record<string, { name: string; price: number; features: string[] }> = {
  BASIC: {
    name: '베이직',
    price: 29000,
    features: ['Phase 1-2 전체 콘텐츠', '커뮤니티 참여', '월간 라이브 Q&A'],
  },
  PRO: {
    name: '프로',
    price: 79000,
    features: ['Phase 1-4 전체 콘텐츠', '1:1 코드리뷰', '프로젝트 피드백', '취업 지원'],
  },
  ENTERPRISE: {
    name: '엔터프라이즈',
    price: 199000,
    features: ['전체 콘텐츠', '전용 슬랙 채널', '멘토링 세션', '인증서 발급'],
  },
}

function CheckoutContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan') || 'PRO'

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [tossReady, setTossReady] = useState(false)

  const plan = PLANS[planId]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/auth/login?callbackUrl=/checkout?plan=${planId}`)
    }
  }, [status, router, planId])

  useEffect(() => {
    // 토스페이먼츠 SDK 로드 확인
    const checkToss = () => {
      if (typeof window !== 'undefined' && (window as any).TossPayments) {
        setTossReady(true)
      }
    }
    checkToss()

    // SDK가 나중에 로드되는 경우를 위한 인터벌
    const interval = setInterval(checkToss, 100)
    setTimeout(() => clearInterval(interval), 5000)

    return () => clearInterval(interval)
  }, [])

  const handlePayment = async () => {
    if (!tossReady) {
      setError('결제 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    if (!session?.user?.id) {
      router.push(`/auth/login?callbackUrl=/checkout?plan=${planId}`)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY

      if (!clientKey) {
        throw new Error('결제 설정이 완료되지 않았습니다. 관리자에게 문의해주세요.')
      }

      const tossPayments = (window as any).TossPayments(clientKey)

      // 주문 ID 생성
      const orderId = `FDE_${planId}_${session.user.id}_${Date.now()}`

      // 결제 위젯 호출
      await tossPayments.requestPayment('카드', {
        amount: plan.price,
        orderId,
        orderName: `FDE Academy ${plan.name} 플랜 (월간)`,
        customerName: session.user.name || '고객',
        customerEmail: session.user.email,
        successUrl: `${window.location.origin}/checkout/success?plan=${planId}`,
        failUrl: `${window.location.origin}/checkout/fail`,
      })
    } catch (err: any) {
      if (err.code === 'USER_CANCEL') {
        setError('결제가 취소되었습니다.')
      } else {
        setError(err.message || '결제 처리 중 오류가 발생했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">유효하지 않은 플랜입니다.</p>
          <Link href="/pricing" className="text-[#03EF62] hover:underline">
            플랜 선택으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v1/payment"
        strategy="afterInteractive"
        onLoad={() => setTossReady(true)}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto px-4">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#03EF62] rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">FDE Academy</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">결제하기</h1>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* 주문 요약 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">주문 요약</h2>

            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="font-semibold text-gray-900">{plan.name} 플랜</p>
                <p className="text-sm text-gray-500">월간 구독</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                ₩{plan.price.toLocaleString()}
              </p>
            </div>

            <div className="py-4">
              <p className="text-sm font-medium text-gray-700 mb-2">포함된 기능:</p>
              <ul className="space-y-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-[#03EF62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <p className="font-semibold text-gray-900">결제 금액</p>
              <p className="text-2xl font-bold text-[#03EF62]">
                ₩{plan.price.toLocaleString()}
              </p>
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">결제 정보</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">이메일</span>
                <span className="text-gray-900">{session?.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">결제 방식</span>
                <span className="text-gray-900">신용/체크카드</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">결제 주기</span>
                <span className="text-gray-900">매월 자동결제</span>
              </div>
            </div>
          </div>

          {/* 결제 버튼 */}
          <button
            onClick={handlePayment}
            disabled={isLoading || !tossReady}
            className="w-full py-4 bg-[#03EF62] text-black font-bold text-lg rounded-xl hover:bg-[#02d654] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '처리 중...' : !tossReady ? '결제 준비 중...' : `₩${plan.price.toLocaleString()} 결제하기`}
          </button>

          {/* 약관 */}
          <p className="mt-4 text-xs text-gray-500 text-center">
            결제를 진행하면{' '}
            <Link href="/terms" className="text-[#03EF62] hover:underline">
              이용약관
            </Link>
            {' '}및{' '}
            <Link href="/privacy" className="text-[#03EF62] hover:underline">
              개인정보처리방침
            </Link>
            에 동의하는 것으로 간주됩니다.
          </p>

          {/* 되돌아가기 */}
          <p className="mt-6 text-center">
            <Link href="/pricing" className="text-gray-500 hover:text-gray-700">
              ← 플랜 선택으로 돌아가기
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
