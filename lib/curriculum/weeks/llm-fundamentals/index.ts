// Phase 5, Week 1: LLM 기초 & 프롬프트 엔지니어링
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'llm-basics',
  title: 'LLM의 이해',
  totalDuration: 180,
  tasks: [
    {
      id: 'llm-intro-video',
      type: 'video',
      title: 'LLM이란 무엇인가?',
      duration: 30,
      content: {
        objectives: [
          'LLM의 기본 원리와 아키텍처를 이해한다',
          'Transformer 구조의 핵심 개념을 파악한다',
          '주요 LLM 모델들의 특징을 비교한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=llm-intro-placeholder',
        transcript: `
## LLM (Large Language Model) 기초

### LLM이란?

\`\`\`
Large Language Model
├── Large: 수십억~수조 개의 파라미터
├── Language: 자연어 이해 및 생성
└── Model: 확률적 패턴 학습
\`\`\`

**핵심 능력**:
- 텍스트 생성 (Completion)
- 질의응답 (Q&A)
- 요약 (Summarization)
- 번역 (Translation)
- 코드 생성 (Code Generation)
- 추론 (Reasoning)

### Transformer 아키텍처

\`\`\`
입력 텍스트
    ↓
[Tokenization] → 토큰 ID 시퀀스
    ↓
[Embedding] → 벡터 표현
    ↓
┌─────────────────────────────┐
│   Transformer Blocks (N)    │
│  ┌───────────────────────┐  │
│  │  Self-Attention       │  │
│  │  (문맥 파악)           │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  Feed Forward         │  │
│  │  (패턴 학습)           │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
    ↓
[Output Layer]
    ↓
다음 토큰 확률 분포
\`\`\`

### Self-Attention 메커니즘

\`\`\`python
# 개념적 이해
sentence = "The cat sat on the mat"

# Self-Attention은 각 단어가 다른 단어와의 관계를 파악
# "sat"은 "cat"과 강한 연관 (주어-동사)
# "mat"은 "on"과 강한 연관 (전치사-목적어)

attention_weights = {
    "sat": {"cat": 0.7, "on": 0.2, "mat": 0.1},
    "mat": {"on": 0.6, "sat": 0.2, "the": 0.2}
}
\`\`\`

### 주요 LLM 모델 비교

| 모델 | 회사 | 파라미터 | 특징 |
|------|------|----------|------|
| **GPT-4o** | OpenAI | ~1.8T | 멀티모달, 최고 성능 |
| **Claude 3.5** | Anthropic | 비공개 | 긴 컨텍스트, 안전성 |
| **Gemini Pro** | Google | 비공개 | 멀티모달, 검색 연동 |
| **Llama 3** | Meta | 8B-70B | 오픈소스, 상업 가능 |
| **Mistral** | Mistral | 7B-8x7B | 오픈소스, 효율적 |

### 모델 선택 기준

\`\`\`
프로덕션 선택 가이드:

성능 우선          → GPT-4o, Claude 3.5 Opus
비용 효율          → GPT-4o-mini, Claude Haiku
긴 컨텍스트       → Claude (200K), Gemini (1M)
오픈소스/자체호스팅 → Llama 3, Mistral
코드 특화          → GPT-4, Claude, Codestral
\`\`\`
        `
      }
    },
    {
      id: 'llm-api-video',
      type: 'video',
      title: 'LLM API 활용하기',
      duration: 25,
      content: {
        objectives: [
          'OpenAI API 사용법을 익힌다',
          'Anthropic Claude API를 활용한다',
          'API 파라미터의 역할을 이해한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=llm-api-placeholder',
        transcript: `
## LLM API 실전 활용

### OpenAI API

\`\`\`python
from openai import OpenAI

client = OpenAI(api_key="sk-...")

# 기본 Chat Completion
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "당신은 도움이 되는 AI 어시스턴트입니다."},
        {"role": "user", "content": "Python의 장점을 3가지 알려주세요."}
    ],
    temperature=0.7,
    max_tokens=500
)

print(response.choices[0].message.content)
\`\`\`

### Anthropic Claude API

\`\`\`python
from anthropic import Anthropic

client = Anthropic(api_key="sk-ant-...")

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Python의 장점을 3가지 알려주세요."}
    ]
)

print(message.content[0].text)
\`\`\`

### API 파라미터 이해

| 파라미터 | 설명 | 권장값 |
|----------|------|--------|
| **temperature** | 창의성 (0=결정적, 2=창의적) | 0.7 |
| **max_tokens** | 최대 출력 토큰 수 | 용도별 조절 |
| **top_p** | 누적 확률 컷오프 | 0.9 |
| **frequency_penalty** | 반복 단어 억제 | 0-0.5 |
| **presence_penalty** | 새 주제 유도 | 0-0.5 |

### Temperature 효과

\`\`\`python
# temperature=0 (결정적)
# 항상 동일한 출력, 팩트 기반 작업에 적합

# temperature=0.7 (균형)
# 적절한 다양성, 일반적 대화에 적합

# temperature=1.5 (창의적)
# 예측 불가능, 브레인스토밍에 적합
\`\`\`

### 비용 최적화

\`\`\`python
# 모델별 가격 (1M tokens 기준, 2024)
pricing = {
    "gpt-4o": {"input": 2.50, "output": 10.00},
    "gpt-4o-mini": {"input": 0.15, "output": 0.60},
    "claude-3.5-sonnet": {"input": 3.00, "output": 15.00},
    "claude-3-haiku": {"input": 0.25, "output": 1.25}
}

# 전략: 간단한 작업 → 저렴한 모델
#       복잡한 작업 → 고성능 모델
\`\`\`
        `
      }
    },
    {
      id: 'llm-api-practice',
      type: 'code',
      title: 'LLM API 실습',
      duration: 60,
      content: {
        objectives: [
          'OpenAI와 Anthropic API를 직접 호출한다',
          '다양한 파라미터를 실험한다',
          '에러 처리와 재시도 로직을 구현한다'
        ],
        instructions: `
## 실습: LLM API 활용

### 목표
다양한 LLM API를 호출하고 응답을 비교하세요.

### 과제
1. OpenAI GPT-4o-mini로 질문 응답
2. Claude로 동일한 질문 응답
3. Temperature 변경에 따른 출력 비교
4. 에러 처리 및 재시도 로직 구현
        `,
        starterCode: `import os
from openai import OpenAI
from anthropic import Anthropic

# API 키 설정
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def ask_gpt(question: str, temperature: float = 0.7) -> str:
    """OpenAI GPT에게 질문"""
    # TODO: 구현
    pass

def ask_claude(question: str, temperature: float = 0.7) -> str:
    """Anthropic Claude에게 질문"""
    # TODO: 구현
    pass

def compare_responses(question: str):
    """두 모델의 응답 비교"""
    # TODO: 구현
    pass

# 테스트
if __name__ == "__main__":
    question = "인공지능의 미래에 대해 간단히 설명해주세요."
    compare_responses(question)
`,
        solutionCode: `import os
import time
from openai import OpenAI
from anthropic import Anthropic

# API 키 설정
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def ask_gpt(question: str, temperature: float = 0.7, max_retries: int = 3) -> str:
    """OpenAI GPT에게 질문 (재시도 로직 포함)"""
    for attempt in range(max_retries):
        try:
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "간결하고 명확하게 답변하세요."},
                    {"role": "user", "content": question}
                ],
                temperature=temperature,
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                raise e

def ask_claude(question: str, temperature: float = 0.7, max_retries: int = 3) -> str:
    """Anthropic Claude에게 질문 (재시도 로직 포함)"""
    for attempt in range(max_retries):
        try:
            message = anthropic_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=500,
                messages=[
                    {"role": "user", "content": question}
                ],
                temperature=temperature
            )
            return message.content[0].text
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            else:
                raise e

def compare_responses(question: str):
    """두 모델의 응답 비교"""
    print(f"질문: {question}\\n")
    print("=" * 50)

    # GPT 응답
    print("\\n[GPT-4o-mini 응답]")
    gpt_response = ask_gpt(question)
    print(gpt_response)

    print("\\n" + "=" * 50)

    # Claude 응답
    print("\\n[Claude 3.5 Sonnet 응답]")
    claude_response = ask_claude(question)
    print(claude_response)

    # Temperature 비교
    print("\\n" + "=" * 50)
    print("\\n[Temperature 비교 (GPT)]")

    for temp in [0, 0.7, 1.5]:
        print(f"\\nTemperature={temp}:")
        response = ask_gpt("숫자 1부터 5까지 재미있게 나열해주세요.", temperature=temp)
        print(response[:200] + "..." if len(response) > 200 else response)

# 테스트
if __name__ == "__main__":
    question = "인공지능의 미래에 대해 간단히 설명해주세요."
    compare_responses(question)
`
      }
    },
    {
      id: 'llm-basics-quiz',
      type: 'quiz',
      title: 'LLM 기초 퀴즈',
      duration: 15,
      content: {
        objectives: ['LLM 기초 개념을 복습한다'],
        questions: [
          {
            question: 'Transformer 아키텍처에서 Self-Attention의 주요 역할은?',
            options: [
              '입력 텍스트를 토큰으로 분리',
              '각 단어가 다른 단어와의 관계(문맥)를 파악',
              '출력 텍스트의 문법 검사',
              '모델 파라미터 최적화'
            ],
            answer: 1,
            explanation: 'Self-Attention은 입력 시퀀스의 각 위치가 다른 모든 위치와의 관계를 계산하여 문맥을 파악합니다.'
          },
          {
            question: 'Temperature 파라미터를 0으로 설정하면?',
            options: [
              '가장 창의적인 출력 생성',
              '항상 동일한 출력 (결정적)',
              '응답 속도가 빨라짐',
              '토큰 수가 줄어듦'
            ],
            answer: 1,
            explanation: 'Temperature=0이면 항상 가장 확률이 높은 토큰만 선택하여 동일한 입력에 동일한 출력을 생성합니다.'
          },
          {
            question: '비용 효율적인 프로덕션 배포를 위한 모델 선택 전략은?',
            options: [
              '항상 최신 최고 성능 모델 사용',
              '간단한 작업은 저렴한 모델, 복잡한 작업은 고성능 모델',
              '오픈소스 모델만 사용',
              '파라미터 수가 가장 많은 모델 사용'
            ],
            answer: 1,
            explanation: '작업 복잡도에 따라 모델을 선택하면 비용을 크게 절감하면서 품질을 유지할 수 있습니다.'
          }
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'prompt-engineering-basics',
  title: '프롬프트 엔지니어링 기초',
  totalDuration: 180,
  tasks: [
    {
      id: 'prompt-basics-video',
      type: 'video',
      title: '프롬프트 엔지니어링 원칙',
      duration: 30,
      content: {
        objectives: [
          '효과적인 프롬프트 작성 원칙을 이해한다',
          '프롬프트 구조와 구성 요소를 파악한다',
          'Few-shot 프롬프팅을 활용한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=prompt-basics-placeholder',
        transcript: `
## 프롬프트 엔지니어링 기초

### 프롬프트란?

\`\`\`
프롬프트 = LLM에게 주는 지시사항 + 컨텍스트 + 예시

좋은 프롬프트의 특징:
├── 명확한 지시 (Clear Instructions)
├── 충분한 컨텍스트 (Context)
├── 구체적인 출력 형식 (Output Format)
└── 적절한 예시 (Examples)
\`\`\`

### 프롬프트 구조

\`\`\`
┌─────────────────────────────────────┐
│ System Prompt (시스템 프롬프트)      │
│ - 역할 정의                          │
│ - 행동 지침                          │
│ - 제약 조건                          │
├─────────────────────────────────────┤
│ User Prompt (사용자 프롬프트)        │
│ - 구체적인 작업 요청                 │
│ - 입력 데이터                        │
│ - 출력 형식 지정                     │
└─────────────────────────────────────┘
\`\`\`

### 프롬프트 작성 원칙

**1. 명확하게 작성하기**
\`\`\`
❌ 나쁜 예: "이메일 써줘"
✅ 좋은 예: "고객에게 배송 지연을 사과하는 공식 이메일을 작성해주세요.
            - 톤: 정중하고 전문적
            - 길이: 150단어 이내
            - 포함 내용: 지연 사유, 새 배송일, 보상 안내"
\`\`\`

**2. 구조화하기**
\`\`\`
❌ 나쁜 예: "다음 텍스트를 분석하고 요약하고 감정도 분석해줘"
✅ 좋은 예:
"다음 텍스트를 분석하세요.

## 작업 순서
1. 핵심 내용 3줄 요약
2. 감정 분석 (긍정/부정/중립)
3. 주요 키워드 5개 추출

## 출력 형식
- 요약: [3줄]
- 감정: [긍정/부정/중립] (신뢰도: XX%)
- 키워드: [키워드1, 키워드2, ...]"
\`\`\`

**3. 예시 제공하기 (Few-shot)**
\`\`\`
입력: "이 제품 정말 별로예요"
출력: {"sentiment": "negative", "confidence": 0.9}

입력: "그냥 그래요 보통이에요"
출력: {"sentiment": "neutral", "confidence": 0.7}

입력: "배송도 빠르고 품질도 좋아요!"
출력:
\`\`\`

### Zero-shot vs Few-shot vs Many-shot

| 방식 | 예시 수 | 사용 시점 |
|------|---------|----------|
| **Zero-shot** | 0개 | 간단한 작업, 명확한 지시 |
| **Few-shot** | 2-5개 | 특정 형식/스타일 필요 |
| **Many-shot** | 10+개 | 복잡한 패턴 학습 필요 |
        `
      }
    },
    {
      id: 'prompt-techniques-video',
      type: 'video',
      title: '고급 프롬프팅 기법',
      duration: 30,
      content: {
        objectives: [
          'Chain-of-Thought 프롬프팅을 이해한다',
          'Role 프롬프팅과 페르소나 설정을 활용한다',
          '출력 형식 제어 기법을 익힌다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=prompt-techniques-placeholder',
        transcript: `
## 고급 프롬프팅 기법

### Chain-of-Thought (CoT) 프롬프팅

\`\`\`
일반 프롬프트:
"15% 할인된 가격이 $85라면 원래 가격은?"
→ LLM이 바로 답을 추측 (오류 가능)

CoT 프롬프트:
"15% 할인된 가격이 $85라면 원래 가격은?
단계별로 생각해보세요."
→ LLM이 추론 과정을 보여줌

Step 1: 할인된 가격 = 원래 가격 × (1 - 0.15)
Step 2: $85 = 원래 가격 × 0.85
Step 3: 원래 가격 = $85 / 0.85 = $100
\`\`\`

### Role 프롬프팅

\`\`\`python
system_prompt = """
당신은 10년 경력의 시니어 Python 개발자입니다.

특성:
- 클린 코드와 SOLID 원칙을 중시
- 성능 최적화에 관심
- 주니어 개발자에게 친절하게 설명

답변 시:
1. 먼저 문제를 분석
2. 해결 방안 제시
3. 코드 예제 제공
4. 주의사항 안내
"""
\`\`\`

### 출력 형식 제어

**JSON 출력 강제**
\`\`\`python
prompt = """
다음 리뷰를 분석하세요.

리뷰: "{review_text}"

반드시 아래 JSON 형식으로만 응답하세요:
{
  "sentiment": "positive" | "negative" | "neutral",
  "confidence": 0.0-1.0,
  "keywords": ["키워드1", "키워드2"],
  "summary": "한 문장 요약"
}
"""
\`\`\`

**마크다운 테이블 출력**
\`\`\`
분석 결과를 마크다운 테이블로 정리하세요:

| 항목 | 값 | 비고 |
|------|---|------|
| ... | ... | ... |
\`\`\`

### Self-Consistency (자기 일관성)

\`\`\`python
def self_consistent_answer(question: str, n: int = 5):
    """여러 번 답변 생성 후 다수결"""
    answers = []
    for _ in range(n):
        response = ask_llm(question, temperature=0.7)
        answers.append(extract_answer(response))

    # 가장 많이 나온 답변 선택
    from collections import Counter
    return Counter(answers).most_common(1)[0][0]
\`\`\`

### 프롬프트 체이닝

\`\`\`
복잡한 작업 분해:

[사용자 요청]
    ↓
[프롬프트 1: 요구사항 분석]
    ↓
[프롬프트 2: 계획 수립]
    ↓
[프롬프트 3: 실행]
    ↓
[프롬프트 4: 검증]
    ↓
[최종 결과]
\`\`\`
        `
      }
    },
    {
      id: 'prompt-practice',
      type: 'code',
      title: '프롬프트 엔지니어링 실습',
      duration: 60,
      content: {
        objectives: [
          '다양한 프롬프팅 기법을 실습한다',
          '프롬프트 템플릿을 작성한다',
          '출력 품질을 개선한다'
        ],
        instructions: `
## 실습: 프롬프트 엔지니어링

### 과제 1: 감정 분석 프롬프트
고객 리뷰의 감정을 분석하는 프롬프트를 작성하세요.
- JSON 형식 출력
- Few-shot 예시 포함
- 신뢰도 점수 포함

### 과제 2: 코드 리뷰 프롬프트
Python 코드를 리뷰하는 시니어 개발자 역할 프롬프트를 작성하세요.
- Role 프롬프팅 적용
- 구조화된 피드백 형식
- 개선 코드 제안

### 과제 3: 단계별 문제 해결
수학 문제를 Chain-of-Thought로 해결하는 프롬프트를 작성하세요.
        `,
        starterCode: `from openai import OpenAI
import json

client = OpenAI()

# 과제 1: 감정 분석 프롬프트
SENTIMENT_PROMPT = """
# TODO: Few-shot 감정 분석 프롬프트 작성
"""

def analyze_sentiment(review: str) -> dict:
    """리뷰 감정 분석"""
    # TODO: 구현
    pass

# 과제 2: 코드 리뷰 프롬프트
CODE_REVIEW_SYSTEM = """
# TODO: 시니어 개발자 역할 프롬프트 작성
"""

def review_code(code: str) -> str:
    """코드 리뷰"""
    # TODO: 구현
    pass

# 과제 3: CoT 수학 문제 해결
def solve_math_problem(problem: str) -> str:
    """Chain-of-Thought로 수학 문제 해결"""
    # TODO: 구현
    pass

# 테스트
if __name__ == "__main__":
    # 감정 분석 테스트
    reviews = [
        "정말 최고의 제품이에요! 강추합니다.",
        "배송이 너무 느려서 화가 납니다.",
        "그냥 그래요. 가격 대비 보통입니다."
    ]

    for review in reviews:
        result = analyze_sentiment(review)
        print(f"리뷰: {review}")
        print(f"분석: {result}\\n")
`,
        solutionCode: `from openai import OpenAI
import json

client = OpenAI()

# 과제 1: 감정 분석 프롬프트 (Few-shot)
SENTIMENT_PROMPT = """고객 리뷰의 감정을 분석하세요.

## 예시

입력: "이 제품 진짜 별로예요. 돈 아까워요."
출력: {"sentiment": "negative", "confidence": 0.95, "reason": "부정적 표현 다수"}

입력: "괜찮아요. 가격 생각하면 나쁘지 않네요."
출력: {"sentiment": "neutral", "confidence": 0.7, "reason": "긍정과 부정 혼재"}

입력: "완전 대박! 인생템 찾았어요 ㅠㅠ"
출력: {"sentiment": "positive", "confidence": 0.98, "reason": "강한 긍정 표현"}

## 분석할 리뷰

입력: "{review}"
출력:"""

def analyze_sentiment(review: str) -> dict:
    """리뷰 감정 분석"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": SENTIMENT_PROMPT.format(review=review)}
        ],
        temperature=0
    )

    try:
        return json.loads(response.choices[0].message.content)
    except json.JSONDecodeError:
        return {"error": "JSON 파싱 실패", "raw": response.choices[0].message.content}

# 과제 2: 코드 리뷰 프롬프트 (Role Prompting)
CODE_REVIEW_SYSTEM = """당신은 10년 경력의 시니어 Python 개발자입니다.

## 역할
- 클린 코드와 SOLID 원칙을 중시합니다
- 성능과 보안을 항상 고려합니다
- 주니어에게 친절하지만 명확하게 피드백합니다

## 리뷰 형식

### 1. 전체 평가
- 점수: X/10
- 한 줄 요약

### 2. 잘한 점
- 항목별 나열

### 3. 개선 필요
- 문제점과 이유
- 개선된 코드 제시

### 4. 보안/성능 체크
- 잠재적 이슈 확인"""

def review_code(code: str) -> str:
    """코드 리뷰"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": CODE_REVIEW_SYSTEM},
            {"role": "user", "content": f"다음 코드를 리뷰해주세요:\\n\\n\`\`\`python\\n{code}\\n\`\`\`"}
        ],
        temperature=0.3
    )
    return response.choices[0].message.content

# 과제 3: CoT 수학 문제 해결
def solve_math_problem(problem: str) -> str:
    """Chain-of-Thought로 수학 문제 해결"""
    cot_prompt = f"""다음 수학 문제를 단계별로 풀어주세요.

문제: {problem}

## 풀이 과정
각 단계를 명확히 설명하세요:

Step 1:"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": cot_prompt}
        ],
        temperature=0
    )
    return response.choices[0].message.content

# 테스트
if __name__ == "__main__":
    # 감정 분석 테스트
    print("=== 감정 분석 ===\\n")
    reviews = [
        "정말 최고의 제품이에요! 강추합니다.",
        "배송이 너무 느려서 화가 납니다.",
        "그냥 그래요. 가격 대비 보통입니다."
    ]

    for review in reviews:
        result = analyze_sentiment(review)
        print(f"리뷰: {review}")
        print(f"분석: {json.dumps(result, ensure_ascii=False, indent=2)}\\n")

    # 코드 리뷰 테스트
    print("\\n=== 코드 리뷰 ===\\n")
    sample_code = '''
def get_user(id):
    query = f"SELECT * FROM users WHERE id = {id}"
    return db.execute(query)
'''
    print(review_code(sample_code))

    # 수학 문제 테스트
    print("\\n=== 수학 문제 ===\\n")
    problem = "한 가게에서 사과 3개와 배 2개를 사면 2,500원입니다. 사과 2개와 배 3개를 사면 2,700원입니다. 사과 1개의 가격은?"
    print(solve_math_problem(problem))
`
      }
    },
    {
      id: 'prompt-quiz',
      type: 'quiz',
      title: '프롬프트 엔지니어링 퀴즈',
      duration: 15,
      content: {
        objectives: ['프롬프트 엔지니어링 개념을 복습한다'],
        questions: [
          {
            question: 'Chain-of-Thought (CoT) 프롬프팅의 주요 장점은?',
            options: [
              '응답 속도가 빨라짐',
              '토큰 사용량이 줄어듦',
              '복잡한 추론 문제의 정확도 향상',
              '항상 동일한 출력 보장'
            ],
            answer: 2,
            explanation: 'CoT는 LLM이 단계별로 추론하도록 유도하여 수학, 논리 문제 등 복잡한 추론의 정확도를 높입니다.'
          },
          {
            question: 'Few-shot 프롬프팅에서 적절한 예시 개수는?',
            options: [
              '0개',
              '2-5개',
              '50개 이상',
              '예시 개수는 중요하지 않음'
            ],
            answer: 1,
            explanation: 'Few-shot은 일반적으로 2-5개의 예시가 효과적입니다. 너무 많으면 컨텍스트 길이 문제가 발생합니다.'
          },
          {
            question: 'JSON 출력을 안정적으로 얻기 위한 방법이 아닌 것은?',
            options: [
              '출력 형식을 명시적으로 지정',
              'Temperature를 0으로 설정',
              'Few-shot 예시에 JSON 형식 포함',
              'max_tokens를 최대로 설정'
            ],
            answer: 3,
            explanation: 'max_tokens는 출력 길이 제한이며, JSON 형식과는 관련이 없습니다. 형식 지정, 낮은 temperature, 예시가 효과적입니다.'
          }
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'prompt-advanced',
  title: '프롬프트 패턴 & 최적화',
  totalDuration: 180,
  tasks: [
    {
      id: 'prompt-patterns-video',
      type: 'video',
      title: '실전 프롬프트 패턴',
      duration: 30,
      content: {
        objectives: [
          '재사용 가능한 프롬프트 패턴을 학습한다',
          '프롬프트 템플릿 시스템을 구축한다',
          '프롬프트 버전 관리를 이해한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=prompt-patterns-placeholder',
        transcript: `
## 실전 프롬프트 패턴

### 1. CRISPE 프레임워크

\`\`\`
C - Capacity (역할): "당신은 ~입니다"
R - Request (요청): "~해주세요"
I - Input (입력): "입력 데이터: ~"
S - Style (스타일): "~한 톤으로"
P - Purpose (목적): "목적은 ~입니다"
E - Example (예시): "예시: ~"
\`\`\`

**적용 예시**
\`\`\`
[C] 당신은 마케팅 전문가입니다.
[R] 신제품 런칭 이메일을 작성해주세요.
[I] 제품: AI 스피커, 가격: 99,000원, 특징: 음성 인식
[S] 친근하지만 전문적인 톤으로
[P] 사전 예약 전환율을 높이는 것이 목적입니다.
[E]
좋은 예: "새로운 일상의 시작, AI와 함께하세요"
나쁜 예: "빨리 사세요! 할인 중!"
\`\`\`

### 2. 메타 프롬프트 패턴

\`\`\`python
META_PROMPT = """
당신은 프롬프트 엔지니어링 전문가입니다.

사용자의 요청을 분석하고, 최적의 프롬프트를 생성하세요.

요청: {user_request}

생성할 프롬프트 구조:
1. System Prompt
2. User Prompt Template
3. Few-shot Examples (필요시)
4. 예상 출력 형식
"""
\`\`\`

### 3. 프롬프트 템플릿 시스템

\`\`\`python
from jinja2 import Template

SUMMARY_TEMPLATE = Template("""
다음 {{ content_type }}을(를) 요약하세요.

## 요약 대상
{{ content }}

## 요구사항
- 길이: {{ length }}
- 관점: {{ perspective }}
- 포함할 핵심: {{ key_points | join(', ') }}

## 출력 형식
{{ output_format }}
""")

# 사용
prompt = SUMMARY_TEMPLATE.render(
    content_type="기술 문서",
    content=document,
    length="3문장",
    perspective="개발자",
    key_points=["아키텍처", "성능", "보안"],
    output_format="마크다운 불릿 포인트"
)
\`\`\`

### 4. 프롬프트 버전 관리

\`\`\`yaml
# prompts/sentiment_v2.yaml
name: sentiment_analysis
version: "2.0"
model: gpt-4o-mini
temperature: 0

system: |
  당신은 감정 분석 전문가입니다.

user_template: |
  리뷰: {review}

  JSON 형식으로 응답:
  {{"sentiment": "...", "confidence": 0.0-1.0}}

examples:
  - input: "완전 좋아요!"
    output: '{"sentiment": "positive", "confidence": 0.95}'

changelog:
  - "2.0: confidence 필드 추가"
  - "1.0: 초기 버전"
\`\`\`
        `
      }
    },
    {
      id: 'prompt-optimization-video',
      type: 'video',
      title: '프롬프트 최적화 & 평가',
      duration: 30,
      content: {
        objectives: [
          '프롬프트 성능을 측정하고 평가한다',
          '비용 최적화 전략을 적용한다',
          'A/B 테스트로 프롬프트를 개선한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=prompt-optimization-placeholder',
        transcript: `
## 프롬프트 최적화 & 평가

### 평가 지표

\`\`\`
프롬프트 품질 지표:
├── 정확도 (Accuracy): 정답과의 일치율
├── 일관성 (Consistency): 동일 입력에 유사한 출력
├── 완성도 (Completeness): 요구사항 충족 정도
├── 형식 준수 (Format): 지정 형식 준수율
└── 비용 효율 (Cost): 토큰당 품질
\`\`\`

### 자동 평가 시스템

\`\`\`python
def evaluate_prompt(prompt_fn, test_cases, evaluator_model="gpt-4o"):
    """프롬프트 자동 평가"""
    results = []

    for case in test_cases:
        # 프롬프트 실행
        output = prompt_fn(case["input"])

        # 평가 프롬프트
        eval_prompt = f"""
        입력: {case["input"]}
        기대 출력: {case["expected"]}
        실제 출력: {output}

        평가 기준:
        1. 정확성 (0-10)
        2. 형식 준수 (0-10)
        3. 완성도 (0-10)

        JSON으로 점수와 피드백 제공
        """

        eval_result = evaluate_with_llm(eval_prompt, evaluator_model)
        results.append(eval_result)

    return aggregate_scores(results)
\`\`\`

### 비용 최적화

\`\`\`python
# 전략 1: 프롬프트 압축
def compress_prompt(prompt: str) -> str:
    """불필요한 토큰 제거"""
    # 중복 공백 제거
    # 불필요한 예시 축소
    # 핵심만 남기기
    pass

# 전략 2: 캐싱
from functools import lru_cache

@lru_cache(maxsize=1000)
def cached_completion(prompt_hash: str) -> str:
    """동일 프롬프트 결과 캐싱"""
    pass

# 전략 3: 모델 라우팅
def route_to_model(task_complexity: str) -> str:
    routing = {
        "simple": "gpt-4o-mini",
        "moderate": "gpt-4o-mini",
        "complex": "gpt-4o"
    }
    return routing.get(task_complexity, "gpt-4o-mini")
\`\`\`

### A/B 테스트

\`\`\`python
import random

class PromptABTest:
    def __init__(self, prompt_a, prompt_b):
        self.prompts = {"A": prompt_a, "B": prompt_b}
        self.results = {"A": [], "B": []}

    def run(self, input_text):
        variant = random.choice(["A", "B"])
        result = execute_prompt(self.prompts[variant], input_text)
        return result, variant

    def record_feedback(self, variant, score):
        self.results[variant].append(score)

    def get_winner(self):
        avg_a = sum(self.results["A"]) / len(self.results["A"])
        avg_b = sum(self.results["B"]) / len(self.results["B"])
        return "A" if avg_a > avg_b else "B"
\`\`\`
        `
      }
    },
    {
      id: 'prompt-system-practice',
      type: 'code',
      title: '프롬프트 관리 시스템 구축',
      duration: 90,
      content: {
        objectives: [
          '프롬프트 템플릿 시스템을 구축한다',
          '프롬프트 평가 파이프라인을 만든다',
          '비용 추적 시스템을 구현한다'
        ],
        instructions: `
## 실습: 프롬프트 관리 시스템

### 목표
재사용 가능한 프롬프트 관리 시스템을 구축하세요.

### 요구사항
1. YAML 기반 프롬프트 템플릿 로드
2. 변수 치환 및 렌더링
3. 실행 결과 로깅
4. 비용 추적
5. 간단한 평가 기능
        `,
        starterCode: `import yaml
from dataclasses import dataclass
from typing import Optional
from openai import OpenAI

@dataclass
class PromptResult:
    output: str
    tokens_used: int
    cost: float
    model: str

class PromptManager:
    def __init__(self, prompts_dir: str = "prompts"):
        self.prompts_dir = prompts_dir
        self.client = OpenAI()
        self.history = []

    def load_prompt(self, name: str) -> dict:
        """YAML 프롬프트 템플릿 로드"""
        # TODO: 구현
        pass

    def render(self, template: str, variables: dict) -> str:
        """변수 치환"""
        # TODO: 구현
        pass

    def execute(self, prompt_name: str, variables: dict) -> PromptResult:
        """프롬프트 실행"""
        # TODO: 구현
        pass

    def get_total_cost(self) -> float:
        """총 비용 계산"""
        # TODO: 구현
        pass

# 테스트
if __name__ == "__main__":
    manager = PromptManager()

    # 프롬프트 실행
    result = manager.execute("sentiment", {"review": "정말 좋은 제품이에요!"})
    print(f"결과: {result.output}")
    print(f"비용: \${result.cost:.4f}")
`,
        solutionCode: `import yaml
import os
from dataclasses import dataclass, field
from typing import Optional, List
from datetime import datetime
from openai import OpenAI

# 모델별 가격 (1K tokens 기준)
PRICING = {
    "gpt-4o": {"input": 0.0025, "output": 0.01},
    "gpt-4o-mini": {"input": 0.00015, "output": 0.0006}
}

@dataclass
class PromptResult:
    output: str
    tokens_used: int
    cost: float
    model: str
    prompt_name: str
    timestamp: datetime = field(default_factory=datetime.now)

class PromptManager:
    def __init__(self, prompts_dir: str = "prompts"):
        self.prompts_dir = prompts_dir
        self.client = OpenAI()
        self.history: List[PromptResult] = []
        self._cache = {}

    def load_prompt(self, name: str) -> dict:
        """YAML 프롬프트 템플릿 로드"""
        if name in self._cache:
            return self._cache[name]

        filepath = os.path.join(self.prompts_dir, f"{name}.yaml")

        if not os.path.exists(filepath):
            # 기본 프롬프트 생성
            return self._get_default_prompt(name)

        with open(filepath, 'r', encoding='utf-8') as f:
            prompt_config = yaml.safe_load(f)

        self._cache[name] = prompt_config
        return prompt_config

    def _get_default_prompt(self, name: str) -> dict:
        """기본 프롬프트 템플릿"""
        defaults = {
            "sentiment": {
                "name": "sentiment_analysis",
                "model": "gpt-4o-mini",
                "temperature": 0,
                "system": "당신은 감정 분석 전문가입니다.",
                "user_template": "다음 리뷰의 감정을 분석하세요: {review}\\n\\nJSON 형식: {{\"sentiment\": \"positive/negative/neutral\", \"confidence\": 0.0-1.0}}"
            },
            "summary": {
                "name": "text_summary",
                "model": "gpt-4o-mini",
                "temperature": 0.3,
                "system": "당신은 요약 전문가입니다. 핵심만 간결하게 요약합니다.",
                "user_template": "다음 텍스트를 {length}로 요약하세요:\\n\\n{text}"
            }
        }
        return defaults.get(name, {"model": "gpt-4o-mini", "user_template": "{input}"})

    def render(self, template: str, variables: dict) -> str:
        """변수 치환"""
        result = template
        for key, value in variables.items():
            result = result.replace("{" + key + "}", str(value))
        return result

    def execute(self, prompt_name: str, variables: dict) -> PromptResult:
        """프롬프트 실행"""
        config = self.load_prompt(prompt_name)
        model = config.get("model", "gpt-4o-mini")
        temperature = config.get("temperature", 0.7)

        messages = []

        # System prompt
        if "system" in config:
            messages.append({"role": "system", "content": config["system"]})

        # User prompt
        user_content = self.render(config.get("user_template", "{input}"), variables)
        messages.append({"role": "user", "content": user_content})

        # API 호출
        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature
        )

        # 비용 계산
        input_tokens = response.usage.prompt_tokens
        output_tokens = response.usage.completion_tokens
        total_tokens = response.usage.total_tokens

        pricing = PRICING.get(model, PRICING["gpt-4o-mini"])
        cost = (input_tokens * pricing["input"] + output_tokens * pricing["output"]) / 1000

        result = PromptResult(
            output=response.choices[0].message.content,
            tokens_used=total_tokens,
            cost=cost,
            model=model,
            prompt_name=prompt_name
        )

        self.history.append(result)
        return result

    def get_total_cost(self) -> float:
        """총 비용 계산"""
        return sum(r.cost for r in self.history)

    def get_stats(self) -> dict:
        """사용 통계"""
        if not self.history:
            return {"total_calls": 0, "total_cost": 0, "total_tokens": 0}

        return {
            "total_calls": len(self.history),
            "total_cost": self.get_total_cost(),
            "total_tokens": sum(r.tokens_used for r in self.history),
            "by_prompt": self._group_by_prompt()
        }

    def _group_by_prompt(self) -> dict:
        """프롬프트별 통계"""
        stats = {}
        for r in self.history:
            if r.prompt_name not in stats:
                stats[r.prompt_name] = {"calls": 0, "cost": 0, "tokens": 0}
            stats[r.prompt_name]["calls"] += 1
            stats[r.prompt_name]["cost"] += r.cost
            stats[r.prompt_name]["tokens"] += r.tokens_used
        return stats

# 테스트
if __name__ == "__main__":
    manager = PromptManager()

    print("=== 프롬프트 관리 시스템 테스트 ===\\n")

    # 감정 분석
    reviews = [
        "정말 좋은 제품이에요! 강추합니다.",
        "배송이 늦어서 실망했어요.",
        "가격 대비 그냥 그래요."
    ]

    for review in reviews:
        result = manager.execute("sentiment", {"review": review})
        print(f"리뷰: {review}")
        print(f"결과: {result.output}")
        print(f"비용: \${result.cost:.6f}\\n")

    # 요약
    text = "인공지능은 컴퓨터 과학의 한 분야로, 기계가 인간의 지능을 모방하여 학습, 추론, 문제 해결 등을 수행할 수 있도록 하는 기술입니다."
    result = manager.execute("summary", {"text": text, "length": "1문장"})
    print(f"원문: {text}")
    print(f"요약: {result.output}\\n")

    # 통계
    print("=== 사용 통계 ===")
    stats = manager.get_stats()
    print(f"총 호출: {stats['total_calls']}회")
    print(f"총 비용: \${stats['total_cost']:.6f}")
    print(f"총 토큰: {stats['total_tokens']}")
`
      }
    }
  ]
}

const day4: Day = {
  slug: 'structured-output',
  title: '구조화된 출력 & 함수 호출',
  totalDuration: 180,
  tasks: [
    {
      id: 'structured-output-video',
      type: 'video',
      title: 'Structured Output 패턴',
      duration: 30,
      content: {
        objectives: [
          'JSON 스키마 기반 출력 제어를 이해한다',
          'Pydantic을 활용한 타입 안전 출력을 구현한다',
          'OpenAI Structured Output API를 사용한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=structured-output-placeholder',
        transcript: `
## Structured Output (구조화된 출력)

### 왜 필요한가?

\`\`\`
일반 텍스트 출력의 문제:
├── 형식 불일치 (JSON 파싱 실패)
├── 필드 누락
├── 타입 오류 (문자열 vs 숫자)
└── 후처리 복잡성

Structured Output 장점:
├── 100% 스키마 준수 보장
├── 타입 안전성
├── 자동 검증
└── 코드 통합 용이
\`\`\`

### OpenAI Structured Output

\`\`\`python
from openai import OpenAI
from pydantic import BaseModel

class SentimentAnalysis(BaseModel):
    sentiment: str  # "positive", "negative", "neutral"
    confidence: float
    keywords: list[str]

client = OpenAI()

response = client.beta.chat.completions.parse(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "리뷰: 정말 좋은 제품이에요!"}
    ],
    response_format=SentimentAnalysis
)

result = response.choices[0].message.parsed
print(result.sentiment)  # "positive"
print(result.confidence)  # 0.95
\`\`\`

### Pydantic 스키마 정의

\`\`\`python
from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum

class Sentiment(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"

class ReviewAnalysis(BaseModel):
    """리뷰 분석 결과"""
    sentiment: Sentiment = Field(description="감정 분류")
    confidence: float = Field(ge=0, le=1, description="신뢰도 0-1")
    keywords: list[str] = Field(max_length=5, description="핵심 키워드")
    summary: str = Field(max_length=100, description="한 줄 요약")

    class Config:
        json_schema_extra = {
            "example": {
                "sentiment": "positive",
                "confidence": 0.95,
                "keywords": ["좋은", "추천"],
                "summary": "전반적으로 만족스러운 제품"
            }
        }
\`\`\`

### 복잡한 구조 처리

\`\`\`python
class Product(BaseModel):
    name: str
    price: float
    category: str

class OrderItem(BaseModel):
    product: Product
    quantity: int
    subtotal: float

class Order(BaseModel):
    order_id: str
    items: list[OrderItem]
    total: float
    status: Literal["pending", "confirmed", "shipped", "delivered"]

# 중첩 구조도 완벽하게 파싱
\`\`\`
        `
      }
    },
    {
      id: 'function-calling-video',
      type: 'video',
      title: 'Function Calling (Tool Use)',
      duration: 30,
      content: {
        objectives: [
          'Function Calling의 개념과 활용을 이해한다',
          'Tool 정의 및 실행 흐름을 파악한다',
          '병렬 함수 호출을 구현한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=function-calling-placeholder',
        transcript: `
## Function Calling (Tool Use)

### 개념

\`\`\`
사용자 → LLM → [함수 호출 결정] → 함수 실행 → LLM → 최종 응답

예: "서울 날씨 알려줘"
1. LLM이 get_weather 함수 호출 필요 판단
2. {"name": "get_weather", "arguments": {"city": "서울"}}
3. 실제 API 호출하여 날씨 데이터 획득
4. 결과를 LLM에 전달
5. LLM이 자연어로 응답 생성
\`\`\`

### Tool 정의

\`\`\`python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "지정한 도시의 현재 날씨를 조회합니다",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "도시 이름 (예: 서울, 부산)"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "온도 단위"
                    }
                },
                "required": ["city"]
            }
        }
    }
]
\`\`\`

### 실행 흐름

\`\`\`python
import json

def process_with_tools(user_message: str):
    # 1. 초기 요청
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": user_message}],
        tools=tools
    )

    message = response.choices[0].message

    # 2. 함수 호출이 필요한 경우
    if message.tool_calls:
        # 각 함수 호출 처리
        for tool_call in message.tool_calls:
            func_name = tool_call.function.name
            func_args = json.loads(tool_call.function.arguments)

            # 실제 함수 실행
            result = execute_function(func_name, func_args)

            # 결과를 대화에 추가
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result)
            })

        # 3. 함수 결과로 최종 응답 생성
        final_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        return final_response.choices[0].message.content

    return message.content
\`\`\`

### 병렬 함수 호출

\`\`\`python
# LLM이 여러 함수를 동시에 호출할 수 있음
user: "서울과 부산 날씨 비교해줘"

tool_calls = [
    {"name": "get_weather", "arguments": {"city": "서울"}},
    {"name": "get_weather", "arguments": {"city": "부산"}}
]

# 병렬 실행으로 효율성 향상
import asyncio

async def execute_parallel(tool_calls):
    tasks = [execute_async(tc) for tc in tool_calls]
    return await asyncio.gather(*tasks)
\`\`\`
        `
      }
    },
    {
      id: 'function-calling-practice',
      type: 'code',
      title: 'Function Calling 실습',
      duration: 90,
      content: {
        objectives: [
          'Tool 정의 및 등록을 구현한다',
          '함수 호출 루프를 완성한다',
          '실제 API와 연동한다'
        ],
        instructions: `
## 실습: AI 어시스턴트 with Tools

### 목표
날씨, 계산기, 검색 기능을 갖춘 AI 어시스턴트를 구축하세요.

### 구현할 도구
1. get_weather: 날씨 조회
2. calculate: 수학 계산
3. search_web: 웹 검색 (시뮬레이션)
        `,
        starterCode: `from openai import OpenAI
import json

client = OpenAI()

# Tool 정의
tools = [
    # TODO: get_weather 정의
    # TODO: calculate 정의
    # TODO: search_web 정의
]

def get_weather(city: str, unit: str = "celsius") -> dict:
    """날씨 조회 (시뮬레이션)"""
    # TODO: 구현
    pass

def calculate(expression: str) -> dict:
    """수학 계산"""
    # TODO: 구현
    pass

def search_web(query: str) -> dict:
    """웹 검색 (시뮬레이션)"""
    # TODO: 구현
    pass

def execute_function(name: str, args: dict) -> dict:
    """함수 실행 라우터"""
    # TODO: 구현
    pass

def chat_with_tools(user_message: str) -> str:
    """Tool 사용 대화"""
    # TODO: 구현
    pass

# 테스트
if __name__ == "__main__":
    queries = [
        "서울 날씨 알려줘",
        "123 * 456 계산해줘",
        "Python 최신 버전 검색해줘",
        "서울과 부산 날씨 비교해줘"
    ]

    for query in queries:
        print(f"Q: {query}")
        print(f"A: {chat_with_tools(query)}\\n")
`,
        solutionCode: `from openai import OpenAI
import json

client = OpenAI()

# Tool 정의
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "지정한 도시의 현재 날씨를 조회합니다",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "도시 이름"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"], "default": "celsius"}
                },
                "required": ["city"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "수학 표현식을 계산합니다",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "계산할 수학 표현식 (예: 2+2, 10*5)"}
                },
                "required": ["expression"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_web",
            "description": "웹에서 정보를 검색합니다",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "검색어"}
                },
                "required": ["query"]
            }
        }
    }
]

def get_weather(city: str, unit: str = "celsius") -> dict:
    """날씨 조회 (시뮬레이션)"""
    # 실제로는 날씨 API 호출
    weather_data = {
        "서울": {"temp": 15, "condition": "맑음", "humidity": 45},
        "부산": {"temp": 18, "condition": "구름 조금", "humidity": 55},
        "제주": {"temp": 20, "condition": "흐림", "humidity": 70}
    }

    data = weather_data.get(city, {"temp": 20, "condition": "정보 없음", "humidity": 50})

    if unit == "fahrenheit":
        data["temp"] = data["temp"] * 9/5 + 32

    return {
        "city": city,
        "temperature": data["temp"],
        "unit": unit,
        "condition": data["condition"],
        "humidity": data["humidity"]
    }

def calculate(expression: str) -> dict:
    """수학 계산"""
    try:
        # 안전한 계산 (eval 대신 ast 사용 권장)
        allowed_chars = set("0123456789+-*/().% ")
        if not all(c in allowed_chars for c in expression):
            return {"error": "허용되지 않는 문자 포함"}

        result = eval(expression)
        return {"expression": expression, "result": result}
    except Exception as e:
        return {"error": str(e)}

def search_web(query: str) -> dict:
    """웹 검색 (시뮬레이션)"""
    # 실제로는 검색 API 호출
    mock_results = {
        "Python 최신 버전": [
            {"title": "Python 3.12 릴리즈 노트", "snippet": "Python 3.12가 2024년 출시되었습니다."},
            {"title": "Python 다운로드", "snippet": "python.org에서 최신 버전을 다운로드하세요."}
        ]
    }

    # 간단한 매칭
    for key in mock_results:
        if key.lower() in query.lower():
            return {"query": query, "results": mock_results[key]}

    return {"query": query, "results": [{"title": "검색 결과", "snippet": f"'{query}'에 대한 검색 결과입니다."}]}

def execute_function(name: str, args: dict) -> dict:
    """함수 실행 라우터"""
    functions = {
        "get_weather": get_weather,
        "calculate": calculate,
        "search_web": search_web
    }

    if name in functions:
        return functions[name](**args)
    return {"error": f"Unknown function: {name}"}

def chat_with_tools(user_message: str) -> str:
    """Tool 사용 대화"""
    messages = [
        {"role": "system", "content": "당신은 도움이 되는 AI 어시스턴트입니다. 필요한 경우 도구를 사용하세요."},
        {"role": "user", "content": user_message}
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        tools=tools
    )

    message = response.choices[0].message

    # 함수 호출이 필요한 경우
    if message.tool_calls:
        messages.append(message)

        for tool_call in message.tool_calls:
            func_name = tool_call.function.name
            func_args = json.loads(tool_call.function.arguments)

            print(f"  [Tool] {func_name}({func_args})")

            result = execute_function(func_name, func_args)

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result, ensure_ascii=False)
            })

        # 최종 응답
        final_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        return final_response.choices[0].message.content

    return message.content

# 테스트
if __name__ == "__main__":
    queries = [
        "서울 날씨 알려줘",
        "123 * 456 계산해줘",
        "Python 최신 버전 검색해줘",
        "서울과 부산 날씨 비교해줘"
    ]

    for query in queries:
        print(f"\\nQ: {query}")
        print(f"A: {chat_with_tools(query)}")
`
      }
    }
  ]
}

const day5: Day = {
  slug: 'llm-project',
  title: 'LLM 미니 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'llm-project-challenge',
      type: 'challenge',
      title: 'AI 고객 지원 챗봇 구축',
      duration: 180,
      content: {
        objectives: [
          '실전 LLM 애플리케이션을 구축한다',
          '프롬프트 엔지니어링을 적용한다',
          'Function Calling을 활용한다'
        ],
        requirements: [
          '**기본 요구사항**',
          '- 고객 문의 분류 (FAQ, 주문, 불만, 기타)',
          '- 자동 응답 생성',
          '- 주문 조회 기능 (Function Calling)',
          '- 대화 히스토리 유지',
          '',
          '**프롬프트 요구사항**',
          '- Role 프롬프팅으로 CS 전문가 페르소나 설정',
          '- 친절하고 전문적인 톤 유지',
          '- 구조화된 응답 형식',
          '',
          '**기능 요구사항**',
          '- 주문 상태 조회 (get_order_status)',
          '- FAQ 검색 (search_faq)',
          '- 상담원 연결 요청 처리'
        ],
        evaluationCriteria: [
          '프롬프트 품질 (25%)',
          '기능 완성도 (25%)',
          'Tool 활용 (25%)',
          '코드 품질 (25%)'
        ],
        bonusPoints: [
          '감정 분석 기반 응대 조절',
          '다국어 지원',
          '대화 요약 기능',
          '응답 품질 자동 평가'
        ]
      }
    }
  ]
}

export const llmFundamentalsWeek: Week = {
  slug: 'llm-fundamentals',
  week: 1,
  phase: 5,
  month: 10,
  access: 'pro',
  title: 'LLM 기초 & 프롬프트 엔지니어링',
  topics: ['LLM', 'Transformer', 'Prompt Engineering', 'Function Calling', 'Structured Output'],
  practice: 'AI 고객 지원 챗봇',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
