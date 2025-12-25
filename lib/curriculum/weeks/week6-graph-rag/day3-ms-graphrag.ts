// Week 6 Day 3: Microsoft GraphRAG

import type { Day } from './types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
} from './types'

// Task 1: MS GraphRAG 소개
const task1 = createVideoTask(
  'w6d3-ms-graphrag-intro',
  'Microsoft GraphRAG 아키텍처',
  30,
  {
    introduction: `
## Microsoft GraphRAG

Microsoft Research에서 발표한 GraphRAG는 대규모 문서에서
자동으로 Knowledge Graph를 구축하고 검색하는 프레임워크입니다.

### 핵심 아이디어

기존 RAG의 **"나무를 보되 숲을 못 보는"** 문제 해결:
- 개별 청크가 아닌 전체 문서 컬렉션의 **글로벌 이해**
- **커뮤니티 기반** 계층적 요약
- **Local + Global** 검색 지원

### 파이프라인 개요

\`\`\`
Documents
    ↓
[1. Entity Extraction] → 엔티티 + 관계 추출
    ↓
[2. Graph Construction] → Knowledge Graph 구축
    ↓
[3. Community Detection] → 커뮤니티 (주제 클러스터) 탐지
    ↓
[4. Summary Generation] → 커뮤니티별 요약 생성
    ↓
[Query Time]
    ├→ [Local Search] - 특정 엔티티 기반
    └→ [Global Search] - 커뮤니티 요약 기반
\`\`\`

### Local vs Global Search

| 검색 유형 | 적합한 질문 | 예시 |
|----------|------------|------|
| **Local** | 특정 엔티티 관련 | "삼성전자의 CEO는 누구?" |
| **Global** | 전체 주제 요약 | "반도체 산업의 주요 트렌드는?" |

### 장점

1. **글로벌 질문 처리**: "전체 데이터셋 요약" 가능
2. **계층적 이해**: 세부 → 주제 → 전체
3. **효율적 검색**: 사전 계산된 커뮤니티 요약 활용
`,
    keyPoints: [
      'MS GraphRAG: 문서에서 자동 KG 구축',
      'Community Detection으로 주제 클러스터링',
      'Local Search: 엔티티 기반, Global Search: 커뮤니티 기반',
      '글로벌 질문 ("전체 요약") 처리 가능',
    ],
    practiceGoal: 'Microsoft GraphRAG의 핵심 개념과 아키텍처 이해',
  }
)

// Task 2: 엔티티 추출 파이프라인
const task2 = createCodeTask(
  'w6d3-entity-extraction',
  '실습: LLM 기반 엔티티/관계 추출',
  50,
  {
    introduction: `
## 엔티티/관계 추출 파이프라인

MS GraphRAG의 첫 단계는 문서에서 엔티티와 관계를 추출하는 것입니다.

### 추출 프롬프트 설계

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import json

ENTITY_EXTRACTION_PROMPT = '''
다음 텍스트에서 엔티티와 관계를 추출하세요.

텍스트:
{text}

다음 JSON 형식으로 응답하세요:
{{
    "entities": [
        {{"name": "엔티티명", "type": "유형", "description": "설명"}}
    ],
    "relationships": [
        {{"source": "소스 엔티티", "target": "타겟 엔티티", "type": "관계유형", "description": "설명"}}
    ]
}}

유형 예시:
- 엔티티: Person, Organization, Location, Event, Technology, Product
- 관계: WORKS_AT, COMPETES_WITH, LOCATED_IN, FOUNDED, ACQUIRED, PARTNERS_WITH
'''

def extract_entities_and_relations(text: str, llm) -> dict:
    prompt = ChatPromptTemplate.from_messages([
        ("system", ENTITY_EXTRACTION_PROMPT),
        ("human", "{text}")
    ])

    chain = prompt | llm

    result = chain.invoke({"text": text})
    return json.loads(result.content)

# 사용
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
text = """
삼성전자의 이재용 회장은 NVIDIA의 젠슨 황 CEO와
AI 반도체 협력 방안을 논의했다.
두 회사는 차세대 AI 칩 공동 개발에 합의했다.
"""

result = extract_entities_and_relations(text, llm)
print(json.dumps(result, indent=2, ensure_ascii=False))
\`\`\`

### 청크 단위 처리

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

def process_documents(documents: list, llm) -> dict:
    """문서 목록에서 엔티티/관계 추출"""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000,
        chunk_overlap=200
    )

    all_entities = []
    all_relations = []

    for doc in documents:
        chunks = splitter.split_text(doc)
        for chunk in chunks:
            result = extract_entities_and_relations(chunk, llm)
            all_entities.extend(result.get('entities', []))
            all_relations.extend(result.get('relationships', []))

    # 중복 제거
    unique_entities = deduplicate_entities(all_entities)
    unique_relations = deduplicate_relations(all_relations)

    return {
        'entities': unique_entities,
        'relationships': unique_relations
    }
\`\`\`
`,
    keyPoints: [
      'LLM 프롬프트로 엔티티/관계 추출',
      'JSON 구조화 출력으로 파싱 용이',
      '청크 단위 처리 후 중복 제거',
      '엔티티 타입과 관계 타입 정의 중요',
    ],
    practiceGoal: '문서에서 엔티티와 관계 자동 추출',
    codeExample: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import json

PROMPT = '''텍스트에서 엔티티와 관계를 추출하세요.
JSON 형식: {{"entities": [...], "relationships": [...]}}'''

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

text = "삼성전자와 SK하이닉스는 반도체 시장에서 경쟁한다."

prompt = ChatPromptTemplate.from_messages([
    ("system", PROMPT),
    ("human", "{text}")
])

result = (prompt | llm).invoke({"text": text})
data = json.loads(result.content)
print(json.dumps(data, indent=2, ensure_ascii=False))`,
  }
)

// Task 3: 커뮤니티 탐지
const task3 = createReadingTask(
  'w6d3-community-detection',
  '커뮤니티 탐지와 계층적 요약',
  40,
  {
    introduction: `
## 커뮤니티 탐지와 계층적 요약

### 커뮤니티 탐지란?

그래프에서 밀접하게 연결된 노드 그룹을 찾는 것입니다.

\`\`\`
[반도체 커뮤니티]          [소프트웨어 커뮤니티]
  삼성 ─── SK              Google ─── Microsoft
    │ ╲ ╱ │                   │         │
  TSMC ── Intel             Apple ─── Amazon
\`\`\`

### Leiden 알고리즘

MS GraphRAG는 **Leiden 알고리즘**을 사용합니다.
(Louvain의 개선 버전)

\`\`\`python
import networkx as nx
from cdlib import algorithms

# NetworkX 그래프 생성
G = nx.Graph()
G.add_edges_from([
    ('삼성전자', 'SK하이닉스'),
    ('삼성전자', 'TSMC'),
    ('SK하이닉스', 'TSMC'),
    ('Google', 'Microsoft'),
    ('Google', 'Amazon'),
])

# Leiden 커뮤니티 탐지
communities = algorithms.leiden(G)

for i, community in enumerate(communities.communities):
    print(f"Community {i}: {community}")
# Community 0: {'삼성전자', 'SK하이닉스', 'TSMC'}
# Community 1: {'Google', 'Microsoft', 'Amazon'}
\`\`\`

### 계층적 커뮤니티

MS GraphRAG는 여러 레벨의 커뮤니티를 생성합니다:

\`\`\`
Level 0 (가장 세분화):
  - Community 0.1: 삼성전자, SK하이닉스
  - Community 0.2: Intel, AMD
  - Community 0.3: TSMC, GlobalFoundries

Level 1 (중간):
  - Community 1.1: 반도체 제조사 (0.1 + 0.3)
  - Community 1.2: 반도체 설계사 (0.2)

Level 2 (최상위):
  - Community 2.1: 반도체 산업 전체
\`\`\`

### 커뮤니티 요약 생성

각 커뮤니티에 대해 LLM으로 요약을 생성합니다:

\`\`\`python
def summarize_community(entities: list, relations: list, llm) -> str:
    prompt = f"""
다음 엔티티와 관계로 구성된 커뮤니티를 요약하세요:

엔티티: {entities}
관계: {relations}

요약 (2-3문장):
"""
    return llm.invoke(prompt).content

# 결과 예시:
# "이 커뮤니티는 반도체 제조 기업들로 구성됩니다.
#  삼성전자와 SK하이닉스는 메모리 반도체 분야에서 경쟁하며,
#  TSMC는 파운드리 시장을 주도합니다."
\`\`\`
`,
    keyPoints: [
      'Leiden 알고리즘으로 커뮤니티 탐지',
      '계층적 커뮤니티 (Level 0, 1, 2...)',
      '각 커뮤니티별 LLM 요약 생성',
      'Global Search에서 커뮤니티 요약 활용',
    ],
    practiceGoal: '커뮤니티 탐지와 요약 생성 원리 이해',
  }
)

// Task 4: Local Search 구현
const task4 = createCodeTask(
  'w6d3-local-search',
  '실습: Local Search 구현',
  45,
  {
    introduction: `
## Local Search

특정 엔티티를 중심으로 관련 정보를 검색합니다.

### Local Search 알고리즘

\`\`\`
1. 질문에서 엔티티 추출
2. 해당 엔티티의 이웃 탐색 (1-2 hop)
3. 관련 텍스트 청크 수집
4. 컨텍스트 구성 → LLM 응답
\`\`\`

### 구현

\`\`\`python
class LocalSearch:
    def __init__(self, graph, vector_store, llm):
        self.graph = graph  # Neo4j 또는 NetworkX
        self.vector_store = vector_store
        self.llm = llm

    def extract_entities(self, question: str) -> list:
        """질문에서 엔티티 추출"""
        prompt = f"다음 질문에서 검색할 엔티티를 추출하세요: {question}"
        result = self.llm.invoke(prompt)
        return result.content.split(", ")

    def get_entity_context(self, entity: str) -> dict:
        """엔티티 주변 컨텍스트 수집"""
        # 1. 그래프에서 이웃 탐색
        neighbors = self.graph.query(f'''
            MATCH (e {{name: "{entity}"}})-[r]-(n)
            RETURN e, type(r) as rel, n
            LIMIT 20
        ''')

        # 2. 관련 텍스트 청크 검색
        chunks = self.vector_store.similarity_search(entity, k=3)

        return {
            'entity': entity,
            'neighbors': neighbors,
            'chunks': [c.page_content for c in chunks]
        }

    def search(self, question: str) -> str:
        """Local Search 실행"""
        # 1. 엔티티 추출
        entities = self.extract_entities(question)

        # 2. 각 엔티티 컨텍스트 수집
        contexts = []
        for entity in entities:
            ctx = self.get_entity_context(entity)
            contexts.append(ctx)

        # 3. 컨텍스트 포맷팅
        context_text = self._format_context(contexts)

        # 4. LLM 응답 생성
        prompt = f"""
다음 정보를 바탕으로 질문에 답하세요:

{context_text}

질문: {question}
"""
        return self.llm.invoke(prompt).content

    def _format_context(self, contexts: list) -> str:
        parts = []
        for ctx in contexts:
            parts.append(f"## {ctx['entity']}")
            parts.append("관계:")
            for n in ctx['neighbors']:
                parts.append(f"  - {n}")
            parts.append("관련 텍스트:")
            for chunk in ctx['chunks']:
                parts.append(f"  {chunk[:200]}...")
        return "\\n".join(parts)
\`\`\`
`,
    keyPoints: [
      'Local Search: 특정 엔티티 중심 검색',
      '엔티티 추출 → 이웃 탐색 → 청크 검색 → 응답',
      '그래프 + 벡터 검색 결합',
      '상세하고 구체적인 질문에 적합',
    ],
    practiceGoal: 'Local Search 파이프라인 구현',
    codeExample: `# Local Search 사용 예시
local_search = LocalSearch(graph, vector_store, llm)

# 특정 엔티티 관련 질문
result = local_search.search("삼성전자의 주요 경쟁사는 누구인가요?")
print(result)

# 동작 흐름:
# 1. 엔티티 추출: ["삼성전자"]
# 2. 그래프 탐색: 삼성전자의 COMPETES_WITH 관계
# 3. 벡터 검색: "삼성전자" 관련 문서
# 4. 통합 응답 생성`,
  }
)

// Task 5: Global Search 구현
const task5 = createCodeTask(
  'w6d3-global-search',
  '실습: Global Search 구현',
  45,
  {
    introduction: `
## Global Search

커뮤니티 요약을 활용하여 전체적인 질문에 답합니다.

### Global Search 알고리즘

\`\`\`
1. 커뮤니티 요약 로드 (사전 생성됨)
2. 질문과 관련된 커뮤니티 선택
3. 선택된 커뮤니티 요약으로 답변 생성
4. (선택) Map-Reduce로 대규모 처리
\`\`\`

### 구현

\`\`\`python
class GlobalSearch:
    def __init__(self, community_summaries: dict, llm):
        """
        community_summaries: {
            "community_0": {"summary": "...", "entities": [...]},
            "community_1": {"summary": "...", "entities": [...]},
        }
        """
        self.summaries = community_summaries
        self.llm = llm

    def select_relevant_communities(self, question: str, top_k: int = 5) -> list:
        """질문과 관련된 커뮤니티 선택"""
        # 간단한 키워드 매칭 (실제로는 임베딩 유사도 사용)
        scores = {}
        question_lower = question.lower()

        for comm_id, data in self.summaries.items():
            # 엔티티 매칭 점수
            entity_score = sum(
                1 for e in data['entities']
                if e.lower() in question_lower
            )
            # 요약 키워드 매칭
            summary_score = sum(
                1 for word in question_lower.split()
                if word in data['summary'].lower()
            )
            scores[comm_id] = entity_score * 2 + summary_score

        # 상위 k개 선택
        sorted_comms = sorted(scores.items(), key=lambda x: -x[1])
        return [c[0] for c in sorted_comms[:top_k]]

    def search(self, question: str) -> str:
        """Global Search 실행"""
        # 1. 관련 커뮤니티 선택
        relevant_comms = self.select_relevant_communities(question)

        # 2. 커뮤니티 요약 수집
        summaries = []
        for comm_id in relevant_comms:
            summaries.append(self.summaries[comm_id]['summary'])

        # 3. Map: 각 요약으로 부분 답변 생성
        partial_answers = []
        for summary in summaries:
            prompt = f"""
커뮤니티 요약:
{summary}

질문: {question}

이 커뮤니티 정보를 바탕으로 질문에 답하세요 (관련 없으면 "관련 정보 없음"):
"""
            partial = self.llm.invoke(prompt).content
            if "관련 정보 없음" not in partial:
                partial_answers.append(partial)

        # 4. Reduce: 부분 답변 통합
        if not partial_answers:
            return "관련 정보를 찾을 수 없습니다."

        reduce_prompt = f"""
다음 부분 답변들을 종합하여 최종 답변을 작성하세요:

{chr(10).join(partial_answers)}

질문: {question}

종합 답변:
"""
        return self.llm.invoke(reduce_prompt).content
\`\`\`
`,
    keyPoints: [
      'Global Search: 커뮤니티 요약 기반 검색',
      'Map-Reduce 패턴으로 대규모 처리',
      '전체적인 질문 (트렌드, 요약)에 적합',
      '사전 생성된 요약으로 빠른 응답',
    ],
    practiceGoal: 'Global Search 파이프라인 구현',
    codeExample: `# Global Search 사용 예시
community_summaries = {
    "comm_0": {
        "summary": "반도체 제조 기업들의 커뮤니티. 삼성, SK, TSMC 등이 포함.",
        "entities": ["삼성전자", "SK하이닉스", "TSMC"]
    },
    "comm_1": {
        "summary": "AI/클라우드 기업들의 커뮤니티. NVIDIA, Google, Microsoft 등.",
        "entities": ["NVIDIA", "Google", "Microsoft"]
    }
}

global_search = GlobalSearch(community_summaries, llm)

# 전체적인 질문
result = global_search.search("반도체 산업의 주요 트렌드는 무엇인가요?")
print(result)`,
  }
)

// Task 6: 퀴즈
const task6 = createQuizTask(
  'w6d3-quiz',
  'Day 3 복습 퀴즈',
  20,
  {
    questions: [
      {
        id: 'q1',
        question: 'MS GraphRAG에서 커뮤니티 탐지에 사용하는 알고리즘은?',
        options: [
          'K-means',
          'Leiden',
          'PageRank',
          'BFS',
        ],
        correctAnswer: 1,
        explanation: 'MS GraphRAG는 Leiden 알고리즘 (Louvain의 개선 버전)을 사용합니다.',
      },
      {
        id: 'q2',
        question: '"전체 데이터셋의 주요 트렌드는?" 질문에 적합한 검색 방식은?',
        options: [
          'Local Search',
          'Global Search',
          'Keyword Search',
          'Full-text Search',
        ],
        correctAnswer: 1,
        explanation: 'Global Search는 커뮤니티 요약을 활용하여 전체적인 질문에 답합니다.',
      },
      {
        id: 'q3',
        question: 'Global Search에서 Map-Reduce 패턴의 역할은?',
        options: [
          '데이터 압축',
          '각 커뮤니티별 부분 답변 생성 후 통합',
          '보안 암호화',
          '실시간 스트리밍',
        ],
        correctAnswer: 1,
        explanation: 'Map: 각 커뮤니티 요약으로 부분 답변 생성, Reduce: 부분 답변 통합',
      },
      {
        id: 'q4',
        question: 'MS GraphRAG의 계층적 커뮤니티 구조의 장점은?',
        options: [
          '저장 공간 절약',
          '세부 정보부터 전체 요약까지 다양한 수준의 이해 제공',
          '실시간 업데이트',
          '다국어 지원',
        ],
        correctAnswer: 1,
        explanation: '계층적 구조로 세부 사항(Level 0)부터 전체 요약(Level N)까지 제공합니다.',
      },
    ],
    keyPoints: [
      'MS GraphRAG 핵심 개념 이해',
      'Local vs Global Search 구분',
      'Map-Reduce 패턴 활용',
    ],
    practiceGoal: 'Day 3 학습 내용 복습',
  }
)

// Day 3 Export
export const day3MsGraphrag: Day = {
  slug: 'ms-graphrag',
  title: 'Microsoft GraphRAG',
  totalDuration: 230,
  tasks: [task1, task2, task3, task4, task5, task6],
}
