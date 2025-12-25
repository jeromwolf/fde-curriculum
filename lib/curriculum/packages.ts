// 패키지 및 가격 정책 (v3.6)
import type { Package, Phase } from './types'

// 패키지 정의 (v3.6 - Core + Specialization 구조)
export const packages: Package[] = [
  {
    id: 'free',
    name: '무료 체험',
    price: 0,
    access: 'free',
    features: [
      'Phase 1 Week 1 전체 콘텐츠',
      'Phase 3 Week 1 전체 콘텐츠',
      '기본 퀴즈 및 코드 실습',
      '커뮤니티 접근'
    ],
    phases: [1, 3]  // Phase 1, 3의 Week 1만 무료
  },
  {
    id: 'core',
    name: 'Core',
    price: 149000,
    yearlyPrice: 1490000,
    access: 'core',
    recommended: true,
    features: [
      'Core Track 전체 (6개월)',
      'Phase 1-3 전체 콘텐츠',
      '포트폴리오 3개 구축',
      '모든 퀴즈 및 코드 실습',
      '커뮤니티 멘토링'
    ],
    phases: [1, 2, 3]
  },
  {
    id: 'core-capstone',
    name: 'Core + Capstone',
    price: 249000,
    yearlyPrice: 2490000,
    access: 'pro',
    features: [
      'Core Track (6개월) + Capstone (2.5개월)',
      'Phase 1-3, 6 전체 콘텐츠',
      '포트폴리오 4개 구축',
      '1:1 멘토링 (월 2회)',
      '취업 연계 지원'
    ],
    phases: [1, 2, 3, 6]
  },
  {
    id: 'full',
    name: 'Full Course',
    price: 399000,
    yearlyPrice: 3990000,
    access: 'enterprise',
    features: [
      '전체 Phase (12.5개월)',
      'Core + Specialization + Capstone',
      '포트폴리오 6개 구축',
      '무제한 1:1 멘토링',
      '실무 프로젝트 참여',
      '수료 후 채용 연계',
      'FDE 인증서 발급'
    ],
    phases: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 'cloud-specialist',
    name: 'Cloud Specialist',
    price: 299000,
    yearlyPrice: 2990000,
    access: 'pro',
    features: [
      'Core (6개월) + 클라우드 (2개월)',
      'Phase 1-4 전체 콘텐츠',
      '포트폴리오 4개 구축',
      'AWS/K8s 실습 환경',
      '인프라 특화 취업 지원'
    ],
    phases: [1, 2, 3, 4]
  },
  {
    id: 'ai-specialist',
    name: 'AI Specialist',
    price: 299000,
    yearlyPrice: 2990000,
    access: 'pro',
    features: [
      'Core (6개월) + AI Agent (2개월)',
      'Phase 1-3, 5 전체 콘텐츠',
      '포트폴리오 4개 구축',
      'AI Agent 실습 환경',
      'AI 특화 취업 지원'
    ],
    phases: [1, 2, 3, 5]
  }
]

// Phase 정의 (v3.6 - AI-Native FDE)
export const phases: Phase[] = [
  // === CORE TRACK (6개월, 순차 필수) ===
  {
    phase: 1,
    title: '데이터 엔지니어링 + AI 도구',
    description: 'Python, SQL, Spark, Airflow + Copilot/Claude로 AI-Native 개발',
    duration: '2개월',
    color: 'blue',
    access: 'free',  // Week 1만 무료
    track: 'core',
    weeks: ['python-advanced', 'pandas-data', 'sql-deep', 'data-modeling', 'spark-intro', 'spark-delta', 'airflow-dbt', 'e2e-pipeline']
  },
  {
    phase: 2,
    title: '데이터 분석 & AI 분석',
    description: 'EDA, ML 모델링, LLM 기반 분석 자동화, 비즈니스 컨설팅',
    duration: '2개월',
    color: 'teal',
    access: 'core',
    track: 'core',
    weeks: ['problem-definition', 'eda-visualization', 'feature-engineering', 'ml-modeling', 'automl', 'llm-analysis', 'business-consulting', 'analysis-project']
  },
  {
    phase: 3,
    title: '지식 그래프 & GraphRAG',
    description: 'Neo4j, Ontology 설계, Entity Resolution, GraphRAG 통합',
    duration: '2개월',
    color: 'purple',
    access: 'free',  // Week 1만 무료
    track: 'core',
    weeks: ['graph-intro', 'cypher-modeling', 'graph-algorithms', 'entity-resolution', 'rag-basics', 'graph-rag', 'text2cypher', 'kg-project']
  },
  // === SPECIALIZATION (선택, Core 완료 후) ===
  {
    phase: 4,
    title: '클라우드 & AI 인프라',
    description: 'AWS, Terraform, Kubernetes, LLM 서빙, 벡터 DB 운영',
    duration: '2개월',
    color: 'orange',
    access: 'pro',
    track: 'specialization',
    weeks: ['aws-fundamentals', 'terraform', 'docker-k8s', 'cicd', 'sagemaker', 'vector-db', 'llm-serving', 'infra-project']
  },
  {
    phase: 5,
    title: 'AI Agent & 자동화',
    description: 'AI Agent 설계, MCP, 멀티에이전트, 워크플로우 자동화',
    duration: '2개월',
    color: 'pink',
    access: 'pro',
    track: 'specialization',
    weeks: ['agent-architecture', 'tool-use', 'mcp-basics', 'mcp-advanced', 'multi-agent', 'workflow-automation', 'agent-testing', 'agent-project']
  },
  // === CAPSTONE (Core 완료 필수) ===
  {
    phase: 6,
    title: '산업별 프로젝트 & 취업',
    description: '금융/헬스케어/제조/리테일 도메인 프로젝트, 포트폴리오, 면접',
    duration: '2.5개월',
    color: 'gray',
    access: 'pro',
    track: 'capstone',
    weeks: ['domain-selection', 'domain-project-1', 'domain-project-2', 'domain-project-3', 'portfolio-integration', 'portfolio-polish', 'resume-linkedin', 'mock-interview', 'job-search', 'networking']
  }
]

// 패키지로 접근 가능한지 확인
export function canAccess(userAccess: string, requiredAccess: string): boolean {
  const levels = ['free', 'core', 'pro', 'enterprise']
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
