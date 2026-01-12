// Week 16 Day 2: 정상성 & ACF/PACF
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'p2w8d2t1',
    type: 'video',
    title: '정상성 (Stationarity)',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 정상성 (Stationarity)

## 정상성이란?

통계적 속성이 시간에 따라 변하지 않음
- 평균이 일정
- 분산이 일정
- 자기공분산이 시차에만 의존

## 왜 중요한가?

\`\`\`
ARIMA 등 전통 시계열 모델은 정상성 가정

비정상 시계열:
- 추세 있음 → 평균 변화
- 계절성 있음 → 패턴 변화
- 분산 증가 → 변동성 변화

해결: 차분, 로그 변환 등
\`\`\`

## ADF 검정 (Augmented Dickey-Fuller)

\`\`\`python
from statsmodels.tsa.stattools import adfuller

# ADF 검정
result = adfuller(df['value'])

print(f"ADF Statistic: {result[0]:.4f}")
print(f"p-value: {result[1]:.4f}")
print("Critical Values:")
for key, value in result[4].items():
    print(f"  {key}: {value:.4f}")

# 해석
# H0: 비정상 (단위근 존재)
# p < 0.05 → H0 기각 → 정상!
if result[1] < 0.05:
    print("→ 정상 시계열 (p < 0.05)")
else:
    print("→ 비정상 시계열 (차분 필요)")
\`\`\`

## 정상화 변환

\`\`\`python
# 1. 차분 (Differencing)
df['diff_1'] = df['value'].diff()      # 1차 차분
df['diff_2'] = df['value'].diff().diff()  # 2차 차분

# 2. 로그 변환 + 차분
df['log_diff'] = np.log(df['value']).diff()

# 3. 계절 차분
df['seasonal_diff'] = df['value'].diff(7)  # 7일 전과 차이

# 변환 후 ADF 검정
result = adfuller(df['diff_1'].dropna())
print(f"차분 후 p-value: {result[1]:.4f}")
\`\`\`
`,
      objectives: [
        '정상성의 개념을 이해한다',
        'ADF 검정을 수행할 수 있다',
        '비정상 시계열을 정상화할 수 있다'
      ],
      keyPoints: [
        '정상: 평균, 분산 일정',
        'ADF p < 0.05 → 정상',
        '차분: 추세 제거',
        '로그: 분산 안정화'
      ]
    }
  },
  {
    id: 'p2w8d2t2',
    type: 'video',
    title: 'ACF & PACF',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# ACF & PACF

## 자기상관함수 (ACF)

현재 값과 과거 값의 상관관계

\`\`\`python
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.stattools import acf, pacf

# ACF 시각화
fig, axes = plt.subplots(1, 2, figsize=(14, 4))

plot_acf(df['value'], lags=30, ax=axes[0])
axes[0].set_title('ACF')

plot_pacf(df['value'], lags=30, ax=axes[1])
axes[1].set_title('PACF')

plt.tight_layout()
plt.show()
\`\`\`

## ACF vs PACF

\`\`\`
ACF (Autocorrelation Function):
- 모든 중간 시차 영향 포함
- 계절성 패턴 확인

PACF (Partial ACF):
- 중간 시차 영향 제거
- 직접적 영향만 측정
\`\`\`

## ACF/PACF 해석

\`\`\`
ACF가 천천히 감소 → 비정상, 차분 필요

ACF에서 주기적 스파이크 → 계절성
(예: lag 7, 14, 21에서 높음 → 주간 패턴)

PACF 절단 (Cut-off):
- lag p 이후 급격히 0 → AR(p) 모델

ACF 절단:
- lag q 이후 급격히 0 → MA(q) 모델

둘 다 천천히 감소 → ARMA 모델
\`\`\`

## ARIMA 차수 결정

\`\`\`python
# ACF/PACF로 (p, d, q) 결정
# p: PACF 절단점 → AR 차수
# d: 정상화에 필요한 차분 횟수
# q: ACF 절단점 → MA 차수

# 자동 차수 선택
from pmdarima import auto_arima

model = auto_arima(
    df['value'],
    start_p=0, max_p=5,
    start_q=0, max_q=5,
    d=None,  # 자동 결정
    seasonal=True,
    m=7,  # 계절 주기
    trace=True,
    error_action='ignore'
)

print(model.summary())
\`\`\`
`,
      objectives: [
        'ACF/PACF를 해석할 수 있다',
        '계절성 패턴을 식별할 수 있다',
        'ARIMA 차수를 결정할 수 있다'
      ],
      keyPoints: [
        'ACF: 전체 상관, 계절성 확인',
        'PACF: 직접 영향, AR 차수',
        'ACF 천천히 감소 → 비정상',
        'auto_arima로 자동 차수 선택'
      ]
    }
  },
  {
    id: 'p2w8d2t3',
    type: 'code',
    title: '실습: 정상성 검정 & ACF/PACF',
    duration: 40,
    content: {
      instructions: `# 정상성 분석 실습

## 목표
시계열의 정상성을 검정하고 ACF/PACF를 분석하세요.

## 요구사항
1. ADF 검정 (원본)
2. 차분 후 ADF 검정
3. ACF/PACF 시각화
4. 계절성 패턴 식별
5. ARIMA 차수 추정
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller, acf, pacf
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

np.random.seed(42)

# 비정상 시계열 생성 (추세 + 계절성)
n = 200
dates = pd.date_range('2023-01-01', periods=n, freq='D')

trend = np.linspace(100, 200, n)  # 상승 추세
seasonal = 15 * np.sin(2 * np.pi * np.arange(n) / 7)  # 주간 패턴
noise = np.random.normal(0, 5, n)

values = trend + seasonal + noise

df = pd.DataFrame({'value': values}, index=dates)

print("=== 비정상 시계열 ===")
print(f"평균 (초반 50): {df['value'][:50].mean():.1f}")
print(f"평균 (후반 50): {df['value'][-50:].mean():.1f}")

# TODO: 정상성 분석
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller, acf, pacf
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

np.random.seed(42)

n = 200
dates = pd.date_range('2023-01-01', periods=n, freq='D')

trend = np.linspace(100, 200, n)
seasonal = 15 * np.sin(2 * np.pi * np.arange(n) / 7)
noise = np.random.normal(0, 5, n)

values = trend + seasonal + noise

df = pd.DataFrame({'value': values}, index=dates)

# 1. ADF 검정 (원본)
print("=== 1. ADF 검정 (원본) ===")
result = adfuller(df['value'])
print(f"ADF Statistic: {result[0]:.4f}")
print(f"p-value: {result[1]:.4f}")
if result[1] < 0.05:
    print("→ 정상 (p < 0.05)")
else:
    print("→ 비정상 (차분 필요)")

# 2. 차분 후 ADF 검정
print("\\n=== 2. 차분 후 ADF 검정 ===")
df['diff_1'] = df['value'].diff()

result_diff = adfuller(df['diff_1'].dropna())
print(f"1차 차분 p-value: {result_diff[1]:.4f}")
if result_diff[1] < 0.05:
    print("→ 1차 차분으로 정상화 성공!")
else:
    df['diff_2'] = df['diff_1'].diff()
    result_diff2 = adfuller(df['diff_2'].dropna())
    print(f"2차 차분 p-value: {result_diff2[1]:.4f}")

# 3. ACF 분석
print("\\n=== 3. ACF 분석 ===")
acf_values = acf(df['value'].dropna(), nlags=20)
print("주요 ACF 값:")
for lag in [1, 7, 14]:
    print(f"  Lag {lag}: {acf_values[lag]:.3f}")

# 계절성 확인
if acf_values[7] > 0.3:
    print("→ 주간 계절성 패턴 발견 (lag 7 높음)")

# 4. PACF 분석
print("\\n=== 4. PACF 분석 ===")
pacf_values = pacf(df['diff_1'].dropna(), nlags=10)
print("PACF 값 (차분 후):")
for lag in range(1, 6):
    print(f"  Lag {lag}: {pacf_values[lag]:.3f}")

# 5. ARIMA 차수 추정
print("\\n=== 5. ARIMA 차수 추정 ===")
print("관찰 결과:")
print(f"  d = 1 (1차 차분으로 정상화)")

# PACF에서 유의한 lag 수
significant_lags = sum(1 for p in pacf_values[1:6] if abs(p) > 0.2)
print(f"  p ≈ {significant_lags} (PACF 유의 lag 수)")

# ACF에서 유의한 lag 수
acf_diff = acf(df['diff_1'].dropna(), nlags=10)
significant_acf = sum(1 for a in acf_diff[1:6] if abs(a) > 0.2)
print(f"  q ≈ {significant_acf} (ACF 유의 lag 수)")

print(f"\\n추천 ARIMA 차수: ({significant_lags}, 1, {significant_acf})")
`,
      hints: [
        'adfuller() p-value < 0.05면 정상',
        '.diff()로 차분',
        'acf(), pacf()로 상관계수',
        '주간 패턴: lag 7에서 높은 ACF'
      ]
    }
  },
  {
    id: 'p2w8d2t4',
    type: 'quiz',
    title: 'Day 2 퀴즈',
    duration: 10,
    content: {
      questions: [
        {
          question: 'ADF 검정에서 p-value < 0.05면?',
          options: ['비정상', '정상', '차분 필요', '계절성 있음'],
          answer: 1
        },
        {
          question: 'ACF가 천천히 감소하면 의미는?',
          options: ['정상', '비정상 (차분 필요)', '계절성 없음', 'MA 모델 적합'],
          answer: 1
        },
        {
          question: 'PACF가 lag 2에서 절단되면 적합한 모델은?',
          options: ['MA(2)', 'AR(2)', 'ARIMA(0,1,2)', 'ARIMA(2,0,0)'],
          answer: 1
        }
      ]
    }
  }
]
