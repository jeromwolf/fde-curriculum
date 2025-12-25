/**
 * Cypher Playground 모듈
 *
 * 다른 앱에서 사용하려면:
 *
 * ```tsx
 * import { CypherPlayground } from '@/components/cypher-playground'
 *
 * // 또는 개별 컴포넌트 import
 * import {
 *   CypherEditor,
 *   ResultsView,
 *   GraphVisualization,
 *   useCypherQuery,
 *   usePropertyGraph,
 *   executeCypher,
 *   createSampleGraph
 * } from '@/components/cypher-playground'
 * ```
 */

// 메인 컴포넌트
export { CypherPlayground } from './CypherPlayground'

// UI 컴포넌트
export { CypherEditor } from './components/CypherEditor'
export { ResultsView } from './components/ResultsView'
export { GraphVisualization } from './components/GraphVisualization'

// Hooks
export { useCypherQuery } from './hooks/useCypherQuery'
export type { UseCypherQueryOptions, UseCypherQueryReturn, QueryHistoryItem } from './hooks/useCypherQuery'

export { usePropertyGraph } from './hooks/usePropertyGraph'
export type { UsePropertyGraphReturn } from './hooks/usePropertyGraph'

// Core library (프레임워크 독립적)
export {
  tokenize,
  parsePattern,
  executeCypher,
  formatCypherResult,
  validateCypher
} from './lib/cypherParser'
export type { ExecuteOptions } from './lib/cypherParser'

// 샘플 데이터
export {
  sampleNodes,
  sampleRelationships,
  exampleQueries,
  createSampleGraph,
  createEmptyGraph,
  cloneGraph
} from './lib/sampleData'

// 타입
export type {
  Node,
  Relationship,
  PropertyGraph,
  QueryResult,
  CypherError,
  ExampleQuery,
  NodeLabel
} from './types'

export { LABEL_COLORS, RELATIONSHIP_COLORS } from './types'
