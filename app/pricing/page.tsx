'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const PLANS = [
  {
    id: 'FREE',
    name: '무료',
    price: 0,
    period: '',
    description: '온톨로지와 데이터 엔지니어링을 체험해보세요',
    features: [
      'Phase 1 일부 콘텐츠',
      '커뮤니티 읽기',
      '기본 시뮬레이터',
    ],
    notIncluded: [
      '전체 커리큘럼',
      '코드리뷰',
      '멘토링',
    ],
    cta: '무료로 시작',
    popular: false,
  },
  {
    id: 'BASIC',
    name: '베이직',
    price: 29000,
    period: '/월',
    description: '기초부터 탄탄하게 배우고 싶은 분',
    features: [
      'Phase 1-2 전체 콘텐츠',
      '커뮤니티 참여',
      '월간 라이브 Q&A',
      '실습 과제 피드백',
    ],
    notIncluded: [
      '1:1 코드리뷰',
      '취업 지원',
    ],
    cta: '베이직 시작',
    popular: false,
  },
  {
    id: 'PRO',
    name: '프로',
    price: 79000,
    period: '/월',
    description: 'FDE로 취업을 준비하는 분',
    features: [
      'Phase 1-4 전체 콘텐츠',
      '1:1 코드리뷰 (주 1회)',
      '프로젝트 피드백',
      '취업 지원 (이력서/포트폴리오)',
      '우선 질문 답변',
    ],
    notIncluded: [
      '전용 슬랙 채널',
      '멘토링 세션',
    ],
    cta: '프로 시작',
    popular: true,
  },
  {
    id: 'ENTERPRISE',
    name: '엔터프라이즈',
    price: 199000,
    period: '/월',
    description: '팀 단위 교육 또는 심화 학습',
    features: [
      '전체 콘텐츠 (Phase 1-6)',
      '전용 슬랙 채널',
      '1:1 멘토링 세션 (월 2회)',
      'FDE 인증서 발급',
      '기업 맞춤 커리큘럼',
      '우선 기술 지원',
    ],
    notIncluded: [],
    cta: '문의하기',
    popular: false,
  },
]

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSelectPlan = (planId: string) => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/checkout?plan=${planId}`)
      return
    }

    if (planId === 'FREE') {
      router.push('/curriculum')
      return
    }

    if (planId === 'ENTERPRISE') {
      window.location.href = 'mailto:fde@example.com?subject=엔터프라이즈 플랜 문의'
      return
    }

    router.push(`/checkout?plan=${planId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#03EF62] rounded-xl flex items-center justify-center">
              <span className="text-black font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">FDE Academy</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            당신의 FDE 여정을 시작하세요
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Forward Deployed Engineer가 되기 위한 체계적인 커리큘럼.
            당신에게 맞는 플랜을 선택하세요.
          </p>
        </div>

        {/* 플랜 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden relative ${
                plan.popular ? 'ring-2 ring-[#03EF62]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-[#03EF62] text-black text-center py-1 text-sm font-semibold">
                  가장 인기
                </div>
              )}

              <div className={`p-6 ${plan.popular ? 'pt-10' : ''}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price === 0 ? '무료' : `₩${plan.price.toLocaleString()}`}
                  </span>
                  {plan.period && (
                    <span className="text-gray-500">{plan.period}</span>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    plan.popular
                      ? 'bg-[#03EF62] text-black hover:bg-[#02d654]'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>

              <div className="px-6 pb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">포함된 기능:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-5 h-5 text-[#03EF62] flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.notIncluded.length > 0 && (
                  <>
                    <h4 className="text-sm font-semibold text-gray-400 mt-4 mb-2">미포함:</h4>
                    <ul className="space-y-2">
                      {plan.notIncluded.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <svg
                            className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="text-gray-400">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                결제는 어떻게 하나요?
              </summary>
              <p className="mt-2 text-gray-600">
                토스페이먼츠를 통해 신용카드, 체크카드, 계좌이체로 결제할 수 있습니다.
                월 자동결제로 편리하게 이용하실 수 있습니다.
              </p>
            </details>
            <details className="bg-white rounded-lg shadow p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                환불 정책이 어떻게 되나요?
              </summary>
              <p className="mt-2 text-gray-600">
                결제 후 7일 이내 콘텐츠 이용이 없는 경우 전액 환불이 가능합니다.
                이후에는 이용하지 않은 기간에 대해 일할 계산하여 환불해드립니다.
              </p>
            </details>
            <details className="bg-white rounded-lg shadow p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                플랜 변경이 가능한가요?
              </summary>
              <p className="mt-2 text-gray-600">
                언제든지 상위 또는 하위 플랜으로 변경 가능합니다.
                변경 시 남은 기간은 일할 계산되어 다음 결제에 반영됩니다.
              </p>
            </details>
            <details className="bg-white rounded-lg shadow p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                기업 단체 구매가 가능한가요?
              </summary>
              <p className="mt-2 text-gray-600">
                네, 5인 이상 단체 구매 시 할인이 적용됩니다.
                엔터프라이즈 플랜으로 문의해주시면 맞춤 견적을 드립니다.
              </p>
            </details>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            아직 고민되시나요? 무료 플랜으로 먼저 체험해보세요.
          </p>
          <Link
            href="/curriculum"
            className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition"
          >
            커리큘럼 살펴보기
          </Link>
        </div>
      </div>
    </div>
  )
}
