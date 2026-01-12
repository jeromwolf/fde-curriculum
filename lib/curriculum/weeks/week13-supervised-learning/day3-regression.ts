// Week 13 Day 3: 회귀 알고리즘
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'p2w5d3t1',
    type: 'video',
    title: '회귀 알고리즘 개요',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 회귀 알고리즘 (Regression)

## 회귀 문제란?

타겟 변수가 연속형일 때 사용하는 지도학습
- 가격 예측: 주택 가격, 상품 가격
- 수요 예측: 판매량, 방문자 수
- 시간 예측: 배송 시간, 처리 시간

## 주요 회귀 알고리즘

### 1. Linear Regression & Regularization

\`\`\`python
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet

# 기본 선형 회귀
lr = LinearRegression()
lr.fit(X_train, y_train)

# Ridge (L2 규제)
# 계수를 작게 만듦, 과적합 방지
ridge = Ridge(alpha=1.0)

# Lasso (L1 규제)
# 일부 계수를 0으로 → 피처 선택 효과
lasso = Lasso(alpha=0.1)

# ElasticNet (L1 + L2)
elastic = ElasticNet(alpha=0.1, l1_ratio=0.5)
\`\`\`

### 2. 트리 기반 회귀

\`\`\`python
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
import xgboost as xgb
import lightgbm as lgb

# Random Forest Regressor
rf_reg = RandomForestRegressor(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    n_jobs=-1
)

# Gradient Boosting
gb_reg = GradientBoostingRegressor(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    random_state=42
)

# XGBoost Regressor
xgb_reg = xgb.XGBRegressor(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42
)

# LightGBM Regressor
lgb_reg = lgb.LGBMRegressor(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42
)
\`\`\`

## 회귀 평가 지표

\`\`\`python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

y_pred = model.predict(X_test)

# MSE: 오차 제곱 평균 (이상치에 민감)
mse = mean_squared_error(y_test, y_pred)

# RMSE: MSE의 제곱근 (단위 맞춤)
rmse = np.sqrt(mse)

# MAE: 오차 절대값 평균 (이상치에 강건)
mae = mean_absolute_error(y_test, y_pred)

# R²: 설명된 분산 비율 (0~1, 1에 가까울수록 좋음)
r2 = r2_score(y_test, y_pred)

# MAPE: 평균 절대 백분율 오차
mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

print(f"RMSE: {rmse:.2f}")
print(f"MAE: {mae:.2f}")
print(f"R²: {r2:.4f}")
print(f"MAPE: {mape:.2f}%")
\`\`\`

## 지표 선택 가이드

| 지표 | 특징 | 사용 시점 |
|------|------|----------|
| RMSE | 이상치에 민감, 큰 오류 페널티 | 큰 오류가 치명적일 때 |
| MAE | 이상치에 강건, 해석 용이 | 오류 크기가 선형적일 때 |
| R² | 모델 설명력 (0~1) | 모델 비교 |
| MAPE | 백분율 오류, 스케일 독립 | 다른 스케일 비교 시 |
`,
      objectives: [
        '회귀 알고리즘의 종류를 이해한다',
        '규제(Regularization)의 효과를 파악한다',
        '회귀 평가 지표를 적절히 선택할 수 있다'
      ],
      keyPoints: [
        'Ridge: L2 규제, 과적합 방지',
        'Lasso: L1 규제, 피처 선택',
        'RMSE: 큰 오류 페널티',
        'MAE: 이상치에 강건'
      ]
    }
  },
  {
    id: 'p2w5d3t2',
    type: 'code',
    title: '실습: 주택 가격 예측',
    duration: 45,
    content: {
      instructions: `# 회귀 모델 실습

## 목표
주택 가격을 예측하는 회귀 모델을 구축하세요.

## 요구사항
1. 선형 모델: Linear, Ridge, Lasso 비교
2. 트리 모델: RF, XGBoost, LightGBM 비교
3. 교차 검증으로 성능 평가
4. Feature Importance 분석
5. 예측 vs 실제 시각화
`,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
import lightgbm as lgb
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

# 샘플 데이터 생성
np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'sqft': np.random.randint(500, 4000, n),
    'bedrooms': np.random.randint(1, 6, n),
    'bathrooms': np.random.randint(1, 4, n),
    'age': np.random.randint(0, 50, n),
    'location_score': np.random.uniform(1, 10, n),
})

# 가격 생성 (비선형 관계 포함)
df['price'] = (
    df['sqft'] * 150 +
    df['bedrooms'] * 10000 +
    df['bathrooms'] * 15000 -
    df['age'] * 2000 +
    df['location_score'] * 20000 +
    np.random.normal(0, 30000, n)
)

X = df.drop('price', axis=1)
y = df['price']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"데이터 크기: {len(df)}")
print(f"평균 가격: \${y.mean():,.0f}")

# TODO: 회귀 모델 학습 및 비교
`,
      solutionCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
import lightgbm as lgb
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'sqft': np.random.randint(500, 4000, n),
    'bedrooms': np.random.randint(1, 6, n),
    'bathrooms': np.random.randint(1, 4, n),
    'age': np.random.randint(0, 50, n),
    'location_score': np.random.uniform(1, 10, n),
})

df['price'] = (
    df['sqft'] * 150 +
    df['bedrooms'] * 10000 +
    df['bathrooms'] * 15000 -
    df['age'] * 2000 +
    df['location_score'] * 20000 +
    np.random.normal(0, 30000, n)
)

X = df.drop('price', axis=1)
y = df['price']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 스케일링 (선형 모델용)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 모델 정의
models = {
    'Linear': (LinearRegression(), True),
    'Ridge': (Ridge(alpha=1.0), True),
    'Lasso': (Lasso(alpha=100), True),
    'RandomForest': (RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42), False),
    'XGBoost': (xgb.XGBRegressor(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42), False),
    'LightGBM': (lgb.LGBMRegressor(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42, verbose=-1), False)
}

print("=== 5-Fold 교차 검증 (RMSE) ===\\n")
results = {}

for name, (model, use_scaled) in models.items():
    X_cv = X_train_scaled if use_scaled else X_train
    scores = cross_val_score(model, X_cv, y_train, cv=5, scoring='neg_root_mean_squared_error')
    rmse = -scores.mean()
    results[name] = rmse
    print(f"{name:15} RMSE: \${rmse:,.0f}")

# 최고 모델로 테스트 평가
print("\\n=== 테스트 평가 (LightGBM) ===")
best_model = lgb.LGBMRegressor(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42, verbose=-1)
best_model.fit(X_train, y_train)

y_pred = best_model.predict(X_test)

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)
print(f"RMSE: \${rmse:,.0f}")
print(f"R²: {r2:.4f}")

# Feature Importance
print("\\n=== Feature Importance ===")
importance = pd.DataFrame({
    'feature': X.columns,
    'importance': best_model.feature_importances_
}).sort_values('importance', ascending=False)
print(importance)

# 예측 vs 실제
print("\\n예측 vs 실제 (상위 10개)")
comparison = pd.DataFrame({
    'Actual': y_test[:10].values,
    'Predicted': y_pred[:10],
    'Error': y_test[:10].values - y_pred[:10]
})
print(comparison)
`,
      hints: [
        'cross_val_score scoring="neg_root_mean_squared_error"',
        '선형 모델은 스케일링 필요',
        'Lasso alpha가 너무 작으면 피처 선택 효과 없음',
        'LightGBM verbose=-1로 경고 숨김'
      ]
    }
  },
  {
    id: 'p2w5d3t3',
    type: 'quiz',
    title: 'Day 3 퀴즈: 회귀 알고리즘',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Lasso 규제의 특징은?',
          options: ['계수를 작게 만듦', '일부 계수를 0으로 만듦', '계수를 크게 만듦', '계수 부호 변경'],
          answer: 1
        },
        {
          question: 'RMSE와 MAE 중 이상치에 더 민감한 것은?',
          options: ['RMSE', 'MAE', '둘 다 동일', '상황에 따라 다름'],
          answer: 0
        },
        {
          question: 'R² = 0.8의 의미는?',
          options: ['80% 정확도', '80% 분산 설명', '20% 오류율', '0.8 상관계수'],
          answer: 1
        },
        {
          question: '과적합 방지에 효과적인 규제는?',
          options: ['규제 없음', 'Ridge (L2)', '학습률 증가', '더 많은 피처'],
          answer: 1
        }
      ]
    }
  }
]
