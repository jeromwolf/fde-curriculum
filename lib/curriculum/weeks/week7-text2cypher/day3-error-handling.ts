// Week 7 Day 3: 에러 처리 및 자동 수정

import type { Day } from './types'
import { createVideoTask, createReadingTask, createCodeTask, createQuizTask } from './types'

const task1 = createVideoTask('w7d3-error-intro', 'Text2Cypher 에러 유형과 처리', 25, {
  introduction: `
## Text2Cypher 에러 유형

### 주요 에러 유형

| 유형 | 원인 | 예시 |
|------|------|------|
| **문법 오류** | 잘못된 Cypher 문법 | \`MACH\` 대신 \`MATCH\` |
| **스키마 오류** | 존재하지 않는 레이블/관계 | \`:Compny\` 대신 \`:Company\` |
| **속성 오류** | 없는 속성 참조 | \`c.nmae\` 대신 \`c.name\` |
| **로직 오류** | 결과 없음, 무한 루프 | WHERE 조건 오류 |

### 에러 메시지 예시

\`\`\`
# Neo4j 문법 오류
SyntaxError: Invalid input 'MACH'

# 레이블 오류 (경고만)
Warning: Label 'Compny' not found

# 속성 오류
PropertyKeyNotFoundException: 'nmae' property not found
\`\`\`

### 에러 처리 전략

1. **검증 (Validation)**: 실행 전 문법/스키마 검사
2. **재시도 (Retry)**: 에러 피드백으로 재생성
3. **Fallback**: 기본 쿼리 또는 사과 메시지
`,
  keyPoints: ['문법, 스키마, 속성, 로직 4가지 에러 유형', '실행 전 검증으로 사전 방지', '에러 피드백으로 자동 수정'],
  practiceGoal: '에러 유형과 처리 전략 이해',
})

const task2 = createCodeTask('w7d3-retry', '실습: 에러 기반 자동 재시도', 50, {
  introduction: `
## 에러 기반 자동 재시도

### 기본 재시도 로직

\`\`\`python
class Text2CypherWithRetry:
    def __init__(self, graph, llm, max_retries=3):
        self.graph = graph
        self.llm = llm
        self.max_retries = max_retries

    def generate_cypher(self, question: str, error_context: str = "") -> str:
        prompt = f'''Neo4j Cypher 전문가입니다.

스키마:
{self.graph.schema}

{error_context}

규칙:
- MATCH로 시작
- LIMIT 10 이하
- Cypher만 출력

질문: {question}
Cypher:'''
        return self.llm.invoke(prompt).content.strip()

    def query(self, question: str) -> dict:
        error_context = ""

        for attempt in range(self.max_retries):
            cypher = self.generate_cypher(question, error_context)

            try:
                results = self.graph.query(cypher)
                return {
                    "cypher": cypher,
                    "results": results,
                    "attempts": attempt + 1
                }
            except Exception as e:
                error_msg = str(e)
                error_context = f'''
=== 이전 시도 실패 ===
생성된 쿼리: {cypher}
에러: {error_msg}

위 에러를 수정한 새로운 쿼리를 생성하세요.
'''
                print(f"Attempt {attempt + 1} failed: {error_msg}")

        return {
            "error": "최대 재시도 횟수 초과",
            "last_cypher": cypher,
            "attempts": self.max_retries
        }
\`\`\`

### 에러 유형별 피드백

\`\`\`python
def create_error_feedback(error_msg: str, cypher: str) -> str:
    """에러 유형에 따른 맞춤 피드백 생성"""

    if "SyntaxError" in error_msg:
        return f'''
문법 오류가 발생했습니다.
- 잘못된 쿼리: {cypher}
- 에러: {error_msg}
- 힌트: MATCH, WHERE, RETURN 등 키워드 철자 확인
'''

    if "not found" in error_msg.lower() and "label" in error_msg.lower():
        return f'''
존재하지 않는 레이블을 사용했습니다.
- 잘못된 쿼리: {cypher}
- 스키마의 레이블만 사용하세요.
'''

    if "property" in error_msg.lower():
        return f'''
존재하지 않는 속성을 사용했습니다.
- 잘못된 쿼리: {cypher}
- 스키마의 속성만 사용하세요.
'''

    return f'''
쿼리 실행 중 오류가 발생했습니다.
- 쿼리: {cypher}
- 에러: {error_msg}
- 수정된 쿼리를 생성하세요.
'''
\`\`\`
`,
  keyPoints: ['에러 메시지를 프롬프트에 포함', '유형별 맞춤 피드백으로 수정 유도', '최대 재시도 횟수 제한'],
  practiceGoal: '에러 기반 자동 재시도 시스템 구현',
  commonPitfalls: `
## 💥 Common Pitfalls (자주 하는 실수)

### 1. 무한 재시도 루프
**증상**: 동일한 에러가 반복되며 API 비용 폭발

\`\`\`python
# ❌ 잘못된 예시: 재시도 횟수 제한 없음
def query(self, question: str):
    while True:  # 무한 루프!
        cypher = self.generate_cypher(question)
        try:
            return self.graph.query(cypher)
        except:
            continue

# ✅ 올바른 예시: 최대 재시도 횟수 + 동일 에러 감지
def query(self, question: str, max_retries: int = 3):
    last_error = None
    for attempt in range(max_retries):
        cypher = self.generate_cypher(question, error_context)
        try:
            return {"success": True, "results": self.graph.query(cypher)}
        except Exception as e:
            if str(e) == last_error:  # 동일 에러 반복 → 즉시 중단
                break
            last_error = str(e)
    return {"success": False, "error": "최대 재시도 초과"}
\`\`\`

💡 **기억할 점**: max_retries 필수, 동일 에러 반복 시 조기 종료

### 2. 에러 컨텍스트 누적으로 토큰 초과
**증상**: 재시도할수록 프롬프트가 길어져 "context length exceeded" 에러

\`\`\`python
# ❌ 잘못된 예시: 모든 에러 누적
error_history = []
for attempt in range(max_retries):
    try:
        ...
    except Exception as e:
        error_history.append(str(e))  # 계속 누적
        error_context = "\\n".join(error_history)  # 점점 길어짐

# ✅ 올바른 예시: 마지막 에러만 포함
def query(self, question: str):
    error_context = ""  # 마지막 에러만
    for attempt in range(max_retries):
        cypher = self.generate_cypher(question + error_context)
        try:
            return self.graph.query(cypher)
        except Exception as e:
            error_context = f"\\n[에러] {str(e)[:200]}"  # 길이 제한
\`\`\`

💡 **기억할 점**: 최근 1-2개 에러만 포함, 에러 메시지 길이 제한

### 3. 에러 유형 구분 없이 일괄 처리
**증상**: 수정 불가능한 에러에도 계속 재시도

\`\`\`python
# ❌ 잘못된 예시: 모든 에러 동일 처리
except Exception as e:
    error_context = f"에러: {e}"  # 수정 불가 에러도 재시도

# ✅ 올바른 예시: 에러 유형별 처리
except Exception as e:
    error_msg = str(e)
    if "connection refused" in error_msg.lower():
        return {"error": "DB 연결 실패", "retryable": False}
    if "timeout" in error_msg.lower():
        return {"error": "시간 초과", "retryable": True}
    # 문법/스키마 에러만 재시도
    error_context = create_error_feedback(error_msg, cypher)
\`\`\`

💡 **기억할 점**: 연결 에러, 인증 에러 등은 재시도해도 무의미
`,
  codeExample: `t2c = Text2CypherWithRetry(graph, llm, max_retries=3)
result = t2c.query("삼성전자의 모든 경쟁사")
print(f"성공 (시도: {result.get('attempts')})")
print(result['cypher'])`,
})

const task3 = createCodeTask('w7d3-validation', '실습: 실행 전 검증 강화', 45, {
  introduction: `
## 실행 전 검증 강화

### 종합 검증 클래스

\`\`\`python
import re

class CypherValidator:
    def __init__(self, schema: str):
        self.schema = schema
        self._parse_schema()

    def _parse_schema(self):
        """스키마에서 레이블, 관계, 속성 추출"""
        # 레이블 추출
        self.labels = set(re.findall(r'- (\\w+):', self.schema))
        # 관계 추출
        self.relationships = set(re.findall(r'\\[:([A-Z_]+)\\]', self.schema))
        # 속성 추출
        self.properties = set(re.findall(r'(\\w+)(?:,|\\))', self.schema))

    def validate(self, cypher: str) -> tuple[bool, list]:
        """종합 검증, (성공여부, 오류목록) 반환"""
        errors = []

        # 1. 보안 검증
        security_errors = self._check_security(cypher)
        errors.extend(security_errors)

        # 2. 문법 검증
        syntax_errors = self._check_syntax(cypher)
        errors.extend(syntax_errors)

        # 3. 스키마 검증
        schema_errors = self._check_schema(cypher)
        errors.extend(schema_errors)

        return len(errors) == 0, errors

    def _check_security(self, cypher: str) -> list:
        errors = []
        forbidden = ['DELETE', 'DETACH', 'DROP', 'CREATE', 'SET', 'REMOVE', 'MERGE']
        cypher_upper = cypher.upper()

        for kw in forbidden:
            if kw in cypher_upper:
                errors.append(f"보안: '{kw}' 사용 금지")

        if 'LIMIT' not in cypher_upper:
            errors.append("보안: LIMIT 절 필수")

        return errors

    def _check_syntax(self, cypher: str) -> list:
        errors = []

        if not cypher.strip().upper().startswith('MATCH'):
            errors.append("문법: MATCH로 시작해야 함")

        if 'RETURN' not in cypher.upper():
            errors.append("문법: RETURN 절 필수")

        # 괄호 짝 확인
        if cypher.count('(') != cypher.count(')'):
            errors.append("문법: 괄호 짝이 맞지 않음")

        return errors

    def _check_schema(self, cypher: str) -> list:
        errors = []

        # 레이블 확인
        used_labels = set(re.findall(r':(\\w+)', cypher))
        for label in used_labels:
            if label not in self.labels and label not in ['n', 'r', 'x', 'node']:
                errors.append(f"스키마: 알 수 없는 레이블 '{label}'")

        # 관계 확인
        used_rels = set(re.findall(r'\\[:([A-Z_]+)', cypher))
        for rel in used_rels:
            if rel not in self.relationships:
                errors.append(f"스키마: 알 수 없는 관계 '{rel}'")

        return errors
\`\`\`

### 검증 활용

\`\`\`python
validator = CypherValidator(graph.schema)

cypher = "MATCH (c:Compny) RETURN c.name"
is_valid, errors = validator.validate(cypher)

if not is_valid:
    print("검증 실패:")
    for error in errors:
        print(f"  - {error}")
else:
    print("검증 통과")
\`\`\`
`,
  keyPoints: ['보안, 문법, 스키마 3단계 검증', '정규식으로 레이블/관계 추출', '검증 실패 시 상세 오류 목록 반환'],
  practiceGoal: '종합 쿼리 검증 시스템 구현',
  codeExample: `validator = CypherValidator(schema)
cypher = "MATCH (c:Company)-[:COMPETES_WITH]->(x) RETURN x.name LIMIT 10"
is_valid, errors = validator.validate(cypher)
print(f"Valid: {is_valid}, Errors: {errors}")`,
})

const task4 = createCodeTask('w7d3-fallback', '실습: Fallback 및 사용자 피드백', 40, {
  introduction: `
## Fallback 전략

### Fallback 패턴

\`\`\`python
class Text2CypherWithFallback:
    def __init__(self, graph, llm):
        self.graph = graph
        self.llm = llm
        self.fallback_queries = {
            "회사": "MATCH (c:Company) RETURN c.name LIMIT 10",
            "인물": "MATCH (p:Person) RETURN p.name LIMIT 10",
            "관계": "MATCH (a)-[r]->(b) RETURN a.name, type(r), b.name LIMIT 10",
        }

    def get_fallback(self, question: str) -> str:
        """질문에서 키워드로 fallback 쿼리 선택"""
        for keyword, query in self.fallback_queries.items():
            if keyword in question:
                return query
        return "MATCH (n) RETURN labels(n)[0], count(n) LIMIT 10"

    def query(self, question: str) -> dict:
        try:
            cypher = self.generate_cypher(question)
            results = self.graph.query(cypher)

            if not results:  # 결과 없음
                return {
                    "message": "검색 결과가 없습니다.",
                    "suggestion": "다른 검색어를 시도해보세요.",
                    "cypher": cypher
                }

            return {"cypher": cypher, "results": results}

        except Exception as e:
            # Fallback 실행
            fallback_cypher = self.get_fallback(question)
            try:
                results = self.graph.query(fallback_cypher)
                return {
                    "message": "정확한 답변을 찾지 못해 관련 정보를 보여드립니다.",
                    "cypher": fallback_cypher,
                    "results": results,
                    "original_error": str(e)
                }
            except:
                return {
                    "message": "죄송합니다. 질문을 이해하지 못했습니다.",
                    "suggestion": "더 구체적으로 질문해주세요."
                }
\`\`\`

### 사용자 피드백 수집

\`\`\`python
class FeedbackCollector:
    def __init__(self):
        self.feedback_log = []

    def log_query(self, question: str, cypher: str, success: bool, feedback: str = None):
        self.feedback_log.append({
            "question": question,
            "cypher": cypher,
            "success": success,
            "feedback": feedback,
            "timestamp": datetime.now().isoformat()
        })

    def get_failed_queries(self) -> list:
        """실패한 쿼리 목록 (개선용)"""
        return [f for f in self.feedback_log if not f['success']]

    def export_for_finetuning(self) -> list:
        """성공한 쿼리를 Fine-tuning 데이터로 export"""
        return [
            {"question": f['question'], "cypher": f['cypher']}
            for f in self.feedback_log
            if f['success'] and f.get('feedback') == 'good'
        ]
\`\`\`
`,
  keyPoints: ['키워드 기반 Fallback 쿼리', '결과 없음 시 친절한 메시지', '사용자 피드백으로 지속 개선'],
  practiceGoal: 'Fallback 및 피드백 시스템 구현',
  codeExample: `t2c = Text2CypherWithFallback(graph, llm)
result = t2c.query("존재하지 않는 것에 대해 알려줘")
print(result['message'])  # Fallback 메시지`,
})

const task5 = createReadingTask('w7d3-monitoring', '운영 모니터링 및 개선', 30, {
  introduction: `
## 운영 모니터링

### 핵심 메트릭

| 메트릭 | 설명 | 목표 |
|--------|------|------|
| **성공률** | 에러 없이 결과 반환 비율 | > 90% |
| **정확도** | 사용자 기대와 일치 비율 | > 80% |
| **응답시간** | 쿼리 생성 + 실행 시간 | < 3초 |
| **재시도율** | 재시도가 필요한 비율 | < 20% |

### 로깅 구현

\`\`\`python
import logging
from datetime import datetime

logger = logging.getLogger("text2cypher")

def log_query_execution(question, cypher, success, latency, error=None):
    logger.info({
        "timestamp": datetime.now().isoformat(),
        "question": question,
        "cypher": cypher,
        "success": success,
        "latency_ms": latency,
        "error": error
    })
\`\`\`

### 대시보드 메트릭

\`\`\`python
from collections import defaultdict

class MetricsCollector:
    def __init__(self):
        self.total_queries = 0
        self.successful_queries = 0
        self.total_latency = 0
        self.retry_count = 0
        self.error_types = defaultdict(int)

    def record(self, success: bool, latency: float, retries: int = 0, error: str = None):
        self.total_queries += 1
        if success:
            self.successful_queries += 1
        self.total_latency += latency
        self.retry_count += retries
        if error:
            self.error_types[error] += 1

    def get_metrics(self) -> dict:
        return {
            "success_rate": self.successful_queries / max(self.total_queries, 1),
            "avg_latency_ms": self.total_latency / max(self.total_queries, 1),
            "retry_rate": self.retry_count / max(self.total_queries, 1),
            "top_errors": dict(self.error_types)
        }
\`\`\`

### 지속적 개선

1. **실패 분석**: 빈번한 에러 패턴 파악
2. **예시 추가**: 실패 케이스에 맞는 Few-shot 예시 추가
3. **프롬프트 개선**: 에러 피드백 기반 프롬프트 수정
4. **Fine-tuning**: 누적된 성공 데이터로 모델 미세조정
`,
  keyPoints: ['성공률, 정확도, 응답시간, 재시도율 모니터링', '에러 유형별 통계', '실패 분석으로 지속적 개선'],
  practiceGoal: '운영 모니터링 및 개선 전략 이해',
})

const task6 = createQuizTask('w7d3-quiz', 'Day 3 복습 퀴즈', 15, {
  questions: [
    { id: 'q1', question: 'Text2Cypher 에러 재시도 시 효과적인 방법은?', options: ['같은 프롬프트로 재시도', '에러 메시지를 프롬프트에 포함', 'temperature 높이기', '모델 변경'], correctAnswer: 1, explanation: '에러 메시지를 포함하면 LLM이 수정 방향을 알 수 있습니다.' },
    { id: 'q2', question: 'Fallback 전략의 목적은?', options: ['속도 향상', '메모리 절약', '완전 실패 방지 및 대안 제공', '보안 강화'], correctAnswer: 2, explanation: 'Fallback은 에러 시에도 유용한 정보를 제공합니다.' },
    { id: 'q3', question: '적절한 Text2Cypher 성공률 목표는?', options: ['50%', '70%', '90% 이상', '100%'], correctAnswer: 2, explanation: '프로덕션에서는 90% 이상의 성공률이 필요합니다.' },
  ],
  keyPoints: ['에러 피드백 재시도', 'Fallback 전략', '성공률 목표'],
  practiceGoal: 'Day 3 학습 내용 복습',
})

export const day3ErrorHandling: Day = {
  slug: 'error-handling',
  title: '에러 처리 및 자동 수정',
  totalDuration: 205,
  tasks: [task1, task2, task3, task4, task5, task6],
}
