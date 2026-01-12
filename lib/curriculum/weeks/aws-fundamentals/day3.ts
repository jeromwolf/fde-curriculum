// Phase 4, Week 1, Day 3: S3 & 데이터 스토리지
import type { Day } from '../../types'

export const day3: Day = {
  slug: 's3-storage',
  title: 'S3 & 데이터 스토리지',
  totalDuration: 180,
  tasks: [
    {
      id: 's3-basics-video',
      type: 'video',
      title: 'S3 기초: 버킷과 객체',
      duration: 30,
      content: {
        objectives: [
          'S3의 핵심 개념을 이해한다',
          '스토리지 클래스를 학습한다',
          '버전 관리와 수명 주기를 파악한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=s3-basics-placeholder',
        transcript: `
## S3 (Simple Storage Service)

### S3란?

**무제한 확장 가능한 객체 스토리지**입니다.

\`\`\`
S3 구조
├── 버킷 (Bucket)         → 컨테이너 (고유 이름)
│   ├── 객체 (Object)     → 파일 + 메타데이터
│   │   ├── Key          → 파일 경로 (data/2024/file.csv)
│   │   ├── Value        → 파일 내용 (최대 5TB)
│   │   └── Metadata     → 속성 정보
│   └── 폴더             → 논리적 구분 (실제로는 키 접두사)
\`\`\`

### S3 스토리지 클래스

| 클래스 | 가용성 | 비용 | 적합한 데이터 |
|--------|--------|------|---------------|
| **Standard** | 99.99% | 높음 | 자주 접근 |
| **Standard-IA** | 99.9% | 중간 | 30일+ 드문 접근 |
| **One Zone-IA** | 99.5% | 낮음 | 재생성 가능 |
| **Glacier IR** | 99.9% | 낮음 | 밀리초 복원 |
| **Glacier Flexible** | 99.99% | 매우 낮음 | 분~시간 복원 |
| **Glacier Deep** | 99.99% | 최저 | 12시간 복원 |

### 수명 주기 정책

\`\`\`json
{
  "Rules": [{
    "ID": "ArchiveOldData",
    "Status": "Enabled",
    "Filter": {"Prefix": "logs/"},
    "Transitions": [
      {"Days": 30, "StorageClass": "STANDARD_IA"},
      {"Days": 90, "StorageClass": "GLACIER"},
      {"Days": 365, "StorageClass": "DEEP_ARCHIVE"}
    ],
    "Expiration": {"Days": 730}
  }]
}
\`\`\`

### 버전 관리

\`\`\`python
import boto3

s3 = boto3.client('s3')

# 버전 관리 활성화
s3.put_bucket_versioning(
    Bucket='my-bucket',
    VersioningConfiguration={'Status': 'Enabled'}
)

# 특정 버전 가져오기
s3.get_object(
    Bucket='my-bucket',
    Key='data.csv',
    VersionId='abc123'
)
\`\`\`

### S3 보안

| 방법 | 설명 |
|------|------|
| **버킷 정책** | 버킷 레벨 JSON 정책 |
| **ACL** | 객체 레벨 권한 (레거시) |
| **IAM 정책** | 사용자/역할 기반 |
| **암호화** | SSE-S3, SSE-KMS, SSE-C |
| **퍼블릭 액세스 차단** | 기본 활성화 권장 |

### 서버 측 암호화

\`\`\`python
# SSE-S3 (AWS 관리 키)
s3.put_object(
    Bucket='my-bucket',
    Key='data.csv',
    Body=data,
    ServerSideEncryption='AES256'
)

# SSE-KMS (고객 관리 키)
s3.put_object(
    Bucket='my-bucket',
    Key='sensitive.csv',
    Body=data,
    ServerSideEncryption='aws:kms',
    SSEKMSKeyId='arn:aws:kms:...'
)
\`\`\`
        `
      }
    },
    {
      id: 's3-data-lake-video',
      type: 'video',
      title: 'S3 데이터 레이크 패턴',
      duration: 25,
      content: {
        objectives: [
          '데이터 레이크 아키텍처를 이해한다',
          '파티셔닝 전략을 학습한다',
          'S3 Select와 Athena를 파악한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=s3-data-lake-placeholder',
        transcript: `
## S3 데이터 레이크 아키텍처

### 계층 구조

\`\`\`
s3://data-lake/
├── raw/                    → 원본 데이터 (변경 불가)
│   ├── sales/
│   ├── logs/
│   └── events/
│
├── staged/                 → 정제된 데이터
│   ├── sales_cleaned/
│   └── logs_parsed/
│
├── curated/                → 분석용 데이터
│   ├── daily_metrics/
│   └── user_segments/
│
└── sandbox/                → 임시 분석
\`\`\`

### 파티셔닝 전략

\`\`\`
Hive 스타일 파티셔닝:
s3://data-lake/events/year=2024/month=01/day=15/

장점:
- Athena, Spark 자동 파티션 인식
- 쿼리 성능 최적화 (파티션 프루닝)
- 비용 절감 (스캔 데이터 감소)
\`\`\`

### 파일 포맷

| 포맷 | 특징 | 적합한 경우 |
|------|------|-------------|
| **Parquet** | 컬럼형, 압축 | 분석 쿼리 |
| **ORC** | 컬럼형, Hive 최적화 | Hive/Spark |
| **JSON** | 유연한 스키마 | 로그, API |
| **CSV** | 범용, 간단 | 데이터 교환 |
| **Avro** | 스키마 포함, 행 기반 | 스트리밍 |

### S3 Select

\`\`\`python
# S3에서 직접 쿼리 (전체 다운로드 없이)
response = s3.select_object_content(
    Bucket='my-bucket',
    Key='data.csv',
    ExpressionType='SQL',
    Expression="SELECT * FROM s3object WHERE age > 30",
    InputSerialization={'CSV': {'FileHeaderInfo': 'USE'}},
    OutputSerialization={'JSON': {}}
)

for event in response['Payload']:
    if 'Records' in event:
        print(event['Records']['Payload'].decode())
\`\`\`

### Athena 연동

\`\`\`sql
-- 외부 테이블 생성
CREATE EXTERNAL TABLE events (
  event_id STRING,
  user_id STRING,
  event_type STRING,
  timestamp TIMESTAMP
)
PARTITIONED BY (year INT, month INT, day INT)
STORED AS PARQUET
LOCATION 's3://data-lake/events/';

-- 파티션 추가
MSCK REPAIR TABLE events;

-- 쿼리 (파티션 프루닝)
SELECT * FROM events
WHERE year = 2024 AND month = 1;
\`\`\`
        `
      }
    },
    {
      id: 's3-practice',
      type: 'code',
      title: 'S3 데이터 관리 실습',
      duration: 50,
      content: {
        objectives: [
          'boto3로 S3 버킷을 관리한다',
          '파일 업로드/다운로드를 구현한다',
          '수명 주기 정책을 설정한다'
        ],
        instructions: `
## 실습: S3 데이터 레이크 구축

### 시나리오

데이터 레이크용 S3 버킷을 생성하고, 데이터 파이프라인을 구현합니다.

### 과제

1. 버킷 생성 (버전 관리 활성화)
2. 데이터 업로드 (Parquet 형식)
3. 수명 주기 정책 설정
4. 데이터 조회 (S3 Select)
        `,
        starterCode: `import boto3
import pandas as pd
import io

s3 = boto3.client('s3', region_name='ap-northeast-2')
BUCKET_NAME = 'fde-data-lake-YOURNAME'  # 고유한 이름으로 변경

# 1. 버킷 생성
def create_data_lake_bucket():
    """버전 관리가 활성화된 버킷 생성"""
    # TODO: 구현
    pass

# 2. 데이터 업로드
def upload_data():
    """샘플 데이터를 Parquet 형식으로 업로드"""
    # 샘플 데이터
    df = pd.DataFrame({
        'user_id': ['u1', 'u2', 'u3', 'u4', 'u5'],
        'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
        'age': [25, 32, 28, 35, 29],
        'city': ['Seoul', 'Busan', 'Seoul', 'Incheon', 'Seoul']
    })
    # TODO: Parquet로 변환 후 업로드
    pass

# 3. 수명 주기 정책 설정
def set_lifecycle_policy():
    """30일 후 IA, 90일 후 Glacier로 이동"""
    # TODO: 구현
    pass

# 4. S3 Select로 쿼리
def query_with_s3_select():
    """서울 사용자만 조회"""
    # TODO: 구현
    pass

# 실행
if __name__ == "__main__":
    create_data_lake_bucket()
    upload_data()
    set_lifecycle_policy()
    query_with_s3_select()
`,
        solutionCode: `import boto3
import pandas as pd
import io
import json

s3 = boto3.client('s3', region_name='ap-northeast-2')
BUCKET_NAME = 'fde-data-lake-demo'  # 고유한 이름으로 변경

# 1. 버킷 생성
def create_data_lake_bucket():
    """버전 관리가 활성화된 버킷 생성"""
    try:
        # 서울 리전은 LocationConstraint 필요
        s3.create_bucket(
            Bucket=BUCKET_NAME,
            CreateBucketConfiguration={'LocationConstraint': 'ap-northeast-2'}
        )
        print(f"버킷 생성: {BUCKET_NAME}")

        # 버전 관리 활성화
        s3.put_bucket_versioning(
            Bucket=BUCKET_NAME,
            VersioningConfiguration={'Status': 'Enabled'}
        )
        print("버전 관리 활성화 완료")

        # 퍼블릭 액세스 차단
        s3.put_public_access_block(
            Bucket=BUCKET_NAME,
            PublicAccessBlockConfiguration={
                'BlockPublicAcls': True,
                'IgnorePublicAcls': True,
                'BlockPublicPolicy': True,
                'RestrictPublicBuckets': True
            }
        )
        print("퍼블릭 액세스 차단 설정 완료")

    except s3.exceptions.BucketAlreadyOwnedByYou:
        print(f"버킷이 이미 존재합니다: {BUCKET_NAME}")

# 2. 데이터 업로드
def upload_data():
    """샘플 데이터를 Parquet과 CSV 형식으로 업로드"""
    # 샘플 데이터
    df = pd.DataFrame({
        'user_id': ['u1', 'u2', 'u3', 'u4', 'u5'],
        'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
        'age': [25, 32, 28, 35, 29],
        'city': ['Seoul', 'Busan', 'Seoul', 'Incheon', 'Seoul']
    })

    # Parquet 업로드
    parquet_buffer = io.BytesIO()
    df.to_parquet(parquet_buffer, index=False)
    parquet_buffer.seek(0)

    s3.put_object(
        Bucket=BUCKET_NAME,
        Key='raw/users/users.parquet',
        Body=parquet_buffer.getvalue()
    )
    print("Parquet 데이터 업로드 완료")

    # CSV 업로드 (S3 Select용)
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)

    s3.put_object(
        Bucket=BUCKET_NAME,
        Key='raw/users/users.csv',
        Body=csv_buffer.getvalue()
    )
    print("CSV 데이터 업로드 완료")

# 3. 수명 주기 정책 설정
def set_lifecycle_policy():
    """30일 후 IA, 90일 후 Glacier로 이동"""
    lifecycle_policy = {
        'Rules': [
            {
                'ID': 'ArchiveOldData',
                'Status': 'Enabled',
                'Filter': {'Prefix': 'raw/'},
                'Transitions': [
                    {'Days': 30, 'StorageClass': 'STANDARD_IA'},
                    {'Days': 90, 'StorageClass': 'GLACIER'}
                ],
                'NoncurrentVersionTransitions': [
                    {'NoncurrentDays': 30, 'StorageClass': 'GLACIER'}
                ],
                'NoncurrentVersionExpiration': {'NoncurrentDays': 365}
            }
        ]
    }

    s3.put_bucket_lifecycle_configuration(
        Bucket=BUCKET_NAME,
        LifecycleConfiguration=lifecycle_policy
    )
    print("수명 주기 정책 설정 완료")

# 4. S3 Select로 쿼리
def query_with_s3_select():
    """서울 사용자만 조회"""
    response = s3.select_object_content(
        Bucket=BUCKET_NAME,
        Key='raw/users/users.csv',
        ExpressionType='SQL',
        Expression="SELECT * FROM s3object s WHERE s.city = 'Seoul'",
        InputSerialization={
            'CSV': {
                'FileHeaderInfo': 'USE',
                'RecordDelimiter': '\\n',
                'FieldDelimiter': ','
            }
        },
        OutputSerialization={'JSON': {'RecordDelimiter': '\\n'}}
    )

    print("\\n=== 서울 사용자 조회 결과 ===")
    for event in response['Payload']:
        if 'Records' in event:
            records = event['Records']['Payload'].decode('utf-8')
            for line in records.strip().split('\\n'):
                if line:
                    print(json.loads(line))

# 5. 버킷 내용 확인
def list_objects():
    """버킷 내 객체 목록 조회"""
    response = s3.list_objects_v2(Bucket=BUCKET_NAME)

    print("\\n=== 버킷 내용 ===")
    for obj in response.get('Contents', []):
        print(f"  {obj['Key']} ({obj['Size']} bytes)")

# 실행
if __name__ == "__main__":
    print("=== S3 데이터 레이크 구축 ===\\n")
    create_data_lake_bucket()
    upload_data()
    set_lifecycle_policy()
    list_objects()
    query_with_s3_select()
`
      }
    },
    {
      id: 's3-quiz',
      type: 'quiz',
      title: 'S3 개념 퀴즈',
      duration: 15,
      content: {
        objectives: ['S3 개념을 복습한다'],
        questions: [
          {
            question: '1년에 한 번 접근하는 규정 준수 데이터에 가장 적합한 스토리지 클래스는?',
            options: [
              'S3 Standard',
              'S3 Standard-IA',
              'S3 Glacier Deep Archive',
              'S3 One Zone-IA'
            ],
            answer: 2,
            explanation: 'Glacier Deep Archive는 최저 비용으로 장기 보관에 적합하며, 연 1-2회 접근하는 데이터에 이상적입니다.'
          },
          {
            question: 'S3 버전 관리의 주요 장점이 아닌 것은?',
            options: [
              '실수로 삭제된 파일 복구',
              '이전 버전으로 롤백',
              '스토리지 비용 절감',
              '데이터 변경 이력 추적'
            ],
            answer: 2,
            explanation: '버전 관리는 모든 버전을 저장하므로 오히려 스토리지 비용이 증가합니다. 수명 주기 정책으로 이전 버전을 관리해야 합니다.'
          },
          {
            question: 'Athena 쿼리 비용을 줄이는 가장 효과적인 방법은?',
            options: [
              'S3 Standard 사용',
              '버전 관리 비활성화',
              'Parquet 포맷 + 파티셔닝',
              'CSV 포맷 사용'
            ],
            answer: 2,
            explanation: 'Parquet은 컬럼형 포맷으로 필요한 컬럼만 읽고, 파티셔닝은 필요한 데이터만 스캔하여 비용을 크게 절감합니다.'
          }
        ]
      }
    }
  ]
}
