'use client'

import { useState, useEffect } from 'react'

// ============================================
// FDE Academy Prototype v3
// DataCamp + Pluralsight Hybrid Style
// ============================================

// Typing Animation Hook
const useTypingEffect = (texts: string[], typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) => {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentText = texts[textIndex]

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseDuration)
      return () => clearTimeout(pauseTimeout)
    }

    if (isDeleting) {
      if (displayText === '') {
        setIsDeleting(false)
        setTextIndex((prev) => (prev + 1) % texts.length)
      } else {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, deletingSpeed)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayText === currentText) {
        setIsPaused(true)
      } else {
        const timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        }, typingSpeed)
        return () => clearTimeout(timeout)
      }
    }
  }, [displayText, textIndex, isDeleting, isPaused, texts, typingSpeed, deletingSpeed, pauseDuration])

  return displayText
}

// FDE Logo - Clean minimal
const FDELogo = ({ size = 32 }: { size?: number }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
    <rect x="5" y="5" width="90" height="90" rx="16" fill="#03EF62" />
    <g fill="#0a0a0a">
      <path d="M25 22 L25 78 L35 78 L35 55 L55 55 L55 45 L35 45 L35 32 L58 32 L58 22 Z" />
      <path d="M52 50 L72 50 L64 42 L68 42 L78 51 L68 60 L64 60 L72 52 L52 52 Z" opacity="0.7" />
    </g>
  </svg>
)

// Circular Progress
const CircularProgress = ({ value, size = 120, strokeWidth = 8 }: { value: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#03EF62"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{value}%</span>
      </div>
    </div>
  )
}

// Skill Bar
const SkillBar = ({ name, level, color = '#03EF62' }: { name: string, level: number, color?: string }) => (
  <div className="flex items-center gap-4">
    <span className="w-20 text-sm text-gray-600 font-medium">{name}</span>
    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${level}%`, backgroundColor: color }}
      />
    </div>
    <span className="w-12 text-sm text-gray-500 text-right">{level}%</span>
  </div>
)

// Mock Data
const mockUser = {
  name: '홍길동',
  role: 'Software Engineer',
  totalHours: 48,
  streak: 7,
}

const mockCourse = {
  title: 'SQL 심화',
  phase: 1,
  module: '1.2',
  progress: 68,
  currentLesson: '실행 계획 분석',
  nextLesson: '쿼리 튜닝 기법',
  timeLeft: '45분',
}

const mockSkills = [
  { name: 'Python', level: 80, color: '#3572A5' },
  { name: 'SQL', level: 68, color: '#e38c00' },
  { name: 'Spark', level: 20, color: '#E25A1C' },
  { name: 'Airflow', level: 0, color: '#017CEE' },
]

const mockPath = [
  { id: '1.1', title: 'Python 심화', status: 'completed', progress: 100 },
  { id: '1.2', title: 'SQL 심화', status: 'in_progress', progress: 68 },
  { id: '1.3', title: 'Apache Spark', status: 'locked', progress: 0 },
  { id: '1.4', title: 'Airflow & Pipeline', status: 'locked', progress: 0 },
]

type View = 'dashboard' | 'path' | 'lesson' | 'profile'

export default function PrototypePage() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const typingText = useTypingEffect(['Data Engineering', 'Knowledge Graphs', 'Cloud Platforms', 'AI Pipelines'])

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header - Clean & Simple */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
              <FDELogo size={36} />
              <span className="text-lg font-semibold text-gray-900">FDE Academy</span>
            </div>
            <nav className="flex items-center gap-1">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'path', label: 'Learning Path' },
                { id: 'profile', label: 'Profile' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentView === item.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Profile */}
          <div className="flex items-center gap-4">
            {/* Streak Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
              <span className="text-orange-500">🔥</span>
              <span className="text-sm font-medium text-orange-600">{mockUser.streak}일 연속</span>
            </div>
            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{mockUser.name}</div>
                <div className="text-xs text-gray-500">{mockUser.role}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                {mockUser.name[0]}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome + Continue Learning Hero */}
            <section className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Welcome */}
                  <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                    Welcome back, {mockUser.name}
                  </h1>
                  <p className="text-gray-500 mb-6">
                    Master <span className="text-green-600 font-medium">{typingText}</span>
                    <span className="inline-block w-0.5 h-5 bg-green-500 ml-1 animate-pulse" />
                  </p>

                  {/* Current Course Card */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 max-w-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                        PHASE {mockCourse.phase}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500">Module {mockCourse.module}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{mockCourse.title}</h2>
                    <p className="text-gray-600 text-sm mb-4">
                      현재: <span className="font-medium">{mockCourse.currentLesson}</span>
                    </p>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${mockCourse.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{mockCourse.progress}%</span>
                    </div>

                    {/* Action */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setCurrentView('lesson')}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Continue Learning →
                      </button>
                      <span className="text-sm text-gray-500">{mockCourse.timeLeft} 남음</span>
                    </div>
                  </div>
                </div>

                {/* Right: Progress Circle */}
                <div className="text-center">
                  <CircularProgress value={17} size={140} strokeWidth={10} />
                  <p className="text-sm text-gray-500 mt-3">전체 진행률</p>
                </div>
              </div>
            </section>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Skills */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">Skill Level</h3>
                  <button
                    onClick={() => setCurrentView('profile')}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    View all →
                  </button>
                </div>
                <div className="space-y-4">
                  {mockSkills.map((skill) => (
                    <SkillBar key={skill.name} {...skill} />
                  ))}
                </div>
              </section>

              {/* Learning Path */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">Learning Path</h3>
                  <button
                    onClick={() => setCurrentView('path')}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    View all →
                  </button>
                </div>
                <div className="space-y-3">
                  {mockPath.map((item, i) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        item.status === 'in_progress'
                          ? 'bg-green-50 border border-green-200'
                          : item.status === 'completed'
                            ? 'bg-gray-50'
                            : 'opacity-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        item.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : item.status === 'in_progress'
                            ? 'bg-green-100 text-green-700 border-2 border-green-500'
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {item.status === 'completed' ? '✓' : i + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${item.status === 'locked' ? 'text-gray-400' : 'text-gray-900'}`}>
                          {item.title}
                        </p>
                        {item.status === 'in_progress' && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 bg-green-200 rounded-full">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.progress}%` }} />
                            </div>
                            <span className="text-xs text-green-600">{item.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Stats */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-6">This Week</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <span className="text-xl">⏱️</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">학습 시간</p>
                        <p className="text-lg font-semibold text-gray-900">8.5시간</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <span className="text-xl">✅</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">완료한 레슨</p>
                        <p className="text-lg font-semibold text-gray-900">12개</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                        <span className="text-xl">🧪</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lab 실습</p>
                        <p className="text-lg font-semibold text-gray-900">3개</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                        <span className="text-xl">🔥</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">연속 학습</p>
                        <p className="text-lg font-semibold text-gray-900">{mockUser.streak}일</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Upcoming & Recommendations */}
            <div className="grid grid-cols-2 gap-6">
              {/* Next Up */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Next Up</h3>
                <div className="space-y-3">
                  {[
                    { title: '쿼리 튜닝 기법', type: 'Lesson', time: '35분' },
                    { title: '트랜잭션 & 락', type: 'Lesson', time: '40분' },
                    { title: 'SQL 심화 Lab', type: 'Lab', time: '60분' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          item.type === 'Lab' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {item.type === 'Lab' ? '🧪' : '📖'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.type}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Milestones */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Milestones</h3>
                <div className="space-y-4">
                  {[
                    { title: 'SQL 심화 완료', days: 3, progress: 68 },
                    { title: 'Phase 1 완료', days: 21, progress: 42 },
                    { title: 'Portfolio #1', days: 30, progress: 25 },
                  ].map((item, i) => (
                    <div key={i} className="p-4 border border-gray-100 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <span className="text-xs text-gray-500">{item.days}일 후</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{item.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {currentView === 'path' && (
          <div className="space-y-6">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              ← Dashboard
            </button>

            {/* Phase Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <span className="text-sm text-green-600 font-medium">PHASE 1</span>
                  <h1 className="text-2xl font-bold text-gray-900">Data Engineering 기초</h1>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="flex-1 w-64 h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '42%' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">42%</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>4 모듈</span>
                  <span>•</span>
                  <span>16 레슨</span>
                  <span>•</span>
                  <span>6 Labs</span>
                  <span>•</span>
                  <span>예상 8주</span>
                </div>
              </div>
            </div>

            {/* Modules */}
            <div className="space-y-4">
              {[
                { id: '1.1', title: 'Python 심화', desc: '데이터 처리를 위한 고급 Python 기법', lessons: 4, labs: 1, status: 'completed', progress: 100 },
                { id: '1.2', title: 'SQL 심화', desc: '복잡한 쿼리와 성능 최적화', lessons: 4, labs: 2, status: 'in_progress', progress: 68 },
                { id: '1.3', title: 'Apache Spark', desc: '대용량 데이터 처리의 기초', lessons: 4, labs: 2, status: 'locked', progress: 0 },
                { id: '1.4', title: 'Airflow & Pipeline', desc: '데이터 파이프라인 오케스트레이션', lessons: 4, labs: 1, status: 'locked', progress: 0 },
              ].map((module) => (
                <div
                  key={module.id}
                  className={`bg-white rounded-xl border p-6 ${
                    module.status === 'locked' ? 'border-gray-100 opacity-60' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                        module.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : module.status === 'in_progress'
                            ? 'bg-green-100 text-green-700 border-2 border-green-500'
                            : 'bg-gray-100 text-gray-400'
                      }`}>
                        {module.status === 'completed' ? '✓' : module.id}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{module.desc}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                          <span>{module.lessons} Lessons</span>
                          <span>{module.labs} Labs</span>
                        </div>
                      </div>
                    </div>
                    {module.status === 'in_progress' && (
                      <button
                        onClick={() => setCurrentView('lesson')}
                        className="px-5 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Continue →
                      </button>
                    )}
                    {module.status === 'completed' && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        완료
                      </span>
                    )}
                  </div>
                  {module.status !== 'locked' && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                          <div
                            className={`h-full rounded-full ${module.status === 'completed' ? 'bg-green-500' : 'bg-green-400'}`}
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">{module.progress}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'lesson' && (
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <button onClick={() => setCurrentView('path')} className="text-gray-500 hover:text-gray-700">Phase 1</button>
              <span className="text-gray-300">/</span>
              <button onClick={() => setCurrentView('path')} className="text-gray-500 hover:text-gray-700">SQL 심화</button>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">Lesson 3</span>
            </div>

            {/* Lesson Content */}
            <div className="grid grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Video Placeholder */}
                  <div className="aspect-video bg-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">▶</span>
                      </div>
                      <p className="text-gray-400">16:32 / 24:18</p>
                    </div>
                  </div>
                  {/* Lesson Info */}
                  <div className="p-6">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">실행 계획 분석 & 쿼리 튜닝</h1>
                    <p className="text-gray-500">PostgreSQL의 EXPLAIN을 활용한 쿼리 최적화 기법을 배웁니다.</p>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Lesson Content</h2>
                  <div className="prose prose-sm max-w-none">
                    <h3>1. EXPLAIN vs EXPLAIN ANALYZE</h3>
                    <p className="text-gray-600">PostgreSQL에서 쿼리 실행 계획을 분석하는 두 가지 방법:</p>
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
{`-- 예상 실행 계획만 확인
EXPLAIN
SELECT * FROM orders WHERE user_id = 123;

-- 실제 실행 후 통계 포함
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 123;`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Progress */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Module Progress</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <CircularProgress value={68} size={80} strokeWidth={6} />
                    <div>
                      <p className="text-sm text-gray-500">SQL 심화</p>
                      <p className="text-lg font-semibold text-gray-900">68% 완료</p>
                    </div>
                  </div>
                </div>

                {/* Lessons List */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Lessons</h3>
                  <div className="space-y-2">
                    {[
                      { title: '윈도우 함수 기초', status: 'completed' },
                      { title: 'CTE & 재귀 쿼리', status: 'completed' },
                      { title: '실행 계획 분석', status: 'current' },
                      { title: '트랜잭션 & 락', status: 'locked' },
                    ].map((lesson, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          lesson.status === 'current' ? 'bg-green-50 border border-green-200' : ''
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          lesson.status === 'completed'
                            ? 'bg-green-500 text-white'
                            : lesson.status === 'current'
                              ? 'bg-green-100 text-green-700 border border-green-500'
                              : 'bg-gray-100 text-gray-400'
                        }`}>
                          {lesson.status === 'completed' ? '✓' : i + 1}
                        </div>
                        <span className={`text-sm ${
                          lesson.status === 'locked' ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          {lesson.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                  <div className="space-y-2">
                    <a href="#" className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700">
                      <span>📄</span> PostgreSQL EXPLAIN 문서
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700">
                      <span>📥</span> 쿼리 튜닝 치트시트
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                ← Previous Lesson
              </button>
              <button className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
                Next Lesson →
              </button>
            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="space-y-6">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              ← Dashboard
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-4xl font-bold text-white">
                  {mockUser.name[0]}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{mockUser.name}</h1>
                  <p className="text-gray-500">{mockUser.role}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      Phase 1 진행중
                    </span>
                    <span className="text-sm text-gray-500">학습 시작: 2025년 1월</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{mockUser.totalHours}</p>
                  <p className="text-sm text-gray-500">학습 시간</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">4/24</p>
                  <p className="text-sm text-gray-500">완료 모듈</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{mockUser.streak}</p>
                  <p className="text-sm text-gray-500">연속 학습일</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">인증서</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Skill Matrix</h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Data Engineering</h3>
                  <div className="space-y-4">
                    {mockSkills.map((skill) => (
                      <SkillBar key={skill.name} {...skill} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Knowledge Graph</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Neo4j', level: 0, color: '#018BFF' },
                      { name: 'SPARQL', level: 0, color: '#3B5998' },
                      { name: 'GraphRAG', level: 0, color: '#00B4AB' },
                    ].map((skill) => (
                      <SkillBar key={skill.name} {...skill} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Certifications</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Neo4j Certified Professional', phase: 3 },
                  { name: 'AWS Solutions Architect', phase: 4 },
                  { name: 'Palantir Foundry Engineer', phase: 'Special' },
                ].map((cert, i) => (
                  <div key={i} className="p-4 border border-gray-100 rounded-lg opacity-50">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <span className="text-gray-400 text-xl">🏆</span>
                    </div>
                    <p className="font-medium text-gray-700">{cert.name}</p>
                    <p className="text-sm text-gray-400 mt-1">Phase {cert.phase} 완료 후</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
