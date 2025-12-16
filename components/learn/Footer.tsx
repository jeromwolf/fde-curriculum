import Link from 'next/link'

export function Footer() {
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
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © 2025 FDE Academy. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
