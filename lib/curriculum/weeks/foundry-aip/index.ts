// Phase 7, Week 7: AIP & AI Integration
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'aip-overview',
  title: 'AIP 플랫폼 개요',
  totalDuration: 180,
  tasks: [
    {
      id: 'aip-introduction',
      type: 'reading',
      title: 'AIP 소개',
      duration: 45,
      content: {
        objectives: [
          'AIP (Artificial Intelligence Platform)를 이해한다',
          'AIP의 핵심 기능을 파악한다',
          'Ontology와 AI 통합을 이해한다'
        ],
        markdown: `
## AIP 소개

### AIP란?

\`\`\`
AIP = Artificial Intelligence Platform

Foundry에 AI 기능을 통합한 플랫폼

핵심 기능:
├── LLM 통합
├── Agentic Workflows
├── AI-Powered Actions
└── Document Processing
\`\`\`

### AIP 아키텍처

\`\`\`
┌────────────────────────────────────────────────────┐
│                     AIP                             │
├────────────────────────────────────────────────────┤
│                                                     │
│  [AI Layer]                                         │
│  ├── LLM Integration (GPT-4, Claude, etc.)         │
│  ├── AIP Logic (함수 정의)                         │
│  └── Agentic Workflows                             │
│                   │                                 │
│                   ▼                                 │
│  [Ontology Layer]                                   │
│  ├── Object Types                                   │
│  ├── Links                                          │
│  └── Actions                                        │
│                   │                                 │
│                   ▼                                 │
│  [Application Layer]                                │
│  ├── Workshop (AI-powered)                          │
│  ├── Copilot                                        │
│  └── Custom Apps                                    │
│                                                     │
└────────────────────────────────────────────────────┘
\`\`\`

### AIP 주요 기능

| 기능 | 설명 | 사용 사례 |
|------|------|----------|
| **AIP Logic** | LLM 함수 정의 | 텍스트 분석, 분류 |
| **Agentic Workflows** | 에이전트 기반 자동화 | 문서 처리, 의사결정 |
| **AI Actions** | Action에 AI 통합 | 자동 분류, 요약 |
| **Copilot** | 자연어 인터페이스 | 데이터 질의 |

### Ontology + AI

\`\`\`
Ontology가 AI의 컨텍스트:

User Query: "삼성 관련 최근 주문 보여줘"
     │
     ▼
AIP가 Ontology 이해:
├── Customer Object (삼성전자)
├── Order Object
├── Customer-Order Link
└── Properties (date, amount, status)
     │
     ▼
정확한 Object Set 반환
\`\`\`
        `,
        externalLinks: [
          { title: 'AIP Overview', url: 'https://www.palantir.com/platforms/aip/' },
          { title: 'AIP Documentation', url: 'https://www.palantir.com/docs/foundry/aip-logic/' }
        ]
      }
    },
    {
      id: 'aip-components',
      type: 'reading',
      title: 'AIP 구성요소',
      duration: 45,
      content: {
        objectives: [
          'AIP Logic의 구조를 이해한다',
          'Agentic Workflows를 파악한다',
          '사용 사례를 학습한다'
        ],
        markdown: `
## AIP 구성요소

### AIP Logic

\`\`\`
AIP Logic = LLM 함수 정의

구성:
├── Input Parameters
├── Prompt Template
├── LLM Selection
├── Output Schema
└── Guardrails
\`\`\`

**예시: 텍스트 분류**
\`\`\`
Function: classifySupportTicket

Input:
├── ticket_text: String

Prompt:
"Classify this support ticket into one of:
 - Billing
 - Technical
 - General

 Ticket: {ticket_text}"

Output:
├── category: String
├── confidence: Float
└── reasoning: String
\`\`\`

### Agentic Workflows

\`\`\`
Agent = 자율적 AI 워크플로우

특징:
├── 목표 기반 동작
├── 도구 사용
├── 반복 개선
└── 인간 감독
\`\`\`

**예시: 문서 처리 Agent**
\`\`\`
Goal: 계약서에서 주요 정보 추출

Tools:
├── extractText: PDF → Text
├── identifyParties: 당사자 식별
├── extractTerms: 조건 추출
└── validateData: 검증

Flow:
1. PDF 업로드
2. 텍스트 추출
3. 정보 추출 (반복)
4. 검증 및 확인 요청
5. Ontology에 저장
\`\`\`

### AI Actions

\`\`\`
Ontology Action + AI:

예시: Auto-Categorize Order

Trigger: 새 주문 생성
AI Logic: 주문 내용 분석
Action: 자동 카테고리 설정
\`\`\`

### Copilot

\`\`\`
자연어 인터페이스:

User: "이번 달 VIP 고객 매출 합계는?"
     │
     ▼
Copilot:
├── Intent: 집계 쿼리
├── Entities: 고객(VIP), 주문, 금액
├── Timeframe: 이번 달
└── Execute Query
     │
     ▼
Response: "이번 달 VIP 고객 매출 합계는 ₩2.5억입니다."
\`\`\`
        `,
        externalLinks: [
          { title: 'AIP Logic', url: 'https://www.palantir.com/docs/foundry/aip-logic/' },
          { title: 'AIP Functions', url: 'https://www.palantir.com/docs/foundry/aip-logic/aip-functions/' }
        ]
      }
    },
    {
      id: 'aip-exploration',
      type: 'code',
      title: 'AIP 탐색 실습',
      duration: 60,
      content: {
        objectives: [
          'AIP Developer Tier를 탐색한다',
          '기본 AIP 기능을 체험한다',
          '사용 사례를 식별한다'
        ],
        instructions: `
## AIP 탐색 실습

### 목표
AIP 기능 탐색 및 사용 사례 도출

### 탐색 항목

1. **AIP Logic**
   - 기본 함수 예시 확인
   - 프롬프트 템플릿 구조

2. **Agentic Workflows**
   - 샘플 워크플로우 확인
   - 도구 구성 이해

3. **Copilot**
   - 자연어 쿼리 테스트
   - Ontology 연동 확인

### 사용 사례 식별

프로젝트에 적용 가능한 AI 기능:
1.
2.
3.

### 체크리스트

- [ ] AIP 환경 접근
- [ ] AIP Logic 탐색
- [ ] Copilot 테스트
- [ ] 사용 사례 문서화
        `,
        starterCode: `# AIP 탐색 결과

## AIP Logic 예시
-

## 사용 사례
| 기능 | 사용 사례 | 예상 효과 |
|------|----------|----------|
| | | |
`,
        solutionCode: `# AIP 탐색 결과

## AIP Logic 예시
- 텍스트 분류, 요약, 엔티티 추출

## 사용 사례
| 기능 | 사용 사례 | 예상 효과 |
|------|----------|----------|
| AIP Logic | 고객 문의 자동 분류 | 응답 시간 50% 단축 |
| Agent | 계약서 자동 분석 | 수작업 80% 감소 |
| Copilot | 경영진 데이터 질의 | 셀프서비스 가능 |
`
      }
    },
    {
      id: 'day1-quiz',
      type: 'quiz',
      title: 'AIP 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'AIP가 Ontology와 연동되는 이점은?',
            options: ['비용 절감', 'AI가 비즈니스 컨텍스트 이해', '성능 향상', '보안 강화'],
            answer: 1,
            explanation: 'Ontology를 통해 AI가 비즈니스 객체와 관계를 이해하여 정확한 결과를 제공합니다.'
          },
          {
            question: 'Agentic Workflow의 특징은?',
            options: ['수동 실행', '목표 기반 자율 동작', '1회성 작업', '배치 처리만'],
            answer: 1,
            explanation: 'Agentic Workflow는 목표를 설정하면 자율적으로 도구를 사용하여 작업을 수행합니다.'
          }
        ]
      }
    },
    {
      id: 'day1-project',
      type: 'project',
      title: 'AI 활용 계획',
      duration: 15,
      content: {
        objectives: [
          '프로젝트의 AI 활용 계획을 수립한다'
        ],
        requirements: [
          '**AI 활용 계획서**',
          '',
          '## AI 사용 사례',
          '| 기능 | 사용 사례 | 우선순위 |',
          '|------|----------|---------|',
          '| | | |'
        ],
        evaluationCriteria: [
          'AI 활용 계획 구체성'
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'aip-logic',
  title: 'AIP Logic 구현',
  totalDuration: 180,
  tasks: [
    {
      id: 'aip-logic-basics',
      type: 'reading',
      title: 'AIP Logic 기초',
      duration: 45,
      content: {
        objectives: [
          'AIP Logic 함수 작성 방법을 이해한다',
          '프롬프트 엔지니어링을 익힌다',
          '출력 스키마를 정의한다'
        ],
        markdown: `
## AIP Logic 기초

### 함수 구조

\`\`\`
AIP Logic Function:
├── Name: 함수 이름
├── Description: 설명
├── Input Parameters: 입력
├── Prompt Template: 프롬프트
├── Model: LLM 선택
├── Output Schema: 출력 구조
└── Guardrails: 안전장치
\`\`\`

### 프롬프트 템플릿

\`\`\`
템플릿 구성:
├── System Prompt: 역할 정의
├── Context: 배경 정보
├── Input Placeholder: {variable}
├── Output Format: JSON, Text
└── Examples: Few-shot

예시:
"You are a customer service classifier.

Given a customer message, classify it into:
- Billing: payment, invoice, charge
- Technical: bug, error, not working
- General: other inquiries

Customer Message: {message}

Respond in JSON format:
{{
  "category": "...",
  "confidence": 0.0-1.0,
  "keywords": ["..."]
}}"
\`\`\`

### 출력 스키마

\`\`\`
Output Schema 정의:
├── Type: Object, Array, String
├── Properties: 각 필드
├── Required: 필수 필드
└── Validation: 검증 규칙

예시:
{
  "type": "object",
  "properties": {
    "category": { "type": "string" },
    "confidence": { "type": "number" },
    "keywords": { "type": "array" }
  },
  "required": ["category", "confidence"]
}
\`\`\`

### Guardrails

\`\`\`
안전장치:
├── Input Validation: 입력 검증
├── Output Validation: 출력 검증
├── Rate Limiting: 호출 제한
├── Content Filtering: 부적절 콘텐츠 차단
└── Audit Logging: 감사 로그
\`\`\`
        `,
        externalLinks: [
          { title: 'AIP Logic Guide', url: 'https://www.palantir.com/docs/foundry/aip-logic/create-function/' }
        ]
      }
    },
    {
      id: 'aip-logic-exercise',
      type: 'code',
      title: 'AIP Logic 구현 실습',
      duration: 90,
      content: {
        objectives: [
          'AIP Logic 함수를 생성한다',
          '프롬프트를 최적화한다',
          '테스트한다'
        ],
        instructions: `
## AIP Logic 구현 실습

### 목표
고객 피드백 분석 함수 구현

### 함수 정의

\`\`\`
Function: analyzeFeedback

Input:
├── feedback_text: String

Output:
├── sentiment: positive/negative/neutral
├── score: 1-5
├── topics: Array<String>
├── summary: String (50자 이내)
\`\`\`

### 프롬프트 설계

\`\`\`
System: You are a customer feedback analyst.

Task: Analyze the following customer feedback.

Feedback: {feedback_text}

Provide:
1. Sentiment (positive/negative/neutral)
2. Score (1-5)
3. Key topics (max 3)
4. Brief summary (under 50 chars)

Respond in JSON format only.
\`\`\`

### 테스트 케이스

1. 긍정적 피드백
2. 부정적 피드백
3. 중립적 피드백
4. 복합 감정

### 체크리스트

- [ ] 함수 정의
- [ ] 프롬프트 작성
- [ ] 출력 스키마
- [ ] 테스트 수행
- [ ] 결과 검증
        `,
        starterCode: `# AIP Logic 설계

## Function: analyzeFeedback

### Input
| Parameter | Type | Description |
|-----------|------|-------------|
| | | |

### Prompt Template
\`\`\`
[프롬프트 작성]
\`\`\`

### Output Schema
\`\`\`json
{
}
\`\`\`

### Test Cases
| Input | Expected Output |
|-------|-----------------|
| | |
`,
        solutionCode: `# AIP Logic 설계 완료

## Function: analyzeFeedback

### Input
| Parameter | Type | Description |
|-----------|------|-------------|
| feedback_text | String | 고객 피드백 텍스트 |

### Prompt Template
\`\`\`
You are a customer feedback analyst for an e-commerce platform.

Analyze the following customer feedback:
"{feedback_text}"

Provide analysis in JSON format:
{
  "sentiment": "positive" | "negative" | "neutral",
  "score": 1-5,
  "topics": ["topic1", "topic2"],
  "summary": "brief summary under 50 chars"
}
\`\`\`

### Output Schema
\`\`\`json
{
  "type": "object",
  "properties": {
    "sentiment": { "type": "string", "enum": ["positive", "negative", "neutral"] },
    "score": { "type": "integer", "minimum": 1, "maximum": 5 },
    "topics": { "type": "array", "items": { "type": "string" } },
    "summary": { "type": "string", "maxLength": 50 }
  },
  "required": ["sentiment", "score", "topics", "summary"]
}
\`\`\`

### Test Cases
| Input | Expected Output |
|-------|-----------------|
| "배송이 빠르고 제품도 좋아요!" | positive, 5, ["배송", "제품품질"] |
| "제품이 불량이에요" | negative, 1, ["제품불량"] |
`
      }
    },
    {
      id: 'day2-quiz',
      type: 'quiz',
      title: 'AIP Logic 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'AIP Logic에서 Output Schema의 역할은?',
            options: ['입력 검증', '출력 구조화 및 검증', '로깅', '캐싱'],
            answer: 1,
            explanation: 'Output Schema는 LLM 출력을 구조화하고 검증합니다.'
          }
        ]
      }
    },
    {
      id: 'day2-project',
      type: 'project',
      title: 'AIP Logic 함수 설계',
      duration: 30,
      content: {
        objectives: [
          '프로젝트에 필요한 AIP Logic 함수를 설계한다'
        ],
        requirements: [
          '**AIP Logic 함수 목록**',
          '',
          '| Function | Input | Output | Use Case |',
          '|----------|-------|--------|----------|',
          '| | | | |'
        ],
        evaluationCriteria: [
          '함수 설계 완성도'
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'agentic-workflows',
  title: 'Agentic Workflows',
  totalDuration: 180,
  tasks: [
    {
      id: 'agent-concepts',
      type: 'reading',
      title: 'Agent 개념',
      duration: 45,
      content: {
        objectives: [
          'Agentic Workflow 아키텍처를 이해한다',
          'Tool 정의와 사용을 파악한다',
          '인간 감독 패턴을 익힌다'
        ],
        markdown: `
## Agent 개념

### Agentic Workflow 아키텍처

\`\`\`
Agent 구성:
├── Goal: 목표 정의
├── Tools: 사용 가능한 도구
├── Memory: 상태 저장
├── Reasoning: 의사결정
└── Human Oversight: 인간 감독
\`\`\`

### Tool 정의

\`\`\`
Tool = Agent가 사용하는 기능

유형:
├── Ontology Tools
│   ├── Search Objects
│   ├── Get Object Details
│   └── Execute Action
├── Data Tools
│   ├── Query Dataset
│   └── Aggregate
├── External Tools
│   ├── API Call
│   └── File Processing
└── AI Tools
    ├── Summarize
    └── Classify
\`\`\`

### Agent 실행 흐름

\`\`\`
1. 목표 수신
   └── "이 PDF에서 계약 정보 추출"

2. 계획 수립
   ├── Step 1: PDF → Text
   ├── Step 2: 당사자 추출
   ├── Step 3: 조건 추출
   └── Step 4: 검증

3. Tool 실행 (반복)
   ├── extractText(pdf)
   ├── identifyParties(text)
   └── extractTerms(text)

4. 결과 검증
   └── 인간 확인 요청 (필요시)

5. 완료
   └── Ontology에 저장
\`\`\`

### Human-in-the-Loop

\`\`\`
감독 패턴:
├── Approval: 중요 결정 승인
├── Review: 결과 검토
├── Correction: 오류 수정
├── Escalation: 복잡한 케이스 전달
└── Feedback: 개선 피드백
\`\`\`
        `,
        externalLinks: [
          { title: 'AIP Agents', url: 'https://www.palantir.com/docs/foundry/aip-agents/' }
        ]
      }
    },
    {
      id: 'agent-exercise',
      type: 'code',
      title: 'Agent 워크플로우 실습',
      duration: 90,
      content: {
        objectives: [
          'Agent 워크플로우를 설계한다',
          'Tools를 정의한다',
          '감독 포인트를 설정한다'
        ],
        instructions: `
## Agent 워크플로우 실습

### 목표
문서 분석 Agent 설계

### 시나리오
계약서 PDF 업로드 → 정보 추출 → 검증 → 저장

### 워크플로우 설계

\`\`\`
Goal: 계약서에서 핵심 정보 추출 및 저장

Tools:
├── extractPdfText: PDF → Text
├── identifyParties: 당사자 식별
├── extractDates: 날짜 추출
├── extractAmount: 금액 추출
├── saveContract: Ontology 저장

Human Oversight:
├── 추출 결과 검증 요청
└── 불확실한 경우 에스컬레이션
\`\`\`

### 체크리스트

- [ ] 목표 정의
- [ ] Tools 정의
- [ ] 워크플로우 설계
- [ ] 감독 포인트 설정
        `,
        starterCode: `# Agent Workflow 설계

## Goal
-

## Tools
| Tool | Input | Output | Description |
|------|-------|--------|-------------|
| | | | |

## Workflow Steps
1.
2.
3.

## Human Oversight
-
`,
        solutionCode: `# Agent Workflow 설계 완료

## Goal
계약서 PDF에서 핵심 정보(당사자, 날짜, 금액)를 추출하여 Contract Object로 저장

## Tools
| Tool | Input | Output | Description |
|------|-------|--------|-------------|
| extractPdfText | PDF file | String | PDF 텍스트 추출 |
| identifyParties | text | Array<Party> | 계약 당사자 식별 |
| extractDates | text | {start, end} | 계약 기간 추출 |
| extractAmount | text | Number | 계약 금액 추출 |
| saveContract | Contract | Contract ID | Ontology 저장 |

## Workflow Steps
1. PDF 업로드 수신
2. extractPdfText 실행
3. 병렬: identifyParties, extractDates, extractAmount
4. 결과 조합 및 검증
5. 신뢰도 < 80%면 Human Review 요청
6. saveContract 실행

## Human Oversight
- 추출 신뢰도 80% 미만: 검증 요청
- 금액 1억 초과: 승인 요청
- 오류 발생: 에스컬레이션
`
      }
    },
    {
      id: 'day3-quiz',
      type: 'quiz',
      title: 'Agentic Workflows 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Human-in-the-Loop의 목적은?',
            options: ['성능 향상', '중요 결정의 인간 감독', '비용 절감', '자동화 제거'],
            answer: 1,
            explanation: 'Human-in-the-Loop은 중요하거나 불확실한 결정에 대해 인간의 감독을 보장합니다.'
          }
        ]
      }
    },
    {
      id: 'day3-project',
      type: 'project',
      title: 'Agent 설계',
      duration: 30,
      content: {
        objectives: [
          '프로젝트의 Agent를 설계한다'
        ],
        requirements: [
          '**Agent 설계서**',
          '',
          '## Agent 목록',
          '| Agent | Goal | Tools | Oversight |',
          '|-------|------|-------|-----------|',
          '| | | | |'
        ],
        evaluationCriteria: [
          'Agent 설계 완성도'
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'ai-integration',
  title: 'AI 통합 실습',
  totalDuration: 180,
  tasks: [
    {
      id: 'ai-workshop-integration',
      type: 'reading',
      title: 'Workshop AI 통합',
      duration: 40,
      content: {
        objectives: [
          'Workshop에 AI 기능을 통합한다',
          'Copilot 위젯을 활용한다',
          'AI-powered Actions를 구현한다'
        ],
        markdown: `
## Workshop AI 통합

### AI Widgets

\`\`\`
AI 위젯:
├── Copilot Widget
│   └── 자연어 질의 인터페이스
├── AI Summary Widget
│   └── 객체 요약 표시
├── AI Recommendation
│   └── 추천 표시
└── AI Chat
    └── 대화형 인터페이스
\`\`\`

### Copilot 통합

\`\`\`
Copilot 설정:
├── Ontology 범위 설정
├── 허용 질의 유형
├── 응답 형식
└── 권한 제어

예시 질의:
├── "이번 주 VIP 고객 주문 보여줘"
├── "가장 많이 팔린 제품 Top 10"
└── "지연된 주문 개수는?"
\`\`\`

### AI-powered Actions

\`\`\`
Action에 AI 추가:

예시: Smart Categorization

Trigger: 새 티켓 생성
AI Logic: 티켓 내용 분석
Action: 자동 카테고리 설정 + 담당자 배정
\`\`\`
        `,
        externalLinks: [
          { title: 'AIP in Workshop', url: 'https://www.palantir.com/docs/foundry/workshop/aip-widgets/' }
        ]
      }
    },
    {
      id: 'ai-integration-exercise',
      type: 'code',
      title: 'AI 통합 실습',
      duration: 100,
      content: {
        objectives: [
          'Workshop에 AI 기능을 추가한다',
          'AI Action을 구현한다',
          '테스트한다'
        ],
        instructions: `
## AI 통합 실습

### 목표
운영 앱에 AI 기능 추가

### 구현 항목

1. **Copilot 위젯**
   - 대시보드에 추가
   - Ontology 연결
   - 샘플 질의 테스트

2. **AI Summary**
   - 상세 화면에 요약 추가
   - Object 정보 기반 요약

3. **AI Action**
   - 티켓 자동 분류
   - AIP Logic 연동

### 체크리스트

- [ ] Copilot 위젯 추가
- [ ] AI Summary 구현
- [ ] AI Action 연동
- [ ] 테스트
        `,
        starterCode: `# AI 통합 설계

## Copilot 설정
- Ontology 범위:
- 샘플 질의:

## AI Actions
| Action | AI Logic | Trigger |
|--------|----------|---------|
| | | |
`,
        solutionCode: `# AI 통합 설계 완료

## Copilot 설정
- Ontology 범위: Customer, Order, Product
- 샘플 질의:
  - "이번 달 매출 합계"
  - "VIP 고객 목록"
  - "지연 주문 수"

## AI Actions
| Action | AI Logic | Trigger |
|--------|----------|---------|
| categorizeTicket | classifyTicket | 티켓 생성 |
| suggestResponse | generateResponse | 티켓 조회 |
| detectAnomaly | analyzeOrder | 주문 생성 |
`
      }
    },
    {
      id: 'day4-quiz',
      type: 'quiz',
      title: 'AI 통합 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Copilot의 주요 기능은?',
            options: ['코드 작성', '자연어 데이터 질의', '파일 업로드', '권한 관리'],
            answer: 1,
            explanation: 'Copilot은 자연어로 Ontology 데이터를 질의할 수 있는 인터페이스입니다.'
          }
        ]
      }
    },
    {
      id: 'day4-project',
      type: 'project',
      title: 'AI 기능 구현',
      duration: 25,
      content: {
        objectives: [
          '앱에 AI 기능을 추가한다'
        ],
        requirements: [
          '**AI 기능 목록**',
          '',
          '| 기능 | 구현 상태 | 테스트 결과 |',
          '|------|----------|------------|',
          '| | | |'
        ],
        evaluationCriteria: [
          'AI 기능 구현 완성도'
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'week7-checkpoint',
  title: 'Week 7 체크포인트',
  totalDuration: 180,
  tasks: [
    {
      id: 'aip-project',
      type: 'project',
      title: 'AIP 종합 프로젝트',
      duration: 120,
      content: {
        objectives: [
          'AI 기능을 종합하여 프로젝트를 완성한다'
        ],
        requirements: [
          '**AIP 종합 프로젝트**',
          '',
          '## 요구사항',
          '',
          '1. **AIP Logic 함수**',
          '   - 최소 2개 함수 구현',
          '   - 테스트 완료',
          '',
          '2. **Agent 워크플로우**',
          '   - 1개 이상 설계',
          '   - Human Oversight 포함',
          '',
          '3. **Workshop 통합**',
          '   - AI 위젯 포함',
          '   - AI Action 연동',
          '',
          '## 산출물',
          '- [ ] AIP Logic 함수',
          '- [ ] Agent 설계',
          '- [ ] AI-powered 앱',
          '- [ ] 문서'
        ],
        evaluationCriteria: [
          'AIP Logic (30%)',
          'Agent (30%)',
          '통합 (25%)',
          '문서화 (15%)'
        ]
      }
    },
    {
      id: 'week7-review',
      type: 'challenge',
      title: 'Week 7 체크포인트',
      duration: 60,
      content: {
        objectives: [
          'Week 7 산출물을 점검한다',
          '자격증 시험 준비'
        ],
        requirements: [
          '**Week 7 산출물 체크리스트**',
          '',
          '□ AIP Logic 함수 (2개+)',
          '□ Agent 워크플로우',
          '□ Workshop AI 통합',
          '□ **AIP 프로젝트**',
          '',
          '**Week 8 계획: 자격증 & 마무리**',
          '',
          '- 자격증 복습',
          '- 모의시험',
          '- 포트폴리오 정리'
        ],
        evaluationCriteria: [
          '산출물 완성도'
        ]
      }
    }
  ]
}

export const foundryAipWeek: Week = {
  slug: 'foundry-aip',
  week: 7,
  phase: 7,
  month: 14,
  access: 'pro',
  title: 'AIP & AI Integration',
  topics: ['AIP Platform', 'AIP Logic', 'Agentic Workflows', 'Copilot', 'AI Actions'],
  practice: 'AIP 종합 프로젝트',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
