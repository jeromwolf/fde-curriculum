// Week 5: RAG 기초 - 공통 타입 및 헬퍼

import type { Day, Task } from '../../types'

// Week 5 메타데이터
export const WEEK5_META = {
  slug: 'rag-basics',
  week: 5,
  phase: 3,
  month: 6,
  access: 'core' as const,
  title: 'RAG 기초',
  topics: ['RAG 아키텍처', '임베딩', '벡터 DB', 'Chroma', 'Pinecone', '청킹 전략', 'LangChain'],
  practice: '문서 Q&A RAG 시스템 구축',
}

// Day 타입 재export
export type { Day }

// Week 5 퀴즈 질문 타입
interface Week5QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

// Week 5 확장 콘텐츠 타입
interface Week5TaskContent {
  introduction?: string
  keyPoints?: string[]
  practiceGoal?: string
  codeExample?: string
  questions?: Week5QuizQuestion[]
  hints?: string[]
  videoUrl?: string
}

// Task 생성 헬퍼 함수들
export function createVideoTask(
  id: string,
  title: string,
  duration: number,
  content: Week5TaskContent
): Task {
  return {
    id,
    type: 'video',
    title,
    duration,
    content: {
      videoUrl: content.videoUrl,
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
  content: Week5TaskContent
): Task {
  return {
    id,
    type: 'reading',
    title,
    duration,
    content: {
      videoUrl: content.videoUrl,
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
  content: Week5TaskContent
): Task {
  return {
    id,
    type: 'code',
    title,
    duration,
    content: {
      videoUrl: content.videoUrl,
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
  content: Week5TaskContent
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
  content: Week5TaskContent
): Task {
  return {
    id,
    type: 'challenge',
    title,
    duration,
    content: {
      instructions: content.introduction,
      keyPoints: content.keyPoints,
      objectives: content.practiceGoal ? [content.practiceGoal] : [],
      hints: content.hints,
    },
  }
}
