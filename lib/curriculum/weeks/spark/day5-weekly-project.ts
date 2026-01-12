// Day 5: Weekly Project - 대용량 로그 분석
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'w5d5t1',
    title: '프로젝트 개요: 대용량 로그 분석',
    type: 'video',
    duration: 15,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=spark-log-analysis',
      transcript: `
# 대용량 로그 분석 프로젝트

이번 주 마무리 프로젝트입니다.
Spark를 사용하여 웹 서버 로그를 분석합니다.

## 프로젝트 목표

1. **대용량 로그 처리**: 수백만 건의 로그 효율적 처리
2. **시간대별 분석**: 트래픽 패턴 파악
3. **에러 분석**: 에러 유형별 집계
4. **사용자 분석**: 방문자 행동 분석
5. **성능 최적화**: Catalyst 활용, 캐싱

## 로그 형식 (Apache Access Log)

\`\`\`
192.168.1.1 - - [01/Jan/2024:10:15:32 +0900] "GET /api/users HTTP/1.1" 200 1234 "https://example.com" "Mozilla/5.0"
\`\`\`

| 필드 | 설명 |
|------|------|
| IP | 클라이언트 IP |
| Timestamp | 요청 시간 |
| Method | HTTP 메서드 |
| Path | 요청 경로 |
| Status | HTTP 상태 코드 |
| Size | 응답 크기 |
| Referer | 참조 URL |
| User-Agent | 브라우저 정보 |

## 분석 요구사항

### 1. 기본 통계
- 총 요청 수
- 고유 IP 수
- 평균 응답 크기

### 2. 시간대별 분석
- 시간별 요청 수
- 피크 시간대 식별
- 5분 단위 트래픽 추이

### 3. 에러 분석
- 상태 코드별 분포 (2xx, 3xx, 4xx, 5xx)
- 에러율 추이
- 에러 발생 경로 Top 10

### 4. 경로 분석
- 인기 경로 Top 10
- API vs 정적 파일 비율
- 느린 요청 경로

### 5. 사용자 분석
- IP별 요청 수
- User-Agent 분포
- 봇 vs 실제 사용자

## 기술 요구사항

- **Spark DataFrame API** 사용
- **Catalyst 최적화** 확인 (explain)
- **캐싱** 적절히 사용
- **윈도우 함수**로 시계열 분석

## 환경

- Databricks Community Edition (권장)
- 또는 로컬 PySpark

프로젝트를 시작합시다!
      `,
      objectives: [
        '대용량 로그 분석 파이프라인을 구축할 수 있다',
        '시간대별, 에러별 분석을 수행할 수 있다',
        'Spark 성능 최적화를 적용할 수 있다'
      ],
      keyPoints: [
        '로그 파싱 → 정제 → 분석 → 시각화 파이프라인',
        '캐싱으로 반복 연산 최적화',
        '윈도우 함수로 시계열 분석',
        'explain()으로 최적화 확인'
      ]
    }
  },
  {
    id: 'w5d5t2',
    title: '로그 데이터 생성 및 파싱',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# 로그 데이터 생성 및 파싱

실습용 로그 데이터를 생성하고 파싱합니다.

## 과제
1. 샘플 로그 데이터 생성
2. 정규표현식으로 로그 파싱
3. 구조화된 DataFrame 생성
      `,
      starterCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, regexp_extract, to_timestamp, hour, dayofweek,
    when, count, sum as _sum, avg, lit, rand, floor, concat
)
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, TimestampType
import random

spark = SparkSession.builder \\
    .appName("Log Analysis") \\
    .config("spark.sql.shuffle.partitions", "8") \\
    .getOrCreate()

# ====================================
# Part 1: 샘플 로그 데이터 생성
# ====================================
# 실제 프로젝트에서는 실제 로그 파일 사용

def generate_log_data(num_records=100000):
    """샘플 Apache Access Log 생성"""

    ips = [f"192.168.1.{i}" for i in range(1, 51)]
    paths = [
        "/api/users", "/api/products", "/api/orders",
        "/static/css/main.css", "/static/js/app.js",
        "/index.html", "/about", "/contact",
        "/api/auth/login", "/api/auth/logout"
    ]
    methods = ["GET"] * 8 + ["POST"] * 2
    statuses = [200] * 70 + [201] * 5 + [301] * 5 + [404] * 10 + [500] * 5 + [503] * 5
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
        "Mozilla/5.0 (iPhone; CPU iPhone OS)",
        "Googlebot/2.1",
        "Bingbot/2.0"
    ]

    logs = []
    for i in range(num_records):
        ip = random.choice(ips)
        timestamp = f"0{random.randint(1,9)}/Jan/2024:{random.randint(0,23):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d} +0900"
        method = random.choice(methods)
        path = random.choice(paths)
        status = random.choice(statuses)
        size = random.randint(100, 50000)
        user_agent = random.choice(user_agents)

        log_line = f'{ip} - - [{timestamp}] "{method} {path} HTTP/1.1" {status} {size} "-" "{user_agent}"'
        logs.append((log_line,))

    return spark.createDataFrame(logs, ["raw_log"])

# 로그 생성
raw_logs = generate_log_data(100000)
print(f"생성된 로그 수: {raw_logs.count():,}")
raw_logs.show(5, truncate=False)


# ====================================
# Part 2: 로그 파싱
# ====================================
# Apache Access Log 정규표현식 패턴
LOG_PATTERN = r'^(\\S+) - - \\[(.+?)\\] "(\\S+) (\\S+) \\S+" (\\d+) (\\d+) "[^"]*" "([^"]*)"'

# TODO: regexp_extract로 각 필드 추출
# 힌트: regexp_extract(col, pattern, group_num)

parsed_logs = raw_logs.select(
    # IP 주소 (그룹 1)
    regexp_extract("raw_log", LOG_PATTERN, 1).alias("ip"),

    # TODO: 타임스탬프 (그룹 2)

    # TODO: HTTP 메서드 (그룹 3)

    # TODO: 경로 (그룹 4)

    # TODO: 상태 코드 (그룹 5) - IntegerType으로 캐스팅

    # TODO: 응답 크기 (그룹 6) - IntegerType으로 캐스팅

    # TODO: User-Agent (그룹 7)
)


# ====================================
# Part 3: 데이터 정제
# ====================================
# TODO: 타임스탬프를 TimestampType으로 변환
# 형식: "01/Jan/2024:10:15:32 +0900"
# 힌트: to_timestamp(col, "dd/MMM/yyyy:HH:mm:ss Z")


# TODO: 추가 컬럼 생성
# - hour: 시간 (0-23)
# - day_of_week: 요일 (1-7)
# - is_error: 상태코드 >= 400
# - is_bot: User-Agent에 'bot' 포함


# 결과 확인
# parsed_logs.show(10)
# parsed_logs.printSchema()


spark.stop()`,
      solutionCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, regexp_extract, to_timestamp, hour, dayofweek, date_format,
    when, count, sum as _sum, avg, lit, rand, floor, concat, lower
)
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, TimestampType
import random

spark = SparkSession.builder \\
    .appName("Log Analysis") \\
    .config("spark.sql.shuffle.partitions", "8") \\
    .getOrCreate()

# ====================================
# Part 1: 샘플 로그 데이터 생성
# ====================================
def generate_log_data(num_records=100000):
    ips = [f"192.168.1.{i}" for i in range(1, 51)]
    paths = [
        "/api/users", "/api/products", "/api/orders",
        "/static/css/main.css", "/static/js/app.js",
        "/index.html", "/about", "/contact",
        "/api/auth/login", "/api/auth/logout"
    ]
    methods = ["GET"] * 8 + ["POST"] * 2
    statuses = [200] * 70 + [201] * 5 + [301] * 5 + [404] * 10 + [500] * 5 + [503] * 5
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
        "Mozilla/5.0 (iPhone; CPU iPhone OS)",
        "Googlebot/2.1",
        "Bingbot/2.0"
    ]

    logs = []
    for i in range(num_records):
        ip = random.choice(ips)
        timestamp = f"0{random.randint(1,9)}/Jan/2024:{random.randint(0,23):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d} +0900"
        method = random.choice(methods)
        path = random.choice(paths)
        status = random.choice(statuses)
        size = random.randint(100, 50000)
        user_agent = random.choice(user_agents)

        log_line = f'{ip} - - [{timestamp}] "{method} {path} HTTP/1.1" {status} {size} "-" "{user_agent}"'
        logs.append((log_line,))

    return spark.createDataFrame(logs, ["raw_log"])

raw_logs = generate_log_data(100000)
print(f"생성된 로그 수: {raw_logs.count():,}")
raw_logs.show(3, truncate=False)

# ====================================
# Part 2: 로그 파싱
# ====================================
LOG_PATTERN = r'^(\\S+) - - \\[(.+?)\\] "(\\S+) (\\S+) \\S+" (\\d+) (\\d+) "[^"]*" "([^"]*)"'

parsed_logs = raw_logs.select(
    regexp_extract("raw_log", LOG_PATTERN, 1).alias("ip"),
    regexp_extract("raw_log", LOG_PATTERN, 2).alias("timestamp_str"),
    regexp_extract("raw_log", LOG_PATTERN, 3).alias("method"),
    regexp_extract("raw_log", LOG_PATTERN, 4).alias("path"),
    regexp_extract("raw_log", LOG_PATTERN, 5).cast(IntegerType()).alias("status"),
    regexp_extract("raw_log", LOG_PATTERN, 6).cast(IntegerType()).alias("size"),
    regexp_extract("raw_log", LOG_PATTERN, 7).alias("user_agent")
)

print("\\n=== 파싱된 로그 ===")
parsed_logs.show(5)

# ====================================
# Part 3: 데이터 정제
# ====================================
cleaned_logs = parsed_logs \\
    .withColumn(
        "timestamp",
        to_timestamp(col("timestamp_str"), "dd/MMM/yyyy:HH:mm:ss Z")
    ) \\
    .withColumn("hour", hour("timestamp")) \\
    .withColumn("day_of_week", dayofweek("timestamp")) \\
    .withColumn("date", date_format("timestamp", "yyyy-MM-dd")) \\
    .withColumn(
        "is_error",
        when(col("status") >= 400, True).otherwise(False)
    ) \\
    .withColumn(
        "is_bot",
        lower(col("user_agent")).contains("bot")
    ) \\
    .withColumn(
        "status_category",
        when(col("status") < 200, "1xx")
        .when(col("status") < 300, "2xx")
        .when(col("status") < 400, "3xx")
        .when(col("status") < 500, "4xx")
        .otherwise("5xx")
    ) \\
    .withColumn(
        "path_type",
        when(col("path").startswith("/api"), "API")
        .when(col("path").startswith("/static"), "Static")
        .otherwise("Page")
    ) \\
    .drop("timestamp_str")

print("\\n=== 정제된 로그 ===")
cleaned_logs.show(10)
cleaned_logs.printSchema()

# 캐싱 (여러 분석에 재사용)
cleaned_logs.cache()
print(f"\\n총 로그 수: {cleaned_logs.count():,}")

# 파싱 품질 확인
print("\\n=== 파싱 품질 확인 ===")
print(f"NULL IP 수: {cleaned_logs.filter(col('ip').isNull()).count()}")
print(f"NULL Timestamp 수: {cleaned_logs.filter(col('timestamp').isNull()).count()}")

spark.stop()`,
      hints: [
        'regexp_extract(col, pattern, group_number)',
        'to_timestamp(col, format)으로 문자열→타임스탬프',
        'when().otherwise()로 조건부 컬럼 생성',
        '.cache()로 반복 사용 DataFrame 캐싱'
      ]
    }
  },
  {
    id: 'w5d5t3',
    title: '로그 분석 수행',
    type: 'code',
    duration: 40,
    content: {
      instructions: `
# 로그 분석 수행

정제된 로그 데이터로 다양한 분석을 수행합니다.

## 과제
1. 기본 통계
2. 시간대별 분석
3. 에러 분석
4. 경로 분석
5. 사용자 분석
      `,
      starterCode: `# 이전 단계에서 cleaned_logs가 준비되었다고 가정
# 실제로는 이전 코드 실행 필요

from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.window import Window

spark = SparkSession.builder.appName("Log Analysis").getOrCreate()

# (실제로는 이전 단계의 cleaned_logs 사용)
# 여기서는 간단한 샘플 데이터로 대체

# ====================================
# 분석 1: 기본 통계
# ====================================
# TODO: 다음 통계 계산
# - 총 요청 수
# - 고유 IP 수
# - 평균 응답 크기
# - 에러율 (%)

basic_stats = None  # 구현하세요


# ====================================
# 분석 2: 시간대별 분석
# ====================================
# TODO: 시간별 요청 수 및 에러율

hourly_stats = None  # 구현하세요


# TODO: 5분 단위 트래픽 추이 (윈도우 함수 사용)
# 힌트: 이전 5분 대비 증감율

traffic_trend = None  # 구현하세요


# ====================================
# 분석 3: 에러 분석
# ====================================
# TODO: 상태 코드 분포

status_dist = None  # 구현하세요


# TODO: 에러 발생 경로 Top 10

error_paths = None  # 구현하세요


# ====================================
# 분석 4: 경로 분석
# ====================================
# TODO: 인기 경로 Top 10

popular_paths = None  # 구현하세요


# TODO: 경로 유형별 통계 (API, Static, Page)

path_type_stats = None  # 구현하세요


# ====================================
# 분석 5: 사용자 분석
# ====================================
# TODO: IP별 요청 수 (상위 10)

top_ips = None  # 구현하세요


# TODO: 봇 vs 실제 사용자 비율

bot_ratio = None  # 구현하세요


# TODO: User-Agent 분포

ua_dist = None  # 구현하세요


spark.stop()`,
      solutionCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.window import Window
import random

spark = SparkSession.builder \\
    .appName("Log Analysis") \\
    .config("spark.sql.shuffle.partitions", "8") \\
    .getOrCreate()

# 샘플 데이터 생성 (이전 단계와 동일)
def generate_log_data(num_records=100000):
    ips = [f"192.168.1.{i}" for i in range(1, 51)]
    paths = ["/api/users", "/api/products", "/api/orders",
             "/static/css/main.css", "/static/js/app.js",
             "/index.html", "/about", "/contact"]
    statuses = [200]*70 + [201]*5 + [301]*5 + [404]*10 + [500]*5 + [503]*5
    user_agents = ["Mozilla/5.0 (Windows)", "Mozilla/5.0 (Mac)",
                   "Mozilla/5.0 (iPhone)", "Googlebot/2.1", "Bingbot/2.0"]

    logs = []
    for i in range(num_records):
        ip = random.choice(ips)
        ts = f"0{random.randint(1,9)}/Jan/2024:{random.randint(0,23):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d} +0900"
        method = random.choice(["GET"]*8 + ["POST"]*2)
        path = random.choice(paths)
        status = random.choice(statuses)
        size = random.randint(100, 50000)
        ua = random.choice(user_agents)
        log = f'{ip} - - [{ts}] "{method} {path} HTTP/1.1" {status} {size} "-" "{ua}"'
        logs.append((log,))

    return spark.createDataFrame(logs, ["raw_log"])

# 로그 파싱 및 정제
LOG_PATTERN = r'^(\\S+) - - \\[(.+?)\\] "(\\S+) (\\S+) \\S+" (\\d+) (\\d+) "[^"]*" "([^"]*)"'

raw_logs = generate_log_data(100000)
cleaned_logs = raw_logs.select(
    regexp_extract("raw_log", LOG_PATTERN, 1).alias("ip"),
    regexp_extract("raw_log", LOG_PATTERN, 2).alias("ts_str"),
    regexp_extract("raw_log", LOG_PATTERN, 3).alias("method"),
    regexp_extract("raw_log", LOG_PATTERN, 4).alias("path"),
    regexp_extract("raw_log", LOG_PATTERN, 5).cast("int").alias("status"),
    regexp_extract("raw_log", LOG_PATTERN, 6).cast("int").alias("size"),
    regexp_extract("raw_log", LOG_PATTERN, 7).alias("user_agent")
).withColumn("timestamp", to_timestamp("ts_str", "dd/MMM/yyyy:HH:mm:ss Z")) \\
 .withColumn("hour", hour("timestamp")) \\
 .withColumn("is_error", col("status") >= 400) \\
 .withColumn("is_bot", lower(col("user_agent")).contains("bot")) \\
 .withColumn("status_cat", when(col("status")<300,"2xx").when(col("status")<400,"3xx").when(col("status")<500,"4xx").otherwise("5xx")) \\
 .withColumn("path_type", when(col("path").startswith("/api"),"API").when(col("path").startswith("/static"),"Static").otherwise("Page")) \\
 .cache()

total = cleaned_logs.count()
print(f"총 로그 수: {total:,}")

# ====================================
# 분석 1: 기본 통계
# ====================================
print("\\n" + "="*50)
print("분석 1: 기본 통계")
print("="*50)

basic_stats = cleaned_logs.agg(
    count("*").alias("total_requests"),
    countDistinct("ip").alias("unique_ips"),
    round(avg("size"), 2).alias("avg_response_size"),
    round(sum(when(col("is_error"), 1).otherwise(0)) / count("*") * 100, 2).alias("error_rate_pct")
)
basic_stats.show()

# ====================================
# 분석 2: 시간대별 분석
# ====================================
print("\\n" + "="*50)
print("분석 2: 시간대별 분석")
print("="*50)

hourly_stats = cleaned_logs.groupBy("hour").agg(
    count("*").alias("requests"),
    round(sum(when(col("is_error"),1).otherwise(0))/count("*")*100, 2).alias("error_rate")
).orderBy("hour")

print("시간대별 요청 수 및 에러율:")
hourly_stats.show(24)

# 피크 시간대
peak_hour = hourly_stats.orderBy(desc("requests")).first()
print(f"피크 시간대: {peak_hour['hour']}시 ({peak_hour['requests']:,} 요청)")

# ====================================
# 분석 3: 에러 분석
# ====================================
print("\\n" + "="*50)
print("분석 3: 에러 분석")
print("="*50)

status_dist = cleaned_logs.groupBy("status_cat").agg(
    count("*").alias("count"),
    round(count("*")/total*100, 2).alias("percentage")
).orderBy("status_cat")

print("상태 코드 분포:")
status_dist.show()

error_paths = cleaned_logs.filter(col("is_error")) \\
    .groupBy("path", "status") \\
    .count() \\
    .orderBy(desc("count")) \\
    .limit(10)

print("에러 발생 경로 Top 10:")
error_paths.show()

# ====================================
# 분석 4: 경로 분석
# ====================================
print("\\n" + "="*50)
print("분석 4: 경로 분석")
print("="*50)

popular_paths = cleaned_logs.groupBy("path") \\
    .agg(count("*").alias("requests"), round(avg("size"),0).alias("avg_size")) \\
    .orderBy(desc("requests")).limit(10)

print("인기 경로 Top 10:")
popular_paths.show()

path_type_stats = cleaned_logs.groupBy("path_type").agg(
    count("*").alias("requests"),
    round(count("*")/total*100, 2).alias("percentage"),
    round(avg("size"), 0).alias("avg_size")
).orderBy(desc("requests"))

print("경로 유형별 통계:")
path_type_stats.show()

# ====================================
# 분석 5: 사용자 분석
# ====================================
print("\\n" + "="*50)
print("분석 5: 사용자 분석")
print("="*50)

top_ips = cleaned_logs.groupBy("ip") \\
    .agg(count("*").alias("requests"), countDistinct("path").alias("unique_paths")) \\
    .orderBy(desc("requests")).limit(10)

print("IP별 요청 수 Top 10:")
top_ips.show()

bot_ratio = cleaned_logs.groupBy("is_bot").agg(
    count("*").alias("count"),
    round(count("*")/total*100, 2).alias("percentage")
)

print("봇 vs 실제 사용자:")
bot_ratio.show()

ua_dist = cleaned_logs.groupBy("user_agent") \\
    .count().orderBy(desc("count"))

print("User-Agent 분포:")
ua_dist.show()

# ====================================
# 분석 요약
# ====================================
print("\\n" + "="*50)
print("분석 요약")
print("="*50)

summary = f"""
총 요청 수: {total:,}
고유 IP 수: {cleaned_logs.select("ip").distinct().count():,}
에러율: {cleaned_logs.filter(col("is_error")).count()/total*100:.2f}%
봇 비율: {cleaned_logs.filter(col("is_bot")).count()/total*100:.2f}%
피크 시간대: {peak_hour['hour']}시
가장 인기 있는 경로: {popular_paths.first()['path']}
"""
print(summary)

spark.stop()`,
      hints: [
        'groupBy().agg()로 집계',
        'when().otherwise()로 조건부 집계',
        'orderBy(desc())로 내림차순 정렬',
        'Window 함수로 이전 값과 비교'
      ]
    }
  },
  {
    id: 'w5d5t4',
    title: '최종 도전과제: 완전한 로그 분석 파이프라인',
    type: 'challenge',
    duration: 45,
    content: {
      instructions: `
# 최종 도전과제: 완전한 로그 분석 파이프라인

지금까지 배운 모든 내용을 종합하여 완전한 로그 분석 파이프라인을 구축하세요.

## 요구사항

### 1. 데이터 처리
- 로그 파싱 (정규표현식)
- 데이터 정제 및 타입 변환
- 캐싱 적용

### 2. 분석 (최소 5개)
- 기본 통계
- 시간대별 분석
- 에러 분석
- 경로 분석
- 사용자 분석

### 3. 고급 분석 (2개 이상)
- 윈도우 함수 활용 (순위, 누적, 이동평균)
- Pandas UDF 활용

### 4. 성능 최적화
- explain()으로 실행 계획 분석
- 캐싱 전/후 성능 비교
- broadcast join 적용 (해당 시)

### 5. 결과 저장
- Parquet 형식으로 분석 결과 저장
- 파티셔닝 적용 (날짜별)

## 산출물

1. 분석 노트북 (코드 + 결과)
2. 실행 계획 분석
3. 성능 최적화 보고서
      `,
      starterCode: `"""
===========================================
대용량 로그 분석 파이프라인
===========================================

이 템플릿을 완성하여 전체 파이프라인을 구축하세요.
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.window import Window
from pyspark.sql.types import *
from time import time

# ====================================
# 1. SparkSession 설정
# ====================================
spark = SparkSession.builder \\
    .appName("Log Analysis Pipeline") \\
    .config("spark.sql.shuffle.partitions", "8") \\
    .getOrCreate()


# ====================================
# 2. 데이터 로드 및 파싱
# ====================================
# TODO: 로그 데이터 로드
# TODO: 정규표현식으로 파싱
# TODO: 타입 변환 및 정제


# ====================================
# 3. 데이터 캐싱
# ====================================
# TODO: 정제된 데이터 캐싱
# TODO: 캐싱 효과 측정


# ====================================
# 4. 기본 분석
# ====================================
# TODO: 5개 이상 분석 구현


# ====================================
# 5. 고급 분석
# ====================================
# TODO: 윈도우 함수 분석
# TODO: Pandas UDF 분석 (선택)


# ====================================
# 6. 성능 분석
# ====================================
# TODO: explain()으로 실행 계획 확인
# TODO: 캐싱 전/후 비교


# ====================================
# 7. 결과 저장
# ====================================
# TODO: Parquet으로 저장
# TODO: 파티셔닝 적용


# ====================================
# 8. 최종 보고서
# ====================================
# TODO: 분석 요약 출력


spark.stop()`,
      requirements: [
        '로그 파싱 및 정제가 완료됨',
        '최소 5개 분석이 구현됨',
        '윈도우 함수가 활용됨',
        '실행 계획이 분석됨',
        '캐싱이 적용되고 효과가 측정됨',
        '결과가 Parquet으로 저장됨'
      ],
      evaluationCriteria: [
        '데이터 처리 정확성 (20%)',
        '분석 다양성 및 정확성 (30%)',
        '고급 기능 활용 (20%)',
        '성능 최적화 (15%)',
        '코드 품질 및 문서화 (15%)'
      ],
      hints: [
        '파싱 후 바로 캐싱하여 반복 사용',
        'explain()에서 PushedFilters 확인',
        'Window.partitionBy().orderBy()로 윈도우 정의',
        'write.partitionBy("date").parquet()로 파티셔닝'
      ]
    }
  }
]
