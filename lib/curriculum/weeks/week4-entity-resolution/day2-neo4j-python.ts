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
  day: 2,
  title: 'Neo4j Python Driver',
  description: 'Python에서 Neo4j를 연동하고 데이터를 다루는 방법을 학습합니다.',
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
      `,
      keyPoints: ['execute_read/execute_write로 트랜잭션 함수 실행', 'UNWIND로 배치 처리', '결과를 딕셔너리로 변환'],
      practiceGoal: 'Neo4j에서 CRUD 작업을 Python으로 구현할 수 있다',
    }),

    createCodeTask('w4d2-py2neo', 'py2neo OGM 사용', 35, {
      introduction: `
# py2neo OGM (Object Graph Mapping)

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
      `,
      keyPoints: ['py2neo는 고수준 OGM 제공', 'GraphObject로 클래스 정의', 'to_data_frame()으로 pandas 연동'],
      practiceGoal: 'py2neo OGM으로 객체 지향적으로 그래프를 다룰 수 있다',
    }),

    createCodeTask('w4d2-pandas-integration', 'Pandas 연동', 30, {
      introduction: `
# Pandas와 Neo4j 연동

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
      `,
      keyPoints: ['쿼리 결과를 DataFrame으로 변환', 'DataFrame을 UNWIND로 배치 로드', 'pandas 분석 기능 활용'],
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
      keyPoints: ['재사용 가능한 유틸리티 클래스', 'context manager로 리소스 관리', '일반적인 작업 메서드화'],
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
