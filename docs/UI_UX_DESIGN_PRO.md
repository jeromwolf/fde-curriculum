# FDE Academy UI/UX 설계 v2 - 프로페셔널 에디션

> **타겟**: 현직 개발자/엔지니어가 전문성을 높이는 과정
> **참고**: Pluralsight, O'Reilly Learning, AWS Skill Builder, Palantir Learn

---

## 1. 설계 원칙 (Professional Learning)

### 1.1 타겟 사용자

```
❌ 피해야 할 것 (유아틱)     ✅ 추구해야 할 것 (프로)
─────────────────────────────────────────────────────
귀여운 이모지/캐릭터         깔끔한 아이콘/데이터 시각화
XP, 레벨업, 배지             스킬 프로파일, 완료율
스트릭, 보상                 학습 시간, 실무 적용도
게임화된 축하                간결한 진행 알림
밝은 파스텔 톤               다크모드 지원, 모노크롬
```

### 1.2 전문가 학습 동기

| 동기 | UI/UX 반영 |
|------|-----------|
| **커리어 성장** | 자격증 트래킹, 스킬 매트릭스 |
| **실무 적용** | 핸즈온 랩, 코드 샌드박스 |
| **시간 효율** | 진행률, 예상 소요시간 |
| **깊이 있는 학습** | 문서, 레퍼런스 연결 |
| **증명 가능한 역량** | 포트폴리오, 인증서 |

### 1.3 벤치마크 플랫폼

**Pluralsight 스타일**:
- 다크 테마 기본
- 스킬 평가 (Skill IQ)
- 러닝 패스
- 핸즈온 랩

**O'Reilly Learning 스타일**:
- 깔끔한 타이포그래피
- 콘텐츠 중심 레이아웃
- 책/비디오/라이브 통합

**AWS Skill Builder 스타일**:
- 자격증 중심 구조
- 모듈/코스 계층
- 진행률 대시보드

---

## 2. 정보 구조 (Professional IA)

```
FDE Academy
├── Dashboard
│   ├── 현재 진행 중인 과정
│   ├── 스킬 프로파일
│   └── 학습 통계
│
├── Learning Paths
│   ├── Phase 1: Data Engineering
│   │   ├── Module 1.1: Python 심화
│   │   │   ├── Lesson 1: 제너레이터
│   │   │   ├── Lab: 실습 환경
│   │   │   └── Assessment: 평가
│   │   └── Module 1.2: SQL 심화
│   └── Phase 2-6...
│
├── Labs & Projects
│   ├── 핸즈온 랩
│   └── 포트폴리오 프로젝트
│
├── Certifications
│   ├── AWS SAA
│   ├── Neo4j Professional
│   └── Palantir Foundry
│
└── My Profile
    ├── 완료한 과정
    ├── 스킬 매트릭스
    └── 인증서
```

---

## 3. 컬러 시스템 (Professional)

```css
/* Dark Theme (Primary) */
--bg-primary: #0F0F0F;      /* 거의 검정 */
--bg-secondary: #1A1A1A;    /* 카드 배경 */
--bg-tertiary: #252525;     /* 호버 상태 */
--text-primary: #FFFFFF;
--text-secondary: #A0A0A0;
--text-muted: #666666;
--border: #333333;

/* Accent Colors (최소한으로) */
--accent-blue: #3B82F6;     /* 링크, CTA */
--accent-green: #22C55E;    /* 완료 상태 */
--accent-yellow: #EAB308;   /* 경고, 진행 중 */

/* Phase Colors (절제된 톤) */
--phase-1: #60A5FA;  /* 블루 - Data Engineering */
--phase-2: #34D399;  /* 그린 - Data Analysis */
--phase-3: #A78BFA;  /* 퍼플 - Knowledge Graph */
--phase-4: #FB923C;  /* 오렌지 - Cloud */
--phase-5: #F472B6;  /* 핑크 - GenAI */
--phase-6: #F87171;  /* 레드 - Capstone */

/* Light Theme */
--bg-primary-light: #FFFFFF;
--bg-secondary-light: #F9FAFB;
--text-primary-light: #111827;
```

---

## 4. 페이지별 와이어프레임

### 4.1 Dashboard (전문가용)

```
┌─────────────────────────────────────────────────────────────────┐
│  FDE Academy                              [검색]  [Dark/Light] [프로필] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  CONTINUE LEARNING                                       │   │
│  │                                                          │   │
│  │  Phase 1: Data Engineering                               │   │
│  │  Module 1.2: SQL 심화                                    │   │
│  │  ────────────────────────────────────── 68%              │   │
│  │                                                          │   │
│  │  다음: Lesson 3 - 윈도우 함수                             │   │
│  │  예상 소요시간: 45분                    [Resume →]        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │  LEARNING PROGRESS   │  │  SKILL PROFILE       │            │
│  │                      │  │                      │            │
│  │  Total: 12%          │  │  Python      ████░ 80% │           │
│  │  Phase 1: 68%        │  │  SQL         ███░░ 65% │           │
│  │  Phase 2: 0%         │  │  Spark       █░░░░ 20% │           │
│  │  ...                 │  │  Neo4j       ░░░░░ 0%  │           │
│  │                      │  │                      │            │
│  │  이번 주: 8.5시간     │  │  [전체 스킬 보기 →]  │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  UPCOMING MILESTONES                                     │   │
│  │                                                          │   │
│  │  ○ SQL 심화 완료                       예정: 3일 후      │   │
│  │  ○ Portfolio #1: E2E Pipeline          예정: 2주 후      │   │
│  │  ○ Phase 1 완료                        예정: 3주 후      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  CERTIFICATIONS TRACK                                    │   │
│  │                                                          │   │
│  │  [○] Neo4j Professional     Phase 3 완료 후 응시 가능    │   │
│  │  [○] AWS SAA               Phase 4 완료 후 응시 가능     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Learning Path (Phase View)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Learning Paths                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PHASE 1                                                        │
│  Data Engineering 기초                                          │
│  ──────────────────────────────────────────────────── 68%       │
│                                                                 │
│  예상 기간: 2개월  |  완료 시 획득: Portfolio #1                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  MODULE 1.1                                              │   │
│  │  Python 심화                                    [완료 ✓] │   │
│  │  ────────────────────────────────────────────── 100%     │   │
│  │  4 Lessons  •  2 Labs  •  1 Assessment                   │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  MODULE 1.2                                              │   │
│  │  SQL 심화                                     [진행 중]  │   │
│  │  ────────────────────────────────────────────── 68%      │   │
│  │  4 Lessons  •  2 Labs  •  1 Assessment                   │   │
│  │                                                          │   │
│  │  ├─ Lesson 1: 윈도우 함수 기초            [완료]         │   │
│  │  ├─ Lesson 2: CTE & 재귀 쿼리             [완료]         │   │
│  │  ├─ Lesson 3: 실행 계획 분석              [진행 중]      │   │
│  │  ├─ Lesson 4: 트랜잭션 & 락               [잠금]         │   │
│  │  ├─ Lab: 복잡한 분석 쿼리                 [잠금]         │   │
│  │  └─ Assessment: SQL 심화 평가             [잠금]         │   │
│  │                                                          │   │
│  │                                      [Continue →]        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  MODULE 1.3                                              │   │
│  │  Apache Spark                                   [잠금]   │   │
│  │  ────────────────────────────────────────────── 0%       │   │
│  │  Module 1.2 완료 후 잠금 해제                             │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Lesson View (콘텐츠 학습)

```
┌─────────────────────────────────────────────────────────────────┐
│  Phase 1 > Module 1.2 > Lesson 3                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  실행 계획 분석 & 쿼리 튜닝                                      │
│  예상 소요시간: 45분                                             │
│                                                                 │
│  ┌───────────────────────────────────────────────────┐         │
│  │                                                   │         │
│  │               [ 비디오 플레이어 영역 ]              │         │
│  │                                                   │         │
│  │                     16:32 / 24:18                 │         │
│  │                                                   │         │
│  └───────────────────────────────────────────────────┘         │
│                                                                 │
│  LESSON CONTENT                                                 │
│  ─────────────────────────────────────────────────────         │
│                                                                 │
│  1. EXPLAIN vs EXPLAIN ANALYZE                                  │
│                                                                 │
│  PostgreSQL에서 쿼리 실행 계획을 분석하는 두 가지 방법:          │
│                                                                 │
│  ```sql                                                         │
│  -- 예상 실행 계획만 확인                                        │
│  EXPLAIN SELECT * FROM orders WHERE user_id = 123;              │
│                                                                 │
│  -- 실제 실행 후 통계 포함                                       │
│  EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;      │
│  ```                                                            │
│                                                                 │
│  [다음 섹션: 인덱스 스캔 vs 시퀀셜 스캔 →]                       │
│                                                                 │
│  ─────────────────────────────────────────────────────         │
│  RESOURCES                                                      │
│  • PostgreSQL EXPLAIN 공식 문서                                 │
│  • 쿼리 튜닝 치트시트 (PDF)                                      │
│                                                                 │
│  ─────────────────────────────────────────────────────         │
│  NAVIGATION                                                     │
│  [← Lesson 2: CTE]                     [Lesson 4: 트랜잭션 →]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Lab View (핸즈온 실습)

```
┌─────────────────────────────────────────────────────────────────┐
│  LAB: 쿼리 성능 최적화 실습                          [종료]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────┬────────────────────────────────┐   │
│  │  INSTRUCTIONS          │  SQL EDITOR                    │   │
│  │                        │                                │   │
│  │  Task 1/3              │  ```sql                        │   │
│  │  ─────────────────     │  -- 아래 쿼리를 최적화하세요    │   │
│  │                        │  SELECT *                      │   │
│  │  다음 쿼리의 실행       │  FROM orders o                 │   │
│  │  시간을 50% 이상       │  JOIN users u ON o.user_id     │   │
│  │  단축하세요.           │    = u.id                      │   │
│  │                        │  WHERE o.created_at >          │   │
│  │  힌트:                 │    '2024-01-01'                │   │
│  │  • 인덱스 확인         │  ORDER BY o.total DESC;        │   │
│  │  • EXPLAIN 활용        │  ```                           │   │
│  │                        │                                │   │
│  │  현재 실행시간:        │  [▶ Run Query]  [Check Answer] │   │
│  │  2,340ms               │                                │   │
│  │                        ├────────────────────────────────┤   │
│  │  목표:                 │  QUERY RESULT                  │   │
│  │  < 1,170ms             │                                │   │
│  │                        │  Execution time: 2,340ms       │   │
│  │                        │  Rows returned: 1,523          │   │
│  │  [힌트 보기]           │                                │   │
│  │                        │  ┌──────┬───────┬─────────┐   │   │
│  │                        │  │ id   │ user  │ total   │   │   │
│  │                        │  ├──────┼───────┼─────────┤   │   │
│  │                        │  │ 4521 │ Kim   │ 150,000 │   │   │
│  │                        │  │ ...  │ ...   │ ...     │   │   │
│  │                        │  └──────┴───────┴─────────┘   │   │
│  └────────────────────────┴────────────────────────────────┘   │
│                                                                 │
│  PROGRESS: ████░░░░░░ Task 1/3                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.5 Assessment View (평가)

```
┌─────────────────────────────────────────────────────────────────┐
│  ASSESSMENT: SQL 심화                           Q 5/15  ⏱ 12:34│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  다음 쿼리의 실행 계획을 보고, 가장 먼저 최적화해야              │
│  할 부분을 선택하세요.                                          │
│                                                                 │
│  ```                                                            │
│  Seq Scan on orders  (cost=0.00..1854.00 rows=50000)            │
│    Filter: (created_at > '2024-01-01')                          │
│    -> Hash Join  (cost=125.00..1979.00 rows=12500)              │
│         Hash Cond: (orders.user_id = users.id)                  │
│         -> Seq Scan on users  (cost=0.00..35.00 rows=1000)      │
│  ```                                                            │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ○  A. users 테이블에 인덱스 추가                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ●  B. orders.created_at에 인덱스 추가                     │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ○  C. Hash Join을 Nested Loop으로 변경                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ○  D. 파티셔닝 적용                                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│                                                   [Next →]      │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  PROGRESS  ████████████░░░░░░░░░░░░░░░░░░░ 5/15                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.6 Profile & Skills

```
┌─────────────────────────────────────────────────────────────────┐
│  MY PROFILE                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [Avatar]  홍길동                                         │  │
│  │            Software Engineer                              │  │
│  │            학습 시작: 2025년 1월                          │  │
│  │                                                          │  │
│  │  총 학습 시간: 48시간  |  완료 모듈: 4/24                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  SKILL MATRIX                                                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Data Engineering                                               │
│  ├─ Python           ████████████████░░░░ 80%  Advanced        │
│  ├─ SQL              █████████████░░░░░░░ 65%  Intermediate    │
│  ├─ Spark            ████░░░░░░░░░░░░░░░░ 20%  Beginner        │
│  └─ Airflow          ░░░░░░░░░░░░░░░░░░░░ 0%   Not Started     │
│                                                                 │
│  Knowledge Graph                                                │
│  ├─ Neo4j            ░░░░░░░░░░░░░░░░░░░░ 0%   Not Started     │
│  ├─ SPARQL           ░░░░░░░░░░░░░░░░░░░░ 0%   Not Started     │
│  └─ GraphRAG         ░░░░░░░░░░░░░░░░░░░░ 0%   Not Started     │
│                                                                 │
│  Cloud & DevOps                                                 │
│  ├─ AWS              ░░░░░░░░░░░░░░░░░░░░ 0%   Not Started     │
│  ├─ Kubernetes       ░░░░░░░░░░░░░░░░░░░░ 0%   Not Started     │
│  └─ Terraform        ░░░░░░░░░░░░░░░░░░░░ 0%   Not Started     │
│                                                                 │
│  CERTIFICATIONS                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [○] Neo4j Certified Professional       예정: Phase 3 완료 후  │
│  [○] AWS Solutions Architect Associate  예정: Phase 4 완료 후  │
│  [○] Palantir Foundry Data Engineer     예정: 스페셜 과정      │
│                                                                 │
│  COMPLETED MODULES                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ✓ Module 1.1: Python 심화              완료: 2025-01-15       │
│  ✓ Module 1.2: pandas & 데이터 처리     완료: 2025-01-22       │
│  ...                                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. 컴포넌트 스타일 가이드

### 5.1 Progress Bar (절제된 스타일)

```tsx
// Primary Progress (모듈 진행률)
<div className="h-1 bg-gray-800 rounded-full">
  <div
    className="h-full bg-blue-500 rounded-full transition-all"
    style={{ width: '68%' }}
  />
</div>

// Skill Level (텍스트 중심)
<div className="flex items-center gap-4">
  <span className="w-20 text-gray-400">Python</span>
  <div className="flex-1 h-2 bg-gray-800 rounded">
    <div className="h-full bg-blue-500 rounded" style={{ width: '80%' }} />
  </div>
  <span className="w-12 text-right text-gray-300">80%</span>
</div>
```

### 5.2 Module Card

```tsx
<div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-lg font-semibold text-white">Module 1.2: SQL 심화</h3>
    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
      진행 중
    </span>
  </div>
  <p className="text-gray-400 text-sm mb-4">
    4 Lessons • 2 Labs • 1 Assessment
  </p>
  <div className="flex items-center gap-3">
    <div className="flex-1 h-1 bg-gray-800 rounded-full">
      <div className="h-full bg-blue-500 rounded-full" style={{ width: '68%' }} />
    </div>
    <span className="text-gray-400 text-sm">68%</span>
  </div>
</div>
```

### 5.3 Lesson Item

```tsx
// 완료된 레슨
<div className="flex items-center gap-3 p-3 text-gray-300">
  <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm">✓</span>
  <span>Lesson 1: 윈도우 함수 기초</span>
</div>

// 진행 중인 레슨
<div className="flex items-center gap-3 p-3 bg-blue-500/10 border-l-2 border-blue-500 text-white">
  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">▶</span>
  <span>Lesson 3: 실행 계획 분석</span>
</div>

// 잠긴 레슨
<div className="flex items-center gap-3 p-3 text-gray-600">
  <span className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-sm">🔒</span>
  <span>Lesson 4: 트랜잭션 & 락</span>
</div>
```

### 5.4 CTA Button

```tsx
// Primary
<button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
  Continue →
</button>

// Secondary
<button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg border border-gray-700 transition-colors">
  View All
</button>
```

---

## 6. 제거된 요소 (유아틱)

| 제거 | 대체 |
|------|------|
| XP 포인트 | 완료율 (%) |
| 레벨 시스템 | 스킬 프로파일 |
| 배지/스티커 | 인증서, 완료 모듈 |
| 스트릭/연속일 | 학습 시간 통계 |
| 이모지 과다 사용 | 최소한의 아이콘 |
| 밝은 컬러 | 다크 테마 기본 |
| 게임화 알림 | 간결한 진행 알림 |
| 리더보드 | 개인 스킬 매트릭스 |

---

## 7. 유지되는 핵심 기능

| 기능 | 목적 | 구현 방식 |
|------|------|----------|
| **진행률 추적** | 현재 위치 파악 | 모듈/레슨별 % |
| **학습 이어하기** | 빠른 재개 | Dashboard Continue |
| **예상 시간** | 시간 관리 | 각 콘텐츠에 소요시간 표시 |
| **스킬 평가** | 역량 측정 | Assessment 점수 |
| **핸즈온 랩** | 실무 적용 | 코드 샌드박스 |
| **자격증 트래킹** | 목표 명확화 | 자격증 로드맵 |

---

## 8. 구현 우선순위

### Phase 1: 핵심 구조 (1주)
- [ ] 다크 테마 적용
- [ ] Learning Path 페이지
- [ ] 모듈/레슨 구조
- [ ] 진행률 저장 (localStorage)

### Phase 2: 콘텐츠 (1주)
- [ ] 비디오 임베드
- [ ] 마크다운 렌더링
- [ ] 코드 하이라이팅

### Phase 3: 인터랙션 (1주)
- [ ] Assessment 엔진
- [ ] Lab 환경 (Monaco Editor)
- [ ] 진행률 API

### Phase 4: 고급 (2주)
- [ ] 사용자 인증
- [ ] 스킬 매트릭스
- [ ] 인증서 발급

---

**Sources**:
- [Pluralsight](https://www.pluralsight.com/) - 개발자 전문 교육 플랫폼
- [O'Reilly Learning](https://www.oreilly.com/) - 기술 서적/비디오 플랫폼
- [AWS Skill Builder](https://skillbuilder.aws/) - AWS 공식 학습 플랫폼
- [Udemy vs Pluralsight](https://codecrafters.io/blog/udemy-vs-pluralsight-for-developers)

---

*문서 버전: 2.0 (Professional Edition)*
*작성일: 2025-12-07*
