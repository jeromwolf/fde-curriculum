// Week 7 Day 3: 스케줄링 & 의존성
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'w7d3t1',
    title: '스케줄링 심화',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: '',
      transcript: `
# Airflow 스케줄링 심화

## 1. schedule_interval 이해

### Cron 표현식
\`\`\`python
# 분 시 일 월 요일
'0 6 * * *'      # 매일 06:00
'30 9 * * 1-5'   # 평일 09:30
'0 0 1 * *'      # 매월 1일 00:00
'*/15 * * * *'   # 15분마다
\`\`\`

### 프리셋 값
| 프리셋 | Cron | 설명 |
|--------|------|------|
| @once | - | 한 번만 실행 |
| @hourly | 0 * * * * | 매시 정각 |
| @daily | 0 0 * * * | 매일 자정 |
| @weekly | 0 0 * * 0 | 매주 일요일 자정 |
| @monthly | 0 0 1 * * | 매월 1일 자정 |
| @yearly | 0 0 1 1 * | 매년 1월 1일 자정 |
| None | - | 트리거로만 실행 |

## 2. execution_date vs logical_date

\`\`\`
DAG: schedule_interval='@daily', start_date=2024-01-01

Timeline:
────────────────────────────────────────────────────▶
        │           │           │           │
     Jan 1       Jan 2       Jan 3       Jan 4
        │           │           │           │
        │           │           │           └─ Run 3 시작 (data_interval: Jan 3)
        │           │           └─ Run 2 시작 (data_interval: Jan 2)
        │           └─ Run 1 시작 (data_interval: Jan 1)
        └─ start_date (실행 아님)

실제 실행 시점: Jan 2, 3, 4...
처리하는 데이터: Jan 1, 2, 3...
\`\`\`

### Airflow 2.2+ 용어
\`\`\`python
# 권장 (명확한 의미)
context['data_interval_start']  # 데이터 시작 시점
context['data_interval_end']    # 데이터 끝 시점
context['logical_date']         # = data_interval_start

# 레거시 (하위 호환성)
context['execution_date']       # = logical_date
context['ds']                   # = logical_date (YYYY-MM-DD 문자열)
\`\`\`

## 3. Timetable (Airflow 2.1+)

### 커스텀 스케줄
\`\`\`python
from airflow.timetables.base import Timetable
from pendulum import DateTime

class BusinessDayTimetable(Timetable):
    def next_dagrun_info(self, last_automated_data_interval, restriction):
        # 평일만 실행하는 로직
        ...

dag = DAG(
    'business_day_dag',
    timetable=BusinessDayTimetable(),
    ...
)
\`\`\`

### 데이터셋 기반 스케줄
\`\`\`python
from airflow import Dataset

# Producer DAG
my_dataset = Dataset('s3://bucket/data/')

with DAG('producer', ...):
    @task(outlets=[my_dataset])
    def produce():
        # 데이터 생성
        ...

# Consumer DAG - 데이터셋 업데이트 시 실행
with DAG('consumer', schedule=[my_dataset], ...):
    @task
    def consume():
        # 데이터 소비
        ...
\`\`\`

## 4. Catchup & Backfill

### Catchup
\`\`\`python
# catchup=True (기본값)
# start_date부터 현재까지 모든 실행 자동 수행
dag = DAG(
    'daily_etl',
    start_date=datetime(2024, 1, 1),
    schedule_interval='@daily',
    catchup=True,  # Jan 1, 2, 3... 모두 실행
)

# catchup=False
# 가장 최근 실행만 수행
dag = DAG(
    'daily_etl',
    start_date=datetime(2024, 1, 1),
    catchup=False,  # 오늘 날짜만 실행
)
\`\`\`

### Backfill (CLI)
\`\`\`bash
# 특정 기간 재실행
airflow dags backfill \\
    --start-date 2024-01-01 \\
    --end-date 2024-01-31 \\
    daily_etl
\`\`\`

## 5. max_active_runs

동시 실행 DAG Run 수 제한:

\`\`\`python
dag = DAG(
    'heavy_etl',
    max_active_runs=1,  # 한 번에 하나만
    ...
)
\`\`\`
      `,
      objectives: [
        'Cron 표현식과 프리셋 이해',
        'execution_date vs logical_date 구분',
        'Catchup과 Backfill 개념 이해',
        'max_active_runs 활용'
      ],
      keyPoints: [
        'DAG은 data_interval 종료 후 실행됨',
        'catchup=False로 과거 실행 방지',
        'max_active_runs로 동시성 제어'
      ]
    }
  },
  {
    id: 'w7d3t2',
    title: 'DAG 간 의존성',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `
# DAG 간 의존성 설정

## 1. ExternalTaskSensor

### 기본 사용법
\`\`\`python
from airflow.sensors.external_task import ExternalTaskSensor

# upstream_dag이 완료될 때까지 대기
wait_for_upstream = ExternalTaskSensor(
    task_id='wait_for_upstream',
    external_dag_id='upstream_dag',
    external_task_id='final_task',  # None이면 전체 DAG 완료 대기
    timeout=3600,
    poke_interval=60,
    mode='reschedule',  # 대기 중 Worker 해제
)
\`\`\`

### execution_delta
\`\`\`python
# 시간 차이가 있는 경우
# upstream: 06:00 실행
# downstream: 09:00 실행, upstream의 06:00 실행 대기

wait_sensor = ExternalTaskSensor(
    task_id='wait_sensor',
    external_dag_id='upstream_dag',
    execution_delta=timedelta(hours=3),  # 3시간 전 실행 대기
)
\`\`\`

### execution_date_fn
\`\`\`python
# 복잡한 날짜 계산
def get_most_recent_dag_run(dt):
    # 가장 최근 성공한 실행 찾기
    return dt.replace(hour=0, minute=0, second=0)

wait_sensor = ExternalTaskSensor(
    task_id='wait_sensor',
    external_dag_id='upstream_dag',
    execution_date_fn=get_most_recent_dag_run,
)
\`\`\`

## 2. TriggerDagRunOperator

### 다른 DAG 트리거
\`\`\`python
from airflow.operators.trigger_dagrun import TriggerDagRunOperator

trigger_downstream = TriggerDagRunOperator(
    task_id='trigger_downstream',
    trigger_dag_id='downstream_dag',
    conf={'key': 'value'},  # 파라미터 전달
    wait_for_completion=False,  # True면 완료 대기
)
\`\`\`

### 동적 트리거
\`\`\`python
from airflow.decorators import task

@task
def get_regions():
    return ['us', 'eu', 'asia']

@task
def trigger_regional_dag(region: str):
    from airflow.operators.trigger_dagrun import TriggerDagRunOperator
    TriggerDagRunOperator(
        task_id=f'trigger_{region}',
        trigger_dag_id='regional_processing',
        conf={'region': region},
    ).execute({})

regions = get_regions()
trigger_regional_dag.expand(region=regions)
\`\`\`

## 3. Dataset 기반 의존성 (Airflow 2.4+)

### Producer DAG
\`\`\`python
from airflow import Dataset

# 데이터셋 정의
orders_dataset = Dataset('s3://bucket/orders/')
users_dataset = Dataset('s3://bucket/users/')

with DAG('extract_orders', schedule='@daily', ...):
    @task(outlets=[orders_dataset])
    def extract_orders():
        # S3에 데이터 저장
        ...

with DAG('extract_users', schedule='@daily', ...):
    @task(outlets=[users_dataset])
    def extract_users():
        # S3에 데이터 저장
        ...
\`\`\`

### Consumer DAG
\`\`\`python
# 두 데이터셋 모두 업데이트되면 실행
with DAG(
    'join_data',
    schedule=[orders_dataset, users_dataset],  # Dataset 트리거
    ...
):
    @task
    def join():
        # 데이터 조인
        ...
\`\`\`

## 4. Cross-DAG 패턴 비교

| 패턴 | 장점 | 단점 | 사용 시점 |
|------|------|------|----------|
| ExternalTaskSensor | 명시적, 직관적 | 풀링 오버헤드 | 정해진 스케줄 |
| TriggerDagRunOperator | 능동적 트리거 | 양방향 의존성 어려움 | 이벤트 기반 |
| Dataset | 데이터 중심, 자동 | Airflow 2.4+ 필요 | 데이터 파이프라인 |

## 5. 주의사항

\`\`\`python
# BAD: 순환 의존성
# DAG A → DAG B → DAG A (무한 루프!)

# GOOD: 단방향 흐름
# DAG A → DAG B → DAG C
\`\`\`
      `,
      externalLinks: [
        {
          title: 'Cross-DAG Dependencies',
          url: 'https://airflow.apache.org/docs/apache-airflow/stable/howto/operator/external_task_sensor.html'
        },
        {
          title: 'Data-aware Scheduling',
          url: 'https://airflow.apache.org/docs/apache-airflow/stable/authoring-and-scheduling/datasets.html'
        }
      ]
    }
  },
  {
    id: 'w7d3t3',
    title: 'Branch & 조건부 실행',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# Branch & 조건부 실행

조건에 따라 다른 경로로 실행하는 방법을 학습합니다.

## 목표
1. BranchPythonOperator 사용법
2. trigger_rule 활용
3. ShortCircuitOperator 사용

## 시나리오
- 요일에 따라 다른 처리
- 데이터 크기에 따른 분기
      `,
      starterCode: `
# dags/branching_example.py
from datetime import datetime
from airflow import DAG
from airflow.operators.python import PythonOperator, BranchPythonOperator, ShortCircuitOperator
from airflow.operators.bash import BashOperator
from airflow.operators.empty import EmptyOperator


with DAG(
    'branching_example',
    start_date=datetime(2024, 1, 1),
    schedule_interval='@daily',
    catchup=False,
) as dag:

    start = EmptyOperator(task_id='start')

    # TODO 1: BranchPythonOperator
    # 요일에 따라 분기:
    # - 월~금: weekday_processing
    # - 토~일: weekend_processing

    def choose_branch(**context):
        # logical_date의 요일 확인 (0=월요일)
        pass

    branch_task = BranchPythonOperator(
        task_id='branch_by_day',
        python_callable=choose_branch,
    )

    weekday_task = BashOperator(
        task_id='weekday_processing',
        bash_command='echo "Weekday processing"',
    )

    weekend_task = BashOperator(
        task_id='weekend_processing',
        bash_command='echo "Weekend processing"',
    )

    # TODO 2: Join (trigger_rule 설정 필요!)
    join = EmptyOperator(
        task_id='join',
        # trigger_rule=?
    )

    # TODO 3: ShortCircuitOperator
    # 데이터가 있을 때만 다음 태스크 실행

    def check_data_exists(**context):
        # True 반환 시 계속, False 반환 시 downstream skip
        pass

    check_data = ShortCircuitOperator(
        task_id='check_data',
        python_callable=check_data_exists,
    )

    process_data = BashOperator(
        task_id='process_data',
        bash_command='echo "Processing data..."',
    )

    end = EmptyOperator(task_id='end')

    # TODO: 의존성 설정
`,
      solutionCode: `
# dags/branching_example.py
from datetime import datetime
from airflow import DAG
from airflow.operators.python import PythonOperator, BranchPythonOperator, ShortCircuitOperator
from airflow.operators.bash import BashOperator
from airflow.operators.empty import EmptyOperator
from airflow.utils.trigger_rule import TriggerRule


with DAG(
    'branching_example',
    start_date=datetime(2024, 1, 1),
    schedule_interval='@daily',
    catchup=False,
    tags=['branching'],
) as dag:

    start = EmptyOperator(task_id='start')

    # 1. BranchPythonOperator - 요일별 분기
    def choose_branch(**context):
        logical_date = context['logical_date']
        day_of_week = logical_date.weekday()  # 0=월, 6=일

        if day_of_week < 5:  # 월~금
            return 'weekday_processing'
        else:  # 토~일
            return 'weekend_processing'

    branch_task = BranchPythonOperator(
        task_id='branch_by_day',
        python_callable=choose_branch,
    )

    weekday_task = BashOperator(
        task_id='weekday_processing',
        bash_command='echo "Weekday: Full processing"',
    )

    weekend_task = BashOperator(
        task_id='weekend_processing',
        bash_command='echo "Weekend: Light processing"',
    )

    # 2. Join - trigger_rule로 skipped 허용
    join = EmptyOperator(
        task_id='join',
        trigger_rule=TriggerRule.NONE_FAILED_MIN_ONE_SUCCESS,
        # NONE_FAILED_MIN_ONE_SUCCESS: 실패 없고 최소 1개 성공
    )

    # 3. ShortCircuitOperator - 조건부 실행
    def check_data_exists(**context):
        # 실제로는 파일 존재 확인, API 호출 등
        import random
        has_data = random.choice([True, False])
        print(f"Data exists: {has_data}")
        return has_data  # False면 downstream skip

    check_data = ShortCircuitOperator(
        task_id='check_data',
        python_callable=check_data_exists,
    )

    process_data = BashOperator(
        task_id='process_data',
        bash_command='echo "Processing data..."',
    )

    end = EmptyOperator(
        task_id='end',
        trigger_rule=TriggerRule.NONE_FAILED_MIN_ONE_SUCCESS,
    )

    # 의존성 설정
    start >> branch_task
    branch_task >> [weekday_task, weekend_task] >> join
    join >> check_data >> process_data >> end

# trigger_rule 옵션:
# ALL_SUCCESS (기본): 모든 upstream 성공
# ALL_FAILED: 모든 upstream 실패
# ALL_DONE: 모든 upstream 완료 (성공/실패/skip)
# ONE_SUCCESS: 하나라도 성공
# ONE_FAILED: 하나라도 실패
# NONE_FAILED: 실패 없음 (성공 또는 skip)
# NONE_FAILED_MIN_ONE_SUCCESS: 실패 없고 최소 1개 성공
# NONE_SKIPPED: skip 없음
# ALWAYS: 항상 실행
`,
      hints: [
        'BranchPythonOperator는 task_id 문자열 반환',
        'Branch 후 join에는 trigger_rule 필수',
        'ShortCircuitOperator는 boolean 반환',
        'TriggerRule.NONE_FAILED_MIN_ONE_SUCCESS 자주 사용'
      ]
    }
  },
  {
    id: 'w7d3t4',
    title: '동적 태스크 매핑',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `
# 동적 태스크 매핑 (Dynamic Task Mapping)

Airflow 2.3+에서 도입된 런타임에 태스크를 동적으로 생성하는 기능입니다.

## 1. expand() 기본

\`\`\`python
from airflow.decorators import dag, task

@dag(...)
def dynamic_dag():

    @task
    def get_files():
        return ['file1.csv', 'file2.csv', 'file3.csv']

    @task
    def process(file_name: str):
        print(f"Processing {file_name}")

    # 동적으로 3개 태스크 생성
    files = get_files()
    process.expand(file_name=files)
\`\`\`

### UI에서 표시

\`\`\`
process (3 mapped tasks)
├── process[0]: file1.csv
├── process[1]: file2.csv
└── process[2]: file3.csv
\`\`\`

## 2. partial() + expand()

고정 파라미터와 동적 파라미터 조합:

\`\`\`python
@task
def process_with_config(file_name: str, config: dict):
    print(f"Processing {file_name} with {config}")

# config는 고정, file_name은 동적
process_with_config.partial(
    config={'mode': 'full'}
).expand(
    file_name=['file1.csv', 'file2.csv']
)
\`\`\`

## 3. expand_kwargs()

딕셔너리 리스트로 확장:

\`\`\`python
@task
def multi_param(a: str, b: int):
    print(f"a={a}, b={b}")

# 각 딕셔너리가 하나의 태스크
multi_param.expand_kwargs([
    {'a': 'x', 'b': 1},
    {'a': 'y', 'b': 2},
    {'a': 'z', 'b': 3},
])
\`\`\`

## 4. 전통적인 Operator에서 사용

\`\`\`python
from airflow.operators.bash import BashOperator

BashOperator.partial(
    task_id='dynamic_bash',
).expand(
    bash_command=[
        'echo "Task 1"',
        'echo "Task 2"',
        'echo "Task 3"',
    ]
)
\`\`\`

## 5. 매핑된 결과 수집

\`\`\`python
@task
def process(item: str):
    return f"processed_{item}"

@task
def aggregate(results: list):
    print(f"All results: {results}")

items = ['a', 'b', 'c']
processed = process.expand(item=items)
aggregate(processed)  # ["processed_a", "processed_b", "processed_c"]
\`\`\`

## 6. 제한사항

| 항목 | 제한 |
|------|------|
| 중첩 매핑 | 지원 안됨 |
| 최대 매핑 수 | 기본 1024 (설정 가능) |
| Branch와 조합 | 복잡함 |
| XCom 크기 | 주의 필요 |

## 7. vs 기존 방식

### 기존 방식 (정적)
\`\`\`python
# DAG 파싱 시점에 태스크 수 결정
for file in ['file1', 'file2', 'file3']:
    task = PythonOperator(
        task_id=f'process_{file}',
        python_callable=process,
        op_kwargs={'file': file},
    )
\`\`\`

### Dynamic Task Mapping
\`\`\`python
# 런타임에 태스크 수 결정
process.expand(file=get_files())
\`\`\`
      `,
      externalLinks: [
        {
          title: 'Dynamic Task Mapping',
          url: 'https://airflow.apache.org/docs/apache-airflow/stable/authoring-and-scheduling/dynamic-task-mapping.html'
        }
      ]
    }
  },
  {
    id: 'w7d3t5',
    title: '스케줄링 & 의존성 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'DAG의 start_date가 2024-01-01이고 schedule_interval="@daily"일 때, 첫 실행 시점은?',
          options: [
            '2024-01-01 00:00',
            '2024-01-02 00:00',
            'DAG 등록 즉시',
            '수동 트리거 시'
          ],
          answer: 1,
          explanation: 'Airflow는 data_interval이 끝난 후 실행합니다. 2024-01-01의 데이터를 처리하는 DAG Run은 2024-01-02에 실행됩니다.'
        },
        {
          question: 'catchup=False의 효과는?',
          options: [
            '에러 무시',
            'start_date부터 현재까지 모든 실행 수행',
            '가장 최근 실행만 수행하고 과거 건너뜀',
            '스케줄링 비활성화'
          ],
          answer: 2,
          explanation: 'catchup=False는 과거 실행을 건너뛰고 가장 최근/현재 실행만 수행합니다.'
        },
        {
          question: 'BranchPythonOperator 사용 후 join 태스크에 적합한 trigger_rule은?',
          options: [
            'ALL_SUCCESS',
            'ALL_DONE',
            'NONE_FAILED_MIN_ONE_SUCCESS',
            'ONE_SUCCESS'
          ],
          answer: 2,
          explanation: 'Branch 후에는 선택되지 않은 경로가 skip됩니다. NONE_FAILED_MIN_ONE_SUCCESS는 실패 없이 최소 1개 성공 시 실행됩니다.'
        },
        {
          question: 'Dataset 기반 스케줄링의 장점은?',
          options: [
            '더 빠른 실행',
            '데이터 준비 완료 시 자동 트리거',
            '메모리 절약',
            '디버깅 용이'
          ],
          answer: 1,
          explanation: 'Dataset 스케줄링은 upstream DAG이 데이터를 생성하면 자동으로 downstream DAG이 트리거됩니다.'
        },
        {
          question: 'expand()의 용도는?',
          options: [
            '태스크 병렬 실행',
            '런타임에 동적으로 태스크 생성',
            '태스크 그룹화',
            'XCom 크기 확장'
          ],
          answer: 1,
          explanation: 'expand()는 Dynamic Task Mapping으로, 런타임에 입력 리스트의 각 요소에 대해 태스크를 동적으로 생성합니다.'
        }
      ]
    }
  }
]
