// Day 1: Spark 아키텍처 기초
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'w5d1t1',
    title: 'Apache Spark 소개와 아키텍처',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=spark-intro',
      transcript: `
# Apache Spark 소개와 아키텍처

안녕하세요! 이번 주부터 Apache Spark를 배웁니다.

## 1. Apache Spark란?

Spark는 **대용량 데이터 처리를 위한 통합 분석 엔진**입니다.

### 왜 Spark인가?

| 특성 | Hadoop MapReduce | Apache Spark |
|------|------------------|--------------|
| 처리 속도 | 느림 (디스크 기반) | 100배 빠름 (메모리) |
| 프로그래밍 | Java 중심 | Python, Scala, SQL |
| 용도 | 배치만 | 배치 + 스트리밍 |
| 학습 곡선 | 가파름 | 완만함 |

### Spark 에코시스템

\`\`\`
┌─────────────────────────────────────────────────┐
│                   Spark SQL                      │
│              (구조화된 데이터 처리)               │
├──────────┬──────────┬──────────┬────────────────┤
│ DataFrames│   MLlib  │ GraphX   │  Streaming    │
│  (분석)   │   (ML)   │ (그래프) │   (실시간)    │
├──────────┴──────────┴──────────┴────────────────┤
│                  Spark Core                      │
│              (RDD, 분산 처리 엔진)               │
├─────────────────────────────────────────────────┤
│     Local    │  YARN  │   Mesos  │  Kubernetes  │
└─────────────────────────────────────────────────┘
\`\`\`

## 2. Spark 아키텍처

### Driver와 Executor

\`\`\`
┌─────────────────────────────────────────┐
│              Driver Program              │
│  ┌───────────┐  ┌─────────────────────┐ │
│  │SparkContext│  │  DAG Scheduler     │ │
│  │           │  │  Task Scheduler     │ │
│  └───────────┘  └─────────────────────┘ │
└─────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │Executor 1│ │Executor 2│ │Executor 3│
  │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │
  │ │Task 1│ │ │ │Task 2│ │ │ │Task 3│ │
  │ │Task 4│ │ │ │Task 5│ │ │ │Task 6│ │
  │ └──────┘ │ │ └──────┘ │ │ └──────┘ │
  │ [Cache ] │ │ [Cache ] │ │ [Cache ] │
  └──────────┘ └──────────┘ └──────────┘
        Worker Node 1    Worker Node 2    Worker Node 3
\`\`\`

### 컴포넌트 역할

| 컴포넌트 | 역할 |
|----------|------|
| **Driver** | 프로그램 실행, DAG 생성, 작업 분배 |
| **SparkContext** | 클러스터 연결, 리소스 관리 |
| **Executor** | 실제 작업 실행, 데이터 캐싱 |
| **Task** | 가장 작은 실행 단위 |
| **Partition** | 데이터 분할 단위 |

## 3. 실행 흐름

\`\`\`python
# 1. 사용자 코드 작성
df = spark.read.parquet("data.parquet")
result = df.filter(col("age") > 20).groupBy("city").count()
result.write.parquet("output")

# 2. Spark가 내부적으로 하는 일:
#    - Logical Plan 생성
#    - Catalyst 최적화
#    - Physical Plan 생성
#    - DAG (Directed Acyclic Graph) 생성
#    - Stage 분리 (Shuffle 기준)
#    - Task 분배
#    - 실행
\`\`\`

## 4. Lazy Evaluation

Spark는 **Lazy Evaluation**을 사용합니다.

\`\`\`python
# 이 코드들은 아직 실행되지 않음!
df = spark.read.parquet("data.parquet")  # Transformation
df2 = df.filter(col("age") > 20)          # Transformation
df3 = df2.select("name", "city")          # Transformation

# Action 호출 시점에 한번에 실행!
df3.show()  # Action - 여기서 실제 실행
df3.count() # Action
df3.write.parquet("output")  # Action
\`\`\`

### Transformation vs Action

| Transformation (지연) | Action (즉시 실행) |
|----------------------|-------------------|
| filter, select, join | show, count, collect |
| groupBy, orderBy | write, save |
| withColumn, drop | first, take |
| union, distinct | foreach |

## 5. 핵심 개념 정리

1. **분산 처리**: 데이터를 여러 노드에 분산
2. **인메모리**: 디스크 대신 메모리 사용
3. **Lazy Evaluation**: 최적화 후 한번에 실행
4. **Fault Tolerance**: 실패 시 자동 복구

다음 시간에는 실제로 Spark를 설치하고 사용해봅시다!
      `,
      objectives: [
        'Spark의 핵심 아키텍처 컴포넌트를 설명할 수 있다',
        'Driver와 Executor의 역할을 이해한다',
        'Lazy Evaluation의 개념과 장점을 설명할 수 있다'
      ],
      keyPoints: [
        'Spark는 인메모리 기반 분산 처리 엔진',
        'Driver가 작업 분배, Executor가 실행',
        'Lazy Evaluation으로 최적화 후 실행',
        'Transformation은 지연, Action에서 실행'
      ]
    }
  },
  {
    id: 'w5d1t2',
    title: 'Spark 개발 환경 설정',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `
# Spark 개발 환경 설정

## 1. 로컬 개발 환경

### Option A: PySpark 설치 (가장 간단)

\`\`\`bash
# Python 가상환경 생성
python -m venv spark-env
source spark-env/bin/activate  # Windows: spark-env\\Scripts\\activate

# PySpark 설치
pip install pyspark==3.5.0

# Jupyter 설치 (선택)
pip install jupyter
\`\`\`

**테스트:**
\`\`\`python
from pyspark.sql import SparkSession

spark = SparkSession.builder \\
    .appName("test") \\
    .master("local[*]") \\
    .getOrCreate()

# 간단한 DataFrame 생성
df = spark.createDataFrame([
    (1, "Alice", 30),
    (2, "Bob", 25),
    (3, "Charlie", 35)
], ["id", "name", "age"])

df.show()
spark.stop()
\`\`\`

### Option B: Docker 사용

\`\`\`bash
# Jupyter + PySpark 이미지
docker run -p 8888:8888 jupyter/pyspark-notebook

# 또는 공식 Spark 이미지
docker run -it apache/spark /opt/spark/bin/pyspark
\`\`\`

## 2. 클라우드 환경 (권장: 무료!)

### Databricks Community Edition

**가장 추천하는 방법** - 무료 + 설정 불필요

1. https://community.cloud.databricks.com/ 접속
2. 회원가입 (무료)
3. Cluster 생성 (몇 분 소요)
4. Notebook 생성 후 바로 코딩!

**장점:**
- 설정 불필요
- 무료 (Community Edition)
- 실제 분산 환경 체험
- 협업 기능

### Google Colab + PySpark

\`\`\`python
# Colab에서 PySpark 설치
!pip install pyspark

from pyspark.sql import SparkSession
spark = SparkSession.builder.master("local[*]").getOrCreate()
\`\`\`

## 3. SparkSession 생성

\`\`\`python
from pyspark.sql import SparkSession

# 기본 생성
spark = SparkSession.builder \\
    .appName("MyApp") \\
    .getOrCreate()

# 설정 추가
spark = SparkSession.builder \\
    .appName("MyApp") \\
    .master("local[4]") \\  # 4코어 사용
    .config("spark.sql.shuffle.partitions", "200") \\
    .config("spark.executor.memory", "4g") \\
    .getOrCreate()

# 설정 확인
spark.sparkContext.getConf().getAll()
\`\`\`

## 4. 주요 설정 옵션

| 설정 | 설명 | 기본값 |
|------|------|--------|
| \`spark.master\` | 클러스터 매니저 | local[*] |
| \`spark.executor.memory\` | Executor 메모리 | 1g |
| \`spark.executor.cores\` | Executor 코어 수 | 1 |
| \`spark.sql.shuffle.partitions\` | Shuffle 파티션 수 | 200 |
| \`spark.default.parallelism\` | 기본 병렬도 | 코어 수 |

## 5. 환경별 Master 설정

| 환경 | master 값 |
|------|-----------|
| 로컬 (1코어) | \`local\` |
| 로컬 (모든 코어) | \`local[*]\` |
| 로컬 (4코어) | \`local[4]\` |
| YARN | \`yarn\` |
| Standalone | \`spark://host:7077\` |
| Kubernetes | \`k8s://https://host:443\` |

## 6. 첫 번째 Spark 프로그램

\`\`\`python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, avg

# SparkSession 생성
spark = SparkSession.builder \\
    .appName("FirstSparkApp") \\
    .master("local[*]") \\
    .getOrCreate()

# 샘플 데이터 생성
data = [
    ("서울", "IT", 5000000),
    ("서울", "Finance", 6000000),
    ("부산", "IT", 4000000),
    ("부산", "Finance", 4500000),
    ("대구", "IT", 3500000),
]

df = spark.createDataFrame(data, ["city", "industry", "salary"])

# 분석
result = df.groupBy("city") \\
    .agg(
        count("*").alias("count"),
        avg("salary").alias("avg_salary")
    ) \\
    .orderBy(col("avg_salary").desc())

result.show()

# 종료
spark.stop()
\`\`\`
      `,
      externalLinks: [
        { title: 'Databricks Community Edition', url: 'https://community.cloud.databricks.com/' },
        { title: 'PySpark 공식 문서', url: 'https://spark.apache.org/docs/latest/api/python/' }
      ]
    }
  },
  {
    id: 'w5d1t3',
    title: 'RDD vs DataFrame vs Dataset',
    type: 'code',
    duration: 25,
    content: {
      instructions: `
# RDD vs DataFrame vs Dataset

Spark의 3가지 핵심 API를 비교하고 실습합니다.

## 개념

1. **RDD (Resilient Distributed Dataset)**
   - Spark의 가장 기본적인 데이터 구조
   - 타입 안전 (Scala/Java), Low-level API
   - 최적화 없음 (사용자가 직접 최적화)

2. **DataFrame**
   - RDD 위에 구조화된 API
   - SQL과 유사, Catalyst 최적화
   - 언어 간 일관된 API

3. **Dataset**
   - DataFrame + 타입 안전성 (Scala/Java only)
   - Python에서는 DataFrame만 사용

## 과제
1. 같은 작업을 RDD와 DataFrame으로 구현
2. 실행 계획 비교
      `,
      starterCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum as _sum, avg

spark = SparkSession.builder \\
    .appName("RDD vs DataFrame") \\
    .master("local[*]") \\
    .getOrCreate()

# 샘플 데이터
data = [
    ("Alice", "Engineering", 75000),
    ("Bob", "Engineering", 80000),
    ("Charlie", "Sales", 60000),
    ("Diana", "Sales", 65000),
    ("Eve", "Engineering", 90000),
    ("Frank", "HR", 55000),
]

# ====================================
# 과제 1: RDD로 부서별 평균 급여 계산
# ====================================
rdd = spark.sparkContext.parallelize(data)

# TODO: RDD 연산으로 부서별 평균 급여 계산
# 힌트: map, reduceByKey 사용
# 결과: [("Engineering", 81666.67), ("Sales", 62500.0), ("HR", 55000.0)]

dept_avg_rdd = None  # 구현하세요


# ====================================
# 과제 2: DataFrame으로 같은 작업 수행
# ====================================
df = spark.createDataFrame(data, ["name", "department", "salary"])

# TODO: DataFrame 연산으로 부서별 평균 급여 계산
# 힌트: groupBy, agg 사용

dept_avg_df = None  # 구현하세요


# ====================================
# 과제 3: 실행 계획 비교
# ====================================
# DataFrame의 실행 계획 확인
# TODO: explain() 호출


# 정리
spark.stop()`,
      solutionCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum as _sum, avg

spark = SparkSession.builder \\
    .appName("RDD vs DataFrame") \\
    .master("local[*]") \\
    .getOrCreate()

# 샘플 데이터
data = [
    ("Alice", "Engineering", 75000),
    ("Bob", "Engineering", 80000),
    ("Charlie", "Sales", 60000),
    ("Diana", "Sales", 65000),
    ("Eve", "Engineering", 90000),
    ("Frank", "HR", 55000),
]

# ====================================
# 과제 1: RDD로 부서별 평균 급여 계산
# ====================================
rdd = spark.sparkContext.parallelize(data)

# RDD 연산: map -> reduceByKey -> map
dept_avg_rdd = (
    rdd
    # (department, salary) 쌍으로 변환
    .map(lambda x: (x[1], (x[2], 1)))
    # 부서별로 (총급여, 인원수) 합산
    .reduceByKey(lambda a, b: (a[0] + b[0], a[1] + b[1]))
    # 평균 계산
    .map(lambda x: (x[0], round(x[1][0] / x[1][1], 2)))
    .collect()
)

print("=== RDD 결과 ===")
for dept, avg_salary in sorted(dept_avg_rdd):
    print(f"{dept}: {avg_salary:,.2f}")

# ====================================
# 과제 2: DataFrame으로 같은 작업 수행
# ====================================
df = spark.createDataFrame(data, ["name", "department", "salary"])

# DataFrame 연산: groupBy -> agg
dept_avg_df = (
    df
    .groupBy("department")
    .agg(avg("salary").alias("avg_salary"))
    .orderBy("department")
)

print("\\n=== DataFrame 결과 ===")
dept_avg_df.show()

# ====================================
# 과제 3: 실행 계획 비교
# ====================================
print("\\n=== 실행 계획 (Physical Plan) ===")
dept_avg_df.explain()

print("\\n=== 실행 계획 (Extended) ===")
dept_avg_df.explain(extended=True)

# ====================================
# 비교 분석
# ====================================
print("""
=== RDD vs DataFrame 비교 ===

1. 코드 양:
   - RDD: map/reduceByKey/map 체인 필요
   - DataFrame: groupBy/agg로 간결

2. 가독성:
   - RDD: 저수준, 로직 직접 구현
   - DataFrame: SQL과 유사, 선언적

3. 최적화:
   - RDD: 최적화 없음 (사용자 책임)
   - DataFrame: Catalyst 최적화 자동 적용

4. 성능:
   - DataFrame이 대부분 더 빠름 (최적화 덕분)
   - RDD는 세밀한 제어 필요 시 사용

5. 권장:
   - 99%의 경우 DataFrame 사용
   - RDD는 특수한 경우만 (커스텀 파티셔닝 등)
""")

# 정리
spark.stop()`,
      hints: [
        'RDD: map(lambda x: (key, value)) 형태로 변환',
        'reduceByKey: 같은 키의 값을 합침',
        'DataFrame: groupBy().agg()가 훨씬 간결'
      ]
    }
  },
  {
    id: 'w5d1t4',
    title: 'Partition과 Shuffle 이해하기',
    type: 'code',
    duration: 25,
    content: {
      instructions: `
# Partition과 Shuffle

Spark 성능의 핵심인 Partition과 Shuffle을 이해합니다.

## Partition

- 데이터를 분할하는 단위
- 각 Partition은 하나의 Task에서 처리
- Partition 수 = 병렬 처리 수준

## Shuffle

- Partition 간 데이터 재분배
- groupBy, join, repartition 등에서 발생
- **네트워크/디스크 I/O 발생 → 비용 높음**

## 과제
1. Partition 수 확인 및 변경
2. Shuffle 발생 시점 이해
      `,
      starterCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, spark_partition_id

spark = SparkSession.builder \\
    .appName("Partitions and Shuffle") \\
    .master("local[4]") \\
    .config("spark.sql.shuffle.partitions", "4") \\
    .getOrCreate()

# 샘플 데이터 생성
df = spark.range(0, 1000000)

# ====================================
# 과제 1: 파티션 수 확인
# ====================================
# TODO: 현재 파티션 수 확인
# 힌트: df.rdd.getNumPartitions()

num_partitions = None  # 구현하세요
print(f"현재 파티션 수: {num_partitions}")


# ====================================
# 과제 2: 파티션별 데이터 분포 확인
# ====================================
# TODO: spark_partition_id()를 사용하여 파티션별 row 수 확인
# 힌트: withColumn으로 파티션 ID 추가 후 groupBy

partition_dist = None  # 구현하세요


# ====================================
# 과제 3: repartition vs coalesce
# ====================================
# TODO: repartition(8)과 coalesce(2) 비교
# 힌트: 각각의 파티션 수와 실행 계획 확인

df_repartitioned = None  # 구현하세요
df_coalesced = None  # 구현하세요


# ====================================
# 과제 4: Shuffle 발생 확인
# ====================================
# 아래 연산들의 실행 계획에서 Exchange (Shuffle) 확인

# Shuffle 발생 안 함
df_filtered = df.filter(col("id") > 500000)

# Shuffle 발생!
df_grouped = df.withColumn("group", col("id") % 10) \\
    .groupBy("group").count()

# TODO: 두 실행 계획 비교
# 힌트: explain()에서 "Exchange" 찾기


spark.stop()`,
      solutionCode: `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, spark_partition_id, count

spark = SparkSession.builder \\
    .appName("Partitions and Shuffle") \\
    .master("local[4]") \\
    .config("spark.sql.shuffle.partitions", "4") \\
    .getOrCreate()

# 샘플 데이터 생성
df = spark.range(0, 1000000)

# ====================================
# 과제 1: 파티션 수 확인
# ====================================
num_partitions = df.rdd.getNumPartitions()
print(f"현재 파티션 수: {num_partitions}")

# ====================================
# 과제 2: 파티션별 데이터 분포 확인
# ====================================
partition_dist = (
    df.withColumn("partition_id", spark_partition_id())
    .groupBy("partition_id")
    .agg(count("*").alias("row_count"))
    .orderBy("partition_id")
)

print("\\n=== 파티션별 데이터 분포 ===")
partition_dist.show()

# ====================================
# 과제 3: repartition vs coalesce
# ====================================

# repartition: Full Shuffle 발생 (파티션 증가/감소 모두 가능)
df_repartitioned = df.repartition(8)
print(f"\\nrepartition(8) 후 파티션 수: {df_repartitioned.rdd.getNumPartitions()}")
print("repartition 실행 계획:")
df_repartitioned.explain()

# coalesce: Shuffle 없이 파티션 감소 (증가 불가)
df_coalesced = df.coalesce(2)
print(f"\\ncoalesce(2) 후 파티션 수: {df_coalesced.rdd.getNumPartitions()}")
print("coalesce 실행 계획:")
df_coalesced.explain()

# ====================================
# 과제 4: Shuffle 발생 확인
# ====================================

print("\\n=== Shuffle 비교 ===")

# Shuffle 발생 안 함 (Narrow Transformation)
df_filtered = df.filter(col("id") > 500000)
print("\\nfilter (Shuffle 없음):")
df_filtered.explain()
# => Exchange가 없음

# Shuffle 발생! (Wide Transformation)
df_grouped = df.withColumn("group", col("id") % 10) \\
    .groupBy("group").count()
print("\\ngroupBy (Shuffle 발생):")
df_grouped.explain()
# => Exchange hashpartitioning 있음!

# ====================================
# 핵심 정리
# ====================================
print("""
=== Partition & Shuffle 핵심 정리 ===

1. Partition 수 결정:
   - 기본값: spark.default.parallelism (CPU 코어 수)
   - Shuffle 후: spark.sql.shuffle.partitions (기본 200)
   - 권장: 코어 수의 2-4배

2. Narrow vs Wide Transformation:
   - Narrow (Shuffle 없음): filter, map, union
   - Wide (Shuffle 발생): groupBy, join, repartition

3. repartition vs coalesce:
   - repartition: Full Shuffle, 증가/감소 가능
   - coalesce: Shuffle 없음, 감소만 가능

4. Shuffle 비용:
   - 네트워크 전송 + 디스크 I/O
   - 가능하면 Shuffle 최소화!

5. Shuffle 줄이는 방법:
   - broadcast join (작은 테이블)
   - 적절한 파티셔닝
   - filter 먼저 적용
""")

spark.stop()`,
      hints: [
        'getNumPartitions()로 파티션 수 확인',
        'spark_partition_id()로 각 row의 파티션 ID 확인',
        'explain()에서 Exchange는 Shuffle을 의미'
      ]
    }
  },
  {
    id: 'w5d1t5',
    title: 'Spark 아키텍처 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Spark에서 실제 작업을 실행하는 컴포넌트는?',
          options: [
            'Driver',
            'Executor',
            'SparkContext',
            'DAG Scheduler'
          ],
          answer: 1,
          explanation: 'Executor가 Worker Node에서 실제 Task를 실행합니다. Driver는 작업을 분배하고 관리합니다.'
        },
        {
          question: 'Lazy Evaluation의 장점이 아닌 것은?',
          options: [
            '실행 계획 최적화 가능',
            '불필요한 연산 제거',
            '디버깅이 쉬움',
            '메모리 효율적 사용'
          ],
          answer: 2,
          explanation: 'Lazy Evaluation은 최적화에 유리하지만, 실제 실행 시점이 늦어져 디버깅이 어려울 수 있습니다.'
        },
        {
          question: 'Action이 아닌 것은?',
          options: [
            'show()',
            'count()',
            'filter()',
            'collect()'
          ],
          answer: 2,
          explanation: 'filter()는 Transformation입니다. show(), count(), collect()는 즉시 실행되는 Action입니다.'
        },
        {
          question: 'Shuffle이 발생하는 연산은?',
          options: [
            'filter',
            'select',
            'groupBy',
            'withColumn'
          ],
          answer: 2,
          explanation: 'groupBy는 데이터를 재분배해야 하므로 Shuffle이 발생합니다. filter, select, withColumn은 Narrow Transformation입니다.'
        },
        {
          question: '파티션 수를 줄이면서 Shuffle을 피하려면?',
          options: [
            'repartition()',
            'coalesce()',
            'partitionBy()',
            'redistribute()'
          ],
          answer: 1,
          explanation: 'coalesce()는 Shuffle 없이 파티션을 줄입니다. repartition()은 Full Shuffle이 발생합니다.'
        }
      ]
    }
  },
  {
    id: 'w5d1t6',
    title: '도전과제: Spark 로컬 환경 구성',
    type: 'challenge',
    duration: 30,
    content: {
      instructions: `
# 도전과제: Spark 로컬 환경 구성 및 첫 분석

Spark 환경을 구성하고 첫 번째 데이터 분석을 수행하세요.

## 요구사항

1. **환경 선택** (아래 중 하나):
   - PySpark 로컬 설치
   - Databricks Community Edition
   - Docker

2. **SparkSession 생성** (설정 포함):
   - appName: "FirstAnalysis"
   - master: "local[*]"
   - spark.sql.shuffle.partitions: 4

3. **샘플 데이터 분석**:
   - 1,000,000 row 데이터 생성 (spark.range)
   - 10개 그룹으로 나누어 집계
   - 파티션별 데이터 분포 확인

4. **실행 계획 분석**:
   - Shuffle 발생 지점 확인
   - Exchange 연산 해석
      `,
      starterCode: `# Spark 로컬 환경 구성 및 첫 분석
# 아래 코드를 완성하세요

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, spark_partition_id, count, sum as _sum

# 1. SparkSession 생성 (설정 포함)
# TODO: SparkSession 생성
spark = None


# 2. 대용량 데이터 생성
# TODO: 1,000,000 row 데이터 생성
df = None


# 3. 파티션 정보 확인
# TODO: 파티션 수와 파티션별 row 수 출력
def show_partition_info(df, label=""):
    pass  # 구현하세요


# 4. 데이터 분석
# TODO: 10개 그룹으로 나누어 집계
# - group_id: id % 10
# - 그룹별 count, sum 계산
result = None


# 5. 실행 계획 분석
# TODO: 실행 계획 출력 및 Exchange 확인


# 6. 결과 출력
# TODO: 분석 결과 show()


# 정리
spark.stop()`,
      requirements: [
        'SparkSession이 지정된 설정으로 생성됨',
        '1,000,000 row 데이터가 생성됨',
        '파티션 정보가 출력됨',
        '그룹별 집계 결과가 정확함',
        '실행 계획에서 Exchange가 식별됨'
      ],
      evaluationCriteria: [
        'SparkSession 설정 정확성 (20%)',
        '데이터 생성 및 변환 (20%)',
        '파티션 분석 (20%)',
        '집계 로직 정확성 (20%)',
        '실행 계획 해석 (20%)'
      ],
      hints: [
        'SparkSession.builder.config()으로 설정 추가',
        'spark.range(n)으로 0부터 n-1까지 데이터 생성',
        'spark_partition_id()로 각 row의 파티션 확인',
        'explain()에서 Exchange는 Shuffle을 의미'
      ]
    }
  }
]
