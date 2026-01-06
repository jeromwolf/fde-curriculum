// Day 8: 도메인 특화 Agent & 실전 도구
// vibecodingcamp7.com 참고 - PubChem Agent, anythingLLM, MCP 실전

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day8DomainAgents: Day = {
  slug: 'domain-agents',
  title: '도메인 특화 Agent & 실전 도구',
  totalDuration: 360,
  tasks: [
    // ========================================
    // Task 1: anythingLLM 소개 (30분)
    // ========================================
    createVideoTask('w5d8-anythingllm', 'anythingLLM: 올인원 로컬 AI 플랫폼', 30, {
      introduction: `
## anythingLLM이란?

**anythingLLM**은 오픈소스 올인원 AI 애플리케이션으로, 로컬 LLM과 RAG를 결합하여 문서와 대화할 수 있는 도구입니다.

> "Chat with your documents using any LLM"
> — anythingLLM 공식 슬로건

## 왜 anythingLLM인가?

### 로컬 RAG의 어려움

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  직접 구축 시 필요한 것들                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. LLM 설정 (Ollama, vLLM, ...)                            │
│  2. 임베딩 모델 설정                                         │
│  3. Vector DB 설정 (Chroma, Pinecone, ...)                  │
│  4. 문서 로더 & 청킹                                         │
│  5. RAG 체인 구성                                            │
│  6. UI 개발                                                  │
│                                                              │
│  → 최소 2-3일 개발 필요                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### anythingLLM의 해결책

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  anythingLLM = 올인원 솔루션                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅ LLM: Ollama, OpenAI, Anthropic, Azure, ...              │
│  ✅ 임베딩: 로컬/클라우드 자동 연동                          │
│  ✅ Vector DB: 내장 LanceDB, Chroma, Pinecone 지원          │
│  ✅ 문서: PDF, DOCX, TXT, 웹페이지 드래그&드롭              │
│  ✅ UI: 깔끔한 웹 인터페이스 기본 제공                       │
│  ✅ Agent: 내장 Agent 모드, 커스텀 Tool 지원                │
│                                                              │
│  → Docker 한 줄로 시작!                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 설치 방법

### 1. Docker (권장)

\`\`\`bash
# 최신 버전 실행
docker pull mintplexlabs/anythingllm

docker run -d -p 3001:3001 \\
  --cap-add SYS_ADMIN \\
  -v \${PWD}/anythingllm:/app/server/storage \\
  mintplexlabs/anythingllm
\`\`\`

### 2. Desktop App

- https://anythingllm.com/download
- Windows, Mac, Linux 지원

## 주요 기능

### 1. 멀티 LLM 지원

| Provider | 모델 | 비용 |
|----------|------|------|
| **Ollama** | Llama, Mistral, Qwen, ... | 무료 |
| **OpenAI** | GPT-4o, GPT-4o-mini | 유료 |
| **Anthropic** | Claude 3.5 | 유료 |
| **Azure** | Azure OpenAI | 유료 |
| **Local AI** | gguf 모델 직접 로드 | 무료 |

### 2. Workspace 개념

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  Workspace = 프로젝트 단위 문서 관리                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📁 법률 자문 Workspace                                      │
│     ├── 계약서.pdf                                           │
│     ├── 판례.docx                                            │
│     └── 법률 용어집.txt                                      │
│                                                              │
│  📁 연구 프로젝트 Workspace                                  │
│     ├── 논문1.pdf                                            │
│     ├── 논문2.pdf                                            │
│     └── 실험 데이터.csv                                      │
│                                                              │
│  → 각 Workspace는 독립적인 RAG 컨텍스트                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 3. Agent 모드

- 웹 검색 (Google, Bing, Serper)
- 코드 실행
- 파일 저장/읽기
- 커스텀 Tool 연동

## Ollama + anythingLLM 연동

\`\`\`bash
# 1. Ollama 실행 (먼저 설치 필요)
ollama serve

# 2. 모델 다운로드
ollama pull llama3.1:8b
ollama pull nomic-embed-text

# 3. anythingLLM 설정
# Settings → LLM → Ollama
# Base URL: http://host.docker.internal:11434
# Model: llama3.1:8b
\`\`\`
`,
      keyPoints: [
        'anythingLLM은 로컬 RAG를 쉽게 구축하는 올인원 도구',
        'Docker 또는 Desktop App으로 빠르게 시작',
        'Workspace로 프로젝트별 문서 관리',
        'Ollama와 연동하여 완전 무료 로컬 AI 구축 가능',
      ],
    }),

    // ========================================
    // Task 2: PubChem 검색 Agent (60분)
    // ========================================
    createCodeTask('w5d8-pubchem-agent', 'PubChem 화학물질 검색 Agent', 60, {
      introduction: `
## 학습 목표

- PubChem API를 활용한 화학물질 검색 Agent를 구현한다
- 도메인 특화 Tool 작성 방법을 익힌다
- 과학 연구 자동화의 기초를 학습한다

## PubChem이란?

**PubChem**은 미국 NIH(국립보건원)에서 운영하는 세계 최대의 무료 화학 정보 데이터베이스입니다.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  PubChem 데이터                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 1억 1천만+ 화합물 정보                                   │
│  🔬 분자 구조, 물성, 독성 데이터                             │
│  💊 약물 상호작용, 생물학적 활성                             │
│  📚 관련 논문, 특허 연결                                     │
│                                                              │
│  API: https://pubchem.ncbi.nlm.nih.gov/rest/pug/             │
│  무료 & 무제한 (합리적인 사용 범위 내)                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 활용 사례

| 분야 | 활용 예시 |
|------|----------|
| **신약 개발** | 후보 물질 특성 빠른 조회 |
| **독성 연구** | 화학물질 안전성 정보 검색 |
| **교육** | 분자 구조 학습 자료 생성 |
| **규제 대응** | 화학물질 규제 정보 확인 |
`,
      codeExample: `"""
PubChem 화학물질 검색 Agent
===========================

🎯 역할:
  - 화학물질 이름/CID로 정보 검색
  - 분자 구조, 물성, 안전 정보 제공
  - 연구 자동화 기초 구현

💡 VibeCodingCamp 스타일:
  - 로컬 LLM (Ollama)과 연동 가능
  - Tool Calling으로 PubChem API 호출
"""

import httpx
from typing import Optional, Dict, Any
from dataclasses import dataclass

from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate


# ============================================
# 1. PubChem API 클라이언트
# ============================================

class PubChemClient:
    """
    🎯 역할: PubChem REST API 클라이언트

    💡 설명:
      - 화합물 검색 및 정보 조회
      - 동기/비동기 HTTP 요청 지원
    """

    BASE_URL = "https://pubchem.ncbi.nlm.nih.gov/rest/pug"

    def __init__(self):
        self.client = httpx.Client(timeout=30.0)

    def search_by_name(self, name: str) -> Optional[int]:
        """
        화합물 이름으로 CID(Compound ID) 검색

        Args:
            name: 화합물 이름 (예: "aspirin", "caffeine")

        Returns:
            CID 또는 None (찾지 못한 경우)
        """
        url = f"{self.BASE_URL}/compound/name/{name}/cids/JSON"
        try:
            response = self.client.get(url)
            response.raise_for_status()
            data = response.json()
            cids = data.get("IdentifierList", {}).get("CID", [])
            return cids[0] if cids else None
        except Exception as e:
            print(f"검색 오류: {e}")
            return None

    def get_compound_properties(
        self,
        cid: int,
        properties: list = None
    ) -> Dict[str, Any]:
        """
        CID로 화합물 속성 조회

        Args:
            cid: PubChem Compound ID
            properties: 조회할 속성 목록

        Returns:
            속성 딕셔너리
        """
        if properties is None:
            properties = [
                "MolecularFormula",      # 분자식
                "MolecularWeight",       # 분자량
                "IUPACName",             # IUPAC 명명
                "CanonicalSMILES",       # SMILES 표기
                "XLogP",                 # 지용성 지표
                "HBondDonorCount",       # 수소결합 공여체 수
                "HBondAcceptorCount",    # 수소결합 수용체 수
                "RotatableBondCount",    # 회전 가능 결합 수
            ]

        props_str = ",".join(properties)
        url = f"{self.BASE_URL}/compound/cid/{cid}/property/{props_str}/JSON"

        try:
            response = self.client.get(url)
            response.raise_for_status()
            data = response.json()
            props = data.get("PropertyTable", {}).get("Properties", [])
            return props[0] if props else {}
        except Exception as e:
            print(f"속성 조회 오류: {e}")
            return {}

    def get_compound_description(self, cid: int) -> str:
        """화합물 설명 텍스트 조회"""
        url = f"{self.BASE_URL}/compound/cid/{cid}/description/JSON"

        try:
            response = self.client.get(url)
            response.raise_for_status()
            data = response.json()
            descriptions = data.get("InformationList", {}).get("Information", [])

            for desc in descriptions:
                if "Description" in desc:
                    return desc["Description"]

            return "설명 정보 없음"
        except Exception as e:
            return f"설명 조회 오류: {e}"

    def get_safety_info(self, cid: int) -> Dict[str, Any]:
        """안전 정보 (GHS) 조회"""
        url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/{cid}/JSON"

        try:
            response = self.client.get(url)
            response.raise_for_status()
            data = response.json()

            # GHS 정보 추출 (복잡한 JSON 구조)
            safety_info = {
                "hazard_statements": [],
                "precautionary_statements": []
            }

            # 간소화된 추출 (실제로는 더 복잡한 파싱 필요)
            return safety_info
        except Exception as e:
            return {"error": str(e)}


# ============================================
# 2. LangChain Tools 정의
# ============================================

pubchem = PubChemClient()


@tool
def search_compound(name: str) -> str:
    """
    화학물질 이름으로 PubChem에서 검색합니다.

    Args:
        name: 화학물질 이름 (영문, 예: "aspirin", "caffeine", "glucose")

    Returns:
        화합물의 기본 정보 (CID, 분자식, 분자량 등)
    """
    # 1. CID 검색
    cid = pubchem.search_by_name(name)
    if not cid:
        return f"'{name}' 화합물을 찾을 수 없습니다. 영문 이름으로 다시 시도해주세요."

    # 2. 속성 조회
    props = pubchem.get_compound_properties(cid)
    if not props:
        return f"'{name}'의 속성 정보를 조회할 수 없습니다."

    # 3. 결과 포맷팅
    result = f"""
## {name} (CID: {cid})

### 기본 정보
- **분자식**: {props.get('MolecularFormula', 'N/A')}
- **분자량**: {props.get('MolecularWeight', 'N/A')} g/mol
- **IUPAC 이름**: {props.get('IUPACName', 'N/A')}
- **SMILES**: {props.get('CanonicalSMILES', 'N/A')}

### 물리화학적 특성
- **XLogP (지용성)**: {props.get('XLogP', 'N/A')}
- **수소결합 공여체**: {props.get('HBondDonorCount', 'N/A')}개
- **수소결합 수용체**: {props.get('HBondAcceptorCount', 'N/A')}개
- **회전 가능 결합**: {props.get('RotatableBondCount', 'N/A')}개

🔗 PubChem 링크: https://pubchem.ncbi.nlm.nih.gov/compound/{cid}
"""
    return result


@tool
def get_compound_description(name: str) -> str:
    """
    화학물질의 상세 설명을 조회합니다.

    Args:
        name: 화학물질 이름 (영문)

    Returns:
        화합물에 대한 설명 텍스트
    """
    cid = pubchem.search_by_name(name)
    if not cid:
        return f"'{name}' 화합물을 찾을 수 없습니다."

    description = pubchem.get_compound_description(cid)
    return f"## {name} 설명\\n\\n{description}"


@tool
def compare_compounds(compound1: str, compound2: str) -> str:
    """
    두 화학물질의 특성을 비교합니다.

    Args:
        compound1: 첫 번째 화합물 이름
        compound2: 두 번째 화합물 이름

    Returns:
        두 화합물의 비교 정보
    """
    results = []

    for name in [compound1, compound2]:
        cid = pubchem.search_by_name(name)
        if cid:
            props = pubchem.get_compound_properties(cid)
            results.append({
                "name": name,
                "cid": cid,
                "formula": props.get("MolecularFormula", "N/A"),
                "weight": props.get("MolecularWeight", "N/A"),
                "xlogp": props.get("XLogP", "N/A")
            })
        else:
            results.append({"name": name, "error": "찾을 수 없음"})

    # 비교 표 생성
    comparison = f"""
## {compound1} vs {compound2} 비교

| 속성 | {compound1} | {compound2} |
|------|-------------|-------------|
| CID | {results[0].get('cid', 'N/A')} | {results[1].get('cid', 'N/A')} |
| 분자식 | {results[0].get('formula', 'N/A')} | {results[1].get('formula', 'N/A')} |
| 분자량 | {results[0].get('weight', 'N/A')} | {results[1].get('weight', 'N/A')} |
| XLogP | {results[0].get('xlogp', 'N/A')} | {results[1].get('xlogp', 'N/A')} |
"""
    return comparison


# ============================================
# 3. PubChem Agent 생성
# ============================================

def create_pubchem_agent():
    """
    🎯 역할: PubChem 검색 Agent 생성

    💡 특징:
      - 화학물질 검색, 설명 조회, 비교 기능
      - Tool Calling으로 자동 API 호출
    """
    # LLM 설정 (Ollama 사용 시 변경)
    # llm = ChatOllama(model="llama3.1:8b")
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    # Tools
    tools = [search_compound, get_compound_description, compare_compounds]

    # 프롬프트
    prompt = ChatPromptTemplate.from_messages([
        ("system", """당신은 화학 연구 어시스턴트입니다.
PubChem 데이터베이스를 활용하여 화학물질 정보를 검색하고 분석합니다.

주요 기능:
1. 화학물질 검색 (이름 → 분자식, 분자량, 구조 등)
2. 화합물 설명 조회
3. 두 화합물 비교 분석

항상 한국어로 친절하게 설명해주세요.
화학 용어는 영문 이름도 함께 표기해주세요."""),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}")
    ])

    # Agent 생성
    agent = create_tool_calling_agent(llm, tools, prompt)
    executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        max_iterations=5
    )

    return executor


# ============================================
# 4. 실행 예제
# ============================================

if __name__ == "__main__":
    agent = create_pubchem_agent()

    test_queries = [
        "아스피린(aspirin)의 분자 구조와 특성을 알려줘",
        "카페인(caffeine)에 대해 설명해줘",
        "아스피린과 이부프로펜(ibuprofen)을 비교해줘",
        "포도당(glucose)의 분자식과 분자량은?",
    ]

    for query in test_queries:
        print(f"\\n{'='*60}")
        print(f"🔬 질문: {query}")
        print('='*60)

        result = agent.invoke({"input": query})
        print(f"\\n📋 답변:\\n{result['output']}")
`,
      keyPoints: [
        'PubChem REST API로 화학물질 정보 무료 조회',
        '@tool 데코레이터로 LangChain Tool 정의',
        '도메인 전문 Agent 구현 패턴 학습',
        'Tool Calling으로 외부 API 자동 연동',
      ],
    }),

    // ========================================
    // Task 3: 법률 판례 검색 Agent (50분)
    // ========================================
    createCodeTask('w5d8-legal-agent', '법률 판례 검색 Agent', 50, {
      introduction: `
## 학습 목표

- 법률 도메인 특화 Agent를 구현한다
- 판례 검색 및 분석 자동화 방법을 익힌다
- fde-samples의 Legal RAG 프로젝트와 연계한다

## 법률 AI의 활용

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  법률 AI 활용 분야                                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 판례 검색: 유사 판례 빠른 탐색                           │
│  2. 계약 분석: 리스크 조항 자동 식별                         │
│  3. 법률 Q&A: 일반인 대상 법률 상담                          │
│  4. 문서 작성: 계약서, 소장 초안 생성                        │
│                                                              │
│  ⚠️ 주의: AI 결과는 참고용, 최종 판단은 전문가 필요          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`
`,
      codeExample: `"""
법률 판례 검색 Agent
====================

🎯 역할:
  - 판례 검색 및 요약
  - 법률 용어 설명
  - 관련 조항 참조

💡 데이터 소스:
  - 공공데이터포털 판례 API (샘플 데이터 사용)
  - fde-samples/phase3-knowledge-graph/week5-rag-basics/d1-legal-rag
"""

from typing import List, Dict, Any
from dataclasses import dataclass
import json

from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate


# ============================================
# 1. 샘플 판례 데이터 (실제로는 API/DB 연동)
# ============================================

SAMPLE_CASES = [
    {
        "case_number": "2023다12345",
        "court": "대법원",
        "date": "2023-06-15",
        "case_type": "민사",
        "title": "임대차보증금 반환 청구",
        "summary": "임대인이 임대차계약 종료 후 보증금을 반환하지 않은 사안에서, "
                   "임차인의 보증금반환청구권이 인정된 사례",
        "keywords": ["임대차", "보증금", "반환", "주택임대차보호법"],
        "result": "원고 승소"
    },
    {
        "case_number": "2022나67890",
        "court": "서울고등법원",
        "date": "2022-11-20",
        "case_type": "민사",
        "title": "손해배상 청구",
        "summary": "교통사고로 인한 손해배상 청구에서 과실비율과 손해액 산정 기준을 "
                   "제시한 사례",
        "keywords": ["손해배상", "교통사고", "과실", "위자료"],
        "result": "일부 인용"
    },
    {
        "case_number": "2023고단1111",
        "court": "서울중앙지방법원",
        "date": "2023-08-10",
        "case_type": "형사",
        "title": "사기 피고사건",
        "summary": "인터넷 중고거래 사기 사건에서 기망행위와 편취 의사의 인정 기준",
        "keywords": ["사기", "인터넷", "중고거래", "편취"],
        "result": "유죄 (징역 1년)"
    },
    {
        "case_number": "2021두2222",
        "court": "대법원",
        "date": "2021-05-27",
        "case_type": "행정",
        "title": "부당해고 구제재심판정 취소",
        "summary": "정리해고의 정당성 요건과 해고회피노력의 범위에 관한 판단 기준",
        "keywords": ["해고", "정리해고", "노동", "구제"],
        "result": "원고 패소"
    },
]

LEGAL_TERMS = {
    "임대차": "부동산이나 동산을 빌려주고 차임을 받는 계약. 민법 제618조 이하 규정.",
    "손해배상": "불법행위나 채무불이행으로 인한 손해를 금전으로 배상하는 것. 민법 제750조.",
    "과실상계": "피해자에게도 과실이 있는 경우 손해배상액을 감경하는 것. 민법 제396조.",
    "사기죄": "타인을 기망하여 재물을 편취하는 범죄. 형법 제347조.",
    "정리해고": "경영상 이유에 의한 해고. 근로기준법 제24조 요건 충족 필요.",
}


# ============================================
# 2. 법률 검색 Tools
# ============================================

@tool
def search_cases(keyword: str, case_type: str = None) -> str:
    """
    판례를 키워드로 검색합니다.

    Args:
        keyword: 검색 키워드 (예: "임대차", "손해배상", "해고")
        case_type: 사건 유형 필터 (민사, 형사, 행정, 가사 중 선택, 선택사항)

    Returns:
        검색된 판례 목록
    """
    results = []

    for case in SAMPLE_CASES:
        # 키워드 매칭
        keyword_match = (
            keyword in case["title"] or
            keyword in case["summary"] or
            keyword in case["keywords"]
        )

        # 사건 유형 필터
        type_match = (case_type is None or case["case_type"] == case_type)

        if keyword_match and type_match:
            results.append(case)

    if not results:
        return f"'{keyword}' 관련 판례를 찾을 수 없습니다."

    # 결과 포맷팅
    output = f"## '{keyword}' 관련 판례 ({len(results)}건)\\n\\n"

    for case in results:
        output += f"""
### {case['case_number']} ({case['court']})
- **일자**: {case['date']}
- **유형**: {case['case_type']}
- **제목**: {case['title']}
- **요약**: {case['summary']}
- **결과**: {case['result']}
- **키워드**: {', '.join(case['keywords'])}

---
"""

    return output


@tool
def explain_legal_term(term: str) -> str:
    """
    법률 용어를 설명합니다.

    Args:
        term: 설명이 필요한 법률 용어

    Returns:
        용어 설명
    """
    if term in LEGAL_TERMS:
        return f"## {term}\\n\\n{LEGAL_TERMS[term]}"

    # 유사 용어 검색
    similar = [t for t in LEGAL_TERMS.keys() if term in t or t in term]
    if similar:
        explanations = [f"- **{t}**: {LEGAL_TERMS[t]}" for t in similar]
        return f"## '{term}' 관련 용어\\n\\n" + "\\n".join(explanations)

    return f"'{term}'에 대한 설명을 찾을 수 없습니다. 전문 법률 상담을 권장합니다."


@tool
def get_case_detail(case_number: str) -> str:
    """
    판례 번호로 상세 정보를 조회합니다.

    Args:
        case_number: 판례 번호 (예: "2023다12345")

    Returns:
        판례 상세 정보
    """
    for case in SAMPLE_CASES:
        if case["case_number"] == case_number:
            return f"""
## {case['case_number']} 상세 정보

### 기본 정보
- **법원**: {case['court']}
- **선고일**: {case['date']}
- **사건유형**: {case['case_type']}

### 사건 내용
**{case['title']}**

{case['summary']}

### 판결
**{case['result']}**

### 관련 키워드
{', '.join(case['keywords'])}

---
⚠️ 이 정보는 참고용입니다. 법률 문제는 전문 변호사와 상담하세요.
"""

    return f"'{case_number}' 판례를 찾을 수 없습니다."


# ============================================
# 3. 법률 Agent 생성
# ============================================

def create_legal_agent():
    """
    🎯 역할: 법률 판례 검색 Agent 생성

    💡 기능:
      - 키워드 기반 판례 검색
      - 법률 용어 설명
      - 판례 상세 조회
    """
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    tools = [search_cases, explain_legal_term, get_case_detail]

    prompt = ChatPromptTemplate.from_messages([
        ("system", """당신은 법률 리서치 어시스턴트입니다.
판례 검색, 법률 용어 설명, 사건 분석을 도와드립니다.

중요 안내:
- 제공되는 정보는 참고용이며, 법적 조언이 아닙니다.
- 실제 법률 문제는 반드시 변호사와 상담하세요.
- 판례는 구체적 사안에 따라 다르게 적용될 수 있습니다.

한국어로 친절하게 설명해주세요."""),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}")
    ])

    agent = create_tool_calling_agent(llm, tools, prompt)
    return AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        max_iterations=5
    )


# ============================================
# 4. 실행 예제
# ============================================

if __name__ == "__main__":
    agent = create_legal_agent()

    test_queries = [
        "임대차 관련 판례 찾아줘",
        "손해배상이 뭐야?",
        "2023다12345 판례 상세 정보 알려줘",
        "교통사고 손해배상 관련 민사 판례 검색해줘",
    ]

    for query in test_queries:
        print(f"\\n{'='*60}")
        print(f"⚖️ 질문: {query}")
        print('='*60)

        result = agent.invoke({"input": query})
        print(f"\\n📋 답변:\\n{result['output']}")
`,
      keyPoints: [
        '법률 도메인 특화 Tool 구현 패턴',
        '판례 검색 및 법률 용어 설명 자동화',
        '면책 조항(Disclaimer) 포함 중요성',
        'fde-samples Legal RAG 프로젝트와 연계 가능',
      ],
    }),

    // ========================================
    // Task 4: 금융 분석 Agent (50분)
    // ========================================
    createCodeTask('w5d8-finance-agent', '금융 분석 Agent', 50, {
      introduction: `
## 학습 목표

- 금융 데이터 분석 Agent를 구현한다
- 야후 파이낸스 API 연동 방법을 익힌다
- 투자 분석 자동화의 기초를 학습한다

## 금융 AI 활용

| 분야 | 활용 예시 |
|------|----------|
| **주가 분석** | 기술적/기본적 분석 자동화 |
| **뉴스 분석** | 감성 분석, 이벤트 탐지 |
| **리포트 생성** | 투자 리서치 리포트 자동 작성 |
| **리스크 평가** | 포트폴리오 리스크 분석 |
`,
      codeExample: `"""
금융 분석 Agent
===============

🎯 역할:
  - 주가 조회 및 기본 분석
  - 재무 지표 계산
  - 투자 인사이트 제공

💡 데이터 소스:
  - yfinance 라이브러리 (야후 파이낸스)
  - 시뮬레이션 데이터 (API 없이 테스트용)
"""

from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import random

from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate


# ============================================
# 1. 금융 데이터 클라이언트 (시뮬레이션)
# ============================================

# 실제 사용 시 yfinance 설치 필요
# pip install yfinance

# 시뮬레이션 데이터 (API 없이 테스트용)
SIMULATED_STOCKS = {
    "005930.KS": {  # 삼성전자
        "name": "삼성전자",
        "price": 75000,
        "change": 2.3,
        "volume": 15000000,
        "market_cap": 450000000000000,
        "per": 15.2,
        "pbr": 1.8,
        "dividend_yield": 2.1,
        "sector": "반도체",
    },
    "000660.KS": {  # SK하이닉스
        "name": "SK하이닉스",
        "price": 180000,
        "change": -1.2,
        "volume": 5000000,
        "market_cap": 130000000000000,
        "per": 8.5,
        "pbr": 1.5,
        "dividend_yield": 1.0,
        "sector": "반도체",
    },
    "035720.KS": {  # 카카오
        "name": "카카오",
        "price": 45000,
        "change": 0.5,
        "volume": 8000000,
        "market_cap": 20000000000000,
        "per": 25.3,
        "pbr": 2.1,
        "dividend_yield": 0.3,
        "sector": "인터넷",
    },
    "AAPL": {  # Apple
        "name": "Apple",
        "price": 195.5,
        "change": 1.5,
        "volume": 50000000,
        "market_cap": 3000000000000,
        "per": 28.5,
        "pbr": 45.2,
        "dividend_yield": 0.5,
        "sector": "Technology",
    },
    "NVDA": {  # NVIDIA
        "name": "NVIDIA",
        "price": 875.0,
        "change": 3.2,
        "volume": 40000000,
        "market_cap": 2200000000000,
        "per": 65.3,
        "pbr": 35.8,
        "dividend_yield": 0.02,
        "sector": "Semiconductors",
    },
}

# 한글 종목명 → 심볼 매핑
NAME_TO_SYMBOL = {
    "삼성전자": "005930.KS",
    "삼성": "005930.KS",
    "SK하이닉스": "000660.KS",
    "하이닉스": "000660.KS",
    "카카오": "035720.KS",
    "애플": "AAPL",
    "엔비디아": "NVDA",
    "NVIDIA": "NVDA",
}


def get_symbol(name_or_symbol: str) -> Optional[str]:
    """이름 또는 심볼을 심볼로 변환"""
    if name_or_symbol in SIMULATED_STOCKS:
        return name_or_symbol
    return NAME_TO_SYMBOL.get(name_or_symbol)


# ============================================
# 2. 금융 Tools
# ============================================

@tool
def get_stock_price(stock: str) -> str:
    """
    주식의 현재가와 기본 정보를 조회합니다.

    Args:
        stock: 종목명 또는 심볼 (예: "삼성전자", "AAPL", "005930.KS")

    Returns:
        주가 및 기본 정보
    """
    symbol = get_symbol(stock)
    if not symbol or symbol not in SIMULATED_STOCKS:
        return f"'{stock}' 종목을 찾을 수 없습니다. 다른 이름으로 시도해주세요."

    data = SIMULATED_STOCKS[symbol]
    change_str = f"+{data['change']}%" if data['change'] > 0 else f"{data['change']}%"
    change_emoji = "📈" if data['change'] > 0 else "📉" if data['change'] < 0 else "➡️"

    # 원화 vs 달러 포맷
    volume_str = "{:,}".format(data['volume'])
    if ".KS" in symbol:
        price_str = "{:,}원".format(int(data['price']))
        mcap_str = "{:.1f}조원".format(data['market_cap']/1000000000000)
    else:
        price_str = "$" + "{:,.2f}".format(data['price'])
        mcap_str = "$" + "{:.1f}B".format(data['market_cap']/1000000000)

    return f"""
## {data['name']} ({symbol})

### 주가 정보 {change_emoji}
- **현재가**: {price_str}
- **등락률**: {change_str}
- **거래량**: {volume_str}주

### 기본 지표
- **시가총액**: {mcap_str}
- **PER**: {data['per']}배
- **PBR**: {data['pbr']}배
- **배당수익률**: {data['dividend_yield']}%
- **섹터**: {data['sector']}
"""


@tool
def compare_stocks(stock1: str, stock2: str) -> str:
    """
    두 종목의 투자 지표를 비교합니다.

    Args:
        stock1: 첫 번째 종목명/심볼
        stock2: 두 번째 종목명/심볼

    Returns:
        비교 분석 결과
    """
    sym1 = get_symbol(stock1)
    sym2 = get_symbol(stock2)

    if not sym1 or sym1 not in SIMULATED_STOCKS:
        return f"'{stock1}' 종목을 찾을 수 없습니다."
    if not sym2 or sym2 not in SIMULATED_STOCKS:
        return f"'{stock2}' 종목을 찾을 수 없습니다."

    d1 = SIMULATED_STOCKS[sym1]
    d2 = SIMULATED_STOCKS[sym2]

    return f"""
## {d1['name']} vs {d2['name']} 비교

| 지표 | {d1['name']} | {d2['name']} |
|------|-------------|-------------|
| 등락률 | {d1['change']}% | {d2['change']}% |
| PER | {d1['per']}배 | {d2['per']}배 |
| PBR | {d1['pbr']}배 | {d2['pbr']}배 |
| 배당수익률 | {d1['dividend_yield']}% | {d2['dividend_yield']}% |
| 섹터 | {d1['sector']} | {d2['sector']} |

### 분석 포인트
- **PER**: 낮을수록 저평가 가능성 (동일 섹터 비교 시)
- **PBR**: 1 미만이면 자산가치 대비 저평가
- **배당**: 안정적 수익 선호 시 높은 배당 선호

⚠️ 이 정보는 참고용이며, 투자 권유가 아닙니다.
"""


@tool
def analyze_valuation(stock: str) -> str:
    """
    종목의 밸류에이션(가치평가)을 분석합니다.

    Args:
        stock: 종목명 또는 심볼

    Returns:
        밸류에이션 분석 결과
    """
    symbol = get_symbol(stock)
    if not symbol or symbol not in SIMULATED_STOCKS:
        return f"'{stock}' 종목을 찾을 수 없습니다."

    data = SIMULATED_STOCKS[symbol]

    # 간단한 밸류에이션 점수 계산 (예시)
    per_score = 100 - min(data['per'] * 2, 100)  # PER 낮을수록 높은 점수
    pbr_score = 100 - min(data['pbr'] * 20, 100)  # PBR 낮을수록 높은 점수
    div_score = min(data['dividend_yield'] * 20, 100)  # 배당 높을수록 높은 점수
    total_score = (per_score + pbr_score + div_score) / 3

    if total_score >= 70:
        rating = "매수 고려 (저평가 가능성)"
        emoji = "🟢"
    elif total_score >= 50:
        rating = "중립 (적정 평가)"
        emoji = "🟡"
    else:
        rating = "주의 필요 (고평가 가능성)"
        emoji = "🔴"

    # 점수 포맷팅
    per_str = "{:.1f}".format(per_score)
    pbr_str = "{:.1f}".format(pbr_score)
    div_str = "{:.1f}".format(div_score)
    total_str = "{:.1f}".format(total_score)

    return f"""
## {data['name']} 밸류에이션 분석

### 지표별 점수 (100점 만점)
- **PER 점수**: {per_str}점 (낮을수록 좋음)
- **PBR 점수**: {pbr_str}점 (낮을수록 좋음)
- **배당 점수**: {div_str}점 (높을수록 좋음)

### 종합 평가 {emoji}
**점수**: {total_str}/100
**의견**: {rating}

### 참고 사항
- 이 분석은 단순 지표 기반이며, 성장성/업황은 미반영
- 동일 섹터 내 비교가 더 유의미함
- 투자 결정 전 종합적인 분석 필요

⚠️ 투자 권유가 아닌 참고 정보입니다.
"""


# ============================================
# 3. 금융 Agent 생성
# ============================================

def create_finance_agent():
    """
    🎯 역할: 금융 분석 Agent 생성

    💡 기능:
      - 주가 조회
      - 종목 비교
      - 밸류에이션 분석
    """
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    tools = [get_stock_price, compare_stocks, analyze_valuation]

    prompt = ChatPromptTemplate.from_messages([
        ("system", """당신은 금융 분석 어시스턴트입니다.
주식 정보 조회, 종목 비교, 밸류에이션 분석을 도와드립니다.

중요 안내:
- 제공되는 정보는 참고용이며, 투자 권유가 아닙니다.
- 실제 투자는 본인의 판단과 책임하에 진행하세요.
- 과거 실적이 미래 수익을 보장하지 않습니다.

한국어로 친절하게 설명해주세요."""),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}")
    ])

    agent = create_tool_calling_agent(llm, tools, prompt)
    return AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        max_iterations=5
    )


# ============================================
# 4. 실행 예제
# ============================================

if __name__ == "__main__":
    agent = create_finance_agent()

    test_queries = [
        "삼성전자 주가 알려줘",
        "삼성전자와 SK하이닉스 비교해줘",
        "애플 밸류에이션 분석해줘",
        "NVIDIA 현재 주가와 PER은?",
    ]

    for query in test_queries:
        print(f"\\n{'='*60}")
        print(f"💰 질문: {query}")
        print('='*60)

        result = agent.invoke({"input": query})
        print(f"\\n📋 답변:\\n{result['output']}")
`,
      keyPoints: [
        '금융 도메인 특화 Tool 구현',
        '주가 조회, 비교, 밸류에이션 분석 자동화',
        '투자 면책 조항 포함의 중요성',
        'yfinance 연동으로 실제 데이터 사용 가능',
      ],
    }),

    // ========================================
    // Task 5: MCP 실전 예제 (40분)
    // ========================================
    createCodeTask('w5d8-mcp-practical', 'MCP 실전 예제', 40, {
      introduction: `
## 학습 목표

- MCP(Model Context Protocol) 서버 구현 방법을 익힌다
- Claude Desktop과 연동하는 방법을 학습한다
- 실전에서 MCP를 활용하는 패턴을 이해한다

## MCP란?

**MCP (Model Context Protocol)**는 Anthropic이 개발한 프로토콜로, LLM이 외부 도구/데이터에 접근하는 표준화된 방식입니다.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    MCP 아키텍처                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Claude Desktop] ←─MCP─→ [MCP Server] ←─→ [데이터/API]     │
│                                                              │
│  MCP Server가 제공:                                          │
│  - Resources: 읽기 전용 데이터 (파일, DB 등)                 │
│  - Tools: 실행 가능한 함수                                   │
│  - Prompts: 프롬프트 템플릿                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`
`,
      codeExample: `"""
MCP 서버 예제: 금융 데이터 서버
================================

🎯 역할:
  - Claude Desktop에 금융 데이터 제공
  - 주가 조회, 분석 Tool 제공

💡 사용법:
  1. pip install mcp
  2. 이 파일 실행
  3. Claude Desktop 설정에 등록
"""

import asyncio
from mcp.server import Server
from mcp.types import Resource, Tool, TextContent
import mcp.server.stdio


# ============================================
# 1. MCP 서버 생성
# ============================================

server = Server("finance-data-server")


# 시뮬레이션 데이터
STOCKS = {
    "삼성전자": {"price": 75000, "change": 2.3, "per": 15.2},
    "SK하이닉스": {"price": 180000, "change": -1.2, "per": 8.5},
    "카카오": {"price": 45000, "change": 0.5, "per": 25.3},
}


# ============================================
# 2. Resources (읽기 전용 데이터)
# ============================================

@server.list_resources()
async def list_resources():
    """
    🎯 역할: 제공 가능한 Resource 목록 반환

    💡 Claude가 "어떤 데이터가 있는지" 파악할 때 호출
    """
    return [
        Resource(
            uri="stock://samsung",
            name="삼성전자 주가",
            description="삼성전자 실시간 주가 정보"
        ),
        Resource(
            uri="stock://skhynix",
            name="SK하이닉스 주가",
            description="SK하이닉스 실시간 주가 정보"
        ),
        Resource(
            uri="market://summary",
            name="시장 요약",
            description="오늘의 시장 요약 정보"
        ),
    ]


@server.read_resource()
async def read_resource(uri: str):
    """
    🎯 역할: Resource URI로 데이터 읽기

    💡 Claude가 특정 Resource를 요청할 때 호출
    """
    if uri == "stock://samsung":
        data = STOCKS["삼성전자"]
        price_str = "{:,}".format(data['price'])
        change_str = "{:+.1f}".format(data['change'])
        return TextContent(
            type="text",
            text=f"삼성전자: {price_str}원 ({change_str}%) PER: {data['per']}"
        )

    elif uri == "stock://skhynix":
        data = STOCKS["SK하이닉스"]
        price_str = "{:,}".format(data['price'])
        change_str = "{:+.1f}".format(data['change'])
        return TextContent(
            type="text",
            text=f"SK하이닉스: {price_str}원 ({change_str}%) PER: {data['per']}"
        )

    elif uri == "market://summary":
        return TextContent(
            type="text",
            text="오늘 KOSPI: 2,650.32 (+0.8%), KOSDAQ: 850.15 (+1.2%)"
        )

    return TextContent(type="text", text="알 수 없는 리소스")


# ============================================
# 3. Tools (실행 가능한 함수)
# ============================================

@server.list_tools()
async def list_tools():
    """
    🎯 역할: 제공 가능한 Tool 목록 반환

    💡 Claude가 "어떤 도구를 쓸 수 있는지" 파악할 때 호출
    """
    return [
        Tool(
            name="get_stock_price",
            description="주식 현재가를 조회합니다",
            inputSchema={
                "type": "object",
                "properties": {
                    "stock_name": {
                        "type": "string",
                        "description": "종목명 (예: 삼성전자, SK하이닉스)"
                    }
                },
                "required": ["stock_name"]
            }
        ),
        Tool(
            name="analyze_stock",
            description="주식의 간단한 분석을 수행합니다",
            inputSchema={
                "type": "object",
                "properties": {
                    "stock_name": {
                        "type": "string",
                        "description": "종목명"
                    }
                },
                "required": ["stock_name"]
            }
        ),
        Tool(
            name="compare_stocks",
            description="두 종목을 비교합니다",
            inputSchema={
                "type": "object",
                "properties": {
                    "stock1": {"type": "string", "description": "첫 번째 종목"},
                    "stock2": {"type": "string", "description": "두 번째 종목"}
                },
                "required": ["stock1", "stock2"]
            }
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict):
    """
    🎯 역할: Tool 실행

    💡 Claude가 Tool 호출을 결정했을 때 실행
    """
    if name == "get_stock_price":
        stock_name = arguments["stock_name"]
        if stock_name in STOCKS:
            data = STOCKS[stock_name]
            price_str = "{:,}".format(data['price'])
            change_str = "{:+.1f}".format(data['change'])
            return TextContent(
                type="text",
                text=f"{stock_name}: {price_str}원 ({change_str}%)"
            )
        return TextContent(type="text", text=f"{stock_name} 정보를 찾을 수 없습니다.")

    elif name == "analyze_stock":
        stock_name = arguments["stock_name"]
        if stock_name in STOCKS:
            data = STOCKS[stock_name]
            rating = "저평가" if data['per'] < 15 else "적정" if data['per'] < 25 else "고평가"
            price_str = "{:,}".format(data['price'])
            change_str = "{:+.1f}".format(data['change'])
            return TextContent(
                type="text",
                text=f"""
{stock_name} 분석:
- 현재가: {price_str}원
- PER: {data['per']}배 ({rating})
- 등락: {change_str}%
"""
            )
        return TextContent(type="text", text=f"{stock_name} 정보를 찾을 수 없습니다.")

    elif name == "compare_stocks":
        s1, s2 = arguments["stock1"], arguments["stock2"]
        if s1 in STOCKS and s2 in STOCKS:
            d1, d2 = STOCKS[s1], STOCKS[s2]
            p1_str = "{:,}".format(d1['price'])
            p2_str = "{:,}".format(d2['price'])
            c1_str = "{:+.1f}".format(d1['change'])
            c2_str = "{:+.1f}".format(d2['change'])
            return TextContent(
                type="text",
                text=f"""
{s1} vs {s2}:
- 가격: {p1_str}원 vs {p2_str}원
- PER: {d1['per']} vs {d2['per']}
- 등락: {c1_str}% vs {c2_str}%
"""
            )
        return TextContent(type="text", text="종목 정보를 찾을 수 없습니다.")

    return TextContent(type="text", text="알 수 없는 도구")


# ============================================
# 4. 서버 실행
# ============================================

async def main():
    """MCP 서버 실행"""
    print("🚀 Finance MCP Server 시작...")
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream)


if __name__ == "__main__":
    asyncio.run(main())


# ============================================
# 5. Claude Desktop 설정 예제
# ============================================

"""
Claude Desktop 설정 (claude_desktop_config.json):

Mac: ~/Library/Application Support/Claude/claude_desktop_config.json
Windows: %APPDATA%\\Claude\\claude_desktop_config.json

{
  "mcpServers": {
    "finance-data": {
      "command": "python",
      "args": ["/path/to/mcp_finance_server.py"],
      "env": {
        "PYTHONPATH": "/path/to/your/project"
      }
    }
  }
}

설정 후 Claude Desktop 재시작!
"""
`,
      keyPoints: [
        'MCP 서버로 Claude에 데이터/기능 제공',
        'Resources: 읽기 전용 데이터 (주가, 시장 요약 등)',
        'Tools: 실행 가능한 함수 (조회, 분석, 비교)',
        'Claude Desktop 설정으로 로컬 서버 연동',
      ],
    }),

    // ========================================
    // Task 6: 도메인 Agent 퀴즈 (30분)
    // ========================================
    createQuizTask('w5d8-domain-quiz', '도메인 Agent 이해도 점검', 30, {
      questions: [
        {
          id: 'da-q1',
          question: 'anythingLLM의 주요 장점은?',
          options: [
            '가장 빠른 LLM 추론 속도',
            '로컬 RAG를 올인원으로 쉽게 구축',
            '무제한 무료 API 호출',
            '자동 모델 학습 기능',
          ],
          correctAnswer: 1,
          explanation: 'anythingLLM은 LLM, 임베딩, Vector DB, UI를 통합하여 로컬 RAG를 쉽게 구축할 수 있게 해줍니다.',
        },
        {
          id: 'da-q2',
          question: 'PubChem API의 특징은?',
          options: [
            '유료 구독 필요',
            '의료 진단 목적으로만 사용 가능',
            '1억+ 화합물 정보 무료 제공',
            '한국어만 지원',
          ],
          correctAnswer: 2,
          explanation: 'PubChem은 NIH에서 운영하는 세계 최대의 무료 화학 정보 데이터베이스로, 1억+ 화합물 정보를 제공합니다.',
        },
        {
          id: 'da-q3',
          question: '도메인 특화 Agent 개발 시 반드시 포함해야 할 것은?',
          options: [
            '최신 GPU',
            '면책 조항 (Disclaimer)',
            '100% 정확도 보장',
            '유료 API 키',
          ],
          correctAnswer: 1,
          explanation: '법률, 금융, 의료 등 전문 분야 Agent는 "참고용이며 전문가 상담 필요" 등의 면책 조항을 반드시 포함해야 합니다.',
        },
        {
          id: 'da-q4',
          question: 'MCP(Model Context Protocol)에서 Tool과 Resource의 차이는?',
          options: [
            'Tool은 무료, Resource는 유료',
            'Tool은 실행, Resource는 읽기 전용',
            'Tool은 텍스트, Resource는 이미지',
            '차이 없음',
          ],
          correctAnswer: 1,
          explanation: 'Resource는 읽기 전용 데이터를 제공하고, Tool은 실행 가능한 함수를 제공합니다.',
        },
        {
          id: 'da-q5',
          question: '@tool 데코레이터의 역할은?',
          options: [
            'LLM 모델 로딩',
            '함수를 LangChain Tool로 변환',
            '데이터베이스 연결',
            '로깅 설정',
          ],
          correctAnswer: 1,
          explanation: '@tool 데코레이터는 일반 Python 함수를 LangChain Agent가 사용할 수 있는 Tool로 변환합니다.',
        },
      ],
    }),

    // ========================================
    // Task 7: 종합 Challenge (100분)
    // ========================================
    createChallengeTask('w5d8-domain-challenge', '도메인 특화 Agent 종합 과제', 100, {
      introduction: `
## 🎯 과제: 나만의 도메인 특화 Agent 구축

### 요구사항

1. **도메인 선택** (아래 중 택1)
   - 🔬 과학 연구: PubChem + 논문 검색
   - ⚖️ 법률: 판례 검색 + 법률 Q&A
   - 💰 금융: 주가 분석 + 뉴스 감성 분석
   - 🏥 의료: 의약품 정보 + 증상 체크 (면책 필수!)
   - 📚 교육: 학습 자료 추천 + 퀴즈 생성

2. **필수 구현 항목**
   - 최소 3개 이상의 Tool
   - LangGraph 또는 LangChain Agent 사용
   - 에러 핸들링
   - 면책 조항 (해당 시)

3. **선택 구현 항목**
   - anythingLLM 연동
   - MCP 서버 구현
   - 로컬 LLM (Ollama) 지원

### 제출물

1. \`my_domain_agent.py\` - Agent 코드
2. \`README.md\` - 사용 방법 문서
3. 실행 결과 스크린샷 5개
4. (선택) MCP 서버 코드

### 평가 기준

| 항목 | 배점 |
|------|------|
| Tool 구현 (3개+) | 30점 |
| Agent 동작 정확성 | 25점 |
| 에러 핸들링 | 15점 |
| 코드 품질/주석 | 15점 |
| 문서화 | 15점 |
| (보너스) MCP 연동 | +10점 |
`,
      hints: [
        '먼저 도메인을 정하고, 어떤 Tool이 필요한지 리스트업',
        '@tool 데코레이터로 Tool 정의 후 Agent에 바인딩',
        '각 Tool의 docstring을 명확하게 작성 (LLM이 참조)',
        'API 호출 실패 시 대체 응답 제공 (try-except)',
        '면책 조항은 system prompt와 응답 모두에 포함',
      ],
    }),
  ],
}
