// Week 8 Day 5: 프로덕션 배포 및 발표

import type { Day } from './types'
import { createVideoTask, createCodeTask, createReadingTask, createChallengeTask } from './types'

const task1 = createVideoTask('w8d5-streamlit-app', 'Streamlit 웹 앱 구축', 30, {
  introduction: `
## Streamlit 웹 앱

### 앱 구조

\`\`\`python
# app/streamlit_app.py

import streamlit as st
from rag.graphrag import DomainGraphRAG
import os

# 페이지 설정
st.set_page_config(
    page_title="도메인 Knowledge Graph Q&A",
    page_icon="🔍",
    layout="wide"
)

# 세션 상태 초기화
if "rag" not in st.session_state:
    st.session_state.rag = DomainGraphRAG(
        neo4j_url=st.secrets["NEO4J_URI"],
        neo4j_user=st.secrets["NEO4J_USER"],
        neo4j_password=st.secrets["NEO4J_PASSWORD"],
        openai_key=st.secrets["OPENAI_API_KEY"]
    )

if "messages" not in st.session_state:
    st.session_state.messages = []

# 헤더
st.title("🔍 도메인 Knowledge Graph Q&A")
st.markdown("Knowledge Graph 기반 자연어 질의응답 시스템")

# 사이드바
with st.sidebar:
    st.header("📊 시스템 정보")

    # KG 통계
    stats = st.session_state.rag.query_engine.get_stats()
    st.metric("총 노드 수", sum(stats.values()))
    st.metric("노드 타입", len(stats))

    # 예시 질문
    st.header("💡 예시 질문")
    examples = [
        "삼성전자의 주요 경쟁사는?",
        "반도체 산업 동향을 알려주세요",
        "삼성전자와 SK하이닉스의 관계는?"
    ]
    for ex in examples:
        if st.button(ex, key=ex):
            st.session_state.selected_example = ex

    # 설정
    st.header("⚙️ 설정")
    show_cypher = st.checkbox("Cypher 쿼리 표시", value=True)
    show_confidence = st.checkbox("신뢰도 표시", value=True)

# 메인 영역
# 대화 기록 표시
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])
        if msg.get("cypher") and show_cypher:
            with st.expander("📝 생성된 Cypher"):
                st.code(msg["cypher"], language="cypher")

# 입력
prompt = st.chat_input("질문을 입력하세요...")

# 예시 질문 선택 시
if "selected_example" in st.session_state:
    prompt = st.session_state.selected_example
    del st.session_state.selected_example

if prompt:
    # 사용자 메시지
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # 응답 생성
    with st.chat_message("assistant"):
        with st.spinner("검색 및 분석 중..."):
            result = st.session_state.rag.query(prompt)

        # 응답 표시
        st.markdown(result["answer"])

        # 메타 정보
        col1, col2, col3 = st.columns(3)
        with col1:
            st.caption(f"질문 유형: {result['query_type']}")
        with col2:
            if show_confidence:
                st.caption(f"신뢰도: {result['confidence']*100:.0f}%")
        with col3:
            st.caption(f"컨텍스트: {result['contexts_count']}개")

        # Cypher 표시
        if result.get("cypher") and show_cypher:
            with st.expander("📝 생성된 Cypher"):
                st.code(result["cypher"], language="cypher")

    # 메시지 저장
    st.session_state.messages.append({
        "role": "assistant",
        "content": result["answer"],
        "cypher": result.get("cypher")
    })
\`\`\`
`,
  keyPoints: ['st.chat_message로 대화 UI', '사이드바에 통계/예시', 'session_state로 상태 관리'],
  practiceGoal: 'Streamlit 웹 앱 구현',
})

const task2 = createCodeTask('w8d5-visualization', '실습: KG 시각화 페이지', 40, {
  introduction: `
## Knowledge Graph 시각화

### pyvis 기반 시각화

\`\`\`python
# app/pages/1_graph.py

import streamlit as st
from pyvis.network import Network
import tempfile

st.set_page_config(page_title="KG 시각화", layout="wide")
st.title("🕸️ Knowledge Graph 시각화")

# 필터
col1, col2 = st.columns(2)
with col1:
    node_type = st.selectbox(
        "노드 타입",
        ["전체", "Organization", "Person", "Article"]
    )
with col2:
    min_confidence = st.slider("최소 신뢰도", 0.0, 1.0, 0.5)

# 데이터 로드
@st.cache_data(ttl=300)
def load_graph_data(node_type: str, min_conf: float):
    query = """
    MATCH (a)-[r]->(b)
    WHERE r.confidence >= $min_conf
    RETURN a.uri as source, a.name as source_name, labels(a)[0] as source_type,
           type(r) as relation, r.confidence as confidence,
           b.uri as target, b.name as target_name, labels(b)[0] as target_type
    LIMIT 200
    """
    # Neo4j 쿼리 실행
    return st.session_state.rag.query_engine.driver.session().run(
        query, min_conf=min_conf
    ).data()

data = load_graph_data(node_type, min_confidence)

if data:
    # pyvis 네트워크 생성
    net = Network(height="600px", width="100%", bgcolor="#ffffff")
    net.barnes_hut(gravity=-8000, spring_length=200)

    # 노드 색상 매핑
    colors = {
        "Organization": "#FF6B6B",
        "Person": "#4ECDC4",
        "Article": "#95E1D3",
        "Location": "#DDA0DD"
    }

    # 노드와 엣지 추가
    added_nodes = set()
    for row in data:
        # Source 노드
        if row["source"] not in added_nodes:
            net.add_node(
                row["source"],
                label=row["source_name"][:20],
                title=row["source_name"],
                color=colors.get(row["source_type"], "#888")
            )
            added_nodes.add(row["source"])

        # Target 노드
        if row["target"] not in added_nodes:
            net.add_node(
                row["target"],
                label=row["target_name"][:20],
                title=row["target_name"],
                color=colors.get(row["target_type"], "#888")
            )
            added_nodes.add(row["target"])

        # 엣지
        net.add_edge(
            row["source"],
            row["target"],
            title=f"{row['relation']} ({row['confidence']:.0%})",
            width=row["confidence"] * 3
        )

    # HTML 저장 및 표시
    with tempfile.NamedTemporaryFile(delete=False, suffix=".html") as f:
        net.save_graph(f.name)
        with open(f.name, "r") as html_file:
            st.components.v1.html(html_file.read(), height=650)

    # 통계
    st.markdown(f"**표시된 노드:** {len(added_nodes)} | **관계:** {len(data)}")
else:
    st.info("표시할 데이터가 없습니다.")
\`\`\`
`,
  keyPoints: ['pyvis로 인터랙티브 그래프', '노드 타입별 색상', '신뢰도 기반 엣지 두께'],
  practiceGoal: 'KG 시각화 페이지 구현',
  commonPitfalls: `
## 💥 Common Pitfalls (자주 하는 실수)

### 1. 대량 노드 렌더링 → 브라우저 멈춤
**증상**: 1000개 이상 노드 시 페이지 무응답

\`\`\`python
# ❌ 잘못된 예시: 제한 없이 전체 로드
query = "MATCH (a)-[r]->(b) RETURN a, r, b"  # 전체 그래프!

# ✅ 올바른 예시: LIMIT + 필터링
query = """
MATCH (a)-[r]->(b)
WHERE r.confidence >= $min_conf
RETURN a.uri, type(r), b.uri
LIMIT 200  # 최대 200개 관계만
"""
\`\`\`

💡 **기억할 점**: 시각화는 200-500 노드가 적정, LIMIT 필수

### 2. pyvis HTML 파일 경로 문제
**증상**: 그래프가 표시되지 않음 (로컬에서는 됨)

\`\`\`python
# ❌ 잘못된 예시: 고정 경로 사용
net.save_graph("graph.html")  # 권한/경로 문제 가능

# ✅ 올바른 예시: tempfile 사용
import tempfile
with tempfile.NamedTemporaryFile(delete=False, suffix=".html") as f:
    net.save_graph(f.name)
    with open(f.name, "r") as html_file:
        st.components.v1.html(html_file.read(), height=650)
\`\`\`

💡 **기억할 점**: Streamlit Cloud에서는 tempfile 사용 권장

### 3. 캐시 미사용 → 페이지 전환마다 재쿼리
**증상**: 필터 변경할 때마다 느린 로딩

\`\`\`python
# ❌ 잘못된 예시: 캐시 없음
def load_graph_data(node_type, min_conf):
    return run_neo4j_query(...)  # 매번 DB 쿼리!

# ✅ 올바른 예시: 캐시 적용
@st.cache_data(ttl=300)  # 5분 캐시
def load_graph_data(node_type: str, min_conf: float):
    return run_neo4j_query(...)  # 동일 파라미터면 캐시 반환
\`\`\`

💡 **기억할 점**: @st.cache_data로 쿼리 결과 캐싱, ttl로 만료 설정
`,
  codeExample: `# Streamlit 멀티페이지 앱 구조
# app/
# ├── streamlit_app.py  (메인)
# └── pages/
#     ├── 1_graph.py    (시각화)
#     └── 2_stats.py    (통계)`,
})

const task3 = createCodeTask('w8d5-deployment', '실습: 배포 설정', 45, {
  introduction: `
## 배포 설정

### Streamlit Cloud 배포

\`\`\`yaml
# .streamlit/secrets.toml (로컬 테스트용)
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"
OPENAI_API_KEY = "sk-..."
\`\`\`

\`\`\`toml
# requirements.txt
streamlit>=1.30.0
langchain>=0.1.0
langchain-openai>=0.0.5
langchain-community>=0.0.10
neo4j>=5.0.0
pyvis>=0.3.0
pandas>=2.0.0
python-dotenv>=1.0.0
\`\`\`

### Streamlit Cloud 설정

1. **GitHub 저장소 푸시**
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/my-kg-project.git
git push -u origin main
\`\`\`

2. **Streamlit Cloud 연결**
- https://streamlit.io/cloud
- GitHub 저장소 선택
- Main file path: \`app/streamlit_app.py\`

3. **Secrets 설정**
- Settings → Secrets
- secrets.toml 내용 붙여넣기

### Docker 배포 (선택)

\`\`\`dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8501

CMD ["streamlit", "run", "app/streamlit_app.py", "--server.port=8501"]
\`\`\`

\`\`\`yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8501:8501"
    environment:
      - NEO4J_URI=\${NEO4J_URI}
      - NEO4J_USER=\${NEO4J_USER}
      - NEO4J_PASSWORD=\${NEO4J_PASSWORD}
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
    depends_on:
      - neo4j

  neo4j:
    image: neo4j:5.15
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=neo4j/password
    volumes:
      - neo4j_data:/data

volumes:
  neo4j_data:
\`\`\`

### 빌드 및 실행

\`\`\`bash
# Docker Compose 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f app
\`\`\`
`,
  keyPoints: ['Streamlit Cloud 배포 절차', 'Secrets 안전하게 관리', 'Docker 컨테이너화'],
  practiceGoal: '프로덕션 배포 완료',
  codeExample: `# 배포 확인
# Streamlit Cloud: https://your-app.streamlit.app
# Docker: http://localhost:8501`,
})

const task4 = createReadingTask('w8d5-documentation', '프로젝트 문서화', 30, {
  introduction: `
## 프로젝트 문서화

### README.md 템플릿

\`\`\`markdown
# [프로젝트명] Knowledge Graph Q&A

## 개요
[도메인]에 특화된 Knowledge Graph 기반 자연어 질의응답 시스템

## 주요 기능
- 🔍 자연어로 Knowledge Graph 쿼리
- 📊 GraphRAG 기반 하이브리드 검색
- 🕸️ 인터랙티브 그래프 시각화
- 💬 대화형 Q&A 인터페이스

## 아키텍처
\`\`\`
[아키텍처 다이어그램]
\`\`\`

## 기술 스택
| 영역 | 기술 |
|------|------|
| Database | Neo4j |
| LLM | OpenAI GPT-4o-mini |
| Framework | LangChain |
| Frontend | Streamlit |

## 설치 및 실행

### 요구사항
- Python 3.10+
- Neo4j 5.0+
- OpenAI API 키

### 설치
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 환경 변수
\`\`\`bash
cp .env.example .env
# .env 파일 수정
\`\`\`

### 실행
\`\`\`bash
streamlit run app/streamlit_app.py
\`\`\`

## 온톨로지 스키마
[SCHEMA.md 링크]

## API 문서
[API 문서 링크]

## 데모
[배포 URL 또는 스크린샷]

## 라이선스
MIT
\`\`\`

### 발표 자료 구조

1. **문제 정의** (2분)
   - 도메인 소개
   - 해결하려는 문제

2. **솔루션 개요** (3분)
   - 아키텍처
   - 주요 컴포넌트

3. **데모** (5분)
   - 실제 질문-답변 시연
   - 그래프 시각화

4. **기술 심화** (5분)
   - 온톨로지 설계
   - GraphRAG 파이프라인
   - 성능 최적화

5. **결과 및 향후 계획** (3분)
   - 성과 지표
   - 개선 방향

6. **Q&A** (2분)
`,
  keyPoints: ['README.md 필수 섹션', '발표 자료 구조', '20분 발표 타임라인'],
  practiceGoal: '프로젝트 문서 및 발표 자료 준비',
})

const task5 = createReadingTask('w8d5-checklist', '최종 체크리스트', 25, {
  introduction: `
## 프로젝트 최종 체크리스트

### 기능 체크리스트

**온톨로지 & 데이터 (20%)**
- [ ] 온톨로지 스키마 정의 (엔티티 5개+, 관계 5개+)
- [ ] 데이터 수집 파이프라인 구현
- [ ] 데이터 정제 및 검증
- [ ] Triple 추출 및 저장

**Knowledge Graph (30%)**
- [ ] Neo4j 스키마 구축
- [ ] 벡터 인덱스 설정
- [ ] 쿼리 엔진 구현
- [ ] 노드 500개+ 저장

**GraphRAG (30%)**
- [ ] Query Router 구현
- [ ] Text2Cypher 통합
- [ ] Vector Search 통합
- [ ] Response Generator 구현
- [ ] 정확도 70%+

**UI & 배포 (20%)**
- [ ] Streamlit 채팅 UI
- [ ] KG 시각화 페이지
- [ ] Streamlit Cloud 배포
- [ ] 문서화 (README, 스키마)

### 평가 기준

| 영역 | 기준 | 점수 |
|------|------|------|
| 설계 | 온톨로지 완성도, 확장성 | 20 |
| 구현 | 코드 품질, 테스트 | 40 |
| 품질 | 정확도, 성능 | 20 |
| 발표 | 데모, 설명 | 20 |

### 제출물

1. **GitHub 저장소**
   - 소스 코드 전체
   - README.md
   - requirements.txt

2. **배포 URL**
   - Streamlit Cloud 또는 Docker

3. **문서**
   - 온톨로지 스키마 (SCHEMA.md)
   - 발표 자료 (PDF)

4. **데모 영상** (선택)
   - 3-5분 시연 영상

### 마감

- 코드 제출: Week 8 Day 5 23:59
- 발표: Week 9 Day 1
`,
  keyPoints: ['4개 영역 체크리스트', '20/40/20/20 평가 비중', '필수 제출물 4가지'],
  practiceGoal: '프로젝트 완성도 점검',
})

const task6 = createChallengeTask('w8d5-challenge', '도전 과제: 고급 기능', 60, {
  introduction: `
## 도전 과제

### 선택 과제 (2개 이상 구현)

**1. 멀티모달 KG**
- 이미지/차트 노드 추가
- 이미지 임베딩 (CLIP)
- 이미지 기반 검색

**2. 실시간 업데이트**
- 뉴스 RSS 모니터링
- 자동 Triple 추출
- WebSocket 알림

**3. 다국어 지원**
- 영어/한국어 질문 처리
- 다국어 임베딩
- 번역 통합

**4. 고급 Reasoning**
- 추론 규칙 구현 (Transitive, Inverse)
- 경로 기반 추론
- 신뢰도 전파

**5. 비교 분석**
- "A와 B를 비교해줘" 질문 처리
- 엔티티 간 유사도/차이점
- 비교 표 자동 생성

**6. 시계열 분석**
- 시간에 따른 관계 변화
- 트렌드 시각화
- 예측 기능

### 구현 가이드

**고급 Reasoning 예시**:
\`\`\`python
class ReasoningEngine:
    def transitive_closure(self, entity: str, relation: str) -> List[str]:
        """추이적 관계 확장"""
        query = f"""
        MATCH (a {{uri: $uri}})-[:{relation}*1..3]->(b)
        RETURN DISTINCT b.uri as uri
        """
        # ...

    def inverse_relation(self, entity: str, relation: str) -> List[str]:
        """역관계 추론"""
        inverse_map = {
            "supplies_to": "supplied_by",
            "affiliated_with": "has_member"
        }
        # ...
\`\`\`

### 제출

- 구현한 고급 기능 목록
- 각 기능별 코드 및 테스트
- 발표 시 데모 포함
`,
  keyPoints: ['6가지 고급 기능 옵션', '2개 이상 선택 구현', '발표 시 데모 필수'],
  practiceGoal: 'Phase 3 캡스톤 프로젝트 완성',
})

export const day5Production: Day = {
  slug: 'production',
  title: '프로덕션 배포 및 발표',
  totalDuration: 230,
  tasks: [task1, task2, task3, task4, task5],
  challenge: task6,
}
