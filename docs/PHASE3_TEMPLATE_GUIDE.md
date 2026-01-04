# Phase 3 Curriculum Template Guide

## Overview

This document defines the **standard format** for all Phase 3 curriculum content.
Phase 3 will serve as the template for other phases.

---

## Key Principles

### 1. "Why Before How"
Every code section must explain **why** before showing **how**.

### 2. Selection Criteria Explicit
When there are multiple options, explain **why this specific choice** was made.

### 3. Common Pitfalls Section
Every code task must include **common mistakes** beginners make.

### 4. Connection to Previous Learning
Each section should reference **what was learned before** and how it connects.

---

## Task Type Standards

### Code Task Structure

```typescript
{
  id: 'task-id',
  type: 'code',
  title: 'Task Title',
  duration: 30,
  content: {
    objectives: [
      '구체적인 학습 목표 1',
      '구체적인 학습 목표 2',
      '구체적인 학습 목표 3'
    ],

    // 1. WHY 섹션 필수 (연결 + 문제상황)
    instructions: `
## Why This Matters (왜 배우는가)

### 이전 학습과의 연결
> Week X에서 배운 [개념]을 기반으로...
> 이제 [새로운 개념]으로 확장합니다.

### 실무 문제 상황
구체적인 실무 시나리오 설명:
- 상황 1
- 상황 2
- 상황 3

### 해결 방법 개요
오늘 배울 기술로 이 문제들을 어떻게 해결하는지 개요

---

## 과제 설명

### 과제 1: [제목] (점수)

**목표**: 구체적인 달성 목표

**선택 기준 가이드**:
- 왜 이 방법을 선택해야 하는가
- 대안은 무엇이고 왜 적합하지 않은가
- 어떤 상황에서 다른 선택이 더 좋은가

**예상 결과**:
- 기대하는 출력 형태

---

## Common Pitfalls (자주 하는 실수)

### 실수 1: [실수 제목]
**잘못된 예시**:
\`\`\`code
// 잘못된 코드
\`\`\`

**왜 잘못되었나**:
설명

**올바른 방법**:
\`\`\`code
// 올바른 코드
\`\`\`

### 실수 2: [실수 제목]
...
    `,

    // 2. Starter Code with Selection Guidance
    starterCode: `// ========================================
// 과제 1: [제목]
// ========================================

// [WHY] 왜 이 접근법을 사용하는가:
// - 이유 1: 구체적 설명
// - 이유 2: 구체적 설명

// [SELECTION GUIDE] 선택 기준:
// - 옵션 A vs 옵션 B: 이 경우 A를 선택하는 이유
// - 파라미터 X: 값 선택 기준 (예: 데이터 크기에 따라)

// [TODO] 구현할 내용:
// Step 1: ...
// Step 2: ...
// Step 3: ...

// [HINT] 힌트:
// - 힌트 1
// - 힌트 2

// 여기에 코드 작성
`,

    // 3. Solution Code with Inline Explanations
    solutionCode: `// ========================================
// 과제 1: [제목]
// ========================================

// [WHY] 이 접근법을 선택한 이유:
// 1. 이유 1에 대한 상세 설명
// 2. 이유 2에 대한 상세 설명

// [STEP 1] 첫 번째 단계 설명
// 왜: 이 단계가 필요한 이유
// 대안: 다른 방법과 비교
실제 코드

// [STEP 2] 두 번째 단계 설명
// 왜: 이 파라미터 값을 선택한 이유
// 주의: 주의해야 할 사항
실제 코드

// [RESULT] 예상 결과:
// 결과 설명

// [EDGE CASE] 엣지 케이스 처리:
// - 케이스 1: 처리 방법
// - 케이스 2: 처리 방법
`,

    // 4. Actionable Hints
    hints: [
      '[개념] 구체적인 힌트 - 예시와 함께',
      '[선택] 왜 A를 B 대신 사용하는지 힌트',
      '[디버깅] 자주 발생하는 에러와 해결법',
      '[성능] 성능 최적화 팁',
      '[확장] 더 발전시킬 수 있는 방향'
    ]
  }
}
```

---

## Solution Code Commenting Standards

### Required Comment Types

1. **[WHY]** - 왜 이 접근법인가
2. **[STEP N]** - 각 단계 설명
3. **[PARAM]** - 파라미터 선택 이유
4. **[ALTERNATIVE]** - 대안과 비교
5. **[EDGE CASE]** - 엣지 케이스 처리
6. **[RESULT]** - 예상 결과

### Example

```cypher
// [WHY] 왜 shortestPath 대신 allShortestPaths를 사용하는가?
// 동일한 최단 거리를 가진 경로가 여러 개 있을 수 있고,
// 비즈니스에서 "모든 옵션"을 보여줘야 할 때 필요합니다.

// [STEP 1] 시작점과 끝점 매칭
// Alice와 Frank를 명시적으로 찾아 변수에 할당합니다.
MATCH (alice:Person {name: 'Alice'}), (frank:Person {name: 'Frank'})

// [STEP 2] 모든 최단 경로 탐색
// [PARAM] *..5: 최대 5홉으로 제한 (성능 보호)
// [ALTERNATIVE] *만 사용하면 무한 탐색 위험
MATCH path = allShortestPaths((alice)-[:KNOWS*..5]-(frank))

// [STEP 3] 결과 추출
// nodes(path)로 경로의 모든 노드를 리스트로 변환
// [EDGE CASE] 경로가 없으면 빈 결과 반환
RETURN
  [node IN nodes(path) | node.name] as route,
  length(path) as hops

// [RESULT] 예상 결과:
// ['Alice', 'Bob', 'Charlie', 'Frank'], 3
// ['Alice', 'Diana', 'Eve', 'Frank'], 3
```

---

## Common Pitfalls Section Format

```markdown
## Common Pitfalls (자주 하는 실수)

### 1. [카테고리] 실수 제목

**증상**: 어떤 문제가 발생하는가

**잘못된 코드**:
\`\`\`code
// 실수 예시
\`\`\`

**왜 잘못되었나**:
구체적인 원인 설명

**올바른 코드**:
\`\`\`code
// 수정된 코드
\`\`\`

**기억할 점**:
> 핵심 교훈을 인용구로 강조

---

### 2. [성능] 상한 없는 변수 길이 경로

**증상**: 쿼리가 타임아웃되거나 메모리 부족

**잘못된 코드**:
\`\`\`cypher
MATCH (a)-[:KNOWS*]->(b)  // 상한 없음!
RETURN a, b
\`\`\`

**왜 잘못되었나**:
그래프 전체를 탐색할 수 있어 기하급수적 복잡도

**올바른 코드**:
\`\`\`cypher
MATCH (a)-[:KNOWS*1..5]->(b)  // 상한 지정
RETURN a, b
LIMIT 100  // 추가 안전장치
\`\`\`

**기억할 점**:
> 변수 길이 경로는 항상 상한을 지정하세요. *..5 형식이 안전합니다.
```

---

## Checklist for Each Code Task

Before marking a code task as complete, verify:

- [ ] **Why Section**: 왜 이 기술이 필요한지 설명했는가?
- [ ] **Connection**: 이전 학습과 연결했는가?
- [ ] **Selection Criteria**: 선택 기준을 명시했는가?
- [ ] **Starter Code Guide**: TODO에 구체적인 가이드가 있는가?
- [ ] **Solution Comments**: 모든 주요 단계에 [WHY], [STEP], [PARAM] 주석이 있는가?
- [ ] **Common Pitfalls**: 최소 2개의 자주 하는 실수를 포함했는가?
- [ ] **Edge Cases**: 엣지 케이스 처리를 설명했는가?
- [ ] **Expected Results**: 예상 결과를 명시했는가?

---

## Template Application Order

1. **Week 2 Day 1**: First exemplar (완전한 템플릿 적용)
2. **Week 2 Day 2-5**: Apply same pattern
3. **Week 3-8**: Scale to remaining weeks

---

## Version History

- v1.0 (2025-01-04): Initial template guide created
