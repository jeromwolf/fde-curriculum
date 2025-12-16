// 패키지 및 가격 정책
import type { Package, Phase } from './types'

// 패키지 정의
export const packages: Package[] = [
  {
    id: 'free',
    name: '무료 체험',
    price: 0,
    access: 'free',
    features: [
      'Week 1 전체 콘텐츠',
      '기본 퀴즈 및 코드 실습',
      '커뮤니티 접근'
    ],
    phases: [1]  // Phase 1의 Week 1만
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 99000,
    yearlyPrice: 990000,  // 연간 결제 시 2개월 무료
    access: 'basic',
    features: [
      'Phase 1-2 전체 (4개월)',
      '모든 퀴즈 및 코드 실습',
      '프로젝트 피드백',
      '커뮤니티 멘토링'
    ],
    phases: [1, 2]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199000,
    yearlyPrice: 1990000,
    access: 'pro',
    recommended: true,
    features: [
      'Phase 1-4 전체 (8개월)',
      'Foundry 실습 환경',
      '1:1 멘토링 (월 2회)',
      '포트폴리오 리뷰',
      '취업 연계 지원'
    ],
    phases: [1, 2, 3, 4]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499000,
    yearlyPrice: 4990000,
    access: 'enterprise',
    features: [
      '전체 Phase (12개월)',
      'Foundry 전용 환경',
      '무제한 1:1 멘토링',
      '실무 프로젝트 참여',
      '수료 후 채용 연계',
      'FDE 인증서 발급'
    ],
    phases: [1, 2, 3, 4, 5, 6]
  }
]

// Phase 정의
export const phases: Phase[] = [
  {
    phase: 1,
    title: '데이터 엔지니어링 기초',
    description: 'Python, SQL, Spark, Airflow 기반 데이터 파이프라인 구축',
    duration: '2개월',
    color: 'blue',
    access: 'free',  // Week 1만 무료, 나머지는 basic
    weeks: ['python-advanced', 'pandas-data', 'sql-deep', 'data-modeling', 'spark-intro', 'spark-delta', 'airflow', 'e2e-pipeline']
  },
  {
    phase: 2,
    title: '데이터 분석 & 컨설팅',
    description: 'EDA, Feature Engineering, ML 모델링, 비즈니스 커뮤니케이션',
    duration: '2개월',
    color: 'teal',
    access: 'basic',
    weeks: ['problem-definition', 'data-preprocessing', 'feature-engineering', 'feature-selection', 'ml-modeling', 'clustering', 'anomaly-detection', 'timeseries']
  },
  {
    phase: 3,
    title: '온톨로지 & Knowledge Graph',
    description: 'RDF, OWL, SPARQL, Neo4j 기반 Knowledge Graph 구축',
    duration: '2개월',
    color: 'purple',
    access: 'pro',
    weeks: ['ontology-intro', 'rdf-owl', 'sparql', 'neo4j', 'kg-construction', 'kg-reasoning', 'kg-application', 'kg-project']
  },
  {
    phase: 4,
    title: 'Foundry 플랫폼',
    description: 'Palantir Foundry 스타일 데이터 플랫폼 구축 및 운영',
    duration: '2개월',
    color: 'orange',
    access: 'pro',
    weeks: ['foundry-intro', 'object-types', 'pipeline-builder', 'ontology-manager', 'workshop', 'quiver', 'actions', 'foundry-project']
  },
  {
    phase: 5,
    title: 'AI & LLM 통합',
    description: 'LLM, RAG, AI Agent 개발 및 통합',
    duration: '2개월',
    color: 'pink',
    access: 'enterprise',
    weeks: ['llm-intro', 'prompt-engineering', 'rag', 'langchain', 'ai-agent', 'function-calling', 'multi-agent', 'ai-project']
  },
  {
    phase: 6,
    title: 'FDE 실무 & 취업',
    description: '실무 프로젝트, 포트폴리오, 면접 준비',
    duration: '2개월',
    color: 'gray',
    access: 'enterprise',
    weeks: ['fde-mindset', 'client-communication', 'real-project-1', 'real-project-2', 'portfolio', 'resume', 'interview', 'career']
  }
]

// 패키지로 접근 가능한지 확인
export function canAccess(userAccess: string, requiredAccess: string): boolean {
  const levels = ['free', 'basic', 'pro', 'enterprise']
  return levels.indexOf(userAccess) >= levels.indexOf(requiredAccess)
}

// 패키지 ID로 찾기
export function getPackageById(id: string): Package | undefined {
  return packages.find(p => p.id === id)
}

// Phase 번호로 찾기
export function getPhaseByNumber(num: number): Phase | undefined {
  return phases.find(p => p.phase === num)
}
