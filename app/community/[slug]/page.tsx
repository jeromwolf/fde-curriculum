'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Comment {
  id: string
  content: string
  likeCount: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  replies?: Comment[]
  _count: {
    likes: number
  }
}

interface Post {
  id: string
  title: string
  slug: string
  content: string
  viewCount: number
  likeCount: number
  commentCount: number
  isPinned: boolean
  isLocked: boolean
  createdAt: string
  updatedAt: string
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
  comments: Comment[]
  _count: {
    comments: number
    likes: number
    bookmarks: number
  }
}

export default function PostDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { data: session } = useSession()
  const router = useRouter()

  const [post, setPost] = useState<Post | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (slug) fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/community/posts/${slug}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '게시글을 불러올 수 없습니다')
      }

      setPost(data.post)
      setIsLiked(data.isLiked)
      setIsBookmarked(data.isBookmarked)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/community/${slug}`)
      return
    }

    try {
      const res = await fetch(`/api/community/posts/${slug}/like`, {
        method: 'POST',
      })
      const data = await res.json()

      if (res.ok) {
        setIsLiked(data.isLiked)
        setPost((prev) => prev ? { ...prev, likeCount: data.likeCount } : null)
      }
    } catch (error) {
      console.error('Failed to like:', error)
    }
  }

  const handleBookmark = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/community/${slug}`)
      return
    }

    try {
      const res = await fetch(`/api/community/posts/${slug}/bookmark`, {
        method: 'POST',
      })
      const data = await res.json()

      if (res.ok) {
        setIsBookmarked(data.isBookmarked)
      }
    } catch (error) {
      console.error('Failed to bookmark:', error)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      router.push(`/auth/login?callbackUrl=/community/${slug}`)
      return
    }

    if (!commentContent.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/community/posts/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentContent.trim() }),
      })

      if (res.ok) {
        setCommentContent('')
        fetchPost()
      }
    } catch (error) {
      console.error('Failed to comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (parentId: string) => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/community/${slug}`)
      return
    }

    if (!replyContent.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/community/posts/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent.trim(), parentId }),
      })

      if (res.ok) {
        setReplyContent('')
        setReplyingTo(null)
        fetchPost()
      }
    } catch (error) {
      console.error('Failed to reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const res = await fetch(`/api/community/posts/${slug}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.push('/community')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || '게시글을 찾을 수 없습니다'}</p>
          <Link href="/community" className="text-[#03EF62] hover:underline">
            커뮤니티로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  const isAuthor = session?.user?.id === post.author.id

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
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: post.category.color ? `${post.category.color}20` : '#f3f4f6',
              color: post.category.color || '#6b7280',
            }}
          >
            {post.category.displayName}
          </span>
        </div>

        {/* 게시글 */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* 제목 */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-2 mb-2">
              {post.isPinned && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded font-medium">
                  공지
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
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
                <div>
                  <Link href={`/profile/${post.author.id}`} className="font-medium text-gray-900 hover:underline">
                    {post.author.name}
                  </Link>
                  <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                </div>
              </div>

              {isAuthor && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 본문 */}
          <div className="p-6">
            <div className="prose prose-gray max-w-none whitespace-pre-wrap">
              {post.content}
            </div>

            {/* 태그 */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                {post.tags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 액션 바 */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.viewCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg transition ${
                  isLiked
                    ? 'bg-red-100 text-red-500'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {post.likeCount}
              </button>
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg transition ${
                  isBookmarked
                    ? 'bg-[#03EF62]/20 text-[#02a846]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>
        </article>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            댓글 {post.comments.length}개
          </h2>

          {/* 댓글 작성 */}
          {!post.isLocked && (
            <form onSubmit={handleComment} className="mb-6">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder={session ? '댓글을 작성하세요...' : '로그인 후 댓글을 작성할 수 있습니다'}
                disabled={!session}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent disabled:bg-gray-100"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!session || isSubmitting || !commentContent.trim()}
                  className="px-4 py-2 bg-[#03EF62] text-black font-semibold rounded-lg hover:bg-[#02d654] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '작성 중...' : '댓글 작성'}
                </button>
              </div>
            </form>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {comment.author.image ? (
                      <Image
                        src={comment.author.image}
                        alt={comment.author.name || ''}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                        {comment.author.name?.[0] || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{comment.author.name}</span>
                      <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className={`text-gray-700 ${comment.isDeleted ? 'italic text-gray-400' : ''}`}>
                      {comment.content}
                    </p>
                    {!comment.isDeleted && !post.isLocked && (
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          답글
                        </button>
                      </div>
                    )}

                    {/* 답글 폼 */}
                    {replyingTo === comment.id && (
                      <div className="mt-3">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="답글을 작성하세요..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent text-sm"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="px-3 py-1 text-gray-500 text-sm"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleReply(comment.id)}
                            disabled={isSubmitting || !replyContent.trim()}
                            className="px-3 py-1 bg-[#03EF62] text-black text-sm font-medium rounded hover:bg-[#02d654] disabled:opacity-50"
                          >
                            답글 작성
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 대댓글 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                              {reply.author.image ? (
                                <Image
                                  src={reply.author.image}
                                  alt={reply.author.name || ''}
                                  width={24}
                                  height={24}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                                  {reply.author.name?.[0] || '?'}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900 text-sm">{reply.author.name}</span>
                                <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
                              </div>
                              <p className="text-gray-700 text-sm">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {post.comments.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
