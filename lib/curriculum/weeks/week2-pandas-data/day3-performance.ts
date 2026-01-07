// Day 3: 성능 최적화 (apply vs vectorize vs numba)
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  // Task 1: 성능 최적화 개요 (Video)
  {
    id: 'w2d3-task1',
    title: 'pandas 성능 최적화 전략 개요',
    type: 'video',
    duration: 15,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      objectives: [
        'pandas 성능 병목 지점 이해',
        'Python GIL과 pandas의 관계 파악',
        '최적화 전략의 전체 그림 이해',
        '벤치마킹 방법론 학습'
      ],
      transcript: `
# pandas 성능 최적화 마스터하기

안녕하세요! 오늘은 pandas 성능 최적화에 대해 깊이 있게 다뤄보겠습니다.

## 왜 성능 최적화가 중요한가?

pandas는 놀라울 정도로 강력한 도구지만, 잘못 사용하면 심각한 성능 문제가 발생합니다.

\`\`\`python
# 나쁜 예: 100만 행 데이터에서 for 루프
# 실행 시간: ~30초 이상
for idx, row in df.iterrows():
    df.loc[idx, 'new_col'] = row['a'] * 2 + row['b']

# 좋은 예: 벡터화 연산
# 실행 시간: ~0.01초
df['new_col'] = df['a'] * 2 + df['b']
\`\`\`

**3000배 성능 차이!** 이것이 오늘 배울 내용의 핵심입니다.

## 성능 병목의 주요 원인

### 1. Python의 동적 타이핑
Python은 매 연산마다 타입 체크를 수행합니다:
- 숫자 덧셈: 타입 확인 → 연산 → 결과 반환
- C/NumPy: 타입이 고정되어 있어 바로 연산

### 2. GIL (Global Interpreter Lock)
Python의 GIL은 멀티스레딩 성능을 제한합니다:
- CPU-bound 작업: 멀티스레딩 효과 없음
- I/O-bound 작업: 멀티스레딩 효과 있음

### 3. 메모리 복사
pandas는 많은 연산에서 데이터를 복사합니다:
\`\`\`python
# 메모리 복사 발생
df_filtered = df[df['value'] > 100]

# inplace=True도 항상 메모리 효율적이진 않음
df.drop(columns=['temp'], inplace=True)
\`\`\`

## 최적화 전략 피라미드

1. **벡터화 (Vectorization)** - 최우선
2. **NumPy 활용** - 강력한 대안
3. **Cython/Numba** - 극한 성능
4. **병렬 처리** - 대용량 데이터

## 벤치마킹 방법론

\`\`\`python
import timeit

# 기본 측정
%timeit df['a'] * 2  # Jupyter magic

# 상세 측정
def benchmark(func, n_runs=100):
    times = timeit.repeat(func, number=1, repeat=n_runs)
    return {
        'mean': np.mean(times),
        'std': np.std(times),
        'min': np.min(times),
        'max': np.max(times)
    }

# 메모리 측정
import tracemalloc
tracemalloc.start()
# ... 코드 실행 ...
current, peak = tracemalloc.get_traced_memory()
tracemalloc.stop()
\`\`\`
      `,
      keyPoints: [
        '벡터화는 pandas 성능 최적화의 핵심',
        'for 루프와 iterrows()는 가능한 피해야 함',
        'Python GIL은 CPU-bound 멀티스레딩을 제한',
        '항상 벤치마킹으로 실제 성능을 측정해야 함'
      ]
    }
  },

  // Task 2: apply() 함수 이해 (Reading)
  {
    id: 'w2d3-task2',
    title: 'apply() 함수 완전 정복',
    type: 'reading',
    duration: 12,
    content: {
      objectives: [
        'apply()의 동작 방식 이해',
        'axis 매개변수 활용법 학습',
        'apply()의 성능 특성 파악',
        'apply() 대체 방법 이해'
      ],
      markdown: `
# apply() 함수 완전 정복

## apply()란?

\`apply()\`는 DataFrame이나 Series에 사용자 정의 함수를 적용하는 범용 메서드입니다.

\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'A': [1, 2, 3, 4, 5],
    'B': [10, 20, 30, 40, 50],
    'C': [100, 200, 300, 400, 500]
})
\`\`\`

## 기본 사용법

### Series에 적용
\`\`\`python
# 각 요소에 함수 적용
df['A'].apply(lambda x: x ** 2)
# 결과: [1, 4, 9, 16, 25]

# 사용자 정의 함수
def categorize(value):
    if value < 3:
        return 'low'
    elif value < 5:
        return 'medium'
    return 'high'

df['A_category'] = df['A'].apply(categorize)
\`\`\`

### DataFrame에 적용 (axis 매개변수)
\`\`\`python
# axis=0: 각 열에 적용 (기본값)
df.apply(np.sum, axis=0)
# A:15, B:150, C:1500

# axis=1: 각 행에 적용
df.apply(lambda row: row['A'] + row['B'], axis=1)
# 결과: [11, 22, 33, 44, 55]
\`\`\`

## apply() vs map() vs applymap()

| 메서드 | 대상 | 용도 |
|--------|------|------|
| apply() | Series/DataFrame | 범용, 가장 유연함 |
| map() | Series만 | 값 매핑, 더 빠름 |
| applymap() | DataFrame만 | 요소별 연산 (deprecated) |

\`\`\`python
# map() - 딕셔너리 매핑에 최적
mapping = {1: 'one', 2: 'two', 3: 'three'}
df['A'].map(mapping)

# apply() - 복잡한 로직
df['A'].apply(lambda x: 'even' if x % 2 == 0 else 'odd')
\`\`\`

## apply()의 성능 문제

**핵심:** apply()는 내부적으로 Python 루프를 사용합니다!

\`\`\`python
import timeit

# 100만 행 데이터
df_large = pd.DataFrame({'value': np.random.randn(1_000_000)})

# apply() 사용 - 느림 (~500ms)
%timeit df_large['value'].apply(lambda x: x ** 2)

# 벡터화 - 빠름 (~5ms)
%timeit df_large['value'] ** 2

# 100배 차이!
\`\`\`

## apply()를 써야 할 때

1. **복잡한 조건 로직** (단, np.select/np.where 먼저 검토)
2. **외부 라이브러리 함수 호출**
3. **문자열 처리** (단, str accessor 먼저 검토)
4. **프로토타이핑** (나중에 최적화)

## apply() 대체 전략

\`\`\`python
# BAD: apply with if-else
df['category'] = df['value'].apply(
    lambda x: 'high' if x > 100 else 'low'
)

# GOOD: np.where
df['category'] = np.where(df['value'] > 100, 'high', 'low')

# BETTER: 복잡한 조건은 np.select
conditions = [
    df['value'] > 100,
    df['value'] > 50,
    df['value'] > 0
]
choices = ['high', 'medium', 'low']
df['category'] = np.select(conditions, choices, default='very_low')
\`\`\`
      `,
      keyPoints: [
        'apply()는 유연하지만 내부적으로 Python 루프 사용',
        'axis=0은 열별, axis=1은 행별 적용',
        'map()은 딕셔너리 매핑에 더 효율적',
        '가능하면 np.where(), np.select()로 대체'
      ]
    }
  },

  // Task 3: 벡터화 연산 실습 (Code)
  {
    id: 'w2d3-task3',
    title: '벡터화 연산 마스터하기',
    type: 'code',
    duration: 20,
    content: {
      objectives: [
        '벡터화 연산의 원리 이해',
        'NumPy 유니버설 함수 활용',
        '조건부 벡터화 연산 구현',
        '성능 비교 실습'
      ],
      starterCode: `import pandas as pd
import numpy as np
import time

# 테스트 데이터 생성 (100만 행)
np.random.seed(42)
n_rows = 1_000_000

df = pd.DataFrame({
    'value': np.random.randn(n_rows) * 100,
    'quantity': np.random.randint(1, 100, n_rows),
    'price': np.random.uniform(10, 1000, n_rows),
    'category': np.random.choice(['A', 'B', 'C', 'D'], n_rows)
})

print(f"데이터 크기: {len(df):,} 행")
print(df.head())

# ===========================================
# 실습 1: 단순 연산 벡터화
# ===========================================

# TODO: total_amount 계산 (quantity * price)
# BAD 방식 (apply)
def calc_total_apply():
    # df['total_apply'] = df.apply(lambda row: row['quantity'] * row['price'], axis=1)
    pass

# GOOD 방식 (벡터화)
def calc_total_vectorized():
    # TODO: 벡터화 방식으로 구현
    pass

# ===========================================
# 실습 2: 조건부 연산 벡터화
# ===========================================

# TODO: value 기준으로 등급 부여
# - value > 100: 'excellent'
# - value > 0: 'good'
# - value > -100: 'average'
# - else: 'poor'

# BAD 방식 (apply)
def categorize_apply():
    def get_grade(v):
        if v > 100:
            return 'excellent'
        elif v > 0:
            return 'good'
        elif v > -100:
            return 'average'
        else:
            return 'poor'
    # df['grade_apply'] = df['value'].apply(get_grade)
    pass

# GOOD 방식 (np.select)
def categorize_vectorized():
    # TODO: np.select 사용하여 구현
    pass

# ===========================================
# 실습 3: 문자열 연산 벡터화
# ===========================================

# 문자열 데이터 추가
df['name'] = ['product_' + str(i) for i in range(n_rows)]

# TODO: name에서 숫자만 추출
# BAD 방식
def extract_number_apply():
    # df['number_apply'] = df['name'].apply(lambda x: int(x.split('_')[1]))
    pass

# GOOD 방식 (str accessor)
def extract_number_vectorized():
    # TODO: str accessor 사용하여 구현
    pass

# ===========================================
# 실습 4: 성능 비교 함수
# ===========================================

def benchmark_comparison():
    """각 방식의 성능을 비교합니다."""
    results = {}

    # TODO: 각 방식의 실행 시간 측정
    # 힌트: time.time() 사용

    print("\\n=== 성능 비교 결과 ===")
    # TODO: 결과 출력

    return results

# 테스트 실행
if __name__ == "__main__":
    benchmark_comparison()
`,
      solutionCode: `import pandas as pd
import numpy as np
import time

# 테스트 데이터 생성 (100만 행)
np.random.seed(42)
n_rows = 1_000_000

df = pd.DataFrame({
    'value': np.random.randn(n_rows) * 100,
    'quantity': np.random.randint(1, 100, n_rows),
    'price': np.random.uniform(10, 1000, n_rows),
    'category': np.random.choice(['A', 'B', 'C', 'D'], n_rows)
})

print(f"데이터 크기: {len(df):,} 행")
print(df.head())

# ===========================================
# 실습 1: 단순 연산 벡터화
# ===========================================

def calc_total_apply():
    """apply 방식 - 느림"""
    df['total_apply'] = df.apply(
        lambda row: row['quantity'] * row['price'],
        axis=1
    )

def calc_total_vectorized():
    """벡터화 방식 - 빠름"""
    df['total_vectorized'] = df['quantity'] * df['price']

# ===========================================
# 실습 2: 조건부 연산 벡터화
# ===========================================

def categorize_apply():
    """apply 방식 - 느림"""
    def get_grade(v):
        if v > 100:
            return 'excellent'
        elif v > 0:
            return 'good'
        elif v > -100:
            return 'average'
        else:
            return 'poor'
    df['grade_apply'] = df['value'].apply(get_grade)

def categorize_vectorized():
    """np.select 방식 - 빠름"""
    conditions = [
        df['value'] > 100,
        df['value'] > 0,
        df['value'] > -100
    ]
    choices = ['excellent', 'good', 'average']
    df['grade_vectorized'] = np.select(conditions, choices, default='poor')

# ===========================================
# 실습 3: 문자열 연산 벡터화
# ===========================================

df['name'] = ['product_' + str(i) for i in range(n_rows)]

def extract_number_apply():
    """apply 방식 - 느림"""
    df['number_apply'] = df['name'].apply(lambda x: int(x.split('_')[1]))

def extract_number_vectorized():
    """str accessor 방식 - 빠름"""
    df['number_vectorized'] = df['name'].str.extract(r'_(\\d+)')[0].astype(int)

# ===========================================
# 실습 4: 성능 비교 함수
# ===========================================

def benchmark_comparison():
    """각 방식의 성능을 비교합니다."""
    results = {}

    # 단순 연산 비교
    start = time.time()
    calc_total_apply()
    results['total_apply'] = time.time() - start

    start = time.time()
    calc_total_vectorized()
    results['total_vectorized'] = time.time() - start

    # 조건부 연산 비교
    start = time.time()
    categorize_apply()
    results['categorize_apply'] = time.time() - start

    start = time.time()
    categorize_vectorized()
    results['categorize_vectorized'] = time.time() - start

    # 문자열 연산 비교
    start = time.time()
    extract_number_apply()
    results['string_apply'] = time.time() - start

    start = time.time()
    extract_number_vectorized()
    results['string_vectorized'] = time.time() - start

    print("\\n=== 성능 비교 결과 ===")
    print(f"\\n1. 단순 연산 (quantity * price)")
    print(f"   apply:     {results['total_apply']:.4f}초")
    print(f"   vectorized: {results['total_vectorized']:.4f}초")
    print(f"   속도 향상: {results['total_apply']/results['total_vectorized']:.1f}배")

    print(f"\\n2. 조건부 연산 (등급 부여)")
    print(f"   apply:     {results['categorize_apply']:.4f}초")
    print(f"   vectorized: {results['categorize_vectorized']:.4f}초")
    print(f"   속도 향상: {results['categorize_apply']/results['categorize_vectorized']:.1f}배")

    print(f"\\n3. 문자열 연산 (숫자 추출)")
    print(f"   apply:     {results['string_apply']:.4f}초")
    print(f"   vectorized: {results['string_vectorized']:.4f}초")
    print(f"   속도 향상: {results['string_apply']/results['string_vectorized']:.1f}배")

    return results

# 추가: NumPy 유니버설 함수 활용
def numpy_ufunc_examples():
    """NumPy 유니버설 함수 활용 예시"""

    # 수학 함수
    df['log_value'] = np.log1p(np.abs(df['value']))  # log(1+x), 음수 처리
    df['sqrt_price'] = np.sqrt(df['price'])
    df['sin_value'] = np.sin(df['value'] * np.pi / 180)

    # 비교 함수
    df['is_positive'] = np.greater(df['value'], 0)
    df['clipped'] = np.clip(df['value'], -50, 50)  # 범위 제한

    # 집계 함수
    print(f"\\nNumPy 집계:")
    print(f"  np.sum: {np.sum(df['value']):.2f}")
    print(f"  np.mean: {np.mean(df['value']):.2f}")
    print(f"  np.std: {np.std(df['value']):.2f}")
    print(f"  np.percentile(50): {np.percentile(df['value'], 50):.2f}")

# 테스트 실행
if __name__ == "__main__":
    benchmark_comparison()
    numpy_ufunc_examples()
`,
      instructions: '벡터화 연산의 성능 이점을 직접 체험합니다. apply()와 벡터화 방식의 속도 차이를 측정하고 분석하세요.',
      keyPoints: [
        '벡터화는 C 레벨에서 연산하여 Python 오버헤드 제거',
        'np.select()는 복잡한 조건부 로직에 최적',
        'str accessor는 문자열 벡터화에 효과적',
        'NumPy 유니버설 함수는 element-wise 연산에 최적화'
      ]
    }
  },

  // Task 4: Numba JIT 컴파일 (Video)
  {
    id: 'w2d3-task4',
    title: 'Numba JIT 컴파일로 극한 성능 달성',
    type: 'video',
    duration: 18,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      objectives: [
        'Numba의 동작 원리 이해',
        '@jit 데코레이터 활용법 학습',
        'nopython 모드와 object 모드 차이 이해',
        'Numba 적용 가능한 상황 파악'
      ],
      transcript: `
# Numba JIT 컴파일러 완전 정복

## Numba란?

Numba는 Python 코드를 **기계어(Machine Code)**로 컴파일하는 JIT(Just-In-Time) 컴파일러입니다.

\`\`\`python
from numba import jit
import numpy as np

# 일반 Python 함수 - 느림
def sum_python(arr):
    total = 0
    for x in arr:
        total += x
    return total

# Numba JIT 컴파일 - 빠름
@jit(nopython=True)
def sum_numba(arr):
    total = 0
    for x in arr:
        total += x
    return total

arr = np.random.randn(1_000_000)
%timeit sum_python(arr)  # ~100ms
%timeit sum_numba(arr)   # ~1ms (100배 빠름!)
\`\`\`

## 동작 원리

1. **첫 호출 시**: Python 코드 → LLVM IR → 기계어 컴파일
2. **이후 호출**: 컴파일된 기계어 직접 실행 (Python 인터프리터 우회)

## nopython vs object 모드

### nopython=True (권장)
- Python 객체 완전 배제
- 최대 성능
- 제한된 Python 기능만 사용 가능

### object 모드 (기본)
- Python 객체 허용
- 성능 향상 제한적
- 모든 Python 기능 사용 가능

\`\`\`python
# nopython 모드 - 최대 성능
@jit(nopython=True)
def fast_func(x):
    return x ** 2 + 2 * x + 1

# nopython 모드 실패 시 자동 object 모드
@jit  # nopython=False가 기본
def slow_func(x):
    return str(x)  # 문자열은 nopython 불가
\`\`\`

## pandas와 Numba 연동

**핵심:** Numba는 NumPy 배열에 최적화! pandas Series/DataFrame은 .values로 변환

\`\`\`python
import pandas as pd
from numba import jit
import numpy as np

df = pd.DataFrame({
    'a': np.random.randn(1_000_000),
    'b': np.random.randn(1_000_000)
})

# Numba 함수 정의 (NumPy 배열 입력)
@jit(nopython=True)
def custom_calc(a, b):
    n = len(a)
    result = np.empty(n)
    for i in range(n):
        result[i] = a[i] ** 2 + np.sin(b[i])
    return result

# pandas DataFrame에 적용
df['result'] = custom_calc(df['a'].values, df['b'].values)
\`\`\`

## Numba 병렬 처리

\`\`\`python
from numba import jit, prange

@jit(nopython=True, parallel=True)
def parallel_sum(arr):
    total = 0
    for i in prange(len(arr)):  # prange = parallel range
        total += arr[i]
    return total

# 멀티코어 활용으로 추가 성능 향상
\`\`\`

## Numba 사용 시 주의사항

### ✅ Numba가 잘 작동하는 경우
- NumPy 배열 연산
- 수학 연산 (sin, cos, exp, log 등)
- 단순 루프
- 숫자 데이터

### ❌ Numba가 작동하지 않는 경우
- pandas DataFrame 직접 접근
- 문자열 처리
- 딕셔너리, 리스트 (제한적 지원)
- 외부 라이브러리 호출

\`\`\`python
# 컴파일 시간 측정
from numba import jit
import time

@jit(nopython=True)
def compiled_func(x):
    return x ** 2

# 첫 호출 - 컴파일 포함 (~0.5초)
start = time.time()
compiled_func(10)
print(f"첫 호출: {time.time() - start:.3f}초")

# 두 번째 호출 - 컴파일된 코드 (~0.0001초)
start = time.time()
compiled_func(10)
print(f"두 번째 호출: {time.time() - start:.6f}초")
\`\`\`
      `,
      keyPoints: [
        'Numba는 Python 코드를 기계어로 JIT 컴파일',
        'nopython=True 모드에서 최대 성능 달성',
        'pandas와 연동 시 .values로 NumPy 배열 변환 필요',
        '첫 호출 시 컴파일 오버헤드 존재'
      ]
    }
  },

  // Task 5: Numba 실습 (Code)
  {
    id: 'w2d3-task5',
    title: 'Numba 실전 활용 실습',
    type: 'code',
    duration: 20,
    content: {
      objectives: [
        'Numba @jit 데코레이터 사용법 익히기',
        'pandas DataFrame에 Numba 적용하기',
        '병렬 처리로 성능 극대화',
        'Numba 성능 벤치마킹'
      ],
      starterCode: `import pandas as pd
import numpy as np
from numba import jit, prange
import time

# Numba 설치 확인
print(f"Numba version: {numba.__version__ if 'numba' in dir() else 'Not installed'}")

# 테스트 데이터 생성 (100만 행)
np.random.seed(42)
n_rows = 1_000_000

df = pd.DataFrame({
    'price': np.random.uniform(100, 10000, n_rows),
    'quantity': np.random.randint(1, 100, n_rows),
    'discount_rate': np.random.uniform(0, 0.3, n_rows),
    'tax_rate': np.random.uniform(0.05, 0.15, n_rows)
})

print(f"데이터 크기: {len(df):,} 행")

# ===========================================
# 실습 1: 기본 Numba 함수
# ===========================================

# 순수 Python 버전
def calc_total_python(prices, quantities, discounts, taxes):
    """순수 Python으로 총액 계산"""
    n = len(prices)
    result = np.empty(n)
    for i in range(n):
        base = prices[i] * quantities[i]
        discounted = base * (1 - discounts[i])
        result[i] = discounted * (1 + taxes[i])
    return result

# TODO: Numba 버전 구현
# @jit(nopython=True)
def calc_total_numba(prices, quantities, discounts, taxes):
    """Numba JIT으로 총액 계산"""
    # TODO: 위 Python 버전과 동일한 로직을 Numba로 구현
    pass

# ===========================================
# 실습 2: 병렬 Numba 함수
# ===========================================

# TODO: 병렬 처리 버전 구현
# @jit(nopython=True, parallel=True)
def calc_total_parallel(prices, quantities, discounts, taxes):
    """Numba 병렬 처리로 총액 계산"""
    # TODO: prange 사용하여 병렬 처리 구현
    pass

# ===========================================
# 실습 3: 복잡한 비즈니스 로직
# ===========================================

# 등급별 추가 할인율
# - 금액 10000 이상: 추가 5% 할인
# - 금액 5000 이상: 추가 2% 할인
# - 수량 50 이상: 추가 3% 할인

# TODO: Numba로 복잡한 비즈니스 로직 구현
# @jit(nopython=True)
def calc_with_tier_discount(prices, quantities, discounts, taxes):
    """등급별 추가 할인이 적용된 총액 계산"""
    # TODO: 구현
    pass

# ===========================================
# 실습 4: 벤치마킹
# ===========================================

def run_benchmark():
    """모든 버전의 성능 비교"""
    prices = df['price'].values
    quantities = df['quantity'].values
    discounts = df['discount_rate'].values
    taxes = df['tax_rate'].values

    results = {}

    # Python 버전
    start = time.time()
    result_python = calc_total_python(prices, quantities, discounts, taxes)
    results['python'] = time.time() - start

    # TODO: Numba 버전 벤치마크 추가
    # 힌트: 첫 호출은 컴파일 시간 포함되므로,
    #       웜업 호출 후 측정하는 것이 정확

    # TODO: 결과 출력
    print("\\n=== 성능 비교 ===")

    return results

# 실행
if __name__ == "__main__":
    run_benchmark()
`,
      solutionCode: `import pandas as pd
import numpy as np
from numba import jit, prange
import numba
import time

# Numba 설치 확인
print(f"Numba version: {numba.__version__}")

# 테스트 데이터 생성 (100만 행)
np.random.seed(42)
n_rows = 1_000_000

df = pd.DataFrame({
    'price': np.random.uniform(100, 10000, n_rows),
    'quantity': np.random.randint(1, 100, n_rows),
    'discount_rate': np.random.uniform(0, 0.3, n_rows),
    'tax_rate': np.random.uniform(0.05, 0.15, n_rows)
})

print(f"데이터 크기: {len(df):,} 행")

# ===========================================
# 실습 1: 기본 Numba 함수
# ===========================================

def calc_total_python(prices, quantities, discounts, taxes):
    """순수 Python으로 총액 계산"""
    n = len(prices)
    result = np.empty(n)
    for i in range(n):
        base = prices[i] * quantities[i]
        discounted = base * (1 - discounts[i])
        result[i] = discounted * (1 + taxes[i])
    return result

@jit(nopython=True)
def calc_total_numba(prices, quantities, discounts, taxes):
    """Numba JIT으로 총액 계산"""
    n = len(prices)
    result = np.empty(n)
    for i in range(n):
        base = prices[i] * quantities[i]
        discounted = base * (1 - discounts[i])
        result[i] = discounted * (1 + taxes[i])
    return result

# ===========================================
# 실습 2: 병렬 Numba 함수
# ===========================================

@jit(nopython=True, parallel=True)
def calc_total_parallel(prices, quantities, discounts, taxes):
    """Numba 병렬 처리로 총액 계산"""
    n = len(prices)
    result = np.empty(n)
    for i in prange(n):  # prange for parallel
        base = prices[i] * quantities[i]
        discounted = base * (1 - discounts[i])
        result[i] = discounted * (1 + taxes[i])
    return result

# ===========================================
# 실습 3: 복잡한 비즈니스 로직
# ===========================================

@jit(nopython=True)
def calc_with_tier_discount(prices, quantities, discounts, taxes):
    """등급별 추가 할인이 적용된 총액 계산"""
    n = len(prices)
    result = np.empty(n)

    for i in range(n):
        base = prices[i] * quantities[i]

        # 기본 할인 적용
        total_discount = discounts[i]

        # 등급별 추가 할인
        if base >= 10000:
            total_discount += 0.05
        elif base >= 5000:
            total_discount += 0.02

        if quantities[i] >= 50:
            total_discount += 0.03

        # 최대 할인율 제한 (50%)
        if total_discount > 0.5:
            total_discount = 0.5

        discounted = base * (1 - total_discount)
        result[i] = discounted * (1 + taxes[i])

    return result

# ===========================================
# 실습 4: 벤치마킹
# ===========================================

def run_benchmark():
    """모든 버전의 성능 비교"""
    prices = df['price'].values
    quantities = df['quantity'].values
    discounts = df['discount_rate'].values
    taxes = df['tax_rate'].values

    results = {}

    # Python 버전
    start = time.time()
    result_python = calc_total_python(prices, quantities, discounts, taxes)
    results['python'] = time.time() - start
    print(f"Python: {results['python']:.4f}초")

    # Numba 웜업 (컴파일)
    print("\\nNumba 컴파일 중...")
    _ = calc_total_numba(prices[:100], quantities[:100], discounts[:100], taxes[:100])
    _ = calc_total_parallel(prices[:100], quantities[:100], discounts[:100], taxes[:100])
    _ = calc_with_tier_discount(prices[:100], quantities[:100], discounts[:100], taxes[:100])
    print("컴파일 완료!")

    # Numba 기본 버전
    start = time.time()
    result_numba = calc_total_numba(prices, quantities, discounts, taxes)
    results['numba'] = time.time() - start
    print(f"Numba: {results['numba']:.4f}초")

    # Numba 병렬 버전
    start = time.time()
    result_parallel = calc_total_parallel(prices, quantities, discounts, taxes)
    results['parallel'] = time.time() - start
    print(f"Numba Parallel: {results['parallel']:.4f}초")

    # Numba 복잡한 로직
    start = time.time()
    result_tier = calc_with_tier_discount(prices, quantities, discounts, taxes)
    results['tier'] = time.time() - start
    print(f"Numba Tier: {results['tier']:.4f}초")

    # 벡터화 비교
    start = time.time()
    result_vectorized = df['price'].values * df['quantity'].values * (1 - df['discount_rate'].values) * (1 + df['tax_rate'].values)
    results['vectorized'] = time.time() - start
    print(f"NumPy Vectorized: {results['vectorized']:.4f}초")

    # 결과 요약
    print("\\n=== 성능 비교 결과 ===")
    print(f"Python 대비 Numba: {results['python']/results['numba']:.1f}배 빠름")
    print(f"Python 대비 Parallel: {results['python']/results['parallel']:.1f}배 빠름")
    print(f"Numba 대비 Vectorized: {results['numba']/results['vectorized']:.1f}배")

    # 결과 검증
    print("\\n=== 결과 검증 ===")
    print(f"Python == Numba: {np.allclose(result_python, result_numba)}")
    print(f"Numba == Parallel: {np.allclose(result_numba, result_parallel)}")

    return results

# 실행
if __name__ == "__main__":
    results = run_benchmark()
`,
      instructions: 'Numba JIT 컴파일러를 사용하여 Python 코드를 최적화합니다. 웜업 호출, 병렬 처리, 복잡한 비즈니스 로직 구현을 실습합니다.',
      keyPoints: [
        '@jit(nopython=True)로 최대 성능 달성',
        'prange()로 자동 병렬 처리 활성화',
        '첫 호출 시 컴파일 오버헤드 존재 (웜업 필요)',
        'NumPy 배열로 변환 후 Numba 함수 적용'
      ]
    }
  },

  // Task 6: eval()과 query() (Reading)
  {
    id: 'w2d3-task6',
    title: 'eval()과 query()로 표현식 최적화',
    type: 'reading',
    duration: 10,
    content: {
      objectives: [
        'eval()의 동작 원리 이해',
        'query()로 필터링 최적화',
        'numexpr 엔진 활용',
        '사용 시 주의사항 파악'
      ],
      markdown: `
# eval()과 query()로 표현식 최적화

## eval()이란?

\`eval()\`은 문자열 표현식을 **numexpr** 또는 **Python** 엔진으로 평가합니다.

\`\`\`python
import pandas as pd
import numpy as np

# 대용량 데이터
df = pd.DataFrame({
    'a': np.random.randn(1_000_000),
    'b': np.random.randn(1_000_000),
    'c': np.random.randn(1_000_000)
})
\`\`\`

## 기본 연산 vs eval()

\`\`\`python
# 기본 pandas 연산
# 중간 결과물 생성으로 메모리 사용량 증가
df['d'] = df['a'] + df['b'] * df['c']

# eval() 사용
# 메모리 효율적, 단일 패스로 계산
df['d'] = df.eval('a + b * c')
\`\`\`

## eval() 성능 이점

### 1. 메모리 효율
기본 연산:
- \`df['b'] * df['c']\` → 임시 배열 1 생성
- 결과 + \`df['a']\` → 임시 배열 2 생성
- 최종 결과 할당

eval():
- 단일 패스로 계산, 중간 배열 없음

### 2. 속도 향상 (대용량 데이터)
\`\`\`python
%timeit df['a'] + df['b'] * df['c'] - df['a'] ** 2
# ~30ms

%timeit df.eval('a + b * c - a ** 2')
# ~15ms (2배 빠름)
\`\`\`

## query() - 필터링 최적화

\`\`\`python
# 기본 필터링
df_filtered = df[(df['a'] > 0) & (df['b'] < 0.5)]

# query() 사용 - 더 읽기 쉽고 빠름
df_filtered = df.query('a > 0 and b < 0.5')

# 변수 참조 (@ 사용)
threshold = 0.5
df_filtered = df.query('a > 0 and b < @threshold')

# 문자열 비교
df_filtered = df.query('category == "A" or category == "B"')
\`\`\`

## eval() 고급 기능

\`\`\`python
# 새 컬럼 생성 (inplace)
df.eval('d = a + b', inplace=True)

# 여러 연산 동시 수행
df.eval('''
    d = a + b
    e = c * 2
    f = d / e
''', inplace=True)

# 함수 호출 (제한적)
df.eval('d = abs(a) + sqrt(b)')  # 일부 NumPy 함수 지원
\`\`\`

## 엔진 선택

\`\`\`python
# numexpr 엔진 (기본, 빠름)
df.eval('a + b * c', engine='numexpr')

# Python 엔진 (느리지만 더 많은 기능)
df.eval('a.str.upper()', engine='python')
\`\`\`

## 주의사항

### ✅ 사용하면 좋은 경우
- 대용량 데이터 (10만+ 행)
- 복잡한 산술 표현식
- 메모리 제약 환경

### ❌ 피해야 할 경우
- 소규모 데이터 (오버헤드 > 이득)
- 복잡한 함수 호출 필요
- 문자열 연산

\`\`\`python
# 소규모 데이터에서는 오히려 느림
small_df = pd.DataFrame({'a': [1, 2, 3], 'b': [4, 5, 6]})
%timeit small_df['a'] + small_df['b']  # 더 빠름
%timeit small_df.eval('a + b')  # 오버헤드로 느림
\`\`\`
      `,
      keyPoints: [
        'eval()은 numexpr 엔진으로 메모리 효율적 연산',
        'query()는 필터링을 더 읽기 쉽고 빠르게',
        '대용량 데이터에서 효과적, 소규모에선 오버헤드',
        '@ 기호로 외부 변수 참조 가능'
      ]
    }
  },

  // Task 7: 메모리 최적화 (Video)
  {
    id: 'w2d3-task7',
    title: '메모리 사용량 최적화 전략',
    type: 'video',
    duration: 15,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      objectives: [
        'pandas 메모리 사용 패턴 이해',
        'dtype 다운캐스팅 전략',
        'Categorical 타입 활용',
        '메모리 프로파일링 방법'
      ],
      transcript: `
# pandas 메모리 최적화 마스터

## 메모리 사용 현황 파악

\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'int_col': np.random.randint(0, 100, 1_000_000),
    'float_col': np.random.randn(1_000_000),
    'str_col': np.random.choice(['A', 'B', 'C'], 1_000_000)
})

# 메모리 사용량 확인
print(df.info(memory_usage='deep'))
print(f"\\n총 메모리: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
\`\`\`

## 1. 정수 다운캐스팅

pandas 기본 정수 타입은 int64 (8바이트)입니다.

\`\`\`python
# 값 범위 확인
print(df['int_col'].min(), df['int_col'].max())  # 0, 99

# int64 (8 bytes) → int8 (1 byte)로 다운캐스팅
df['int_col'] = pd.to_numeric(df['int_col'], downcast='integer')
# 또는
df['int_col'] = df['int_col'].astype(np.int8)

# 메모리 87.5% 절약!
\`\`\`

### 정수 타입별 범위
| 타입 | 바이트 | 범위 |
|------|--------|------|
| int8 | 1 | -128 ~ 127 |
| int16 | 2 | -32,768 ~ 32,767 |
| int32 | 4 | -2.1B ~ 2.1B |
| int64 | 8 | 매우 큼 |
| uint8 | 1 | 0 ~ 255 (양수만) |

## 2. 실수 다운캐스팅

\`\`\`python
# float64 (8 bytes) → float32 (4 bytes)
df['float_col'] = pd.to_numeric(df['float_col'], downcast='float')

# 주의: 정밀도 손실 가능!
# 금융 데이터 등 정밀도 중요한 경우 주의
\`\`\`

## 3. Categorical 타입 활용

**핵심:** 반복되는 값이 많은 문자열에 매우 효과적!

\`\`\`python
# 변환 전
print(df['str_col'].dtype)  # object
print(df['str_col'].memory_usage(deep=True) / 1024**2, "MB")  # ~60 MB

# Categorical로 변환
df['str_col'] = df['str_col'].astype('category')
print(df['str_col'].memory_usage(deep=True) / 1024**2, "MB")  # ~1 MB

# 98% 메모리 절약!
\`\`\`

### Categorical 동작 원리
- 고유값만 저장 (codes)
- 각 값은 정수 인덱스로 참조
- 'A', 'B', 'C' → 0, 1, 2로 저장

### 주의사항
\`\`\`python
# Categorical은 고유값이 적을 때 효과적
# 고유값이 많으면 오히려 비효율

# 좋음: 카테고리 3개, 100만 행
df['category'] = df['category'].astype('category')

# 나쁨: 고유값 90만개, 100만 행
df['unique_id'] = df['unique_id'].astype('category')  # 비효율!
\`\`\`

## 4. 자동 다운캐스팅 함수

\`\`\`python
def reduce_memory(df, verbose=True):
    """DataFrame 메모리 사용량 최적화"""
    start_mem = df.memory_usage(deep=True).sum() / 1024**2

    for col in df.columns:
        col_type = df[col].dtype

        if col_type != object:
            # 숫자 타입 다운캐스팅
            c_min, c_max = df[col].min(), df[col].max()

            if str(col_type)[:3] == 'int':
                if c_min > np.iinfo(np.int8).min and c_max < np.iinfo(np.int8).max:
                    df[col] = df[col].astype(np.int8)
                elif c_min > np.iinfo(np.int16).min and c_max < np.iinfo(np.int16).max:
                    df[col] = df[col].astype(np.int16)
                elif c_min > np.iinfo(np.int32).min and c_max < np.iinfo(np.int32).max:
                    df[col] = df[col].astype(np.int32)
            else:
                if c_min > np.finfo(np.float32).min and c_max < np.finfo(np.float32).max:
                    df[col] = df[col].astype(np.float32)
        else:
            # 문자열 타입: 고유값 비율 확인
            num_unique = df[col].nunique()
            num_total = len(df[col])
            if num_unique / num_total < 0.5:  # 고유값 50% 미만
                df[col] = df[col].astype('category')

    end_mem = df.memory_usage(deep=True).sum() / 1024**2

    if verbose:
        print(f"메모리 사용량: {start_mem:.2f} MB → {end_mem:.2f} MB")
        print(f"절약: {100 * (start_mem - end_mem) / start_mem:.1f}%")

    return df
\`\`\`

## 5. 실전 최적화 체크리스트

1. ✅ \`df.info(memory_usage='deep')\`로 현황 파악
2. ✅ 정수 컬럼 값 범위 확인 후 다운캐스팅
3. ✅ 실수 컬럼 정밀도 요구사항 확인
4. ✅ 문자열 컬럼 고유값 비율 확인 후 Categorical
5. ✅ 불필요한 컬럼 삭제
6. ✅ 필요한 컬럼만 로드 (usecols)
      `,
      keyPoints: [
        '정수는 값 범위에 맞게 int8/16/32로 다운캐스팅',
        '실수는 정밀도 허용 시 float32로 다운캐스팅',
        'Categorical은 반복값 많은 문자열에 효과적',
        '자동 다운캐스팅 함수로 일괄 최적화'
      ]
    }
  },

  // Task 8: 성능 최적화 종합 퀴즈
  {
    id: 'w2d3-task8',
    title: '성능 최적화 종합 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      objectives: [
        '성능 최적화 개념 점검',
        'apply vs 벡터화 이해 확인',
        'Numba 활용법 점검',
        '메모리 최적화 전략 확인'
      ],
      questions: [
        {
          question: '다음 중 pandas에서 가장 느린 연산은?',
          options: [
            'df["a"] + df["b"]',
            'df.apply(lambda row: row["a"] + row["b"], axis=1)',
            'np.add(df["a"].values, df["b"].values)',
            'df.eval("a + b")'
          ],
          answer: 1,
          explanation: 'apply(axis=1)은 각 행마다 Python 함수를 호출하므로 가장 느립니다. 벡터화 연산(+, np.add, eval)은 C 레벨에서 실행되어 훨씬 빠릅니다.'
        },
        {
          question: 'Numba @jit(nopython=True) 사용 시 가장 중요한 제약은?',
          options: [
            '함수가 100줄 이하여야 한다',
            'pandas DataFrame을 직접 사용할 수 없다',
            '정수 연산만 가능하다',
            '루프를 사용할 수 없다'
          ],
          answer: 1,
          explanation: 'nopython=True 모드에서는 Python 객체(pandas DataFrame 포함)를 사용할 수 없습니다. NumPy 배열로 변환 후 사용해야 합니다.'
        },
        {
          question: '다음 중 메모리 최적화에 가장 효과적인 방법은?',
          options: [
            '모든 컬럼을 float64로 통일',
            '고유값이 적은 문자열을 Categorical로 변환',
            '모든 정수를 int64로 저장',
            'inplace=True 항상 사용'
          ],
          answer: 1,
          explanation: '고유값이 적은 문자열을 Categorical로 변환하면 메모리를 90% 이상 절약할 수 있습니다. 반복되는 값은 정수 인덱스로 저장되기 때문입니다.'
        },
        {
          question: 'np.select()를 사용해야 하는 상황은?',
          options: [
            '단순 산술 연산',
            '문자열 연결',
            '여러 조건에 따른 값 할당',
            '데이터 정렬'
          ],
          answer: 2,
          explanation: 'np.select()는 여러 조건에 따라 다른 값을 할당할 때 사용합니다. if-elif-else를 apply()로 구현하는 것보다 훨씬 빠릅니다.'
        },
        {
          question: 'eval()이 효과적인 상황은?',
          options: [
            '100행 미만의 소규모 데이터',
            '복잡한 문자열 처리가 필요할 때',
            '대용량 데이터에서 복잡한 산술 표현식',
            '외부 라이브러리 함수 호출'
          ],
          answer: 2,
          explanation: 'eval()은 numexpr 엔진을 사용하여 대용량 데이터에서 복잡한 산술 표현식을 메모리 효율적으로 처리합니다. 소규모 데이터에서는 오버헤드가 더 큽니다.'
        }
      ]
    }
  },

  // Task 9: 성능 프로파일링 실습 (Code)
  {
    id: 'w2d3-task9',
    title: 'Day 3 실전 프로젝트: 성능 프로파일링',
    type: 'code',
    duration: 25,
    content: {
      objectives: [
        '실제 데이터셋 성능 프로파일링',
        '병목 지점 식별 및 최적화',
        '메모리 사용량 모니터링',
        '최적화 전후 비교 리포트 작성'
      ],
      starterCode: `import pandas as pd
import numpy as np
from numba import jit, prange
import time
import tracemalloc

# 성능 프로파일링 클래스
class PerformanceProfiler:
    """pandas 코드 성능 프로파일링 도구"""

    def __init__(self):
        self.results = []

    def profile(self, name: str, func, *args, **kwargs):
        """함수 실행 시간과 메모리 사용량 측정"""
        # TODO: 구현
        # 1. tracemalloc으로 메모리 측정 시작
        # 2. time.time()으로 실행 시간 측정
        # 3. 함수 실행
        # 4. 메모리/시간 측정 종료
        # 5. 결과 저장
        pass

    def report(self):
        """프로파일링 결과 리포트 출력"""
        # TODO: 구현
        pass

# 테스트 데이터 생성
np.random.seed(42)
n_rows = 500_000

df = pd.DataFrame({
    'order_id': range(n_rows),
    'customer_id': np.random.randint(1, 10000, n_rows),
    'product_category': np.random.choice(
        ['Electronics', 'Clothing', 'Food', 'Books', 'Sports'],
        n_rows
    ),
    'unit_price': np.random.uniform(10, 1000, n_rows),
    'quantity': np.random.randint(1, 20, n_rows),
    'discount_pct': np.random.uniform(0, 0.3, n_rows),
    'order_date': pd.date_range('2020-01-01', periods=n_rows, freq='T')
})

print(f"데이터 크기: {len(df):,} 행")
print(f"초기 메모리: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")

# ===========================================
# 태스크 1: 다양한 방식으로 총 매출 계산
# ===========================================

# 방식 1: for 루프 (최악)
def calc_revenue_loop(df):
    """for 루프 방식"""
    revenues = []
    for idx, row in df.iterrows():
        rev = row['unit_price'] * row['quantity'] * (1 - row['discount_pct'])
        revenues.append(rev)
    return revenues

# 방식 2: apply (나쁨)
def calc_revenue_apply(df):
    """apply 방식"""
    return df.apply(
        lambda row: row['unit_price'] * row['quantity'] * (1 - row['discount_pct']),
        axis=1
    )

# 방식 3: 벡터화 (좋음)
def calc_revenue_vectorized(df):
    """벡터화 방식"""
    return df['unit_price'] * df['quantity'] * (1 - df['discount_pct'])

# 방식 4: Numba (최고)
# TODO: Numba 함수 구현
# @jit(nopython=True)
def calc_revenue_numba(prices, quantities, discounts):
    pass

# ===========================================
# 태스크 2: 메모리 최적화
# ===========================================

def optimize_memory(df):
    """DataFrame 메모리 최적화"""
    df_optimized = df.copy()

    # TODO: 각 컬럼 타입 최적화
    # 1. customer_id: int64 → int16
    # 2. product_category: object → category
    # 3. unit_price: float64 → float32
    # 4. quantity: int64 → int8
    # 5. discount_pct: float64 → float32

    return df_optimized

# ===========================================
# 태스크 3: 카테고리별 집계 최적화
# ===========================================

# 방식 1: groupby + apply (느림)
def aggregate_by_category_apply(df):
    """groupby + apply 방식"""
    return df.groupby('product_category').apply(
        lambda x: pd.Series({
            'total_revenue': (x['unit_price'] * x['quantity'] * (1 - x['discount_pct'])).sum(),
            'avg_quantity': x['quantity'].mean(),
            'order_count': len(x)
        })
    )

# 방식 2: groupby + agg (빠름)
def aggregate_by_category_agg(df):
    """groupby + agg 방식"""
    # TODO: 효율적인 집계 구현
    pass

# ===========================================
# 태스크 4: 전체 파이프라인 최적화 비교
# ===========================================

def run_full_analysis():
    """전체 파이프라인 성능 비교"""
    profiler = PerformanceProfiler()

    # TODO: 각 방식 프로파일링
    # 1. 메모리 최적화 전/후 비교
    # 2. 매출 계산 방식별 비교
    # 3. 집계 방식별 비교

    # TODO: 리포트 출력
    profiler.report()

# 실행
if __name__ == "__main__":
    run_full_analysis()
`,
      solutionCode: `import pandas as pd
import numpy as np
from numba import jit, prange
import time
import tracemalloc

# 성능 프로파일링 클래스
class PerformanceProfiler:
    """pandas 코드 성능 프로파일링 도구"""

    def __init__(self):
        self.results = []

    def profile(self, name: str, func, *args, **kwargs):
        """함수 실행 시간과 메모리 사용량 측정"""
        # 메모리 측정 시작
        tracemalloc.start()

        # 시간 측정 시작
        start_time = time.time()

        # 함수 실행
        result = func(*args, **kwargs)

        # 시간 측정 종료
        elapsed_time = time.time() - start_time

        # 메모리 측정 종료
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        # 결과 저장
        self.results.append({
            'name': name,
            'time': elapsed_time,
            'memory_current': current / 1024**2,  # MB
            'memory_peak': peak / 1024**2  # MB
        })

        return result

    def report(self):
        """프로파일링 결과 리포트 출력"""
        print("\\n" + "=" * 60)
        print("성능 프로파일링 결과")
        print("=" * 60)

        # 시간순 정렬
        sorted_results = sorted(self.results, key=lambda x: x['time'])

        for r in sorted_results:
            print(f"\\n{r['name']}")
            print(f"  시간: {r['time']:.4f}초")
            print(f"  메모리 (현재): {r['memory_current']:.2f} MB")
            print(f"  메모리 (피크): {r['memory_peak']:.2f} MB")

        # 최적/최악 비교
        if len(sorted_results) >= 2:
            fastest = sorted_results[0]
            slowest = sorted_results[-1]
            speedup = slowest['time'] / fastest['time']
            print(f"\\n{'=' * 60}")
            print(f"최고 성능: {fastest['name']} ({fastest['time']:.4f}초)")
            print(f"최저 성능: {slowest['name']} ({slowest['time']:.4f}초)")
            print(f"속도 향상: {speedup:.1f}배")

# 테스트 데이터 생성
np.random.seed(42)
n_rows = 500_000

df = pd.DataFrame({
    'order_id': range(n_rows),
    'customer_id': np.random.randint(1, 10000, n_rows),
    'product_category': np.random.choice(
        ['Electronics', 'Clothing', 'Food', 'Books', 'Sports'],
        n_rows
    ),
    'unit_price': np.random.uniform(10, 1000, n_rows),
    'quantity': np.random.randint(1, 20, n_rows),
    'discount_pct': np.random.uniform(0, 0.3, n_rows),
    'order_date': pd.date_range('2020-01-01', periods=n_rows, freq='T')
})

print(f"데이터 크기: {len(df):,} 행")
print(f"초기 메모리: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")

# ===========================================
# 태스크 1: 다양한 방식으로 총 매출 계산
# ===========================================

def calc_revenue_loop(df):
    """for 루프 방식 (샘플만 - 전체 너무 느림)"""
    df_sample = df.head(10000)
    revenues = []
    for idx, row in df_sample.iterrows():
        rev = row['unit_price'] * row['quantity'] * (1 - row['discount_pct'])
        revenues.append(rev)
    return revenues

def calc_revenue_apply(df):
    """apply 방식"""
    return df.apply(
        lambda row: row['unit_price'] * row['quantity'] * (1 - row['discount_pct']),
        axis=1
    )

def calc_revenue_vectorized(df):
    """벡터화 방식"""
    return df['unit_price'] * df['quantity'] * (1 - df['discount_pct'])

@jit(nopython=True)
def calc_revenue_numba(prices, quantities, discounts):
    """Numba JIT 방식"""
    n = len(prices)
    result = np.empty(n)
    for i in range(n):
        result[i] = prices[i] * quantities[i] * (1 - discounts[i])
    return result

@jit(nopython=True, parallel=True)
def calc_revenue_numba_parallel(prices, quantities, discounts):
    """Numba 병렬 방식"""
    n = len(prices)
    result = np.empty(n)
    for i in prange(n):
        result[i] = prices[i] * quantities[i] * (1 - discounts[i])
    return result

# ===========================================
# 태스크 2: 메모리 최적화
# ===========================================

def optimize_memory(df):
    """DataFrame 메모리 최적화"""
    df_optimized = df.copy()

    # customer_id: int64 → int16 (1~10000 범위)
    df_optimized['customer_id'] = df_optimized['customer_id'].astype(np.int16)

    # product_category: object → category (5개 고유값)
    df_optimized['product_category'] = df_optimized['product_category'].astype('category')

    # unit_price: float64 → float32
    df_optimized['unit_price'] = df_optimized['unit_price'].astype(np.float32)

    # quantity: int64 → int8 (1~20 범위)
    df_optimized['quantity'] = df_optimized['quantity'].astype(np.int8)

    # discount_pct: float64 → float32
    df_optimized['discount_pct'] = df_optimized['discount_pct'].astype(np.float32)

    return df_optimized

# ===========================================
# 태스크 3: 카테고리별 집계 최적화
# ===========================================

def aggregate_by_category_apply(df):
    """groupby + apply 방식"""
    return df.groupby('product_category').apply(
        lambda x: pd.Series({
            'total_revenue': (x['unit_price'] * x['quantity'] * (1 - x['discount_pct'])).sum(),
            'avg_quantity': x['quantity'].mean(),
            'order_count': len(x)
        })
    )

def aggregate_by_category_agg(df):
    """groupby + agg 방식"""
    # 먼저 revenue 계산 (벡터화)
    df['revenue'] = df['unit_price'] * df['quantity'] * (1 - df['discount_pct'])

    result = df.groupby('product_category').agg({
        'revenue': 'sum',
        'quantity': 'mean',
        'order_id': 'count'
    }).rename(columns={
        'revenue': 'total_revenue',
        'quantity': 'avg_quantity',
        'order_id': 'order_count'
    })

    return result

# ===========================================
# 태스크 4: 전체 파이프라인 최적화 비교
# ===========================================

def run_full_analysis():
    """전체 파이프라인 성능 비교"""
    profiler = PerformanceProfiler()

    print("\\n=== 매출 계산 성능 비교 ===")

    # Numba 웜업
    prices = df['unit_price'].values
    quantities = df['quantity'].values.astype(np.float64)
    discounts = df['discount_pct'].values
    _ = calc_revenue_numba(prices[:100], quantities[:100], discounts[:100])
    _ = calc_revenue_numba_parallel(prices[:100], quantities[:100], discounts[:100])

    # 1. for 루프 (샘플만)
    profiler.profile("1. For Loop (10K sample)", calc_revenue_loop, df)

    # 2. apply
    profiler.profile("2. Apply", calc_revenue_apply, df)

    # 3. 벡터화
    profiler.profile("3. Vectorized", calc_revenue_vectorized, df)

    # 4. Numba
    profiler.profile("4. Numba JIT",
                     lambda: calc_revenue_numba(prices, quantities, discounts))

    # 5. Numba 병렬
    profiler.profile("5. Numba Parallel",
                     lambda: calc_revenue_numba_parallel(prices, quantities, discounts))

    print("\\n=== 메모리 최적화 비교 ===")

    mem_before = df.memory_usage(deep=True).sum() / 1024**2
    df_opt = optimize_memory(df)
    mem_after = df_opt.memory_usage(deep=True).sum() / 1024**2

    print(f"최적화 전: {mem_before:.2f} MB")
    print(f"최적화 후: {mem_after:.2f} MB")
    print(f"절약: {100 * (mem_before - mem_after) / mem_before:.1f}%")

    print("\\n=== 집계 성능 비교 ===")

    # groupby + apply
    profiler.profile("6. GroupBy Apply", aggregate_by_category_apply, df)

    # groupby + agg
    profiler.profile("7. GroupBy Agg", aggregate_by_category_agg, df.copy())

    # 리포트 출력
    profiler.report()

# 실행
if __name__ == "__main__":
    run_full_analysis()
`,
      instructions: '실제 주문 데이터셋에서 성능 병목을 찾고 최적화합니다. PerformanceProfiler 클래스를 구현하고, 다양한 최적화 기법의 효과를 비교 분석하세요.',
      keyPoints: [
        'tracemalloc으로 메모리 사용량 정밀 측정',
        'for 루프 → apply → 벡터화 → Numba 순으로 성능 향상',
        '메모리 최적화로 50% 이상 절약 가능',
        'groupby+agg는 groupby+apply보다 훨씬 빠름'
      ]
    }
  },

  // Task 10: 데일리 챌린지
  {
    id: 'w2d3-task10',
    title: '🔥 Daily Challenge: 자동 최적화 라이브러리',
    type: 'code',
    duration: 25,
    content: {
      objectives: [
        '자동 성능 분석 및 최적화 도구 설계',
        '최적화 제안 시스템 구현',
        '벤치마킹 자동화',
        '실무 적용 가능한 라이브러리 개발'
      ],
      starterCode: `import pandas as pd
import numpy as np
from typing import List, Dict, Callable, Optional
from dataclasses import dataclass
import time

@dataclass
class OptimizationSuggestion:
    """최적화 제안"""
    category: str  # memory, performance, etc.
    column: Optional[str]
    current_state: str
    suggestion: str
    estimated_improvement: str
    code_example: str

class PandasOptimizer:
    """
    pandas DataFrame 자동 최적화 도구

    사용법:
        optimizer = PandasOptimizer(df)
        report = optimizer.analyze()
        df_optimized = optimizer.optimize()
    """

    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.original_memory = df.memory_usage(deep=True).sum()
        self.suggestions: List[OptimizationSuggestion] = []

    # ===========================================
    # Part 1: 메모리 분석
    # ===========================================

    def analyze_memory(self) -> Dict:
        """메모리 사용 현황 분석"""
        # TODO: 구현
        # 1. 각 컬럼별 메모리 사용량
        # 2. 다운캐스팅 가능 여부 확인
        # 3. Categorical 변환 권장 여부
        pass

    def suggest_memory_optimizations(self) -> List[OptimizationSuggestion]:
        """메모리 최적화 제안 생성"""
        # TODO: 구현
        pass

    # ===========================================
    # Part 2: 성능 분석
    # ===========================================

    def analyze_dtypes(self) -> Dict:
        """데이터 타입 분석"""
        # TODO: 구현
        # 1. 각 컬럼의 현재 dtype
        # 2. 최적의 dtype 제안
        pass

    def detect_performance_issues(self) -> List[OptimizationSuggestion]:
        """잠재적 성능 문제 탐지"""
        # TODO: 구현
        # 1. 문자열 컬럼 중 날짜/숫자로 변환 가능한 것
        # 2. 중복 데이터 탐지
        # 3. 인덱스 최적화 제안
        pass

    # ===========================================
    # Part 3: 자동 최적화
    # ===========================================

    def optimize(self, inplace: bool = False) -> pd.DataFrame:
        """자동 최적화 적용"""
        # TODO: 구현
        # 1. 정수 다운캐스팅
        # 2. 실수 다운캐스팅
        # 3. Categorical 변환
        # 4. 최적화 결과 반환
        pass

    # ===========================================
    # Part 4: 리포트 생성
    # ===========================================

    def analyze(self) -> str:
        """전체 분석 리포트 생성"""
        # TODO: 구현
        pass

    def benchmark_optimization(self, operation: Callable) -> Dict:
        """최적화 전후 성능 벤치마크"""
        # TODO: 구현
        # 1. 원본 DataFrame으로 operation 실행 시간 측정
        # 2. 최적화된 DataFrame으로 실행 시간 측정
        # 3. 비교 결과 반환
        pass

# ===========================================
# 테스트
# ===========================================

# 테스트 데이터 생성
np.random.seed(42)
n_rows = 100_000

df_test = pd.DataFrame({
    'id': range(n_rows),
    'category': np.random.choice(['A', 'B', 'C', 'D', 'E'], n_rows),
    'value': np.random.randint(0, 1000, n_rows),
    'price': np.random.uniform(0, 100, n_rows),
    'date_str': pd.date_range('2020-01-01', periods=n_rows, freq='T').astype(str),
    'flag': np.random.choice([True, False], n_rows),
    'code': np.random.choice(['X001', 'X002', 'X003'], n_rows)
})

print("=== 원본 DataFrame 정보 ===")
print(df_test.info())
print(f"\\n메모리 사용량: {df_test.memory_usage(deep=True).sum() / 1024**2:.2f} MB")

# 테스트 실행
if __name__ == "__main__":
    optimizer = PandasOptimizer(df_test)

    # 분석 리포트
    print(optimizer.analyze())

    # 최적화 적용
    df_optimized = optimizer.optimize()
    print(f"\\n최적화 후 메모리: {df_optimized.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
`,
      solutionCode: `import pandas as pd
import numpy as np
from typing import List, Dict, Callable, Optional
from dataclasses import dataclass
import time

@dataclass
class OptimizationSuggestion:
    """최적화 제안"""
    category: str
    column: Optional[str]
    current_state: str
    suggestion: str
    estimated_improvement: str
    code_example: str

class PandasOptimizer:
    """pandas DataFrame 자동 최적화 도구"""

    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()
        self.original_memory = df.memory_usage(deep=True).sum()
        self.suggestions: List[OptimizationSuggestion] = []

    # ===========================================
    # Part 1: 메모리 분석
    # ===========================================

    def analyze_memory(self) -> Dict:
        """메모리 사용 현황 분석"""
        memory_usage = self.df.memory_usage(deep=True)
        total_memory = memory_usage.sum()

        analysis = {
            'total_memory_mb': total_memory / 1024**2,
            'columns': {}
        }

        for col in self.df.columns:
            col_memory = memory_usage[col]
            col_dtype = self.df[col].dtype

            col_analysis = {
                'dtype': str(col_dtype),
                'memory_mb': col_memory / 1024**2,
                'memory_pct': 100 * col_memory / total_memory,
                'can_downcast': False,
                'suggested_dtype': None
            }

            # 정수 다운캐스팅 가능 여부
            if np.issubdtype(col_dtype, np.integer):
                c_min, c_max = self.df[col].min(), self.df[col].max()
                if c_min >= 0 and c_max <= 255:
                    col_analysis['can_downcast'] = True
                    col_analysis['suggested_dtype'] = 'uint8'
                elif c_min >= -128 and c_max <= 127:
                    col_analysis['can_downcast'] = True
                    col_analysis['suggested_dtype'] = 'int8'
                elif c_min >= -32768 and c_max <= 32767:
                    col_analysis['can_downcast'] = True
                    col_analysis['suggested_dtype'] = 'int16'
                elif c_min >= -2147483648 and c_max <= 2147483647:
                    col_analysis['can_downcast'] = True
                    col_analysis['suggested_dtype'] = 'int32'

            # 실수 다운캐스팅 가능 여부
            elif np.issubdtype(col_dtype, np.floating):
                col_analysis['can_downcast'] = True
                col_analysis['suggested_dtype'] = 'float32'

            # Categorical 변환 가능 여부
            elif col_dtype == 'object':
                n_unique = self.df[col].nunique()
                n_total = len(self.df[col])
                if n_unique / n_total < 0.5:  # 고유값 50% 미만
                    col_analysis['can_downcast'] = True
                    col_analysis['suggested_dtype'] = 'category'

            analysis['columns'][col] = col_analysis

        return analysis

    def suggest_memory_optimizations(self) -> List[OptimizationSuggestion]:
        """메모리 최적화 제안 생성"""
        suggestions = []
        analysis = self.analyze_memory()

        for col, info in analysis['columns'].items():
            if info['can_downcast'] and info['suggested_dtype']:
                suggestion = OptimizationSuggestion(
                    category='memory',
                    column=col,
                    current_state=f"현재 dtype: {info['dtype']} ({info['memory_mb']:.2f} MB)",
                    suggestion=f"{info['suggested_dtype']}로 변환 권장",
                    estimated_improvement=f"~{info['memory_pct']/2:.1f}% 절약 예상",
                    code_example=f"df['{col}'] = df['{col}'].astype('{info['suggested_dtype']}')"
                )
                suggestions.append(suggestion)

        self.suggestions.extend(suggestions)
        return suggestions

    # ===========================================
    # Part 2: 성능 분석
    # ===========================================

    def analyze_dtypes(self) -> Dict:
        """데이터 타입 분석"""
        return {
            col: {
                'current': str(self.df[col].dtype),
                'optimal': self._get_optimal_dtype(col)
            }
            for col in self.df.columns
        }

    def _get_optimal_dtype(self, col: str) -> str:
        """최적 dtype 결정"""
        dtype = self.df[col].dtype

        if np.issubdtype(dtype, np.integer):
            return self._optimal_int_dtype(self.df[col])
        elif np.issubdtype(dtype, np.floating):
            return 'float32'
        elif dtype == 'object':
            # 날짜 변환 가능 여부
            try:
                pd.to_datetime(self.df[col].head(100))
                return 'datetime64[ns]'
            except:
                pass
            # 숫자 변환 가능 여부
            try:
                pd.to_numeric(self.df[col].head(100))
                return 'numeric'
            except:
                pass
            # Categorical
            if self.df[col].nunique() / len(self.df[col]) < 0.5:
                return 'category'
            return 'object'
        elif dtype == 'bool':
            return 'bool'
        return str(dtype)

    def _optimal_int_dtype(self, series: pd.Series) -> str:
        """정수 시리즈의 최적 dtype 결정"""
        c_min, c_max = series.min(), series.max()
        if c_min >= 0:
            if c_max <= 255: return 'uint8'
            if c_max <= 65535: return 'uint16'
            if c_max <= 4294967295: return 'uint32'
        else:
            if c_min >= -128 and c_max <= 127: return 'int8'
            if c_min >= -32768 and c_max <= 32767: return 'int16'
            if c_min >= -2147483648 and c_max <= 2147483647: return 'int32'
        return 'int64'

    def detect_performance_issues(self) -> List[OptimizationSuggestion]:
        """잠재적 성능 문제 탐지"""
        suggestions = []

        for col in self.df.columns:
            dtype = self.df[col].dtype

            # 날짜 문자열 탐지
            if dtype == 'object':
                sample = self.df[col].head(100)
                try:
                    pd.to_datetime(sample)
                    suggestions.append(OptimizationSuggestion(
                        category='performance',
                        column=col,
                        current_state='문자열로 저장된 날짜 데이터',
                        suggestion='datetime64로 변환하면 날짜 연산 성능 향상',
                        estimated_improvement='날짜 연산 10배 이상 빠름',
                        code_example=f"df['{col}'] = pd.to_datetime(df['{col}'])"
                    ))
                except:
                    pass

        # 중복 행 탐지
        n_duplicates = self.df.duplicated().sum()
        if n_duplicates > 0:
            suggestions.append(OptimizationSuggestion(
                category='data_quality',
                column=None,
                current_state=f'{n_duplicates:,}개 중복 행 존재',
                suggestion='중복 제거로 메모리 및 연산 시간 절약',
                estimated_improvement=f'{100*n_duplicates/len(self.df):.1f}% 데이터 감소',
                code_example="df = df.drop_duplicates()"
            ))

        self.suggestions.extend(suggestions)
        return suggestions

    # ===========================================
    # Part 3: 자동 최적화
    # ===========================================

    def optimize(self, inplace: bool = False) -> pd.DataFrame:
        """자동 최적화 적용"""
        df = self.df if inplace else self.df.copy()

        for col in df.columns:
            dtype = df[col].dtype

            # 정수 다운캐스팅
            if np.issubdtype(dtype, np.integer):
                optimal = self._optimal_int_dtype(df[col])
                df[col] = df[col].astype(optimal)

            # 실수 다운캐스팅
            elif np.issubdtype(dtype, np.floating):
                df[col] = df[col].astype('float32')

            # 문자열 → Categorical
            elif dtype == 'object':
                if df[col].nunique() / len(df[col]) < 0.5:
                    df[col] = df[col].astype('category')

        return df

    # ===========================================
    # Part 4: 리포트 생성
    # ===========================================

    def analyze(self) -> str:
        """전체 분석 리포트 생성"""
        # 분석 실행
        memory_analysis = self.analyze_memory()
        self.suggest_memory_optimizations()
        self.detect_performance_issues()

        # 리포트 생성
        report = []
        report.append("=" * 60)
        report.append("📊 pandas DataFrame 최적화 분석 리포트")
        report.append("=" * 60)

        report.append(f"\\n📦 총 메모리 사용량: {memory_analysis['total_memory_mb']:.2f} MB")
        report.append(f"📏 행 수: {len(self.df):,}")
        report.append(f"📐 컬럼 수: {len(self.df.columns)}")

        report.append("\\n" + "-" * 40)
        report.append("💡 최적화 제안")
        report.append("-" * 40)

        for i, sug in enumerate(self.suggestions, 1):
            report.append(f"\\n[{i}] {sug.category.upper()}")
            if sug.column:
                report.append(f"    컬럼: {sug.column}")
            report.append(f"    현재: {sug.current_state}")
            report.append(f"    제안: {sug.suggestion}")
            report.append(f"    예상 효과: {sug.estimated_improvement}")
            report.append(f"    코드: {sug.code_example}")

        report.append("\\n" + "=" * 60)

        return "\\n".join(report)

    def benchmark_optimization(self, operation: Callable) -> Dict:
        """최적화 전후 성능 벤치마크"""
        # 원본으로 벤치마크
        start = time.time()
        _ = operation(self.df)
        original_time = time.time() - start

        # 최적화 후 벤치마크
        df_optimized = self.optimize()
        start = time.time()
        _ = operation(df_optimized)
        optimized_time = time.time() - start

        return {
            'original_time': original_time,
            'optimized_time': optimized_time,
            'speedup': original_time / optimized_time if optimized_time > 0 else float('inf'),
            'original_memory_mb': self.df.memory_usage(deep=True).sum() / 1024**2,
            'optimized_memory_mb': df_optimized.memory_usage(deep=True).sum() / 1024**2
        }

# ===========================================
# 테스트
# ===========================================

np.random.seed(42)
n_rows = 100_000

df_test = pd.DataFrame({
    'id': range(n_rows),
    'category': np.random.choice(['A', 'B', 'C', 'D', 'E'], n_rows),
    'value': np.random.randint(0, 1000, n_rows),
    'price': np.random.uniform(0, 100, n_rows),
    'date_str': pd.date_range('2020-01-01', periods=n_rows, freq='T').astype(str),
    'flag': np.random.choice([True, False], n_rows),
    'code': np.random.choice(['X001', 'X002', 'X003'], n_rows)
})

print("=== 원본 DataFrame 정보 ===")
print(df_test.dtypes)
print(f"\\n메모리 사용량: {df_test.memory_usage(deep=True).sum() / 1024**2:.2f} MB")

if __name__ == "__main__":
    optimizer = PandasOptimizer(df_test)

    # 분석 리포트
    print(optimizer.analyze())

    # 최적화 적용
    df_optimized = optimizer.optimize()

    print("\\n=== 최적화 후 DataFrame 정보 ===")
    print(df_optimized.dtypes)
    print(f"\\n최적화 후 메모리: {df_optimized.memory_usage(deep=True).sum() / 1024**2:.2f} MB")

    # 벤치마크
    print("\\n=== 성능 벤치마크 ===")

    def test_operation(df):
        return df.groupby('category')['value'].sum()

    benchmark = optimizer.benchmark_optimization(test_operation)
    print(f"원본 시간: {benchmark['original_time']:.4f}초")
    print(f"최적화 시간: {benchmark['optimized_time']:.4f}초")
    print(f"속도 향상: {benchmark['speedup']:.2f}배")
    print(f"메모리 절약: {benchmark['original_memory_mb'] - benchmark['optimized_memory_mb']:.2f} MB")
`,
      instructions: '실무에서 바로 사용할 수 있는 pandas 자동 최적화 라이브러리를 구현합니다. 메모리 분석, 성능 문제 탐지, 자동 최적화, 벤치마킹 기능을 포함합니다.',
      keyPoints: [
        'dataclass로 구조화된 최적화 제안 생성',
        '컬럼별 최적 dtype 자동 탐지',
        '날짜 문자열, 중복 데이터 등 성능 문제 탐지',
        '최적화 전후 벤치마킹으로 효과 검증'
      ]
    }
  }
]
