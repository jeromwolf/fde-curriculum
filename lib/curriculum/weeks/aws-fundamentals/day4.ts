// Phase 4, Week 1, Day 4: Lambda & 서버리스
import type { Day } from '../../types'

export const day4: Day = {
  slug: 'lambda-serverless',
  title: 'Lambda & 서버리스',
  totalDuration: 180,
  tasks: [
    {
      id: 'lambda-intro-video',
      type: 'video',
      title: '🚀 미션: 서버 없이 서비스 운영하기',
      duration: 30,
      content: {
        objectives: [
          'Lambda의 핵심 개념과 장점을 이해한다',
          '서버리스 아키텍처 패턴을 학습한다',
          '비용 모델과 제한 사항을 파악한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=lambda-intro-placeholder',
        transcript: `
## Lambda: 서버리스 컴퓨팅

### 💡 생각해보기

> "새벽 3시에 서버가 다운됐다는 알림을 받고 싶으신가요?"

**서버리스의 약속**: 인프라 관리 없이 코드만 집중!

### Lambda란?

\`\`\`
전통적인 방식                    서버리스 (Lambda)
├── EC2 프로비저닝               ├── 코드만 업로드
├── OS 패치/업데이트             ├── 자동 스케일링
├── 보안 설정                    ├── 사용한 만큼만 과금
├── 로드 밸런서 설정             ├── 고가용성 기본 제공
└── 24/7 서버 비용              └── 유휴 시간 = 비용 $0
\`\`\`

### 🎮 비용 챌린지

**시나리오**: 하루 10,000건 API 요청, 평균 200ms 실행

| 방식 | 월간 비용 |
|------|----------|
| EC2 t3.small (24/7) | ~$15 |
| Lambda (128MB) | ~$0.20 |
| **절감율** | **98.7%** 🎉 |

*단, 트래픽이 지속적으로 높으면 EC2가 더 저렴할 수 있음!*

### Lambda 작동 방식

\`\`\`
이벤트 소스                Lambda 함수              대상
├── API Gateway    →    ┌─────────────┐    →    ├── DynamoDB
├── S3 업로드      →    │   Handler   │    →    ├── S3
├── SQS 메시지     →    │   함수      │    →    ├── SNS
├── EventBridge    →    └─────────────┘    →    ├── SQS
└── CloudWatch     →         ↓              →    └── 외부 API
                        실행 후 종료
\`\`\`

### Lambda 함수 구조

\`\`\`python
import json

def lambda_handler(event, context):
    """
    event: 트리거에서 전달된 데이터
    context: 실행 환경 정보 (남은 시간, 메모리 등)
    """
    print(f"남은 실행 시간: {context.get_remaining_time_in_millis()}ms")

    # 비즈니스 로직
    name = event.get('name', 'World')

    return {
        'statusCode': 200,
        'body': json.dumps({'message': f'Hello, {name}!'})
    }
\`\`\`

### Lambda 설정 옵션

| 설정 | 범위 | 비용 영향 |
|------|------|----------|
| **메모리** | 128MB ~ 10GB | 비례 증가 |
| **CPU** | 메모리에 비례 | 자동 할당 |
| **타임아웃** | 1초 ~ 15분 | 최대 실행 시간 |
| **동시성** | 기본 1000 | 예약 가능 |

### 💀 실패 사례: Lambda 콜드 스타트

\`\`\`
첫 번째 요청 (콜드 스타트)
├── 컨테이너 생성: ~200ms
├── 런타임 초기화: ~100ms
├── 코드 로드: ~50ms
└── 핸들러 실행: 실제 로직

두 번째 요청 (웜 스타트)
└── 핸들러 실행: 실제 로직만!
\`\`\`

**해결책**:
1. Provisioned Concurrency (비용 발생)
2. 가벼운 런타임 사용 (Python > Java)
3. 패키지 크기 최소화
4. 연결 재사용 (DB 커넥션 등)
        `
      }
    },
    {
      id: 'lambda-triggers-video',
      type: 'video',
      title: 'Lambda 트리거 & 이벤트 소스',
      duration: 25,
      content: {
        objectives: [
          '다양한 Lambda 트리거를 이해한다',
          'API Gateway 연동을 학습한다',
          'S3, SQS 이벤트 처리를 파악한다'
        ],
        videoUrl: 'https://www.youtube.com/watch?v=lambda-triggers-placeholder',
        transcript: `
## Lambda 트리거 & 이벤트 소스

### 주요 트리거 유형

| 트리거 | 이벤트 유형 | 사용 사례 |
|--------|-------------|----------|
| **API Gateway** | HTTP 요청 | REST/GraphQL API |
| **S3** | 객체 생성/삭제 | 이미지 처리, ETL |
| **SQS** | 메시지 수신 | 비동기 작업 처리 |
| **DynamoDB** | 스트림 레코드 | 실시간 데이터 처리 |
| **EventBridge** | 스케줄/이벤트 | 크론 작업, 이벤트 라우팅 |
| **SNS** | 알림 메시지 | 팬아웃 패턴 |

### API Gateway + Lambda

\`\`\`
클라이언트 → API Gateway → Lambda → DynamoDB
             (REST API)

HTTP POST /users
    ↓
{
  "httpMethod": "POST",
  "path": "/users",
  "body": "{\\"name\\": \\"Alice\\"}"
}
\`\`\`

\`\`\`python
import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')

def lambda_handler(event, context):
    # HTTP 메서드 확인
    method = event['httpMethod']

    if method == 'POST':
        body = json.loads(event['body'])
        table.put_item(Item=body)
        return {'statusCode': 201, 'body': json.dumps(body)}

    elif method == 'GET':
        user_id = event['pathParameters']['id']
        response = table.get_item(Key={'id': user_id})
        return {'statusCode': 200, 'body': json.dumps(response.get('Item'))}
\`\`\`

### S3 이벤트 트리거

\`\`\`python
# S3 객체 업로드 시 자동 실행
def lambda_handler(event, context):
    # S3 이벤트 파싱
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']

        print(f"새 파일: s3://{bucket}/{key}")

        # 이미지 처리, 데이터 변환 등
        process_file(bucket, key)
\`\`\`

### SQS 배치 처리

\`\`\`python
def lambda_handler(event, context):
    # 최대 10개 메시지 배치 처리
    for record in event['Records']:
        message = json.loads(record['body'])
        process_message(message)

    # 실패한 메시지만 재처리 (부분 배치 응답)
    return {
        'batchItemFailures': [
            {'itemIdentifier': record['messageId']}
            for record in failed_records
        ]
    }
\`\`\`

### EventBridge 스케줄

\`\`\`yaml
# 매일 오전 9시 실행
ScheduleExpression: "cron(0 9 * * ? *)"

# 5분마다 실행
ScheduleExpression: "rate(5 minutes)"
\`\`\`
        `
      }
    },
    {
      id: 'lambda-practice',
      type: 'code',
      title: '🎯 미션: 서버리스 API 구축',
      duration: 60,
      content: {
        objectives: [
          'Lambda 함수를 작성하고 배포한다',
          'API Gateway와 연동한다',
          'DynamoDB CRUD를 구현한다'
        ],
        instructions: `
## 미션: 서버리스 TODO API 구축

### 🎯 목표
서버 없이 TODO 관리 API를 구축하세요!

### 아키텍처
\`\`\`
Client → API Gateway → Lambda → DynamoDB
         (REST)        (Python)  (NoSQL)
\`\`\`

### 엔드포인트
- POST /todos - TODO 생성
- GET /todos - 전체 조회
- GET /todos/{id} - 단일 조회
- PUT /todos/{id} - 수정
- DELETE /todos/{id} - 삭제

### 💰 비용 추정
- Lambda: 월 100만 요청까지 무료
- DynamoDB: 25GB, 25 WCU/RCU 무료
- API Gateway: 월 100만 요청까지 무료

**예상 비용: $0** (Free Tier 내)
        `,
        starterCode: `import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Todos')

def lambda_handler(event, context):
    """TODO API 핸들러"""
    method = event['httpMethod']
    path = event['path']

    try:
        if method == 'POST' and path == '/todos':
            return create_todo(event)
        elif method == 'GET' and path == '/todos':
            return list_todos()
        elif method == 'GET' and path.startswith('/todos/'):
            return get_todo(event)
        elif method == 'PUT' and path.startswith('/todos/'):
            return update_todo(event)
        elif method == 'DELETE' and path.startswith('/todos/'):
            return delete_todo(event)
        else:
            return response(404, {'error': 'Not Found'})
    except Exception as e:
        return response(500, {'error': str(e)})

def create_todo(event):
    """TODO 생성"""
    # TODO: 구현
    pass

def list_todos():
    """TODO 목록 조회"""
    # TODO: 구현
    pass

def get_todo(event):
    """TODO 단일 조회"""
    # TODO: 구현
    pass

def update_todo(event):
    """TODO 수정"""
    # TODO: 구현
    pass

def delete_todo(event):
    """TODO 삭제"""
    # TODO: 구현
    pass

def response(status_code, body):
    """API 응답 포맷"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body, default=str)
    }
`,
        solutionCode: `import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Todos')

def lambda_handler(event, context):
    """TODO API 핸들러"""
    method = event['httpMethod']
    path = event['path']

    try:
        if method == 'POST' and path == '/todos':
            return create_todo(event)
        elif method == 'GET' and path == '/todos':
            return list_todos()
        elif method == 'GET' and path.startswith('/todos/'):
            return get_todo(event)
        elif method == 'PUT' and path.startswith('/todos/'):
            return update_todo(event)
        elif method == 'DELETE' and path.startswith('/todos/'):
            return delete_todo(event)
        else:
            return response(404, {'error': 'Not Found'})
    except Exception as e:
        print(f"Error: {e}")
        return response(500, {'error': str(e)})

def create_todo(event):
    """TODO 생성"""
    body = json.loads(event['body'])

    item = {
        'id': str(uuid.uuid4()),
        'title': body['title'],
        'completed': False,
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat()
    }

    table.put_item(Item=item)
    return response(201, item)

def list_todos():
    """TODO 목록 조회"""
    result = table.scan()
    items = result.get('Items', [])

    # 생성일 기준 정렬
    items.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
    return response(200, items)

def get_todo(event):
    """TODO 단일 조회"""
    todo_id = event['pathParameters']['id']

    result = table.get_item(Key={'id': todo_id})
    item = result.get('Item')

    if not item:
        return response(404, {'error': 'Todo not found'})

    return response(200, item)

def update_todo(event):
    """TODO 수정"""
    todo_id = event['pathParameters']['id']
    body = json.loads(event['body'])

    # 업데이트 표현식 구성
    update_expression = 'SET updatedAt = :updatedAt'
    expression_values = {':updatedAt': datetime.now().isoformat()}

    if 'title' in body:
        update_expression += ', title = :title'
        expression_values[':title'] = body['title']

    if 'completed' in body:
        update_expression += ', completed = :completed'
        expression_values[':completed'] = body['completed']

    result = table.update_item(
        Key={'id': todo_id},
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_values,
        ReturnValues='ALL_NEW'
    )

    return response(200, result['Attributes'])

def delete_todo(event):
    """TODO 삭제"""
    todo_id = event['pathParameters']['id']

    table.delete_item(Key={'id': todo_id})
    return response(204, {})

def response(status_code, body):
    """API 응답 포맷"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps(body, default=str) if body else ''
    }

# 로컬 테스트
if __name__ == '__main__':
    # POST 테스트
    event = {
        'httpMethod': 'POST',
        'path': '/todos',
        'body': json.dumps({'title': 'Lambda 학습하기'})
    }
    print(lambda_handler(event, None))
`
      }
    },
    {
      id: 'lambda-quiz',
      type: 'quiz',
      title: 'Lambda 퀴즈',
      duration: 15,
      content: {
        objectives: ['Lambda 개념을 복습한다'],
        questions: [
          {
            question: 'Lambda 콜드 스타트를 줄이는 방법이 아닌 것은?',
            options: [
              'Provisioned Concurrency 사용',
              '메모리 크기 증가',
              '패키지 크기 최소화',
              '타임아웃 시간 증가'
            ],
            answer: 3,
            explanation: '타임아웃은 최대 실행 시간을 설정하는 것으로, 콜드 스타트와 무관합니다.'
          },
          {
            question: 'Lambda 함수가 VPC 내 리소스(RDS 등)에 접근하려면 필요한 것은?',
            options: [
              'IAM 역할만 있으면 됨',
              'VPC 설정 + NAT Gateway (인터넷 필요 시)',
              '퍼블릭 IP 할당',
              'Direct Connect'
            ],
            answer: 1,
            explanation: 'VPC 내 Lambda는 서브넷에 ENI를 생성합니다. 인터넷 접근이 필요하면 NAT Gateway도 필요합니다.'
          },
          {
            question: 'Lambda의 최대 실행 시간은?',
            options: [
              '5분',
              '10분',
              '15분',
              '30분'
            ],
            answer: 2,
            explanation: 'Lambda 함수는 최대 15분(900초)까지 실행할 수 있습니다. 더 긴 작업은 Step Functions를 고려하세요.'
          }
        ]
      }
    }
  ]
}
