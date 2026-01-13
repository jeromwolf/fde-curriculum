import { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'w8d5t1',
    title: '통합 테스트 전략',
    type: 'reading',
    duration: 25,
    content: {
      markdown: `# 통합 테스트 전략

## 🎯 테스트 피라미드

\`\`\`
           ┌─────────┐
           │  E2E    │  적음, 느림, 비용 높음
          ┌┴─────────┴┐
          │Integration│
         ┌┴───────────┴┐
         │    Unit     │  많음, 빠름, 비용 낮음
        ┌┴─────────────┴┐
        │  Static Check │
        └───────────────┘
\`\`\`

## 📊 테스트 계층별 전략

### 1. Static Checks (정적 분석)
- **Black/Ruff**: 코드 포매팅 & 린팅
- **mypy**: 타입 체크
- **pre-commit hooks**: 커밋 전 자동 검사

\`\`\`yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.7.0
    hooks:
      - id: black
  - repo: https://github.com/charliermarsh/ruff-pre-commit
    rev: v0.0.280
    hooks:
      - id: ruff
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.4.0
    hooks:
      - id: mypy
\`\`\`

### 2. Unit Tests (단위 테스트)
- 개별 함수/클래스 테스트
- Mock을 사용한 외부 의존성 격리
- 커버리지 80% 이상 목표

\`\`\`python
# tests/unit/transformers/test_staging_users.py

import pytest
from pyspark.sql import SparkSession
from e2e_pipeline.transformers.staging.users import StagingUserTransformer


class TestStagingUserTransformer:
    @pytest.fixture(scope="session")
    def spark(self):
        return SparkSession.builder \\
            .master("local[2]") \\
            .appName("test") \\
            .getOrCreate()

    def test_normalize_email(self, spark):
        # Given
        data = [{"user_id": 1, "email": "  TEST@EXAMPLE.COM  "}]
        df = spark.createDataFrame(data)

        # When
        transformer = StagingUserTransformer(spark, {})
        result = transformer.transform(df)

        # Then
        assert result.first()["email"] == "test@example.com"

    def test_deduplicate_users(self, spark):
        # Given
        data = [
            {"user_id": 1, "email": "a@test.com", "updated_at": "2024-01-01"},
            {"user_id": 1, "email": "b@test.com", "updated_at": "2024-01-02"},
        ]
        df = spark.createDataFrame(data)

        # When
        transformer = StagingUserTransformer(spark, {})
        result = transformer.transform(df)

        # Then
        assert result.count() == 1
        assert result.first()["email"] == "b@test.com"
\`\`\`

### 3. Integration Tests (통합 테스트)
- 여러 컴포넌트 간 상호작용 테스트
- 실제 데이터베이스/S3 사용 (테스트 환경)
- Docker Compose로 환경 구성

\`\`\`python
# tests/integration/test_extract_transform_flow.py

import pytest
from datetime import date

class TestExtractTransformFlow:
    @pytest.fixture(scope="class")
    def test_environment(self, docker_compose_up):
        """Start test environment with Docker Compose."""
        yield

    def test_extract_to_staging(self, test_environment, spark):
        # Given: Raw data in S3
        raw_data = [{"user_id": 1, "email": "test@example.com"}]
        save_to_s3(raw_data, "raw/users/dt=2024-01-01")

        # When: Run extract and transform
        run_extraction_dag("2024-01-01")
        run_transformation_dag("2024-01-01")

        # Then: Verify staging data
        staging = spark.read.format("delta").load("staging/stg_users")
        assert staging.count() == 1
\`\`\`

### 4. E2E Tests (End-to-End 테스트)
- 전체 파이프라인 테스트
- 프로덕션 유사 환경
- 일일 배치 시뮬레이션

\`\`\`python
# tests/e2e/test_daily_pipeline.py

import pytest
from airflow.models import DagBag

class TestDailyPipeline:
    def test_daily_pipeline_e2e(self, airflow_test_env):
        # Given: Test data prepared
        prepare_test_data("2024-01-01")

        # When: Trigger daily pipeline
        dagbag = DagBag()
        dag = dagbag.get_dag("daily_pipeline")
        dag.test(execution_date="2024-01-01")

        # Then: Verify all tables populated
        assert_table_has_data("staging/stg_users")
        assert_table_has_data("warehouse/dim_user")
        assert_table_has_data("warehouse/fact_events")
        assert_quality_checks_passed("2024-01-01")
\`\`\`

## 🔧 테스트 픽스처

### conftest.py
\`\`\`python
# tests/conftest.py

import pytest
from pyspark.sql import SparkSession
import docker

@pytest.fixture(scope="session")
def spark():
    """Create Spark session for tests."""
    return SparkSession.builder \\
        .master("local[2]") \\
        .appName("pytest") \\
        .config("spark.sql.shuffle.partitions", "2") \\
        .getOrCreate()

@pytest.fixture(scope="session")
def docker_compose_up():
    """Start Docker Compose services."""
    import subprocess
    subprocess.run(["docker-compose", "-f", "docker-compose.test.yml", "up", "-d"])
    yield
    subprocess.run(["docker-compose", "-f", "docker-compose.test.yml", "down"])

@pytest.fixture
def sample_users(spark):
    """Create sample user data."""
    return spark.createDataFrame([
        {"user_id": 1, "email": "alice@example.com", "name": "Alice"},
        {"user_id": 2, "email": "bob@example.com", "name": "Bob"},
    ])
\`\`\`

## 📈 커버리지 목표

| 계층 | 목표 커버리지 | 우선순위 |
|------|--------------|----------|
| Transformers | 90% | 높음 |
| Extractors | 80% | 높음 |
| DAGs | 70% | 중간 |
| Utils | 80% | 중간 |

## 🚀 CI/CD 통합

\`\`\`yaml
# .github/workflows/test.yml

name: Test Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -e ".[dev]"

      - name: Run static checks
        run: |
          black --check src/ tests/
          ruff check src/ tests/
          mypy src/

      - name: Run unit tests
        run: pytest tests/unit/ -v --cov=e2e_pipeline --cov-report=xml

      - name: Run integration tests
        run: |
          docker-compose -f docker-compose.test.yml up -d
          pytest tests/integration/ -v
          docker-compose -f docker-compose.test.yml down

      - name: Upload coverage
        uses: codecov/codecov-action@v3
\`\`\`
`,
      externalLinks: [
        { title: 'pytest Documentation', url: 'https://docs.pytest.org/' },
        { title: 'Testing Spark Applications', url: 'https://spark.apache.org/docs/latest/testing-spark.html' },
        { title: 'Airflow Testing Guide', url: 'https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html#testing-a-dag' }
      ]
    }
  },
  {
    id: 'w8d5t2',
    title: '문서화 & 발표 자료 작성',
    type: 'reading',
    duration: 30,
    content: {
      markdown: `# 문서화 & 발표 자료 작성

## 📚 프로젝트 문서 구조

\`\`\`
docs/
├── README.md              # 프로젝트 개요, 빠른 시작
├── ARCHITECTURE.md        # 시스템 아키텍처
├── SETUP.md               # 환경 설정 가이드
├── DATA_DICTIONARY.md     # 테이블/컬럼 정의
├── RUNBOOKS.md            # 운영 가이드
└── architecture/
    ├── adr-001-*.md       # Architecture Decision Records
    ├── adr-002-*.md
    └── diagrams/
        ├── system-overview.png
        └── data-flow.png
\`\`\`

## 📖 README.md 템플릿

\`\`\`markdown
# E2E Data Pipeline

SaaS 분석 플랫폼을 위한 End-to-End 데이터 파이프라인

## 🎯 Overview

- 일일 1억 건 이벤트 처리
- PostgreSQL, S3, REST API에서 데이터 수집
- Star Schema 데이터 웨어하우스
- Airflow 기반 오케스트레이션

## 🏗️ Architecture

![System Architecture](docs/architecture/diagrams/system-overview.png)

### Tech Stack
| Component | Technology |
|-----------|------------|
| Orchestration | Apache Airflow 2.8 |
| Processing | Apache Spark 3.4 |
| Storage | Delta Lake 2.4 |
| Database | PostgreSQL 15 |

## 🚀 Quick Start

\`\`\`bash
# Clone
git clone https://github.com/company/e2e-pipeline.git
cd e2e-pipeline

# Start infrastructure
docker-compose up -d

# Install dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Access Airflow UI
open http://localhost:8081  # admin/admin
\`\`\`

## 📊 Data Model

### Fact Tables
- **fact_events**: 사용자 행동 이벤트
- **fact_payments**: 결제 트랜잭션

### Dimension Tables
- **dim_user**: 사용자 (SCD Type 2)
- **dim_date**: 날짜
- **dim_plan**: 구독 플랜

## 📅 Daily Pipeline

| Time (UTC) | Stage | Duration |
|------------|-------|----------|
| 02:00 | Extract | ~1 hour |
| 03:00 | Transform Staging | ~1.5 hours |
| 04:30 | Transform Warehouse | ~1 hour |
| 05:30 | Quality Checks | ~30 min |
| 06:00 | Complete | - |

## 🔧 Configuration

See [SETUP.md](docs/SETUP.md) for detailed configuration options.

## 📈 Monitoring

- Airflow UI: http://localhost:8081
- Spark UI: http://localhost:8080
- Slack: #data-alerts

## 🧪 Testing

\`\`\`bash
# Unit tests
pytest tests/unit/ -v

# Integration tests
pytest tests/integration/ -v

# Coverage report
pytest --cov=e2e_pipeline --cov-report=html
\`\`\`

## 📄 License

MIT License
\`\`\`

## 🎤 발표 자료 구조 (15분)

### 1. 소개 (2분)
- 프로젝트 배경 및 목표
- 비즈니스 요구사항 요약

### 2. 아키텍처 (3분)
- 시스템 개요 다이어그램
- 기술 스택 선택 이유
- 데이터 흐름

### 3. 핵심 구현 (5분)
- Extractor 패턴
- Spark 변환 로직
- SCD Type 2 구현
- 데이터 품질 검사

### 4. 데모 (3분)
- Airflow DAG 실행
- 데이터 품질 리포트
- Slack 알림

### 5. 결론 & Q&A (2분)
- 배운 점
- 향후 개선 사항
- 질문

## 🖼️ 발표 슬라이드 예시

### 슬라이드 1: 타이틀
\`\`\`
E2E 데이터 파이프라인
────────────────────
SaaS 분석 플랫폼 구축

[Your Name]
Phase 1 Capstone Project
\`\`\`

### 슬라이드 2: 문제 정의
\`\`\`
As-Is (문제점)
─────────────
• 수동 데이터 추출
• 데이터 품질 이슈
• 부서별 사일로

To-Be (목표)
───────────
• 자동화된 ETL
• 품질 모니터링
• 통합 DW
\`\`\`

### 슬라이드 3: 아키텍처
\`\`\`
[아키텍처 다이어그램 이미지]

Sources → Ingestion → Staging → Warehouse → Marts
   │          │           │          │          │
PostgreSQL  Airflow    Spark     Delta     BI Tools
   S3       Sensors   Transforms  Lake
   API
\`\`\`

### 슬라이드 4: 기술 스택
\`\`\`
┌────────────────────────────────────┐
│        Apache Airflow 2.8          │
│   (Orchestration & Scheduling)     │
├────────────────────────────────────┤
│        Apache Spark 3.4            │
│      (Batch Processing)            │
├────────────────────────────────────┤
│          Delta Lake 2.4            │
│   (ACID Storage, Time Travel)      │
├────────────────────────────────────┤
│         PostgreSQL 15              │
│      (Source & Metadata)           │
└────────────────────────────────────┘
\`\`\`

### 슬라이드 5: 핵심 구현
\`\`\`
1. Extractor Pattern
   • BaseExtractor 추상 클래스
   • PostgreSQL, S3, REST API 구현체
   • Watermark 기반 증분 추출

2. Spark Transformations
   • Staging: 정제, 중복 제거
   • Dimension: SCD Type 2
   • Fact: 조인, 집계

3. Quality Checks
   • Not Null, Unique, Range
   • Freshness, Referential Integrity
\`\`\`

### 슬라이드 6: 데모
\`\`\`
[Airflow DAG 스크린샷]

Daily Pipeline 실행 결과:
• Extract: ✅ 15,000 rows
• Transform: ✅ 3 tables
• Quality: ✅ 98% passed
• Duration: 2h 15m
\`\`\`

### 슬라이드 7: 결론
\`\`\`
배운 점
───────
• E2E 파이프라인 설계
• Spark + Delta Lake 활용
• Airflow 오케스트레이션
• 데이터 품질 관리

향후 계획
────────
• 실시간 스트리밍 추가
• ML Feature Store 연동
• 모니터링 고도화
\`\`\`

## ✅ 발표 체크리스트

- [ ] README.md 완성
- [ ] 아키텍처 다이어그램 준비
- [ ] 데모 시나리오 연습
- [ ] 발표 슬라이드 작성
- [ ] 예상 질문 준비
- [ ] 시간 맞춤 연습 (15분)
`,
      externalLinks: [
        { title: 'Technical Writing Guide', url: 'https://developers.google.com/tech-writing' },
        { title: 'Diagrams.net (draw.io)', url: 'https://app.diagrams.net/' }
      ]
    }
  },
  {
    id: 'w8d5t3',
    title: '최종 프로젝트 제출 체크리스트',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `# 최종 프로젝트 제출 체크리스트

## ✅ 코드 완성도

### Extractors
- [ ] BaseExtractor 추상 클래스
- [ ] PostgreSQLExtractor (증분 추출, 배치)
- [ ] S3JSONExtractor (날짜 파티션, 병렬 처리)
- [ ] RESTAPIExtractor (페이징, Rate Limiting)
- [ ] WatermarkManager

### Transformers
- [ ] StagingUserTransformer
- [ ] StagingEventTransformer
- [ ] StagingPaymentTransformer
- [ ] DimUserTransformer (SCD Type 2)
- [ ] FactEventsTransformer

### DAGs
- [ ] dag_extract_all.py
- [ ] dag_transform_warehouse.py
- [ ] dag_data_quality.py
- [ ] dag_daily_pipeline.py

### Utils
- [ ] config.py (Pydantic Settings)
- [ ] logger.py (Structured Logging)
- [ ] exceptions.py
- [ ] notifications.py
- [ ] metrics.py

## ✅ 테스트

- [ ] 단위 테스트 커버리지 80% 이상
- [ ] 통합 테스트 작성
- [ ] DAG 검증 테스트
- [ ] 데이터 품질 테스트 정의

## ✅ 인프라

- [ ] docker-compose.yml 완성
- [ ] 환경 변수 템플릿 (.env.example)
- [ ] Spark + Delta Lake 설정
- [ ] Airflow 연결 설정 (Connections)

## ✅ 문서화

- [ ] README.md
- [ ] ARCHITECTURE.md
- [ ] DATA_DICTIONARY.md
- [ ] ADR 문서 (3개 이상)
- [ ] 인라인 코드 주석

## ✅ 데이터 품질

- [ ] Not Null 검사
- [ ] Unique 검사
- [ ] Value Range 검사
- [ ] Freshness 검사
- [ ] 품질 리포트 생성

## ✅ 운영

- [ ] Slack 알림 통합
- [ ] SLA 설정
- [ ] 에러 핸들링 (재시도, 콜백)
- [ ] 로깅 표준화

## 📊 평가 기준

| 항목 | 배점 | 체크포인트 |
|------|------|-----------|
| **아키텍처 (20%)** | | |
| - 레이어 분리 | 5% | Bronze/Silver/Gold 구조 |
| - 확장성 | 5% | 모듈화, 설정 분리 |
| - 모범 사례 | 10% | ADR, 설계 패턴 적용 |
| **코드 품질 (25%)** | | |
| - 가독성 | 10% | PEP8, 타입 힌트 |
| - 모듈화 | 10% | 추상화, 재사용성 |
| - 에러 핸들링 | 5% | 예외 처리, 로깅 |
| **데이터 품질 (20%)** | | |
| - 검증 로직 | 10% | 다양한 검사 종류 |
| - 테스트 | 10% | 커버리지 80%+ |
| **운영 가능성 (20%)** | | |
| - 모니터링 | 10% | 알림, 메트릭 |
| - 문서화 | 10% | README, 가이드 |
| **발표 (15%)** | | |
| - 기술 설명력 | 5% | 명확한 전달 |
| - 데모 | 5% | 실행 가능한 시연 |
| - Q&A | 5% | 질문 대응력 |

## 🎯 제출 방법

### 1. GitHub Repository
\`\`\`bash
# 최종 커밋
git add .
git commit -m "feat: Phase 1 Capstone - E2E Data Pipeline complete"
git push origin main

# 태그 생성
git tag -a v1.0.0 -m "Phase 1 Capstone Project"
git push origin v1.0.0
\`\`\`

### 2. 제출 내용
- GitHub Repository URL
- 발표 슬라이드 (PDF)
- 데모 영상 (선택)

### 3. 마감일
- 코드 제출: Day 5 23:59
- 발표: Day 5 발표 세션

## 💡 마지막 점검

\`\`\`bash
# 1. 코드 포매팅
black src/ tests/
ruff check src/ tests/ --fix

# 2. 타입 체크
mypy src/

# 3. 테스트 실행
pytest tests/ -v --cov=e2e_pipeline

# 4. DAG 검증
python -c "from airflow.models import DagBag; db=DagBag('dags/'); print(db.import_errors)"

# 5. Docker 실행 확인
docker-compose up -d
docker-compose ps

# 6. 문서 최종 확인
cat README.md
\`\`\`

## 🏆 우수 프로젝트 기준

- 모든 체크리스트 완료
- 테스트 커버리지 90% 이상
- 추가 기능 구현 (예: 실시간 스트리밍, ML 연동)
- 창의적인 문제 해결
- 뛰어난 발표력

축하합니다! Phase 1을 완료했습니다! 🎉
`,
      externalLinks: [
        { title: 'Git Tagging', url: 'https://git-scm.com/book/en/v2/Git-Basics-Tagging' },
        { title: 'GitHub Releases', url: 'https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository' }
      ]
    }
  },
  {
    id: 'w8d5t4',
    title: '최종 프로젝트 퀴즈',
    type: 'quiz',
    duration: 15,
    content: {
      questions: [
        {
          question: 'Phase 1에서 배운 기술 스택 중 데이터 웨어하우스의 ACID 트랜잭션을 지원하는 것은?',
          options: [
            'Apache Spark',
            'Delta Lake',
            'Apache Airflow',
            'PostgreSQL'
          ],
          answer: 1,
          explanation: 'Delta Lake는 데이터 레이크에 ACID 트랜잭션을 제공하는 오픈소스 스토리지 레이어입니다. Spark와 함께 사용하여 신뢰성 있는 대규모 데이터 처리가 가능합니다.'
        },
        {
          question: 'E2E 파이프라인에서 Watermark의 역할은?',
          options: [
            '데이터 품질을 검증한다',
            '증분 추출의 시작점을 결정한다',
            '파이프라인 성능을 모니터링한다',
            '데이터를 암호화한다'
          ],
          answer: 1,
          explanation: 'Watermark는 마지막 성공 추출 시점을 기록하여, 다음 추출 시 변경분만 가져올 수 있게 합니다. 이를 통해 효율적인 증분 처리가 가능합니다.'
        },
        {
          question: 'Star Schema에서 SCD Type 2를 적용하는 테이블은?',
          options: [
            'Fact 테이블',
            'Dimension 테이블',
            'Staging 테이블',
            'Raw 테이블'
          ],
          answer: 1,
          explanation: 'SCD (Slowly Changing Dimension) Type 2는 Dimension 테이블에 적용되어, 차원 속성의 변경 이력을 새로운 행으로 추적합니다. Fact 테이블은 트랜잭션 데이터를 저장합니다.'
        },
        {
          question: 'Airflow에서 여러 DAG를 순차적으로 연결하는 가장 적합한 방법은?',
          options: [
            'PythonOperator 내에서 직접 호출',
            'TriggerDagRunOperator + wait_for_completion',
            'BashOperator로 airflow trigger_dag 실행',
            'SubDagOperator 사용'
          ],
          answer: 1,
          explanation: 'TriggerDagRunOperator에 wait_for_completion=True를 설정하면, 트리거된 DAG가 완료될 때까지 대기합니다. 이를 통해 DAG 간 의존성을 명확히 관리할 수 있습니다.'
        },
        {
          question: '데이터 품질 검사에서 "Freshness" 검사의 목적은?',
          options: [
            '데이터에 NULL 값이 없는지 확인',
            '데이터가 최신 상태인지 확인',
            '데이터에 중복이 없는지 확인',
            '데이터 타입이 올바른지 확인'
          ],
          answer: 1,
          explanation: 'Freshness 검사는 데이터의 최신 타임스탬프가 허용 범위 내인지 확인합니다. 예를 들어, 어제 날짜 데이터가 있어야 하는데 3일 전 데이터만 있다면 문제가 있는 것입니다.'
        }
      ]
    }
  },
  {
    id: 'w8d5t5',
    title: 'Phase 1 회고 & 다음 단계',
    type: 'reading',
    duration: 15,
    content: {
      markdown: `# Phase 1 회고 & 다음 단계

## 🎉 축하합니다!

**Phase 1: 데이터 엔지니어링 기초**를 성공적으로 완료했습니다!

8주간의 여정을 통해 데이터 엔지니어링의 핵심 역량을 갖추게 되었습니다.

## 📚 Phase 1 학습 요약

### Week 1: Python 심화
- Iterator, Generator, Decorator
- Context Manager, 비동기 프로그래밍
- 코드 품질 도구 (Black, Ruff, mypy)

### Week 2: Pandas & 데이터 처리
- DataFrame 고급 활용
- 시계열 분석, 피벗, 멀티인덱스
- 대용량 데이터 처리 기법

### Week 3: SQL 심화
- Window Functions, CTE
- 쿼리 최적화, 실행 계획
- 복잡한 분석 쿼리

### Week 4: 데이터 모델링
- 정규화, 비정규화
- Star Schema, Snowflake Schema
- SCD (Slowly Changing Dimension)

### Week 5-6: Apache Spark
- DataFrame API, Catalyst Optimizer
- Structured Streaming, Delta Lake
- 성능 튜닝, Spark UI 분석

### Week 7: Apache Airflow
- DAG 설계, Operators
- TaskFlow API, XCom
- 스케줄링, 에러 핸들링

### Week 8: E2E Pipeline Project
- 전체 파이프라인 설계 및 구현
- 데이터 품질 관리
- 문서화 및 발표

## 🛠️ 습득한 기술 스택

\`\`\`
Programming:    Python, SQL
Processing:     Pandas, PySpark, Delta Lake
Orchestration:  Apache Airflow
Storage:        PostgreSQL, S3, Delta Lake
Quality:        Great Expectations, Custom Validators
DevOps:         Docker, GitHub Actions, pytest
\`\`\`

## 🎯 다음 단계: Phase 2 Preview

### Phase 2: ML & 데이터 분석 (8주)

| Week | 주제 |
|------|------|
| 1 | 통계 기초 & EDA |
| 2 | Feature Engineering |
| 3 | 지도 학습 (Classification, Regression) |
| 4 | 비지도 학습 (Clustering, Dimensionality Reduction) |
| 5 | MLflow & 모델 관리 |
| 6 | 모델 서빙 & API |
| 7 | A/B 테스트 & 인과 추론 |
| 8 | ML Pipeline Project |

### Phase 2에서 배울 내용
- Scikit-learn, XGBoost, LightGBM
- MLflow 실험 추적
- FastAPI 모델 서빙
- Feature Store 구축

## 💪 계속 성장하기

### 권장 학습 자료
1. **책**: "Designing Data-Intensive Applications" - Martin Kleppmann
2. **책**: "Fundamentals of Data Engineering" - Joe Reis & Matt Housley
3. **강의**: Databricks Academy (무료 코스)
4. **자격증**: Databricks Data Engineer Associate

### 커뮤니티
- Apache Airflow Slack
- Delta Lake GitHub Discussions
- 한국 데이터 엔지니어 커뮤니티

### 실전 경험
- 개인 프로젝트 (공개 데이터셋 활용)
- 오픈소스 기여 (Airflow, Spark)
- 블로그 작성 (학습 내용 정리)

## 🏆 Phase 1 인증

Phase 1 캡스톤 프로젝트를 성공적으로 완료하면 다음을 획득합니다:

- **Phase 1 수료 배지**: Data Engineering Foundations
- **GitHub 인증**: 포트폴리오 프로젝트
- **Phase 2 접근 권한**: ML & 데이터 분석 과정

## 💬 피드백

Phase 1 경험을 공유해주세요:
- 가장 도움이 되었던 내용
- 어려웠던 부분
- 개선 제안

피드백은 커리큘럼 개선에 반영됩니다.

---

**수고하셨습니다! Phase 2에서 다시 만나요! 🚀**
`,
      externalLinks: [
        { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/' },
        { title: 'Databricks Academy', url: 'https://www.databricks.com/learn/training/home' },
        { title: 'Apache Airflow Slack', url: 'https://apache-airflow.slack.com/' }
      ]
    }
  },
  {
    id: 'w8d5-challenge',
    type: 'challenge',
    title: '주간 도전과제: 실시간 스트리밍 파이프라인 확장',
    duration: 60,
    content: {
      instructions: `# 주간 도전과제: 실시간 스트리밍 파이프라인 확장

## 🎯 목표
Phase 1에서 배운 **배치 처리 파이프라인**을 **실시간 스트리밍**으로 확장하세요. Spark Structured Streaming과 Kafka를 활용하여 이벤트가 발생하는 즉시 처리되는 Near Real-Time 파이프라인을 구축합니다.

## 📊 시나리오
기존 Daily Batch 파이프라인에 더해 다음 요구사항이 추가되었습니다:
- **실시간 대시보드**: 운영팀이 분 단위로 핵심 지표를 모니터링
- **실시간 알림**: 이상 행동(높은 오류율, 급격한 트래픽 증가) 즉시 감지
- **Fresh Data**: 데이터 레이턴시를 24시간에서 5분 이내로 단축

## 📋 요구사항

### Part 1: 스트리밍 인프라 (20점)
1. **Kafka 설정**
   - 토픽 설계 (events, users, payments)
   - 파티션 전략 (user_id 기준)
   - Retention 설정

2. **Producer 구현**
   - 기존 Extractor를 Kafka Producer로 변환
   - JSON 직렬화
   - 에러 핸들링 (재시도, DLQ)

### Part 2: Spark Structured Streaming (30점)
1. **스트림 소비**
   - Kafka Source 설정
   - Checkpoint 관리
   - Trigger 설정 (processingTime)

2. **스트림 변환**
   - 이벤트 파싱 및 정제
   - Watermark 설정 (late data 처리)
   - 윈도우 집계 (5분 단위)

3. **싱크 설정**
   - Delta Lake로 스트리밍 쓰기
   - 실시간 메트릭 Redis 저장
   - 알림 트리거 (임계치 초과 시)

### Part 3: Lambda Architecture 통합 (25점)
1. **Batch + Streaming 통합**
   - Batch Layer: 기존 Daily Pipeline (정확성)
   - Speed Layer: 실시간 Pipeline (속도)
   - Serving Layer: 두 결과 병합 View

2. **데이터 일관성**
   - Exactly-once 보장 전략
   - Late Data 처리 로직
   - 배치/스트리밍 결과 비교 검증

### Part 4: 모니터링 & 운영 (25점)
1. **스트리밍 메트릭**
   - 처리량 (records/sec)
   - 지연 시간 (end-to-end latency)
   - Consumer Lag

2. **알림 설정**
   - 처리 지연 알림
   - 오류율 임계치 알림
   - Kafka Consumer Lag 알림

3. **운영 대시보드**
   - Spark Streaming UI 설정
   - Kafka Metrics 모니터링
   - 실시간 데이터 품질 지표

## 🏆 평가 기준

| 항목 | 배점 | 세부 기준 |
|------|------|-----------|
| 스트리밍 인프라 | 20점 | Kafka 설정(10), Producer(10) |
| Structured Streaming | 30점 | 스트림 변환(15), Watermark/Window(15) |
| Lambda Architecture | 25점 | 통합 설계(15), 일관성(10) |
| 모니터링 & 운영 | 25점 | 메트릭(15), 알림(10) |

## 💡 힌트

### Kafka Docker Compose
\`\`\`yaml
# docker-compose.streaming.yml
version: '3'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  kafka:
    image: confluentinc/cp-kafka:7.4.0
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
\`\`\`

### Kafka Producer 예시
\`\`\`python
from confluent_kafka import Producer
import json

def delivery_report(err, msg):
    if err is not None:
        print(f"Delivery failed: {err}")
    else:
        print(f"Message delivered to {msg.topic()} [{msg.partition()}]")

producer = Producer({'bootstrap.servers': 'localhost:9092'})

# 이벤트 발행
event = {"user_id": 123, "event_type": "page_view", "timestamp": "2024-01-01T10:00:00Z"}
producer.produce(
    topic='events',
    key=str(event['user_id']),
    value=json.dumps(event),
    callback=delivery_report
)
producer.flush()
\`\`\`

### Spark Structured Streaming
\`\`\`python
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *

spark = SparkSession.builder \\
    .appName("StreamingPipeline") \\
    .config("spark.sql.streaming.schemaInference", "true") \\
    .getOrCreate()

# Kafka 소스
events_df = spark.readStream \\
    .format("kafka") \\
    .option("kafka.bootstrap.servers", "localhost:9092") \\
    .option("subscribe", "events") \\
    .option("startingOffsets", "latest") \\
    .load()

# JSON 파싱
event_schema = StructType([
    StructField("user_id", IntegerType()),
    StructField("event_type", StringType()),
    StructField("timestamp", TimestampType())
])

parsed_df = events_df \\
    .select(from_json(col("value").cast("string"), event_schema).alias("data")) \\
    .select("data.*")

# Watermark 설정 (5분 지연 허용)
watermarked_df = parsed_df \\
    .withWatermark("timestamp", "5 minutes")

# 5분 윈도우 집계
windowed_counts = watermarked_df \\
    .groupBy(
        window(col("timestamp"), "5 minutes"),
        col("event_type")
    ) \\
    .count()

# Delta Lake로 스트리밍 쓰기
query = windowed_counts.writeStream \\
    .format("delta") \\
    .outputMode("append") \\
    .option("checkpointLocation", "/tmp/checkpoint/events") \\
    .trigger(processingTime="1 minute") \\
    .start("/data/streaming/event_counts")

query.awaitTermination()
\`\`\`

### 실시간 알림 예시
\`\`\`python
def alert_on_threshold(batch_df, batch_id):
    """배치마다 실행되는 알림 로직"""
    error_rate = batch_df.filter(col("event_type") == "error").count() / batch_df.count()

    if error_rate > 0.05:  # 5% 초과 시 알림
        send_slack_alert(f"High error rate detected: {error_rate:.2%}")

# foreachBatch로 커스텀 로직 실행
query = parsed_df.writeStream \\
    .foreachBatch(alert_on_threshold) \\
    .trigger(processingTime="1 minute") \\
    .start()
\`\`\`

## 🔗 참고 자료
- [Spark Structured Streaming](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html)
- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [Delta Lake Streaming](https://docs.delta.io/latest/delta-streaming.html)
- [Lambda Architecture](http://lambda-architecture.net/)
`,
      starterCode: `"""
Week 8 도전과제: 실시간 스트리밍 파이프라인 확장
===============================================
목표: 배치 파이프라인을 실시간 스트리밍으로 확장
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
from typing import Dict, Any
import json

# ===========================================
# Part 1: Kafka Producer
# ===========================================

class EventProducer:
    """이벤트를 Kafka로 발행하는 Producer"""

    def __init__(self, bootstrap_servers: str = "localhost:9092"):
        self.bootstrap_servers = bootstrap_servers
        self.producer = None

    def connect(self):
        """Kafka 연결"""
        # TODO: confluent_kafka Producer 초기화
        pass

    def send_event(self, topic: str, event: Dict[str, Any]):
        """이벤트 발행"""
        # TODO: JSON 직렬화 및 Kafka 발행
        pass

    def close(self):
        """연결 종료"""
        # TODO: flush 및 연결 종료
        pass

# ===========================================
# Part 2: Spark Structured Streaming
# ===========================================

class StreamingPipeline:
    """Spark Structured Streaming 파이프라인"""

    EVENT_SCHEMA = StructType([
        StructField("user_id", IntegerType(), True),
        StructField("event_type", StringType(), True),
        StructField("page_url", StringType(), True),
        StructField("session_id", StringType(), True),
        StructField("timestamp", TimestampType(), True)
    ])

    def __init__(self, spark: SparkSession, kafka_servers: str = "localhost:9092"):
        self.spark = spark
        self.kafka_servers = kafka_servers
        self.stream = None

    def read_kafka_stream(self, topic: str):
        """Kafka 스트림 읽기"""
        # TODO: Kafka Source 설정
        # - subscribe
        # - startingOffsets
        pass

    def parse_events(self, df):
        """JSON 파싱 및 스키마 적용"""
        # TODO: from_json으로 파싱
        pass

    def add_watermark(self, df, delay: str = "5 minutes"):
        """Watermark 설정"""
        # TODO: withWatermark 적용
        pass

    def aggregate_by_window(self, df, window_duration: str = "5 minutes"):
        """윈도우 집계"""
        # TODO: window 함수로 집계
        pass

    def write_to_delta(self, df, path: str, checkpoint: str):
        """Delta Lake로 스트리밍 쓰기"""
        # TODO: writeStream 설정
        pass

# ===========================================
# Part 3: 실시간 알림
# ===========================================

class AlertManager:
    """실시간 알림 관리"""

    def __init__(self, error_threshold: float = 0.05):
        self.error_threshold = error_threshold
        self.alerts = []

    def check_error_rate(self, batch_df, batch_id: int):
        """오류율 체크 및 알림"""
        # TODO: 오류율 계산 및 임계치 초과 시 알림
        pass

    def check_traffic_spike(self, batch_df, batch_id: int, spike_threshold: float = 2.0):
        """트래픽 급증 감지"""
        # TODO: 이전 윈도우 대비 급증 감지
        pass

    def send_alert(self, message: str, severity: str = "warning"):
        """알림 발송"""
        # TODO: Slack/이메일 알림 발송
        print(f"[{severity.upper()}] {message}")
        self.alerts.append({"message": message, "severity": severity})

# ===========================================
# Part 4: Lambda Architecture 통합
# ===========================================

class LambdaArchitecture:
    """Lambda Architecture 통합 레이어"""

    def __init__(self, spark: SparkSession):
        self.spark = spark

    def merge_batch_and_stream(self, batch_path: str, stream_path: str):
        """배치와 스트리밍 결과 병합"""
        # TODO: UNION 또는 MERGE 로직
        pass

    def create_serving_view(self, view_name: str):
        """서빙 레이어 View 생성"""
        # TODO: 최신 데이터 우선 View
        pass

    def validate_consistency(self, batch_df, stream_df):
        """배치/스트리밍 일관성 검증"""
        # TODO: 결과 비교 로직
        pass

# ===========================================
# Part 5: 메트릭 수집
# ===========================================

class StreamingMetrics:
    """스트리밍 메트릭 수집"""

    def __init__(self):
        self.metrics = {}

    def collect_from_query(self, query):
        """StreamingQuery에서 메트릭 수집"""
        # TODO: lastProgress에서 메트릭 추출
        pass

    def get_processing_rate(self) -> float:
        """처리율 (records/sec)"""
        # TODO: inputRowsPerSecond 반환
        pass

    def get_latency(self) -> float:
        """처리 지연 시간 (ms)"""
        # TODO: triggerExecution 시간 반환
        pass

    def report(self) -> Dict[str, Any]:
        """메트릭 리포트"""
        return self.metrics

# ===========================================
# 메인 실행
# ===========================================

def create_spark_session():
    """스트리밍용 Spark 세션 생성"""
    return SparkSession.builder \\
        .appName("StreamingChallenge") \\
        .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
        .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
        .config("spark.sql.streaming.schemaInference", "true") \\
        .master("local[*]") \\
        .getOrCreate()


if __name__ == "__main__":
    print("=" * 60)
    print("실시간 스트리밍 파이프라인 도전과제")
    print("=" * 60)

    # Spark 세션 생성
    spark = create_spark_session()

    # 스트리밍 파이프라인 초기화
    pipeline = StreamingPipeline(spark)

    # 알림 관리자 초기화
    alert_manager = AlertManager(error_threshold=0.05)

    # 메트릭 수집기 초기화
    metrics = StreamingMetrics()

    # TODO: 파이프라인 실행 로직 구현
    # 1. Kafka 스트림 읽기
    # 2. 이벤트 파싱 및 변환
    # 3. 윈도우 집계
    # 4. Delta Lake 쓰기
    # 5. 알림 설정
    # 6. 메트릭 수집

    print("\\n파이프라인이 시작되면 Kafka 메시지를 기다립니다...")
`,
      hints: [
        'withWatermark는 groupBy 전에 적용해야 함',
        'foreachBatch로 배치마다 커스텀 로직 실행 가능',
        'checkpointLocation은 스트리밍 쿼리마다 고유해야 함',
        'outputMode: append는 새 데이터만, complete는 전체 결과',
        'trigger(processingTime="1 minute")로 처리 주기 설정',
        'Kafka Consumer Lag는 토픽 offset 차이로 계산'
      ]
    }
  }
]
