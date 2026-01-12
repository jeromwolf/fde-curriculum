// Week 7 Day 2: DAG 작성 & Operator
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'w7d2t1',
    title: '주요 Operator 심화',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: '',
      transcript: `
# 주요 Operator 심화

## 1. PythonOperator

### 기본 사용법
\`\`\`python
from airflow.operators.python import PythonOperator

def my_function(name, **context):
    print(f"Hello {name}!")
    print(f"Execution date: {context['ds']}")
    return "success"

task = PythonOperator(
    task_id='python_task',
    python_callable=my_function,
    op_kwargs={'name': 'World'},  # 키워드 인자
)
\`\`\`

### 템플릿 변수 사용
\`\`\`python
def process_date(execution_date, **kwargs):
    print(f"Processing data for: {execution_date}")

task = PythonOperator(
    task_id='templated_task',
    python_callable=process_date,
    op_kwargs={
        'execution_date': '{{ ds }}',  # 템플릿 렌더링
    },
)
\`\`\`

## 2. BashOperator

### 기본 사용법
\`\`\`python
from airflow.operators.bash import BashOperator

task = BashOperator(
    task_id='bash_task',
    bash_command='echo "Hello from Bash!"',
)
\`\`\`

### 스크립트 파일 실행
\`\`\`python
task = BashOperator(
    task_id='run_script',
    bash_command='/path/to/script.sh ',  # 끝에 공백 필수!
)

# 템플릿 사용
task = BashOperator(
    task_id='templated_bash',
    bash_command='echo "Date: {{ ds }}, Param: {{ params.my_param }}"',
    params={'my_param': 'value'},
)
\`\`\`

## 3. SqlOperator

### PostgresOperator 예시
\`\`\`python
from airflow.providers.postgres.operators.postgres import PostgresOperator

task = PostgresOperator(
    task_id='create_table',
    postgres_conn_id='postgres_default',
    sql='''
        CREATE TABLE IF NOT EXISTS daily_stats (
            date DATE PRIMARY KEY,
            total_sales DECIMAL,
            order_count INT
        );
    ''',
)

# SQL 파일 사용
task = PostgresOperator(
    task_id='run_sql_file',
    postgres_conn_id='postgres_default',
    sql='sql/daily_aggregation.sql',  # include/ 폴더 기준
)
\`\`\`

### 템플릿 SQL
\`\`\`python
task = PostgresOperator(
    task_id='insert_daily',
    postgres_conn_id='postgres_default',
    sql='''
        INSERT INTO daily_stats (date, total_sales, order_count)
        SELECT
            '{{ ds }}'::DATE as date,
            SUM(amount) as total_sales,
            COUNT(*) as order_count
        FROM orders
        WHERE order_date = '{{ ds }}'
    ''',
)
\`\`\`

## 4. Sensor

### FileSensor
\`\`\`python
from airflow.sensors.filesystem import FileSensor

wait_for_file = FileSensor(
    task_id='wait_for_file',
    filepath='/data/input/{{ ds }}.csv',
    poke_interval=60,      # 60초마다 확인
    timeout=3600,          # 1시간 타임아웃
    mode='poke',           # poke 또는 reschedule
)
\`\`\`

### ExternalTaskSensor
\`\`\`python
from airflow.sensors.external_task import ExternalTaskSensor

wait_for_upstream = ExternalTaskSensor(
    task_id='wait_for_upstream',
    external_dag_id='upstream_dag',
    external_task_id='final_task',
    execution_delta=timedelta(hours=1),  # 시간 차이
    timeout=7200,
)
\`\`\`

### SqlSensor
\`\`\`python
from airflow.providers.common.sql.sensors.sql import SqlSensor

wait_for_data = SqlSensor(
    task_id='wait_for_data',
    conn_id='postgres_default',
    sql="SELECT COUNT(*) FROM orders WHERE date = '{{ ds }}'",
    success=lambda cell: cell > 0,  # 조건 함수
    timeout=3600,
)
\`\`\`

## 5. Operator 선택 가이드

| 상황 | Operator |
|------|----------|
| Python 로직 실행 | PythonOperator |
| Shell 명령 실행 | BashOperator |
| SQL 쿼리 실행 | PostgresOperator, MySqlOperator |
| 파일 대기 | FileSensor |
| 외부 DAG 대기 | ExternalTaskSensor |
| HTTP API 호출 | SimpleHttpOperator |
| 이메일 발송 | EmailOperator |
| Slack 메시지 | SlackWebhookOperator |
      `,
      objectives: [
        '주요 Operator 사용법 숙지',
        '템플릿 변수 활용 방법 학습',
        'Sensor 개념과 사용법 이해',
        'Operator 선택 기준 파악'
      ],
      keyPoints: [
        'PythonOperator는 op_kwargs로 인자 전달',
        'SQL 템플릿에서 {{ ds }}로 날짜 주입',
        'Sensor는 조건 충족까지 대기'
      ]
    }
  },
  {
    id: 'w7d2t2',
    title: 'TaskFlow API (Airflow 2.0+)',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `
# TaskFlow API

Airflow 2.0에서 도입된 더 Pythonic한 DAG 작성 방식입니다.

## 1. 기존 방식 vs TaskFlow

### 기존 방식 (Operator)
\`\`\`python
def extract(**context):
    data = {'key': 'value'}
    context['ti'].xcom_push(key='data', value=data)

def transform(**context):
    data = context['ti'].xcom_pull(task_ids='extract', key='data')
    result = transform_logic(data)
    context['ti'].xcom_push(key='result', value=result)

with DAG('traditional_dag', ...) as dag:
    extract_task = PythonOperator(
        task_id='extract',
        python_callable=extract,
    )
    transform_task = PythonOperator(
        task_id='transform',
        python_callable=transform,
    )
    extract_task >> transform_task
\`\`\`

### TaskFlow API
\`\`\`python
from airflow.decorators import dag, task

@dag(schedule_interval='@daily', start_date=datetime(2024, 1, 1))
def taskflow_dag():

    @task
    def extract():
        return {'key': 'value'}  # 자동으로 XCom 저장

    @task
    def transform(data: dict):
        return transform_logic(data)

    @task
    def load(result):
        save_to_database(result)

    # 의존성 자동 설정
    data = extract()
    result = transform(data)
    load(result)

# DAG 인스턴스 생성
dag_instance = taskflow_dag()
\`\`\`

## 2. @task 데코레이터

### 기본 사용
\`\`\`python
@task
def my_task():
    return "result"

@task(task_id='custom_id')
def another_task():
    return "another"
\`\`\`

### 여러 출력
\`\`\`python
@task(multiple_outputs=True)
def extract():
    return {
        'users': [...],
        'orders': [...]
    }

# 사용
data = extract()
process_users(data['users'])
process_orders(data['orders'])
\`\`\`

## 3. 기존 Operator와 혼합

\`\`\`python
@dag(schedule_interval='@daily', start_date=datetime(2024, 1, 1))
def mixed_dag():

    @task
    def process_data():
        return "processed"

    # TaskFlow
    data = process_data()

    # 기존 Operator
    notify = BashOperator(
        task_id='notify',
        bash_command='echo "Done"',
    )

    data >> notify

dag_instance = mixed_dag()
\`\`\`

## 4. 동적 태스크

\`\`\`python
@dag(...)
def dynamic_dag():

    @task
    def get_files():
        return ['file1.csv', 'file2.csv', 'file3.csv']

    @task
    def process_file(file_name: str):
        print(f"Processing {file_name}")

    files = get_files()
    process_file.expand(file_name=files)  # 동적으로 3개 태스크 생성

dag_instance = dynamic_dag()
\`\`\`

## 5. TaskFlow 장점

| 장점 | 설명 |
|------|------|
| 가독성 | 일반 Python 함수처럼 작성 |
| 자동 XCom | return 값 자동 저장/전달 |
| 타입 힌트 | 파라미터 타입 검증 |
| IDE 지원 | 자동 완성, 타입 체크 |

## 6. 주의사항

\`\`\`python
# BAD: 대용량 데이터 return
@task
def extract():
    return huge_dataframe  # XCom 크기 제한!

# GOOD: 경로만 return
@task
def extract():
    df.to_parquet('/tmp/data.parquet')
    return '/tmp/data.parquet'  # 경로만 전달
\`\`\`
      `,
      externalLinks: [
        {
          title: 'TaskFlow API Documentation',
          url: 'https://airflow.apache.org/docs/apache-airflow/stable/tutorial/taskflow.html'
        }
      ]
    }
  },
  {
    id: 'w7d2t3',
    title: 'XCom & 데이터 전달',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# XCom & 태스크 간 데이터 전달

XCom(Cross-Communication)은 태스크 간 데이터를 전달하는 메커니즘입니다.

## 목표
1. XCom push/pull 사용법 학습
2. TaskFlow API로 자동 XCom 활용
3. 실무에서의 XCom 활용 패턴

## 주의사항
- XCom은 작은 데이터용 (기본 최대 48KB)
- 대용량 데이터는 파일 경로만 전달
      `,
      starterCode: `
# dags/xcom_example.py
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.decorators import dag, task
import json

# ===== 방법 1: 전통적인 XCom =====

def extract_data(**context):
    # 데이터 추출 로직
    data = {
        'users': [
            {'id': 1, 'name': 'Alice'},
            {'id': 2, 'name': 'Bob'}
        ],
        'timestamp': str(datetime.now())
    }
    # TODO: XCom으로 데이터 push
    pass

def transform_data(**context):
    # TODO: XCom에서 데이터 pull
    # TODO: 변환 로직 (이름 대문자로)
    pass

def load_data(**context):
    # TODO: 변환된 데이터 pull
    # TODO: 저장 (print로 대체)
    pass


# 전통적인 DAG
with DAG(
    'xcom_traditional',
    start_date=datetime(2024, 1, 1),
    schedule_interval=None,
    catchup=False,
) as dag1:
    # TODO: Task 정의 및 연결
    pass


# ===== 방법 2: TaskFlow API =====

@dag(
    dag_id='xcom_taskflow',
    start_date=datetime(2024, 1, 1),
    schedule_interval=None,
    catchup=False,
)
def xcom_taskflow_dag():

    @task
    def extract():
        # TODO: 데이터 return (자동 XCom)
        pass

    @task
    def transform(data: dict):
        # TODO: 변환 로직
        pass

    @task
    def load(transformed_data: dict):
        # TODO: 저장 로직
        pass

    # TODO: 태스크 연결


# DAG 인스턴스 생성
taskflow_instance = xcom_taskflow_dag()
`,
      solutionCode: `
# dags/xcom_example.py
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.decorators import dag, task
import json

# ===== 방법 1: 전통적인 XCom =====

def extract_data(**context):
    data = {
        'users': [
            {'id': 1, 'name': 'Alice'},
            {'id': 2, 'name': 'Bob'}
        ],
        'timestamp': str(datetime.now())
    }
    # XCom으로 데이터 push
    context['ti'].xcom_push(key='extracted_data', value=data)
    print(f"Extracted data: {data}")
    return data  # return도 자동으로 XCom 저장 (key='return_value')

def transform_data(**context):
    # XCom에서 데이터 pull
    data = context['ti'].xcom_pull(
        task_ids='extract',
        key='extracted_data'
    )
    print(f"Received data: {data}")

    # 변환: 이름 대문자로
    transformed = {
        'users': [
            {**user, 'name': user['name'].upper()}
            for user in data['users']
        ],
        'timestamp': data['timestamp'],
        'transformed_at': str(datetime.now())
    }

    context['ti'].xcom_push(key='transformed_data', value=transformed)
    print(f"Transformed data: {transformed}")

def load_data(**context):
    data = context['ti'].xcom_pull(
        task_ids='transform',
        key='transformed_data'
    )
    print(f"Loading data: {json.dumps(data, indent=2)}")
    # 실제로는 DB 저장, 파일 쓰기 등


# 전통적인 DAG
with DAG(
    'xcom_traditional',
    start_date=datetime(2024, 1, 1),
    schedule_interval=None,
    catchup=False,
    tags=['xcom', 'example'],
) as dag1:

    extract = PythonOperator(
        task_id='extract',
        python_callable=extract_data,
    )

    transform = PythonOperator(
        task_id='transform',
        python_callable=transform_data,
    )

    load = PythonOperator(
        task_id='load',
        python_callable=load_data,
    )

    extract >> transform >> load


# ===== 방법 2: TaskFlow API =====

@dag(
    dag_id='xcom_taskflow',
    start_date=datetime(2024, 1, 1),
    schedule_interval=None,
    catchup=False,
    tags=['xcom', 'taskflow'],
)
def xcom_taskflow_dag():

    @task
    def extract():
        """데이터 추출 - return 값이 자동으로 XCom 저장"""
        return {
            'users': [
                {'id': 1, 'name': 'Alice'},
                {'id': 2, 'name': 'Bob'}
            ],
            'timestamp': str(datetime.now())
        }

    @task
    def transform(data: dict):
        """데이터 변환 - 파라미터로 자동 XCom pull"""
        return {
            'users': [
                {**user, 'name': user['name'].upper()}
                for user in data['users']
            ],
            'timestamp': data['timestamp'],
            'transformed_at': str(datetime.now())
        }

    @task
    def load(transformed_data: dict):
        """데이터 로드"""
        print(f"Loading: {json.dumps(transformed_data, indent=2)}")
        return "success"

    # 태스크 연결 - 함수 호출처럼!
    raw_data = extract()
    transformed = transform(raw_data)
    load(transformed)


# DAG 인스턴스 생성
taskflow_instance = xcom_taskflow_dag()
`,
      hints: [
        "context['ti'].xcom_push(key, value)로 저장",
        "context['ti'].xcom_pull(task_ids, key)로 조회",
        'TaskFlow에서는 return/파라미터로 자동 처리',
        'XCom 크기 제한 주의 (기본 48KB)'
      ]
    }
  },
  {
    id: 'w7d2t4',
    title: 'TaskGroup으로 DAG 구조화',
    type: 'code',
    duration: 25,
    content: {
      instructions: `
# TaskGroup으로 DAG 구조화

TaskGroup은 관련 태스크들을 그룹화하여 DAG 가독성을 높입니다.

## 목표
1. TaskGroup 사용법 학습
2. 중첩 TaskGroup 구현
3. 복잡한 DAG 구조화
      `,
      starterCode: `
# dags/taskgroup_example.py
from datetime import datetime
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.utils.task_group import TaskGroup


with DAG(
    'etl_with_taskgroups',
    start_date=datetime(2024, 1, 1),
    schedule_interval='@daily',
    catchup=False,
) as dag:

    start = BashOperator(
        task_id='start',
        bash_command='echo "Starting ETL"',
    )

    # TODO: Extract TaskGroup
    # - extract_users: 사용자 데이터 추출
    # - extract_orders: 주문 데이터 추출
    # - extract_products: 상품 데이터 추출


    # TODO: Transform TaskGroup
    # - clean_data: 데이터 정제
    # - validate_data: 데이터 검증
    # - enrich_data: 데이터 보강


    # TODO: Load TaskGroup
    # - load_staging: 스테이징 테이블 로드
    # - load_warehouse: 웨어하우스 로드


    end = BashOperator(
        task_id='end',
        bash_command='echo "ETL Complete"',
    )

    # TODO: 의존성 설정
    # start >> extract_group >> transform_group >> load_group >> end
`,
      solutionCode: `
# dags/taskgroup_example.py
from datetime import datetime
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.utils.task_group import TaskGroup


def extract_table(table_name):
    print(f"Extracting {table_name}...")

def transform_step(step_name):
    print(f"Transform step: {step_name}")

def load_target(target_name):
    print(f"Loading to {target_name}...")


with DAG(
    'etl_with_taskgroups',
    start_date=datetime(2024, 1, 1),
    schedule_interval='@daily',
    catchup=False,
    tags=['etl', 'taskgroup'],
) as dag:

    start = BashOperator(
        task_id='start',
        bash_command='echo "Starting ETL at $(date)"',
    )

    # Extract TaskGroup
    with TaskGroup(group_id='extract') as extract_group:
        extract_users = PythonOperator(
            task_id='users',
            python_callable=extract_table,
            op_kwargs={'table_name': 'users'},
        )
        extract_orders = PythonOperator(
            task_id='orders',
            python_callable=extract_table,
            op_kwargs={'table_name': 'orders'},
        )
        extract_products = PythonOperator(
            task_id='products',
            python_callable=extract_table,
            op_kwargs={'table_name': 'products'},
        )
        # 병렬 실행 (의존성 없음)

    # Transform TaskGroup
    with TaskGroup(group_id='transform') as transform_group:
        clean = PythonOperator(
            task_id='clean',
            python_callable=transform_step,
            op_kwargs={'step_name': 'clean'},
        )
        validate = PythonOperator(
            task_id='validate',
            python_callable=transform_step,
            op_kwargs={'step_name': 'validate'},
        )
        enrich = PythonOperator(
            task_id='enrich',
            python_callable=transform_step,
            op_kwargs={'step_name': 'enrich'},
        )
        # 순차 실행
        clean >> validate >> enrich

    # Load TaskGroup (중첩 TaskGroup 예시)
    with TaskGroup(group_id='load') as load_group:

        with TaskGroup(group_id='staging') as staging_group:
            load_staging = PythonOperator(
                task_id='load',
                python_callable=load_target,
                op_kwargs={'target_name': 'staging'},
            )

        with TaskGroup(group_id='warehouse') as warehouse_group:
            load_dim = PythonOperator(
                task_id='dimensions',
                python_callable=load_target,
                op_kwargs={'target_name': 'dimensions'},
            )
            load_fact = PythonOperator(
                task_id='facts',
                python_callable=load_target,
                op_kwargs={'target_name': 'facts'},
            )
            load_dim >> load_fact

        staging_group >> warehouse_group

    end = BashOperator(
        task_id='end',
        bash_command='echo "ETL Complete at $(date)"',
    )

    # 전체 의존성
    start >> extract_group >> transform_group >> load_group >> end
`,
      hints: [
        'with TaskGroup(group_id) as group: 컨텍스트 사용',
        'TaskGroup 내 태스크는 기본적으로 병렬 실행',
        '중첩 TaskGroup으로 계층 구조 생성',
        'UI에서 그룹 펼치기/접기 가능'
      ]
    }
  },
  {
    id: 'w7d2t5',
    title: 'DAG & Operator 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'TaskFlow API에서 태스크 간 데이터를 전달하는 방법은?',
          options: [
            'xcom_push/xcom_pull 명시적 호출',
            '전역 변수 사용',
            'return 값이 자동으로 다음 태스크 파라미터로 전달',
            '파일 시스템 사용'
          ],
          answer: 2,
          explanation: 'TaskFlow API에서는 함수의 return 값이 자동으로 XCom에 저장되고, 다음 태스크의 파라미터로 전달됩니다.'
        },
        {
          question: 'Sensor의 mode="reschedule"의 장점은?',
          options: [
            '더 빠른 체크',
            '대기 중 Worker 슬롯 해제',
            '더 정확한 타이밍',
            '메모리 사용량 감소'
          ],
          answer: 1,
          explanation: 'reschedule 모드는 대기 중 Worker 슬롯을 해제하여 다른 태스크가 실행될 수 있게 합니다. poke 모드는 계속 슬롯을 점유합니다.'
        },
        {
          question: 'XCom 사용 시 주의할 점은?',
          options: [
            '문자열만 전달 가능',
            '데이터 크기 제한 (기본 48KB)',
            '같은 DAG 내에서만 사용 가능',
            '동기 실행만 지원'
          ],
          answer: 1,
          explanation: 'XCom은 메타데이터 DB에 저장되므로 크기 제한이 있습니다. 대용량 데이터는 파일 경로만 전달하는 것이 좋습니다.'
        },
        {
          question: 'TaskGroup의 주요 장점은?',
          options: [
            '실행 속도 향상',
            '메모리 절약',
            'DAG 가독성 향상 및 구조화',
            '에러 처리 자동화'
          ],
          answer: 2,
          explanation: 'TaskGroup은 관련 태스크들을 시각적으로 그룹화하여 복잡한 DAG의 가독성을 높입니다.'
        },
        {
          question: '@task(multiple_outputs=True)의 용도는?',
          options: [
            '여러 태스크 동시 실행',
            '딕셔너리 return 값을 개별 XCom으로 분리',
            '여러 DAG에 출력',
            '병렬 처리 활성화'
          ],
          answer: 1,
          explanation: 'multiple_outputs=True는 딕셔너리를 return할 때 각 키-값 쌍을 별도의 XCom으로 저장합니다.'
        }
      ]
    }
  }
]
