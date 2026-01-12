// Phase 4, Week 4: CI/CD 파이프라인
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'cicd-basics',
  title: 'CI/CD 개념 & GitHub Actions',
  totalDuration: 180,
  tasks: [
    {
      id: 'cicd-intro-video',
      type: 'video',
      title: 'CI/CD 파이프라인 개념',
      duration: 25,
      content: {
        objectives: ['CI/CD의 필요성 이해', 'CI vs CD vs CD 구분', '주요 CI/CD 도구 비교'],
        videoUrl: 'https://www.youtube.com/watch?v=cicd-intro-placeholder',
        transcript: `
## CI/CD 파이프라인

### CI/CD란?

\`\`\`
CI (Continuous Integration)
├── 코드 변경 시 자동 빌드
├── 자동 테스트 실행
└── 빠른 피드백

CD (Continuous Delivery)
├── 스테이징 자동 배포
└── 프로덕션 수동 승인

CD (Continuous Deployment)
├── 프로덕션 자동 배포
└── 완전 자동화
\`\`\`

### CI/CD 도구 비교

| 도구 | 특징 | 가격 |
|------|------|------|
| **GitHub Actions** | GitHub 통합, YAML | 무료 2000분/월 |
| **GitLab CI** | GitLab 통합 | 무료 400분/월 |
| **Jenkins** | 자체 호스팅, 유연성 | 무료 (인프라 비용) |
| **CircleCI** | 빠른 빌드 | 무료 6000분/월 |
| **AWS CodePipeline** | AWS 통합 | $1/파이프라인/월 |
        `
      }
    },
    {
      id: 'github-actions-video',
      type: 'video',
      title: 'GitHub Actions 기초',
      duration: 35,
      content: {
        objectives: ['워크플로우 파일 구조', '트리거 조건 설정', 'Job과 Step 이해'],
        videoUrl: 'https://www.youtube.com/watch?v=github-actions-placeholder',
        transcript: `
## GitHub Actions

### 워크플로우 구조

\`\`\`yaml
# .github/workflows/ci.yml
name: CI Pipeline

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
      - run: pytest

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t my-app .
\`\`\`

### 주요 개념

| 개념 | 설명 |
|------|------|
| **Workflow** | 자동화된 프로세스 (YAML 파일) |
| **Job** | 동일 러너에서 실행되는 Step 집합 |
| **Step** | 개별 작업 (명령어 또는 액션) |
| **Action** | 재사용 가능한 작업 단위 |
| **Runner** | 워크플로우 실행 환경 |

### Secrets 관리

\`\`\`yaml
steps:
  - name: Deploy
    env:
      AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
    run: aws s3 sync ./dist s3://my-bucket
\`\`\`
        `
      }
    },
    {
      id: 'actions-practice',
      type: 'code',
      title: 'Python CI 파이프라인 실습',
      duration: 45,
      content: {
        objectives: ['테스트 자동화 구성', '린터 및 포매터 적용', '코드 커버리지 측정'],
        instructions: 'GitHub Actions로 Python 프로젝트의 CI 파이프라인을 구성하세요.',
        starterCode: `# .github/workflows/ci.yml
name: Python CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # TODO: 체크아웃
      # TODO: Python 설정
      # TODO: 의존성 설치
      # TODO: 린팅 (flake8)
      # TODO: 테스트 (pytest)
`,
        solutionCode: `# .github/workflows/ci.yml
name: Python CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install flake8 black isort
      - name: Run linters
        run: |
          flake8 . --max-line-length=100
          black --check .
          isort --check-only .

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov
      - name: Run tests
        run: |
          pytest --cov=src --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'docker-cicd',
  title: 'Docker 빌드 & ECR 푸시',
  totalDuration: 180,
  tasks: [
    {
      id: 'docker-build-video',
      type: 'video',
      title: 'Docker 이미지 빌드 자동화',
      duration: 30,
      content: {
        objectives: ['Docker 빌드 최적화', 'ECR 푸시 자동화', '이미지 태깅 전략'],
        videoUrl: 'https://www.youtube.com/watch?v=docker-build-placeholder',
        transcript: `
## Docker CI/CD

### ECR 푸시 워크플로우

\`\`\`yaml
name: Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push
        env:
          ECR_REGISTRY: \${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: \${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/my-app:$IMAGE_TAG .
          docker push $ECR_REGISTRY/my-app:$IMAGE_TAG
\`\`\`

### 이미지 태깅 전략

\`\`\`
태그 유형:
├── latest        → 최신 (프로덕션용 비권장)
├── v1.2.3        → 시맨틱 버전
├── abc123        → Git SHA (추적 용이)
└── main-20240115 → 브랜치-날짜
\`\`\`
        `
      }
    }
  ]
}

const day3: Day = {
  slug: 'k8s-deployment',
  title: 'Kubernetes 자동 배포',
  totalDuration: 180,
  tasks: [
    {
      id: 'k8s-deploy-video',
      type: 'video',
      title: 'K8s 롤링 배포 자동화',
      duration: 30,
      content: {
        objectives: ['kubectl 기반 배포', 'Helm 차트 배포', '배포 전략 (Blue-Green, Canary)'],
        videoUrl: 'https://www.youtube.com/watch?v=k8s-deploy-placeholder',
        transcript: `
## K8s 배포 자동화

### kubectl 배포

\`\`\`yaml
- name: Deploy to EKS
  run: |
    aws eks update-kubeconfig --name my-cluster
    kubectl set image deployment/api api=$ECR_REGISTRY/my-app:$IMAGE_TAG
\`\`\`

### Helm 배포

\`\`\`yaml
- name: Deploy with Helm
  run: |
    helm upgrade --install my-app ./chart \\
      --set image.tag=$IMAGE_TAG \\
      --set replicas=3
\`\`\`

### 배포 전략

\`\`\`
롤링 업데이트 (기본)
├── 점진적 교체
└── 다운타임 없음

Blue-Green
├── 두 환경 병렬 운영
└── 즉시 롤백 가능

Canary
├── 일부 트래픽만 새 버전
└── 점진적 트래픽 이동
\`\`\`
        `
      }
    }
  ]
}

const day4: Day = {
  slug: 'gitops',
  title: 'GitOps & ArgoCD',
  totalDuration: 180,
  tasks: [
    {
      id: 'gitops-video',
      type: 'video',
      title: 'GitOps 패턴과 ArgoCD',
      duration: 35,
      content: {
        objectives: ['GitOps 원칙 이해', 'ArgoCD 설치 및 설정', '선언적 배포 관리'],
        videoUrl: 'https://www.youtube.com/watch?v=gitops-placeholder',
        transcript: `
## GitOps

### GitOps 원칙

\`\`\`
1. 선언적 설정: 원하는 상태를 Git에 저장
2. 버전 관리: 모든 변경은 Git 커밋
3. 자동 동기화: Git → 클러스터 자동 반영
4. 지속적 조정: 드리프트 자동 감지/수정
\`\`\`

### Push vs Pull 기반

\`\`\`
Push 기반 (전통적)
CI → kubectl apply → Cluster

Pull 기반 (GitOps)
Git Repo ← ArgoCD → Cluster
           (폴링)
\`\`\`

### ArgoCD 설치

\`\`\`bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# UI 접속
kubectl port-forward svc/argocd-server -n argocd 8080:443
\`\`\`

### Application 정의

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/my-org/k8s-manifests
    targetRevision: main
    path: apps/my-app
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
\`\`\`
        `
      }
    }
  ]
}

const day5: Day = {
  slug: 'cicd-project',
  title: '🏆 Week 4 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'week4-challenge',
      type: 'challenge',
      title: '완전한 CI/CD 파이프라인 구축',
      duration: 120,
      content: {
        objectives: ['End-to-End CI/CD 구축', 'GitOps 워크플로우 구현', '보안 스캔 통합'],
        requirements: [
          'GitHub Actions CI (린트, 테스트, 빌드)',
          'Docker 이미지 빌드 & ECR 푸시',
          'ArgoCD로 EKS 배포',
          'Slack 알림 연동',
          '보안 스캔 (Trivy, Snyk)',
          '환경별 배포 (dev/staging/prod)'
        ],
        evaluationCriteria: ['파이프라인 완성도 (30%)', '보안 설정 (25%)', 'GitOps 구현 (25%)', '문서화 (20%)'],
        bonusPoints: ['Terraform 인프라 CI/CD', 'Feature Flag 통합', 'Chaos Engineering']
      }
    }
  ]
}

export const cicdWeek: Week = {
  slug: 'cicd',
  week: 4,
  phase: 4,
  month: 8,
  access: 'pro',
  title: 'CI/CD 파이프라인',
  topics: ['GitHub Actions', 'Docker Build', 'ECR', 'ArgoCD', 'GitOps'],
  practice: 'End-to-End CI/CD 구축',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
