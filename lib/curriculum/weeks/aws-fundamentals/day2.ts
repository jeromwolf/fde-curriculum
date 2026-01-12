// Phase 4, Week 1, Day 2: EC2 & VPC
import type { Day } from '../../types'

export const day2: Day = {
  slug: 'ec2-vpc',
  title: 'EC2 & VPC',
  totalDuration: 180,
  tasks: [
    {
      id: 'ec2-basics-video',
      type: 'video',
      title: 'EC2 인스턴스 기초',
      duration: 30,
      content: {
        objectives: [
          'EC2의 핵심 개념을 이해한다',
          '인스턴스 유형과 가격 모델을 학습한다',
          'AMI와 스토리지 옵션을 파악한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=ec2-basics-placeholder',
        transcript: `
## EC2 (Elastic Compute Cloud)

### EC2란?

**가상 서버를 제공**하는 AWS의 핵심 컴퓨팅 서비스입니다.

\`\`\`
EC2 인스턴스 구성요소
├── AMI (Amazon Machine Image)  → 운영체제 + 소프트웨어
├── 인스턴스 유형              → CPU, 메모리, 네트워크
├── 스토리지                   → EBS, Instance Store
├── 보안 그룹                  → 방화벽 규칙
└── 키 페어                    → SSH 접속용
\`\`\`

### 인스턴스 유형

| 패밀리 | 용도 | 예시 |
|--------|------|------|
| **T** | 범용, 버스트 성능 | t3.micro, t3.medium |
| **M** | 범용, 균형 잡힌 | m6i.large, m6i.xlarge |
| **C** | 컴퓨팅 최적화 | c6i.large (CPU 집약) |
| **R** | 메모리 최적화 | r6i.large (인메모리 DB) |
| **P/G** | GPU 인스턴스 | p4d.24xlarge (ML 학습) |
| **I** | 스토리지 최적화 | i3.large (고성능 I/O) |

### 인스턴스 이름 규칙

\`\`\`
m6i.xlarge
│││  └── 크기: xlarge (4 vCPU, 16GB)
││└── 추가 기능: i (Intel)
│└── 세대: 6
└── 패밀리: m (범용)

크기: nano < micro < small < medium < large < xlarge < 2xlarge ...
\`\`\`

### 가격 모델

| 모델 | 특징 | 할인율 | 적합한 경우 |
|------|------|--------|-------------|
| **온디맨드** | 시간당 과금, 언제든 종료 | 0% | 단기, 예측 불가 |
| **예약 인스턴스** | 1-3년 약정 | 30-72% | 장기, 안정적 워크로드 |
| **Savings Plans** | 시간당 사용량 약정 | 30-72% | 유연한 장기 사용 |
| **스팟 인스턴스** | 미사용 용량 경매 | 최대 90% | 중단 가능 작업 |

### 스팟 인스턴스

\`\`\`python
# boto3로 스팟 인스턴스 요청
import boto3

ec2 = boto3.client('ec2')

response = ec2.request_spot_instances(
    InstanceCount=1,
    LaunchSpecification={
        'ImageId': 'ami-0c55b159cbfafe1f0',
        'InstanceType': 't3.large',
        'KeyName': 'my-key'
    },
    SpotPrice='0.05',  # 최대 지불 가격
    Type='one-time'
)
\`\`\`

### AMI (Amazon Machine Image)

\`\`\`
AMI 유형
├── AWS 제공 AMI      → Amazon Linux, Ubuntu, Windows
├── AWS Marketplace   → 서드파티 소프트웨어 포함
├── 커뮤니티 AMI      → 사용자 공유
└── 커스텀 AMI        → 직접 생성
\`\`\`

**커스텀 AMI 생성**:
\`\`\`bash
# 실행 중인 인스턴스에서 AMI 생성
aws ec2 create-image \\
    --instance-id i-1234567890abcdef0 \\
    --name "My Custom AMI" \\
    --no-reboot
\`\`\`
        `
      }
    },
    {
      id: 'vpc-basics-video',
      type: 'video',
      title: 'VPC 네트워킹 기초',
      duration: 35,
      content: {
        objectives: [
          'VPC의 핵심 구성요소를 이해한다',
          '서브넷, 라우팅 테이블을 학습한다',
          '인터넷 게이트웨이와 NAT를 파악한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=vpc-basics-placeholder',
        transcript: `
## VPC (Virtual Private Cloud)

### VPC란?

**AWS 내 격리된 가상 네트워크**입니다.

\`\`\`
VPC (10.0.0.0/16)
├── 퍼블릭 서브넷 (10.0.1.0/24)
│   ├── EC2 (웹 서버)
│   └── ALB (로드 밸런서)
│
├── 프라이빗 서브넷 (10.0.2.0/24)
│   ├── EC2 (애플리케이션 서버)
│   └── RDS (데이터베이스)
│
└── 인터넷 게이트웨이 (IGW)
\`\`\`

### CIDR 표기법

\`\`\`
10.0.0.0/16
│        └── 서브넷 마스크 (16비트 = 65,536 IP)
└── 네트워크 주소

예:
10.0.0.0/16  → 10.0.0.0 ~ 10.0.255.255 (65,536개)
10.0.1.0/24  → 10.0.1.0 ~ 10.0.1.255 (256개)
10.0.1.0/28  → 10.0.1.0 ~ 10.0.1.15 (16개)
\`\`\`

### 서브넷

| 유형 | 특징 | 용도 |
|------|------|------|
| **퍼블릭** | IGW로 인터넷 연결 | 웹 서버, 로드 밸런서 |
| **프라이빗** | 인터넷 직접 연결 없음 | DB, 애플리케이션 서버 |

### 라우팅 테이블

\`\`\`
퍼블릭 서브넷 라우팅 테이블:
| Destination    | Target          |
|----------------|-----------------|
| 10.0.0.0/16    | local           |
| 0.0.0.0/0      | igw-xxx (IGW)   |

프라이빗 서브넷 라우팅 테이블:
| Destination    | Target          |
|----------------|-----------------|
| 10.0.0.0/16    | local           |
| 0.0.0.0/0      | nat-xxx (NAT)   |
\`\`\`

### NAT Gateway

**프라이빗 서브넷에서 인터넷 아웃바운드 트래픽**을 허용합니다.

\`\`\`
프라이빗 EC2 → NAT Gateway → IGW → 인터넷
              (퍼블릭 서브넷)

- 아웃바운드: 허용 (소프트웨어 업데이트 등)
- 인바운드: 차단 (보안)
\`\`\`

### 보안 그룹 vs NACL

| 항목 | 보안 그룹 | NACL |
|------|----------|------|
| 레벨 | 인스턴스 | 서브넷 |
| 상태 | Stateful | Stateless |
| 규칙 | Allow만 | Allow + Deny |
| 기본 | 모든 아웃바운드 허용 | 모두 허용 |

### 보안 그룹 설정 예시

\`\`\`bash
# 웹 서버 보안 그룹
aws ec2 create-security-group \\
    --group-name WebServerSG \\
    --description "Web Server Security Group" \\
    --vpc-id vpc-xxx

# HTTP 허용
aws ec2 authorize-security-group-ingress \\
    --group-id sg-xxx \\
    --protocol tcp \\
    --port 80 \\
    --cidr 0.0.0.0/0

# HTTPS 허용
aws ec2 authorize-security-group-ingress \\
    --group-id sg-xxx \\
    --protocol tcp \\
    --port 443 \\
    --cidr 0.0.0.0/0
\`\`\`
        `
      }
    },
    {
      id: 'ec2-vpc-practice',
      type: 'code',
      title: 'EC2 & VPC 실습',
      duration: 60,
      content: {
        objectives: [
          'boto3로 VPC를 생성한다',
          'EC2 인스턴스를 프로비저닝한다',
          '보안 그룹을 설정한다'
        ],
        instructions: `
## 실습: VPC 및 EC2 인스턴스 생성

### 아키텍처

\`\`\`
VPC (10.0.0.0/16)
├── 퍼블릭 서브넷 (10.0.1.0/24, AZ-a)
│   └── EC2 웹 서버
├── 프라이빗 서브넷 (10.0.2.0/24, AZ-a)
│   └── EC2 앱 서버
└── 인터넷 게이트웨이
\`\`\`

### 과제

1. VPC 생성 (CIDR: 10.0.0.0/16)
2. 퍼블릭/프라이빗 서브넷 생성
3. 인터넷 게이트웨이 연결
4. 라우팅 테이블 설정
5. 보안 그룹 생성 (SSH, HTTP 허용)
6. EC2 인스턴스 시작
        `,
        starterCode: `import boto3

ec2 = boto3.client('ec2', region_name='ap-northeast-2')
ec2_resource = boto3.resource('ec2', region_name='ap-northeast-2')

# 1. VPC 생성
def create_vpc():
    """VPC 생성 (CIDR: 10.0.0.0/16)"""
    # TODO: 구현
    pass

# 2. 서브넷 생성
def create_subnets(vpc_id):
    """퍼블릭/프라이빗 서브넷 생성"""
    # TODO: 구현
    pass

# 3. 인터넷 게이트웨이 연결
def setup_internet_gateway(vpc_id):
    """IGW 생성 및 VPC 연결"""
    # TODO: 구현
    pass

# 4. 라우팅 테이블 설정
def setup_route_tables(vpc_id, public_subnet_id, igw_id):
    """퍼블릭 서브넷 라우팅 테이블 설정"""
    # TODO: 구현
    pass

# 5. 보안 그룹 생성
def create_security_group(vpc_id):
    """SSH, HTTP 허용 보안 그룹"""
    # TODO: 구현
    pass

# 6. EC2 인스턴스 시작
def launch_ec2(subnet_id, security_group_id):
    """t2.micro 인스턴스 시작"""
    # TODO: 구현
    pass

# 실행
if __name__ == "__main__":
    print("VPC 및 EC2 생성 시작...")
    # vpc_id = create_vpc()
    # ...
`,
        solutionCode: `import boto3
import time

ec2 = boto3.client('ec2', region_name='ap-northeast-2')
ec2_resource = boto3.resource('ec2', region_name='ap-northeast-2')

# 1. VPC 생성
def create_vpc():
    """VPC 생성 (CIDR: 10.0.0.0/16)"""
    response = ec2.create_vpc(
        CidrBlock='10.0.0.0/16',
        TagSpecifications=[{
            'ResourceType': 'vpc',
            'Tags': [{'Key': 'Name', 'Value': 'FDE-VPC'}]
        }]
    )
    vpc_id = response['Vpc']['VpcId']

    # DNS 호스트네임 활성화
    ec2.modify_vpc_attribute(VpcId=vpc_id, EnableDnsHostnames={'Value': True})

    print(f"VPC 생성 완료: {vpc_id}")
    return vpc_id

# 2. 서브넷 생성
def create_subnets(vpc_id):
    """퍼블릭/프라이빗 서브넷 생성"""
    # 퍼블릭 서브넷
    public = ec2.create_subnet(
        VpcId=vpc_id,
        CidrBlock='10.0.1.0/24',
        AvailabilityZone='ap-northeast-2a',
        TagSpecifications=[{
            'ResourceType': 'subnet',
            'Tags': [{'Key': 'Name', 'Value': 'FDE-Public-Subnet'}]
        }]
    )
    public_subnet_id = public['Subnet']['SubnetId']

    # 퍼블릭 IP 자동 할당
    ec2.modify_subnet_attribute(
        SubnetId=public_subnet_id,
        MapPublicIpOnLaunch={'Value': True}
    )

    # 프라이빗 서브넷
    private = ec2.create_subnet(
        VpcId=vpc_id,
        CidrBlock='10.0.2.0/24',
        AvailabilityZone='ap-northeast-2a',
        TagSpecifications=[{
            'ResourceType': 'subnet',
            'Tags': [{'Key': 'Name', 'Value': 'FDE-Private-Subnet'}]
        }]
    )
    private_subnet_id = private['Subnet']['SubnetId']

    print(f"서브넷 생성 완료: Public={public_subnet_id}, Private={private_subnet_id}")
    return public_subnet_id, private_subnet_id

# 3. 인터넷 게이트웨이 연결
def setup_internet_gateway(vpc_id):
    """IGW 생성 및 VPC 연결"""
    response = ec2.create_internet_gateway(
        TagSpecifications=[{
            'ResourceType': 'internet-gateway',
            'Tags': [{'Key': 'Name', 'Value': 'FDE-IGW'}]
        }]
    )
    igw_id = response['InternetGateway']['InternetGatewayId']

    # VPC에 연결
    ec2.attach_internet_gateway(InternetGatewayId=igw_id, VpcId=vpc_id)

    print(f"IGW 생성 및 연결 완료: {igw_id}")
    return igw_id

# 4. 라우팅 테이블 설정
def setup_route_tables(vpc_id, public_subnet_id, igw_id):
    """퍼블릭 서브넷 라우팅 테이블 설정"""
    # 라우팅 테이블 생성
    response = ec2.create_route_table(
        VpcId=vpc_id,
        TagSpecifications=[{
            'ResourceType': 'route-table',
            'Tags': [{'Key': 'Name', 'Value': 'FDE-Public-RT'}]
        }]
    )
    rt_id = response['RouteTable']['RouteTableId']

    # 인터넷 라우트 추가
    ec2.create_route(
        RouteTableId=rt_id,
        DestinationCidrBlock='0.0.0.0/0',
        GatewayId=igw_id
    )

    # 서브넷 연결
    ec2.associate_route_table(RouteTableId=rt_id, SubnetId=public_subnet_id)

    print(f"라우팅 테이블 설정 완료: {rt_id}")
    return rt_id

# 5. 보안 그룹 생성
def create_security_group(vpc_id):
    """SSH, HTTP 허용 보안 그룹"""
    response = ec2.create_security_group(
        GroupName='FDE-WebServer-SG',
        Description='Allow SSH and HTTP',
        VpcId=vpc_id,
        TagSpecifications=[{
            'ResourceType': 'security-group',
            'Tags': [{'Key': 'Name', 'Value': 'FDE-WebServer-SG'}]
        }]
    )
    sg_id = response['GroupId']

    # SSH 허용
    ec2.authorize_security_group_ingress(
        GroupId=sg_id,
        IpPermissions=[
            {
                'IpProtocol': 'tcp',
                'FromPort': 22,
                'ToPort': 22,
                'IpRanges': [{'CidrIp': '0.0.0.0/0', 'Description': 'SSH'}]
            },
            {
                'IpProtocol': 'tcp',
                'FromPort': 80,
                'ToPort': 80,
                'IpRanges': [{'CidrIp': '0.0.0.0/0', 'Description': 'HTTP'}]
            }
        ]
    )

    print(f"보안 그룹 생성 완료: {sg_id}")
    return sg_id

# 6. EC2 인스턴스 시작
def launch_ec2(subnet_id, security_group_id):
    """t2.micro 인스턴스 시작"""
    # Amazon Linux 2 AMI (서울 리전)
    ami_id = 'ami-0c55b159cbfafe1f0'  # 실제 AMI ID로 교체 필요

    instances = ec2_resource.create_instances(
        ImageId=ami_id,
        InstanceType='t2.micro',
        MinCount=1,
        MaxCount=1,
        SubnetId=subnet_id,
        SecurityGroupIds=[security_group_id],
        TagSpecifications=[{
            'ResourceType': 'instance',
            'Tags': [{'Key': 'Name', 'Value': 'FDE-WebServer'}]
        }],
        UserData='''#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Hello from FDE Academy!</h1>" > /var/www/html/index.html
'''
    )

    instance_id = instances[0].id
    print(f"EC2 인스턴스 시작: {instance_id}")

    # 인스턴스 실행 대기
    instances[0].wait_until_running()
    instances[0].reload()

    print(f"퍼블릭 IP: {instances[0].public_ip_address}")
    return instance_id

# 실행
if __name__ == "__main__":
    print("=== VPC 및 EC2 인프라 생성 ===")

    vpc_id = create_vpc()
    public_subnet_id, private_subnet_id = create_subnets(vpc_id)
    igw_id = setup_internet_gateway(vpc_id)
    setup_route_tables(vpc_id, public_subnet_id, igw_id)
    sg_id = create_security_group(vpc_id)
    launch_ec2(public_subnet_id, sg_id)

    print("\\n=== 완료 ===")
`
      }
    },
    {
      id: 'ec2-quiz',
      type: 'quiz',
      title: 'EC2 & VPC 퀴즈',
      duration: 15,
      content: {
        objectives: ['EC2와 VPC 개념을 복습한다'],
        questions: [
          {
            question: '비용 효율적인 배치 처리 작업에 가장 적합한 EC2 가격 모델은?',
            options: [
              '온디맨드 인스턴스',
              '예약 인스턴스',
              '스팟 인스턴스',
              'Dedicated Host'
            ],
            answer: 2,
            explanation: '스팟 인스턴스는 최대 90% 할인을 제공하며, 중단 가능한 배치 처리 작업에 적합합니다.'
          },
          {
            question: '프라이빗 서브넷의 EC2가 인터넷에서 소프트웨어를 다운로드하려면 무엇이 필요한가?',
            options: [
              '인터넷 게이트웨이',
              'NAT Gateway',
              'VPC Peering',
              'VPN Connection'
            ],
            answer: 1,
            explanation: 'NAT Gateway는 프라이빗 서브넷에서 아웃바운드 인터넷 접근을 허용합니다.'
          },
          {
            question: '보안 그룹과 NACL의 차이점 중 올바른 것은?',
            options: [
              '보안 그룹은 Stateless, NACL은 Stateful',
              '보안 그룹은 서브넷 레벨, NACL은 인스턴스 레벨',
              '보안 그룹은 Allow만, NACL은 Allow와 Deny 모두',
              '보안 그룹은 Deny만, NACL은 Allow만'
            ],
            answer: 2,
            explanation: '보안 그룹은 Allow 규칙만 지원하고, NACL은 Allow와 Deny 규칙 모두 지원합니다.'
          }
        ]
      }
    }
  ]
}
