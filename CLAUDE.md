# FDE Academy - 개발 로그

## 2026-01-07: Week 5 Day 7-8 추가 (LangGraph Agent, Domain Agents)

### 🎯 목표
vibecodingcamp7.com 벤치마킹 결과, LangGraph 심화 및 도메인 특화 Agent 콘텐츠 추가

### ✅ 완료된 작업

#### 1. Day 7: LangGraph Agent 심화 (300분/5시간)

| Task ID | 제목 | 시간 |
|---------|------|------|
| `w5d7-langgraph-intro` | LangGraph 개념과 아키텍처 | 40분 |
| `w5d7-langgraph-basic` | LangGraph 기본 Agent 구현 | 50분 |
| `w5d7-langgraph-advanced` | LangGraph 고급 패턴 | 50분 |
| `w5d7-langgraph-research` | LangGraph 리서치 Agent 구현 | 60분 |
| `w5d7-langgraph-quiz` | LangGraph 이해도 점검 | 30분 |
| `w5d7-langgraph-challenge` | LangGraph 실전 과제 | 70분 |

**주요 내용**:
- StateGraph, Node, Edge 개념
- ReAct Agent 구현
- 병렬 실행, Human-in-the-Loop, Multi-agent
- Reflection 패턴 리서치 Agent

#### 2. Day 8: 도메인 특화 Agent & 실전 도구 (360분/6시간)

| Task ID | 제목 | 시간 |
|---------|------|------|
| `w5d8-anythingllm` | anythingLLM: 올인원 로컬 AI 플랫폼 | 30분 |
| `w5d8-pubchem-agent` | PubChem 화학물질 검색 Agent | 60분 |
| `w5d8-legal-agent` | 법률 판례 검색 Agent | 50분 |
| `w5d8-finance-agent` | 금융 분석 Agent | 50분 |
| `w5d8-mcp-practical` | MCP 실전 예제 | 40분 |
| `w5d8-domain-quiz` | 도메인 Agent 이해도 점검 | 30분 |
| `w5d8-domain-challenge` | 도메인 특화 Agent 종합 과제 | 100분 |

**주요 내용**:
- anythingLLM Docker 배포
- PubChem API 연동
- LangChain Tool 패턴
- MCP (Model Context Protocol) Resources, Tools, Prompts

#### 3. YouTube 썸네일 수정

- `maxresdefault.jpg` → `hqdefault.jpg` 변경
- 일부 영상에서 maxresdefault가 404 반환하는 문제 해결

#### 4. YouTube URL 추가

| Task ID | YouTube URL |
|---------|-------------|
| `w5d2-chroma-production` | https://youtu.be/8kriJ2Awoas |

### 📁 수정/추가된 파일

- `lib/curriculum/weeks/week5-rag-basics/day7-langgraph-agent.ts` (NEW)
- `lib/curriculum/weeks/week5-rag-basics/day8-domain-agents.ts` (NEW)
- `lib/curriculum/weeks/week5-rag-basics/index.ts` (UPDATED)
- `app/learn/task/[taskId]/page.tsx` (UPDATED - 썸네일 수정)
- `lib/curriculum/weeks/week5-rag-basics/day2-embeddings-vectordb.ts` (UPDATED)

### 📊 Week 5 최종 구성

| Day | 주제 | 시간 |
|-----|------|------|
| 1 | RAG 아키텍처 개요 | 4h |
| 2 | 임베딩 & 벡터 DB | 4h |
| 3 | 청킹 전략 & 검색 최적화 | 4h |
| 4 | LangChain RAG 파이프라인 | 4h |
| 5 | 프로덕션 RAG 시스템 | 5h |
| 6 | 로컬 LLM과 RAG 통합 (sLLM) | 5h |
| **7** | **LangGraph Agent 심화** | **5h** |
| **8** | **도메인 특화 Agent & 실전 도구** | **6h** |

**총 학습 시간**: 37시간

---

## 2026-01-06: Week 5 Day 2 콘텐츠 대폭 보강

### 🎯 목표
Week 5 (RAG 기초) Day 2 (Embeddings & Vector DB) 실습 콘텐츠 품질 향상

### ✅ 완료된 작업

#### 1. YouTube URL 추가

| Task ID | 제목 | YouTube URL |
|---------|------|-------------|
| `w5d2-embeddings-history` | 임베딩의 역사와 수학적 원리 | https://www.youtube.com/watch?v=pBmj-HgUO1Y |
| `w5d2-vectordb-deep` | 벡터 데이터베이스 심층 이해 | https://youtu.be/ShzjGfzTC1E |

#### 2. Chroma 프로덕션 코드 콘텐츠 보강 (`w5d2-chroma-production`)

**추가된 내용**:
| 항목 | 설명 |
|------|------|
| 학습 목표 | 4가지 핵심 학습 목표 |
| Chroma 아키텍처 다이어그램 | Client → Collection → Documents/Embeddings/Metadata 구조 |
| 클라이언트 모드 비교표 | EphemeralClient vs PersistentClient vs HttpClient |
| HNSW 파라미터 가이드표 | M, ef_construction, ef_search 설명 |
| 클래스 구조도 | ChromaVectorStore 전체 메서드 시각화 |
| 상세 docstring | 모든 메서드에 🎯 역할, 💡 설명, Args, Returns 추가 |
| LangChain 연동 아키텍처 | Chroma + LangChain 통합 다이어그램 |
| 검색 방식 비교표 | similarity vs mmr vs similarity_score_threshold |
| 서버 모드 선택 가이드 | 용도별 권장 모드 |

#### 3. Pinecone 프로덕션 코드 콘텐츠 보강 (`w5d2-pinecone-production`)

**추가된 내용**:
| 항목 | 설명 |
|------|------|
| 학습 목표 | 4가지 핵심 학습 목표 |
| Pinecone 아키텍처 다이어그램 | Project → Index → Namespace → Vector 구조 |
| Serverless vs Pod 비교표 | 배포 방식별 특징 및 코드 예제 |
| 클래스 구조도 | PineconeVectorStore 전체 메서드 시각화 |
| 상세 docstring | 모든 메서드에 🎯 역할, 💡 설명, Args, Returns 추가 |
| 네임스페이스 활용 가이드 | 멀티테넌트 구현 다이어그램 |
| LangChain 연동 가이드 | 2가지 연결 방식 비교표 |

### 📁 수정된 파일

- `lib/curriculum/weeks/week5-rag-basics/day2-embeddings-vectordb.ts`
  - `w5d2-embeddings-history`: videoUrl 추가
  - `w5d2-vectordb-deep`: videoUrl 추가
  - `w5d2-chroma-production`: 학습 목표, 아키텍처, 상세 코드 주석
  - `w5d2-pinecone-production`: 학습 목표, 아키텍처, 상세 코드 주석

### 💡 개선 효과

**Before**: 소스 코드만 있고 설명이 부족
**After**:
- 학습자가 코드의 목적과 구조를 명확히 이해
- ASCII 다이어그램으로 아키텍처 시각화
- 비교표로 옵션 선택 가이드 제공
- 한국어 주석으로 학습 접근성 향상

---

## 2025-12-31: 리더보드 & 게이미피케이션 시스템 구현

### 🎯 목표
학습 동기 부여를 위한 포인트/뱃지/리더보드 시스템 구현

### ✅ 완료된 작업

#### 1. Prisma 스키마 확장

**새로 추가된 모델**:
| 모델 | 설명 |
|------|------|
| `PointHistory` | 포인트 획득/차감 이력 |
| `Badge` | 뱃지 정의 (16개) |
| `UserBadge` | 사용자 획득 뱃지 |
| `Streak` | 연속 학습 추적 |
| `UserLevel` | 사용자 레벨/순위 (캐시 테이블) |

**마이그레이션**: `20251231022255_add_gamification`

#### 2. 포인트 시스템

| 활동 | 포인트 |
|------|--------|
| 비디오 시청 완료 | +10 |
| 읽기 자료 완료 | +5 |
| 코딩 과제 완료 | +20 |
| 퀴즈 완료 | +15 |
| 퀴즈 만점 보너스 | +10 |
| 주간 완료 | +50 |
| Phase 완료 | +200 |
| 연속 학습 보너스 | 일수 x 5 |

**레벨 공식**: `level = floor(sqrt(points / 50)) + 1`

#### 3. 뱃지 시스템 (16개)

**Milestone**:
- 첫 발걸음 (첫 로그인)
- 시작이 반 (첫 태스크 완료)
- 주간 정복자 (첫 주차 완료)
- Phase 마스터 (첫 Phase 완료)

**Streak**:
- 일주일 전사 (7일 연속)
- 2주의 끈기 (14일 연속)
- 한 달의 헌신 (30일 연속)
- 백일의 전설 (100일 연속)

**Mastery**:
- 완벽주의자 (퀴즈 만점)
- 퀴즈 마스터 (10개 퀴즈 만점)
- 코드 닌자 (50개 코딩 완료)

**Community**:
- 목소리를 내다 (첫 게시글)
- 도움의 손길 (도움된 댓글 10개)

**Special**:
- 얼리 어답터 (베타 테스터)
- FDE 마스터 (전체 완료)

**뱃지 등급**: COMMON → UNCOMMON → RARE → EPIC → LEGENDARY

#### 4. API 엔드포인트

| 엔드포인트 | 설명 |
|------------|------|
| `GET /api/leaderboard` | 리더보드 조회 (순위, 포인트, 뱃지) |
| `GET /api/user/gamification` | 내 게이미피케이션 프로필 |
| `POST /api/admin/seed-badges` | 뱃지 초기 데이터 시딩 |

#### 5. 리더보드 UI (`/leaderboard`)

**기능**:
- 전체 순위 테이블 (Top 50)
- 사용자별 레벨, 포인트, 연속학습일, 뱃지 표시
- 내 현황 카드 (로그인 시)
  - 레벨 & 다음 레벨 진행률
  - 총 포인트
  - 연속 학습 (🔥 스트릭)
  - 획득 뱃지 목록
- 포인트 획득 방법 가이드
- 뱃지 등급 범례

#### 6. 학습 완료 시 자동 포인트 지급

`app/api/progress/route.ts` 수정:
- 태스크 완료 시 `awardTaskPoints()` 호출
- 중복 지급 방지 (이미 완료된 태스크)
- 퀴즈 만점 보너스 자동 지급
- 연속 학습 자동 업데이트

### 📁 신규/수정 파일

**스키마**:
- `prisma/schema.prisma` - 게이미피케이션 모델 추가

**서비스**:
- `lib/services/gamification.ts` (NEW) - 포인트/뱃지/리더보드 로직

**API**:
- `app/api/leaderboard/route.ts` (NEW)
- `app/api/user/gamification/route.ts` (NEW)
- `app/api/admin/seed-badges/route.ts` (NEW)
- `app/api/progress/route.ts` - 포인트 자동 지급 연동

**UI**:
- `app/leaderboard/page.tsx` (NEW) - 리더보드 페이지
- `components/learn/Navigation.tsx` - 리더보드 링크 추가

### 🚀 배포 (v2.4)

```bash
# 이미지 빌드
gcloud builds submit --tag gcr.io/kss-platform-jerom-2024/fde-academy:v2.4 --project=kss-platform-jerom-2024

# Cloud Run 배포
gcloud run deploy fde-academy \
  --image=gcr.io/kss-platform-jerom-2024/fde-academy:v2.4 \
  --region=asia-northeast3 \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --port=3000 \
  --project=kss-platform-jerom-2024
```

**배포 이력**:
| 날짜 | 버전 | 리비전 | 변경사항 |
|------|------|--------|---------|
| 2025-12-31 | v2.4 | fde-academy-00008-92c | 리더보드, 포인트/뱃지 시스템 |
| 2025-12-24 | v2.3 | fde-academy-00028-pmv | 퀴즈 기능, YouTube 플레이어 |

### 🔗 접속 URL

- **리더보드**: https://fde-academy.ai.kr/leaderboard
- **메인**: https://fde-academy.ai.kr

---

## 2025-12-29: 커리큘럼 현황 최신화

### 📊 현재 커리큘럼 완성도

**Phase 3 (Knowledge Graph) - 8주 전체 완료!**

| Week | 제목 | 파일 | Tasks | 학습시간 |
|------|------|------|-------|----------|
| 1 | 그래프 이론 & Neo4j 입문 | `graph-intro.ts` (167KB) | 49개 | 12시간 |
| 2 | Cypher 심화 & 데이터 모델링 | `week2-cypher-modeling/` | 52개 | 19시간 |
| 3 | 그래프 알고리즘 | `week3-graph-algorithms/` | ~50개 | 18시간 |
| 4 | Entity Resolution | `week4-entity-resolution/` | ~50개 | 18시간 |
| 5 | RAG 기초 | `week5-rag-basics/` | ~50개 | 18시간 |
| 6 | GraphRAG | `week6-graph-rag/` | ~50개 | 18시간 |
| 7 | Text2Cypher | `week7-text2cypher/` | ~50개 | 18시간 |
| 8 | KG 프로젝트 | `week8-kg-project/` | ~50개 | 20시간 |

**Phase 1 (데이터 엔지니어링 기초)**
| Week | 제목 | 상태 |
|------|------|------|
| 1 | Python 심화 | ✅ `python-advanced.ts` |
| 2-8 | 미작성 | ❌ |

**전체 현황**:
```
Phase 1: 1/8주 완료 (12.5%)
Phase 2: 0/8주 완료 (0%)
Phase 3: 8/8주 완료 (100%) ✅
Phase 4: 0/8주 완료 (0%)
Phase 5: 0/8주 완료 (0%)
Phase 6: 0/8주 완료 (0%)

총: 48주 중 9주 완료 (약 19%)
```

### 🔗 시뮬레이터 연계 (KSS-Ontology)

| Week | 시뮬레이터 | URL |
|------|-----------|-----|
| Week 2 | Cypher Playground | `/simulators/cypher-playground` |
| Week 3 | Graph Algorithms | `/simulators/graph-algorithms` |
| Week 5 | Embedding Visualizer | `/simulators/embedding-visualizer` |
| Week 6 | GraphRAG Pipeline | `/simulators/graphrag-pipeline` |
| Week 7 | Text2Cypher | `/simulators/text2cypher` |

### 🚀 배포 현황

| 환경 | URL | 상태 |
|------|-----|------|
| 프로덕션 | https://fde-academy.ai.kr | ✅ 운영 중 |
| Vercel | https://fde-curriculum-simple.vercel.app | ✅ 운영 중 |
| Cloud Run | https://fde-academy-827760573017.asia-northeast3.run.app | ✅ 운영 중 |

### 📁 주요 파일 구조

```
lib/curriculum/
├── index.ts              # 메인 진입점 (9개 Week 등록)
├── types.ts              # 타입 정의
├── packages.ts           # 패키지 정보
└── weeks/
    ├── python-advanced.ts     # Phase 1 Week 1
    ├── graph-intro.ts         # Phase 3 Week 1 (167KB)
    ├── cypher-modeling.ts     # Phase 3 Week 2 (구버전)
    ├── week2-cypher-modeling/ # Phase 3 Week 2 (신버전)
    ├── week3-graph-algorithms/
    ├── week4-entity-resolution/
    ├── week5-rag-basics/
    ├── week6-graph-rag/
    ├── week7-text2cypher/
    └── week8-kg-project/
```

### 🔄 최근 주요 커밋

```
57596b0 refactor: Week 2-8 전체 CodeTask 템플릿 패턴 적용
5b62764 refactor: Day 6 콘텐츠 템플릿 적용 및 Week 완료 버튼 수정
0c5173b feat: Pyodide Python 실행 기능 및 Week 5 Day 6 sLLM 콘텐츠 추가
c460f11 feat: Week 3-7 커리큘럼에 시뮬레이터 연계 추가
938a08e feat: Week 5 RAG 기초로 변경 (RDF/OWL 삭제)
```

### 📋 다음 작업

1. **Phase 1 Week 2-8 콘텐츠 제작**
   - SQL 기초, 데이터 파이프라인, dbt, Airflow 등

2. **Phase 2 전체 콘텐츠 제작**
   - ML/데이터 분석 기초

3. **영상 제작**
   - 각 Week의 video task에 실제 YouTube 영상 연결

4. **퀴즈 시스템 고도화**
   - 점수 DB 저장
   - 오답 노트 기능

---

## 2025-12-24: UI 개선, 퀴즈 기능, 콘텐츠 보강

### 완료된 작업

1. **Navigation 한글화** (`components/learn/Navigation.tsx`)
   - "All Courses" → "전체 과정"
   - "Certifications" → "자격증"
   - "Sign In" → AuthButton 컴포넌트로 교체

2. **학습 페이지 인증 상태 표시**
   - `/learn/phase/*` 페이지: AuthButton 추가
   - `/learn/task/*` 페이지: AuthButton 추가
   - 로그인 시 사용자 프로필 표시 (메인 페이지와 동일)

3. **YouTube 영상 플레이어** (`app/learn/task/[taskId]/page.tsx`)
   - videoUrl에서 YouTube ID 자동 추출
   - 썸네일 + 재생 버튼 방식으로 구현
   - 클릭 시 YouTube 새 탭에서 열림

4. **퀴즈 정답 체크 기능** (`app/learn/task/[taskId]/page.tsx`)
   - 즉시 정답/오답 피드백 (색상 표시)
   - 정답: 초록, 오답: 빨강 테두리
   - 해설 자동 표시
   - 진행 상황 표시 (예: "진행: 2/5 | 정답: 1개")
   - 최종 결과 카드 (완벽해요/잘했어요/다시 도전해보세요)
   - "다시 풀기" 버튼

5. **콘텐츠 개선**
   - `graph-vs-rdb-video`: 친구의 친구 예제 → **사기 탐지(Ring Fraud)** 예제로 변경 (중복 제거)
   - `property-graph-video`: 내용 대폭 보강
     - Property Graph 시각적 다이어그램
     - 노드/관계/속성 상세 설명
     - 데이터 타입 표
     - Property Graph vs RDF 비교
     - 도메인별 모델링 예시 4가지

6. **YouTube URL 추가**
   - `graph-intro-video`: vY0-BcEz1_0
   - `graph-vs-rdb-video`: Axdg3avChI8
   - `property-graph-video`: JNhDJTVdGnY
   - `realworld-cases-video`: GMaNgYPBaM4

### 🚀 Google Cloud Run 배포 (v2.3)

**배포 URL**: https://fde-academy.ai.kr

**배포 명령어**:
```bash
# 1. 이미지 빌드 (Cloud Build)
gcloud builds submit --tag gcr.io/kss-platform-jerom-2024/fde-academy:v2.3 --project=kss-platform-jerom-2024

# 2. Cloud Run 배포
gcloud run deploy fde-academy \
  --image=gcr.io/kss-platform-jerom-2024/fde-academy:v2.3 \
  --region=asia-northeast3 \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --port=3000 \
  --project=kss-platform-jerom-2024
```

**배포 정보**:
- **프로젝트**: kss-platform-jerom-2024
- **리전**: asia-northeast3 (서울)
- **서비스명**: fde-academy
- **메모리**: 512Mi
- **CPU**: 1
- **포트**: 3000

**도메인 설정**:
- Cloud Run URL: https://fde-academy-827760573017.asia-northeast3.run.app
- 커스텀 도메인: https://fde-academy.ai.kr (이미 설정됨)

**주의사항**:
1. `gcloud run deploy --source .` 사용 시 간헐적 실패 발생
2. 해결책: 빌드와 배포를 분리하여 실행
   - `gcloud builds submit` → 이미지 빌드
   - `gcloud run deploy --image=...` → 이미지 배포
3. 타입 에러 발생 시 `types/prismjs.d.ts` 파일 확인

**배포 이력**:
| 날짜 | 버전 | 리비전 | 변경사항 |
|------|------|--------|---------|
| 2025-12-24 | v2.3 | fde-academy-00028-pmv | 퀴즈 기능, YouTube 플레이어, 콘텐츠 보강 |

---

### 🔴 백로그: YouTube 임베딩 문제

**현상:**
- YouTube iframe 임베딩 시 "오류 153 - 동영상 플레이어 구성 오류" 발생
- 모든 영상에서 동일 (본인 영상, 타인 영상 모두)
- 직접 YouTube 링크는 정상 작동

**시도한 방법:**
1. `youtube.com/embed/` → 실패
2. `youtube-nocookie.com/embed/` → 실패
3. iframe 속성 추가 (referrerPolicy, allow 등) → 실패
4. 시크릿 모드, 다른 브라우저 → 실패

**추정 원인:**
- 네트워크/방화벽 레벨 차단
- 브라우저 확장 프로그램
- 일시적 YouTube 오류

**현재 해결책:**
- 썸네일 + "YouTube에서 보기" 링크 방식 적용
- 나중에 다른 환경에서 임베딩 재테스트 필요

**관련 파일:**
- `lib/curriculum/weeks/graph-intro.ts` - videoUrl: `https://www.youtube.com/watch?v=vY0-BcEz1_0`
- `app/learn/task/[taskId]/page.tsx` - video case 렌더링 (line 211-265)

---

## 2025-12-16: Phase 3 Week 1 콘텐츠 제작 현황

### 프로젝트 상태

**배포**: https://fde-curriculum-simple.vercel.app (정상 작동)

### 주간 콘텐츠 현황

Phase 3 (Knowledge Graph)에 대한 요청이 많아 여기부터 콘텐츠를 제작 중입니다.

```
Phase 1 (8주): Week 1 ✅ / Week 2-8 ❌
Phase 2 (8주): Week 1-8 ❌
Phase 3 (8주): Week 1 ✅ / Week 2-8 ❌  ← 현재 작업 중
Phase 4 (8주): Week 1-8 ❌
Phase 5 (8주): Week 1-8 ❌
Phase 6 (8주): Week 1-8 ❌

총: 48주 중 2주 완료 (약 4%)
```

---

## Phase 3 Week 1: 그래프 이론 & Neo4j 입문

### 파일 위치
`lib/curriculum/weeks/graph-intro.ts` (146KB)

### Week 메타데이터

| 항목 | 값 |
|-----|-----|
| slug | `graph-intro` |
| week | 1 |
| phase | 3 |
| month | 5 |
| access | free (무료 체험) |
| title | 그래프 이론 & Neo4j 입문 |
| totalDuration | 720분 (12시간) |

### Topics
- Property Graph 모델
- Neo4j vs Memgraph
- Cypher 기초 CRUD
- 관계형 vs 그래프 DB

### Practice
소셜 네트워크 그래프 구축 (30+ 노드, 50+ 관계)

---

### Day 구조 (5일)

| Day | slug | title | duration |
|-----|------|-------|----------|
| 1 | `graph-fundamentals` | 그래프 데이터 모델 기초 | 150분 |
| 2 | `neo4j-setup` | Neo4j 환경 설정 & 첫 실행 | 140분 |
| 3 | `cypher-crud` | Cypher 기초 CRUD | 160분 |
| 4 | `pattern-matching` | Cypher 패턴 매칭 | 150분 |
| 5 | `weekly-project` | Weekly Project: 소셜 네트워크 그래프 | 180분 |

---

### Task 유형별 분포

| Type | 개수 | 용도 |
|------|-----|------|
| video | 12개 | 개념 설명 영상 |
| reading | 9개 | 문서/가이드 읽기 |
| code | 18개 | 실습 코딩 |
| quiz | 10개 | 이해도 확인 퀴즈 |
| **총** | **49개** | |

---

### Day 1: 그래프 데이터 모델 기초 (150분)

**핵심 내용:**
- 왜 그래프 데이터베이스인가? (관계 중심 사고)
- Property Graph 구성 요소 (노드, 관계, 속성, 레이블)
- 그래프 vs 관계형 DB 비교
- 실제 사용 사례 (소셜, 추천, 사기 탐지, 지식 그래프)

**영상 콘텐츠 (제작 대상):**
1. `graph-intro-video` - 왜 그래프 데이터베이스인가? (15분)
2. 기타 개념 설명 영상들

---

### Day 2: Neo4j 환경 설정 & 첫 실행 (140분)

**핵심 내용:**
- Neo4j 생태계 (Desktop, Aura, Browser, Docker)
- Docker로 Neo4j 설치
- Neo4j Aura Free 계정 생성
- Neo4j Browser 기본 사용법

**영상 콘텐츠 (제작 대상):**
1. `neo4j-overview-video` - Neo4j 생태계 소개 (10분)
2. Docker 설치, Aura 설정 등

---

### Day 3: Cypher 기초 CRUD (160분)

**핵심 내용:**
- Cypher 언어 소개 (ASCII Art 패턴)
- CREATE: 노드와 관계 생성
- MATCH + RETURN: 데이터 조회
- SET/REMOVE: 속성 수정
- DELETE: 노드/관계 삭제

**영상 콘텐츠 (제작 대상):**
1. `cypher-intro-video` - Cypher 언어 소개 (15분)
2. CRUD 각 명령어 설명 영상

---

### Day 4: Cypher 패턴 매칭 (150분)

**핵심 내용:**
- 패턴 매칭 개념
- 가변 길이 관계 (*1..3)
- WHERE 조건 필터링
- 경로 탐색

**영상 콘텐츠 (제작 대상):**
1. `pattern-intro-video` - 패턴 매칭 개념 (15분)
2. 고급 패턴 매칭 영상들

---

### Day 5: Weekly Project (180분)

**프로젝트: 소셜 네트워크 그래프 "TechHub"**

**요구사항:**
- 노드 타입: Person, Company, Skill
- 관계 타입: KNOWS, WORKS_AT, HAS_SKILL, FOLLOWS
- 최소 30개 Person, 5개 Company, 10개 Skill
- 최소 50개 관계
- 5개 비즈니스 쿼리 구현

**제출물:**
1. `schema.cypher` - 스키마 정의
2. `data.cypher` - 데이터 생성
3. `queries.cypher` - 비즈니스 쿼리
4. `README.md` - 프로젝트 설명
5. 스크린샷 폴더

---

## 영상 제작 계획

### Week 1 영상 목록 (12개 video task)

| Day | 영상 ID | 제목 | 길이 |
|-----|--------|------|------|
| 1 | graph-intro-video | 왜 그래프 데이터베이스인가? | 15분 |
| 2 | neo4j-overview-video | Neo4j 생태계 소개 | 10분 |
| 3 | cypher-intro-video | Cypher 언어 소개 | 15분 |
| 4 | pattern-intro-video | 패턴 매칭 개념 | 15분 |
| ... | ... | ... | ... |

> **참고**: 영상 시나리오 요청 시 해당 Task의 `transcript` 필드 내용을 기반으로 작성

---

## 백로그 (콘텐츠 완료 후)

### 퀴즈 시스템 개선
- 현재: 자기 확인 방식 (정답 보기 클릭)
- 개선 필요:
  - Level 1: 선택 시 즉시 정답/오답 피드백
  - Level 2: 제출 → 점수 표시
  - Level 3: 점수 DB 저장 + 오답 노트

---

## 다음 작업

1. **Week 1 영상 제작**
   - 각 video task의 transcript 기반 시나리오 작성
   - 영상 촬영/편집

2. **Week 2 콘텐츠 제작**
   - Cypher 심화 & 패턴 매칭
   - 집계 함수, 서브쿼리

3. **시뮬레이터 연동**
   - KSS-Ontology 시뮬레이터 활용
   - 실습 환경 구축

---

## 참고 사항

### 콘텐츠 구조
```
Week
├── days[] (5일)
│   ├── tasks[] (8-12개)
│   │   ├── id
│   │   ├── type: video | reading | code | quiz
│   │   ├── title
│   │   ├── duration (분)
│   │   └── content
│   │       ├── objectives[]
│   │       ├── transcript (video) / markdown (reading)
│   │       ├── keyPoints[]
│   │       └── externalLinks[] (선택)
│   └── challenge (선택)
└── totalDuration
```

### 관련 파일
- `lib/curriculum/types.ts` - 타입 정의
- `lib/curriculum/index.ts` - 커리큘럼 진입점
- `lib/curriculum/packages.ts` - 패키지 정보

---

*최종 업데이트: 2025-12-31*
