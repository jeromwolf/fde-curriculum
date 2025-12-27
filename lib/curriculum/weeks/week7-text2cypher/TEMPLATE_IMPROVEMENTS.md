# Week 7 Text2Cypher - Template Pattern Application

## Summary

Applied the enhanced template pattern to Week 7 Text2Cypher CodeTasks, following the successful pattern from Week 5 RAG Basics:

### Template Pattern Components:
1. **왜 배우는가? (Why)** - Problem statement
2. **비유 (Analogy/Metaphor)** - Simple explanation
3. **📌 Step markers** - Essential steps only
4. **Emoji in keyPoints** - Visual emphasis

---

## Completed Improvements

### ✅ Day 1: day1-text2cypher-basics.ts

**Task 3 (w7d1-basic-impl) - COMPLETED**
- Added "왜 배우는가?" section explaining natural language DB access need
- Added "번역가 로봇 🤖" analogy (LLM as translator between Korean ↔ Cypher)
- Simplified codeExample to 3 essential steps with 📌 markers
- Added emoji to keyPoints (🔑 🛡️ 🎯 ⚡)

---

## Recommended Improvements for Remaining Tasks

### Day 1: day1-text2cypher-basics.ts

**Task 4 (w7d1-validation) - NEEDS IMPROVEMENT**

Add before "## 쿼리 검증":
```markdown
## 왜 배우는가?

**문제 상황:**
LLM이 생성한 쿼리를 무조건 신뢰하면 안 됩니다!
- 악의적 사용자: "모든 데이터를 삭제해줘"
- LLM 실수: 존재하지 않는 레이블 사용
- 성능 문제: LIMIT 없이 수백만 개 결과 반환

**해결책:**
실행 전 검증으로 안전하고 효율적인 쿼리만 허용합니다.

---

## 비유: 공항 보안 검색대 🛂

```
자연어 질문 → LLM → Cypher 쿼리 생성
                          ↓
                    [보안 검증 🛡️]
                    - 위험한 명령어? (DELETE, DROP)
                    - LIMIT 있나?
                          ↓
                    [스키마 검증 📋]
                    - 존재하는 레이블인가?
                    - 유효한 관계인가?
                          ↓
                  통과 → Neo4j 실행 ✅
                  차단 → 에러 반환 ❌
```
```

Change keyPoints to:
```typescript
keyPoints: [
  '🛡️ 보안 검증: DELETE, CREATE 등 위험한 명령어 차단',
  '📊 LIMIT 필수: 성능 문제 방지 (최대 100개)',
  '📋 스키마 검증: 존재하지 않는 레이블/관계 감지',
  '🔒 3단계 검증: 보안 → 스키마 → 실행',
],
```

Simplify codeExample with 📌 steps.

---

### Day 2: day2-few-shot-learning.ts

**Task 2 (w7d2-few-shot-impl) - NEEDS IMPROVEMENT**

Add before "## Few-shot 프롬프트 구현":
```markdown
## 왜 배우는가?

**문제 상황:**
Zero-shot (예시 없이 질문)으로는 LLM이 복잡한 Cypher 패턴을 잘 생성하지 못합니다.
정확도가 60%에 불과해서 프로덕션에서 사용하기 어렵죠.

**해결책:**
Few-shot Learning으로 3-5개 예시만 제공해도 정확도가 85%로 급상승합니다!

---

## 비유: 학생에게 문제 푸는 법 가르치기 👨‍🏫

```
선생님(Zero-shot):  "이차방정식을 풀어라"
학생:               "???" (혼란)

선생님(Few-shot):   "예제1: x² + 2x + 1 = 0 → (x+1)² = 0 → x = -1"
                    "예제2: x² - 4 = 0 → (x-2)(x+2) = 0 → x = ±2"
                    "이제 x² + 5x + 6 = 0을 풀어봐"
학생:               "(x+2)(x+3) = 0 → x = -2, -3" ✅

```
LLM도 마찬가지로 예시를 보면 패턴을 학습합니다.
```

Change keyPoints to:
```typescript
keyPoints: [
  '📚 Few-shot: 3-5개 예시로 정확도 60% → 85%',
  '🎯 FewShotChatMessagePromptTemplate 활용',
  '🧠 SemanticSimilarityExampleSelector로 자동 예시 선택',
  '⚡ 예시 품질 > 예시 개수 (5개면 충분)',
],
```

Simplify codeExample to ~40 lines with 📌 steps.

---

**Task 3 (w7d2-domain-examples) - NEEDS IMPROVEMENT**

Add before "## 도메인 특화 예시 설계":
```markdown
## 왜 배우는가?

**문제 상황:**
모든 질문에 같은 예시를 보여주면 비효율적입니다.
"회사 목록" 질문에 "집계 쿼리" 예시를 보여주는 것은 도움이 안 되죠.

**해결책:**
질문 유형별로 적절한 예시를 동적으로 선택합니다.

---

## 비유: 맞춤형 과외 선생님 🎓

```
학생: "집합 문제 푸는 법 알려주세요"
선생님: [집합 예제 5개 제시] ✅

학생: "미적분 문제 풀고 싶어요"
선생님: [미적분 예제 5개 제시] ✅

❌ 나쁜 선생님: 항상 같은 예제만 보여줌
✅ 좋은 선생님: 학생이 원하는 주제의 예제 제시
```
```

Change keyPoints to:
```typescript
keyPoints: [
  '🗂️ 쿼리 패턴별 예시 그룹화: 집계, 관계, 필터, 경로',
  '🔍 질문 키워드로 적절한 예시 자동 선택',
  '🎯 "몇 개" → 집계 예시, "경쟁" → 관계 예시',
  '⚡ 최대 5개 예시로 성능과 품질 균형',
],
```

Simplify codeExample to ~35 lines.

---

### Day 3: day3-error-handling.ts

**Task 2 (w7d3-retry) - NEEDS IMPROVEMENT**

Add:
```markdown
## 왜 배우는가?

**문제 상황:**
LLM도 실수합니다! 첫 시도에 100% 정확한 쿼리를 생성하지 못할 수 있어요.
- 문법 오류: MACH 대신 MATCH
- 스키마 오류: :Compny 대신 :Company
- 한 번 실패하면 끝?

**해결책:**
에러 메시지를 LLM에게 다시 보여주면 스스로 수정합니다!

---

## 비유: 선생님의 오답 첨삭 ✏️

```
학생: (문제를 풀다)
답안: "MACH (n) RETURN n"
     ↓
선생님: "❌ 오류: MACH는 잘못된 명령어입니다. MATCH로 수정하세요."
     ↓
학생: "MATCH (n) RETURN n LIMIT 10" ✅

인간도 LLM도 피드백을 받으면 개선됩니다.
```
```

Change keyPoints to:
```typescript
keyPoints: [
  '🔁 에러 메시지를 프롬프트에 포함해 재시도',
  '🎯 유형별 맞춤 피드백: 문법 오류 vs 스키마 오류',
  '⚙️ 최대 3회 재시도로 성공률 대폭 향상',
  '🚫 무한 루프 방지: max_retries 제한 필수',
],
```

Simplify codeExample to ~40 lines with 📌 steps.

---

**Task 3 (w7d3-validation) - NEEDS IMPROVEMENT**

Add:
```markdown
## 왜 배우는가?

**문제 상황:**
에러가 발생한 후 재시도하는 것보다, 애초에 에러를 예방하는 것이 낫습니다.
실행 전 검증으로 빠르고 안전하게!

---

## 비유: 코드 리뷰 시스템 👨‍💻

```
개발자: 코드 작성
     ↓
[자동 Linter 🤖]
- 문법 오류?
- 코딩 스타일 준수?
- 보안 취약점?
     ↓
통과 → 배포 ✅
차단 → 수정 요청 ❌

Cypher도 실행 전에 Linter처럼 검증합니다.
```
```

Change keyPoints to:
```typescript
keyPoints: [
  '✅ 3단계 검증: 보안 → 문법 → 스키마',
  '🔒 정규식으로 레이블/관계 자동 추출',
  '⚡ 실행 전 검증 → 실패 후 재시도보다 빠름',
  '📋 검증 실패 시 상세 오류 목록 반환',
],
```

---

### Day 4: day4-advanced-t2c.ts

**Task 2 (w7d4-conversational) - NEEDS IMPROVEMENT**

Add:
```markdown
## 왜 배우는가?

**문제 상황:**
실제 사용자는 연속적으로 질문합니다:
- "삼성전자에 대해 알려줘"
- "그 회사의 경쟁사는?" ← "그 회사"가 무엇인지 모름

**해결책:**
대화 기록을 활용해 대명사를 실제 엔티티로 교체합니다.

---

## 비유: 대화 맥락을 기억하는 비서 💼

```
당신: "내일 회의 잡아줘"
비서: [회의 예약]

당신: "그거 취소해줘"  ← "그거" = 방금 잡은 회의
비서: [해당 회의 취소] ✅

❌ 나쁜 비서: "어떤 회의를 취소하나요?"
✅ 좋은 비서: 맥락으로 "그거"가 무엇인지 앎
```
```

Change keyPoints to:
```typescript
keyPoints: [
  '💬 대화 맥락으로 대명사 해결 (Coreference Resolution)',
  '🧠 최근 N턴만 사용해 컨텍스트 제한 (메모리 효율)',
  '🔄 질문 재구성: "그 회사" → "삼성전자"',
  '📝 결과에서 엔티티 추출해 맥락 유지',
],
```

---

**Task 3 (w7d4-complex-queries) - NEEDS IMPROVEMENT**

Add:
```markdown
## 왜 배우는가?

**문제 상황:**
단순 조회("모든 회사")는 쉽지만, 복잡한 쿼리는 어렵습니다:
- 집계: "가장 많은 경쟁사를 가진 회사 TOP 5"
- 경로: "삼성과 애플 사이의 연결 경로"
- 조건: "2010년 이후 설립되고 경쟁사 3개 이상"

**해결책:**
패턴별 예시를 제공하면 LLM이 복잡한 쿼리도 생성합니다.

---

## 비유: 요리 레시피북 📖

```
초보자: "계란 후라이" → 간단한 레시피
중급자: "카르보나라" → 복잡한 레시피 필요

집계 쿼리 = 복잡한 요리
경로 쿼리 = 특수한 기법 필요

레시피(예시)가 있으면 누구나 만들 수 있습니다!
```
```

Change keyPoints to:
```typescript
keyPoints: [
  '📊 집계: count, avg, sum + ORDER BY',
  '🛤️ 경로: shortestPath, 가변 길이 관계 [*1..2]',
  '🎯 조건: WHERE + WITH 조합',
  '🔍 질문 키워드로 패턴 자동 인식',
],
```

---

**Task 4 (w7d4-parameterized) - NEEDS IMPROVEMENT**

Add:
```markdown
## 왜 배우는가?

**문제 상황:**
쿼리에 사용자 입력을 직접 넣으면 SQL Injection 공격 위험!
```cypher
MATCH (c:Company {name: '${user_input}'})  # ← 위험!
```
악의적 사용자: `'}) DELETE (c) //` 입력 → 모든 데이터 삭제

**해결책:**
파라미터화된 쿼리로 값과 코드를 분리합니다.

---

## 비유: 템플릿과 데이터 분리 📝

```
❌ 나쁜 방법: 편지에 이름 직접 쓰기
"친애하는 {{user_input}}님께"
악의적 입력: "홍길동 <script>alert('hack')</script>"

✅ 좋은 방법: 템플릿 + 데이터 분리
템플릿: "친애하는 {{name}}님께"
데이터: {name: "홍길동"}
→ 특수문자는 자동 이스케이프
```
```

Change keyPoints to:
```typescript
keyPoints: [
  '🔒 $param 형식으로 SQL Injection 방지',
  '📊 파라미터와 쿼리 분리 생성',
  '✅ 파라미터 값 검증 (길이, 특수문자)',
  '⚡ 캐싱 효율도 향상 (쿼리 재사용)',
],
```

---

### Day 5: day5-t2c-project.ts

**Task 2 (w7d5-core-engine) - NEEDS IMPROVEMENT**

Simplify to ~50 lines with essential components:
- 📌 Step 1: 초기화
- 📌 Step 2: Few-shot 예시 선택
- 📌 Step 3: Cypher 생성
- 📌 Step 4: 검증 및 실행

Change keyPoints to:
```typescript
keyPoints: [
  '🎯 SemanticSimilarityExampleSelector로 자동 예시 선택',
  '🔒 검증(보안+스키마) + 재시도 통합',
  '📊 구조화된 결과 반환 (cypher, results, attempts)',
  '⚡ Week 7 전체 내용의 통합판',
],
```

---

**Task 3 (w7d5-streamlit) - NEEDS IMPROVEMENT**

Add:
```markdown
## 왜 배우는가?

**문제 상황:**
백엔드 엔진만 만들면 개발자만 사용 가능합니다.
일반 사용자도 사용하려면 UI가 필요하죠.

**해결책:**
Streamlit으로 10분 만에 챗봇 UI를 만듭니다!

---

## 비유: 엔진 + 차체 🚗

```
Text2Cypher 엔진 = 자동차 엔진 🔧
→ 강력하지만 일반인은 사용 못함

Streamlit UI = 차체 + 핸들 + 페달 🎨
→ 누구나 운전 가능

엔진 + 차체 = 완성된 자동차! ✅
```
```

Simplify codeExample to ~40 lines with essential components.

---

## Implementation Checklist

- [x] Day 1 Task 3 (w7d1-basic-impl) - Basic Text2Cypher
- [ ] Day 1 Task 4 (w7d1-validation) - Query Validation
- [ ] Day 2 Task 2 (w7d2-few-shot-impl) - Few-shot Implementation
- [ ] Day 2 Task 3 (w7d2-domain-examples) - Domain Examples
- [ ] Day 3 Task 2 (w7d3-retry) - Error Retry
- [ ] Day 3 Task 3 (w7d3-validation) - Validation
- [ ] Day 4 Task 2 (w7d4-conversational) - Conversational
- [ ] Day 4 Task 3 (w7d4-complex-queries) - Complex Queries
- [ ] Day 4 Task 4 (w7d4-parameterized) - Parameterized Queries
- [ ] Day 5 Task 2 (w7d5-core-engine) - Core Engine
- [ ] Day 5 Task 3 (w7d5-streamlit) - Streamlit UI

---

## Key Pattern Elements

### 1. "왜 배우는가?" Structure
- **문제 상황**: 구체적 문제 3-4개 나열
- **해결책**: 한 줄 요약

### 2. Analogy Requirements
- 일상적 비유 (요리, 학교, 공항, 비서 등)
- 이모지 사용
- 시각적 흐름도

### 3. Code Simplification
- Before: 80-150 lines
- After: 30-50 lines
- 📌 Step markers (Step 1, Step 2...)
- Essential components only

### 4. KeyPoints with Emoji
- 각 포인트에 관련 이모지 추가
- 🔑 핵심, 🛡️ 보안, 📊 데이터, 🎯 목표, ⚡ 성능, 🧠 지능, 💬 대화, 🔒 안전
