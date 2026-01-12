// Week 6 Day 1: Structured Streaming
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'w6d1t1',
    title: 'Structured Streaming 소개',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: '',
      transcript: `
# Spark Structured Streaming 소개

## 1. Structured Streaming이란?

Structured Streaming은 Spark의 스트림 처리 엔진으로, 배치 처리와 동일한 DataFrame/Dataset API를 사용하여 실시간 데이터를 처리합니다.

### 핵심 특징

| 특징 | 설명 |
|------|------|
| 통합 API | 배치와 동일한 DataFrame API 사용 |
| Exactly-Once | 정확히 한 번 처리 보장 |
| Event Time | 이벤트 시간 기반 처리 |
| Watermark | 늦은 데이터 허용 |

## 2. 마이크로 배치 vs 연속 처리

\`\`\`
Micro-Batch (기본):
  Time: ─────────────────────────────▶
  Batch 1    Batch 2    Batch 3
  ┌─────┐    ┌─────┐    ┌─────┐
  │ ◯◯◯ │    │ ◯◯  │    │ ◯◯◯◯│
  └─────┘    └─────┘    └─────┘
     │          │          │
     ▼          ▼          ▼
  처리       처리       처리

Continuous (실험적):
  Time: ─────────────────────────────▶
  ◯ → 처리 → ◯ → 처리 → ◯ → 처리 →
  (지연시간 ~1ms)
\`\`\`

## 3. 주요 구성 요소

### 입력 소스 (Source)
- **Kafka**: 가장 많이 사용
- **File**: CSV, JSON, Parquet 등
- **Rate**: 테스트용 데이터 생성
- **Socket**: 간단한 테스트용

### 출력 싱크 (Sink)
- **Kafka**: 스트림 to 스트림
- **File**: Parquet, JSON 등
- **Console**: 디버깅용
- **Memory**: 테스트용
- **Delta**: 실무 표준

### Output Mode
| 모드 | 설명 | 사용 시점 |
|------|------|----------|
| Append | 새 행만 추가 | 집계 없는 경우 |
| Complete | 전체 결과 덮어쓰기 | 집계 + 작은 결과 |
| Update | 변경된 행만 업데이트 | 집계 + 큰 결과 |

## 4. 기본 스트리밍 파이프라인

\`\`\`python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("streaming").getOrCreate()

# 1. 소스에서 읽기
stream_df = (
    spark.readStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("subscribe", "events")
    .load()
)

# 2. 변환 (배치와 동일!)
processed = (
    stream_df
    .selectExpr("CAST(value AS STRING) as json")
    .select(F.from_json("json", schema).alias("data"))
    .select("data.*")
    .filter(F.col("event_type") == "purchase")
)

# 3. 싱크에 쓰기
query = (
    processed.writeStream
    .format("delta")
    .outputMode("append")
    .option("checkpointLocation", "/checkpoints/purchases")
    .start("/data/purchases")
)

query.awaitTermination()
\`\`\`

## 5. Checkpoint의 중요성

체크포인트는 스트리밍 쿼리의 상태와 오프셋을 저장합니다.

\`\`\`
/checkpoints/my_query/
├── commits/      # 완료된 배치 기록
├── offsets/      # 처리한 오프셋
├── sources/      # 소스 메타데이터
└── state/        # 상태 저장 (집계 등)
\`\`\`

**중요**: 체크포인트가 없으면 재시작 시 데이터 손실 또는 중복 발생!
      `,
      objectives: [
        'Structured Streaming의 개념과 특징 이해',
        '마이크로 배치 처리 방식 이해',
        '소스, 싱크, Output Mode 구분',
        '기본 스트리밍 파이프라인 구조 파악'
      ],
      keyPoints: [
        'Structured Streaming은 배치와 동일한 API 사용',
        'Checkpoint로 exactly-once 처리 보장',
        'Output Mode는 집계 유무에 따라 선택'
      ]
    }
  },
  {
    id: 'w6d1t2',
    title: 'Watermark와 Window 집계',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `
# Watermark와 Window 집계

## 1. Event Time vs Processing Time

### Event Time
데이터가 **실제로 발생한 시간** (예: 센서 측정 시간)

### Processing Time
데이터가 **시스템에 도착한 시간** (예: Spark에서 처리 시작 시간)

\`\`\`
늦은 데이터 문제:
  Event Time:    10:00    10:01    10:02
  실제 도착:     10:02    10:01    10:05
                  ↑                   ↑
                정상 도착          3분 늦음!
\`\`\`

## 2. Watermark 설정

Watermark는 "이 시간보다 늦은 데이터는 버린다"는 임계값입니다.

\`\`\`python
from pyspark.sql import functions as F

stream_df = (
    spark.readStream
    .format("kafka")
    .load()
)

processed = (
    stream_df
    .selectExpr("CAST(value AS STRING) as json")
    .select(F.from_json("json", schema).alias("data"))
    .select("data.*")
    # 10분까지 늦은 데이터 허용
    .withWatermark("event_time", "10 minutes")
)
\`\`\`

### Watermark 동작 방식

\`\`\`
Current Max Event Time: 10:30
Watermark (10분): 10:20

도착 데이터:
- 10:25 이벤트 → 허용 (Watermark 이후)
- 10:15 이벤트 → 버림 (Watermark 이전)
\`\`\`

## 3. Window 집계

시간 윈도우 기반으로 데이터를 집계합니다.

### Tumbling Window (고정 윈도우)
\`\`\`python
# 5분 단위 집계
windowed = (
    processed
    .groupBy(
        F.window("event_time", "5 minutes"),
        "event_type"
    )
    .agg(F.count("*").alias("count"))
)
\`\`\`

\`\`\`
  10:00-10:05   10:05-10:10   10:10-10:15
  ┌─────────┐   ┌─────────┐   ┌─────────┐
  │ ◯◯◯◯◯   │   │ ◯◯◯     │   │ ◯◯◯◯    │
  └─────────┘   └─────────┘   └─────────┘
  (중복 없음)
\`\`\`

### Sliding Window (슬라이딩 윈도우)
\`\`\`python
# 10분 윈도우, 5분 슬라이드
windowed = (
    processed
    .groupBy(
        F.window("event_time", "10 minutes", "5 minutes"),
        "event_type"
    )
    .agg(F.avg("amount").alias("avg_amount"))
)
\`\`\`

\`\`\`
  10:00-10:10
  ┌───────────────────┐
  │ ◯◯◯◯◯◯◯◯◯        │
  └───────────────────┘
       10:05-10:15
       ┌───────────────────┐
       │      ◯◯◯◯◯◯◯◯◯   │
       └───────────────────┘
  (윈도우 간 중복)
\`\`\`

## 4. 집계 + Watermark 조합

\`\`\`python
result = (
    stream_df
    .withWatermark("event_time", "10 minutes")
    .groupBy(
        F.window("event_time", "5 minutes"),
        "region"
    )
    .agg(
        F.count("*").alias("order_count"),
        F.sum("amount").alias("total_amount")
    )
)

# Complete 모드: 전체 결과
# Update 모드: 변경된 윈도우만
query = (
    result.writeStream
    .format("console")
    .outputMode("update")
    .start()
)
\`\`\`

## 5. 주의사항

| 항목 | 권장 |
|------|------|
| Watermark | 데이터 지연 시간의 2-3배 |
| Window 크기 | 비즈니스 요구사항에 맞게 |
| Output Mode | 집계 결과 크기에 따라 선택 |
| State 관리 | 오래된 상태 자동 정리됨 |
      `,
      externalLinks: [
        {
          title: 'Structured Streaming Programming Guide',
          url: 'https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html'
        },
        {
          title: 'Handling Late Data with Watermarks',
          url: 'https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html#handling-late-data-and-watermarking'
        }
      ]
    }
  },
  {
    id: 'w6d1t3',
    title: 'Rate Source로 스트리밍 실습',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# Rate Source로 스트리밍 테스트

Rate Source는 Kafka 없이도 스트리밍 테스트가 가능한 내장 소스입니다.

## 목표
1. Rate Source로 데이터 생성
2. Window 집계 수행
3. 결과 확인

## 환경
- Databricks Community Edition 또는
- 로컬 PySpark (spark-3.x)
      `,
      starterCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import *

# SparkSession 생성
spark = SparkSession.builder \\
    .appName("streaming-test") \\
    .getOrCreate()

# Rate Source: 초당 10개 이벤트 생성
stream_df = (
    spark.readStream
    .format("rate")
    .option("rowsPerSecond", 10)
    .load()
)

# TODO: 아래 작업을 완성하세요

# 1. 이벤트 타입 추가 (랜덤)
# event_types = ['click', 'view', 'purchase']
# Hint: F.array() + F.element_at() + (F.rand() * 3 + 1).cast("int")

# 2. 10초 윈도우로 이벤트 타입별 카운트

# 3. Console 싱크로 출력 (outputMode="complete")

# 4. 쿼리 시작 및 대기
`,
      solutionCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import *

spark = SparkSession.builder \\
    .appName("streaming-test") \\
    .getOrCreate()

# Rate Source: 초당 10개 이벤트 생성
stream_df = (
    spark.readStream
    .format("rate")
    .option("rowsPerSecond", 10)
    .load()
)

# 1. 이벤트 타입 추가
event_types = F.array(F.lit("click"), F.lit("view"), F.lit("purchase"))
events_df = stream_df.withColumn(
    "event_type",
    F.element_at(event_types, (F.rand() * 3 + 1).cast("int"))
)

# 2. 10초 윈도우로 이벤트 타입별 카운트
windowed = (
    events_df
    .withWatermark("timestamp", "30 seconds")
    .groupBy(
        F.window("timestamp", "10 seconds"),
        "event_type"
    )
    .agg(F.count("*").alias("count"))
    .select(
        F.col("window.start").alias("window_start"),
        F.col("window.end").alias("window_end"),
        "event_type",
        "count"
    )
)

# 3. Console 싱크로 출력
query = (
    windowed.writeStream
    .format("console")
    .outputMode("complete")
    .option("truncate", False)
    .trigger(processingTime="5 seconds")  # 5초마다 출력
    .start()
)

# 4. 쿼리 대기 (Ctrl+C로 중단)
query.awaitTermination()
`,
      hints: [
        'Rate Source는 timestamp, value 두 컬럼을 생성합니다',
        'F.array()로 배열 생성, F.element_at()으로 랜덤 선택',
        'Complete 모드는 집계 결과 전체를 출력합니다',
        'trigger(processingTime)으로 출력 주기 조절 가능'
      ]
    }
  },
  {
    id: 'w6d1t4',
    title: 'Kafka 연동 기초',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `
# Kafka 연동 기초

## 1. Kafka 소스 설정

\`\`\`python
# Kafka에서 읽기
kafka_df = (
    spark.readStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("subscribe", "my-topic")          # 단일 토픽
    # .option("subscribePattern", "topic-*")  # 패턴 매칭
    # .option("assign", '{"topic": [0,1,2]}') # 특정 파티션
    .option("startingOffsets", "latest")      # earliest, latest, JSON
    .option("maxOffsetsPerTrigger", 10000)    # 배치당 최대 레코드
    .load()
)
\`\`\`

## 2. Kafka 메시지 구조

\`\`\`
Kafka 메시지 스키마:
├── key: binary
├── value: binary (실제 데이터)
├── topic: string
├── partition: int
├── offset: long
├── timestamp: timestamp
└── timestampType: int
\`\`\`

## 3. JSON 파싱

\`\`\`python
from pyspark.sql.types import *

# 메시지 스키마 정의
message_schema = StructType([
    StructField("user_id", StringType()),
    StructField("event_type", StringType()),
    StructField("amount", DoubleType()),
    StructField("event_time", TimestampType())
])

# value 컬럼 파싱
parsed_df = (
    kafka_df
    .selectExpr("CAST(value AS STRING) as json_string")
    .select(
        F.from_json("json_string", message_schema).alias("data")
    )
    .select("data.*")
)
\`\`\`

## 4. Kafka 싱크

\`\`\`python
# Kafka로 쓰기
output_df = (
    result_df
    .select(
        F.col("user_id").cast("string").alias("key"),
        F.to_json(F.struct("*")).alias("value")
    )
)

query = (
    output_df.writeStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("topic", "output-topic")
    .option("checkpointLocation", "/checkpoints/output")
    .start()
)
\`\`\`

## 5. 실무 설정 팁

| 옵션 | 권장값 | 설명 |
|------|--------|------|
| maxOffsetsPerTrigger | 10000-100000 | 배치 크기 제어 |
| failOnDataLoss | false | 오프셋 손실 시 계속 진행 |
| kafka.group.id | 지정 | Consumer Group 관리 |
| minPartitions | 파티션수 | 병렬 처리 최소 보장 |

## 6. 에러 처리

\`\`\`python
# 잘못된 JSON 처리
parsed_df = (
    kafka_df
    .selectExpr("CAST(value AS STRING) as json_string")
    .select(
        F.from_json(
            "json_string",
            message_schema,
            {"mode": "PERMISSIVE"}  # 에러 시 null
        ).alias("data"),
        "json_string"  # 원본 보존
    )
    .filter(F.col("data").isNotNull())  # 정상 데이터만
)
\`\`\`
      `,
      externalLinks: [
        {
          title: 'Kafka Integration Guide',
          url: 'https://spark.apache.org/docs/latest/structured-streaming-kafka-integration.html'
        }
      ]
    }
  },
  {
    id: 'w6d1t5',
    title: 'Structured Streaming 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Structured Streaming의 기본 처리 방식은?',
          options: [
            'Continuous Processing',
            'Micro-Batch Processing',
            'Record-by-Record Processing',
            'Batch Processing'
          ],
          answer: 1,
          explanation: 'Structured Streaming은 기본적으로 Micro-Batch 방식으로 처리합니다. Continuous Processing은 실험적 기능입니다.'
        },
        {
          question: 'Watermark의 역할은?',
          options: [
            '데이터 압축',
            '늦은 데이터 허용 범위 설정',
            '파티션 결정',
            '출력 포맷 결정'
          ],
          answer: 1,
          explanation: 'Watermark는 늦게 도착한 데이터를 얼마나 기다릴지 결정합니다. Watermark 이전 데이터는 무시됩니다.'
        },
        {
          question: '집계 쿼리에서 전체 결과를 매번 출력하려면 어떤 Output Mode를 사용해야 하나요?',
          options: [
            'Append',
            'Update',
            'Complete',
            'Overwrite'
          ],
          answer: 2,
          explanation: 'Complete 모드는 집계 결과 전체를 매번 출력합니다. Update는 변경된 행만, Append는 새 행만 출력합니다.'
        },
        {
          question: 'Checkpoint의 주요 목적은?',
          options: [
            '성능 향상',
            '메모리 절약',
            '장애 복구 및 Exactly-Once 보장',
            '데이터 압축'
          ],
          answer: 2,
          explanation: 'Checkpoint는 처리 상태와 오프셋을 저장하여 장애 시 복구하고 Exactly-Once 처리를 보장합니다.'
        },
        {
          question: 'Sliding Window에서 windowDuration=10분, slideDuration=5분일 때, 어떤 특성이 있나요?',
          options: [
            '윈도우 간 데이터 중복 없음',
            '윈도우 간 5분의 데이터가 중복됨',
            '윈도우가 연속되지 않음',
            '5분 단위로 결과 출력됨'
          ],
          answer: 1,
          explanation: '슬라이딩 윈도우에서 slideDuration이 windowDuration보다 작으면 윈도우 간 데이터가 중복됩니다.'
        }
      ]
    }
  },
  {
    id: 'w6d1t6',
    title: '도전과제: 이상 탐지 스트리밍',
    type: 'challenge',
    duration: 40,
    content: {
      instructions: `
# 도전과제: 실시간 이상 탐지

## 시나리오
결제 트랜잭션 스트림에서 이상 거래를 실시간으로 탐지합니다.

## 요구사항

### 1. 데이터 생성
Rate Source로 트랜잭션 시뮬레이션:
- user_id: 1-100 랜덤
- amount: 정상(10-500), 이상(5000+)
- 이상 거래 비율: ~5%

### 2. 이상 탐지 규칙
- 단일 거래 금액 > 3000
- 5분 내 동일 사용자 3회 이상 거래

### 3. 출력
- 정상 거래: normal_transactions 테이블
- 이상 거래: anomaly_alerts 테이블

### 4. 추가 도전
- 이상 거래 발생 시 카운트 누적
- 윈도우별 이상 비율 계산

## 힌트
- 조건별 필터링 후 별도 스트림으로 분기
- 동일 사용자 다중 거래는 groupBy + count 사용
      `,
      starterCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

spark = SparkSession.builder.appName("anomaly-detection").getOrCreate()

# 트랜잭션 스트림 시뮬레이션
raw_stream = (
    spark.readStream
    .format("rate")
    .option("rowsPerSecond", 20)
    .load()
)

# TODO: 트랜잭션 데이터 생성
# - user_id: 1-100
# - amount: 95%는 10-500, 5%는 5000-10000


# TODO: 이상 탐지 규칙 1 - 단일 거래 금액 > 3000


# TODO: 이상 탐지 규칙 2 - 5분 내 동일 사용자 3회 이상


# TODO: 정상/이상 거래 분리 및 저장
`,
      requirements: [
        'Rate Source로 트랜잭션 스트림 생성',
        '단일 금액 기반 이상 탐지',
        '시간 윈도우 기반 빈도 이상 탐지',
        '정상/이상 거래 분리 저장'
      ],
      evaluationCriteria: [
        '스트리밍 파이프라인 정상 동작',
        '이상 탐지 규칙 정확 구현',
        'Watermark 및 Window 적절 설정',
        '코드 가독성 및 주석'
      ],
      hints: [
        'F.when().otherwise()로 이상 금액 시뮬레이션',
        'F.rand()로 랜덤 user_id, amount 생성',
        '빈도 이상은 groupBy + count + filter 조합',
        'foreachBatch()로 복잡한 분기 처리 가능'
      ]
    }
  }
]
