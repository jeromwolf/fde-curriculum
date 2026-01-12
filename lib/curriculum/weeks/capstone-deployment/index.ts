// Phase 6, Week 7: 프론트엔드 & 배포
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'frontend-dashboard',
  title: '대시보드 UI 구현',
  totalDuration: 180,
  tasks: [
    {
      id: 'nextjs-dashboard',
      type: 'project',
      title: 'Next.js 대시보드',
      duration: 120,
      content: {
        objectives: [
          'Next.js 14 App Router로 대시보드를 구현한다',
          'API 연동 및 상태 관리를 구현한다',
          '반응형 레이아웃을 구현한다'
        ],
        requirements: [
          '**Day 1 마일스톤: 대시보드**',
          '',
          '## 프로젝트 구조',
          '```',
          'src/',
          '├── app/',
          '│   ├── layout.tsx',
          '│   ├── page.tsx              # 메인 대시보드',
          '│   ├── api/',
          '│   │   ├── chat/route.ts     # Agent API',
          '│   │   └── graph/route.ts    # KG API',
          '│   ├── chat/',
          '│   │   └── page.tsx          # 채팅 UI',
          '│   └── graph/',
          '│       └── page.tsx          # KG 시각화',
          '├── components/',
          '│   ├── Chat.tsx',
          '│   ├── KnowledgeGraph.tsx',
          '│   └── Dashboard.tsx',
          '└── lib/',
          '    ├── api.ts                # API 클라이언트',
          '    └── hooks.ts              # 커스텀 훅',
          '```',
          '',
          '## 메인 대시보드',
          '```tsx',
          '// app/page.tsx',
          "import { KnowledgeGraph } from '@/components/KnowledgeGraph'",
          "import { RecentInsights } from '@/components/RecentInsights'",
          "import { QuickStats } from '@/components/QuickStats'",
          '',
          'export default function Dashboard() {',
          '  return (',
          '    <div className="grid grid-cols-12 gap-4 p-6">',
          '      {/* 통계 카드 */}',
          '      <div className="col-span-12">',
          '        <QuickStats />',
          '      </div>',
          '',
          '      {/* Knowledge Graph */}',
          '      <div className="col-span-8">',
          '        <KnowledgeGraph />',
          '      </div>',
          '',
          '      {/* 최근 인사이트 */}',
          '      <div className="col-span-4">',
          '        <RecentInsights />',
          '      </div>',
          '    </div>',
          '  )',
          '}',
          '```',
          '',
          '**참고 GitHub**:',
          '- [shadcn/ui](https://github.com/shadcn-ui/ui)',
          '- [Next.js Dashboard Template](https://github.com/vercel/nextjs-dashboard)'
        ],
        externalLinks: [
          { title: 'shadcn/ui', url: 'https://github.com/shadcn-ui/ui' },
          { title: 'Next.js Dashboard', url: 'https://github.com/vercel/nextjs-dashboard' }
        ]
      }
    },
    {
      id: 'chat-interface',
      type: 'code',
      title: '채팅 인터페이스',
      duration: 60,
      content: {
        objectives: [
          'Agent 채팅 UI를 구현한다',
          '스트리밍 응답을 처리한다'
        ],
        starterCode: `// components/Chat.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{ title: string; url: string }>
}

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat'
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
            <div className={\`max-w-[80%] p-3 rounded-lg \${
              msg.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }\`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <span className="animate-pulse">답변 생성 중...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="질문을 입력하세요..."
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  )
}
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'visualization',
  title: '시각화 컴포넌트',
  totalDuration: 180,
  tasks: [
    {
      id: 'knowledge-graph-viz',
      type: 'project',
      title: 'Knowledge Graph 시각화',
      duration: 90,
      content: {
        objectives: [
          'vis-network으로 그래프를 시각화한다',
          '인터랙티브 탐색 기능을 구현한다'
        ],
        requirements: [
          '**시각화 요구사항**',
          '',
          '## 기본 기능',
          '- 노드 클릭 → 상세 정보 패널',
          '- 드래그 → 노드 이동',
          '- 줌 인/아웃',
          '- 관계 유형별 필터링',
          '',
          '## 고급 기능',
          '- 신뢰도 기반 엣지 두께',
          '- 노드 검색',
          '- 경로 하이라이팅',
          '',
          '```tsx',
          '// components/KnowledgeGraph.tsx',
          "import { Network } from 'vis-network'",
          '',
          'const options = {',
          '  physics: {',
          '    barnesHut: {',
          '      gravitationalConstant: -8000,',
          '      springLength: 200',
          '    }',
          '  },',
          '  nodes: {',
          '    shape: "dot",',
          '    size: 20,',
          '    font: { size: 14 }',
          '  },',
          '  edges: {',
          '    arrows: "to",',
          '    smooth: { type: "continuous" }',
          '  }',
          '}',
          '```',
          '',
          '**참고 GitHub**:',
          '- [vis-network](https://github.com/visjs/vis-network)',
          '- [react-force-graph](https://github.com/vasturiano/react-force-graph)',
          '- [D3.js Force](https://github.com/d3/d3-force)'
        ],
        externalLinks: [
          { title: 'vis-network', url: 'https://github.com/visjs/vis-network' },
          { title: 'react-force-graph', url: 'https://github.com/vasturiano/react-force-graph' }
        ]
      }
    },
    {
      id: 'charts-dashboard',
      type: 'project',
      title: '차트 및 대시보드',
      duration: 90,
      content: {
        objectives: [
          'Recharts로 데이터 차트를 구현한다',
          '실시간 업데이트를 구현한다'
        ],
        requirements: [
          '**차트 컴포넌트**',
          '',
          '```tsx',
          '// components/StatsChart.tsx',
          "import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'",
          '',
          'export function StatsChart({ data }) {',
          '  return (',
          '    <LineChart width={600} height={300} data={data}>',
          '      <XAxis dataKey="date" />',
          '      <YAxis />',
          '      <Tooltip />',
          '      <Line type="monotone" dataKey="triples" stroke="#8884d8" />',
          '      <Line type="monotone" dataKey="confidence" stroke="#82ca9d" />',
          '    </LineChart>',
          '  )',
          '}',
          '```',
          '',
          '**참고 GitHub**:',
          '- [Recharts](https://github.com/recharts/recharts)',
          '- [Tremor](https://github.com/tremorlabs/tremor)'
        ],
        externalLinks: [
          { title: 'Recharts', url: 'https://github.com/recharts/recharts' },
          { title: 'Tremor', url: 'https://github.com/tremorlabs/tremor' }
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'containerization',
  title: 'Docker 컨테이너화',
  totalDuration: 180,
  tasks: [
    {
      id: 'docker-setup',
      type: 'project',
      title: 'Docker 설정',
      duration: 90,
      content: {
        objectives: [
          '멀티스테이지 Dockerfile을 작성한다',
          'docker-compose로 전체 스택을 구성한다'
        ],
        requirements: [
          '**Day 3 마일스톤: Docker**',
          '',
          '## Frontend Dockerfile',
          '```dockerfile',
          '# Dockerfile.frontend',
          'FROM node:20-alpine AS builder',
          'WORKDIR /app',
          'COPY package*.json ./',
          'RUN npm ci',
          'COPY . .',
          'RUN npm run build',
          '',
          'FROM node:20-alpine AS runner',
          'WORKDIR /app',
          'ENV NODE_ENV=production',
          'COPY --from=builder /app/.next/standalone ./',
          'COPY --from=builder /app/.next/static ./.next/static',
          'COPY --from=builder /app/public ./public',
          'EXPOSE 3000',
          'CMD ["node", "server.js"]',
          '```',
          '',
          '## Backend Dockerfile',
          '```dockerfile',
          '# Dockerfile.backend',
          'FROM python:3.11-slim',
          'WORKDIR /app',
          'COPY requirements.txt .',
          'RUN pip install --no-cache-dir -r requirements.txt',
          'COPY src/ ./src/',
          'EXPOSE 8000',
          'CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]',
          '```',
          '',
          '**참고 GitHub**:',
          '- [Docker Best Practices](https://github.com/docker/docker.github.io)',
          '- [Docker Examples](https://github.com/dockersamples)'
        ],
        externalLinks: [
          { title: 'Docker Docs', url: 'https://docs.docker.com/' }
        ]
      }
    },
    {
      id: 'docker-compose',
      type: 'code',
      title: 'Docker Compose 구성',
      duration: 90,
      content: {
        objectives: [
          '전체 서비스를 docker-compose로 오케스트레이션한다'
        ],
        starterCode: `# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/capstone
      - NEO4J_URI=bolt://neo4j:7687
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
    depends_on:
      - postgres
      - neo4j
      - redis

  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=capstone

  neo4j:
    image: neo4j:5-community
    ports:
      - "7474:7474"
      - "7687:7687"
    volumes:
      - neo4j_data:/data
    environment:
      - NEO4J_AUTH=neo4j/password

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  chroma:
    image: chromadb/chroma:latest
    volumes:
      - chroma_data:/chroma/chroma
    ports:
      - "8001:8000"

volumes:
  postgres_data:
  neo4j_data:
  redis_data:
  chroma_data:
`
      }
    }
  ]
}

const day4: Day = {
  slug: 'cloud-deployment',
  title: '클라우드 배포',
  totalDuration: 180,
  tasks: [
    {
      id: 'cloud-setup',
      type: 'project',
      title: '클라우드 인프라 설정',
      duration: 90,
      content: {
        objectives: [
          'AWS 또는 GCP에 배포한다',
          'CI/CD 파이프라인을 구성한다'
        ],
        requirements: [
          '**Day 4 마일스톤: 클라우드 배포**',
          '',
          '## 배포 옵션',
          '',
          '### Option A: Vercel + Render',
          '- Frontend: Vercel (무료 Hobby 플랜)',
          '- Backend: Render (무료 플랜)',
          '- DB: Supabase (PostgreSQL, 무료)',
          '- Neo4j: Neo4j Aura (무료 50K 노드)',
          '',
          '### Option B: GCP Cloud Run',
          '```bash',
          '# Backend 배포',
          'gcloud run deploy capstone-api \\',
          '  --image gcr.io/PROJECT_ID/capstone-api \\',
          '  --platform managed \\',
          '  --region asia-northeast3 \\',
          '  --allow-unauthenticated',
          '```',
          '',
          '### Option C: AWS ECS',
          '- ECR: 컨테이너 레지스트리',
          '- ECS Fargate: 서버리스 컨테이너',
          '- RDS: PostgreSQL',
          '- ElastiCache: Redis',
          '',
          '**참고 GitHub**:',
          '- [AWS CDK Examples](https://github.com/aws-samples/aws-cdk-examples)',
          '- [Terraform AWS](https://github.com/terraform-aws-modules)'
        ],
        externalLinks: [
          { title: 'Vercel', url: 'https://vercel.com' },
          { title: 'Render', url: 'https://render.com' },
          { title: 'GCP Cloud Run', url: 'https://cloud.google.com/run' }
        ]
      }
    },
    {
      id: 'cicd-pipeline',
      type: 'code',
      title: 'CI/CD 파이프라인',
      duration: 90,
      content: {
        objectives: [
          'GitHub Actions로 CI/CD를 구성한다'
        ],
        starterCode: `# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest

      - name: Run tests
        run: pytest tests/

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to GCR
        uses: google-github-actions/auth@v2
        with:
          credentials_json: \${{ secrets.GCP_SA_KEY }}

      - name: Build and push
        run: |
          gcloud builds submit --tag gcr.io/\${{ secrets.GCP_PROJECT }}/capstone-api
          gcloud run deploy capstone-api --image gcr.io/\${{ secrets.GCP_PROJECT }}/capstone-api --region asia-northeast3

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
`
      }
    }
  ]
}

const day5: Day = {
  slug: 'week7-checkpoint',
  title: 'Week 7 체크포인트',
  totalDuration: 180,
  tasks: [
    {
      id: 'deployment-verification',
      type: 'project',
      title: '배포 검증',
      duration: 90,
      content: {
        objectives: [
          '프로덕션 환경을 검증한다',
          '모니터링을 설정한다'
        ],
        requirements: [
          '**배포 검증 체크리스트**',
          '',
          '## 기능 테스트',
          '- [ ] 대시보드 로딩',
          '- [ ] Knowledge Graph 렌더링',
          '- [ ] Agent 채팅 동작',
          '- [ ] API 응답 확인',
          '',
          '## 성능 테스트',
          '- [ ] 페이지 로드 시간 < 3초',
          '- [ ] API 응답 시간 < 2초',
          '- [ ] 동시 접속 10명 테스트',
          '',
          '## 모니터링',
          '- [ ] 에러 추적 (Sentry)',
          '- [ ] 로그 수집 (Cloud Logging)',
          '- [ ] 메트릭 대시보드 (Grafana)'
        ]
      }
    },
    {
      id: 'week7-review',
      type: 'challenge',
      title: 'Week 7 마일스톤 리뷰',
      duration: 90,
      content: {
        objectives: [
          'Week 7 산출물을 점검한다',
          'Week 8 계획을 수립한다'
        ],
        requirements: [
          '**Week 7 체크리스트**',
          '',
          '## 산출물',
          '- [ ] Next.js 대시보드',
          '- [ ] 채팅 UI',
          '- [ ] Knowledge Graph 시각화',
          '- [ ] Docker 컨테이너화',
          '- [ ] docker-compose.yml',
          '- [ ] 클라우드 배포 완료',
          '- [ ] CI/CD 파이프라인',
          '- [ ] 프로덕션 URL 공유',
          '',
          '**Week 8 목표**:',
          '- 기술 문서 작성',
          '- 데모 영상 제작',
          '- 발표 준비'
        ],
        evaluationCriteria: [
          'UI/UX 완성도',
          '배포 안정성',
          '성능'
        ]
      }
    }
  ]
}

export const capstoneDeploymentWeek: Week = {
  slug: 'capstone-deployment',
  week: 7,
  phase: 6,
  month: 12,
  access: 'pro',
  title: '프론트엔드 & 배포',
  topics: ['Next.js', 'vis-network', 'Docker', 'CI/CD', 'Cloud Deploy'],
  practice: '프로덕션 배포',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
