import { DbtProject, DbtModel, DbtSource } from './types'

// E-commerce 데이터 웨어하우스 프로젝트
export const ecommerceProject: DbtProject = {
  id: 'ecommerce_dwh',
  name: 'E-Commerce Data Warehouse',
  description: '이커머스 플랫폼의 주문, 고객, 상품 데이터를 분석하기 위한 dbt 프로젝트',
  version: '1.0.0',
  sources: [
    {
      id: 'src_raw',
      name: 'raw_ecommerce',
      database: 'raw_db',
      schema: 'public',
      tables: [
        { name: 'orders', columns: ['order_id', 'customer_id', 'order_date', 'status', 'total_amount'] },
        { name: 'order_items', columns: ['item_id', 'order_id', 'product_id', 'quantity', 'unit_price'] },
        { name: 'customers', columns: ['customer_id', 'email', 'name', 'created_at', 'country'] },
        { name: 'products', columns: ['product_id', 'name', 'category', 'price', 'stock'] },
      ],
      description: 'Raw operational data from e-commerce platform',
    },
  ],
  models: [
    // Staging Layer
    {
      id: 'stg_orders',
      name: 'stg_orders',
      layer: 'staging',
      materialization: 'view',
      schema: 'staging',
      description: '주문 데이터 정제 - 타입 캐스팅 및 컬럼 리네이밍',
      sql: `WITH source AS (
    SELECT * FROM {{ source('raw_ecommerce', 'orders') }}
)

SELECT
    order_id::VARCHAR AS order_id,
    customer_id::VARCHAR AS customer_id,
    order_date::TIMESTAMP AS ordered_at,
    UPPER(status) AS order_status,
    total_amount::DECIMAL(10,2) AS order_total
FROM source
WHERE order_id IS NOT NULL`,
      columns: [
        { name: 'order_id', type: 'VARCHAR', description: '주문 고유 ID', tests: ['unique', 'not_null'] },
        { name: 'customer_id', type: 'VARCHAR', description: '고객 ID', tests: ['not_null'] },
        { name: 'ordered_at', type: 'TIMESTAMP', description: '주문 일시' },
        { name: 'order_status', type: 'VARCHAR', description: '주문 상태', tests: ['accepted_values'] },
        { name: 'order_total', type: 'DECIMAL', description: '주문 총액' },
      ],
      depends_on: ['src_raw'],
      tests: [
        { name: 'unique_order_id', type: 'unique', column: 'order_id', severity: 'error' },
        { name: 'not_null_order_id', type: 'not_null', column: 'order_id', severity: 'error' },
      ],
      tags: ['staging', 'orders'],
    },
    {
      id: 'stg_customers',
      name: 'stg_customers',
      layer: 'staging',
      materialization: 'view',
      schema: 'staging',
      description: '고객 데이터 정제',
      sql: `WITH source AS (
    SELECT * FROM {{ source('raw_ecommerce', 'customers') }}
)

SELECT
    customer_id::VARCHAR AS customer_id,
    LOWER(email) AS email,
    INITCAP(name) AS customer_name,
    created_at::TIMESTAMP AS registered_at,
    UPPER(country) AS country_code
FROM source`,
      columns: [
        { name: 'customer_id', type: 'VARCHAR', tests: ['unique', 'not_null'] },
        { name: 'email', type: 'VARCHAR', tests: ['unique'] },
        { name: 'customer_name', type: 'VARCHAR' },
        { name: 'registered_at', type: 'TIMESTAMP' },
        { name: 'country_code', type: 'VARCHAR' },
      ],
      depends_on: ['src_raw'],
      tests: [],
      tags: ['staging', 'customers'],
    },
    {
      id: 'stg_products',
      name: 'stg_products',
      layer: 'staging',
      materialization: 'view',
      schema: 'staging',
      description: '상품 데이터 정제',
      sql: `WITH source AS (
    SELECT * FROM {{ source('raw_ecommerce', 'products') }}
)

SELECT
    product_id::VARCHAR AS product_id,
    name AS product_name,
    LOWER(category) AS category,
    price::DECIMAL(10,2) AS unit_price,
    stock::INTEGER AS stock_quantity
FROM source`,
      columns: [
        { name: 'product_id', type: 'VARCHAR', tests: ['unique', 'not_null'] },
        { name: 'product_name', type: 'VARCHAR' },
        { name: 'category', type: 'VARCHAR' },
        { name: 'unit_price', type: 'DECIMAL' },
        { name: 'stock_quantity', type: 'INTEGER' },
      ],
      depends_on: ['src_raw'],
      tests: [],
      tags: ['staging', 'products'],
    },
    {
      id: 'stg_order_items',
      name: 'stg_order_items',
      layer: 'staging',
      materialization: 'view',
      schema: 'staging',
      description: '주문 상세 데이터 정제',
      sql: `WITH source AS (
    SELECT * FROM {{ source('raw_ecommerce', 'order_items') }}
)

SELECT
    item_id::VARCHAR AS order_item_id,
    order_id::VARCHAR AS order_id,
    product_id::VARCHAR AS product_id,
    quantity::INTEGER AS quantity,
    unit_price::DECIMAL(10,2) AS unit_price,
    (quantity * unit_price)::DECIMAL(10,2) AS line_total
FROM source`,
      columns: [
        { name: 'order_item_id', type: 'VARCHAR', tests: ['unique'] },
        { name: 'order_id', type: 'VARCHAR', tests: ['not_null', 'relationships'] },
        { name: 'product_id', type: 'VARCHAR', tests: ['relationships'] },
        { name: 'quantity', type: 'INTEGER' },
        { name: 'unit_price', type: 'DECIMAL' },
        { name: 'line_total', type: 'DECIMAL' },
      ],
      depends_on: ['src_raw'],
      tests: [],
      tags: ['staging', 'orders'],
    },
    // Intermediate Layer
    {
      id: 'int_orders_enriched',
      name: 'int_orders_enriched',
      layer: 'intermediate',
      materialization: 'view',
      schema: 'intermediate',
      description: '주문 데이터에 고객 정보 조인',
      sql: `WITH orders AS (
    SELECT * FROM {{ ref('stg_orders') }}
),

customers AS (
    SELECT * FROM {{ ref('stg_customers') }}
)

SELECT
    o.order_id,
    o.ordered_at,
    o.order_status,
    o.order_total,
    c.customer_id,
    c.customer_name,
    c.email,
    c.country_code
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id`,
      columns: [
        { name: 'order_id', type: 'VARCHAR' },
        { name: 'ordered_at', type: 'TIMESTAMP' },
        { name: 'order_status', type: 'VARCHAR' },
        { name: 'order_total', type: 'DECIMAL' },
        { name: 'customer_id', type: 'VARCHAR' },
        { name: 'customer_name', type: 'VARCHAR' },
        { name: 'email', type: 'VARCHAR' },
        { name: 'country_code', type: 'VARCHAR' },
      ],
      depends_on: ['stg_orders', 'stg_customers'],
      tests: [],
      tags: ['intermediate'],
    },
    {
      id: 'int_order_items_enriched',
      name: 'int_order_items_enriched',
      layer: 'intermediate',
      materialization: 'view',
      schema: 'intermediate',
      description: '주문 상세에 상품 정보 조인',
      sql: `WITH order_items AS (
    SELECT * FROM {{ ref('stg_order_items') }}
),

products AS (
    SELECT * FROM {{ ref('stg_products') }}
)

SELECT
    oi.order_item_id,
    oi.order_id,
    oi.quantity,
    oi.unit_price,
    oi.line_total,
    p.product_id,
    p.product_name,
    p.category
FROM order_items oi
LEFT JOIN products p ON oi.product_id = p.product_id`,
      columns: [
        { name: 'order_item_id', type: 'VARCHAR' },
        { name: 'order_id', type: 'VARCHAR' },
        { name: 'quantity', type: 'INTEGER' },
        { name: 'unit_price', type: 'DECIMAL' },
        { name: 'line_total', type: 'DECIMAL' },
        { name: 'product_id', type: 'VARCHAR' },
        { name: 'product_name', type: 'VARCHAR' },
        { name: 'category', type: 'VARCHAR' },
      ],
      depends_on: ['stg_order_items', 'stg_products'],
      tests: [],
      tags: ['intermediate'],
    },
    // Marts Layer
    {
      id: 'fct_orders',
      name: 'fct_orders',
      layer: 'marts',
      materialization: 'table',
      schema: 'marts',
      description: '주문 팩트 테이블 - 분석용 최종 테이블',
      sql: `WITH orders AS (
    SELECT * FROM {{ ref('int_orders_enriched') }}
),

order_items AS (
    SELECT
        order_id,
        COUNT(*) AS item_count,
        SUM(quantity) AS total_quantity
    FROM {{ ref('int_order_items_enriched') }}
    GROUP BY order_id
)

SELECT
    o.order_id,
    o.customer_id,
    o.customer_name,
    o.country_code,
    o.ordered_at,
    DATE_TRUNC('day', o.ordered_at) AS order_date,
    DATE_TRUNC('month', o.ordered_at) AS order_month,
    o.order_status,
    o.order_total,
    COALESCE(oi.item_count, 0) AS item_count,
    COALESCE(oi.total_quantity, 0) AS total_quantity
FROM orders o
LEFT JOIN order_items oi ON o.order_id = oi.order_id`,
      columns: [
        { name: 'order_id', type: 'VARCHAR', tests: ['unique', 'not_null'] },
        { name: 'customer_id', type: 'VARCHAR' },
        { name: 'customer_name', type: 'VARCHAR' },
        { name: 'country_code', type: 'VARCHAR' },
        { name: 'ordered_at', type: 'TIMESTAMP' },
        { name: 'order_date', type: 'DATE' },
        { name: 'order_month', type: 'DATE' },
        { name: 'order_status', type: 'VARCHAR' },
        { name: 'order_total', type: 'DECIMAL' },
        { name: 'item_count', type: 'INTEGER' },
        { name: 'total_quantity', type: 'INTEGER' },
      ],
      depends_on: ['int_orders_enriched', 'int_order_items_enriched'],
      tests: [
        { name: 'unique_order_id', type: 'unique', column: 'order_id', severity: 'error' },
      ],
      tags: ['marts', 'core'],
    },
    {
      id: 'dim_customers',
      name: 'dim_customers',
      layer: 'marts',
      materialization: 'table',
      schema: 'marts',
      description: '고객 디멘션 테이블',
      sql: `WITH customers AS (
    SELECT * FROM {{ ref('stg_customers') }}
),

customer_orders AS (
    SELECT
        customer_id,
        COUNT(*) AS total_orders,
        SUM(order_total) AS lifetime_value,
        MIN(ordered_at) AS first_order_at,
        MAX(ordered_at) AS last_order_at
    FROM {{ ref('int_orders_enriched') }}
    GROUP BY customer_id
)

SELECT
    c.customer_id,
    c.customer_name,
    c.email,
    c.country_code,
    c.registered_at,
    COALESCE(co.total_orders, 0) AS total_orders,
    COALESCE(co.lifetime_value, 0) AS lifetime_value,
    co.first_order_at,
    co.last_order_at,
    CASE
        WHEN co.lifetime_value >= 1000 THEN 'VIP'
        WHEN co.lifetime_value >= 500 THEN 'Regular'
        ELSE 'New'
    END AS customer_segment
FROM customers c
LEFT JOIN customer_orders co ON c.customer_id = co.customer_id`,
      columns: [
        { name: 'customer_id', type: 'VARCHAR', tests: ['unique', 'not_null'] },
        { name: 'customer_name', type: 'VARCHAR' },
        { name: 'email', type: 'VARCHAR' },
        { name: 'country_code', type: 'VARCHAR' },
        { name: 'registered_at', type: 'TIMESTAMP' },
        { name: 'total_orders', type: 'INTEGER' },
        { name: 'lifetime_value', type: 'DECIMAL' },
        { name: 'first_order_at', type: 'TIMESTAMP' },
        { name: 'last_order_at', type: 'TIMESTAMP' },
        { name: 'customer_segment', type: 'VARCHAR' },
      ],
      depends_on: ['stg_customers', 'int_orders_enriched'],
      tests: [],
      tags: ['marts', 'core'],
    },
    {
      id: 'dim_products',
      name: 'dim_products',
      layer: 'marts',
      materialization: 'table',
      schema: 'marts',
      description: '상품 디멘션 테이블',
      sql: `WITH products AS (
    SELECT * FROM {{ ref('stg_products') }}
),

product_sales AS (
    SELECT
        product_id,
        COUNT(DISTINCT order_id) AS times_ordered,
        SUM(quantity) AS total_quantity_sold,
        SUM(line_total) AS total_revenue
    FROM {{ ref('int_order_items_enriched') }}
    GROUP BY product_id
)

SELECT
    p.product_id,
    p.product_name,
    p.category,
    p.unit_price,
    p.stock_quantity,
    COALESCE(ps.times_ordered, 0) AS times_ordered,
    COALESCE(ps.total_quantity_sold, 0) AS total_quantity_sold,
    COALESCE(ps.total_revenue, 0) AS total_revenue
FROM products p
LEFT JOIN product_sales ps ON p.product_id = ps.product_id`,
      columns: [
        { name: 'product_id', type: 'VARCHAR', tests: ['unique', 'not_null'] },
        { name: 'product_name', type: 'VARCHAR' },
        { name: 'category', type: 'VARCHAR' },
        { name: 'unit_price', type: 'DECIMAL' },
        { name: 'stock_quantity', type: 'INTEGER' },
        { name: 'times_ordered', type: 'INTEGER' },
        { name: 'total_quantity_sold', type: 'INTEGER' },
        { name: 'total_revenue', type: 'DECIMAL' },
      ],
      depends_on: ['stg_products', 'int_order_items_enriched'],
      tests: [],
      tags: ['marts', 'core'],
    },
    {
      id: 'rpt_daily_sales',
      name: 'rpt_daily_sales',
      layer: 'marts',
      materialization: 'incremental',
      schema: 'marts',
      description: '일별 매출 리포트 (증분 업데이트)',
      sql: `{{
    config(
        materialized='incremental',
        unique_key='order_date'
    )
}}

WITH daily_orders AS (
    SELECT
        order_date,
        COUNT(*) AS order_count,
        COUNT(DISTINCT customer_id) AS unique_customers,
        SUM(order_total) AS total_revenue,
        AVG(order_total) AS avg_order_value
    FROM {{ ref('fct_orders') }}
    {% if is_incremental() %}
    WHERE order_date > (SELECT MAX(order_date) FROM {{ this }})
    {% endif %}
    GROUP BY order_date
)

SELECT
    order_date,
    order_count,
    unique_customers,
    total_revenue,
    avg_order_value,
    CURRENT_TIMESTAMP AS updated_at
FROM daily_orders`,
      columns: [
        { name: 'order_date', type: 'DATE', tests: ['unique', 'not_null'] },
        { name: 'order_count', type: 'INTEGER' },
        { name: 'unique_customers', type: 'INTEGER' },
        { name: 'total_revenue', type: 'DECIMAL' },
        { name: 'avg_order_value', type: 'DECIMAL' },
        { name: 'updated_at', type: 'TIMESTAMP' },
      ],
      depends_on: ['fct_orders'],
      tests: [],
      tags: ['marts', 'reporting'],
    },
  ],
}

// 간단한 프로젝트 예제
export const simpleProject: DbtProject = {
  id: 'simple_analytics',
  name: 'Simple Analytics',
  description: '간단한 분석용 dbt 프로젝트 (학습용)',
  version: '1.0.0',
  sources: [
    {
      id: 'src_events',
      name: 'raw_events',
      database: 'analytics',
      schema: 'raw',
      tables: [
        { name: 'page_views', columns: ['event_id', 'user_id', 'page_url', 'timestamp'] },
        { name: 'users', columns: ['user_id', 'email', 'signup_date'] },
      ],
    },
  ],
  models: [
    {
      id: 'stg_page_views',
      name: 'stg_page_views',
      layer: 'staging',
      materialization: 'view',
      schema: 'staging',
      description: '페이지뷰 이벤트 정제',
      sql: `SELECT
    event_id,
    user_id,
    page_url,
    timestamp::TIMESTAMP AS viewed_at
FROM {{ source('raw_events', 'page_views') }}`,
      columns: [
        { name: 'event_id', type: 'VARCHAR', tests: ['unique'] },
        { name: 'user_id', type: 'VARCHAR' },
        { name: 'page_url', type: 'VARCHAR' },
        { name: 'viewed_at', type: 'TIMESTAMP' },
      ],
      depends_on: ['src_events'],
      tests: [],
    },
    {
      id: 'stg_users',
      name: 'stg_users',
      layer: 'staging',
      materialization: 'view',
      schema: 'staging',
      description: '사용자 데이터 정제',
      sql: `SELECT
    user_id,
    LOWER(email) AS email,
    signup_date::DATE AS signup_date
FROM {{ source('raw_events', 'users') }}`,
      columns: [
        { name: 'user_id', type: 'VARCHAR', tests: ['unique', 'not_null'] },
        { name: 'email', type: 'VARCHAR' },
        { name: 'signup_date', type: 'DATE' },
      ],
      depends_on: ['src_events'],
      tests: [],
    },
    {
      id: 'fct_user_activity',
      name: 'fct_user_activity',
      layer: 'marts',
      materialization: 'table',
      schema: 'marts',
      description: '사용자별 활동 요약',
      sql: `WITH page_views AS (
    SELECT * FROM {{ ref('stg_page_views') }}
),

users AS (
    SELECT * FROM {{ ref('stg_users') }}
)

SELECT
    u.user_id,
    u.email,
    u.signup_date,
    COUNT(pv.event_id) AS total_page_views,
    MIN(pv.viewed_at) AS first_activity,
    MAX(pv.viewed_at) AS last_activity
FROM users u
LEFT JOIN page_views pv ON u.user_id = pv.user_id
GROUP BY u.user_id, u.email, u.signup_date`,
      columns: [
        { name: 'user_id', type: 'VARCHAR', tests: ['unique'] },
        { name: 'email', type: 'VARCHAR' },
        { name: 'signup_date', type: 'DATE' },
        { name: 'total_page_views', type: 'INTEGER' },
        { name: 'first_activity', type: 'TIMESTAMP' },
        { name: 'last_activity', type: 'TIMESTAMP' },
      ],
      depends_on: ['stg_page_views', 'stg_users'],
      tests: [],
    },
  ],
}

export const sampleProjects: DbtProject[] = [ecommerceProject, simpleProject]

// dbt 명령어 설명
export const dbtCommands = [
  { command: 'dbt run', description: '모든 모델 실행 (빌드)' },
  { command: 'dbt run --select stg_*', description: 'staging 모델만 실행' },
  { command: 'dbt run --select +fct_orders', description: 'fct_orders와 모든 upstream 실행' },
  { command: 'dbt test', description: '모든 테스트 실행' },
  { command: 'dbt docs generate', description: '문서 생성' },
  { command: 'dbt deps', description: '패키지 의존성 설치' },
]

// Materialization 설명
export const materializationDescriptions = {
  view: '매번 쿼리 시 실행되는 가상 테이블. 저장 공간 절약, 항상 최신 데이터.',
  table: '물리적 테이블로 저장. 빠른 쿼리 성능, 저장 공간 필요.',
  incremental: '변경된 데이터만 추가/업데이트. 대용량 테이블에 적합.',
  ephemeral: 'CTE로 인라인 삽입. 재사용 로직에 적합, 물리적 저장 없음.',
}

// Layer 설명
export const layerDescriptions = {
  source: '원본 데이터 소스 (외부 시스템에서 추출)',
  staging: '데이터 정제 레이어 (타입 캐스팅, 리네이밍, 기본 필터링)',
  intermediate: '비즈니스 로직 레이어 (조인, 집계, 변환)',
  marts: '최종 분석 레이어 (팩트/디멘션 테이블, 리포트)',
}
