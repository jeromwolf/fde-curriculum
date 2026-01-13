'use client'

import Link from 'next/link'

const foundryCurriculum = [
  {
    week: 1,
    title: 'Foundry 플랫폼 기초',
    slug: 'foundry-foundations',
    topics: ['Palantir Foundry 소개', 'Workspace Navigator', 'Compass 검색', 'Lineage 이해', 'Dataset 구조'],
    practice: '플랫폼 탐색 실습',
    output: 'Foundry 환경 구축'
  },
  {
    week: 2,
    title: '핵심 도구 입문',
    slug: 'foundry-tools',
    topics: ['Pipeline Builder 기초', 'Contour 분석', 'Code Repositories', 'Git 통합', '브랜치 전략'],
    practice: '첫 번째 데이터 파이프라인',
    output: '기본 파이프라인 구축'
  },
  {
    week: 3,
    title: '데이터 파이프라인',
    slug: 'foundry-pipeline',
    topics: ['Data Connection', 'Source 연결 (JDBC, S3, API)', 'Sync 설정', '증분 로딩', '데이터 품질 체크'],
    practice: '외부 데이터 소스 연결',
    output: 'E2E 데이터 파이프라인'
  },
  {
    week: 4,
    title: 'Code Transforms',
    slug: 'foundry-transforms',
    topics: ['PySpark in Foundry', '커스텀 함수', '파티셔닝', '성능 최적화', '유닛 테스트'],
    practice: 'PySpark Transform 작성',
    output: 'Code Transform 프로젝트'
  },
  {
    week: 5,
    title: 'Ontology 구축',
    slug: 'foundry-ontology',
    topics: ['Object Type 생성', 'Property 정의', 'Link Type', 'Action 기초', 'Backing Dataset'],
    practice: '도메인 온톨로지 설계',
    output: '비즈니스 온톨로지'
  },
  {
    week: 6,
    title: 'Workshop 앱 개발',
    slug: 'foundry-workshop',
    topics: ['Widget 종류', '레이아웃 설계', 'Variables & Events', 'Writeback', 'Quiver 시각화'],
    practice: '인터랙티브 대시보드',
    output: '운영 애플리케이션'
  },
  {
    week: 7,
    title: 'AIP & AI Integration',
    slug: 'foundry-aip',
    topics: ['AIP 아키텍처', 'AIP Logic 함수', 'LLM 통합', 'Agentic Workflows', 'Document AI'],
    practice: 'AI 에이전트 구축',
    output: 'AIP 통합 시스템'
  },
  {
    week: 8,
    title: '자격증 준비 & 시험',
    slug: 'foundry-certification',
    topics: ['Data Engineer 자격증', 'App Developer 자격증', '핵심 개념 복습', '모의시험', '시험 전략'],
    practice: '모의시험 & 최종 점검',
    output: 'Palantir 공식 자격증!'
  }
]

const certificationTracks = [
  {
    name: 'Foundry Data Engineer',
    domains: ['Data Connection', 'Pipeline Builder', 'Code Repositories', 'Transforms', 'Scheduling'],
    color: 'bg-blue-500',
    weeks: '1-4'
  },
  {
    name: 'Foundry Application Developer',
    domains: ['Ontology', 'Workshop', 'Actions', 'Writeback', 'Quiver'],
    color: 'bg-purple-500',
    weeks: '5-7'
  }
]

export default function FoundrySpecialPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link href="/specials" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            스페셜 과정 목록
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">SPECIAL</span>
            <span className="px-3 py-1 bg-green-500 rounded-full text-sm font-bold">8주 과정</span>
          </div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <span className="text-3xl">🔷</span>
            Palantir Foundry 스페셜
          </h1>
          <p className="mt-2 text-white/90 text-lg">
            Foundry 플랫폼 마스터 및 공식 자격증 취득 (2개월 집중 과정)
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Palantir Foundry 소개 */}
        <div className="bg-white rounded-xl p-6 mb-8 border-2 border-indigo-200">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <span>🔷</span> Palantir Foundry란?
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 mb-4">
                <strong>Palantir Foundry</strong>는 세계적인 데이터 분석 기업 Palantir Technologies가 개발한
                <span className="text-indigo-600 font-medium"> 엔터프라이즈 데이터 플랫폼</span>입니다.
                데이터 통합, 변환, 분석, 시각화를 하나의 플랫폼에서 수행할 수 있으며,
                특히 <strong>Ontology</strong>(온톨로지) 개념을 통해 비즈니스 도메인을 모델링합니다.
              </p>
              <p className="text-gray-700 mb-4">
                Fortune 500 기업, 정부 기관, 의료/제약 기업 등에서 광범위하게 사용되며,
                미국 국방부, Airbus, BP, Merck 등이 주요 고객입니다.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://www.palantir.com/platforms/foundry/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition-colors"
                >
                  🔗 공식 웹사이트
                </a>
                <a
                  href="https://learn.palantir.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                >
                  📚 Palantir Learn
                </a>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
              <h3 className="font-bold text-gray-900 mb-3">Foundry 핵심 구성요소</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">▸</span>
                  <div><strong>Pipeline Builder</strong> - 노코드 데이터 변환 도구</div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">▸</span>
                  <div><strong>Code Repositories</strong> - PySpark/SQL 기반 코드 변환</div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">▸</span>
                  <div><strong>Ontology</strong> - 비즈니스 객체와 관계 모델링</div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">▸</span>
                  <div><strong>Workshop</strong> - 인터랙티브 애플리케이션 빌더</div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">▸</span>
                  <div><strong>AIP</strong> - LLM 기반 AI 통합 플랫폼</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 text-lg">💡</span>
              <div className="text-sm text-yellow-800">
                <strong>왜 Foundry를 배워야 할까요?</strong> Palantir FDE(Forward Deployed Engineer) 채용 시
                Foundry 경험이 필수이며, 연봉 $150K~$250K+ 수준입니다. 또한 데이터 플랫폼 아키텍처의
                최신 트렌드(Ontology, Data Mesh, AIP)를 실무 수준으로 익힐 수 있습니다.
              </div>
            </div>
          </div>
        </div>

        {/* 과정 개요 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
            <div className="text-3xl font-bold text-indigo-600">8주</div>
            <div className="text-gray-600 mt-1">학습 기간</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
            <div className="text-3xl font-bold text-purple-600">40일</div>
            <div className="text-gray-600 mt-1">일일 학습</div>
          </div>
          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
            <div className="text-3xl font-bold text-green-600">2개</div>
            <div className="text-gray-600 mt-1">자격증 트랙</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
            <div className="text-3xl font-bold text-orange-600">PRO</div>
            <div className="text-gray-600 mt-1">요구 수준</div>
          </div>
        </div>

        {/* 선수 과목 */}
        <div className="bg-yellow-50 rounded-xl p-6 mb-8 border border-yellow-200">
          <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
            <span>📋</span> 선수 과목 (Prerequisites)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">필수</span>
                <span className="font-semibold text-gray-900">Phase 1 수료</span>
              </div>
              <p className="text-sm text-gray-600">Python, SQL, Spark, Airflow 기초</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">필수</span>
                <span className="font-semibold text-gray-900">Phase 2 수료</span>
              </div>
              <p className="text-sm text-gray-600">데이터 분석, ML 기초</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600">권장</span>
                <span className="font-semibold text-gray-900">Phase 3 수료</span>
              </div>
              <p className="text-sm text-gray-600">Knowledge Graph, Ontology 개념</p>
            </div>
          </div>
        </div>

        {/* 자격증 트랙 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200">
          <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <span>🏆</span> 자격증 트랙
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {certificationTracks.map((track) => (
              <div key={track.name} className="bg-white rounded-lg p-5 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${track.color} flex items-center justify-center text-white font-bold`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{track.name}</div>
                    <div className="text-sm text-gray-500">Week {track.weeks}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {track.domains.map((domain, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 자격증 상세 정보 */}
          <div className="bg-white rounded-lg p-5 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-4">📋 시험 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 mb-1">시험 형식</div>
                <div className="font-semibold text-gray-900">객관식 + 실습</div>
                <div className="text-xs text-gray-500 mt-1">약 50-60문항</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 mb-1">시험 시간</div>
                <div className="font-semibold text-gray-900">90~120분</div>
                <div className="text-xs text-gray-500 mt-1">온라인 프록터</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 mb-1">합격 기준</div>
                <div className="font-semibold text-gray-900">70% 이상</div>
                <div className="text-xs text-gray-500 mt-1">도메인별 최소 점수 있음</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 mb-1">유효 기간</div>
                <div className="font-semibold text-gray-900">2년</div>
                <div className="text-xs text-gray-500 mt-1">갱신 시험 필요</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://learn.palantir.com/page/certification"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                🎓 공식 자격증 페이지
              </a>
              <a
                href="https://learn.palantir.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                📖 학습 자료 (Palantir Learn)
              </a>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-600">✅</span>
                <div className="text-green-800">
                  <strong>참고:</strong> Palantir 자격증은 파트너사 또는 고객사 직원에게 제공됩니다.
                  일반 응시는 Palantir Learn 플랫폼에서 학습 완료 후 가능합니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 주차별 커리큘럼 */}
        <h2 className="text-2xl font-bold mb-6">주차별 커리큘럼</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {foundryCurriculum.map((weekData) => (
            <Link
              key={weekData.week}
              href={`/learn/week/${weekData.slug}`}
              className="bg-white rounded-xl overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-lg transition-all group"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Week {weekData.week}</span>
                  <span className="text-sm opacity-80">5일</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {weekData.title}
                </h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {weekData.topics.slice(0, 3).map((topic, i) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">
                      {topic}
                    </span>
                  ))}
                  {weekData.topics.length > 3 && (
                    <span className="px-2 py-0.5 text-gray-400 text-xs">
                      +{weekData.topics.length - 3}
                    </span>
                  )}
                </div>
                <div className="text-sm text-indigo-600 font-medium pt-2 border-t border-gray-100">
                  {weekData.practice}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {weekData.output}
                </div>
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
                    학습 시작
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 학습 로드맵 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-200">
          <h2 className="text-xl font-bold text-indigo-800 mb-4">학습 로드맵</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
            <div className="space-y-4">
              <div className="relative pl-10">
                <div className="absolute left-2 w-5 h-5 rounded-full bg-indigo-500 border-4 border-white"></div>
                <div className="bg-white rounded-lg p-4 border border-indigo-100">
                  <div className="font-bold text-indigo-600">Week 1-2: 플랫폼 기초</div>
                  <div className="text-sm text-gray-600">Foundry 환경 이해 및 기본 도구 습득</div>
                </div>
              </div>
              <div className="relative pl-10">
                <div className="absolute left-2 w-5 h-5 rounded-full bg-blue-500 border-4 border-white"></div>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="font-bold text-blue-600">Week 3-4: Data Engineering</div>
                  <div className="text-sm text-gray-600">파이프라인 구축 & Code Transforms</div>
                  <div className="mt-2 text-xs font-medium text-green-600">→ Data Engineer 자격증 준비 완료</div>
                </div>
              </div>
              <div className="relative pl-10">
                <div className="absolute left-2 w-5 h-5 rounded-full bg-purple-500 border-4 border-white"></div>
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="font-bold text-purple-600">Week 5-7: Application Development</div>
                  <div className="text-sm text-gray-600">Ontology, Workshop, AIP 마스터</div>
                  <div className="mt-2 text-xs font-medium text-green-600">→ App Developer 자격증 준비 완료</div>
                </div>
              </div>
              <div className="relative pl-10">
                <div className="absolute left-2 w-5 h-5 rounded-full bg-green-500 border-4 border-white"></div>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="font-bold text-green-600">Week 8: 자격증 취득</div>
                  <div className="text-sm text-gray-600">모의시험, 최종 점검, 공식 시험 응시</div>
                  <div className="mt-2 text-xs font-medium text-green-600">→ Palantir 공식 자격증 취득!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 7 연결 */}
        <div className="bg-white rounded-xl p-6 border-2 border-indigo-200 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Phase 7으로 바로가기</h3>
          <p className="text-gray-600 mb-4">
            이 과정은 메인 커리큘럼의 Phase 7과 동일합니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/phase/7"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Phase 7 학습 시작
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/specials"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-indigo-200 text-indigo-600 font-medium hover:bg-indigo-50 transition-colors"
            >
              다른 스페셜 과정 보기
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <Link href="/specials" className="text-blue-600 hover:underline">
            스페셜 과정
          </Link>
          {' | '}
          <Link href="/curriculum" className="text-blue-600 hover:underline">
            메인 커리큘럼
          </Link>
          {' | '}
          <span>Palantir Foundry 스페셜</span>
        </div>
      </footer>
    </div>
  )
}
