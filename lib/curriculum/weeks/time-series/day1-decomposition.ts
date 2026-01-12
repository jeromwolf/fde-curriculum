// Week 16 Day 1: 시계열 분해
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'p2w8d1t1',
    type: 'video',
    title: '시계열 데이터 개요',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 시계열 데이터

## 시계열이란?

시간 순서로 정렬된 데이터 포인트
- 주가, 매출, 기온, 트래픽 등
- 과거 패턴으로 미래 예측

## 시계열 특징

\`\`\`
1. 시간 의존성
   - 현재 값이 과거 값에 영향 받음
   - 자기상관 (Autocorrelation)

2. 비독립 관측치
   - 일반 ML과 다른 가정
   - 랜덤 셔플 불가

3. 계절성
   - 주기적 패턴 (일별, 주별, 연별)
\`\`\`

## 시계열 구성 요소

\`\`\`
시계열 = 추세 + 계절성 + 잔차

Trend: 장기적 증가/감소
Seasonality: 주기적 반복 패턴
Residual: 설명 안 되는 노이즈
\`\`\`

## 데이터 준비

\`\`\`python
import pandas as pd

# 날짜 파싱
df['date'] = pd.to_datetime(df['date'])
df = df.set_index('date')

# 정렬 확인
df = df.sort_index()

# 빈도 설정 (일별)
df = df.asfreq('D')

# 결측 처리 (시계열은 앞값으로)
df = df.ffill()

# 기본 시각화
import matplotlib.pyplot as plt
df['value'].plot(figsize=(12, 4))
plt.title('Time Series')
plt.show()
\`\`\`
`,
      objectives: [
        '시계열 데이터의 특징을 이해한다',
        '시계열 구성 요소를 설명할 수 있다',
        '시계열 데이터를 준비할 수 있다'
      ],
      keyPoints: [
        '시간 의존성, 자기상관',
        'Trend + Seasonality + Residual',
        '날짜 인덱스 필수',
        '결측치는 ffill 권장'
      ]
    }
  },
  {
    id: 'p2w8d1t2',
    type: 'video',
    title: '시계열 분해',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 시계열 분해 (Decomposition)

## 분해 유형

\`\`\`
1. Additive (가법 모델)
   Y = Trend + Seasonal + Residual
   계절 변동이 일정

2. Multiplicative (승법 모델)
   Y = Trend × Seasonal × Residual
   계절 변동이 추세에 비례
\`\`\`

## 분해 구현

\`\`\`python
from statsmodels.tsa.seasonal import seasonal_decompose

# 가법 분해
result = seasonal_decompose(
    df['value'],
    model='additive',  # 또는 'multiplicative'
    period=7           # 주기 (일별 데이터의 주간 패턴)
)

# 시각화
fig, axes = plt.subplots(4, 1, figsize=(12, 10))

result.observed.plot(ax=axes[0], title='Original')
result.trend.plot(ax=axes[1], title='Trend')
result.seasonal.plot(ax=axes[2], title='Seasonal')
result.resid.plot(ax=axes[3], title='Residual')

plt.tight_layout()
plt.show()
\`\`\`

## STL 분해 (더 robust)

\`\`\`python
from statsmodels.tsa.seasonal import STL

# STL (Seasonal-Trend decomposition using LOESS)
stl = STL(df['value'], period=7, robust=True)
result = stl.fit()

# 시각화
result.plot()
plt.show()

# 각 성분 접근
print(f"추세: {result.trend.head()}")
print(f"계절: {result.seasonal.head()}")
print(f"잔차: {result.resid.head()}")
\`\`\`

## 분해 활용

\`\`\`python
# 추세 분석
trend = result.trend.dropna()
print(f"추세 기울기: {(trend[-1] - trend[0]) / len(trend):.4f}")

# 계절성 강도
seasonal_strength = 1 - result.resid.var() / (result.seasonal + result.resid).var()
print(f"계절성 강도: {seasonal_strength:.2f}")

# 계절성 제거된 데이터
df['deseasonalized'] = df['value'] - result.seasonal

# 예측에 활용
# 추세 외삽 + 계절성 패턴 적용
\`\`\`
`,
      objectives: [
        '시계열 분해를 수행할 수 있다',
        'Additive/Multiplicative를 선택할 수 있다',
        'STL 분해를 적용할 수 있다'
      ],
      keyPoints: [
        'Additive: 계절 변동 일정',
        'Multiplicative: 계절 변동 비례',
        'STL: LOESS 기반, robust',
        'period: 계절 주기 (7=주간, 12=월간)'
      ]
    }
  },
  {
    id: 'p2w8d1t3',
    type: 'code',
    title: '실습: 시계열 분해',
    duration: 40,
    content: {
      instructions: `# 시계열 분해 실습

## 목표
시계열 데이터를 분해하고 각 성분을 분석하세요.

## 요구사항
1. 시계열 데이터 생성 및 시각화
2. seasonal_decompose 적용
3. STL 분해 적용
4. 추세, 계절성 분석
5. 계절성 제거 데이터 생성
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose, STL

np.random.seed(42)

# 시계열 데이터 생성 (1년, 일별)
dates = pd.date_range('2023-01-01', periods=365, freq='D')

# 추세 + 계절성 + 노이즈
trend = np.linspace(100, 150, 365)  # 상승 추세
weekly_seasonal = 10 * np.sin(2 * np.pi * np.arange(365) / 7)  # 주간 패턴
yearly_seasonal = 20 * np.sin(2 * np.pi * np.arange(365) / 365)  # 연간 패턴
noise = np.random.normal(0, 5, 365)

values = trend + weekly_seasonal + yearly_seasonal + noise

df = pd.DataFrame({'value': values}, index=dates)
df.index.name = 'date'

print(f"기간: {df.index.min()} ~ {df.index.max()}")
print(f"평균: {df['value'].mean():.1f}, 표준편차: {df['value'].std():.1f}")

# TODO: 시계열 분해
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose, STL

np.random.seed(42)

dates = pd.date_range('2023-01-01', periods=365, freq='D')

trend = np.linspace(100, 150, 365)
weekly_seasonal = 10 * np.sin(2 * np.pi * np.arange(365) / 7)
yearly_seasonal = 20 * np.sin(2 * np.pi * np.arange(365) / 365)
noise = np.random.normal(0, 5, 365)

values = trend + weekly_seasonal + yearly_seasonal + noise

df = pd.DataFrame({'value': values}, index=dates)

# 1. 원본 시각화
print("=== 1. 원본 데이터 ===")
print(f"기간: {df.index.min().date()} ~ {df.index.max().date()}")
print(f"평균: {df['value'].mean():.1f}, 범위: {df['value'].min():.1f} ~ {df['value'].max():.1f}")

# 2. seasonal_decompose (주간 패턴)
print("\\n=== 2. Seasonal Decompose (period=7) ===")
result_weekly = seasonal_decompose(df['value'], model='additive', period=7)
print(f"추세 평균: {result_weekly.trend.mean():.1f}")
print(f"계절성 범위: {result_weekly.seasonal.min():.1f} ~ {result_weekly.seasonal.max():.1f}")
print(f"잔차 표준편차: {result_weekly.resid.std():.2f}")

# 3. STL 분해
print("\\n=== 3. STL 분해 ===")
stl = STL(df['value'], period=7, robust=True)
result_stl = stl.fit()
print(f"STL 추세 평균: {result_stl.trend.mean():.1f}")
print(f"STL 잔차 표준편차: {result_stl.resid.std():.2f}")

# 4. 추세 분석
print("\\n=== 4. 추세 분석 ===")
trend_clean = result_stl.trend.dropna()
daily_change = (trend_clean[-1] - trend_clean[0]) / len(trend_clean)
total_change = trend_clean[-1] - trend_clean[0]
print(f"일평균 변화: {daily_change:.3f}")
print(f"전체 변화: {total_change:.1f} ({total_change/trend_clean[0]*100:.1f}%)")

# 5. 계절성 강도
print("\\n=== 5. 계절성 강도 ===")
var_resid = result_stl.resid.var()
var_seasonal_resid = (result_stl.seasonal + result_stl.resid).var()
seasonal_strength = 1 - var_resid / var_seasonal_resid if var_seasonal_resid > 0 else 0
print(f"계절성 강도: {seasonal_strength:.3f}")

if seasonal_strength > 0.6:
    print("→ 강한 계절성 패턴 존재")
elif seasonal_strength > 0.3:
    print("→ 중간 계절성 패턴")
else:
    print("→ 약한 계절성")

# 6. 계절성 제거
print("\\n=== 6. 계절성 제거 데이터 ===")
df['deseasonalized'] = df['value'] - result_stl.seasonal
print(f"원본 표준편차: {df['value'].std():.2f}")
print(f"계절 제거 후: {df['deseasonalized'].std():.2f}")
`,
      hints: [
        'seasonal_decompose(df[col], period=7)',
        'STL(df[col], period=7, robust=True)',
        '잔차 표준편차로 분해 품질 평가',
        '계절성 강도: 1 - Var(resid)/Var(seasonal+resid)'
      ]
    }
  },
  {
    id: 'p2w8d1t4',
    type: 'quiz',
    title: 'Day 1 퀴즈: 시계열 분해',
    duration: 10,
    content: {
      questions: [
        {
          question: '시계열의 3가지 구성 요소는?',
          options: ['Mean, Median, Mode', 'Trend, Seasonal, Residual', 'X, Y, Z', 'Input, Output, Error'],
          answer: 1
        },
        {
          question: 'Multiplicative 분해를 사용해야 할 때는?',
          options: ['계절 변동이 일정', '계절 변동이 추세에 비례', '노이즈가 많을 때', '데이터가 적을 때'],
          answer: 1
        },
        {
          question: 'period=7의 의미는?',
          options: ['7년 주기', '7개월 주기', '7일(주간) 주기', '7시간 주기'],
          answer: 2
        }
      ]
    }
  }
]
