// Week 3: 그래프 알고리즘 - 타입 정의
import type { Day } from '../../types'

export type { Day }

// Week 3 메타데이터
export const WEEK3_META = {
  slug: 'graph-algorithms',
  week: 3,
  phase: 3,
  month: 5,
  access: 'core' as const,
  title: '그래프 알고리즘',
  topics: [
    '중심성 알고리즘',
    '커뮤니티 탐지',
    '유사도 알고리즘',
    '경로 탐색',
    '소셜 네트워크 분석 프로젝트'
  ],
  practice: '소셜 네트워크 분석 및 추천 시스템 구현',
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
  hints: string[]
) => ({
  id,
  type: 'code' as const,
  title,
  duration,
  content: { objectives, instructions, starterCode, solutionCode, hints }
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
