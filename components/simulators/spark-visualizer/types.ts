// Spark Visualizer 타입 정의

export type TransformationType =
  | 'map'
  | 'filter'
  | 'flatMap'
  | 'reduceByKey'
  | 'groupByKey'
  | 'join'
  | 'union'
  | 'distinct'
  | 'sortByKey'
  | 'repartition'
  | 'coalesce'
  | 'cache'
  | 'persist'

export type ActionType =
  | 'collect'
  | 'count'
  | 'take'
  | 'first'
  | 'reduce'
  | 'saveAsTextFile'
  | 'foreach'

export interface SparkOperation {
  id: string
  name: string
  type: 'transformation' | 'action'
  operation: TransformationType | ActionType
  description: string
  isWide: boolean // Wide vs Narrow transformation
  code: string
}

export interface Partition {
  id: string
  data: string[]
  color: string
}

export interface RDD {
  id: string
  name: string
  partitions: Partition[]
  parentIds: string[]
  operation?: SparkOperation
  cached: boolean
}

export interface Stage {
  id: string
  name: string
  rddIds: string[]
  tasks: Task[]
  shuffleRead: number
  shuffleWrite: number
  status: 'pending' | 'running' | 'completed' | 'failed'
}

export interface Task {
  id: string
  partitionId: string
  executor: string
  duration: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  inputRows: number
  outputRows: number
}

export interface SparkJob {
  id: string
  name: string
  description: string
  code: string
  rdds: RDD[]
  stages: Stage[]
  totalDuration: number
  category: 'basic' | 'aggregation' | 'join' | 'advanced'
}

export interface SparkVisualizerProps {
  showCode?: boolean
  showPartitions?: boolean
  animateExecution?: boolean
}

export interface DAGNode {
  id: string
  type: 'rdd' | 'shuffle' | 'action'
  label: string
  x: number
  y: number
  width: number
  height: number
  color: string
  operation?: string
}

export interface DAGEdge {
  from: string
  to: string
  isShuffleDependency: boolean
}
