// Day 3: CTE & 재귀 쿼리
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'w3d3-video-cte-intro',
    type: 'video',
    title: 'CTE(Common Table Expression)란?',
    duration: 15,
    access: 'core',
    content: {
      objectives: [
        'CTE의 개념과 장점 이해',
        'WITH 절 기본 문법 학습',
        '서브쿼리 vs CTE 비교'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=K1WeoKxLZ5o',
      transcript: `## CTE란?

CTE는 복잡한 쿼리를 읽기 쉽게 만드는 강력한 도구입니다.

### CTE의 장점
1. **가독성**: 복잡한 쿼리를 논리적 단계로 분리
2. **재사용성**: 같은 쿼리를 여러 번 참조 가능
3. **유지보수성**: 수정이 쉽고 디버깅이 편리
4. **재귀 지원**: 계층적 데이터 처리 가능

### 기본 구문
\`\`\`sql
WITH cte_name AS (
    SELECT ...
)
SELECT * FROM cte_name;
\`\`\``,
      keyPoints: [
        'CTE = WITH 절로 정의하는 임시 결과 집합',
        '가독성과 유지보수성 향상의 핵심 도구',
        '하나의 쿼리에서 여러 CTE 정의 가능',
        '재귀 CTE로 계층적 데이터 처리 가능'
      ]
    }
  },
  {
    id: 'w3d3-reading-cte-syntax',
    type: 'reading',
    title: 'CTE 문법과 활용 패턴',
    duration: 20,
    access: 'core',
    content: {
      markdown: `# CTE 문법과 활용 패턴

## 기본 CTE 문법

\`\`\`sql
WITH cte_name AS (
    SELECT column1, column2
    FROM table_name
    WHERE condition
)
SELECT * FROM cte_name;
\`\`\`

## 여러 CTE 연결

\`\`\`sql
WITH
    cte1 AS (SELECT id, name FROM customers),
    cte2 AS (SELECT customer_id, SUM(amount) as total FROM orders GROUP BY customer_id),
    cte3 AS (
        SELECT c.name, o.total
        FROM cte1 c JOIN cte2 o ON c.id = o.customer_id
    )
SELECT * FROM cte3;
\`\`\`

## CTE 활용 패턴

### 1. 단계별 데이터 변환
\`\`\`sql
WITH
    filtered_data AS (SELECT * FROM orders WHERE status = 'completed'),
    aggregated AS (SELECT customer_id, COUNT(*) as cnt FROM filtered_data GROUP BY customer_id)
SELECT * FROM aggregated;
\`\`\`

### 2. 중복 제거 패턴
\`\`\`sql
WITH ranked AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn
    FROM users
)
SELECT * FROM ranked WHERE rn = 1;
\`\`\`

## 성능 고려사항

| 상황 | 권장 |
|------|------|
| 동일 CTE 여러 번 참조 | CTE 사용 |
| 재귀 쿼리 | CTE 필수 |
| 복잡한 로직 | CTE로 가독성 확보 |`,
      externalLinks: [
        {
          title: 'PostgreSQL WITH Queries',
          url: 'https://www.postgresql.org/docs/current/queries-with.html'
        }
      ]
    }
  },
  {
    id: 'w3d3-code-cte-basics',
    type: 'code',
    title: '실습: CTE 기본 활용',
    duration: 25,
    access: 'core',
    content: {
      instructions: `CTE를 사용하여 복잡한 쿼리를 단계별로 분리합니다.

**문제 1**: 카테고리별 평균 가격보다 비싼 상품 찾기
**문제 2**: 주문된 상품의 카테고리별 총 판매량
**문제 3**: 재고 대비 판매 비율 Top 3`,
      starterCode: `CREATE TEMP TABLE products (
    id INT PRIMARY KEY, name VARCHAR(100), category VARCHAR(50),
    price DECIMAL(10,2), stock INT
);

CREATE TEMP TABLE order_items (
    id INT PRIMARY KEY, product_id INT, quantity INT, order_date DATE
);

INSERT INTO products VALUES
(1, 'Laptop', 'Electronics', 1200, 50),
(2, 'Phone', 'Electronics', 800, 100),
(3, 'Tablet', 'Electronics', 500, 75),
(4, 'Shirt', 'Fashion', 50, 200),
(5, 'Pants', 'Fashion', 80, 150);

INSERT INTO order_items VALUES
(1, 1, 2, '2024-01-15'), (2, 2, 5, '2024-01-15'),
(3, 3, 3, '2024-01-16'), (4, 1, 1, '2024-01-17'),
(5, 4, 10, '2024-01-17');

-- 문제 1: 카테고리별 평균보다 비싼 상품


-- 문제 2: 카테고리별 총 판매량


-- 문제 3: 재고 대비 판매 비율 Top 3
`,
      solutionCode: `-- 문제 1: 카테고리별 평균보다 비싼 상품
WITH category_avg AS (
    SELECT category, AVG(price) as avg_price
    FROM products GROUP BY category
)
SELECT p.name, p.category, p.price, ROUND(ca.avg_price, 2) as category_avg
FROM products p
JOIN category_avg ca ON p.category = ca.category
WHERE p.price > ca.avg_price;

-- 문제 2: 카테고리별 총 판매량
WITH product_sales AS (
    SELECT product_id, SUM(quantity) as total_sold
    FROM order_items GROUP BY product_id
)
SELECT p.category, SUM(ps.total_sold) as category_total
FROM products p
LEFT JOIN product_sales ps ON p.id = ps.product_id
GROUP BY p.category;

-- 문제 3: 재고 대비 판매 비율 Top 3
WITH sales_by_product AS (
    SELECT product_id, SUM(quantity) as total_sold
    FROM order_items GROUP BY product_id
)
SELECT p.name, p.stock, COALESCE(s.total_sold, 0) as sold,
       ROUND(COALESCE(s.total_sold, 0) * 100.0 / p.stock, 2) as sell_rate
FROM products p
LEFT JOIN sales_by_product s ON p.id = s.product_id
ORDER BY sell_rate DESC LIMIT 3;`,
      hints: [
        'CTE 이름은 명확하게 지정',
        '여러 CTE는 콤마로 구분',
        'COALESCE로 NULL 처리'
      ]
    }
  },
  {
    id: 'w3d3-video-recursive',
    type: 'video',
    title: '재귀 CTE의 원리',
    duration: 15,
    access: 'core',
    content: {
      objectives: [
        '재귀 CTE의 작동 원리 이해',
        'Anchor와 Recursive 멤버 구분',
        '무한 루프 방지 방법'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=cKdVAKCDHE4',
      transcript: `## 재귀 CTE란?

재귀 CTE는 계층적 데이터를 다루는 SQL의 핵심 기능입니다.

### 재귀 CTE 구조
\`\`\`sql
WITH RECURSIVE cte_name AS (
    -- Anchor: 시작점
    SELECT ...
    UNION ALL
    -- Recursive: 자기 자신을 참조
    SELECT ... FROM cte_name WHERE 종료조건
)
SELECT * FROM cte_name;
\`\`\`

### 사용 사례
- 조직도 (상사-부하 관계)
- 카테고리 트리 (부모-자식)
- 경로 탐색 (그래프)
- 날짜 생성 (시계열)`,
      keyPoints: [
        'RECURSIVE 키워드로 재귀 CTE 선언',
        'Anchor 멤버: 시작점, 재귀 없이 실행',
        'Recursive 멤버: 자신을 참조, 반복 실행',
        '종료 조건 없으면 무한 루프'
      ]
    }
  },
  {
    id: 'w3d3-code-recursive',
    type: 'code',
    title: '실습: 재귀 CTE 활용',
    duration: 30,
    access: 'core',
    content: {
      instructions: `재귀 CTE로 조직도, 카테고리 트리, 경로 탐색을 구현합니다.

**문제 1**: 전체 조직도 출력 (레벨, 경로 포함)
**문제 2**: 특정 직원의 모든 상위 관리자 찾기
**문제 3**: 숫자 1-10 생성`,
      starterCode: `CREATE TEMP TABLE employees (
    id INT, name VARCHAR(50), manager_id INT,
    department VARCHAR(50), salary DECIMAL(10,2)
);

INSERT INTO employees VALUES
(1, 'Kim CEO', NULL, 'Executive', 200000),
(2, 'Lee CTO', 1, 'Technology', 150000),
(3, 'Park CFO', 1, 'Finance', 150000),
(4, 'Choi Dev Lead', 2, 'Technology', 100000),
(5, 'Jung Finance Lead', 3, 'Finance', 100000),
(6, 'Kang Senior Dev', 4, 'Technology', 80000);

-- 문제 1: 전체 조직도


-- 문제 2: id=6의 상위 관리자 찾기


-- 문제 3: 숫자 1-10 생성
`,
      solutionCode: `-- 문제 1: 전체 조직도
WITH RECURSIVE org_tree AS (
    SELECT id, name, manager_id, 0 as level, name as path
    FROM employees WHERE manager_id IS NULL
    UNION ALL
    SELECT e.id, e.name, e.manager_id, ot.level + 1, ot.path || ' > ' || e.name
    FROM employees e
    JOIN org_tree ot ON e.manager_id = ot.id
)
SELECT REPEAT('  ', level) || name as org_chart, level, path
FROM org_tree ORDER BY path;

-- 문제 2: id=6의 상위 관리자
WITH RECURSIVE reporting_line AS (
    SELECT id, name, manager_id, 0 as level
    FROM employees WHERE id = 6
    UNION ALL
    SELECT e.id, e.name, e.manager_id, rl.level + 1
    FROM employees e
    JOIN reporting_line rl ON e.id = rl.manager_id
)
SELECT level, name FROM reporting_line ORDER BY level;

-- 문제 3: 숫자 1-10
WITH RECURSIVE numbers AS (
    SELECT 1 as n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 10
)
SELECT * FROM numbers;`,
      hints: [
        'Anchor: 시작점 (CEO, 첫 숫자)',
        'Recursive: 이전 결과 참조',
        'WHERE 조건으로 종료'
      ]
    }
  },
  {
    id: 'w3d3-quiz-cte',
    type: 'quiz',
    title: '퀴즈: CTE & 재귀 쿼리',
    duration: 15,
    access: 'core',
    content: {
      questions: [
        {
          question: 'CTE의 주요 장점이 아닌 것은?',
          options: ['가독성 향상', '동일 쿼리 여러 번 참조', '쿼리 실행 속도 보장', '복잡한 로직 분리'],
          answer: 2,
          explanation: 'CTE는 가독성을 향상시키지만, 실행 속도를 보장하지는 않습니다.'
        },
        {
          question: '재귀 CTE에서 Anchor 멤버의 역할은?',
          options: ['반복 종료 조건', '재귀의 시작점 정의', '결과 필터링', '중복 제거'],
          answer: 1,
          explanation: 'Anchor 멤버는 재귀의 시작점(초기값)을 정의합니다.'
        },
        {
          question: '재귀 CTE를 사용해야 하는 상황은?',
          options: ['테이블 간 단순 조인', '집계 함수로 합계 계산', '조직도에서 모든 하위 직원 찾기', '윈도우 함수로 순위'],
          answer: 2,
          explanation: '계층적 데이터에서 모든 하위 노드를 찾으려면 재귀 CTE가 필요합니다.'
        },
        {
          question: '무한 루프를 방지하는 방법이 아닌 것은?',
          options: ['WHERE 절에 종료 조건', 'UNION 대신 UNION ALL', 'DB의 최대 재귀 깊이 설정', '방문 노드 추적'],
          answer: 1,
          explanation: 'UNION vs UNION ALL은 중복 처리 방식의 차이이며, 무한 루프 방지와 직접 관련이 없습니다.'
        },
        {
          question: 'WITH RECURSIVE에서 여러 CTE를 정의할 때 올바른 방법은?',
          options: ['WITH RECURSIVE를 여러 번 작성', '첫 번째만 RECURSIVE를 붙이고 나머지는 콤마로 구분', '각 CTE마다 RECURSIVE 붙임', '혼합 불가'],
          answer: 1,
          explanation: 'WITH RECURSIVE는 한 번만 선언하고, 여러 CTE를 콤마로 구분합니다.'
        }
      ]
    }
  },
  {
    id: 'w3d3-challenge-cte',
    type: 'challenge',
    title: '챌린지: 복잡한 CTE 활용',
    duration: 30,
    access: 'core',
    content: {
      instructions: `쇼핑몰 카테고리 분석을 수행합니다.

다음을 구현하세요:
1. 카테고리 트리 전체 출력 (레벨, 전체 경로)
2. 각 카테고리의 직접 상품 수와 하위 포함 전체 상품 수
3. 카테고리별 총 매출 (하위 카테고리 포함)`,
      starterCode: `CREATE TEMP TABLE categories (
    id INT, name VARCHAR(50), parent_id INT
);

CREATE TEMP TABLE cat_products (
    id INT, name VARCHAR(100), category_id INT, price DECIMAL(10,2)
);

INSERT INTO categories VALUES
(1, 'All Products', NULL),
(2, 'Electronics', 1), (3, 'Fashion', 1),
(4, 'Computers', 2), (5, 'Phones', 2),
(6, 'Laptops', 4), (7, 'Desktops', 4);

INSERT INTO cat_products VALUES
(1, 'MacBook', 6, 2500), (2, 'Dell XPS', 6, 1800),
(3, 'iMac', 7, 2200), (4, 'iPhone', 5, 1200);

-- 종합 분석 쿼리
`,
      requirements: [
        '재귀 CTE로 카테고리 트리 구축',
        '하위 카테고리 포함 집계',
        '상품 수와 매출 계산'
      ],
      evaluationCriteria: [
        '재귀 CTE 문법 오류 없음',
        '계층 구조가 올바르게 표현됨',
        '집계가 정확함'
      ],
      hints: [
        '먼저 카테고리 트리를 재귀 CTE로 구축',
        '각 카테고리의 모든 하위 ID를 수집하는 별도 CTE 필요',
        '여러 CTE를 조합하여 최종 결과 생성'
      ]
    }
  }
]
