# FDE Academy - 개발 로그

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

*최종 업데이트: 2025-12-16*
