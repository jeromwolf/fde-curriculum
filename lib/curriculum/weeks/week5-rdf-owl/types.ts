// Week 5: RDF/OWL & 시맨틱 웹 - 공통 타입 및 헬퍼

import type { Day, Task } from '../../types'

// Week 5 메타데이터
export const WEEK5_META = {
  slug: 'rdf-owl',
  week: 5,
  phase: 3,
  month: 5,
  access: 'core' as const,
  title: 'RDF/OWL & 시맨틱 웹',
  topics: ['RDF 트리플', 'SPARQL', 'OWL 온톨로지', 'Property Graph vs RDF', 'Wikidata', '시맨틱 웹'],
  practice: 'Wikidata SPARQL 실습 및 비교 분석',
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
  introduction?: string           // 소개 및 개요 (마크다운)
  keyPoints?: string[]            // 핵심 포인트
  practiceGoal?: string           // 실습 목표
  codeExample?: string            // 코드 예시
  questions?: Week5QuizQuestion[] // 퀴즈 질문
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
  content: Week5TaskContent
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
  content: Week5TaskContent
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

// RDF 관련 상수
export const RDF_FORMATS = [
  'Turtle (.ttl)',      // 가장 읽기 쉬운 형식
  'RDF/XML (.rdf)',     // 원래 표준 형식
  'JSON-LD (.jsonld)',  // JSON 기반 (웹 친화적)
  'N-Triples (.nt)',    // 한 줄 한 트리플
  'N-Quads (.nq)',      // Named Graph 포함
]

// OWL 클래스 타입
export const OWL_CONSTRUCTS = {
  classes: ['owl:Class', 'rdfs:subClassOf', 'owl:equivalentClass'],
  properties: ['owl:ObjectProperty', 'owl:DatatypeProperty', 'owl:AnnotationProperty'],
  restrictions: ['owl:Restriction', 'owl:someValuesFrom', 'owl:allValuesFrom'],
  characteristics: ['owl:FunctionalProperty', 'owl:InverseFunctionalProperty', 'owl:TransitiveProperty', 'owl:SymmetricProperty'],
}
