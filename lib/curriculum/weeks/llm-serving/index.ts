// Phase 4, Week 7: LLM 서빙
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'llm-serving-intro',
  title: 'LLM 서빙 기초',
  totalDuration: 180,
  tasks: [
    {
      id: 'llm-serving-intro-video',
      type: 'video',
      title: 'LLM 서빙 아키텍처',
      duration: 30,
      content: {
        objectives: ['LLM 서빙 옵션 이해', 'API vs Self-hosted 비교', '비용 최적화 전략'],
        videoUrl: 'https://www.youtube.com/watch?v=llm-serving-intro-placeholder',
        transcript: `
## LLM 서빙 옵션

### API vs Self-hosted

\`\`\`
API 서비스 (OpenAI, Anthropic)
├── 즉시 사용 가능
├── 관리 불필요
├── 토큰당 과금
└── 데이터 외부 전송

Self-hosted (vLLM, TGI)
├── 초기 설정 필요
├── 인프라 관리
├── 인스턴스당 과금
└── 데이터 내부 유지
\`\`\`

### 비용 비교 (월 1억 토큰 기준)

| 옵션 | 비용 |
|------|------|
| GPT-4o | ~$500 |
| GPT-4o-mini | ~$15 |
| Claude 3.5 Sonnet | ~$300 |
| Llama 3 70B (self) | ~$1,500 (GPU) |
| Llama 3 8B (self) | ~$500 (GPU) |

### 주요 서빙 프레임워크

| 프레임워크 | 특징 |
|------------|------|
| **vLLM** | PagedAttention, 고처리량 |
| **TGI** | Hugging Face, 쉬운 배포 |
| **TensorRT-LLM** | NVIDIA 최적화 |
| **llama.cpp** | CPU/저사양 GPU |
| **Ollama** | 로컬 실행 |
        `
      }
    },
    {
      id: 'api-gateway-video',
      type: 'video',
      title: 'LLM API Gateway 패턴',
      duration: 30,
      content: {
        objectives: ['API Gateway 설계', 'Rate Limiting', 'Fallback 전략'],
        videoUrl: 'https://www.youtube.com/watch?v=api-gateway-placeholder',
        transcript: `
## LLM API Gateway

### 아키텍처

\`\`\`
클라이언트
    │
    ▼
API Gateway (Kong, AWS API Gateway)
├── 인증/인가
├── Rate Limiting
├── 로깅
└── 라우팅
    │
    ▼
LLM Router
├── OpenAI (기본)
├── Anthropic (Fallback 1)
└── Self-hosted (Fallback 2)
\`\`\`

### LiteLLM 통합 인터페이스

\`\`\`python
from litellm import completion

# 동일한 인터페이스로 여러 모델 호출
response = completion(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}]
)

# Fallback 설정
response = completion(
    model="gpt-4o",
    messages=[...],
    fallbacks=["claude-3-sonnet", "llama-3-70b"]
)
\`\`\`

### Rate Limiting

\`\`\`python
from fastapi import FastAPI
from slowapi import Limiter

limiter = Limiter(key_func=get_user_id)
app = FastAPI()

@app.post("/chat")
@limiter.limit("60/minute")  # 분당 60회
async def chat(request: ChatRequest):
    return await llm_call(request)
\`\`\`
        `
      }
    }
  ]
}

const day2: Day = {
  slug: 'vllm-deployment',
  title: 'vLLM 배포',
  totalDuration: 180,
  tasks: [
    {
      id: 'vllm-video',
      type: 'video',
      title: 'vLLM 설치 & 설정',
      duration: 35,
      content: {
        objectives: ['vLLM 아키텍처 이해', 'GPU 인스턴스 설정', 'OpenAI 호환 서버'],
        videoUrl: 'https://www.youtube.com/watch?v=vllm-placeholder',
        transcript: `
## vLLM

### vLLM이란?

**고처리량 LLM 추론 엔진**입니다.

\`\`\`
특징:
├── PagedAttention: 메모리 효율 최적화
├── Continuous Batching: 동적 배치
├── OpenAI 호환 API
└── 다양한 모델 지원
\`\`\`

### 설치 및 실행

\`\`\`bash
# 설치
pip install vllm

# 서버 실행
python -m vllm.entrypoints.openai.api_server \\
    --model meta-llama/Meta-Llama-3-8B-Instruct \\
    --port 8000 \\
    --gpu-memory-utilization 0.9
\`\`\`

### OpenAI SDK로 호출

\`\`\`python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="dummy"
)

response = client.chat.completions.create(
    model="meta-llama/Meta-Llama-3-8B-Instruct",
    messages=[{"role": "user", "content": "Hello"}]
)
\`\`\`

### Docker 배포

\`\`\`dockerfile
FROM vllm/vllm-openai:latest

CMD ["--model", "meta-llama/Meta-Llama-3-8B-Instruct", \\
     "--port", "8000", \\
     "--gpu-memory-utilization", "0.9"]
\`\`\`
        `
      }
    }
  ]
}

const day3: Day = {
  slug: 'bedrock',
  title: 'AWS Bedrock',
  totalDuration: 180,
  tasks: [
    {
      id: 'bedrock-video',
      type: 'video',
      title: 'AWS Bedrock 활용',
      duration: 30,
      content: {
        objectives: ['Bedrock 모델 선택', 'API 호출 방법', 'Knowledge Bases 연동'],
        videoUrl: 'https://www.youtube.com/watch?v=bedrock-placeholder',
        transcript: `
## AWS Bedrock

### Bedrock이란?

**AWS 관리형 생성형 AI 서비스**입니다.

\`\`\`
지원 모델:
├── Anthropic Claude 3.5 Sonnet
├── Meta Llama 3
├── Amazon Titan
├── Mistral
└── Cohere
\`\`\`

### API 호출

\`\`\`python
import boto3
import json

bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

response = bedrock.invoke_model(
    modelId='anthropic.claude-3-sonnet-20240229-v1:0',
    body=json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "messages": [
            {"role": "user", "content": "Hello"}
        ]
    })
)

result = json.loads(response['body'].read())
print(result['content'][0]['text'])
\`\`\`

### Knowledge Bases

\`\`\`
자동 RAG 파이프라인:
S3 문서 → 자동 청킹 → 임베딩 → OpenSearch/Pinecone
                                    │
                                    ▼
                              쿼리 API
\`\`\`
        `
      }
    }
  ]
}

const day4: Day = {
  slug: 'llm-monitoring',
  title: 'LLM 모니터링 & 최적화',
  totalDuration: 180,
  tasks: [
    {
      id: 'monitoring-video',
      type: 'video',
      title: 'LLM 서빙 모니터링',
      duration: 30,
      content: {
        objectives: ['핵심 메트릭 정의', 'LangSmith/Langfuse 활용', '비용 추적'],
        videoUrl: 'https://www.youtube.com/watch?v=llm-monitoring-placeholder',
        transcript: `
## LLM 모니터링

### 핵심 메트릭

| 메트릭 | 설명 | 목표 |
|--------|------|------|
| **Latency** | 응답 시간 | < 2초 |
| **TTFT** | 첫 토큰 시간 | < 500ms |
| **TPS** | 초당 토큰 | > 50 |
| **Token Cost** | 토큰당 비용 | 최소화 |
| **Error Rate** | 오류율 | < 1% |

### Langfuse 연동

\`\`\`python
from langfuse.decorators import observe
from langfuse import Langfuse

langfuse = Langfuse()

@observe()
def generate_response(prompt: str):
    response = openai.chat.completions.create(...)
    return response

# 자동 추적:
# - 입력/출력
# - 지연 시간
# - 토큰 사용량
# - 비용
\`\`\`

### 비용 최적화

\`\`\`
전략:
├── 적절한 모델 선택 (복잡도에 맞게)
├── 프롬프트 캐싱
├── 배치 처리 (비동기)
├── 컨텍스트 압축
└── Fallback 체인
\`\`\`
        `
      }
    }
  ]
}

const day5: Day = {
  slug: 'llm-project',
  title: '🏆 Week 7 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'week7-challenge',
      type: 'challenge',
      title: 'Production LLM 서빙 시스템',
      duration: 120,
      content: {
        objectives: ['확장 가능한 LLM 서빙 구축', '비용 효율적 아키텍처', '모니터링 대시보드'],
        requirements: [
          'LLM API Gateway (인증, Rate Limiting)',
          '다중 모델 라우팅 (OpenAI + Bedrock + Self-hosted)',
          'Fallback 및 Retry 로직',
          'Langfuse 모니터링 연동',
          'CloudWatch 대시보드',
          '비용 추적 및 알림'
        ],
        evaluationCriteria: ['시스템 안정성 (30%)', '비용 효율성 (25%)', '모니터링 완성도 (25%)', '문서화 (20%)'],
        bonusPoints: ['스트리밍 응답', '프롬프트 캐싱', 'A/B 테스트']
      }
    }
  ]
}

export const llmServingWeek: Week = {
  slug: 'llm-serving',
  week: 7,
  phase: 4,
  month: 9,
  access: 'pro',
  title: 'LLM 서빙',
  topics: ['vLLM', 'AWS Bedrock', 'API Gateway', 'LiteLLM', 'Langfuse', '비용 최적화'],
  practice: 'Production LLM 서빙 시스템',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
