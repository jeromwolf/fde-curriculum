// Phase 0, Week 1: Python 기초 1 (변수, 자료형, 조건문, 반복문)
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'python-intro',
  title: 'Python 소개 & 환경 설정',
  totalDuration: 180,
  tasks: [
    {
      id: 'python-why',
      type: 'reading',
      title: 'Python이란?',
      duration: 30,
      content: {
        objectives: [
          'Python의 특징과 장점을 이해한다',
          'Python이 FDE에게 중요한 이유를 파악한다',
          'Python 버전과 생태계를 이해한다'
        ],
        markdown: `
## Python이란?

### Python의 특징

\`\`\`
Python 핵심 특징:
├── 읽기 쉬운 문법
│   └── "Beautiful is better than ugly"
├── 동적 타이핑
│   └── 변수 타입 자동 추론
├── 인터프리터 언어
│   └── 컴파일 없이 바로 실행
└── 풍부한 라이브러리
    └── pip로 쉽게 설치
\`\`\`

### Python의 역사

| 연도 | 버전 | 주요 변화 |
|------|------|-----------|
| 1991 | 0.9 | Guido van Rossum 개발 |
| 2000 | 2.0 | 리스트 컴프리헨션 |
| 2008 | 3.0 | 유니코드 기본, print 함수 |
| 2020 | 3.9 | 딕셔너리 병합 연산자 |
| 2024 | 3.12 | 성능 개선, 에러 메시지 개선 |

### 왜 Python인가?

\`\`\`
FDE가 Python을 배워야 하는 이유:

1. 데이터 처리
   ├── Pandas: 데이터 분석
   ├── PySpark: 대용량 데이터
   └── dbt: 데이터 변환

2. AI/ML
   ├── LangChain: LLM 애플리케이션
   ├── OpenAI SDK: GPT 연동
   └── scikit-learn: 머신러닝

3. 자동화
   ├── Airflow: 워크플로우
   ├── boto3: AWS 자동화
   └── 스크립팅

4. Palantir Foundry
   └── Transforms API = Python!
\`\`\`

### Python vs 다른 언어

| 특성 | Python | Java | JavaScript |
|------|--------|------|------------|
| 학습 난이도 | ⭐ | ⭐⭐⭐ | ⭐⭐ |
| 데이터 분석 | ✅ 최고 | ❌ | ❌ |
| 웹 개발 | ✅ Django | ✅ Spring | ✅ Node |
| AI/ML | ✅ 최고 | ⚠️ | ⚠️ |
| 실행 속도 | 느림 | 빠름 | 중간 |
        `,
        externalLinks: [
          { title: 'Python 공식 사이트', url: 'https://www.python.org/' },
          { title: 'Python 역사', url: 'https://en.wikipedia.org/wiki/History_of_Python' }
        ]
      }
    },
    {
      id: 'python-install',
      type: 'code',
      title: '환경 설정',
      duration: 45,
      content: {
        objectives: [
          'Python을 설치할 수 있다',
          '가상환경을 생성하고 활성화할 수 있다',
          'VS Code에서 Python을 설정할 수 있다'
        ],
        instructions: `
## Python 환경 설정

### 1. Python 설치 확인

터미널에서 다음 명령어를 실행하세요:

\`\`\`bash
python --version
# 또는
python3 --version
\`\`\`

### 2. Python 설치 (없는 경우)

**macOS:**
\`\`\`bash
brew install python
\`\`\`

**Windows:**
https://www.python.org/downloads/ 에서 다운로드

**Ubuntu:**
\`\`\`bash
sudo apt update
sudo apt install python3 python3-pip
\`\`\`

### 3. 가상환경 생성

\`\`\`bash
# 가상환경 생성
python -m venv myenv

# 활성화 (macOS/Linux)
source myenv/bin/activate

# 활성화 (Windows)
myenv\\Scripts\\activate

# 비활성화
deactivate
\`\`\`

### 4. VS Code 설정

1. VS Code 설치
2. Python 확장 설치 (Microsoft)
3. 인터프리터 선택 (Ctrl+Shift+P → "Python: Select Interpreter")

### 5. 첫 번째 Python 파일

\`hello.py\` 파일을 만들고 실행하세요:
        `,
        starterCode: `# hello.py - 첫 번째 Python 프로그램

# 출력
print("Hello, Python!")
print("안녕하세요, FDE!")

# 버전 확인
import sys
print(f"Python 버전: {sys.version}")
`,
        solutionCode: `# hello.py - 첫 번째 Python 프로그램

# 출력
print("Hello, Python!")
print("안녕하세요, FDE!")

# 버전 확인
import sys
print(f"Python 버전: {sys.version}")

# 실행 결과:
# Hello, Python!
# 안녕하세요, FDE!
# Python 버전: 3.12.x ...
`
      }
    },
    {
      id: 'python-variables',
      type: 'reading',
      title: '변수와 데이터 타입',
      duration: 45,
      content: {
        objectives: [
          '변수의 개념을 이해한다',
          '변수 이름 규칙을 알고 적용할 수 있다',
          '기본 데이터 타입을 구분할 수 있다'
        ],
        markdown: `
## 변수 (Variables)

### 변수란?

\`\`\`python
# 변수 = 데이터를 저장하는 상자
name = "김철수"      # 문자열 저장
age = 25             # 숫자 저장
is_student = True    # 불린 저장

# 변수는 언제든 값 변경 가능
age = 26  # 25 → 26
\`\`\`

### 변수 이름 규칙

\`\`\`
✅ 올바른 변수 이름:
├── name          (소문자)
├── user_name     (snake_case)
├── userName      (camelCase)
├── _private      (언더스코어 시작)
└── MAX_SIZE      (상수는 대문자)

❌ 잘못된 변수 이름:
├── 1name         (숫자로 시작 불가)
├── user-name     (하이픈 불가)
├── class         (예약어 불가)
└── 한글변수       (가능하지만 비권장)
\`\`\`

### Python 네이밍 컨벤션 (PEP 8)

| 종류 | 스타일 | 예시 |
|------|--------|------|
| 변수 | snake_case | user_name |
| 함수 | snake_case | get_user() |
| 클래스 | PascalCase | UserProfile |
| 상수 | UPPER_CASE | MAX_SIZE |
| 프라이빗 | _prefix | _internal |

### 기본 데이터 타입

\`\`\`python
# 정수 (int)
count = 42
negative = -10

# 실수 (float)
price = 19.99
pi = 3.14159

# 문자열 (str)
name = "Hello"
message = 'World'

# 불린 (bool)
is_valid = True
is_empty = False

# None (값 없음)
result = None

# 타입 확인
print(type(count))    # <class 'int'>
print(type(price))    # <class 'float'>
print(type(name))     # <class 'str'>
print(type(is_valid)) # <class 'bool'>
\`\`\`

### 타입 변환

\`\`\`python
# 문자열 → 숫자
num_str = "42"
num = int(num_str)     # 42
price = float("19.99") # 19.99

# 숫자 → 문자열
age = 25
age_str = str(age)     # "25"

# 불린 변환
bool(1)    # True
bool(0)    # False
bool("")   # False
bool("hi") # True
\`\`\`
        `,
        externalLinks: [
          { title: 'PEP 8 스타일 가이드', url: 'https://peps.python.org/pep-0008/' }
        ]
      }
    },
    {
      id: 'python-variables-practice',
      type: 'code',
      title: '변수 실습',
      duration: 45,
      content: {
        objectives: [
          '다양한 타입의 변수를 선언할 수 있다',
          '타입 변환을 수행할 수 있다',
          'f-string으로 변수를 출력할 수 있다'
        ],
        instructions: `
## 변수 실습

다음 요구사항에 맞게 코드를 완성하세요:

1. 자신의 정보를 변수에 저장하세요
2. 각 변수의 타입을 확인하세요
3. f-string으로 자기소개를 출력하세요
        `,
        starterCode: `# 1. 자신의 정보를 변수에 저장하세요
name = ""           # 이름 (문자열)
age = 0             # 나이 (정수)
height = 0.0        # 키 (실수)
is_developer = True # 개발자 여부 (불린)

# 2. 각 변수의 타입을 출력하세요
print("name 타입:", type(name))
# age, height, is_developer도 출력하세요

# 3. f-string으로 자기소개를 출력하세요
# 예: "안녕하세요, 저는 김철수이고, 25살입니다. 키는 175.5cm입니다."

# 4. 타입 변환 연습
age_str = ""        # age를 문자열로 변환
height_int = 0      # height를 정수로 변환
`,
        solutionCode: `# 1. 자신의 정보를 변수에 저장하세요
name = "김철수"
age = 25
height = 175.5
is_developer = True

# 2. 각 변수의 타입을 출력하세요
print("name 타입:", type(name))       # <class 'str'>
print("age 타입:", type(age))         # <class 'int'>
print("height 타입:", type(height))   # <class 'float'>
print("is_developer 타입:", type(is_developer))  # <class 'bool'>

# 3. f-string으로 자기소개를 출력하세요
intro = f"안녕하세요, 저는 {name}이고, {age}살입니다. 키는 {height}cm입니다."
print(intro)

# 개발자 여부에 따른 메시지
if is_developer:
    print(f"{name}님은 개발자입니다!")
else:
    print(f"{name}님은 개발자가 아닙니다.")

# 4. 타입 변환 연습
age_str = str(age)          # "25"
height_int = int(height)    # 175 (소수점 버림)

print(f"age 문자열: {age_str}, 타입: {type(age_str)}")
print(f"height 정수: {height_int}, 타입: {type(height_int)}")
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
            question: 'Python의 특징으로 올바른 것은?',
            options: ['컴파일 언어이다', '정적 타이핑을 사용한다', '인터프리터 언어이다', 'C++보다 실행 속도가 빠르다'],
            answer: 2,
            explanation: 'Python은 인터프리터 언어로, 코드를 한 줄씩 해석하여 실행합니다.'
          },
          {
            question: '올바른 변수 이름은?',
            options: ['1_user', 'user-name', 'user_name', 'class'],
            answer: 2,
            explanation: 'user_name은 snake_case 형식의 올바른 변수 이름입니다. 숫자로 시작하거나 하이픈, 예약어는 사용할 수 없습니다.'
          },
          {
            question: 'type(3.14)의 결과는?',
            options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'number'>"],
            answer: 1,
            explanation: '3.14는 소수점이 있는 실수이므로 float 타입입니다.'
          }
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'python-datatypes',
  title: '자료형 심화',
  totalDuration: 180,
  tasks: [
    {
      id: 'numbers',
      type: 'reading',
      title: '숫자 자료형',
      duration: 30,
      content: {
        objectives: [
          '정수와 실수의 차이를 이해한다',
          '산술 연산자를 사용할 수 있다',
          'math 모듈을 활용할 수 있다'
        ],
        markdown: `
## 숫자 자료형

### 정수 (int)

\`\`\`python
# 기본 정수
a = 10
b = -5
c = 0

# 큰 숫자 (Python은 정수 크기 제한 없음)
big = 10000000000000000000000

# 다양한 표기법
binary = 0b1010      # 2진수 → 10
octal = 0o12         # 8진수 → 10
hexadecimal = 0xA    # 16진수 → 10
\`\`\`

### 실수 (float)

\`\`\`python
# 기본 실수
pi = 3.14159
negative = -2.5

# 지수 표기법
scientific = 1.5e3   # 1.5 × 10³ = 1500.0
small = 1.5e-3       # 0.0015

# 주의: 부동소수점 오차
print(0.1 + 0.2)     # 0.30000000000000004
\`\`\`

### 산술 연산자

| 연산자 | 의미 | 예시 | 결과 |
|--------|------|------|------|
| + | 덧셈 | 5 + 3 | 8 |
| - | 뺄셈 | 5 - 3 | 2 |
| * | 곱셈 | 5 * 3 | 15 |
| / | 나눗셈 | 5 / 3 | 1.666... |
| // | 정수 나눗셈 | 5 // 3 | 1 |
| % | 나머지 | 5 % 3 | 2 |
| ** | 거듭제곱 | 5 ** 3 | 125 |

### math 모듈

\`\`\`python
import math

# 반올림, 올림, 내림
math.round(3.7)    # 4
math.ceil(3.1)     # 4
math.floor(3.9)    # 3

# 제곱근, 절댓값
math.sqrt(16)      # 4.0
math.fabs(-5)      # 5.0

# 상수
math.pi            # 3.141592653589793
math.e             # 2.718281828459045
\`\`\`
        `,
        externalLinks: [
          { title: 'Python math 모듈', url: 'https://docs.python.org/3/library/math.html' }
        ]
      }
    },
    {
      id: 'strings',
      type: 'reading',
      title: '문자열 자료형',
      duration: 45,
      content: {
        objectives: [
          '문자열 생성과 인덱싱을 이해한다',
          '문자열 메서드를 사용할 수 있다',
          '문자열 포매팅을 적용할 수 있다'
        ],
        markdown: `
## 문자열 (String)

### 문자열 생성

\`\`\`python
# 따옴표로 생성
single = 'Hello'
double = "World"
multi = """여러 줄
문자열도
가능합니다"""

# 특수 문자 (이스케이프)
newline = "첫째\\n둘째"   # 줄바꿈
tab = "이름\\t나이"       # 탭
quote = "He said \\"Hi\\"" # 따옴표
\`\`\`

### 인덱싱과 슬라이싱

\`\`\`python
text = "Python"
#       012345
#      -6-5-4-3-2-1

# 인덱싱 (한 글자)
text[0]    # 'P'
text[-1]   # 'n'

# 슬라이싱 (범위)
text[0:3]  # 'Pyt'
text[2:]   # 'thon'
text[:4]   # 'Pyth'
text[::2]  # 'Pto' (2칸씩)
text[::-1] # 'nohtyP' (역순)
\`\`\`

### 문자열 메서드

\`\`\`python
text = "  Hello, World!  "

# 대소문자 변환
text.upper()       # "  HELLO, WORLD!  "
text.lower()       # "  hello, world!  "
text.title()       # "  Hello, World!  "

# 공백 제거
text.strip()       # "Hello, World!"
text.lstrip()      # "Hello, World!  "
text.rstrip()      # "  Hello, World!"

# 검색
text.find("World") # 9 (위치)
text.count("l")    # 3 (개수)
"World" in text    # True

# 분리와 결합
"a,b,c".split(",")        # ['a', 'b', 'c']
"-".join(['a', 'b', 'c']) # "a-b-c"

# 치환
text.replace("World", "Python")  # "  Hello, Python!  "
\`\`\`

### 문자열 포매팅

\`\`\`python
name = "철수"
age = 25

# 1. f-string (권장)
f"이름: {name}, 나이: {age}"

# 2. format() 메서드
"이름: {}, 나이: {}".format(name, age)

# 3. % 연산자 (구식)
"이름: %s, 나이: %d" % (name, age)

# 포맷 옵션
pi = 3.14159
f"{pi:.2f}"         # "3.14" (소수점 2자리)
f"{age:05d}"        # "00025" (5자리, 0 채움)
f"{name:>10}"       # "        철수" (오른쪽 정렬)
\`\`\`
        `,
        externalLinks: [
          { title: 'Python 문자열 메서드', url: 'https://docs.python.org/3/library/stdtypes.html#string-methods' }
        ]
      }
    },
    {
      id: 'string-practice',
      type: 'code',
      title: '문자열 실습',
      duration: 45,
      content: {
        objectives: [
          '문자열 인덱싱과 슬라이싱을 연습한다',
          '문자열 메서드를 활용한다',
          'f-string으로 포매팅한다'
        ],
        instructions: `
## 문자열 실습

주어진 문자열을 가공하여 요구사항에 맞게 출력하세요.
        `,
        starterCode: `# 주어진 데이터
email = "  JOHN.DOE@EXAMPLE.COM  "
phone = "010-1234-5678"
sentence = "The quick brown fox jumps over the lazy dog"

# 1. 이메일 정리: 공백 제거, 소문자 변환
clean_email = ""  # 결과: "john.doe@example.com"

# 2. 이메일에서 사용자명과 도메인 분리
username = ""     # 결과: "john.doe"
domain = ""       # 결과: "example.com"

# 3. 전화번호에서 하이픈 제거
clean_phone = ""  # 결과: "01012345678"

# 4. 문장에서 단어 개수 세기
word_count = 0    # 결과: 9

# 5. 문장의 첫 글자만 대문자로
capitalized = ""  # 결과: "The Quick Brown Fox..."

# 결과 출력
print(f"정리된 이메일: {clean_email}")
print(f"사용자명: {username}, 도메인: {domain}")
print(f"정리된 전화번호: {clean_phone}")
print(f"단어 개수: {word_count}")
print(f"첫 글자 대문자: {capitalized}")
`,
        solutionCode: `# 주어진 데이터
email = "  JOHN.DOE@EXAMPLE.COM  "
phone = "010-1234-5678"
sentence = "The quick brown fox jumps over the lazy dog"

# 1. 이메일 정리: 공백 제거, 소문자 변환
clean_email = email.strip().lower()  # "john.doe@example.com"

# 2. 이메일에서 사용자명과 도메인 분리
parts = clean_email.split("@")
username = parts[0]    # "john.doe"
domain = parts[1]      # "example.com"

# 3. 전화번호에서 하이픈 제거
clean_phone = phone.replace("-", "")  # "01012345678"

# 4. 문장에서 단어 개수 세기
word_count = len(sentence.split())    # 9

# 5. 문장의 첫 글자만 대문자로
capitalized = sentence.title()  # "The Quick Brown Fox Jumps Over The Lazy Dog"

# 결과 출력
print(f"정리된 이메일: {clean_email}")
print(f"사용자명: {username}, 도메인: {domain}")
print(f"정리된 전화번호: {clean_phone}")
print(f"단어 개수: {word_count}")
print(f"첫 글자 대문자: {capitalized}")
`
      }
    },
    {
      id: 'boolean',
      type: 'reading',
      title: '불린과 비교 연산',
      duration: 30,
      content: {
        objectives: [
          '불린 자료형을 이해한다',
          '비교 연산자를 사용할 수 있다',
          '논리 연산자를 이해한다'
        ],
        markdown: `
## 불린 (Boolean)

### 불린이란?

\`\`\`python
# True와 False 두 가지 값만 존재
is_valid = True
is_empty = False

# 타입 확인
type(True)   # <class 'bool'>
\`\`\`

### 비교 연산자

| 연산자 | 의미 | 예시 | 결과 |
|--------|------|------|------|
| == | 같다 | 5 == 5 | True |
| != | 다르다 | 5 != 3 | True |
| > | 크다 | 5 > 3 | True |
| < | 작다 | 5 < 3 | False |
| >= | 크거나 같다 | 5 >= 5 | True |
| <= | 작거나 같다 | 5 <= 3 | False |

\`\`\`python
# 문자열 비교 (사전순)
"apple" < "banana"    # True
"A" < "a"             # True (ASCII 순서)

# 체이닝 비교
1 < 5 < 10           # True
5 < 3 < 10           # False
\`\`\`

### 논리 연산자

| 연산자 | 의미 | 예시 | 결과 |
|--------|------|------|------|
| and | 둘 다 True | True and False | False |
| or | 하나라도 True | True or False | True |
| not | 반전 | not True | False |

\`\`\`python
age = 25
income = 5000

# and: 둘 다 만족
is_eligible = age >= 20 and income >= 3000  # True

# or: 하나만 만족
can_apply = age < 18 or income >= 10000     # False

# not: 반전
is_minor = not (age >= 18)                   # False
\`\`\`

### Truthy와 Falsy

\`\`\`python
# Falsy 값 (False로 평가)
bool(0)       # False
bool(0.0)     # False
bool("")      # False
bool([])      # False (빈 리스트)
bool({})      # False (빈 딕셔너리)
bool(None)    # False

# Truthy 값 (True로 평가)
bool(1)       # True
bool(-1)      # True
bool("hello") # True
bool([1, 2])  # True
\`\`\`
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
            question: '"Python"[2:5]의 결과는?',
            options: ['Pyt', 'tho', 'thon', 'yth'],
            answer: 1,
            explanation: '인덱스 2부터 4까지(5 미포함)이므로 "tho"입니다.'
          },
          {
            question: '10 // 3의 결과는?',
            options: ['3.333', '3', '1', '30'],
            answer: 1,
            explanation: '//는 정수 나눗셈으로, 소수점 이하를 버리고 3을 반환합니다.'
          },
          {
            question: 'bool([])의 결과는?',
            options: ['True', 'False', 'None', '0'],
            answer: 1,
            explanation: '빈 리스트는 Falsy 값이므로 False입니다.'
          }
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'python-collections',
  title: '자료 구조',
  totalDuration: 180,
  tasks: [
    {
      id: 'lists',
      type: 'reading',
      title: '리스트 (List)',
      duration: 45,
      content: {
        objectives: [
          '리스트를 생성하고 조작할 수 있다',
          '리스트 메서드를 활용할 수 있다',
          '리스트 컴프리헨션을 이해한다'
        ],
        markdown: `
## 리스트 (List)

### 리스트란?

\`\`\`python
# 순서가 있는, 변경 가능한 컬렉션
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]  # 다양한 타입 가능

# 빈 리스트
empty = []
empty = list()
\`\`\`

### 인덱싱과 슬라이싱

\`\`\`python
fruits = ["apple", "banana", "cherry", "date"]

# 인덱싱
fruits[0]     # "apple"
fruits[-1]    # "date"

# 슬라이싱
fruits[1:3]   # ["banana", "cherry"]
fruits[::2]   # ["apple", "cherry"]
\`\`\`

### 리스트 수정

\`\`\`python
fruits = ["apple", "banana"]

# 추가
fruits.append("cherry")       # 끝에 추가
fruits.insert(0, "apricot")   # 특정 위치에 삽입
fruits.extend(["date", "fig"]) # 여러 개 추가

# 삭제
fruits.remove("banana")       # 값으로 삭제
del fruits[0]                 # 인덱스로 삭제
popped = fruits.pop()         # 마지막 요소 제거 및 반환
fruits.clear()                # 전체 삭제

# 수정
fruits[0] = "avocado"         # 인덱스로 수정
\`\`\`

### 리스트 메서드

\`\`\`python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]

# 정렬
numbers.sort()                # 원본 수정
sorted_nums = sorted(numbers) # 새 리스트 반환
numbers.reverse()             # 역순 정렬

# 검색
numbers.index(5)              # 첫 번째 위치 반환
numbers.count(1)              # 개수

# 복사
copy = numbers.copy()         # 얕은 복사
copy = numbers[:]             # 슬라이싱 복사
\`\`\`

### 리스트 컴프리헨션

\`\`\`python
# 기본 형태
squares = [x**2 for x in range(5)]
# [0, 1, 4, 9, 16]

# 조건 포함
evens = [x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]

# 중첩 루프
pairs = [(x, y) for x in [1, 2] for y in ['a', 'b']]
# [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
\`\`\`
        `,
        externalLinks: [
          { title: 'Python 리스트 메서드', url: 'https://docs.python.org/3/tutorial/datastructures.html' }
        ]
      }
    },
    {
      id: 'tuples-sets',
      type: 'reading',
      title: '튜플과 집합',
      duration: 30,
      content: {
        objectives: [
          '튜플의 특징과 사용법을 이해한다',
          '집합의 특징과 연산을 이해한다',
          '리스트, 튜플, 집합의 차이를 구분한다'
        ],
        markdown: `
## 튜플 (Tuple)

### 튜플이란?

\`\`\`python
# 순서가 있는, 변경 불가능한 컬렉션
point = (3, 4)
rgb = (255, 128, 0)
single = (1,)  # 요소가 하나면 콤마 필요

# 괄호 생략 가능
point = 3, 4

# 언패킹
x, y = point
print(x)  # 3
print(y)  # 4
\`\`\`

### 튜플 vs 리스트

| 특성 | 튜플 | 리스트 |
|------|------|--------|
| 생성 | (1, 2, 3) | [1, 2, 3] |
| 변경 | ❌ 불가능 | ✅ 가능 |
| 속도 | 빠름 | 느림 |
| 용도 | 상수, 좌표 | 데이터 컬렉션 |

## 집합 (Set)

### 집합이란?

\`\`\`python
# 순서 없음, 중복 없음, 변경 가능
numbers = {1, 2, 3, 4, 5}
unique = set([1, 1, 2, 2, 3])  # {1, 2, 3}

# 빈 집합 ({}는 딕셔너리!)
empty = set()
\`\`\`

### 집합 연산

\`\`\`python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

# 합집합
a | b           # {1, 2, 3, 4, 5, 6}
a.union(b)

# 교집합
a & b           # {3, 4}
a.intersection(b)

# 차집합
a - b           # {1, 2}
a.difference(b)

# 대칭차집합 (XOR)
a ^ b           # {1, 2, 5, 6}
\`\`\`

### 집합 메서드

\`\`\`python
s = {1, 2, 3}

# 추가/삭제
s.add(4)           # {1, 2, 3, 4}
s.remove(1)        # {2, 3, 4} (없으면 에러)
s.discard(10)      # 없어도 에러 없음

# 멤버십 테스트 (매우 빠름!)
3 in s             # True
\`\`\`
        `
      }
    },
    {
      id: 'dictionaries',
      type: 'reading',
      title: '딕셔너리 (Dictionary)',
      duration: 45,
      content: {
        objectives: [
          '딕셔너리를 생성하고 조작할 수 있다',
          '딕셔너리 메서드를 활용할 수 있다',
          '중첩 딕셔너리를 이해한다'
        ],
        markdown: `
## 딕셔너리 (Dictionary)

### 딕셔너리란?

\`\`\`python
# 키-값 쌍의 컬렉션
person = {
    "name": "김철수",
    "age": 25,
    "city": "서울"
}

# 빈 딕셔너리
empty = {}
empty = dict()
\`\`\`

### 값 접근과 수정

\`\`\`python
person = {"name": "김철수", "age": 25}

# 값 접근
person["name"]         # "김철수"
person.get("name")     # "김철수"
person.get("job", "없음")  # "없음" (기본값)

# 값 수정/추가
person["age"] = 26     # 수정
person["job"] = "개발자"  # 추가

# 값 삭제
del person["job"]
popped = person.pop("age")
\`\`\`

### 딕셔너리 메서드

\`\`\`python
person = {"name": "김철수", "age": 25}

# 키, 값, 쌍 가져오기
person.keys()    # dict_keys(['name', 'age'])
person.values()  # dict_values(['김철수', 25])
person.items()   # dict_items([('name', '김철수'), ('age', 25)])

# 순회
for key in person:
    print(f"{key}: {person[key]}")

for key, value in person.items():
    print(f"{key}: {value}")

# 병합 (Python 3.9+)
a = {"x": 1}
b = {"y": 2}
c = a | b        # {"x": 1, "y": 2}
\`\`\`

### 중첩 딕셔너리

\`\`\`python
users = {
    "user1": {
        "name": "김철수",
        "skills": ["Python", "SQL"]
    },
    "user2": {
        "name": "이영희",
        "skills": ["Java", "Kotlin"]
    }
}

# 접근
users["user1"]["name"]       # "김철수"
users["user1"]["skills"][0]  # "Python"
\`\`\`

### 딕셔너리 컴프리헨션

\`\`\`python
# 기본 형태
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# 조건 포함
even_squares = {x: x**2 for x in range(10) if x % 2 == 0}
# {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}
\`\`\`
        `
      }
    },
    {
      id: 'collections-practice',
      type: 'code',
      title: '자료 구조 실습',
      duration: 45,
      content: {
        objectives: [
          '리스트, 튜플, 딕셔너리를 활용한다',
          '컴프리헨션을 적용한다',
          '실제 데이터를 처리한다'
        ],
        instructions: `
## 자료 구조 실습

학생 데이터를 처리하는 프로그램을 완성하세요.
        `,
        starterCode: `# 학생 데이터
students = [
    {"name": "김철수", "scores": [85, 90, 78]},
    {"name": "이영희", "scores": [92, 88, 95]},
    {"name": "박민수", "scores": [78, 82, 80]},
    {"name": "정수진", "scores": [95, 98, 92]},
]

# 1. 각 학생의 평균 점수 계산
# 결과: {"김철수": 84.33, "이영희": 91.67, ...}
averages = {}

# 2. 평균 90점 이상인 학생 이름 리스트
# 결과: ["이영희", "정수진"]
top_students = []

# 3. 전체 학생의 모든 점수를 하나의 리스트로
# 결과: [85, 90, 78, 92, 88, 95, ...]
all_scores = []

# 4. 전체 최고점과 최저점
highest = 0
lowest = 0

# 결과 출력
print("학생별 평균:", averages)
print("우수 학생:", top_students)
print("전체 점수:", all_scores)
print(f"최고점: {highest}, 최저점: {lowest}")
`,
        solutionCode: `# 학생 데이터
students = [
    {"name": "김철수", "scores": [85, 90, 78]},
    {"name": "이영희", "scores": [92, 88, 95]},
    {"name": "박민수", "scores": [78, 82, 80]},
    {"name": "정수진", "scores": [95, 98, 92]},
]

# 1. 각 학생의 평균 점수 계산 (딕셔너리 컴프리헨션)
averages = {
    s["name"]: round(sum(s["scores"]) / len(s["scores"]), 2)
    for s in students
}

# 2. 평균 90점 이상인 학생 이름 리스트 (리스트 컴프리헨션)
top_students = [name for name, avg in averages.items() if avg >= 90]

# 3. 전체 학생의 모든 점수를 하나의 리스트로
all_scores = [score for s in students for score in s["scores"]]

# 4. 전체 최고점과 최저점
highest = max(all_scores)
lowest = min(all_scores)

# 결과 출력
print("학생별 평균:", averages)
# {'김철수': 84.33, '이영희': 91.67, '박민수': 80.0, '정수진': 95.0}

print("우수 학생:", top_students)
# ['이영희', '정수진']

print("전체 점수:", all_scores)
# [85, 90, 78, 92, 88, 95, 78, 82, 80, 95, 98, 92]

print(f"최고점: {highest}, 최저점: {lowest}")
# 최고점: 98, 최저점: 78
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
            question: '리스트와 튜플의 가장 큰 차이점은?',
            options: ['생성 방법', '변경 가능 여부', '인덱싱 가능 여부', '순서 유무'],
            answer: 1,
            explanation: '튜플은 변경 불가능(immutable)하고, 리스트는 변경 가능(mutable)합니다.'
          },
          {
            question: '집합(set)의 특징으로 틀린 것은?',
            options: ['중복을 허용하지 않는다', '순서가 없다', '인덱싱이 가능하다', '변경 가능하다'],
            answer: 2,
            explanation: '집합은 순서가 없으므로 인덱싱이 불가능합니다.'
          },
          {
            question: 'd = {"a": 1}에서 d.get("b", 0)의 결과는?',
            options: ['None', 'KeyError', '0', '1'],
            answer: 2,
            explanation: 'get 메서드는 키가 없을 때 두 번째 인자(기본값)를 반환합니다.'
          }
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'python-conditionals',
  title: '조건문',
  totalDuration: 180,
  tasks: [
    {
      id: 'if-statement',
      type: 'reading',
      title: 'if 조건문',
      duration: 45,
      content: {
        objectives: [
          'if, elif, else 구조를 이해한다',
          '중첩 조건문을 작성할 수 있다',
          '조건문 최적화를 이해한다'
        ],
        markdown: `
## if 조건문

### 기본 구조

\`\`\`python
age = 20

# 기본 if
if age >= 18:
    print("성인입니다")

# if-else
if age >= 18:
    print("성인입니다")
else:
    print("미성년자입니다")

# if-elif-else
if age < 13:
    print("어린이")
elif age < 20:
    print("청소년")
else:
    print("성인")
\`\`\`

### 들여쓰기 (Indentation)

\`\`\`python
# Python은 들여쓰기로 블록을 구분
if True:
    print("이것은 if 블록")
    print("여기도 if 블록")
print("이것은 if 블록 밖")

# 주의: 일관된 들여쓰기 필요 (공백 4칸 권장)
if True:
    print("OK")
   print("Error!")  # IndentationError
\`\`\`

### 복합 조건

\`\`\`python
age = 25
income = 5000

# and: 둘 다 참이어야 참
if age >= 20 and income >= 3000:
    print("대출 가능")

# or: 하나만 참이면 참
if age < 18 or income < 1000:
    print("미성년자 또는 저소득")

# not: 조건 반전
if not (age < 18):
    print("성인입니다")

# 복합 조건
if (age >= 20 and income >= 3000) or (age >= 30):
    print("조건 충족")
\`\`\`

### 중첩 조건문

\`\`\`python
score = 85

if score >= 60:
    print("합격")
    if score >= 90:
        print("우수")
    elif score >= 80:
        print("양호")
    else:
        print("보통")
else:
    print("불합격")
\`\`\`

### 삼항 연산자

\`\`\`python
age = 20

# 기본 삼항 연산자
status = "성인" if age >= 18 else "미성년자"

# 중첩 삼항 (가독성 주의)
grade = "A" if score >= 90 else "B" if score >= 80 else "C"
\`\`\`

### 조건문 최적화

\`\`\`python
# 나쁜 예
if x == True:  # 불필요
    pass
if x == None:  # 비권장
    pass

# 좋은 예
if x:          # x가 Truthy면 실행
    pass
if x is None:  # None 비교는 is 사용
    pass

# 멤버십 체크
if x == 1 or x == 2 or x == 3:  # 나쁜 예
    pass
if x in [1, 2, 3]:               # 좋은 예
    pass
\`\`\`
        `
      }
    },
    {
      id: 'match-statement',
      type: 'reading',
      title: 'match 문 (Python 3.10+)',
      duration: 30,
      content: {
        objectives: [
          'match-case 구조를 이해한다',
          '패턴 매칭의 장점을 파악한다'
        ],
        markdown: `
## match 문 (Python 3.10+)

### 기본 구조

\`\`\`python
def get_status(code):
    match code:
        case 200:
            return "OK"
        case 404:
            return "Not Found"
        case 500:
            return "Server Error"
        case _:
            return "Unknown"  # default

print(get_status(200))  # OK
print(get_status(999))  # Unknown
\`\`\`

### 패턴 매칭

\`\`\`python
# 값 바인딩
match point:
    case (0, 0):
        print("원점")
    case (0, y):
        print(f"Y축 위: y={y}")
    case (x, 0):
        print(f"X축 위: x={x}")
    case (x, y):
        print(f"일반 점: ({x}, {y})")

# 조건 추가 (guard)
match age:
    case n if n < 0:
        print("잘못된 나이")
    case n if n < 18:
        print("미성년자")
    case _:
        print("성인")
\`\`\`

### if-elif vs match

\`\`\`python
# if-elif 방식
if status == 200:
    return "OK"
elif status == 404:
    return "Not Found"
elif status == 500:
    return "Error"
else:
    return "Unknown"

# match 방식 (더 깔끔)
match status:
    case 200: return "OK"
    case 404: return "Not Found"
    case 500: return "Error"
    case _: return "Unknown"
\`\`\`
        `
      }
    },
    {
      id: 'conditionals-practice',
      type: 'code',
      title: '조건문 실습',
      duration: 60,
      content: {
        objectives: [
          '실제 문제에 조건문을 적용한다',
          '복합 조건을 처리한다'
        ],
        instructions: `
## 조건문 실습

1. 성적 등급 계산기를 만드세요
2. 로그인 검증 함수를 만드세요
3. 할인율 계산기를 만드세요
        `,
        starterCode: `# 1. 성적 등급 계산기
# 90점 이상: A, 80점 이상: B, 70점 이상: C, 60점 이상: D, 그 외: F
def get_grade(score):
    grade = ""
    # 여기에 코드를 작성하세요
    return grade

# 테스트
print(get_grade(95))  # A
print(get_grade(82))  # B
print(get_grade(55))  # F


# 2. 로그인 검증
# 조건: username 3자 이상, password 8자 이상, password에 숫자 포함
def validate_login(username, password):
    is_valid = False
    message = ""
    # 여기에 코드를 작성하세요
    return is_valid, message

# 테스트
print(validate_login("admin", "password123"))  # (True, "로그인 성공")
print(validate_login("ab", "pass"))           # (False, "...")


# 3. 할인율 계산기
# VIP이면서 100,000원 이상: 20% 할인
# VIP이면서 50,000원 이상: 15% 할인
# 일반 고객 100,000원 이상: 10% 할인
# 일반 고객 50,000원 이상: 5% 할인
# 그 외: 할인 없음
def calculate_discount(is_vip, amount):
    discount_rate = 0
    # 여기에 코드를 작성하세요
    return discount_rate

# 테스트
print(calculate_discount(True, 150000))   # 0.2
print(calculate_discount(False, 80000))   # 0.05
`,
        solutionCode: `# 1. 성적 등급 계산기
def get_grade(score):
    if score >= 90:
        grade = "A"
    elif score >= 80:
        grade = "B"
    elif score >= 70:
        grade = "C"
    elif score >= 60:
        grade = "D"
    else:
        grade = "F"
    return grade

# 테스트
print(get_grade(95))  # A
print(get_grade(82))  # B
print(get_grade(55))  # F


# 2. 로그인 검증
def validate_login(username, password):
    # username 검증
    if len(username) < 3:
        return False, "사용자명은 3자 이상이어야 합니다"

    # password 길이 검증
    if len(password) < 8:
        return False, "비밀번호는 8자 이상이어야 합니다"

    # password 숫자 포함 검증
    has_number = any(char.isdigit() for char in password)
    if not has_number:
        return False, "비밀번호에 숫자가 포함되어야 합니다"

    return True, "로그인 성공"

# 테스트
print(validate_login("admin", "password123"))  # (True, "로그인 성공")
print(validate_login("ab", "pass"))           # (False, "사용자명은 3자 이상...")


# 3. 할인율 계산기
def calculate_discount(is_vip, amount):
    if is_vip:
        if amount >= 100000:
            discount_rate = 0.2
        elif amount >= 50000:
            discount_rate = 0.15
        else:
            discount_rate = 0
    else:
        if amount >= 100000:
            discount_rate = 0.1
        elif amount >= 50000:
            discount_rate = 0.05
        else:
            discount_rate = 0
    return discount_rate

# 테스트
print(calculate_discount(True, 150000))   # 0.2
print(calculate_discount(False, 80000))   # 0.05
print(calculate_discount(True, 30000))    # 0
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
            question: 'Python에서 조건문 블록을 구분하는 방법은?',
            options: ['중괄호 {}', '들여쓰기', '괄호 ()', 'begin/end'],
            answer: 1,
            explanation: 'Python은 들여쓰기(indentation)로 코드 블록을 구분합니다.'
          },
          {
            question: '"값" if 조건 else "다른값" 형식의 이름은?',
            options: ['이진 연산자', '삼항 연산자', '조건 표현식', '람다 표현식'],
            answer: 1,
            explanation: '조건 ? 참 : 거짓 형태의 삼항 연산자입니다. Python에서는 "참 if 조건 else 거짓" 형식입니다.'
          },
          {
            question: 'x is None vs x == None 중 권장되는 방식은?',
            options: ['x == None', 'x is None', '둘 다 같음', '둘 다 비권장'],
            answer: 1,
            explanation: 'None과의 비교는 is 연산자를 사용하는 것이 PEP 8 권장사항입니다.'
          }
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'python-loops',
  title: '반복문 & 주간 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'for-loop',
      type: 'reading',
      title: 'for 반복문',
      duration: 45,
      content: {
        objectives: [
          'for 문의 구조를 이해한다',
          'range() 함수를 활용할 수 있다',
          'enumerate(), zip()을 사용할 수 있다'
        ],
        markdown: `
## for 반복문

### 기본 구조

\`\`\`python
# 리스트 순회
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# 문자열 순회
for char in "Hello":
    print(char)

# 딕셔너리 순회
person = {"name": "철수", "age": 25}
for key in person:
    print(f"{key}: {person[key]}")

for key, value in person.items():
    print(f"{key}: {value}")
\`\`\`

### range() 함수

\`\`\`python
# range(끝)
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# range(시작, 끝)
for i in range(2, 5):
    print(i)  # 2, 3, 4

# range(시작, 끝, 간격)
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8

# 역순
for i in range(5, 0, -1):
    print(i)  # 5, 4, 3, 2, 1
\`\`\`

### enumerate()

\`\`\`python
fruits = ["apple", "banana", "cherry"]

# 인덱스와 함께 순회
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
# 0: apple
# 1: banana
# 2: cherry

# 시작 인덱스 지정
for index, fruit in enumerate(fruits, start=1):
    print(f"{index}: {fruit}")
\`\`\`

### zip()

\`\`\`python
names = ["철수", "영희", "민수"]
scores = [85, 92, 78]

# 두 리스트 병렬 순회
for name, score in zip(names, scores):
    print(f"{name}: {score}점")

# 세 개 이상도 가능
ages = [25, 23, 27]
for name, score, age in zip(names, scores, ages):
    print(f"{name}({age}세): {score}점")
\`\`\`
        `
      }
    },
    {
      id: 'while-loop',
      type: 'reading',
      title: 'while 반복문',
      duration: 30,
      content: {
        objectives: [
          'while 문의 구조를 이해한다',
          'break, continue를 활용할 수 있다',
          '무한 루프를 제어할 수 있다'
        ],
        markdown: `
## while 반복문

### 기본 구조

\`\`\`python
# 조건이 True인 동안 반복
count = 0
while count < 5:
    print(count)
    count += 1  # 0, 1, 2, 3, 4
\`\`\`

### break와 continue

\`\`\`python
# break: 루프 완전 종료
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4

# continue: 현재 반복 건너뛰기
for i in range(5):
    if i == 2:
        continue
    print(i)  # 0, 1, 3, 4
\`\`\`

### else 절

\`\`\`python
# for-else: 정상 종료 시 else 실행
for i in range(5):
    if i == 10:  # 조건 불충족
        break
else:
    print("루프 완료!")  # 실행됨

# break로 종료되면 else 실행 안됨
for i in range(5):
    if i == 3:
        break
else:
    print("루프 완료!")  # 실행 안됨
\`\`\`

### 무한 루프

\`\`\`python
# 무한 루프 (주의해서 사용!)
while True:
    user_input = input("종료하려면 'quit' 입력: ")
    if user_input == "quit":
        break
    print(f"입력: {user_input}")
\`\`\`

### for vs while

| 상황 | 권장 |
|------|------|
| 횟수가 정해진 반복 | for |
| 컬렉션 순회 | for |
| 조건 기반 반복 | while |
| 무한 루프 | while True |
        `
      }
    },
    {
      id: 'weekly-project',
      type: 'project',
      title: '주간 프로젝트: 학생 관리 시스템',
      duration: 90,
      content: {
        objectives: [
          'Week 1에서 배운 모든 개념을 종합 활용한다',
          '실제 프로그램을 완성한다'
        ],
        requirements: [
          '**학생 관리 시스템**',
          '',
          '## 기능 요구사항',
          '',
          '1. 학생 추가 (이름, 과목별 점수)',
          '2. 학생 목록 조회',
          '3. 학생 검색 (이름으로)',
          '4. 성적 통계 (평균, 최고점, 최저점)',
          '5. 등급 계산 (A/B/C/D/F)',
          '',
          '## 데이터 구조',
          '```python',
          'students = [',
          '    {"name": "김철수", "scores": {"국어": 85, "영어": 90, "수학": 78}},',
          '    ...',
          ']',
          '```',
          '',
          '## 평가 기준',
          '- 변수와 자료형 활용',
          '- 조건문과 반복문 활용',
          '- 코드 가독성 (변수명, 주석)',
          '- 예외 처리'
        ],
        evaluationCriteria: [
          '기능 완성도',
          '코드 품질',
          '문서화'
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
            question: 'range(2, 8, 2)의 결과는?',
            options: ['[2, 4, 6, 8]', '[2, 4, 6]', '[2, 3, 4, 5, 6, 7]', '[0, 2, 4, 6]'],
            answer: 1,
            explanation: '2부터 8 미만까지 2씩 증가: [2, 4, 6]'
          },
          {
            question: 'break와 continue의 차이점은?',
            options: ['같은 기능이다', 'break는 전체 종료, continue는 현재만 건너뜀', '둘 다 루프를 종료한다', 'continue는 Python에 없다'],
            answer: 1,
            explanation: 'break는 루프 전체를 종료하고, continue는 현재 반복만 건너뛰고 다음 반복을 계속합니다.'
          },
          {
            question: 'enumerate(["a", "b", "c"])의 결과는?',
            options: ['["a", "b", "c"]', '[(0, "a"), (1, "b"), (2, "c")]', '[0, 1, 2]', '{"a": 0, "b": 1, "c": 2}'],
            answer: 1,
            explanation: 'enumerate는 인덱스와 값의 튜플을 반환하는 이터레이터를 생성합니다.'
          }
        ]
      }
    }
  ]
}

export const prereqPython1Week: Week = {
  slug: 'prereq-python-1',
  week: 1,
  phase: 0,
  month: 0,
  access: 'free',
  title: 'Python 기초 1: 변수, 자료형, 조건문, 반복문',
  topics: ['Python 소개', '변수', '자료형', '자료구조', '조건문', '반복문'],
  practice: '학생 관리 시스템',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
