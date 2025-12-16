# FDE Academy UI/UX 설계 문서

> **목표**: 학습 중단율 최소화, 연속 학습 습관 형성
> **참고**: Duolingo (스트릭 60% 참여 증가), Sololearn (2100만 유저)

---

## 1. 핵심 설계 원칙

### 1.1 학습 지속성 심리학

| 원칙 | 적용 | 효과 |
|------|------|------|
| **손실 회피** | 스트릭 시스템 | "잃고 싶지 않다" → 매일 접속 |
| **작은 성공** | 마이크로 태스크 | 완료감 → 도파민 → 반복 |
| **가변 보상** | XP + 배지 + 레벨업 | 예측 불가 보상 → 중독성 |
| **사회적 증거** | 리더보드 + 커뮤니티 | "다른 사람도 하고 있다" |
| **진행 시각화** | Progress Bar | "거의 다 왔다" → 완료 유도 |

### 1.2 Duolingo 성공 공식 적용

```
Duolingo 핵심 지표:
- 7일 스트릭 유지자: 장기 유지율 3.6배 증가
- 스트릭 프리즈 기능: 이탈율 21% 감소
- XP 리더보드: 참여율 40% 증가
- 배지 시스템: 완료율 30% 증가

FDE Academy 적용:
- 학습 스트릭 + 스트릭 프리즈 (주 1회)
- 일일 XP 목표 + 주간 리더보드
- Phase 완료 배지 + 자격증 배지
- 마이크로 태스크 (5-15분 단위)
```

---

## 2. 정보 구조 (IA) 재설계

### 2.1 현재 구조 (문제점)

```
❌ 현재 (정적, 추적 불가)
├── Phase 1 (2개월)
│   └── Month 1 (큰 덩어리)
│       └── Week 1-4 (Topics 리스트만)
└── 학습 진행률: 없음
```

### 2.2 개선 구조

```
✅ 개선 (인터랙티브, 추적 가능)
├── Dashboard (개인화)
│   ├── 오늘의 학습 (Daily Goal)
│   ├── 스트릭 & XP
│   └── 빠른 계속하기
│
├── Phase 1
│   ├── Week 1
│   │   ├── Day 1 (5 tasks)
│   │   │   ├── [x] 영상: Python 제너레이터 (12분)
│   │   │   ├── [x] 읽기: 제너레이터 심화 (8분)
│   │   │   ├── [ ] 실습: 코드 3문제
│   │   │   ├── [ ] 퀴즈: 5문제
│   │   │   └── [ ] 미니 프로젝트
│   │   ├── Day 2 (5 tasks)
│   │   └── ... Day 5
│   └── Week 2-4
│
├── My Progress
│   ├── 전체 진행률
│   ├── 획득 배지
│   └── 학습 통계
│
└── Leaderboard
    ├── 주간 XP 랭킹
    └── 스트릭 랭킹
```

---

## 3. 페이지별 와이어프레임

### 3.1 Dashboard (홈)

```
┌─────────────────────────────────────────────────────────────┐
│  FDE Academy                              [프로필] [설정]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  안녕하세요, 학습자님! 🔥 12일 연속 학습 중                    │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   TODAY'S XP    │  │    STREAK      │  │    LEVEL     │ │
│  │   ████████░░    │  │   🔥 12일       │  │   Lv.8       │ │
│  │   80/100 XP     │  │   최장: 15일    │  │   1,240 XP   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  📚 이어서 학습하기                                     │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Phase 1 > Week 2 > Day 3                       │  │  │
│  │  │  "pandas DataFrame 고급"                         │  │  │
│  │  │  ████████████░░░░░░░░ 60% (3/5 tasks)           │  │  │
│  │  │                              [계속하기 →]        │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🎯 오늘의 목표                              3/5 완료  │  │
│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐   │  │
│  │  │  ✓   │ │  ✓   │ │  ✓   │ │  ○   │ │  ○   │   │  │
│  │  │ Task1│ │ Task2│ │ Task3│ │ Task4│ │ Task5│   │  │
│  │  └───────┘ └───────┘ └───────┘ └───────┘ └───────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │  📊 주간 학습 현황    │  │  🏆 주간 랭킹 (7위)  │        │
│  │  ┌─┬─┬─┬─┬─┬─┬─┐    │  │  1. 김철수 1,450 XP │        │
│  │  │█│█│█│░│░│░│░│    │  │  2. 이영희 1,380 XP │        │
│  │  │월│화│수│목│금│토│일│    │  │  ...              │        │
│  │  └─┴─┴─┴─┴─┴─┴─┘    │  │  7. 나 1,240 XP    │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 학습 페이지 (Day View)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Phase 1 > Week 2 > Day 3                    🔥 12일     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  pandas DataFrame 고급                                 │  │
│  │  ████████████░░░░░░░░░░░░░░░░░░░░░░░░ 60% (3/5)        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ✅ 1. 영상 시청                              +10 XP   │  │
│  │     "MultiIndex와 고급 인덱싱" (12분)                   │  │
│  │     [완료됨 ✓]                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ✅ 2. 읽기 자료                              +5 XP    │  │
│  │     공식 문서: pandas MultiIndex                       │  │
│  │     [완료됨 ✓]                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ✅ 3. 코딩 실습                             +20 XP    │  │
│  │     MultiIndex 생성 및 슬라이싱 3문제                   │  │
│  │     [완료됨 ✓]                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ⏳ 4. 퀴즈                                  +15 XP    │  │
│  │     개념 확인 퀴즈 5문제 (객관식)                       │  │
│  │                                     [퀴즈 시작 →]      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🔒 5. 미니 프로젝트                         +30 XP    │  │
│  │     1GB CSV 파일 처리 파이프라인                        │  │
│  │     (이전 태스크 완료 후 잠금 해제)                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  [← Day 2]                              [Day 4 →]     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 퀴즈 페이지

```
┌─────────────────────────────────────────────────────────────┐
│  퀴즈: pandas MultiIndex                      Q 2/5       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  MultiIndex DataFrame에서 특정 레벨의                  │  │
│  │  모든 값을 선택하려면 어떤 메서드를 사용하나요?          │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ○ A. df.loc[:]                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ● B. df.xs(key, level='level_name')                  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ○ C. df.get_level_values()                           │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ○ D. df.swaplevel()                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                              [정답 확인]               │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

[정답 후]
┌───────────────────────────────────────────────────────────┐
│  ✅ 정답입니다! +3 XP                                     │
│                                                           │
│  xs() 메서드는 cross-section을 의미하며,                   │
│  특정 레벨의 값을 기준으로 데이터를 선택합니다.              │
│                                                           │
│  ```python                                                │
│  df.xs('2024', level='year')                             │
│  ```                                                      │
│                                                           │
│                              [다음 문제 →]                 │
└───────────────────────────────────────────────────────────┘
```

### 3.4 스트릭 유지 알림 (모달)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                        🔥                                  │
│                                                             │
│            12일 연속 학습 중!                               │
│                                                             │
│      내일도 학습하면 🏅 2주 스트릭 배지 획득!               │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  오늘의 학습 완료까지                                   │  │
│  │  ████████████████░░░░░░░░░░░░░░░░ 80/100 XP            │  │
│  │  태스크 2개만 더 완료하면 됩니다!                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│        [🧊 스트릭 프리즈 사용]    [계속 학습하기]           │
│                                                             │
│        * 스트릭 프리즈: 주 1회 사용 가능                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.5 배지 & 성취 페이지

```
┌─────────────────────────────────────────────────────────────┐
│  ← 내 성취                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  총 XP: 1,240          레벨: 8         스트릭: 12일   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  📛 획득한 배지 (7/24)                                      │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  🌟    │ │  🔥    │ │  📚    │ │  💻    │          │
│  │ 첫 학습 │ │ 7일    │ │ Week1  │ │ 실습10 │          │
│  │ 완료   │ │ 스트릭 │ │ 완료   │ │ 완료   │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  🧠    │ │  🎯    │ │  ⭐    │ │  🔒    │          │
│  │ 퀴즈   │ │ 일일   │ │ Month1 │ │ Phase1 │          │
│  │ 만점   │ │ 목표5회│ │ 완료   │ │ 미획득 │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
│  🔒 미획득 배지                                             │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  🔒    │ │  🔒    │ │  🔒    │ │  🔒    │          │
│  │ 30일   │ │ Phase2 │ │ AWS    │ │ Neo4j  │          │
│  │ 스트릭 │ │ 완료   │ │ 자격증 │ │ 자격증 │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. 컴포넌트 시스템

### 4.1 색상 팔레트

```css
/* Primary Colors */
--primary-blue: #3B82F6;    /* Phase 1 */
--primary-teal: #14B8A6;    /* Phase 2 */
--primary-purple: #8B5CF6;  /* Phase 3 */
--primary-orange: #F97316;  /* Phase 4 */
--primary-green: #22C55E;   /* Phase 5 */
--primary-red: #EF4444;     /* Phase 6 */

/* Gamification Colors */
--xp-gold: #FBBF24;         /* XP, 코인 */
--streak-orange: #F97316;   /* 스트릭 */
--level-purple: #A855F7;    /* 레벨업 */
--success-green: #22C55E;   /* 완료, 정답 */
--error-red: #EF4444;       /* 오답 */

/* Neutral Colors */
--bg-primary: #FFFFFF;
--bg-secondary: #F9FAFB;
--bg-tertiary: #F3F4F6;
--text-primary: #111827;
--text-secondary: #6B7280;
--border: #E5E7EB;
```

### 4.2 태스크 카드 컴포넌트

```tsx
// TaskCard 상태별 스타일

// 1. 잠금 상태
<div className="bg-gray-100 border-gray-200 opacity-60">
  <span className="text-gray-400">🔒</span>
  <span className="text-gray-500">이전 태스크 완료 필요</span>
</div>

// 2. 활성 상태 (현재 진행 가능)
<div className="bg-white border-blue-200 shadow-md">
  <span className="text-blue-500">⏳</span>
  <span className="text-gray-900">태스크 제목</span>
  <button className="bg-blue-500 text-white">시작하기</button>
</div>

// 3. 진행 중 상태
<div className="bg-blue-50 border-blue-300">
  <span className="text-blue-500">📝</span>
  <span className="text-gray-900">태스크 제목</span>
  <progress value="60" max="100" />
  <button className="bg-blue-500 text-white">계속하기</button>
</div>

// 4. 완료 상태
<div className="bg-green-50 border-green-200">
  <span className="text-green-500">✅</span>
  <span className="text-gray-900 line-through">태스크 제목</span>
  <span className="text-green-600">+10 XP</span>
</div>
```

### 4.3 Progress Bar 변형

```tsx
// 1. 일일 XP Progress
<div className="relative h-6 bg-gray-200 rounded-full">
  <div
    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
    style={{ width: '80%' }}
  />
  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
    80/100 XP
  </span>
</div>

// 2. Phase Progress
<div className="h-3 bg-gray-200 rounded-full">
  <div
    className="h-full bg-blue-500 rounded-full transition-all duration-500"
    style={{ width: '48%' }}
  />
</div>
<span className="text-sm text-gray-600">48% (23/48 tasks)</span>

// 3. Week Progress (단계별)
<div className="flex gap-1">
  {[1,2,3,4,5].map(day => (
    <div
      key={day}
      className={`h-2 flex-1 rounded ${
        completed.includes(day) ? 'bg-green-500' : 'bg-gray-200'
      }`}
    />
  ))}
</div>
```

---

## 5. 인터랙션 & 애니메이션

### 5.1 태스크 완료 애니메이션

```tsx
// 체크마크 애니메이션
const CheckAnimation = () => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
  >
    ✅
  </motion.div>
)

// XP 획득 팝업
const XPPopup = ({ amount }) => (
  <motion.div
    initial={{ y: 0, opacity: 1 }}
    animate={{ y: -50, opacity: 0 }}
    transition={{ duration: 1 }}
    className="text-yellow-500 font-bold"
  >
    +{amount} XP
  </motion.div>
)
```

### 5.2 스트릭 축하 애니메이션

```tsx
// 7일, 14일, 30일 스트릭 달성 시
const StreakCelebration = ({ days }) => (
  <motion.div
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="fixed inset-0 flex items-center justify-center bg-black/50"
  >
    <div className="bg-white rounded-2xl p-8 text-center">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ repeat: 3, duration: 0.5 }}
        className="text-6xl"
      >
        🔥
      </motion.div>
      <h2 className="text-2xl font-bold mt-4">
        {days}일 연속 학습!
      </h2>
      <Confetti />
    </div>
  </motion.div>
)
```

### 5.3 레벨업 애니메이션

```tsx
const LevelUpModal = ({ newLevel }) => (
  <motion.div className="fixed inset-0 flex items-center justify-center">
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="text-8xl text-center"
      >
        ⬆️
      </motion.div>
      <h2 className="text-3xl font-bold text-white text-center">
        Level {newLevel}
      </h2>
      <p className="text-purple-100 text-center mt-2">
        새로운 기능이 잠금 해제되었습니다!
      </p>
    </motion.div>
  </motion.div>
)
```

---

## 6. 데이터 구조 (로컬/서버)

### 6.1 사용자 진행 상태

```typescript
interface UserProgress {
  userId: string

  // 전체 진행률
  currentPhase: number
  currentWeek: number
  currentDay: number

  // XP & 레벨
  totalXP: number
  level: number

  // 스트릭
  currentStreak: number
  longestStreak: number
  lastActivityDate: string
  streakFreezeAvailable: boolean

  // 완료된 태스크
  completedTasks: {
    [phaseId: string]: {
      [weekId: string]: {
        [dayId: string]: {
          [taskId: string]: {
            completedAt: string
            xpEarned: number
            score?: number  // 퀴즈의 경우
          }
        }
      }
    }
  }

  // 획득 배지
  badges: {
    badgeId: string
    earnedAt: string
  }[]

  // 일일 활동
  dailyActivity: {
    date: string
    xpEarned: number
    tasksCompleted: number
  }[]
}
```

### 6.2 태스크 정의

```typescript
interface Task {
  id: string
  type: 'video' | 'reading' | 'coding' | 'quiz' | 'project'
  title: string
  description: string
  duration: number  // 분 단위
  xpReward: number

  // 타입별 추가 데이터
  content: {
    // video
    videoUrl?: string

    // reading
    markdownContent?: string
    externalUrl?: string

    // coding
    instructions?: string
    starterCode?: string
    testCases?: TestCase[]

    // quiz
    questions?: QuizQuestion[]
    passingScore?: number

    // project
    requirements?: string[]
    deliverables?: string[]
  }

  // 잠금 조건
  prerequisites?: string[]  // 선행 태스크 ID
}
```

---

## 7. 모바일 반응형

### 7.1 브레이크포인트

```css
/* Tailwind 기본값 사용 */
sm: 640px   /* 모바일 가로 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 데스크톱 */
xl: 1280px  /* 대형 모니터 */
```

### 7.2 모바일 Dashboard

```
┌─────────────────────────┐
│  FDE Academy     [≡]   │
├─────────────────────────┤
│  🔥 12일  │  Lv.8      │
│  80/100 XP             │
│  ████████████░░░       │
├─────────────────────────┤
│  📚 이어서 학습하기      │
│  ─────────────────────  │
│  Phase 1 > Week 2      │
│  Day 3: pandas 고급    │
│  60% (3/5)             │
│  [계속하기 →]           │
├─────────────────────────┤
│  🎯 오늘 완료: 3/5     │
│  [○][○][○][●][●]       │
├─────────────────────────┤
│  [홈][학습][성취][설정] │
└─────────────────────────┘
```

---

## 8. 구현 로드맵

### Phase 1: MVP (1주)
- [ ] localStorage 기반 진행률 저장
- [ ] 체크박스 기반 태스크 완료
- [ ] Progress Bar (Phase/Week/Day)
- [ ] 기본 스트릭 카운터

### Phase 2: Gamification (1주)
- [ ] XP 시스템 구현
- [ ] 레벨 시스템
- [ ] 배지 시스템
- [ ] 애니메이션 (framer-motion)

### Phase 3: 콘텐츠 (2주)
- [ ] 퀴즈 엔진
- [ ] 코드 에디터 임베드
- [ ] 영상 플레이어 연동
- [ ] 마크다운 렌더링

### Phase 4: 백엔드 (2주)
- [ ] 사용자 인증 (NextAuth)
- [ ] PostgreSQL 진행률 저장
- [ ] 리더보드 API
- [ ] 푸시 알림

---

## 참고 자료

- [Duolingo's Gamification Secrets](https://www.orizon.co/blog/duolingos-gamification-secrets)
- [How to Design Like Duolingo](https://www.uinkits.com/blog-post/how-to-design-like-duolingo-gamification-engagement)
- [eLearning UI/UX Design Guide 2025](https://viartisan.com/2025/05/27/elearning-ui-ux-design/)
- [Gamification in UI/UX 2025](https://medium.com/@almaxdesignagency/gamification-in-ui-ux-2025-slay-the-game-or-get-slapped-by-it-plus-clever-tricks-to-keep-em-36f86faeefe4)

---

*문서 버전: 1.0*
*작성일: 2025-12-07*
