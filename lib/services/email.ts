import nodemailer from 'nodemailer'

// Gmail SMTP 설정
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Google 앱 비밀번호 사용
  },
})

// 이메일 발송 기본 함수
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  // 환경 변수 체크
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('Email not configured. Skipping email send.')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const info = await transporter.sendMail({
      from: `"FDE Academy" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    })
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: String(error) }
  }
}

// 회원가입 환영 이메일
export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Pretendard', -apple-system, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
        .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
        .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .feature { display: flex; align-items: center; margin: 10px 0; }
        .feature-icon { width: 24px; height: 24px; margin-right: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 FDE Academy에 오신 것을 환영합니다!</h1>
        </div>
        <div class="content">
          <p>안녕하세요, <strong>${name}</strong>님!</p>
          <p>FDE Academy 회원이 되신 것을 진심으로 환영합니다.</p>

          <div class="features">
            <h3>🚀 시작하기</h3>
            <div class="feature">✅ 6개 Phase 커리큘럼으로 체계적인 학습</div>
            <div class="feature">✅ 실습 중심의 시뮬레이터 제공</div>
            <div class="feature">✅ 커뮤니티에서 동료들과 함께 성장</div>
            <div class="feature">✅ 전문가 멘토링 지원</div>
          </div>

          <p style="text-align: center;">
            <a href="https://fde-academy.ai.kr/curriculum" class="button">학습 시작하기</a>
          </p>

          <p>궁금한 점이 있으시면 언제든지 커뮤니티에 질문해 주세요!</p>
        </div>
        <div class="footer">
          <p>© 2025 FDE Academy. All rights reserved.</p>
          <p>이 이메일은 회원가입 시 자동으로 발송됩니다.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: '[FDE Academy] 회원가입을 환영합니다! 🎉',
    html,
  })
}

// 결제 완료 이메일
export async function sendPaymentConfirmationEmail({
  email,
  name,
  planName,
  amount,
  orderId,
  paymentMethod,
}: {
  email: string
  name: string
  planName: string
  amount: number
  orderId: string
  paymentMethod?: string
}) {
  const formattedAmount = new Intl.NumberFormat('ko-KR').format(amount)
  const paymentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Pretendard', -apple-system, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
        .receipt { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
        .receipt-row:last-child { border-bottom: none; }
        .receipt-label { color: #64748b; }
        .receipt-value { font-weight: 600; }
        .total { font-size: 18px; color: #10b981; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ 결제가 완료되었습니다</h1>
        </div>
        <div class="content">
          <p>안녕하세요, <strong>${name}</strong>님!</p>
          <p>FDE Academy 결제가 성공적으로 완료되었습니다.</p>

          <div class="receipt">
            <h3 style="margin-top: 0;">📋 결제 내역</h3>
            <div class="receipt-row">
              <span class="receipt-label">상품명</span>
              <span class="receipt-value">${planName}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">주문번호</span>
              <span class="receipt-value">${orderId}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">결제일시</span>
              <span class="receipt-value">${paymentDate}</span>
            </div>
            ${paymentMethod ? `
            <div class="receipt-row">
              <span class="receipt-label">결제수단</span>
              <span class="receipt-value">${paymentMethod}</span>
            </div>
            ` : ''}
            <div class="receipt-row">
              <span class="receipt-label">결제금액</span>
              <span class="receipt-value total">${formattedAmount}원</span>
            </div>
          </div>

          <p style="text-align: center;">
            <a href="https://fde-academy.ai.kr/curriculum" class="button">학습 시작하기</a>
          </p>

          <p style="color: #64748b; font-size: 14px;">
            결제 관련 문의사항이 있으시면 고객센터로 연락해 주세요.
          </p>
        </div>
        <div class="footer">
          <p>© 2025 FDE Academy. All rights reserved.</p>
          <p>이 이메일은 결제 완료 시 자동으로 발송됩니다.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `[FDE Academy] 결제 완료 안내 - ${planName}`,
    html,
  })
}

// 비밀번호 재설정 이메일 (향후 사용)
export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `https://fde-academy.ai.kr/auth/reset-password?token=${resetToken}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Pretendard', -apple-system, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
        .warning { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; color: #92400e; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 비밀번호 재설정</h1>
        </div>
        <div class="content">
          <p>비밀번호 재설정을 요청하셨습니다.</p>
          <p>아래 버튼을 클릭하여 새 비밀번호를 설정해 주세요.</p>

          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">비밀번호 재설정</a>
          </p>

          <div class="warning">
            <strong>⚠️ 주의:</strong> 이 링크는 1시간 후 만료됩니다.
            본인이 요청하지 않았다면 이 이메일을 무시해 주세요.
          </div>
        </div>
        <div class="footer">
          <p>© 2025 FDE Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: '[FDE Academy] 비밀번호 재설정 안내',
    html,
  })
}
