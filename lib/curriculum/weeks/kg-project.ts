// Week: 도메인 KG + GraphRAG 프로젝트 (Phase 3, Week 8)
import type { Week } from '../types'

export const kgProjectWeek: Week = {
  slug: 'kg-project',
  week: 8,
  phase: 3,
  month: 6,
  access: 'core',
  title: '도메인 KG + GraphRAG 프로젝트',
  topics: ['프로젝트 설계', '구현', '배포', '발표'],
  practice: '도메인 특화 Knowledge Graph + GraphRAG 시스템 완성',
  totalDuration: 900,
  days: [
    {
      slug: 'project-planning',
      title: '프로젝트 기획 및 설계',
      totalDuration: 180,
      tasks: [
        {
          id: 'project-intro-video',
          type: 'video',
          title: 'Phase 3 포트폴리오 프로젝트 가이드',
          duration: 20,
          content: {
            objectives: [
              '프로젝트 목표와 범위를 이해한다',
              '도메인 선택 기준을 파악한다',
              '평가 기준을 학습한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=project-guide-placeholder',
            transcript: `
## Phase 3 포트폴리오 프로젝트

### 프로젝트 목표

Phase 3에서 배운 모든 기술을 통합하여
**실제 비즈니스 문제를 해결하는 Knowledge Graph + GraphRAG 시스템**을 구축합니다.

### 필수 구성요소

| 구성요소 | 설명 | 비중 |
|----------|------|------|
| **Knowledge Graph** | 도메인 온톨로지 설계 + 데이터 구축 | 30% |
| **그래프 분석** | 알고리즘 적용 (중심성, 커뮤니티 등) | 20% |
| **GraphRAG** | KG + 벡터 검색 통합 Q&A | 30% |
| **인터페이스** | 자연어 질의 또는 시각화 | 20% |

### 도메인 선택 예시

| 도메인 | KG 대상 | 활용 시나리오 |
|--------|---------|--------------|
| **기술 뉴스** | 기업, 인물, 기술, 제품 | 경쟁 분석, 트렌드 파악 |
| **학술 연구** | 논문, 저자, 키워드, 인용 | 연구 동향, 협업 네트워크 |
| **영화/드라마** | 배우, 감독, 장르, 수상 | 추천, 관계 분석 |
| **의료 지식** | 질병, 증상, 치료, 약물 | 진단 지원, 부작용 탐지 |
| **법률 문서** | 판례, 법조항, 당사자 | 유사 판례 검색, 법률 자문 |

### 평가 기준

1. **기술적 완성도** (40%)
   - 온톨로지 설계 품질
   - 그래프 알고리즘 적용
   - GraphRAG 정확도

2. **실용성** (30%)
   - 실제 문제 해결 가능성
   - 사용자 경험
   - 확장 가능성

3. **문서화** (20%)
   - README, 아키텍처 다이어그램
   - 설치 및 실행 가이드
   - 코드 품질

4. **발표** (10%)
   - 프로젝트 설명 명확성
   - 데모 완성도
            `
          }
        },
        {
          id: 'domain-selection-reading',
          type: 'reading',
          title: '도메인 선택 및 요구사항 정의',
          duration: 30,
          content: {
            objectives: [
              '프로젝트 도메인을 선택한다',
              '데이터 소스를 파악한다',
              '요구사항을 정의한다'
            ],
            markdown: `
## 도메인 선택 가이드

### 좋은 도메인의 조건

1. **풍부한 관계**: 단순 속성보다 엔티티 간 관계가 중요
2. **데이터 접근성**: 공개 API, 크롤링, 공개 데이터셋
3. **개인적 관심**: 학습 동기 유지
4. **실용적 가치**: 포트폴리오에서 어필 가능

### 추천 데이터 소스

| 도메인 | 데이터 소스 |
|--------|------------|
| 기술 뉴스 | TechCrunch RSS, Hacker News API, 네이버 뉴스 |
| 학술 연구 | Semantic Scholar API, arXiv, DBLP |
| 영화/드라마 | TMDB API, IMDB 데이터셋 |
| 의료 | PubMed, DrugBank, SNOMED-CT |
| 법률 | 국가법령정보, 대법원 판례 |

### 요구사항 정의 템플릿

\`\`\`markdown
# [프로젝트명]

## 1. 프로젝트 개요
- 목적:
- 대상 사용자:
- 핵심 가치:

## 2. 도메인 분석
- 핵심 엔티티:
- 주요 관계:
- 데이터 소스:

## 3. 기능 요구사항
### 필수 기능
- [ ] ...

### 선택 기능
- [ ] ...

## 4. 기술 스택
- 그래프 DB: Neo4j / Memgraph
- 벡터 DB: Chroma / Pinecone
- LLM: OpenAI / Anthropic
- 프레임워크: LangChain

## 5. 마일스톤
- Week 8 Day 1-2: 설계 및 데이터 수집
- Week 8 Day 3-4: KG 구축 및 알고리즘 적용
- Week 8 Day 5-6: GraphRAG 구현
- Week 8 Day 7: 테스트 및 문서화
\`\`\`

### 온톨로지 설계 체크리스트

- [ ] 핵심 Object Type 5개 이상 정의
- [ ] 각 Object Type의 필수/선택 속성 정의
- [ ] 관계 타입 5개 이상 정의 (방향, 속성 포함)
- [ ] 제약조건 및 인덱스 설계
- [ ] 샘플 데이터로 스키마 검증
            `
          }
        },
        {
          id: 'architecture-design',
          type: 'code',
          title: '프로젝트 아키텍처 설계',
          duration: 60,
          content: {
            objectives: [
              '시스템 아키텍처를 설계한다',
              '컴포넌트 간 데이터 흐름을 정의한다',
              '기술 스택을 결정한다'
            ],
            instructions: `
## 실습: 프로젝트 아키텍처 설계

### 아키텍처 다이어그램

\`\`\`
                    ┌──────────────────────────────────────┐
                    │           사용자 인터페이스           │
                    │    (Streamlit / Gradio / Web)        │
                    └──────────────┬───────────────────────┘
                                   │
                    ┌──────────────▼───────────────────────┐
                    │           API Layer                  │
                    │    (FastAPI / Flask)                 │
                    └──────────────┬───────────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
┌─────────▼─────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
│   Text2Cypher     │   │    GraphRAG       │   │   Graph Analysis  │
│   (LangChain)     │   │   (Hybrid Search) │   │   (GDS / NetworkX)│
└─────────┬─────────┘   └─────────┬─────────┘   └─────────┬─────────┘
          │                       │                        │
          └───────────────────────┼────────────────────────┘
                                  │
                    ┌─────────────▼─────────────────────────┐
                    │         Knowledge Layer               │
                    │  ┌─────────────┐  ┌─────────────┐     │
                    │  │   Neo4j     │  │  Vector DB  │     │
                    │  │ (Graph)     │  │  (Chroma)   │     │
                    │  └─────────────┘  └─────────────┘     │
                    └──────────────────────────────────────┘
                                  │
                    ┌─────────────▼─────────────────────────┐
                    │          Data Pipeline                │
                    │  (수집 → 추출 → 정제 → 로드)           │
                    └──────────────────────────────────────┘
\`\`\`

### 프로젝트 구조

\`\`\`
my-kg-project/
├── README.md
├── requirements.txt
├── .env.example
├── config/
│   └── settings.py
├── data/
│   ├── raw/                 # 원본 데이터
│   └── processed/           # 처리된 데이터
├── src/
│   ├── __init__.py
│   ├── data_pipeline/       # 데이터 수집 및 처리
│   │   ├── collectors/
│   │   ├── extractors/
│   │   └── loaders/
│   ├── knowledge_graph/     # KG 관련
│   │   ├── schema.py
│   │   ├── neo4j_client.py
│   │   └── entity_extractor.py
│   ├── retrieval/           # 검색 관련
│   │   ├── vector_store.py
│   │   ├── graph_retriever.py
│   │   └── hybrid_search.py
│   ├── rag/                 # RAG 관련
│   │   ├── chains.py
│   │   └── prompts.py
│   └── api/                 # API
│       └── routes.py
├── notebooks/               # 탐색 및 분석
│   ├── 01_data_exploration.ipynb
│   ├── 02_kg_construction.ipynb
│   └── 03_rag_testing.ipynb
├── tests/
│   └── ...
└── app.py                   # 메인 애플리케이션
\`\`\`
            `,
            starterCode: `# 프로젝트 설정 파일 예시: config/settings.py

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Neo4j
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = ""

    # OpenAI
    OPENAI_API_KEY: str = ""

    # Vector DB
    CHROMA_PERSIST_DIR: str = "./data/chroma"

    class Config:
        env_file = ".env"

settings = Settings()
`,
            solutionCode: `# 완전한 프로젝트 설정 및 초기화

# config/settings.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Neo4j
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = ""

    # OpenAI
    OPENAI_API_KEY: str = ""
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    LLM_MODEL: str = "gpt-4o-mini"

    # Vector DB
    CHROMA_PERSIST_DIR: str = "./data/chroma"
    CHROMA_COLLECTION: str = "documents"

    # 앱 설정
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"

settings = Settings()

# src/knowledge_graph/schema.py
ONTOLOGY = """
# 도메인: 기술 뉴스

## Object Types

### Company
- name (string, required, unique)
- industry (string)
- founded (date)
- headquarters (string)

### Person
- name (string, required)
- title (string)
- company (string)

### Product
- name (string, required)
- category (string)
- release_date (date)

### Technology
- name (string, required)
- category (string)

## Relationship Types

### Company Relationships
- (Company)-[:COMPETES_WITH]->(Company)
- (Company)-[:PARTNERS_WITH {since: date}]->(Company)
- (Company)-[:ACQUIRED {date: date, amount: string}]->(Company)

### Person Relationships
- (Person)-[:WORKS_AT {role: string, since: date}]->(Company)
- (Person)-[:FOUNDED]->(Company)

### Product Relationships
- (Company)-[:PRODUCES]->(Product)
- (Product)-[:USES]->(Technology)
"""

# src/knowledge_graph/neo4j_client.py
from py2neo import Graph
from config.settings import settings

class Neo4jClient:
    def __init__(self):
        self.graph = Graph(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
        )

    def run_query(self, query, params=None):
        return self.graph.run(query, params or {}).data()

    def create_constraints(self):
        constraints = [
            "CREATE CONSTRAINT company_name IF NOT EXISTS FOR (c:Company) REQUIRE c.name IS UNIQUE",
            "CREATE CONSTRAINT person_name IF NOT EXISTS FOR (p:Person) REQUIRE p.name IS UNIQUE",
            "CREATE CONSTRAINT product_name IF NOT EXISTS FOR (p:Product) REQUIRE p.name IS UNIQUE"
        ]
        for c in constraints:
            self.graph.run(c)

neo4j_client = Neo4jClient()
`
          }
        }
      ]
    },
    {
      slug: 'project-implementation',
      title: '프로젝트 구현',
      totalDuration: 360,
      tasks: [
        {
          id: 'data-pipeline',
          type: 'code',
          title: '데이터 파이프라인 구현',
          duration: 90,
          content: {
            objectives: [
              '데이터 수집 스크립트를 작성한다',
              'KG 추출 파이프라인을 구현한다',
              'Neo4j에 데이터를 로드한다'
            ],
            instructions: `
## 데이터 파이프라인 구현

### 단계별 구현

1. **데이터 수집**: API 호출 또는 크롤링
2. **전처리**: 정제, 정규화
3. **KG 추출**: LLM으로 엔티티/관계 추출
4. **로드**: Neo4j에 저장

### 구현 가이드

데이터 소스에 맞는 수집기를 구현하고,
LLM 기반 KG 추출 파이프라인을 연결하세요.
            `,
            starterCode: `# src/data_pipeline/collectors/news_collector.py

import requests
from typing import List, Dict

class NewsCollector:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def collect(self, query: str, count: int = 10) -> List[Dict]:
        """뉴스 수집"""
        # TODO: API 호출 구현
        pass

# src/data_pipeline/extractors/kg_extractor.py

from langchain_openai import ChatOpenAI
from typing import Dict, List

class KGExtractor:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    def extract(self, text: str) -> Dict:
        """텍스트에서 KG 추출"""
        # TODO: 프롬프트 및 추출 로직
        pass

# src/data_pipeline/loaders/neo4j_loader.py

class Neo4jLoader:
    def __init__(self, client):
        self.client = client

    def load(self, extraction: Dict, source_id: str):
        """추출 결과를 Neo4j에 로드"""
        # TODO: 노드/관계 생성
        pass
`,
            solutionCode: `# 완전한 데이터 파이프라인 구현

# src/data_pipeline/collectors/news_collector.py
import requests
from typing import List, Dict
import time

class NewsCollector:
    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.base_url = "https://openapi.naver.com/v1/search/news.json"

    def collect(self, query: str, count: int = 10) -> List[Dict]:
        """네이버 뉴스 수집"""
        headers = {
            "X-Naver-Client-Id": self.client_id,
            "X-Naver-Client-Secret": self.client_secret
        }
        params = {
            "query": query,
            "display": min(count, 100),
            "sort": "date"
        }

        response = requests.get(self.base_url, headers=headers, params=params)
        response.raise_for_status()

        items = response.json().get("items", [])
        return [
            {
                "title": item["title"],
                "description": item["description"],
                "link": item["link"],
                "pubDate": item["pubDate"]
            }
            for item in items
        ]


# src/data_pipeline/extractors/kg_extractor.py
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from typing import Dict
import json
import re

class KGExtractor:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.prompt = PromptTemplate.from_template('''
다음 뉴스에서 엔티티와 관계를 추출하세요.

엔티티 유형: Company, Person, Product, Technology
관계 유형: COMPETES_WITH, PARTNERS_WITH, ACQUIRED, WORKS_AT, FOUNDED, PRODUCES, USES

뉴스:
{text}

JSON 형식으로 출력:
{{"entities": [{{"name": "...", "type": "...", "properties": {{}}}}],
"relationships": [{{"source": "...", "target": "...", "type": "...", "properties": {{}}}}]}}
''')

    def extract(self, text: str) -> Dict:
        """텍스트에서 KG 추출"""
        response = self.llm.invoke(self.prompt.format(text=text))

        # JSON 파싱
        content = response.content
        match = re.search(r'\\{.*\\}', content, re.DOTALL)
        if match:
            return json.loads(match.group())
        return {"entities": [], "relationships": []}


# src/data_pipeline/loaders/neo4j_loader.py
from typing import Dict

class Neo4jLoader:
    def __init__(self, client):
        self.client = client

    def load(self, extraction: Dict, source_id: str):
        """추출 결과를 Neo4j에 로드"""
        # 엔티티 생성
        for entity in extraction.get("entities", []):
            query = f'''
            MERGE (n:{entity["type"]} {{name: $name}})
            SET n += $props
            '''
            self.client.run_query(query, {
                "name": entity["name"],
                "props": entity.get("properties", {})
            })

        # 관계 생성
        for rel in extraction.get("relationships", []):
            query = f'''
            MATCH (a {{name: $source}})
            MATCH (b {{name: $target}})
            MERGE (a)-[r:{rel["type"]}]->(b)
            SET r += $props
            '''
            self.client.run_query(query, {
                "source": rel["source"],
                "target": rel["target"],
                "props": rel.get("properties", {})
            })

        # 소스 연결
        query = '''
        MERGE (s:Source {id: $source_id})
        WITH s
        MATCH (n) WHERE n.name IN $entity_names
        MERGE (s)-[:EXTRACTED]->(n)
        '''
        entity_names = [e["name"] for e in extraction.get("entities", [])]
        self.client.run_query(query, {
            "source_id": source_id,
            "entity_names": entity_names
        })


# 파이프라인 실행
def run_pipeline(query: str, count: int = 10):
    from config.settings import settings

    # 초기화
    collector = NewsCollector(
        settings.NAVER_CLIENT_ID,
        settings.NAVER_CLIENT_SECRET
    )
    extractor = KGExtractor()
    loader = Neo4jLoader(neo4j_client)

    # 수집
    news_items = collector.collect(query, count)
    print(f"수집된 뉴스: {len(news_items)}개")

    # 추출 및 로드
    for i, item in enumerate(news_items):
        text = f"{item['title']} {item['description']}"
        extraction = extractor.extract(text)
        loader.load(extraction, f"news_{i}")
        print(f"처리: {i+1}/{len(news_items)}")

    print("파이프라인 완료!")
`
          }
        },
        {
          id: 'graphrag-implementation',
          type: 'code',
          title: 'GraphRAG 시스템 구현',
          duration: 90,
          content: {
            objectives: [
              '하이브리드 검색을 구현한다',
              'RAG 체인을 구성한다',
              '자연어 인터페이스를 완성한다'
            ],
            instructions: `
## GraphRAG 시스템 구현

Week 5-7에서 배운 기술을 통합하여
완전한 GraphRAG 시스템을 구현합니다.

### 핵심 기능

1. 벡터 검색 (문서 청크)
2. 그래프 검색 (엔티티/관계)
3. 하이브리드 검색 (통합)
4. RAG 체인 (답변 생성)
5. 자연어 인터페이스
            `,
            starterCode: `# src/retrieval/hybrid_search.py

class HybridSearch:
    def __init__(self, vector_store, neo4j_client):
        self.vector_store = vector_store
        self.neo4j_client = neo4j_client

    def search(self, query: str, top_k: int = 5):
        """하이브리드 검색"""
        # TODO: 벡터 + 그래프 검색 통합
        pass

# src/rag/chains.py

class GraphRAGChain:
    def __init__(self, hybrid_search, llm):
        self.search = hybrid_search
        self.llm = llm

    def ask(self, question: str) -> str:
        """질문에 답변"""
        # TODO: 검색 → 컨텍스트 → 생성
        pass
`,
            solutionCode: `# 완전한 GraphRAG 구현

# src/retrieval/hybrid_search.py
from typing import Dict, List
import chromadb
from langchain_openai import OpenAIEmbeddings

class HybridSearch:
    def __init__(self, vector_store, neo4j_client):
        self.vector_store = vector_store
        self.neo4j_client = neo4j_client
        self.embeddings = OpenAIEmbeddings()

    def vector_search(self, query: str, top_k: int = 3) -> List[str]:
        """벡터 검색"""
        results = self.vector_store.query(
            query_texts=[query],
            n_results=top_k
        )
        return results["documents"][0] if results["documents"] else []

    def graph_search(self, entities: List[str]) -> List[Dict]:
        """그래프 검색"""
        if not entities:
            return []

        query = '''
        UNWIND $entities AS entity_name
        MATCH (e {name: entity_name})-[r]-(related)
        RETURN e.name as entity,
               type(r) as relationship,
               related.name as related_entity,
               labels(related) as related_type
        LIMIT 20
        '''
        return self.neo4j_client.run_query(query, {"entities": entities})

    def extract_entities(self, query: str) -> List[str]:
        """쿼리에서 엔티티 추출 (간단한 매칭)"""
        # 실제로는 NER 모델 사용 권장
        all_entities = self.neo4j_client.run_query(
            "MATCH (n) RETURN DISTINCT n.name as name"
        )
        entity_names = [e["name"] for e in all_entities if e["name"]]

        found = []
        for name in entity_names:
            if name and name.lower() in query.lower():
                found.append(name)
        return found

    def search(self, query: str, top_k: int = 5) -> Dict:
        """하이브리드 검색"""
        # 벡터 검색
        vector_results = self.vector_search(query, top_k)

        # 엔티티 추출 및 그래프 검색
        entities = self.extract_entities(query)
        graph_results = self.graph_search(entities)

        return {
            "documents": vector_results,
            "graph_context": graph_results,
            "entities": entities
        }


# src/rag/chains.py
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

class GraphRAGChain:
    def __init__(self, hybrid_search):
        self.search = hybrid_search
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.prompt = PromptTemplate.from_template('''
다음 정보를 바탕으로 질문에 답변하세요.

=== 관련 문서 ===
{documents}

=== 지식 그래프 ===
{graph_context}

=== 규칙 ===
1. 제공된 정보만 사용하세요
2. 정보가 없으면 "해당 정보를 찾을 수 없습니다"라고 답하세요
3. 관련 엔티티와 관계를 명시하세요

질문: {question}

답변:
''')

    def format_graph_context(self, graph_results: List[Dict]) -> str:
        """그래프 결과 포맷팅"""
        if not graph_results:
            return "관련 그래프 정보 없음"

        lines = []
        for r in graph_results:
            lines.append(
                f"- {r['entity']} --{r['relationship']}--> "
                f"{r['related_entity']} ({r['related_type'][0] if r['related_type'] else 'Unknown'})"
            )
        return "\\n".join(lines)

    def ask(self, question: str) -> Dict:
        """질문에 답변"""
        # 검색
        search_results = self.search.search(question)

        # 컨텍스트 구성
        documents = "\\n".join(search_results["documents"]) or "관련 문서 없음"
        graph_context = self.format_graph_context(search_results["graph_context"])

        # LLM 호출
        prompt_text = self.prompt.format(
            documents=documents,
            graph_context=graph_context,
            question=question
        )
        response = self.llm.invoke(prompt_text)

        return {
            "answer": response.content,
            "sources": {
                "documents": search_results["documents"],
                "entities": search_results["entities"],
                "graph": search_results["graph_context"]
            }
        }


# app.py - Streamlit 앱
import streamlit as st

def main():
    st.title("🔍 GraphRAG Q&A")

    # 초기화
    if "chain" not in st.session_state:
        # 초기화 코드
        pass

    # 입력
    question = st.text_input("질문을 입력하세요:")

    if question:
        with st.spinner("검색 중..."):
            result = chain.ask(question)

        st.markdown("### 답변")
        st.write(result["answer"])

        with st.expander("출처 보기"):
            st.json(result["sources"])

if __name__ == "__main__":
    main()
`
          }
        },
        {
          id: 'testing-documentation',
          type: 'reading',
          title: '테스트 및 문서화',
          duration: 45,
          content: {
            objectives: [
              '프로젝트 테스트 전략을 수립한다',
              'README 및 문서를 작성한다',
              '데모를 준비한다'
            ],
            markdown: `
## 테스트 및 문서화

### 테스트 전략

#### 1. 단위 테스트

\`\`\`python
# tests/test_extractor.py
import pytest
from src.data_pipeline.extractors.kg_extractor import KGExtractor

def test_extract_entities():
    extractor = KGExtractor()
    result = extractor.extract("삼성전자의 이재용 회장이 NVIDIA와 협력했다.")

    assert len(result["entities"]) >= 2
    entity_names = [e["name"] for e in result["entities"]]
    assert "삼성전자" in entity_names or "Samsung" in entity_names
\`\`\`

#### 2. 통합 테스트

\`\`\`python
# tests/test_pipeline.py
def test_full_pipeline():
    # 데이터 수집 → 추출 → 로드 → 검색 → RAG
    pass
\`\`\`

### README 템플릿

\`\`\`markdown
# 프로젝트명

## 개요
[프로젝트 설명]

## 주요 기능
- [기능 1]
- [기능 2]

## 아키텍처
[아키텍처 다이어그램]

## 설치

\\\`\\\`\\\`bash
git clone https://github.com/username/project.git
cd project
pip install -r requirements.txt
cp .env.example .env
# .env 파일 수정
\\\`\\\`\\\`

## 실행

\\\`\\\`\\\`bash
# Neo4j 시작
docker-compose up -d

# 데이터 파이프라인
python -m src.data_pipeline.run

# 앱 실행
streamlit run app.py
\\\`\\\`\\\`

## 데모
[스크린샷 또는 GIF]

## 기술 스택
- Neo4j
- LangChain
- OpenAI
- Streamlit

## 라이선스
MIT
\`\`\`

### 발표 준비

1. **슬라이드 구성**
   - 문제 정의 (1분)
   - 솔루션 개요 (2분)
   - 아키텍처 (2분)
   - 데모 (5분)
   - Q&A (5분)

2. **데모 시나리오**
   - 자연어 질의 3-5개 준비
   - 그래프 시각화 화면
   - 검색 결과 및 출처 표시
            `
          }
        }
      ]
    },
    {
      slug: 'project-completion',
      title: '프로젝트 완성 및 제출',
      totalDuration: 180,
      tasks: [
        {
          id: 'final-project',
          type: 'project',
          title: 'Phase 3 포트폴리오 프로젝트 제출',
          duration: 180,
          content: {
            objectives: [
              '프로젝트를 완성한다',
              'GitHub에 배포한다',
              '발표 자료를 준비한다'
            ],
            requirements: [
              '완전히 동작하는 GraphRAG 시스템',
              'GitHub 저장소 (README 포함)',
              '데모 영상 또는 라이브 데모',
              '발표 슬라이드'
            ],
            evaluationCriteria: [
              '기술적 완성도 (40%)',
              '실용성 및 창의성 (30%)',
              '문서화 품질 (20%)',
              '발표 (10%)'
            ],
            bonusPoints: [
              '실시간 데이터 파이프라인',
              '고급 그래프 분석 적용',
              'Docker 배포 설정',
              '성능 벤치마크 포함'
            ]
          }
        }
      ],
      challenge: {
        id: 'phase3-final-challenge',
        type: 'challenge',
        title: 'Phase 3 최종 도전 과제',
        duration: 120,
        content: {
          objectives: [
            'Phase 3 전체 기술 스택을 통합한다',
            '실제 비즈니스 문제를 해결한다',
            '포트폴리오 품질의 프로젝트를 완성한다'
          ],
          requirements: [
            '50개 이상의 문서/뉴스 처리',
            '100개 이상의 엔티티, 200개 이상의 관계',
            '그래프 알고리즘 3개 이상 적용',
            'GraphRAG 정확도 80% 이상',
            '자연어 인터페이스 구현'
          ],
          evaluationCriteria: [
            '온톨로지 설계 품질',
            '데이터 파이프라인 안정성',
            '검색 및 RAG 정확도',
            '사용자 경험',
            '코드 품질 및 문서화'
          ],
          bonusPoints: [
            '멀티 도메인 통합',
            '실시간 업데이트',
            'Production 배포',
            '성능 최적화 문서'
          ]
        }
      }
    }
  ]
}
