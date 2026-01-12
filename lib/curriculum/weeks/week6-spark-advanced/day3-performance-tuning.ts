// Week 6 Day 3: Spark 성능 튜닝
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'w6d3t1',
    title: 'Spark 성능 튜닝 기초',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: '',
      transcript: `
# Spark 성능 튜닝 기초

## 1. 성능 병목의 원인

| 원인 | 증상 | 해결책 |
|------|------|--------|
| Data Skew | 일부 태스크만 오래 걸림 | Salting, Repartition |
| Shuffle | 네트워크 I/O 폭증 | Broadcast Join |
| Small Files | 태스크 오버헤드 | Coalesce, 파일 병합 |
| OOM | Executor 크래시 | 메모리 증가, 파티션 분할 |

## 2. 파티션 관리

### 파티션 수 설정

\`\`\`python
# Shuffle 파티션 수 (기본: 200)
spark.conf.set("spark.sql.shuffle.partitions", 100)

# 적정 파티션 수 계산
# 목표: 파티션당 100MB ~ 200MB
# 예: 10GB 데이터 → 50~100 파티션
\`\`\`

### Repartition vs Coalesce

\`\`\`python
# Repartition: Full Shuffle (파티션 증가/감소)
df.repartition(100)
df.repartition("date")  # 컬럼 기준 파티셔닝
df.repartition(100, "date")  # 개수 + 컬럼

# Coalesce: Shuffle 없음 (파티션 감소만)
df.coalesce(10)  # 100 → 10 (효율적)
\`\`\`

### 언제 사용하나?

| 상황 | 선택 |
|------|------|
| 파티션 감소 | coalesce (빠름) |
| 파티션 증가 | repartition (필수) |
| 조인 전 정렬 | repartition(col) |
| 저장 전 병합 | coalesce |

## 3. 캐싱 전략

\`\`\`python
from pyspark import StorageLevel

# 메모리 캐싱 (기본)
df.cache()
# 또는
df.persist()

# 저장 레벨 선택
df.persist(StorageLevel.MEMORY_ONLY)        # 메모리만
df.persist(StorageLevel.MEMORY_AND_DISK)    # 메모리 + 디스크
df.persist(StorageLevel.DISK_ONLY)          # 디스크만
df.persist(StorageLevel.MEMORY_ONLY_SER)    # 직렬화 (메모리 절약)

# 캐시 해제
df.unpersist()
\`\`\`

### 캐싱 가이드라인

\`\`\`
캐시해야 할 때:
✓ 여러 번 사용되는 DataFrame
✓ 비용이 높은 변환 결과
✓ 반복 연산 (ML 학습 등)

캐시하면 안 될 때:
✗ 한 번만 사용
✗ 데이터가 메모리보다 큼
✗ 스트리밍 데이터
\`\`\`

## 4. Broadcast Join

작은 테이블을 모든 Executor에 복제하여 Shuffle 없이 조인합니다.

\`\`\`python
from pyspark.sql.functions import broadcast

# 자동 Broadcast (기본: 10MB 이하)
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", 10 * 1024 * 1024)

# 명시적 Broadcast
result = large_df.join(
    broadcast(small_df),
    "key"
)
\`\`\`

### Broadcast Join 성능

\`\`\`
일반 Join (Shuffle):
  Large (1GB) ←→ Small (10MB)
  → 전체 데이터 네트워크 전송

Broadcast Join:
  Large (1GB) + Small (10MB 복제)
  → Small만 복제, 네트워크 절약

성능: 10~100배 향상 가능!
\`\`\`

## 5. Adaptive Query Execution (AQE)

런타임에 실행 계획을 최적화합니다.

\`\`\`python
# AQE 활성화 (Spark 3.0+)
spark.conf.set("spark.sql.adaptive.enabled", True)
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", True)
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", True)

# AQE 기능:
# - 동적 파티션 합병
# - Skew Join 자동 처리
# - 런타임 Join 전략 변경
\`\`\`
      `,
      objectives: [
        '주요 성능 병목 원인 파악',
        '파티션 관리 전략 이해',
        '캐싱과 Broadcast Join 활용법 학습',
        'AQE 기능 이해'
      ],
      keyPoints: [
        '파티션 수는 데이터 크기에 비례하여 설정',
        'Broadcast Join은 작은 테이블에 효과적',
        'AQE는 런타임 최적화로 대부분의 상황에서 유용'
      ]
    }
  },
  {
    id: 'w6d3t2',
    title: 'Data Skew 해결',
    type: 'code',
    duration: 35,
    content: {
      instructions: `
# Data Skew 해결

Data Skew는 특정 파티션에 데이터가 편중되어 일부 태스크만 오래 걸리는 현상입니다.

## 목표
1. Data Skew 시뮬레이션
2. Salting 기법으로 해결
3. 성능 비교

## Skew가 발생하는 상황
- 특정 키에 데이터 집중 (예: null, "unknown")
- 인기 상품/사용자에 데이터 편중
- 날짜별 불균등 분포
      `,
      starterCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
import time

spark = SparkSession.builder.appName("data-skew").getOrCreate()

# Skew가 있는 데이터 생성
# key=1에 90%의 데이터 집중
def create_skewed_data(n_rows):
    data = []
    for i in range(n_rows):
        if i % 10 < 9:  # 90%
            key = 1
        else:  # 10%
            key = i % 100 + 2
        data.append((key, f"value_{i}", i * 1.5))
    return data

# 10만 행 데이터
data = create_skewed_data(100000)
df = spark.createDataFrame(data, ["key", "value", "amount"])

# Skew 확인
print("=== Key 분포 ===")
df.groupBy("key").count().orderBy(F.desc("count")).show(10)

# TODO: 1. 일반 집계 (Skew 상태)
# key별 amount 합계 계산하고 소요 시간 측정


# TODO: 2. Salting으로 Skew 해결
# - salt 컬럼 추가 (0-9 랜덤)
# - (key, salt)로 첫 번째 집계
# - key로 두 번째 집계


# TODO: 3. 성능 비교
`,
      solutionCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
import time

spark = SparkSession.builder.appName("data-skew").getOrCreate()
spark.conf.set("spark.sql.shuffle.partitions", 20)

# Skew 데이터 생성
def create_skewed_data(n_rows):
    data = []
    for i in range(n_rows):
        if i % 10 < 9:
            key = 1
        else:
            key = i % 100 + 2
        data.append((key, f"value_{i}", i * 1.5))
    return data

data = create_skewed_data(100000)
df = spark.createDataFrame(data, ["key", "value", "amount"])

print("=== Key 분포 ===")
df.groupBy("key").count().orderBy(F.desc("count")).show(10)

# 1. 일반 집계 (Skew 상태)
print("\\n=== 일반 집계 (Skew) ===")
start = time.time()
result_normal = df.groupBy("key").agg(F.sum("amount").alias("total"))
result_normal.collect()  # Action 트리거
elapsed_normal = time.time() - start
print(f"소요 시간: {elapsed_normal:.2f}초")
result_normal.show(5)

# 2. Salting으로 Skew 해결
print("\\n=== Salting 적용 ===")
SALT_BUCKETS = 10

start = time.time()

# Step 1: Salt 추가
df_salted = df.withColumn(
    "salt",
    (F.rand() * SALT_BUCKETS).cast("int")
)

# Step 2: (key, salt)로 첫 번째 집계
partial_result = df_salted.groupBy("key", "salt").agg(
    F.sum("amount").alias("partial_total")
)

# Step 3: key로 두 번째 집계
result_salted = partial_result.groupBy("key").agg(
    F.sum("partial_total").alias("total")
)
result_salted.collect()
elapsed_salted = time.time() - start
print(f"소요 시간: {elapsed_salted:.2f}초")
result_salted.show(5)

# 3. 성능 비교
print("\\n=== 성능 비교 ===")
print(f"일반 집계: {elapsed_normal:.2f}초")
print(f"Salting:   {elapsed_salted:.2f}초")
speedup = elapsed_normal / elapsed_salted if elapsed_salted > 0 else 0
print(f"개선 비율: {speedup:.1f}x")

# 결과 검증 (값이 동일해야 함)
print("\\n=== 결과 검증 ===")
normal_total = result_normal.agg(F.sum("total")).collect()[0][0]
salted_total = result_salted.agg(F.sum("total")).collect()[0][0]
print(f"일반 합계: {normal_total}")
print(f"Salting 합계: {salted_total}")
print(f"일치 여부: {abs(normal_total - salted_total) < 0.01}")
`,
      hints: [
        'F.rand()로 0-1 사이 랜덤 값 생성',
        'Salting은 두 번의 집계가 필요 (부분 → 전체)',
        '결과 값이 동일한지 검증 필수',
        '실제 성능 차이는 대용량 데이터에서 더 명확'
      ]
    }
  },
  {
    id: 'w6d3t3',
    title: '메모리 관리',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `
# Spark 메모리 관리

## 1. Executor 메모리 구조

\`\`\`
Executor Memory (spark.executor.memory)
├── Execution Memory (60%)
│   └── Shuffle, Join, Sort, Aggregation
├── Storage Memory (40%)
│   └── Cache, Broadcast
└── User Memory
    └── 사용자 데이터 구조

Off-Heap (선택적)
└── spark.memory.offHeap.enabled
\`\`\`

## 2. 메모리 설정

\`\`\`python
# Executor 메모리
spark.conf.set("spark.executor.memory", "4g")

# Driver 메모리
spark.conf.set("spark.driver.memory", "2g")

# 실행/저장 메모리 비율 (기본 0.6)
spark.conf.set("spark.memory.fraction", 0.6)

# 저장 메모리 비율 (기본 0.5)
spark.conf.set("spark.memory.storageFraction", 0.5)

# Off-Heap 활성화
spark.conf.set("spark.memory.offHeap.enabled", True)
spark.conf.set("spark.memory.offHeap.size", "2g")
\`\`\`

## 3. OOM (Out of Memory) 해결

### 증상별 해결책

| 증상 | 원인 | 해결책 |
|------|------|--------|
| Driver OOM | collect() 대용량 | take(n), write 사용 |
| Executor OOM | 큰 파티션 | 파티션 수 증가 |
| GC Overhead | 메모리 부족 | 메모리 증가, 직렬화 |

### Driver OOM

\`\`\`python
# BAD: 전체 데이터를 Driver로
result = df.collect()  # OOM!

# GOOD: 일부만 가져오기
result = df.take(100)
result = df.head(100)

# GOOD: 파일로 저장
df.write.parquet("/output")
\`\`\`

### Executor OOM

\`\`\`python
# 파티션 수 증가
spark.conf.set("spark.sql.shuffle.partitions", 400)
df.repartition(400)

# 스필 허용
spark.conf.set("spark.sql.shuffle.spill.enabled", True)
\`\`\`

## 4. 직렬화 최적화

\`\`\`python
# Kryo 직렬화 (더 효율적)
spark.conf.set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")

# 클래스 등록 (선택)
spark.conf.set("spark.kryo.registrationRequired", False)
\`\`\`

### 직렬화 비교

| 방식 | 속도 | 크기 | 사용 시점 |
|------|------|------|----------|
| Java | 느림 | 큼 | 기본값 |
| Kryo | 빠름 | 작음 | 권장 |

## 5. GC 튜닝

\`\`\`python
# G1GC 사용 (대용량 힙에 적합)
spark.conf.set(
    "spark.executor.extraJavaOptions",
    "-XX:+UseG1GC -XX:InitiatingHeapOccupancyPercent=35"
)

# GC 로그 확인
spark.conf.set(
    "spark.executor.extraJavaOptions",
    "-verbose:gc -XX:+PrintGCDetails"
)
\`\`\`

## 6. 메모리 모니터링

\`\`\`python
# 캐시된 데이터 크기 확인
spark.catalog.clearCache()
df.cache()
df.count()  # 캐시 트리거

# Storage 탭에서 확인 (Spark UI)
# http://localhost:4040/storage
\`\`\`

## 7. 권장 설정

| 클러스터 규모 | executor.memory | executor.cores | partitions |
|--------------|-----------------|----------------|------------|
| 소규모 (10GB) | 4g | 2 | 50-100 |
| 중규모 (100GB) | 8g | 4 | 200-400 |
| 대규모 (1TB) | 16g | 4-8 | 1000-2000 |
      `,
      externalLinks: [
        {
          title: 'Spark Memory Management',
          url: 'https://spark.apache.org/docs/latest/tuning.html#memory-management-overview'
        }
      ]
    }
  },
  {
    id: 'w6d3t4',
    title: '성능 튜닝 실습',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# 종합 성능 튜닝 실습

여러 튜닝 기법을 조합하여 쿼리 성능을 최적화합니다.

## 시나리오
주문 데이터와 상품 데이터를 조인하여 카테고리별 매출을 집계합니다.

## 튜닝 포인트
1. Broadcast Join 적용
2. 파티션 최적화
3. 캐싱 활용
4. AQE 활성화
      `,
      starterCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
import time

spark = SparkSession.builder.appName("perf-tuning").getOrCreate()

# 주문 데이터 (대용량)
orders_data = [(i, i % 100, i * 10.5) for i in range(100000)]
orders_df = spark.createDataFrame(orders_data, ["order_id", "product_id", "amount"])

# 상품 데이터 (소용량)
products_data = [(i, f"Product_{i}", f"Category_{i % 10}") for i in range(100)]
products_df = spark.createDataFrame(products_data, ["product_id", "name", "category"])

# 기본 쿼리 (최적화 전)
def baseline_query():
    result = (
        orders_df
        .join(products_df, "product_id")
        .groupBy("category")
        .agg(F.sum("amount").alias("total_sales"))
    )
    return result

# TODO: 최적화된 쿼리 구현
def optimized_query():
    # 1. Broadcast Join 적용
    # 2. 파티션 수 조정
    # 3. 캐싱 (적절한 경우)
    pass

# 성능 비교
def benchmark(query_func, name, iterations=3):
    times = []
    for _ in range(iterations):
        start = time.time()
        result = query_func()
        result.collect()
        times.append(time.time() - start)
    avg_time = sum(times) / len(times)
    print(f"{name}: {avg_time:.3f}초 (평균)")
    return avg_time

# TODO: 벤치마크 실행 및 결과 비교
`,
      solutionCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
import time

spark = SparkSession.builder \\
    .appName("perf-tuning") \\
    .config("spark.sql.adaptive.enabled", True) \\
    .getOrCreate()

# AQE 활성화
spark.conf.set("spark.sql.adaptive.enabled", True)
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", True)

# 주문 데이터 (대용량)
orders_data = [(i, i % 100, i * 10.5) for i in range(100000)]
orders_df = spark.createDataFrame(orders_data, ["order_id", "product_id", "amount"])

# 상품 데이터 (소용량)
products_data = [(i, f"Product_{i}", f"Category_{i % 10}") for i in range(100)]
products_df = spark.createDataFrame(products_data, ["product_id", "name", "category"])

# 기본 쿼리
def baseline_query():
    spark.conf.set("spark.sql.shuffle.partitions", 200)  # 기본값
    result = (
        orders_df
        .join(products_df, "product_id")
        .groupBy("category")
        .agg(F.sum("amount").alias("total_sales"))
    )
    return result

# 최적화된 쿼리
def optimized_query():
    # 1. 파티션 수 조정 (데이터 크기에 맞게)
    spark.conf.set("spark.sql.shuffle.partitions", 20)

    # 2. 상품 데이터 캐싱 (여러 번 사용될 경우)
    products_cached = products_df.cache()

    # 3. Broadcast Join 적용
    result = (
        orders_df
        .join(F.broadcast(products_cached), "product_id")
        .groupBy("category")
        .agg(F.sum("amount").alias("total_sales"))
    )
    return result

# 벤치마크 함수
def benchmark(query_func, name, iterations=3):
    # 워밍업
    query_func().collect()

    times = []
    for _ in range(iterations):
        spark.catalog.clearCache()  # 캐시 초기화
        start = time.time()
        result = query_func()
        result.collect()
        times.append(time.time() - start)
    avg_time = sum(times) / len(times)
    print(f"{name}: {avg_time:.3f}초 (평균)")
    return avg_time

# 실행
print("=== 성능 벤치마크 ===")
baseline_time = benchmark(baseline_query, "Baseline")
optimized_time = benchmark(optimized_query, "Optimized")

print(f"\\n=== 결과 ===")
print(f"개선 비율: {baseline_time / optimized_time:.2f}x")

# 실행 계획 비교
print("\\n=== Baseline 실행 계획 ===")
baseline_query().explain()

print("\\n=== Optimized 실행 계획 ===")
optimized_query().explain()
`,
      hints: [
        'F.broadcast()로 Broadcast Join 강제',
        '작은 데이터셋은 파티션 수를 줄여야 오버헤드 감소',
        'explain()으로 실행 계획 확인',
        '반복 사용되는 DataFrame만 캐싱'
      ]
    }
  },
  {
    id: 'w6d3t5',
    title: '성능 튜닝 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: '파티션 수를 줄이려면 어떤 메서드가 더 효율적인가요?',
          options: [
            'repartition()',
            'coalesce()',
            'partition()',
            'reduce()'
          ],
          answer: 1,
          explanation: 'coalesce()는 Shuffle 없이 파티션을 줄여 더 효율적입니다. repartition()은 항상 Full Shuffle이 발생합니다.'
        },
        {
          question: 'Broadcast Join이 효과적인 상황은?',
          options: [
            '두 테이블 모두 대용량',
            '한쪽 테이블이 메모리에 들어갈 정도로 작음',
            '두 테이블의 키가 동일',
            '집계 연산이 포함된 경우'
          ],
          answer: 1,
          explanation: 'Broadcast Join은 작은 테이블을 모든 Executor에 복제하므로, 한쪽이 작을 때 효과적입니다.'
        },
        {
          question: 'Data Skew를 해결하는 Salting 기법의 원리는?',
          options: [
            '데이터 압축',
            '랜덤 키를 추가하여 분산',
            '파티션 수 증가',
            '캐싱 활성화'
          ],
          answer: 1,
          explanation: 'Salting은 원본 키에 랜덤 Salt를 추가하여 편중된 데이터를 여러 파티션으로 분산시킵니다.'
        },
        {
          question: 'AQE(Adaptive Query Execution)의 기능이 아닌 것은?',
          options: [
            '동적 파티션 합병',
            'Skew Join 자동 처리',
            '런타임 Join 전략 변경',
            '스키마 자동 변경'
          ],
          answer: 3,
          explanation: 'AQE는 런타임에 실행 계획을 최적화하지만, 스키마 변경은 AQE의 기능이 아닙니다.'
        },
        {
          question: 'Driver OOM을 방지하기 위한 방법은?',
          options: [
            'collect() 대신 write() 사용',
            '파티션 수 감소',
            'Broadcast 비활성화',
            '캐싱 해제'
          ],
          answer: 0,
          explanation: 'collect()는 모든 데이터를 Driver로 가져오므로 OOM 위험이 있습니다. write()로 파일에 저장하거나 take(n)을 사용해야 합니다.'
        }
      ]
    }
  }
]
