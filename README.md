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

## 프로젝트 구조

```
fde-curriculum-simple/
├── app/
│   ├── page.tsx              # 메인 커리큘럼 페이지
│   └── phase/[id]/page.tsx   # Phase 상세 페이지
├── docs/
│   ├── PHASE1_DETAILED.md    # Phase 1 상세 커리큘럼
│   ├── PHASE2_DETAILED.md    # Phase 2 상세 커리큘럼
│   ├── PHASE3_DETAILED.md    # Phase 3 상세 커리큘럼
│   ├── PHASE4_DETAILED.md    # Phase 4 상세 커리큘럼
│   ├── PHASE5_DETAILED.md    # Phase 5 상세 커리큘럼
│   ├── PHASE6_DETAILED.md    # Phase 6 상세 커리큘럼
│   └── SIMULATORS.md         # 시뮬레이터 목록
└── ...
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
