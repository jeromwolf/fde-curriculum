// Week 6 Day 2: Delta Lake 기초
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'w6d2t1',
    title: 'Delta Lake 소개',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: '',
      transcript: `
# Delta Lake 소개

## 1. Delta Lake란?

Delta Lake는 데이터 레이크에 **ACID 트랜잭션**을 추가하는 오픈소스 스토리지 레이어입니다.

### 핵심 기능

| 기능 | 설명 | 문제 해결 |
|------|------|----------|
| ACID 트랜잭션 | 원자적 읽기/쓰기 | 동시 쓰기 충돌 |
| 스키마 관리 | 스키마 강제/진화 | 잘못된 데이터 유입 |
| Time Travel | 과거 버전 조회 | 데이터 롤백 |
| 감사 로그 | 변경 이력 추적 | 규정 준수 |

## 2. Parquet vs Delta

\`\`\`
Parquet 문제점:
└── data/
    ├── part-0001.parquet
    ├── part-0002.parquet  ← 동시 쓰기 충돌!
    └── part-0003.parquet

Delta 해결:
└── data/
    ├── _delta_log/         ← 트랜잭션 로그
    │   ├── 00000000.json
    │   ├── 00000001.json
    │   └── 00000002.json
    ├── part-0001.parquet
    ├── part-0002.parquet
    └── part-0003.parquet
\`\`\`

## 3. 트랜잭션 로그 (_delta_log)

\`\`\`json
// 00000001.json
{
  "add": {
    "path": "part-0001.parquet",
    "size": 1024,
    "modificationTime": 1704067200000,
    "dataChange": true
  },
  "commitInfo": {
    "timestamp": 1704067200000,
    "operation": "WRITE",
    "operationParameters": {"mode": "Append"}
  }
}
\`\`\`

## 4. 기본 사용법

### 테이블 생성
\`\`\`python
# DataFrame을 Delta로 저장
df.write.format("delta").save("/data/events")

# 또는 SQL로
spark.sql("""
    CREATE TABLE events
    USING DELTA
    LOCATION '/data/events'
""")
\`\`\`

### 읽기/쓰기
\`\`\`python
# 읽기
df = spark.read.format("delta").load("/data/events")

# 쓰기 (Append)
new_df.write.format("delta").mode("append").save("/data/events")

# 쓰기 (Overwrite)
new_df.write.format("delta").mode("overwrite").save("/data/events")
\`\`\`

## 5. 스키마 강제 & 진화

### 스키마 강제 (기본)
\`\`\`python
# 스키마가 다르면 에러!
df_wrong_schema.write.format("delta") \\
    .mode("append") \\
    .save("/data/events")
# AnalysisException: A schema mismatch detected
\`\`\`

### 스키마 진화
\`\`\`python
# 새 컬럼 자동 추가
df_new_columns.write.format("delta") \\
    .option("mergeSchema", "true") \\
    .mode("append") \\
    .save("/data/events")
\`\`\`

## 6. Databricks와 오픈소스

| 기능 | 오픈소스 Delta | Databricks Delta |
|------|---------------|------------------|
| ACID | O | O |
| Time Travel | O | O |
| OPTIMIZE | X | O |
| Z-ORDER | X | O |
| Auto-Optimize | X | O |
| 가격 | 무료 | 유료 |

대부분의 핵심 기능은 오픈소스에서도 사용 가능합니다!
      `,
      objectives: [
        'Delta Lake의 필요성과 핵심 기능 이해',
        '트랜잭션 로그 구조 이해',
        '기본 읽기/쓰기 방법 학습',
        '스키마 강제와 진화 개념 파악'
      ],
      keyPoints: [
        'Delta Lake는 데이터 레이크에 ACID 트랜잭션 추가',
        '_delta_log에 모든 변경 이력 기록',
        '스키마 강제로 데이터 품질 보장'
      ]
    }
  },
  {
    id: 'w6d2t2',
    title: 'Time Travel 활용',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# Delta Lake Time Travel

Time Travel은 Delta Lake의 핵심 기능으로, 과거 버전의 데이터를 조회하고 복원할 수 있습니다.

## 목표
1. 데이터 변경 이력 생성
2. 과거 버전 조회
3. 데이터 롤백 실습

## 환경
- Databricks Community Edition (권장)
- 로컬: delta-spark 패키지 필요
      `,
      starterCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from delta.tables import DeltaTable

# Delta Lake 설정 (로컬 환경)
spark = SparkSession.builder \\
    .appName("delta-time-travel") \\
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
    .getOrCreate()

# 1. 초기 데이터 생성
data = [
    (1, "Alice", 100),
    (2, "Bob", 200),
    (3, "Charlie", 300)
]
df = spark.createDataFrame(data, ["id", "name", "amount"])

# Delta 테이블 저장
df.write.format("delta").mode("overwrite").save("/tmp/delta-demo")

# TODO: 2. 데이터 업데이트 (amount 2배로)


# TODO: 3. 새 데이터 추가


# TODO: 4. 버전 히스토리 확인


# TODO: 5. 과거 버전 조회 (버전 0, 버전 1)


# TODO: 6. 특정 시점으로 롤백
`,
      solutionCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from delta.tables import DeltaTable

spark = SparkSession.builder \\
    .appName("delta-time-travel") \\
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
    .getOrCreate()

# 1. 초기 데이터 생성 (Version 0)
data = [
    (1, "Alice", 100),
    (2, "Bob", 200),
    (3, "Charlie", 300)
]
df = spark.createDataFrame(data, ["id", "name", "amount"])
df.write.format("delta").mode("overwrite").save("/tmp/delta-demo")

# 2. 데이터 업데이트 (Version 1)
delta_table = DeltaTable.forPath(spark, "/tmp/delta-demo")
delta_table.update(
    condition="id <= 3",
    set={"amount": F.col("amount") * 2}
)

# 3. 새 데이터 추가 (Version 2)
new_data = [(4, "David", 400), (5, "Eve", 500)]
new_df = spark.createDataFrame(new_data, ["id", "name", "amount"])
new_df.write.format("delta").mode("append").save("/tmp/delta-demo")

# 4. 버전 히스토리 확인
history = delta_table.history()
history.select("version", "timestamp", "operation", "operationParameters").show(truncate=False)

# 5. 과거 버전 조회
print("=== Version 0 (초기) ===")
spark.read.format("delta").option("versionAsOf", 0).load("/tmp/delta-demo").show()

print("=== Version 1 (업데이트 후) ===")
spark.read.format("delta").option("versionAsOf", 1).load("/tmp/delta-demo").show()

print("=== 현재 (Version 2) ===")
spark.read.format("delta").load("/tmp/delta-demo").show()

# 6. 특정 버전으로 롤백 (Version 1로 복원)
# 방법 1: 과거 버전을 읽어서 덮어쓰기
df_v1 = spark.read.format("delta").option("versionAsOf", 1).load("/tmp/delta-demo")
df_v1.write.format("delta").mode("overwrite").save("/tmp/delta-demo")

# 방법 2: RESTORE 명령 (SQL)
# spark.sql("RESTORE TABLE delta.\`/tmp/delta-demo\` TO VERSION AS OF 1")

print("=== 롤백 후 ===")
spark.read.format("delta").load("/tmp/delta-demo").show()
`,
      hints: [
        'DeltaTable.forPath()로 기존 테이블 참조',
        'update() 메서드로 조건부 업데이트',
        'option("versionAsOf", n)으로 특정 버전 조회',
        'history()로 변경 이력 확인 가능'
      ]
    }
  },
  {
    id: 'w6d2t3',
    title: 'MERGE (Upsert) 연산',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# Delta Lake MERGE (Upsert)

MERGE는 Delta Lake의 핵심 기능으로, INSERT/UPDATE/DELETE를 하나의 원자적 연산으로 수행합니다.

## 목표
1. CDC(Change Data Capture) 시뮬레이션
2. MERGE로 Upsert 구현
3. SCD Type 1 처리

## 사용 사례
- 마스터 데이터 동기화
- CDC 데이터 적용
- SCD Type 1/2 구현
      `,
      starterCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from delta.tables import DeltaTable

spark = SparkSession.builder.appName("delta-merge").getOrCreate()

# 기존 고객 테이블 (Target)
customers = [
    (1, "Alice", "Seoul", "2024-01-01"),
    (2, "Bob", "Busan", "2024-01-01"),
    (3, "Charlie", "Daegu", "2024-01-01")
]
df = spark.createDataFrame(
    customers,
    ["customer_id", "name", "city", "updated_at"]
)
df.write.format("delta").mode("overwrite").save("/tmp/customers")

# CDC 변경 데이터 (Source)
# I: Insert, U: Update, D: Delete
changes = [
    (2, "Bob", "Seoul", "U"),      # Bob 도시 변경
    (4, "David", "Incheon", "I"),  # 새 고객
    (3, "Charlie", None, "D")      # Charlie 삭제
]
changes_df = spark.createDataFrame(
    changes,
    ["customer_id", "name", "city", "operation"]
)

# TODO: MERGE 연산으로 CDC 적용
# - U: 기존 레코드 업데이트
# - I: 새 레코드 삽입
# - D: 기존 레코드 삭제
`,
      solutionCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from delta.tables import DeltaTable

spark = SparkSession.builder.appName("delta-merge").getOrCreate()

# 기존 고객 테이블
customers = [
    (1, "Alice", "Seoul", "2024-01-01"),
    (2, "Bob", "Busan", "2024-01-01"),
    (3, "Charlie", "Daegu", "2024-01-01")
]
df = spark.createDataFrame(
    customers,
    ["customer_id", "name", "city", "updated_at"]
)
df.write.format("delta").mode("overwrite").save("/tmp/customers")

# CDC 변경 데이터
changes = [
    (2, "Bob", "Seoul", "U"),
    (4, "David", "Incheon", "I"),
    (3, "Charlie", None, "D")
]
changes_df = spark.createDataFrame(
    changes,
    ["customer_id", "name", "city", "operation"]
)

# Delta 테이블 참조
delta_table = DeltaTable.forPath(spark, "/tmp/customers")

# MERGE 연산
delta_table.alias("target").merge(
    changes_df.alias("source"),
    "target.customer_id = source.customer_id"
).whenMatchedUpdate(
    condition="source.operation = 'U'",
    set={
        "name": "source.name",
        "city": "source.city",
        "updated_at": F.current_timestamp()
    }
).whenMatchedDelete(
    condition="source.operation = 'D'"
).whenNotMatchedInsert(
    condition="source.operation = 'I'",
    values={
        "customer_id": "source.customer_id",
        "name": "source.name",
        "city": "source.city",
        "updated_at": F.current_timestamp()
    }
).execute()

# 결과 확인
print("=== MERGE 후 결과 ===")
spark.read.format("delta").load("/tmp/customers").show()

# 변경 이력 확인
delta_table.history().select(
    "version", "operation", "operationMetrics"
).show(truncate=False)
`,
      hints: [
        'whenMatchedUpdate: 일치하면 업데이트',
        'whenMatchedDelete: 일치하면 삭제',
        'whenNotMatchedInsert: 불일치하면 삽입',
        'condition 파라미터로 조건 지정 가능'
      ]
    }
  },
  {
    id: 'w6d2t4',
    title: 'OPTIMIZE와 Z-ORDER',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `
# OPTIMIZE와 Z-ORDER

## 1. Small File Problem

Delta Lake에서 빈번한 쓰기 작업은 많은 작은 파일을 생성합니다.

\`\`\`
문제:
/data/events/
├── part-0001.parquet (1MB)
├── part-0002.parquet (500KB)
├── part-0003.parquet (2MB)
├── ... (수천 개 파일)
└── part-9999.parquet (100KB)

→ 파일 열기 오버헤드 증가
→ 쿼리 성능 저하
\`\`\`

## 2. OPTIMIZE 명령

작은 파일들을 큰 파일로 병합합니다.

\`\`\`sql
-- SQL
OPTIMIZE delta.\`/data/events\`

-- 또는 테이블명으로
OPTIMIZE events
\`\`\`

\`\`\`python
# Python
from delta.tables import DeltaTable

delta_table = DeltaTable.forPath(spark, "/data/events")
delta_table.optimize().executeCompaction()
\`\`\`

### OPTIMIZE 결과

\`\`\`
Before: 1000개 파일 (평균 1MB)
After: 10개 파일 (평균 100MB)

권장 파일 크기: 1GB
\`\`\`

## 3. Z-ORDER (데이터 정렬)

자주 필터링하는 컬럼 기준으로 데이터를 물리적으로 정렬합니다.

\`\`\`sql
-- date, user_id로 Z-ORDER
OPTIMIZE events
ZORDER BY (date, user_id)
\`\`\`

### Z-ORDER 원리

\`\`\`
일반 저장:
  File 1: date=1월, user=1-1000
  File 2: date=1월, user=1001-2000
  File 3: date=2월, user=1-500
  ...

Z-ORDER 후:
  File 1: date=1월1일-5일, user=1-500
  File 2: date=1월1일-5일, user=501-1000
  File 3: date=1월6일-10일, user=1-500
  ...

쿼리: WHERE date='2024-01-03' AND user_id=100
→ Z-ORDER: 1개 파일만 스캔
→ 일반: 여러 파일 스캔
\`\`\`

## 4. 주의사항

| 항목 | 권장 |
|------|------|
| OPTIMIZE 주기 | 일 1회 또는 데이터량에 따라 |
| Z-ORDER 컬럼 | 자주 필터링하는 2-3개 |
| 파일 크기 | 128MB ~ 1GB |
| 비용 | 쓰기 연산이므로 클러스터 비용 발생 |

## 5. Auto-OPTIMIZE (Databricks)

\`\`\`python
# 테이블 속성으로 자동 최적화 설정
spark.sql("""
    ALTER TABLE events
    SET TBLPROPERTIES (
        delta.autoOptimize.optimizeWrite = true,
        delta.autoOptimize.autoCompact = true
    )
""")
\`\`\`

## 6. VACUUM (오래된 파일 삭제)

Time Travel에 사용된 오래된 파일을 정리합니다.

\`\`\`sql
-- 7일 이전 파일 삭제 (기본 보존 기간)
VACUUM events

-- 보존 기간 지정
VACUUM events RETAIN 168 HOURS
\`\`\`

**주의**: VACUUM 후에는 해당 버전 이전으로 Time Travel 불가!

## 7. 실무 권장 사항

\`\`\`python
# 일일 유지보수 작업
def daily_maintenance(table_path):
    delta_table = DeltaTable.forPath(spark, table_path)

    # 1. OPTIMIZE + Z-ORDER
    delta_table.optimize() \\
        .where("date >= current_date() - INTERVAL 7 DAYS") \\
        .executeZOrderBy("date", "user_id")

    # 2. VACUUM (7일 보존)
    delta_table.vacuum(168)  # hours

    # 3. 통계 확인
    history = delta_table.history(1).collect()[0]
    print(f"Last operation: {history['operation']}")
    print(f"Metrics: {history['operationMetrics']}")
\`\`\`
      `,
      externalLinks: [
        {
          title: 'Delta Lake Optimization',
          url: 'https://docs.delta.io/latest/optimizations-oss.html'
        },
        {
          title: 'Z-Order Documentation',
          url: 'https://docs.databricks.com/en/delta/optimize.html'
        }
      ]
    }
  },
  {
    id: 'w6d2t5',
    title: 'Delta Lake 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Delta Lake가 ACID 트랜잭션을 보장하는 핵심 메커니즘은?',
          options: [
            'Parquet 파일 포맷',
            '트랜잭션 로그 (_delta_log)',
            'Spark 메모리 관리',
            '분산 락'
          ],
          answer: 1,
          explanation: 'Delta Lake는 _delta_log 디렉토리에 모든 변경사항을 JSON 형태로 기록하여 ACID 트랜잭션을 보장합니다.'
        },
        {
          question: 'Time Travel에서 특정 버전의 데이터를 조회하는 방법은?',
          options: [
            'option("version", n)',
            'option("versionAsOf", n)',
            'option("atVersion", n)',
            'option("timeTravel", n)'
          ],
          answer: 1,
          explanation: 'versionAsOf 옵션을 사용하여 특정 버전의 데이터를 조회합니다. timestampAsOf로 시간 기준 조회도 가능합니다.'
        },
        {
          question: 'MERGE 연산의 주요 사용 사례가 아닌 것은?',
          options: [
            'CDC 데이터 적용',
            'SCD Type 2 구현',
            '대용량 집계 연산',
            'Upsert (Insert + Update)'
          ],
          answer: 2,
          explanation: 'MERGE는 주로 CDC, SCD, Upsert 등 데이터 동기화에 사용됩니다. 집계 연산에는 적합하지 않습니다.'
        },
        {
          question: 'OPTIMIZE + Z-ORDER의 효과는?',
          options: [
            '메모리 사용량 감소',
            '스키마 자동 변경',
            '쿼리 성능 향상 (데이터 스킵)',
            'Time Travel 기간 연장'
          ],
          answer: 2,
          explanation: 'Z-ORDER는 자주 필터링하는 컬럼 기준으로 데이터를 정렬하여 불필요한 파일 스캔을 줄입니다.'
        },
        {
          question: 'VACUUM 명령 실행 후 주의해야 할 점은?',
          options: [
            '스키마가 변경될 수 있음',
            '삭제된 버전으로 Time Travel 불가',
            '데이터가 영구 삭제됨',
            '트랜잭션 로그가 초기화됨'
          ],
          answer: 1,
          explanation: 'VACUUM은 오래된 파일을 삭제하므로, 삭제된 버전으로는 더 이상 Time Travel할 수 없습니다.'
        }
      ]
    }
  },
  {
    id: 'w6d2t6',
    title: '도전과제: Streaming + Delta Lake',
    type: 'challenge',
    duration: 40,
    content: {
      instructions: `
# 도전과제: Streaming으로 Delta Lake 적재

## 시나리오
실시간 이벤트 스트림을 Delta Lake에 저장하고 분석합니다.

## 요구사항

### 1. 스트리밍 소스
Rate Source로 이벤트 생성:
- event_id: 자동 증가
- event_type: click, view, purchase
- amount: 10-1000 랜덤
- timestamp: 자동

### 2. Delta Lake 저장
- /tmp/streaming_events에 저장
- 체크포인트 설정
- append 모드

### 3. 실시간 집계
- 1분 윈도우로 이벤트 타입별 카운트
- 별도 Delta 테이블에 저장

### 4. 분석 쿼리
- Time Travel로 5분 전 데이터 비교
- 이벤트 타입별 총 금액 집계

## 제출물
- 동작하는 스트리밍 코드
- 분석 쿼리 결과 스크린샷
      `,
      starterCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from delta.tables import DeltaTable

spark = SparkSession.builder \\
    .appName("streaming-delta") \\
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
    .getOrCreate()

# 1. Rate Source로 이벤트 생성
raw_stream = (
    spark.readStream
    .format("rate")
    .option("rowsPerSecond", 10)
    .load()
)

# TODO: 이벤트 데이터 변환


# TODO: Delta Lake에 스트리밍 저장


# TODO: 1분 윈도우 집계 및 별도 Delta 테이블 저장


# TODO: 분석 쿼리 (Time Travel, 집계)
`,
      requirements: [
        'Rate Source에서 Delta Lake로 스트리밍 적재',
        '윈도우 집계 결과 별도 저장',
        'Checkpoint 설정으로 exactly-once 보장',
        'Time Travel 활용 분석'
      ],
      evaluationCriteria: [
        '스트리밍 파이프라인 정상 동작',
        'Delta Lake ACID 특성 활용',
        '윈도우 집계 정확성',
        '코드 구조화 및 주석'
      ],
      hints: [
        'writeStream.format("delta")로 스트리밍 저장',
        'checkpointLocation 필수 설정',
        'trigger(processingTime="10 seconds")로 배치 간격 조절',
        '집계 결과는 complete 또는 update 모드 사용'
      ]
    }
  }
]
