// Phase 7, Week 4: Code Transforms (PySpark)
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'transforms-api-deep',
  title: 'Transforms API 심화',
  totalDuration: 180,
  tasks: [
    {
      id: 'transforms-patterns',
      type: 'reading',
      title: 'Transform 패턴과 구조',
      duration: 45,
      content: {
        objectives: [
          'Transform 작성 패턴을 이해한다',
          '다중 입출력 Transform을 파악한다',
          '모듈화와 재사용성을 익힌다'
        ],
        markdown: `
## Transform 패턴과 구조

### 기본 패턴

\`\`\`python
from transforms.api import transform, Input, Output

@transform(
    output=Output("/path/to/output"),
    source=Input("/path/to/source"),
)
def compute(output, source):
    df = source.dataframe()
    result = df.filter(df.status == "active")
    output.write_dataframe(result)
\`\`\`

### 다중 입력 패턴

\`\`\`python
@transform(
    output=Output("/output/joined_data"),
    orders=Input("/source/orders"),
    customers=Input("/source/customers"),
    products=Input("/source/products"),
)
def compute(output, orders, customers, products):
    df_orders = orders.dataframe()
    df_customers = customers.dataframe()
    df_products = products.dataframe()

    result = (
        df_orders
        .join(df_customers, "customer_id")
        .join(df_products, "product_id")
    )

    output.write_dataframe(result)
\`\`\`

### 다중 출력 패턴

\`\`\`python
from transforms.api import transform, Input, Output

@transform(
    summary_output=Output("/output/summary"),
    detail_output=Output("/output/detail"),
    source=Input("/source/data"),
)
def compute(summary_output, detail_output, source):
    df = source.dataframe()

    # Summary 데이터
    summary = df.groupBy("category").count()
    summary_output.write_dataframe(summary)

    # Detail 데이터
    detail = df.filter(df.amount > 1000)
    detail_output.write_dataframe(detail)
\`\`\`

### 모듈화 패턴

\`\`\`python
# utils/transformations.py
from pyspark.sql import DataFrame
from pyspark.sql import functions as F

def clean_nulls(df: DataFrame, columns: list) -> DataFrame:
    """NULL 값을 처리합니다."""
    for col in columns:
        df = df.filter(F.col(col).isNotNull())
    return df

def add_timestamp(df: DataFrame) -> DataFrame:
    """처리 타임스탬프를 추가합니다."""
    return df.withColumn("processed_at", F.current_timestamp())

# transforms/main.py
from utils.transformations import clean_nulls, add_timestamp

@transform(...)
def compute(output, source):
    df = source.dataframe()
    df = clean_nulls(df, ["id", "name"])
    df = add_timestamp(df)
    output.write_dataframe(df)
\`\`\`

### 설정 기반 패턴

\`\`\`python
# config.py
CONFIG = {
    "filter_status": ["active", "pending"],
    "min_amount": 100,
    "columns": ["id", "name", "amount", "status"],
}

# transforms/configurable.py
from config import CONFIG

@transform(...)
def compute(output, source):
    df = source.dataframe()

    df = df.filter(df.status.isin(CONFIG["filter_status"]))
    df = df.filter(df.amount >= CONFIG["min_amount"])
    df = df.select(*CONFIG["columns"])

    output.write_dataframe(df)
\`\`\`
        `,
        externalLinks: [
          { title: 'Transforms API', url: 'https://www.palantir.com/docs/foundry/transforms/' },
          { title: 'PySpark Guide', url: 'https://spark.apache.org/docs/latest/api/python/' }
        ]
      }
    },
    {
      id: 'pyspark-operations',
      type: 'reading',
      title: 'PySpark 고급 연산',
      duration: 50,
      content: {
        objectives: [
          'PySpark DataFrame 고급 연산을 익힌다',
          'UDF와 내장 함수를 활용한다',
          '윈도우 함수를 PySpark로 구현한다'
        ],
        markdown: `
## PySpark 고급 연산

### 고급 DataFrame 연산

\`\`\`python
from pyspark.sql import functions as F
from pyspark.sql.window import Window

# 조건부 컬럼
df = df.withColumn(
    "tier",
    F.when(df.amount > 10000, "Gold")
     .when(df.amount > 1000, "Silver")
     .otherwise("Bronze")
)

# 문자열 처리
df = df.withColumn("name_upper", F.upper(df.name))
df = df.withColumn("email_domain", F.split(df.email, "@")[1])

# 날짜 처리
df = df.withColumn("year", F.year(df.date))
df = df.withColumn("month", F.month(df.date))
df = df.withColumn("days_ago", F.datediff(F.current_date(), df.date))

# 배열/맵 처리
df = df.withColumn("tags_count", F.size(df.tags))
df = df.withColumn("first_tag", F.element_at(df.tags, 1))
\`\`\`

### 윈도우 함수

\`\`\`python
# 윈도우 정의
window = Window.partitionBy("category").orderBy("date")
window_all = Window.partitionBy("category")

# 순위
df = df.withColumn("rank", F.rank().over(window))
df = df.withColumn("row_num", F.row_number().over(window))
df = df.withColumn("dense_rank", F.dense_rank().over(window))

# 이전/다음 값
df = df.withColumn("prev_amount", F.lag("amount", 1).over(window))
df = df.withColumn("next_amount", F.lead("amount", 1).over(window))

# 누적 합계
df = df.withColumn("running_total", F.sum("amount").over(window))

# 이동 평균
window_range = Window.partitionBy("category").orderBy("date").rowsBetween(-6, 0)
df = df.withColumn("ma_7", F.avg("amount").over(window_range))

# 그룹 내 비율
df = df.withColumn(
    "pct_of_total",
    df.amount / F.sum("amount").over(window_all) * 100
)
\`\`\`

### UDF (User Defined Functions)

\`\`\`python
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType, IntegerType

# 간단한 UDF
@udf(returnType=StringType())
def categorize_amount(amount):
    if amount > 10000:
        return "high"
    elif amount > 1000:
        return "medium"
    return "low"

df = df.withColumn("amount_category", categorize_amount(df.amount))

# Pandas UDF (더 빠름)
from pyspark.sql.functions import pandas_udf
import pandas as pd

@pandas_udf(StringType())
def normalize_name(name: pd.Series) -> pd.Series:
    return name.str.strip().str.lower()

df = df.withColumn("normalized_name", normalize_name(df.name))
\`\`\`

### 집계 심화

\`\`\`python
from pyspark.sql.functions import collect_list, collect_set

# 다중 집계
summary = df.groupBy("category").agg(
    F.count("*").alias("count"),
    F.sum("amount").alias("total"),
    F.avg("amount").alias("avg"),
    F.min("date").alias("first_date"),
    F.max("date").alias("last_date"),
    F.countDistinct("customer_id").alias("unique_customers"),
    collect_list("product_id").alias("products"),
)

# 조건부 집계
summary = df.groupBy("category").agg(
    F.count(F.when(df.status == "completed", True)).alias("completed"),
    F.count(F.when(df.status == "pending", True)).alias("pending"),
    F.sum(F.when(df.status == "completed", df.amount)).alias("completed_amount"),
)

# 피벗
pivoted = df.groupBy("date").pivot("category").sum("amount")
\`\`\`
        `,
        externalLinks: [
          { title: 'PySpark Functions', url: 'https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/functions.html' }
        ]
      }
    },
    {
      id: 'pyspark-exercise',
      type: 'code',
      title: 'PySpark Transform 실습',
      duration: 60,
      content: {
        objectives: [
          'PySpark 고급 연산을 적용한다',
          '윈도우 함수를 구현한다',
          '실제 비즈니스 로직을 구현한다'
        ],
        instructions: `
## PySpark Transform 실습

### 과제: 고객 분석 Transform

요구사항:
1. 고객별 총 주문 금액 계산
2. 고객 등급 분류 (Gold/Silver/Bronze)
3. 최근 주문일 기준 활성 여부
4. 월별 주문 추이

### 구현

\`\`\`python
@transform(
    output=Output("/output/customer_analysis"),
    orders=Input("/source/orders"),
    customers=Input("/source/customers"),
)
def compute(output, orders, customers):
    # TODO: 구현
    pass
\`\`\`

### 체크리스트

- [ ] 조인 구현
- [ ] 집계 구현
- [ ] 등급 분류 로직
- [ ] 윈도우 함수 활용
- [ ] 테스트 실행
        `,
        starterCode: `from transforms.api import transform, Input, Output
from pyspark.sql import functions as F
from pyspark.sql.window import Window

@transform(
    output=Output("/training/output/customer_analysis"),
    orders=Input("/training/source/orders"),
    customers=Input("/training/source/customers"),
)
def compute(output, orders, customers):
    df_orders = orders.dataframe()
    df_customers = customers.dataframe()

    # TODO: 1. 조인
    # joined = ...

    # TODO: 2. 고객별 집계
    # aggregated = ...

    # TODO: 3. 등급 분류
    # with_tier = ...

    # TODO: 4. 윈도우 함수로 순위
    # with_rank = ...

    # output.write_dataframe(result)
`,
        solutionCode: `from transforms.api import transform, Input, Output
from pyspark.sql import functions as F
from pyspark.sql.window import Window

@transform(
    output=Output("/training/output/customer_analysis"),
    orders=Input("/training/source/orders"),
    customers=Input("/training/source/customers"),
)
def compute(output, orders, customers):
    df_orders = orders.dataframe()
    df_customers = customers.dataframe()

    # 1. 조인
    joined = df_orders.join(df_customers, "customer_id")

    # 2. 고객별 집계
    aggregated = joined.groupBy("customer_id", "customer_name").agg(
        F.sum("amount").alias("total_amount"),
        F.count("*").alias("order_count"),
        F.max("order_date").alias("last_order_date"),
    )

    # 3. 등급 분류
    with_tier = aggregated.withColumn(
        "tier",
        F.when(F.col("total_amount") > 100000, "Gold")
         .when(F.col("total_amount") > 10000, "Silver")
         .otherwise("Bronze")
    )

    # 4. 순위
    window = Window.orderBy(F.desc("total_amount"))
    with_rank = with_tier.withColumn("rank", F.rank().over(window))

    # 5. 활성 여부
    result = with_rank.withColumn(
        "is_active",
        F.datediff(F.current_date(), F.col("last_order_date")) <= 90
    )

    output.write_dataframe(result)
`
      }
    },
    {
      id: 'day1-quiz',
      type: 'quiz',
      title: 'PySpark 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: '다중 출력 Transform의 장점은?',
            options: ['코드 간결화', '하나의 입력으로 여러 결과 생성', '성능 향상', '권한 분리'],
            answer: 1,
            explanation: '다중 출력 Transform은 하나의 소스에서 여러 결과 데이터셋을 생성할 수 있습니다.'
          },
          {
            question: 'Pandas UDF의 장점은?',
            options: ['코드 간결화', '더 빠른 처리 속도', '더 많은 기능', '권한 관리'],
            answer: 1,
            explanation: 'Pandas UDF는 벡터화된 연산으로 일반 UDF보다 훨씬 빠릅니다.'
          },
          {
            question: 'Window 함수에서 LAG의 용도는?',
            options: ['다음 행 참조', '이전 행 참조', '순위 계산', '집계'],
            answer: 1,
            explanation: 'LAG는 이전 행의 값을 참조합니다. LEAD는 다음 행을 참조합니다.'
          }
        ]
      }
    },
    {
      id: 'day1-project',
      type: 'project',
      title: 'Transform 설계',
      duration: 10,
      content: {
        objectives: [
          '프로젝트의 Transform 구조를 설계한다'
        ],
        requirements: [
          '**Transform 설계서**',
          '',
          '## Transform 목록',
          '| 이름 | 입력 | 출력 | 로직 |',
          '|------|------|------|------|',
          '| | | | |'
        ],
        evaluationCriteria: [
          'Transform 구조 명확성'
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'testing-debugging',
  title: '테스트 & 디버깅',
  totalDuration: 180,
  tasks: [
    {
      id: 'unit-testing',
      type: 'reading',
      title: 'Transform 유닛 테스트',
      duration: 45,
      content: {
        objectives: [
          'Transform 테스트 방법을 이해한다',
          '테스트 데이터 생성을 익힌다',
          'pytest 활용법을 파악한다'
        ],
        markdown: `
## Transform 유닛 테스트

### 테스트 구조

\`\`\`python
# tests/test_transforms.py
import pytest
from pyspark.sql import SparkSession

@pytest.fixture(scope="session")
def spark():
    return SparkSession.builder.master("local[*]").getOrCreate()

def test_clean_data(spark):
    # 테스트 데이터 생성
    input_data = spark.createDataFrame([
        (1, "active", 100),
        (2, "inactive", 200),
        (3, None, 300),
    ], ["id", "status", "amount"])

    # Transform 로직 실행
    from myproject.transforms.clean import clean_data
    result = clean_data(input_data)

    # 검증
    assert result.count() == 2  # NULL 제거됨
    assert result.filter(result.status == "active").count() == 1
\`\`\`

### 테스트 데이터 생성

\`\`\`python
# 수동 생성
test_df = spark.createDataFrame([
    (1, "A", 100.0),
    (2, "B", 200.0),
], ["id", "category", "amount"])

# 스키마 명시
from pyspark.sql.types import StructType, StructField, StringType, IntegerType

schema = StructType([
    StructField("id", IntegerType(), False),
    StructField("name", StringType(), True),
])
test_df = spark.createDataFrame([(1, "test")], schema)

# 랜덤 데이터 생성
import random
data = [(i, random.choice(["A", "B"]), random.randint(1, 1000))
        for i in range(100)]
test_df = spark.createDataFrame(data, ["id", "category", "amount"])
\`\`\`

### 테스트 패턴

\`\`\`python
# 1. 기본 동작 테스트
def test_transform_basic(spark):
    input_df = create_test_data(spark)
    result = my_transform(input_df)
    assert result.count() > 0

# 2. 엣지 케이스 테스트
def test_transform_empty_input(spark):
    empty_df = spark.createDataFrame([], schema)
    result = my_transform(empty_df)
    assert result.count() == 0

# 3. NULL 처리 테스트
def test_transform_null_handling(spark):
    with_nulls = spark.createDataFrame([(1, None)])
    result = my_transform(with_nulls)
    assert result.filter(result.col.isNull()).count() == 0

# 4. 스키마 검증 테스트
def test_transform_schema(spark):
    result = my_transform(input_df)
    expected_columns = ["id", "name", "processed_at"]
    assert result.columns == expected_columns
\`\`\`

### 테스트 실행

\`\`\`bash
# 모든 테스트 실행
pytest tests/

# 특정 테스트 실행
pytest tests/test_transforms.py::test_clean_data

# 상세 출력
pytest -v tests/

# 커버리지 포함
pytest --cov=myproject tests/
\`\`\`
        `,
        externalLinks: [
          { title: 'Testing Transforms', url: 'https://learn.palantir.com/testing' },
          { title: 'pytest Documentation', url: 'https://docs.pytest.org/' }
        ]
      }
    },
    {
      id: 'debugging-techniques',
      type: 'reading',
      title: '디버깅 기법',
      duration: 40,
      content: {
        objectives: [
          'Transform 디버깅 방법을 익힌다',
          '로깅과 모니터링을 설정한다',
          '일반적인 오류를 해결한다'
        ],
        markdown: `
## 디버깅 기법

### 로깅

\`\`\`python
import logging

logger = logging.getLogger(__name__)

@transform(...)
def compute(output, source):
    df = source.dataframe()

    logger.info(f"Input row count: {df.count()}")
    logger.info(f"Columns: {df.columns}")

    # 디버깅용 샘플 출력
    logger.debug(f"Sample data:\\n{df.limit(5).toPandas()}")

    result = process(df)

    logger.info(f"Output row count: {result.count()}")
    output.write_dataframe(result)
\`\`\`

### 중간 결과 확인

\`\`\`python
@transform(...)
def compute(output, source):
    df = source.dataframe()

    # 단계별 확인
    step1 = df.filter(df.status == "active")
    print(f"After filter: {step1.count()}")
    step1.show(5)

    step2 = step1.groupBy("category").count()
    print(f"After groupBy: {step2.count()}")
    step2.show()

    output.write_dataframe(step2)
\`\`\`

### 일반적인 오류

\`\`\`
1. NullPointerException
   원인: NULL 값 연산
   해결: isNotNull() 필터 또는 coalesce()

2. AnalysisException: Column not found
   원인: 컬럼명 오타
   해결: df.columns로 확인, 대소문자 주의

3. OutOfMemoryError
   원인: 큰 데이터 collect()
   해결: limit() 사용, 집계 후 collect()

4. Serialization Error
   원인: 직렬화 불가능 객체 사용
   해결: 브로드캐스트 변수 또는 UDF 내에서 처리

5. Schema Mismatch
   원인: 입력 스키마 변경
   해결: 스키마 명시, 검증 로직 추가
\`\`\`

### 성능 디버깅

\`\`\`python
# 실행 계획 확인
df.explain(True)

# 파티션 수 확인
print(f"Partitions: {df.rdd.getNumPartitions()}")

# 데이터 분포 확인
df.groupBy(spark_partition_id()).count().show()

# 캐싱으로 반복 계산 방지
df_cached = df.cache()
print(df_cached.count())  # 캐시 트리거
# 이후 작업에서 캐시 사용
\`\`\`
        `,
        externalLinks: [
          { title: 'Debugging Guide', url: 'https://learn.palantir.com/debugging' }
        ]
      }
    },
    {
      id: 'testing-exercise',
      type: 'code',
      title: '테스트 작성 실습',
      duration: 60,
      content: {
        objectives: [
          'Transform에 대한 테스트를 작성한다',
          '엣지 케이스를 테스트한다',
          '테스트 커버리지를 확보한다'
        ],
        instructions: `
## 테스트 작성 실습

### 대상 Transform

Day 1에서 작성한 고객 분석 Transform

### 테스트 케이스

1. 기본 동작 테스트
2. NULL 처리 테스트
3. 등급 분류 테스트
4. 빈 입력 테스트

### 체크리스트

- [ ] 기본 테스트 작성
- [ ] 엣지 케이스 테스트
- [ ] 모든 테스트 통과
- [ ] 커버리지 70% 이상
        `,
        starterCode: `# tests/test_customer_analysis.py
import pytest
from pyspark.sql import SparkSession

@pytest.fixture(scope="session")
def spark():
    return SparkSession.builder.master("local[*]").getOrCreate()

def test_customer_analysis_basic(spark):
    # TODO: 테스트 데이터 생성
    # TODO: Transform 실행
    # TODO: 결과 검증
    pass

def test_customer_tier_gold(spark):
    # TODO: Gold 등급 테스트
    pass

def test_customer_null_handling(spark):
    # TODO: NULL 처리 테스트
    pass
`,
        solutionCode: `# tests/test_customer_analysis.py
import pytest
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

@pytest.fixture(scope="session")
def spark():
    return SparkSession.builder.master("local[*]").getOrCreate()

def test_customer_analysis_basic(spark):
    orders = spark.createDataFrame([
        (1, 1, 5000, "2024-01-01"),
        (2, 1, 3000, "2024-01-15"),
        (3, 2, 2000, "2024-02-01"),
    ], ["order_id", "customer_id", "amount", "order_date"])

    customers = spark.createDataFrame([
        (1, "Kim"),
        (2, "Lee"),
    ], ["customer_id", "customer_name"])

    # Transform 로직 실행 (간략화)
    joined = orders.join(customers, "customer_id")
    result = joined.groupBy("customer_id").agg(F.sum("amount").alias("total"))

    assert result.count() == 2
    assert result.filter(result.customer_id == 1).first()["total"] == 8000

def test_customer_tier_gold(spark):
    data = spark.createDataFrame([
        (1, 150000),  # Gold
        (2, 50000),   # Silver
        (3, 5000),    # Bronze
    ], ["customer_id", "total_amount"])

    result = data.withColumn(
        "tier",
        F.when(F.col("total_amount") > 100000, "Gold")
         .when(F.col("total_amount") > 10000, "Silver")
         .otherwise("Bronze")
    )

    assert result.filter(result.tier == "Gold").count() == 1
    assert result.filter(result.tier == "Silver").count() == 1
    assert result.filter(result.tier == "Bronze").count() == 1
`
      }
    },
    {
      id: 'day2-quiz',
      type: 'quiz',
      title: '테스트 & 디버깅 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Transform 테스트의 첫 단계는?',
            options: ['배포', '테스트 데이터 생성', '성능 측정', '문서화'],
            answer: 1,
            explanation: '테스트를 위해서는 먼저 적절한 테스트 데이터를 생성해야 합니다.'
          },
          {
            question: 'OOM 오류의 일반적인 원인은?',
            options: ['네트워크 오류', '큰 데이터 collect()', '권한 부족', '타임아웃'],
            answer: 1,
            explanation: '대용량 데이터를 collect()하면 드라이버 메모리가 부족해집니다.'
          }
        ]
      }
    },
    {
      id: 'day2-project',
      type: 'project',
      title: '테스트 계획',
      duration: 20,
      content: {
        objectives: [
          '프로젝트의 테스트 계획을 수립한다'
        ],
        requirements: [
          '**테스트 계획서**',
          '',
          '## 테스트 케이스',
          '| Transform | 테스트 케이스 | 우선순위 |',
          '|-----------|-------------|---------|',
          '| | | |'
        ],
        evaluationCriteria: [
          '테스트 케이스 완성도'
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'incremental-processing',
  title: '증분 처리 & 최적화',
  totalDuration: 180,
  tasks: [
    {
      id: 'incremental-patterns',
      type: 'reading',
      title: '증분 처리 패턴',
      duration: 45,
      content: {
        objectives: [
          '증분 처리의 개념을 이해한다',
          '다양한 증분 패턴을 파악한다',
          '전체 vs 증분 처리를 선택한다'
        ],
        markdown: `
## 증분 처리 패턴

### 증분 처리란?

\`\`\`
Full Processing (전체):
┌────────────────────────────────────┐
│ 매번 전체 데이터 처리               │
│ 100M rows → 처리 → 100M rows      │
└────────────────────────────────────┘

Incremental Processing (증분):
┌────────────────────────────────────┐
│ 변경분만 처리                       │
│ 100M rows 중 1M 변경 → 1M 처리    │
└────────────────────────────────────┘
\`\`\`

### 증분 유형

\`\`\`
1. Append Only (추가만)
   └── 새 데이터만 추가
   └── 로그, 이벤트 데이터

2. Upsert (Insert + Update)
   └── 새 데이터 추가 + 기존 데이터 갱신
   └── 마스터 데이터

3. SCD (Slowly Changing Dimension)
   └── 변경 이력 보존
   └── Type 1, 2, 3
\`\`\`

### Transform에서 증분 처리

\`\`\`python
from transforms.api import transform, Input, Output, incremental

@incremental()
@transform(
    output=Output("/output/data"),
    source=Input("/source/data"),
)
def compute(output, source):
    # 마지막 처리 이후 새 데이터만 읽기
    df = source.dataframe("added")

    # 처리
    result = process(df)

    # 증분 쓰기
    output.write_dataframe(result)
\`\`\`

### 선택 기준

| 상황 | 권장 방식 |
|------|----------|
| 소규모 데이터 (<100K) | Full |
| 대규모, 추가만 | Incremental Append |
| 대규모, 업데이트 있음 | Incremental Upsert |
| 복잡한 변환 | Full (단순화) |
| 변경 이력 필요 | SCD Type 2 |
        `,
        externalLinks: [
          { title: 'Incremental Transforms', url: 'https://learn.palantir.com/incremental' }
        ]
      }
    },
    {
      id: 'performance-tuning',
      type: 'reading',
      title: '코드 기반 성능 튜닝',
      duration: 45,
      content: {
        objectives: [
          'PySpark 성능 최적화 기법을 익힌다',
          '파티셔닝과 캐싱을 코드로 구현한다',
          '병렬 처리를 최적화한다'
        ],
        markdown: `
## 코드 기반 성능 튜닝

### 파티셔닝

\`\`\`python
# 파티션 수 조정
df = df.repartition(100)  # 지정된 수로
df = df.coalesce(10)      # 줄이기만 (셔플 없음)

# 컬럼 기반 파티셔닝
df = df.repartition("date")
df = df.repartition(100, "date", "category")

# 저장 시 파티셔닝
df.write.partitionBy("year", "month").parquet("/output")
\`\`\`

### 캐싱

\`\`\`python
# 메모리 캐싱
df_cached = df.cache()  # = df.persist(StorageLevel.MEMORY_ONLY)

# 디스크 캐싱
from pyspark import StorageLevel
df.persist(StorageLevel.DISK_ONLY)

# 캐시 해제
df.unpersist()

# 사용 패턴
df_cached = df.cache()
count = df_cached.count()  # 캐시 트리거
result = df_cached.groupBy("category").sum()  # 캐시 사용
\`\`\`

### 브로드캐스트 조인

\`\`\`python
from pyspark.sql.functions import broadcast

# 작은 테이블 브로드캐스트
small_df = spark.table("dim_product")  # 작은 테이블
large_df = spark.table("fact_sales")   # 큰 테이블

# 브로드캐스트 조인
result = large_df.join(broadcast(small_df), "product_id")
\`\`\`

### 조인 최적화

\`\`\`python
# 1. 조인 전 필터
df_filtered = df.filter(df.date >= "2024-01-01")
result = df_filtered.join(dim, "key")

# 2. 필요한 컬럼만 선택
df_minimal = df.select("key", "value1", "value2")
result = df_minimal.join(dim.select("key", "name"), "key")

# 3. 조인 힌트
result = df.join(other.hint("shuffle_hash"), "key")
# 힌트: broadcast, shuffle_hash, shuffle_merge
\`\`\`

### 메모리 관리

\`\`\`python
# SparkSession 설정
spark = SparkSession.builder \\
    .config("spark.driver.memory", "4g") \\
    .config("spark.executor.memory", "8g") \\
    .config("spark.sql.shuffle.partitions", 200) \\
    .getOrCreate()

# 메모리 절약
# - 불필요한 컬럼 제거
# - 타입 최적화 (String → Integer)
# - 중간 결과 캐시 후 이전 캐시 해제
\`\`\`
        `,
        externalLinks: [
          { title: 'Spark Performance Tuning', url: 'https://spark.apache.org/docs/latest/tuning.html' }
        ]
      }
    },
    {
      id: 'optimization-exercise',
      type: 'code',
      title: '성능 최적화 실습',
      duration: 60,
      content: {
        objectives: [
          '느린 Transform을 최적화한다',
          '최적화 전후 성능을 비교한다'
        ],
        instructions: `
## 성능 최적화 실습

### 시나리오
대용량 조인 Transform 최적화

### Before

\`\`\`python
def slow_transform(df_large, df_small):
    # 비효율적
    return df_large.join(df_small, "key")
\`\`\`

### 최적화 적용

1. 브로드캐스트 조인
2. 조인 전 필터
3. 필요한 컬럼만 선택
4. 적절한 파티셔닝

### 체크리스트

- [ ] 병목 식별
- [ ] 최적화 적용
- [ ] 성능 비교
        `,
        starterCode: `# 최적화 전

def slow_transform(spark, large_df, small_df):
    # TODO: 최적화 필요
    result = large_df.join(small_df, "key")
    return result.groupBy("category").sum("amount")
`,
        solutionCode: `# 최적화 후
from pyspark.sql.functions import broadcast

def optimized_transform(spark, large_df, small_df):
    # 1. 필요한 컬럼만 선택
    large_minimal = large_df.select("key", "category", "amount")
    small_minimal = small_df.select("key", "name")

    # 2. 조인 전 필터 (예: 최근 1년)
    large_filtered = large_minimal.filter(large_minimal.date >= "2023-01-01")

    # 3. 브로드캐스트 조인
    joined = large_filtered.join(broadcast(small_minimal), "key")

    # 4. 집계
    return joined.groupBy("category").sum("amount")
`
      }
    },
    {
      id: 'day3-quiz',
      type: 'quiz',
      title: '증분 처리 & 최적화 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: '증분 처리의 장점은?',
            options: ['코드 간결화', '처리 시간 단축', '메모리 증가', '복잡성 감소'],
            answer: 1,
            explanation: '증분 처리는 변경분만 처리하므로 시간이 단축됩니다.'
          },
          {
            question: '브로드캐스트 조인의 조건은?',
            options: ['큰 테이블끼리', '작은 테이블이 있을 때', '항상 사용', '사용 금지'],
            answer: 1,
            explanation: '한쪽 테이블이 작을 때(수 MB) 브로드캐스트 조인이 효율적입니다.'
          }
        ]
      }
    },
    {
      id: 'day3-project',
      type: 'project',
      title: '최적화 전략 수립',
      duration: 15,
      content: {
        objectives: [
          '프로젝트의 성능 최적화 전략을 수립한다'
        ],
        requirements: [
          '**최적화 전략서**',
          '',
          '## 대상 Transform',
          '| Transform | 현재 시간 | 목표 시간 | 전략 |',
          '|-----------|----------|----------|------|',
          '| | | | |'
        ],
        evaluationCriteria: [
          '전략 구체성'
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'cicd-deployment',
  title: 'CI/CD & 배포',
  totalDuration: 180,
  tasks: [
    {
      id: 'cicd-workflow',
      type: 'reading',
      title: 'CI/CD 워크플로우',
      duration: 45,
      content: {
        objectives: [
          'Foundry CI/CD 파이프라인을 이해한다',
          '브랜치 전략과 코드 리뷰를 파악한다',
          '자동화된 테스트와 배포를 설정한다'
        ],
        markdown: `
## CI/CD 워크플로우

### Foundry CI/CD

\`\`\`
Git Workflow:

feature/new-transform
      │
      ▼
   [Commit]
      │
      ▼
   [PR 생성]
      │
      ▼
   [자동 빌드]
      │
      ▼
   [코드 리뷰]
      │
      ▼
   [머지 → develop]
      │
      ▼
   [자동 빌드 → 테스트 환경]
      │
      ▼
   [승인]
      │
      ▼
   [머지 → main]
      │
      ▼
   [프로덕션 배포]
\`\`\`

### 브랜치 전략

\`\`\`
main (프로덕션)
├── develop (통합)
│   ├── feature/customer-analysis
│   ├── feature/new-pipeline
│   └── bugfix/null-handling
└── hotfix/critical-fix
\`\`\`

### 자동 빌드

\`\`\`yaml
# 빌드 설정 예시
checks:
  - name: lint
    command: pylint src/

  - name: test
    command: pytest tests/

  - name: build
    command: transforms build
\`\`\`

### 코드 리뷰 체크리스트

\`\`\`
□ 코드 스타일 준수
□ 테스트 포함
□ 문서 업데이트
□ 성능 고려
□ 보안 검토
□ 의존성 확인
\`\`\`
        `,
        externalLinks: [
          { title: 'CI/CD Guide', url: 'https://learn.palantir.com/cicd' }
        ]
      }
    },
    {
      id: 'deployment-strategies',
      type: 'reading',
      title: '배포 전략',
      duration: 40,
      content: {
        objectives: [
          '배포 전략을 이해한다',
          '롤백 절차를 파악한다',
          '프로덕션 배포 베스트 프랙티스를 익힌다'
        ],
        markdown: `
## 배포 전략

### 배포 유형

\`\`\`
1. Direct Deploy
   └── 직접 프로덕션 배포
   └── 위험도 높음

2. Blue-Green
   └── 새 버전 준비 후 전환
   └── 빠른 롤백 가능

3. Canary
   └── 일부에 먼저 배포
   └── 점진적 확대
\`\`\`

### 롤백 절차

\`\`\`
문제 발생 시:

1. 문제 식별
   └── 모니터링 알림
   └── 사용자 리포트

2. 영향 평가
   └── 영향 범위 파악
   └── 다운스트림 확인

3. 롤백 결정
   └── 이전 버전으로 롤백
   └── 또는 핫픽스

4. 롤백 실행
   └── 이전 커밋 빌드
   └── 배포

5. 검증
   └── 정상 동작 확인
   └── 모니터링
\`\`\`

### 베스트 프랙티스

\`\`\`
✅ DO:
├── 테스트 환경에서 먼저 검증
├── 점진적 롤아웃
├── 모니터링 설정
├── 롤백 계획 준비
└── 변경 로그 유지

❌ DON'T:
├── 금요일 배포
├── 테스트 없이 배포
├── 대규모 변경 한번에
└── 롤백 계획 없이
\`\`\`
        `,
        externalLinks: [
          { title: 'Deployment Guide', url: 'https://learn.palantir.com/deployment' }
        ]
      }
    },
    {
      id: 'cicd-exercise',
      type: 'code',
      title: 'CI/CD 설정 실습',
      duration: 55,
      content: {
        objectives: [
          'CI/CD 설정을 구성한다',
          '자동화된 테스트를 설정한다',
          '배포 워크플로우를 구현한다'
        ],
        instructions: `
## CI/CD 설정 실습

### 실습 1: 브랜치 생성

\`\`\`bash
git checkout -b feature/my-transform
\`\`\`

### 실습 2: 코드 작성 및 테스트

1. Transform 코드 작성
2. 테스트 코드 작성
3. 로컬 테스트 실행

### 실습 3: PR 생성

1. 커밋 및 푸시
2. PR 생성
3. 자동 빌드 확인

### 실습 4: 리뷰 및 머지

1. 코드 리뷰
2. 피드백 반영
3. 머지

### 체크리스트

- [ ] 브랜치 생성
- [ ] 코드 작성
- [ ] 테스트 작성
- [ ] PR 생성
- [ ] 빌드 성공
- [ ] 머지 완료
        `,
        starterCode: `# CI/CD 워크플로우 기록

## 브랜치
-

## 커밋
-

## PR
-

## 빌드 결과
-
`,
        solutionCode: `# CI/CD 워크플로우 기록

## 브랜치
feature/customer-analysis-v2

## 커밋
- "Add customer tier calculation"
- "Add unit tests"
- "Fix lint warnings"

## PR
PR #42: Customer Analysis V2

## 빌드 결과
- Lint: ✅ Pass
- Test: ✅ 15/15 Pass
- Build: ✅ Success
`
      }
    },
    {
      id: 'day4-quiz',
      type: 'quiz',
      title: 'CI/CD 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Canary 배포의 장점은?',
            options: ['빠른 배포', '위험 최소화', '코드 간결화', '비용 절감'],
            answer: 1,
            explanation: 'Canary 배포는 일부에 먼저 배포하여 위험을 최소화합니다.'
          },
          {
            question: '프로덕션 배포 전 반드시 해야 하는 것은?',
            options: ['문서화', '테스트 환경 검증', '회의', '휴식'],
            answer: 1,
            explanation: '프로덕션 배포 전에는 반드시 테스트 환경에서 검증해야 합니다.'
          }
        ]
      }
    },
    {
      id: 'day4-project',
      type: 'project',
      title: 'CI/CD 계획',
      duration: 25,
      content: {
        objectives: [
          '프로젝트의 CI/CD 계획을 수립한다'
        ],
        requirements: [
          '**CI/CD 계획서**',
          '',
          '## 브랜치 전략',
          '-',
          '',
          '## 배포 전략',
          '-',
          '',
          '## 롤백 절차',
          '-'
        ],
        evaluationCriteria: [
          '계획 완성도'
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'week4-checkpoint',
  title: 'Week 4 체크포인트',
  totalDuration: 180,
  tasks: [
    {
      id: 'transforms-project',
      type: 'project',
      title: 'Code Transforms 종합 프로젝트',
      duration: 120,
      content: {
        objectives: [
          '학습한 내용을 종합하여 Transform 프로젝트를 완성한다',
          '테스트와 CI/CD를 포함한다'
        ],
        requirements: [
          '**Code Transforms 종합 프로젝트**',
          '',
          '## 요구사항',
          '',
          '1. **Transform 구현**',
          '   - PySpark 기반 2개 이상',
          '   - 윈도우 함수 활용',
          '   - 모듈화된 코드',
          '',
          '2. **테스트**',
          '   - 유닛 테스트 5개 이상',
          '   - 커버리지 70% 이상',
          '',
          '3. **성능 최적화**',
          '   - 증분 처리 또는 최적화 적용',
          '   - 성능 측정 결과',
          '',
          '4. **CI/CD**',
          '   - 자동화된 테스트',
          '   - 문서화',
          '',
          '## 산출물',
          '- [ ] Transform 코드',
          '- [ ] 테스트 코드',
          '- [ ] CI/CD 설정',
          '- [ ] 문서'
        ],
        evaluationCriteria: [
          'Transform 품질 (35%)',
          '테스트 (25%)',
          '성능 (20%)',
          'CI/CD & 문서 (20%)'
        ]
      }
    },
    {
      id: 'week4-review',
      type: 'challenge',
      title: 'Week 4 체크포인트',
      duration: 60,
      content: {
        objectives: [
          'Week 4 산출물을 점검한다',
          'Data Engineer 자격증 준비 상태를 확인한다'
        ],
        requirements: [
          '**Week 4 산출물 체크리스트**',
          '',
          '□ PySpark Transform 구현',
          '□ 유닛 테스트 작성',
          '□ 성능 최적화 적용',
          '□ CI/CD 설정',
          '□ **종합 프로젝트**',
          '',
          '**Data Engineer 자격증 준비**',
          '',
          '□ Palantir Learn 코스 완료',
          '□ 모의시험 통과',
          '',
          '**Week 5-6 계획: Ontology & Application**'
        ],
        evaluationCriteria: [
          '산출물 완성도',
          '자격증 준비 상태'
        ]
      }
    }
  ]
}

export const foundryTransformsWeek: Week = {
  slug: 'foundry-transforms',
  week: 4,
  phase: 7,
  month: 14,
  access: 'pro',
  title: 'Code Transforms (PySpark)',
  topics: ['Transforms API', 'PySpark', 'Testing', 'Performance', 'CI/CD'],
  practice: 'Code Transforms 종합 프로젝트',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
