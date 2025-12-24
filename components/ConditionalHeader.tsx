'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'

// 특정 경로에서는 Header를 숨기고, 나머지 페이지에서만 표시
export default function ConditionalHeader() {
  const pathname = usePathname()

  // 자체 네비게이션이 있는 페이지들에서는 전역 Header 숨김
  const hideHeaderPaths = [
    '/',       // 메인 페이지 (자체 헤더 있음)
    '/learn',  // 학습 페이지들 (자체 네비게이션 있음)
  ]

  const shouldHide = hideHeaderPaths.some(path =>
    path === '/' ? pathname === '/' : pathname?.startsWith(path)
  )

  if (shouldHide) {
    return null
  }

  return <Header />
}
