// Week 12 Day 4: 실무 팁 & 전략
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'p2w4d4t1',
    type: 'video',
    title: '피처 선택 전략 종합',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 피처 선택 전략 종합

## 단계별 접근법

\\\`\\\`\\\`
1단계: Filter로 빠르게 감소
   - 분산 0인 피처 제거
   - 높은 상관관계 피처 제거
   - 1000개 → 200개

2단계: Embedded로 추가 선택
   - Tree Importance 또는 Lasso
   - 200개 → 50개

3단계: Wrapper로 미세 조정 (선택적)
   - RFECV로 최적 수 결정
   - 50개 → 30개
\\\`\\\`\\\`

## 실무 파이프라인

\\\`\\\`\\\`python
from sklearn.pipeline import Pipeline
from sklearn.feature_selection import VarianceThreshold, SelectFromModel

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('var_filter', VarianceThreshold(threshold=0.01)),
    ('tree_select', SelectFromModel(
        RandomForestClassifier(n_estimators=100),
        threshold='median'
    )),
    ('model', LogisticRegression())
])

# 교차 검증
cv_scores = cross_val_score(pipeline, X, y, cv=5)
print(f"CV Score: {cv_scores.mean():.4f}")
\\\`\\\`\\\`

## 피처 수 결정 가이드

\\\`\\\`\\\`
샘플 수 vs 피처 수 비율:
- 이상적: 샘플 / 피처 ≥ 10
- 최소: 샘플 / 피처 ≥ 5
- 위험: 샘플 < 피처 (과적합 위험)

예: 1000 샘플 → 100-200 피처 권장
\\\`\\\`\\\`

## 흔한 실수

\\\`\\\`\\\`
1. 테스트 데이터로 피처 선택 → 데이터 누수!
2. 피처 선택 전 스케일링 안 함
3. 상관관계만 보고 비선형 관계 무시
4. 피처 수에 과도하게 집착
\\\`\\\`\\\`
`,
      objectives: [
        '단계별 피처 선택 전략을 이해한다',
        '적절한 피처 수를 판단할 수 있다',
        '흔한 실수를 피할 수 있다'
      ],
      keyPoints: [
        'Filter → Embedded → Wrapper 순서',
        '샘플/피처 비율 10:1 이상 권장',
        '테스트 데이터 누수 주의',
        'Pipeline으로 자동화'
      ]
    }
  },
  {
    id: 'p2w4d4t2',
    type: 'code',
    title: '실습: 통합 피처 선택 파이프라인',
    duration: 45,
    content: {
      instructions: `# 통합 피처 선택 파이프라인 실습

## 목표
Filter → Embedded 순서로 피처를 선택하고 성능을 비교하세요.

## 요구사항
1. 분산 필터 적용
2. Tree-based 선택
3. 전체 파이프라인 구축
4. 원본 vs 선택 후 성능 비교
`,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import VarianceThreshold, SelectFromModel
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

# 고차원 데이터
X, y = make_classification(n_samples=500, n_features=100, n_informative=20,
                           n_redundant=30, n_clusters_per_class=2, random_state=42)
X = pd.DataFrame(X, columns=[f'feat_{i}' for i in range(100)])

print(f"원본 Shape: {X.shape}")

# TODO: 피처 선택 파이프라인 구축
`,
      solutionCode: `import pandas as pd
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import VarianceThreshold, SelectFromModel
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

X, y = make_classification(n_samples=500, n_features=100, n_informative=20,
                           n_redundant=30, n_clusters_per_class=2, random_state=42)
X = pd.DataFrame(X, columns=[f'feat_{i}' for i in range(100)])

print(f"원본 Shape: {X.shape}")

# 1. 베이스라인 (모든 피처)
print("\\n=== 베이스라인 (100 피처) ===")
baseline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', LogisticRegression(max_iter=1000))
])
baseline_cv = cross_val_score(baseline, X, y, cv=5)
print(f"CV Accuracy: {baseline_cv.mean():.4f}")

# 2. 피처 선택 파이프라인
print("\\n=== 피처 선택 파이프라인 ===")
feature_selection_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('var_filter', VarianceThreshold(threshold=0.01)),
    ('tree_select', SelectFromModel(
        RandomForestClassifier(n_estimators=100, random_state=42),
        threshold='median'
    )),
    ('model', LogisticRegression(max_iter=1000))
])

fs_cv = cross_val_score(feature_selection_pipeline, X, y, cv=5)
print(f"CV Accuracy: {fs_cv.mean():.4f}")

# 선택된 피처 수 확인
feature_selection_pipeline.fit(X, y)
var_mask = feature_selection_pipeline.named_steps['var_filter'].get_support()
tree_mask = feature_selection_pipeline.named_steps['tree_select'].get_support()
n_selected = sum(tree_mask)
print(f"선택된 피처 수: {n_selected}")

# 비교
print("\\n=== 비교 ===")
print(f"베이스라인: {baseline_cv.mean():.4f} (100 피처)")
print(f"피처 선택: {fs_cv.mean():.4f} ({n_selected} 피처)")
improvement = (fs_cv.mean() - baseline_cv.mean()) / baseline_cv.mean() * 100
print(f"변화: {improvement:+.2f}%")
`,
      hints: [
        'Pipeline으로 전처리+선택+모델 연결',
        'SelectFromModel(threshold="median")로 상위 50% 선택',
        'cross_val_score로 성능 비교'
      ]
    }
  },
  {
    id: 'p2w4d4t3',
    type: 'quiz',
    title: 'Day 4 퀴즈',
    duration: 10,
    content: {
      questions: [
        {
          question: '권장되는 피처 선택 순서는?',
          options: ['Wrapper → Filter', 'Filter → Embedded', 'Embedded → Filter', '랜덤'],
          answer: 1,
          explanation: 'Filter(빠름)로 대량 제거 → Embedded(중간)로 정제 → Wrapper(느림)로 미세조정 순서가 효율적입니다. 반대로 하면 불필요하게 시간이 많이 걸립니다.'
        },
        {
          question: '샘플 500개일 때 권장 피처 수는?',
          options: ['500개', '50-100개', '1000개', '10개'],
          answer: 1,
          explanation: '샘플/피처 비율이 최소 5:1 이상 권장됩니다. 500 샘플이면 50-100개 피처가 적당합니다. 피처가 너무 많으면 과적합 위험이 높아집니다.'
        },
        {
          question: '피처 선택에서 데이터 누수가 발생하는 경우는?',
          options: ['학습 데이터만 사용', '테스트 데이터로 선택', 'CV 사용', '스케일링'],
          answer: 1,
          explanation: '테스트 데이터를 피처 선택에 사용하면 테스트 데이터의 정보가 모델에 누출됩니다. 피처 선택은 반드시 학습 데이터만으로 수행해야 합니다.'
        }
      ]
    }
  },
  {
    id: 'p2w4d4t4',
    type: 'video',
    title: 'AutoML 시대의 피처 선택',
    duration: 18,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# AutoML 시대의 피처 선택

## AutoML 도구들의 피처 선택

\\\`\\\`\\\`
주요 AutoML 도구:
├── TPOT: 유전 알고리즘 기반
├── Auto-sklearn: 베이지안 최적화
├── H2O AutoML: 내장 피처 선택
└── FLAML (Microsoft): 빠른 AutoML
\\\`\\\`\\\`

## TPOT 피처 선택 예시

\\\`\\\`\\\`python
from tpot import TPOTClassifier

# TPOT이 자동으로 최적의 피처 선택 + 모델 조합 탐색
tpot = TPOTClassifier(
    generations=5,
    population_size=50,
    verbosity=2,
    random_state=42
)

tpot.fit(X_train, y_train)

# 최적 파이프라인 확인
print(tpot.fitted_pipeline_)
# 예: SelectPercentile(f_classif, 80) + RandomForest
\\\`\\\`\\\`

## Feature-engine 라이브러리

\\\`\\\`\\\`python
from feature_engine.selection import (
    DropConstantFeatures,
    DropDuplicateFeatures,
    DropCorrelatedFeatures,
    SelectByShuffling
)

# 상수 제거
constant_dropper = DropConstantFeatures(tol=0.98)

# 중복 제거
duplicate_dropper = DropDuplicateFeatures()

# 상관관계 기반 제거
corr_dropper = DropCorrelatedFeatures(threshold=0.9)

# Pipeline 구성
from sklearn.pipeline import Pipeline
fs_pipeline = Pipeline([
    ('constant', DropConstantFeatures(tol=0.98)),
    ('duplicate', DropDuplicateFeatures()),
    ('correlation', DropCorrelatedFeatures(threshold=0.9))
])
\\\`\\\`\\\`

## Boruta 알고리즘

\\\`\\\`\\\`python
from boruta import BorutaPy
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_jobs=-1)
boruta = BorutaPy(rf, n_estimators='auto', verbose=2)

boruta.fit(X_train.values, y_train)

# 선택된 피처
selected = X_train.columns[boruta.support_].tolist()
print(f"Boruta 선택: {len(selected)}개")
\\\`\\\`\\\`

## 언제 수동 vs AutoML?

| 상황 | 추천 |
|------|------|
| 빠른 베이스라인 필요 | AutoML |
| 도메인 지식 있음 | 수동 |
| 해석성 중요 | 수동 |
| 시간 제한 | AutoML |
| 경진대회 | 둘 다 시도 |
`,
      objectives: [
        'AutoML 도구의 피처 선택 방식을 이해한다',
        'Feature-engine, Boruta 등 고급 라이브러리를 알아본다'
      ],
      keyPoints: [
        'AutoML이 피처 선택까지 자동화',
        'Feature-engine: 다양한 선택 기법 제공',
        'Boruta: 랜덤 피처와 비교하여 선택',
        '수동 vs AutoML 상황별 선택'
      ]
    }
  },
  {
    id: 'p2w4d4t5',
    type: 'challenge',
    title: '도전과제: 피처 선택 벤치마크',
    duration: 35,
    content: {
      instructions: `# 도전과제: 피처 선택 방법 벤치마크

## 목표
여러 피처 선택 방법을 벤치마크하여 성능과 속도를 비교하세요.

## 요구사항

### 1. 5가지 방법 비교
- Filter: SelectKBest (f_classif)
- Embedded: SelectFromModel (RandomForest)
- Wrapper: RFE (LogisticRegression)
- 차원 축소: PCA
- 기준선: 모든 피처 사용

### 2. 측정 지표
- 실행 시간 (time 모듈 사용)
- CV 정확도 (5-fold)
- 선택된 피처 수
- 메모리 사용량 (선택사항)

### 3. 결과 시각화
- 정확도 vs 피처 수 산점도
- 실행 시간 막대 그래프
- 방법별 비교 테이블

## 보너스
- 피처 수를 변화시키며 (10, 20, 30, 50) 성능 곡선 그리기
- 공통으로 선택된 피처 분석 (벤 다이어그램)
`,
      starterCode: `import pandas as pd
import numpy as np
import time
from sklearn.datasets import make_classification
from sklearn.model_selection import cross_val_score
from sklearn.feature_selection import SelectKBest, f_classif, SelectFromModel, RFE
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

# 데이터 생성
X, y = make_classification(
    n_samples=1000, n_features=100,
    n_informative=20, n_redundant=30,
    random_state=42
)
X = pd.DataFrame(X, columns=[f'feat_{i}' for i in range(100)])

print(f"데이터 Shape: {X.shape}")

# 결과 저장
results = []

# 모델
model = LogisticRegression(max_iter=1000)

# TODO: 1. 기준선 (모든 피처)

# TODO: 2. Filter (SelectKBest)

# TODO: 3. Embedded (SelectFromModel)

# TODO: 4. Wrapper (RFE)

# TODO: 5. PCA

# 결과 출력
results_df = pd.DataFrame(results)
print("\\n=== 벤치마크 결과 ===")
print(results_df.to_string(index=False))
`,
      hints: [
        'time.time()으로 시작/종료 시간 측정',
        'cross_val_score(model, X_selected, y, cv=5).mean()으로 정확도',
        'SelectKBest(f_classif, k=30), RFE(model, n_features_to_select=30)',
        'PCA(n_components=30)으로 차원 축소'
      ]
    }
  }
]
