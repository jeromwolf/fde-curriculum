'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AuthButton from '@/components/AuthButton'

// FDE Logo - Clean minimal with green accent
const FDELogo = ({ size = 40 }: { size?: number }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
    <rect x="5" y="5" width="90" height="90" rx="16" fill="#03EF62" />
    <g fill="#0a0a0a">
      <path d="M25 22 L25 78 L35 78 L35 55 L55 55 L55 45 L35 45 L35 32 L58 32 L58 22 Z" />
      <path d="M52 50 L72 50 L64 42 L68 42 L78 51 L68 60 L64 60 L72 52 L52 52 Z" opacity="0.7" />
    </g>
  </svg>
)

export default function LandingPage() {
  const [typedText, setTypedText] = useState('')
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const phrases = [
    'Data Engineering',
    'Knowledge Graph',
    'Cloud Architecture',
    'AI & LLM Systems',
    'Forward Deployed Engineer'
  ]

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < currentPhrase.length) {
          setTypedText(currentPhrase.slice(0, typedText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(typedText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, currentPhraseIndex, phrases])

  const stats = [
    { value: '12', unit: '개월', label: '집중 과정' },
    { value: '6', unit: '개', label: '실무 프로젝트' },
    { value: '2억+', unit: '원', label: '목표 연봉' },
    { value: '100%', unit: '', label: '실무 중심' },
  ]

  const features = [
    {
      icon: '🔧',
      title: 'Data Engineering',
      description: 'Python, SQL, Spark, Airflow로 대규모 데이터 파이프라인 구축',
      phase: 'Phase 1',
      color: 'bg-blue-500'
    },
    {
      icon: '📊',
      title: 'Data Analysis & Consulting',
      description: '비즈니스 문제 정의부터 경영진 발표까지 컨설팅 역량',
      phase: 'Phase 2',
      color: 'bg-teal-500'
    },
    {
      icon: '🕸️',
      title: 'Knowledge Graph',
      description: 'Neo4j, Cypher, GraphRAG로 지식 그래프 애플리케이션 개발',
      phase: 'Phase 3',
      color: 'bg-purple-500'
    },
    {
      icon: '☁️',
      title: 'Cloud & Infrastructure',
      description: 'AWS, Terraform, Kubernetes로 프로덕션 인프라 구축',
      phase: 'Phase 4',
      color: 'bg-orange-500'
    },
    {
      icon: '🤖',
      title: 'GenAI & Agents',
      description: 'LLM, RAG, AI Agent로 최신 AI 애플리케이션 개발',
      phase: 'Phase 5',
      color: 'bg-green-500'
    },
    {
      icon: '🚀',
      title: 'Industry Projects',
      description: '금융, 의료, 제조 등 실제 산업 도메인 캡스톤 프로젝트',
      phase: 'Phase 6',
      color: 'bg-red-500'
    },
  ]

  const testimonials = [
    {
      name: '김데이터',
      role: 'Data Engineer @ 테크 스타트업',
      content: 'FDE Academy 덕분에 주니어에서 시니어로 빠르게 성장할 수 있었습니다. 실무 중심 커리큘럼이 정말 도움됐어요.',
      avatar: '👨‍💻'
    },
    {
      name: '이클라우드',
      role: 'Solutions Architect @ 글로벌 기업',
      content: 'Knowledge Graph와 AI를 함께 배울 수 있는 곳이 없었는데, 여기서 모든 것을 배웠습니다.',
      avatar: '👩‍💻'
    },
    {
      name: '박엔지니어',
      role: 'Forward Deployed Engineer',
      content: '12개월 만에 연봉 2배 상승! 체계적인 커리큘럼과 포트폴리오가 면접에서 큰 도움이 됐습니다.',
      avatar: '🧑‍💻'
    }
  ]

  const companies = [
    'Palantir', 'Google', 'Amazon', 'Microsoft', 'Netflix', 'Meta', 'Apple', 'NVIDIA'
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FDELogo size={40} />
            <span className="font-bold text-xl text-gray-900">FDE Academy</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/curriculum" className="text-gray-600 hover:text-gray-900 transition">커리큘럼</Link>
            <Link href="/community" className="text-gray-600 hover:text-gray-900 transition">커뮤니티</Link>
            <Link href="/members" className="text-gray-600 hover:text-gray-900 transition">회원</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition">요금제</Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-city.png"
            alt="FDE Academy Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#03EF62]/20 backdrop-blur-sm rounded-full text-[#03EF62] text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-[#03EF62] rounded-full animate-pulse" />
              2026년 상반기 모집 중
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Master<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#03EF62] to-[#00D956]">
                {typedText}
              </span>
              <span className="animate-pulse">|</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Forward Deployed Engineer가 되기 위한 12개월 집중 과정.<br />
              데이터 엔지니어링부터 AI 에이전트까지, 실무 중심 커리큘럼.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/learn/phase/3"
                className="px-8 py-4 bg-[#03EF62] text-gray-900 rounded-xl font-semibold text-lg hover:bg-[#00D956] transition shadow-lg shadow-[#03EF62]/30"
              >
                무료 체험 시작
              </Link>
              <Link
                href="/curriculum"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition border border-white/20"
              >
                커리큘럼 보기
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center md:text-left">
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {stat.value}<span className="text-[#03EF62]">{stat.unit}</span>
                  </div>
                  <div className="text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* What is FDE Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Forward Deployed Engineer란?
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                FDE는 <span className="font-semibold text-[#03EF62]">고객 현장에 파견되어 복잡한 데이터 문제를 해결</span>하는
                엘리트 엔지니어입니다. Palantir가 창시한 이 역할은 기술력과 비즈니스 이해력을
                모두 갖춘 전문가를 의미합니다.
              </p>
              <div className="space-y-4">
                {[
                  '데이터 파이프라인 설계 및 구축',
                  '지식 그래프 기반 분석 시스템',
                  'AI/ML 솔루션 개발 및 배포',
                  '고객과의 직접 소통 및 문제 해결'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-digital-twin.png"
                alt="Digital Twin Engineering"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              6 Phase 커리큘럼
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              12개월간 체계적으로 설계된 커리큘럼으로 FDE에 필요한 모든 역량을 습득합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#03EF62] hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 ${feature.color} text-white text-xs font-bold rounded-full`}>
                    {feature.phase}
                  </span>
                </div>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#03EF62] transition">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/curriculum"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              전체 커리큘럼 보기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-500 mb-8">수료생 취업 기업</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {companies.map((company) => (
              <span
                key={company}
                className="text-2xl font-bold text-gray-300 hover:text-gray-500 transition"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              수료생 후기
            </h2>
            <p className="text-xl text-gray-600">
              FDE Academy를 통해 커리어를 전환한 분들의 이야기
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100"
              >
                <div className="text-5xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            지금 시작하세요
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            12개월 후, 당신은 Forward Deployed Engineer가 됩니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/curriculum"
              className="px-8 py-4 bg-[#03EF62] text-gray-900 rounded-xl font-semibold text-lg hover:bg-[#00D956] transition"
            >
              커리큘럼 확인하기
            </Link>
            <a
              href="mailto:contact@fde-academy.ai.kr"
              className="px-8 py-4 bg-transparent text-white rounded-xl font-semibold text-lg border-2 border-white/50 hover:bg-white/10 transition"
            >
              문의하기
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FDELogo size={40} />
                <span className="font-bold text-xl text-white">FDE Academy</span>
              </div>
              <p className="text-gray-400 text-sm">
                Forward Deployed Engineer 양성 과정
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">커리큘럼</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/curriculum" className="hover:text-white transition">메인 과정 (12개월)</Link></li>
                <li><Link href="/curriculum" className="hover:text-white transition">Foundry 스페셜</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">리소스</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">블로그</a></li>
                <li><a href="#" className="hover:text-white transition">YouTube</a></li>
                <li><a href="#" className="hover:text-white transition">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">연락처</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>contact@fde-academy.ai.kr</li>
                <li>서울특별시</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
            <span>&copy; 2025 FDE Academy. All rights reserved.</span>
            <span className="font-mono text-xs text-gray-600">
              v{process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0'} ({process.env.NEXT_PUBLIC_GIT_COMMIT || 'unknown'})
              {process.env.NEXT_PUBLIC_BUILD_TIME && (
                <> • {new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleDateString('ko-KR')}</>
              )}
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
