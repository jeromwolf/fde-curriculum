// Day 1: 윈도우 함수 기초
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'w3d1-video-window-intro',
    type: 'video',
    title: '윈도우 함수란 무엇인가?',
    duration: 15,
    access: 'core',
    content: {
      objectives: [
        '윈도우 함수의 개념과 일반 집계 함수와의 차이점 이해',
        'OVER 절의 기본 구문 학습',
        'PARTITION BY와 ORDER BY의 역할 파악'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=H6OTMoXjNiM',
      transcript: `## 윈도우 함수란?

윈도우 함수(Window Function)는 SQL에서 가장 강력한 분석 도구입니다.

### 왜 윈도우 함수인가?

일반 GROUP BY는 데이터를 "그룹으로 축소"하지만,
윈도우 함수는 "각 행을 유지하면서 그룹 계산"을 수행합니다.

\`\`\`
┌─────────────────────────────────────────────────────────┐
│  GROUP BY: 4행 → 2행으로 축소                            │
│  Window:   4행 → 4행 유지 (각 행에 계산값 추가)          │
└─────────────────────────────────────────────────────────┘
\`\`\`

### 기본 구문

\`\`\`sql
함수이름(컬럼) OVER (
    [PARTITION BY 파티션_컬럼]
    [ORDER BY 정렬_컬럼]
)
\`\`\`

이것이 데이터 분석에서 왜 중요한지 함께 알아봅시다.`,
      keyPoints: [
        '윈도우 함수는 행을 그룹으로 축소하지 않고 각 행에 계산 결과를 추가',
        'OVER() 절이 "창(window)"을 정의',
        'PARTITION BY로 그룹을 나누고, ORDER BY로 정렬 순서 지정',
        '집계 함수(SUM, AVG)도 윈도우 함수로 사용 가능'
      ]
    }
  },
  {
    id: 'w3d1-reading-window-syntax',
    type: 'reading',
    title: '윈도우 함수 구문 완전 정복',
    duration: 20,
    access: 'core',
    content: {
      markdown: `# 윈도우 함수 구문 완전 정복

## 기본 구문

\`\`\`sql
함수이름(컬럼) OVER (
    [PARTITION BY 파티션_컬럼]
    [ORDER BY 정렬_컬럼 [ASC|DESC]]
    [프레임_절]
)
\`\`\`

## OVER 절의 구성 요소

### 1. PARTITION BY - 그룹 정의
\`\`\`sql
-- 부서별로 그룹을 나눔
SELECT
    employee_name,
    department,
    salary,
    AVG(salary) OVER (PARTITION BY department) as dept_avg
FROM employees;
\`\`\`

결과 예시:
| employee_name | department | salary | dept_avg |
|--------------|------------|--------|----------|
| Alice        | Sales      | 50000  | 52500    |
| Bob          | Sales      | 55000  | 52500    |
| Charlie      | IT         | 70000  | 65000    |
| Diana        | IT         | 60000  | 65000    |

### 2. ORDER BY - 정렬 순서
\`\`\`sql
-- 입사일순으로 정렬 후 순위 매김
SELECT
    employee_name,
    hire_date,
    ROW_NUMBER() OVER (ORDER BY hire_date) as hire_order
FROM employees;
\`\`\`

### 3. PARTITION BY + ORDER BY 조합
\`\`\`sql
-- 부서 내에서 급여 순위
SELECT
    employee_name,
    department,
    salary,
    ROW_NUMBER() OVER (
        PARTITION BY department
        ORDER BY salary DESC
    ) as salary_rank_in_dept
FROM employees;
\`\`\`

## 윈도우 함수 vs GROUP BY

| 특성 | GROUP BY | 윈도우 함수 |
|------|----------|------------|
| 결과 행 수 | 그룹 수만큼 축소 | 원본 행 수 유지 |
| 원본 데이터 | 접근 불가 | 함께 출력 가능 |
| 활용 | 단순 집계 | 분석/비교 |

## 주의사항

1. **PARTITION BY 없이 OVER()**: 전체 데이터가 하나의 윈도우
2. **ORDER BY 없이 순위 함수**: ROW_NUMBER는 비결정적 결과 반환
3. **SELECT 절에서만 사용**: WHERE/GROUP BY/HAVING에서 직접 사용 불가

\`\`\`sql
-- WHERE에서 직접 사용 불가! (에러)
SELECT * FROM employees
WHERE ROW_NUMBER() OVER (ORDER BY salary) <= 5;

-- 서브쿼리/CTE로 우회해야 함
WITH ranked AS (
    SELECT *, ROW_NUMBER() OVER (ORDER BY salary DESC) as rn
    FROM employees
)
SELECT * FROM ranked WHERE rn <= 5;
\`\`\``,
      externalLinks: [
        {
          title: 'PostgreSQL Window Functions',
          url: 'https://www.postgresql.org/docs/current/tutorial-window.html'
        },
        {
          title: 'MySQL Window Functions',
          url: 'https://dev.mysql.com/doc/refman/8.0/en/window-functions.html'
        }
      ]
    }
  },
  {
    id: 'w3d1-code-row-number',
    type: 'code',
    title: '실습: ROW_NUMBER() 완전 정복',
    duration: 25,
    access: 'core',
    content: {
      instructions: `ROW_NUMBER() 함수를 사용하여 순위를 부여하는 연습입니다.

**문제 1**: 전체 직원에게 급여 순위 부여 (높은 급여 = 1등)
**문제 2**: 부서별로 급여 순위 부여 (PARTITION BY 사용)
**문제 3**: 부서별 상위 3명만 선택 (CTE/서브쿼리 활용)`,
      starterCode: `-- 연습용 테이블 생성 (PostgreSQL 기준)
CREATE TEMP TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    department VARCHAR(50),
    salary DECIMAL(10,2),
    hire_date DATE
);

INSERT INTO employees (name, department, salary, hire_date) VALUES
('Alice', 'Sales', 50000, '2020-01-15'),
('Bob', 'Sales', 55000, '2019-06-01'),
('Charlie', 'IT', 70000, '2018-03-20'),
('Diana', 'IT', 60000, '2021-09-10'),
('Eve', 'IT', 75000, '2017-11-25'),
('Frank', 'HR', 45000, '2022-02-01'),
('Grace', 'HR', 48000, '2020-08-15'),
('Henry', 'Sales', 52000, '2021-04-20');

-- 문제 1: 전체 직원 급여 순위


-- 문제 2: 부서별 급여 순위


-- 문제 3: 부서별 상위 3명만 선택
`,
      solutionCode: `-- 문제 1: 전체 직원 급여 순위
SELECT
    name,
    department,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as salary_rank
FROM employees;
-- 결과: Eve(1), Charlie(2), Diana(3), Bob(4), ...

-- 문제 2: 부서별 급여 순위
SELECT
    name,
    department,
    salary,
    ROW_NUMBER() OVER (
        PARTITION BY department
        ORDER BY salary DESC
    ) as dept_salary_rank
FROM employees;
-- 결과:
-- IT: Eve(1), Charlie(2), Diana(3)
-- Sales: Bob(1), Henry(2), Alice(3)
-- HR: Grace(1), Frank(2)

-- 문제 3: 부서별 상위 3명만 선택
WITH ranked_employees AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY department
            ORDER BY salary DESC
        ) as rn
    FROM employees
)
SELECT name, department, salary
FROM ranked_employees
WHERE rn <= 3;
-- 모든 부서의 상위 3명 출력`,
      hints: [
        'ROW_NUMBER()는 항상 고유한 번호 부여 (동점이어도 다른 번호)',
        'ORDER BY DESC로 높은 값이 1등이 되도록 정렬',
        'WHERE절에서 직접 윈도우 함수 사용 불가 → CTE 또는 서브쿼리 필수'
      ]
    }
  },
  {
    id: 'w3d1-code-rank-dense-rank',
    type: 'code',
    title: '실습: RANK() vs DENSE_RANK()',
    duration: 25,
    access: 'core',
    content: {
      instructions: `ROW_NUMBER, RANK, DENSE_RANK의 차이점을 이해합니다.

**동점(tie) 상황에서의 차이점:**
- ROW_NUMBER: 항상 1, 2, 3, 4, 5, 6... (동점 무시)
- RANK: 동점이면 같은 번호, 다음은 건너뜀 (1, 1, 3, 4, 4, 6)
- DENSE_RANK: 동점이면 같은 번호, 건너뜀 없음 (1, 1, 2, 3, 3, 4)`,
      starterCode: `-- 샘플 데이터
CREATE TEMP TABLE scores (
    student_name VARCHAR(50),
    score INT
);

INSERT INTO scores VALUES
('Alice', 95),
('Bob', 95),      -- Alice와 동점!
('Charlie', 90),
('Diana', 85),
('Eve', 85),      -- Diana와 동점!
('Frank', 80);

-- 문제 1: 세 함수를 모두 사용하여 순위 비교


-- 문제 2: 어떤 상황에서 어떤 함수를 사용해야 할까요?
-- 각 사용 케이스를 주석으로 작성해보세요
`,
      solutionCode: `-- 문제 1: 세 함수 비교
SELECT
    student_name,
    score,
    ROW_NUMBER() OVER (ORDER BY score DESC) as row_num,
    RANK() OVER (ORDER BY score DESC) as rank_val,
    DENSE_RANK() OVER (ORDER BY score DESC) as dense_rank_val
FROM scores;

/*
결과:
| student_name | score | row_num | rank_val | dense_rank_val |
|--------------|-------|---------|----------|----------------|
| Alice        | 95    | 1       | 1        | 1              |
| Bob          | 95    | 2       | 1        | 1              |
| Charlie      | 90    | 3       | 3        | 2              |
| Diana        | 85    | 4       | 4        | 3              |
| Eve          | 85    | 5       | 4        | 3              |
| Frank        | 80    | 6       | 6        | 4              |
*/

-- 문제 2: 사용 케이스

-- ROW_NUMBER: 무조건 고유 번호가 필요할 때
-- 예: 페이지네이션, 중복 제거, 각 행 고유 식별

-- RANK: 공정한 순위 매기기 (건너뛰기 포함)
-- 예: 대회 순위, 성적 순위 (공동 1등 다음은 3등)

-- DENSE_RANK: 연속 순위 (건너뛰기 없음)
-- 예: 등급 분류, Top N 카테고리 선정`,
      hints: [
        'ROW_NUMBER: 항상 1, 2, 3, 4, 5, 6... (동점 무시)',
        'RANK: 동점이면 같은 번호, 다음은 건너뜀 (1, 1, 3, 4, 4, 6)',
        'DENSE_RANK: 동점이면 같은 번호, 건너뜀 없음 (1, 1, 2, 3, 3, 4)'
      ]
    }
  },
  {
    id: 'w3d1-code-lag-lead',
    type: 'code',
    title: '실습: LAG()와 LEAD() - 행 간 비교',
    duration: 25,
    access: 'core',
    content: {
      instructions: `LAG()와 LEAD()를 사용하여 이전/다음 행의 값을 참조합니다.

- LAG(column, n): n행 이전 값
- LEAD(column, n): n행 이후 값

시계열 분석, 변화율 계산에 필수적인 함수입니다.`,
      starterCode: `-- 샘플 데이터: 일별 매출
CREATE TEMP TABLE daily_sales (
    sale_date DATE,
    revenue DECIMAL(10,2)
);

INSERT INTO daily_sales VALUES
('2024-01-01', 1000),
('2024-01-02', 1200),
('2024-01-03', 1100),
('2024-01-04', 1500),
('2024-01-05', 1300);

-- 문제 1: 전일 매출과 당일 매출 비교


-- 문제 2: 전일 대비 증감액 계산


-- 문제 3: 전일 대비 증감률(%) 계산


-- 문제 4: 다음 날 매출 미리보기 (LEAD 사용)
`,
      solutionCode: `-- 문제 1: 전일 매출과 당일 매출 비교
SELECT
    sale_date,
    revenue as today_revenue,
    LAG(revenue, 1) OVER (ORDER BY sale_date) as yesterday_revenue
FROM daily_sales;
/*
| sale_date  | today_revenue | yesterday_revenue |
|------------|---------------|-------------------|
| 2024-01-01 | 1000          | NULL              |
| 2024-01-02 | 1200          | 1000              |
| 2024-01-03 | 1100          | 1200              |
*/

-- 문제 2: 전일 대비 증감액 계산
SELECT
    sale_date,
    revenue,
    LAG(revenue) OVER (ORDER BY sale_date) as prev_revenue,
    revenue - LAG(revenue) OVER (ORDER BY sale_date) as change_amount
FROM daily_sales;

-- 문제 3: 전일 대비 증감률(%) 계산
SELECT
    sale_date,
    revenue,
    ROUND(
        (revenue - LAG(revenue) OVER (ORDER BY sale_date))
        / LAG(revenue) OVER (ORDER BY sale_date) * 100,
        2
    ) as change_pct
FROM daily_sales;

-- 문제 4: 다음 날 매출 미리보기 (LEAD 사용)
SELECT
    sale_date,
    revenue as today,
    LEAD(revenue, 1) OVER (ORDER BY sale_date) as tomorrow,
    LEAD(revenue, 2) OVER (ORDER BY sale_date) as day_after_tomorrow
FROM daily_sales;`,
      hints: [
        'LAG(column, n, default): n행 이전 값, 없으면 default 반환',
        'LEAD(column, n, default): n행 이후 값, 없으면 default 반환',
        '기본 offset은 1 (직전/직후 행)',
        'NULL 처리: COALESCE() 또는 세 번째 인자 활용'
      ]
    }
  },
  {
    id: 'w3d1-quiz-window-basics',
    type: 'quiz',
    title: '퀴즈: 윈도우 함수 기초',
    duration: 15,
    access: 'core',
    content: {
      questions: [
        {
          question: '윈도우 함수와 GROUP BY의 가장 큰 차이점은?',
          options: [
            '윈도우 함수가 더 빠르다',
            '윈도우 함수는 원본 행 수를 유지하고, GROUP BY는 그룹 수로 축소한다',
            'GROUP BY는 정렬이 불가능하다',
            '윈도우 함수는 집계 함수를 사용할 수 없다'
          ],
          answer: 1,
          explanation: '윈도우 함수는 각 행에 계산 결과를 추가하여 원본 행 수를 유지합니다. GROUP BY는 그룹별로 1개 행씩 반환하여 행 수가 줄어듭니다.'
        },
        {
          question: 'ROW_NUMBER(), RANK(), DENSE_RANK()에서 동점(95, 95, 90)일 때 세 번째 값의 순위는?',
          options: [
            'ROW_NUMBER=3, RANK=3, DENSE_RANK=3',
            'ROW_NUMBER=3, RANK=3, DENSE_RANK=2',
            'ROW_NUMBER=2, RANK=3, DENSE_RANK=2',
            'ROW_NUMBER=3, RANK=2, DENSE_RANK=2'
          ],
          answer: 1,
          explanation: 'ROW_NUMBER는 항상 연속 번호(1,2,3), RANK는 동점 후 건너뜀(1,1,3), DENSE_RANK는 동점 후 연속(1,1,2)입니다.'
        },
        {
          question: '다음 쿼리의 결과로 올바른 것은?\nSELECT LAG(value, 2) OVER (ORDER BY id) FROM (VALUES (1,10), (2,20), (3,30)) AS t(id, value);',
          options: [
            '10, 20, 30',
            'NULL, NULL, 10',
            'NULL, 10, 20',
            '30, 20, 10'
          ],
          answer: 1,
          explanation: 'LAG(value, 2)는 2행 이전 값을 반환합니다. 첫 두 행은 이전 2행이 없어 NULL, 세 번째 행에서 id=1의 값 10을 반환합니다.'
        },
        {
          question: 'WHERE 절에서 윈도우 함수를 직접 사용할 수 없는 이유는?',
          options: [
            '문법 오류가 발생하기 때문',
            '윈도우 함수는 SELECT 절 처리 후 계산되기 때문',
            '윈도우 함수는 숫자만 반환하기 때문',
            'WHERE 절은 집계 함수만 지원하기 때문'
          ],
          answer: 1,
          explanation: 'SQL 실행 순서: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. 윈도우 함수는 SELECT 단계에서 계산되므로 WHERE에서 참조 불가합니다.'
        },
        {
          question: '부서별 최고 급여자 1명씩을 선택하는 가장 적절한 방법은?',
          options: [
            'GROUP BY department HAVING salary = MAX(salary)',
            'WHERE salary = (SELECT MAX(salary) FROM employees)',
            'CTE에서 RANK() 또는 ROW_NUMBER()로 순위 매기고 WHERE rn = 1',
            'ORDER BY salary DESC LIMIT 1'
          ],
          answer: 2,
          explanation: 'CTE 또는 서브쿼리에서 PARTITION BY department와 ROW_NUMBER()로 부서별 순위를 매긴 후 rn = 1 조건으로 필터링하는 것이 가장 정확합니다.'
        }
      ]
    }
  },
  {
    id: 'w3d1-challenge-window',
    type: 'challenge',
    title: '챌린지: 실전 윈도우 함수 분석',
    duration: 25,
    access: 'core',
    content: {
      instructions: `이커머스 주문 데이터를 윈도우 함수로 분석합니다.

다음 4가지 분석을 수행하세요:
1. 각 고객별 누적 구매 횟수와 누적 구매 금액 계산
2. 각 카테고리 내에서 주문 금액 순위 매기기 (RANK 사용)
3. 고객별 이전 주문 대비 금액 변화 계산 (LAG 사용)
4. 각 고객의 평균 주문 금액 대비 현재 주문 차이 계산`,
      starterCode: `-- 샘플 데이터
CREATE TEMP TABLE orders (
    order_id INT,
    customer_id INT,
    order_date DATE,
    amount DECIMAL(10,2),
    category VARCHAR(50)
);

INSERT INTO orders VALUES
(1, 101, '2024-01-01', 150, 'Electronics'),
(2, 102, '2024-01-01', 80, 'Books'),
(3, 101, '2024-01-02', 200, 'Electronics'),
(4, 103, '2024-01-02', 120, 'Clothing'),
(5, 102, '2024-01-03', 90, 'Books'),
(6, 101, '2024-01-03', 300, 'Electronics'),
(7, 104, '2024-01-04', 50, 'Books'),
(8, 103, '2024-01-04', 180, 'Clothing'),
(9, 101, '2024-01-05', 250, 'Electronics'),
(10, 102, '2024-01-05', 100, 'Books');

-- 문제 1: 고객별 누적 구매 횟수와 금액


-- 문제 2: 카테고리 내 금액 순위


-- 문제 3: 고객별 이전 주문 대비 금액 변화


-- 문제 4: 고객 평균 대비 현재 주문 차이
`,
      requirements: [
        '4가지 분석 쿼리 모두 완성',
        'PARTITION BY와 ORDER BY 적절히 조합',
        'LAG(), RANK(), COUNT(), SUM(), AVG() 윈도우 함수 활용'
      ],
      evaluationCriteria: [
        '쿼리 문법 오류 없음',
        '결과가 논리적으로 올바름',
        '윈도우 함수를 적절히 활용'
      ],
      hints: [
        '누적 계산: ORDER BY 절이 있으면 현재 행까지의 누적 계산',
        'PARTITION BY customer_id로 고객별 그룹화',
        'LAG()에서 첫 행은 NULL 반환 (COALESCE로 처리 가능)',
        'AVG() OVER ()에 ORDER BY 없으면 전체 파티션 평균'
      ]
    }
  }
]
