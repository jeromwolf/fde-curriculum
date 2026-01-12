// Day 4: UDF & Pandas UDF
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'w5d4t1',
    title: 'UDF (User Defined Function) 이해하기',
    type: 'video',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=spark-udf',
      transcript: `
# UDF (User Defined Function) 이해하기

안녕하세요! 오늘은 Spark에서 커스텀 함수를 작성하는 방법을 배웁니다.

## 1. UDF란?

UDF는 **사용자 정의 함수**로, 내장 함수로 처리할 수 없는 로직을 구현합니다.

### 언제 사용하나?

\`\`\`python
# 내장 함수로 가능 → UDF 불필요
df.withColumn("upper_name", upper(col("name")))

# 복잡한 로직 → UDF 필요
def parse_custom_format(text):
    # 복잡한 파싱 로직
    return parsed_result

df.withColumn("parsed", parse_udf(col("text")))
\`\`\`

## 2. UDF 유형

| 유형 | 언어 | 속도 | 특징 |
|------|------|------|------|
| Python UDF | Python | 느림 | 직렬화 오버헤드 |
| Pandas UDF | Python | 빠름 | Arrow 기반, 벡터 연산 |
| Scala UDF | Scala | 가장 빠름 | JVM 네이티브 |

## 3. Python UDF (기본)

\`\`\`python
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType, IntegerType

# 방법 1: 데코레이터
@udf(returnType=StringType())
def clean_text(text):
    if text is None:
        return None
    return text.strip().lower()

# 방법 2: 함수 등록
def add_prefix(text, prefix="Mr. "):
    return f"{prefix}{text}"

add_prefix_udf = udf(add_prefix, StringType())

# 사용
df.withColumn("clean_name", clean_text(col("name")))
\`\`\`

## 4. Python UDF의 문제

\`\`\`
Spark (JVM)  →  Python  →  Spark (JVM)
    ↓            ↓            ↓
 직렬화      함수 실행     역직렬화
   (느림)                   (느림)
\`\`\`

- **직렬화/역직렬화 오버헤드**
- **Python GIL 제약**
- **Catalyst 최적화 불가**

## 5. Pandas UDF (권장)

Apache Arrow를 사용하여 직렬화 오버헤드를 크게 줄임:

\`\`\`python
from pyspark.sql.functions import pandas_udf
import pandas as pd

@pandas_udf(StringType())
def clean_text_fast(s: pd.Series) -> pd.Series:
    return s.str.strip().str.lower()

# 10-100배 빠름!
df.withColumn("clean_name", clean_text_fast(col("name")))
\`\`\`

### Pandas UDF 유형

| 유형 | 입력 | 출력 | 용도 |
|------|------|------|------|
| Scalar | Series | Series | 행별 변환 |
| Grouped Map | DataFrame | DataFrame | 그룹별 처리 |
| Grouped Agg | Series | Scalar | 그룹별 집계 |

## 6. 성능 비교

\`\`\`
벤치마크 (100만 행):

내장 함수:     0.5초   ⭐⭐⭐⭐⭐
Pandas UDF:   1.2초   ⭐⭐⭐⭐
Python UDF:  12.0초   ⭐

→ 내장 함수 > Pandas UDF > Python UDF
\`\`\`

## 7. 베스트 프랙티스

1. **내장 함수 우선**: 가능하면 항상 내장 함수 사용
2. **Pandas UDF**: 커스텀 로직 필요 시
3. **Python UDF**: 마지막 수단
4. **NULL 처리**: UDF에서 NULL 명시적 처리
5. **타입 힌트**: 반환 타입 명확히 지정

다음 시간에는 실습을 통해 UDF를 작성해봅시다!
      `,
      objectives: [
        'UDF의 필요성과 종류를 설명할 수 있다',
        'Python UDF의 성능 문제를 이해한다',
        'Pandas UDF의 장점을 설명할 수 있다'
      ],
      keyPoints: [
        '내장 함수 > Pandas UDF > Python UDF 순서로 선택',
        'Python UDF는 직렬화 오버헤드로 느림',
        'Pandas UDF는 Arrow로 10-100배 빠름',
        'NULL 처리를 명시적으로 해야 함'
      ]
    }
  },
  {
    id: 'w5d4t2',
    title: 'Python UDF 실습',
    type: 'code',
    duration: 25,
    content: {
      instructions: `
# Python UDF 실습

기본 Python UDF를 작성하고 사용하는 방법을 학습합니다.

## 과제
1. 기본 UDF 작성
2. 여러 인자 UDF
3. 복잡한 반환 타입
4. SQL에서 UDF 사용
      `,
      starterCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import udf, col
from pyspark.sql.types import (
    StringType, IntegerType, FloatType,
    ArrayType, StructType, StructField
)

spark = SparkSession.builder.appName("Python UDF").getOrCreate()

# 샘플 데이터
data = [
    (1, "Alice", "alice@example.com", "1990-05-15"),
    (2, "Bob", "bob@test.org", "1985-10-20"),
    (3, "Charlie", None, "2000-01-01"),
    (4, "Diana", "diana@company.co.kr", "1995-07-30"),
]

df = spark.createDataFrame(data, ["id", "name", "email", "birth_date"])
df.show()

# ====================================
# 과제 1: 기본 UDF - 이메일 도메인 추출
# ====================================
# TODO: 이메일에서 도메인 추출 (@ 뒤 부분)
# 예: "alice@example.com" → "example.com"
# NULL이면 None 반환

@udf(returnType=StringType())
def extract_domain(email):
    # 구현하세요
    pass

# df.withColumn("domain", extract_domain(col("email"))).show()


# ====================================
# 과제 2: 여러 인자 UDF - 인사말 생성
# ====================================
# TODO: 이름과 시간대를 받아 인사말 생성
# 예: ("Alice", "morning") → "Good morning, Alice!"
# 시간대: morning, afternoon, evening

@udf(returnType=StringType())
def create_greeting(name, time_of_day):
    # 구현하세요
    pass

# 테스트 데이터
# df.withColumn("greeting", create_greeting(col("name"), lit("morning"))).show()


# ====================================
# 과제 3: 복잡한 반환 타입 - 나이 계산
# ====================================
# TODO: 생년월일에서 나이와 세대 반환
# 반환: {"age": 34, "generation": "Millennial"}
# 세대: ~1964 Boomer, ~1980 Gen X, ~1996 Millennial, 이후 Gen Z

result_schema = StructType([
    StructField("age", IntegerType(), True),
    StructField("generation", StringType(), True)
])

@udf(returnType=result_schema)
def calculate_age_info(birth_date):
    # 구현하세요
    pass

# df.withColumn("age_info", calculate_age_info(col("birth_date"))).show()


# ====================================
# 과제 4: SQL에서 UDF 사용
# ====================================
# TODO: UDF를 SQL에 등록하고 사용

# spark.udf.register("extract_domain_sql", ...)
# df.createOrReplaceTempView("users")
# spark.sql("SELECT name, extract_domain_sql(email) as domain FROM users").show()


spark.stop()`,
      solutionCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import udf, col, lit
from pyspark.sql.types import (
    StringType, IntegerType, FloatType,
    ArrayType, StructType, StructField
)
from datetime import datetime, date

spark = SparkSession.builder.appName("Python UDF").getOrCreate()

# 샘플 데이터
data = [
    (1, "Alice", "alice@example.com", "1990-05-15"),
    (2, "Bob", "bob@test.org", "1985-10-20"),
    (3, "Charlie", None, "2000-01-01"),
    (4, "Diana", "diana@company.co.kr", "1995-07-30"),
]

df = spark.createDataFrame(data, ["id", "name", "email", "birth_date"])
print("=== 원본 데이터 ===")
df.show()

# ====================================
# 과제 1: 기본 UDF - 이메일 도메인 추출
# ====================================
@udf(returnType=StringType())
def extract_domain(email):
    if email is None:
        return None
    if "@" not in email:
        return None
    return email.split("@")[1]

print("=== 과제 1: 이메일 도메인 추출 ===")
df.withColumn("domain", extract_domain(col("email"))).show()

# ====================================
# 과제 2: 여러 인자 UDF - 인사말 생성
# ====================================
@udf(returnType=StringType())
def create_greeting(name, time_of_day):
    if name is None:
        return None

    greetings = {
        "morning": "Good morning",
        "afternoon": "Good afternoon",
        "evening": "Good evening"
    }

    greeting = greetings.get(time_of_day, "Hello")
    return f"{greeting}, {name}!"

print("=== 과제 2: 인사말 생성 ===")
df.withColumn("greeting", create_greeting(col("name"), lit("morning"))).show()

# ====================================
# 과제 3: 복잡한 반환 타입 - 나이 계산
# ====================================
result_schema = StructType([
    StructField("age", IntegerType(), True),
    StructField("generation", StringType(), True)
])

@udf(returnType=result_schema)
def calculate_age_info(birth_date_str):
    if birth_date_str is None:
        return None

    try:
        birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d")
        today = datetime.now()

        # 나이 계산
        age = today.year - birth_date.year
        if (today.month, today.day) < (birth_date.month, birth_date.day):
            age -= 1

        # 세대 판단
        birth_year = birth_date.year
        if birth_year <= 1964:
            generation = "Boomer"
        elif birth_year <= 1980:
            generation = "Gen X"
        elif birth_year <= 1996:
            generation = "Millennial"
        else:
            generation = "Gen Z"

        return {"age": age, "generation": generation}
    except:
        return None

print("=== 과제 3: 나이 및 세대 정보 ===")
df_with_age = df.withColumn("age_info", calculate_age_info(col("birth_date")))
df_with_age.show()

# Struct 필드 접근
df_with_age.select(
    "name",
    col("age_info.age").alias("age"),
    col("age_info.generation").alias("generation")
).show()

# ====================================
# 과제 4: SQL에서 UDF 사용
# ====================================
# Python 함수 정의 (데코레이터 없이)
def extract_domain_sql(email):
    if email is None:
        return None
    if "@" not in email:
        return None
    return email.split("@")[1]

# SQL UDF 등록
spark.udf.register("extract_domain_sql", extract_domain_sql, StringType())

# 테이블 등록
df.createOrReplaceTempView("users")

print("=== 과제 4: SQL에서 UDF 사용 ===")
spark.sql("""
    SELECT
        name,
        email,
        extract_domain_sql(email) as domain
    FROM users
""").show()

# ====================================
# 추가: 배열 반환 UDF
# ====================================
@udf(returnType=ArrayType(StringType()))
def split_name(full_name):
    if full_name is None:
        return None
    return full_name.split(" ")

# 테스트
test_df = spark.createDataFrame([
    ("John Doe",),
    ("Jane Smith",),
    ("Alice",),
], ["full_name"])

print("=== 보너스: 배열 반환 UDF ===")
test_df.withColumn("name_parts", split_name(col("full_name"))).show()

spark.stop()`,
      hints: [
        'NULL 체크를 먼저 수행',
        '@udf(returnType=타입)으로 반환 타입 지정',
        'Struct 타입은 StructType으로 스키마 정의',
        'spark.udf.register()로 SQL에 등록'
      ]
    }
  },
  {
    id: 'w5d4t3',
    title: 'Pandas UDF 실습',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# Pandas UDF 실습

고성능 Pandas UDF를 작성하는 방법을 학습합니다.

## Pandas UDF 유형

1. **Scalar**: Series → Series (행별 변환)
2. **Grouped Map**: DataFrame → DataFrame (그룹별 처리)
3. **Grouped Agg**: Series → Scalar (그룹별 집계)

## 과제
1. Scalar Pandas UDF
2. Grouped Map Pandas UDF
3. 성능 비교
      `,
      starterCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import pandas_udf, col, udf
from pyspark.sql.types import StringType, DoubleType, StructType, StructField
import pandas as pd
from time import time

spark = SparkSession.builder.appName("Pandas UDF").getOrCreate()

# 대용량 테스트 데이터
df = spark.range(0, 100000).toDF("id") \\
    .withColumn("value", (col("id") * 1.5).cast("double")) \\
    .withColumn("category", (col("id") % 5).cast("string")) \\
    .withColumn("text", concat(lit("item_"), col("id").cast("string")))

print("=== 테스트 데이터 ===")
df.show(5)

# ====================================
# 과제 1: Scalar Pandas UDF
# ====================================
# TODO: 텍스트를 대문자로 변환하고 접두사 추가
# 예: "item_1" → "PREFIX_ITEM_1"

# Python UDF (비교용)
@udf(StringType())
def transform_text_python(text):
    if text is None:
        return None
    return f"PREFIX_{text.upper()}"

# TODO: Pandas UDF 구현
@pandas_udf(StringType())
def transform_text_pandas(s: pd.Series) -> pd.Series:
    # 구현하세요
    pass


# ====================================
# 과제 2: Grouped Map Pandas UDF
# ====================================
# TODO: 카테고리별로 value를 정규화 (z-score)
# z = (x - mean) / std

schema = StructType([
    StructField("id", "long", True),
    StructField("category", StringType(), True),
    StructField("value", DoubleType(), True),
    StructField("normalized", DoubleType(), True),
])

@pandas_udf(schema, "grouped_map")
def normalize_by_category(pdf: pd.DataFrame) -> pd.DataFrame:
    # 구현하세요
    pass

# df.groupBy("category").apply(normalize_by_category).show()


# ====================================
# 과제 3: Grouped Agg Pandas UDF
# ====================================
# TODO: 카테고리별 value의 변동계수 (CV) 계산
# CV = std / mean * 100

@pandas_udf(DoubleType())
def coefficient_of_variation(v: pd.Series) -> float:
    # 구현하세요
    pass

# df.groupBy("category").agg(coefficient_of_variation(col("value"))).show()


# ====================================
# 과제 4: 성능 비교
# ====================================
# TODO: Python UDF vs Pandas UDF 실행 시간 비교

def benchmark(name, func):
    start = time()
    func()
    elapsed = time() - start
    print(f"{name}: {elapsed:.3f}초")

# Python UDF
# benchmark("Python UDF", lambda: df.withColumn("result", transform_text_python(col("text"))).count())

# Pandas UDF
# benchmark("Pandas UDF", lambda: df.withColumn("result", transform_text_pandas(col("text"))).count())


spark.stop()`,
      solutionCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import pandas_udf, col, udf, lit, concat
from pyspark.sql.types import StringType, DoubleType, LongType, StructType, StructField
import pandas as pd
from time import time

spark = SparkSession.builder.appName("Pandas UDF").getOrCreate()

# 대용량 테스트 데이터
df = spark.range(0, 100000).toDF("id") \\
    .withColumn("value", (col("id") * 1.5).cast("double")) \\
    .withColumn("category", (col("id") % 5).cast("string")) \\
    .withColumn("text", concat(lit("item_"), col("id").cast("string")))

print("=== 테스트 데이터 ===")
df.show(5)
print(f"총 행 수: {df.count():,}")

# ====================================
# 과제 1: Scalar Pandas UDF
# ====================================
print("\\n=== 과제 1: Scalar Pandas UDF ===")

# Python UDF (비교용)
@udf(StringType())
def transform_text_python(text):
    if text is None:
        return None
    return f"PREFIX_{text.upper()}"

# Pandas UDF
@pandas_udf(StringType())
def transform_text_pandas(s: pd.Series) -> pd.Series:
    return "PREFIX_" + s.str.upper()

# 결과 확인
df.select(
    "text",
    transform_text_python(col("text")).alias("python_result"),
    transform_text_pandas(col("text")).alias("pandas_result")
).show(5)

# ====================================
# 과제 2: Grouped Map Pandas UDF
# ====================================
print("\\n=== 과제 2: Grouped Map (정규화) ===")

schema = StructType([
    StructField("id", LongType(), True),
    StructField("category", StringType(), True),
    StructField("value", DoubleType(), True),
    StructField("normalized", DoubleType(), True),
])

@pandas_udf(schema, "grouped_map")
def normalize_by_category(pdf: pd.DataFrame) -> pd.DataFrame:
    mean_val = pdf["value"].mean()
    std_val = pdf["value"].std()

    # 표준편차가 0인 경우 처리
    if std_val == 0:
        pdf["normalized"] = 0.0
    else:
        pdf["normalized"] = (pdf["value"] - mean_val) / std_val

    return pdf[["id", "category", "value", "normalized"]]

normalized_df = df.groupBy("category").apply(normalize_by_category)
normalized_df.orderBy("category", "id").show(10)

# 정규화 검증 (평균≈0, 표준편차≈1)
normalized_df.groupBy("category").agg(
    {"normalized": "mean", "normalized": "stddev"}
).show()

# ====================================
# 과제 3: Grouped Agg Pandas UDF
# ====================================
print("\\n=== 과제 3: Grouped Agg (변동계수) ===")

@pandas_udf(DoubleType())
def coefficient_of_variation(v: pd.Series) -> float:
    mean_val = v.mean()
    if mean_val == 0:
        return 0.0
    return (v.std() / mean_val) * 100

cv_result = df.groupBy("category").agg(
    coefficient_of_variation(col("value")).alias("cv_percent")
)
cv_result.orderBy("category").show()

# ====================================
# 과제 4: 성능 비교
# ====================================
print("\\n=== 과제 4: 성능 비교 ===")

def benchmark(name, func):
    # 캐시 제거
    spark.catalog.clearCache()

    start = time()
    func()
    elapsed = time() - start
    print(f"{name}: {elapsed:.3f}초")
    return elapsed

# 내장 함수 (가장 빠름)
t_builtin = benchmark(
    "내장 함수 (upper)",
    lambda: df.withColumn("result", concat(lit("PREFIX_"), upper(col("text")))).count()
)

# Python UDF
t_python = benchmark(
    "Python UDF",
    lambda: df.withColumn("result", transform_text_python(col("text"))).count()
)

# Pandas UDF
t_pandas = benchmark(
    "Pandas UDF",
    lambda: df.withColumn("result", transform_text_pandas(col("text"))).count()
)

print(f"""
=== 성능 비교 요약 ===
내장 함수: {t_builtin:.3f}초 (기준)
Pandas UDF: {t_pandas:.3f}초 ({t_pandas/t_builtin:.1f}배)
Python UDF: {t_python:.3f}초 ({t_python/t_builtin:.1f}배)

→ 내장 함수 > Pandas UDF > Python UDF
→ 가능하면 항상 내장 함수 사용!
""")

# ====================================
# 추가: Iterator UDF (대용량 최적화)
# ====================================
print("\\n=== 보너스: Iterator UDF ===")

from typing import Iterator

@pandas_udf(StringType())
def transform_iterator(iterator: Iterator[pd.Series]) -> Iterator[pd.Series]:
    for batch in iterator:
        yield "PREFIX_" + batch.str.upper()

df.select(
    "text",
    transform_iterator(col("text")).alias("iterator_result")
).show(5)

spark.stop()`,
      hints: [
        'Pandas UDF는 Series를 입력받아 Series를 반환',
        'Grouped Map은 전체 스키마를 반환 타입으로 지정',
        'Grouped Agg는 스칼라 값을 반환',
        'str 접근자로 문자열 벡터 연산 (.str.upper())'
      ]
    }
  },
  {
    id: 'w5d4t4',
    title: 'UDF 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Python UDF가 느린 이유는?',
          options: [
            'Python 언어 자체가 느려서',
            'JVM과 Python 간 직렬화/역직렬화 오버헤드',
            'Spark가 Python을 지원하지 않아서',
            '메모리 부족'
          ],
          answer: 1,
          explanation: 'Python UDF는 JVM에서 Python으로 데이터를 직렬화하고, 처리 후 다시 역직렬화해야 하므로 오버헤드가 큽니다.'
        },
        {
          question: 'Pandas UDF가 빠른 이유는?',
          options: [
            'Python이 최적화되어서',
            'Apache Arrow를 사용하여 직렬화 오버헤드를 줄임',
            'JVM에서 실행되어서',
            'GPU를 사용해서'
          ],
          answer: 1,
          explanation: 'Pandas UDF는 Apache Arrow 포맷으로 데이터를 교환하여 직렬화 오버헤드를 크게 줄입니다.'
        },
        {
          question: 'Grouped Map Pandas UDF의 반환 타입은?',
          options: [
            'pd.Series',
            'pd.DataFrame',
            'float',
            'Spark DataFrame'
          ],
          answer: 1,
          explanation: 'Grouped Map UDF는 그룹별로 pd.DataFrame을 입력받아 pd.DataFrame을 반환합니다.'
        },
        {
          question: 'UDF에서 NULL 처리를 해야 하는 이유는?',
          options: [
            'Spark가 NULL을 지원하지 않아서',
            'NULL이 Python에서 에러를 발생시킬 수 있어서',
            '성능이 향상되어서',
            'NULL 처리는 필요 없다'
          ],
          answer: 1,
          explanation: 'NULL 값이 UDF에 전달되면 None으로 변환되는데, 이를 처리하지 않으면 NoneType 에러가 발생할 수 있습니다.'
        },
        {
          question: 'UDF 사용 시 가장 먼저 고려해야 할 것은?',
          options: [
            'Python UDF 작성',
            'Pandas UDF 작성',
            '내장 함수로 해결 가능한지 확인',
            'Scala UDF 작성'
          ],
          answer: 2,
          explanation: '내장 함수가 가장 빠르고 최적화되어 있으므로, 먼저 내장 함수로 해결 가능한지 확인해야 합니다.'
        }
      ]
    }
  },
  {
    id: 'w5d4t5',
    title: '도전과제: 복잡한 UDF 구현',
    type: 'challenge',
    duration: 30,
    content: {
      instructions: `
# 도전과제: 복잡한 UDF 구현

실제 시나리오에서 필요한 복잡한 UDF를 구현하세요.

## 시나리오

텍스트 데이터를 분석하는 UDF들을 구현합니다:

1. **텍스트 정제**: HTML 태그 제거, 특수문자 정리
2. **키워드 추출**: 단어 빈도 기반 상위 N개 추출
3. **감성 점수**: 긍정/부정 단어 기반 점수 계산

## 요구사항

1. Pandas UDF로 구현 (성능)
2. NULL 안전 처리
3. 에러 핸들링
      `,
      starterCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import pandas_udf, col
from pyspark.sql.types import StringType, ArrayType, DoubleType, StructType, StructField
import pandas as pd
import re

spark = SparkSession.builder.appName("Complex UDF").getOrCreate()

# 테스트 데이터
texts = [
    "<p>This product is <b>amazing</b>! I love it so much.</p>",
    "<div>Terrible experience. Very bad quality, hate it.</div>",
    "Good product. Nice quality. Recommended.",
    None,
    "<span>Average product, nothing special but okay.</span>",
]

df = spark.createDataFrame([(i, t) for i, t in enumerate(texts)], ["id", "text"])
df.show(truncate=False)

# 감성 사전 (실제로는 더 큼)
POSITIVE_WORDS = {"amazing", "love", "good", "nice", "great", "excellent", "recommend"}
NEGATIVE_WORDS = {"terrible", "bad", "hate", "awful", "poor", "worst"}

# ====================================
# 과제 1: 텍스트 정제 UDF
# ====================================
# TODO: HTML 태그 제거 + 소문자 변환 + 특수문자 제거

@pandas_udf(StringType())
def clean_text(texts: pd.Series) -> pd.Series:
    # 구현하세요
    pass


# ====================================
# 과제 2: 키워드 추출 UDF
# ====================================
# TODO: 단어 빈도 기반 상위 3개 단어 추출
# 불용어 제외: a, the, is, it, i, so, but, and, or, to

STOPWORDS = {"a", "the", "is", "it", "i", "so", "but", "and", "or", "to", "very"}

@pandas_udf(ArrayType(StringType()))
def extract_keywords(texts: pd.Series) -> pd.Series:
    # 구현하세요
    pass


# ====================================
# 과제 3: 감성 점수 UDF
# ====================================
# TODO: 감성 점수 계산
# 점수 = (긍정 단어 수 - 부정 단어 수) / 전체 단어 수 * 100
# 범위: -100 (완전 부정) ~ +100 (완전 긍정)

@pandas_udf(DoubleType())
def sentiment_score(texts: pd.Series) -> pd.Series:
    # 구현하세요
    pass


# 결과 확인
# result = df.select(
#     "id",
#     "text",
#     clean_text(col("text")).alias("cleaned"),
#     extract_keywords(col("text")).alias("keywords"),
#     sentiment_score(col("text")).alias("sentiment")
# )
# result.show(truncate=False)

spark.stop()`,
      requirements: [
        'HTML 태그가 정확히 제거됨',
        '불용어가 키워드에서 제외됨',
        '감성 점수가 올바르게 계산됨',
        'NULL 값이 안전하게 처리됨',
        'Pandas UDF로 구현됨'
      ],
      evaluationCriteria: [
        '텍스트 정제 정확성 (25%)',
        '키워드 추출 정확성 (25%)',
        '감성 점수 계산 정확성 (25%)',
        'NULL 및 에러 처리 (15%)',
        '코드 품질 (10%)'
      ],
      hints: [
        're.sub("<[^>]+>", "", text)로 HTML 제거',
        'collections.Counter로 단어 빈도 계산',
        'apply()로 각 행에 함수 적용',
        'fillna()로 NULL 처리'
      ]
    }
  }
]
