// Day 2: 윈도우 함수 심화 (누적합, 이동평균, NTILE)
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'w3d2-video-frame',
    type: 'video',
    title: '윈도우 프레임의 이해',
    duration: 15,
    access: 'core',
    content: {
      objectives: [
        'ROWS와 RANGE의 차이점 이해',
        'UNBOUNDED PRECEDING, CURRENT ROW, UNBOUNDED FOLLOWING 개념',
        '프레임 절의 실전 활용법'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=yxCHMFRn9j0',
      transcript: `## 윈도우 프레임이란?

윈도우 프레임(Frame)은 계산에 포함될 행의 범위를 정의합니다.

### 프레임 없이는 불가능한 것들
- 누적 합계: 처음부터 현재까지
- 이동 평균: 최근 N개 행만
- 전체 합계: 모든 행

### 프레임 구문
\`\`\`sql
{ ROWS | RANGE | GROUPS }
BETWEEN frame_start AND frame_end
\`\`\`

### 프레임 경계 옵션
- UNBOUNDED PRECEDING: 파티션 첫 행
- n PRECEDING: n행 이전
- CURRENT ROW: 현재 행
- n FOLLOWING: n행 이후
- UNBOUNDED FOLLOWING: 파티션 마지막 행`,
      keyPoints: [
        '프레임 = 윈도우 함수 계산에 포함될 행의 범위',
        'ROWS: 물리적 행 수 기준',
        'RANGE: 논리적 값 범위 기준',
        '기본값: RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW'
      ]
    }
  },
  {
    id: 'w3d2-reading-frame-syntax',
    type: 'reading',
    title: '프레임 절 문법 완전 정복',
    duration: 25,
    access: 'core',
    content: {
      markdown: `# 프레임 절 문법 완전 정복

## 프레임 절 기본 구문

\`\`\`sql
함수() OVER (
    [PARTITION BY ...]
    [ORDER BY ...]
    [frame_clause]
)

-- frame_clause 구문
{ ROWS | RANGE | GROUPS }
BETWEEN frame_start AND frame_end
\`\`\`

## 프레임 경계 옵션

| 경계 | 설명 |
|------|------|
| UNBOUNDED PRECEDING | 파티션의 첫 번째 행 |
| n PRECEDING | 현재 행에서 n행 이전 |
| CURRENT ROW | 현재 행 |
| n FOLLOWING | 현재 행에서 n행 이후 |
| UNBOUNDED FOLLOWING | 파티션의 마지막 행 |

## 대표적인 프레임 패턴

### 1. 누적 합계 (Running Total)
\`\`\`sql
SUM(amount) OVER (
    ORDER BY date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
)
\`\`\`

### 2. 전체 합계
\`\`\`sql
SUM(amount) OVER (
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
\`\`\`

### 3. 이동 평균 (최근 3개)
\`\`\`sql
AVG(price) OVER (
    ORDER BY date
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
)
\`\`\`

## ROWS vs RANGE

- **ROWS**: 물리적 행 수 기준 (동일 값이어도 별개 행)
- **RANGE**: 논리적 값 범위 기준 (동일 값은 같은 그룹)

## 주의사항

1. **ORDER BY 없이 집계 함수**: 전체 파티션 집계
2. **ORDER BY 있으면 기본 프레임 적용**: RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`,
      externalLinks: [
        {
          title: 'PostgreSQL Window Frame',
          url: 'https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS'
        }
      ]
    }
  },
  {
    id: 'w3d2-code-running-total',
    type: 'code',
    title: '실습: 누적 합계 (Running Total)',
    duration: 25,
    access: 'core',
    content: {
      instructions: `누적 합계는 가장 기본적인 윈도우 함수 활용입니다.

**문제 1**: 전체 매출 누적 합계
**문제 2**: 제품별 누적 매출 (PARTITION BY 사용)
**문제 3**: 제품별 + 전체 누적 비교
**문제 4**: 누적 매출 비율 계산`,
      starterCode: `CREATE TEMP TABLE monthly_sales (
    month DATE,
    product VARCHAR(50),
    revenue DECIMAL(10,2)
);

INSERT INTO monthly_sales VALUES
('2024-01-01', 'Product A', 1000),
('2024-02-01', 'Product A', 1500),
('2024-03-01', 'Product A', 1200),
('2024-04-01', 'Product A', 1800),
('2024-01-01', 'Product B', 800),
('2024-02-01', 'Product B', 900),
('2024-03-01', 'Product B', 1100),
('2024-04-01', 'Product B', 1000);

-- 문제 1: 전체 매출 누적 합계


-- 문제 2: 제품별 누적 매출


-- 문제 3: 제품별 + 전체 누적 비교


-- 문제 4: 누적 매출 비율
`,
      solutionCode: `-- 문제 1: 전체 매출 누적 합계
SELECT
    month,
    product,
    revenue,
    SUM(revenue) OVER (ORDER BY month, product) as running_total
FROM monthly_sales;

-- 문제 2: 제품별 누적 매출
SELECT
    month,
    product,
    revenue,
    SUM(revenue) OVER (
        PARTITION BY product
        ORDER BY month
    ) as product_running_total
FROM monthly_sales;

-- 문제 3: 제품별 + 전체 누적 비교
SELECT
    month,
    product,
    revenue,
    SUM(revenue) OVER (PARTITION BY product ORDER BY month) as product_cumsum,
    SUM(revenue) OVER (ORDER BY month, product) as total_cumsum
FROM monthly_sales;

-- 문제 4: 누적 매출 비율
SELECT
    month,
    product,
    revenue,
    SUM(revenue) OVER (PARTITION BY product ORDER BY month) as cumsum,
    SUM(revenue) OVER (PARTITION BY product) as product_total,
    ROUND(
        SUM(revenue) OVER (PARTITION BY product ORDER BY month) * 100.0 /
        SUM(revenue) OVER (PARTITION BY product),
        2
    ) as cumsum_pct
FROM monthly_sales;`,
      hints: [
        'SUM() OVER (ORDER BY ...)는 기본적으로 누적 합계 계산',
        'PARTITION BY로 그룹별 독립적인 누적 합계 계산',
        '전체 합계: SUM() OVER ()에 ORDER BY 없이 사용'
      ]
    }
  },
  {
    id: 'w3d2-code-moving-average',
    type: 'code',
    title: '실습: 이동 평균 (Moving Average)',
    duration: 25,
    access: 'core',
    content: {
      instructions: `이동 평균은 시계열 데이터 스무딩과 트렌드 분석에 필수입니다.

**문제 1**: 3일 이동 평균 계산
**문제 2**: 5일 이동 평균 (종목별)
**문제 3**: 이동 평균 대비 현재가 비교
**문제 4**: 이동 최고가, 최저가`,
      starterCode: `CREATE TEMP TABLE stock_prices (
    trade_date DATE,
    symbol VARCHAR(10),
    close_price DECIMAL(10,2)
);

INSERT INTO stock_prices VALUES
('2024-01-01', 'AAPL', 150.00),
('2024-01-02', 'AAPL', 152.50),
('2024-01-03', 'AAPL', 148.00),
('2024-01-04', 'AAPL', 155.00),
('2024-01-05', 'AAPL', 157.50),
('2024-01-08', 'AAPL', 153.00),
('2024-01-09', 'AAPL', 158.00),
('2024-01-10', 'AAPL', 160.00);

-- 문제 1: 3일 이동 평균


-- 문제 2: 5일 이동 평균


-- 문제 3: 이동 평균 대비 현재가


-- 문제 4: 이동 최고가, 최저가
`,
      solutionCode: `-- 문제 1: 3일 이동 평균
SELECT
    trade_date,
    close_price,
    ROUND(
        AVG(close_price) OVER (
            ORDER BY trade_date
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ), 2
    ) as ma_3d
FROM stock_prices;

-- 문제 2: 5일 이동 평균
SELECT
    trade_date,
    close_price,
    ROUND(
        AVG(close_price) OVER (
            ORDER BY trade_date
            ROWS BETWEEN 4 PRECEDING AND CURRENT ROW
        ), 2
    ) as ma_5d
FROM stock_prices;

-- 문제 3: 이동 평균 대비 현재가
SELECT
    trade_date,
    close_price,
    ROUND(AVG(close_price) OVER (
        ORDER BY trade_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ), 2) as ma_3d,
    ROUND(
        (close_price - AVG(close_price) OVER (
            ORDER BY trade_date
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        )) / AVG(close_price) OVER (
            ORDER BY trade_date
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) * 100, 2
    ) as deviation_pct
FROM stock_prices;

-- 문제 4: 이동 최고가, 최저가
SELECT
    trade_date,
    close_price,
    MAX(close_price) OVER (
        ORDER BY trade_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as high_3d,
    MIN(close_price) OVER (
        ORDER BY trade_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as low_3d
FROM stock_prices;`,
      hints: [
        'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW = 현재 포함 3행',
        '5일 평균: ROWS BETWEEN 4 PRECEDING AND CURRENT ROW',
        'MAX/MIN 윈도우 함수도 프레임 절 사용 가능'
      ]
    }
  },
  {
    id: 'w3d2-code-ntile',
    type: 'code',
    title: '실습: NTILE()과 분위수 분석',
    duration: 25,
    access: 'core',
    content: {
      instructions: `NTILE은 데이터를 N개 그룹으로 균등 분할합니다.

**문제 1**: 고객을 구매 금액 기준 4분위로 나누기
**문제 2**: 고객 등급 분류 (상위 20%, 중상위 30%, 중하위 30%, 하위 20%)
**문제 3**: 각 분위별 통계
**문제 4**: PERCENT_RANK vs CUME_DIST 비교`,
      starterCode: `CREATE TEMP TABLE customer_orders (
    customer_id INT,
    total_spent DECIMAL(10,2),
    order_count INT
);

INSERT INTO customer_orders VALUES
(1, 5000, 15), (2, 12000, 8), (3, 3500, 5),
(4, 8500, 12), (5, 15000, 20), (6, 2000, 3),
(7, 25000, 30), (8, 9000, 10), (9, 7000, 9), (10, 4000, 6);

-- 문제 1: 4분위 분할


-- 문제 2: 고객 등급 분류


-- 문제 3: 분위별 통계


-- 문제 4: PERCENT_RANK vs CUME_DIST
`,
      solutionCode: `-- 문제 1: 4분위 분할
SELECT
    customer_id,
    total_spent,
    NTILE(4) OVER (ORDER BY total_spent DESC) as quartile
FROM customer_orders;

-- 문제 2: 고객 등급 분류
SELECT
    customer_id,
    total_spent,
    PERCENT_RANK() OVER (ORDER BY total_spent DESC) as pct_rank,
    CASE
        WHEN PERCENT_RANK() OVER (ORDER BY total_spent DESC) < 0.2 THEN 'VIP'
        WHEN PERCENT_RANK() OVER (ORDER BY total_spent DESC) < 0.5 THEN 'Gold'
        WHEN PERCENT_RANK() OVER (ORDER BY total_spent DESC) < 0.8 THEN 'Silver'
        ELSE 'Bronze'
    END as grade
FROM customer_orders;

-- 문제 3: 분위별 통계
WITH quartile_data AS (
    SELECT *, NTILE(4) OVER (ORDER BY total_spent DESC) as quartile
    FROM customer_orders
)
SELECT
    quartile,
    COUNT(*) as customer_count,
    ROUND(AVG(total_spent), 2) as avg_spent,
    MIN(total_spent) as min_spent,
    MAX(total_spent) as max_spent
FROM quartile_data
GROUP BY quartile;

-- 문제 4: PERCENT_RANK vs CUME_DIST
SELECT
    customer_id,
    total_spent,
    ROUND(PERCENT_RANK() OVER (ORDER BY total_spent), 4) as pct_rank,
    ROUND(CUME_DIST() OVER (ORDER BY total_spent), 4) as cume_dist
FROM customer_orders;`,
      hints: [
        'NTILE(4) = 4분위, NTILE(10) = 10분위',
        'PERCENT_RANK: 0~1, 첫 행=0',
        'CUME_DIST: 0 초과 ~ 1, 마지막 행=1'
      ]
    }
  },
  {
    id: 'w3d2-quiz-window-advanced',
    type: 'quiz',
    title: '퀴즈: 윈도우 함수 심화',
    duration: 15,
    access: 'core',
    content: {
      questions: [
        {
          question: 'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW는 몇 개의 행을 포함하나요?',
          options: ['2개', '3개', '4개', '상황에 따라 다름'],
          answer: 1,
          explanation: '현재 행 + 이전 2행 = 총 3개 행. 단, 파티션 시작 부분에서는 사용 가능한 행만 포함됩니다.'
        },
        {
          question: 'SUM(amount) OVER (ORDER BY date)의 기본 프레임은?',
          options: [
            'ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING',
            'RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW',
            'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW',
            '프레임 없음'
          ],
          answer: 1,
          explanation: 'ORDER BY가 있으면 기본 프레임은 RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW입니다.'
        },
        {
          question: 'NTILE(4)로 10개 행을 분할하면 각 그룹의 크기는?',
          options: [
            '모두 2개씩',
            '3, 3, 2, 2 (앞 그룹이 더 많음)',
            '2, 2, 3, 3 (뒤 그룹이 더 많음)',
            '균등 분할 불가'
          ],
          answer: 1,
          explanation: 'NTILE은 10/4 = 2.5이므로, 나머지 2개를 앞 그룹에 배분합니다. 결과: 3, 3, 2, 2'
        },
        {
          question: 'PERCENT_RANK()와 CUME_DIST()의 가장 큰 차이점은?',
          options: [
            'PERCENT_RANK는 내림차순, CUME_DIST는 오름차순',
            'PERCENT_RANK는 첫 행이 0, CUME_DIST는 첫 행이 0 초과',
            'PERCENT_RANK는 정수, CUME_DIST는 소수',
            '계산 속도 차이'
          ],
          answer: 1,
          explanation: 'PERCENT_RANK = (순위-1)/(N-1)로 첫 행=0. CUME_DIST = 현재 이하 행 수/N로 항상 0 초과.'
        },
        {
          question: '5일 이동평균을 계산하려면 어떤 프레임 절을 사용해야 하나요?',
          options: [
            'ROWS BETWEEN 5 PRECEDING AND CURRENT ROW',
            'ROWS BETWEEN 4 PRECEDING AND CURRENT ROW',
            'ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING',
            'ROWS BETWEEN UNBOUNDED PRECEDING AND 4 FOLLOWING'
          ],
          answer: 1,
          explanation: '현재 행 포함 5개 = 이전 4행 + 현재 1행. ROWS BETWEEN 4 PRECEDING AND CURRENT ROW'
        }
      ]
    }
  },
  {
    id: 'w3d2-challenge-analytics',
    type: 'challenge',
    title: '챌린지: 종합 윈도우 분석',
    duration: 30,
    access: 'core',
    content: {
      instructions: `전자상거래 매출 데이터를 종합 분석합니다.

다음 지표를 모두 포함하는 쿼리를 작성하세요:
1. 일자별 매출
2. 카테고리별 누적 매출
3. 3일 이동 평균 매출
4. 전일 대비 매출 변화율
5. 카테고리 내 일별 매출 순위
6. 전체 기간 중 해당 일자의 매출 분위 (4분위)`,
      starterCode: `CREATE TEMP TABLE ecommerce_sales (
    sale_date DATE,
    category VARCHAR(50),
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2),
    revenue DECIMAL(10,2)
);

INSERT INTO ecommerce_sales VALUES
('2024-01-01', 'Electronics', 1001, 5, 500, 2500),
('2024-01-01', 'Electronics', 1002, 3, 300, 900),
('2024-01-01', 'Fashion', 2001, 10, 50, 500),
('2024-01-02', 'Electronics', 1001, 4, 500, 2000),
('2024-01-02', 'Fashion', 2002, 8, 80, 640),
('2024-01-03', 'Electronics', 1003, 2, 800, 1600),
('2024-01-03', 'Fashion', 2001, 12, 50, 600);

-- 종합 분석 쿼리 작성
`,
      requirements: [
        '6가지 지표 모두 계산',
        'CTE를 활용한 단계별 처리',
        '윈도우 함수 적절히 조합'
      ],
      evaluationCriteria: [
        '쿼리 문법 오류 없음',
        '각 지표가 정확히 계산됨',
        'CTE로 가독성 있는 코드'
      ],
      hints: [
        'CTE를 활용하여 단계별로 집계 후 윈도우 함수 적용',
        '전일 대비 변화율: (현재-이전)/이전*100, 0으로 나누기 방지',
        'NULLIF로 0 나누기 에러 방지'
      ]
    }
  }
]
