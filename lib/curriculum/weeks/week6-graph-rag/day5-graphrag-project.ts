// Week 6 Day 5: GraphRAG Q&A 시스템 프로젝트

import type { Day } from './types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

// Task 1: 프로젝트 개요
const task1 = createVideoTask(
  'w6d5-project-intro',
  'GraphRAG Q&A 시스템 프로젝트 가이드',
  20,
  {
    introduction: `
## GraphRAG Q&A 시스템 프로젝트

### 프로젝트 목표

Week 6에서 배운 모든 기술을 통합하여
**Knowledge Graph 기반 Q&A 시스템**을 구축합니다.

### 시스템 구성요소

\`\`\`
[문서 수집] → [KG 구축] → [검색 엔진] → [Q&A 인터페이스]
\`\`\`

1. **문서 수집**: 뉴스 기사 또는 문서 수집
2. **KG 구축**: 엔티티/관계 추출 → Neo4j 저장
3. **검색 엔진**: Local + Global Search
4. **인터페이스**: Streamlit 또는 FastAPI

### 기술 스택

| 컴포넌트 | 기술 |
|---------|------|
| Knowledge Graph | Neo4j |
| Vector Store | Neo4j Vector / Chroma |
| LLM | OpenAI GPT-4o-mini |
| Framework | LangChain |
| UI | Streamlit |

### 평가 기준

- 기능 완성도 (40%)
- 코드 품질 (20%)
- GraphRAG 기법 활용 (30%)
- UI/UX (10%)
`,
    keyPoints: [
      '문서 → KG 구축 → 검색 → Q&A 전체 파이프라인',
      'Neo4j + LangChain + Streamlit 통합',
      'Local/Global Search 모두 구현',
      '실제 동작하는 시스템 완성',
    ],
    practiceGoal: '프로젝트 구조와 요구사항 이해',
  }
)

// Task 2: KG 구축 파이프라인
const task2 = createCodeTask(
  'w6d5-kg-construction',
  '실습: Knowledge Graph 구축 파이프라인',
  60,
  {
    introduction: `
## Knowledge Graph 구축

### 전체 파이프라인

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_community.graphs import Neo4jGraph
from langchain.text_splitter import RecursiveCharacterTextSplitter
import json

class KGConstructor:
    def __init__(self, neo4j_url, neo4j_user, neo4j_password):
        self.graph = Neo4jGraph(
            url=neo4j_url,
            username=neo4j_user,
            password=neo4j_password
        )
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=2000,
            chunk_overlap=200
        )

    def extract_entities_relations(self, text: str) -> dict:
        """텍스트에서 엔티티/관계 추출"""
        prompt = f'''
텍스트에서 엔티티와 관계를 추출하세요.

텍스트: {text}

JSON 형식:
{{"entities": [{{"name": "...", "type": "...", "description": "..."}}],
 "relations": [{{"source": "...", "relation": "...", "target": "...", "description": "..."}}]}}
'''
        result = self.llm.invoke(prompt)
        return json.loads(result.content)

    def create_graph_elements(self, data: dict):
        """Neo4j에 엔티티/관계 생성"""
        # 엔티티 생성
        for entity in data.get('entities', []):
            query = '''
            MERGE (e:Entity {name: $name})
            SET e.type = $type, e.description = $description
            '''
            self.graph.query(query, {
                'name': entity['name'],
                'type': entity.get('type', 'Unknown'),
                'description': entity.get('description', '')
            })

        # 관계 생성
        for rel in data.get('relations', []):
            query = '''
            MATCH (s:Entity {name: $source})
            MATCH (t:Entity {name: $target})
            MERGE (s)-[r:RELATES_TO {type: $relation}]->(t)
            SET r.description = $description
            '''
            self.graph.query(query, {
                'source': rel['source'],
                'target': rel['target'],
                'relation': rel['relation'],
                'description': rel.get('description', '')
            })

    def process_documents(self, documents: list):
        """문서 목록 처리"""
        for doc in documents:
            chunks = self.splitter.split_text(doc)
            for chunk in chunks:
                data = self.extract_entities_relations(chunk)
                self.create_graph_elements(data)
                print(f"Processed: {len(data.get('entities', []))} entities, "
                      f"{len(data.get('relations', []))} relations")

# 사용
constructor = KGConstructor(
    "bolt://localhost:7687", "neo4j", "password"
)
constructor.process_documents(["문서1 내용...", "문서2 내용..."])
\`\`\`
`,
    keyPoints: [
      'LLM으로 엔티티/관계 자동 추출',
      'MERGE로 중복 없이 Neo4j에 저장',
      '청크 단위 처리로 긴 문서 지원',
      '구조화된 JSON 출력으로 파싱 용이',
    ],
    practiceGoal: '문서로부터 Knowledge Graph 자동 구축',
    codeExample: `# KG 구축 실행 예시
documents = [
    """삼성전자는 세계 최대 메모리 반도체 기업이다.
    이재용 회장이 경영을 맡고 있으며, SK하이닉스와 경쟁한다.
    최근 NVIDIA와 HBM 공급 계약을 체결했다.""",

    """NVIDIA는 AI 칩 시장을 선도하는 기업이다.
    젠슨 황 CEO가 이끌고 있으며, AMD와 경쟁한다."""
]

constructor = KGConstructor("bolt://localhost:7687", "neo4j", "password")
constructor.process_documents(documents)

# 결과 확인
print(constructor.graph.query("MATCH (n) RETURN count(n) as count"))`,
  }
)

// Task 3: 하이브리드 검색 구현
const task3 = createCodeTask(
  'w6d5-hybrid-search',
  '실습: 하이브리드 검색 엔진 구현',
  50,
  {
    introduction: `
## 하이브리드 검색 엔진

### 통합 검색 클래스

\`\`\`python
from langchain_community.graphs import Neo4jGraph
from langchain_community.vectorstores import Neo4jVector
from langchain_openai import OpenAIEmbeddings, ChatOpenAI

class HybridSearchEngine:
    def __init__(self, neo4j_url, neo4j_user, neo4j_password):
        self.graph = Neo4jGraph(
            url=neo4j_url,
            username=neo4j_user,
            password=neo4j_password
        )
        self.vector_store = Neo4jVector.from_existing_index(
            embedding=OpenAIEmbeddings(),
            url=neo4j_url,
            username=neo4j_user,
            password=neo4j_password,
            index_name="document_index"
        )
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    def route_query(self, question: str) -> str:
        """Local vs Global 라우팅"""
        prompt = f'''질문 유형을 판단하세요.
질문: {question}
LOCAL (특정 엔티티) 또는 GLOBAL (전체 요약/트렌드)
답변 (한 단어):'''
        result = self.llm.invoke(prompt)
        return result.content.strip().upper()

    def extract_entities(self, question: str) -> list:
        """질문에서 엔티티 추출"""
        prompt = f"질문에서 검색할 엔티티 이름만 추출 (쉼표 구분): {question}"
        result = self.llm.invoke(prompt)
        return [e.strip() for e in result.content.split(",") if e.strip()]

    def local_search(self, question: str) -> str:
        """Local Search: 엔티티 기반"""
        entities = self.extract_entities(question)
        graph_context = []

        for entity in entities:
            results = self.graph.query('''
                MATCH (e:Entity {name: $name})-[r]-(n)
                RETURN e.name, type(r), r.type, n.name, n.type
                LIMIT 15
            ''', {'name': entity})

            for r in results:
                graph_context.append(
                    f"{r['e.name']} -[{r['r.type']}]-> {r['n.name']}"
                )

        # 벡터 검색 보완
        vector_docs = self.vector_store.similarity_search(question, k=3)
        vector_context = "\\n".join([d.page_content for d in vector_docs])

        return f"=== 그래프 관계 ===\\n{chr(10).join(graph_context)}\\n\\n=== 관련 문서 ===\\n{vector_context}"

    def global_search(self, question: str) -> str:
        """Global Search: 전체 요약"""
        # 주요 엔티티 통계
        stats = self.graph.query('''
            MATCH (e:Entity)
            RETURN e.type as type, count(*) as count
            ORDER BY count DESC
            LIMIT 5
        ''')

        # 주요 관계
        relations = self.graph.query('''
            MATCH (s)-[r]->(t)
            RETURN s.name, r.type, t.name
            LIMIT 20
        ''')

        context = "=== 엔티티 통계 ===\\n"
        for s in stats:
            context += f"- {s['type']}: {s['count']}개\\n"

        context += "\\n=== 주요 관계 ===\\n"
        for r in relations:
            context += f"- {r['s.name']} → {r['r.type']} → {r['t.name']}\\n"

        return context

    def search(self, question: str) -> str:
        """통합 검색"""
        route = self.route_query(question)

        if route == "LOCAL":
            context = self.local_search(question)
        else:
            context = self.global_search(question)

        # LLM 응답 생성
        prompt = f'''다음 정보를 바탕으로 질문에 답하세요.

{context}

질문: {question}
답변:'''
        return self.llm.invoke(prompt).content
\`\`\`
`,
    keyPoints: [
      '쿼리 라우팅으로 Local/Global 자동 선택',
      'Local: 엔티티 추출 → 그래프 + 벡터 검색',
      'Global: 전체 통계 및 주요 관계 수집',
      '통합 컨텍스트로 LLM 응답 생성',
    ],
    practiceGoal: '라우팅 기반 하이브리드 검색 엔진 구현',
    codeExample: `# 검색 엔진 사용 예시
engine = HybridSearchEngine(
    "bolt://localhost:7687", "neo4j", "password"
)

# Local Search (특정 엔티티)
print(engine.search("삼성전자의 경쟁사는 누구인가요?"))

# Global Search (전체 요약)
print(engine.search("이 데이터셋의 주요 기업들은 어떤 관계를 가지고 있나요?"))`,
  }
)

// Task 4: Streamlit UI 구현
const task4 = createCodeTask(
  'w6d5-streamlit-ui',
  '실습: Streamlit Q&A 인터페이스',
  50,
  {
    introduction: `
## Streamlit Q&A 인터페이스

### 기본 UI 구조

\`\`\`python
# app.py
import streamlit as st
from search_engine import HybridSearchEngine

st.set_page_config(page_title="GraphRAG Q&A", layout="wide")

# 세션 상태 초기화
if "messages" not in st.session_state:
    st.session_state.messages = []
if "engine" not in st.session_state:
    st.session_state.engine = HybridSearchEngine(
        st.secrets["NEO4J_URI"],
        st.secrets["NEO4J_USER"],
        st.secrets["NEO4J_PASSWORD"]
    )

# 헤더
st.title("🔍 GraphRAG Q&A 시스템")
st.markdown("Knowledge Graph 기반 질문 답변 시스템")

# 사이드바: 설정
with st.sidebar:
    st.header("⚙️ 설정")
    search_mode = st.radio(
        "검색 모드",
        ["자동 (라우팅)", "Local Only", "Global Only"]
    )

    if st.button("대화 초기화"):
        st.session_state.messages = []
        st.rerun()

    # 그래프 통계
    st.header("📊 그래프 통계")
    stats = st.session_state.engine.graph.query(
        "MATCH (n) RETURN count(n) as nodes"
    )
    st.metric("총 노드 수", stats[0]['nodes'])

# 채팅 기록 표시
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# 사용자 입력
if prompt := st.chat_input("질문을 입력하세요..."):
    # 사용자 메시지 추가
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # 응답 생성
    with st.chat_message("assistant"):
        with st.spinner("검색 중..."):
            response = st.session_state.engine.search(prompt)
        st.markdown(response)

    # 응답 저장
    st.session_state.messages.append({"role": "assistant", "content": response})
\`\`\`

### 그래프 시각화 추가

\`\`\`python
from pyvis.network import Network
import streamlit.components.v1 as components

def visualize_graph(engine, query: str):
    """검색 결과 그래프 시각화"""
    # 관련 노드/엣지 조회
    results = engine.graph.query(f'''
        MATCH (s)-[r]->(t)
        WHERE s.name CONTAINS "{query}" OR t.name CONTAINS "{query}"
        RETURN s.name as source, type(r) as relation, t.name as target
        LIMIT 30
    ''')

    # PyVis 그래프 생성
    net = Network(height="400px", width="100%")

    for r in results:
        net.add_node(r['source'], label=r['source'])
        net.add_node(r['target'], label=r['target'])
        net.add_edge(r['source'], r['target'], label=r['relation'])

    # HTML 저장 및 표시
    net.save_graph("graph.html")
    with open("graph.html", "r") as f:
        components.html(f.read(), height=420)
\`\`\`
`,
    keyPoints: [
      'Streamlit 채팅 인터페이스 구현',
      '세션 상태로 대화 기록 유지',
      '사이드바에 설정 및 통계 표시',
      'PyVis로 관련 그래프 시각화',
    ],
    practiceGoal: 'Streamlit 기반 Q&A 인터페이스 구현',
    codeExample: `# secrets.toml 설정
# [secrets]
# NEO4J_URI = "bolt://localhost:7687"
# NEO4J_USER = "neo4j"
# NEO4J_PASSWORD = "password"

# 실행
# streamlit run app.py`,
  }
)

// Task 5: 테스트 및 배포
const task5 = createReadingTask(
  'w6d5-deployment',
  '테스트 및 배포 가이드',
  30,
  {
    introduction: `
## 테스트 및 배포

### 테스트 체크리스트

**기능 테스트**:
- [ ] KG 구축: 문서에서 엔티티/관계 추출
- [ ] Local Search: 특정 엔티티 질문 응답
- [ ] Global Search: 전체 요약 질문 응답
- [ ] 쿼리 라우팅: 자동 모드 전환
- [ ] 대화 기록: 맥락 유지

**품질 테스트**:
- [ ] 엔티티 추출 정확도
- [ ] 관계 추출 정확도
- [ ] 응답 관련성
- [ ] 응답 시간 (< 5초)

### Streamlit Cloud 배포

\`\`\`yaml
# requirements.txt
langchain>=0.1.0
langchain-openai>=0.0.5
langchain-community>=0.0.10
neo4j>=5.0.0
streamlit>=1.30.0
pyvis>=0.3.0
\`\`\`

1. GitHub에 코드 푸시
2. streamlit.io 접속
3. "New app" → GitHub 저장소 연결
4. Secrets 설정 (NEO4J_URI 등)
5. 배포

### Docker 배포

\`\`\`dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8501
CMD ["streamlit", "run", "app.py", "--server.port=8501"]
\`\`\`

\`\`\`bash
docker build -t graphrag-qa .
docker run -p 8501:8501 graphrag-qa
\`\`\`

### 성능 최적화 팁

1. **Neo4j 인덱스**: 자주 검색하는 속성에 인덱스
2. **결과 캐싱**: 동일 질문 캐시
3. **비동기 처리**: 그래프/벡터 검색 병렬화
4. **청크 크기**: 1000-2000 토큰 권장
`,
    keyPoints: [
      '기능 및 품질 테스트 체크리스트',
      'Streamlit Cloud로 쉬운 배포',
      'Docker로 이식성 높은 배포',
      '인덱스, 캐싱, 병렬화로 성능 최적화',
    ],
    practiceGoal: '테스트 및 배포 방법 이해',
  }
)

// Task 6: 도전 과제
const task6 = createChallengeTask(
  'w6d5-challenge',
  '도전 과제: 고급 기능 추가',
  60,
  {
    introduction: `
## 도전 과제

기본 GraphRAG Q&A 시스템에 고급 기능을 추가하세요.

### 선택 과제 (2개 이상 구현)

**1. Re-ranking 추가**
- Cross-Encoder로 검색 결과 재정렬
- Cohere Rerank API 연동

**2. 대화형 기능**
- 질문 재구성 (대명사 해결)
- 대화 기록 Neo4j 저장

**3. 소스 인용**
- 답변에 출처 표시
- 관련 그래프 경로 표시

**4. 피드백 시스템**
- 좋아요/싫어요 버튼
- 피드백 기반 개선

**5. 멀티모달**
- 그래프 시각화 개선
- 엔티티 이미지 표시

### 제출물

1. 소스 코드 (GitHub)
2. README.md (설치/실행 방법)
3. 데모 영상 또는 배포 URL
4. 구현 기능 설명 문서
`,
    keyPoints: [
      'Re-ranking, 대화형 기능 등 고급 기능',
      '실제 동작하는 시스템 완성',
      'GitHub + README 문서화',
      '데모 또는 배포 URL 제공',
    ],
    practiceGoal: 'GraphRAG Q&A 시스템 완성 및 고급 기능 추가',
  }
)

// Day 5 Export
export const day5GraphragProject: Day = {
  slug: 'graphrag-project',
  title: 'GraphRAG Q&A 시스템 프로젝트',
  totalDuration: 270,
  tasks: [task1, task2, task3, task4, task5],
  challenge: task6,
}
