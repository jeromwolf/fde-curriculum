// Week 3: 그래프 알고리즘 - 통합 모듈
import type { Week } from '../../types'
import { WEEK3_META } from './types'
import { day1Centrality } from './day1-centrality'
import { day2Community } from './day2-community'
import { day3Similarity } from './day3-similarity'
import { day4Pathfinding } from './day4-pathfinding'
import { day5WeeklyProject } from './day5-weekly-project'

// Week 3 완성: 그래프 알고리즘
export const week3GraphAlgorithms: Week = {
  slug: WEEK3_META.slug,
  week: WEEK3_META.week,
  phase: WEEK3_META.phase,
  month: WEEK3_META.month,
  access: WEEK3_META.access,
  title: WEEK3_META.title,
  topics: WEEK3_META.topics,
  practice: WEEK3_META.practice,
  totalDuration: 1320, // 22시간 = 1320분
  days: [
    day1Centrality,     // Day 1: 중심성 알고리즘 (~1,400줄)
    day2Community,      // Day 2: 커뮤니티 탐지 (~1,200줄)
    day3Similarity,     // Day 3: 유사도 알고리즘 (~1,100줄)
    day4Pathfinding,    // Day 4: 경로 탐색 (~1,200줄)
    day5WeeklyProject   // Day 5: 주간 프로젝트 (~1,300줄)
  ]
}

// Week 메타데이터 재내보내기
export { WEEK3_META }

// 개별 Day 모듈 재내보내기
export {
  day1Centrality,
  day2Community,
  day3Similarity,
  day4Pathfinding,
  day5WeeklyProject
}

// 타입 재내보내기
export type { Day } from './types'
export {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
  createSimulatorTask
} from './types'

// ============================================
// Week 3 통계
// ============================================
//
// 총 라인 수: ~6,200줄
// 총 Task 수: 53개
// 총 학습 시간: ~22시간
//
// Day 1: 중심성 알고리즘 (Centrality)
//   - Tasks: 12개
//   - 시간: 240분 (4시간)
//   - 주요: Degree, PageRank, Betweenness, Closeness
//
// Day 2: 커뮤니티 탐지 (Community Detection)
//   - Tasks: 11개
//   - 시간: 240분 (4시간)
//   - 주요: Louvain, Label Propagation, WCC/SCC, Triangle Count
//
// Day 3: 유사도 알고리즘 (Similarity)
//   - Tasks: 12개
//   - 시간: 240분 (4시간)
//   - 주요: Jaccard, Cosine, Node Similarity, KNN
//
// Day 4: 경로 탐색 (Path Finding)
//   - Tasks: 11개
//   - 시간: 240분 (4시간)
//   - 주요: BFS, Dijkstra, Delta-Stepping, MST, Random Walk
//
// Day 5: 주간 프로젝트
//   - Tasks: 10개
//   - 시간: 360분 (6시간)
//   - 주요: 소셜 네트워크 분석 플랫폼 구축
//     - 인플루언서 분석
//     - 커뮤니티 분석
//     - 추천 시스템
//     - 연결 분석
//     - 대시보드
//
// ============================================
// 학습 목표 달성 체크리스트
// ============================================
//
// ✅ 중심성 알고리즘의 이해와 활용
//    - Degree, PageRank, Betweenness, Closeness 개념
//    - GDS에서 중심성 알고리즘 실행
//    - 인플루언서 탐지 실제 적용
//
// ✅ 커뮤니티 탐지 알고리즘
//    - Modularity 개념 이해
//    - Louvain, Label Propagation 실행
//    - 커뮤니티 특성 분석
//
// ✅ 유사도 알고리즘
//    - Jaccard, Cosine, KNN 개념
//    - 추천 시스템에 유사도 적용
//    - 하이브리드 추천 구현
//
// ✅ 경로 탐색 알고리즘
//    - BFS, Dijkstra, Delta-Stepping 이해
//    - 최단 경로 문제 해결
//    - MST, Random Walk 활용
//
// ✅ 종합 프로젝트
//    - 전체 알고리즘 통합 적용
//    - 실제 비즈니스 문제 해결
//    - 분석 리포트 작성
//
// ============================================
