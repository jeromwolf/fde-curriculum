// Phase 0, Week 2: Python 기초 2 (함수, 클래스, 모듈, 파일)
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'python-functions-basics',
  title: '함수 기초',
  totalDuration: 180,
  tasks: [
    {
      id: 'function-intro',
      type: 'reading',
      title: '함수란?',
      duration: 30,
      content: {
        objectives: [
          '함수의 개념과 필요성을 이해한다',
          '함수를 정의하고 호출할 수 있다',
          'return 문을 이해한다'
        ],
        markdown: `
## 함수 (Function)

### 함수란?

\`\`\`
함수 = 재사용 가능한 코드 블록

왜 함수를 사용하는가?
├── 코드 재사용: 같은 코드 반복 작성 방지
├── 모듈화: 복잡한 문제를 작은 단위로 분리
├── 가독성: 코드 이해하기 쉬움
└── 유지보수: 한 곳만 수정하면 됨
\`\`\`

### 함수 정의와 호출

\`\`\`python
# 함수 정의
def greet():
    print("안녕하세요!")

# 함수 호출
greet()  # "안녕하세요!"
greet()  # 여러 번 호출 가능


# 매개변수가 있는 함수
def greet_person(name):
    print(f"안녕하세요, {name}님!")

greet_person("철수")  # "안녕하세요, 철수님!"
greet_person("영희")  # "안녕하세요, 영희님!"
\`\`\`

### return 문

\`\`\`python
# 값 반환
def add(a, b):
    return a + b

result = add(3, 5)
print(result)  # 8

# return 없으면 None 반환
def no_return():
    print("Hello")

result = no_return()
print(result)  # None

# 여러 값 반환 (튜플)
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers)

minimum, maximum, total = get_stats([1, 2, 3, 4, 5])
\`\`\`

### 함수 문서화 (Docstring)

\`\`\`python
def calculate_area(width, height):
    """
    직사각형의 넓이를 계산합니다.

    Args:
        width: 가로 길이
        height: 세로 길이

    Returns:
        직사각형의 넓이
    """
    return width * height

# docstring 확인
print(calculate_area.__doc__)
help(calculate_area)
\`\`\`
        `,
        externalLinks: [
          { title: 'Python 함수 정의', url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions' }
        ]
      }
    },
    {
      id: 'parameters',
      type: 'reading',
      title: '매개변수와 인자',
      duration: 45,
      content: {
        objectives: [
          '위치 인자와 키워드 인자를 구분한다',
          '기본값 매개변수를 사용할 수 있다',
          '*args, **kwargs를 이해한다'
        ],
        markdown: `
## 매개변수와 인자

### 위치 인자 vs 키워드 인자

\`\`\`python
def greet(name, greeting):
    return f"{greeting}, {name}!"

# 위치 인자: 순서대로 전달
greet("철수", "안녕")  # "안녕, 철수!"

# 키워드 인자: 이름으로 전달
greet(greeting="안녕", name="철수")  # "안녕, 철수!"

# 혼합 (위치 먼저, 키워드 나중)
greet("철수", greeting="안녕")  # OK
greet(name="철수", "안녕")      # Error!
\`\`\`

### 기본값 매개변수

\`\`\`python
def greet(name, greeting="안녕하세요"):
    return f"{greeting}, {name}!"

greet("철수")           # "안녕하세요, 철수!"
greet("철수", "반갑습니다")  # "반갑습니다, 철수!"

# 주의: 기본값은 뒤에서부터
def func(a, b=1, c=2):  # OK
    pass
def func(a=1, b, c=2):  # Error!
    pass
\`\`\`

### *args (가변 위치 인자)

\`\`\`python
def sum_all(*args):
    """여러 개의 숫자를 받아 합계 반환"""
    print(f"받은 인자: {args}")  # 튜플
    return sum(args)

sum_all(1, 2, 3)        # 6
sum_all(1, 2, 3, 4, 5)  # 15
\`\`\`

### **kwargs (가변 키워드 인자)

\`\`\`python
def print_info(**kwargs):
    """키워드 인자들을 출력"""
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="철수", age=25, city="서울")
# name: 철수
# age: 25
# city: 서울
\`\`\`

### 모든 종류의 매개변수 조합

\`\`\`python
def complex_function(a, b, *args, c=10, **kwargs):
    """
    a, b: 필수 위치 인자
    *args: 추가 위치 인자
    c: 키워드 전용 (기본값)
    **kwargs: 추가 키워드 인자
    """
    print(f"a={a}, b={b}")
    print(f"args={args}")
    print(f"c={c}")
    print(f"kwargs={kwargs}")

complex_function(1, 2, 3, 4, c=20, x=100, y=200)
# a=1, b=2
# args=(3, 4)
# c=20
# kwargs={'x': 100, 'y': 200}
\`\`\`
        `
      }
    },
    {
      id: 'scope',
      type: 'reading',
      title: '스코프 (Scope)',
      duration: 30,
      content: {
        objectives: [
          '지역 변수와 전역 변수를 구분한다',
          'global 키워드를 이해한다',
          'LEGB 규칙을 이해한다'
        ],
        markdown: `
## 스코프 (Scope)

### 지역 변수 vs 전역 변수

\`\`\`python
# 전역 변수
message = "전역"

def func():
    # 지역 변수
    message = "지역"
    print(message)  # "지역"

func()
print(message)  # "전역" (전역 변수는 변경 안됨)
\`\`\`

### global 키워드

\`\`\`python
count = 0

def increment():
    global count  # 전역 변수 사용 선언
    count += 1

increment()
print(count)  # 1
increment()
print(count)  # 2
\`\`\`

### LEGB 규칙

\`\`\`
Python이 변수를 찾는 순서:

L - Local: 함수 내부
E - Enclosing: 감싸는 함수 (중첩 함수)
G - Global: 모듈 레벨
B - Built-in: 내장 함수/변수

예시:
┌─────────────────────────────┐
│ Built-in: print, len, ...   │
│ ┌─────────────────────────┐ │
│ │ Global: x = 1           │ │
│ │ ┌─────────────────────┐ │ │
│ │ │ Enclosing: y = 2    │ │ │
│ │ │ ┌─────────────────┐ │ │ │
│ │ │ │ Local: z = 3    │ │ │ │
│ │ │ └─────────────────┘ │ │ │
│ │ └─────────────────────┘ │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
\`\`\`

### nonlocal 키워드

\`\`\`python
def outer():
    count = 0

    def inner():
        nonlocal count  # 감싸는 함수의 변수 사용
        count += 1
        return count

    return inner

counter = outer()
print(counter())  # 1
print(counter())  # 2
\`\`\`
        `
      }
    },
    {
      id: 'function-practice',
      type: 'code',
      title: '함수 실습',
      duration: 60,
      content: {
        objectives: [
          '다양한 매개변수를 활용한 함수를 작성한다',
          '실용적인 유틸리티 함수를 만든다'
        ],
        instructions: `
## 함수 실습

1. 계산기 함수들을 만드세요
2. 문자열 처리 함수를 만드세요
3. 통계 함수를 만드세요
        `,
        starterCode: `# 1. 계산기 함수
# 사칙연산을 수행하는 함수를 만드세요
def calculate(a, b, operation="add"):
    """
    두 숫자의 사칙연산을 수행합니다.
    operation: add, subtract, multiply, divide
    """
    result = 0
    # 여기에 코드를 작성하세요
    return result

# 테스트
print(calculate(10, 3))              # 13 (기본: 덧셈)
print(calculate(10, 3, "subtract"))  # 7
print(calculate(10, 3, "multiply"))  # 30
print(calculate(10, 3, "divide"))    # 3.333...


# 2. 문자열 처리 함수
def format_name(*names, separator=" ", uppercase=False):
    """
    여러 이름을 받아 하나의 문자열로 결합합니다.
    """
    result = ""
    # 여기에 코드를 작성하세요
    return result

# 테스트
print(format_name("Kim", "Chul", "Su"))  # "Kim Chul Su"
print(format_name("Kim", "Chul", separator="-"))  # "Kim-Chul"
print(format_name("Kim", "Chul", uppercase=True))  # "KIM CHUL"


# 3. 통계 함수
def get_statistics(*numbers):
    """
    여러 숫자를 받아 통계를 딕셔너리로 반환합니다.
    반환: {"count": 개수, "sum": 합계, "avg": 평균, "min": 최소, "max": 최대}
    """
    stats = {}
    # 여기에 코드를 작성하세요
    return stats

# 테스트
print(get_statistics(1, 2, 3, 4, 5))
# {"count": 5, "sum": 15, "avg": 3.0, "min": 1, "max": 5}
`,
        solutionCode: `# 1. 계산기 함수
def calculate(a, b, operation="add"):
    """
    두 숫자의 사칙연산을 수행합니다.
    operation: add, subtract, multiply, divide
    """
    if operation == "add":
        result = a + b
    elif operation == "subtract":
        result = a - b
    elif operation == "multiply":
        result = a * b
    elif operation == "divide":
        result = a / b if b != 0 else None
    else:
        result = None
    return result

# 테스트
print(calculate(10, 3))              # 13
print(calculate(10, 3, "subtract"))  # 7
print(calculate(10, 3, "multiply"))  # 30
print(calculate(10, 3, "divide"))    # 3.333...


# 2. 문자열 처리 함수
def format_name(*names, separator=" ", uppercase=False):
    """
    여러 이름을 받아 하나의 문자열로 결합합니다.
    """
    result = separator.join(names)
    if uppercase:
        result = result.upper()
    return result

# 테스트
print(format_name("Kim", "Chul", "Su"))  # "Kim Chul Su"
print(format_name("Kim", "Chul", separator="-"))  # "Kim-Chul"
print(format_name("Kim", "Chul", uppercase=True))  # "KIM CHUL"


# 3. 통계 함수
def get_statistics(*numbers):
    """
    여러 숫자를 받아 통계를 딕셔너리로 반환합니다.
    """
    if not numbers:
        return {"count": 0, "sum": 0, "avg": 0, "min": None, "max": None}

    stats = {
        "count": len(numbers),
        "sum": sum(numbers),
        "avg": sum(numbers) / len(numbers),
        "min": min(numbers),
        "max": max(numbers)
    }
    return stats

# 테스트
print(get_statistics(1, 2, 3, 4, 5))
# {"count": 5, "sum": 15, "avg": 3.0, "min": 1, "max": 5}
`
      }
    },
    {
      id: 'day1-quiz',
      type: 'quiz',
      title: 'Day 1 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'return 문이 없는 함수의 반환값은?',
            options: ['0', '""', 'None', 'Error'],
            answer: 2,
            explanation: 'return 문이 없으면 함수는 None을 반환합니다.'
          },
          {
            question: '*args의 타입은?',
            options: ['리스트', '튜플', '딕셔너리', '집합'],
            answer: 1,
            explanation: '*args는 가변 위치 인자들을 튜플로 받습니다.'
          },
          {
            question: 'def func(a=1, b): 이 코드의 문제점은?',
            options: ['문법 오류 없음', '기본값이 있는 매개변수가 앞에 있음', 'a=1이 잘못됨', 'b가 없음'],
            answer: 1,
            explanation: '기본값이 있는 매개변수는 기본값이 없는 매개변수 뒤에 와야 합니다.'
          }
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'python-functions-advanced',
  title: '함수 심화',
  totalDuration: 180,
  tasks: [
    {
      id: 'lambda',
      type: 'reading',
      title: '람다 함수',
      duration: 30,
      content: {
        objectives: [
          '람다 함수의 문법을 이해한다',
          'map, filter, sorted와 함께 활용한다'
        ],
        markdown: `
## 람다 함수 (Lambda)

### 람다란?

\`\`\`python
# 일반 함수
def add(a, b):
    return a + b

# 람다 함수 (한 줄 익명 함수)
add = lambda a, b: a + b

# 둘 다 같은 결과
add(3, 5)  # 8
\`\`\`

### 언제 사용하는가?

\`\`\`python
# 1. 간단한 일회성 함수
numbers = [1, 2, 3, 4, 5]

# sorted의 key로 사용
words = ["apple", "pie", "banana"]
sorted(words, key=lambda x: len(x))  # ['pie', 'apple', 'banana']

# 2. 고차 함수와 함께
# map: 모든 요소에 함수 적용
list(map(lambda x: x**2, numbers))  # [1, 4, 9, 16, 25]

# filter: 조건에 맞는 요소만 추출
list(filter(lambda x: x % 2 == 0, numbers))  # [2, 4]
\`\`\`

### map, filter, reduce

\`\`\`python
numbers = [1, 2, 3, 4, 5]

# map: 변환
squared = list(map(lambda x: x**2, numbers))
# [1, 4, 9, 16, 25]

# filter: 필터링
evens = list(filter(lambda x: x % 2 == 0, numbers))
# [2, 4]

# reduce: 누적 연산
from functools import reduce
total = reduce(lambda acc, x: acc + x, numbers)
# 15 (1+2+3+4+5)
\`\`\`

### 람다 vs 일반 함수

| 특성 | 람다 | 일반 함수 |
|------|------|-----------|
| 문법 | 한 줄 | 여러 줄 |
| 이름 | 익명 | 이름 있음 |
| 문서화 | 불가 | docstring 가능 |
| 용도 | 간단한 연산 | 복잡한 로직 |
        `
      }
    },
    {
      id: 'closure',
      type: 'reading',
      title: '클로저',
      duration: 30,
      content: {
        objectives: [
          '클로저의 개념을 이해한다',
          '클로저를 활용할 수 있다'
        ],
        markdown: `
## 클로저 (Closure)

### 클로저란?

\`\`\`python
def outer(x):
    """외부 함수"""
    def inner(y):
        """내부 함수 - x를 기억함"""
        return x + y  # x는 outer의 변수
    return inner  # 함수를 반환

# 클로저 생성
add_5 = outer(5)  # x=5를 기억하는 함수
add_10 = outer(10)  # x=10을 기억하는 함수

print(add_5(3))   # 8 (5 + 3)
print(add_10(3))  # 13 (10 + 3)
\`\`\`

### 클로저의 특징

\`\`\`
클로저 = 함수 + 환경(기억된 변수)

1. 내부 함수가 외부 함수의 변수를 참조
2. 외부 함수가 종료되어도 변수 유지
3. 상태를 유지하는 함수 생성 가능
\`\`\`

### 실용적인 예제

\`\`\`python
# 카운터 만들기
def make_counter(start=0):
    count = start

    def counter():
        nonlocal count
        count += 1
        return count

    return counter

counter1 = make_counter()
print(counter1())  # 1
print(counter1())  # 2

counter2 = make_counter(100)
print(counter2())  # 101


# 승수 함수 만들기
def make_multiplier(n):
    def multiplier(x):
        return x * n
    return multiplier

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15
\`\`\`
        `
      }
    },
    {
      id: 'decorator',
      type: 'reading',
      title: '데코레이터',
      duration: 45,
      content: {
        objectives: [
          '데코레이터의 개념을 이해한다',
          '간단한 데코레이터를 만들 수 있다',
          '내장 데코레이터를 활용한다'
        ],
        markdown: `
## 데코레이터 (Decorator)

### 데코레이터란?

\`\`\`python
# 데코레이터 = 함수를 감싸서 기능을 추가하는 함수

def my_decorator(func):
    def wrapper():
        print("함수 실행 전")
        func()
        print("함수 실행 후")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
# 출력:
# 함수 실행 전
# Hello!
# 함수 실행 후
\`\`\`

### 인자를 받는 데코레이터

\`\`\`python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"함수 호출: {func.__name__}")
        result = func(*args, **kwargs)
        print(f"결과: {result}")
        return result
    return wrapper

@my_decorator
def add(a, b):
    return a + b

add(3, 5)
# 함수 호출: add
# 결과: 8
\`\`\`

### 실용적인 데코레이터

\`\`\`python
import time

# 실행 시간 측정
def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} 실행 시간: {end-start:.4f}초")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "완료"


# 로깅
def log(func):
    def wrapper(*args, **kwargs):
        print(f"[LOG] {func.__name__} 호출, args={args}, kwargs={kwargs}")
        return func(*args, **kwargs)
    return wrapper

@log
def greet(name):
    return f"Hello, {name}!"
\`\`\`

### 내장 데코레이터

\`\`\`python
class MyClass:
    @staticmethod
    def static_method():
        """인스턴스 없이 호출 가능"""
        return "static"

    @classmethod
    def class_method(cls):
        """클래스를 첫 인자로 받음"""
        return f"class: {cls.__name__}"

    @property
    def value(self):
        """속성처럼 접근 가능"""
        return self._value

# functools.wraps - 원본 함수 정보 보존
from functools import wraps

def my_decorator(func):
    @wraps(func)  # 원본 함수의 __name__, __doc__ 유지
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper
\`\`\`
        `
      }
    },
    {
      id: 'advanced-practice',
      type: 'code',
      title: '함수 심화 실습',
      duration: 60,
      content: {
        objectives: [
          '람다, 클로저, 데코레이터를 활용한다'
        ],
        instructions: `
## 함수 심화 실습

1. map, filter를 활용한 데이터 처리
2. 클로저로 설정 가능한 함수 만들기
3. 데코레이터로 유효성 검사하기
        `,
        starterCode: `# 1. 데이터 처리
users = [
    {"name": "김철수", "age": 25, "score": 85},
    {"name": "이영희", "age": 17, "score": 92},
    {"name": "박민수", "age": 30, "score": 78},
    {"name": "정수진", "age": 22, "score": 95},
]

# 1-1. 성인(18세 이상)만 필터링
adults = []  # filter 사용

# 1-2. 이름만 추출
names = []  # map 사용

# 1-3. 점수순으로 정렬
sorted_by_score = []  # sorted + lambda 사용


# 2. 클로저로 할인 계산기 만들기
def make_discount_calculator(discount_rate):
    """
    할인율을 기억하는 계산 함수를 반환합니다.
    """
    def calculator(price):
        # 여기에 코드 작성
        pass
    return calculator

# 테스트
vip_discount = make_discount_calculator(0.2)  # 20% 할인
normal_discount = make_discount_calculator(0.1)  # 10% 할인
print(vip_discount(10000))  # 8000
print(normal_discount(10000))  # 9000


# 3. 데코레이터로 양수 검사
def positive_only(func):
    """
    함수의 모든 인자가 양수인지 검사하는 데코레이터
    """
    def wrapper(*args, **kwargs):
        # 여기에 코드 작성
        pass
    return wrapper

@positive_only
def multiply(a, b):
    return a * b

print(multiply(3, 5))   # 15
print(multiply(-3, 5))  # "양수만 허용됩니다" 에러
`,
        solutionCode: `# 1. 데이터 처리
users = [
    {"name": "김철수", "age": 25, "score": 85},
    {"name": "이영희", "age": 17, "score": 92},
    {"name": "박민수", "age": 30, "score": 78},
    {"name": "정수진", "age": 22, "score": 95},
]

# 1-1. 성인(18세 이상)만 필터링
adults = list(filter(lambda u: u["age"] >= 18, users))
print("성인:", [u["name"] for u in adults])

# 1-2. 이름만 추출
names = list(map(lambda u: u["name"], users))
print("이름:", names)

# 1-3. 점수순으로 정렬 (내림차순)
sorted_by_score = sorted(users, key=lambda u: u["score"], reverse=True)
print("점수순:", [f"{u['name']}({u['score']})" for u in sorted_by_score])


# 2. 클로저로 할인 계산기 만들기
def make_discount_calculator(discount_rate):
    """
    할인율을 기억하는 계산 함수를 반환합니다.
    """
    def calculator(price):
        return int(price * (1 - discount_rate))
    return calculator

# 테스트
vip_discount = make_discount_calculator(0.2)  # 20% 할인
normal_discount = make_discount_calculator(0.1)  # 10% 할인
print(f"VIP 할인: {vip_discount(10000)}")  # 8000
print(f"일반 할인: {normal_discount(10000)}")  # 9000


# 3. 데코레이터로 양수 검사
from functools import wraps

def positive_only(func):
    """
    함수의 모든 인자가 양수인지 검사하는 데코레이터
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        # 위치 인자 검사
        for arg in args:
            if isinstance(arg, (int, float)) and arg <= 0:
                raise ValueError("양수만 허용됩니다")
        # 키워드 인자 검사
        for value in kwargs.values():
            if isinstance(value, (int, float)) and value <= 0:
                raise ValueError("양수만 허용됩니다")
        return func(*args, **kwargs)
    return wrapper

@positive_only
def multiply(a, b):
    return a * b

print(f"3 * 5 = {multiply(3, 5)}")   # 15
try:
    print(multiply(-3, 5))  # 에러 발생
except ValueError as e:
    print(f"에러: {e}")
`
      }
    },
    {
      id: 'day2-quiz',
      type: 'quiz',
      title: 'Day 2 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'lambda x, y: x + y 와 동일한 일반 함수는?',
            options: ['def add: return x + y', 'def add(x, y): return x + y', 'def lambda(x, y): x + y', 'add = x + y'],
            answer: 1,
            explanation: 'lambda는 def add(x, y): return x + y와 동일한 익명 함수입니다.'
          },
          {
            question: '클로저의 핵심 특징은?',
            options: ['빠른 실행 속도', '외부 함수의 변수를 기억', '메모리 절약', '타입 검사'],
            answer: 1,
            explanation: '클로저는 내부 함수가 외부 함수의 변수를 기억하는 특징이 있습니다.'
          },
          {
            question: '@decorator 문법은 무엇과 같은가?',
            options: ['func = decorator(func)', 'decorator(func())', 'func.decorator()', 'decorator + func'],
            answer: 0,
            explanation: '@decorator는 func = decorator(func)와 동일한 문법입니다.'
          }
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'python-classes',
  title: '클래스와 객체',
  totalDuration: 180,
  tasks: [
    {
      id: 'class-basics',
      type: 'reading',
      title: '클래스 기초',
      duration: 45,
      content: {
        objectives: [
          '클래스와 객체의 개념을 이해한다',
          '클래스를 정의하고 인스턴스를 생성할 수 있다',
          'self의 역할을 이해한다'
        ],
        markdown: `
## 클래스와 객체

### 클래스란?

\`\`\`
클래스 = 객체를 만들기 위한 설계도
객체 = 클래스로 만든 실제 인스턴스

비유:
클래스: 자동차 설계도
객체: 실제 자동차 (현대 소나타, 기아 K5, ...)
\`\`\`

### 클래스 정의

\`\`\`python
class Person:
    """사람을 나타내는 클래스"""

    def __init__(self, name, age):
        """생성자: 객체 초기화"""
        self.name = name  # 인스턴스 변수
        self.age = age

    def greet(self):
        """메서드: 객체의 동작"""
        return f"안녕하세요, 저는 {self.name}입니다."

    def have_birthday(self):
        """나이 증가"""
        self.age += 1

# 객체 생성
person1 = Person("철수", 25)
person2 = Person("영희", 23)

# 메서드 호출
print(person1.greet())  # "안녕하세요, 저는 철수입니다."
print(person2.age)      # 23

person1.have_birthday()
print(person1.age)      # 26
\`\`\`

### self의 역할

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name  # self.name은 인스턴스 변수

    def bark(self):
        # self를 통해 인스턴스 변수에 접근
        return f"{self.name}이(가) 짖습니다: 멍멍!"

dog1 = Dog("바둑이")
dog2 = Dog("초코")

# 각 객체는 자신만의 name을 가짐
print(dog1.bark())  # "바둑이이(가) 짖습니다: 멍멍!"
print(dog2.bark())  # "초코이(가) 짖습니다: 멍멍!"
\`\`\`

### 클래스 변수 vs 인스턴스 변수

\`\`\`python
class Student:
    school = "FDE Academy"  # 클래스 변수 (모든 인스턴스 공유)

    def __init__(self, name):
        self.name = name    # 인스턴스 변수 (각 인스턴스마다 다름)

s1 = Student("철수")
s2 = Student("영희")

print(s1.school)  # "FDE Academy"
print(s2.school)  # "FDE Academy"

# 클래스 변수 변경 시 모든 인스턴스에 영향
Student.school = "New Academy"
print(s1.school)  # "New Academy"
print(s2.school)  # "New Academy"
\`\`\`
        `,
        externalLinks: [
          { title: 'Python 클래스', url: 'https://docs.python.org/3/tutorial/classes.html' }
        ]
      }
    },
    {
      id: 'special-methods',
      type: 'reading',
      title: '특수 메서드',
      duration: 30,
      content: {
        objectives: [
          '__init__, __str__, __repr__을 이해한다',
          '연산자 오버로딩을 이해한다'
        ],
        markdown: `
## 특수 메서드 (Magic Methods)

### 주요 특수 메서드

\`\`\`python
class Point:
    def __init__(self, x, y):
        """생성자"""
        self.x = x
        self.y = y

    def __str__(self):
        """print() 시 호출"""
        return f"Point({self.x}, {self.y})"

    def __repr__(self):
        """대화형 인터프리터에서 호출"""
        return f"Point(x={self.x}, y={self.y})"

    def __eq__(self, other):
        """== 연산자"""
        return self.x == other.x and self.y == other.y

    def __add__(self, other):
        """+ 연산자"""
        return Point(self.x + other.x, self.y + other.y)

    def __len__(self):
        """len() 함수"""
        return int((self.x**2 + self.y**2)**0.5)

p1 = Point(3, 4)
p2 = Point(1, 2)

print(p1)        # Point(3, 4)
print(p1 == p2)  # False
print(p1 + p2)   # Point(4, 6)
print(len(p1))   # 5
\`\`\`

### 자주 사용하는 특수 메서드

| 메서드 | 용도 | 예시 |
|--------|------|------|
| __init__ | 생성자 | obj = Class() |
| __str__ | 문자열 변환 | str(obj), print(obj) |
| __repr__ | 표현 | 인터프리터 출력 |
| __eq__ | 동등 비교 | obj1 == obj2 |
| __lt__ | 작다 비교 | obj1 < obj2 |
| __add__ | 덧셈 | obj1 + obj2 |
| __len__ | 길이 | len(obj) |
| __getitem__ | 인덱싱 | obj[key] |
| __iter__ | 반복 | for x in obj |
        `
      }
    },
    {
      id: 'inheritance',
      type: 'reading',
      title: '상속',
      duration: 45,
      content: {
        objectives: [
          '상속의 개념을 이해한다',
          '메서드 오버라이딩을 활용한다',
          'super()를 사용할 수 있다'
        ],
        markdown: `
## 상속 (Inheritance)

### 상속이란?

\`\`\`python
# 부모 클래스
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

# 자식 클래스
class Dog(Animal):
    def speak(self):  # 메서드 오버라이딩
        return "멍멍!"

class Cat(Animal):
    def speak(self):
        return "야옹!"

dog = Dog("바둑이")
cat = Cat("나비")

print(dog.name)     # "바둑이" (부모에서 상속)
print(dog.speak())  # "멍멍!" (오버라이딩)
print(cat.speak())  # "야옹!"
\`\`\`

### super() 사용

\`\`\`python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

class Student(Person):
    def __init__(self, name, age, student_id):
        super().__init__(name, age)  # 부모 생성자 호출
        self.student_id = student_id

    def introduce(self):
        return f"저는 {self.name}이고, 학번은 {self.student_id}입니다."

student = Student("철수", 20, "2024001")
print(student.name)        # "철수"
print(student.student_id)  # "2024001"
\`\`\`

### 다중 상속

\`\`\`python
class Flyable:
    def fly(self):
        return "날고 있습니다!"

class Swimmable:
    def swim(self):
        return "수영하고 있습니다!"

class Duck(Animal, Flyable, Swimmable):
    def speak(self):
        return "꽥꽥!"

duck = Duck("도널드")
print(duck.speak())  # "꽥꽥!"
print(duck.fly())    # "날고 있습니다!"
print(duck.swim())   # "수영하고 있습니다!"
\`\`\`
        `
      }
    },
    {
      id: 'class-practice',
      type: 'code',
      title: '클래스 실습',
      duration: 45,
      content: {
        objectives: [
          '실용적인 클래스를 설계한다',
          '상속을 활용한다'
        ],
        instructions: `
## 클래스 실습

은행 계좌 시스템을 클래스로 구현하세요.
        `,
        starterCode: `# 1. 기본 계좌 클래스
class BankAccount:
    """은행 계좌 클래스"""

    def __init__(self, owner, balance=0):
        """계좌 생성"""
        pass

    def deposit(self, amount):
        """입금"""
        pass

    def withdraw(self, amount):
        """출금 (잔액 부족 시 False 반환)"""
        pass

    def __str__(self):
        """계좌 정보 문자열"""
        pass

# 2. 저축 계좌 (이자 기능 추가)
class SavingsAccount(BankAccount):
    """저축 계좌 - 이자 기능 추가"""

    def __init__(self, owner, balance=0, interest_rate=0.02):
        pass

    def add_interest(self):
        """이자 추가"""
        pass

# 테스트
account = BankAccount("철수", 10000)
print(account)  # "철수의 계좌: 10,000원"
account.deposit(5000)
print(account)  # "철수의 계좌: 15,000원"
account.withdraw(3000)
print(account)  # "철수의 계좌: 12,000원"

savings = SavingsAccount("영희", 100000, 0.05)
savings.add_interest()
print(savings)  # "영희의 계좌: 105,000원"
`,
        solutionCode: `# 1. 기본 계좌 클래스
class BankAccount:
    """은행 계좌 클래스"""

    def __init__(self, owner, balance=0):
        """계좌 생성"""
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        """입금"""
        if amount > 0:
            self.balance += amount
            return True
        return False

    def withdraw(self, amount):
        """출금 (잔액 부족 시 False 반환)"""
        if amount > 0 and self.balance >= amount:
            self.balance -= amount
            return True
        return False

    def __str__(self):
        """계좌 정보 문자열"""
        return f"{self.owner}의 계좌: {self.balance:,}원"

# 2. 저축 계좌 (이자 기능 추가)
class SavingsAccount(BankAccount):
    """저축 계좌 - 이자 기능 추가"""

    def __init__(self, owner, balance=0, interest_rate=0.02):
        super().__init__(owner, balance)
        self.interest_rate = interest_rate

    def add_interest(self):
        """이자 추가"""
        interest = int(self.balance * self.interest_rate)
        self.balance += interest
        return interest

# 테스트
account = BankAccount("철수", 10000)
print(account)  # "철수의 계좌: 10,000원"
account.deposit(5000)
print(account)  # "철수의 계좌: 15,000원"
account.withdraw(3000)
print(account)  # "철수의 계좌: 12,000원"

savings = SavingsAccount("영희", 100000, 0.05)
print(f"이자: {savings.add_interest():,}원")  # "이자: 5,000원"
print(savings)  # "영희의 계좌: 105,000원"
`
      }
    },
    {
      id: 'day3-quiz',
      type: 'quiz',
      title: 'Day 3 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'self의 역할은?',
            options: ['클래스 자체를 참조', '현재 인스턴스를 참조', '부모 클래스를 참조', '전역 변수를 참조'],
            answer: 1,
            explanation: 'self는 메서드를 호출한 현재 인스턴스(객체)를 참조합니다.'
          },
          {
            question: '__str__ 메서드는 언제 호출되는가?',
            options: ['객체 생성 시', 'print() 또는 str() 호출 시', '객체 삭제 시', '비교 연산 시'],
            answer: 1,
            explanation: '__str__은 print()나 str() 함수로 객체를 문자열로 변환할 때 호출됩니다.'
          },
          {
            question: 'super()의 역할은?',
            options: ['자식 클래스 참조', '부모 클래스 참조', '클래스 변수 참조', '인스턴스 생성'],
            answer: 1,
            explanation: 'super()는 부모 클래스를 참조하여 부모의 메서드를 호출할 수 있게 합니다.'
          }
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'python-modules',
  title: '모듈과 패키지',
  totalDuration: 180,
  tasks: [
    {
      id: 'modules',
      type: 'reading',
      title: '모듈',
      duration: 45,
      content: {
        objectives: [
          '모듈의 개념을 이해한다',
          'import 방법을 알고 활용한다',
          '자신만의 모듈을 만들 수 있다'
        ],
        markdown: `
## 모듈 (Module)

### 모듈이란?

\`\`\`
모듈 = Python 코드가 담긴 .py 파일

왜 모듈을 사용하는가?
├── 코드 재사용
├── 네임스페이스 분리
├── 코드 구조화
└── 협업 용이
\`\`\`

### import 방법

\`\`\`python
# 1. 전체 모듈 임포트
import math
print(math.sqrt(16))  # 4.0
print(math.pi)        # 3.14159...

# 2. 별칭 사용
import math as m
print(m.sqrt(16))

# 3. 특정 함수/변수만 임포트
from math import sqrt, pi
print(sqrt(16))  # math. 없이 사용
print(pi)

# 4. 모든 것 임포트 (비권장)
from math import *
print(sqrt(16))
\`\`\`

### 자신만의 모듈 만들기

\`\`\`python
# my_utils.py
def greet(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b

PI = 3.14159

# main.py
import my_utils

print(my_utils.greet("철수"))  # "Hello, 철수!"
print(my_utils.add(3, 5))      # 8
print(my_utils.PI)             # 3.14159
\`\`\`

### __name__과 __main__

\`\`\`python
# my_module.py
def main():
    print("메인 함수 실행")

if __name__ == "__main__":
    # 직접 실행할 때만 실행됨
    # 다른 파일에서 import할 때는 실행 안됨
    main()
\`\`\`
        `
      }
    },
    {
      id: 'packages',
      type: 'reading',
      title: '패키지',
      duration: 30,
      content: {
        objectives: [
          '패키지의 구조를 이해한다',
          '패키지를 만들고 사용할 수 있다'
        ],
        markdown: `
## 패키지 (Package)

### 패키지란?

\`\`\`
패키지 = 모듈들의 폴더

구조:
my_package/
├── __init__.py     # 패키지 초기화 파일
├── module_a.py
├── module_b.py
└── sub_package/
    ├── __init__.py
    └── module_c.py
\`\`\`

### 패키지 사용

\`\`\`python
# 패키지에서 모듈 임포트
from my_package import module_a
from my_package.module_b import some_function
from my_package.sub_package import module_c

# __init__.py에서 정의한 것 임포트
from my_package import some_variable
\`\`\`

### __init__.py

\`\`\`python
# my_package/__init__.py

# 패키지 버전
__version__ = "1.0.0"

# 패키지에서 바로 사용할 것들
from .module_a import func_a
from .module_b import func_b

# __all__: from package import * 시 가져올 것들
__all__ = ["func_a", "func_b"]
\`\`\`
        `
      }
    },
    {
      id: 'stdlib',
      type: 'reading',
      title: '표준 라이브러리',
      duration: 45,
      content: {
        objectives: [
          '주요 표준 라이브러리를 알고 사용한다',
          'datetime, json, os, re를 활용한다'
        ],
        markdown: `
## 표준 라이브러리

### datetime

\`\`\`python
from datetime import datetime, date, timedelta

# 현재 시간
now = datetime.now()
print(now)  # 2024-01-15 10:30:00.123456

# 날짜 포맷팅
now.strftime("%Y-%m-%d")  # "2024-01-15"
now.strftime("%H:%M:%S")  # "10:30:00"

# 문자열 → datetime
datetime.strptime("2024-01-15", "%Y-%m-%d")

# 날짜 계산
tomorrow = now + timedelta(days=1)
last_week = now - timedelta(weeks=1)
\`\`\`

### json

\`\`\`python
import json

# 딕셔너리 → JSON 문자열
data = {"name": "철수", "age": 25}
json_str = json.dumps(data, ensure_ascii=False)
# '{"name": "철수", "age": 25}'

# JSON 문자열 → 딕셔너리
parsed = json.loads(json_str)

# 파일 읽기/쓰기
with open("data.json", "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open("data.json", "r") as f:
    loaded = json.load(f)
\`\`\`

### os

\`\`\`python
import os

# 현재 작업 디렉토리
os.getcwd()

# 디렉토리 변경
os.chdir("/path/to/dir")

# 디렉토리 목록
os.listdir(".")

# 파일/디렉토리 존재 확인
os.path.exists("file.txt")
os.path.isfile("file.txt")
os.path.isdir("folder")

# 경로 결합
os.path.join("folder", "file.txt")

# 환경 변수
os.environ.get("HOME")
\`\`\`

### re (정규표현식)

\`\`\`python
import re

text = "이메일: test@example.com, 전화: 010-1234-5678"

# 패턴 검색
email = re.search(r'[\\w.-]+@[\\w.-]+', text)
print(email.group())  # "test@example.com"

# 모든 매칭 찾기
phones = re.findall(r'\\d{3}-\\d{4}-\\d{4}', text)
print(phones)  # ["010-1234-5678"]

# 치환
cleaned = re.sub(r'\\d', '*', text)
# "이메일: test@example.com, 전화: ***-****-****"
\`\`\`
        `
      }
    },
    {
      id: 'pip',
      type: 'code',
      title: 'pip와 외부 패키지',
      duration: 45,
      content: {
        objectives: [
          'pip로 패키지를 설치하고 관리한다',
          'requirements.txt를 사용한다'
        ],
        instructions: `
## pip 사용법

터미널에서 다음 명령어들을 실습하세요.
        `,
        starterCode: `# pip 기본 명령어 (터미널에서 실행)

# 패키지 설치
# pip install requests

# 특정 버전 설치
# pip install requests==2.28.0

# 패키지 업그레이드
# pip install --upgrade requests

# 패키지 제거
# pip uninstall requests

# 설치된 패키지 목록
# pip list

# 패키지 정보
# pip show requests

# requirements.txt로 설치
# pip install -r requirements.txt

# requirements.txt 생성
# pip freeze > requirements.txt


# Python 코드에서 requests 사용 예시
import requests

response = requests.get("https://api.github.com")
print(f"상태 코드: {response.status_code}")
print(f"응답 헤더: {response.headers['content-type']}")
print(f"응답 본문: {response.json()['current_user_url']}")
`,
        solutionCode: `# requirements.txt 예시
"""
requests==2.28.0
pandas>=1.5.0
numpy~=1.23.0
python-dotenv
"""

# requests 사용 예시
import requests

# GET 요청
response = requests.get("https://api.github.com")
print(f"상태 코드: {response.status_code}")

# POST 요청
data = {"name": "test", "value": 123}
response = requests.post("https://httpbin.org/post", json=data)
print(response.json())

# 헤더 설정
headers = {"Authorization": "Bearer token123"}
response = requests.get("https://api.example.com", headers=headers)

# 타임아웃 설정
response = requests.get("https://api.example.com", timeout=5)

# 에러 처리
try:
    response = requests.get("https://api.example.com")
    response.raise_for_status()  # 에러 시 예외 발생
except requests.exceptions.RequestException as e:
    print(f"요청 실패: {e}")
`
      }
    },
    {
      id: 'day4-quiz',
      type: 'quiz',
      title: 'Day 4 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'from math import sqrt는 어떤 방식으로 사용하는가?',
            options: ['math.sqrt(16)', 'sqrt(16)', 'm.sqrt(16)', 'math.sqrt.call(16)'],
            answer: 1,
            explanation: 'from ... import로 가져오면 모듈명 없이 직접 사용할 수 있습니다.'
          },
          {
            question: '__init__.py 파일의 역할은?',
            options: ['메인 함수 정의', '폴더를 패키지로 인식', '테스트 코드', '설정 파일'],
            answer: 1,
            explanation: '__init__.py는 해당 폴더를 Python 패키지로 인식하게 합니다.'
          },
          {
            question: 'pip freeze > requirements.txt의 역할은?',
            options: ['패키지 설치', '패키지 제거', '설치된 패키지 목록 저장', '패키지 업데이트'],
            answer: 2,
            explanation: 'pip freeze는 설치된 패키지 목록을 출력하고, > 로 파일에 저장합니다.'
          }
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'python-files',
  title: '파일 처리 & 주간 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'file-io',
      type: 'reading',
      title: '파일 입출력',
      duration: 45,
      content: {
        objectives: [
          '파일을 읽고 쓸 수 있다',
          'with 문을 활용한다',
          'CSV, JSON 파일을 처리한다'
        ],
        markdown: `
## 파일 입출력

### 기본 파일 읽기/쓰기

\`\`\`python
# 파일 쓰기
with open("test.txt", "w", encoding="utf-8") as f:
    f.write("Hello, World!\\n")
    f.write("안녕하세요!\\n")

# 파일 읽기 (전체)
with open("test.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)

# 파일 읽기 (한 줄씩)
with open("test.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())

# 파일 읽기 (리스트로)
with open("test.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()  # ["Hello, World!\\n", "안녕하세요!\\n"]
\`\`\`

### 파일 모드

| 모드 | 설명 |
|------|------|
| r | 읽기 (기본값) |
| w | 쓰기 (덮어쓰기) |
| a | 추가 (append) |
| r+ | 읽기 + 쓰기 |
| rb | 바이너리 읽기 |
| wb | 바이너리 쓰기 |

### CSV 파일

\`\`\`python
import csv

# CSV 쓰기
with open("data.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["이름", "나이", "도시"])
    writer.writerow(["철수", 25, "서울"])
    writer.writerow(["영희", 23, "부산"])

# CSV 읽기
with open("data.csv", "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)

# 딕셔너리로 읽기/쓰기
with open("data.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["이름"], row["나이"])
\`\`\`

### JSON 파일

\`\`\`python
import json

data = {
    "users": [
        {"name": "철수", "age": 25},
        {"name": "영희", "age": 23}
    ]
}

# JSON 쓰기
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# JSON 읽기
with open("data.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)
    print(loaded["users"][0]["name"])  # "철수"
\`\`\`
        `
      }
    },
    {
      id: 'exception-handling',
      type: 'reading',
      title: '예외 처리',
      duration: 30,
      content: {
        objectives: [
          'try-except 구문을 사용한다',
          '다양한 예외 타입을 처리한다',
          '사용자 정의 예외를 만든다'
        ],
        markdown: `
## 예외 처리

### try-except

\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("0으로 나눌 수 없습니다")

# 여러 예외 처리
try:
    value = int("abc")
except ValueError:
    print("숫자가 아닙니다")
except TypeError:
    print("타입 에러입니다")

# 모든 예외 처리
try:
    risky_operation()
except Exception as e:
    print(f"에러 발생: {e}")
\`\`\`

### try-except-else-finally

\`\`\`python
try:
    file = open("test.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("파일이 없습니다")
else:
    print("파일 읽기 성공")
    print(content)
finally:
    print("항상 실행됨")
    if 'file' in locals():
        file.close()
\`\`\`

### 예외 발생시키기

\`\`\`python
def divide(a, b):
    if b == 0:
        raise ValueError("0으로 나눌 수 없습니다")
    return a / b

# 사용자 정의 예외
class InsufficientFundsError(Exception):
    """잔액 부족 예외"""
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(f"잔액 부족: {balance}원 < {amount}원")
    return balance - amount
\`\`\`
        `
      }
    },
    {
      id: 'weekly-project-2',
      type: 'project',
      title: '주간 프로젝트: 주소록 관리 프로그램',
      duration: 90,
      content: {
        objectives: [
          'Week 2에서 배운 모든 개념을 종합 활용한다',
          '파일 저장/불러오기 기능을 구현한다'
        ],
        requirements: [
          '**주소록 관리 프로그램**',
          '',
          '## 기능 요구사항',
          '',
          '1. 연락처 추가 (이름, 전화번호, 이메일)',
          '2. 연락처 검색',
          '3. 연락처 수정',
          '4. 연락처 삭제',
          '5. 전체 목록 출력',
          '6. JSON 파일로 저장/불러오기',
          '',
          '## 클래스 설계',
          '```python',
          'class Contact:',
          '    def __init__(self, name, phone, email):',
          '        ...',
          '',
          'class AddressBook:',
          '    def add_contact(self, contact):',
          '    def search(self, name):',
          '    def update(self, name, **kwargs):',
          '    def delete(self, name):',
          '    def save_to_file(self, filename):',
          '    def load_from_file(self, filename):',
          '```',
          '',
          '## 평가 기준',
          '- 클래스 설계의 적절성',
          '- 파일 입출력 구현',
          '- 예외 처리',
          '- 코드 품질'
        ],
        evaluationCriteria: [
          '기능 완성도',
          'OOP 설계',
          '파일 처리',
          '예외 처리'
        ]
      }
    },
    {
      id: 'day5-quiz',
      type: 'quiz',
      title: 'Day 5 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'with open() as f: 구문의 장점은?',
            options: ['빠른 속도', '자동으로 파일 닫힘', '더 많은 기능', '암호화 지원'],
            answer: 1,
            explanation: 'with 문을 사용하면 블록이 끝날 때 자동으로 파일이 닫힙니다.'
          },
          {
            question: 'try-except-finally에서 finally는 언제 실행되는가?',
            options: ['예외 발생 시만', '예외 미발생 시만', '항상', '한 번도 안됨'],
            answer: 2,
            explanation: 'finally 블록은 예외 발생 여부와 관계없이 항상 실행됩니다.'
          },
          {
            question: 'raise 키워드의 역할은?',
            options: ['예외 처리', '예외 발생', '예외 무시', '예외 로깅'],
            answer: 1,
            explanation: 'raise는 의도적으로 예외를 발생시킬 때 사용합니다.'
          }
        ]
      }
    }
  ]
}

export const prereqPython2Week: Week = {
  slug: 'prereq-python-2',
  week: 2,
  phase: 0,
  month: 0,
  access: 'free',
  title: 'Python 기초 2: 함수, 클래스, 모듈, 파일',
  topics: ['함수', '람다', '클로저', '데코레이터', '클래스', '상속', '모듈', '패키지', '파일 처리', '예외 처리'],
  practice: '주소록 관리 프로그램',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
