// Day 3: Catalyst 최적화 & 실행 계획
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'w5d3t1',
    title: 'Catalyst Optimizer 이해하기',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=spark-catalyst',
      transcript: `
# Catalyst Optimizer 이해하기

Spark SQL의 핵심 최적화 엔진인 Catalyst를 배워봅니다.

## 1. Catalyst란?

Catalyst는 Spark SQL의 **쿼리 최적화 엔진**입니다.

### 왜 필요한가?

\`\`\`python
# 사용자가 작성한 코드
df.filter(col("age") > 25).select("name", "age")

# vs

# 최적화된 코드 (Catalyst가 자동 변환)
df.select("name", "age").filter(col("age") > 25)
# → 필요한 컬럼만 먼저 선택 (Column Pruning)
\`\`\`

## 2. Catalyst 처리 단계

\`\`\`
사용자 코드
    ↓
[1] Unresolved Logical Plan
    ↓ (Catalog 참조)
[2] Analyzed Logical Plan
    ↓ (Rule-based 최적화)
[3] Optimized Logical Plan
    ↓ (Physical Planning)
[4] Physical Plans (여러 개)
    ↓ (Cost-based 선택)
[5] Selected Physical Plan
    ↓ (Code Generation)
[6] RDD 실행
\`\`\`

## 3. 주요 최적화 규칙

### Predicate Pushdown (술어 밀어내기)
\`\`\`python
# Before: 전체 로드 후 필터
df.join(other).filter(col("date") > "2024-01-01")

# After: 필터 먼저 적용 (데이터 스캔 시점에)
df.filter(col("date") > "2024-01-01").join(other)
\`\`\`

### Column Pruning (컬럼 가지치기)
\`\`\`python
# Before: 모든 컬럼 로드
df.select("*").filter(col("age") > 25).select("name")

# After: 필요한 컬럼만 로드
df.select("name", "age").filter(col("age") > 25).select("name")
\`\`\`

### Constant Folding (상수 접기)
\`\`\`python
# Before: 매 row마다 계산
df.filter(col("year") == 2020 + 4)

# After: 미리 계산
df.filter(col("year") == 2024)
\`\`\`

### Join Reordering (조인 순서 변경)
\`\`\`python
# Before: 비효율적 순서
large_df.join(medium_df).join(small_df)

# After: 작은 테이블부터 조인
small_df.join(medium_df).join(large_df)
\`\`\`

### Broadcast Join Selection
\`\`\`python
# 작은 테이블 감지 → 자동 Broadcast
# spark.sql.autoBroadcastJoinThreshold = 10MB (기본)
\`\`\`

## 4. 실행 계획 확인

\`\`\`python
# 기본 Physical Plan
df.explain()

# 확장 (4단계 모두)
df.explain(extended=True)

# 포맷 지정
df.explain(mode="simple")     # 기본
df.explain(mode="extended")   # 4단계
df.explain(mode="codegen")    # 생성된 코드
df.explain(mode="cost")       # 비용 정보
df.explain(mode="formatted")  # 보기 좋은 형식
\`\`\`

## 5. 실행 계획 읽는 법

\`\`\`
== Physical Plan ==
*(2) Project [name#0, age#1]
+- *(2) Filter (age#1 > 25)
   +- *(1) ColumnarToRow
      +- FileScan parquet [name#0,age#1]
         PushedFilters: [IsNotNull(age), GreaterThan(age,25)]
\`\`\`

- **Project**: SELECT (컬럼 선택)
- **Filter**: WHERE (필터링)
- **FileScan**: 파일 읽기
- **PushedFilters**: Pushdown된 필터
- ***(n)**: WholeStageCodegen 단계

## 6. Tungsten 실행 엔진

Catalyst 최적화 후 Tungsten이 실행을 담당:
- **WholeStageCodegen**: Java 바이트코드 생성
- **메모리 관리**: Off-heap 메모리 사용
- **캐시 친화적 레이아웃**: CPU 캐시 최적화

다음 시간에는 직접 실행 계획을 분석해봅시다!
      `,
      objectives: [
        'Catalyst Optimizer의 역할을 설명할 수 있다',
        '주요 최적화 규칙을 나열할 수 있다',
        'explain()으로 실행 계획을 확인할 수 있다'
      ],
      keyPoints: [
        'Catalyst는 자동 쿼리 최적화 수행',
        'Predicate Pushdown, Column Pruning이 핵심',
        'explain()으로 최적화 결과 확인',
        'Tungsten이 실제 실행 담당'
      ]
    }
  },
  {
    id: 'w5d3t2',
    title: '실행 계획 분석 실습',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# 실행 계획 분석 실습

다양한 쿼리의 실행 계획을 분석하고 최적화 효과를 확인합니다.

## 과제
1. Predicate Pushdown 확인
2. Column Pruning 확인
3. Join 전략 분석
4. 실행 계획 비교
      `,
      starterCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum as _sum, broadcast

spark = SparkSession.builder \\
    .appName("Catalyst Analysis") \\
    .config("spark.sql.autoBroadcastJoinThreshold", "10485760") \\
    .getOrCreate()

# 테스트 데이터 생성
large_df = spark.range(0, 1000000).toDF("id") \\
    .withColumn("value", col("id") * 2) \\
    .withColumn("category", (col("id") % 10).cast("string"))

small_df = spark.createDataFrame([
    ("0", "Category A"),
    ("1", "Category B"),
    ("2", "Category C"),
], ["category", "category_name"])

# Parquet로 저장 (Pushdown 테스트용)
large_df.write.mode("overwrite").parquet("/tmp/spark_test/large_data")
small_df.write.mode("overwrite").parquet("/tmp/spark_test/small_data")

# 파일에서 다시 읽기
df_large = spark.read.parquet("/tmp/spark_test/large_data")
df_small = spark.read.parquet("/tmp/spark_test/small_data")

# ====================================
# 과제 1: Predicate Pushdown 확인
# ====================================
print("=== 과제 1: Predicate Pushdown ===")

# TODO: 아래 쿼리의 실행 계획에서 PushedFilters 확인
query1 = df_large.filter(col("id") > 500000)

# 실행 계획 출력
# TODO: explain() 호출


# ====================================
# 과제 2: Column Pruning 확인
# ====================================
print("\\n=== 과제 2: Column Pruning ===")

# 모든 컬럼 사용
query2a = df_large.filter(col("id") > 500000)

# 일부 컬럼만 사용
query2b = df_large.select("id").filter(col("id") > 500000)

# TODO: 두 실행 계획 비교 (ReadSchema 확인)


# ====================================
# 과제 3: Join 전략 분석
# ====================================
print("\\n=== 과제 3: Join 전략 ===")

# 기본 Join (Sort Merge Join 예상)
query3a = df_large.join(df_small, "category")

# Broadcast Hint
query3b = df_large.join(broadcast(df_small), "category")

# TODO: 두 실행 계획 비교
# - SortMergeJoin vs BroadcastHashJoin 확인


# ====================================
# 과제 4: 집계 최적화
# ====================================
print("\\n=== 과제 4: 집계 최적화 ===")

# 카테고리별 합계
query4 = df_large.groupBy("category").agg(_sum("value").alias("total"))

# TODO: 실행 계획에서 Exchange (Shuffle) 확인
# - HashAggregate 단계 확인


# ====================================
# 과제 5: 최적화 전/후 비교
# ====================================
print("\\n=== 과제 5: 최적화 전/후 비교 ===")

# 비효율적 쿼리 (의도적)
query5a = df_large \\
    .select("*") \\
    .join(df_small, "category") \\
    .filter(col("id") > 500000) \\
    .select("id", "category_name")

# 효율적 쿼리
query5b = df_large \\
    .filter(col("id") > 500000) \\
    .select("id", "category") \\
    .join(broadcast(df_small), "category") \\
    .select("id", "category_name")

# TODO: 두 실행 계획 비교


# 정리
import shutil
shutil.rmtree("/tmp/spark_test", ignore_errors=True)
spark.stop()`,
      solutionCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum as _sum, broadcast
import shutil

spark = SparkSession.builder \\
    .appName("Catalyst Analysis") \\
    .config("spark.sql.autoBroadcastJoinThreshold", "10485760") \\
    .getOrCreate()

# 테스트 데이터 생성
large_df = spark.range(0, 1000000).toDF("id") \\
    .withColumn("value", col("id") * 2) \\
    .withColumn("category", (col("id") % 10).cast("string"))

small_df = spark.createDataFrame([
    ("0", "Category A"),
    ("1", "Category B"),
    ("2", "Category C"),
], ["category", "category_name"])

# Parquet로 저장
large_df.write.mode("overwrite").parquet("/tmp/spark_test/large_data")
small_df.write.mode("overwrite").parquet("/tmp/spark_test/small_data")

df_large = spark.read.parquet("/tmp/spark_test/large_data")
df_small = spark.read.parquet("/tmp/spark_test/small_data")

# ====================================
# 과제 1: Predicate Pushdown 확인
# ====================================
print("=== 과제 1: Predicate Pushdown ===")

query1 = df_large.filter(col("id") > 500000)
query1.explain(mode="formatted")

print("""
분석:
- PushedFilters: [IsNotNull(id), GreaterThan(id,500000)]
- 필터가 파일 스캔 시점에 적용됨
- 500,000행만 읽음 (전체 1,000,000 중)
""")

# ====================================
# 과제 2: Column Pruning 확인
# ====================================
print("\\n=== 과제 2: Column Pruning ===")

print("모든 컬럼 사용:")
query2a = df_large.filter(col("id") > 500000)
query2a.explain()

print("\\n일부 컬럼만 사용:")
query2b = df_large.select("id").filter(col("id") > 500000)
query2b.explain()

print("""
분석:
- query2a: ReadSchema: struct<id:bigint,value:bigint,category:string>
- query2b: ReadSchema: struct<id:bigint>
- 필요한 컬럼만 읽어 I/O 감소
""")

# ====================================
# 과제 3: Join 전략 분석
# ====================================
print("\\n=== 과제 3: Join 전략 ===")

print("기본 Join:")
query3a = df_large.join(df_small, "category")
query3a.explain()

print("\\nBroadcast Join:")
query3b = df_large.join(broadcast(df_small), "category")
query3b.explain()

print("""
분석:
- query3a: SortMergeJoin (양쪽 모두 Shuffle 필요)
- query3b: BroadcastHashJoin (small_df를 모든 노드에 복사)
- Broadcast가 훨씬 효율적 (Shuffle 없음)
""")

# ====================================
# 과제 4: 집계 최적화
# ====================================
print("\\n=== 과제 4: 집계 최적화 ===")

query4 = df_large.groupBy("category").agg(_sum("value").alias("total"))
query4.explain(mode="formatted")

print("""
분석:
- HashAggregate (partial): 각 파티션에서 부분 집계
- Exchange: 카테고리별로 데이터 재분배 (Shuffle)
- HashAggregate (final): 최종 집계

2단계 집계로 Shuffle 데이터량 감소:
1. 파티션별 부분 합계 계산 (10개 카테고리 x N파티션)
2. Shuffle 후 최종 합계 (10개 결과만)
""")

# ====================================
# 과제 5: 최적화 전/후 비교
# ====================================
print("\\n=== 과제 5: 최적화 전/후 비교 ===")

print("비효율적 쿼리:")
query5a = df_large \\
    .select("*") \\
    .join(df_small, "category") \\
    .filter(col("id") > 500000) \\
    .select("id", "category_name")
query5a.explain()

print("\\n효율적 쿼리:")
query5b = df_large \\
    .filter(col("id") > 500000) \\
    .select("id", "category") \\
    .join(broadcast(df_small), "category") \\
    .select("id", "category_name")
query5b.explain()

print("""
=== 최적화 요약 ===

비효율적 쿼리 문제:
1. select("*") → 모든 컬럼 로드
2. 조인 후 필터 → 불필요한 조인 수행
3. 기본 조인 → Sort Merge Join (Shuffle)

Catalyst가 자동 최적화하지만, 명시적으로 작성하면:
1. filter 먼저 → 데이터량 감소
2. 필요한 컬럼만 select → I/O 감소
3. broadcast → Shuffle 제거

최적화 효과:
- 데이터 스캔량 50% 감소
- Shuffle 데이터 50% 감소
- 실행 시간 대폭 감소
""")

# 실행 시간 비교 (선택)
from time import time

start = time()
query5a.collect()
print(f"비효율적 쿼리 실행 시간: {time() - start:.2f}초")

start = time()
query5b.collect()
print(f"효율적 쿼리 실행 시간: {time() - start:.2f}초")

# 정리
shutil.rmtree("/tmp/spark_test", ignore_errors=True)
spark.stop()`,
      hints: [
        'explain(mode="formatted")로 보기 좋은 출력',
        'PushedFilters에서 Pushdown 확인',
        'ReadSchema에서 Column Pruning 확인',
        'BroadcastHashJoin vs SortMergeJoin 구분'
      ]
    }
  },
  {
    id: 'w5d3t3',
    title: 'Spark 성능 튜닝',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `
# Spark 성능 튜닝 가이드

## 1. 파티션 최적화

### 파티션 수 결정

\`\`\`python
# 현재 파티션 수 확인
df.rdd.getNumPartitions()

# 권장: 코어 수의 2-4배
# 예: 100코어 → 200-400 파티션

# Shuffle 후 파티션 수
spark.conf.set("spark.sql.shuffle.partitions", "200")  # 기본값
\`\`\`

### 파티션 조정

| 상황 | 방법 | 비용 |
|------|------|------|
| 파티션 너무 적음 | repartition(n) | Full Shuffle |
| 파티션 너무 많음 | coalesce(n) | Shuffle 없음 |
| 특정 컬럼 기준 | repartitionByRange | Shuffle |

### Skewed Partition 해결

\`\`\`python
# 파티션 분포 확인
from pyspark.sql.functions import spark_partition_id, count

df.groupBy(spark_partition_id()).count().show()

# 해결: Salting
from pyspark.sql.functions import concat, lit, rand

# 키에 랜덤 Salt 추가
df.withColumn("salted_key", concat(col("key"), lit("_"), (rand() * 10).cast("int")))
\`\`\`

## 2. 캐싱 전략

### 캐시 레벨

| 레벨 | 메모리 | 디스크 | 직렬화 | 용도 |
|------|--------|--------|--------|------|
| MEMORY_ONLY | O | X | X | 기본, 빠름 |
| MEMORY_AND_DISK | O | O | X | 메모리 부족 시 |
| MEMORY_ONLY_SER | O | X | O | 메모리 절약 |
| DISK_ONLY | X | O | O | 대용량 |

### 캐싱 사용

\`\`\`python
# 캐싱
df.cache()  # = persist(StorageLevel.MEMORY_AND_DISK)
df.persist(StorageLevel.MEMORY_ONLY)

# 캐시 해제
df.unpersist()

# 캐시 확인
spark.catalog.isCached("table_name")
\`\`\`

### 언제 캐싱?

\`\`\`python
# 좋은 경우: 여러 번 재사용
df = spark.read.parquet("data.parquet").cache()
df.count()  # 캐시 트리거
df.groupBy("a").count()  # 캐시 사용
df.groupBy("b").count()  # 캐시 사용

# 나쁜 경우: 한 번만 사용
df = spark.read.parquet("data.parquet").cache()
df.write.parquet("output")  # 캐시 의미 없음
\`\`\`

## 3. Broadcast 최적화

### 자동 Broadcast

\`\`\`python
# 기본 임계값: 10MB
spark.conf.get("spark.sql.autoBroadcastJoinThreshold")

# 임계값 조정
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "50MB")

# Broadcast 비활성화
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "-1")
\`\`\`

### 명시적 Broadcast

\`\`\`python
from pyspark.sql.functions import broadcast

# 작은 테이블 Broadcast
result = large_df.join(broadcast(small_df), "key")
\`\`\`

## 4. Shuffle 최소화

### Shuffle 발생 연산

- groupBy, join, distinct
- repartition, sort
- window functions

### Shuffle 줄이는 방법

\`\`\`python
# 1. Broadcast Join
result = large_df.join(broadcast(small_df), "key")

# 2. Filter 먼저
df.filter(col("date") > "2024-01-01").groupBy("category").count()

# 3. 적절한 파티셔닝
df.repartition("key").groupBy("key").count()

# 4. coalesce로 파티션 감소
df.coalesce(10).write.parquet("output")
\`\`\`

## 5. 메모리 설정

\`\`\`python
# Executor 메모리
spark.conf.set("spark.executor.memory", "8g")

# Driver 메모리
spark.conf.set("spark.driver.memory", "4g")

# 메모리 비율
# Storage (캐싱): 60%
# Execution (Shuffle): 40%
spark.conf.set("spark.memory.fraction", "0.6")
\`\`\`

## 6. 데이터 포맷 최적화

### Parquet 압축

\`\`\`python
# Snappy (기본, 빠름)
df.write.option("compression", "snappy").parquet("output")

# Gzip (느림, 압축률 높음)
df.write.option("compression", "gzip").parquet("output")
\`\`\`

### 파티셔닝 저장

\`\`\`python
# 날짜로 파티셔닝
df.write.partitionBy("date").parquet("output")

# 조회 시 해당 파티션만 스캔
spark.read.parquet("output").filter(col("date") == "2024-01-01")
\`\`\`

## 7. 체크리스트

- [ ] 파티션 수가 적절한가? (코어 x 2-4)
- [ ] 재사용 데이터는 캐싱했는가?
- [ ] 작은 테이블은 Broadcast하는가?
- [ ] Filter를 최대한 먼저 적용했는가?
- [ ] 필요한 컬럼만 select했는가?
- [ ] Parquet 포맷을 사용하는가?
- [ ] 날짜로 파티셔닝했는가?
      `,
      externalLinks: [
        { title: 'Spark Tuning Guide', url: 'https://spark.apache.org/docs/latest/tuning.html' },
        { title: 'Databricks Performance Guide', url: 'https://docs.databricks.com/optimizations/index.html' }
      ]
    }
  },
  {
    id: 'w5d3t4',
    title: 'Catalyst 최적화 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Predicate Pushdown의 효과는?',
          options: [
            '쿼리 실행 순서 변경',
            '파일 스캔 시점에 필터 적용으로 I/O 감소',
            '조인 순서 최적화',
            '메모리 사용량 증가'
          ],
          answer: 1,
          explanation: 'Predicate Pushdown은 필터 조건을 데이터 소스(파일) 스캔 시점에 적용하여 불필요한 데이터 I/O를 줄입니다.'
        },
        {
          question: 'Column Pruning이란?',
          options: [
            '불필요한 행 제거',
            '필요한 컬럼만 로드',
            '컬럼 이름 변경',
            '컬럼 타입 변환'
          ],
          answer: 1,
          explanation: 'Column Pruning은 쿼리에서 실제로 사용되는 컬럼만 로드하여 I/O와 메모리를 절약합니다.'
        },
        {
          question: 'coalesce()와 repartition()의 차이는?',
          options: [
            '기능이 동일하다',
            'coalesce는 파티션 증가, repartition은 감소',
            'coalesce는 Shuffle 없음 (감소만), repartition은 Full Shuffle',
            'coalesce가 항상 더 빠르다'
          ],
          answer: 2,
          explanation: 'coalesce()는 Shuffle 없이 파티션을 줄이고, repartition()은 Full Shuffle로 파티션을 증가/감소합니다.'
        },
        {
          question: 'BroadcastHashJoin의 조건은?',
          options: [
            '양쪽 테이블이 모두 큰 경우',
            '한쪽 테이블이 임계값(기본 10MB)보다 작은 경우',
            '조인 키가 정렬된 경우',
            '파티션 수가 같은 경우'
          ],
          answer: 1,
          explanation: '한쪽 테이블이 autoBroadcastJoinThreshold(기본 10MB)보다 작으면 자동으로 BroadcastHashJoin을 선택합니다.'
        },
        {
          question: '캐싱의 기본 레벨인 MEMORY_AND_DISK의 동작은?',
          options: [
            '메모리에만 저장',
            '디스크에만 저장',
            '메모리 우선, 부족하면 디스크에 저장',
            '메모리와 디스크에 동시 저장'
          ],
          answer: 2,
          explanation: 'MEMORY_AND_DISK는 메모리에 우선 저장하고, 메모리가 부족하면 나머지를 디스크에 저장합니다.'
        }
      ]
    }
  },
  {
    id: 'w5d3t5',
    title: '도전과제: 쿼리 최적화',
    type: 'challenge',
    duration: 30,
    content: {
      instructions: `
# 도전과제: 쿼리 최적화

비효율적인 쿼리를 분석하고 최적화하세요.

## 시나리오

1억 건의 주문 데이터와 10만 건의 상품 데이터를 조인하여 분석합니다.

## 현재 쿼리 (비효율적)

\`\`\`python
result = (
    orders
    .select("*")
    .join(products, "product_id")
    .filter(col("order_date") > "2024-01-01")
    .filter(col("category") == "Electronics")
    .groupBy("product_name")
    .agg(sum("amount").alias("total"))
)
\`\`\`

## 요구사항

1. 실행 계획 분석
2. 최적화 포인트 3개 이상 식별
3. 최적화된 쿼리 작성
4. 성능 개선 효과 측정
      `,
      starterCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum as _sum, broadcast
from time import time

spark = SparkSession.builder \\
    .appName("Query Optimization") \\
    .config("spark.sql.shuffle.partitions", "8") \\
    .getOrCreate()

# 테스트 데이터 생성 (실제는 더 큼)
orders = spark.range(0, 100000).toDF("order_id") \\
    .withColumn("product_id", (col("order_id") % 100).cast("int")) \\
    .withColumn("order_date",
        concat(lit("2024-"),
               lpad(((col("order_id") % 12) + 1).cast("string"), 2, "0"),
               lit("-01"))) \\
    .withColumn("amount", (col("order_id") % 1000) + 100)

products = spark.createDataFrame([
    (i, f"Product_{i}", "Electronics" if i % 3 == 0 else "Clothing")
    for i in range(100)
], ["product_id", "product_name", "category"])

# 비효율적 쿼리
def original_query():
    result = (
        orders
        .select("*")
        .join(products, "product_id")
        .filter(col("order_date") > "2024-06-01")
        .filter(col("category") == "Electronics")
        .groupBy("product_name")
        .agg(_sum("amount").alias("total"))
    )
    return result

# TODO: 최적화된 쿼리 작성
def optimized_query():
    # 구현하세요
    pass

# 분석 및 비교
print("=== 원본 쿼리 실행 계획 ===")
original_query().explain()

print("\\n=== 최적화 쿼리 실행 계획 ===")
# optimized_query().explain()

# 성능 비교
# TODO: 실행 시간 측정 및 비교

spark.stop()`,
      requirements: [
        '원본 쿼리의 실행 계획 분석',
        '최소 3개의 최적화 포인트 식별',
        '최적화된 쿼리 작성',
        '성능 개선 측정'
      ],
      evaluationCriteria: [
        '실행 계획 분석 정확성 (25%)',
        '최적화 포인트 식별 (25%)',
        '최적화 쿼리 구현 (30%)',
        '성능 개선 효과 (20%)'
      ],
      hints: [
        'select("*") 대신 필요한 컬럼만 선택',
        'filter를 join 전에 적용',
        'products는 broadcast 가능',
        'orders에 filter 먼저 적용'
      ]
    }
  }
]
