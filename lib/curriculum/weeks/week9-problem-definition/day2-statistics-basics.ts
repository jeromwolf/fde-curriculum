// Day 2: 통계 기초 & 데이터 분포
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'p2w1d2t1',
    type: 'video',
    title: '기술 통계량: 중심 경향과 산포도',
    duration: 25,
    content: {
      objectives: [
        '평균, 중앙값, 최빈값의 차이를 이해한다',
        '표준편차와 분산의 의미를 파악한다',
        '데이터 분포에 따른 적절한 지표를 선택할 수 있다'
      ],
      videoUrl: '',
      transcript: `# 기술 통계량: 중심 경향과 산포도

## 중심 경향 (Central Tendency)

데이터의 "중심"을 나타내는 지표입니다.

### 평균 (Mean)
\`\`\`python
import pandas as pd
import numpy as np

# 평균 계산
mean_value = df['value'].mean()

# 주의: 이상치에 민감!
salaries = [50000, 55000, 60000, 65000, 1000000]
np.mean(salaries)  # 246,000 (CEO 급여로 인해 왜곡)
\`\`\`

### 중앙값 (Median)
\`\`\`python
# 중앙값 계산
median_value = df['value'].median()

# 이상치에 강건!
np.median(salaries)  # 60,000 (더 대표적)
\`\`\`

### 최빈값 (Mode)
\`\`\`python
# 최빈값 계산 (가장 빈번한 값)
mode_value = df['value'].mode()[0]

# 범주형 데이터에 유용
df['category'].mode()  # 가장 많은 카테고리
\`\`\`

## 평균 vs 중앙값: 언제 무엇을 사용할까?

| 상황 | 추천 지표 | 이유 |
|------|----------|------|
| 정규분포 | 평균 | 평균 = 중앙값 = 최빈값 |
| 오른쪽 꼬리 (소득, 매출) | 중앙값 | 이상치 영향 최소화 |
| 이상치 다수 | 중앙값 또는 절사평균 | 대표성 확보 |
| 범주형 데이터 | 최빈값 | 가장 흔한 카테고리 |

## 산포도 (Dispersion)

데이터가 얼마나 "퍼져있는지"를 나타냅니다.

### 표준편차 & 분산
\`\`\`python
# 표준편차 (원래 단위)
std_value = df['value'].std()

# 분산 (표준편차의 제곱)
var_value = df['value'].var()

# 예시
scores_a = [70, 70, 70, 70, 70]  # std = 0
scores_b = [50, 60, 70, 80, 90]  # std = 15.8
# 같은 평균(70)이지만 분포가 다름!
\`\`\`

### 범위 & 사분위수
\`\`\`python
# 범위 (Range)
range_value = df['value'].max() - df['value'].min()

# 사분위수
q1 = df['value'].quantile(0.25)  # 25%
q2 = df['value'].quantile(0.50)  # 50% (중앙값)
q3 = df['value'].quantile(0.75)  # 75%

# IQR (Interquartile Range)
iqr = q3 - q1
\`\`\`

## 변동계수 (Coefficient of Variation)

\`\`\`python
# 단위가 다른 데이터 비교 시 유용
cv = df['value'].std() / df['value'].mean() * 100

# 예시: 키 vs 몸무게 변동성 비교
cv_height = 10 / 170 * 100  # 5.9%
cv_weight = 15 / 70 * 100   # 21.4%
# 몸무게가 상대적으로 더 변동성 높음
\`\`\`

## 핵심 메시지

> "평균만 보면 안 됩니다. 분포의 형태와 산포도를 함께 파악해야 합니다."
`,
      keyPoints: [
        '평균: 모든 값의 합 / 개수, 이상치에 민감',
        '중앙값: 정렬 후 가운데 값, 이상치에 강건',
        '표준편차: 데이터의 퍼짐 정도 (원래 단위)',
        'IQR: Q3 - Q1, 박스플롯의 상자 크기'
      ]
    }
  },
  {
    id: 'p2w1d2t2',
    type: 'video',
    title: '분포 분석: 왜도와 첨도',
    duration: 20,
    content: {
      objectives: [
        '왜도(Skewness)의 의미를 이해한다',
        '첨도(Kurtosis)의 의미를 이해한다',
        '분포 형태에 따른 데이터 변환 필요성을 판단할 수 있다'
      ],
      videoUrl: '',
      transcript: `# 분포 분석: 왜도와 첨도

## 왜도 (Skewness)

분포의 **비대칭성**을 측정합니다.

\`\`\`python
from scipy.stats import skew

skewness = skew(df['value'])
\`\`\`

### 왜도 해석

| 왜도 값 | 분포 형태 | 예시 |
|---------|----------|------|
| = 0 | 대칭 | 정규분포 |
| > 0 | 오른쪽 꼬리 (양의 왜도) | 소득, 집값 |
| < 0 | 왼쪽 꼬리 (음의 왜도) | 시험 점수 (쉬운 시험) |

\`\`\`
양의 왜도 (오른쪽 꼬리):
      ┌───┐
      │   │
    ┌─┤   ├─────────────→
    │ │   │
────┴─┴───┴───────────────
    평균 > 중앙값

음의 왜도 (왼쪽 꼬리):
                ┌───┐
                │   │
←───────────────┤   ├─┐
                │   │ │
────────────────┴───┴─┴─
    평균 < 중앙값
\`\`\`

## 첨도 (Kurtosis)

분포의 **뾰족한 정도**와 **꼬리의 두께**를 측정합니다.

\`\`\`python
from scipy.stats import kurtosis

kurt = kurtosis(df['value'])
\`\`\`

### 첨도 해석 (Excess Kurtosis 기준)

| 첨도 값 | 분포 형태 | 의미 |
|---------|----------|------|
| = 0 | 정규분포 (Mesokurtic) | 기준 |
| > 0 | 뾰족함 (Leptokurtic) | 극단값 많음 |
| < 0 | 평평함 (Platykurtic) | 극단값 적음 |

## 실제 데이터 예시

\`\`\`python
import pandas as pd
import numpy as np
from scipy.stats import skew, kurtosis

# 소득 데이터 (양의 왜도 예상)
incomes = np.random.exponential(50000, 1000)
print(f"소득 왜도: {skew(incomes):.2f}")  # 약 2.0 (오른쪽 꼬리)

# 시험 점수 (정규분포에 가까움)
scores = np.random.normal(70, 10, 1000)
print(f"점수 왜도: {skew(scores):.2f}")  # 약 0

# 분포 시각화
import matplotlib.pyplot as plt
import seaborn as sns

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
sns.histplot(incomes, kde=True, ax=axes[0])
axes[0].set_title(f'소득 분포 (Skew: {skew(incomes):.2f})')

sns.histplot(scores, kde=True, ax=axes[1])
axes[1].set_title(f'점수 분포 (Skew: {skew(scores):.2f})')
\`\`\`

## 왜 중요한가?

### 1. 데이터 변환 결정
\`\`\`python
# 왜도가 크면 로그 변환 고려
if skew(df['value']) > 1:
    df['value_log'] = np.log1p(df['value'])
\`\`\`

### 2. 모델 선택
- 선형 모델: 정규분포 가정
- 트리 기반 모델: 분포에 덜 민감

### 3. 이상치 처리 전략
- 첨도 높음: 극단값 처리 필요
- 왜도 높음: 중앙값 사용, 로그 변환

## 핵심 메시지

> "분포의 모양을 이해해야 올바른 분석 전략을 세울 수 있습니다."
`,
      keyPoints: [
        '왜도: 분포의 비대칭성 (0=대칭, >0=오른쪽 꼬리)',
        '첨도: 분포의 뾰족함과 꼬리 두께 (0=정규분포)',
        '양의 왜도가 크면 로그 변환 고려',
        '분포 분석 → 변환 결정 → 모델 선택'
      ]
    }
  },
  {
    id: 'p2w1d2t3',
    type: 'video',
    title: '상관관계 분석',
    duration: 20,
    content: {
      objectives: [
        '피어슨/스피어만 상관계수의 차이를 이해한다',
        '상관관계 ≠ 인과관계임을 인식한다',
        '상관관계 히트맵을 해석할 수 있다'
      ],
      videoUrl: '',
      transcript: `# 상관관계 분석

## 상관계수란?

두 변수 간의 **선형 관계 강도**를 -1 ~ 1로 나타냅니다.

\`\`\`python
# 피어슨 상관계수 (기본)
correlation = df.corr()

# 스피어만 상관계수 (순위 기반)
correlation_spearman = df.corr(method='spearman')
\`\`\`

## 피어슨 vs 스피어만

| 종류 | 측정 | 사용 시점 |
|------|------|----------|
| 피어슨 | 선형 관계 | 정규분포, 선형 관계 |
| 스피어만 | 단조 관계 | 비선형, 순서형, 이상치 |

\`\`\`python
# 예시: 비선형 관계
x = np.arange(1, 11)
y = x ** 2  # 2차 관계

# 피어슨: 완벽한 선형 아님
np.corrcoef(x, y)[0, 1]  # 약 0.97

# 스피어만: 완벽한 단조 증가
from scipy.stats import spearmanr
spearmanr(x, y).correlation  # 1.0
\`\`\`

## 상관계수 해석

| 상관계수 | 해석 |
|---------|------|
| 0.9 ~ 1.0 | 매우 강한 양의 상관 |
| 0.7 ~ 0.9 | 강한 양의 상관 |
| 0.5 ~ 0.7 | 중간 양의 상관 |
| 0.3 ~ 0.5 | 약한 양의 상관 |
| 0.0 ~ 0.3 | 거의 없음 |
| 음수 | 음의 상관 (반대 방향) |

## 상관관계 히트맵

\`\`\`python
import matplotlib.pyplot as plt
import seaborn as sns

# 히트맵 시각화
plt.figure(figsize=(10, 8))
sns.heatmap(df.corr(),
            annot=True,        # 숫자 표시
            cmap='RdBu_r',     # 색상맵 (빨강-파랑)
            center=0,          # 0을 중심으로
            vmin=-1, vmax=1)   # 범위 고정
plt.title('Correlation Heatmap')
\`\`\`

## ⚠️ 상관관계 ≠ 인과관계

\`\`\`
유명한 예시:
- 아이스크림 판매량 ↑ ↔ 익사 사고 ↑
- 상관계수: 0.95 (매우 강함!)
- 인과관계? ❌

실제 원인: 여름 (더운 날씨)
→ 수영 증가 → 익사 사고 증가
→ 더위 → 아이스크림 소비 증가

이것이 "교란 변수" (Confounding Variable)
\`\`\`

### 인과관계 판단 기준

1. **시간적 선후관계**: 원인이 결과보다 먼저
2. **상관관계 존재**: 통계적 연관성
3. **다른 설명 배제**: 교란변수 통제
4. **실험**: 무작위 통제 실험 (Gold Standard)

## 다중 공선성 (Multicollinearity)

\`\`\`python
# 독립변수들 간의 높은 상관관계
# → 회귀 모델에서 문제 발생

# VIF (Variance Inflation Factor) 계산
from statsmodels.stats.outliers_influence import variance_inflation_factor

vif_data = pd.DataFrame()
vif_data["feature"] = X.columns
vif_data["VIF"] = [variance_inflation_factor(X.values, i)
                   for i in range(X.shape[1])]

# VIF > 10: 다중공선성 의심
# VIF > 5: 주의 필요
\`\`\`

## 핵심 메시지

> "상관관계는 발견이고, 인과관계는 검증입니다."
`,
      keyPoints: [
        '피어슨: 선형 관계, 스피어만: 단조 관계(순위 기반)',
        '상관계수 0.7 이상이면 강한 상관관계',
        '상관관계 ≠ 인과관계 (교란 변수 주의)',
        '다중공선성: 독립변수 간 높은 상관 → 모델 문제'
      ]
    }
  },
  {
    id: 'p2w1d2t4',
    type: 'code',
    title: '실습: Python 기술 통계 분석',
    duration: 45,
    content: {
      objectives: [
        'Pandas로 기술 통계량을 계산한다',
        '분포 형태를 분석하고 시각화한다',
        '상관관계를 분석하고 히트맵을 생성한다'
      ],
      instructions: `# 기술 통계 분석 실습

이 실습에서는 실제 데이터셋을 사용하여 기술 통계 분석을 수행합니다.

## 목표
1. 중심 경향 지표 계산 및 비교
2. 산포도 지표 계산
3. 분포 형태 분석 (왜도, 첨도)
4. 상관관계 분석

## 데이터셋
Kaggle House Prices 데이터셋 또는 유사 데이터를 사용합니다.
`,
      starterCode: `"""
기술 통계 분석 실습
"""
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import skew, kurtosis

# 샘플 데이터 생성 (실제로는 Kaggle 데이터 사용)
np.random.seed(42)
n = 1000

data = {
    'price': np.random.lognormal(12, 0.5, n),  # 로그정규 (양의 왜도)
    'sqft': np.random.normal(2000, 500, n),     # 정규분포
    'bedrooms': np.random.choice([2, 3, 4, 5], n, p=[0.2, 0.4, 0.3, 0.1]),
    'age': np.random.exponential(20, n),        # 지수분포
    'distance_to_city': np.random.uniform(1, 30, n)
}
df = pd.DataFrame(data)

# ============================================================
# Part 1: 중심 경향 지표
# ============================================================

def analyze_central_tendency(series, name):
    """중심 경향 지표를 분석합니다."""
    result = {
        'name': name,
        'mean': None,      # TODO: 평균 계산
        'median': None,    # TODO: 중앙값 계산
        'mode': None,      # TODO: 최빈값 계산
        'mean_median_diff': None  # TODO: 평균과 중앙값 차이
    }

    # TODO: 각 지표 계산

    return result

# 각 수치형 컬럼에 대해 분석
numerical_cols = ['price', 'sqft', 'age', 'distance_to_city']

print("=" * 60)
print("중심 경향 분석")
print("=" * 60)

for col in numerical_cols:
    result = analyze_central_tendency(df[col], col)
    # TODO: 결과 출력


# ============================================================
# Part 2: 산포도 지표
# ============================================================

def analyze_dispersion(series, name):
    """산포도 지표를 분석합니다."""
    result = {
        'name': name,
        'std': None,       # TODO: 표준편차
        'var': None,       # TODO: 분산
        'range': None,     # TODO: 범위
        'iqr': None,       # TODO: IQR
        'cv': None         # TODO: 변동계수 (%)
    }

    # TODO: 각 지표 계산

    return result

print("\\n" + "=" * 60)
print("산포도 분석")
print("=" * 60)

for col in numerical_cols:
    result = analyze_dispersion(df[col], col)
    # TODO: 결과 출력


# ============================================================
# Part 3: 분포 형태 분석
# ============================================================

def analyze_distribution_shape(series, name):
    """분포 형태를 분석합니다."""
    result = {
        'name': name,
        'skewness': None,   # TODO: 왜도
        'kurtosis': None,   # TODO: 첨도
        'needs_transform': None,  # TODO: 변환 필요 여부
        'suggested_transform': None  # TODO: 추천 변환
    }

    # TODO: 왜도, 첨도 계산 및 변환 필요 여부 판단

    return result

print("\\n" + "=" * 60)
print("분포 형태 분석")
print("=" * 60)

for col in numerical_cols:
    result = analyze_distribution_shape(df[col], col)
    # TODO: 결과 출력


# ============================================================
# Part 4: 시각화
# ============================================================

def plot_distributions(df, columns):
    """분포를 시각화합니다."""
    n_cols = len(columns)
    fig, axes = plt.subplots(2, n_cols, figsize=(4*n_cols, 8))

    for i, col in enumerate(columns):
        # TODO: 히스토그램 + KDE 플롯

        # TODO: 박스플롯
        pass

    plt.tight_layout()
    plt.savefig('distributions.png', dpi=100)
    print("\\n분포 시각화 저장: distributions.png")

# TODO: plot_distributions 호출


# ============================================================
# Part 5: 상관관계 분석
# ============================================================

def analyze_correlations(df, columns):
    """상관관계를 분석합니다."""
    # TODO: 상관관계 행렬 계산
    corr_matrix = None

    # TODO: 강한 상관관계 쌍 찾기 (|r| > 0.5)
    strong_correlations = []

    return corr_matrix, strong_correlations

# TODO: 상관관계 분석 및 히트맵 생성


# ============================================================
# Part 6: 종합 리포트
# ============================================================

def generate_summary_report():
    """종합 리포트를 생성합니다."""
    print("\\n" + "=" * 60)
    print("📊 기술 통계 분석 종합 리포트")
    print("=" * 60)

    # TODO: 주요 발견사항 요약

    print("\\n✅ 분석 완료!")


generate_summary_report()
`,
      solutionCode: `"""
기술 통계 분석 실습 - 솔루션
"""
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import skew, kurtosis

# 샘플 데이터 생성
np.random.seed(42)
n = 1000

data = {
    'price': np.random.lognormal(12, 0.5, n),
    'sqft': np.random.normal(2000, 500, n),
    'bedrooms': np.random.choice([2, 3, 4, 5], n, p=[0.2, 0.4, 0.3, 0.1]),
    'age': np.random.exponential(20, n),
    'distance_to_city': np.random.uniform(1, 30, n)
}
df = pd.DataFrame(data)

# ============================================================
# Part 1: 중심 경향 지표
# ============================================================

def analyze_central_tendency(series, name):
    """중심 경향 지표를 분석합니다."""
    mean_val = series.mean()
    median_val = series.median()
    mode_val = series.mode()[0] if len(series.mode()) > 0 else np.nan

    result = {
        'name': name,
        'mean': mean_val,
        'median': median_val,
        'mode': mode_val,
        'mean_median_diff': mean_val - median_val
    }

    return result

numerical_cols = ['price', 'sqft', 'age', 'distance_to_city']

print("=" * 60)
print("중심 경향 분석")
print("=" * 60)

for col in numerical_cols:
    result = analyze_central_tendency(df[col], col)
    print(f"\\n{result['name']}:")
    print(f"  평균: {result['mean']:,.2f}")
    print(f"  중앙값: {result['median']:,.2f}")
    print(f"  차이: {result['mean_median_diff']:,.2f}")
    if abs(result['mean_median_diff']) > result['median'] * 0.1:
        print("  ⚠️ 평균과 중앙값 차이가 큼 → 왜곡된 분포 가능")


# ============================================================
# Part 2: 산포도 지표
# ============================================================

def analyze_dispersion(series, name):
    """산포도 지표를 분석합니다."""
    q1 = series.quantile(0.25)
    q3 = series.quantile(0.75)

    result = {
        'name': name,
        'std': series.std(),
        'var': series.var(),
        'range': series.max() - series.min(),
        'iqr': q3 - q1,
        'cv': (series.std() / series.mean()) * 100
    }

    return result

print("\\n" + "=" * 60)
print("산포도 분석")
print("=" * 60)

for col in numerical_cols:
    result = analyze_dispersion(df[col], col)
    print(f"\\n{result['name']}:")
    print(f"  표준편차: {result['std']:,.2f}")
    print(f"  IQR: {result['iqr']:,.2f}")
    print(f"  변동계수: {result['cv']:.1f}%")


# ============================================================
# Part 3: 분포 형태 분석
# ============================================================

def analyze_distribution_shape(series, name):
    """분포 형태를 분석합니다."""
    skewness = skew(series)
    kurt = kurtosis(series)

    needs_transform = abs(skewness) > 1

    if skewness > 1:
        suggested_transform = "로그 변환 (log1p)"
    elif skewness < -1:
        suggested_transform = "제곱근 또는 제곱 변환"
    else:
        suggested_transform = "변환 불필요"

    result = {
        'name': name,
        'skewness': skewness,
        'kurtosis': kurt,
        'needs_transform': needs_transform,
        'suggested_transform': suggested_transform
    }

    return result

print("\\n" + "=" * 60)
print("분포 형태 분석")
print("=" * 60)

for col in numerical_cols:
    result = analyze_distribution_shape(df[col], col)
    skew_type = "대칭" if abs(result['skewness']) < 0.5 else \
                "오른쪽 꼬리" if result['skewness'] > 0 else "왼쪽 꼬리"
    print(f"\\n{result['name']}:")
    print(f"  왜도: {result['skewness']:.2f} ({skew_type})")
    print(f"  첨도: {result['kurtosis']:.2f}")
    print(f"  변환 필요: {'예' if result['needs_transform'] else '아니오'}")
    if result['needs_transform']:
        print(f"  추천: {result['suggested_transform']}")


# ============================================================
# Part 4: 시각화
# ============================================================

def plot_distributions(df, columns):
    """분포를 시각화합니다."""
    n_cols = len(columns)
    fig, axes = plt.subplots(2, n_cols, figsize=(4*n_cols, 8))

    for i, col in enumerate(columns):
        # 히스토그램 + KDE
        sns.histplot(df[col], kde=True, ax=axes[0, i])
        axes[0, i].set_title(f'{col}\\n(Skew: {skew(df[col]):.2f})')
        axes[0, i].axvline(df[col].mean(), color='r', linestyle='--', label='Mean')
        axes[0, i].axvline(df[col].median(), color='g', linestyle='--', label='Median')
        axes[0, i].legend()

        # 박스플롯
        sns.boxplot(x=df[col], ax=axes[1, i])
        axes[1, i].set_title(f'{col} Boxplot')

    plt.tight_layout()
    plt.savefig('distributions.png', dpi=100)
    print("\\n분포 시각화 저장: distributions.png")

plot_distributions(df, numerical_cols)


# ============================================================
# Part 5: 상관관계 분석
# ============================================================

def analyze_correlations(df, columns):
    """상관관계를 분석합니다."""
    corr_matrix = df[columns].corr()

    strong_correlations = []
    for i in range(len(columns)):
        for j in range(i+1, len(columns)):
            r = corr_matrix.iloc[i, j]
            if abs(r) > 0.3:
                strong_correlations.append({
                    'var1': columns[i],
                    'var2': columns[j],
                    'correlation': r
                })

    return corr_matrix, strong_correlations

corr_matrix, strong_corr = analyze_correlations(df, numerical_cols)

print("\\n" + "=" * 60)
print("상관관계 분석")
print("=" * 60)

print("\\n상관관계 행렬:")
print(corr_matrix.round(3))

if strong_corr:
    print("\\n주목할 상관관계 (|r| > 0.3):")
    for item in strong_corr:
        print(f"  {item['var1']} ↔ {item['var2']}: {item['correlation']:.3f}")

# 히트맵
plt.figure(figsize=(8, 6))
sns.heatmap(corr_matrix, annot=True, cmap='RdBu_r', center=0, vmin=-1, vmax=1)
plt.title('Correlation Heatmap')
plt.tight_layout()
plt.savefig('correlation_heatmap.png', dpi=100)
print("\\n상관관계 히트맵 저장: correlation_heatmap.png")


# ============================================================
# Part 6: 종합 리포트
# ============================================================

def generate_summary_report():
    """종합 리포트를 생성합니다."""
    print("\\n" + "=" * 60)
    print("📊 기술 통계 분석 종합 리포트")
    print("=" * 60)

    print("\\n🔍 주요 발견사항:")

    # 왜곡된 분포 확인
    for col in numerical_cols:
        s = skew(df[col])
        if abs(s) > 1:
            print(f"  • {col}: 왜도 {s:.2f} → 로그 변환 권장")

    # 이상치 확인
    for col in numerical_cols:
        q1 = df[col].quantile(0.25)
        q3 = df[col].quantile(0.75)
        iqr = q3 - q1
        outliers = df[(df[col] < q1 - 1.5*iqr) | (df[col] > q3 + 1.5*iqr)]
        if len(outliers) > 0:
            pct = len(outliers) / len(df) * 100
            print(f"  • {col}: 이상치 {len(outliers)}개 ({pct:.1f}%)")

    print("\\n✅ 분석 완료!")


generate_summary_report()
`,
      hints: [
        'df.describe()로 기본 통계량을 빠르게 확인할 수 있습니다',
        'scipy.stats의 skew, kurtosis 함수를 사용하세요',
        '상관관계 히트맵에서 center=0을 설정하면 0을 기준으로 색상이 나뉩니다',
        '왜도가 1보다 크면 로그 변환을 고려하세요'
      ]
    }
  },
  {
    id: 'p2w1d2t5',
    type: 'quiz',
    title: 'Day 2 퀴즈: 통계 기초',
    duration: 10,
    content: {
      questions: [
        {
          question: '소득 데이터처럼 오른쪽으로 긴 꼬리를 가진 분포에서 어떤 중심 지표가 더 적합한가요?',
          options: [
            '평균',
            '중앙값',
            '최빈값',
            '표준편차'
          ],
          answer: 1,
          explanation: '오른쪽 꼬리(양의 왜도)가 있는 분포에서는 극단값이 평균을 높이므로, 중앙값이 더 대표적인 중심 지표입니다.'
        },
        {
          question: '왜도(Skewness)가 2.5인 데이터에 대한 적절한 조치는?',
          options: [
            '데이터 삭제',
            '표준화 (Z-score)',
            '로그 변환',
            '조치 불필요'
          ],
          answer: 2,
          explanation: '왜도가 1을 초과하면 심한 비대칭이므로, 로그 변환(log1p)으로 정규분포에 가깝게 만들 수 있습니다.'
        },
        {
          question: '피어슨 상관계수가 0.95인 두 변수에 대한 올바른 해석은?',
          options: [
            'A가 B를 유발한다',
            'B가 A를 유발한다',
            '두 변수 사이에 강한 선형 관계가 있다',
            '두 변수는 동일하다'
          ],
          answer: 2,
          explanation: '상관관계는 연관성만 나타내며, 인과관계를 의미하지 않습니다. 높은 상관계수는 강한 선형 관계만 의미합니다.'
        },
        {
          question: 'IQR(사분위범위)의 정의는?',
          options: [
            '최대값 - 최소값',
            'Q3 - Q1',
            '평균 - 중앙값',
            '표준편차 × 2'
          ],
          answer: 1,
          explanation: 'IQR은 제3사분위수(Q3)에서 제1사분위수(Q1)를 뺀 값으로, 중앙 50% 데이터의 범위를 나타냅니다.'
        },
        {
          question: '스피어만 상관계수가 피어슨보다 적합한 경우는?',
          options: [
            '두 변수 모두 정규분포일 때',
            '완벽한 선형 관계일 때',
            '순위형 데이터이거나 비선형 단조 관계일 때',
            '이상치가 전혀 없을 때'
          ],
          answer: 2,
          explanation: '스피어만 상관계수는 순위를 기반으로 하므로, 순서형 데이터나 비선형이지만 단조로운 관계에 적합합니다.'
        }
      ]
    }
  }
]
