'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Member {
  id: string
  name: string | null
  image: string | null
  accessLevel: string
  createdAt: string
  profile: {
    bio: string | null
    jobTitle: string | null
    company: string | null
    yearsOfExp: number | null
    isOpenToCollab: boolean
    interests: string[]
    githubUrl: string | null
    linkedinUrl: string | null
    skills: {
      id: string
      level: string
      skill: {
        id: string
        name: string
        category: string | null
      }
    }[]
  } | null
}

interface PopularSkill {
  id: string
  name: string
  category: string | null
  _count: {
    users: number
  }
}

const SKILL_LEVELS: Record<string, string> = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
  EXPERT: '전문가',
}

export default function MembersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [members, setMembers] = useState<Member[]>([])
  const [popularSkills, setPopularSkills] = useState<PopularSkill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [search, setSearch] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [openToCollabOnly, setOpenToCollabOnly] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/members')
    } else if (status === 'authenticated') {
      fetchMembers()
    }
  }, [status, router, page, search, selectedSkill, openToCollabOnly])

  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      })
      if (search) params.set('search', search)
      if (selectedSkill) params.set('skill', selectedSkill)
      if (openToCollabOnly) params.set('openToCollab', 'true')

      const res = await fetch(`/api/members?${params}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '회원 목록을 불러올 수 없습니다')
      }

      setMembers(data.members)
      setPopularSkills(data.popularSkills)
      setTotal(data.pagination.total)
      setTotalPages(data.pagination.totalPages)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchMembers()
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
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FDE 커뮤니티</h1>
              <p className="text-gray-500">{total}명의 회원이 있습니다</p>
            </div>
          </div>
          <Link
            href="/profile"
            className="px-4 py-2 bg-[#03EF62] text-black font-semibold rounded-lg hover:bg-[#02d654] transition"
          >
            내 프로필
          </Link>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="이름, 직함, 회사, 자기소개 검색..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
              />
            </div>
            <div className="min-w-[150px]">
              <select
                value={selectedSkill}
                onChange={(e) => {
                  setSelectedSkill(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
              >
                <option value="">모든 스킬</option>
                {popularSkills.map((skill) => (
                  <option key={skill.id} value={skill.name}>
                    {skill.name} ({skill._count.users})
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={openToCollabOnly}
                onChange={(e) => {
                  setOpenToCollabOnly(e.target.checked)
                  setPage(1)
                }}
                className="w-5 h-5 rounded text-[#03EF62] focus:ring-[#03EF62]"
              />
              <span className="text-gray-700">협업 가능만</span>
            </label>
            <button
              type="submit"
              className="px-6 py-2 bg-[#03EF62] text-black font-semibold rounded-lg hover:bg-[#02d654] transition"
            >
              검색
            </button>
          </form>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 회원 목록 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500">검색 조건에 맞는 회원이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <Link
                key={member.id}
                href={`/profile/${member.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
              >
                {/* 카드 헤더 */}
                <div className="bg-gradient-to-r from-[#03EF62] to-[#02d654] p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name || ''}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-gray-400">
                          {member.name?.[0] || '?'}
                        </span>
                      )}
                    </div>
                    <div className="text-white flex-1 min-w-0">
                      <h3 className="font-bold truncate">{member.name || '이름 없음'}</h3>
                      {member.profile?.jobTitle && (
                        <p className="text-white/80 text-sm truncate">
                          {member.profile.jobTitle}
                          {member.profile.company && ` @ ${member.profile.company}`}
                        </p>
                      )}
                    </div>
                    {member.profile?.isOpenToCollab && (
                      <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full whitespace-nowrap">
                        협업 가능
                      </span>
                    )}
                  </div>
                </div>

                {/* 카드 내용 */}
                <div className="p-4">
                  {/* 자기소개 */}
                  {member.profile?.bio && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {member.profile.bio}
                    </p>
                  )}

                  {/* 관심 분야 */}
                  {member.profile?.interests && member.profile.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {member.profile.interests.slice(0, 3).map((interest, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {interest}
                        </span>
                      ))}
                      {member.profile.interests.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-xs">
                          +{member.profile.interests.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 스킬 */}
                  {member.profile?.skills && member.profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {member.profile.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill.id}
                          className="px-2 py-0.5 bg-[#03EF62]/10 text-[#02a846] rounded text-xs font-medium"
                        >
                          {skill.skill.name}
                        </span>
                      ))}
                      {member.profile.skills.length > 4 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-xs">
                          +{member.profile.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 외부 링크 아이콘 */}
                  {(member.profile?.githubUrl || member.profile?.linkedinUrl) && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      {member.profile?.githubUrl && (
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      )}
                      {member.profile?.linkedinUrl && (
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      )}
                    </div>
                  )}
                </div>

                {/* 호버 효과 */}
                <div className="px-4 py-3 bg-gray-50 text-center text-gray-500 text-sm group-hover:bg-[#03EF62] group-hover:text-black transition">
                  프로필 보기
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
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                if (pageNum > totalPages) return null
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg ${
                      pageNum === page
                        ? 'bg-[#03EF62] text-black font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
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
  )
}
