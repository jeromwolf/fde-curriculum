'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
    email: string
    image: string | null
    accessLevel: string
    createdAt: string
  }
}

const SKILL_LEVELS = [
  { value: 'BEGINNER', label: '초급' },
  { value: 'INTERMEDIATE', label: '중급' },
  { value: 'ADVANCED', label: '고급' },
  { value: 'EXPERT', label: '전문가' },
]

const DEFAULT_SKILLS = [
  { name: 'Python', category: 'Language' },
  { name: 'SQL', category: 'Language' },
  { name: 'JavaScript', category: 'Language' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Neo4j', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Spark', category: 'Framework' },
  { name: 'Airflow', category: 'Framework' },
  { name: 'dbt', category: 'Framework' },
  { name: 'Kubernetes', category: 'DevOps' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'LangChain', category: 'AI' },
]

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    jobTitle: '',
    company: '',
    yearsOfExp: '',
    isOpenToCollab: false,
    interests: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    blogUrl: '',
  })

  const [skills, setSkills] = useState<{ name: string; level: string }[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/profile')
    } else if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      const data = await res.json()

      if (data.profile) {
        setProfile(data.profile)
        setFormData({
          name: data.profile.user?.name || '',
          bio: data.profile.bio || '',
          jobTitle: data.profile.jobTitle || '',
          company: data.profile.company || '',
          yearsOfExp: data.profile.yearsOfExp?.toString() || '',
          isOpenToCollab: data.profile.isOpenToCollab || false,
          interests: data.profile.interests?.join(', ') || '',
          githubUrl: data.profile.githubUrl || '',
          linkedinUrl: data.profile.linkedinUrl || '',
          portfolioUrl: data.profile.portfolioUrl || '',
          blogUrl: data.profile.blogUrl || '',
        })
        setSkills(
          data.profile.skills?.map((s: any) => ({
            name: s.skill.name,
            level: s.level,
          })) || []
        )
      } else if (data.user) {
        setFormData((prev) => ({
          ...prev,
          name: data.user.name || '',
        }))
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    try {
      // 프로필 저장
      const profileRes = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          yearsOfExp: formData.yearsOfExp ? parseInt(formData.yearsOfExp) : null,
          interests: formData.interests
            .split(',')
            .map((i) => i.trim())
            .filter(Boolean),
        }),
      })

      if (!profileRes.ok) {
        throw new Error('프로필 저장 실패')
      }

      // 스킬 저장
      const skillsRes = await fetch('/api/profile/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills }),
      })

      if (!skillsRes.ok) {
        throw new Error('스킬 저장 실패')
      }

      setMessage({ type: 'success', text: '프로필이 저장되었습니다' })
      setIsEditing(false)
      fetchProfile()
    } catch (error) {
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다' })
    } finally {
      setIsSaving(false)
    }
  }

  const addSkill = (skillName: string) => {
    if (!skills.find((s) => s.name === skillName)) {
      setSkills([...skills, { name: skillName, level: 'BEGINNER' }])
    }
  }

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter((s) => s.name !== skillName))
  }

  const updateSkillLevel = (skillName: string, level: string) => {
    setSkills(skills.map((s) => (s.name === skillName ? { ...s, level } : s)))
  }

  if (status === 'loading' || isLoading) {
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">내 프로필</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/members"
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              회원 목록
            </Link>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#03EF62] text-black font-semibold rounded-lg hover:bg-[#02d654] transition"
              >
                편집
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#03EF62] text-black font-semibold rounded-lg hover:bg-[#02d654] transition disabled:opacity-50"
                >
                  {isSaving ? '저장 중...' : '저장'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* 메시지 */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* 프로필 헤더 */}
          <div className="bg-gradient-to-r from-[#03EF62] to-[#02d654] p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">
                    {formData.name?.[0] || session?.user?.email?.[0] || '?'}
                  </span>
                )}
              </div>
              <div className="text-white">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/20 text-white placeholder-white/60 px-3 py-1 rounded-lg text-xl font-bold"
                    placeholder="이름"
                  />
                ) : (
                  <h2 className="text-xl font-bold">{formData.name || '이름 없음'}</h2>
                )}
                <p className="text-white/80">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          {/* 프로필 내용 */}
          <div className="p-6 space-y-6">
            {/* 기본 정보 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">직함</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                      placeholder="예: Data Engineer"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.jobTitle || '-'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">회사</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                      placeholder="예: 네이버"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.company || '-'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">경력 연차</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.yearsOfExp}
                      onChange={(e) => setFormData({ ...formData, yearsOfExp: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                      placeholder="예: 5"
                      min="0"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.yearsOfExp ? `${formData.yearsOfExp}년` : '-'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">협업 가능</label>
                  {isEditing ? (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isOpenToCollab}
                        onChange={(e) => setFormData({ ...formData, isOpenToCollab: e.target.checked })}
                        className="w-5 h-5 rounded text-[#03EF62] focus:ring-[#03EF62]"
                      />
                      <span className="text-gray-700">프로젝트 협업 가능</span>
                    </label>
                  ) : (
                    <p className="text-gray-900">
                      {formData.isOpenToCollab ? (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          협업 가능
                        </span>
                      ) : (
                        '-'
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 자기소개 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">자기소개</label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                  rows={4}
                  placeholder="간단한 자기소개를 작성해주세요"
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">{formData.bio || '-'}</p>
              )}
            </div>

            {/* 관심 분야 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">관심 분야</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                  placeholder="예: 데이터 엔지니어링, MLOps, Knowledge Graph (쉼표로 구분)"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.interests ? (
                    formData.interests.split(',').map((interest, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {interest.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </div>
              )}
            </div>

            {/* 기술 스택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">기술 스택</label>
              {isEditing && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">스킬을 클릭하여 추가하세요:</p>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_SKILLS.map((skill) => (
                      <button
                        key={skill.name}
                        type="button"
                        onClick={() => addSkill(skill.name)}
                        disabled={skills.some((s) => s.name === skill.name)}
                        className={`px-3 py-1 rounded-full text-sm transition ${
                          skills.some((s) => s.name === skill.name)
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-[#03EF62] hover:text-black'
                        }`}
                      >
                        + {skill.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <select
                              value={skill.level}
                              onChange={(e) => updateSkillLevel(skill.name, e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              {SKILL_LEVELS.map((level) => (
                                <option key={level.value} value={level.value}>
                                  {level.label}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill.name)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <span className="px-2 py-1 bg-[#03EF62]/20 text-[#02a846] rounded text-sm">
                            {SKILL_LEVELS.find((l) => l.value === skill.level)?.label}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">등록된 스킬이 없습니다</p>
                )}
              </div>
            </div>

            {/* 외부 링크 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">외부 링크</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                      placeholder="https://github.com/username"
                    />
                  ) : formData.githubUrl ? (
                    <a href={formData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[#03EF62] hover:underline">
                      {formData.githubUrl}
                    </a>
                  ) : (
                    <p className="text-gray-500">-</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : formData.linkedinUrl ? (
                    <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[#03EF62] hover:underline">
                      {formData.linkedinUrl}
                    </a>
                  ) : (
                    <p className="text-gray-500">-</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">포트폴리오</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                      placeholder="https://portfolio.com"
                    />
                  ) : formData.portfolioUrl ? (
                    <a href={formData.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-[#03EF62] hover:underline">
                      {formData.portfolioUrl}
                    </a>
                  ) : (
                    <p className="text-gray-500">-</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">블로그</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.blogUrl}
                      onChange={(e) => setFormData({ ...formData, blogUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                      placeholder="https://blog.com"
                    />
                  ) : formData.blogUrl ? (
                    <a href={formData.blogUrl} target="_blank" rel="noopener noreferrer" className="text-[#03EF62] hover:underline">
                      {formData.blogUrl}
                    </a>
                  ) : (
                    <p className="text-gray-500">-</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
