// Week 7 Day 4: 고급 Text2Cypher 기법

import type { Day } from './types'
import { createVideoTask, createReadingTask, createCodeTask, createQuizTask } from './types'

const task1 = createVideoTask('w7d4-multi-turn', '멀티턴 대화형 Text2Cypher', 25, {
  introduction: `
## 멀티턴 대화형 Text2Cypher

### 대화 맥락 유지

\`\`\`
User: 삼성전자에 대해 알려줘
Bot: 삼성전자는 반도체, 스마트폰...

User: 그 회사의 경쟁사는?  ← "그 회사" = 삼성전자
Bot: 삼성전자의 경쟁사는 SK하이닉스...

User: 그 중 가장 큰 회사는?  ← "그 중" = 경쟁사들
Bot: 경쟁사 중 시가총액 기준...
\`\`\`

### 대명사 해결 (Coreference Resolution)

\`\`\`python
def resolve_pronouns(question: str, history: list) -> str:
    """대명사를 실제 엔티티로 교체"""
    pronouns = ['그', '그것', '이것', '그 회사', '그들', '그 중']

    for pronoun in pronouns:
        if pronoun in question:
            # 최근 대화에서 엔티티 추출
            recent_entity = extract_last_entity(history)
            if recent_entity:
                question = question.replace(pronoun, recent_entity)

    return question

# 예시
history = [
    {"role": "user", "content": "삼성전자에 대해 알려줘"},
    {"role": "assistant", "content": "삼성전자는..."}
]
resolved = resolve_pronouns("그 회사의 경쟁사는?", history)
# "삼성전자의 경쟁사는?"
\`\`\`
`,
  keyPoints: ['대화 맥락으로 대명사 해결', '최근 엔티티 추적', '연속 질문 지원'],
  practiceGoal: '멀티턴 대화 지원 이해',
})

const task2 = createCodeTask('w7d4-conversational', '실습: 대화형 Text2Cypher 구현', 50, {
  introduction: `
## 대화형 Text2Cypher 구현

\`\`\`python
class ConversationalText2Cypher:
    def __init__(self, graph, llm):
        self.graph = graph
        self.llm = llm
        self.history = []
        self.context_entities = []

    def reformulate_question(self, question: str) -> str:
        """대화 맥락을 반영하여 질문 재구성"""
        if not self.history:
            return question

        context = "\\n".join([
            f"{h['role']}: {h['content'][:100]}"
            for h in self.history[-4:]
        ])

        prompt = f'''대화 맥락:
{context}

현재 질문: {question}

맥락을 반영하여 독립적인 질문으로 재구성하세요.
대명사(그, 그것, 그 회사 등)를 실제 엔티티로 교체하세요.

재구성된 질문:'''

        return self.llm.invoke(prompt).content.strip()

    def extract_entities_from_results(self, results: list):
        """결과에서 엔티티 추출"""
        entities = []
        for row in results:
            for value in row.values():
                if isinstance(value, str) and len(value) > 1:
                    entities.append(value)
        self.context_entities = entities[:5]

    def query(self, question: str) -> dict:
        # 1. 질문 재구성
        standalone_q = self.reformulate_question(question)

        # 2. Cypher 생성
        cypher = self.generate_cypher(standalone_q)

        # 3. 실행
        try:
            results = self.graph.query(cypher)
            self.extract_entities_from_results(results)

            # 4. 대화 기록 업데이트
            self.history.append({"role": "user", "content": question})
            self.history.append({"role": "assistant", "content": str(results)[:200]})

            return {
                "original_question": question,
                "reformulated": standalone_q,
                "cypher": cypher,
                "results": results
            }
        except Exception as e:
            return {"error": str(e)}

    def clear_history(self):
        self.history = []
        self.context_entities = []
\`\`\`
`,
  keyPoints: ['질문 재구성으로 독립적 쿼리 생성', '결과에서 엔티티 추출하여 맥락 유지', '최근 N턴만 사용하여 컨텍스트 제한'],
  practiceGoal: '대화형 Text2Cypher 구현',
  commonPitfalls: `
## 💥 Common Pitfalls (자주 하는 실수)

### 1. 대화 히스토리 무제한 증가 → 메모리/토큰 폭발
**증상**: 오래 사용할수록 느려지다가 "context length exceeded" 에러

\`\`\`python
# ❌ 잘못된 예시: 히스토리 무제한
def query(self, question: str):
    self.history.append({"role": "user", "content": question})
    # history가 계속 증가...

# ✅ 올바른 예시: 최근 N턴만 유지
MAX_HISTORY = 10

def query(self, question: str):
    self.history.append({"role": "user", "content": question})
    if len(self.history) > MAX_HISTORY:
        self.history = self.history[-MAX_HISTORY:]  # 오래된 것 제거

    # 컨텍스트 구성 시에도 제한
    context = "\\n".join([h['content'][:100] for h in self.history[-4:]])
\`\`\`

💡 **기억할 점**: 최근 4-5턴만 사용, 오래된 대화는 삭제 또는 요약

### 2. 대명사 해결 실패 → 엉뚱한 엔티티 참조
**증상**: "그 회사의 경쟁사"가 의도와 다른 회사 참조

\`\`\`python
# ❌ 잘못된 예시: 단순 대명사 치환
def resolve(question):
    return question.replace("그 회사", self.last_entity)  # 항상 마지막 엔티티?

# ✅ 올바른 예시: LLM으로 맥락 기반 해결
def reformulate_question(self, question: str) -> str:
    if not self.history:
        return question

    context = "\\n".join([f"{h['role']}: {h['content'][:100]}" for h in self.history[-4:]])

    prompt = f'''대화 맥락:
{context}

현재 질문: {question}

대화 맥락을 고려하여 대명사(그, 그것, 그 회사)를 실제 이름으로 교체하고,
독립적으로 이해할 수 있는 질문으로 재구성하세요.

재구성된 질문:'''
    return self.llm.invoke(prompt).content.strip()
\`\`\`

💡 **기억할 점**: 대명사 해결은 LLM에게 맥락과 함께 위임

### 3. 엔티티 추출 실패 → 맥락 손실
**증상**: 결과에서 엔티티를 못 찾아 다음 턴에서 대명사 해결 실패

\`\`\`python
# ❌ 잘못된 예시: 첫 번째 값만 추출
def extract_entities(self, results):
    self.last_entity = results[0].get('name', '')  # 다른 키일 수 있음

# ✅ 올바른 예시: 여러 키에서 엔티티 추출
def extract_entities_from_results(self, results: list):
    entities = []
    name_keys = ['name', 'title', 'company_name', 'person_name']
    for row in results:
        for key in name_keys:
            if key in row and isinstance(row[key], str):
                entities.append(row[key])
        # 또는 모든 문자열 값 추출
        for value in row.values():
            if isinstance(value, str) and len(value) > 1:
                entities.append(value)
    self.context_entities = list(set(entities))[:5]  # 중복 제거, 최대 5개
\`\`\`

💡 **기억할 점**: 여러 키에서 엔티티 추출, 중복 제거, 개수 제한
`,
  codeExample: `t2c = ConversationalText2Cypher(graph, llm)
t2c.query("삼성전자에 대해 알려줘")
result = t2c.query("그 회사의 경쟁사는?")
print(result['reformulated'])  # "삼성전자의 경쟁사는?"`,
})

const task3 = createCodeTask('w7d4-complex-queries', '실습: 복잡한 쿼리 패턴', 45, {
  introduction: `
## 복잡한 쿼리 패턴

### 집계 쿼리

\`\`\`python
AGGREGATION_EXAMPLES = [
    {
        "question": "회사별 경쟁사 수",
        "cypher": '''
MATCH (c:Company)-[:COMPETES_WITH]->(comp)
RETURN c.name, count(comp) as competitors
ORDER BY competitors DESC LIMIT 10
'''
    },
    {
        "question": "산업별 평균 설립연도",
        "cypher": '''
MATCH (c:Company)
WHERE c.founded IS NOT NULL
RETURN c.industry, avg(c.founded) as avg_founded
ORDER BY avg_founded DESC LIMIT 10
'''
    }
]
\`\`\`

### 경로 탐색 쿼리

\`\`\`python
PATH_EXAMPLES = [
    {
        "question": "삼성과 Apple의 최단 연결",
        "cypher": '''
MATCH path = shortestPath(
    (a:Company {name: '삼성전자'})-[*]-(b:Company {name: 'Apple'})
)
RETURN path LIMIT 1
'''
    },
    {
        "question": "삼성에서 2단계 이내 연결된 회사",
        "cypher": '''
MATCH (c:Company {name: '삼성전자'})-[*1..2]-(connected:Company)
WHERE c <> connected
RETURN DISTINCT connected.name LIMIT 20
'''
    }
]
\`\`\`

### 조건부 쿼리

\`\`\`python
CONDITIONAL_EXAMPLES = [
    {
        "question": "2000년 이후 설립된 반도체 회사",
        "cypher": '''
MATCH (c:Company)
WHERE c.industry = '반도체' AND c.founded > 2000
RETURN c.name, c.founded LIMIT 10
'''
    },
    {
        "question": "경쟁사가 3개 이상인 회사",
        "cypher": '''
MATCH (c:Company)-[:COMPETES_WITH]->(comp)
WITH c, count(comp) as cnt
WHERE cnt >= 3
RETURN c.name, cnt LIMIT 10
'''
    }
]
\`\`\`

### 패턴 인식 및 예시 선택

\`\`\`python
def select_examples_for_complex_query(question: str) -> list:
    patterns = {
        "aggregation": ["몇 개", "평균", "합계", "수", "count", "sum", "avg"],
        "path": ["연결", "경로", "사이", "단계", "path"],
        "conditional": ["이상", "이하", "보다", "경우", "조건"],
    }

    for pattern_type, keywords in patterns.items():
        if any(kw in question.lower() for kw in keywords):
            return globals()[f"{pattern_type.upper()}_EXAMPLES"]

    return SIMPLE_EXAMPLES
\`\`\`
`,
  keyPoints: ['집계: count, avg, sum과 ORDER BY', '경로: shortestPath, 가변 길이 관계', '조건: WHERE + WITH 조합'],
  practiceGoal: '복잡한 쿼리 패턴 구현',
  codeExample: `# 복잡한 쿼리 예시
complex_questions = [
    "가장 많은 경쟁사를 가진 회사 TOP 5",
    "삼성전자와 NVIDIA 사이의 연결 경로",
    "2010년 이후 설립되고 경쟁사가 2개 이상인 회사"
]`,
})

const task4 = createCodeTask('w7d4-parameterized', '실습: 파라미터화된 쿼리', 40, {
  introduction: `
## 파라미터화된 쿼리

### 보안 및 성능

\`\`\`python
# 나쁜 예: SQL Injection 취약
bad_query = f"MATCH (c:Company {{name: '{user_input}'}}) RETURN c"

# 좋은 예: 파라미터화
good_query = "MATCH (c:Company {name: $name}) RETURN c"
results = graph.query(good_query, {"name": user_input})
\`\`\`

### 파라미터 추출

\`\`\`python
def generate_parameterized_query(question: str, llm) -> dict:
    """파라미터화된 쿼리 생성"""
    prompt = f'''질문을 파라미터화된 Cypher로 변환하세요.

질문: {question}

JSON 형식으로 응답:
{{
    "cypher": "파라미터화된 Cypher ($param 형식 사용)",
    "params": {{"param": "값"}}
}}
'''
    result = llm.invoke(prompt)
    return json.loads(result.content)

# 예시
result = generate_parameterized_query("삼성전자의 경쟁사", llm)
# {
#     "cypher": "MATCH (c:Company {name: $company})-[:COMPETES_WITH]->(x) RETURN x.name",
#     "params": {"company": "삼성전자"}
# }
\`\`\`

### 파라미터 검증

\`\`\`python
def validate_params(params: dict, schema: str) -> tuple[bool, str]:
    """파라미터 값 검증"""
    for key, value in params.items():
        # 문자열 길이 제한
        if isinstance(value, str) and len(value) > 100:
            return False, f"파라미터 '{key}' 길이 초과"

        # 특수문자 검사
        if isinstance(value, str) and any(c in value for c in ['$', '{', '}', ';']):
            return False, f"파라미터 '{key}'에 금지된 문자"

    return True, "OK"
\`\`\`
`,
  keyPoints: ['$param 형식으로 SQL Injection 방지', '파라미터와 쿼리 분리 생성', '파라미터 값 검증'],
  practiceGoal: '파라미터화된 안전한 쿼리 생성',
  codeExample: `# 파라미터화된 쿼리 실행
cypher = "MATCH (c:Company {name: $name})-[:COMPETES_WITH]->(x) RETURN x.name LIMIT $limit"
params = {"name": "삼성전자", "limit": 10}
results = graph.query(cypher, params)`,
})

const task5 = createReadingTask('w7d4-optimization', '성능 최적화 및 캐싱', 30, {
  introduction: `
## 성능 최적화

### 쿼리 캐싱

\`\`\`python
from functools import lru_cache
import hashlib

class CachedText2Cypher:
    def __init__(self, graph, llm):
        self.graph = graph
        self.llm = llm
        self.cache = {}

    def _cache_key(self, question: str) -> str:
        """질문의 해시 키 생성"""
        return hashlib.md5(question.lower().strip().encode()).hexdigest()

    def query(self, question: str) -> dict:
        key = self._cache_key(question)

        if key in self.cache:
            return self.cache[key]

        result = self._execute_query(question)
        self.cache[key] = result
        return result
\`\`\`

### 인덱스 최적화

\`\`\`cypher
// 자주 검색하는 속성에 인덱스
CREATE INDEX company_name FOR (c:Company) ON (c.name);
CREATE INDEX person_name FOR (p:Person) ON (p.name);
\`\`\`

### 배치 처리

\`\`\`python
async def batch_query(questions: list) -> list:
    """여러 질문 병렬 처리"""
    import asyncio

    async def process_one(q):
        return await asyncio.to_thread(t2c.query, q)

    tasks = [process_one(q) for q in questions]
    return await asyncio.gather(*tasks)
\`\`\`

### 응답 시간 목표

| 단계 | 목표 시간 |
|------|----------|
| Cypher 생성 (LLM) | < 1초 |
| 검증 | < 100ms |
| Neo4j 실행 | < 500ms |
| **전체** | **< 2초** |
`,
  keyPoints: ['해시 기반 쿼리 캐싱', 'Neo4j 인덱스로 검색 최적화', '병렬 처리로 배치 성능 향상'],
  practiceGoal: '성능 최적화 기법 이해',
})

const task6 = createQuizTask('w7d4-quiz', 'Day 4 복습 퀴즈', 15, {
  questions: [
    { id: 'q1', question: '멀티턴 대화에서 "그 회사"를 해결하는 기법은?', options: ['캐싱', '대명사 해결 (Coreference Resolution)', '인덱싱', 'Fallback'], correctAnswer: 1 },
    { id: 'q2', question: '파라미터화된 쿼리의 주요 장점은?', options: ['속도 향상', 'SQL Injection 방지', '메모리 절약', '다국어 지원'], correctAnswer: 1 },
    { id: 'q3', question: 'WITH 절의 주요 용도는?', options: ['쿼리 종료', '중간 결과 필터링/집계', '데이터 삽입', '권한 설정'], correctAnswer: 1 },
  ],
  keyPoints: ['대명사 해결', '파라미터화', 'WITH 절 활용'],
  practiceGoal: 'Day 4 학습 내용 복습',
})

export const day4AdvancedT2c: Day = {
  slug: 'advanced-text2cypher',
  title: '고급 Text2Cypher 기법',
  totalDuration: 205,
  tasks: [task1, task2, task3, task4, task5, task6],
}
