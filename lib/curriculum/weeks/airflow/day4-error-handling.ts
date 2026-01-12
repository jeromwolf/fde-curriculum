// Week 7 Day 4: 에러 핸들링 & 모니터링
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'w7d4t1',
    title: '에러 핸들링 전략',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: '',
      transcript: `
# Airflow 에러 핸들링 전략

## 1. Retry 설정

### 기본 설정
\`\`\`python
default_args = {
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

# 또는 태스크별 설정
task = PythonOperator(
    task_id='flaky_task',
    python_callable=call_external_api,
    retries=5,
    retry_delay=timedelta(minutes=2),
)
\`\`\`

### Exponential Backoff
\`\`\`python
task = PythonOperator(
    task_id='api_call',
    python_callable=call_api,
    retries=5,
    retry_delay=timedelta(minutes=1),
    retry_exponential_backoff=True,  # 1, 2, 4, 8, 16분...
    max_retry_delay=timedelta(minutes=30),  # 최대 30분
)
\`\`\`

## 2. Callback 함수

### on_failure_callback
\`\`\`python
def failure_callback(context):
    task_instance = context['task_instance']
    dag_id = context['dag'].dag_id
    task_id = task_instance.task_id
    execution_date = context['execution_date']
    exception = context.get('exception')

    message = f'''
    ❌ Task Failed!
    DAG: {dag_id}
    Task: {task_id}
    Execution Date: {execution_date}
    Error: {exception}
    '''
    send_slack_alert(message)

task = PythonOperator(
    task_id='important_task',
    python_callable=process_data,
    on_failure_callback=failure_callback,
)
\`\`\`

### on_success_callback
\`\`\`python
def success_callback(context):
    duration = context['task_instance'].duration
    print(f"Task completed in {duration} seconds")

task = PythonOperator(
    task_id='tracked_task',
    python_callable=process,
    on_success_callback=success_callback,
)
\`\`\`

### on_retry_callback
\`\`\`python
def retry_callback(context):
    try_number = context['task_instance'].try_number
    print(f"Retrying... attempt {try_number}")

task = PythonOperator(
    task_id='retry_task',
    python_callable=flaky_function,
    on_retry_callback=retry_callback,
    retries=3,
)
\`\`\`

## 3. SLA (Service Level Agreement)

### SLA 설정
\`\`\`python
def sla_miss_callback(dag, task_list, blocking_task_list, slas, blocking_tis):
    message = f'''
    ⚠️ SLA Miss!
    DAG: {dag.dag_id}
    Tasks: {[t.task_id for t in task_list]}
    '''
    send_alert(message)

dag = DAG(
    'critical_pipeline',
    sla_miss_callback=sla_miss_callback,
    ...
)

task = PythonOperator(
    task_id='time_sensitive_task',
    python_callable=process,
    sla=timedelta(hours=2),  # 2시간 내 완료 필요
)
\`\`\`

## 4. 이메일 알림

### 기본 이메일 설정
\`\`\`python
default_args = {
    'email': ['data-team@company.com'],
    'email_on_failure': True,
    'email_on_retry': False,
}
\`\`\`

### SMTP 설정 (airflow.cfg)
\`\`\`ini
[smtp]
smtp_host = smtp.gmail.com
smtp_starttls = True
smtp_ssl = False
smtp_user = your-email@gmail.com
smtp_password = your-app-password
smtp_port = 587
smtp_mail_from = airflow@company.com
\`\`\`

## 5. 에러 전파 제어

### trigger_rule 활용
\`\`\`python
# 실패해도 알림 태스크 실행
notify = SlackWebhookOperator(
    task_id='notify_always',
    trigger_rule='all_done',  # 성공/실패 상관없이
)

process >> notify
\`\`\`

### depends_on_past
\`\`\`python
dag = DAG(
    'sequential_dag',
    ...
)

# 이전 실행이 성공해야 다음 실행
task = PythonOperator(
    task_id='dependent_task',
    depends_on_past=True,
    ...
)
\`\`\`
      `,
      objectives: [
        'Retry 설정 및 Exponential Backoff 이해',
        'Callback 함수 활용법 학습',
        'SLA 설정 및 모니터링',
        '에러 전파 제어 방법 파악'
      ],
      keyPoints: [
        'retry_exponential_backoff로 점진적 재시도',
        'on_failure_callback으로 실패 알림',
        'SLA로 실행 시간 모니터링'
      ]
    }
  },
  {
    id: 'w7d4t2',
    title: 'Slack & 외부 알림 통합',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# Slack 알림 통합

실패/성공 시 Slack으로 알림을 보내는 방법을 학습합니다.

## 목표
1. Slack Webhook 설정
2. 커스텀 알림 함수 작성
3. DAG에 통합

## 사전 준비
- Slack Workspace
- Incoming Webhook URL (Slack App 설정에서 생성)
      `,
      starterCode: `
# dags/slack_alerts.py
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.providers.slack.operators.slack_webhook import SlackWebhookOperator
import requests
import json

# Slack Webhook URL (실제로는 Variable이나 Connection 사용)
SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# TODO 1: 커스텀 Slack 알림 함수
def send_slack_notification(context, status='failed'):
    """
    context에서 정보 추출하여 Slack 메시지 전송
    """
    pass


# TODO 2: 성공/실패 콜백 함수
def on_success(context):
    pass

def on_failure(context):
    pass


# TODO 3: DAG 정의
with DAG(
    'dag_with_slack_alerts',
    start_date=datetime(2024, 1, 1),
    schedule_interval='@daily',
    catchup=False,
    default_args={
        'retries': 2,
        'retry_delay': timedelta(minutes=1),
    },
) as dag:

    start = BashOperator(
        task_id='start',
        bash_command='echo "Starting..."',
    )

    # TODO: 성공 가능한 태스크
    success_task = PythonOperator(
        task_id='success_task',
        python_callable=lambda: print("Success!"),
    )

    # TODO: 실패하는 태스크 (테스트용)
    # fail_task = ...

    # TODO: 항상 실행되는 알림 태스크
    # notify = SlackWebhookOperator(...)

    # TODO: 의존성 설정
`,
      solutionCode: `
# dags/slack_alerts.py
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.providers.slack.operators.slack_webhook import SlackWebhookOperator
from airflow.utils.trigger_rule import TriggerRule
import requests
import json

SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# 1. 커스텀 Slack 알림 함수
def send_slack_notification(context, status='failed'):
    """Slack으로 알림 전송"""
    dag_id = context['dag'].dag_id
    task_id = context['task_instance'].task_id
    execution_date = context['execution_date']
    log_url = context['task_instance'].log_url

    if status == 'failed':
        emoji = '❌'
        color = 'danger'
        exception = context.get('exception', 'Unknown')
        text = f"Task Failed: {exception}"
    else:
        emoji = '✅'
        color = 'good'
        duration = context['task_instance'].duration
        text = f"Task completed in {duration:.1f}s"

    message = {
        "attachments": [
            {
                "color": color,
                "blocks": [
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": f"{emoji} Airflow Alert",
                        }
                    },
                    {
                        "type": "section",
                        "fields": [
                            {"type": "mrkdwn", "text": f"*DAG:* {dag_id}"},
                            {"type": "mrkdwn", "text": f"*Task:* {task_id}"},
                            {"type": "mrkdwn", "text": f"*Date:* {execution_date}"},
                            {"type": "mrkdwn", "text": f"*Status:* {status.upper()}"},
                        ]
                    },
                    {
                        "type": "section",
                        "text": {"type": "mrkdwn", "text": text}
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {"type": "plain_text", "text": "View Logs"},
                                "url": log_url
                            }
                        ]
                    }
                ]
            }
        ]
    }

    # 실제 전송 (테스트 환경에서는 주석 처리)
    # requests.post(SLACK_WEBHOOK_URL, json=message)
    print(f"Would send to Slack: {json.dumps(message, indent=2)}")


# 2. 콜백 함수
def on_success(context):
    send_slack_notification(context, status='success')

def on_failure(context):
    send_slack_notification(context, status='failed')


# 3. DAG 정의
with DAG(
    'dag_with_slack_alerts',
    start_date=datetime(2024, 1, 1),
    schedule_interval='@daily',
    catchup=False,
    default_args={
        'retries': 2,
        'retry_delay': timedelta(minutes=1),
        'on_failure_callback': on_failure,  # 전역 설정
    },
    tags=['alerts', 'slack'],
) as dag:

    start = BashOperator(
        task_id='start',
        bash_command='echo "Starting pipeline..."',
    )

    success_task = PythonOperator(
        task_id='success_task',
        python_callable=lambda: print("This task succeeds!"),
        on_success_callback=on_success,  # 성공 시 알림
    )

    # 실패 테스트용 (주석 해제하여 테스트)
    # fail_task = PythonOperator(
    #     task_id='fail_task',
    #     python_callable=lambda: 1/0,  # 의도적 에러
    # )

    # SlackWebhookOperator 사용 (Airflow Connection 필요)
    notify_complete = SlackWebhookOperator(
        task_id='notify_complete',
        slack_webhook_conn_id='slack_webhook',  # Connection ID
        message='''
:white_check_mark: *Pipeline Complete*
DAG: {{ dag.dag_id }}
Date: {{ ds }}
        ''',
        trigger_rule=TriggerRule.ALL_DONE,  # 항상 실행
    )

    end = BashOperator(
        task_id='end',
        bash_command='echo "Pipeline finished"',
        trigger_rule=TriggerRule.ALL_DONE,
    )

    start >> success_task >> notify_complete >> end
`,
      hints: [
        'context에서 dag, task_instance, exception 등 추출',
        'Slack Block Kit으로 풍부한 메시지 구성',
        'trigger_rule=ALL_DONE으로 항상 실행되는 알림',
        'Connection으로 Webhook URL 안전하게 관리'
      ]
    }
  },
  {
    id: 'w7d4t3',
    title: '로깅 & 모니터링',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `
# Airflow 로깅 & 모니터링

## 1. 로깅 기본

### Python logging 사용
\`\`\`python
import logging

logger = logging.getLogger(__name__)

def my_task(**context):
    logger.info("Task started")
    logger.warning("This is a warning")
    logger.error("This is an error")

    # 또는 print (자동으로 로그에 포함)
    print("This also goes to logs")
\`\`\`

### 로그 확인 위치
\`\`\`
$AIRFLOW_HOME/logs/
├── dag_id/
│   └── task_id/
│       └── 2024-01-15T00:00:00+00:00/
│           └── 1.log
├── scheduler/
└── webserver/
\`\`\`

## 2. 원격 로그 저장

### S3로 로그 저장
\`\`\`ini
# airflow.cfg
[logging]
remote_logging = True
remote_base_log_folder = s3://my-bucket/airflow-logs
remote_log_conn_id = aws_default
\`\`\`

### GCS로 로그 저장
\`\`\`ini
[logging]
remote_logging = True
remote_base_log_folder = gs://my-bucket/airflow-logs
remote_log_conn_id = google_cloud_default
\`\`\`

## 3. 메트릭 수집

### StatsD 연동
\`\`\`ini
# airflow.cfg
[metrics]
statsd_on = True
statsd_host = localhost
statsd_port = 8125
statsd_prefix = airflow
\`\`\`

### 주요 메트릭
| 메트릭 | 설명 |
|--------|------|
| dag.{dag_id}.{task_id}.duration | 태스크 실행 시간 |
| dag_processing.total_parse_time | DAG 파싱 시간 |
| scheduler.tasks.running | 실행 중 태스크 수 |
| executor.open_slots | 사용 가능한 슬롯 |
| pool.{pool_name}.used_slots | 풀 사용량 |

## 4. Prometheus & Grafana

### Prometheus Exporter
\`\`\`bash
pip install apache-airflow[statsd]
\`\`\`

\`\`\`ini
# airflow.cfg
[metrics]
statsd_on = True
statsd_host = statsd-exporter
statsd_port = 9125
\`\`\`

### Grafana 대시보드
- DAG 실행 상태
- 태스크 성공/실패율
- 실행 시간 추이
- 리소스 사용량

## 5. 헬스체크

### REST API 활용
\`\`\`bash
# 헬스체크 엔드포인트
curl http://localhost:8080/health

# 응답
{
  "metadatabase": {"status": "healthy"},
  "scheduler": {"status": "healthy", "latest_scheduler_heartbeat": "..."}
}
\`\`\`

### DAG 상태 모니터링
\`\`\`python
from airflow.api.client.local_client import Client

client = Client(None, None)

# DAG 상태 확인
dag_runs = client.get_dag_runs('my_dag')
for run in dag_runs:
    print(f"{run.execution_date}: {run.state}")
\`\`\`

## 6. 알림 통합 요약

| 도구 | 용도 | 설정 |
|------|------|------|
| Email | 기본 알림 | SMTP 설정 |
| Slack | 팀 알림 | Webhook/Bot |
| PagerDuty | 온콜 알림 | API Key |
| Datadog | 종합 모니터링 | Agent 설치 |
| Prometheus | 메트릭 수집 | StatsD 연동 |
      `,
      externalLinks: [
        {
          title: 'Airflow Logging',
          url: 'https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/logging-monitoring/logging-tasks.html'
        },
        {
          title: 'Airflow Metrics',
          url: 'https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/logging-monitoring/metrics.html'
        }
      ]
    }
  },
  {
    id: 'w7d4t4',
    title: 'Airflow vs 대안 도구',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `
# Airflow vs 대안 도구

## 1. 비교 요약

| 항목 | Airflow | Dagster | Prefect |
|------|---------|---------|---------|
| 철학 | 태스크 중심 | 자산(Asset) 중심 | 워크플로우 중심 |
| 학습 곡선 | 높음 | 중간 | 낮음 |
| UI | 표준 | 훌륭함 | 훌륭함 |
| 테스트 | 어려움 | 쉬움 | 쉬움 |
| dbt 통합 | 플러그인 | 네이티브 (최고) | 좋음 |
| 시장 점유율 | 1위 | 성장 중 | 성장 중 |

## 2. Dagster

### 특징
- **Software-Defined Assets**: 데이터 자산 중심 모델링
- **Type System**: 입출력 타입 정의
- **Excellent Testing**: 유닛 테스트 용이
- **dbt Native**: dbt와 완벽한 통합

### 코드 예시
\`\`\`python
from dagster import asset, Definitions

@asset
def raw_orders():
    """원본 주문 데이터"""
    return pd.read_csv("orders.csv")

@asset
def cleaned_orders(raw_orders):
    """정제된 주문 데이터"""
    return raw_orders.dropna()

@asset
def order_summary(cleaned_orders):
    """주문 요약"""
    return cleaned_orders.groupby("product").sum()

defs = Definitions(assets=[raw_orders, cleaned_orders, order_summary])
\`\`\`

### 언제 Dagster?
- 신규 프로젝트
- dbt 중심 파이프라인
- 데이터 품질 중요
- 팀이 작고 민첩

## 3. Prefect

### 특징
- **Pythonic**: 가장 Python다운 문법
- **Hybrid Execution**: 로컬/클라우드 유연
- **Flow Runs**: 동적 워크플로우
- **빠른 시작**: 설정 최소화

### 코드 예시
\`\`\`python
from prefect import flow, task

@task
def extract():
    return {"data": [1, 2, 3]}

@task
def transform(data):
    return [x * 2 for x in data["data"]]

@task
def load(data):
    print(f"Loading: {data}")

@flow
def etl_pipeline():
    raw = extract()
    transformed = transform(raw)
    load(transformed)

if __name__ == "__main__":
    etl_pipeline()
\`\`\`

### 언제 Prefect?
- 빠른 프로토타입
- ML 파이프라인
- 소규모 팀
- 로컬 개발 중요

## 4. 선택 가이드

### Airflow 선택
- ✅ 대규모 조직
- ✅ 기존 Airflow 사용 중
- ✅ 다양한 시스템 연동 필요
- ✅ 채용 시장 (가장 많은 인력)

### Dagster 선택
- ✅ dbt 중심 Modern Data Stack
- ✅ 데이터 품질 우선
- ✅ 신규 프로젝트
- ✅ 테스트 중시

### Prefect 선택
- ✅ 빠른 개발 필요
- ✅ ML/AI 워크플로우
- ✅ 로컬 개발 중심
- ✅ 설정 최소화

## 5. 마이그레이션 고려사항

### Airflow → Dagster
\`\`\`python
# Dagster는 Airflow DAG 직접 실행 지원
from dagster_airflow import make_dagster_job_from_airflow_dag

dagster_job = make_dagster_job_from_airflow_dag(
    dag=my_airflow_dag,
    ...
)
\`\`\`

### 현실적 조언
- 기존 Airflow가 잘 동작하면 유지
- 신규 프로젝트에서 대안 검토
- 점진적 마이그레이션 권장
      `,
      externalLinks: [
        {
          title: 'Dagster Documentation',
          url: 'https://docs.dagster.io/'
        },
        {
          title: 'Prefect Documentation',
          url: 'https://docs.prefect.io/'
        },
        {
          title: 'Dagster vs Airflow',
          url: 'https://dagster.io/vs/dagster-vs-airflow'
        }
      ]
    }
  },
  {
    id: 'w7d4t5',
    title: '에러 핸들링 & 모니터링 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'retry_exponential_backoff=True의 효과는?',
          options: [
            '재시도 횟수 증가',
            '재시도 간격이 점점 길어짐 (1, 2, 4, 8분...)',
            '재시도 간격이 점점 짧아짐',
            '병렬 재시도'
          ],
          answer: 1,
          explanation: 'Exponential Backoff는 재시도 간격을 지수적으로 증가시켜 외부 시스템 부하를 줄입니다.'
        },
        {
          question: 'on_failure_callback의 context에서 얻을 수 없는 정보는?',
          options: [
            'exception',
            'task_instance',
            'dag',
            'next_execution_date'
          ],
          answer: 3,
          explanation: 'context에는 현재 실행 정보만 포함됩니다. 다음 실행 날짜는 별도 계산이 필요합니다.'
        },
        {
          question: 'SLA의 역할은?',
          options: [
            '태스크 자동 재시도',
            '태스크 완료 시간 모니터링 및 알림',
            '태스크 병렬 실행',
            '태스크 우선순위 설정'
          ],
          answer: 1,
          explanation: 'SLA는 태스크가 지정된 시간 내에 완료되지 않으면 sla_miss_callback을 호출합니다.'
        },
        {
          question: 'Dagster의 핵심 철학은?',
          options: [
            '태스크 중심',
            '자산(Asset) 중심',
            '이벤트 중심',
            '스케줄 중심'
          ],
          answer: 1,
          explanation: 'Dagster는 Software-Defined Assets 개념으로, 데이터 자산을 중심으로 파이프라인을 모델링합니다.'
        },
        {
          question: 'depends_on_past=True의 효과는?',
          options: [
            '병렬 실행 활성화',
            '이전 DAG Run의 같은 태스크가 성공해야 실행',
            '과거 실행 모두 건너뜀',
            '이전 태스크 완료 대기'
          ],
          answer: 1,
          explanation: 'depends_on_past는 이전 DAG Run의 동일 태스크가 성공해야 현재 태스크를 실행합니다.'
        }
      ]
    }
  }
]
