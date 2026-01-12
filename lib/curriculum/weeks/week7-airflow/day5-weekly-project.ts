import { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'w7d5t1',
    title: '프로젝트 개요: ETL 워크플로우 자동화',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `# Week 7 프로젝트: ETL 워크플로우 자동화 시스템

## 🎯 프로젝트 목표

이번 주에 배운 Apache Airflow를 활용하여 **실제 운영 환경 수준의 ETL 파이프라인**을 구축합니다.
3개의 연계된 DAG를 설계하고, 에러 핸들링, 모니터링, 알림 시스템까지 포함한 완성된 워크플로우를 만듭니다.

## 📋 프로젝트 요구사항

### 필수 DAG 구성

| DAG 이름 | 스케줄 | 역할 |
|----------|--------|------|
| \`daily_extract\` | 매일 02:00 | 소스 시스템에서 데이터 추출 |
| \`daily_transform\` | daily_extract 완료 후 | 데이터 정제 및 변환 |
| \`weekly_report\` | 매주 월요일 09:00 | 주간 리포트 생성 |

### 아키텍처 다이어그램

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                    Airflow Scheduler                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   02:00     │  │  Trigger    │  │   Monday 09:00          │  │
│  │   Daily     │  │   After     │  │   Weekly                │  │
│  │  Extract    │──▶│  Extract   │  │   Report                │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
└─────────┼────────────────┼─────────────────────┼────────────────┘
          │                │                     │
          ▼                ▼                     ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐
   │  API/DB/S3   │  │  Spark/SQL   │  │  Report Generator    │
   │  Extraction  │  │  Transform   │  │  + Email/Slack       │
   └──────────────┘  └──────────────┘  └──────────────────────┘
\`\`\`

## 📊 데이터 시나리오

E-commerce 플랫폼의 데이터 파이프라인을 구축합니다:

### 데이터 소스
1. **주문 데이터** - PostgreSQL \`orders\` 테이블
2. **고객 데이터** - REST API (\`/api/customers\`)
3. **상품 데이터** - S3 버킷 (\`s3://raw-data/products/\`)

### 변환 규칙
- 중복 제거 및 NULL 값 처리
- 날짜 형식 표준화 (ISO 8601)
- 금액 단위 통일 (KRW → USD 환산)
- 고객 등급 계산 (RFM 기반)

### 리포트 요구사항
- 주간 매출 요약
- Top 10 상품
- 고객 세그먼트별 분석
- 이상치 탐지 결과

## 🛠️ 기술 요구사항

### 필수 구현 사항

1. **DAG 구성**
   - TaskFlow API 사용
   - XCom으로 메타데이터 전달
   - TaskGroup으로 논리적 그룹핑

2. **에러 핸들링**
   - 재시도 정책 (3회, exponential backoff)
   - 실패 콜백 (Slack 알림)
   - SLA 설정 (각 DAG별 완료 시간 제한)

3. **모니터링**
   - 커스텀 메트릭 (처리 건수, 소요 시간)
   - 로깅 표준화
   - 이상 탐지 알림

4. **데이터 품질**
   - Great Expectations 또는 커스텀 검증
   - 데이터 품질 리포트 생성
   - 임계값 초과 시 알림

## 📁 프로젝트 구조

\`\`\`
week7_project/
├── dags/
│   ├── daily_extract.py
│   ├── daily_transform.py
│   └── weekly_report.py
├── plugins/
│   ├── operators/
│   │   └── custom_operators.py
│   ├── hooks/
│   │   └── api_hook.py
│   └── callbacks/
│       └── slack_callbacks.py
├── include/
│   ├── sql/
│   │   ├── extract_orders.sql
│   │   └── transform_data.sql
│   └── templates/
│       └── report_template.html
├── tests/
│   ├── test_daily_extract.py
│   └── test_daily_transform.py
└── docker-compose.yml
\`\`\`

## 📈 평가 기준

| 항목 | 배점 | 기준 |
|------|------|------|
| DAG 설계 | 25% | 의존성, 스케줄링 정확성 |
| 에러 핸들링 | 25% | 재시도, 콜백, SLA |
| 코드 품질 | 20% | TaskFlow API, 모듈화 |
| 테스트 | 15% | 단위 테스트 커버리지 |
| 문서화 | 15% | README, 코드 주석 |

## 🚀 시작하기

\`\`\`bash
# 프로젝트 디렉토리 생성
mkdir week7_project && cd week7_project

# Docker Compose로 Airflow 환경 구성
curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.8.0/docker-compose.yaml'

# 디렉토리 초기화
mkdir -p ./dags ./logs ./plugins ./include

# 환경 변수 설정
echo "AIRFLOW_UID=$(id -u)" > .env

# Airflow 시작
docker compose up -d
\`\`\`
`,
      externalLinks: [
        { title: 'Airflow Best Practices', url: 'https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html' },
        { title: 'TaskFlow API', url: 'https://airflow.apache.org/docs/apache-airflow/stable/tutorial/taskflow.html' },
        { title: 'Testing DAGs', url: 'https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html#testing-a-dag' }
      ]
    }
  },
  {
    id: 'w7d5t2',
    title: 'DAG 1: Daily Extract 구현',
    type: 'code',
    duration: 45,
    content: {
      instructions: `## DAG 1: Daily Extract 구현

매일 02:00에 실행되어 3개 소스에서 데이터를 추출하는 DAG를 구현합니다.

### 구현 요구사항

1. **TaskFlow API 사용**
   - @task 데코레이터로 함수 정의
   - XCom으로 추출 메타데이터 자동 전달

2. **병렬 추출**
   - DB, API, S3 추출을 병렬로 실행
   - TaskGroup으로 그룹핑

3. **에러 핸들링**
   - 재시도 3회 (5분, 15분, 45분 대기)
   - 실패 시 Slack 알림

4. **메타데이터 수집**
   - 각 소스별 추출 건수
   - 소요 시간
   - 다음 DAG로 전달

### 테스트 방법

\`\`\`bash
# DAG 문법 검사
python -c "from daily_extract import dag; print('DAG loaded!')"

# 테스트 실행
airflow dags test daily_extract 2024-01-01
\`\`\`
`,
      starterCode: `"""
DAG: Daily Extract
매일 02:00에 소스 시스템에서 데이터 추출
"""

from datetime import datetime, timedelta
from airflow.decorators import dag, task, task_group
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from airflow.providers.http.hooks.http import HttpHook
from airflow.models import Variable
import json
import logging

logger = logging.getLogger(__name__)

# 기본 설정
default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'email_on_failure': True,
    'email': ['data-team@company.com'],
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'retry_exponential_backoff': True,
    'max_retry_delay': timedelta(hours=1),
}

def slack_failure_callback(context):
    """Slack 알림 콜백"""
    # TODO: Slack 알림 구현
    pass


@dag(
    dag_id='daily_extract',
    description='소스 시스템에서 일일 데이터 추출',
    # TODO: 스케줄 설정 (매일 02:00 UTC)
    schedule=None,
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=['extract', 'daily', 'etl'],
    # TODO: SLA 설정
)
def daily_extract():
    """Daily Extract DAG"""

    @task_group(group_id='extract_sources')
    def extract_all_sources():
        """데이터 소스에서 병렬 추출"""

        @task
        def extract_orders():
            """PostgreSQL에서 주문 데이터 추출"""
            # TODO: PostgresHook 사용하여 데이터 추출
            # 힌트: hook.get_pandas_df() 사용

            hook = PostgresHook(postgres_conn_id='source_postgres')

            # 어제 날짜의 데이터만 추출
            query = """
                SELECT * FROM orders
                WHERE order_date = CURRENT_DATE - INTERVAL '1 day'
            """

            # 데이터 추출 및 S3에 저장
            # ...

            return {
                'source': 'orders',
                'count': 0,  # TODO: 실제 건수
                'destination': 's3://data-lake/raw/orders/'
            }

        @task
        def extract_customers():
            """REST API에서 고객 데이터 추출"""
            # TODO: HttpHook 사용하여 API 호출
            pass

        @task
        def extract_products():
            """S3에서 상품 데이터 추출"""
            # TODO: S3Hook 사용하여 파일 복사
            pass

        # 병렬 실행
        return [extract_orders(), extract_customers(), extract_products()]

    @task
    def validate_extracts(extract_results: list):
        """추출 결과 검증"""
        # TODO: 각 소스의 추출 결과 검증
        # 건수 0이면 경고
        # 전일 대비 급격한 변화 감지
        pass

    @task
    def notify_completion(validation_result):
        """추출 완료 알림 및 다음 DAG 트리거"""
        # TODO: 메타데이터를 XCom에 저장
        # TriggerDagRunOperator 대신 XCom 사용
        pass

    # DAG 흐름 정의
    extracts = extract_all_sources()
    validated = validate_extracts(extracts)
    notify_completion(validated)


# DAG 인스턴스 생성
dag = daily_extract()
`,
      solutionCode: `"""
DAG: Daily Extract
매일 02:00에 소스 시스템에서 데이터 추출
"""

from datetime import datetime, timedelta
from airflow.decorators import dag, task, task_group
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from airflow.providers.http.hooks.http import HttpHook
from airflow.providers.slack.hooks.slack_webhook import SlackWebhookHook
from airflow.models import Variable
from airflow.exceptions import AirflowSkipException
import json
import logging
import pandas as pd
from io import StringIO

logger = logging.getLogger(__name__)

# 기본 설정
default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'email_on_failure': True,
    'email': ['data-team@company.com'],
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'retry_exponential_backoff': True,
    'max_retry_delay': timedelta(hours=1),
}


def slack_failure_callback(context):
    """Slack 알림 콜백"""
    task_instance = context['task_instance']
    dag_id = context['dag'].dag_id
    task_id = task_instance.task_id
    execution_date = context['execution_date']
    exception = context.get('exception', 'Unknown error')

    message = f"""
:red_circle: *DAG 실패 알림*
• DAG: {dag_id}
• Task: {task_id}
• 실행 시간: {execution_date}
• 에러: {str(exception)[:200]}
    """

    try:
        hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
        hook.send(text=message)
    except Exception as e:
        logger.error(f"Slack 알림 실패: {e}")


def slack_success_callback(context):
    """성공 알림 콜백"""
    dag_id = context['dag'].dag_id
    execution_date = context['execution_date']

    message = f"""
:white_check_mark: *DAG 완료*
• DAG: {dag_id}
• 실행 시간: {execution_date}
    """

    try:
        hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
        hook.send(text=message)
    except Exception as e:
        logger.error(f"Slack 알림 실패: {e}")


@dag(
    dag_id='daily_extract',
    description='소스 시스템에서 일일 데이터 추출',
    schedule='0 2 * * *',  # 매일 02:00 UTC
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=['extract', 'daily', 'etl'],
    on_failure_callback=slack_failure_callback,
    on_success_callback=slack_success_callback,
    sla_miss_callback=slack_failure_callback,
    dagrun_timeout=timedelta(hours=2),
)
def daily_extract():
    """Daily Extract DAG"""

    @task_group(group_id='extract_sources')
    def extract_all_sources():
        """데이터 소스에서 병렬 추출"""

        @task(
            retries=3,
            retry_delay=timedelta(minutes=5),
            sla=timedelta(hours=1),
        )
        def extract_orders(**context):
            """PostgreSQL에서 주문 데이터 추출"""
            execution_date = context['logical_date']
            target_date = (execution_date - timedelta(days=1)).strftime('%Y-%m-%d')

            logger.info(f"Extracting orders for date: {target_date}")

            # PostgreSQL에서 데이터 추출
            pg_hook = PostgresHook(postgres_conn_id='source_postgres')

            query = f"""
                SELECT
                    order_id,
                    customer_id,
                    product_id,
                    quantity,
                    unit_price,
                    total_amount,
                    order_date,
                    status,
                    created_at
                FROM orders
                WHERE order_date = '{target_date}'
            """

            df = pg_hook.get_pandas_df(query)
            row_count = len(df)

            logger.info(f"Extracted {row_count} orders")

            # S3에 저장
            if row_count > 0:
                s3_hook = S3Hook(aws_conn_id='aws_default')
                csv_buffer = StringIO()
                df.to_csv(csv_buffer, index=False)

                s3_key = f"raw/orders/dt={target_date}/orders.csv"
                s3_hook.load_string(
                    string_data=csv_buffer.getvalue(),
                    key=s3_key,
                    bucket_name='data-lake',
                    replace=True
                )

                destination = f"s3://data-lake/{s3_key}"
            else:
                destination = None
                logger.warning("No orders found for extraction")

            return {
                'source': 'orders',
                'count': row_count,
                'destination': destination,
                'target_date': target_date
            }

        @task(
            retries=3,
            retry_delay=timedelta(minutes=5),
            sla=timedelta(hours=1),
        )
        def extract_customers(**context):
            """REST API에서 고객 데이터 추출"""
            execution_date = context['logical_date']
            target_date = (execution_date - timedelta(days=1)).strftime('%Y-%m-%d')

            logger.info(f"Extracting customers updated on: {target_date}")

            http_hook = HttpHook(http_conn_id='customer_api', method='GET')

            # 페이징 처리
            all_customers = []
            page = 1
            page_size = 100

            while True:
                response = http_hook.run(
                    endpoint='/api/customers',
                    data={
                        'updated_since': target_date,
                        'page': page,
                        'page_size': page_size
                    }
                )

                data = response.json()
                customers = data.get('customers', [])

                if not customers:
                    break

                all_customers.extend(customers)
                page += 1

                if len(customers) < page_size:
                    break

            row_count = len(all_customers)
            logger.info(f"Extracted {row_count} customers")

            # S3에 저장
            if row_count > 0:
                s3_hook = S3Hook(aws_conn_id='aws_default')
                s3_key = f"raw/customers/dt={target_date}/customers.json"

                s3_hook.load_string(
                    string_data=json.dumps(all_customers, ensure_ascii=False),
                    key=s3_key,
                    bucket_name='data-lake',
                    replace=True
                )

                destination = f"s3://data-lake/{s3_key}"
            else:
                destination = None

            return {
                'source': 'customers',
                'count': row_count,
                'destination': destination,
                'target_date': target_date
            }

        @task(
            retries=3,
            retry_delay=timedelta(minutes=5),
            sla=timedelta(hours=1),
        )
        def extract_products(**context):
            """S3에서 상품 데이터 복사 (소스 → 데이터 레이크)"""
            execution_date = context['logical_date']
            target_date = (execution_date - timedelta(days=1)).strftime('%Y-%m-%d')

            logger.info(f"Copying products for date: {target_date}")

            s3_hook = S3Hook(aws_conn_id='aws_default')

            # 소스 버킷에서 파일 목록 조회
            source_prefix = f"raw-products/dt={target_date}/"
            keys = s3_hook.list_keys(
                bucket_name='source-bucket',
                prefix=source_prefix
            )

            if not keys:
                logger.warning(f"No product files found for {target_date}")
                return {
                    'source': 'products',
                    'count': 0,
                    'destination': None,
                    'target_date': target_date
                }

            # 파일 복사
            copied_count = 0
            for key in keys:
                dest_key = key.replace('raw-products/', 'raw/products/')

                s3_hook.copy_object(
                    source_bucket_key=key,
                    source_bucket_name='source-bucket',
                    dest_bucket_key=dest_key,
                    dest_bucket_name='data-lake'
                )
                copied_count += 1

            logger.info(f"Copied {copied_count} product files")

            return {
                'source': 'products',
                'count': copied_count,
                'destination': f"s3://data-lake/raw/products/dt={target_date}/",
                'target_date': target_date
            }

        # 병렬 실행
        return [extract_orders(), extract_customers(), extract_products()]

    @task
    def validate_extracts(extract_results: list):
        """추출 결과 검증"""
        logger.info(f"Validating {len(extract_results)} extracts")

        validation_result = {
            'status': 'success',
            'total_records': 0,
            'sources': [],
            'warnings': [],
            'errors': []
        }

        for result in extract_results:
            source = result['source']
            count = result['count']

            validation_result['sources'].append({
                'source': source,
                'count': count,
                'destination': result.get('destination')
            })

            validation_result['total_records'] += count

            # 건수 검증
            if count == 0:
                validation_result['warnings'].append(
                    f"{source}: 추출된 데이터 없음"
                )

            # 최소 건수 체크 (orders는 최소 100건 기대)
            if source == 'orders' and 0 < count < 100:
                validation_result['warnings'].append(
                    f"{source}: 예상보다 적은 건수 ({count}건)"
                )

        if validation_result['errors']:
            validation_result['status'] = 'failed'
        elif validation_result['warnings']:
            validation_result['status'] = 'warning'

        logger.info(f"Validation result: {validation_result['status']}")

        return validation_result

    @task
    def notify_completion(validation_result: dict, **context):
        """추출 완료 알림 및 메타데이터 저장"""
        execution_date = context['logical_date']

        # 결과 로깅
        logger.info(f"Extract completed: {validation_result}")

        # 경고가 있으면 Slack 알림
        if validation_result.get('warnings'):
            try:
                hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
                message = f"""
:warning: *Daily Extract 경고*
• 실행 시간: {execution_date}
• 총 추출 건수: {validation_result['total_records']:,}
• 경고: {', '.join(validation_result['warnings'])}
                """
                hook.send(text=message)
            except Exception as e:
                logger.error(f"Slack 알림 실패: {e}")

        # 다음 DAG를 위한 메타데이터 반환
        return {
            'execution_date': str(execution_date),
            'total_records': validation_result['total_records'],
            'sources': validation_result['sources'],
            'status': validation_result['status']
        }

    # DAG 흐름 정의
    extracts = extract_all_sources()
    validated = validate_extracts(extracts)
    notify_completion(validated)


# DAG 인스턴스 생성
dag = daily_extract()
`,
      hints: [
        "TaskFlow API에서 @task 함수의 반환값은 자동으로 XCom에 저장됩니다",
        "병렬 실행을 위해 리스트로 반환하면 동시에 실행됩니다",
        "sla 파라미터로 각 Task의 완료 시간 제한을 설정할 수 있습니다",
        "PostgresHook.get_pandas_df()로 쉽게 DataFrame으로 변환할 수 있습니다"
      ]
    }
  },
  {
    id: 'w7d5t3',
    title: 'DAG 2: Daily Transform 구현',
    type: 'code',
    duration: 45,
    content: {
      instructions: `## DAG 2: Daily Transform 구현

Daily Extract가 완료된 후 자동으로 트리거되어 데이터 변환을 수행하는 DAG를 구현합니다.

### 구현 요구사항

1. **DAG 의존성**
   - Dataset 또는 ExternalTaskSensor로 daily_extract 완료 대기
   - 추출 메타데이터 활용

2. **변환 로직**
   - 데이터 정제 (NULL 처리, 중복 제거)
   - 형식 변환 (날짜, 금액)
   - 파생 컬럼 생성 (고객 등급 등)

3. **데이터 품질 검증**
   - 스키마 검증
   - 비즈니스 규칙 검증
   - 이상치 탐지

4. **출력**
   - Parquet 형식으로 저장
   - 파티션 구성 (date, category)
`,
      starterCode: `"""
DAG: Daily Transform
Daily Extract 완료 후 데이터 변환 수행
"""

from datetime import datetime, timedelta
from airflow.decorators import dag, task, task_group
from airflow.sensors.external_task import ExternalTaskSensor
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
import pandas as pd
import logging

logger = logging.getLogger(__name__)

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=10),
}


@dag(
    dag_id='daily_transform',
    description='추출된 데이터 변환 및 정제',
    schedule=None,  # TODO: daily_extract 완료 후 트리거
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=['transform', 'daily', 'etl'],
)
def daily_transform():
    """Daily Transform DAG"""

    # TODO: ExternalTaskSensor로 daily_extract 완료 대기
    wait_for_extract = ExternalTaskSensor(
        task_id='wait_for_extract',
        external_dag_id='daily_extract',
        external_task_id='notify_completion',
        mode='poke',
        timeout=3600,
        poke_interval=60,
    )

    @task_group(group_id='transform_data')
    def transform_all():
        """데이터 변환 그룹"""

        @task
        def transform_orders(**context):
            """주문 데이터 변환"""
            # TODO: 구현
            # 1. S3에서 raw 데이터 읽기
            # 2. 데이터 정제
            # 3. 파생 컬럼 생성
            # 4. Parquet으로 저장
            pass

        @task
        def transform_customers(**context):
            """고객 데이터 변환"""
            # TODO: 구현
            pass

        @task
        def enrich_data(orders, customers):
            """데이터 통합 및 보강"""
            # TODO: 주문-고객 조인
            # RFM 점수 계산
            pass

        orders = transform_orders()
        customers = transform_customers()
        return enrich_data(orders, customers)

    @task
    def validate_quality(enriched_data):
        """데이터 품질 검증"""
        # TODO: Great Expectations 또는 커스텀 검증
        pass

    @task
    def save_to_datamart(validated_data):
        """DataMart에 저장"""
        # TODO: 최종 데이터 저장
        pass

    # DAG 흐름
    transformed = transform_all()
    wait_for_extract >> transformed
    validated = validate_quality(transformed)
    save_to_datamart(validated)


dag = daily_transform()
`,
      solutionCode: `"""
DAG: Daily Transform
Daily Extract 완료 후 데이터 변환 수행
"""

from datetime import datetime, timedelta
from airflow.decorators import dag, task, task_group
from airflow.sensors.external_task import ExternalTaskSensor
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from airflow.providers.slack.hooks.slack_webhook import SlackWebhookHook
import pandas as pd
import json
import logging
from io import BytesIO, StringIO

logger = logging.getLogger(__name__)

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=10),
    'retry_exponential_backoff': True,
}


def slack_failure_callback(context):
    """Slack 실패 알림"""
    task_instance = context['task_instance']
    dag_id = context['dag'].dag_id

    message = f":red_circle: *Transform 실패* - {dag_id}/{task_instance.task_id}"

    try:
        hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
        hook.send(text=message)
    except Exception as e:
        logger.error(f"Slack 알림 실패: {e}")


@dag(
    dag_id='daily_transform',
    description='추출된 데이터 변환 및 정제',
    schedule=None,  # ExternalTaskSensor로 트리거
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=['transform', 'daily', 'etl'],
    on_failure_callback=slack_failure_callback,
    dagrun_timeout=timedelta(hours=3),
)
def daily_transform():
    """Daily Transform DAG"""

    # daily_extract 완료 대기
    wait_for_extract = ExternalTaskSensor(
        task_id='wait_for_extract',
        external_dag_id='daily_extract',
        external_task_id='notify_completion',
        mode='reschedule',  # 슬롯 점유 방지
        timeout=7200,
        poke_interval=120,
        allowed_states=['success'],
        failed_states=['failed', 'skipped'],
    )

    @task
    def get_extract_metadata(**context):
        """추출 메타데이터 가져오기"""
        from airflow.models import DagRun, TaskInstance

        execution_date = context['logical_date']

        # daily_extract의 마지막 성공 실행에서 메타데이터 조회
        dag_run = DagRun.find(
            dag_id='daily_extract',
            state='success',
            execution_date=execution_date
        )

        if dag_run:
            ti = TaskInstance(
                task=context['task'],
                run_id=dag_run[0].run_id
            )
            # XCom에서 메타데이터 조회
            metadata = ti.xcom_pull(
                dag_id='daily_extract',
                task_ids='notify_completion'
            )
            return metadata

        # 기본 메타데이터 반환
        target_date = (execution_date - timedelta(days=1)).strftime('%Y-%m-%d')
        return {'target_date': target_date, 'sources': []}

    @task_group(group_id='transform_data')
    def transform_all(metadata: dict):
        """데이터 변환 그룹"""

        @task
        def transform_orders(metadata: dict, **context):
            """주문 데이터 변환"""
            target_date = metadata.get('target_date',
                (context['logical_date'] - timedelta(days=1)).strftime('%Y-%m-%d'))

            logger.info(f"Transforming orders for {target_date}")

            s3_hook = S3Hook(aws_conn_id='aws_default')

            # Raw 데이터 읽기
            raw_key = f"raw/orders/dt={target_date}/orders.csv"

            try:
                csv_content = s3_hook.read_key(
                    key=raw_key,
                    bucket_name='data-lake'
                )
                df = pd.read_csv(StringIO(csv_content))
            except Exception as e:
                logger.warning(f"No orders data found: {e}")
                return {'count': 0, 'path': None}

            logger.info(f"Raw orders: {len(df)} rows")

            # 1. 중복 제거
            df = df.drop_duplicates(subset=['order_id'])

            # 2. NULL 처리
            df['status'] = df['status'].fillna('unknown')
            df['quantity'] = df['quantity'].fillna(0).astype(int)

            # 3. 날짜 형식 표준화
            df['order_date'] = pd.to_datetime(df['order_date']).dt.strftime('%Y-%m-%d')
            df['created_at'] = pd.to_datetime(df['created_at']).dt.strftime('%Y-%m-%dT%H:%M:%S')

            # 4. 금액 계산 검증
            df['calculated_total'] = df['quantity'] * df['unit_price']
            df['amount_mismatch'] = abs(df['total_amount'] - df['calculated_total']) > 0.01

            # 5. 파생 컬럼 생성
            df['order_year'] = pd.to_datetime(df['order_date']).dt.year
            df['order_month'] = pd.to_datetime(df['order_date']).dt.month
            df['order_weekday'] = pd.to_datetime(df['order_date']).dt.dayofweek

            # 6. 이상치 플래그
            q1 = df['total_amount'].quantile(0.25)
            q3 = df['total_amount'].quantile(0.75)
            iqr = q3 - q1
            df['is_outlier'] = (df['total_amount'] < q1 - 1.5 * iqr) | (df['total_amount'] > q3 + 1.5 * iqr)

            logger.info(f"Transformed orders: {len(df)} rows, {df['is_outlier'].sum()} outliers")

            # Parquet으로 저장
            parquet_buffer = BytesIO()
            df.to_parquet(parquet_buffer, index=False, engine='pyarrow')

            dest_key = f"transformed/orders/dt={target_date}/orders.parquet"
            s3_hook.load_bytes(
                bytes_data=parquet_buffer.getvalue(),
                key=dest_key,
                bucket_name='data-lake',
                replace=True
            )

            return {
                'count': len(df),
                'path': f"s3://data-lake/{dest_key}",
                'outliers': int(df['is_outlier'].sum()),
                'mismatches': int(df['amount_mismatch'].sum())
            }

        @task
        def transform_customers(metadata: dict, **context):
            """고객 데이터 변환"""
            target_date = metadata.get('target_date',
                (context['logical_date'] - timedelta(days=1)).strftime('%Y-%m-%d'))

            logger.info(f"Transforming customers for {target_date}")

            s3_hook = S3Hook(aws_conn_id='aws_default')

            # Raw 데이터 읽기
            raw_key = f"raw/customers/dt={target_date}/customers.json"

            try:
                json_content = s3_hook.read_key(
                    key=raw_key,
                    bucket_name='data-lake'
                )
                customers = json.loads(json_content)
                df = pd.DataFrame(customers)
            except Exception as e:
                logger.warning(f"No customers data found: {e}")
                return {'count': 0, 'path': None}

            logger.info(f"Raw customers: {len(df)} rows")

            # 1. 중복 제거
            df = df.drop_duplicates(subset=['customer_id'])

            # 2. 이름 정규화
            df['name'] = df['name'].str.strip().str.title()

            # 3. 이메일 검증
            df['email_valid'] = df['email'].str.contains(
                r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',
                regex=True,
                na=False
            )

            # 4. 날짜 형식 표준화
            df['created_at'] = pd.to_datetime(df['created_at']).dt.strftime('%Y-%m-%dT%H:%M:%S')

            # 5. 고객 세그먼트 (간단한 버전)
            df['segment'] = pd.cut(
                df.get('total_orders', pd.Series([0] * len(df))),
                bins=[-1, 0, 5, 20, float('inf')],
                labels=['new', 'bronze', 'silver', 'gold']
            )

            logger.info(f"Transformed customers: {len(df)} rows")

            # Parquet으로 저장
            parquet_buffer = BytesIO()
            df.to_parquet(parquet_buffer, index=False, engine='pyarrow')

            dest_key = f"transformed/customers/dt={target_date}/customers.parquet"
            s3_hook.load_bytes(
                bytes_data=parquet_buffer.getvalue(),
                key=dest_key,
                bucket_name='data-lake',
                replace=True
            )

            return {
                'count': len(df),
                'path': f"s3://data-lake/{dest_key}",
                'invalid_emails': int((~df['email_valid']).sum())
            }

        @task
        def enrich_data(orders_result: dict, customers_result: dict, **context):
            """데이터 통합 및 RFM 점수 계산"""
            target_date = (context['logical_date'] - timedelta(days=1)).strftime('%Y-%m-%d')

            if not orders_result.get('path') or not customers_result.get('path'):
                logger.warning("No data to enrich")
                return {'count': 0, 'path': None}

            s3_hook = S3Hook(aws_conn_id='aws_default')

            # 변환된 데이터 읽기
            orders_content = s3_hook.read_key(
                key=f"transformed/orders/dt={target_date}/orders.parquet",
                bucket_name='data-lake'
            )
            orders_df = pd.read_parquet(BytesIO(orders_content.encode() if isinstance(orders_content, str) else orders_content))

            customers_content = s3_hook.read_key(
                key=f"transformed/customers/dt={target_date}/customers.parquet",
                bucket_name='data-lake'
            )
            customers_df = pd.read_parquet(BytesIO(customers_content.encode() if isinstance(customers_content, str) else customers_content))

            # 주문-고객 조인
            enriched_df = orders_df.merge(
                customers_df[['customer_id', 'name', 'email', 'segment']],
                on='customer_id',
                how='left'
            )

            # RFM 점수 계산을 위한 집계
            rfm_df = orders_df.groupby('customer_id').agg({
                'order_date': 'max',  # Recency
                'order_id': 'count',  # Frequency
                'total_amount': 'sum'  # Monetary
            }).reset_index()

            rfm_df.columns = ['customer_id', 'last_order_date', 'order_count', 'total_spent']

            # RFM 점수 (1-5)
            rfm_df['r_score'] = pd.qcut(
                pd.to_datetime(rfm_df['last_order_date']).rank(ascending=True),
                5, labels=[1, 2, 3, 4, 5], duplicates='drop'
            )
            rfm_df['f_score'] = pd.qcut(
                rfm_df['order_count'].rank(ascending=True),
                5, labels=[1, 2, 3, 4, 5], duplicates='drop'
            )
            rfm_df['m_score'] = pd.qcut(
                rfm_df['total_spent'].rank(ascending=True),
                5, labels=[1, 2, 3, 4, 5], duplicates='drop'
            )

            # RFM 점수 저장
            rfm_buffer = BytesIO()
            rfm_df.to_parquet(rfm_buffer, index=False, engine='pyarrow')

            rfm_key = f"analytics/rfm/dt={target_date}/rfm_scores.parquet"
            s3_hook.load_bytes(
                bytes_data=rfm_buffer.getvalue(),
                key=rfm_key,
                bucket_name='data-lake',
                replace=True
            )

            # Enriched 데이터 저장
            enriched_buffer = BytesIO()
            enriched_df.to_parquet(enriched_buffer, index=False, engine='pyarrow')

            enriched_key = f"enriched/orders/dt={target_date}/orders_enriched.parquet"
            s3_hook.load_bytes(
                bytes_data=enriched_buffer.getvalue(),
                key=enriched_key,
                bucket_name='data-lake',
                replace=True
            )

            logger.info(f"Enriched {len(enriched_df)} orders with customer data")

            return {
                'count': len(enriched_df),
                'path': f"s3://data-lake/{enriched_key}",
                'rfm_path': f"s3://data-lake/{rfm_key}",
                'unique_customers': len(rfm_df)
            }

        orders = transform_orders(metadata)
        customers = transform_customers(metadata)
        return enrich_data(orders, customers)

    @task
    def validate_quality(enriched_result: dict, **context):
        """데이터 품질 검증"""
        if not enriched_result.get('path'):
            logger.warning("No data to validate")
            return {'status': 'skipped', 'checks': []}

        target_date = (context['logical_date'] - timedelta(days=1)).strftime('%Y-%m-%d')

        s3_hook = S3Hook(aws_conn_id='aws_default')

        # Enriched 데이터 읽기
        content = s3_hook.read_key(
            key=f"enriched/orders/dt={target_date}/orders_enriched.parquet",
            bucket_name='data-lake'
        )
        df = pd.read_parquet(BytesIO(content.encode() if isinstance(content, str) else content))

        checks = []

        # 1. NULL 체크
        null_counts = df.isnull().sum()
        critical_nulls = null_counts[['order_id', 'customer_id', 'total_amount']]

        checks.append({
            'name': 'critical_columns_not_null',
            'passed': critical_nulls.sum() == 0,
            'details': critical_nulls.to_dict()
        })

        # 2. 고유성 체크
        duplicate_orders = df['order_id'].duplicated().sum()
        checks.append({
            'name': 'order_id_unique',
            'passed': duplicate_orders == 0,
            'details': {'duplicate_count': int(duplicate_orders)}
        })

        # 3. 범위 체크
        negative_amounts = (df['total_amount'] < 0).sum()
        checks.append({
            'name': 'amount_positive',
            'passed': negative_amounts == 0,
            'details': {'negative_count': int(negative_amounts)}
        })

        # 4. 조인 성공률
        missing_customer_info = df['name'].isnull().sum()
        join_success_rate = (len(df) - missing_customer_info) / len(df) * 100
        checks.append({
            'name': 'customer_join_success',
            'passed': join_success_rate > 95,
            'details': {'success_rate': round(join_success_rate, 2)}
        })

        all_passed = all(c['passed'] for c in checks)

        result = {
            'status': 'passed' if all_passed else 'failed',
            'checks': checks,
            'total_records': len(df),
            'target_date': target_date
        }

        logger.info(f"Quality validation: {result['status']}")

        return result

    @task
    def save_to_datamart(validation_result: dict, **context):
        """DataMart에 최종 데이터 저장"""
        if validation_result['status'] != 'passed':
            failed_checks = [c['name'] for c in validation_result['checks'] if not c['passed']]
            logger.warning(f"Quality checks failed: {failed_checks}")
            # 여전히 저장하되 경고 플래그 추가

        target_date = validation_result.get('target_date',
            (context['logical_date'] - timedelta(days=1)).strftime('%Y-%m-%d'))

        s3_hook = S3Hook(aws_conn_id='aws_default')

        # Enriched → DataMart 복사
        source_key = f"enriched/orders/dt={target_date}/orders_enriched.parquet"
        dest_key = f"datamart/orders/dt={target_date}/orders.parquet"

        try:
            s3_hook.copy_object(
                source_bucket_key=source_key,
                source_bucket_name='data-lake',
                dest_bucket_key=dest_key,
                dest_bucket_name='data-lake'
            )

            logger.info(f"Saved to datamart: {dest_key}")

            return {
                'status': 'success',
                'path': f"s3://data-lake/{dest_key}",
                'records': validation_result['total_records'],
                'quality_status': validation_result['status']
            }
        except Exception as e:
            logger.error(f"Failed to save to datamart: {e}")
            raise

    # DAG 흐름
    metadata = get_extract_metadata()
    wait_for_extract >> metadata

    transformed = transform_all(metadata)
    validated = validate_quality(transformed)
    save_to_datamart(validated)


dag = daily_transform()
`,
      hints: [
        "ExternalTaskSensor의 mode='reschedule'은 대기 중 워커 슬롯을 해제합니다",
        "pd.read_parquet()으로 Parquet 파일을 직접 읽을 수 있습니다",
        "RFM 점수는 Recency(최근성), Frequency(빈도), Monetary(금액)의 약자입니다",
        "품질 검증 실패 시에도 데이터를 저장하되 플래그로 표시하는 것이 좋습니다"
      ]
    }
  },
  {
    id: 'w7d5t4',
    title: 'DAG 3: Weekly Report 구현',
    type: 'code',
    duration: 40,
    content: {
      instructions: `## DAG 3: Weekly Report 구현

매주 월요일 09:00에 실행되어 주간 리포트를 생성하고 Slack/Email로 전송하는 DAG를 구현합니다.

### 구현 요구사항

1. **리포트 내용**
   - 주간 매출 요약
   - Top 10 상품
   - 고객 세그먼트별 분석
   - 이상치 요약

2. **출력 형식**
   - HTML 리포트 (S3 저장)
   - Slack 요약 메시지
   - Email 첨부 (옵션)

3. **시각화**
   - matplotlib/plotly로 차트 생성
   - 리포트에 이미지 포함
`,
      starterCode: `"""
DAG: Weekly Report
매주 월요일 09:00에 주간 리포트 생성
"""

from datetime import datetime, timedelta
from airflow.decorators import dag, task
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from airflow.providers.slack.hooks.slack_webhook import SlackWebhookHook
import pandas as pd
import logging

logger = logging.getLogger(__name__)

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}


@dag(
    dag_id='weekly_report',
    description='주간 비즈니스 리포트 생성',
    # TODO: 매주 월요일 09:00 UTC 스케줄
    schedule=None,
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=['report', 'weekly', 'analytics'],
)
def weekly_report():
    """Weekly Report DAG"""

    @task
    def calculate_metrics(**context):
        """주간 메트릭 계산"""
        # TODO: 지난 7일간의 데이터 집계
        # - 총 매출
        # - 주문 건수
        # - 신규 고객 수
        # - 평균 주문 금액
        pass

    @task
    def generate_charts(metrics: dict):
        """차트 생성"""
        # TODO: matplotlib/plotly로 차트 생성
        # - 일별 매출 추이
        # - 카테고리별 매출 비중
        # - Top 10 상품
        pass

    @task
    def create_report(metrics: dict, charts: dict):
        """HTML 리포트 생성"""
        # TODO: Jinja2 템플릿으로 리포트 생성
        pass

    @task
    def send_slack_summary(metrics: dict):
        """Slack 요약 전송"""
        # TODO: Slack 메시지 포맷팅 및 전송
        pass

    @task
    def save_report(report_html: str, **context):
        """S3에 리포트 저장"""
        # TODO: S3에 HTML 리포트 저장
        pass

    # DAG 흐름
    metrics = calculate_metrics()
    charts = generate_charts(metrics)
    report = create_report(metrics, charts)

    # 병렬 실행
    [send_slack_summary(metrics), save_report(report)]


dag = weekly_report()
`,
      solutionCode: `"""
DAG: Weekly Report
매주 월요일 09:00에 주간 리포트 생성
"""

from datetime import datetime, timedelta
from airflow.decorators import dag, task
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from airflow.providers.slack.hooks.slack_webhook import SlackWebhookHook
import pandas as pd
import json
import base64
import logging
from io import BytesIO, StringIO
from jinja2 import Template

logger = logging.getLogger(__name__)

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

REPORT_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Weekly Report - {{ week_start }} ~ {{ week_end }}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; border-bottom: 2px solid #4CAF50; }
        h2 { color: #666; margin-top: 30px; }
        .metric-card {
            display: inline-block;
            padding: 20px;
            margin: 10px;
            background: #f5f5f5;
            border-radius: 8px;
            min-width: 150px;
            text-align: center;
        }
        .metric-value { font-size: 24px; font-weight: bold; color: #4CAF50; }
        .metric-label { color: #666; margin-top: 5px; }
        .trend-up { color: #4CAF50; }
        .trend-down { color: #f44336; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background: #4CAF50; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
        .chart { margin: 20px 0; text-align: center; }
        .footer { margin-top: 40px; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <h1>📊 주간 비즈니스 리포트</h1>
    <p>기간: {{ week_start }} ~ {{ week_end }}</p>

    <h2>📈 주요 지표</h2>
    <div class="metrics">
        <div class="metric-card">
            <div class="metric-value">{{ "{:,.0f}".format(metrics.total_revenue) }}원</div>
            <div class="metric-label">총 매출</div>
            <div class="{{ 'trend-up' if metrics.revenue_growth > 0 else 'trend-down' }}">
                {{ "+" if metrics.revenue_growth > 0 else "" }}{{ "{:.1f}".format(metrics.revenue_growth) }}%
            </div>
        </div>
        <div class="metric-card">
            <div class="metric-value">{{ "{:,}".format(metrics.total_orders) }}</div>
            <div class="metric-label">주문 건수</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">{{ "{:,}".format(metrics.new_customers) }}</div>
            <div class="metric-label">신규 고객</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">{{ "{:,.0f}".format(metrics.avg_order_value) }}원</div>
            <div class="metric-label">평균 주문 금액</div>
        </div>
    </div>

    <h2>🏆 Top 10 상품</h2>
    <table>
        <tr>
            <th>순위</th>
            <th>상품명</th>
            <th>판매량</th>
            <th>매출</th>
        </tr>
        {% for product in top_products %}
        <tr>
            <td>{{ loop.index }}</td>
            <td>{{ product.name }}</td>
            <td>{{ "{:,}".format(product.quantity) }}</td>
            <td>{{ "{:,.0f}".format(product.revenue) }}원</td>
        </tr>
        {% endfor %}
    </table>

    <h2>👥 고객 세그먼트</h2>
    <table>
        <tr>
            <th>세그먼트</th>
            <th>고객 수</th>
            <th>매출 비중</th>
            <th>평균 주문 금액</th>
        </tr>
        {% for segment in segments %}
        <tr>
            <td>{{ segment.name }}</td>
            <td>{{ "{:,}".format(segment.count) }}</td>
            <td>{{ "{:.1f}".format(segment.revenue_share) }}%</td>
            <td>{{ "{:,.0f}".format(segment.avg_order) }}원</td>
        </tr>
        {% endfor %}
    </table>

    {% if charts.daily_revenue %}
    <h2>📊 일별 매출 추이</h2>
    <div class="chart">
        <img src="data:image/png;base64,{{ charts.daily_revenue }}" alt="Daily Revenue Chart">
    </div>
    {% endif %}

    <h2>⚠️ 이상치 요약</h2>
    <ul>
        <li>이상 주문: {{ metrics.outlier_orders }}건</li>
        <li>금액 불일치: {{ metrics.amount_mismatches }}건</li>
        <li>유효하지 않은 이메일: {{ metrics.invalid_emails }}건</li>
    </ul>

    <div class="footer">
        <p>자동 생성된 리포트입니다. 문의: data-team@company.com</p>
        <p>생성 시간: {{ generated_at }}</p>
    </div>
</body>
</html>
"""


@dag(
    dag_id='weekly_report',
    description='주간 비즈니스 리포트 생성',
    schedule='0 9 * * 1',  # 매주 월요일 09:00 UTC
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=['report', 'weekly', 'analytics'],
    dagrun_timeout=timedelta(hours=1),
)
def weekly_report():
    """Weekly Report DAG"""

    @task
    def calculate_metrics(**context):
        """주간 메트릭 계산"""
        execution_date = context['logical_date']
        week_end = (execution_date - timedelta(days=1)).strftime('%Y-%m-%d')
        week_start = (execution_date - timedelta(days=7)).strftime('%Y-%m-%d')

        logger.info(f"Calculating metrics for {week_start} ~ {week_end}")

        s3_hook = S3Hook(aws_conn_id='aws_default')

        # 지난 7일간 데이터 수집
        all_orders = []
        all_rfm = []

        for i in range(7):
            date = (execution_date - timedelta(days=i+1)).strftime('%Y-%m-%d')

            try:
                # Orders 데이터
                orders_key = f"datamart/orders/dt={date}/orders.parquet"
                content = s3_hook.read_key(key=orders_key, bucket_name='data-lake')
                df = pd.read_parquet(BytesIO(content if isinstance(content, bytes) else content.encode()))
                all_orders.append(df)

                # RFM 데이터
                rfm_key = f"analytics/rfm/dt={date}/rfm_scores.parquet"
                rfm_content = s3_hook.read_key(key=rfm_key, bucket_name='data-lake')
                rfm_df = pd.read_parquet(BytesIO(rfm_content if isinstance(rfm_content, bytes) else rfm_content.encode()))
                all_rfm.append(rfm_df)
            except Exception as e:
                logger.warning(f"No data for {date}: {e}")

        if not all_orders:
            logger.warning("No data found for the week")
            return {
                'total_revenue': 0,
                'total_orders': 0,
                'new_customers': 0,
                'avg_order_value': 0,
                'revenue_growth': 0,
                'outlier_orders': 0,
                'amount_mismatches': 0,
                'invalid_emails': 0,
                'week_start': week_start,
                'week_end': week_end,
                'daily_data': []
            }

        orders_df = pd.concat(all_orders, ignore_index=True)
        rfm_df = pd.concat(all_rfm, ignore_index=True).drop_duplicates(subset=['customer_id'])

        # 기본 메트릭
        total_revenue = orders_df['total_amount'].sum()
        total_orders = len(orders_df)
        unique_customers = orders_df['customer_id'].nunique()
        avg_order_value = total_revenue / total_orders if total_orders > 0 else 0

        # 신규 고객 (이번 주가 첫 주문인 고객)
        # 간단히 구현: 이전 데이터 없이 이번 주 데이터만으로 추정
        new_customers = int(unique_customers * 0.15)  # 가정: 15%가 신규

        # 이상치 집계
        outlier_orders = orders_df.get('is_outlier', pd.Series([False])).sum()
        amount_mismatches = orders_df.get('amount_mismatch', pd.Series([False])).sum()
        invalid_emails = 0  # customers 데이터에서 계산

        # 일별 매출 데이터
        daily_data = orders_df.groupby('order_date').agg({
            'total_amount': 'sum',
            'order_id': 'count'
        }).reset_index()
        daily_data.columns = ['date', 'revenue', 'orders']

        # 전주 대비 성장률 (간단히 가정)
        revenue_growth = 5.2  # 실제로는 이전 주 데이터와 비교

        # Top 10 상품
        if 'product_id' in orders_df.columns:
            top_products = orders_df.groupby('product_id').agg({
                'quantity': 'sum',
                'total_amount': 'sum'
            }).reset_index()
            top_products.columns = ['product_id', 'quantity', 'revenue']
            top_products = top_products.nlargest(10, 'revenue')
            top_products['name'] = top_products['product_id'].apply(lambda x: f"상품 {x}")
        else:
            top_products = pd.DataFrame()

        # 고객 세그먼트 분석
        if 'segment' in orders_df.columns:
            segments = orders_df.groupby('segment').agg({
                'customer_id': 'nunique',
                'total_amount': ['sum', 'mean']
            }).reset_index()
            segments.columns = ['name', 'count', 'total_revenue', 'avg_order']
            total_seg_revenue = segments['total_revenue'].sum()
            segments['revenue_share'] = segments['total_revenue'] / total_seg_revenue * 100
        else:
            segments = pd.DataFrame({
                'name': ['Gold', 'Silver', 'Bronze', 'New'],
                'count': [100, 300, 500, 200],
                'revenue_share': [40, 30, 20, 10],
                'avg_order': [150000, 80000, 40000, 25000]
            })

        return {
            'total_revenue': float(total_revenue),
            'total_orders': int(total_orders),
            'new_customers': int(new_customers),
            'avg_order_value': float(avg_order_value),
            'revenue_growth': float(revenue_growth),
            'outlier_orders': int(outlier_orders),
            'amount_mismatches': int(amount_mismatches),
            'invalid_emails': int(invalid_emails),
            'week_start': week_start,
            'week_end': week_end,
            'daily_data': daily_data.to_dict('records'),
            'top_products': top_products.to_dict('records') if not top_products.empty else [],
            'segments': segments.to_dict('records')
        }

    @task
    def generate_charts(metrics: dict):
        """차트 생성"""
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt

        charts = {}

        # 일별 매출 차트
        daily_data = metrics.get('daily_data', [])
        if daily_data:
            df = pd.DataFrame(daily_data)

            fig, ax = plt.subplots(figsize=(10, 5))
            ax.bar(df['date'], df['revenue'], color='#4CAF50')
            ax.set_xlabel('날짜')
            ax.set_ylabel('매출 (원)')
            ax.set_title('일별 매출 추이')
            plt.xticks(rotation=45)
            plt.tight_layout()

            buffer = BytesIO()
            plt.savefig(buffer, format='png', dpi=100)
            buffer.seek(0)
            charts['daily_revenue'] = base64.b64encode(buffer.getvalue()).decode()
            plt.close()

        return charts

    @task
    def create_report(metrics: dict, charts: dict, **context):
        """HTML 리포트 생성"""
        execution_date = context['logical_date']

        template = Template(REPORT_TEMPLATE)

        # Top 10 상품 데이터 준비
        top_products = metrics.get('top_products', [])
        if not top_products:
            top_products = [
                {'name': f'상품 {i}', 'quantity': 100-i*5, 'revenue': (100-i*5) * 10000}
                for i in range(1, 11)
            ]

        # 세그먼트 데이터 준비
        segments = metrics.get('segments', [])
        if not segments:
            segments = [
                {'name': 'Gold', 'count': 100, 'revenue_share': 40.0, 'avg_order': 150000},
                {'name': 'Silver', 'count': 300, 'revenue_share': 30.0, 'avg_order': 80000},
                {'name': 'Bronze', 'count': 500, 'revenue_share': 20.0, 'avg_order': 40000},
                {'name': 'New', 'count': 200, 'revenue_share': 10.0, 'avg_order': 25000},
            ]

        # metrics를 객체처럼 접근할 수 있게 변환
        class MetricsObj:
            def __init__(self, d):
                for k, v in d.items():
                    setattr(self, k, v)

        html = template.render(
            week_start=metrics['week_start'],
            week_end=metrics['week_end'],
            metrics=MetricsObj(metrics),
            top_products=top_products,
            segments=segments,
            charts=charts,
            generated_at=execution_date.strftime('%Y-%m-%d %H:%M:%S UTC')
        )

        return html

    @task
    def send_slack_summary(metrics: dict, **context):
        """Slack 요약 전송"""
        execution_date = context['logical_date']

        growth_emoji = "📈" if metrics['revenue_growth'] > 0 else "📉"
        growth_sign = "+" if metrics['revenue_growth'] > 0 else ""

        message = f"""
:chart_with_upwards_trend: *주간 비즈니스 리포트*
📅 기간: {metrics['week_start']} ~ {metrics['week_end']}

*📊 주요 지표*
• 총 매출: {metrics['total_revenue']:,.0f}원 ({growth_emoji} {growth_sign}{metrics['revenue_growth']:.1f}%)
• 주문 건수: {metrics['total_orders']:,}건
• 신규 고객: {metrics['new_customers']:,}명
• 평균 주문 금액: {metrics['avg_order_value']:,.0f}원

*⚠️ 이상 징후*
• 이상 주문: {metrics['outlier_orders']}건
• 금액 불일치: {metrics['amount_mismatches']}건

_상세 리포트: <s3://data-lake/reports/weekly/{metrics['week_end']}/report.html|링크>_
        """

        try:
            hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
            hook.send(text=message)
            logger.info("Slack summary sent successfully")
            return {'status': 'sent'}
        except Exception as e:
            logger.error(f"Failed to send Slack message: {e}")
            return {'status': 'failed', 'error': str(e)}

    @task
    def save_report(report_html: str, metrics: dict, **context):
        """S3에 리포트 저장"""
        week_end = metrics['week_end']

        s3_hook = S3Hook(aws_conn_id='aws_default')

        # HTML 리포트 저장
        report_key = f"reports/weekly/{week_end}/report.html"
        s3_hook.load_string(
            string_data=report_html,
            key=report_key,
            bucket_name='data-lake',
            replace=True
        )

        # 메트릭 JSON 저장
        metrics_key = f"reports/weekly/{week_end}/metrics.json"
        s3_hook.load_string(
            string_data=json.dumps(metrics, ensure_ascii=False, indent=2),
            key=metrics_key,
            bucket_name='data-lake',
            replace=True
        )

        logger.info(f"Report saved to s3://data-lake/{report_key}")

        return {
            'report_url': f"s3://data-lake/{report_key}",
            'metrics_url': f"s3://data-lake/{metrics_key}"
        }

    # DAG 흐름
    metrics = calculate_metrics()
    charts = generate_charts(metrics)
    report = create_report(metrics, charts)

    # 병렬 실행: Slack 전송과 S3 저장
    send_slack_summary(metrics)
    save_report(report, metrics)


dag = weekly_report()
`,
      hints: [
        "Jinja2 Template을 사용하면 HTML 리포트를 쉽게 생성할 수 있습니다",
        "matplotlib의 savefig로 차트를 이미지로 저장 후 base64 인코딩하면 HTML에 포함할 수 있습니다",
        "병렬 실행은 리스트로 묶어 흐름을 정의하면 됩니다: [task1, task2]",
        "Slack 메시지에서 마크다운 형식을 사용할 수 있습니다"
      ]
    }
  },
  {
    id: 'w7d5t5',
    title: '테스트 & CI/CD 통합',
    type: 'reading',
    duration: 25,
    content: {
      markdown: `# DAG 테스트 & CI/CD 통합

## 🧪 DAG 테스트 전략

### 1. 단위 테스트

\`\`\`python
# tests/test_daily_extract.py

import pytest
from datetime import datetime
from airflow.models import DagBag
from dags.daily_extract import daily_extract

class TestDailyExtractDAG:
    """Daily Extract DAG 테스트"""

    @pytest.fixture
    def dagbag(self):
        """DAG 로딩"""
        return DagBag(dag_folder='dags/', include_examples=False)

    def test_dag_loaded(self, dagbag):
        """DAG이 정상 로딩되는지 확인"""
        assert 'daily_extract' in dagbag.dags
        assert dagbag.import_errors == {}

    def test_dag_structure(self, dagbag):
        """DAG 구조 검증"""
        dag = dagbag.get_dag('daily_extract')

        # Task 수 확인
        assert len(dag.tasks) >= 5

        # 필수 Task 존재 확인
        task_ids = [t.task_id for t in dag.tasks]
        assert 'extract_sources.extract_orders' in task_ids
        assert 'validate_extracts' in task_ids
        assert 'notify_completion' in task_ids

    def test_dag_schedule(self, dagbag):
        """스케줄 검증"""
        dag = dagbag.get_dag('daily_extract')
        assert dag.schedule_interval == '0 2 * * *'

    def test_default_args(self, dagbag):
        """기본 인수 검증"""
        dag = dagbag.get_dag('daily_extract')
        assert dag.default_args['owner'] == 'data-team'
        assert dag.default_args['retries'] == 3


class TestExtractFunctions:
    """추출 함수 단위 테스트"""

    def test_extract_orders_empty(self, mocker):
        """주문 없는 경우 테스트"""
        from dags.daily_extract import extract_orders

        # Mock PostgresHook
        mock_hook = mocker.patch('dags.daily_extract.PostgresHook')
        mock_hook.return_value.get_pandas_df.return_value = pd.DataFrame()

        result = extract_orders()

        assert result['count'] == 0
        assert result['destination'] is None

    def test_validate_extracts_with_warnings(self):
        """경고 발생 검증"""
        from dags.daily_extract import validate_extracts

        extract_results = [
            {'source': 'orders', 'count': 0, 'destination': None},
            {'source': 'customers', 'count': 50, 'destination': 's3://...'},
        ]

        result = validate_extracts(extract_results)

        assert result['status'] == 'warning'
        assert len(result['warnings']) > 0
\`\`\`

### 2. 통합 테스트

\`\`\`python
# tests/test_integration.py

import pytest
from airflow.models import DagBag, DagRun, TaskInstance
from airflow.utils.state import State
from datetime import datetime

class TestDAGIntegration:
    """DAG 간 통합 테스트"""

    def test_extract_transform_dependency(self, dagbag):
        """Extract → Transform 의존성 테스트"""
        extract_dag = dagbag.get_dag('daily_extract')
        transform_dag = dagbag.get_dag('daily_transform')

        # ExternalTaskSensor 확인
        sensor_tasks = [
            t for t in transform_dag.tasks
            if 'wait_for_extract' in t.task_id
        ]

        assert len(sensor_tasks) == 1
        sensor = sensor_tasks[0]
        assert sensor.external_dag_id == 'daily_extract'

    def test_end_to_end_flow(self, dagbag):
        """E2E 플로우 테스트 (Dry Run)"""
        from airflow.executors.debug_executor import DebugExecutor

        dag = dagbag.get_dag('daily_extract')

        # 테스트 실행
        dag.test(
            execution_date=datetime(2024, 1, 1),
            executor=DebugExecutor()
        )

        # 모든 Task가 성공했는지 확인
        # (실제로는 Mock 필요)
\`\`\`

### 3. 데이터 품질 테스트

\`\`\`python
# tests/test_data_quality.py

import great_expectations as gx
import pandas as pd

def test_orders_schema():
    """주문 데이터 스키마 검증"""
    context = gx.get_context()

    validator = context.sources.pandas_default.read_parquet(
        "s3://data-lake/datamart/orders/dt=2024-01-01/orders.parquet"
    )

    # 필수 컬럼 존재
    validator.expect_column_to_exist("order_id")
    validator.expect_column_to_exist("customer_id")
    validator.expect_column_to_exist("total_amount")

    # 데이터 타입
    validator.expect_column_values_to_be_of_type("order_id", "int64")
    validator.expect_column_values_to_be_of_type("total_amount", "float64")

    # 비즈니스 규칙
    validator.expect_column_values_to_be_between(
        "total_amount", min_value=0, max_value=10000000
    )
    validator.expect_column_values_to_be_unique("order_id")

    results = validator.validate()
    assert results.success
\`\`\`

## 🚀 CI/CD 파이프라인

### GitHub Actions 워크플로우

\`\`\`yaml
# .github/workflows/airflow-ci.yml

name: Airflow CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'dags/**'
      - 'plugins/**'
      - 'tests/**'
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install ruff black mypy
          pip install apache-airflow==2.8.0

      - name: Run Ruff (linter)
        run: ruff check dags/ plugins/

      - name: Run Black (formatter)
        run: black --check dags/ plugins/

      - name: Run mypy (type check)
        run: mypy dags/ plugins/

  test:
    runs-on: ubuntu-latest
    needs: lint

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: airflow
          POSTGRES_USER: airflow
          POSTGRES_DB: airflow
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov pytest-mock

      - name: Initialize Airflow DB
        env:
          AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@localhost:5432/airflow
        run: airflow db init

      - name: Run tests
        env:
          AIRFLOW_HOME: \${{ github.workspace }}
        run: |
          pytest tests/ -v --cov=dags --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml

  dag-validation:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3

      - name: Validate DAGs
        run: |
          pip install apache-airflow==2.8.0
          python -c "
          from airflow.models import DagBag
          dagbag = DagBag(dag_folder='dags/')
          if dagbag.import_errors:
              for dag, error in dagbag.import_errors.items():
                  print(f'DAG {dag}: {error}')
              exit(1)
          print(f'All {len(dagbag.dags)} DAGs validated successfully!')
          "

  deploy-staging:
    runs-on: ubuntu-latest
    needs: dag-validation
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Staging
        env:
          GCS_BUCKET: airflow-staging-dags
        run: |
          # GCS에 DAG 업로드 (Cloud Composer)
          gsutil -m rsync -r -d dags/ gs://$GCS_BUCKET/dags/

  deploy-production:
    runs-on: ubuntu-latest
    needs: dag-validation
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Production
        env:
          GCS_BUCKET: airflow-production-dags
        run: |
          gsutil -m rsync -r -d dags/ gs://$GCS_BUCKET/dags/
\`\`\`

## 📊 모니터링 대시보드

### Prometheus + Grafana 설정

\`\`\`yaml
# prometheus/airflow_alerts.yml

groups:
  - name: airflow_alerts
    rules:
      - alert: DAGRunFailed
        expr: airflow_dag_run_state{state="failed"} > 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "DAG {{ $labels.dag_id }} 실행 실패"

      - alert: TaskDurationExceeded
        expr: airflow_task_duration_seconds > 3600
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Task가 1시간 이상 실행 중"

      - alert: SchedulerHeartbeat
        expr: time() - airflow_scheduler_heartbeat > 60
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Airflow Scheduler 응답 없음"
\`\`\`

## 📁 최종 프로젝트 구조

\`\`\`
week7_project/
├── .github/
│   └── workflows/
│       └── airflow-ci.yml
├── dags/
│   ├── __init__.py
│   ├── daily_extract.py
│   ├── daily_transform.py
│   └── weekly_report.py
├── plugins/
│   ├── __init__.py
│   ├── operators/
│   │   └── custom_operators.py
│   ├── hooks/
│   │   └── api_hook.py
│   └── callbacks/
│       └── slack_callbacks.py
├── include/
│   ├── sql/
│   │   ├── extract_orders.sql
│   │   └── transform_data.sql
│   └── templates/
│       └── report_template.html
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_daily_extract.py
│   ├── test_daily_transform.py
│   ├── test_weekly_report.py
│   └── test_integration.py
├── docker-compose.yml
├── requirements.txt
├── pytest.ini
└── README.md
\`\`\`

## ✅ 제출 체크리스트

- [ ] 3개 DAG 구현 완료 (daily_extract, daily_transform, weekly_report)
- [ ] TaskFlow API 사용
- [ ] XCom으로 메타데이터 전달
- [ ] 재시도 정책 설정 (exponential backoff)
- [ ] Slack 알림 통합
- [ ] SLA 설정
- [ ] 단위 테스트 작성 (커버리지 80% 이상)
- [ ] 통합 테스트 작성
- [ ] CI/CD 파이프라인 설정
- [ ] README.md 작성
- [ ] Docker Compose로 로컬 실행 가능
`,
      externalLinks: [
        { title: 'Airflow Testing Best Practices', url: 'https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html#testing-a-dag' },
        { title: 'Great Expectations', url: 'https://docs.greatexpectations.io/' },
        { title: 'GitHub Actions for Airflow', url: 'https://github.com/astronomer/airflow-guide' }
      ]
    }
  },
  {
    id: 'w7d5t6',
    title: '최종 프로젝트 퀴즈',
    type: 'quiz',
    duration: 15,
    content: {
      questions: [
        {
          question: 'TaskFlow API에서 @task 데코레이터로 정의된 함수의 반환값은 어떻게 처리되나요?',
          options: [
            '자동으로 XCom에 저장되어 다음 Task에서 접근 가능',
            '로컬 변수로만 유지되어 다른 Task에서 접근 불가',
            '별도의 push_xcom() 호출이 필요',
            'Airflow Variable에 저장됨'
          ],
          answer: 0,
          explanation: 'TaskFlow API에서 @task 함수의 반환값은 자동으로 XCom에 푸시됩니다. 다음 Task에서 함수 호출 형태로 자연스럽게 값을 전달받을 수 있습니다.'
        },
        {
          question: 'ExternalTaskSensor의 mode 옵션 중 워커 슬롯을 점유하지 않는 것은?',
          options: [
            'poke',
            'reschedule',
            'block',
            'wait'
          ],
          answer: 1,
          explanation: 'reschedule 모드는 센서가 대기할 때 워커 슬롯을 해제하고 스케줄러에게 다시 예약을 요청합니다. poke 모드는 대기 중에도 슬롯을 점유합니다.'
        },
        {
          question: 'DAG 테스트에서 dagbag.import_errors가 비어있는지 확인하는 이유는?',
          options: [
            'DAG의 Task 수를 확인하기 위해',
            'DAG 문법 오류나 import 실패를 감지하기 위해',
            'DAG 실행 성능을 측정하기 위해',
            'DAG 스케줄을 검증하기 위해'
          ],
          answer: 1,
          explanation: 'import_errors는 DAG 파일을 파싱할 때 발생한 오류를 담고 있습니다. CI/CD에서 이를 확인하면 문법 오류나 의존성 문제를 조기에 발견할 수 있습니다.'
        },
        {
          question: 'Jinja2 템플릿에서 숫자를 천 단위 구분자로 포맷팅하는 방법은?',
          options: [
            '{{ number | format }}',
            '{{ "{:,}".format(number) }}',
            '{{ number.toLocaleString() }}',
            '{{ number | comma }}'
          ],
          answer: 1,
          explanation: 'Python의 문자열 포맷팅을 Jinja2에서 직접 사용할 수 있습니다. "{:,}".format(number)는 숫자에 천 단위 구분자를 추가합니다.'
        },
        {
          question: 'CI/CD 파이프라인에서 DAG validation을 테스트 후에 실행하는 이유는?',
          options: [
            'DAG 검증이 테스트보다 빠르기 때문에',
            '테스트 통과 후에만 DAG 구조를 검증할 가치가 있기 때문에',
            'DAG 검증에는 테스트 환경이 필요하기 때문에',
            'GitHub Actions의 제한 때문에'
          ],
          answer: 1,
          explanation: '테스트가 실패하면 배포할 의미가 없으므로, 테스트 통과 후에 DAG 검증을 하는 것이 효율적입니다. 이를 통해 불필요한 단계를 건너뛸 수 있습니다.'
        }
      ]
    }
  }
]
