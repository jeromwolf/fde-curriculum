// Phase 0, Week 3: SQL 기초 1 (SELECT, WHERE, ORDER BY)
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'sql-basics',
  title: '데이터베이스 기초와 환경 설정',
  totalDuration: 120,
  tasks: [
    {
      id: 'db-intro',
      type: 'reading',
      title: '데이터베이스 기초 개념',
      duration: 30,
      content: {
        objectives: [
          '데이터베이스의 필요성을 이해한다',
          '관계형 데이터베이스의 기본 개념을 파악한다',
          'SQL의 역할과 종류를 이해한다'
        ],
        markdown: `
## 데이터베이스란?

**데이터베이스(Database)**는 체계적으로 구조화된 데이터의 집합입니다.

### 왜 데이터베이스가 필요한가?

엑셀 파일로 데이터를 관리할 때의 문제점:
- 대용량 데이터 처리 어려움
- 여러 사람이 동시에 수정 불가
- 데이터 무결성 보장 어려움
- 복잡한 검색과 분석 한계

### 관계형 데이터베이스 (RDBMS)

데이터를 **테이블(Table)** 형태로 저장:

\`\`\`
employees 테이블:
+----+--------+------------+--------+
| id | name   | department | salary |
+----+--------+------------+--------+
| 1  | 김철수 | 개발팀     | 5000   |
| 2  | 이영희 | 마케팅팀   | 4500   |
| 3  | 박민수 | 개발팀     | 5500   |
+----+--------+------------+--------+
\`\`\`

### 핵심 용어

| 용어 | 설명 | 엑셀 비유 |
|------|------|----------|
| 테이블 (Table) | 데이터를 저장하는 구조 | 시트 |
| 행 (Row) | 하나의 레코드/데이터 | 행 |
| 열 (Column) | 데이터의 속성 | 열 |
| 기본 키 (Primary Key) | 각 행을 고유하게 식별 | - |
| 외래 키 (Foreign Key) | 다른 테이블과의 관계 | - |

### 주요 RDBMS 종류

| 데이터베이스 | 특징 | 사용처 |
|-------------|------|--------|
| PostgreSQL | 오픈소스, 기능 풍부 | 웹 서비스, 분석 |
| MySQL | 오픈소스, 빠름 | 웹 서비스 |
| SQLite | 파일 기반, 가벼움 | 모바일, 임베디드 |

### SQL이란?

**SQL (Structured Query Language)**
- 데이터베이스와 대화하는 언어
- 1970년대 IBM에서 개발
- 거의 모든 RDBMS에서 표준으로 사용

SQL의 종류:
- **DDL** (Data Definition Language): CREATE, ALTER, DROP
- **DML** (Data Manipulation Language): SELECT, INSERT, UPDATE, DELETE
- **DCL** (Data Control Language): GRANT, REVOKE

이번 주는 **SELECT**에 집중합니다!
        `,
        externalLinks: [
          { title: 'W3Schools SQL Tutorial', url: 'https://www.w3schools.com/sql/' },
          { title: 'SQLBolt', url: 'https://sqlbolt.com/' }
        ]
      }
    },
    {
      id: 'sql-setup',
      type: 'code',
      title: 'SQL 실습 환경 구축',
      duration: 40,
      content: {
        objectives: [
          'SQL 실습 환경을 선택하고 설정한다',
          '샘플 데이터베이스를 생성한다',
          '첫 번째 SQL 쿼리를 실행한다'
        ],
        instructions: `
## SQL 실습 환경 구축

### 옵션 1: 온라인 SQL 편집기 (추천 - 초보자)

**SQLite Online**
- URL: https://sqliteonline.com/
- 설치 없이 바로 사용 가능

**DB Fiddle**
- URL: https://www.db-fiddle.com/
- PostgreSQL, MySQL 지원

### 옵션 2: PostgreSQL 로컬 설치

**macOS:**
\`\`\`bash
brew install postgresql@15
brew services start postgresql@15
createdb mydb
\`\`\`

**Windows:**
https://www.postgresql.org/download/windows/ 에서 다운로드

### 샘플 테이블 생성

아래 SQL을 실행하세요:
        `,
        starterCode: `-- employees 테이블
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    salary INTEGER,
    hire_date DATE
);

-- 샘플 데이터 삽입
INSERT INTO employees (name, department, salary, hire_date) VALUES
('김철수', '개발팀', 5000, '2020-03-15'),
('이영희', '마케팅팀', 4500, '2019-07-01'),
('박민수', '개발팀', 5500, '2018-11-20'),
('정수진', '인사팀', 4800, '2021-01-10'),
('최동현', '개발팀', 6000, '2017-05-05');

-- 첫 번째 SELECT
SELECT * FROM employees;`,
        solutionCode: `-- 결과:
-- id | name   | department | salary | hire_date
-- ---+--------+------------+--------+------------
-- 1  | 김철수 | 개발팀     | 5000   | 2020-03-15
-- 2  | 이영희 | 마케팅팀   | 4500   | 2019-07-01
-- 3  | 박민수 | 개발팀     | 5500   | 2018-11-20
-- 4  | 정수진 | 인사팀     | 4800   | 2021-01-10
-- 5  | 최동현 | 개발팀     | 6000   | 2017-05-05`
      }
    },
    {
      id: 'select-basics',
      type: 'reading',
      title: 'SELECT 문 기초',
      duration: 30,
      content: {
        objectives: [
          'SELECT 문의 기본 구조를 이해한다',
          '특정 열만 선택하는 방법을 익힌다',
          '별칭(Alias)을 사용할 수 있다'
        ],
        markdown: `
## SELECT 문 기초

### 기본 구조

\`\`\`sql
SELECT 열이름 FROM 테이블명;
\`\`\`

### 모든 열 선택

\`\`\`sql
-- * 는 "모든 열"을 의미
SELECT * FROM employees;
\`\`\`

### 특정 열만 선택

\`\`\`sql
SELECT name, department FROM employees;
\`\`\`

### 결과:
\`\`\`
name   | department
-------+-----------
김철수 | 개발팀
이영희 | 마케팅팀
...
\`\`\`

### 열 별칭 (Alias)

\`\`\`sql
-- AS 키워드로 별칭 지정
SELECT name AS 이름, salary AS 급여 FROM employees;

-- AS 생략 가능
SELECT name 이름, salary 급여 FROM employees;
\`\`\`

### 연산과 함께 사용

\`\`\`sql
-- 연봉 계산 (월급 * 12)
SELECT
    name AS 이름,
    salary AS 월급,
    salary * 12 AS 연봉
FROM employees;
\`\`\`

### SQL 작성 규칙

1. **대소문자**: 키워드는 대문자 권장 (SELECT, FROM)
2. **세미콜론**: 문장 끝에 \`;\` 붙이기
3. **공백/줄바꿈**: 가독성을 위해 자유롭게 사용
        `
      }
    },
    {
      id: 'day1-quiz',
      type: 'quiz',
      title: 'Day 1 퀴즈',
      duration: 10,
      content: {
        questions: [
          {
            question: '관계형 데이터베이스에서 하나의 데이터 레코드를 무엇이라 하나요?',
            options: ['열 (Column)', '행 (Row)', '테이블 (Table)', '스키마 (Schema)'],
            answer: 1,
            explanation: '행(Row)은 하나의 데이터 레코드를 의미합니다.'
          },
          {
            question: 'SELECT * FROM employees; 에서 * 의 의미는?',
            options: ['첫 번째 열만', '모든 열', '모든 행', '랜덤 선택'],
            answer: 1,
            explanation: '* (asterisk)는 테이블의 모든 열을 선택한다는 의미입니다.'
          },
          {
            question: 'SELECT 문은 어떤 종류의 SQL에 속하나요?',
            options: ['DDL', 'DML', 'DCL', 'TCL'],
            answer: 1,
            explanation: 'SELECT는 DML(Data Manipulation Language)에 속합니다.'
          }
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'sql-where',
  title: 'WHERE 절: 조건으로 필터링',
  totalDuration: 120,
  tasks: [
    {
      id: 'where-basics',
      type: 'reading',
      title: 'WHERE 절 기초',
      duration: 30,
      content: {
        objectives: [
          'WHERE 절의 역할을 이해한다',
          '비교 연산자를 사용할 수 있다',
          '문자열, 숫자, 날짜를 비교할 수 있다'
        ],
        markdown: `
## WHERE 절 기초

WHERE 절은 조건에 맞는 행만 선택합니다.

### 기본 문법

\`\`\`sql
SELECT 열 FROM 테이블 WHERE 조건;
\`\`\`

### 비교 연산자

| 연산자 | 의미 | 예제 |
|--------|------|------|
| = | 같다 | department = '개발팀' |
| <> 또는 != | 같지 않다 | department <> '개발팀' |
| > | 크다 | salary > 5000 |
| < | 작다 | salary < 5000 |
| >= | 크거나 같다 | salary >= 5000 |
| <= | 작거나 같다 | salary <= 5000 |

### 예제

\`\`\`sql
-- 개발팀 직원만 조회
SELECT * FROM employees WHERE department = '개발팀';

-- 급여가 5000 이상인 직원
SELECT * FROM employees WHERE salary >= 5000;

-- 2020년 이후 입사자
SELECT * FROM employees WHERE hire_date > '2020-01-01';
\`\`\`

### 문자열 비교 주의사항

\`\`\`sql
-- 문자열은 작은따옴표 사용!
SELECT * FROM employees WHERE name = '김철수';  -- O
SELECT * FROM employees WHERE name = "김철수";  -- X (에러)
\`\`\`
        `
      }
    },
    {
      id: 'where-logical',
      type: 'reading',
      title: '논리 연산자: AND, OR, NOT',
      duration: 30,
      content: {
        objectives: [
          'AND, OR, NOT 연산자를 이해한다',
          '복합 조건을 작성할 수 있다',
          '연산자 우선순위를 이해한다'
        ],
        markdown: `
## 논리 연산자

### AND 연산자

**모든 조건**이 참이어야 선택됩니다.

\`\`\`sql
-- 개발팀이면서 급여 5000 이상
SELECT * FROM employees
WHERE department = '개발팀' AND salary >= 5000;
\`\`\`

### OR 연산자

**하나 이상**의 조건이 참이면 선택됩니다.

\`\`\`sql
-- 개발팀이거나 마케팅팀
SELECT * FROM employees
WHERE department = '개발팀' OR department = '마케팅팀';
\`\`\`

### NOT 연산자

조건을 **부정**합니다.

\`\`\`sql
-- 개발팀이 아닌 직원
SELECT * FROM employees
WHERE NOT department = '개발팀';

-- 또는
SELECT * FROM employees
WHERE department <> '개발팀';
\`\`\`

### 우선순위

1. NOT
2. AND
3. OR

⚠️ 복잡한 조건은 괄호 사용!

\`\`\`sql
-- 괄호 없이 (잘못된 결과 가능)
SELECT * FROM employees
WHERE department = '개발팀' OR department = '마케팅팀' AND salary > 5000;

-- 괄호 사용 (명확함)
SELECT * FROM employees
WHERE (department = '개발팀' OR department = '마케팅팀') AND salary > 5000;
\`\`\`
        `
      }
    },
    {
      id: 'where-special',
      type: 'reading',
      title: '특수 연산자: IN, BETWEEN, LIKE',
      duration: 30,
      content: {
        objectives: [
          'IN 연산자로 여러 값을 비교한다',
          'BETWEEN으로 범위를 지정한다',
          'LIKE로 패턴 매칭을 수행한다'
        ],
        markdown: `
## 특수 연산자

### IN 연산자

여러 값 중 하나와 일치하는지 확인합니다.

\`\`\`sql
-- OR 대신 IN 사용
SELECT * FROM employees
WHERE department IN ('개발팀', '마케팅팀', '재무팀');
\`\`\`

### BETWEEN 연산자

범위 내의 값을 선택합니다 (경계값 포함).

\`\`\`sql
-- 급여 4500 이상 5500 이하
SELECT * FROM employees
WHERE salary BETWEEN 4500 AND 5500;

-- 동일한 결과
SELECT * FROM employees
WHERE salary >= 4500 AND salary <= 5500;
\`\`\`

### LIKE 연산자

패턴 매칭으로 문자열을 검색합니다.

| 와일드카드 | 의미 | 예제 |
|-----------|------|------|
| % | 0개 이상의 문자 | '김%' → 김으로 시작 |
| _ | 정확히 1개 문자 | '김_' → 김X (2글자) |

\`\`\`sql
-- 김으로 시작하는 이름
SELECT * FROM employees WHERE name LIKE '김%';

-- 팀으로 끝나는 부서
SELECT * FROM employees WHERE department LIKE '%팀';

-- 이름에 '수' 포함
SELECT * FROM employees WHERE name LIKE '%수%';
\`\`\`

### IS NULL / IS NOT NULL

\`\`\`sql
-- NULL 확인은 = 가 아닌 IS NULL 사용!
SELECT * FROM employees WHERE email IS NULL;
SELECT * FROM employees WHERE email IS NOT NULL;
\`\`\`
        `
      }
    },
    {
      id: 'day2-quiz',
      type: 'quiz',
      title: 'Day 2 퀴즈',
      duration: 10,
      content: {
        questions: [
          {
            question: "department IN ('개발팀', '마케팅팀')과 동일한 결과를 내는 조건은?",
            options: [
              "department = '개발팀' AND department = '마케팅팀'",
              "department = '개발팀' OR department = '마케팅팀'",
              "department BETWEEN '개발팀' AND '마케팅팀'",
              "department LIKE '개발팀%'"
            ],
            answer: 1,
            explanation: 'IN은 여러 OR 조건을 간결하게 표현합니다.'
          },
          {
            question: "name LIKE '김%'는 어떤 이름을 찾나요?",
            options: ['김으로 끝나는', '김을 포함하는', '김으로 시작하는', '정확히 김만'],
            answer: 2,
            explanation: "%는 0개 이상의 문자를 의미합니다. '김%'는 김으로 시작하는 모든 문자열입니다."
          },
          {
            question: 'NULL 값을 확인하는 올바른 방법은?',
            options: ['column = NULL', "column = 'NULL'", 'column IS NULL', 'column == NULL'],
            answer: 2,
            explanation: 'NULL은 IS NULL로만 비교할 수 있습니다.'
          }
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'sql-order-limit',
  title: 'ORDER BY, LIMIT, DISTINCT',
  totalDuration: 120,
  tasks: [
    {
      id: 'order-by',
      type: 'reading',
      title: 'ORDER BY: 결과 정렬',
      duration: 30,
      content: {
        objectives: [
          'ORDER BY로 결과를 정렬한다',
          'ASC/DESC의 차이를 이해한다',
          '여러 열로 정렬할 수 있다'
        ],
        markdown: `
## ORDER BY: 결과 정렬

### 기본 문법

\`\`\`sql
SELECT 열 FROM 테이블 ORDER BY 열 [ASC|DESC];
\`\`\`

- **ASC**: 오름차순 (기본값)
- **DESC**: 내림차순

### 오름차순 정렬

\`\`\`sql
-- 급여 오름차순 (낮은 것부터)
SELECT name, salary FROM employees ORDER BY salary;
SELECT name, salary FROM employees ORDER BY salary ASC;
\`\`\`

### 내림차순 정렬

\`\`\`sql
-- 급여 내림차순 (높은 것부터)
SELECT name, salary FROM employees ORDER BY salary DESC;
\`\`\`

### 여러 열로 정렬

\`\`\`sql
-- 부서별 오름차순, 같은 부서 내에서 급여 내림차순
SELECT name, department, salary
FROM employees
ORDER BY department ASC, salary DESC;
\`\`\`

### 날짜 정렬

\`\`\`sql
-- 최근 입사자부터
SELECT name, hire_date FROM employees ORDER BY hire_date DESC;
\`\`\`
        `
      }
    },
    {
      id: 'limit-offset',
      type: 'reading',
      title: 'LIMIT: 결과 수 제한',
      duration: 25,
      content: {
        objectives: [
          'LIMIT으로 결과 수를 제한한다',
          'OFFSET으로 건너뛰기를 구현한다',
          '페이지네이션을 이해한다'
        ],
        markdown: `
## LIMIT: 결과 수 제한

### 기본 문법

\`\`\`sql
SELECT 열 FROM 테이블 LIMIT 개수;
\`\`\`

### 상위 N개 조회

\`\`\`sql
-- 급여 상위 5명
SELECT name, salary
FROM employees
ORDER BY salary DESC
LIMIT 5;
\`\`\`

### OFFSET: 건너뛰기

\`\`\`sql
-- 처음 2개 건너뛰고 3개 조회
SELECT * FROM employees LIMIT 3 OFFSET 2;
\`\`\`

### 페이지네이션

\`\`\`sql
-- 1페이지 (1~10번)
SELECT * FROM employees ORDER BY id LIMIT 10 OFFSET 0;

-- 2페이지 (11~20번)
SELECT * FROM employees ORDER BY id LIMIT 10 OFFSET 10;

-- 공식: OFFSET = (페이지번호 - 1) * LIMIT
\`\`\`

### 실용 예제

\`\`\`sql
-- 가장 비싼 상품 3개
SELECT name, price FROM products ORDER BY price DESC LIMIT 3;

-- 최근 입사한 직원 5명
SELECT name, hire_date FROM employees ORDER BY hire_date DESC LIMIT 5;
\`\`\`
        `
      }
    },
    {
      id: 'distinct',
      type: 'reading',
      title: 'DISTINCT: 중복 제거',
      duration: 25,
      content: {
        objectives: [
          'DISTINCT로 중복을 제거한다',
          'COUNT(DISTINCT)를 활용한다'
        ],
        markdown: `
## DISTINCT: 중복 제거

### 기본 문법

\`\`\`sql
SELECT DISTINCT 열 FROM 테이블;
\`\`\`

### 단일 열 중복 제거

\`\`\`sql
-- 모든 부서 목록 (중복 제거)
SELECT DISTINCT department FROM employees;
-- 결과: 개발팀, 마케팅팀, 인사팀
\`\`\`

### 여러 열 중복 제거

\`\`\`sql
-- 부서와 급여 조합의 고유값
SELECT DISTINCT department, salary FROM employees;
\`\`\`

### COUNT와 DISTINCT

\`\`\`sql
-- 총 직원 수
SELECT COUNT(*) FROM employees;  -- 5

-- 고유 부서 수
SELECT COUNT(DISTINCT department) FROM employees;  -- 3
\`\`\`

### 주의사항

- DISTINCT는 전체 결과에 적용됩니다
- 성능에 영향을 줄 수 있음 (대량 데이터 시)
        `
      }
    },
    {
      id: 'day3-practice',
      type: 'code',
      title: 'Day 3 실습',
      duration: 30,
      content: {
        objectives: [
          'ORDER BY, LIMIT, DISTINCT를 종합 활용한다'
        ],
        instructions: `
## 실습 과제

아래 쿼리를 작성하세요:

1. 급여 상위 3명
2. 부서별로 정렬, 같은 부서는 이름순
3. 고유 부서 목록
4. 개발팀 중 급여 상위 2명
        `,
        starterCode: `-- 1. 급여 상위 3명


-- 2. 부서별로 정렬, 같은 부서는 이름순


-- 3. 고유 부서 목록


-- 4. 개발팀 중 급여 상위 2명
`,
        solutionCode: `-- 1. 급여 상위 3명
SELECT name, salary
FROM employees
ORDER BY salary DESC
LIMIT 3;

-- 2. 부서별로 정렬, 같은 부서는 이름순
SELECT name, department
FROM employees
ORDER BY department, name;

-- 3. 고유 부서 목록
SELECT DISTINCT department FROM employees;

-- 4. 개발팀 중 급여 상위 2명
SELECT name, salary
FROM employees
WHERE department = '개발팀'
ORDER BY salary DESC
LIMIT 2;`
      }
    },
    {
      id: 'day3-quiz',
      type: 'quiz',
      title: 'Day 3 퀴즈',
      duration: 10,
      content: {
        questions: [
          {
            question: 'ORDER BY salary DESC의 의미는?',
            options: ['급여 오름차순', '급여 내림차순', '급여로 그룹화', '급여 중복 제거'],
            answer: 1,
            explanation: 'DESC는 내림차순(Descending)입니다.'
          },
          {
            question: 'LIMIT 5 OFFSET 10의 의미는?',
            options: ['처음 5개', '10개 건너뛰고 5개', '5개 건너뛰고 10개', '5~10번째'],
            answer: 1,
            explanation: 'OFFSET 10은 처음 10개를 건너뛰고, LIMIT 5는 그 이후 5개를 가져옵니다.'
          },
          {
            question: 'COUNT(DISTINCT department)는 무엇을 반환하나요?',
            options: ['모든 부서 이름', '고유 부서의 개수', '부서별 직원 수', '에러'],
            answer: 1,
            explanation: 'COUNT(DISTINCT column)는 중복을 제거한 고유값의 개수를 반환합니다.'
          }
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'sql-functions',
  title: 'SQL 내장 함수',
  totalDuration: 120,
  tasks: [
    {
      id: 'string-functions',
      type: 'reading',
      title: '문자열 함수',
      duration: 30,
      content: {
        objectives: [
          '문자열 함수를 활용할 수 있다',
          'UPPER, LOWER, LENGTH 등을 사용한다'
        ],
        markdown: `
## 문자열 함수

### 대소문자 변환

\`\`\`sql
SELECT UPPER(name) FROM employees;  -- 대문자
SELECT LOWER(email) FROM employees; -- 소문자
\`\`\`

### 문자열 길이

\`\`\`sql
SELECT name, LENGTH(name) AS 글자수 FROM employees;
\`\`\`

### 문자열 추출

\`\`\`sql
-- SUBSTRING(문자열, 시작위치, 길이)
SELECT SUBSTRING(email, 1, 3) FROM employees;

-- LEFT / RIGHT
SELECT LEFT(name, 1) AS 성 FROM employees;
\`\`\`

### 문자열 변환

\`\`\`sql
-- TRIM: 공백 제거
SELECT TRIM('  hello  ');  -- 'hello'

-- REPLACE: 치환
SELECT REPLACE(department, '팀', ' Team') FROM employees;

-- CONCAT: 결합
SELECT CONCAT(name, ' - ', department) FROM employees;
\`\`\`
        `
      }
    },
    {
      id: 'numeric-functions',
      type: 'reading',
      title: '숫자 함수',
      duration: 30,
      content: {
        objectives: [
          '숫자 함수를 활용할 수 있다',
          'ROUND, CEIL, FLOOR 등을 사용한다'
        ],
        markdown: `
## 숫자 함수

### 반올림/올림/내림

\`\`\`sql
SELECT ROUND(3.567, 2);  -- 3.57
SELECT CEIL(3.2);        -- 4
SELECT FLOOR(3.8);       -- 3
\`\`\`

### 집계 함수 (미리보기)

\`\`\`sql
-- 합계
SELECT SUM(salary) FROM employees;

-- 평균
SELECT AVG(salary) FROM employees;

-- 최대/최소
SELECT MAX(salary), MIN(salary) FROM employees;

-- 개수
SELECT COUNT(*) FROM employees;
\`\`\`

### 실용 예제

\`\`\`sql
-- 급여 통계
SELECT
    COUNT(*) AS 직원수,
    ROUND(AVG(salary), 0) AS 평균급여,
    MAX(salary) AS 최고급여,
    MIN(salary) AS 최저급여
FROM employees;
\`\`\`
        `
      }
    },
    {
      id: 'date-functions',
      type: 'reading',
      title: '날짜 함수',
      duration: 30,
      content: {
        objectives: [
          '날짜 함수를 활용할 수 있다',
          'EXTRACT, DATE_PART 등을 사용한다'
        ],
        markdown: `
## 날짜 함수

### 현재 날짜/시간

\`\`\`sql
SELECT CURRENT_DATE;      -- 2026-01-15
SELECT CURRENT_TIMESTAMP; -- 2026-01-15 10:30:45
\`\`\`

### 날짜 부분 추출

\`\`\`sql
SELECT EXTRACT(YEAR FROM hire_date) AS 입사년도 FROM employees;
SELECT EXTRACT(MONTH FROM hire_date) AS 입사월 FROM employees;
\`\`\`

### 날짜 계산

\`\`\`sql
-- 근무일수 계산
SELECT
    name,
    hire_date,
    CURRENT_DATE - hire_date AS 근무일수
FROM employees;
\`\`\`

### 실용 예제

\`\`\`sql
-- 2020년 입사자
SELECT * FROM employees
WHERE EXTRACT(YEAR FROM hire_date) = 2020;

-- 근속 연수 계산
SELECT
    name,
    EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM hire_date) AS 근속연수
FROM employees;
\`\`\`
        `
      }
    },
    {
      id: 'day4-quiz',
      type: 'quiz',
      title: 'Day 4 퀴즈',
      duration: 10,
      content: {
        questions: [
          {
            question: "UPPER('hello')의 결과는?",
            options: ['hello', 'HELLO', 'Hello', '5'],
            answer: 1,
            explanation: 'UPPER는 문자열을 대문자로 변환합니다.'
          },
          {
            question: 'ROUND(3.567, 1)의 결과는?',
            options: ['3.5', '3.6', '4', '3.57'],
            answer: 1,
            explanation: 'ROUND(3.567, 1)은 소수점 1자리로 반올림하여 3.6입니다.'
          },
          {
            question: "EXTRACT(YEAR FROM '2020-03-15')의 결과는?",
            options: ['2020', '03', '15', '2020-03-15'],
            answer: 0,
            explanation: 'EXTRACT(YEAR FROM date)는 연도를 추출합니다.'
          }
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'sql-project',
  title: '주간 프로젝트: 데이터 분석 보고서',
  totalDuration: 150,
  tasks: [
    {
      id: 'project-intro',
      type: 'reading',
      title: '프로젝트 소개',
      duration: 20,
      content: {
        objectives: [
          '이번 주 배운 내용을 종합 활용한다',
          '실제 데이터 분석 쿼리를 작성한다'
        ],
        markdown: `
## 주간 프로젝트: 직원 급여 분석 보고서

### 프로젝트 개요

employees 테이블을 활용하여 데이터 분석 보고서를 작성합니다.

### 분석 목표

1. 전체 직원 현황 파악
2. 부서별 통계 분석
3. 급여 분포 분석
4. 인사이트 도출

### 사용할 기술

- SELECT, WHERE, ORDER BY
- LIMIT, DISTINCT
- 문자열/숫자/날짜 함수
- 별칭(Alias)
        `
      }
    },
    {
      id: 'project-task',
      type: 'project',
      title: '분석 쿼리 작성',
      duration: 90,
      content: {
        objectives: [
          '다양한 분석 쿼리를 작성한다',
          '결과를 해석한다'
        ],
        requirements: [
          '1. 전체 직원 수, 평균 급여, 최고/최저 급여 조회',
          '2. 부서별 직원 수 조회',
          '3. 급여 상위 3명의 이름과 부서 조회',
          '4. 개발팀 직원 중 2020년 이후 입사자 조회',
          '5. 근무일수가 가장 긴 직원 조회',
          '6. 이름이 2글자인 직원 조회'
        ],
        evaluationCriteria: [
          'SQL 문법 정확성',
          '결과의 정확성',
          '쿼리 가독성'
        ]
      }
    },
    {
      id: 'project-solution',
      type: 'code',
      title: '프로젝트 정답',
      duration: 30,
      content: {
        objectives: [
          '정답 쿼리를 확인하고 비교한다'
        ],
        instructions: '직접 풀어본 후 확인하세요!',
        starterCode: `-- 여기에 직접 작성해보세요`,
        solutionCode: `-- 1. 전체 직원 수, 평균 급여, 최고/최저 급여
SELECT
    COUNT(*) AS 직원수,
    ROUND(AVG(salary), 0) AS 평균급여,
    MAX(salary) AS 최고급여,
    MIN(salary) AS 최저급여
FROM employees;

-- 2. 부서별 직원 수
SELECT department, COUNT(*) AS 인원
FROM employees
GROUP BY department
ORDER BY 인원 DESC;

-- 3. 급여 상위 3명
SELECT name, department, salary
FROM employees
ORDER BY salary DESC
LIMIT 3;

-- 4. 개발팀 직원 중 2020년 이후 입사자
SELECT name, hire_date
FROM employees
WHERE department = '개발팀'
  AND hire_date >= '2020-01-01';

-- 5. 근무일수가 가장 긴 직원
SELECT name, hire_date, CURRENT_DATE - hire_date AS 근무일수
FROM employees
ORDER BY hire_date ASC
LIMIT 1;

-- 6. 이름이 2글자인 직원
SELECT * FROM employees
WHERE LENGTH(name) = 2;`
      }
    },
    {
      id: 'week-quiz',
      type: 'quiz',
      title: '주간 종합 퀴즈',
      duration: 10,
      content: {
        questions: [
          {
            question: 'SQL 실행 순서로 올바른 것은?',
            options: [
              'SELECT → FROM → WHERE',
              'FROM → SELECT → WHERE',
              'FROM → WHERE → SELECT',
              'WHERE → FROM → SELECT'
            ],
            answer: 2,
            explanation: 'SQL 실행 순서: FROM(테이블 선택) → WHERE(필터링) → SELECT(열 선택)'
          },
          {
            question: '2020년 이후 입사자를 조회하는 올바른 WHERE 조건은?',
            options: [
              "hire_date = '2020'",
              "hire_date >= '2020-01-01'",
              "YEAR(hire_date) >= '2020'",
              "hire_date LIKE '2020%'"
            ],
            answer: 1,
            explanation: "날짜 비교는 비교 연산자를 사용합니다."
          },
          {
            question: 'SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3의 결과는?',
            options: [
              '급여가 가장 낮은 3명',
              '급여가 가장 높은 3명',
              '이름순 상위 3명',
              '랜덤 3명'
            ],
            answer: 1,
            explanation: 'ORDER BY salary DESC는 급여 내림차순, LIMIT 3은 상위 3개입니다.'
          }
        ]
      }
    }
  ]
}

export const prereqSql1Week: Week = {
  slug: 'prereq-sql-1',
  week: 3,
  phase: 0,
  month: 0,
  access: 'free',
  title: 'SQL 기초 1: 데이터 조회의 기본',
  topics: ['데이터베이스 개념', 'SELECT', 'WHERE', 'ORDER BY', 'LIMIT', 'DISTINCT', 'SQL 함수'],
  practice: '직원 급여 분석 보고서',
  totalDuration: 630,
  days: [day1, day2, day3, day4, day5]
}
