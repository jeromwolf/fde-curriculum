// Week 4: Entity Resolution & Python - 공통 타입 및 헬퍼

import type { Day, Task } from '../../types'

// Week 4 메타데이터
export const WEEK4_META = {
  slug: 'entity-resolution',
  week: 4,
  phase: 3,
  month: 5,
  access: 'core' as const,
  title: 'Entity Resolution & Python',
  topics: ['Entity Resolution', 'Neo4j Python Driver', 'py2neo', 'NetworkX', 'PyVis 시각화', '다중 소스 KG'],
  practice: '기업 Knowledge Graph 구축 및 시각화',
}

// Day 타입 재export
export type { Day }

// Week 4 퀴즈 질문 타입
interface Week4QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

// Week 4 확장 콘텐츠 타입
interface Week4TaskContent {
  introduction?: string           // 소개 및 개요 (마크다운)
  keyPoints?: string[]            // 핵심 포인트
  practiceGoal?: string           // 실습 목표
  codeExample?: string            // 코드 예시
  questions?: Week4QuizQuestion[] // 퀴즈 질문
}

// Task 생성 헬퍼 함수들
export function createVideoTask(
  id: string,
  title: string,
  duration: number,
  content: Week4TaskContent
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
  content: Week4TaskContent
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
  content: Week4TaskContent
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
  content: Week4TaskContent
): Task {
  // correctAnswer를 answer로 변환
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
  content: Week4TaskContent
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

export function createSimulatorTask(
  id: string,
  title: string,
  duration: number,
  content: Week4TaskContent
): Task {
  return {
    id,
    type: 'simulator',
    title,
    duration,
    content: {
      instructions: content.introduction,
      keyPoints: content.keyPoints,
      objectives: content.practiceGoal ? [content.practiceGoal] : [],
    },
  }
}

// Entity Resolution 관련 상수
export const ER_SIMILARITY_METRICS = [
  'Jaro-Winkler',      // 문자열 유사도 (이름 매칭에 적합)
  'Levenshtein',       // 편집 거리
  'Jaccard',           // 집합 유사도 (토큰 기반)
  'Cosine',            // 벡터 유사도
  'TF-IDF',            // 텍스트 기반 유사도
]

// Python 시각화 라이브러리
export const VISUALIZATION_LIBRARIES = {
  networkx: 'NetworkX - 그래프 분석 및 시각화 기초',
  pyvis: 'PyVis - 인터랙티브 HTML 그래프',
  plotly: 'Plotly - 인터랙티브 차트/그래프',
  matplotlib: 'Matplotlib - 정적 시각화',
  neovis: 'neovis.js - Neo4j 네이티브 시각화',
}
