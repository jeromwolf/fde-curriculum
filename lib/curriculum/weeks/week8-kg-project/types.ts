// Week 8: 도메인 KG 프로젝트 - 공통 타입 및 헬퍼

import type { Day, Task } from '../../types'

// Week 8 메타데이터
export const WEEK8_META = {
  slug: 'kg-project',
  week: 8,
  phase: 3,
  month: 7,
  access: 'pro' as const,
  title: '도메인 Knowledge Graph 프로젝트',
  topics: ['도메인 KG 설계', '데이터 수집/정제', 'KG 구축', 'GraphRAG 통합', '프로덕션 배포'],
  practice: 'Phase 3 캡스톤 프로젝트 - 실제 도메인 KG 시스템 구축',
}

// Day 타입 재export
export type { Day }

// Week 8 퀴즈 질문 타입
interface Week8QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

// Week 8 확장 콘텐츠 타입
interface Week8TaskContent {
  introduction?: string
  keyPoints?: string[]
  practiceGoal?: string
  codeExample?: string
  commonPitfalls?: string
  questions?: Week8QuizQuestion[]
}

// Task 생성 헬퍼 함수들
export function createVideoTask(
  id: string,
  title: string,
  duration: number,
  content: Week8TaskContent
): Task {
  return {
    id,
    type: 'video',
    title,
    duration,
    content: {
      transcript: content.introduction,
      keyPoints: content.keyPoints,
      objectives: content.practiceGoal ? [content.practiceGoal] : [],
    },
  }
}

export function createReadingTask(
  id: string,
  title: string,
  duration: number,
  content: Week8TaskContent
): Task {
  return {
    id,
    type: 'reading',
    title,
    duration,
    content: {
      markdown: content.introduction,
      keyPoints: content.keyPoints,
      objectives: content.practiceGoal ? [content.practiceGoal] : [],
    },
  }
}

export function createCodeTask(
  id: string,
  title: string,
  duration: number,
  content: Week8TaskContent
): Task {
  return {
    id,
    type: 'code',
    title,
    duration,
    content: {
      instructions: content.introduction,
      starterCode: content.codeExample,
      keyPoints: content.keyPoints,
      commonPitfalls: content.commonPitfalls,
      objectives: content.practiceGoal ? [content.practiceGoal] : [],
    },
  }
}

export function createQuizTask(
  id: string,
  title: string,
  duration: number,
  content: Week8TaskContent
): Task {
  const mappedQuestions = content.questions?.map(q => ({
    question: q.question,
    options: q.options,
    answer: q.correctAnswer,
    explanation: q.explanation,
  }))

  return {
    id,
    type: 'quiz',
    title,
    duration,
    content: {
      questions: mappedQuestions,
      keyPoints: content.keyPoints,
      objectives: content.practiceGoal ? [content.practiceGoal] : [],
    },
  }
}

export function createChallengeTask(
  id: string,
  title: string,
  duration: number,
  content: Week8TaskContent
): Task {
  return {
    id,
    type: 'challenge',
    title,
    duration,
    content: {
      requirements: content.introduction ? [content.introduction] : [],
      keyPoints: content.keyPoints,
      objectives: content.practiceGoal ? [content.practiceGoal] : [],
    },
  }
}
