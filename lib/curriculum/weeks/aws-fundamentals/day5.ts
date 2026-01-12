// Phase 4, Week 1, Day 5: RDS & 데이터베이스
import type { Day } from '../../types'

export const day5: Day = {
  slug: 'rds-database',
  title: 'RDS & 데이터베이스',
  totalDuration: 180,
  tasks: [
    {
      id: 'rds-intro-video',
      type: 'video',
      title: '🎮 시나리오: 데이터베이스 선택 게임',
      duration: 30,
      content: {
        objectives: [
          'RDS의 핵심 기능을 이해한다',
          '다양한 DB 엔진을 비교한다',
          'Multi-AZ와 Read Replica를 학습한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=rds-intro-placeholder',
        transcript: `
## 🎮 데이터베이스 선택 게임

### 시나리오 1: 전통적인 웹 애플리케이션

> "사용자 정보, 주문, 결제 데이터를 저장해야 합니다.
> 트랜잭션 보장이 중요하고, JOIN 쿼리가 많습니다."

**정답**: RDS (MySQL/PostgreSQL) ✅

### 시나리오 2: 실시간 세션 스토어

> "밀리초 단위 응답이 필요한 세션/캐시 데이터입니다.
> 키-값 조회가 대부분입니다."

**정답**: ElastiCache (Redis) ✅

### 시나리오 3: IoT 센서 데이터

> "초당 수백만 건의 센서 데이터를 저장합니다.
> 시계열 쿼리가 많고, 스키마가 자주 변경됩니다."

**정답**: DynamoDB 또는 Timestream ✅

---

## RDS (Relational Database Service)

### RDS란?

**관리형 관계형 데이터베이스 서비스**입니다.

\`\`\`
자체 관리 (EC2 + DB)              RDS 관리형
├── OS 설치/패치       ───→    ├── 자동화
├── DB 설치/업그레이드  ───→    ├── 자동화
├── 백업 관리          ───→    ├── 자동 백업
├── 고가용성 구성       ───→    ├── Multi-AZ
├── 모니터링 설정       ───→    ├── CloudWatch 통합
└── 보안 패치          ───→    └── 자동화
\`\`\`

### 지원 엔진

| 엔진 | 특징 | 적합한 경우 |
|------|------|-------------|
| **MySQL** | 범용, 오픈소스 | 웹 애플리케이션 |
| **PostgreSQL** | 고급 기능, JSONB | 복잡한 쿼리, GIS |
| **MariaDB** | MySQL 포크 | MySQL 대안 |
| **Oracle** | 엔터프라이즈 | 레거시 시스템 |
| **SQL Server** | Microsoft 생태계 | .NET 애플리케이션 |
| **Aurora** | AWS 최적화 | 고성능, 확장성 |

### 💰 비용 비교 (db.t3.medium, 서울 리전)

| 엔진 | 시간당 비용 | 월간 비용 |
|------|------------|----------|
| MySQL | $0.068 | ~$50 |
| PostgreSQL | $0.068 | ~$50 |
| Aurora MySQL | $0.117 | ~$85 |
| Aurora PostgreSQL | $0.117 | ~$85 |

### Multi-AZ 배포

\`\`\`
Primary (AZ-a)          Standby (AZ-b)
    │                       │
    └── 동기식 복제 ────────┘

장애 발생 시:
1. 자동 장애 조치 (60-120초)
2. DNS 엔드포인트 자동 전환
3. 애플리케이션 변경 불필요
\`\`\`

### Read Replica

\`\`\`
쓰기 요청 → Primary ──────────→ Read Replica 1
              │                      ↑
              └── 비동기 복제 ──→ Read Replica 2
                                     ↑
읽기 요청 → ─────────────────────────┘
\`\`\`

**사용 사례**:
- 읽기 트래픽 분산
- 리포팅/분석 쿼리 분리
- 지리적 분산 (리전 간 복제)

### Aurora 특징

\`\`\`
Aurora 아키텍처
├── 컴퓨팅: Primary + 최대 15개 Read Replica
│
└── 스토리지: 분산 스토리지 (6개 복사본, 3개 AZ)
              │
              └── 자동 확장 (10GB ~ 128TB)
\`\`\`

**장점**:
- MySQL 대비 5배, PostgreSQL 대비 3배 성능
- 자동 장애 조치 30초 미만
- 스토리지 자동 확장
- Serverless 옵션 (Aurora Serverless v2)
        `
      }
    },
    {
      id: 'dynamodb-video',
      type: 'video',
      title: 'DynamoDB: NoSQL의 힘',
      duration: 25,
      content: {
        objectives: [
          'DynamoDB의 핵심 개념을 이해한다',
          '파티션 키와 정렬 키를 학습한다',
          '용량 모드와 인덱스를 파악한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=dynamodb-placeholder',
        transcript: `
## DynamoDB

### DynamoDB란?

**완전 관리형 NoSQL 데이터베이스**입니다.

\`\`\`
특징
├── 밀리초 단위 응답 (단일 자릿수)
├── 무한 확장 (페타바이트)
├── 자동 파티셔닝
├── 서버리스 (관리 불필요)
└── 글로벌 테이블 (다중 리전)
\`\`\`

### 데이터 모델

\`\`\`
테이블: Users
├── 파티션 키 (PK): user_id      → 데이터 분산
├── 정렬 키 (SK): created_at    → 파티션 내 정렬 (선택)
└── 속성: name, email, age ...  → 스키마리스
\`\`\`

| 키 유형 | 설명 | 예시 |
|---------|------|------|
| 파티션 키만 | 단일 항목 조회 | user_id |
| 파티션 + 정렬 | 범위 쿼리 가능 | user_id + order_date |

### 용량 모드

\`\`\`
온디맨드 모드                    프로비저닝 모드
├── 자동 확장                   ├── WCU/RCU 지정
├── 요청당 과금                  ├── 시간당 과금
├── 예측 불가 트래픽              ├── 예측 가능 트래픽
└── $1.25/100만 WCU             └── $0.00065/WCU-시간
\`\`\`

### 인덱스

**GSI (Global Secondary Index)**:
\`\`\`
기본: PK=user_id, SK=order_date
GSI: PK=status, SK=order_date

→ status로 쿼리 가능!
\`\`\`

**LSI (Local Secondary Index)**:
\`\`\`
기본: PK=user_id, SK=order_date
LSI: PK=user_id, SK=total_amount

→ 같은 파티션, 다른 정렬
\`\`\`

### Python (boto3) 사용

\`\`\`python
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')

# 항목 추가
table.put_item(Item={
    'user_id': 'u123',
    'name': 'Alice',
    'email': 'alice@example.com'
})

# 항목 조회
response = table.get_item(Key={'user_id': 'u123'})
item = response['Item']

# 쿼리 (정렬 키 범위)
response = table.query(
    KeyConditionExpression='user_id = :uid AND created_at > :date',
    ExpressionAttributeValues={
        ':uid': 'u123',
        ':date': '2024-01-01'
    }
)
\`\`\`
        `
      }
    },
    {
      id: 'database-practice',
      type: 'code',
      title: '🎯 미션: 최적의 데이터베이스 설계',
      duration: 60,
      content: {
        objectives: [
          'RDS 인스턴스를 생성한다',
          'DynamoDB 테이블을 설계한다',
          '각 DB의 장단점을 실습으로 체험한다'
        ],
        instructions: `
## 미션: 이커머스 데이터베이스 설계

### 요구사항

1. **사용자 데이터** (RDS)
   - 트랜잭션 보장
   - 복잡한 관계 (주소, 결제수단)

2. **세션/카트 데이터** (DynamoDB)
   - 빠른 응답
   - 유연한 스키마

3. **주문 이력** (DynamoDB)
   - 대용량
   - 시간순 조회

### 비용 최적화 챌린지
- RDS: db.t3.micro (Free Tier)
- DynamoDB: 온디맨드 모드

**목표**: 무료 티어 내에서 구현!
        `,
        starterCode: `import boto3
import json

# 클라이언트 설정
rds = boto3.client('rds', region_name='ap-northeast-2')
dynamodb = boto3.resource('dynamodb', region_name='ap-northeast-2')

# === RDS 설정 ===

def create_rds_instance():
    """RDS MySQL 인스턴스 생성 (Free Tier)"""
    # TODO: 구현
    # - 인스턴스 클래스: db.t3.micro
    # - 스토리지: 20GB
    # - 엔진: mysql
    pass

# === DynamoDB 설정 ===

def create_sessions_table():
    """세션/카트용 DynamoDB 테이블"""
    # TODO: 구현
    # - 파티션 키: session_id
    # - TTL 설정: expires_at
    pass

def create_orders_table():
    """주문 이력용 DynamoDB 테이블"""
    # TODO: 구현
    # - 파티션 키: user_id
    # - 정렬 키: order_date
    # - GSI: status-index (status, order_date)
    pass

# === 데이터 작업 ===

def add_to_cart(session_id, product_id, quantity):
    """장바구니에 상품 추가"""
    # TODO: 구현
    pass

def create_order(user_id, items):
    """주문 생성"""
    # TODO: 구현
    pass

def get_user_orders(user_id, status=None):
    """사용자 주문 조회"""
    # TODO: 구현
    pass

# 실행
if __name__ == "__main__":
    print("=== 이커머스 데이터베이스 설정 ===")
`,
        solutionCode: `import boto3
import json
import uuid
from datetime import datetime, timedelta
from decimal import Decimal

# 클라이언트 설정
rds = boto3.client('rds', region_name='ap-northeast-2')
dynamodb = boto3.resource('dynamodb', region_name='ap-northeast-2')

# === RDS 설정 ===

def create_rds_instance():
    """RDS MySQL 인스턴스 생성 (Free Tier)"""
    try:
        response = rds.create_db_instance(
            DBInstanceIdentifier='ecommerce-db',
            DBInstanceClass='db.t3.micro',
            Engine='mysql',
            EngineVersion='8.0',
            MasterUsername='admin',
            MasterUserPassword='YourSecurePassword123!',
            AllocatedStorage=20,
            StorageType='gp2',
            PubliclyAccessible=False,
            VpcSecurityGroupIds=['sg-xxxxxxxx'],  # 보안 그룹 ID
            DBSubnetGroupName='default',
            BackupRetentionPeriod=7,
            MultiAZ=False,  # Free Tier는 단일 AZ
            Tags=[
                {'Key': 'Environment', 'Value': 'Development'},
                {'Key': 'Project', 'Value': 'FDE-Ecommerce'}
            ]
        )
        print(f"RDS 인스턴스 생성 시작: {response['DBInstance']['DBInstanceIdentifier']}")
        return response
    except rds.exceptions.DBInstanceAlreadyExistsFault:
        print("RDS 인스턴스가 이미 존재합니다.")

# === DynamoDB 설정 ===

def create_sessions_table():
    """세션/카트용 DynamoDB 테이블"""
    try:
        table = dynamodb.create_table(
            TableName='Sessions',
            KeySchema=[
                {'AttributeName': 'session_id', 'KeyType': 'HASH'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'session_id', 'AttributeType': 'S'}
            ],
            BillingMode='PAY_PER_REQUEST',  # 온디맨드
            Tags=[
                {'Key': 'Environment', 'Value': 'Development'}
            ]
        )
        table.wait_until_exists()

        # TTL 설정
        dynamodb.meta.client.update_time_to_live(
            TableName='Sessions',
            TimeToLiveSpecification={
                'Enabled': True,
                'AttributeName': 'expires_at'
            }
        )
        print("Sessions 테이블 생성 완료 (TTL 활성화)")
        return table
    except dynamodb.meta.client.exceptions.ResourceInUseException:
        print("Sessions 테이블이 이미 존재합니다.")
        return dynamodb.Table('Sessions')

def create_orders_table():
    """주문 이력용 DynamoDB 테이블"""
    try:
        table = dynamodb.create_table(
            TableName='Orders',
            KeySchema=[
                {'AttributeName': 'user_id', 'KeyType': 'HASH'},
                {'AttributeName': 'order_date', 'KeyType': 'RANGE'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'user_id', 'AttributeType': 'S'},
                {'AttributeName': 'order_date', 'AttributeType': 'S'},
                {'AttributeName': 'status', 'AttributeType': 'S'}
            ],
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'status-index',
                    'KeySchema': [
                        {'AttributeName': 'status', 'KeyType': 'HASH'},
                        {'AttributeName': 'order_date', 'KeyType': 'RANGE'}
                    ],
                    'Projection': {'ProjectionType': 'ALL'}
                }
            ],
            BillingMode='PAY_PER_REQUEST',
            Tags=[
                {'Key': 'Environment', 'Value': 'Development'}
            ]
        )
        table.wait_until_exists()
        print("Orders 테이블 생성 완료 (GSI: status-index)")
        return table
    except dynamodb.meta.client.exceptions.ResourceInUseException:
        print("Orders 테이블이 이미 존재합니다.")
        return dynamodb.Table('Orders')

# === 데이터 작업 ===

def add_to_cart(session_id, product_id, quantity):
    """장바구니에 상품 추가"""
    table = dynamodb.Table('Sessions')

    # 30분 후 만료
    expires_at = int((datetime.now() + timedelta(minutes=30)).timestamp())

    response = table.update_item(
        Key={'session_id': session_id},
        UpdateExpression='SET cart.#pid = :qty, expires_at = :exp, updated_at = :now',
        ExpressionAttributeNames={'#pid': product_id},
        ExpressionAttributeValues={
            ':qty': quantity,
            ':exp': expires_at,
            ':now': datetime.now().isoformat()
        },
        ReturnValues='ALL_NEW'
    )
    print(f"장바구니 업데이트: {session_id}")
    return response['Attributes']

def create_order(user_id, items, total_amount):
    """주문 생성"""
    table = dynamodb.Table('Orders')

    order = {
        'user_id': user_id,
        'order_date': datetime.now().isoformat(),
        'order_id': str(uuid.uuid4()),
        'items': items,
        'total_amount': Decimal(str(total_amount)),
        'status': 'PENDING',
        'created_at': datetime.now().isoformat()
    }

    table.put_item(Item=order)
    print(f"주문 생성: {order['order_id']}")
    return order

def get_user_orders(user_id, status=None):
    """사용자 주문 조회"""
    table = dynamodb.Table('Orders')

    if status:
        # GSI 사용 (status로 조회)
        response = table.query(
            IndexName='status-index',
            KeyConditionExpression='#status = :status',
            FilterExpression='user_id = :uid',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':status': status,
                ':uid': user_id
            }
        )
    else:
        # 기본 키 사용
        response = table.query(
            KeyConditionExpression='user_id = :uid',
            ExpressionAttributeValues={':uid': user_id},
            ScanIndexForward=False  # 최신순
        )

    return response['Items']

# 실행
if __name__ == "__main__":
    print("=== 이커머스 데이터베이스 설정 ===\\n")

    # 테이블 생성
    create_sessions_table()
    create_orders_table()

    # 테스트 데이터
    print("\\n=== 테스트 데이터 ===")

    # 장바구니 테스트
    add_to_cart('session-123', 'product-001', 2)
    add_to_cart('session-123', 'product-002', 1)

    # 주문 테스트
    order = create_order('user-001', [
        {'product_id': 'product-001', 'quantity': 2, 'price': 10000},
        {'product_id': 'product-002', 'quantity': 1, 'price': 25000}
    ], total_amount=45000)

    # 주문 조회
    orders = get_user_orders('user-001')
    print(f"\\n사용자 주문 수: {len(orders)}")
`
      }
    },
    {
      id: 'week1-challenge',
      type: 'challenge',
      title: '🏆 Week 1 챌린지: 3-Tier 아키텍처 구축',
      duration: 90,
      content: {
        objectives: [
          'VPC, EC2, RDS를 통합한 아키텍처를 구축한다',
          '보안 그룹으로 계층 간 통신을 제어한다',
          '비용 효율적인 설계를 적용한다'
        ],
        requirements: [
          'VPC: 퍼블릭/프라이빗 서브넷 (2 AZ)',
          'EC2: 웹 서버 (ALB 뒤)',
          'RDS: 프라이빗 서브넷에 MySQL',
          'Lambda: 배치 처리 함수',
          'S3: 정적 파일 저장'
        ],
        evaluationCriteria: [
          '아키텍처 완성도 (30%)',
          '보안 설정 (30%)',
          '비용 최적화 (20%)',
          '문서화 (20%)'
        ],
        bonusPoints: [
          'Multi-AZ RDS 구성',
          'Auto Scaling 그룹 설정',
          'CloudWatch 알람 구성',
          'Terraform으로 IaC 구현'
        ]
      }
    }
  ]
}
