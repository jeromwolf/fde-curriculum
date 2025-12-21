/**
 * 토스페이먼츠 결제 서비스
 * https://docs.tosspayments.com/reference
 */

const TOSS_API_BASE = 'https://api.tosspayments.com/v1'

interface TossPaymentRequest {
  paymentKey: string
  orderId: string
  amount: number
}

interface TossPaymentResponse {
  mId: string
  lastTransactionKey: string
  paymentKey: string
  orderId: string
  orderName: string
  taxExemptionAmount: number
  status: 'READY' | 'IN_PROGRESS' | 'WAITING_FOR_DEPOSIT' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED'
  requestedAt: string
  approvedAt: string
  useEscrow: boolean
  cultureExpense: boolean
  card?: {
    issuerCode: string
    acquirerCode: string
    number: string
    installmentPlanMonths: number
    isInterestFree: boolean
    interestPayer: string
    approveNo: string
    useCardPoint: boolean
    cardType: string
    ownerType: string
    acquireStatus: string
    amount: number
  }
  virtualAccount?: {
    accountNumber: string
    accountType: string
    bankCode: string
    customerName: string
    dueDate: string
    refundStatus: string
    expired: boolean
    settlementStatus: string
  }
  transfer?: {
    bankCode: string
    settlementStatus: string
  }
  mobilePhone?: {
    carrier: string
    customerMobilePhone: string
    settlementStatus: string
  }
  giftCertificate?: {
    approveNo: string
    settlementStatus: string
  }
  cashReceipt?: {
    type: string
    amount: number
    taxFreeAmount: number
    issueNumber: string
    receiptUrl: string
  }
  discount?: {
    amount: number
  }
  cancels?: Array<{
    cancelAmount: number
    cancelReason: string
    taxFreeAmount: number
    taxAmount: number
    refundableAmount: number
    canceledAt: string
    transactionKey: string
  }>
  secret?: string
  type: string
  easyPay?: {
    provider: string
    amount: number
    discountAmount: number
  }
  country: string
  failure?: {
    code: string
    message: string
  }
  isPartialCancelable: boolean
  receipt: {
    url: string
  }
  checkout: {
    url: string
  }
  currency: string
  totalAmount: number
  balanceAmount: number
  suppliedAmount: number
  vat: number
  taxFreeAmount: number
  method: string
  version: string
}

interface TossErrorResponse {
  code: string
  message: string
}

class TossPaymentsService {
  private secretKey: string

  constructor() {
    const secretKey = process.env.TOSS_SECRET_KEY
    if (!secretKey) {
      console.warn('TOSS_SECRET_KEY is not set. Payments will not work.')
    }
    this.secretKey = secretKey || ''
  }

  private getAuthHeader(): string {
    const encoded = Buffer.from(`${this.secretKey}:`).toString('base64')
    return `Basic ${encoded}`
  }

  /**
   * 결제 승인
   */
  async confirmPayment(request: TossPaymentRequest): Promise<TossPaymentResponse> {
    const response = await fetch(`${TOSS_API_BASE}/payments/confirm`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey: request.paymentKey,
        orderId: request.orderId,
        amount: request.amount,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const error = data as TossErrorResponse
      throw new Error(`토스페이먼츠 오류: ${error.message} (${error.code})`)
    }

    return data as TossPaymentResponse
  }

  /**
   * 결제 조회
   */
  async getPayment(paymentKey: string): Promise<TossPaymentResponse> {
    const response = await fetch(`${TOSS_API_BASE}/payments/${paymentKey}`, {
      method: 'GET',
      headers: {
        Authorization: this.getAuthHeader(),
      },
    })

    const data = await response.json()

    if (!response.ok) {
      const error = data as TossErrorResponse
      throw new Error(`토스페이먼츠 오류: ${error.message} (${error.code})`)
    }

    return data as TossPaymentResponse
  }

  /**
   * 결제 취소
   */
  async cancelPayment(
    paymentKey: string,
    cancelReason: string,
    cancelAmount?: number
  ): Promise<TossPaymentResponse> {
    const body: any = { cancelReason }
    if (cancelAmount) {
      body.cancelAmount = cancelAmount
    }

    const response = await fetch(`${TOSS_API_BASE}/payments/${paymentKey}/cancel`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      const error = data as TossErrorResponse
      throw new Error(`토스페이먼츠 오류: ${error.message} (${error.code})`)
    }

    return data as TossPaymentResponse
  }

  /**
   * 빌링키 발급 (자동결제용)
   */
  async issueBillingKey(
    authKey: string,
    customerKey: string
  ): Promise<{ billingKey: string; customerKey: string; cardCompany: string; cardNumber: string }> {
    const response = await fetch(`${TOSS_API_BASE}/billing/authorizations/issue`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authKey,
        customerKey,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const error = data as TossErrorResponse
      throw new Error(`토스페이먼츠 오류: ${error.message} (${error.code})`)
    }

    return data
  }

  /**
   * 빌링키로 자동결제
   */
  async billingPayment(
    billingKey: string,
    customerKey: string,
    amount: number,
    orderId: string,
    orderName: string
  ): Promise<TossPaymentResponse> {
    const response = await fetch(`${TOSS_API_BASE}/billing/${billingKey}`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerKey,
        amount,
        orderId,
        orderName,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const error = data as TossErrorResponse
      throw new Error(`토스페이먼츠 오류: ${error.message} (${error.code})`)
    }

    return data as TossPaymentResponse
  }
}

// 싱글톤 인스턴스
export const tossPayments = new TossPaymentsService()

// 가격 정책
export const PRICING = {
  FREE: {
    name: '무료',
    price: 0,
    features: ['Phase 1 일부 콘텐츠', '커뮤니티 읽기'],
  },
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
} as const

export type PlanType = keyof typeof PRICING
