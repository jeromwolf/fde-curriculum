// Week 11 Day 4: 피처 중요도 분석
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'p2w3d4t1',
    type: 'video',
    title: '피처 중요도 분석 방법',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 피처 중요도 분석 방법

## 왜 피처 중요도가 중요한가?

\\\`\\\`\\\`
1. 모델 해석: 어떤 피처가 예측에 기여하는가?
2. 피처 선택: 중요하지 않은 피처 제거
3. 비즈니스 인사이트: 주요 드라이버 파악
\\\`\\\`\\\`

## 1. 상관관계 기반

\\\`\\\`\\\`python
# 타겟과의 상관관계
correlations = df.corr()['target'].abs().sort_values(ascending=False)
print(correlations)

# 히트맵
import seaborn as sns
plt.figure(figsize=(12, 10))
sns.heatmap(df.corr(), annot=True, cmap='RdBu_r', center=0)
\\\`\\\`\\\`

## 2. Tree Feature Importance

\\\`\\\`\\\`python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# Feature Importances
importance = pd.DataFrame({
    'feature': X_train.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)

print(importance.head(20))
\\\`\\\`\\\`

## 3. Permutation Importance (더 신뢰성 있음)

\\\`\\\`\\\`python
from sklearn.inspection import permutation_importance

perm_importance = permutation_importance(
    rf, X_test, y_test,
    n_repeats=10, random_state=42
)

importance_df = pd.DataFrame({
    'feature': X_test.columns,
    'importance_mean': perm_importance.importances_mean,
    'importance_std': perm_importance.importances_std
}).sort_values('importance_mean', ascending=False)
\\\`\\\`\\\`

## 4. SHAP Values

\\\`\\\`\\\`python
import shap

explainer = shap.TreeExplainer(rf)
shap_values = explainer.shap_values(X_test)

# Summary Plot
shap.summary_plot(shap_values[1], X_test)

# 개별 예측 설명
shap.force_plot(explainer.expected_value[1], shap_values[1][0], X_test.iloc[0])
\\\`\\\`\\\`

## Tree Importance vs Permutation Importance

| 방법 | 장점 | 단점 |
|------|------|------|
| Tree Importance | 빠름 | 고카디널리티 편향 |
| Permutation | 정확 | 느림, 상관 피처 문제 |
| SHAP | 상세 설명 | 느림 |
`,
      objectives: [
        '다양한 피처 중요도 측정 방법을 이해한다',
        'Permutation Importance를 적용할 수 있다',
        'SHAP으로 모델을 해석할 수 있다'
      ],
      keyPoints: [
        '상관관계: 선형 관계만 포착',
        'Tree Importance: 빠르지만 편향 가능',
        'Permutation: 더 신뢰성 있음',
        'SHAP: 가장 상세한 설명'
      ]
    }
  },
  {
    id: 'p2w3d4t2',
    type: 'code',
    title: '실습: 피처 중요도 분석',
    duration: 45,
    content: {
      instructions: `# 피처 중요도 분석 실습

## 목표
생성한 피처들의 중요도를 분석하고 주요 피처를 선별하세요.

## 요구사항
1. 상관관계 분석
2. RandomForest Feature Importance
3. Permutation Importance
4. 상위 피처 선별
`,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance

np.random.seed(42)
n = 500

# 샘플 데이터 (이미 피처 엔지니어링 완료 가정)
df = pd.DataFrame({
    'age': np.random.randint(20, 60, n),
    'income': np.random.normal(50000, 15000, n),
    'purchase_count': np.random.poisson(5, n),
    'avg_purchase': np.random.uniform(50, 200, n),
    'recency': np.random.randint(1, 365, n),
    'tenure': np.random.randint(1, 10, n),
    'category_A_ratio': np.random.uniform(0, 1, n),
    'noise1': np.random.normal(0, 1, n),  # 노이즈
    'noise2': np.random.normal(0, 1, n),  # 노이즈
    'target': np.random.randint(0, 2, n)
})

X = df.drop('target', axis=1)
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# TODO: 피처 중요도 분석 구현
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance

np.random.seed(42)
n = 500

df = pd.DataFrame({
    'age': np.random.randint(20, 60, n),
    'income': np.random.normal(50000, 15000, n),
    'purchase_count': np.random.poisson(5, n),
    'avg_purchase': np.random.uniform(50, 200, n),
    'recency': np.random.randint(1, 365, n),
    'tenure': np.random.randint(1, 10, n),
    'category_A_ratio': np.random.uniform(0, 1, n),
    'noise1': np.random.normal(0, 1, n),
    'noise2': np.random.normal(0, 1, n),
    'target': np.random.randint(0, 2, n)
})

X = df.drop('target', axis=1)
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 1. 상관관계 분석
print("=== 1. 상관관계 (타겟과) ===")
correlations = df.corr()['target'].drop('target').abs().sort_values(ascending=False)
print(correlations)

# 2. RandomForest 학습
print("\\n=== 2. RandomForest Feature Importance ===")
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

tree_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)
print(tree_importance)

# 3. Permutation Importance
print("\\n=== 3. Permutation Importance ===")
perm_importance = permutation_importance(rf, X_test, y_test, n_repeats=10, random_state=42)

perm_df = pd.DataFrame({
    'feature': X.columns,
    'importance': perm_importance.importances_mean,
    'std': perm_importance.importances_std
}).sort_values('importance', ascending=False)
print(perm_df)

# 4. 상위 피처 선별
print("\\n=== 4. 상위 피처 (Permutation 기준) ===")
top_features = perm_df[perm_df['importance'] > 0]['feature'].tolist()
print(f"선별된 피처: {top_features}")
print(f"제외된 피처 (노이즈): {[f for f in X.columns if f not in top_features]}")
`,
      hints: [
        'rf.feature_importances_로 Tree Importance',
        'permutation_importance()로 Permutation Importance',
        '중요도가 0 이하인 피처는 노이즈일 가능성'
      ]
    }
  },
  {
    id: 'p2w3d4t3',
    type: 'video',
    title: 'SHAP 실전 활용',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# SHAP (SHapley Additive exPlanations) 실전 활용

## 1. SHAP이란?

게임 이론의 Shapley Value를 기반으로 각 피처의 기여도를 계산합니다.

\\\`\\\`\\\`python
# 설치
# pip install shap

import shap
from sklearn.ensemble import RandomForestClassifier

# 모델 학습
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# SHAP Explainer 생성
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)
\\\`\\\`\\\`

## 2. Summary Plot (전체 피처 중요도)

\\\`\\\`\\\`python
# Bar Plot (평균 |SHAP|)
shap.summary_plot(shap_values[1], X_test, plot_type="bar")

# Beeswarm Plot (분포까지 확인)
shap.summary_plot(shap_values[1], X_test)
\\\`\\\`\\\`

## 3. Dependence Plot (피처 vs 타겟 관계)

\\\`\\\`\\\`python
# 특정 피처의 SHAP 값 분포
shap.dependence_plot("feature_name", shap_values[1], X_test)

# 상호작용 피처 자동 선택
shap.dependence_plot("feature_name", shap_values[1], X_test, interaction_index="auto")
\\\`\\\`\\\`

## 4. Force Plot (개별 예측 설명)

\\\`\\\`\\\`python
# 단일 예측
shap.force_plot(
    explainer.expected_value[1],
    shap_values[1][0],
    X_test.iloc[0]
)

# 여러 예측
shap.force_plot(
    explainer.expected_value[1],
    shap_values[1][:100],
    X_test.iloc[:100]
)
\\\`\\\`\\\`

## 5. Waterfall Plot (세로 막대)

\\\`\\\`\\\`python
# 개별 예측의 피처별 기여도
shap.waterfall_plot(
    shap.Explanation(
        values=shap_values[1][0],
        base_values=explainer.expected_value[1],
        data=X_test.iloc[0],
        feature_names=X_test.columns.tolist()
    )
)
\\\`\\\`\\\`

## 6. 비즈니스 리포트용 코드

\\\`\\\`\\\`python
# Top 10 피처 추출
feature_importance = pd.DataFrame({
    'feature': X_test.columns,
    'importance': np.abs(shap_values[1]).mean(axis=0)
}).sort_values('importance', ascending=False)

top_10 = feature_importance.head(10)
print(top_10)
\\\`\\\`\\\`
`,
      objectives: [
        'SHAP을 사용하여 모델을 해석할 수 있다',
        '다양한 SHAP 시각화를 활용할 수 있다',
        '개별 예측을 설명할 수 있다'
      ],
      keyPoints: [
        'TreeExplainer: 트리 모델용 (빠름)',
        'Summary Plot: 전체 피처 중요도',
        'Force/Waterfall: 개별 예측 설명',
        'Dependence: 피처-타겟 관계'
      ]
    }
  },
  {
    id: 'p2w3d4t4',
    type: 'quiz',
    title: 'Day 4 퀴즈',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Permutation Importance가 Tree Importance보다 나은 점은?',
          options: ['더 빠르다', '고카디널리티 편향이 없다', '더 간단하다', '메모리 효율적이다'],
          answer: 1,
          explanation: 'Tree Importance는 분할 횟수 기반이라 고카디널리티 피처에 편향되지만, Permutation은 실제 예측 성능 변화를 측정합니다.'
        },
        {
          question: 'SHAP의 주요 장점은?',
          options: ['계산 속도', '개별 예측 설명 가능', '메모리 효율', '범용성'],
          answer: 1,
          explanation: 'SHAP은 전체 피처 중요도뿐 아니라 개별 예측에서 각 피처가 어떻게 기여했는지 설명할 수 있습니다.'
        },
        {
          question: '상관관계 분석의 한계는?',
          options: ['느리다', '비선형 관계 포착 불가', '범주형 불가', '결측치 필요'],
          answer: 1,
          explanation: '피어슨 상관계수는 선형 관계만 측정하므로, U자형이나 복잡한 비선형 관계는 포착하지 못합니다.'
        },
        {
          question: 'SHAP Summary Plot에서 색상이 의미하는 것은?',
          options: ['피처 순서', '피처 값의 크기', '예측 확률', '오차 정도'],
          answer: 1,
          explanation: 'Summary Plot에서 빨간색은 피처 값이 높음, 파란색은 낮음을 의미합니다.'
        }
      ]
    }
  },
  {
    id: 'p2w3d4t5',
    type: 'challenge',
    title: '도전과제: 모델 해석 리포트',
    duration: 30,
    content: {
      instructions: `# 도전과제: 모델 해석 리포트 작성

## 목표
RandomForest 모델을 학습하고, 피처 중요도 분석 리포트를 작성하세요.

## 요구사항
1. 모델 학습 (AUC 0.7 이상)
2. 3가지 피처 중요도 방법 비교
   - Tree Feature Importance
   - Permutation Importance
   - SHAP Values
3. 상위 10개 피처 분석
4. 비즈니스 인사이트 도출

## 평가 기준
- 분석 방법의 다양성 (30%)
- 시각화 품질 (30%)
- 인사이트 도출 (40%)

## 보너스
- SHAP Dependence Plot으로 피처 상호작용 분석
- 방법별 순위 일관성 분석
`,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.metrics import roc_auc_score
# import shap  # pip install shap

np.random.seed(42)
n = 2000

# 은행 고객 이탈 예측 데이터
df = pd.DataFrame({
    'credit_score': np.random.randint(300, 850, n),
    'age': np.random.randint(18, 70, n),
    'tenure': np.random.randint(0, 10, n),
    'balance': np.random.uniform(0, 250000, n),
    'num_products': np.random.randint(1, 5, n),
    'has_credit_card': np.random.randint(0, 2, n),
    'is_active_member': np.random.randint(0, 2, n),
    'estimated_salary': np.random.uniform(10000, 200000, n),
    'churn': np.random.randint(0, 2, n)  # 타겟
})

# 일부 상관관계 추가
df.loc[(df['age'] > 50) & (df['num_products'] > 2), 'churn'] = 1
df.loc[(df['is_active_member'] == 1) & (df['balance'] > 100000), 'churn'] = 0

print("데이터 개요:")
print(df.describe())

X = df.drop('churn', axis=1)
y = df['churn']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# TODO: 모델 학습 및 피처 중요도 분석 리포트 작성
`,
      hints: [
        'rf.feature_importances_로 Tree Importance',
        'permutation_importance(rf, X_test, y_test)로 Permutation',
        'shap.TreeExplainer(rf)로 SHAP',
        '각 방법의 순위를 비교해보세요'
      ],
      evaluationCriteria: [
        '3가지 방법 모두 적용',
        '시각화 포함',
        '방법별 결과 비교',
        '비즈니스 인사이트'
      ],
      bonusPoints: [
        'SHAP Dependence Plot 분석',
        '방법별 순위 상관관계 계산'
      ]
    }
  }
]
