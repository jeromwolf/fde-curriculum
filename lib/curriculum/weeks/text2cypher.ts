// Week: 자연어 → Cypher (Phase 3, Week 7)
import type { Week } from '../types'

export const text2CypherWeek: Week = {
  slug: 'text2cypher',
  week: 7,
  phase: 3,
  month: 6,
  access: 'core',
  title: '자연어 → Cypher',
  topics: ['LLM 기반 Cypher 생성', '스키마 프롬프팅', '쿼리 검증', '자연어 인터페이스'],
  practice: '자연어 질의 그래프 데이터베이스 인터페이스 구축',
  totalDuration: 720,
  days: [
    {
      slug: 'text2cypher-concepts',
      title: 'Text2Cypher 개념',
      totalDuration: 150,
      tasks: [
        {
          id: 'text2cypher-intro-video',
          type: 'video',
          title: 'LLM으로 Cypher 쿼리 생성하기',
          duration: 25,
          content: {
            objectives: [
              'Text2Cypher의 개념과 활용을 이해한다',
              '스키마 프롬프팅의 중요성을 파악한다',
              '쿼리 생성의 도전과제를 학습한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=text2cypher-placeholder',
            keyPoints: [
              'Text2Cypher는 자연어를 Cypher 쿼리로 변환하는 기술입니다',
              'LLM이 DB 스키마를 이해해야 정확한 쿼리를 생성할 수 있습니다',
              '스키마 프롬프팅, Few-shot 예제, 쿼리 검증이 핵심 기법입니다',
              '보안을 위해 DELETE, CREATE 등 위험한 연산을 차단해야 합니다'
            ]
          }
        },
        {
          id: 'langchain-neo4j-reading',
          type: 'reading',
          title: 'LangChain Neo4j 통합',
          duration: 20,
          content: {
            objectives: [
              'LangChain의 Neo4j 통합 기능을 이해한다',
              'GraphCypherQAChain 사용법을 학습한다',
              '실제 구현 패턴을 파악한다'
            ],
            markdown: `## LangChain Neo4j 통합

### 핵심 컴포넌트

- **Neo4jGraph**: Neo4j 연결 및 스키마 추출
- **GraphCypherQAChain**: 자연어 → Cypher 변환 체인
- **커스텀 프롬프트**: 도메인 특화 프롬프트 템플릿

### 구현 단계

1. Neo4j 연결 설정
2. 스키마 자동 추출
3. GraphCypherQAChain 생성
4. 쿼리 검증 로직 추가
5. 에러 처리 구현

### 쿼리 검증 체크리스트

- 읽기 전용 쿼리만 허용 (MATCH, RETURN, WITH, WHERE)
- DELETE, CREATE, SET, REMOVE, DROP 차단
- LIMIT 절 필수
- 무한 루프 방지

### 에러 처리 전략

- 문법 오류 시 자동 재시도
- 에러 메시지를 프롬프트에 포함하여 수정 유도
- 최대 재시도 횟수 제한
            `
          }
        }
      ]
    },
    {
      slug: 'text2cypher-implementation',
      title: 'Text2Cypher 구현',
      totalDuration: 240,
      tasks: [
        {
          id: 'schema-extraction-video',
          type: 'video',
          title: '스키마 추출 및 프롬프팅',
          duration: 20,
          content: {
            objectives: [
              'Neo4j에서 스키마를 자동 추출한다',
              '효과적인 스키마 프롬프트를 설계한다',
              'Few-shot 예제를 활용한다'
            ],
            videoUrl: 'https://www.youtube.com/watch?v=schema-extraction-placeholder',
            keyPoints: [
              'db.schema.visualization()으로 스키마 자동 추출',
              '노드 라벨, 속성, 관계 타입을 프롬프트에 포함',
              'Few-shot 예제로 원하는 출력 형식 유도',
              '도메인 특화 규칙 추가 (날짜 형식, 명명 규칙 등)'
            ]
          }
        },
        {
          id: 'text2cypher-practice-code',
          type: 'code',
          title: 'Text2Cypher 시스템 구축 실습',
          duration: 90,
          content: {
            objectives: [
              '자연어 → Cypher 변환 시스템을 구축한다',
              '쿼리 검증 및 에러 처리를 구현한다',
              '대화형 인터페이스를 완성한다'
            ],
            instructions: `## 실습: 자연어 그래프 질의 시스템

### 시나리오

회사 조직도와 인사 정보가 담긴 그래프 데이터베이스에
자연어로 질의할 수 있는 시스템을 구축합니다.

### 샘플 스키마

노드:
- Employee(id, name, title, department)
- Department(name, budget)
- Project(name, status, deadline)

관계:
- (Employee)-[:WORKS_IN]->(Department)
- (Employee)-[:MANAGES]->(Employee)
- (Employee)-[:WORKS_ON]->(Project)

### 구현 과제

1. 스키마 프롬프트 설계
2. Text2Cypher 체인 구현
3. 쿼리 검증 로직 추가
4. 자연어 인터페이스 완성
            `,
            starterCode: `# text2cypher.py

from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

SCHEMA = """
노드: Employee, Department, Project
관계: WORKS_IN, MANAGES, WORKS_ON
"""

# TODO: 프롬프트 설계
# TODO: text_to_cypher 함수 구현
# TODO: validate_query 함수 구현
# TODO: ask 함수 구현
`,
            hints: [
              '프롬프트에 스키마와 규칙을 명확히 포함하세요',
              'Few-shot 예제를 추가하면 정확도가 향상됩니다',
              'LIMIT 절이 없으면 추가하는 로직을 넣으세요'
            ]
          }
        },
        {
          id: 'week7-quiz',
          type: 'quiz',
          title: 'Text2Cypher 퀴즈',
          duration: 15,
          content: {
            questions: [
              {
                question: 'Text2Cypher에서 스키마 프롬프팅이 중요한 이유는?',
                options: [
                  'LLM이 데이터베이스 구조를 알아야 정확한 쿼리를 생성할 수 있기 때문',
                  '쿼리 실행 속도를 높이기 위해',
                  'LLM의 토큰 사용량을 줄이기 위해',
                  '보안을 강화하기 위해'
                ],
                answer: 0,
                explanation: 'LLM은 데이터베이스의 노드 라벨, 관계 타입, 속성 이름 등을 알아야 유효한 Cypher 쿼리를 생성할 수 있습니다.'
              },
              {
                question: 'Text2Cypher 시스템에서 쿼리 검증이 필요한 이유는?',
                options: [
                  '문법 오류를 수정하기 위해',
                  'DELETE, CREATE 등 위험한 연산 방지 및 LIMIT 강제',
                  '쿼리 성능을 최적화하기 위해',
                  '결과 형식을 통일하기 위해'
                ],
                answer: 1,
                explanation: 'LLM이 생성한 쿼리가 데이터를 삭제하거나 무한 결과를 반환하는 것을 방지하기 위해 검증이 필요합니다.'
              },
              {
                question: 'Few-shot 예제를 프롬프트에 포함하면 어떤 효과가 있는가?',
                options: [
                  '토큰 사용량이 줄어든다',
                  '쿼리 실행 속도가 빨라진다',
                  'LLM이 원하는 출력 형식과 패턴을 학습하여 정확도가 향상된다',
                  '스키마 정보가 불필요해진다'
                ],
                answer: 2,
                explanation: 'Few-shot 예제는 LLM에게 질문-쿼리 매핑의 패턴을 보여주어 더 정확한 쿼리를 생성하도록 돕습니다.'
              }
            ]
          }
        },
        {
          id: 'week7-challenge',
          type: 'challenge',
          title: 'Week 7 도전 과제: 대화형 그래프 어시스턴트',
          duration: 60,
          content: {
            objectives: [
              '멀티턴 대화를 지원하는 Text2Cypher 시스템을 구축한다',
              '질문 명확화 및 에러 복구를 구현한다',
              '실제 Neo4j 데이터베이스와 연동한다'
            ],
            requirements: [
              '이전 대화 맥락을 고려한 쿼리 생성',
              '모호한 질문에 대한 명확화 요청',
              '쿼리 실패 시 자동 수정 재시도',
              '결과를 자연어로 요약'
            ],
            evaluationCriteria: [
              '쿼리 생성 정확도',
              '대화 맥락 유지',
              '에러 처리 품질',
              '사용자 경험'
            ],
            bonusPoints: [
              'Streamlit/Gradio UI 구현',
              '쿼리 히스토리 저장',
              '자주 묻는 질문 캐싱'
            ]
          }
        }
      ]
    }
  ]
}
