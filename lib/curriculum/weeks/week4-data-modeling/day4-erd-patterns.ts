// Day 4: ERD 설계 & 실무 패턴
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'w4d4t1',
    title: 'ERD 기본 개념과 표기법',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=erd-basics',
      transcript: `
# ERD (Entity-Relationship Diagram) 기초

안녕하세요! 오늘은 데이터베이스 설계의 핵심 도구인 ERD를 배워봅니다.

## 1. ERD란?

ERD는 데이터베이스의 구조를 시각적으로 표현하는 다이어그램입니다:
- **Entity (엔티티)**: 데이터로 관리할 대상 (테이블이 됨)
- **Attribute (속성)**: 엔티티의 특성 (컬럼이 됨)
- **Relationship (관계)**: 엔티티 간의 연결

## 2. ERD 표기법

### Chen 표기법 (학술용)
- 엔티티: 사각형
- 속성: 타원
- 관계: 마름모
- 학술적으로 정확하지만 복잡함

### Crow's Foot 표기법 (실무 표준)
- 엔티티: 사각형 (속성 포함)
- 관계: 선으로 연결
- 카디널리티: 까마귀 발 모양으로 표현
  - | (하나)
  - O (0개)
  - < (다수)

### IE 표기법 (Information Engineering)
- Crow's Foot와 유사
- 대부분의 ERD 도구가 지원

## 3. 관계 유형 (Cardinality)

### 1:1 (One-to-One)
- 한 쪽이 다른 한 쪽과 정확히 하나씩 연결
- 예: 직원 - 주민등록번호, 사용자 - 프로필

### 1:N (One-to-Many)
- 한 쪽이 다른 쪽과 여러 개 연결
- 가장 흔한 관계
- 예: 부서 - 직원, 고객 - 주문

### M:N (Many-to-Many)
- 양쪽 모두 여러 개 연결
- 연결 테이블(Junction Table)이 필요
- 예: 학생 - 강좌, 상품 - 주문

## 4. 필수성 (Optionality)

### 필수 관계 (Mandatory)
- 반드시 존재해야 함
- 실선으로 표시

### 선택 관계 (Optional)
- 없을 수도 있음
- 점선 또는 O로 표시

## 5. ERD 읽는 방법

"고객은 여러 주문을 가질 수 있고, 주문은 반드시 한 고객에게 속한다"

\`\`\`
고객 ||--o{ 주문
\`\`\`

- || : 정확히 하나
- o{ : 0개 이상

## 6. 실무 팁

1. **비즈니스 용어 사용**: 개발 용어보다 비즈니스 용어 선호
2. **적절한 추상화 레벨**: 너무 상세하거나 너무 간략하지 않게
3. **점진적 설계**: 개념 → 논리 → 물리 순서로 상세화
4. **버전 관리**: ERD도 코드처럼 버전 관리

다음 시간에는 실제 ERD를 그려보겠습니다!
      `,
      objectives: [
        'ERD의 구성 요소를 설명할 수 있다',
        'Crow\'s Foot 표기법을 읽고 해석할 수 있다',
        '관계 유형(1:1, 1:N, M:N)을 구분할 수 있다'
      ],
      keyPoints: [
        'Entity = 테이블, Attribute = 컬럼, Relationship = 외래키',
        'Crow\'s Foot 표기법이 실무 표준',
        '1:N 관계가 가장 흔함',
        'M:N 관계는 연결 테이블 필요'
      ]
    }
  },
  {
    id: 'w4d4t2',
    title: 'ERD 설계 프로세스',
    type: 'reading',
    duration: 20,
    content: {
      markdown: `
# ERD 설계 프로세스

## 1. 개념적 설계 (Conceptual Design)

비즈니스 요구사항을 추상적으로 표현합니다.

### 단계
1. **엔티티 식별**: 명사 추출
   - "고객이 상품을 주문한다" → 고객, 상품, 주문
2. **관계 식별**: 동사 추출
   - "주문한다" → 고객과 주문의 관계
3. **주요 속성 식별**: 핵심 정보만
   - 고객: 이름, 이메일
   - 주문: 주문일, 총액

### 예시
\`\`\`
[고객] --주문한다--> [주문] --포함한다--> [상품]
\`\`\`

## 2. 논리적 설계 (Logical Design)

개념적 모델을 테이블 구조로 변환합니다.

### 단계
1. **기본키(PK) 정의**: 각 엔티티의 고유 식별자
2. **외래키(FK) 정의**: 관계를 구현
3. **데이터 타입 결정**: VARCHAR, INT, DATE 등
4. **정규화 적용**: 1NF → 2NF → 3NF

### 예시
\`\`\`sql
-- 개념: 고객
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 개념: 주문 (고객과 1:N 관계)
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
\`\`\`

## 3. 물리적 설계 (Physical Design)

특정 DBMS에 최적화된 설계입니다.

### 고려 사항
- **인덱스 전략**: 쿼리 패턴에 따른 인덱스 설계
- **파티셔닝**: 대용량 테이블 분할
- **저장 엔진**: InnoDB vs MyISAM (MySQL)
- **제약 조건**: CHECK, DEFAULT, NOT NULL

### 예시
\`\`\`sql
-- 물리적 설계: 인덱스, 파티셔닝 추가
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2) CHECK (total_amount >= 0),
    status ENUM('pending', 'paid', 'shipped', 'delivered') DEFAULT 'pending',
    INDEX idx_customer (customer_id),
    INDEX idx_date (order_date),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
) ENGINE=InnoDB
PARTITION BY RANGE (YEAR(order_date)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026)
);
\`\`\`

## 4. M:N 관계 해소

M:N 관계는 직접 구현 불가 → 연결 테이블로 해소

### Before (개념)
\`\`\`
[주문] >--< [상품]
\`\`\`

### After (논리)
\`\`\`
[주문] ||--o{ [주문상품] }o--|| [상품]
\`\`\`

\`\`\`sql
-- 연결 테이블 (Junction Table)
CREATE TABLE order_items (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
\`\`\`

## 5. ERD 도구 비교

| 도구 | 가격 | 특징 |
|------|------|------|
| dbdiagram.io | 무료 | 코드 기반, 빠른 작성 |
| Lucidchart | 프리미엄 | 협업, 다양한 템플릿 |
| Draw.io | 무료 | 범용, 오프라인 지원 |
| MySQL Workbench | 무료 | MySQL 특화, 리버스 엔지니어링 |
| DBeaver | 무료 | 다중 DB 지원 |

## 6. ERD → DDL 생성

dbdiagram.io 문법:
\`\`\`
Table customers {
  customer_id int [pk, increment]
  name varchar(100) [not null]
  email varchar(255) [unique, not null]
  created_at timestamp [default: \`now()\`]
}

Table orders {
  order_id int [pk, increment]
  customer_id int [not null, ref: > customers.customer_id]
  order_date date [not null]
  total_amount decimal(10,2)
}
\`\`\`

→ Export to PostgreSQL/MySQL DDL
      `,
      externalLinks: [
        { title: 'dbdiagram.io - 무료 ERD 도구', url: 'https://dbdiagram.io' },
        { title: 'Crow\'s Foot Notation Guide', url: 'https://vertabelo.com/blog/crow-s-foot-notation/' }
      ]
    }
  },
  {
    id: 'w4d4t3',
    title: '실무 ERD 패턴 (1) - 기본 패턴',
    type: 'code',
    duration: 25,
    content: {
      instructions: `
# 실무 ERD 패턴 - 기본

자주 사용되는 ERD 패턴을 SQL로 구현해봅니다.

## 패턴 1: Self-Referencing (자기 참조)

조직도, 카테고리 계층 등에서 사용됩니다.

### 예시: 직원-상사 관계
- 직원은 한 명의 상사를 가질 수 있음
- 최상위 직원(CEO)은 상사가 NULL

### 예시: 카테고리 계층
- 카테고리는 부모 카테고리를 가질 수 있음
- 최상위 카테고리는 parent_id가 NULL

## 패턴 2: Polymorphic Association (다형성 관계)

하나의 테이블이 여러 테이블과 관계를 가질 때 사용됩니다.

### 예시: 댓글 시스템
- 댓글은 게시글, 상품, 리뷰 등 여러 곳에 달릴 수 있음
- commentable_type: 'Post', 'Product', 'Review'
- commentable_id: 해당 테이블의 ID

## 과제
1. 자기 참조 패턴으로 카테고리 테이블 생성
2. 해당 카테고리의 모든 하위 카테고리를 조회하는 CTE 쿼리 작성
      `,
      starterCode: `-- 패턴 1: Self-Referencing (자기 참조)
-- 카테고리 계층 구조 테이블

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    -- TODO: parent_id 컬럼 추가 (자기 참조 외래키)

    depth INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 샘플 데이터 삽입
INSERT INTO categories (category_id, name, parent_id, depth) VALUES
(1, '전자제품', NULL, 0),
(2, '컴퓨터', 1, 1),
(3, '노트북', 2, 2),
(4, '데스크톱', 2, 2),
(5, '스마트폰', 1, 1),
(6, '의류', NULL, 0),
(7, '남성의류', 6, 1),
(8, '여성의류', 6, 1);

-- 특정 카테고리의 모든 하위 카테고리 조회 (Recursive CTE)
-- TODO: '전자제품'(category_id=1)의 모든 하위 카테고리 조회

WITH RECURSIVE category_tree AS (
    -- Base case: 시작 카테고리

    -- Recursive case: 하위 카테고리 추가

)
SELECT * FROM category_tree;

-- 패턴 2: Polymorphic Association (다형성 관계)
-- 댓글 시스템

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    -- TODO: 다형성 관계 컬럼 추가
    -- commentable_type: 연결된 테이블 종류
    -- commentable_id: 연결된 레코드 ID

    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 게시글에 달린 댓글 조회
-- SELECT * FROM comments WHERE commentable_type = 'Post' AND commentable_id = 1;`,
      solutionCode: `-- 패턴 1: Self-Referencing (자기 참조)
-- 카테고리 계층 구조 테이블

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INT,  -- 자기 참조 외래키
    depth INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 자기 참조 외래키 제약
    CONSTRAINT fk_parent
        FOREIGN KEY (parent_id)
        REFERENCES categories(category_id)
        ON DELETE SET NULL  -- 부모 삭제 시 NULL로 설정
);

-- 인덱스 추가 (계층 탐색 최적화)
CREATE INDEX idx_parent ON categories(parent_id);

-- 샘플 데이터 삽입
INSERT INTO categories (category_id, name, parent_id, depth) VALUES
(1, '전자제품', NULL, 0),
(2, '컴퓨터', 1, 1),
(3, '노트북', 2, 2),
(4, '데스크톱', 2, 2),
(5, '스마트폰', 1, 1),
(6, '의류', NULL, 0),
(7, '남성의류', 6, 1),
(8, '여성의류', 6, 1);

-- 특정 카테고리의 모든 하위 카테고리 조회 (Recursive CTE)
WITH RECURSIVE category_tree AS (
    -- Base case: 시작 카테고리 (전자제품)
    SELECT
        category_id,
        name,
        parent_id,
        depth,
        name::TEXT AS path
    FROM categories
    WHERE category_id = 1

    UNION ALL

    -- Recursive case: 하위 카테고리
    SELECT
        c.category_id,
        c.name,
        c.parent_id,
        c.depth,
        ct.path || ' > ' || c.name AS path
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.category_id
)
SELECT
    category_id,
    name,
    depth,
    path
FROM category_tree
ORDER BY path;

-- 결과:
-- | category_id | name      | depth | path                          |
-- |-------------|-----------|-------|-------------------------------|
-- | 1           | 전자제품   | 0     | 전자제품                       |
-- | 2           | 컴퓨터     | 1     | 전자제품 > 컴퓨터              |
-- | 3           | 노트북     | 2     | 전자제품 > 컴퓨터 > 노트북      |
-- | 4           | 데스크톱   | 2     | 전자제품 > 컴퓨터 > 데스크톱    |
-- | 5           | 스마트폰   | 1     | 전자제품 > 스마트폰            |


-- 패턴 2: Polymorphic Association (다형성 관계)
-- 댓글 시스템

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,

    -- 다형성 관계 컬럼
    commentable_type VARCHAR(50) NOT NULL,  -- 'Post', 'Product', 'Review'
    commentable_id INT NOT NULL,

    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 복합 인덱스 (타입 + ID)
    INDEX idx_commentable (commentable_type, commentable_id)
);

-- 샘플 데이터
INSERT INTO comments (content, commentable_type, commentable_id, user_id) VALUES
('좋은 글이네요!', 'Post', 1, 100),
('이 제품 추천합니다', 'Product', 42, 101),
('리뷰 감사합니다', 'Review', 15, 102);

-- 게시글(Post) 1번에 달린 모든 댓글 조회
SELECT * FROM comments
WHERE commentable_type = 'Post' AND commentable_id = 1;

-- 특정 사용자의 모든 댓글과 대상 정보 조회
SELECT
    c.content,
    c.commentable_type,
    c.commentable_id,
    c.created_at
FROM comments c
WHERE c.user_id = 100
ORDER BY c.created_at DESC;


-- 대안: 별도 연결 테이블 (외래키 무결성 보장)
-- 다형성 관계의 단점: FK 제약 불가
-- 해결책: 각 대상별 연결 테이블

CREATE TABLE post_comments (
    comment_id INT PRIMARY KEY,
    post_id INT NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

CREATE TABLE product_comments (
    comment_id INT PRIMARY KEY,
    product_id INT NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);`,
      hints: [
        '자기 참조 FK는 같은 테이블의 PK를 참조합니다',
        'Recursive CTE는 UNION ALL로 Base + Recursive를 연결',
        '다형성 관계는 type + id 두 컬럼으로 구현'
      ]
    }
  },
  {
    id: 'w4d4t4',
    title: '실무 ERD 패턴 (2) - 고급 패턴',
    type: 'code',
    duration: 25,
    content: {
      instructions: `
# 실무 ERD 패턴 - 고급

더 복잡한 비즈니스 요구사항을 다루는 패턴입니다.

## 패턴 3: Audit Trail (감사 테이블)

모든 변경 이력을 추적해야 할 때 사용합니다.
- 누가 언제 무엇을 어떻게 변경했는지 기록
- 법적 요구사항 또는 디버깅 목적

## 패턴 4: Soft Delete (논리적 삭제)

데이터를 물리적으로 삭제하지 않고 삭제 표시만 합니다.
- deleted_at 컬럼 사용
- 삭제된 데이터 복구 가능
- 히스토리 보존

## 패턴 5: Temporal Table (시간 테이블)

특정 시점의 데이터 상태를 조회해야 할 때 사용합니다.
- valid_from, valid_to 컬럼 사용
- SCD Type 2의 일반화

## 과제
1. Audit Trail 테이블 설계 및 트리거 작성
2. Soft Delete 패턴 적용 및 조회 뷰 생성
      `,
      starterCode: `-- 패턴 3: Audit Trail (감사 테이블)
-- 모든 테이블의 변경 이력 추적

-- 감사 대상 테이블
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TODO: 감사 테이블 생성
-- 어떤 테이블, 어떤 레코드, 어떤 작업, 변경 전/후 값

CREATE TABLE audit_log (
    audit_id SERIAL PRIMARY KEY,
    -- TODO: 감사 정보 컬럼 추가

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TODO: 트리거 함수 작성 (PostgreSQL)
-- UPDATE 시 old/new 값을 audit_log에 저장



-- 패턴 4: Soft Delete (논리적 삭제)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- TODO: Soft Delete 컬럼 추가

);

-- TODO: 활성 사용자만 조회하는 뷰 생성


-- TODO: Soft Delete 함수 생성
-- DELETE 대신 deleted_at 업데이트


-- 패턴 5: Temporal Table (시간 테이블)
-- 계약 이력 관리
CREATE TABLE contracts (
    contract_id INT NOT NULL,
    customer_id INT NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    monthly_fee DECIMAL(10,2) NOT NULL,
    -- TODO: 시간 범위 컬럼 추가

    PRIMARY KEY (contract_id, valid_from)
);

-- TODO: 특정 시점의 계약 정보 조회 함수`,
      solutionCode: `-- 패턴 3: Audit Trail (감사 테이블)
-- 모든 테이블의 변경 이력 추적

-- 감사 대상 테이블
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 감사 테이블
CREATE TABLE audit_log (
    audit_id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,      -- 대상 테이블
    record_id INT NOT NULL,                 -- 대상 레코드 PK
    action VARCHAR(20) NOT NULL,            -- INSERT, UPDATE, DELETE
    old_values JSONB,                       -- 변경 전 값
    new_values JSONB,                       -- 변경 후 값
    changed_by VARCHAR(100),                -- 변경자 (세션 사용자)
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_audit_table (table_name, record_id),
    INDEX idx_audit_time (changed_at)
);

-- 트리거 함수 (PostgreSQL)
CREATE OR REPLACE FUNCTION log_product_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_values, changed_by)
        VALUES ('products', NEW.product_id, 'INSERT', to_jsonb(NEW), current_user);
        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, changed_by)
        VALUES ('products', NEW.product_id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), current_user);

        -- updated_at 자동 갱신
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, changed_by)
        VALUES ('products', OLD.product_id, 'DELETE', to_jsonb(OLD), current_user);
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 트리거 연결
CREATE TRIGGER trg_products_audit
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION log_product_changes();

-- 테스트
INSERT INTO products (name, price, category_id) VALUES ('노트북', 1500000, 1);
UPDATE products SET price = 1400000 WHERE product_id = 1;

-- 감사 로그 확인
SELECT
    action,
    old_values->>'price' AS old_price,
    new_values->>'price' AS new_price,
    changed_at
FROM audit_log
WHERE table_name = 'products' AND record_id = 1;


-- 패턴 4: Soft Delete (논리적 삭제)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,  -- UNIQUE 제거 (복구 시 충돌 방지)
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL     -- NULL = 활성, 값 있음 = 삭제됨
);

-- 이메일 유니크 (삭제되지 않은 것만)
CREATE UNIQUE INDEX idx_users_email_active
ON users(email) WHERE deleted_at IS NULL;

-- 활성 사용자만 조회하는 뷰
CREATE VIEW active_users AS
SELECT user_id, email, name, created_at
FROM users
WHERE deleted_at IS NULL;

-- Soft Delete 함수
CREATE OR REPLACE FUNCTION soft_delete_user(p_user_id INT)
RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- 복구 함수
CREATE OR REPLACE FUNCTION restore_user(p_user_id INT)
RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET deleted_at = NULL
    WHERE user_id = p_user_id AND deleted_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- 테스트
INSERT INTO users (email, name) VALUES ('test@example.com', 'Test User');
SELECT soft_delete_user(1);
SELECT * FROM active_users;  -- 결과 없음
SELECT restore_user(1);
SELECT * FROM active_users;  -- 복구됨


-- 패턴 5: Temporal Table (시간 테이블)
-- 계약 이력 관리
CREATE TABLE contracts (
    contract_id INT NOT NULL,
    customer_id INT NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    monthly_fee DECIMAL(10,2) NOT NULL,
    valid_from TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_to TIMESTAMP NOT NULL DEFAULT '9999-12-31 23:59:59',
    is_current BOOLEAN DEFAULT TRUE,

    PRIMARY KEY (contract_id, valid_from),
    INDEX idx_contracts_current (contract_id, is_current),
    INDEX idx_contracts_time (contract_id, valid_from, valid_to)
);

-- 특정 시점의 계약 정보 조회 함수
CREATE OR REPLACE FUNCTION get_contract_at(
    p_contract_id INT,
    p_point_in_time TIMESTAMP
)
RETURNS TABLE (
    contract_id INT,
    customer_id INT,
    plan_type VARCHAR(50),
    monthly_fee DECIMAL(10,2),
    valid_from TIMESTAMP,
    valid_to TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.contract_id,
        c.customer_id,
        c.plan_type,
        c.monthly_fee,
        c.valid_from,
        c.valid_to
    FROM contracts c
    WHERE c.contract_id = p_contract_id
      AND c.valid_from <= p_point_in_time
      AND c.valid_to > p_point_in_time;
END;
$$ LANGUAGE plpgsql;

-- 계약 변경 함수 (새 버전 추가)
CREATE OR REPLACE FUNCTION update_contract(
    p_contract_id INT,
    p_new_plan_type VARCHAR(50),
    p_new_monthly_fee DECIMAL(10,2)
)
RETURNS VOID AS $$
DECLARE
    v_now TIMESTAMP := CURRENT_TIMESTAMP;
    v_customer_id INT;
BEGIN
    -- 현재 버전 종료
    UPDATE contracts
    SET valid_to = v_now, is_current = FALSE
    WHERE contract_id = p_contract_id AND is_current = TRUE
    RETURNING customer_id INTO v_customer_id;

    -- 새 버전 추가
    INSERT INTO contracts (contract_id, customer_id, plan_type, monthly_fee, valid_from)
    VALUES (p_contract_id, v_customer_id, p_new_plan_type, p_new_monthly_fee, v_now);
END;
$$ LANGUAGE plpgsql;

-- 테스트
INSERT INTO contracts (contract_id, customer_id, plan_type, monthly_fee)
VALUES (1, 100, 'Basic', 9900);

SELECT update_contract(1, 'Premium', 19900);
SELECT update_contract(1, 'Enterprise', 49900);

-- 이력 조회
SELECT * FROM contracts WHERE contract_id = 1 ORDER BY valid_from;

-- 특정 시점 조회
SELECT * FROM get_contract_at(1, '2024-01-15 10:00:00');`,
      hints: [
        'JSONB 타입으로 변경 전/후 값을 유연하게 저장',
        'Soft Delete에서 UNIQUE 제약은 WHERE 조건부로 생성',
        'Temporal Table은 valid_from, valid_to로 시간 범위 관리'
      ]
    }
  },
  {
    id: 'w4d4t5',
    title: 'ERD 설계 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Crow\'s Foot 표기법에서 "||--o{" 가 의미하는 관계는?',
          options: [
            '1:1 필수 관계',
            '1:N 필수-선택 관계 (한 쪽은 필수, 다른 쪽은 0개 이상)',
            'M:N 관계',
            '1:N 필수-필수 관계'
          ],
          answer: 1,
          explanation: '|| 는 "정확히 하나(필수)", o{ 는 "0개 이상(선택)"을 의미합니다. 예: 고객 ||--o{ 주문 = 고객은 0개 이상의 주문을 가질 수 있고, 주문은 반드시 한 고객에게 속함'
        },
        {
          question: 'M:N 관계를 물리적으로 구현할 때 사용하는 것은?',
          options: [
            '외래키만 추가',
            '연결 테이블 (Junction Table)',
            '복합 기본키',
            '뷰 생성'
          ],
          answer: 1,
          explanation: 'M:N 관계는 두 테이블 사이에 연결 테이블(Junction Table, Bridge Table)을 생성하여 두 개의 1:N 관계로 분해합니다.'
        },
        {
          question: 'Self-Referencing(자기 참조) 패턴을 사용하기 적합한 상황은?',
          options: [
            '고객과 주문 관계',
            '조직도의 직원-상사 관계',
            '상품과 카테고리 관계',
            '주문과 배송 관계'
          ],
          answer: 1,
          explanation: '자기 참조 패턴은 같은 엔티티 내에서 계층 구조를 표현할 때 사용합니다. 조직도(직원-상사), 카테고리 계층, 댓글-대댓글 등이 대표적입니다.'
        },
        {
          question: 'Polymorphic Association(다형성 관계)의 단점은?',
          options: [
            '쿼리가 느리다',
            '저장 공간을 많이 사용한다',
            '외래키 제약(FK Constraint)을 설정할 수 없다',
            '인덱스를 생성할 수 없다'
          ],
          answer: 2,
          explanation: '다형성 관계는 type + id 두 컬럼으로 구현하므로, 데이터베이스 레벨의 외래키 제약을 설정할 수 없습니다. 참조 무결성을 애플리케이션에서 관리해야 합니다.'
        },
        {
          question: 'Soft Delete 패턴에서 UNIQUE 제약을 처리하는 올바른 방법은?',
          options: [
            'UNIQUE 제약을 제거한다',
            'deleted_at을 UNIQUE에 포함한다',
            '조건부 유니크 인덱스(WHERE deleted_at IS NULL)를 사용한다',
            '별도 테이블로 분리한다'
          ],
          answer: 2,
          explanation: '조건부 유니크 인덱스를 사용하면 활성 레코드에만 유니크 제약을 적용할 수 있습니다. 삭제된 레코드는 같은 값을 가질 수 있어 복구 시 충돌을 방지합니다.'
        }
      ]
    }
  },
  {
    id: 'w4d4t6',
    title: '도전과제: 온라인 강의 플랫폼 ERD 설계',
    type: 'challenge',
    duration: 30,
    content: {
      instructions: `
# 도전과제: 온라인 강의 플랫폼 ERD 설계

온라인 강의 플랫폼의 핵심 도메인을 ERD로 설계하세요.

## 비즈니스 요구사항

1. **사용자**: 학생과 강사가 있음
2. **강좌**: 강사가 여러 강좌를 만들 수 있음
3. **수강**: 학생은 여러 강좌를 수강할 수 있고, 강좌는 여러 학생이 수강함 (M:N)
4. **강의**: 강좌는 여러 강의(레슨)로 구성됨
5. **진도**: 학생별로 각 강의의 시청 진도율을 추적함
6. **리뷰**: 학생은 수강한 강좌에 리뷰를 작성할 수 있음

## 추가 요구사항

- 사용자 삭제 시 Soft Delete 적용
- 강좌 가격 변경 이력 추적 (Temporal)
- 강의 순서는 같은 강좌 내에서 정렬 가능해야 함

## 과제

1. 테이블 스키마 설계 (6개 이상 테이블)
2. 적절한 인덱스 설계
3. 1개 이상의 실무 패턴 적용
      `,
      starterCode: `-- 온라인 강의 플랫폼 ERD 설계

-- 1. 사용자 테이블 (Soft Delete 적용)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- TODO: Soft Delete 컬럼
);

-- TODO: 활성 사용자용 유니크 인덱스


-- 2. 강좌 테이블
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructor_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- TODO: 외래키 추가
);


-- 3. 강좌 가격 이력 (Temporal Table)
CREATE TABLE course_prices (
    course_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
    -- TODO: 시간 범위 컬럼
);


-- 4. 강의 테이블 (순서 정렬 가능)
CREATE TABLE lessons (
    lesson_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    video_url VARCHAR(500),
    duration_seconds INT NOT NULL DEFAULT 0
    -- TODO: 순서 컬럼, 외래키
);


-- 5. 수강 테이블 (M:N 해소)
CREATE TABLE enrollments (
    -- TODO: 설계하세요
);


-- 6. 진도 테이블
CREATE TABLE lesson_progress (
    -- TODO: 설계하세요
);


-- 7. 리뷰 테이블
CREATE TABLE reviews (
    -- TODO: 설계하세요
);


-- 유용한 뷰
-- 강좌별 통계 (수강생 수, 평균 평점)
CREATE VIEW course_stats AS
-- TODO: 구현하세요
;`,
      requirements: [
        '모든 테이블에 적절한 기본키와 외래키 설정',
        'users 테이블에 Soft Delete 패턴 적용',
        'course_prices에 Temporal Table 패턴 적용',
        'enrollments에서 M:N 관계 해소',
        'lesson_progress에서 진도율 추적',
        '필요한 인덱스 생성'
      ],
      evaluationCriteria: [
        '모든 비즈니스 요구사항 반영 (20%)',
        '테이블 구조의 정규화 수준 (20%)',
        '외래키 관계 정확성 (20%)',
        'Soft Delete 패턴 정확성 (15%)',
        'Temporal Table 패턴 정확성 (15%)',
        '인덱스 설계 (10%)'
      ],
      hints: [
        'Soft Delete는 deleted_at 컬럼 + 조건부 유니크 인덱스',
        'Temporal Table은 valid_from, valid_to, is_current 컬럼',
        'M:N 해소 시 추가 속성(수강일, 결제금액)도 고려',
        '진도 테이블은 (enrollment_id, lesson_id)가 복합 PK'
      ]
    }
  }
]
