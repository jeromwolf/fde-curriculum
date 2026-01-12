// Phase 4, Week 8: 인프라 프로젝트
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'project-planning',
  title: '프로젝트 기획 & 아키텍처',
  totalDuration: 180,
  tasks: [
    {
      id: 'project-requirements-video',
      type: 'video',
      title: 'Capstone 프로젝트 요구사항',
      duration: 30,
      content: {
        objectives: ['프로젝트 범위 정의', '아키텍처 설계 원칙', '기술 스택 선정'],
        videoUrl: 'https://www.youtube.com/watch?v=project-requirements-placeholder',
        transcript: `
## Phase 4 Capstone 프로젝트

### 프로젝트 목표

**AI 서비스 인프라 구축**

\`\`\`
완성 목표:
├── Terraform으로 IaC 구축
├── EKS에 마이크로서비스 배포
├── CI/CD 파이프라인 자동화
├── RAG 시스템 통합
├── LLM 서빙 인프라
└── 모니터링 & 알림 설정
\`\`\`

### 아키텍처 요구사항

\`\`\`
[사용자]
    │
    ▼
[CloudFront + WAF]
    │
    ▼
[ALB] → [EKS 클러스터]
           ├── Frontend (Next.js)
           ├── API Gateway (FastAPI)
           ├── RAG Service
           └── LLM Router
               │
               ▼
         [벡터 DB] [RDS] [ElastiCache]
               │
               ▼
         [Bedrock / vLLM]
\`\`\`

### 기술 스택

| 레이어 | 기술 |
|--------|------|
| IaC | Terraform + Terragrunt |
| 컨테이너 | Docker + EKS |
| CI/CD | GitHub Actions + ArgoCD |
| 벡터 DB | Pinecone 또는 pgvector |
| LLM | Bedrock + vLLM (fallback) |
| 모니터링 | Prometheus + Grafana + Langfuse |
        `
      }
    },
    {
      id: 'architecture-design',
      type: 'reading',
      title: '아키텍처 설계 문서',
      duration: 60,
      content: {
        objectives: ['설계 문서 작성', '의사결정 기록', '다이어그램 작성'],
        markdown: `
## 아키텍처 설계 문서 (ADR)

### 작성 항목

1. **컨텍스트**: 왜 이 결정이 필요한가?
2. **결정**: 어떤 선택을 했는가?
3. **대안**: 고려한 다른 옵션은?
4. **결과**: 이 결정의 장단점은?

### 예시: 벡터 DB 선택

**컨텍스트**: RAG 시스템에 벡터 DB가 필요함

**결정**: Pinecone 선택

**대안**:
- pgvector: PostgreSQL 통합, 관리 용이
- Milvus: 자체 호스팅, 비용 절감

**결과**:
- 장점: 빠른 시작, 관리 부담 없음
- 단점: 벤더 종속, 비용 증가 가능
        `
      }
    }
  ]
}

const day2: Day = {
  slug: 'infra-setup',
  title: '인프라 구축 (Day 1)',
  totalDuration: 180,
  tasks: [
    {
      id: 'terraform-infra',
      type: 'code',
      title: 'Terraform 인프라 구축',
      duration: 120,
      content: {
        objectives: ['VPC 모듈 작성', 'EKS 클러스터 생성', 'RDS 및 ElastiCache 설정'],
        instructions: `
## 인프라 구축

### 디렉토리 구조

\`\`\`
terraform/
├── modules/
│   ├── vpc/
│   ├── eks/
│   ├── rds/
│   └── elasticache/
├── environments/
│   ├── dev/
│   └── prod/
└── terragrunt.hcl
\`\`\`

### 과제

1. VPC 모듈 (퍼블릭/프라이빗 서브넷)
2. EKS 클러스터 (Managed Node Group)
3. RDS PostgreSQL (pgvector 확장)
4. ElastiCache Redis (세션/캐시)
        `,
        starterCode: `# terraform/environments/dev/main.tf
module "vpc" {
  source = "../../modules/vpc"
  # TODO: 변수 설정
}

module "eks" {
  source = "../../modules/eks"
  # TODO: 변수 설정
}
`,
        solutionCode: `# terraform/environments/dev/main.tf
module "vpc" {
  source = "../../modules/vpc"

  environment   = "dev"
  vpc_cidr      = "10.0.0.0/16"
  azs           = ["ap-northeast-2a", "ap-northeast-2c"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.10.0/24", "10.0.11.0/24"]
}

module "eks" {
  source = "../../modules/eks"

  cluster_name    = "fde-dev"
  cluster_version = "1.29"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids

  node_groups = {
    general = {
      instance_types = ["t3.large"]
      min_size       = 2
      max_size       = 4
      desired_size   = 2
    }
    gpu = {
      instance_types = ["g4dn.xlarge"]
      min_size       = 0
      max_size       = 2
      desired_size   = 0
      labels = {
        "node-type" = "gpu"
      }
      taints = [{
        key    = "gpu"
        value  = "true"
        effect = "NO_SCHEDULE"
      }]
    }
  }
}

module "rds" {
  source = "../../modules/rds"

  identifier     = "fde-dev"
  engine_version = "15.4"
  instance_class = "db.t3.micro"
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.private_subnet_ids

  # pgvector 확장 활성화
  parameters = [{
    name  = "shared_preload_libraries"
    value = "pg_stat_statements,pgvector"
  }]
}
`
      }
    }
  ]
}

const day3: Day = {
  slug: 'app-deployment',
  title: '애플리케이션 배포',
  totalDuration: 180,
  tasks: [
    {
      id: 'k8s-manifests',
      type: 'code',
      title: 'K8s 매니페스트 & Helm',
      duration: 90,
      content: {
        objectives: ['Helm 차트 작성', '서비스 간 통신 설정', 'Ingress 구성'],
        instructions: `
## K8s 배포

### 서비스 구성

\`\`\`
services/
├── api-gateway/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── hpa.yaml
├── rag-service/
├── llm-router/
└── frontend/
\`\`\`

### Helm 차트 구조

\`\`\`
charts/fde-app/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── values-prod.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    └── hpa.yaml
\`\`\`
        `,
        starterCode: `# charts/fde-app/values.yaml
replicaCount: 2

image:
  repository: your-ecr-repo
  tag: latest

# TODO: 서비스별 설정
`,
        solutionCode: `# charts/fde-app/values.yaml
replicaCount: 2

image:
  repository: 123456789.dkr.ecr.ap-northeast-2.amazonaws.com/fde-app
  tag: latest
  pullPolicy: Always

service:
  type: ClusterIP
  port: 8000

ingress:
  enabled: true
  className: alb
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
  hosts:
    - host: api.fde.example.com
      paths:
        - path: /
          pathType: Prefix

resources:
  requests:
    cpu: "100m"
    memory: "256Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: db-credentials
        key: url
  - name: OPENAI_API_KEY
    valueFrom:
      secretKeyRef:
        name: llm-credentials
        key: openai-key
`
      }
    }
  ]
}

const day4: Day = {
  slug: 'cicd-monitoring',
  title: 'CI/CD & 모니터링',
  totalDuration: 180,
  tasks: [
    {
      id: 'full-pipeline',
      type: 'code',
      title: '완전한 CI/CD 파이프라인',
      duration: 90,
      content: {
        objectives: ['GitHub Actions CI 구성', 'ArgoCD CD 설정', '모니터링 스택 배포'],
        instructions: '완전한 CI/CD 파이프라인을 구축하고 모니터링 시스템을 설정하세요.',
        starterCode: `# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  # TODO: Build, Test, Deploy
`,
        solutionCode: `# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest --cov

  build:
    needs: test
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    outputs:
      image_tag: \${{ steps.build.outputs.image_tag }}
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2
      - uses: aws-actions/amazon-ecr-login@v2
      - id: build
        run: |
          IMAGE_TAG=\${{ github.sha }}
          docker build -t \$ECR_REGISTRY/fde-app:\$IMAGE_TAG .
          docker push \$ECR_REGISTRY/fde-app:\$IMAGE_TAG
          echo "image_tag=\$IMAGE_TAG" >> \$GITHUB_OUTPUT

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          repository: your-org/k8s-manifests
          token: \${{ secrets.GH_TOKEN }}
      - run: |
          yq eval '.image.tag = "\${{ needs.build.outputs.image_tag }}"' -i values.yaml
          git commit -am "Update image to \${{ needs.build.outputs.image_tag }}"
          git push
`
      }
    }
  ]
}

const day5: Day = {
  slug: 'final-presentation',
  title: '🏆 최종 프로젝트 발표',
  totalDuration: 180,
  tasks: [
    {
      id: 'final-challenge',
      type: 'challenge',
      title: 'Phase 4 Capstone: AI 인프라 플랫폼',
      duration: 180,
      content: {
        objectives: ['완전한 AI 서비스 인프라 구축', '운영 가능한 수준의 시스템', '포트폴리오 문서화'],
        requirements: [
          '**인프라 (Terraform)**',
          '- VPC + EKS + RDS + ElastiCache',
          '- Terraform 모듈화 + 원격 상태',
          '- 환경 분리 (dev/prod)',
          '',
          '**애플리케이션 (K8s)**',
          '- 마이크로서비스 배포 (3개 이상)',
          '- Ingress + TLS',
          '- HPA + Resource limits',
          '',
          '**CI/CD**',
          '- GitHub Actions (테스트, 빌드)',
          '- ArgoCD (GitOps 배포)',
          '- 환경별 배포 전략',
          '',
          '**AI 서비스**',
          '- RAG 파이프라인 (벡터 DB 연동)',
          '- LLM 서빙 (API Gateway + Fallback)',
          '- 모니터링 (Langfuse)',
          '',
          '**운영**',
          '- Prometheus + Grafana 대시보드',
          '- CloudWatch 알람',
          '- 비용 추적'
        ],
        evaluationCriteria: [
          '인프라 완성도 (25%)',
          '자동화 수준 (25%)',
          'AI 서비스 통합 (25%)',
          '문서화 및 발표 (25%)'
        ],
        bonusPoints: [
          '멀티 리전 배포',
          'Chaos Engineering',
          '비용 최적화 (Spot, Savings Plans)',
          '보안 스캔 통합'
        ]
      }
    }
  ]
}

export const infraProjectWeek: Week = {
  slug: 'infra-project',
  week: 8,
  phase: 4,
  month: 9,
  access: 'pro',
  title: '인프라 프로젝트',
  topics: ['Capstone', 'Full Stack', 'IaC', 'K8s', 'CI/CD', 'AI Infra'],
  practice: 'AI 서비스 인프라 플랫폼',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
