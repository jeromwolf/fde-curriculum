// Phase 6, Week 8: 문서화 & 발표
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'technical-documentation',
  title: '기술 문서 작성',
  totalDuration: 180,
  tasks: [
    {
      id: 'readme-docs',
      type: 'project',
      title: 'README 및 문서 작성',
      duration: 120,
      content: {
        objectives: [
          '프로젝트 README를 작성한다',
          'API 문서를 작성한다',
          '아키텍처 다이어그램을 작성한다'
        ],
        requirements: [
          '**Day 1 마일스톤: 기술 문서**',
          '',
          '## README 구조',
          '```markdown',
          '# 프로젝트명',
          '',
          '## 개요',
          '[프로젝트 한 줄 설명]',
          '',
          '## 주요 기능',
          '- Knowledge Graph 기반 데이터 분석',
          '- GraphRAG Q&A 시스템',
          '- AI Agent 자동화',
          '',
          '## 기술 스택',
          '| 구분 | 기술 |',
          '|------|------|',
          '| Frontend | Next.js 14, TailwindCSS |',
          '| Backend | FastAPI, LangChain |',
          '| Database | PostgreSQL, Neo4j, ChromaDB |',
          '| AI | GPT-4o, LangGraph |',
          '',
          '## 아키텍처',
          '[아키텍처 다이어그램]',
          '',
          '## 시작하기',
          '```bash',
          'docker-compose up -d',
          '```',
          '',
          '## API 문서',
          '[API 엔드포인트 설명]',
          '',
          '## 라이선스',
          'MIT',
          '```',
          '',
          '**참고 GitHub**:',
          '- [Awesome README](https://github.com/matiassingers/awesome-readme)',
          '- [Make a README](https://github.com/dguo/make-a-readme)',
          '- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)'
        ],
        externalLinks: [
          { title: 'Awesome README', url: 'https://github.com/matiassingers/awesome-readme' },
          { title: 'Make a README', url: 'https://www.makeareadme.com/' }
        ]
      }
    },
    {
      id: 'api-documentation',
      type: 'code',
      title: 'API 문서 자동화',
      duration: 60,
      content: {
        objectives: [
          'FastAPI 자동 문서화를 활용한다',
          'Postman Collection을 작성한다'
        ],
        starterCode: `# src/main.py
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

app = FastAPI(
    title="Capstone API",
    description="""
## 캡스톤 프로젝트 API

### 주요 기능
- **Knowledge Graph**: 기업 관계 데이터 조회
- **RAG**: 문서 기반 질의응답
- **Agent**: AI 에이전트 채팅

### 인증
Bearer Token 사용
""",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 커스텀 OpenAPI 스키마
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Capstone API",
        version="1.0.0",
        description="캡스톤 프로젝트 API 문서",
        routes=app.routes,
    )

    # 커스텀 태그 추가
    openapi_schema["tags"] = [
        {"name": "graph", "description": "Knowledge Graph 관련 API"},
        {"name": "rag", "description": "RAG 질의응답 API"},
        {"name": "agent", "description": "AI Agent 채팅 API"}
    ]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'demo-video',
  title: '데모 영상 제작',
  totalDuration: 180,
  tasks: [
    {
      id: 'demo-script',
      type: 'project',
      title: '데모 스크립트 작성',
      duration: 90,
      content: {
        objectives: [
          '데모 시나리오를 기획한다',
          '스크립트를 작성한다'
        ],
        requirements: [
          '**Day 2 마일스톤: 데모 영상**',
          '',
          '## 데모 구성 (3-5분)',
          '',
          '### 1. 도입 (30초)',
          '- 프로젝트 소개',
          '- 해결하는 문제',
          '',
          '### 2. Knowledge Graph (1분)',
          '- 그래프 시각화 데모',
          '- 관계 탐색',
          '- 추론 규칙 동작',
          '',
          '### 3. RAG Q&A (1분)',
          '- 질문 입력',
          '- 답변 생성 과정',
          '- 출처 표시',
          '',
          '### 4. AI Agent (1분)',
          '- 복합 질문 처리',
          '- 도구 호출 과정',
          '- 최종 답변',
          '',
          '### 5. 마무리 (30초)',
          '- 기술 스택 요약',
          '- 향후 발전 방향',
          '',
          '## 녹화 도구',
          '- OBS Studio (무료)',
          '- Loom (무료 5분)',
          '- ScreenFlow (Mac)'
        ]
      }
    },
    {
      id: 'demo-recording',
      type: 'project',
      title: '데모 녹화 및 편집',
      duration: 90,
      content: {
        objectives: [
          '화면 녹화를 진행한다',
          '간단한 편집을 수행한다'
        ],
        requirements: [
          '**녹화 체크리스트**',
          '',
          '## 사전 준비',
          '- [ ] 데모 데이터 준비',
          '- [ ] 브라우저 탭 정리',
          '- [ ] 알림 끄기',
          '- [ ] 마이크 테스트',
          '',
          '## 녹화 팁',
          '- 1080p 해상도 권장',
          '- 마우스 움직임 천천히',
          '- 실수하면 재녹화 (편집 최소화)',
          '',
          '## 편집 포인트',
          '- 불필요한 로딩 시간 컷',
          '- 자막 추가 (선택)',
          '- 배경 음악 (저작권 주의)',
          '',
          '## 업로드',
          '- YouTube (비공개/미등록)',
          '- Google Drive',
          '- Loom 공유 링크'
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'presentation-prep',
  title: '발표 자료 준비',
  totalDuration: 180,
  tasks: [
    {
      id: 'slide-deck',
      type: 'project',
      title: '발표 슬라이드 작성',
      duration: 120,
      content: {
        objectives: [
          '발표 슬라이드를 제작한다',
          '시각적 자료를 준비한다'
        ],
        requirements: [
          '**Day 3 마일스톤: 발표 자료**',
          '',
          '## 슬라이드 구성 (10-15장)',
          '',
          '### 1. 표지',
          '- 프로젝트명, 이름, 날짜',
          '',
          '### 2. 문제 정의 (1-2장)',
          '- 해결하고자 하는 문제',
          '- 기존 솔루션의 한계',
          '',
          '### 3. 솔루션 (2-3장)',
          '- 핵심 아이디어',
          '- 주요 기능',
          '- 차별점',
          '',
          '### 4. 아키텍처 (2장)',
          '- 시스템 구성도',
          '- 데이터 흐름',
          '',
          '### 5. 기술 스택 (1장)',
          '- 사용한 기술 나열',
          '',
          '### 6. 데모 (2-3장)',
          '- 주요 화면 캡처',
          '- 또는 영상 재생',
          '',
          '### 7. 성과 (1장)',
          '- 정량적 지표 (성능, 정확도)',
          '- 정성적 성과',
          '',
          '### 8. 향후 계획 (1장)',
          '- 개선 방향',
          '- 확장 가능성',
          '',
          '### 9. Q&A',
          '',
          '**참고 GitHub**:',
          '- [Slidev](https://github.com/slidevjs/slidev)',
          '- [Reveal.js](https://github.com/hakimel/reveal.js)',
          '- [Marp](https://github.com/marp-team/marp)'
        ],
        externalLinks: [
          { title: 'Slidev', url: 'https://github.com/slidevjs/slidev' },
          { title: 'Marp', url: 'https://marp.app/' }
        ]
      }
    },
    {
      id: 'presentation-practice',
      type: 'project',
      title: '발표 연습',
      duration: 60,
      content: {
        objectives: [
          '발표 리허설을 진행한다',
          '시간 배분을 연습한다'
        ],
        requirements: [
          '**발표 연습 체크리스트**',
          '',
          '## 시간 배분 (15분 발표 기준)',
          '- 도입: 2분',
          '- 본론: 10분',
          '- 데모: 3분 (영상 또는 라이브)',
          '- Q&A: 별도',
          '',
          '## 연습 포인트',
          '- [ ] 혼자 리허설 3회',
          '- [ ] 동료에게 피드백 받기',
          '- [ ] 시간 측정',
          '- [ ] 예상 질문 준비',
          '',
          '## 예상 질문',
          '1. 왜 이 기술 스택을 선택했나요?',
          '2. 확장성은 어떻게 고려했나요?',
          '3. 실제 서비스 적용 시 과제는?',
          '4. 다르게 했으면 좋았을 점은?'
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'portfolio-prep',
  title: '포트폴리오 정리',
  totalDuration: 180,
  tasks: [
    {
      id: 'github-cleanup',
      type: 'project',
      title: 'GitHub 레포지토리 정리',
      duration: 90,
      content: {
        objectives: [
          'README를 최종 정리한다',
          '코드 정리 및 주석 추가한다',
          'GitHub Pages 또는 Wiki 작성한다'
        ],
        requirements: [
          '**Day 4 마일스톤: 포트폴리오**',
          '',
          '## GitHub 최적화',
          '',
          '### 레포지토리 설정',
          '- [ ] Description 작성',
          '- [ ] Topics 태그 추가',
          '- [ ] Website URL 추가 (배포 URL)',
          '- [ ] About 섹션 완성',
          '',
          '### README 최종 점검',
          '- [ ] 배지 추가 (Build, License)',
          '- [ ] 스크린샷/GIF 추가',
          '- [ ] 설치 방법 검증',
          '- [ ] 문법 검수',
          '',
          '### 코드 품질',
          '- [ ] 민감 정보 제거 (.env 등)',
          '- [ ] 불필요한 파일 정리',
          '- [ ] .gitignore 점검',
          '- [ ] 주요 함수 주석 추가',
          '',
          '**참고 GitHub**:',
          '- [GitHub Profile README](https://github.com/abhisheknaiidu/awesome-github-profile-readme)',
          '- [Shields.io Badges](https://shields.io/)'
        ],
        externalLinks: [
          { title: 'GitHub Profile README', url: 'https://github.com/abhisheknaiidu/awesome-github-profile-readme' },
          { title: 'Shields.io', url: 'https://shields.io/' }
        ]
      }
    },
    {
      id: 'portfolio-site',
      type: 'project',
      title: '포트폴리오 사이트 업데이트',
      duration: 90,
      content: {
        objectives: [
          '개인 포트폴리오에 프로젝트를 추가한다',
          'LinkedIn 프로필을 업데이트한다'
        ],
        requirements: [
          '**포트폴리오 작성 가이드**',
          '',
          '## 프로젝트 설명 구조',
          '',
          '### 1. 개요',
          '[프로젝트가 해결하는 문제]',
          '',
          '### 2. 내 역할',
          '- 전체 아키텍처 설계',
          '- Knowledge Graph 구현',
          '- AI Agent 개발',
          '- 배포 및 운영',
          '',
          '### 3. 기술적 도전',
          '- [구체적인 기술 과제]',
          '- [해결 방법]',
          '',
          '### 4. 성과',
          '- 정량적 지표',
          '- 배운 점',
          '',
          '### 5. 링크',
          '- GitHub',
          '- 데모 사이트',
          '- 데모 영상',
          '',
          '## LinkedIn 업데이트',
          '- Projects 섹션에 추가',
          '- 관련 Skills 태그',
          '- 포스트 작성 (선택)'
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'final-presentation',
  title: '최종 발표',
  totalDuration: 180,
  tasks: [
    {
      id: 'final-demo',
      type: 'challenge',
      title: '최종 발표 및 데모',
      duration: 90,
      content: {
        objectives: [
          '캡스톤 프로젝트를 발표한다',
          '라이브 데모를 시연한다',
          'Q&A에 응답한다'
        ],
        requirements: [
          '**최종 발표**',
          '',
          '## 발표 순서',
          '1. 슬라이드 발표 (10분)',
          '2. 라이브 데모 (5분)',
          '3. Q&A (10분)',
          '',
          '## 데모 시나리오',
          '',
          '### 시나리오 1: Knowledge Graph',
          '- 그래프 탐색',
          '- 기업 관계 조회',
          '',
          '### 시나리오 2: Q&A',
          '- "삼성전자의 주요 경쟁사는?"',
          '- "반도체 공급망 리스크는?"',
          '',
          '### 시나리오 3: 복합 분석',
          '- "삼성전자 투자 분석 보고서 작성해줘"',
          '- Agent 동작 과정 설명',
          '',
          '## 백업 계획',
          '- 네트워크 문제 → 녹화 영상',
          '- API 오류 → 스크린샷 준비'
        ],
        evaluationCriteria: [
          '기술적 완성도',
          '문제 해결 능력',
          '발표 스킬',
          '코드 품질'
        ]
      }
    },
    {
      id: 'course-completion',
      type: 'challenge',
      title: '과정 완료',
      duration: 90,
      content: {
        objectives: [
          '전체 과정을 회고한다',
          '향후 학습 계획을 수립한다'
        ],
        requirements: [
          '**Phase 6 완료 🎉**',
          '',
          '## 회고 (Retrospective)',
          '',
          '### 잘한 점',
          '- [성취한 것들]',
          '',
          '### 개선할 점',
          '- [다음에 더 잘할 수 있는 것]',
          '',
          '### 배운 점',
          '- [새로 학습한 기술/개념]',
          '',
          '## 향후 계획',
          '',
          '### 기술 심화',
          '- Knowledge Graph: Neo4j Graph Academy',
          '- LLM: DeepLearning.AI courses',
          '- MLOps: MLflow, Kubeflow',
          '',
          '### 커리어',
          '- FDE 포지션 지원',
          '- 관련 프로젝트 참여',
          '- 커뮤니티 활동',
          '',
          '**축하합니다!** 🎓',
          'FDE Academy Phase 6를 모두 완료했습니다.',
          '',
          '**참고 자료**:',
          '- [Neo4j Graph Academy](https://graphacademy.neo4j.com/)',
          '- [DeepLearning.AI](https://www.deeplearning.ai/)',
          '- [LangChain Academy](https://academy.langchain.com/)'
        ],
        evaluationCriteria: [
          '전체 프로젝트 완성도',
          '기술 문서 품질',
          '포트폴리오 완성도',
          '발표 및 커뮤니케이션'
        ]
      }
    }
  ]
}

export const capstoneFinalWeek: Week = {
  slug: 'capstone-final',
  week: 8,
  phase: 6,
  month: 12,
  access: 'pro',
  title: '문서화 & 발표',
  topics: ['Documentation', 'Demo', 'Presentation', 'Portfolio', 'Career'],
  practice: '캡스톤 최종 발표',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
