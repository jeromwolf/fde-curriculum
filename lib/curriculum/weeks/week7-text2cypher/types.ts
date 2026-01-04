// Week 7: 자연어 → Cypher - 공통 타입 및 헬퍼

import type { Day, Task } from '../../types'

// Week 7 메타데이터
export const WEEK7_META = {
  slug: 'text2cypher',
  week: 7,
  phase: 3,
  month: 6,
  access: 'core' as const,
  title: '자연어 → Cypher',
  topics: ['LLM Cypher 생성', '스키마 프롬프팅', '쿼리 검증', 'Few-shot Learning', '에러 처리'],
  practice: '자연어 질의 그래프 데이터베이스 인터페이스 구축',
}

// Day 타입 재export
export type { Day }

// Week 7 퀴즈 질문 타입
interface Week7QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

// Week 7 확장 콘텐츠 타입
interface Week7TaskContent {
  introduction?: string
  keyPoints?: string[]
  practiceGoal?: string
  codeExample?: string
  commonPitfalls?: string
  questions?: Week7QuizQuestion[]
}

// Task 생성 헬퍼 함수들
export function createVideoTask(id: string, title: string, duration: number, content: Week7TaskContent): Task {
  return {
    id, type: 'video', title, duration,
    content: {
      transcript: content.introduction,
      keyPoints: content.keyPoints,
      objectives: content.practiceGoal ? [content.practiceGoal] : [],
    },
  }
}

export function createReadingTask(id: string, title: string, duration: number, content: Week7TaskContent): Task {
  return {
    id, type: 'reading', title, duration,
    content: {
      markdown: content.introduction,
      keyPoints: content.keyPoints,
      objectives: content.practiceGoal ? [content.practiceGoal] : [],
    },
  }
}

export function createCodeTask(id: string, title: string, duration: number, content: Week7TaskContent): Task {
  return {
    id, type: 'code', title, duration,
    content: {
      instructions: content.introduction,
      starterCode: content.codeExample,
      keyPoints: content.keyPoints,
      commonPitfalls: content.commonPitfalls,
      objectives: content.practiceGoal ? [content.practiceGoal] : [],
    },
  }
}

export function createQuizTask(id: string, title: string, duration: number, content: Week7TaskContent): Task {
  const mappedQuestions = content.questions?.map(q => ({
    question: q.question, options: q.options, answer: q.correctAnswer, explanation: q.explanation,
  }))
  return {
    id, type: 'quiz', title, duration,
    content: {
      questions: mappedQuestions,
      keyPoints: content.keyPoints,
      objectives: content.practiceGoal ? [content.practiceGoal] : [],
    },
  }
}

export function createChallengeTask(id: string, title: string, duration: number, content: Week7TaskContent): Task {
  return {
    id, type: 'challenge', title, duration,
    content: {
      requirements: content.introduction ? [content.introduction] : [],
      keyPoints: content.keyPoints,
      objectives: content.practiceGoal ? [content.practiceGoal] : [],
    },
  }
}
