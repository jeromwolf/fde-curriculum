import { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'w8d4t1',
    title: '통합 DAG & 의존성 관리',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: '',
      transcript: `# 통합 DAG & 의존성 관리

## 🎯 오늘의 목표

개별 DAG들을 하나의 통합 파이프라인으로 연결하고, 모니터링/알림 시스템을 구축합니다.

## 📊 전체 파이프라인 흐름

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                    Daily Pipeline (02:00 UTC)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐                                                 │
│  │   Extract   │  02:00 ~ 03:00                                  │
│  │  All Sources│  (PostgreSQL, S3, API)                          │
│  └──────┬──────┘                                                 │
│         │                                                        │
│         ▼ Dataset Trigger                                        │
│  ┌─────────────┐                                                 │
│  │  Transform  │  03:00 ~ 04:30                                  │
│  │   Staging   │  (Raw → Staging)                                │
│  └──────┬──────┘                                                 │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────┐                                                 │
│  │  Transform  │  04:30 ~ 05:30                                  │
│  │  Warehouse  │  (Staging → DW)                                 │
│  └──────┬──────┘                                                 │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────┐                                                 │
│  │  Aggregate  │  05:30 ~ 06:00                                  │
│  │   Marts     │  (DW → Data Marts)                              │
│  └──────┬──────┘                                                 │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────┐                                                 │
│  │   Quality   │  06:00 ~ 06:15                                  │
│  │   Checks    │  (Great Expectations)                           │
│  └──────┬──────┘                                                 │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────┐                                                 │
│  │   Notify    │  06:15                                          │
│  │  Complete   │  (Slack, Email)                                 │
│  └─────────────┘                                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## 🔧 DAG 의존성 패턴

### 1. Dataset 기반 트리거 (Airflow 2.4+)

\`\`\`python
from airflow import Dataset

# 데이터셋 정의
raw_users = Dataset("s3://data-lake/raw/users")
stg_users = Dataset("s3://data-lake/staging/stg_users")

# Producer DAG
@dag(...)
def extract_users():
    @task(outlets=[raw_users])  # 이 데이터셋을 생성
    def extract():
        ...

# Consumer DAG
@dag(schedule=[raw_users])  # 이 데이터셋이 업데이트되면 실행
def transform_users():
    ...
\`\`\`

### 2. TriggerDagRunOperator

\`\`\`python
from airflow.operators.trigger_dagrun import TriggerDagRunOperator

trigger_transform = TriggerDagRunOperator(
    task_id='trigger_transform',
    trigger_dag_id='transform_warehouse',
    wait_for_completion=True,
    poke_interval=60,
)
\`\`\`

### 3. ExternalTaskSensor

\`\`\`python
from airflow.sensors.external_task import ExternalTaskSensor

wait_for_extract = ExternalTaskSensor(
    task_id='wait_for_extract',
    external_dag_id='extract_all_sources',
    external_task_id='send_summary',
    mode='reschedule',
    timeout=7200,
)
\`\`\`

## 📈 SLA (Service Level Agreement) 설정

\`\`\`python
@dag(
    dag_id='daily_pipeline',
    sla_miss_callback=notify_sla_miss,
)
def daily_pipeline():

    @task(sla=timedelta(hours=1))  # 1시간 내 완료
    def extract():
        ...

    @task(sla=timedelta(hours=2))  # 2시간 내 완료
    def transform():
        ...
\`\`\`

## 🔔 알림 시스템

### 알림 채널
- **Slack**: 실시간 알림 (실패, 경고, 완료)
- **Email**: 일일 요약 리포트
- **PagerDuty**: 크리티컬 장애 (On-call)

### 알림 규칙
| 상황 | Slack | Email | PagerDuty |
|------|-------|-------|-----------|
| Task 실패 | ✅ | ✅ | ❌ |
| DAG 실패 | ✅ | ✅ | ✅ |
| SLA 미스 | ✅ | ✅ | ✅ |
| 완료 | ✅ | ❌ | ❌ |
| 데이터 품질 경고 | ✅ | ✅ | ❌ |

## 📁 오늘 구현할 파일

\`\`\`
dags/
├── dag_daily_pipeline.py     # 통합 오케스트레이션
├── dag_data_quality.py       # 데이터 품질 검사
├── utils/
│   ├── notifications.py      # 알림 유틸리티
│   └── metrics.py            # 메트릭 수집
\`\`\`

자, 이제 구현을 시작합시다! 🚀
`,
      objectives: [
        '여러 DAG를 통합 파이프라인으로 연결하는 방법을 익힌다',
        'SLA 설정 및 알림 시스템을 구축한다',
        '데이터 품질 검사를 파이프라인에 통합한다'
      ],
      keyPoints: [
        'Dataset 기반 트리거로 느슨한 결합 구현',
        'SLA로 파이프라인 지연 감지',
        '다양한 채널로 상황별 알림'
      ]
    }
  },
  {
    id: 'w8d4t2',
    title: '통합 Daily Pipeline DAG 구현',
    type: 'code',
    duration: 40,
    content: {
      instructions: `## 통합 Daily Pipeline DAG 구현

전체 파이프라인을 하나의 DAG로 통합하여 오케스트레이션합니다.

### 구현 요구사항

1. **dag_daily_pipeline.py**
   - TriggerDagRunOperator로 하위 DAG 호출
   - SLA 설정
   - 실패/성공 콜백
`,
      starterCode: `# dags/dag_daily_pipeline.py

from datetime import datetime, timedelta
from airflow.decorators import dag, task

@dag(
    dag_id='daily_pipeline',
    schedule='0 2 * * *',
    start_date=datetime(2024, 1, 1),
)
def daily_pipeline():
    """Master DAG that orchestrates the entire daily pipeline."""
    # TODO: 구현
    pass

dag = daily_pipeline()
`,
      solutionCode: `# dags/dag_daily_pipeline.py

from datetime import datetime, timedelta
from typing import Dict, Any

from airflow.decorators import dag, task
from airflow.operators.trigger_dagrun import TriggerDagRunOperator
from airflow.operators.empty import EmptyOperator
from airflow.providers.slack.hooks.slack_webhook import SlackWebhookHook
from airflow.utils.trigger_rule import TriggerRule

default_args = {
    'owner': 'data-team',
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
    'email': ['data-team@company.com'],
    'email_on_failure': True,
}


def notify_pipeline_start(context):
    """Notify pipeline start."""
    execution_date = context['logical_date']
    message = f"""
:rocket: *Daily Pipeline Started*
:calendar: Date: {execution_date.strftime('%Y-%m-%d')}
:clock1: Time: {datetime.utcnow().strftime('%H:%M:%S')} UTC
    """

    try:
        hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
        hook.send(text=message)
    except Exception:
        pass


def notify_pipeline_success(context):
    """Notify pipeline completion."""
    execution_date = context['logical_date']
    duration = context.get('dag_run').get_duration() or 0

    message = f"""
:white_check_mark: *Daily Pipeline Completed*
:calendar: Date: {execution_date.strftime('%Y-%m-%d')}
:stopwatch: Duration: {duration // 60:.0f} minutes
    """

    try:
        hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
        hook.send(text=message)
    except Exception:
        pass


def notify_pipeline_failure(context):
    """Notify pipeline failure."""
    execution_date = context['logical_date']
    task_id = context['task_instance'].task_id
    exception = context.get('exception', 'Unknown error')

    message = f"""
:red_circle: *Daily Pipeline FAILED*
:calendar: Date: {execution_date.strftime('%Y-%m-%d')}
:x: Failed Task: {task_id}
:warning: Error: {str(exception)[:200]}

<https://airflow.company.com/dags/daily_pipeline|View DAG>
    """

    try:
        hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
        hook.send(text=message)
    except Exception:
        pass


def notify_sla_miss(dag, task_list, blocking_task_list, slas, blocking_tis):
    """Notify SLA miss."""
    message = f"""
:warning: *SLA Miss Alert*
:calendar: DAG: {dag.dag_id}
:clock1: Missed Tasks: {', '.join([t.task_id for t in task_list])}
:rotating_light: This requires immediate attention!
    """

    try:
        hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
        hook.send(text=message)
    except Exception:
        pass


@dag(
    dag_id='daily_pipeline',
    description='Master DAG that orchestrates the entire daily ETL pipeline',
    schedule='0 2 * * *',  # 매일 02:00 UTC
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args=default_args,
    on_success_callback=notify_pipeline_success,
    on_failure_callback=notify_pipeline_failure,
    sla_miss_callback=notify_sla_miss,
    tags=['master', 'daily', 'e2e-pipeline'],
    dagrun_timeout=timedelta(hours=6),
    max_active_runs=1,  # 동시 실행 방지
)
def daily_pipeline():
    """Master DAG that orchestrates the entire daily pipeline."""

    # Start marker
    start = EmptyOperator(
        task_id='start',
        on_execute_callback=notify_pipeline_start,
    )

    # 1. Extract all sources
    extract = TriggerDagRunOperator(
        task_id='trigger_extraction',
        trigger_dag_id='extract_all_sources',
        wait_for_completion=True,
        poke_interval=60,
        allowed_states=['success'],
        failed_states=['failed'],
        execution_date="{{ ds }}",
        reset_dag_run=True,
        sla=timedelta(hours=1),
    )

    # 2. Transform to warehouse
    transform = TriggerDagRunOperator(
        task_id='trigger_transformation',
        trigger_dag_id='transform_warehouse',
        wait_for_completion=True,
        poke_interval=60,
        allowed_states=['success'],
        failed_states=['failed'],
        execution_date="{{ ds }}",
        reset_dag_run=True,
        sla=timedelta(hours=3),
    )

    # 3. Data quality checks
    quality_check = TriggerDagRunOperator(
        task_id='trigger_quality_check',
        trigger_dag_id='data_quality_check',
        wait_for_completion=True,
        poke_interval=30,
        allowed_states=['success'],
        failed_states=['failed'],
        execution_date="{{ ds }}",
        reset_dag_run=True,
        sla=timedelta(hours=4),
    )

    # 4. Aggregate to data marts
    aggregate = TriggerDagRunOperator(
        task_id='trigger_aggregation',
        trigger_dag_id='aggregate_marts',
        wait_for_completion=True,
        poke_interval=60,
        allowed_states=['success'],
        failed_states=['failed'],
        execution_date="{{ ds }}",
        reset_dag_run=True,
        sla=timedelta(hours=5),
    )

    # End marker
    end = EmptyOperator(
        task_id='end',
        trigger_rule=TriggerRule.ALL_SUCCESS,
    )

    # Handle partial failure - still send report
    @task(trigger_rule=TriggerRule.ALL_DONE)
    def generate_daily_report(**context):
        """Generate and send daily pipeline report."""
        from airflow.models import DagRun
        import json

        execution_date = context['logical_date']
        dag_run = context['dag_run']

        # Collect status of all triggered DAGs
        triggered_dags = [
            'extract_all_sources',
            'transform_warehouse',
            'data_quality_check',
            'aggregate_marts',
        ]

        report = {
            'date': execution_date.strftime('%Y-%m-%d'),
            'master_dag_status': dag_run.state,
            'duration_minutes': (dag_run.get_duration() or 0) // 60,
            'triggered_dags': {}
        }

        for dag_id in triggered_dags:
            runs = DagRun.find(
                dag_id=dag_id,
                execution_date=execution_date,
            )
            if runs:
                run = runs[0]
                report['triggered_dags'][dag_id] = {
                    'state': run.state,
                    'duration': (run.get_duration() or 0) // 60,
                }
            else:
                report['triggered_dags'][dag_id] = {'state': 'not_run'}

        # Build report message
        dag_statuses = '\\n'.join([
            f"• {dag_id}: {info.get('state', 'unknown')} ({info.get('duration', 0):.0f} min)"
            for dag_id, info in report['triggered_dags'].items()
        ])

        message = f"""
:bar_chart: *Daily Pipeline Report*
:calendar: Date: {report['date']}
:stopwatch: Total Duration: {report['duration_minutes']} minutes

*DAG Status:*
{dag_statuses}

*Overall:* {':white_check_mark:' if report['master_dag_status'] == 'success' else ':warning:'} {report['master_dag_status'].upper()}
        """

        try:
            hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
            hook.send(text=message)
        except Exception as e:
            print(f"Failed to send report: {e}")

        return report

    report = generate_daily_report()

    # DAG flow
    start >> extract >> transform >> quality_check >> aggregate >> end
    [end, aggregate] >> report  # Report runs after end OR after aggregate


dag = daily_pipeline()


# dags/utils/notifications.py

from typing import Optional, Dict, Any, List
from datetime import datetime

from airflow.providers.slack.hooks.slack_webhook import SlackWebhookHook


class NotificationManager:
    """Centralized notification management."""

    def __init__(self, slack_conn_id: str = 'slack_webhook'):
        self.slack_conn_id = slack_conn_id

    def send_slack(
        self,
        message: str,
        channel: Optional[str] = None,
        attachments: Optional[List[Dict]] = None,
    ) -> bool:
        """Send Slack notification."""
        try:
            hook = SlackWebhookHook(slack_webhook_conn_id=self.slack_conn_id)
            hook.send(
                text=message,
                channel=channel,
                attachments=attachments,
            )
            return True
        except Exception as e:
            print(f"Slack notification failed: {e}")
            return False

    def format_error(
        self,
        dag_id: str,
        task_id: str,
        execution_date: datetime,
        error: str,
    ) -> str:
        """Format error message for notifications."""
        return f"""
:red_circle: *Task Failed*
• DAG: {dag_id}
• Task: {task_id}
• Date: {execution_date.strftime('%Y-%m-%d %H:%M')}
• Error: {error[:500]}
        """

    def format_success(
        self,
        dag_id: str,
        execution_date: datetime,
        metrics: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Format success message."""
        metrics_str = ""
        if metrics:
            metrics_str = "\\n".join([
                f"• {k}: {v:,}" if isinstance(v, (int, float)) else f"• {k}: {v}"
                for k, v in metrics.items()
            ])
            metrics_str = f"\\n*Metrics:*\\n{metrics_str}"

        return f"""
:white_check_mark: *Pipeline Complete*
• DAG: {dag_id}
• Date: {execution_date.strftime('%Y-%m-%d')}{metrics_str}
        """

    def format_sla_miss(
        self,
        dag_id: str,
        task_id: str,
        expected_time: str,
        actual_time: str,
    ) -> str:
        """Format SLA miss message."""
        return f"""
:warning: *SLA Violation*
• DAG: {dag_id}
• Task: {task_id}
• Expected: {expected_time}
• Actual: {actual_time}
• Action Required: Check task performance
        """


# dags/utils/metrics.py

from typing import Dict, Any, Optional
from datetime import datetime
import json

from airflow.models import Variable
import boto3


class MetricsCollector:
    """Collect and store pipeline metrics."""

    def __init__(
        self,
        namespace: str = "E2EPipeline",
        use_cloudwatch: bool = False,
    ):
        self.namespace = namespace
        self.use_cloudwatch = use_cloudwatch
        self._metrics_buffer = []

        if use_cloudwatch:
            self.cloudwatch = boto3.client('cloudwatch')

    def record_metric(
        self,
        name: str,
        value: float,
        unit: str = "Count",
        dimensions: Optional[Dict[str, str]] = None,
    ):
        """Record a single metric."""
        metric = {
            "name": name,
            "value": value,
            "unit": unit,
            "dimensions": dimensions or {},
            "timestamp": datetime.utcnow().isoformat(),
        }

        self._metrics_buffer.append(metric)

        if self.use_cloudwatch:
            self._send_to_cloudwatch(metric)

    def record_duration(
        self,
        task_name: str,
        duration_seconds: float,
        dimensions: Optional[Dict[str, str]] = None,
    ):
        """Record task duration."""
        self.record_metric(
            name=f"{task_name}_duration",
            value=duration_seconds,
            unit="Seconds",
            dimensions=dimensions,
        )

    def record_row_count(
        self,
        table_name: str,
        count: int,
        dimensions: Optional[Dict[str, str]] = None,
    ):
        """Record processed row count."""
        self.record_metric(
            name=f"{table_name}_rows",
            value=count,
            unit="Count",
            dimensions=dimensions,
        )

    def _send_to_cloudwatch(self, metric: Dict[str, Any]):
        """Send metric to CloudWatch."""
        try:
            dimensions = [
                {"Name": k, "Value": v}
                for k, v in metric["dimensions"].items()
            ]

            self.cloudwatch.put_metric_data(
                Namespace=self.namespace,
                MetricData=[
                    {
                        "MetricName": metric["name"],
                        "Value": metric["value"],
                        "Unit": metric["unit"],
                        "Dimensions": dimensions,
                    }
                ]
            )
        except Exception as e:
            print(f"Failed to send metric to CloudWatch: {e}")

    def get_buffer(self) -> list:
        """Get all buffered metrics."""
        return self._metrics_buffer

    def flush_to_s3(self, bucket: str, prefix: str):
        """Flush metrics buffer to S3."""
        if not self._metrics_buffer:
            return

        timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H-%M-%S")
        key = f"{prefix}/{timestamp}/metrics.json"

        s3 = boto3.client('s3')
        s3.put_object(
            Bucket=bucket,
            Key=key,
            Body=json.dumps(self._metrics_buffer),
            ContentType='application/json',
        )

        self._metrics_buffer = []
`,
      hints: [
        "TriggerDagRunOperator의 wait_for_completion=True로 동기 실행합니다",
        "trigger_rule=TriggerRule.ALL_DONE은 상위 Task 성공/실패와 무관하게 실행합니다",
        "max_active_runs=1로 동시 실행을 방지합니다",
        "sla 파라미터로 Task 완료 시간을 모니터링합니다"
      ]
    }
  },
  {
    id: 'w8d4t3',
    title: '데이터 품질 검사 DAG 구현',
    type: 'code',
    duration: 35,
    content: {
      instructions: `## 데이터 품질 검사 DAG 구현

Great Expectations 또는 커스텀 검증으로 데이터 품질을 검사하는 DAG를 구현합니다.

### 구현 요구사항

1. **dag_data_quality.py**
   - 테이블별 품질 규칙 정의
   - 검사 결과 리포팅
   - 임계값 초과 시 알림
`,
      starterCode: `# dags/dag_data_quality.py

from datetime import datetime, timedelta
from airflow.decorators import dag, task

@dag(
    dag_id='data_quality_check',
    schedule=None,
    start_date=datetime(2024, 1, 1),
)
def data_quality_check():
    """Run data quality checks on warehouse tables."""
    # TODO: 구현
    pass

dag = data_quality_check()
`,
      solutionCode: `# dags/dag_data_quality.py

from datetime import datetime, timedelta
from typing import Dict, Any, List

from airflow.decorators import dag, task, task_group
from airflow.providers.slack.hooks.slack_webhook import SlackWebhookHook
from airflow.exceptions import AirflowException

default_args = {
    'owner': 'data-team',
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}


# Quality check configurations
QUALITY_CHECKS = {
    'dim_user': {
        'not_null': ['user_id', 'email'],
        'unique': ['user_id'],
        'value_range': {
            'lifetime_value': {'min': 0, 'max': 1000000},
        },
        'pattern': {
            'email': r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$',
        },
        'freshness': {'column': 'updated_at', 'max_hours': 48},
    },
    'fact_events': {
        'not_null': ['event_id', 'event_timestamp'],
        'unique': ['event_id'],
        'referential_integrity': {
            'user_sk': {'table': 'dim_user', 'column': 'user_sk', 'allow_unknown': True},
        },
        'value_set': {
            'event_category': ['engagement', 'conversion', 'other'],
        },
    },
    'fact_payments': {
        'not_null': ['payment_id', 'amount_usd'],
        'unique': ['payment_id'],
        'value_range': {
            'amount_usd': {'min': 0, 'max': 100000},
        },
        'business_rule': {
            'successful_has_amount': "is_successful = true AND amount_usd > 0",
        },
    },
}


def notify_quality_failure(context):
    """Notify on quality check failure."""
    task_id = context['task_instance'].task_id
    exception = context.get('exception', 'Unknown error')

    message = f"""
:warning: *Data Quality Check Failed*
• Check: {task_id}
• Error: {str(exception)[:300]}
• Action: Review data quality and fix issues
    """

    try:
        hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
        hook.send(text=message)
    except Exception:
        pass


@dag(
    dag_id='data_quality_check',
    description='Run data quality checks on warehouse tables',
    schedule=None,  # Triggered by master DAG
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args=default_args,
    on_failure_callback=notify_quality_failure,
    tags=['quality', 'validation', 'e2e-pipeline'],
    dagrun_timeout=timedelta(hours=1),
)
def data_quality_check():
    """Run data quality checks on warehouse tables."""

    @task
    def check_table(table_name: str, checks: Dict[str, Any], **context) -> Dict[str, Any]:
        """Run quality checks on a single table."""
        import sys
        sys.path.insert(0, '/opt/airflow/src')

        from pyspark.sql import SparkSession
        from pyspark.sql import functions as F
        from e2e_pipeline.config import settings

        spark = SparkSession.builder \\
            .appName(f"quality_check_{table_name}") \\
            .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
            .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
            .getOrCreate()

        results = {
            'table': table_name,
            'timestamp': datetime.utcnow().isoformat(),
            'checks': [],
            'passed': True,
            'total_rows': 0,
        }

        try:
            # Read table
            table_path = f"s3a://{settings.s3_bucket}/warehouse/{table_name}"
            df = spark.read.format("delta").load(table_path)
            results['total_rows'] = df.count()

            # 1. Not Null Checks
            if 'not_null' in checks:
                for column in checks['not_null']:
                    null_count = df.filter(F.col(column).isNull()).count()
                    passed = null_count == 0

                    results['checks'].append({
                        'type': 'not_null',
                        'column': column,
                        'passed': passed,
                        'null_count': null_count,
                        'null_percentage': round(null_count / results['total_rows'] * 100, 2) if results['total_rows'] > 0 else 0,
                    })

                    if not passed:
                        results['passed'] = False

            # 2. Unique Checks
            if 'unique' in checks:
                for column in checks['unique']:
                    total = df.count()
                    distinct = df.select(column).distinct().count()
                    duplicates = total - distinct
                    passed = duplicates == 0

                    results['checks'].append({
                        'type': 'unique',
                        'column': column,
                        'passed': passed,
                        'duplicate_count': duplicates,
                    })

                    if not passed:
                        results['passed'] = False

            # 3. Value Range Checks
            if 'value_range' in checks:
                for column, range_spec in checks['value_range'].items():
                    min_val = range_spec.get('min')
                    max_val = range_spec.get('max')

                    violations = df.filter(
                        (F.col(column) < min_val) | (F.col(column) > max_val)
                    ).count()

                    passed = violations == 0

                    results['checks'].append({
                        'type': 'value_range',
                        'column': column,
                        'passed': passed,
                        'expected_min': min_val,
                        'expected_max': max_val,
                        'violations': violations,
                    })

                    if not passed:
                        results['passed'] = False

            # 4. Value Set Checks
            if 'value_set' in checks:
                for column, allowed_values in checks['value_set'].items():
                    violations = df.filter(
                        ~F.col(column).isin(allowed_values)
                    ).count()

                    passed = violations == 0

                    results['checks'].append({
                        'type': 'value_set',
                        'column': column,
                        'passed': passed,
                        'allowed_values': allowed_values,
                        'violations': violations,
                    })

                    if not passed:
                        results['passed'] = False

            # 5. Freshness Check
            if 'freshness' in checks:
                freshness_spec = checks['freshness']
                column = freshness_spec['column']
                max_hours = freshness_spec['max_hours']

                max_timestamp = df.agg(F.max(column)).collect()[0][0]

                if max_timestamp:
                    from datetime import timezone
                    now = datetime.now(timezone.utc)
                    max_ts = max_timestamp.replace(tzinfo=timezone.utc) if max_timestamp.tzinfo is None else max_timestamp
                    hours_old = (now - max_ts).total_seconds() / 3600
                    passed = hours_old <= max_hours
                else:
                    hours_old = float('inf')
                    passed = False

                results['checks'].append({
                    'type': 'freshness',
                    'column': column,
                    'passed': passed,
                    'max_hours_allowed': max_hours,
                    'hours_old': round(hours_old, 2),
                })

                if not passed:
                    results['passed'] = False

            return results

        finally:
            spark.stop()

    @task
    def aggregate_results(check_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Aggregate quality check results."""
        total_checks = sum(len(r['checks']) for r in check_results)
        passed_checks = sum(
            sum(1 for c in r['checks'] if c['passed'])
            for r in check_results
        )
        failed_checks = total_checks - passed_checks

        tables_passed = sum(1 for r in check_results if r['passed'])
        tables_failed = len(check_results) - tables_passed

        return {
            'timestamp': datetime.utcnow().isoformat(),
            'summary': {
                'total_tables': len(check_results),
                'tables_passed': tables_passed,
                'tables_failed': tables_failed,
                'total_checks': total_checks,
                'checks_passed': passed_checks,
                'checks_failed': failed_checks,
                'success_rate': round(passed_checks / total_checks * 100, 2) if total_checks > 0 else 0,
            },
            'details': check_results,
            'overall_passed': failed_checks == 0,
        }

    @task
    def send_quality_report(aggregated: Dict[str, Any], **context):
        """Send quality check report."""
        summary = aggregated['summary']
        passed = aggregated['overall_passed']

        status_emoji = ':white_check_mark:' if passed else ':x:'

        # Build failed checks detail
        failed_details = []
        for table_result in aggregated['details']:
            if not table_result['passed']:
                failed_checks = [c for c in table_result['checks'] if not c['passed']]
                for check in failed_checks[:3]:  # Limit to 3 per table
                    failed_details.append(
                        f"• {table_result['table']}.{check.get('column', 'N/A')}: {check['type']} failed"
                    )

        failed_str = '\\n'.join(failed_details[:10]) if failed_details else 'None'

        message = f"""
{status_emoji} *Data Quality Report*
:calendar: Date: {context['logical_date'].strftime('%Y-%m-%d')}

*Summary:*
• Tables: {summary['tables_passed']}/{summary['total_tables']} passed
• Checks: {summary['checks_passed']}/{summary['total_checks']} passed
• Success Rate: {summary['success_rate']}%

*Failed Checks:*
{failed_str}

{'*All checks passed!*' if passed else '*Action Required: Fix data quality issues*'}
        """

        try:
            hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
            hook.send(text=message)
        except Exception as e:
            print(f"Failed to send report: {e}")

        # Fail the task if quality checks failed (optional)
        if not passed and summary['success_rate'] < 90:  # Threshold
            raise AirflowException(
                f"Data quality below threshold: {summary['success_rate']}%"
            )

        return aggregated

    # Run checks for each table
    check_results = [
        check_table(table_name, checks)
        for table_name, checks in QUALITY_CHECKS.items()
    ]

    # Aggregate and report
    aggregated = aggregate_results(check_results)
    send_quality_report(aggregated)


dag = data_quality_check()
`,
      hints: [
        "품질 규칙을 설정 딕셔너리로 분리하면 관리가 쉽습니다",
        "success_rate 임계값으로 전체 실패 여부를 결정합니다",
        "리스트 컴프리헨션으로 여러 테이블 검사를 병렬화할 수 있습니다",
        "AirflowException을 발생시켜 DAG를 실패시킬 수 있습니다"
      ]
    }
  },
  {
    id: 'w8d4t4',
    title: 'Day 4 오케스트레이션 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'TriggerDagRunOperator의 wait_for_completion=True 설정의 효과는?',
          options: [
            '트리거된 DAG가 완료될 때까지 현재 Task가 대기한다',
            '트리거된 DAG를 백그라운드에서 실행한다',
            '트리거된 DAG가 실패해도 현재 DAG는 계속 진행한다',
            '트리거된 DAG의 결과를 XCom으로 반환한다'
          ],
          answer: 0,
          explanation: 'wait_for_completion=True로 설정하면 TriggerDagRunOperator가 트리거된 DAG가 완료될 때까지 기다립니다. 이를 통해 DAG 간 순차 실행을 보장할 수 있습니다.'
        },
        {
          question: 'SLA(Service Level Agreement) Miss Callback이 호출되는 시점은?',
          options: [
            'Task가 실패했을 때',
            'Task가 설정된 시간 내에 완료되지 않았을 때',
            'DAG 전체가 완료되었을 때',
            'Task가 재시도할 때'
          ],
          answer: 1,
          explanation: 'SLA는 Task가 예정된 시간(execution_date + sla) 내에 완료되지 않으면 sla_miss_callback을 호출합니다. Task 실패와는 별개로, 지연을 감지하는 메커니즘입니다.'
        },
        {
          question: 'max_active_runs=1 설정의 목적은?',
          options: [
            '메모리 사용량 제한',
            '동시에 여러 DAG Run이 실행되는 것을 방지',
            'Task 병렬 실행 수 제한',
            'Airflow Worker 수 제한'
          ],
          answer: 1,
          explanation: 'max_active_runs=1은 동일 DAG의 여러 인스턴스가 동시에 실행되는 것을 방지합니다. 데이터 파이프라인에서 날짜별 처리가 순차적으로 진행되어야 할 때 유용합니다.'
        },
        {
          question: '데이터 품질 검사에서 Referential Integrity 검사의 목적은?',
          options: [
            '컬럼 값이 NULL이 아닌지 확인',
            'Fact 테이블의 FK가 Dimension 테이블에 존재하는지 확인',
            '값이 허용된 범위 내인지 확인',
            '데이터가 최신인지 확인'
          ],
          answer: 1,
          explanation: 'Referential Integrity 검사는 Fact 테이블의 외래키(FK)가 참조하는 Dimension 테이블에 해당 레코드가 존재하는지 확인합니다. 데이터 정합성을 보장하는 중요한 검사입니다.'
        }
      ]
    }
  }
]
