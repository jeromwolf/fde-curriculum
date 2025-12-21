'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  displayName: string
  description: string | null
  color: string | null
}

export default function NewPostPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [tags, setTags] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/community/new')
    }
  }, [status, router])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/community/categories')
      const data = await res.json()
      setCategories(data.categories || [])
      if (data.categories?.length > 0) {
        setCategoryId(data.categories[0].id)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('제목을 입력해주세요')
      return
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요')
      return
    }

    if (!categoryId) {
      setError('카테고리를 선택해주세요')
      return
    }

    setIsLoading(true)

    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          categoryId,
          tags: tagList,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '게시글 작성에 실패했습니다')
      }

      router.push(`/community/${data.post.slug}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/community" className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">새 글 작성</h1>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
          {/* 카테고리 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={`px-4 py-2 rounded-lg border-2 transition ${
                    categoryId === category.id
                      ? 'border-[#03EF62] bg-[#03EF62]/10 text-[#02a846]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {category.color && (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    {category.displayName}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={200}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
            />
            <div className="text-right text-xs text-gray-400 mt-1">{title.length}/200</div>
          </div>

          {/* 내용 */}
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="마크다운을 지원합니다. 코드는 ```로 감싸주세요."
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent font-mono text-sm"
            />
          </div>

          {/* 태그 */}
          <div className="mb-6">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              태그 (최대 5개)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="태그를 쉼표로 구분하여 입력하세요 (예: python, neo4j, 질문)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
            />
          </div>

          {/* 버튼 */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/community"
              className="px-6 py-3 text-gray-600 hover:text-gray-900"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-[#03EF62] text-black font-semibold rounded-lg hover:bg-[#02d654] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '작성 중...' : '게시하기'}
            </button>
          </div>
        </form>

        {/* 마크다운 가이드 */}
        <div className="mt-6 bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">마크다운 가이드</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">제목</p>
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-700"># 제목</code>
            </div>
            <div>
              <p className="text-gray-500 mb-1">굵게</p>
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">**굵은 텍스트**</code>
            </div>
            <div>
              <p className="text-gray-500 mb-1">코드</p>
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">`인라인 코드`</code>
            </div>
            <div>
              <p className="text-gray-500 mb-1">코드 블록</p>
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">```python ... ```</code>
            </div>
            <div>
              <p className="text-gray-500 mb-1">링크</p>
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">[텍스트](URL)</code>
            </div>
            <div>
              <p className="text-gray-500 mb-1">멘션</p>
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">@username</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
