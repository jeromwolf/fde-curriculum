// Phase 6, Week 5: AI/RAG 시스템 구현
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'vector-store-setup',
  title: 'Vector Store 구축',
  totalDuration: 180,
  tasks: [
    {
      id: 'embedding-pipeline',
      type: 'project',
      title: 'Embedding 파이프라인 구현',
      duration: 120,
      content: {
        objectives: [
          '문서 청킹 전략을 설계한다',
          '임베딩 모델을 선택하고 적용한다',
          'Vector Store에 저장한다'
        ],
        requirements: [
          '**Day 1 마일스톤: Vector Store**',
          '',
          '## 문서 청킹 전략',
          '```python',
          '# src/rag/chunker.py',
          'from langchain.text_splitter import RecursiveCharacterTextSplitter',
          '',
          'class DocumentChunker:',
          '    def __init__(self, chunk_size: int = 1000, overlap: int = 200):',
          '        self.splitter = RecursiveCharacterTextSplitter(',
          '            chunk_size=chunk_size,',
          '            chunk_overlap=overlap,',
          '            separators=["\\n\\n", "\\n", ".", " "]',
          '        )',
          '',
          '    def chunk_documents(self, documents: list) -> list:',
          '        return self.splitter.split_documents(documents)',
          '```',
          '',
          '## 임베딩 선택 가이드',
          '| 모델 | 차원 | 성능 | 비용 |',
          '|------|------|------|------|',
          '| text-embedding-3-small | 1536 | 좋음 | 저렴 |',
          '| text-embedding-3-large | 3072 | 최고 | 중간 |',
          '| BGE-M3 | 1024 | 좋음 | 무료 |',
          '',
          '**참고 GitHub**:',
          '- [LangChain](https://github.com/langchain-ai/langchain)',
          '- [sentence-transformers](https://github.com/UKPLab/sentence-transformers)',
          '- [FlagEmbedding](https://github.com/FlagOpen/FlagEmbedding)'
        ],
        externalLinks: [
          { title: 'LangChain', url: 'https://github.com/langchain-ai/langchain' },
          { title: 'Sentence Transformers', url: 'https://github.com/UKPLab/sentence-transformers' },
          { title: 'FlagEmbedding (BGE)', url: 'https://github.com/FlagOpen/FlagEmbedding' }
        ]
      }
    },
    {
      id: 'vector-store-integration',
      type: 'code',
      title: 'Vector Store 통합',
      duration: 60,
      content: {
        objectives: [
          'Chroma 또는 Pinecone을 설정한다',
          '인덱싱 파이프라인을 완성한다'
        ],
        starterCode: `# src/rag/vectorstore.py
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

class VectorStoreManager:
    """Vector Store 관리"""

    def __init__(self, persist_directory: str = "./chroma_db"):
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        self.vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=self.embeddings
        )

    def add_documents(self, documents: list):
        """문서 추가"""
        self.vectorstore.add_documents(documents)

    def similarity_search(self, query: str, k: int = 5):
        """유사도 검색"""
        return self.vectorstore.similarity_search(query, k=k)

    def similarity_search_with_score(self, query: str, k: int = 5):
        """점수 포함 유사도 검색"""
        return self.vectorstore.similarity_search_with_score(query, k=k)
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'basic-rag',
  title: '기본 RAG 구현',
  totalDuration: 180,
  tasks: [
    {
      id: 'retrieval-chain',
      type: 'project',
      title: 'Retrieval Chain 구현',
      duration: 120,
      content: {
        objectives: [
          'LangChain RAG 체인을 구성한다',
          '프롬프트 템플릿을 설계한다',
          '기본 Q&A 시스템을 구현한다'
        ],
        requirements: [
          '**Day 2 마일스톤: 기본 RAG**',
          '',
          '## RAG Chain 구조',
          '```python',
          '# src/rag/chain.py',
          'from langchain.chains import create_retrieval_chain',
          'from langchain.chains.combine_documents import create_stuff_documents_chain',
          'from langchain_core.prompts import ChatPromptTemplate',
          'from langchain_openai import ChatOpenAI',
          '',
          'SYSTEM_PROMPT = """',
          '당신은 {domain} 분야의 전문 어시스턴트입니다.',
          '주어진 컨텍스트만을 기반으로 정확하게 답변하세요.',
          '',
          '컨텍스트:',
          '{context}',
          '',
          '답변 시 출처를 명시하세요.',
          '"""',
          '',
          'def create_rag_chain(vectorstore, domain: str):',
          '    llm = ChatOpenAI(model="gpt-4o-mini")',
          '    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})',
          '',
          '    prompt = ChatPromptTemplate.from_messages([',
          '        ("system", SYSTEM_PROMPT),',
          '        ("human", "{input}")',
          '    ])',
          '',
          '    combine_docs_chain = create_stuff_documents_chain(llm, prompt)',
          '    return create_retrieval_chain(retriever, combine_docs_chain)',
          '```',
          '',
          '**참고 GitHub**:',
          '- [LangChain RAG Tutorial](https://github.com/langchain-ai/langchain/tree/master/cookbook)',
          '- [RAG from Scratch](https://github.com/langchain-ai/rag-from-scratch)'
        ],
        externalLinks: [
          { title: 'LangChain RAG Tutorial', url: 'https://python.langchain.com/docs/tutorials/rag/' },
          { title: 'RAG from Scratch', url: 'https://github.com/langchain-ai/rag-from-scratch' }
        ]
      }
    },
    {
      id: 'rag-api',
      type: 'code',
      title: 'RAG API 엔드포인트',
      duration: 60,
      content: {
        objectives: [
          'FastAPI로 RAG API를 구현한다',
          '스트리밍 응답을 지원한다'
        ],
        starterCode: `# src/api/routes/rag.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

router = APIRouter()

class QueryRequest(BaseModel):
    question: str
    domain: str = "finance"

class QueryResponse(BaseModel):
    answer: str
    sources: list[dict]
    confidence: float

@router.post("/query")
async def query_rag(request: QueryRequest) -> QueryResponse:
    """RAG 쿼리 엔드포인트"""
    chain = get_rag_chain(request.domain)
    result = chain.invoke({"input": request.question})

    return QueryResponse(
        answer=result["answer"],
        sources=[{"content": doc.page_content[:200], "metadata": doc.metadata}
                 for doc in result["context"]],
        confidence=calculate_confidence(result)
    )

@router.post("/query/stream")
async def query_rag_stream(request: QueryRequest):
    """스트리밍 RAG 쿼리"""
    async def generate():
        chain = get_rag_chain(request.domain)
        async for chunk in chain.astream({"input": request.question}):
            if "answer" in chunk:
                yield chunk["answer"]

    return StreamingResponse(generate(), media_type="text/event-stream")
`
      }
    }
  ]
}

const day3: Day = {
  slug: 'graphrag-integration',
  title: 'GraphRAG 통합',
  totalDuration: 180,
  tasks: [
    {
      id: 'graphrag-retriever',
      type: 'project',
      title: 'GraphRAG Retriever 구현',
      duration: 120,
      content: {
        objectives: [
          'Knowledge Graph를 RAG에 통합한다',
          '하이브리드 검색 전략을 구현한다',
          'Graph 컨텍스트를 LLM에 제공한다'
        ],
        requirements: [
          '**Day 3 마일스톤: GraphRAG**',
          '',
          '## 하이브리드 검색 전략',
          '```',
          '사용자 쿼리',
          '    ↓',
          '┌───────────────┬────────────────┐',
          '│ Vector Search │  Graph Search  │',
          '│  (문서 검색)    │   (관계 검색)    │',
          '└───────┬───────┴───────┬────────┘',
          '        ↓               ↓',
          '    [문서 청크]      [Triple/Path]',
          '        ↓               ↓',
          '        └───────┬───────┘',
          '                ↓',
          '         Context 병합',
          '                ↓',
          '            LLM 응답',
          '```',
          '',
          '## Graph Context 구성',
          '```python',
          '# src/rag/graphrag.py',
          'def build_graph_context(company: str, neo4j_driver) -> str:',
          '    """Knowledge Graph에서 관련 컨텍스트 추출"""',
          '    with neo4j_driver.session() as session:',
          '        # 직접 관계',
          '        result = session.run("""',
          '            MATCH (c:Company {name: $name})-[r]->(related)',
          '            RETURN type(r) as relation, related.name as target,',
          '                   r.confidence as confidence',
          '            LIMIT 10',
          '        """, name=company)',
          '',
          '        relations = [dict(r) for r in result]',
          '',
          '    # 텍스트 컨텍스트로 변환',
          '    context = f"## {company} 관계 정보\\n"',
          '    for rel in relations:',
          '        relation = rel["relation"]',
          '        target = rel["target"]',
          '        conf = rel["confidence"]',
          '        context += f"- {relation}: {target} (신뢰도: {conf:.0%})\\n"',
          '',
          '    return context',
          '```',
          '',
          '**참고 GitHub**:',
          '- [Microsoft GraphRAG](https://github.com/microsoft/graphrag)',
          '- [LlamaIndex KnowledgeGraphRAG](https://github.com/run-llama/llama_index)',
          '- [Neo4j GenAI](https://github.com/neo4j/neo4j-genai-python)'
        ],
        externalLinks: [
          { title: 'Microsoft GraphRAG', url: 'https://github.com/microsoft/graphrag' },
          { title: 'LlamaIndex', url: 'https://github.com/run-llama/llama_index' },
          { title: 'Neo4j GenAI', url: 'https://github.com/neo4j/neo4j-genai-python' }
        ]
      }
    },
    {
      id: 'hybrid-retriever',
      type: 'code',
      title: 'Hybrid Retriever 구현',
      duration: 60,
      content: {
        objectives: [
          'Vector + Graph 하이브리드 검색기를 구현한다'
        ],
        starterCode: `# src/rag/hybrid_retriever.py
from typing import List
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever

class HybridRetriever(BaseRetriever):
    """Vector Store + Knowledge Graph 하이브리드 검색기"""

    vectorstore: any
    neo4j_driver: any
    vector_weight: float = 0.6
    graph_weight: float = 0.4

    def _get_relevant_documents(self, query: str) -> List[Document]:
        # 1. Vector 검색
        vector_docs = self.vectorstore.similarity_search(query, k=5)

        # 2. 쿼리에서 엔티티 추출 (간단한 버전)
        entities = extract_entities(query)

        # 3. Graph 검색
        graph_docs = []
        for entity in entities:
            context = build_graph_context(entity, self.neo4j_driver)
            if context:
                graph_docs.append(Document(
                    page_content=context,
                    metadata={"source": "knowledge_graph", "entity": entity}
                ))

        # 4. 결과 병합 및 재순위화
        return self._merge_and_rerank(vector_docs, graph_docs)

    def _merge_and_rerank(self, vector_docs, graph_docs):
        # RRF (Reciprocal Rank Fusion) 또는 가중 병합
        all_docs = vector_docs + graph_docs
        # TODO: 실제 재순위화 로직
        return all_docs[:7]
`
      }
    }
  ]
}

const day4: Day = {
  slug: 'rag-evaluation',
  title: 'RAG 평가 및 최적화',
  totalDuration: 180,
  tasks: [
    {
      id: 'ragas-evaluation',
      type: 'project',
      title: 'RAGAS 평가 구현',
      duration: 90,
      content: {
        objectives: [
          'RAGAS 프레임워크로 RAG를 평가한다',
          '평가 메트릭을 이해하고 적용한다'
        ],
        requirements: [
          '**Day 4 마일스톤: RAG 평가**',
          '',
          '## RAGAS 메트릭',
          '| 메트릭 | 설명 | 목표 |',
          '|--------|------|------|',
          '| Faithfulness | 답변이 컨텍스트에 충실한가 | > 0.8 |',
          '| Answer Relevancy | 답변이 질문에 관련있는가 | > 0.8 |',
          '| Context Precision | 검색 컨텍스트가 정확한가 | > 0.7 |',
          '| Context Recall | 필요한 정보를 다 찾았는가 | > 0.7 |',
          '',
          '## 평가 코드',
          '```python',
          '# src/rag/evaluation.py',
          'from ragas import evaluate',
          'from ragas.metrics import (',
          '    faithfulness,',
          '    answer_relevancy,',
          '    context_precision,',
          '    context_recall',
          ')',
          'from datasets import Dataset',
          '',
          'def evaluate_rag(test_cases: list) -> dict:',
          '    """RAG 시스템 평가"""',
          '    dataset = Dataset.from_list(test_cases)',
          '',
          '    result = evaluate(',
          '        dataset,',
          '        metrics=[',
          '            faithfulness,',
          '            answer_relevancy,',
          '            context_precision,',
          '            context_recall',
          '        ]',
          '    )',
          '',
          '    return result.to_pandas().to_dict()',
          '```',
          '',
          '**참고 GitHub**:',
          '- [RAGAS](https://github.com/explodinggradients/ragas)',
          '- [LangSmith](https://github.com/langchain-ai/langsmith-sdk)'
        ],
        externalLinks: [
          { title: 'RAGAS', url: 'https://github.com/explodinggradients/ragas' },
          { title: 'LangSmith', url: 'https://smith.langchain.com/' }
        ]
      }
    },
    {
      id: 'rag-optimization',
      type: 'project',
      title: 'RAG 최적화',
      duration: 90,
      content: {
        objectives: [
          '검색 품질을 개선한다',
          '응답 속도를 최적화한다'
        ],
        requirements: [
          '**최적화 체크리스트**',
          '',
          '## 검색 품질 개선',
          '- [ ] 청킹 사이즈 조정 (500-2000)',
          '- [ ] 오버랩 비율 최적화 (10-30%)',
          '- [ ] 임베딩 모델 업그레이드',
          '- [ ] Reranker 추가 (Cohere, BGE)',
          '',
          '## 응답 품질 개선',
          '- [ ] 프롬프트 엔지니어링',
          '- [ ] Few-shot 예시 추가',
          '- [ ] 출처 표시 강화',
          '',
          '## 성능 최적화',
          '- [ ] 임베딩 캐싱',
          '- [ ] 결과 캐싱 (Redis)',
          '- [ ] 배치 처리',
          '',
          '**Reranker 적용 예시**:',
          '```python',
          'from langchain.retrievers import ContextualCompressionRetriever',
          'from langchain_cohere import CohereRerank',
          '',
          'reranker = CohereRerank(top_n=5)',
          'compression_retriever = ContextualCompressionRetriever(',
          '    base_compressor=reranker,',
          '    base_retriever=base_retriever',
          ')',
          '```'
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'week5-checkpoint',
  title: 'Week 5 체크포인트',
  totalDuration: 180,
  tasks: [
    {
      id: 'rag-integration-test',
      type: 'project',
      title: 'RAG 통합 테스트',
      duration: 90,
      content: {
        objectives: [
          'RAG 시스템 전체를 테스트한다',
          '품질 메트릭을 확인한다'
        ],
        requirements: [
          '**통합 테스트 시나리오**',
          '',
          '## 테스트 케이스',
          '```python',
          '# tests/test_rag.py',
          'test_cases = [',
          '    {',
          '        "question": "삼성전자의 주요 경쟁사는?",',
          '        "ground_truth": "SK하이닉스, 애플 등",',
          '        "expected_sources": ["knowledge_graph", "news"]',
          '    },',
          '    {',
          '        "question": "반도체 공급망 리스크는?",',
          '        "ground_truth": "지정학적 리스크, TSMC 의존도",',
          '        "expected_sources": ["reports", "knowledge_graph"]',
          '    }',
          ']',
          '```',
          '',
          '## 품질 목표',
          '- Faithfulness: > 0.8',
          '- Answer Relevancy: > 0.8',
          '- Context Precision: > 0.7',
          '- 평균 응답 시간: < 3초'
        ]
      }
    },
    {
      id: 'week5-review',
      type: 'challenge',
      title: 'Week 5 마일스톤 리뷰',
      duration: 90,
      content: {
        objectives: [
          'Week 5 산출물을 점검한다',
          'Week 6 계획을 수립한다'
        ],
        requirements: [
          '**Week 5 체크리스트**',
          '',
          '## 산출물',
          '- [ ] Vector Store 구축',
          '- [ ] 기본 RAG Chain',
          '- [ ] GraphRAG 통합',
          '- [ ] Hybrid Retriever',
          '- [ ] RAG API 엔드포인트',
          '- [ ] RAGAS 평가 구현',
          '- [ ] 평가 결과 리포트',
          '',
          '**Week 6 목표**:',
          '- AI Agent 시스템 구현',
          '- 도구 호출 (Function Calling)',
          '- Multi-Agent 오케스트레이션'
        ],
        evaluationCriteria: [
          'RAG 품질 메트릭',
          'GraphRAG 통합 완성도',
          '응답 속도'
        ]
      }
    }
  ]
}

export const capstoneAiRagWeek: Week = {
  slug: 'capstone-ai-rag',
  week: 5,
  phase: 6,
  month: 12,
  access: 'pro',
  title: 'AI/RAG 시스템 구현',
  topics: ['RAG', 'Vector Store', 'GraphRAG', 'LangChain', 'Embedding', 'RAGAS'],
  practice: 'GraphRAG 기반 Q&A 시스템',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
