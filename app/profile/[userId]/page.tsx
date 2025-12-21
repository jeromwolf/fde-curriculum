'use client'

import { useState, useEffect, use } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

interface Profile {
  id: string
  bio: string | null
  jobTitle: string | null
  company: string | null
  yearsOfExp: number | null
  isOpenToCollab: boolean
  interests: string[]
  githubUrl: string | null
  linkedinUrl: string | null
  portfolioUrl: string | null
  blogUrl: string | null
  skills: {
    id: string
    level: string
    skill: {
      id: string
      name: string
      category: string | null
    }
  }[]
  user: {
    id: string
    name: string | null
    image: string | null
    accessLevel: string
    createdAt: string
  }
}

const SKILL_LEVELS: Record<string, string> = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
  EXPERT: '전문가',
}

export default function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = use(params)
  const { data: session } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const isOwnProfile = session?.user?.id === resolvedParams.userId

  useEffect(() => {
    fetchProfile()
  }, [resolvedParams.userId])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile/${resolvedParams.userId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '프로필을 불러올 수 없습니다')
        return
      }

      if (data.profile) {
        setProfile(data.profile)
        setUser(data.profile.user)
      } else if (data.user) {
        setUser(data.user)
      }
    } catch (err) {
      setError('프로필을 불러오는 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Link href="/members" className="text-[#03EF62] hover:underline">
            회원 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/members" className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">회원 프로필</h1>
          </div>
          {isOwnProfile && (
            <Link
              href="/profile"
              className="px-4 py-2 bg-[#03EF62] text-black font-semibold rounded-lg hover:bg-[#02d654] transition"
            >
              내 프로필 수정
            </Link>
          )}
        </div>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* 프로필 헤더 */}
          <div className="bg-gradient-to-r from-[#03EF62] to-[#02d654] p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">
                    {user?.name?.[0] || '?'}
                  </span>
                )}
              </div>
              <div className="text-white">
                <h2 className="text-xl font-bold">{user?.name || '이름 없음'}</h2>
                <div className="flex items-center gap-2 mt-1">
                  {profile?.isOpenToCollab && (
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                      협업 가능
                    </span>
                  )}
                  <span className="text-white/80 text-sm">
                    가입일: {new Date(user?.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 프로필 내용 */}
          <div className="p-6 space-y-6">
            {!profile ? (
              <div className="text-center py-8 text-gray-500">
                아직 프로필을 작성하지 않았습니다.
              </div>
            ) : (
              <>
                {/* 기본 정보 */}
                {(profile.jobTitle || profile.company || profile.yearsOfExp) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profile.jobTitle && (
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">직함</label>
                          <p className="text-gray-900 font-medium">{profile.jobTitle}</p>
                        </div>
                      )}
                      {profile.company && (
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">회사</label>
                          <p className="text-gray-900 font-medium">{profile.company}</p>
                        </div>
                      )}
                      {profile.yearsOfExp && (
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">경력</label>
                          <p className="text-gray-900 font-medium">{profile.yearsOfExp}년</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 자기소개 */}
                {profile.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">자기소개</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
                  </div>
                )}

                {/* 관심 분야 */}
                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">관심 분야</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 기술 스택 */}
                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">기술 스택</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full"
                        >
                          <span className="font-medium text-gray-900">{skill.skill.name}</span>
                          <span className="text-xs px-1.5 py-0.5 bg-[#03EF62]/20 text-[#02a846] rounded">
                            {SKILL_LEVELS[skill.level]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 외부 링크 */}
                {(profile.githubUrl || profile.linkedinUrl || profile.portfolioUrl || profile.blogUrl) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">외부 링크</h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.githubUrl && (
                        <a
                          href={profile.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </a>
                      )}
                      {profile.linkedinUrl && (
                        <a
                          href={profile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006699] transition"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                      {profile.portfolioUrl && (
                        <a
                          href={profile.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#03EF62] text-black rounded-lg hover:bg-[#02d654] transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          포트폴리오
                        </a>
                      )}
                      {profile.blogUrl && (
                        <a
                          href={profile.blogUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                          블로그
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
