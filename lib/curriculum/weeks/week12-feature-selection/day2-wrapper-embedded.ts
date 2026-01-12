// Week 12 Day 2: Wrapper & Embedded Methods
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'p2w4d2t1',
    type: 'video',
    title: 'Wrapper Methods (RFE, SFS)',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# Wrapper Methods

## Wrapper Methods란?

모델의 성능을 기준으로 피처 부분집합을 평가

## 1. RFE (Recursive Feature Elimination)

\\\`\\\`\\\`python
from sklearn.feature_selection import RFE, RFECV
from sklearn.ensemble import RandomForestClassifier

# 기본 RFE
estimator = RandomForestClassifier(n_estimators=100, random_state=42)
selector = RFE(estimator, n_features_to_select=20, step=1)
selector.fit(X, y)

# 선택된 피처
selected = X.columns[selector.support_]
print(f"선택된 피처: {list(selected)}")

# 순위 확인
ranking = pd.DataFrame({
    'feature': X.columns,
    'ranking': selector.ranking_
}).sort_values('ranking')
\\\`\\\`\\\`

## 2. RFECV (최적 피처 수 자동 결정)

\\\`\\\`\\\`python
# 교차 검증으로 최적 피처 수 결정
selector = RFECV(
    estimator=RandomForestClassifier(n_estimators=100),
    step=1,
    cv=5,
    scoring='accuracy'
)
selector.fit(X, y)

print(f"최적 피처 수: {selector.n_features_}")

# 피처 수별 성능 시각화
plt.plot(range(1, len(selector.cv_results_['mean_test_score']) + 1),
         selector.cv_results_['mean_test_score'])
plt.xlabel('Number of Features')
plt.ylabel('CV Score')
\\\`\\\`\\\`

## 3. Sequential Feature Selection

\\\`\\\`\\\`python
from sklearn.feature_selection import SequentialFeatureSelector

# Forward Selection
sfs_forward = SequentialFeatureSelector(
    estimator, n_features_to_select=20, direction='forward'
)
sfs_forward.fit(X, y)

# Backward Selection
sfs_backward = SequentialFeatureSelector(
    estimator, n_features_to_select=20, direction='backward'
)
sfs_backward.fit(X, y)

forward_features = X.columns[sfs_forward.get_support()]
backward_features = X.columns[sfs_backward.get_support()]
\\\`\\\`\\\`
`,
      objectives: [
        'RFE의 원리와 사용법을 이해한다',
        'RFECV로 최적 피처 수를 결정할 수 있다',
        'Forward/Backward Selection을 이해한다'
      ],
      keyPoints: [
        'RFE: 재귀적으로 가장 약한 피처 제거',
        'RFECV: CV로 최적 피처 수 결정',
        'Forward: 빈 집합에서 추가',
        'Backward: 전체에서 제거'
      ]
    }
  },
  {
    id: 'p2w4d2t2',
    type: 'video',
    title: 'Embedded Methods (Lasso, Tree)',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# Embedded Methods

## Embedded Methods란?

모델 학습 과정에서 피처 선택이 함께 이루어짐

## 1. Lasso (L1 Regularization)

\\\`\\\`\\\`python
from sklearn.linear_model import LassoCV

# Lasso로 피처 선택
lasso = LassoCV(cv=5, random_state=42)
lasso.fit(X, y)

# 계수가 0이 아닌 피처 선택
selected = X.columns[lasso.coef_ != 0]
print(f"선택된 피처: {len(selected)}")

# 계수 시각화
coef = pd.DataFrame({
    'feature': X.columns,
    'coef': lasso.coef_
}).sort_values('coef', ascending=False, key=abs)
\\\`\\\`\\\`

## 2. Tree-based Importance

\\\`\\\`\\\`python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# Feature Importance
importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)

# 상위 N개 선택
top_n = 20
selected = importance.head(top_n)['feature'].tolist()
\\\`\\\`\\\`

## 3. SelectFromModel

\\\`\\\`\\\`python
from sklearn.feature_selection import SelectFromModel

# 자동 임계값으로 선택
selector = SelectFromModel(
    RandomForestClassifier(n_estimators=100),
    threshold='median'  # 또는 'mean', 숫자
)
selector.fit(X, y)

X_selected = selector.transform(X)
selected = X.columns[selector.get_support()]
\\\`\\\`\\\`

## 방법 비교

| 방법 | 속도 | 정확도 | 피처 상호작용 |
|------|------|--------|--------------|
| Filter | 빠름 | 낮음 | 무시 |
| Wrapper | 느림 | 높음 | 고려 |
| Embedded | 중간 | 중간 | 일부 고려 |
`,
      objectives: [
        'Lasso의 피처 선택 효과를 이해한다',
        'Tree Importance를 활용할 수 있다',
        'SelectFromModel을 사용할 수 있다'
      ],
      keyPoints: [
        'Lasso: L1으로 계수를 0으로 만듦',
        'Tree Importance: split 기반',
        'SelectFromModel: 자동 임계값'
      ]
    }
  },
  {
    id: 'p2w4d2t3',
    type: 'code',
    title: '실습: Wrapper & Embedded',
    duration: 40,
    content: {
      instructions: `# Wrapper & Embedded Methods 실습

## 목표
RFE, Lasso, Tree Importance를 비교하세요.

## 요구사항
1. RFECV로 최적 피처 수 결정
2. Lasso 피처 선택
3. Tree Importance
4. 방법 간 비교
`,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_selection import RFECV, SelectFromModel
from sklearn.linear_model import LassoCV
from sklearn.ensemble import RandomForestClassifier

np.random.seed(42)
n = 500

X = pd.DataFrame({
    f'feat_{i}': np.random.normal(0, 1, n) for i in range(20)
})
y = (X['feat_0'] + X['feat_1'] * 2 + np.random.normal(0, 0.5, n) > 0).astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# TODO: 피처 선택 방법 비교
`,
      solutionCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_selection import RFECV, SelectFromModel
from sklearn.linear_model import LassoCV, LogisticRegression
from sklearn.ensemble import RandomForestClassifier

np.random.seed(42)
n = 500

X = pd.DataFrame({f'feat_{i}': np.random.normal(0, 1, n) for i in range(20)})
y = (X['feat_0'] + X['feat_1'] * 2 + np.random.normal(0, 0.5, n) > 0).astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

print("=== 1. RFECV ===")
rfecv = RFECV(RandomForestClassifier(n_estimators=50), step=1, cv=3, scoring='accuracy')
rfecv.fit(X_train, y_train)
rfe_features = X.columns[rfecv.support_].tolist()
print(f"최적 피처 수: {rfecv.n_features_}")
print(f"선택된 피처: {rfe_features}")

print("\\n=== 2. Lasso ===")
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
lasso = LogisticRegression(penalty='l1', solver='saga', max_iter=1000, random_state=42)
lasso.fit(X_train_scaled, y_train)
lasso_features = X.columns[lasso.coef_[0] != 0].tolist()
print(f"선택된 피처: {lasso_features}")

print("\\n=== 3. Tree Importance ===")
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)
tree_features = importance.head(5)['feature'].tolist()
print(f"상위 5개: {tree_features}")

print("\\n=== 비교 ===")
print(f"RFE: {set(rfe_features)}")
print(f"Lasso: {set(lasso_features)}")
print(f"Tree: {set(tree_features)}")
common = set(rfe_features) & set(lasso_features) & set(tree_features)
print(f"공통: {common}")
`,
      hints: [
        'RFECV로 최적 피처 수 자동 결정',
        'Lasso는 스케일링 필수',
        'rf.feature_importances_로 중요도'
      ]
    }
  },
  {
    id: 'p2w4d2t4',
    type: 'quiz',
    title: 'Day 2 퀴즈',
    duration: 10,
    content: {
      questions: [
        {
          question: 'RFE의 동작 방식은?',
          options: ['중요한 피처 추가', '약한 피처 제거', '랜덤 선택', '상관관계 기반'],
          answer: 1
        },
        {
          question: 'Lasso가 피처 선택을 수행하는 이유는?',
          options: ['L2 규제', 'L1 규제로 계수를 0으로', '드롭아웃', '조기 종료'],
          answer: 1
        },
        {
          question: 'Wrapper Methods의 단점은?',
          options: ['낮은 정확도', '느린 속도', '단순함', '모델 독립적'],
          answer: 1
        }
      ]
    }
  }
]
