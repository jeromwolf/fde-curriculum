// Day 1: 대용량 데이터 처리
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'large-data-intro-video',
    type: 'video',
    title: '왜 대용량 데이터 처리가 어려운가?',
    duration: 15,
    content: {
      objectives: [
        '메모리 제약과 대용량 데이터 처리의 도전을 이해한다',
        'pandas의 메모리 사용 패턴을 파악한다',
        '대용량 데이터 처리 전략의 종류를 안다'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=u4_c2LDi4b8',
      transcript: `
## 대용량 데이터의 현실

실무에서 만나는 데이터는 GB 단위를 넘어가는 경우가 많습니다. 하지만 일반적인 방법으로 pandas를 사용하면 메모리 문제에 부딪힙니다.

### 메모리 문제의 원인

\`\`\`
┌───────────────────────────────────────────────────────────┐
│  왜 pandas는 메모리를 많이 사용할까?                        │
├───────────────────────────────────────────────────────────┤
│  1. 전체 데이터를 메모리에 로드                             │
│  2. 문자열은 Python 객체로 저장 (오버헤드 큼)               │
│  3. 기본 dtype이 넉넉함 (int64, float64)                   │
│  4. 연산 중 임시 복사본 생성                               │
└───────────────────────────────────────────────────────────┘
\`\`\`

### 메모리 사용량 추정

| CSV 크기 | 메모리 사용량 (대략) | 이유 |
|----------|---------------------|------|
| 1 GB | 2-5 GB | 문자열 변환, dtype 오버헤드 |
| 5 GB | 10-25 GB | 동일 비율 |
| 10 GB | 불가능 | 대부분 PC에서 OOM |

### 해결 전략 Overview

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  대용량 데이터 처리 전략                                      │
├─────────────────────────────────────────────────────────────┤
│  1. Chunk 처리    → 데이터를 조각내어 순차 처리              │
│  2. dtype 최적화  → 메모리 사용량 50-90% 절약               │
│  3. 필요 컬럼만   → usecols로 필요한 것만 로드              │
│  4. 파일 포맷     → CSV → Parquet (5-10배 효율)            │
│  5. 대안 도구     → Polars, Dask, Vaex                     │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 핵심 메시지

> "1GB 파일을 읽으려면 3GB 메모리가 필요할 수 있다. 전략 없이 \`pd.read_csv()\`를 호출하지 마라."
      `,
      keyPoints: [
        'pandas는 전체 데이터를 메모리에 로드',
        'CSV 크기의 2-5배 메모리 필요',
        'Chunk, dtype, usecols, Parquet 등 전략 필요',
        '전략 없으면 OOM(Out of Memory) 발생'
      ]
    }
  },
  {
    id: 'chunk-processing-video',
    type: 'video',
    title: 'Chunk 단위 처리 패턴',
    duration: 15,
    content: {
      objectives: [
        'chunksize 파라미터의 동작 원리를 이해한다',
        '청크 단위 집계와 결합 패턴을 익힌다',
        '메모리 효율적인 데이터 처리 파이프라인을 설계한다'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=5J5RiMFj8Ag',
      transcript: `
## Chunk 처리란?

**Chunk 처리**는 대용량 파일을 작은 조각(chunk)으로 나누어 순차적으로 처리하는 방법입니다.

### 기본 패턴

\`\`\`python
import pandas as pd

# chunksize로 이터레이터 생성
chunks = pd.read_csv('large.csv', chunksize=100_000)

# 각 청크를 순차 처리
results = []
for chunk in chunks:
    processed = process(chunk)
    results.append(processed)

# 결과 합치기
final = pd.concat(results, ignore_index=True)
\`\`\`

### 집계 연산 패턴

\`\`\`python
# 패턴 1: 합계/개수 집계
total_sum = 0
total_count = 0

for chunk in pd.read_csv('large.csv', chunksize=100_000):
    total_sum += chunk['amount'].sum()
    total_count += len(chunk)

average = total_sum / total_count
\`\`\`

\`\`\`python
# 패턴 2: 그룹별 집계
from collections import defaultdict

group_sums = defaultdict(float)
group_counts = defaultdict(int)

for chunk in pd.read_csv('large.csv', chunksize=100_000):
    for category, amount in zip(chunk['category'], chunk['amount']):
        group_sums[category] += amount
        group_counts[category] += 1

# 그룹별 평균
group_avg = {k: group_sums[k] / group_counts[k] for k in group_sums}
\`\`\`

### Chunk 크기 선정

| RAM | 권장 chunksize | 이유 |
|-----|---------------|------|
| 8GB | 50,000 - 100,000 | 여유 메모리 확보 |
| 16GB | 100,000 - 500,000 | 적절한 균형 |
| 32GB+ | 500,000 - 1,000,000 | 속도 우선 |

\`\`\`python
# 동적 chunksize 계산
import psutil

available_mb = psutil.virtual_memory().available / 1024 / 1024
# 사용 가능 메모리의 10%만 사용
chunksize = int(available_mb * 1000 / 10)  # 대략적 계산
\`\`\`

### 핵심 메시지

> "Chunk 처리의 핵심은 **중간 결과 합치기** 전략이다. 합계, 개수, min, max는 쉽지만 중앙값, 분위수는 어렵다."
      `,
      keyPoints: [
        'chunksize로 이터레이터 생성',
        '청크별 처리 후 결과 합치기',
        'RAM에 따라 chunksize 조절',
        '합계/개수는 쉽지만 중앙값은 복잡'
      ]
    }
  },
  {
    id: 'chunk-processing-code',
    type: 'code',
    title: 'Chunk 처리 실습',
    duration: 20,
    content: {
      objectives: [
        'chunksize를 사용한 대용량 파일 처리를 구현한다',
        '청크별 집계 후 결과를 합친다',
        '메모리 사용량을 모니터링한다'
      ],
      instructions: `
Chunk 처리를 사용하여 대용량 CSV 파일을 효율적으로 분석합니다.

## 요구사항
1. chunksize=100,000으로 파일 읽기
2. 각 청크에서 category별 amount 합계 계산
3. 청크 결과들을 합쳐서 최종 집계
4. 메모리 사용량 출력
      `,
      starterCode: `
import pandas as pd
import sys

def get_memory_usage():
    """현재 DataFrame들의 메모리 사용량 반환 (MB)"""
    # TODO: 구현하세요
    pass


def process_chunk(chunk: pd.DataFrame) -> pd.DataFrame:
    """청크별 집계 처리

    Args:
        chunk: 입력 청크

    Returns:
        pd.DataFrame: category별 amount 합계와 개수
    """
    # TODO: 구현하세요
    pass


def aggregate_results(results: list) -> pd.DataFrame:
    """청크 결과들을 합쳐서 최종 집계

    Args:
        results: 청크별 집계 결과 리스트

    Returns:
        pd.DataFrame: 최종 집계 결과
    """
    # TODO: 구현하세요
    pass


def process_large_file(filepath: str, chunksize: int = 100_000) -> pd.DataFrame:
    """대용량 파일을 청크 단위로 처리

    Args:
        filepath: CSV 파일 경로
        chunksize: 청크 크기

    Returns:
        pd.DataFrame: 최종 집계 결과
    """
    # TODO: 구현하세요
    pass


# 테스트용 샘플 데이터 생성
import numpy as np

np.random.seed(42)
n_rows = 500_000  # 50만 행

sample_data = pd.DataFrame({
    'id': range(n_rows),
    'category': np.random.choice(['A', 'B', 'C', 'D'], n_rows),
    'amount': np.random.uniform(10, 1000, n_rows),
    'date': pd.date_range('2024-01-01', periods=n_rows, freq='s')
})
sample_data.to_csv('/tmp/large_sample.csv', index=False)
print(f"샘플 파일 생성: {n_rows:,}행")

# 처리 실행
result = process_large_file('/tmp/large_sample.csv')
print("\\n=== 최종 결과 ===")
print(result)
      `,
      solutionCode: `
import pandas as pd
import sys
import tracemalloc

def get_memory_usage():
    """현재 DataFrame들의 메모리 사용량 반환 (MB)

    💡 tracemalloc을 사용하여 메모리 추적
    """
    current, peak = tracemalloc.get_traced_memory()
    return current / 1024 / 1024  # MB


def process_chunk(chunk: pd.DataFrame) -> pd.DataFrame:
    """청크별 집계 처리

    🎯 역할: 각 청크에서 category별 통계 계산

    💡 핵심 포인트:
    - groupby로 category별 집계
    - sum과 count 모두 계산 (나중에 평균 계산용)
    """
    return chunk.groupby('category').agg(
        amount_sum=('amount', 'sum'),
        count=('amount', 'count')
    ).reset_index()


def aggregate_results(results: list) -> pd.DataFrame:
    """청크 결과들을 합쳐서 최종 집계

    🎯 역할: 청크별 부분 집계를 합쳐 전체 통계 계산

    💡 핵심 포인트:
    - concat으로 모든 청크 결과 합치기
    - 다시 groupby로 전체 합계 계산
    - 평균 = 총합 / 총개수
    """
    combined = pd.concat(results, ignore_index=True)

    final = combined.groupby('category').agg(
        total_amount=('amount_sum', 'sum'),
        total_count=('count', 'sum')
    ).reset_index()

    final['average'] = final['total_amount'] / final['total_count']
    return final.sort_values('total_amount', ascending=False)


def process_large_file(filepath: str, chunksize: int = 100_000) -> pd.DataFrame:
    """대용량 파일을 청크 단위로 처리

    🎯 역할: 메모리 효율적인 대용량 파일 처리

    💡 핵심 포인트:
    - chunksize로 이터레이터 생성
    - 각 청크를 처리하고 결과만 저장
    - 원본 청크는 즉시 메모리에서 해제
    """
    tracemalloc.start()

    results = []
    chunk_count = 0

    print("청크 처리 시작...")
    for chunk in pd.read_csv(filepath, chunksize=chunksize):
        chunk_count += 1
        processed = process_chunk(chunk)
        results.append(processed)

        if chunk_count % 3 == 0:
            print(f"  청크 {chunk_count} 완료, 메모리: {get_memory_usage():.1f} MB")

    print(f"총 {chunk_count}개 청크 처리 완료")
    print(f"최종 메모리 사용: {get_memory_usage():.1f} MB")

    final = aggregate_results(results)

    tracemalloc.stop()
    return final


# 테스트용 샘플 데이터 생성
import numpy as np

np.random.seed(42)
n_rows = 500_000  # 50만 행

sample_data = pd.DataFrame({
    'id': range(n_rows),
    'category': np.random.choice(['A', 'B', 'C', 'D'], n_rows),
    'amount': np.random.uniform(10, 1000, n_rows),
    'date': pd.date_range('2024-01-01', periods=n_rows, freq='s')
})
sample_data.to_csv('/tmp/large_sample.csv', index=False)
print(f"샘플 파일 생성: {n_rows:,}행")

# 처리 실행
result = process_large_file('/tmp/large_sample.csv')
print("\\n=== 최종 결과 ===")
print(result)

# 메모리 비교: 전체 로드 vs 청크 처리
print("\\n=== 메모리 비교 ===")
tracemalloc.start()
df_full = pd.read_csv('/tmp/large_sample.csv')
current, _ = tracemalloc.get_traced_memory()
print(f"전체 로드: {current / 1024 / 1024:.1f} MB")
tracemalloc.stop()
      `,
      keyPoints: [
        'chunksize로 이터레이터 생성',
        '청크별로 부분 집계 계산',
        '결과 합칠 때 sum, count 따로 관리',
        'tracemalloc으로 메모리 모니터링'
      ]
    }
  },
  {
    id: 'dtype-optimization-video',
    type: 'video',
    title: 'dtype 최적화로 메모리 50-90% 절약',
    duration: 15,
    content: {
      objectives: [
        'pandas의 기본 dtype과 메모리 사용량을 이해한다',
        '최적의 dtype을 선택하는 방법을 익힌다',
        'category 타입의 효과를 파악한다'
      ],
      transcript: `
## dtype이 메모리에 미치는 영향

pandas는 기본적으로 **넉넉한 dtype**을 사용합니다. 이것이 메모리 낭비의 주범입니다.

### 기본 dtype vs 최적화 dtype

| 데이터 | 기본 dtype | 최적 dtype | 절약률 |
|--------|-----------|-----------|--------|
| 정수 (0-100) | int64 (8B) | int8 (1B) | 87.5% |
| 정수 (0-65535) | int64 (8B) | uint16 (2B) | 75% |
| 실수 (일반) | float64 (8B) | float32 (4B) | 50% |
| 카테고리 | object (가변) | category | 90%+ |

### 정수 타입 선택 가이드

\`\`\`
┌────────────────────────────────────────────────────────────┐
│  정수 타입 범위                                             │
├────────────────────────────────────────────────────────────┤
│  int8:   -128 ~ 127                    (1 byte)           │
│  int16:  -32,768 ~ 32,767              (2 bytes)          │
│  int32:  -2.1B ~ 2.1B                  (4 bytes)          │
│  int64:  -9.2E ~ 9.2E                  (8 bytes)          │
├────────────────────────────────────────────────────────────┤
│  uint8:  0 ~ 255                       (1 byte)           │
│  uint16: 0 ~ 65,535                    (2 bytes)          │
│  uint32: 0 ~ 4.3B                      (4 bytes)          │
└────────────────────────────────────────────────────────────┘
\`\`\`

### Category 타입의 마법

\`\`\`python
# 카테고리가 적은 문자열에 매우 효과적
df['status'] = df['status'].astype('category')

# 예: 100만 행, 상태값 3개 (active, pending, closed)
# object: ~80 MB
# category: ~1 MB (80배 절약!)
\`\`\`

### 코드 예시

\`\`\`python
# 방법 1: read_csv에서 dtype 지정
dtypes = {
    'id': 'int32',
    'age': 'int8',
    'salary': 'float32',
    'department': 'category',
    'status': 'category'
}
df = pd.read_csv('data.csv', dtype=dtypes)

# 방법 2: 로드 후 변환
df['age'] = df['age'].astype('int8')
df['status'] = df['status'].astype('category')

# 메모리 확인
print(df.memory_usage(deep=True))
\`\`\`

### 핵심 메시지

> "dtype 최적화만으로 메모리를 50-90% 절약할 수 있다. 데이터의 실제 범위를 확인하고 적절한 타입을 선택하라."
      `,
      keyPoints: [
        '기본 int64를 int8/int16/int32로 변경하면 87.5%까지 절약',
        'float64 → float32로 50% 절약',
        'category 타입은 반복 문자열에 90%+ 절약',
        'memory_usage(deep=True)로 실제 메모리 확인'
      ]
    }
  },
  {
    id: 'dtype-optimization-code',
    type: 'code',
    title: 'dtype 최적화 실습',
    duration: 20,
    content: {
      objectives: [
        '컬럼별 최적 dtype을 자동으로 추론한다',
        'dtype 최적화 전후 메모리 사용량을 비교한다',
        '최적화 함수를 재사용 가능하게 구현한다'
      ],
      instructions: `
DataFrame의 dtype을 자동으로 최적화하는 함수를 구현합니다.

## 요구사항
1. 정수 컬럼: 값 범위에 맞는 최소 int 타입 선택
2. 실수 컬럼: float32로 다운캐스트
3. 문자열 컬럼: 유니크 비율이 낮으면 category로 변환
4. 최적화 전후 메모리 비교 출력
      `,
      starterCode: `
import pandas as pd
import numpy as np

def optimize_dtypes(df: pd.DataFrame, category_threshold: float = 0.5) -> pd.DataFrame:
    """DataFrame의 dtype을 최적화하여 메모리 절약

    Args:
        df: 입력 DataFrame
        category_threshold: 유니크 비율이 이 값 이하면 category로 변환

    Returns:
        pd.DataFrame: dtype이 최적화된 DataFrame
    """
    # TODO: 구현하세요
    pass


def optimize_integers(df: pd.DataFrame) -> pd.DataFrame:
    """정수 컬럼을 최소 필요 dtype으로 변환"""
    # TODO: 구현하세요
    pass


def optimize_floats(df: pd.DataFrame) -> pd.DataFrame:
    """실수 컬럼을 float32로 변환"""
    # TODO: 구현하세요
    pass


def optimize_objects(df: pd.DataFrame, threshold: float) -> pd.DataFrame:
    """문자열 컬럼을 category로 변환 (유니크 비율이 낮으면)"""
    # TODO: 구현하세요
    pass


def compare_memory(before: pd.DataFrame, after: pd.DataFrame) -> None:
    """최적화 전후 메모리 비교 출력"""
    # TODO: 구현하세요
    pass


# 테스트 데이터 생성
np.random.seed(42)
n_rows = 100_000

df = pd.DataFrame({
    'id': np.arange(n_rows),  # 0 ~ 99999
    'age': np.random.randint(0, 100, n_rows),  # 0 ~ 99
    'score': np.random.uniform(0, 100, n_rows),  # 실수
    'category': np.random.choice(['A', 'B', 'C', 'D', 'E'], n_rows),  # 5개 카테고리
    'status': np.random.choice(['active', 'inactive'], n_rows),  # 2개 상태
    'description': ['item_' + str(i % 1000) for i in range(n_rows)]  # 1000개 유니크
})

print("=== 원본 DataFrame ===")
print(df.dtypes)
print(f"\\n메모리: {df.memory_usage(deep=True).sum() / 1024 / 1024:.2f} MB")

# 최적화 실행
df_optimized = optimize_dtypes(df)

print("\\n=== 최적화 후 ===")
print(df_optimized.dtypes)
compare_memory(df, df_optimized)
      `,
      solutionCode: `
import pandas as pd
import numpy as np

def optimize_integers(df: pd.DataFrame) -> pd.DataFrame:
    """정수 컬럼을 최소 필요 dtype으로 변환

    🎯 역할: int64를 int8/int16/int32로 다운캐스트

    💡 핵심 포인트:
    - 값의 min/max를 확인하여 적절한 타입 선택
    - unsigned 사용 가능하면 uint로 변환 (범위 2배)
    """
    int_cols = df.select_dtypes(include=['int64', 'int32']).columns

    for col in int_cols:
        col_min = df[col].min()
        col_max = df[col].max()

        # unsigned 가능 여부 확인
        if col_min >= 0:
            if col_max <= 255:
                df[col] = df[col].astype('uint8')
            elif col_max <= 65535:
                df[col] = df[col].astype('uint16')
            elif col_max <= 4294967295:
                df[col] = df[col].astype('uint32')
        else:
            if col_min >= -128 and col_max <= 127:
                df[col] = df[col].astype('int8')
            elif col_min >= -32768 and col_max <= 32767:
                df[col] = df[col].astype('int16')
            elif col_min >= -2147483648 and col_max <= 2147483647:
                df[col] = df[col].astype('int32')

    return df


def optimize_floats(df: pd.DataFrame) -> pd.DataFrame:
    """실수 컬럼을 float32로 변환

    🎯 역할: float64 → float32로 메모리 50% 절약

    💡 주의: 정밀도가 중요한 금융/과학 계산에서는 주의
    """
    float_cols = df.select_dtypes(include=['float64']).columns

    for col in float_cols:
        df[col] = df[col].astype('float32')

    return df


def optimize_objects(df: pd.DataFrame, threshold: float) -> pd.DataFrame:
    """문자열 컬럼을 category로 변환 (유니크 비율이 낮으면)

    🎯 역할: 반복되는 문자열을 category로 변환하여 메모리 절약

    💡 핵심 포인트:
    - 유니크 비율 = 유니크 개수 / 전체 행 수
    - 비율이 낮을수록 category 효과 큼
    """
    object_cols = df.select_dtypes(include=['object']).columns

    for col in object_cols:
        unique_ratio = df[col].nunique() / len(df)

        if unique_ratio <= threshold:
            df[col] = df[col].astype('category')
            print(f"  {col}: object → category (유니크 비율: {unique_ratio:.2%})")

    return df


def compare_memory(before: pd.DataFrame, after: pd.DataFrame) -> None:
    """최적화 전후 메모리 비교 출력"""
    mem_before = before.memory_usage(deep=True).sum() / 1024 / 1024
    mem_after = after.memory_usage(deep=True).sum() / 1024 / 1024
    reduction = (1 - mem_after / mem_before) * 100

    print(f"\\n📊 메모리 비교:")
    print(f"  최적화 전: {mem_before:.2f} MB")
    print(f"  최적화 후: {mem_after:.2f} MB")
    print(f"  절약: {reduction:.1f}%")


def optimize_dtypes(df: pd.DataFrame, category_threshold: float = 0.5) -> pd.DataFrame:
    """DataFrame의 dtype을 최적화하여 메모리 절약

    🎯 역할: 모든 컬럼의 dtype을 최적화

    Args:
        df: 입력 DataFrame
        category_threshold: 유니크 비율이 이 값 이하면 category로 변환

    Returns:
        pd.DataFrame: dtype이 최적화된 DataFrame
    """
    df = df.copy()

    print("🔧 dtype 최적화 시작...")
    df = optimize_integers(df)
    df = optimize_floats(df)
    df = optimize_objects(df, category_threshold)
    print("✅ 최적화 완료")

    return df


# 테스트 데이터 생성
np.random.seed(42)
n_rows = 100_000

df = pd.DataFrame({
    'id': np.arange(n_rows),  # 0 ~ 99999
    'age': np.random.randint(0, 100, n_rows),  # 0 ~ 99
    'score': np.random.uniform(0, 100, n_rows),  # 실수
    'category': np.random.choice(['A', 'B', 'C', 'D', 'E'], n_rows),  # 5개 카테고리
    'status': np.random.choice(['active', 'inactive'], n_rows),  # 2개 상태
    'description': ['item_' + str(i % 1000) for i in range(n_rows)]  # 1000개 유니크
})

print("=== 원본 DataFrame ===")
print(df.dtypes)
print(f"\\n메모리: {df.memory_usage(deep=True).sum() / 1024 / 1024:.2f} MB")

# 최적화 실행
df_optimized = optimize_dtypes(df)

print("\\n=== 최적화 후 ===")
print(df_optimized.dtypes)
compare_memory(df, df_optimized)
      `,
      keyPoints: [
        '정수는 min/max 확인 후 최소 타입 선택',
        '음수 없으면 uint 사용 (범위 2배)',
        'float64 → float32로 50% 절약',
        '유니크 비율 낮으면 category로 변환'
      ]
    }
  },
  {
    id: 'usecols-skiprows-reading',
    type: 'reading',
    title: '필요한 것만 읽기: usecols, skiprows',
    duration: 10,
    content: {
      objectives: [
        'usecols로 필요한 컬럼만 로드하는 방법을 익힌다',
        'skiprows와 nrows로 일부 행만 읽는 방법을 배운다',
        '조건부 로딩 전략을 이해한다'
      ],
      markdown: `
# 필요한 것만 읽기

가장 효과적인 메모리 절약은 **처음부터 필요한 것만 읽는 것**입니다.

## usecols: 필요한 컬럼만 로드

\`\`\`python
# 방법 1: 컬럼 이름 리스트
df = pd.read_csv('data.csv', usecols=['id', 'name', 'amount'])

# 방법 2: 인덱스로 지정
df = pd.read_csv('data.csv', usecols=[0, 2, 5])

# 방법 3: 람다로 조건 지정
df = pd.read_csv('data.csv', usecols=lambda x: x.startswith('sales_'))
\`\`\`

### 효과

| 전체 컬럼 | 필요 컬럼 | 메모리 절약 |
|----------|----------|------------|
| 100 | 10 | ~90% |
| 50 | 5 | ~90% |
| 20 | 10 | ~50% |

## skiprows & nrows: 필요한 행만 로드

\`\`\`python
# 처음 1000행만 (프로토타입 개발용)
df = pd.read_csv('data.csv', nrows=1000)

# 헤더 + 처음 1000행만
df = pd.read_csv('data.csv', nrows=1000)

# 처음 100행 스킵 (잘못된 데이터 제외)
df = pd.read_csv('data.csv', skiprows=100)

# 특정 행만 스킵 (리스트로 지정)
df = pd.read_csv('data.csv', skiprows=[1, 5, 10])  # 1, 5, 10번 행 스킵

# 람다로 조건부 스킵 (짝수 행만 읽기)
df = pd.read_csv('data.csv', skiprows=lambda x: x % 2 == 1)
\`\`\`

## 복합 사용 예시

\`\`\`python
# 최적화된 로딩: 필요 컬럼 + 필요 행 + dtype 최적화
df = pd.read_csv(
    'large_data.csv',
    usecols=['id', 'category', 'amount'],  # 필요 컬럼만
    nrows=100_000,  # 처음 10만 행만 (개발 중)
    dtype={
        'id': 'int32',
        'category': 'category',
        'amount': 'float32'
    }
)
\`\`\`

## 컬럼 이름 미리 확인

\`\`\`python
# 헤더만 읽어서 컬럼 확인
header = pd.read_csv('data.csv', nrows=0)
print(header.columns.tolist())

# 결과: ['id', 'name', 'category', 'amount', 'date', ...]
\`\`\`

## 실무 팁

| 상황 | 전략 |
|------|------|
| 개발/테스트 | nrows=1000으로 빠른 프로토타입 |
| EDA | usecols로 분석 대상만 로드 |
| 배치 처리 | chunksize + usecols 조합 |
| 특정 기간 | skiprows + nrows (위치 알 때) |

> 💡 **팁**: \`pd.read_csv\`의 첫 호출은 \`nrows=5\`로 데이터 구조 파악 후 전략을 세우세요.
      `,
      externalLinks: [
        { title: 'pandas read_csv 문서', url: 'https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html' },
        { title: 'Efficiently Reading Large CSVs', url: 'https://realpython.com/python-csv/' }
      ],
      keyPoints: [
        'usecols로 필요 컬럼만 로드',
        'nrows로 개발 시 일부만 로드',
        'skiprows로 불필요한 행 제외',
        '복합 사용으로 최대 효과'
      ]
    }
  },
  {
    id: 'parquet-format-video',
    type: 'video',
    title: 'Parquet: CSV보다 10배 효율적인 포맷',
    duration: 10,
    content: {
      objectives: [
        'Parquet 파일 포맷의 장점을 이해한다',
        'CSV와 Parquet의 차이를 파악한다',
        'Parquet 읽기/쓰기 방법을 익힌다'
      ],
      transcript: `
## Parquet이란?

**Parquet**는 컬럼 기반 저장 포맷으로, 빅데이터 처리에 최적화되어 있습니다.

### CSV vs Parquet

| 항목 | CSV | Parquet |
|------|-----|---------|
| 저장 방식 | 행 기반 | 컬럼 기반 |
| 압축 | 없음 | 자동 압축 |
| 파일 크기 | 기준 | 1/5 ~ 1/10 |
| 읽기 속도 | 느림 | 매우 빠름 |
| dtype 보존 | ❌ | ✅ |

### 왜 Parquet가 빠른가?

\`\`\`
CSV (행 기반):
┌─────────────────────────────────────────┐
│ id, name, amount, date                  │
│ 1, Alice, 100, 2024-01-01               │
│ 2, Bob, 200, 2024-01-02                 │
│ 3, Charlie, 150, 2024-01-03             │
└─────────────────────────────────────────┘
→ 특정 컬럼만 읽어도 전체 행을 스캔해야 함

Parquet (컬럼 기반):
┌───────────┐ ┌─────────────┐ ┌──────────┐ ┌───────────────┐
│ id        │ │ name        │ │ amount   │ │ date          │
│ 1         │ │ Alice       │ │ 100      │ │ 2024-01-01    │
│ 2         │ │ Bob         │ │ 200      │ │ 2024-01-02    │
│ 3         │ │ Charlie     │ │ 150      │ │ 2024-01-03    │
└───────────┘ └─────────────┘ └──────────┘ └───────────────┘
→ 필요한 컬럼만 읽으면 됨
\`\`\`

### 사용법

\`\`\`python
# 쓰기
df.to_parquet('data.parquet', engine='pyarrow')

# 읽기
df = pd.read_parquet('data.parquet')

# 특정 컬럼만 읽기 (매우 빠름!)
df = pd.read_parquet('data.parquet', columns=['id', 'amount'])
\`\`\`

### 핵심 메시지

> "실무에서는 CSV 대신 Parquet를 사용하라. 10배 작은 파일, 10배 빠른 로딩."
      `,
      keyPoints: [
        'Parquet는 컬럼 기반 포맷',
        'CSV 대비 1/5 ~ 1/10 파일 크기',
        '필요 컬럼만 읽으면 10배+ 빠름',
        'dtype 자동 보존 (재지정 불필요)'
      ]
    }
  },
  {
    id: 'parquet-code',
    type: 'code',
    title: 'CSV vs Parquet 성능 비교',
    duration: 15,
    content: {
      objectives: [
        'CSV와 Parquet 간 변환을 수행한다',
        '파일 크기와 읽기 속도를 비교한다',
        '컬럼 선택 읽기의 효과를 확인한다'
      ],
      instructions: `
CSV와 Parquet 포맷의 성능을 직접 비교합니다.

## 요구사항
1. 샘플 데이터를 CSV와 Parquet로 저장
2. 파일 크기 비교
3. 전체 읽기 속도 비교
4. 특정 컬럼만 읽기 속도 비교
      `,
      starterCode: `
import pandas as pd
import numpy as np
import time
import os

def create_sample_data(n_rows: int = 500_000) -> pd.DataFrame:
    """샘플 데이터 생성"""
    np.random.seed(42)
    return pd.DataFrame({
        'id': np.arange(n_rows),
        'category': np.random.choice(['A', 'B', 'C', 'D', 'E'], n_rows),
        'value1': np.random.uniform(0, 1000, n_rows),
        'value2': np.random.uniform(0, 1000, n_rows),
        'value3': np.random.uniform(0, 1000, n_rows),
        'date': pd.date_range('2020-01-01', periods=n_rows, freq='s'),
        'description': ['item_' + str(i % 10000) for i in range(n_rows)]
    })


def benchmark_formats(df: pd.DataFrame, csv_path: str, parquet_path: str):
    """CSV와 Parquet 포맷 벤치마크"""
    # TODO: 구현하세요
    # 1. 파일 저장
    # 2. 파일 크기 비교
    # 3. 전체 읽기 속도 비교
    # 4. 특정 컬럼만 읽기 속도 비교
    pass


# 테스트 실행
df = create_sample_data(500_000)
print(f"데이터 크기: {len(df):,}행 × {len(df.columns)}컬럼")

benchmark_formats(df, '/tmp/test.csv', '/tmp/test.parquet')
      `,
      solutionCode: `
import pandas as pd
import numpy as np
import time
import os

def create_sample_data(n_rows: int = 500_000) -> pd.DataFrame:
    """샘플 데이터 생성"""
    np.random.seed(42)
    return pd.DataFrame({
        'id': np.arange(n_rows),
        'category': np.random.choice(['A', 'B', 'C', 'D', 'E'], n_rows),
        'value1': np.random.uniform(0, 1000, n_rows),
        'value2': np.random.uniform(0, 1000, n_rows),
        'value3': np.random.uniform(0, 1000, n_rows),
        'date': pd.date_range('2020-01-01', periods=n_rows, freq='s'),
        'description': ['item_' + str(i % 10000) for i in range(n_rows)]
    })


def get_file_size_mb(path: str) -> float:
    """파일 크기를 MB로 반환"""
    return os.path.getsize(path) / 1024 / 1024


def benchmark_formats(df: pd.DataFrame, csv_path: str, parquet_path: str):
    """CSV와 Parquet 포맷 벤치마크

    🎯 역할: 두 포맷의 파일 크기와 읽기 속도 비교
    """
    print("=" * 60)
    print("CSV vs Parquet 벤치마크")
    print("=" * 60)

    # 1. 파일 저장
    print("\\n📁 파일 저장 중...")
    df.to_csv(csv_path, index=False)
    df.to_parquet(parquet_path, engine='pyarrow')

    # 2. 파일 크기 비교
    csv_size = get_file_size_mb(csv_path)
    parquet_size = get_file_size_mb(parquet_path)

    print(f"\\n📊 파일 크기:")
    print(f"  CSV:     {csv_size:.2f} MB")
    print(f"  Parquet: {parquet_size:.2f} MB")
    print(f"  압축률:  {(1 - parquet_size/csv_size)*100:.1f}% 절약")

    # 3. 전체 읽기 속도 비교
    print(f"\\n⏱️ 전체 읽기 속도:")

    start = time.perf_counter()
    _ = pd.read_csv(csv_path)
    csv_time = time.perf_counter() - start
    print(f"  CSV:     {csv_time:.3f}초")

    start = time.perf_counter()
    _ = pd.read_parquet(parquet_path)
    parquet_time = time.perf_counter() - start
    print(f"  Parquet: {parquet_time:.3f}초")
    print(f"  속도 향상: {csv_time/parquet_time:.1f}배 빠름")

    # 4. 특정 컬럼만 읽기 (2개 컬럼)
    print(f"\\n⏱️ 2개 컬럼만 읽기 속도:")

    start = time.perf_counter()
    _ = pd.read_csv(csv_path, usecols=['id', 'value1'])
    csv_time_cols = time.perf_counter() - start
    print(f"  CSV:     {csv_time_cols:.3f}초")

    start = time.perf_counter()
    _ = pd.read_parquet(parquet_path, columns=['id', 'value1'])
    parquet_time_cols = time.perf_counter() - start
    print(f"  Parquet: {parquet_time_cols:.3f}초")
    print(f"  속도 향상: {csv_time_cols/parquet_time_cols:.1f}배 빠름")

    print("\\n" + "=" * 60)
    print("💡 결론: Parquet는 파일 크기, 읽기 속도 모두 압도적")
    print("=" * 60)


# 테스트 실행
df = create_sample_data(500_000)
print(f"데이터 크기: {len(df):,}행 × {len(df.columns)}컬럼")

benchmark_formats(df, '/tmp/test.csv', '/tmp/test.parquet')
      `,
      keyPoints: [
        'Parquet는 CSV 대비 60-80% 파일 크기 절약',
        '전체 읽기 속도 3-5배 빠름',
        '컬럼 선택 읽기 시 10배+ 빠름',
        '실무에서는 Parquet 사용 권장'
      ]
    }
  },
  {
    id: 'large-data-quiz',
    type: 'quiz',
    title: '대용량 데이터 처리 퀴즈',
    duration: 5,
    content: {
      objectives: [
        '대용량 데이터 처리 전략을 이해했는지 확인한다'
      ],
      questions: [
        {
          question: '1GB CSV 파일을 pandas로 읽을 때 예상 메모리 사용량은?',
          options: [
            '약 1GB (파일 크기와 동일)',
            '약 2-5GB (파일 크기의 2-5배)',
            '약 500MB (파일 크기의 절반)',
            '약 10GB (파일 크기의 10배)'
          ],
          answer: 1,
          explanation: 'pandas는 문자열 변환, dtype 오버헤드 등으로 CSV 크기의 2-5배 메모리를 사용합니다.'
        },
        {
          question: 'dtype 최적화에서 가장 효과적인 전략은?',
          options: [
            'int64 → int32로 변경',
            'float64 → float32로 변경',
            '반복되는 문자열을 category로 변경',
            '모든 컬럼을 object로 변경'
          ],
          answer: 2,
          explanation: 'category 타입은 반복되는 문자열에서 90% 이상 메모리를 절약할 수 있어 가장 효과적입니다.'
        },
        {
          question: 'Parquet 포맷의 장점이 아닌 것은?',
          options: [
            '컬럼 기반 저장으로 특정 컬럼만 빠르게 읽기 가능',
            '자동 압축으로 파일 크기 감소',
            'dtype 정보가 보존됨',
            '텍스트 에디터로 직접 편집 가능'
          ],
          answer: 3,
          explanation: 'Parquet는 바이너리 포맷이므로 텍스트 에디터로 편집할 수 없습니다. 이는 CSV의 장점입니다.'
        }
      ],
      keyPoints: [
        'CSV는 메모리의 2-5배 필요',
        'category 타입이 가장 효과적인 최적화',
        'Parquet는 바이너리 포맷 (편집 불가)'
      ]
    }
  },
  {
    id: 'large-data-challenge',
    type: 'code',
    title: '🏆 Daily Challenge: 메모리 효율적 데이터 로더',
    duration: 30,
    content: {
      objectives: [
        '모든 최적화 기법을 통합한 데이터 로더를 구현한다',
        '자동 dtype 추론과 chunk 처리를 결합한다',
        '메모리 사용량을 모니터링하며 처리한다'
      ],
      instructions: `
## 🏆 Daily Challenge

모든 최적화 기법을 통합한 SmartDataLoader 클래스를 구현하세요.

### 요구사항
1. 자동 dtype 최적화
2. chunksize 자동 계산 (가용 메모리 기반)
3. 메모리 사용량 모니터링
4. CSV/Parquet 자동 감지 및 처리
5. 처리 진행률 표시
      `,
      starterCode: `
import pandas as pd
import numpy as np
import os
import time
from typing import Iterator, Optional, Callable

class SmartDataLoader:
    """메모리 효율적인 데이터 로더

    Features:
    - 자동 dtype 최적화
    - 자동 chunksize 계산
    - 메모리 모니터링
    - CSV/Parquet 자동 감지
    """

    def __init__(self, memory_limit_mb: int = 500):
        """
        Args:
            memory_limit_mb: 사용할 최대 메모리 (MB)
        """
        self.memory_limit_mb = memory_limit_mb

    def load(
        self,
        filepath: str,
        usecols: Optional[list] = None,
        optimize_dtypes: bool = True
    ) -> pd.DataFrame:
        """파일을 메모리 효율적으로 로드

        Args:
            filepath: 파일 경로
            usecols: 로드할 컬럼 목록
            optimize_dtypes: dtype 자동 최적화 여부

        Returns:
            pd.DataFrame: 로드된 DataFrame
        """
        # TODO: 구현하세요
        pass

    def load_chunked(
        self,
        filepath: str,
        process_func: Callable[[pd.DataFrame], pd.DataFrame],
        usecols: Optional[list] = None
    ) -> Iterator[pd.DataFrame]:
        """청크 단위로 처리하며 로드

        Args:
            filepath: 파일 경로
            process_func: 각 청크에 적용할 함수
            usecols: 로드할 컬럼 목록

        Yields:
            pd.DataFrame: 처리된 청크
        """
        # TODO: 구현하세요
        pass

    def _detect_format(self, filepath: str) -> str:
        """파일 포맷 감지"""
        # TODO: 구현하세요
        pass

    def _calculate_chunksize(self, filepath: str) -> int:
        """파일 크기 기반 chunksize 계산"""
        # TODO: 구현하세요
        pass

    def _optimize_dtypes(self, df: pd.DataFrame) -> pd.DataFrame:
        """dtype 자동 최적화"""
        # TODO: 구현하세요
        pass


# 테스트
np.random.seed(42)
n_rows = 200_000

df = pd.DataFrame({
    'id': np.arange(n_rows),
    'category': np.random.choice(['A', 'B', 'C'], n_rows),
    'amount': np.random.uniform(0, 1000, n_rows),
    'count': np.random.randint(0, 100, n_rows)
})

df.to_csv('/tmp/smart_test.csv', index=False)
df.to_parquet('/tmp/smart_test.parquet')

# SmartDataLoader 테스트
loader = SmartDataLoader(memory_limit_mb=100)

print("=== CSV 로드 ===")
df_csv = loader.load('/tmp/smart_test.csv', optimize_dtypes=True)
print(df_csv.dtypes)

print("\\n=== Parquet 로드 ===")
df_parquet = loader.load('/tmp/smart_test.parquet')
print(df_parquet.dtypes)

print("\\n=== 청크 처리 ===")
def aggregate(chunk):
    return chunk.groupby('category')['amount'].sum().reset_index()

results = list(loader.load_chunked('/tmp/smart_test.csv', aggregate))
print(f"청크 수: {len(results)}")
      `,
      solutionCode: `
import pandas as pd
import numpy as np
import os
import time
import tracemalloc
from typing import Iterator, Optional, Callable

class SmartDataLoader:
    """메모리 효율적인 데이터 로더

    🎯 역할: 대용량 데이터를 메모리 효율적으로 로드

    Features:
    - 자동 dtype 최적화
    - 자동 chunksize 계산
    - 메모리 모니터링
    - CSV/Parquet 자동 감지
    """

    def __init__(self, memory_limit_mb: int = 500):
        self.memory_limit_mb = memory_limit_mb

    def _detect_format(self, filepath: str) -> str:
        """파일 포맷 감지"""
        ext = os.path.splitext(filepath)[1].lower()
        if ext == '.parquet':
            return 'parquet'
        elif ext in ['.csv', '.txt']:
            return 'csv'
        else:
            raise ValueError(f"지원하지 않는 포맷: {ext}")

    def _calculate_chunksize(self, filepath: str) -> int:
        """파일 크기 기반 chunksize 계산

        💡 전략: 메모리 제한의 10%를 한 청크가 사용하도록
        """
        file_size_mb = os.path.getsize(filepath) / 1024 / 1024

        # 대략적인 행 수 추정 (1KB당 10행 가정)
        estimated_rows = file_size_mb * 1000 * 10

        # 메모리 제한의 10%를 한 청크가 사용
        chunk_memory_mb = self.memory_limit_mb * 0.1
        memory_per_row_kb = file_size_mb * 1024 / estimated_rows * 3  # 3배 여유

        if memory_per_row_kb > 0:
            chunksize = int(chunk_memory_mb * 1024 / memory_per_row_kb)
        else:
            chunksize = 100_000

        return max(10_000, min(chunksize, 1_000_000))

    def _optimize_dtypes(self, df: pd.DataFrame) -> pd.DataFrame:
        """dtype 자동 최적화"""
        df = df.copy()

        # 정수 최적화
        for col in df.select_dtypes(include=['int64', 'int32']).columns:
            col_min, col_max = df[col].min(), df[col].max()
            if col_min >= 0:
                if col_max <= 255:
                    df[col] = df[col].astype('uint8')
                elif col_max <= 65535:
                    df[col] = df[col].astype('uint16')
            else:
                if col_min >= -128 and col_max <= 127:
                    df[col] = df[col].astype('int8')
                elif col_min >= -32768 and col_max <= 32767:
                    df[col] = df[col].astype('int16')

        # 실수 최적화
        for col in df.select_dtypes(include=['float64']).columns:
            df[col] = df[col].astype('float32')

        # 카테고리 최적화
        for col in df.select_dtypes(include=['object']).columns:
            if df[col].nunique() / len(df) < 0.5:
                df[col] = df[col].astype('category')

        return df

    def load(
        self,
        filepath: str,
        usecols: Optional[list] = None,
        optimize_dtypes: bool = True
    ) -> pd.DataFrame:
        """파일을 메모리 효율적으로 로드"""
        format_type = self._detect_format(filepath)

        tracemalloc.start()
        start_time = time.perf_counter()

        if format_type == 'parquet':
            df = pd.read_parquet(filepath, columns=usecols)
        else:
            df = pd.read_csv(filepath, usecols=usecols)

        if optimize_dtypes and format_type == 'csv':
            df = self._optimize_dtypes(df)

        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()
        elapsed = time.perf_counter() - start_time

        print(f"📊 로드 완료:")
        print(f"  - 행 수: {len(df):,}")
        print(f"  - 소요 시간: {elapsed:.2f}초")
        print(f"  - 메모리: {current/1024/1024:.1f} MB (피크: {peak/1024/1024:.1f} MB)")

        return df

    def load_chunked(
        self,
        filepath: str,
        process_func: Callable[[pd.DataFrame], pd.DataFrame],
        usecols: Optional[list] = None
    ) -> Iterator[pd.DataFrame]:
        """청크 단위로 처리하며 로드"""
        format_type = self._detect_format(filepath)

        if format_type == 'parquet':
            df = pd.read_parquet(filepath, columns=usecols)
            yield process_func(df)
            return

        chunksize = self._calculate_chunksize(filepath)
        print(f"📦 청크 크기: {chunksize:,}")

        chunk_count = 0
        for chunk in pd.read_csv(filepath, chunksize=chunksize, usecols=usecols):
            chunk_count += 1
            chunk = self._optimize_dtypes(chunk)
            yield process_func(chunk)

        print(f"✅ 총 {chunk_count}개 청크 처리 완료")


# 테스트
np.random.seed(42)
n_rows = 200_000

df = pd.DataFrame({
    'id': np.arange(n_rows),
    'category': np.random.choice(['A', 'B', 'C'], n_rows),
    'amount': np.random.uniform(0, 1000, n_rows),
    'count': np.random.randint(0, 100, n_rows)
})

df.to_csv('/tmp/smart_test.csv', index=False)
df.to_parquet('/tmp/smart_test.parquet')

# SmartDataLoader 테스트
loader = SmartDataLoader(memory_limit_mb=100)

print("=== CSV 로드 ===")
df_csv = loader.load('/tmp/smart_test.csv', optimize_dtypes=True)
print(df_csv.dtypes)

print("\\n=== Parquet 로드 ===")
df_parquet = loader.load('/tmp/smart_test.parquet')
print(df_parquet.dtypes)

print("\\n=== 청크 처리 ===")
def aggregate(chunk):
    return chunk.groupby('category')['amount'].sum().reset_index()

results = list(loader.load_chunked('/tmp/smart_test.csv', aggregate))
print(f"청크 수: {len(results)}")

# 결과 합치기
final = pd.concat(results).groupby('category')['amount'].sum().reset_index()
print("\\n최종 집계 결과:")
print(final)
      `,
      keyPoints: [
        '파일 포맷 자동 감지 (CSV/Parquet)',
        '메모리 기반 chunksize 자동 계산',
        'dtype 자동 최적화',
        '청크 처리와 일반 처리 통합'
      ]
    }
  }
]
