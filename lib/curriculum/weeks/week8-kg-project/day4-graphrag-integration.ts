// Week 8 Day 4: GraphRAG 통합

import type { Day } from './types'
import { createVideoTask, createCodeTask, createReadingTask } from './types'

const task1 = createVideoTask('w8d4-integration-arch', 'GraphRAG 통합 아키텍처', 25, {
  introduction: `
## GraphRAG 통합 아키텍처

### 시스템 구성

\`\`\`
┌─────────────────────────────────────────────────────┐
│                   사용자 질문                        │
└─────────────────────┬───────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────┐
│              Query Router                            │
│    (질문 유형 분류: 구조적 vs 의미적 vs 하이브리드)    │
└────────┬──────────────────┬──────────────────┬──────┘
         ▼                  ▼                  ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  Text2Cypher   │  │ Vector Search  │  │ Hybrid Search  │
│  (구조적 질문)  │  │  (의미적 질문) │  │   (복합 질문)  │
└────────┬───────┘  └────────┬───────┘  └────────┬───────┘
         └──────────────────┼──────────────────┘
                            ▼
┌─────────────────────────────────────────────────────┐
│               Context Aggregator                     │
│           (검색 결과 통합 및 정제)                   │
└─────────────────────┬───────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────┐
│              Response Generator                      │
│            (LLM 기반 응답 생성)                      │
└─────────────────────────────────────────────────────┘
\`\`\`

### 질문 유형 분류

| 유형 | 예시 | 처리 방식 |
|------|------|----------|
| 구조적 | "삼성전자의 경쟁사는?" | Text2Cypher |
| 의미적 | "반도체 시장 전망은?" | Vector Search |
| 하이브리드 | "삼성전자 관련 최신 동향은?" | 둘 다 |

### 컴포넌트 책임

1. **Query Router**: 질문 분류 및 라우팅
2. **Text2Cypher**: 구조적 쿼리 생성/실행
3. **Vector Search**: 의미적 유사도 검색
4. **Context Aggregator**: 결과 병합/순위화
5. **Response Generator**: 자연어 응답 생성
`,
  keyPoints: ['Query Router로 질문 분류', '구조적/의미적 검색 병행', '결과 통합 후 응답 생성'],
  practiceGoal: 'GraphRAG 통합 아키텍처 이해',
})

const task2 = createCodeTask('w8d4-query-router', '실습: Query Router 구현', 50, {
  introduction: `
## Query Router 구현

### LLM 기반 라우터

\`\`\`python
# rag/router.py

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from enum import Enum
from typing import Dict

class QueryType(Enum):
    STRUCTURAL = "structural"    # 구조적 질문 → Text2Cypher
    SEMANTIC = "semantic"        # 의미적 질문 → Vector Search
    HYBRID = "hybrid"            # 복합 질문 → 둘 다

class QueryRouter:
    """질문 유형 분류 및 라우팅"""

    def __init__(self, openai_key: str):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0,
            api_key=openai_key
        )

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """질문을 분석하여 유형을 분류하세요.

분류 기준:
- structural: 특정 엔티티 간 관계, 속성 조회 (예: "삼성 경쟁사", "A와 B의 관계")
- semantic: 개념, 설명, 요약 요청 (예: "반도체란?", "시장 전망")
- hybrid: 특정 엔티티 + 설명/분석 (예: "삼성전자 최신 동향")

JSON으로 응답:
{{"type": "structural" | "semantic" | "hybrid", "reason": "분류 이유"}}
"""),
            ("human", "질문: {question}")
        ])

        self.chain = self.prompt | self.llm

    def route(self, question: str) -> Dict:
        """질문 분류"""
        try:
            result = self.chain.invoke({"question": question})
            import json
            data = json.loads(result.content)
            return {
                "type": QueryType(data["type"]),
                "reason": data.get("reason", "")
            }
        except Exception as e:
            # 기본값: 하이브리드
            return {"type": QueryType.HYBRID, "reason": f"분류 실패: {e}"}

    def route_with_keywords(self, question: str) -> Dict:
        """키워드 기반 빠른 라우팅 (LLM 호출 없음)"""
        structural_keywords = ["경쟁사", "관계", "연결", "소속", "누가", "어디"]
        semantic_keywords = ["전망", "분석", "설명", "의미", "무엇", "왜"]

        has_structural = any(kw in question for kw in structural_keywords)
        has_semantic = any(kw in question for kw in semantic_keywords)

        if has_structural and has_semantic:
            return {"type": QueryType.HYBRID, "reason": "복합 키워드"}
        elif has_structural:
            return {"type": QueryType.STRUCTURAL, "reason": "구조적 키워드"}
        elif has_semantic:
            return {"type": QueryType.SEMANTIC, "reason": "의미적 키워드"}
        else:
            return {"type": QueryType.HYBRID, "reason": "기본값"}
\`\`\`

### 라우팅 결과에 따른 처리

\`\`\`python
# rag/graphrag.py

class GraphRAGEngine:
    def __init__(self, router, text2cypher, vector_search, llm):
        self.router = router
        self.text2cypher = text2cypher
        self.vector_search = vector_search
        self.llm = llm

    def query(self, question: str) -> Dict:
        # 1. 라우팅
        route_result = self.router.route(question)
        query_type = route_result["type"]

        contexts = []

        # 2. 유형별 검색
        if query_type in [QueryType.STRUCTURAL, QueryType.HYBRID]:
            cypher_result = self.text2cypher.query(question)
            if cypher_result.get("success"):
                contexts.append({
                    "source": "text2cypher",
                    "data": cypher_result["results"],
                    "cypher": cypher_result["cypher"]
                })

        if query_type in [QueryType.SEMANTIC, QueryType.HYBRID]:
            vector_result = self.vector_search.search(question)
            contexts.append({
                "source": "vector_search",
                "data": vector_result
            })

        # 3. 응답 생성
        response = self._generate_response(question, contexts)

        return {
            "question": question,
            "query_type": query_type.value,
            "contexts": contexts,
            "response": response
        }
\`\`\`
`,
  keyPoints: ['LLM 기반 질문 분류', '키워드 기반 빠른 라우팅', '유형별 검색 파이프라인'],
  practiceGoal: 'Query Router 구현',
  codeExample: `# 라우터 테스트
router = QueryRouter(openai_key)

# 구조적 질문
result = router.route("삼성전자의 경쟁사는 누구인가요?")
# {"type": QueryType.STRUCTURAL, "reason": "특정 엔티티 관계 조회"}

# 의미적 질문
result = router.route("반도체 산업의 미래 전망은?")
# {"type": QueryType.SEMANTIC, "reason": "개념/전망 요청"}`,
})

const task3 = createCodeTask('w8d4-context-aggregator', '실습: Context Aggregator 구현', 45, {
  introduction: `
## Context Aggregator 구현

### 결과 통합

\`\`\`python
# rag/aggregator.py

from typing import List, Dict
from dataclasses import dataclass

@dataclass
class ContextItem:
    content: str
    source: str
    score: float
    metadata: Dict = None

class ContextAggregator:
    """검색 결과 통합기"""

    def __init__(self, max_tokens: int = 3000):
        self.max_tokens = max_tokens

    def aggregate(self, contexts: List[Dict]) -> List[ContextItem]:
        """여러 소스의 결과 통합"""
        items = []

        for ctx in contexts:
            source = ctx.get("source", "unknown")
            data = ctx.get("data", [])

            if source == "text2cypher":
                items.extend(self._process_cypher_results(data))
            elif source == "vector_search":
                items.extend(self._process_vector_results(data))

        # 중복 제거
        items = self._deduplicate(items)

        # 점수순 정렬
        items.sort(key=lambda x: x.score, reverse=True)

        # 토큰 제한
        items = self._limit_by_tokens(items)

        return items

    def _process_cypher_results(self, data: List) -> List[ContextItem]:
        """Cypher 결과 처리"""
        items = []
        for row in data:
            content = self._row_to_text(row)
            items.append(ContextItem(
                content=content,
                source="neo4j",
                score=1.0,  # 구조적 결과는 높은 신뢰도
                metadata=row
            ))
        return items

    def _process_vector_results(self, data: List) -> List[ContextItem]:
        """벡터 검색 결과 처리"""
        items = []
        for result in data:
            items.append(ContextItem(
                content=result.get("content", ""),
                source="vector",
                score=result.get("score", 0.5),
                metadata=result.get("metadata", {})
            ))
        return items

    def _row_to_text(self, row: Dict) -> str:
        """Neo4j 행을 텍스트로 변환"""
        parts = []
        for key, value in row.items():
            if value:
                parts.append(f"{key}: {value}")
        return ", ".join(parts)

    def _deduplicate(self, items: List[ContextItem]) -> List[ContextItem]:
        """중복 제거 (유사 콘텐츠)"""
        seen = set()
        unique = []

        for item in items:
            # 간단한 해시 기반 중복 제거
            key = item.content[:100].lower()
            if key not in seen:
                seen.add(key)
                unique.append(item)

        return unique

    def _limit_by_tokens(self, items: List[ContextItem]) -> List[ContextItem]:
        """토큰 제한"""
        total_chars = 0
        limited = []

        for item in items:
            item_chars = len(item.content)
            if total_chars + item_chars > self.max_tokens * 4:  # 대략적 변환
                break
            total_chars += item_chars
            limited.append(item)

        return limited

    def format_for_prompt(self, items: List[ContextItem]) -> str:
        """프롬프트용 포맷팅"""
        if not items:
            return "관련 정보를 찾지 못했습니다."

        parts = []
        for i, item in enumerate(items, 1):
            parts.append(f"[{i}] ({item.source}) {item.content}")

        return "\\n\\n".join(parts)
\`\`\`
`,
  keyPoints: ['소스별 결과 처리', '중복 제거 및 점수 정렬', '토큰 제한 관리'],
  practiceGoal: 'Context Aggregator 구현',
  codeExample: `# 컨텍스트 통합
aggregator = ContextAggregator(max_tokens=3000)

contexts = [
    {"source": "text2cypher", "data": [{"name": "SK하이닉스", "relation": "competes_with"}]},
    {"source": "vector_search", "data": [{"content": "삼성전자는...", "score": 0.85}]}
]

items = aggregator.aggregate(contexts)
prompt_context = aggregator.format_for_prompt(items)`,
})

const task4 = createCodeTask('w8d4-response-generator', '실습: Response Generator 구현', 45, {
  introduction: `
## Response Generator 구현

### 자연어 응답 생성

\`\`\`python
# rag/response.py

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from typing import List, Dict

class ResponseGenerator:
    """자연어 응답 생성기"""

    def __init__(self, openai_key: str):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.7,
            api_key=openai_key
        )

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """당신은 Knowledge Graph 기반 Q&A 시스템입니다.
주어진 컨텍스트를 바탕으로 사용자 질문에 답변하세요.

규칙:
1. 컨텍스트에 있는 정보만 사용
2. 정보가 없으면 "정보를 찾지 못했습니다" 라고 답변
3. 관계나 사실을 명확하게 설명
4. 가능하면 구조화된 형식 (목록, 표) 사용
5. 출처 번호 [1], [2] 등을 인용"""),
            ("human", """컨텍스트:
{context}

질문: {question}

답변:""")
        ])

        self.chain = self.prompt | self.llm

    def generate(
        self,
        question: str,
        context: str,
        metadata: Dict = None
    ) -> Dict:
        """응답 생성"""
        try:
            result = self.chain.invoke({
                "question": question,
                "context": context
            })

            return {
                "answer": result.content,
                "sources": metadata.get("sources", []) if metadata else [],
                "confidence": self._estimate_confidence(context, result.content)
            }
        except Exception as e:
            return {
                "answer": f"응답 생성 중 오류가 발생했습니다: {e}",
                "sources": [],
                "confidence": 0.0
            }

    def _estimate_confidence(self, context: str, answer: str) -> float:
        """응답 신뢰도 추정"""
        # 컨텍스트가 풍부할수록 높은 신뢰도
        if not context or "찾지 못했습니다" in context:
            return 0.3

        # 답변 길이와 인용 수 기반
        citation_count = answer.count("[")
        if citation_count >= 3:
            return 0.9
        elif citation_count >= 1:
            return 0.7
        else:
            return 0.5

    def generate_with_explanation(
        self,
        question: str,
        context: str,
        cypher_query: str = None
    ) -> Dict:
        """설명 포함 응답 생성"""
        response = self.generate(question, context)

        explanation_parts = []

        if cypher_query:
            explanation_parts.append(f"**사용된 쿼리:**\\n\`\`\`cypher\\n{cypher_query}\\n\`\`\`")

        explanation_parts.append(f"**신뢰도:** {response['confidence']*100:.0f}%")

        response["explanation"] = "\\n\\n".join(explanation_parts)
        return response
\`\`\`

### 스트리밍 응답

\`\`\`python
# rag/streaming.py

from langchain_core.callbacks import StreamingStdOutCallbackHandler

class StreamingResponseGenerator(ResponseGenerator):
    """스트리밍 응답 생성기"""

    def __init__(self, openai_key: str):
        super().__init__(openai_key)
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.7,
            api_key=openai_key,
            streaming=True,
            callbacks=[StreamingStdOutCallbackHandler()]
        )

    async def generate_stream(self, question: str, context: str):
        """스트리밍 응답"""
        async for chunk in self.chain.astream({
            "question": question,
            "context": context
        }):
            yield chunk.content
\`\`\`
`,
  keyPoints: ['컨텍스트 기반 응답 생성', '출처 인용 규칙', '신뢰도 추정', '스트리밍 지원'],
  practiceGoal: 'Response Generator 구현',
  codeExample: `# 응답 생성
generator = ResponseGenerator(openai_key)

response = generator.generate_with_explanation(
    question="삼성전자의 주요 경쟁사는?",
    context=prompt_context,
    cypher_query="MATCH (c:Company {name:'삼성전자'})-[:COMPETES_WITH]->(x) RETURN x"
)

print(response["answer"])
print(response["explanation"])`,
})

const task5 = createCodeTask('w8d4-full-pipeline', '실습: 전체 파이프라인 통합', 50, {
  introduction: `
## 전체 GraphRAG 파이프라인

### 통합 엔진

\`\`\`python
# rag/graphrag.py

from .router import QueryRouter, QueryType
from .aggregator import ContextAggregator
from .response import ResponseGenerator
from kg.query import KGQueryEngine
from kg.vector_index import KGVectorIndex

class DomainGraphRAG:
    """도메인 특화 GraphRAG 엔진"""

    def __init__(
        self,
        neo4j_url: str,
        neo4j_user: str,
        neo4j_password: str,
        openai_key: str
    ):
        # 컴포넌트 초기화
        self.router = QueryRouter(openai_key)
        self.query_engine = KGQueryEngine(neo4j_url, neo4j_user, neo4j_password)
        self.vector_index = KGVectorIndex(
            neo4j_url, neo4j_user, neo4j_password, openai_key
        )
        self.aggregator = ContextAggregator()
        self.generator = ResponseGenerator(openai_key)

        # Text2Cypher 엔진 (Week 7에서 구현)
        from .text2cypher import Text2CypherEngine
        self.text2cypher = Text2CypherEngine(
            neo4j_url, neo4j_user, neo4j_password, openai_key
        )

    def query(self, question: str) -> dict:
        """질문 처리 전체 파이프라인"""

        # 1. 라우팅
        route = self.router.route(question)
        query_type = route["type"]

        contexts = []
        cypher_query = None

        # 2. 구조적 검색
        if query_type in [QueryType.STRUCTURAL, QueryType.HYBRID]:
            t2c_result = self.text2cypher.query(question)
            if t2c_result.get("success"):
                contexts.append({
                    "source": "text2cypher",
                    "data": t2c_result["results"]
                })
                cypher_query = t2c_result.get("cypher")

        # 3. 의미적 검색
        if query_type in [QueryType.SEMANTIC, QueryType.HYBRID]:
            vector_results = self.vector_index.similarity_search(question, k=5)
            contexts.append({
                "source": "vector_search",
                "data": vector_results
            })

        # 4. 컨텍스트 통합
        items = self.aggregator.aggregate(contexts)
        formatted_context = self.aggregator.format_for_prompt(items)

        # 5. 응답 생성
        response = self.generator.generate_with_explanation(
            question=question,
            context=formatted_context,
            cypher_query=cypher_query
        )

        return {
            "question": question,
            "query_type": query_type.value,
            "routing_reason": route.get("reason"),
            "contexts_count": len(items),
            "answer": response["answer"],
            "explanation": response.get("explanation"),
            "confidence": response.get("confidence"),
            "cypher": cypher_query
        }

    def close(self):
        """리소스 정리"""
        self.query_engine.close()


# 사용 예시
if __name__ == "__main__":
    import os
    from dotenv import load_dotenv

    load_dotenv()

    rag = DomainGraphRAG(
        neo4j_url=os.getenv("NEO4J_URI"),
        neo4j_user=os.getenv("NEO4J_USER"),
        neo4j_password=os.getenv("NEO4J_PASSWORD"),
        openai_key=os.getenv("OPENAI_API_KEY")
    )

    # 테스트 질문
    questions = [
        "삼성전자의 주요 경쟁사는 누구인가요?",
        "반도체 산업의 최근 동향을 알려주세요",
        "삼성전자 관련 최신 뉴스 요약"
    ]

    for q in questions:
        print(f"\\n질문: {q}")
        result = rag.query(q)
        print(f"유형: {result['query_type']}")
        print(f"답변: {result['answer'][:200]}...")
        print(f"신뢰도: {result['confidence']*100:.0f}%")

    rag.close()
\`\`\`
`,
  keyPoints: ['5단계 파이프라인 통합', '컴포넌트 조합', '리소스 관리'],
  practiceGoal: '전체 GraphRAG 파이프라인 구축',
  codeExample: `# GraphRAG 실행
rag = DomainGraphRAG(neo4j_url, neo4j_user, neo4j_password, openai_key)

result = rag.query("삼성전자와 SK하이닉스의 경쟁 관계를 설명해주세요")

print(f"유형: {result['query_type']}")  # hybrid
print(f"답변: {result['answer']}")
print(f"Cypher: {result['cypher']}")
print(f"신뢰도: {result['confidence']*100}%")`,
})

const task6 = createReadingTask('w8d4-evaluation', 'GraphRAG 평가', 25, {
  introduction: `
## GraphRAG 평가

### 평가 지표

| 지표 | 설명 | 측정 방법 |
|------|------|----------|
| 정확도 | 답변의 사실적 정확성 | 수동 평가 |
| 관련성 | 질문과 답변의 관련성 | LLM 평가 |
| 완전성 | 필요한 정보 포함 여부 | 체크리스트 |
| 응답 시간 | 전체 파이프라인 지연 | 자동 측정 |
| 라우팅 정확도 | 질문 분류 정확성 | 수동 레이블링 |

### 자동 평가 스크립트

\`\`\`python
# evaluation/evaluator.py

class GraphRAGEvaluator:
    def __init__(self, rag_engine, test_cases: List[Dict]):
        self.rag = rag_engine
        self.test_cases = test_cases

    def evaluate(self) -> Dict:
        results = []

        for case in self.test_cases:
            question = case["question"]
            expected_type = case.get("expected_type")
            expected_entities = case.get("expected_entities", [])

            # 실행
            import time
            start = time.time()
            result = self.rag.query(question)
            latency = time.time() - start

            # 평가
            metrics = {
                "question": question,
                "latency": latency,
                "type_correct": result["query_type"] == expected_type,
                "entities_found": self._count_entities(
                    result["answer"], expected_entities
                ),
                "confidence": result.get("confidence", 0)
            }
            results.append(metrics)

        return self._aggregate_results(results)

    def _count_entities(self, answer: str, expected: List[str]) -> int:
        return sum(1 for e in expected if e in answer)

    def _aggregate_results(self, results: List[Dict]) -> Dict:
        return {
            "total_cases": len(results),
            "avg_latency": sum(r["latency"] for r in results) / len(results),
            "type_accuracy": sum(r["type_correct"] for r in results) / len(results),
            "avg_confidence": sum(r["confidence"] for r in results) / len(results)
        }
\`\`\`

### 테스트 케이스 예시

\`\`\`python
TEST_CASES = [
    {
        "question": "삼성전자의 경쟁사를 알려주세요",
        "expected_type": "structural",
        "expected_entities": ["SK하이닉스", "Intel", "TSMC"]
    },
    {
        "question": "반도체 산업 전망은?",
        "expected_type": "semantic",
        "expected_entities": []
    },
    {
        "question": "삼성전자 최신 뉴스",
        "expected_type": "hybrid",
        "expected_entities": ["삼성전자"]
    }
]
\`\`\`

### 성능 목표

| 지표 | 목표 |
|------|------|
| 평균 응답 시간 | < 3초 |
| 라우팅 정확도 | > 85% |
| 엔티티 추출률 | > 70% |
| 평균 신뢰도 | > 0.7 |
`,
  keyPoints: ['5가지 평가 지표', '자동 평가 스크립트', '성능 목표 설정'],
  practiceGoal: 'GraphRAG 시스템 평가 방법 이해',
})

export const day4GraphragIntegration: Day = {
  slug: 'graphrag-integration',
  title: 'GraphRAG 통합',
  totalDuration: 240,
  tasks: [task1, task2, task3, task4, task5, task6],
}
