// Week 7 Day 5: Text2Cypher 챗봇 프로젝트

import type { Day } from './types'
import { createVideoTask, createCodeTask, createReadingTask, createChallengeTask } from './types'

const task1 = createVideoTask('w7d5-project-intro', 'Text2Cypher 챗봇 프로젝트 가이드', 20, {
  introduction: `
## Text2Cypher 챗봇 프로젝트

### 프로젝트 목표

Week 7에서 배운 모든 기술을 통합하여
**자연어로 Neo4j를 쿼리하는 챗봇**을 구축합니다.

### 필수 기능

1. **자연어 → Cypher**: Few-shot 기반 쿼리 생성
2. **쿼리 검증**: 보안 및 스키마 검증
3. **에러 처리**: 자동 재시도 및 Fallback
4. **대화 지원**: 멀티턴 대화 (선택)
5. **UI**: Streamlit 또는 FastAPI

### 기술 스택

| 컴포넌트 | 기술 |
|---------|------|
| Database | Neo4j |
| LLM | OpenAI GPT-4o-mini |
| Framework | LangChain |
| UI | Streamlit |

### 평가 기준

- Cypher 생성 정확도 (40%)
- 에러 처리 완성도 (20%)
- 코드 품질 (20%)
- UI/UX (20%)
`,
  keyPoints: ['Few-shot + 검증 + 에러처리 통합', 'Streamlit UI 구현', '실제 동작하는 챗봇 완성'],
  practiceGoal: '프로젝트 구조와 요구사항 이해',
})

const task2 = createCodeTask('w7d5-core-engine', '실습: Text2Cypher 핵심 엔진', 60, {
  introduction: `
## Text2Cypher 핵심 엔진

### 통합 클래스

\`\`\`python
from langchain_community.graphs import Neo4jGraph
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.example_selectors import SemanticSimilarityExampleSelector
import json
import re

class Text2CypherEngine:
    def __init__(self, neo4j_url, neo4j_user, neo4j_password, openai_key):
        self.graph = Neo4jGraph(url=neo4j_url, username=neo4j_user, password=neo4j_password)
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=openai_key)

        # Few-shot 예시
        self.examples = [
            {"question": "모든 회사", "cypher": "MATCH (c:Company) RETURN c.name LIMIT 10"},
            {"question": "삼성 경쟁사", "cypher": "MATCH (:Company {name:'삼성전자'})-[:COMPETES_WITH]->(x) RETURN x.name LIMIT 10"},
            {"question": "경쟁사 수 순위", "cypher": "MATCH (c:Company)-[:COMPETES_WITH]->(x) RETURN c.name, count(x) as cnt ORDER BY cnt DESC LIMIT 10"},
            {"question": "2000년 이후 설립", "cypher": "MATCH (c:Company) WHERE c.founded > 2000 RETURN c.name, c.founded LIMIT 10"},
        ]

        # 예시 선택기
        self.selector = SemanticSimilarityExampleSelector.from_examples(
            self.examples, OpenAIEmbeddings(api_key=openai_key), k=3
        )

    def generate_cypher(self, question: str) -> str:
        selected = self.selector.select_examples({"question": question})
        examples_text = "\\n".join([f"Q: {e['question']}\\nA: {e['cypher']}" for e in selected])

        prompt = f'''Neo4j Cypher 전문가입니다.

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
        return self.llm.invoke(prompt).content.strip()

    def validate(self, cypher: str) -> tuple[bool, str]:
        forbidden = ['DELETE', 'CREATE', 'DROP', 'SET', 'REMOVE']
        for kw in forbidden:
            if kw in cypher.upper():
                return False, f"금지된 키워드: {kw}"
        if 'LIMIT' not in cypher.upper():
            return False, "LIMIT 필수"
        return True, "OK"

    def query(self, question: str, max_retries: int = 3) -> dict:
        error_context = ""

        for attempt in range(max_retries):
            cypher = self.generate_cypher(question + error_context)

            is_valid, msg = self.validate(cypher)
            if not is_valid:
                error_context = f"\\n이전 오류: {msg}. 수정하세요."
                continue

            try:
                results = self.graph.query(cypher)
                return {"success": True, "cypher": cypher, "results": results, "attempts": attempt + 1}
            except Exception as e:
                error_context = f"\\n실행 오류: {str(e)}. 수정하세요."

        return {"success": False, "error": "최대 재시도 초과", "last_cypher": cypher}
\`\`\`
`,
  keyPoints: ['Few-shot 예시 선택기 통합', '검증 + 재시도 로직', '구조화된 결과 반환'],
  practiceGoal: 'Text2Cypher 핵심 엔진 구현',
  commonPitfalls: `
## 💥 Common Pitfalls (자주 하는 실수)

### 1. SemanticSimilarityExampleSelector 초기화 비용
**증상**: 첫 쿼리가 매우 느림 (임베딩 생성 시간)

\`\`\`python
# ❌ 잘못된 예시: 매 쿼리마다 초기화
def generate_cypher(self, question):
    selector = SemanticSimilarityExampleSelector.from_examples(
        self.examples, OpenAIEmbeddings(), k=3
    )  # 매번 임베딩 생성!

# ✅ 올바른 예시: __init__에서 한 번만 초기화
def __init__(self, ...):
    self.selector = SemanticSimilarityExampleSelector.from_examples(
        self.examples, OpenAIEmbeddings(api_key=openai_key), k=3
    )  # 한 번만 생성

def generate_cypher(self, question):
    selected = self.selector.select_examples({"question": question})  # 재사용
\`\`\`

💡 **기억할 점**: 임베딩 기반 선택기는 __init__에서 한 번만 초기화

### 2. 에러 컨텍스트가 질문에 섞여 쿼리 오염
**증상**: "삼성전자 경쟁사\\n이전 오류: ..." 같은 이상한 쿼리 생성

\`\`\`python
# ❌ 잘못된 예시: 질문에 에러 직접 추가
cypher = self.generate_cypher(question + error_context)  # 질문 오염

# ✅ 올바른 예시: 프롬프트 구조 분리
def generate_cypher(self, question: str, error_context: str = "") -> str:
    prompt = f'''스키마: {self.graph.schema}

예시:
{examples_text}

{error_context}  # 별도 섹션으로 분리

규칙:
- MATCH로 시작
- Cypher만 출력

Q: {question}
A:'''
\`\`\`

💡 **기억할 점**: 질문과 에러 컨텍스트는 프롬프트 내에서 별도 섹션으로 분리

### 3. 검증 로직 우회 가능
**증상**: "MATCH ... DELETE ..." 같은 교묘한 쿼리가 통과

\`\`\`python
# ❌ 잘못된 예시: 단순 키워드 검사
forbidden = ['DELETE', 'CREATE']
for kw in forbidden:
    if kw in cypher.upper():  # "DELETEE" 또는 "DE LETE"는 통과

# ✅ 올바른 예시: 정규식으로 단어 경계 검사
import re
def validate(self, cypher: str) -> tuple[bool, str]:
    forbidden_patterns = [
        r'\\bDELETE\\b', r'\\bCREATE\\b', r'\\bDROP\\b',
        r'\\bSET\\b', r'\\bREMOVE\\b', r'\\bMERGE\\b'
    ]
    for pattern in forbidden_patterns:
        if re.search(pattern, cypher, re.IGNORECASE):
            return False, f"금지된 키워드 감지: {pattern}"

    # MATCH로 시작 검증
    if not re.match(r'^\\s*MATCH\\b', cypher, re.IGNORECASE):
        return False, "MATCH로 시작해야 함"

    return True, "OK"
\`\`\`

💡 **기억할 점**: 정규식 \\b(단어 경계)로 정확한 키워드 매칭
`,
  codeExample: `engine = Text2CypherEngine(
    "bolt://localhost:7687", "neo4j", "password", "sk-..."
)
result = engine.query("삼성전자의 경쟁사는?")
if result['success']:
    print(result['cypher'])
    print(result['results'])`,
})

const task3 = createCodeTask('w7d5-streamlit', '실습: Streamlit 챗봇 UI', 50, {
  introduction: `
## Streamlit 챗봇 UI

### 기본 구조

\`\`\`python
# app.py
import streamlit as st
from engine import Text2CypherEngine

st.set_page_config(page_title="Neo4j 자연어 챗봇", layout="wide")

# 세션 초기화
if "messages" not in st.session_state:
    st.session_state.messages = []
if "engine" not in st.session_state:
    st.session_state.engine = Text2CypherEngine(
        st.secrets["NEO4J_URI"],
        st.secrets["NEO4J_USER"],
        st.secrets["NEO4J_PASSWORD"],
        st.secrets["OPENAI_KEY"]
    )

# 헤더
st.title("🔍 Neo4j 자연어 쿼리 챗봇")
st.markdown("자연어로 데이터베이스에 질문하세요!")

# 사이드바
with st.sidebar:
    st.header("📊 데이터베이스 정보")
    st.code(st.session_state.engine.graph.schema[:500])

    if st.button("대화 초기화"):
        st.session_state.messages = []
        st.rerun()

# 대화 기록 표시
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])
        if "cypher" in msg:
            with st.expander("생성된 Cypher"):
                st.code(msg["cypher"], language="cypher")

# 사용자 입력
if prompt := st.chat_input("질문을 입력하세요..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with st.spinner("쿼리 생성 중..."):
            result = st.session_state.engine.query(prompt)

        if result["success"]:
            # 결과 포맷팅
            response = format_results(result["results"])
            st.markdown(response)
            with st.expander("생성된 Cypher"):
                st.code(result["cypher"], language="cypher")
        else:
            response = f"죄송합니다. 오류가 발생했습니다: {result.get('error')}"
            st.error(response)

    st.session_state.messages.append({
        "role": "assistant",
        "content": response,
        "cypher": result.get("cypher")
    })

def format_results(results: list) -> str:
    if not results:
        return "검색 결과가 없습니다."
    # 표 형식으로 변환
    import pandas as pd
    df = pd.DataFrame(results)
    return df.to_markdown()
\`\`\`
`,
  keyPoints: ['st.chat_message로 대화 UI', '사이드바에 스키마 표시', 'Expander로 Cypher 확인', '결과를 표 형식으로 표시'],
  practiceGoal: 'Streamlit 챗봇 UI 구현',
  codeExample: `# streamlit run app.py
# secrets.toml 설정 필요`,
})

const task4 = createCodeTask('w7d5-result-formatting', '실습: 결과 포맷팅 및 응답 생성', 40, {
  introduction: `
## 결과 포맷팅

### LLM 기반 자연어 응답

\`\`\`python
def generate_natural_response(question: str, results: list, llm) -> str:
    """쿼리 결과를 자연어로 변환"""
    if not results:
        return "검색 결과가 없습니다. 다른 질문을 시도해주세요."

    prompt = f'''질문: {question}

데이터베이스 결과:
{results[:10]}  # 최대 10개

위 데이터를 바탕으로 질문에 자연스럽게 답변하세요.
- 간결하고 명확하게
- 주요 정보 강조
- 목록이면 bullet point 사용
'''
    return llm.invoke(prompt).content

# 사용
results = [{"name": "SK하이닉스"}, {"name": "Intel"}]
response = generate_natural_response("삼성 경쟁사", results, llm)
# "삼성전자의 주요 경쟁사로는 SK하이닉스와 Intel이 있습니다."
\`\`\`

### 시각화 추가

\`\`\`python
import plotly.express as px

def visualize_results(results: list, question: str):
    """결과를 차트로 시각화 (가능한 경우)"""
    df = pd.DataFrame(results)

    # 숫자 컬럼이 있으면 바 차트
    numeric_cols = df.select_dtypes(include='number').columns
    if len(numeric_cols) > 0 and len(df.columns) > 1:
        text_col = [c for c in df.columns if c not in numeric_cols][0]
        fig = px.bar(df, x=text_col, y=numeric_cols[0], title=question)
        st.plotly_chart(fig)
        return True
    return False
\`\`\`

### 통합 응답 생성

\`\`\`python
def create_response(question: str, result: dict, llm) -> dict:
    """통합 응답 생성"""
    if not result["success"]:
        return {
            "text": f"죄송합니다. {result.get('error', '오류가 발생했습니다.')}",
            "cypher": result.get("last_cypher"),
            "chart": None
        }

    natural_text = generate_natural_response(question, result["results"], llm)

    return {
        "text": natural_text,
        "cypher": result["cypher"],
        "results": result["results"],
        "attempts": result["attempts"]
    }
\`\`\`
`,
  keyPoints: ['LLM으로 결과를 자연어로 변환', 'Plotly로 가능하면 차트 시각화', '통합 응답 객체 생성'],
  practiceGoal: '사용자 친화적 응답 생성',
  codeExample: `response = create_response(question, result, llm)
st.markdown(response["text"])
if response.get("results"):
    visualize_results(response["results"], question)`,
})

const task5 = createReadingTask('w7d5-deployment', '배포 및 테스트', 30, {
  introduction: `
## 배포 및 테스트

### 테스트 체크리스트

**기능 테스트**:
- [ ] 단순 조회 쿼리 (모든 회사)
- [ ] 관계 탐색 쿼리 (경쟁사)
- [ ] 집계 쿼리 (개수, 순위)
- [ ] 에러 처리 (잘못된 질문)
- [ ] Fallback 동작

**보안 테스트**:
- [ ] DELETE 시도 차단
- [ ] CREATE 시도 차단
- [ ] SQL Injection 시도

### Streamlit Cloud 배포

1. GitHub 저장소에 코드 푸시
2. requirements.txt 작성
3. streamlit.io에서 배포
4. Secrets 설정

\`\`\`yaml
# requirements.txt
langchain>=0.1.0
langchain-openai>=0.0.5
langchain-community>=0.0.10
neo4j>=5.0.0
streamlit>=1.30.0
pandas>=2.0.0
plotly>=5.0.0
\`\`\`

### 성능 목표

| 메트릭 | 목표 |
|--------|------|
| 응답 시간 | < 3초 |
| 성공률 | > 85% |
| 에러 복구율 | > 70% |
`,
  keyPoints: ['기능 + 보안 테스트 체크리스트', 'Streamlit Cloud 배포 절차', '성능 목표 설정'],
  practiceGoal: '배포 및 테스트 방법 이해',
})

const task6 = createChallengeTask('w7d5-challenge', '도전 과제: 고급 기능 추가', 60, {
  introduction: `
## 도전 과제

기본 챗봇에 고급 기능을 추가하세요.

### 선택 과제 (2개 이상 구현)

**1. 멀티턴 대화**
- 대화 기록 유지
- 대명사 해결 ("그 회사" → "삼성전자")

**2. 쿼리 설명**
- 생성된 Cypher 설명
- 실행 계획 표시

**3. 쿼리 히스토리**
- 이전 쿼리 저장
- 재실행 기능

**4. 음성 입력**
- 음성 → 텍스트 변환
- Streamlit audio input

**5. 결과 내보내기**
- CSV/Excel 다운로드
- 차트 이미지 저장

### 제출물

1. 소스 코드 (GitHub)
2. README.md
3. 데모 영상 또는 배포 URL
`,
  keyPoints: ['멀티턴, 쿼리 설명, 히스토리 등 고급 기능', 'GitHub + README 문서화', '데모 또는 배포 URL'],
  practiceGoal: 'Text2Cypher 챗봇 완성 및 고급 기능 추가',
})

export const day5T2cProject: Day = {
  slug: 'text2cypher-project',
  title: 'Text2Cypher 챗봇 프로젝트',
  totalDuration: 260,
  tasks: [task1, task2, task3, task4, task5],
  challenge: task6,
}
