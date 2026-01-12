// Day 4: 실행 계획 분석 & 쿼리 튜닝
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'w3d4-video-explain',
    type: 'video',
    title: 'EXPLAIN ANALYZE 완전 정복',
    duration: 15,
    access: 'core',
    content: {
      objectives: [
        'EXPLAIN과 EXPLAIN ANALYZE의 차이 이해',
        '실행 계획 읽는 방법 학습',
        '비용(Cost)과 실제 시간의 의미 파악'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=mc7FZJZ_1wE',
      transcript: `## 왜 실행 계획이 중요한가?

- 같은 결과를 내는 쿼리도 성능 차이 100배 이상
- "왜 느린가?"의 답은 실행 계획에 있음
- 인덱스 사용 여부 확인 가능
- 병목 지점 파악 가능

## EXPLAIN vs EXPLAIN ANALYZE
| | EXPLAIN | EXPLAIN ANALYZE |
|---|---------|-----------------|
| 실제 실행 | X | O |
| 추정 비용 | O | O |
| 실제 시간 | X | O |
| 실제 행 수 | X | O |

## 기본 사용법
\`\`\`sql
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
\`\`\``,
      keyPoints: [
        'EXPLAIN: 예상 실행 계획만 표시 (쿼리 미실행)',
        'EXPLAIN ANALYZE: 실제 실행 후 결과 표시',
        'Cost: 상대적 비용 (낮을수록 좋음)',
        '실행 계획은 아래에서 위로 읽음'
      ]
    }
  },
  {
    id: 'w3d4-reading-execution-plan',
    type: 'reading',
    title: '실행 계획 해석 가이드',
    duration: 25,
    access: 'core',
    content: {
      markdown: `# 실행 계획 해석 가이드

## 주요 스캔 방식

### 1. Seq Scan (순차 스캔)
- 테이블 전체를 처음부터 끝까지 읽음
- 인덱스 없거나 대부분의 행 반환 시
- 대용량 테이블에서 느림

### 2. Index Scan
- 인덱스를 통해 테이블 접근
- WHERE 조건이 인덱스와 일치할 때
- 선택도가 높을 때 빠름

### 3. Index Only Scan
- 인덱스만으로 결과 반환 (테이블 접근 X)
- SELECT 컬럼이 모두 인덱스에 포함될 때
- 가장 빠름

## 조인 방식

### 1. Nested Loop
- 작은 테이블, 인덱스 있는 조인에 적합

### 2. Hash Join
- 대용량 테이블, 동등 조인에 적합

### 3. Merge Join
- 이미 정렬된 대용량 데이터에 적합

## 비용(Cost) 이해

\`\`\`
cost=시작비용..총비용
\`\`\`

- 시작 비용: 첫 번째 행 반환까지의 비용
- 총 비용: 모든 행 반환까지의 비용
- 단위: 임의 단위 (비교용)

## 문제 진단 체크리스트

| 증상 | 원인 | 해결 |
|------|------|------|
| Seq Scan on 대용량 | 인덱스 없음 | 인덱스 생성 |
| rows 추정치 크게 틀림 | 통계 오래됨 | ANALYZE 실행 |
| Sort 비용 높음 | ORDER BY 인덱스 없음 | 정렬 인덱스 추가 |`,
      externalLinks: [
        {
          title: 'PostgreSQL EXPLAIN',
          url: 'https://www.postgresql.org/docs/current/sql-explain.html'
        },
        {
          title: 'Use The Index, Luke',
          url: 'https://use-the-index-luke.com/'
        }
      ]
    }
  },
  {
    id: 'w3d4-code-explain',
    type: 'code',
    title: '실습: EXPLAIN ANALYZE 분석',
    duration: 25,
    access: 'core',
    content: {
      instructions: `실행 계획을 분석하고 문제점을 파악합니다.

**문제 1**: 인덱스 없이 실행 계획 분석
**문제 2**: 인덱스 생성 후 실행 계획 변화 확인
**문제 3**: 복합 조건의 실행 계획 분석`,
      starterCode: `-- 테스트용 테이블
CREATE TABLE IF NOT EXISTS test_orders (
    id SERIAL PRIMARY KEY,
    customer_id INT,
    amount DECIMAL(10,2),
    status VARCHAR(20),
    created_at TIMESTAMP
);

-- 샘플 데이터 생성
INSERT INTO test_orders (customer_id, amount, status, created_at)
SELECT
    (random() * 1000)::INT,
    (random() * 1000)::DECIMAL(10,2),
    CASE (random() * 3)::INT WHEN 0 THEN 'pending' WHEN 1 THEN 'completed' ELSE 'cancelled' END,
    NOW() - (random() * 365)::INT * INTERVAL '1 day'
FROM generate_series(1, 10000);

-- 문제 1: 실행 계획 분석 (인덱스 없이)
EXPLAIN ANALYZE SELECT * FROM test_orders WHERE customer_id = 500;


-- 문제 2: 인덱스 생성 후 다시 분석


-- 문제 3: 복합 조건 실행 계획
EXPLAIN ANALYZE SELECT * FROM test_orders WHERE customer_id = 500 AND status = 'completed';
`,
      solutionCode: `-- 문제 1: 인덱스 없이 (Seq Scan)
EXPLAIN ANALYZE SELECT * FROM test_orders WHERE customer_id = 500;
-- Seq Scan on test_orders  (cost=0.00..xxx rows=xxx)
-- 전체 테이블 스캔 발생

-- 문제 2: 인덱스 생성 후
CREATE INDEX idx_orders_customer ON test_orders(customer_id);
EXPLAIN ANALYZE SELECT * FROM test_orders WHERE customer_id = 500;
-- Index Scan using idx_orders_customer on test_orders
-- 비용과 시간 모두 크게 감소

-- 문제 3: 복합 조건
CREATE INDEX idx_orders_customer_status ON test_orders(customer_id, status);
EXPLAIN ANALYZE SELECT * FROM test_orders WHERE customer_id = 500 AND status = 'completed';
-- 복합 인덱스가 두 조건 모두 처리`,
      hints: [
        'EXPLAIN ANALYZE는 실제로 쿼리를 실행함',
        'Seq Scan → Index Scan으로 바뀌면 성공',
        'rows 추정치와 actual rows 비교'
      ]
    }
  },
  {
    id: 'w3d4-reading-index',
    type: 'reading',
    title: '인덱스 전략과 쿼리 튜닝',
    duration: 20,
    access: 'core',
    content: {
      markdown: `# 인덱스 전략과 쿼리 튜닝

## 인덱스 기본 원리

### B-Tree 인덱스 (기본)
\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
\`\`\`
- 적합: =, <, >, <=, >=, BETWEEN, LIKE 'prefix%'
- 부적합: LIKE '%suffix', 함수 적용된 컬럼

### 복합 인덱스
\`\`\`sql
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);
\`\`\`
- **순서가 중요!** (왼쪽 우선 원칙)
- customer_id 조건 → 사용됨
- order_date 조건만 → 사용 안됨!

## 쿼리 튜닝 패턴

### 1. 함수 사용 피하기
\`\`\`sql
-- BAD: 인덱스 사용 불가
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- GOOD: 인덱스 사용 가능
SELECT * FROM users WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
\`\`\`

### 2. OR 조건 최적화
\`\`\`sql
-- BAD: 비효율적
SELECT * FROM users WHERE status = 'active' OR department = 'IT';

-- GOOD: UNION으로 분리
SELECT * FROM users WHERE status = 'active'
UNION
SELECT * FROM users WHERE department = 'IT';
\`\`\`

### 3. SELECT * 피하기
\`\`\`sql
-- BAD
SELECT * FROM users WHERE id = 100;

-- GOOD
SELECT id, name, email FROM users WHERE id = 100;
\`\`\`

## 실전 튜닝 체크리스트

1. EXPLAIN ANALYZE로 현재 상태 파악
2. Seq Scan이 발생하는지 확인
3. rows 추정 vs 실제 비교
4. 인덱스 추가 후 개선 여부 확인
5. 통계 최신화 (ANALYZE)`,
      externalLinks: [
        {
          title: 'PostgreSQL Index Types',
          url: 'https://www.postgresql.org/docs/current/indexes-types.html'
        }
      ]
    }
  },
  {
    id: 'w3d4-code-tuning',
    type: 'code',
    title: '실습: 쿼리 튜닝 실전',
    duration: 30,
    access: 'core',
    content: {
      instructions: `느린 쿼리를 최적화합니다.

**문제 1**: 함수 사용으로 인덱스 무효화 → 범위 조건으로 변경
**문제 2**: OR 조건 → UNION으로 분리
**문제 3**: 상관 서브쿼리 → 윈도우 함수로 변환`,
      starterCode: `-- 기존 테이블 사용 (test_orders)

-- 문제 1: 함수 사용 제거
-- 현재 (비효율적):
EXPLAIN ANALYZE
SELECT * FROM test_orders
WHERE EXTRACT(YEAR FROM created_at) = 2024;

-- 최적화된 쿼리:


-- 문제 2: OR 조건 최적화
-- 현재 (비효율적):
EXPLAIN ANALYZE
SELECT * FROM test_orders
WHERE status = 'pending' OR customer_id = 100;

-- 최적화된 쿼리:


-- 문제 3: 고객별 최근 주문 1개씩 가져오기
-- 현재 (느림):
EXPLAIN ANALYZE
SELECT * FROM test_orders o1
WHERE created_at = (
    SELECT MAX(created_at) FROM test_orders o2
    WHERE o2.customer_id = o1.customer_id
);

-- 최적화된 쿼리:
`,
      solutionCode: `-- 문제 1: 함수 사용 제거
CREATE INDEX idx_orders_created ON test_orders(created_at);

-- 최적화:
EXPLAIN ANALYZE
SELECT * FROM test_orders
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
-- Index Scan 사용, 훨씬 빠름

-- 문제 2: OR 조건 최적화
CREATE INDEX idx_orders_status ON test_orders(status);

-- 최적화:
EXPLAIN ANALYZE
SELECT * FROM test_orders WHERE status = 'pending'
UNION
SELECT * FROM test_orders WHERE customer_id = 100;
-- 각각 Index Scan 후 UNION

-- 문제 3: 윈도우 함수 활용
CREATE INDEX idx_orders_customer_created ON test_orders(customer_id, created_at DESC);

-- 최적화:
EXPLAIN ANALYZE
WITH ranked AS (
    SELECT *, ROW_NUMBER() OVER (
        PARTITION BY customer_id ORDER BY created_at DESC
    ) as rn
    FROM test_orders
)
SELECT * FROM ranked WHERE rn = 1;
-- 상관 서브쿼리 대신 WindowAgg`,
      hints: [
        '함수 대신 범위 조건 사용',
        'OR 조건은 UNION으로 분리 고려',
        '상관 서브쿼리 → 윈도우 함수 활용'
      ]
    }
  },
  {
    id: 'w3d4-quiz-tuning',
    type: 'quiz',
    title: '퀴즈: 실행 계획 & 튜닝',
    duration: 15,
    access: 'core',
    content: {
      questions: [
        {
          question: 'EXPLAIN ANALYZE와 EXPLAIN의 가장 큰 차이점은?',
          options: ['더 상세한 정보 제공', '실제로 쿼리를 실행함', 'PostgreSQL에서만 사용 가능', '인덱스 정보만 표시'],
          answer: 1,
          explanation: 'EXPLAIN은 예상 계획만, EXPLAIN ANALYZE는 실제 실행하여 실제 시간과 행 수를 보여줍니다.'
        },
        {
          question: 'Seq Scan이 발생하는 가장 일반적인 이유는?',
          options: ['테이블이 너무 작아서', '적절한 인덱스가 없거나 사용 불가', 'JOIN이 있어서', 'ORDER BY가 있어서'],
          answer: 1,
          explanation: '인덱스가 없거나 WHERE 조건에 함수가 적용되어 인덱스를 사용할 수 없을 때 Seq Scan이 발생합니다.'
        },
        {
          question: '복합 인덱스 (a, b)가 있을 때, 어떤 쿼리에서 인덱스가 사용되지 않을까요?',
          options: ['WHERE a = 1', 'WHERE a = 1 AND b = 2', 'WHERE b = 2', 'WHERE a = 1 ORDER BY b'],
          answer: 2,
          explanation: '복합 인덱스는 왼쪽 우선 원칙을 따릅니다. 첫 번째 컬럼(a) 없이 두 번째 컬럼(b)만으로는 인덱스를 효율적으로 사용할 수 없습니다.'
        },
        {
          question: 'Index Only Scan이 발생하려면?',
          options: ['클러스터드 인덱스여야 함', 'SELECT하는 모든 컬럼이 인덱스에 포함', 'WHERE 조건이 등호(=)여야 함', 'ORDER BY가 없어야 함'],
          answer: 1,
          explanation: 'Index Only Scan은 인덱스만으로 결과를 반환할 때 발생합니다. SELECT 컬럼이 모두 인덱스에 포함되어야 합니다.'
        },
        {
          question: '다음 중 쿼리 튜닝 방법으로 적절하지 않은 것은?',
          options: ['EXTRACT 함수 대신 범위 조건 사용', 'SELECT * 대신 필요한 컬럼만 선택', '모든 컬럼에 인덱스 생성', 'OR 조건을 UNION으로 분리'],
          answer: 2,
          explanation: '모든 컬럼에 인덱스를 생성하면 INSERT/UPDATE/DELETE 성능이 저하됩니다.'
        }
      ]
    }
  },
  {
    id: 'w3d4-challenge-optimization',
    type: 'challenge',
    title: '챌린지: 종합 최적화',
    duration: 30,
    access: 'core',
    content: {
      instructions: `이커머스 대시보드 쿼리를 최적화합니다.

요구사항: 최근 30일 고객별 구매 통계
- 고객별 주문 수
- 고객별 총 금액
- 고객 평균 대비 현재 주문 차이

현재 느린 쿼리의 문제점을 분석하고 최적화하세요.`,
      starterCode: `-- 현재 느린 쿼리
EXPLAIN ANALYZE
SELECT
    c.id as customer_id,
    c.name,
    COUNT(o.id) as order_count,
    SUM(o.amount) as total_amount,
    (
        SELECT AVG(amount)
        FROM test_orders o2
        WHERE o2.customer_id = c.id
    ) as avg_order_amount
FROM test_customers c
LEFT JOIN test_orders o ON c.id = o.customer_id
    AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY c.id, c.name
HAVING COUNT(o.id) > 0
ORDER BY total_amount DESC
LIMIT 100;

-- 과제:
-- 1. 문제점 분석
-- 2. 필요한 인덱스 생성
-- 3. 쿼리 최적화
`,
      requirements: [
        '실행 계획 분석',
        '상관 서브쿼리 제거',
        '적절한 인덱스 설계'
      ],
      evaluationCriteria: [
        '실행 시간 50% 이상 개선',
        'Seq Scan 제거',
        'CTE를 활용한 가독성 있는 코드'
      ],
      hints: [
        '상관 서브쿼리는 CTE로 미리 계산',
        '복합 인덱스 (customer_id, created_at)',
        'EXPLAIN ANALYZE로 각 단계 성능 확인'
      ]
    }
  }
]
