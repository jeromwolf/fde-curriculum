// Phase 4, Week 5: SageMaker ML 인프라
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'sagemaker-intro',
  title: 'SageMaker 소개 & 노트북',
  totalDuration: 180,
  tasks: [
    {
      id: 'sagemaker-intro-video',
      type: 'video',
      title: 'AWS SageMaker 개요',
      duration: 30,
      content: {
        objectives: ['SageMaker 서비스 구성 이해', 'ML 워크플로우 파악', 'Studio vs Notebook 비교'],
        videoUrl: 'https://www.youtube.com/watch?v=sagemaker-intro-placeholder',
        transcript: `
## AWS SageMaker

### SageMaker란?

**완전 관리형 ML 플랫폼**입니다.

\`\`\`
ML 워크플로우
├── 데이터 준비 → SageMaker Data Wrangler
├── 모델 개발 → SageMaker Studio
├── 학습       → SageMaker Training
├── 튜닝       → SageMaker Hyperparameter Tuning
├── 배포       → SageMaker Endpoints
└── 모니터링   → SageMaker Model Monitor
\`\`\`

### 주요 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| **Studio** | 통합 ML IDE |
| **Notebooks** | Jupyter 노트북 인스턴스 |
| **Training Jobs** | 분산 학습 |
| **Endpoints** | 실시간 추론 |
| **Batch Transform** | 배치 추론 |
| **Pipelines** | ML 워크플로우 자동화 |

### 비용 구조

| 서비스 | 비용 |
|--------|------|
| Notebook (ml.t3.medium) | $0.05/시간 |
| Training (ml.m5.large) | $0.115/시간 |
| Endpoint (ml.t2.medium) | $0.056/시간 |
        `
      }
    },
    {
      id: 'studio-practice',
      type: 'code',
      title: 'SageMaker Studio 실습',
      duration: 60,
      content: {
        objectives: ['Studio 환경 설정', '노트북에서 모델 개발', 'S3 데이터 연동'],
        instructions: 'SageMaker Studio에서 ML 모델을 개발해보세요.',
        starterCode: `import sagemaker
from sagemaker import get_execution_role

role = get_execution_role()
session = sagemaker.Session()
bucket = session.default_bucket()

# TODO: S3에서 데이터 로드
# TODO: 데이터 전처리
# TODO: 모델 학습
`,
        solutionCode: `import sagemaker
import pandas as pd
from sagemaker import get_execution_role
from sagemaker.sklearn import SKLearn

role = get_execution_role()
session = sagemaker.Session()
bucket = session.default_bucket()

# S3에서 데이터 로드
data_location = f's3://{bucket}/data/train.csv'
df = pd.read_csv(data_location)

# 데이터 전처리
from sklearn.model_selection import train_test_split
X = df.drop('target', axis=1)
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# SageMaker SKLearn Estimator
sklearn_estimator = SKLearn(
    entry_point='train.py',
    role=role,
    instance_type='ml.m5.large',
    instance_count=1,
    framework_version='1.2-1',
    py_version='py3',
    hyperparameters={
        'n_estimators': 100,
        'max_depth': 10
    }
)

# 학습 시작
sklearn_estimator.fit({'train': data_location})
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'sagemaker-training',
  title: 'SageMaker Training Jobs',
  totalDuration: 180,
  tasks: [
    {
      id: 'training-video',
      type: 'video',
      title: '분산 학습 & 하이퍼파라미터 튜닝',
      duration: 35,
      content: {
        objectives: ['Training Job 설정', '분산 학습 구성', 'HPO 자동화'],
        videoUrl: 'https://www.youtube.com/watch?v=training-placeholder',
        transcript: `
## SageMaker Training

### Training Job 구조

\`\`\`
Training Job
├── 입력: S3 데이터 경로
├── 알고리즘: 내장/커스텀 컨테이너
├── 하이퍼파라미터
├── 인스턴스: 유형, 개수
└── 출력: S3 모델 아티팩트 경로
\`\`\`

### 내장 알고리즘

| 알고리즘 | 용도 |
|----------|------|
| XGBoost | 분류/회귀 |
| Linear Learner | 선형 모델 |
| K-Means | 클러스터링 |
| Image Classification | 이미지 분류 |
| Object Detection | 객체 탐지 |
| BlazingText | 텍스트 분류/Word2Vec |

### Hyperparameter Tuning

\`\`\`python
from sagemaker.tuner import HyperparameterTuner, ContinuousParameter

hyperparameter_ranges = {
    'learning_rate': ContinuousParameter(0.01, 0.2),
    'max_depth': IntegerParameter(3, 10),
}

tuner = HyperparameterTuner(
    estimator,
    objective_metric_name='validation:auc',
    hyperparameter_ranges=hyperparameter_ranges,
    max_jobs=20,
    max_parallel_jobs=4
)

tuner.fit({'train': train_data, 'validation': val_data})
\`\`\`
        `
      }
    }
  ]
}

const day3: Day = {
  slug: 'sagemaker-deploy',
  title: 'SageMaker 모델 배포',
  totalDuration: 180,
  tasks: [
    {
      id: 'deploy-video',
      type: 'video',
      title: '실시간 & 배치 추론',
      duration: 30,
      content: {
        objectives: ['Endpoint 배포', 'Auto Scaling 설정', 'Batch Transform'],
        videoUrl: 'https://www.youtube.com/watch?v=deploy-placeholder',
        transcript: `
## SageMaker 배포

### 배포 옵션

\`\`\`
실시간 추론 (Endpoint)
├── 밀리초 응답
├── 24/7 가동
└── Auto Scaling

배치 추론 (Batch Transform)
├── 대량 데이터 처리
├── 비용 효율적
└── 예약 실행 가능

서버리스 추론
├── 콜드 스타트 있음
├── 트래픽 기반 스케일
└── 비용: 사용한 만큼
\`\`\`

### Endpoint 배포

\`\`\`python
# 학습된 모델 배포
predictor = estimator.deploy(
    initial_instance_count=1,
    instance_type='ml.t2.medium',
    endpoint_name='my-model-endpoint'
)

# 추론
result = predictor.predict(data)

# 정리
predictor.delete_endpoint()
\`\`\`

### Multi-Model Endpoint

\`\`\`python
# 하나의 엔드포인트에서 여러 모델 서빙
from sagemaker.multidatamodel import MultiDataModel

mme = MultiDataModel(
    name='multi-model-endpoint',
    model_data_prefix=f's3://{bucket}/models/',
    ...
)
\`\`\`
        `
      }
    }
  ]
}

const day4: Day = {
  slug: 'sagemaker-mlops',
  title: 'SageMaker Pipelines & MLOps',
  totalDuration: 180,
  tasks: [
    {
      id: 'pipelines-video',
      type: 'video',
      title: 'ML 파이프라인 자동화',
      duration: 35,
      content: {
        objectives: ['SageMaker Pipelines 이해', 'Model Registry 활용', 'CI/CD for ML'],
        videoUrl: 'https://www.youtube.com/watch?v=pipelines-placeholder',
        transcript: `
## SageMaker Pipelines

### ML 파이프라인

\`\`\`
데이터 처리 → 학습 → 평가 → 조건 분기 → 모델 등록 → 배포
    │          │       │         │           │         │
    └── ProcessingStep ─┴── TrainingStep ─┴── ConditionStep ─┴── RegisterModel
\`\`\`

### 파이프라인 정의

\`\`\`python
from sagemaker.workflow.pipeline import Pipeline
from sagemaker.workflow.steps import ProcessingStep, TrainingStep

# 전처리 단계
step_process = ProcessingStep(
    name="Preprocess",
    processor=sklearn_processor,
    inputs=[...],
    outputs=[...]
)

# 학습 단계
step_train = TrainingStep(
    name="Train",
    estimator=xgb_estimator,
    inputs={...}
)

# 파이프라인 정의
pipeline = Pipeline(
    name="MyMLPipeline",
    steps=[step_process, step_train, step_eval, step_register]
)

# 실행
pipeline.upsert(role_arn=role)
execution = pipeline.start()
\`\`\`

### Model Registry

\`\`\`
Model Package Group
├── Version 1 (Pending)
├── Version 2 (Approved) → Production
└── Version 3 (Rejected)
\`\`\`
        `
      }
    }
  ]
}

const day5: Day = {
  slug: 'sagemaker-project',
  title: '🏆 Week 5 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'week5-challenge',
      type: 'challenge',
      title: 'End-to-End ML 파이프라인 구축',
      duration: 120,
      content: {
        objectives: ['완전한 MLOps 파이프라인 구축', '모델 레지스트리 활용', 'A/B 테스트 설정'],
        requirements: [
          'SageMaker Pipeline (전처리→학습→평가→배포)',
          'Hyperparameter Tuning Job',
          'Model Registry 등록',
          'Endpoint Auto Scaling',
          'Model Monitor 설정',
          'CloudWatch 대시보드'
        ],
        evaluationCriteria: ['파이프라인 완성도 (30%)', '자동화 수준 (25%)', '모니터링 설정 (25%)', '문서화 (20%)'],
        bonusPoints: ['Feature Store 통합', 'A/B Testing', 'Shadow Deployment']
      }
    }
  ]
}

export const sagemakerWeek: Week = {
  slug: 'sagemaker',
  week: 5,
  phase: 4,
  month: 8,
  access: 'pro',
  title: 'SageMaker ML 인프라',
  topics: ['SageMaker Studio', 'Training Jobs', 'Endpoints', 'Pipelines', 'MLOps'],
  practice: 'End-to-End ML 파이프라인',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
