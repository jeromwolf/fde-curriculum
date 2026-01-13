// Week 16 Day 4: ML 기반 시계열 예측
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'p2w8d4t1',
    type: 'video',
    title: 'Lag 피처 생성',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# ML 기반 시계열 예측

## 왜 ML을 사용하는가?

\`\`\`
전통 시계열 (ARIMA, Prophet):
- 시계열 패턴에 특화
- 외부 변수 다루기 어려움

ML 기반:
- 외부 변수 (피처) 쉽게 추가
- 비선형 패턴 학습
- 앙상블 가능
\`\`\`

## Lag 피처

과거 값을 피처로 사용

\`\`\`python
def create_lag_features(df, target_col, lags):
    """Lag 피처 생성"""
    for lag in lags:
        df[f'{target_col}_lag_{lag}'] = df[target_col].shift(lag)
    return df

# 예시
df = create_lag_features(df, 'sales', lags=[1, 7, 14, 30])

# 결과
# sales | sales_lag_1 | sales_lag_7 | sales_lag_14 | sales_lag_30
# 100   | NaN         | NaN         | NaN          | NaN
# 110   | 100         | NaN         | NaN          | NaN
# ...
\`\`\`

## Rolling 피처

이동 통계량

\`\`\`python
def create_rolling_features(df, target_col, windows):
    """Rolling 피처 생성"""
    for window in windows:
        # shift(1)로 현재 값 제외 (데이터 누수 방지!)
        df[f'{target_col}_rolling_{window}_mean'] = (
            df[target_col].shift(1).rolling(window).mean()
        )
        df[f'{target_col}_rolling_{window}_std'] = (
            df[target_col].shift(1).rolling(window).std()
        )
        df[f'{target_col}_rolling_{window}_min'] = (
            df[target_col].shift(1).rolling(window).min()
        )
        df[f'{target_col}_rolling_{window}_max'] = (
            df[target_col].shift(1).rolling(window).max()
        )
    return df

df = create_rolling_features(df, 'sales', windows=[7, 14, 30])
\`\`\`

## 시간 피처

\`\`\`python
def create_time_features(df, date_col='date'):
    """시간 피처 생성"""
    df['year'] = df[date_col].dt.year
    df['month'] = df[date_col].dt.month
    df['day'] = df[date_col].dt.day
    df['dayofweek'] = df[date_col].dt.dayofweek  # 0=월
    df['dayofyear'] = df[date_col].dt.dayofyear
    df['weekofyear'] = df[date_col].dt.isocalendar().week
    df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)

    # 순환 인코딩 (주기성 반영)
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
    df['dayofweek_sin'] = np.sin(2 * np.pi * df['dayofweek'] / 7)
    df['dayofweek_cos'] = np.cos(2 * np.pi * df['dayofweek'] / 7)

    return df

df = create_time_features(df)
\`\`\`
`,
      objectives: [
        'Lag 피처를 생성할 수 있다',
        'Rolling 피처를 생성할 수 있다',
        '시간 피처를 생성할 수 있다'
      ],
      keyPoints: [
        'shift(lag)로 Lag 피처',
        'shift(1).rolling()으로 데이터 누수 방지',
        'sin/cos로 주기성 인코딩',
        '외부 변수 추가 용이'
      ]
    }
  },
  {
    id: 'p2w8d4t2',
    type: 'video',
    title: 'TimeSeriesSplit & 모델링',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 시계열 교차 검증 & 모델링

## TimeSeriesSplit

시간 순서를 보존한 교차 검증

\`\`\`python
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5)

# Fold 시각화
for i, (train_idx, val_idx) in enumerate(tscv.split(X)):
    print(f"Fold {i+1}:")
    print(f"  Train: {train_idx[0]} ~ {train_idx[-1]} ({len(train_idx)})")
    print(f"  Val: {val_idx[0]} ~ {val_idx[-1]} ({len(val_idx)})")

# Fold 1: Train 0~100, Val 101~120
# Fold 2: Train 0~120, Val 121~140
# ...
\`\`\`

## 모델 학습 & 평가

\`\`\`python
import lightgbm as lgb
from sklearn.metrics import mean_absolute_error, mean_squared_error

# 피처/타겟 분리
feature_cols = [c for c in df.columns if c not in ['date', 'sales']]
X = df[feature_cols]
y = df['sales']

# 결측치 제거 (lag로 인한)
mask = ~X.isnull().any(axis=1)
X = X[mask]
y = y[mask]

# TimeSeriesSplit 교차 검증
tscv = TimeSeriesSplit(n_splits=5)
scores = []

for train_idx, val_idx in tscv.split(X):
    X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
    y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]

    model = lgb.LGBMRegressor(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
        verbose=-1
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_val)
    mae = mean_absolute_error(y_val, y_pred)
    scores.append(mae)

print(f"CV MAE: {np.mean(scores):.2f} (+/- {np.std(scores)*2:.2f})")
\`\`\`

## 미래 예측

\`\`\`python
# 재귀적 예측 (1-step ahead)
def recursive_forecast(model, df, feature_cols, n_periods):
    df_future = df.copy()
    predictions = []

    for i in range(n_periods):
        # 최신 데이터로 피처 생성
        X_next = df_future[feature_cols].iloc[[-1]]
        y_pred = model.predict(X_next)[0]
        predictions.append(y_pred)

        # 예측값을 데이터에 추가
        next_date = df_future.index[-1] + pd.Timedelta(days=1)
        df_future.loc[next_date, 'sales'] = y_pred

        # Lag 피처 업데이트
        df_future = create_lag_features(df_future, 'sales', [1,7,14])
        df_future = create_rolling_features(df_future, 'sales', [7])

    return predictions
\`\`\`

## Feature Importance

\`\`\`python
importance = pd.DataFrame({
    'feature': feature_cols,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("Top 10 Features:")
print(importance.head(10))

# 일반적으로 lag_1, lag_7이 중요
\`\`\`
`,
      objectives: [
        'TimeSeriesSplit을 사용할 수 있다',
        'LightGBM으로 시계열 예측을 수행할 수 있다',
        '재귀적 예측을 구현할 수 있다'
      ],
      keyPoints: [
        'TimeSeriesSplit: 시간 순서 보존',
        'LightGBM: 빠르고 정확한 앙상블',
        '재귀 예측: 예측값을 다음 입력으로',
        'lag_1, lag_7이 보통 가장 중요'
      ]
    }
  },
  {
    id: 'p2w8d4t3',
    type: 'code',
    title: '실습: ML 기반 시계열 예측',
    duration: 45,
    content: {
      instructions: `# ML 기반 시계열 예측 실습

## 목표
Lag/Rolling 피처로 ML 모델을 구축하세요.

## 요구사항
1. Lag 피처 생성 (1, 7, 14일)
2. Rolling 피처 생성 (7일 평균)
3. 시간 피처 생성
4. TimeSeriesSplit 교차 검증
5. Feature Importance 분석
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import TimeSeriesSplit
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

np.random.seed(42)

# 매출 데이터 생성 (1년)
dates = pd.date_range('2023-01-01', periods=365, freq='D')

trend = np.linspace(1000, 1200, 365)
weekly = 100 * np.sin(2 * np.pi * np.arange(365) / 7)
noise = np.random.normal(0, 30, 365)

sales = trend + weekly + noise

df = pd.DataFrame({
    'date': dates,
    'sales': sales
})
df = df.set_index('date')

print(f"데이터 기간: {df.index.min().date()} ~ {df.index.max().date()}")
print(f"매출 평균: {df['sales'].mean():.0f}")

# TODO: ML 기반 시계열 예측
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import TimeSeriesSplit
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

np.random.seed(42)

dates = pd.date_range('2023-01-01', periods=365, freq='D')
trend = np.linspace(1000, 1200, 365)
weekly = 100 * np.sin(2 * np.pi * np.arange(365) / 7)
noise = np.random.normal(0, 30, 365)
sales = trend + weekly + noise

df = pd.DataFrame({'date': dates, 'sales': sales})
df = df.set_index('date')

# 1. Lag 피처
print("=== 1. Lag 피처 생성 ===")
for lag in [1, 7, 14]:
    df[f'lag_{lag}'] = df['sales'].shift(lag)
print(f"Lag 피처: lag_1, lag_7, lag_14")

# 2. Rolling 피처 (shift(1)로 데이터 누수 방지)
print("\\n=== 2. Rolling 피처 생성 ===")
df['rolling_7_mean'] = df['sales'].shift(1).rolling(7).mean()
df['rolling_7_std'] = df['sales'].shift(1).rolling(7).std()
print(f"Rolling 피처: rolling_7_mean, rolling_7_std")

# 3. 시간 피처
print("\\n=== 3. 시간 피처 생성 ===")
df['dayofweek'] = df.index.dayofweek
df['dayofweek_sin'] = np.sin(2 * np.pi * df['dayofweek'] / 7)
df['dayofweek_cos'] = np.cos(2 * np.pi * df['dayofweek'] / 7)
df['trend'] = np.arange(len(df))
print(f"시간 피처: dayofweek_sin/cos, trend")

# 결측치 제거
df_clean = df.dropna()
print(f"\\n유효 데이터: {len(df_clean)} / {len(df)}")

# 4. 피처/타겟 분리
feature_cols = ['lag_1', 'lag_7', 'lag_14', 'rolling_7_mean', 'rolling_7_std',
                'dayofweek_sin', 'dayofweek_cos', 'trend']
X = df_clean[feature_cols]
y = df_clean['sales']

# 5. TimeSeriesSplit 교차 검증
print("\\n=== 4. TimeSeriesSplit 교차 검증 ===")
tscv = TimeSeriesSplit(n_splits=5)
scores = []

for fold, (train_idx, val_idx) in enumerate(tscv.split(X)):
    X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
    y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]

    model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_val)
    mae = mean_absolute_error(y_val, y_pred)
    scores.append(mae)
    print(f"Fold {fold+1}: MAE = {mae:.2f}")

print(f"\\n평균 MAE: {np.mean(scores):.2f} (+/- {np.std(scores)*2:.2f})")
mape = np.mean(scores) / y.mean() * 100
print(f"MAPE: {mape:.2f}%")

# 6. Feature Importance
print("\\n=== 5. Feature Importance ===")
model.fit(X, y)
importance = pd.DataFrame({
    'feature': feature_cols,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

for _, row in importance.iterrows():
    print(f"  {row['feature']}: {row['importance']:.3f}")

print(f"\\n→ lag_1이 가장 중요 (전날 매출이 오늘 예측에 핵심)")
`,
      hints: [
        'shift(lag)로 Lag 피처',
        'shift(1).rolling()으로 데이터 누수 방지',
        'TimeSeriesSplit으로 시간 순서 보존',
        'lag_1이 보통 가장 중요한 피처'
      ]
    }
  },
  {
    id: 'p2w8d4t4',
    type: 'quiz',
    title: 'Day 4 퀴즈',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Lag 피처 생성 시 shift(1)의 의미는?',
          options: ['1일 앞으로', '1일 뒤로 (과거 값)', '1시간 뒤로', '1주 뒤로'],
          answer: 1,
          explanation: 'shift(1)은 데이터를 1행 아래로 이동시켜 현재 행에 이전 시점(과거)의 값을 가져옵니다. 예를 들어 t시점에 t-1시점의 값이 오게 됩니다. 시계열 ML에서 과거 값을 피처로 사용할 때 필수적인 함수입니다. shift(-1)은 반대로 미래 값을 가져옵니다.'
        },
        {
          question: 'Rolling 피처에서 shift(1)를 사용하는 이유는?',
          options: ['속도 향상', '데이터 누수 방지', '정확도 향상', '메모리 절약'],
          answer: 1,
          explanation: 'Rolling 피처 계산 시 shift(1)을 먼저 적용하지 않으면 현재 시점의 값이 이동평균에 포함되어 데이터 누수(data leakage)가 발생합니다. 예측 시점에는 해당 시점의 실제값을 모르므로, df["sales"].shift(1).rolling(7).mean()처럼 shift를 적용해야 합니다.'
        },
        {
          question: 'TimeSeriesSplit의 특징은?',
          options: ['랜덤 셔플', '시간 순서 보존', '동일 크기 폴드', 'Stratified 분할'],
          answer: 1,
          explanation: 'TimeSeriesSplit은 시간 순서를 보존하는 교차 검증입니다. 일반 KFold는 랜덤 셔플로 미래 데이터가 학습에 포함될 수 있지만, TimeSeriesSplit은 항상 과거 데이터로 학습하고 미래 데이터로 검증합니다. 각 폴드마다 학습 데이터가 누적되어 증가하는 특징이 있습니다.'
        }
      ]
    }
  }
]
