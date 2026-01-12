// Week 6 Day 4: Spark UI & 모니터링
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'w6d4t1',
    title: 'Spark UI 기본',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: '',
      transcript: `
# Spark UI 기본

## 1. Spark UI 접속

\`\`\`
로컬 모드: http://localhost:4040
클러스터: http://<driver-host>:4040

히스토리 서버: http://<host>:18080
\`\`\`

## 2. 주요 탭

### Jobs 탭

전체 작업 목록과 상태를 보여줍니다.

\`\`\`
Jobs Overview:
┌──────────────────────────────────────────────────┐
│ Job 0: count at script.py:15                     │
│ Status: SUCCEEDED                                │
│ Duration: 2.5s                                   │
│ Stages: 2/2                                      │
└──────────────────────────────────────────────────┘

주요 지표:
- Duration: 전체 실행 시간
- Stages: 실행된 스테이지 수
- Tasks: 실행된 태스크 수
\`\`\`

### Stages 탭

각 스테이지의 상세 정보를 보여줍니다.

\`\`\`
Stage 0: Scan parquet
┌────────────────────────────────────────────────────┐
│ Tasks: 200 total, 200 succeeded                    │
│ Input: 1.2 GB                                      │
│ Shuffle Write: 500 MB                              │
│ Duration: 1.8s                                     │
└────────────────────────────────────────────────────┘

Stage 1: Aggregate
┌────────────────────────────────────────────────────┐
│ Tasks: 200 total, 200 succeeded                    │
│ Shuffle Read: 500 MB                               │
│ Duration: 0.7s                                     │
└────────────────────────────────────────────────────┘
\`\`\`

### Storage 탭

캐시된 RDD/DataFrame 정보를 보여줍니다.

\`\`\`
Cached DataFrames:
┌──────────────────────────────────────────────────┐
│ Name: df_cached                                   │
│ Storage Level: Memory Deserialized               │
│ Cached Partitions: 100/100                        │
│ Size in Memory: 2.5 GB                            │
└──────────────────────────────────────────────────┘
\`\`\`

### Executors 탭

Executor별 리소스 사용량을 보여줍니다.

\`\`\`
Executor Summary:
┌───────────────────────────────────────────────────────┐
│ ID │ Address     │ Status │ Tasks │ Memory  │ GC Time │
├────┼─────────────┼────────┼───────┼─────────┼─────────┤
│ 0  │ 10.0.0.1:1  │ Active │ 50    │ 3.2/4GB │ 5s      │
│ 1  │ 10.0.0.2:1  │ Active │ 48    │ 3.5/4GB │ 6s      │
│ 2  │ 10.0.0.3:1  │ Active │ 52    │ 3.0/4GB │ 4s      │
└───────────────────────────────────────────────────────┘
\`\`\`

### SQL 탭

SQL/DataFrame 실행 계획과 메트릭을 보여줍니다.

\`\`\`
SQL Query Plan:
┌──────────────────────────────────────────────────────┐
│ == Physical Plan ==                                  │
│ *(2) HashAggregate                                   │
│ +- Exchange hashpartitioning                         │
│    +- *(1) HashAggregate                            │
│       +- *(1) FileScan parquet                      │
└──────────────────────────────────────────────────────┘
\`\`\`

## 3. DAG 시각화

Jobs/Stages 탭에서 DAG Visualization 클릭:

\`\`\`
Stage 0                   Stage 1
┌─────────────┐          ┌─────────────┐
│ FileScan    │          │ HashAggregate│
│     │       │          │     │       │
│     ▼       │          │     ▼       │
│ Filter      │──────────│ Exchange    │
│     │       │  Shuffle │     │       │
│     ▼       │          │     ▼       │
│ Project     │          │ HashAggregate│
└─────────────┘          └─────────────┘
\`\`\`
      `,
      objectives: [
        'Spark UI 탭별 정보 이해',
        'Jobs, Stages, Tasks 관계 파악',
        'DAG 시각화 해석',
        '리소스 모니터링 방법 학습'
      ],
      keyPoints: [
        'Jobs 탭: 전체 작업 현황',
        'Stages 탭: 스테이지별 상세 메트릭',
        'SQL 탭: 실행 계획 시각화'
      ]
    }
  },
  {
    id: 'w6d4t2',
    title: '병목 분석',
    type: 'reading',
    duration: 25,
    content: {
      markdown: `
# Spark UI로 병목 분석

## 1. 성능 문제 징후

### Data Skew 징후

\`\`\`
Stage의 Task Duration:
┌───────────────────────────────────────────────────────┐
│ Task │ Duration │ Input Size │ Status                 │
├──────┼──────────┼────────────┼────────────────────────┤
│ 0    │ 0.5s     │ 100MB      │ SUCCESS                │
│ 1    │ 0.4s     │ 95MB       │ SUCCESS                │
│ 2    │ 0.6s     │ 110MB      │ SUCCESS                │
│ ...  │ ...      │ ...        │ ...                    │
│ 99   │ 45.2s    │ 9.5GB      │ SUCCESS ← 문제!        │
└───────────────────────────────────────────────────────┘

Task 99만 비정상적으로 오래 걸림 → Data Skew
\`\`\`

### Shuffle 과다 징후

\`\`\`
Stage Summary:
┌──────────────────────────────────────────────────────┐
│ Shuffle Read:  50 GB    ← 과다!                      │
│ Shuffle Write: 50 GB    ← 과다!                      │
│ Duration: 10 minutes                                 │
└──────────────────────────────────────────────────────┘

Input 대비 Shuffle이 크다면 → Broadcast Join 고려
\`\`\`

### GC 과다 징후

\`\`\`
Executor Summary:
┌───────────────────────────────────────────────────────┐
│ Executor │ GC Time │ Task Time │ GC Ratio            │
├──────────┼─────────┼───────────┼─────────────────────┤
│ 0        │ 30s     │ 60s       │ 50% ← 심각!         │
│ 1        │ 28s     │ 55s       │ 51% ← 심각!         │
└───────────────────────────────────────────────────────┘

GC Time > 10% → 메모리 부족 또는 설정 문제
\`\`\`

## 2. 실행 계획 분석

### explain() 출력 해석

\`\`\`python
df.explain(extended=True)

# 출력 해석
== Physical Plan ==
*(3) HashAggregate(keys=[category], functions=[sum(amount)])
+- Exchange hashpartitioning(category, 200)       ← Shuffle!
   +- *(2) HashAggregate(keys=[category], functions=[partial_sum(amount)])
      +- *(2) Project [category, amount]
         +- *(2) BroadcastHashJoin [product_id], [id], Inner
            :- *(2) Filter isnotnull(product_id)  ← Predicate Pushdown
            :  +- *(2) FileScan parquet [product_id, amount]
            +- BroadcastExchange                  ← Broadcast!
               +- *(1) FileScan parquet [id, category]
\`\`\`

### 주요 연산 해석

| 연산 | 의미 | 비용 |
|------|------|------|
| FileScan | 파일 읽기 | 낮음 |
| Filter | 필터링 | 낮음 |
| Project | 컬럼 선택 | 낮음 |
| Exchange | Shuffle | **높음** |
| BroadcastExchange | Broadcast | 중간 |
| HashAggregate | 집계 | 중간 |
| SortMergeJoin | 정렬 조인 | **높음** |
| BroadcastHashJoin | Broadcast 조인 | 낮음 |

## 3. SQL 탭 활용

SQL 탭에서 쿼리 선택 → Details 확인:

\`\`\`
Query Execution Timeline:
┌────────────────────────────────────────────────────────┐
│ [Scan] 2s   [Filter] 0.5s   [Join] 8s   [Agg] 3s      │
│ ████████    ███              ██████████████████████████│
└────────────────────────────────────────────────────────┘

병목: Join 단계 (8초로 전체의 60%)
\`\`\`

## 4. 메트릭 해석

### Input/Output 메트릭

\`\`\`
Stage Metrics:
- Input: 읽은 데이터 양
- Output: 쓴 데이터 양
- Shuffle Read: 네트워크로 받은 양
- Shuffle Write: 네트워크로 보낸 양

권장 비율:
- Shuffle/Input < 1 (같거나 작아야 함)
- Output/Input: 작업에 따라 다름
\`\`\`

### Task 메트릭

\`\`\`
Task Metrics:
- Executor Deserialize Time: 직렬화 해제 시간
- Shuffle Read Blocked Time: Shuffle 대기 시간
- Result Serialization Time: 결과 직렬화 시간
- Getting Result Time: 결과 수집 시간
- Scheduler Delay: 스케줄러 지연
- Peak Execution Memory: 최대 메모리 사용량
\`\`\`

## 5. 체크리스트

| 확인 항목 | 정상 기준 | 이상 시 조치 |
|----------|----------|-------------|
| Task Duration 편차 | < 2x | Salting, Repartition |
| Shuffle/Input 비율 | < 1 | Broadcast Join |
| GC Time 비율 | < 10% | 메모리 증가 |
| Spill 발생 | 0 | 파티션 수 증가 |
| Speculation 활성화 | - | 느린 Task 재실행 |
      `,
      externalLinks: [
        {
          title: 'Spark Monitoring Guide',
          url: 'https://spark.apache.org/docs/latest/monitoring.html'
        },
        {
          title: 'Understanding Spark UI',
          url: 'https://spark.apache.org/docs/latest/web-ui.html'
        }
      ]
    }
  },
  {
    id: 'w6d4t3',
    title: 'Spark History Server',
    type: 'reading',
    duration: 15,
    content: {
      markdown: `
# Spark History Server

완료된 애플리케이션의 로그를 보존하고 조회합니다.

## 1. 설정

\`\`\`bash
# spark-defaults.conf
spark.eventLog.enabled           true
spark.eventLog.dir               hdfs:///spark-logs
spark.history.fs.logDirectory    hdfs:///spark-logs
\`\`\`

\`\`\`python
# SparkSession에서 설정
spark = SparkSession.builder \\
    .config("spark.eventLog.enabled", "true") \\
    .config("spark.eventLog.dir", "/tmp/spark-logs") \\
    .getOrCreate()
\`\`\`

## 2. History Server 시작

\`\`\`bash
# 시작
$SPARK_HOME/sbin/start-history-server.sh

# 접속
http://localhost:18080
\`\`\`

## 3. History Server UI

\`\`\`
Completed Applications:
┌──────────────────────────────────────────────────────────┐
│ App ID          │ Name    │ Duration │ Ended At          │
├─────────────────┼─────────┼──────────┼───────────────────┤
│ app-2024-001    │ ETL Job │ 5m 30s   │ 2024-01-15 10:30  │
│ app-2024-002    │ Report  │ 2m 15s   │ 2024-01-15 09:00  │
└──────────────────────────────────────────────────────────┘
\`\`\`

## 4. 로그 보존 정책

\`\`\`bash
# 로그 최대 보존 기간
spark.history.fs.cleaner.enabled      true
spark.history.fs.cleaner.maxAge       7d

# 로그 압축
spark.eventLog.compress               true
\`\`\`

## 5. Databricks에서 확인

Databricks에서는 클러스터 → Spark UI → History Server로 접근:

\`\`\`
Cluster → Spark UI → [드롭다운: History Server]
\`\`\`
      `,
      externalLinks: [
        {
          title: 'Spark History Server',
          url: 'https://spark.apache.org/docs/latest/monitoring.html#viewing-after-the-fact'
        }
      ]
    }
  },
  {
    id: 'w6d4t4',
    title: 'Spark UI 실습',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# Spark UI 실습

의도적으로 성능 문제를 만들고 Spark UI에서 분석합니다.

## 목표
1. Data Skew 상황 만들기
2. Spark UI에서 병목 확인
3. 최적화 후 비교

## 환경
- Databricks Community Edition (권장)
- 로컬 Spark (http://localhost:4040)
      `,
      starterCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

spark = SparkSession.builder \\
    .appName("spark-ui-practice") \\
    .config("spark.sql.shuffle.partitions", 20) \\
    .getOrCreate()

# Skew 데이터 생성
skewed_data = []
for i in range(100000):
    if i % 100 == 0:  # 1%만 다른 키
        key = i % 10
    else:  # 99%가 동일 키
        key = 0
    skewed_data.append((key, f"value_{i}", i * 0.1))

df = spark.createDataFrame(skewed_data, ["key", "value", "amount"])

# 작은 테이블
small_data = [(i, f"info_{i}") for i in range(10)]
small_df = spark.createDataFrame(small_data, ["key", "info"])

# TODO: 1. Skew가 있는 Join + 집계 실행
# 실행 후 Spark UI에서 Stage의 Task Duration 확인


# TODO: 2. Broadcast Join으로 최적화


# TODO: 3. Spark UI에서 실행 계획 비교
# SQL 탭에서 두 쿼리의 Physical Plan 확인
`,
      solutionCode: `
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

spark = SparkSession.builder \\
    .appName("spark-ui-practice") \\
    .config("spark.sql.shuffle.partitions", 20) \\
    .getOrCreate()

# Skew 데이터 생성
skewed_data = []
for i in range(100000):
    if i % 100 == 0:
        key = i % 10
    else:
        key = 0
    skewed_data.append((key, f"value_{i}", i * 0.1))

df = spark.createDataFrame(skewed_data, ["key", "value", "amount"])
small_df = spark.createDataFrame([(i, f"info_{i}") for i in range(10)], ["key", "info"])

# 1. Skew가 있는 Join + 집계 (비효율)
print("=== Skew Join (비효율) ===")
result1 = (
    df.join(small_df, "key")
      .groupBy("key")
      .agg(F.sum("amount").alias("total"))
)
result1.explain()  # 실행 계획 확인
result1.show()

# Spark UI 확인 포인트:
# - Stages 탭 → Task Duration 편차 확인
# - 대부분의 Task는 빠르지만 일부(key=0)는 매우 느림

# 2. Broadcast Join으로 최적화
print("\\n=== Broadcast Join (최적화) ===")
result2 = (
    df.join(F.broadcast(small_df), "key")
      .groupBy("key")
      .agg(F.sum("amount").alias("total"))
)
result2.explain()  # BroadcastHashJoin 확인
result2.show()

# Spark UI 확인 포인트:
# - SQL 탭 → BroadcastHashJoin 노드 확인
# - Exchange(Shuffle) 노드 감소

# 3. 성능 비교
import time

def measure_time(query, name):
    start = time.time()
    query.collect()
    elapsed = time.time() - start
    print(f"{name}: {elapsed:.2f}초")
    return elapsed

print("\\n=== 성능 비교 ===")
t1 = measure_time(
    df.join(small_df, "key").groupBy("key").agg(F.sum("amount")),
    "일반 Join"
)
t2 = measure_time(
    df.join(F.broadcast(small_df), "key").groupBy("key").agg(F.sum("amount")),
    "Broadcast Join"
)
print(f"개선 비율: {t1/t2:.1f}x")

print("\\n=== Spark UI 확인 ===")
print("1. Jobs 탭: 두 Job의 Duration 비교")
print("2. Stages 탭: Shuffle Read/Write 비교")
print("3. SQL 탭: Physical Plan 비교")
print(f"4. URL: http://localhost:4040")
`,
      hints: [
        'Skew 데이터는 대부분이 동일 키를 가짐',
        'Spark UI의 Stages 탭에서 Task Duration 확인',
        'explain()으로 실행 계획 미리 확인 가능',
        'SQL 탭에서 쿼리별 상세 분석 가능'
      ]
    }
  },
  {
    id: 'w6d4t5',
    title: 'Spark 모니터링 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Spark UI의 Stages 탭에서 확인할 수 없는 것은?',
          options: [
            'Task Duration',
            'Shuffle Read/Write',
            'SQL 쿼리 텍스트',
            'Input/Output Size'
          ],
          answer: 2,
          explanation: 'SQL 쿼리 텍스트는 SQL 탭에서 확인합니다. Stages 탭은 스테이지별 메트릭을 보여줍니다.'
        },
        {
          question: 'Data Skew를 Spark UI에서 발견하는 방법은?',
          options: [
            'Storage 탭에서 캐시 크기 확인',
            'Stages 탭에서 Task Duration 편차 확인',
            'Environment 탭에서 설정 확인',
            'Executors 탭에서 메모리 확인'
          ],
          answer: 1,
          explanation: 'Data Skew가 있으면 일부 Task만 비정상적으로 오래 걸립니다. Stages 탭의 Task Duration에서 확인 가능합니다.'
        },
        {
          question: 'GC Time이 Task Time의 50%를 차지할 때 해결책은?',
          options: [
            '파티션 수 감소',
            'Executor 메모리 증가',
            'Broadcast Join 적용',
            'Shuffle 파티션 감소'
          ],
          answer: 1,
          explanation: 'GC Time이 높으면 메모리가 부족하다는 신호입니다. Executor 메모리를 증가시켜야 합니다.'
        },
        {
          question: 'Spark History Server의 역할은?',
          options: [
            '실시간 쿼리 실행',
            '완료된 애플리케이션 로그 조회',
            '클러스터 리소스 관리',
            '데이터 저장'
          ],
          answer: 1,
          explanation: 'History Server는 완료된 Spark 애플리케이션의 로그를 보존하고 나중에 조회할 수 있게 합니다.'
        },
        {
          question: '실행 계획에서 Exchange 노드의 의미는?',
          options: [
            '파일 읽기',
            '필터링',
            'Shuffle (네트워크 전송)',
            '캐싱'
          ],
          answer: 2,
          explanation: 'Exchange는 Shuffle을 의미하며, 파티션 간 데이터 재분배가 발생합니다. 비용이 높은 연산입니다.'
        }
      ]
    }
  }
]
