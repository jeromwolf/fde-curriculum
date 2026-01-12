// Day 5: Weekly Project - SQL 분석 쿼리 20개
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'w3d5-video-project-intro',
    type: 'video',
    title: 'Weekly Project: SQL 분석 쿼리 20개',
    duration: 10,
    access: 'core',
    content: {
      objectives: [
        '윈도우 함수를 활용한 분석 쿼리 작성',
        'CTE로 복잡한 로직을 단계별로 분리',
        '실행 계획을 고려한 최적화된 쿼리 작성'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=sql-project-intro',
      transcript: `## 프로젝트 목표

이번 주 학습한 SQL 심화 기법을 종합 활용합니다.

### 프로젝트 시나리오
가상의 이커머스 플랫폼 데이터를 분석합니다:
- 고객 행동 분석
- 매출 트렌드 분석
- 상품 성과 분석
- 코호트 분석

총 20개의 분석 쿼리를 작성하며,
각 쿼리는 실제 비즈니스 의사결정에 활용 가능합니다.`,
      keyPoints: [
        '실전 비즈니스 시나리오 기반 쿼리',
        '윈도우 함수 + CTE 조합 활용',
        '성능을 고려한 쿼리 설계',
        '결과 해석 및 인사이트 도출'
      ]
    }
  },
  {
    id: 'w3d5-reading-dataset',
    type: 'reading',
    title: '프로젝트 데이터셋 구조',
    duration: 15,
    access: 'core',
    content: {
      markdown: `# 프로젝트 데이터셋 구조

## 테이블 스키마

### 1. customers (고객)
\`\`\`sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP,
    country VARCHAR(50),
    segment VARCHAR(20)  -- 'regular', 'premium', 'vip'
);
\`\`\`

### 2. products (상품)
\`\`\`sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    category VARCHAR(50),
    subcategory VARCHAR(50),
    price DECIMAL(10,2),
    cost DECIMAL(10,2),  -- 원가
    created_at TIMESTAMP
);
\`\`\`

### 3. orders (주문)
\`\`\`sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    order_date TIMESTAMP,
    status VARCHAR(20),  -- 'pending', 'completed', 'cancelled'
    total_amount DECIMAL(10,2),
    shipping_cost DECIMAL(10,2)
);
\`\`\`

### 4. order_items (주문 상세)
\`\`\`sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    quantity INT,
    unit_price DECIMAL(10,2),
    discount DECIMAL(5,2)  -- 할인율 (0.0 ~ 1.0)
);
\`\`\`

## 샘플 데이터 생성

\`\`\`sql
-- 고객 1,000명, 상품 100개, 주문 10,000건
-- 기간: 최근 2년

INSERT INTO customers (name, email, created_at, country, segment)
SELECT
    'Customer ' || i,
    'customer' || i || '@example.com',
    NOW() - (random() * 730)::INT * INTERVAL '1 day',
    (ARRAY['Korea', 'USA', 'Japan', 'China', 'Germany'])[1 + (random() * 4)::INT],
    (ARRAY['regular', 'premium', 'vip'])[1 + (random() * 2)::INT]
FROM generate_series(1, 1000) i;
\`\`\`

## 분석 주제

### 1. 고객 분석 (쿼리 1-5)
- 고객 세그먼트별 구매 패턴
- 고객 생애 가치 (LTV)
- 재구매율 분석
- 코호트 리텐션

### 2. 매출 분석 (쿼리 6-10)
- 일/주/월별 매출 트렌드
- 이동 평균 분석
- 전년 동기 대비
- 누적 매출 목표 달성률

### 3. 상품 분석 (쿼리 11-15)
- 카테고리별 성과
- 상품 순위 변동
- ABC 분석 (파레토)
- 마진 분석

### 4. 고급 분석 (쿼리 16-20)
- 바구니 분석
- 고객 세분화
- 이상 탐지
- 예측 분석 기초`,
      externalLinks: [
        {
          title: 'SQL Analytics Patterns',
          url: 'https://mode.com/sql-tutorial/sql-business-analytics-training/'
        }
      ]
    }
  },
  {
    id: 'w3d5-code-queries-1-5',
    type: 'code',
    title: '쿼리 1-5: 고객 분석',
    duration: 40,
    access: 'core',
    content: {
      instructions: `CTE와 윈도우 함수를 활용하여 고객 분석 쿼리를 작성합니다.

**쿼리 1**: 고객 세그먼트별 평균 주문 금액과 주문 횟수
**쿼리 2**: 고객별 첫 구매 ~ 마지막 구매까지의 일수 (고객 수명)
**쿼리 3**: 고객별 LTV (Life Time Value) 계산 및 상위 10명
**쿼리 4**: 재구매 고객 분석 (2회 이상 구매)
**쿼리 5**: 월별 신규 가입 고객의 첫 달 구매 전환율`,
      starterCode: `-- 프로젝트 쿼리 1-5: 고객 분석
-- 아래 쿼리를 완성하세요

-- 데이터 준비 (PostgreSQL)
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP,
    country VARCHAR(50),
    segment VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INT,
    order_date TIMESTAMP,
    status VARCHAR(20),
    total_amount DECIMAL(10,2)
);

-- 쿼리 1: 고객 세그먼트별 평균 주문 금액과 주문 횟수
-- 결과: segment, avg_order_amount, avg_order_count, customer_count


-- 쿼리 2: 고객별 첫 구매 ~ 마지막 구매까지의 일수 (고객 수명)
-- 결과: customer_id, first_order, last_order, lifespan_days


-- 쿼리 3: 고객별 LTV (Life Time Value) 계산 및 상위 10명
-- LTV = 총 구매 금액
-- 결과: customer_id, name, total_orders, ltv, ltv_rank


-- 쿼리 4: 재구매 고객 분석 (2회 이상 구매)
-- 결과: segment, total_customers, repeat_customers, repeat_rate


-- 쿼리 5: 월별 신규 가입 고객의 첫 달 구매 전환율
-- 결과: signup_month, new_customers, first_month_buyers, conversion_rate

`,
      solutionCode: `-- 샘플 데이터 생성
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP,
    country VARCHAR(50),
    segment VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INT,
    order_date TIMESTAMP,
    status VARCHAR(20),
    total_amount DECIMAL(10,2)
);

-- 기존 데이터 삭제 후 생성
TRUNCATE customers, orders CASCADE;

INSERT INTO customers (name, email, created_at, country, segment)
SELECT
    'Customer ' || i,
    'customer' || i || '@example.com',
    NOW() - (random() * 365)::INT * INTERVAL '1 day',
    (ARRAY['Korea', 'USA', 'Japan', 'China', 'Germany'])[1 + (random() * 4)::INT],
    (ARRAY['regular', 'premium', 'vip'])[1 + (random() * 2)::INT]
FROM generate_series(1, 500) i;

INSERT INTO orders (customer_id, order_date, status, total_amount)
SELECT
    (random() * 499 + 1)::INT,
    NOW() - (random() * 365)::INT * INTERVAL '1 day',
    (ARRAY['pending', 'completed', 'cancelled'])[1 + (random() * 2)::INT],
    (random() * 500 + 50)::DECIMAL(10,2)
FROM generate_series(1, 2000) i;

-- 쿼리 1: 고객 세그먼트별 평균 주문 금액과 주문 횟수
SELECT
    c.segment,
    ROUND(AVG(o.total_amount), 2) as avg_order_amount,
    ROUND(COUNT(o.id) * 1.0 / COUNT(DISTINCT c.id), 2) as avg_order_count,
    COUNT(DISTINCT c.id) as customer_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'completed'
GROUP BY c.segment
ORDER BY avg_order_amount DESC;

-- 쿼리 2: 고객별 수명 (첫 구매 ~ 마지막 구매)
SELECT
    c.id as customer_id,
    c.name,
    MIN(o.order_date) as first_order,
    MAX(o.order_date) as last_order,
    EXTRACT(DAY FROM MAX(o.order_date) - MIN(o.order_date)) as lifespan_days
FROM customers c
JOIN orders o ON c.id = o.customer_id AND o.status = 'completed'
GROUP BY c.id, c.name
HAVING COUNT(o.id) > 1  -- 2회 이상 구매
ORDER BY lifespan_days DESC
LIMIT 20;

-- 쿼리 3: 고객별 LTV (상위 10명)
WITH customer_ltv AS (
    SELECT
        c.id,
        c.name,
        c.segment,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as ltv,
        RANK() OVER (ORDER BY COALESCE(SUM(o.total_amount), 0) DESC) as ltv_rank
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'completed'
    GROUP BY c.id, c.name, c.segment
)
SELECT id, name, segment, total_orders, ltv, ltv_rank
FROM customer_ltv
WHERE ltv_rank <= 10
ORDER BY ltv_rank;

-- 쿼리 4: 재구매 고객 분석
WITH customer_orders AS (
    SELECT
        c.segment,
        c.id as customer_id,
        COUNT(o.id) as order_count
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'completed'
    GROUP BY c.segment, c.id
)
SELECT
    segment,
    COUNT(*) as total_customers,
    COUNT(CASE WHEN order_count >= 2 THEN 1 END) as repeat_customers,
    ROUND(
        COUNT(CASE WHEN order_count >= 2 THEN 1 END) * 100.0 / COUNT(*),
        2
    ) as repeat_rate
FROM customer_orders
GROUP BY segment
ORDER BY repeat_rate DESC;

-- 쿼리 5: 월별 신규 가입 → 첫 달 구매 전환율
WITH monthly_signups AS (
    SELECT
        DATE_TRUNC('month', created_at) as signup_month,
        id as customer_id
    FROM customers
),
first_month_orders AS (
    SELECT
        ms.signup_month,
        ms.customer_id,
        CASE WHEN EXISTS (
            SELECT 1 FROM orders o
            WHERE o.customer_id = ms.customer_id
              AND o.order_date >= ms.signup_month
              AND o.order_date < ms.signup_month + INTERVAL '1 month'
              AND o.status = 'completed'
        ) THEN 1 ELSE 0 END as converted
    FROM monthly_signups ms
)
SELECT
    TO_CHAR(signup_month, 'YYYY-MM') as signup_month,
    COUNT(*) as new_customers,
    SUM(converted) as first_month_buyers,
    ROUND(SUM(converted) * 100.0 / COUNT(*), 2) as conversion_rate
FROM first_month_orders
GROUP BY signup_month
ORDER BY signup_month DESC
LIMIT 12;`,
      hints: [
        'LEFT JOIN으로 주문 없는 고객도 포함',
        'CASE WHEN으로 조건부 카운트',
        'RANK() OVER로 순위 계산',
        'DATE_TRUNC으로 월별 그룹화'
      ]
    }
  },
  {
    id: 'w3d5-code-queries-6-10',
    type: 'code',
    title: '쿼리 6-10: 매출 분석',
    duration: 40,
    access: 'core',
    content: {
      instructions: `윈도우 함수를 활용하여 시계열 매출 분석 쿼리를 작성합니다.

**쿼리 6**: 일별 매출과 7일 이동 평균
**쿼리 7**: 월별 매출과 전월 대비 성장률
**쿼리 8**: 누적 매출과 연간 목표 달성률 (목표: 1억)
**쿼리 9**: 주간 매출 순위 (주차별)
**쿼리 10**: 전년 동월 대비 분석 (YoY)`,
      starterCode: `-- 프로젝트 쿼리 6-10: 매출 분석
-- 윈도우 함수를 활용한 시계열 분석

-- 쿼리 6: 일별 매출과 7일 이동 평균
-- 결과: order_date, daily_revenue, ma_7d


-- 쿼리 7: 월별 매출과 전월 대비 성장률
-- 결과: month, monthly_revenue, prev_month_revenue, growth_rate


-- 쿼리 8: 누적 매출과 연간 목표 달성률 (목표: 1억)
-- 결과: month, monthly_revenue, cumulative_revenue, target_pct


-- 쿼리 9: 주간 매출 순위 (주차별)
-- 결과: week_number, weekly_revenue, revenue_rank


-- 쿼리 10: 전년 동월 대비 분석 (YoY)
-- 결과: month, revenue_2024, revenue_2023, yoy_growth

`,
      solutionCode: `-- 쿼리 6: 일별 매출과 7일 이동 평균
WITH daily_revenue AS (
    SELECT
        DATE(order_date) as order_date,
        SUM(total_amount) as daily_revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY DATE(order_date)
)
SELECT
    order_date,
    daily_revenue,
    ROUND(
        AVG(daily_revenue) OVER (
            ORDER BY order_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ),
        2
    ) as ma_7d
FROM daily_revenue
ORDER BY order_date DESC
LIMIT 30;

-- 쿼리 7: 월별 매출과 전월 대비 성장률
WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', order_date) as month,
        SUM(total_amount) as monthly_revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT
    TO_CHAR(month, 'YYYY-MM') as month,
    monthly_revenue,
    LAG(monthly_revenue) OVER (ORDER BY month) as prev_month_revenue,
    ROUND(
        (monthly_revenue - LAG(monthly_revenue) OVER (ORDER BY month))
        * 100.0 / NULLIF(LAG(monthly_revenue) OVER (ORDER BY month), 0),
        2
    ) as growth_rate
FROM monthly_revenue
ORDER BY month DESC
LIMIT 12;

-- 쿼리 8: 누적 매출과 연간 목표 달성률
WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', order_date) as month,
        SUM(total_amount) as monthly_revenue
    FROM orders
    WHERE status = 'completed'
      AND EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT
    TO_CHAR(month, 'YYYY-MM') as month,
    monthly_revenue,
    SUM(monthly_revenue) OVER (ORDER BY month) as cumulative_revenue,
    ROUND(
        SUM(monthly_revenue) OVER (ORDER BY month) * 100.0 / 100000000,  -- 목표: 1억
        2
    ) as target_pct
FROM monthly_revenue
ORDER BY month;

-- 쿼리 9: 주간 매출 순위
WITH weekly_revenue AS (
    SELECT
        EXTRACT(WEEK FROM order_date) as week_number,
        DATE_TRUNC('week', order_date) as week_start,
        SUM(total_amount) as weekly_revenue
    FROM orders
    WHERE status = 'completed'
      AND EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY EXTRACT(WEEK FROM order_date), DATE_TRUNC('week', order_date)
)
SELECT
    week_number::INT,
    TO_CHAR(week_start, 'YYYY-MM-DD') as week_start,
    weekly_revenue,
    RANK() OVER (ORDER BY weekly_revenue DESC) as revenue_rank,
    CASE
        WHEN RANK() OVER (ORDER BY weekly_revenue DESC) <= 10 THEN 'Top 10'
        WHEN RANK() OVER (ORDER BY weekly_revenue DESC) <= 26 THEN 'Upper Half'
        ELSE 'Lower Half'
    END as tier
FROM weekly_revenue
ORDER BY week_number;

-- 쿼리 10: 전년 동월 대비 (YoY)
WITH yearly_monthly AS (
    SELECT
        EXTRACT(YEAR FROM order_date) as year,
        EXTRACT(MONTH FROM order_date) as month,
        SUM(total_amount) as revenue
    FROM orders
    WHERE status = 'completed'
      AND order_date >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year'
    GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(MONTH FROM order_date)
)
SELECT
    month::INT,
    MAX(CASE WHEN year = 2024 THEN revenue END) as revenue_2024,
    MAX(CASE WHEN year = 2023 THEN revenue END) as revenue_2023,
    ROUND(
        (MAX(CASE WHEN year = 2024 THEN revenue END) -
         MAX(CASE WHEN year = 2023 THEN revenue END)) * 100.0 /
        NULLIF(MAX(CASE WHEN year = 2023 THEN revenue END), 0),
        2
    ) as yoy_growth
FROM yearly_monthly
GROUP BY month
ORDER BY month;`,
      hints: [
        'ROWS BETWEEN 6 PRECEDING AND CURRENT ROW = 7일 이동평균',
        'LAG()로 전월 값 참조',
        'CASE WHEN으로 연도별 피벗',
        'NULLIF로 0 나누기 방지'
      ]
    }
  },
  {
    id: 'w3d5-code-queries-11-15',
    type: 'code',
    title: '쿼리 11-15: 상품 분석',
    duration: 40,
    access: 'core',
    content: {
      instructions: `상품 데이터를 분석하여 카테고리별 성과, 순위 변동, ABC 분석을 수행합니다.

**쿼리 11**: 카테고리별 매출과 전체 대비 비율
**쿼리 12**: 상품별 월별 매출 순위 변동
**쿼리 13**: ABC 분석 (파레토 법칙) - A: 상위 80%, B: 80-95%, C: 하위 5%
**쿼리 14**: 상품별 마진 분석
**쿼리 15**: 카테고리 내 Top 3 상품`,
      starterCode: `-- 프로젝트 쿼리 11-15: 상품 분석
-- 상품 테이블 추가

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    category VARCHAR(50),
    subcategory VARCHAR(50),
    price DECIMAL(10,2),
    cost DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2),
    discount DECIMAL(5,2)
);

-- 쿼리 11: 카테고리별 매출과 전체 대비 비율
-- 결과: category, revenue, revenue_pct


-- 쿼리 12: 상품별 월별 매출 순위 변동
-- 결과: product_id, product_name, month, monthly_revenue, rank, rank_change


-- 쿼리 13: ABC 분석 (파레토 법칙)
-- A: 매출 상위 80%, B: 80-95%, C: 하위 5%
-- 결과: product_id, name, revenue, cumulative_pct, abc_class


-- 쿼리 14: 상품별 마진 분석
-- 결과: product_id, name, total_revenue, total_cost, margin, margin_rate


-- 쿼리 15: 카테고리 내 Top 3 상품
-- 결과: category, product_name, revenue, category_rank

`,
      solutionCode: `-- 데이터 준비
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    category VARCHAR(50),
    subcategory VARCHAR(50),
    price DECIMAL(10,2),
    cost DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2),
    discount DECIMAL(5,2)
);

TRUNCATE products, order_items;

INSERT INTO products (name, category, subcategory, price, cost)
SELECT
    'Product ' || i,
    (ARRAY['Electronics', 'Fashion', 'Home', 'Sports', 'Books'])[1 + (i % 5)],
    'Sub ' || (i % 10 + 1),
    (random() * 200 + 20)::DECIMAL(10,2),
    (random() * 100 + 10)::DECIMAL(10,2)
FROM generate_series(1, 100) i;

INSERT INTO order_items (order_id, product_id, quantity, unit_price, discount)
SELECT
    (random() * 1999 + 1)::INT,
    (random() * 99 + 1)::INT,
    (random() * 5 + 1)::INT,
    (random() * 200 + 20)::DECIMAL(10,2),
    (random() * 0.3)::DECIMAL(5,2)
FROM generate_series(1, 5000) i;

-- 쿼리 11: 카테고리별 매출과 비율
WITH category_revenue AS (
    SELECT
        p.category,
        SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) as revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY p.category
)
SELECT
    category,
    ROUND(revenue, 2) as revenue,
    ROUND(revenue * 100.0 / SUM(revenue) OVER (), 2) as revenue_pct
FROM category_revenue
ORDER BY revenue DESC;

-- 쿼리 12: 상품별 월별 순위 변동
WITH monthly_product_revenue AS (
    SELECT
        p.id as product_id,
        p.name as product_name,
        DATE_TRUNC('month', o.order_date) as month,
        SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) as monthly_revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    WHERE o.status = 'completed'
    GROUP BY p.id, p.name, DATE_TRUNC('month', o.order_date)
),
ranked AS (
    SELECT
        *,
        RANK() OVER (PARTITION BY month ORDER BY monthly_revenue DESC) as rank,
        LAG(RANK() OVER (PARTITION BY month ORDER BY monthly_revenue DESC))
            OVER (PARTITION BY product_id ORDER BY month) as prev_rank
    FROM monthly_product_revenue
)
SELECT
    product_id,
    product_name,
    TO_CHAR(month, 'YYYY-MM') as month,
    ROUND(monthly_revenue, 2) as monthly_revenue,
    rank,
    COALESCE(prev_rank - rank, 0) as rank_change  -- 양수: 순위 상승
FROM ranked
WHERE rank <= 10
ORDER BY month DESC, rank
LIMIT 30;

-- 쿼리 13: ABC 분석
WITH product_revenue AS (
    SELECT
        p.id,
        p.name,
        SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) as revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY p.id, p.name
),
cumulative AS (
    SELECT
        *,
        SUM(revenue) OVER (ORDER BY revenue DESC) as cumulative_revenue,
        SUM(revenue) OVER () as total_revenue
    FROM product_revenue
)
SELECT
    id,
    name,
    ROUND(revenue, 2) as revenue,
    ROUND(cumulative_revenue * 100.0 / total_revenue, 2) as cumulative_pct,
    CASE
        WHEN cumulative_revenue * 100.0 / total_revenue <= 80 THEN 'A'
        WHEN cumulative_revenue * 100.0 / total_revenue <= 95 THEN 'B'
        ELSE 'C'
    END as abc_class
FROM cumulative
ORDER BY revenue DESC;

-- 쿼리 14: 상품별 마진 분석
SELECT
    p.id as product_id,
    p.name,
    ROUND(SUM(oi.quantity * oi.unit_price * (1 - oi.discount)), 2) as total_revenue,
    ROUND(SUM(oi.quantity * p.cost), 2) as total_cost,
    ROUND(SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) -
          SUM(oi.quantity * p.cost), 2) as margin,
    ROUND(
        (SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) -
         SUM(oi.quantity * p.cost)) * 100.0 /
        NULLIF(SUM(oi.quantity * oi.unit_price * (1 - oi.discount)), 0),
        2
    ) as margin_rate
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY margin DESC
LIMIT 20;

-- 쿼리 15: 카테고리 내 Top 3 상품
WITH product_category_revenue AS (
    SELECT
        p.category,
        p.name as product_name,
        SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) as revenue,
        RANK() OVER (
            PARTITION BY p.category
            ORDER BY SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) DESC
        ) as category_rank
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.category, p.name
)
SELECT
    category,
    product_name,
    ROUND(revenue, 2) as revenue,
    category_rank
FROM product_category_revenue
WHERE category_rank <= 3
ORDER BY category, category_rank;`,
      hints: [
        'SUM() OVER ()로 전체 합계 계산',
        'LAG()로 이전 순위 참조',
        'ABC 분석: 누적 비율 기준 분류',
        'PARTITION BY category로 카테고리별 순위'
      ]
    }
  },
  {
    id: 'w3d5-code-queries-16-20',
    type: 'code',
    title: '쿼리 16-20: 고급 분석',
    duration: 45,
    access: 'core',
    content: {
      instructions: `고급 분석 기법을 활용하여 코호트 분석, 바구니 분석, RFM 세분화, 이상 탐지를 수행합니다.

**쿼리 16**: 월별 코호트 리텐션 분석
**쿼리 17**: 함께 구매되는 상품 분석 (바구니 분석)
**쿼리 18**: 고객 RFM 세분화
**쿼리 19**: 이상 주문 탐지 (평균 대비 3배 이상)
**쿼리 20**: 다음 구매 예측 (평균 구매 주기 기반)`,
      starterCode: `-- 프로젝트 쿼리 16-20: 고급 분석
-- 코호트 분석, 바구니 분석, 이상 탐지

-- 쿼리 16: 월별 코호트 리텐션 분석
-- 가입 월 기준 N개월 후 재구매율
-- 결과: cohort_month, month_number, customers, retention_rate


-- 쿼리 17: 함께 구매되는 상품 분석 (바구니 분석)
-- 결과: product_a, product_b, co_purchase_count, support


-- 쿼리 18: 고객 RFM 세분화
-- R(Recency), F(Frequency), M(Monetary) 기반 세분화
-- 결과: customer_id, r_score, f_score, m_score, rfm_segment


-- 쿼리 19: 이상 주문 탐지 (평균 대비 3배 이상)
-- 결과: order_id, customer_id, amount, avg_amount, is_anomaly


-- 쿼리 20: 다음 구매 예측 (평균 구매 주기 기반)
-- 결과: customer_id, last_order_date, avg_cycle_days, predicted_next_order

`,
      solutionCode: `-- 쿼리 16: 월별 코호트 리텐션
WITH customer_cohort AS (
    SELECT
        c.id as customer_id,
        DATE_TRUNC('month', c.created_at) as cohort_month
    FROM customers c
),
customer_activities AS (
    SELECT
        o.customer_id,
        DATE_TRUNC('month', o.order_date) as activity_month
    FROM orders o
    WHERE o.status = 'completed'
    GROUP BY o.customer_id, DATE_TRUNC('month', o.order_date)
),
cohort_data AS (
    SELECT
        cc.cohort_month,
        ca.activity_month,
        EXTRACT(MONTH FROM AGE(ca.activity_month, cc.cohort_month))::INT as month_number,
        COUNT(DISTINCT cc.customer_id) as customers
    FROM customer_cohort cc
    JOIN customer_activities ca ON cc.customer_id = ca.customer_id
    WHERE ca.activity_month >= cc.cohort_month
    GROUP BY cc.cohort_month, ca.activity_month
)
SELECT
    TO_CHAR(cohort_month, 'YYYY-MM') as cohort_month,
    month_number,
    customers,
    ROUND(
        customers * 100.0 /
        FIRST_VALUE(customers) OVER (PARTITION BY cohort_month ORDER BY month_number),
        2
    ) as retention_rate
FROM cohort_data
WHERE month_number <= 6
ORDER BY cohort_month, month_number;

-- 쿼리 17: 함께 구매되는 상품 (바구니 분석)
WITH order_products AS (
    SELECT
        oi.order_id,
        oi.product_id,
        p.name as product_name
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
)
SELECT
    op1.product_name as product_a,
    op2.product_name as product_b,
    COUNT(*) as co_purchase_count,
    ROUND(
        COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT order_id) FROM order_products),
        4
    ) as support
FROM order_products op1
JOIN order_products op2 ON op1.order_id = op2.order_id
    AND op1.product_id < op2.product_id  -- 중복 방지
GROUP BY op1.product_name, op2.product_name
HAVING COUNT(*) >= 5  -- 최소 5회 이상 동시 구매
ORDER BY co_purchase_count DESC
LIMIT 20;

-- 쿼리 18: RFM 세분화
WITH customer_rfm AS (
    SELECT
        c.id as customer_id,
        c.name,
        EXTRACT(DAY FROM CURRENT_DATE - MAX(o.order_date))::INT as recency,
        COUNT(o.id) as frequency,
        COALESCE(SUM(o.total_amount), 0) as monetary
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'completed'
    GROUP BY c.id, c.name
),
rfm_scores AS (
    SELECT
        customer_id,
        name,
        recency,
        frequency,
        monetary,
        NTILE(5) OVER (ORDER BY recency ASC) as r_score,
        NTILE(5) OVER (ORDER BY frequency DESC) as f_score,
        NTILE(5) OVER (ORDER BY monetary DESC) as m_score
    FROM customer_rfm
    WHERE frequency > 0
)
SELECT
    customer_id,
    name,
    r_score,
    f_score,
    m_score,
    r_score || f_score || m_score as rfm_score,
    CASE
        WHEN r_score >= 4 AND f_score >= 4 THEN 'Champions'
        WHEN r_score >= 4 AND f_score >= 2 THEN 'Loyal Customers'
        WHEN r_score >= 3 AND f_score >= 3 THEN 'Potential Loyalists'
        WHEN r_score >= 4 AND f_score = 1 THEN 'Recent Customers'
        WHEN r_score <= 2 AND f_score >= 4 THEN 'At Risk'
        WHEN r_score <= 2 AND f_score <= 2 THEN 'Hibernating'
        ELSE 'Need Attention'
    END as rfm_segment
FROM rfm_scores
ORDER BY rfm_score DESC
LIMIT 50;

-- 쿼리 19: 이상 주문 탐지
WITH customer_stats AS (
    SELECT
        customer_id,
        AVG(total_amount) as avg_amount,
        STDDEV(total_amount) as std_amount
    FROM orders
    WHERE status = 'completed'
    GROUP BY customer_id
    HAVING COUNT(*) >= 3
)
SELECT
    o.id as order_id,
    o.customer_id,
    o.total_amount as amount,
    ROUND(cs.avg_amount, 2) as avg_amount,
    ROUND(cs.std_amount, 2) as std_amount,
    CASE
        WHEN o.total_amount > cs.avg_amount + 3 * COALESCE(cs.std_amount, 0) THEN 'HIGH'
        WHEN o.total_amount < cs.avg_amount - 3 * COALESCE(cs.std_amount, 0) THEN 'LOW'
        ELSE 'NORMAL'
    END as anomaly_type
FROM orders o
JOIN customer_stats cs ON o.customer_id = cs.customer_id
WHERE o.status = 'completed'
  AND (o.total_amount > cs.avg_amount + 3 * COALESCE(cs.std_amount, 0)
       OR o.total_amount < cs.avg_amount - 3 * COALESCE(cs.std_amount, 0))
ORDER BY o.total_amount DESC;

-- 쿼리 20: 다음 구매 예측
WITH customer_orders AS (
    SELECT
        customer_id,
        order_date,
        LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) as prev_order_date
    FROM orders
    WHERE status = 'completed'
),
customer_cycles AS (
    SELECT
        customer_id,
        AVG(EXTRACT(DAY FROM order_date - prev_order_date)) as avg_cycle_days,
        MAX(order_date) as last_order_date
    FROM customer_orders
    WHERE prev_order_date IS NOT NULL
    GROUP BY customer_id
    HAVING COUNT(*) >= 2
)
SELECT
    c.id as customer_id,
    c.name,
    cc.last_order_date::DATE,
    ROUND(cc.avg_cycle_days, 0)::INT as avg_cycle_days,
    (cc.last_order_date + (cc.avg_cycle_days || ' days')::INTERVAL)::DATE as predicted_next_order,
    CASE
        WHEN cc.last_order_date + (cc.avg_cycle_days || ' days')::INTERVAL < CURRENT_DATE
        THEN 'OVERDUE'
        WHEN cc.last_order_date + (cc.avg_cycle_days || ' days')::INTERVAL < CURRENT_DATE + INTERVAL '7 days'
        THEN 'SOON'
        ELSE 'FUTURE'
    END as prediction_status
FROM customers c
JOIN customer_cycles cc ON c.id = cc.customer_id
ORDER BY predicted_next_order
LIMIT 30;`,
      hints: [
        '코호트: FIRST_VALUE로 기준 고객 수 참조',
        '바구니 분석: 자기 조인 + product_id < 조건으로 중복 방지',
        'RFM: NTILE(5)로 5등급 분류',
        '이상 탐지: 평균 ± 3*표준편차 규칙'
      ]
    }
  },
  {
    id: 'w3d5-quiz-project',
    type: 'quiz',
    title: '프로젝트 종합 퀴즈',
    duration: 15,
    access: 'core',
    content: {
      questions: [
        {
          question: '7일 이동 평균을 계산하려면 어떤 프레임 절을 사용해야 하나요?',
          options: [
            'ROWS BETWEEN 7 PRECEDING AND CURRENT ROW',
            'ROWS BETWEEN 6 PRECEDING AND CURRENT ROW',
            'ROWS BETWEEN 3 PRECEDING AND 3 FOLLOWING',
            'RANGE BETWEEN 7 PRECEDING AND CURRENT ROW'
          ],
          answer: 1,
          explanation: '현재 행 포함 7일 = 이전 6행 + 현재 1행. ROWS BETWEEN 6 PRECEDING AND CURRENT ROW'
        },
        {
          question: 'ABC 분석에서 A등급의 일반적인 기준은?',
          options: [
            '매출 상위 50%',
            '매출 상위 80%',
            '누적 매출 80% 이하',
            '상품 수 기준 20%'
          ],
          answer: 2,
          explanation: 'ABC 분석(파레토 법칙): A등급은 누적 매출 80% 이하에 해당하는 상품(약 20%)입니다.'
        },
        {
          question: 'RFM 분석에서 R(Recency) 점수가 높을수록 의미하는 것은?',
          options: [
            '구매 금액이 많음',
            '구매 빈도가 높음',
            '최근에 구매함',
            '오래전에 구매함'
          ],
          answer: 2,
          explanation: 'Recency는 마지막 구매 후 경과 일수입니다. R점수가 높을수록 최근에 구매한 고객입니다.'
        },
        {
          question: '코호트 리텐션 분석에서 FIRST_VALUE 함수의 역할은?',
          options: [
            '첫 번째 구매 날짜 계산',
            '가입 월의 고객 수 참조 (기준값)',
            '첫 번째 상품 찾기',
            '최초 매출 계산'
          ],
          answer: 1,
          explanation: '코호트 리텐션에서 FIRST_VALUE는 가입 월(month_number=0)의 고객 수를 참조하여 비율 계산의 기준이 됩니다.'
        },
        {
          question: '이상치 탐지에서 3-sigma 규칙의 의미는?',
          options: [
            '상위 3%만 이상치로 분류',
            '평균에서 표준편차의 3배 이상 벗어난 값',
            '3개 이상의 기준을 적용',
            '최근 3개월 데이터만 분석'
          ],
          answer: 1,
          explanation: '3-sigma 규칙: 평균 ± 3*표준편차 범위를 벗어나면 이상치로 판단합니다 (약 0.3% 확률).'
        }
      ]
    }
  }
]
