import Link from 'next/link'

export function Footer() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0'
  const gitCommit = process.env.NEXT_PUBLIC_GIT_COMMIT || 'unknown'
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME
    ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : ''

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">FDE Academy</h3>
            <p className="text-gray-400 text-sm">
              Forward Deployed Engineer 양성을 위한 전문 교육 플랫폼
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/curriculum" className="hover:text-white transition-colors">
              All Courses
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>© 2026 FDE Academy. All rights reserved.</span>
          <span className="font-mono text-xs text-gray-600">
            v{version} ({gitCommit}){buildTime && ` • ${buildTime}`}
          </span>
        </div>
      </div>
    </footer>
  )
}
