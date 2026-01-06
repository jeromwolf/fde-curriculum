# FDE Academy Curriculum

> Forward Deployed Engineer 양성 과정 커리큘럼 웹사이트

## 배포 URL

**임시 사이트**: https://fde-curriculum-simple.vercel.app

> 업무 협업 및 커리큘럼 검토용 임시 사이트입니다.

## 프로젝트 개요

FDE (Forward Deployed Engineer) 교육 플랫폼의 커리큘럼을 웹으로 제공하는 사이트입니다.

### 커리큘럼 구성 (v2.2)

| Phase | 주제 | 기간 | 주요 내용 |
|-------|------|------|----------|
| 1 | 데이터 엔지니어링 기초 | 2개월 | Python 심화, SQL, Spark, Airflow, dbt |
| 2 | 데이터 분석 & 컨설팅 | 2개월 | EDA, ML, Feature Engineering, 경영진 발표 |
| 3 | Knowledge Graph | 2개월 | Neo4j, Cypher, GraphRAG, LLM 통합 |
| 4 | 클라우드 & 인프라 | 2개월 | AWS, Docker, Kubernetes, Terraform |
| 5 | GenAI & AI Agents | 2개월 | LLM, RAG, AI Agent, MCP |
| 6 | 산업별 프로젝트 | 2개월 | 금융/의료/제조 도메인, 캡스톤 |

### 특별 과정

- **Palantir Foundry 스페셜**: 2개월 집중 과정 (메인 과정 수료 후)

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Markdown**: react-markdown, remark-gfm
- **Typography**: @tailwindcss/typography
- **Deployment**: Vercel

## 주간 콘텐츠 제작 현황

> Phase 3 (Knowledge Graph)에 대한 요청이 많아 여기부터 콘텐츠를 제작 중입니다.

### Phase 3: Knowledge Graph (우선 제작)

| Week | 주제 | 상태 | Tasks |
|------|------|------|-------|
| 1 | 그래프 이론 & Neo4j 입문 | **완료** | 49개 (video 12, reading 9, code 18, quiz 10) |
| 2 | Cypher 심화 & 패턴 매칭 | 대기 | - |
| 3 | 온톨로지 기초 (RDF/OWL) | 대기 | - |
| 4 | SPARQL & Triple Store | 대기 | - |
| 5 | Knowledge Graph 구축 | 대기 | - |
| 6 | 그래프 알고리즘 | 대기 | - |
| 7 | GraphRAG & LLM 통합 | 대기 | - |
| 8 | 캡스톤 프로젝트 | 대기 | - |

### Week 1 상세 (그래프 이론 & Neo4j 입문)

| Day | 주제 | 시간 |
|-----|------|------|
| 1 | 그래프 데이터 모델 기초 | 150분 |
| 2 | Neo4j 환경 설정 & 첫 실행 | 140분 |
| 3 | Cypher 기초 CRUD | 160분 |
| 4 | Cypher 패턴 매칭 | 150분 |
| 5 | Weekly Project: 소셜 네트워크 그래프 | 180분 |

**총 학습 시간**: 720분 (12시간)

## 프로젝트 구조

```
fde-curriculum-simple/
├── app/
│   ├── page.tsx              # 메인 커리큘럼 페이지
│   └── phase/[id]/page.tsx   # Phase 상세 페이지
├── lib/curriculum/
│   ├── index.ts              # 커리큘럼 진입점
│   ├── types.ts              # 타입 정의
│   └── weeks/
│       ├── python-advanced.ts # Phase 1 Week 1
│       └── graph-intro.ts     # Phase 3 Week 1 (146KB)
├── docs/
│   ├── PHASE1_DETAILED.md    # Phase 1 상세 커리큘럼
│   ├── PHASE2_DETAILED.md    # Phase 2 상세 커리큘럼
│   ├── PHASE3_DETAILED.md    # Phase 3 상세 커리큘럼
│   ├── PHASE4_DETAILED.md    # Phase 4 상세 커리큘럼
│   ├── PHASE5_DETAILED.md    # Phase 5 상세 커리큘럼
│   ├── PHASE6_DETAILED.md    # Phase 6 상세 커리큘럼
│   └── SIMULATORS.md         # 시뮬레이터 목록
└── CLAUDE.md                 # 개발 로그
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## v2.6 주요 변경 사항 (2026-01-07)

- **Week 5 Day 7-8 추가** (LangGraph Agent, Domain Agents)
  - Day 7: LangGraph 심화 (StateGraph, ReAct, Multi-agent) - 5시간
  - Day 8: 도메인 Agent (anythingLLM, PubChem, 법률, 금융, MCP) - 6시간
- **Week 5 총 학습시간**: 26시간 → 37시간 (8 Days)
- **YouTube 썸네일 수정**: maxresdefault → hqdefault (404 문제 해결)

## v2.5 주요 변경 사항 (2026-01-06)

- **Week 5 Day 2 콘텐츠 대폭 보강**
  - `w5d2-chroma-production`: 학습 목표, 아키텍처 다이어그램, HNSW 파라미터표, LangChain 연동
  - `w5d2-pinecone-production`: 학습 목표, Serverless vs Pod 비교, 네임스페이스 가이드
- **YouTube 영상 2개 추가**
  - 임베딩의 역사와 수학적 원리
  - 벡터 데이터베이스 심층 이해
- **코드 품질 개선**: 모든 메서드에 상세 docstring (🎯 역할, 💡 설명)

## v2.3 주요 변경 사항 (2025-12-24)

- **퀴즈 정답 체크 기능**: 즉시 피드백, 다시 풀기
- **YouTube 영상 플레이어**: 썸네일 + 링크 방식
- **학습 페이지 인증 표시**: 로그인 상태 통일
- **콘텐츠 보강**: property-graph, graph-vs-rdb (사기 탐지 예제)
- **YouTube 영상 4개 연결**: 실제 강의 영상

## v2.2 주요 변경 사항 (2025-12-06)

- Phase 연결 가이드 추가 (각 Phase "왜 배우는가")
- dbt 기초 추가 (Phase 1 Week 7.5)
- 비용 추정 가이드 추가 ($1,100~$3,700)
- Phase 2에 컨설팅 역량 통합
- Phase 3 실무화 (Neo4j/Cypher + GraphRAG)

## 관련 프로젝트

- **kss-ontology**: 온톨로지 기반 투자 인사이트 서비스
- **flux-ontology**: Palantir Foundry 클론 프로젝트

---

*FDE Academy - Forward Deployed Engineer 양성 과정*
