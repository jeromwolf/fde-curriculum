// Week 7 Day 2: Few-shot Learning & 프롬프트 엔지니어링

import type { Day } from './types'
import { createVideoTask, createReadingTask, createCodeTask, createQuizTask } from './types'

const task1 = createVideoTask('w7d2-few-shot-intro', 'Few-shot Learning으로 정확도 높이기', 25, {
  introduction: `
## Few-shot Learning

### Few-shot이란?

LLM에게 몇 가지 예시를 제공하여 패턴을 학습시키는 기법입니다.

\`\`\`
Zero-shot: 예시 없이 직접 질문
Few-shot: 2-5개 예시 제공 후 질문
\`\`\`

### Text2Cypher에서의 효과

| 방식 | 정확도 | 특징 |
|------|--------|------|
| Zero-shot | ~60% | 단순 질문만 정확 |
| Few-shot (3-5개) | ~85% | 복잡한 패턴도 학습 |
| Fine-tuned | ~95% | 도메인 특화 필요 |

### Few-shot 예시 설계

\`\`\`
예시 1:
Q: 모든 회사의 이름을 알려줘
A: MATCH (c:Company) RETURN c.name LIMIT 10

예시 2:
Q: 삼성전자의 경쟁사는?
A: MATCH (c:Company {name: '삼성전자'})-[:COMPETES_WITH]->(comp)
   RETURN comp.name LIMIT 10

예시 3:
Q: 이재용이 이끄는 회사는?
A: MATCH (p:Person {name: '이재용'})<-[:LED_BY]-(c:Company)
   RETURN c.name LIMIT 10

지금 질문: {question}
\`\`\`
`,
  keyPoints: ['Few-shot: 예시로 패턴 학습', '3-5개 예시로 정확도 60% → 85%', '다양한 쿼리 패턴 예시 포함'],
  practiceGoal: 'Few-shot Learning의 원리와 효과 이해',
})

const task2 = createCodeTask('w7d2-few-shot-impl', '실습: Few-shot 프롬프트 구현', 50, {
  introduction: `
## Few-shot 프롬프트 구현

### 예시 템플릿

\`\`\`python
FEW_SHOT_EXAMPLES = [
    {
        "question": "모든 회사 목록",
        "cypher": "MATCH (c:Company) RETURN c.name LIMIT 10"
    },
    {
        "question": "삼성전자의 경쟁사",
        "cypher": "MATCH (c:Company {name: '삼성전자'})-[:COMPETES_WITH]->(comp) RETURN comp.name LIMIT 10"
    },
    {
        "question": "반도체 산업의 회사들",
        "cypher": "MATCH (c:Company {industry: '반도체'}) RETURN c.name, c.founded LIMIT 10"
    },
    {
        "question": "가장 많은 경쟁사를 가진 회사",
        "cypher": '''MATCH (c:Company)-[:COMPETES_WITH]->(comp)
RETURN c.name, count(comp) as competitors
ORDER BY competitors DESC LIMIT 5'''
    },
    {
        "question": "2000년 이후 설립된 회사",
        "cypher": "MATCH (c:Company) WHERE c.founded > 2000 RETURN c.name, c.founded LIMIT 10"
    }
]
\`\`\`

### Few-shot Chain 구현

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate, FewShotChatMessagePromptTemplate
from langchain_openai import ChatOpenAI

# 예시 프롬프트
example_prompt = ChatPromptTemplate.from_messages([
    ("human", "{question}"),
    ("ai", "{cypher}")
])

# Few-shot 프롬프트
few_shot_prompt = FewShotChatMessagePromptTemplate(
    example_prompt=example_prompt,
    examples=FEW_SHOT_EXAMPLES
)

# 최종 프롬프트
final_prompt = ChatPromptTemplate.from_messages([
    ("system", """Neo4j Cypher 전문가입니다.

스키마:
{schema}

규칙:
1. MATCH로 시작하는 읽기 쿼리만
2. LIMIT 10 이하
3. 코드만 출력 (설명 없이)

다음 예시들을 참고하세요:"""),
    few_shot_prompt,
    ("human", "{question}")
])

# Chain
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
chain = final_prompt | llm

# 실행
result = chain.invoke({
    "schema": graph.schema,
    "question": "NVIDIA와 경쟁하는 회사들의 설립연도"
})
print(result.content)
\`\`\`

### 동적 예시 선택

질문 유형에 맞는 예시만 선택:

\`\`\`python
from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_openai import OpenAIEmbeddings

# 예시 선택기
example_selector = SemanticSimilarityExampleSelector.from_examples(
    FEW_SHOT_EXAMPLES,
    OpenAIEmbeddings(),
    k=3  # 가장 유사한 3개 선택
)

# 동적 Few-shot 프롬프트
dynamic_few_shot = FewShotChatMessagePromptTemplate(
    example_prompt=example_prompt,
    example_selector=example_selector,
    input_variables=["question"]
)
\`\`\`
`,
  keyPoints: ['FEW_SHOT_EXAMPLES로 예시 정의', 'FewShotChatMessagePromptTemplate 활용', 'SemanticSimilarityExampleSelector로 동적 선택'],
  practiceGoal: 'Few-shot 프롬프트 구현 및 동적 예시 선택',
  commonPitfalls: `
## 💥 Common Pitfalls (자주 하는 실수)

### 1. 예시 개수 과다로 컨텍스트 초과
**증상**: API 호출 시 "context length exceeded" 에러

\`\`\`python
# ❌ 잘못된 예시: 20개 이상 예시
examples = [...]  # 20개
few_shot = FewShotChatMessagePromptTemplate(examples=examples)  # 토큰 폭발

# ✅ 올바른 예시: 동적 선택으로 3-5개만
selector = SemanticSimilarityExampleSelector.from_examples(
    examples, OpenAIEmbeddings(), k=3  # 유사한 3개만 선택
)
\`\`\`

💡 **기억할 점**: 전체 예시를 다 넣지 말고, 질문과 유사한 3-5개만 동적 선택

### 2. 예시 다양성 부족
**증상**: 특정 유형 질문만 잘 작동하고, 다른 유형은 실패

\`\`\`python
# ❌ 잘못된 예시: 단순 조회만
examples = [
    {"question": "모든 회사", "cypher": "MATCH (c:Company) RETURN c"},
    {"question": "모든 인물", "cypher": "MATCH (p:Person) RETURN p"},
]

# ✅ 올바른 예시: 다양한 패턴 포함
examples = [
    {"question": "모든 회사", "cypher": "MATCH (c:Company) RETURN c.name LIMIT 10"},
    {"question": "삼성 경쟁사", "cypher": "MATCH (:Company {name:'삼성전자'})-[:COMPETES_WITH]->(x) RETURN x.name"},
    {"question": "경쟁사 개수 순위", "cypher": "MATCH (c)-[:COMPETES_WITH]->(x) RETURN c.name, count(x) ORDER BY count(x) DESC"},
]
\`\`\`

💡 **기억할 점**: 단순조회, 관계탐색, 집계, 필터링 등 다양한 패턴 예시 필요

### 3. 임베딩 모델 불일치
**증상**: SemanticSimilarityExampleSelector가 엉뚱한 예시 선택

\`\`\`python
# ❌ 잘못된 예시: 한글 예시 + 영어 임베딩
examples = [{"question": "삼성전자 경쟁사", "cypher": "..."}]
selector = SemanticSimilarityExampleSelector.from_examples(
    examples, OpenAIEmbeddings(model="text-embedding-ada-002"), k=3  # 영어 최적화 모델
)

# ✅ 올바른 예시: 다국어 지원 임베딩 또는 키워드 기반 선택
selector = SemanticSimilarityExampleSelector.from_examples(
    examples, OpenAIEmbeddings(model="text-embedding-3-small"), k=3  # 다국어 지원
)
# 또는 키워드 기반 선택 함수 구현
\`\`\`

💡 **기억할 점**: 한글 데이터에는 다국어 지원 임베딩 모델 사용
`,
  codeExample: `from langchain_core.prompts import ChatPromptTemplate, FewShotChatMessagePromptTemplate

examples = [
    {"question": "모든 회사", "cypher": "MATCH (c:Company) RETURN c.name LIMIT 10"},
    {"question": "삼성 경쟁사", "cypher": "MATCH (c:Company {name:'삼성전자'})-[:COMPETES_WITH]->(x) RETURN x.name"}
]

example_prompt = ChatPromptTemplate.from_messages([("human", "{question}"), ("ai", "{cypher}")])
few_shot = FewShotChatMessagePromptTemplate(example_prompt=example_prompt, examples=examples)

final = ChatPromptTemplate.from_messages([
    ("system", "Cypher 전문가입니다. 스키마: {schema}"),
    few_shot,
    ("human", "{question}")
])

print(final.format(schema="...", question="SK하이닉스의 경쟁사"))`,
})

const task3 = createCodeTask('w7d2-domain-examples', '실습: 도메인 특화 예시 설계', 45, {
  introduction: `
## 도메인 특화 예시 설계

### 쿼리 패턴별 예시

\`\`\`python
# 1. 단순 조회
SIMPLE_EXAMPLES = [
    {"q": "모든 회사", "c": "MATCH (c:Company) RETURN c.name LIMIT 10"},
    {"q": "모든 인물", "c": "MATCH (p:Person) RETURN p.name LIMIT 10"},
]

# 2. 필터링
FILTER_EXAMPLES = [
    {"q": "반도체 회사", "c": "MATCH (c:Company {industry: '반도체'}) RETURN c.name LIMIT 10"},
    {"q": "2000년 이후 설립", "c": "MATCH (c:Company) WHERE c.founded > 2000 RETURN c.name LIMIT 10"},
]

# 3. 관계 탐색
RELATIONSHIP_EXAMPLES = [
    {"q": "삼성 경쟁사", "c": "MATCH (c:Company {name:'삼성전자'})-[:COMPETES_WITH]->(x) RETURN x.name LIMIT 10"},
    {"q": "이재용이 이끄는 회사", "c": "MATCH (p:Person {name:'이재용'})<-[:LED_BY]-(c) RETURN c.name LIMIT 10"},
]

# 4. 집계
AGGREGATION_EXAMPLES = [
    {"q": "회사별 경쟁사 수", "c": "MATCH (c:Company)-[:COMPETES_WITH]->(x) RETURN c.name, count(x) as cnt ORDER BY cnt DESC LIMIT 10"},
    {"q": "산업별 회사 수", "c": "MATCH (c:Company) RETURN c.industry, count(c) as cnt ORDER BY cnt DESC LIMIT 10"},
]

# 5. 경로 탐색
PATH_EXAMPLES = [
    {"q": "삼성과 애플의 연결", "c": "MATCH path = shortestPath((a:Company {name:'삼성전자'})-[*]-(b:Company {name:'Apple'})) RETURN path LIMIT 1"},
]
\`\`\`

### 패턴 기반 예시 선택

\`\`\`python
import re

def select_examples_by_pattern(question: str) -> list:
    """질문 패턴에 맞는 예시 선택"""
    question_lower = question.lower()

    examples = []

    # 집계 패턴
    if any(kw in question_lower for kw in ['몇 개', '수', 'count', '가장 많은']):
        examples.extend(AGGREGATION_EXAMPLES)

    # 관계 패턴
    if any(kw in question_lower for kw in ['경쟁', '연결', '관계', '이끄는']):
        examples.extend(RELATIONSHIP_EXAMPLES)

    # 필터 패턴
    if any(kw in question_lower for kw in ['이후', '이전', '산업', '분야']):
        examples.extend(FILTER_EXAMPLES)

    # 경로 패턴
    if any(kw in question_lower for kw in ['연결', '경로', 'path', '사이']):
        examples.extend(PATH_EXAMPLES)

    # 기본 예시
    if not examples:
        examples = SIMPLE_EXAMPLES

    return examples[:5]  # 최대 5개
\`\`\`
`,
  keyPoints: ['쿼리 패턴별 예시 그룹화', '질문 키워드로 적절한 예시 선택', '집계, 관계, 필터, 경로 등 다양한 패턴'],
  practiceGoal: '도메인과 쿼리 패턴에 맞는 예시 설계',
  codeExample: `EXAMPLES = {
    "simple": [{"q": "모든 회사", "c": "MATCH (c:Company) RETURN c.name LIMIT 10"}],
    "relation": [{"q": "삼성 경쟁사", "c": "MATCH (:Company {name:'삼성전자'})-[:COMPETES_WITH]->(x) RETURN x.name"}],
    "aggregate": [{"q": "경쟁사 수", "c": "MATCH (c)-[:COMPETES_WITH]->(x) RETURN c.name, count(x) ORDER BY count(x) DESC"}]
}

def select_examples(question):
    if '경쟁' in question:
        return EXAMPLES["relation"]
    if '몇' in question or '수' in question:
        return EXAMPLES["aggregate"]
    return EXAMPLES["simple"]`,
})

const task4 = createReadingTask('w7d2-prompt-engineering', '고급 프롬프트 엔지니어링', 35, {
  introduction: `
## 고급 프롬프트 엔지니어링

### Chain of Thought (CoT)

단계별 사고 과정을 유도:

\`\`\`
질문: 삼성전자와 2단계 이내로 연결된 모든 회사는?

단계별 사고:
1. 시작 노드: Company {name: '삼성전자'}
2. 2단계 연결: 1-hop과 2-hop 관계
3. 패턴: (start)-[*1..2]-(connected)
4. 중복 제거: DISTINCT

Cypher:
MATCH (c:Company {name: '삼성전자'})-[*1..2]-(connected:Company)
WHERE c <> connected
RETURN DISTINCT connected.name LIMIT 20
\`\`\`

### Self-Consistency

여러 번 생성 후 다수결:

\`\`\`python
def generate_with_consistency(question: str, n: int = 3) -> str:
    """여러 쿼리 생성 후 가장 빈번한 것 선택"""
    queries = []
    for _ in range(n):
        query = generate_cypher(question)
        queries.append(query.strip())

    # 가장 빈번한 쿼리
    from collections import Counter
    most_common = Counter(queries).most_common(1)[0][0]
    return most_common
\`\`\`

### 출력 형식 제어

JSON 형식으로 구조화:

\`\`\`python
STRUCTURED_PROMPT = """
다음 형식으로 응답하세요:

{
  "thinking": "쿼리 생성 사고 과정",
  "cypher": "생성된 Cypher 쿼리",
  "explanation": "쿼리 설명"
}

질문: {question}
"""
\`\`\`

### 네거티브 예시

하지 말아야 할 것도 명시:

\`\`\`
❌ 잘못된 예시:
Q: 모든 회사
A: MATCH (n) RETURN n  # 레이블 없음, LIMIT 없음

✅ 올바른 예시:
Q: 모든 회사
A: MATCH (c:Company) RETURN c.name LIMIT 10
\`\`\`
`,
  keyPoints: ['Chain of Thought: 단계별 사고 유도', 'Self-Consistency: 다수결로 정확도 향상', '구조화된 출력 (JSON)', '네거티브 예시로 실수 방지'],
  practiceGoal: '고급 프롬프트 엔지니어링 기법 습득',
})

const task5 = createCodeTask('w7d2-integrated', '실습: 통합 Few-shot 시스템', 40, {
  introduction: `
## 통합 Few-shot Text2Cypher

\`\`\`python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate, FewShotChatMessagePromptTemplate
from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_community.graphs import Neo4jGraph

class AdvancedText2Cypher:
    def __init__(self, neo4j_url, neo4j_user, neo4j_password):
        self.graph = Neo4jGraph(url=neo4j_url, username=neo4j_user, password=neo4j_password)
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.embeddings = OpenAIEmbeddings()

        # 예시 정의
        self.examples = [
            {"question": "모든 회사", "cypher": "MATCH (c:Company) RETURN c.name LIMIT 10"},
            {"question": "삼성 경쟁사", "cypher": "MATCH (:Company {name:'삼성전자'})-[:COMPETES_WITH]->(x) RETURN x.name LIMIT 10"},
            {"question": "2000년 이후 설립", "cypher": "MATCH (c:Company) WHERE c.founded > 2000 RETURN c.name LIMIT 10"},
            {"question": "경쟁사 수 순위", "cypher": "MATCH (c:Company)-[:COMPETES_WITH]->(x) RETURN c.name, count(x) as cnt ORDER BY cnt DESC LIMIT 10"},
            {"question": "최단 경로", "cypher": "MATCH path = shortestPath((a)-[*]-(b)) WHERE a.name = $start AND b.name = $end RETURN path LIMIT 1"},
        ]

        # 동적 예시 선택기
        self.selector = SemanticSimilarityExampleSelector.from_examples(
            self.examples, self.embeddings, k=3
        )

    def build_prompt(self, question: str) -> str:
        # 유사한 예시 선택
        selected = self.selector.select_examples({"question": question})

        # 프롬프트 구성
        examples_text = "\\n".join([
            f"Q: {ex['question']}\\nA: {ex['cypher']}"
            for ex in selected
        ])

        return f'''Neo4j Cypher 전문가입니다.

스키마:
{self.graph.schema}

예시:
{examples_text}

규칙:
- MATCH로 시작하는 읽기 쿼리만
- LIMIT 10 이하
- Cypher 코드만 출력

Q: {question}
A:'''

    def generate(self, question: str) -> str:
        prompt = self.build_prompt(question)
        return self.llm.invoke(prompt).content.strip()

    def query(self, question: str) -> dict:
        cypher = self.generate(question)

        # 검증
        if any(kw in cypher.upper() for kw in ['DELETE', 'CREATE', 'DROP']):
            return {"error": "위험한 쿼리"}

        try:
            results = self.graph.query(cypher)
            return {"cypher": cypher, "results": results}
        except Exception as e:
            return {"error": str(e), "cypher": cypher}
\`\`\`
`,
  keyPoints: ['SemanticSimilarityExampleSelector로 동적 예시 선택', '스키마 + 예시 + 규칙 통합 프롬프트', '검증 및 에러 처리 포함'],
  practiceGoal: '통합 Few-shot Text2Cypher 시스템 구현',
  codeExample: `t2c = AdvancedText2Cypher("bolt://localhost:7687", "neo4j", "password")
result = t2c.query("NVIDIA와 경쟁하는 회사들")
print(result)`,
})

const task6 = createQuizTask('w7d2-quiz', 'Day 2 복습 퀴즈', 15, {
  questions: [
    { id: 'q1', question: 'Few-shot Learning에서 적절한 예시 개수는?', options: ['1개', '3-5개', '10-20개', '100개 이상'], correctAnswer: 1, explanation: '3-5개 예시가 비용 대비 효과가 가장 좋습니다.' },
    { id: 'q2', question: 'SemanticSimilarityExampleSelector의 역할은?', options: ['쿼리 실행', '질문과 유사한 예시 자동 선택', '에러 처리', '캐싱'], correctAnswer: 1, explanation: '임베딩 유사도로 가장 관련 있는 예시를 선택합니다.' },
    { id: 'q3', question: 'Chain of Thought 기법의 목적은?', options: ['속도 향상', '단계별 사고로 복잡한 쿼리 생성', '메모리 절약', '보안 강화'], correctAnswer: 1, explanation: 'CoT는 복잡한 문제를 단계별로 분해하여 해결합니다.' },
  ],
  keyPoints: ['Few-shot 예시 수', '동적 예시 선택', 'CoT 기법'],
  practiceGoal: 'Day 2 학습 내용 복습',
})

export const day2FewShotLearning: Day = {
  slug: 'few-shot-learning',
  title: 'Few-shot Learning & 프롬프트 엔지니어링',
  totalDuration: 210,
  tasks: [task1, task2, task3, task4, task5, task6],
}
