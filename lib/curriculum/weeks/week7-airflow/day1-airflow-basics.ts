// Week 7 Day 1: Airflow 기초 & 아키텍처
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'w7d1t1',
    title: 'Apache Airflow 소개',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: '',
      transcript: `
# Apache Airflow 소개

## 1. Airflow란?

Apache Airflow는 **워크플로우 오케스트레이션** 플랫폼입니다.
데이터 파이프라인을 프로그래밍 방식으로 작성, 스케줄링, 모니터링할 수 있습니다.

### 탄생 배경
- 2014년 Airbnb에서 개발
- 2016년 Apache 인큐베이터
- 2019년 Apache Top-Level Project
- 현재: 데이터 엔지니어링 표준 도구

## 2. 왜 Airflow인가?

### Cron의 한계
\`\`\`bash
# crontab - 단순 스케줄링만 가능
0 6 * * * python /scripts/extract.py
30 6 * * * python /scripts/transform.py  # extract 완료 보장?
0 7 * * * python /scripts/load.py        # transform 완료 보장?
\`\`\`

### Airflow의 해결책
\`\`\`python
# DAG - 의존성 명시적 관리
extract >> transform >> load
# extract 완료 후 transform 실행
# transform 완료 후 load 실행
\`\`\`

## 3. 핵심 개념

### DAG (Directed Acyclic Graph)
\`\`\`
방향성 비순환 그래프
- 방향성: 작업 순서가 있음
- 비순환: 순환 의존성 없음

    ┌─────────┐
    │ Extract │
    └────┬────┘
         │
    ┌────▼────┐
    │Transform│
    └────┬────┘
         │
    ┌────▼────┐
    │  Load   │
    └─────────┘
\`\`\`

### Task
- DAG 내의 개별 작업 단위
- Operator로 정의

### Operator
| Operator | 용도 |
|----------|------|
| PythonOperator | Python 함수 실행 |
| BashOperator | Shell 명령 실행 |
| PostgresOperator | SQL 쿼리 실행 |
| S3Operator | AWS S3 작업 |
| EmailOperator | 이메일 발송 |

### Sensor
- 조건을 기다리는 특수 Operator
- FileSensor: 파일 존재 대기
- S3KeySensor: S3 객체 대기
- ExternalTaskSensor: 다른 DAG 완료 대기

## 4. Airflow 아키텍처

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        Web Server                            │
│                    (UI, API, 모니터링)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Scheduler                             │
│              (DAG 파싱, 태스크 스케줄링)                       │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Worker 1 │   │ Worker 2 │   │ Worker 3 │
        │ (Executor)│   │ (Executor)│   │ (Executor)│
        └──────────┘   └──────────┘   └──────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Metadata Database                        │
│              (PostgreSQL, MySQL - 상태 저장)                  │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Executor 종류
| Executor | 특징 | 사용 환경 |
|----------|------|----------|
| SequentialExecutor | 순차 실행, 디버깅용 | 개발 |
| LocalExecutor | 로컬 병렬 실행 | 소규모 |
| CeleryExecutor | 분산 실행 (Celery) | 중/대규모 |
| KubernetesExecutor | K8s Pod으로 실행 | 클라우드 |

## 5. Airflow의 장단점

### 장점
- ✅ Python 기반 (개발자 친화적)
- ✅ 풍부한 UI (모니터링, 디버깅)
- ✅ 방대한 생태계 (Provider 패키지)
- ✅ 커뮤니티 지원

### 단점
- ❌ 학습 곡선 높음
- ❌ 초기 설정 복잡
- ❌ 스트리밍 미지원 (배치 전용)
- ❌ 테스트 어려움
      `,
      objectives: [
        'Airflow의 필요성과 역할 이해',
        'DAG, Task, Operator 개념 파악',
        'Airflow 아키텍처 컴포넌트 이해',
        'Executor 종류별 특징 파악'
      ],
      keyPoints: [
        'Airflow는 워크플로우 오케스트레이션 도구',
        'DAG로 작업 간 의존성 정의',
        'Scheduler가 태스크 실행 관리'
      ]
    }
  },
  {
    id: 'w7d1t2',
    title: 'Airflow 환경 설정',
    type: 'reading',
    duration: 25,
    content: {
      markdown: `
# Airflow 환경 설정

## 1. 설치 방법

### 방법 1: pip 설치 (개발용)
\`\`\`bash
# 가상환경 생성
python -m venv airflow_venv
source airflow_venv/bin/activate

# Airflow 설치 (constraint 파일 사용 권장)
AIRFLOW_VERSION=2.8.0
PYTHON_VERSION="$(python --version | cut -d " " -f 2 | cut -d "." -f 1-2)"
CONSTRAINT_URL="https://raw.githubusercontent.com/apache/airflow/constraints-\${AIRFLOW_VERSION}/constraints-\${PYTHON_VERSION}.txt"

pip install "apache-airflow==\${AIRFLOW_VERSION}" --constraint "\${CONSTRAINT_URL}"
\`\`\`

### 방법 2: Docker Compose (권장)
\`\`\`yaml
# docker-compose.yaml
version: '3.8'
x-airflow-common:
  &airflow-common
  image: apache/airflow:2.8.0
  environment:
    &airflow-common-env
    AIRFLOW__CORE__EXECUTOR: LocalExecutor
    AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
    AIRFLOW__CORE__FERNET_KEY: ''
    AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION: 'true'
    AIRFLOW__CORE__LOAD_EXAMPLES: 'false'
  volumes:
    - ./dags:/opt/airflow/dags
    - ./logs:/opt/airflow/logs
    - ./plugins:/opt/airflow/plugins
  depends_on:
    postgres:
      condition: service_healthy

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: airflow
      POSTGRES_PASSWORD: airflow
      POSTGRES_DB: airflow
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "airflow"]
      interval: 5s
      retries: 5
    volumes:
      - postgres-db-volume:/var/lib/postgresql/data

  airflow-webserver:
    <<: *airflow-common
    command: webserver
    ports:
      - 8080:8080
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:8080/health"]
      interval: 10s
      timeout: 10s
      retries: 5

  airflow-scheduler:
    <<: *airflow-common
    command: scheduler
    healthcheck:
      test: ["CMD-SHELL", 'airflow jobs check --job-type SchedulerJob --hostname HOSTNAME_VAR']
      interval: 10s
      timeout: 10s
      retries: 5

  airflow-init:
    <<: *airflow-common
    entrypoint: /bin/bash
    command:
      - -c
      - |
        airflow db init
        airflow users create \\
          --username admin \\
          --firstname Admin \\
          --lastname User \\
          --role Admin \\
          --email admin@example.com \\
          --password admin

volumes:
  postgres-db-volume:
\`\`\`

### 방법 3: Astronomer (프로덕션)
\`\`\`bash
# Astro CLI 설치
curl -sSL https://install.astronomer.io | sudo bash

# 프로젝트 생성
astro dev init

# 로컬 실행
astro dev start
\`\`\`

## 2. 디렉토리 구조

\`\`\`
airflow_project/
├── dags/                    # DAG 파일들
│   ├── __init__.py
│   ├── daily_etl.py
│   └── weekly_report.py
├── plugins/                 # 커스텀 플러그인
│   ├── __init__.py
│   ├── operators/
│   └── hooks/
├── include/                 # SQL, 설정 파일
│   ├── sql/
│   └── config/
├── tests/                   # 테스트
│   └── dags/
├── docker-compose.yaml
├── Dockerfile
└── requirements.txt
\`\`\`

## 3. 주요 설정 (airflow.cfg)

\`\`\`ini
[core]
# DAG 폴더
dags_folder = /opt/airflow/dags

# Executor 설정
executor = LocalExecutor

# 병렬 실행 수
parallelism = 32
dag_concurrency = 16
max_active_runs_per_dag = 16

[webserver]
# 웹 서버 포트
web_server_port = 8080

# 인증
authenticate = True
auth_backend = airflow.api.auth.backend.basic_auth

[scheduler]
# DAG 파싱 주기
dag_dir_list_interval = 30

# 스케줄러 하트비트
scheduler_heartbeat_sec = 5
\`\`\`

## 4. 첫 번째 실행

\`\`\`bash
# Docker Compose 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f airflow-scheduler

# 웹 UI 접속
# http://localhost:8080
# ID: admin / PW: admin
\`\`\`

## 5. 유용한 CLI 명령어

\`\`\`bash
# DAG 목록
airflow dags list

# DAG 트리거
airflow dags trigger my_dag

# 태스크 테스트
airflow tasks test my_dag my_task 2024-01-01

# DAG 파싱 테스트
airflow dags test my_dag

# 연결 목록
airflow connections list

# 변수 설정
airflow variables set my_var "value"
\`\`\`
      `,
      externalLinks: [
        {
          title: 'Airflow Official Documentation',
          url: 'https://airflow.apache.org/docs/'
        },
        {
          title: 'Airflow Docker Compose',
          url: 'https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html'
        },
        {
          title: 'Astronomer Academy',
          url: 'https://academy.astronomer.io/'
        }
      ]
    }
  },
  {
    id: 'w7d1t3',
    title: '첫 번째 DAG 작성',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# 첫 번째 DAG 작성

간단한 Hello World DAG를 작성하고 실행해봅니다.

## 목표
1. DAG 기본 구조 이해
2. Task 정의 방법 학습
3. 의존성 설정 방법 학습

## 환경
- Docker Compose로 실행된 Airflow 또는
- 로컬 Airflow (standalone)
      `,
      starterCode: `
# dags/hello_world.py
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator

# TODO 1: default_args 정의
# - owner: 'data_team'
# - retries: 2
# - retry_delay: 5분


# TODO 2: DAG 정의
# - dag_id: 'hello_world'
# - schedule_interval: 매일 09:00 (cron: '0 9 * * *')
# - start_date: 2024-01-01
# - catchup: False


# TODO 3: Python 함수 정의
def print_hello():
    print("Hello, Airflow!")
    return "Hello returned"

def print_date(**context):
    # execution_date 출력
    print(f"Execution date: {context['ds']}")


# TODO 4: Task 정의
# - task1: BashOperator로 'echo "Starting..."' 실행
# - task2: PythonOperator로 print_hello 실행
# - task3: PythonOperator로 print_date 실행
# - task4: BashOperator로 'echo "Done!"' 실행


# TODO 5: 의존성 설정
# task1 >> task2 >> task3 >> task4
`,
      solutionCode: `
# dags/hello_world.py
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator

# 1. default_args 정의
default_args = {
    'owner': 'data_team',
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
    'email_on_failure': False,
    'email_on_retry': False,
}

# 2. DAG 정의
with DAG(
    dag_id='hello_world',
    default_args=default_args,
    description='My first Airflow DAG',
    schedule_interval='0 9 * * *',  # 매일 09:00
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['example', 'tutorial'],
) as dag:

    # 3. Python 함수 정의
    def print_hello():
        print("Hello, Airflow!")
        return "Hello returned"

    def print_date(**context):
        execution_date = context['ds']
        logical_date = context['logical_date']
        print(f"Execution date (ds): {execution_date}")
        print(f"Logical date: {logical_date}")
        return execution_date

    # 4. Task 정의
    task1 = BashOperator(
        task_id='start',
        bash_command='echo "Starting pipeline at $(date)"',
    )

    task2 = PythonOperator(
        task_id='print_hello',
        python_callable=print_hello,
    )

    task3 = PythonOperator(
        task_id='print_date',
        python_callable=print_date,
        provide_context=True,  # Airflow 2.0+에서는 자동
    )

    task4 = BashOperator(
        task_id='end',
        bash_command='echo "Pipeline completed successfully!"',
    )

    # 5. 의존성 설정
    task1 >> task2 >> task3 >> task4

# 테스트 명령어:
# airflow tasks test hello_world start 2024-01-01
# airflow dags test hello_world 2024-01-01
`,
      hints: [
        'with DAG() as dag: 컨텍스트 매니저 사용',
        'default_args는 모든 Task에 적용됨',
        '>> 연산자로 의존성 설정',
        'provide_context=True로 Airflow 컨텍스트 전달'
      ]
    }
  },
  {
    id: 'w7d1t4',
    title: 'Airflow UI 탐색',
    type: 'reading',
    duration: 15,
    content: {
      markdown: `
# Airflow UI 탐색

## 1. 메인 화면 (DAGs View)

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│ DAG                    │ Schedule │ Last Run │ Recent Tasks     │
├────────────────────────┼──────────┼──────────┼──────────────────┤
│ ○ daily_etl            │ 0 6 * * *│ Success  │ ●●●●● (5 tasks)  │
│ ● weekly_report        │ 0 9 * * 1│ Running  │ ●●●○○ (3/5)      │
│ ○ monthly_cleanup      │ 0 0 1 * *│ Failed   │ ●●○○○ (2/5)      │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### 주요 기능
- **Toggle**: DAG 활성화/비활성화
- **Trigger**: 수동 실행
- **Refresh**: DAG 새로고침
- **Delete**: DAG 삭제

## 2. Graph View

DAG의 태스크 의존성을 시각화합니다.

\`\`\`
    ┌─────────┐
    │ extract │ (success)
    └────┬────┘
         │
    ┌────▼────┐
    │transform│ (running)
    └────┬────┘
         │
    ┌────▼────┐
    │  load   │ (queued)
    └─────────┘
\`\`\`

### 태스크 상태 색상
| 색상 | 상태 |
|------|------|
| 🟢 녹색 | Success |
| 🟡 노랑 | Running |
| 🔴 빨강 | Failed |
| 🟣 보라 | Queued |
| ⚪ 흰색 | No status |
| 🟠 주황 | Upstream failed |

## 3. Tree View (Grid View)

시간에 따른 실행 이력을 보여줍니다.

\`\`\`
           │ Jan 1 │ Jan 2 │ Jan 3 │ Jan 4 │
───────────┼───────┼───────┼───────┼───────┤
extract    │   ●   │   ●   │   ●   │   ○   │
transform  │   ●   │   ●   │   ✗   │   -   │
load       │   ●   │   ●   │   -   │   -   │

● Success  ✗ Failed  ○ Running  - Skipped
\`\`\`

## 4. Task Instance Details

태스크 클릭 시 상세 정보:

\`\`\`
Task Instance: transform
─────────────────────────────────
State: success
Start: 2024-01-15 06:05:00
End: 2024-01-15 06:08:30
Duration: 3m 30s
Retries: 0

[Log] [Rendered] [XCom] [Clear] [Mark Success]
\`\`\`

### 주요 액션
- **Log**: 실행 로그 확인
- **Rendered**: 템플릿 렌더링 결과
- **XCom**: 태스크 간 전달 데이터
- **Clear**: 태스크 재실행
- **Mark Success/Failed**: 상태 수동 변경

## 5. Admin 메뉴

### Connections
외부 시스템 연결 정보 관리

\`\`\`
Connection ID: postgres_default
Connection Type: Postgres
Host: localhost
Schema: airflow
Login: airflow
Password: ****
Port: 5432
\`\`\`

### Variables
전역 변수 관리

\`\`\`
Key: environment
Value: production

Key: slack_webhook
Value: https://hooks.slack.com/...
\`\`\`

### Pools
리소스 제한 설정

\`\`\`
Pool: default_pool
Slots: 128
Running: 5
Queued: 0
\`\`\`

## 6. 유용한 단축키

| 단축키 | 기능 |
|--------|------|
| t | Task 선택 |
| g | Graph View |
| l | Tree View |
| c | Calendar View |
| d | Details |
| r | Refresh |
      `,
      externalLinks: [
        {
          title: 'Airflow UI Overview',
          url: 'https://airflow.apache.org/docs/apache-airflow/stable/ui.html'
        }
      ]
    }
  },
  {
    id: 'w7d1t5',
    title: 'Airflow 기초 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'DAG에서 "Acyclic"이 의미하는 것은?',
          options: [
            '비동기 실행',
            '순환 의존성 없음',
            '자동 스케줄링',
            '분산 실행'
          ],
          answer: 1,
          explanation: 'Acyclic은 "비순환"을 의미합니다. DAG에서는 A→B→C→A와 같은 순환 의존성이 허용되지 않습니다.'
        },
        {
          question: 'Airflow에서 외부 시스템 연결 정보를 저장하는 곳은?',
          options: [
            'Variables',
            'Connections',
            'Pools',
            'XCom'
          ],
          answer: 1,
          explanation: 'Connections는 데이터베이스, API, 클라우드 서비스 등 외부 시스템 연결 정보를 저장합니다.'
        },
        {
          question: 'Scheduler의 주요 역할은?',
          options: [
            'UI 제공',
            'DAG 파싱 및 태스크 스케줄링',
            '데이터 저장',
            '로그 수집'
          ],
          answer: 1,
          explanation: 'Scheduler는 DAG 파일을 파싱하고, 스케줄에 따라 태스크를 실행 대기열에 추가합니다.'
        },
        {
          question: 'CeleryExecutor의 장점은?',
          options: [
            '설정이 간단함',
            '분산 실행으로 확장성 확보',
            '메모리 사용량 적음',
            '디버깅 용이'
          ],
          answer: 1,
          explanation: 'CeleryExecutor는 여러 Worker 노드에서 태스크를 분산 실행하여 대규모 워크로드를 처리할 수 있습니다.'
        },
        {
          question: '태스크 간 데이터를 전달하는 메커니즘은?',
          options: [
            'Variables',
            'Connections',
            'XCom',
            'Pools'
          ],
          answer: 2,
          explanation: 'XCom(Cross-Communication)은 태스크 간에 작은 데이터를 전달하는 메커니즘입니다.'
        }
      ]
    }
  },
  {
    id: 'w7d1t6',
    title: '도전과제: 간단한 ETL DAG',
    type: 'challenge',
    duration: 35,
    content: {
      instructions: `
# 도전과제: 간단한 ETL DAG 작성

## 시나리오
날씨 API에서 데이터를 추출하여 파일로 저장하는 간단한 ETL 파이프라인을 만듭니다.

## 요구사항

### 1. DAG 설정
- dag_id: 'weather_etl'
- schedule: 매 시간 정각 (0 * * * *)
- start_date: 어제
- catchup: False

### 2. Tasks
1. **check_api**: API 상태 확인 (BashOperator + curl)
2. **extract**: 날씨 데이터 추출 (PythonOperator)
3. **transform**: 데이터 변환 (PythonOperator)
4. **load**: 파일로 저장 (PythonOperator)
5. **notify**: 완료 메시지 출력 (BashOperator)

### 3. 의존성
\`\`\`
check_api >> extract >> transform >> load >> notify
\`\`\`

### 4. 추가 요구사항
- XCom으로 데이터 전달
- 적절한 에러 처리
- 로깅 추가

## 힌트
- 실제 API 대신 더미 데이터 사용 가능
- context['ti'].xcom_push/pull 사용
      `,
      starterCode: `
# dags/weather_etl.py
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
import json
import logging

logger = logging.getLogger(__name__)

default_args = {
    'owner': 'data_team',
    'retries': 2,
    'retry_delay': timedelta(minutes=2),
}

# TODO: DAG 정의


# TODO: extract 함수 - 날씨 데이터 추출 (더미 데이터 사용)
def extract_weather(**context):
    pass


# TODO: transform 함수 - 데이터 변환
def transform_weather(**context):
    pass


# TODO: load 함수 - 파일 저장
def load_weather(**context):
    pass


# TODO: Task 정의 및 의존성 설정
`,
      requirements: [
        'DAG 기본 설정 완료',
        '5개 Task 구현 (check_api, extract, transform, load, notify)',
        'XCom으로 태스크 간 데이터 전달',
        '적절한 로깅 추가'
      ],
      evaluationCriteria: [
        'DAG 정상 파싱 (airflow dags test)',
        '모든 태스크 성공적 실행',
        'XCom 데이터 전달 확인',
        '코드 가독성 및 주석'
      ],
      hints: [
        'context["ti"].xcom_push(key, value)로 데이터 저장',
        'context["ti"].xcom_pull(task_ids, key)로 데이터 조회',
        'BashOperator의 bash_command에 curl 사용',
        'json.dumps/loads로 직렬화'
      ]
    }
  }
]
