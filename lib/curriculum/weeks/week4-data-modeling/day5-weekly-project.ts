// Day 5: Weekly Project - 이커머스 DW 설계
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'w4d5t1',
    title: '프로젝트 개요: 이커머스 데이터 웨어하우스',
    type: 'video',
    duration: 15,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=ecommerce-dw-intro',
      transcript: `
# 이커머스 데이터 웨어하우스 설계 프로젝트

안녕하세요! 이번 주 마지막 날은 주간 프로젝트입니다.
지금까지 배운 모든 내용을 통합하여 이커머스 데이터 웨어하우스를 설계합니다.

## 프로젝트 목표

1. **OLTP → OLAP 변환**: 운영 DB에서 분석용 DW로 변환
2. **Star Schema 설계**: Fact와 Dimension 테이블 구성
3. **SCD 적용**: 고객, 상품 차원에 이력 관리
4. **ERD 문서화**: 설계 결과를 ERD로 표현

## 비즈니스 시나리오

"ShopMall"이라는 온라인 쇼핑몰을 운영합니다.

### 비즈니스 질문 (DW로 답해야 할 질문들)

1. **매출 분석**
   - 월별/분기별 매출 추이는?
   - 카테고리별 매출 비중은?
   - 가장 많이 팔린 상품 Top 10은?

2. **고객 분석**
   - 신규 고객 vs 재구매 고객 비율은?
   - 고객 등급별 평균 구매액은?
   - 지역별 고객 분포는?

3. **상품 분석**
   - 재고 회전율이 높은 상품은?
   - 마진율이 높은 카테고리는?
   - 가격 변동이 매출에 미친 영향은?

4. **시간 분석**
   - 요일/시간대별 주문 패턴은?
   - 프로모션 기간의 효과는?
   - 시즌별 트렌드는?

## 설계 방법론

### 1단계: 비즈니스 프로세스 식별
→ 주문(Order) 프로세스가 핵심

### 2단계: Grain 결정
→ 주문 상세(Order Item) 레벨

### 3단계: Dimension 식별
→ 날짜, 고객, 상품, 카테고리, 지역, 프로모션

### 4단계: Fact 정의
→ 주문금액, 수량, 할인액, 마진

## 데이터 소스 (OLTP)

\`\`\`
[운영 DB - 정규화된 구조]
├── customers (고객)
├── addresses (주소)
├── products (상품)
├── categories (카테고리)
├── orders (주문)
├── order_items (주문상세)
├── payments (결제)
└── promotions (프로모션)
\`\`\`

## 타겟 구조 (OLAP)

\`\`\`
[데이터 웨어하우스 - Star Schema]
├── dim_date (날짜 차원)
├── dim_customer (고객 차원) ← SCD Type 2
├── dim_product (상품 차원) ← SCD Type 2
├── dim_category (카테고리 차원)
├── dim_geography (지역 차원)
├── dim_promotion (프로모션 차원)
└── fact_sales (매출 팩트)
\`\`\`

이제 하나씩 설계해봅시다!
      `,
      objectives: [
        '이커머스 DW의 비즈니스 요구사항을 이해한다',
        'OLTP → OLAP 변환 방법론을 이해한다',
        'Star Schema 구성 요소를 식별할 수 있다'
      ],
      keyPoints: [
        '비즈니스 질문이 DW 설계를 주도',
        'Grain 결정이 가장 중요한 결정',
        'Dimension에 SCD 적용 필요',
        'OLTP와 OLAP은 목적이 다르므로 구조도 달라야 함'
      ]
    }
  },
  {
    id: 'w4d5t2',
    title: 'Dimension 테이블 설계',
    type: 'code',
    duration: 35,
    content: {
      instructions: `
# Dimension 테이블 설계

Star Schema의 Dimension 테이블들을 설계합니다.

## 설계할 Dimension

1. **dim_date**: 날짜 차원 (미리 생성)
2. **dim_customer**: 고객 차원 (SCD Type 2)
3. **dim_product**: 상품 차원 (SCD Type 2)
4. **dim_category**: 카테고리 차원 (계층 포함)
5. **dim_geography**: 지역 차원 (도시/구/동)
6. **dim_promotion**: 프로모션 차원

## 과제

각 Dimension 테이블의 DDL을 완성하세요.
- Surrogate Key (대리키) 사용
- SCD Type 2 컬럼 추가 (valid_from, valid_to, is_current)
- 분석에 필요한 속성 포함
      `,
      starterCode: `-- =====================================================
-- 이커머스 데이터 웨어하우스: Dimension 테이블
-- =====================================================

-- 1. 날짜 차원 (Date Dimension)
-- 미리 생성하는 테이블 (3-5년치)
CREATE TABLE dim_date (
    date_key INT PRIMARY KEY,           -- YYYYMMDD 형식
    full_date DATE NOT NULL UNIQUE,
    day_of_week INT NOT NULL,           -- 1-7
    day_name VARCHAR(10) NOT NULL,      -- Monday, Tuesday...
    day_of_month INT NOT NULL,          -- 1-31
    day_of_year INT NOT NULL,           -- 1-366
    week_of_year INT NOT NULL,          -- 1-53
    month_num INT NOT NULL,             -- 1-12
    month_name VARCHAR(10) NOT NULL,    -- January, February...
    quarter INT NOT NULL,               -- 1-4
    year INT NOT NULL,
    is_weekend BOOLEAN NOT NULL,
    is_holiday BOOLEAN DEFAULT FALSE,
    holiday_name VARCHAR(50)
);

-- 날짜 데이터 생성 함수 (PostgreSQL)
CREATE OR REPLACE FUNCTION generate_date_dimension(start_date DATE, end_date DATE)
RETURNS VOID AS $$
DECLARE
    current_date_val DATE := start_date;
BEGIN
    WHILE current_date_val <= end_date LOOP
        INSERT INTO dim_date (
            date_key, full_date, day_of_week, day_name,
            day_of_month, day_of_year, week_of_year,
            month_num, month_name, quarter, year, is_weekend
        ) VALUES (
            TO_CHAR(current_date_val, 'YYYYMMDD')::INT,
            current_date_val,
            EXTRACT(DOW FROM current_date_val) + 1,
            TO_CHAR(current_date_val, 'Day'),
            EXTRACT(DAY FROM current_date_val),
            EXTRACT(DOY FROM current_date_val),
            EXTRACT(WEEK FROM current_date_val),
            EXTRACT(MONTH FROM current_date_val),
            TO_CHAR(current_date_val, 'Month'),
            EXTRACT(QUARTER FROM current_date_val),
            EXTRACT(YEAR FROM current_date_val),
            EXTRACT(DOW FROM current_date_val) IN (0, 6)
        );
        current_date_val := current_date_val + INTERVAL '1 day';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 2020-2025년 날짜 생성
SELECT generate_date_dimension('2020-01-01', '2025-12-31');


-- 2. 고객 차원 (Customer Dimension) - SCD Type 2
CREATE TABLE dim_customer (
    customer_sk SERIAL PRIMARY KEY,     -- Surrogate Key
    customer_id INT NOT NULL,           -- Natural Key (OLTP의 PK)

    -- 고객 속성
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    gender VARCHAR(10),
    birth_date DATE,
    age_group VARCHAR(20),              -- '20대', '30대' 등

    -- 고객 등급 (변경될 수 있음 → SCD 대상)
    customer_grade VARCHAR(20),         -- 'Bronze', 'Silver', 'Gold', 'VIP'
    total_purchases DECIMAL(15,2),
    first_purchase_date DATE,
    last_purchase_date DATE,

    -- TODO: SCD Type 2 컬럼 추가
    -- valid_from, valid_to, is_current

    -- 메타데이터
    source_system VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 3. 상품 차원 (Product Dimension) - SCD Type 2
CREATE TABLE dim_product (
    product_sk SERIAL PRIMARY KEY,
    product_id INT NOT NULL,            -- Natural Key

    -- 상품 속성
    product_name VARCHAR(200) NOT NULL,
    product_code VARCHAR(50),
    brand VARCHAR(100),
    description TEXT,

    -- 가격 (변경될 수 있음 → SCD 대상)
    unit_price DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2),            -- 원가

    -- 카테고리 (비정규화)
    category_id INT,
    category_name VARCHAR(100),
    subcategory_name VARCHAR(100),

    -- 상태
    status VARCHAR(20) DEFAULT 'active',  -- 'active', 'discontinued'

    -- TODO: SCD Type 2 컬럼 추가

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 4. 카테고리 차원 (Category Dimension) - 계층 포함
CREATE TABLE dim_category (
    category_sk SERIAL PRIMARY KEY,
    category_id INT NOT NULL,

    -- 카테고리 계층
    category_name VARCHAR(100) NOT NULL,       -- Leaf 카테고리
    -- TODO: 상위 계층 컬럼 추가
    -- subcategory_name (중분류)
    -- main_category_name (대분류)
    -- category_path (전체 경로: '전자제품 > 컴퓨터 > 노트북')

    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 5. 지역 차원 (Geography Dimension)
CREATE TABLE dim_geography (
    geography_sk SERIAL PRIMARY KEY,

    -- TODO: 지역 계층 설계
    -- city (시/도)
    -- district (구/군)
    -- neighborhood (동/읍/면)
    -- postal_code (우편번호)
    -- country (국가)

    is_current BOOLEAN DEFAULT TRUE
);


-- 6. 프로모션 차원 (Promotion Dimension)
CREATE TABLE dim_promotion (
    promotion_sk SERIAL PRIMARY KEY,
    promotion_id INT,

    -- TODO: 프로모션 속성 설계
    -- promotion_name
    -- promotion_type ('할인', '쿠폰', '적립', '무료배송')
    -- discount_rate (할인율)
    -- start_date
    -- end_date
    -- min_purchase_amount (최소 구매금액)

    is_current BOOLEAN DEFAULT TRUE
);


-- 인덱스 생성
-- TODO: 필요한 인덱스 추가`,
      solutionCode: `-- =====================================================
-- 이커머스 데이터 웨어하우스: Dimension 테이블 (완성)
-- =====================================================

-- 1. 날짜 차원 (Date Dimension)
CREATE TABLE dim_date (
    date_key INT PRIMARY KEY,
    full_date DATE NOT NULL UNIQUE,
    day_of_week INT NOT NULL,
    day_name VARCHAR(10) NOT NULL,
    day_of_month INT NOT NULL,
    day_of_year INT NOT NULL,
    week_of_year INT NOT NULL,
    month_num INT NOT NULL,
    month_name VARCHAR(10) NOT NULL,
    quarter INT NOT NULL,
    year INT NOT NULL,
    is_weekend BOOLEAN NOT NULL,
    is_holiday BOOLEAN DEFAULT FALSE,
    holiday_name VARCHAR(50),

    -- 분석용 추가 컬럼
    fiscal_year INT,
    fiscal_quarter INT,
    week_start_date DATE,
    month_start_date DATE,
    year_month VARCHAR(7)  -- '2024-01'
);

CREATE INDEX idx_dim_date_year_month ON dim_date(year, month_num);


-- 2. 고객 차원 (Customer Dimension) - SCD Type 2
CREATE TABLE dim_customer (
    customer_sk SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,

    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    gender VARCHAR(10),
    birth_date DATE,
    age_group VARCHAR(20),

    customer_grade VARCHAR(20),
    total_purchases DECIMAL(15,2),
    first_purchase_date DATE,
    last_purchase_date DATE,

    -- SCD Type 2 컬럼
    valid_from TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_to TIMESTAMP NOT NULL DEFAULT '9999-12-31 23:59:59',
    is_current BOOLEAN NOT NULL DEFAULT TRUE,

    source_system VARCHAR(50) DEFAULT 'OLTP',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dim_customer_id ON dim_customer(customer_id);
CREATE INDEX idx_dim_customer_current ON dim_customer(customer_id, is_current);
CREATE INDEX idx_dim_customer_grade ON dim_customer(customer_grade) WHERE is_current = TRUE;


-- 3. 상품 차원 (Product Dimension) - SCD Type 2
CREATE TABLE dim_product (
    product_sk SERIAL PRIMARY KEY,
    product_id INT NOT NULL,

    product_name VARCHAR(200) NOT NULL,
    product_code VARCHAR(50),
    brand VARCHAR(100),
    description TEXT,

    unit_price DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2),
    margin_amount DECIMAL(10,2) GENERATED ALWAYS AS (unit_price - unit_cost) STORED,
    margin_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN unit_price > 0 THEN ((unit_price - unit_cost) / unit_price * 100) ELSE 0 END
    ) STORED,

    category_id INT,
    category_name VARCHAR(100),
    subcategory_name VARCHAR(100),
    main_category_name VARCHAR(100),

    status VARCHAR(20) DEFAULT 'active',

    -- SCD Type 2 컬럼
    valid_from TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_to TIMESTAMP NOT NULL DEFAULT '9999-12-31 23:59:59',
    is_current BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dim_product_id ON dim_product(product_id);
CREATE INDEX idx_dim_product_current ON dim_product(product_id, is_current);
CREATE INDEX idx_dim_product_category ON dim_product(category_id) WHERE is_current = TRUE;
CREATE INDEX idx_dim_product_brand ON dim_product(brand) WHERE is_current = TRUE;


-- 4. 카테고리 차원 (Category Dimension) - 계층 포함
CREATE TABLE dim_category (
    category_sk SERIAL PRIMARY KEY,
    category_id INT NOT NULL,

    -- 카테고리 계층 (Flattened)
    category_name VARCHAR(100) NOT NULL,
    subcategory_name VARCHAR(100),
    main_category_name VARCHAR(100) NOT NULL,
    category_path VARCHAR(300),  -- '전자제품 > 컴퓨터 > 노트북'
    category_level INT,          -- 1, 2, 3

    -- 분류 속성
    is_seasonal BOOLEAN DEFAULT FALSE,
    typical_margin_rate DECIMAL(5,2),

    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dim_category_main ON dim_category(main_category_name);
CREATE INDEX idx_dim_category_level ON dim_category(category_level);


-- 5. 지역 차원 (Geography Dimension) - 계층 포함
CREATE TABLE dim_geography (
    geography_sk SERIAL PRIMARY KEY,
    geography_id INT,

    -- 지역 계층 (한국 기준)
    country VARCHAR(50) NOT NULL DEFAULT '대한민국',
    region VARCHAR(50),           -- '수도권', '영남', '호남' 등
    city VARCHAR(50) NOT NULL,    -- 시/도
    district VARCHAR(50),         -- 구/군
    neighborhood VARCHAR(50),     -- 동/읍/면
    postal_code VARCHAR(10),

    -- 분석용 추가 속성
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    population INT,
    avg_income_level VARCHAR(20),  -- 'Low', 'Medium', 'High'

    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dim_geography_city ON dim_geography(city);
CREATE INDEX idx_dim_geography_postal ON dim_geography(postal_code);


-- 6. 프로모션 차원 (Promotion Dimension)
CREATE TABLE dim_promotion (
    promotion_sk SERIAL PRIMARY KEY,
    promotion_id INT,

    promotion_name VARCHAR(200) NOT NULL,
    promotion_type VARCHAR(50) NOT NULL,  -- '할인', '쿠폰', '적립', '무료배송', '번들'
    discount_type VARCHAR(20),            -- 'percent', 'fixed_amount'
    discount_value DECIMAL(10,2),         -- 할인율(%) 또는 할인금액

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    min_purchase_amount DECIMAL(10,2),
    max_discount_amount DECIMAL(10,2),

    -- 적용 조건
    applicable_category VARCHAR(100),
    applicable_customer_grade VARCHAR(50),
    is_combinable BOOLEAN DEFAULT FALSE,  -- 다른 프로모션과 중복 적용 가능

    -- 상태
    status VARCHAR(20) DEFAULT 'active',

    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dim_promotion_type ON dim_promotion(promotion_type);
CREATE INDEX idx_dim_promotion_dates ON dim_promotion(start_date, end_date);


-- 7. Unknown 레코드 삽입 (FK 무결성 보장)
-- Fact에서 매칭되지 않는 경우 Unknown 레코드 참조

INSERT INTO dim_customer (customer_sk, customer_id, customer_name, customer_grade, is_current)
VALUES (0, 0, 'Unknown', 'Unknown', TRUE);

INSERT INTO dim_product (product_sk, product_id, product_name, unit_price, is_current)
VALUES (0, 0, 'Unknown', 0, TRUE);

INSERT INTO dim_category (category_sk, category_id, category_name, main_category_name, is_current)
VALUES (0, 0, 'Unknown', 'Unknown', TRUE);

INSERT INTO dim_geography (geography_sk, geography_id, city, is_current)
VALUES (0, 0, 'Unknown', TRUE);

INSERT INTO dim_promotion (promotion_sk, promotion_id, promotion_name, promotion_type, start_date, end_date, is_current)
VALUES (0, 0, 'No Promotion', 'None', '1900-01-01', '9999-12-31', TRUE);`,
      hints: [
        'Surrogate Key는 SERIAL (자동 증가)로 생성',
        'SCD Type 2는 valid_from, valid_to, is_current 3개 컬럼 필요',
        'Unknown 레코드(sk=0)로 FK 무결성 보장',
        '카테고리 계층은 Flattened (펼쳐진) 형태로 저장'
      ]
    }
  },
  {
    id: 'w4d5t3',
    title: 'Fact 테이블 설계',
    type: 'code',
    duration: 30,
    content: {
      instructions: `
# Fact 테이블 설계

Star Schema의 핵심인 Fact 테이블을 설계합니다.

## Fact 테이블 설계 원칙

1. **Grain 결정**: 가장 낮은 레벨로 설정 (주문 상세)
2. **Measure 정의**: 합계, 평균, 개수 가능한 숫자
3. **FK로 Dimension 연결**: 모든 분석 축은 Dimension을 통해
4. **Degenerate Dimension**: Dimension 테이블 없이 Fact에 직접 저장

## 설계할 Fact 테이블

**fact_sales**: 매출 팩트 테이블
- Grain: 주문 상세 (Order Item) 레벨
- Measures: 수량, 금액, 할인, 마진
- FKs: 날짜, 고객, 상품, 프로모션, 지역
      `,
      starterCode: `-- =====================================================
-- 이커머스 데이터 웨어하우스: Fact 테이블
-- =====================================================

-- 매출 팩트 테이블 (Sales Fact)
-- Grain: 주문 상세 (Order Item) 레벨
CREATE TABLE fact_sales (
    -- Surrogate Key
    sales_sk BIGSERIAL PRIMARY KEY,

    -- Degenerate Dimensions (Dimension 테이블 없이 Fact에 직접)
    order_id INT NOT NULL,              -- 주문 번호
    order_item_id INT NOT NULL,         -- 주문 상세 번호
    order_status VARCHAR(20),           -- 'pending', 'paid', 'shipped', 'delivered', 'cancelled'

    -- Foreign Keys (Dimension 연결)
    date_key INT NOT NULL,              -- dim_date
    -- TODO: 나머지 FK 추가
    -- customer_sk (dim_customer)
    -- product_sk (dim_product)
    -- geography_sk (dim_geography)
    -- promotion_sk (dim_promotion)

    -- Measures (분석 지표)
    quantity INT NOT NULL,                      -- 주문 수량
    unit_price DECIMAL(10,2) NOT NULL,          -- 단가
    -- TODO: 나머지 Measures 추가
    -- gross_amount: 총액 (quantity * unit_price)
    -- discount_amount: 할인 금액
    -- net_amount: 순매출 (gross_amount - discount_amount)
    -- unit_cost: 단위 원가
    -- total_cost: 총 원가
    -- profit_amount: 이익 (net_amount - total_cost)

    -- 메타데이터
    etl_loaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_system VARCHAR(50) DEFAULT 'OLTP'
);

-- TODO: 인덱스 및 제약조건 추가


-- Fact 테이블 통계 뷰
-- 설계 검증용
CREATE VIEW fact_sales_stats AS
SELECT
    COUNT(*) AS total_rows,
    COUNT(DISTINCT order_id) AS unique_orders,
    COUNT(DISTINCT customer_sk) AS unique_customers,
    COUNT(DISTINCT product_sk) AS unique_products,
    MIN(date_key) AS min_date,
    MAX(date_key) AS max_date,
    SUM(gross_amount) AS total_gross,
    SUM(net_amount) AS total_net,
    SUM(profit_amount) AS total_profit
FROM fact_sales;


-- 샘플 분석 쿼리
-- TODO: 아래 쿼리들이 작동하도록 Fact 설계 완성

-- 1. 월별 매출 추이
-- SELECT
--     d.year,
--     d.month_name,
--     SUM(f.net_amount) AS monthly_sales,
--     SUM(f.profit_amount) AS monthly_profit
-- FROM fact_sales f
-- JOIN dim_date d ON f.date_key = d.date_key
-- GROUP BY d.year, d.month_num, d.month_name
-- ORDER BY d.year, d.month_num;

-- 2. 고객 등급별 평균 구매액
-- SELECT
--     c.customer_grade,
--     COUNT(DISTINCT f.order_id) AS order_count,
--     AVG(f.net_amount) AS avg_order_amount
-- FROM fact_sales f
-- JOIN dim_customer c ON f.customer_sk = c.customer_sk
-- WHERE c.is_current = TRUE
-- GROUP BY c.customer_grade;

-- 3. 카테고리별 마진율
-- SELECT
--     p.main_category_name,
--     SUM(f.net_amount) AS total_sales,
--     SUM(f.profit_amount) AS total_profit,
--     ROUND(SUM(f.profit_amount) / NULLIF(SUM(f.net_amount), 0) * 100, 2) AS margin_rate
-- FROM fact_sales f
-- JOIN dim_product p ON f.product_sk = p.product_sk
-- WHERE p.is_current = TRUE
-- GROUP BY p.main_category_name
-- ORDER BY margin_rate DESC;`,
      solutionCode: `-- =====================================================
-- 이커머스 데이터 웨어하우스: Fact 테이블 (완성)
-- =====================================================

-- 매출 팩트 테이블 (Sales Fact)
CREATE TABLE fact_sales (
    -- Surrogate Key
    sales_sk BIGSERIAL PRIMARY KEY,

    -- Degenerate Dimensions
    order_id INT NOT NULL,
    order_item_id INT NOT NULL,
    order_status VARCHAR(20),
    payment_method VARCHAR(50),

    -- Foreign Keys
    date_key INT NOT NULL REFERENCES dim_date(date_key),
    order_time TIME,  -- 시간 정보 (날짜와 분리)
    customer_sk INT NOT NULL DEFAULT 0 REFERENCES dim_customer(customer_sk),
    product_sk INT NOT NULL DEFAULT 0 REFERENCES dim_product(product_sk),
    geography_sk INT NOT NULL DEFAULT 0 REFERENCES dim_geography(geography_sk),
    promotion_sk INT NOT NULL DEFAULT 0 REFERENCES dim_promotion(promotion_sk),

    -- Measures
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    gross_amount DECIMAL(12,2) NOT NULL,       -- quantity * unit_price
    discount_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(12,2) NOT NULL,         -- gross_amount - discount_amount
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(12,2),                  -- quantity * unit_cost
    profit_amount DECIMAL(12,2),               -- net_amount - total_cost

    -- 추가 Measures
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,

    -- 메타데이터
    etl_batch_id INT,
    etl_loaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_system VARCHAR(50) DEFAULT 'OLTP',

    -- 중복 방지 (같은 주문상세 두 번 적재 방지)
    UNIQUE (order_id, order_item_id)
);

-- 인덱스 (분석 쿼리 최적화)
CREATE INDEX idx_fact_sales_date ON fact_sales(date_key);
CREATE INDEX idx_fact_sales_customer ON fact_sales(customer_sk);
CREATE INDEX idx_fact_sales_product ON fact_sales(product_sk);
CREATE INDEX idx_fact_sales_order ON fact_sales(order_id);
CREATE INDEX idx_fact_sales_status ON fact_sales(order_status);

-- 복합 인덱스 (자주 사용되는 필터 조합)
CREATE INDEX idx_fact_sales_date_customer ON fact_sales(date_key, customer_sk);
CREATE INDEX idx_fact_sales_date_product ON fact_sales(date_key, product_sk);


-- Fact 테이블 통계 뷰
CREATE VIEW fact_sales_stats AS
SELECT
    COUNT(*) AS total_rows,
    COUNT(DISTINCT order_id) AS unique_orders,
    COUNT(DISTINCT customer_sk) AS unique_customers,
    COUNT(DISTINCT product_sk) AS unique_products,
    MIN(date_key) AS min_date,
    MAX(date_key) AS max_date,
    SUM(gross_amount) AS total_gross,
    SUM(discount_amount) AS total_discount,
    SUM(net_amount) AS total_net,
    SUM(profit_amount) AS total_profit,
    ROUND(AVG(profit_amount / NULLIF(net_amount, 0)) * 100, 2) AS avg_margin_rate
FROM fact_sales;


-- =====================================================
-- 샘플 분석 쿼리
-- =====================================================

-- 1. 월별 매출 추이
SELECT
    d.year,
    d.month_num,
    d.month_name,
    SUM(f.net_amount) AS monthly_sales,
    SUM(f.profit_amount) AS monthly_profit,
    ROUND(SUM(f.profit_amount) / NULLIF(SUM(f.net_amount), 0) * 100, 2) AS margin_rate,
    COUNT(DISTINCT f.order_id) AS order_count,
    COUNT(DISTINCT f.customer_sk) AS customer_count
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
WHERE f.order_status NOT IN ('cancelled', 'refunded')
GROUP BY d.year, d.month_num, d.month_name
ORDER BY d.year, d.month_num;


-- 2. 고객 등급별 분석
SELECT
    c.customer_grade,
    COUNT(DISTINCT c.customer_id) AS customer_count,
    COUNT(DISTINCT f.order_id) AS order_count,
    SUM(f.net_amount) AS total_sales,
    AVG(f.net_amount) AS avg_item_amount,
    ROUND(SUM(f.net_amount) / COUNT(DISTINCT c.customer_id), 2) AS sales_per_customer
FROM fact_sales f
JOIN dim_customer c ON f.customer_sk = c.customer_sk AND c.is_current = TRUE
WHERE f.order_status = 'delivered'
GROUP BY c.customer_grade
ORDER BY total_sales DESC;


-- 3. 카테고리별 마진 분석
SELECT
    p.main_category_name,
    COUNT(DISTINCT p.product_id) AS product_count,
    SUM(f.quantity) AS total_quantity,
    SUM(f.net_amount) AS total_sales,
    SUM(f.profit_amount) AS total_profit,
    ROUND(SUM(f.profit_amount) / NULLIF(SUM(f.net_amount), 0) * 100, 2) AS margin_rate
FROM fact_sales f
JOIN dim_product p ON f.product_sk = p.product_sk AND p.is_current = TRUE
WHERE f.order_status = 'delivered'
GROUP BY p.main_category_name
ORDER BY margin_rate DESC;


-- 4. 요일별 주문 패턴
SELECT
    d.day_name,
    d.day_of_week,
    COUNT(DISTINCT f.order_id) AS order_count,
    SUM(f.net_amount) AS total_sales,
    ROUND(AVG(f.net_amount), 2) AS avg_order_amount
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
GROUP BY d.day_name, d.day_of_week
ORDER BY d.day_of_week;


-- 5. 지역별 매출 분석
SELECT
    g.city,
    g.region,
    COUNT(DISTINCT f.customer_sk) AS customer_count,
    SUM(f.net_amount) AS total_sales,
    ROUND(SUM(f.net_amount) / COUNT(DISTINCT f.customer_sk), 2) AS sales_per_customer
FROM fact_sales f
JOIN dim_geography g ON f.geography_sk = g.geography_sk
WHERE f.order_status = 'delivered'
GROUP BY g.city, g.region
ORDER BY total_sales DESC
LIMIT 10;


-- 6. 프로모션 효과 분석
SELECT
    p.promotion_name,
    p.promotion_type,
    COUNT(DISTINCT f.order_id) AS order_count,
    SUM(f.discount_amount) AS total_discount,
    SUM(f.net_amount) AS total_sales,
    ROUND(SUM(f.discount_amount) / NULLIF(SUM(f.gross_amount), 0) * 100, 2) AS discount_rate
FROM fact_sales f
JOIN dim_promotion p ON f.promotion_sk = p.promotion_sk
WHERE p.promotion_id != 0  -- No Promotion 제외
GROUP BY p.promotion_name, p.promotion_type
ORDER BY total_sales DESC;


-- 7. 상품 Top 10 (매출 기준)
SELECT
    p.product_name,
    p.brand,
    p.category_name,
    SUM(f.quantity) AS total_quantity,
    SUM(f.net_amount) AS total_sales,
    SUM(f.profit_amount) AS total_profit,
    COUNT(DISTINCT f.order_id) AS order_count
FROM fact_sales f
JOIN dim_product p ON f.product_sk = p.product_sk AND p.is_current = TRUE
WHERE f.order_status = 'delivered'
GROUP BY p.product_sk, p.product_name, p.brand, p.category_name
ORDER BY total_sales DESC
LIMIT 10;`,
      hints: [
        'Grain은 주문 상세(Order Item) 레벨',
        'FK 컬럼은 Dimension의 Surrogate Key 참조',
        'Default 값으로 Unknown 레코드(sk=0) 참조',
        'Degenerate Dimension은 Fact에 직접 저장'
      ]
    }
  },
  {
    id: 'w4d5t4',
    title: 'ETL 프로세스 설계',
    type: 'code',
    duration: 35,
    content: {
      instructions: `
# ETL 프로세스 설계

OLTP 데이터를 DW로 적재하는 ETL 프로세스를 설계합니다.

## ETL 단계

1. **Extract**: OLTP에서 증분 데이터 추출
2. **Transform**: 데이터 정제, 변환, SCD 처리
3. **Load**: DW에 적재

## 구현할 ETL

1. **dim_customer 적재** (SCD Type 2)
2. **dim_product 적재** (SCD Type 2)
3. **fact_sales 적재** (Incremental)

## 가정

- OLTP 테이블에 updated_at 컬럼 존재
- ETL 배치는 매일 실행
- 마지막 적재 시간 추적 필요
      `,
      starterCode: `-- =====================================================
-- 이커머스 DW: ETL 프로세스
-- =====================================================

-- ETL 메타데이터 테이블
CREATE TABLE etl_log (
    log_id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    batch_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    rows_processed INT DEFAULT 0,
    rows_inserted INT DEFAULT 0,
    rows_updated INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'running',  -- 'running', 'success', 'failed'
    error_message TEXT
);

-- 마지막 성공 적재 시간 조회
CREATE OR REPLACE FUNCTION get_last_load_time(p_table_name VARCHAR)
RETURNS TIMESTAMP AS $$
BEGIN
    RETURN COALESCE(
        (SELECT MAX(end_time)
         FROM etl_log
         WHERE table_name = p_table_name AND status = 'success'),
        '1900-01-01'::TIMESTAMP
    );
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- OLTP 테이블 (소스)
-- =====================================================
-- 실제로는 다른 데이터베이스에 있음
-- 여기서는 같은 DB의 다른 스키마로 가정

CREATE SCHEMA oltp;

CREATE TABLE oltp.customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    gender VARCHAR(10),
    birth_date DATE,
    grade VARCHAR(20) DEFAULT 'Bronze',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE oltp.products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50),
    brand VARCHAR(100),
    category_id INT,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE oltp.orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE oltp.order_items (
    item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- ETL 프로시저: dim_customer (SCD Type 2)
-- =====================================================

CREATE OR REPLACE PROCEDURE etl_load_dim_customer(p_batch_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_last_load TIMESTAMP;
    v_rows_inserted INT := 0;
    v_rows_updated INT := 0;
BEGIN
    -- 로그 시작
    INSERT INTO etl_log (table_name, batch_id, start_time)
    VALUES ('dim_customer', p_batch_id, CURRENT_TIMESTAMP);

    -- 마지막 적재 시간
    v_last_load := get_last_load_time('dim_customer');

    -- TODO: SCD Type 2 로직 구현
    -- 1. 변경된 기존 고객 처리 (기존 레코드 종료)
    -- 2. 새 버전 삽입
    -- 3. 신규 고객 삽입


    -- 로그 완료
    UPDATE etl_log
    SET end_time = CURRENT_TIMESTAMP,
        rows_inserted = v_rows_inserted,
        rows_updated = v_rows_updated,
        status = 'success'
    WHERE table_name = 'dim_customer' AND batch_id = p_batch_id;

EXCEPTION WHEN OTHERS THEN
    UPDATE etl_log
    SET end_time = CURRENT_TIMESTAMP,
        status = 'failed',
        error_message = SQLERRM
    WHERE table_name = 'dim_customer' AND batch_id = p_batch_id;
    RAISE;
END;
$$;


-- =====================================================
-- ETL 프로시저: fact_sales (Incremental)
-- =====================================================

CREATE OR REPLACE PROCEDURE etl_load_fact_sales(p_batch_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_last_load TIMESTAMP;
    v_rows_inserted INT := 0;
BEGIN
    -- 로그 시작
    INSERT INTO etl_log (table_name, batch_id, start_time)
    VALUES ('fact_sales', p_batch_id, CURRENT_TIMESTAMP);

    v_last_load := get_last_load_time('fact_sales');

    -- TODO: Fact 적재 로직 구현
    -- 1. 증분 데이터 추출 (order_items.created_at > v_last_load)
    -- 2. Dimension Surrogate Key 조인 (Lookup)
    -- 3. Measures 계산
    -- 4. 적재


    -- 로그 완료
    UPDATE etl_log
    SET end_time = CURRENT_TIMESTAMP,
        rows_inserted = v_rows_inserted,
        status = 'success'
    WHERE table_name = 'fact_sales' AND batch_id = p_batch_id;

EXCEPTION WHEN OTHERS THEN
    UPDATE etl_log
    SET end_time = CURRENT_TIMESTAMP,
        status = 'failed',
        error_message = SQLERRM
    WHERE table_name = 'fact_sales' AND batch_id = p_batch_id;
    RAISE;
END;
$$;


-- 전체 ETL 실행
CREATE OR REPLACE PROCEDURE run_daily_etl()
LANGUAGE plpgsql
AS $$
DECLARE
    v_batch_id INT;
BEGIN
    -- 배치 ID 생성
    v_batch_id := TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS')::INT;

    -- Dimension 먼저 적재
    CALL etl_load_dim_customer(v_batch_id);
    -- CALL etl_load_dim_product(v_batch_id);
    -- CALL etl_load_dim_geography(v_batch_id);

    -- Fact 적재
    CALL etl_load_fact_sales(v_batch_id);
END;
$$;`,
      solutionCode: `-- =====================================================
-- 이커머스 DW: ETL 프로세스 (완성)
-- =====================================================

-- ETL 메타데이터 테이블
CREATE TABLE etl_log (
    log_id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    batch_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    rows_processed INT DEFAULT 0,
    rows_inserted INT DEFAULT 0,
    rows_updated INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'running',
    error_message TEXT
);

CREATE OR REPLACE FUNCTION get_last_load_time(p_table_name VARCHAR)
RETURNS TIMESTAMP AS $$
BEGIN
    RETURN COALESCE(
        (SELECT MAX(end_time)
         FROM etl_log
         WHERE table_name = p_table_name AND status = 'success'),
        '1900-01-01'::TIMESTAMP
    );
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- ETL 프로시저: dim_customer (SCD Type 2)
-- =====================================================

CREATE OR REPLACE PROCEDURE etl_load_dim_customer(p_batch_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_last_load TIMESTAMP;
    v_rows_inserted INT := 0;
    v_rows_updated INT := 0;
    v_now TIMESTAMP := CURRENT_TIMESTAMP;
BEGIN
    INSERT INTO etl_log (table_name, batch_id, start_time)
    VALUES ('dim_customer', p_batch_id, v_now);

    v_last_load := get_last_load_time('dim_customer');

    -- 1. 변경된 기존 고객: 기존 레코드 종료
    UPDATE dim_customer d
    SET valid_to = v_now,
        is_current = FALSE,
        updated_at = v_now
    FROM oltp.customers s
    WHERE d.customer_id = s.customer_id
      AND d.is_current = TRUE
      AND s.updated_at > v_last_load
      -- 실제 변경 확인 (SCD 대상 컬럼)
      AND (d.customer_grade != s.grade
           OR d.email != COALESCE(s.email, '')
           OR d.phone != COALESCE(s.phone, ''));

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

    -- 2. 변경된 기존 고객: 새 버전 삽입
    INSERT INTO dim_customer (
        customer_id, customer_name, email, phone, gender, birth_date,
        age_group, customer_grade,
        valid_from, valid_to, is_current, source_system
    )
    SELECT
        s.customer_id,
        s.name,
        COALESCE(s.email, ''),
        COALESCE(s.phone, ''),
        s.gender,
        s.birth_date,
        CASE
            WHEN EXTRACT(YEAR FROM AGE(s.birth_date)) < 20 THEN '10대 이하'
            WHEN EXTRACT(YEAR FROM AGE(s.birth_date)) < 30 THEN '20대'
            WHEN EXTRACT(YEAR FROM AGE(s.birth_date)) < 40 THEN '30대'
            WHEN EXTRACT(YEAR FROM AGE(s.birth_date)) < 50 THEN '40대'
            WHEN EXTRACT(YEAR FROM AGE(s.birth_date)) < 60 THEN '50대'
            ELSE '60대 이상'
        END,
        s.grade,
        v_now,
        '9999-12-31 23:59:59',
        TRUE,
        'OLTP'
    FROM oltp.customers s
    WHERE s.updated_at > v_last_load
      AND EXISTS (
          SELECT 1 FROM dim_customer d
          WHERE d.customer_id = s.customer_id
            AND d.is_current = FALSE
            AND d.valid_to = v_now  -- 방금 종료된 레코드
      );

    -- 3. 완전히 새로운 고객 삽입
    INSERT INTO dim_customer (
        customer_id, customer_name, email, phone, gender, birth_date,
        age_group, customer_grade, first_purchase_date,
        valid_from, valid_to, is_current, source_system
    )
    SELECT
        s.customer_id,
        s.name,
        COALESCE(s.email, ''),
        COALESCE(s.phone, ''),
        s.gender,
        s.birth_date,
        CASE
            WHEN EXTRACT(YEAR FROM AGE(s.birth_date)) < 20 THEN '10대 이하'
            WHEN EXTRACT(YEAR FROM AGE(s.birth_date)) < 30 THEN '20대'
            WHEN EXTRACT(YEAR FROM AGE(s.birth_date)) < 40 THEN '30대'
            WHEN EXTRACT(YEAR FROM AGE(s.birth_date)) < 50 THEN '40대'
            WHEN EXTRACT(YEAR FROM AGE(s.birth_date)) < 60 THEN '50대'
            ELSE '60대 이상'
        END,
        s.grade,
        s.created_at::DATE,
        v_now,
        '9999-12-31 23:59:59',
        TRUE,
        'OLTP'
    FROM oltp.customers s
    WHERE s.created_at > v_last_load
      AND NOT EXISTS (
          SELECT 1 FROM dim_customer d WHERE d.customer_id = s.customer_id
      );

    GET DIAGNOSTICS v_rows_inserted = ROW_COUNT;

    UPDATE etl_log
    SET end_time = CURRENT_TIMESTAMP,
        rows_inserted = v_rows_inserted,
        rows_updated = v_rows_updated,
        status = 'success'
    WHERE table_name = 'dim_customer' AND batch_id = p_batch_id;

EXCEPTION WHEN OTHERS THEN
    UPDATE etl_log
    SET end_time = CURRENT_TIMESTAMP,
        status = 'failed',
        error_message = SQLERRM
    WHERE table_name = 'dim_customer' AND batch_id = p_batch_id;
    RAISE;
END;
$$;


-- =====================================================
-- ETL 프로시저: dim_product (SCD Type 2)
-- =====================================================

CREATE OR REPLACE PROCEDURE etl_load_dim_product(p_batch_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_last_load TIMESTAMP;
    v_rows_inserted INT := 0;
    v_rows_updated INT := 0;
    v_now TIMESTAMP := CURRENT_TIMESTAMP;
BEGIN
    INSERT INTO etl_log (table_name, batch_id, start_time)
    VALUES ('dim_product', p_batch_id, v_now);

    v_last_load := get_last_load_time('dim_product');

    -- 1. 가격 변경된 상품: 기존 레코드 종료
    UPDATE dim_product d
    SET valid_to = v_now,
        is_current = FALSE,
        updated_at = v_now
    FROM oltp.products s
    WHERE d.product_id = s.product_id
      AND d.is_current = TRUE
      AND s.updated_at > v_last_load
      AND (d.unit_price != s.price OR d.unit_cost != COALESCE(s.cost, 0));

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

    -- 2. 가격 변경된 상품: 새 버전 삽입
    INSERT INTO dim_product (
        product_id, product_name, product_code, brand, description,
        unit_price, unit_cost, category_id, status,
        valid_from, valid_to, is_current
    )
    SELECT
        s.product_id,
        s.name,
        s.code,
        s.brand,
        NULL,
        s.price,
        COALESCE(s.cost, 0),
        s.category_id,
        s.status,
        v_now,
        '9999-12-31 23:59:59',
        TRUE
    FROM oltp.products s
    WHERE s.updated_at > v_last_load
      AND EXISTS (
          SELECT 1 FROM dim_product d
          WHERE d.product_id = s.product_id
            AND d.is_current = FALSE
            AND d.valid_to = v_now
      );

    -- 3. 신규 상품 삽입
    INSERT INTO dim_product (
        product_id, product_name, product_code, brand, description,
        unit_price, unit_cost, category_id, status,
        valid_from, valid_to, is_current
    )
    SELECT
        s.product_id,
        s.name,
        s.code,
        s.brand,
        NULL,
        s.price,
        COALESCE(s.cost, 0),
        s.category_id,
        s.status,
        v_now,
        '9999-12-31 23:59:59',
        TRUE
    FROM oltp.products s
    WHERE s.created_at > v_last_load
      AND NOT EXISTS (
          SELECT 1 FROM dim_product d WHERE d.product_id = s.product_id
      );

    GET DIAGNOSTICS v_rows_inserted = ROW_COUNT;

    UPDATE etl_log
    SET end_time = CURRENT_TIMESTAMP,
        rows_inserted = v_rows_inserted,
        rows_updated = v_rows_updated,
        status = 'success'
    WHERE table_name = 'dim_product' AND batch_id = p_batch_id;

EXCEPTION WHEN OTHERS THEN
    UPDATE etl_log
    SET end_time = CURRENT_TIMESTAMP,
        status = 'failed',
        error_message = SQLERRM
    WHERE table_name = 'dim_product' AND batch_id = p_batch_id;
    RAISE;
END;
$$;


-- =====================================================
-- ETL 프로시저: fact_sales (Incremental)
-- =====================================================

CREATE OR REPLACE PROCEDURE etl_load_fact_sales(p_batch_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_last_load TIMESTAMP;
    v_rows_inserted INT := 0;
BEGIN
    INSERT INTO etl_log (table_name, batch_id, start_time)
    VALUES ('fact_sales', p_batch_id, CURRENT_TIMESTAMP);

    v_last_load := get_last_load_time('fact_sales');

    -- Fact 적재: OLTP → DW (Dimension Lookup 포함)
    INSERT INTO fact_sales (
        order_id, order_item_id, order_status,
        date_key, order_time,
        customer_sk, product_sk, geography_sk, promotion_sk,
        quantity, unit_price, gross_amount, discount_amount,
        net_amount, unit_cost, total_cost, profit_amount,
        etl_batch_id
    )
    SELECT
        o.order_id,
        oi.item_id,
        o.status,

        -- Date Dimension Lookup
        TO_CHAR(o.order_date, 'YYYYMMDD')::INT,
        o.order_date::TIME,

        -- Customer Dimension Lookup (Point-in-Time)
        COALESCE(dc.customer_sk, 0),

        -- Product Dimension Lookup (Point-in-Time)
        COALESCE(dp.product_sk, 0),

        -- Geography: 0 (Unknown) - 별도 Lookup 필요
        0,

        -- Promotion: 0 (No Promotion) - 별도 Lookup 필요
        0,

        -- Measures
        oi.quantity,
        oi.unit_price,
        oi.quantity * oi.unit_price,                    -- gross_amount
        COALESCE(oi.discount_amount, 0),
        oi.quantity * oi.unit_price - COALESCE(oi.discount_amount, 0),  -- net_amount
        COALESCE(dp.unit_cost, 0),
        oi.quantity * COALESCE(dp.unit_cost, 0),        -- total_cost
        (oi.quantity * oi.unit_price - COALESCE(oi.discount_amount, 0))
          - (oi.quantity * COALESCE(dp.unit_cost, 0)),  -- profit_amount

        p_batch_id

    FROM oltp.order_items oi
    JOIN oltp.orders o ON oi.order_id = o.order_id

    -- Customer Dimension: Point-in-Time Join
    LEFT JOIN dim_customer dc
        ON dc.customer_id = o.customer_id
        AND dc.valid_from <= o.order_date
        AND dc.valid_to > o.order_date

    -- Product Dimension: Point-in-Time Join
    LEFT JOIN dim_product dp
        ON dp.product_id = oi.product_id
        AND dp.valid_from <= o.order_date
        AND dp.valid_to > o.order_date

    WHERE oi.created_at > v_last_load

    -- 중복 방지
    ON CONFLICT (order_id, order_item_id) DO NOTHING;

    GET DIAGNOSTICS v_rows_inserted = ROW_COUNT;

    UPDATE etl_log
    SET end_time = CURRENT_TIMESTAMP,
        rows_inserted = v_rows_inserted,
        status = 'success'
    WHERE table_name = 'fact_sales' AND batch_id = p_batch_id;

EXCEPTION WHEN OTHERS THEN
    UPDATE etl_log
    SET end_time = CURRENT_TIMESTAMP,
        status = 'failed',
        error_message = SQLERRM
    WHERE table_name = 'fact_sales' AND batch_id = p_batch_id;
    RAISE;
END;
$$;


-- =====================================================
-- 전체 ETL 실행
-- =====================================================

CREATE OR REPLACE PROCEDURE run_daily_etl()
LANGUAGE plpgsql
AS $$
DECLARE
    v_batch_id INT;
BEGIN
    v_batch_id := TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS')::INT;

    RAISE NOTICE 'Starting ETL Batch: %', v_batch_id;

    -- Dimension 먼저 (Fact가 참조하므로)
    CALL etl_load_dim_customer(v_batch_id);
    RAISE NOTICE 'dim_customer loaded';

    CALL etl_load_dim_product(v_batch_id);
    RAISE NOTICE 'dim_product loaded';

    -- Fact 적재
    CALL etl_load_fact_sales(v_batch_id);
    RAISE NOTICE 'fact_sales loaded';

    RAISE NOTICE 'ETL Batch % completed successfully', v_batch_id;
END;
$$;


-- 실행
-- CALL run_daily_etl();

-- ETL 결과 확인
-- SELECT * FROM etl_log ORDER BY start_time DESC LIMIT 10;`,
      hints: [
        'SCD Type 2: UPDATE(종료) + INSERT(새 버전) 두 단계',
        'Point-in-Time Join: 주문 시점의 Dimension 버전 찾기',
        '증분 추출: created_at > last_load_time',
        'ON CONFLICT로 중복 적재 방지'
      ]
    }
  },
  {
    id: 'w4d5t5',
    title: '최종 도전과제: 이커머스 DW 완성',
    type: 'challenge',
    duration: 45,
    content: {
      instructions: `
# 최종 도전과제: 이커머스 데이터 웨어하우스 완성

지금까지 배운 모든 내용을 종합하여 이커머스 DW를 완성하세요.

## 과제

### Part 1: 누락된 Dimension 완성 (20점)
- dim_category에 카테고리 계층 데이터 삽입
- dim_geography에 지역 데이터 삽입
- dim_promotion에 프로모션 데이터 삽입

### Part 2: 추가 분석 쿼리 작성 (30점)
1. **RFM 분석**: Recency, Frequency, Monetary 점수 계산
2. **코호트 분석**: 첫 구매월별 고객 유지율
3. **장바구니 분석**: 함께 구매되는 상품 조합

### Part 3: ETL 고도화 (20점)
- dim_geography ETL 프로시저 작성
- Late Arriving Dimension 처리 (Fact가 먼저 오는 경우)

### Part 4: 문서화 (30점)
- ERD 다이어그램 (텍스트 또는 도구 사용)
- 테이블 설명서 (컬럼별 설명)
- ETL 흐름도

## 평가 기준

1. 정규화 및 Star Schema 설계 이해도
2. SCD Type 2 구현 정확성
3. 분석 쿼리의 실용성
4. ETL 로직의 견고함
5. 문서화 품질
      `,
      starterCode: `-- =====================================================
-- 이커머스 DW 최종 도전과제
-- =====================================================

-- Part 1: 누락된 Dimension 데이터 삽입

-- 1-1. 카테고리 데이터
INSERT INTO dim_category (category_id, category_name, subcategory_name, main_category_name, category_path, category_level) VALUES
(1, '노트북', '컴퓨터', '전자제품', '전자제품 > 컴퓨터 > 노트북', 3),
(2, '데스크톱', '컴퓨터', '전자제품', '전자제품 > 컴퓨터 > 데스크톱', 3)
-- TODO: 더 추가
;

-- 1-2. 지역 데이터
INSERT INTO dim_geography (geography_id, country, region, city, district, postal_code) VALUES
(1, '대한민국', '수도권', '서울특별시', '강남구', '06000')
-- TODO: 더 추가
;

-- 1-3. 프로모션 데이터
INSERT INTO dim_promotion (promotion_id, promotion_name, promotion_type, discount_type, discount_value, start_date, end_date) VALUES
(1, '신년 세일', '할인', 'percent', 10, '2024-01-01', '2024-01-31')
-- TODO: 더 추가
;


-- Part 2: 추가 분석 쿼리

-- 2-1. RFM 분석
-- R: 최근 구매일로부터 경과 일수
-- F: 총 구매 횟수
-- M: 총 구매 금액
-- 각각 1-5 점수로 변환

WITH customer_rfm AS (
    SELECT
        c.customer_id,
        c.customer_name,
        -- TODO: R, F, M 계산
        -- CURRENT_DATE - MAX(d.full_date) AS recency_days
        -- COUNT(DISTINCT f.order_id) AS frequency
        -- SUM(f.net_amount) AS monetary
        NULL AS recency_days,
        NULL AS frequency,
        NULL AS monetary
    FROM fact_sales f
    JOIN dim_customer c ON f.customer_sk = c.customer_sk AND c.is_current = TRUE
    JOIN dim_date d ON f.date_key = d.date_key
    GROUP BY c.customer_id, c.customer_name
)
SELECT
    customer_id,
    customer_name,
    recency_days,
    frequency,
    monetary
    -- TODO: 점수화 (NTILE 또는 CASE WHEN)
FROM customer_rfm;


-- 2-2. 코호트 분석 (첫 구매월별 유지율)
-- TODO: 구현


-- 2-3. 장바구니 분석 (함께 구매되는 상품)
-- TODO: 구현


-- Part 3: ETL 고도화

-- 3-1. dim_geography ETL
CREATE OR REPLACE PROCEDURE etl_load_dim_geography(p_batch_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- TODO: 구현
    NULL;
END;
$$;

-- 3-2. Late Arriving Dimension 처리
-- Fact에 Unknown(0)으로 저장된 레코드를 나중에 업데이트
CREATE OR REPLACE PROCEDURE fix_late_arriving_dimensions()
LANGUAGE plpgsql
AS $$
BEGIN
    -- TODO: customer_sk = 0인 Fact 레코드 수정
    NULL;
END;
$$;


-- Part 4: 문서화

-- ERD (텍스트)
/*
TODO: 아래 형식으로 ERD 작성

[dim_date]
  date_key PK
  full_date
  ...

[dim_customer]
  customer_sk PK
  customer_id NK
  ...
  |
  | 1:N
  v
[fact_sales]
  sales_sk PK
  date_key FK --> dim_date
  customer_sk FK --> dim_customer
  ...
*/


-- 테이블 설명서
/*
TODO: 주요 테이블의 컬럼 설명

## fact_sales
| 컬럼 | 타입 | 설명 |
|------|------|------|
| sales_sk | BIGSERIAL | Surrogate Key |
| order_id | INT | 주문 번호 (Degenerate) |
| ... | ... | ... |
*/`,
      requirements: [
        '모든 Dimension에 샘플 데이터 최소 5건씩 삽입',
        'RFM 분석 쿼리 완성 및 점수화 (1-5점)',
        '코호트 분석 또는 장바구니 분석 중 1개 완성',
        'ETL 프로시저 1개 이상 추가',
        'ERD 및 테이블 설명서 작성'
      ],
      evaluationCriteria: [
        'Dimension 데이터 품질 및 완전성 (20%)',
        'RFM 분석 쿼리 정확성 (20%)',
        '추가 분석 쿼리 구현 (15%)',
        'ETL 로직 견고함 (15%)',
        '문서화 완성도 (30%)'
      ],
      hints: [
        'RFM 점수화: NTILE(5) OVER (ORDER BY ...) 사용',
        '코호트 분석: 첫 구매월(cohort_month)별 그룹핑',
        '장바구니 분석: 같은 order_id 내 상품 조합',
        'Late Arriving: UPDATE fact_sales SET customer_sk = (SELECT ...) WHERE customer_sk = 0'
      ]
    }
  }
]
