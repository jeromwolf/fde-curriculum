// Day 3: SCD (Slowly Changing Dimension)
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'w4d3-video-scd-intro',
    type: 'video',
    title: 'SCD(Slowly Changing Dimension)란?',
    duration: 15,
    access: 'core',
    content: {
      objectives: [
        'SCD의 개념과 필요성 이해',
        'Type 1, 2, 3의 차이 파악',
        '각 Type의 사용 시점 판단'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dDPnCrJa_DM',
      transcript: `## SCD (Slowly Changing Dimension)란?

차원 테이블의 데이터가 **천천히 변경**될 때 이를 어떻게 처리할지 결정하는 방법론입니다.

### 예시: 고객 주소 변경

고객 "Kim"이 Seoul에서 Busan으로 이사했다면?

**질문 1**: 과거 주문의 배송지는?
- Seoul (변경 전 주소)

**질문 2**: 현재 주소는?
- Busan (변경 후 주소)

**질문 3**: 분석 시 어떤 주소를 사용?
- 목적에 따라 다름!

### SCD Type 종류

**Type 0**: 변경하지 않음 (원본 유지)
**Type 1**: 덮어쓰기 (이력 없음)
**Type 2**: 새 행 추가 (전체 이력 보존)
**Type 3**: 이전/현재 컬럼 (제한된 이력)
**Type 4**: 별도 이력 테이블
**Type 6**: Type 1+2+3 조합 (Hybrid)

### 실무에서 가장 많이 사용

- **Type 1**: 오타 수정, 단순 업데이트
- **Type 2**: 주소, 등급, 부서 변경 (이력 중요)`,
      keyPoints: [
        'SCD = 차원 데이터 변경 처리 방법',
        'Type 1: 덮어쓰기 (이력 X)',
        'Type 2: 새 행 추가 (이력 O)',
        'Type 3: 이전/현재 컬럼',
        '실무: Type 1, 2를 가장 많이 사용'
      ]
    }
  },
  {
    id: 'w4d3-reading-scd-types',
    type: 'reading',
    title: 'SCD Type 상세 비교',
    duration: 20,
    access: 'core',
    content: {
      markdown: `# SCD Type 상세 비교

## Type 0: Retain Original (원본 유지)

- 한번 입력된 값은 **절대 변경하지 않음**
- 사용 시점: 생년월일, 원래 가입일 등

\`\`\`sql
-- Type 0: 변경 시도해도 무시
-- original_signup_date는 항상 최초 값 유지
\`\`\`

## Type 1: Overwrite (덮어쓰기)

- 기존 값을 새 값으로 **덮어씀**
- **이력이 사라짐**
- 사용 시점: 오타 수정, 중요하지 않은 변경

\`\`\`sql
-- 기존 데이터
| customer_id | name | city   |
|-------------|------|--------|
| 1           | Kim  | Seoul  |

-- Type 1 적용 후 (이사)
UPDATE dim_customer SET city = 'Busan' WHERE customer_id = 1;

| customer_id | name | city   |
|-------------|------|--------|
| 1           | Kim  | Busan  |

-- Seoul 이력은 사라짐!
\`\`\`

## Type 2: Add New Row (새 행 추가) ⭐

- 변경될 때마다 **새 행 추가**
- **전체 이력 보존**
- 추가 컬럼 필요: start_date, end_date, is_current

\`\`\`sql
-- 기존 데이터
| customer_key | customer_id | city   | start_date | end_date   | is_current |
|--------------|-------------|--------|------------|------------|------------|
| 1            | C001        | Seoul  | 2023-01-01 | 9999-12-31 | TRUE       |

-- Type 2 적용 후 (2024-06-01 이사)
-- Step 1: 기존 행 종료
UPDATE dim_customer
SET end_date = '2024-05-31', is_current = FALSE
WHERE customer_id = 'C001' AND is_current = TRUE;

-- Step 2: 새 행 추가
INSERT INTO dim_customer (customer_id, city, start_date, end_date, is_current)
VALUES ('C001', 'Busan', '2024-06-01', '9999-12-31', TRUE);

-- 결과
| customer_key | customer_id | city   | start_date | end_date   | is_current |
|--------------|-------------|--------|------------|------------|------------|
| 1            | C001        | Seoul  | 2023-01-01 | 2024-05-31 | FALSE      |
| 2            | C001        | Busan  | 2024-06-01 | 9999-12-31 | TRUE       |
\`\`\`

### Type 2 조회 패턴

\`\`\`sql
-- 현재 데이터만 조회
SELECT * FROM dim_customer WHERE is_current = TRUE;

-- 특정 시점의 데이터 조회 (Point-in-Time)
SELECT * FROM dim_customer
WHERE '2024-03-15' BETWEEN start_date AND end_date;

-- 이력 전체 조회
SELECT * FROM dim_customer WHERE customer_id = 'C001' ORDER BY start_date;
\`\`\`

## Type 3: Add New Column (새 컬럼 추가)

- 이전 값과 현재 값을 **별도 컬럼**에 저장
- **제한된 이력** (직전 값만 보존)

\`\`\`sql
-- Type 3 스키마
| customer_id | current_city | previous_city | city_change_date |
|-------------|--------------|---------------|------------------|
| C001        | Busan        | Seoul         | 2024-06-01       |

-- 한번 더 이사하면?
| customer_id | current_city | previous_city | city_change_date |
|-------------|--------------|---------------|------------------|
| C001        | Incheon      | Busan         | 2024-12-01       |
-- Seoul 이력은 사라짐!
\`\`\`

## Type 비교 요약

| Type | 이력 보존 | 저장 공간 | 쿼리 복잡도 | 사용 시점 |
|------|----------|----------|------------|----------|
| 0 | 원본만 | 최소 | 단순 | 불변 속성 |
| 1 | 없음 | 최소 | 단순 | 오타 수정 |
| **2** | **전체** | **증가** | **복잡** | **주소, 등급** |
| 3 | 직전만 | 중간 | 중간 | 가격 변경 |

## 실무 권장

1. **Type 1**: 대부분의 단순 변경
2. **Type 2**: 이력이 중요한 속성 (주소, 등급, 부서)
3. **Type 3**: 직전 값만 필요한 경우 (이전 가격)`,
      externalLinks: [
        {
          title: 'Kimball SCD Techniques',
          url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/type-1-2-3/'
        }
      ]
    }
  },
  {
    id: 'w4d3-code-scd-type1',
    type: 'code',
    title: '실습: SCD Type 1 구현',
    duration: 20,
    access: 'core',
    content: {
      instructions: `SCD Type 1 (덮어쓰기) 패턴을 구현합니다.

**문제 1**: Type 1 테이블 생성
**문제 2**: MERGE를 사용한 Upsert 구현
**문제 3**: 배치 업데이트 처리`,
      starterCode: `-- SCD Type 1 구현

-- 문제 1: 고객 테이블 생성
CREATE TABLE dim_customer_type1 (
    customer_key SERIAL PRIMARY KEY,
    customer_id VARCHAR(20) UNIQUE,
    name VARCHAR(100),
    email VARCHAR(100),
    city VARCHAR(50),
    segment VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 초기 데이터
INSERT INTO dim_customer_type1 (customer_id, name, email, city, segment) VALUES
('C001', 'Kim Min', 'kim@email.com', 'Seoul', 'Regular'),
('C002', 'Lee Su', 'lee@email.com', 'Busan', 'Premium'),
('C003', 'Park Ji', 'park@email.com', 'Seoul', 'Regular');

-- 문제 2: MERGE (Upsert) 구현
-- 소스 데이터: 변경된 고객 정보
CREATE TEMP TABLE staging_customers (
    customer_id VARCHAR(20),
    name VARCHAR(100),
    email VARCHAR(100),
    city VARCHAR(50),
    segment VARCHAR(20)
);

INSERT INTO staging_customers VALUES
('C001', 'Kim Min', 'kim_new@email.com', 'Busan', 'Premium'),  -- 이사 + 등급변경
('C002', 'Lee Su', 'lee@email.com', 'Busan', 'Premium'),        -- 변경없음
('C004', 'Choi Yu', 'choi@email.com', 'Incheon', 'Regular');    -- 신규

-- PostgreSQL MERGE 구현 (INSERT ... ON CONFLICT)


-- 문제 3: 배치 업데이트 결과 확인 쿼리

`,
      solutionCode: `-- SCD Type 1 구현

-- 문제 1: 테이블 생성
DROP TABLE IF EXISTS dim_customer_type1 CASCADE;
CREATE TABLE dim_customer_type1 (
    customer_key SERIAL PRIMARY KEY,
    customer_id VARCHAR(20) UNIQUE,
    name VARCHAR(100),
    email VARCHAR(100),
    city VARCHAR(50),
    segment VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 초기 데이터
INSERT INTO dim_customer_type1 (customer_id, name, email, city, segment) VALUES
('C001', 'Kim Min', 'kim@email.com', 'Seoul', 'Regular'),
('C002', 'Lee Su', 'lee@email.com', 'Busan', 'Premium'),
('C003', 'Park Ji', 'park@email.com', 'Seoul', 'Regular');

-- 초기 상태 확인
SELECT * FROM dim_customer_type1;
/*
| customer_key | customer_id | name     | email         | city  | segment |
|--------------|-------------|----------|---------------|-------|---------|
| 1            | C001        | Kim Min  | kim@email.com | Seoul | Regular |
| 2            | C002        | Lee Su   | lee@email.com | Busan | Premium |
| 3            | C003        | Park Ji  | park@email.com| Seoul | Regular |
*/


-- 문제 2: MERGE (Upsert) 구현
DROP TABLE IF EXISTS staging_customers;
CREATE TEMP TABLE staging_customers (
    customer_id VARCHAR(20),
    name VARCHAR(100),
    email VARCHAR(100),
    city VARCHAR(50),
    segment VARCHAR(20)
);

INSERT INTO staging_customers VALUES
('C001', 'Kim Min', 'kim_new@email.com', 'Busan', 'Premium'),  -- 변경: email, city, segment
('C002', 'Lee Su', 'lee@email.com', 'Busan', 'Premium'),        -- 변경 없음
('C004', 'Choi Yu', 'choi@email.com', 'Incheon', 'Regular');    -- 신규

-- PostgreSQL INSERT ON CONFLICT (UPSERT)
INSERT INTO dim_customer_type1 (customer_id, name, email, city, segment, updated_at)
SELECT customer_id, name, email, city, segment, CURRENT_TIMESTAMP
FROM staging_customers
ON CONFLICT (customer_id)
DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    city = EXCLUDED.city,
    segment = EXCLUDED.segment,
    updated_at = CURRENT_TIMESTAMP;


-- 문제 3: 결과 확인
SELECT * FROM dim_customer_type1 ORDER BY customer_key;
/*
| customer_key | customer_id | name     | email              | city    | segment |
|--------------|-------------|----------|--------------------|---------|---------|
| 1            | C001        | Kim Min  | kim_new@email.com  | Busan   | Premium | <- 업데이트됨
| 2            | C002        | Lee Su   | lee@email.com      | Busan   | Premium |
| 3            | C003        | Park Ji  | park@email.com     | Seoul   | Regular |
| 4            | C004        | Choi Yu  | choi@email.com     | Incheon | Regular | <- 신규 추가

주의: C001의 이전 정보(Seoul, Regular)는 사라짐!
*/


-- 변경 추적 (Type 1에서는 제한적)
SELECT
    customer_id,
    name,
    city,
    segment,
    CASE
        WHEN updated_at > CURRENT_TIMESTAMP - INTERVAL '1 hour'
        THEN 'Recently Updated'
        ELSE 'Old'
    END as update_status
FROM dim_customer_type1
ORDER BY updated_at DESC;`,
      hints: [
        'ON CONFLICT (unique_column) DO UPDATE',
        'EXCLUDED로 새 데이터 참조',
        'updated_at으로 마지막 변경 시점 추적',
        'Type 1은 이력이 사라짐에 주의'
      ]
    }
  },
  {
    id: 'w4d3-code-scd-type2',
    type: 'code',
    title: '실습: SCD Type 2 구현',
    duration: 35,
    access: 'core',
    content: {
      instructions: `SCD Type 2 (새 행 추가) 패턴을 구현합니다.

**문제 1**: Type 2 테이블 설계 (surrogate key, start/end date, is_current)
**문제 2**: 신규 삽입, 변경 처리 로직 구현
**문제 3**: Point-in-Time 조회 쿼리`,
      starterCode: `-- SCD Type 2 구현

-- 문제 1: Type 2 테이블 설계
-- 추가 컬럼: start_date, end_date, is_current


-- 초기 데이터 삽입


-- 문제 2: 변경 처리
-- C001 고객이 2024-06-01에 Seoul → Busan으로 이사
-- Step 1: 기존 행 종료
-- Step 2: 새 행 추가


-- C001 고객이 2024-09-01에 등급 변경 Regular → Premium
-- Step 1: 기존 행 종료
-- Step 2: 새 행 추가


-- 문제 3: 조회 쿼리
-- Q1: 현재 데이터만 조회


-- Q2: 2024-07-15 시점의 C001 정보 조회 (Point-in-Time)


-- Q3: C001의 전체 이력 조회

`,
      solutionCode: `-- SCD Type 2 구현

-- 문제 1: Type 2 테이블 설계
DROP TABLE IF EXISTS dim_customer_type2 CASCADE;
CREATE TABLE dim_customer_type2 (
    customer_key SERIAL PRIMARY KEY,        -- Surrogate Key
    customer_id VARCHAR(20) NOT NULL,       -- Natural Key (Business Key)
    name VARCHAR(100),
    email VARCHAR(100),
    city VARCHAR(50),
    segment VARCHAR(20),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL DEFAULT '9999-12-31',
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성 (조회 성능)
CREATE INDEX idx_customer_current ON dim_customer_type2(customer_id, is_current);
CREATE INDEX idx_customer_date ON dim_customer_type2(customer_id, start_date, end_date);

-- 초기 데이터 (2024-01-01 기준)
INSERT INTO dim_customer_type2 (customer_id, name, email, city, segment, start_date) VALUES
('C001', 'Kim Min', 'kim@email.com', 'Seoul', 'Regular', '2024-01-01'),
('C002', 'Lee Su', 'lee@email.com', 'Busan', 'Premium', '2024-01-01'),
('C003', 'Park Ji', 'park@email.com', 'Seoul', 'Regular', '2024-01-01');

SELECT * FROM dim_customer_type2;
/*
| customer_key | customer_id | name    | city  | segment | start_date | end_date   | is_current |
|--------------|-------------|---------|-------|---------|------------|------------|------------|
| 1            | C001        | Kim Min | Seoul | Regular | 2024-01-01 | 9999-12-31 | TRUE       |
| 2            | C002        | Lee Su  | Busan | Premium | 2024-01-01 | 9999-12-31 | TRUE       |
| 3            | C003        | Park Ji | Seoul | Regular | 2024-01-01 | 9999-12-31 | TRUE       |
*/


-- 문제 2: 변경 처리

-- 변경 1: C001 고객이 2024-06-01에 Seoul → Busan으로 이사
-- Step 1: 기존 행 종료
UPDATE dim_customer_type2
SET end_date = '2024-05-31', is_current = FALSE
WHERE customer_id = 'C001' AND is_current = TRUE;

-- Step 2: 새 행 추가
INSERT INTO dim_customer_type2 (customer_id, name, email, city, segment, start_date)
SELECT 'C001', name, email, 'Busan', segment, '2024-06-01'
FROM dim_customer_type2
WHERE customer_id = 'C001' AND end_date = '2024-05-31';

SELECT * FROM dim_customer_type2 WHERE customer_id = 'C001' ORDER BY start_date;
/*
| customer_key | customer_id | city  | segment | start_date | end_date   | is_current |
|--------------|-------------|-------|---------|------------|------------|------------|
| 1            | C001        | Seoul | Regular | 2024-01-01 | 2024-05-31 | FALSE      |
| 4            | C001        | Busan | Regular | 2024-06-01 | 9999-12-31 | TRUE       |
*/


-- 변경 2: C001 고객이 2024-09-01에 등급 변경 Regular → Premium
-- Step 1: 기존 행 종료
UPDATE dim_customer_type2
SET end_date = '2024-08-31', is_current = FALSE
WHERE customer_id = 'C001' AND is_current = TRUE;

-- Step 2: 새 행 추가
INSERT INTO dim_customer_type2 (customer_id, name, email, city, segment, start_date)
SELECT 'C001', name, email, city, 'Premium', '2024-09-01'
FROM dim_customer_type2
WHERE customer_id = 'C001' AND end_date = '2024-08-31';


-- 문제 3: 조회 쿼리

-- Q1: 현재 데이터만 조회
SELECT customer_id, name, city, segment
FROM dim_customer_type2
WHERE is_current = TRUE
ORDER BY customer_id;
/*
| customer_id | name    | city  | segment |
|-------------|---------|-------|---------|
| C001        | Kim Min | Busan | Premium |
| C002        | Lee Su  | Busan | Premium |
| C003        | Park Ji | Seoul | Regular |
*/


-- Q2: 2024-07-15 시점의 C001 정보 조회 (Point-in-Time)
SELECT customer_id, name, city, segment, start_date, end_date
FROM dim_customer_type2
WHERE customer_id = 'C001'
  AND '2024-07-15' BETWEEN start_date AND end_date;
/*
| customer_id | name    | city  | segment | start_date | end_date   |
|-------------|---------|-------|---------|------------|------------|
| C001        | Kim Min | Busan | Regular | 2024-06-01 | 2024-08-31 |
-- 2024-07-15는 이사 후, 등급 변경 전!
*/


-- Q3: C001의 전체 이력 조회
SELECT
    customer_key,
    customer_id,
    city,
    segment,
    start_date,
    end_date,
    is_current,
    CASE WHEN is_current THEN '현재' ELSE '과거' END as status
FROM dim_customer_type2
WHERE customer_id = 'C001'
ORDER BY start_date;
/*
| customer_key | customer_id | city  | segment | start_date | end_date   | status |
|--------------|-------------|-------|---------|------------|------------|--------|
| 1            | C001        | Seoul | Regular | 2024-01-01 | 2024-05-31 | 과거   |
| 4            | C001        | Busan | Regular | 2024-06-01 | 2024-08-31 | 과거   |
| 5            | C001        | Busan | Premium | 2024-09-01 | 9999-12-31 | 현재   |
*/


-- 보너스: SCD Type 2 변경 처리 프로시저
CREATE OR REPLACE PROCEDURE update_customer_type2(
    p_customer_id VARCHAR(20),
    p_name VARCHAR(100),
    p_email VARCHAR(100),
    p_city VARCHAR(50),
    p_segment VARCHAR(20),
    p_change_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Step 1: 기존 현재 행 종료
    UPDATE dim_customer_type2
    SET end_date = p_change_date - 1, is_current = FALSE
    WHERE customer_id = p_customer_id AND is_current = TRUE;

    -- Step 2: 새 행 추가
    INSERT INTO dim_customer_type2 (customer_id, name, email, city, segment, start_date)
    VALUES (p_customer_id, p_name, p_email, p_city, p_segment, p_change_date);
END;
$$;

-- 프로시저 사용 예
-- CALL update_customer_type2('C001', 'Kim Min', 'kim@email.com', 'Incheon', 'VIP', '2024-12-01');`,
      hints: [
        'Surrogate Key (customer_key) vs Natural Key (customer_id)',
        'end_date = 9999-12-31로 현재 행 표시',
        'is_current 컬럼으로 빠른 현재 조회',
        'Point-in-Time: date BETWEEN start_date AND end_date'
      ]
    }
  },
  {
    id: 'w4d3-quiz-scd',
    type: 'quiz',
    title: '퀴즈: SCD',
    duration: 15,
    access: 'core',
    content: {
      questions: [
        {
          question: 'SCD Type 2의 핵심 특징은?',
          options: [
            '기존 값을 덮어씀',
            '새 컬럼에 이전 값 저장',
            '변경 시 새 행 추가 (이력 보존)',
            '변경하지 않음'
          ],
          answer: 2,
          explanation: 'SCD Type 2는 변경될 때마다 새 행을 추가하여 전체 이력을 보존합니다.'
        },
        {
          question: 'SCD Type 2에서 현재 행을 표시하는 일반적인 방법은?',
          options: [
            'start_date = NULL',
            'end_date = "9999-12-31" 또는 is_current = TRUE',
            'version = 0',
            'status = "active"'
          ],
          answer: 1,
          explanation: 'end_date를 미래 날짜(9999-12-31)로 설정하거나 is_current 플래그를 사용합니다.'
        },
        {
          question: 'SCD Type 1을 사용해야 하는 경우는?',
          options: [
            '고객 주소 변경 이력이 필요할 때',
            '등급 변경 이력을 분석해야 할 때',
            '오타 수정이나 데이터 정정 시',
            '가격 변동 추이를 추적할 때'
          ],
          answer: 2,
          explanation: 'Type 1은 이력이 필요 없는 단순 수정(오타, 데이터 정정)에 사용합니다.'
        },
        {
          question: 'Type 2에서 "2024-03-15" 시점의 데이터를 조회하는 조건은?',
          options: [
            "WHERE start_date = '2024-03-15'",
            "WHERE '2024-03-15' BETWEEN start_date AND end_date",
            'WHERE is_current = TRUE',
            "WHERE end_date >= '2024-03-15'"
          ],
          answer: 1,
          explanation: 'Point-in-Time 조회는 해당 날짜가 start_date와 end_date 사이에 있는 행을 찾습니다.'
        },
        {
          question: 'SCD Type 3의 한계점은?',
          options: [
            '저장 공간을 많이 사용함',
            '쿼리가 너무 복잡해짐',
            '직전 값만 보존하여 전체 이력을 알 수 없음',
            '현재 값을 알 수 없음'
          ],
          answer: 2,
          explanation: 'Type 3은 previous/current 컬럼으로 직전 값만 보존하므로 그 이전 이력은 사라집니다.'
        }
      ]
    }
  },
  {
    id: 'w4d3-challenge-scd-etl',
    type: 'challenge',
    title: '챌린지: SCD Type 2 ETL 파이프라인',
    duration: 40,
    access: 'core',
    content: {
      instructions: `SCD Type 2 변경 처리를 자동화하는 ETL 로직을 구현하세요.

**시나리오**: 매일 소스 시스템에서 고객 데이터 전체를 추출하여 DW에 적재

**요구사항**:
1. 신규 고객 삽입
2. 기존 고객 정보 변경 감지 및 Type 2 처리
3. 삭제된 고객 처리 (soft delete)`,
      starterCode: `-- SCD Type 2 ETL 파이프라인

-- 타겟 테이블 (DW)
CREATE TABLE dim_customer_dw (
    customer_key SERIAL PRIMARY KEY,
    customer_id VARCHAR(20),
    name VARCHAR(100),
    email VARCHAR(100),
    city VARCHAR(50),
    segment VARCHAR(20),
    start_date DATE,
    end_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- 어제 데이터 (DW 현재 상태)
INSERT INTO dim_customer_dw (customer_id, name, email, city, segment, start_date) VALUES
('C001', 'Kim Min', 'kim@email.com', 'Seoul', 'Regular', '2024-01-01'),
('C002', 'Lee Su', 'lee@email.com', 'Busan', 'Premium', '2024-01-01'),
('C003', 'Park Ji', 'park@email.com', 'Seoul', 'Regular', '2024-01-01');

-- 오늘 소스 데이터 (변경사항 포함)
CREATE TEMP TABLE source_customers (
    customer_id VARCHAR(20),
    name VARCHAR(100),
    email VARCHAR(100),
    city VARCHAR(50),
    segment VARCHAR(20)
);

INSERT INTO source_customers VALUES
('C001', 'Kim Min', 'kim@email.com', 'Busan', 'Premium'),  -- 변경: city, segment
('C002', 'Lee Su', 'lee@email.com', 'Busan', 'Premium'),   -- 변경 없음
('C004', 'Choi Yu', 'choi@email.com', 'Incheon', 'Regular'); -- 신규
-- C003은 삭제됨 (소스에 없음)


-- ETL 로직 구현
-- Step 1: 신규 고객 식별 및 삽입


-- Step 2: 변경된 고객 식별 (city 또는 segment 변경)


-- Step 3: Type 2 처리 - 기존 행 종료


-- Step 4: Type 2 처리 - 새 행 추가


-- Step 5: 삭제된 고객 처리 (Soft Delete)


-- 결과 확인

`,
      requirements: [
        '신규 고객 자동 삽입',
        '변경 고객 감지 (city, segment 비교)',
        'Type 2 방식으로 이력 보존',
        '삭제된 고객 soft delete 처리',
        'ETL 결과 검증 쿼리'
      ],
      evaluationCriteria: [
        '신규/변경/삭제 케이스 모두 처리',
        'Type 2 로직 정확 (start/end date, is_current)',
        'Soft delete 구현',
        'SQL 문법 정확',
        '결과 데이터 정합성'
      ],
      hints: [
        'NOT EXISTS로 신규 고객 식별',
        'EXCEPT 또는 JOIN + 비교로 변경 감지',
        'CTE로 변경 대상 미리 추출',
        'is_deleted로 soft delete 표시'
      ]
    }
  }
]
