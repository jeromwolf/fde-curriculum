// Day 4: Polars 소개 및 비교
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  // Task 1: Polars 소개 (Video)
  {
    id: 'w2d4-task1',
    title: 'Polars: 차세대 DataFrame 라이브러리',
    type: 'video',
    duration: 15,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      objectives: [
        'Polars의 탄생 배경 이해',
        'pandas와 Polars의 핵심 차이점',
        'Polars의 아키텍처 특징',
        '언제 Polars를 사용해야 하는지 판단'
      ],
      transcript: `
# Polars: 차세대 DataFrame 라이브러리

## Polars란?

Polars는 **Rust로 작성된** 초고속 DataFrame 라이브러리입니다.

\`\`\`python
import polars as pl

# Polars DataFrame 생성
df = pl.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['Seoul', 'Busan', 'Daegu']
})

print(df)
\`\`\`

## 왜 Polars인가?

### 1. 압도적인 성능
- Rust의 메모리 안전성 + 제로코스트 추상화
- 멀티스레드 기본 지원
- SIMD 벡터화 연산
- 지연 평가(Lazy Evaluation)로 최적화

### 2. 메모리 효율성
- Apache Arrow 메모리 포맷 사용
- 복사 최소화
- 컬럼 기반 스토리지

### 3. 직관적인 API
- pandas와 유사하면서도 더 일관성 있는 API
- 메서드 체이닝 최적화
- 명시적인 표현식 시스템

## pandas vs Polars 핵심 차이

| 특성 | pandas | Polars |
|------|--------|--------|
| 언어 | Python/C | Rust |
| 기본 스레딩 | 단일 스레드 | 멀티스레드 |
| 평가 전략 | 즉시 평가 | Lazy 지원 |
| 메모리 모델 | NumPy 기반 | Arrow 기반 |
| 문자열 처리 | 느림 (object) | 빠름 (Rust String) |
| 인덱스 | 있음 | 없음 |

## 성능 벤치마크

\`\`\`python
# 1억 행 데이터 집계 예시

# pandas: ~30초
df_pandas.groupby('category')['value'].sum()

# Polars: ~2초 (15배 빠름!)
df_polars.group_by('category').agg(pl.col('value').sum())
\`\`\`

## Polars의 핵심 개념

### 1. 표현식 (Expression)
\`\`\`python
# 모든 연산은 표현식
pl.col('age')           # 컬럼 선택
pl.col('age') + 1       # 연산
pl.col('age').mean()    # 집계
pl.col('name').str.to_uppercase()  # 문자열 처리
\`\`\`

### 2. 지연 평가 (Lazy Evaluation)
\`\`\`python
# 쿼리를 정의하고 마지막에 실행
result = (
    df.lazy()
    .filter(pl.col('age') > 25)
    .group_by('city')
    .agg(pl.col('age').mean())
    .collect()  # 여기서 실제 실행!
)
\`\`\`

### 3. 스트리밍 모드
\`\`\`python
# 메모리보다 큰 데이터 처리
result = (
    pl.scan_csv('huge_file.csv')  # 스캔만 (로드 X)
    .filter(pl.col('value') > 100)
    .group_by('category')
    .agg(pl.col('value').sum())
    .collect(streaming=True)  # 청크 단위 처리
)
\`\`\`

## 언제 Polars를 사용해야 할까?

### ✅ Polars가 좋은 경우
- 대용량 데이터 (100만+ 행)
- 복잡한 집계/변환
- 멀티코어 활용 필요
- 메모리 제약 환경
- 신규 프로젝트

### ✅ pandas가 좋은 경우
- 소규모 데이터
- 레거시 코드 호환
- 시계열 분석 (pandas가 더 성숙)
- 풍부한 에코시스템 필요
      `,
      keyPoints: [
        'Polars는 Rust 기반 고성능 DataFrame 라이브러리',
        '멀티스레드 + SIMD로 pandas 대비 10-100배 빠름',
        'Lazy Evaluation으로 쿼리 자동 최적화',
        'Apache Arrow 포맷으로 메모리 효율적'
      ]
    }
  },

  // Task 2: Polars 기본 문법 (Reading)
  {
    id: 'w2d4-task2',
    title: 'Polars 기본 문법 마스터',
    type: 'reading',
    duration: 15,
    content: {
      objectives: [
        'Polars DataFrame 생성 방법',
        '컬럼 선택과 필터링',
        'select()와 with_columns() 차이',
        'pandas에서 Polars로 마이그레이션 패턴'
      ],
      markdown: `
# Polars 기본 문법 마스터

## 설치

\`\`\`bash
pip install polars
# 또는 CPU 최적화 버전
pip install polars[all]
\`\`\`

## DataFrame 생성

\`\`\`python
import polars as pl

# 딕셔너리로 생성
df = pl.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie', 'David'],
    'age': [25, 30, 35, 28],
    'salary': [50000, 60000, 70000, 55000]
})

# pandas DataFrame에서 변환
import pandas as pd
df_pandas = pd.DataFrame({'a': [1, 2, 3]})
df_polars = pl.from_pandas(df_pandas)

# CSV에서 로드
df = pl.read_csv('data.csv')

# Lazy 모드로 로드 (대용량 추천)
lf = pl.scan_csv('data.csv')
\`\`\`

## 컬럼 선택 (select)

pandas와 가장 다른 부분입니다!

\`\`\`python
# pandas 방식 (Polars에서 비권장)
# df['name']  # 가능하지만...

# Polars 권장 방식: select()
df.select('name')
df.select(['name', 'age'])

# 표현식 사용 (더 강력함)
df.select(pl.col('name'))
df.select(pl.col('name', 'age'))

# 패턴 매칭
df.select(pl.col('^s.*$'))  # 's'로 시작하는 모든 컬럼
df.select(pl.all())          # 모든 컬럼
df.select(pl.exclude('name')) # name 제외
\`\`\`

## 필터링 (filter)

\`\`\`python
# 단일 조건
df.filter(pl.col('age') > 25)

# 복합 조건
df.filter(
    (pl.col('age') > 25) & (pl.col('salary') > 55000)
)

# 문자열 필터
df.filter(pl.col('name').str.starts_with('A'))

# is_in 사용
df.filter(pl.col('name').is_in(['Alice', 'Bob']))
\`\`\`

## 새 컬럼 추가 (with_columns)

\`\`\`python
# 단일 컬럼 추가
df.with_columns(
    (pl.col('salary') / 12).alias('monthly_salary')
)

# 여러 컬럼 동시 추가
df.with_columns([
    (pl.col('salary') / 12).alias('monthly_salary'),
    (pl.col('age') + 1).alias('next_age'),
    pl.lit('KR').alias('country')  # 리터럴 값
])

# 조건부 컬럼
df.with_columns(
    pl.when(pl.col('age') > 30)
    .then(pl.lit('Senior'))
    .otherwise(pl.lit('Junior'))
    .alias('level')
)
\`\`\`

## select() vs with_columns()

| 메서드 | 결과 |
|--------|------|
| select() | 선택한 컬럼만 반환 |
| with_columns() | 기존 컬럼 + 새 컬럼 |

\`\`\`python
# select: name과 새 컬럼만 반환
df.select([
    pl.col('name'),
    (pl.col('salary') * 1.1).alias('raised_salary')
])

# with_columns: 모든 컬럼 + 새 컬럼
df.with_columns(
    (pl.col('salary') * 1.1).alias('raised_salary')
)
\`\`\`

## 정렬 (sort)

\`\`\`python
# 오름차순
df.sort('age')

# 내림차순
df.sort('age', descending=True)

# 여러 컬럼
df.sort(['age', 'salary'], descending=[True, False])
\`\`\`

## pandas → Polars 마이그레이션

| pandas | Polars |
|--------|--------|
| df['col'] | df.select('col') |
| df[['a', 'b']] | df.select(['a', 'b']) |
| df[df['a'] > 0] | df.filter(pl.col('a') > 0) |
| df['new'] = ... | df.with_columns(...) |
| df.groupby() | df.group_by() |
| df.reset_index() | 불필요 (인덱스 없음) |
      `,
      keyPoints: [
        'select()로 컬럼 선택, with_columns()로 컬럼 추가',
        'pl.col()로 컬럼 참조하는 표현식 생성',
        'filter()로 행 필터링',
        'Polars는 인덱스가 없어 reset_index() 불필요'
      ]
    }
  },

  // Task 3: Polars 실습 (Code)
  {
    id: 'w2d4-task3',
    title: 'Polars 기본 연산 실습',
    type: 'code',
    duration: 20,
    content: {
      objectives: [
        'Polars DataFrame 생성 및 조작',
        '표현식 기반 컬럼 연산',
        '조건부 로직 구현',
        'pandas 코드를 Polars로 변환'
      ],
      starterCode: `import polars as pl
import numpy as np

# ===========================================
# 실습 1: DataFrame 생성
# ===========================================

# 판매 데이터 생성
np.random.seed(42)
n_rows = 10000

# TODO: Polars DataFrame 생성
# - order_id: 1부터 n_rows까지
# - product: ['A', 'B', 'C', 'D'] 중 랜덤 선택
# - quantity: 1~100 사이 정수
# - unit_price: 10.0~1000.0 사이 실수
# - discount: 0.0~0.3 사이 실수

df = None  # TODO: 구현

print("=== DataFrame 생성 ===")
print(df)

# ===========================================
# 실습 2: 컬럼 연산
# ===========================================

# TODO: 다음 컬럼들을 추가하세요
# - total_price: quantity * unit_price
# - discounted_price: total_price * (1 - discount)
# - price_tier: unit_price 기준으로
#   - > 500: 'Premium'
#   - > 200: 'Standard'
#   - else: 'Budget'

df_with_cols = None  # TODO: 구현

print("\\n=== 컬럼 추가 ===")
print(df_with_cols.head())

# ===========================================
# 실습 3: 필터링
# ===========================================

# TODO: 다음 조건으로 필터링
# - product가 'A' 또는 'B'
# - discounted_price > 5000
# - quantity >= 50

df_filtered = None  # TODO: 구현

print("\\n=== 필터링 결과 ===")
print(f"필터링 후 행 수: {len(df_filtered)}")
print(df_filtered.head())

# ===========================================
# 실습 4: 정렬
# ===========================================

# TODO: discounted_price 내림차순, quantity 오름차순으로 정렬

df_sorted = None  # TODO: 구현

print("\\n=== 정렬 결과 ===")
print(df_sorted.head(10))

# ===========================================
# 실습 5: pandas 코드 변환
# ===========================================

# 다음 pandas 코드를 Polars로 변환하세요:
'''
import pandas as pd

# pandas 코드
df_pandas = df_pandas[df_pandas['quantity'] > 30]
df_pandas['revenue'] = df_pandas['quantity'] * df_pandas['unit_price']
df_pandas = df_pandas[['product', 'revenue']]
df_pandas = df_pandas.groupby('product')['revenue'].sum().reset_index()
df_pandas = df_pandas.sort_values('revenue', ascending=False)
'''

# TODO: Polars로 변환
df_result = None  # TODO: 구현

print("\\n=== pandas → Polars 변환 결과 ===")
print(df_result)
`,
      solutionCode: `import polars as pl
import numpy as np

# ===========================================
# 실습 1: DataFrame 생성
# ===========================================

np.random.seed(42)
n_rows = 10000

df = pl.DataFrame({
    'order_id': range(1, n_rows + 1),
    'product': np.random.choice(['A', 'B', 'C', 'D'], n_rows),
    'quantity': np.random.randint(1, 101, n_rows),
    'unit_price': np.random.uniform(10.0, 1000.0, n_rows),
    'discount': np.random.uniform(0.0, 0.3, n_rows)
})

print("=== DataFrame 생성 ===")
print(df)
print(f"\\nShape: {df.shape}")
print(f"Dtypes:\\n{df.dtypes}")

# ===========================================
# 실습 2: 컬럼 연산
# ===========================================

df_with_cols = df.with_columns([
    # total_price: quantity * unit_price
    (pl.col('quantity') * pl.col('unit_price')).alias('total_price'),

    # discounted_price: total_price * (1 - discount)
    (pl.col('quantity') * pl.col('unit_price') * (1 - pl.col('discount'))).alias('discounted_price'),

    # price_tier: 조건부 분류
    pl.when(pl.col('unit_price') > 500)
    .then(pl.lit('Premium'))
    .when(pl.col('unit_price') > 200)
    .then(pl.lit('Standard'))
    .otherwise(pl.lit('Budget'))
    .alias('price_tier')
])

print("\\n=== 컬럼 추가 ===")
print(df_with_cols.head())

# ===========================================
# 실습 3: 필터링
# ===========================================

df_filtered = df_with_cols.filter(
    (pl.col('product').is_in(['A', 'B'])) &
    (pl.col('discounted_price') > 5000) &
    (pl.col('quantity') >= 50)
)

print("\\n=== 필터링 결과 ===")
print(f"필터링 후 행 수: {len(df_filtered)}")
print(df_filtered.head())

# ===========================================
# 실습 4: 정렬
# ===========================================

df_sorted = df_with_cols.sort(
    ['discounted_price', 'quantity'],
    descending=[True, False]
)

print("\\n=== 정렬 결과 ===")
print(df_sorted.head(10))

# ===========================================
# 실습 5: pandas 코드 변환
# ===========================================

# 원본 pandas 코드:
# df_pandas = df_pandas[df_pandas['quantity'] > 30]
# df_pandas['revenue'] = df_pandas['quantity'] * df_pandas['unit_price']
# df_pandas = df_pandas[['product', 'revenue']]
# df_pandas = df_pandas.groupby('product')['revenue'].sum().reset_index()
# df_pandas = df_pandas.sort_values('revenue', ascending=False)

# Polars 변환 (체이닝으로 깔끔하게)
df_result = (
    df
    .filter(pl.col('quantity') > 30)
    .with_columns(
        (pl.col('quantity') * pl.col('unit_price')).alias('revenue')
    )
    .select(['product', 'revenue'])
    .group_by('product')
    .agg(pl.col('revenue').sum())
    .sort('revenue', descending=True)
)

print("\\n=== pandas → Polars 변환 결과 ===")
print(df_result)

# 추가: Lazy 모드로 동일한 쿼리
print("\\n=== Lazy 모드 예시 ===")
df_lazy_result = (
    df.lazy()
    .filter(pl.col('quantity') > 30)
    .with_columns(
        (pl.col('quantity') * pl.col('unit_price')).alias('revenue')
    )
    .select(['product', 'revenue'])
    .group_by('product')
    .agg(pl.col('revenue').sum())
    .sort('revenue', descending=True)
    .collect()  # 여기서 실제 실행
)
print(df_lazy_result)
`,
      instructions: 'Polars의 기본 문법을 실습합니다. DataFrame 생성, 컬럼 연산, 필터링, 정렬을 수행하고, pandas 코드를 Polars로 변환합니다.',
      keyPoints: [
        'pl.DataFrame()으로 DataFrame 생성',
        'with_columns()로 새 컬럼 추가',
        'pl.when().then().otherwise()로 조건부 로직',
        '메서드 체이닝으로 깔끔한 데이터 파이프라인'
      ]
    }
  },

  // Task 4: Lazy Evaluation (Video)
  {
    id: 'w2d4-task4',
    title: 'Lazy Evaluation으로 쿼리 최적화',
    type: 'video',
    duration: 12,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      objectives: [
        'Lazy vs Eager 실행의 차이',
        '쿼리 최적화 원리 이해',
        'LazyFrame 사용법',
        '실행 계획 분석'
      ],
      transcript: `
# Polars Lazy Evaluation

## Eager vs Lazy 실행

### Eager (즉시 실행)
\`\`\`python
# pandas 방식 - 각 줄마다 실행됨
df = df[df['age'] > 25]        # 1. 필터링 실행
df = df[['name', 'salary']]    # 2. 컬럼 선택 실행
df = df.sort_values('salary')  # 3. 정렬 실행
\`\`\`

### Lazy (지연 실행)
\`\`\`python
# Polars Lazy - 마지막에 한번만 실행
result = (
    df.lazy()                           # 쿼리 계획 시작
    .filter(pl.col('age') > 25)         # 계획에 추가
    .select(['name', 'salary'])         # 계획에 추가
    .sort('salary')                     # 계획에 추가
    .collect()                          # 여기서 최적화 후 한번에 실행!
)
\`\`\`

## Lazy의 장점

### 1. 쿼리 최적화
\`\`\`python
# Polars가 자동으로 최적화
lf = (
    df.lazy()
    .select(['a', 'b', 'c', 'd', 'e'])  # 5개 컬럼 선택
    .filter(pl.col('a') > 10)           # a 필터링
    .select(['a', 'b'])                 # 2개만 필요
)

# 최적화 후: 처음부터 a, b만 읽고 필터링!
# Predicate Pushdown + Projection Pushdown
\`\`\`

### 2. 메모리 효율성
\`\`\`python
# 대용량 파일 처리
result = (
    pl.scan_csv('100GB_file.csv')  # 파일 스캔만 (로드 X)
    .filter(pl.col('value') > 100)
    .group_by('category')
    .agg(pl.col('value').sum())
    .collect(streaming=True)        # 청크 단위 처리
)
# 100GB 파일도 4GB 메모리로 처리 가능!
\`\`\`

## LazyFrame 생성

\`\`\`python
# 방법 1: DataFrame을 Lazy로 변환
lf = df.lazy()

# 방법 2: 파일 스캔
lf = pl.scan_csv('data.csv')
lf = pl.scan_parquet('data.parquet')

# 방법 3: 직접 생성
lf = pl.LazyFrame({
    'a': [1, 2, 3],
    'b': [4, 5, 6]
})
\`\`\`

## 실행 계획 분석

\`\`\`python
# 실행 계획 보기
lf = (
    pl.scan_csv('data.csv')
    .filter(pl.col('age') > 25)
    .select(['name', 'age'])
)

# 최적화 전 계획
print(lf.explain())

# 최적화 후 계획
print(lf.explain(optimized=True))
\`\`\`

\`\`\`
# 출력 예시 (최적화 후)
FILTER col("age") > 25
  CSV SCAN data.csv
    PROJECT 2/5 COLUMNS  # 5개 중 2개만 읽음!
\`\`\`

## 최적화 기법

### 1. Predicate Pushdown
- 필터 조건을 데이터 소스 가까이로 이동
- 불필요한 데이터를 일찍 제거

### 2. Projection Pushdown
- 필요한 컬럼만 읽기
- 불필요한 컬럼 로딩 방지

### 3. 쿼리 재정렬
- 비용이 적은 연산 먼저 실행
- 데이터 크기를 최대한 빨리 줄임

### 4. 공통 부분식 제거
- 중복 계산 제거
- 캐싱 활용
      `,
      keyPoints: [
        'Lazy는 collect() 호출 시점에 모든 연산 실행',
        '쿼리 최적화로 불필요한 데이터 로딩 방지',
        'scan_csv/scan_parquet로 대용량 파일 효율적 처리',
        'explain()으로 실행 계획 분석 가능'
      ]
    }
  },

  // Task 5: Group By & Aggregation (Reading)
  {
    id: 'w2d4-task5',
    title: 'Polars 집계 연산 마스터',
    type: 'reading',
    duration: 12,
    content: {
      objectives: [
        'group_by() 사용법',
        '다양한 집계 함수 활용',
        '윈도우 함수 이해',
        'pandas groupby와 비교'
      ],
      markdown: `
# Polars 집계 연산 마스터

## 기본 group_by

\`\`\`python
import polars as pl

df = pl.DataFrame({
    'category': ['A', 'A', 'B', 'B', 'C'],
    'product': ['p1', 'p2', 'p1', 'p2', 'p1'],
    'sales': [100, 150, 200, 120, 80]
})

# 기본 집계
result = df.group_by('category').agg(
    pl.col('sales').sum()
)
\`\`\`

## 다중 집계

\`\`\`python
# 여러 집계를 동시에
result = df.group_by('category').agg([
    pl.col('sales').sum().alias('total_sales'),
    pl.col('sales').mean().alias('avg_sales'),
    pl.col('sales').max().alias('max_sales'),
    pl.col('sales').min().alias('min_sales'),
    pl.col('sales').count().alias('count')
])
\`\`\`

## 다중 컬럼 그룹화

\`\`\`python
result = df.group_by(['category', 'product']).agg([
    pl.col('sales').sum().alias('total'),
    pl.col('sales').count().alias('count')
])
\`\`\`

## 집계 함수 목록

\`\`\`python
pl.col('x').sum()        # 합계
pl.col('x').mean()       # 평균
pl.col('x').median()     # 중앙값
pl.col('x').std()        # 표준편차
pl.col('x').var()        # 분산
pl.col('x').min()        # 최솟값
pl.col('x').max()        # 최댓값
pl.col('x').first()      # 첫 번째 값
pl.col('x').last()       # 마지막 값
pl.col('x').count()      # 개수
pl.col('x').n_unique()   # 고유값 개수
pl.col('x').quantile(0.5) # 분위수
\`\`\`

## 조건부 집계

\`\`\`python
result = df.group_by('category').agg([
    # 전체 합계
    pl.col('sales').sum().alias('total'),

    # 조건부 합계 (sales > 100인 것만)
    pl.col('sales').filter(pl.col('sales') > 100).sum().alias('high_sales'),

    # 조건부 카운트
    pl.col('sales').filter(pl.col('sales') > 100).count().alias('high_count')
])
\`\`\`

## 윈도우 함수 (Window Functions)

SQL의 윈도우 함수와 유사합니다.

\`\`\`python
# 그룹별 순위
df.with_columns(
    pl.col('sales').rank().over('category').alias('rank_in_category')
)

# 그룹별 누적합
df.with_columns(
    pl.col('sales').cum_sum().over('category').alias('cumsum')
)

# 그룹별 이동평균
df.with_columns(
    pl.col('sales').rolling_mean(window_size=2).over('category').alias('rolling_avg')
)

# 그룹별 shift
df.with_columns(
    pl.col('sales').shift(1).over('category').alias('prev_sales')
)
\`\`\`

## pandas groupby vs Polars group_by

| 기능 | pandas | Polars |
|------|--------|--------|
| 기본 문법 | df.groupby('col') | df.group_by('col') |
| 집계 | .agg({'col': 'sum'}) | .agg(pl.col('col').sum()) |
| 결과 형태 | 인덱스 포함 | 일반 DataFrame |
| 멀티 집계 | 딕셔너리/리스트 | 표현식 리스트 |
| 정렬 | 자동 정렬 | 정렬 없음 (maintain_order=True로 설정 가능) |

\`\`\`python
# pandas
df_pd.groupby('category').agg({'sales': ['sum', 'mean']})

# Polars
df.group_by('category').agg([
    pl.col('sales').sum().alias('sales_sum'),
    pl.col('sales').mean().alias('sales_mean')
])
\`\`\`
      `,
      keyPoints: [
        'group_by().agg()로 집계 수행',
        '표현식으로 다양한 집계 함수 조합 가능',
        'over()로 윈도우 함수 구현',
        'pandas와 달리 결과에 인덱스 없음'
      ]
    }
  },

  // Task 6: 성능 비교 실습 (Code)
  {
    id: 'w2d4-task6',
    title: 'pandas vs Polars 성능 비교',
    type: 'code',
    duration: 20,
    content: {
      objectives: [
        '동일 작업의 pandas/Polars 성능 비교',
        '대용량 데이터에서의 차이 체험',
        'Lazy Evaluation 효과 측정',
        '실무 적용 판단 기준 확립'
      ],
      starterCode: `import pandas as pd
import polars as pl
import numpy as np
import time

# 테스트 데이터 생성
np.random.seed(42)
n_rows = 1_000_000  # 100만 행

print(f"테스트 데이터 크기: {n_rows:,} 행")

# pandas DataFrame
data = {
    'category': np.random.choice(['A', 'B', 'C', 'D', 'E'], n_rows),
    'sub_category': np.random.choice(['X', 'Y', 'Z'], n_rows),
    'value1': np.random.randn(n_rows),
    'value2': np.random.randn(n_rows) * 100,
    'quantity': np.random.randint(1, 100, n_rows),
    'price': np.random.uniform(10, 1000, n_rows)
}

df_pandas = pd.DataFrame(data)
df_polars = pl.DataFrame(data)

print(f"pandas 메모리: {df_pandas.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
print(f"Polars 메모리: {df_polars.estimated_size() / 1024**2:.2f} MB")

# ===========================================
# 벤치마크 1: 필터링
# ===========================================

def benchmark_filter():
    """필터링 성능 비교"""
    # TODO: pandas 필터링
    # 조건: (category == 'A') & (value1 > 0) & (quantity >= 50)

    # TODO: Polars 필터링

    # TODO: 시간 측정 및 비교
    pass

# ===========================================
# 벤치마크 2: 컬럼 연산
# ===========================================

def benchmark_column_ops():
    """컬럼 연산 성능 비교"""
    # TODO: pandas로 새 컬럼 생성
    # - total = quantity * price
    # - adjusted = value1 * value2
    # - ratio = total / adjusted (adjusted != 0 조건)

    # TODO: Polars로 동일한 연산

    # TODO: 시간 측정 및 비교
    pass

# ===========================================
# 벤치마크 3: 그룹 집계
# ===========================================

def benchmark_groupby():
    """그룹 집계 성능 비교"""
    # TODO: pandas groupby
    # category, sub_category별로:
    # - value1 합계, 평균
    # - quantity 합계
    # - price 평균

    # TODO: Polars group_by

    # TODO: 시간 측정 및 비교
    pass

# ===========================================
# 벤치마크 4: 복합 파이프라인
# ===========================================

def benchmark_pipeline():
    """복합 파이프라인 성능 비교"""
    # TODO: 아래 파이프라인을 pandas와 Polars로 구현
    # 1. quantity > 30 필터링
    # 2. 새 컬럼 revenue = quantity * price 추가
    # 3. category, sub_category 그룹별 revenue 합계
    # 4. revenue 내림차순 정렬
    # 5. 상위 10개 반환

    # TODO: Polars Lazy 모드로도 테스트
    pass

# ===========================================
# 결과 요약
# ===========================================

def run_all_benchmarks():
    """모든 벤치마크 실행"""
    print("\\n" + "=" * 50)
    print("pandas vs Polars 성능 비교")
    print("=" * 50)

    # TODO: 모든 벤치마크 실행 및 결과 정리

    print("\\n벤치마크 완료!")

# 실행
if __name__ == "__main__":
    run_all_benchmarks()
`,
      solutionCode: `import pandas as pd
import polars as pl
import numpy as np
import time

# 테스트 데이터 생성
np.random.seed(42)
n_rows = 1_000_000  # 100만 행

print(f"테스트 데이터 크기: {n_rows:,} 행")

data = {
    'category': np.random.choice(['A', 'B', 'C', 'D', 'E'], n_rows),
    'sub_category': np.random.choice(['X', 'Y', 'Z'], n_rows),
    'value1': np.random.randn(n_rows),
    'value2': np.random.randn(n_rows) * 100,
    'quantity': np.random.randint(1, 100, n_rows),
    'price': np.random.uniform(10, 1000, n_rows)
}

df_pandas = pd.DataFrame(data)
df_polars = pl.DataFrame(data)

print(f"pandas 메모리: {df_pandas.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
print(f"Polars 메모리: {df_polars.estimated_size() / 1024**2:.2f} MB")

# ===========================================
# 벤치마크 1: 필터링
# ===========================================

def benchmark_filter():
    """필터링 성능 비교"""
    results = {}

    # pandas
    start = time.time()
    result_pd = df_pandas[
        (df_pandas['category'] == 'A') &
        (df_pandas['value1'] > 0) &
        (df_pandas['quantity'] >= 50)
    ]
    results['pandas'] = time.time() - start

    # Polars
    start = time.time()
    result_pl = df_polars.filter(
        (pl.col('category') == 'A') &
        (pl.col('value1') > 0) &
        (pl.col('quantity') >= 50)
    )
    results['polars'] = time.time() - start

    print("\\n[벤치마크 1: 필터링]")
    print(f"  pandas: {results['pandas']:.4f}초 ({len(result_pd):,} 행)")
    print(f"  Polars: {results['polars']:.4f}초 ({len(result_pl):,} 행)")
    print(f"  속도 향상: {results['pandas']/results['polars']:.1f}배")

    return results

# ===========================================
# 벤치마크 2: 컬럼 연산
# ===========================================

def benchmark_column_ops():
    """컬럼 연산 성능 비교"""
    results = {}

    # pandas
    start = time.time()
    df_pd = df_pandas.copy()
    df_pd['total'] = df_pd['quantity'] * df_pd['price']
    df_pd['adjusted'] = df_pd['value1'] * df_pd['value2']
    df_pd['ratio'] = np.where(df_pd['adjusted'] != 0,
                               df_pd['total'] / df_pd['adjusted'], 0)
    results['pandas'] = time.time() - start

    # Polars
    start = time.time()
    df_pl = df_polars.with_columns([
        (pl.col('quantity') * pl.col('price')).alias('total'),
        (pl.col('value1') * pl.col('value2')).alias('adjusted'),
        pl.when(pl.col('value1') * pl.col('value2') != 0)
        .then(
            (pl.col('quantity') * pl.col('price')) /
            (pl.col('value1') * pl.col('value2'))
        )
        .otherwise(0)
        .alias('ratio')
    ])
    results['polars'] = time.time() - start

    print("\\n[벤치마크 2: 컬럼 연산]")
    print(f"  pandas: {results['pandas']:.4f}초")
    print(f"  Polars: {results['polars']:.4f}초")
    print(f"  속도 향상: {results['pandas']/results['polars']:.1f}배")

    return results

# ===========================================
# 벤치마크 3: 그룹 집계
# ===========================================

def benchmark_groupby():
    """그룹 집계 성능 비교"""
    results = {}

    # pandas
    start = time.time()
    result_pd = df_pandas.groupby(['category', 'sub_category']).agg({
        'value1': ['sum', 'mean'],
        'quantity': 'sum',
        'price': 'mean'
    }).reset_index()
    results['pandas'] = time.time() - start

    # Polars
    start = time.time()
    result_pl = df_polars.group_by(['category', 'sub_category']).agg([
        pl.col('value1').sum().alias('value1_sum'),
        pl.col('value1').mean().alias('value1_mean'),
        pl.col('quantity').sum().alias('quantity_sum'),
        pl.col('price').mean().alias('price_mean')
    ])
    results['polars'] = time.time() - start

    print("\\n[벤치마크 3: 그룹 집계]")
    print(f"  pandas: {results['pandas']:.4f}초")
    print(f"  Polars: {results['polars']:.4f}초")
    print(f"  속도 향상: {results['pandas']/results['polars']:.1f}배")

    return results

# ===========================================
# 벤치마크 4: 복합 파이프라인
# ===========================================

def benchmark_pipeline():
    """복합 파이프라인 성능 비교"""
    results = {}

    # pandas
    start = time.time()
    result_pd = (
        df_pandas[df_pandas['quantity'] > 30]
        .assign(revenue=lambda x: x['quantity'] * x['price'])
        .groupby(['category', 'sub_category'])['revenue']
        .sum()
        .reset_index()
        .sort_values('revenue', ascending=False)
        .head(10)
    )
    results['pandas'] = time.time() - start

    # Polars Eager
    start = time.time()
    result_pl = (
        df_polars
        .filter(pl.col('quantity') > 30)
        .with_columns(
            (pl.col('quantity') * pl.col('price')).alias('revenue')
        )
        .group_by(['category', 'sub_category'])
        .agg(pl.col('revenue').sum())
        .sort('revenue', descending=True)
        .head(10)
    )
    results['polars_eager'] = time.time() - start

    # Polars Lazy
    start = time.time()
    result_lazy = (
        df_polars.lazy()
        .filter(pl.col('quantity') > 30)
        .with_columns(
            (pl.col('quantity') * pl.col('price')).alias('revenue')
        )
        .group_by(['category', 'sub_category'])
        .agg(pl.col('revenue').sum())
        .sort('revenue', descending=True)
        .head(10)
        .collect()
    )
    results['polars_lazy'] = time.time() - start

    print("\\n[벤치마크 4: 복합 파이프라인]")
    print(f"  pandas:       {results['pandas']:.4f}초")
    print(f"  Polars Eager: {results['polars_eager']:.4f}초")
    print(f"  Polars Lazy:  {results['polars_lazy']:.4f}초")
    print(f"  속도 향상 (Eager): {results['pandas']/results['polars_eager']:.1f}배")
    print(f"  속도 향상 (Lazy):  {results['pandas']/results['polars_lazy']:.1f}배")

    return results

# ===========================================
# 결과 요약
# ===========================================

def run_all_benchmarks():
    """모든 벤치마크 실행"""
    print("\\n" + "=" * 50)
    print("pandas vs Polars 성능 비교")
    print("=" * 50)

    r1 = benchmark_filter()
    r2 = benchmark_column_ops()
    r3 = benchmark_groupby()
    r4 = benchmark_pipeline()

    # 평균 속도 향상
    avg_speedup = np.mean([
        r1['pandas']/r1['polars'],
        r2['pandas']/r2['polars'],
        r3['pandas']/r3['polars'],
        r4['pandas']/r4['polars_lazy']
    ])

    print("\\n" + "=" * 50)
    print(f"평균 속도 향상: {avg_speedup:.1f}배")
    print("=" * 50)

if __name__ == "__main__":
    run_all_benchmarks()
`,
      instructions: 'pandas와 Polars의 성능을 직접 비교합니다. 필터링, 컬럼 연산, 그룹 집계, 복합 파이프라인에서의 성능 차이를 측정합니다.',
      keyPoints: [
        'Polars는 대용량 데이터에서 pandas 대비 5-20배 빠름',
        'Lazy 모드가 Eager 모드보다 더 빠른 경우가 많음',
        '메모리 사용량도 Polars가 더 효율적',
        '체이닝 구문이 더 깔끔하고 최적화에 유리'
      ]
    }
  },

  // Task 7: pandas-Polars 상호운용 (Reading)
  {
    id: 'w2d4-task7',
    title: 'pandas-Polars 상호운용성',
    type: 'reading',
    duration: 10,
    content: {
      objectives: [
        'pandas ↔ Polars 변환 방법',
        '기존 pandas 코드 점진적 마이그레이션',
        'NumPy 배열과의 호환성',
        '파일 I/O 호환성'
      ],
      markdown: `
# pandas-Polars 상호운용성

실무에서는 기존 pandas 코드와 함께 Polars를 사용하는 경우가 많습니다.

## DataFrame 변환

### pandas → Polars
\`\`\`python
import pandas as pd
import polars as pl

# pandas DataFrame
df_pandas = pd.DataFrame({
    'a': [1, 2, 3],
    'b': ['x', 'y', 'z']
})

# Polars로 변환
df_polars = pl.from_pandas(df_pandas)

# 또는
df_polars = pl.DataFrame(df_pandas)
\`\`\`

### Polars → pandas
\`\`\`python
# Polars DataFrame
df_polars = pl.DataFrame({
    'a': [1, 2, 3],
    'b': ['x', 'y', 'z']
})

# pandas로 변환
df_pandas = df_polars.to_pandas()
\`\`\`

## Series 변환

\`\`\`python
# pandas Series → Polars Series
s_pandas = pd.Series([1, 2, 3], name='numbers')
s_polars = pl.from_pandas(s_pandas)

# Polars Series → pandas Series
s_pandas = s_polars.to_pandas()
\`\`\`

## NumPy 배열 호환

\`\`\`python
import numpy as np

# NumPy → Polars
arr = np.array([1, 2, 3, 4, 5])
s_polars = pl.Series('values', arr)

# Polars → NumPy
arr = s_polars.to_numpy()

# DataFrame 전체를 NumPy로
arr_2d = df_polars.to_numpy()
\`\`\`

## 파일 I/O 호환

Polars와 pandas 모두 동일한 파일 형식을 지원합니다.

### CSV
\`\`\`python
# pandas 작성 → Polars 읽기
df_pandas.to_csv('data.csv', index=False)
df_polars = pl.read_csv('data.csv')

# Polars 작성 → pandas 읽기
df_polars.write_csv('data.csv')
df_pandas = pd.read_csv('data.csv')
\`\`\`

### Parquet (권장)
\`\`\`python
# pandas 작성 → Polars 읽기
df_pandas.to_parquet('data.parquet')
df_polars = pl.read_parquet('data.parquet')

# Polars 작성 → pandas 읽기
df_polars.write_parquet('data.parquet')
df_pandas = pd.read_parquet('data.parquet')
\`\`\`

## 점진적 마이그레이션 전략

### 1. 병목 지점부터 시작
\`\`\`python
# 기존 pandas 코드
def process_data(df_pandas):
    # 전처리 (pandas 유지)
    df = df_pandas.dropna()

    # 무거운 집계 (Polars로 전환)
    df_polars = pl.from_pandas(df)
    result_polars = (
        df_polars
        .group_by('category')
        .agg(pl.col('value').sum())
    )
    result_pandas = result_polars.to_pandas()

    # 후처리 (pandas 유지)
    return result_pandas.merge(other_df, on='category')
\`\`\`

### 2. 새 기능은 Polars로
\`\`\`python
# 기존 코드: pandas 유지
# 새 기능: Polars로 작성
# 인터페이스: pandas DataFrame 입출력
def new_feature(df_pandas):
    df = pl.from_pandas(df_pandas)
    # Polars 로직...
    return result.to_pandas()
\`\`\`

### 3. 테스트 추가 후 전환
\`\`\`python
def test_equivalence():
    # pandas 결과
    result_pd = pandas_function(df)

    # Polars 결과
    result_pl = polars_function(pl.from_pandas(df)).to_pandas()

    # 결과 비교
    pd.testing.assert_frame_equal(result_pd, result_pl)
\`\`\`

## 주의사항

### 타입 차이
| pandas | Polars | 비고 |
|--------|--------|------|
| object | Utf8 | 문자열 |
| datetime64[ns] | Datetime | 시간대 처리 다름 |
| category | Categorical | 거의 동일 |
| Int64 (nullable) | Int64 | Polars는 기본 nullable |

### 인덱스
\`\`\`python
# pandas 인덱스는 변환 시 사라짐
df_pandas = df_pandas.reset_index()  # 인덱스를 컬럼으로 변환
df_polars = pl.from_pandas(df_pandas)
\`\`\`
      `,
      keyPoints: [
        'pl.from_pandas(), to_pandas()로 쉽게 변환',
        'Parquet 형식으로 파일 호환성 확보',
        '병목 지점부터 점진적 마이그레이션',
        'pandas 인덱스는 reset_index() 후 변환'
      ]
    }
  },

  // Task 8: Polars 종합 퀴즈
  {
    id: 'w2d4-task8',
    title: 'Polars 종합 퀴즈',
    type: 'quiz',
    duration: 8,
    content: {
      objectives: [
        'Polars 핵심 개념 점검',
        'pandas-Polars 차이 이해 확인',
        'Lazy Evaluation 이해 확인',
        '실무 적용 판단력 점검'
      ],
      questions: [
        {
          question: 'Polars가 pandas보다 빠른 주된 이유는?',
          options: [
            'Python으로 작성되어 최적화가 잘 됨',
            'Rust로 작성되어 GIL 제약이 없고 멀티스레드 지원',
            '더 적은 기능을 제공하여 단순함',
            '클라우드 컴퓨팅에 최적화됨'
          ],
          answer: 1,
          explanation: 'Polars는 Rust로 작성되어 Python의 GIL 제약이 없고, 기본적으로 멀티스레드를 활용합니다. 또한 SIMD 벡터화와 쿼리 최적화를 통해 높은 성능을 달성합니다.'
        },
        {
          question: 'Polars에서 새 컬럼을 추가하면서 기존 컬럼을 유지하려면?',
          options: [
            'df.select()',
            'df.with_columns()',
            'df.filter()',
            'df.append()'
          ],
          answer: 1,
          explanation: 'with_columns()는 기존 DataFrame에 새 컬럼을 추가하고 기존 컬럼은 그대로 유지합니다. select()는 명시한 컬럼만 반환합니다.'
        },
        {
          question: 'Polars Lazy Evaluation의 장점이 아닌 것은?',
          options: [
            '쿼리 자동 최적화',
            '불필요한 컬럼 로딩 방지',
            '즉시 결과 확인 가능',
            '메모리 효율적 처리'
          ],
          answer: 2,
          explanation: 'Lazy Evaluation은 collect()를 호출해야 실제 결과를 볼 수 있습니다. 즉시 결과 확인이 필요하면 Eager 모드(기본)를 사용해야 합니다.'
        },
        {
          question: 'pandas DataFrame을 Polars로 변환할 때 주의할 점은?',
          options: [
            '컬럼명이 모두 대문자로 변환됨',
            'pandas 인덱스가 사라짐',
            '문자열이 숫자로 변환됨',
            '모든 값이 nullable로 변환됨'
          ],
          answer: 1,
          explanation: 'Polars는 인덱스 개념이 없으므로 pandas의 인덱스는 변환 시 사라집니다. 인덱스를 보존하려면 reset_index()로 컬럼으로 변환 후 진행해야 합니다.'
        },
        {
          question: 'Polars group_by()에서 집계 결과 컬럼명을 지정하려면?',
          options: [
            '.rename() 메서드 사용',
            '.alias() 메서드 사용',
            '.name() 메서드 사용',
            '자동으로 지정됨'
          ],
          answer: 1,
          explanation: 'Polars에서는 pl.col("x").sum().alias("total_x")처럼 alias() 메서드로 결과 컬럼명을 지정합니다.'
        }
      ]
    }
  },

  // Task 9: 데일리 챌린지
  {
    id: 'w2d4-task9',
    title: '🔥 Daily Challenge: pandas-Polars 듀얼 파이프라인',
    type: 'code',
    duration: 20,
    content: {
      objectives: [
        'pandas/Polars 모두 지원하는 추상화 레이어 설계',
        '자동 백엔드 선택 로직 구현',
        '성능 벤치마킹 내장',
        '실무 적용 가능한 유틸리티 개발'
      ],
      starterCode: `import pandas as pd
import polars as pl
import numpy as np
from typing import Union, Optional, Literal
from abc import ABC, abstractmethod
import time

# 타입 정의
DataFrameType = Union[pd.DataFrame, pl.DataFrame]
Backend = Literal['pandas', 'polars', 'auto']

class DataPipeline(ABC):
    """
    pandas/Polars 듀얼 백엔드 데이터 파이프라인

    사용법:
        pipeline = SmartPipeline(df, backend='auto')
        result = (
            pipeline
            .filter('age > 25')
            .add_column('salary_monthly', 'salary / 12')
            .group_by('department')
            .aggregate({'salary': 'mean', 'age': 'max'})
            .sort('salary', descending=True)
            .execute()
        )
    """

    @abstractmethod
    def filter(self, condition: str) -> 'DataPipeline':
        """조건으로 필터링"""
        pass

    @abstractmethod
    def add_column(self, name: str, expression: str) -> 'DataPipeline':
        """새 컬럼 추가"""
        pass

    @abstractmethod
    def group_by(self, columns: Union[str, list]) -> 'DataPipeline':
        """그룹화"""
        pass

    @abstractmethod
    def aggregate(self, agg_dict: dict) -> 'DataPipeline':
        """집계"""
        pass

    @abstractmethod
    def sort(self, column: str, descending: bool = False) -> 'DataPipeline':
        """정렬"""
        pass

    @abstractmethod
    def execute(self) -> DataFrameType:
        """파이프라인 실행"""
        pass

class SmartPipeline(DataPipeline):
    """자동 백엔드 선택 파이프라인"""

    def __init__(self, df: DataFrameType, backend: Backend = 'auto'):
        self.original_df = df
        self.backend = self._select_backend(df, backend)
        self.operations = []
        self.benchmark_results = {}

    def _select_backend(self, df: DataFrameType, backend: Backend) -> str:
        """백엔드 자동 선택"""
        if backend != 'auto':
            return backend

        # TODO: 데이터 크기 기반 자동 선택
        # - 10만 행 미만: pandas (오버헤드 적음)
        # - 10만 행 이상: polars (성능 이점)
        pass

    def filter(self, condition: str) -> 'SmartPipeline':
        """조건으로 필터링"""
        # TODO: 구현
        pass

    def add_column(self, name: str, expression: str) -> 'SmartPipeline':
        """새 컬럼 추가"""
        # TODO: 구현
        pass

    def group_by(self, columns: Union[str, list]) -> 'SmartPipeline':
        """그룹화"""
        # TODO: 구현
        pass

    def aggregate(self, agg_dict: dict) -> 'SmartPipeline':
        """집계"""
        # TODO: 구현
        pass

    def sort(self, column: str, descending: bool = False) -> 'SmartPipeline':
        """정렬"""
        # TODO: 구현
        pass

    def execute(self) -> DataFrameType:
        """파이프라인 실행 및 벤치마킹"""
        # TODO: 구현
        pass

    def compare_backends(self) -> dict:
        """pandas/Polars 성능 비교"""
        # TODO: 구현
        pass

# ===========================================
# 테스트
# ===========================================

np.random.seed(42)
n_rows = 100_000

df = pd.DataFrame({
    'department': np.random.choice(['Sales', 'Engineering', 'Marketing', 'HR'], n_rows),
    'age': np.random.randint(22, 60, n_rows),
    'salary': np.random.randint(40000, 150000, n_rows),
    'years_exp': np.random.randint(0, 30, n_rows)
})

print(f"테스트 데이터: {len(df):,} 행")

# 테스트 실행
if __name__ == "__main__":
    # 파이프라인 테스트
    pipeline = SmartPipeline(df, backend='auto')

    result = (
        pipeline
        .filter('age > 30')
        .add_column('salary_monthly', 'salary / 12')
        .group_by('department')
        .aggregate({'salary': 'mean', 'years_exp': 'max'})
        .sort('salary', descending=True)
        .execute()
    )

    print("\\n결과:")
    print(result)

    # 백엔드 비교
    print("\\n백엔드 성능 비교:")
    print(pipeline.compare_backends())
`,
      solutionCode: `import pandas as pd
import polars as pl
import numpy as np
from typing import Union, Optional, Literal, List, Dict, Any
from abc import ABC, abstractmethod
import time
import re

DataFrameType = Union[pd.DataFrame, pl.DataFrame]
Backend = Literal['pandas', 'polars', 'auto']

class DataPipeline(ABC):
    @abstractmethod
    def filter(self, condition: str) -> 'DataPipeline': pass
    @abstractmethod
    def add_column(self, name: str, expression: str) -> 'DataPipeline': pass
    @abstractmethod
    def group_by(self, columns: Union[str, list]) -> 'DataPipeline': pass
    @abstractmethod
    def aggregate(self, agg_dict: dict) -> 'DataPipeline': pass
    @abstractmethod
    def sort(self, column: str, descending: bool = False) -> 'DataPipeline': pass
    @abstractmethod
    def execute(self) -> DataFrameType: pass

class SmartPipeline(DataPipeline):
    """자동 백엔드 선택 파이프라인"""

    def __init__(self, df: DataFrameType, backend: Backend = 'auto'):
        self.original_df = df
        self.backend = self._select_backend(df, backend)
        self.operations: List[Dict[str, Any]] = []
        self.benchmark_results = {}
        self._group_cols = None

    def _select_backend(self, df: DataFrameType, backend: Backend) -> str:
        if backend != 'auto':
            return backend

        n_rows = len(df) if isinstance(df, (pd.DataFrame, pl.DataFrame)) else 0
        return 'polars' if n_rows >= 100_000 else 'pandas'

    def _to_backend_df(self, df: DataFrameType, target: str) -> DataFrameType:
        """DataFrame을 지정된 백엔드로 변환"""
        if target == 'polars':
            if isinstance(df, pd.DataFrame):
                return pl.from_pandas(df)
            return df
        else:  # pandas
            if isinstance(df, pl.DataFrame):
                return df.to_pandas()
            return df

    def filter(self, condition: str) -> 'SmartPipeline':
        self.operations.append({'type': 'filter', 'condition': condition})
        return self

    def add_column(self, name: str, expression: str) -> 'SmartPipeline':
        self.operations.append({'type': 'add_column', 'name': name, 'expression': expression})
        return self

    def group_by(self, columns: Union[str, list]) -> 'SmartPipeline':
        if isinstance(columns, str):
            columns = [columns]
        self._group_cols = columns
        self.operations.append({'type': 'group_by', 'columns': columns})
        return self

    def aggregate(self, agg_dict: dict) -> 'SmartPipeline':
        self.operations.append({'type': 'aggregate', 'agg_dict': agg_dict})
        return self

    def sort(self, column: str, descending: bool = False) -> 'SmartPipeline':
        self.operations.append({'type': 'sort', 'column': column, 'descending': descending})
        return self

    def _execute_pandas(self, df: pd.DataFrame) -> pd.DataFrame:
        """pandas 백엔드로 실행"""
        for op in self.operations:
            if op['type'] == 'filter':
                df = df.query(op['condition'])
            elif op['type'] == 'add_column':
                df = df.assign(**{op['name']: df.eval(op['expression'])})
            elif op['type'] == 'group_by':
                pass  # aggregate에서 처리
            elif op['type'] == 'aggregate':
                if self._group_cols:
                    df = df.groupby(self._group_cols).agg(op['agg_dict']).reset_index()
            elif op['type'] == 'sort':
                df = df.sort_values(op['column'], ascending=not op['descending'])
        return df

    def _execute_polars(self, df: pl.DataFrame) -> pl.DataFrame:
        """Polars 백엔드로 실행"""
        lf = df.lazy()

        for op in self.operations:
            if op['type'] == 'filter':
                # 간단한 조건 파싱 (실제로는 더 정교한 파서 필요)
                cond = op['condition']
                # 'col > value' 형태 파싱
                match = re.match(r'(\w+)\s*([><=!]+)\s*(\d+)', cond)
                if match:
                    col, operator, value = match.groups()
                    value = int(value)
                    if operator == '>':
                        lf = lf.filter(pl.col(col) > value)
                    elif operator == '<':
                        lf = lf.filter(pl.col(col) < value)
                    elif operator == '>=':
                        lf = lf.filter(pl.col(col) >= value)
                    elif operator == '<=':
                        lf = lf.filter(pl.col(col) <= value)
                    elif operator == '==':
                        lf = lf.filter(pl.col(col) == value)

            elif op['type'] == 'add_column':
                # 간단한 표현식 파싱
                expr = op['expression']
                name = op['name']
                # 'col / value' 형태 파싱
                match = re.match(r'(\w+)\s*([/+\-*])\s*(\d+)', expr)
                if match:
                    col, operator, value = match.groups()
                    value = int(value)
                    if operator == '/':
                        lf = lf.with_columns((pl.col(col) / value).alias(name))
                    elif operator == '*':
                        lf = lf.with_columns((pl.col(col) * value).alias(name))
                    elif operator == '+':
                        lf = lf.with_columns((pl.col(col) + value).alias(name))
                    elif operator == '-':
                        lf = lf.with_columns((pl.col(col) - value).alias(name))

            elif op['type'] == 'group_by':
                pass  # aggregate에서 처리

            elif op['type'] == 'aggregate':
                if self._group_cols:
                    agg_exprs = []
                    for col, func in op['agg_dict'].items():
                        if func == 'mean':
                            agg_exprs.append(pl.col(col).mean().alias(col))
                        elif func == 'sum':
                            agg_exprs.append(pl.col(col).sum().alias(col))
                        elif func == 'max':
                            agg_exprs.append(pl.col(col).max().alias(col))
                        elif func == 'min':
                            agg_exprs.append(pl.col(col).min().alias(col))
                        elif func == 'count':
                            agg_exprs.append(pl.col(col).count().alias(col))
                    lf = lf.group_by(self._group_cols).agg(agg_exprs)

            elif op['type'] == 'sort':
                lf = lf.sort(op['column'], descending=op['descending'])

        return lf.collect()

    def execute(self) -> DataFrameType:
        """파이프라인 실행"""
        start = time.time()

        if self.backend == 'polars':
            df = self._to_backend_df(self.original_df, 'polars')
            result = self._execute_polars(df)
        else:
            df = self._to_backend_df(self.original_df, 'pandas')
            result = self._execute_pandas(df)

        self.benchmark_results[self.backend] = time.time() - start
        return result

    def compare_backends(self) -> dict:
        """pandas/Polars 성능 비교"""
        results = {}

        # pandas 실행
        df_pd = self._to_backend_df(self.original_df, 'pandas')
        start = time.time()
        _ = self._execute_pandas(df_pd.copy())
        results['pandas'] = time.time() - start

        # Polars 실행
        df_pl = self._to_backend_df(self.original_df, 'polars')
        start = time.time()
        _ = self._execute_polars(df_pl)
        results['polars'] = time.time() - start

        results['speedup'] = results['pandas'] / results['polars'] if results['polars'] > 0 else float('inf')
        results['recommended'] = 'polars' if results['speedup'] > 1.5 else 'pandas'

        return results

# ===========================================
# 테스트
# ===========================================

np.random.seed(42)
n_rows = 100_000

df = pd.DataFrame({
    'department': np.random.choice(['Sales', 'Engineering', 'Marketing', 'HR'], n_rows),
    'age': np.random.randint(22, 60, n_rows),
    'salary': np.random.randint(40000, 150000, n_rows),
    'years_exp': np.random.randint(0, 30, n_rows)
})

print(f"테스트 데이터: {len(df):,} 행")

if __name__ == "__main__":
    # 파이프라인 테스트
    pipeline = SmartPipeline(df, backend='auto')
    print(f"선택된 백엔드: {pipeline.backend}")

    result = (
        pipeline
        .filter('age > 30')
        .add_column('salary_monthly', 'salary / 12')
        .group_by('department')
        .aggregate({'salary': 'mean', 'years_exp': 'max'})
        .sort('salary', descending=True)
        .execute()
    )

    print("\\n결과:")
    print(result)

    # 백엔드 비교
    comparison = SmartPipeline(df).compare_backends()
    print("\\n=== 백엔드 성능 비교 ===")
    print(f"pandas: {comparison['pandas']:.4f}초")
    print(f"Polars: {comparison['polars']:.4f}초")
    print(f"속도 향상: {comparison['speedup']:.2f}배")
    print(f"권장 백엔드: {comparison['recommended']}")
`,
      instructions: 'pandas와 Polars 모두를 지원하는 통합 파이프라인 클래스를 구현합니다. 데이터 크기에 따라 자동으로 최적의 백엔드를 선택하고, 성능 비교 기능도 제공합니다.',
      keyPoints: [
        '추상화 레이어로 백엔드 독립적 API 제공',
        '데이터 크기 기반 자동 백엔드 선택',
        '문자열 표현식을 각 백엔드 API로 변환',
        '벤치마킹으로 최적 백엔드 추천'
      ]
    }
  }
]
