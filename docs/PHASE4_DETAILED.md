# Phase 4: 클라우드 & 인프라 (8주)

> 목표: AWS에서 확장 가능한 데이터 인프라를 구축하고 운영할 수 있다.
>
> 기간: 2개월 (8주)
>
> 포트폴리오: 클라우드 네이티브 데이터 플랫폼
>
> 자격증: AWS Solutions Architect Associate (SAA-C03)

---

## 🚀 Phase 4를 시작하며

Phase 1-3에서 데이터 파이프라인, 분석, Knowledge Graph를 구축했습니다.

하지만 이 모든 것이 **로컬 환경**에서 실행되고 있습니다.
실제 서비스로 배포하려면:
- 확장 가능한 인프라
- 안정적인 배포
- 모니터링과 알림
- 비용 관리

가 필요합니다.

Phase 4에서는:
- AWS 핵심 서비스로 인프라 구축
- Docker/Kubernetes로 컨테이너화
- Terraform으로 인프라를 코드로 관리
- CI/CD로 자동 배포

> **Phase 1-3의 프로젝트 + Phase 4의 인프라 = 프로덕션 레벨 시스템**

---

## Month 7: AWS 핵심 서비스 & 컨테이너

---

### Week 25: AWS 기초 & 핵심 서비스

#### 학습 목표
- [ ] AWS 글로벌 인프라와 핵심 서비스를 이해할 수 있다
- [ ] IAM으로 보안을 구성할 수 있다
- [ ] S3, EC2, VPC를 설정하고 사용할 수 있다
- [ ] AWS CLI와 SDK를 활용할 수 있다

#### 핵심 개념

**1. AWS 글로벌 인프라**
```
Region: 지리적 영역 (ap-northeast-2 = 서울)
Availability Zone (AZ): Region 내 데이터센터 (2a, 2b, 2c)
Edge Location: CDN (CloudFront) 캐시 서버

선택 기준:
- 지연 시간 (사용자 근접)
- 규정 준수 (데이터 주권)
- 서비스 가용성
- 비용
```

**2. IAM (Identity and Access Management)**
```json
// IAM Policy 예시
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    },
    {
      "Effect": "Deny",
      "Action": "s3:DeleteObject",
      "Resource": "*"
    }
  ]
}
```

| 개념 | 설명 |
|------|------|
| User | 사람 또는 애플리케이션 |
| Group | 사용자 집합 (권한 상속) |
| Role | 임시 자격 증명 (EC2, Lambda용) |
| Policy | 권한 정의 (JSON) |

**3. S3 (Simple Storage Service)**
```python
import boto3

s3 = boto3.client('s3')

# 버킷 생성
s3.create_bucket(
    Bucket='my-data-bucket',
    CreateBucketConfiguration={'LocationConstraint': 'ap-northeast-2'}
)

# 파일 업로드
s3.upload_file('data.csv', 'my-data-bucket', 'raw/data.csv')

# 파일 다운로드
s3.download_file('my-data-bucket', 'raw/data.csv', 'local_data.csv')

# 파일 목록
response = s3.list_objects_v2(Bucket='my-data-bucket', Prefix='raw/')
for obj in response['Contents']:
    print(obj['Key'], obj['Size'])
```

| 스토리지 클래스 | 사용 사례 | 비용 |
|----------------|----------|------|
| Standard | 자주 접근 | 높음 |
| Intelligent-Tiering | 접근 패턴 불확실 | 자동 |
| Glacier | 아카이브 (분/시간 복원) | 낮음 |
| Glacier Deep Archive | 장기 보관 (12시간+ 복원) | 최저 |

**4. EC2 (Elastic Compute Cloud)**
```bash
# AWS CLI로 인스턴스 시작
aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1f0 \
    --instance-type t3.medium \
    --key-name my-key \
    --security-group-ids sg-12345678 \
    --subnet-id subnet-12345678 \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=MyServer}]'

# 인스턴스 목록
aws ec2 describe-instances --filters "Name=tag:Name,Values=MyServer"
```

**5. VPC (Virtual Private Cloud)**
```
기본 구조:
VPC (10.0.0.0/16)
├── Public Subnet (10.0.1.0/24) - Internet Gateway
│   └── Bastion Host, Load Balancer
├── Private Subnet (10.0.2.0/24) - NAT Gateway
│   └── Application Servers
└── Private Subnet (10.0.3.0/24)
    └── Database

보안:
- Security Group: 인스턴스 레벨 방화벽 (Stateful)
- NACL: 서브넷 레벨 방화벽 (Stateless)
```

#### 실습 과제

**과제: AWS 기본 인프라 구축**

```
요구사항:
1. IAM 설정:
   - 관리자 그룹 + 사용자
   - 개발자 그룹 (S3, EC2 제한된 권한)
   - EC2용 Role (S3 접근)
2. VPC 구성:
   - VPC + Public/Private 서브넷
   - Internet Gateway, NAT Gateway
   - Security Group (SSH, HTTP)
3. EC2 배포:
   - t3.micro 인스턴스
   - 사용자 데이터로 웹서버 설치
4. S3 설정:
   - 버킷 생성
   - 버전 관리 활성화
   - 수명 주기 정책
5. AWS CLI 스크립트:
   - 리소스 생성/삭제 자동화

산출물:
- 아키텍처 다이어그램
- CloudFormation/Terraform 템플릿 (선택)
- CLI 스크립트
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| IAM | 최소 권한 원칙 적용 | 20% |
| VPC | Public/Private 분리 | 25% |
| EC2 | 웹서버 접속 가능 | 20% |
| S3 | 버전 관리 + 수명 주기 | 20% |
| 자동화 | CLI 스크립트 동작 | 15% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 무료 | AWS Free Tier | https://aws.amazon.com/free/ |
| 코스 | AWS Cloud Practitioner | https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/ |
| 문서 | AWS Well-Architected | https://aws.amazon.com/architecture/well-architected/ |
| 영상 | FreeCodeCamp AWS Tutorial | https://www.youtube.com/watch?v=3hLmDS179YE |

---

### Week 26: AWS 데이터 서비스

#### 학습 목표
- [ ] RDS와 Aurora로 관계형 DB를 운영할 수 있다
- [ ] DynamoDB로 NoSQL 워크로드를 처리할 수 있다
- [ ] Redshift로 데이터 웨어하우스를 구축할 수 있다
- [ ] Glue와 Athena로 서버리스 분석을 수행할 수 있다

#### 핵심 개념

**1. RDS & Aurora**
```python
import boto3
import psycopg2

# RDS PostgreSQL 생성 (CLI)
# aws rds create-db-instance \
#     --db-instance-identifier mydb \
#     --db-instance-class db.t3.micro \
#     --engine postgres \
#     --master-username admin \
#     --master-user-password secret123 \
#     --allocated-storage 20

# Python 연결
conn = psycopg2.connect(
    host="mydb.xxx.ap-northeast-2.rds.amazonaws.com",
    database="mydb",
    user="admin",
    password="secret123"
)
```

| 항목 | RDS | Aurora |
|------|-----|--------|
| 엔진 | MySQL, PostgreSQL, etc. | MySQL, PostgreSQL 호환 |
| 성능 | 표준 | 3-5x 빠름 |
| 스토리지 | 수동 프로비저닝 | 자동 확장 (128TB) |
| 복제 | 읽기 전용 복제본 | 최대 15개 복제본 |
| 비용 | 저렴 | 높음 |

**2. DynamoDB**
```python
import boto3

dynamodb = boto3.resource('dynamodb')

# 테이블 생성
table = dynamodb.create_table(
    TableName='Users',
    KeySchema=[
        {'AttributeName': 'user_id', 'KeyType': 'HASH'},  # 파티션 키
        {'AttributeName': 'created_at', 'KeyType': 'RANGE'}  # 정렬 키
    ],
    AttributeDefinitions=[
        {'AttributeName': 'user_id', 'AttributeType': 'S'},
        {'AttributeName': 'created_at', 'AttributeType': 'S'}
    ],
    BillingMode='PAY_PER_REQUEST'
)

# 아이템 추가
table.put_item(Item={
    'user_id': 'user123',
    'created_at': '2024-01-15T10:00:00Z',
    'name': 'Kim',
    'email': 'kim@example.com'
})

# 쿼리
response = table.query(
    KeyConditionExpression='user_id = :uid',
    ExpressionAttributeValues={':uid': 'user123'}
)
```

**3. Redshift**
```sql
-- 외부 스키마 (S3 연결)
CREATE EXTERNAL SCHEMA spectrum
FROM DATA CATALOG
DATABASE 'mydb'
IAM_ROLE 'arn:aws:iam::123456789:role/RedshiftRole';

-- S3 데이터 직접 쿼리 (Spectrum)
SELECT date, sum(amount) as total
FROM spectrum.sales
WHERE date >= '2024-01-01'
GROUP BY date;

-- COPY 명령 (S3 → Redshift)
COPY sales
FROM 's3://my-bucket/data/'
IAM_ROLE 'arn:aws:iam::123456789:role/RedshiftRole'
FORMAT AS PARQUET;
```

**4. Glue & Athena (서버리스)**
```python
# Glue Crawler - S3 데이터 자동 스키마 탐지
# AWS Console에서 설정 또는 boto3

# Athena 쿼리
import boto3

athena = boto3.client('athena')

response = athena.start_query_execution(
    QueryString="""
        SELECT date, count(*) as cnt
        FROM mydb.events
        WHERE year = '2024' AND month = '01'
        GROUP BY date
    """,
    QueryExecutionContext={'Database': 'mydb'},
    ResultConfiguration={'OutputLocation': 's3://my-results/'}
)

# 결과 확인
query_id = response['QueryExecutionId']
result = athena.get_query_results(QueryExecutionId=query_id)
```

| 서비스 | 용도 | 과금 |
|--------|------|------|
| Glue Crawler | 스키마 자동 탐지 | 실행 시간 |
| Glue ETL | 서버리스 Spark | DPU 시간 |
| Athena | S3 직접 쿼리 | 스캔 데이터량 |
| Glue Data Catalog | 메타데이터 저장 | 객체 수 |

#### 실습 과제

**과제: AWS 데이터 레이크 구축**

```
요구사항:
1. 스토리지 계층:
   - S3 버킷 (raw, processed, analytics)
   - 파티셔닝 전략 (year/month/day)
2. 메타데이터:
   - Glue Crawler 설정
   - Data Catalog 테이블
3. 분석:
   - Athena 쿼리 5개
   - 비용 최적화 (파티션 프루닝)
4. 데이터베이스:
   - RDS PostgreSQL 또는 DynamoDB
   - 애플리케이션 연동
5. 데이터 파이프라인:
   - S3 → Glue ETL → S3 (processed)

산출물:
- 아키텍처 다이어그램
- Glue Job 스크립트
- Athena 쿼리 모음
- 비용 추정
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| S3 구조 | 3계층 + 파티셔닝 | 20% |
| Data Catalog | 테이블 생성 완료 | 20% |
| Athena | 5개 쿼리 + 최적화 | 25% |
| DB 연동 | CRUD 동작 | 20% |
| ETL | Glue Job 실행 | 15% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 워크숍 | AWS Data Lake Workshop | https://catalog.workshops.aws/introduction-to-data-lake/ |
| 문서 | Athena Best Practices | https://docs.aws.amazon.com/athena/latest/ug/performance-tuning.html |

---

### Week 27: Docker & 컨테이너

#### 학습 목표
- [ ] Docker 이미지를 빌드하고 실행할 수 있다
- [ ] Docker Compose로 멀티 컨테이너를 관리할 수 있다
- [ ] ECR에 이미지를 저장하고 배포할 수 있다
- [ ] 컨테이너 모범 사례를 적용할 수 있다

#### 핵심 개념

**1. Docker 기초**
```dockerfile
# Dockerfile (Python 앱)
FROM python:3.11-slim

WORKDIR /app

# 의존성 먼저 (캐시 활용)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드
COPY . .

# 비root 사용자
RUN useradd -m appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# 빌드
docker build -t myapp:1.0 .

# 실행
docker run -d -p 8000:8000 --name myapp myapp:1.0

# 로그
docker logs -f myapp

# 접속
docker exec -it myapp /bin/bash

# 정리
docker stop myapp && docker rm myapp
```

**2. Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: ./app
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - db
      - redis
    volumes:
      - ./app:/app  # 개발용 마운트

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

```bash
# 시작
docker-compose up -d

# 로그
docker-compose logs -f web

# 재빌드
docker-compose up -d --build

# 종료
docker-compose down -v
```

**3. 멀티 스테이지 빌드**
```dockerfile
# 빌드 스테이지
FROM python:3.11 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /wheels -r requirements.txt

# 프로덕션 스테이지
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /wheels /wheels
RUN pip install --no-cache /wheels/*
COPY . .
CMD ["python", "main.py"]
```

**4. ECR (Elastic Container Registry)**
```bash
# ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | \
    docker login --username AWS --password-stdin 123456789.dkr.ecr.ap-northeast-2.amazonaws.com

# 레포지토리 생성
aws ecr create-repository --repository-name myapp

# 태깅 & 푸시
docker tag myapp:1.0 123456789.dkr.ecr.ap-northeast-2.amazonaws.com/myapp:1.0
docker push 123456789.dkr.ecr.ap-northeast-2.amazonaws.com/myapp:1.0
```

#### 실습 과제

**과제: 데이터 앱 컨테이너화**

```
애플리케이션: FastAPI + PostgreSQL + Redis

요구사항:
1. Dockerfile:
   - 멀티 스테이지 빌드
   - 비root 사용자
   - 헬스체크
2. docker-compose.yml:
   - 3개 서비스 (app, db, cache)
   - 볼륨 영구화
   - 환경 변수 분리 (.env)
3. ECR 배포:
   - 리포지토리 생성
   - CI용 푸시 스크립트
4. 최적화:
   - 이미지 크기 최소화 (<200MB)
   - 레이어 캐시 활용

산출물:
- Dockerfile
- docker-compose.yml
- .env.example
- 빌드/배포 스크립트
- 이미지 크기 비교 (before/after)
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| Dockerfile | 멀티 스테이지 + 보안 | 30% |
| Compose | 3서비스 동작 | 25% |
| ECR | 푸시 성공 | 20% |
| 최적화 | 200MB 이하 | 15% |
| 문서화 | README | 10% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 공식 | Docker Documentation | https://docs.docker.com/ |
| 모범사례 | Dockerfile Best Practices | https://docs.docker.com/develop/develop-images/dockerfile_best-practices/ |
| 영상 | Docker in 100 Seconds | https://www.youtube.com/watch?v=Gjnup-PuquQ |

---

### Week 28: Kubernetes 기초

#### 학습 목표
- [ ] Kubernetes 아키텍처를 이해할 수 있다
- [ ] Pod, Deployment, Service를 생성할 수 있다
- [ ] EKS 클러스터를 설정하고 운영할 수 있다
- [ ] Helm으로 애플리케이션을 배포할 수 있다

#### 핵심 개념

**1. Kubernetes 아키텍처**
```
Control Plane:
├── API Server: 모든 요청 처리
├── etcd: 클러스터 상태 저장
├── Scheduler: Pod 배치 결정
└── Controller Manager: 상태 관리

Worker Node:
├── kubelet: Pod 관리
├── kube-proxy: 네트워크
└── Container Runtime: Docker/containerd
```

**2. 핵심 리소스**
```yaml
# Pod
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
  - name: app
    image: myapp:1.0
    ports:
    - containerPort: 8000

# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:1.0
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "256Mi"
            cpu: "500m"

# Service
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: LoadBalancer
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8000
```

**3. kubectl 명령어**
```bash
# 리소스 조회
kubectl get pods
kubectl get deployments
kubectl get services

# 상세 정보
kubectl describe pod myapp-xxx

# 로그
kubectl logs -f myapp-xxx

# 접속
kubectl exec -it myapp-xxx -- /bin/bash

# 적용
kubectl apply -f deployment.yaml

# 스케일링
kubectl scale deployment myapp --replicas=5

# 롤아웃
kubectl rollout status deployment/myapp
kubectl rollout undo deployment/myapp
```

**4. EKS (Elastic Kubernetes Service)**
```bash
# eksctl로 클러스터 생성
eksctl create cluster \
    --name my-cluster \
    --region ap-northeast-2 \
    --nodegroup-name standard-workers \
    --node-type t3.medium \
    --nodes 3 \
    --nodes-min 1 \
    --nodes-max 5 \
    --managed

# kubeconfig 업데이트
aws eks update-kubeconfig --name my-cluster --region ap-northeast-2

# Fargate 프로필 (서버리스 노드)
eksctl create fargateprofile \
    --cluster my-cluster \
    --name fp-default \
    --namespace default
```

**5. Helm**
```bash
# 리포지토리 추가
helm repo add bitnami https://charts.bitnami.com/bitnami

# 차트 검색
helm search repo postgresql

# 설치
helm install my-postgres bitnami/postgresql \
    --set auth.postgresPassword=secret

# 커스텀 values
helm install my-app ./my-chart -f values.yaml

# 업그레이드
helm upgrade my-app ./my-chart -f values.yaml

# 목록
helm list

# 삭제
helm uninstall my-app
```

#### 실습 과제

**과제: EKS에 데이터 앱 배포**

```
요구사항:
1. EKS 클러스터 생성:
   - eksctl 또는 Terraform
   - 2-3 노드
2. 애플리케이션 배포:
   - Deployment (3 replicas)
   - Service (LoadBalancer)
   - ConfigMap, Secret
3. 데이터베이스:
   - Helm으로 PostgreSQL 설치
   - PersistentVolume 사용
4. 모니터링:
   - 기본 메트릭 확인
   - Pod 로그 수집
5. 오토스케일링:
   - HPA (Horizontal Pod Autoscaler) 설정

산출물:
- YAML 매니페스트
- Helm values 파일
- 배포 스크립트
- 아키텍처 다이어그램
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 클러스터 | EKS 동작 | 20% |
| 배포 | 앱 접속 가능 | 25% |
| DB | Helm + PV | 20% |
| 설정 | ConfigMap/Secret | 15% |
| 스케일링 | HPA 동작 | 20% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 공식 | Kubernetes Docs | https://kubernetes.io/docs/ |
| 코스 | EKS Workshop | https://www.eksworkshop.com/ |
| 영상 | Kubernetes Crash Course | https://www.youtube.com/watch?v=s_o8dwzRlu4 |

---

## Month 8: Infrastructure as Code & 운영

---

### Week 29: Terraform

#### 학습 목표
- [ ] Terraform으로 인프라를 코드로 관리할 수 있다
- [ ] 모듈을 활용하여 재사용 가능한 인프라를 구성할 수 있다
- [ ] 상태 파일을 원격으로 관리할 수 있다
- [ ] 워크스페이스로 환경을 분리할 수 있다

#### 핵심 개념

**1. Terraform 기초**
```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

# 변수
variable "region" {
  default = "ap-northeast-2"
}

variable "environment" {
  description = "Environment name"
  type        = string
}

# 리소스
resource "aws_s3_bucket" "data" {
  bucket = "${var.environment}-data-bucket"

  tags = {
    Environment = var.environment
  }
}

# 출력
output "bucket_arn" {
  value = aws_s3_bucket.data.arn
}
```

```bash
# 초기화
terraform init

# 계획
terraform plan -var="environment=dev"

# 적용
terraform apply -var="environment=dev"

# 삭제
terraform destroy
```

**2. 모듈**
```hcl
# modules/vpc/main.tf
variable "cidr_block" {}
variable "environment" {}

resource "aws_vpc" "main" {
  cidr_block = var.cidr_block
  tags = {
    Name = "${var.environment}-vpc"
  }
}

output "vpc_id" {
  value = aws_vpc.main.id
}

# 루트 모듈에서 사용
module "vpc" {
  source      = "./modules/vpc"
  cidr_block  = "10.0.0.0/16"
  environment = var.environment
}

module "vpc_prod" {
  source      = "./modules/vpc"
  cidr_block  = "10.1.0.0/16"
  environment = "prod"
}
```

**3. 원격 상태 관리**
```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "ap-northeast-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

**4. 워크스페이스**
```bash
# 워크스페이스 생성
terraform workspace new dev
terraform workspace new prod

# 전환
terraform workspace select dev

# 목록
terraform workspace list

# 코드에서 사용
resource "aws_instance" "web" {
  instance_type = terraform.workspace == "prod" ? "t3.large" : "t3.micro"
}
```

#### 실습 과제

**과제: Terraform으로 데이터 플랫폼 구축**

```
요구사항:
1. 인프라 구성:
   - VPC (Public/Private 서브넷)
   - RDS PostgreSQL
   - S3 버킷 (raw, processed)
   - IAM Role/Policy
2. 모듈화:
   - VPC 모듈
   - Database 모듈
   - Storage 모듈
3. 환경 분리:
   - dev / prod 워크스페이스
   - 환경별 tfvars
4. 원격 상태:
   - S3 + DynamoDB
5. CI/CD:
   - GitHub Actions 또는 GitLab CI
   - plan → apply 워크플로우

산출물:
- Terraform 코드 (모듈 구조)
- README (사용법)
- CI/CD 파이프라인
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 인프라 | 4개 리소스 | 25% |
| 모듈화 | 3개 모듈 | 25% |
| 환경 분리 | 2개 워크스페이스 | 20% |
| 원격 상태 | S3 백엔드 | 15% |
| CI/CD | 자동화 | 15% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 공식 | Terraform Tutorials | https://developer.hashicorp.com/terraform/tutorials |
| 레지스트리 | Terraform Registry | https://registry.terraform.io/ |
| 모범사례 | Terraform Best Practices | https://www.terraform-best-practices.com/ |

---

### Week 30: CI/CD 파이프라인

#### 학습 목표
- [ ] GitHub Actions로 CI/CD를 구축할 수 있다
- [ ] 테스트, 빌드, 배포를 자동화할 수 있다
- [ ] 환경별 배포 전략을 구현할 수 있다
- [ ] 롤백 메커니즘을 설계할 수 있다

#### 핵심 개념

**1. GitHub Actions 기초**
```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest

      - name: Run tests
        run: pytest tests/ -v

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Push to ECR
        run: |
          docker tag myapp:${{ github.sha }} ${{ secrets.ECR_REPO }}:${{ github.sha }}
          docker push ${{ secrets.ECR_REPO }}:${{ github.sha }}
```

**2. 배포 파이프라인**
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to EKS
        run: |
          aws eks update-kubeconfig --name ${{ secrets.CLUSTER_NAME }}
          kubectl set image deployment/myapp myapp=${{ secrets.ECR_REPO }}:${{ github.sha }}
          kubectl rollout status deployment/myapp

  deploy-prod:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.example.com
    steps:
      - name: Manual approval
        uses: trstringer/manual-approval@v1
        with:
          secret: ${{ github.TOKEN }}
          approvers: admin

      - name: Deploy to Production
        run: |
          # Production 배포 로직
```

**3. 배포 전략**
```yaml
# Kubernetes Rolling Update
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # 추가 Pod
      maxUnavailable: 0  # 최소 가용성

# Blue-Green (ArgoCD)
# 두 환경 유지, 트래픽 전환

# Canary (Flagger)
# 점진적 트래픽 증가
```

**4. 롤백**
```bash
# Kubernetes
kubectl rollout undo deployment/myapp

# 특정 버전으로
kubectl rollout undo deployment/myapp --to-revision=2

# GitHub Actions 롤백 Job
- name: Rollback on failure
  if: failure()
  run: |
    kubectl rollout undo deployment/myapp
```

#### 실습 과제

**과제: 완전 자동화 CI/CD 파이프라인**

```
요구사항:
1. CI 파이프라인:
   - 린트 (flake8, black)
   - 테스트 (pytest)
   - 보안 스캔 (trivy)
   - 빌드 & 푸시
2. CD 파이프라인:
   - Staging 자동 배포
   - Production 수동 승인
   - Slack 알림
3. 환경 관리:
   - GitHub Environments
   - Secrets 관리
4. 롤백:
   - 자동 롤백 (헬스체크 실패 시)
   - 수동 롤백 버튼

산출물:
- GitHub Actions 워크플로우
- 배포 스크립트
- 문서 (배포 가이드)
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| CI | 테스트 + 빌드 자동화 | 30% |
| CD | 2환경 배포 | 30% |
| 승인 | 수동 승인 게이트 | 15% |
| 롤백 | 롤백 메커니즘 | 15% |
| 알림 | Slack/Email | 10% |

---

### Week 31: 모니터링 & 로깅

#### 학습 목표
- [ ] CloudWatch로 AWS 리소스를 모니터링할 수 있다
- [ ] 커스텀 메트릭과 알람을 설정할 수 있다
- [ ] 중앙집중식 로깅을 구축할 수 있다
- [ ] 대시보드를 구성할 수 있다

#### 핵심 개념

**1. CloudWatch Metrics & Alarms**
```python
import boto3

cloudwatch = boto3.client('cloudwatch')

# 커스텀 메트릭 발행
cloudwatch.put_metric_data(
    Namespace='MyApp',
    MetricData=[
        {
            'MetricName': 'ProcessedRecords',
            'Value': 100,
            'Unit': 'Count',
            'Dimensions': [
                {'Name': 'Environment', 'Value': 'prod'}
            ]
        }
    ]
)

# 알람 생성
cloudwatch.put_metric_alarm(
    AlarmName='HighCPU',
    MetricName='CPUUtilization',
    Namespace='AWS/EC2',
    Statistic='Average',
    Period=300,
    EvaluationPeriods=2,
    Threshold=80,
    ComparisonOperator='GreaterThanThreshold',
    AlarmActions=['arn:aws:sns:ap-northeast-2:123:alerts']
)
```

**2. CloudWatch Logs**
```python
import logging
import watchtower

# CloudWatch Logs로 전송
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.addHandler(watchtower.CloudWatchLogHandler(
    log_group='my-app',
    stream_name='app-logs'
))

logger.info("Application started")
logger.error("An error occurred", extra={'error_code': 500})
```

**3. CloudWatch Insights**
```
# 로그 쿼리
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 100

# 집계
stats count(*) by bin(5m)
| filter @message like /ERROR/

# 패턴 분석
pattern @message
| filter @message like /Exception/
```

**4. Prometheus + Grafana (EKS)**
```yaml
# Prometheus 설치 (Helm)
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack

# ServiceMonitor
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: myapp-monitor
spec:
  selector:
    matchLabels:
      app: myapp
  endpoints:
  - port: metrics
    interval: 15s
```

#### 실습 과제

**과제: 통합 모니터링 시스템**

```
요구사항:
1. 메트릭 수집:
   - AWS 기본 메트릭
   - 커스텀 애플리케이션 메트릭
2. 알람:
   - CPU > 80%
   - 에러율 > 5%
   - 디스크 > 90%
3. 로깅:
   - 중앙집중식 수집
   - 검색 가능한 포맷
4. 대시보드:
   - CloudWatch 또는 Grafana
   - 주요 지표 시각화
5. 알림:
   - SNS → Slack/Email

산출물:
- 모니터링 설정 코드
- 대시보드 JSON
- 알람 정책 문서
- 운영 가이드
```

---

### Week 32: 클라우드 네이티브 프로젝트

#### 학습 목표
- [ ] E2E 클라우드 인프라를 독립적으로 구축할 수 있다
- [ ] 비용 최적화를 적용할 수 있다
- [ ] 보안 모범 사례를 준수할 수 있다
- [ ] 운영 문서를 작성할 수 있다

#### 프로젝트 개요

**포트폴리오 #4: 클라우드 네이티브 데이터 플랫폼**

```
아키텍처:

┌─────────────────────────────────────────────────────────────┐
│                         AWS Cloud                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                        VPC                           │    │
│  │  ┌──────────────┐    ┌──────────────┐               │    │
│  │  │  Public      │    │  Private     │               │    │
│  │  │  Subnet      │    │  Subnet      │               │    │
│  │  │ ┌──────────┐ │    │ ┌──────────┐ │               │    │
│  │  │ │   ALB    │ │    │ │   EKS    │ │               │    │
│  │  │ └──────────┘ │    │ │ Cluster  │ │               │    │
│  │  └──────────────┘    │ └──────────┘ │               │    │
│  │                      │ ┌──────────┐ │               │    │
│  │                      │ │   RDS    │ │               │    │
│  │                      │ └──────────┘ │               │    │
│  │                      └──────────────┘               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │     S3      │  │    Glue     │  │   Athena    │          │
│  │ Data Lake   │  │    ETL      │  │   Query     │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐                           │
│  │ CloudWatch  │  │    ECR      │                           │
│  │ Monitoring  │  │  Registry   │                           │
│  └─────────────┘  └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

#### 프로젝트 요구사항

| 구성 요소 | 요구사항 |
|----------|----------|
| **IaC** | Terraform으로 전체 인프라 코드화 |
| **네트워크** | VPC, 서브넷, 보안그룹, NAT |
| **컴퓨팅** | EKS 또는 ECS Fargate |
| **데이터** | RDS + S3 Data Lake |
| **배포** | GitHub Actions CI/CD |
| **모니터링** | CloudWatch + 알람 |
| **보안** | IAM, Secrets Manager, KMS |

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| **IaC** | Terraform 전체 구성 | 20% |
| **네트워크** | 보안 아키텍처 | 15% |
| **배포** | CI/CD 동작 | 20% |
| **모니터링** | 알람 + 대시보드 | 15% |
| **보안** | 최소 권한, 암호화 | 15% |
| **문서화** | README + 다이어그램 | 10% |
| **비용** | 예산 분석 | 5% |

#### 자격증 준비

**AWS Solutions Architect Associate (SAA-C03)**

| 도메인 | 가중치 | 핵심 토픽 |
|--------|--------|----------|
| 보안 아키텍처 | 30% | IAM, VPC, 암호화, Network Firewall |
| 복원력 아키텍처 | 26% | 고가용성, 재해복구, 백업 |
| 고성능 아키텍처 | 24% | 스케일링, 캐싱, 데이터베이스 |
| 비용 최적화 | 20% | 예약 인스턴스, Spot, 스토리지 티어 |

---

## Phase 4 완료 기준

### 필수 산출물
1. [ ] Week 25: AWS 기본 인프라
2. [ ] Week 26: 데이터 레이크
3. [ ] Week 27: Docker 컨테이너
4. [ ] Week 28: EKS 배포
5. [ ] Week 29: Terraform 인프라
6. [ ] Week 30: CI/CD 파이프라인
7. [ ] Week 31: 모니터링 시스템
8. [ ] **Week 32: 포트폴리오 #4 - 클라우드 플랫폼**

### 역량 체크리스트
- [ ] AWS 핵심 서비스를 설정하고 운영할 수 있다
- [ ] Docker/Kubernetes로 컨테이너 환경을 관리할 수 있다
- [ ] Terraform으로 인프라를 코드화할 수 있다
- [ ] CI/CD 파이프라인을 구축할 수 있다
- [ ] 모니터링과 알람을 설정할 수 있다

### 자격증 (선택)
- AWS Solutions Architect Associate: https://aws.amazon.com/certification/certified-solutions-architect-associate/

---

*Phase 4 완료 → Phase 5: GenAI & Agents로 이동*
