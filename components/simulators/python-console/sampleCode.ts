// Python Console 샘플 코드

import { SampleCode } from './types'

export const sampleCodes: SampleCode[] = [
  // Decorator
  {
    id: 'deco-1',
    title: '기본 데코레이터',
    description: '함수 실행 전후에 로그를 출력하는 데코레이터',
    category: 'decorator',
    difficulty: 'beginner',
    code: `def logger(func):
    """함수 실행을 로깅하는 데코레이터"""
    def wrapper(*args, **kwargs):
        print(f"[LOG] {func.__name__} 함수 시작")
        result = func(*args, **kwargs)
        print(f"[LOG] {func.__name__} 함수 종료, 결과: {result}")
        return result
    return wrapper

@logger
def add(a, b):
    return a + b

@logger
def greet(name):
    return f"안녕하세요, {name}님!"

# 테스트
print("=== 데코레이터 테스트 ===")
result1 = add(3, 5)
result2 = greet("철수")
print(f"\\n최종 결과: {result1}, {result2}")`,
  },
  {
    id: 'deco-2',
    title: '인자가 있는 데코레이터',
    description: '반복 횟수를 지정할 수 있는 데코레이터',
    category: 'decorator',
    difficulty: 'intermediate',
    code: `def repeat(times):
    """함수를 n번 반복 실행하는 데코레이터"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            results = []
            for i in range(times):
                print(f"[{i+1}/{times}] 실행 중...")
                result = func(*args, **kwargs)
                results.append(result)
            return results
        return wrapper
    return decorator

@repeat(times=3)
def say_hello(name):
    return f"Hello, {name}!"

# 테스트
print("=== 반복 데코레이터 테스트 ===")
results = say_hello("Python")
print(f"\\n모든 결과: {results}")`,
  },
  {
    id: 'deco-3',
    title: '실행 시간 측정 데코레이터',
    description: '함수 실행 시간을 측정하는 실용적인 데코레이터',
    category: 'decorator',
    difficulty: 'intermediate',
    code: `import time

def timer(func):
    """함수 실행 시간을 측정하는 데코레이터"""
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"[TIMER] {func.__name__}: {end - start:.4f}초")
        return result
    return wrapper

@timer
def slow_function():
    """느린 작업을 시뮬레이션"""
    total = 0
    for i in range(1000000):
        total += i
    return total

@timer
def fast_function():
    """빠른 작업"""
    return sum(range(1000000))

# 테스트
print("=== 실행 시간 비교 ===")
result1 = slow_function()
result2 = fast_function()
print(f"\\n결과 동일: {result1 == result2}")`,
  },
  {
    id: 'deco-4',
    title: '메모이제이션 데코레이터',
    description: '함수 결과를 캐싱하는 메모이제이션 패턴',
    category: 'decorator',
    difficulty: 'advanced',
    code: `def memoize(func):
    """결과를 캐싱하는 메모이제이션 데코레이터"""
    cache = {}

    def wrapper(*args):
        if args in cache:
            print(f"[CACHE HIT] {func.__name__}{args}")
            return cache[args]
        print(f"[CACHE MISS] {func.__name__}{args} - 계산 중...")
        result = func(*args)
        cache[args] = result
        return result

    wrapper.cache = cache  # 캐시 접근 가능하게
    return wrapper

@memoize
def fibonacci(n):
    """피보나치 수열 (재귀)"""
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 테스트
print("=== 메모이제이션 피보나치 ===")
for i in range(10):
    result = fibonacci(i)
    print(f"fib({i}) = {result}")

print(f"\\n캐시 크기: {len(fibonacci.cache)}개")`,
  },

  // Generator
  {
    id: 'gen-1',
    title: '기본 제너레이터',
    description: 'yield를 사용한 기본 제너레이터 함수',
    category: 'generator',
    difficulty: 'beginner',
    code: `def count_up_to(n):
    """1부터 n까지 숫자를 생성하는 제너레이터"""
    print(f"[GEN] 1부터 {n}까지 생성 시작")
    i = 1
    while i <= n:
        print(f"[GEN] {i} 생성")
        yield i
        i += 1
    print("[GEN] 생성 완료")

# 테스트
print("=== 제너레이터 테스트 ===\\n")
gen = count_up_to(5)

print(f"제너레이터 객체: {gen}")
print(f"타입: {type(gen)}\\n")

print("--- next() 호출 ---")
for _ in range(3):
    value = next(gen)
    print(f"받은 값: {value}\\n")

print("--- for 루프로 나머지 소비 ---")
for value in gen:
    print(f"받은 값: {value}")`,
  },
  {
    id: 'gen-2',
    title: '제너레이터 표현식',
    description: '리스트 컴프리헨션 vs 제너레이터 표현식 비교',
    category: 'generator',
    difficulty: 'beginner',
    code: `import sys

# 리스트 컴프리헨션 vs 제너레이터 표현식
numbers = range(1000)

# 리스트 컴프리헨션 - 전체를 메모리에 저장
list_comp = [x ** 2 for x in numbers]

# 제너레이터 표현식 - lazy evaluation
gen_exp = (x ** 2 for x in numbers)

print("=== 메모리 사용량 비교 ===")
print(f"리스트: {sys.getsizeof(list_comp):,} bytes")
print(f"제너레이터: {sys.getsizeof(gen_exp):,} bytes")

print("\\n=== 처음 10개 값 ===")
# 제너레이터에서 일부만 가져오기
first_10 = [next(gen_exp) for _ in range(10)]
print(f"제너레이터 첫 10개: {first_10}")

print("\\n=== 합계 계산 ===")
# sum()은 제너레이터와 효율적으로 동작
total = sum(x ** 2 for x in range(100))
print(f"0-99 제곱의 합: {total:,}")`,
  },
  {
    id: 'gen-3',
    title: '무한 제너레이터',
    description: '끝없이 값을 생성하는 무한 제너레이터',
    category: 'generator',
    difficulty: 'intermediate',
    code: `def infinite_counter(start=0, step=1):
    """무한히 숫자를 생성하는 제너레이터"""
    n = start
    while True:
        yield n
        n += step

def take(n, iterable):
    """이터러블에서 처음 n개만 가져오기"""
    result = []
    for i, item in enumerate(iterable):
        if i >= n:
            break
        result.append(item)
    return result

# 테스트
print("=== 무한 제너레이터 ===\\n")

# 짝수 무한 생성기
evens = infinite_counter(0, 2)
print(f"짝수 처음 10개: {take(10, evens)}")

# 홀수 무한 생성기
odds = infinite_counter(1, 2)
print(f"홀수 처음 10개: {take(10, odds)}")

# 피보나치 무한 생성기
def fibonacci_gen():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci_gen()
print(f"피보나치 처음 15개: {take(15, fib)}")`,
  },
  {
    id: 'gen-4',
    title: 'yield from',
    description: '서브 제너레이터 위임하기',
    category: 'generator',
    difficulty: 'advanced',
    code: `def gen_numbers(n):
    """숫자 생성"""
    for i in range(n):
        yield f"num_{i}"

def gen_letters(n):
    """문자 생성"""
    for i in range(n):
        yield chr(65 + i)  # A, B, C, ...

def combined_generator():
    """yield from으로 여러 제너레이터 연결"""
    print("[MAIN] 숫자 생성 시작")
    yield from gen_numbers(3)

    print("[MAIN] 문자 생성 시작")
    yield from gen_letters(3)

    print("[MAIN] 직접 생성")
    yield "직접1"
    yield "직접2"

# 테스트
print("=== yield from 테스트 ===\\n")
for item in combined_generator():
    print(f"  받은 값: {item}")

# 중첩 리스트 평탄화
def flatten(nested_list):
    """중첩 리스트를 평탄화하는 재귀 제너레이터"""
    for item in nested_list:
        if isinstance(item, list):
            yield from flatten(item)
        else:
            yield item

nested = [1, [2, 3], [4, [5, 6]], 7]
print(f"\\n원본: {nested}")
print(f"평탄화: {list(flatten(nested))}")`,
  },

  // Iterator
  {
    id: 'iter-1',
    title: '커스텀 이터레이터',
    description: '__iter__와 __next__를 구현한 이터레이터 클래스',
    category: 'iterator',
    difficulty: 'intermediate',
    code: `class Countdown:
    """카운트다운 이터레이터"""

    def __init__(self, start):
        self.start = start
        self.current = start

    def __iter__(self):
        """이터레이터 객체 반환"""
        self.current = self.start  # 리셋
        return self

    def __next__(self):
        """다음 값 반환"""
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

# 테스트
print("=== 카운트다운 이터레이터 ===\\n")
countdown = Countdown(5)

print("for 루프로 순회:")
for num in countdown:
    print(f"  {num}...")
print("  발사!")

print("\\n다시 순회 (재사용 가능):")
for num in countdown:
    print(f"  {num}")`,
  },
  {
    id: 'iter-2',
    title: '범위 이터레이터',
    description: 'range() 비슷한 커스텀 Range 클래스',
    category: 'iterator',
    difficulty: 'intermediate',
    code: `class MyRange:
    """range()를 흉내낸 이터레이터"""

    def __init__(self, start, stop=None, step=1):
        if stop is None:
            self.start = 0
            self.stop = start
        else:
            self.start = start
            self.stop = stop
        self.step = step

    def __iter__(self):
        current = self.start
        while (self.step > 0 and current < self.stop) or \\
              (self.step < 0 and current > self.stop):
            yield current
            current += self.step

    def __len__(self):
        return max(0, (self.stop - self.start + self.step - 1) // self.step)

    def __repr__(self):
        return f"MyRange({self.start}, {self.stop}, {self.step})"

# 테스트
print("=== 커스텀 Range ===\\n")

r1 = MyRange(5)
print(f"MyRange(5): {list(r1)}")

r2 = MyRange(2, 10, 2)
print(f"MyRange(2, 10, 2): {list(r2)}")

r3 = MyRange(10, 0, -2)
print(f"MyRange(10, 0, -2): {list(r3)}")

print(f"\\n길이: len(MyRange(1, 10, 2)) = {len(MyRange(1, 10, 2))}")`,
  },

  // Context Manager
  {
    id: 'ctx-1',
    title: '기본 컨텍스트 매니저',
    description: '__enter__와 __exit__로 with 문 지원',
    category: 'context-manager',
    difficulty: 'intermediate',
    code: `class Timer:
    """실행 시간을 측정하는 컨텍스트 매니저"""

    def __init__(self, name="Timer"):
        self.name = name
        self.start = None
        self.end = None

    def __enter__(self):
        import time
        print(f"[{self.name}] 타이머 시작")
        self.start = time.time()
        return self  # with ... as 에서 사용

    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        self.end = time.time()
        elapsed = self.end - self.start
        print(f"[{self.name}] 소요 시간: {elapsed:.4f}초")

        # 예외 처리
        if exc_type is not None:
            print(f"[{self.name}] 예외 발생: {exc_val}")

        return False  # 예외를 전파 (True면 억제)

    @property
    def elapsed(self):
        if self.end and self.start:
            return self.end - self.start
        return None

# 테스트
print("=== Timer 컨텍스트 매니저 ===\\n")

with Timer("계산") as t:
    total = sum(range(1000000))
    print(f"합계: {total:,}")

print(f"\\n저장된 시간: {t.elapsed:.4f}초")`,
  },
  {
    id: 'ctx-2',
    title: 'contextlib 데코레이터',
    description: '@contextmanager로 간단하게 컨텍스트 매니저 만들기',
    category: 'context-manager',
    difficulty: 'intermediate',
    code: `from contextlib import contextmanager

@contextmanager
def temporary_change(obj, attr, new_value):
    """속성을 임시로 변경하고 복원하는 컨텍스트 매니저"""
    old_value = getattr(obj, attr)
    print(f"[CHANGE] {attr}: {old_value} -> {new_value}")

    try:
        setattr(obj, attr, new_value)
        yield obj
    finally:
        setattr(obj, attr, old_value)
        print(f"[RESTORE] {attr}: {new_value} -> {old_value}")

class Config:
    debug = False
    log_level = "INFO"

# 테스트
print("=== contextmanager 테스트 ===\\n")
config = Config()

print(f"초기 상태: debug={config.debug}")

with temporary_change(config, 'debug', True):
    print(f"  with 내부: debug={config.debug}")
    # 디버그 모드로 작업...

print(f"복원 후: debug={config.debug}")`,
  },

  // Dataclass
  {
    id: 'data-1',
    title: '데이터클래스 기초',
    description: '@dataclass로 보일러플레이트 코드 줄이기',
    category: 'dataclass',
    difficulty: 'beginner',
    code: `from dataclasses import dataclass, field
from typing import List

@dataclass
class Point:
    """2D 좌표"""
    x: float
    y: float

    def distance_from_origin(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5

@dataclass
class Person:
    """사람 정보"""
    name: str
    age: int
    email: str = ""  # 기본값

    def __post_init__(self):
        """초기화 후 검증"""
        if self.age < 0:
            raise ValueError("나이는 0 이상이어야 합니다")

# 테스트
print("=== 데이터클래스 테스트 ===\\n")

p1 = Point(3, 4)
p2 = Point(3, 4)
print(f"p1 = {p1}")
print(f"p2 = {p2}")
print(f"p1 == p2: {p1 == p2}")  # 자동 __eq__
print(f"원점에서 거리: {p1.distance_from_origin()}")

print()
person = Person("김철수", 25, "kim@email.com")
print(f"Person: {person}")`,
  },
  {
    id: 'data-2',
    title: '데이터클래스 고급',
    description: 'frozen, order, field 옵션 활용',
    category: 'dataclass',
    difficulty: 'advanced',
    code: `from dataclasses import dataclass, field
from typing import List

@dataclass(frozen=True)  # 불변 객체
class FrozenPoint:
    x: float
    y: float

@dataclass(order=True)  # 비교 연산 지원
class Student:
    # 정렬 기준 지정
    grade: float = field(compare=True)
    name: str = field(compare=False)
    student_id: str = field(compare=False)

@dataclass
class Team:
    name: str
    members: List[str] = field(default_factory=list)  # 가변 기본값

    def add_member(self, member: str):
        self.members.append(member)

# 테스트
print("=== 데이터클래스 고급 ===\\n")

# Frozen (불변)
fp = FrozenPoint(1, 2)
print(f"FrozenPoint: {fp}")
try:
    fp.x = 10  # 변경 시도
except Exception as e:
    print(f"변경 시도 실패: {type(e).__name__}")

# Order (정렬)
print("\\n학생 성적순 정렬:")
students = [
    Student(3.5, "김철수", "S001"),
    Student(4.2, "이영희", "S002"),
    Student(3.8, "박민수", "S003"),
]
for s in sorted(students, reverse=True):
    print(f"  {s.name}: {s.grade}")

# Factory (가변 기본값)
print("\\n팀 멤버:")
team = Team("개발팀")
team.add_member("Alice")
team.add_member("Bob")
print(f"{team}")`,
  },

  // functools
  {
    id: 'func-1',
    title: 'functools.lru_cache',
    description: '내장 메모이제이션 데코레이터',
    category: 'functools',
    difficulty: 'intermediate',
    code: `from functools import lru_cache
import time

@lru_cache(maxsize=128)
def fibonacci(n):
    """LRU 캐시를 사용한 피보나치"""
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 테스트
print("=== lru_cache 피보나치 ===\\n")

start = time.time()
result = fibonacci(35)
elapsed = time.time() - start

print(f"fib(35) = {result:,}")
print(f"실행 시간: {elapsed:.4f}초")
print(f"\\n캐시 통계: {fibonacci.cache_info()}")

# 캐시 클리어
fibonacci.cache_clear()
print(f"클리어 후: {fibonacci.cache_info()}")`,
  },
  {
    id: 'func-2',
    title: 'functools.partial',
    description: '함수의 일부 인자를 고정하기',
    category: 'functools',
    difficulty: 'intermediate',
    code: `from functools import partial

def power(base, exponent):
    """거듭제곱 계산"""
    return base ** exponent

def greet(greeting, name, punctuation="!"):
    """인사말 생성"""
    return f"{greeting}, {name}{punctuation}"

# partial로 특수화된 함수 생성
square = partial(power, exponent=2)
cube = partial(power, exponent=3)

hello = partial(greet, "Hello")
formal_hello = partial(greet, "Good morning", punctuation=".")

# 테스트
print("=== functools.partial ===\\n")

print("제곱/세제곱 함수:")
for i in range(1, 6):
    print(f"  {i}^2 = {square(i)}, {i}^3 = {cube(i)}")

print("\\n인사 함수:")
print(f"  {hello('Python')}")
print(f"  {hello('World', punctuation='~')}")
print(f"  {formal_hello('Alice')}")`,
  },
  {
    id: 'func-3',
    title: 'functools.reduce',
    description: '시퀀스를 단일 값으로 줄이기',
    category: 'functools',
    difficulty: 'intermediate',
    code: `from functools import reduce

# 기본 reduce 사용
numbers = [1, 2, 3, 4, 5]

# 합계
total = reduce(lambda acc, x: acc + x, numbers)
print(f"합계: {total}")

# 곱셈 (팩토리얼)
product = reduce(lambda acc, x: acc * x, numbers)
print(f"곱: {product}")

# 최대값
maximum = reduce(lambda a, b: a if a > b else b, numbers)
print(f"최대: {maximum}")

# 실용적 예: 중첩 딕셔너리 접근
def get_nested(data, keys):
    """중첩 딕셔너리에서 값 가져오기"""
    return reduce(lambda d, key: d.get(key, {}), keys, data)

config = {
    "database": {
        "primary": {
            "host": "localhost",
            "port": 5432
        }
    }
}

print(f"\\nconfig.database.primary.host:")
print(f"  {get_nested(config, ['database', 'primary', 'host'])}")

# 파이프라인
def compose(*functions):
    """함수들을 합성"""
    return reduce(lambda f, g: lambda x: g(f(x)), functions)

add_1 = lambda x: x + 1
double = lambda x: x * 2
square = lambda x: x ** 2

pipeline = compose(add_1, double, square)
print(f"\\npipeline(3) = square(double(add_1(3)))")
print(f"  = square(double(4)) = square(8) = {pipeline(3)}")`,
  },

  // typing
  {
    id: 'type-1',
    title: '타입 힌트 기초',
    description: 'Python 타입 어노테이션 사용법',
    category: 'typing',
    difficulty: 'beginner',
    code: `from typing import List, Dict, Optional, Union, Tuple

def greet(name: str) -> str:
    """문자열을 받아 문자열을 반환"""
    return f"Hello, {name}!"

def calculate_average(numbers: List[float]) -> float:
    """숫자 리스트의 평균 계산"""
    return sum(numbers) / len(numbers)

def get_user(user_id: int) -> Optional[Dict[str, str]]:
    """사용자 조회 (없으면 None)"""
    users = {
        1: {"name": "Alice", "email": "alice@email.com"},
        2: {"name": "Bob", "email": "bob@email.com"},
    }
    return users.get(user_id)

def process_input(value: Union[int, str]) -> str:
    """int 또는 str을 받아 str 반환"""
    return str(value).upper()

def get_name_and_age() -> Tuple[str, int]:
    """이름과 나이를 튜플로 반환"""
    return ("Python", 33)

# 테스트
print("=== 타입 힌트 테스트 ===\\n")

print(greet("World"))
print(f"평균: {calculate_average([1, 2, 3, 4, 5])}")
print(f"User 1: {get_user(1)}")
print(f"User 99: {get_user(99)}")
print(f"process_input(123): {process_input(123)}")
print(f"get_name_and_age(): {get_name_and_age()}")`,
  },
  {
    id: 'type-2',
    title: 'TypedDict와 Protocol',
    description: '구조적 서브타이핑과 딕셔너리 타입',
    category: 'typing',
    difficulty: 'advanced',
    code: `from typing import TypedDict, Protocol, runtime_checkable

class UserDict(TypedDict):
    """사용자 딕셔너리 타입"""
    name: str
    age: int
    email: str

@runtime_checkable
class Drawable(Protocol):
    """그릴 수 있는 객체 프로토콜"""
    def draw(self) -> str: ...

class Circle:
    def __init__(self, radius: float):
        self.radius = radius

    def draw(self) -> str:
        return f"Circle(r={self.radius})"

class Rectangle:
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def draw(self) -> str:
        return f"Rectangle({self.width}x{self.height})"

def render(shape: Drawable) -> None:
    """Drawable 프로토콜을 따르는 객체 렌더링"""
    print(f"  Rendering: {shape.draw()}")

# 테스트
print("=== TypedDict ===")
user: UserDict = {
    "name": "Alice",
    "age": 30,
    "email": "alice@email.com"
}
print(f"User: {user}")

print("\\n=== Protocol ===")
shapes = [Circle(5), Rectangle(3, 4)]
for shape in shapes:
    print(f"Is Drawable? {isinstance(shape, Drawable)}")
    render(shape)`,
  },
]

// 카테고리 정보
export const categories = [
  { id: 'all', name: '전체', icon: '📚' },
  { id: 'decorator', name: '데코레이터', icon: '🎀' },
  { id: 'generator', name: '제너레이터', icon: '🔄' },
  { id: 'iterator', name: '이터레이터', icon: '🔁' },
  { id: 'context-manager', name: '컨텍스트 매니저', icon: '📦' },
  { id: 'dataclass', name: '데이터클래스', icon: '📋' },
  { id: 'functools', name: 'functools', icon: '🔧' },
  { id: 'typing', name: '타입 힌트', icon: '🏷️' },
]
