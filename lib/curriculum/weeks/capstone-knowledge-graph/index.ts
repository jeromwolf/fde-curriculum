// Phase 6, Week 4: Knowledge Graph 구축
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'ontology-implementation',
  title: '온톨로지 구현',
  totalDuration: 180,
  tasks: [
    {
      id: 'neo4j-schema',
      type: 'project',
      title: 'Neo4j 스키마 구현',
      duration: 120,
      content: {
        objectives: [
          'Week 2에서 설계한 온톨로지를 Neo4j에 구현한다',
          '제약조건과 인덱스를 설정한다'
        ],
        requirements: [
          '**Day 1 마일스톤: 온톨로지 구현**',
          '',
          '## 노드 레이블 생성',
          '```cypher',
          '// 금융 도메인 예시',
          'CREATE CONSTRAINT company_ticker IF NOT EXISTS',
          'FOR (c:Company) REQUIRE c.ticker IS UNIQUE;',
          '',
          'CREATE CONSTRAINT person_id IF NOT EXISTS',
          'FOR (p:Person) REQUIRE p.id IS UNIQUE;',
          '',
          'CREATE CONSTRAINT event_id IF NOT EXISTS',
          'FOR (e:Event) REQUIRE e.id IS UNIQUE;',
          '```',
          '',
          '## 관계 유형 정의',
          '```',
          '(:Company)-[:COMPETES_WITH]->(:Company)',
          '(:Company)-[:SUPPLIES_TO]->(:Company)',
          '(:Person)-[:WORKS_AT]->(:Company)',
          '(:Event)-[:AFFECTS]->(:Company)',
          '(:Document)-[:MENTIONS]->(:Company)',
          '```',
          '',
          '**참고 GitHub**:',
          '- [neo4j-examples](https://github.com/neo4j-examples)',
          '- [neo4j-graph-data-science](https://github.com/neo4j/graph-data-science)'
        ],
        externalLinks: [
          { title: 'Neo4j Examples', url: 'https://github.com/neo4j-examples' },
          { title: 'Neo4j GDS', url: 'https://github.com/neo4j/graph-data-science' }
        ]
      }
    },
    {
      id: 'baseline-data-load',
      type: 'code',
      title: '베이스라인 데이터 로딩',
      duration: 60,
      content: {
        objectives: [
          '기본 엔티티 데이터를 로딩한다',
          '초기 관계 데이터를 생성한다'
        ],
        starterCode: `# src/graph/loaders/base_loader.py
from neo4j import GraphDatabase
from typing import List, Dict

class KnowledgeGraphLoader:
    def __init__(self, uri: str, user: str, password: str):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def load_companies(self, companies: List[Dict]):
        """기업 노드 로딩"""
        with self.driver.session() as session:
            session.run("""
                UNWIND $companies AS company
                MERGE (c:Company {ticker: company.ticker})
                SET c.name = company.name,
                    c.sector = company.sector,
                    c.updated_at = datetime()
            """, companies=companies)

    def load_relationships(self, relationships: List[Dict]):
        """관계 로딩"""
        # TODO: 구현
        pass

    def close(self):
        self.driver.close()
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'triple-extraction',
  title: 'Triple 추출 파이프라인',
  totalDuration: 180,
  tasks: [
    {
      id: 'llm-triple-extraction',
      type: 'project',
      title: 'LLM 기반 Triple 추출',
      duration: 120,
      content: {
        objectives: [
          '뉴스/문서에서 관계 Triple을 추출한다',
          '신뢰도 기반 검증을 구현한다'
        ],
        requirements: [
          '**Day 2 마일스톤: Triple 추출**',
          '',
          '## Triple 추출 프롬프트',
          '```python',
          'TRIPLE_EXTRACTION_PROMPT = """',
          '다음 텍스트에서 기업 간 관계를 추출하세요.',
          '',
          '관계 유형:',
          '- COMPETES_WITH: 경쟁 관계',
          '- SUPPLIES_TO: 공급 관계',
          '- PARTNERS_WITH: 협력 관계',
          '- INVESTED_IN: 투자 관계',
          '',
          '출력 형식 (JSON):',
          '[',
          '  {"subject": "기업A", "predicate": "COMPETES_WITH", "object": "기업B", "confidence": 0.9}',
          ']',
          '',
          '텍스트: {text}',
          '"""',
          '```',
          '',
          '## 검증 로직',
          '```python',
          '# 베이스라인 검증',
          'if triple in baseline_triples:',
          '    confidence = 1.0',
          '    validated_by = "baseline"',
          'else:',
          '    confidence = llm_confidence * 0.85',
          '    validated_by = "gpt"',
          '```',
          '',
          '**참고 GitHub**:',
          '- [LangChain Extraction](https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/chains/openai_functions)'
        ],
        externalLinks: [
          { title: 'LangChain Extraction', url: 'https://python.langchain.com/docs/use_cases/extraction/' }
        ]
      }
    },
    {
      id: 'triple-pipeline',
      type: 'code',
      title: 'Triple 파이프라인 구현',
      duration: 60,
      content: {
        objectives: [
          '문서 → Triple → Neo4j 파이프라인을 완성한다'
        ],
        starterCode: `# src/graph/pipeline.py
from typing import List
from .extractors import TripleExtractor
from .loaders import KnowledgeGraphLoader

class TriplePipeline:
    """문서에서 Triple 추출 후 Neo4j 저장"""

    def __init__(self):
        self.extractor = TripleExtractor()
        self.loader = KnowledgeGraphLoader(...)

    def process_documents(self, documents: List[str]) -> int:
        """문서 배치 처리"""
        total_triples = 0
        for doc in documents:
            triples = self.extractor.extract(doc)
            validated = [t for t in triples if t.confidence >= 0.7]
            self.loader.load_triples(validated)
            total_triples += len(validated)
        return total_triples
`
      }
    }
  ]
}

const day3: Day = {
  slug: 'reasoning-rules',
  title: '추론 규칙 구현',
  totalDuration: 180,
  tasks: [
    {
      id: 'inference-rules',
      type: 'project',
      title: '추론 규칙 구현',
      duration: 120,
      content: {
        objectives: [
          'RDFS/OWL 스타일 추론 규칙을 구현한다',
          '간접 관계를 추론한다'
        ],
        requirements: [
          '**Day 3 마일스톤: 추론 규칙**',
          '',
          '## 추론 규칙 유형',
          '',
          '### 1. Transitive Property',
          '```cypher',
          '// A supplies_to B, B supplies_to C → A influences C',
          'MATCH (a:Company)-[:SUPPLIES_TO]->(b:Company)-[:SUPPLIES_TO]->(c:Company)',
          'WHERE a <> c',
          'MERGE (a)-[r:INFLUENCES]->(c)',
          'SET r.rule = "transitive_supply",',
          '    r.confidence = 0.7',
          '```',
          '',
          '### 2. Inverse Property',
          '```cypher',
          '// A supplies_to B → B depends_on A',
          'MATCH (a:Company)-[:SUPPLIES_TO]->(b:Company)',
          'MERGE (b)-[r:DEPENDS_ON]->(a)',
          'SET r.rule = "inverse_supply"',
          '```',
          '',
          '### 3. Symmetric Property',
          '```cypher',
          '// A competes_with B → B competes_with A',
          'MATCH (a:Company)-[:COMPETES_WITH]->(b:Company)',
          'MERGE (b)-[r:COMPETES_WITH]->(a)',
          'SET r.rule = "symmetric"',
          '```',
          '',
          '**참고**:',
          '- [Neo4j APOC](https://github.com/neo4j/apoc)',
          '- [Graph Algorithms](https://github.com/neo4j/graph-data-science)'
        ],
        externalLinks: [
          { title: 'Neo4j APOC', url: 'https://github.com/neo4j/apoc' }
        ]
      }
    },
    {
      id: 'impact-analysis',
      type: 'project',
      title: '영향 분석 구현',
      duration: 60,
      content: {
        objectives: [
          '이벤트 영향 전파 분석을 구현한다'
        ],
        requirements: [
          '**영향 분석 쿼리 예시**',
          '',
          '```cypher',
          '// 특정 기업의 이벤트가 영향을 미치는 기업들',
          'MATCH path = (source:Company {name: $company})',
          '      -[:SUPPLIES_TO|COMPETES_WITH|PARTNERS_WITH*1..3]->(affected:Company)',
          'RETURN affected.name,',
          '       length(path) as distance,',
          '       [r in relationships(path) | type(r)] as path_types',
          'ORDER BY distance',
          'LIMIT 20',
          '```'
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'graph-visualization',
  title: '그래프 시각화',
  totalDuration: 180,
  tasks: [
    {
      id: 'visualization-api',
      type: 'project',
      title: '시각화 API 구현',
      duration: 90,
      content: {
        objectives: [
          'Knowledge Graph 시각화 API를 구현한다',
          'vis-network 호환 데이터 형식으로 변환한다'
        ],
        requirements: [
          '**시각화 API 엔드포인트**',
          '',
          '```python',
          '# src/api/routes/graph.py',
          '@router.get("/graph")',
          'async def get_graph_data(',
          '    center: str = None,',
          '    depth: int = 2,',
          '    min_confidence: float = 0.7',
          '):',
          '    """그래프 시각화 데이터 반환"""',
          '    nodes, edges = query_subgraph(center, depth, min_confidence)',
          '    return {',
          '        "nodes": [node_to_vis(n) for n in nodes],',
          '        "edges": [edge_to_vis(e) for e in edges]',
          '    }',
          '```',
          '',
          '**참고 GitHub**:',
          '- [vis-network](https://github.com/visjs/vis-network)',
          '- [react-force-graph](https://github.com/vasturiano/react-force-graph)'
        ],
        externalLinks: [
          { title: 'vis-network', url: 'https://github.com/visjs/vis-network' },
          { title: 'react-force-graph', url: 'https://github.com/vasturiano/react-force-graph' }
        ]
      }
    },
    {
      id: 'visualization-component',
      type: 'code',
      title: '시각화 컴포넌트 구현',
      duration: 90,
      content: {
        objectives: [
          'Next.js에서 그래프 시각화 컴포넌트를 구현한다'
        ],
        starterCode: `// src/web/components/KnowledgeGraph.tsx
'use client'
import { useEffect, useRef } from 'react'
import { Network } from 'vis-network'

interface Props {
  nodes: any[]
  edges: any[]
  onNodeClick?: (nodeId: string) => void
}

export default function KnowledgeGraph({ nodes, edges, onNodeClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<Network | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const network = new Network(
      containerRef.current,
      { nodes, edges },
      {
        physics: { enabled: true },
        interaction: { hover: true }
      }
    )

    network.on('click', (params) => {
      if (params.nodes.length && onNodeClick) {
        onNodeClick(params.nodes[0])
      }
    })

    networkRef.current = network
    return () => network.destroy()
  }, [nodes, edges])

  return <div ref={containerRef} className="w-full h-[600px]" />
}
`
      }
    }
  ]
}

const day5: Day = {
  slug: 'week4-checkpoint',
  title: 'Week 4 체크포인트',
  totalDuration: 180,
  tasks: [
    {
      id: 'kg-integration-test',
      type: 'project',
      title: 'Knowledge Graph 통합 테스트',
      duration: 90,
      content: {
        objectives: [
          'Knowledge Graph 전체 파이프라인을 테스트한다',
          '데이터 품질을 확인한다'
        ],
        requirements: [
          '**통합 테스트 시나리오**',
          '',
          '1. Triple 추출 테스트',
          '   - 샘플 문서 10개 처리',
          '   - 추출 성공률 확인',
          '',
          '2. 추론 규칙 테스트',
          '   - 추론 규칙 실행',
          '   - 생성된 관계 수 확인',
          '',
          '3. 시각화 테스트',
          '   - API 응답 확인',
          '   - 프론트엔드 렌더링 확인',
          '',
          '**KG 통계**:',
          '- 노드 수:',
          '- 엣지 수:',
          '- 평균 신뢰도:'
        ]
      }
    },
    {
      id: 'week4-review',
      type: 'challenge',
      title: 'Week 4 마일스톤 리뷰',
      duration: 90,
      content: {
        objectives: [
          'Week 4 산출물을 점검한다',
          'Week 5 계획을 수립한다'
        ],
        requirements: [
          '**Week 4 체크리스트**',
          '',
          '## 산출물',
          '- [ ] Neo4j 스키마 구현',
          '- [ ] Triple 추출 파이프라인',
          '- [ ] 추론 규칙 구현',
          '- [ ] 시각화 API',
          '- [ ] 시각화 컴포넌트',
          '- [ ] 통합 테스트 통과',
          '',
          '**Week 5 목표**:',
          '- RAG 시스템 구현',
          '- GraphRAG 연동',
          '- AI Q&A 기능'
        ],
        evaluationCriteria: [
          'Knowledge Graph 품질',
          '추론 규칙 동작',
          '시각화 완성도'
        ]
      }
    }
  ]
}

export const capstoneKnowledgeGraphWeek: Week = {
  slug: 'capstone-knowledge-graph',
  week: 4,
  phase: 6,
  month: 12,
  access: 'pro',
  title: 'Knowledge Graph 구축',
  topics: ['Neo4j', 'Ontology', 'Triple Extraction', 'Reasoning', 'Graph Visualization'],
  practice: 'Knowledge Graph 시스템',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
