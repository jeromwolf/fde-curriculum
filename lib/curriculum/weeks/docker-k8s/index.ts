// Phase 4, Week 3: Docker & Kubernetes
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'docker-basics',
  title: 'Docker 기초',
  totalDuration: 180,
  tasks: [
    {
      id: 'docker-intro-video',
      type: 'video',
      title: '컨테이너와 Docker 개념',
      duration: 30,
      content: {
        objectives: ['컨테이너의 개념과 장점 이해', 'Docker 아키텍처 학습', 'VM vs Container 비교'],
        videoUrl: 'https://www.youtube.com/watch?v=docker-intro-placeholder',
        transcript: `
## Docker & 컨테이너

### 컨테이너란?

**애플리케이션과 의존성을 패키징**한 격리된 환경입니다.

\`\`\`
가상 머신 (VM)                   컨테이너 (Docker)
├── Guest OS (전체)              ├── 공유 커널
├── GB 단위 용량                 ├── MB 단위 용량
├── 분 단위 시작                 ├── 초 단위 시작
└── 완전 격리                    └── 프로세스 격리
\`\`\`

### Docker 아키텍처

\`\`\`
Docker Client → Docker Daemon → Container Runtime
     │              │
     └─ docker run  └─ 이미지 관리, 컨테이너 생성
\`\`\`

### 핵심 개념

| 개념 | 설명 |
|------|------|
| **이미지** | 읽기 전용 템플릿 |
| **컨테이너** | 이미지의 실행 인스턴스 |
| **Dockerfile** | 이미지 빌드 명세 |
| **레지스트리** | 이미지 저장소 (Docker Hub, ECR) |

### 기본 명령어

\`\`\`bash
# 이미지 다운로드
docker pull python:3.11

# 컨테이너 실행
docker run -d -p 8080:80 nginx

# 실행 중인 컨테이너
docker ps

# 컨테이너 로그
docker logs <container-id>

# 컨테이너 접속
docker exec -it <container-id> bash
\`\`\`
        `
      }
    },
    {
      id: 'dockerfile-video',
      type: 'video',
      title: 'Dockerfile 작성법',
      duration: 30,
      content: {
        objectives: ['Dockerfile 문법 학습', '효율적인 이미지 빌드', '멀티스테이지 빌드'],
        videoUrl: 'https://www.youtube.com/watch?v=dockerfile-placeholder',
        transcript: `
## Dockerfile 작성

### 기본 구조

\`\`\`dockerfile
# 베이스 이미지
FROM python:3.11-slim

# 작업 디렉토리
WORKDIR /app

# 의존성 설치 (캐싱 최적화)
COPY requirements.txt .
RUN pip install -r requirements.txt

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 8000

# 실행 명령
CMD ["python", "app.py"]
\`\`\`

### 멀티스테이지 빌드

\`\`\`dockerfile
# 빌드 스테이지
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 프로덕션 스테이지
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
\`\`\`

### 이미지 크기 최적화

\`\`\`
python:3.11        → 1.0 GB
python:3.11-slim   → 150 MB
python:3.11-alpine → 50 MB
\`\`\`
        `
      }
    },
    {
      id: 'docker-practice',
      type: 'code',
      title: 'Python 앱 컨테이너화 실습',
      duration: 45,
      content: {
        objectives: ['FastAPI 앱을 컨테이너화한다', 'docker-compose로 멀티 컨테이너 실행', 'ECR에 이미지 푸시'],
        instructions: 'FastAPI 애플리케이션을 Docker로 컨테이너화하고 실행해보세요.',
        starterCode: `# Dockerfile
FROM python:3.11-slim

# TODO: 작업 디렉토리 설정

# TODO: 의존성 설치

# TODO: 소스 코드 복사

# TODO: 실행 명령
`,
        solutionCode: `# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# docker-compose.yml
# version: '3.8'
# services:
#   api:
#     build: .
#     ports:
#       - "8000:8000"
#     environment:
#       - DATABASE_URL=postgresql://db:5432/app
#   db:
#     image: postgres:15
#     environment:
#       POSTGRES_PASSWORD: secret
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'kubernetes-basics',
  title: 'Kubernetes 기초',
  totalDuration: 180,
  tasks: [
    {
      id: 'k8s-intro-video',
      type: 'video',
      title: 'Kubernetes 아키텍처',
      duration: 35,
      content: {
        objectives: ['K8s 핵심 개념 이해', 'Control Plane vs Worker Node', 'Pod, Deployment, Service'],
        videoUrl: 'https://www.youtube.com/watch?v=k8s-intro-placeholder',
        transcript: `
## Kubernetes (K8s)

### K8s란?

**컨테이너 오케스트레이션 플랫폼**입니다.

\`\`\`
Docker만 사용                   Kubernetes
├── 단일 호스트                  ├── 클러스터 (다중 노드)
├── 수동 스케일링                ├── 자동 스케일링
├── 수동 복구                    ├── 자동 복구
└── 수동 배포                    └── 롤링 업데이트
\`\`\`

### 아키텍처

\`\`\`
Control Plane (Master)
├── API Server      → 클러스터 진입점
├── etcd            → 클러스터 상태 저장
├── Scheduler       → Pod 배치 결정
└── Controller Manager → 상태 관리

Worker Node
├── kubelet         → Pod 실행
├── kube-proxy      → 네트워킹
└── Container Runtime (Docker/containerd)
\`\`\`

### 핵심 오브젝트

| 오브젝트 | 설명 |
|----------|------|
| **Pod** | 컨테이너 그룹 (최소 배포 단위) |
| **Deployment** | Pod 관리 (복제, 롤링 업데이트) |
| **Service** | Pod 네트워크 노출 |
| **ConfigMap/Secret** | 설정 및 시크릿 관리 |
| **Ingress** | HTTP 라우팅 |
        `
      }
    },
    {
      id: 'k8s-objects-video',
      type: 'video',
      title: 'K8s 오브젝트 작성',
      duration: 30,
      content: {
        objectives: ['YAML 매니페스트 작성', 'Deployment와 Service 구성', 'kubectl 명령어'],
        videoUrl: 'https://www.youtube.com/watch?v=k8s-objects-placeholder',
        transcript: `
## K8s 매니페스트

### Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: my-api:v1
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
\`\`\`

### Service

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  type: LoadBalancer
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 8000
\`\`\`

### kubectl 명령어

\`\`\`bash
# 적용
kubectl apply -f deployment.yaml

# 조회
kubectl get pods
kubectl get deployments
kubectl get services

# 로그
kubectl logs <pod-name>

# 접속
kubectl exec -it <pod-name> -- bash
\`\`\`
        `
      }
    }
  ]
}

const day3: Day = {
  slug: 'k8s-advanced',
  title: 'K8s 고급 패턴',
  totalDuration: 180,
  tasks: [
    {
      id: 'k8s-scaling-video',
      type: 'video',
      title: '스케일링 & 롤링 업데이트',
      duration: 30,
      content: {
        objectives: ['HPA (Horizontal Pod Autoscaler)', '롤링 업데이트 전략', 'Readiness/Liveness Probe'],
        videoUrl: 'https://www.youtube.com/watch?v=k8s-scaling-placeholder',
        transcript: `
## K8s 스케일링

### HPA (Horizontal Pod Autoscaler)

\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
\`\`\`

### 롤링 업데이트

\`\`\`yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # 추가 Pod 수
      maxUnavailable: 0  # 최소 가용 Pod 보장
\`\`\`

### Health Check

\`\`\`yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 5

readinessProbe:
  httpGet:
    path: /ready
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 3
\`\`\`
        `
      }
    }
  ]
}

const day4: Day = {
  slug: 'eks-setup',
  title: 'EKS (Elastic Kubernetes Service)',
  totalDuration: 180,
  tasks: [
    {
      id: 'eks-intro-video',
      type: 'video',
      title: 'AWS EKS 소개',
      duration: 30,
      content: {
        objectives: ['EKS 아키텍처 이해', 'EKS vs 자체 관리형 K8s', 'eksctl로 클러스터 생성'],
        videoUrl: 'https://www.youtube.com/watch?v=eks-intro-placeholder',
        transcript: `
## AWS EKS

### EKS란?

**AWS 관리형 Kubernetes 서비스**입니다.

\`\`\`
자체 관리형 K8s                EKS
├── Control Plane 관리         ├── AWS가 관리
├── 업그레이드 직접             ├── 원클릭 업그레이드
├── 고가용성 직접 구성          ├── Multi-AZ 기본
└── 모니터링 직접 설정          └── CloudWatch 통합
\`\`\`

### EKS 클러스터 생성

\`\`\`bash
# eksctl 설치
brew install eksctl

# 클러스터 생성
eksctl create cluster \\
  --name fde-cluster \\
  --region ap-northeast-2 \\
  --nodegroup-name workers \\
  --node-type t3.medium \\
  --nodes 2
\`\`\`

### 비용 구조

| 항목 | 비용 |
|------|------|
| EKS Control Plane | $0.10/시간 (~$72/월) |
| Worker Node (EC2) | 인스턴스 비용 |
| NAT Gateway | 데이터 전송 비용 |
        `
      }
    },
    {
      id: 'eks-practice',
      type: 'code',
      title: 'EKS 클러스터 배포 실습',
      duration: 60,
      content: {
        objectives: ['EKS 클러스터 생성', '애플리케이션 배포', 'ALB Ingress 설정'],
        instructions: 'eksctl로 EKS 클러스터를 생성하고 애플리케이션을 배포해보세요.',
        starterCode: `# cluster.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: fde-cluster
  region: ap-northeast-2

# TODO: Node Group 설정
`,
        solutionCode: `# cluster.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: fde-cluster
  region: ap-northeast-2

managedNodeGroups:
  - name: workers
    instanceType: t3.medium
    desiredCapacity: 2
    minSize: 1
    maxSize: 4
    volumeSize: 20
    ssh:
      allow: false
    labels:
      role: worker
    tags:
      Environment: development

# IAM OIDC Provider (IRSA용)
iam:
  withOIDC: true

# 명령어:
# eksctl create cluster -f cluster.yaml
# kubectl get nodes
`
      }
    }
  ]
}

const day5: Day = {
  slug: 'k8s-project',
  title: '🏆 Week 3 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'week3-challenge',
      type: 'challenge',
      title: '마이크로서비스 K8s 배포',
      duration: 120,
      content: {
        objectives: ['마이크로서비스 아키텍처 K8s 배포', '서비스 간 통신 구성', '모니터링 설정'],
        requirements: [
          'EKS 클러스터 (2 Node)',
          'Frontend + API + DB 배포',
          'Service & Ingress 구성',
          'HPA 자동 스케일링',
          'ConfigMap/Secret 관리',
          'Helm Chart 패키징'
        ],
        evaluationCriteria: ['K8s 매니페스트 품질 (30%)', '네트워크 구성 (25%)', '스케일링 설정 (25%)', '문서화 (20%)'],
        bonusPoints: ['Istio Service Mesh', 'Prometheus/Grafana', 'ArgoCD GitOps']
      }
    }
  ]
}

export const dockerK8sWeek: Week = {
  slug: 'docker-k8s',
  week: 3,
  phase: 4,
  month: 7,
  access: 'pro',
  title: 'Docker & Kubernetes',
  topics: ['Docker', 'Dockerfile', 'Kubernetes', 'EKS', 'Helm', 'HPA'],
  practice: '마이크로서비스 K8s 배포',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
