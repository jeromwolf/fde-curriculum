// Week 2: Cypher 심화 & 데이터 모델링 - 타입 정의
import type { Day } from '../../types'

export type { Day }

// Week 2 메타데이터
export const WEEK2_META = {
  slug: 'cypher-modeling',
  week: 2,
  phase: 3,
  month: 5,
  access: 'core' as const,
  title: 'Cypher 심화 & 데이터 모델링',
  topics: [
    'Cypher 고급 패턴',
    'Object Type 설계',
    '스키마 패턴',
    'APOC 라이브러리',
    '도메인 모델링 프로젝트'
  ],
  practice: '비즈니스 도메인 그래프 스키마 설계 및 APOC 활용',
}

// 공통 유틸리티
export const createVideoTask = (
  id: string,
  title: string,
  duration: number,
  objectives: string[],
  videoUrl: string,
  transcript: string
) => ({
  id,
  type: 'video' as const,
  title,
  duration,
  content: { objectives, videoUrl, transcript }
})

export const createReadingTask = (
  id: string,
  title: string,
  duration: number,
  objectives: string[],
  markdown: string
) => ({
  id,
  type: 'reading' as const,
  title,
  duration,
  content: { objectives, markdown }
})

export const createCodeTask = (
  id: string,
  title: string,
  duration: number,
  objectives: string[],
  instructions: string,
  starterCode: string,
  solutionCode: string,
  hints: string[],
  commonPitfalls?: string
) => ({
  id,
  type: 'code' as const,
  title,
  duration,
  content: { objectives, instructions, starterCode, solutionCode, hints, commonPitfalls }
})

export const createQuizTask = (
  id: string,
  title: string,
  duration: number,
  questions: Array<{
    question: string
    options: string[]
    answer: number
    explanation: string
  }>
) => ({
  id,
  type: 'quiz' as const,
  title,
  duration,
  content: { questions }
})

export const createChallengeTask = (
  id: string,
  title: string,
  duration: number,
  objectives: string[],
  requirements: string[],
  evaluationCriteria: string[],
  bonusPoints: string[]
) => ({
  id,
  type: 'challenge' as const,
  title,
  duration,
  content: { objectives, requirements, evaluationCriteria, bonusPoints }
})

export const createSimulatorTask = (
  id: string,
  title: string,
  duration: number,
  objectives: string[],
  simulatorId: string,
  instructions: string
) => ({
  id,
  type: 'simulator' as const,
  title,
  duration,
  content: { objectives, simulatorId, instructions }
})
