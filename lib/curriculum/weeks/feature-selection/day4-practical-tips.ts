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
          answer: 1
        },
        {
          question: '샘플 500개일 때 권장 피처 수는?',
          options: ['500개', '50-100개', '1000개', '10개'],
          answer: 1
        },
        {
          question: '피처 선택에서 데이터 누수가 발생하는 경우는?',
          options: ['학습 데이터만 사용', '테스트 데이터로 선택', 'CV 사용', '스케일링'],
          answer: 1
        }
      ]
    }
  }
]
