// Airflow 샘플 DAG 데이터

import { SampleDAG, DAG, Task, TaskState, OperatorType } from './types'

// Operator 설명
export const operatorDescriptions: Record<OperatorType, { name: string; description: string; color: string }> = {
  BashOperator: {
    name: 'Bash',
    description: '쉘 명령어 실행',
    color: 'bg-gray-600',
  },
  PythonOperator: {
    name: 'Python',
    description: 'Python 함수 실행',
    color: 'bg-blue-600',
  },
  DummyOperator: {
    name: 'Dummy',
    description: '아무 작업도 하지 않음 (브랜치용)',
    color: 'bg-gray-400',
  },
  BranchPythonOperator: {
    name: 'Branch',
    description: '조건에 따라 다른 태스크로 분기',
    color: 'bg-purple-600',
  },
  EmailOperator: {
    name: 'Email',
    description: '이메일 발송',
    color: 'bg-green-600',
  },
  HttpOperator: {
    name: 'HTTP',
    description: 'HTTP 요청 실행',
    color: 'bg-orange-600',
  },
  SqlOperator: {
    name: 'SQL',
    description: 'SQL 쿼리 실행',
    color: 'bg-cyan-600',
  },
  S3ToRedshiftOperator: {
    name: 'S3→Redshift',
    description: 'S3에서 Redshift로 데이터 로드',
    color: 'bg-red-600',
  },
  SparkSubmitOperator: {
    name: 'Spark',
    description: 'Spark 작업 제출',
    color: 'bg-yellow-600',
  },
}

// Task 상태 색상
export const taskStateColors: Record<TaskState, { bg: string; text: string; label: string }> = {
  none: { bg: 'bg-gray-200', text: 'text-gray-600', label: '대기' },
  scheduled: { bg: 'bg-gray-300', text: 'text-gray-700', label: '스케줄됨' },
  queued: { bg: 'bg-yellow-200', text: 'text-yellow-700', label: '큐 대기' },
  running: { bg: 'bg-blue-400', text: 'text-white', label: '실행 중' },
  success: { bg: 'bg-green-500', text: 'text-white', label: '성공' },
  failed: { bg: 'bg-red-500', text: 'text-white', label: '실패' },
  skipped: { bg: 'bg-pink-300', text: 'text-pink-800', label: '건너뜀' },
  up_for_retry: { bg: 'bg-orange-400', text: 'text-white', label: '재시도 대기' },
  upstream_failed: { bg: 'bg-orange-600', text: 'text-white', label: '상위 실패' },
}

// 스케줄 프리셋
export const schedulePresets = {
  '@once': '한 번만',
  '@hourly': '매시간 (0 * * * *)',
  '@daily': '매일 (0 0 * * *)',
  '@weekly': '매주 (0 0 * * 0)',
  '@monthly': '매월 (0 0 1 * *)',
  '@yearly': '매년 (0 0 1 1 *)',
  'None': '수동 실행만',
}

// 1. 기본 ETL DAG
const basicETLDAG: SampleDAG = {
  id: 'basic-etl',
  name: 'Basic ETL Pipeline',
  description: '간단한 Extract → Transform → Load 파이프라인',
  category: 'etl',
  dag: {
    id: 'basic_etl_dag',
    name: 'basic_etl_dag',
    description: '데이터 추출, 변환, 적재의 기본 ETL 플로우',
    schedule: '@daily',
    startDate: '2024-01-01',
    defaultArgs: {
      owner: 'data_team',
      retries: 2,
      retryDelay: 300,
    },
    tags: ['etl', 'daily'],
    tasks: [
      {
        id: 'extract',
        name: 'extract_data',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: [],
        downstreamIds: ['transform'],
        triggerRule: 'all_success',
        retries: 2,
        retryDelay: 300,
        code: 'def extract():\n    # API에서 데이터 추출\n    data = fetch_from_api()\n    return data',
      },
      {
        id: 'transform',
        name: 'transform_data',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: ['extract'],
        downstreamIds: ['load'],
        triggerRule: 'all_success',
        retries: 2,
        retryDelay: 300,
        code: 'def transform(ti):\n    data = ti.xcom_pull(task_ids="extract")\n    # 데이터 정제 및 변환\n    return cleaned_data',
      },
      {
        id: 'load',
        name: 'load_to_warehouse',
        operator: 'SqlOperator',
        state: 'none',
        upstreamIds: ['transform'],
        downstreamIds: ['notify'],
        triggerRule: 'all_success',
        retries: 2,
        retryDelay: 300,
        code: 'INSERT INTO warehouse.fact_table\nSELECT * FROM staging.temp_table',
      },
      {
        id: 'notify',
        name: 'send_notification',
        operator: 'EmailOperator',
        state: 'none',
        upstreamIds: ['load'],
        downstreamIds: [],
        triggerRule: 'all_done',
        retries: 1,
        retryDelay: 60,
        code: 'to: data_team@company.com\nsubject: ETL 완료 알림',
      },
    ],
  },
  pythonCode: `from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.sql import SqlOperator
from airflow.operators.email import EmailOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'data_team',
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'basic_etl_dag',
    default_args=default_args,
    description='기본 ETL 파이프라인',
    schedule_interval='@daily',
    start_date=datetime(2024, 1, 1),
    tags=['etl', 'daily'],
) as dag:

    extract = PythonOperator(
        task_id='extract_data',
        python_callable=extract_from_source,
    )

    transform = PythonOperator(
        task_id='transform_data',
        python_callable=transform_data,
    )

    load = SqlOperator(
        task_id='load_to_warehouse',
        sql='INSERT INTO warehouse.fact_table ...',
    )

    notify = EmailOperator(
        task_id='send_notification',
        to='data_team@company.com',
        trigger_rule='all_done',
    )

    extract >> transform >> load >> notify`,
}

// 2. 분기 DAG
const branchingDAG: SampleDAG = {
  id: 'branching',
  name: 'Branching DAG',
  description: '조건에 따라 다른 경로로 분기하는 DAG',
  category: 'data-pipeline',
  dag: {
    id: 'branching_dag',
    name: 'branching_dag',
    description: '데이터 품질에 따라 다른 처리 경로 선택',
    schedule: '@hourly',
    startDate: '2024-01-01',
    defaultArgs: {
      owner: 'data_team',
      retries: 1,
      retryDelay: 60,
    },
    tags: ['branching', 'data-quality'],
    tasks: [
      {
        id: 'fetch_data',
        name: 'fetch_data',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: [],
        downstreamIds: ['check_quality'],
        triggerRule: 'all_success',
        retries: 2,
        retryDelay: 60,
      },
      {
        id: 'check_quality',
        name: 'check_data_quality',
        operator: 'BranchPythonOperator',
        state: 'none',
        upstreamIds: ['fetch_data'],
        downstreamIds: ['high_quality_path', 'low_quality_path'],
        triggerRule: 'all_success',
        retries: 1,
        retryDelay: 60,
        code: 'def check_quality():\n    if quality_score > 0.9:\n        return "high_quality_path"\n    else:\n        return "low_quality_path"',
      },
      {
        id: 'high_quality_path',
        name: 'process_high_quality',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: ['check_quality'],
        downstreamIds: ['merge_results'],
        triggerRule: 'all_success',
        retries: 1,
        retryDelay: 60,
      },
      {
        id: 'low_quality_path',
        name: 'process_low_quality',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: ['check_quality'],
        downstreamIds: ['merge_results'],
        triggerRule: 'all_success',
        retries: 1,
        retryDelay: 60,
      },
      {
        id: 'merge_results',
        name: 'merge_results',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: ['high_quality_path', 'low_quality_path'],
        downstreamIds: [],
        triggerRule: 'none_failed',  // 하나만 실행되어도 OK
        retries: 1,
        retryDelay: 60,
      },
    ],
  },
  pythonCode: `from airflow import DAG
from airflow.operators.python import PythonOperator, BranchPythonOperator
from datetime import datetime

def check_data_quality(**context):
    # 데이터 품질 점수 계산
    quality_score = calculate_quality()
    if quality_score > 0.9:
        return 'process_high_quality'
    else:
        return 'process_low_quality'

with DAG(
    'branching_dag',
    schedule_interval='@hourly',
    start_date=datetime(2024, 1, 1),
) as dag:

    fetch = PythonOperator(
        task_id='fetch_data',
        python_callable=fetch_data,
    )

    branch = BranchPythonOperator(
        task_id='check_data_quality',
        python_callable=check_data_quality,
    )

    high_quality = PythonOperator(
        task_id='process_high_quality',
        python_callable=process_high,
    )

    low_quality = PythonOperator(
        task_id='process_low_quality',
        python_callable=process_low,
    )

    merge = PythonOperator(
        task_id='merge_results',
        python_callable=merge_data,
        trigger_rule='none_failed',  # 분기된 태스크 중 실행된 것만 대기
    )

    fetch >> branch >> [high_quality, low_quality] >> merge`,
}

// 3. 병렬 처리 DAG
const parallelDAG: SampleDAG = {
  id: 'parallel',
  name: 'Parallel Processing DAG',
  description: '여러 데이터 소스를 병렬로 처리하는 DAG',
  category: 'data-pipeline',
  dag: {
    id: 'parallel_dag',
    name: 'parallel_dag',
    description: '다중 소스 병렬 수집 및 통합',
    schedule: '@daily',
    startDate: '2024-01-01',
    defaultArgs: {
      owner: 'data_team',
      retries: 2,
      retryDelay: 300,
    },
    tags: ['parallel', 'multi-source'],
    tasks: [
      {
        id: 'start',
        name: 'start',
        operator: 'DummyOperator',
        state: 'none',
        upstreamIds: [],
        downstreamIds: ['source_a', 'source_b', 'source_c'],
        triggerRule: 'all_success',
        retries: 0,
        retryDelay: 0,
      },
      {
        id: 'source_a',
        name: 'extract_source_a',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: ['start'],
        downstreamIds: ['combine'],
        triggerRule: 'all_success',
        retries: 2,
        retryDelay: 300,
        code: '# MySQL에서 데이터 추출\ndata_a = extract_from_mysql()',
      },
      {
        id: 'source_b',
        name: 'extract_source_b',
        operator: 'HttpOperator',
        state: 'none',
        upstreamIds: ['start'],
        downstreamIds: ['combine'],
        triggerRule: 'all_success',
        retries: 3,
        retryDelay: 60,
        code: '# REST API 호출\nGET https://api.example.com/data',
      },
      {
        id: 'source_c',
        name: 'extract_source_c',
        operator: 'BashOperator',
        state: 'none',
        upstreamIds: ['start'],
        downstreamIds: ['combine'],
        triggerRule: 'all_success',
        retries: 2,
        retryDelay: 300,
        code: 'aws s3 cp s3://bucket/data.csv /tmp/',
      },
      {
        id: 'combine',
        name: 'combine_sources',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: ['source_a', 'source_b', 'source_c'],
        downstreamIds: ['validate'],
        triggerRule: 'all_success',
        retries: 1,
        retryDelay: 60,
      },
      {
        id: 'validate',
        name: 'validate_data',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: ['combine'],
        downstreamIds: ['load_final'],
        triggerRule: 'all_success',
        retries: 1,
        retryDelay: 60,
      },
      {
        id: 'load_final',
        name: 'load_to_dw',
        operator: 'S3ToRedshiftOperator',
        state: 'none',
        upstreamIds: ['validate'],
        downstreamIds: [],
        triggerRule: 'all_success',
        retries: 2,
        retryDelay: 300,
      },
    ],
  },
  pythonCode: `from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.operators.dummy import DummyOperator
from airflow.providers.http.operators.http import SimpleHttpOperator
from airflow.providers.amazon.aws.transfers.s3_to_redshift import S3ToRedshiftOperator
from datetime import datetime

with DAG(
    'parallel_dag',
    schedule_interval='@daily',
    start_date=datetime(2024, 1, 1),
) as dag:

    start = DummyOperator(task_id='start')

    # 병렬 추출 태스크들
    source_a = PythonOperator(
        task_id='extract_source_a',
        python_callable=extract_mysql,
    )

    source_b = SimpleHttpOperator(
        task_id='extract_source_b',
        endpoint='/data',
        method='GET',
    )

    source_c = BashOperator(
        task_id='extract_source_c',
        bash_command='aws s3 cp s3://bucket/data.csv /tmp/',
    )

    combine = PythonOperator(
        task_id='combine_sources',
        python_callable=combine_data,
    )

    validate = PythonOperator(
        task_id='validate_data',
        python_callable=validate,
    )

    load = S3ToRedshiftOperator(
        task_id='load_to_dw',
        s3_bucket='my-bucket',
        s3_key='data/',
        schema='public',
        table='combined_data',
    )

    start >> [source_a, source_b, source_c] >> combine >> validate >> load`,
}

// 4. ML 파이프라인 DAG
const mlPipelineDAG: SampleDAG = {
  id: 'ml-pipeline',
  name: 'ML Training Pipeline',
  description: '머신러닝 모델 학습 파이프라인',
  category: 'ml',
  dag: {
    id: 'ml_pipeline_dag',
    name: 'ml_pipeline_dag',
    description: '데이터 준비부터 모델 배포까지',
    schedule: '@weekly',
    startDate: '2024-01-01',
    defaultArgs: {
      owner: 'ml_team',
      retries: 1,
      retryDelay: 600,
    },
    tags: ['ml', 'training', 'weekly'],
    tasks: [
      {
        id: 'prepare_data',
        name: 'prepare_training_data',
        operator: 'SparkSubmitOperator',
        state: 'none',
        upstreamIds: [],
        downstreamIds: ['split_data'],
        triggerRule: 'all_success',
        retries: 2,
        retryDelay: 600,
      },
      {
        id: 'split_data',
        name: 'split_train_test',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: ['prepare_data'],
        downstreamIds: ['train_model', 'prepare_test'],
        triggerRule: 'all_success',
        retries: 1,
        retryDelay: 60,
      },
      {
        id: 'train_model',
        name: 'train_model',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: ['split_data'],
        downstreamIds: ['evaluate'],
        triggerRule: 'all_success',
        retries: 2,
        retryDelay: 300,
        code: '# 모델 학습\nmodel = train_xgboost(X_train, y_train)',
      },
      {
        id: 'prepare_test',
        name: 'prepare_test_data',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: ['split_data'],
        downstreamIds: ['evaluate'],
        triggerRule: 'all_success',
        retries: 1,
        retryDelay: 60,
      },
      {
        id: 'evaluate',
        name: 'evaluate_model',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: ['train_model', 'prepare_test'],
        downstreamIds: ['check_metrics'],
        triggerRule: 'all_success',
        retries: 1,
        retryDelay: 60,
      },
      {
        id: 'check_metrics',
        name: 'check_metrics',
        operator: 'BranchPythonOperator',
        state: 'none',
        upstreamIds: ['evaluate'],
        downstreamIds: ['deploy', 'notify_failure'],
        triggerRule: 'all_success',
        retries: 1,
        retryDelay: 60,
        code: 'def check():\n    if accuracy > 0.95:\n        return "deploy"\n    return "notify_failure"',
      },
      {
        id: 'deploy',
        name: 'deploy_model',
        operator: 'PythonOperator',
        state: 'none',
        upstreamIds: ['check_metrics'],
        downstreamIds: [],
        triggerRule: 'all_success',
        retries: 2,
        retryDelay: 300,
      },
      {
        id: 'notify_failure',
        name: 'notify_low_accuracy',
        operator: 'EmailOperator',
        state: 'none',
        upstreamIds: ['check_metrics'],
        downstreamIds: [],
        triggerRule: 'all_success',
        retries: 1,
        retryDelay: 60,
      },
    ],
  },
  pythonCode: `from airflow import DAG
from airflow.operators.python import PythonOperator, BranchPythonOperator
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator
from airflow.operators.email import EmailOperator
from datetime import datetime

def check_model_metrics(**context):
    metrics = context['ti'].xcom_pull(task_ids='evaluate_model')
    if metrics['accuracy'] > 0.95:
        return 'deploy_model'
    return 'notify_low_accuracy'

with DAG(
    'ml_pipeline_dag',
    schedule_interval='@weekly',
    start_date=datetime(2024, 1, 1),
    tags=['ml', 'training'],
) as dag:

    prepare = SparkSubmitOperator(
        task_id='prepare_training_data',
        application='/spark/prepare_data.py',
    )

    split = PythonOperator(
        task_id='split_train_test',
        python_callable=split_data,
    )

    train = PythonOperator(
        task_id='train_model',
        python_callable=train_model,
    )

    prep_test = PythonOperator(
        task_id='prepare_test_data',
        python_callable=prepare_test,
    )

    evaluate = PythonOperator(
        task_id='evaluate_model',
        python_callable=evaluate_model,
    )

    check = BranchPythonOperator(
        task_id='check_metrics',
        python_callable=check_model_metrics,
    )

    deploy = PythonOperator(
        task_id='deploy_model',
        python_callable=deploy_to_production,
    )

    notify = EmailOperator(
        task_id='notify_low_accuracy',
        to='ml_team@company.com',
        subject='Model accuracy below threshold',
    )

    prepare >> split >> [train, prep_test] >> evaluate >> check
    check >> [deploy, notify]`,
}

export const sampleDAGs: SampleDAG[] = [
  basicETLDAG,
  branchingDAG,
  parallelDAG,
  mlPipelineDAG,
]

export const dagCategories = {
  etl: 'ETL 파이프라인',
  'data-pipeline': '데이터 파이프라인',
  ml: 'ML 파이프라인',
  reporting: '리포팅',
}

// 태스크 실행 시뮬레이션
export const simulateTaskExecution = (
  task: Task,
  upstreamStates: TaskState[]
): { newState: TaskState; duration: number; logs: string[] } => {
  const logs: string[] = []

  // Trigger Rule 체크
  const canRun = checkTriggerRule(task.triggerRule, upstreamStates)
  if (!canRun.result) {
    return {
      newState: canRun.skipReason === 'upstream_failed' ? 'upstream_failed' : 'skipped',
      duration: 0,
      logs: [`Skipped: ${canRun.skipReason}`],
    }
  }

  // 랜덤 실행 시간 (500ms ~ 3000ms)
  const duration = 500 + Math.random() * 2500

  // 90% 확률로 성공
  const success = Math.random() > 0.1

  if (success) {
    logs.push(`[INFO] Task ${task.name} started`)
    logs.push(`[INFO] Executing ${task.operator}...`)
    logs.push(`[INFO] Task completed successfully in ${(duration / 1000).toFixed(2)}s`)
    return { newState: 'success', duration, logs }
  } else {
    logs.push(`[INFO] Task ${task.name} started`)
    logs.push(`[ERROR] Execution failed: Simulated error`)
    return { newState: 'failed', duration, logs }
  }
}

// Trigger Rule 체크
const checkTriggerRule = (
  rule: string,
  upstreamStates: TaskState[]
): { result: boolean; skipReason?: string } => {
  if (upstreamStates.length === 0) return { result: true }

  const successCount = upstreamStates.filter((s) => s === 'success').length
  const failedCount = upstreamStates.filter((s) => s === 'failed').length
  const skippedCount = upstreamStates.filter((s) => s === 'skipped').length
  const doneCount = upstreamStates.filter((s) =>
    ['success', 'failed', 'skipped', 'upstream_failed'].includes(s)
  ).length

  switch (rule) {
    case 'all_success':
      if (failedCount > 0) return { result: false, skipReason: 'upstream_failed' }
      return { result: successCount === upstreamStates.length }
    case 'all_failed':
      return { result: failedCount === upstreamStates.length }
    case 'all_done':
      return { result: doneCount === upstreamStates.length }
    case 'one_success':
      return { result: successCount >= 1 }
    case 'one_failed':
      return { result: failedCount >= 1 }
    case 'none_failed':
      return { result: failedCount === 0 && doneCount === upstreamStates.length }
    case 'none_skipped':
      return { result: skippedCount === 0 && doneCount === upstreamStates.length }
    default:
      return { result: true }
  }
}
