# Phase 1: 데이터 엔지니어링 기초 (8주)

> 목표: 대용량 데이터를 수집, 처리, 저장하는 파이프라인을 독립적으로 구축할 수 있다.
>
> 기간: 2개월 (8주)
>
> 포트폴리오: E2E 데이터 파이프라인

---

## Month 1: Python & SQL 심화

---

### Week 1: Python 심화

#### 학습 목표
- [ ] 제너레이터를 사용하여 메모리 효율적인 데이터 처리를 할 수 있다
- [ ] 데코레이터를 직접 작성하여 함수의 동작을 확장할 수 있다
- [ ] 컨텍스트 매니저를 구현하여 리소스를 안전하게 관리할 수 있다
- [ ] Type Hints를 적용하고 mypy로 타입 검사를 수행할 수 있다

#### 핵심 개념

**1. 제너레이터 & 이터레이터**
```python
# 메모리 효율적인 대용량 파일 읽기
def read_large_file(file_path):
    with open(file_path, 'r') as f:
        for line in f:
            yield line.strip()

# 10GB 파일도 메모리 걱정 없이 처리
for line in read_large_file('huge_data.csv'):
    process(line)
```

| 개념 | 설명 | 사용 시점 |
|------|------|----------|
| Iterator | `__iter__`, `__next__` 구현 객체 | 커스텀 순회 로직 |
| Generator | `yield` 키워드로 생성 | 대용량 데이터, lazy evaluation |
| Generator Expression | `(x for x in range(n))` | 메모리 절약 리스트 컴프리헨션 |

**2. 데코레이터 패턴**
```python
import functools
import time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def expensive_operation():
    time.sleep(1)
```

| 패턴 | 용도 | 예시 |
|------|------|------|
| 로깅 | 함수 호출 추적 | `@log_calls` |
| 캐싱 | 중복 계산 방지 | `@lru_cache` |
| 인증 | 접근 제어 | `@require_auth` |
| 재시도 | 실패 시 재시도 | `@retry(max_attempts=3)` |

**3. 컨텍스트 매니저**
```python
from contextlib import contextmanager

@contextmanager
def database_connection(host):
    conn = create_connection(host)
    try:
        yield conn
    finally:
        conn.close()  # 예외 발생해도 반드시 실행

with database_connection('localhost') as conn:
    conn.execute('SELECT * FROM users')
```

**4. Type Hints & mypy**
```python
from typing import List, Dict, Optional

def process_users(
    users: List[Dict[str, str]],
    limit: Optional[int] = None
) -> List[str]:
    names = [u['name'] for u in users]
    return names[:limit] if limit else names

# mypy로 타입 검사
# $ mypy script.py
```

#### 실습 과제

**과제 1: 로깅 & 캐싱 데코레이터 시스템**

```
요구사항:
1. @log_calls - 함수 호출 시 인자, 반환값, 실행시간 로깅
2. @cache(ttl=60) - 결과를 60초간 캐싱
3. @retry(max_attempts=3, delay=1) - 실패 시 3회 재시도
4. 데코레이터 스택 가능해야 함 (@log_calls @cache @retry)

테스트:
- API 호출 함수에 적용하여 동작 확인
- 캐시 히트율, 재시도 횟수 측정
```

**과제 2: 대용량 로그 처리기**

```
요구사항:
1. 제너레이터로 10GB 로그 파일 스트림 처리
2. 에러 레벨별 카운트 집계
3. 메모리 사용량 100MB 이하 유지
4. 처리 진행률 표시

입력: access.log (10GB, 1억 라인)
출력: {"ERROR": 12345, "WARN": 67890, "INFO": ...}
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 데코레이터 구현 | 3개 데코레이터 모두 정상 동작 | 30% |
| 제너레이터 활용 | 메모리 100MB 이하 유지 | 25% |
| Type Hints | mypy 에러 0개 | 20% |
| 코드 품질 | docstring, 테스트 코드 포함 | 15% |
| 성능 | 1GB 파일 10초 이내 처리 | 10% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 공식 문서 | Python Generators | https://docs.python.org/3/howto/functional.html |
| 영상 | Corey Schafer - Decorators | https://www.youtube.com/watch?v=FsAPt_9Bf3U |
| 영상 | ArjanCodes - Context Managers | https://www.youtube.com/watch?v=iba-I4CrmyA |
| 코스 | Real Python - Type Checking | https://realpython.com/python-type-checking/ |
| 도서 | Fluent Python (Ch. 7, 9, 14) | - |

---

### Week 2: pandas & 데이터 처리

#### 학습 목표
- [ ] 1GB+ 데이터를 chunk 단위로 처리할 수 있다
- [ ] MultiIndex, pivot, melt를 활용한 데이터 변환을 할 수 있다
- [ ] vectorize 연산으로 성능을 최적화할 수 있다
- [ ] Polars와 pandas의 차이를 이해하고 적절히 선택할 수 있다

#### 핵심 개념

**1. 대용량 데이터 처리**
```python
import pandas as pd

# 방법 1: Chunk 처리
chunks = pd.read_csv('large.csv', chunksize=100_000)
result = pd.concat([process(chunk) for chunk in chunks])

# 방법 2: dtype 최적화
dtypes = {
    'id': 'int32',           # int64 → int32 (50% 절약)
    'category': 'category',   # object → category (90% 절약)
    'amount': 'float32'
}
df = pd.read_csv('large.csv', dtype=dtypes)

# 방법 3: 필요한 컬럼만 로드
df = pd.read_csv('large.csv', usecols=['id', 'amount'])
```

**2. 고급 pandas 연산**
```python
# MultiIndex
df.set_index(['region', 'date']).loc[('Asia', '2024-01')]

# Pivot & Melt
wide = df.pivot(index='date', columns='product', values='sales')
long = wide.melt(ignore_index=False, var_name='product', value_name='sales')

# 효율적인 Merge
df1.merge(df2, on='key', how='left', validate='m:1')
```

**3. 성능 최적화**
```python
# BAD: apply (느림)
df['result'] = df['value'].apply(lambda x: x ** 2 + 1)

# GOOD: vectorize (빠름)
df['result'] = df['value'] ** 2 + 1

# BETTER: numba (더 빠름)
from numba import jit

@jit(nopython=True)
def compute(arr):
    return arr ** 2 + 1

df['result'] = compute(df['value'].values)
```

| 방법 | 상대 속도 | 사용 시점 |
|------|----------|----------|
| apply + lambda | 1x (기준) | 복잡한 로직, 빠른 프로토타입 |
| vectorize | 10-100x | 수학 연산 |
| numba | 100-1000x | 반복 계산, 수치 연산 |
| pandas → numpy | 2-5x | 대용량 수치 연산 |

**4. Polars 소개**
```python
import polars as pl

# pandas보다 10배+ 빠름
df = pl.read_csv('large.csv')

# Lazy evaluation (최적화)
result = (
    pl.scan_csv('large.csv')
    .filter(pl.col('amount') > 100)
    .group_by('category')
    .agg(pl.col('amount').sum())
    .collect()
)
```

| 항목 | pandas | Polars |
|------|--------|--------|
| 속도 | 기준 | 10-100x 빠름 |
| 메모리 | 높음 | 낮음 |
| 멀티코어 | 제한적 | 자동 병렬화 |
| 생태계 | 방대함 | 성장 중 |
| 학습곡선 | 낮음 | 중간 |

#### 실습 과제

**과제: 1GB+ 데이터 처리 파이프라인**

```
데이터: NYC Taxi Trip 데이터 (parquet, 1GB+)
다운로드: https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page

요구사항:
1. 메모리 2GB 이내에서 처리
2. 다음 분석 수행:
   - 시간대별 평균 운행 거리
   - 지역별 팁 비율 분포
   - 요일/시간 히트맵
3. pandas vs Polars 성능 비교 리포트
4. 결과를 parquet으로 저장

산출물:
- Jupyter Notebook
- 성능 벤치마크 테이블
- 시각화 차트 3개 이상
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 메모리 효율 | 2GB 이내 처리 완료 | 30% |
| 분석 정확성 | 3개 분석 모두 완료 | 25% |
| 성능 비교 | pandas/Polars 벤치마크 제시 | 20% |
| 코드 품질 | 함수화, 재사용 가능 | 15% |
| 시각화 | 명확하고 해석 포함 | 10% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 공식 문서 | pandas User Guide | https://pandas.pydata.org/docs/user_guide/ |
| 공식 문서 | Polars User Guide | https://docs.pola.rs/user-guide/ |
| 영상 | Rob Mulla - pandas 최적화 | https://www.youtube.com/watch?v=u4_c2LDi4b8 |
| 벤치마크 | Polars vs pandas | https://pola.rs/posts/benchmarks/ |
| 튜토리얼 | NYC Taxi 분석 예제 | https://www.kaggle.com/datasets/elemento/nyc-yellow-taxi-trip-data |

---

### Week 3: SQL 심화

#### 학습 목표
- [ ] 윈도우 함수를 활용한 고급 분석 쿼리를 작성할 수 있다
- [ ] CTE와 재귀 쿼리로 복잡한 데이터 구조를 처리할 수 있다
- [ ] 실행 계획을 분석하고 쿼리를 튜닝할 수 있다
- [ ] 트랜잭션과 락의 동작을 이해하고 적용할 수 있다

#### 핵심 개념

**1. 윈도우 함수**
```sql
-- ROW_NUMBER: 순위 매기기
SELECT
    product_id,
    sales,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY sales DESC) as rank
FROM products;

-- LAG/LEAD: 이전/다음 값 비교
SELECT
    date,
    revenue,
    revenue - LAG(revenue) OVER (ORDER BY date) as daily_change,
    revenue / LAG(revenue) OVER (ORDER BY date) - 1 as growth_rate
FROM daily_sales;

-- RUNNING TOTAL: 누적 합계
SELECT
    date,
    amount,
    SUM(amount) OVER (ORDER BY date ROWS UNBOUNDED PRECEDING) as running_total
FROM transactions;
```

| 함수 | 용도 | 예시 |
|------|------|------|
| ROW_NUMBER | 순위 (중복 없음) | Top N 추출 |
| RANK/DENSE_RANK | 순위 (중복 허용) | 랭킹 시스템 |
| LAG/LEAD | 이전/다음 행 | 전월 대비 |
| NTILE | N등분 | 분위수 분석 |
| SUM/AVG OVER | 누적/이동 평균 | 추세 분석 |

**2. CTE & 재귀 쿼리**
```sql
-- 일반 CTE: 가독성 향상
WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', order_date) as month,
        SUM(amount) as total
    FROM orders
    GROUP BY 1
),
growth AS (
    SELECT
        month,
        total,
        total / LAG(total) OVER (ORDER BY month) - 1 as mom_growth
    FROM monthly_sales
)
SELECT * FROM growth WHERE mom_growth > 0.1;

-- 재귀 CTE: 계층 구조 (조직도, 카테고리 트리)
WITH RECURSIVE org_tree AS (
    -- Base case: 최상위 관리자
    SELECT id, name, manager_id, 1 as level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive case: 하위 직원
    SELECT e.id, e.name, e.manager_id, t.level + 1
    FROM employees e
    JOIN org_tree t ON e.manager_id = t.id
)
SELECT * FROM org_tree ORDER BY level, name;
```

**3. 실행 계획 분석**
```sql
EXPLAIN ANALYZE
SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date > '2024-01-01';

-- 주요 지표
-- Seq Scan: 전체 테이블 스캔 (인덱스 필요 신호)
-- Index Scan: 인덱스 활용 (좋음)
-- Nested Loop: O(n*m) 조인
-- Hash Join: O(n+m) 조인 (보통 효율적)
-- Sort: 정렬 비용 (메모리/디스크)
```

| 문제 | 증상 | 해결책 |
|------|------|--------|
| Seq Scan | 느린 WHERE 절 | 인덱스 생성 |
| Nested Loop | 대용량 조인 느림 | Hash Join 유도 |
| Sort | 메모리 초과 | 인덱스 정렬 활용 |
| High cost | 전반적 느림 | 쿼리 재작성 |

**4. 트랜잭션 & 락**
```sql
-- ACID 원칙
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- 또는 ROLLBACK;

-- Isolation Level
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- READ UNCOMMITTED: Dirty Read 허용
-- READ COMMITTED: 커밋된 것만 (PostgreSQL 기본)
-- REPEATABLE READ: 반복 읽기 보장
-- SERIALIZABLE: 완전 직렬화
```

#### 실습 과제

**과제: SQL 분석 쿼리 20개 작성**

```
데이터: 이커머스 데이터셋
- orders (100만 행)
- customers (10만 행)
- products (1만 행)
- order_items (500만 행)

쿼리 목록 (각 5개씩):

[윈도우 함수]
1. 카테고리별 매출 Top 3 제품
2. 고객별 첫 구매 후 30일 재구매율
3. 월별 매출 전월 대비 성장률
4. 제품별 7일 이동 평균 판매량
5. 고객 생애가치(LTV) 4분위 분류

[CTE & 재귀]
6. 카테고리 계층 구조 플랫화
7. 고객 코호트 분석 (월별 가입자 리텐션)
8. 연쇄 할인 프로모션 효과 분석
9. 제품 번들 추천 (함께 구매된 상품)
10. 다단계 추천인 보상 계산

[성능 튜닝]
11-15. 위 쿼리 중 5개 선택하여 EXPLAIN ANALYZE 분석
        - 튜닝 전/후 비교
        - 인덱스 추가 효과 측정

[트랜잭션]
16. 재고 차감과 주문 생성 트랜잭션
17. 포인트 이체 시 데드락 방지
18. 동시 수정 충돌 처리 (Optimistic Lock)
19. 배치 업데이트 롤백 전략
20. Isolation Level 별 동작 차이 실험
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 쿼리 정확성 | 20개 중 18개 이상 정확 | 40% |
| 성능 튜닝 | 5개 쿼리 50% 이상 개선 | 25% |
| 설명 | 각 쿼리에 주석/설명 포함 | 20% |
| 트랜잭션 이해 | 데드락/격리수준 실험 성공 | 15% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 책 | SQL 성능 최적화 | https://use-the-index-luke.com/ |
| 연습 | LeetCode SQL | https://leetcode.com/problemset/database/ |
| 연습 | HackerRank SQL | https://www.hackerrank.com/domains/sql |
| 영상 | CMU Database Course | https://www.youtube.com/watch?v=oeYBdghaIjc |
| 도구 | PostgreSQL EXPLAIN Visualizer | https://explain.dalibo.com/ |

---

### Week 4: 데이터 모델링

#### 학습 목표
- [ ] 정규화 원칙을 적용하여 OLTP 스키마를 설계할 수 있다
- [ ] Star/Snowflake 스키마로 분석용 데이터 웨어하우스를 설계할 수 있다
- [ ] SCD Type 2를 구현하여 이력을 관리할 수 있다
- [ ] 실무 요구사항을 ERD로 변환할 수 있다

#### 핵심 개념

**1. 정규화 (OLTP)**
```
1NF: 원자값 (배열, 중첩 구조 X)
2NF: 1NF + 부분 종속 제거 (복합키 일부에만 종속 X)
3NF: 2NF + 이행 종속 제거 (A→B→C 관계 분리)
BCNF: 모든 결정자가 후보키
```

| 정규형 | 문제 해결 | 예시 |
|--------|----------|------|
| 1NF | 반복 그룹 | 전화번호 여러 개 → 별도 테이블 |
| 2NF | 부분 종속 | (주문ID, 상품ID) → 상품명 분리 |
| 3NF | 이행 종속 | 우편번호 → 도시 분리 |

**2. 분석용 스키마 (OLAP)**

```
Star Schema:
          ┌─────────────┐
          │  dim_date   │
          └──────┬──────┘
                 │
┌──────────┐     │     ┌──────────┐
│dim_product├────┼─────┤dim_customer│
└──────────┘     │     └──────────┘
                 │
          ┌──────┴──────┐
          │ fact_sales  │
          │ (측정값들)   │
          └─────────────┘

Snowflake Schema:
- 차원 테이블을 추가 정규화
- dim_product → dim_category → dim_department
- 저장 공간 절약, 조인 증가
```

| 스키마 | 장점 | 단점 | 사용 시점 |
|--------|------|------|----------|
| Star | 쿼리 간단, 성능 좋음 | 중복 데이터 | 대부분의 DW |
| Snowflake | 저장 공간 절약 | 복잡한 조인 | 대규모 차원 |
| Data Vault | 이력 관리, 유연성 | 복잡함 | 엔터프라이즈 |

**3. SCD (Slowly Changing Dimension)**
```sql
-- Type 1: 덮어쓰기 (이력 없음)
UPDATE dim_customer SET address = '새 주소' WHERE id = 1;

-- Type 2: 새 행 추가 (이력 보존)
-- 기존 행 종료
UPDATE dim_customer
SET end_date = CURRENT_DATE, is_current = FALSE
WHERE customer_id = 1 AND is_current = TRUE;

-- 새 행 추가
INSERT INTO dim_customer (customer_id, address, start_date, end_date, is_current)
VALUES (1, '새 주소', CURRENT_DATE, '9999-12-31', TRUE);

-- Type 3: 이전/현재 컬럼 (제한된 이력)
ALTER TABLE dim_customer ADD previous_address VARCHAR(200);
UPDATE dim_customer
SET previous_address = address, address = '새 주소'
WHERE id = 1;
```

| Type | 이력 보존 | 복잡도 | 사용 시점 |
|------|----------|--------|----------|
| Type 1 | X | 낮음 | 오타 수정 |
| Type 2 | 전체 | 높음 | 주소, 등급 변경 |
| Type 3 | 직전만 | 중간 | 가격 변경 |

**4. 실무 설계 패턴**
```
이커머스:
- fact_orders, fact_order_items
- dim_customer, dim_product, dim_date, dim_geography

금융:
- fact_transactions
- dim_account, dim_customer, dim_date
- bridge_account_customer (다대다)

로그 데이터:
- raw_events (시간 파티셔닝)
- fact_sessions (집계)
- dim_user, dim_device, dim_page
```

#### 실습 과제

**과제: 이커머스 데이터 웨어하우스 설계**

```
요구사항:
1. OLTP 소스 시스템 ERD 설계 (3NF)
   - 고객, 주문, 상품, 카테고리, 결제, 배송

2. OLAP 타겟 시스템 ERD 설계 (Star Schema)
   - fact_orders, fact_order_items
   - dim_customer (SCD Type 2)
   - dim_product
   - dim_date
   - dim_geography

3. DDL 스크립트 작성 (PostgreSQL)
   - 제약조건, 인덱스 포함
   - 파티셔닝 전략 포함

4. 샘플 ETL 쿼리
   - OLTP → OLAP 변환
   - SCD Type 2 처리 로직

산출물:
- ERD 다이어그램 2개 (OLTP, OLAP)
- DDL 스크립트
- ETL 쿼리 3개
- 설계 문서 (선택 이유 설명)
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| OLTP ERD | 3NF 준수, 관계 정확 | 25% |
| OLAP ERD | Star Schema 구조 명확 | 25% |
| DDL | 실행 가능, 제약조건 포함 | 20% |
| SCD 구현 | Type 2 로직 정확 | 20% |
| 문서화 | 설계 근거 명확 | 10% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 책 | The Data Warehouse Toolkit (Kimball) | - |
| 영상 | Kimball Dimensional Modeling | https://www.youtube.com/watch?v=lWPiSZf7-uQ |
| 도구 | dbdiagram.io | https://dbdiagram.io/ |
| 도구 | ERDPlus | https://erdplus.com/ |
| 참고 | Star Schema 예제 | https://www.sqlshack.com/star-schema-in-sql-server/ |

---

## Month 2: Spark & 파이프라인

---

### Week 5: Apache Spark

#### 학습 목표
- [ ] Spark의 분산 처리 아키텍처를 이해하고 설명할 수 있다
- [ ] DataFrame API를 사용하여 대용량 데이터를 처리할 수 있다
- [ ] Catalyst 최적화 원리를 이해하고 효율적인 쿼리를 작성할 수 있다
- [ ] UDF를 작성하고 성능 영향을 이해할 수 있다

#### 핵심 개념

**1. Spark 아키텍처**
```
┌─────────────────────────────────────────┐
│              Driver Program              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │SparkContext│ │DAG Scheduler│ │Task Scheduler│  │
│  └─────────┘  └─────────┘  └─────────┘  │
└─────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │Executor 1│ │Executor 2│ │Executor 3│
  │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │
  │ │Task 1│ │ │ │Task 2│ │ │ │Task 3│ │
  │ └──────┘ │ │ └──────┘ │ │ └──────┘ │
  │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │
  │ │Cache │ │ │ │Cache │ │ │ │Cache │ │
  │ └──────┘ │ │ └──────┘ │ │ └──────┘ │
  └──────────┘ └──────────┘ └──────────┘
```

| 컴포넌트 | 역할 |
|----------|------|
| Driver | 프로그램 실행, DAG 생성, 작업 스케줄링 |
| Executor | 실제 작업 실행, 데이터 캐싱 |
| Partition | 데이터 분할 단위 (병렬 처리) |
| Shuffle | 파티션 간 데이터 재분배 (비용 높음) |

**2. DataFrame API**
```python
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.window import Window

spark = SparkSession.builder.appName("analysis").getOrCreate()

df = spark.read.parquet("data/events.parquet")

# 기본 연산
result = (
    df.filter(F.col("event_type") == "purchase")
      .groupBy("user_id", F.date_trunc("day", "timestamp").alias("date"))
      .agg(
          F.count("*").alias("purchase_count"),
          F.sum("amount").alias("total_amount")
      )
      .orderBy(F.desc("total_amount"))
)

# 윈도우 함수
window = Window.partitionBy("user_id").orderBy("timestamp")
df_with_rank = df.withColumn(
    "purchase_rank",
    F.row_number().over(window)
)
```

**3. Catalyst & Tungsten**
```python
# 실행 계획 확인
df.explain(extended=True)

# Catalyst 최적화 예시:
# 1. Predicate Pushdown: 필터를 스캔 시점으로 이동
# 2. Column Pruning: 필요한 컬럼만 로드
# 3. Constant Folding: 상수 표현식 미리 계산
# 4. Join Reordering: 최적의 조인 순서

# 좋은 패턴
df.filter(F.col("date") > "2024-01-01")  # Pushdown 가능
  .select("id", "amount")                 # Column Pruning

# 나쁜 패턴
df.select("*")                            # 모든 컬럼 로드
  .filter(F.udf(lambda x: x > 0)("amt")) # UDF는 Pushdown 불가
```

**4. PySpark UDF**
```python
# 일반 UDF (느림 - Python 직렬화)
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType

@udf(StringType())
def clean_text(text):
    return text.strip().lower()

df.withColumn("clean", clean_text("text"))

# Pandas UDF (빠름 - Arrow 사용)
from pyspark.sql.functions import pandas_udf
import pandas as pd

@pandas_udf(StringType())
def clean_text_fast(s: pd.Series) -> pd.Series:
    return s.str.strip().str.lower()

df.withColumn("clean", clean_text_fast("text"))
```

| UDF 유형 | 속도 | 사용 시점 |
|----------|------|----------|
| Python UDF | 느림 | 프로토타입, 복잡한 로직 |
| Pandas UDF | 빠름 | 벡터 연산 가능한 경우 |
| Scala UDF | 가장 빠름 | 성능 크리티컬 |
| Built-in | 최적 | 가능하면 항상 사용 |

#### 실습 과제

**과제: 대용량 로그 분석 파이프라인**

```
환경: Databricks Community Edition (무료)
데이터: NYC Taxi 또는 합성 로그 데이터 (1GB+)

요구사항:
1. 데이터 로드 및 스키마 확인
2. 다음 분석 수행:
   - 시간대별 요청 수 집계
   - 상위 10개 엔드포인트
   - 에러율 추이 (5분 윈도우)
   - 사용자별 세션 분석
3. 실행 계획 분석 및 최적화
   - explain() 결과 해석
   - 파티션 수 조정
   - 캐싱 적용
4. Pandas UDF로 커스텀 로직 구현

산출물:
- Databricks 노트북
- 최적화 전/후 성능 비교
- 실행 계획 스크린샷 및 해석
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 분석 완성도 | 4개 분석 모두 완료 | 30% |
| 최적화 | 2배 이상 성능 개선 | 25% |
| 코드 품질 | 함수화, 재사용 가능 | 20% |
| 실행 계획 이해 | 해석 정확 | 15% |
| Pandas UDF | 정상 동작 | 10% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 공식 | Spark SQL Guide | https://spark.apache.org/docs/latest/sql-programming-guide.html |
| 환경 | Databricks Community | https://community.cloud.databricks.com/ |
| 책 | Learning Spark, 2nd Ed | O'Reilly |
| 영상 | Spark Performance Tuning | https://www.youtube.com/watch?v=daXEp4HmS-E |
| 코스 | Coursera Spark Specialization | https://www.coursera.org/specializations/big-data |

---

### Week 6: Spark 심화 & Delta Lake

#### 학습 목표
- [ ] Structured Streaming으로 실시간 데이터를 처리할 수 있다
- [ ] Delta Lake의 ACID 트랜잭션과 Time Travel을 활용할 수 있다
- [ ] Spark 성능을 튜닝할 수 있다 (파티션, 캐싱, broadcast)
- [ ] Spark UI를 해석하여 병목을 찾을 수 있다

#### 핵심 개념

**1. Structured Streaming**
```python
# 스트리밍 소스에서 읽기
stream_df = (
    spark.readStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("subscribe", "events")
    .load()
)

# 처리 로직
processed = (
    stream_df
    .selectExpr("CAST(value AS STRING)")
    .select(F.from_json("value", schema).alias("data"))
    .select("data.*")
    .withWatermark("timestamp", "10 minutes")
    .groupBy(
        F.window("timestamp", "5 minutes"),
        "event_type"
    )
    .count()
)

# 싱크에 쓰기
query = (
    processed.writeStream
    .format("delta")
    .outputMode("append")
    .option("checkpointLocation", "/checkpoints/events")
    .start("/data/event_counts")
)
```

| 개념 | 설명 |
|------|------|
| Watermark | 늦은 데이터 허용 시간 |
| Window | 시간 기반 집계 윈도우 |
| Trigger | 처리 주기 (continuous, processingTime) |
| Checkpoint | 장애 복구용 상태 저장 |

**2. Delta Lake**
```python
# Delta 테이블 생성
df.write.format("delta").save("/data/events")

# ACID 트랜잭션
df.write.format("delta").mode("append").save("/data/events")

# Time Travel
spark.read.format("delta").option("versionAsOf", 5).load("/data/events")
spark.read.format("delta").option("timestampAsOf", "2024-01-01").load("/data/events")

# Schema Evolution
df_new.write.format("delta") \
    .option("mergeSchema", "true") \
    .mode("append") \
    .save("/data/events")

# MERGE (Upsert)
from delta.tables import DeltaTable

delta_table = DeltaTable.forPath(spark, "/data/events")
delta_table.alias("target").merge(
    updates.alias("source"),
    "target.id = source.id"
).whenMatchedUpdate(set={"value": "source.value"}) \
 .whenNotMatchedInsert(values={"id": "source.id", "value": "source.value"}) \
 .execute()
```

| 기능 | 설명 | 사용 시점 |
|------|------|----------|
| ACID | 원자적 쓰기 | 동시 쓰기 안전 |
| Time Travel | 과거 버전 조회 | 데이터 복구, 감사 |
| Schema Evolution | 스키마 자동 변경 | 컬럼 추가 |
| Z-Ordering | 데이터 정렬 | 쿼리 성능 |
| VACUUM | 오래된 파일 삭제 | 저장 공간 |

**3. 성능 튜닝**
```python
# 파티션 수 조정
spark.conf.set("spark.sql.shuffle.partitions", 200)
df.repartition(100, "date")  # 재파티셔닝

# 캐싱
df.cache()  # 메모리
df.persist(StorageLevel.DISK_ONLY)  # 디스크

# Broadcast Join (작은 테이블)
from pyspark.sql.functions import broadcast
large_df.join(broadcast(small_df), "key")

# AQE (Adaptive Query Execution)
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")
```

| 튜닝 기법 | 문제 상황 | 해결 |
|----------|----------|------|
| repartition | 데이터 skew | 균등 분배 |
| coalesce | 너무 많은 작은 파일 | 파티션 병합 |
| broadcast | 큰 테이블 + 작은 테이블 조인 | 작은 테이블 브로드캐스트 |
| cache | 반복 사용 DataFrame | 메모리 캐싱 |
| AQE | 런타임 최적화 | 자동 조정 |

**4. Spark UI 해석**
```
주요 탭:
- Jobs: 전체 작업 목록, 실행 시간
- Stages: 스테이지별 태스크 수, 시간
- Storage: 캐시된 RDD/DataFrame
- Environment: 설정 값
- Executors: 리소스 사용량

병목 징후:
- Stage 시간 불균형 → 데이터 skew
- Shuffle Write 높음 → 파티션 조정 필요
- GC Time 높음 → 메모리 부족
- Task 실패 → 데이터 문제 또는 OOM
```

#### 실습 과제

**과제: 실시간 처리 + Delta Lake**

```
시나리오: 이커머스 주문 스트림 처리

요구사항:
1. Kafka 시뮬레이션 (Rate Source 사용 가능)
2. Structured Streaming으로 처리:
   - 5분 윈도우 매출 집계
   - 이상 주문 탐지 (금액 > 평균 + 3σ)
3. Delta Lake에 저장
   - fact_orders (append)
   - agg_sales_5min (complete)
4. Time Travel 활용:
   - 1시간 전 데이터 비교
   - 잘못된 데이터 롤백
5. 성능 최적화:
   - Z-Ordering 적용
   - VACUUM 실행

산출물:
- Databricks 노트북
- 스트리밍 파이프라인 아키텍처 다이어그램
- Delta Lake 버전 히스토리 스크린샷
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 스트리밍 구현 | 정상 동작, 체크포인트 설정 | 30% |
| Delta Lake | ACID, Time Travel 활용 | 25% |
| 성능 튜닝 | Z-Ordering 효과 측정 | 20% |
| 이상 탐지 | 로직 정확 | 15% |
| 문서화 | 아키텍처 다이어그램 | 10% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 공식 | Delta Lake Documentation | https://docs.delta.io/ |
| 공식 | Structured Streaming Guide | https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html |
| 영상 | Delta Lake Deep Dive | https://www.youtube.com/watch?v=7ewmcdrylsA |
| 튜토리얼 | Databricks Delta Lake 101 | https://www.databricks.com/learn/training/delta-lake-101 |

---

### Week 7: 워크플로우 오케스트레이션

#### 학습 목표
- [ ] Airflow DAG를 설계하고 작성할 수 있다
- [ ] 스케줄링, 의존성, 에러 핸들링을 구현할 수 있다
- [ ] Airflow vs Dagster vs Prefect 차이를 이해할 수 있다
- [ ] 실무 수준의 ETL 워크플로우를 구축할 수 있다

#### 핵심 개념

**1. Apache Airflow**
```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'data_team',
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'email_on_failure': True,
    'email': ['alert@company.com'],
}

with DAG(
    'daily_etl',
    default_args=default_args,
    schedule_interval='0 6 * * *',  # 매일 06:00
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['etl', 'daily'],
) as dag:

    extract = PythonOperator(
        task_id='extract_data',
        python_callable=extract_from_source,
    )

    transform = PythonOperator(
        task_id='transform_data',
        python_callable=transform_data,
    )

    load = PostgresOperator(
        task_id='load_to_warehouse',
        postgres_conn_id='warehouse',
        sql='sql/load_data.sql',
    )

    notify = PythonOperator(
        task_id='send_notification',
        python_callable=send_slack_notification,
        trigger_rule='all_done',  # 성공/실패 상관없이 실행
    )

    extract >> transform >> load >> notify
```

| 개념 | 설명 |
|------|------|
| DAG | 방향성 비순환 그래프 (작업 흐름) |
| Operator | 작업 단위 (Python, Bash, SQL 등) |
| Sensor | 조건 대기 (파일 존재, API 응답) |
| XCom | 태스크 간 데이터 전달 |
| Connection | 외부 시스템 연결 정보 |
| Variable | 설정 값 저장 |

**2. 고급 패턴**
```python
# TaskGroup (태스크 그룹화)
from airflow.utils.task_group import TaskGroup

with TaskGroup("processing") as processing_group:
    task1 = PythonOperator(task_id='step1', ...)
    task2 = PythonOperator(task_id='step2', ...)
    task1 >> task2

# Dynamic Task Mapping (동적 태스크)
@task
def process_file(file_path: str):
    return process(file_path)

files = ['a.csv', 'b.csv', 'c.csv']
process_file.expand(file_path=files)  # 3개 태스크 동적 생성

# BranchPythonOperator (조건 분기)
def choose_branch(**context):
    if context['params']['env'] == 'prod':
        return 'production_task'
    return 'staging_task'

branch = BranchPythonOperator(
    task_id='branch',
    python_callable=choose_branch,
)
```

**3. 에러 핸들링 & SLA**
```python
# Retry 설정
task = PythonOperator(
    task_id='flaky_task',
    python_callable=call_external_api,
    retries=5,
    retry_delay=timedelta(minutes=2),
    retry_exponential_backoff=True,
    max_retry_delay=timedelta(minutes=30),
)

# SLA 설정
dag = DAG(
    'critical_pipeline',
    sla_miss_callback=alert_sla_miss,
)

task = PythonOperator(
    task_id='important_task',
    sla=timedelta(hours=2),  # 2시간 내 완료 필수
)

# 실패 콜백
def on_failure(context):
    send_alert(f"Task {context['task_instance'].task_id} failed")

task = PythonOperator(
    task_id='monitored_task',
    on_failure_callback=on_failure,
)
```

**4. Airflow vs 대안**
| 항목 | Airflow | Dagster | Prefect |
|------|---------|---------|---------|
| 철학 | 태스크 중심 | 자산(Asset) 중심 | 워크플로우 중심 |
| 학습 곡선 | 높음 | 중간 | 낮음 |
| UI | 표준 | 훌륭함 | 훌륭함 |
| 테스트 | 어려움 | 쉬움 | 쉬움 |
| dbt 통합 | 플러그인 | 네이티브 (최고) | 좋음 |
| 시장 점유율 | 압도적 1위 | 성장 중 | 성장 중 |
| 추천 | 대규모 팀, 기존 사용 | dbt 중심, 신규 구축 | 빠른 시작, 소규모 |

```python
# Dagster 예시 (Asset 중심)
from dagster import asset, Definitions

@asset
def raw_orders():
    return pd.read_csv("orders.csv")

@asset
def cleaned_orders(raw_orders):
    return raw_orders.dropna()

@asset
def order_summary(cleaned_orders):
    return cleaned_orders.groupby("product").sum()

defs = Definitions(assets=[raw_orders, cleaned_orders, order_summary])
```

#### 실습 과제

**과제: ETL 워크플로우 자동화**

```
시나리오: 일일 이커머스 데이터 파이프라인

요구사항:
1. DAG 3개 작성:

   DAG 1: daily_extract
   - API에서 주문 데이터 추출
   - S3에 raw 저장
   - 6시간마다 실행

   DAG 2: daily_transform
   - raw 데이터 정제
   - 집계 테이블 생성
   - daily_extract 완료 후 트리거

   DAG 3: weekly_report
   - 주간 리포트 생성
   - 이메일 발송
   - 매주 월요일 09:00

2. 에러 핸들링:
   - 재시도 로직
   - Slack 알림
   - SLA 설정

3. 모니터링:
   - 로그 확인
   - 메트릭 수집

산출물:
- DAG 파일 3개
- docker-compose.yml (로컬 Airflow)
- 실행 스크린샷
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| DAG 구조 | 3개 DAG 정상 동작 | 35% |
| 에러 핸들링 | retry, callback 설정 | 25% |
| 스케줄링 | 의존성, 트리거 정확 | 20% |
| 코드 품질 | 모듈화, 재사용 | 10% |
| 문서화 | README 포함 | 10% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 공식 | Airflow Documentation | https://airflow.apache.org/docs/ |
| 코스 | Astronomer Certification | https://academy.astronomer.io/ |
| 비교 | Dagster vs Airflow | https://dagster.io/vs/dagster-vs-airflow |
| 책 | Data Pipelines with Airflow | Manning |
| 템플릿 | Airflow Docker | https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html |

---

### Week 7.5: dbt (Data Build Tool) 기초

> **소요 시간**: 2-3일 (Week 8 시작 전 선택적 학습)
>
> dbt는 현대 데이터 엔지니어링의 필수 도구입니다. Week 8 프로젝트에서 Transform 단계에 사용됩니다.

#### 학습 목표
- [ ] dbt의 역할과 ELT 패러다임을 설명할 수 있다
- [ ] dbt 프로젝트를 구성하고 모델을 작성할 수 있다
- [ ] dbt 테스트와 문서화를 수행할 수 있다
- [ ] Airflow + dbt 통합을 구현할 수 있다

#### 핵심 개념

**1. dbt란?**

```
ELT 파이프라인:
Extract → Load → Transform (dbt가 담당)
                     ↓
              SQL 기반 변환
              버전 관리 (Git)
              테스트 자동화
              문서 자동 생성
```

| 항목 | 전통적 ETL | dbt (ELT) |
|------|-----------|-----------|
| 변환 위치 | 별도 서버 | 데이터 웨어하우스 내부 |
| 언어 | Python, Java 등 | SQL |
| 버전 관리 | 어려움 | Git 네이티브 |
| 테스트 | 별도 구현 | 내장 |
| 문서화 | 수동 | 자동 생성 |

**2. dbt 프로젝트 구조**

```
my_dbt_project/
├── dbt_project.yml          # 프로젝트 설정
├── profiles.yml             # DB 연결 정보 (보통 ~/.dbt/)
├── models/
│   ├── staging/             # 원본 데이터 정제
│   │   ├── stg_orders.sql
│   │   └── stg_customers.sql
│   ├── intermediate/        # 중간 변환
│   │   └── int_orders_enriched.sql
│   └── marts/               # 최종 분석용 테이블
│       ├── dim_customers.sql
│       └── fact_orders.sql
├── tests/                   # 커스텀 테스트
├── macros/                  # 재사용 함수
├── seeds/                   # CSV 정적 데이터
└── snapshots/               # SCD Type 2
```

**3. dbt 모델 작성**

```sql
-- models/staging/stg_orders.sql
{{ config(materialized='view') }}

SELECT
    id AS order_id,
    user_id AS customer_id,
    order_date,
    status,
    amount
FROM {{ source('raw', 'orders') }}
WHERE order_date >= '2024-01-01'
```

```sql
-- models/marts/fact_orders.sql
{{ config(
    materialized='incremental',
    unique_key='order_id'
) }}

SELECT
    o.order_id,
    o.customer_id,
    c.customer_name,
    o.order_date,
    o.amount,
    CURRENT_TIMESTAMP AS updated_at
FROM {{ ref('stg_orders') }} o
LEFT JOIN {{ ref('dim_customers') }} c
    ON o.customer_id = c.customer_id

{% if is_incremental() %}
WHERE o.order_date > (SELECT MAX(order_date) FROM {{ this }})
{% endif %}
```

**4. dbt 테스트**

```yaml
# models/schema.yml
version: 2

models:
  - name: stg_orders
    description: "주문 원본 데이터 정제"
    columns:
      - name: order_id
        description: "주문 고유 ID"
        tests:
          - unique
          - not_null
      - name: amount
        tests:
          - not_null

  - name: fact_orders
    tests:
      - dbt_utils.recency:
          datepart: day
          field: order_date
          interval: 1
```

**5. dbt 명령어**

```bash
# 프로젝트 초기화
dbt init my_project

# 연결 테스트
dbt debug

# 모델 실행
dbt run                      # 전체
dbt run --select stg_orders  # 특정 모델
dbt run --select marts.*     # 폴더 전체

# 테스트
dbt test

# 문서 생성
dbt docs generate
dbt docs serve

# 전체 파이프라인
dbt build  # run + test
```

**6. Airflow + dbt 통합**

```python
# dags/dbt_pipeline.py
from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime

with DAG(
    'dbt_daily_pipeline',
    schedule_interval='0 6 * * *',
    start_date=datetime(2024, 1, 1),
    catchup=False,
) as dag:

    dbt_run_staging = BashOperator(
        task_id='dbt_run_staging',
        bash_command='cd /path/to/dbt && dbt run --select staging.*',
    )

    dbt_run_marts = BashOperator(
        task_id='dbt_run_marts',
        bash_command='cd /path/to/dbt && dbt run --select marts.*',
    )

    dbt_test = BashOperator(
        task_id='dbt_test',
        bash_command='cd /path/to/dbt && dbt test',
    )

    dbt_run_staging >> dbt_run_marts >> dbt_test
```

#### 실습 과제

```
과제: dbt로 분석 파이프라인 구축

요구사항:
1. dbt 프로젝트 생성 (PostgreSQL 또는 DuckDB)
2. 모델 구조:
   - staging: 원본 테이블 정제 (2개)
   - marts: 최종 분석 테이블 (1개)
3. 테스트:
   - unique, not_null 기본 테스트
4. 문서화:
   - 모든 모델/컬럼 description
   - dbt docs 생성

산출물:
- dbt 프로젝트 폴더
- 문서 스크린샷
```

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 공식 | dbt Documentation | https://docs.getdbt.com/ |
| 코스 | dbt Fundamentals (무료) | https://courses.getdbt.com/ |
| 영상 | dbt Tutorial | https://www.youtube.com/watch?v=5rNquRnNb4E |

---

### Week 8: E2E 파이프라인 프로젝트

#### 학습 목표
- [ ] 처음부터 끝까지 데이터 파이프라인을 독립적으로 설계/구현할 수 있다
- [ ] 데이터 품질 검증을 구현할 수 있다
- [ ] 모니터링과 알림을 설정할 수 있다
- [ ] 프로젝트를 문서화하고 발표할 수 있다

#### 프로젝트 개요

**포트폴리오 #1: E2E 데이터 파이프라인**

```
아키텍처:

[Source]          [Ingestion]        [Storage]         [Transform]        [Serve]
┌─────────┐       ┌─────────┐       ┌─────────┐       ┌─────────┐       ┌─────────┐
│  API    │──────▶│ Python  │──────▶│  S3     │──────▶│  Spark  │──────▶│  DW     │
│  CSV    │       │ Airflow │       │ (Raw)   │       │ dbt     │       │  BI     │
│  DB     │       │         │       │         │       │         │       │         │
└─────────┘       └─────────┘       └─────────┘       └─────────┘       └─────────┘
                       │                                    │
                       ▼                                    ▼
                  ┌─────────┐                         ┌─────────┐
                  │ Great   │                         │ Quality │
                  │ Expect. │                         │ Checks  │
                  └─────────┘                         └─────────┘
```

#### 프로젝트 요구사항

**1. 데이터 소스 (1개 이상 선택)**
- 공공 API (기상청, 교통, 금융)
- 웹 스크래핑 (합법적인 사이트)
- Kaggle 데이터셋
- 자체 생성 데이터

**2. 수집 (Ingestion)**
```python
# 요구사항:
- 증분 수집 (Incremental Load)
- 멱등성 보장 (재실행해도 중복 없음)
- 에러 핸들링 (재시도, 알림)
- 메타데이터 저장 (수집 시간, 건수)
```

**3. 저장 (Storage)**
```
요구사항:
- Raw Layer: 원본 그대로 저장
- Staging Layer: 정제된 데이터
- Analytics Layer: 분석용 테이블

구조 예시:
s3://my-bucket/
├── raw/
│   └── orders/
│       └── date=2024-01-15/
│           └── orders_20240115_120000.parquet
├── staging/
│   └── orders_cleaned/
└── analytics/
    ├── fact_orders/
    └── dim_customers/
```

**4. 변환 (Transform)**
```python
# 요구사항:
- Spark 또는 SQL 기반
- SCD Type 2 (최소 1개 테이블)
- 집계 테이블 (일별, 주별)
- 데이터 품질 검증
```

**5. 데이터 품질 (Great Expectations)**
```python
import great_expectations as gx

context = gx.get_context()

# 기대치 정의
expectation_suite = context.add_expectation_suite("orders_suite")

# 컬럼 검증
validator.expect_column_values_to_not_be_null("order_id")
validator.expect_column_values_to_be_between("amount", 0, 1000000)
validator.expect_column_values_to_be_unique("order_id")

# 테이블 검증
validator.expect_table_row_count_to_be_between(1000, 1000000)
```

**6. 오케스트레이션 (Airflow)**
```python
# 요구사항:
- 일일 스케줄링
- 태스크 의존성 명확
- 실패 시 알림
- SLA 설정
```

**7. 모니터링 & 문서화**
```
모니터링:
- 실행 로그
- 처리 건수 메트릭
- 소요 시간 추적
- 실패 알림 (Slack/Email)

문서화:
- README.md
- 아키텍처 다이어그램
- 데이터 딕셔너리
- 트러블슈팅 가이드
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| **아키텍처** | E2E 흐름 완성, 다이어그램 명확 | 15% |
| **수집** | 증분 로드, 멱등성 보장 | 15% |
| **저장** | 계층 구조 명확, 파티셔닝 | 10% |
| **변환** | SCD, 집계, 정확성 | 20% |
| **품질** | Great Expectations 통합 | 15% |
| **오케스트레이션** | DAG 완성, 에러 핸들링 | 15% |
| **문서화** | README, 다이어그램 | 10% |

#### 프로젝트 일정

| 일차 | 활동 | 산출물 |
|------|------|--------|
| 1-2 | 설계 | 아키텍처 다이어그램, 데이터 모델 |
| 3-4 | 수집 구현 | 수집 스크립트, 테스트 |
| 5 | 저장소 구성 | S3 구조, 스키마 |
| 6-7 | 변환 구현 | Spark/SQL 스크립트 |
| 8 | 품질 검증 | Great Expectations Suite |
| 9 | 오케스트레이션 | Airflow DAG |
| 10 | 통합 테스트 | E2E 실행 |
| 11-12 | 문서화 & 발표 | README, 발표 자료 |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 템플릿 | Data Pipeline Template | https://github.com/josephmachado/data_engineering_project_template |
| 도구 | Great Expectations | https://docs.greatexpectations.io/ |
| 참고 | DE Zoomcamp Project | https://github.com/DataTalksClub/data-engineering-zoomcamp |
| 영상 | Building Data Pipelines | https://www.youtube.com/watch?v=5xpKX2VxaYU |

---

## Phase 1 완료 기준

### 필수 산출물
1. [ ] Week 1: Python 유틸리티 라이브러리 (데코레이터, 제너레이터)
2. [ ] Week 2: 1GB+ 데이터 처리 벤치마크 노트북
3. [ ] Week 3: SQL 쿼리 포트폴리오 (20개)
4. [ ] Week 4: ERD + DDL 스크립트
5. [ ] Week 5: Spark 분석 노트북
6. [ ] Week 6: Delta Lake 스트리밍 파이프라인
7. [ ] Week 7: Airflow DAG 3개
8. [ ] **Week 8: 포트폴리오 #1 - E2E 데이터 파이프라인**

### 역량 체크리스트
- [ ] 대용량 데이터를 메모리 효율적으로 처리할 수 있다
- [ ] 복잡한 SQL 분석 쿼리를 작성할 수 있다
- [ ] 데이터 웨어하우스 스키마를 설계할 수 있다
- [ ] Spark로 분산 처리를 구현할 수 있다
- [ ] Airflow로 워크플로우를 자동화할 수 있다
- [ ] E2E 파이프라인을 독립적으로 구축할 수 있다

---

*Phase 1 완료 → Phase 2: 데이터 분석 & 컨설팅으로 이동*
