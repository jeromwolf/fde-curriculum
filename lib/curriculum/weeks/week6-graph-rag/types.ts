// Week 6: GraphRAG - 공통 타입 및 헬퍼

import type { Day, Task } from '../../types'

// Week 6 메타데이터
export const WEEK6_META = {
  slug: 'graph-rag',
  week: 6,
  phase: 3,
  month: 6,
  access: 'core' as const,
  title: 'GraphRAG',
  topics: ['Knowledge Graph + RAG', '하이브리드 검색', '그래프 컨텍스트', 'Microsoft GraphRAG', 'LangChain Neo4j'],
  practice: 'Knowledge Graph 기반 Q&A 시스템 구축',
}

// Day 타입 재export
export type { Day }

// Week 6 퀴즈 질문 타입
interface Week6QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

// Week 6 확장 콘텐츠 타입
interface Week6TaskContent {
  introduction?: string
  keyPoints?: string[]
  practiceGoal?: string
  codeExample?: string
  questions?: Week6QuizQuestion[]
}

// Task 생성 헬퍼 함수들
export function createVideoTask(
  id: string,
  title: string,
  duration: number,
  content: Week6TaskContent
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
  content: Week6TaskContent
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
  content: Week6TaskContent
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
      objectives: content.practiceGoal ? [content.practiceGoal] : [],
    },
  }
}

export function createQuizTask(
  id: string,
  title: string,
  duration: number,
  content: Week6TaskContent
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
  content: Week6TaskContent
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
