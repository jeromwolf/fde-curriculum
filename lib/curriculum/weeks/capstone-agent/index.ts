// Phase 6, Week 6: Agent 시스템 구현
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'agent-fundamentals',
  title: 'Agent 기초',
  totalDuration: 180,
  tasks: [
    {
      id: 'function-calling',
      type: 'project',
      title: 'Function Calling 구현',
      duration: 120,
      content: {
        objectives: [
          'OpenAI Function Calling을 이해한다',
          '도메인 특화 도구를 정의한다',
          'LLM이 도구를 호출하도록 구현한다'
        ],
        requirements: [
          '**Day 1 마일스톤: Function Calling**',
          '',
          '## Tool 정의',
          '```python',
          '# src/agent/tools.py',
          'from langchain_core.tools import tool',
          'from typing import Optional',
          '',
          '@tool',
          'def search_knowledge_graph(',
          '    company: str,',
          '    relation_type: Optional[str] = None',
          ') -> str:',
          '    """Knowledge Graph에서 기업 관계를 검색합니다.',
          '',
          '    Args:',
          '        company: 검색할 기업명',
          '        relation_type: 관계 유형 (competes_with, supplies_to 등)',
          '    """',
          '    # Neo4j 쿼리 실행',
          '    results = query_neo4j(company, relation_type)',
          '    return format_results(results)',
          '',
          '@tool',
          'def get_stock_price(ticker: str) -> str:',
          '    """주식 시세를 조회합니다."""',
          '    import yfinance as yf',
          '    stock = yf.Ticker(ticker)',
          '    return str(stock.info)',
          '',
          '@tool',
          'def search_news(query: str, days: int = 7) -> str:',
          '    """최근 뉴스를 검색합니다."""',
          '    # 네이버 뉴스 API 호출',
          '    return search_naver_news(query, days)',
          '```',
          '',
          '**참고 GitHub**:',
          '- [LangChain Tools](https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/tools)',
          '- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)'
        ],
        externalLinks: [
          { title: 'LangChain Tools', url: 'https://python.langchain.com/docs/concepts/tools/' },
          { title: 'OpenAI Function Calling', url: 'https://platform.openai.com/docs/guides/function-calling' }
        ]
      }
    },
    {
      id: 'basic-agent',
      type: 'code',
      title: 'Basic Agent 구현',
      duration: 60,
      content: {
        objectives: [
          'ReAct 패턴의 Agent를 구현한다',
          '도구 바인딩과 실행을 구현한다'
        ],
        starterCode: `# src/agent/basic_agent.py
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate

def create_domain_agent(tools: list, domain: str):
    """도메인 특화 Agent 생성"""

    llm = ChatOpenAI(model="gpt-4o", temperature=0)

    prompt = ChatPromptTemplate.from_messages([
        ("system", f"""당신은 {domain} 분야의 전문 분석가입니다.
사용자의 질문에 대해 적절한 도구를 활용하여 정확한 정보를 제공합니다.

항상 다음 순서로 작업하세요:
1. 질문 분석
2. 필요한 도구 선택
3. 도구 실행 및 결과 수집
4. 결과 종합 및 답변 생성

신뢰할 수 없는 정보는 명시적으로 표시하세요."""),
        ("placeholder", "{chat_history}"),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}")
    ])

    agent = create_tool_calling_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=True)

# 사용 예시
if __name__ == "__main__":
    from .tools import search_knowledge_graph, get_stock_price, search_news

    tools = [search_knowledge_graph, get_stock_price, search_news]
    agent = create_domain_agent(tools, "금융")

    result = agent.invoke({
        "input": "삼성전자의 경쟁사와 최근 주가 동향을 알려주세요",
        "chat_history": []
    })
    print(result["output"])
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'langgraph-workflow',
  title: 'LangGraph 워크플로우',
  totalDuration: 180,
  tasks: [
    {
      id: 'langgraph-basics',
      type: 'project',
      title: 'LangGraph 기초',
      duration: 120,
      content: {
        objectives: [
          'LangGraph의 상태 기반 워크플로우를 이해한다',
          '노드와 엣지를 정의한다',
          '조건부 분기를 구현한다'
        ],
        requirements: [
          '**Day 2 마일스톤: LangGraph 워크플로우**',
          '',
          '## LangGraph 구조',
          '```',
          '                 ┌─────────────┐',
          '                 │   START     │',
          '                 └──────┬──────┘',
          '                        │',
          '                 ┌──────▼──────┐',
          '                 │   분류기     │',
          '                 └──────┬──────┘',
          '                        │',
          '         ┌──────────────┼──────────────┐',
          '         │              │              │',
          '   ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐',
          '   │ KG Agent  │ │ RAG Agent │ │ API Agent │',
          '   └─────┬─────┘ └─────┬─────┘ └─────┬─────┘',
          '         │              │              │',
          '         └──────────────┼──────────────┘',
          '                        │',
          '                 ┌──────▼──────┐',
          '                 │   종합기     │',
          '                 └──────┬──────┘',
          '                        │',
          '                 ┌──────▼──────┐',
          '                 │    END      │',
          '                 └─────────────┘',
          '```',
          '',
          '## 상태 정의',
          '```python',
          '# src/agent/graph_state.py',
          'from typing import TypedDict, Annotated, Sequence',
          'from langchain_core.messages import BaseMessage',
          'import operator',
          '',
          'class AgentState(TypedDict):',
          '    """Agent 워크플로우 상태"""',
          '    messages: Annotated[Sequence[BaseMessage], operator.add]',
          '    query_type: str  # kg_query, rag_query, api_query',
          '    kg_results: str',
          '    rag_results: str',
          '    api_results: str',
          '    final_answer: str',
          '```',
          '',
          '**참고 GitHub**:',
          '- [LangGraph](https://github.com/langchain-ai/langgraph)',
          '- [LangGraph Examples](https://github.com/langchain-ai/langgraph/tree/main/examples)'
        ],
        externalLinks: [
          { title: 'LangGraph', url: 'https://github.com/langchain-ai/langgraph' },
          { title: 'LangGraph Docs', url: 'https://langchain-ai.github.io/langgraph/' }
        ]
      }
    },
    {
      id: 'langgraph-implementation',
      type: 'code',
      title: 'LangGraph 구현',
      duration: 60,
      content: {
        objectives: [
          'StateGraph로 워크플로우를 구현한다'
        ],
        starterCode: `# src/agent/workflow.py
from langgraph.graph import StateGraph, END
from .graph_state import AgentState

def create_agent_workflow():
    """Multi-Agent 워크플로우 생성"""

    workflow = StateGraph(AgentState)

    # 노드 추가
    workflow.add_node("classifier", classify_query)
    workflow.add_node("kg_agent", kg_agent_node)
    workflow.add_node("rag_agent", rag_agent_node)
    workflow.add_node("api_agent", api_agent_node)
    workflow.add_node("synthesizer", synthesize_results)

    # 시작점 설정
    workflow.set_entry_point("classifier")

    # 조건부 엣지 (라우팅)
    workflow.add_conditional_edges(
        "classifier",
        route_query,
        {
            "kg": "kg_agent",
            "rag": "rag_agent",
            "api": "api_agent",
            "all": "kg_agent"  # 모든 에이전트 순차 실행
        }
    )

    # 에이전트 → 종합기
    workflow.add_edge("kg_agent", "synthesizer")
    workflow.add_edge("rag_agent", "synthesizer")
    workflow.add_edge("api_agent", "synthesizer")

    # 종합기 → 종료
    workflow.add_edge("synthesizer", END)

    return workflow.compile()

def classify_query(state: AgentState) -> AgentState:
    """쿼리 유형 분류"""
    # LLM으로 쿼리 분류
    query = state["messages"][-1].content
    # ... 분류 로직
    return {"query_type": "kg"}

def route_query(state: AgentState) -> str:
    """라우팅 결정"""
    return state["query_type"]
`
      }
    }
  ]
}

const day3: Day = {
  slug: 'multi-agent',
  title: 'Multi-Agent 시스템',
  totalDuration: 180,
  tasks: [
    {
      id: 'specialized-agents',
      type: 'project',
      title: '전문 Agent 구현',
      duration: 120,
      content: {
        objectives: [
          '역할별 전문 Agent를 구현한다',
          'Agent 간 협업 패턴을 구현한다'
        ],
        requirements: [
          '**Day 3 마일스톤: Multi-Agent**',
          '',
          '## Agent 역할 분담',
          '',
          '### 1. Research Agent',
          '```python',
          '# Knowledge Graph + 뉴스 검색',
          'research_tools = [search_knowledge_graph, search_news]',
          'research_agent = create_domain_agent(research_tools, "research")',
          '```',
          '',
          '### 2. Analysis Agent',
          '```python',
          '# 데이터 분석 + 계산',
          'analysis_tools = [get_stock_price, calculate_metrics, analyze_trend]',
          'analysis_agent = create_domain_agent(analysis_tools, "analysis")',
          '```',
          '',
          '### 3. Report Agent',
          '```python',
          '# 보고서 생성',
          'report_tools = [format_report, create_chart, summarize]',
          'report_agent = create_domain_agent(report_tools, "report")',
          '```',
          '',
          '## Agent 오케스트레이션',
          '```python',
          '# src/agent/orchestrator.py',
          'class AgentOrchestrator:',
          '    def __init__(self):',
          '        self.research_agent = create_research_agent()',
          '        self.analysis_agent = create_analysis_agent()',
          '        self.report_agent = create_report_agent()',
          '',
          '    async def process_request(self, query: str) -> str:',
          '        # 1. 연구 단계',
          '        research = await self.research_agent.ainvoke(query)',
          '',
          '        # 2. 분석 단계',
          '        analysis = await self.analysis_agent.ainvoke(',
          '            f"다음 정보를 분석하세요: {research}"',
          '        )',
          '',
          '        # 3. 보고서 생성',
          '        report = await self.report_agent.ainvoke(',
          '            f"연구: {research}\\n분석: {analysis}"',
          '        )',
          '',
          '        return report',
          '```',
          '',
          '**참고 GitHub**:',
          '- [CrewAI](https://github.com/crewAIInc/crewAI)',
          '- [AutoGen](https://github.com/microsoft/autogen)',
          '- [LangGraph Multi-Agent](https://github.com/langchain-ai/langgraph/tree/main/examples/multi_agent)'
        ],
        externalLinks: [
          { title: 'CrewAI', url: 'https://github.com/crewAIInc/crewAI' },
          { title: 'AutoGen', url: 'https://github.com/microsoft/autogen' }
        ]
      }
    },
    {
      id: 'agent-memory',
      type: 'code',
      title: 'Agent 메모리 구현',
      duration: 60,
      content: {
        objectives: [
          '대화 히스토리 관리를 구현한다',
          '장기 메모리를 구현한다'
        ],
        starterCode: `# src/agent/memory.py
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

class AgentMemory:
    """Agent 메모리 관리"""

    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_url = redis_url

    def get_session_history(self, session_id: str):
        """세션별 대화 히스토리"""
        return RedisChatMessageHistory(
            session_id=session_id,
            url=self.redis_url
        )

    def wrap_agent_with_memory(self, agent):
        """Agent에 메모리 추가"""
        return RunnableWithMessageHistory(
            agent,
            self.get_session_history,
            input_messages_key="input",
            history_messages_key="chat_history"
        )

# 사용 예시
memory = AgentMemory()
agent_with_memory = memory.wrap_agent_with_memory(agent)

# 세션별 대화
result = agent_with_memory.invoke(
    {"input": "삼성전자 분석해줘"},
    config={"configurable": {"session_id": "user123"}}
)
`
      }
    }
  ]
}

const day4: Day = {
  slug: 'agent-api',
  title: 'Agent API 구현',
  totalDuration: 180,
  tasks: [
    {
      id: 'agent-endpoint',
      type: 'project',
      title: 'Agent API 엔드포인트',
      duration: 90,
      content: {
        objectives: [
          'Agent를 API로 노출한다',
          'WebSocket 스트리밍을 구현한다',
          '세션 관리를 구현한다'
        ],
        requirements: [
          '**Day 4 마일스톤: Agent API**',
          '',
          '## REST API',
          '```python',
          '# src/api/routes/agent.py',
          'from fastapi import APIRouter, WebSocket',
          'from ..agent.orchestrator import AgentOrchestrator',
          '',
          'router = APIRouter()',
          'orchestrator = AgentOrchestrator()',
          '',
          '@router.post("/chat")',
          'async def chat(request: ChatRequest):',
          '    result = await orchestrator.process_request(',
          '        query=request.message,',
          '        session_id=request.session_id',
          '    )',
          '    return {"response": result}',
          '```',
          '',
          '## WebSocket 스트리밍',
          '```python',
          '@router.websocket("/ws/{session_id}")',
          'async def websocket_chat(websocket: WebSocket, session_id: str):',
          '    await websocket.accept()',
          '',
          '    while True:',
          '        data = await websocket.receive_text()',
          '',
          '        async for chunk in orchestrator.stream(data, session_id):',
          '            await websocket.send_text(chunk)',
          '```',
          '',
          '**참고 GitHub**:',
          '- [LangServe](https://github.com/langchain-ai/langserve)',
          '- [FastAPI WebSocket](https://fastapi.tiangolo.com/advanced/websockets/)'
        ],
        externalLinks: [
          { title: 'LangServe', url: 'https://github.com/langchain-ai/langserve' }
        ]
      }
    },
    {
      id: 'agent-monitoring',
      type: 'project',
      title: 'Agent 모니터링',
      duration: 90,
      content: {
        objectives: [
          'Agent 실행을 추적한다',
          '에러 처리와 재시도를 구현한다'
        ],
        requirements: [
          '**모니터링 체크리스트**',
          '',
          '## LangSmith 연동',
          '```python',
          'import os',
          'os.environ["LANGCHAIN_TRACING_V2"] = "true"',
          'os.environ["LANGCHAIN_PROJECT"] = "capstone-agent"',
          '```',
          '',
          '## 커스텀 메트릭',
          '```python',
          'from prometheus_client import Counter, Histogram',
          '',
          'agent_requests = Counter(',
          '    "agent_requests_total",',
          '    "Total agent requests",',
          '    ["agent_type", "status"]',
          ')',
          '',
          'agent_latency = Histogram(',
          '    "agent_latency_seconds",',
          '    "Agent response latency",',
          '    ["agent_type"]',
          ')',
          '```',
          '',
          '## 에러 처리',
          '```python',
          'from tenacity import retry, stop_after_attempt, wait_exponential',
          '',
          '@retry(',
          '    stop=stop_after_attempt(3),',
          '    wait=wait_exponential(multiplier=1, min=1, max=10)',
          ')',
          'async def safe_agent_call(agent, query):',
          '    try:',
          '        return await agent.ainvoke(query)',
          '    except Exception as e:',
          '        logger.error(f"Agent error: {e}")',
          '        raise',
          '```'
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'week6-checkpoint',
  title: 'Week 6 체크포인트',
  totalDuration: 180,
  tasks: [
    {
      id: 'agent-integration-test',
      type: 'project',
      title: 'Agent 통합 테스트',
      duration: 90,
      content: {
        objectives: [
          'Agent 시스템 전체를 테스트한다',
          '성능과 정확도를 검증한다'
        ],
        requirements: [
          '**통합 테스트 시나리오**',
          '',
          '## 테스트 케이스',
          '1. **단일 도구 호출**',
          '   - KG 검색 → 정확한 결과 반환',
          '   - 주가 조회 → 실시간 데이터 반환',
          '',
          '2. **복합 쿼리**',
          '   - "삼성전자 경쟁사 분석" → KG + 뉴스 + 주가',
          '   - 3개 도구 순차 호출 확인',
          '',
          '3. **대화 연속성**',
          '   - 이전 대화 참조 확인',
          '   - 세션 ID별 분리 확인',
          '',
          '## 성능 목표',
          '- 단일 도구 응답: < 2초',
          '- 복합 쿼리 응답: < 10초',
          '- 에러율: < 5%'
        ]
      }
    },
    {
      id: 'week6-review',
      type: 'challenge',
      title: 'Week 6 마일스톤 리뷰',
      duration: 90,
      content: {
        objectives: [
          'Week 6 산출물을 점검한다',
          'Week 7 계획을 수립한다'
        ],
        requirements: [
          '**Week 6 체크리스트**',
          '',
          '## 산출물',
          '- [ ] Function Calling 도구 정의',
          '- [ ] Basic Agent (ReAct)',
          '- [ ] LangGraph 워크플로우',
          '- [ ] Multi-Agent 오케스트레이션',
          '- [ ] Agent 메모리 (Redis)',
          '- [ ] Agent API (REST + WebSocket)',
          '- [ ] LangSmith 모니터링',
          '',
          '**Week 7 목표**:',
          '- 프론트엔드 UI 구현',
          '- Docker 컨테이너화',
          '- 클라우드 배포'
        ],
        evaluationCriteria: [
          'Agent 정확도',
          '도구 호출 성공률',
          '응답 속도'
        ]
      }
    }
  ]
}

export const capstoneAgentWeek: Week = {
  slug: 'capstone-agent',
  week: 6,
  phase: 6,
  month: 12,
  access: 'pro',
  title: 'Agent 시스템 구현',
  topics: ['AI Agent', 'Function Calling', 'LangGraph', 'Multi-Agent', 'LangServe'],
  practice: 'Multi-Agent 오케스트레이션',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
