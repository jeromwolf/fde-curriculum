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
          answer: 1,
          explanation: 'Filter Methods는 모델을 학습시키지 않고 통계적 특성만으로 피처를 평가하므로 모델 독립적입니다. 빠르지만 피처 간 상호작용을 고려하지 못하는 단점이 있습니다.'
        },
        {
          question: 'Mutual Information의 장점은?',
          options: ['빠른 속도', '비선형 관계 포착', '단순함', '해석 용이'],
          answer: 1,
          explanation: 'Mutual Information은 두 변수 간의 의존성을 측정하며, 선형/비선형 관계 모두 포착할 수 있습니다. F-test는 선형 관계만 측정하는 반면 MI는 더 일반적입니다.'
        },
        {
          question: '분산이 0인 피처를 제거해야 하는 이유는?',
          options: ['메모리 절약', '정보가 없음 (상수)', '계산 오류 방지', '정규화 필요'],
          answer: 1,
          explanation: '분산이 0이면 모든 값이 동일(상수)하므로 타겟 예측에 아무런 정보를 제공하지 못합니다. 차원만 늘리고 노이즈가 될 수 있어 제거해야 합니다.'
        }
      ]
    }
  },
  {
    id: 'p2w4d1t4',
    type: 'video',
    title: 'Filter vs Embedded vs Wrapper 비교',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 피처 선택 방법론 비교

## 세 가지 접근법

\\\`\\\`\\\`
1. Filter Methods (오늘 학습)
   - 모델 독립적
   - 통계적 측정 기반
   - 가장 빠름

2. Embedded Methods (Day 2)
   - 모델 학습 중 선택
   - Lasso, Tree Importance
   - 중간 속도

3. Wrapper Methods (Day 3)
   - 모델 성능 기반
   - RFE, Forward/Backward
   - 가장 느리지만 정확
\\\`\\\`\\\`

## 언제 어떤 방법?

\\\`\\\`\\\`
고차원 (1000+ 피처):
├── 1단계: Filter로 빠르게 축소 (1000 → 200)
├── 2단계: Embedded로 정제 (200 → 50)
└── 3단계: Wrapper로 미세조정 (50 → 30)

저차원 (100개 미만):
└── Wrapper만 사용해도 충분
\\\`\\\`\\\`

## 실전 비교 코드

\\\`\\\`\\\`python
# Filter (빠름)
from sklearn.feature_selection import SelectKBest, f_classif
filter_sel = SelectKBest(f_classif, k=20)
# 소요 시간: ~0.1초

# Embedded (중간)
from sklearn.feature_selection import SelectFromModel
from sklearn.ensemble import RandomForestClassifier
embedded_sel = SelectFromModel(RandomForestClassifier())
# 소요 시간: ~5초

# Wrapper (느림)
from sklearn.feature_selection import RFECV
wrapper_sel = RFECV(LogisticRegression(), cv=5)
# 소요 시간: ~30초 (피처 수에 따라 증가)
\\\`\\\`\\\`

## Filter 방법 선택 가이드

| 상황 | 추천 Filter |
|------|-------------|
| 연속형 타겟 | Pearson 상관계수 |
| 분류 문제 | F-test, chi2 |
| 비선형 관계 의심 | Mutual Information |
| 다중공선성 | 상관관계 행렬 |
`,
      objectives: [
        'Filter, Embedded, Wrapper의 차이를 이해한다',
        '상황에 맞는 피처 선택 전략을 수립할 수 있다'
      ],
      keyPoints: [
        'Filter: 빠름, 모델 독립적',
        'Embedded: 모델 학습과 동시 선택',
        'Wrapper: 느리지만 정확',
        '고차원은 Filter → Embedded → Wrapper 순서'
      ]
    }
  },
  {
    id: 'p2w4d1t5',
    type: 'challenge',
    title: '도전과제: 피처 선택 자동화',
    duration: 30,
    content: {
      instructions: `# 도전과제: 피처 선택 자동화 함수

## 목표
다양한 Filter 방법을 조합하여 자동으로 최적의 피처를 선택하는 함수를 구현하세요.

## 요구사항

### 1. 자동 피처 선택 함수 구현
- 분산 0인 피처 자동 제거
- 높은 상관관계 피처 자동 제거 (threshold 지정 가능)
- SelectKBest로 상위 k개 선택

### 2. 다양한 scoring 함수 지원
- f_classif (분류)
- f_regression (회귀)
- mutual_info_classif (비선형)

### 3. 결과 리포트
- 원본 피처 수
- 각 단계별 제거된 피처
- 최종 선택된 피처 목록

## 보너스
- 선택된 피처로 모델 성능 테스트
- 시각화 (제거된 이유별 파이 차트)
`,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.feature_selection import VarianceThreshold, SelectKBest, f_classif
from sklearn.datasets import make_classification

def auto_filter_select(X, y, k=20, corr_threshold=0.95, var_threshold=0.01):
    """
    자동 피처 선택 함수

    Parameters:
    -----------
    X : DataFrame - 피처 데이터
    y : array - 타겟
    k : int - 최종 선택할 피처 수
    corr_threshold : float - 상관관계 임계값
    var_threshold : float - 분산 임계값

    Returns:
    --------
    selected_features : list - 선택된 피처 이름
    report : dict - 선택 과정 리포트
    """
    report = {
        'original': len(X.columns),
        'removed_variance': [],
        'removed_correlation': [],
        'final_selected': []
    }

    # TODO: 1단계 - 분산 필터링

    # TODO: 2단계 - 상관관계 필터링

    # TODO: 3단계 - SelectKBest

    return selected_features, report

# 테스트
X, y = make_classification(n_samples=500, n_features=50,
                           n_informative=10, random_state=42)
X = pd.DataFrame(X, columns=[f'feat_{i}' for i in range(50)])
# 테스트용 상수 피처 추가
X['constant'] = 1.0
X['near_constant'] = np.random.normal(0, 0.001, 500)

selected, report = auto_filter_select(X, y, k=15)
print(f"선택된 피처: {len(selected)}개")
print(f"리포트: {report}")
`,
      hints: [
        'VarianceThreshold(threshold=var_threshold)로 분산 필터링',
        'np.triu로 상관관계 행렬의 상삼각 추출',
        'SelectKBest(f_classif, k=k)로 최종 선택'
      ]
    }
  }
]
