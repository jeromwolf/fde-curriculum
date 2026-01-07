// Day 3: 컨텍스트 매니저
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'context-intro-video',
    type: 'video',
    title: 'with 문과 컨텍스트 매니저 프로토콜',
    duration: 15,
    content: {
      objectives: [
        'with 문의 동작 원리를 이해한다',
        '__enter__와 __exit__ 메서드의 역할을 파악한다',
        '컨텍스트 매니저의 장점을 이해한다'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=iba-I4CrmyA',
      transcript: `
## 컨텍스트 매니저란?

**컨텍스트 매니저**는 리소스의 **획득과 해제**를 자동으로 관리하는 객체입니다.

### with 문 없이 파일 다루기

\`\`\`python
# 위험: 예외 발생 시 파일이 닫히지 않음
f = open('data.txt', 'r')
content = f.read()
f.close()  # 예외 발생 시 실행 안 됨!

# 안전하지만 번거로움
f = open('data.txt', 'r')
try:
    content = f.read()
finally:
    f.close()  # 항상 실행
\`\`\`

### with 문 사용

\`\`\`python
# 깔끔하고 안전
with open('data.txt', 'r') as f:
    content = f.read()
# 여기서 f.close()가 자동 호출됨 (예외 발생해도!)
\`\`\`

### 컨텍스트 매니저 프로토콜

\`\`\`python
class MyContextManager:
    def __enter__(self):
        """with 블록 진입 시 호출
        - 리소스 획득
        - 반환값이 as 변수에 할당됨
        """
        print("리소스 획득")
        return self  # as 변수에 할당될 값

    def __exit__(self, exc_type, exc_val, exc_tb):
        """with 블록 종료 시 호출
        - 리소스 해제
        - 예외 정보를 받음 (정상 종료 시 모두 None)
        - True 반환 시 예외 억제
        """
        print("리소스 해제")
        return False  # 예외 억제 안 함
\`\`\`

### with 문의 실행 흐름

\`\`\`
┌─────────────────────────────────────────────────────┐
│  with MyContextManager() as cm:                      │
│      # 블록 내용                                     │
│                                                      │
│  실행 순서:                                          │
│  1. MyContextManager() → 인스턴스 생성              │
│  2. __enter__() → 리소스 획득, 반환값 → cm          │
│  3. 블록 실행                                        │
│  4. __exit__() → 리소스 해제 (예외 여부 무관!)      │
└─────────────────────────────────────────────────────┘
\`\`\`

### __exit__의 예외 처리

\`\`\`python
def __exit__(self, exc_type, exc_val, exc_tb):
    # exc_type: 예외 타입 (예: ValueError)
    # exc_val: 예외 인스턴스
    # exc_tb: 트레이스백 객체

    if exc_type is not None:
        print(f"예외 발생: {exc_type.__name__}: {exc_val}")

    # return True → 예외 억제 (swallow)
    # return False 또는 None → 예외 전파
    return False
\`\`\`

### 핵심 메시지

> "컨텍스트 매니저는 **리소스 누수 방지**의 핵심입니다. 파일, DB 연결, 락(lock) 등에 필수입니다."
      `,
      keyPoints: [
        '__enter__: 리소스 획득, as 변수에 반환값 할당',
        '__exit__: 리소스 해제, 예외 정보 수신',
        'with 블록 종료 시 __exit__은 항상 호출됨 (예외 발생해도)',
        '__exit__에서 True 반환 시 예외 억제'
      ]
    }
  },
  {
    id: 'pep343-reading',
    type: 'reading',
    title: 'PEP 343: The "with" Statement',
    duration: 10,
    content: {
      objectives: [
        'with 문의 설계 배경을 이해한다',
        '컨텍스트 매니저의 공식 정의를 파악한다',
        '내장 컨텍스트 매니저를 알아본다'
      ],
      markdown: `
# PEP 343: The "with" Statement

## 배경

Python 2.5 (2006년)에서 도입된 with 문의 공식 제안서입니다.

## 문제점 (Before)

\`\`\`python
# 파일 처리
f = open('file.txt')
try:
    for line in f:
        process(line)
finally:
    f.close()

# 락 처리
lock.acquire()
try:
    # 임계 영역
    ...
finally:
    lock.release()
\`\`\`

**문제점:**
- try/finally 패턴이 반복됨
- 실수로 finally를 빼먹기 쉬움
- 코드가 장황해짐

## 해결책 (After)

\`\`\`python
# 파일 처리
with open('file.txt') as f:
    for line in f:
        process(line)

# 락 처리
with lock:
    # 임계 영역
    ...
\`\`\`

## 컨텍스트 매니저 프로토콜

| 메서드 | 역할 |
|--------|------|
| \`__enter__(self)\` | 런타임 컨텍스트 진입, as 변수에 할당될 값 반환 |
| \`__exit__(self, exc_type, exc_val, exc_tb)\` | 런타임 컨텍스트 종료, 정리 작업 수행 |

## with 문의 동작

\`\`\`python
with EXPR as VAR:
    BLOCK

# 위 코드는 아래와 동일:
mgr = EXPR
exit = mgr.__exit__
value = mgr.__enter__()
VAR = value
try:
    BLOCK
except:
    if not exit(mgr, *sys.exc_info()):
        raise
else:
    exit(mgr, None, None, None)
\`\`\`

## 내장 컨텍스트 매니저

| 객체 | 용도 |
|------|------|
| \`open()\` | 파일 자동 닫기 |
| \`threading.Lock()\` | 락 자동 해제 |
| \`decimal.localcontext()\` | 소수점 정밀도 임시 변경 |
| \`contextlib.suppress()\` | 특정 예외 무시 |
| \`contextlib.redirect_stdout()\` | stdout 임시 리다이렉트 |

## 여러 컨텍스트 매니저

\`\`\`python
# Python 3.1+
with open('in.txt') as fin, open('out.txt', 'w') as fout:
    fout.write(fin.read())

# Python 3.10+: 괄호로 여러 줄
with (
    open('in.txt') as fin,
    open('out.txt', 'w') as fout,
):
    fout.write(fin.read())
\`\`\`

## 참고 링크

- [PEP 343 원문](https://peps.python.org/pep-0343/)
- [contextlib 문서](https://docs.python.org/3/library/contextlib.html)
      `,
      externalLinks: [
        { title: 'PEP 343 원문', url: 'https://peps.python.org/pep-0343/' },
        { title: 'contextlib 공식 문서', url: 'https://docs.python.org/3/library/contextlib.html' }
      ],
      keyPoints: [
        'with 문 = try/finally 패턴의 간결한 대안',
        '__enter__: as 변수 값 반환',
        '__exit__: 정리 작업, True 반환 시 예외 억제',
        'Python 3.10+: 괄호로 여러 컨텍스트 매니저 지원'
      ]
    }
  },
  {
    id: 'file-handler-code',
    type: 'code',
    title: '__enter__, __exit__ 구현 (파일 핸들러)',
    duration: 15,
    content: {
      objectives: [
        '컨텍스트 매니저 프로토콜을 직접 구현한다',
        '파일 핸들러를 예제로 __enter__와 __exit__를 작성한다',
        '예외 처리와 리소스 정리를 다룬다'
      ],
      instructions: `
커스텀 파일 핸들러를 구현하여 컨텍스트 매니저 프로토콜을 익힙니다.

## 요구사항
1. 파일 열기/닫기 자동화
2. 열린 파일 목록 추적
3. 예외 발생 시에도 파일 닫기 보장
      `,
      starterCode: `
class ManagedFile:
    """컨텍스트 매니저를 사용한 파일 핸들러

    추가 기능: 열린 파일 목록 추적
    """
    _open_files = []  # 클래스 변수: 열린 파일 추적

    def __init__(self, filename: str, mode: str = 'r'):
        """파일명과 모드 저장 (아직 열지 않음)"""
        self.filename = filename
        self.mode = mode
        self.file = None

    def __enter__(self):
        """with 블록 진입 시 호출

        TODO:
        1. 파일 열기
        2. 열린 파일 목록에 추가
        3. 파일 객체 반환
        """
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        """with 블록 종료 시 호출

        TODO:
        1. 파일 닫기
        2. 열린 파일 목록에서 제거
        3. 예외 로깅 (억제하지 않음)
        """
        pass

    @classmethod
    def get_open_files(cls):
        """현재 열린 파일 목록 반환"""
        return cls._open_files.copy()


# 테스트
# 샘플 파일 생성
with open('/tmp/test.txt', 'w') as f:
    f.write("Hello, Context Manager!\\nLine 2\\nLine 3")

# 테스트 1: 정상 사용
print("=== 테스트 1: 정상 사용 ===")
with ManagedFile('/tmp/test.txt', 'r') as f:
    print(f"블록 내 열린 파일: {ManagedFile.get_open_files()}")
    content = f.read()
    print(f"내용: {content[:30]}...")

print(f"블록 후 열린 파일: {ManagedFile.get_open_files()}")

# 테스트 2: 예외 발생
print("\\n=== 테스트 2: 예외 발생 ===")
try:
    with ManagedFile('/tmp/test.txt', 'r') as f:
        print(f"열린 파일: {ManagedFile.get_open_files()}")
        raise ValueError("의도적 에러!")
except ValueError as e:
    print(f"예외 잡음: {e}")

print(f"예외 후 열린 파일: {ManagedFile.get_open_files()}")
      `,
      solutionCode: `
class ManagedFile:
    """컨텍스트 매니저를 사용한 파일 핸들러

    🎯 역할: 파일 열기/닫기 자동화 + 열린 파일 추적

    💡 핵심 포인트:
    - __enter__: 파일 열기, 파일 객체 반환
    - __exit__: 파일 닫기 (예외 발생해도 무조건 실행)
    - 클래스 변수로 열린 파일 목록 추적

    Attributes:
        _open_files: 현재 열린 파일 경로 목록 (클래스 변수)
        filename: 파일 경로
        mode: 파일 모드 ('r', 'w', 'a' 등)
        file: 실제 파일 객체
    """
    _open_files = []  # 클래스 변수: 열린 파일 추적

    def __init__(self, filename: str, mode: str = 'r'):
        """파일명과 모드 저장 (아직 열지 않음)

        Args:
            filename: 파일 경로
            mode: 파일 모드 (기본 'r')
        """
        self.filename = filename
        self.mode = mode
        self.file = None

    def __enter__(self):
        """with 블록 진입 시 호출

        Returns:
            file object: 열린 파일 객체

        💡 반환값이 as 변수에 할당됨
        """
        print(f"📂 파일 열기: {self.filename}")
        self.file = open(self.filename, self.mode)
        ManagedFile._open_files.append(self.filename)
        return self.file  # as 변수에 할당될 값

    def __exit__(self, exc_type, exc_val, exc_tb):
        """with 블록 종료 시 호출

        Args:
            exc_type: 예외 타입 (정상 종료 시 None)
            exc_val: 예외 인스턴스
            exc_tb: 트레이스백

        Returns:
            False: 예외 억제 안 함

        💡 예외 발생 여부와 관계없이 항상 호출됨!
        """
        if exc_type is not None:
            print(f"⚠️ 예외 발생: {exc_type.__name__}: {exc_val}")

        if self.file:
            self.file.close()
            print(f"📁 파일 닫기: {self.filename}")

        if self.filename in ManagedFile._open_files:
            ManagedFile._open_files.remove(self.filename)

        return False  # 예외를 억제하지 않음 (전파)

    @classmethod
    def get_open_files(cls):
        """현재 열린 파일 목록 반환"""
        return cls._open_files.copy()


# 보너스: 예외를 억제하는 버전
class SilentManagedFile(ManagedFile):
    """특정 예외를 억제하는 파일 핸들러"""

    def __init__(self, filename: str, mode: str = 'r', suppress: tuple = ()):
        super().__init__(filename, mode)
        self.suppress = suppress  # 억제할 예외 타입들

    def __exit__(self, exc_type, exc_val, exc_tb):
        super().__exit__(exc_type, exc_val, exc_tb)

        # 지정된 예외 타입이면 억제
        if exc_type is not None and issubclass(exc_type, self.suppress):
            print(f"🤫 예외 억제됨: {exc_type.__name__}")
            return True  # 예외 억제

        return False


# 테스트
# 샘플 파일 생성
with open('/tmp/test.txt', 'w') as f:
    f.write("Hello, Context Manager!\\nLine 2\\nLine 3")

# 테스트 1: 정상 사용
print("=== 테스트 1: 정상 사용 ===")
with ManagedFile('/tmp/test.txt', 'r') as f:
    print(f"블록 내 열린 파일: {ManagedFile.get_open_files()}")
    content = f.read()
    print(f"내용: {content[:30]}...")

print(f"블록 후 열린 파일: {ManagedFile.get_open_files()}")

# 테스트 2: 예외 발생
print("\\n=== 테스트 2: 예외 발생 ===")
try:
    with ManagedFile('/tmp/test.txt', 'r') as f:
        print(f"열린 파일: {ManagedFile.get_open_files()}")
        raise ValueError("의도적 에러!")
except ValueError as e:
    print(f"예외 잡음: {e}")

print(f"예외 후 열린 파일: {ManagedFile.get_open_files()}")  # 빈 리스트!

# 테스트 3: 예외 억제
print("\\n=== 테스트 3: 예외 억제 ===")
with SilentManagedFile('/tmp/test.txt', 'r', suppress=(ValueError,)) as f:
    raise ValueError("이 예외는 억제됩니다")

print("예외 없이 계속 실행됨!")
      `,
      keyPoints: [
        '__enter__: 리소스 획득, 반환값이 as 변수에 할당',
        '__exit__: 리소스 해제, 항상 호출됨',
        'return True: 예외 억제, return False: 예외 전파',
        '클래스 변수로 열린 리소스 추적 가능'
      ]
    }
  },
  {
    id: 'context-basic-quiz',
    type: 'quiz',
    title: '컨텍스트 매니저 퀴즈',
    duration: 5,
    content: {
      objectives: [
        '컨텍스트 매니저 프로토콜을 이해했는지 확인한다'
      ],
      questions: [
        {
          question: 'with open("file.txt") as f: 에서 f에 할당되는 값은?',
          options: [
            'open 함수의 반환값',
            '__enter__ 메서드의 반환값',
            '__exit__ 메서드의 반환값',
            '파일 이름 문자열'
          ],
          answer: 1,
          explanation: 'as 변수에는 __enter__() 메서드의 반환값이 할당됩니다. open()은 파일 객체를 반환하고, 그 객체의 __enter__()는 self를 반환합니다.'
        },
        {
          question: 'with 블록 내에서 예외가 발생하면 __exit__은?',
          options: [
            '호출되지 않는다',
            '항상 호출된다',
            '예외 타입에 따라 다르다',
            '명시적으로 호출해야 한다'
          ],
          answer: 1,
          explanation: '__exit__은 with 블록 종료 시 예외 발생 여부와 관계없이 항상 호출됩니다. 이것이 컨텍스트 매니저의 핵심 가치입니다.'
        },
        {
          question: '__exit__에서 True를 반환하면?',
          options: [
            '예외가 발생했음을 알린다',
            '예외를 억제하고 정상 진행한다',
            '리소스 해제를 건너뛴다',
            'with 블록을 다시 실행한다'
          ],
          answer: 1,
          explanation: '__exit__에서 True를 반환하면 발생한 예외를 "삼켜서(swallow)" 억제합니다. 프로그램은 예외 없이 계속 진행됩니다.'
        }
      ],
      keyPoints: [
        'as 변수 = __enter__()의 반환값',
        '__exit__은 예외 발생해도 항상 호출',
        '__exit__ return True = 예외 억제'
      ]
    }
  },
  {
    id: 'contextlib-video',
    type: 'video',
    title: '@contextmanager 데코레이터',
    duration: 15,
    content: {
      objectives: [
        'contextlib 모듈의 주요 기능을 파악한다',
        '@contextmanager로 간단하게 컨텍스트 매니저를 만든다',
        'yield를 사용한 컨텍스트 매니저 패턴을 익힌다'
      ],
      transcript: `
## @contextmanager 데코레이터

클래스 없이 제너레이터로 컨텍스트 매니저를 만들 수 있습니다.

### 클래스 vs @contextmanager

\`\`\`python
# 클래스 방식 (16줄)
class MyContext:
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        print(f"시작: {self.name}")
        return self

    def __exit__(self, *args):
        print(f"종료: {self.name}")
        return False

# @contextmanager 방식 (8줄)
from contextlib import contextmanager

@contextmanager
def my_context(name):
    print(f"시작: {name}")
    try:
        yield  # with 블록 실행 지점
    finally:
        print(f"종료: {name}")
\`\`\`

### yield의 역할

\`\`\`
┌─────────────────────────────────────────────────────┐
│  @contextmanager                                     │
│  def my_context():                                   │
│      print("__enter__")  ← yield 전 = __enter__     │
│      yield value         ← as 변수에 할당되는 값     │
│      print("__exit__")   ← yield 후 = __exit__      │
└─────────────────────────────────────────────────────┘
\`\`\`

### 실용 예제: 임시 디렉토리

\`\`\`python
import os
import tempfile
import shutil
from contextlib import contextmanager

@contextmanager
def temp_directory():
    """임시 디렉토리 생성 후 자동 삭제"""
    dir_path = tempfile.mkdtemp()
    try:
        yield dir_path
    finally:
        shutil.rmtree(dir_path)

with temp_directory() as tmpdir:
    # tmpdir에서 작업
    with open(os.path.join(tmpdir, 'test.txt'), 'w') as f:
        f.write("임시 파일")
# with 블록 종료 → 임시 디렉토리 자동 삭제
\`\`\`

### 예외 처리

\`\`\`python
@contextmanager
def handle_errors():
    """예외를 잡아서 로깅"""
    try:
        yield
    except Exception as e:
        print(f"에러 발생: {e}")
        raise  # 예외 재발생 (억제하려면 raise 제거)

with handle_errors():
    1 / 0  # ZeroDivisionError
# 출력: "에러 발생: division by zero"
# 그 후 예외 전파
\`\`\`

### 핵심 메시지

> "@contextmanager는 제너레이터를 컨텍스트 매니저로 변환합니다. yield 전 = __enter__, yield 후 = __exit__"
      `,
      keyPoints: [
        '@contextmanager: 제너레이터 → 컨텍스트 매니저',
        'yield 전 코드 = __enter__, yield 후 코드 = __exit__',
        'yield 값 = as 변수에 할당',
        'try/finally로 예외 시에도 정리 코드 실행 보장'
      ]
    }
  },
  {
    id: 'generator-context-code',
    type: 'code',
    title: '제너레이터 기반 컨텍스트 매니저 작성',
    duration: 15,
    content: {
      objectives: [
        '@contextmanager를 사용하여 컨텍스트 매니저를 구현한다',
        '타이머, 로깅 등 실용적인 예제를 만든다',
        '값을 yield하여 as 변수로 전달한다'
      ],
      instructions: `
@contextmanager로 실용적인 컨텍스트 매니저를 구현합니다.

## 과제
1. timer: 실행 시간 측정
2. suppress_output: stdout 억제
3. change_directory: 임시 디렉토리 변경
      `,
      starterCode: `
import sys
import os
import time
from io import StringIO
from contextlib import contextmanager

@contextmanager
def timer(label: str = "작업"):
    """실행 시간을 측정하는 컨텍스트 매니저

    Args:
        label: 출력에 표시될 작업 이름

    Yields:
        None

    Example:
        with timer("데이터 처리"):
            process_data()
        # 출력: "데이터 처리: 1.234초"
    """
    # TODO: 구현하세요
    pass


@contextmanager
def suppress_output():
    """stdout을 억제하는 컨텍스트 매니저

    with 블록 내의 print 출력을 숨깁니다.

    Yields:
        StringIO: 캡처된 출력을 담은 버퍼

    Example:
        with suppress_output() as output:
            print("이건 안 보임")
        captured = output.getvalue()  # "이건 안 보임\\n"
    """
    # TODO: 구현하세요
    pass


@contextmanager
def change_directory(path: str):
    """임시로 작업 디렉토리를 변경하는 컨텍스트 매니저

    Args:
        path: 변경할 디렉토리 경로

    Yields:
        str: 이전 디렉토리 경로
    """
    # TODO: 구현하세요
    pass


# 테스트
print("=== timer 테스트 ===")
with timer("슬립"):
    time.sleep(0.3)

print("\\n=== suppress_output 테스트 ===")
print("이건 보임")
with suppress_output() as captured:
    print("이건 캡처됨")
print("다시 보임")
print(f"캡처된 내용: {repr(captured.getvalue())}")

print("\\n=== change_directory 테스트 ===")
print(f"현재: {os.getcwd()}")
with change_directory("/tmp") as old_dir:
    print(f"변경 후: {os.getcwd()}")
print(f"복원 후: {os.getcwd()}")
      `,
      solutionCode: `
import sys
import os
import time
from io import StringIO
from contextlib import contextmanager

@contextmanager
def timer(label: str = "작업"):
    """실행 시간을 측정하는 컨텍스트 매니저

    🎯 역할: with 블록의 실행 시간을 측정하고 출력

    💡 핵심 포인트:
    - yield 전: 시작 시간 기록
    - yield: with 블록 실행
    - finally: 종료 시간 기록 및 출력

    Args:
        label: 출력에 표시될 작업 이름

    Yields:
        None
    """
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        print(f"⏱️ {label}: {elapsed:.4f}초")


@contextmanager
def suppress_output():
    """stdout을 억제하는 컨텍스트 매니저

    🎯 역할: print 출력을 캡처하고 화면에는 표시하지 않음

    💡 핵심 포인트:
    - sys.stdout을 StringIO로 교체
    - yield로 캡처 버퍼 전달
    - finally에서 원래 stdout 복원

    Yields:
        StringIO: 캡처된 출력을 담은 버퍼
    """
    old_stdout = sys.stdout
    sys.stdout = captured = StringIO()
    try:
        yield captured
    finally:
        sys.stdout = old_stdout


@contextmanager
def change_directory(path: str):
    """임시로 작업 디렉토리를 변경하는 컨텍스트 매니저

    🎯 역할: with 블록 동안만 디렉토리 변경, 종료 시 복원

    💡 핵심 포인트:
    - os.getcwd()로 현재 위치 저장
    - os.chdir()로 이동
    - finally에서 원래 위치로 복원

    Args:
        path: 변경할 디렉토리 경로

    Yields:
        str: 이전 디렉토리 경로
    """
    old_dir = os.getcwd()
    try:
        os.chdir(path)
        yield old_dir
    finally:
        os.chdir(old_dir)


# 보너스: 결합된 컨텍스트 매니저
@contextmanager
def logged_timer(label: str, log_file: str = None):
    """시간 측정 + 로깅 결합"""
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        message = f"[{time.strftime('%H:%M:%S')}] {label}: {elapsed:.4f}초"
        print(message)
        if log_file:
            with open(log_file, 'a') as f:
                f.write(message + "\\n")


# 테스트
print("=== timer 테스트 ===")
with timer("슬립"):
    time.sleep(0.3)

with timer("계산"):
    total = sum(range(1_000_000))
    print(f"합계: {total:,}")

print("\\n=== suppress_output 테스트 ===")
print("이건 보임")
with suppress_output() as captured:
    print("이건 캡처됨")
    print("이것도 캡처됨")
print("다시 보임")
print(f"캡처된 내용: {repr(captured.getvalue())}")

print("\\n=== change_directory 테스트 ===")
print(f"현재: {os.getcwd()}")
with change_directory("/tmp") as old_dir:
    print(f"변경 후: {os.getcwd()}")
    print(f"이전 위치: {old_dir}")
print(f"복원 후: {os.getcwd()}")
      `,
      keyPoints: [
        '@contextmanager + yield = 간단한 컨텍스트 매니저',
        'yield 값이 as 변수로 전달됨',
        'try/finally로 정리 코드 보장',
        '시스템 상태 변경 후 복원에 적합'
      ]
    }
  },
  {
    id: 'exitstack-code',
    type: 'code',
    title: 'contextlib.ExitStack 활용',
    duration: 10,
    content: {
      objectives: [
        'ExitStack으로 동적으로 컨텍스트 매니저를 관리한다',
        '가변 개수의 리소스를 한 번에 관리한다',
        '콜백 함수를 등록하여 정리 작업을 예약한다'
      ],
      instructions: `
ExitStack은 컨텍스트 매니저를 동적으로 관리할 때 유용합니다.

## 사용 사례
1. 가변 개수의 파일 열기
2. 조건부 리소스 획득
3. 정리 콜백 등록
      `,
      starterCode: `
from contextlib import ExitStack, contextmanager
import os

# 예제 1: 여러 파일 동시 처리
def process_multiple_files(filenames: list[str]):
    """가변 개수의 파일을 동시에 열고 처리

    TODO: ExitStack을 사용하여 구현하세요
    """
    pass


# 예제 2: 콜백 등록
@contextmanager
def with_callbacks():
    """콜백 함수를 등록하여 정리 작업 예약

    TODO: ExitStack.callback()을 사용하세요
    """
    pass


# 테스트용 파일 생성
for i in range(3):
    with open(f'/tmp/file{i}.txt', 'w') as f:
        f.write(f"File {i} content")

# 테스트
print("=== 여러 파일 처리 ===")
process_multiple_files([f'/tmp/file{i}.txt' for i in range(3)])

print("\\n=== 콜백 테스트 ===")
with with_callbacks():
    print("작업 실행 중...")
      `,
      solutionCode: `
from contextlib import ExitStack, contextmanager
import os

def process_multiple_files(filenames: list[str]):
    """가변 개수의 파일을 동시에 열고 처리

    🎯 역할: 여러 파일을 안전하게 열고 처리

    💡 ExitStack의 장점:
    - 동적 개수의 컨텍스트 매니저 관리
    - 하나라도 실패하면 이미 열린 것들 정리
    - 모든 파일이 with 블록 끝에서 닫힘

    Args:
        filenames: 파일 경로 리스트
    """
    with ExitStack() as stack:
        # 각 파일을 열고 ExitStack에 등록
        files = [
            stack.enter_context(open(fname, 'r'))
            for fname in filenames
        ]

        # 모든 파일이 열린 상태에서 처리
        for i, f in enumerate(files):
            content = f.read()
            print(f"파일 {i}: {content}")

    print("모든 파일이 안전하게 닫힘")


def process_files_conditional(filenames: list[str], skip_missing: bool = False):
    """조건부로 파일을 열고 처리

    💡 ExitStack으로 조건부 리소스 관리
    """
    with ExitStack() as stack:
        files = []
        for fname in filenames:
            if skip_missing and not os.path.exists(fname):
                print(f"⚠️ 스킵: {fname}")
                continue
            f = stack.enter_context(open(fname, 'r'))
            files.append((fname, f))

        for fname, f in files:
            print(f"{fname}: {f.read()}")


@contextmanager
def with_callbacks():
    """콜백 함수를 등록하여 정리 작업 예약

    🎯 역할: with 블록 종료 시 콜백 함수들 실행

    💡 ExitStack.callback() 특징:
    - LIFO 순서로 실행 (마지막 등록이 먼저)
    - 예외 발생해도 모든 콜백 실행
    - 인자도 함께 등록 가능
    """
    with ExitStack() as stack:
        # 정리 콜백 등록 (LIFO 순서로 실행됨)
        stack.callback(print, "콜백 3: 마지막 정리")
        stack.callback(print, "콜백 2: 로그 저장")
        stack.callback(lambda: print("콜백 1: 연결 종료"))

        yield stack


# 보너스: 안전한 파일 복사
def safe_copy(src: str, dst: str):
    """ExitStack으로 안전한 파일 복사

    💡 두 파일을 동시에 열어야 할 때 유용
    """
    with ExitStack() as stack:
        src_file = stack.enter_context(open(src, 'r'))
        dst_file = stack.enter_context(open(dst, 'w'))
        dst_file.write(src_file.read())
    print(f"복사 완료: {src} → {dst}")


# 테스트용 파일 생성
for i in range(3):
    with open(f'/tmp/file{i}.txt', 'w') as f:
        f.write(f"File {i} content")

# 테스트
print("=== 여러 파일 처리 ===")
process_multiple_files([f'/tmp/file{i}.txt' for i in range(3)])

print("\\n=== 조건부 파일 처리 ===")
process_files_conditional(
    ['/tmp/file0.txt', '/tmp/nonexistent.txt', '/tmp/file1.txt'],
    skip_missing=True
)

print("\\n=== 콜백 테스트 ===")
with with_callbacks() as stack:
    print("작업 실행 중...")
    stack.callback(print, "동적 콜백 추가!")
print("블록 종료 후")

print("\\n=== 안전한 파일 복사 ===")
safe_copy('/tmp/file0.txt', '/tmp/file_copy.txt')
      `,
      keyPoints: [
        'ExitStack: 동적 개수의 컨텍스트 매니저 관리',
        'enter_context(): 컨텍스트 매니저 등록',
        'callback(): 정리 콜백 등록 (LIFO 순서)',
        '하나라도 실패하면 이미 획득한 리소스 자동 정리'
      ]
    }
  },
  {
    id: 'contextlib-quiz',
    type: 'quiz',
    title: 'contextlib 퀴즈',
    duration: 5,
    content: {
      objectives: [
        'contextlib 모듈의 기능을 이해했는지 확인한다'
      ],
      questions: [
        {
          question: '@contextmanager 데코레이터에서 yield의 역할은?',
          options: [
            '예외를 발생시킨다',
            'with 블록이 실행되는 지점을 표시한다',
            '함수를 종료시킨다',
            '값을 반복 생성한다'
          ],
          answer: 1,
          explanation: '@contextmanager에서 yield는 with 블록이 실행되는 지점입니다. yield 전 = __enter__, yield 후 = __exit__에 해당합니다.'
        },
        {
          question: 'ExitStack의 주요 용도는?',
          options: [
            '예외를 스택에 저장',
            '동적 개수의 컨텍스트 매니저 관리',
            '함수 호출 스택 추적',
            '메모리 스택 관리'
          ],
          answer: 1,
          explanation: 'ExitStack은 가변 개수의 컨텍스트 매니저를 동적으로 관리할 때 사용합니다. 루프에서 파일을 열거나 조건부로 리소스를 획득할 때 유용합니다.'
        },
        {
          question: 'ExitStack.callback()으로 등록된 콜백의 실행 순서는?',
          options: [
            'FIFO (먼저 등록된 것이 먼저)',
            'LIFO (나중에 등록된 것이 먼저)',
            '랜덤',
            '알파벳 순서'
          ],
          answer: 1,
          explanation: 'ExitStack의 콜백은 LIFO(Last In First Out) 순서로 실행됩니다. 스택처럼 마지막에 등록된 것이 먼저 실행됩니다.'
        }
      ],
      keyPoints: [
        '@contextmanager의 yield = with 블록 실행 지점',
        'ExitStack: 동적 컨텍스트 매니저 관리',
        '콜백은 LIFO 순서로 실행'
      ]
    }
  },
  {
    id: 'transaction-manager-challenge',
    type: 'code',
    title: '🏆 Daily Challenge: 데이터베이스 트랜잭션 매니저',
    duration: 30,
    content: {
      objectives: [
        '실무 수준의 트랜잭션 관리 컨텍스트 매니저를 구현한다',
        '자동 커밋/롤백 로직을 다룬다',
        '중첩 트랜잭션(savepoint)을 지원한다'
      ],
      instructions: `
## 🏆 Daily Challenge

데이터베이스 트랜잭션을 관리하는 컨텍스트 매니저를 구현하세요.

### 요구사항

1. **자동 커밋/롤백**
   - 정상 종료 시 자동 커밋
   - 예외 발생 시 자동 롤백

2. **중첩 트랜잭션 (Savepoint)**
   - 이미 트랜잭션 중이면 savepoint 생성
   - 내부 블록 실패 시 savepoint로 롤백

3. **연결 풀 시뮬레이션**
   - 연결 획득/반환 추적
      `,
      starterCode: `
from contextlib import contextmanager
from typing import Optional
import uuid

class MockConnection:
    """데이터베이스 연결 시뮬레이션"""

    def __init__(self, conn_id: str):
        self.conn_id = conn_id
        self.in_transaction = False
        self.savepoints = []

    def begin(self):
        print(f"[{self.conn_id}] BEGIN TRANSACTION")
        self.in_transaction = True

    def commit(self):
        print(f"[{self.conn_id}] COMMIT")
        self.in_transaction = False

    def rollback(self):
        print(f"[{self.conn_id}] ROLLBACK")
        self.in_transaction = False

    def savepoint(self, name: str):
        print(f"[{self.conn_id}] SAVEPOINT {name}")
        self.savepoints.append(name)

    def rollback_to(self, name: str):
        print(f"[{self.conn_id}] ROLLBACK TO {name}")
        while self.savepoints and self.savepoints[-1] != name:
            self.savepoints.pop()
        if self.savepoints:
            self.savepoints.pop()

    def release_savepoint(self, name: str):
        print(f"[{self.conn_id}] RELEASE SAVEPOINT {name}")
        if name in self.savepoints:
            self.savepoints.remove(name)

    def execute(self, sql: str):
        print(f"[{self.conn_id}] EXECUTE: {sql}")


class ConnectionPool:
    """연결 풀 시뮬레이션"""

    def __init__(self, size: int = 5):
        self.size = size
        self.connections = []
        self.available = []

    def get_connection(self) -> MockConnection:
        # TODO: 연결 획득 구현
        pass

    def release_connection(self, conn: MockConnection):
        # TODO: 연결 반환 구현
        pass


@contextmanager
def transaction(pool: ConnectionPool):
    """트랜잭션 관리 컨텍스트 매니저

    TODO: 구현하세요
    - 연결 획득
    - BEGIN/COMMIT/ROLLBACK 관리
    - 중첩 시 SAVEPOINT 사용
    """
    pass


# 테스트
pool = ConnectionPool(size=3)

print("=== 단일 트랜잭션 ===")
with transaction(pool) as conn:
    conn.execute("INSERT INTO users VALUES (1, 'Alice')")

print("\\n=== 예외 발생 시 롤백 ===")
try:
    with transaction(pool) as conn:
        conn.execute("INSERT INTO users VALUES (2, 'Bob')")
        raise ValueError("의도적 에러!")
except ValueError:
    print("예외 처리됨")

print("\\n=== 중첩 트랜잭션 ===")
with transaction(pool) as conn:
    conn.execute("INSERT INTO orders VALUES (1)")
    try:
        with transaction(pool) as conn2:  # 같은 연결에서 savepoint
            conn2.execute("INSERT INTO order_items VALUES (1, 1)")
            raise ValueError("내부 에러!")
    except ValueError:
        print("내부 트랜잭션만 롤백")
    conn.execute("INSERT INTO orders VALUES (2)")
      `,
      solutionCode: `
from contextlib import contextmanager
from typing import Optional
import uuid
import threading

class MockConnection:
    """데이터베이스 연결 시뮬레이션

    🎯 역할: 실제 DB 연결의 동작을 모방
    """

    def __init__(self, conn_id: str):
        self.conn_id = conn_id
        self.in_transaction = False
        self.savepoints = []

    def begin(self):
        print(f"[{self.conn_id}] BEGIN TRANSACTION")
        self.in_transaction = True

    def commit(self):
        print(f"[{self.conn_id}] COMMIT")
        self.in_transaction = False
        self.savepoints.clear()

    def rollback(self):
        print(f"[{self.conn_id}] ROLLBACK")
        self.in_transaction = False
        self.savepoints.clear()

    def savepoint(self, name: str):
        print(f"[{self.conn_id}] SAVEPOINT {name}")
        self.savepoints.append(name)

    def rollback_to(self, name: str):
        print(f"[{self.conn_id}] ROLLBACK TO {name}")
        # 해당 savepoint까지 롤백
        while self.savepoints and self.savepoints[-1] != name:
            self.savepoints.pop()
        if self.savepoints:
            self.savepoints.pop()

    def release_savepoint(self, name: str):
        print(f"[{self.conn_id}] RELEASE SAVEPOINT {name}")
        if name in self.savepoints:
            self.savepoints.remove(name)

    def execute(self, sql: str):
        print(f"[{self.conn_id}] EXECUTE: {sql}")


class ConnectionPool:
    """연결 풀 시뮬레이션

    🎯 역할: 연결 재사용으로 효율성 향상

    💡 실제 구현에서는 threading.Lock 사용
    """

    def __init__(self, size: int = 5):
        self.size = size
        self.connections = []
        self.available = []
        self._lock = threading.Lock()

    def get_connection(self) -> MockConnection:
        """연결 획득"""
        with self._lock:
            if self.available:
                conn = self.available.pop()
                print(f"♻️ 연결 재사용: {conn.conn_id}")
                return conn

            if len(self.connections) < self.size:
                conn_id = f"conn_{len(self.connections)}"
                conn = MockConnection(conn_id)
                self.connections.append(conn)
                print(f"🆕 새 연결 생성: {conn_id}")
                return conn

            raise RuntimeError("연결 풀 고갈!")

    def release_connection(self, conn: MockConnection):
        """연결 반환"""
        with self._lock:
            if conn not in self.available:
                self.available.append(conn)
                print(f"↩️ 연결 반환: {conn.conn_id}")


# 현재 트랜잭션 연결 추적 (스레드 로컬)
_current_connection = threading.local()


@contextmanager
def transaction(pool: ConnectionPool):
    """트랜잭션 관리 컨텍스트 매니저

    🎯 역할: 자동 커밋/롤백 + 중첩 트랜잭션 지원

    💡 핵심 로직:
    1. 기존 트랜잭션 있으면 → SAVEPOINT
    2. 새 트랜잭션이면 → BEGIN
    3. 정상 종료 → COMMIT 또는 RELEASE SAVEPOINT
    4. 예외 발생 → ROLLBACK 또는 ROLLBACK TO SAVEPOINT
    """
    # 이미 트랜잭션 중인지 확인
    existing_conn = getattr(_current_connection, 'conn', None)

    if existing_conn and existing_conn.in_transaction:
        # 중첩 트랜잭션: SAVEPOINT 사용
        savepoint_name = f"sp_{uuid.uuid4().hex[:8]}"
        existing_conn.savepoint(savepoint_name)

        try:
            yield existing_conn
            existing_conn.release_savepoint(savepoint_name)
        except Exception:
            existing_conn.rollback_to(savepoint_name)
            raise

    else:
        # 새 트랜잭션
        conn = pool.get_connection()
        _current_connection.conn = conn

        conn.begin()
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            _current_connection.conn = None
            pool.release_connection(conn)


# 보너스: 데코레이터 버전
def transactional(pool: ConnectionPool):
    """트랜잭션 데코레이터"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            with transaction(pool) as conn:
                return func(conn, *args, **kwargs)
        return wrapper
    return decorator


# 테스트
pool = ConnectionPool(size=3)

print("=== 단일 트랜잭션 ===")
with transaction(pool) as conn:
    conn.execute("INSERT INTO users VALUES (1, 'Alice')")

print("\\n=== 예외 발생 시 롤백 ===")
try:
    with transaction(pool) as conn:
        conn.execute("INSERT INTO users VALUES (2, 'Bob')")
        raise ValueError("의도적 에러!")
except ValueError:
    print("예외 처리됨 (롤백 완료)")

print("\\n=== 중첩 트랜잭션 (Savepoint) ===")
with transaction(pool) as conn:
    conn.execute("INSERT INTO orders VALUES (1)")

    try:
        with transaction(pool) as conn2:  # 같은 연결에서 savepoint
            conn2.execute("INSERT INTO order_items VALUES (1, 1)")
            raise ValueError("내부 에러!")
    except ValueError:
        print("내부 트랜잭션만 롤백됨")

    conn.execute("INSERT INTO orders VALUES (2)")  # 외부는 계속 진행
print("외부 트랜잭션 커밋 완료")

print("\\n=== 데코레이터 버전 ===")
@transactional(pool)
def create_user(conn, name: str):
    conn.execute(f"INSERT INTO users VALUES ('{name}')")
    return f"User {name} created"

result = create_user("Charlie")
print(f"결과: {result}")
      `,
      keyPoints: [
        'threading.local()로 현재 트랜잭션 추적',
        '중첩 시 SAVEPOINT로 부분 롤백 지원',
        '연결 풀로 리소스 재사용',
        'finally에서 연결 반환 보장'
      ]
    }
  }
]
