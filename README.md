# FDE Academy Curriculum

> Forward Deployed Engineer 양성 과정 커리큘럼 웹사이트

## 배포 URL

- **프로덕션**: https://fde-academy.ai.kr
- **Vercel**: https://fde-curriculum-simple.vercel.app
- **Cloud Run**: https://fde-academy-827760573017.asia-northeast3.run.app

## 프로젝트 개요

FDE (Forward Deployed Engineer) 교육 플랫폼의 커리큘럼을 웹으로 제공하는 사이트입니다.

### 커리큘럼 구성 (v2.7)

| Phase | 주제 | 기간 | 주요 내용 | 상태 |
|-------|------|------|----------|------|
| 1 | 데이터 엔지니어링 기초 | 2개월 | Python 심화, SQL, Spark, Airflow, dbt | ✅ 완료 |
| 2 | 데이터 분석 & 컨설팅 | 2개월 | EDA, ML, Feature Engineering, 경영진 발표 | ✅ 완료 |
| 3 | Knowledge Graph | 2개월 | Neo4j, Cypher, GraphRAG, LLM 통합 | ✅ 완료 |
| 4 | 클라우드 & 인프라 | 2개월 | AWS, Docker, Kubernetes, Terraform | ✅ 완료 |
| 5 | GenAI & AI Agents | 2개월 | LLM, RAG, AI Agent, MCP | ✅ 완료 |
| 6 | 산업 프로젝트 & 캡스톤 | 2개월 | 도메인 선택, KG, RAG, Agent, 배포, 발표 | ✅ 완료 |

**총: 48주 (12개월) 전체 커리큘럼 완료!** 🎉

### Phase 6 상세 (산업 프로젝트 & 캡스톤)

| Week | 주제 | 내용 |
|------|------|------|
| 1 | 산업 도메인 선택 | 금융(FIBO), 헬스케어(FHIR), 제조(OPC-UA) |
| 2 | 프로젝트 정의 | PRD, 아키텍처 설계, PoC |
| 3 | 데이터 파이프라인 | Airflow, Great Expectations |
| 4 | Knowledge Graph | Neo4j, Triple 추출, 추론 규칙 |
| 5 | AI/RAG 시스템 | GraphRAG, RAGAS 평가 |
| 6 | Agent 시스템 | LangGraph, Multi-Agent |
| 7 | 프론트엔드 & 배포 | Next.js, Docker, CI/CD |
| 8 | 문서화 & 발표 | 포트폴리오, 데모 |

### 특별 과정

- **Palantir Foundry 스페셜**: 2개월 집중 과정 (메인 과정 수료 후)

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Markdown**: react-markdown, remark-gfm
- **Typography**: @tailwindcss/typography
- **Deployment**: Vercel

## 커리큘럼 완성 현황

**전체 커리큘럼 완료!** 🎉

| Phase | 주제 | 상태 | Weeks |
|-------|------|------|-------|
| 1 | 데이터 엔지니어링 기초 | ✅ 완료 | 8주 |
| 2 | 데이터 분석 & 컨설팅 | ✅ 완료 | 8주 |
| 3 | Knowledge Graph | ✅ 완료 | 8주 |
| 4 | 클라우드 & 인프라 | ✅ 완료 | 8주 |
| 5 | GenAI & AI Agents | ✅ 완료 | 8주 |
| 6 | 산업 프로젝트 & 캡스톤 | ✅ 완료 | 8주 |

**총: 48주 (12개월) 커리큘럼**

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

## v2.7 주요 변경 사항 (2026-01-13)

- **Phase 6 (산업 프로젝트 & 캡스톤) 전체 커리큘럼 추가**
  - 8주 프로젝트 중심 커리큘럼
  - 금융/헬스케어/제조 도메인 선택
  - GitHub 참조 링크 50+ 개 포함
- **전체 커리큘럼 완료**: 48주 (12개월) 100%

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

*최종 업데이트: 2026-01-13*
