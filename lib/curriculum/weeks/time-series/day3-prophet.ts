// Week 16 Day 3: Prophet
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'p2w8d3t1',
    type: 'video',
    title: 'Prophet 소개',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# Prophet

## Prophet이란?

Facebook(Meta)에서 개발한 시계열 예측 라이브러리
- 사용하기 쉬움
- 자동으로 추세, 계절성 분해
- 휴일/이벤트 효과 반영
- 결측치에 강건

## Prophet 모델 구조

\`\`\`
y(t) = g(t) + s(t) + h(t) + ε(t)

g(t): 추세 (trend)
  - Linear 또는 Logistic growth
  - 변화점 (changepoint) 자동 탐지

s(t): 계절성 (seasonality)
  - 연간, 주간, 일간 패턴
  - Fourier 급수로 모델링

h(t): 휴일/이벤트 효과
  - 특정 날짜 효과 반영

ε(t): 잔차 (노이즈)
\`\`\`

## 기본 사용법

\`\`\`python
from prophet import Prophet
import pandas as pd

# 데이터 준비 (Prophet 형식)
# 필수 컬럼: ds (datetime), y (값)
df_prophet = df.reset_index()
df_prophet = df_prophet.rename(columns={'date': 'ds', 'value': 'y'})

# 모델 학습
model = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=False
)
model.fit(df_prophet)

# 미래 데이터프레임 생성
future = model.make_future_dataframe(periods=30)  # 30일 예측

# 예측
forecast = model.predict(future)
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())

# 시각화
model.plot(forecast)
plt.show()
\`\`\`
`,
      objectives: [
        'Prophet의 구조를 이해한다',
        '기본 예측을 수행할 수 있다',
        '예측 결과를 해석할 수 있다'
      ],
      keyPoints: [
        'ds, y 컬럼 필수',
        'g(t) + s(t) + h(t) + ε(t)',
        'yhat: 예측값, yhat_lower/upper: 신뢰구간',
        '자동 추세 변화점 탐지'
      ]
    }
  },
  {
    id: 'p2w8d3t2',
    type: 'video',
    title: 'Prophet 고급 설정',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# Prophet 고급 설정

## 휴일 효과

\`\`\`python
# 휴일 데이터프레임
holidays = pd.DataFrame({
    'holiday': 'custom_holiday',
    'ds': pd.to_datetime(['2024-01-01', '2024-05-05', '2024-12-25']),
    'lower_window': -1,  # 휴일 전날부터
    'upper_window': 1    # 휴일 다음날까지
})

# 모델에 휴일 추가
model = Prophet(holidays=holidays)
model.fit(df_prophet)
\`\`\`

## 계절성 커스터마이징

\`\`\`python
model = Prophet(
    yearly_seasonality=False,   # 기본 계절성 끄기
    weekly_seasonality=False
)

# 커스텀 계절성 추가
model.add_seasonality(
    name='monthly',
    period=30.5,       # 월간
    fourier_order=5    # 복잡도 (높을수록 유연)
)

model.add_seasonality(
    name='weekly',
    period=7,
    fourier_order=3
)

model.fit(df_prophet)
\`\`\`

## 추세 조정

\`\`\`python
model = Prophet(
    growth='linear',           # 또는 'logistic'
    changepoint_prior_scale=0.05,  # 추세 유연성 (높을수록 변동)
    changepoint_range=0.8,     # 변화점 탐색 범위 (데이터 80%)
    n_changepoints=25          # 잠재적 변화점 수
)

# Logistic growth (상한/하한 있는 경우)
model = Prophet(growth='logistic')
df_prophet['cap'] = 100    # 상한
df_prophet['floor'] = 0    # 하한
model.fit(df_prophet)
\`\`\`

## 성분 분석

\`\`\`python
# 성분별 시각화
model.plot_components(forecast)
plt.show()

# 성분 데이터 접근
print(forecast[['ds', 'trend', 'weekly', 'yearly']].head())
\`\`\`

## 교차 검증

\`\`\`python
from prophet.diagnostics import cross_validation, performance_metrics

# 시계열 교차 검증
df_cv = cross_validation(
    model,
    initial='365 days',    # 초기 학습 기간
    period='30 days',      # 검증 간격
    horizon='30 days'      # 예측 기간
)

# 성능 지표
df_performance = performance_metrics(df_cv)
print(df_performance[['horizon', 'mape', 'rmse', 'mae']].head())

# MAPE < 10%: 좋은 모델
\`\`\`
`,
      objectives: [
        '휴일 효과를 추가할 수 있다',
        '계절성을 커스터마이징할 수 있다',
        '교차 검증으로 성능을 평가할 수 있다'
      ],
      keyPoints: [
        'holidays: 휴일/이벤트 데이터프레임',
        'add_seasonality(): 커스텀 계절성',
        'changepoint_prior_scale: 추세 유연성',
        'cross_validation: 시계열 CV'
      ]
    }
  },
  {
    id: 'p2w8d3t3',
    type: 'code',
    title: '실습: Prophet 예측',
    duration: 45,
    content: {
      instructions: `# Prophet 실습

## 목표
Prophet으로 시계열 예측 모델을 구축하세요.

## 요구사항
1. Prophet 형식 데이터 준비
2. 기본 모델 학습
3. 30일 예측
4. 성분 분석
5. (선택) 휴일 효과 추가

참고: Prophet이 없으면 간단한 대안 코드 제공
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# 2년 일별 매출 데이터 시뮬레이션
dates = pd.date_range('2022-01-01', periods=730, freq='D')

# 추세 + 계절성 + 노이즈
trend = np.linspace(1000, 1500, 730)
yearly = 200 * np.sin(2 * np.pi * np.arange(730) / 365)  # 연간 패턴
weekly = 100 * np.sin(2 * np.pi * np.arange(730) / 7)    # 주간 패턴
noise = np.random.normal(0, 50, 730)

sales = trend + yearly + weekly + noise

df = pd.DataFrame({
    'ds': dates,
    'y': sales
})

print(f"기간: {df['ds'].min().date()} ~ {df['ds'].max().date()}")
print(f"평균 매출: {df['y'].mean():.0f}")

# TODO: Prophet 예측
# Prophet이 설치되어 있지 않다면 아래 대안 코드 사용

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
    print("Prophet이 설치되지 않았습니다. 대안 방법을 사용합니다.")
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

np.random.seed(42)

dates = pd.date_range('2022-01-01', periods=730, freq='D')

trend = np.linspace(1000, 1500, 730)
yearly = 200 * np.sin(2 * np.pi * np.arange(730) / 365)
weekly = 100 * np.sin(2 * np.pi * np.arange(730) / 7)
noise = np.random.normal(0, 50, 730)

sales = trend + yearly + weekly + noise

df = pd.DataFrame({'ds': dates, 'y': sales})

# Prophet 대안: 선형 추세 + 주기 피처
print("=== Prophet 스타일 예측 (대안 구현) ===")

# 피처 생성
df['trend'] = np.arange(len(df))  # 선형 추세
df['yearly_sin'] = np.sin(2 * np.pi * df['trend'] / 365)
df['yearly_cos'] = np.cos(2 * np.pi * df['trend'] / 365)
df['weekly_sin'] = np.sin(2 * np.pi * df['trend'] / 7)
df['weekly_cos'] = np.cos(2 * np.pi * df['trend'] / 7)

features = ['trend', 'yearly_sin', 'yearly_cos', 'weekly_sin', 'weekly_cos']
X = df[features].values
y = df['y'].values

# 학습 (마지막 60일 제외)
train_size = len(df) - 60
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

model = LinearRegression()
model.fit(X_train, y_train)

# 예측
y_pred_test = model.predict(X_test)
y_pred_all = model.predict(X)

# 30일 미래 예측
future_trend = np.arange(len(df), len(df) + 30)
future_features = np.column_stack([
    future_trend,
    np.sin(2 * np.pi * future_trend / 365),
    np.cos(2 * np.pi * future_trend / 365),
    np.sin(2 * np.pi * future_trend / 7),
    np.cos(2 * np.pi * future_trend / 7)
])
future_pred = model.predict(future_features)

# 성능 평가
from sklearn.metrics import mean_absolute_error, mean_squared_error

mae = mean_absolute_error(y_test, y_pred_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
mape = np.mean(np.abs((y_test - y_pred_test) / y_test)) * 100

print(f"\\n=== 테스트 성능 (마지막 60일) ===")
print(f"MAE: {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"MAPE: {mape:.2f}%")

# 성분 분해
print(f"\\n=== 성분 분석 ===")
print(f"추세 계수: {model.coef_[0]:.4f} (일당 증가)")
print(f"연간 계절성 강도: {np.sqrt(model.coef_[1]**2 + model.coef_[2]**2):.2f}")
print(f"주간 계절성 강도: {np.sqrt(model.coef_[3]**2 + model.coef_[4]**2):.2f}")

# 미래 30일 예측
future_dates = pd.date_range(df['ds'].max() + pd.Timedelta(days=1), periods=30)
print(f"\\n=== 30일 예측 ===")
print(f"예측 기간: {future_dates[0].date()} ~ {future_dates[-1].date()}")
print(f"예측 평균: {future_pred.mean():.0f}")
print(f"예측 범위: {future_pred.min():.0f} ~ {future_pred.max():.0f}")

# 해석
print(f"\\n=== 해석 ===")
print(f"일 평균 {model.coef_[0]:.2f} 증가 추세")
print(f"연간 패턴: ±{np.sqrt(model.coef_[1]**2 + model.coef_[2]**2) * 200:.0f}")
print(f"주간 패턴: ±{np.sqrt(model.coef_[3]**2 + model.coef_[4]**2) * 100:.0f}")
`,
      hints: [
        'ds, y 컬럼으로 데이터 준비',
        'sin/cos로 주기성 인코딩',
        'MAPE < 10%면 좋은 모델',
        '추세 계수로 성장률 해석'
      ]
    }
  },
  {
    id: 'p2w8d3t4',
    type: 'quiz',
    title: 'Day 3 퀴즈: Prophet',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Prophet에서 필수 컬럼은?',
          options: ['date, value', 'ds, y', 'time, target', 'x, y'],
          answer: 1,
          explanation: 'Prophet은 특정 컬럼명을 요구합니다: ds(datetime string)는 날짜/시간, y는 예측 대상 값입니다. 기존 컬럼명을 rename(columns={"date": "ds", "value": "y"})로 변환해야 합니다. 예측 결과에는 yhat(예측값), yhat_lower/yhat_upper(신뢰구간)가 포함됩니다.'
        },
        {
          question: 'changepoint_prior_scale을 높이면?',
          options: ['추세가 더 smooth', '추세가 더 유연 (변동 큼)', '계절성 증가', '노이즈 감소'],
          answer: 1,
          explanation: 'changepoint_prior_scale은 추세 변화점(changepoint)의 유연성을 조절합니다. 값을 높이면 추세가 더 급격하게 변할 수 있어 유연해지고, 낮추면(기본값 0.05) 추세가 더 smooth해집니다. 과적합이 우려되면 낮추고, 급격한 추세 변화를 잡으려면 높입니다.'
        },
        {
          question: 'MAPE가 5%라면?',
          options: ['나쁜 모델', '평균 오차 5%', 'R² 0.05', '5일 후 예측'],
          answer: 1,
          explanation: 'MAPE(Mean Absolute Percentage Error)는 예측 오차를 백분율로 나타냅니다. MAPE 5%는 예측값이 실제값 대비 평균 5% 차이가 난다는 의미입니다. 일반적으로 MAPE < 10%면 좋은 모델, < 5%면 매우 정확한 모델로 평가됩니다. 수요 예측에서 널리 사용되는 지표입니다.'
        }
      ]
    }
  }
]
