// Week 6 Day 5: Weekly Project - 실시간 주문 처리 파이프라인
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'w6d5t1',
    title: '프로젝트 개요: 실시간 주문 파이프라인',
    type: 'video',
    duration: 20,
    content: {
      videoUrl: '',
      transcript: `
# 실시간 주문 처리 파이프라인 프로젝트

## 프로젝트 목표

이커머스 주문 스트림을 실시간으로 처리하여 Delta Lake에 저장하고,
실시간 대시보드용 집계 데이터를 생성합니다.

## 아키텍처

\`\`\`
[Rate Source]        [Streaming]         [Delta Lake]
    │                     │                    │
    ▼                     ▼                    ▼
┌─────────┐        ┌───────────┐        ┌───────────┐
│ Order   │───────▶│ Transform │───────▶│ fact_     │
│ Stream  │        │ & Filter  │        │ orders    │
└─────────┘        └───────────┘        └───────────┘
                         │
                         ▼
                   ┌───────────┐        ┌───────────┐
                   │ Window    │───────▶│ agg_      │
                   │ Aggregate │        │ metrics   │
                   └───────────┘        └───────────┘
                         │
                         ▼
                   ┌───────────┐        ┌───────────┐
                   │ Anomaly   │───────▶│ alerts    │
                   │ Detection │        │           │
                   └───────────┘        └───────────┘
\`\`\`

## 요구사항

### 1. 데이터 생성 (Rate Source)
- 초당 20개 주문 생성
- 필드: order_id, user_id, product_id, amount, timestamp

### 2. 데이터 저장 (Delta Lake)
- fact_orders: 모든 주문 (Append)
- agg_metrics: 5분 윈도우 집계 (Update)
- alerts: 이상 주문 (Append)

### 3. 실시간 집계
- 5분 윈도우별 총 매출, 주문 수
- 상품별 판매량
- 지역별 매출 비중

### 4. 이상 탐지
- 단일 주문 > 5000
- 5분 내 동일 사용자 5회 이상 주문

## 평가 기준

| 항목 | 배점 |
|------|------|
| 스트리밍 파이프라인 구현 | 30% |
| Delta Lake 적재 | 25% |
| 실시간 집계 정확성 | 20% |
| 이상 탐지 로직 | 15% |
| 코드 품질 및 문서화 | 10% |
      `,
      objectives: [
        '실시간 주문 처리 시스템 아키텍처 이해',
        'Structured Streaming + Delta Lake 통합',
        '윈도우 집계 및 이상 탐지 구현'
      ],
      keyPoints: [
        '여러 싱크로 동시 저장 가능',
        'Checkpoint로 정확히 한 번 처리 보장',
        'Watermark로 늦은 데이터 허용'
      ]
    }
  },
  {
    id: 'w6d5t2',
    title: '스트리밍 소스 및 기본 저장',
    type: 'code',
    duration: 40,
    content: {
      instructions: `
# 스트리밍 소스 및 기본 저장

## 목표
1. Rate Source로 주문 데이터 시뮬레이션
2. Delta Lake에 fact_orders 저장
3. Checkpoint 설정

## 구현 단계
1. SparkSession 설정 (Delta 확장 포함)
2. Rate Source로 데이터 생성
3. 주문 데이터 변환
4. Delta Lake 저장
      `,
      starterCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import *

# SparkSession 생성 (Delta Lake 설정)
spark = SparkSession.builder \\
    .appName("realtime-orders") \\
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
    .getOrCreate()

# 경로 설정
BASE_PATH = "/tmp/realtime_orders"
FACT_ORDERS_PATH = f"{BASE_PATH}/fact_orders"
CHECKPOINT_PATH = f"{BASE_PATH}/checkpoints"

# TODO 1: Rate Source로 데이터 생성 (초당 20개)


# TODO 2: 주문 데이터 변환
# - order_id: value (자동 증가)
# - user_id: 1-100 랜덤
# - product_id: 1-50 랜덤
# - amount: 10-1000 랜덤 (5%는 5000-10000)
# - region: ["Seoul", "Busan", "Daegu", "Incheon"] 랜덤
# - timestamp: 자동


# TODO 3: Delta Lake에 저장
# - format: delta
# - outputMode: append
# - checkpointLocation 설정


# 쿼리 시작
`,
      solutionCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import *

spark = SparkSession.builder \\
    .appName("realtime-orders") \\
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
    .getOrCreate()

BASE_PATH = "/tmp/realtime_orders"
FACT_ORDERS_PATH = f"{BASE_PATH}/fact_orders"
CHECKPOINT_PATH = f"{BASE_PATH}/checkpoints/fact_orders"

# 1. Rate Source (초당 20개)
raw_stream = (
    spark.readStream
    .format("rate")
    .option("rowsPerSecond", 20)
    .load()
)

# 2. 주문 데이터 변환
regions = F.array(F.lit("Seoul"), F.lit("Busan"), F.lit("Daegu"), F.lit("Incheon"))

# 5%는 이상 주문 (5000-10000)
amount_expr = F.when(
    F.rand() < 0.05,
    F.rand() * 5000 + 5000  # 이상 금액
).otherwise(
    F.rand() * 990 + 10     # 정상 금액
)

orders_df = raw_stream.select(
    F.col("value").alias("order_id"),
    ((F.rand() * 100) + 1).cast("int").alias("user_id"),
    ((F.rand() * 50) + 1).cast("int").alias("product_id"),
    F.round(amount_expr, 2).alias("amount"),
    F.element_at(regions, (F.rand() * 4 + 1).cast("int")).alias("region"),
    F.col("timestamp").alias("order_time")
)

# 3. Delta Lake에 저장
query = (
    orders_df.writeStream
    .format("delta")
    .outputMode("append")
    .option("checkpointLocation", CHECKPOINT_PATH)
    .trigger(processingTime="10 seconds")
    .start(FACT_ORDERS_PATH)
)

print(f"Streaming query started. Writing to: {FACT_ORDERS_PATH}")
print(f"Checkpoint: {CHECKPOINT_PATH}")
print("Press Ctrl+C to stop...")

# 30초 후 확인
import time
time.sleep(30)

# 저장된 데이터 확인
print("\\n=== Saved Orders ===")
spark.read.format("delta").load(FACT_ORDERS_PATH).show(10)
spark.read.format("delta").load(FACT_ORDERS_PATH).count()
`,
      hints: [
        'F.array()로 지역 배열 생성',
        'F.when().otherwise()로 이상 금액 시뮬레이션',
        'trigger(processingTime)으로 배치 간격 조절',
        'Checkpoint 경로는 스트림마다 고유해야 함'
      ]
    }
  },
  {
    id: 'w6d5t3',
    title: '실시간 집계 구현',
    type: 'code',
    duration: 40,
    content: {
      instructions: `
# 실시간 집계 구현

## 목표
1. 5분 윈도우 매출 집계
2. 지역별 매출 비중
3. Delta Lake에 집계 결과 저장

## 집계 항목
- 5분 윈도우별: 총 매출, 주문 수, 평균 주문 금액
- 지역별: 매출 비중
- 상품별: Top 10 판매 상품
      `,
      starterCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.window import Window

spark = SparkSession.builder.appName("realtime-aggregation").getOrCreate()

BASE_PATH = "/tmp/realtime_orders"
FACT_ORDERS_PATH = f"{BASE_PATH}/fact_orders"
AGG_METRICS_PATH = f"{BASE_PATH}/agg_metrics"
CHECKPOINT_PATH = f"{BASE_PATH}/checkpoints/agg_metrics"

# 주문 스트림 읽기
orders_stream = (
    spark.readStream
    .format("delta")
    .load(FACT_ORDERS_PATH)
)

# TODO 1: Watermark 설정 (10분)


# TODO 2: 5분 윈도우 집계
# - window_start, window_end
# - total_sales (매출 합계)
# - order_count (주문 수)
# - avg_order_value (평균 주문 금액)


# TODO 3: 지역별 매출 집계 (5분 윈도우)


# TODO 4: Delta Lake에 저장 (update mode)
`,
      solutionCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.window import Window

spark = SparkSession.builder \\
    .appName("realtime-aggregation") \\
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
    .getOrCreate()

BASE_PATH = "/tmp/realtime_orders"
FACT_ORDERS_PATH = f"{BASE_PATH}/fact_orders"
AGG_METRICS_PATH = f"{BASE_PATH}/agg_metrics"
REGION_METRICS_PATH = f"{BASE_PATH}/region_metrics"
CHECKPOINT_AGG = f"{BASE_PATH}/checkpoints/agg_metrics"
CHECKPOINT_REGION = f"{BASE_PATH}/checkpoints/region_metrics"

# 주문 스트림 읽기
orders_stream = (
    spark.readStream
    .format("delta")
    .load(FACT_ORDERS_PATH)
)

# 1. Watermark 설정
orders_with_watermark = orders_stream.withWatermark("order_time", "10 minutes")

# 2. 5분 윈도우 전체 집계
window_agg = (
    orders_with_watermark
    .groupBy(F.window("order_time", "5 minutes"))
    .agg(
        F.sum("amount").alias("total_sales"),
        F.count("*").alias("order_count"),
        F.round(F.avg("amount"), 2).alias("avg_order_value"),
        F.countDistinct("user_id").alias("unique_users")
    )
    .select(
        F.col("window.start").alias("window_start"),
        F.col("window.end").alias("window_end"),
        "total_sales",
        "order_count",
        "avg_order_value",
        "unique_users"
    )
)

# 3. 지역별 매출 집계
region_agg = (
    orders_with_watermark
    .groupBy(
        F.window("order_time", "5 minutes"),
        "region"
    )
    .agg(
        F.sum("amount").alias("region_sales"),
        F.count("*").alias("region_orders")
    )
    .select(
        F.col("window.start").alias("window_start"),
        F.col("window.end").alias("window_end"),
        "region",
        "region_sales",
        "region_orders"
    )
)

# 4. Delta Lake에 저장
# 전체 집계
query1 = (
    window_agg.writeStream
    .format("delta")
    .outputMode("update")
    .option("checkpointLocation", CHECKPOINT_AGG)
    .trigger(processingTime="30 seconds")
    .start(AGG_METRICS_PATH)
)

# 지역별 집계
query2 = (
    region_agg.writeStream
    .format("delta")
    .outputMode("update")
    .option("checkpointLocation", CHECKPOINT_REGION)
    .trigger(processingTime="30 seconds")
    .start(REGION_METRICS_PATH)
)

print("Aggregation queries started!")
print(f"Window metrics: {AGG_METRICS_PATH}")
print(f"Region metrics: {REGION_METRICS_PATH}")

# 1분 후 확인
import time
time.sleep(60)

print("\\n=== Window Aggregation ===")
spark.read.format("delta").load(AGG_METRICS_PATH).orderBy(F.desc("window_start")).show(5)

print("\\n=== Region Aggregation ===")
spark.read.format("delta").load(REGION_METRICS_PATH).orderBy(F.desc("window_start"), "region").show(10)
`,
      hints: [
        'withWatermark()는 집계 전에 호출',
        'F.window()로 시간 윈도우 생성',
        'update 모드는 변경된 윈도우만 출력',
        '여러 스트림 쿼리 동시 실행 가능'
      ]
    }
  },
  {
    id: 'w6d5t4',
    title: '최종 도전과제: 완전한 실시간 파이프라인',
    type: 'challenge',
    duration: 60,
    content: {
      instructions: `
# 최종 도전과제: 완전한 실시간 파이프라인

## 시나리오
지금까지 학습한 내용을 종합하여 완전한 실시간 주문 처리 시스템을 구축합니다.

## 요구사항

### 1. 데이터 파이프라인
- Rate Source로 주문 생성 (초당 20개)
- Delta Lake에 fact_orders 저장
- 5분 윈도우 집계 저장

### 2. 이상 탐지
- 규칙 1: 단일 주문 금액 > 5000
- 규칙 2: 5분 내 동일 사용자 5회 이상 주문
- alerts 테이블에 저장

### 3. 분석 기능
- Time Travel: 10분 전 데이터와 현재 비교
- OPTIMIZE: 스트리밍 종료 후 파일 최적화

### 4. 모니터링
- 각 스트림 쿼리 상태 출력
- 처리된 레코드 수 추적

## 산출물
1. 완전히 동작하는 파이프라인 코드
2. 각 테이블 샘플 데이터 (스크린샷)
3. Time Travel 분석 결과

## 보너스
- foreachBatch로 복잡한 분기 처리
- Spark UI 분석 결과 (스크린샷)
      `,
      starterCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from delta.tables import DeltaTable
import time

# SparkSession
spark = SparkSession.builder \\
    .appName("complete-pipeline") \\
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
    .getOrCreate()

# 경로 설정
BASE_PATH = "/tmp/complete_pipeline"
FACT_ORDERS = f"{BASE_PATH}/fact_orders"
AGG_METRICS = f"{BASE_PATH}/agg_metrics"
ALERTS = f"{BASE_PATH}/alerts"

# TODO 1: Rate Source + 주문 데이터 변환


# TODO 2: fact_orders 저장 스트림


# TODO 3: 윈도우 집계 스트림


# TODO 4: 이상 탐지 스트림
# - 단일 금액 > 5000
# - 5분 내 동일 사용자 5회 이상


# TODO 5: 모든 쿼리 시작 및 모니터링


# TODO 6: Time Travel 분석 (10분 후 실행)


# TODO 7: OPTIMIZE 실행 (스트리밍 종료 후)
`,
      requirements: [
        'fact_orders, agg_metrics, alerts 3개 Delta 테이블 생성',
        '이상 탐지 규칙 2개 구현',
        'Time Travel로 과거 데이터 비교',
        '모든 스트림 쿼리 정상 동작'
      ],
      evaluationCriteria: [
        '스트리밍 파이프라인 안정성 (30%)',
        'Delta Lake ACID 특성 활용 (25%)',
        '이상 탐지 정확성 (20%)',
        'Time Travel 분석 (15%)',
        '코드 품질 (10%)'
      ],
      hints: [
        'foreachBatch()로 복잡한 분기 처리 가능',
        '빈도 이상 탐지는 groupBy + count 후 filter',
        'DeltaTable.forPath()로 OPTIMIZE 실행',
        'query.status로 쿼리 상태 확인'
      ]
    }
  }
]
