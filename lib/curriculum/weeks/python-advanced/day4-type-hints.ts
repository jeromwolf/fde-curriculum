// Day 4: Type Hints & mypy
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'typehints-intro-video',
    type: 'video',
    title: 'Type Hints 소개 (PEP 484)',
    duration: 15,
    content: {
      objectives: [
        'Type Hints의 목적과 장점을 이해한다',
        'Python의 동적 타이핑과 정적 타이핑의 차이를 파악한다',
        '기본 타입 힌트 문법을 익힌다'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=QORvB-_mbZ0',
      transcript: `
## Type Hints란?

**Type Hints**는 Python 3.5+에서 도입된 타입 주석 시스템입니다. 코드에 타입 정보를 추가하여 가독성과 도구 지원을 개선합니다.

### Type Hints의 목적

\`\`\`python
# Type Hints 없이
def greet(name):
    return f"Hello, {name}!"

# Type Hints 있을 때
def greet(name: str) -> str:
    return f"Hello, {name}!"
\`\`\`

**장점:**
- **문서화**: 함수 시그니처가 명확해짐
- **IDE 지원**: 자동완성, 타입 오류 감지
- **정적 분석**: mypy로 타입 오류 사전 발견
- **리팩토링**: 타입 정보로 안전한 코드 변경

### 동적 타이핑 vs 정적 타이핑

\`\`\`
┌─────────────────────────────────────────────────────┐
│  Python (동적 타이핑)                                │
│  - 변수 타입이 런타임에 결정                         │
│  - 유연하지만 타입 오류가 런타임에 발생              │
│                                                      │
│  Type Hints (점진적 타이핑)                          │
│  - 타입 정보를 코드에 추가                           │
│  - 런타임에는 영향 없음 (주석일 뿐)                  │
│  - mypy 같은 도구로 정적 분석 가능                   │
└─────────────────────────────────────────────────────┘
\`\`\`

### 기본 문법

\`\`\`python
# 변수 타입 힌트
name: str = "Alice"
age: int = 30
is_active: bool = True

# 함수 타입 힌트
def add(a: int, b: int) -> int:
    return a + b

# 반환값 없음
def log(message: str) -> None:
    print(message)
\`\`\`

### 핵심 타입

| 타입 | 예시 | 설명 |
|------|------|------|
| \`int\` | \`42\` | 정수 |
| \`float\` | \`3.14\` | 실수 |
| \`str\` | \`"hello"\` | 문자열 |
| \`bool\` | \`True\` | 불리언 |
| \`None\` | \`None\` | None 타입 |
| \`list[int]\` | \`[1, 2, 3]\` | 정수 리스트 |
| \`dict[str, int]\` | \`{"a": 1}\` | 문자열-정수 딕셔너리 |

### 핵심 메시지

> "Type Hints는 **선택적 문서화**입니다. 코드 실행에는 영향 없지만, 개발 경험을 크게 향상시킵니다."
      `,
      keyPoints: [
        'Type Hints = 선택적 타입 주석 (런타임 영향 없음)',
        '변수: name: str = "Alice"',
        '함수: def func(arg: int) -> str',
        'mypy로 정적 타입 체크 가능'
      ]
    }
  },
  {
    id: 'typing-module-reading',
    type: 'reading',
    title: 'Python typing 모듈 문서',
    duration: 10,
    content: {
      objectives: [
        'typing 모듈의 주요 타입을 파악한다',
        'Union, Optional, Literal 등을 이해한다',
        'Generic과 TypeVar의 역할을 안다'
      ],
      markdown: `
# Python typing 모듈 핵심 정리

## 컬렉션 타입 (Python 3.9+)

Python 3.9부터는 내장 타입을 직접 사용할 수 있습니다:

\`\`\`python
# Python 3.9+
names: list[str] = ["Alice", "Bob"]
ages: dict[str, int] = {"Alice": 30}
coords: tuple[int, int, int] = (1, 2, 3)
unique: set[int] = {1, 2, 3}

# Python 3.8 이하
from typing import List, Dict, Tuple, Set
names: List[str] = ["Alice", "Bob"]
\`\`\`

## Union & Optional

\`\`\`python
from typing import Union, Optional

# Union: 여러 타입 중 하나
def parse(value: Union[str, int]) -> str:
    return str(value)

# Python 3.10+: | 연산자 사용
def parse(value: str | int) -> str:
    return str(value)

# Optional: None이 될 수 있는 타입
# Optional[X] == Union[X, None]
def find(name: str) -> Optional[str]:
    return db.get(name)  # 없으면 None 반환
\`\`\`

## Callable (함수 타입)

\`\`\`python
from typing import Callable

# (인자 타입들) -> 반환 타입
def apply(func: Callable[[int, int], int], a: int, b: int) -> int:
    return func(a, b)

# 사용
apply(lambda x, y: x + y, 1, 2)  # 3
\`\`\`

## TypeVar & Generic

\`\`\`python
from typing import TypeVar, Generic

T = TypeVar('T')  # 제네릭 타입 변수

def first(items: list[T]) -> T:
    return items[0]

# 타입이 보존됨
first([1, 2, 3])      # int
first(["a", "b"])     # str

# 제네릭 클래스
class Stack(Generic[T]):
    def __init__(self) -> None:
        self.items: list[T] = []

    def push(self, item: T) -> None:
        self.items.append(item)

    def pop(self) -> T:
        return self.items.pop()
\`\`\`

## Literal & Final

\`\`\`python
from typing import Literal, Final

# Literal: 특정 값만 허용
def set_mode(mode: Literal["read", "write"]) -> None:
    ...

set_mode("read")   # OK
set_mode("delete") # 타입 에러!

# Final: 재할당 금지
MAX_SIZE: Final = 100
MAX_SIZE = 200  # 타입 에러!
\`\`\`

## Any & cast

\`\`\`python
from typing import Any, cast

# Any: 모든 타입 허용 (타입 체크 비활성화)
def process(data: Any) -> Any:
    return data

# cast: 타입 단언 (런타임 효과 없음)
value = cast(str, some_value)  # "이건 str이야"라고 mypy에게 알림
\`\`\`

## 타입 별칭

\`\`\`python
# 복잡한 타입에 별칭 부여
from typing import TypeAlias

UserId: TypeAlias = int
UserMap: TypeAlias = dict[UserId, str]

def get_user(user_id: UserId, users: UserMap) -> str:
    return users.get(user_id, "Unknown")
\`\`\`

## Python 버전별 문법

| 기능 | Python 3.8 | Python 3.9 | Python 3.10+ |
|------|-----------|------------|--------------|
| 리스트 | \`List[int]\` | \`list[int]\` | \`list[int]\` |
| Union | \`Union[X, Y]\` | \`Union[X, Y]\` | \`X \\| Y\` |
| 타입 가드 | - | - | \`TypeGuard\` |
| Self | - | - | \`Self\` (3.11) |
      `,
      externalLinks: [
        { title: 'typing 모듈 공식 문서', url: 'https://docs.python.org/3/library/typing.html' },
        { title: 'PEP 484 - Type Hints', url: 'https://peps.python.org/pep-0484/' },
        { title: 'mypy 문서', url: 'https://mypy.readthedocs.io/' }
      ],
      keyPoints: [
        'Python 3.9+: list[int], dict[str, int] 직접 사용',
        'Union[X, Y] 또는 X | Y (3.10+): 여러 타입 중 하나',
        'Optional[X] = Union[X, None]: None 가능',
        'TypeVar로 제네릭 타입 정의'
      ]
    }
  },
  {
    id: 'basic-typehints-code',
    type: 'code',
    title: '기본 타입 힌트 적용 (int, str, List, Dict)',
    duration: 15,
    content: {
      objectives: [
        '기본 타입 힌트를 함수와 변수에 적용한다',
        'Optional과 Union을 적절히 사용한다',
        '타입 힌트가 있는 코드의 가독성을 체감한다'
      ],
      instructions: `
사용자 관리 모듈에 타입 힌트를 적용합니다.

## 요구사항
1. User 클래스에 타입 힌트 추가
2. 함수에 인자/반환 타입 명시
3. Optional, Union 적절히 사용
      `,
      starterCode: `
# TODO: 타입 힌트를 추가하세요

class User:
    def __init__(self, id, name, email, age=None):
        self.id = id
        self.name = name
        self.email = email
        self.age = age

    def __repr__(self):
        return f"User({self.id}, {self.name})"


def create_user(id, name, email, age=None):
    """새 사용자 생성"""
    return User(id, name, email, age)


def get_user_by_id(users, user_id):
    """ID로 사용자 검색 (없으면 None)"""
    for user in users:
        if user.id == user_id:
            return user
    return None


def filter_users_by_age(users, min_age, max_age=None):
    """나이로 사용자 필터링"""
    result = []
    for user in users:
        if user.age is None:
            continue
        if user.age >= min_age:
            if max_age is None or user.age <= max_age:
                result.append(user)
    return result


def merge_user_data(users, extra_data):
    """사용자 데이터에 추가 정보 병합"""
    merged = {}
    for user in users:
        merged[user.id] = {
            "user": user,
            "extra": extra_data.get(user.id, {})
        }
    return merged


# 테스트
users = [
    create_user(1, "Alice", "alice@example.com", 30),
    create_user(2, "Bob", "bob@example.com", 25),
    create_user(3, "Charlie", "charlie@example.com"),  # 나이 없음
]

print("모든 사용자:", users)
print("ID 2 검색:", get_user_by_id(users, 2))
print("25-35세:", filter_users_by_age(users, 25, 35))

extra = {1: {"role": "admin"}, 2: {"role": "user"}}
print("병합:", merge_user_data(users, extra))
      `,
      solutionCode: `
from typing import Optional
from dataclasses import dataclass


@dataclass
class User:
    """사용자 정보를 담는 데이터 클래스

    💡 @dataclass와 타입 힌트의 조합:
    - 자동 __init__, __repr__, __eq__ 생성
    - 타입 힌트가 필드 정의 역할
    """
    id: int
    name: str
    email: str
    age: Optional[int] = None  # None 가능


def create_user(
    id: int,
    name: str,
    email: str,
    age: Optional[int] = None
) -> User:
    """새 사용자 생성

    Args:
        id: 사용자 ID (정수)
        name: 이름
        email: 이메일 주소
        age: 나이 (선택)

    Returns:
        User: 생성된 사용자 객체
    """
    return User(id, name, email, age)


def get_user_by_id(users: list[User], user_id: int) -> Optional[User]:
    """ID로 사용자 검색

    Args:
        users: 사용자 리스트
        user_id: 검색할 ID

    Returns:
        Optional[User]: 찾으면 User, 없으면 None

    💡 Optional[User]는 User | None과 동일
    """
    for user in users:
        if user.id == user_id:
            return user
    return None


def filter_users_by_age(
    users: list[User],
    min_age: int,
    max_age: Optional[int] = None
) -> list[User]:
    """나이로 사용자 필터링

    Args:
        users: 사용자 리스트
        min_age: 최소 나이
        max_age: 최대 나이 (선택)

    Returns:
        list[User]: 조건에 맞는 사용자 리스트

    💡 리스트 컴프리헨션 + 조건부 필터링
    """
    return [
        user for user in users
        if user.age is not None
        and user.age >= min_age
        and (max_age is None or user.age <= max_age)
    ]


# 복잡한 반환 타입에 별칭 사용
UserData = dict[int, dict[str, User | dict]]


def merge_user_data(
    users: list[User],
    extra_data: dict[int, dict]
) -> UserData:
    """사용자 데이터에 추가 정보 병합

    Args:
        users: 사용자 리스트
        extra_data: ID → 추가정보 매핑

    Returns:
        UserData: ID → {user, extra} 매핑
    """
    return {
        user.id: {
            "user": user,
            "extra": extra_data.get(user.id, {})
        }
        for user in users
    }


# 타입 가드 예제 (Python 3.10+)
def has_age(user: User) -> bool:
    """나이가 있는지 확인하는 타입 가드"""
    return user.age is not None


# 테스트
users: list[User] = [
    create_user(1, "Alice", "alice@example.com", 30),
    create_user(2, "Bob", "bob@example.com", 25),
    create_user(3, "Charlie", "charlie@example.com"),  # 나이 없음
]

print("모든 사용자:", users)
print("ID 2 검색:", get_user_by_id(users, 2))
print("25-35세:", filter_users_by_age(users, 25, 35))

extra: dict[int, dict] = {1: {"role": "admin"}, 2: {"role": "user"}}
print("병합:", merge_user_data(users, extra))

# 나이 있는 사용자만
print("나이 있음:", [u for u in users if has_age(u)])
      `,
      keyPoints: [
        '@dataclass + 타입 힌트 = 간결한 데이터 클래스',
        'Optional[X] = X | None: None 가능한 타입',
        '복잡한 타입은 TypeAlias로 별칭 부여',
        '함수 시그니처가 문서화 역할을 함'
      ]
    }
  },
  {
    id: 'typehints-basic-quiz',
    type: 'quiz',
    title: 'Type Hints 기초 퀴즈',
    duration: 5,
    content: {
      objectives: [
        '기본 타입 힌트 문법을 이해했는지 확인한다'
      ],
      questions: [
        {
          question: 'Optional[str]과 동일한 표현은?',
          options: [
            'str',
            'Union[str, None]',
            'str | int',
            'list[str]'
          ],
          answer: 1,
          explanation: 'Optional[X]는 Union[X, None]의 축약형입니다. 값이 X 타입이거나 None일 수 있음을 의미합니다.'
        },
        {
          question: 'Type Hints가 런타임에 미치는 영향은?',
          options: [
            '타입이 맞지 않으면 에러 발생',
            '실행 속도가 느려짐',
            '영향 없음 (주석일 뿐)',
            '메모리 사용량 증가'
          ],
          answer: 2,
          explanation: 'Type Hints는 런타임에 아무 영향을 미치지 않습니다. 인터프리터는 이를 무시합니다. mypy 같은 도구로 별도로 체크해야 합니다.'
        },
        {
          question: 'list[int]를 Python 3.8에서 사용하려면?',
          options: [
            '그냥 사용 가능',
            'from typing import List 후 List[int]',
            'from __future__ import annotations',
            '2번과 3번 모두 가능'
          ],
          answer: 3,
          explanation: 'Python 3.8에서는 from typing import List를 사용하거나, from __future__ import annotations를 파일 맨 위에 추가하면 list[int] 문법을 사용할 수 있습니다.'
        }
      ],
      keyPoints: [
        'Optional[X] = Union[X, None]',
        'Type Hints는 런타임에 영향 없음',
        'Python 3.9+: list[int] 직접 사용 가능'
      ]
    }
  },
  {
    id: 'generics-video',
    type: 'video',
    title: 'Generic, TypeVar, Protocol',
    duration: 15,
    content: {
      objectives: [
        'TypeVar로 제네릭 함수를 정의한다',
        'Generic 클래스를 만든다',
        'Protocol로 구조적 타이핑을 구현한다'
      ],
      transcript: `
## 제네릭 타입 (Generics)

**제네릭**은 타입을 매개변수화하여 다양한 타입에 동작하는 코드를 작성하게 합니다.

### TypeVar: 타입 변수

\`\`\`python
from typing import TypeVar

T = TypeVar('T')  # 어떤 타입이든 될 수 있음

def first(items: list[T]) -> T:
    """리스트의 첫 번째 요소 반환

    💡 입력 타입이 반환 타입을 결정
    """
    return items[0]

# 사용 시 타입이 추론됨
first([1, 2, 3])      # T = int, 반환 int
first(["a", "b"])     # T = str, 반환 str
\`\`\`

### 제한된 TypeVar

\`\`\`python
from typing import TypeVar

# 특정 타입만 허용
Number = TypeVar('Number', int, float)

def add(a: Number, b: Number) -> Number:
    return a + b

add(1, 2)      # OK: int
add(1.5, 2.5)  # OK: float
add("a", "b")  # 타입 에러!

# bound: 상한선 지정
T = TypeVar('T', bound='Comparable')  # Comparable의 서브클래스만
\`\`\`

### Generic 클래스

\`\`\`python
from typing import Generic, TypeVar

T = TypeVar('T')

class Stack(Generic[T]):
    """제네릭 스택 구현"""

    def __init__(self) -> None:
        self.items: list[T] = []

    def push(self, item: T) -> None:
        self.items.append(item)

    def pop(self) -> T:
        return self.items.pop()

    def peek(self) -> T:
        return self.items[-1]

# 사용
int_stack: Stack[int] = Stack()
int_stack.push(1)
int_stack.push(2)
int_stack.push("3")  # 타입 에러! str은 안 됨
\`\`\`

### Protocol: 구조적 타이핑

\`\`\`python
from typing import Protocol

class Drawable(Protocol):
    """draw 메서드가 있는 모든 객체"""
    def draw(self) -> None: ...

class Circle:
    def draw(self) -> None:
        print("○")

class Square:
    def draw(self) -> None:
        print("□")

def render(shape: Drawable) -> None:
    shape.draw()

# Circle, Square 모두 Drawable 프로토콜을 만족
render(Circle())  # ○
render(Square())  # □
\`\`\`

### Protocol vs ABC

\`\`\`
┌─────────────────────────────────────────────────────┐
│  ABC (추상 기반 클래스)                              │
│  - 명시적 상속 필요: class Circle(Drawable)         │
│  - 이름 기반 타이핑 (nominal typing)                │
│                                                      │
│  Protocol (프로토콜)                                 │
│  - 상속 없이 구조만 맞으면 됨                        │
│  - 구조 기반 타이핑 (structural typing)             │
│  - Duck Typing의 정적 버전                          │
└─────────────────────────────────────────────────────┘
\`\`\`

### 핵심 메시지

> "Generic은 **타입을 보존**하고, Protocol은 **구조로 타입을 정의**합니다."
      `,
      keyPoints: [
        'TypeVar: 제네릭 타입 변수 정의',
        'Generic[T]: 제네릭 클래스 정의',
        'Protocol: 구조적 타이핑 (덕 타이핑의 정적 버전)',
        'bound와 제약 조건으로 TypeVar 제한 가능'
      ]
    }
  },
  {
    id: 'generic-class-code',
    type: 'code',
    title: '제네릭 함수 및 클래스 작성',
    duration: 15,
    content: {
      objectives: [
        'TypeVar를 사용한 제네릭 함수를 구현한다',
        'Generic 클래스를 직접 작성한다',
        '타입 안전한 컬렉션을 만든다'
      ],
      instructions: `
제네릭을 사용하여 타입 안전한 자료구조를 구현합니다.

## 과제
1. 제네릭 결과 래퍼 (Result[T, E])
2. 제네릭 캐시 (Cache[K, V])
3. 제네릭 이벤트 시스템
      `,
      starterCode: `
from typing import TypeVar, Generic, Optional, Callable
from dataclasses import dataclass
from datetime import datetime, timedelta

T = TypeVar('T')
E = TypeVar('E', bound=Exception)
K = TypeVar('K')
V = TypeVar('V')

# === 과제 1: Result[T, E] ===
# Rust의 Result 타입처럼 성공/실패를 표현

@dataclass
class Result(Generic[T, E]):
    """성공 또는 실패를 나타내는 결과 타입

    TODO:
    - _value: 성공 시 값
    - _error: 실패 시 에러
    - is_ok(): 성공 여부
    - unwrap(): 값 반환 (실패 시 예외)
    - map(): 값 변환
    """
    pass


# === 과제 2: Cache[K, V] ===

class Cache(Generic[K, V]):
    """TTL이 있는 제네릭 캐시

    TODO:
    - get(key): 값 반환 (만료 시 None)
    - set(key, value, ttl): 값 저장
    - clear(): 캐시 비우기
    """
    pass


# 테스트
print("=== Result 테스트 ===")
def divide(a: int, b: int) -> Result[float, ZeroDivisionError]:
    if b == 0:
        return Result.fail(ZeroDivisionError("0으로 나눌 수 없음"))
    return Result.ok(a / b)

print(divide(10, 2))
print(divide(10, 0))

print("\\n=== Cache 테스트 ===")
cache: Cache[str, int] = Cache()
cache.set("count", 100, ttl=2.0)
print(f"즉시: {cache.get('count')}")
      `,
      solutionCode: `
from typing import TypeVar, Generic, Optional, Callable, Union
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import time

T = TypeVar('T')
E = TypeVar('E', bound=Exception)
K = TypeVar('K')
V = TypeVar('V')
U = TypeVar('U')


# === Result[T, E]: Rust 스타일 결과 타입 ===

@dataclass
class Result(Generic[T, E]):
    """성공 또는 실패를 나타내는 결과 타입

    🎯 역할: 예외 대신 명시적 에러 처리

    💡 장점:
    - 에러 처리가 타입 시스템에 반영됨
    - 체이닝으로 깔끔한 에러 처리
    - 예외 누락 방지

    Attributes:
        _value: 성공 시 값 (실패 시 None)
        _error: 실패 시 에러 (성공 시 None)
    """
    _value: Optional[T] = None
    _error: Optional[E] = None

    @classmethod
    def ok(cls, value: T) -> 'Result[T, E]':
        """성공 결과 생성"""
        return cls(_value=value)

    @classmethod
    def fail(cls, error: E) -> 'Result[T, E]':
        """실패 결과 생성"""
        return cls(_error=error)

    def is_ok(self) -> bool:
        """성공 여부"""
        return self._error is None

    def is_err(self) -> bool:
        """실패 여부"""
        return self._error is not None

    def unwrap(self) -> T:
        """값 반환 (실패 시 예외)"""
        if self._error is not None:
            raise self._error
        return self._value  # type: ignore

    def unwrap_or(self, default: T) -> T:
        """값 반환 (실패 시 기본값)"""
        if self._error is not None:
            return default
        return self._value  # type: ignore

    def map(self, func: Callable[[T], U]) -> 'Result[U, E]':
        """성공 시 값 변환"""
        if self._error is not None:
            return Result.fail(self._error)
        return Result.ok(func(self._value))  # type: ignore

    def __repr__(self) -> str:
        if self.is_ok():
            return f"Ok({self._value})"
        return f"Err({self._error})"


# === Cache[K, V]: TTL 지원 제네릭 캐시 ===

@dataclass
class CacheEntry(Generic[V]):
    """캐시 엔트리 (값 + 만료 시간)"""
    value: V
    expires_at: datetime


class Cache(Generic[K, V]):
    """TTL이 있는 제네릭 캐시

    🎯 역할: 키-값 저장 + 자동 만료

    💡 제네릭의 장점:
    - Cache[str, int]: 문자열 키, 정수 값
    - Cache[int, User]: 정수 키, User 객체 값
    - 타입 안전성 보장
    """

    def __init__(self, default_ttl: float = 60.0):
        """
        Args:
            default_ttl: 기본 TTL (초)
        """
        self._data: dict[K, CacheEntry[V]] = {}
        self._default_ttl = default_ttl

    def get(self, key: K) -> Optional[V]:
        """값 조회 (만료 시 None)"""
        entry = self._data.get(key)
        if entry is None:
            return None
        if datetime.now() > entry.expires_at:
            del self._data[key]
            return None
        return entry.value

    def set(self, key: K, value: V, ttl: Optional[float] = None) -> None:
        """값 저장

        Args:
            key: 캐시 키
            value: 저장할 값
            ttl: TTL (초), None이면 default_ttl 사용
        """
        ttl = ttl if ttl is not None else self._default_ttl
        expires_at = datetime.now() + timedelta(seconds=ttl)
        self._data[key] = CacheEntry(value, expires_at)

    def delete(self, key: K) -> bool:
        """값 삭제, 삭제되면 True"""
        if key in self._data:
            del self._data[key]
            return True
        return False

    def clear(self) -> None:
        """캐시 비우기"""
        self._data.clear()

    def __len__(self) -> int:
        """유효한 항목 수"""
        now = datetime.now()
        return sum(1 for e in self._data.values() if now <= e.expires_at)


# 테스트
print("=== Result 테스트 ===")

def divide(a: int, b: int) -> Result[float, ZeroDivisionError]:
    if b == 0:
        return Result.fail(ZeroDivisionError("0으로 나눌 수 없음"))
    return Result.ok(a / b)

result1 = divide(10, 2)
print(f"10 / 2 = {result1}")
print(f"is_ok: {result1.is_ok()}")
print(f"unwrap: {result1.unwrap()}")
print(f"map(*10): {result1.map(lambda x: x * 10)}")

result2 = divide(10, 0)
print(f"\\n10 / 0 = {result2}")
print(f"is_ok: {result2.is_ok()}")
print(f"unwrap_or(0): {result2.unwrap_or(0)}")

# 체이닝 예제
print("\\n체이닝:")
chained = divide(20, 4).map(lambda x: x + 1).map(lambda x: x * 2)
print(f"(20/4 + 1) * 2 = {chained.unwrap()}")


print("\\n=== Cache 테스트 ===")
cache: Cache[str, int] = Cache(default_ttl=10.0)
cache.set("count", 100, ttl=1.0)  # 1초 TTL
cache.set("total", 500)           # 기본 10초 TTL

print(f"즉시 - count: {cache.get('count')}, total: {cache.get('total')}")
print(f"캐시 크기: {len(cache)}")

print("\\n1.5초 대기...")
time.sleep(1.5)

print(f"1.5초 후 - count: {cache.get('count')}, total: {cache.get('total')}")
print(f"캐시 크기: {len(cache)}")
      `,
      keyPoints: [
        'TypeVar로 제네릭 타입 변수 정의',
        'Generic[T]를 상속받아 제네릭 클래스 구현',
        '@classmethod로 팩토리 메서드 제공',
        '제네릭으로 타입 안전한 API 설계'
      ]
    }
  },
  {
    id: 'union-optional-code',
    type: 'code',
    title: 'Union, Optional, Literal 활용',
    duration: 10,
    content: {
      objectives: [
        'Union으로 다중 타입을 표현한다',
        'Literal로 특정 값만 허용한다',
        'TypeGuard로 타입을 좁힌다'
      ],
      instructions: `
실무에서 자주 사용하는 고급 타입 힌트를 적용합니다.
      `,
      starterCode: `
from typing import Union, Literal, TypeGuard
from dataclasses import dataclass

# === Literal 타입 ===
Status = Literal["pending", "active", "completed", "cancelled"]

@dataclass
class Task:
    id: int
    title: str
    status: Status

def update_status(task: Task, new_status: Status) -> None:
    # TODO: Literal 타입으로 안전하게 상태 변경
    pass


# === Union 타입과 타입 가드 ===
JsonValue = Union[str, int, float, bool, None, list, dict]

def is_string(value: JsonValue) -> TypeGuard[str]:
    # TODO: 타입 가드 구현
    pass

def process_json(value: JsonValue) -> str:
    # TODO: 타입 가드를 사용해 안전하게 처리
    pass


# 테스트
task = Task(1, "테스트", "pending")
update_status(task, "active")
print(f"태스크: {task}")

# 이건 타입 에러여야 함
# update_status(task, "invalid")

print("\\nJSON 처리:")
print(process_json("hello"))
print(process_json(42))
print(process_json({"key": "value"}))
      `,
      solutionCode: `
from typing import Union, Literal, TypeGuard, get_args
from dataclasses import dataclass

# === Literal 타입 ===
# 특정 문자열 값만 허용
Status = Literal["pending", "active", "completed", "cancelled"]

# Literal 값 목록 추출 (런타임 검증에 사용)
VALID_STATUSES = get_args(Status)  # ('pending', 'active', 'completed', 'cancelled')

@dataclass
class Task:
    """할 일 태스크

    💡 status 필드는 4개 값만 허용
    """
    id: int
    title: str
    status: Status


def update_status(task: Task, new_status: Status) -> None:
    """태스크 상태 변경

    🎯 Literal 타입으로 잘못된 상태 방지

    💡 mypy가 컴파일 타임에 잘못된 값 감지:
    update_status(task, "invalid")  # 타입 에러!
    """
    # 런타임 검증 (외부 입력 처리 시)
    if new_status not in VALID_STATUSES:
        raise ValueError(f"Invalid status: {new_status}")
    task.status = new_status
    print(f"✅ 상태 변경: {task.title} → {new_status}")


# === Union 타입과 타입 가드 ===
JsonValue = Union[str, int, float, bool, None, list, dict]


def is_string(value: JsonValue) -> TypeGuard[str]:
    """문자열인지 확인하는 타입 가드

    🎯 역할: mypy에게 타입을 좁혀줌

    💡 TypeGuard[str]를 반환하면,
       True 반환 시 value가 str로 좁혀짐
    """
    return isinstance(value, str)


def is_numeric(value: JsonValue) -> TypeGuard[Union[int, float]]:
    """숫자인지 확인하는 타입 가드"""
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def is_collection(value: JsonValue) -> TypeGuard[Union[list, dict]]:
    """컬렉션인지 확인하는 타입 가드"""
    return isinstance(value, (list, dict))


def process_json(value: JsonValue) -> str:
    """JSON 값을 처리하여 문자열로 변환

    🎯 타입 가드를 사용한 안전한 처리

    💡 타입 가드 후에는 해당 타입의 메서드 사용 가능
    """
    if is_string(value):
        # 여기서 value는 str로 좁혀짐
        return f"문자열: {value.upper()}"

    if is_numeric(value):
        # 여기서 value는 int | float로 좁혀짐
        return f"숫자: {value * 2}"

    if value is None:
        return "NULL"

    if isinstance(value, bool):
        return f"불리언: {value}"

    if is_collection(value):
        # 여기서 value는 list | dict로 좁혀짐
        if isinstance(value, list):
            return f"리스트: {len(value)}개 항목"
        return f"딕셔너리: {list(value.keys())}"

    return f"알 수 없음: {type(value)}"


# === 보너스: Literal Union ===
HttpMethod = Literal["GET", "POST", "PUT", "DELETE", "PATCH"]

def make_request(method: HttpMethod, url: str) -> dict:
    """HTTP 요청 시뮬레이션

    💡 method는 5개 값만 허용
    """
    print(f"📡 {method} {url}")
    return {"method": method, "url": url, "status": 200}


# 테스트
print("=== Literal 타입 테스트 ===")
task = Task(1, "테스트 태스크", "pending")
print(f"초기 상태: {task}")

update_status(task, "active")
update_status(task, "completed")
print(f"최종 상태: {task}")

# 이건 mypy에서 타입 에러! (IDE에서 빨간 줄)
# update_status(task, "invalid")

print("\\n=== Union & TypeGuard 테스트 ===")
test_values: list[JsonValue] = [
    "hello",
    42,
    3.14,
    True,
    None,
    [1, 2, 3],
    {"key": "value"}
]

for val in test_values:
    print(f"  {val!r:20} → {process_json(val)}")

print("\\n=== HTTP Method Literal ===")
make_request("GET", "/api/users")
make_request("POST", "/api/users")
# make_request("INVALID", "/api")  # 타입 에러!
      `,
      keyPoints: [
        'Literal["a", "b"]: 특정 값만 허용',
        'get_args(Literal)로 런타임 검증',
        'TypeGuard[T]: 타입 좁히기 (narrowing)',
        '타입 가드 후에는 해당 타입 메서드 사용 가능'
      ]
    }
  },
  {
    id: 'advanced-typehints-quiz',
    type: 'quiz',
    title: '고급 타입 힌트 퀴즈',
    duration: 5,
    content: {
      objectives: [
        'Generic, Protocol, Literal을 이해했는지 확인한다'
      ],
      questions: [
        {
          question: 'TypeVar(\'T\', int, float)의 의미는?',
          options: [
            'T는 int 또는 float만 될 수 있음',
            'T는 int와 float의 합집합',
            'T는 int이면서 float',
            'T는 숫자 타입'
          ],
          answer: 0,
          explanation: 'TypeVar에 타입을 나열하면 그 타입들만 허용됩니다. T = TypeVar(\'T\', int, float)는 T가 int 또는 float만 될 수 있음을 의미합니다.'
        },
        {
          question: 'Protocol의 특징이 아닌 것은?',
          options: [
            '구조적 타이핑 (덕 타이핑)',
            '명시적 상속 불필요',
            '런타임 타입 체크',
            '메서드 시그니처만 정의'
          ],
          answer: 2,
          explanation: 'Protocol은 정적 타입 체크 도구(mypy)를 위한 것이며, 런타임에는 체크하지 않습니다. isinstance()로 Protocol 체크는 추가 설정이 필요합니다.'
        },
        {
          question: 'TypeGuard의 용도는?',
          options: [
            '타입 에러 무시',
            '함수가 특정 타입을 반환함을 표시',
            '조건문 후 변수 타입을 좁힘',
            '런타임 타입 체크'
          ],
          answer: 2,
          explanation: 'TypeGuard는 조건 분기 후 변수의 타입을 좁히는(narrowing) 역할입니다. if is_string(x): 후에 x는 str로 인식됩니다.'
        }
      ],
      keyPoints: [
        'TypeVar(T, A, B): T는 A 또는 B만',
        'Protocol: 구조적 타이핑 (런타임 아님)',
        'TypeGuard: 조건 후 타입 좁히기'
      ]
    }
  },
  {
    id: 'mypy-setup-video',
    type: 'video',
    title: 'mypy 설치 및 설정 (mypy.ini)',
    duration: 10,
    content: {
      objectives: [
        'mypy를 설치하고 기본 설정을 한다',
        'mypy.ini 설정 파일을 작성한다',
        '점진적으로 타입 체크를 도입한다'
      ],
      transcript: `
## mypy: Python 정적 타입 체커

### 설치

\`\`\`bash
pip install mypy

# 또는 특정 버전
pip install mypy==1.8.0
\`\`\`

### 기본 사용

\`\`\`bash
# 단일 파일
mypy main.py

# 디렉토리
mypy src/

# 패키지
mypy -p mypackage
\`\`\`

### 설정 파일 (mypy.ini)

\`\`\`ini
[mypy]
# Python 버전
python_version = 3.11

# 엄격도 설정
strict = true
warn_return_any = true
warn_unused_ignores = true

# 증분 모드 (빠른 재검사)
incremental = true
cache_dir = .mypy_cache

# 누락된 import 무시 (서드파티 라이브러리)
ignore_missing_imports = true

# 특정 모듈 설정
[mypy-tests.*]
ignore_errors = true

[mypy-migrations.*]
ignore_errors = true
\`\`\`

### 주요 옵션

| 옵션 | 설명 |
|------|------|
| \`--strict\` | 모든 엄격 옵션 활성화 |
| \`--ignore-missing-imports\` | import 오류 무시 |
| \`--show-error-codes\` | 에러 코드 표시 |
| \`--no-implicit-optional\` | 암묵적 Optional 금지 |

### 점진적 도입 전략

\`\`\`
1. ignore_missing_imports = true로 시작
2. 새 코드부터 타입 힌트 추가
3. 기존 코드는 # type: ignore로 임시 무시
4. 점진적으로 타입 힌트 적용 범위 확대
5. 최종적으로 strict = true 목표
\`\`\`

### 인라인 무시

\`\`\`python
# mypy 오류 무시
x = some_untyped_function()  # type: ignore

# 특정 에러만 무시
y = cast(str, value)  # type: ignore[redundant-cast]
\`\`\`

### 핵심 메시지

> "mypy는 **점진적 타이핑**을 지원합니다. 처음부터 완벽할 필요 없이, 조금씩 타입 커버리지를 높여가세요."
      `,
      keyPoints: [
        'pip install mypy로 설치',
        'mypy.ini로 프로젝트별 설정',
        '--strict: 최대 엄격 모드',
        '# type: ignore로 개별 오류 무시'
      ]
    }
  },
  {
    id: 'mypy-apply-code',
    type: 'code',
    title: '기존 코드에 mypy 적용 및 오류 수정',
    duration: 15,
    content: {
      objectives: [
        '타입 힌트 없는 코드에 mypy를 적용한다',
        'mypy 오류를 분석하고 수정한다',
        '점진적으로 타입 안전성을 높인다'
      ],
      instructions: `
타입 힌트가 없는 레거시 코드에 타입을 추가하고 mypy 오류를 수정합니다.
      `,
      starterCode: `
# 이 코드에 타입 힌트를 추가하고 mypy 오류를 수정하세요
# mypy를 실행하면 여러 오류가 발생할 것입니다

class Database:
    def __init__(self, host, port=5432):
        self.host = host
        self.port = port
        self.connected = False
        self.data = {}

    def connect(self):
        self.connected = True
        return True

    def disconnect(self):
        self.connected = False

    def query(self, sql):
        if not self.connected:
            return None
        # 시뮬레이션
        return [{"id": 1, "name": "test"}]

    def insert(self, table, data):
        if table not in self.data:
            self.data[table] = []
        self.data[table].append(data)
        return len(self.data[table])


def process_results(results):
    if results is None:
        return []
    return [r["name"] for r in results]


def main():
    db = Database("localhost")
    db.connect()

    results = db.query("SELECT * FROM users")
    names = process_results(results)
    print(names)

    count = db.insert("users", {"id": 2, "name": "Alice"})
    print(f"Inserted, total: {count}")

    db.disconnect()


if __name__ == "__main__":
    main()
      `,
      solutionCode: `
from typing import Optional, Any
from dataclasses import dataclass, field


@dataclass
class Database:
    """데이터베이스 연결 시뮬레이션

    🎯 역할: DB 연결, 쿼리, 삽입 시뮬레이션

    💡 타입 힌트 추가 포인트:
    - 생성자 인자
    - 메서드 반환 타입
    - 내부 상태 타입
    """
    host: str
    port: int = 5432
    connected: bool = field(default=False, init=False)
    data: dict[str, list[dict[str, Any]]] = field(default_factory=dict, init=False)

    def connect(self) -> bool:
        """DB 연결

        Returns:
            bool: 항상 True (시뮬레이션)
        """
        self.connected = True
        return True

    def disconnect(self) -> None:
        """DB 연결 해제"""
        self.connected = False

    def query(self, sql: str) -> Optional[list[dict[str, Any]]]:
        """SQL 쿼리 실행

        Args:
            sql: SQL 쿼리 문자열

        Returns:
            Optional[list[dict]]: 결과 또는 None (연결 안됨)

        💡 Optional 반환 = 호출자가 None 체크 필요
        """
        if not self.connected:
            return None
        # 시뮬레이션: 항상 같은 결과
        return [{"id": 1, "name": "test"}]

    def insert(self, table: str, data: dict[str, Any]) -> int:
        """데이터 삽입

        Args:
            table: 테이블 이름
            data: 삽입할 데이터

        Returns:
            int: 현재 테이블의 총 레코드 수
        """
        if table not in self.data:
            self.data[table] = []
        self.data[table].append(data)
        return len(self.data[table])


def process_results(results: Optional[list[dict[str, Any]]]) -> list[str]:
    """쿼리 결과에서 이름 추출

    Args:
        results: 쿼리 결과 (None 가능)

    Returns:
        list[str]: 이름 리스트

    💡 None 체크 후 리스트 컴프리헨션
    """
    if results is None:
        return []

    names: list[str] = []
    for r in results:
        name = r.get("name")
        if isinstance(name, str):  # 타입 가드
            names.append(name)
    return names


def main() -> None:
    """메인 함수

    💡 반환값 없는 함수도 -> None 명시
    """
    db = Database("localhost")
    db.connect()

    results = db.query("SELECT * FROM users")
    names = process_results(results)
    print(f"Names: {names}")

    count = db.insert("users", {"id": 2, "name": "Alice"})
    print(f"Inserted, total: {count}")

    db.disconnect()


if __name__ == "__main__":
    main()


# === mypy 검증용 테스트 ===
def test_types() -> None:
    """타입 체크 테스트

    💡 mypy가 이 함수들의 타입을 검증
    """
    db = Database("localhost", 3306)

    # 연결 전 쿼리 → None 반환
    result = db.query("SELECT 1")
    assert result is None

    # 연결 후 쿼리
    db.connect()
    result = db.query("SELECT 1")
    assert result is not None  # 타입 좁히기

    # 결과 처리
    names = process_results(result)
    assert isinstance(names, list)

    # 삽입
    count = db.insert("test", {"x": 1})
    assert isinstance(count, int)

    print("✅ 모든 타입 테스트 통과")


test_types()
      `,
      keyPoints: [
        '@dataclass로 __init__ 타입 힌트 간소화',
        'Optional[T]: None 반환 가능성 명시',
        'dict[str, Any]: 동적 구조의 딕셔너리',
        '-> None: 반환값 없는 함수도 명시'
      ]
    }
  },
  {
    id: 'mypy-quiz',
    type: 'quiz',
    title: 'mypy 퀴즈',
    duration: 5,
    content: {
      objectives: [
        'mypy 사용법을 이해했는지 확인한다'
      ],
      questions: [
        {
          question: 'mypy --strict 옵션의 효과는?',
          options: [
            '런타임 타입 체크 활성화',
            '모든 엄격 타입 체크 옵션 활성화',
            '타입 힌트 자동 생성',
            '타입 오류 자동 수정'
          ],
          answer: 1,
          explanation: '--strict는 warn_return_any, disallow_untyped_defs 등 모든 엄격 옵션을 활성화합니다. 새 프로젝트에서 권장됩니다.'
        },
        {
          question: '# type: ignore 주석의 역할은?',
          options: [
            '타입 힌트 삭제',
            '해당 줄의 mypy 오류 무시',
            '런타임 타입 체크 비활성화',
            '타입 변환'
          ],
          answer: 1,
          explanation: '# type: ignore를 줄 끝에 추가하면 mypy가 해당 줄의 타입 오류를 무시합니다. 점진적 마이그레이션에 유용합니다.'
        },
        {
          question: '서드파티 라이브러리의 타입 힌트가 없을 때 해결 방법이 아닌 것은?',
          options: [
            'ignore_missing_imports = true',
            'types-* 패키지 설치 (예: types-requests)',
            '직접 stub 파일 작성',
            'mypy 삭제'
          ],
          answer: 3,
          explanation: '서드파티 라이브러리의 타입 힌트가 없으면: 1) ignore_missing_imports로 무시, 2) types-* 패키지 설치, 3) 직접 .pyi stub 작성 등의 방법이 있습니다.'
        }
      ],
      keyPoints: [
        '--strict: 모든 엄격 옵션 활성화',
        '# type: ignore: 개별 오류 무시',
        'types-* 패키지로 서드파티 타입 지원'
      ]
    }
  },
  {
    id: 'full-typehints-challenge',
    type: 'code',
    title: '🏆 Daily Challenge: 완전 타입 힌트 적용',
    duration: 30,
    content: {
      objectives: [
        'Day 1-3의 코드에 타입 힌트를 적용한다',
        'mypy --strict를 통과하도록 수정한다',
        '제네릭과 Protocol을 활용한다'
      ],
      instructions: `
## 🏆 Daily Challenge

Day 1-3에서 작성한 코드에 완전한 타입 힌트를 적용하세요.

### 목표
1. 모든 함수에 인자/반환 타입 명시
2. 제네릭을 사용한 재사용 가능한 타입
3. Protocol로 덕 타이핑 정적 표현
4. mypy --strict 통과
      `,
      starterCode: `
# Day 1-3의 핵심 코드를 타입 힌트로 완전히 정의하세요

from typing import (
    TypeVar, Generic, Protocol, Iterator,
    Callable, Optional, Any
)
from contextlib import contextmanager
from functools import wraps
import time

T = TypeVar('T')
R = TypeVar('R')

# === 과제 1: 타입이 있는 제너레이터 ===
# fibonacci()에 완전한 타입 힌트 적용

def fibonacci():  # TODO: 타입 추가
    pass


# === 과제 2: 타입이 있는 데코레이터 ===
# retry 데코레이터에 완전한 타입 힌트 적용

def retry(max_attempts, delay):  # TODO: 타입 추가
    pass


# === 과제 3: 타입이 있는 컨텍스트 매니저 ===
# timer 컨텍스트 매니저에 타입 힌트 적용

@contextmanager
def timer(label):  # TODO: 타입 추가
    pass


# === 과제 4: Protocol 정의 ===
# "closeable" 프로토콜 정의

class Closeable(Protocol):
    # TODO: close() 메서드 정의
    pass


def safe_close(resource):  # TODO: Closeable 사용
    pass


# 테스트
print("=== 피보나치 ===")
fib = fibonacci()
for i, n in enumerate(fib):
    if i >= 10:
        break
    print(n, end=" ")
print()

print("\\n=== 타이머 ===")
with timer("슬립"):
    time.sleep(0.1)
      `,
      solutionCode: `
from typing import (
    TypeVar, Generic, Protocol, Iterator, Generator,
    Callable, Optional, Any, ParamSpec, Concatenate
)
from contextlib import contextmanager
from functools import wraps
import time

T = TypeVar('T')
R = TypeVar('R')
P = ParamSpec('P')  # Python 3.10+


# === 과제 1: 타입이 있는 제너레이터 ===

def fibonacci() -> Generator[int, None, None]:
    """무한 피보나치 수열 제너레이터

    🎯 Generator[YieldType, SendType, ReturnType]
    - YieldType: yield하는 타입 (int)
    - SendType: send()로 받는 타입 (None = 안 받음)
    - ReturnType: return하는 타입 (None = 안 함)

    Yields:
        int: 피보나치 수
    """
    a: int = 0
    b: int = 1
    while True:
        yield a
        a, b = b, a + b


def chunked(
    iterable: Iterator[T],
    size: int
) -> Generator[list[T], None, None]:
    """제네릭 청크 제너레이터

    💡 TypeVar T로 입력 타입을 보존
    """
    chunk: list[T] = []
    for item in iterable:
        chunk.append(item)
        if len(chunk) >= size:
            yield chunk
            chunk = []
    if chunk:
        yield chunk


# === 과제 2: 타입이 있는 데코레이터 ===

def retry(
    max_attempts: int = 3,
    delay: float = 1.0
) -> Callable[[Callable[P, R]], Callable[P, R]]:
    """재시도 데코레이터 (완전 타입)

    🎯 ParamSpec으로 원본 함수 시그니처 보존

    💡 타입 구조:
    - Callable[P, R]: 원본 함수 타입
    - 반환: 같은 시그니처의 함수

    Args:
        max_attempts: 최대 시도 횟수
        delay: 재시도 간격 (초)

    Returns:
        데코레이터 함수
    """
    def decorator(func: Callable[P, R]) -> Callable[P, R]:
        @wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            last_exception: Optional[Exception] = None
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_attempts:
                        time.sleep(delay)
            raise last_exception  # type: ignore[misc]
        return wrapper
    return decorator


# === 과제 3: 타입이 있는 컨텍스트 매니저 ===

@contextmanager
def timer(label: str = "작업") -> Generator[None, None, None]:
    """실행 시간 측정 컨텍스트 매니저

    🎯 Generator[YieldType, SendType, ReturnType]
    - YieldType: None (값 없음)
    - SendType: None
    - ReturnType: None

    Args:
        label: 출력 라벨

    Yields:
        None
    """
    start: float = time.perf_counter()
    try:
        yield
    finally:
        elapsed: float = time.perf_counter() - start
        print(f"⏱️ {label}: {elapsed:.4f}초")


@contextmanager
def managed_resource(
    acquire: Callable[[], T],
    release: Callable[[T], None]
) -> Generator[T, None, None]:
    """제네릭 리소스 관리 컨텍스트 매니저

    💡 acquire/release 콜백으로 범용 리소스 관리

    Args:
        acquire: 리소스 획득 함수
        release: 리소스 해제 함수

    Yields:
        T: 획득한 리소스
    """
    resource: T = acquire()
    try:
        yield resource
    finally:
        release(resource)


# === 과제 4: Protocol 정의 ===

class Closeable(Protocol):
    """close() 메서드가 있는 객체 프로토콜

    🎯 구조적 타이핑: 상속 없이 close()만 있으면 됨
    """
    def close(self) -> None: ...


class Flushable(Protocol):
    """flush() 메서드가 있는 객체 프로토콜"""
    def flush(self) -> None: ...


class Resource(Closeable, Flushable, Protocol):
    """닫고 플러시할 수 있는 리소스"""
    pass


def safe_close(resource: Closeable) -> None:
    """리소스를 안전하게 닫기

    Args:
        resource: Closeable 프로토콜을 만족하는 객체

    💡 어떤 클래스든 close() 메서드만 있으면 사용 가능
    """
    try:
        resource.close()
        print("✅ 리소스 닫힘")
    except Exception as e:
        print(f"⚠️ 닫기 실패: {e}")


def safe_cleanup(resource: Resource) -> None:
    """리소스를 플러시 후 닫기"""
    resource.flush()
    resource.close()


# === 테스트용 클래스 ===

class MockFile:
    """파일 시뮬레이션 (Closeable, Flushable 만족)"""
    def __init__(self, name: str) -> None:
        self.name = name
        self.closed = False

    def close(self) -> None:
        self.closed = True
        print(f"파일 닫힘: {self.name}")

    def flush(self) -> None:
        print(f"버퍼 플러시: {self.name}")


# 테스트
print("=== 피보나치 ===")
fib = fibonacci()
for i, n in enumerate(fib):
    if i >= 10:
        break
    print(n, end=" ")
print()

print("\\n=== 청크 ===")
numbers = iter(range(1, 11))
for chunk in chunked(numbers, 3):
    print(chunk)

print("\\n=== 타이머 ===")
with timer("슬립"):
    time.sleep(0.1)

print("\\n=== 재시도 ===")
attempt_count = 0

@retry(max_attempts=3, delay=0.1)
def flaky_function() -> str:
    global attempt_count
    attempt_count += 1
    if attempt_count < 3:
        raise ConnectionError("연결 실패")
    return "성공!"

print(flaky_function())

print("\\n=== Protocol ===")
mock_file = MockFile("test.txt")
safe_close(mock_file)  # MockFile은 Closeable 프로토콜 만족

print("\\n=== 제네릭 리소스 관리 ===")
with managed_resource(
    acquire=lambda: MockFile("managed.txt"),
    release=lambda f: f.close()
) as f:
    print(f"리소스 사용 중: {f.name}")
      `,
      keyPoints: [
        'Generator[Yield, Send, Return]: 제너레이터 완전 타입',
        'ParamSpec: 데코레이터 시그니처 보존',
        'Protocol: 구조적 타이핑 (덕 타이핑)',
        'TypeVar + Generic으로 재사용 가능한 타입'
      ]
    }
  }
]
