// Phase 5, Week 5: AI 에이전트 기초
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'agent-fundamentals',
  title: '에이전트 개념',
  totalDuration: 180,
  tasks: [
    {
      id: 'agent-intro-video',
      type: 'video',
      title: 'AI 에이전트란?',
      duration: 35,
      content: {
        objectives: ['에이전트의 정의와 구성요소를 이해한다', 'ReAct 패턴을 학습한다', '에이전트 vs 체인의 차이를 파악한다'],
        videoUrl: 'https://www.youtube.com/watch?v=agent-intro-placeholder',
        transcript: `
## AI 에이전트 개요

### 에이전트란?

\`\`\`
에이전트 = LLM + Tools + Reasoning

Chain과의 차이:
├── Chain: 미리 정의된 순서로 실행
└── Agent: LLM이 다음 행동을 동적으로 결정

에이전트 루프:
[질문] → [LLM 추론] → [도구 선택] → [실행] → [결과 관찰] → [추가 추론/완료]
\`\`\`

### ReAct (Reasoning + Acting)

\`\`\`
사용자: "서울 날씨가 어때? 우산이 필요할까?"

Thought: 서울의 현재 날씨를 확인해야 해
Action: get_weather(city="서울")
Observation: 맑음, 25도, 강수 확률 10%

Thought: 강수 확률이 낮으니 우산은 필요 없을 것 같아
Action: Final Answer
Answer: 서울은 맑고 25도입니다. 강수 확률이 10%로 낮아 우산은 필요 없을 것 같습니다.
\`\`\`

### 에이전트 구성 요소

\`\`\`
1. LLM (두뇌)
   └── 추론, 계획, 도구 선택

2. Tools (도구)
   └── 검색, 계산, API 호출

3. Memory (기억)
   └── 대화 히스토리, 컨텍스트

4. Planner (선택적)
   └── 복잡한 작업 분해
\`\`\`
        `
      }
    },
    {
      id: 'langchain-agent-video',
      type: 'video',
      title: 'LangChain Agent',
      duration: 30,
      content: {
        objectives: ['LangChain Agent 구조를 이해한다', 'Tool 정의와 바인딩을 학습한다', '에이전트 실행 흐름을 파악한다'],
        videoUrl: 'https://www.youtube.com/watch?v=langchain-agent-placeholder',
        transcript: `
## LangChain Agent

### 기본 구조

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate

# 1. 도구 정의
@tool
def get_weather(city: str) -> str:
    """주어진 도시의 현재 날씨를 조회합니다."""
    return f"{city}: 맑음, 25도"

# 2. 프롬프트
prompt = ChatPromptTemplate.from_messages([
    ("system", "당신은 도움이 되는 AI입니다."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}")
])

# 3. 에이전트 생성
llm = ChatOpenAI(model="gpt-4o-mini")
agent = create_tool_calling_agent(llm, [get_weather], prompt)

# 4. 실행기
executor = AgentExecutor(agent=agent, tools=[get_weather], verbose=True)

# 5. 실행
result = executor.invoke({"input": "서울 날씨 어때?"})
\`\`\`
        `
      }
    },
    {
      id: 'agent-basic-practice',
      type: 'code',
      title: '에이전트 기본 실습',
      duration: 90,
      content: {
        objectives: ['기본 에이전트를 구현한다', '커스텀 도구를 정의한다'],
        instructions: '날씨, 계산기, 검색 도구를 가진 에이전트를 구현하세요.',
        starterCode: `from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate

# TODO: 도구 정의
@tool
def get_weather(city: str) -> str:
    """날씨 조회"""
    pass

@tool
def calculate(expression: str) -> str:
    """수학 계산"""
    pass

# TODO: 에이전트 생성 및 실행
`,
        solutionCode: `from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate

@tool
def get_weather(city: str) -> str:
    """주어진 도시의 현재 날씨를 조회합니다."""
    weather_data = {
        "서울": "맑음, 25도",
        "부산": "흐림, 22도",
        "제주": "비, 20도"
    }
    return weather_data.get(city, f"{city}: 정보 없음")

@tool
def calculate(expression: str) -> str:
    """수학 표현식을 계산합니다. 예: '2 + 3 * 4'"""
    try:
        result = eval(expression)
        return f"{expression} = {result}"
    except Exception as e:
        return f"계산 오류: {e}"

@tool
def search_web(query: str) -> str:
    """웹에서 정보를 검색합니다."""
    return f"'{query}' 검색 결과: 관련 정보가 있습니다."

# 프롬프트
prompt = ChatPromptTemplate.from_messages([
    ("system", "당신은 도움이 되는 AI 어시스턴트입니다. 필요한 경우 도구를 사용하세요."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}")
])

# 에이전트 생성
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
tools = [get_weather, calculate, search_web]
agent = create_tool_calling_agent(llm, tools, prompt)

# 실행기
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    max_iterations=5
)

# 테스트
if __name__ == "__main__":
    queries = [
        "서울 날씨 어때?",
        "123 * 456은?",
        "서울 날씨를 확인하고, 20도보다 높으면 '덥다'고 말해줘"
    ]
    for q in queries:
        print(f"\\nQ: {q}")
        result = executor.invoke({"input": q})
        print(f"A: {result['output']}")
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'tool-design',
  title: '도구 설계 & 구현',
  totalDuration: 180,
  tasks: [
    {
      id: 'tool-design-video',
      type: 'video',
      title: '효과적인 Tool 설계',
      duration: 35,
      content: {
        objectives: ['좋은 도구의 특성을 이해한다', 'Pydantic 기반 도구를 정의한다', '에러 처리와 검증을 구현한다'],
        videoUrl: 'https://www.youtube.com/watch?v=tool-design-placeholder',
        transcript: `
## 효과적인 Tool 설계

### 좋은 도구의 특성

\`\`\`
1. 명확한 이름
   ❌ process_data
   ✅ search_customer_orders

2. 상세한 설명
   ❌ "데이터 검색"
   ✅ "고객 ID로 최근 30일 주문 내역 검색"

3. 명확한 파라미터
   ❌ data: Any
   ✅ customer_id: str, days: int = 30
\`\`\`

### Pydantic 기반 도구

\`\`\`python
from langchain_core.tools import StructuredTool
from pydantic import BaseModel, Field

class SearchInput(BaseModel):
    query: str = Field(description="검색어")
    max_results: int = Field(default=5, ge=1, le=20)

def search_documents(query: str, max_results: int = 5) -> str:
    # 구현
    pass

tool = StructuredTool.from_function(
    func=search_documents,
    name="search_documents",
    description="문서 검색",
    args_schema=SearchInput
)
\`\`\`
        `
      }
    },
    {
      id: 'tool-practice',
      type: 'code',
      title: '도구 설계 실습',
      duration: 90,
      content: {
        objectives: ['실용적인 도구를 설계하고 구현한다'],
        instructions: 'DB 조회, API 호출 등 실전 도구를 구현하세요.',
        starterCode: `# 실전 도구 구현`,
        solutionCode: `from langchain_core.tools import StructuredTool
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class OrderSearchInput(BaseModel):
    customer_id: str = Field(description="고객 ID")
    status: Optional[str] = Field(default=None, description="주문 상태 (pending/shipped/delivered)")
    days: int = Field(default=30, ge=1, le=365, description="조회 기간 (일)")

def search_orders(customer_id: str, status: Optional[str] = None, days: int = 30) -> str:
    # 실제로는 DB 조회
    orders = [
        {"id": "ORD001", "status": "delivered", "amount": 50000},
        {"id": "ORD002", "status": "pending", "amount": 30000}
    ]
    if status:
        orders = [o for o in orders if o["status"] == status]
    return f"고객 {customer_id}의 주문: {orders}"

order_search_tool = StructuredTool.from_function(
    func=search_orders,
    name="search_orders",
    description="고객의 주문 내역을 검색합니다. 상태 필터링 가능.",
    args_schema=OrderSearchInput
)
`
      }
    }
  ]
}

const day3: Day = {
  slug: 'agent-memory',
  title: '에이전트 메모리',
  totalDuration: 180,
  tasks: [
    {
      id: 'agent-memory-video',
      type: 'video',
      title: '에이전트 메모리 전략',
      duration: 35,
      content: {
        objectives: ['에이전트 메모리 유형을 이해한다', '대화 컨텍스트를 유지한다', '장기 기억을 구현한다'],
        videoUrl: 'https://www.youtube.com/watch?v=agent-memory-placeholder',
        transcript: `
## 에이전트 메모리

### 메모리 유형

\`\`\`
1. Short-term (단기)
   └── 현재 대화 컨텍스트

2. Long-term (장기)
   └── 사용자 선호, 과거 상호작용

3. Working (작업)
   └── 현재 작업 진행 상황
\`\`\`

### LangGraph와 메모리

\`\`\`python
from langgraph.checkpoint.memory import MemorySaver

memory = MemorySaver()
app = create_agent_app(checkpointer=memory)

# 대화 유지
config = {"configurable": {"thread_id": "user123"}}
app.invoke({"input": "내 이름은 철수야"}, config)
app.invoke({"input": "내 이름이 뭐였지?"}, config)  # 기억함
\`\`\`
        `
      }
    },
    {
      id: 'agent-memory-practice',
      type: 'code',
      title: '에이전트 메모리 실습',
      duration: 90,
      content: {
        objectives: ['메모리를 가진 에이전트를 구현한다'],
        instructions: '대화 히스토리와 사용자 정보를 기억하는 에이전트를 구현하세요.',
        starterCode: `# 메모리 에이전트 구현`,
        solutionCode: `from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

class MemoryAgent:
    def __init__(self, tools: list):
        self.llm = ChatOpenAI(model="gpt-4o-mini")
        self.tools = tools
        self.sessions = {}
        self._setup_agent()

    def _setup_agent(self):
        prompt = ChatPromptTemplate.from_messages([
            ("system", "당신은 도움이 되는 AI입니다. 이전 대화를 기억합니다."),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad")
        ])
        agent = create_tool_calling_agent(self.llm, self.tools, prompt)
        self.executor = AgentExecutor(agent=agent, tools=self.tools)

        self.agent_with_history = RunnableWithMessageHistory(
            self.executor,
            self._get_session_history,
            input_messages_key="input",
            history_messages_key="history"
        )

    def _get_session_history(self, session_id: str):
        if session_id not in self.sessions:
            self.sessions[session_id] = ChatMessageHistory()
        return self.sessions[session_id]

    def chat(self, message: str, session_id: str = "default") -> str:
        result = self.agent_with_history.invoke(
            {"input": message},
            config={"configurable": {"session_id": session_id}}
        )
        return result["output"]
`
      }
    }
  ]
}

const day4: Day = {
  slug: 'agent-patterns',
  title: '에이전트 패턴',
  totalDuration: 180,
  tasks: [
    {
      id: 'agent-patterns-video',
      type: 'video',
      title: '실전 에이전트 패턴',
      duration: 40,
      content: {
        objectives: ['Plan-and-Execute 패턴을 이해한다', 'Reflection 패턴을 학습한다', 'Tool Selection 전략을 파악한다'],
        videoUrl: 'https://www.youtube.com/watch?v=agent-patterns-placeholder',
        transcript: `
## 에이전트 패턴

### Plan-and-Execute

\`\`\`
1. 계획 수립 (Planner LLM)
   "여행 계획을 세워줘" →
   Step 1: 목적지 날씨 확인
   Step 2: 항공편 검색
   Step 3: 숙소 검색
   Step 4: 일정 조합

2. 단계별 실행 (Executor)
   각 단계를 순차 실행

3. 결과 통합
\`\`\`

### Reflection 패턴

\`\`\`
Generate → Evaluate → Refine

1. 초기 답변 생성
2. 자기 평가 (문제점 파악)
3. 개선된 답변 생성
4. 반복 (품질 기준 충족까지)
\`\`\`
        `
      }
    },
    {
      id: 'agent-patterns-practice',
      type: 'code',
      title: '에이전트 패턴 실습',
      duration: 90,
      content: {
        objectives: ['Plan-and-Execute 에이전트를 구현한다'],
        instructions: '복잡한 작업을 계획하고 실행하는 에이전트를 구현하세요.',
        starterCode: `# Plan-and-Execute 구현`,
        solutionCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

class PlanAndExecuteAgent:
    def __init__(self, tools: list):
        self.planner_llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.executor_llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.tools = {t.name: t for t in tools}

    def plan(self, task: str) -> list[str]:
        prompt = ChatPromptTemplate.from_template("""
작업을 수행하기 위한 단계별 계획을 세우세요.
각 단계는 한 줄로 작성하세요.

작업: {task}

계획:""")
        chain = prompt | self.planner_llm
        result = chain.invoke({"task": task})
        return [s.strip() for s in result.content.split("\\n") if s.strip()]

    def execute_step(self, step: str) -> str:
        # 도구 필요 여부 판단 및 실행
        prompt = f"다음 단계를 수행하세요: {step}"
        result = self.executor_llm.invoke(prompt)
        return result.content

    def run(self, task: str) -> str:
        steps = self.plan(task)
        results = []
        for i, step in enumerate(steps):
            result = self.execute_step(step)
            results.append(f"Step {i+1}: {result}")
        return "\\n".join(results)
`
      }
    }
  ]
}

const day5: Day = {
  slug: 'agent-project',
  title: '에이전트 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'agent-project-challenge',
      type: 'challenge',
      title: 'AI 리서치 어시스턴트',
      duration: 180,
      content: {
        objectives: ['실전 에이전트 시스템을 구축한다', '다양한 도구를 통합한다'],
        requirements: [
          '**도구 구현**',
          '- 웹 검색 (DuckDuckGo/Tavily)',
          '- 문서 요약',
          '- 노트 저장/조회',
          '',
          '**에이전트 기능**',
          '- 주제 리서치 및 요약',
          '- 출처 관리',
          '- 대화 메모리',
          '',
          '**품질**',
          '- 에러 핸들링',
          '- 재시도 로직'
        ],
        evaluationCriteria: ['도구 품질 (25%)', '에이전트 로직 (25%)', '메모리 관리 (25%)', '사용자 경험 (25%)'],
        bonusPoints: ['Plan-and-Execute 적용', 'Reflection 패턴', 'Streamlit UI', '평가 자동화']
      }
    }
  ]
}

export const aiAgentsWeek: Week = {
  slug: 'ai-agents',
  week: 5,
  phase: 5,
  month: 11,
  access: 'pro',
  title: 'AI 에이전트 기초',
  topics: ['Agent', 'ReAct', 'Tools', 'Memory', 'Plan-and-Execute'],
  practice: 'AI 리서치 어시스턴트',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
