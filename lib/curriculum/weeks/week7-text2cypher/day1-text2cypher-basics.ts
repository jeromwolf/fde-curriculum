// Week 7 Day 1: Text2Cypher 기초

import type { Day } from './types'
import { createVideoTask, createReadingTask, createCodeTask, createQuizTask } from './types'

const task1 = createVideoTask('w7d1-intro', 'Text2Cypher: LLM으로 Cypher 쿼리 생성하기', 25, {
  introduction: `
## Text2Cypher 소개

### Text2Cypher란?

자연어 질문을 Cypher 쿼리로 자동 변환하는 기술입니다.

\`\`\`
사용자: "삼성전자의 경쟁사는 누구야?"
    ↓ LLM
Cypher: MATCH (c:Company {name: '삼성전자'})-[:COMPETES_WITH]->(comp)
        RETURN comp.name
\`\`\`

### 왜 필요한가?

| 기존 방식 | Text2Cypher |
|----------|-------------|
| Cypher 학습 필요 | 자연어로 질문 |
| 개발자만 사용 | 누구나 사용 |
| 고정된 쿼리 | 유연한 질문 |

### 도전 과제

1. **스키마 이해**: LLM이 DB 구조를 알아야 함
2. **쿼리 정확성**: 문법적으로 올바른 Cypher 생성
3. **보안**: 위험한 쿼리 차단 (DELETE 등)
4. **에러 처리**: 실패 시 재시도
`,
  keyPoints: ['자연어 → Cypher 자동 변환', 'LLM이 스키마를 이해해야 정확한 쿼리 생성', '보안과 에러 처리가 핵심 과제'],
  practiceGoal: 'Text2Cypher의 개념과 필요성 이해',
})

const task2 = createReadingTask('w7d1-schema', '스키마 프롬프팅의 중요성', 30, {
  introduction: `
## 스키마 프롬프팅

### 스키마가 왜 중요한가?

LLM이 정확한 Cypher를 생성하려면 데이터베이스 구조를 알아야 합니다.

**스키마 없이**:
\`\`\`
질문: "삼성전자의 CEO는?"
LLM: MATCH (c:Company)-[:HAS_CEO]->(p) ...  # 관계명이 틀릴 수 있음
\`\`\`

**스키마 제공**:
\`\`\`
스키마:
- (:Company)-[:LED_BY]->(:Person)

질문: "삼성전자의 CEO는?"
LLM: MATCH (c:Company {name: '삼성전자'})-[:LED_BY]->(p:Person)
     RETURN p.name
\`\`\`

### Neo4j 스키마 추출

\`\`\`python
from langchain_community.graphs import Neo4jGraph

graph = Neo4jGraph(url="bolt://localhost:7687", username="neo4j", password="password")
print(graph.schema)

# 출력:
# Node properties:
# - Company: name, industry, founded
# - Person: name, role, age
# Relationship properties:
# - LED_BY: since
# Relationships:
# - (:Company)-[:LED_BY]->(:Person)
# - (:Company)-[:COMPETES_WITH]->(:Company)
\`\`\`

### 스키마 프롬프트 설계

\`\`\`
당신은 Neo4j Cypher 전문가입니다.
다음 스키마를 기반으로 질문에 답하는 Cypher를 생성하세요.

=== 스키마 ===
노드:
- Company (name, industry, founded)
- Person (name, role)

관계:
- (Company)-[LED_BY]->(Person)
- (Company)-[COMPETES_WITH]->(Company)

=== 규칙 ===
1. MATCH로 시작하는 읽기 쿼리만 생성
2. 존재하는 레이블과 관계만 사용
3. LIMIT 10 이하로 제한

질문: {question}
Cypher:
\`\`\`
`,
  keyPoints: ['스키마 없이는 LLM이 잘못된 레이블/관계 사용', 'Neo4jGraph.schema로 자동 추출', '프롬프트에 스키마 + 규칙 포함'],
  practiceGoal: '스키마 프롬프팅의 중요성과 설계 방법 이해',
})

const task3 = createCodeTask('w7d1-basic-impl', '실습: 기본 Text2Cypher 구현', 50, {
  introduction: `
## 기본 Text2Cypher 구현

### LangChain GraphCypherQAChain

\`\`\`python
from langchain_community.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain
from langchain_openai import ChatOpenAI

# 연결
graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password"
)

# LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Chain 생성
chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph,
    verbose=True,  # 생성된 Cypher 출력
    return_intermediate_steps=True
)

# 질문
result = chain.invoke({"query": "삼성전자와 경쟁하는 회사들은?"})
print("Generated Cypher:", result['intermediate_steps'][0]['query'])
print("Answer:", result['result'])
\`\`\`

### 커스텀 구현

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

class SimpleText2Cypher:
    def __init__(self, graph, llm):
        self.graph = graph
        self.llm = llm

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """Neo4j Cypher 전문가입니다.
스키마: {schema}

규칙:
- MATCH로 시작하는 읽기 쿼리만
- 존재하는 레이블/관계만 사용
- LIMIT 10 이하

Cypher 쿼리만 출력 (설명 없이):"""),
            ("human", "{question}")
        ])

    def generate_cypher(self, question: str) -> str:
        chain = self.prompt | self.llm | StrOutputParser()
        return chain.invoke({
            "schema": self.graph.schema,
            "question": question
        })

    def query(self, question: str) -> dict:
        cypher = self.generate_cypher(question)
        results = self.graph.query(cypher)
        return {"cypher": cypher, "results": results}

# 사용
t2c = SimpleText2Cypher(graph, llm)
result = t2c.query("삼성전자의 경쟁사는?")
print(result)
\`\`\`
`,
  keyPoints: ['GraphCypherQAChain: LangChain 기본 제공', '커스텀 구현: 더 많은 제어 가능', 'temperature=0으로 일관된 쿼리 생성'],
  practiceGoal: '기본 Text2Cypher 시스템 구현',
  codeExample: `from langchain_community.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain
from langchain_openai import ChatOpenAI

graph = Neo4jGraph(url="bolt://localhost:7687", username="neo4j", password="password")
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

chain = GraphCypherQAChain.from_llm(llm=llm, graph=graph, verbose=True)
result = chain.invoke({"query": "모든 회사 이름을 알려줘"})
print(result['result'])`,
})

const task4 = createCodeTask('w7d1-validation', '실습: 쿼리 검증 구현', 45, {
  introduction: `
## 쿼리 검증

### 보안 검증

위험한 쿼리를 차단합니다.

\`\`\`python
def validate_cypher(query: str) -> tuple[bool, str]:
    """Cypher 쿼리 검증"""
    query_upper = query.upper()

    # 금지된 키워드
    forbidden = ['DELETE', 'DETACH', 'DROP', 'CREATE', 'SET', 'REMOVE', 'MERGE']

    for keyword in forbidden:
        if keyword in query_upper:
            return False, f"금지된 키워드: {keyword}"

    # LIMIT 필수
    if 'LIMIT' not in query_upper:
        return False, "LIMIT 절이 필요합니다"

    # LIMIT 값 검증
    import re
    limit_match = re.search(r'LIMIT\\s+(\\d+)', query_upper)
    if limit_match and int(limit_match.group(1)) > 100:
        return False, "LIMIT는 100 이하여야 합니다"

    return True, "OK"

# 테스트
print(validate_cypher("MATCH (n) RETURN n LIMIT 10"))  # (True, "OK")
print(validate_cypher("MATCH (n) DELETE n"))  # (False, "금지된 키워드: DELETE")
\`\`\`

### 스키마 검증

존재하지 않는 레이블/관계 사용 감지:

\`\`\`python
def validate_schema(query: str, schema: str) -> tuple[bool, str]:
    """스키마 기반 검증"""
    import re

    # 쿼리에서 레이블 추출
    labels = re.findall(r':\\s*(\\w+)', query)

    # 스키마에서 유효한 레이블 추출
    valid_labels = re.findall(r'- (\\w+):', schema)

    for label in labels:
        if label not in valid_labels and label not in ['n', 'r', 'node', 'rel']:
            return False, f"알 수 없는 레이블: {label}"

    return True, "OK"
\`\`\`

### 통합 검증

\`\`\`python
class SafeText2Cypher:
    def __init__(self, graph, llm):
        self.graph = graph
        self.llm = llm

    def query(self, question: str) -> dict:
        # 1. Cypher 생성
        cypher = self.generate_cypher(question)

        # 2. 보안 검증
        is_safe, msg = validate_cypher(cypher)
        if not is_safe:
            return {"error": f"보안 검증 실패: {msg}"}

        # 3. 스키마 검증
        is_valid, msg = validate_schema(cypher, self.graph.schema)
        if not is_valid:
            return {"error": f"스키마 검증 실패: {msg}"}

        # 4. 실행
        try:
            results = self.graph.query(cypher)
            return {"cypher": cypher, "results": results}
        except Exception as e:
            return {"error": f"실행 오류: {str(e)}"}
\`\`\`
`,
  keyPoints: ['보안 검증: DELETE, CREATE 등 차단', 'LIMIT 필수 및 값 제한', '스키마 검증: 존재하지 않는 레이블 감지', '통합 검증으로 안전한 실행'],
  practiceGoal: '안전한 쿼리 검증 시스템 구현',
  codeExample: `def validate_cypher(query: str) -> tuple[bool, str]:
    forbidden = ['DELETE', 'CREATE', 'SET', 'DROP', 'REMOVE']
    query_upper = query.upper()

    for kw in forbidden:
        if kw in query_upper:
            return False, f"금지: {kw}"

    if 'LIMIT' not in query_upper:
        return False, "LIMIT 필요"

    return True, "OK"

# 테스트
print(validate_cypher("MATCH (n) RETURN n LIMIT 10"))
print(validate_cypher("MATCH (n) DELETE n"))`,
})

const task5 = createReadingTask('w7d1-best-practices', 'Text2Cypher 모범 사례', 30, {
  introduction: `
## Text2Cypher 모범 사례

### 1. 프롬프트 최적화

**나쁜 예**:
\`\`\`
질문을 Cypher로 바꿔줘.
질문: {question}
\`\`\`

**좋은 예**:
\`\`\`
당신은 Neo4j Cypher 전문가입니다.

스키마:
{schema}

규칙:
1. MATCH로 시작하는 읽기 전용 쿼리만 생성
2. 항상 LIMIT 절 포함 (최대 10)
3. 존재하는 레이블과 관계만 사용
4. 속성 이름은 정확히 사용

예시:
Q: 모든 회사 이름
A: MATCH (c:Company) RETURN c.name LIMIT 10

질문: {question}
Cypher (코드만):
\`\`\`

### 2. 에러 메시지 활용

실패 시 에러 메시지를 포함하여 재시도:

\`\`\`python
def query_with_retry(self, question: str, max_retries: int = 3) -> dict:
    error_context = ""

    for attempt in range(max_retries):
        cypher = self.generate_cypher(question, error_context)

        try:
            results = self.graph.query(cypher)
            return {"cypher": cypher, "results": results}
        except Exception as e:
            error_context = f"이전 시도 오류: {str(e)}\\n수정된 쿼리를 생성하세요."

    return {"error": "최대 재시도 횟수 초과"}
\`\`\`

### 3. 결과 포맷팅

LLM으로 결과를 자연어로 변환:

\`\`\`python
def format_results(question: str, results: list) -> str:
    prompt = f"""
질문: {question}
데이터: {results}

위 데이터를 바탕으로 자연스러운 한국어로 답변하세요.
"""
    return llm.invoke(prompt).content
\`\`\`

### 4. 캐싱

동일 질문 캐싱:

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=100)
def cached_generate_cypher(question: str, schema_hash: str) -> str:
    return generate_cypher(question)
\`\`\`
`,
  keyPoints: ['상세한 스키마 + 규칙 + 예시 포함 프롬프트', '에러 메시지로 재시도하여 자동 수정', '결과를 자연어로 포맷팅', '캐싱으로 성능 최적화'],
  practiceGoal: 'Text2Cypher 모범 사례 습득',
})

const task6 = createQuizTask('w7d1-quiz', 'Day 1 복습 퀴즈', 15, {
  questions: [
    { id: 'q1', question: 'Text2Cypher에서 스키마 프롬프팅이 중요한 이유는?', options: ['속도 향상', 'LLM이 올바른 레이블/관계를 사용하도록', '보안 강화', '캐싱 지원'], correctAnswer: 1, explanation: '스키마 없이는 LLM이 존재하지 않는 레이블이나 관계를 사용할 수 있습니다.' },
    { id: 'q2', question: '쿼리 검증에서 차단해야 할 키워드가 아닌 것은?', options: ['DELETE', 'CREATE', 'MATCH', 'DROP'], correctAnswer: 2, explanation: 'MATCH는 읽기 전용 쿼리의 시작이므로 허용됩니다.' },
    { id: 'q3', question: 'temperature=0으로 설정하는 이유는?', options: ['속도 향상', '일관된 쿼리 생성', '메모리 절약', '다국어 지원'], correctAnswer: 1, explanation: 'temperature=0은 결정적 출력으로 동일 질문에 동일 쿼리를 생성합니다.' },
  ],
  keyPoints: ['스키마 프롬프팅의 중요성', '쿼리 검증 항목', 'LLM 파라미터 설정'],
  practiceGoal: 'Day 1 학습 내용 복습',
})

export const day1Text2cypherBasics: Day = {
  slug: 'text2cypher-basics',
  title: 'Text2Cypher 기초',
  totalDuration: 195,
  tasks: [task1, task2, task3, task4, task5, task6],
}
