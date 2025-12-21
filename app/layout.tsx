import './globals.css'
import SessionProvider from '@/components/SessionProvider'
import Header from '@/components/Header'

export const metadata = {
  title: 'FDE Academy - Forward Deployed Engineer 교육 과정',
  description: 'Palantir 스타일의 Forward Deployed Engineer 양성을 위한 12개월 집중 교육 프로그램',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-gray-900">
        <SessionProvider>
          <Header />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
