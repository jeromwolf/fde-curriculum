'use client'

import Link from 'next/link'
import AuthButton from '../AuthButton'

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold text-gray-900">
              FDE Academy
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/curriculum" className="text-gray-600 hover:text-gray-900 font-medium">
                전체 과정
              </Link>
              <Link href="/curriculum" className="text-gray-600 hover:text-gray-900 font-medium">
                자격증
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
