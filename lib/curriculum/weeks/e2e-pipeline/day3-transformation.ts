import { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'w8d3t1',
    title: 'Spark 변환 파이프라인 설계',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: '',
      transcript: `# Spark 변환 파이프라인 설계

## 🎯 오늘의 목표

Raw Layer의 데이터를 Staging → Warehouse로 변환하는 Spark 파이프라인을 구축합니다.

## 📊 변환 레이어 구조

\`\`\`
Raw Layer (Bronze)
    │
    ▼ Cleansing, Deduplication, Type Casting
Staging Layer (Silver)
    │
    ▼ Business Logic, Aggregation, Denormalization
Warehouse Layer (Gold)
    │
    ▼ Pre-computed Aggregates
Data Marts (Platinum)
\`\`\`

## 🔧 변환 단계

### Stage 1: Raw → Staging
\`\`\`python
# 데이터 정제
- NULL 값 처리 (기본값, 삭제)
- 데이터 타입 변환
- 중복 제거 (deduplication)
- 스키마 정규화
\`\`\`

### Stage 2: Staging → Warehouse
\`\`\`python
# 비즈니스 로직 적용
- Dimension 테이블 생성 (SCD Type 2)
- Fact 테이블 생성
- Surrogate Key 할당
- 조인 및 보강
\`\`\`

### Stage 3: Warehouse → Marts
\`\`\`python
# 집계 및 최적화
- 일별/주별/월별 집계
- 비즈니스 메트릭 사전 계산
- 대시보드용 뷰 생성
\`\`\`

## 🏗️ Transformer 아키텍처

\`\`\`
┌─────────────────────────────────────────────────────┐
│              BaseTransformer (ABC)                   │
│  ┌─────────────────────────────────────────────────┐│
│  │  + transform(df) -> DataFrame                    ││
│  │  + validate(df) -> bool                          ││
│  │  + save(df, path) -> None                        ││
│  │  + get_schema() -> StructType                    ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
           │                │                │
           ▼                ▼                ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │   Staging    │ │  Dimension   │ │    Fact      │
    │ Transformer  │ │ Transformer  │ │ Transformer  │
    │              │ │              │ │              │
    │ + cleanse    │ │ + scd_type2  │ │ + join_dims  │
    │ + dedupe     │ │ + surrogate  │ │ + aggregate  │
    └──────────────┘ └──────────────┘ └──────────────┘
\`\`\`

## 📁 오늘 구현할 파일

\`\`\`
src/e2e_pipeline/transformers/
├── __init__.py
├── base.py               # BaseTransformer ABC
├── staging/
│   ├── users.py          # stg_users 변환
│   ├── events.py         # stg_events 변환
│   └── payments.py       # stg_payments 변환
├── dimensions/
│   ├── dim_user.py       # SCD Type 2
│   ├── dim_date.py       # 날짜 차원
│   └── dim_plan.py       # 플랜 차원
├── facts/
│   ├── fact_events.py
│   └── fact_payments.py
└── marts/
    └── daily_metrics.py
\`\`\`

## 🔑 핵심 패턴

### Delta Lake MERGE (Upsert)

\`\`\`python
from delta.tables import DeltaTable

target = DeltaTable.forPath(spark, target_path)

target.alias("target").merge(
    source_df.alias("source"),
    "target.user_id = source.user_id"
).whenMatchedUpdate(
    set={"name": "source.name", "updated_at": "source.updated_at"}
).whenNotMatchedInsert(
    values={"user_id": "source.user_id", "name": "source.name"}
).execute()
\`\`\`

### SCD Type 2 구현

\`\`\`python
def apply_scd_type2(current_df, new_df, key_col, tracked_cols):
    """Slowly Changing Dimension Type 2 적용"""

    # 1. 변경된 레코드 찾기
    # 2. 기존 레코드 만료 처리 (is_current=False, expiration_date 설정)
    # 3. 새 레코드 삽입 (is_current=True, effective_date 설정)
    pass
\`\`\`

자, 이제 구현을 시작합시다! 🚀
`,
      objectives: [
        'Raw → Staging → Warehouse 변환 파이프라인을 이해한다',
        'Delta Lake MERGE를 활용한 Upsert 패턴을 익힌다',
        'SCD Type 2 구현 방법을 학습한다'
      ],
      keyPoints: [
        '레이어별 변환 책임을 명확히 분리한다',
        'Delta Lake의 MERGE로 효율적인 Upsert 구현',
        'SCD Type 2로 차원 테이블의 이력 관리'
      ]
    }
  },
  {
    id: 'w8d3t2',
    title: 'Staging Transformers 구현',
    type: 'code',
    duration: 45,
    content: {
      instructions: `## Staging Transformers 구현

Raw 데이터를 정제하여 Staging Layer에 저장하는 Transformer를 구현합니다.

### 구현 요구사항

1. **BaseTransformer**
   - 공통 인터페이스 정의
   - Spark Session 관리

2. **StagingUserTransformer**
   - 이메일 정규화
   - 중복 제거
   - NULL 처리

3. **StagingEventTransformer**
   - JSON 평탄화
   - 타임스탬프 파싱
   - 이벤트 유형 표준화
`,
      starterCode: `# src/e2e_pipeline/transformers/base.py

from abc import ABC, abstractmethod
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.types import StructType


class BaseTransformer(ABC):
    """Base class for all transformers."""

    def __init__(self, spark: SparkSession, config: dict):
        self.spark = spark
        self.config = config

    @abstractmethod
    def transform(self, df: DataFrame) -> DataFrame:
        """Transform input DataFrame."""
        pass

    @abstractmethod
    def get_schema(self) -> StructType:
        """Return expected output schema."""
        pass


# src/e2e_pipeline/transformers/staging/users.py

class StagingUserTransformer(BaseTransformer):
    """Transform raw users to staging."""

    def transform(self, df: DataFrame) -> DataFrame:
        # TODO: 구현
        pass

    def get_schema(self) -> StructType:
        # TODO: 구현
        pass
`,
      solutionCode: `# src/e2e_pipeline/transformers/base.py

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from datetime import datetime

from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.types import StructType
from pyspark.sql import functions as F
from delta import DeltaTable

from e2e_pipeline.utils.logger import get_logger
from e2e_pipeline.utils.exceptions import TransformationError


class BaseTransformer(ABC):
    """Base class for all transformers."""

    def __init__(
        self,
        spark: SparkSession,
        config: Dict[str, Any],
        name: str = "base",
    ):
        self.spark = spark
        self.config = config
        self.name = name
        self.logger = get_logger(f"transformer.{name}")

    @abstractmethod
    def transform(self, df: DataFrame) -> DataFrame:
        """Transform input DataFrame.

        Args:
            df: Input DataFrame

        Returns:
            Transformed DataFrame
        """
        pass

    @abstractmethod
    def get_schema(self) -> StructType:
        """Return expected output schema."""
        pass

    def validate(self, df: DataFrame) -> bool:
        """Validate transformed data.

        Args:
            df: DataFrame to validate

        Returns:
            True if valid
        """
        if df.isEmpty():
            self.logger.warning("Transformed DataFrame is empty")
            return True

        # Check schema
        expected_cols = set(self.get_schema().fieldNames())
        actual_cols = set(df.columns)

        if not expected_cols.issubset(actual_cols):
            missing = expected_cols - actual_cols
            raise TransformationError(f"Missing columns: {missing}")

        return True

    def save_to_delta(
        self,
        df: DataFrame,
        path: str,
        mode: str = "overwrite",
        partition_by: Optional[List[str]] = None,
    ) -> None:
        """Save DataFrame to Delta Lake.

        Args:
            df: DataFrame to save
            path: Delta table path
            mode: Save mode (overwrite, append, merge)
            partition_by: Partition columns
        """
        self.logger.info(f"Saving to Delta: {path}", rows=df.count())

        writer = df.write.format("delta").mode(mode)

        if partition_by:
            writer = writer.partitionBy(*partition_by)

        writer.save(path)

        self.logger.info(f"Saved to {path}")

    def merge_to_delta(
        self,
        df: DataFrame,
        target_path: str,
        merge_keys: List[str],
        update_cols: Optional[List[str]] = None,
    ) -> None:
        """Merge DataFrame into existing Delta table.

        Args:
            df: Source DataFrame
            target_path: Delta table path
            merge_keys: Columns to match on
            update_cols: Columns to update (None = all non-key columns)
        """
        self.logger.info(f"Merging to Delta: {target_path}")

        # Check if target exists
        try:
            target = DeltaTable.forPath(self.spark, target_path)
        except Exception:
            # Table doesn't exist, create it
            self.save_to_delta(df, target_path, mode="overwrite")
            return

        # Build merge condition
        merge_condition = " AND ".join([
            f"target.{key} = source.{key}"
            for key in merge_keys
        ])

        # Determine update columns
        if update_cols is None:
            update_cols = [c for c in df.columns if c not in merge_keys]

        # Build update expression
        update_expr = {col: f"source.{col}" for col in update_cols}

        # Build insert expression
        insert_expr = {col: f"source.{col}" for col in df.columns}

        # Execute merge
        target.alias("target").merge(
            df.alias("source"),
            merge_condition
        ).whenMatchedUpdate(
            set=update_expr
        ).whenNotMatchedInsert(
            values=insert_expr
        ).execute()

        self.logger.info("Merge completed")


# src/e2e_pipeline/transformers/staging/users.py

from pyspark.sql import DataFrame
from pyspark.sql import functions as F
from pyspark.sql.types import (
    StructType, StructField,
    StringType, IntegerType, TimestampType, BooleanType
)
from pyspark.sql.window import Window

from e2e_pipeline.transformers.base import BaseTransformer


class StagingUserTransformer(BaseTransformer):
    """Transform raw users to staging layer."""

    def __init__(self, spark, config):
        super().__init__(spark, config, name="stg_users")

    def transform(self, df: DataFrame) -> DataFrame:
        """Transform raw user data.

        Transformations:
        1. Normalize email (lowercase, trim)
        2. Handle NULL values
        3. Remove duplicates (keep latest)
        4. Add derived columns
        5. Cast data types
        """
        self.logger.info("Transforming users", input_rows=df.count())

        # 1. Basic cleaning
        df = df.withColumn(
            "email",
            F.lower(F.trim(F.col("email")))
        ).withColumn(
            "name",
            F.trim(F.coalesce(F.col("name"), F.lit("Unknown")))
        )

        # 2. Handle NULL values
        df = df.withColumn(
            "plan_type",
            F.coalesce(F.col("plan_type"), F.lit("free"))
        )

        # 3. Remove duplicates (keep latest by updated_at)
        window = Window.partitionBy("user_id").orderBy(F.desc("updated_at"))

        df = df.withColumn("row_num", F.row_number().over(window)) \\
               .filter(F.col("row_num") == 1) \\
               .drop("row_num")

        # 4. Add derived columns
        df = df.withColumn(
            "email_domain",
            F.split(F.col("email"), "@").getItem(1)
        ).withColumn(
            "is_business_email",
            ~F.col("email_domain").isin([
                "gmail.com", "yahoo.com", "hotmail.com",
                "outlook.com", "naver.com", "daum.net"
            ])
        ).withColumn(
            "days_since_signup",
            F.datediff(F.current_date(), F.col("created_at"))
        )

        # 5. Cast data types
        df = df.withColumn("user_id", F.col("user_id").cast(IntegerType())) \\
               .withColumn("created_at", F.col("created_at").cast(TimestampType())) \\
               .withColumn("updated_at", F.col("updated_at").cast(TimestampType()))

        # 6. Add processing metadata
        df = df.withColumn("_processed_at", F.current_timestamp()) \\
               .withColumn("_source", F.lit("raw_users"))

        # 7. Select final columns
        df = df.select(
            "user_id",
            "email",
            "name",
            "email_domain",
            "is_business_email",
            "plan_type",
            "days_since_signup",
            "created_at",
            "updated_at",
            "_processed_at",
            "_source"
        )

        self.logger.info("Transformation complete", output_rows=df.count())
        return df

    def get_schema(self) -> StructType:
        """Return staging users schema."""
        return StructType([
            StructField("user_id", IntegerType(), False),
            StructField("email", StringType(), False),
            StructField("name", StringType(), True),
            StructField("email_domain", StringType(), True),
            StructField("is_business_email", BooleanType(), True),
            StructField("plan_type", StringType(), True),
            StructField("days_since_signup", IntegerType(), True),
            StructField("created_at", TimestampType(), True),
            StructField("updated_at", TimestampType(), True),
            StructField("_processed_at", TimestampType(), True),
            StructField("_source", StringType(), True),
        ])


# src/e2e_pipeline/transformers/staging/events.py

from pyspark.sql import DataFrame
from pyspark.sql import functions as F
from pyspark.sql.types import (
    StructType, StructField,
    StringType, IntegerType, TimestampType, LongType
)

from e2e_pipeline.transformers.base import BaseTransformer


class StagingEventTransformer(BaseTransformer):
    """Transform raw events to staging layer."""

    def __init__(self, spark, config):
        super().__init__(spark, config, name="stg_events")

        # Event type mapping for standardization
        self.event_type_mapping = {
            "page_view": "pageview",
            "pageView": "pageview",
            "click": "click",
            "button_click": "click",
            "form_submit": "form_submission",
            "formSubmit": "form_submission",
            "signup": "registration",
            "register": "registration",
        }

    def transform(self, df: DataFrame) -> DataFrame:
        """Transform raw event data.

        Transformations:
        1. Parse timestamp to proper format
        2. Flatten nested properties
        3. Standardize event types
        4. Extract session info
        5. Remove duplicates by event_id
        """
        self.logger.info("Transforming events", input_rows=df.count())

        # 1. Parse timestamp
        df = df.withColumn(
            "event_timestamp",
            F.to_timestamp(F.col("timestamp"))
        ).withColumn(
            "event_date",
            F.to_date(F.col("event_timestamp"))
        ).withColumn(
            "event_hour",
            F.hour(F.col("event_timestamp"))
        )

        # 2. Flatten properties if nested
        if "properties" in df.columns:
            df = df.withColumn(
                "device",
                F.coalesce(
                    F.col("properties.device"),
                    F.col("properties_device"),
                    F.lit("unknown")
                )
            ).withColumn(
                "browser",
                F.coalesce(
                    F.col("properties.browser"),
                    F.col("properties_browser"),
                    F.lit("unknown")
                )
            ).withColumn(
                "country",
                F.coalesce(
                    F.col("properties.country"),
                    F.col("properties_country"),
                    F.lit("unknown")
                )
            )
        else:
            # Columns already flattened
            df = df.withColumn("device", F.coalesce(F.col("device"), F.lit("unknown"))) \\
                   .withColumn("browser", F.coalesce(F.col("browser"), F.lit("unknown"))) \\
                   .withColumn("country", F.coalesce(F.col("country"), F.lit("unknown")))

        # 3. Standardize event types
        mapping_expr = F.create_map([
            F.lit(x) for pair in self.event_type_mapping.items() for x in pair
        ])

        df = df.withColumn(
            "event_type_standardized",
            F.coalesce(
                mapping_expr[F.lower(F.col("event_type"))],
                F.lower(F.col("event_type"))
            )
        )

        # 4. Add event category
        df = df.withColumn(
            "event_category",
            F.when(F.col("event_type_standardized").isin(["pageview", "click"]), "engagement")
             .when(F.col("event_type_standardized").isin(["form_submission", "registration"]), "conversion")
             .otherwise("other")
        )

        # 5. Remove duplicates by event_id
        df = df.dropDuplicates(["event_id"])

        # 6. Add processing metadata
        df = df.withColumn("_processed_at", F.current_timestamp()) \\
               .withColumn("_source", F.lit("raw_events"))

        # 7. Select final columns
        df = df.select(
            "event_id",
            F.col("user_id").cast(IntegerType()).alias("user_id"),
            "event_type_standardized",
            "event_category",
            "page",
            "device",
            "browser",
            "country",
            "event_timestamp",
            "event_date",
            "event_hour",
            "_processed_at",
            "_source"
        )

        self.logger.info("Transformation complete", output_rows=df.count())
        return df

    def get_schema(self) -> StructType:
        """Return staging events schema."""
        return StructType([
            StructField("event_id", StringType(), False),
            StructField("user_id", IntegerType(), True),
            StructField("event_type_standardized", StringType(), True),
            StructField("event_category", StringType(), True),
            StructField("page", StringType(), True),
            StructField("device", StringType(), True),
            StructField("browser", StringType(), True),
            StructField("country", StringType(), True),
            StructField("event_timestamp", TimestampType(), True),
            StructField("event_date", TimestampType(), True),
            StructField("event_hour", IntegerType(), True),
            StructField("_processed_at", TimestampType(), True),
            StructField("_source", StringType(), True),
        ])


# src/e2e_pipeline/transformers/staging/payments.py

from pyspark.sql import DataFrame
from pyspark.sql import functions as F
from pyspark.sql.types import (
    StructType, StructField,
    StringType, IntegerType, TimestampType, DecimalType
)

from e2e_pipeline.transformers.base import BaseTransformer


class StagingPaymentTransformer(BaseTransformer):
    """Transform raw payments to staging layer."""

    # Exchange rates (simplified, in production use real-time rates)
    EXCHANGE_RATES = {
        "USD": 1.0,
        "KRW": 0.00075,  # 1 KRW = 0.00075 USD
        "EUR": 1.08,
        "JPY": 0.0067,
    }

    def __init__(self, spark, config):
        super().__init__(spark, config, name="stg_payments")

    def transform(self, df: DataFrame) -> DataFrame:
        """Transform raw payment data.

        Transformations:
        1. Parse timestamps
        2. Normalize currency to USD
        3. Add payment status flags
        4. Handle NULL values
        5. Remove duplicates
        """
        self.logger.info("Transforming payments", input_rows=df.count())

        # 1. Parse timestamp
        df = df.withColumn(
            "payment_timestamp",
            F.to_timestamp(F.col("created_at"))
        ).withColumn(
            "payment_date",
            F.to_date(F.col("payment_timestamp"))
        )

        # 2. Normalize currency to USD
        rate_mapping = F.create_map([
            F.lit(x) for pair in self.EXCHANGE_RATES.items() for x in pair
        ])

        df = df.withColumn(
            "exchange_rate",
            F.coalesce(rate_mapping[F.upper(F.col("currency"))], F.lit(1.0))
        ).withColumn(
            "amount_usd",
            F.round(F.col("amount") * F.col("exchange_rate"), 2)
        )

        # 3. Add status flags
        df = df.withColumn(
            "is_successful",
            F.col("status").isin(["completed", "success", "paid"])
        ).withColumn(
            "is_refunded",
            F.col("status").isin(["refunded", "reversed"])
        ).withColumn(
            "is_failed",
            F.col("status").isin(["failed", "declined", "error"])
        )

        # 4. Handle NULL values
        df = df.withColumn(
            "payment_method",
            F.coalesce(F.col("payment_method"), F.lit("unknown"))
        )

        # 5. Remove duplicates
        df = df.dropDuplicates(["payment_id"])

        # 6. Add processing metadata
        df = df.withColumn("_processed_at", F.current_timestamp()) \\
               .withColumn("_source", F.lit("raw_payments"))

        # 7. Select final columns
        df = df.select(
            "payment_id",
            F.col("user_id").cast(IntegerType()).alias("user_id"),
            F.col("amount").cast(DecimalType(12, 2)).alias("amount_original"),
            "currency",
            F.col("amount_usd").cast(DecimalType(12, 2)).alias("amount_usd"),
            "exchange_rate",
            "payment_method",
            "status",
            "is_successful",
            "is_refunded",
            "is_failed",
            "payment_timestamp",
            "payment_date",
            "_processed_at",
            "_source"
        )

        self.logger.info("Transformation complete", output_rows=df.count())
        return df

    def get_schema(self) -> StructType:
        """Return staging payments schema."""
        return StructType([
            StructField("payment_id", StringType(), False),
            StructField("user_id", IntegerType(), True),
            StructField("amount_original", DecimalType(12, 2), True),
            StructField("currency", StringType(), True),
            StructField("amount_usd", DecimalType(12, 2), True),
            StructField("exchange_rate", DecimalType(10, 6), True),
            StructField("payment_method", StringType(), True),
            StructField("status", StringType(), True),
            StructField("is_successful", StringType(), True),
            StructField("is_refunded", StringType(), True),
            StructField("is_failed", StringType(), True),
            StructField("payment_timestamp", TimestampType(), True),
            StructField("payment_date", TimestampType(), True),
            StructField("_processed_at", TimestampType(), True),
            StructField("_source", StringType(), True),
        ])
`,
      hints: [
        "Window 함수를 사용하면 그룹 내 순위를 계산하여 중복을 제거할 수 있습니다",
        "F.create_map을 사용하면 값 매핑을 SQL 표현식으로 만들 수 있습니다",
        "F.coalesce를 사용하면 여러 컬럼 중 첫 번째 non-null 값을 선택합니다",
        "_processed_at 같은 메타데이터 컬럼은 디버깅에 유용합니다"
      ]
    }
  },
  {
    id: 'w8d3t3',
    title: 'Dimension & Fact Transformers 구현',
    type: 'code',
    duration: 50,
    content: {
      instructions: `## Dimension & Fact Transformers 구현

Staging 데이터를 Star Schema의 Dimension과 Fact 테이블로 변환합니다.

### 구현 요구사항

1. **DimUserTransformer (SCD Type 2)**
   - Surrogate Key 생성
   - 변경 이력 추적
   - is_current, effective_date, expiration_date 관리

2. **FactEventsTransformer**
   - Dimension 테이블과 조인
   - Surrogate Key로 참조
   - 집계 가능한 메트릭 추가
`,
      starterCode: `# src/e2e_pipeline/transformers/dimensions/dim_user.py

from pyspark.sql import DataFrame
from e2e_pipeline.transformers.base import BaseTransformer


class DimUserTransformer(BaseTransformer):
    """Transform staging users to dim_user with SCD Type 2."""

    def transform(self, df: DataFrame) -> DataFrame:
        # TODO: SCD Type 2 구현
        pass

    def apply_scd_type2(
        self,
        current_dim: DataFrame,
        new_staging: DataFrame,
    ) -> DataFrame:
        """Apply SCD Type 2 logic."""
        # TODO: 구현
        pass
`,
      solutionCode: `# src/e2e_pipeline/transformers/dimensions/dim_user.py

from pyspark.sql import DataFrame
from pyspark.sql import functions as F
from pyspark.sql.types import (
    StructType, StructField,
    StringType, IntegerType, LongType, TimestampType,
    BooleanType, DateType, DecimalType
)
from pyspark.sql.window import Window
from datetime import datetime, date

from e2e_pipeline.transformers.base import BaseTransformer


class DimUserTransformer(BaseTransformer):
    """Transform staging users to dim_user with SCD Type 2."""

    # Columns to track for changes
    TRACKED_COLUMNS = ["email", "name", "plan_type"]

    def __init__(self, spark, config):
        super().__init__(spark, config, name="dim_user")

    def transform(self, df: DataFrame) -> DataFrame:
        """Transform staging users to dimension format.

        For initial load (no existing dimension):
        - Generate surrogate keys
        - Set SCD Type 2 columns

        For incremental:
        - Use apply_scd_type2() method
        """
        self.logger.info("Transforming to dim_user", input_rows=df.count())

        # Generate surrogate key using monotonically_increasing_id
        df = df.withColumn(
            "user_sk",
            F.monotonically_increasing_id() + 1
        )

        # Add SCD Type 2 columns
        current_date = F.current_date()
        max_date = F.lit(date(9999, 12, 31))

        df = df.withColumn("effective_date", current_date) \\
               .withColumn("expiration_date", max_date) \\
               .withColumn("is_current", F.lit(True))

        # Add user segment based on plan
        df = df.withColumn(
            "user_segment",
            F.when(F.col("plan_type") == "enterprise", "high_value")
             .when(F.col("plan_type") == "pro", "growth")
             .when(F.col("plan_type") == "free", "freemium")
             .otherwise("unknown")
        )

        # Calculate lifetime value placeholder (will be updated from payments)
        df = df.withColumn(
            "lifetime_value",
            F.lit(0.0).cast(DecimalType(12, 2))
        )

        # Select final columns
        df = df.select(
            "user_sk",
            "user_id",
            "email",
            "name",
            "email_domain",
            "is_business_email",
            "plan_type",
            "user_segment",
            "lifetime_value",
            "effective_date",
            "expiration_date",
            "is_current",
            "created_at",
            "updated_at",
        )

        self.logger.info("Transformation complete", output_rows=df.count())
        return df

    def apply_scd_type2(
        self,
        current_dim: DataFrame,
        new_staging: DataFrame,
    ) -> DataFrame:
        """Apply SCD Type 2 logic for incremental updates.

        Steps:
        1. Find changed records
        2. Expire old records (set is_current=False, expiration_date=today)
        3. Insert new records with new surrogate keys
        4. Keep unchanged records as-is

        Args:
            current_dim: Existing dimension table
            new_staging: New staging data

        Returns:
            Updated dimension DataFrame
        """
        self.logger.info("Applying SCD Type 2")

        current_date = F.current_date()
        max_date = F.lit(date(9999, 12, 31))

        # Get only current records from dimension
        current_active = current_dim.filter(F.col("is_current") == True)

        # Create hash of tracked columns for change detection
        hash_cols = [F.coalesce(F.col(c).cast("string"), F.lit("")) for c in self.TRACKED_COLUMNS]

        current_active = current_active.withColumn(
            "_row_hash",
            F.md5(F.concat_ws("||", *hash_cols))
        )

        new_staging = new_staging.withColumn(
            "_row_hash",
            F.md5(F.concat_ws("||", *hash_cols))
        )

        # Find changed records
        changed = new_staging.alias("new").join(
            current_active.alias("old"),
            (F.col("new.user_id") == F.col("old.user_id")) &
            (F.col("new._row_hash") != F.col("old._row_hash")),
            "inner"
        ).select("new.*", F.col("old.user_sk").alias("old_user_sk"))

        # Find new records (not in current dimension)
        new_records = new_staging.alias("new").join(
            current_active.alias("old"),
            F.col("new.user_id") == F.col("old.user_id"),
            "left_anti"
        )

        # Get max surrogate key
        max_sk = current_dim.agg(F.max("user_sk")).collect()[0][0] or 0

        # 1. Records to expire (changed records in current_dim)
        expired = current_active.join(
            changed.select("old_user_sk"),
            current_active["user_sk"] == changed["old_user_sk"],
            "inner"
        ).withColumn(
            "is_current", F.lit(False)
        ).withColumn(
            "expiration_date", current_date
        ).drop("old_user_sk", "_row_hash")

        # 2. New versions of changed records
        new_versions = changed.drop("old_user_sk", "_row_hash").withColumn(
            "user_sk",
            F.row_number().over(Window.orderBy("user_id")) + max_sk
        ).withColumn(
            "effective_date", current_date
        ).withColumn(
            "expiration_date", max_date
        ).withColumn(
            "is_current", F.lit(True)
        )

        # 3. Completely new records
        window = Window.orderBy("user_id")
        max_sk_after_changes = max_sk + changed.count()

        new_inserts = new_records.drop("_row_hash").withColumn(
            "user_sk",
            F.row_number().over(window) + max_sk_after_changes
        ).withColumn(
            "effective_date", current_date
        ).withColumn(
            "expiration_date", max_date
        ).withColumn(
            "is_current", F.lit(True)
        )

        # 4. Unchanged records
        unchanged = current_active.join(
            changed.select("old_user_sk"),
            current_active["user_sk"] == changed["old_user_sk"],
            "left_anti"
        ).drop("_row_hash")

        # Combine all
        result = unchanged.unionByName(expired) \\
                         .unionByName(new_versions) \\
                         .unionByName(new_inserts)

        self.logger.info(
            "SCD Type 2 applied",
            expired_count=expired.count(),
            new_versions_count=new_versions.count(),
            new_inserts_count=new_inserts.count(),
        )

        return result

    def get_schema(self) -> StructType:
        """Return dim_user schema."""
        return StructType([
            StructField("user_sk", LongType(), False),
            StructField("user_id", IntegerType(), False),
            StructField("email", StringType(), True),
            StructField("name", StringType(), True),
            StructField("email_domain", StringType(), True),
            StructField("is_business_email", BooleanType(), True),
            StructField("plan_type", StringType(), True),
            StructField("user_segment", StringType(), True),
            StructField("lifetime_value", DecimalType(12, 2), True),
            StructField("effective_date", DateType(), True),
            StructField("expiration_date", DateType(), True),
            StructField("is_current", BooleanType(), True),
            StructField("created_at", TimestampType(), True),
            StructField("updated_at", TimestampType(), True),
        ])


# src/e2e_pipeline/transformers/facts/fact_events.py

from pyspark.sql import DataFrame
from pyspark.sql import functions as F
from pyspark.sql.types import (
    StructType, StructField,
    StringType, IntegerType, LongType, TimestampType
)

from e2e_pipeline.transformers.base import BaseTransformer


class FactEventsTransformer(BaseTransformer):
    """Transform staging events to fact_events."""

    def __init__(self, spark, config):
        super().__init__(spark, config, name="fact_events")

    def transform(
        self,
        events_df: DataFrame,
        dim_user: DataFrame,
        dim_date: DataFrame,
        dim_event_type: DataFrame,
    ) -> DataFrame:
        """Transform staging events to fact table.

        Args:
            events_df: Staging events
            dim_user: User dimension (current records only)
            dim_date: Date dimension
            dim_event_type: Event type dimension

        Returns:
            Fact events DataFrame
        """
        self.logger.info("Transforming to fact_events", input_rows=events_df.count())

        # Generate event surrogate key
        events_df = events_df.withColumn(
            "event_sk",
            F.monotonically_increasing_id() + 1
        )

        # Join with dim_user (get current user_sk)
        user_lookup = dim_user.filter(F.col("is_current") == True) \\
                              .select("user_id", "user_sk")

        events_df = events_df.join(
            user_lookup,
            "user_id",
            "left"
        )

        # Create date_sk (YYYYMMDD format)
        events_df = events_df.withColumn(
            "date_sk",
            F.date_format(F.col("event_date"), "yyyyMMdd").cast(IntegerType())
        )

        # Create time_sk (HHMM format)
        events_df = events_df.withColumn(
            "time_sk",
            (F.hour(F.col("event_timestamp")) * 100 +
             F.minute(F.col("event_timestamp"))).cast(IntegerType())
        )

        # Join with event type dimension
        if dim_event_type is not None:
            events_df = events_df.join(
                dim_event_type.select("event_type_code", "event_type_sk"),
                events_df["event_type_standardized"] == dim_event_type["event_type_code"],
                "left"
            )
        else:
            # If no event type dimension, use hash as surrogate
            events_df = events_df.withColumn(
                "event_type_sk",
                F.abs(F.hash(F.col("event_type_standardized")))
            )

        # Add measures
        events_df = events_df.withColumn(
            "event_count",
            F.lit(1)
        )

        # Select final columns
        result = events_df.select(
            "event_sk",
            "event_id",
            F.coalesce(F.col("user_sk"), F.lit(-1)).alias("user_sk"),
            "date_sk",
            "time_sk",
            F.coalesce(F.col("event_type_sk"), F.lit(-1)).alias("event_type_sk"),
            "event_type_standardized",
            "event_category",
            "page",
            "device",
            "browser",
            "country",
            "event_count",
            "event_timestamp",
        )

        self.logger.info("Transformation complete", output_rows=result.count())
        return result

    def get_schema(self) -> StructType:
        """Return fact_events schema."""
        return StructType([
            StructField("event_sk", LongType(), False),
            StructField("event_id", StringType(), False),
            StructField("user_sk", LongType(), True),
            StructField("date_sk", IntegerType(), True),
            StructField("time_sk", IntegerType(), True),
            StructField("event_type_sk", IntegerType(), True),
            StructField("event_type_standardized", StringType(), True),
            StructField("event_category", StringType(), True),
            StructField("page", StringType(), True),
            StructField("device", StringType(), True),
            StructField("browser", StringType(), True),
            StructField("country", StringType(), True),
            StructField("event_count", IntegerType(), True),
            StructField("event_timestamp", TimestampType(), True),
        ])
`,
      hints: [
        "SCD Type 2에서 md5 해시를 사용하면 변경 감지가 쉽습니다",
        "Surrogate Key는 monotonically_increasing_id() + offset으로 생성합니다",
        "Fact 테이블의 NULL FK는 -1 같은 unknown 레코드를 참조하게 합니다",
        "Date SK를 YYYYMMDD 정수로 만들면 범위 쿼리가 효율적입니다"
      ]
    }
  },
  {
    id: 'w8d3t4',
    title: 'Transformation DAG 구현',
    type: 'code',
    duration: 30,
    content: {
      instructions: `## Transformation DAG 구현

Staging → Warehouse → Marts 변환을 수행하는 Airflow DAG를 구현합니다.

### 구현 요구사항

1. **dag_transform_warehouse.py**
   - Extraction 완료 후 트리거
   - Staging, Dimension, Fact 순서 실행
   - Spark Submit Operator 사용
`,
      starterCode: `# dags/dag_transform_warehouse.py

from datetime import datetime, timedelta
from airflow.decorators import dag, task

@dag(
    dag_id='transform_warehouse',
    schedule=None,
    start_date=datetime(2024, 1, 1),
)
def transform_warehouse():
    """Transform staging data to warehouse."""
    # TODO: 구현
    pass

dag = transform_warehouse()
`,
      solutionCode: `# dags/dag_transform_warehouse.py

from datetime import datetime, timedelta
from typing import Dict, Any

from airflow.decorators import dag, task, task_group
from airflow.sensors.external_task import ExternalTaskSensor
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator
from airflow.providers.slack.hooks.slack_webhook import SlackWebhookHook

default_args = {
    'owner': 'data-team',
    'retries': 2,
    'retry_delay': timedelta(minutes=10),
}


@dag(
    dag_id='transform_warehouse',
    description='Transform staging data to warehouse (dimensions and facts)',
    schedule=None,  # Triggered by extraction DAG
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=['transform', 'warehouse', 'e2e-pipeline'],
    dagrun_timeout=timedelta(hours=3),
)
def transform_warehouse():
    """Transform staging data to Star Schema warehouse."""

    # Wait for extraction to complete
    wait_for_extraction = ExternalTaskSensor(
        task_id='wait_for_extraction',
        external_dag_id='extract_all_sources',
        external_task_id='send_summary',
        mode='reschedule',
        timeout=7200,
        poke_interval=120,
    )

    @task_group(group_id='staging_transforms')
    def transform_staging():
        """Transform raw to staging layer."""

        @task
        def transform_stg_users(**context) -> Dict[str, Any]:
            """Transform raw users to staging."""
            import sys
            sys.path.insert(0, '/opt/airflow/src')

            from pyspark.sql import SparkSession
            from e2e_pipeline.transformers.staging.users import StagingUserTransformer
            from e2e_pipeline.config import settings

            execution_date = context['logical_date']
            target_date = (execution_date - timedelta(days=1)).strftime('%Y-%m-%d')

            # Create Spark session
            spark = SparkSession.builder \\
                .appName("stg_users_transform") \\
                .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
                .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
                .getOrCreate()

            try:
                # Read raw data
                raw_path = f"s3a://{settings.s3_bucket}/raw/users/dt={target_date}"
                raw_df = spark.read.parquet(raw_path)

                # Transform
                transformer = StagingUserTransformer(spark, {})
                stg_df = transformer.transform(raw_df)

                # Validate
                transformer.validate(stg_df)

                # Save to staging layer
                stg_path = f"s3a://{settings.s3_bucket}/staging/stg_users"
                transformer.merge_to_delta(
                    stg_df,
                    stg_path,
                    merge_keys=["user_id"],
                )

                return {
                    "source": "stg_users",
                    "rows": stg_df.count(),
                    "path": stg_path,
                }

            finally:
                spark.stop()

        @task
        def transform_stg_events(**context) -> Dict[str, Any]:
            """Transform raw events to staging."""
            import sys
            sys.path.insert(0, '/opt/airflow/src')

            from pyspark.sql import SparkSession
            from e2e_pipeline.transformers.staging.events import StagingEventTransformer
            from e2e_pipeline.config import settings

            execution_date = context['logical_date']
            target_date = (execution_date - timedelta(days=1)).strftime('%Y-%m-%d')

            spark = SparkSession.builder \\
                .appName("stg_events_transform") \\
                .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
                .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
                .getOrCreate()

            try:
                raw_path = f"s3a://{settings.s3_bucket}/raw/events/dt={target_date}"
                raw_df = spark.read.parquet(raw_path)

                transformer = StagingEventTransformer(spark, {})
                stg_df = transformer.transform(raw_df)
                transformer.validate(stg_df)

                stg_path = f"s3a://{settings.s3_bucket}/staging/stg_events"
                transformer.save_to_delta(
                    stg_df,
                    stg_path,
                    mode="append",
                    partition_by=["event_date"],
                )

                return {
                    "source": "stg_events",
                    "rows": stg_df.count(),
                    "path": stg_path,
                }

            finally:
                spark.stop()

        @task
        def transform_stg_payments(**context) -> Dict[str, Any]:
            """Transform raw payments to staging."""
            import sys
            sys.path.insert(0, '/opt/airflow/src')

            from pyspark.sql import SparkSession
            from e2e_pipeline.transformers.staging.payments import StagingPaymentTransformer
            from e2e_pipeline.config import settings

            execution_date = context['logical_date']
            target_date = (execution_date - timedelta(days=1)).strftime('%Y-%m-%d')

            spark = SparkSession.builder \\
                .appName("stg_payments_transform") \\
                .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
                .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
                .getOrCreate()

            try:
                raw_path = f"s3a://{settings.s3_bucket}/raw/payments/dt={target_date}"
                raw_df = spark.read.parquet(raw_path)

                transformer = StagingPaymentTransformer(spark, {})
                stg_df = transformer.transform(raw_df)
                transformer.validate(stg_df)

                stg_path = f"s3a://{settings.s3_bucket}/staging/stg_payments"
                transformer.merge_to_delta(
                    stg_df,
                    stg_path,
                    merge_keys=["payment_id"],
                )

                return {
                    "source": "stg_payments",
                    "rows": stg_df.count(),
                    "path": stg_path,
                }

            finally:
                spark.stop()

        return [transform_stg_users(), transform_stg_events(), transform_stg_payments()]

    @task_group(group_id='dimension_transforms')
    def transform_dimensions(staging_results: list):
        """Transform staging to dimension tables."""

        @task
        def transform_dim_user(**context) -> Dict[str, Any]:
            """Transform to dim_user with SCD Type 2."""
            import sys
            sys.path.insert(0, '/opt/airflow/src')

            from pyspark.sql import SparkSession
            from e2e_pipeline.transformers.dimensions.dim_user import DimUserTransformer
            from e2e_pipeline.config import settings

            spark = SparkSession.builder \\
                .appName("dim_user_transform") \\
                .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
                .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
                .getOrCreate()

            try:
                # Read staging users
                stg_path = f"s3a://{settings.s3_bucket}/staging/stg_users"
                stg_df = spark.read.format("delta").load(stg_path)

                transformer = DimUserTransformer(spark, {})
                dim_path = f"s3a://{settings.s3_bucket}/warehouse/dim_user"

                # Check if dimension exists
                try:
                    current_dim = spark.read.format("delta").load(dim_path)
                    # Apply SCD Type 2
                    dim_df = transformer.apply_scd_type2(current_dim, stg_df)
                    transformer.save_to_delta(dim_df, dim_path, mode="overwrite")
                except Exception:
                    # Initial load
                    dim_df = transformer.transform(stg_df)
                    transformer.save_to_delta(dim_df, dim_path, mode="overwrite")

                return {
                    "dimension": "dim_user",
                    "rows": dim_df.count(),
                    "path": dim_path,
                }

            finally:
                spark.stop()

        return [transform_dim_user()]

    @task_group(group_id='fact_transforms')
    def transform_facts(dimension_results: list):
        """Transform staging to fact tables."""

        @task
        def transform_fact_events(**context) -> Dict[str, Any]:
            """Transform to fact_events."""
            import sys
            sys.path.insert(0, '/opt/airflow/src')

            from pyspark.sql import SparkSession
            from e2e_pipeline.transformers.facts.fact_events import FactEventsTransformer
            from e2e_pipeline.config import settings

            spark = SparkSession.builder \\
                .appName("fact_events_transform") \\
                .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
                .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
                .getOrCreate()

            try:
                # Read staging and dimensions
                stg_events = spark.read.format("delta").load(
                    f"s3a://{settings.s3_bucket}/staging/stg_events"
                )
                dim_user = spark.read.format("delta").load(
                    f"s3a://{settings.s3_bucket}/warehouse/dim_user"
                )

                transformer = FactEventsTransformer(spark, {})
                fact_df = transformer.transform(
                    stg_events,
                    dim_user,
                    dim_date=None,
                    dim_event_type=None,
                )

                fact_path = f"s3a://{settings.s3_bucket}/warehouse/fact_events"
                transformer.save_to_delta(
                    fact_df,
                    fact_path,
                    mode="append",
                    partition_by=["date_sk"],
                )

                return {
                    "fact": "fact_events",
                    "rows": fact_df.count(),
                    "path": fact_path,
                }

            finally:
                spark.stop()

        return [transform_fact_events()]

    @task
    def send_summary(staging: list, dimensions: list, facts: list, **context):
        """Send transformation summary."""
        total_staging = sum(r.get('rows', 0) for r in staging)
        total_dims = sum(r.get('rows', 0) for r in dimensions)
        total_facts = sum(r.get('rows', 0) for r in facts)

        message = f"""
:gear: *Warehouse Transform Complete*
:calendar: Date: {context['logical_date'].strftime('%Y-%m-%d')}

*Staging:* {total_staging:,} rows
*Dimensions:* {total_dims:,} rows
*Facts:* {total_facts:,} rows
        """

        try:
            hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
            hook.send(text=message)
        except Exception:
            pass

    # DAG flow
    staging = transform_staging()
    wait_for_extraction >> staging

    dims = transform_dimensions(staging)
    facts = transform_facts(dims)
    send_summary(staging, dims, facts)


dag = transform_warehouse()
`,
      hints: [
        "ExternalTaskSensor로 이전 DAG 완료를 대기할 수 있습니다",
        "task_group 간 의존성은 리스트를 인자로 전달하여 설정합니다",
        "Spark Session은 각 Task에서 생성하고 finally에서 stop()합니다",
        "Delta Lake의 mode='append'는 기존 데이터에 추가합니다"
      ]
    }
  },
  {
    id: 'w8d3t5',
    title: 'Day 3 변환 파이프라인 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'SCD Type 2에서 레코드 변경 시 수행하는 작업은?',
          options: [
            '기존 레코드를 삭제하고 새 레코드 삽입',
            '기존 레코드의 is_current=False, expiration_date 설정 후 새 레코드 삽입',
            '기존 레코드를 직접 업데이트',
            '변경 내용만 별도 테이블에 저장'
          ],
          answer: 1,
          explanation: 'SCD Type 2는 기존 레코드를 만료(is_current=False, expiration_date=오늘)시키고 새 레코드를 삽입(is_current=True, effective_date=오늘)하여 전체 이력을 보존합니다.'
        },
        {
          question: 'Fact 테이블에서 Dimension FK가 NULL일 때 일반적인 처리 방법은?',
          options: [
            'NULL 그대로 저장',
            'Unknown을 나타내는 특수 Surrogate Key (예: -1) 사용',
            '해당 레코드 삭제',
            'Dimension 테이블에 NULL 레코드 추가'
          ],
          answer: 1,
          explanation: 'Unknown 레코드(-1 또는 0)를 Dimension에 미리 생성하고, NULL FK를 이 값으로 대체합니다. 이렇게 하면 조인 시 데이터 손실 없이 BI 도구에서도 처리가 용이합니다.'
        },
        {
          question: 'Delta Lake MERGE의 장점이 아닌 것은?',
          options: [
            'Upsert를 단일 트랜잭션으로 처리',
            'ACID 트랜잭션 보장',
            '실시간 스트리밍 처리',
            '조건부 Update/Insert 지원'
          ],
          answer: 2,
          explanation: 'Delta Lake MERGE는 배치 처리에 최적화되어 있습니다. 실시간 스트리밍은 별도 메커니즘(Structured Streaming + foreachBatch)을 사용합니다.'
        },
        {
          question: 'date_sk를 YYYYMMDD 정수로 설계하는 이유는?',
          options: [
            '저장 공간 절약',
            '범위 쿼리 성능 향상 (파티션 프루닝)',
            '날짜 계산 용이',
            '외래키 제약 조건 적용'
          ],
          answer: 1,
          explanation: 'YYYYMMDD 정수 형식은 날짜 범위 조건에서 파티션 프루닝이 효율적으로 작동합니다. WHERE date_sk BETWEEN 20240101 AND 20240131 같은 쿼리가 빠릅니다.'
        }
      ]
    }
  }
]
