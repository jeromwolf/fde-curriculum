// Phase 4, Week 2: Terraform 인프라 자동화
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'terraform-intro',
  title: 'Terraform 소개 & 설치',
  totalDuration: 180,
  tasks: [
    {
      id: 'iac-intro-video',
      type: 'video',
      title: 'Infrastructure as Code 개념',
      duration: 25,
      content: {
        objectives: ['IaC의 필요성을 이해한다', 'Terraform vs CloudFormation 비교', 'Terraform 설치 및 설정'],
        videoUrl: 'https://www.youtube.com/watch?v=iac-intro-placeholder',
        transcript: `
## Infrastructure as Code (IaC)

### 왜 IaC인가?

\`\`\`
수동 관리 (콘솔 클릭)           IaC (코드로 관리)
├── 재현 불가능                 ├── 버전 관리 (Git)
├── 문서화 어려움               ├── 코드 리뷰 가능
├── 환경 차이 발생              ├── 동일한 환경 보장
└── 실수 위험                  └── 자동화된 배포
\`\`\`

### Terraform vs 다른 도구

| 도구 | 언어 | 클라우드 | 특징 |
|------|------|----------|------|
| **Terraform** | HCL | 멀티 클라우드 | 선언적, 상태 관리 |
| CloudFormation | YAML/JSON | AWS 전용 | AWS 통합 |
| Pulumi | Python/TS | 멀티 클라우드 | 프로그래밍 언어 |
| CDK | Python/TS | AWS | CloudFormation 생성 |

### Terraform 설치

\`\`\`bash
# macOS
brew install terraform

# 버전 확인
terraform version
\`\`\`

### 핵심 개념

\`\`\`hcl
# Provider: 클라우드 플랫폼 연결
provider "aws" {
  region = "ap-northeast-2"
}

# Resource: 생성할 인프라
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
}

# Output: 결과 출력
output "instance_ip" {
  value = aws_instance.web.public_ip
}
\`\`\`
        `
      }
    },
    {
      id: 'terraform-basics-video',
      type: 'video',
      title: 'Terraform 기본 명령어',
      duration: 30,
      content: {
        objectives: ['init, plan, apply, destroy 이해', '상태 파일 관리', '변수와 출력 활용'],
        videoUrl: 'https://www.youtube.com/watch?v=terraform-basics-placeholder',
        transcript: `
## Terraform 워크플로우

### 기본 명령어

\`\`\`bash
# 1. 초기화 (Provider 다운로드)
terraform init

# 2. 계획 (변경 사항 미리보기)
terraform plan

# 3. 적용 (인프라 생성/수정)
terraform apply

# 4. 삭제 (인프라 제거)
terraform destroy
\`\`\`

### 상태 파일 (terraform.tfstate)

\`\`\`
상태 파일 역할:
├── 현재 인프라 상태 저장
├── 변경 사항 감지
├── 리소스 간 의존성 추적
└── 팀 협업 시 공유 필요
\`\`\`

**원격 상태 저장 (S3)**:
\`\`\`hcl
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "ap-northeast-2"
  }
}
\`\`\`

### 변수 (Variables)

\`\`\`hcl
# variables.tf
variable "instance_type" {
  description = "EC2 인스턴스 타입"
  type        = string
  default     = "t3.micro"
}

variable "environment" {
  type = string
}

# 사용
resource "aws_instance" "web" {
  instance_type = var.instance_type
  tags = {
    Environment = var.environment
  }
}
\`\`\`

### 변수 전달 방법

\`\`\`bash
# 1. CLI
terraform apply -var="environment=prod"

# 2. 파일 (terraform.tfvars)
environment = "prod"

# 3. 환경 변수
export TF_VAR_environment=prod
\`\`\`
        `
      }
    },
    {
      id: 'terraform-practice',
      type: 'code',
      title: '🎯 미션: Terraform으로 VPC 구축',
      duration: 60,
      content: {
        objectives: ['Terraform으로 VPC를 생성한다', '모듈화된 코드를 작성한다', '상태 파일을 관리한다'],
        instructions: `
## 미션: Terraform으로 VPC 인프라 구축

### 목표 아키텍처
\`\`\`
VPC (10.0.0.0/16)
├── 퍼블릭 서브넷 x2 (AZ-a, AZ-c)
├── 프라이빗 서브넷 x2
├── 인터넷 게이트웨이
├── NAT 게이트웨이
└── 라우팅 테이블
\`\`\`
        `,
        starterCode: `# main.tf
provider "aws" {
  region = "ap-northeast-2"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "fde-vpc"
  }
}

# TODO: 퍼블릭 서브넷 생성

# TODO: 프라이빗 서브넷 생성

# TODO: 인터넷 게이트웨이

# TODO: 라우팅 테이블
`,
        solutionCode: `# main.tf
provider "aws" {
  region = "ap-northeast-2"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "fde-vpc"
    Environment = var.environment
  }
}

# 퍼블릭 서브넷
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.\${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "fde-public-\${count.index + 1}"
  }
}

# 프라이빗 서브넷
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.\${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "fde-private-\${count.index + 1}"
  }
}

# 인터넷 게이트웨이
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "fde-igw"
  }
}

# NAT 게이트웨이용 EIP
resource "aws_eip" "nat" {
  domain = "vpc"
}

# NAT 게이트웨이
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "fde-nat"
  }
}

# 퍼블릭 라우팅 테이블
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "fde-public-rt"
  }
}

# 퍼블릭 서브넷 연결
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# 프라이빗 라우팅 테이블
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name = "fde-private-rt"
  }
}

# 프라이빗 서브넷 연결
resource "aws_route_table_association" "private" {
  count          = 2
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# 데이터 소스
data "aws_availability_zones" "available" {
  state = "available"
}

# 출력
output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}
`
      }
    },
    {
      id: 'terraform-quiz',
      type: 'quiz',
      title: 'Terraform 퀴즈',
      duration: 15,
      content: {
        objectives: ['Terraform 개념을 복습한다'],
        questions: [
          {
            question: 'terraform plan 명령어의 역할은?',
            options: ['인프라 생성', '변경 사항 미리보기', 'Provider 다운로드', '인프라 삭제'],
            answer: 1,
            explanation: 'terraform plan은 실제 변경 없이 어떤 리소스가 생성/수정/삭제될지 미리 보여줍니다.'
          },
          {
            question: 'terraform.tfstate 파일의 역할이 아닌 것은?',
            options: ['현재 인프라 상태 저장', '변경 사항 감지', 'Provider 설정 저장', '리소스 의존성 추적'],
            answer: 2,
            explanation: 'Provider 설정은 .tf 파일에 저장됩니다. tfstate는 실제 인프라 상태만 저장합니다.'
          }
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'terraform-modules',
  title: 'Terraform 모듈 & 워크스페이스',
  totalDuration: 180,
  tasks: [
    {
      id: 'modules-video',
      type: 'video',
      title: 'Terraform 모듈 설계',
      duration: 30,
      content: {
        objectives: ['모듈의 개념과 장점 이해', '재사용 가능한 모듈 작성', '모듈 레지스트리 활용'],
        videoUrl: 'https://www.youtube.com/watch?v=terraform-modules-placeholder',
        transcript: `
## Terraform 모듈

### 모듈이란?

**재사용 가능한 Terraform 코드 패키지**입니다.

\`\`\`
modules/
├── vpc/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── ec2/
└── rds/
\`\`\`

### 모듈 사용

\`\`\`hcl
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr     = "10.0.0.0/16"
  environment  = "prod"
}

# 모듈 출력 참조
resource "aws_instance" "web" {
  subnet_id = module.vpc.public_subnet_ids[0]
}
\`\`\`

### 공개 모듈 레지스트리

\`\`\`hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "my-vpc"
  cidr = "10.0.0.0/16"
}
\`\`\`
        `
      }
    },
    {
      id: 'workspaces-video',
      type: 'video',
      title: '환경 분리: 워크스페이스',
      duration: 25,
      content: {
        objectives: ['워크스페이스 개념 이해', 'dev/staging/prod 환경 분리', '환경별 변수 관리'],
        videoUrl: 'https://www.youtube.com/watch?v=workspaces-placeholder',
        transcript: `
## Terraform 워크스페이스

### 환경 분리 방법

\`\`\`
방법 1: 워크스페이스
├── 같은 코드, 다른 상태 파일
└── terraform workspace new dev

방법 2: 디렉토리 분리
├── environments/dev/
├── environments/staging/
└── environments/prod/
\`\`\`

### 워크스페이스 명령어

\`\`\`bash
# 워크스페이스 생성
terraform workspace new dev
terraform workspace new prod

# 워크스페이스 전환
terraform workspace select prod

# 현재 워크스페이스 확인
terraform workspace show

# 목록
terraform workspace list
\`\`\`

### 환경별 변수

\`\`\`hcl
locals {
  env_config = {
    dev = {
      instance_type = "t3.micro"
      min_size      = 1
    }
    prod = {
      instance_type = "t3.large"
      min_size      = 3
    }
  }
  config = local.env_config[terraform.workspace]
}

resource "aws_instance" "web" {
  instance_type = local.config.instance_type
}
\`\`\`
        `
      }
    },
    {
      id: 'modules-practice',
      type: 'code',
      title: 'VPC 모듈 작성 실습',
      duration: 50,
      content: {
        objectives: ['재사용 가능한 VPC 모듈 작성', '모듈 변수와 출력 정의', '여러 환경에 적용'],
        instructions: '재사용 가능한 VPC 모듈을 작성하고, dev와 prod 환경에 적용해보세요.',
        starterCode: `# modules/vpc/main.tf

variable "vpc_cidr" {
  type = string
}

variable "environment" {
  type = string
}

# TODO: VPC 리소스 정의
`,
        solutionCode: `# modules/vpc/main.tf

variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR 블록"
}

variable "environment" {
  type        = string
  description = "환경 (dev/prod)"
}

variable "public_subnet_count" {
  type    = number
  default = 2
}

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true

  tags = {
    Name        = "\${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  count                   = var.public_subnet_count
  vpc_id                  = aws_vpc.this.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  map_public_ip_on_launch = true

  tags = {
    Name = "\${var.environment}-public-\${count.index + 1}"
  }
}

output "vpc_id" {
  value = aws_vpc.this.id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

# 사용 예시 (main.tf)
# module "vpc_dev" {
#   source      = "./modules/vpc"
#   vpc_cidr    = "10.0.0.0/16"
#   environment = "dev"
# }
`
      }
    }
  ]
}

const day3: Day = {
  slug: 'terraform-state',
  title: '상태 관리 & 팀 협업',
  totalDuration: 180,
  tasks: [
    {
      id: 'remote-state-video',
      type: 'video',
      title: '원격 상태 관리',
      duration: 30,
      content: {
        objectives: ['원격 백엔드 설정', '상태 잠금 (State Locking)', 'S3 + DynamoDB 구성'],
        videoUrl: 'https://www.youtube.com/watch?v=remote-state-placeholder',
        transcript: `
## 원격 상태 관리

### 로컬 vs 원격 상태

\`\`\`
로컬 상태                     원격 상태 (S3)
├── 단일 개발자               ├── 팀 협업 가능
├── 상태 파일 분실 위험        ├── 버전 관리
├── 동시 수정 위험            ├── 상태 잠금
└── Git 커밋 금지!            └── 암호화 지원
\`\`\`

### S3 + DynamoDB 백엔드

\`\`\`hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "ap-northeast-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
\`\`\`

### 상태 잠금

\`\`\`
개발자 A: terraform apply 시작
          → DynamoDB에 잠금 레코드 생성
          → 완료 후 잠금 해제

개발자 B: terraform apply 시도
          → "Error: state is locked"
          → 대기 또는 force-unlock
\`\`\`
        `
      }
    },
    {
      id: 'team-workflow-video',
      type: 'video',
      title: '팀 협업 워크플로우',
      duration: 25,
      content: {
        objectives: ['PR 기반 인프라 변경', 'Atlantis/Terraform Cloud', 'CI/CD 통합'],
        videoUrl: 'https://www.youtube.com/watch?v=team-workflow-placeholder',
        transcript: `
## 팀 협업 워크플로우

### GitOps 패턴

\`\`\`
1. 브랜치 생성: feature/add-rds
2. 코드 수정 & 커밋
3. PR 생성
4. CI: terraform plan (자동)
5. 코드 리뷰
6. Merge
7. CD: terraform apply (자동)
\`\`\`

### Terraform Cloud

- 원격 상태 관리 (무료)
- 원격 실행
- 정책 적용 (Sentinel)
- 비용 추정

### GitHub Actions 예시

\`\`\`yaml
name: Terraform
on:
  pull_request:
    paths: ['terraform/**']

jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: hashicorp/setup-terraform@v2
      - run: terraform init
      - run: terraform plan
\`\`\`
        `
      }
    }
  ]
}

const day4: Day = {
  slug: 'terraform-advanced',
  title: 'Terraform 고급 패턴',
  totalDuration: 180,
  tasks: [
    {
      id: 'advanced-patterns-video',
      type: 'video',
      title: '고급 패턴: for_each, dynamic, count',
      duration: 35,
      content: {
        objectives: ['반복문 활용', 'Dynamic 블록', '조건부 리소스'],
        videoUrl: 'https://www.youtube.com/watch?v=advanced-patterns-placeholder',
        transcript: `
## Terraform 고급 패턴

### for_each vs count

\`\`\`hcl
# count: 인덱스 기반 (삭제 시 문제)
resource "aws_subnet" "public" {
  count = 3
  cidr_block = "10.0.\${count.index}.0/24"
}

# for_each: 키 기반 (권장)
resource "aws_subnet" "public" {
  for_each = toset(["a", "b", "c"])
  cidr_block = "10.0.\${each.key}.0/24"
  availability_zone = "\${var.region}\${each.value}"
}
\`\`\`

### Dynamic 블록

\`\`\`hcl
variable "ingress_rules" {
  default = [
    { port = 80, cidr = "0.0.0.0/0" },
    { port = 443, cidr = "0.0.0.0/0" }
  ]
}

resource "aws_security_group" "web" {
  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      cidr_blocks = [ingress.value.cidr]
    }
  }
}
\`\`\`

### 조건부 리소스

\`\`\`hcl
resource "aws_nat_gateway" "main" {
  count = var.environment == "prod" ? 1 : 0
  # prod에서만 NAT Gateway 생성
}
\`\`\`
        `
      }
    },
    {
      id: 'data-sources-video',
      type: 'video',
      title: 'Data Sources & Provisioners',
      duration: 25,
      content: {
        objectives: ['데이터 소스 활용', 'Provisioner 사용 (주의점)', 'null_resource'],
        videoUrl: 'https://www.youtube.com/watch?v=data-sources-placeholder',
        transcript: `
## Data Sources

### 데이터 소스란?

**기존 리소스 정보를 조회**합니다.

\`\`\`hcl
# 최신 AMI 조회
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "web" {
  ami = data.aws_ami.amazon_linux.id
}
\`\`\`

### Provisioner (주의!)

\`\`\`hcl
# 권장하지 않음 - User Data 또는 Ansible 사용 권장
resource "aws_instance" "web" {
  # ...

  provisioner "remote-exec" {
    inline = ["sudo yum install -y httpd"]
  }
}
\`\`\`

**대안**:
- User Data 스크립트
- Ansible, Chef, Puppet
- Packer로 AMI 미리 빌드
        `
      }
    }
  ]
}

const day5: Day = {
  slug: 'terraform-project',
  title: '🏆 Week 2 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'week2-challenge',
      type: 'challenge',
      title: '완전한 AWS 인프라 IaC 구축',
      duration: 120,
      content: {
        objectives: ['프로덕션급 Terraform 코드 작성', '모듈화 및 환경 분리', 'CI/CD 파이프라인 구성'],
        requirements: [
          'VPC 모듈 (퍼블릭/프라이빗 서브넷)',
          'EC2 모듈 (ASG + ALB)',
          'RDS 모듈 (MySQL)',
          'S3 원격 상태 + DynamoDB 잠금',
          'dev/prod 환경 분리',
          'GitHub Actions CI/CD'
        ],
        evaluationCriteria: ['코드 구조 및 모듈화 (30%)', '보안 설정 (25%)', '환경 분리 (25%)', '문서화 (20%)'],
        bonusPoints: ['Terragrunt 적용', 'Checkov 보안 스캔', 'Terraform Cloud 연동']
      }
    }
  ]
}

export const terraformWeek: Week = {
  slug: 'terraform',
  week: 2,
  phase: 4,
  month: 7,
  access: 'pro',
  title: 'Terraform 인프라 자동화',
  topics: ['IaC', 'HCL', '모듈', '워크스페이스', '상태 관리', 'GitOps'],
  practice: 'AWS 인프라 IaC 구축',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
