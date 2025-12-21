import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { tossPayments, PRICING, PlanType } from '@/lib/services/toss-payments'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const { paymentKey, orderId, amount, plan } = await request.json()

    // 필수 파라미터 확인
    if (!paymentKey || !orderId || !amount || !plan) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다' },
        { status: 400 }
      )
    }

    // 가격 검증
    const planInfo = PRICING[plan as PlanType]
    if (!planInfo || planInfo.price !== amount) {
      return NextResponse.json(
        { error: '결제 금액이 올바르지 않습니다' },
        { status: 400 }
      )
    }

    // 토스페이먼츠 결제 승인
    const payment = await tossPayments.confirmPayment({
      paymentKey,
      orderId,
      amount,
    })

    // 구독 정보 조회 또는 생성
    let subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (subscription) {
      // 기존 구독 업데이트
      subscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          plan: plan as PlanType,
          status: 'ACTIVE',
          priceMonthly: amount,
          paymentMethod: payment.method,
          startDate: new Date(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
          cancelledAt: null,
        },
      })
    } else {
      // 새 구독 생성
      subscription = await prisma.subscription.create({
        data: {
          userId: session.user.id,
          plan: plan as PlanType,
          status: 'ACTIVE',
          priceMonthly: amount,
          paymentMethod: payment.method,
          tossCustomerKey: session.user.id,
          startDate: new Date(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
    }

    // 결제 내역 저장
    await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        tossPaymentKey: payment.paymentKey,
        orderId: payment.orderId,
        orderName: payment.orderName || `FDE Academy ${planInfo.name} 플랜`,
        amount: payment.totalAmount,
        status: payment.status === 'DONE' ? 'DONE' : 'IN_PROGRESS',
        method: payment.method,
        cardCompany: payment.card?.issuerCode,
        cardNumber: payment.card?.number,
        approvedAt: payment.approvedAt ? new Date(payment.approvedAt) : null,
      },
    })

    // 사용자 accessLevel 업데이트
    await prisma.user.update({
      where: { id: session.user.id },
      data: { accessLevel: plan as PlanType },
    })

    return NextResponse.json({
      success: true,
      message: '결제가 완료되었습니다',
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        nextBillingDate: subscription.nextBillingDate,
      },
    })
  } catch (error: any) {
    console.error('Payment confirm error:', error)
    return NextResponse.json(
      { error: error.message || '결제 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
