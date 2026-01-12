// Week 12 Day 1: Filter Methods
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'p2w4d1t1',
    type: 'video',
    title: 'Filter Methods 개요',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# Filter Methods

## 피처 선택이 필요한 이유

\\\`\\\`\\\`
1. 과적합 방지: 불필요한 피처는 노이즈
2. 해석성 향상: 적은 피처 = 이해하기 쉬움
3. 학습 속도 개선: 차원 감소 = 빠른 학습
4. 다중공선성 해결: 상관된 피처 제거
\\\`\\\`\\\`

## Filter Methods란?

모델과 독립적으로 피처를 평가하는 방법

## 1. 분산 기반 필터링

\\\`\\\`\\\`python
from sklearn.feature_selection import VarianceThreshold

# 분산이 낮은 피처 제거 (거의 상수)
selector = VarianceThreshold(threshold=0.01)
X_filtered = selector.fit_transform(X)

# 선택된 피처 확인
selected = X.columns[selector.get_support()]
print(f"선택된 피처: {len(selected)}/{len(X.columns)}")
\\\`\\\`\\\`

## 2. 상관관계 기반

\\\`\\\`\\\`python
# 타겟과의 상관관계
target_corr = X.corrwith(y).abs().sort_values(ascending=False)
top_features = target_corr.head(20).index

# 피처 간 상관관계 (다중공선성 제거)
corr_matrix = X.corr().abs()
upper = corr_matrix.where(
    np.triu(np.ones(corr_matrix.shape), k=1).astype(bool)
)
to_drop = [col for col in upper.columns if any(upper[col] > 0.95)]
print(f"제거할 피처 (상관 > 0.95): {to_drop}")
\\\`\\\`\\\`

## 3. 통계 검정 (SelectKBest)

\\\`\\\`\\\`python
from sklearn.feature_selection import SelectKBest, f_classif, mutual_info_classif

# ANOVA F-value (분류)
selector = SelectKBest(f_classif, k=20)
X_selected = selector.fit_transform(X, y)

# Mutual Information
selector = SelectKBest(mutual_info_classif, k=20)
X_selected = selector.fit_transform(X, y)

# 점수 확인
scores = pd.DataFrame({
    'feature': X.columns,
    'score': selector.scores_
}).sort_values('score', ascending=False)
\\\`\\\`\\\`

## 4. chi2 (범주형)

\\\`\\\`\\\`python
from sklearn.feature_selection import chi2

# 범주형 피처에 적합 (음수 불가)
X_positive = X - X.min()  # 양수로 변환
selector = SelectKBest(chi2, k=20)
X_selected = selector.fit_transform(X_positive, y)
\\\`\\\`\\\`

## Filter Methods 비교

| 방법 | 장점 | 단점 |
|------|------|------|
| 분산 | 단순, 빠름 | 타겟 무관 |
| 상관관계 | 직관적 | 비선형 무시 |
| F-test | 빠름 | 선형 관계만 |
| MI | 비선형 포착 | 느림 |
`,
      objectives: [
        'Filter Methods의 종류와 특징을 이해한다',
        '상황에 맞는 Filter를 선택할 수 있다',
        'sklearn의 피처 선택 도구를 활용할 수 있다'
      ],
      keyPoints: [
        '분산: 거의 상수인 피처 제거',
        '상관관계: 중복 피처 제거',
        'F-test: 타겟과의 선형 관계',
        'MI: 비선형 관계 포착'
      ]
    }
  },
  {
    id: 'p2w4d1t2',
    type: 'code',
    title: '실습: Filter Methods',
    duration: 40,
    content: {
      instructions: `# Filter Methods 실습

## 목표
다양한 Filter 방법으로 피처를 선택하고 비교하세요.

## 요구사항
1. 분산 기반 필터링
2. 상관관계 기반 필터링
3. SelectKBest (f_classif, mutual_info)
4. 선택된 피처 비교
`,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.feature_selection import VarianceThreshold, SelectKBest, f_classif, mutual_info_classif

np.random.seed(42)
n = 500

# 샘플 데이터 (유의미 피처 + 노이즈)
X = pd.DataFrame({
    'feat_important_1': np.random.normal(0, 1, n) + np.random.randint(0, 2, n),
    'feat_important_2': np.random.normal(0, 1, n) * np.random.randint(0, 2, n),
    'feat_important_3': np.random.uniform(0, 1, n) + np.random.randint(0, 2, n) * 0.5,
    'noise_1': np.random.normal(0, 1, n),
    'noise_2': np.random.normal(0, 1, n),
    'noise_3': np.random.normal(0, 1, n),
    'constant_like': np.random.normal(0, 0.01, n),  # 거의 상수
    'correlated': None  # 아래에서 설정
})
X['correlated'] = X['feat_important_1'] * 0.9 + np.random.normal(0, 0.1, n)

y = np.random.randint(0, 2, n)

print("원본 데이터:", X.shape)

# TODO: Filter Methods 적용
`,
      solutionCode: `import pandas as pd
import numpy as np
from sklearn.feature_selection import VarianceThreshold, SelectKBest, f_classif, mutual_info_classif

np.random.seed(42)
n = 500

X = pd.DataFrame({
    'feat_important_1': np.random.normal(0, 1, n) + np.random.randint(0, 2, n),
    'feat_important_2': np.random.normal(0, 1, n) * np.random.randint(0, 2, n),
    'feat_important_3': np.random.uniform(0, 1, n) + np.random.randint(0, 2, n) * 0.5,
    'noise_1': np.random.normal(0, 1, n),
    'noise_2': np.random.normal(0, 1, n),
    'noise_3': np.random.normal(0, 1, n),
    'constant_like': np.random.normal(0, 0.01, n),
    'correlated': None
})
X['correlated'] = X['feat_important_1'] * 0.9 + np.random.normal(0, 0.1, n)
y = np.random.randint(0, 2, n)

print("=== 1. 분산 기반 필터링 ===")
var_selector = VarianceThreshold(threshold=0.01)
var_selector.fit(X)
var_selected = X.columns[var_selector.get_support()].tolist()
print(f"분산 > 0.01: {var_selected}")

print("\\n=== 2. 상관관계 기반 ===")
corr_matrix = X.corr().abs()
upper = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool))
high_corr = [col for col in upper.columns if any(upper[col] > 0.8)]
print(f"높은 상관 (>0.8): {high_corr}")

print("\\n=== 3. F-test (SelectKBest) ===")
f_selector = SelectKBest(f_classif, k=5)
f_selector.fit(X, y)
f_scores = pd.DataFrame({
    'feature': X.columns,
    'score': f_selector.scores_
}).sort_values('score', ascending=False)
print(f_scores)

print("\\n=== 4. Mutual Information ===")
mi_selector = SelectKBest(mutual_info_classif, k=5)
mi_selector.fit(X, y)
mi_scores = pd.DataFrame({
    'feature': X.columns,
    'score': mi_selector.scores_
}).sort_values('score', ascending=False)
print(mi_scores)

print("\\n=== 종합 ===")
f_top5 = set(f_scores.head(5)['feature'])
mi_top5 = set(mi_scores.head(5)['feature'])
common = f_top5 & mi_top5
print(f"공통 선택 피처: {common}")
`,
      hints: [
        'VarianceThreshold(threshold=0.01)로 분산 필터링',
        'corr().abs()로 상관관계 행렬',
        'SelectKBest(f_classif, k=5)로 상위 5개 선택'
      ]
    }
  },
  {
    id: 'p2w4d1t3',
    type: 'quiz',
    title: 'Day 1 퀴즈',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Filter Methods의 특징은?',
          options: ['모델 의존적', '모델 독립적', '느린 속도', '항상 최적'],
          answer: 1
        },
        {
          question: 'Mutual Information의 장점은?',
          options: ['빠른 속도', '비선형 관계 포착', '단순함', '해석 용이'],
          answer: 1
        },
        {
          question: '분산이 0인 피처를 제거해야 하는 이유는?',
          options: ['메모리 절약', '정보가 없음 (상수)', '계산 오류 방지', '정규화 필요'],
          answer: 1
        }
      ]
    }
  }
]
