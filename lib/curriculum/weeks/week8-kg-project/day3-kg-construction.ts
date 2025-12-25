// Week 8 Day 3: Knowledge Graph 구축

import type { Day } from './types'
import { createVideoTask, createCodeTask, createReadingTask } from './types'

const task1 = createVideoTask('w8d3-kg-architecture', 'KG 아키텍처 설계', 25, {
  introduction: `
## Knowledge Graph 아키텍처

### 3계층 아키텍처

\`\`\`
┌─────────────────────────────────────────┐
│            Application Layer            │
│   (GraphRAG, Text2Cypher, Streamlit)    │
├─────────────────────────────────────────┤
│              Service Layer              │
│  (Query Engine, Reasoner, Validator)    │
├─────────────────────────────────────────┤
│              Storage Layer              │
│    (Neo4j Graph + Vector Index)         │
└─────────────────────────────────────────┘
\`\`\`

### Neo4j 스키마 설계

\`\`\`cypher
// 노드 레이블
(:Article)     - 뉴스 기사
(:Person)      - 인물
(:Organization)- 기관
(:Location)    - 장소
(:Topic)       - 주제

// 관계 타입
-[:MENTIONS]->        - 언급
-[:AFFILIATED_WITH]-> - 소속
-[:COMPETES_WITH]->   - 경쟁
-[:LOCATED_IN]->      - 위치
-[:COVERS]->          - 다룸
\`\`\`

### 속성 설계

| 노드 | 필수 속성 | 선택 속성 |
|------|----------|----------|
| Article | uri, title, published_date | content, source |
| Person | uri, name | role, organization |
| Organization | uri, name | industry, founded |
| Location | uri, name | country, type |
| Topic | uri, name | category |

### 인덱스 전략

\`\`\`cypher
// Unique 제약조건 (필수)
CREATE CONSTRAINT article_uri FOR (a:Article) REQUIRE a.uri IS UNIQUE;
CREATE CONSTRAINT person_uri FOR (p:Person) REQUIRE p.uri IS UNIQUE;

// 검색 인덱스 (성능)
CREATE INDEX article_title FOR (a:Article) ON (a.title);
CREATE INDEX person_name FOR (p:Person) ON (p.name);

// 전문 검색 인덱스 (Optional)
CREATE FULLTEXT INDEX article_content FOR (a:Article) ON EACH [a.title, a.content];
\`\`\`
`,
  keyPoints: ['3계층 아키텍처 설계', 'Neo4j 노드/관계 스키마', '인덱스 전략'],
  practiceGoal: 'KG 아키텍처 이해',
})

const task2 = createCodeTask('w8d3-kg-builder', '실습: KG 빌더 구현', 60, {
  introduction: `
## Knowledge Graph 빌더

### 기본 KG 빌더

\`\`\`python
# kg/builder.py

from neo4j import GraphDatabase
from dataclasses import dataclass
from typing import List, Optional
import logging

@dataclass
class Triple:
    subject: str
    predicate: str
    object: str
    confidence: float
    source_url: str

class KnowledgeGraphBuilder:
    """Neo4j Knowledge Graph 빌더"""

    def __init__(self, uri: str, user: str, password: str):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
        self.logger = logging.getLogger("kg_builder")

    def close(self):
        self.driver.close()

    def setup_schema(self):
        """스키마 및 인덱스 설정"""
        constraints = [
            "CREATE CONSTRAINT article_uri IF NOT EXISTS FOR (a:Article) REQUIRE a.uri IS UNIQUE",
            "CREATE CONSTRAINT person_uri IF NOT EXISTS FOR (p:Person) REQUIRE p.uri IS UNIQUE",
            "CREATE CONSTRAINT org_uri IF NOT EXISTS FOR (o:Organization) REQUIRE o.uri IS UNIQUE",
            "CREATE CONSTRAINT location_uri IF NOT EXISTS FOR (l:Location) REQUIRE l.uri IS UNIQUE",
        ]

        indexes = [
            "CREATE INDEX article_title IF NOT EXISTS FOR (a:Article) ON (a.title)",
            "CREATE INDEX person_name IF NOT EXISTS FOR (p:Person) ON (p.name)",
            "CREATE INDEX org_name IF NOT EXISTS FOR (o:Organization) ON (o.name)",
        ]

        with self.driver.session() as session:
            for query in constraints + indexes:
                try:
                    session.run(query)
                except Exception as e:
                    self.logger.warning(f"스키마 설정 경고: {e}")

    def _parse_uri(self, uri: str) -> tuple:
        """URI에서 타입과 이름 추출"""
        # format: namespace:Type_Name
        if ":" not in uri:
            return "Entity", uri

        parts = uri.split(":", 1)[1]
        if "_" in parts:
            type_name = parts.split("_", 1)
            return type_name[0], type_name[1].replace("_", " ")
        return "Entity", parts

    def add_node(self, uri: str, properties: dict = None):
        """노드 추가 또는 업데이트"""
        node_type, name = self._parse_uri(uri)

        props = properties or {}
        props["uri"] = uri
        props["name"] = name

        query = f"""
        MERGE (n:{node_type} {{uri: $uri}})
        SET n += $props
        RETURN n
        """

        with self.driver.session() as session:
            session.run(query, uri=uri, props=props)

    def add_triple(self, triple: Triple):
        """Triple을 그래프에 추가"""
        # 1. Subject 노드 생성
        self.add_node(triple.subject)

        # 2. Object 노드 생성
        self.add_node(triple.object)

        # 3. 관계 생성
        rel_type = triple.predicate.split(":")[-1].upper()

        query = f"""
        MATCH (s {{uri: $subject}})
        MATCH (o {{uri: $object}})
        MERGE (s)-[r:{rel_type}]->(o)
        SET r.confidence = $confidence,
            r.source_url = $source_url
        RETURN r
        """

        with self.driver.session() as session:
            session.run(
                query,
                subject=triple.subject,
                object=triple.object,
                confidence=triple.confidence,
                source_url=triple.source_url
            )

    def add_triples_batch(self, triples: List[Triple]):
        """배치로 Triple 추가"""
        for triple in triples:
            try:
                self.add_triple(triple)
            except Exception as e:
                self.logger.error(f"Triple 추가 실패: {e}")

    def get_stats(self) -> dict:
        """그래프 통계"""
        query = """
        MATCH (n)
        WITH labels(n)[0] as label, count(*) as cnt
        RETURN label, cnt
        ORDER BY cnt DESC
        """

        with self.driver.session() as session:
            result = session.run(query)
            return {r["label"]: r["cnt"] for r in result}
\`\`\`
`,
  keyPoints: ['MERGE로 중복 방지', 'URI 파싱으로 노드 타입 추론', '배치 처리 지원'],
  practiceGoal: 'Neo4j KG 빌더 구현',
  codeExample: `# KG 구축 예시
builder = KnowledgeGraphBuilder(
    "bolt://localhost:7687", "neo4j", "password"
)

builder.setup_schema()

triple = Triple(
    subject="news:Person_이재용",
    predicate="news:affiliated_with",
    object="news:Organization_삼성전자",
    confidence=0.95,
    source_url="https://news.example.com/123"
)

builder.add_triple(triple)
print(builder.get_stats())`,
})

const task3 = createCodeTask('w8d3-vector-index', '실습: 벡터 인덱스 구성', 45, {
  introduction: `
## 벡터 인덱스 구성

### Neo4j Vector Index

\`\`\`python
# kg/vector_index.py

from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Neo4jVector
from typing import List, Dict

class KGVectorIndex:
    """Knowledge Graph 벡터 인덱스"""

    def __init__(
        self,
        neo4j_url: str,
        neo4j_user: str,
        neo4j_password: str,
        openai_key: str
    ):
        self.embeddings = OpenAIEmbeddings(api_key=openai_key)

        self.vector_store = Neo4jVector.from_existing_graph(
            embedding=self.embeddings,
            url=neo4j_url,
            username=neo4j_user,
            password=neo4j_password,
            index_name="article_index",
            node_label="Article",
            text_node_properties=["title", "content"],
            embedding_node_property="embedding"
        )

    def create_index_for_node_type(self, node_label: str, text_properties: List[str]):
        """특정 노드 타입에 대한 벡터 인덱스 생성"""
        return Neo4jVector.from_existing_graph(
            embedding=self.embeddings,
            url=self.vector_store._url,
            username=self.vector_store._username,
            password=self.vector_store._password,
            index_name=f"{node_label.lower()}_index",
            node_label=node_label,
            text_node_properties=text_properties,
            embedding_node_property="embedding"
        )

    def similarity_search(
        self,
        query: str,
        k: int = 5,
        filter: Dict = None
    ) -> List[Dict]:
        """유사도 검색"""
        results = self.vector_store.similarity_search_with_score(
            query, k=k, filter=filter
        )

        return [
            {
                "content": doc.page_content,
                "metadata": doc.metadata,
                "score": score
            }
            for doc, score in results
        ]

    def hybrid_search(
        self,
        query: str,
        k: int = 5
    ) -> List[Dict]:
        """하이브리드 검색 (벡터 + 키워드)"""
        # 벡터 검색
        vector_results = self.similarity_search(query, k=k)

        # 키워드 검색 (Fulltext)
        keyword_query = f"""
        CALL db.index.fulltext.queryNodes('article_content', $query)
        YIELD node, score
        RETURN node.uri as uri, node.title as title, score
        LIMIT $k
        """

        with self.vector_store._driver.session() as session:
            keyword_results = session.run(keyword_query, query=query, k=k)
            keyword_data = [dict(r) for r in keyword_results]

        # 결과 병합 (RRF)
        return self._reciprocal_rank_fusion(vector_results, keyword_data)

    def _reciprocal_rank_fusion(
        self,
        vector_results: List[Dict],
        keyword_results: List[Dict],
        k: int = 60
    ) -> List[Dict]:
        """RRF로 결과 병합"""
        scores = {}

        for rank, result in enumerate(vector_results):
            uri = result.get("metadata", {}).get("uri", str(rank))
            scores[uri] = scores.get(uri, 0) + 1 / (k + rank + 1)

        for rank, result in enumerate(keyword_results):
            uri = result.get("uri", str(rank))
            scores[uri] = scores.get(uri, 0) + 1 / (k + rank + 1)

        # 점수순 정렬
        sorted_uris = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)

        # 결과 재구성
        combined = []
        for uri in sorted_uris[:5]:
            for vr in vector_results:
                if vr.get("metadata", {}).get("uri") == uri:
                    combined.append(vr)
                    break

        return combined
\`\`\`
`,
  keyPoints: ['Neo4jVector로 임베딩 저장', '유사도 검색 구현', 'RRF로 하이브리드 검색'],
  practiceGoal: '벡터 인덱스 구축 및 하이브리드 검색',
  codeExample: `# 벡터 인덱스 사용
vector_index = KGVectorIndex(
    neo4j_url, neo4j_user, neo4j_password, openai_key
)

# 유사도 검색
results = vector_index.similarity_search("삼성전자 반도체", k=5)

# 하이브리드 검색
hybrid_results = vector_index.hybrid_search("삼성전자 반도체", k=5)`,
})

const task4 = createCodeTask('w8d3-query-engine', '실습: 쿼리 엔진 구현', 50, {
  introduction: `
## 쿼리 엔진 구현

### SPARQL-like 쿼리 엔진

\`\`\`python
# kg/query.py

from neo4j import GraphDatabase
from typing import List, Dict, Optional
import re

class KGQueryEngine:
    """Knowledge Graph 쿼리 엔진"""

    def __init__(self, uri: str, user: str, password: str):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    # =====================
    # 기본 쿼리
    # =====================

    def get_node(self, uri: str) -> Optional[Dict]:
        """URI로 노드 조회"""
        query = """
        MATCH (n {uri: $uri})
        RETURN n, labels(n) as labels
        """
        with self.driver.session() as session:
            result = session.run(query, uri=uri)
            record = result.single()
            if record:
                node = dict(record["n"])
                node["labels"] = record["labels"]
                return node
        return None

    def find_nodes(
        self,
        label: str,
        properties: Dict = None,
        limit: int = 10
    ) -> List[Dict]:
        """노드 검색"""
        where_clause = ""
        if properties:
            conditions = [f"n.{key} = $" + key for key in properties.keys()]
            where_clause = "WHERE " + " AND ".join(conditions)

        query = f"""
        MATCH (n:{label})
        {where_clause}
        RETURN n
        LIMIT $limit
        """

        params = {"limit": limit}
        if properties:
            params.update(properties)

        with self.driver.session() as session:
            result = session.run(query, **params)
            return [dict(r["n"]) for r in result]

    # =====================
    # 관계 쿼리
    # =====================

    def get_neighbors(
        self,
        uri: str,
        relation_type: str = None,
        direction: str = "both",
        limit: int = 10
    ) -> List[Dict]:
        """이웃 노드 조회"""
        rel = f":{relation_type}" if relation_type else ""

        if direction == "outgoing":
            pattern = f"-[r{rel}]->"
        elif direction == "incoming":
            pattern = f"<-[r{rel}]-"
        else:
            pattern = f"-[r{rel}]-"

        query = f"""
        MATCH (n {{uri: $uri}}){pattern}(neighbor)
        RETURN neighbor, type(r) as relation, r.confidence as confidence
        LIMIT $limit
        """

        with self.driver.session() as session:
            result = session.run(query, uri=uri, limit=limit)
            return [
                {
                    "node": dict(r["neighbor"]),
                    "relation": r["relation"],
                    "confidence": r["confidence"]
                }
                for r in result
            ]

    def find_path(
        self,
        start_uri: str,
        end_uri: str,
        max_hops: int = 3
    ) -> List[Dict]:
        """두 노드 사이의 경로 찾기"""
        query = f"""
        MATCH path = shortestPath(
            (start {{uri: $start}})-[*1..{max_hops}]-(end {{uri: $end}})
        )
        RETURN path
        """

        with self.driver.session() as session:
            result = session.run(query, start=start_uri, end=end_uri)
            paths = []
            for record in result:
                path = record["path"]
                nodes = [dict(node) for node in path.nodes]
                rels = [type(rel).__name__ for rel in path.relationships]
                paths.append({"nodes": nodes, "relationships": rels})
            return paths

    # =====================
    # 집계 쿼리
    # =====================

    def get_top_entities(
        self,
        label: str,
        relation_type: str,
        limit: int = 10
    ) -> List[Dict]:
        """가장 많이 연결된 엔티티"""
        query = f"""
        MATCH (n:{label})-[r:{relation_type}]->()
        WITH n, count(r) as cnt
        RETURN n.uri as uri, n.name as name, cnt
        ORDER BY cnt DESC
        LIMIT $limit
        """

        with self.driver.session() as session:
            result = session.run(query, limit=limit)
            return [dict(r) for r in result]

    def get_communities(self) -> List[Dict]:
        """커뮤니티 (연결 컴포넌트) 분석"""
        query = """
        CALL gds.wcc.stream('myGraph')
        YIELD nodeId, componentId
        RETURN componentId, count(*) as size
        ORDER BY size DESC
        LIMIT 10
        """
        # Note: GDS 플러그인 필요

        with self.driver.session() as session:
            try:
                result = session.run(query)
                return [dict(r) for r in result]
            except:
                return []
\`\`\`
`,
  keyPoints: ['URI 기반 노드 조회', '방향성 있는 이웃 탐색', 'shortestPath 경로 찾기', '집계 쿼리'],
  practiceGoal: '다양한 그래프 쿼리 구현',
  codeExample: `# 쿼리 엔진 사용
engine = KGQueryEngine(neo4j_url, neo4j_user, neo4j_password)

# 노드 조회
node = engine.get_node("news:Organization_삼성전자")

# 이웃 탐색
neighbors = engine.get_neighbors(
    "news:Organization_삼성전자",
    relation_type="COMPETES_WITH"
)

# 경로 찾기
paths = engine.find_path(
    "news:Organization_삼성전자",
    "news:Organization_SK하이닉스"
)`,
})

const task5 = createReadingTask('w8d3-quality', 'KG 품질 관리', 30, {
  introduction: `
## Knowledge Graph 품질 관리

### 품질 지표

| 지표 | 설명 | 목표 |
|------|------|------|
| 완전성 | 누락된 엔티티/관계 비율 | > 90% |
| 정확성 | 올바른 관계 비율 | > 95% |
| 일관성 | 중복/모순 없는 비율 | > 98% |
| 신선도 | 최신 데이터 비율 | > 80% |

### 자동 품질 검사

\`\`\`python
# kg/quality.py

class KGQualityChecker:
    """KG 품질 검사기"""

    def __init__(self, query_engine: KGQueryEngine):
        self.engine = query_engine

    def check_orphan_nodes(self) -> List[str]:
        """고립 노드 (관계 없는 노드) 찾기"""
        query = """
        MATCH (n)
        WHERE NOT (n)--()
        RETURN n.uri as uri
        """
        # 고립 노드는 삭제 또는 연결 필요

    def check_duplicate_relations(self) -> List[Dict]:
        """중복 관계 찾기"""
        query = """
        MATCH (a)-[r1]->(b), (a)-[r2]->(b)
        WHERE id(r1) < id(r2) AND type(r1) = type(r2)
        RETURN a.uri, type(r1), b.uri, count(*) as duplicates
        """

    def check_low_confidence(self, threshold: float = 0.5) -> List[Dict]:
        """저신뢰도 관계 찾기"""
        query = """
        MATCH (a)-[r]->(b)
        WHERE r.confidence < $threshold
        RETURN a.uri, type(r), b.uri, r.confidence
        """

    def check_stale_data(self, days: int = 30) -> int:
        """오래된 데이터 비율"""
        query = """
        MATCH (a:Article)
        WHERE a.published_date < datetime() - duration({days: $days})
        RETURN count(a) as stale_count
        """

    def generate_report(self) -> Dict:
        """품질 리포트 생성"""
        return {
            "orphan_nodes": len(self.check_orphan_nodes()),
            "duplicate_relations": len(self.check_duplicate_relations()),
            "low_confidence": len(self.check_low_confidence()),
            "stale_percentage": self.check_stale_data()
        }
\`\`\`

### 수동 검증 워크플로우

1. **샘플링**: 랜덤 100개 Triple 추출
2. **레이블링**: 정확/부정확 표시
3. **분석**: 오류 유형 분류
4. **개선**: 추출 로직 수정
5. **재검증**: 개선 효과 측정

### 사용자 피드백 시스템

\`\`\`cypher
// 피드백 관계 추가
MATCH (a)-[r]->(b)
WHERE r.id = $relation_id
SET r.user_feedback = $feedback,  // 1 (정확) or -1 (부정확)
    r.feedback_date = datetime()

// 피드백 기반 신뢰도 조정
MATCH (a)-[r]->(b)
WHERE r.user_feedback IS NOT NULL
SET r.confidence = CASE
    WHEN r.user_feedback > 0 THEN 1.0
    WHEN r.user_feedback < 0 THEN 0.0
    ELSE r.confidence
END
\`\`\`
`,
  keyPoints: ['4가지 품질 지표', '자동 품질 검사 쿼리', '사용자 피드백 시스템'],
  practiceGoal: 'KG 품질 관리 체계 이해',
})

export const day3KgConstruction: Day = {
  slug: 'kg-construction',
  title: 'Knowledge Graph 구축',
  totalDuration: 210,
  tasks: [task1, task2, task3, task4, task5],
}
