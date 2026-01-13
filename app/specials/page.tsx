'use client'

import Link from 'next/link'

// 스페셜 과정 목록
const specialCourses = [
  {
    id: 'foundry',
    title: 'Palantir Foundry 스페셜',
    subtitle: '2개월 집중 과정',
    description: 'Palantir Foundry 플랫폼을 마스터하고 공식 자격증을 취득하세요. Pipeline Builder부터 Ontology, Workshop, AIP까지 실무에서 바로 활용 가능한 기술을 배웁니다. Fortune 500 기업과 정부 기관에서 사용하는 엔터프라이즈 데이터 플랫폼입니다.',
    duration: '8주',
    level: 'Advanced',
    prerequisites: ['Phase 1-2 수료', '데이터 엔지니어링 경험'],
    topics: ['Pipeline Builder', 'Code Transforms', 'Ontology', 'Workshop', 'AIP'],
    certification: 'Palantir Foundry Certified',
    color: 'from-indigo-500 to-purple-600',
    borderColor: 'border-indigo-300',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    icon: '🔷',
    available: true,
    highlights: ['FDE 채용 필수 역량', '연봉 $150K~$250K+', '2개 자격증 트랙'],
  },
  {
    id: 'aws-cert',
    title: 'AWS 자격증 집중',
    subtitle: '1개월 집중 과정',
    description: 'AWS Solutions Architect Associate(SAA-C03) 자격증 취득을 위한 집중 과정입니다. 실제 AWS 환경에서 아키텍처 설계 능력을 키우고, 클라우드 취업/이직에 필요한 공인 자격을 획득하세요.',
    duration: '4주',
    level: 'Intermediate',
    prerequisites: ['Phase 4 수료 권장', '클라우드 기초 이해'],
    topics: ['EC2', 'S3', 'VPC', 'IAM', 'Lambda', 'RDS'],
    certification: 'AWS SAA-C03',
    color: 'from-orange-500 to-amber-600',
    borderColor: 'border-orange-300',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    icon: '☁️',
    available: false,
    highlights: ['공인 자격증', '클라우드 취업 필수', '실습 중심'],
  },
  {
    id: 'llm-deep',
    title: 'LLM & Agent 심화',
    subtitle: '1개월 집중 과정',
    description: 'LLM 파인튜닝, 프롬프트 엔지니어링, 멀티 에이전트 시스템을 심화 학습합니다. Claude, GPT를 활용한 고급 AI 애플리케이션 개발과 프로덕션 배포까지 경험하세요.',
    duration: '4주',
    level: 'Advanced',
    prerequisites: ['Phase 5 수료', 'Python 숙련'],
    topics: ['Fine-tuning', 'RLHF', 'RAG 심화', 'Multi-Agent', 'Tool Use'],
    certification: null,
    color: 'from-green-500 to-teal-600',
    borderColor: 'border-green-300',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    icon: '🤖',
    available: false,
    highlights: ['최신 AI 기술', 'Agent 시스템', '프로덕션 배포'],
  },
  {
    id: 'finance',
    title: '금융 도메인 특화',
    subtitle: '1개월 집중 과정',
    description: 'FIBO(Financial Industry Business Ontology)를 활용한 금융 데이터 분석, 리스크 관리, KYC/AML 시스템 구축을 배웁니다. 금융권 취업을 목표로 하는 분들에게 최적화된 과정입니다.',
    duration: '4주',
    level: 'Advanced',
    prerequisites: ['Phase 3 수료', '금융 기초 지식'],
    topics: ['FIBO', '리스크 분석', '포트폴리오', 'KYC/AML', 'RegTech'],
    certification: null,
    color: 'from-blue-500 to-cyan-600',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    icon: '💰',
    available: false,
    highlights: ['금융 온톨로지', 'KYC/AML', '금융권 취업'],
  },
  {
    id: 'healthcare',
    title: '헬스케어 도메인 특화',
    subtitle: '1개월 집중 과정',
    description: 'FHIR(Fast Healthcare Interoperability Resources) 표준과 SNOMED-CT를 활용한 의료 데이터 시스템을 구축합니다. 헬스케어 IT, 디지털 헬스 분야 진출을 원하는 분들을 위한 과정입니다.',
    duration: '4주',
    level: 'Advanced',
    prerequisites: ['Phase 3 수료'],
    topics: ['FHIR', 'SNOMED-CT', 'Clinical NLP', 'EHR 분석', 'Drug Discovery'],
    certification: null,
    color: 'from-red-500 to-pink-600',
    borderColor: 'border-red-300',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    icon: '🏥',
    available: false,
    highlights: ['FHIR 표준', '의료 데이터', '디지털 헬스'],
  },
]

export default function SpecialsPage() {
  const availableCourses = specialCourses.filter(c => c.available)
  const upcomingCourses = specialCourses.filter(c => !c.available)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link href="/curriculum" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            메인 커리큘럼으로
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">SPECIAL COURSES</span>
          </div>
          <h1 className="text-4xl font-bold">스페셜 과정</h1>
          <p className="mt-2 text-white/90 text-lg">
            메인 과정 수료 후 또는 병행하여 수강할 수 있는 전문 심화 과정
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 소개 */}
        <div className="bg-white rounded-xl p-6 mb-8 border-2 border-purple-200">
          <h2 className="text-xl font-bold text-purple-800 mb-3">스페셜 과정이란?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-bold text-gray-900">전문 분야 집중</div>
                <div className="text-gray-600">특정 기술이나 도메인에 대한 심화 학습</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📜</span>
              <div>
                <div className="font-bold text-gray-900">자격증 취득</div>
                <div className="text-gray-600">공식 자격증 준비 및 취득 지원</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <div className="font-bold text-gray-900">단기 집중</div>
                <div className="text-gray-600">1-2개월 집중 과정으로 빠른 역량 강화</div>
              </div>
            </div>
          </div>
        </div>

        {/* 수강 가능한 과정 */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          수강 가능한 과정
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {availableCourses.map((course) => (
            <Link
              key={course.id}
              href={`/specials/${course.id}`}
              className={`bg-white rounded-xl overflow-hidden border-2 ${course.borderColor} hover:shadow-xl transition-all group`}
            >
              <div className={`bg-gradient-to-r ${course.color} px-6 py-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl mr-3">{course.icon}</span>
                    <span className="text-xl font-bold">{course.title}</span>
                  </div>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">
                    {course.duration}
                  </span>
                </div>
                <p className="mt-1 text-white/80">{course.subtitle}</p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">{course.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {course.topics.map((topic, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 ${course.bgColor} ${course.textColor} rounded text-xs font-medium`}
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Highlights */}
                {course.highlights && (
                  <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    {course.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium"
                      >
                        <span className="text-yellow-600">★</span>
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">레벨:</span> {course.level}
                  </div>
                  {course.certification && (
                    <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {course.certification}
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r ${course.color} text-white font-medium group-hover:opacity-90 transition-opacity`}>
                    과정 상세 보기
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 준비 중인 과정 */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          준비 중인 과정
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 opacity-70"
            >
              <div className={`bg-gradient-to-r ${course.color} px-4 py-3 text-white`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{course.icon}</span>
                  <span className="font-bold text-sm">{course.title}</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{course.duration}</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-8 text-center border border-purple-200">
          <h3 className="text-2xl font-bold text-purple-800 mb-2">메인 과정부터 시작하세요</h3>
          <p className="text-gray-600 mb-6">
            스페셜 과정은 메인 과정의 기초 위에 진행됩니다. 아직 시작하지 않았다면 메인 과정부터 시작하세요.
          </p>
          <Link
            href="/curriculum"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            메인 커리큘럼 보기
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <Link href="/curriculum" className="text-blue-600 hover:underline">
            FDE Academy 메인 커리큘럼
          </Link>
          {' | '}
          <span>스페셜 과정</span>
        </div>
      </footer>
    </div>
  )
}
