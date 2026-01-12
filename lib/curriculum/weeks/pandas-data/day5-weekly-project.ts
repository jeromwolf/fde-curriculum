// Day 5: Weekly Project - NYC Taxi 데이터 분석
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  // Task 1: 프로젝트 소개 (Video)
  {
    id: 'w2d5-task1',
    title: '🚕 Weekly Project: NYC Taxi 데이터 분석',
    type: 'video',
    duration: 10,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      objectives: [
        '프로젝트 목표와 데이터셋 이해',
        '분석 요구사항 파악',
        '기술적 제약 조건 이해',
        '평가 기준 확인'
      ],
      transcript: `
# Weekly Project: NYC Taxi 데이터 분석 파이프라인

이번 주차 프로젝트에서는 **NYC Taxi 데이터**를 활용하여 대용량 데이터 처리 기술을 종합적으로 적용합니다.

## 프로젝트 목표

1. **대용량 데이터 처리 능력** 검증
   - 1GB+ 데이터셋 처리
   - 메모리 효율적 로딩
   - 성능 최적화

2. **비즈니스 인사이트 도출**
   - 시간대별 수요 패턴
   - 지역별 요금 분석
   - 팁 예측 요인 분석

3. **기술 종합 활용**
   - pandas/Polars 비교
   - 메모리 최적화
   - 벡터화 연산

## 데이터셋 소개

### NYC TLC Trip Record Data

뉴욕시 택시 & 리무진 위원회(TLC) 공개 데이터
- **출처**: https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page
- **크기**: 월간 약 1GB (2022년 데이터)
- **형식**: Parquet

### 주요 컬럼

| 컬럼명 | 설명 |
|--------|------|
| tpep_pickup_datetime | 승차 시각 |
| tpep_dropoff_datetime | 하차 시각 |
| passenger_count | 승객 수 |
| trip_distance | 이동 거리 (마일) |
| PULocationID | 승차 지역 ID |
| DOLocationID | 하차 지역 ID |
| fare_amount | 기본 요금 |
| tip_amount | 팁 금액 |
| total_amount | 총 금액 |
| payment_type | 결제 방식 |

## 분석 요구사항

### 필수 과제 (70점)

1. **데이터 로딩 최적화** (20점)
   - 메모리 효율적 로딩
   - 필요 컬럼만 선택
   - dtype 최적화

2. **시간대별 분석** (25점)
   - 요일별/시간대별 운행 패턴
   - 피크 시간 분석
   - 평균 요금 추이

3. **지역별 분석** (25점)
   - Top 10 인기 승차 지역
   - 지역 간 이동 패턴
   - 지역별 평균 요금

### 선택 과제 (30점)

4. **팁 분석** (15점)
   - 팁 금액 분포
   - 팁 비율 계산
   - 팁에 영향을 주는 요인

5. **pandas vs Polars 비교** (15점)
   - 동일 분석 두 라이브러리로 수행
   - 성능 비교 리포트
   - 코드 복잡도 비교

## 기술적 제약 조건

- 메모리 사용량 4GB 이하
- Parquet 형식 활용 권장
- 결과물: Jupyter Notebook 또는 Python 스크립트

## 평가 기준

| 항목 | 배점 | 기준 |
|------|------|------|
| 코드 품질 | 20% | 가독성, 모듈화, 주석 |
| 성능 최적화 | 30% | 메모리 효율, 실행 시간 |
| 분석 깊이 | 30% | 인사이트 도출, 시각화 |
| 문서화 | 20% | 결과 해석, 발견점 정리 |
      `,
      keyPoints: [
        'NYC Taxi 데이터: 뉴욕시 택시 운행 기록',
        '1GB+ 대용량 데이터 처리 실습',
        '시간대별, 지역별 분석 + 팁 예측',
        '메모리 4GB 이하로 처리하는 것이 목표'
      ]
    }
  },

  // Task 2: 데이터 다운로드 및 탐색 (Reading)
  {
    id: 'w2d5-task2',
    title: '데이터 다운로드 및 초기 탐색',
    type: 'reading',
    duration: 10,
    content: {
      objectives: [
        '데이터 다운로드 방법',
        '데이터 구조 파악',
        '품질 이슈 확인',
        '분석 전략 수립'
      ],
      markdown: `
# 데이터 다운로드 및 초기 탐색

## 데이터 다운로드

### 방법 1: 직접 다운로드
\`\`\`bash
# 2022년 1월 Yellow Taxi 데이터 (약 500MB)
wget https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2022-01.parquet
\`\`\`

### 방법 2: Python으로 다운로드
\`\`\`python
import urllib.request
import os

url = 'https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2022-01.parquet'
filename = 'yellow_tripdata_2022-01.parquet'

if not os.path.exists(filename):
    print(f"다운로드 중: {filename}")
    urllib.request.urlretrieve(url, filename)
    print("다운로드 완료!")
\`\`\`

### 여러 달 데이터 병합
\`\`\`python
# 1-3월 데이터 다운로드
base_url = 'https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2022-{:02d}.parquet'
months = [1, 2, 3]

for month in months:
    url = base_url.format(month)
    filename = f'yellow_tripdata_2022-{month:02d}.parquet'
    if not os.path.exists(filename):
        urllib.request.urlretrieve(url, filename)
        print(f"Downloaded: {filename}")
\`\`\`

## 초기 데이터 탐색

### Parquet 메타데이터 확인
\`\`\`python
import pyarrow.parquet as pq

# Parquet 파일 메타데이터 (로딩 없이 확인)
parquet_file = pq.ParquetFile('yellow_tripdata_2022-01.parquet')

print(f"행 수: {parquet_file.metadata.num_rows:,}")
print(f"컬럼 수: {parquet_file.metadata.num_columns}")
print(f"파일 크기: {os.path.getsize(filename) / 1024**2:.1f} MB")

# 스키마 확인
print("\\n컬럼 정보:")
for col in parquet_file.schema:
    print(f"  {col.name}: {col.physical_type}")
\`\`\`

### 샘플 데이터 확인
\`\`\`python
import pandas as pd

# 처음 1000행만 로드
df_sample = pd.read_parquet('yellow_tripdata_2022-01.parquet', nrows=1000)

print(df_sample.info())
print(df_sample.describe())
print(df_sample.head())
\`\`\`

## 데이터 품질 이슈

### 일반적인 문제점

1. **누락값**
   - passenger_count: 0 또는 NULL
   - tip_amount: 현금 결제 시 0

2. **이상치**
   - trip_distance: 0 또는 극단적으로 긴 거리
   - fare_amount: 음수 또는 비정상적으로 높은 값
   - passenger_count: 0 또는 8 초과

3. **날짜 이슈**
   - pickup_datetime > dropoff_datetime (시간 역전)
   - 미래 날짜

### 데이터 정제 전략
\`\`\`python
# 기본 필터링 조건
VALID_CONDITIONS = {
    'passenger_count': (1, 6),      # 1-6명
    'trip_distance': (0.1, 100),    # 0.1-100마일
    'fare_amount': (2.5, 500),      # $2.5-$500
    'tip_amount': (0, 200),         # $0-$200
}

def clean_taxi_data(df):
    """기본 데이터 정제"""
    initial_rows = len(df)

    # 누락값 제거
    df = df.dropna(subset=['trip_distance', 'fare_amount'])

    # 범위 필터링
    df = df[
        (df['passenger_count'].between(1, 6)) &
        (df['trip_distance'].between(0.1, 100)) &
        (df['fare_amount'].between(2.5, 500)) &
        (df['tip_amount'].between(0, 200))
    ]

    # 시간 검증
    df = df[df['tpep_dropoff_datetime'] > df['tpep_pickup_datetime']]

    print(f"정제 전: {initial_rows:,} → 정제 후: {len(df):,}")
    print(f"제거된 행: {initial_rows - len(df):,} ({100*(initial_rows-len(df))/initial_rows:.1f}%)")

    return df
\`\`\`

## 분석 전략

### 권장 접근 방식

1. **Parquet 형식 유지** - 압축 효율 좋음
2. **필요 컬럼만 로드** - usecols 활용
3. **dtype 최적화** - 메모리 절약
4. **청크 처리** - 필요시 분할 처리
5. **중간 결과 캐싱** - 반복 계산 방지
      `,
      keyPoints: [
        'NYC TLC 공식 사이트에서 Parquet 형식 다운로드',
        '메타데이터로 로딩 전 데이터 크기 확인',
        '이상치와 누락값 정제 필수',
        'Parquet + usecols로 효율적 로딩'
      ]
    }
  },

  // Task 3: 데이터 로딩 최적화 (Code)
  {
    id: 'w2d5-task3',
    title: 'Part 1: 데이터 로딩 최적화',
    type: 'code',
    duration: 25,
    content: {
      objectives: [
        '메모리 효율적 데이터 로딩',
        'dtype 자동 최적화',
        '데이터 품질 검증',
        '로딩 성능 벤치마킹'
      ],
      starterCode: `import pandas as pd
import numpy as np
import os
import time
import gc

# ===========================================
# 데이터 파일 경로 (다운로드 후 사용)
# ===========================================
DATA_PATH = 'yellow_tripdata_2022-01.parquet'

# 샘플 데이터로 테스트 (실제 데이터 없을 경우)
def create_sample_data(n_rows=500_000):
    """테스트용 샘플 데이터 생성"""
    np.random.seed(42)

    # 실제 NYC Taxi 데이터와 유사한 구조
    start_date = pd.Timestamp('2022-01-01')
    pickup_times = start_date + pd.to_timedelta(
        np.random.randint(0, 31*24*60*60, n_rows), unit='s'
    )
    trip_durations = np.random.exponential(15, n_rows) * 60  # 평균 15분

    df = pd.DataFrame({
        'VendorID': np.random.choice([1, 2], n_rows),
        'tpep_pickup_datetime': pickup_times,
        'tpep_dropoff_datetime': pickup_times + pd.to_timedelta(trip_durations, unit='s'),
        'passenger_count': np.random.choice([1, 1, 1, 2, 2, 3, 4, 5], n_rows),
        'trip_distance': np.random.exponential(3, n_rows),  # 평균 3마일
        'RatecodeID': np.random.choice([1, 1, 1, 2, 3, 4, 5, 6], n_rows),
        'PULocationID': np.random.randint(1, 265, n_rows),
        'DOLocationID': np.random.randint(1, 265, n_rows),
        'payment_type': np.random.choice([1, 1, 2, 2, 3, 4], n_rows),
        'fare_amount': np.random.exponential(15, n_rows),  # 평균 $15
        'extra': np.random.choice([0, 0.5, 1, 2.5], n_rows),
        'mta_tax': 0.5,
        'tip_amount': np.random.exponential(3, n_rows) * (np.random.random(n_rows) > 0.3),
        'tolls_amount': np.random.choice([0, 0, 0, 5.76, 6.55], n_rows),
        'improvement_surcharge': 0.3,
        'total_amount': 0,  # 나중에 계산
        'congestion_surcharge': np.random.choice([0, 2.5], n_rows),
        'airport_fee': np.random.choice([0, 0, 0, 1.25], n_rows)
    })

    # total_amount 계산
    df['total_amount'] = (df['fare_amount'] + df['extra'] + df['mta_tax'] +
                          df['tip_amount'] + df['tolls_amount'] +
                          df['improvement_surcharge'] + df['congestion_surcharge'])

    return df

# 데이터 준비
if not os.path.exists(DATA_PATH):
    print("샘플 데이터 생성 중...")
    df_sample = create_sample_data()
    df_sample.to_parquet(DATA_PATH)
    print(f"샘플 데이터 저장: {DATA_PATH}")

# ===========================================
# Task 1: 기본 로딩 vs 최적화 로딩 비교
# ===========================================

def load_basic():
    """기본 로딩 (최적화 없음)"""
    # TODO: pandas read_parquet로 전체 데이터 로딩
    pass

def load_optimized():
    """최적화된 로딩"""
    # TODO: 구현
    # 1. 필요한 컬럼만 선택 (usecols)
    # 2. dtype 최적화 적용
    # 3. 메모리 사용량 측정

    # 분석에 필요한 컬럼
    NEEDED_COLUMNS = [
        'tpep_pickup_datetime',
        'tpep_dropoff_datetime',
        'passenger_count',
        'trip_distance',
        'PULocationID',
        'DOLocationID',
        'payment_type',
        'fare_amount',
        'tip_amount',
        'total_amount'
    ]

    pass

# ===========================================
# Task 2: 메모리 최적화 함수
# ===========================================

def optimize_dtypes(df):
    """DataFrame dtype 최적화"""
    # TODO: 구현
    # 1. 정수 컬럼 다운캐스팅
    # 2. 실수 컬럼 다운캐스팅
    # 3. 최적화 전후 메모리 비교
    pass

# ===========================================
# Task 3: 데이터 품질 검증
# ===========================================

def validate_data(df):
    """데이터 품질 검증"""
    # TODO: 구현
    # 1. 누락값 비율 확인
    # 2. 이상치 탐지
    # 3. 데이터 정제
    pass

# ===========================================
# Task 4: 전체 파이프라인
# ===========================================

class TaxiDataLoader:
    """NYC Taxi 데이터 로더 클래스"""

    def __init__(self, filepath):
        self.filepath = filepath
        self.df = None
        self.load_stats = {}

    def load(self, optimize=True):
        """데이터 로딩"""
        # TODO: 구현
        pass

    def get_stats(self):
        """로딩 통계 반환"""
        # TODO: 구현
        pass

# ===========================================
# 테스트 실행
# ===========================================

if __name__ == "__main__":
    print("=== NYC Taxi 데이터 로딩 최적화 ===\\n")

    # 기본 로딩 테스트
    print("[1] 기본 로딩")
    # TODO: load_basic() 호출 및 결과 출력

    # 최적화 로딩 테스트
    print("\\n[2] 최적화 로딩")
    # TODO: load_optimized() 호출 및 결과 출력

    # 클래스 사용 테스트
    print("\\n[3] TaxiDataLoader 테스트")
    # TODO: TaxiDataLoader 인스턴스 생성 및 테스트
`,
      solutionCode: `import pandas as pd
import numpy as np
import os
import time
import gc
import tracemalloc

DATA_PATH = 'yellow_tripdata_2022-01.parquet'

def create_sample_data(n_rows=500_000):
    """테스트용 샘플 데이터 생성"""
    np.random.seed(42)
    start_date = pd.Timestamp('2022-01-01')
    pickup_times = start_date + pd.to_timedelta(
        np.random.randint(0, 31*24*60*60, n_rows), unit='s'
    )
    trip_durations = np.random.exponential(15, n_rows) * 60

    df = pd.DataFrame({
        'VendorID': np.random.choice([1, 2], n_rows),
        'tpep_pickup_datetime': pickup_times,
        'tpep_dropoff_datetime': pickup_times + pd.to_timedelta(trip_durations, unit='s'),
        'passenger_count': np.random.choice([1, 1, 1, 2, 2, 3, 4, 5], n_rows),
        'trip_distance': np.random.exponential(3, n_rows),
        'RatecodeID': np.random.choice([1, 1, 1, 2, 3, 4, 5, 6], n_rows),
        'PULocationID': np.random.randint(1, 265, n_rows),
        'DOLocationID': np.random.randint(1, 265, n_rows),
        'payment_type': np.random.choice([1, 1, 2, 2, 3, 4], n_rows),
        'fare_amount': np.random.exponential(15, n_rows),
        'extra': np.random.choice([0, 0.5, 1, 2.5], n_rows),
        'mta_tax': 0.5,
        'tip_amount': np.random.exponential(3, n_rows) * (np.random.random(n_rows) > 0.3),
        'tolls_amount': np.random.choice([0, 0, 0, 5.76, 6.55], n_rows),
        'improvement_surcharge': 0.3,
        'total_amount': 0,
        'congestion_surcharge': np.random.choice([0, 2.5], n_rows),
        'airport_fee': np.random.choice([0, 0, 0, 1.25], n_rows)
    })
    df['total_amount'] = (df['fare_amount'] + df['extra'] + df['mta_tax'] +
                          df['tip_amount'] + df['tolls_amount'] +
                          df['improvement_surcharge'] + df['congestion_surcharge'])
    return df

if not os.path.exists(DATA_PATH):
    print("샘플 데이터 생성 중...")
    df_sample = create_sample_data()
    df_sample.to_parquet(DATA_PATH)
    print(f"샘플 데이터 저장: {DATA_PATH}")

# ===========================================
# Task 1: 기본 로딩 vs 최적화 로딩 비교
# ===========================================

def load_basic():
    """기본 로딩 (최적화 없음)"""
    tracemalloc.start()
    start = time.time()

    df = pd.read_parquet(DATA_PATH)

    elapsed = time.time() - start
    current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    print(f"  행 수: {len(df):,}")
    print(f"  컬럼 수: {len(df.columns)}")
    print(f"  메모리: {df.memory_usage(deep=True).sum() / 1024**2:.1f} MB")
    print(f"  로딩 시간: {elapsed:.2f}초")
    print(f"  피크 메모리: {peak / 1024**2:.1f} MB")

    return df

def load_optimized():
    """최적화된 로딩"""
    NEEDED_COLUMNS = [
        'tpep_pickup_datetime',
        'tpep_dropoff_datetime',
        'passenger_count',
        'trip_distance',
        'PULocationID',
        'DOLocationID',
        'payment_type',
        'fare_amount',
        'tip_amount',
        'total_amount'
    ]

    tracemalloc.start()
    start = time.time()

    df = pd.read_parquet(DATA_PATH, columns=NEEDED_COLUMNS)
    df = optimize_dtypes(df)

    elapsed = time.time() - start
    current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    print(f"  행 수: {len(df):,}")
    print(f"  컬럼 수: {len(df.columns)}")
    print(f"  메모리: {df.memory_usage(deep=True).sum() / 1024**2:.1f} MB")
    print(f"  로딩 시간: {elapsed:.2f}초")
    print(f"  피크 메모리: {peak / 1024**2:.1f} MB")

    return df

# ===========================================
# Task 2: 메모리 최적화 함수
# ===========================================

def optimize_dtypes(df, verbose=False):
    """DataFrame dtype 최적화"""
    start_mem = df.memory_usage(deep=True).sum() / 1024**2

    for col in df.columns:
        col_type = df[col].dtype

        if col_type != 'object' and not pd.api.types.is_datetime64_any_dtype(df[col]):
            c_min, c_max = df[col].min(), df[col].max()

            if str(col_type).startswith('int') or str(col_type).startswith('uint'):
                if c_min >= 0:
                    if c_max <= 255:
                        df[col] = df[col].astype(np.uint8)
                    elif c_max <= 65535:
                        df[col] = df[col].astype(np.uint16)
                    elif c_max <= 4294967295:
                        df[col] = df[col].astype(np.uint32)
                else:
                    if c_min >= -128 and c_max <= 127:
                        df[col] = df[col].astype(np.int8)
                    elif c_min >= -32768 and c_max <= 32767:
                        df[col] = df[col].astype(np.int16)
                    elif c_min >= -2147483648 and c_max <= 2147483647:
                        df[col] = df[col].astype(np.int32)

            elif str(col_type).startswith('float'):
                df[col] = df[col].astype(np.float32)

    end_mem = df.memory_usage(deep=True).sum() / 1024**2

    if verbose:
        print(f"  메모리 최적화: {start_mem:.1f} MB → {end_mem:.1f} MB")
        print(f"  절약: {100 * (start_mem - end_mem) / start_mem:.1f}%")

    return df

# ===========================================
# Task 3: 데이터 품질 검증
# ===========================================

def validate_data(df, verbose=True):
    """데이터 품질 검증 및 정제"""
    initial_rows = len(df)
    issues = {}

    # 1. 누락값 확인
    null_counts = df.isnull().sum()
    if null_counts.sum() > 0:
        issues['null_values'] = null_counts[null_counts > 0].to_dict()
        if verbose:
            print("\\n[누락값]")
            for col, count in issues['null_values'].items():
                print(f"  {col}: {count:,} ({100*count/len(df):.2f}%)")

    # 2. 이상치 탐지
    issues['outliers'] = {}

    # passenger_count
    invalid_passengers = (df['passenger_count'] < 1) | (df['passenger_count'] > 6)
    issues['outliers']['passenger_count'] = invalid_passengers.sum()

    # trip_distance
    invalid_distance = (df['trip_distance'] <= 0) | (df['trip_distance'] > 100)
    issues['outliers']['trip_distance'] = invalid_distance.sum()

    # fare_amount
    invalid_fare = (df['fare_amount'] < 2.5) | (df['fare_amount'] > 500)
    issues['outliers']['fare_amount'] = invalid_fare.sum()

    # tip_amount
    invalid_tip = (df['tip_amount'] < 0) | (df['tip_amount'] > 200)
    issues['outliers']['tip_amount'] = invalid_tip.sum()

    if verbose:
        print("\\n[이상치]")
        for col, count in issues['outliers'].items():
            print(f"  {col}: {count:,} ({100*count/len(df):.2f}%)")

    # 3. 데이터 정제
    df_clean = df[
        (df['passenger_count'].between(1, 6)) &
        (df['trip_distance'].between(0.1, 100)) &
        (df['fare_amount'].between(2.5, 500)) &
        (df['tip_amount'].between(0, 200)) &
        (df['tpep_dropoff_datetime'] > df['tpep_pickup_datetime'])
    ].dropna()

    final_rows = len(df_clean)
    issues['removed_rows'] = initial_rows - final_rows

    if verbose:
        print(f"\\n[정제 결과]")
        print(f"  원본: {initial_rows:,} 행")
        print(f"  정제 후: {final_rows:,} 행")
        print(f"  제거: {issues['removed_rows']:,} 행 ({100*issues['removed_rows']/initial_rows:.1f}%)")

    return df_clean, issues

# ===========================================
# Task 4: 전체 파이프라인
# ===========================================

class TaxiDataLoader:
    """NYC Taxi 데이터 로더 클래스"""

    NEEDED_COLUMNS = [
        'tpep_pickup_datetime', 'tpep_dropoff_datetime',
        'passenger_count', 'trip_distance',
        'PULocationID', 'DOLocationID',
        'payment_type', 'fare_amount',
        'tip_amount', 'total_amount'
    ]

    def __init__(self, filepath):
        self.filepath = filepath
        self.df = None
        self.df_clean = None
        self.load_stats = {}

    def load(self, optimize=True, validate=True, verbose=True):
        """데이터 로딩 파이프라인"""
        tracemalloc.start()
        start = time.time()

        # 1. 데이터 로딩
        if verbose:
            print("데이터 로딩 중...")
        self.df = pd.read_parquet(self.filepath, columns=self.NEEDED_COLUMNS)

        # 2. dtype 최적화
        if optimize:
            if verbose:
                print("dtype 최적화 중...")
            self.df = optimize_dtypes(self.df, verbose=verbose)

        # 3. 데이터 검증 및 정제
        if validate:
            if verbose:
                print("데이터 검증 중...")
            self.df_clean, validation_issues = validate_data(self.df, verbose=verbose)
            self.load_stats['validation'] = validation_issues
        else:
            self.df_clean = self.df

        # 4. 통계 수집
        elapsed = time.time() - start
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        self.load_stats.update({
            'rows': len(self.df_clean),
            'columns': len(self.df_clean.columns),
            'memory_mb': self.df_clean.memory_usage(deep=True).sum() / 1024**2,
            'load_time': elapsed,
            'peak_memory_mb': peak / 1024**2
        })

        if verbose:
            print(f"\\n로딩 완료!")
            print(f"  행 수: {self.load_stats['rows']:,}")
            print(f"  메모리: {self.load_stats['memory_mb']:.1f} MB")
            print(f"  로딩 시간: {self.load_stats['load_time']:.2f}초")

        return self

    def get_df(self, cleaned=True):
        """DataFrame 반환"""
        return self.df_clean if cleaned else self.df

    def get_stats(self):
        """로딩 통계 반환"""
        return self.load_stats

# ===========================================
# 테스트 실행
# ===========================================

if __name__ == "__main__":
    print("=== NYC Taxi 데이터 로딩 최적화 ===\\n")

    # 기본 로딩 테스트
    print("[1] 기본 로딩")
    df_basic = load_basic()
    basic_mem = df_basic.memory_usage(deep=True).sum() / 1024**2
    del df_basic
    gc.collect()

    # 최적화 로딩 테스트
    print("\\n[2] 최적화 로딩")
    df_opt = load_optimized()
    opt_mem = df_opt.memory_usage(deep=True).sum() / 1024**2
    del df_opt
    gc.collect()

    # 비교
    print(f"\\n[비교]")
    print(f"  기본: {basic_mem:.1f} MB")
    print(f"  최적화: {opt_mem:.1f} MB")
    print(f"  절약: {100 * (basic_mem - opt_mem) / basic_mem:.1f}%")

    # 클래스 사용 테스트
    print("\\n[3] TaxiDataLoader 테스트")
    loader = TaxiDataLoader(DATA_PATH)
    loader.load(optimize=True, validate=True)

    df = loader.get_df()
    stats = loader.get_stats()
    print(f"\\n최종 DataFrame Shape: {df.shape}")
`,
      instructions: 'NYC Taxi 데이터를 메모리 효율적으로 로딩하는 파이프라인을 구현합니다. 컬럼 선택, dtype 최적화, 데이터 검증/정제를 포함합니다.',
      keyPoints: [
        'usecols로 필요 컬럼만 로딩하여 메모리 절약',
        'dtype 다운캐스팅으로 추가 메모리 최적화',
        '이상치와 누락값 제거로 데이터 품질 확보',
        'tracemalloc으로 메모리 사용량 모니터링'
      ]
    }
  },

  // Task 4: 시간대별 분석 (Code)
  {
    id: 'w2d5-task4',
    title: 'Part 2: 시간대별 운행 패턴 분석',
    type: 'code',
    duration: 25,
    content: {
      objectives: [
        '시간대별 운행 패턴 분석',
        '요일별 특성 파악',
        '피크 시간 식별',
        '시각화 구현'
      ],
      starterCode: `import pandas as pd
import numpy as np

# 이전 태스크에서 로딩한 데이터 사용
# df = loader.get_df()

# 또는 샘플 데이터 로딩
df = pd.read_parquet('yellow_tripdata_2022-01.parquet',
    columns=['tpep_pickup_datetime', 'tpep_dropoff_datetime',
             'passenger_count', 'trip_distance', 'fare_amount',
             'tip_amount', 'total_amount', 'PULocationID'])

print(f"데이터 크기: {len(df):,} 행")

# ===========================================
# Task 1: 시간 특성 추출
# ===========================================

def extract_time_features(df):
    """날짜/시간 특성 추출"""
    # TODO: 다음 특성 추출
    # - hour: 시간 (0-23)
    # - day_of_week: 요일 (0=월, 6=일)
    # - day_name: 요일명 ('Monday', ...)
    # - is_weekend: 주말 여부
    # - trip_duration_min: 운행 시간 (분)

    pass

# ===========================================
# Task 2: 시간대별 분석
# ===========================================

def analyze_by_hour(df):
    """시간대별 분석"""
    # TODO: 시간대별로 다음 지표 계산
    # - 운행 건수
    # - 평균 요금
    # - 평균 이동 거리
    # - 평균 팁

    pass

# ===========================================
# Task 3: 요일별 분석
# ===========================================

def analyze_by_day(df):
    """요일별 분석"""
    # TODO: 요일별로 다음 지표 계산
    # - 운행 건수
    # - 평균 요금
    # - 피크 시간 (가장 운행이 많은 시간)

    pass

# ===========================================
# Task 4: 피크 시간 분석
# ===========================================

def find_peak_hours(df):
    """피크 시간 식별"""
    # TODO: 다음 분석 수행
    # - 전체 피크 시간 (상위 3개)
    # - 평일 피크 시간
    # - 주말 피크 시간
    # - 출퇴근 시간 비중 분석

    pass

# ===========================================
# Task 5: 결과 시각화 (콘솔 출력)
# ===========================================

def visualize_patterns(hourly_stats, daily_stats):
    """패턴 시각화 (텍스트 기반)"""
    # TODO: 결과를 보기 좋게 출력
    # - 히스토그램 형태의 바 차트 (텍스트)
    # - 요약 통계

    pass

# ===========================================
# 실행
# ===========================================

if __name__ == "__main__":
    print("=== 시간대별 운행 패턴 분석 ===\\n")

    # 특성 추출
    df = extract_time_features(df)

    # 분석 실행
    hourly = analyze_by_hour(df)
    daily = analyze_by_day(df)
    peaks = find_peak_hours(df)

    # 결과 출력
    visualize_patterns(hourly, daily)
    print("\\n피크 시간 분석:")
    print(peaks)
`,
      solutionCode: `import pandas as pd
import numpy as np

df = pd.read_parquet('yellow_tripdata_2022-01.parquet',
    columns=['tpep_pickup_datetime', 'tpep_dropoff_datetime',
             'passenger_count', 'trip_distance', 'fare_amount',
             'tip_amount', 'total_amount', 'PULocationID'])

print(f"데이터 크기: {len(df):,} 행")

# ===========================================
# Task 1: 시간 특성 추출
# ===========================================

def extract_time_features(df):
    """날짜/시간 특성 추출"""
    df = df.copy()

    # 시간 특성 추출
    df['hour'] = df['tpep_pickup_datetime'].dt.hour
    df['day_of_week'] = df['tpep_pickup_datetime'].dt.dayofweek
    df['day_name'] = df['tpep_pickup_datetime'].dt.day_name()
    df['is_weekend'] = df['day_of_week'].isin([5, 6])

    # 운행 시간 계산 (분)
    df['trip_duration_min'] = (
        df['tpep_dropoff_datetime'] - df['tpep_pickup_datetime']
    ).dt.total_seconds() / 60

    # 이상치 제거 (0분 초과, 180분 이하)
    df = df[(df['trip_duration_min'] > 0) & (df['trip_duration_min'] <= 180)]

    print(f"특성 추출 완료: {len(df):,} 행")
    print(f"추가된 컬럼: hour, day_of_week, day_name, is_weekend, trip_duration_min")

    return df

# ===========================================
# Task 2: 시간대별 분석
# ===========================================

def analyze_by_hour(df):
    """시간대별 분석"""
    hourly_stats = df.groupby('hour').agg({
        'fare_amount': ['count', 'mean'],
        'trip_distance': 'mean',
        'tip_amount': 'mean',
        'trip_duration_min': 'mean'
    }).round(2)

    hourly_stats.columns = ['trip_count', 'avg_fare', 'avg_distance', 'avg_tip', 'avg_duration']
    hourly_stats = hourly_stats.reset_index()

    return hourly_stats

# ===========================================
# Task 3: 요일별 분석
# ===========================================

def analyze_by_day(df):
    """요일별 분석"""
    daily_stats = df.groupby(['day_of_week', 'day_name']).agg({
        'fare_amount': ['count', 'mean'],
        'trip_distance': 'mean',
        'tip_amount': 'mean'
    }).round(2)

    daily_stats.columns = ['trip_count', 'avg_fare', 'avg_distance', 'avg_tip']
    daily_stats = daily_stats.reset_index()

    # 요일별 피크 시간 계산
    peak_hours = df.groupby(['day_of_week', 'hour']).size().reset_index(name='count')
    peak_hours = peak_hours.loc[peak_hours.groupby('day_of_week')['count'].idxmax()]
    daily_stats = daily_stats.merge(
        peak_hours[['day_of_week', 'hour']].rename(columns={'hour': 'peak_hour'}),
        on='day_of_week'
    )

    return daily_stats

# ===========================================
# Task 4: 피크 시간 분석
# ===========================================

def find_peak_hours(df):
    """피크 시간 식별"""
    results = {}

    # 전체 피크 시간
    hourly_counts = df.groupby('hour').size().sort_values(ascending=False)
    results['overall_peak_hours'] = hourly_counts.head(3).to_dict()

    # 평일 피크 시간
    weekday_counts = df[~df['is_weekend']].groupby('hour').size().sort_values(ascending=False)
    results['weekday_peak_hours'] = weekday_counts.head(3).to_dict()

    # 주말 피크 시간
    weekend_counts = df[df['is_weekend']].groupby('hour').size().sort_values(ascending=False)
    results['weekend_peak_hours'] = weekend_counts.head(3).to_dict()

    # 출퇴근 시간 비중
    morning_rush = df['hour'].between(7, 9).sum()
    evening_rush = df['hour'].between(17, 19).sum()
    total_trips = len(df)

    results['commute_analysis'] = {
        'morning_rush_pct': round(100 * morning_rush / total_trips, 1),
        'evening_rush_pct': round(100 * evening_rush / total_trips, 1),
        'off_peak_pct': round(100 * (total_trips - morning_rush - evening_rush) / total_trips, 1)
    }

    return results

# ===========================================
# Task 5: 결과 시각화 (콘솔 출력)
# ===========================================

def visualize_patterns(hourly_stats, daily_stats):
    """패턴 시각화 (텍스트 기반)"""

    # 시간대별 운행 패턴 (텍스트 바 차트)
    print("\\n=== 시간대별 운행 패턴 ===")
    max_count = hourly_stats['trip_count'].max()

    for _, row in hourly_stats.iterrows():
        bar_len = int(50 * row['trip_count'] / max_count)
        bar = '█' * bar_len
        print(f"{row['hour']:2d}시 | {bar} {row['trip_count']:,}")

    # 요일별 요약
    print("\\n=== 요일별 요약 ===")
    print(f"{'요일':<12} {'운행 수':>12} {'평균요금':>10} {'피크시간':>8}")
    print("-" * 45)

    day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    for day in day_order:
        row = daily_stats[daily_stats['day_name'] == day].iloc[0]
        print(f"{row['day_name']:<12} {row['trip_count']:>12,} \${row['avg_fare']:>8.2f} {row['peak_hour']:>6}시")

    # 요약 통계
    print("\\n=== 요약 통계 ===")
    total_trips = hourly_stats['trip_count'].sum()
    busiest_hour = hourly_stats.loc[hourly_stats['trip_count'].idxmax()]
    slowest_hour = hourly_stats.loc[hourly_stats['trip_count'].idxmin()]

    print(f"총 운행 건수: {total_trips:,}")
    print(f"가장 바쁜 시간: {busiest_hour['hour']}시 ({busiest_hour['trip_count']:,}건)")
    print(f"가장 한가한 시간: {slowest_hour['hour']}시 ({slowest_hour['trip_count']:,}건)")
    print(f"평균 요금: \${hourly_stats['avg_fare'].mean():.2f}")
    print(f"평균 이동 거리: {hourly_stats['avg_distance'].mean():.2f} 마일")

# ===========================================
# 실행
# ===========================================

if __name__ == "__main__":
    print("=== 시간대별 운행 패턴 분석 ===\\n")

    # 특성 추출
    df = extract_time_features(df)

    # 분석 실행
    hourly = analyze_by_hour(df)
    daily = analyze_by_day(df)
    peaks = find_peak_hours(df)

    # 결과 출력
    visualize_patterns(hourly, daily)

    print("\\n=== 피크 시간 분석 ===")
    print(f"전체 피크 시간: {peaks['overall_peak_hours']}")
    print(f"평일 피크 시간: {peaks['weekday_peak_hours']}")
    print(f"주말 피크 시간: {peaks['weekend_peak_hours']}")
    print(f"\\n출퇴근 시간 비중:")
    print(f"  아침 (7-9시): {peaks['commute_analysis']['morning_rush_pct']}%")
    print(f"  저녁 (17-19시): {peaks['commute_analysis']['evening_rush_pct']}%")
    print(f"  기타: {peaks['commute_analysis']['off_peak_pct']}%")
`,
      instructions: '시간대별 운행 패턴을 분석합니다. 시간 특성을 추출하고, 시간대/요일별 운행 패턴과 피크 시간을 식별합니다.',
      keyPoints: [
        'dt accessor로 시간 특성 효율적 추출',
        'groupby().agg()로 다중 집계',
        '평일/주말 패턴 차이 분석',
        '출퇴근 시간 vs 비피크 시간 비교'
      ]
    }
  },

  // Task 5: 지역별 분석 (Code)
  {
    id: 'w2d5-task5',
    title: 'Part 3: 지역별 요금 분석',
    type: 'code',
    duration: 25,
    content: {
      objectives: [
        'Top 승차/하차 지역 식별',
        '지역별 평균 요금 분석',
        '지역 간 이동 패턴 분석',
        'OD(Origin-Destination) 매트릭스 생성'
      ],
      starterCode: `import pandas as pd
import numpy as np

# 데이터 로딩
df = pd.read_parquet('yellow_tripdata_2022-01.parquet',
    columns=['PULocationID', 'DOLocationID', 'fare_amount',
             'tip_amount', 'total_amount', 'trip_distance'])

print(f"데이터 크기: {len(df):,} 행")

# 지역 ID → 이름 매핑 (일부 주요 지역)
ZONE_NAMES = {
    1: 'Newark Airport', 132: 'JFK Airport', 138: 'LaGuardia Airport',
    161: 'Midtown Center', 162: 'Midtown East', 163: 'Midtown North',
    164: 'Midtown South', 186: 'Penn Station', 230: 'Times Sq',
    234: 'Union Sq', 237: 'Upper East Side N', 236: 'Upper East Side S',
    239: 'Upper West Side N', 238: 'Upper West Side S',
    79: 'East Village', 114: 'Greenwich Village', 125: 'Hudson Sq'
}

# ===========================================
# Task 1: Top 승차/하차 지역
# ===========================================

def analyze_popular_zones(df, top_n=10):
    """인기 승차/하차 지역 분석"""
    # TODO: 구현
    # 1. Top N 승차 지역 (운행 건수 기준)
    # 2. Top N 하차 지역
    # 3. 지역명 매핑
    pass

# ===========================================
# Task 2: 지역별 평균 요금
# ===========================================

def analyze_zone_fares(df, min_trips=100):
    """지역별 요금 분석"""
    # TODO: 구현
    # 1. 승차 지역별 평균 요금, 평균 팁, 평균 거리
    # 2. 최소 운행 건수 이상인 지역만 포함
    # 3. 고요금 지역 vs 저요금 지역 비교
    pass

# ===========================================
# Task 3: OD 매트릭스 생성
# ===========================================

def create_od_matrix(df, top_n=10):
    """Origin-Destination 매트릭스 생성"""
    # TODO: 구현
    # 1. 상위 N개 지역 선정
    # 2. 승차-하차 지역 쌍별 운행 건수
    # 3. 피벗 테이블로 매트릭스 형태 변환
    pass

# ===========================================
# Task 4: 공항 분석
# ===========================================

def analyze_airports(df):
    """공항 관련 운행 분석"""
    # TODO: 구현
    # 공항 ID: JFK(132), LaGuardia(138), Newark(1)
    # 1. 공항 TO/FROM 운행 비율
    # 2. 공항별 평균 요금
    # 3. 공항 이용 시간대 패턴
    pass

# ===========================================
# Task 5: 결과 출력
# ===========================================

def print_zone_analysis(popular, fares, od_matrix, airport):
    """분석 결과 출력"""
    # TODO: 결과 포맷팅 및 출력
    pass

# ===========================================
# 실행
# ===========================================

if __name__ == "__main__":
    print("=== 지역별 요금 분석 ===\\n")

    popular = analyze_popular_zones(df)
    fares = analyze_zone_fares(df)
    od = create_od_matrix(df)
    airport = analyze_airports(df)

    print_zone_analysis(popular, fares, od, airport)
`,
      solutionCode: `import pandas as pd
import numpy as np

df = pd.read_parquet('yellow_tripdata_2022-01.parquet',
    columns=['PULocationID', 'DOLocationID', 'fare_amount',
             'tip_amount', 'total_amount', 'trip_distance',
             'tpep_pickup_datetime'])

print(f"데이터 크기: {len(df):,} 행")

ZONE_NAMES = {
    1: 'Newark Airport', 132: 'JFK Airport', 138: 'LaGuardia Airport',
    161: 'Midtown Center', 162: 'Midtown East', 163: 'Midtown North',
    164: 'Midtown South', 186: 'Penn Station', 230: 'Times Sq',
    234: 'Union Sq', 237: 'Upper East Side N', 236: 'Upper East Side S',
    239: 'Upper West Side N', 238: 'Upper West Side S',
    79: 'East Village', 114: 'Greenwich Village', 125: 'Hudson Sq'
}

def get_zone_name(zone_id):
    return ZONE_NAMES.get(zone_id, f'Zone {zone_id}')

# ===========================================
# Task 1: Top 승차/하차 지역
# ===========================================

def analyze_popular_zones(df, top_n=10):
    """인기 승차/하차 지역 분석"""
    # Top 승차 지역
    pickup_counts = df['PULocationID'].value_counts().head(top_n).reset_index()
    pickup_counts.columns = ['zone_id', 'trip_count']
    pickup_counts['zone_name'] = pickup_counts['zone_id'].apply(get_zone_name)
    pickup_counts['pct'] = (pickup_counts['trip_count'] / len(df) * 100).round(2)

    # Top 하차 지역
    dropoff_counts = df['DOLocationID'].value_counts().head(top_n).reset_index()
    dropoff_counts.columns = ['zone_id', 'trip_count']
    dropoff_counts['zone_name'] = dropoff_counts['zone_id'].apply(get_zone_name)
    dropoff_counts['pct'] = (dropoff_counts['trip_count'] / len(df) * 100).round(2)

    return {'pickup': pickup_counts, 'dropoff': dropoff_counts}

# ===========================================
# Task 2: 지역별 평균 요금
# ===========================================

def analyze_zone_fares(df, min_trips=100):
    """지역별 요금 분석"""
    zone_stats = df.groupby('PULocationID').agg({
        'fare_amount': ['count', 'mean'],
        'tip_amount': 'mean',
        'trip_distance': 'mean',
        'total_amount': 'mean'
    }).round(2)

    zone_stats.columns = ['trip_count', 'avg_fare', 'avg_tip', 'avg_distance', 'avg_total']
    zone_stats = zone_stats.reset_index()

    # 최소 운행 건수 필터
    zone_stats = zone_stats[zone_stats['trip_count'] >= min_trips]
    zone_stats['zone_name'] = zone_stats['PULocationID'].apply(get_zone_name)

    # 정렬
    zone_stats_sorted = zone_stats.sort_values('avg_fare', ascending=False)

    return {
        'all': zone_stats,
        'top_fare': zone_stats_sorted.head(10),
        'low_fare': zone_stats_sorted.tail(10)
    }

# ===========================================
# Task 3: OD 매트릭스 생성
# ===========================================

def create_od_matrix(df, top_n=10):
    """Origin-Destination 매트릭스 생성"""
    # 상위 승차 지역 선정
    top_pickups = df['PULocationID'].value_counts().head(top_n).index.tolist()
    top_dropoffs = df['DOLocationID'].value_counts().head(top_n).index.tolist()
    top_zones = list(set(top_pickups + top_dropoffs))[:top_n]

    # 필터링
    df_filtered = df[
        df['PULocationID'].isin(top_zones) &
        df['DOLocationID'].isin(top_zones)
    ]

    # 피벗 테이블
    od_matrix = df_filtered.pivot_table(
        values='fare_amount',
        index='PULocationID',
        columns='DOLocationID',
        aggfunc='count',
        fill_value=0
    )

    # 지역명으로 인덱스/컬럼 변환
    od_matrix.index = [get_zone_name(z) for z in od_matrix.index]
    od_matrix.columns = [get_zone_name(z) for z in od_matrix.columns]

    return od_matrix

# ===========================================
# Task 4: 공항 분석
# ===========================================

def analyze_airports(df):
    """공항 관련 운행 분석"""
    airport_ids = [132, 138, 1]  # JFK, LaGuardia, Newark
    airport_names = {132: 'JFK', 138: 'LaGuardia', 1: 'Newark'}

    results = {}
    total_trips = len(df)

    for aid, aname in airport_names.items():
        # TO 공항
        to_airport = df[df['DOLocationID'] == aid]
        # FROM 공항
        from_airport = df[df['PULocationID'] == aid]

        results[aname] = {
            'to_count': len(to_airport),
            'to_pct': round(100 * len(to_airport) / total_trips, 2),
            'from_count': len(from_airport),
            'from_pct': round(100 * len(from_airport) / total_trips, 2),
            'to_avg_fare': round(to_airport['fare_amount'].mean(), 2),
            'from_avg_fare': round(from_airport['fare_amount'].mean(), 2),
            'to_avg_distance': round(to_airport['trip_distance'].mean(), 2),
            'from_avg_distance': round(from_airport['trip_distance'].mean(), 2)
        }

    return results

# ===========================================
# Task 5: 결과 출력
# ===========================================

def print_zone_analysis(popular, fares, od_matrix, airport):
    """분석 결과 출력"""

    # Top 승차 지역
    print("=== Top 10 승차 지역 ===")
    for _, row in popular['pickup'].iterrows():
        print(f"  {row['zone_name']:<25} {row['trip_count']:>10,} ({row['pct']:.1f}%)")

    # Top 하차 지역
    print("\\n=== Top 10 하차 지역 ===")
    for _, row in popular['dropoff'].iterrows():
        print(f"  {row['zone_name']:<25} {row['trip_count']:>10,} ({row['pct']:.1f}%)")

    # 고요금/저요금 지역
    print("\\n=== 고요금 지역 (상위 5) ===")
    for _, row in fares['top_fare'].head(5).iterrows():
        print(f"  {row['zone_name']:<25} 평균 \${row['avg_fare']:>7.2f} (거리: {row['avg_distance']:.1f}mi)")

    print("\\n=== 저요금 지역 (하위 5) ===")
    for _, row in fares['low_fare'].head(5).iterrows():
        print(f"  {row['zone_name']:<25} 평균 \${row['avg_fare']:>7.2f} (거리: {row['avg_distance']:.1f}mi)")

    # OD 매트릭스
    print("\\n=== OD 매트릭스 (상위 지역 간 운행 건수) ===")
    print(od_matrix.to_string())

    # 공항 분석
    print("\\n=== 공항 운행 분석 ===")
    for airport_name, stats in airport.items():
        print(f"\\n{airport_name}:")
        print(f"  TO 공항: {stats['to_count']:,}건 ({stats['to_pct']}%), 평균 \${stats['to_avg_fare']:.2f}")
        print(f"  FROM 공항: {stats['from_count']:,}건 ({stats['from_pct']}%), 평균 \${stats['from_avg_fare']:.2f}")

# ===========================================
# 실행
# ===========================================

if __name__ == "__main__":
    print("=== 지역별 요금 분석 ===\\n")

    popular = analyze_popular_zones(df)
    fares = analyze_zone_fares(df)
    od = create_od_matrix(df)
    airport = analyze_airports(df)

    print_zone_analysis(popular, fares, od, airport)
`,
      instructions: '지역별 운행 패턴과 요금을 분석합니다. 인기 승하차 지역, 지역별 요금 차이, OD 매트릭스, 공항 이용 패턴을 파악합니다.',
      keyPoints: [
        'value_counts()로 빈도 분석',
        'pivot_table()로 OD 매트릭스 생성',
        '공항 특수 지역 별도 분석',
        '지역ID → 지역명 매핑으로 가독성 향상'
      ]
    }
  },

  // Task 6: 최종 프로젝트 (Code)
  {
    id: 'w2d5-task6',
    title: 'Part 4: 종합 분석 파이프라인',
    type: 'code',
    duration: 30,
    content: {
      objectives: [
        '전체 분석 파이프라인 통합',
        'pandas vs Polars 성능 비교',
        '최종 리포트 생성',
        '인사이트 도출'
      ],
      starterCode: `import pandas as pd
import polars as pl
import numpy as np
import time
from typing import Dict, Any

# ===========================================
# 최종 프로젝트: NYC Taxi 종합 분석 파이프라인
# ===========================================

class NYCTaxiAnalyzer:
    """NYC Taxi 데이터 종합 분석기"""

    def __init__(self, filepath: str):
        self.filepath = filepath
        self.df = None
        self.results = {}
        self.performance = {}

    # ===========================================
    # 데이터 로딩
    # ===========================================

    def load_data(self, backend='pandas'):
        """데이터 로딩"""
        # TODO: pandas와 polars 모두 지원
        pass

    # ===========================================
    # 시간대별 분석
    # ===========================================

    def analyze_time_patterns(self) -> Dict[str, Any]:
        """시간대별 패턴 분석"""
        # TODO: 이전 태스크의 분석 통합
        pass

    # ===========================================
    # 지역별 분석
    # ===========================================

    def analyze_zones(self) -> Dict[str, Any]:
        """지역별 분석"""
        # TODO: 이전 태스크의 분석 통합
        pass

    # ===========================================
    # 팁 분석 (선택 과제)
    # ===========================================

    def analyze_tips(self) -> Dict[str, Any]:
        """팁 패턴 분석"""
        # TODO: 구현
        # 1. 팁 분포 분석
        # 2. 팁 비율 계산 (tip_amount / fare_amount)
        # 3. 팁에 영향을 주는 요인 분석
        pass

    # ===========================================
    # pandas vs Polars 비교 (선택 과제)
    # ===========================================

    def compare_backends(self) -> Dict[str, Any]:
        """pandas vs Polars 성능 비교"""
        # TODO: 구현
        # 1. 동일한 분석을 두 백엔드로 수행
        # 2. 실행 시간 비교
        # 3. 메모리 사용량 비교
        pass

    # ===========================================
    # 리포트 생성
    # ===========================================

    def generate_report(self) -> str:
        """최종 분석 리포트 생성"""
        # TODO: 모든 분석 결과를 종합한 리포트
        pass

    # ===========================================
    # 메인 실행
    # ===========================================

    def run_full_analysis(self):
        """전체 분석 파이프라인 실행"""
        print("=== NYC Taxi 종합 분석 시작 ===\\n")

        # 1. 데이터 로딩
        print("[1/5] 데이터 로딩...")
        self.load_data()

        # 2. 시간대별 분석
        print("[2/5] 시간대별 분석...")
        self.results['time'] = self.analyze_time_patterns()

        # 3. 지역별 분석
        print("[3/5] 지역별 분석...")
        self.results['zones'] = self.analyze_zones()

        # 4. 팁 분석
        print("[4/5] 팁 분석...")
        self.results['tips'] = self.analyze_tips()

        # 5. 백엔드 비교
        print("[5/5] 백엔드 비교...")
        self.results['backend'] = self.compare_backends()

        # 리포트 생성
        print("\\n" + "=" * 60)
        print(self.generate_report())

        return self.results

# ===========================================
# 실행
# ===========================================

if __name__ == "__main__":
    analyzer = NYCTaxiAnalyzer('yellow_tripdata_2022-01.parquet')
    results = analyzer.run_full_analysis()
`,
      solutionCode: `import pandas as pd
import polars as pl
import numpy as np
import time
import tracemalloc
from typing import Dict, Any

class NYCTaxiAnalyzer:
    """NYC Taxi 데이터 종합 분석기"""

    COLUMNS = [
        'tpep_pickup_datetime', 'tpep_dropoff_datetime',
        'passenger_count', 'trip_distance',
        'PULocationID', 'DOLocationID', 'payment_type',
        'fare_amount', 'tip_amount', 'total_amount'
    ]

    def __init__(self, filepath: str):
        self.filepath = filepath
        self.df = None
        self.df_polars = None
        self.results = {}
        self.performance = {}

    def load_data(self, backend='pandas'):
        """데이터 로딩"""
        start = time.time()
        tracemalloc.start()

        if backend == 'pandas':
            self.df = pd.read_parquet(self.filepath, columns=self.COLUMNS)
            # 시간 특성 추가
            self.df['hour'] = self.df['tpep_pickup_datetime'].dt.hour
            self.df['day_of_week'] = self.df['tpep_pickup_datetime'].dt.dayofweek
            self.df['is_weekend'] = self.df['day_of_week'].isin([5, 6])
        else:
            self.df_polars = pl.read_parquet(self.filepath, columns=self.COLUMNS)

        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        self.performance['load'] = {
            'time': time.time() - start,
            'memory_mb': peak / 1024**2
        }

        print(f"  로딩 완료: {len(self.df):,} 행")
        print(f"  시간: {self.performance['load']['time']:.2f}초")
        print(f"  메모리: {self.performance['load']['memory_mb']:.1f} MB")

        return self

    def analyze_time_patterns(self) -> Dict[str, Any]:
        """시간대별 패턴 분석"""
        start = time.time()

        hourly = self.df.groupby('hour').agg({
            'fare_amount': ['count', 'mean'],
            'trip_distance': 'mean',
            'tip_amount': 'mean'
        }).round(2)
        hourly.columns = ['trips', 'avg_fare', 'avg_distance', 'avg_tip']

        daily = self.df.groupby('day_of_week').agg({
            'fare_amount': ['count', 'mean']
        }).round(2)
        daily.columns = ['trips', 'avg_fare']

        # 피크 시간
        peak_hour = hourly['trips'].idxmax()
        slow_hour = hourly['trips'].idxmin()

        self.performance['time_analysis'] = time.time() - start

        return {
            'hourly': hourly,
            'daily': daily,
            'peak_hour': peak_hour,
            'slow_hour': slow_hour,
            'weekday_avg_trips': daily.loc[0:4, 'trips'].mean(),
            'weekend_avg_trips': daily.loc[5:6, 'trips'].mean()
        }

    def analyze_zones(self) -> Dict[str, Any]:
        """지역별 분석"""
        start = time.time()

        # Top 10 승차 지역
        top_pickups = self.df['PULocationID'].value_counts().head(10)

        # Top 10 하차 지역
        top_dropoffs = self.df['DOLocationID'].value_counts().head(10)

        # 지역별 평균 요금
        zone_fares = self.df.groupby('PULocationID').agg({
            'fare_amount': ['count', 'mean']
        }).round(2)
        zone_fares.columns = ['trips', 'avg_fare']
        zone_fares = zone_fares[zone_fares['trips'] >= 100].sort_values('avg_fare', ascending=False)

        self.performance['zone_analysis'] = time.time() - start

        return {
            'top_pickups': top_pickups,
            'top_dropoffs': top_dropoffs,
            'high_fare_zones': zone_fares.head(5),
            'low_fare_zones': zone_fares.tail(5)
        }

    def analyze_tips(self) -> Dict[str, Any]:
        """팁 패턴 분석"""
        start = time.time()

        # 현금 결제 제외 (팁 0인 경우가 많음)
        df_card = self.df[self.df['payment_type'] == 1]

        # 팁 비율 계산
        df_card = df_card.copy()
        df_card['tip_pct'] = (df_card['tip_amount'] / df_card['fare_amount'] * 100).clip(0, 100)

        # 팁 분포
        tip_stats = {
            'mean': df_card['tip_amount'].mean(),
            'median': df_card['tip_amount'].median(),
            'std': df_card['tip_amount'].std(),
            'pct_25': df_card['tip_amount'].quantile(0.25),
            'pct_75': df_card['tip_amount'].quantile(0.75)
        }

        # 팁 비율 분포
        tip_pct_stats = {
            'mean_pct': df_card['tip_pct'].mean(),
            'median_pct': df_card['tip_pct'].median()
        }

        # 시간대별 팁
        hourly_tip = df_card.groupby(df_card['tpep_pickup_datetime'].dt.hour)['tip_pct'].mean()

        # 거리별 팁
        df_card['distance_bin'] = pd.cut(df_card['trip_distance'], bins=[0, 2, 5, 10, 100], labels=['Short', 'Medium', 'Long', 'Very Long'])
        distance_tip = df_card.groupby('distance_bin')['tip_pct'].mean()

        self.performance['tip_analysis'] = time.time() - start

        return {
            'tip_stats': tip_stats,
            'tip_pct_stats': tip_pct_stats,
            'hourly_tip_pct': hourly_tip,
            'distance_tip_pct': distance_tip
        }

    def compare_backends(self) -> Dict[str, Any]:
        """pandas vs Polars 성능 비교"""
        results = {}

        # pandas 테스트
        start = time.time()
        _ = self.df.groupby(['hour', 'day_of_week']).agg({
            'fare_amount': 'mean',
            'trip_distance': 'mean',
            'tip_amount': 'sum'
        })
        results['pandas_groupby'] = time.time() - start

        # Polars 테스트
        df_pl = pl.from_pandas(self.df)
        start = time.time()
        _ = df_pl.group_by(['hour', 'day_of_week']).agg([
            pl.col('fare_amount').mean(),
            pl.col('trip_distance').mean(),
            pl.col('tip_amount').sum()
        ])
        results['polars_groupby'] = time.time() - start

        results['speedup'] = results['pandas_groupby'] / results['polars_groupby']

        return results

    def generate_report(self) -> str:
        """최종 분석 리포트 생성"""
        report = []
        report.append("=" * 60)
        report.append("NYC Taxi 데이터 분석 리포트")
        report.append("=" * 60)

        # 데이터 개요
        report.append(f"\\n📊 데이터 개요")
        report.append(f"  - 총 운행 건수: {len(self.df):,}")
        report.append(f"  - 분석 기간: {self.df['tpep_pickup_datetime'].min().date()} ~ {self.df['tpep_pickup_datetime'].max().date()}")

        # 시간 패턴
        time_results = self.results.get('time', {})
        report.append(f"\\n⏰ 시간 패턴")
        report.append(f"  - 피크 시간: {time_results.get('peak_hour')}시")
        report.append(f"  - 한가한 시간: {time_results.get('slow_hour')}시")
        report.append(f"  - 평일 평균: {time_results.get('weekday_avg_trips', 0):,.0f}건/일")
        report.append(f"  - 주말 평균: {time_results.get('weekend_avg_trips', 0):,.0f}건/일")

        # 지역 분석
        zone_results = self.results.get('zones', {})
        report.append(f"\\n📍 지역 분석")
        if 'top_pickups' in zone_results:
            top_zone = zone_results['top_pickups'].index[0]
            report.append(f"  - 가장 인기 승차 지역: Zone {top_zone}")
        if 'high_fare_zones' in zone_results:
            report.append(f"  - 고요금 지역: {zone_results['high_fare_zones'].index[0]}")

        # 팁 분석
        tip_results = self.results.get('tips', {})
        if 'tip_stats' in tip_results:
            report.append(f"\\n💰 팁 분석")
            report.append(f"  - 평균 팁: \${tip_results['tip_stats']['mean']:.2f}")
            report.append(f"  - 중앙값: \${tip_results['tip_stats']['median']:.2f}")
            report.append(f"  - 평균 팁 비율: {tip_results['tip_pct_stats']['mean_pct']:.1f}%")

        # 성능 비교
        backend_results = self.results.get('backend', {})
        if 'speedup' in backend_results:
            report.append(f"\\n⚡ 성능 비교 (pandas vs Polars)")
            report.append(f"  - pandas: {backend_results['pandas_groupby']:.4f}초")
            report.append(f"  - Polars: {backend_results['polars_groupby']:.4f}초")
            report.append(f"  - 속도 향상: {backend_results['speedup']:.1f}배")

        # 처리 시간
        report.append(f"\\n⏱️ 처리 시간")
        for key, val in self.performance.items():
            if isinstance(val, dict):
                report.append(f"  - {key}: {val.get('time', 0):.2f}초")
            else:
                report.append(f"  - {key}: {val:.2f}초")

        report.append("\\n" + "=" * 60)
        return "\\n".join(report)

    def run_full_analysis(self):
        """전체 분석 파이프라인 실행"""
        print("=== NYC Taxi 종합 분석 시작 ===\\n")

        print("[1/5] 데이터 로딩...")
        self.load_data()

        print("[2/5] 시간대별 분석...")
        self.results['time'] = self.analyze_time_patterns()

        print("[3/5] 지역별 분석...")
        self.results['zones'] = self.analyze_zones()

        print("[4/5] 팁 분석...")
        self.results['tips'] = self.analyze_tips()

        print("[5/5] 백엔드 비교...")
        self.results['backend'] = self.compare_backends()

        print("\\n" + self.generate_report())

        return self.results

if __name__ == "__main__":
    analyzer = NYCTaxiAnalyzer('yellow_tripdata_2022-01.parquet')
    results = analyzer.run_full_analysis()
`,
      instructions: '지금까지 배운 모든 기술을 활용하여 NYC Taxi 데이터 종합 분석 파이프라인을 완성합니다. 시간대별, 지역별, 팁 분석과 pandas/Polars 성능 비교를 포함합니다.',
      keyPoints: [
        '클래스 기반 분석 파이프라인 설계',
        '모든 분석 결과를 results 딕셔너리에 저장',
        '성능 측정으로 병목 지점 파악',
        '최종 리포트로 인사이트 전달'
      ]
    }
  },

  // Task 7: 프로젝트 체크리스트
  {
    id: 'w2d5-task7',
    title: '프로젝트 제출 체크리스트',
    type: 'reading',
    duration: 5,
    content: {
      objectives: [
        '프로젝트 완료 확인',
        '제출 요구사항 점검',
        '평가 기준 최종 확인',
        '추가 개선 아이디어'
      ],
      markdown: `
# 프로젝트 제출 체크리스트

## 필수 과제 (70점)

### 1. 데이터 로딩 최적화 (20점)
- [ ] 필요 컬럼만 선택하여 로딩
- [ ] dtype 최적화 적용
- [ ] 메모리 사용량 4GB 이하
- [ ] 로딩 시간/메모리 측정 결과 포함

### 2. 시간대별 분석 (25점)
- [ ] 시간 특성 추출 (hour, day_of_week, is_weekend)
- [ ] 시간대별 운행 건수/평균 요금
- [ ] 요일별 패턴 분석
- [ ] 피크 시간 식별

### 3. 지역별 분석 (25점)
- [ ] Top 10 승차/하차 지역
- [ ] 지역별 평균 요금 분석
- [ ] OD 매트릭스 생성
- [ ] 공항 관련 분석 (선택)

## 선택 과제 (30점)

### 4. 팁 분석 (15점)
- [ ] 팁 금액 분포 분석
- [ ] 팁 비율 계산 및 분석
- [ ] 팁에 영향을 주는 요인 분석
- [ ] 인사이트 도출

### 5. pandas vs Polars 비교 (15점)
- [ ] 동일 분석 두 백엔드로 수행
- [ ] 실행 시간 비교
- [ ] 메모리 사용량 비교
- [ ] 코드 복잡도 비교

## 제출 형식

### 파일 구조
\`\`\`
project/
├── README.md           # 프로젝트 설명
├── analysis.py         # 메인 분석 코드
├── data_loader.py      # 데이터 로딩 모듈
├── visualizations.py   # 시각화 코드 (선택)
├── report.md           # 분석 리포트
└── requirements.txt    # 의존성
\`\`\`

### README.md 필수 항목
- 프로젝트 개요
- 실행 방법
- 주요 발견점 요약
- 성능 최적화 결과

## 평가 기준 상세

| 항목 | 배점 | 우수 기준 |
|------|------|-----------|
| 코드 품질 | 20% | 함수화, 클래스화, 주석 |
| 성능 최적화 | 30% | 메모리 50%+ 절약, 빠른 실행 |
| 분석 깊이 | 30% | 다양한 인사이트, 논리적 해석 |
| 문서화 | 20% | 명확한 설명, 재현 가능 |

## 추가 개선 아이디어

도전해볼 만한 확장 과제:

1. **실시간 대시보드**
   - Streamlit/Dash로 인터랙티브 시각화

2. **예측 모델**
   - 요금 예측 모델 구축
   - 팁 예측 모델

3. **지리 시각화**
   - folium으로 지도 시각화
   - 히트맵 생성

4. **시계열 분석**
   - 일별/주별 트렌드 분석
   - 계절성 패턴 탐지

5. **대용량 확장**
   - 1년치 데이터 처리
   - Dask/Spark 활용
      `,
      keyPoints: [
        '필수 과제 70점 + 선택 과제 30점',
        '메모리 4GB 이하로 처리하는 것이 핵심',
        '코드 품질과 문서화도 평가 대상',
        '추가 개선으로 포트폴리오 가치 향상'
      ]
    }
  }
]
