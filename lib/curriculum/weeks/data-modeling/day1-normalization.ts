// Day 1: 정규화 원칙
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'w4d1-video-normalization-intro',
    type: 'video',
    title: '정규화란 무엇인가?',
    duration: 15,
    access: 'core',
    content: {
      objectives: [
        '정규화의 목적과 필요성 이해',
        '데이터 이상(Anomaly) 개념 학습',
        '정규화 단계별 특징 파악'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=GFQaEYEc8_8',
      transcript: `## 정규화란?

정규화는 데이터베이스 설계에서 **데이터 중복을 최소화**하고 **데이터 무결성을 보장**하기 위한 과정입니다.

### 왜 정규화가 필요한가?

**데이터 이상(Anomaly) 문제:**

1. **삽입 이상 (Insertion Anomaly)**
   - 새 데이터 삽입 시 불필요한 데이터도 함께 입력해야 하는 문제
   - 예: 학생 없는 과목을 등록할 수 없음

2. **갱신 이상 (Update Anomaly)**
   - 중복 데이터 중 일부만 수정되어 불일치 발생
   - 예: 교수 이름이 여러 행에 중복 → 일부만 수정

3. **삭제 이상 (Deletion Anomaly)**
   - 데이터 삭제 시 의도치 않은 정보까지 삭제
   - 예: 마지막 수강생 삭제 → 과목 정보도 삭제

### 정규화 단계

\`\`\`
비정규화 → 1NF → 2NF → 3NF → BCNF → 4NF → 5NF
        (대부분 3NF 또는 BCNF까지 적용)
\`\`\``,
      keyPoints: [
        '정규화 = 데이터 중복 최소화 + 무결성 보장',
        '이상(Anomaly): 삽입, 갱신, 삭제 이상',
        '실무에서는 대부분 3NF 또는 BCNF까지 적용',
        '과도한 정규화 → 성능 저하 (적절한 비정규화 필요)'
      ]
    }
  },
  {
    id: 'w4d1-reading-normal-forms',
    type: 'reading',
    title: '정규형 단계별 이해',
    duration: 25,
    access: 'core',
    content: {
      markdown: `# 정규형 단계별 이해

## 1NF (제1정규형)

**조건**: 모든 속성이 **원자값(Atomic Value)**을 가져야 함

\`\`\`sql
-- 비정규형 (1NF 위반)
CREATE TABLE students_bad (
    id INT,
    name VARCHAR(50),
    phone_numbers VARCHAR(200)  -- '010-1234-5678, 010-9876-5432'
);

-- 1NF 적용
CREATE TABLE students (
    id INT,
    name VARCHAR(50)
);

CREATE TABLE student_phones (
    student_id INT,
    phone_number VARCHAR(20),
    PRIMARY KEY (student_id, phone_number)
);
\`\`\`

## 2NF (제2정규형)

**조건**: 1NF + **부분 함수 종속 제거**

> 복합 기본키의 일부에만 종속되는 속성 분리

\`\`\`sql
-- 2NF 위반
CREATE TABLE order_items_bad (
    order_id INT,
    product_id INT,
    product_name VARCHAR(100),  -- product_id에만 종속!
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);

-- 2NF 적용
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100)
);

CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
\`\`\`

## 3NF (제3정규형)

**조건**: 2NF + **이행 함수 종속 제거**

> A → B, B → C 관계에서 B를 별도 테이블로 분리

\`\`\`sql
-- 3NF 위반
CREATE TABLE employees_bad (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(50),
    dept_id INT,
    dept_name VARCHAR(50),  -- dept_id → dept_name (이행 종속)
    dept_location VARCHAR(50)
);

-- 3NF 적용
CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50),
    dept_location VARCHAR(50)
);

CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(50),
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);
\`\`\`

## BCNF (Boyce-Codd 정규형)

**조건**: 모든 결정자가 후보키

\`\`\`sql
-- BCNF 위반 예시
-- 학생이 과목당 한 명의 교수에게만 수강
-- 교수는 한 과목만 가르침

CREATE TABLE enrollments_bad (
    student_id INT,
    subject VARCHAR(50),
    professor VARCHAR(50),
    PRIMARY KEY (student_id, subject)
    -- professor → subject 인데 professor는 후보키가 아님!
);

-- BCNF 적용
CREATE TABLE professor_subjects (
    professor VARCHAR(50) PRIMARY KEY,
    subject VARCHAR(50)
);

CREATE TABLE enrollments (
    student_id INT,
    professor VARCHAR(50),
    PRIMARY KEY (student_id, professor),
    FOREIGN KEY (professor) REFERENCES professor_subjects(professor)
);
\`\`\`

## 정규형 요약

| 정규형 | 조건 | 해결하는 문제 |
|--------|------|--------------|
| 1NF | 원자값 | 반복 그룹, 다중값 |
| 2NF | 부분 종속 제거 | 복합키 일부 종속 |
| 3NF | 이행 종속 제거 | A→B→C 관계 |
| BCNF | 모든 결정자가 후보키 | 비후보키 결정자 |`,
      externalLinks: [
        {
          title: 'Database Normalization Explained',
          url: 'https://www.guru99.com/database-normalization.html'
        },
        {
          title: 'Normal Forms in DBMS',
          url: 'https://www.geeksforgeeks.org/normal-forms-in-dbms/'
        }
      ]
    }
  },
  {
    id: 'w4d1-code-1nf-2nf',
    type: 'code',
    title: '실습: 1NF, 2NF 적용',
    duration: 30,
    access: 'core',
    content: {
      instructions: `비정규화된 테이블을 1NF, 2NF로 정규화합니다.

**문제 1**: 다중값 속성을 1NF로 변환
**문제 2**: 부분 종속을 2NF로 해결
**문제 3**: 정규화 후 데이터 조회 쿼리 작성`,
      starterCode: `-- 문제 1: 1NF 위반 테이블
-- courses 컬럼에 여러 과목이 콤마로 구분되어 있음
CREATE TABLE students_unnormalized (
    student_id INT,
    student_name VARCHAR(50),
    courses VARCHAR(200)  -- 'Math, Science, English'
);

INSERT INTO students_unnormalized VALUES
(1, 'Kim', 'Math, Science, English'),
(2, 'Lee', 'Math, Art'),
(3, 'Park', 'Science, Music, English, History');

-- 1NF로 변환하세요
-- 테이블: students, student_courses


-- 문제 2: 2NF 위반 테이블
-- supplier_name은 supplier_id에만 종속 (부분 종속)
CREATE TABLE inventory_unnormalized (
    product_id INT,
    supplier_id INT,
    supplier_name VARCHAR(100),  -- supplier_id에만 종속!
    supplier_country VARCHAR(50), -- supplier_id에만 종속!
    quantity INT,
    PRIMARY KEY (product_id, supplier_id)
);

INSERT INTO inventory_unnormalized VALUES
(101, 1, 'ABC Corp', 'Korea', 100),
(102, 1, 'ABC Corp', 'Korea', 50),
(101, 2, 'XYZ Ltd', 'Japan', 200),
(103, 1, 'ABC Corp', 'Korea', 75);

-- 2NF로 변환하세요
-- 테이블: suppliers, inventory


-- 문제 3: 정규화된 테이블에서 원래 데이터 조회
-- students_unnormalized와 동일한 결과를 출력하세요
-- 결과: student_id, student_name, courses (콤마 구분 문자열)

`,
      solutionCode: `-- 문제 1: 1NF 변환
DROP TABLE IF EXISTS student_courses;
DROP TABLE IF EXISTS students;

CREATE TABLE students (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(50)
);

CREATE TABLE student_courses (
    student_id INT,
    course_name VARCHAR(50),
    PRIMARY KEY (student_id, course_name),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- 데이터 이관
INSERT INTO students (student_id, student_name)
SELECT DISTINCT student_id, student_name
FROM students_unnormalized;

-- 다중값 분리 삽입 (PostgreSQL)
INSERT INTO student_courses (student_id, course_name)
SELECT
    student_id,
    TRIM(unnest(string_to_array(courses, ','))) as course_name
FROM students_unnormalized;

-- 확인
SELECT * FROM students;
SELECT * FROM student_courses ORDER BY student_id;

/*
students:
| student_id | student_name |
|------------|--------------|
| 1          | Kim          |
| 2          | Lee          |
| 3          | Park         |

student_courses:
| student_id | course_name |
|------------|-------------|
| 1          | Math        |
| 1          | Science     |
| 1          | English     |
| 2          | Math        |
| 2          | Art         |
...
*/


-- 문제 2: 2NF 변환
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS suppliers;

CREATE TABLE suppliers (
    supplier_id INT PRIMARY KEY,
    supplier_name VARCHAR(100),
    supplier_country VARCHAR(50)
);

CREATE TABLE inventory (
    product_id INT,
    supplier_id INT,
    quantity INT,
    PRIMARY KEY (product_id, supplier_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- 데이터 이관
INSERT INTO suppliers (supplier_id, supplier_name, supplier_country)
SELECT DISTINCT supplier_id, supplier_name, supplier_country
FROM inventory_unnormalized;

INSERT INTO inventory (product_id, supplier_id, quantity)
SELECT product_id, supplier_id, quantity
FROM inventory_unnormalized;

-- 확인
SELECT * FROM suppliers;
SELECT * FROM inventory;

/*
suppliers:
| supplier_id | supplier_name | supplier_country |
|-------------|---------------|------------------|
| 1           | ABC Corp      | Korea            |
| 2           | XYZ Ltd       | Japan            |

inventory:
| product_id | supplier_id | quantity |
|------------|-------------|----------|
| 101        | 1           | 100      |
| 102        | 1           | 50       |
| 101        | 2           | 200      |
| 103        | 1           | 75       |
*/


-- 문제 3: 정규화된 테이블에서 원래 형태로 조회
SELECT
    s.student_id,
    s.student_name,
    STRING_AGG(sc.course_name, ', ' ORDER BY sc.course_name) as courses
FROM students s
LEFT JOIN student_courses sc ON s.student_id = sc.student_id
GROUP BY s.student_id, s.student_name
ORDER BY s.student_id;

/*
| student_id | student_name | courses                         |
|------------|--------------|----------------------------------|
| 1          | Kim          | English, Math, Science           |
| 2          | Lee          | Art, Math                        |
| 3          | Park         | English, History, Music, Science |
*/`,
      hints: [
        'PostgreSQL: string_to_array + unnest로 다중값 분리',
        'STRING_AGG로 여러 행을 하나의 문자열로 결합',
        '2NF: 복합키 일부에만 종속되는 컬럼을 별도 테이블로',
        'DISTINCT로 중복 제거 후 삽입'
      ]
    }
  },
  {
    id: 'w4d1-code-3nf-bcnf',
    type: 'code',
    title: '실습: 3NF, BCNF 적용',
    duration: 30,
    access: 'core',
    content: {
      instructions: `이행 종속과 BCNF 위반을 해결합니다.

**문제 1**: 3NF 위반 테이블을 정규화
**문제 2**: BCNF 위반 테이블을 정규화
**문제 3**: 정규화 전후 쿼리 성능 비교`,
      starterCode: `-- 문제 1: 3NF 위반
-- emp_id → dept_id → dept_name (이행 종속)
CREATE TABLE employees_unnormalized (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(50),
    dept_id INT,
    dept_name VARCHAR(50),
    dept_manager VARCHAR(50),
    salary DECIMAL(10,2)
);

INSERT INTO employees_unnormalized VALUES
(1, 'Kim', 10, 'Engineering', 'Park', 5000),
(2, 'Lee', 10, 'Engineering', 'Park', 4500),
(3, 'Choi', 20, 'Marketing', 'Jung', 4000),
(4, 'Park', 10, 'Engineering', 'Park', 6000),
(5, 'Jung', 20, 'Marketing', 'Jung', 5500);

-- 3NF로 변환하세요
-- 테이블: departments, employees


-- 문제 2: BCNF 위반
-- 규칙: 각 학생은 과목당 한 교수에게만 수강
--       각 교수는 한 과목만 담당
-- student_id, subject → professor (후보키)
-- professor → subject (결정자가 후보키가 아님!)

CREATE TABLE course_registrations_bad (
    student_id INT,
    subject VARCHAR(50),
    professor VARCHAR(50),
    PRIMARY KEY (student_id, subject)
);

INSERT INTO course_registrations_bad VALUES
(1, 'Database', 'Dr. Kim'),
(2, 'Database', 'Dr. Kim'),
(1, 'Network', 'Dr. Lee'),
(3, 'Database', 'Dr. Kim'),
(2, 'Algorithm', 'Dr. Park');

-- BCNF로 변환하세요
-- 테이블: professors, course_registrations


-- 문제 3: 정규화 전후 비교 쿼리
-- "Engineering 부서 직원 목록" 조회 쿼리를 작성하세요
-- 정규화 전/후 각각 작성

`,
      solutionCode: `-- 문제 1: 3NF 변환
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50),
    dept_manager VARCHAR(50)
);

CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(50),
    dept_id INT,
    salary DECIMAL(10,2),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- 데이터 이관
INSERT INTO departments (dept_id, dept_name, dept_manager)
SELECT DISTINCT dept_id, dept_name, dept_manager
FROM employees_unnormalized;

INSERT INTO employees (emp_id, emp_name, dept_id, salary)
SELECT emp_id, emp_name, dept_id, salary
FROM employees_unnormalized;

-- 확인
SELECT * FROM departments;
SELECT * FROM employees;

/*
장점:
1. dept_name 변경 시 한 곳만 수정
2. 부서 정보 중복 저장 제거
3. 데이터 일관성 보장
*/


-- 문제 2: BCNF 변환
DROP TABLE IF EXISTS course_registrations;
DROP TABLE IF EXISTS professors;

-- 교수 → 과목 관계 테이블
CREATE TABLE professors (
    professor VARCHAR(50) PRIMARY KEY,
    subject VARCHAR(50) NOT NULL
);

-- 학생 수강 테이블 (학생-교수 관계)
CREATE TABLE course_registrations (
    student_id INT,
    professor VARCHAR(50),
    PRIMARY KEY (student_id, professor),
    FOREIGN KEY (professor) REFERENCES professors(professor)
);

-- 데이터 이관
INSERT INTO professors (professor, subject)
SELECT DISTINCT professor, subject
FROM course_registrations_bad;

INSERT INTO course_registrations (student_id, professor)
SELECT student_id, professor
FROM course_registrations_bad;

-- 확인
SELECT * FROM professors;
SELECT * FROM course_registrations;

-- 원래 형태로 조회
SELECT
    cr.student_id,
    p.subject,
    p.professor
FROM course_registrations cr
JOIN professors p ON cr.professor = p.professor
ORDER BY cr.student_id, p.subject;

/*
professors:
| professor | subject   |
|-----------|-----------|
| Dr. Kim   | Database  |
| Dr. Lee   | Network   |
| Dr. Park  | Algorithm |

course_registrations:
| student_id | professor |
|------------|-----------|
| 1          | Dr. Kim   |
| 1          | Dr. Lee   |
| 2          | Dr. Kim   |
| 2          | Dr. Park  |
| 3          | Dr. Kim   |
*/


-- 문제 3: 정규화 전후 비교

-- 정규화 전: 단순하지만 중복 데이터 존재
SELECT emp_id, emp_name, dept_name, salary
FROM employees_unnormalized
WHERE dept_name = 'Engineering';

-- 정규화 후: JOIN 필요하지만 데이터 일관성 보장
SELECT e.emp_id, e.emp_name, d.dept_name, e.salary
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
WHERE d.dept_name = 'Engineering';

/*
성능 비교:
- 정규화 전: JOIN 없음, 빠른 조회 but 데이터 중복
- 정규화 후: JOIN 필요, 약간 느림 but 데이터 무결성

실무 팁:
- OLTP: 정규화 우선 (데이터 무결성)
- OLAP: 비정규화 고려 (조회 성능)
*/`,
      hints: [
        '3NF: A→B→C 관계에서 B를 별도 테이블로 분리',
        'BCNF: 모든 결정자가 후보키여야 함',
        'professor → subject 관계를 별도 테이블로',
        'JOIN으로 원래 형태 복원 가능'
      ]
    }
  },
  {
    id: 'w4d1-quiz-normalization',
    type: 'quiz',
    title: '퀴즈: 정규화',
    duration: 15,
    access: 'core',
    content: {
      questions: [
        {
          question: '1NF(제1정규형)의 핵심 조건은?',
          options: [
            '모든 속성이 원자값을 가져야 함',
            '부분 함수 종속이 없어야 함',
            '이행 함수 종속이 없어야 함',
            '모든 결정자가 후보키여야 함'
          ],
          answer: 0,
          explanation: '1NF는 모든 속성이 원자값(Atomic Value)을 가져야 합니다. 배열이나 반복 그룹이 없어야 합니다.'
        },
        {
          question: '다음 중 2NF 위반의 예시는?',
          options: [
            '전화번호 여러 개를 한 컬럼에 저장',
            '복합키(A,B) 중 A에만 종속되는 속성 존재',
            'A→B→C 형태의 이행 종속',
            '비후보키가 결정자 역할'
          ],
          answer: 1,
          explanation: '2NF는 복합 기본키의 일부에만 종속되는 부분 함수 종속을 제거해야 합니다.'
        },
        {
          question: '3NF에서 제거해야 하는 것은?',
          options: [
            '원자값이 아닌 속성',
            '부분 함수 종속',
            '이행 함수 종속',
            '다중값 종속'
          ],
          answer: 2,
          explanation: '3NF는 이행 함수 종속(A→B→C)을 제거합니다. B를 별도 테이블로 분리합니다.'
        },
        {
          question: 'BCNF가 3NF보다 엄격한 이유는?',
          options: [
            '원자값 조건이 더 엄격함',
            '모든 결정자가 후보키여야 함',
            '이행 종속을 완전히 제거함',
            '중복을 완전히 제거함'
          ],
          answer: 1,
          explanation: 'BCNF는 3NF 조건에 추가로 "모든 결정자가 후보키"여야 합니다.'
        },
        {
          question: '정규화의 단점이 아닌 것은?',
          options: [
            'JOIN 증가로 인한 성능 저하',
            '쿼리 복잡도 증가',
            '데이터 중복 증가',
            '테이블 수 증가'
          ],
          answer: 2,
          explanation: '정규화는 데이터 중복을 줄입니다. 단점은 JOIN 증가, 쿼리 복잡도, 테이블 수 증가입니다.'
        }
      ]
    }
  },
  {
    id: 'w4d1-challenge-normalize',
    type: 'challenge',
    title: '챌린지: 복합 테이블 정규화',
    duration: 35,
    access: 'core',
    content: {
      instructions: `완전히 비정규화된 테이블을 3NF까지 정규화하세요.

**시나리오**: 도서관 대출 시스템
- 비정규화 테이블에 모든 정보가 포함됨
- 1NF → 2NF → 3NF 순서로 정규화
- 각 단계별 이유 설명 포함`,
      starterCode: `-- 비정규화된 도서관 대출 테이블
CREATE TABLE library_raw (
    loan_id INT,
    member_id INT,
    member_name VARCHAR(50),
    member_phone VARCHAR(20),
    member_address VARCHAR(200),
    book_ids VARCHAR(200),        -- '101, 102, 103' (다중값)
    book_titles VARCHAR(500),     -- 'Book A, Book B, Book C' (다중값)
    book_authors VARCHAR(300),    -- 'Author X, Author Y, Author Z' (다중값)
    publisher_ids VARCHAR(100),   -- '1, 2, 1' (다중값)
    publisher_names VARCHAR(200), -- 'Pub A, Pub B, Pub A' (다중값)
    loan_date DATE,
    due_date DATE,
    return_date DATE
);

INSERT INTO library_raw VALUES
(1, 100, 'Kim', '010-1234-5678', 'Seoul',
 '101, 102', 'Database Design, SQL Basics', 'Dr. Park, Prof. Lee',
 '1, 2', 'Tech Books, Data Press', '2024-01-01', '2024-01-15', NULL),
(2, 101, 'Lee', '010-9876-5432', 'Busan',
 '103', 'Python Guide', 'Dr. Choi', '1', 'Tech Books',
 '2024-01-05', '2024-01-19', '2024-01-18');

-- Step 1: 1NF 변환
-- 다중값 속성을 별도 행으로 분리하세요


-- Step 2: 2NF 변환
-- 부분 종속 제거 (복합키 일부에만 종속되는 속성)


-- Step 3: 3NF 변환
-- 이행 종속 제거


-- 최종 테이블 목록과 관계 설명


-- 정규화된 테이블에서 원래 데이터 형태로 조회하는 쿼리

`,
      requirements: [
        '1NF: 다중값 속성을 별도 테이블로 분리',
        '2NF: 복합키 일부 종속 속성 분리',
        '3NF: 이행 종속 속성 분리',
        '각 단계별 테이블 DDL 작성',
        '정규화 전후 데이터 조회 쿼리'
      ],
      evaluationCriteria: [
        '1NF 조건 충족 (원자값)',
        '2NF 조건 충족 (부분 종속 제거)',
        '3NF 조건 충족 (이행 종속 제거)',
        'FK 관계 정확',
        '원본 데이터 복원 가능'
      ],
      hints: [
        '먼저 다중값을 분리하여 loan_items 테이블 생성',
        'member 정보, book 정보, publisher 정보를 각각 분리',
        'book → publisher 이행 종속 고려',
        'STRING_AGG, unnest 활용'
      ]
    }
  }
]
