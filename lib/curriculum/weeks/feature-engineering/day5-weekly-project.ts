// Week 11 Day 5: Weekly Project - Feature Engineering
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'p2w3d5t1',
    type: 'reading',
    title: 'Weekly Project 가이드: Kaggle 스타일 FE',
    duration: 15,
    content: {
      markdown: `# Weekly Project: Kaggle 스타일 Feature Engineering

## 프로젝트 개요

이번 주에 배운 피처 엔지니어링 기법을 종합하여
**50개 이상의 피처를 생성**하고 모델 성능을 개선합니다.

## 데이터셋 선택

### 옵션 1: House Prices (Kaggle)
- URL: https://www.kaggle.com/c/house-prices-advanced-regression-techniques
- 수치형/범주형 혼합, 시간 피처 없음

### 옵션 2: Spaceship Titanic (Kaggle)
- URL: https://www.kaggle.com/competitions/spaceship-titanic
- 다양한 피처 유형

### 옵션 3: Store Sales (Kaggle)
- URL: https://www.kaggle.com/c/store-sales-time-series-forecasting
- 시계열 피처 중심

## 요구사항

### 1. 수치형 피처 (10개 이상)
- 비율/조합 피처
- Binning
- Groupby 집계
- 순위 피처

### 2. 범주형 피처 (10개 이상)
- 희귀 카테고리 처리
- 카테고리 조합
- Target Encoding (CV)
- Frequency Encoding

### 3. 시간 피처 (해당 시, 5개 이상)
- 기본 추출
- 주기성 인코딩
- Lag/Rolling

### 4. 피처 중요도 분석
- Permutation Importance
- 상위 20개 피처 선별

### 5. 성능 비교
- 베이스라인 (원본 피처만)
- FE 적용 후
- 개선율 계산

## 평가 기준

| 항목 | 배점 |
|------|------|
| 수치형 피처 | 20% |
| 범주형 피처 | 20% |
| 시간/텍스트 피처 | 15% |
| 피처 중요도 분석 | 20% |
| 성능 개선 | 25% |
`,
      externalLinks: [
        { title: 'House Prices', url: 'https://www.kaggle.com/c/house-prices-advanced-regression-techniques' },
        { title: 'Feature Engineering Tips', url: 'https://www.kaggle.com/learn/feature-engineering' }
      ]
    }
  },
  {
    id: 'p2w3d5t2',
    type: 'code',
    title: '프로젝트 템플릿',
    duration: 90,
    content: {
      instructions: `# Feature Engineering 프로젝트

50개 이상의 피처를 생성하고 모델 성능을 개선하세요.

## 체크리스트
- [ ] 데이터 로드 및 EDA
- [ ] 수치형 피처 10개 이상
- [ ] 범주형 피처 10개 이상
- [ ] 피처 중요도 분석
- [ ] 베이스라인 vs FE 성능 비교
`,
      starterCode: `"""
Feature Engineering 프로젝트 템플릿
Week 11 Weekly Project
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

# =============================================================================
# 1. 데이터 로드
# =============================================================================
print("=== 1. 데이터 로드 ===")

# 샘플 데이터 (실제 Kaggle 데이터로 교체)
np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'id': range(1, n + 1),
    'area': np.random.uniform(500, 3000, n),
    'bedrooms': np.random.randint(1, 6, n),
    'bathrooms': np.random.randint(1, 4, n),
    'year_built': np.random.randint(1950, 2020, n),
    'neighborhood': np.random.choice(['A', 'B', 'C', 'D', 'E'], n),
    'condition': np.random.choice(['Fair', 'Good', 'Excellent'], n),
    'price': np.random.uniform(100000, 500000, n)
})

print(f"Shape: {df.shape}")
print(df.head())

# =============================================================================
# 2. 베이스라인
# =============================================================================
print("\\n=== 2. 베이스라인 ===")

X = df.drop(['id', 'price'], axis=1)
y = df['price']

# 범주형 인코딩 (베이스라인)
X_baseline = pd.get_dummies(X, drop_first=True)
X_train, X_test, y_train, y_test = train_test_split(X_baseline, y, test_size=0.2, random_state=42)

rf = RandomForestRegressor(n_estimators=100, random_state=42)
baseline_cv = cross_val_score(rf, X_train, y_train, cv=5, scoring='neg_root_mean_squared_error')
print(f"Baseline CV RMSE: {-baseline_cv.mean():.2f}")

# =============================================================================
# 3. Feature Engineering
# =============================================================================
print("\\n=== 3. Feature Engineering ===")

df_fe = df.copy()

# TODO: 수치형 피처 (10개 이상)

# TODO: 범주형 피처 (10개 이상)

# TODO: 상호작용 피처

# =============================================================================
# 4. FE 후 모델 학습
# =============================================================================
print("\\n=== 4. FE 후 결과 ===")

# TODO: FE 데이터로 모델 학습 및 비교

# =============================================================================
# 5. 피처 중요도 분석
# =============================================================================
print("\\n=== 5. 피처 중요도 ===")

# TODO: Permutation Importance
`,
      solutionCode: `"""
Feature Engineering 프로젝트 - 완성본
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance

np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'id': range(1, n + 1),
    'area': np.random.uniform(500, 3000, n),
    'bedrooms': np.random.randint(1, 6, n),
    'bathrooms': np.random.randint(1, 4, n),
    'year_built': np.random.randint(1950, 2020, n),
    'neighborhood': np.random.choice(['A', 'B', 'C', 'D', 'E'], n),
    'condition': np.random.choice(['Fair', 'Good', 'Excellent'], n),
    'price': np.random.uniform(100000, 500000, n)
})

print("=== 1. 데이터 로드 ===")
print(f"Shape: {df.shape}")

# 베이스라인
X = df.drop(['id', 'price'], axis=1)
y = df['price']
X_baseline = pd.get_dummies(X, drop_first=True)
X_train_b, X_test_b, y_train, y_test = train_test_split(X_baseline, y, test_size=0.2, random_state=42)

rf = RandomForestRegressor(n_estimators=100, random_state=42)
baseline_cv = cross_val_score(rf, X_train_b, y_train, cv=5, scoring='neg_root_mean_squared_error')
print(f"\\n=== 2. Baseline CV RMSE: {-baseline_cv.mean():.2f} ===")

# Feature Engineering
print("\\n=== 3. Feature Engineering ===")
df_fe = df.copy()

# 수치형 피처
df_fe['price_per_sqft'] = df_fe['price'] / df_fe['area']
df_fe['total_rooms'] = df_fe['bedrooms'] + df_fe['bathrooms']
df_fe['bedroom_ratio'] = df_fe['bedrooms'] / df_fe['total_rooms']
df_fe['age'] = 2024 - df_fe['year_built']
df_fe['age_bin'] = pd.cut(df_fe['age'], bins=[0, 20, 40, 60, 100], labels=['New', 'Mid', 'Old', 'VeryOld'])
df_fe['area_bin'] = pd.qcut(df_fe['area'], q=4, labels=['Small', 'Medium', 'Large', 'XLarge'])
df_fe['neighborhood_avg_price'] = df_fe.groupby('neighborhood')['price'].transform('mean')
df_fe['neighborhood_median_area'] = df_fe.groupby('neighborhood')['area'].transform('median')
df_fe['price_vs_neighborhood'] = df_fe['price'] / df_fe['neighborhood_avg_price']
df_fe['area_rank'] = df_fe['area'].rank(pct=True)

# 범주형 피처
df_fe['neighborhood_condition'] = df_fe['neighborhood'] + '_' + df_fe['condition']

# Frequency Encoding
for col in ['neighborhood', 'condition']:
    freq = df_fe[col].value_counts(normalize=True)
    df_fe[f'{col}_freq'] = df_fe[col].map(freq)

# Target Encoding (CV)
def target_encode_cv(df, col, target, n_splits=5):
    df = df.copy()
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    df[f'{col}_target'] = 0.0
    for train_idx, val_idx in kf.split(df):
        means = df.iloc[train_idx].groupby(col)[target].mean()
        df.loc[val_idx, f'{col}_target'] = df.loc[val_idx, col].map(means)
    df[f'{col}_target'] = df[f'{col}_target'].fillna(df[target].mean())
    return df

df_fe = target_encode_cv(df_fe, 'neighborhood', 'price')
df_fe = target_encode_cv(df_fe, 'condition', 'price')

print(f"FE 후 피처 수: {len(df_fe.columns)}")

# FE 후 모델
X_fe = df_fe.drop(['id', 'price', 'neighborhood', 'condition', 'age_bin', 'area_bin', 'neighborhood_condition'], axis=1)
X_fe = pd.get_dummies(X_fe, drop_first=True)
X_train_fe, X_test_fe, y_train, y_test = train_test_split(X_fe, y, test_size=0.2, random_state=42)

fe_cv = cross_val_score(rf, X_train_fe, y_train, cv=5, scoring='neg_root_mean_squared_error')
print(f"\\n=== 4. FE CV RMSE: {-fe_cv.mean():.2f} ===")
improvement = ((-baseline_cv.mean()) - (-fe_cv.mean())) / (-baseline_cv.mean()) * 100
print(f"개선율: {improvement:.1f}%")

# 피처 중요도
print("\\n=== 5. 피처 중요도 (상위 10개) ===")
rf.fit(X_train_fe, y_train)
perm = permutation_importance(rf, X_test_fe, y_test, n_repeats=10, random_state=42)
importance_df = pd.DataFrame({
    'feature': X_fe.columns,
    'importance': perm.importances_mean
}).sort_values('importance', ascending=False)
print(importance_df.head(10))

print("\\n프로젝트 완료!")
`,
      hints: [
        '비율 피처: df["new"] = df["a"] / df["b"]',
        'Groupby 집계: df.groupby("col")["target"].transform("mean")',
        'Target Encoding은 반드시 CV 방식으로',
        'pd.get_dummies()로 범주형 인코딩'
      ]
    }
  },
  {
    id: 'p2w3d5t3',
    type: 'quiz',
    title: 'Week 11 종합 퀴즈',
    duration: 20,
    content: {
      questions: [
        {
          question: 'Groupby transform과 agg의 차이는?',
          options: ['transform이 더 빠르다', 'transform은 원본 행 수 유지', 'agg가 더 정확하다', 'transform은 평균만 지원'],
          answer: 1
        },
        {
          question: '시간의 주기성을 표현하기 위한 인코딩은?',
          options: ['One-Hot', 'Label', 'Sin/Cos', 'Binary'],
          answer: 2
        },
        {
          question: 'Target Encoding에서 CV 방식을 사용하는 이유는?',
          options: ['속도 향상', '과적합 방지', '결측치 처리', '메모리 절약'],
          answer: 1
        },
        {
          question: 'Permutation Importance의 장점은?',
          options: ['빠른 속도', '고카디널리티 편향 없음', '메모리 효율', '단순함'],
          answer: 1
        },
        {
          question: '희귀 카테고리 처리의 일반적인 방법은?',
          options: ['삭제', '"Other"로 그룹화', '평균으로 대체', 'NULL로 변환'],
          answer: 1
        },
        {
          question: 'Lag 피처 생성 시 주의사항은?',
          options: ['정규화 필수', '데이터 누수 방지', '스케일링 필수', '범주형 변환'],
          answer: 1
        },
        {
          question: 'TF-IDF의 IDF 역할은?',
          options: ['단어 빈도 측정', '희귀 단어에 가중치', '문서 길이 정규화', '불용어 제거'],
          answer: 1
        },
        {
          question: '피처 수가 너무 많을 때 발생할 수 있는 문제는?',
          options: ['과적합', '언더피팅', '학습 속도 증가', '정확도 향상'],
          answer: 0
        }
      ]
    }
  }
]
