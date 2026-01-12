// Day 2: DataFrame API
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'w5d2t1',
    title: 'DataFrame 생성과 기본 연산',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=spark-dataframe-basics',
      transcript: `
# DataFrame 생성과 기본 연산

안녕하세요! 오늘은 Spark DataFrame의 핵심 API를 배웁니다.

## 1. DataFrame 생성 방법

### 방법 1: 리스트에서 생성
\`\`\`python
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, IntegerType

spark = SparkSession.builder.appName("df-basics").getOrCreate()

# 자동 스키마 추론
data = [("Alice", 30), ("Bob", 25)]
df = spark.createDataFrame(data, ["name", "age"])

# 명시적 스키마 지정
schema = StructType([
    StructField("name", StringType(), True),
    StructField("age", IntegerType(), True)
])
df = spark.createDataFrame(data, schema)
\`\`\`

### 방법 2: 파일에서 읽기
\`\`\`python
# CSV
df = spark.read.csv("data.csv", header=True, inferSchema=True)

# JSON
df = spark.read.json("data.json")

# Parquet (권장!)
df = spark.read.parquet("data.parquet")

# 옵션 체이닝
df = spark.read \\
    .format("csv") \\
    .option("header", "true") \\
    .option("inferSchema", "true") \\
    .option("delimiter", ",") \\
    .load("data.csv")
\`\`\`

### 방법 3: 다른 소스에서 읽기
\`\`\`python
# JDBC (데이터베이스)
df = spark.read \\
    .format("jdbc") \\
    .option("url", "jdbc:postgresql://localhost/db") \\
    .option("dbtable", "users") \\
    .option("user", "user") \\
    .option("password", "pass") \\
    .load()

# Delta Lake
df = spark.read.format("delta").load("/delta/table")
\`\`\`

## 2. 기본 DataFrame 연산

### 스키마 & 데이터 확인
\`\`\`python
df.printSchema()      # 스키마 출력
df.schema             # StructType 객체
df.columns            # 컬럼 이름 리스트
df.dtypes             # (컬럼명, 타입) 리스트
df.count()            # 행 수
df.show(5)            # 상위 5행 출력
df.show(5, truncate=False)  # 잘림 없이 출력
df.head(5)            # Row 객체 리스트
df.describe().show()  # 기술 통계
\`\`\`

### 컬럼 선택
\`\`\`python
from pyspark.sql.functions import col

# 단일 컬럼
df.select("name")
df.select(col("name"))
df.select(df.name)

# 다중 컬럼
df.select("name", "age")
df.select(col("name"), col("age") + 1)

# 모든 컬럼
df.select("*")
\`\`\`

### 컬럼 추가/수정
\`\`\`python
# 새 컬럼 추가
df.withColumn("age_plus_10", col("age") + 10)

# 기존 컬럼 수정 (같은 이름 사용)
df.withColumn("age", col("age") * 2)

# 컬럼 이름 변경
df.withColumnRenamed("age", "years")

# 여러 컬럼 이름 변경
df.toDF("new_name", "new_age")
\`\`\`

### 컬럼 삭제
\`\`\`python
df.drop("age")
df.drop("col1", "col2")
\`\`\`

## 3. 필터링

\`\`\`python
from pyspark.sql.functions import col

# 기본 필터
df.filter(col("age") > 25)
df.filter("age > 25")  # SQL 표현식
df.where(col("age") > 25)  # filter와 동일

# 복합 조건
df.filter((col("age") > 25) & (col("city") == "Seoul"))
df.filter((col("age") < 20) | (col("age") > 60))
df.filter(~col("is_active"))  # NOT

# 문자열 조건
df.filter(col("name").startswith("A"))
df.filter(col("name").contains("ice"))
df.filter(col("name").like("%ice%"))
df.filter(col("email").rlike("@gmail\\.com$"))  # 정규식

# NULL 처리
df.filter(col("age").isNull())
df.filter(col("age").isNotNull())

# IN 조건
df.filter(col("city").isin(["Seoul", "Busan", "Daegu"]))
\`\`\`

## 4. 정렬

\`\`\`python
from pyspark.sql.functions import col, asc, desc

# 단일 컬럼 정렬
df.orderBy("age")
df.orderBy(col("age").desc())
df.orderBy(desc("age"))

# 다중 컬럼 정렬
df.orderBy(col("city").asc(), col("age").desc())
df.sort("city", desc("age"))  # orderBy와 동일
\`\`\`

## 5. 중복 제거

\`\`\`python
# 전체 행 기준 중복 제거
df.distinct()
df.dropDuplicates()

# 특정 컬럼 기준 중복 제거
df.dropDuplicates(["city"])
df.dropDuplicates(["city", "age"])
\`\`\`

## 6. 데이터 저장

\`\`\`python
# Parquet (권장)
df.write.parquet("output.parquet")
df.write.mode("overwrite").parquet("output.parquet")

# CSV
df.write.csv("output.csv", header=True)

# 옵션 체이닝
df.write \\
    .format("parquet") \\
    .mode("overwrite") \\
    .partitionBy("date") \\
    .save("output/")
\`\`\`

### 저장 모드

| 모드 | 설명 |
|------|------|
| error (기본) | 이미 존재하면 에러 |
| overwrite | 덮어쓰기 |
| append | 추가 |
| ignore | 이미 존재하면 무시 |

다음 시간에는 집계와 조인을 배워봅시다!
      `,
      objectives: [
        'DataFrame을 다양한 방법으로 생성할 수 있다',
        '기본 DataFrame 연산 (select, filter, orderBy)을 수행할 수 있다',
        'DataFrame을 파일로 저장할 수 있다'
      ],
      keyPoints: [
        'Parquet이 가장 권장되는 포맷',
        'col() 함수로 컬럼 참조',
        'filter와 where는 동일',
        'withColumn으로 컬럼 추가/수정'
      ]
    }
  },
  {
    id: 'w5d2t2',
    title: '집계와 그룹화',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# 집계와 그룹화 (Aggregation & GroupBy)

Spark DataFrame의 강력한 집계 기능을 학습합니다.

## 핵심 개념

1. **전체 집계**: 전체 데이터에 대한 집계
2. **그룹별 집계**: groupBy 후 집계
3. **다중 집계**: agg()로 여러 집계 동시 수행
4. **윈도우 함수**: 행별 순위, 누적 합 등

## 과제
1. 기본 집계 함수 사용
2. groupBy + agg 조합
3. 여러 집계를 동시에 수행
      `,
      starterCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, count, sum as _sum, avg, min as _min, max as _max,
    countDistinct, collect_list, collect_set,
    first, last, stddev, variance
)

spark = SparkSession.builder.appName("Aggregations").getOrCreate()

# 샘플 데이터: 판매 데이터
sales_data = [
    ("2024-01-01", "Seoul", "Electronics", 1000, 5),
    ("2024-01-01", "Seoul", "Clothing", 500, 10),
    ("2024-01-01", "Busan", "Electronics", 800, 3),
    ("2024-01-02", "Seoul", "Electronics", 1200, 7),
    ("2024-01-02", "Seoul", "Clothing", 300, 5),
    ("2024-01-02", "Busan", "Food", 200, 20),
    ("2024-01-03", "Seoul", "Electronics", 900, 4),
    ("2024-01-03", "Daegu", "Clothing", 600, 8),
    ("2024-01-03", "Busan", "Electronics", 1100, 6),
]

df = spark.createDataFrame(
    sales_data,
    ["date", "city", "category", "price", "quantity"]
)

print("=== 원본 데이터 ===")
df.show()

# ====================================
# 과제 1: 전체 집계
# ====================================
# TODO: 전체 데이터의 총 매출(price * quantity 합계)과 평균 가격 계산
# 힌트: select + _sum, avg 사용

total_stats = None  # 구현하세요


# ====================================
# 과제 2: 도시별 집계
# ====================================
# TODO: 도시별 총 매출, 주문 수, 평균 가격 계산
# 힌트: groupBy("city").agg(...)

city_stats = None  # 구현하세요


# ====================================
# 과제 3: 다중 그룹 집계
# ====================================
# TODO: 도시 + 카테고리별 집계
# - 총 매출 (price * quantity)
# - 주문 수
# - 평균 수량
# 힌트: groupBy(["city", "category"]).agg(...)

city_category_stats = None  # 구현하세요


# ====================================
# 과제 4: 고급 집계 함수
# ====================================
# TODO: 도시별로 다음 집계 수행
# - 고유 카테고리 수 (countDistinct)
# - 카테고리 목록 (collect_set)
# - 첫 번째 날짜 (first)
# - 마지막 날짜 (last)

advanced_stats = None  # 구현하세요


spark.stop()`,
      solutionCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, count, sum as _sum, avg, min as _min, max as _max,
    countDistinct, collect_list, collect_set,
    first, last, stddev, variance, round as _round
)

spark = SparkSession.builder.appName("Aggregations").getOrCreate()

# 샘플 데이터: 판매 데이터
sales_data = [
    ("2024-01-01", "Seoul", "Electronics", 1000, 5),
    ("2024-01-01", "Seoul", "Clothing", 500, 10),
    ("2024-01-01", "Busan", "Electronics", 800, 3),
    ("2024-01-02", "Seoul", "Electronics", 1200, 7),
    ("2024-01-02", "Seoul", "Clothing", 300, 5),
    ("2024-01-02", "Busan", "Food", 200, 20),
    ("2024-01-03", "Seoul", "Electronics", 900, 4),
    ("2024-01-03", "Daegu", "Clothing", 600, 8),
    ("2024-01-03", "Busan", "Electronics", 1100, 6),
]

df = spark.createDataFrame(
    sales_data,
    ["date", "city", "category", "price", "quantity"]
)

# 매출 컬럼 추가
df = df.withColumn("revenue", col("price") * col("quantity"))

print("=== 원본 데이터 (매출 추가) ===")
df.show()

# ====================================
# 과제 1: 전체 집계
# ====================================
total_stats = df.select(
    _sum("revenue").alias("total_revenue"),
    avg("price").alias("avg_price"),
    count("*").alias("order_count"),
    _sum("quantity").alias("total_quantity")
)

print("=== 과제 1: 전체 집계 ===")
total_stats.show()

# ====================================
# 과제 2: 도시별 집계
# ====================================
city_stats = (
    df.groupBy("city")
    .agg(
        _sum("revenue").alias("total_revenue"),
        count("*").alias("order_count"),
        _round(avg("price"), 2).alias("avg_price")
    )
    .orderBy(col("total_revenue").desc())
)

print("=== 과제 2: 도시별 집계 ===")
city_stats.show()

# ====================================
# 과제 3: 다중 그룹 집계
# ====================================
city_category_stats = (
    df.groupBy("city", "category")
    .agg(
        _sum("revenue").alias("total_revenue"),
        count("*").alias("order_count"),
        _round(avg("quantity"), 2).alias("avg_quantity")
    )
    .orderBy("city", col("total_revenue").desc())
)

print("=== 과제 3: 도시 + 카테고리별 집계 ===")
city_category_stats.show()

# ====================================
# 과제 4: 고급 집계 함수
# ====================================
advanced_stats = (
    df.groupBy("city")
    .agg(
        countDistinct("category").alias("unique_categories"),
        collect_set("category").alias("category_list"),
        first("date").alias("first_date"),
        last("date").alias("last_date"),
        stddev("price").alias("price_stddev")
    )
    .orderBy("city")
)

print("=== 과제 4: 고급 집계 함수 ===")
advanced_stats.show(truncate=False)

# ====================================
# 보너스: pivot (피벗)
# ====================================
pivot_df = (
    df.groupBy("city")
    .pivot("category")
    .agg(_sum("revenue"))
)

print("=== 보너스: 피벗 테이블 ===")
pivot_df.show()

# ====================================
# 집계 함수 정리
# ====================================
print("""
=== Spark 집계 함수 정리 ===

기본 집계:
- count("*"), count("col")
- sum(), avg(), mean()
- min(), max()
- stddev(), variance()

고급 집계:
- countDistinct() - 고유 값 개수
- collect_list() - 리스트로 수집 (중복 포함)
- collect_set() - 집합으로 수집 (중복 제거)
- first(), last() - 첫 번째/마지막 값
- approx_count_distinct() - 근사 고유 값 개수 (대용량용)

피벗:
- groupBy().pivot().agg()
- 행을 열로 변환
""")

spark.stop()`,
      hints: [
        '_sum, avg 등 집계 함수는 import 필요',
        'agg() 안에서 alias()로 컬럼명 지정',
        'collect_set은 중복 제거, collect_list는 중복 포함'
      ]
    }
  },
  {
    id: 'w5d2t3',
    title: 'Join 연산',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# Join 연산

여러 DataFrame을 조인하는 방법을 학습합니다.

## Join 유형

| 유형 | 설명 |
|------|------|
| inner | 양쪽 모두 있는 행만 |
| left | 왼쪽 기준 + 오른쪽 매칭 |
| right | 오른쪽 기준 + 왼쪽 매칭 |
| outer/full | 양쪽 모두 포함 |
| left_semi | 왼쪽 중 오른쪽에 있는 것만 |
| left_anti | 왼쪽 중 오른쪽에 없는 것만 |
| cross | 카테시안 곱 |

## 과제
1. 다양한 Join 유형 실습
2. 복합 키 Join
3. Broadcast Join
      `,
      starterCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, broadcast

spark = SparkSession.builder.appName("Joins").getOrCreate()

# 사용자 데이터
users = spark.createDataFrame([
    (1, "Alice", "Seoul"),
    (2, "Bob", "Busan"),
    (3, "Charlie", "Seoul"),
    (4, "Diana", "Daegu"),
    (5, "Eve", "Incheon"),
], ["user_id", "name", "city"])

# 주문 데이터
orders = spark.createDataFrame([
    (101, 1, "2024-01-01", 100),
    (102, 1, "2024-01-02", 200),
    (103, 2, "2024-01-01", 150),
    (104, 3, "2024-01-03", 300),
    (105, 6, "2024-01-04", 250),  # user_id 6은 users에 없음
], ["order_id", "user_id", "date", "amount"])

# 도시 정보
cities = spark.createDataFrame([
    ("Seoul", "수도권", 10000000),
    ("Busan", "영남", 3500000),
    ("Daegu", "영남", 2500000),
], ["city", "region", "population"])

print("=== Users ===")
users.show()
print("=== Orders ===")
orders.show()
print("=== Cities ===")
cities.show()

# ====================================
# 과제 1: Inner Join
# ====================================
# TODO: users와 orders를 user_id로 inner join
# 결과: 양쪽 모두에 있는 사용자의 주문만

inner_joined = None  # 구현하세요


# ====================================
# 과제 2: Left Join
# ====================================
# TODO: users 기준으로 orders를 left join
# 결과: 모든 사용자 + 주문 정보 (없으면 null)

left_joined = None  # 구현하세요


# ====================================
# 과제 3: Left Anti Join
# ====================================
# TODO: 주문이 없는 사용자 찾기
# 힌트: left_anti join 사용

users_without_orders = None  # 구현하세요


# ====================================
# 과제 4: 복합 조인 (3개 테이블)
# ====================================
# TODO: users + orders + cities 조인
# 결과: 사용자명, 주문금액, 도시, 지역, 인구

full_joined = None  # 구현하세요


# ====================================
# 과제 5: Broadcast Join
# ====================================
# TODO: cities를 broadcast하여 users와 조인
# 힌트: broadcast() 함수 사용

broadcast_joined = None  # 구현하세요


spark.stop()`,
      solutionCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, broadcast

spark = SparkSession.builder.appName("Joins").getOrCreate()

# 사용자 데이터
users = spark.createDataFrame([
    (1, "Alice", "Seoul"),
    (2, "Bob", "Busan"),
    (3, "Charlie", "Seoul"),
    (4, "Diana", "Daegu"),
    (5, "Eve", "Incheon"),
], ["user_id", "name", "city"])

# 주문 데이터
orders = spark.createDataFrame([
    (101, 1, "2024-01-01", 100),
    (102, 1, "2024-01-02", 200),
    (103, 2, "2024-01-01", 150),
    (104, 3, "2024-01-03", 300),
    (105, 6, "2024-01-04", 250),  # user_id 6은 users에 없음
], ["order_id", "user_id", "date", "amount"])

# 도시 정보
cities = spark.createDataFrame([
    ("Seoul", "수도권", 10000000),
    ("Busan", "영남", 3500000),
    ("Daegu", "영남", 2500000),
], ["city", "region", "population"])

print("=== Users ===")
users.show()
print("=== Orders ===")
orders.show()
print("=== Cities ===")
cities.show()

# ====================================
# 과제 1: Inner Join
# ====================================
inner_joined = users.join(orders, "user_id", "inner")
# 또는: users.join(orders, users.user_id == orders.user_id, "inner")

print("=== 과제 1: Inner Join ===")
inner_joined.show()
# user_id 4, 5는 주문이 없어서 제외
# order_id 105는 user_id 6이 없어서 제외

# ====================================
# 과제 2: Left Join
# ====================================
left_joined = users.join(orders, "user_id", "left")

print("=== 과제 2: Left Join ===")
left_joined.show()
# 모든 사용자 포함, Diana와 Eve는 주문 정보가 null

# ====================================
# 과제 3: Left Anti Join
# ====================================
users_without_orders = users.join(orders, "user_id", "left_anti")

print("=== 과제 3: Left Anti (주문 없는 사용자) ===")
users_without_orders.show()
# Diana와 Eve만 출력

# ====================================
# 과제 4: 복합 조인 (3개 테이블)
# ====================================
full_joined = (
    users
    .join(orders, "user_id", "left")
    .join(cities, "city", "left")
    .select(
        "user_id",
        "name",
        "order_id",
        "amount",
        "city",
        "region",
        "population"
    )
)

print("=== 과제 4: 복합 조인 (3개 테이블) ===")
full_joined.show()
# Eve는 Incheon이 cities에 없어서 region, population이 null

# ====================================
# 과제 5: Broadcast Join
# ====================================
# 작은 테이블을 broadcast하면 Shuffle 없이 조인 가능
broadcast_joined = users.join(broadcast(cities), "city", "left")

print("=== 과제 5: Broadcast Join ===")
broadcast_joined.explain()  # BroadcastHashJoin 확인
broadcast_joined.show()

# ====================================
# Join 유형 비교
# ====================================
print("""
=== Join 유형 정리 ===

inner: 양쪽 모두 있는 것만
 - users(1,2,3,4,5) ∩ orders(1,1,2,3,6) = (1,2,3)

left: 왼쪽 전체 + 오른쪽 매칭
 - users 전체 + orders 매칭 (없으면 null)

right: 오른쪽 전체 + 왼쪽 매칭
 - orders 전체 + users 매칭 (없으면 null)

outer/full: 양쪽 전체
 - users ∪ orders (없는 쪽은 null)

left_semi: 왼쪽 중 오른쪽에 있는 것만 (왼쪽 컬럼만)
 - users 중 orders에 있는 user_id만

left_anti: 왼쪽 중 오른쪽에 없는 것만
 - users 중 orders에 없는 user_id만

cross: 카테시안 곱
 - 모든 조합 (n * m 행)

=== Broadcast Join ===

- 작은 테이블을 모든 Executor에 복사
- Shuffle 없이 조인 가능
- 기본: 10MB 이하 자동 broadcast
- 설정: spark.sql.autoBroadcastJoinThreshold
""")

spark.stop()`,
      hints: [
        'join(df, "key", "type") 형태로 사용',
        'left_anti는 NOT IN과 유사',
        'broadcast()로 작은 테이블 최적화'
      ]
    }
  },
  {
    id: 'w5d2t4',
    title: '윈도우 함수',
    type: 'code',
    duration: 25,
    content: {
      instructions: `
# 윈도우 함수 (Window Functions)

SQL 윈도우 함수를 Spark에서 사용하는 방법을 학습합니다.

## 윈도우 함수 유형

1. **순위 함수**: row_number, rank, dense_rank
2. **분석 함수**: lead, lag, first, last
3. **집계 함수**: sum, avg, count (누적)

## 과제
1. 순위 함수 사용
2. 누적 합계 계산
3. 이전/다음 값 참조
      `,
      starterCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, row_number, rank, dense_rank,
    lead, lag, first, last,
    sum as _sum, avg, count
)
from pyspark.sql.window import Window

spark = SparkSession.builder.appName("WindowFunctions").getOrCreate()

# 판매 데이터
sales = spark.createDataFrame([
    ("Seoul", "2024-01-01", 100),
    ("Seoul", "2024-01-02", 150),
    ("Seoul", "2024-01-03", 120),
    ("Seoul", "2024-01-04", 200),
    ("Busan", "2024-01-01", 80),
    ("Busan", "2024-01-02", 90),
    ("Busan", "2024-01-03", 85),
    ("Busan", "2024-01-04", 95),
], ["city", "date", "sales"])

print("=== 원본 데이터 ===")
sales.show()

# ====================================
# 과제 1: 도시별 매출 순위
# ====================================
# TODO: 도시별로 매출 높은 순으로 순위 부여
# 힌트: Window.partitionBy("city").orderBy(desc("sales"))
# row_number, rank, dense_rank 비교

window_rank = Window.partitionBy("city").orderBy(col("sales").desc())

ranked = None  # 구현하세요


# ====================================
# 과제 2: 누적 매출 계산
# ====================================
# TODO: 도시별 날짜순 누적 매출 계산
# 힌트: Window.partitionBy("city").orderBy("date").rowsBetween(...)

window_cumsum = Window.partitionBy("city").orderBy("date") \\
    .rowsBetween(Window.unboundedPreceding, Window.currentRow)

cumulative = None  # 구현하세요


# ====================================
# 과제 3: 이전/다음 날 매출 비교
# ====================================
# TODO: 이전 날 매출(prev_sales), 다음 날 매출(next_sales) 추가
# TODO: 전일 대비 증감(diff) 계산
# 힌트: lag, lead 함수 사용

window_seq = Window.partitionBy("city").orderBy("date")

with_prev_next = None  # 구현하세요


# ====================================
# 과제 4: 이동 평균
# ====================================
# TODO: 도시별 3일 이동 평균 계산
# 힌트: rowsBetween(-2, 0) = 현재 포함 이전 3일

window_ma = Window.partitionBy("city").orderBy("date") \\
    .rowsBetween(-2, 0)

moving_avg = None  # 구현하세요


spark.stop()`,
      solutionCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, row_number, rank, dense_rank,
    lead, lag, first, last,
    sum as _sum, avg, count, round as _round
)
from pyspark.sql.window import Window

spark = SparkSession.builder.appName("WindowFunctions").getOrCreate()

# 판매 데이터
sales = spark.createDataFrame([
    ("Seoul", "2024-01-01", 100),
    ("Seoul", "2024-01-02", 150),
    ("Seoul", "2024-01-03", 120),
    ("Seoul", "2024-01-04", 200),
    ("Busan", "2024-01-01", 80),
    ("Busan", "2024-01-02", 90),
    ("Busan", "2024-01-03", 85),
    ("Busan", "2024-01-04", 95),
], ["city", "date", "sales"])

print("=== 원본 데이터 ===")
sales.show()

# ====================================
# 과제 1: 도시별 매출 순위
# ====================================
window_rank = Window.partitionBy("city").orderBy(col("sales").desc())

ranked = sales.withColumn("row_num", row_number().over(window_rank)) \\
    .withColumn("rank", rank().over(window_rank)) \\
    .withColumn("dense_rank", dense_rank().over(window_rank))

print("=== 과제 1: 도시별 매출 순위 ===")
ranked.orderBy("city", "row_num").show()
# row_number: 항상 유일 (1,2,3,4)
# rank: 동점 시 같은 순위, 다음은 건너뜀 (1,2,2,4)
# dense_rank: 동점 시 같은 순위, 다음은 연속 (1,2,2,3)

# ====================================
# 과제 2: 누적 매출 계산
# ====================================
window_cumsum = Window.partitionBy("city").orderBy("date") \\
    .rowsBetween(Window.unboundedPreceding, Window.currentRow)

cumulative = sales.withColumn(
    "cumulative_sales",
    _sum("sales").over(window_cumsum)
)

print("=== 과제 2: 누적 매출 ===")
cumulative.orderBy("city", "date").show()

# ====================================
# 과제 3: 이전/다음 날 매출 비교
# ====================================
window_seq = Window.partitionBy("city").orderBy("date")

with_prev_next = (
    sales
    .withColumn("prev_sales", lag("sales", 1).over(window_seq))
    .withColumn("next_sales", lead("sales", 1).over(window_seq))
    .withColumn("diff", col("sales") - col("prev_sales"))
    .withColumn(
        "growth_rate",
        _round((col("sales") - col("prev_sales")) / col("prev_sales") * 100, 2)
    )
)

print("=== 과제 3: 이전/다음 날 매출 비교 ===")
with_prev_next.orderBy("city", "date").show()

# ====================================
# 과제 4: 이동 평균
# ====================================
window_ma = Window.partitionBy("city").orderBy("date") \\
    .rowsBetween(-2, 0)  # 현재 포함 이전 3개

moving_avg = sales.withColumn(
    "ma_3day",
    _round(avg("sales").over(window_ma), 2)
)

print("=== 과제 4: 3일 이동 평균 ===")
moving_avg.orderBy("city", "date").show()

# ====================================
# 윈도우 함수 정리
# ====================================
print("""
=== Window 함수 정리 ===

1. Window 정의:
   Window.partitionBy("col").orderBy("col")
   - partitionBy: 그룹 기준 (SQL의 PARTITION BY)
   - orderBy: 정렬 기준 (SQL의 ORDER BY)

2. 순위 함수:
   - row_number(): 항상 유일 (1,2,3,4)
   - rank(): 동점 시 같은 순위 (1,2,2,4)
   - dense_rank(): 연속 순위 (1,2,2,3)
   - percent_rank(): 백분위 순위
   - ntile(n): n개 그룹으로 분할

3. 분석 함수:
   - lag(col, n): n행 이전 값
   - lead(col, n): n행 이후 값
   - first(): 첫 번째 값
   - last(): 마지막 값

4. Frame 지정:
   - rowsBetween(start, end)
   - Window.unboundedPreceding: 처음부터
   - Window.unboundedFollowing: 끝까지
   - Window.currentRow: 현재 행
   - 숫자: 상대적 위치 (-1, 0, 1 등)

5. 집계 함수 + Window:
   - sum().over(window): 누적 합
   - avg().over(window): 이동 평균
   - count().over(window): 누적 개수
""")

spark.stop()`,
      hints: [
        'Window.partitionBy().orderBy()로 윈도우 정의',
        'lag(n): n행 이전, lead(n): n행 이후',
        'rowsBetween으로 범위 지정'
      ]
    }
  },
  {
    id: 'w5d2t5',
    title: 'DataFrame API 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Spark에서 가장 권장되는 파일 포맷은?',
          options: [
            'CSV',
            'JSON',
            'Parquet',
            'XML'
          ],
          answer: 2,
          explanation: 'Parquet은 컬럼 기반 포맷으로 압축률이 높고, 필요한 컬럼만 읽을 수 있어 Spark에서 가장 권장됩니다.'
        },
        {
          question: 'filter()와 where()의 차이점은?',
          options: [
            'filter가 더 빠르다',
            'where가 더 빠르다',
            '기능적으로 동일하다',
            'filter는 행, where는 열을 필터링한다'
          ],
          answer: 2,
          explanation: 'filter()와 where()는 완전히 동일한 기능입니다. SQL에 익숙하면 where, Python에 익숙하면 filter를 사용하면 됩니다.'
        },
        {
          question: 'left_anti join의 결과는?',
          options: [
            '양쪽 모두에 있는 행',
            '왼쪽 테이블에만 있고 오른쪽에 없는 행',
            '오른쪽 테이블에만 있는 행',
            '카테시안 곱'
          ],
          answer: 1,
          explanation: 'left_anti join은 왼쪽 테이블에서 오른쪽 테이블에 매칭되지 않는 행만 반환합니다. SQL의 NOT IN과 유사합니다.'
        },
        {
          question: 'broadcast join을 사용해야 하는 상황은?',
          options: [
            '양쪽 테이블이 모두 큰 경우',
            '한쪽 테이블이 작은 경우',
            '조인 키가 없는 경우',
            'cross join이 필요한 경우'
          ],
          answer: 1,
          explanation: '한쪽 테이블이 충분히 작으면 broadcast join으로 Shuffle을 피할 수 있습니다. 기본 임계값은 10MB입니다.'
        },
        {
          question: 'rank()와 row_number()의 차이는?',
          options: [
            '차이 없음',
            'rank는 동점 시 같은 순위, row_number는 항상 유일',
            'row_number는 동점 시 같은 순위',
            'rank는 정렬 불필요'
          ],
          answer: 1,
          explanation: 'rank()는 동점인 경우 같은 순위를 부여하고 다음 순위를 건너뜁니다. row_number()는 항상 유일한 순번을 부여합니다.'
        }
      ]
    }
  },
  {
    id: 'w5d2t6',
    title: '도전과제: 판매 데이터 종합 분석',
    type: 'challenge',
    duration: 35,
    content: {
      instructions: `
# 도전과제: 판매 데이터 종합 분석

실제 분석 시나리오를 구현하세요.

## 데이터셋

- 주문 데이터 (orders)
- 상품 데이터 (products)
- 카테고리 데이터 (categories)

## 요구사항

1. **기본 분석**:
   - 카테고리별 총 매출
   - 일별 주문 수 추이

2. **고급 분석**:
   - 카테고리별 매출 순위 (윈도우 함수)
   - 7일 이동 평균 매출
   - 전일 대비 매출 증감률

3. **피벗 분석**:
   - 월별 x 카테고리별 매출 피벗 테이블
      `,
      starterCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.window import Window

spark = SparkSession.builder.appName("SalesAnalysis").getOrCreate()

# 샘플 데이터 생성
orders = spark.createDataFrame([
    (1, "P001", "2024-01-01", 2, 100),
    (2, "P002", "2024-01-01", 1, 200),
    (3, "P001", "2024-01-02", 3, 100),
    (4, "P003", "2024-01-02", 1, 300),
    (5, "P002", "2024-01-03", 2, 200),
    (6, "P001", "2024-01-03", 1, 100),
    (7, "P003", "2024-01-04", 2, 300),
    (8, "P004", "2024-01-04", 1, 150),
    (9, "P001", "2024-01-05", 4, 100),
    (10, "P002", "2024-01-05", 2, 200),
], ["order_id", "product_id", "date", "quantity", "unit_price"])

products = spark.createDataFrame([
    ("P001", "노트북", "C001"),
    ("P002", "스마트폰", "C001"),
    ("P003", "셔츠", "C002"),
    ("P004", "운동화", "C003"),
], ["product_id", "product_name", "category_id"])

categories = spark.createDataFrame([
    ("C001", "전자제품"),
    ("C002", "의류"),
    ("C003", "신발"),
], ["category_id", "category_name"])

# TODO: 데이터에 매출 컬럼 추가
# TODO: 3개 테이블 조인
# TODO: 요구사항 분석 수행

spark.stop()`,
      requirements: [
        '3개 테이블이 올바르게 조인됨',
        '카테고리별 총 매출이 계산됨',
        '윈도우 함수로 매출 순위가 부여됨',
        '이동 평균이 계산됨',
        '피벗 테이블이 생성됨'
      ],
      evaluationCriteria: [
        '데이터 조인 정확성 (20%)',
        '기본 집계 정확성 (20%)',
        '윈도우 함수 활용 (25%)',
        '이동 평균 계산 (20%)',
        '피벗 테이블 생성 (15%)'
      ],
      hints: [
        '매출 = quantity * unit_price',
        '조인 순서: orders → products → categories',
        'pivot()으로 피벗 테이블 생성',
        'rowsBetween(-6, 0)으로 7일 윈도우'
      ]
    }
  }
]
