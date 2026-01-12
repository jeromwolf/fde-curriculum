// Day 1: 이터레이터 & 제너레이터
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'iterator-protocol-video',
    type: 'video',
    title: '이터레이터 프로토콜 개념 (__iter__, __next__)',
    duration: 15,
    content: {
      objectives: [
        '이터레이터 프로토콜의 핵심 메서드를 이해한다',
        '__iter__와 __next__의 역할을 구분한다',
        'StopIteration 예외의 동작을 파악한다'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=jTYiNjvnHZY',
      transcript: `
## 이터레이터 프로토콜이란?

Python에서 **이터레이터(Iterator)**는 데이터 컬렉션을 순회하는 객체입니다. for 루프가 동작하는 핵심 원리가 바로 이터레이터 프로토콜입니다.

### 이터레이터 프로토콜의 두 가지 메서드

| 메서드 | 역할 | 반환값 |
|--------|------|--------|
| \`__iter__()\` | 이터레이터 객체 반환 | self (보통) |
| \`__next__()\` | 다음 요소 반환 | 다음 값 또는 StopIteration |

### for 루프의 실제 동작

\`\`\`python
# 이 코드가
for item in [1, 2, 3]:
    print(item)

# 실제로는 이렇게 동작합니다
iterator = iter([1, 2, 3])  # __iter__() 호출
while True:
    try:
        item = next(iterator)  # __next__() 호출
        print(item)
    except StopIteration:
        break
\`\`\`

### 이터러블 vs 이터레이터

\`\`\`
┌─────────────────────────────────────────────────────────┐
│  Iterable (이터러블)                                     │
│  - __iter__() 메서드를 가진 객체                         │
│  - 예: list, tuple, str, dict, set, range               │
│  - iter() 함수로 이터레이터를 얻을 수 있음               │
├─────────────────────────────────────────────────────────┤
│  Iterator (이터레이터)                                   │
│  - __iter__() + __next__() 메서드를 가진 객체           │
│  - 한 번 소진되면 재사용 불가 (일회성)                   │
│  - 예: iter([1,2,3]), 파일 객체, 제너레이터              │
└─────────────────────────────────────────────────────────┘
\`\`\`

### 핵심 메시지

> "이터레이터는 **게으른(lazy)** 순회자입니다. 필요할 때만 다음 값을 계산합니다."

다음 강의에서 커스텀 이터레이터를 직접 구현해보겠습니다.
      `,
      keyPoints: [
        '__iter__()는 이터레이터 객체를 반환',
        '__next__()는 다음 요소를 반환하고 끝나면 StopIteration 발생',
        '이터러블은 __iter__만, 이터레이터는 __iter__ + __next__ 모두 필요',
        'for 루프는 내부적으로 iter()와 next()를 호출'
      ]
    }
  },
  {
    id: 'iterator-docs-reading',
    type: 'reading',
    title: 'Python 공식 문서: Iterator Types',
    duration: 10,
    content: {
      objectives: [
        'Python 공식 문서에서 이터레이터 관련 정보를 찾을 수 있다',
        '내장 이터레이터 함수들을 파악한다',
        'itertools 모듈의 존재를 인지한다'
      ],
      markdown: `
# Python Iterator Types 공식 문서 요약

## 컨테이너 객체의 이터레이션 지원

Python에서 컨테이너 객체가 이터레이션을 지원하려면 다음 메서드를 정의해야 합니다:

### \`container.__iter__()\`

이터레이터 객체를 반환합니다. 이 객체는 아래에 설명된 이터레이터 프로토콜을 지원해야 합니다.

### 이터레이터 프로토콜

이터레이터 객체 자체는 다음 두 메서드를 구현해야 합니다:

| 메서드 | 설명 |
|--------|------|
| \`iterator.__iter__()\` | 이터레이터 객체 자체를 반환 |
| \`iterator.__next__()\` | 컨테이너의 다음 항목 반환. 더 이상 항목이 없으면 \`StopIteration\` 예외 발생 |

## 내장 함수

\`\`\`python
# 이터레이터 관련 내장 함수
iter(object)        # 이터러블에서 이터레이터 생성
next(iterator)      # 다음 항목 반환
next(iterator, default)  # 끝나면 default 반환 (StopIteration 대신)
\`\`\`

## itertools 모듈 미리보기

\`\`\`python
import itertools

# 무한 이터레이터
itertools.count(10)      # 10, 11, 12, ...
itertools.cycle('ABC')   # A, B, C, A, B, C, ...
itertools.repeat(10, 3)  # 10, 10, 10

# 조합 이터레이터
itertools.chain([1,2], [3,4])  # 1, 2, 3, 4
itertools.zip_longest([1,2], [3,4,5])  # (1,3), (2,4), (None,5)

# 필터링
itertools.filterfalse(lambda x: x%2, range(10))  # 0, 2, 4, 6, 8
itertools.takewhile(lambda x: x<5, range(10))    # 0, 1, 2, 3, 4
\`\`\`

## 핵심 정리

| 구분 | 필수 메서드 | 예시 |
|------|------------|------|
| Iterable | \`__iter__()\` | list, str, dict |
| Iterator | \`__iter__()\` + \`__next__()\` | iter(list), 파일 객체 |

> **팁**: 공식 문서는 [docs.python.org/3/library/stdtypes.html#iterator-types](https://docs.python.org/3/library/stdtypes.html#iterator-types)에서 확인하세요.
      `,
      externalLinks: [
        { title: 'Python 공식 문서: Iterator Types', url: 'https://docs.python.org/3/library/stdtypes.html#iterator-types' },
        { title: 'itertools 모듈 문서', url: 'https://docs.python.org/3/library/itertools.html' },
        { title: 'PEP 234 – Iterators', url: 'https://peps.python.org/pep-0234/' }
      ],
      keyPoints: [
        '__iter__()는 이터레이터 객체를 반환해야 함',
        '__next__()는 다음 항목 반환, 끝나면 StopIteration',
        'itertools 모듈로 고급 이터레이터 조합 가능',
        'next(iter, default)로 StopIteration 대신 기본값 반환 가능'
      ]
    }
  },
  {
    id: 'custom-iterator-code',
    type: 'code',
    title: '커스텀 이터레이터 클래스 작성 (Range 구현)',
    duration: 15,
    content: {
      objectives: [
        '직접 이터레이터 클래스를 구현할 수 있다',
        '__iter__와 __next__ 메서드를 올바르게 작성한다',
        'StopIteration을 적절한 시점에 발생시킨다'
      ],
      instructions: `
커스텀 Range 클래스를 구현하여 이터레이터 프로토콜을 익힙니다.

## 요구사항
1. \`MyRange(start, stop, step=1)\` 클래스 구현
2. \`__iter__\`와 \`__next__\` 메서드 구현
3. Python 내장 \`range\`와 동일하게 동작

## 기대 출력
\`\`\`python
for i in MyRange(0, 5):
    print(i)  # 0, 1, 2, 3, 4

for i in MyRange(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8
\`\`\`
      `,
      starterCode: `
class MyRange:
    """Python의 range()와 동일하게 동작하는 커스텀 이터레이터"""

    def __init__(self, start: int, stop: int, step: int = 1):
        # TODO: 초기화
        pass

    def __iter__(self):
        # TODO: 이터레이터 객체 반환
        pass

    def __next__(self):
        # TODO: 다음 값 반환 또는 StopIteration 발생
        pass


# 테스트
print("MyRange(0, 5):")
for i in MyRange(0, 5):
    print(i, end=" ")
print()

print("\\nMyRange(0, 10, 2):")
for i in MyRange(0, 10, 2):
    print(i, end=" ")
print()

print("\\nMyRange(10, 0, -1):")
for i in MyRange(10, 0, -1):
    print(i, end=" ")
      `,
      solutionCode: `
class MyRange:
    """Python의 range()와 동일하게 동작하는 커스텀 이터레이터

    🎯 역할: start부터 stop 전까지 step 간격으로 순회

    💡 핵심 포인트:
    - __iter__()는 self를 반환하여 이터레이터 자체가 됨
    - __next__()에서 현재 값 반환 후 다음 값으로 이동
    - 범위를 벗어나면 StopIteration 발생
    """

    def __init__(self, start: int, stop: int, step: int = 1):
        """초기화: 시작값, 끝값, 간격 설정

        Args:
            start: 시작 값 (포함)
            stop: 끝 값 (미포함)
            step: 증가량 (기본값 1)
        """
        self.start = start
        self.stop = stop
        self.step = step
        self.current = start  # 현재 위치 추적

    def __iter__(self):
        """이터레이터 객체 반환

        Returns:
            self - 이 객체 자체가 이터레이터

        💡 주의: 새로운 순회를 위해 current 리셋
        """
        self.current = self.start
        return self

    def __next__(self):
        """다음 값 반환

        Returns:
            다음 순회 값

        Raises:
            StopIteration: 범위를 벗어났을 때
        """
        # step이 양수일 때: current < stop
        # step이 음수일 때: current > stop
        if self.step > 0 and self.current >= self.stop:
            raise StopIteration
        if self.step < 0 and self.current <= self.stop:
            raise StopIteration

        value = self.current
        self.current += self.step
        return value


# 테스트
print("MyRange(0, 5):")
for i in MyRange(0, 5):
    print(i, end=" ")  # 0 1 2 3 4
print()

print("\\nMyRange(0, 10, 2):")
for i in MyRange(0, 10, 2):
    print(i, end=" ")  # 0 2 4 6 8
print()

print("\\nMyRange(10, 0, -1):")
for i in MyRange(10, 0, -1):
    print(i, end=" ")  # 10 9 8 7 6 5 4 3 2 1
print()

# 재사용 테스트
print("\\n재사용 테스트:")
my_range = MyRange(1, 4)
print("첫 번째 순회:", list(my_range))  # [1, 2, 3]
print("두 번째 순회:", list(my_range))  # [1, 2, 3] - __iter__에서 리셋했기 때문
      `,
      keyPoints: [
        '__iter__()는 self를 반환하고 current를 리셋',
        '__next__()는 현재 값 반환 후 다음으로 이동',
        'step 방향에 따라 종료 조건이 다름',
        '재사용을 위해 __iter__에서 상태 초기화 필요'
      ]
    }
  },
  {
    id: 'iterator-quiz',
    type: 'quiz',
    title: '이터레이터 개념 퀴즈',
    duration: 5,
    content: {
      objectives: [
        '이터레이터 프로토콜 이해도를 점검한다'
      ],
      questions: [
        {
          question: '다음 중 이터레이터(Iterator)의 필수 메서드가 아닌 것은?',
          options: [
            '__iter__()',
            '__next__()',
            '__len__()',
            'StopIteration 예외 발생'
          ],
          answer: 2,
          explanation: '이터레이터는 __iter__()와 __next__() 두 메서드만 필수입니다. __len__()은 이터레이터의 필수 요소가 아닙니다.'
        },
        {
          question: '리스트 [1, 2, 3]에 대해 iter()를 두 번 호출하면?',
          options: [
            '같은 이터레이터 객체가 반환된다',
            '서로 다른 이터레이터 객체가 반환된다',
            '에러가 발생한다',
            '빈 이터레이터가 반환된다'
          ],
          answer: 1,
          explanation: 'iter()를 호출할 때마다 새로운 이터레이터 객체가 생성됩니다. 각 이터레이터는 독립적으로 순회합니다.'
        },
        {
          question: '이터레이터가 끝났을 때 발생하는 예외는?',
          options: [
            'IndexError',
            'ValueError',
            'StopIteration',
            'EndOfIterator'
          ],
          answer: 2,
          explanation: '__next__()에서 더 이상 반환할 값이 없으면 StopIteration 예외를 발생시킵니다. for 루프는 이 예외를 자동으로 처리합니다.'
        }
      ],
      keyPoints: [
        '이터레이터 = __iter__() + __next__()',
        'iter() 호출마다 새 이터레이터 생성',
        '끝나면 StopIteration 발생'
      ]
    }
  },
  {
    id: 'generator-yield-video',
    type: 'video',
    title: 'yield 키워드와 제너레이터 동작 원리',
    duration: 15,
    content: {
      objectives: [
        'yield 키워드의 동작 원리를 이해한다',
        '제너레이터 함수와 일반 함수의 차이를 파악한다',
        '제너레이터의 상태 유지 메커니즘을 이해한다'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=bD05uGo_sVI',
      transcript: `
## 제너레이터(Generator)란?

**제너레이터**는 이터레이터를 쉽게 만드는 방법입니다. \`yield\` 키워드를 사용하는 함수는 자동으로 제너레이터가 됩니다.

### 일반 함수 vs 제너레이터 함수

\`\`\`python
# 일반 함수: return으로 값 반환 후 종료
def normal_function():
    return 1
    return 2  # 절대 실행되지 않음
    return 3

# 제너레이터 함수: yield로 값을 하나씩 생성
def generator_function():
    yield 1
    yield 2  # 다음 next() 호출 시 실행
    yield 3
\`\`\`

### yield의 마법

\`\`\`
┌──────────────────────────────────────────────────────┐
│  yield의 동작 원리                                    │
│                                                      │
│  1. yield 값 반환                                    │
│  2. 함수 상태(지역 변수, 실행 위치) 저장               │
│  3. 다음 next() 호출까지 일시 정지                    │
│  4. next() 호출 시 저장된 위치부터 재개               │
└──────────────────────────────────────────────────────┘
\`\`\`

### 제너레이터의 상태 유지

\`\`\`python
def countdown(n):
    print(f"카운트다운 시작: {n}")
    while n > 0:
        yield n  # 여기서 멈춤
        n -= 1   # next() 호출 시 여기서 재개
    print("발사!")

gen = countdown(3)
print(next(gen))  # "카운트다운 시작: 3" 출력 후 3 반환
print(next(gen))  # 2 반환 (n -= 1 실행 후)
print(next(gen))  # 1 반환
print(next(gen))  # "발사!" 출력 후 StopIteration
\`\`\`

### 제너레이터 vs 리스트

| 특성 | 리스트 | 제너레이터 |
|------|--------|-----------|
| 메모리 | 모든 값 저장 | 한 번에 하나만 |
| 생성 시점 | 즉시 전체 생성 | 필요할 때 생성 (lazy) |
| 재사용 | 무제한 | 한 번만 |
| 길이 확인 | len() 가능 | len() 불가 |

### 핵심 메시지

> "yield는 **일시정지 버튼**입니다. 함수를 멈추고, 값을 내보내고, 나중에 그 자리에서 다시 시작합니다."
      `,
      keyPoints: [
        'yield는 값을 반환하고 함수 상태를 저장',
        '다음 next() 호출 시 yield 다음 줄부터 재개',
        '제너레이터는 메모리 효율적 (lazy evaluation)',
        '한 번 소진되면 재사용 불가'
      ]
    }
  },
  {
    id: 'generator-basic-code',
    type: 'code',
    title: '기본 제너레이터 작성 (피보나치, 소수 생성)',
    duration: 15,
    content: {
      objectives: [
        'yield를 사용하여 제너레이터 함수를 작성한다',
        '무한 시퀀스를 제너레이터로 표현한다',
        '피보나치 수열과 소수 생성기를 구현한다'
      ],
      instructions: `
두 가지 클래식한 시퀀스를 제너레이터로 구현합니다.

## 과제 1: 피보나치 수열 제너레이터
- 무한 피보나치 수열 생성
- 0, 1, 1, 2, 3, 5, 8, 13, ...

## 과제 2: 소수(Prime) 생성기
- n까지의 소수를 생성
- 2, 3, 5, 7, 11, 13, ...
      `,
      starterCode: `
def fibonacci():
    """무한 피보나치 수열 제너레이터

    Yields:
        int: 피보나치 수열의 다음 값

    Example:
        fib = fibonacci()
        next(fib)  # 0
        next(fib)  # 1
        next(fib)  # 1
        next(fib)  # 2
    """
    # TODO: 구현하세요
    pass


def primes(limit: int):
    """주어진 범위까지의 소수 생성기

    Args:
        limit: 이 값까지의 소수를 생성

    Yields:
        int: 소수

    Example:
        list(primes(20))  # [2, 3, 5, 7, 11, 13, 17, 19]
    """
    # TODO: 구현하세요
    pass


# 테스트: 피보나치
print("피보나치 처음 10개:")
fib = fibonacci()
for _ in range(10):
    print(next(fib), end=" ")
print()

# 테스트: 소수
print("\\n50 이하의 소수:")
print(list(primes(50)))
      `,
      solutionCode: `
def fibonacci():
    """무한 피보나치 수열 제너레이터

    🎯 역할: 피보나치 수열을 무한히 생성

    💡 핵심 포인트:
    - while True로 무한 루프
    - a, b = b, a + b로 다음 값 계산
    - yield로 현재 값 반환 후 일시정지

    Yields:
        int: 피보나치 수열의 다음 값 (0, 1, 1, 2, 3, 5, ...)
    """
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b  # 동시 할당: a는 b가 되고, b는 a+b가 됨


def is_prime(n: int) -> bool:
    """소수 판별 헬퍼 함수

    Args:
        n: 판별할 수

    Returns:
        bool: 소수이면 True
    """
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    # 홀수만 검사 (제곱근까지)
    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            return False
    return True


def primes(limit: int):
    """주어진 범위까지의 소수 생성기

    🎯 역할: 2부터 limit까지의 소수만 생성

    💡 핵심 포인트:
    - 각 수를 is_prime으로 검사
    - 소수일 때만 yield
    - 메모리 효율적 (리스트 저장 없음)

    Args:
        limit: 이 값까지의 소수를 생성 (포함)

    Yields:
        int: 소수
    """
    for num in range(2, limit + 1):
        if is_prime(num):
            yield num


# 에라토스테네스의 체 버전 (더 효율적)
def primes_sieve(limit: int):
    """에라토스테네스의 체를 사용한 소수 생성기

    시간복잡도: O(n log log n)
    """
    if limit < 2:
        return

    sieve = [True] * (limit + 1)
    sieve[0] = sieve[1] = False

    for i in range(2, int(limit**0.5) + 1):
        if sieve[i]:
            for j in range(i*i, limit + 1, i):
                sieve[j] = False

    for num, is_prime in enumerate(sieve):
        if is_prime:
            yield num


# 테스트: 피보나치
print("피보나치 처음 10개:")
fib = fibonacci()
for _ in range(10):
    print(next(fib), end=" ")  # 0 1 1 2 3 5 8 13 21 34
print()

# 테스트: 소수
print("\\n50 이하의 소수:")
print(list(primes(50)))  # [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]

# 테스트: 에라토스테네스의 체
print("\\n50 이하의 소수 (체):")
print(list(primes_sieve(50)))
      `,
      keyPoints: [
        'while True + yield = 무한 제너레이터',
        '피보나치: a, b = b, a+b 동시 할당 패턴',
        '소수 생성기는 메모리 효율적 (리스트 저장 없음)',
        '에라토스테네스의 체로 더 빠른 소수 생성 가능'
      ]
    }
  },
  {
    id: 'memory-comparison-code',
    type: 'code',
    title: '메모리 효율 비교 (리스트 vs 제너레이터)',
    duration: 10,
    content: {
      objectives: [
        '리스트와 제너레이터의 메모리 사용량 차이를 측정한다',
        'sys.getsizeof()로 메모리 사용량을 확인한다',
        '대용량 데이터에서 제너레이터의 장점을 체감한다'
      ],
      instructions: `
동일한 데이터를 리스트와 제너레이터로 생성하고 메모리 사용량을 비교합니다.

## 실험
- 1,000,000개의 숫자 제곱
- 리스트 컴프리헨션 vs 제너레이터 표현식
      `,
      starterCode: `
import sys

def squares_list(n: int) -> list:
    """1부터 n까지 제곱을 리스트로 반환"""
    return [x**2 for x in range(1, n+1)]


def squares_generator(n: int):
    """1부터 n까지 제곱을 제너레이터로 반환"""
    return (x**2 for x in range(1, n+1))


# 메모리 비교 실험
n = 1_000_000

# 리스트 생성
lst = squares_list(n)
print(f"리스트 메모리: {sys.getsizeof(lst):,} bytes")

# 제너레이터 생성
gen = squares_generator(n)
print(f"제너레이터 메모리: {sys.getsizeof(gen):,} bytes")

# TODO: 합계 계산 시간도 비교해보세요
# import time으로 시간 측정
      `,
      solutionCode: `
import sys
import time

def squares_list(n: int) -> list:
    """1부터 n까지 제곱을 리스트로 반환

    💡 특징: 모든 값을 메모리에 저장
    """
    return [x**2 for x in range(1, n+1)]


def squares_generator(n: int):
    """1부터 n까지 제곱을 제너레이터로 반환

    💡 특징: 필요할 때만 값을 계산 (lazy)
    """
    return (x**2 for x in range(1, n+1))


# 메모리 비교 실험
n = 1_000_000

print("=" * 50)
print(f"테스트: {n:,}개의 숫자 제곱")
print("=" * 50)

# 1. 메모리 사용량 비교
lst = squares_list(n)
gen = squares_generator(n)

print(f"\\n📊 메모리 사용량:")
print(f"  리스트:     {sys.getsizeof(lst):>15,} bytes ({sys.getsizeof(lst)/1024/1024:.2f} MB)")
print(f"  제너레이터: {sys.getsizeof(gen):>15,} bytes")
print(f"  차이:       {sys.getsizeof(lst) / sys.getsizeof(gen):.0f}배")

# 2. 합계 계산 시간 비교
print(f"\\n⏱️ 합계 계산 시간:")

# 리스트 (이미 생성됨)
start = time.perf_counter()
sum_list = sum(lst)
time_list = time.perf_counter() - start
print(f"  리스트:     {time_list:.4f}초 (합계: {sum_list:,})")

# 제너레이터 (새로 생성 - 이전 건 소진됨)
start = time.perf_counter()
sum_gen = sum(squares_generator(n))  # 새 제너레이터 필요
time_gen = time.perf_counter() - start
print(f"  제너레이터: {time_gen:.4f}초 (합계: {sum_gen:,})")

# 3. 리스트 생성 시간 포함 비교
print(f"\\n⏱️ 생성 + 합계 계산 시간:")

start = time.perf_counter()
sum_list2 = sum(squares_list(n))
time_list_total = time.perf_counter() - start
print(f"  리스트:     {time_list_total:.4f}초")

start = time.perf_counter()
sum_gen2 = sum(squares_generator(n))
time_gen_total = time.perf_counter() - start
print(f"  제너레이터: {time_gen_total:.4f}초")

print("\\n" + "=" * 50)
print("💡 결론:")
print("  - 메모리: 제너레이터가 압도적으로 효율적")
print("  - 속도: 생성+처리 포함 시 제너레이터가 유리")
print("  - 재사용: 리스트는 가능, 제너레이터는 불가")
print("=" * 50)
      `,
      keyPoints: [
        '제너레이터는 리스트 대비 수천 배 메모리 절약',
        '대용량 데이터는 반드시 제너레이터 사용',
        '제너레이터는 일회용 (재사용 시 새로 생성 필요)',
        'sum(), max(), min() 등은 제너레이터와 잘 동작'
      ]
    }
  },
  {
    id: 'generator-quiz',
    type: 'quiz',
    title: '제너레이터 퀴즈',
    duration: 5,
    content: {
      objectives: [
        '제너레이터의 동작 원리를 이해했는지 확인한다'
      ],
      questions: [
        {
          question: '제너레이터 함수가 일반 함수와 다른 점은?',
          options: [
            'def 대신 gen 키워드를 사용한다',
            'yield 키워드를 사용하여 값을 반환한다',
            '반드시 클래스 안에 정의해야 한다',
            'async와 함께 사용해야 한다'
          ],
          answer: 1,
          explanation: '함수 내에 yield 키워드가 있으면 그 함수는 자동으로 제너레이터 함수가 됩니다. 호출 시 제너레이터 객체를 반환합니다.'
        },
        {
          question: '다음 코드의 출력은?\n\ndef gen():\n    yield 1\n    yield 2\n\ng = gen()\nprint(type(g))',
          options: [
            '<class \'function\'>',
            '<class \'generator\'>',
            '<class \'int\'>',
            '<class \'list\'>'
          ],
          answer: 1,
          explanation: '제너레이터 함수를 호출하면 함수가 실행되는 것이 아니라 제너레이터 객체가 반환됩니다.'
        },
        {
          question: '리스트 컴프리헨션 [x for x in range(10)]과 제너레이터 표현식 (x for x in range(10))의 차이점은?',
          options: [
            '문법만 다르고 동일하게 동작한다',
            '리스트는 즉시 모든 값을 생성하고, 제너레이터는 필요할 때 생성한다',
            '제너레이터가 더 많은 메모리를 사용한다',
            '리스트만 for 루프에 사용할 수 있다'
          ],
          answer: 1,
          explanation: '리스트 컴프리헨션은 즉시 모든 요소를 메모리에 생성하지만, 제너레이터 표현식은 순회할 때 한 번에 하나씩 값을 생성합니다 (lazy evaluation).'
        }
      ],
      keyPoints: [
        'yield가 있으면 제너레이터 함수',
        '제너레이터 함수 호출 시 실행이 아닌 객체 반환',
        '제너레이터는 lazy evaluation으로 메모리 효율적'
      ]
    }
  },
  {
    id: 'generator-expression-video',
    type: 'video',
    title: '제너레이터 표현식, yield from',
    duration: 10,
    content: {
      objectives: [
        '제너레이터 표현식 문법을 익힌다',
        'yield from의 용도와 장점을 이해한다',
        '중첩 이터러블을 평탄화하는 방법을 배운다'
      ],
      transcript: `
## 제너레이터 표현식

리스트 컴프리헨션처럼 간단하게 제너레이터를 만들 수 있습니다.

### 문법 비교

\`\`\`python
# 리스트 컴프리헨션 - 대괄호 []
squares_list = [x**2 for x in range(10)]

# 제너레이터 표현식 - 소괄호 ()
squares_gen = (x**2 for x in range(10))
\`\`\`

### 조건부 필터링

\`\`\`python
# 짝수의 제곱만
even_squares = (x**2 for x in range(10) if x % 2 == 0)
list(even_squares)  # [0, 4, 16, 36, 64]
\`\`\`

## yield from

**yield from**은 다른 이터러블의 모든 요소를 yield합니다.

### yield from 없이

\`\`\`python
def flatten(nested):
    for sublist in nested:
        for item in sublist:
            yield item
\`\`\`

### yield from 사용

\`\`\`python
def flatten(nested):
    for sublist in nested:
        yield from sublist  # sublist의 모든 요소를 yield
\`\`\`

### 실용 예제: 트리 순회

\`\`\`python
def traverse(tree):
    if isinstance(tree, list):
        for item in tree:
            yield from traverse(item)  # 재귀적 yield
    else:
        yield tree

tree = [1, [2, [3, 4], 5], 6]
list(traverse(tree))  # [1, 2, 3, 4, 5, 6]
\`\`\`

### yield from의 장점

| 특징 | 설명 |
|------|------|
| 가독성 | 중첩 for 루프 제거 |
| 성능 | 약간의 성능 향상 |
| 위임 | 서브 제너레이터에 제어권 위임 |

### 핵심 메시지

> "yield from은 **이터러블 위임**입니다. 다른 이터러블의 모든 값을 그대로 전달합니다."
      `,
      keyPoints: [
        '제너레이터 표현식: (x for x in iterable)',
        'yield from: 이터러블의 모든 요소를 yield',
        '중첩 구조 평탄화에 유용',
        '재귀 제너레이터에서 특히 강력'
      ]
    }
  },
  {
    id: 'large-file-code',
    type: 'code',
    title: '대용량 파일 처리 (line by line)',
    duration: 15,
    content: {
      objectives: [
        '제너레이터로 대용량 파일을 효율적으로 처리한다',
        '메모리를 절약하면서 파일을 순회한다',
        '파이프라인 패턴을 구현한다'
      ],
      instructions: `
GB 단위의 로그 파일도 제너레이터로 효율적으로 처리할 수 있습니다.

## 시나리오
- 대용량 로그 파일에서 ERROR 레벨 로그만 추출
- 각 라인에서 타임스탬프, 레벨, 메시지 파싱
- 메모리 사용량 최소화
      `,
      starterCode: `
from typing import Iterator, NamedTuple
from datetime import datetime

class LogEntry(NamedTuple):
    timestamp: datetime
    level: str
    message: str


def read_lines(filepath: str) -> Iterator[str]:
    """파일을 라인 단위로 읽는 제너레이터

    💡 파일 객체 자체가 이터레이터이므로 yield from 활용
    """
    # TODO: 구현하세요
    pass


def parse_log(lines: Iterator[str]) -> Iterator[LogEntry]:
    """로그 라인을 파싱하는 제너레이터

    로그 포맷: "2024-01-15 10:30:00 [ERROR] Something went wrong"
    """
    # TODO: 구현하세요
    pass


def filter_by_level(entries: Iterator[LogEntry], level: str) -> Iterator[LogEntry]:
    """특정 레벨의 로그만 필터링"""
    # TODO: 구현하세요
    pass


# 테스트용 샘플 파일 생성
sample_log = """2024-01-15 10:30:00 [INFO] Application started
2024-01-15 10:30:01 [DEBUG] Loading configuration
2024-01-15 10:30:02 [ERROR] Database connection failed
2024-01-15 10:30:03 [INFO] Retrying connection
2024-01-15 10:30:04 [ERROR] Retry failed
2024-01-15 10:30:05 [INFO] Application shutdown"""

# 샘플 파일 저장
with open('/tmp/sample.log', 'w') as f:
    f.write(sample_log)

# 파이프라인 실행
lines = read_lines('/tmp/sample.log')
entries = parse_log(lines)
errors = filter_by_level(entries, 'ERROR')

print("ERROR 로그:")
for entry in errors:
    print(f"  {entry.timestamp} - {entry.message}")
      `,
      solutionCode: `
from typing import Iterator, NamedTuple
from datetime import datetime
import re

class LogEntry(NamedTuple):
    """로그 엔트리를 나타내는 불변 데이터 구조

    💡 NamedTuple 사용 이유:
    - 불변(immutable)
    - 메모리 효율적 (dict보다 작음)
    - 타입 힌트 지원
    """
    timestamp: datetime
    level: str
    message: str


def read_lines(filepath: str) -> Iterator[str]:
    """파일을 라인 단위로 읽는 제너레이터

    🎯 역할: 파일을 열고 라인 단위로 yield

    💡 핵심 포인트:
    - with 문으로 파일 자동 닫기
    - yield from으로 파일 객체(이터레이터) 위임
    - strip()으로 줄바꿈 제거

    Args:
        filepath: 읽을 파일 경로

    Yields:
        str: 각 라인 (줄바꿈 제거됨)
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            yield line.strip()


def parse_log(lines: Iterator[str]) -> Iterator[LogEntry]:
    """로그 라인을 파싱하는 제너레이터

    🎯 역할: 문자열 라인을 LogEntry 객체로 변환

    💡 로그 포맷: "2024-01-15 10:30:00 [ERROR] Something went wrong"

    Args:
        lines: 라인 이터레이터

    Yields:
        LogEntry: 파싱된 로그 엔트리
    """
    # 정규표현식 패턴
    pattern = r'^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[(\w+)\] (.+)$'

    for line in lines:
        if not line:  # 빈 라인 스킵
            continue

        match = re.match(pattern, line)
        if match:
            timestamp_str, level, message = match.groups()
            timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
            yield LogEntry(timestamp, level, message)


def filter_by_level(entries: Iterator[LogEntry], level: str) -> Iterator[LogEntry]:
    """특정 레벨의 로그만 필터링

    🎯 역할: 지정된 레벨의 로그만 통과시킴

    Args:
        entries: LogEntry 이터레이터
        level: 필터링할 레벨 (INFO, DEBUG, ERROR 등)

    Yields:
        LogEntry: 해당 레벨의 로그 엔트리
    """
    for entry in entries:
        if entry.level == level:
            yield entry


# 추가: 여러 필터를 연결하는 파이프라인 함수
def process_logs(filepath: str, level: str = None) -> Iterator[LogEntry]:
    """로그 처리 파이프라인

    💡 제너레이터 체이닝으로 메모리 효율적 처리
    """
    pipeline = read_lines(filepath)
    pipeline = parse_log(pipeline)
    if level:
        pipeline = filter_by_level(pipeline, level)
    return pipeline


# 테스트용 샘플 파일 생성
sample_log = """2024-01-15 10:30:00 [INFO] Application started
2024-01-15 10:30:01 [DEBUG] Loading configuration
2024-01-15 10:30:02 [ERROR] Database connection failed
2024-01-15 10:30:03 [INFO] Retrying connection
2024-01-15 10:30:04 [ERROR] Retry failed
2024-01-15 10:30:05 [INFO] Application shutdown"""

# 샘플 파일 저장
with open('/tmp/sample.log', 'w') as f:
    f.write(sample_log)

# 파이프라인 실행 방법 1: 수동 체이닝
print("ERROR 로그 (수동 체이닝):")
lines = read_lines('/tmp/sample.log')
entries = parse_log(lines)
errors = filter_by_level(entries, 'ERROR')

for entry in errors:
    print(f"  {entry.timestamp} - {entry.message}")

# 파이프라인 실행 방법 2: 래퍼 함수
print("\\nINFO 로그 (래퍼 함수):")
for entry in process_logs('/tmp/sample.log', 'INFO'):
    print(f"  {entry.timestamp} - {entry.message}")

# 모든 로그 처리
print("\\n전체 로그:")
for entry in process_logs('/tmp/sample.log'):
    print(f"  [{entry.level}] {entry.message}")
      `,
      keyPoints: [
        '파일 객체 자체가 이터레이터 (for line in file)',
        '제너레이터 체이닝으로 파이프라인 구성',
        'GB 파일도 한 번에 한 줄씩만 메모리에 로드',
        'NamedTuple로 구조화된 데이터 반환'
      ]
    }
  },
  {
    id: 'advanced-generator-quiz',
    type: 'quiz',
    title: '고급 제너레이터 퀴즈',
    duration: 5,
    content: {
      objectives: [
        'yield from과 제너레이터 표현식을 이해했는지 확인한다'
      ],
      questions: [
        {
          question: 'yield from의 주요 용도는?',
          options: [
            '제너레이터를 리스트로 변환',
            '다른 이터러블의 모든 요소를 yield',
            '제너레이터를 복제',
            '제너레이터의 메모리를 해제'
          ],
          answer: 1,
          explanation: 'yield from은 다른 이터러블(리스트, 다른 제너레이터 등)의 모든 요소를 하나씩 yield합니다. 중첩 for 루프를 간결하게 표현할 수 있습니다.'
        },
        {
          question: '다음 중 제너레이터 표현식은?',
          options: [
            '[x*2 for x in range(5)]',
            '{x*2 for x in range(5)}',
            '(x*2 for x in range(5))',
            '<x*2 for x in range(5)>'
          ],
          answer: 2,
          explanation: '소괄호 ()를 사용하면 제너레이터 표현식입니다. []는 리스트 컴프리헨션, {}는 세트 컴프리헨션입니다.'
        },
        {
          question: '대용량 파일을 처리할 때 제너레이터의 장점이 아닌 것은?',
          options: [
            '메모리 사용량 최소화',
            '처리 시작까지의 지연 시간 감소',
            '파일 전체를 메모리에 로드하지 않음',
            '처리 속도가 항상 리스트보다 빠름'
          ],
          answer: 3,
          explanation: '제너레이터가 항상 더 빠른 것은 아닙니다. 메모리 효율성이 주요 장점이며, 처리 속도는 상황에 따라 다릅니다.'
        }
      ],
      keyPoints: [
        'yield from: 이터러블 위임',
        '제너레이터 표현식: (x for x)',
        '메모리 효율이 제너레이터의 핵심 장점'
      ]
    }
  },
  {
    id: 'infinite-stream-challenge',
    type: 'code',
    title: '🏆 Daily Challenge: 무한 데이터 스트림 제너레이터',
    duration: 30,
    content: {
      objectives: [
        '무한 제너레이터를 구현한다',
        '청크 단위 읽기를 구현한다',
        '제너레이터 파이프라인을 구성한다'
      ],
      instructions: `
## 🏆 Daily Challenge

세 가지 유틸리티 제너레이터를 구현하세요.

### 과제 1: infinite_counter(start, step)
- start부터 시작하여 step씩 증가하는 무한 카운터
- itertools.count()와 동일한 동작

### 과제 2: chunked_reader(iterable, chunk_size)
- 이터러블을 chunk_size 크기의 청크로 분할
- 마지막 청크는 더 작을 수 있음

### 과제 3: pipeline(*generators)
- 여러 제너레이터를 연결하는 파이프라인
- 입력 → gen1 → gen2 → ... → 출력
      `,
      starterCode: `
from typing import Iterator, TypeVar, Iterable, Callable

T = TypeVar('T')

def infinite_counter(start: int = 0, step: int = 1) -> Iterator[int]:
    """무한 카운터 제너레이터

    Args:
        start: 시작 값
        step: 증가량

    Yields:
        int: start, start+step, start+2*step, ...
    """
    # TODO: 구현하세요
    pass


def chunked_reader(iterable: Iterable[T], chunk_size: int) -> Iterator[list[T]]:
    """이터러블을 청크로 분할하는 제너레이터

    Args:
        iterable: 분할할 이터러블
        chunk_size: 청크 크기

    Yields:
        list: chunk_size 크기의 리스트 (마지막은 더 작을 수 있음)

    Example:
        list(chunked_reader([1,2,3,4,5], 2))  # [[1,2], [3,4], [5]]
    """
    # TODO: 구현하세요
    pass


# 테스트
print("=== infinite_counter ===")
counter = infinite_counter(10, 5)
for _ in range(5):
    print(next(counter), end=" ")  # 10 15 20 25 30
print()

print("\\n=== chunked_reader ===")
data = list(range(1, 11))  # [1, 2, ..., 10]
for chunk in chunked_reader(data, 3):
    print(chunk)  # [1,2,3], [4,5,6], [7,8,9], [10]
      `,
      solutionCode: `
from typing import Iterator, TypeVar, Iterable, Callable

T = TypeVar('T')

def infinite_counter(start: int = 0, step: int = 1) -> Iterator[int]:
    """무한 카운터 제너레이터

    🎯 역할: itertools.count()와 동일한 무한 시퀀스 생성

    💡 핵심 포인트:
    - while True로 무한 루프
    - yield로 현재 값 반환
    - 증가 후 다음 yield까지 대기

    Args:
        start: 시작 값 (기본 0)
        step: 증가량 (기본 1)

    Yields:
        int: start, start+step, start+2*step, ...
    """
    current = start
    while True:
        yield current
        current += step


def chunked_reader(iterable: Iterable[T], chunk_size: int) -> Iterator[list[T]]:
    """이터러블을 청크로 분할하는 제너레이터

    🎯 역할: 대용량 데이터를 배치 처리할 때 유용

    💡 핵심 포인트:
    - 이터레이터로 변환하여 상태 유지
    - chunk_size만큼 모아서 yield
    - 마지막 불완전한 청크도 yield

    Args:
        iterable: 분할할 이터러블
        chunk_size: 청크 크기

    Yields:
        list: chunk_size 크기의 리스트
    """
    iterator = iter(iterable)
    while True:
        chunk = []
        try:
            for _ in range(chunk_size):
                chunk.append(next(iterator))
        except StopIteration:
            if chunk:  # 남은 요소가 있으면 yield
                yield chunk
            return  # 제너레이터 종료
        yield chunk


# 보너스: itertools.islice를 사용한 더 간결한 버전
from itertools import islice

def chunked_reader_v2(iterable: Iterable[T], chunk_size: int) -> Iterator[list[T]]:
    """itertools.islice를 사용한 버전"""
    iterator = iter(iterable)
    while True:
        chunk = list(islice(iterator, chunk_size))
        if not chunk:
            return
        yield chunk


# 보너스: 파이프라인 연결 함수
def compose(*functions):
    """여러 함수를 합성하는 함수

    compose(f, g, h)(x) == h(g(f(x)))
    """
    def pipeline(data):
        result = data
        for func in functions:
            result = func(result)
        return result
    return pipeline


# 테스트
print("=== infinite_counter ===")
counter = infinite_counter(10, 5)
for _ in range(5):
    print(next(counter), end=" ")  # 10 15 20 25 30
print()

print("\\n=== chunked_reader ===")
data = list(range(1, 11))  # [1, 2, ..., 10]
for chunk in chunked_reader(data, 3):
    print(chunk)  # [1,2,3], [4,5,6], [7,8,9], [10]

print("\\n=== 실용 예제: 배치 처리 ===")
# 대량 데이터를 청크로 나눠 처리
def process_batch(items):
    print(f"  처리 중: {items}")
    return sum(items)

total = 0
for batch in chunked_reader(range(1, 101), 25):
    total += process_batch(batch)
print(f"총합: {total}")  # 5050

print("\\n=== 파이프라인 조합 ===")
# 무한 카운터 → 짝수 필터 → 제곱 → 처음 5개
counter = infinite_counter(1)
evens = (x for x in counter if x % 2 == 0)
squares = (x**2 for x in evens)

result = []
for i, val in enumerate(squares):
    if i >= 5:
        break
    result.append(val)
print(f"처음 5개 짝수의 제곱: {result}")  # [4, 16, 36, 64, 100]
      `,
      keyPoints: [
        'infinite_counter: while True + yield 패턴',
        'chunked_reader: 배치 처리에 필수적인 패턴',
        'itertools.islice로 더 간결하게 구현 가능',
        '제너레이터 체이닝으로 복잡한 파이프라인 구성'
      ]
    }
  }
]
