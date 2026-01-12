// Day 2: Star & Snowflake 스키마 (차원 모델링)
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'w4d2-video-dimensional-intro',
    type: 'video',
    title: '차원 모델링이란?',
    duration: 15,
    access: 'core',
    content: {
      objectives: [
        '차원 모델링의 개념과 목적 이해',
        'Fact와 Dimension 테이블 구분',
        'OLTP vs OLAP 차이 파악'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=lWPiSZf7-uQ',
      transcript: `## 차원 모델링 (Dimensional Modeling)

Ralph Kimball이 제안한 데이터 웨어하우스 설계 방법론입니다.

### OLTP vs OLAP

| 구분 | OLTP | OLAP |
|------|------|------|
| 목적 | 트랜잭션 처리 | 분석/리포팅 |
| 정규화 | 높은 정규화 (3NF) | 비정규화 |
| 쿼리 | 단순, 빈번 | 복잡, 대량 |
| 스키마 | ER 모델 | Star/Snowflake |

### Fact와 Dimension

**Fact Table (사실 테이블)**
- 비즈니스 이벤트의 **측정값(Measure)** 저장
- 예: 매출액, 수량, 금액
- 숫자형 데이터 중심
- 대용량 (수백만~수십억 행)

**Dimension Table (차원 테이블)**
- Fact를 **설명하는 속성** 저장
- 예: 고객, 상품, 날짜, 지역
- 문자형 데이터 중심
- 상대적으로 소용량

### 예시

\`\`\`
fact_sales:
- sale_id
- date_key (FK)
- product_key (FK)
- customer_key (FK)
- quantity (측정값)
- amount (측정값)
\`\`\``,
      keyPoints: [
        'OLTP: 트랜잭션 처리, 정규화',
        'OLAP: 분석/리포팅, 비정규화',
        'Fact: 측정값 (숫자), 대용량',
        'Dimension: 설명 속성 (문자), 소용량'
      ]
    }
  },
  {
    id: 'w4d2-reading-star-snowflake',
    type: 'reading',
    title: 'Star vs Snowflake 스키마',
    duration: 25,
    access: 'core',
    content: {
      markdown: `# Star vs Snowflake 스키마

## Star Schema (별 스키마)

중앙에 Fact 테이블, 주변에 Dimension 테이블이 별 모양으로 연결

\`\`\`
           ┌──────────────┐
           │  dim_date    │
           └──────┬───────┘
                  │
┌──────────┐      │      ┌──────────────┐
│dim_product├─────┼──────┤ dim_customer │
└──────────┘      │      └──────────────┘
                  │
           ┌──────┴───────┐
           │  fact_sales  │
           │  (측정값들)   │
           └──────┬───────┘
                  │
           ┌──────┴───────┐
           │ dim_store    │
           └──────────────┘
\`\`\`

### 특징
- Dimension 테이블이 **비정규화** (중복 허용)
- JOIN이 단순 (Fact ↔ Dimension 직접 연결)
- 쿼리 작성이 쉽고 성능이 좋음
- 저장 공간은 더 사용

\`\`\`sql
-- Star Schema 예시
CREATE TABLE dim_product (
    product_key SERIAL PRIMARY KEY,
    product_id VARCHAR(20),
    product_name VARCHAR(100),
    category VARCHAR(50),      -- 비정규화
    subcategory VARCHAR(50),   -- 비정규화
    brand VARCHAR(50)
);

CREATE TABLE fact_sales (
    sale_key SERIAL PRIMARY KEY,
    date_key INT REFERENCES dim_date(date_key),
    product_key INT REFERENCES dim_product(product_key),
    customer_key INT REFERENCES dim_customer(customer_key),
    quantity INT,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(10,2)
);
\`\`\`

## Snowflake Schema (눈송이 스키마)

Dimension 테이블을 **추가 정규화**하여 계층 구조로 분리

\`\`\`
                    ┌────────────┐
                    │dim_category│
                    └─────┬──────┘
                          │
           ┌──────────────┼──────────────┐
           │              │              │
┌──────────┴───┐   ┌──────┴───────┐   ┌──┴─────────┐
│dim_subcategory│   │  dim_brand   │   │dim_supplier│
└──────┬───────┘   └──────┬───────┘   └──────┬─────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                   ┌──────┴───────┐
                   │ dim_product  │
                   └──────┬───────┘
                          │
                   ┌──────┴───────┐
                   │  fact_sales  │
                   └──────────────┘
\`\`\`

### 특징
- Dimension 테이블이 **정규화**됨
- 저장 공간 절약
- JOIN이 복잡해짐
- 유지보수가 더 어려움

\`\`\`sql
-- Snowflake Schema 예시
CREATE TABLE dim_category (
    category_key SERIAL PRIMARY KEY,
    category_name VARCHAR(50)
);

CREATE TABLE dim_subcategory (
    subcategory_key SERIAL PRIMARY KEY,
    subcategory_name VARCHAR(50),
    category_key INT REFERENCES dim_category(category_key)
);

CREATE TABLE dim_product (
    product_key SERIAL PRIMARY KEY,
    product_name VARCHAR(100),
    subcategory_key INT REFERENCES dim_subcategory(subcategory_key)
);
\`\`\`

## 비교 요약

| 항목 | Star Schema | Snowflake Schema |
|------|-------------|------------------|
| 정규화 | 비정규화 | 정규화 |
| 저장공간 | 더 사용 | 절약 |
| 쿼리 복잡도 | 단순 | 복잡 |
| 성능 | 더 빠름 | 느림 (JOIN 많음) |
| 유지보수 | 쉬움 | 어려움 |
| 추천 상황 | 대부분의 DW | 대규모 차원 |

## 실무 권장

**Star Schema를 기본으로 사용하세요!**

Snowflake는 다음 경우에만 고려:
- 차원 테이블이 매우 클 때
- 저장 공간이 제한적일 때
- 계층 구조가 자주 변경될 때`,
      externalLinks: [
        {
          title: 'Kimball Dimensional Modeling Techniques',
          url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
        },
        {
          title: 'Star Schema vs Snowflake Schema',
          url: 'https://www.guru99.com/star-snowflake-data-warehousing.html'
        }
      ]
    }
  },
  {
    id: 'w4d2-code-star-schema',
    type: 'code',
    title: '실습: Star Schema 설계',
    duration: 35,
    access: 'core',
    content: {
      instructions: `이커머스 데이터를 Star Schema로 설계합니다.

**문제 1**: Dimension 테이블 생성 (날짜, 고객, 상품, 지역)
**문제 2**: Fact 테이블 생성 (주문 사실)
**문제 3**: 분석 쿼리 작성`,
      starterCode: `-- Star Schema 설계: 이커머스 분석
-- 분석 목표: 일별/월별 매출, 고객별 구매 패턴, 카테고리별 성과

-- 문제 1: Dimension 테이블 생성

-- dim_date (날짜 차원)
-- 컬럼: date_key, full_date, year, quarter, month, month_name,
--       day_of_week, day_name, is_weekend, is_holiday


-- dim_customer (고객 차원)
-- 컬럼: customer_key, customer_id, name, email, gender,
--       birth_year, segment, city, country


-- dim_product (상품 차원)
-- 컬럼: product_key, product_id, name, category, subcategory,
--       brand, unit_cost


-- dim_store (매장 차원)
-- 컬럼: store_key, store_id, store_name, store_type, city, country


-- 문제 2: Fact 테이블 생성
-- fact_sales (판매 사실)
-- 컬럼: sale_key, date_key, customer_key, product_key, store_key,
--       quantity, unit_price, discount_amount, total_amount


-- 문제 3: 분석 쿼리
-- Q1: 월별 매출 합계


-- Q2: 카테고리별 Top 5 상품


-- Q3: 고객 세그먼트별 평균 구매 금액


`,
      solutionCode: `-- Star Schema 설계: 이커머스 분석

-- 문제 1: Dimension 테이블 생성

-- dim_date (날짜 차원)
CREATE TABLE dim_date (
    date_key INT PRIMARY KEY,  -- YYYYMMDD 형식
    full_date DATE NOT NULL,
    year INT,
    quarter INT,
    month INT,
    month_name VARCHAR(20),
    day_of_week INT,
    day_name VARCHAR(20),
    is_weekend BOOLEAN,
    is_holiday BOOLEAN
);

-- 날짜 데이터 생성 (2023-2024년)
INSERT INTO dim_date
SELECT
    TO_CHAR(d, 'YYYYMMDD')::INT as date_key,
    d as full_date,
    EXTRACT(YEAR FROM d) as year,
    EXTRACT(QUARTER FROM d) as quarter,
    EXTRACT(MONTH FROM d) as month,
    TO_CHAR(d, 'Month') as month_name,
    EXTRACT(DOW FROM d) as day_of_week,
    TO_CHAR(d, 'Day') as day_name,
    EXTRACT(DOW FROM d) IN (0, 6) as is_weekend,
    FALSE as is_holiday
FROM generate_series('2023-01-01'::DATE, '2024-12-31'::DATE, '1 day') as d;

-- dim_customer (고객 차원)
CREATE TABLE dim_customer (
    customer_key SERIAL PRIMARY KEY,
    customer_id VARCHAR(20) UNIQUE,
    name VARCHAR(100),
    email VARCHAR(100),
    gender VARCHAR(10),
    birth_year INT,
    segment VARCHAR(20),  -- Regular, Premium, VIP
    city VARCHAR(50),
    country VARCHAR(50)
);

INSERT INTO dim_customer (customer_id, name, email, gender, birth_year, segment, city, country) VALUES
('C001', 'Kim Min', 'kim@email.com', 'M', 1990, 'Premium', 'Seoul', 'Korea'),
('C002', 'Lee Su', 'lee@email.com', 'F', 1985, 'VIP', 'Busan', 'Korea'),
('C003', 'Park Ji', 'park@email.com', 'M', 1995, 'Regular', 'Seoul', 'Korea'),
('C004', 'Choi Yu', 'choi@email.com', 'F', 1988, 'Premium', 'Incheon', 'Korea');

-- dim_product (상품 차원)
CREATE TABLE dim_product (
    product_key SERIAL PRIMARY KEY,
    product_id VARCHAR(20) UNIQUE,
    name VARCHAR(100),
    category VARCHAR(50),
    subcategory VARCHAR(50),
    brand VARCHAR(50),
    unit_cost DECIMAL(10,2)
);

INSERT INTO dim_product (product_id, name, category, subcategory, brand, unit_cost) VALUES
('P001', 'Laptop Pro', 'Electronics', 'Computers', 'TechBrand', 800),
('P002', 'Wireless Mouse', 'Electronics', 'Accessories', 'TechBrand', 15),
('P003', 'Running Shoes', 'Fashion', 'Footwear', 'SportMax', 60),
('P004', 'Cotton T-Shirt', 'Fashion', 'Clothing', 'BasicWear', 12),
('P005', 'Coffee Maker', 'Home', 'Kitchen', 'HomePlus', 45);

-- dim_store (매장 차원)
CREATE TABLE dim_store (
    store_key SERIAL PRIMARY KEY,
    store_id VARCHAR(20) UNIQUE,
    store_name VARCHAR(100),
    store_type VARCHAR(20),  -- Online, Offline
    city VARCHAR(50),
    country VARCHAR(50)
);

INSERT INTO dim_store (store_id, store_name, store_type, city, country) VALUES
('S001', 'Online Store', 'Online', 'All', 'Korea'),
('S002', 'Seoul Flagship', 'Offline', 'Seoul', 'Korea'),
('S003', 'Busan Branch', 'Offline', 'Busan', 'Korea');


-- 문제 2: Fact 테이블 생성
CREATE TABLE fact_sales (
    sale_key SERIAL PRIMARY KEY,
    date_key INT REFERENCES dim_date(date_key),
    customer_key INT REFERENCES dim_customer(customer_key),
    product_key INT REFERENCES dim_product(product_key),
    store_key INT REFERENCES dim_store(store_key),
    quantity INT,
    unit_price DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2)
);

-- Fact 데이터 생성
INSERT INTO fact_sales (date_key, customer_key, product_key, store_key, quantity, unit_price, discount_amount, total_amount) VALUES
(20240101, 1, 1, 1, 1, 1200.00, 100.00, 1100.00),
(20240101, 2, 3, 2, 2, 120.00, 0.00, 240.00),
(20240102, 1, 2, 1, 3, 30.00, 5.00, 85.00),
(20240102, 3, 4, 3, 5, 25.00, 0.00, 125.00),
(20240103, 2, 5, 1, 1, 80.00, 10.00, 70.00),
(20240103, 4, 1, 2, 1, 1200.00, 200.00, 1000.00),
(20240115, 1, 3, 1, 1, 120.00, 0.00, 120.00),
(20240115, 3, 2, 1, 2, 30.00, 0.00, 60.00),
(20240120, 2, 4, 2, 3, 25.00, 5.00, 70.00),
(20240125, 4, 5, 3, 2, 80.00, 0.00, 160.00);


-- 문제 3: 분석 쿼리

-- Q1: 월별 매출 합계
SELECT
    d.year,
    d.month,
    d.month_name,
    COUNT(*) as order_count,
    SUM(f.quantity) as total_quantity,
    SUM(f.total_amount) as total_revenue
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
GROUP BY d.year, d.month, d.month_name
ORDER BY d.year, d.month;

/*
| year | month | month_name | order_count | total_quantity | total_revenue |
|------|-------|------------|-------------|----------------|---------------|
| 2024 | 1     | January    | 10          | 21             | 3030.00       |
*/


-- Q2: 카테고리별 Top 3 상품
WITH product_sales AS (
    SELECT
        p.category,
        p.name as product_name,
        SUM(f.total_amount) as revenue,
        RANK() OVER (PARTITION BY p.category ORDER BY SUM(f.total_amount) DESC) as rn
    FROM fact_sales f
    JOIN dim_product p ON f.product_key = p.product_key
    GROUP BY p.category, p.name
)
SELECT category, product_name, revenue
FROM product_sales
WHERE rn <= 3
ORDER BY category, rn;

/*
| category    | product_name   | revenue |
|-------------|----------------|---------|
| Electronics | Laptop Pro     | 2100.00 |
| Electronics | Wireless Mouse | 145.00  |
| Fashion     | Running Shoes  | 360.00  |
| Fashion     | Cotton T-Shirt | 195.00  |
| Home        | Coffee Maker   | 230.00  |
*/


-- Q3: 고객 세그먼트별 평균 구매 금액
SELECT
    c.segment,
    COUNT(DISTINCT c.customer_key) as customer_count,
    COUNT(*) as order_count,
    ROUND(AVG(f.total_amount), 2) as avg_order_amount,
    SUM(f.total_amount) as total_revenue
FROM fact_sales f
JOIN dim_customer c ON f.customer_key = c.customer_key
GROUP BY c.segment
ORDER BY total_revenue DESC;

/*
| segment | customer_count | order_count | avg_order_amount | total_revenue |
|---------|----------------|-------------|------------------|---------------|
| VIP     | 1              | 3           | 126.67           | 380.00        |
| Premium | 2              | 5           | 487.00           | 2435.00       |
| Regular | 1              | 2           | 92.50            | 185.00        |
*/`,
      hints: [
        'date_key는 YYYYMMDD 형식의 INT로 저장 (인덱스 효율)',
        'generate_series로 날짜 데이터 자동 생성',
        'Fact 테이블은 FK로 모든 Dimension과 연결',
        'RANK() OVER로 카테고리 내 순위 계산'
      ]
    }
  },
  {
    id: 'w4d2-code-snowflake-schema',
    type: 'code',
    title: '실습: Snowflake Schema 설계',
    duration: 30,
    access: 'core',
    content: {
      instructions: `Star Schema를 Snowflake Schema로 변환합니다.

**문제 1**: dim_product를 정규화 (category, brand 분리)
**문제 2**: 정규화된 스키마에서 동일한 분석 쿼리 작성
**문제 3**: Star vs Snowflake 쿼리 복잡도 비교`,
      starterCode: `-- Snowflake Schema로 변환

-- 문제 1: dim_product 정규화
-- dim_category, dim_subcategory, dim_brand 테이블 생성
-- dim_product는 FK로 연결


-- dim_category


-- dim_subcategory


-- dim_brand


-- dim_product_normalized


-- 문제 2: Snowflake Schema에서 "카테고리별 매출" 쿼리
-- (Star Schema보다 JOIN이 많아짐)


-- 문제 3: 복잡도 비교
-- Star Schema 쿼리와 Snowflake Schema 쿼리의 차이점 주석으로 설명

`,
      solutionCode: `-- Snowflake Schema 설계

-- 문제 1: dim_product 정규화

-- dim_category
CREATE TABLE dim_category (
    category_key SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE
);

INSERT INTO dim_category (category_name) VALUES
('Electronics'), ('Fashion'), ('Home');

-- dim_subcategory (category에 종속)
CREATE TABLE dim_subcategory (
    subcategory_key SERIAL PRIMARY KEY,
    subcategory_name VARCHAR(50),
    category_key INT REFERENCES dim_category(category_key),
    UNIQUE (subcategory_name, category_key)
);

INSERT INTO dim_subcategory (subcategory_name, category_key) VALUES
('Computers', 1), ('Accessories', 1),
('Footwear', 2), ('Clothing', 2),
('Kitchen', 3);

-- dim_brand
CREATE TABLE dim_brand (
    brand_key SERIAL PRIMARY KEY,
    brand_name VARCHAR(50) UNIQUE
);

INSERT INTO dim_brand (brand_name) VALUES
('TechBrand'), ('SportMax'), ('BasicWear'), ('HomePlus');

-- dim_product_normalized
CREATE TABLE dim_product_normalized (
    product_key SERIAL PRIMARY KEY,
    product_id VARCHAR(20) UNIQUE,
    name VARCHAR(100),
    subcategory_key INT REFERENCES dim_subcategory(subcategory_key),
    brand_key INT REFERENCES dim_brand(brand_key),
    unit_cost DECIMAL(10,2)
);

INSERT INTO dim_product_normalized (product_id, name, subcategory_key, brand_key, unit_cost) VALUES
('P001', 'Laptop Pro', 1, 1, 800),
('P002', 'Wireless Mouse', 2, 1, 15),
('P003', 'Running Shoes', 3, 2, 60),
('P004', 'Cotton T-Shirt', 4, 3, 12),
('P005', 'Coffee Maker', 5, 4, 45);


-- 문제 2: Snowflake Schema에서 "카테고리별 매출" 쿼리
-- (3개 테이블 JOIN 필요: fact → product → subcategory → category)

SELECT
    cat.category_name,
    COUNT(*) as order_count,
    SUM(f.total_amount) as total_revenue
FROM fact_sales f
JOIN dim_product_normalized p ON f.product_key = p.product_key
JOIN dim_subcategory sub ON p.subcategory_key = sub.subcategory_key
JOIN dim_category cat ON sub.category_key = cat.category_key
GROUP BY cat.category_name
ORDER BY total_revenue DESC;

/*
| category_name | order_count | total_revenue |
|---------------|-------------|---------------|
| Electronics   | 5           | 2245.00       |
| Fashion       | 4           | 555.00        |
| Home          | 2           | 230.00        |
*/


-- 서브카테고리별 상세 분석
SELECT
    cat.category_name,
    sub.subcategory_name,
    b.brand_name,
    p.name as product_name,
    SUM(f.quantity) as total_qty,
    SUM(f.total_amount) as total_revenue
FROM fact_sales f
JOIN dim_product_normalized p ON f.product_key = p.product_key
JOIN dim_subcategory sub ON p.subcategory_key = sub.subcategory_key
JOIN dim_category cat ON sub.category_key = cat.category_key
JOIN dim_brand b ON p.brand_key = b.brand_key
GROUP BY cat.category_name, sub.subcategory_name, b.brand_name, p.name
ORDER BY cat.category_name, total_revenue DESC;


-- 문제 3: 복잡도 비교

/*
=== Star Schema (비정규화) ===

SELECT p.category, SUM(f.total_amount)
FROM fact_sales f
JOIN dim_product p ON f.product_key = p.product_key
GROUP BY p.category;

- JOIN: 1개 (fact ↔ product)
- 쿼리 단순, 성능 좋음
- 저장공간: category 중복 저장


=== Snowflake Schema (정규화) ===

SELECT cat.category_name, SUM(f.total_amount)
FROM fact_sales f
JOIN dim_product_normalized p ON f.product_key = p.product_key
JOIN dim_subcategory sub ON p.subcategory_key = sub.subcategory_key
JOIN dim_category cat ON sub.category_key = cat.category_key
GROUP BY cat.category_name;

- JOIN: 3개 (fact → product → subcategory → category)
- 쿼리 복잡, 성능 낮음
- 저장공간: 중복 없음


=== 실무 권장 ===

1. 기본적으로 Star Schema 사용
2. Snowflake는 다음 경우에만:
   - 차원 계층이 자주 변경될 때
   - 차원 테이블이 매우 클 때 (수백만 행)
   - 저장 공간이 매우 제한적일 때

3. 절충안: Partially Snowflake
   - 자주 변경되는 차원만 정규화
   - 나머지는 비정규화 유지
*/`,
      hints: [
        'Snowflake: category → subcategory → product 계층',
        'JOIN 개수가 증가하면 성능 저하',
        '실무에서는 Star Schema가 대부분 권장됨',
        'Partially Snowflake도 고려'
      ]
    }
  },
  {
    id: 'w4d2-quiz-dimensional',
    type: 'quiz',
    title: '퀴즈: 차원 모델링',
    duration: 15,
    access: 'core',
    content: {
      questions: [
        {
          question: 'Fact 테이블의 특징이 아닌 것은?',
          options: [
            '측정값(Measure)을 저장',
            '대용량 데이터',
            '문자형 데이터 중심',
            'Dimension 테이블과 FK로 연결'
          ],
          answer: 2,
          explanation: 'Fact 테이블은 숫자형 측정값(매출, 수량 등) 중심입니다. 문자형 데이터는 Dimension에 저장합니다.'
        },
        {
          question: 'Star Schema의 장점이 아닌 것은?',
          options: [
            'JOIN이 단순함',
            '쿼리 성능이 좋음',
            '저장 공간 효율적',
            '쿼리 작성이 쉬움'
          ],
          answer: 2,
          explanation: 'Star Schema는 Dimension이 비정규화되어 저장 공간을 더 사용합니다. 장점은 단순한 JOIN, 좋은 성능, 쉬운 쿼리입니다.'
        },
        {
          question: 'Snowflake Schema를 선택해야 하는 경우는?',
          options: [
            '쿼리 성능이 중요할 때',
            '쿼리를 단순하게 유지하고 싶을 때',
            '차원 테이블이 매우 크고 저장 공간이 제한적일 때',
            '대부분의 일반적인 데이터 웨어하우스'
          ],
          answer: 2,
          explanation: 'Snowflake Schema는 저장 공간 절약이 필요하거나 차원 계층이 자주 변경될 때 적합합니다.'
        },
        {
          question: 'dim_date 테이블에 포함하면 유용한 컬럼이 아닌 것은?',
          options: [
            'is_weekend',
            'quarter',
            'customer_id',
            'month_name'
          ],
          answer: 2,
          explanation: 'dim_date는 날짜 관련 속성만 포함합니다. customer_id는 dim_customer에 포함됩니다.'
        },
        {
          question: '다음 중 Measure(측정값)에 해당하는 것은?',
          options: [
            'customer_name',
            'product_category',
            'total_amount',
            'store_location'
          ],
          answer: 2,
          explanation: 'Measure는 숫자형 측정값입니다. total_amount(매출액)가 이에 해당합니다.'
        }
      ]
    }
  },
  {
    id: 'w4d2-challenge-dw-design',
    type: 'challenge',
    title: '챌린지: 데이터 웨어하우스 설계',
    duration: 40,
    access: 'core',
    content: {
      instructions: `주어진 비즈니스 요구사항을 기반으로 Star Schema를 설계하세요.

**시나리오**: 온라인 교육 플랫폼 분석

**분석 요구사항**:
- 강좌별 수강 완료율
- 강사별 평점 추이
- 월별/분기별 매출
- 카테고리별 인기 강좌
- 학생 코호트 분석

**소스 데이터**:
- 학생 정보
- 강좌 정보 (강사, 카테고리, 가격)
- 수강 등록 (등록일, 완료일, 진도율)
- 리뷰 (평점, 댓글)`,
      starterCode: `-- 온라인 교육 플랫폼 Star Schema 설계

-- Dimension 테이블 설계
-- dim_date (날짜 차원)


-- dim_student (학생 차원)


-- dim_course (강좌 차원 - 비정규화, 강사/카테고리 포함)


-- Fact 테이블 설계
-- fact_enrollment (수강 등록 사실)
-- 측정값: progress_rate, completion_flag, rating


-- 샘플 데이터 삽입


-- 분석 쿼리 작성
-- Q1: 카테고리별 수강 완료율


-- Q2: 월별 매출 추이


-- Q3: 강사별 평균 평점 Top 5

`,
      requirements: [
        'Dimension 테이블 3개 이상 설계',
        'Fact 테이블 1개 이상 설계',
        '적절한 Measure 정의',
        '분석 쿼리 3개 이상',
        '데이터 무결성 (FK 관계)'
      ],
      evaluationCriteria: [
        'Star Schema 구조 적절성',
        'Measure/Dimension 구분 정확',
        '분석 요구사항 충족',
        'SQL 문법 정확성',
        '쿼리 효율성'
      ],
      hints: [
        'completion_flag: 진도율 100%이면 1, 아니면 0',
        'fact_enrollment에 course_price를 비정규화로 포함 가능',
        '코호트 분석: dim_date의 등록월 기준',
        '강사 정보는 dim_course에 비정규화'
      ]
    }
  }
]
