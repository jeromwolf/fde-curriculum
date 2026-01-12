import { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'w8d1t1',
    title: 'Phase 1 종합 프로젝트 소개',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: '',
      transcript: `# Phase 1 종합 프로젝트: E2E 데이터 파이프라인

## 🎯 프로젝트 목표

지난 7주간 배운 모든 기술을 통합하여 **실제 운영 환경 수준의 End-to-End 데이터 파이프라인**을 구축합니다.

이 프로젝트는 Phase 1의 모든 역량을 검증하는 **캡스톤 프로젝트**입니다.

## 📚 활용 기술 스택

| Week | 기술 | 프로젝트 적용 |
|------|------|--------------|
| Week 1 | Python 심화 | 데이터 처리 로직, 클래스 설계 |
| Week 2 | Pandas | 데이터 정제, 변환 |
| Week 3 | SQL 심화 | 데이터 모델 쿼리, 분석 |
| Week 4 | 데이터 모델링 | Star Schema, SCD |
| Week 5-6 | Spark | 대용량 배치 처리 |
| Week 7 | Airflow | 파이프라인 오케스트레이션 |

## 🏢 비즈니스 시나리오

**스타트업 A사의 데이터 플랫폼 구축**

A사는 빠르게 성장하는 SaaS 스타트업입니다:
- 월간 활성 사용자 (MAU): 50만 명
- 일일 이벤트 데이터: 1억 건
- 데이터 소스: PostgreSQL, MongoDB, REST API, S3 로그

**현재 문제점:**
- 수동 데이터 추출 → 분석 지연
- 데이터 품질 이슈 빈번
- 부서별 데이터 사일로
- 리포팅 자동화 부재

**프로젝트 목표:**
- 자동화된 ETL 파이프라인 구축
- 데이터 웨어하우스 구현
- 실시간 대시보드 데이터 제공
- 데이터 품질 모니터링

## 📊 데이터 도메인

### 1. 사용자 데이터 (PostgreSQL)
\`\`\`sql
-- users 테이블
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(100),
    plan_type VARCHAR(20),  -- free, pro, enterprise
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- subscriptions 테이블
CREATE TABLE subscriptions (
    subscription_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users,
    plan_type VARCHAR(20),
    start_date DATE,
    end_date DATE,
    mrr DECIMAL(10,2),  -- Monthly Recurring Revenue
    status VARCHAR(20)
);
\`\`\`

### 2. 이벤트 데이터 (S3 JSON 로그)
\`\`\`json
{
  "event_id": "evt_abc123",
  "user_id": 12345,
  "event_type": "page_view",
  "page": "/dashboard",
  "timestamp": "2024-01-15T10:30:00Z",
  "properties": {
    "device": "desktop",
    "browser": "chrome",
    "country": "KR"
  }
}
\`\`\`

### 3. 결제 데이터 (REST API)
\`\`\`json
{
  "payment_id": "pay_xyz789",
  "user_id": 12345,
  "amount": 29000,
  "currency": "KRW",
  "status": "completed",
  "created_at": "2024-01-15T10:35:00Z"
}
\`\`\`

## 🏗️ 목표 아키텍처

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                         Data Sources                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │PostgreSQL│  │  S3 Logs │  │ REST API │  │ MongoDB  │         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
└───────┼─────────────┼─────────────┼─────────────┼───────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Ingestion Layer                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Apache Airflow                         │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │   │
│  │  │ Extract │  │ Extract │  │ Extract │  │ Extract │      │   │
│  │  │  Users  │  │  Events │  │Payments │  │  Docs   │      │   │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘      │   │
│  └───────┼────────────┼────────────┼────────────┼───────────┘   │
└──────────┼────────────┼────────────┼────────────┼───────────────┘
           │            │            │            │
           ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Raw Data Lake                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    S3 / Delta Lake                        │   │
│  │  raw/users/  raw/events/  raw/payments/  raw/documents/  │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Transformation Layer                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Apache Spark                           │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │   │
│  │  │ Cleanse │  │ Dedupe  │  │  Join   │  │ Compute │      │   │
│  │  │  Data   │  │  Data   │  │  Data   │  │ Metrics │      │   │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘      │   │
│  └───────┼────────────┼────────────┼────────────┼───────────┘   │
└──────────┼────────────┼────────────┼────────────┼───────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Warehouse                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 Star Schema (Delta Lake)                  │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │   │
│  │  │dim_user │  │dim_date │  │dim_plan │  │fact_    │      │   │
│  │  │         │  │         │  │         │  │events   │      │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Marts                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Marketing  │  │   Product   │  │   Finance   │              │
│  │    Mart     │  │    Mart     │  │    Mart     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

## 📅 5일 프로젝트 일정

| Day | 주제 | 산출물 |
|-----|------|--------|
| Day 1 | 프로젝트 설계 | 아키텍처 문서, ERD, 프로젝트 구조 |
| Day 2 | 데이터 수집 | Extraction DAG, Raw Layer 구현 |
| Day 3 | 데이터 변환 | Spark 변환 로직, DW 스키마 |
| Day 4 | 오케스트레이션 | 통합 DAG, 모니터링, 알림 |
| Day 5 | 테스트 & 발표 | 테스트 코드, 문서화, 발표 자료 |

## 🏆 평가 기준

| 항목 | 배점 | 세부 기준 |
|------|------|----------|
| 아키텍처 | 20% | 확장성, 유지보수성, 모범 사례 적용 |
| 코드 품질 | 25% | 가독성, 모듈화, 에러 핸들링 |
| 데이터 품질 | 20% | 검증 로직, 테스트 커버리지 |
| 운영 가능성 | 20% | 모니터링, 알림, 문서화 |
| 발표 | 15% | 기술 설명력, 데모, Q&A |

자, 이제 시작해봅시다! 🚀
`,
      objectives: [
        'E2E 데이터 파이프라인의 전체 구조를 이해한다',
        'Phase 1에서 배운 기술들이 어떻게 통합되는지 파악한다',
        '비즈니스 요구사항을 기술 아키텍처로 변환하는 방법을 익힌다'
      ],
      keyPoints: [
        'E2E 파이프라인은 Extract → Transform → Load → Serve의 흐름',
        '각 레이어는 명확한 책임을 가지며 독립적으로 확장 가능해야 함',
        '데이터 품질과 모니터링은 처음부터 설계에 포함되어야 함'
      ]
    }
  },
  {
    id: 'w8d1t2',
    title: '데이터 웨어하우스 스키마 설계',
    type: 'reading',
    duration: 30,
    content: {
      markdown: `# 데이터 웨어하우스 스키마 설계

## 🎯 설계 원칙

### Kimball 방법론 적용
- **비즈니스 프로세스 중심**: 사용자 행동, 결제, 구독
- **차원 모델링**: Star Schema 기반
- **점진적 구축**: 핵심 지표부터 시작

## 📊 Star Schema 설계

### Fact Tables

#### 1. fact_events (이벤트 팩트)
\`\`\`sql
CREATE TABLE fact_events (
    event_sk BIGINT,              -- Surrogate Key
    event_id VARCHAR(50),         -- Natural Key
    user_sk BIGINT,               -- FK to dim_user
    date_sk INTEGER,              -- FK to dim_date (YYYYMMDD)
    time_sk INTEGER,              -- FK to dim_time (HHMM)
    event_type_sk INTEGER,        -- FK to dim_event_type
    page_sk INTEGER,              -- FK to dim_page
    device_sk INTEGER,            -- FK to dim_device

    -- Measures
    session_duration_seconds INTEGER,
    page_views INTEGER DEFAULT 1,

    -- Metadata
    event_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 파티셔닝: 날짜 기준
-- 인덱싱: user_sk, event_type_sk
\`\`\`

#### 2. fact_subscriptions (구독 팩트)
\`\`\`sql
CREATE TABLE fact_subscriptions (
    subscription_sk BIGINT,
    subscription_id VARCHAR(50),
    user_sk BIGINT,
    plan_sk INTEGER,              -- FK to dim_plan
    start_date_sk INTEGER,
    end_date_sk INTEGER,

    -- Measures
    mrr DECIMAL(10,2),            -- Monthly Recurring Revenue
    arr DECIMAL(12,2),            -- Annual Recurring Revenue
    subscription_months INTEGER,

    -- Status
    status VARCHAR(20),           -- active, cancelled, expired
    churn_reason VARCHAR(100),

    -- Metadata
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
\`\`\`

#### 3. fact_payments (결제 팩트)
\`\`\`sql
CREATE TABLE fact_payments (
    payment_sk BIGINT,
    payment_id VARCHAR(50),
    user_sk BIGINT,
    date_sk INTEGER,
    plan_sk INTEGER,

    -- Measures
    amount DECIMAL(10,2),
    amount_usd DECIMAL(10,2),     -- 환산 금액
    discount_amount DECIMAL(10,2),
    tax_amount DECIMAL(10,2),

    -- Attributes
    currency VARCHAR(3),
    payment_method VARCHAR(20),
    status VARCHAR(20),

    -- Metadata
    payment_timestamp TIMESTAMP,
    created_at TIMESTAMP
);
\`\`\`

### Dimension Tables

#### 1. dim_user (사용자 차원) - SCD Type 2
\`\`\`sql
CREATE TABLE dim_user (
    user_sk BIGINT,               -- Surrogate Key
    user_id INTEGER,              -- Natural Key

    -- Attributes
    email VARCHAR(255),
    name VARCHAR(100),
    signup_source VARCHAR(50),
    country VARCHAR(50),
    timezone VARCHAR(50),

    -- Current Plan (denormalized)
    current_plan VARCHAR(20),

    -- Derived Attributes
    user_segment VARCHAR(20),     -- new, active, power, churned
    lifetime_value DECIMAL(12,2),

    -- SCD Type 2 Columns
    effective_date DATE,
    expiration_date DATE,
    is_current BOOLEAN,

    -- Metadata
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
\`\`\`

#### 2. dim_date (날짜 차원)
\`\`\`sql
CREATE TABLE dim_date (
    date_sk INTEGER PRIMARY KEY,  -- YYYYMMDD
    full_date DATE,

    -- Calendar Attributes
    year INTEGER,
    quarter INTEGER,
    month INTEGER,
    month_name VARCHAR(20),
    week_of_year INTEGER,
    day_of_month INTEGER,
    day_of_week INTEGER,
    day_name VARCHAR(20),

    -- Fiscal Calendar (Optional)
    fiscal_year INTEGER,
    fiscal_quarter INTEGER,

    -- Flags
    is_weekend BOOLEAN,
    is_holiday BOOLEAN,
    holiday_name VARCHAR(100)
);
\`\`\`

#### 3. dim_plan (구독 플랜 차원)
\`\`\`sql
CREATE TABLE dim_plan (
    plan_sk INTEGER PRIMARY KEY,
    plan_code VARCHAR(20),

    -- Attributes
    plan_name VARCHAR(50),
    plan_tier VARCHAR(20),        -- free, starter, pro, enterprise
    monthly_price DECIMAL(10,2),
    annual_price DECIMAL(10,2),

    -- Features (JSON or columns)
    max_users INTEGER,
    max_storage_gb INTEGER,
    features JSONB,

    -- Status
    is_active BOOLEAN,

    -- Metadata
    effective_date DATE,
    created_at TIMESTAMP
);
\`\`\`

#### 4. dim_event_type (이벤트 유형 차원)
\`\`\`sql
CREATE TABLE dim_event_type (
    event_type_sk INTEGER PRIMARY KEY,
    event_type_code VARCHAR(50),

    -- Hierarchy
    event_category VARCHAR(50),   -- page_view, click, form, system
    event_subcategory VARCHAR(50),

    -- Attributes
    event_name VARCHAR(100),
    description TEXT,
    is_conversion BOOLEAN,
    conversion_value DECIMAL(10,2),

    -- Metadata
    created_at TIMESTAMP
);
\`\`\`

## 📈 집계 테이블 (Data Marts)

### 1. agg_daily_user_metrics
\`\`\`sql
CREATE TABLE agg_daily_user_metrics (
    date_sk INTEGER,
    user_sk BIGINT,

    -- Engagement Metrics
    page_views INTEGER,
    unique_sessions INTEGER,
    total_session_duration_seconds INTEGER,
    events_count INTEGER,

    -- Feature Usage
    feature_a_usage INTEGER,
    feature_b_usage INTEGER,

    -- Computed
    avg_session_duration DECIMAL(10,2),
    engagement_score DECIMAL(5,2),

    PRIMARY KEY (date_sk, user_sk)
);
\`\`\`

### 2. agg_daily_revenue
\`\`\`sql
CREATE TABLE agg_daily_revenue (
    date_sk INTEGER PRIMARY KEY,

    -- Revenue Metrics
    total_revenue DECIMAL(12,2),
    new_mrr DECIMAL(12,2),
    churned_mrr DECIMAL(12,2),
    net_mrr_change DECIMAL(12,2),

    -- Customer Metrics
    total_paying_users INTEGER,
    new_subscriptions INTEGER,
    churned_subscriptions INTEGER,

    -- Plan Breakdown
    free_users INTEGER,
    pro_users INTEGER,
    enterprise_users INTEGER,

    -- Computed
    arpu DECIMAL(10,2),           -- Average Revenue Per User
    conversion_rate DECIMAL(5,4)
);
\`\`\`

### 3. agg_cohort_retention
\`\`\`sql
CREATE TABLE agg_cohort_retention (
    cohort_month DATE,            -- 가입 월
    months_since_signup INTEGER,  -- 0, 1, 2, ...

    -- Cohort Size
    cohort_size INTEGER,

    -- Retention Metrics
    retained_users INTEGER,
    retention_rate DECIMAL(5,4),

    -- Revenue Metrics
    cohort_revenue DECIMAL(12,2),
    revenue_per_user DECIMAL(10,2),

    PRIMARY KEY (cohort_month, months_since_signup)
);
\`\`\`

## 🔄 데이터 흐름

\`\`\`
Raw Layer (S3)
    │
    ▼
Staging Layer (Spark)
    ├── stg_users
    ├── stg_events
    ├── stg_payments
    └── stg_subscriptions
    │
    ▼
Intermediate Layer (Spark)
    ├── int_users_deduplicated
    ├── int_events_enriched
    └── int_payments_validated
    │
    ▼
Dimensional Layer (Delta Lake)
    ├── dim_user (SCD Type 2)
    ├── dim_date
    ├── dim_plan
    └── dim_event_type
    │
    ▼
Fact Layer (Delta Lake)
    ├── fact_events
    ├── fact_subscriptions
    └── fact_payments
    │
    ▼
Aggregation Layer (Delta Lake)
    ├── agg_daily_user_metrics
    ├── agg_daily_revenue
    └── agg_cohort_retention
\`\`\`

## ✅ 스키마 검증 체크리스트

- [ ] 모든 Fact 테이블이 Date Dimension을 참조하는가?
- [ ] Surrogate Key가 일관되게 사용되는가?
- [ ] SCD Type 2가 필요한 차원에 적용되었는가?
- [ ] 집계 테이블이 주요 비즈니스 질문에 답할 수 있는가?
- [ ] 파티셔닝 전략이 쿼리 패턴에 맞는가?
`,
      externalLinks: [
        { title: 'Kimball Group - Dimensional Modeling', url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/' },
        { title: 'Star Schema Best Practices', url: 'https://docs.getdbt.com/guides/best-practices/how-we-structure/4-marts' }
      ]
    }
  },
  {
    id: 'w8d1t3',
    title: '프로젝트 구조 설정',
    type: 'code',
    duration: 35,
    content: {
      instructions: `## 프로젝트 구조 설정

E2E 파이프라인 프로젝트의 디렉토리 구조를 설정합니다.
모범 사례를 따르는 구조로 확장성과 유지보수성을 확보합니다.

### 구현 요구사항

1. **디렉토리 구조 생성**
   - 레이어별 명확한 분리
   - 테스트, 설정, 문서 분리

2. **설정 파일 작성**
   - pyproject.toml / requirements.txt
   - Docker Compose
   - 환경 변수 템플릿

3. **공통 유틸리티**
   - 로깅 설정
   - 설정 관리
   - 에러 핸들링

### 테스트 방법

\`\`\`bash
# 프로젝트 구조 확인
tree -L 3 e2e_pipeline/

# 의존성 설치
pip install -e .

# 설정 테스트
python -c "from e2e_pipeline.config import settings; print(settings)"
\`\`\`
`,
      starterCode: `# 프로젝트 구조 생성 스크립트
# setup_project.py

import os
from pathlib import Path

PROJECT_ROOT = Path("e2e_pipeline")

# 디렉토리 구조 정의
DIRECTORIES = [
    # 메인 소스 코드
    "src/e2e_pipeline",
    "src/e2e_pipeline/extractors",
    "src/e2e_pipeline/transformers",
    "src/e2e_pipeline/loaders",
    "src/e2e_pipeline/utils",
    "src/e2e_pipeline/models",

    # Airflow DAGs
    "dags",

    # Spark Jobs
    "spark_jobs",

    # SQL 스크립트
    "sql/ddl",
    "sql/dml",
    "sql/queries",

    # 설정 파일
    "config",

    # 테스트
    "tests/unit",
    "tests/integration",
    "tests/fixtures",

    # 문서
    "docs",

    # 스크립트
    "scripts",
]

def create_project_structure():
    """프로젝트 디렉토리 구조 생성"""
    # TODO: 디렉토리 생성
    pass

def create_init_files():
    """__init__.py 파일 생성"""
    # TODO: Python 패키지 초기화 파일 생성
    pass

def create_config_files():
    """설정 파일 생성"""
    # TODO: pyproject.toml, docker-compose.yml 등 생성
    pass

def create_utility_modules():
    """공통 유틸리티 모듈 생성"""
    # TODO: config.py, logger.py, exceptions.py 생성
    pass


if __name__ == "__main__":
    create_project_structure()
    create_init_files()
    create_config_files()
    create_utility_modules()
    print("✅ Project structure created successfully!")
`,
      solutionCode: `# 프로젝트 구조 생성 스크립트
# setup_project.py

import os
from pathlib import Path

PROJECT_ROOT = Path("e2e_pipeline")

# 디렉토리 구조 정의
DIRECTORIES = [
    # 메인 소스 코드
    "src/e2e_pipeline",
    "src/e2e_pipeline/extractors",
    "src/e2e_pipeline/transformers",
    "src/e2e_pipeline/loaders",
    "src/e2e_pipeline/utils",
    "src/e2e_pipeline/models",
    "src/e2e_pipeline/validators",

    # Airflow DAGs
    "dags",
    "dags/utils",

    # Spark Jobs
    "spark_jobs/batch",
    "spark_jobs/streaming",

    # SQL 스크립트
    "sql/ddl",
    "sql/dml",
    "sql/queries",

    # 설정 파일
    "config/environments",

    # 테스트
    "tests/unit/extractors",
    "tests/unit/transformers",
    "tests/unit/loaders",
    "tests/integration",
    "tests/fixtures",

    # 문서
    "docs/architecture",
    "docs/runbooks",

    # 스크립트
    "scripts",

    # 데이터 (로컬 개발용)
    "data/raw",
    "data/processed",
]


def create_project_structure():
    """프로젝트 디렉토리 구조 생성"""
    for directory in DIRECTORIES:
        dir_path = PROJECT_ROOT / directory
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"Created: {dir_path}")


def create_init_files():
    """__init__.py 파일 생성"""
    python_dirs = [d for d in DIRECTORIES if "src/" in d or "tests/" in d]

    for directory in python_dirs:
        init_path = PROJECT_ROOT / directory / "__init__.py"
        if not init_path.exists():
            init_path.touch()
            print(f"Created: {init_path}")


def create_config_files():
    """설정 파일 생성"""

    # pyproject.toml
    pyproject_content = '''[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "e2e_pipeline"
version = "0.1.0"
description = "End-to-End Data Pipeline for SaaS Analytics"
readme = "README.md"
requires-python = ">=3.9"
license = {text = "MIT"}
authors = [
    {name = "Data Team", email = "data-team@company.com"}
]

dependencies = [
    "pyspark>=3.4.0",
    "apache-airflow>=2.8.0",
    "pandas>=2.0.0",
    "numpy>=1.24.0",
    "pyarrow>=14.0.0",
    "delta-spark>=2.4.0",
    "psycopg2-binary>=2.9.0",
    "boto3>=1.28.0",
    "requests>=2.31.0",
    "pydantic>=2.0.0",
    "pydantic-settings>=2.0.0",
    "python-dotenv>=1.0.0",
    "structlog>=23.1.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "pytest-cov>=4.1.0",
    "pytest-mock>=3.11.0",
    "black>=23.7.0",
    "ruff>=0.0.280",
    "mypy>=1.4.0",
    "pre-commit>=3.3.0",
]

[tool.setuptools.packages.find]
where = ["src"]

[tool.black]
line-length = 88
target-version = ["py39", "py310", "py311"]

[tool.ruff]
line-length = 88
select = ["E", "F", "I", "N", "W"]

[tool.mypy]
python_version = "3.11"
warn_return_any = true
warn_unused_configs = true

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-v --cov=e2e_pipeline --cov-report=term-missing"
'''

    pyproject_path = PROJECT_ROOT / "pyproject.toml"
    pyproject_path.write_text(pyproject_content)
    print(f"Created: {pyproject_path}")

    # docker-compose.yml
    docker_compose_content = '''version: '3.8'

x-airflow-common: &airflow-common
  build:
    context: .
    dockerfile: Dockerfile.airflow
  environment:
    - AIRFLOW__CORE__EXECUTOR=LocalExecutor
    - AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql+psycopg2://airflow:airflow@postgres/airflow
    - AIRFLOW__CORE__FERNET_KEY=your-fernet-key-here
    - AIRFLOW__CORE__LOAD_EXAMPLES=false
    - AIRFLOW__WEBSERVER__SECRET_KEY=your-secret-key-here
    - AWS_ACCESS_KEY_ID=minioadmin
    - AWS_SECRET_ACCESS_KEY=minioadmin
    - AWS_ENDPOINT_URL=http://minio:9000
  volumes:
    - ./dags:/opt/airflow/dags
    - ./src:/opt/airflow/src
    - ./config:/opt/airflow/config
    - ./logs:/opt/airflow/logs
  depends_on:
    - postgres
    - minio

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: airflow
      POSTGRES_PASSWORD: airflow
      POSTGRES_DB: airflow
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./sql/ddl:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "airflow"]
      interval: 5s
      retries: 5

  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  spark-master:
    image: bitnami/spark:3.4
    environment:
      - SPARK_MODE=master
      - SPARK_RPC_AUTHENTICATION_ENABLED=no
      - SPARK_RPC_ENCRYPTION_ENABLED=no
    ports:
      - "8080:8080"
      - "7077:7077"
    volumes:
      - ./spark_jobs:/opt/spark-jobs
      - ./src:/opt/src

  spark-worker:
    image: bitnami/spark:3.4
    environment:
      - SPARK_MODE=worker
      - SPARK_MASTER_URL=spark://spark-master:7077
      - SPARK_WORKER_MEMORY=2G
      - SPARK_WORKER_CORES=2
    depends_on:
      - spark-master

  airflow-webserver:
    <<: *airflow-common
    command: webserver
    ports:
      - "8081:8080"
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:8080/health"]
      interval: 10s
      timeout: 10s
      retries: 5

  airflow-scheduler:
    <<: *airflow-common
    command: scheduler
    healthcheck:
      test: ["CMD-SHELL", "airflow jobs check --job-type SchedulerJob"]
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
          --password admin \\
          --firstname Admin \\
          --lastname User \\
          --role Admin \\
          --email admin@example.com

volumes:
  postgres_data:
  minio_data:
'''

    docker_compose_path = PROJECT_ROOT / "docker-compose.yml"
    docker_compose_path.write_text(docker_compose_content)
    print(f"Created: {docker_compose_path}")

    # .env.example
    env_example_content = '''# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=airflow
POSTGRES_PASSWORD=airflow
POSTGRES_DB=datawarehouse

# S3 / MinIO
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_ENDPOINT_URL=http://localhost:9000
S3_BUCKET=data-lake

# Spark
SPARK_MASTER=spark://localhost:7077

# Airflow
AIRFLOW__CORE__EXECUTOR=LocalExecutor

# API Keys
PAYMENT_API_KEY=your-api-key
PAYMENT_API_URL=https://api.payment-provider.com

# Environment
ENVIRONMENT=development
LOG_LEVEL=INFO
'''

    env_path = PROJECT_ROOT / ".env.example"
    env_path.write_text(env_example_content)
    print(f"Created: {env_path}")

    # .gitignore
    gitignore_content = '''# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual environments
.env
.venv
env/
venv/

# IDE
.idea/
.vscode/
*.swp
*.swo

# Jupyter
.ipynb_checkpoints/

# Testing
.coverage
.pytest_cache/
htmlcov/

# Logs
logs/
*.log

# Data (local development)
data/raw/*
data/processed/*
!data/raw/.gitkeep
!data/processed/.gitkeep

# Secrets
.env
*.pem
*.key
credentials.json

# Airflow
airflow.db
airflow.cfg

# Spark
spark-warehouse/
metastore_db/
derby.log
'''

    gitignore_path = PROJECT_ROOT / ".gitignore"
    gitignore_path.write_text(gitignore_content)
    print(f"Created: {gitignore_path}")


def create_utility_modules():
    """공통 유틸리티 모듈 생성"""

    # config.py
    config_content = '''"""Application configuration using Pydantic Settings."""

from functools import lru_cache
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Environment
    environment: str = Field(default="development")
    log_level: str = Field(default="INFO")

    # Database
    postgres_host: str = Field(default="localhost")
    postgres_port: int = Field(default=5432)
    postgres_user: str = Field(default="airflow")
    postgres_password: str = Field(default="airflow")
    postgres_db: str = Field(default="datawarehouse")

    # S3 / MinIO
    aws_access_key_id: str = Field(default="minioadmin")
    aws_secret_access_key: str = Field(default="minioadmin")
    aws_endpoint_url: Optional[str] = Field(default=None)
    s3_bucket: str = Field(default="data-lake")

    # Spark
    spark_master: str = Field(default="local[*]")

    # API
    payment_api_key: Optional[str] = Field(default=None)
    payment_api_url: str = Field(default="https://api.payment-provider.com")

    @property
    def postgres_url(self) -> str:
        """Generate PostgreSQL connection URL."""
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def is_production(self) -> bool:
        """Check if running in production."""
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Convenience alias
settings = get_settings()
'''

    config_path = PROJECT_ROOT / "src/e2e_pipeline/config.py"
    config_path.write_text(config_content)
    print(f"Created: {config_path}")

    # logger.py
    logger_content = '''"""Structured logging configuration."""

import logging
import sys
from typing import Any

import structlog


def setup_logging(log_level: str = "INFO") -> None:
    """Configure structured logging for the application."""

    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer() if log_level != "DEBUG"
                else structlog.dev.ConsoleRenderer(),
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    # Configure standard logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, log_level.upper()),
    )


def get_logger(name: str) -> Any:
    """Get a structured logger instance."""
    return structlog.get_logger(name)


# Initialize logging on module import
setup_logging()
'''

    logger_path = PROJECT_ROOT / "src/e2e_pipeline/utils/logger.py"
    logger_path.write_text(logger_content)
    print(f"Created: {logger_path}")

    # exceptions.py
    exceptions_content = '''"""Custom exceptions for the E2E Pipeline."""


class PipelineError(Exception):
    """Base exception for pipeline errors."""
    pass


class ExtractionError(PipelineError):
    """Error during data extraction."""
    pass


class TransformationError(PipelineError):
    """Error during data transformation."""
    pass


class LoadingError(PipelineError):
    """Error during data loading."""
    pass


class ValidationError(PipelineError):
    """Error during data validation."""
    pass


class ConfigurationError(PipelineError):
    """Error in configuration."""
    pass


class ConnectionError(PipelineError):
    """Error connecting to external service."""
    pass


class DataQualityError(PipelineError):
    """Data quality check failed."""

    def __init__(self, message: str, failed_checks: list = None):
        super().__init__(message)
        self.failed_checks = failed_checks or []
'''

    exceptions_path = PROJECT_ROOT / "src/e2e_pipeline/utils/exceptions.py"
    exceptions_path.write_text(exceptions_content)
    print(f"Created: {exceptions_path}")

    # README.md
    readme_content = '''# E2E Data Pipeline

End-to-End Data Pipeline for SaaS Analytics

## Overview

This project implements a complete data pipeline that:
- Extracts data from PostgreSQL, S3, and REST APIs
- Transforms data using Apache Spark
- Loads data into a Star Schema data warehouse
- Orchestrates workflows with Apache Airflow

## Architecture

\`\`\`
Sources → Ingestion → Raw Layer → Transformation → DW → Data Marts
\`\`\`

## Quick Start

\`\`\`bash
# Clone and setup
git clone <repo>
cd e2e_pipeline

# Start infrastructure
docker-compose up -d

# Install dependencies
pip install -e ".[dev]"

# Run tests
pytest
\`\`\`

## Project Structure

\`\`\`
e2e_pipeline/
├── src/e2e_pipeline/     # Main source code
│   ├── extractors/       # Data extraction modules
│   ├── transformers/     # Spark transformation jobs
│   ├── loaders/          # Data loading modules
│   └── utils/            # Utilities and helpers
├── dags/                 # Airflow DAGs
├── spark_jobs/           # Spark job scripts
├── sql/                  # SQL scripts
├── tests/                # Test suite
├── docs/                 # Documentation
└── config/               # Configuration files
\`\`\`

## Development

\`\`\`bash
# Format code
black src/ tests/

# Lint
ruff check src/ tests/

# Type check
mypy src/
\`\`\`

## License

MIT
'''

    readme_path = PROJECT_ROOT / "README.md"
    readme_path.write_text(readme_content)
    print(f"Created: {readme_path}")

    # Create .gitkeep files for empty directories
    gitkeep_dirs = ["data/raw", "data/processed"]
    for directory in gitkeep_dirs:
        gitkeep_path = PROJECT_ROOT / directory / ".gitkeep"
        gitkeep_path.touch()


if __name__ == "__main__":
    create_project_structure()
    create_init_files()
    create_config_files()
    create_utility_modules()
    print("\\n✅ Project structure created successfully!")
    print(f"\\nNext steps:")
    print(f"1. cd {PROJECT_ROOT}")
    print(f"2. python -m venv .venv && source .venv/bin/activate")
    print(f"3. pip install -e '.[dev]'")
    print(f"4. docker-compose up -d")
`,
      hints: [
        "pathlib.Path를 사용하면 OS 독립적인 경로 처리가 가능합니다",
        "pydantic-settings를 사용하면 환경 변수를 타입 안전하게 관리할 수 있습니다",
        "structlog는 JSON 형식의 구조화된 로깅을 제공합니다",
        "docker-compose의 x-로 시작하는 키는 YAML 앵커로 공통 설정을 재사용합니다"
      ]
    }
  },
  {
    id: 'w8d1t4',
    title: '아키텍처 문서 작성',
    type: 'code',
    duration: 30,
    content: {
      instructions: `## 아키텍처 문서 작성 (ADR 형식)

Architecture Decision Records (ADR) 형식으로 주요 설계 결정을 문서화합니다.

### 구현 요구사항

1. **ADR 템플릿 작성**
   - 제목, 상태, 컨텍스트, 결정, 결과

2. **주요 결정 사항 문서화**
   - 데이터 레이크 구조 (Delta Lake)
   - 스키마 설계 (Star Schema)
   - 오케스트레이션 도구 (Airflow)

3. **다이어그램 포함**
   - 시스템 아키텍처
   - 데이터 흐름
`,
      starterCode: `# docs/architecture/adr-template.md

"""
# ADR-XXX: [제목]

## 상태
[Proposed | Accepted | Deprecated | Superseded]

## 컨텍스트
[결정이 필요한 상황과 배경]

## 결정
[내린 결정과 그 이유]

## 결과
[예상되는 결과와 트레이드오프]

## 참고
[관련 문서, 링크]
"""

# TODO: ADR-001: 데이터 레이크 구조 작성
# TODO: ADR-002: 스키마 설계 방법론 작성
# TODO: ADR-003: 오케스트레이션 도구 선택 작성
`,
      solutionCode: `# docs/architecture/adr-001-data-lake-structure.md
ADR_001 = """
# ADR-001: Delta Lake 기반 데이터 레이크 구조

## 상태
Accepted

## 컨텍스트
SaaS 분석 플랫폼을 위한 데이터 레이크를 구축해야 합니다.
요구사항:
- 대용량 이벤트 데이터 (일 1억 건) 처리
- ACID 트랜잭션 지원 (데이터 정합성)
- 시간 여행 (Time Travel) 기능
- 스키마 진화 지원
- 비용 효율적인 스토리지

고려된 대안:
1. Apache Hive + Parquet
2. Apache Iceberg
3. Delta Lake
4. Apache Hudi

## 결정
**Delta Lake**를 데이터 레이크 포맷으로 선택합니다.

이유:
1. **Spark 네이티브 통합**: PySpark와 완벽한 호환성
2. **ACID 트랜잭션**: 동시 쓰기/읽기 시 데이터 정합성 보장
3. **Time Travel**: 특정 시점 데이터 조회, 롤백 가능
4. **스키마 진화**: 컬럼 추가/변경 시 하위 호환성 유지
5. **OPTIMIZE & Z-ORDER**: 쿼리 성능 최적화 내장
6. **커뮤니티 & 문서**: 활발한 생태계, 풍부한 레퍼런스

## 결과

### 긍정적
- 데이터 레이크의 ACID 보장
- 증분 처리 (MERGE) 용이
- 운영 복잡도 감소 (롤백, 감사 로그)

### 부정적
- Delta Lake 버전 관리 필요
- 일부 BI 도구와의 호환성 확인 필요
- 메타데이터 오버헤드 (작은 파일 문제)

### 완화 방안
- Auto Compaction 활성화
- 주기적 OPTIMIZE 실행
- BI 도구용 뷰 레이어 구성

## 레이어 구조

\`\`\`
s3://data-lake/
├── raw/                    # Bronze Layer
│   ├── users/
│   │   └── dt=YYYY-MM-DD/
│   ├── events/
│   │   └── dt=YYYY-MM-DD/hour=HH/
│   └── payments/
│       └── dt=YYYY-MM-DD/
├── staging/                # Silver Layer (Delta)
│   ├── stg_users/
│   ├── stg_events/
│   └── stg_payments/
├── warehouse/              # Gold Layer (Delta)
│   ├── dim_user/
│   ├── dim_date/
│   ├── fact_events/
│   └── fact_payments/
└── marts/                  # Platinum Layer (Delta)
    ├── marketing/
    ├── product/
    └── finance/
\`\`\`

## 참고
- [Delta Lake Documentation](https://docs.delta.io/)
- [Databricks Lakehouse Architecture](https://www.databricks.com/glossary/data-lakehouse)
"""

# docs/architecture/adr-002-dimensional-modeling.md
ADR_002 = """
# ADR-002: Kimball Star Schema 기반 차원 모델링

## 상태
Accepted

## 컨텍스트
데이터 웨어하우스의 스키마 설계 방법론을 결정해야 합니다.

요구사항:
- 비즈니스 분석가의 셀프 서비스 분석
- BI 도구 (Tableau, Looker) 호환성
- 쿼리 성능 최적화
- 점진적 확장 가능

고려된 대안:
1. Kimball Star Schema
2. Inmon 3NF (정규화)
3. Data Vault 2.0
4. Wide Table (비정규화)

## 결정
**Kimball Star Schema**를 적용합니다.

이유:
1. **분석 친화적**: BI 도구와 최적의 호환성
2. **쿼리 단순성**: 조인 최소화로 빠른 집계
3. **비즈니스 프로세스 중심**: 이해하기 쉬운 모델
4. **점진적 구축**: 주제 영역별 독립 개발 가능
5. **검증된 방법론**: 30년 이상의 산업 표준

## 결과

### 스키마 구성

Fact Tables:
- fact_events: 사용자 행동 이벤트 (Grain: 개별 이벤트)
- fact_subscriptions: 구독 상태 (Grain: 구독 변경)
- fact_payments: 결제 (Grain: 개별 결제)

Dimension Tables:
- dim_user: SCD Type 2 (히스토리 추적)
- dim_date: 날짜 계층
- dim_plan: 구독 플랜
- dim_event_type: 이벤트 유형 계층

### SCD (Slowly Changing Dimension) 전략

| Dimension | SCD Type | 이유 |
|-----------|----------|------|
| dim_user | Type 2 | 사용자 세그먼트 변경 이력 필요 |
| dim_plan | Type 1 | 최신 가격만 필요 |
| dim_date | N/A | 정적 데이터 |
| dim_event_type | Type 1 | 변경 빈도 낮음 |

### 트레이드오프

긍정적:
- 분석가 생산성 향상
- 쿼리 성능 우수
- 명확한 비즈니스 의미

부정적:
- 데이터 중복 (저장 공간 증가)
- 실시간 업데이트 제한적
- 복잡한 변환 로직 필요

## 참고
- [The Data Warehouse Toolkit](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/)
"""

# docs/architecture/adr-003-orchestration.md
ADR_003 = """
# ADR-003: Apache Airflow 오케스트레이션

## 상태
Accepted

## 컨텍스트
데이터 파이프라인 워크플로우 오케스트레이션 도구를 선택해야 합니다.

요구사항:
- DAG (Directed Acyclic Graph) 기반 워크플로우
- Python 네이티브 지원
- 스케줄링 및 의존성 관리
- 모니터링 및 알림
- 확장성 (수백 개 DAG)

고려된 대안:
1. Apache Airflow
2. Prefect
3. Dagster
4. Luigi
5. AWS Step Functions

## 결정
**Apache Airflow 2.8+**를 선택합니다.

이유:
1. **산업 표준**: 가장 널리 사용되는 오케스트레이션 도구
2. **풍부한 Operator**: AWS, GCP, Spark 등 다양한 통합
3. **TaskFlow API**: 현대적인 Python 데코레이터 기반 DAG
4. **활발한 커뮤니티**: 문제 해결 리소스 풍부
5. **관리형 서비스**: MWAA, Cloud Composer 등 옵션

버전 선택 이유 (2.8+):
- Dataset 기반 DAG 트리거
- Dynamic Task Mapping 개선
- 보안 패치 및 안정성

## 결과

### DAG 구조

\`\`\`
e2e_pipeline/
├── dag_extract_users.py      # 사용자 데이터 추출
├── dag_extract_events.py     # 이벤트 데이터 추출
├── dag_extract_payments.py   # 결제 데이터 추출
├── dag_transform_staging.py  # Staging 변환
├── dag_transform_warehouse.py # DW 적재
├── dag_aggregate_marts.py    # 집계 테이블 생성
└── dag_daily_pipeline.py     # 통합 DAG
\`\`\`

### 스케줄 전략

| DAG | 스케줄 | 의존성 |
|-----|--------|--------|
| extract_* | 02:00 UTC | 없음 |
| transform_staging | Dataset | extract_* 완료 |
| transform_warehouse | Dataset | staging 완료 |
| aggregate_marts | 06:00 UTC | warehouse 완료 |

### 트레이드오프

긍정적:
- 검증된 안정성
- 풍부한 모니터링 UI
- 다양한 배포 옵션

부정적:
- 스케줄러 단일 장애점 (HA 구성 필요)
- 메모리 사용량 높음
- 러닝 커브

### 완화 방안
- Celery/Kubernetes Executor로 확장
- 주기적 DAG 정리 (30일 이상 기록 삭제)
- 알림 설정 (Slack, PagerDuty)

## 참고
- [Airflow Best Practices](https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html)
- [Astronomer Guides](https://www.astronomer.io/guides/)
"""

def write_adr_files():
    """Write ADR files to docs directory."""
    from pathlib import Path

    docs_dir = Path("e2e_pipeline/docs/architecture")
    docs_dir.mkdir(parents=True, exist_ok=True)

    (docs_dir / "adr-001-data-lake-structure.md").write_text(ADR_001.strip())
    (docs_dir / "adr-002-dimensional-modeling.md").write_text(ADR_002.strip())
    (docs_dir / "adr-003-orchestration.md").write_text(ADR_003.strip())

    print("✅ ADR documents created successfully!")

if __name__ == "__main__":
    write_adr_files()
`,
      hints: [
        "ADR은 나중에 '왜 이렇게 결정했지?'라는 질문에 답하는 문서입니다",
        "고려된 대안과 트레이드오프를 명시하면 결정의 맥락을 이해하기 쉽습니다",
        "상태 필드로 결정이 아직 유효한지 추적할 수 있습니다",
        "Markdown 형식으로 작성하면 GitHub에서 바로 렌더링됩니다"
      ]
    }
  },
  {
    id: 'w8d1t5',
    title: 'Day 1 설계 검토 퀴즈',
    type: 'quiz',
    duration: 15,
    content: {
      questions: [
        {
          question: 'Star Schema에서 Fact 테이블과 Dimension 테이블의 관계는?',
          options: [
            'Fact가 Dimension을 참조한다 (Many-to-One)',
            'Dimension이 Fact를 참조한다 (One-to-Many)',
            'Fact와 Dimension은 Many-to-Many 관계',
            'Fact와 Dimension은 독립적이다'
          ],
          answer: 0,
          explanation: 'Star Schema에서 중앙의 Fact 테이블이 주변의 Dimension 테이블을 외래키로 참조합니다. 이를 통해 별 모양의 구조가 형성됩니다.'
        },
        {
          question: 'SCD Type 2의 특징은?',
          options: [
            '변경 시 기존 값을 덮어쓴다',
            '변경 이력을 새로운 행으로 추가한다',
            '변경된 값만 별도 테이블에 저장한다',
            '변경을 허용하지 않는다'
          ],
          answer: 1,
          explanation: 'SCD Type 2는 변경이 발생할 때 기존 행을 만료시키고 새로운 행을 추가하여 전체 이력을 보존합니다. effective_date, expiration_date, is_current 컬럼을 사용합니다.'
        },
        {
          question: 'Delta Lake의 주요 장점이 아닌 것은?',
          options: [
            'ACID 트랜잭션 지원',
            'Time Travel (버전 관리)',
            '실시간 스트리밍 처리',
            '스키마 진화 지원'
          ],
          answer: 2,
          explanation: 'Delta Lake는 배치 처리에 최적화된 레이크하우스 포맷입니다. 실시간 스트리밍은 Kafka, Flink 등이 더 적합합니다. Delta Lake는 Structured Streaming과 함께 사용할 수 있지만, 순수 실시간 처리는 아닙니다.'
        },
        {
          question: 'ADR (Architecture Decision Record)에 반드시 포함해야 하는 항목은?',
          options: [
            '구현 코드',
            '결정의 컨텍스트와 이유',
            '테스트 결과',
            '배포 일정'
          ],
          answer: 1,
          explanation: 'ADR의 핵심은 "왜 이 결정을 내렸는가"를 기록하는 것입니다. 컨텍스트(상황), 결정(선택), 결과(트레이드오프)가 필수 항목입니다.'
        },
        {
          question: '데이터 레이크의 Bronze-Silver-Gold 레이어 구조에서 Silver 레이어의 역할은?',
          options: [
            '원본 데이터를 그대로 저장',
            '정제 및 표준화된 데이터 저장',
            '비즈니스 집계 데이터 저장',
            '외부 시스템에 제공하는 API 데이터'
          ],
          answer: 1,
          explanation: 'Bronze는 원본 데이터, Silver는 정제/표준화된 데이터, Gold는 비즈니스 집계/마트 데이터를 저장합니다. Silver 레이어에서 중복 제거, 스키마 정규화, 데이터 타입 변환 등이 이루어집니다.'
        }
      ]
    }
  }
]
