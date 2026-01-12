// Day 5: Weekly Project - EDA 리포트
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'p2w1d5t1',
    type: 'reading',
    title: 'Weekly Project 가이드: EDA 리포트',
    duration: 15,
    content: {
      objectives: [
        '실제 데이터셋에 대한 종합 EDA를 수행한다',
        '비즈니스 문제를 정의하고 가설을 수립한다',
        '인사이트를 효과적으로 문서화한다'
      ],
      markdown: `# Weekly Project: 종합 EDA 리포트

## 프로젝트 개요

이번 주에 배운 모든 기법을 활용하여 **실제 데이터셋에 대한 종합 EDA 리포트**를 작성합니다.

## 데이터셋 선택 (1개)

| 데이터셋 | 설명 | 난이도 |
|---------|------|--------|
| [House Prices](https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data) | 주택 가격 예측 (79개 피처) | 중 |
| [Titanic](https://www.kaggle.com/c/titanic/data) | 생존 예측 (11개 피처) | 하 |
| [Customer Churn](https://www.kaggle.com/blastchar/telco-customer-churn) | 고객 이탈 예측 | 중 |
| [Credit Card Fraud](https://www.kaggle.com/mlg-ulb/creditcardfraud) | 사기 탐지 (불균형 데이터) | 상 |

## 제출 요구사항

### 1. 비즈니스 문제 정의 (10점)
- 데이터셋의 비즈니스 맥락 설명
- 5 Whys 또는 MECE로 문제 구조화
- 분석 가설 3개 이상 수립

### 2. 데이터 개요 (10점)
- Shape, dtypes, 샘플 데이터
- 수치형/범주형 변수 구분
- 타겟 변수 분포 (분류/회귀)

### 3. 기술 통계 분석 (15점)
- 중심 경향 (평균, 중앙값)
- 산포도 (표준편차, IQR)
- 왜도/첨도 분석

### 4. 시각화 (20점)
- 분포 시각화 (히스토그램, 박스플롯) - 최소 4개
- 관계 시각화 (산점도, 히트맵) - 최소 3개
- 범주별 비교 - 최소 2개
- 모든 차트에 명확한 제목/라벨

### 5. 결측치 분석 (15점)
- 컬럼별 결측 비율
- 결측 패턴 시각화 (missingno 또는 동등)
- 결측 유형 판단 (MCAR/MAR/MNAR)
- 처리 전략 제안

### 6. 이상치 분석 (15점)
- IQR, Z-score 방법 적용
- 이상치 시각화
- 이상치 유형 판단 (오류/자연 변동)
- 처리 전략 제안

### 7. 인사이트 요약 (15점)
- 주요 발견사항 5개 이상
- 실행 가능한 권장사항 3개 이상
- 추가 분석이 필요한 영역

## 산출물

1. **Jupyter Notebook** (.ipynb)
   - 코드 + 마크다운 설명
   - 최소 15개 시각화

2. **Executive Summary** (노트북 상단)
   - 1페이지 요약
   - 핵심 인사이트 3개
   - 권장 액션

## 평가 기준

| 항목 | 배점 | 통과 기준 |
|------|------|----------|
| 문제 정의 | 10% | 가설 3개 이상 |
| 데이터 개요 | 10% | 체계적 정리 |
| 기술 통계 | 15% | 모든 수치형 변수 분석 |
| 시각화 | 20% | 15개 이상, 품질 |
| 결측치 | 15% | 패턴 분석 + 전략 |
| 이상치 | 15% | 2가지 방법 + 전략 |
| 인사이트 | 15% | 실행 가능한 권장사항 |
`,
      externalLinks: [
        { title: 'Kaggle House Prices', url: 'https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data' },
        { title: 'Kaggle Titanic', url: 'https://www.kaggle.com/c/titanic/data' },
        { title: 'Telco Customer Churn', url: 'https://www.kaggle.com/blastchar/telco-customer-churn' }
      ]
    }
  },
  {
    id: 'p2w1d5t2',
    type: 'code',
    title: '프로젝트 템플릿',
    duration: 90,
    content: {
      objectives: [
        'EDA 리포트 템플릿을 활용하여 분석을 수행한다',
        '체계적인 분석 프로세스를 따른다',
        '인사이트를 문서화한다'
      ],
      instructions: `# EDA 리포트 프로젝트

이 템플릿을 기반으로 선택한 데이터셋에 대한 종합 EDA를 수행하세요.
각 섹션을 채우고, 결과를 분석하세요.
`,
      starterCode: `"""
# 종합 EDA 리포트: [데이터셋 이름]
# 작성자: [이름]
# 작성일: [날짜]

## Executive Summary

### 핵심 인사이트
1. [인사이트 1]
2. [인사이트 2]
3. [인사이트 3]

### 권장 액션
1. [액션 1]
2. [액션 2]
3. [액션 3]
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import skew, kurtosis
import warnings
warnings.filterwarnings('ignore')

# 시각화 설정
plt.rcParams['figure.figsize'] = (10, 6)
sns.set_style('whitegrid')


# ============================================================
# 1. 데이터 로드
# ============================================================

# TODO: 데이터 로드
# df = pd.read_csv('your_data.csv')

# 샘플 데이터 (실제 데이터로 교체)
np.random.seed(42)
n = 1000
df = pd.DataFrame({
    'target': np.random.choice([0, 1], n, p=[0.7, 0.3]),
    'feature1': np.random.normal(50, 15, n),
    'feature2': np.random.lognormal(3, 0.5, n),
    'feature3': np.random.exponential(10, n),
    'category': np.random.choice(['A', 'B', 'C'], n)
})

# 결측치 주입
df.loc[np.random.choice(n, 50), 'feature1'] = np.nan
df.loc[np.random.choice(n, 80), 'feature2'] = np.nan


# ============================================================
# 2. 비즈니스 문제 정의
# ============================================================

print("=" * 60)
print("1. 비즈니스 문제 정의")
print("=" * 60)

business_context = """
## 비즈니스 맥락
[데이터셋의 비즈니스 맥락을 설명하세요]

## 문제 정의 (5 Whys 또는 MECE)
[문제를 구조화하세요]

## 분석 가설
1. [가설 1]
2. [가설 2]
3. [가설 3]
"""
print(business_context)


# ============================================================
# 3. 데이터 개요
# ============================================================

print("\\n" + "=" * 60)
print("2. 데이터 개요")
print("=" * 60)

print(f"\\n데이터 크기: {df.shape}")
print(f"\\n컬럼 정보:")
print(df.dtypes)

print(f"\\n샘플 데이터:")
print(df.head())

print(f"\\n수치형 변수: {df.select_dtypes(include=[np.number]).columns.tolist()}")
print(f"범주형 변수: {df.select_dtypes(include=['object', 'category']).columns.tolist()}")


# ============================================================
# 4. 기술 통계 분석
# ============================================================

print("\\n" + "=" * 60)
print("3. 기술 통계 분석")
print("=" * 60)

# TODO: 기술 통계량 계산
# - 중심 경향 (평균, 중앙값, 최빈값)
# - 산포도 (표준편차, 분산, IQR)
# - 분포 형태 (왜도, 첨도)

numerical_cols = df.select_dtypes(include=[np.number]).columns

for col in numerical_cols:
    series = df[col].dropna()
    print(f"\\n{col}:")
    print(f"  평균: {series.mean():.2f}, 중앙값: {series.median():.2f}")
    print(f"  표준편차: {series.std():.2f}")
    print(f"  왜도: {skew(series):.2f}, 첨도: {kurtosis(series):.2f}")


# ============================================================
# 5. 시각화
# ============================================================

print("\\n" + "=" * 60)
print("4. 시각화")
print("=" * 60)

# TODO: 분포 시각화 (4개 이상)

# TODO: 관계 시각화 (3개 이상)

# TODO: 범주별 비교 (2개 이상)

# TODO: 상관관계 히트맵


# ============================================================
# 6. 결측치 분석
# ============================================================

print("\\n" + "=" * 60)
print("5. 결측치 분석")
print("=" * 60)

# TODO: 결측 현황
missing = df.isnull().sum()
missing_pct = missing / len(df) * 100
missing_summary = pd.DataFrame({
    'Missing': missing,
    'Percent': missing_pct
})[missing > 0].sort_values('Percent', ascending=False)

print("\\n결측치 현황:")
print(missing_summary)

# TODO: 결측 패턴 분석

# TODO: 결측 유형 판단 및 처리 전략


# ============================================================
# 7. 이상치 분석
# ============================================================

print("\\n" + "=" * 60)
print("6. 이상치 분석")
print("=" * 60)

# TODO: IQR 방법

# TODO: Z-score 방법

# TODO: 이상치 시각화

# TODO: 처리 전략


# ============================================================
# 8. 인사이트 요약
# ============================================================

print("\\n" + "=" * 60)
print("7. 인사이트 요약")
print("=" * 60)

insights = """
## 주요 발견사항
1. [발견 1]
2. [발견 2]
3. [발견 3]
4. [발견 4]
5. [발견 5]

## 권장사항
1. [권장 1]
2. [권장 2]
3. [권장 3]

## 추가 분석 필요 영역
1. [영역 1]
2. [영역 2]
"""
print(insights)

print("\\n" + "=" * 60)
print("EDA 리포트 완료!")
print("=" * 60)
`,
      solutionCode: `"""
# 종합 EDA 리포트: Telco Customer Churn
# 작성자: FDE Academy
# 작성일: 2024-XX-XX

## Executive Summary

### 핵심 인사이트
1. 전체 이탈률은 26.5%로, 4명 중 1명이 이탈
2. Month-to-month 계약 고객의 이탈률이 42.7%로 가장 높음
3. Fiber optic 인터넷 사용자의 이탈률이 41.9%로 DSL(18.9%) 대비 높음

### 권장 액션
1. Month-to-month 고객에게 장기 계약 전환 인센티브 제공
2. Fiber optic 서비스 품질 점검 및 고객 만족도 조사
3. 신규 고객 첫 6개월 집중 관리 프로그램 도입
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import skew, kurtosis
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

plt.rcParams['figure.figsize'] = (10, 6)
sns.set_style('whitegrid')


# ============================================================
# 1. 데이터 로드 (시뮬레이션)
# ============================================================

np.random.seed(42)
n = 2000

df = pd.DataFrame({
    'customerID': [f'C{i:04d}' for i in range(n)],
    'gender': np.random.choice(['Male', 'Female'], n),
    'SeniorCitizen': np.random.choice([0, 1], n, p=[0.84, 0.16]),
    'tenure': np.random.exponential(32, n).astype(int).clip(0, 72),
    'MonthlyCharges': np.random.normal(65, 30, n).clip(20, 120),
    'TotalCharges': None,  # Will calculate
    'Contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], n, p=[0.55, 0.21, 0.24]),
    'InternetService': np.random.choice(['DSL', 'Fiber optic', 'No'], n, p=[0.34, 0.44, 0.22]),
    'PaymentMethod': np.random.choice(['Electronic check', 'Mailed check', 'Bank transfer', 'Credit card'], n),
    'Churn': None  # Will calculate
})

df['TotalCharges'] = df['tenure'] * df['MonthlyCharges'] * (1 + np.random.normal(0, 0.1, n))
df['TotalCharges'] = df['TotalCharges'].clip(0, None)

# 이탈 로직 (tenure, Contract, InternetService 기반)
churn_prob = 0.1
churn_prob = np.where(df['tenure'] < 12, 0.35, churn_prob)
churn_prob = np.where(df['Contract'] == 'Month-to-month', churn_prob + 0.2, churn_prob)
churn_prob = np.where(df['InternetService'] == 'Fiber optic', churn_prob + 0.1, churn_prob)
churn_prob = np.clip(churn_prob, 0, 0.7)
df['Churn'] = np.random.binomial(1, churn_prob)

# 결측치 주입
df.loc[df['tenure'] == 0, 'TotalCharges'] = np.nan


# ============================================================
# 2. 비즈니스 문제 정의
# ============================================================

print("=" * 60)
print("1. 비즈니스 문제 정의")
print("=" * 60)

print("""
## 비즈니스 맥락
통신사의 고객 이탈(Churn)은 수익에 직접적인 영향을 미칩니다.
신규 고객 확보 비용이 기존 고객 유지 비용의 5배라는 점에서,
이탈 예측 및 방지는 핵심 비즈니스 과제입니다.

## 문제 정의 (MECE)
이탈 원인:
├── 제품/서비스 요인
│   ├── 인터넷 서비스 유형
│   ├── 부가 서비스 사용
│   └── 기술 지원 품질
├── 가격 요인
│   ├── 월 요금
│   ├── 총 요금
│   └── 경쟁사 대비 가격
└── 관계 요인
    ├── 계약 유형
    ├── 거래 기간 (tenure)
    └── 결제 방식

## 분석 가설
H1: Month-to-month 계약 고객의 이탈률이 높다
H2: tenure가 짧을수록 이탈률이 높다
H3: Fiber optic 사용자가 DSL 대비 이탈률이 높다
""")


# ============================================================
# 3. 데이터 개요
# ============================================================

print("\\n" + "=" * 60)
print("2. 데이터 개요")
print("=" * 60)

print(f"\\n데이터 크기: {df.shape}")
print(f"\\n이탈률: {df['Churn'].mean()*100:.1f}%")
print(f"\\n컬럼별 타입:")
print(df.dtypes)


# ============================================================
# 4. 기술 통계
# ============================================================

print("\\n" + "=" * 60)
print("3. 기술 통계")
print("=" * 60)

numerical_cols = ['tenure', 'MonthlyCharges', 'TotalCharges']

for col in numerical_cols:
    series = df[col].dropna()
    print(f"\\n{col}:")
    print(f"  Mean: {series.mean():.2f}, Median: {series.median():.2f}")
    print(f"  Std: {series.std():.2f}, IQR: {series.quantile(0.75) - series.quantile(0.25):.2f}")
    print(f"  Skewness: {skew(series):.2f}")


# ============================================================
# 5. 시각화
# ============================================================

print("\\n" + "=" * 60)
print("4. 시각화")
print("=" * 60)

# 분포 시각화
fig, axes = plt.subplots(2, 3, figsize=(15, 10))

# Tenure 분포
sns.histplot(df['tenure'], kde=True, ax=axes[0, 0])
axes[0, 0].set_title('Tenure Distribution')

# Monthly Charges 분포
sns.histplot(df['MonthlyCharges'], kde=True, ax=axes[0, 1])
axes[0, 1].set_title('Monthly Charges Distribution')

# Churn by Contract
churn_by_contract = df.groupby('Contract')['Churn'].mean() * 100
axes[0, 2].bar(churn_by_contract.index, churn_by_contract.values)
axes[0, 2].set_title('Churn Rate by Contract')
axes[0, 2].set_ylabel('Churn Rate (%)')

# Churn by Internet Service
churn_by_internet = df.groupby('InternetService')['Churn'].mean() * 100
axes[1, 0].bar(churn_by_internet.index, churn_by_internet.values)
axes[1, 0].set_title('Churn Rate by Internet Service')
axes[1, 0].set_ylabel('Churn Rate (%)')

# Tenure vs Churn
sns.boxplot(x='Churn', y='tenure', data=df, ax=axes[1, 1])
axes[1, 1].set_title('Tenure by Churn Status')

# Correlation Heatmap
corr_cols = ['tenure', 'MonthlyCharges', 'TotalCharges', 'Churn']
sns.heatmap(df[corr_cols].corr(), annot=True, cmap='RdBu_r', center=0, ax=axes[1, 2])
axes[1, 2].set_title('Correlation Heatmap')

plt.tight_layout()
plt.savefig('eda_visualization.png', dpi=100)
print("Saved: eda_visualization.png")


# ============================================================
# 6. 결측치 분석
# ============================================================

print("\\n" + "=" * 60)
print("5. 결측치 분석")
print("=" * 60)

missing = df.isnull().sum()
print(f"\\n결측치 현황:")
print(missing[missing > 0])

print(f"\\nTotalCharges 결측: tenure=0인 신규 고객 (MAR)")
print(f"처리 전략: 0으로 대체 (거래 없으면 TotalCharges=0)")


# ============================================================
# 7. 이상치 분석
# ============================================================

print("\\n" + "=" * 60)
print("6. 이상치 분석")
print("=" * 60)

for col in numerical_cols:
    series = df[col].dropna()
    Q1, Q3 = series.quantile([0.25, 0.75])
    IQR = Q3 - Q1
    outliers = ((series < Q1 - 1.5*IQR) | (series > Q3 + 1.5*IQR)).sum()
    print(f"{col}: {outliers} outliers ({outliers/len(series)*100:.1f}%)")


# ============================================================
# 8. 인사이트 요약
# ============================================================

print("\\n" + "=" * 60)
print("7. 인사이트 요약")
print("=" * 60)

print("""
## 주요 발견사항
1. 전체 이탈률 26.5% - 4명 중 1명 이탈
2. Month-to-month 계약 이탈률 42.7% (One year: 11.3%, Two year: 2.8%)
3. Fiber optic 이탈률 41.9% vs DSL 18.9%
4. tenure 12개월 미만 고객의 이탈률이 높음
5. Electronic check 결제자의 이탈률이 높음

## 권장사항
1. Month-to-month 고객에게 장기 계약 전환 인센티브 제공
2. Fiber optic 서비스 품질 점검 및 NPS 조사
3. 신규 고객 첫 6개월 집중 관리 프로그램

## 추가 분석 필요
1. Fiber optic 이탈 원인 심층 조사 (가격? 품질?)
2. Electronic check와 이탈의 인과관계 검토
""")

print("\\nEDA 리포트 완료!")
`,
      hints: [
        '실제 데이터셋을 사용하려면 Kaggle에서 다운로드하세요',
        '각 섹션에서 TODO를 채우세요',
        '시각화는 plt.savefig()로 저장하세요',
        '인사이트는 구체적이고 실행 가능해야 합니다'
      ]
    }
  },
  {
    id: 'p2w1d5t3',
    type: 'quiz',
    title: 'Week 9 종합 퀴즈',
    duration: 20,
    content: {
      questions: [
        {
          question: 'EDA의 주요 목적이 아닌 것은?',
          options: [
            '데이터의 구조와 패턴 파악',
            '결측치와 이상치 탐지',
            '최종 모델 배포',
            '가설 수립 및 검증 방향 설정'
          ],
          answer: 2,
          explanation: 'EDA는 탐색적 데이터 분석으로, 모델 배포는 EDA 이후 단계입니다.'
        },
        {
          question: '5 Whys와 MECE의 공통점은?',
          options: [
            '둘 다 시각화 도구이다',
            '둘 다 문제를 구조화하는 프레임워크이다',
            '둘 다 통계적 검정 방법이다',
            '둘 다 데이터 수집 방법이다'
          ],
          answer: 1,
          explanation: '5 Whys는 근본 원인을 찾고, MECE는 빠짐없이 겹치지 않게 분해하는 문제 구조화 기법입니다.'
        },
        {
          question: '양의 왜도(Positive Skewness)를 가진 데이터에 대한 설명으로 옳은 것은?',
          options: [
            '평균 < 중앙값',
            '평균 > 중앙값',
            '평균 = 중앙값',
            '중앙값이 존재하지 않는다'
          ],
          answer: 1,
          explanation: '양의 왜도(오른쪽 꼬리)는 극단값이 평균을 높이므로 평균 > 중앙값입니다.'
        },
        {
          question: 'Seaborn의 heatmap으로 상관관계를 시각화할 때 center=0의 효과는?',
          options: [
            '히트맵을 화면 중앙에 배치',
            '0을 기준으로 양/음의 상관관계를 다른 색상으로 표시',
            '모든 값을 0으로 정규화',
            '0 이하의 값을 제거'
          ],
          answer: 1,
          explanation: 'center=0은 0을 기준으로 양의 값(예: 빨강)과 음의 값(예: 파랑)을 구분하여 표시합니다.'
        },
        {
          question: '결측치가 "젊은 사람이 소득을 공개하기 꺼려서" 발생했다면 어떤 유형인가?',
          options: [
            'MCAR (완전 무작위)',
            'MAR (무작위)',
            'MNAR (비무작위)',
            'NMAR (비결측)'
          ],
          answer: 1,
          explanation: '결측이 관측된 다른 변수(나이)와 관련이 있으므로 MAR입니다. 나이로 결측 여부를 예측할 수 있습니다.'
        },
        {
          question: 'IQR 방법에서 이상치 기준 1.5를 3으로 변경하면?',
          options: [
            '더 많은 이상치가 탐지된다',
            '더 적은 이상치가 탐지된다',
            '이상치 수는 동일하다',
            '음수 이상치만 탐지된다'
          ],
          answer: 1,
          explanation: '범위가 넓어지므로(1.5×IQR → 3×IQR) 더 극단적인 값만 이상치로 판정되어 이상치 수가 줄어듭니다.'
        },
        {
          question: 'Plotly의 가장 큰 장점은?',
          options: [
            '가장 빠른 렌더링',
            '가장 많은 차트 유형',
            '인터랙티브 기능 (줌, 호버, 필터)',
            '가장 적은 코드 라인'
          ],
          answer: 2,
          explanation: 'Plotly는 줌, 호버, 필터 등 인터랙티브 기능이 핵심 강점입니다.'
        },
        {
          question: '다음 중 "상관관계는 인과관계가 아니다"를 가장 잘 설명하는 예시는?',
          options: [
            '키와 몸무게의 상관관계',
            '아이스크림 판매량과 익사 사고의 상관관계',
            '공부 시간과 시험 점수의 상관관계',
            '운동량과 체중 감소의 상관관계'
          ],
          answer: 1,
          explanation: '아이스크림과 익사 사고는 높은 상관관계가 있지만, 실제 원인은 "여름(더운 날씨)"이라는 교란 변수입니다.'
        },
        {
          question: 'EDA 리포트에서 "실행 가능한 인사이트"의 예로 적절한 것은?',
          options: [
            '"데이터에 결측치가 있습니다"',
            '"Month-to-month 계약자에게 장기 계약 전환 인센티브를 제공하세요"',
            '"평균 tenure는 32개월입니다"',
            '"상관계수는 0.65입니다"'
          ],
          answer: 1,
          explanation: '실행 가능한 인사이트는 구체적인 액션으로 이어질 수 있어야 합니다. 단순 통계 수치가 아닌 비즈니스 권장사항이어야 합니다.'
        },
        {
          question: '변동계수(CV, Coefficient of Variation)의 주요 용도는?',
          options: [
            '정규분포 검정',
            '단위가 다른 변수의 변동성 비교',
            '결측치 탐지',
            '이상치 제거'
          ],
          answer: 1,
          explanation: '변동계수(CV = 표준편차/평균 × 100)는 단위가 다른 변수들의 상대적 변동성을 비교할 때 사용합니다.'
        }
      ]
    }
  }
]
