// Week 4: Entity Resolution & Python - 공통 타입 및 헬퍼

import type { Day, Task, TaskContent } from '../../types'

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

// Task 생성 헬퍼 함수들
export function createVideoTask(
  id: string,
  title: string,
  duration: number,
  content: TaskContent
): Task {
  return {
    id,
    type: 'video',
    title,
    duration,
    content,
  }
}

export function createReadingTask(
  id: string,
  title: string,
  duration: number,
  content: TaskContent
): Task {
  return {
    id,
    type: 'reading',
    title,
    duration,
    content,
  }
}

export function createCodeTask(
  id: string,
  title: string,
  duration: number,
  content: TaskContent
): Task {
  return {
    id,
    type: 'code',
    title,
    duration,
    content,
  }
}

export function createQuizTask(
  id: string,
  title: string,
  duration: number,
  content: TaskContent
): Task {
  return {
    id,
    type: 'quiz',
    title,
    duration,
    content,
  }
}

export function createChallengeTask(
  id: string,
  title: string,
  duration: number,
  content: TaskContent
): Task {
  return {
    id,
    type: 'challenge',
    title,
    duration,
    content,
  }
}

export function createSimulatorTask(
  id: string,
  title: string,
  duration: number,
  content: TaskContent
): Task {
  return {
    id,
    type: 'simulator',
    title,
    duration,
    content,
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
