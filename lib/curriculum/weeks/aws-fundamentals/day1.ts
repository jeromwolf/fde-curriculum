// Phase 4, Week 1, Day 1: AWS 소개 & IAM
import type { Day } from '../../types'

export const day1: Day = {
  slug: 'aws-intro-iam',
  title: 'AWS 소개 & IAM',
  totalDuration: 180,
  tasks: [
    {
      id: 'aws-intro-video',
      type: 'video',
      title: 'AWS 클라우드 소개',
      duration: 25,
      content: {
        objectives: [
          'AWS의 핵심 개념과 장점을 이해한다',
          '주요 AWS 서비스를 파악한다',
          '클라우드 컴퓨팅의 이점을 학습한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=aws-intro-placeholder',
        transcript: `
## AWS 클라우드 소개

### 클라우드 컴퓨팅이란?

**인터넷을 통해 IT 리소스를 온디맨드로 제공**하는 서비스입니다.

\`\`\`
온프레미스 (기존)          클라우드 (AWS)
├── 서버 구매              ├── 즉시 프로비저닝
├── 데이터센터 운영         ├── 사용한 만큼 지불
├── 용량 예측 필요          ├── 탄력적 확장/축소
└── 초기 투자 비용          └── 운영 비용 모델
\`\`\`

### AWS의 장점

| 장점 | 설명 |
|------|------|
| **탄력성** | 트래픽에 따라 자동 확장/축소 |
| **비용 효율** | 사용한 만큼만 지불 (Pay-as-you-go) |
| **글로벌 인프라** | 전 세계 30+ 리전, 100+ 엣지 로케이션 |
| **보안** | 규정 준수, 암호화, IAM |
| **혁신 속도** | 수천 개의 서비스 & 기능 |

### AWS 글로벌 인프라

\`\`\`
리전 (Region)
├── 가용 영역 (AZ) A
│   ├── 데이터센터 1
│   └── 데이터센터 2
├── 가용 영역 (AZ) B
└── 가용 영역 (AZ) C

예: ap-northeast-2 (서울)
    ├── ap-northeast-2a
    ├── ap-northeast-2b
    └── ap-northeast-2c
\`\`\`

### 핵심 서비스 카테고리

| 카테고리 | 주요 서비스 | 용도 |
|----------|-------------|------|
| **컴퓨팅** | EC2, Lambda, ECS | 서버, 서버리스, 컨테이너 |
| **스토리지** | S3, EBS, EFS | 객체, 블록, 파일 스토리지 |
| **데이터베이스** | RDS, DynamoDB, Redshift | 관계형, NoSQL, 데이터웨어하우스 |
| **네트워킹** | VPC, Route 53, CloudFront | 가상 네트워크, DNS, CDN |
| **보안** | IAM, KMS, WAF | 접근 제어, 암호화, 방화벽 |
| **ML/AI** | SageMaker, Bedrock | ML 학습/배포, 생성형 AI |

### AWS Free Tier

신규 가입 후 12개월간 무료로 사용 가능:

| 서비스 | 무료 한도 |
|--------|----------|
| EC2 | t2.micro 750시간/월 |
| S3 | 5GB 스토리지 |
| RDS | db.t2.micro 750시간/월 |
| Lambda | 100만 요청/월 |
| DynamoDB | 25GB 스토리지 |
        `
      }
    },
    {
      id: 'iam-basics-video',
      type: 'video',
      title: 'IAM 기초: 사용자, 그룹, 역할',
      duration: 30,
      content: {
        objectives: [
          'IAM의 핵심 개념을 이해한다',
          '사용자, 그룹, 역할의 차이를 파악한다',
          '최소 권한 원칙을 학습한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=iam-basics-placeholder',
        transcript: `
## IAM (Identity and Access Management)

### IAM이란?

**AWS 리소스에 대한 접근을 안전하게 관리**하는 서비스입니다.

\`\`\`
"누가(Who) 무엇을(What) 할 수 있는가(Can do)?"
\`\`\`

### IAM 핵심 구성요소

| 구성요소 | 설명 | 예시 |
|----------|------|------|
| **사용자 (User)** | AWS에 접근하는 개인/애플리케이션 | 개발자, CI/CD 파이프라인 |
| **그룹 (Group)** | 사용자의 집합 | Developers, Admins |
| **역할 (Role)** | 임시 권한 부여 | EC2에서 S3 접근 |
| **정책 (Policy)** | 권한 정의 JSON 문서 | S3 읽기 권한 |

### IAM 사용자 vs 역할

\`\`\`
IAM 사용자 (User)              IAM 역할 (Role)
├── 장기 자격 증명              ├── 임시 자격 증명
├── Access Key 발급            ├── AssumeRole로 전환
├── 사람 또는 애플리케이션       ├── AWS 서비스, 외부 계정
└── 콘솔 로그인 가능            └── 콘솔 로그인 불가
\`\`\`

### IAM 정책 구조

\`\`\`json
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
    }
  ]
}
\`\`\`

| 요소 | 설명 |
|------|------|
| Effect | Allow 또는 Deny |
| Action | 허용/거부할 API 작업 |
| Resource | 대상 리소스 ARN |
| Condition | 조건 (선택) |

### 최소 권한 원칙 (Least Privilege)

**필요한 최소한의 권한만 부여**합니다.

\`\`\`
❌ 나쁜 예:
{
  "Effect": "Allow",
  "Action": "*",
  "Resource": "*"
}

✅ 좋은 예:
{
  "Effect": "Allow",
  "Action": ["s3:GetObject"],
  "Resource": "arn:aws:s3:::my-bucket/reports/*"
}
\`\`\`

### IAM 모범 사례

1. **루트 계정 사용 금지**: MFA 설정 후 잠금
2. **개별 사용자 생성**: 공유 계정 금지
3. **그룹으로 권한 관리**: 사용자별 정책 대신
4. **MFA 활성화**: 모든 사용자에게 필수
5. **Access Key 주기적 교체**: 90일 주기 권장
6. **IAM Access Analyzer**: 외부 접근 감사
        `
      }
    },
    {
      id: 'iam-policy-practice',
      type: 'code',
      title: 'IAM 정책 작성 실습',
      duration: 45,
      content: {
        objectives: [
          'IAM 정책 JSON을 직접 작성한다',
          '다양한 권한 시나리오를 구현한다',
          'AWS Policy Simulator를 사용한다'
        ],
        instructions: `
## 실습: IAM 정책 작성

### 시나리오

데이터 엔지니어링 팀을 위한 IAM 정책을 작성합니다.

### 요구사항

1. **S3 버킷 접근 정책**
   - \`data-lake-raw\` 버킷: 읽기/쓰기
   - \`data-lake-processed\` 버킷: 읽기만

2. **EC2 관리 정책**
   - \`Development\` 태그가 있는 인스턴스만 시작/중지

3. **CloudWatch 로그 정책**
   - 모든 로그 그룹 읽기
   - \`/aws/lambda/data-*\` 로그만 쓰기

### AWS CLI 설정

\`\`\`bash
# AWS CLI 설치 확인
aws --version

# 자격 증명 설정
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: ap-northeast-2
# Default output format: json
\`\`\`
        `,
        starterCode: `# IAM 정책 작성 실습
# 각 시나리오에 맞는 정책을 JSON으로 작성하세요

# 1. S3 버킷 접근 정책
s3_policy = {
    "Version": "2012-10-17",
    "Statement": [
        # TODO: data-lake-raw 버킷 읽기/쓰기 권한

        # TODO: data-lake-processed 버킷 읽기 권한
    ]
}

# 2. EC2 관리 정책 (태그 기반)
ec2_policy = {
    "Version": "2012-10-17",
    "Statement": [
        # TODO: Development 태그 인스턴스만 시작/중지
    ]
}

# 3. CloudWatch 로그 정책
cloudwatch_policy = {
    "Version": "2012-10-17",
    "Statement": [
        # TODO: 모든 로그 그룹 읽기

        # TODO: /aws/lambda/data-* 로그만 쓰기
    ]
}

# 정책 출력
import json
print("=== S3 정책 ===")
print(json.dumps(s3_policy, indent=2))
print("\\n=== EC2 정책 ===")
print(json.dumps(ec2_policy, indent=2))
print("\\n=== CloudWatch 정책 ===")
print(json.dumps(cloudwatch_policy, indent=2))
`,
        solutionCode: `# IAM 정책 작성 실습 - 정답
import json

# 1. S3 버킷 접근 정책
s3_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DataLakeRawReadWrite",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::data-lake-raw",
                "arn:aws:s3:::data-lake-raw/*"
            ]
        },
        {
            "Sid": "DataLakeProcessedReadOnly",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::data-lake-processed",
                "arn:aws:s3:::data-lake-processed/*"
            ]
        }
    ]
}

# 2. EC2 관리 정책 (태그 기반)
ec2_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "EC2DescribeAll",
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeTags"
            ],
            "Resource": "*"
        },
        {
            "Sid": "EC2ManageDevelopment",
            "Effect": "Allow",
            "Action": [
                "ec2:StartInstances",
                "ec2:StopInstances",
                "ec2:RebootInstances"
            ],
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "ec2:ResourceTag/Environment": "Development"
                }
            }
        }
    ]
}

# 3. CloudWatch 로그 정책
cloudwatch_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CloudWatchLogsReadAll",
            "Effect": "Allow",
            "Action": [
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:GetLogEvents",
                "logs:FilterLogEvents"
            ],
            "Resource": "*"
        },
        {
            "Sid": "CloudWatchLogsWriteDataLambda",
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:log-group:/aws/lambda/data-*:*"
        }
    ]
}

# 정책 출력
print("=== S3 정책 ===")
print(json.dumps(s3_policy, indent=2))
print("\\n=== EC2 정책 ===")
print(json.dumps(ec2_policy, indent=2))
print("\\n=== CloudWatch 정책 ===")
print(json.dumps(cloudwatch_policy, indent=2))

# AWS CLI로 정책 생성 (실제 환경에서)
# aws iam create-policy --policy-name DataEngineerS3 --policy-document file://s3_policy.json
# aws iam create-policy --policy-name DataEngineerEC2 --policy-document file://ec2_policy.json
# aws iam create-policy --policy-name DataEngineerCloudWatch --policy-document file://cloudwatch_policy.json
`
      }
    },
    {
      id: 'iam-quiz',
      type: 'quiz',
      title: 'IAM 개념 확인 퀴즈',
      duration: 15,
      content: {
        objectives: [
          'IAM 핵심 개념을 복습한다',
          '보안 모범 사례를 확인한다'
        ],
        questions: [
          {
            question: 'IAM 역할(Role)과 사용자(User)의 가장 큰 차이점은?',
            options: [
              '역할은 임시 자격 증명을 사용하고, 사용자는 장기 자격 증명을 사용한다',
              '역할은 콘솔 로그인이 가능하고, 사용자는 불가능하다',
              '역할은 정책을 연결할 수 없다',
              '사용자는 AWS 서비스가 사용할 수 없다'
            ],
            answer: 0,
            explanation: 'IAM 역할은 AssumeRole을 통해 임시 자격 증명을 발급받아 사용합니다. 반면 사용자는 Access Key와 같은 장기 자격 증명을 사용합니다.'
          },
          {
            question: '최소 권한 원칙(Least Privilege)에 맞는 정책은?',
            options: [
              'Action: "*", Resource: "*"',
              'Action: "s3:*", Resource: "*"',
              'Action: "s3:GetObject", Resource: "arn:aws:s3:::my-bucket/*"',
              'Action: ["s3:*", "ec2:*"], Resource: "*"'
            ],
            answer: 2,
            explanation: '최소 권한 원칙은 필요한 작업(GetObject)과 필요한 리소스(특정 버킷)만 허용하는 것입니다.'
          },
          {
            question: 'EC2 인스턴스가 S3 버킷에 접근해야 할 때 권장되는 방법은?',
            options: [
              'EC2에 Access Key를 환경 변수로 설정',
              'EC2에 IAM 역할을 연결',
              'S3 버킷을 퍼블릭으로 설정',
              'EC2에 루트 계정 자격 증명 저장'
            ],
            answer: 1,
            explanation: 'EC2에 IAM 역할을 연결하면 임시 자격 증명이 자동으로 제공되며, Access Key 관리가 필요 없어 보안적으로 안전합니다.'
          },
          {
            question: 'IAM 정책에서 명시적 Deny가 명시적 Allow보다 우선하는 이유는?',
            options: [
              '보안을 위해 거부가 항상 우선',
              'Allow가 먼저 평가되기 때문',
              'Deny 정책이 더 구체적이기 때문',
              'AWS 내부 최적화 때문'
            ],
            answer: 0,
            explanation: 'AWS는 보안을 위해 명시적 Deny를 항상 우선합니다. 여러 정책이 충돌할 때 Deny가 있으면 접근이 거부됩니다.'
          }
        ]
      }
    },
    {
      id: 'aws-cli-reading',
      type: 'reading',
      title: 'AWS CLI & SDK 설정',
      duration: 20,
      content: {
        objectives: [
          'AWS CLI를 설치하고 설정한다',
          'boto3 SDK 사용법을 익힌다',
          '자격 증명 관리 방법을 학습한다'
        ],
        markdown: `
## AWS CLI & SDK 설정

### AWS CLI 설치

**macOS (Homebrew)**:
\`\`\`bash
brew install awscli
\`\`\`

**Linux**:
\`\`\`bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
\`\`\`

**Windows**:
\`\`\`powershell
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
\`\`\`

### AWS CLI 설정

\`\`\`bash
# 기본 설정
aws configure

# 프로필 설정 (여러 계정 관리)
aws configure --profile dev
aws configure --profile prod

# 프로필 사용
aws s3 ls --profile dev
\`\`\`

### boto3 (Python SDK)

\`\`\`bash
pip install boto3
\`\`\`

\`\`\`python
import boto3

# 기본 클라이언트
s3 = boto3.client('s3')

# 프로필 지정
session = boto3.Session(profile_name='dev')
s3 = session.client('s3')

# 리전 지정
s3 = boto3.client('s3', region_name='ap-northeast-2')
\`\`\`

### 자격 증명 우선순위

1. 코드 내 명시적 지정 (권장하지 않음)
2. 환경 변수 (\`AWS_ACCESS_KEY_ID\`, \`AWS_SECRET_ACCESS_KEY\`)
3. AWS CLI 설정 파일 (\`~/.aws/credentials\`)
4. IAM 역할 (EC2, Lambda 등)

### 보안 모범 사례

\`\`\`python
# ❌ 나쁜 예: 하드코딩
s3 = boto3.client(
    's3',
    aws_access_key_id='AKIAIOSFODNN7EXAMPLE',
    aws_secret_access_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
)

# ✅ 좋은 예: 환경 변수 또는 IAM 역할 사용
s3 = boto3.client('s3')  # 자동으로 자격 증명 찾음
\`\`\`
        `,
        externalLinks: [
          { title: 'AWS CLI 공식 문서', url: 'https://docs.aws.amazon.com/cli/' },
          { title: 'boto3 공식 문서', url: 'https://boto3.amazonaws.com/v1/documentation/api/latest/index.html' }
        ]
      }
    }
  ]
}
