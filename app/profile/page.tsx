'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Service {
  id: string
  name: string
  description: string | null
  url: string | null
  logoUrl: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'DEVELOPMENT'
}

interface Profile {
  id: string
  headline: string | null
  bio: string | null
  roleType: string
  industry: string | null
  location: string | null
  jobTitle: string | null
  company: string | null
  yearsOfExp: number | null
  isOpenToCollab: boolean
  lookingFor: string[]
  interests: string[]
  canOffer: string[]
  githubUrl: string | null
  linkedinUrl: string | null
  portfolioUrl: string | null
  blogUrl: string | null
  youtubeUrl: string | null
  twitterUrl: string | null
  companyUrl: string | null
  personalUrl: string | null
  skills: {
    id: string
    level: string
    skill: {
      id: string
      name: string
      category: string | null
    }
  }[]
  services: Service[]
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    accessLevel: string
    createdAt: string
  }
}

const ROLE_TYPES = [
  { value: 'DEVELOPER', label: '개발자', icon: '💻' },
  { value: 'DESIGNER', label: '디자이너', icon: '🎨' },
  { value: 'MARKETER', label: '마케터', icon: '📢' },
  { value: 'PM', label: '기획자/PM', icon: '📋' },
  { value: 'DATA_SCIENTIST', label: '데이터 사이언티스트', icon: '📊' },
  { value: 'RESEARCHER', label: '연구자/교수', icon: '🔬' },
  { value: 'FOUNDER', label: '창업자', icon: '🚀' },
  { value: 'INVESTOR', label: '투자자', icon: '💰' },
  { value: 'STUDENT', label: '학생', icon: '📚' },
  { value: 'OTHER', label: '기타', icon: '👤' },
]

const LOOKING_FOR_OPTIONS = [
  '팀원', '공동창업자', '투자자', '멘토', '멘티', '스폰서', '프로젝트', '네트워킹', '채용기회'
]

const CAN_OFFER_OPTIONS = [
  '멘토링', '투자', '기술지원', '디자인지원', '마케팅지원', '사업조언', '네트워크소개', '취업멘토링'
]

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

const SERVICE_STATUS = [
  { value: 'ACTIVE', label: '운영 중', color: 'bg-green-100 text-green-700' },
  { value: 'DEVELOPMENT', label: '개발 중', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'INACTIVE', label: '중단', color: 'bg-gray-100 text-gray-700' },
]

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [activeTab, setActiveTab] = useState('basic')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    bio: '',
    roleType: 'DEVELOPER',
    industry: '',
    location: '',
    jobTitle: '',
    company: '',
    yearsOfExp: '',
    isOpenToCollab: false,
    lookingFor: [] as string[],
    interests: '',
    canOffer: [] as string[],
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    blogUrl: '',
    youtubeUrl: '',
    twitterUrl: '',
    companyUrl: '',
    personalUrl: '',
  })

  const [skills, setSkills] = useState<{ name: string; level: string }[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [newService, setNewService] = useState({ name: '', description: '', url: '', status: 'ACTIVE' })
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [isAddingService, setIsAddingService] = useState(false)

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
          headline: data.profile.headline || '',
          bio: data.profile.bio || '',
          roleType: data.profile.roleType || 'DEVELOPER',
          industry: data.profile.industry || '',
          location: data.profile.location || '',
          jobTitle: data.profile.jobTitle || '',
          company: data.profile.company || '',
          yearsOfExp: data.profile.yearsOfExp?.toString() || '',
          isOpenToCollab: data.profile.isOpenToCollab || false,
          lookingFor: data.profile.lookingFor || [],
          interests: data.profile.interests?.join(', ') || '',
          canOffer: data.profile.canOffer || [],
          githubUrl: data.profile.githubUrl || '',
          linkedinUrl: data.profile.linkedinUrl || '',
          portfolioUrl: data.profile.portfolioUrl || '',
          blogUrl: data.profile.blogUrl || '',
          youtubeUrl: data.profile.youtubeUrl || '',
          twitterUrl: data.profile.twitterUrl || '',
          companyUrl: data.profile.companyUrl || '',
          personalUrl: data.profile.personalUrl || '',
        })
        setSkills(
          data.profile.skills?.map((s: any) => ({
            name: s.skill.name,
            level: s.level,
          })) || []
        )
        setServices(data.profile.services || [])
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

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item))
    } else {
      setter([...array, item])
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

  // 서비스 관련 함수
  const addService = async () => {
    if (!newService.name.trim()) {
      setMessage({ type: 'error', text: '서비스 이름을 입력해주세요' })
      return
    }

    try {
      const res = await fetch('/api/profile/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      })

      if (!res.ok) throw new Error('서비스 추가 실패')

      const data = await res.json()
      setServices([data.service, ...services])
      setNewService({ name: '', description: '', url: '', status: 'ACTIVE' })
      setIsAddingService(false)
      setMessage({ type: 'success', text: '서비스가 추가되었습니다' })
    } catch (error) {
      setMessage({ type: 'error', text: '서비스 추가 중 오류가 발생했습니다' })
    }
  }

  const updateService = async (service: Service) => {
    try {
      const res = await fetch('/api/profile/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      })

      if (!res.ok) throw new Error('서비스 수정 실패')

      setServices(services.map((s) => (s.id === service.id ? service : s)))
      setEditingServiceId(null)
      setMessage({ type: 'success', text: '서비스가 수정되었습니다' })
    } catch (error) {
      setMessage({ type: 'error', text: '서비스 수정 중 오류가 발생했습니다' })
    }
  }

  const deleteService = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const res = await fetch(`/api/profile/services?id=${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('서비스 삭제 실패')

      setServices(services.filter((s) => s.id !== id))
      setMessage({ type: 'success', text: '서비스가 삭제되었습니다' })
    } catch (error) {
      setMessage({ type: 'error', text: '서비스 삭제 중 오류가 발생했습니다' })
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  const roleInfo = ROLE_TYPES.find(r => r.value === formData.roleType)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
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
            <Link href="/members" className="px-4 py-2 text-gray-600 hover:text-gray-900">
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
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:text-gray-900">
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
          <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* 프로필 헤더 */}
          <div className="bg-gradient-to-r from-[#03EF62] to-[#02d654] p-6">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                {session?.user?.image ? (
                  <Image src={session.user.image} alt="Profile" width={96} height={96} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-gray-400">
                    {formData.name?.[0] || session?.user?.email?.[0] || '?'}
                  </span>
                )}
              </div>
              <div className="flex-1 text-white">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/20 text-white placeholder-white/60 px-3 py-1 rounded-lg text-xl font-bold w-full max-w-xs"
                    placeholder="이름"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{formData.name || '이름 없음'}</h2>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="bg-white/20 text-white placeholder-white/60 px-3 py-1 rounded-lg text-sm w-full max-w-md mt-2"
                    placeholder="한줄 소개 (예: 풀스택 개발자 | AI 엔지니어)"
                  />
                ) : (
                  formData.headline && <p className="text-white/90 mt-1">{formData.headline}</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {roleInfo?.icon} {roleInfo?.label}
                  </span>
                  {formData.location && (
                    <span className="text-white/80 text-sm">📍 {formData.location}</span>
                  )}
                  {formData.isOpenToCollab && (
                    <span className="bg-white/30 px-3 py-1 rounded-full text-sm">✅ 협업 가능</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'basic', label: '기본 정보' },
                { id: 'network', label: '네트워킹' },
                { id: 'skills', label: '기술 스택' },
                { id: 'links', label: '링크' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition ${activeTab === tab.id ? 'text-[#03EF62] border-b-2 border-[#03EF62]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 탭 내용 */}
          <div className="p-6">
            {/* 기본 정보 탭 */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* 역할 유형 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">역할 유형</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {ROLE_TYPES.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, roleType: role.value })}
                          className={`p-3 rounded-lg border-2 text-center transition ${formData.roleType === role.value ? 'border-[#03EF62] bg-[#03EF62]/10' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          <div className="text-2xl mb-1">{role.icon}</div>
                          <div className="text-xs font-medium">{role.label}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-900">{roleInfo?.icon} {roleInfo?.label}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">현재 직책</label>
                    {isEditing ? (
                      <input type="text" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent" placeholder="예: Senior Data Engineer" />
                    ) : (
                      <p className="text-gray-900">{formData.jobTitle || '-'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">회사/소속</label>
                    {isEditing ? (
                      <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent" placeholder="예: 네이버" />
                    ) : (
                      <p className="text-gray-900">{formData.company || '-'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">업종</label>
                    {isEditing ? (
                      <input type="text" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent" placeholder="예: IT/소프트웨어" />
                    ) : (
                      <p className="text-gray-900">{formData.industry || '-'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">위치</label>
                    {isEditing ? (
                      <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent" placeholder="예: 서울" />
                    ) : (
                      <p className="text-gray-900">{formData.location || '-'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">경력 연차</label>
                    {isEditing ? (
                      <input type="number" value={formData.yearsOfExp} onChange={(e) => setFormData({ ...formData, yearsOfExp: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent" placeholder="예: 5" min="0" />
                    ) : (
                      <p className="text-gray-900">{formData.yearsOfExp ? `${formData.yearsOfExp}년` : '-'}</p>
                    )}
                  </div>
                </div>

                {/* 자기소개 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">자기소개</label>
                  {isEditing ? (
                    <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent" rows={4} placeholder="자신에 대해 소개해주세요" />
                  ) : (
                    <p className="text-gray-900 whitespace-pre-wrap">{formData.bio || '-'}</p>
                  )}
                </div>

                {/* 관심 분야 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">관심 분야</label>
                  {isEditing ? (
                    <input type="text" value={formData.interests} onChange={(e) => setFormData({ ...formData, interests: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent" placeholder="예: AI, 데이터 엔지니어링, Knowledge Graph (쉼표로 구분)" />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.interests ? formData.interests.split(',').map((i, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{i.trim()}</span>
                      )) : <span className="text-gray-500">-</span>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 네트워킹 탭 */}
            {activeTab === 'network' && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 mb-4">
                    {isEditing ? (
                      <input type="checkbox" checked={formData.isOpenToCollab} onChange={(e) => setFormData({ ...formData, isOpenToCollab: e.target.checked })} className="w-5 h-5 rounded text-[#03EF62] focus:ring-[#03EF62]" />
                    ) : null}
                    <span className="text-lg font-medium text-gray-900">
                      {formData.isOpenToCollab ? '✅ 협업/네트워킹 가능' : '협업/네트워킹 비공개'}
                    </span>
                  </label>
                </div>

                {/* 찾고 있는 것 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">찾고 있는 것</label>
                  {isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      {LOOKING_FOR_OPTIONS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleArrayItem(formData.lookingFor, item, (arr) => setFormData({ ...formData, lookingFor: arr }))}
                          className={`px-4 py-2 rounded-full text-sm transition ${formData.lookingFor.includes(item) ? 'bg-[#03EF62] text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.lookingFor.length > 0 ? formData.lookingFor.map((item) => (
                        <span key={item} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{item}</span>
                      )) : <span className="text-gray-500">-</span>}
                    </div>
                  )}
                </div>

                {/* 제공 가능한 것 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제공 가능한 것</label>
                  {isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      {CAN_OFFER_OPTIONS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleArrayItem(formData.canOffer, item, (arr) => setFormData({ ...formData, canOffer: arr }))}
                          className={`px-4 py-2 rounded-full text-sm transition ${formData.canOffer.includes(item) ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.canOffer.length > 0 ? formData.canOffer.map((item) => (
                        <span key={item} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">{item}</span>
                      )) : <span className="text-gray-500">-</span>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 기술 스택 탭 */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
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
                          className={`px-3 py-1 rounded-full text-sm transition ${skills.some((s) => s.name === skill.name) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-[#03EF62] hover:text-black'}`}
                        >
                          + {skill.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {skills.length > 0 ? skills.map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <select value={skill.level} onChange={(e) => updateSkillLevel(skill.name, e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm">
                              {SKILL_LEVELS.map((level) => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                              ))}
                            </select>
                            <button type="button" onClick={() => removeSkill(skill.name)} className="text-red-500 hover:text-red-700">
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
                  )) : (
                    <p className="text-gray-500">등록된 스킬이 없습니다</p>
                  )}
                </div>
              </div>
            )}

            {/* 링크 탭 */}
            {activeTab === 'links' && (
              <div className="space-y-8">
                {/* 기본 링크 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">소셜 및 웹사이트</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'githubUrl', label: 'GitHub', icon: '🐙', placeholder: 'https://github.com/username' },
                      { key: 'linkedinUrl', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/username' },
                      { key: 'portfolioUrl', label: '포트폴리오', icon: '🎨', placeholder: 'https://portfolio.com' },
                      { key: 'blogUrl', label: '블로그', icon: '📝', placeholder: 'https://blog.com' },
                      { key: 'youtubeUrl', label: 'YouTube', icon: '📺', placeholder: 'https://youtube.com/@channel' },
                      { key: 'twitterUrl', label: 'Twitter/X', icon: '🐦', placeholder: 'https://x.com/username' },
                      { key: 'companyUrl', label: '회사 홈페이지', icon: '🏢', placeholder: 'https://company.com' },
                      { key: 'personalUrl', label: '개인 웹사이트', icon: '🌐', placeholder: 'https://mysite.com' },
                    ].map((link) => (
                      <div key={link.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{link.icon} {link.label}</label>
                        {isEditing ? (
                          <input
                            type="url"
                            value={(formData as any)[link.key] || ''}
                            onChange={(e) => setFormData({ ...formData, [link.key]: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                            placeholder={link.placeholder}
                          />
                        ) : (formData as any)[link.key] ? (
                          <a href={(formData as any)[link.key]} target="_blank" rel="noopener noreferrer" className="text-[#03EF62] hover:underline break-all">
                            {(formData as any)[link.key]}
                          </a>
                        ) : (
                          <p className="text-gray-500">-</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 내 서비스 섹션 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">🚀 내 서비스</h3>
                    {!isAddingService && (
                      <button
                        onClick={() => setIsAddingService(true)}
                        className="px-4 py-2 text-sm bg-[#03EF62] text-black font-medium rounded-lg hover:bg-[#02d654] transition"
                      >
                        + 서비스 추가
                      </button>
                    )}
                  </div>

                  {/* 새 서비스 추가 폼 */}
                  {isAddingService && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">서비스 이름 *</label>
                          <input
                            type="text"
                            value={newService.name}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                            placeholder="예: 나의 SaaS 서비스"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                          <textarea
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                            rows={2}
                            placeholder="서비스에 대한 간단한 설명"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                          <input
                            type="url"
                            value={newService.url}
                            onChange={(e) => setNewService({ ...newService, url: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                            placeholder="https://myservice.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                          <select
                            value={newService.status}
                            onChange={(e) => setNewService({ ...newService, status: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                          >
                            {SERVICE_STATUS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={addService}
                            className="px-4 py-2 bg-[#03EF62] text-black font-medium rounded-lg hover:bg-[#02d654] transition"
                          >
                            추가
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingService(false)
                              setNewService({ name: '', description: '', url: '', status: 'ACTIVE' })
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 서비스 목록 */}
                  <div className="space-y-3">
                    {services.length > 0 ? services.map((service) => {
                      const statusInfo = SERVICE_STATUS.find((s) => s.value === service.status)
                      const isEditingThis = editingServiceId === service.id

                      return (
                        <div key={service.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition">
                          {isEditingThis ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={service.name}
                                onChange={(e) => setServices(services.map((s) => s.id === service.id ? { ...s, name: e.target.value } : s))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent font-medium"
                              />
                              <textarea
                                value={service.description || ''}
                                onChange={(e) => setServices(services.map((s) => s.id === service.id ? { ...s, description: e.target.value } : s))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                                rows={2}
                                placeholder="설명"
                              />
                              <input
                                type="url"
                                value={service.url || ''}
                                onChange={(e) => setServices(services.map((s) => s.id === service.id ? { ...s, url: e.target.value } : s))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                                placeholder="URL"
                              />
                              <select
                                value={service.status}
                                onChange={(e) => setServices(services.map((s) => s.id === service.id ? { ...s, status: e.target.value as Service['status'] } : s))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03EF62] focus:border-transparent"
                              >
                                {SERVICE_STATUS.map((s) => (
                                  <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                              </select>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateService(service)}
                                  className="px-3 py-1 bg-[#03EF62] text-black text-sm font-medium rounded hover:bg-[#02d654] transition"
                                >
                                  저장
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingServiceId(null)
                                    fetchProfile() // 원래 상태로 복원
                                  }}
                                  className="px-3 py-1 text-gray-600 text-sm hover:text-gray-900"
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${statusInfo?.color}`}>
                                      {statusInfo?.label}
                                    </span>
                                  </div>
                                  {service.description && (
                                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                  )}
                                  {service.url && (
                                    <a
                                      href={service.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-[#03EF62] hover:underline mt-1 inline-block"
                                    >
                                      {service.url}
                                    </a>
                                  )}
                                </div>
                                <div className="flex gap-1 ml-2">
                                  <button
                                    onClick={() => setEditingServiceId(service.id)}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                    title="수정"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => deleteService(service.id)}
                                    className="p-1 text-gray-400 hover:text-red-500"
                                    title="삭제"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    }) : (
                      <p className="text-gray-500 text-center py-4">
                        아직 등록된 서비스가 없습니다.
                        <br />
                        <span className="text-sm">운영 중인 서비스나 프로젝트를 추가해보세요!</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
