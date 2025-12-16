# Week 1: Python 심화 - 태스크 구조

> Phase 1 > Month 1 > Week 1

## 개요

| 항목 | 내용 |
|------|------|
| **주제** | Python 심화 |
| **목표** | 고급 Python 기능을 활용한 효율적인 코드 작성 |
| **총 학습 시간** | 약 10-12시간 |
| **결과물** | 데코레이터 기반 로깅 & 캐싱 시스템 |

---

## Day 1: 이터레이터 & 제너레이터 (2시간)

### Lesson 1.1: 이터레이터 프로토콜 (45분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| 1.1.1 | `video` | 15분 | 이터레이터 프로토콜 개념 (`__iter__`, `__next__`) |
| 1.1.2 | `reading` | 10분 | Python 공식 문서: Iterator Types |
| 1.1.3 | `code` | 15분 | 커스텀 이터레이터 클래스 작성 (Range 구현) |
| 1.1.4 | `quiz` | 5분 | 이터레이터 개념 퀴즈 (5문제) |

**학습 목표:**
- `__iter__`와 `__next__` 메서드의 역할 이해
- `StopIteration` 예외 처리 방법
- 이터러블 vs 이터레이터 구분

---

### Lesson 1.2: 제너레이터 함수 (45분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| 1.2.1 | `video` | 15분 | `yield` 키워드와 제너레이터 동작 원리 |
| 1.2.2 | `code` | 15분 | 기본 제너레이터 작성 (피보나치, 소수 생성) |
| 1.2.3 | `code` | 10분 | 메모리 효율 비교 (리스트 vs 제너레이터) |
| 1.2.4 | `quiz` | 5분 | 제너레이터 퀴즈 (5문제) |

**학습 목표:**
- `yield`와 `return`의 차이 이해
- Lazy evaluation의 장점
- 메모리 효율적인 데이터 처리

---

### Lesson 1.3: 제너레이터 표현식 & 고급 기법 (30분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| 1.3.1 | `video` | 10분 | 제너레이터 표현식, `yield from` |
| 1.3.2 | `code` | 15분 | 대용량 파일 처리 (line by line) |
| 1.3.3 | `quiz` | 5분 | 고급 제너레이터 퀴즈 (5문제) |

**학습 목표:**
- 제너레이터 표현식 문법
- `yield from`을 사용한 서브제너레이터 위임
- 실무에서의 제너레이터 활용 패턴

---

### Daily Challenge 1 (30분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| DC1 | `challenge` | 30분 | **무한 데이터 스트림 제너레이터** |

**요구사항:**
```python
# 구현할 함수들:
def infinite_counter(start=0):
    """무한 카운터 제너레이터"""
    pass

def chunked_reader(file_path, chunk_size=1000):
    """대용량 파일을 청크 단위로 읽는 제너레이터"""
    pass

def pipeline(*generators):
    """여러 제너레이터를 연결하는 파이프라인"""
    pass
```

**평가 기준:**
- [ ] 무한 시퀀스 생성 가능
- [ ] 메모리 효율적 (1GB 파일도 처리 가능)
- [ ] 파이프라인 체이닝 동작

---

## Day 2: 데코레이터 패턴 (2.5시간)

### Lesson 2.1: 데코레이터 기초 (45분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| 2.1.1 | `video` | 15분 | 데코레이터란? (First-class function, Closure) |
| 2.1.2 | `reading` | 10분 | PEP 318: Decorators for Functions and Methods |
| 2.1.3 | `code` | 15분 | 간단한 데코레이터 작성 (실행 시간 측정) |
| 2.1.4 | `quiz` | 5분 | 데코레이터 기초 퀴즈 (5문제) |

**학습 목표:**
- 클로저와 데코레이터의 관계 이해
- `@decorator` 문법의 동작 원리
- `functools.wraps`의 필요성

---

### Lesson 2.2: 데코레이터 심화 (45분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| 2.2.1 | `video` | 15분 | 인자를 받는 데코레이터 |
| 2.2.2 | `code` | 15분 | 재시도 데코레이터 구현 (`@retry(max_attempts=3)`) |
| 2.2.3 | `code` | 10분 | 클래스 기반 데코레이터 |
| 2.2.4 | `quiz` | 5분 | 데코레이터 심화 퀴즈 (5문제) |

**학습 목표:**
- 인자를 받는 데코레이터 작성법
- 함수형 vs 클래스 기반 데코레이터
- 데코레이터 체이닝

---

### Lesson 2.3: 실무 데코레이터 패턴 (30분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| 2.3.1 | `video` | 10분 | 실무 패턴 (캐싱, 인증, 로깅) |
| 2.3.2 | `code` | 15분 | `@lru_cache` 분석 및 커스텀 캐시 구현 |
| 2.3.3 | `quiz` | 5분 | 실무 패턴 퀴즈 (5문제) |

**학습 목표:**
- `functools.lru_cache` 내부 동작 이해
- 메모이제이션 패턴
- 실무에서 자주 쓰이는 데코레이터

---

### Daily Challenge 2 (30분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| DC2 | `challenge` | 30분 | **범용 로깅 데코레이터** |

**요구사항:**
```python
@log(level='INFO', include_args=True, include_result=True)
def process_data(data: list) -> dict:
    pass

# 출력 예시:
# [INFO] process_data called with args=(data=[1,2,3],)
# [INFO] process_data returned {'count': 3}
```

**평가 기준:**
- [ ] 로그 레벨 설정 가능
- [ ] 인자 포함/제외 옵션
- [ ] 반환값 포함/제외 옵션
- [ ] 예외 발생 시 로깅

---

## Day 3: 컨텍스트 매니저 (2시간)

### Lesson 3.1: 컨텍스트 매니저 기초 (45분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| 3.1.1 | `video` | 15분 | `with` 문과 컨텍스트 매니저 프로토콜 |
| 3.1.2 | `reading` | 10분 | PEP 343: The "with" Statement |
| 3.1.3 | `code` | 15분 | `__enter__`, `__exit__` 구현 (파일 핸들러) |
| 3.1.4 | `quiz` | 5분 | 컨텍스트 매니저 퀴즈 (5문제) |

**학습 목표:**
- 리소스 관리의 중요성
- `__enter__`와 `__exit__` 메서드 역할
- 예외 처리와 정리(cleanup) 보장

---

### Lesson 3.2: contextlib 활용 (45분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| 3.2.1 | `video` | 15분 | `@contextmanager` 데코레이터 |
| 3.2.2 | `code` | 15분 | 제너레이터 기반 컨텍스트 매니저 작성 |
| 3.2.3 | `code` | 10분 | `contextlib.ExitStack` 활용 |
| 3.2.4 | `quiz` | 5분 | contextlib 퀴즈 (5문제) |

**학습 목표:**
- `@contextmanager`로 간단하게 구현
- 여러 컨텍스트 매니저 중첩
- `ExitStack`으로 동적 리소스 관리

---

### Daily Challenge 3 (30분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| DC3 | `challenge` | 30분 | **데이터베이스 트랜잭션 매니저** |

**요구사항:**
```python
with transaction(db_connection) as tx:
    tx.execute("INSERT INTO users ...")
    tx.execute("UPDATE accounts ...")
    # 예외 발생 시 자동 롤백
    # 정상 완료 시 자동 커밋
```

**평가 기준:**
- [ ] 정상 완료 시 자동 커밋
- [ ] 예외 발생 시 자동 롤백
- [ ] 중첩 트랜잭션 지원 (savepoint)

---

## Day 4: Type Hints & mypy (2시간)

### Lesson 4.1: Type Hints 기초 (45분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| 4.1.1 | `video` | 15분 | Type Hints 소개 (PEP 484) |
| 4.1.2 | `reading` | 10분 | Python typing 모듈 문서 |
| 4.1.3 | `code` | 15분 | 기본 타입 힌트 적용 (int, str, List, Dict) |
| 4.1.4 | `quiz` | 5분 | Type Hints 기초 퀴즈 (5문제) |

**학습 목표:**
- 기본 타입 힌트 문법
- `typing` 모듈의 주요 타입
- 런타임 vs 정적 타입 체크

---

### Lesson 4.2: 고급 타입 힌트 (45분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| 4.2.1 | `video` | 15분 | Generic, TypeVar, Protocol |
| 4.2.2 | `code` | 15분 | 제네릭 함수 및 클래스 작성 |
| 4.2.3 | `code` | 10분 | `Union`, `Optional`, `Literal` 활용 |
| 4.2.4 | `quiz` | 5분 | 고급 타입 힌트 퀴즈 (5문제) |

**학습 목표:**
- 제네릭 타입 작성
- `Protocol`로 구조적 서브타이핑
- `TypedDict`, `Literal` 활용

---

### Lesson 4.3: mypy 설정 & 활용 (30분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| 4.3.1 | `video` | 10분 | mypy 설치 및 설정 (mypy.ini) |
| 4.3.2 | `code` | 15분 | 기존 코드에 mypy 적용 및 오류 수정 |
| 4.3.3 | `quiz` | 5분 | mypy 퀴즈 (5문제) |

**학습 목표:**
- mypy 설정 파일 작성
- 점진적 타입 체크 전략
- CI/CD에 mypy 통합

---

### Daily Challenge 4 (30분)

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| DC4 | `challenge` | 30분 | **완전 타입 힌트 적용** |

**요구사항:**
- Day 1-3에서 작성한 모든 코드에 Type Hints 적용
- `mypy --strict` 통과

**평가 기준:**
- [ ] 모든 함수에 반환 타입 명시
- [ ] 제네릭 타입 적절히 사용
- [ ] mypy 오류 0개

---

## Day 5: Weekly Project (3시간)

### 프로젝트: 데코레이터 기반 로깅 & 캐싱 시스템

| Task | 유형 | 시간 | 내용 |
|------|------|------|------|
| 5.1 | `reading` | 15분 | 프로젝트 요구사항 분석 |
| 5.2 | `code` | 45분 | 로깅 시스템 구현 |
| 5.3 | `code` | 45분 | 캐싱 시스템 구현 (TTL 지원) |
| 5.4 | `code` | 30분 | 통합 및 테스트 |
| 5.5 | `code` | 30분 | Type Hints 적용 & mypy 통과 |
| 5.6 | `reading` | 15분 | 코드 리뷰 체크리스트 |

**요구사항:**
```python
# 1. 로깅 데코레이터
@log(level='DEBUG')
def fetch_data(url: str) -> dict:
    pass

# 2. 캐싱 데코레이터 (TTL 지원)
@cache(ttl=3600)  # 1시간 캐시
def get_user_profile(user_id: int) -> UserProfile:
    pass

# 3. 조합 사용
@log(level='INFO')
@cache(ttl=600)
@retry(max_attempts=3)
def api_call(endpoint: str) -> Response:
    pass
```

**산출물:**
```
week1_project/
├── decorators/
│   ├── __init__.py
│   ├── logging.py      # 로깅 데코레이터
│   ├── caching.py      # 캐싱 데코레이터
│   └── retry.py        # 재시도 데코레이터
├── utils/
│   ├── __init__.py
│   └── generators.py   # Day 1 제너레이터
├── tests/
│   ├── test_logging.py
│   ├── test_caching.py
│   └── test_retry.py
├── mypy.ini
└── README.md
```

**평가 기준:**
- [ ] 모든 데코레이터 정상 동작
- [ ] TTL 기반 캐시 만료 구현
- [ ] 데코레이터 체이닝 지원
- [ ] Type Hints 완벽 적용
- [ ] mypy --strict 통과
- [ ] 단위 테스트 작성 (pytest)
- [ ] README 문서화

---

## 학습 시간 요약

| Day | 주제 | Lessons | Challenge | 총 시간 |
|-----|------|---------|-----------|--------|
| Day 1 | 이터레이터 & 제너레이터 | 2시간 | 30분 | **2.5시간** |
| Day 2 | 데코레이터 패턴 | 2시간 | 30분 | **2.5시간** |
| Day 3 | 컨텍스트 매니저 | 1.5시간 | 30분 | **2시간** |
| Day 4 | Type Hints & mypy | 2시간 | 30분 | **2.5시간** |
| Day 5 | Weekly Project | - | 3시간 | **3시간** |
| **Total** | | | | **12.5시간** |

---

## Task 유형 정의

| 유형 | 아이콘 | 설명 | 평균 시간 |
|------|--------|------|----------|
| `video` | 📹 | 강의 영상 시청 | 10-15분 |
| `reading` | 📖 | 문서/아티클 읽기 | 5-15분 |
| `code` | 💻 | 코드 실습 (in-browser IDE) | 10-30분 |
| `quiz` | 📝 | 객관식/단답형 퀴즈 | 5-10분 |
| `challenge` | 🏆 | Daily Challenge | 20-40분 |
| `project` | 🚀 | Weekly/Monthly 프로젝트 | 1-4시간 |

---

## 다음 단계

- [ ] Week 2: pandas & 데이터 처리 태스크 구조 설계
- [ ] Week 3: SQL 심화 태스크 구조 설계
- [ ] Week 4: 데이터 모델링 태스크 구조 설계
