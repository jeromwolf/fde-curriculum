// Phase 5, Week 6: 멀티 에이전트 시스템
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'multi-agent-intro',
  title: '멀티 에이전트 개념',
  totalDuration: 180,
  tasks: [
    {
      id: 'multi-agent-video',
      type: 'video',
      title: '멀티 에이전트 아키텍처',
      duration: 35,
      content: {
        objectives: ['멀티 에이전트 시스템의 필요성을 이해한다', '에이전트 간 통신 패턴을 학습한다', 'Supervisor vs Hierarchical 구조를 비교한다'],
        videoUrl: 'https://www.youtube.com/watch?v=multi-agent-placeholder',
        transcript: `
## 멀티 에이전트 시스템

### 왜 멀티 에이전트인가?

\`\`\`
단일 에이전트의 한계:
├── 복잡한 작업 처리 어려움
├── 전문성 부족 (모든 도메인)
├── 확장성 한계
└── 디버깅 어려움

멀티 에이전트 장점:
├── 역할 분담 (전문화)
├── 병렬 처리
├── 모듈화
└── 확장 용이
\`\`\`

### 아키텍처 패턴

\`\`\`
1. Supervisor (감독자)
   [Supervisor] → [Agent A] → [Agent B] → [Agent C]
   - 중앙 통제
   - 작업 분배

2. Hierarchical (계층형)
   [Manager]
   ├── [Team Lead 1] → [Worker 1, 2]
   └── [Team Lead 2] → [Worker 3, 4]

3. Peer-to-Peer
   [Agent A] ↔ [Agent B] ↔ [Agent C]
   - 분산 협업
\`\`\`

### LangGraph 멀티 에이전트

\`\`\`python
from langgraph.graph import StateGraph, END

# 상태 정의
class AgentState(TypedDict):
    messages: list
    next_agent: str

# 그래프 구성
graph = StateGraph(AgentState)
graph.add_node("researcher", researcher_agent)
graph.add_node("writer", writer_agent)
graph.add_node("reviewer", reviewer_agent)

# 라우팅
graph.add_conditional_edges(
    "supervisor",
    route_to_next_agent,
    {"researcher": "researcher", "writer": "writer", "finish": END}
)
\`\`\`
        `
      }
    },
    {
      id: 'langgraph-intro-video',
      type: 'video',
      title: 'LangGraph 기초',
      duration: 30,
      content: {
        objectives: ['LangGraph 구조를 이해한다', 'StateGraph 사용법을 학습한다', '조건부 라우팅을 구현한다'],
        videoUrl: 'https://www.youtube.com/watch?v=langgraph-placeholder',
        transcript: `
## LangGraph

### 기본 구조

\`\`\`python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    messages: list[str]
    counter: int

def node_a(state: State) -> State:
    return {"messages": state["messages"] + ["A 처리"], "counter": state["counter"] + 1}

def node_b(state: State) -> State:
    return {"messages": state["messages"] + ["B 처리"], "counter": state["counter"] + 1}

# 그래프 정의
graph = StateGraph(State)
graph.add_node("a", node_a)
graph.add_node("b", node_b)

# 엣지 추가
graph.set_entry_point("a")
graph.add_edge("a", "b")
graph.add_edge("b", END)

# 컴파일 및 실행
app = graph.compile()
result = app.invoke({"messages": [], "counter": 0})
\`\`\`
        `
      }
    },
    {
      id: 'multi-agent-basic-practice',
      type: 'code',
      title: '멀티 에이전트 기초 실습',
      duration: 90,
      content: {
        objectives: ['LangGraph로 멀티 에이전트 시스템을 구현한다'],
        instructions: 'Supervisor 패턴으로 리서처-라이터 에이전트를 구현하세요.',
        starterCode: `from langgraph.graph import StateGraph, END
from typing import TypedDict

# 멀티 에이전트 구현`,
        solutionCode: `from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from typing import TypedDict, Annotated
import operator

class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    next: str

llm = ChatOpenAI(model="gpt-4o-mini")

def researcher(state: AgentState) -> AgentState:
    last_message = state["messages"][-1] if state["messages"] else ""
    response = llm.invoke(f"리서처로서 다음 주제를 조사하세요: {last_message}")
    return {"messages": [f"[Research] {response.content}"], "next": "writer"}

def writer(state: AgentState) -> AgentState:
    research = state["messages"][-1] if state["messages"] else ""
    response = llm.invoke(f"라이터로서 다음 리서치를 바탕으로 글을 작성하세요: {research}")
    return {"messages": [f"[Article] {response.content}"], "next": "end"}

def router(state: AgentState) -> str:
    return state.get("next", "end")

# 그래프 구성
graph = StateGraph(AgentState)
graph.add_node("researcher", researcher)
graph.add_node("writer", writer)

graph.set_entry_point("researcher")
graph.add_conditional_edges("researcher", router, {"writer": "writer", "end": END})
graph.add_conditional_edges("writer", router, {"end": END})

app = graph.compile()

# 실행
result = app.invoke({"messages": ["인공지능의 미래"], "next": ""})
for msg in result["messages"]:
    print(msg[:200] + "...")
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'supervisor-pattern',
  title: 'Supervisor 패턴',
  totalDuration: 180,
  tasks: [
    {
      id: 'supervisor-video',
      type: 'video',
      title: 'Supervisor Agent 설계',
      duration: 35,
      content: {
        objectives: ['Supervisor 패턴을 구현한다', '동적 라우팅을 설계한다', '작업 분배 전략을 학습한다'],
        videoUrl: 'https://www.youtube.com/watch?v=supervisor-placeholder',
        transcript: `
## Supervisor 패턴

### 구조

\`\`\`
[User Request]
      ↓
[Supervisor Agent]
├── 작업 분석
├── 에이전트 선택
└── 결과 통합
      ↓
[Researcher] [Writer] [Coder] [Analyst]
      ↓
[Final Response]
\`\`\`

### Supervisor 구현

\`\`\`python
def supervisor(state: AgentState) -> AgentState:
    prompt = f"""
    다음 요청을 처리할 에이전트를 선택하세요.
    선택지: researcher, writer, coder, FINISH

    요청: {state["messages"][-1]}
    진행 상황: {state["history"]}

    다음 에이전트:
    """
    response = llm.invoke(prompt)
    next_agent = response.content.strip().lower()
    return {"next": next_agent}
\`\`\`
        `
      }
    },
    {
      id: 'supervisor-practice',
      type: 'code',
      title: 'Supervisor 에이전트 실습',
      duration: 90,
      content: {
        objectives: ['완전한 Supervisor 시스템을 구현한다'],
        instructions: '여러 전문가 에이전트를 조율하는 Supervisor를 구현하세요.',
        starterCode: `# Supervisor 패턴 구현`,
        solutionCode: `from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from typing import TypedDict, Annotated, Literal
import operator

class SupervisorState(TypedDict):
    messages: Annotated[list, operator.add]
    next: str

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

TEAM_MEMBERS = ["researcher", "coder", "writer"]

def supervisor(state: SupervisorState) -> SupervisorState:
    messages = state["messages"]
    last_msg = messages[-1] if messages else ""

    prompt = f"""팀 리더로서 다음 요청을 처리할 팀원을 선택하세요.
팀원: {", ".join(TEAM_MEMBERS)}
작업이 완료되면 FINISH를 선택하세요.

요청/진행: {last_msg}

선택 (팀원 이름 또는 FINISH):"""

    response = llm.invoke(prompt)
    choice = response.content.strip().lower()

    if choice not in TEAM_MEMBERS:
        choice = "FINISH"

    return {"messages": [f"[Supervisor] 다음 담당: {choice}"], "next": choice}

def researcher(state: SupervisorState) -> SupervisorState:
    response = llm.invoke("리서처로서 정보를 조사하세요.")
    return {"messages": [f"[Researcher] {response.content}"], "next": "supervisor"}

def coder(state: SupervisorState) -> SupervisorState:
    response = llm.invoke("코더로서 코드를 작성하세요.")
    return {"messages": [f"[Coder] {response.content}"], "next": "supervisor"}

def writer(state: SupervisorState) -> SupervisorState:
    response = llm.invoke("라이터로서 문서를 작성하세요.")
    return {"messages": [f"[Writer] {response.content}"], "next": "supervisor"}

def route(state: SupervisorState) -> Literal["researcher", "coder", "writer", "__end__"]:
    next_step = state.get("next", "FINISH")
    if next_step == "FINISH":
        return "__end__"
    return next_step

# 그래프 구성
graph = StateGraph(SupervisorState)
graph.add_node("supervisor", supervisor)
graph.add_node("researcher", researcher)
graph.add_node("coder", coder)
graph.add_node("writer", writer)

graph.set_entry_point("supervisor")
graph.add_conditional_edges("supervisor", route)

for member in TEAM_MEMBERS:
    graph.add_edge(member, "supervisor")

app = graph.compile()
`
      }
    }
  ]
}

const day3: Day = {
  slug: 'collaboration-patterns',
  title: '협업 패턴',
  totalDuration: 180,
  tasks: [
    {
      id: 'collaboration-video',
      type: 'video',
      title: '에이전트 협업 패턴',
      duration: 35,
      content: {
        objectives: ['다양한 협업 패턴을 이해한다', 'Debate/Critique 패턴을 학습한다', 'Consensus 메커니즘을 구현한다'],
        videoUrl: 'https://www.youtube.com/watch?v=collaboration-placeholder',
        transcript: `
## 에이전트 협업 패턴

### Debate 패턴
\`\`\`
[주제] → [Agent A 의견] → [Agent B 반론] → [Agent A 재반론] → [Moderator 결론]
\`\`\`

### Critique 패턴
\`\`\`
[Generator] → [초안] → [Critic] → [피드백] → [Generator] → [개선안]
\`\`\`

### Consensus 패턴
\`\`\`
[Agent 1] ─┐
[Agent 2] ─┼→ [투표/합의] → [최종 결정]
[Agent 3] ─┘
\`\`\`
        `
      }
    },
    {
      id: 'collaboration-practice',
      type: 'code',
      title: '협업 패턴 실습',
      duration: 90,
      content: {
        objectives: ['Debate/Critique 패턴을 구현한다'],
        instructions: '생성자-비평자 협업 시스템을 구현하세요.',
        starterCode: `# 협업 패턴 구현`,
        solutionCode: `from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

class GeneratorCriticSystem:
    def __init__(self, max_iterations: int = 3):
        self.max_iterations = max_iterations

    def generate(self, task: str, feedback: str = "") -> str:
        prompt = f"작업: {task}"
        if feedback:
            prompt += f"\\n이전 피드백: {feedback}\\n개선하세요."
        return llm.invoke(prompt).content

    def critique(self, output: str, task: str) -> tuple[str, bool]:
        prompt = f"""다음 출력을 평가하세요.
작업: {task}
출력: {output}

피드백 (개선 필요시) 또는 "APPROVED" (만족시):"""
        response = llm.invoke(prompt).content
        approved = "APPROVED" in response.upper()
        return response, approved

    def run(self, task: str) -> str:
        output = ""
        feedback = ""

        for i in range(self.max_iterations):
            print(f"\\n=== Iteration {i+1} ===")
            output = self.generate(task, feedback)
            print(f"Generated: {output[:100]}...")

            feedback, approved = self.critique(output, task)
            print(f"Feedback: {feedback[:100]}...")

            if approved:
                print("Approved!")
                break

        return output
`
      }
    }
  ]
}

const day4: Day = {
  slug: 'human-in-loop',
  title: 'Human-in-the-Loop',
  totalDuration: 180,
  tasks: [
    {
      id: 'hitl-video',
      type: 'video',
      title: 'Human-in-the-Loop 설계',
      duration: 35,
      content: {
        objectives: ['HITL의 필요성을 이해한다', '승인 워크플로우를 설계한다', '피드백 루프를 구현한다'],
        videoUrl: 'https://www.youtube.com/watch?v=hitl-placeholder',
        transcript: `
## Human-in-the-Loop

### 언제 필요한가?

\`\`\`
1. 고위험 결정 (금융, 의료)
2. 비가역적 행동 (이메일 발송, DB 삭제)
3. 불확실한 상황
4. 품질 보증 필요
\`\`\`

### LangGraph Interrupt

\`\`\`python
from langgraph.prebuilt import interrupt

def sensitive_action(state):
    # 사용자 승인 요청
    approval = interrupt(
        message="이 작업을 실행하시겠습니까?",
        options=["approve", "reject", "modify"]
    )

    if approval == "approve":
        return execute_action()
    elif approval == "modify":
        return request_modification()
    else:
        return cancel_action()
\`\`\`
        `
      }
    },
    {
      id: 'hitl-practice',
      type: 'code',
      title: 'HITL 실습',
      duration: 90,
      content: {
        objectives: ['Human-in-the-Loop 워크플로우를 구현한다'],
        instructions: '사용자 승인이 필요한 에이전트 시스템을 구현하세요.',
        starterCode: `# HITL 구현`,
        solutionCode: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class HITLState(TypedDict):
    task: str
    draft: str
    approval: str
    final: str

def generate_draft(state: HITLState) -> HITLState:
    # LLM으로 초안 생성
    draft = f"[Draft for: {state['task']}]"
    return {"draft": draft, "approval": "pending"}

def human_review(state: HITLState) -> HITLState:
    # 실제로는 UI에서 입력 받음
    print(f"\\nDraft: {state['draft']}")
    approval = input("Approve? (yes/no/modify): ").strip().lower()
    return {"approval": approval}

def finalize(state: HITLState) -> HITLState:
    if state["approval"] == "yes":
        return {"final": state["draft"]}
    return {"final": "Cancelled"}

def route_approval(state: HITLState) -> str:
    if state["approval"] == "yes":
        return "finalize"
    elif state["approval"] == "modify":
        return "generate_draft"
    return "end"

graph = StateGraph(HITLState)
graph.add_node("generate_draft", generate_draft)
graph.add_node("human_review", human_review)
graph.add_node("finalize", finalize)

graph.set_entry_point("generate_draft")
graph.add_edge("generate_draft", "human_review")
graph.add_conditional_edges("human_review", route_approval, {"finalize": "finalize", "generate_draft": "generate_draft", "end": END})
graph.add_edge("finalize", END)

app = graph.compile()
`
      }
    }
  ]
}

const day5: Day = {
  slug: 'multi-agent-project',
  title: '멀티 에이전트 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'multi-agent-challenge',
      type: 'challenge',
      title: 'AI 콘텐츠 팀 시스템',
      duration: 180,
      content: {
        objectives: ['실전 멀티 에이전트 시스템을 구축한다'],
        requirements: [
          '**에이전트 구성**',
          '- Supervisor (프로젝트 매니저)',
          '- Researcher (리서처)',
          '- Writer (작가)',
          '- Editor (편집자)',
          '',
          '**워크플로우**',
          '- 주제 → 리서치 → 초안 → 편집 → 최종',
          '- 피드백 루프',
          '- Human-in-the-Loop'
        ],
        evaluationCriteria: ['시스템 설계 (25%)', '에이전트 품질 (25%)', '협업 로직 (25%)', '완성도 (25%)'],
        bonusPoints: ['다중 라운드 피드백', '병렬 처리', 'Streamlit UI', '품질 메트릭']
      }
    }
  ]
}

export const multiAgentWeek: Week = {
  slug: 'multi-agent',
  week: 6,
  phase: 5,
  month: 11,
  access: 'pro',
  title: '멀티 에이전트 시스템',
  topics: ['LangGraph', 'Multi-Agent', 'Supervisor', 'Collaboration', 'Human-in-the-Loop'],
  practice: 'AI 콘텐츠 팀 시스템',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
