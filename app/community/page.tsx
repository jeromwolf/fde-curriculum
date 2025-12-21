'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  viewCount: number
  likeCount: number
  isPinned: boolean
  createdAt: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  category: {
    id: string
    name: string
    displayName: string
    color: string | null
  }
  tags: {
    tag: {
      id: string
      name: string
    }
  }[]
  _count: {
    comments: number
    likes: number
  }
}

interface Category {
  id: string
  name: string
  displayName: string
  color: string | null
  _count: {
    posts: number
  }
}

export default function CommunityPage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [page, selectedCategory])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/community/categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      })
      if (selectedCategory) params.set('category', selectedCategory)
      if (search) params.set('search', search)

      const res = await fetch(`/api/community/posts?${params}`)
      const data = await res.json()
      setPosts(data.posts || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchPosts()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return '방금 전'
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FDE 커뮤니티</h1>
                <p className="text-gray-500">질문하고, 공유하고, 함께 성장하세요</p>
              </div>
            </div>
            {session ? (
              <Link
                href="/community/new"
                className="px-4 py-2 bg-[#03EF62] text-black font-semibold rounded-lg hover:bg-[#02d654] transition"
              >
                글쓰기
              </Link>
            ) : (
              <Link
                href="/auth/login?callbackUrl=/community/new"
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                로그인하고 글쓰기
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 사이드바 */}
          <div className="lg:w-64 flex-shrink-0">
            {/* 검색 */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="검색..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* 카테고리 */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-3">카테고리</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('')
                      setPage(1)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === ''
                        ? 'bg-[#03EF62]/10 text-[#02a846] font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    전체
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(category.name)
                        setPage(1)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center justify-between ${
                        selectedCategory === category.name
                          ? 'bg-[#03EF62]/10 text-[#02a846] font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
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
                      <span className="text-xs text-gray-400">{category._count.posts}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-gray-500">로딩 중...</div>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">아직 게시글이 없습니다.</p>
                {session && (
                  <Link
                    href="/community/new"
                    className="inline-block px-4 py-2 bg-[#03EF62] text-black font-semibold rounded-lg hover:bg-[#02d654] transition"
                  >
                    첫 글 작성하기
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.slug}`}
                    className="block bg-white rounded-xl shadow hover:shadow-md transition p-5"
                  >
                    <div className="flex items-start gap-4">
                      {/* 작성자 아바타 */}
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                        {post.author.image ? (
                          <Image
                            src={post.author.image}
                            alt={post.author.name || ''}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                            {post.author.name?.[0] || '?'}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* 제목 */}
                        <div className="flex items-center gap-2 mb-1">
                          {post.isPinned && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded font-medium">
                              공지
                            </span>
                          )}
                          <span
                            className="px-2 py-0.5 text-xs rounded font-medium"
                            style={{
                              backgroundColor: post.category.color ? `${post.category.color}20` : '#f3f4f6',
                              color: post.category.color || '#6b7280',
                            }}
                          >
                            {post.category.displayName}
                          </span>
                          <h2 className="font-semibold text-gray-900 truncate">{post.title}</h2>
                        </div>

                        {/* 미리보기 */}
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                          {post.content.replace(/[#*`\[\]]/g, '').slice(0, 150)}
                        </p>

                        {/* 메타 정보 */}
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{post.author.name}</span>
                          <span>{formatDate(post.createdAt)}</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {post.viewCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {post._count.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {post._count.comments}
                          </span>
                        </div>

                        {/* 태그 */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.map(({ tag }) => (
                              <span
                                key={tag.id}
                                className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded"
                              >
                                #{tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                <span className="px-4 py-2 text-gray-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
