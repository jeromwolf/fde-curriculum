// Day 5: Weekly Project - 로깅 & 캐싱 시스템
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'project-requirements-reading',
    type: 'reading',
    title: '프로젝트 요구사항 분석',
    duration: 15,
    content: {
      objectives: [
        '주간 프로젝트의 전체 구조를 파악한다',
        '구현할 기능의 상세 요구사항을 이해한다',
        '평가 기준을 확인한다'
      ],
      markdown: `
# Weekly Project: 로깅 & 캐싱 시스템

## 🎯 프로젝트 개요

이번 주에 학습한 **이터레이터, 데코레이터, 컨텍스트 매니저, 타입 힌트**를 종합하여 실무에서 바로 사용할 수 있는 로깅 & 캐싱 시스템을 구축합니다.

## 📋 구현 기능

### 1. 로깅 시스템 (logging_system.py)

\`\`\`
📁 기능:
├── @log 데코레이터: 함수 실행 로깅
├── LogLevel: DEBUG, INFO, WARNING, ERROR
├── LogEntry: 로그 엔트리 데이터 클래스
├── LogBuffer: 제너레이터 기반 로그 버퍼
└── LogContext: 컨텍스트 매니저로 로그 스코프 관리
\`\`\`

**요구사항:**
- 로그 레벨 필터링
- 함수 인자/반환값 선택적 로깅
- 실행 시간 측정
- 버퍼 기반 배치 출력
- 컨텍스트 정보 (request_id 등) 자동 추가

### 2. 캐싱 시스템 (caching_system.py)

\`\`\`
📁 기능:
├── @cache 데코레이터: 함수 결과 캐싱
├── CacheEntry: TTL 지원 캐시 엔트리
├── CacheBackend (Protocol): 백엔드 인터페이스
├── MemoryCache: 인메모리 캐시 구현
└── CacheStats: 캐시 통계 (히트율 등)
\`\`\`

**요구사항:**
- TTL (Time To Live) 지원
- LRU 정책 (maxsize 초과 시)
- 캐시 통계 (hits, misses, hit_rate)
- 타입 안전한 제네릭 구현
- 캐시 무효화 API

### 3. 통합 (integration.py)

두 시스템을 결합하여 사용:
\`\`\`python
@log(level="DEBUG", include_args=True)
@cache(ttl=60, maxsize=100)
def expensive_computation(x: int, y: int) -> int:
    ...
\`\`\`

## 📊 평가 기준

| 항목 | 배점 | 기준 |
|------|------|------|
| **기능 구현** | 40% | 모든 요구사항 충족 |
| **타입 힌트** | 20% | mypy --strict 통과 |
| **코드 품질** | 20% | 가독성, 모듈화, 문서화 |
| **테스트** | 20% | 주요 케이스 테스트 코드 |

## 🚀 제출물

\`\`\`
weekly_project/
├── logging_system.py    # 로깅 시스템
├── caching_system.py    # 캐싱 시스템
├── integration.py       # 통합 예제
├── test_logging.py      # 로깅 테스트
├── test_caching.py      # 캐싱 테스트
└── README.md            # 사용 설명서
\`\`\`

## ⏰ 예상 소요 시간

| 태스크 | 시간 |
|--------|------|
| 로깅 시스템 구현 | 45분 |
| 캐싱 시스템 구현 | 45분 |
| 통합 및 테스트 | 30분 |
| 타입 힌트 적용 | 30분 |
| 문서화 | 30분 |
| **총** | **3시간** |
      `,
      keyPoints: [
        '이터레이터 + 데코레이터 + 컨텍스트 매니저 + 타입 힌트 종합',
        '로깅: @log 데코레이터, LogBuffer 제너레이터',
        '캐싱: @cache 데코레이터, TTL, LRU 정책',
        'mypy --strict 통과 필수'
      ]
    }
  },
  {
    id: 'logging-system-code',
    type: 'code',
    title: '로깅 시스템 구현',
    duration: 45,
    content: {
      objectives: [
        '데코레이터 기반 로깅 시스템을 구현한다',
        '제너레이터로 효율적인 로그 버퍼를 만든다',
        '컨텍스트 매니저로 로그 스코프를 관리한다'
      ],
      instructions: `
Week 1에서 배운 모든 개념을 활용하여 로깅 시스템을 구현합니다.

## 핵심 컴포넌트
1. LogLevel 열거형
2. LogEntry 데이터 클래스
3. @log 데코레이터
4. LogBuffer 제너레이터
5. LogContext 컨텍스트 매니저
      `,
      starterCode: `
from __future__ import annotations
from typing import TypeVar, Callable, Optional, Iterator, Any
from dataclasses import dataclass, field
from datetime import datetime
from enum import IntEnum
from functools import wraps
from contextlib import contextmanager
import threading

# === LogLevel ===
class LogLevel(IntEnum):
    DEBUG = 10
    INFO = 20
    WARNING = 30
    ERROR = 40


# === LogEntry ===
@dataclass
class LogEntry:
    """로그 엔트리"""
    timestamp: datetime
    level: LogLevel
    message: str
    # TODO: 추가 필드 (func_name, args, elapsed 등)


# === LogBuffer ===
class LogBuffer:
    """제너레이터 기반 로그 버퍼

    TODO:
    - 로그 추가 (add)
    - 플러시 (flush) - 제너레이터로 반환
    - 레벨 필터링
    """
    pass


# === @log 데코레이터 ===
def log(
    level: str = "INFO",
    include_args: bool = True,
    include_result: bool = False
):
    """함수 실행 로깅 데코레이터

    TODO:
    - 함수 호출 시 로그
    - 실행 시간 측정
    - 예외 발생 시 ERROR 로그
    """
    pass


# === LogContext ===
@contextmanager
def log_context(**context_data):
    """로그 컨텍스트 관리

    TODO:
    - 컨텍스트 데이터 (request_id 등) 설정
    - 스레드 로컬 저장
    - 중첩 지원
    """
    pass


# 테스트
buffer = LogBuffer(min_level=LogLevel.INFO)

@log(level="INFO", include_args=True)
def calculate(x: int, y: int) -> int:
    return x + y

with log_context(request_id="req-123", user="alice"):
    result = calculate(10, 20)
    print(f"결과: {result}")

print("\\n로그 출력:")
for entry in buffer.flush():
    print(f"[{entry.level.name}] {entry.message}")
      `,
      solutionCode: `
from __future__ import annotations
from typing import TypeVar, Callable, Optional, Iterator, Any, ParamSpec
from dataclasses import dataclass, field
from datetime import datetime
from enum import IntEnum
from functools import wraps
from contextlib import contextmanager
import threading
import time

P = ParamSpec('P')
R = TypeVar('R')


# === LogLevel ===
class LogLevel(IntEnum):
    """로그 레벨 열거형

    💡 IntEnum으로 비교 연산 지원
    """
    DEBUG = 10
    INFO = 20
    WARNING = 30
    ERROR = 40

    @classmethod
    def from_string(cls, name: str) -> 'LogLevel':
        """문자열에서 LogLevel로 변환"""
        return cls[name.upper()]


# === LogEntry ===
@dataclass
class LogEntry:
    """로그 엔트리 데이터 클래스

    🎯 역할: 단일 로그 이벤트의 모든 정보 저장
    """
    timestamp: datetime
    level: LogLevel
    message: str
    func_name: Optional[str] = None
    args: Optional[tuple] = None
    kwargs: Optional[dict] = None
    result: Optional[Any] = None
    elapsed_ms: Optional[float] = None
    context: dict[str, Any] = field(default_factory=dict)
    exception: Optional[Exception] = None

    def format(self) -> str:
        """로그 포맷팅"""
        parts = [
            f"[{self.timestamp.strftime('%H:%M:%S.%f')[:-3]}]",
            f"[{self.level.name:7}]",
        ]

        if self.context:
            ctx_str = " ".join(f"{k}={v}" for k, v in self.context.items())
            parts.append(f"[{ctx_str}]")

        parts.append(self.message)

        if self.elapsed_ms is not None:
            parts.append(f"({self.elapsed_ms:.2f}ms)")

        return " ".join(parts)


# === 스레드 로컬 컨텍스트 ===
_context_stack: threading.local = threading.local()


def _get_current_context() -> dict[str, Any]:
    """현재 컨텍스트 가져오기"""
    if not hasattr(_context_stack, 'stack'):
        _context_stack.stack = [{}]
    return _context_stack.stack[-1].copy()


# === LogBuffer ===
class LogBuffer:
    """제너레이터 기반 로그 버퍼

    🎯 역할: 로그 수집 및 배치 출력

    💡 제너레이터로 메모리 효율적 처리
    """

    def __init__(
        self,
        min_level: LogLevel = LogLevel.DEBUG,
        max_size: int = 1000
    ) -> None:
        self._entries: list[LogEntry] = []
        self._min_level = min_level
        self._max_size = max_size
        self._lock = threading.Lock()

    def add(self, entry: LogEntry) -> None:
        """로그 엔트리 추가"""
        if entry.level < self._min_level:
            return

        with self._lock:
            self._entries.append(entry)
            # 버퍼 오버플로우 방지
            if len(self._entries) > self._max_size:
                self._entries.pop(0)

    def flush(self) -> Iterator[LogEntry]:
        """버퍼 플러시 (제너레이터)

        💡 yield로 메모리 효율적 처리
        """
        with self._lock:
            entries = self._entries.copy()
            self._entries.clear()

        for entry in entries:
            yield entry

    def __len__(self) -> int:
        return len(self._entries)


# 전역 버퍼
_global_buffer: Optional[LogBuffer] = None


def get_buffer() -> LogBuffer:
    """전역 로그 버퍼 가져오기"""
    global _global_buffer
    if _global_buffer is None:
        _global_buffer = LogBuffer()
    return _global_buffer


# === @log 데코레이터 ===
def log(
    level: str = "INFO",
    include_args: bool = True,
    include_result: bool = False,
    buffer: Optional[LogBuffer] = None
) -> Callable[[Callable[P, R]], Callable[P, R]]:
    """함수 실행 로깅 데코레이터

    🎯 역할: 함수 호출, 결과, 예외 자동 로깅

    Args:
        level: 로그 레벨 (DEBUG, INFO, WARNING, ERROR)
        include_args: 함수 인자 로깅 여부
        include_result: 반환값 로깅 여부
        buffer: 로그 버퍼 (None이면 전역 버퍼)

    Returns:
        데코레이터 함수
    """
    log_level = LogLevel.from_string(level)
    target_buffer = buffer or get_buffer()

    def decorator(func: Callable[P, R]) -> Callable[P, R]:
        @wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            func_name = func.__name__
            context = _get_current_context()
            start_time = time.perf_counter()

            # 호출 로그
            if include_args:
                msg = f"{func_name}({args}, {kwargs})"
            else:
                msg = f"{func_name}()"

            try:
                result = func(*args, **kwargs)
                elapsed = (time.perf_counter() - start_time) * 1000

                # 성공 로그
                entry = LogEntry(
                    timestamp=datetime.now(),
                    level=log_level,
                    message=f"{msg} → {result if include_result else 'OK'}",
                    func_name=func_name,
                    args=args if include_args else None,
                    kwargs=kwargs if include_args else None,
                    result=result if include_result else None,
                    elapsed_ms=elapsed,
                    context=context
                )
                target_buffer.add(entry)
                return result

            except Exception as e:
                elapsed = (time.perf_counter() - start_time) * 1000

                # 에러 로그
                entry = LogEntry(
                    timestamp=datetime.now(),
                    level=LogLevel.ERROR,
                    message=f"{msg} → ERROR: {e}",
                    func_name=func_name,
                    args=args if include_args else None,
                    elapsed_ms=elapsed,
                    context=context,
                    exception=e
                )
                target_buffer.add(entry)
                raise

        return wrapper
    return decorator


# === LogContext ===
@contextmanager
def log_context(**context_data: Any) -> Iterator[dict[str, Any]]:
    """로그 컨텍스트 관리

    🎯 역할: 컨텍스트 데이터를 로그에 자동 추가

    💡 중첩 지원: 내부 컨텍스트가 외부 컨텍스트 상속

    Args:
        **context_data: 컨텍스트 키-값 쌍 (request_id, user 등)

    Yields:
        현재 컨텍스트 딕셔너리
    """
    if not hasattr(_context_stack, 'stack'):
        _context_stack.stack = [{}]

    # 현재 컨텍스트에 새 데이터 병합
    current = _context_stack.stack[-1].copy()
    current.update(context_data)
    _context_stack.stack.append(current)

    try:
        yield current
    finally:
        _context_stack.stack.pop()


# === 테스트 ===
if __name__ == "__main__":
    buffer = LogBuffer(min_level=LogLevel.DEBUG)

    @log(level="INFO", include_args=True, include_result=True, buffer=buffer)
    def calculate(x: int, y: int) -> int:
        """두 수를 더하는 함수"""
        return x + y

    @log(level="DEBUG", include_args=False, buffer=buffer)
    def risky_operation() -> str:
        """실패할 수 있는 작업"""
        import random
        if random.random() < 0.5:
            raise ValueError("랜덤 에러!")
        return "성공"

    print("=== 로깅 시스템 테스트 ===\\n")

    # 기본 테스트
    result = calculate(10, 20)
    print(f"계산 결과: {result}")

    # 컨텍스트 테스트
    with log_context(request_id="req-123", user="alice"):
        result = calculate(5, 3)
        print(f"컨텍스트 내 결과: {result}")

        # 중첩 컨텍스트
        with log_context(action="checkout"):
            result = calculate(100, 50)
            print(f"중첩 컨텍스트 결과: {result}")

    # 에러 테스트
    for i in range(3):
        try:
            risky_operation()
        except ValueError:
            pass

    # 로그 출력
    print("\\n=== 수집된 로그 ===")
    for entry in buffer.flush():
        print(entry.format())
      `,
      keyPoints: [
        'LogLevel: IntEnum으로 비교 연산 지원',
        '@log: ParamSpec으로 시그니처 보존',
        'LogBuffer: 제너레이터로 메모리 효율적 플러시',
        'log_context: 스레드 로컬 스택으로 중첩 지원'
      ]
    }
  },
  {
    id: 'caching-system-code',
    type: 'code',
    title: '캐싱 시스템 구현 (TTL 지원)',
    duration: 45,
    content: {
      objectives: [
        'TTL 기반 캐시를 구현한다',
        'LRU 정책을 적용한다',
        '제네릭으로 타입 안전한 캐시를 만든다'
      ],
      instructions: `
데코레이터와 제네릭을 활용하여 캐싱 시스템을 구현합니다.

## 핵심 컴포넌트
1. CacheEntry: TTL 지원 캐시 엔트리
2. CacheBackend (Protocol): 백엔드 인터페이스
3. MemoryCache: 인메모리 LRU 캐시
4. @cache 데코레이터
5. CacheStats: 캐시 통계
      `,
      starterCode: `
from __future__ import annotations
from typing import TypeVar, Generic, Protocol, Callable, Optional, Any
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from collections import OrderedDict
from functools import wraps
import threading
import hashlib
import json

K = TypeVar('K')
V = TypeVar('V')


# === CacheEntry ===
@dataclass
class CacheEntry(Generic[V]):
    """TTL 지원 캐시 엔트리

    TODO:
    - value: 캐시된 값
    - expires_at: 만료 시간
    - is_expired(): 만료 여부
    """
    pass


# === CacheBackend Protocol ===
class CacheBackend(Protocol[K, V]):
    """캐시 백엔드 인터페이스

    TODO: Protocol로 백엔드 인터페이스 정의
    """
    pass


# === MemoryCache ===
class MemoryCache(Generic[K, V]):
    """인메모리 LRU 캐시

    TODO:
    - get(key): 값 조회 (만료 시 None)
    - set(key, value, ttl): 값 저장
    - delete(key): 값 삭제
    - clear(): 전체 삭제
    - stats(): 통계 반환
    """
    pass


# === @cache 데코레이터 ===
def cache(ttl: float = 60.0, maxsize: int = 128):
    """함수 결과 캐싱 데코레이터

    TODO:
    - 함수 인자로 캐시 키 생성
    - TTL 지원
    - maxsize 초과 시 LRU 정책
    """
    pass


# 테스트
@cache(ttl=5.0, maxsize=3)
def expensive_computation(x: int, y: int) -> int:
    print(f"  계산 중: {x} + {y}")
    return x + y

print("=== 캐싱 테스트 ===")
print(f"1번째 호출: {expensive_computation(1, 2)}")
print(f"2번째 호출 (캐시): {expensive_computation(1, 2)}")
print(f"다른 인자: {expensive_computation(3, 4)}")
      `,
      solutionCode: `
from __future__ import annotations
from typing import (
    TypeVar, Generic, Protocol, Callable, Optional, Any,
    ParamSpec, runtime_checkable
)
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from collections import OrderedDict
from functools import wraps
import threading
import hashlib
import json
import time

K = TypeVar('K')
V = TypeVar('V')
P = ParamSpec('P')
R = TypeVar('R')


# === CacheEntry ===
@dataclass
class CacheEntry(Generic[V]):
    """TTL 지원 캐시 엔트리

    🎯 역할: 값 + 만료 시간 + 메타데이터

    Attributes:
        value: 캐시된 값
        expires_at: 만료 시간 (None = 무제한)
        created_at: 생성 시간
        hit_count: 조회 횟수
    """
    value: V
    expires_at: Optional[datetime] = None
    created_at: datetime = field(default_factory=datetime.now)
    hit_count: int = 0

    def is_expired(self) -> bool:
        """만료 여부 확인"""
        if self.expires_at is None:
            return False
        return datetime.now() > self.expires_at

    def touch(self) -> None:
        """조회 횟수 증가"""
        self.hit_count += 1


# === CacheStats ===
@dataclass
class CacheStats:
    """캐시 통계

    💡 히트율 = hits / (hits + misses)
    """
    hits: int = 0
    misses: int = 0
    evictions: int = 0
    size: int = 0
    max_size: int = 0

    @property
    def hit_rate(self) -> float:
        """히트율 (0.0 ~ 1.0)"""
        total = self.hits + self.misses
        if total == 0:
            return 0.0
        return self.hits / total

    def __str__(self) -> str:
        return (
            f"CacheStats(hits={self.hits}, misses={self.misses}, "
            f"hit_rate={self.hit_rate:.2%}, size={self.size}/{self.max_size})"
        )


# === CacheBackend Protocol ===
@runtime_checkable
class CacheBackend(Protocol[K, V]):
    """캐시 백엔드 인터페이스

    🎯 역할: 캐시 구현체가 따라야 할 인터페이스

    💡 Protocol로 구조적 타이핑
    """
    def get(self, key: K) -> Optional[V]: ...
    def set(self, key: K, value: V, ttl: Optional[float] = None) -> None: ...
    def delete(self, key: K) -> bool: ...
    def clear(self) -> None: ...
    def stats(self) -> CacheStats: ...


# === MemoryCache ===
class MemoryCache(Generic[K, V]):
    """인메모리 LRU 캐시

    🎯 역할: OrderedDict 기반 LRU 캐시 구현

    💡 특징:
    - TTL 지원
    - LRU 정책 (maxsize 초과 시 오래된 것 제거)
    - 스레드 안전
    """

    def __init__(self, maxsize: int = 128, default_ttl: Optional[float] = None):
        """
        Args:
            maxsize: 최대 엔트리 수
            default_ttl: 기본 TTL (초), None = 무제한
        """
        self._cache: OrderedDict[K, CacheEntry[V]] = OrderedDict()
        self._maxsize = maxsize
        self._default_ttl = default_ttl
        self._lock = threading.RLock()
        self._stats = CacheStats(max_size=maxsize)

    def get(self, key: K) -> Optional[V]:
        """값 조회

        💡 조회 시 LRU 순서 갱신 (move_to_end)
        """
        with self._lock:
            entry = self._cache.get(key)

            if entry is None:
                self._stats.misses += 1
                return None

            if entry.is_expired():
                del self._cache[key]
                self._stats.misses += 1
                self._stats.size = len(self._cache)
                return None

            # LRU 갱신
            self._cache.move_to_end(key)
            entry.touch()
            self._stats.hits += 1
            return entry.value

    def set(
        self,
        key: K,
        value: V,
        ttl: Optional[float] = None
    ) -> None:
        """값 저장

        💡 maxsize 초과 시 가장 오래된 엔트리 제거
        """
        with self._lock:
            # 기존 키 업데이트 시 순서 갱신
            if key in self._cache:
                del self._cache[key]

            # TTL 계산
            actual_ttl = ttl if ttl is not None else self._default_ttl
            expires_at = None
            if actual_ttl is not None:
                expires_at = datetime.now() + timedelta(seconds=actual_ttl)

            # 엔트리 추가
            self._cache[key] = CacheEntry(value=value, expires_at=expires_at)

            # LRU 정책: 초과 시 오래된 것 제거
            while len(self._cache) > self._maxsize:
                self._cache.popitem(last=False)
                self._stats.evictions += 1

            self._stats.size = len(self._cache)

    def delete(self, key: K) -> bool:
        """값 삭제"""
        with self._lock:
            if key in self._cache:
                del self._cache[key]
                self._stats.size = len(self._cache)
                return True
            return False

    def clear(self) -> None:
        """전체 삭제"""
        with self._lock:
            self._cache.clear()
            self._stats.size = 0

    def stats(self) -> CacheStats:
        """통계 반환"""
        with self._lock:
            self._stats.size = len(self._cache)
            return CacheStats(
                hits=self._stats.hits,
                misses=self._stats.misses,
                evictions=self._stats.evictions,
                size=self._stats.size,
                max_size=self._stats.max_size
            )


# === 캐시 키 생성 ===
def make_cache_key(func: Callable, args: tuple, kwargs: dict) -> str:
    """함수 인자로 캐시 키 생성

    💡 인자를 JSON 직렬화 후 해시
    """
    key_parts = [func.__module__, func.__qualname__]

    # args 직렬화
    try:
        key_parts.append(json.dumps(args, sort_keys=True, default=str))
    except TypeError:
        key_parts.append(str(args))

    # kwargs 직렬화
    try:
        key_parts.append(json.dumps(kwargs, sort_keys=True, default=str))
    except TypeError:
        key_parts.append(str(sorted(kwargs.items())))

    key_str = ":".join(key_parts)
    return hashlib.md5(key_str.encode()).hexdigest()


# === @cache 데코레이터 ===
def cache(
    ttl: Optional[float] = 60.0,
    maxsize: int = 128,
    backend: Optional[MemoryCache] = None
) -> Callable[[Callable[P, R]], Callable[P, R]]:
    """함수 결과 캐싱 데코레이터

    🎯 역할: 함수 호출 결과를 자동 캐싱

    Args:
        ttl: TTL (초), None = 무제한
        maxsize: 최대 캐시 크기
        backend: 캐시 백엔드 (None이면 새로 생성)

    Returns:
        데코레이터 함수

    Example:
        @cache(ttl=60, maxsize=100)
        def expensive_func(x: int) -> int:
            return x ** 2
    """
    cache_backend = backend or MemoryCache[str, Any](maxsize=maxsize, default_ttl=ttl)

    def decorator(func: Callable[P, R]) -> Callable[P, R]:
        @wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            # 캐시 키 생성
            key = make_cache_key(func, args, kwargs)

            # 캐시 조회
            cached = cache_backend.get(key)
            if cached is not None:
                return cached  # type: ignore

            # 함수 실행 및 캐시 저장
            result = func(*args, **kwargs)
            cache_backend.set(key, result, ttl)
            return result

        # 캐시 관리 메서드 추가
        wrapper.cache_clear = cache_backend.clear  # type: ignore
        wrapper.cache_stats = cache_backend.stats  # type: ignore
        wrapper.cache_backend = cache_backend  # type: ignore

        return wrapper
    return decorator


# === 테스트 ===
if __name__ == "__main__":
    print("=== 캐싱 시스템 테스트 ===\\n")

    @cache(ttl=5.0, maxsize=3)
    def expensive_computation(x: int, y: int) -> int:
        """비용이 큰 계산 시뮬레이션"""
        print(f"  💻 계산 중: {x} + {y}")
        time.sleep(0.1)  # 시뮬레이션
        return x + y

    # 기본 테스트
    print("1. 기본 캐싱 테스트")
    print(f"  1번째 호출: {expensive_computation(1, 2)}")
    print(f"  2번째 호출 (캐시): {expensive_computation(1, 2)}")
    print(f"  다른 인자: {expensive_computation(3, 4)}")
    print(f"  통계: {expensive_computation.cache_stats()}")

    # LRU 테스트
    print("\\n2. LRU 정책 테스트 (maxsize=3)")
    expensive_computation(5, 6)  # 3번째 엔트리
    expensive_computation(7, 8)  # 4번째 → (1,2) 제거됨
    print(f"  (1,2) 재호출 (캐시 미스):", end=" ")
    expensive_computation(1, 2)  # 다시 계산
    print(f"  통계: {expensive_computation.cache_stats()}")

    # TTL 테스트
    print("\\n3. TTL 테스트 (5초)")

    @cache(ttl=1.0, maxsize=10)
    def short_lived(x: int) -> int:
        print(f"  💻 계산: {x}")
        return x * 2

    print(f"  호출: {short_lived(10)}")
    print(f"  즉시 재호출 (캐시): {short_lived(10)}")
    print("  1.5초 대기...")
    time.sleep(1.5)
    print(f"  TTL 후 재호출 (캐시 미스): {short_lived(10)}")
    print(f"  통계: {short_lived.cache_stats()}")

    # 통계 요약
    print("\\n4. 최종 통계")
    print(f"  expensive_computation: {expensive_computation.cache_stats()}")
    print(f"  short_lived: {short_lived.cache_stats()}")
      `,
      keyPoints: [
        'CacheEntry: 제네릭 + TTL + 메타데이터',
        'MemoryCache: OrderedDict 기반 LRU',
        '@cache: make_cache_key로 인자 해시',
        'CacheStats: 히트율 계산'
      ]
    }
  },
  {
    id: 'integration-code',
    type: 'code',
    title: '통합 및 테스트',
    duration: 30,
    content: {
      objectives: [
        '로깅과 캐싱 시스템을 통합한다',
        '데코레이터 체이닝을 구현한다',
        '실무 시나리오를 테스트한다'
      ],
      instructions: `
로깅과 캐싱 시스템을 결합하여 실무에서 사용할 수 있는 형태로 완성합니다.
      `,
      starterCode: `
# logging_system.py와 caching_system.py를 통합

from typing import Any

# TODO: 두 시스템 import

# 통합 사용 예제
@log(level="DEBUG", include_args=True)
@cache(ttl=60, maxsize=100)
def fetch_user_data(user_id: int) -> dict[str, Any]:
    """사용자 데이터 조회 (DB 시뮬레이션)"""
    print(f"  DB 조회: user_id={user_id}")
    return {"id": user_id, "name": f"User{user_id}", "active": True}


# API 시뮬레이션
def handle_request(request_id: str, user_id: int) -> dict[str, Any]:
    """API 요청 처리"""
    with log_context(request_id=request_id):
        user = fetch_user_data(user_id)
        return {"status": "success", "data": user}


# 테스트
print("=== 통합 테스트 ===")
for i in range(5):
    response = handle_request(f"req-{i}", user_id=i % 2 + 1)
    print(f"응답: {response}")

print("\\n=== 로그 출력 ===")
# 로그 버퍼 플러시

print("\\n=== 캐시 통계 ===")
# 캐시 통계 출력
      `,
      solutionCode: `
"""
통합 모듈: 로깅 & 캐싱 시스템

🎯 역할: 두 시스템을 결합하여 실무에서 사용

💡 데코레이터 체이닝:
@log      → 로깅 (바깥쪽)
@cache    → 캐싱 (안쪽)

캐시 히트 시에도 로깅됨
"""
from __future__ import annotations
from typing import Any, Optional
from dataclasses import dataclass
from datetime import datetime
from contextlib import contextmanager
import time

# === 간소화된 통합 버전 ===

# 로그 레벨
class LogLevel:
    DEBUG = 10
    INFO = 20
    WARNING = 30
    ERROR = 40


# 간단한 로그 저장소
_logs: list[dict[str, Any]] = []
_context: dict[str, Any] = {}


@contextmanager
def log_context(**kwargs: Any):
    """로그 컨텍스트"""
    global _context
    old_context = _context.copy()
    _context.update(kwargs)
    try:
        yield _context
    finally:
        _context = old_context


def log(
    level: str = "INFO",
    include_args: bool = True,
    include_result: bool = False
):
    """로깅 데코레이터"""
    from functools import wraps

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            func_name = func.__name__

            try:
                result = func(*args, **kwargs)
                elapsed = (time.perf_counter() - start) * 1000

                log_entry = {
                    "timestamp": datetime.now().isoformat(),
                    "level": level,
                    "func": func_name,
                    "elapsed_ms": round(elapsed, 2),
                    "context": _context.copy()
                }
                if include_args:
                    log_entry["args"] = str(args)
                if include_result:
                    log_entry["result"] = str(result)

                _logs.append(log_entry)
                return result

            except Exception as e:
                _logs.append({
                    "timestamp": datetime.now().isoformat(),
                    "level": "ERROR",
                    "func": func_name,
                    "error": str(e),
                    "context": _context.copy()
                })
                raise

        return wrapper
    return decorator


def flush_logs():
    """로그 플러시"""
    global _logs
    logs = _logs.copy()
    _logs = []
    return logs


# 간단한 캐시
_cache: dict[str, tuple[Any, float]] = {}


def cache(ttl: float = 60.0, maxsize: int = 128):
    """캐싱 데코레이터"""
    from functools import wraps

    cache_stats = {"hits": 0, "misses": 0}

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{args}:{kwargs}"
            now = time.time()

            # 캐시 조회
            if key in _cache:
                value, expires = _cache[key]
                if now < expires:
                    cache_stats["hits"] += 1
                    return value
                del _cache[key]

            # 캐시 미스
            cache_stats["misses"] += 1
            result = func(*args, **kwargs)

            # LRU: maxsize 초과 시 제거
            if len(_cache) >= maxsize:
                oldest = min(_cache.keys(), key=lambda k: _cache[k][1])
                del _cache[oldest]

            _cache[key] = (result, now + ttl)
            return result

        wrapper.cache_stats = lambda: cache_stats
        wrapper.cache_clear = lambda: _cache.clear()
        return wrapper
    return decorator


# === 통합 사용 예제 ===

@log(level="DEBUG", include_args=True, include_result=True)
@cache(ttl=60, maxsize=100)
def fetch_user_data(user_id: int) -> dict[str, Any]:
    """사용자 데이터 조회 (DB 시뮬레이션)

    💡 캐시 히트 시에도 @log가 기록
    """
    print(f"  📊 DB 조회: user_id={user_id}")
    time.sleep(0.05)  # DB 시뮬레이션
    return {"id": user_id, "name": f"User{user_id}", "active": True}


@log(level="INFO", include_args=True)
def process_order(user_id: int, items: list[str]) -> dict[str, Any]:
    """주문 처리"""
    user = fetch_user_data(user_id)
    return {
        "order_id": f"ORD-{int(time.time())}",
        "user": user["name"],
        "items": items,
        "status": "confirmed"
    }


def handle_request(request_id: str, user_id: int) -> dict[str, Any]:
    """API 요청 처리"""
    with log_context(request_id=request_id):
        user = fetch_user_data(user_id)
        return {"status": "success", "data": user}


# === 테스트 ===
if __name__ == "__main__":
    print("=" * 50)
    print("  로깅 & 캐싱 통합 테스트")
    print("=" * 50)

    # 1. 기본 API 요청 테스트
    print("\\n1. API 요청 테스트 (캐시 효과)")
    for i in range(5):
        response = handle_request(f"req-{i}", user_id=i % 2 + 1)
        print(f"  요청 {i}: user_id={i % 2 + 1} → {response['data']['name']}")

    # 2. 주문 처리 테스트
    print("\\n2. 주문 처리 테스트")
    with log_context(request_id="order-001", client="web"):
        order = process_order(1, ["item-a", "item-b"])
        print(f"  주문 결과: {order}")

    # 3. 캐시 통계
    print("\\n3. 캐시 통계")
    stats = fetch_user_data.cache_stats()
    total = stats["hits"] + stats["misses"]
    hit_rate = stats["hits"] / total if total > 0 else 0
    print(f"  Hits: {stats['hits']}")
    print(f"  Misses: {stats['misses']}")
    print(f"  Hit Rate: {hit_rate:.1%}")

    # 4. 로그 출력
    print("\\n4. 수집된 로그")
    logs = flush_logs()
    for log_entry in logs:
        ctx = log_entry.get("context", {})
        ctx_str = f" [{ctx}]" if ctx else ""
        func = log_entry.get("func", "?")
        elapsed = log_entry.get("elapsed_ms", 0)
        print(f"  [{log_entry['level']:7}]{ctx_str} {func}() - {elapsed:.2f}ms")

    print("\\n" + "=" * 50)
    print("  테스트 완료!")
    print("=" * 50)
      `,
      keyPoints: [
        '데코레이터 체이닝: @log → @cache 순서 중요',
        '컨텍스트 매니저로 요청 스코프 관리',
        '캐시 히트 시에도 로깅됨 (바깥쪽 데코레이터)',
        '실무 패턴: API 요청 → 로깅 → 캐싱 → DB 조회'
      ]
    }
  },
  {
    id: 'typehints-apply-code',
    type: 'code',
    title: 'Type Hints 적용 & mypy 통과',
    duration: 30,
    content: {
      objectives: [
        '전체 코드에 완전한 타입 힌트를 적용한다',
        'mypy --strict를 통과하도록 수정한다',
        '타입 안전성을 검증한다'
      ],
      instructions: `
프로젝트 코드에 완전한 타입 힌트를 적용하고 mypy 검증을 통과합니다.

## 체크리스트
- [ ] 모든 함수에 인자/반환 타입
- [ ] 모든 변수에 타입 (필요시)
- [ ] Protocol 정의 (덕 타이핑)
- [ ] mypy --strict 통과
      `,
      starterCode: `
# 타입 힌트가 완전하지 않은 코드
# mypy --strict를 통과하도록 수정하세요

from contextlib import contextmanager
from functools import wraps
import time

class LogEntry:
    def __init__(self, level, message, timestamp=None):
        self.level = level
        self.message = message
        self.timestamp = timestamp or time.time()


class LogBuffer:
    def __init__(self):
        self.entries = []

    def add(self, entry):
        self.entries.append(entry)

    def flush(self):
        for entry in self.entries:
            yield entry
        self.entries.clear()


def log(level="INFO"):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator


@contextmanager
def timer(label):
    start = time.time()
    yield
    print(f"{label}: {time.time() - start:.4f}s")


# 테스트
buffer = LogBuffer()
buffer.add(LogEntry("INFO", "테스트"))

for entry in buffer.flush():
    print(f"[{entry.level}] {entry.message}")
      `,
      solutionCode: `
"""
타입 힌트가 완전한 버전 - mypy --strict 통과

💡 주요 타입 힌트 패턴:
- Generator[YieldType, SendType, ReturnType]
- ParamSpec으로 데코레이터 시그니처 보존
- Optional[T]로 None 가능 표시
- Protocol로 인터페이스 정의
"""
from __future__ import annotations

from contextlib import contextmanager
from dataclasses import dataclass, field
from functools import wraps
from typing import (
    Any,
    Callable,
    Generator,
    Iterator,
    Optional,
    ParamSpec,
    Protocol,
    TypeVar,
)
import time


P = ParamSpec('P')
R = TypeVar('R')


@dataclass
class LogEntry:
    """로그 엔트리 (완전 타입)

    Attributes:
        level: 로그 레벨 문자열
        message: 로그 메시지
        timestamp: 타임스탬프 (None이면 자동 생성)
    """
    level: str
    message: str
    timestamp: float = field(default_factory=time.time)


class LogBuffer:
    """로그 버퍼 (완전 타입)

    💡 제너레이터 반환 타입: Generator[LogEntry, None, None]
    """

    def __init__(self) -> None:
        self._entries: list[LogEntry] = []

    def add(self, entry: LogEntry) -> None:
        """로그 엔트리 추가"""
        self._entries.append(entry)

    def flush(self) -> Generator[LogEntry, None, None]:
        """버퍼 플러시 (제너레이터)

        Yields:
            LogEntry: 버퍼의 각 로그 엔트리
        """
        entries = self._entries.copy()
        self._entries.clear()
        for entry in entries:
            yield entry

    def __len__(self) -> int:
        return len(self._entries)


def log(
    level: str = "INFO",
    buffer: Optional[LogBuffer] = None
) -> Callable[[Callable[P, R]], Callable[P, R]]:
    """로깅 데코레이터 (완전 타입)

    💡 ParamSpec으로 원본 함수 시그니처 보존

    Args:
        level: 로그 레벨
        buffer: 로그 버퍼 (None이면 출력만)

    Returns:
        데코레이터 함수
    """
    def decorator(func: Callable[P, R]) -> Callable[P, R]:
        @wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            entry = LogEntry(level, f"Calling {func.__name__}")
            if buffer is not None:
                buffer.add(entry)
            result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator


@contextmanager
def timer(label: str) -> Generator[None, None, None]:
    """타이머 컨텍스트 매니저 (완전 타입)

    Args:
        label: 타이머 라벨

    Yields:
        None
    """
    start: float = time.time()
    try:
        yield
    finally:
        elapsed: float = time.time() - start
        print(f"{label}: {elapsed:.4f}s")


# === Protocol 예제 ===
class Loggable(Protocol):
    """로깅 가능한 객체 프로토콜"""
    @property
    def level(self) -> str: ...
    @property
    def message(self) -> str: ...


def print_log(entry: Loggable) -> None:
    """Loggable 프로토콜을 만족하는 객체 출력"""
    print(f"[{entry.level}] {entry.message}")


# === 테스트 ===
if __name__ == "__main__":
    print("=== 타입 안전 로깅 시스템 ===\\n")

    buffer: LogBuffer = LogBuffer()

    @log(level="INFO", buffer=buffer)
    def greet(name: str) -> str:
        return f"Hello, {name}!"

    @log(level="DEBUG", buffer=buffer)
    def calculate(x: int, y: int) -> int:
        return x + y

    # 함수 호출
    print(greet("Alice"))
    print(calculate(10, 20))

    # 타이머 테스트
    with timer("Sleep"):
        time.sleep(0.1)

    # 로그 출력
    print("\\n=== 수집된 로그 ===")
    for entry in buffer.flush():
        print_log(entry)  # Protocol 사용

    print("\\n✅ mypy --strict 통과!")


# === mypy 검증용 타입 테스트 ===
def _type_checks() -> None:
    """타입 체크 (실행 안 됨, mypy용)"""
    # LogEntry 타입 체크
    entry: LogEntry = LogEntry("INFO", "test")
    _level: str = entry.level
    _msg: str = entry.message
    _ts: float = entry.timestamp

    # LogBuffer 타입 체크
    buf: LogBuffer = LogBuffer()
    buf.add(entry)
    _len: int = len(buf)

    # 제너레이터 타입 체크
    gen: Generator[LogEntry, None, None] = buf.flush()
    _first: LogEntry = next(gen)

    # 데코레이터 타입 체크
    @log(level="DEBUG")
    def typed_func(x: int) -> str:
        return str(x)

    _result: str = typed_func(42)

    # 컨텍스트 매니저 타입 체크
    with timer("test"):
        pass
      `,
      keyPoints: [
        'Generator[Yield, Send, Return] 완전 타입',
        'ParamSpec으로 데코레이터 시그니처 보존',
        'Protocol로 구조적 타이핑',
        'mypy --strict 통과 = 프로덕션 레디'
      ]
    }
  },
  {
    id: 'code-review-reading',
    type: 'reading',
    title: '코드 리뷰 체크리스트',
    duration: 15,
    content: {
      objectives: [
        '프로젝트 코드를 자체 리뷰한다',
        '개선점을 파악한다',
        '실무 적용 방안을 고려한다'
      ],
      markdown: `
# 코드 리뷰 체크리스트

## ✅ 기능 완성도

| 항목 | 체크 |
|------|------|
| 로깅 데코레이터 동작 | ☐ |
| 로그 레벨 필터링 | ☐ |
| 로그 컨텍스트 전파 | ☐ |
| 캐시 데코레이터 동작 | ☐ |
| TTL 만료 처리 | ☐ |
| LRU 정책 | ☐ |
| 통합 테스트 통과 | ☐ |

## ✅ 타입 안전성

| 항목 | 체크 |
|------|------|
| 모든 함수에 인자 타입 | ☐ |
| 모든 함수에 반환 타입 | ☐ |
| Generic 적절히 사용 | ☐ |
| Protocol 정의 | ☐ |
| mypy --strict 통과 | ☐ |

## ✅ 코드 품질

| 항목 | 체크 |
|------|------|
| 함수/클래스 docstring | ☐ |
| 의미 있는 변수명 | ☐ |
| 단일 책임 원칙 | ☐ |
| DRY (중복 제거) | ☐ |
| 에러 처리 | ☐ |

## ✅ 성능

| 항목 | 체크 |
|------|------|
| 스레드 안전 | ☐ |
| 메모리 누수 없음 | ☐ |
| 불필요한 복사 없음 | ☐ |
| 제너레이터 활용 | ☐ |

## 📝 개선 아이디어

1. **확장성**
   - Redis 캐시 백엔드 추가
   - 파일/원격 로그 핸들러

2. **기능**
   - 캐시 워밍업
   - 로그 샘플링

3. **모니터링**
   - 메트릭 수집
   - 대시보드 연동

## 🚀 실무 적용

\`\`\`python
# FastAPI와 통합
from fastapi import FastAPI, Request

app = FastAPI()

@app.middleware("http")
async def log_middleware(request: Request, call_next):
    with log_context(
        request_id=request.headers.get("x-request-id"),
        path=request.url.path
    ):
        response = await call_next(request)
        return response

@app.get("/users/{user_id}")
@log(level="INFO")
@cache(ttl=300)
async def get_user(user_id: int):
    return await db.fetch_user(user_id)
\`\`\`

## 🎓 학습 포인트 정리

### 이터레이터 & 제너레이터
- yield로 메모리 효율적 처리
- yield from으로 위임
- 무한 시퀀스 표현

### 데코레이터
- 클로저로 상태 유지
- functools.wraps로 메타데이터 보존
- 팩토리 패턴으로 인자 받기

### 컨텍스트 매니저
- __enter__/__exit__ 또는 @contextmanager
- 리소스 자동 정리
- 중첩 및 ExitStack

### Type Hints
- 기본 타입, Union, Optional
- Generic, TypeVar, Protocol
- mypy로 정적 분석

## 🏆 완료!

Week 1 Python 심화 과정을 완료했습니다.

다음 주제: **SQL 기초 & pandas**
      `,
      keyPoints: [
        '기능 완성도, 타입 안전성, 코드 품질 점검',
        'FastAPI 등 실무 프레임워크와 통합 방법',
        'Week 1에서 배운 4가지 핵심 개념 정리',
        '다음 Week로 진행 준비'
      ]
    }
  },
  {
    id: 'project-challenge',
    type: 'challenge',
    title: '주간 도전과제: 고급 Python 라이브러리 구현',
    duration: 60,
    content: {
      instructions: `# 주간 도전과제: 고급 Python 라이브러리 구현

## 목표
이번 주에 배운 **이터레이터, 데코레이터, 컨텍스트 매니저, 타입 힌트**를 활용하여 실무에서 바로 사용할 수 있는 **Rate Limiter 라이브러리**를 구현하세요.

## 도전 과제: Rate Limiter 라이브러리

API 호출 속도 제한을 위한 라이브러리를 구현합니다.

### 평가 기준

#### 1. @rate_limit 데코레이터 (30점)
| 요구사항 | 점수 |
|---------|------|
| 초당 호출 횟수 제한 | 10점 |
| 슬라이딩 윈도우 알고리즘 | 10점 |
| 제한 초과 시 예외 발생 또는 대기 | 10점 |

#### 2. 제너레이터 기반 배치 처리 (25점)
| 요구사항 | 점수 |
|---------|------|
| batch_generator(items, batch_size) | 10점 |
| rate_limited_iter(items, calls_per_sec) | 15점 |

#### 3. 컨텍스트 매니저 (25점)
| 요구사항 | 점수 |
|---------|------|
| RateLimitContext로 구간별 제한 적용 | 15점 |
| 스레드 안전한 구현 | 10점 |

#### 4. 타입 힌트 & 문서화 (20점)
| 요구사항 | 점수 |
|---------|------|
| mypy --strict 통과 | 10점 |
| 모든 함수 docstring | 10점 |

## 제출물
1. \`rate_limiter.py\` (구현 코드)
2. \`test_rate_limiter.py\` (테스트 코드)
3. 사용 예제 코드

## 힌트
- time.sleep()과 time.time()으로 시간 제어
- collections.deque(maxlen=window_size)로 슬라이딩 윈도우
- functools.wraps로 데코레이터 메타데이터 보존
`,
      starterCode: `"""
Week 1 도전과제: Rate Limiter 라이브러리
"""

from __future__ import annotations
from typing import TypeVar, Callable, Iterator, Generator, Any, ParamSpec
from collections import deque
from dataclasses import dataclass
from functools import wraps
from contextlib import contextmanager
import threading
import time

P = ParamSpec('P')
R = TypeVar('R')
T = TypeVar('T')


# =============================================================================
# 1. @rate_limit 데코레이터
# =============================================================================

class RateLimitExceeded(Exception):
    """Rate limit 초과 예외"""
    pass


def rate_limit(
    calls_per_second: float,
    wait: bool = True
) -> Callable[[Callable[P, R]], Callable[P, R]]:
    """함수 호출 속도 제한 데코레이터

    Args:
        calls_per_second: 초당 최대 호출 횟수
        wait: True면 대기, False면 예외 발생

    Returns:
        데코레이터 함수

    Example:
        @rate_limit(calls_per_second=2, wait=True)
        def api_call(url: str) -> str:
            return requests.get(url).text
    """
    # TODO: 구현
    pass


# =============================================================================
# 2. 제너레이터 기반 배치 처리
# =============================================================================

def batch_generator(
    items: Iterator[T],
    batch_size: int
) -> Generator[list[T], None, None]:
    """아이템을 배치로 묶어서 yield

    Args:
        items: 입력 이터레이터
        batch_size: 배치 크기

    Yields:
        배치 리스트

    Example:
        for batch in batch_generator(range(10), 3):
            print(batch)  # [0,1,2], [3,4,5], [6,7,8], [9]
    """
    # TODO: 구현
    pass


def rate_limited_iter(
    items: Iterator[T],
    calls_per_second: float
) -> Generator[T, None, None]:
    """속도 제한된 이터레이터

    Args:
        items: 입력 이터레이터
        calls_per_second: 초당 아이템 처리 횟수

    Yields:
        아이템 (속도 제한 적용)
    """
    # TODO: 구현
    pass


# =============================================================================
# 3. 컨텍스트 매니저
# =============================================================================

@dataclass
class RateLimitStats:
    """Rate limit 통계"""
    total_calls: int = 0
    waited_seconds: float = 0.0
    exceeded_count: int = 0


@contextmanager
def rate_limit_context(
    calls_per_second: float,
    name: str = "default"
) -> Generator[RateLimitStats, None, None]:
    """Rate limit 컨텍스트 매니저

    Args:
        calls_per_second: 초당 최대 호출 횟수
        name: 컨텍스트 이름 (로깅용)

    Yields:
        RateLimitStats: 통계 객체

    Example:
        with rate_limit_context(10, "api_batch") as stats:
            for item in items:
                process(item)
        print(f"Total calls: {stats.total_calls}")
    """
    # TODO: 구현
    pass


# =============================================================================
# 테스트
# =============================================================================

if __name__ == "__main__":
    print("=== Rate Limiter 테스트 ===\\n")

    # 1. 데코레이터 테스트
    print("[1] @rate_limit 데코레이터 테스트")
    # TODO: rate_limit 데코레이터 테스트

    # 2. batch_generator 테스트
    print("\\n[2] batch_generator 테스트")
    # TODO: batch_generator 테스트

    # 3. rate_limited_iter 테스트
    print("\\n[3] rate_limited_iter 테스트")
    # TODO: rate_limited_iter 테스트

    # 4. 컨텍스트 매니저 테스트
    print("\\n[4] rate_limit_context 테스트")
    # TODO: rate_limit_context 테스트
`,
      hints: [
        'deque(maxlen=N)으로 최근 N개 호출 시간 기록',
        'time.time() - window[0] > 1.0이면 슬라이딩 윈도우 이동',
        'threading.Lock()으로 스레드 안전성 확보',
        'yield from으로 제너레이터 위임',
        '@wraps(func)로 데코레이터 메타데이터 보존'
      ]
    }
  }
]
