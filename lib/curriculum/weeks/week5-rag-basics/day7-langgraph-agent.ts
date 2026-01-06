// Day 7: LangGraph Agent 심화
// vibecodingcamp7.com 참고 - LangGraph 집중 콘텐츠

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day7LanggraphAgent: Day = {
  slug: 'langgraph-agent',
  title: 'LangGraph Agent 심화',
  totalDuration: 300,
  tasks: [
    // ========================================
    // Task 1: LangGraph 개념과 아키텍처 (40분)
    // ========================================
    createVideoTask('w5d7-langgraph-intro', 'LangGraph 개념과 아키텍처', 40, {
      introduction: `
## LangGraph란?

**LangGraph**는 LangChain 팀이 개발한 **상태 기반 에이전트 프레임워크**입니다.

> "LangGraph is a library for building stateful, multi-actor applications with LLMs"
> — LangChain 공식 문서

## 왜 LangGraph인가?

### 기존 LangChain Agent의 한계

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  기존 LangChain Agent (선형 실행)                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [입력] → [LLM 판단] → [Tool 실행] → [LLM 판단] → [출력]     │
│                                                              │
│  문제점:                                                     │
│  - 복잡한 분기 처리 어려움                                   │
│  - 상태 관리 제한적                                          │
│  - 병렬 처리 불가                                            │
│  - 순환(Loop) 구조 구현 복잡                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### LangGraph의 해결책

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  LangGraph (그래프 기반 실행)                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│              ┌─────────┐                                     │
│              │  START  │                                     │
│              └────┬────┘                                     │
│                   │                                          │
│              ┌────▼────┐                                     │
│         ┌────│  Agent  │────┐                                │
│         │    └────┬────┘    │                                │
│         │         │         │                                │
│    ┌────▼────┐    │    ┌────▼────┐                          │
│    │ Tool A  │    │    │ Tool B  │                          │
│    └────┬────┘    │    └────┬────┘                          │
│         │         │         │                                │
│         └────►────┴────◄────┘                                │
│                   │                                          │
│              ┌────▼────┐                                     │
│              │   END   │                                     │
│              └─────────┘                                     │
│                                                              │
│  장점:                                                       │
│  - 복잡한 워크플로우 시각적 표현                             │
│  - 상태(State) 명시적 관리                                   │
│  - 조건부 분기 & 병렬 처리                                   │
│  - 순환 구조 자연스럽게 지원                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 핵심 개념

### 1. State (상태)

\`\`\`python
from typing import TypedDict, Annotated
import operator

class AgentState(TypedDict):
    # 메시지 히스토리 (누적)
    messages: Annotated[list, operator.add]
    # 현재 단계
    current_step: str
    # 수집된 데이터
    collected_data: dict
    # 최종 결과
    final_answer: str
\`\`\`

### 2. Node (노드)

\`\`\`python
def agent_node(state: AgentState) -> AgentState:
    """LLM이 다음 행동을 결정하는 노드"""
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

def tool_node(state: AgentState) -> AgentState:
    """Tool을 실행하는 노드"""
    last_message = state["messages"][-1]
    result = execute_tool(last_message.tool_calls)
    return {"messages": [result]}
\`\`\`

### 3. Edge (엣지)

\`\`\`python
def should_continue(state: AgentState) -> str:
    """조건부 엣지: 다음 노드 결정"""
    last_message = state["messages"][-1]

    if last_message.tool_calls:
        return "tools"  # Tool 노드로
    return "end"        # 종료
\`\`\`

### 4. Graph (그래프)

\`\`\`python
from langgraph.graph import StateGraph, END

# 그래프 생성
workflow = StateGraph(AgentState)

# 노드 추가
workflow.add_node("agent", agent_node)
workflow.add_node("tools", tool_node)

# 시작점 설정
workflow.set_entry_point("agent")

# 엣지 추가
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {"tools": "tools", "end": END}
)
workflow.add_edge("tools", "agent")  # 순환

# 컴파일
app = workflow.compile()
\`\`\`

## LangGraph vs 다른 프레임워크

| 항목 | LangChain Agent | LangGraph | AutoGen | CrewAI |
|------|-----------------|-----------|---------|--------|
| **철학** | 단순 체인 | 상태 그래프 | 멀티에이전트 대화 | 역할 기반 협업 |
| **상태 관리** | 제한적 | 명시적 | 대화 기반 | 태스크 기반 |
| **복잡도** | 낮음 | 중간 | 높음 | 중간 |
| **유연성** | 중간 | 매우 높음 | 높음 | 중간 |
| **시각화** | 없음 | 그래프 | 대화 로그 | 태스크 로그 |
| **추천 사용처** | 단순 Agent | 복잡한 워크플로우 | 토론/협업 | 팀 시뮬레이션 |
`,
      keyPoints: [
        'LangGraph는 상태 기반 그래프 실행 프레임워크',
        '복잡한 워크플로우를 노드와 엣지로 표현',
        'State, Node, Edge, Graph 4가지 핵심 개념',
        '조건부 분기와 순환 구조 자연스럽게 지원',
      ],
    }),

    // ========================================
    // Task 2: LangGraph 기본 구현 (50분)
    // ========================================
    createCodeTask('w5d7-langgraph-basic', 'LangGraph 기본 Agent 구현', 50, {
      introduction: `
## 학습 목표

- LangGraph로 기본 ReAct Agent를 구현한다
- 상태 정의와 노드 작성 방법을 익힌다
- 조건부 엣지로 워크플로우를 제어한다

## 기본 ReAct Agent 구조

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    ReAct Agent Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [START] ──► [Agent] ──► should_continue? ──► [END]         │
│                 ▲              │                             │
│                 │              ▼                             │
│                 └───── [Tools] ◄────                         │
│                                                              │
│  Agent: LLM이 생각하고 다음 행동 결정                        │
│  Tools: 외부 도구 실행                                       │
│  should_continue: Tool 호출 여부 판단                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`
`,
      codeExample: `"""
LangGraph 기본 ReAct Agent
===========================

🎯 역할:
  - Tool 호출이 가능한 기본 Agent 구현
  - LangGraph의 핵심 패턴 학습

💡 핵심 개념:
  - StateGraph: 상태 기반 그래프
  - add_node: 노드(함수) 추가
  - add_conditional_edges: 조건부 분기
  - compile: 실행 가능한 앱으로 변환
"""

from typing import TypedDict, Annotated, Literal
import operator

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

# ============================================
# 1. 상태(State) 정의
# ============================================

class AgentState(TypedDict):
    """
    🎯 역할: Agent의 전체 상태를 정의

    💡 설명:
      - messages: 대화 히스토리 (Annotated로 누적 방식 지정)
      - operator.add: 새 메시지가 기존 리스트에 추가됨
    """
    messages: Annotated[list, operator.add]


# ============================================
# 2. Tool 정의
# ============================================

@tool
def search_web(query: str) -> str:
    """
    웹에서 정보를 검색합니다.

    Args:
        query: 검색 쿼리

    Returns:
        검색 결과 요약
    """
    # 실제로는 SerpAPI, Tavily 등 사용
    return f"'{query}'에 대한 검색 결과: 최신 정보를 찾았습니다."


@tool
def calculate(expression: str) -> str:
    """
    수학 계산을 수행합니다.

    Args:
        expression: 계산식 (예: "2 + 3 * 4")

    Returns:
        계산 결과
    """
    try:
        result = eval(expression)
        return f"계산 결과: {result}"
    except Exception as e:
        return f"계산 오류: {e}"


@tool
def get_current_time() -> str:
    """현재 시간을 반환합니다."""
    from datetime import datetime
    return f"현재 시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"


tools = [search_web, calculate, get_current_time]


# ============================================
# 3. LLM 설정
# ============================================

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)

# Tool을 LLM에 바인딩
llm_with_tools = llm.bind_tools(tools)


# ============================================
# 4. 노드(Node) 정의
# ============================================

def agent_node(state: AgentState) -> AgentState:
    """
    🎯 역할: LLM이 다음 행동을 결정하는 메인 노드

    💡 설명:
      - 현재까지의 메시지를 보고 LLM이 판단
      - Tool 호출이 필요하면 tool_calls 포함된 응답
      - 충분하면 최종 답변 생성

    Args:
        state: 현재 Agent 상태

    Returns:
        업데이트된 상태 (새 메시지 추가)
    """
    messages = state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}


# ToolNode 사용 (LangGraph 내장)
tool_node = ToolNode(tools)


# ============================================
# 5. 조건부 엣지 (라우팅 함수)
# ============================================

def should_continue(state: AgentState) -> Literal["tools", "end"]:
    """
    🎯 역할: 다음에 실행할 노드를 결정

    💡 설명:
      - 마지막 메시지에 tool_calls가 있으면 → tools 노드
      - 없으면 → 종료 (END)

    Args:
        state: 현재 Agent 상태

    Returns:
        "tools" 또는 "end"
    """
    last_message = state["messages"][-1]

    # Tool 호출이 있는지 확인
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"

    return "end"


# ============================================
# 6. 그래프(Graph) 구성
# ============================================

def create_agent_graph():
    """
    🎯 역할: LangGraph Agent 생성

    💡 그래프 구조:
      START → agent → (조건) → tools → agent → ... → END
    """
    # 1) StateGraph 생성
    workflow = StateGraph(AgentState)

    # 2) 노드 추가
    workflow.add_node("agent", agent_node)
    workflow.add_node("tools", tool_node)

    # 3) 시작점 설정
    workflow.set_entry_point("agent")

    # 4) 조건부 엣지: agent → tools 또는 END
    workflow.add_conditional_edges(
        "agent",              # 소스 노드
        should_continue,      # 라우팅 함수
        {
            "tools": "tools", # tools면 tools 노드로
            "end": END        # end면 종료
        }
    )

    # 5) 일반 엣지: tools → agent (다시 돌아감)
    workflow.add_edge("tools", "agent")

    # 6) 컴파일
    return workflow.compile()


# ============================================
# 7. 실행
# ============================================

if __name__ == "__main__":
    # Agent 생성
    agent = create_agent_graph()

    # 테스트 질문들
    test_queries = [
        "2 + 3 * 4는 얼마야?",
        "현재 시간 알려줘",
        "Python LangGraph에 대해 검색해줘",
        "100의 제곱근을 계산하고, 현재 시간도 알려줘",  # 복합 질문
    ]

    for query in test_queries:
        print(f"\\n{'='*60}")
        print(f"질문: {query}")
        print('='*60)

        # Agent 실행
        result = agent.invoke({
            "messages": [HumanMessage(content=query)]
        })

        # 최종 응답 출력
        final_message = result["messages"][-1]
        print(f"\\n답변: {final_message.content}")

        # 실행 과정 출력 (디버깅용)
        print(f"\\n[실행 과정] 총 {len(result['messages'])}개 메시지")
        for i, msg in enumerate(result["messages"]):
            msg_type = type(msg).__name__
            preview = str(msg.content)[:50] if msg.content else "(tool calls)"
            print(f"  {i+1}. [{msg_type}] {preview}...")
`,
      keyPoints: [
        'StateGraph로 상태 기반 그래프 생성',
        'add_node로 노드(함수) 추가',
        'add_conditional_edges로 분기 로직 구현',
        'ToolNode로 Tool 실행 노드 간편 생성',
      ],
    }),

    // ========================================
    // Task 3: LangGraph 고급 패턴 (50분)
    // ========================================
    createCodeTask('w5d7-langgraph-advanced', 'LangGraph 고급 패턴', 50, {
      introduction: `
## 학습 목표

- 병렬 실행 (Parallel) 패턴을 구현한다
- 서브그래프 (Subgraph) 패턴을 이해한다
- Human-in-the-Loop 패턴을 구현한다

## 고급 패턴 개요

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    LangGraph 고급 패턴                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 병렬 실행 (Parallel)                                     │
│     ┌────┐                                                   │
│     │ A  │ → ┬─► [B1] ─┬─► [C]                              │
│     └────┘   └─► [B2] ─┘                                     │
│                                                              │
│  2. 서브그래프 (Subgraph)                                    │
│     [Main] ──► [Sub Graph] ──► [Main]                       │
│                    │                                         │
│               ┌────┴────┐                                    │
│               │ 내부 로직│                                    │
│               └─────────┘                                    │
│                                                              │
│  3. Human-in-the-Loop                                        │
│     [Agent] ──► [사람 확인] ──► [실행]                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`
`,
      codeExample: `"""
LangGraph 고급 패턴
==================

🎯 역할:
  - 병렬 실행으로 성능 최적화
  - 서브그래프로 복잡한 로직 모듈화
  - Human-in-the-Loop으로 안전한 실행
"""

from typing import TypedDict, Annotated, Literal
import operator
import asyncio

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver


# ============================================
# 패턴 1: 병렬 실행 (Parallel Execution)
# ============================================

class ParallelState(TypedDict):
    """병렬 실행을 위한 상태"""
    query: str
    search_result: str
    analysis_result: str
    final_answer: str


def search_node(state: ParallelState) -> ParallelState:
    """검색 수행 (병렬 브랜치 1)"""
    query = state["query"]
    # 실제로는 API 호출
    result = f"[검색 결과] '{query}'에 대한 정보..."
    return {"search_result": result}


def analyze_node(state: ParallelState) -> ParallelState:
    """분석 수행 (병렬 브랜치 2)"""
    query = state["query"]
    # 실제로는 LLM 분석
    result = f"[분석 결과] '{query}'의 핵심 포인트..."
    return {"analysis_result": result}


def combine_node(state: ParallelState) -> ParallelState:
    """결과 통합"""
    search = state.get("search_result", "")
    analysis = state.get("analysis_result", "")
    final = f"통합 결과:\\n{search}\\n{analysis}"
    return {"final_answer": final}


def create_parallel_graph():
    """
    🎯 병렬 실행 그래프

    구조:
      START → [search_node] ─┬─► [combine] → END
              [analyze_node] ─┘
    """
    workflow = StateGraph(ParallelState)

    # 노드 추가
    workflow.add_node("search", search_node)
    workflow.add_node("analyze", analyze_node)
    workflow.add_node("combine", combine_node)

    # 시작점에서 두 노드로 분기 (병렬)
    workflow.set_entry_point("search")

    # 실제 병렬 실행은 add_node 후 fan-out/fan-in 패턴 사용
    # 여기서는 순차적으로 시뮬레이션
    workflow.add_edge("search", "analyze")
    workflow.add_edge("analyze", "combine")
    workflow.add_edge("combine", END)

    return workflow.compile()


# ============================================
# 패턴 2: Human-in-the-Loop
# ============================================

class HumanLoopState(TypedDict):
    """Human-in-the-Loop 상태"""
    messages: Annotated[list, operator.add]
    pending_action: dict  # 승인 대기 중인 액션
    approved: bool


def plan_action(state: HumanLoopState) -> HumanLoopState:
    """실행할 액션을 계획"""
    # LLM이 액션 계획
    pending = {
        "action": "send_email",
        "params": {
            "to": "user@example.com",
            "subject": "중요 알림"
        }
    }
    return {"pending_action": pending, "approved": False}


def human_review(state: HumanLoopState) -> HumanLoopState:
    """
    🎯 역할: 사람이 액션을 검토/승인

    💡 설명:
      - checkpointer를 사용하면 여기서 일시정지
      - 사람이 승인하면 다음 단계로 진행
    """
    # 실제로는 UI에서 승인 대기
    print(f"\\n⚠️  승인 필요: {state['pending_action']}")
    print("승인하려면 'approve'를 입력하세요...")

    # 시뮬레이션: 자동 승인
    return {"approved": True}


def execute_action(state: HumanLoopState) -> HumanLoopState:
    """승인된 액션 실행"""
    if state["approved"]:
        action = state["pending_action"]
        result = f"✅ 액션 실행 완료: {action['action']}"
    else:
        result = "❌ 액션이 승인되지 않았습니다."

    return {"messages": [AIMessage(content=result)]}


def check_approval(state: HumanLoopState) -> Literal["execute", "end"]:
    """승인 여부에 따라 분기"""
    if state.get("approved", False):
        return "execute"
    return "end"


def create_human_loop_graph():
    """
    🎯 Human-in-the-Loop 그래프

    구조:
      START → [plan] → [human_review] → (승인?) → [execute] → END
                                           └─────────────► END
    """
    workflow = StateGraph(HumanLoopState)

    workflow.add_node("plan", plan_action)
    workflow.add_node("human_review", human_review)
    workflow.add_node("execute", execute_action)

    workflow.set_entry_point("plan")
    workflow.add_edge("plan", "human_review")

    workflow.add_conditional_edges(
        "human_review",
        check_approval,
        {"execute": "execute", "end": END}
    )

    workflow.add_edge("execute", END)

    # Checkpointer로 상태 저장 (일시정지 가능)
    memory = MemorySaver()
    return workflow.compile(checkpointer=memory)


# ============================================
# 패턴 3: 멀티 에이전트 협업
# ============================================

class MultiAgentState(TypedDict):
    """멀티 에이전트 상태"""
    messages: Annotated[list, operator.add]
    current_agent: str
    research_done: bool
    analysis_done: bool


def researcher_agent(state: MultiAgentState) -> MultiAgentState:
    """리서치 에이전트"""
    # 리서치 수행
    result = AIMessage(
        content="[Researcher] 관련 자료를 수집했습니다.",
        name="researcher"
    )
    return {
        "messages": [result],
        "research_done": True,
        "current_agent": "analyst"
    }


def analyst_agent(state: MultiAgentState) -> MultiAgentState:
    """분석 에이전트"""
    result = AIMessage(
        content="[Analyst] 수집된 자료를 분석했습니다.",
        name="analyst"
    )
    return {
        "messages": [result],
        "analysis_done": True,
        "current_agent": "writer"
    }


def writer_agent(state: MultiAgentState) -> MultiAgentState:
    """작성 에이전트"""
    result = AIMessage(
        content="[Writer] 최종 리포트를 작성했습니다.",
        name="writer"
    )
    return {
        "messages": [result],
        "current_agent": "done"
    }


def route_agents(state: MultiAgentState) -> Literal["researcher", "analyst", "writer", "end"]:
    """에이전트 라우팅"""
    current = state.get("current_agent", "researcher")

    if current == "researcher" or not state.get("research_done"):
        return "researcher"
    elif current == "analyst" or not state.get("analysis_done"):
        return "analyst"
    elif current == "writer":
        return "writer"
    else:
        return "end"


def create_multi_agent_graph():
    """
    🎯 멀티 에이전트 그래프

    구조:
      START → [router] → [researcher] → [analyst] → [writer] → END
    """
    workflow = StateGraph(MultiAgentState)

    workflow.add_node("researcher", researcher_agent)
    workflow.add_node("analyst", analyst_agent)
    workflow.add_node("writer", writer_agent)

    # 라우터로 시작
    workflow.set_conditional_entry_point(
        route_agents,
        {
            "researcher": "researcher",
            "analyst": "analyst",
            "writer": "writer",
            "end": END
        }
    )

    # 각 에이전트 후 라우터로 복귀
    for agent in ["researcher", "analyst", "writer"]:
        workflow.add_conditional_edges(
            agent,
            route_agents,
            {
                "researcher": "researcher",
                "analyst": "analyst",
                "writer": "writer",
                "end": END
            }
        )

    return workflow.compile()


# ============================================
# 테스트 실행
# ============================================

if __name__ == "__main__":
    print("\\n" + "="*60)
    print("1. 병렬 실행 패턴")
    print("="*60)

    parallel_graph = create_parallel_graph()
    result = parallel_graph.invoke({"query": "LangGraph 병렬 처리"})
    print(result["final_answer"])

    print("\\n" + "="*60)
    print("2. Human-in-the-Loop 패턴")
    print("="*60)

    human_graph = create_human_loop_graph()
    config = {"configurable": {"thread_id": "test-1"}}
    result = human_graph.invoke(
        {"messages": [HumanMessage(content="이메일 보내줘")]},
        config
    )
    print(result["messages"][-1].content)

    print("\\n" + "="*60)
    print("3. 멀티 에이전트 협업 패턴")
    print("="*60)

    multi_graph = create_multi_agent_graph()
    result = multi_graph.invoke({
        "messages": [HumanMessage(content="시장 분석 리포트 작성해줘")],
        "current_agent": "researcher",
        "research_done": False,
        "analysis_done": False
    })

    for msg in result["messages"]:
        print(msg.content)
`,
      keyPoints: [
        '병렬 실행으로 독립적인 작업 동시 처리',
        'Human-in-the-Loop으로 민감한 작업 승인',
        '멀티 에이전트 협업으로 복잡한 태스크 분담',
        'Checkpointer로 상태 저장 및 일시정지',
      ],
    }),

    // ========================================
    // Task 4: LangGraph 실전 예제 - 리서치 Agent (60분)
    // ========================================
    createCodeTask('w5d7-langgraph-research', 'LangGraph 리서치 Agent 구현', 60, {
      introduction: `
## 학습 목표

- 실제 사용 가능한 리서치 Agent를 구현한다
- 웹 검색, 요약, 답변 생성을 자동화한다
- 반복 개선(Reflection) 패턴을 적용한다

## 리서치 Agent 구조

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                   Research Agent Flow                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [질문] ──► [Planner] ──► [Searcher] ──► [Analyzer]         │
│                              │               │               │
│                              ▼               ▼               │
│                         [검색 결과]     [분석 결과]          │
│                              │               │               │
│                              └───────┬───────┘               │
│                                      ▼                       │
│                               [Synthesizer]                  │
│                                      │                       │
│                                      ▼                       │
│                               [품질 검사]                    │
│                                   │  │                       │
│                           충분 ◄──┘  └──► 부족 (재검색)      │
│                             │                                │
│                             ▼                                │
│                         [최종 답변]                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`
`,
      codeExample: `"""
LangGraph 리서치 Agent
======================

🎯 역할:
  - 복잡한 질문에 대해 자동으로 리서치 수행
  - 웹 검색 → 분석 → 요약 → 품질 검사 → 최종 답변

💡 특징:
  - Reflection 패턴: 결과 품질이 부족하면 재검색
  - 단계별 상태 관리
  - 검색 결과 기반 RAG
"""

from typing import TypedDict, Annotated, Literal, List
import operator
from datetime import datetime

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langgraph.graph import StateGraph, END


# ============================================
# 1. 상태 정의
# ============================================

class ResearchState(TypedDict):
    """리서치 Agent 상태"""
    # 원본 질문
    query: str
    # 검색 계획 (검색할 키워드 목록)
    search_plan: List[str]
    # 수집된 정보
    search_results: List[str]
    # 분석 결과
    analysis: str
    # 최종 답변
    final_answer: str
    # 반복 횟수 (무한 루프 방지)
    iteration: int
    # 품질 점수 (0-10)
    quality_score: int


# ============================================
# 2. LLM 설정
# ============================================

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)


# ============================================
# 3. 노드 함수들
# ============================================

def planner_node(state: ResearchState) -> ResearchState:
    """
    🎯 역할: 검색 계획 수립

    💡 설명:
      - 질문을 분석하여 검색할 키워드/주제 도출
      - 효과적인 리서치를 위한 검색 전략 수립
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", """당신은 리서치 전문가입니다.
주어진 질문에 답하기 위해 검색해야 할 핵심 키워드와 주제를 도출하세요.
각 검색어는 한 줄에 하나씩 출력하세요.
최대 3개의 검색어를 제안하세요."""),
        ("human", "질문: {query}")
    ])

    chain = prompt | llm | StrOutputParser()
    result = chain.invoke({"query": state["query"]})

    # 검색 계획 파싱
    search_plan = [line.strip() for line in result.split("\\n") if line.strip()]

    return {
        "search_plan": search_plan[:3],  # 최대 3개
        "iteration": state.get("iteration", 0) + 1
    }


def searcher_node(state: ResearchState) -> ResearchState:
    """
    🎯 역할: 웹 검색 수행

    💡 설명:
      - 검색 계획에 따라 정보 수집
      - 실제로는 Tavily, SerpAPI 등 사용
    """
    search_results = []

    for keyword in state["search_plan"]:
        # 시뮬레이션된 검색 결과
        # 실제로는 search_tool.invoke(keyword) 사용
        result = f"""
[검색: {keyword}]
- {keyword}에 대한 최신 정보 (2024년 기준)
- 주요 특징과 장단점 분석
- 실제 사용 사례와 적용 방안
- 관련 기술 동향 및 전망
"""
        search_results.append(result)

    return {"search_results": search_results}


def analyzer_node(state: ResearchState) -> ResearchState:
    """
    🎯 역할: 검색 결과 분석 및 요약

    💡 설명:
      - 수집된 정보를 종합 분석
      - 핵심 인사이트 도출
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", """당신은 데이터 분석 전문가입니다.
수집된 검색 결과를 분석하여 핵심 인사이트를 도출하세요.
중복을 제거하고 가장 중요한 정보를 정리하세요."""),
        ("human", """원본 질문: {query}

검색 결과:
{search_results}

위 정보를 분석하여 핵심 내용을 정리해주세요.""")
    ])

    chain = prompt | llm | StrOutputParser()
    analysis = chain.invoke({
        "query": state["query"],
        "search_results": "\\n".join(state["search_results"])
    })

    return {"analysis": analysis}


def synthesizer_node(state: ResearchState) -> ResearchState:
    """
    🎯 역할: 최종 답변 생성

    💡 설명:
      - 분석 결과를 바탕으로 종합적인 답변 작성
      - 사용자 친화적인 형식으로 정리
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", """당신은 리서치 리포트 작성 전문가입니다.
분석된 내용을 바탕으로 사용자의 질문에 대한 종합적인 답변을 작성하세요.

답변 형식:
## 요약
(2-3문장으로 핵심 내용 요약)

## 상세 내용
(주요 발견사항과 인사이트)

## 결론
(최종 권장사항 또는 결론)
"""),
        ("human", """원본 질문: {query}

분석 결과:
{analysis}

위 내용을 바탕으로 최종 답변을 작성해주세요.""")
    ])

    chain = prompt | llm | StrOutputParser()
    final_answer = chain.invoke({
        "query": state["query"],
        "analysis": state["analysis"]
    })

    return {"final_answer": final_answer}


def quality_checker_node(state: ResearchState) -> ResearchState:
    """
    🎯 역할: 답변 품질 평가 (Reflection)

    💡 설명:
      - 생성된 답변의 품질을 0-10점으로 평가
      - 7점 미만이면 재검색 필요
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", """당신은 품질 평가 전문가입니다.
주어진 질문과 답변을 검토하고 품질 점수(0-10)를 부여하세요.

평가 기준:
- 완전성: 질문의 모든 측면을 다루는가?
- 정확성: 정보가 정확한가?
- 명확성: 이해하기 쉽게 작성되었는가?
- 유용성: 실제로 도움이 되는가?

점수만 숫자로 출력하세요. (예: 8)"""),
        ("human", """질문: {query}

답변:
{final_answer}

품질 점수 (0-10):""")
    ])

    chain = prompt | llm | StrOutputParser()
    score_str = chain.invoke({
        "query": state["query"],
        "final_answer": state["final_answer"]
    })

    try:
        score = int(score_str.strip())
    except:
        score = 5  # 파싱 실패 시 기본값

    return {"quality_score": min(10, max(0, score))}


# ============================================
# 4. 라우팅 함수
# ============================================

def should_continue(state: ResearchState) -> Literal["planner", "end"]:
    """
    🎯 역할: 품질 검사 후 다음 단계 결정

    💡 조건:
      - 품질 7점 이상 또는 3회 반복 → 종료
      - 그 외 → 재검색 (planner로 복귀)
    """
    quality = state.get("quality_score", 0)
    iteration = state.get("iteration", 0)

    # 충분한 품질이거나 최대 반복 횟수 도달
    if quality >= 7 or iteration >= 3:
        return "end"

    # 품질 부족 → 재검색
    return "planner"


# ============================================
# 5. 그래프 구성
# ============================================

def create_research_agent():
    """리서치 Agent 그래프 생성"""
    workflow = StateGraph(ResearchState)

    # 노드 추가
    workflow.add_node("planner", planner_node)
    workflow.add_node("searcher", searcher_node)
    workflow.add_node("analyzer", analyzer_node)
    workflow.add_node("synthesizer", synthesizer_node)
    workflow.add_node("quality_checker", quality_checker_node)

    # 엣지 연결
    workflow.set_entry_point("planner")
    workflow.add_edge("planner", "searcher")
    workflow.add_edge("searcher", "analyzer")
    workflow.add_edge("analyzer", "synthesizer")
    workflow.add_edge("synthesizer", "quality_checker")

    # 조건부 엣지 (품질 검사 후)
    workflow.add_conditional_edges(
        "quality_checker",
        should_continue,
        {"planner": "planner", "end": END}
    )

    return workflow.compile()


# ============================================
# 6. 실행
# ============================================

if __name__ == "__main__":
    agent = create_research_agent()

    query = "2024년 LangGraph의 주요 기능과 실제 사용 사례는?"

    print(f"\\n{'='*60}")
    print(f"🔍 리서치 질문: {query}")
    print('='*60)

    result = agent.invoke({
        "query": query,
        "search_plan": [],
        "search_results": [],
        "analysis": "",
        "final_answer": "",
        "iteration": 0,
        "quality_score": 0
    })

    print(f"\\n📊 품질 점수: {result['quality_score']}/10")
    print(f"🔄 반복 횟수: {result['iteration']}")
    print(f"\\n{'='*60}")
    print("📝 최종 답변:")
    print('='*60)
    print(result["final_answer"])
`,
      keyPoints: [
        'Planner → Searcher → Analyzer → Synthesizer 파이프라인',
        'Quality Checker로 답변 품질 자동 평가',
        'Reflection 패턴으로 품질 부족 시 재검색',
        '반복 횟수 제한으로 무한 루프 방지',
      ],
    }),

    // ========================================
    // Task 5: LangGraph 퀴즈 (30분)
    // ========================================
    createQuizTask('w5d7-langgraph-quiz', 'LangGraph 이해도 점검', 30, {
      questions: [
        {
          id: 'lg-q1',
          question: 'LangGraph에서 State의 역할은?',
          options: [
            'LLM을 호출하는 함수',
            '그래프 전체에서 공유되는 데이터 컨테이너',
            '조건부 분기를 결정하는 함수',
            '외부 API를 호출하는 도구',
          ],
          correctAnswer: 1,
          explanation: 'State는 그래프 실행 전체에서 공유되는 데이터 컨테이너입니다. 각 노드는 State를 읽고 업데이트합니다.',
        },
        {
          id: 'lg-q2',
          question: 'add_conditional_edges의 용도는?',
          options: [
            '노드를 추가한다',
            '상태를 초기화한다',
            '조건에 따라 다른 노드로 분기한다',
            '그래프를 컴파일한다',
          ],
          correctAnswer: 2,
          explanation: 'add_conditional_edges는 라우팅 함수의 결과에 따라 다음에 실행할 노드를 결정합니다.',
        },
        {
          id: 'lg-q3',
          question: 'Human-in-the-Loop 패턴의 핵심 구성요소는?',
          options: [
            'ToolNode',
            'Checkpointer (MemorySaver)',
            'OutputParser',
            'PromptTemplate',
          ],
          correctAnswer: 1,
          explanation: 'Checkpointer는 상태를 저장하여 실행을 일시정지하고, 사람의 승인 후 재개할 수 있게 합니다.',
        },
        {
          id: 'lg-q4',
          question: 'Reflection 패턴의 목적은?',
          options: [
            '병렬 처리 속도 향상',
            '메모리 사용량 감소',
            '결과 품질 평가 후 필요시 재실행',
            '외부 API 호출 최소화',
          ],
          correctAnswer: 2,
          explanation: 'Reflection 패턴은 생성된 결과의 품질을 평가하고, 부족하면 이전 단계로 돌아가 개선합니다.',
        },
        {
          id: 'lg-q5',
          question: 'LangGraph vs LangChain Agent의 가장 큰 차이점은?',
          options: [
            'LLM 모델 지원 범위',
            '명시적인 상태 관리와 그래프 기반 실행',
            'Tool 연동 방식',
            '비용 효율성',
          ],
          correctAnswer: 1,
          explanation: 'LangGraph는 StateGraph를 통한 명시적 상태 관리와 노드/엣지 기반의 그래프 실행이 핵심 차별점입니다.',
        },
      ],
    }),

    // ========================================
    // Task 6: LangGraph Challenge (70분)
    // ========================================
    createChallengeTask('w5d7-langgraph-challenge', 'LangGraph 실전 과제', 70, {
      introduction: `
## 🎯 과제: 뉴스 분석 LangGraph Agent

VibeCodingCamp의 PubChem Agent처럼, **특정 도메인에 특화된 Agent**를 구현합니다.

### 요구사항

1. **뉴스 수집 Agent**
   - 네이버 뉴스 API 또는 시뮬레이션 데이터 사용
   - 특정 키워드로 뉴스 검색

2. **감성 분석 Agent**
   - 수집된 뉴스의 감성(긍정/부정/중립) 분석
   - 신뢰도 점수 포함

3. **요약 Agent**
   - 여러 뉴스를 종합하여 핵심 요약 생성

4. **품질 검사 노드**
   - Reflection 패턴 적용
   - 품질 부족 시 재검색

### 그래프 구조

\`\`\`
[START]
    │
    ▼
[Planner] ──► 검색 키워드 도출
    │
    ▼
[News Collector] ──► 뉴스 수집
    │
    ▼
[Sentiment Analyzer] ──► 감성 분석
    │
    ▼
[Summarizer] ──► 종합 요약
    │
    ▼
[Quality Check] ──► 품질 7점 이상? ──Yes──► [END]
    │
    No
    │
    └──────► [Planner] (재검색)
\`\`\`

### 평가 기준

| 항목 | 배점 |
|------|------|
| 그래프 구조 정확성 | 30점 |
| 4개 Agent 노드 구현 | 40점 |
| Reflection 패턴 적용 | 20점 |
| 코드 품질 및 주석 | 10점 |

### 제출물

1. \`news_agent.py\` - LangGraph Agent 코드
2. 실행 결과 스크린샷 3개
3. (선택) LangSmith 트레이스 링크
`,
      hints: [
        'StateGraph의 State에 news_list, sentiments, summary 필드 추가',
        '각 Agent 노드는 State를 받아 업데이트된 State 반환',
        '품질 검사는 요약의 길이, 감성 분석 완료 여부 등으로 판단',
        '무한 루프 방지를 위해 iteration 카운터 사용',
      ],
    }),
  ],
}
