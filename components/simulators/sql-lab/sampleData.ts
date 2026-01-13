// SQL Lab 샘플 데이터 - E-Commerce 스키마

import { TableSchema, SampleQuery } from './types'

// 스키마 정보
export const tableSchemas: TableSchema[] = [
  {
    name: 'customers',
    description: '고객 정보 테이블',
    rowCount: 100,
    columns: [
      { name: 'customer_id', type: 'INTEGER', nullable: false, description: '고객 ID (PK)' },
      { name: 'name', type: 'VARCHAR', nullable: false, description: '고객명' },
      { name: 'email', type: 'VARCHAR', nullable: false, description: '이메일' },
      { name: 'city', type: 'VARCHAR', nullable: true, description: '도시' },
      { name: 'country', type: 'VARCHAR', nullable: true, description: '국가' },
      { name: 'signup_date', type: 'DATE', nullable: false, description: '가입일' },
      { name: 'tier', type: 'VARCHAR', nullable: true, description: '등급 (Bronze/Silver/Gold/Platinum)' },
    ],
  },
  {
    name: 'products',
    description: '상품 정보 테이블',
    rowCount: 50,
    columns: [
      { name: 'product_id', type: 'INTEGER', nullable: false, description: '상품 ID (PK)' },
      { name: 'name', type: 'VARCHAR', nullable: false, description: '상품명' },
      { name: 'category', type: 'VARCHAR', nullable: false, description: '카테고리' },
      { name: 'price', type: 'DECIMAL', nullable: false, description: '가격' },
      { name: 'stock', type: 'INTEGER', nullable: false, description: '재고 수량' },
      { name: 'supplier_id', type: 'INTEGER', nullable: true, description: '공급업체 ID (FK)' },
    ],
  },
  {
    name: 'orders',
    description: '주문 정보 테이블',
    rowCount: 500,
    columns: [
      { name: 'order_id', type: 'INTEGER', nullable: false, description: '주문 ID (PK)' },
      { name: 'customer_id', type: 'INTEGER', nullable: false, description: '고객 ID (FK)' },
      { name: 'order_date', type: 'DATE', nullable: false, description: '주문일' },
      { name: 'status', type: 'VARCHAR', nullable: false, description: '상태 (pending/shipped/delivered/cancelled)' },
      { name: 'total_amount', type: 'DECIMAL', nullable: false, description: '총 금액' },
    ],
  },
  {
    name: 'order_items',
    description: '주문 상세 테이블',
    rowCount: 1500,
    columns: [
      { name: 'item_id', type: 'INTEGER', nullable: false, description: '항목 ID (PK)' },
      { name: 'order_id', type: 'INTEGER', nullable: false, description: '주문 ID (FK)' },
      { name: 'product_id', type: 'INTEGER', nullable: false, description: '상품 ID (FK)' },
      { name: 'quantity', type: 'INTEGER', nullable: false, description: '수량' },
      { name: 'unit_price', type: 'DECIMAL', nullable: false, description: '단가' },
    ],
  },
  {
    name: 'suppliers',
    description: '공급업체 정보 테이블',
    rowCount: 20,
    columns: [
      { name: 'supplier_id', type: 'INTEGER', nullable: false, description: '공급업체 ID (PK)' },
      { name: 'name', type: 'VARCHAR', nullable: false, description: '업체명' },
      { name: 'contact', type: 'VARCHAR', nullable: true, description: '연락처' },
      { name: 'country', type: 'VARCHAR', nullable: true, description: '국가' },
    ],
  },
]

// 샘플 쿼리
export const sampleQueries: SampleQuery[] = [
  // Basic
  {
    id: 'basic-1',
    title: '전체 고객 조회',
    description: 'customers 테이블의 모든 데이터 조회',
    query: 'SELECT * FROM customers LIMIT 10;',
    category: 'basic',
    difficulty: 'beginner',
  },
  {
    id: 'basic-2',
    title: '조건 필터링',
    description: 'Gold 등급 이상 고객만 조회',
    query: `SELECT name, email, tier, city
FROM customers
WHERE tier IN ('Gold', 'Platinum')
ORDER BY name;`,
    category: 'basic',
    difficulty: 'beginner',
  },
  {
    id: 'basic-3',
    title: '정렬과 제한',
    description: '가격이 높은 상위 10개 상품',
    query: `SELECT name, category, price, stock
FROM products
ORDER BY price DESC
LIMIT 10;`,
    category: 'basic',
    difficulty: 'beginner',
  },

  // Aggregate
  {
    id: 'agg-1',
    title: '그룹별 집계',
    description: '카테고리별 상품 수와 평균 가격',
    query: `SELECT
  category,
  COUNT(*) as product_count,
  ROUND(AVG(price), 2) as avg_price,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM products
GROUP BY category
ORDER BY product_count DESC;`,
    category: 'aggregate',
    difficulty: 'beginner',
  },
  {
    id: 'agg-2',
    title: 'HAVING 절',
    description: '주문 5건 이상인 고객',
    query: `SELECT
  c.name,
  COUNT(o.order_id) as order_count,
  SUM(o.total_amount) as total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name
HAVING COUNT(o.order_id) >= 5
ORDER BY total_spent DESC;`,
    category: 'aggregate',
    difficulty: 'intermediate',
  },

  // JOIN
  {
    id: 'join-1',
    title: 'INNER JOIN',
    description: '고객별 주문 내역 조회',
    query: `SELECT
  c.name as customer_name,
  o.order_id,
  o.order_date,
  o.status,
  o.total_amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
ORDER BY o.order_date DESC
LIMIT 20;`,
    category: 'join',
    difficulty: 'beginner',
  },
  {
    id: 'join-2',
    title: 'Multiple JOINs',
    description: '주문 상세 정보 (고객-주문-상품)',
    query: `SELECT
  c.name as customer,
  o.order_id,
  p.name as product,
  oi.quantity,
  oi.unit_price,
  (oi.quantity * oi.unit_price) as subtotal
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
ORDER BY o.order_date DESC
LIMIT 15;`,
    category: 'join',
    difficulty: 'intermediate',
  },
  {
    id: 'join-3',
    title: 'LEFT JOIN',
    description: '주문이 없는 고객 포함 전체 조회',
    query: `SELECT
  c.name,
  c.tier,
  COUNT(o.order_id) as order_count,
  COALESCE(SUM(o.total_amount), 0) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.tier
ORDER BY total_spent DESC;`,
    category: 'join',
    difficulty: 'intermediate',
  },

  // Window Functions
  {
    id: 'window-1',
    title: 'ROW_NUMBER',
    description: '카테고리별 가격 순위',
    query: `SELECT
  name,
  category,
  price,
  ROW_NUMBER() OVER (
    PARTITION BY category
    ORDER BY price DESC
  ) as price_rank
FROM products;`,
    category: 'window',
    difficulty: 'intermediate',
  },
  {
    id: 'window-2',
    title: 'RANK vs DENSE_RANK',
    description: '고객 지출액 순위 비교',
    query: `WITH customer_spending AS (
  SELECT
    c.customer_id,
    c.name,
    SUM(o.total_amount) as total_spent
  FROM customers c
  JOIN orders o ON c.customer_id = o.customer_id
  GROUP BY c.customer_id, c.name
)
SELECT
  name,
  total_spent,
  RANK() OVER (ORDER BY total_spent DESC) as rank,
  DENSE_RANK() OVER (ORDER BY total_spent DESC) as dense_rank,
  ROW_NUMBER() OVER (ORDER BY total_spent DESC) as row_num
FROM customer_spending
LIMIT 15;`,
    category: 'window',
    difficulty: 'advanced',
  },
  {
    id: 'window-3',
    title: '누적 합계 (Running Total)',
    description: '일별 매출 누적 합계',
    query: `SELECT
  order_date,
  SUM(total_amount) as daily_sales,
  SUM(SUM(total_amount)) OVER (
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) as running_total
FROM orders
WHERE status != 'cancelled'
GROUP BY order_date
ORDER BY order_date;`,
    category: 'window',
    difficulty: 'advanced',
  },
  {
    id: 'window-4',
    title: 'LAG/LEAD',
    description: '전일 대비 매출 변화',
    query: `WITH daily_sales AS (
  SELECT
    order_date,
    SUM(total_amount) as sales
  FROM orders
  WHERE status != 'cancelled'
  GROUP BY order_date
)
SELECT
  order_date,
  sales,
  LAG(sales, 1) OVER (ORDER BY order_date) as prev_day_sales,
  ROUND(
    (sales - LAG(sales, 1) OVER (ORDER BY order_date)) /
    LAG(sales, 1) OVER (ORDER BY order_date) * 100,
    2
  ) as growth_pct
FROM daily_sales
ORDER BY order_date;`,
    category: 'window',
    difficulty: 'advanced',
  },

  // CTE
  {
    id: 'cte-1',
    title: 'Basic CTE',
    description: 'CTE로 고가치 고객 분석',
    query: `WITH high_value_customers AS (
  SELECT
    c.customer_id,
    c.name,
    c.tier,
    SUM(o.total_amount) as lifetime_value
  FROM customers c
  JOIN orders o ON c.customer_id = o.customer_id
  WHERE o.status = 'delivered'
  GROUP BY c.customer_id, c.name, c.tier
  HAVING SUM(o.total_amount) > 1000
)
SELECT
  tier,
  COUNT(*) as customer_count,
  ROUND(AVG(lifetime_value), 2) as avg_ltv
FROM high_value_customers
GROUP BY tier
ORDER BY avg_ltv DESC;`,
    category: 'cte',
    difficulty: 'intermediate',
  },
  {
    id: 'cte-2',
    title: 'Multiple CTEs',
    description: '복수 CTE 활용 - 상품 성과 분석',
    query: `WITH product_sales AS (
  SELECT
    p.product_id,
    p.name,
    p.category,
    SUM(oi.quantity) as units_sold,
    SUM(oi.quantity * oi.unit_price) as revenue
  FROM products p
  JOIN order_items oi ON p.product_id = oi.product_id
  GROUP BY p.product_id, p.name, p.category
),
category_avg AS (
  SELECT
    category,
    AVG(revenue) as avg_revenue
  FROM product_sales
  GROUP BY category
)
SELECT
  ps.name,
  ps.category,
  ps.units_sold,
  ps.revenue,
  ca.avg_revenue as category_avg,
  CASE
    WHEN ps.revenue > ca.avg_revenue THEN 'Above Average'
    ELSE 'Below Average'
  END as performance
FROM product_sales ps
JOIN category_avg ca ON ps.category = ca.category
ORDER BY ps.revenue DESC;`,
    category: 'cte',
    difficulty: 'advanced',
  },

  // Subquery
  {
    id: 'sub-1',
    title: '스칼라 서브쿼리',
    description: '평균 이상 가격 상품 조회',
    query: `SELECT name, category, price
FROM products
WHERE price > (SELECT AVG(price) FROM products)
ORDER BY price DESC;`,
    category: 'subquery',
    difficulty: 'intermediate',
  },
  {
    id: 'sub-2',
    title: 'EXISTS 서브쿼리',
    description: '주문 이력이 있는 고객만 조회',
    query: `SELECT c.name, c.email, c.tier
FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.customer_id
  AND o.status = 'delivered'
)
ORDER BY c.name;`,
    category: 'subquery',
    difficulty: 'intermediate',
  },
  {
    id: 'sub-3',
    title: 'IN 서브쿼리',
    description: '베스트셀러 상품 구매 고객',
    query: `SELECT DISTINCT c.name, c.tier
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
WHERE oi.product_id IN (
  SELECT product_id
  FROM order_items
  GROUP BY product_id
  ORDER BY SUM(quantity) DESC
  LIMIT 5
);`,
    category: 'subquery',
    difficulty: 'advanced',
  },
]

// DDL 및 초기 데이터 SQL
export const initSQL = `
-- 테이블 생성
CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id INTEGER PRIMARY KEY,
  name VARCHAR NOT NULL,
  contact VARCHAR,
  country VARCHAR
);

CREATE TABLE IF NOT EXISTS customers (
  customer_id INTEGER PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  city VARCHAR,
  country VARCHAR,
  signup_date DATE NOT NULL,
  tier VARCHAR
);

CREATE TABLE IF NOT EXISTS products (
  product_id INTEGER PRIMARY KEY,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  price DECIMAL NOT NULL,
  stock INTEGER NOT NULL,
  supplier_id INTEGER REFERENCES suppliers(supplier_id)
);

CREATE TABLE IF NOT EXISTS orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
  order_date DATE NOT NULL,
  status VARCHAR NOT NULL,
  total_amount DECIMAL NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  item_id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(order_id),
  product_id INTEGER NOT NULL REFERENCES products(product_id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL NOT NULL
);

-- 공급업체 데이터
INSERT INTO suppliers VALUES
(1, 'TechSupply Co.', '02-1234-5678', 'Korea'),
(2, 'GlobalParts Inc.', '+1-555-1234', 'USA'),
(3, 'EuroComponents', '+44-20-7123-4567', 'UK'),
(4, 'AsiaManufacturing', '+86-21-1234-5678', 'China'),
(5, 'NordicTech', '+46-8-123-4567', 'Sweden'),
(6, 'Pacific Goods', '+61-2-9876-5432', 'Australia'),
(7, 'MexiParts SA', '+52-55-1234-5678', 'Mexico'),
(8, 'IndiaSource', '+91-11-2345-6789', 'India'),
(9, 'BrasilTech', '+55-11-1234-5678', 'Brazil'),
(10, 'JapanElectronics', '+81-3-1234-5678', 'Japan');

-- 고객 데이터 (100명)
INSERT INTO customers VALUES
(1, 'Kim Minsu', 'minsu.kim@email.com', 'Seoul', 'Korea', '2023-01-15', 'Gold'),
(2, 'Lee Jiyoung', 'jiyoung.lee@email.com', 'Busan', 'Korea', '2023-02-20', 'Silver'),
(3, 'Park Junhyuk', 'junhyuk.park@email.com', 'Seoul', 'Korea', '2023-03-10', 'Platinum'),
(4, 'Choi Yuna', 'yuna.choi@email.com', 'Incheon', 'Korea', '2023-04-05', 'Bronze'),
(5, 'John Smith', 'john.smith@email.com', 'New York', 'USA', '2023-05-12', 'Gold'),
(6, 'Emma Wilson', 'emma.wilson@email.com', 'Los Angeles', 'USA', '2023-06-18', 'Silver'),
(7, 'Michael Brown', 'michael.brown@email.com', 'Chicago', 'USA', '2023-07-22', 'Bronze'),
(8, 'Sarah Davis', 'sarah.davis@email.com', 'Houston', 'USA', '2023-08-30', 'Gold'),
(9, 'James Johnson', 'james.johnson@email.com', 'Phoenix', 'USA', '2023-09-14', 'Platinum'),
(10, 'Jennifer Miller', 'jennifer.miller@email.com', 'Philadelphia', 'USA', '2023-10-25', 'Silver'),
(11, 'David Anderson', 'david.anderson@email.com', 'San Diego', 'USA', '2023-01-08', 'Bronze'),
(12, 'Lisa Taylor', 'lisa.taylor@email.com', 'Dallas', 'USA', '2023-02-14', 'Gold'),
(13, 'Robert Thomas', 'robert.thomas@email.com', 'San Jose', 'USA', '2023-03-21', 'Silver'),
(14, 'Maria Garcia', 'maria.garcia@email.com', 'Austin', 'USA', '2023-04-17', 'Platinum'),
(15, 'William Martinez', 'william.martinez@email.com', 'Denver', 'USA', '2023-05-28', 'Bronze'),
(16, 'Tanaka Yuki', 'yuki.tanaka@email.com', 'Tokyo', 'Japan', '2023-06-09', 'Gold'),
(17, 'Suzuki Kenji', 'kenji.suzuki@email.com', 'Osaka', 'Japan', '2023-07-15', 'Silver'),
(18, 'Yamamoto Sakura', 'sakura.yamamoto@email.com', 'Kyoto', 'Japan', '2023-08-22', 'Bronze'),
(19, 'Wei Chen', 'chen.wei@email.com', 'Shanghai', 'China', '2023-09-05', 'Platinum'),
(20, 'Li Ming', 'ming.li@email.com', 'Beijing', 'China', '2023-10-11', 'Gold'),
(21, 'Zhang Wei', 'wei.zhang@email.com', 'Guangzhou', 'China', '2023-11-18', 'Silver'),
(22, 'Hans Mueller', 'hans.mueller@email.com', 'Berlin', 'Germany', '2023-01-25', 'Bronze'),
(23, 'Anna Schmidt', 'anna.schmidt@email.com', 'Munich', 'Germany', '2023-02-08', 'Gold'),
(24, 'Pierre Dubois', 'pierre.dubois@email.com', 'Paris', 'France', '2023-03-14', 'Platinum'),
(25, 'Marie Leroy', 'marie.leroy@email.com', 'Lyon', 'France', '2023-04-20', 'Silver'),
(26, 'Marco Rossi', 'marco.rossi@email.com', 'Rome', 'Italy', '2023-05-27', 'Bronze'),
(27, 'Giulia Bianchi', 'giulia.bianchi@email.com', 'Milan', 'Italy', '2023-06-12', 'Gold'),
(28, 'Carlos Rodriguez', 'carlos.rodriguez@email.com', 'Madrid', 'Spain', '2023-07-19', 'Silver'),
(29, 'Sofia Lopez', 'sofia.lopez@email.com', 'Barcelona', 'Spain', '2023-08-25', 'Platinum'),
(30, 'Kang Jihoon', 'jihoon.kang@email.com', 'Daejeon', 'Korea', '2023-09-30', 'Bronze'),
(31, 'Yoon Seoyeon', 'seoyeon.yoon@email.com', 'Daegu', 'Korea', '2023-10-15', 'Gold'),
(32, 'Jang Minho', 'minho.jang@email.com', 'Gwangju', 'Korea', '2023-11-22', 'Silver'),
(33, 'Shin Hayeon', 'hayeon.shin@email.com', 'Ulsan', 'Korea', '2023-12-05', 'Bronze'),
(34, 'Hwang Donghyun', 'donghyun.hwang@email.com', 'Suwon', 'Korea', '2023-01-18', 'Platinum'),
(35, 'Lim Eunji', 'eunji.lim@email.com', 'Seongnam', 'Korea', '2023-02-24', 'Gold'),
(36, 'Ko Taehyung', 'taehyung.ko@email.com', 'Goyang', 'Korea', '2023-03-30', 'Silver'),
(37, 'Seo Minji', 'minji.seo@email.com', 'Bucheon', 'Korea', '2023-04-08', 'Bronze'),
(38, 'Baek Jiwoo', 'jiwoo.baek@email.com', 'Ansan', 'Korea', '2023-05-15', 'Gold'),
(39, 'Nam Hyemin', 'hyemin.nam@email.com', 'Changwon', 'Korea', '2023-06-21', 'Silver'),
(40, 'Kwon Sunghoon', 'sunghoon.kwon@email.com', 'Yongin', 'Korea', '2023-07-28', 'Platinum'),
(41, 'Oh Jieun', 'jieun.oh@email.com', 'Jeonju', 'Korea', '2023-08-04', 'Bronze'),
(42, 'Ryu Daeun', 'daeun.ryu@email.com', 'Cheongju', 'Korea', '2023-09-11', 'Gold'),
(43, 'Moon Sihyun', 'sihyun.moon@email.com', 'Pohang', 'Korea', '2023-10-17', 'Silver'),
(44, 'Song Yeji', 'yeji.song@email.com', 'Jeju', 'Korea', '2023-11-24', 'Bronze'),
(45, 'Ahn Junwoo', 'junwoo.ahn@email.com', 'Gimhae', 'Korea', '2023-12-01', 'Gold'),
(46, 'Oliver Williams', 'oliver.williams@email.com', 'London', 'UK', '2023-01-07', 'Platinum'),
(47, 'Charlotte Jones', 'charlotte.jones@email.com', 'Manchester', 'UK', '2023-02-13', 'Silver'),
(48, 'Harry Brown', 'harry.brown@email.com', 'Birmingham', 'UK', '2023-03-19', 'Bronze'),
(49, 'Amelia Taylor', 'amelia.taylor@email.com', 'Glasgow', 'UK', '2023-04-26', 'Gold'),
(50, 'George Wilson', 'george.wilson@email.com', 'Liverpool', 'UK', '2023-05-02', 'Silver'),
(51, 'Emily Davis', 'emily.davis@email.com', 'Edinburgh', 'UK', '2023-06-08', 'Bronze'),
(52, 'Jack Thomas', 'jack.thomas@email.com', 'Bristol', 'UK', '2023-07-14', 'Platinum'),
(53, 'Sophia Moore', 'sophia.moore@email.com', 'Leeds', 'UK', '2023-08-21', 'Gold'),
(54, 'Lucas Martin', 'lucas.martin@email.com', 'Marseille', 'France', '2023-09-27', 'Silver'),
(55, 'Camille Bernard', 'camille.bernard@email.com', 'Toulouse', 'France', '2023-10-03', 'Bronze'),
(56, 'Hugo Robert', 'hugo.robert@email.com', 'Nice', 'France', '2023-11-09', 'Gold'),
(57, 'Lea Petit', 'lea.petit@email.com', 'Nantes', 'France', '2023-12-16', 'Silver'),
(58, 'Luis Sanchez', 'luis.sanchez@email.com', 'Valencia', 'Spain', '2023-01-22', 'Platinum'),
(59, 'Carmen Fernandez', 'carmen.fernandez@email.com', 'Seville', 'Spain', '2023-02-28', 'Bronze'),
(60, 'Diego Torres', 'diego.torres@email.com', 'Bilbao', 'Spain', '2023-03-06', 'Gold'),
(61, 'Alessia Romano', 'alessia.romano@email.com', 'Naples', 'Italy', '2023-04-12', 'Silver'),
(62, 'Luca Ferrari', 'luca.ferrari@email.com', 'Turin', 'Italy', '2023-05-19', 'Bronze'),
(63, 'Elisa Conti', 'elisa.conti@email.com', 'Florence', 'Italy', '2023-06-25', 'Gold'),
(64, 'Matteo Ricci', 'matteo.ricci@email.com', 'Bologna', 'Italy', '2023-07-01', 'Platinum'),
(65, 'Felix Weber', 'felix.weber@email.com', 'Hamburg', 'Germany', '2023-08-07', 'Silver'),
(66, 'Lena Becker', 'lena.becker@email.com', 'Frankfurt', 'Germany', '2023-09-13', 'Bronze'),
(67, 'Maximilian Koch', 'maximilian.koch@email.com', 'Stuttgart', 'Germany', '2023-10-20', 'Gold'),
(68, 'Sato Haruki', 'haruki.sato@email.com', 'Nagoya', 'Japan', '2023-11-26', 'Silver'),
(69, 'Takahashi Aoi', 'aoi.takahashi@email.com', 'Fukuoka', 'Japan', '2023-12-02', 'Bronze'),
(70, 'Watanabe Yui', 'yui.watanabe@email.com', 'Sapporo', 'Japan', '2023-01-28', 'Platinum'),
(71, 'Ito Ren', 'ren.ito@email.com', 'Kobe', 'Japan', '2023-02-03', 'Gold'),
(72, 'Wang Fang', 'fang.wang@email.com', 'Shenzhen', 'China', '2023-03-09', 'Silver'),
(73, 'Liu Yang', 'yang.liu@email.com', 'Hangzhou', 'China', '2023-04-15', 'Bronze'),
(74, 'Chen Hui', 'hui.chen@email.com', 'Chengdu', 'China', '2023-05-22', 'Gold'),
(75, 'Huang Jun', 'jun.huang@email.com', 'Xian', 'China', '2023-06-28', 'Silver'),
(76, 'Raj Sharma', 'raj.sharma@email.com', 'Mumbai', 'India', '2023-07-04', 'Platinum'),
(77, 'Priya Patel', 'priya.patel@email.com', 'Delhi', 'India', '2023-08-10', 'Bronze'),
(78, 'Amit Singh', 'amit.singh@email.com', 'Bangalore', 'India', '2023-09-16', 'Gold'),
(79, 'Neha Gupta', 'neha.gupta@email.com', 'Chennai', 'India', '2023-10-23', 'Silver'),
(80, 'Vikram Kumar', 'vikram.kumar@email.com', 'Hyderabad', 'India', '2023-11-29', 'Bronze'),
(81, 'Pedro Silva', 'pedro.silva@email.com', 'Sao Paulo', 'Brazil', '2023-12-05', 'Gold'),
(82, 'Ana Costa', 'ana.costa@email.com', 'Rio de Janeiro', 'Brazil', '2023-01-11', 'Platinum'),
(83, 'Lucas Santos', 'lucas.santos@email.com', 'Brasilia', 'Brazil', '2023-02-17', 'Silver'),
(84, 'Julia Oliveira', 'julia.oliveira@email.com', 'Salvador', 'Brazil', '2023-03-24', 'Bronze'),
(85, 'Lars Eriksson', 'lars.eriksson@email.com', 'Stockholm', 'Sweden', '2023-04-30', 'Gold'),
(86, 'Emma Johansson', 'emma.johansson@email.com', 'Gothenburg', 'Sweden', '2023-05-06', 'Silver'),
(87, 'Erik Lindqvist', 'erik.lindqvist@email.com', 'Malmo', 'Sweden', '2023-06-12', 'Bronze'),
(88, 'Mia Andersson', 'mia.andersson@email.com', 'Uppsala', 'Sweden', '2023-07-18', 'Platinum'),
(89, 'Noah Svensson', 'noah.svensson@email.com', 'Orebro', 'Sweden', '2023-08-24', 'Gold'),
(90, 'James Cooper', 'james.cooper@email.com', 'Sydney', 'Australia', '2023-09-30', 'Silver'),
(91, 'Olivia Mitchell', 'olivia.mitchell@email.com', 'Melbourne', 'Australia', '2023-10-06', 'Bronze'),
(92, 'William Turner', 'william.turner@email.com', 'Brisbane', 'Australia', '2023-11-12', 'Gold'),
(93, 'Ava Phillips', 'ava.phillips@email.com', 'Perth', 'Australia', '2023-12-18', 'Silver'),
(94, 'Benjamin Clark', 'benjamin.clark@email.com', 'Adelaide', 'Australia', '2023-01-24', 'Platinum'),
(95, 'Isabella Hall', 'isabella.hall@email.com', 'Auckland', 'New Zealand', '2023-02-01', 'Bronze'),
(96, 'Ethan Young', 'ethan.young@email.com', 'Wellington', 'New Zealand', '2023-03-07', 'Gold'),
(97, 'Mia King', 'mia.king@email.com', 'Christchurch', 'New Zealand', '2023-04-13', 'Silver'),
(98, 'Alexander Wright', 'alexander.wright@email.com', 'Toronto', 'Canada', '2023-05-19', 'Bronze'),
(99, 'Chloe Scott', 'chloe.scott@email.com', 'Vancouver', 'Canada', '2023-06-25', 'Gold'),
(100, 'Daniel Lee', 'daniel.lee@email.com', 'Montreal', 'Canada', '2023-07-31', 'Platinum');

-- 상품 데이터 (50개)
INSERT INTO products VALUES
(1, 'Ultra HD Smart TV 65"', 'Electronics', 1299.99, 45, 1),
(2, 'Wireless Noise-Canceling Headphones', 'Electronics', 349.99, 120, 2),
(3, 'Premium Laptop Pro 16"', 'Electronics', 2499.99, 30, 1),
(4, 'Smartphone X Pro Max', 'Electronics', 1199.99, 80, 4),
(5, 'Bluetooth Speaker System', 'Electronics', 199.99, 200, 2),
(6, 'Gaming Console Next Gen', 'Electronics', 499.99, 55, 10),
(7, 'Wireless Earbuds Pro', 'Electronics', 249.99, 150, 1),
(8, 'Tablet Air 11"', 'Electronics', 799.99, 70, 4),
(9, 'Smart Watch Series 8', 'Electronics', 399.99, 90, 1),
(10, '4K Action Camera', 'Electronics', 299.99, 85, 2),
(11, 'Running Shoes Pro', 'Sports', 159.99, 300, 3),
(12, 'Yoga Mat Premium', 'Sports', 49.99, 500, 6),
(13, 'Mountain Bike X500', 'Sports', 899.99, 25, 3),
(14, 'Tennis Racket Carbon', 'Sports', 249.99, 60, 3),
(15, 'Swimming Goggles HD', 'Sports', 39.99, 200, 6),
(16, 'Basketball Official', 'Sports', 29.99, 150, 7),
(17, 'Golf Club Set Pro', 'Sports', 1499.99, 15, 3),
(18, 'Fitness Tracker Band', 'Sports', 79.99, 180, 1),
(19, 'Camping Tent 4-Person', 'Sports', 299.99, 40, 6),
(20, 'Hiking Backpack 50L', 'Sports', 129.99, 75, 6),
(21, 'Organic Green Tea', 'Food', 24.99, 400, 8),
(22, 'Premium Coffee Beans', 'Food', 34.99, 350, 9),
(23, 'Dark Chocolate Collection', 'Food', 19.99, 250, 5),
(24, 'Olive Oil Extra Virgin', 'Food', 29.99, 180, 3),
(25, 'Honey Raw Organic', 'Food', 14.99, 220, 6),
(26, 'Protein Powder Vanilla', 'Food', 59.99, 100, 2),
(27, 'Energy Bar Variety Pack', 'Food', 39.99, 300, 7),
(28, 'Dried Mango Slices', 'Food', 12.99, 450, 8),
(29, 'Mixed Nuts Premium', 'Food', 27.99, 280, 8),
(30, 'Sparkling Water 24-Pack', 'Food', 18.99, 500, 9),
(31, 'Cotton T-Shirt Classic', 'Clothing', 29.99, 400, 4),
(32, 'Denim Jeans Slim Fit', 'Clothing', 79.99, 200, 4),
(33, 'Winter Jacket Down', 'Clothing', 249.99, 80, 5),
(34, 'Sneakers Urban Style', 'Clothing', 119.99, 150, 4),
(35, 'Wool Sweater Merino', 'Clothing', 149.99, 90, 5),
(36, 'Silk Scarf Designer', 'Clothing', 89.99, 60, 3),
(37, 'Leather Belt Premium', 'Clothing', 69.99, 120, 3),
(38, 'Sunglasses Polarized', 'Clothing', 159.99, 100, 3),
(39, 'Dress Shirt Formal', 'Clothing', 89.99, 140, 4),
(40, 'Sports Shorts Quick-Dry', 'Clothing', 44.99, 220, 4),
(41, 'Stainless Steel Cookware Set', 'Home', 399.99, 35, 10),
(42, 'Memory Foam Pillow', 'Home', 79.99, 180, 4),
(43, 'Robot Vacuum Cleaner', 'Home', 599.99, 40, 10),
(44, 'Air Purifier HEPA', 'Home', 299.99, 55, 10),
(45, 'Smart Thermostat', 'Home', 249.99, 65, 2),
(46, 'LED Desk Lamp', 'Home', 59.99, 200, 4),
(47, 'Espresso Machine', 'Home', 449.99, 30, 3),
(48, 'Electric Kettle Glass', 'Home', 49.99, 150, 10),
(49, 'Blender High-Power', 'Home', 199.99, 70, 2),
(50, 'Weighted Blanket', 'Home', 129.99, 90, 4);
`

// 주문 생성 SQL (동적 생성)
export const generateOrdersSQL = (): string => {
  const statuses = ['pending', 'shipped', 'delivered', 'cancelled']
  const orders: string[] = []
  const orderItems: string[] = []

  let itemId = 1

  for (let orderId = 1; orderId <= 500; orderId++) {
    const customerId = Math.floor(Math.random() * 100) + 1
    const year = 2023 + Math.floor(Math.random() * 2)
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
    const orderDate = `${year}-${month}-${day}`
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    // 각 주문당 1-5개 상품
    const itemCount = Math.floor(Math.random() * 5) + 1
    let totalAmount = 0

    const usedProducts = new Set<number>()
    for (let i = 0; i < itemCount; i++) {
      let productId: number
      do {
        productId = Math.floor(Math.random() * 50) + 1
      } while (usedProducts.has(productId))
      usedProducts.add(productId)

      const quantity = Math.floor(Math.random() * 3) + 1
      // 가격은 products 테이블 기준으로 대략 추정
      const unitPrice = [29.99, 49.99, 79.99, 99.99, 149.99, 199.99, 299.99, 399.99][
        Math.floor(Math.random() * 8)
      ]
      totalAmount += quantity * unitPrice

      orderItems.push(`(${itemId}, ${orderId}, ${productId}, ${quantity}, ${unitPrice})`)
      itemId++
    }

    orders.push(
      `(${orderId}, ${customerId}, '${orderDate}', '${status}', ${totalAmount.toFixed(2)})`
    )
  }

  return `
INSERT INTO orders VALUES
${orders.join(',\n')};

INSERT INTO order_items VALUES
${orderItems.join(',\n')};
`
}
