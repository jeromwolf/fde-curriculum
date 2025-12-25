// 커리큘럼 타입 정의 (v3.6)

export type TaskType = 'video' | 'reading' | 'code' | 'quiz' | 'challenge' | 'project'
export type AccessLevel = 'free' | 'core' | 'pro' | 'enterprise'
export type TrackType = 'core' | 'specialization' | 'capstone'

// Quiz 문제 타입
export interface QuizQuestion {
  question: string
  options: string[]
  answer: number  // 0-based index
  explanation?: string
}

// 시뮬레이터 링크 타입
export interface SimulatorLink {
  id: string           // 'knowledge-graph', 'rdf-editor', 'sparql-playground', 'reasoning-engine'
  title: string
  description?: string
  url?: string         // 시뮬레이터 페이지 URL
}

// Task 콘텐츠 타입
export interface TaskContent {
  // 공통
  objectives?: string[]      // 학습 목표
  keyPoints?: string[]       // 핵심 포인트
  simulators?: SimulatorLink[]  // 연결된 시뮬레이터

  // video
  videoUrl?: string          // YouTube/Vimeo URL
  transcript?: string        // 영상 스크립트 (마크다운)

  // reading
  markdown?: string          // 읽기 자료 (마크다운)
  externalLinks?: { title: string; url: string }[]

  // code
  starterCode?: string       // 시작 코드
  solutionCode?: string      // 정답 코드
  instructions?: string      // 실습 지시사항 (마크다운)
  hints?: string[]           // 힌트

  // quiz
  questions?: QuizQuestion[]

  // challenge
  requirements?: string[]    // 요구사항
  evaluationCriteria?: string[]  // 평가 기준
  bonusPoints?: string[]     // 보너스 포인트
}

export interface Task {
  id: string           // slug 기반: 'iterator-concept-video'
  type: TaskType
  title: string
  duration: number     // minutes
  description?: string
  completed?: boolean
  access?: AccessLevel // 기본값: 해당 Week의 access 상속
  content?: TaskContent // 실제 콘텐츠
}

export interface Module {
  slug: string         // 'graph-fundamentals', 'neo4j-setup'
  title: string
  totalDuration: number
  tasks: Task[]
  challenge?: Task
}

// Day는 Module의 별칭 (하위 호환성)
export type Day = Module

export interface Course {
  slug: string         // 'graph-intro', 'cypher-master'
  title: string
  topics: string[]
  practice: string
  totalDuration: number
  modules: Module[]
  access: AccessLevel  // 이 Course에 접근 가능한 최소 레벨
  phase: number        // 속한 Phase (1-6)
}

// Week는 Course의 별칭 (하위 호환성)
export interface Week extends Omit<Course, 'modules'> {
  week: number         // 표시용 번호 (deprecated)
  month: number        // 속한 Month (deprecated)
  days: Module[]       // modules의 별칭 (deprecated)
}

export interface Phase {
  phase: number
  title: string
  description: string
  duration: string     // '2개월', '2.5개월'
  color: string        // 'blue', 'teal', 'purple', ...
  access: AccessLevel  // 이 Phase에 접근 가능한 최소 레벨
  track: TrackType     // 'core' | 'specialization' | 'capstone'
  weeks: string[]      // Week slug 목록
}

export interface Package {
  id: string
  name: string
  price: number        // 월 가격 (원)
  yearlyPrice?: number // 연간 가격 (원)
  access: AccessLevel
  features: string[]
  recommended?: boolean
  phases: number[]     // 접근 가능한 Phase 번호들
}

// Task 유형별 아이콘
export const taskTypeIcons: Record<TaskType, string> = {
  video: '▶️',
  reading: '',
  code: '',
  quiz: '✅',
  challenge: '🏆',
  project: '🚀'
}

// Task 유형별 색상 (배경 없음, 아이콘만)
export const taskTypeColors: Record<TaskType, string> = {
  video: '',
  reading: '',
  code: '',
  quiz: '',
  challenge: '',
  project: ''
}

// Access Level 색상
export const accessColors: Record<AccessLevel, string> = {
  free: 'bg-green-100 text-green-700',
  core: 'bg-blue-100 text-blue-700',
  pro: 'bg-purple-100 text-purple-700',
  enterprise: 'bg-gray-100 text-gray-700'
}

// Access Level 라벨
export const accessLabels: Record<AccessLevel, string> = {
  free: '무료',
  core: 'Core',
  pro: 'Pro',
  enterprise: 'Enterprise'
}
