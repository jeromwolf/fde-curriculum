// Phase 0, Week 5: 영어 문서 독해
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'english-day1',
  title: '기술 문서 읽기 기초',
  totalDuration: 90,
  tasks: [
    {
      id: 'tech-doc-intro',
      type: 'reading',
      title: '기술 문서의 특징',
      duration: 30,
      content: {
        objectives: [
          '기술 문서의 구조를 이해한다',
          '기술 영어의 특징을 파악한다',
          '효과적인 문서 읽기 전략을 익힌다'
        ],
        markdown: `
## 기술 문서란?

**기술 문서(Technical Documentation)**는 소프트웨어, API, 라이브러리의 사용법을 설명하는 문서입니다.

### 기술 문서의 종류

| 종류 | 설명 | 예시 |
|------|------|------|
| **API Reference** | 함수/메서드 상세 설명 | Python docs, MDN |
| **Tutorial** | 단계별 학습 가이드 | Getting Started |
| **How-to Guide** | 특정 문제 해결 방법 | How to deploy... |
| **Conceptual** | 개념과 아키텍처 설명 | Architecture Overview |

### 기술 문서의 구조

\`\`\`
1. Overview / Introduction
   - 무엇인지, 왜 필요한지

2. Getting Started / Quick Start
   - 설치, 기본 설정

3. Core Concepts
   - 핵심 개념 설명

4. API Reference
   - 상세 사양

5. Examples / Recipes
   - 실제 사용 예제

6. Troubleshooting / FAQ
   - 자주 발생하는 문제
\`\`\`

## 기술 영어의 특징

### 1. 명령형 문장이 많음
\`\`\`
- Run the following command...
- Install the package...
- Create a new file...
- Set the environment variable...
\`\`\`

### 2. 수동태 사용
\`\`\`
- The data is stored in...
- The function is called when...
- This value should be set to...
\`\`\`

### 3. 조건문 구조
\`\`\`
- If you want to..., you need to...
- When the condition is met...
- In case of failure...
\`\`\`

### 4. 약어와 전문 용어
\`\`\`
API - Application Programming Interface
SDK - Software Development Kit
CLI - Command Line Interface
env - environment
config - configuration
deps - dependencies
\`\`\`

## 효과적인 읽기 전략

### Skimming (훑어읽기)
- 제목과 소제목 먼저 확인
- 코드 블록 위치 파악
- 전체 구조 이해

### Scanning (찾아읽기)
- 필요한 정보만 빠르게 찾기
- Ctrl+F 활용
- 키워드 중심으로 검색

### Intensive Reading (정독)
- 중요한 부분만 집중 읽기
- 코드와 설명 대조
- 예제 직접 실행
`
      }
    },
    {
      id: 'common-patterns',
      type: 'reading',
      title: '자주 나오는 표현 패턴',
      duration: 30,
      content: {
        objectives: [
          '기술 문서에서 자주 사용되는 표현을 익힌다',
          '문맥에 따른 의미 차이를 이해한다'
        ],
        markdown: `
## 설치/설정 관련 표현

### 설치 명령
\`\`\`
Install X using npm/pip/brew:
$ npm install package-name

To install X, run:
$ pip install package-name
\`\`\`

**핵심 표현:**
- \`Install X using Y\` - Y를 사용하여 X 설치
- \`To install X, run...\` - X를 설치하려면 실행
- \`Make sure X is installed\` - X가 설치되어 있는지 확인

### 설정 관련
\`\`\`
Set the environment variable:
$ export API_KEY=your-key

Configure the following settings:
- database_url: your connection string
- debug: true/false
\`\`\`

**핵심 표현:**
- \`Set X to Y\` - X를 Y로 설정
- \`Configure the following\` - 다음을 설정
- \`Specify X in Y\` - Y에서 X를 지정

## 함수/API 설명 표현

### 함수 설명
\`\`\`
Returns the sum of two numbers.
Accepts an optional callback function.
Raises ValueError if the input is invalid.
\`\`\`

**핵심 표현:**
- \`Returns X\` - X를 반환
- \`Accepts X\` - X를 받음/허용
- \`Raises X\` / \`Throws X\` - X 예외 발생
- \`Takes X as argument\` - X를 인자로 받음

### 매개변수 설명
\`\`\`
Parameters:
  - name (str): The user's name
  - age (int, optional): The user's age. Defaults to None.

Arguments:
  - timeout (number): Maximum wait time in milliseconds
\`\`\`

**핵심 표현:**
- \`optional\` - 선택적 (필수 아님)
- \`required\` - 필수
- \`Defaults to X\` - 기본값은 X

## 주의/경고 표현

### 주의 사항
\`\`\`
Note: This feature is experimental.
Warning: This will delete all data.
Important: Make sure to backup first.
Caution: This operation cannot be undone.
\`\`\`

**핵심 표현:**
- \`Note:\` - 참고/주의
- \`Warning:\` - 경고
- \`Important:\` - 중요
- \`Deprecated:\` - 더 이상 사용되지 않음

## 조건/상황 표현

### 조건문
\`\`\`
If you're using Windows, run:
When the server starts, it will...
In case of an error, check the logs.
Unless otherwise specified, the default is...
\`\`\`

**핵심 표현:**
- \`If you're using X\` - X를 사용하는 경우
- \`When X happens\` - X가 발생하면
- \`In case of X\` - X의 경우
- \`Unless otherwise specified\` - 별도 지정이 없으면
`
      }
    },
    {
      id: 'english-practice1',
      type: 'code',
      title: '실습: 공식 문서 읽기',
      duration: 30,
      content: {
        objectives: [
          'Python 공식 문서를 읽고 이해한다',
          '실제 문서에서 정보를 찾는다'
        ],
        markdown: `
## 실습: Python 공식 문서 읽기

### 예제 문서
다음은 Python \`json\` 모듈의 실제 문서 일부입니다:

\`\`\`
json.dumps(obj, *, skipkeys=False, ensure_ascii=True,
           check_circular=True, allow_nan=True, cls=None,
           indent=None, separators=None, default=None,
           sort_keys=False, **kw)

Serialize obj to a JSON formatted str using this conversion table.

If skipkeys is true (default: False), then dict keys that are
not of a basic type (str, int, float, bool, None) will be
skipped instead of raising a TypeError.

If ensure_ascii is true (the default), the output is guaranteed
to have all incoming non-ASCII characters escaped.

If indent is a non-negative integer or string, then JSON array
elements and object members will be pretty-printed with that
indent level.
\`\`\`

### 문서 분석 연습

**1. 함수 시그니처 이해**
- 첫 번째 매개변수: \`obj\` - 변환할 객체
- \`*\` 뒤의 매개변수들은 키워드 전용 (keyword-only)
- \`**kw\` - 추가 키워드 인자

**2. 기본값 파악**
- \`skipkeys=False\` - 기본적으로 비기본 타입 키는 에러
- \`ensure_ascii=True\` - 기본적으로 ASCII 이스케이프
- \`indent=None\` - 기본적으로 압축 출력

**3. 핵심 표현 해석**
- "Serialize obj to..." = obj를 ...로 직렬화
- "If X is true" = X가 참이면
- "default: X" = 기본값은 X
- "will be skipped" = 건너뛰게 됨

### 연습 문제

1. \`json.dumps()\`의 결과는 무슨 타입인가?
   → "JSON formatted str" = 문자열

2. 한글을 포함한 데이터를 읽기 쉽게 출력하려면?
   → \`ensure_ascii=False\`, \`indent=2\`

3. 정렬된 출력을 원하면?
   → \`sort_keys=True\`
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'english-day2',
  title: 'API 문서와 에러 메시지',
  totalDuration: 90,
  tasks: [
    {
      id: 'api-doc-reading',
      type: 'reading',
      title: 'API 문서 읽는 법',
      duration: 30,
      content: {
        objectives: [
          'REST API 문서 구조를 이해한다',
          'HTTP 메서드와 상태 코드를 이해한다',
          '요청/응답 형식을 파악한다'
        ],
        markdown: `
## REST API 문서 구조

### 기본 구성 요소

\`\`\`
GET /api/users/{id}

Retrieves a user by their unique identifier.

Path Parameters:
  - id (string, required): The user's unique identifier

Query Parameters:
  - include (string, optional): Additional fields to include
    Values: "profile", "settings"

Headers:
  - Authorization (string, required): Bearer token

Response:
  200 OK: Successfully retrieved user
  404 Not Found: User does not exist
  401 Unauthorized: Invalid or missing token
\`\`\`

### HTTP 메서드

| 메서드 | 의미 | 예시 |
|--------|------|------|
| GET | 조회 | Get user details |
| POST | 생성 | Create a new user |
| PUT | 전체 수정 | Update user |
| PATCH | 부분 수정 | Update user email |
| DELETE | 삭제 | Delete user |

### HTTP 상태 코드

**성공 (2xx)**
- \`200 OK\` - 성공
- \`201 Created\` - 생성 성공
- \`204 No Content\` - 성공, 응답 본문 없음

**클라이언트 오류 (4xx)**
- \`400 Bad Request\` - 잘못된 요청
- \`401 Unauthorized\` - 인증 필요
- \`403 Forbidden\` - 권한 없음
- \`404 Not Found\` - 리소스 없음
- \`429 Too Many Requests\` - 요청 제한 초과

**서버 오류 (5xx)**
- \`500 Internal Server Error\` - 서버 내부 오류
- \`502 Bad Gateway\` - 게이트웨이 오류
- \`503 Service Unavailable\` - 서비스 불가

## 요청/응답 예시 읽기

### 요청 예시
\`\`\`
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
\`\`\`

**해석:**
- \`-X POST\` - POST 메서드 사용
- \`-H\` - 헤더 설정
- \`-d\` - 요청 본문 (data)

### 응답 예시
\`\`\`json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}
\`\`\`
`
      }
    },
    {
      id: 'error-messages',
      type: 'reading',
      title: '에러 메시지 해석하기',
      duration: 30,
      content: {
        objectives: [
          '일반적인 에러 메시지를 이해한다',
          '에러 메시지에서 해결책을 찾는다'
        ],
        markdown: `
## 에러 메시지 구조

### 기본 구조
\`\`\`
ErrorType: Error description
  at function_name (file_path:line:column)
  at another_function (file_path:line:column)
\`\`\`

### Python 에러 예시

\`\`\`python
Traceback (most recent call last):
  File "main.py", line 10, in <module>
    result = divide(10, 0)
  File "main.py", line 5, in divide
    return a / b
ZeroDivisionError: division by zero
\`\`\`

**해석:**
- \`Traceback\` - 에러 발생 경로
- \`most recent call last\` - 가장 최근 호출이 마지막
- \`File "main.py", line 10\` - main.py 파일 10번째 줄
- \`ZeroDivisionError\` - 에러 타입
- \`division by zero\` - 에러 설명 (0으로 나눔)

## 자주 발생하는 에러

### Python 에러

| 에러 | 의미 | 해결책 |
|------|------|--------|
| \`NameError: name 'x' is not defined\` | 정의되지 않은 변수 | 변수 선언 확인 |
| \`TypeError: 'int' object is not iterable\` | 반복 불가 객체 | 타입 확인 |
| \`KeyError: 'key'\` | 딕셔너리에 키 없음 | .get() 사용 |
| \`ModuleNotFoundError\` | 모듈 없음 | pip install |
| \`IndentationError\` | 들여쓰기 오류 | 공백 확인 |

### JavaScript 에러

| 에러 | 의미 | 해결책 |
|------|------|--------|
| \`ReferenceError: x is not defined\` | 정의되지 않은 변수 | 선언 확인 |
| \`TypeError: Cannot read property of undefined\` | undefined 접근 | null 체크 |
| \`SyntaxError: Unexpected token\` | 문법 오류 | 괄호/따옴표 확인 |

## 에러 메시지 검색 팁

### 효과적인 검색 방법

1. **에러 타입 + 메시지로 검색**
   \`\`\`
   "TypeError: Cannot read property 'map' of undefined"
   \`\`\`

2. **기술 스택 추가**
   \`\`\`
   python KeyError dictionary
   react useEffect infinite loop
   \`\`\`

3. **Stack Overflow 활용**
   - 질문 먼저 읽기
   - 답변의 투표 수 확인
   - 코드 예제 참고

4. **GitHub Issues 검색**
   - 라이브러리별 알려진 문제
   - 해결 방법/워크어라운드
`
      }
    },
    {
      id: 'english-quiz1',
      type: 'quiz',
      title: 'Day 1-2 퀴즈',
      duration: 30,
      content: {
        questions: [
          {
            question: '"Returns the sum of two numbers"의 의미는?',
            options: [
              '두 숫자를 더한다',
              '두 숫자의 합을 반환한다',
              '두 숫자를 입력받는다',
              '두 숫자를 출력한다'
            ],
            answer: 1,
            explanation: 'Returns X는 "X를 반환한다"라는 의미입니다.'
          },
          {
            question: '"Defaults to None"의 의미는?',
            options: [
              '기본값이 없다',
              '반드시 지정해야 한다',
              '기본값은 None이다',
              'None을 사용할 수 없다'
            ],
            answer: 2,
            explanation: 'Defaults to X는 "기본값은 X이다"라는 의미입니다.'
          },
          {
            question: 'HTTP 상태 코드 404의 의미는?',
            options: [
              '서버 오류',
              '인증 필요',
              '리소스를 찾을 수 없음',
              '요청 성공'
            ],
            answer: 2,
            explanation: '404 Not Found는 요청한 리소스가 존재하지 않음을 의미합니다.'
          },
          {
            question: '"TypeError: Cannot read property of undefined"의 원인은?',
            options: [
              '타입 선언 오류',
              'undefined인 객체의 속성에 접근',
              '함수 호출 오류',
              '문법 오류'
            ],
            answer: 1,
            explanation: 'undefined 값에서 속성을 읽으려 할 때 발생하는 에러입니다.'
          }
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'english-day3',
  title: '실전 문서 읽기 연습',
  totalDuration: 90,
  tasks: [
    {
      id: 'github-readme',
      type: 'reading',
      title: 'GitHub README 읽기',
      duration: 30,
      content: {
        objectives: [
          'GitHub 프로젝트 README 구조를 이해한다',
          '프로젝트 사용법을 파악한다'
        ],
        markdown: `
## GitHub README 구조

### 일반적인 README 섹션

\`\`\`markdown
# Project Name
> Short description of what this project does

## Features
- Feature 1
- Feature 2

## Installation
\\\`\\\`\\\`bash
npm install project-name
\\\`\\\`\\\`

## Usage
\\\`\\\`\\\`javascript
const project = require('project-name');
project.doSomething();
\\\`\\\`\\\`

## Configuration
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| debug  | bool | false   | Enable debug mode |

## Contributing
Pull requests are welcome.

## License
MIT
\`\`\`

### 핵심 섹션별 해석

**Installation**
- \`npm install\` / \`pip install\` - 패키지 설치
- \`git clone\` - 저장소 복제
- \`Prerequisites\` - 선행 조건/요구사항

**Usage**
- \`Basic usage\` - 기본 사용법
- \`Advanced usage\` - 고급 사용법
- \`Examples\` - 예제 코드

**Configuration**
- \`Options\` / \`Settings\` - 설정 옵션
- \`Environment variables\` - 환경 변수
- \`Config file\` - 설정 파일

## 배지(Badge) 읽기

\`\`\`
![npm version](https://badge.fury.io/js/package.svg)
![Build Status](https://travis-ci.org/user/repo.svg)
![Coverage](https://codecov.io/gh/user/repo/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
\`\`\`

| 배지 | 의미 |
|------|------|
| npm version | 현재 패키지 버전 |
| Build Status | CI 빌드 상태 |
| Coverage | 테스트 커버리지 |
| License | 라이선스 종류 |
| Downloads | 다운로드 수 |
`
      }
    },
    {
      id: 'changelog-reading',
      type: 'reading',
      title: 'Changelog와 Release Notes',
      duration: 30,
      content: {
        objectives: [
          'Changelog 형식을 이해한다',
          '버전 변경 사항을 파악한다'
        ],
        markdown: `
## Changelog 형식

### Semantic Versioning

버전 형식: \`MAJOR.MINOR.PATCH\`

- **MAJOR** (1.0.0 → 2.0.0): 호환성 깨지는 변경
- **MINOR** (1.0.0 → 1.1.0): 새 기능 추가 (호환 유지)
- **PATCH** (1.0.0 → 1.0.1): 버그 수정

### Changelog 예시

\`\`\`markdown
# Changelog

## [2.0.0] - 2024-01-15
### Breaking Changes
- Removed deprecated \`oldFunction()\`
- Changed default value of \`timeout\` from 30 to 60

### Added
- New \`search()\` method for filtering results
- Support for TypeScript

### Changed
- Improved performance of data loading
- Updated dependencies

### Deprecated
- \`legacyMode\` option will be removed in v3.0

### Fixed
- Fixed memory leak in event handler
- Resolved issue with Unicode characters

### Security
- Updated vulnerable dependency
\`\`\`

### 핵심 용어

| 용어 | 의미 |
|------|------|
| **Breaking Changes** | 기존 코드 호환성 깨는 변경 |
| **Added** | 새로 추가된 기능 |
| **Changed** | 기존 기능의 변경 |
| **Deprecated** | 더 이상 권장하지 않음 (향후 제거) |
| **Removed** | 제거된 기능 |
| **Fixed** | 버그 수정 |
| **Security** | 보안 관련 수정 |

## 마이그레이션 가이드 읽기

\`\`\`markdown
# Migration Guide: v1 to v2

## Breaking Changes

### Configuration Format
Before (v1):
\\\`\\\`\\\`javascript
config.set('key', 'value');
\\\`\\\`\\\`

After (v2):
\\\`\\\`\\\`javascript
config.options.key = 'value';
\\\`\\\`\\\`

### Removed APIs
- \`deprecated.method()\` - Use \`newMethod()\` instead

## Steps to Migrate
1. Update your package version
2. Replace deprecated API calls
3. Update configuration format
4. Run tests to verify
\`\`\`

**핵심 표현:**
- \`Before / After\` - 변경 전/후
- \`Use X instead\` - 대신 X를 사용
- \`Steps to migrate\` - 마이그레이션 단계
`
      }
    },
    {
      id: 'doc-practice',
      type: 'code',
      title: '종합 실습: 실제 문서 분석',
      duration: 30,
      content: {
        objectives: [
          '실제 라이브러리 문서를 읽고 분석한다',
          '필요한 정보를 빠르게 찾는다'
        ],
        markdown: `
## 실습: requests 라이브러리 문서

### 문서 예시

\`\`\`
requests.get(url, params=None, **kwargs)

Sends a GET request.

Parameters:
  - url: URL for the new Request object.
  - params: (optional) Dictionary, list of tuples or bytes
    to send in the query string for the Request.
  - **kwargs: Optional arguments that request takes.

Returns:
  Response object

Raises:
  requests.exceptions.RequestException: In case of a
  network problem (e.g. DNS failure, refused connection, etc)

Example:
>>> import requests
>>> r = requests.get('https://api.github.com/user',
                     auth=('user', 'pass'))
>>> r.status_code
200
>>> r.headers['content-type']
'application/json; charset=utf8'
>>> r.encoding
'utf-8'
>>> r.text
'{"type":"User"...'
>>> r.json()
{'private_gists': 419, 'total_private_repos': 77, ...}
\`\`\`

### 분석 연습

**1. 함수 기능 파악**
- 질문: 이 함수는 무엇을 하나요?
- 답: HTTP GET 요청을 보냄 (Sends a GET request)

**2. 매개변수 이해**
- \`url\`: 필수, 요청 URL
- \`params\`: 선택적, 쿼리 스트링 파라미터
- \`**kwargs\`: 추가 옵션들

**3. 반환값 확인**
- Response 객체를 반환
- \`.status_code\`, \`.headers\`, \`.text\`, \`.json()\` 사용 가능

**4. 예외 처리**
- 네트워크 문제 시 \`RequestException\` 발생

### 연습 문제

1. POST 요청을 보내려면 어떤 함수를 사용하나요?
   → \`requests.post()\`

2. JSON 응답을 딕셔너리로 파싱하려면?
   → \`response.json()\`

3. 요청에 헤더를 추가하려면?
   → \`headers\` 매개변수 사용 (\`**kwargs\`)

### 실제 문서 찾아보기

다음 질문에 대한 답을 requests 공식 문서에서 찾아보세요:
- 타임아웃을 설정하는 방법
- 프록시를 사용하는 방법
- 파일을 업로드하는 방법
`
      }
    }
  ]
}

export const prereqEnglishWeek: Week = {
  slug: 'prereq-english',
  week: 5,
  phase: 0,
  month: 0,
  access: 'free',
  title: '영어 문서 독해',
  topics: ['기술 문서', 'API 문서', '에러 메시지', 'GitHub README', 'Changelog'],
  practice: '실제 문서 분석',
  totalDuration: 270,
  days: [day1, day2, day3]
}
