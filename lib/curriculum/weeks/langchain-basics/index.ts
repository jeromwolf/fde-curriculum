// Phase 5, Week 2: LangChain 기초
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'langchain-intro',
  title: 'LangChain 소개',
  totalDuration: 180,
  tasks: [
    {
      id: 'langchain-overview-video',
      type: 'video',
      title: 'LangChain이란?',
      duration: 30,
      content: {
        objectives: [
          'LangChain의 목적과 아키텍처를 이해한다',
          '핵심 컴포넌트를 파악한다',
          'LangChain vs 직접 구현의 차이를 이해한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=langchain-intro-placeholder',
        transcript: `
## LangChain 개요

### LangChain이란?

\`\`\`
LangChain = LLM 애플리케이션 개발 프레임워크

해결하는 문제:
├── LLM API 호출 추상화
├── 프롬프트 관리
├── 체이닝 (여러 LLM 호출 연결)
├── 메모리 (대화 히스토리)
├── 도구 통합 (검색, DB, API)
└── RAG 파이프라인 구축
\`\`\`

### 아키텍처

\`\`\`
┌─────────────────────────────────────────────────┐
│                  LangChain                       │
├─────────────────────────────────────────────────┤
│  Models        │  Prompts      │  Memory        │
│  ├── ChatModels│  ├── Templates│  ├── Buffer    │
│  ├── LLMs      │  ├── Examples │  ├── Summary   │
│  └── Embeddings│  └── Selectors│  └── Vector    │
├─────────────────────────────────────────────────┤
│  Chains        │  Agents       │  Tools         │
│  ├── LLMChain  │  ├── ReAct    │  ├── Search    │
│  ├── Sequential│  ├── OpenAI   │  ├── Calculator│
│  └── Router    │  └── Custom   │  └── Custom    │
├─────────────────────────────────────────────────┤
│  Retrievers    │  Vector Stores│  Document      │
│  ├── Vector    │  ├── FAISS    │  Loaders       │
│  ├── BM25      │  ├── Chroma   │  ├── PDF       │
│  └── Hybrid    │  └── Pinecone │  └── Web       │
└─────────────────────────────────────────────────┘
\`\`\`

### LangChain vs 직접 구현

| 측면 | 직접 구현 | LangChain |
|------|----------|-----------|
| **초기 개발** | 빠름 | 학습 필요 |
| **유지보수** | 모든 것 직접 | 추상화 활용 |
| **확장성** | 직접 설계 | 패턴 제공 |
| **디버깅** | 명확함 | 추상화 레이어 |
| **생태계** | 직접 통합 | 풍부한 통합 |

### 언제 LangChain을 사용하나?

\`\`\`
✅ LangChain 권장:
├── RAG 시스템 구축
├── 복잡한 에이전트 개발
├── 다양한 LLM 교체 필요
├── 빠른 프로토타이핑
└── 다양한 도구 통합

❌ 직접 구현 권장:
├── 단순 API 호출
├── 성능 최적화 필수
├── 특수한 요구사항
└── 의존성 최소화 필요
\`\`\`

### 설치 및 설정

\`\`\`bash
# 기본 설치
pip install langchain langchain-openai langchain-anthropic

# 벡터 스토어
pip install langchain-chroma faiss-cpu

# 문서 로더
pip install pypdf python-docx

# 환경 변수
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."
\`\`\`
        `
      }
    },
    {
      id: 'langchain-models-video',
      type: 'video',
      title: 'Chat Models & LLMs',
      duration: 25,
      content: {
        objectives: [
          '다양한 LLM 프로바이더를 연동한다',
          'ChatModel과 LLM의 차이를 이해한다',
          '모델 설정과 콜백을 활용한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=langchain-models-placeholder',
        transcript: `
## Chat Models & LLMs

### ChatModel 기본 사용

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage

# OpenAI
chat_openai = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    max_tokens=500
)

# Anthropic
chat_anthropic = ChatAnthropic(
    model="claude-3-5-sonnet-20241022",
    temperature=0.7,
    max_tokens=500
)

# 메시지 구조
messages = [
    SystemMessage(content="당신은 도움이 되는 AI입니다."),
    HumanMessage(content="안녕하세요!")
]

response = chat_openai.invoke(messages)
print(response.content)
\`\`\`

### 스트리밍

\`\`\`python
# 스트리밍 출력
for chunk in chat_openai.stream(messages):
    print(chunk.content, end="", flush=True)

# 비동기 스트리밍
async for chunk in chat_openai.astream(messages):
    print(chunk.content, end="", flush=True)
\`\`\`

### 배치 처리

\`\`\`python
# 여러 입력 동시 처리
batch_messages = [
    [HumanMessage(content="Python이란?")],
    [HumanMessage(content="JavaScript란?")],
    [HumanMessage(content="Rust란?")]
]

responses = chat_openai.batch(batch_messages)
for r in responses:
    print(r.content[:100])
\`\`\`

### 콜백

\`\`\`python
from langchain_core.callbacks import BaseCallbackHandler

class TokenCounter(BaseCallbackHandler):
    def __init__(self):
        self.total_tokens = 0

    def on_llm_end(self, response, **kwargs):
        if response.llm_output:
            usage = response.llm_output.get("token_usage", {})
            self.total_tokens += usage.get("total_tokens", 0)

counter = TokenCounter()
response = chat_openai.invoke(messages, config={"callbacks": [counter]})
print(f"사용 토큰: {counter.total_tokens}")
\`\`\`
        `
      }
    },
    {
      id: 'langchain-basic-practice',
      type: 'code',
      title: 'LangChain 기본 실습',
      duration: 60,
      content: {
        objectives: [
          'ChatModel을 사용한 대화를 구현한다',
          '다양한 프로바이더를 테스트한다',
          '스트리밍과 배치를 활용한다'
        ],
        instructions: `
## 실습: LangChain Chat Models

### 과제
1. OpenAI와 Anthropic 모델 연동
2. 스트리밍 출력 구현
3. 토큰 사용량 추적
4. 모델 전환 가능한 구조 설계
        `,
        starterCode: `from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage

class MultiModelChat:
    def __init__(self, default_provider: str = "openai"):
        self.models = {}
        self.current_provider = default_provider
        # TODO: 모델 초기화

    def set_provider(self, provider: str):
        """프로바이더 전환"""
        # TODO: 구현
        pass

    def chat(self, message: str, system: str = None) -> str:
        """일반 대화"""
        # TODO: 구현
        pass

    def stream_chat(self, message: str, system: str = None):
        """스트리밍 대화"""
        # TODO: 구현
        pass

# 테스트
if __name__ == "__main__":
    chat = MultiModelChat()
    print(chat.chat("Python의 장점을 3가지 알려주세요."))
`,
        solutionCode: `from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.callbacks import BaseCallbackHandler
from typing import Optional, Generator

class TokenTracker(BaseCallbackHandler):
    def __init__(self):
        self.total_tokens = 0
        self.prompt_tokens = 0
        self.completion_tokens = 0

    def on_llm_end(self, response, **kwargs):
        if response.llm_output:
            usage = response.llm_output.get("token_usage", {})
            self.total_tokens += usage.get("total_tokens", 0)
            self.prompt_tokens += usage.get("prompt_tokens", 0)
            self.completion_tokens += usage.get("completion_tokens", 0)

class MultiModelChat:
    def __init__(self, default_provider: str = "openai"):
        self.models = {
            "openai": ChatOpenAI(model="gpt-4o-mini", temperature=0.7),
            "anthropic": ChatAnthropic(model="claude-3-5-sonnet-20241022", temperature=0.7)
        }
        self.current_provider = default_provider
        self.token_tracker = TokenTracker()

    def set_provider(self, provider: str):
        """프로바이더 전환"""
        if provider not in self.models:
            raise ValueError(f"Unknown provider: {provider}. Available: {list(self.models.keys())}")
        self.current_provider = provider
        print(f"Switched to {provider}")

    def _get_model(self):
        return self.models[self.current_provider]

    def _build_messages(self, message: str, system: Optional[str] = None):
        messages = []
        if system:
            messages.append(SystemMessage(content=system))
        messages.append(HumanMessage(content=message))
        return messages

    def chat(self, message: str, system: Optional[str] = None) -> str:
        """일반 대화"""
        messages = self._build_messages(message, system)
        response = self._get_model().invoke(
            messages,
            config={"callbacks": [self.token_tracker]}
        )
        return response.content

    def stream_chat(self, message: str, system: Optional[str] = None) -> Generator[str, None, None]:
        """스트리밍 대화"""
        messages = self._build_messages(message, system)
        for chunk in self._get_model().stream(messages):
            yield chunk.content

    def batch_chat(self, messages: list[str], system: Optional[str] = None) -> list[str]:
        """배치 대화"""
        batch = [self._build_messages(msg, system) for msg in messages]
        responses = self._get_model().batch(batch)
        return [r.content for r in responses]

    def get_token_usage(self) -> dict:
        """토큰 사용량 조회"""
        return {
            "total": self.token_tracker.total_tokens,
            "prompt": self.token_tracker.prompt_tokens,
            "completion": self.token_tracker.completion_tokens
        }

# 테스트
if __name__ == "__main__":
    chat = MultiModelChat()

    # 기본 대화
    print("=== OpenAI ===")
    response = chat.chat(
        "Python의 장점을 3가지 알려주세요.",
        system="간결하게 답변하세요."
    )
    print(response)
    print(f"\\n토큰 사용: {chat.get_token_usage()}")

    # 프로바이더 전환
    print("\\n=== Anthropic ===")
    chat.set_provider("anthropic")
    response = chat.chat("같은 질문에 답변해주세요: Python의 장점 3가지")
    print(response)

    # 스트리밍
    print("\\n=== 스트리밍 ===")
    chat.set_provider("openai")
    for chunk in chat.stream_chat("AI의 미래를 한 문장으로"):
        print(chunk, end="", flush=True)
    print()

    # 배치
    print("\\n=== 배치 ===")
    questions = ["Python이란?", "JavaScript란?", "Go란?"]
    answers = chat.batch_chat(questions, system="10단어 이내로 답변")
    for q, a in zip(questions, answers):
        print(f"Q: {q}")
        print(f"A: {a}\\n")
`
      }
    },
    {
      id: 'langchain-intro-quiz',
      type: 'quiz',
      title: 'LangChain 기초 퀴즈',
      duration: 15,
      content: {
        objectives: ['LangChain 기초 개념을 복습한다'],
        questions: [
          {
            question: 'LangChain의 주요 목적이 아닌 것은?',
            options: [
              'LLM API 호출 추상화',
              '프롬프트 관리 및 템플릿',
              'LLM 모델 학습 및 파인튜닝',
              'RAG 파이프라인 구축'
            ],
            answer: 2,
            explanation: 'LangChain은 LLM 활용을 위한 프레임워크이며, 모델 학습/파인튜닝은 별도 도구(예: Hugging Face)에서 수행합니다.'
          },
          {
            question: 'LangChain에서 스트리밍 출력을 위해 사용하는 메서드는?',
            options: [
              'invoke()',
              'stream()',
              'batch()',
              'run()'
            ],
            answer: 1,
            explanation: 'stream() 메서드는 토큰 단위로 점진적 출력을 제공하여 사용자 경험을 향상시킵니다.'
          }
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'prompts-chains',
  title: 'Prompts & Chains',
  totalDuration: 180,
  tasks: [
    {
      id: 'prompt-templates-video',
      type: 'video',
      title: 'Prompt Templates',
      duration: 30,
      content: {
        objectives: [
          'PromptTemplate과 ChatPromptTemplate을 이해한다',
          '변수 치환과 부분 적용을 활용한다',
          'Few-shot 프롬프트를 구성한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=prompt-templates-placeholder',
        transcript: `
## Prompt Templates

### 기본 PromptTemplate

\`\`\`python
from langchain_core.prompts import PromptTemplate

# 방법 1: from_template
template = PromptTemplate.from_template(
    "{product}의 장점을 {count}가지 알려주세요."
)

prompt = template.format(product="Python", count=3)
print(prompt)  # "Python의 장점을 3가지 알려주세요."

# 방법 2: 명시적 변수 지정
template = PromptTemplate(
    template="{product}의 장점을 {count}가지 알려주세요.",
    input_variables=["product", "count"]
)
\`\`\`

### ChatPromptTemplate

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate

# 메시지 기반 템플릿
chat_template = ChatPromptTemplate.from_messages([
    ("system", "당신은 {role} 전문가입니다."),
    ("human", "{question}")
])

messages = chat_template.format_messages(
    role="Python",
    question="데코레이터란 무엇인가요?"
)
\`\`\`

### 부분 적용 (Partial)

\`\`\`python
# 일부 변수만 미리 채우기
partial_template = template.partial(count=3)
prompt = partial_template.format(product="Python")
\`\`\`

### Few-shot Prompt

\`\`\`python
from langchain_core.prompts import FewShotPromptTemplate

examples = [
    {"input": "좋아요", "output": "positive"},
    {"input": "별로예요", "output": "negative"},
    {"input": "그냥요", "output": "neutral"}
]

example_prompt = PromptTemplate(
    template="입력: {input}\\n출력: {output}",
    input_variables=["input", "output"]
)

few_shot = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    prefix="다음 텍스트의 감정을 분류하세요.",
    suffix="입력: {text}\\n출력:",
    input_variables=["text"]
)

prompt = few_shot.format(text="정말 최고예요!")
\`\`\`
        `
      }
    },
    {
      id: 'chains-video',
      type: 'video',
      title: 'Chains & LCEL',
      duration: 30,
      content: {
        objectives: [
          'LCEL (LangChain Expression Language)을 이해한다',
          '체인을 구성하고 연결한다',
          'RunnablePassthrough와 RunnableLambda를 활용한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=chains-lcel-placeholder',
        transcript: `
## Chains & LCEL

### LCEL 기본

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 파이프 연산자로 체인 구성
prompt = ChatPromptTemplate.from_template("{topic}에 대한 농담을 해주세요.")
model = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

chain = prompt | model | parser

result = chain.invoke({"topic": "프로그래밍"})
print(result)
\`\`\`

### 체인 구성 요소

\`\`\`
LCEL 체인 = Runnable 객체들의 연결

[Input]
    ↓
[Prompt Template] → 프롬프트 생성
    ↓
[Chat Model] → LLM 호출
    ↓
[Output Parser] → 결과 파싱
    ↓
[Output]
\`\`\`

### RunnablePassthrough

\`\`\`python
from langchain_core.runnables import RunnablePassthrough

# 입력을 그대로 전달하면서 추가 처리
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | model
    | parser
)
\`\`\`

### RunnableLambda

\`\`\`python
from langchain_core.runnables import RunnableLambda

# 커스텀 함수를 체인에 포함
def format_docs(docs):
    return "\\n".join(doc.page_content for doc in docs)

chain = (
    {"context": retriever | RunnableLambda(format_docs), "question": RunnablePassthrough()}
    | prompt
    | model
    | parser
)
\`\`\`

### 병렬 실행

\`\`\`python
from langchain_core.runnables import RunnableParallel

# 여러 체인 동시 실행
parallel = RunnableParallel(
    joke=joke_chain,
    poem=poem_chain,
    summary=summary_chain
)

results = parallel.invoke({"topic": "AI"})
# {"joke": "...", "poem": "...", "summary": "..."}
\`\`\`

### 조건부 라우팅

\`\`\`python
from langchain_core.runnables import RunnableBranch

branch = RunnableBranch(
    (lambda x: x["type"] == "joke", joke_chain),
    (lambda x: x["type"] == "poem", poem_chain),
    default_chain  # 기본
)
\`\`\`
        `
      }
    },
    {
      id: 'chains-practice',
      type: 'code',
      title: 'Chains 실습',
      duration: 90,
      content: {
        objectives: [
          'LCEL로 다양한 체인을 구성한다',
          '병렬 및 조건부 체인을 구현한다',
          '재사용 가능한 체인 모듈을 만든다'
        ],
        instructions: `
## 실습: 다목적 콘텐츠 생성기

### 목표
하나의 주제로 여러 형태의 콘텐츠를 생성하는 체인을 구축하세요.

### 요구사항
1. 주제 입력 → 블로그 포스트, SNS 게시글, 이메일 동시 생성
2. 톤 선택 (formal/casual) 가능
3. 출력 형식 지정 (JSON)
        `,
        starterCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.runnables import RunnableParallel, RunnableLambda

model = ChatOpenAI(model="gpt-4o-mini")

# TODO: 블로그 포스트 체인
blog_chain = None

# TODO: SNS 게시글 체인
sns_chain = None

# TODO: 이메일 체인
email_chain = None

# TODO: 병렬 실행 체인
content_generator = None

def generate_content(topic: str, tone: str = "casual"):
    """다양한 콘텐츠 동시 생성"""
    # TODO: 구현
    pass

# 테스트
if __name__ == "__main__":
    result = generate_content("인공지능의 미래", tone="formal")
    print(result)
`,
        solutionCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnableLambda
import json

model = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
parser = StrOutputParser()

# 블로그 포스트 체인
blog_prompt = ChatPromptTemplate.from_messages([
    ("system", "당신은 {tone} 톤의 블로그 작가입니다."),
    ("human", "'{topic}'에 대한 블로그 포스트를 작성하세요. 제목과 3개의 섹션을 포함하세요.")
])
blog_chain = blog_prompt | model | parser

# SNS 게시글 체인
sns_prompt = ChatPromptTemplate.from_messages([
    ("system", "당신은 SNS 마케터입니다. {tone} 톤으로 작성합니다."),
    ("human", "'{topic}'에 대한 트위터/인스타그램 게시글을 작성하세요. 해시태그 포함, 280자 이내.")
])
sns_chain = sns_prompt | model | parser

# 이메일 체인
email_prompt = ChatPromptTemplate.from_messages([
    ("system", "당신은 비즈니스 커뮤니케이터입니다. {tone} 톤으로 작성합니다."),
    ("human", "'{topic}'에 대한 뉴스레터 이메일을 작성하세요. 제목, 인사말, 본문, 마무리를 포함하세요.")
])
email_chain = email_prompt | model | parser

# 병렬 실행 체인
content_generator = RunnableParallel(
    blog=blog_chain,
    sns=sns_chain,
    email=email_chain
)

def generate_content(topic: str, tone: str = "casual") -> dict:
    """다양한 콘텐츠 동시 생성"""
    tone_map = {
        "casual": "친근하고 대화체의",
        "formal": "공식적이고 전문적인"
    }

    input_data = {
        "topic": topic,
        "tone": tone_map.get(tone, tone_map["casual"])
    }

    result = content_generator.invoke(input_data)
    return result

def generate_with_metadata(topic: str, tone: str = "casual") -> dict:
    """메타데이터 포함 생성"""
    content = generate_content(topic, tone)

    return {
        "metadata": {
            "topic": topic,
            "tone": tone,
            "types": ["blog", "sns", "email"]
        },
        "content": content
    }

# 테스트
if __name__ == "__main__":
    print("=== 콘텐츠 생성기 테스트 ===\\n")

    result = generate_content("인공지능의 미래", tone="formal")

    print("📝 블로그 포스트:")
    print("-" * 40)
    print(result["blog"][:500] + "...\\n")

    print("📱 SNS 게시글:")
    print("-" * 40)
    print(result["sns"] + "\\n")

    print("📧 이메일:")
    print("-" * 40)
    print(result["email"][:500] + "...")
`
      }
    }
  ]
}

const day3: Day = {
  slug: 'output-parsers',
  title: 'Output Parsers & 구조화',
  totalDuration: 180,
  tasks: [
    {
      id: 'output-parsers-video',
      type: 'video',
      title: 'Output Parsers',
      duration: 30,
      content: {
        objectives: [
          '다양한 Output Parser를 이해한다',
          'Pydantic과 연동하여 타입 안전 출력을 구현한다',
          '파싱 오류 처리를 학습한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=output-parsers-placeholder',
        transcript: `
## Output Parsers

### Parser 종류

\`\`\`python
from langchain_core.output_parsers import (
    StrOutputParser,      # 문자열
    JsonOutputParser,     # JSON
    CommaSeparatedListOutputParser,  # 리스트
    PydanticOutputParser  # Pydantic 모델
)
\`\`\`

### JsonOutputParser

\`\`\`python
from langchain_core.output_parsers import JsonOutputParser

parser = JsonOutputParser()

chain = prompt | model | parser
result = chain.invoke({"text": "..."})
# dict 반환
\`\`\`

### PydanticOutputParser

\`\`\`python
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

class MovieReview(BaseModel):
    title: str = Field(description="영화 제목")
    rating: float = Field(ge=0, le=10, description="평점 0-10")
    summary: str = Field(description="한 줄 요약")
    pros: list[str] = Field(description="장점 목록")
    cons: list[str] = Field(description="단점 목록")

parser = PydanticOutputParser(pydantic_object=MovieReview)

# format_instructions를 프롬프트에 포함
prompt = ChatPromptTemplate.from_messages([
    ("system", "영화 리뷰를 분석하세요."),
    ("human", "{review}\\n\\n{format_instructions}")
])

chain = prompt.partial(
    format_instructions=parser.get_format_instructions()
) | model | parser

result = chain.invoke({"review": "인셉션은 정말 대단한 영화다..."})
print(result.title)  # "인셉션"
print(result.rating)  # 9.5
\`\`\`

### 오류 처리

\`\`\`python
from langchain.output_parsers import OutputFixingParser

# 자동 오류 수정 파서
fixing_parser = OutputFixingParser.from_llm(
    parser=parser,
    llm=model
)

# 파싱 실패 시 LLM으로 재시도
\`\`\`
        `
      }
    },
    {
      id: 'structured-data-practice',
      type: 'code',
      title: '구조화된 데이터 추출 실습',
      duration: 90,
      content: {
        objectives: [
          '비정형 텍스트에서 구조화된 데이터를 추출한다',
          'Pydantic 모델로 검증한다',
          '복잡한 중첩 구조를 처리한다'
        ],
        instructions: `
## 실습: 이력서 정보 추출기

### 목표
비정형 이력서 텍스트에서 구조화된 정보를 추출하세요.

### 추출 항목
- 이름, 연락처
- 학력 (학교, 전공, 졸업년도)
- 경력 (회사, 직책, 기간, 담당 업무)
- 스킬
        `,
        starterCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional

# TODO: Pydantic 모델 정의
class Education(BaseModel):
    pass

class Experience(BaseModel):
    pass

class Resume(BaseModel):
    pass

# TODO: 파서 및 체인 구성
def extract_resume_info(resume_text: str) -> Resume:
    pass

# 테스트
sample_resume = """
김철수
이메일: kim@example.com | 전화: 010-1234-5678

학력:
서울대학교 컴퓨터공학과 학사 (2018년 졸업)

경력:
네이버 - 백엔드 개발자 (2020.03 - 현재)
- Python/Django 기반 API 개발
- 일 1억 건 트래픽 처리

카카오 - 인턴 (2019.06 - 2019.12)
- 데이터 분석 보조

스킬: Python, Django, PostgreSQL, Docker, AWS
"""

if __name__ == "__main__":
    result = extract_resume_info(sample_resume)
    print(result)
`,
        solutionCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional

# Pydantic 모델 정의
class Education(BaseModel):
    school: str = Field(description="학교명")
    major: str = Field(description="전공")
    degree: str = Field(description="학위 (학사, 석사, 박사)")
    graduation_year: Optional[int] = Field(description="졸업년도")

class Experience(BaseModel):
    company: str = Field(description="회사명")
    position: str = Field(description="직책")
    start_date: str = Field(description="시작일 (YYYY.MM)")
    end_date: str = Field(description="종료일 (YYYY.MM 또는 '현재')")
    responsibilities: List[str] = Field(description="담당 업무 목록")

class Resume(BaseModel):
    name: str = Field(description="이름")
    email: Optional[str] = Field(description="이메일")
    phone: Optional[str] = Field(description="전화번호")
    education: List[Education] = Field(description="학력 목록")
    experience: List[Experience] = Field(description="경력 목록")
    skills: List[str] = Field(description="스킬 목록")

# 파서 및 체인 구성
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
parser = PydanticOutputParser(pydantic_object=Resume)

prompt = ChatPromptTemplate.from_messages([
    ("system", """당신은 이력서 분석 전문가입니다.
주어진 이력서에서 정보를 정확히 추출하세요.
정보가 없는 필드는 빈 리스트나 null로 처리하세요."""),
    ("human", """다음 이력서에서 정보를 추출하세요:

{resume_text}

{format_instructions}""")
])

chain = (
    prompt.partial(format_instructions=parser.get_format_instructions())
    | model
    | parser
)

def extract_resume_info(resume_text: str) -> Resume:
    return chain.invoke({"resume_text": resume_text})

# 테스트
sample_resume = """
김철수
이메일: kim@example.com | 전화: 010-1234-5678

학력:
서울대학교 컴퓨터공학과 학사 (2018년 졸업)

경력:
네이버 - 백엔드 개발자 (2020.03 - 현재)
- Python/Django 기반 API 개발
- 일 1억 건 트래픽 처리

카카오 - 인턴 (2019.06 - 2019.12)
- 데이터 분석 보조

스킬: Python, Django, PostgreSQL, Docker, AWS
"""

if __name__ == "__main__":
    result = extract_resume_info(sample_resume)

    print("=== 이력서 분석 결과 ===\\n")
    print(f"이름: {result.name}")
    print(f"이메일: {result.email}")
    print(f"전화: {result.phone}")

    print("\\n학력:")
    for edu in result.education:
        print(f"  - {edu.school} {edu.major} ({edu.degree}, {edu.graduation_year})")

    print("\\n경력:")
    for exp in result.experience:
        print(f"  - {exp.company} / {exp.position} ({exp.start_date} ~ {exp.end_date})")
        for resp in exp.responsibilities:
            print(f"    * {resp}")

    print(f"\\n스킬: {', '.join(result.skills)}")
`
      }
    }
  ]
}

const day4: Day = {
  slug: 'memory-history',
  title: 'Memory & 대화 히스토리',
  totalDuration: 180,
  tasks: [
    {
      id: 'memory-video',
      type: 'video',
      title: 'Memory 시스템',
      duration: 30,
      content: {
        objectives: [
          'LangChain Memory 유형을 이해한다',
          '대화 히스토리 관리를 구현한다',
          '메모리 최적화 전략을 학습한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=langchain-memory-placeholder',
        transcript: `
## Memory 시스템

### Memory 유형

\`\`\`
ConversationBufferMemory
├── 전체 대화 저장
├── 단순하지만 토큰 증가
└── 짧은 대화에 적합

ConversationBufferWindowMemory
├── 최근 N개 메시지만 유지
├── 토큰 제한
└── 긴 대화에 적합

ConversationSummaryMemory
├── 대화 요약 저장
├── 토큰 효율적
└── 컨텍스트 손실 가능

ConversationSummaryBufferMemory
├── 최근 대화 + 과거 요약
├── 균형 잡힌 접근
└── 실무에서 자주 사용
\`\`\`

### ChatMessageHistory

\`\`\`python
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

# 메시지 히스토리 저장소
store = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

# 히스토리 포함 체인
chain_with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="question",
    history_messages_key="history"
)

# 세션별 대화
response = chain_with_history.invoke(
    {"question": "안녕하세요"},
    config={"configurable": {"session_id": "user123"}}
)
\`\`\`

### 영구 저장

\`\`\`python
from langchain_community.chat_message_histories import RedisChatMessageHistory

def get_redis_history(session_id: str):
    return RedisChatMessageHistory(
        session_id=session_id,
        url="redis://localhost:6379"
    )
\`\`\`
        `
      }
    },
    {
      id: 'chatbot-practice',
      type: 'code',
      title: '대화형 챗봇 실습',
      duration: 90,
      content: {
        objectives: [
          'Memory를 활용한 챗봇을 구현한다',
          '세션 관리를 구현한다',
          '대화 컨텍스트를 유지한다'
        ],
        instructions: `
## 실습: 컨텍스트 인식 챗봇

### 목표
대화 히스토리를 유지하는 챗봇을 구현하세요.

### 요구사항
1. 세션별 대화 히스토리 관리
2. 이전 대화 참조 가능
3. 히스토리 길이 제한 (최근 10개)
4. 세션 초기화 기능
        `,
        starterCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

class ChatBot:
    def __init__(self, system_prompt: str = "당신은 도움이 되는 AI입니다."):
        self.model = ChatOpenAI(model="gpt-4o-mini")
        self.sessions = {}
        # TODO: 체인 구성

    def get_session_history(self, session_id: str):
        # TODO: 구현
        pass

    def chat(self, message: str, session_id: str = "default") -> str:
        # TODO: 구현
        pass

    def clear_session(self, session_id: str):
        # TODO: 구현
        pass

    def get_history(self, session_id: str) -> list:
        # TODO: 구현
        pass

# 테스트
if __name__ == "__main__":
    bot = ChatBot()

    print(bot.chat("내 이름은 철수야", "user1"))
    print(bot.chat("내 이름이 뭐였지?", "user1"))
`,
        solutionCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import StrOutputParser

class ChatBot:
    def __init__(self, system_prompt: str = "당신은 도움이 되는 AI입니다.", max_history: int = 10):
        self.model = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
        self.sessions = {}
        self.max_history = max_history

        # 프롬프트 (히스토리 포함)
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{question}")
        ])

        # 기본 체인
        base_chain = prompt | self.model | StrOutputParser()

        # 히스토리 포함 체인
        self.chain = RunnableWithMessageHistory(
            base_chain,
            self.get_session_history,
            input_messages_key="question",
            history_messages_key="history"
        )

    def get_session_history(self, session_id: str) -> ChatMessageHistory:
        if session_id not in self.sessions:
            self.sessions[session_id] = ChatMessageHistory()
        return self.sessions[session_id]

    def _trim_history(self, session_id: str):
        """히스토리 길이 제한"""
        history = self.sessions.get(session_id)
        if history and len(history.messages) > self.max_history * 2:
            # 최근 메시지만 유지 (질문+응답 쌍)
            history.messages = history.messages[-self.max_history * 2:]

    def chat(self, message: str, session_id: str = "default") -> str:
        response = self.chain.invoke(
            {"question": message},
            config={"configurable": {"session_id": session_id}}
        )
        self._trim_history(session_id)
        return response

    def clear_session(self, session_id: str):
        if session_id in self.sessions:
            self.sessions[session_id].clear()
            print(f"세션 '{session_id}' 초기화됨")

    def get_history(self, session_id: str) -> list:
        history = self.sessions.get(session_id)
        if not history:
            return []
        return [(msg.type, msg.content) for msg in history.messages]

    def list_sessions(self) -> list:
        return list(self.sessions.keys())

# 테스트
if __name__ == "__main__":
    bot = ChatBot(system_prompt="당신은 친절한 AI 어시스턴트입니다. 사용자의 이름을 기억하세요.")

    print("=== 세션 1 (user1) ===")
    print(f"User: 내 이름은 철수야")
    print(f"Bot: {bot.chat('내 이름은 철수야', 'user1')}")

    print(f"\\nUser: 내 이름이 뭐였지?")
    print(f"Bot: {bot.chat('내 이름이 뭐였지?', 'user1')}")

    print("\\n=== 세션 2 (user2) ===")
    print(f"User: 안녕! 나는 영희야")
    print(f"Bot: {bot.chat('안녕! 나는 영희야', 'user2')}")

    print("\\n=== 히스토리 확인 ===")
    print(f"user1 히스토리: {bot.get_history('user1')}")
    print(f"user2 히스토리: {bot.get_history('user2')}")

    print("\\n=== 세션 초기화 ===")
    bot.clear_session('user1')
    print(f"User: 내 이름이 뭐야?")
    print(f"Bot: {bot.chat('내 이름이 뭐야?', 'user1')}")
`
      }
    }
  ]
}

const day5: Day = {
  slug: 'langchain-project',
  title: 'LangChain 미니 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'langchain-project-challenge',
      type: 'challenge',
      title: '문서 Q&A 시스템',
      duration: 180,
      content: {
        objectives: [
          'LangChain 컴포넌트를 통합한다',
          '실전 애플리케이션을 구축한다',
          '프로덕션 고려사항을 적용한다'
        ],
        requirements: [
          '**기본 요구사항**',
          '- PDF 문서 로드 및 청킹',
          '- 벡터 스토어에 임베딩 저장',
          '- 질문에 대한 답변 생성',
          '- 출처 문서 표시',
          '',
          '**LangChain 컴포넌트 활용**',
          '- Document Loaders (PDF)',
          '- Text Splitters',
          '- Embeddings & Vector Store',
          '- Retriever + Chain',
          '',
          '**추가 기능**',
          '- 대화 히스토리 유지',
          '- 답변 불가 시 처리',
          '- 신뢰도 점수 표시'
        ],
        evaluationCriteria: [
          'LangChain 활용도 (25%)',
          '답변 품질 (25%)',
          '코드 구조 (25%)',
          'UX/에러 처리 (25%)'
        ],
        bonusPoints: [
          '다양한 문서 형식 지원',
          '하이브리드 검색 (키워드 + 벡터)',
          '답변 캐싱',
          'Streamlit UI'
        ]
      }
    }
  ]
}

export const langchainBasicsWeek: Week = {
  slug: 'langchain-basics',
  week: 2,
  phase: 5,
  month: 10,
  access: 'pro',
  title: 'LangChain 기초',
  topics: ['LangChain', 'LCEL', 'Chains', 'Memory', 'Output Parsers'],
  practice: '문서 Q&A 시스템',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
