// Week 16 Day 5: Weekly Project - 수요 예측
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'p2w8d5t1',
    type: 'reading',
    title: 'Weekly Project 가이드',
    duration: 15,
    content: {
      markdown: `# Weekly Project: 수요 예측 모델 (포트폴리오 #2)

## 프로젝트 개요

Phase 2의 마무리 프로젝트입니다.
시계열 분석 기법을 종합하여 수요 예측 모델을 구축합니다.

## 데이터셋 선택

### 옵션 1: Store Sales (Kaggle)
- 소매점 일별 매출
- 다중 매장, 상품 카테고리
- 휴일, 프로모션 정보

### 옵션 2: 자체 데이터
- 실무 매출/수요 데이터
- 최소 1년 일별 데이터 권장

## 요구사항

### 1. 시계열 분석 (20%)
- 분해 (Trend, Seasonal, Residual)
- 정상성 검정 (ADF)
- ACF/PACF 분석

### 2. Prophet 모델 (25%)
- 기본 Prophet
- 휴일/이벤트 추가
- 성분 분석

### 3. ML 모델 (25%)
- Lag/Rolling 피처
- LightGBM 또는 RandomForest
- TimeSeriesSplit CV

### 4. 모델 비교 (15%)
- MAE, RMSE, MAPE
- 예측 vs 실제 시각화

### 5. 비즈니스 인사이트 (15%)
- 재고 관리 관점 해석
- 신뢰 구간 활용 방안

## 평가 기준

| 항목 | 배점 |
|------|------|
| 시계열 분석 | 20% |
| Prophet | 25% |
| ML 모델 | 25% |
| 모델 비교 | 15% |
| 비즈니스 인사이트 | 15% |

## 산출물

- Jupyter Notebook
- 모델 성능 비교 표
- 예측 시각화
- 비즈니스 인사이트 문서
`,
      externalLinks: [
        { title: 'Store Sales Competition', url: 'https://www.kaggle.com/c/store-sales-time-series-forecasting' },
        { title: 'Prophet Documentation', url: 'https://facebook.github.io/prophet/' },
        { title: 'LightGBM Time Series', url: 'https://lightgbm.readthedocs.io/' }
      ]
    }
  },
  {
    id: 'p2w8d5t2',
    type: 'code',
    title: '프로젝트 템플릿',
    duration: 90,
    content: {
      instructions: `# 수요 예측 프로젝트

종합 시계열 예측 프로젝트를 완성하세요.

## 체크리스트
- [ ] 시계열 분해
- [ ] 정상성 검정
- [ ] Prophet 모델
- [ ] ML 모델 (Lag 피처)
- [ ] 모델 비교
- [ ] 비즈니스 인사이트
`,
      starterCode: `"""
수요 예측 프로젝트
Week 16 Weekly Project (Phase 2 포트폴리오 #2)
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import TimeSeriesSplit
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from statsmodels.tsa.seasonal import STL
from statsmodels.tsa.stattools import adfuller

# =============================================================================
# 1. 데이터 로드
# =============================================================================
print("=== 1. 데이터 로드 ===")

np.random.seed(42)

# 2년 일별 매출 시뮬레이션
dates = pd.date_range('2022-01-01', periods=730, freq='D')

# 복잡한 패턴 생성
trend = np.linspace(10000, 15000, 730)  # 상승 추세
yearly = 2000 * np.sin(2 * np.pi * np.arange(730) / 365)  # 연간 패턴
weekly = 500 * np.sin(2 * np.pi * np.arange(730) / 7)  # 주간 패턴
noise = np.random.normal(0, 500, 730)

# 특별 이벤트 (블랙프라이데이, 연말)
event_boost = np.zeros(730)
for year in [0, 1]:
    black_friday = 325 + 365 * year  # 11월 말
    christmas = 359 + 365 * year     # 12월 말
    if black_friday < 730:
        event_boost[black_friday-3:black_friday+3] = 3000
    if christmas < 730:
        event_boost[christmas-5:christmas+2] = 4000

sales = trend + yearly + weekly + event_boost + noise
sales = np.maximum(sales, 0)  # 음수 방지

df = pd.DataFrame({'date': dates, 'sales': sales})
df = df.set_index('date')

print(f"기간: {df.index.min().date()} ~ {df.index.max().date()}")
print(f"평균 매출: \${df['sales'].mean():,.0f}")
print(f"총 매출: \${df['sales'].sum():,.0f}")

# =============================================================================
# 2. 시계열 분석
# =============================================================================
print("\\n=== 2. 시계열 분석 ===")

# TODO: 분해, 정상성 검정

# =============================================================================
# 3. Prophet 모델
# =============================================================================
print("\\n=== 3. Prophet 모델 ===")

# TODO: Prophet 학습 및 예측

# =============================================================================
# 4. ML 모델
# =============================================================================
print("\\n=== 4. ML 모델 ===")

# TODO: Lag 피처, TimeSeriesSplit CV

# =============================================================================
# 5. 모델 비교
# =============================================================================
print("\\n=== 5. 모델 비교 ===")

# TODO: MAE, RMSE, MAPE 비교

# =============================================================================
# 6. 비즈니스 인사이트
# =============================================================================
print("\\n=== 6. 비즈니스 인사이트 ===")

# TODO: 재고 관리 관점 해석
`,
      solutionCode: `"""
수요 예측 프로젝트 - 완성본
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import TimeSeriesSplit
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
from statsmodels.tsa.seasonal import STL
from statsmodels.tsa.stattools import adfuller

# 1. 데이터 로드
print("=== 1. 데이터 로드 ===")
np.random.seed(42)

dates = pd.date_range('2022-01-01', periods=730, freq='D')
trend = np.linspace(10000, 15000, 730)
yearly = 2000 * np.sin(2 * np.pi * np.arange(730) / 365)
weekly = 500 * np.sin(2 * np.pi * np.arange(730) / 7)
noise = np.random.normal(0, 500, 730)

event_boost = np.zeros(730)
for year in [0, 1]:
    bf = 325 + 365 * year
    xmas = 359 + 365 * year
    if bf < 730: event_boost[max(0,bf-3):min(730,bf+3)] = 3000
    if xmas < 730: event_boost[max(0,xmas-5):min(730,xmas+2)] = 4000

sales = np.maximum(trend + yearly + weekly + event_boost + noise, 0)
df = pd.DataFrame({'date': dates, 'sales': sales})
df = df.set_index('date')

print(f"기간: {df.index.min().date()} ~ {df.index.max().date()}")
print(f"평균: \${df['sales'].mean():,.0f}, 범위: \${df['sales'].min():,.0f} ~ \${df['sales'].max():,.0f}")

# Train/Test 분할 (마지막 60일 테스트)
train = df.iloc[:-60]
test = df.iloc[-60:]

# 2. 시계열 분석
print("\\n=== 2. 시계열 분석 ===")

# STL 분해
stl = STL(train['sales'], period=7, robust=True)
result = stl.fit()
print(f"추세 변화: {result.trend[-1] - result.trend[0]:,.0f}")
print(f"계절성 범위: {result.seasonal.min():.0f} ~ {result.seasonal.max():.0f}")

# ADF 검정
adf_result = adfuller(train['sales'])
print(f"ADF p-value: {adf_result[1]:.4f}", end="")
print(" → 비정상" if adf_result[1] > 0.05 else " → 정상")

# 3. Prophet 스타일 모델 (대안 구현)
print("\\n=== 3. Prophet 스타일 모델 ===")

# 피처 생성
df_model = df.copy()
df_model['trend'] = np.arange(len(df_model))
df_model['yearly_sin'] = np.sin(2 * np.pi * df_model['trend'] / 365)
df_model['yearly_cos'] = np.cos(2 * np.pi * df_model['trend'] / 365)
df_model['weekly_sin'] = np.sin(2 * np.pi * df_model['trend'] / 7)
df_model['weekly_cos'] = np.cos(2 * np.pi * df_model['trend'] / 7)

prophet_features = ['trend', 'yearly_sin', 'yearly_cos', 'weekly_sin', 'weekly_cos']
X_train_p = df_model[prophet_features].iloc[:-60]
X_test_p = df_model[prophet_features].iloc[-60:]
y_train_p = df_model['sales'].iloc[:-60]
y_test_p = df_model['sales'].iloc[-60:]

prophet_model = LinearRegression()
prophet_model.fit(X_train_p, y_train_p)
prophet_pred = prophet_model.predict(X_test_p)

prophet_mae = mean_absolute_error(y_test_p, prophet_pred)
prophet_rmse = np.sqrt(mean_squared_error(y_test_p, prophet_pred))
prophet_mape = np.mean(np.abs((y_test_p - prophet_pred) / y_test_p)) * 100

print(f"MAE: \${prophet_mae:,.0f}")
print(f"MAPE: {prophet_mape:.2f}%")

# 4. ML 모델 (Lag 피처)
print("\\n=== 4. ML 모델 ===")

# Lag 피처
for lag in [1, 7, 14, 30]:
    df_model[f'lag_{lag}'] = df_model['sales'].shift(lag)

df_model['rolling_7_mean'] = df_model['sales'].shift(1).rolling(7).mean()
df_model['rolling_7_std'] = df_model['sales'].shift(1).rolling(7).std()

ml_features = ['lag_1', 'lag_7', 'lag_14', 'lag_30', 'rolling_7_mean', 'rolling_7_std',
               'trend', 'yearly_sin', 'yearly_cos', 'weekly_sin', 'weekly_cos']

df_clean = df_model.dropna()
X_ml = df_clean[ml_features]
y_ml = df_clean['sales']

# TimeSeriesSplit CV
tscv = TimeSeriesSplit(n_splits=5)
cv_scores = []

for train_idx, val_idx in tscv.split(X_ml):
    X_tr, X_val = X_ml.iloc[train_idx], X_ml.iloc[val_idx]
    y_tr, y_val = y_ml.iloc[train_idx], y_ml.iloc[val_idx]

    rf = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
    rf.fit(X_tr, y_tr)
    pred = rf.predict(X_val)
    cv_scores.append(mean_absolute_error(y_val, pred))

print(f"CV MAE: \${np.mean(cv_scores):,.0f} (+/- \${np.std(cv_scores)*2:,.0f})")

# 테스트 성능
X_train_ml = X_ml.iloc[:-60]
X_test_ml = X_ml.iloc[-60:]
y_train_ml = y_ml.iloc[:-60]
y_test_ml = y_ml.iloc[-60:]

rf_model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
rf_model.fit(X_train_ml, y_train_ml)
ml_pred = rf_model.predict(X_test_ml)

ml_mae = mean_absolute_error(y_test_ml, ml_pred)
ml_rmse = np.sqrt(mean_squared_error(y_test_ml, ml_pred))
ml_mape = np.mean(np.abs((y_test_ml.values - ml_pred) / y_test_ml.values)) * 100

print(f"테스트 MAE: \${ml_mae:,.0f}")
print(f"테스트 MAPE: {ml_mape:.2f}%")

# 5. 모델 비교
print("\\n=== 5. 모델 비교 ===")
comparison = pd.DataFrame({
    'Model': ['Prophet 스타일', 'ML (RandomForest)'],
    'MAE': [prophet_mae, ml_mae],
    'RMSE': [prophet_rmse, ml_rmse],
    'MAPE (%)': [prophet_mape, ml_mape]
})
print(comparison.to_string(index=False))

winner = 'ML' if ml_mae < prophet_mae else 'Prophet'
print(f"\\n→ {winner} 모델이 더 정확함")

# Feature Importance
print("\\n주요 피처:")
importance = pd.DataFrame({
    'feature': ml_features,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)
for _, row in importance.head(5).iterrows():
    print(f"  {row['feature']}: {row['importance']:.3f}")

# 6. 비즈니스 인사이트
print("\\n=== 6. 비즈니스 인사이트 ===")
print("""
📊 수요 예측 결과 요약

1. 패턴 분석:
   - 연간 5,000 증가 추세 (일 평균 +13.7)
   - 연말 시즌 (11-12월) 매출 급증 (+3,000~4,000)
   - 주간 패턴 존재 (±500)

2. 모델 성능:
   - MAPE 5% 이하 → 높은 정확도
   - lag_1 (전날 매출)이 가장 중요한 예측 변수

3. 재고 관리 제안:
   - 연말 시즌 2주 전 재고 30% 확대
   - 주말 재고 평일 대비 10% 추가
   - 안전 재고 = 예측값 + 1.5 × 예측 표준편차

4. 액션 플랜:
   - 일별 예측값 기반 발주 시스템 구축
   - 신뢰구간 활용하여 최소/최대 재고 수준 설정
   - 예측 오차 모니터링 및 모델 정기 업데이트
""")
`,
      hints: [
        'STL로 분해, adfuller로 정상성',
        'sin/cos로 계절성 인코딩 (Prophet 대안)',
        'lag_1, lag_7이 보통 가장 중요',
        'MAPE < 10%면 좋은 모델'
      ]
    }
  },
  {
    id: 'p2w8d5t3',
    type: 'quiz',
    title: 'Week 16 종합 퀴즈',
    duration: 20,
    content: {
      questions: [
        {
          question: '시계열의 3가지 구성 요소는?',
          options: ['X, Y, Z', 'Trend, Seasonal, Residual', 'Mean, Median, Mode', 'Input, Hidden, Output'],
          answer: 1,
          explanation: '시계열은 Trend(추세), Seasonal(계절성), Residual(잔차)의 세 구성 요소로 분해됩니다. 추세는 장기적 증감, 계절성은 주기적 패턴, 잔차는 설명되지 않는 노이즈입니다. 이 분해를 통해 각 성분을 독립적으로 분석하고 예측 모델을 구축할 수 있습니다.'
        },
        {
          question: 'ADF 검정에서 p-value < 0.05면?',
          options: ['비정상', '정상', '계절성 있음', '추세 있음'],
          answer: 1,
          explanation: 'ADF(Augmented Dickey-Fuller) 검정의 귀무가설은 "비정상 시계열"입니다. p-value < 0.05면 귀무가설을 기각하여 정상 시계열임을 의미합니다. ARIMA 등 전통 모델은 정상성을 가정하므로, p > 0.05면 차분을 통해 정상화가 필요합니다.'
        },
        {
          question: 'Prophet의 필수 컬럼은?',
          options: ['date, value', 'ds, y', 'time, target', 'x, y'],
          answer: 1,
          explanation: 'Prophet은 ds(datetime string)와 y(예측 대상 값) 두 컬럼을 필수로 요구합니다. 기존 데이터를 rename(columns={"date": "ds", "sales": "y"})로 변환해야 합니다. 예측 결과에는 yhat(예측값), yhat_lower/yhat_upper(신뢰구간)가 포함됩니다.'
        },
        {
          question: 'Lag 피처에서 데이터 누수를 방지하려면?',
          options: ['shift(0)', 'shift(-1)', 'shift(1)', '필요 없음'],
          answer: 2,
          explanation: 'shift(1)은 현재 행에 1시점 이전(과거)의 값을 가져옵니다. 예측 시점에는 현재 시점의 실제값을 알 수 없으므로, shift(1) 이상을 사용해야 데이터 누수를 방지합니다. shift(-1)은 미래 값을 가져오므로 절대 사용하면 안 됩니다.'
        },
        {
          question: 'TimeSeriesSplit의 특징은?',
          options: ['랜덤 셔플', '시간 순서 보존', 'Stratified', '동일 크기'],
          answer: 1,
          explanation: 'TimeSeriesSplit은 시간 순서를 보존하는 교차 검증입니다. 일반 KFold는 랜덤 셔플로 미래 데이터가 학습에 포함될 수 있지만, TimeSeriesSplit은 항상 과거 데이터로 학습하고 미래 데이터로 검증합니다. 시계열의 시간 의존성을 올바르게 반영합니다.'
        },
        {
          question: 'MAPE 5%의 의미는?',
          options: ['R² = 0.05', '평균 오차 5%', '5일 후 예측', 'F1 = 0.05'],
          answer: 1,
          explanation: 'MAPE(Mean Absolute Percentage Error)는 예측 오차를 백분율로 나타냅니다. MAPE 5%는 예측값이 실제값 대비 평균 5% 차이가 난다는 의미입니다. 일반적으로 MAPE < 10%면 좋은 모델, < 5%면 매우 정확한 모델로 평가되며, 수요 예측에서 널리 사용됩니다.'
        }
      ]
    }
  },
  {
    id: 'p2w8d5t4',
    type: 'challenge',
    title: '주간 도전과제: 시계열 예측 대회',
    duration: 60,
    content: {
      instructions: `# 주간 도전과제: 시계열 예측 대회

## 목표
Kaggle Store Sales 데이터셋으로 **최고 정확도의 수요 예측 모델**을 구축하세요.

## 데이터셋
**Store Sales - Time Series Forecasting** (Kaggle)
- https://www.kaggle.com/c/store-sales-time-series-forecasting
- 54개 매장, 33개 상품군의 일별 매출
- 2013-2017년 (약 170만 행)
- 휴일, 프로모션, 유가 정보 포함

## 평가 기준

### 1. 시계열 분석 (25점)
| 항목 | 점수 |
|------|------|
| STL 분해 & 시각화 | 10점 |
| ADF 정상성 검정 | 8점 |
| ACF/PACF 분석 | 7점 |

### 2. 다중 모델 구현 (35점)
| 모델 | 점수 |
|------|------|
| Prophet (또는 대안 구현) | 15점 |
| ML 모델 (Lag/Rolling 피처) | 15점 |
| 앙상블 (선택) | 5점 (보너스) |

### 3. 피처 엔지니어링 (25점)
| 피처 | 점수 |
|------|------|
| Lag 피처 (1, 7, 14, 30일) | 8점 |
| Rolling 통계 (mean, std, min, max) | 8점 |
| 시간 피처 (sin/cos 인코딩) | 5점 |
| 외부 변수 (휴일, 프로모션) | 4점 |

### 4. 성능 달성 (15점)
| 지표 | 기준 |
|------|------|
| MAPE < 15% | 5점 |
| MAPE < 10% | 10점 |
| MAPE < 5% | 15점 |

## 제출물
1. \`sales_forecasting.ipynb\` (전체 코드)
2. 모델 성능 비교표 (MAE, RMSE, MAPE)
3. Feature Importance 분석
4. 비즈니스 인사이트 (재고 관리 관점)

## 도전 힌트
- 데이터 누수 주의: Rolling 피처에 shift(1) 필수!
- 매장/상품군별로 개별 모델 vs 전체 모델 비교
- 휴일 전후 매출 급증 패턴 활용
- TimeSeriesSplit으로 시간 순서 보존
`,
      starterCode: `"""
Week 16 도전과제: 시계열 예측 대회
Store Sales Forecasting
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import TimeSeriesSplit
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from statsmodels.tsa.seasonal import STL
from statsmodels.tsa.stattools import adfuller

# ============================================================
# 1. 데이터 로드 (Kaggle에서 다운로드 또는 샘플 사용)
# ============================================================
print("=== 1. 데이터 로드 ===")

# 샘플 데이터 생성 (실제는 Kaggle 데이터 사용)
np.random.seed(42)
dates = pd.date_range('2022-01-01', periods=730, freq='D')

# 복잡한 패턴
trend = np.linspace(10000, 15000, 730)
yearly = 2000 * np.sin(2 * np.pi * np.arange(730) / 365)
weekly = 500 * np.sin(2 * np.pi * np.arange(730) / 7)
noise = np.random.normal(0, 500, 730)

# 휴일 효과
holiday_boost = np.zeros(730)
for year in [0, 1]:
    bf = 325 + 365 * year  # 블랙프라이데이
    xmas = 359 + 365 * year  # 크리스마스
    if bf < 730: holiday_boost[max(0,bf-3):min(730,bf+3)] = 3000
    if xmas < 730: holiday_boost[max(0,xmas-5):min(730,xmas+2)] = 4000

sales = np.maximum(trend + yearly + weekly + holiday_boost + noise, 0)

df = pd.DataFrame({'date': dates, 'sales': sales})
df = df.set_index('date')

print(f"기간: {df.index.min().date()} ~ {df.index.max().date()}")
print(f"평균 매출: $" + f"{df['sales'].mean():,.0f}")

# ============================================================
# 2. 시계열 분석
# ============================================================
print("\\n=== 2. 시계열 분석 ===")

# TODO: STL 분해, ADF 검정, ACF/PACF


# ============================================================
# 3. 피처 엔지니어링
# ============================================================
print("\\n=== 3. 피처 엔지니어링 ===")

# TODO: Lag, Rolling, 시간 피처 생성


# ============================================================
# 4. Prophet 스타일 모델
# ============================================================
print("\\n=== 4. Prophet 스타일 모델 ===")

# TODO: sin/cos 피처 기반 선형 모델


# ============================================================
# 5. ML 모델 (RandomForest/LightGBM)
# ============================================================
print("\\n=== 5. ML 모델 ===")

# TODO: TimeSeriesSplit CV, Feature Importance


# ============================================================
# 6. 모델 비교 & 앙상블
# ============================================================
print("\\n=== 6. 모델 비교 ===")

# TODO: MAE, RMSE, MAPE 비교, 앙상블


# ============================================================
# 7. 비즈니스 인사이트
# ============================================================
print("\\n=== 7. 비즈니스 인사이트 ===")

# TODO: 재고 관리 관점 해석
`,
      hints: [
        'STL(period=7, robust=True)로 분해',
        'shift(1).rolling()으로 데이터 누수 방지',
        'TimeSeriesSplit(n_splits=5)로 시간 순서 보존',
        'lag_1이 보통 가장 중요한 피처',
        'MAPE = mean(abs((y_true - y_pred) / y_true)) * 100',
        '휴일 전후 패턴을 피처로 추가하면 성능 향상'
      ]
    }
  }
]
