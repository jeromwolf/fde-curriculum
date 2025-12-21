import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * 토스페이먼츠 웹훅 핸들러
 * https://docs.tosspayments.com/guides/webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, data } = body

    console.log('Toss Webhook received:', eventType, data)

    switch (eventType) {
      case 'PAYMENT_STATUS_CHANGED':
        await handlePaymentStatusChanged(data)
        break

      case 'BILLING_KEY_STATUS_CHANGED':
        await handleBillingKeyStatusChanged(data)
        break

      case 'DEPOSIT_CALLBACK':
        await handleDepositCallback(data)
        break

      default:
        console.log('Unknown webhook event:', eventType)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: '웹훅 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

async function handlePaymentStatusChanged(data: any) {
  const { paymentKey, status, orderId } = data

  // 결제 내역 업데이트
  const payment = await prisma.payment.findUnique({
    where: { tossPaymentKey: paymentKey },
    include: { subscription: true },
  })

  if (!payment) {
    console.log('Payment not found:', paymentKey)
    return
  }

  // 상태 매핑
  type PaymentStatus = 'READY' | 'IN_PROGRESS' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED'
  const statusMap: Record<string, PaymentStatus> = {
    DONE: 'DONE',
    CANCELED: 'CANCELED',
    PARTIAL_CANCELED: 'PARTIAL_CANCELED',
    ABORTED: 'ABORTED',
    EXPIRED: 'EXPIRED',
  }

  const mappedStatus = statusMap[status] || 'IN_PROGRESS'

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: mappedStatus,
      ...(status === 'CANCELED' && { cancelledAt: new Date() }),
    },
  })

  // 결제 취소 시 구독도 취소
  if (status === 'CANCELED' || status === 'EXPIRED' || status === 'ABORTED') {
    await prisma.subscription.update({
      where: { id: payment.subscriptionId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    })

    // 사용자 accessLevel을 FREE로 변경
    await prisma.user.update({
      where: { id: payment.subscription.userId },
      data: { accessLevel: 'FREE' },
    })
  }
}

async function handleBillingKeyStatusChanged(data: any) {
  const { billingKey, customerKey, status } = data

  // 빌링키 상태 변경 처리
  if (status === 'EXPIRED' || status === 'SUSPENDED') {
    const subscription = await prisma.subscription.findFirst({
      where: { tossBillingKey: billingKey },
    })

    if (subscription) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          tossBillingKey: null,
          status: 'PAUSED',
        },
      })
    }
  }
}

async function handleDepositCallback(data: any) {
  const { paymentKey, status, orderId } = data

  // 가상계좌 입금 완료 처리
  if (status === 'DONE') {
    const payment = await prisma.payment.findUnique({
      where: { tossPaymentKey: paymentKey },
    })

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'DONE',
          approvedAt: new Date(),
        },
      })
    }
  }
}
