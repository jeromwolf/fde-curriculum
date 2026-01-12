// Day 4: 결측치 & 이상치 분석
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'p2w1d4t1',
    type: 'video',
    title: '결측치 유형과 패턴 분석',
    duration: 25,
    content: {
      objectives: [
        '결측치의 3가지 유형(MCAR, MAR, MNAR)을 구분할 수 있다',
        '결측 패턴을 시각화하고 분석할 수 있다',
        '결측치 처리 전략을 수립할 수 있다'
      ],
      videoUrl: '',
      transcript: `# 결측치 유형과 패턴 분석

## 결측치 유형 (Missing Data Types)

### 1. MCAR (Missing Completely At Random)
\`\`\`
- 결측이 완전히 무작위로 발생
- 다른 변수와 무관
- 예: 설문 응답자가 실수로 문항 건너뜀
- 처리: 삭제해도 편향 없음
\`\`\`

### 2. MAR (Missing At Random)
\`\`\`
- 결측이 관측된 다른 변수와 관련
- 예: 젊은 사람이 소득 공개 기피 (나이로 예측 가능)
- 처리: 조건부 대체 (그룹별 평균 등)
\`\`\`

### 3. MNAR (Missing Not At Random)
\`\`\`
- 결측이 결측값 자체와 관련
- 예: 고소득자가 소득 공개 기피 (소득이 높아서 숨김)
- 처리: 가장 어려움, 도메인 지식 필요
\`\`\`

## 결측치 현황 확인

\`\`\`python
import pandas as pd
import numpy as np

# 기본 현황
df.isnull().sum()                    # 컬럼별 결측 수
df.isnull().sum() / len(df) * 100    # 결측 비율 (%)

# 결측 있는 행 수
df.isnull().any(axis=1).sum()

# 결측 패턴 요약
def missing_summary(df):
    missing = df.isnull().sum()
    percent = missing / len(df) * 100
    summary = pd.DataFrame({
        'Missing': missing,
        'Percent': percent
    }).sort_values('Percent', ascending=False)
    return summary[summary['Missing'] > 0]
\`\`\`

## 결측 패턴 시각화 (missingno)

\`\`\`python
import missingno as msno

# 결측 매트릭스 (흰색 = 결측)
msno.matrix(df)

# 결측 상관관계 (함께 결측되는 패턴)
msno.heatmap(df)

# 덴드로그램 (결측 패턴 클러스터링)
msno.dendrogram(df)

# 막대그래프 (컬럼별 결측 비율)
msno.bar(df)
\`\`\`

## 결측 유형 판단 방법

### 1. 그룹별 결측 비율 비교
\`\`\`python
# MAR 테스트: 나이대별 소득 결측 비율
df.groupby('age_group')['income'].apply(lambda x: x.isnull().mean())

# 결측 비율이 그룹마다 다르면 → MAR 가능성
\`\`\`

### 2. Little's MCAR Test (통계적 검정)
\`\`\`python
# 귀무가설: MCAR
# p-value < 0.05면 MCAR 기각 → MAR 또는 MNAR
\`\`\`

## 핵심 메시지

> "결측 유형을 파악해야 올바른 처리 전략을 세울 수 있습니다."
`,
      keyPoints: [
        'MCAR: 완전 무작위, MAR: 다른 변수와 관련, MNAR: 결측값 자체와 관련',
        'missingno 라이브러리로 결측 패턴 시각화',
        '그룹별 결측 비율 비교로 MAR 여부 판단',
        '결측 5% 미만이고 MCAR이면 삭제도 가능'
      ]
    }
  },
  {
    id: 'p2w1d4t2',
    type: 'video',
    title: '이상치 탐지 기법',
    duration: 25,
    content: {
      objectives: [
        'IQR, Z-score 방법으로 이상치를 탐지할 수 있다',
        '다변량 이상치를 탐지할 수 있다',
        '이상치가 오류인지 의미 있는 값인지 판단할 수 있다'
      ],
      videoUrl: '',
      transcript: `# 이상치 탐지 기법

## IQR (Interquartile Range) 방법

\`\`\`python
Q1 = df['value'].quantile(0.25)
Q3 = df['value'].quantile(0.75)
IQR = Q3 - Q1

lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = df[(df['value'] < lower_bound) | (df['value'] > upper_bound)]
print(f"이상치 수: {len(outliers)} ({len(outliers)/len(df)*100:.1f}%)")
\`\`\`

### IQR 시각화 (박스플롯)
\`\`\`
    ┌─────┐
    │     │ ← Q3 (75%)
    ├─────┤
    │     │ ← Q2 (중앙값)
    ├─────┤
    │     │ ← Q1 (25%)
    └─────┘
───●───────────●───  ← 수염 (1.5×IQR 범위)
   ○               ○  ← 이상치
\`\`\`

## Z-score 방법

\`\`\`python
from scipy import stats

z_scores = np.abs(stats.zscore(df['value']))
outliers = df[z_scores > 3]  # |z| > 3

# 또는 수동 계산
mean = df['value'].mean()
std = df['value'].std()
z = (df['value'] - mean) / std
outliers = df[np.abs(z) > 3]
\`\`\`

### Z-score 해석
| Z-score | 의미 | 비율 (정규분포) |
|---------|------|----------------|
| 1 | 평균에서 1 표준편차 | 68% 이내 |
| 2 | 평균에서 2 표준편차 | 95% 이내 |
| 3 | 평균에서 3 표준편차 | 99.7% 이내 |

## 다변량 이상치 (Mahalanobis Distance)

\`\`\`python
from scipy.spatial.distance import mahalanobis
from scipy import stats

def mahalanobis_outliers(df, columns, threshold=3):
    X = df[columns].dropna()
    mean = X.mean()
    cov = X.cov()
    cov_inv = np.linalg.inv(cov)

    distances = X.apply(
        lambda row: mahalanobis(row, mean, cov_inv),
        axis=1
    )

    # 카이제곱 분포 기반 임계값
    chi2_threshold = stats.chi2.ppf(0.975, df=len(columns))
    outliers = distances > np.sqrt(chi2_threshold)

    return outliers
\`\`\`

## 이상치 유형 판단

| 유형 | 원인 | 처리 |
|------|------|------|
| 데이터 오류 | 입력 실수, 시스템 오류 | 삭제 또는 수정 |
| 측정 한계 | 센서 범위 초과 | Winsorize |
| 자연 변동 | 극단적이지만 실제 값 | 유지 또는 별도 분석 |
| 다른 모집단 | 고소득층, VIP 등 | 분리 모델링 |

## 핵심 메시지

> "이상치를 무조건 제거하지 마세요. 왜 이상치인지 이해하는 것이 중요합니다."
`,
      keyPoints: [
        'IQR 방법: Q1 - 1.5×IQR ~ Q3 + 1.5×IQR 범위 밖',
        'Z-score: |z| > 3이면 이상치 (정규분포 가정)',
        '다변량 이상치: Mahalanobis Distance 활용',
        '이상치 = 오류가 아닐 수 있음, 도메인 지식으로 판단'
      ]
    }
  },
  {
    id: 'p2w1d4t3',
    type: 'code',
    title: '실습: 결측치 & 이상치 분석 파이프라인',
    duration: 50,
    content: {
      objectives: [
        '결측치 현황을 분석하고 시각화한다',
        '다양한 방법으로 이상치를 탐지한다',
        '처리 전략을 수립하고 적용한다'
      ],
      instructions: `# 결측치 & 이상치 분석 파이프라인

이 실습에서는 지저분한 데이터셋을 분석하고 정제하는 파이프라인을 구축합니다.
`,
      starterCode: `"""
결측치 & 이상치 분석 파이프라인
"""
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# 지저분한 샘플 데이터 생성
np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'age': np.random.normal(35, 10, n),
    'income': np.random.lognormal(11, 0.5, n),
    'credit_score': np.random.normal(700, 50, n),
    'tenure': np.random.exponential(24, n),
    'category': np.random.choice(['A', 'B', 'C'], n)
})

# 결측치 주입
df.loc[np.random.choice(n, 50), 'age'] = np.nan
df.loc[np.random.choice(n, 100), 'income'] = np.nan
df.loc[df['category'] == 'C', 'credit_score'] = np.where(
    np.random.random(sum(df['category'] == 'C')) < 0.3,
    np.nan,
    df.loc[df['category'] == 'C', 'credit_score']
)

# 이상치 주입
df.loc[np.random.choice(n, 20), 'income'] *= 10
df.loc[np.random.choice(n, 10), 'age'] = np.random.choice([150, -10, 200], 10)

print(f"Dataset: {df.shape}")


# ============================================================
# Part 1: 결측치 분석
# ============================================================

def analyze_missing(df):
    """결측치 현황을 분석합니다."""
    print("=" * 50)
    print("결측치 분석")
    print("=" * 50)

    # TODO: 컬럼별 결측 수와 비율 계산
    missing_summary = None

    # TODO: 결측 패턴 분석 (어떤 컬럼들이 함께 결측되는지)

    # TODO: 그룹별 결측 비율 비교 (MAR 여부 판단)

    return missing_summary

# TODO: analyze_missing 호출


# ============================================================
# Part 2: 결측치 시각화
# ============================================================

def visualize_missing(df):
    """결측 패턴을 시각화합니다."""
    # TODO: missingno 또는 직접 시각화

    pass

# TODO: visualize_missing 호출


# ============================================================
# Part 3: 이상치 탐지
# ============================================================

def detect_outliers_iqr(series, multiplier=1.5):
    """IQR 방법으로 이상치를 탐지합니다."""
    Q1 = series.quantile(0.25)
    Q3 = series.quantile(0.75)
    IQR = Q3 - Q1

    lower = Q1 - multiplier * IQR
    upper = Q3 + multiplier * IQR

    outliers = (series < lower) | (series > upper)
    return outliers, lower, upper


def detect_outliers_zscore(series, threshold=3):
    """Z-score 방법으로 이상치를 탐지합니다."""
    # TODO: Z-score 계산 및 이상치 탐지
    pass


def analyze_outliers(df):
    """이상치 현황을 분석합니다."""
    print("\\n" + "=" * 50)
    print("이상치 분석")
    print("=" * 50)

    numerical_cols = ['age', 'income', 'credit_score', 'tenure']

    for col in numerical_cols:
        series = df[col].dropna()

        # TODO: IQR 방법 적용
        iqr_outliers, lower, upper = detect_outliers_iqr(series)

        # TODO: Z-score 방법 적용

        # TODO: 결과 출력

# TODO: analyze_outliers 호출


# ============================================================
# Part 4: 이상치 시각화
# ============================================================

def visualize_outliers(df):
    """이상치를 시각화합니다."""
    numerical_cols = ['age', 'income', 'credit_score', 'tenure']

    fig, axes = plt.subplots(2, 2, figsize=(12, 10))

    for i, col in enumerate(numerical_cols):
        ax = axes[i // 2, i % 2]
        # TODO: 박스플롯으로 이상치 시각화
        pass

    plt.tight_layout()
    plt.savefig('outliers_boxplot.png', dpi=100)
    print("\\nSaved: outliers_boxplot.png")

# TODO: visualize_outliers 호출


# ============================================================
# Part 5: 처리 전략 수립
# ============================================================

def create_treatment_plan(df):
    """결측치와 이상치 처리 전략을 수립합니다."""
    print("\\n" + "=" * 50)
    print("처리 전략")
    print("=" * 50)

    treatment_plan = {
        # 'column_name': {
        #     'missing_treatment': '중앙값 대체',
        #     'missing_reason': 'MCAR로 판단, 5% 미만',
        #     'outlier_treatment': 'Winsorize (1%, 99%)',
        #     'outlier_reason': '극단값이지만 유효한 데이터'
        # }
    }

    # TODO: 각 컬럼에 대한 처리 전략 수립

    return treatment_plan

# TODO: create_treatment_plan 호출


# ============================================================
# Part 6: 처리 적용
# ============================================================

def apply_treatment(df, treatment_plan):
    """처리 전략을 적용합니다."""
    df_clean = df.copy()

    # TODO: 결측치 처리

    # TODO: 이상치 처리

    print("\\n처리 전후 비교:")
    print(f"  원본: {df.shape}")
    print(f"  처리 후: {df_clean.shape}")
    print(f"  결측 제거: {df.isnull().sum().sum()} -> {df_clean.isnull().sum().sum()}")

    return df_clean

# TODO: apply_treatment 호출


# 분석 실행
if __name__ == "__main__":
    analyze_missing(df)
    analyze_outliers(df)
    plan = create_treatment_plan(df)
`,
      solutionCode: `"""
결측치 & 이상치 분석 파이프라인 - 솔루션
"""
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'age': np.random.normal(35, 10, n),
    'income': np.random.lognormal(11, 0.5, n),
    'credit_score': np.random.normal(700, 50, n),
    'tenure': np.random.exponential(24, n),
    'category': np.random.choice(['A', 'B', 'C'], n)
})

df.loc[np.random.choice(n, 50), 'age'] = np.nan
df.loc[np.random.choice(n, 100), 'income'] = np.nan
df.loc[df['category'] == 'C', 'credit_score'] = np.where(
    np.random.random(sum(df['category'] == 'C')) < 0.3,
    np.nan,
    df.loc[df['category'] == 'C', 'credit_score']
)

df.loc[np.random.choice(n, 20), 'income'] *= 10
df.loc[np.random.choice(n, 10), 'age'] = np.random.choice([150, -10, 200], 10)


# ============================================================
# Part 1: 결측치 분석
# ============================================================

def analyze_missing(df):
    print("=" * 50)
    print("Missing Value Analysis")
    print("=" * 50)

    missing = df.isnull().sum()
    percent = df.isnull().sum() / len(df) * 100
    missing_summary = pd.DataFrame({
        'Missing': missing,
        'Percent': percent.round(2)
    }).sort_values('Percent', ascending=False)

    print("\\nMissing by Column:")
    print(missing_summary[missing_summary['Missing'] > 0])

    print("\\nMissing by Category (credit_score):")
    missing_by_cat = df.groupby('category')['credit_score'].apply(
        lambda x: x.isnull().mean() * 100
    )
    print(missing_by_cat.round(2))

    if missing_by_cat.std() > 5:
        print("-> MAR suspected: Missing rate varies by category")
    else:
        print("-> MCAR suspected: Missing rate is uniform")

    return missing_summary

analyze_missing(df)


# ============================================================
# Part 2: 결측치 시각화
# ============================================================

def visualize_missing(df):
    fig, axes = plt.subplots(1, 2, figsize=(12, 4))

    missing_pct = df.isnull().sum() / len(df) * 100
    missing_pct = missing_pct[missing_pct > 0].sort_values(ascending=False)

    axes[0].bar(missing_pct.index, missing_pct.values)
    axes[0].set_title('Missing Percentage by Column')
    axes[0].set_ylabel('Percent (%)')

    missing_matrix = df.isnull().astype(int)
    sns.heatmap(missing_matrix.sample(100).T, cbar=False, ax=axes[1],
                yticklabels=True, cmap='YlOrRd')
    axes[1].set_title('Missing Pattern (Sample 100 rows)')

    plt.tight_layout()
    plt.savefig('missing_analysis.png', dpi=100)
    print("\\nSaved: missing_analysis.png")

visualize_missing(df)


# ============================================================
# Part 3: 이상치 탐지
# ============================================================

def detect_outliers_iqr(series, multiplier=1.5):
    Q1 = series.quantile(0.25)
    Q3 = series.quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - multiplier * IQR
    upper = Q3 + multiplier * IQR
    outliers = (series < lower) | (series > upper)
    return outliers, lower, upper


def detect_outliers_zscore(series, threshold=3):
    z = np.abs(stats.zscore(series.dropna()))
    outliers = pd.Series(False, index=series.index)
    outliers.loc[series.dropna().index] = z > threshold
    return outliers


def analyze_outliers(df):
    print("\\n" + "=" * 50)
    print("Outlier Analysis")
    print("=" * 50)

    numerical_cols = ['age', 'income', 'credit_score', 'tenure']

    for col in numerical_cols:
        series = df[col].dropna()

        iqr_outliers, lower, upper = detect_outliers_iqr(series)
        zscore_outliers = detect_outliers_zscore(df[col])

        iqr_count = iqr_outliers.sum()
        z_count = zscore_outliers.sum()

        print(f"\\n{col}:")
        print(f"  IQR outliers: {iqr_count} ({iqr_count/len(series)*100:.1f}%)")
        print(f"  Z-score outliers: {z_count} ({z_count/len(df)*100:.1f}%)")
        print(f"  Range: [{lower:.2f}, {upper:.2f}]")

        extreme = series[iqr_outliers]
        if len(extreme) > 0:
            print(f"  Extreme values: min={extreme.min():.2f}, max={extreme.max():.2f}")

analyze_outliers(df)


# ============================================================
# Part 4: 이상치 시각화
# ============================================================

def visualize_outliers(df):
    numerical_cols = ['age', 'income', 'credit_score', 'tenure']

    fig, axes = plt.subplots(2, 2, figsize=(12, 10))

    for i, col in enumerate(numerical_cols):
        ax = axes[i // 2, i % 2]

        data = df[col].dropna()
        outliers, lower, upper = detect_outliers_iqr(data)

        sns.boxplot(x=data, ax=ax)
        ax.set_title(f'{col} (Outliers: {outliers.sum()})')

        ax.axvline(lower, color='r', linestyle='--', alpha=0.5, label='Lower bound')
        ax.axvline(upper, color='r', linestyle='--', alpha=0.5, label='Upper bound')

    plt.tight_layout()
    plt.savefig('outliers_boxplot.png', dpi=100)
    print("\\nSaved: outliers_boxplot.png")

visualize_outliers(df)


# ============================================================
# Part 5: 처리 전략 수립
# ============================================================

def create_treatment_plan(df):
    print("\\n" + "=" * 50)
    print("Treatment Plan")
    print("=" * 50)

    treatment_plan = {
        'age': {
            'missing_treatment': 'Median imputation',
            'missing_reason': 'MCAR, 5% missing',
            'outlier_treatment': 'Clip to [0, 100]',
            'outlier_reason': 'Obvious data errors (negative, >120)'
        },
        'income': {
            'missing_treatment': 'Group median (by category)',
            'missing_reason': '10% missing, check MAR',
            'outlier_treatment': 'Log transform + Winsorize 1%/99%',
            'outlier_reason': 'Right-skewed, extreme but valid'
        },
        'credit_score': {
            'missing_treatment': 'Group median (by category)',
            'missing_reason': 'MAR - higher missing in category C',
            'outlier_treatment': 'Clip to [300, 850]',
            'outlier_reason': 'Valid credit score range'
        },
        'tenure': {
            'missing_treatment': 'No missing',
            'missing_reason': 'N/A',
            'outlier_treatment': 'Keep (natural variation)',
            'outlier_reason': 'Exponential distribution expected'
        }
    }

    for col, plan in treatment_plan.items():
        print(f"\\n{col}:")
        print(f"  Missing: {plan['missing_treatment']} ({plan['missing_reason']})")
        print(f"  Outlier: {plan['outlier_treatment']} ({plan['outlier_reason']})")

    return treatment_plan

plan = create_treatment_plan(df)


# ============================================================
# Part 6: 처리 적용
# ============================================================

def apply_treatment(df, treatment_plan):
    df_clean = df.copy()

    # Age: Median imputation + Clip
    df_clean['age'] = df_clean['age'].fillna(df_clean['age'].median())
    df_clean['age'] = df_clean['age'].clip(0, 100)

    # Income: Group median + Log transform + Winsorize
    df_clean['income'] = df_clean.groupby('category')['income'].transform(
        lambda x: x.fillna(x.median())
    )
    lower = df_clean['income'].quantile(0.01)
    upper = df_clean['income'].quantile(0.99)
    df_clean['income'] = df_clean['income'].clip(lower, upper)

    # Credit Score: Group median + Clip
    df_clean['credit_score'] = df_clean.groupby('category')['credit_score'].transform(
        lambda x: x.fillna(x.median())
    )
    df_clean['credit_score'] = df_clean['credit_score'].clip(300, 850)

    print("\\n" + "=" * 50)
    print("Treatment Results")
    print("=" * 50)
    print(f"\\nBefore: {df.isnull().sum().sum()} missing values")
    print(f"After: {df_clean.isnull().sum().sum()} missing values")

    for col in ['age', 'income', 'credit_score']:
        before = detect_outliers_iqr(df[col].dropna())[0].sum()
        after = detect_outliers_iqr(df_clean[col])[0].sum()
        print(f"{col} outliers: {before} -> {after}")

    return df_clean

df_clean = apply_treatment(df, plan)
print("\\nData cleaning complete!")
`,
      hints: [
        'missingno 라이브러리가 없으면 seaborn heatmap으로 대체할 수 있습니다',
        'IQR 이상치는 Q1 - 1.5×IQR 미만 또는 Q3 + 1.5×IQR 초과입니다',
        'fillna()에서 groupby().transform()을 사용하면 그룹별 대체가 가능합니다',
        'clip()으로 값의 범위를 제한할 수 있습니다'
      ]
    }
  },
  {
    id: 'p2w1d4t4',
    type: 'quiz',
    title: 'Day 4 퀴즈: 결측치 & 이상치',
    duration: 10,
    content: {
      questions: [
        {
          question: '고소득자가 소득을 공개하지 않아 소득 데이터가 결측인 경우, 어떤 결측 유형인가요?',
          options: [
            'MCAR',
            'MAR',
            'MNAR',
            'MBAR'
          ],
          answer: 2,
          explanation: '결측이 결측값 자체(높은 소득)와 관련되므로 MNAR(Missing Not At Random)입니다.'
        },
        {
          question: 'IQR 방법에서 이상치 판정 기준은?',
          options: [
            '평균에서 2 표준편차 이상',
            'Q1 - 1.5×IQR 미만 또는 Q3 + 1.5×IQR 초과',
            '중앙값에서 3배 이상',
            '상위 또는 하위 1%'
          ],
          answer: 1,
          explanation: 'IQR 방법은 Q1 - 1.5×IQR보다 작거나 Q3 + 1.5×IQR보다 큰 값을 이상치로 판정합니다.'
        },
        {
          question: '다음 중 결측치 처리로 적절하지 않은 것은?',
          options: [
            'MCAR일 때 행 삭제',
            'MAR일 때 그룹별 중앙값 대체',
            'MNAR일 때 무조건 평균 대체',
            '시계열에서 앞 값으로 채우기 (ffill)'
          ],
          answer: 2,
          explanation: 'MNAR은 결측값 자체와 관련이 있으므로 단순 평균 대체는 편향을 유발합니다. 도메인 지식이 필요합니다.'
        },
        {
          question: 'Z-score가 4인 데이터 포인트에 대한 해석으로 올바른 것은?',
          options: [
            '평균에서 4% 떨어져 있다',
            '상위 4%에 해당한다',
            '평균에서 4 표준편차 떨어져 있다',
            '결측값이다'
          ],
          answer: 2,
          explanation: 'Z-score 4는 평균에서 4 표준편차 떨어져 있음을 의미합니다. 정규분포 가정 시 매우 드문 값입니다.'
        },
        {
          question: '소득처럼 오른쪽으로 치우친 분포에서 이상치 처리로 적합한 방법은?',
          options: [
            '모든 이상치 삭제',
            '로그 변환 후 분석',
            '평균으로 대체',
            '무시하고 진행'
          ],
          answer: 1,
          explanation: '오른쪽 꼬리가 긴 분포(소득, 매출 등)는 로그 변환으로 정규분포에 가깝게 만들 수 있습니다.'
        }
      ]
    }
  }
]
