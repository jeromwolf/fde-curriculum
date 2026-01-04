// Day 2: Neo4j Python Driver & py2neo

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day2Neo4jPython: Day = {
  slug: 'neo4j-python-driver',
  title: 'Neo4j Python Driver',
  totalDuration: 240,
  tasks: [
    createVideoTask('w4d2-neo4j-driver-overview', 'Neo4j Python Driver 개요', 25, {
      introduction: `
# Neo4j Python Driver 개요

## 학습 목표
- Neo4j 공식 Python 드라이버를 이해한다
- 연결 설정과 세션 관리를 익힌다
- 트랜잭션 패턴을 파악한다

## 설치

\`\`\`bash
pip install neo4j
\`\`\`

## 기본 연결

\`\`\`python
from neo4j import GraphDatabase

class Neo4jConnection:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def verify_connectivity(self):
        self.driver.verify_connectivity()
        print("연결 성공!")

# 사용
conn = Neo4jConnection(
    "bolt://localhost:7687",
    "neo4j",
    "password"
)
conn.verify_connectivity()
\`\`\`

## 세션과 트랜잭션

\`\`\`python
# 자동 커밋 트랜잭션
with driver.session() as session:
    result = session.run("MATCH (n) RETURN count(n)")
    print(result.single()[0])

# 명시적 트랜잭션
with driver.session() as session:
    with session.begin_transaction() as tx:
        tx.run("CREATE (n:Person {name: $name})", name="Kim")
        tx.run("CREATE (n:Person {name: $name})", name="Lee")
        tx.commit()  # 명시적 커밋
\`\`\`

## 파라미터 바인딩

\`\`\`python
# 안전한 파라미터 바인딩 (SQL Injection 방지)
session.run(
    "CREATE (p:Person {name: $name, age: $age})",
    name="김철수",
    age=30
)

# 딕셔너리로 전달
params = {"name": "이영희", "age": 28}
session.run("CREATE (p:Person {name: $name, age: $age})", **params)
\`\`\`

## 핵심 포인트
1. **GraphDatabase.driver()** = 연결 생성
2. **session** = 작업 단위
3. **파라미터 바인딩** = 보안과 성능
      `,
      keyPoints: ['Neo4j 공식 드라이버로 Python 연동', '세션과 트랜잭션 관리', '파라미터 바인딩으로 안전한 쿼리'],
      practiceGoal: 'Neo4j Python Driver의 기본 사용법을 익힌다',
    }),

    createCodeTask('w4d2-crud-operations', 'CRUD 작업 구현', 35, {
      introduction: `
# CRUD 작업 구현

## 🎯 왜 CRUD 패턴이 중요한가?

### 문제 상황
Neo4j에 데이터 넣고, 읽고, 수정하고, 삭제하는 작업을 매번 다르게 작성하면?
- 코드 중복
- 에러 처리 누락
- 트랜잭션 관리 어려움

### 해결책
> 📦 **비유**: CRUD는 **택배 시스템**입니다.
>
> Create(발송) → Read(조회) → Update(수정) → Delete(폐기)
> 표준화된 절차로 안전하고 빠르게 처리!

## Create

\`\`\`python
def create_person(tx, name, age):
    query = """
    CREATE (p:Person {name: $name, age: $age})
    RETURN p
    """
    result = tx.run(query, name=name, age=age)
    return result.single()

with driver.session() as session:
    person = session.execute_write(create_person, "김철수", 30)
\`\`\`

## Read

\`\`\`python
def find_person(tx, name):
    query = """
    MATCH (p:Person {name: $name})
    RETURN p.name AS name, p.age AS age
    """
    result = tx.run(query, name=name)
    return [record.data() for record in result]

with driver.session() as session:
    persons = session.execute_read(find_person, "김철수")
\`\`\`

## Update

\`\`\`python
def update_age(tx, name, new_age):
    query = """
    MATCH (p:Person {name: $name})
    SET p.age = $new_age
    RETURN p
    """
    result = tx.run(query, name=name, new_age=new_age)
    return result.single()
\`\`\`

## Delete

\`\`\`python
def delete_person(tx, name):
    query = """
    MATCH (p:Person {name: $name})
    DETACH DELETE p
    """
    tx.run(query, name=name)
\`\`\`

## 배치 처리

\`\`\`python
def batch_create(tx, persons):
    query = """
    UNWIND $persons AS person
    CREATE (p:Person {name: person.name, age: person.age})
    """
    tx.run(query, persons=persons)

data = [
    {"name": "A", "age": 20},
    {"name": "B", "age": 25},
    {"name": "C", "age": 30}
]
with driver.session() as session:
    session.execute_write(batch_create, data)
\`\`\`

## ⚠️ Common Pitfalls (자주 하는 실수)

### 1. [리소스 누수] 세션/드라이버 미종료
**증상**: 연결 풀 고갈, 메모리 누수, "ConnectionPoolExhausted" 에러
\`\`\`python
# ❌ 잘못된 예시 - 세션 수동 관리 후 종료 누락
session = driver.session()
result = session.run("MATCH (n) RETURN n")
# session.close() 빠짐!
\`\`\`
**왜 잘못되었나**: 세션이 열린 채로 남아 연결 풀이 고갈됨
\`\`\`python
# ✅ 올바른 예시 - context manager 사용
with driver.session() as session:
    result = session.run("MATCH (n) RETURN n")
# 자동으로 close됨
\`\`\`
**기억할 점**: \`with\` 문은 예외가 발생해도 자동 종료 보장

### 2. [트랜잭션] execute_read에서 쓰기 작업
**증상**: 클러스터 환경에서 에러, 단일 인스턴스에서는 동작하지만 프로덕션에서 실패
\`\`\`python
# ❌ 잘못된 예시 - read 함수에서 CREATE
def bad_function(tx):
    tx.run("CREATE (n:Person {name: 'Kim'})")  # 쓰기!
session.execute_read(bad_function)  # 💥 replica로 라우팅되어 실패
\`\`\`
**왜 잘못되었나**: execute_read는 replica 노드로 라우팅, replica는 읽기 전용
\`\`\`python
# ✅ 올바른 예시 - 쓰기는 execute_write
def create_person(tx):
    tx.run("CREATE (n:Person {name: 'Kim'})")
session.execute_write(create_person)  # leader로 라우팅
\`\`\`
**기억할 점**: \`execute_read\` = MATCH만, \`execute_write\` = CREATE/MERGE/SET/DELETE

### 3. [SQL Injection] 문자열 포매팅 사용
**증상**: 보안 취약점, 쿼리 오류
\`\`\`python
# ❌ 잘못된 예시 - f-string 사용
name = "Kim'; MATCH (n) DETACH DELETE n; //"  # 악의적 입력
session.run(f"MATCH (p:Person {{name: '{name}'}}) RETURN p")  # 💥 전체 DB 삭제!
\`\`\`
**왜 잘못되었나**: 사용자 입력이 Cypher 코드로 실행됨
\`\`\`python
# ✅ 올바른 예시 - 파라미터 바인딩
session.run("MATCH (p:Person {name: $name}) RETURN p", name=name)
# name 값이 문자열로만 처리됨, 코드로 실행 안됨
\`\`\`
**기억할 점**: 외부 입력은 항상 \`$param\` 파라미터로 전달
      `,
      keyPoints: ['✍️ execute_read/execute_write로 트랜잭션 함수 실행', '⚡ UNWIND로 배치 처리', '📋 결과를 딕셔너리로 변환'],
      practiceGoal: 'Neo4j에서 CRUD 작업을 Python으로 구현할 수 있다',
    }),

    createCodeTask('w4d2-py2neo', 'py2neo OGM 사용', 35, {
      introduction: `
# py2neo OGM (Object Graph Mapping)

## 🎯 왜 OGM이 필요한가?

### 문제 상황
Cypher 쿼리를 직접 작성하면 문자열 지옥에 빠집니다.
- 오타 많음
- 타입 안전성 없음
- 코드 재사용 어려움

### 해결책
> 🎭 **비유**: OGM은 **번역기**입니다.
>
> Python 객체 ↔ Neo4j 노드/관계 자동 변환
> person.friends.add(lee) → MERGE (person)-[:KNOWS]->(lee)

## 설치

\`\`\`bash
pip install py2neo
\`\`\`

## 기본 연결

\`\`\`python
from py2neo import Graph, Node, Relationship

graph = Graph("bolt://localhost:7687", auth=("neo4j", "password"))
\`\`\`

## 노드와 관계 생성

\`\`\`python
# 노드 생성
person = Node("Person", name="김철수", age=30)
graph.create(person)

# 관계 생성
friend = Node("Person", name="이영희", age=28)
knows = Relationship(person, "KNOWS", friend, since=2020)
graph.create(knows)
\`\`\`

## OGM 클래스 정의

\`\`\`python
from py2neo.ogm import GraphObject, Property, RelatedTo

class Person(GraphObject):
    __primarykey__ = "name"

    name = Property()
    age = Property()
    friends = RelatedTo("Person", "KNOWS")

# 사용
kim = Person()
kim.name = "김철수"
kim.age = 30
graph.push(kim)

# 조회
kim = Person.match(graph, "김철수").first()
print(kim.name, kim.age)

# 관계 추가
lee = Person()
lee.name = "이영희"
kim.friends.add(lee)
graph.push(kim)
\`\`\`

## Cypher 실행

\`\`\`python
result = graph.run("MATCH (p:Person) RETURN p.name, p.age LIMIT 10")
for record in result:
    print(record["p.name"], record["p.age"])

# DataFrame으로 변환
df = graph.run("MATCH (p:Person) RETURN p.name, p.age").to_data_frame()
\`\`\`

## ⚠️ Common Pitfalls (자주 하는 실수)

### 1. [동기화] push() 없이 변경 기대
**증상**: 객체 수정했는데 DB에 반영 안됨
\`\`\`python
# ❌ 잘못된 예시 - push 누락
kim = Person.match(graph, "김철수").first()
kim.age = 31  # 메모리에서만 변경
# graph.push(kim) 빠짐!
\`\`\`
**왜 잘못되었나**: py2neo OGM은 자동 저장이 아님, 명시적 push 필요
\`\`\`python
# ✅ 올바른 예시 - 변경 후 push
kim = Person.match(graph, "김철수").first()
kim.age = 31
graph.push(kim)  # DB에 반영
\`\`\`
**기억할 점**: 변경 후 반드시 \`graph.push(객체)\` 호출

### 2. [primarykey] 중복 엔티티 생성
**증상**: 같은 이름의 Person이 여러 개 생성됨
\`\`\`python
# ❌ 잘못된 예시 - 기존 존재 확인 안함
new_person = Person()
new_person.name = "김철수"  # 이미 존재할 수 있음
graph.push(new_person)  # 중복 생성!
\`\`\`
**왜 잘못되었나**: push는 CREATE, 기존 확인하려면 match 먼저
\`\`\`python
# ✅ 올바른 예시 - match 후 없으면 생성
kim = Person.match(graph, "김철수").first()
if kim is None:
    kim = Person()
    kim.name = "김철수"
kim.age = 30
graph.push(kim)
\`\`\`
**기억할 점**: \`__primarykey__\`는 Python에서만 참조, Neo4j에서 자동 제약 아님

### 3. [공식 드라이버] py2neo vs neo4j 드라이버 혼동
**증상**: API가 다름, 코드 호환 안됨
\`\`\`python
# py2neo 스타일
graph = Graph("bolt://...", auth=(...))
graph.run("MATCH ...")

# neo4j 드라이버 스타일
driver = GraphDatabase.driver("bolt://...", auth=(...))
with driver.session() as session:
    session.run("MATCH ...")
\`\`\`
**기억할 점**: 프로덕션에서는 공식 \`neo4j\` 드라이버 권장, py2neo는 프로토타이핑용
      `,
      keyPoints: ['🎭 py2neo는 고수준 OGM 제공', '🏛️ GraphObject로 클래스 정의', '📊 to_data_frame()으로 pandas 연동'],
      practiceGoal: 'py2neo OGM으로 객체 지향적으로 그래프를 다룰 수 있다',
    }),

    createCodeTask('w4d2-pandas-integration', 'Pandas 연동', 30, {
      introduction: `
# Pandas와 Neo4j 연동

## 🎯 왜 Pandas 연동이 필요한가?

### 문제 상황
Neo4j 데이터를 분석하려면 데이터프레임으로 변환이 필요합니다.
- Cypher로는 복잡한 통계 분석 어려움
- 머신러닝 라이브러리는 DataFrame 필요
- 시각화도 DataFrame이 편함

### 해결책
> 🌉 **비유**: Pandas 연동은 **다리 건설**입니다.
>
> Neo4j(그래프 세계) ↔ Pandas(표 세계)
> 양쪽의 장점을 모두 활용!

## 쿼리 결과를 DataFrame으로

\`\`\`python
import pandas as pd
from neo4j import GraphDatabase

def query_to_dataframe(driver, query, params=None):
    with driver.session() as session:
        result = session.run(query, params or {})
        return pd.DataFrame([r.data() for r in result])

# 사용
df = query_to_dataframe(driver, """
    MATCH (p:Person)-[:WORKS_AT]->(c:Company)
    RETURN p.name AS person, c.name AS company, p.age AS age
""")
print(df.describe())
\`\`\`

## DataFrame을 Neo4j로

\`\`\`python
def dataframe_to_neo4j(driver, df, label):
    query = f"""
    UNWIND $rows AS row
    CREATE (n:{label})
    SET n = row
    """
    with driver.session() as session:
        session.run(query, rows=df.to_dict('records'))

# CSV 로드 후 Neo4j로
companies = pd.read_csv("companies.csv")
dataframe_to_neo4j(driver, companies, "Company")
\`\`\`

## 그래프 통계 분석

\`\`\`python
stats_query = """
MATCH (c:Company)
RETURN c.industry AS industry,
       count(c) AS count,
       avg(c.employees) AS avg_employees
"""
df = query_to_dataframe(driver, stats_query)
print(df.groupby('industry').mean())
\`\`\`

## ⚠️ Common Pitfalls (자주 하는 실수)

### 1. [메모리] 대용량 결과 전체 로드
**증상**: 메모리 부족, 느린 응답, OOM 에러
\`\`\`python
# ❌ 잘못된 예시 - 100만 건 전체 로드
df = query_to_dataframe(driver, "MATCH (n) RETURN n")  # 💥 메모리 폭발
\`\`\`
**왜 잘못되었나**: 모든 결과를 한 번에 메모리에 올림
\`\`\`python
# ✅ 올바른 예시 - 페이지네이션 또는 집계
df = query_to_dataframe(driver, "MATCH (n) RETURN n LIMIT 10000")

# 또는 집계 쿼리 사용
df = query_to_dataframe(driver, """
    MATCH (n:Person)
    RETURN n.age AS age, count(*) AS count
    ORDER BY age
""")
\`\`\`
**기억할 점**: 항상 \`LIMIT\` 사용하거나 집계해서 반환

### 2. [타입 변환] Neo4j 타입 → Python 타입 불일치
**증상**: DataFrame에 이상한 값, Node 객체가 그대로 들어옴
\`\`\`python
# ❌ 잘못된 예시 - 노드 객체 반환
df = query_to_dataframe(driver, "MATCH (p:Person) RETURN p")
# df['p']가 Node 객체로 채워짐
\`\`\`
**왜 잘못되었나**: \`RETURN p\`는 Node 객체, DataFrame에서 다루기 어려움
\`\`\`python
# ✅ 올바른 예시 - 속성 명시적 반환
df = query_to_dataframe(driver, """
    MATCH (p:Person)
    RETURN p.name AS name, p.age AS age  -- 속성만 반환
""")
\`\`\`
**기억할 점**: \`RETURN n.속성 AS 별칭\` 형태로 스칼라 값만 반환

### 3. [데이터 정합성] DataFrame → Neo4j 로드 시 중복
**증상**: 같은 노드가 여러 번 생성됨
\`\`\`python
# ❌ 잘못된 예시 - CREATE 사용
df = pd.read_csv("companies.csv")  # 중복 데이터 있을 수 있음
dataframe_to_neo4j(driver, df, "Company")  # 중복 생성!
\`\`\`
**왜 잘못되었나**: CREATE는 항상 새 노드 생성
\`\`\`python
# ✅ 올바른 예시 - MERGE 사용
def dataframe_to_neo4j_safe(driver, df, label, key):
    query = f"""
    UNWIND $rows AS row
    MERGE (n:{label} {{{key}: row.{key}}})
    SET n = row
    """
    with driver.session() as session:
        session.run(query, rows=df.to_dict('records'))
\`\`\`
**기억할 점**: 업서트는 \`MERGE\`, 새로 생성만 \`CREATE\`
      `,
      keyPoints: ['📊 쿼리 결과를 DataFrame으로 변환', '⬆️ DataFrame을 UNWIND로 배치 로드', '📈 pandas 분석 기능 활용'],
      practiceGoal: 'pandas와 Neo4j를 연동하여 데이터 분석을 수행할 수 있다',
    }),

    createReadingTask('w4d2-connection-pooling', '연결 풀링과 성능 최적화', 25, {
      introduction: `
# 연결 풀링과 성능 최적화

## 연결 풀 설정

\`\`\`python
driver = GraphDatabase.driver(
    uri,
    auth=(user, password),
    max_connection_lifetime=3600,
    max_connection_pool_size=50,
    connection_acquisition_timeout=60
)
\`\`\`

## 배치 처리 최적화

\`\`\`python
# 큰 데이터는 청크로 분할
def batch_insert(driver, data, batch_size=1000):
    for i in range(0, len(data), batch_size):
        batch = data[i:i+batch_size]
        with driver.session() as session:
            session.execute_write(lambda tx: tx.run(
                "UNWIND $batch AS row CREATE (n:Node) SET n = row",
                batch=batch
            ))
\`\`\`

## 인덱스 활용

\`\`\`python
# 조회 전 인덱스 생성
driver.session().run("CREATE INDEX company_name IF NOT EXISTS FOR (c:Company) ON (c.name)")
\`\`\`
      `,
      keyPoints: ['연결 풀 설정으로 성능 향상', '배치 처리로 대량 데이터 처리', '인덱스로 쿼리 최적화'],
      practiceGoal: 'Neo4j 연결과 쿼리 성능을 최적화할 수 있다',
    }),

    createCodeTask('w4d2-practical-utils', '실용 유틸리티 클래스 구현', 35, {
      introduction: `
# 실용 유틸리티 클래스

## 🎯 왜 유틸리티 클래스를 만드는가?

### 문제 상황
프로젝트마다 Neo4j 연결, 쿼리, 배치 처리 코드를 반복 작성하면?
- 코드 중복
- 버그 재발
- 유지보수 어려움

### 해결책
> 🧰 **비유**: 유틸리티 클래스는 **공구함**입니다.
>
> 자주 쓰는 작업을 미리 만들어 놓고 재사용!
> query(), query_df(), batch_create() 등

\`\`\`python
from neo4j import GraphDatabase
import pandas as pd
from contextlib import contextmanager

class Neo4jClient:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    @contextmanager
    def session(self):
        session = self.driver.session()
        try:
            yield session
        finally:
            session.close()

    def query(self, cypher, params=None):
        with self.session() as session:
            result = session.run(cypher, params or {})
            return [r.data() for r in result]

    def query_df(self, cypher, params=None):
        return pd.DataFrame(self.query(cypher, params))

    def execute(self, cypher, params=None):
        with self.session() as session:
            session.run(cypher, params or {})

    def batch_create(self, label, data, batch_size=1000):
        for i in range(0, len(data), batch_size):
            batch = data[i:i+batch_size]
            self.execute(f"UNWIND $batch AS row CREATE (n:{label}) SET n = row", {"batch": batch})

    def count(self, label):
        result = self.query(f"MATCH (n:{label}) RETURN count(n) AS count")
        return result[0]['count'] if result else 0

    def delete_all(self, label=None):
        if label:
            self.execute(f"MATCH (n:{label}) DETACH DELETE n")
        else:
            self.execute("MATCH (n) DETACH DELETE n")

# 사용 예
client = Neo4jClient("bolt://localhost:7687", "neo4j", "password")

# DataFrame으로 조회
df = client.query_df("MATCH (p:Person) RETURN p.name, p.age")

# 배치 생성
companies = [{"name": "A", "employees": 100}, {"name": "B", "employees": 200}]
client.batch_create("Company", companies)

print(f"총 회사 수: {client.count('Company')}")
client.close()
\`\`\`
      `,
      keyPoints: ['🧰 재사용 가능한 유틸리티 클래스', '🔒 context manager로 리소스 관리', '⚙️ 일반적인 작업 메서드화'],
      practiceGoal: '프로젝트에서 재사용 가능한 Neo4j 유틸리티를 구현할 수 있다',
    }),

    createQuizTask('w4d2-quiz', 'Day 2 복습 퀴즈', 15, {
      introduction: '# Day 2 복습 퀴즈\nNeo4j Python 연동에 대한 내용을 확인합니다.',
      questions: [
        {
          id: 'w4d2-q1',
          question: 'Neo4j 공식 Python 드라이버에서 읽기 전용 트랜잭션에 사용하는 메서드는?',
          options: ['execute_read', 'execute_write', 'run_read', 'query'],
          correctAnswer: 0,
          explanation: 'execute_read는 읽기 전용 트랜잭션을 실행하며, 클러스터 환경에서 replica로 라우팅됩니다.',
        },
        {
          id: 'w4d2-q2',
          question: 'py2neo에서 OGM 클래스의 기본키를 지정하는 속성은?',
          options: ['__primarykey__', '__key__', '__id__', 'primary_key'],
          correctAnswer: 0,
          explanation: '__primarykey__는 py2neo OGM에서 엔티티를 고유하게 식별하는 속성을 지정합니다.',
        },
        {
          id: 'w4d2-q3',
          question: '대량 데이터를 Neo4j에 효율적으로 삽입할 때 사용하는 Cypher 키워드는?',
          options: ['FOREACH', 'UNWIND', 'LOAD', 'BATCH'],
          correctAnswer: 1,
          explanation: 'UNWIND는 리스트를 개별 행으로 풀어 배치 처리를 가능하게 합니다.',
        },
      ],
      keyPoints: ['execute_read/execute_write로 트랜잭션 분리', '__primarykey__로 OGM 기본키 지정', 'UNWIND로 배치 삽입'],
      practiceGoal: 'Neo4j Python 연동의 핵심 개념을 확인한다',
    }),
  ],

  challenge: createChallengeTask('w4d2-challenge', 'Challenge: KG 데이터 ETL 파이프라인', 40, {
    introduction: `
# Challenge: KG 데이터 ETL 파이프라인

## 과제
CSV/JSON 파일에서 데이터를 읽어 Neo4j Knowledge Graph로 로드하는 ETL 파이프라인을 구축하세요.

## 요구사항
1. 다양한 형식 지원 (CSV, JSON)
2. 데이터 검증 및 정제
3. 배치 처리 (1000개 단위)
4. 관계 생성
5. 로딩 통계 출력
    `,
    keyPoints: ['ETL 파이프라인 설계', '다양한 데이터 형식 처리', '배치 처리와 에러 핸들링'],
    practiceGoal: '실제 데이터를 Neo4j로 로드하는 ETL 파이프라인을 구축한다',
  }),
}
