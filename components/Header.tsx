'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthButton from './AuthButton'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">FDE Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/curriculum" className="text-gray-600 hover:text-gray-900 font-medium transition">
              커리큘럼
            </Link>
            <Link href="/community" className="text-gray-600 hover:text-gray-900 font-medium transition">
              커뮤니티
            </Link>
            <Link href="/members" className="text-gray-600 hover:text-gray-900 font-medium transition">
              회원
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium transition">
              요금제
            </Link>
            <AuthButton />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <Link
                href="/curriculum"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                커리큘럼
              </Link>
              <Link
                href="/community"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                커뮤니티
              </Link>
              <Link
                href="/members"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                회원
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                요금제
              </Link>
              <hr className="my-2" />
              <div className="px-4">
                <AuthButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
