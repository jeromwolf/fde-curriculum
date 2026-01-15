// Phase 0, Week 4: SQL 기초 2 (JOIN과 집계)
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'sql2-day1',
  title: 'GROUP BY와 집계 함수',
  totalDuration: 135,
  tasks: [
    {
      id: 'aggregate-functions',
      type: 'reading',
      title: '집계 함수 (Aggregate Functions)',
      duration: 30,
      content: {
        objectives: [
          'COUNT, SUM, AVG, MAX, MIN 함수의 사용법을 익힌다',
          'NULL 값이 집계 함수에 미치는 영향을 이해한다',
          '여러 집계 함수를 조합하여 통계를 계산할 수 있다'
        ],
        markdown: `
## 집계 함수란?

여러 행의 데이터를 하나의 결과로 계산하는 함수입니다.

### 주요 집계 함수

| 함수 | 설명 | 예제 |
|------|------|------|
| COUNT() | 행 개수 | COUNT(*), COUNT(column) |
| SUM() | 합계 | SUM(salary) |
| AVG() | 평균 | AVG(salary) |
| MAX() | 최대값 | MAX(salary) |
| MIN() | 최소값 | MIN(salary) |

## COUNT 함수

\`\`\`sql
-- 전체 행 개수
SELECT COUNT(*) FROM employees;
-- 결과: 8

-- 특정 열의 NULL이 아닌 값 개수
SELECT COUNT(email) FROM employees;

-- 고유값 개수
SELECT COUNT(DISTINCT department) FROM employees;
-- 결과: 4
\`\`\`

## SUM / AVG 함수

\`\`\`sql
-- 급여 총합
SELECT SUM(salary) FROM employees;
-- 결과: 39500

-- 평균 급여
SELECT AVG(salary) FROM employees;
-- 결과: 4937.5

-- 반올림된 평균
SELECT ROUND(AVG(salary), 0) AS 평균급여 FROM employees;
-- 결과: 4938
\`\`\`

## MAX / MIN 함수

\`\`\`sql
-- 최고/최저 급여
SELECT MAX(salary) AS 최고급여, MIN(salary) AS 최저급여 FROM employees;
-- 결과: 6000, 4200

-- 가장 최근 입사일
SELECT MAX(hire_date) FROM employees;

-- 가장 오래된 입사일
SELECT MIN(hire_date) FROM employees;
\`\`\`

## 집계 함수와 NULL

\`\`\`sql
-- NULL은 집계에서 제외됨
SELECT AVG(salary) FROM employees;  -- NULL 행 제외

-- NULL 포함하여 계산하려면
SELECT AVG(COALESCE(salary, 0)) FROM employees;
\`\`\`

## 여러 집계 함수 조합

\`\`\`sql
SELECT
    COUNT(*) AS 직원수,
    SUM(salary) AS 급여총합,
    ROUND(AVG(salary), 0) AS 평균급여,
    MAX(salary) AS 최고급여,
    MIN(salary) AS 최저급여,
    MAX(salary) - MIN(salary) AS 급여차이
FROM employees;
\`\`\`
`
      }
    },
    {
      id: 'group-by',
      type: 'reading',
      title: 'GROUP BY: 데이터 그룹화',
      duration: 35,
      content: {
        objectives: [
          'GROUP BY 절의 기본 문법을 이해한다',
          '여러 열로 그룹화하는 방법을 익힌다',
          'GROUP BY 사용 시 주의사항을 이해한다'
        ],
        markdown: `
## GROUP BY란?

특정 열을 기준으로 데이터를 그룹화하여 집계합니다.

### 기본 문법
\`\`\`sql
SELECT 그룹열, 집계함수
FROM 테이블
GROUP BY 그룹열;
\`\`\`

## 기본 예제

\`\`\`sql
-- 부서별 직원 수
SELECT department, COUNT(*) AS 인원수
FROM employees
GROUP BY department;
\`\`\`

### 결과:
\`\`\`
department | 인원수
-----------+-------
개발팀     | 4
마케팅팀   | 2
인사팀     | 1
재무팀     | 1
\`\`\`

## 부서별 급여 통계

\`\`\`sql
SELECT
    department AS 부서,
    COUNT(*) AS 인원,
    SUM(salary) AS 급여총합,
    ROUND(AVG(salary), 0) AS 평균급여,
    MAX(salary) AS 최고급여,
    MIN(salary) AS 최저급여
FROM employees
GROUP BY department
ORDER BY 평균급여 DESC;
\`\`\`

## 여러 열로 그룹화

\`\`\`sql
-- 부서와 입사연도별 인원
SELECT
    department,
    EXTRACT(YEAR FROM hire_date) AS 입사년도,
    COUNT(*) AS 인원
FROM employees
GROUP BY department, EXTRACT(YEAR FROM hire_date)
ORDER BY department, 입사년도;
\`\`\`

## GROUP BY 주의사항

⚠️ SELECT에 포함된 열은 반드시 GROUP BY에 있거나 집계 함수여야 합니다!

\`\`\`sql
-- 에러: name은 GROUP BY에 없고 집계 함수도 아님
SELECT name, department, COUNT(*)
FROM employees
GROUP BY department;

-- 올바른 방법
SELECT department, COUNT(*)
FROM employees
GROUP BY department;
\`\`\`

## 실행 순서

1. FROM
2. WHERE
3. **GROUP BY**
4. HAVING
5. SELECT
6. ORDER BY

\`\`\`sql
SELECT department, AVG(salary)  -- 5
FROM employees                   -- 1
WHERE salary > 4000              -- 2
GROUP BY department              -- 3
ORDER BY AVG(salary) DESC;       -- 6
\`\`\`
`
      }
    },
    {
      id: 'having',
      type: 'reading',
      title: 'HAVING: 그룹 조건 필터링',
      duration: 25,
      content: {
        objectives: [
          'HAVING과 WHERE의 차이를 이해한다',
          'HAVING 절에서 집계 함수를 사용할 수 있다',
          'WHERE와 HAVING을 함께 사용할 수 있다'
        ],
        markdown: `
## HAVING vs WHERE

| WHERE | HAVING |
|-------|--------|
| 개별 행 필터링 | 그룹 결과 필터링 |
| GROUP BY 전 실행 | GROUP BY 후 실행 |
| 집계 함수 사용 불가 | 집계 함수 사용 가능 |

## 기본 문법

\`\`\`sql
SELECT 그룹열, 집계함수
FROM 테이블
GROUP BY 그룹열
HAVING 집계조건;
\`\`\`

## 예제: 인원이 2명 이상인 부서

\`\`\`sql
SELECT department, COUNT(*) AS 인원수
FROM employees
GROUP BY department
HAVING COUNT(*) >= 2;
\`\`\`

### 결과:
\`\`\`
department | 인원수
-----------+-------
개발팀     | 4
마케팅팀   | 2
\`\`\`

## 예제: 평균 급여 5000 이상인 부서

\`\`\`sql
SELECT department, ROUND(AVG(salary), 0) AS 평균급여
FROM employees
GROUP BY department
HAVING AVG(salary) >= 5000;
\`\`\`

## WHERE와 HAVING 함께 사용

\`\`\`sql
-- 2020년 이후 입사자 중 (WHERE)
-- 2명 이상인 부서만 (HAVING)
SELECT department, COUNT(*) AS 인원수
FROM employees
WHERE hire_date >= '2020-01-01'
GROUP BY department
HAVING COUNT(*) >= 2;
\`\`\`

## 복잡한 예제

\`\`\`sql
-- 급여 4500 이상인 직원들 중에서
-- 부서별로 그룹화하여
-- 평균 급여가 5000 이상이고 인원이 2명 이상인 부서
SELECT
    department,
    COUNT(*) AS 인원,
    ROUND(AVG(salary), 0) AS 평균급여
FROM employees
WHERE salary >= 4500
GROUP BY department
HAVING AVG(salary) >= 5000 AND COUNT(*) >= 2
ORDER BY 평균급여 DESC;
\`\`\`

## 흔한 실수

\`\`\`sql
-- 잘못: WHERE에서 집계 함수 사용
SELECT department, COUNT(*)
FROM employees
WHERE COUNT(*) >= 2    -- 에러!
GROUP BY department;

-- 올바름: HAVING 사용
SELECT department, COUNT(*)
FROM employees
GROUP BY department
HAVING COUNT(*) >= 2;
\`\`\`
`
      }
    },
    {
      id: 'group-by-practice',
      type: 'code',
      title: 'GROUP BY 실습',
      duration: 35,
      content: {
        objectives: [
          'GROUP BY와 집계 함수를 활용한 실습을 수행한다',
          'HAVING을 사용하여 그룹 조건을 필터링한다',
          '날짜별 그룹화를 연습한다'
        ],
        markdown: `
## 준비: 추가 테이블 생성

\`\`\`sql
-- orders 테이블 (주문)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    product_id INTEGER,
    quantity INTEGER,
    order_date DATE,
    status VARCHAR(20)
);

INSERT INTO orders (customer_name, product_id, quantity, order_date, status) VALUES
('고객A', 1, 2, '2024-01-15', 'completed'),
('고객B', 2, 5, '2024-01-16', 'completed'),
('고객A', 3, 3, '2024-01-17', 'pending'),
('고객C', 1, 1, '2024-01-18', 'completed'),
('고객B', 4, 2, '2024-01-19', 'cancelled'),
('고객A', 2, 4, '2024-01-20', 'completed'),
('고객D', 3, 6, '2024-01-21', 'completed'),
('고객C', 5, 2, '2024-01-22', 'pending'),
('고객B', 1, 3, '2024-01-23', 'completed'),
('고객A', 4, 1, '2024-01-24', 'completed');
\`\`\`

## 실습 1: 기본 GROUP BY

\`\`\`sql
-- 1. 부서별 직원 수와 평균 급여
SELECT
    department,
    COUNT(*) AS 직원수,
    ROUND(AVG(salary), 0) AS 평균급여
FROM employees
GROUP BY department
ORDER BY 평균급여 DESC;

-- 2. 카테고리별 상품 통계
SELECT
    category,
    COUNT(*) AS 상품수,
    SUM(stock) AS 총재고,
    ROUND(AVG(price), 0) AS 평균가격
FROM products
GROUP BY category;

-- 3. 고객별 주문 현황
SELECT
    customer_name,
    COUNT(*) AS 주문수,
    SUM(quantity) AS 총수량
FROM orders
GROUP BY customer_name
ORDER BY 총수량 DESC;
\`\`\`

## 실습 2: HAVING 활용

\`\`\`sql
-- 1. 2명 이상인 부서
SELECT department, COUNT(*) AS 인원
FROM employees
GROUP BY department
HAVING COUNT(*) >= 2;

-- 2. 주문 3건 이상인 고객
SELECT customer_name, COUNT(*) AS 주문수
FROM orders
GROUP BY customer_name
HAVING COUNT(*) >= 3;

-- 3. 평균 가격 15만원 이상인 카테고리
SELECT category, ROUND(AVG(price), 0) AS 평균가격
FROM products
GROUP BY category
HAVING AVG(price) >= 150000;
\`\`\`

## 실습 3: 날짜별 그룹화

\`\`\`sql
-- 1. 입사년도별 직원 수
SELECT
    EXTRACT(YEAR FROM hire_date) AS 입사년도,
    COUNT(*) AS 인원
FROM employees
GROUP BY EXTRACT(YEAR FROM hire_date)
ORDER BY 입사년도;

-- 2. 주문 상태별 통계
SELECT
    status,
    COUNT(*) AS 주문수,
    SUM(quantity) AS 총수량
FROM orders
GROUP BY status;
\`\`\`

## 도전 과제

1. 부서별 최고/최저 급여 차이 계산
2. 완료된(completed) 주문만 고객별로 집계
3. 입사년도별 평균 급여 추이 분석
`
      }
    },
    {
      id: 'day1-quiz',
      type: 'quiz',
      title: 'Day 1 퀴즈: GROUP BY',
      duration: 10,
      content: {
        questions: [
          {
            question: 'COUNT(*)와 COUNT(column)의 차이는?',
            options: [
              '차이 없음',
              'COUNT(*)는 NULL 포함, COUNT(column)는 NULL 제외',
              'COUNT(column)이 더 빠름',
              'COUNT(*)는 에러'
            ],
            answer: 1,
            explanation: 'COUNT(*)는 전체 행 수, COUNT(column)는 해당 열이 NULL이 아닌 행 수를 반환합니다.'
          },
          {
            question: 'GROUP BY 사용 시 SELECT에 올 수 있는 것은?',
            options: [
              '아무 열이나',
              'GROUP BY에 있는 열만',
              'GROUP BY 열 또는 집계 함수',
              '집계 함수만'
            ],
            answer: 2,
            explanation: 'SELECT에는 GROUP BY에 있는 열이거나 집계 함수(COUNT, SUM 등)만 사용할 수 있습니다.'
          },
          {
            question: 'WHERE와 HAVING의 차이는?',
            options: [
              '차이 없음',
              'WHERE는 행, HAVING은 그룹 필터링',
              'HAVING이 먼저 실행됨',
              'WHERE에서만 집계 함수 사용 가능'
            ],
            answer: 1,
            explanation: 'WHERE는 GROUP BY 전에 개별 행을 필터링하고, HAVING은 GROUP BY 후에 그룹 결과를 필터링합니다.'
          },
          {
            question: 'AVG(salary)에서 NULL 값은?',
            options: [
              '0으로 처리',
              '계산에서 제외',
              '에러 발생',
              '평균에 영향'
            ],
            answer: 1,
            explanation: '집계 함수는 NULL 값을 계산에서 제외합니다. NULL을 0으로 처리하려면 COALESCE를 사용하세요.'
          }
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'sql2-day2',
  title: 'JOIN 기초: INNER JOIN',
  totalDuration: 140,
  tasks: [
    {
      id: 'join-intro',
      type: 'reading',
      title: 'JOIN이란?',
      duration: 30,
      content: {
        objectives: [
          '여러 테이블을 연결하는 이유를 이해한다',
          'JOIN의 종류를 파악한다',
          '실습용 테이블을 준비한다'
        ],
        markdown: `
## 왜 JOIN이 필요한가?

관계형 데이터베이스는 데이터를 여러 테이블로 나누어 저장합니다.

### 예: 주문 시스템
\`\`\`
orders 테이블:
+----+-------------+------------+----------+
| id | customer_id | product_id | quantity |
+----+-------------+------------+----------+
| 1  | 101         | 1          | 2        |
| 2  | 102         | 3          | 1        |
+----+-------------+------------+----------+

customers 테이블:
+-----+--------+
| id  | name   |
+-----+--------+
| 101 | 김철수 |
| 102 | 이영희 |
+-----+--------+

products 테이블:
+----+--------+-------+
| id | name   | price |
+----+--------+-------+
| 1  | 노트북 | 1200  |
| 3  | 마우스 | 45    |
+----+--------+-------+
\`\`\`

**질문**: "누가 어떤 상품을 얼마나 샀는지?"
→ 세 테이블을 연결해야 답할 수 있음!

## JOIN의 종류

| 종류 | 설명 |
|------|------|
| INNER JOIN | 양쪽 테이블에 모두 있는 데이터만 |
| LEFT JOIN | 왼쪽 테이블 전체 + 오른쪽 매칭 |
| RIGHT JOIN | 오른쪽 테이블 전체 + 왼쪽 매칭 |
| FULL OUTER JOIN | 양쪽 테이블 전체 |
| CROSS JOIN | 모든 조합 (카테시안 곱) |

## 실습용 테이블 준비

\`\`\`sql
-- departments 테이블 (부서 정보)
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    budget INTEGER
);

INSERT INTO departments (name, location, budget) VALUES
('개발팀', '서울', 100000),
('마케팅팀', '서울', 80000),
('인사팀', '부산', 50000),
('재무팀', '서울', 60000),
('디자인팀', '대전', 40000);  -- 직원 없는 부서

-- employees 테이블 업데이트 (department_id 추가)
ALTER TABLE employees ADD COLUMN department_id INTEGER;

UPDATE employees SET department_id = 1 WHERE department = '개발팀';
UPDATE employees SET department_id = 2 WHERE department = '마케팅팀';
UPDATE employees SET department_id = 3 WHERE department = '인사팀';
UPDATE employees SET department_id = 4 WHERE department = '재무팀';
\`\`\`

이제 JOIN을 배워봅시다!
`
      }
    },
    {
      id: 'inner-join',
      type: 'reading',
      title: 'INNER JOIN 기본',
      duration: 35,
      content: {
        objectives: [
          'INNER JOIN의 기본 문법을 익힌다',
          '테이블 별칭 사용법을 이해한다',
          'WHERE, ORDER BY와 함께 사용할 수 있다'
        ],
        markdown: `
## INNER JOIN이란?

두 테이블에서 **조건이 일치하는 행만** 결합합니다.

### 기본 문법
\`\`\`sql
SELECT 열
FROM 테이블1
INNER JOIN 테이블2 ON 테이블1.열 = 테이블2.열;
\`\`\`

## 기본 예제

\`\`\`sql
-- 직원과 부서 정보 조인
SELECT
    e.name AS 직원명,
    e.salary AS 급여,
    d.name AS 부서명,
    d.location AS 위치
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
\`\`\`

### 결과:
\`\`\`
직원명 | 급여 | 부서명   | 위치
-------+------+----------+-----
김철수 | 5000 | 개발팀   | 서울
이영희 | 4500 | 마케팅팀 | 서울
박민수 | 5500 | 개발팀   | 서울
...
\`\`\`

## 테이블 별칭 사용

\`\`\`sql
-- 별칭 없이 (길고 불편)
SELECT employees.name, departments.name
FROM employees
INNER JOIN departments ON employees.department_id = departments.id;

-- 별칭 사용 (권장)
SELECT e.name, d.name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
\`\`\`

## 열 이름 충돌 해결

\`\`\`sql
-- 양쪽 테이블에 같은 이름의 열이 있을 때
SELECT
    e.name AS 직원명,  -- employees.name
    d.name AS 부서명   -- departments.name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
\`\`\`

## WHERE, ORDER BY와 함께 사용

\`\`\`sql
-- 서울 근무자만, 급여 순 정렬
SELECT
    e.name AS 직원명,
    e.salary AS 급여,
    d.name AS 부서명
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE d.location = '서울'
ORDER BY e.salary DESC;
\`\`\`

## INNER JOIN의 특징

- 조인 조건이 일치하는 행만 결과에 포함
- 일치하지 않는 행은 제외됨
- departments에 '디자인팀'이 있지만 직원이 없으면 결과에 안 나옴

\`\`\`sql
-- 디자인팀은 결과에 없음 (직원이 없어서)
SELECT d.name, COUNT(e.id)
FROM departments d
INNER JOIN employees e ON d.id = e.department_id
GROUP BY d.name;
\`\`\`
`
      }
    },
    {
      id: 'multiple-joins',
      type: 'reading',
      title: '여러 테이블 JOIN',
      duration: 30,
      content: {
        objectives: [
          '3개 이상의 테이블을 조인할 수 있다',
          'JOIN과 GROUP BY를 조합할 수 있다',
          'JOIN 성능 고려사항을 이해한다'
        ],
        markdown: `
## 3개 테이블 조인

\`\`\`sql
-- 주문 정보 + 고객 정보 + 상품 정보
SELECT
    o.id AS 주문번호,
    c.name AS 고객명,
    p.name AS 상품명,
    o.quantity AS 수량,
    p.price * o.quantity AS 금액
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN products p ON o.product_id = p.id;
\`\`\`

## 조인 순서

\`\`\`sql
-- 순서 1: orders → customers → products
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN products p ON o.product_id = p.id

-- 순서 2: orders → products → customers (동일 결과)
FROM orders o
INNER JOIN products p ON o.product_id = p.id
INNER JOIN customers c ON o.customer_id = c.id
\`\`\`

조인 순서는 결과에 영향을 주지 않지만, 가독성을 위해 논리적 순서 권장.

## 실습 예제

\`\`\`sql
-- 직원 + 부서 + 주문 정보 (고객이 직원일 경우)
SELECT
    e.name AS 직원명,
    d.name AS 소속부서,
    COUNT(o.id) AS 주문수
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
LEFT JOIN orders o ON e.name = o.customer_name
GROUP BY e.name, d.name
ORDER BY 주문수 DESC;
\`\`\`

## JOIN과 GROUP BY 조합

\`\`\`sql
-- 부서별 급여 통계 (부서 정보 포함)
SELECT
    d.name AS 부서명,
    d.location AS 위치,
    COUNT(e.id) AS 직원수,
    SUM(e.salary) AS 급여총합,
    ROUND(AVG(e.salary), 0) AS 평균급여
FROM departments d
INNER JOIN employees e ON d.id = e.department_id
GROUP BY d.name, d.location
ORDER BY 평균급여 DESC;
\`\`\`

## JOIN의 성능 고려사항

1. **인덱스**: JOIN에 사용되는 열에 인덱스가 있으면 빠름
2. **필터링 먼저**: WHERE 조건으로 데이터를 줄인 후 JOIN
3. **필요한 열만 SELECT**: * 대신 필요한 열만 명시
`
      }
    },
    {
      id: 'inner-join-practice',
      type: 'code',
      title: 'INNER JOIN 실습',
      duration: 35,
      content: {
        objectives: [
          '기본 조인을 실습한다',
          '주문 데이터 조인을 연습한다',
          '3개 테이블 조인을 실습한다'
        ],
        markdown: `
## 실습 1: 기본 조인

\`\`\`sql
-- 1. 직원과 부서 정보 조인
SELECT
    e.name AS 직원명,
    e.salary AS 급여,
    d.name AS 부서명,
    d.location AS 위치
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;

-- 2. 서울 근무자만 조회
SELECT e.name, e.salary, d.name AS 부서
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE d.location = '서울'
ORDER BY e.salary DESC;

-- 3. 부서별 집계와 조인
SELECT
    d.name AS 부서명,
    COUNT(*) AS 직원수,
    ROUND(AVG(e.salary), 0) AS 평균급여
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
GROUP BY d.name
ORDER BY 평균급여 DESC;
\`\`\`

## 실습 2: 주문 데이터 조인

\`\`\`sql
-- customers 테이블 생성
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    grade VARCHAR(20)
);

INSERT INTO customers (name, email, grade) VALUES
('고객A', 'a@mail.com', 'VIP'),
('고객B', 'b@mail.com', 'Gold'),
('고객C', 'c@mail.com', 'Silver'),
('고객D', 'd@mail.com', 'Bronze'),
('고객E', 'e@mail.com', 'Silver');  -- 주문 없는 고객

-- 주문과 고객 정보 조인
SELECT
    o.id AS 주문번호,
    c.name AS 고객명,
    c.grade AS 등급,
    o.quantity AS 수량,
    o.status AS 상태
FROM orders o
INNER JOIN customers c ON o.customer_name = c.name;
\`\`\`

## 실습 3: 3개 테이블 조인

\`\`\`sql
-- 주문 + 고객 + 상품 정보
SELECT
    o.id AS 주문번호,
    c.name AS 고객명,
    c.grade AS 등급,
    p.name AS 상품명,
    p.price AS 단가,
    o.quantity AS 수량,
    p.price * o.quantity AS 주문금액
FROM orders o
INNER JOIN customers c ON o.customer_name = c.name
INNER JOIN products p ON o.product_id = p.id
WHERE o.status = 'completed'
ORDER BY 주문금액 DESC;
\`\`\`

## 도전 과제

1. VIP 고객의 완료된 주문만 조회
2. 부서별, 직원별 주문 현황 조회 (직원이 고객일 경우)
3. 가장 많이 팔린 상품 TOP 3 조회
`
      }
    },
    {
      id: 'day2-quiz',
      type: 'quiz',
      title: 'Day 2 퀴즈: INNER JOIN',
      duration: 10,
      content: {
        questions: [
          {
            question: 'INNER JOIN의 결과에 포함되는 행은?',
            options: [
              '왼쪽 테이블의 모든 행',
              '오른쪽 테이블의 모든 행',
              '양쪽 테이블에서 조건이 일치하는 행만',
              '양쪽 테이블의 모든 행'
            ],
            answer: 2,
            explanation: 'INNER JOIN은 조인 조건이 일치하는 행만 결과에 포함합니다. 일치하지 않는 행은 제외됩니다.'
          },
          {
            question: 'ON 절의 역할은?',
            options: [
              '결과 정렬',
              '조인 조건 지정',
              '그룹화 기준',
              '결과 개수 제한'
            ],
            answer: 1,
            explanation: 'ON 절은 두 테이블을 연결할 조건을 지정합니다. 보통 외래 키 = 기본 키 형태입니다.'
          },
          {
            question: '테이블 별칭(e, d)을 사용하는 이유는?',
            options: [
              '성능 향상',
              '필수 문법',
              '코드 가독성과 편의성',
              '에러 방지'
            ],
            answer: 2,
            explanation: '테이블 별칭은 긴 테이블명을 짧게 줄여 코드를 읽기 쉽게 하고 타이핑을 줄여줍니다.'
          },
          {
            question: 'SELECT e.name, d.name에서 같은 열 이름을 구분하는 방법은?',
            options: [
              '별칭(AS) 사용',
              '테이블명.열명 사용',
              '순서로 구분',
              '구분 불가'
            ],
            answer: 1,
            explanation: '테이블명(또는 별칭).열명 형식으로 어느 테이블의 열인지 명시합니다. AS로 결과 열 이름도 변경 가능.'
          }
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'sql2-day3',
  title: 'JOIN 심화: OUTER JOIN',
  totalDuration: 125,
  tasks: [
    {
      id: 'left-join',
      type: 'reading',
      title: 'LEFT JOIN',
      duration: 30,
      content: {
        objectives: [
          'LEFT JOIN의 동작 방식을 이해한다',
          '매칭 안 된 행을 찾는 방법을 익힌다',
          '집계와 함께 사용할 수 있다'
        ],
        markdown: `
## LEFT JOIN이란?

**왼쪽 테이블의 모든 행**을 포함하고, 오른쪽 테이블에서 일치하는 행을 연결합니다.
일치하지 않으면 NULL로 채웁니다.

### 기본 문법
\`\`\`sql
SELECT 열
FROM 왼쪽테이블
LEFT JOIN 오른쪽테이블 ON 조건;
\`\`\`

## 시각적 이해

\`\`\`
departments (왼쪽)          employees (오른쪽)
+----+------------+         +----+---------------+
| id | name       |         | id | department_id |
+----+------------+         +----+---------------+
| 1  | 개발팀     | ←─────→ | 1  | 1             |
| 2  | 마케팅팀   | ←─────→ | 2  | 2             |
| 3  | 인사팀     | ←─────→ | 4  | 3             |
| 4  | 재무팀     | ←─────→ | 7  | 4             |
| 5  | 디자인팀   | ← NULL  |    | (매칭 없음)   |
+----+------------+         +----+---------------+

LEFT JOIN 결과: 모든 부서 + 매칭되는 직원 (디자인팀은 NULL)
\`\`\`

## 기본 예제

\`\`\`sql
-- 모든 부서와 해당 직원 (직원 없는 부서도 포함)
SELECT
    d.name AS 부서명,
    e.name AS 직원명
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id;
\`\`\`

### 결과:
\`\`\`
부서명   | 직원명
---------+--------
개발팀   | 김철수
개발팀   | 박민수
마케팅팀 | 이영희
인사팀   | 정수진
재무팀   | 송지원
디자인팀 | NULL    ← 직원 없음
\`\`\`

## 활용: 매칭 안 된 행 찾기

\`\`\`sql
-- 직원이 없는 부서 찾기
SELECT d.name AS 부서명
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
WHERE e.id IS NULL;
-- 결과: 디자인팀
\`\`\`

## 집계와 함께 사용

\`\`\`sql
-- 부서별 직원 수 (0명인 부서 포함)
SELECT
    d.name AS 부서명,
    COUNT(e.id) AS 직원수  -- COUNT(*)가 아닌 COUNT(e.id)
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.name
ORDER BY 직원수 DESC;
\`\`\`

### 결과:
\`\`\`
부서명   | 직원수
---------+-------
개발팀   | 4
마케팅팀 | 2
인사팀   | 1
재무팀   | 1
디자인팀 | 0     ← INNER JOIN에서는 안 나옴
\`\`\`
`
      }
    },
    {
      id: 'right-full-join',
      type: 'reading',
      title: 'RIGHT JOIN과 FULL OUTER JOIN',
      duration: 25,
      content: {
        objectives: [
          'RIGHT JOIN의 동작을 이해한다',
          'FULL OUTER JOIN을 사용할 수 있다',
          '각 JOIN 종류의 차이를 구분할 수 있다'
        ],
        markdown: `
## RIGHT JOIN

**오른쪽 테이블의 모든 행**을 포함하고, 왼쪽에서 일치하는 행을 연결합니다.

\`\`\`sql
SELECT 열
FROM 왼쪽테이블
RIGHT JOIN 오른쪽테이블 ON 조건;
\`\`\`

### 예제
\`\`\`sql
-- 모든 직원과 부서 정보 (부서 없는 직원도 포함)
SELECT
    e.name AS 직원명,
    d.name AS 부서명
FROM departments d
RIGHT JOIN employees e ON d.id = e.department_id;
\`\`\`

### RIGHT JOIN vs LEFT JOIN

RIGHT JOIN은 LEFT JOIN의 테이블 순서를 바꾼 것과 같습니다:

\`\`\`sql
-- 동일한 결과
SELECT e.name, d.name
FROM departments d
RIGHT JOIN employees e ON d.id = e.department_id;

-- 위와 같은 결과 (테이블 순서만 바꿈)
SELECT e.name, d.name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;
\`\`\`

💡 실무에서는 LEFT JOIN을 더 많이 사용합니다.

## FULL OUTER JOIN

**양쪽 테이블의 모든 행**을 포함합니다.

\`\`\`sql
SELECT 열
FROM 테이블1
FULL OUTER JOIN 테이블2 ON 조건;
\`\`\`

### 예제
\`\`\`sql
-- 모든 부서와 모든 직원 (매칭 안 되는 것도 모두)
SELECT
    d.name AS 부서명,
    e.name AS 직원명
FROM departments d
FULL OUTER JOIN employees e ON d.id = e.department_id;
\`\`\`

### 결과:
\`\`\`
부서명   | 직원명
---------+--------
개발팀   | 김철수
개발팀   | 박민수
마케팅팀 | 이영희
디자인팀 | NULL    ← 직원 없는 부서
NULL     | 신입사원 ← 부서 배정 안 된 직원 (예시)
\`\`\`

## JOIN 비교 요약

| JOIN 종류 | 결과 |
|-----------|------|
| INNER JOIN | 양쪽 모두 일치하는 행만 |
| LEFT JOIN | 왼쪽 전체 + 오른쪽 매칭 |
| RIGHT JOIN | 오른쪽 전체 + 왼쪽 매칭 |
| FULL OUTER JOIN | 양쪽 전체 |

⚠️ MySQL은 FULL OUTER JOIN을 지원하지 않습니다. UNION으로 대체:
\`\`\`sql
SELECT * FROM A LEFT JOIN B ON A.id = B.a_id
UNION
SELECT * FROM A RIGHT JOIN B ON A.id = B.a_id;
\`\`\`
`
      }
    },
    {
      id: 'self-cross-join',
      type: 'reading',
      title: 'SELF JOIN과 특수 JOIN',
      duration: 25,
      content: {
        objectives: [
          'SELF JOIN으로 계층 구조를 조회한다',
          'CROSS JOIN의 용도를 이해한다',
          'NATURAL JOIN과 USING의 사용법을 안다'
        ],
        markdown: `
## SELF JOIN

**같은 테이블**을 자기 자신과 조인합니다.

### 예제: 관리자 찾기

\`\`\`sql
-- employees에 manager_id 열 추가
ALTER TABLE employees ADD COLUMN manager_id INTEGER;

UPDATE employees SET manager_id = 5 WHERE name = '김철수';  -- 최동현이 관리자
UPDATE employees SET manager_id = 5 WHERE name = '박민수';
UPDATE employees SET manager_id = NULL WHERE name = '최동현';  -- 최고 관리자
UPDATE employees SET manager_id = 5 WHERE name = '윤서준';

-- SELF JOIN으로 직원-관리자 관계 조회
SELECT
    e.name AS 직원명,
    m.name AS 관리자명
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
\`\`\`

### 결과:
\`\`\`
직원명 | 관리자명
-------+---------
김철수 | 최동현
박민수 | 최동현
최동현 | NULL     ← 관리자 없음 (최고위)
윤서준 | 최동현
\`\`\`

## CROSS JOIN (카테시안 곱)

모든 가능한 조합을 만듭니다. ON 조건 없음.

\`\`\`sql
-- 모든 직원 x 모든 부서 조합
SELECT e.name, d.name
FROM employees e
CROSS JOIN departments d;
-- 8명 x 5부서 = 40행
\`\`\`

### 활용: 달력 생성
\`\`\`sql
-- 년도 x 월 조합
SELECT years.y, months.m
FROM (SELECT 2024 AS y UNION SELECT 2025) years
CROSS JOIN (SELECT 1 AS m UNION SELECT 2 UNION SELECT 3) months;
\`\`\`

## NATURAL JOIN

동일한 이름의 열을 자동으로 매칭합니다. (권장하지 않음)

\`\`\`sql
-- 자동으로 같은 이름의 열로 조인
SELECT * FROM employees NATURAL JOIN departments;
-- department_id = id 자동 매칭 (열 이름이 같으면)
\`\`\`

⚠️ NATURAL JOIN은 예측이 어렵고 유지보수에 불리하므로 명시적 JOIN 권장.

## USING 절

조인 열 이름이 같을 때 간단히 작성:

\`\`\`sql
-- ON 대신 USING
SELECT e.name, d.name
FROM employees e
JOIN departments d USING (department_id);
-- ON e.department_id = d.department_id 와 동일
\`\`\`
`
      }
    },
    {
      id: 'outer-join-practice',
      type: 'code',
      title: 'OUTER JOIN 실습',
      duration: 35,
      content: {
        objectives: [
          'LEFT JOIN 실습을 수행한다',
          'RIGHT JOIN 실습을 수행한다',
          'INNER와 LEFT의 차이를 비교한다'
        ],
        markdown: `
## 실습 1: LEFT JOIN

\`\`\`sql
-- 1. 모든 부서와 직원 수 (0명 부서 포함)
SELECT
    d.name AS 부서명,
    d.location AS 위치,
    COUNT(e.id) AS 직원수
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.name, d.location
ORDER BY 직원수 DESC;

-- 2. 직원이 없는 부서 찾기
SELECT d.name AS 빈부서
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
WHERE e.id IS NULL;

-- 3. 모든 고객과 주문 현황 (주문 없는 고객 포함)
SELECT
    c.name AS 고객명,
    c.grade AS 등급,
    COALESCE(COUNT(o.id), 0) AS 주문수,
    COALESCE(SUM(o.quantity), 0) AS 총수량
FROM customers c
LEFT JOIN orders o ON c.name = o.customer_name
GROUP BY c.name, c.grade
ORDER BY 주문수 DESC;
\`\`\`

## 실습 2: RIGHT JOIN

\`\`\`sql
-- 1. 모든 주문과 상품 정보
SELECT
    o.id AS 주문번호,
    p.name AS 상품명,
    p.category AS 카테고리,
    o.quantity AS 수량
FROM orders o
RIGHT JOIN products p ON o.product_id = p.id;

-- 2. 주문 없는 상품 찾기
SELECT p.name AS 미판매상품
FROM orders o
RIGHT JOIN products p ON o.product_id = p.id
WHERE o.id IS NULL;
\`\`\`

## 실습 3: 복합 JOIN

\`\`\`sql
-- 부서별 예산 대비 급여 현황
SELECT
    d.name AS 부서명,
    d.budget AS 예산,
    COALESCE(SUM(e.salary), 0) AS 급여총합,
    d.budget - COALESCE(SUM(e.salary), 0) AS 잔여예산
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.name, d.budget
ORDER BY 잔여예산;
\`\`\`

## 실습 4: INNER vs LEFT 비교

\`\`\`sql
-- INNER JOIN: 직원 있는 부서만
SELECT d.name, COUNT(e.id)
FROM departments d
INNER JOIN employees e ON d.id = e.department_id
GROUP BY d.name;
-- 결과: 4개 부서

-- LEFT JOIN: 모든 부서
SELECT d.name, COUNT(e.id)
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.name;
-- 결과: 5개 부서 (디자인팀 포함)
\`\`\`

## 도전 과제

1. 주문도 없고 상품도 안 팔린 고객 찾기
2. 각 상품별 판매 수량 집계 (안 팔린 상품도 0으로 표시)
3. 관리자별 부하 직원 수 조회 (SELF JOIN)
`
      }
    },
    {
      id: 'day3-quiz',
      type: 'quiz',
      title: 'Day 3 퀴즈: OUTER JOIN',
      duration: 10,
      content: {
        questions: [
          {
            question: 'LEFT JOIN에서 오른쪽 테이블에 매칭이 없으면?',
            options: [
              '해당 행 제외',
              'NULL로 채움',
              '에러 발생',
              '0으로 채움'
            ],
            answer: 1,
            explanation: 'LEFT JOIN은 왼쪽 테이블의 모든 행을 포함하고, 매칭이 없는 오른쪽 열은 NULL로 채웁니다.'
          },
          {
            question: '매칭 안 된 행만 찾으려면?',
            options: [
              'WHERE column = NULL',
              'WHERE column IS NULL',
              'WHERE column NOT EXISTS',
              'HAVING column = 0'
            ],
            answer: 1,
            explanation: 'LEFT JOIN 후 WHERE 오른쪽테이블.열 IS NULL로 매칭 안 된 행을 찾을 수 있습니다.'
          },
          {
            question: 'RIGHT JOIN을 LEFT JOIN으로 바꾸는 방법은?',
            options: [
              '불가능',
              '조건을 반대로',
              '테이블 순서를 바꿈',
              'ON 대신 WHERE 사용'
            ],
            answer: 2,
            explanation: 'A RIGHT JOIN B는 B LEFT JOIN A와 같습니다. 테이블 순서만 바꾸면 됩니다.'
          },
          {
            question: 'SELF JOIN의 용도로 적절한 것은?',
            options: [
              '두 테이블 합치기',
              '같은 테이블에서 계층 관계 조회',
              '중복 제거',
              '데이터 복제'
            ],
            answer: 1,
            explanation: 'SELF JOIN은 같은 테이블을 자신과 조인하여 직원-관리자 같은 계층 관계를 조회할 때 사용합니다.'
          }
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'sql2-day4',
  title: '서브쿼리 (Subquery)',
  totalDuration: 140,
  tasks: [
    {
      id: 'subquery-intro',
      type: 'reading',
      title: '서브쿼리란?',
      duration: 30,
      content: {
        objectives: [
          '서브쿼리의 정의와 필요성을 이해한다',
          '서브쿼리의 위치별 사용법을 익힌다',
          '서브쿼리 실행 순서를 이해한다'
        ],
        markdown: `
## 정의

**서브쿼리(Subquery)**는 다른 쿼리 안에 포함된 쿼리입니다.
괄호 \`()\` 안에 작성합니다.

### 기본 구조
\`\`\`sql
SELECT 열
FROM 테이블
WHERE 열 연산자 (SELECT 열 FROM 테이블);
\`\`\`

## 왜 서브쿼리가 필요한가?

**질문**: "평균 급여보다 높은 급여를 받는 직원은?"

### 단계별 접근
\`\`\`sql
-- 1단계: 평균 급여 계산
SELECT AVG(salary) FROM employees;
-- 결과: 4937.5

-- 2단계: 그 값으로 필터링
SELECT * FROM employees WHERE salary > 4937.5;
\`\`\`

### 서브쿼리로 한 번에
\`\`\`sql
SELECT *
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
\`\`\`

## 서브쿼리의 위치

### 1. WHERE 절에서 (가장 일반적)
\`\`\`sql
SELECT * FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
\`\`\`

### 2. FROM 절에서 (인라인 뷰)
\`\`\`sql
SELECT dept_avg.부서명, dept_avg.평균급여
FROM (
    SELECT department AS 부서명, AVG(salary) AS 평균급여
    FROM employees
    GROUP BY department
) AS dept_avg
WHERE dept_avg.평균급여 > 5000;
\`\`\`

### 3. SELECT 절에서 (스칼라 서브쿼리)
\`\`\`sql
SELECT
    name,
    salary,
    (SELECT AVG(salary) FROM employees) AS 전체평균,
    salary - (SELECT AVG(salary) FROM employees) AS 평균대비
FROM employees;
\`\`\`

## 서브쿼리 실행 순서

1. 서브쿼리가 먼저 실행됨
2. 서브쿼리 결과가 메인 쿼리에 전달됨
3. 메인 쿼리 실행

\`\`\`sql
SELECT * FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
           └─── 1. 먼저 실행: 4937.5 반환
         └────── 2. salary > 4937.5 로 치환
       └──────── 3. 메인 쿼리 실행
\`\`\`
`
      }
    },
    {
      id: 'single-multi-row',
      type: 'reading',
      title: '단일행과 다중행 서브쿼리',
      duration: 35,
      content: {
        objectives: [
          '단일행 서브쿼리의 사용법을 익힌다',
          'IN, ANY, ALL, EXISTS의 사용법을 익힌다',
          '상관 서브쿼리와 비상관 서브쿼리를 구분한다'
        ],
        markdown: `
## 단일행 서브쿼리

**하나의 행, 하나의 값**을 반환합니다.
비교 연산자(=, >, <, >=, <=, <>)와 함께 사용.

\`\`\`sql
-- 최고 급여자
SELECT * FROM employees
WHERE salary = (SELECT MAX(salary) FROM employees);

-- 개발팀 평균보다 높은 급여
SELECT * FROM employees
WHERE salary > (
    SELECT AVG(salary) FROM employees WHERE department = '개발팀'
);
\`\`\`

## 다중행 서브쿼리

**여러 행**을 반환합니다.
IN, ANY, ALL, EXISTS와 함께 사용.

### IN 연산자
\`\`\`sql
-- 주문한 적 있는 고객만
SELECT * FROM customers
WHERE name IN (SELECT DISTINCT customer_name FROM orders);

-- 전자기기를 주문한 고객
SELECT * FROM customers
WHERE name IN (
    SELECT DISTINCT customer_name
    FROM orders o
    JOIN products p ON o.product_id = p.id
    WHERE p.category = '전자기기'
);
\`\`\`

### ANY / SOME
\`\`\`sql
-- 개발팀 직원 중 누구보다 급여가 높은 직원
SELECT * FROM employees
WHERE salary > ANY (
    SELECT salary FROM employees WHERE department = '개발팀'
);
-- salary > 4800 OR salary > 5000 OR salary > 5500 OR salary > 6000
-- 즉, 4800 초과면 조건 충족
\`\`\`

### ALL
\`\`\`sql
-- 개발팀 모든 직원보다 급여가 높은 직원
SELECT * FROM employees
WHERE salary > ALL (
    SELECT salary FROM employees WHERE department = '개발팀'
);
-- salary > 4800 AND salary > 5000 AND salary > 5500 AND salary > 6000
-- 즉, 6000 초과해야 조건 충족
\`\`\`

### EXISTS
\`\`\`sql
-- 주문이 존재하는 고객
SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_name = c.name
);

-- 완료된 주문이 있는 고객
SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_name = c.name AND o.status = 'completed'
);
\`\`\`

## 상관 서브쿼리 vs 비상관 서브쿼리

### 비상관 서브쿼리
서브쿼리가 메인 쿼리와 독립적으로 실행됩니다.
\`\`\`sql
-- 서브쿼리가 한 번만 실행됨
SELECT * FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
\`\`\`

### 상관 서브쿼리
서브쿼리가 메인 쿼리의 각 행을 참조합니다.
\`\`\`sql
-- 서브쿼리가 메인 쿼리의 각 행마다 실행됨
SELECT * FROM employees e1
WHERE salary > (
    SELECT AVG(salary) FROM employees e2
    WHERE e2.department = e1.department  -- 메인 쿼리 참조
);
-- 의미: 자신의 부서 평균보다 급여가 높은 직원
\`\`\`
`
      }
    },
    {
      id: 'subquery-patterns',
      type: 'reading',
      title: '서브쿼리 활용 패턴',
      duration: 30,
      content: {
        objectives: [
          '최대/최소값 찾기 패턴을 익힌다',
          '존재 여부 확인 패턴을 익힌다',
          'FROM 절 서브쿼리 활용법을 익힌다'
        ],
        markdown: `
## 패턴 1: 최대/최소값 찾기

\`\`\`sql
-- 가장 높은 급여를 받는 직원
SELECT * FROM employees
WHERE salary = (SELECT MAX(salary) FROM employees);

-- 가장 최근 입사한 직원
SELECT * FROM employees
WHERE hire_date = (SELECT MAX(hire_date) FROM employees);

-- 각 부서에서 최고 급여자
SELECT * FROM employees e1
WHERE salary = (
    SELECT MAX(salary) FROM employees e2
    WHERE e2.department = e1.department
);
\`\`\`

## 패턴 2: 평균과 비교

\`\`\`sql
-- 전체 평균 이상인 직원
SELECT name, salary,
       salary - (SELECT AVG(salary) FROM employees) AS 평균대비
FROM employees
WHERE salary >= (SELECT AVG(salary) FROM employees);

-- 자기 부서 평균보다 높은 직원
SELECT e1.*
FROM employees e1
WHERE salary > (
    SELECT AVG(salary) FROM employees e2
    WHERE e2.department = e1.department
);
\`\`\`

## 패턴 3: 존재 여부 확인

\`\`\`sql
-- 주문한 적 있는 상품만
SELECT * FROM products p
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.product_id = p.id
);

-- 주문한 적 없는 상품
SELECT * FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.product_id = p.id
);
\`\`\`

## 패턴 4: FROM 절 서브쿼리 (인라인 뷰)

\`\`\`sql
-- 부서별 통계에서 추가 필터링
SELECT *
FROM (
    SELECT
        department,
        COUNT(*) AS 인원,
        ROUND(AVG(salary), 0) AS 평균급여
    FROM employees
    GROUP BY department
) AS dept_stats
WHERE 인원 >= 2;

-- 순위와 함께 조회
SELECT *
FROM (
    SELECT
        name,
        salary,
        RANK() OVER (ORDER BY salary DESC) AS 순위
    FROM employees
) AS ranked
WHERE 순위 <= 3;
\`\`\`

## 패턴 5: 집합 비교

\`\`\`sql
-- 모든 개발팀 직원보다 급여가 높은 직원
SELECT * FROM employees
WHERE salary > ALL (
    SELECT salary FROM employees WHERE department = '개발팀'
);

-- 어떤 마케팅팀 직원보다 급여가 높은 직원
SELECT * FROM employees
WHERE salary > ANY (
    SELECT salary FROM employees WHERE department = '마케팅팀'
);
\`\`\`
`
      }
    },
    {
      id: 'subquery-practice',
      type: 'code',
      title: '서브쿼리 실습',
      duration: 35,
      content: {
        objectives: [
          '단일행 서브쿼리 실습을 수행한다',
          '다중행 서브쿼리 실습을 수행한다',
          'FROM 절 서브쿼리 실습을 수행한다'
        ],
        markdown: `
## 실습 1: 단일행 서브쿼리

\`\`\`sql
-- 1. 평균 급여 이상인 직원
SELECT name, salary
FROM employees
WHERE salary >= (SELECT AVG(salary) FROM employees);

-- 2. 최고 급여자
SELECT * FROM employees
WHERE salary = (SELECT MAX(salary) FROM employees);

-- 3. 가장 먼저 입사한 직원
SELECT * FROM employees
WHERE hire_date = (SELECT MIN(hire_date) FROM employees);

-- 4. 개발팀 평균보다 높은 급여
SELECT * FROM employees
WHERE salary > (
    SELECT AVG(salary) FROM employees WHERE department = '개발팀'
);
\`\`\`

## 실습 2: 다중행 서브쿼리

\`\`\`sql
-- 1. 주문한 적 있는 고객
SELECT * FROM customers
WHERE name IN (SELECT DISTINCT customer_name FROM orders);

-- 2. 주문한 적 없는 고객
SELECT * FROM customers
WHERE name NOT IN (SELECT DISTINCT customer_name FROM orders);

-- 3. 완료된 주문이 있는 고객
SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_name = c.name AND o.status = 'completed'
);
\`\`\`

## 실습 3: 상관 서브쿼리

\`\`\`sql
-- 1. 자기 부서 평균보다 급여가 높은 직원
SELECT e1.name, e1.department, e1.salary
FROM employees e1
WHERE salary > (
    SELECT AVG(salary) FROM employees e2
    WHERE e2.department = e1.department
);

-- 2. 각 부서에서 가장 급여가 높은 직원
SELECT * FROM employees e1
WHERE salary = (
    SELECT MAX(salary) FROM employees e2
    WHERE e2.department = e1.department
);
\`\`\`

## 실습 4: FROM 절 서브쿼리

\`\`\`sql
-- 1. 부서별 통계 (2명 이상 부서만)
SELECT *
FROM (
    SELECT
        department,
        COUNT(*) AS 인원,
        SUM(salary) AS 급여합,
        ROUND(AVG(salary), 0) AS 평균급여
    FROM employees
    GROUP BY department
) AS stats
WHERE 인원 >= 2
ORDER BY 평균급여 DESC;

-- 2. 고객별 주문 통계
SELECT *
FROM (
    SELECT
        customer_name,
        COUNT(*) AS 주문수,
        SUM(quantity) AS 총수량
    FROM orders
    WHERE status = 'completed'
    GROUP BY customer_name
) AS customer_stats
ORDER BY 총수량 DESC;
\`\`\`

## 도전 과제

1. 두 번째로 높은 급여를 받는 직원 찾기
2. 각 카테고리에서 가장 비싼 상품 찾기
3. 평균 주문 수량보다 많이 주문한 고객 찾기
`
      }
    },
    {
      id: 'day4-quiz',
      type: 'quiz',
      title: 'Day 4 퀴즈: 서브쿼리',
      duration: 10,
      content: {
        questions: [
          {
            question: '서브쿼리가 여러 행을 반환할 때 사용할 수 있는 연산자는?',
            options: ['=', '>', 'IN', '<='],
            answer: 2,
            explanation: 'IN, ANY, ALL, EXISTS는 다중행 서브쿼리와 함께 사용합니다. =, > 등은 단일행만 가능합니다.'
          },
          {
            question: 'salary > ALL (SELECT salary FROM ...) 의 의미는?',
            options: [
              '서브쿼리의 어떤 값보다 크면',
              '서브쿼리의 모든 값보다 크면',
              '서브쿼리의 평균보다 크면',
              '서브쿼리의 최소값보다 크면'
            ],
            answer: 1,
            explanation: 'ALL은 서브쿼리의 모든 값과 비교합니다. > ALL은 가장 큰 값보다 커야 참입니다.'
          },
          {
            question: 'EXISTS 서브쿼리의 특징은?',
            options: [
              '값을 반환',
              '존재 여부만 확인 (TRUE/FALSE)',
              '개수를 반환',
              '평균을 계산'
            ],
            answer: 1,
            explanation: 'EXISTS는 서브쿼리 결과가 있으면 TRUE, 없으면 FALSE를 반환합니다. 실제 값은 중요하지 않습니다.'
          },
          {
            question: '상관 서브쿼리의 특징은?',
            options: [
              '한 번만 실행됨',
              '메인 쿼리의 각 행마다 실행됨',
              '가장 빠름',
              'JOIN으로 대체 불가'
            ],
            answer: 1,
            explanation: '상관 서브쿼리는 메인 쿼리의 값을 참조하므로 각 행마다 실행됩니다. 성능에 주의가 필요합니다.'
          }
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'sql2-day5',
  title: '종합 실습과 주간 프로젝트',
  totalDuration: 175,
  tasks: [
    {
      id: 'view-intro',
      type: 'reading',
      title: 'VIEW: 가상 테이블',
      duration: 25,
      content: {
        objectives: [
          'VIEW의 개념과 장점을 이해한다',
          'VIEW를 생성하고 사용할 수 있다',
          '실용적인 VIEW 예제를 작성할 수 있다'
        ],
        markdown: `
## VIEW란?

SELECT 쿼리를 저장하여 테이블처럼 사용하는 가상 테이블입니다.

### 장점
- 복잡한 쿼리를 단순화
- 보안 (민감한 열 숨기기)
- 재사용성

## VIEW 생성

\`\`\`sql
CREATE VIEW 뷰이름 AS
SELECT 문;
\`\`\`

### 예제: 직원 요약 뷰
\`\`\`sql
CREATE VIEW employee_summary AS
SELECT
    e.id,
    e.name AS 직원명,
    d.name AS 부서명,
    e.salary AS 급여,
    e.hire_date AS 입사일,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.hire_date)) AS 근속년수
FROM employees e
JOIN departments d ON e.department_id = d.id;
\`\`\`

## VIEW 사용

\`\`\`sql
-- 테이블처럼 조회
SELECT * FROM employee_summary;

-- 조건 추가
SELECT * FROM employee_summary WHERE 부서명 = '개발팀';

-- 다른 테이블과 조인도 가능
SELECT es.*, o.quantity
FROM employee_summary es
JOIN orders o ON es.직원명 = o.customer_name;
\`\`\`

## VIEW 수정/삭제

\`\`\`sql
-- VIEW 수정 (덮어쓰기)
CREATE OR REPLACE VIEW employee_summary AS
SELECT ... (새로운 쿼리);

-- VIEW 삭제
DROP VIEW employee_summary;

-- 존재하면 삭제
DROP VIEW IF EXISTS employee_summary;
\`\`\`

## 실용적인 VIEW 예제

\`\`\`sql
-- 부서별 통계 VIEW
CREATE VIEW department_stats AS
SELECT
    d.name AS 부서명,
    d.location AS 위치,
    COUNT(e.id) AS 직원수,
    COALESCE(SUM(e.salary), 0) AS 급여총합,
    ROUND(COALESCE(AVG(e.salary), 0), 0) AS 평균급여,
    d.budget AS 예산,
    d.budget - COALESCE(SUM(e.salary), 0) AS 잔여예산
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.name, d.location, d.budget;

-- 사용
SELECT * FROM department_stats WHERE 직원수 = 0;
SELECT * FROM department_stats ORDER BY 평균급여 DESC;
\`\`\`
`
      }
    },
    {
      id: 'complex-query-strategy',
      type: 'reading',
      title: '복잡한 쿼리 작성 전략',
      duration: 30,
      content: {
        objectives: [
          '단계별 접근법을 익힌다',
          '쿼리 최적화 팁을 이해한다',
          '서브쿼리와 JOIN의 선택 기준을 안다'
        ],
        markdown: `
## 단계별 접근법

복잡한 쿼리는 한 번에 작성하지 않습니다!

### 예제 문제
"각 부서에서 평균 급여 이상을 받는 직원의 이름, 부서, 급여,
부서 평균 대비 차이를 조회하시오."

### 1단계: 필요한 데이터 파악
- 직원 정보 (employees)
- 부서 정보 (departments)
- 부서별 평균 급여 계산 필요

### 2단계: 부분 쿼리 작성

\`\`\`sql
-- 부서별 평균 급여
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department;
\`\`\`

### 3단계: 조인으로 확장

\`\`\`sql
SELECT
    e.name,
    e.department,
    e.salary,
    dept_avg.avg_salary
FROM employees e
JOIN (
    SELECT department, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
) AS dept_avg ON e.department = dept_avg.department;
\`\`\`

### 4단계: 조건과 계산 추가

\`\`\`sql
SELECT
    e.name AS 직원명,
    e.department AS 부서,
    e.salary AS 급여,
    ROUND(dept_avg.avg_salary, 0) AS 부서평균,
    e.salary - ROUND(dept_avg.avg_salary, 0) AS 평균대비
FROM employees e
JOIN (
    SELECT department, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
) AS dept_avg ON e.department = dept_avg.department
WHERE e.salary >= dept_avg.avg_salary
ORDER BY 평균대비 DESC;
\`\`\`

## 쿼리 최적화 팁

### 1. 필요한 열만 SELECT
\`\`\`sql
-- 느림: 모든 열
SELECT * FROM employees JOIN departments ...

-- 빠름: 필요한 열만
SELECT e.name, e.salary, d.name FROM employees e JOIN ...
\`\`\`

### 2. 인덱스 활용
\`\`\`sql
-- JOIN과 WHERE에 사용되는 열에 인덱스
CREATE INDEX idx_emp_dept ON employees(department_id);
CREATE INDEX idx_orders_customer ON orders(customer_name);
\`\`\`

### 3. 서브쿼리 vs JOIN
\`\`\`sql
-- 서브쿼리 (느릴 수 있음)
SELECT * FROM employees
WHERE department_id IN (SELECT id FROM departments WHERE location = '서울');

-- JOIN (보통 더 빠름)
SELECT e.* FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE d.location = '서울';
\`\`\`

### 4. EXISTS vs IN
\`\`\`sql
-- IN: 서브쿼리 결과가 작을 때
WHERE id IN (SELECT id FROM small_table)

-- EXISTS: 메인 테이블이 작을 때
WHERE EXISTS (SELECT 1 FROM big_table WHERE ...)
\`\`\`
`
      }
    },
    {
      id: 'comprehensive-practice',
      type: 'code',
      title: '종합 실습 문제',
      duration: 45,
      content: {
        objectives: [
          '직원 분석 쿼리를 작성한다',
          '주문 분석 쿼리를 작성한다',
          '복합 분석 쿼리를 작성한다'
        ],
        markdown: `
## 문제 1: 직원 분석

\`\`\`sql
-- 1-1. 부서별 급여 TOP 3 직원
SELECT * FROM (
    SELECT
        e.name,
        e.department,
        e.salary,
        RANK() OVER (PARTITION BY e.department ORDER BY e.salary DESC) AS 순위
    FROM employees e
) AS ranked
WHERE 순위 <= 3;

-- 1-2. 전체 평균 이상이면서 자기 부서 평균 이상인 직원
SELECT e1.*
FROM employees e1
WHERE salary >= (SELECT AVG(salary) FROM employees)
  AND salary >= (
      SELECT AVG(salary) FROM employees e2
      WHERE e2.department = e1.department
  );

-- 1-3. 가장 많은 직원이 있는 부서 정보
SELECT d.*, COUNT(e.id) AS 직원수
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.id
HAVING COUNT(e.id) = (
    SELECT MAX(cnt) FROM (
        SELECT COUNT(*) AS cnt FROM employees GROUP BY department_id
    ) AS dept_counts
);
\`\`\`

## 문제 2: 주문 분석

\`\`\`sql
-- 2-1. VIP 고객의 완료된 주문 총액
SELECT
    c.name AS 고객명,
    c.grade AS 등급,
    COUNT(o.id) AS 주문수,
    SUM(p.price * o.quantity) AS 총액
FROM customers c
JOIN orders o ON c.name = o.customer_name
JOIN products p ON o.product_id = p.id
WHERE c.grade = 'VIP' AND o.status = 'completed'
GROUP BY c.name, c.grade;

-- 2-2. 가장 많이 팔린 상품 카테고리
SELECT
    p.category,
    SUM(o.quantity) AS 총판매량
FROM products p
JOIN orders o ON p.id = o.product_id
WHERE o.status = 'completed'
GROUP BY p.category
ORDER BY 총판매량 DESC
LIMIT 1;

-- 2-3. 아직 팔리지 않은 상품
SELECT p.*
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.product_id = p.id
);
\`\`\`

## 문제 3: 복합 분석

\`\`\`sql
-- 3-1. 월별 주문 추이
SELECT
    TO_CHAR(order_date, 'YYYY-MM') AS 월,
    COUNT(*) AS 주문수,
    SUM(quantity) AS 총수량
FROM orders
WHERE status = 'completed'
GROUP BY TO_CHAR(order_date, 'YYYY-MM')
ORDER BY 월;

-- 3-2. 부서별 예산 대비 급여 비율
SELECT
    d.name AS 부서명,
    d.budget AS 예산,
    COALESCE(SUM(e.salary), 0) AS 급여총합,
    ROUND(COALESCE(SUM(e.salary), 0) * 100.0 / d.budget, 1) AS "사용률(%)"
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.name, d.budget
ORDER BY "사용률(%)" DESC;
\`\`\`
`
      }
    },
    {
      id: 'weekly-project',
      type: 'code',
      title: '주간 프로젝트: 종합 데이터 분석',
      duration: 60,
      content: {
        objectives: [
          'VIEW 3개를 생성한다',
          '분석 쿼리 5개를 작성한다',
          '모든 쿼리를 실행하고 결과를 확인한다'
        ],
        markdown: `
## 프로젝트 개요

Week 3-4에서 배운 모든 내용을 활용하여 종합 분석 보고서를 작성합니다.

## Part 1: VIEW 생성 (20점)

\`\`\`sql
-- 1-1. 직원 상세 정보 VIEW
CREATE VIEW v_employee_detail AS
SELECT
    e.id,
    e.name AS 직원명,
    d.name AS 부서명,
    d.location AS 근무지,
    e.salary AS 급여,
    e.salary * 12 AS 연봉,
    e.hire_date AS 입사일,
    CURRENT_DATE - e.hire_date AS 근무일수,
    e.email
FROM employees e
JOIN departments d ON e.department_id = d.id;

-- 1-2. 주문 상세 정보 VIEW
CREATE VIEW v_order_detail AS
SELECT
    o.id AS 주문번호,
    c.name AS 고객명,
    c.grade AS 등급,
    p.name AS 상품명,
    p.category AS 카테고리,
    p.price AS 단가,
    o.quantity AS 수량,
    p.price * o.quantity AS 금액,
    o.order_date AS 주문일,
    o.status AS 상태
FROM orders o
JOIN customers c ON o.customer_name = c.name
JOIN products p ON o.product_id = p.id;

-- 1-3. 부서별 통계 VIEW
CREATE VIEW v_department_stats AS
SELECT
    d.name AS 부서명,
    d.location AS 위치,
    d.budget AS 예산,
    COUNT(e.id) AS 직원수,
    COALESCE(SUM(e.salary), 0) AS 급여합계,
    ROUND(COALESCE(AVG(e.salary), 0), 0) AS 평균급여,
    d.budget - COALESCE(SUM(e.salary), 0) AS 잔여예산
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.name, d.location, d.budget;
\`\`\`

## Part 2: 분석 쿼리 작성 (30점)

\`\`\`sql
-- 2-1. 부서별 상위 급여자 조회
SELECT 부서명, 직원명, 급여
FROM v_employee_detail
WHERE (부서명, 급여) IN (
    SELECT 부서명, MAX(급여)
    FROM v_employee_detail
    GROUP BY 부서명
)
ORDER BY 급여 DESC;

-- 2-2. 등급별 고객 주문 분석
SELECT
    등급,
    COUNT(DISTINCT 고객명) AS 고객수,
    COUNT(*) AS 주문수,
    SUM(금액) AS 총주문액,
    ROUND(AVG(금액), 0) AS 평균주문액
FROM v_order_detail
WHERE 상태 = 'completed'
GROUP BY 등급
ORDER BY 총주문액 DESC;

-- 2-3. 카테고리별 판매 실적
SELECT
    카테고리,
    COUNT(*) AS 판매건수,
    SUM(수량) AS 총판매량,
    SUM(금액) AS 총매출
FROM v_order_detail
WHERE 상태 = 'completed'
GROUP BY 카테고리
ORDER BY 총매출 DESC;

-- 2-4. 예산 대비 급여 효율성 분석
SELECT
    부서명,
    위치,
    예산,
    급여합계,
    직원수,
    ROUND(급여합계 * 100.0 / 예산, 1) AS "예산사용률(%)",
    CASE
        WHEN 급여합계 * 100.0 / 예산 > 80 THEN '주의'
        WHEN 급여합계 * 100.0 / 예산 > 60 THEN '적정'
        ELSE '여유'
    END AS 상태
FROM v_department_stats
ORDER BY "예산사용률(%)" DESC;

-- 2-5. 미완료 주문 현황
SELECT
    고객명,
    등급,
    COUNT(*) AS 미완료건수,
    SUM(금액) AS 미결제금액
FROM v_order_detail
WHERE 상태 IN ('pending', 'cancelled')
GROUP BY 고객명, 등급
ORDER BY 미결제금액 DESC;
\`\`\`

## 제출 체크리스트

- [ ] VIEW 3개 생성 완료
- [ ] 분석 쿼리 5개 작성 완료
- [ ] 모든 쿼리 실행 및 결과 확인
- [ ] 각 쿼리에 주석 추가
- [ ] 추가 분석 쿼리 1개 이상 작성
`
      }
    },
    {
      id: 'week4-final-quiz',
      type: 'quiz',
      title: 'Week 4 종합 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'GROUP BY와 함께 조건을 거는 키워드 중, 집계 함수를 사용할 수 있는 것은?',
            options: ['WHERE', 'HAVING', 'ON', 'LIMIT'],
            answer: 1,
            explanation: 'HAVING은 GROUP BY 후에 실행되며 집계 함수(COUNT, SUM 등)를 조건으로 사용할 수 있습니다.'
          },
          {
            question: 'LEFT JOIN에서 오른쪽 테이블에 매칭되는 행이 없을 때 해당 열의 값은?',
            options: ['0', '빈 문자열', 'NULL', '에러'],
            answer: 2,
            explanation: 'LEFT JOIN에서 매칭이 없으면 오른쪽 테이블의 모든 열이 NULL로 채워집니다.'
          },
          {
            question: '서브쿼리에서 ANY와 ALL의 차이는?',
            options: [
              '차이 없음',
              'ANY는 하나만, ALL은 모두 만족',
              'ANY는 숫자만, ALL은 문자도 가능',
              'ANY는 빠르고, ALL은 느림'
            ],
            answer: 1,
            explanation: 'ANY는 서브쿼리 결과 중 하나만 만족하면 되고, ALL은 모든 값을 만족해야 합니다.'
          },
          {
            question: 'VIEW의 장점이 아닌 것은?',
            options: [
              '복잡한 쿼리 단순화',
              '보안 강화',
              '데이터 저장 공간 절약',
              '코드 재사용'
            ],
            answer: 2,
            explanation: 'VIEW는 쿼리를 저장하는 것이지 데이터를 저장하지 않습니다. 실행할 때마다 쿼리가 수행됩니다.'
          },
          {
            question: 'INNER JOIN과 LEFT JOIN의 결과 행 수가 같은 경우는?',
            options: [
              '항상 같음',
              '왼쪽 테이블의 모든 행이 오른쪽과 매칭될 때',
              '오른쪽 테이블이 비어있을 때',
              '불가능'
            ],
            answer: 1,
            explanation: '왼쪽 테이블의 모든 행이 오른쪽 테이블과 매칭되면 LEFT JOIN도 INNER JOIN과 같은 결과를 냅니다.'
          }
        ]
      }
    }
  ]
}

export const prereqSql2Week: Week = {
  slug: 'prereq-sql-2',
  week: 4,
  phase: 0,
  month: 0,
  access: 'free',
  title: 'SQL 기초 2: JOIN과 집계',
  topics: ['GROUP BY', 'HAVING', 'INNER JOIN', 'LEFT/RIGHT JOIN', '서브쿼리', 'VIEW'],
  practice: 'SQL 종합 데이터 분석',
  totalDuration: 715,
  days: [day1, day2, day3, day4, day5]
}
