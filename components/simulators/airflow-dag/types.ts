// Airflow DAG Simulator 타입 정의

export type TaskState =
  | 'none'        // 아직 실행 안됨
  | 'scheduled'   // 스케줄됨
  | 'queued'      // 큐에 대기
  | 'running'     // 실행 중
  | 'success'     // 성공
  | 'failed'      // 실패
  | 'skipped'     // 건너뜀
  | 'up_for_retry' // 재시도 대기
  | 'upstream_failed' // 상위 태스크 실패

export type OperatorType =
  | 'BashOperator'
  | 'PythonOperator'
  | 'DummyOperator'
  | 'BranchPythonOperator'
  | 'EmailOperator'
  | 'HttpOperator'
  | 'SqlOperator'
  | 'S3ToRedshiftOperator'
  | 'SparkSubmitOperator'

export type TriggerRule =
  | 'all_success'      // 모든 상위 태스크 성공 (기본값)
  | 'all_failed'       // 모든 상위 태스크 실패
  | 'all_done'         // 모든 상위 태스크 완료 (성공/실패 무관)
  | 'one_success'      // 하나라도 성공
  | 'one_failed'       // 하나라도 실패
  | 'none_failed'      // 실패 없음 (성공 또는 스킵)
  | 'none_skipped'     // 스킵 없음

export interface Task {
  id: string
  name: string
  operator: OperatorType
  state: TaskState
  upstreamIds: string[]
  downstreamIds: string[]
  triggerRule: TriggerRule
  retries: number
  retryDelay: number  // seconds
  executionTime?: number  // ms
  startTime?: number
  endTime?: number
  logs?: string[]
  xcomPush?: Record<string, any>
  xcomPull?: string[]
  code?: string
}

export interface DAG {
  id: string
  name: string
  description: string
  schedule: string  // cron expression
  startDate: string
  tasks: Task[]
  defaultArgs: {
    owner: string
    retries: number
    retryDelay: number
  }
  tags: string[]
}

export interface DAGRun {
  id: string
  dagId: string
  executionDate: string
  state: 'queued' | 'running' | 'success' | 'failed'
  startTime?: number
  endTime?: number
  taskStates: Record<string, TaskState>
}

export interface AirflowDAGProps {
  showCode?: boolean
  showLogs?: boolean
  animateExecution?: boolean
}

export interface SampleDAG {
  id: string
  name: string
  description: string
  category: 'etl' | 'ml' | 'data-pipeline' | 'reporting'
  dag: DAG
  pythonCode: string
}
