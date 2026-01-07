// Day 2: 데코레이터 패턴
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'decorator-intro-video',
    type: 'video',
    title: '데코레이터란? (First-class function, Closure)',
    duration: 15,
    content: {
      objectives: [
        'First-class function의 개념을 이해한다',
        'Closure의 동작 원리를 파악한다',
        '데코레이터의 기본 구조를 이해한다'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=FsAPt_9Bf3U',
      transcript: `
## 데코레이터의 기반: First-class Function

Python에서 함수는 **일급 시민(First-class Citizen)**입니다.

### 일급 시민의 조건

\`\`\`python
# 1. 변수에 할당 가능
def greet(name):
    return f"Hello, {name}!"

say_hello = greet  # 함수를 변수에 할당
print(say_hello("Alice"))  # "Hello, Alice!"

# 2. 함수의 인자로 전달 가능
def apply(func, value):
    return func(value)

print(apply(greet, "Bob"))  # "Hello, Bob!"

# 3. 함수의 반환값으로 사용 가능
def create_greeter(greeting):
    def greeter(name):
        return f"{greeting}, {name}!"
    return greeter  # 함수를 반환

hi = create_greeter("Hi")
print(hi("Charlie"))  # "Hi, Charlie!"
\`\`\`

### Closure (클로저)

**Closure**는 내부 함수가 외부 함수의 변수를 기억하는 것입니다.

\`\`\`python
def outer(x):
    def inner(y):
        return x + y  # inner는 x를 "기억"
    return inner

add_5 = outer(5)
print(add_5(3))  # 8 (x=5가 기억됨)
print(add_5(10)) # 15
\`\`\`

\`\`\`
┌──────────────────────────────────────────────────────┐
│  Closure의 구조                                       │
│                                                      │
│  outer(5) 호출 시:                                   │
│  ┌────────────────────────┐                          │
│  │ outer의 스코프         │                          │
│  │   x = 5               │                          │
│  │   ┌────────────────┐  │                          │
│  │   │ inner 함수     │  │ ← inner는 x를 참조       │
│  │   │ return x + y   │  │                          │
│  │   └────────────────┘  │                          │
│  └────────────────────────┘                          │
│                                                      │
│  add_5 = inner (x=5를 기억하는 클로저)               │
└──────────────────────────────────────────────────────┘
\`\`\`

### 데코레이터의 본질

데코레이터는 **함수를 받아서 새로운 함수를 반환**하는 함수입니다.

\`\`\`python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("함수 실행 전")
        result = func(*args, **kwargs)
        print("함수 실행 후")
        return result
    return wrapper

@my_decorator  # greet = my_decorator(greet)
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
# 출력:
# 함수 실행 전
# Hello, Alice!
# 함수 실행 후
\`\`\`

### 핵심 메시지

> "데코레이터 = 클로저 + 함수 래핑. 원본 함수를 수정하지 않고 기능을 추가합니다."
      `,
      keyPoints: [
        'First-class function: 함수를 변수에 할당, 인자로 전달, 반환값으로 사용 가능',
        'Closure: 내부 함수가 외부 함수의 변수를 기억',
        '데코레이터: 함수를 받아 새 함수를 반환',
        '@decorator 문법은 함수 = decorator(함수)의 축약형'
      ]
    }
  },
  {
    id: 'pep318-reading',
    type: 'reading',
    title: 'PEP 318: Decorators for Functions and Methods',
    duration: 10,
    content: {
      objectives: [
        'PEP 318의 핵심 내용을 이해한다',
        '데코레이터 문법의 역사를 파악한다',
        '데코레이터 설계 원칙을 이해한다'
      ],
      markdown: `
# PEP 318: Decorators for Functions and Methods

## 배경

Python 2.4 (2004년)에서 도입된 데코레이터 문법의 공식 제안서입니다.

## 문제점 (Before)

\`\`\`python
# Python 2.3 이전: staticmethod, classmethod 적용이 불편
class MyClass:
    def my_method(cls):
        pass
    my_method = classmethod(my_method)  # 메서드 정의 후 별도로 적용

    def my_static():
        pass
    my_static = staticmethod(my_static)
\`\`\`

**문제점:**
- 메서드 정의와 데코레이터 적용이 분리됨
- 긴 메서드의 경우 데코레이터를 놓치기 쉬움
- 가독성 저하

## 해결책 (After)

\`\`\`python
# Python 2.4+: @ 문법으로 간결하게
class MyClass:
    @classmethod
    def my_method(cls):
        pass

    @staticmethod
    def my_static():
        pass
\`\`\`

## @ 문법의 의미

\`\`\`python
@decorator
def func():
    pass

# 위 코드는 아래와 정확히 동일
def func():
    pass
func = decorator(func)
\`\`\`

## 여러 데코레이터 적용 순서

\`\`\`python
@dec1
@dec2
@dec3
def func():
    pass

# 실행 순서: 아래에서 위로
# func = dec1(dec2(dec3(func)))
\`\`\`

\`\`\`
┌────────────────────────────────────────────┐
│  데코레이터 적용 순서                        │
│                                            │
│  @dec1  ←── 3번째로 적용 (가장 바깥)        │
│  @dec2  ←── 2번째로 적용                   │
│  @dec3  ←── 1번째로 적용 (가장 안쪽)        │
│  def func():                               │
│      pass                                  │
│                                            │
│  = dec1(dec2(dec3(func)))                  │
└────────────────────────────────────────────┘
\`\`\`

## 핵심 설계 원칙

| 원칙 | 설명 |
|------|------|
| **명확성** | 데코레이터가 함수 정의 바로 앞에 위치 |
| **간결성** | @ 기호로 시각적 구분 |
| **확장성** | 사용자 정의 데코레이터 지원 |
| **호환성** | 기존 문법과 공존 가능 |

## 내장 데코레이터

\`\`\`python
@staticmethod    # 인스턴스 없이 호출 가능한 메서드
@classmethod     # 클래스를 첫 번째 인자로 받는 메서드
@property        # getter/setter를 프로퍼티로 변환
@functools.wraps # 데코레이터 작성 시 메타데이터 보존
\`\`\`

## 참고 링크

- [PEP 318 원문](https://peps.python.org/pep-0318/)
- [functools.wraps 문서](https://docs.python.org/3/library/functools.html#functools.wraps)
      `,
      externalLinks: [
        { title: 'PEP 318 원문', url: 'https://peps.python.org/pep-0318/' },
        { title: 'Python Decorators 공식 문서', url: 'https://docs.python.org/3/glossary.html#term-decorator' }
      ],
      keyPoints: [
        '@decorator는 func = decorator(func)의 축약형',
        '여러 데코레이터는 아래에서 위로 적용',
        'staticmethod, classmethod, property가 대표적 내장 데코레이터',
        'functools.wraps로 원본 함수 메타데이터 보존'
      ]
    }
  },
  {
    id: 'timing-decorator-code',
    type: 'code',
    title: '간단한 데코레이터 작성 (실행 시간 측정)',
    duration: 15,
    content: {
      objectives: [
        '기본 데코레이터 구조를 직접 구현한다',
        'functools.wraps의 중요성을 이해한다',
        '실행 시간 측정 데코레이터를 만든다'
      ],
      instructions: `
함수의 실행 시간을 측정하는 데코레이터를 구현합니다.

## 요구사항
1. 함수 실행 전후 시간 측정
2. 실행 시간 출력
3. functools.wraps로 메타데이터 보존
      `,
      starterCode: `
import time
from functools import wraps

def timing(func):
    """함수 실행 시간을 측정하는 데코레이터

    Args:
        func: 래핑할 함수

    Returns:
        wrapper: 시간 측정 기능이 추가된 함수
    """
    # TODO: 구현하세요
    # 1. @wraps(func)로 메타데이터 보존
    # 2. 실행 전 시간 기록
    # 3. 원본 함수 실행
    # 4. 실행 후 시간 기록
    # 5. 경과 시간 출력
    # 6. 결과 반환
    pass


@timing
def slow_function():
    """테스트용 느린 함수"""
    time.sleep(0.5)
    return "완료!"


@timing
def calculate(n):
    """1부터 n까지의 합"""
    return sum(range(1, n + 1))


# 테스트
print(slow_function())
print()
print(f"결과: {calculate(1_000_000)}")

# 메타데이터 확인
print(f"\\n함수 이름: {calculate.__name__}")
print(f"Docstring: {calculate.__doc__}")
      `,
      solutionCode: `
import time
from functools import wraps

def timing(func):
    """함수 실행 시간을 측정하는 데코레이터

    🎯 역할: 함수 실행 시간을 측정하고 출력

    💡 핵심 포인트:
    - @wraps(func)로 원본 함수의 __name__, __doc__ 보존
    - time.perf_counter()로 고정밀 시간 측정
    - *args, **kwargs로 모든 인자 패턴 지원

    Args:
        func: 래핑할 함수

    Returns:
        wrapper: 시간 측정 기능이 추가된 함수
    """
    @wraps(func)  # 원본 함수 메타데이터 보존 (중요!)
    def wrapper(*args, **kwargs):
        # 1. 시작 시간 기록
        start_time = time.perf_counter()

        # 2. 원본 함수 실행
        result = func(*args, **kwargs)

        # 3. 종료 시간 기록
        end_time = time.perf_counter()

        # 4. 경과 시간 계산 및 출력
        elapsed = end_time - start_time
        print(f"⏱️ {func.__name__}() 실행 시간: {elapsed:.4f}초")

        # 5. 결과 반환
        return result

    return wrapper


# @wraps가 없을 때의 문제점 데모
def timing_without_wraps(func):
    """@wraps 없는 버전 - 메타데이터 손실"""
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"⏱️ 실행 시간: {time.perf_counter() - start:.4f}초")
        return result
    return wrapper


@timing
def slow_function():
    """테스트용 느린 함수"""
    time.sleep(0.5)
    return "완료!"


@timing
def calculate(n):
    """1부터 n까지의 합"""
    return sum(range(1, n + 1))


@timing_without_wraps
def calculate_no_wraps(n):
    """이 docstring은 사라집니다"""
    return sum(range(1, n + 1))


# 테스트
print("=== 기본 테스트 ===")
print(slow_function())
print()
print(f"결과: {calculate(1_000_000)}")

# 메타데이터 확인
print("\\n=== 메타데이터 비교 ===")
print(f"@wraps 사용:")
print(f"  함수 이름: {calculate.__name__}")  # 'calculate'
print(f"  Docstring: {calculate.__doc__}")  # '1부터 n까지의 합'

print(f"\\n@wraps 미사용:")
print(f"  함수 이름: {calculate_no_wraps.__name__}")  # 'wrapper' (원본 이름 손실!)
print(f"  Docstring: {calculate_no_wraps.__doc__}")  # None (docstring 손실!)
      `,
      keyPoints: [
        '@wraps(func)는 __name__, __doc__, __annotations__ 등을 보존',
        'time.perf_counter()가 time.time()보다 정밀',
        '*args, **kwargs로 모든 함수 시그니처 지원',
        '데코레이터는 원본 함수를 수정하지 않음'
      ]
    }
  },
  {
    id: 'decorator-basic-quiz',
    type: 'quiz',
    title: '데코레이터 기초 퀴즈',
    duration: 5,
    content: {
      objectives: [
        '데코레이터의 기본 개념을 이해했는지 확인한다'
      ],
      questions: [
        {
          question: '@my_decorator\\ndef func(): pass 와 동일한 코드는?',
          options: [
            'func = func(my_decorator)',
            'func = my_decorator(func)',
            'my_decorator = func(my_decorator)',
            'func.decorator = my_decorator'
          ],
          answer: 1,
          explanation: '@decorator는 func = decorator(func)의 문법적 설탕(syntactic sugar)입니다.'
        },
        {
          question: 'functools.wraps를 사용하는 이유는?',
          options: [
            '데코레이터 실행 속도를 높이기 위해',
            '원본 함수의 메타데이터(__name__, __doc__ 등)를 보존하기 위해',
            '데코레이터를 여러 번 적용하기 위해',
            '인자를 받는 데코레이터를 만들기 위해'
          ],
          answer: 1,
          explanation: '@wraps(func)는 원본 함수의 __name__, __doc__, __annotations__ 등의 메타데이터를 wrapper 함수에 복사합니다.'
        },
        {
          question: '다음 중 Closure의 설명으로 올바른 것은?',
          options: [
            '함수를 종료시키는 키워드',
            '내부 함수가 외부 함수의 변수를 기억하는 것',
            '클래스의 private 메서드',
            '예외 처리 구문'
          ],
          answer: 1,
          explanation: 'Closure는 내부 함수가 외부 함수의 지역 변수에 접근할 수 있는 것을 의미합니다. 외부 함수가 종료되어도 그 변수를 기억합니다.'
        }
      ],
      keyPoints: [
        '@decorator = func = decorator(func)',
        'functools.wraps로 메타데이터 보존',
        'Closure = 내부 함수가 외부 변수를 기억'
      ]
    }
  },
  {
    id: 'decorator-args-video',
    type: 'video',
    title: '인자를 받는 데코레이터',
    duration: 15,
    content: {
      objectives: [
        '인자를 받는 데코레이터의 구조를 이해한다',
        '3중 중첩 함수 패턴을 파악한다',
        '실용적인 파라미터화된 데코레이터를 만든다'
      ],
      transcript: `
## 인자를 받는 데코레이터

기본 데코레이터보다 한 단계 더 깊은 구조가 필요합니다.

### 기본 데코레이터 vs 인자 있는 데코레이터

\`\`\`python
# 기본 데코레이터 (2중 중첩)
def simple_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

# 인자 있는 데코레이터 (3중 중첩)
def decorator_with_args(arg1, arg2):
    def decorator(func):
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        return wrapper
    return decorator
\`\`\`

### 구조 비교

\`\`\`
기본 데코레이터:
┌─────────────────────────────────────┐
│ decorator(func)                      │
│   └─ wrapper(*args, **kwargs)       │
│         └─ func 호출               │
└─────────────────────────────────────┘

인자 있는 데코레이터:
┌─────────────────────────────────────┐
│ decorator_factory(arg1, arg2)        │  ← 데코레이터 팩토리
│   └─ decorator(func)                │  ← 실제 데코레이터
│         └─ wrapper(*args, **kwargs) │  ← wrapper 함수
│               └─ func 호출         │
└─────────────────────────────────────┘
\`\`\`

### 실제 예제: repeat 데코레이터

\`\`\`python
from functools import wraps

def repeat(times: int):
    """함수를 n번 반복 실행하는 데코레이터

    @repeat(3)
    def greet():
        print("Hello!")

    greet()  # "Hello!" 3번 출력
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):  # times를 클로저로 기억
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say_hello(name):
    print(f"Hello, {name}!")

say_hello("Alice")
# Hello, Alice!
# Hello, Alice!
# Hello, Alice!
\`\`\`

### @repeat(3)의 실행 과정

\`\`\`python
# Step 1: repeat(3) 호출 → decorator 함수 반환
decorator = repeat(3)  # times=3을 기억하는 클로저

# Step 2: decorator(say_hello) 호출 → wrapper 함수 반환
say_hello = decorator(say_hello)

# 즉, @repeat(3)은 아래와 같음:
# say_hello = repeat(3)(say_hello)
\`\`\`

### 핵심 메시지

> "인자 있는 데코레이터는 **데코레이터를 반환하는 함수**입니다."
      `,
      keyPoints: [
        '인자 있는 데코레이터 = 3중 중첩 (팩토리 → 데코레이터 → wrapper)',
        '@decorator(args)는 func = decorator(args)(func)와 동일',
        '팩토리 함수의 인자는 클로저로 wrapper에서 접근',
        '실용 예: @repeat(3), @retry(max_attempts=5)'
      ]
    }
  },
  {
    id: 'retry-decorator-code',
    type: 'code',
    title: '재시도 데코레이터 구현 (@retry(max_attempts=3))',
    duration: 15,
    content: {
      objectives: [
        '인자를 받는 데코레이터를 직접 구현한다',
        '예외 처리와 재시도 로직을 결합한다',
        '지수 백오프(exponential backoff)를 구현한다'
      ],
      instructions: `
네트워크 호출 등 실패할 수 있는 함수에 재시도 로직을 추가하는 데코레이터를 구현합니다.

## 요구사항
1. max_attempts: 최대 시도 횟수
2. delay: 재시도 간격 (초)
3. backoff: 지수 백오프 배수 (기본 2)
4. 모든 시도 실패 시 마지막 예외 발생
      `,
      starterCode: `
import time
import random
from functools import wraps

def retry(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """실패 시 재시도하는 데코레이터

    Args:
        max_attempts: 최대 시도 횟수
        delay: 첫 번째 재시도까지의 대기 시간 (초)
        backoff: 지수 백오프 배수 (매 실패마다 delay *= backoff)

    Returns:
        decorator: 재시도 로직이 추가된 데코레이터
    """
    # TODO: 구현하세요
    pass


# 테스트용: 랜덤하게 실패하는 함수
@retry(max_attempts=5, delay=0.5, backoff=2.0)
def unreliable_api_call():
    """70% 확률로 실패하는 API 호출 시뮬레이션"""
    if random.random() < 0.7:  # 70% 실패
        raise ConnectionError("API 연결 실패!")
    return {"status": "success", "data": [1, 2, 3]}


# 테스트
print("=== 재시도 데코레이터 테스트 ===")
try:
    result = unreliable_api_call()
    print(f"성공: {result}")
except ConnectionError as e:
    print(f"최종 실패: {e}")
      `,
      solutionCode: `
import time
import random
from functools import wraps

def retry(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """실패 시 재시도하는 데코레이터

    🎯 역할: 실패할 수 있는 함수에 자동 재시도 로직 추가

    💡 핵심 포인트:
    - 3중 중첩: 팩토리 → 데코레이터 → wrapper
    - 지수 백오프: 재시도 간격이 점점 증가
    - 마지막 시도 후에도 실패하면 예외 발생

    Args:
        max_attempts: 최대 시도 횟수 (기본 3)
        delay: 첫 번째 재시도까지의 대기 시간 (초)
        backoff: 지수 백오프 배수 (매 실패마다 delay *= backoff)

    Returns:
        decorator: 재시도 로직이 추가된 데코레이터

    Example:
        @retry(max_attempts=5, delay=1.0, backoff=2.0)
        def fetch_data():
            ...
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            current_delay = delay
            last_exception = None

            for attempt in range(1, max_attempts + 1):
                try:
                    print(f"🔄 시도 {attempt}/{max_attempts}: {func.__name__}()")
                    result = func(*args, **kwargs)
                    print(f"✅ 성공!")
                    return result

                except Exception as e:
                    last_exception = e
                    print(f"❌ 실패 (시도 {attempt}): {e}")

                    if attempt < max_attempts:
                        print(f"⏳ {current_delay:.1f}초 후 재시도...")
                        time.sleep(current_delay)
                        current_delay *= backoff  # 지수 백오프

            # 모든 시도 실패
            print(f"🚨 {max_attempts}번 모두 실패!")
            raise last_exception

        return wrapper
    return decorator


# 보너스: 특정 예외만 재시도하는 버전
def retry_on(exceptions: tuple, max_attempts: int = 3, delay: float = 1.0):
    """특정 예외에 대해서만 재시도하는 데코레이터"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator


# 테스트용: 랜덤하게 실패하는 함수
@retry(max_attempts=5, delay=0.5, backoff=2.0)
def unreliable_api_call():
    """70% 확률로 실패하는 API 호출 시뮬레이션"""
    if random.random() < 0.7:  # 70% 실패
        raise ConnectionError("API 연결 실패!")
    return {"status": "success", "data": [1, 2, 3]}


# 테스트
print("=== 재시도 데코레이터 테스트 ===")
random.seed(42)  # 재현 가능한 결과를 위해
try:
    result = unreliable_api_call()
    print(f"\\n최종 결과: {result}")
except ConnectionError as e:
    print(f"\\n최종 실패: {e}")
      `,
      keyPoints: [
        '3중 중첩: decorator(args) → decorator(func) → wrapper(*args)',
        '지수 백오프: 재시도 간격이 2배씩 증가 (1초 → 2초 → 4초)',
        'last_exception 저장: 모든 시도 실패 시 마지막 예외 발생',
        '실무에서 네트워크 호출, DB 연결 등에 필수적'
      ]
    }
  },
  {
    id: 'class-decorator-code',
    type: 'code',
    title: '클래스 기반 데코레이터',
    duration: 10,
    content: {
      objectives: [
        '__call__ 메서드를 이용한 데코레이터를 구현한다',
        '클래스 데코레이터의 장점을 이해한다',
        '상태를 유지하는 데코레이터를 만든다'
      ],
      instructions: `
클래스를 사용하면 데코레이터가 상태를 유지할 수 있습니다.

## 요구사항
- 함수 호출 횟수를 카운트하는 데코레이터
- 인스턴스 속성으로 호출 횟수 조회 가능
      `,
      starterCode: `
from functools import update_wrapper

class CountCalls:
    """함수 호출 횟수를 카운트하는 클래스 데코레이터

    Attributes:
        func: 래핑된 원본 함수
        count: 호출 횟수
    """

    def __init__(self, func):
        # TODO: 구현하세요
        pass

    def __call__(self, *args, **kwargs):
        # TODO: 구현하세요
        pass


@CountCalls
def fibonacci(n):
    """재귀 피보나치 (비효율적)"""
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


# 테스트
print(f"fib(10) = {fibonacci(10)}")
print(f"호출 횟수: {fibonacci.count}")

print(f"\\nfib(15) = {fibonacci(15)}")
print(f"누적 호출 횟수: {fibonacci.count}")
      `,
      solutionCode: `
from functools import update_wrapper

class CountCalls:
    """함수 호출 횟수를 카운트하는 클래스 데코레이터

    🎯 역할: 함수가 몇 번 호출되었는지 추적

    💡 핵심 포인트:
    - __init__: 데코레이터 적용 시 호출 (func 저장)
    - __call__: 데코레이팅된 함수 호출 시 호출
    - update_wrapper: functools.wraps의 클래스 버전

    Attributes:
        func: 래핑된 원본 함수
        count: 호출 횟수
    """

    def __init__(self, func):
        """데코레이터 초기화

        Args:
            func: 래핑할 함수
        """
        self.func = func
        self.count = 0
        # functools.wraps의 클래스 버전
        update_wrapper(self, func)

    def __call__(self, *args, **kwargs):
        """함수 호출 시 실행

        Args:
            *args, **kwargs: 원본 함수에 전달될 인자

        Returns:
            원본 함수의 반환값
        """
        self.count += 1
        return self.func(*args, **kwargs)

    def reset(self):
        """호출 카운터 리셋"""
        self.count = 0


# 보너스: 인자를 받는 클래스 데코레이터
class CountCallsWithThreshold:
    """호출 횟수 제한이 있는 데코레이터

    💡 인자를 받으려면 __init__에서 설정을 받고,
       __call__에서 func를 받아야 함
    """

    def __init__(self, max_calls: int = 100):
        self.max_calls = max_calls
        self.count = 0
        self.func = None

    def __call__(self, func):
        self.func = func
        update_wrapper(self, func)

        def wrapper(*args, **kwargs):
            if self.count >= self.max_calls:
                raise RuntimeError(f"{func.__name__}() 최대 호출 횟수 초과!")
            self.count += 1
            return func(*args, **kwargs)

        return wrapper


@CountCalls
def fibonacci(n):
    """재귀 피보나치 (비효율적)"""
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


# 테스트
print("=== CountCalls 테스트 ===")
print(f"fib(10) = {fibonacci(10)}")
print(f"호출 횟수: {fibonacci.count}")  # 177번 (재귀 호출 포함)

fibonacci.reset()  # 카운터 리셋
print(f"\\nfib(15) = {fibonacci(15)}")
print(f"호출 횟수: {fibonacci.count}")  # 1973번


# 호출 제한 테스트
@CountCallsWithThreshold(max_calls=5)
def limited_function():
    return "OK"

print("\\n=== CountCallsWithThreshold 테스트 ===")
for i in range(7):
    try:
        print(f"호출 {i+1}: {limited_function()}")
    except RuntimeError as e:
        print(f"호출 {i+1}: ❌ {e}")
      `,
      keyPoints: [
        '__init__: func 저장, 상태 초기화',
        '__call__: 함수처럼 호출 가능하게 만듦',
        'update_wrapper: 메타데이터 복사 (wraps의 클래스 버전)',
        '클래스 데코레이터는 상태 유지에 유용'
      ]
    }
  },
  {
    id: 'decorator-advanced-quiz',
    type: 'quiz',
    title: '데코레이터 심화 퀴즈',
    duration: 5,
    content: {
      objectives: [
        '인자 있는 데코레이터와 클래스 데코레이터를 이해했는지 확인한다'
      ],
      questions: [
        {
          question: '인자를 받는 데코레이터 @decorator(arg)를 구현하려면?',
          options: [
            '2중 중첩 함수 (decorator → wrapper)',
            '3중 중첩 함수 (factory → decorator → wrapper)',
            '클래스만 사용 가능',
            '특별한 문법이 필요 (@decorator.with_args)'
          ],
          answer: 1,
          explanation: '인자를 받는 데코레이터는 "데코레이터를 반환하는 함수"입니다. 따라서 3중 중첩이 필요합니다: factory(args) → decorator(func) → wrapper(*args)'
        },
        {
          question: '클래스 기반 데코레이터에서 함수처럼 호출되게 하는 메서드는?',
          options: [
            '__init__',
            '__new__',
            '__call__',
            '__getattr__'
          ],
          answer: 2,
          explanation: '__call__ 메서드를 정의하면 인스턴스를 함수처럼 호출할 수 있습니다: instance()'
        },
        {
          question: '함수 데코레이터 대신 클래스 데코레이터를 사용하는 주요 이유는?',
          options: [
            '실행 속도가 더 빠르기 때문',
            '문법이 더 간단하기 때문',
            '상태(state)를 유지할 수 있기 때문',
            '메모리를 더 적게 사용하기 때문'
          ],
          answer: 2,
          explanation: '클래스 데코레이터는 인스턴스 속성으로 상태를 유지할 수 있습니다. 예: 호출 횟수 카운트, 캐시 저장 등.'
        }
      ],
      keyPoints: [
        '인자 있는 데코레이터 = 3중 중첩',
        '__call__로 클래스를 함수처럼 호출',
        '클래스 데코레이터는 상태 유지에 적합'
      ]
    }
  },
  {
    id: 'practical-patterns-video',
    type: 'video',
    title: '실무 패턴 (캐싱, 인증, 로깅)',
    duration: 10,
    content: {
      objectives: [
        '실무에서 자주 사용되는 데코레이터 패턴을 익힌다',
        '캐싱, 인증, 로깅 데코레이터의 구조를 이해한다',
        '언제 어떤 패턴을 사용할지 판단한다'
      ],
      transcript: `
## 실무 데코레이터 3대 패턴

### 1. 캐싱 (Memoization)

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_computation(n):
    """비용이 큰 계산 - 결과를 캐시"""
    print(f"계산 중: {n}")
    return n ** 2

# 첫 호출: 계산 실행
print(expensive_computation(10))  # "계산 중: 10" + 100

# 두 번째 호출: 캐시에서 즉시 반환
print(expensive_computation(10))  # 100 (캐시 히트!)
\`\`\`

**언제 사용?**
- 동일 입력 → 동일 출력인 순수 함수
- 계산 비용이 높은 함수
- API 응답 캐싱

### 2. 인증/권한 체크

\`\`\`python
from functools import wraps

def require_auth(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user = get_current_user()  # 현재 사용자 확인
        if not user or not user.is_authenticated:
            raise PermissionError("로그인이 필요합니다")
        return func(*args, **kwargs)
    return wrapper

def require_role(role: str):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = get_current_user()
            if role not in user.roles:
                raise PermissionError(f"{role} 권한이 필요합니다")
            return func(*args, **kwargs)
        return wrapper
    return decorator

@require_auth
@require_role("admin")
def delete_user(user_id):
    """관리자만 사용자 삭제 가능"""
    ...
\`\`\`

**언제 사용?**
- API 엔드포인트 보호
- 관리자 기능 제한
- 권한 기반 접근 제어

### 3. 로깅/모니터링

\`\`\`python
import logging
from functools import wraps

def log_calls(logger: logging.Logger):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger.info(f"호출: {func.__name__}({args}, {kwargs})")
            try:
                result = func(*args, **kwargs)
                logger.info(f"성공: {func.__name__} → {result}")
                return result
            except Exception as e:
                logger.error(f"실패: {func.__name__} - {e}")
                raise
        return wrapper
    return decorator

logger = logging.getLogger(__name__)

@log_calls(logger)
def process_order(order_id):
    ...
\`\`\`

**언제 사용?**
- 디버깅/트러블슈팅
- 성능 모니터링
- 감사 로그 (audit log)

### 패턴 선택 가이드

| 상황 | 추천 데코레이터 |
|------|----------------|
| 반복 계산 최적화 | @lru_cache |
| 접근 권한 체크 | @require_auth, @require_role |
| 실행 추적/디버깅 | @log_calls, @timing |
| 입력 검증 | @validate_args |
| 에러 복구 | @retry |
      `,
      keyPoints: [
        '캐싱: @lru_cache로 반복 계산 최적화',
        '인증: 권한 체크를 함수 정의와 분리',
        '로깅: 호출/결과/에러를 자동 기록',
        '데코레이터로 관심사 분리 (Separation of Concerns)'
      ]
    }
  },
  {
    id: 'lru-cache-code',
    type: 'code',
    title: '@lru_cache 분석 및 커스텀 캐시 구현',
    duration: 15,
    content: {
      objectives: [
        'functools.lru_cache의 동작을 이해한다',
        'LRU (Least Recently Used) 캐시를 직접 구현한다',
        '캐시 통계와 무효화를 다룬다'
      ],
      instructions: `
Python 내장 @lru_cache를 분석하고, 직접 간단한 캐시 데코레이터를 구현합니다.

## 목표
1. @lru_cache 사용법과 옵션 이해
2. 캐시 통계 확인 (cache_info)
3. 커스텀 캐시 데코레이터 구현
      `,
      starterCode: `
from functools import lru_cache, wraps
import time

# === Part 1: lru_cache 사용법 ===
@lru_cache(maxsize=128)
def fibonacci(n):
    """재귀 피보나치 - 캐싱으로 최적화"""
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


# 테스트
start = time.perf_counter()
result = fibonacci(35)
elapsed = time.perf_counter() - start
print(f"fib(35) = {result}, 시간: {elapsed:.4f}초")
print(f"캐시 통계: {fibonacci.cache_info()}")


# === Part 2: 커스텀 캐시 구현 ===
def memoize(func):
    """간단한 메모이제이션 데코레이터

    TODO: 구현하세요
    - cache 딕셔너리에 결과 저장
    - 동일 인자로 호출 시 캐시된 결과 반환
    """
    pass


@memoize
def slow_function(x, y):
    """느린 함수 시뮬레이션"""
    print(f"계산 중: ({x}, {y})")
    time.sleep(0.5)
    return x + y


# 테스트
print("\\n=== 커스텀 캐시 테스트 ===")
print(slow_function(1, 2))  # 계산 실행
print(slow_function(1, 2))  # 캐시 히트
print(slow_function(3, 4))  # 새로운 계산
      `,
      solutionCode: `
from functools import lru_cache, wraps
import time
from collections import OrderedDict

# === Part 1: lru_cache 사용법 ===
@lru_cache(maxsize=128)
def fibonacci(n):
    """재귀 피보나치 - 캐싱으로 최적화

    💡 lru_cache가 없으면 fib(35)는 수십억 번 재귀 호출
       캐싱으로 O(2^n) → O(n)으로 최적화
    """
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


# 테스트
print("=== lru_cache 테스트 ===")
start = time.perf_counter()
result = fibonacci(35)
elapsed = time.perf_counter() - start
print(f"fib(35) = {result}, 시간: {elapsed:.6f}초")
print(f"캐시 통계: {fibonacci.cache_info()}")
# CacheInfo(hits=33, misses=36, maxsize=128, currsize=36)


# === Part 2: 커스텀 캐시 구현 ===
def memoize(func):
    """간단한 메모이제이션 데코레이터

    🎯 역할: 함수 결과를 캐시하여 재사용

    💡 핵심 포인트:
    - cache 딕셔너리에 (args, frozenset(kwargs)) → result 저장
    - 동일 인자 호출 시 즉시 반환
    - 캐시 사이즈 제한 없음 (주의!)

    """
    cache = {}

    @wraps(func)
    def wrapper(*args, **kwargs):
        # kwargs를 해시 가능하게 변환
        key = (args, frozenset(kwargs.items()))

        if key in cache:
            print(f"  💾 캐시 히트: {key}")
            return cache[key]

        print(f"  🔄 새로 계산: {key}")
        result = func(*args, **kwargs)
        cache[key] = result
        return result

    # 캐시 관리 메서드 추가
    wrapper.cache_clear = lambda: cache.clear()
    wrapper.cache_size = lambda: len(cache)

    return wrapper


# === Part 3: LRU 캐시 구현 (보너스) ===
def lru_cache_custom(maxsize: int = 128):
    """커스텀 LRU 캐시 데코레이터

    💡 LRU = Least Recently Used
       가장 오래 전에 사용된 항목부터 제거
    """
    def decorator(func):
        cache = OrderedDict()  # 삽입 순서 유지
        hits = misses = 0

        @wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal hits, misses
            key = (args, frozenset(kwargs.items()))

            if key in cache:
                hits += 1
                cache.move_to_end(key)  # 최근 사용으로 이동
                return cache[key]

            misses += 1
            result = func(*args, **kwargs)
            cache[key] = result

            # maxsize 초과 시 가장 오래된 항목 제거
            if len(cache) > maxsize:
                cache.popitem(last=False)

            return result

        def cache_info():
            return f"CacheInfo(hits={hits}, misses={misses}, maxsize={maxsize}, currsize={len(cache)})"

        wrapper.cache_info = cache_info
        wrapper.cache_clear = lambda: cache.clear()

        return wrapper
    return decorator


@memoize
def slow_function(x, y):
    """느린 함수 시뮬레이션"""
    time.sleep(0.1)
    return x + y


# 테스트
print("\\n=== 커스텀 캐시 테스트 ===")
print(f"결과: {slow_function(1, 2)}")  # 새로 계산
print(f"결과: {slow_function(1, 2)}")  # 캐시 히트
print(f"결과: {slow_function(3, 4)}")  # 새로 계산
print(f"캐시 크기: {slow_function.cache_size()}")


# LRU 캐시 테스트
@lru_cache_custom(maxsize=3)
def square(n):
    return n ** 2

print("\\n=== LRU 캐시 테스트 (maxsize=3) ===")
print(square(1))
print(square(2))
print(square(3))
print(f"캐시: {square.cache_info()}")

print(square(4))  # 1이 캐시에서 제거됨
print(f"캐시: {square.cache_info()}")
      `,
      keyPoints: [
        'lru_cache(maxsize=N): 최근 N개 결과만 캐시',
        'cache_info(): hits, misses, maxsize, currsize 확인',
        'OrderedDict로 LRU 구현: move_to_end, popitem(last=False)',
        '캐시 키: (args, frozenset(kwargs.items()))'
      ]
    }
  },
  {
    id: 'practical-patterns-quiz',
    type: 'quiz',
    title: '실무 패턴 퀴즈',
    duration: 5,
    content: {
      objectives: [
        '실무 데코레이터 패턴을 이해했는지 확인한다'
      ],
      questions: [
        {
          question: '@lru_cache의 "LRU"는 무엇의 약자인가?',
          options: [
            'Last Recently Used',
            'Least Recently Used',
            'List Recently Updated',
            'Lazy Resource Usage'
          ],
          answer: 1,
          explanation: 'LRU = Least Recently Used. 가장 최근에 사용되지 않은(가장 오래된) 항목을 먼저 제거하는 캐시 전략입니다.'
        },
        {
          question: '@lru_cache를 사용하면 안 되는 함수는?',
          options: [
            '피보나치 계산 함수',
            '현재 시간을 반환하는 함수',
            '입력 문자열의 길이를 반환하는 함수',
            '두 숫자의 합을 반환하는 함수'
          ],
          answer: 1,
          explanation: '현재 시간을 반환하는 함수는 동일 입력에 대해 다른 결과를 반환하므로 캐싱하면 안 됩니다. 캐싱은 순수 함수에만 적용해야 합니다.'
        },
        {
          question: '인증 데코레이터가 함수 위에 적용되면 어떤 이점이 있나?',
          options: [
            '실행 속도가 빨라진다',
            '함수 로직과 인증 로직이 분리된다 (관심사 분리)',
            '메모리 사용량이 줄어든다',
            '타입 안정성이 보장된다'
          ],
          answer: 1,
          explanation: '데코레이터를 사용하면 핵심 비즈니스 로직과 인증/권한 체크 로직을 분리할 수 있습니다. 이를 "관심사 분리(Separation of Concerns)"라고 합니다.'
        }
      ],
      keyPoints: [
        'LRU = Least Recently Used (가장 오래된 것 제거)',
        '@lru_cache는 순수 함수에만 적용',
        '데코레이터로 관심사 분리 (인증, 로깅 등)'
      ]
    }
  },
  {
    id: 'logging-decorator-challenge',
    type: 'code',
    title: '🏆 Daily Challenge: 범용 로깅 데코레이터',
    duration: 30,
    content: {
      objectives: [
        '인자를 받는 실용적인 데코레이터를 구현한다',
        '로깅 레벨, 인자 포함 여부 등을 설정 가능하게 만든다',
        '실무에서 바로 사용할 수 있는 품질로 완성한다'
      ],
      instructions: `
## 🏆 Daily Challenge

범용 로깅 데코레이터를 구현하세요.

### 요구사항

\`\`\`python
@log(level="INFO", include_args=True, include_result=True)
def my_function(x, y):
    return x + y
\`\`\`

### 기능
1. **level**: 로깅 레벨 (DEBUG, INFO, WARNING, ERROR)
2. **include_args**: True면 함수 인자 로깅
3. **include_result**: True면 반환값 로깅
4. **예외 발생 시**: ERROR 레벨로 예외 정보 로깅

### 출력 예시
\`\`\`
[INFO] my_function 호출 - args=(1, 2), kwargs={}
[INFO] my_function 완료 - result=3, elapsed=0.0001초
\`\`\`
      `,
      starterCode: `
import time
import logging
from functools import wraps
from typing import Callable, Any

# 로거 설정
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%H:%M:%S'
)

def log(
    level: str = "INFO",
    include_args: bool = True,
    include_result: bool = True
) -> Callable:
    """범용 로깅 데코레이터

    Args:
        level: 로깅 레벨 (DEBUG, INFO, WARNING, ERROR)
        include_args: 함수 인자 로깅 여부
        include_result: 반환값 로깅 여부

    Returns:
        데코레이터 함수
    """
    # TODO: 구현하세요
    pass


# 테스트
@log(level="INFO", include_args=True, include_result=True)
def add(a: int, b: int) -> int:
    """두 수를 더하는 함수"""
    return a + b


@log(level="DEBUG", include_args=False)
def slow_operation():
    """느린 작업 시뮬레이션"""
    time.sleep(0.5)
    return "완료"


@log(level="ERROR", include_args=True, include_result=True)
def risky_operation(x: int):
    """에러가 발생할 수 있는 함수"""
    if x < 0:
        raise ValueError("음수는 허용되지 않습니다")
    return x ** 2


# 테스트 실행
print("=== 정상 실행 ===")
add(10, 20)
slow_operation()

print("\\n=== 예외 발생 ===")
try:
    risky_operation(-5)
except ValueError:
    pass
      `,
      solutionCode: `
import time
import logging
from functools import wraps
from typing import Callable, Any

# 로거 설정
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%H:%M:%S'
)

def log(
    level: str = "INFO",
    include_args: bool = True,
    include_result: bool = True
) -> Callable:
    """범용 로깅 데코레이터

    🎯 역할: 함수 호출, 결과, 에러를 자동으로 로깅

    💡 핵심 포인트:
    - 3중 중첩: log(options) → decorator(func) → wrapper(*args)
    - getattr(logging, level)로 동적 로깅 레벨 선택
    - 예외 발생 시 ERROR 레벨로 자동 로깅

    Args:
        level: 로깅 레벨 (DEBUG, INFO, WARNING, ERROR)
        include_args: 함수 인자 로깅 여부
        include_result: 반환값 로깅 여부

    Returns:
        데코레이터 함수

    Example:
        @log(level="INFO", include_args=True)
        def my_function(x, y):
            return x + y
    """
    # 로깅 레벨 검증
    level = level.upper()
    if level not in ("DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"):
        raise ValueError(f"Invalid log level: {level}")

    def decorator(func: Callable) -> Callable:
        # 로거 가져오기 (모듈별 로거 사용)
        logger = logging.getLogger(func.__module__)
        log_func = getattr(logger, level.lower())

        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            func_name = func.__name__

            # 1. 호출 시작 로깅
            if include_args:
                log_func(f"{func_name} 호출 - args={args}, kwargs={kwargs}")
            else:
                log_func(f"{func_name} 호출")

            # 2. 함수 실행 및 시간 측정
            start_time = time.perf_counter()
            try:
                result = func(*args, **kwargs)
                elapsed = time.perf_counter() - start_time

                # 3. 성공 로깅
                if include_result:
                    log_func(f"{func_name} 완료 - result={result}, elapsed={elapsed:.4f}초")
                else:
                    log_func(f"{func_name} 완료 - elapsed={elapsed:.4f}초")

                return result

            except Exception as e:
                elapsed = time.perf_counter() - start_time
                # 예외는 항상 ERROR로 로깅
                logger.error(
                    f"{func_name} 실패 - {type(e).__name__}: {e}, "
                    f"elapsed={elapsed:.4f}초"
                )
                raise  # 예외 재발생

        return wrapper
    return decorator


# 보너스: 데코레이터 팩토리 없이 사용 가능한 버전
def smart_log(_func: Callable = None, *, level: str = "INFO", include_args: bool = True):
    """인자 있을 때/없을 때 모두 동작하는 데코레이터

    @smart_log           # 기본 옵션
    @smart_log()         # 기본 옵션 (동일)
    @smart_log(level="DEBUG")  # 커스텀 옵션
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger = logging.getLogger(func.__module__)
            log_func = getattr(logger, level.lower())
            if include_args:
                log_func(f"{func.__name__} 호출 - {args}, {kwargs}")
            return func(*args, **kwargs)
        return wrapper

    if _func is not None:
        # @smart_log 형태로 사용된 경우
        return decorator(_func)
    # @smart_log() 또는 @smart_log(args) 형태로 사용된 경우
    return decorator


# 테스트
@log(level="INFO", include_args=True, include_result=True)
def add(a: int, b: int) -> int:
    """두 수를 더하는 함수"""
    return a + b


@log(level="DEBUG", include_args=False)
def slow_operation():
    """느린 작업 시뮬레이션"""
    time.sleep(0.5)
    return "완료"


@log(level="WARNING", include_args=True, include_result=True)
def risky_operation(x: int):
    """에러가 발생할 수 있는 함수"""
    if x < 0:
        raise ValueError("음수는 허용되지 않습니다")
    return x ** 2


# 테스트 실행
print("=== 정상 실행 ===")
add(10, 20)
print()
slow_operation()

print("\\n=== 예외 발생 ===")
try:
    risky_operation(-5)
except ValueError:
    print("예외가 발생했지만 로깅됨")

print("\\n=== 정상 실행 (risky) ===")
risky_operation(5)
      `,
      keyPoints: [
        'getattr(logger, level.lower())로 동적 로깅 레벨',
        '예외 발생 시 항상 ERROR로 로깅 후 재발생',
        'time.perf_counter()로 정밀한 실행 시간 측정',
        '실무에서 디버깅과 모니터링에 필수적인 패턴'
      ]
    }
  }
]
