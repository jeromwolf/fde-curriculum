// Week 10 Day 3: 이상치 탐지 & 처리
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'p2w2d3t1',
    type: 'video',
    title: '이상치 탐지 방법',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 이상치 탐지 방법

## 이상치란?

\\\`\\\`\\\`
이상치 (Outlier):
- 다른 데이터와 현저히 다른 값
- 데이터 입력 오류일 수도 있고
- 실제로 드문 현상일 수도 있음

중요한 질문:
"이 이상치는 오류인가, 아니면 의미 있는 정보인가?"
\\\`\\\`\\\`

## 1. 통계적 방법

### IQR (Interquartile Range) 방법

\\\`\\\`\\\`python
def detect_outliers_iqr(df, column):
    """IQR 방법으로 이상치를 탐지합니다."""
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1

    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR

    outliers = df[(df[column] < lower_bound) | (df[column] > upper_bound)]

    print(f"[{column}] IQR 방법")
    print(f"  Q1: {Q1:.2f}, Q3: {Q3:.2f}, IQR: {IQR:.2f}")
    print(f"  범위: [{lower_bound:.2f}, {upper_bound:.2f}]")
    print(f"  이상치: {len(outliers)}개 ({len(outliers)/len(df)*100:.1f}%)")

    return outliers, lower_bound, upper_bound
\\\`\\\`\\\`

**특징**:
- 분포 가정 없음
- 왜곡된 분포에도 사용 가능
- 일반적으로 약 5% 정도를 이상치로 식별

### Z-Score 방법

\\\`\\\`\\\`python
from scipy import stats

def detect_outliers_zscore(df, column, threshold=3):
    """Z-score 방법으로 이상치를 탐지합니다."""
    z_scores = np.abs(stats.zscore(df[column].dropna()))

    # DataFrame 인덱스와 맞추기
    valid_idx = df[column].dropna().index
    outlier_idx = valid_idx[z_scores > threshold]
    outliers = df.loc[outlier_idx]

    print(f"[{column}] Z-score 방법 (threshold={threshold})")
    print(f"  평균: {df[column].mean():.2f}, 표준편차: {df[column].std():.2f}")
    print(f"  이상치: {len(outliers)}개 ({len(outliers)/len(df)*100:.1f}%)")

    return outliers
\\\`\\\`\\\`

**특징**:
- 정규분포 가정
- threshold=3이면 약 0.27%가 이상치
- 극단적 이상치에 민감

### Modified Z-Score (MAD 기반)

\\\`\\\`\\\`python
def detect_outliers_mad(df, column, threshold=3.5):
    """MAD (Median Absolute Deviation) 기반 방법"""
    median = df[column].median()
    mad = np.median(np.abs(df[column] - median))

    modified_z = 0.6745 * (df[column] - median) / mad

    outliers = df[np.abs(modified_z) > threshold]

    print(f"[{column}] Modified Z-score (MAD)")
    print(f"  중앙값: {median:.2f}, MAD: {mad:.2f}")
    print(f"  이상치: {len(outliers)}개")

    return outliers
\\\`\\\`\\\`

**특징**:
- 중앙값 기반으로 이상치에 더 강건
- 왜곡된 분포에 적합

## 2. 다변량 방법

### Mahalanobis Distance

\\\`\\\`\\\`python
from scipy.spatial.distance import mahalanobis

def detect_outliers_mahalanobis(df, columns, threshold=3):
    """다변량 이상치 탐지 (Mahalanobis Distance)"""
    data = df[columns].dropna()
    mean = data.mean()
    cov = data.cov()
    cov_inv = np.linalg.inv(cov)

    distances = data.apply(
        lambda row: mahalanobis(row, mean, cov_inv), axis=1
    )

    # 카이제곱 분포 기준
    from scipy.stats import chi2
    threshold_value = chi2.ppf(0.975, len(columns))

    outliers = data[distances > threshold_value]
    print(f"다변량 이상치: {len(outliers)}개")

    return outliers, distances
\\\`\\\`\\\`

**특징**:
- 변수 간 상관관계 고려
- 단일 변수에서는 정상이지만 조합이 이상한 경우 탐지

## 3. 시각화 기반 탐지

### Box Plot

\\\`\\\`\\\`python
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# 기본 박스플롯
sns.boxplot(x=df['income'], ax=axes[0])
axes[0].set_title('Box Plot')

# 여러 변수 비교
sns.boxplot(data=df[numerical_cols], ax=axes[1])
axes[1].set_title('Multiple Variables')

# 그룹별 박스플롯
sns.boxplot(x='category', y='income', data=df, ax=axes[2])
axes[2].set_title('By Category')
\\\`\\\`\\\`

### Scatter Plot (2D)

\\\`\\\`\\\`python
# 산점도로 다변량 이상치 확인
fig, ax = plt.subplots(figsize=(10, 6))
scatter = ax.scatter(df['income'], df['age'],
                     c=df['outlier_flag'], cmap='RdYlGn_r')
ax.set_xlabel('Income')
ax.set_ylabel('Age')
plt.colorbar(scatter)
plt.title('Outlier Detection (2D)')
\\\`\\\`\\\`

## 방법 비교

| 방법 | 분포 가정 | 다변량 | 이상치 민감도 |
|------|----------|--------|--------------|
| IQR | 없음 | 단변량 | 중간 |
| Z-score | 정규분포 | 단변량 | 높음 |
| MAD | 없음 | 단변량 | 낮음 (강건) |
| Mahalanobis | 다변량 정규 | 다변량 | 중간 |
`,
      objectives: [
        'IQR, Z-score, MAD 방법의 차이를 이해한다',
        '다변량 이상치 탐지 방법을 이해한다',
        '상황에 맞는 이상치 탐지 방법을 선택할 수 있다'
      ],
      keyPoints: [
        'IQR: 분포 가정 없음, 일반적 사용',
        'Z-score: 정규분포 가정, 극단적 이상치에 민감',
        'MAD: 이상치에 강건한 방법',
        'Mahalanobis: 다변량 관계 고려'
      ]
    }
  },
  {
    id: 'p2w2d3t2',
    type: 'video',
    title: '이상치 처리 전략',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 이상치 처리 전략

## 처리 전 중요한 질문

\\\`\\\`\\\`
1. 이 이상치는 오류인가, 실제 값인가?
2. 이상치가 분석 목적에 어떤 영향을 미치는가?
3. 이상치 자체가 분석 대상인가? (사기 탐지 등)
\\\`\\\`\\\`

## 1. 제거 (Removal)

### 단순 제거

\\\`\\\`\\\`python
# IQR 기반 제거
Q1, Q3 = df['income'].quantile([0.25, 0.75])
IQR = Q3 - Q1
mask = (df['income'] >= Q1 - 1.5*IQR) & (df['income'] <= Q3 + 1.5*IQR)
df_clean = df[mask]

print(f"제거 전: {len(df)}, 제거 후: {len(df_clean)}")
print(f"제거된 행: {len(df) - len(df_clean)}개")
\\\`\\\`\\\`

**언제 사용?**
- 명확한 데이터 오류 (나이: -5, 999)
- 이상치가 소수이고 분석에 영향이 클 때
- 강건한 모델이 목표가 아닐 때

### 조건부 제거

\\\`\\\`\\\`python
# 특정 조건과 결합하여 제거
# 예: 나이가 120 초과이면서 다른 정보도 이상한 경우
df_clean = df[~((df['age'] > 120) & (df['income'] > 1000000))]
\\\`\\\`\\\`

## 2. 변환 (Transformation)

### Winsorizing (경계값 대체)

\\\`\\\`\\\`python
from scipy.stats import mstats

# 상하위 5%를 경계값으로 대체
df['income_winsorized'] = mstats.winsorize(
    df['income'],
    limits=[0.05, 0.05]  # 하위 5%, 상위 5%
)
\\\`\\\`\\\`

**특징**:
- 데이터 손실 없음
- 극단값의 영향 완화
- 분포 형태 변화

### Clipping (상하한 설정)

\\\`\\\`\\\`python
# 퍼센타일 기반 클리핑
lower = df['income'].quantile(0.01)
upper = df['income'].quantile(0.99)
df['income_clipped'] = df['income'].clip(lower, upper)

# 도메인 지식 기반 클리핑
df['age_clipped'] = df['age'].clip(0, 120)
\\\`\\\`\\\`

### 로그 변환

\\\`\\\`\\\`python
# 오른쪽 꼬리가 긴 분포에 효과적
df['income_log'] = np.log1p(df['income'])  # log(1+x)

# 변환 전후 비교
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
df['income'].hist(ax=axes[0], bins=50)
axes[0].set_title('Original')
df['income_log'].hist(ax=axes[1], bins=50)
axes[1].set_title('Log Transformed')
\\\`\\\`\\\`

## 3. 대체 (Imputation)

### 경계값으로 대체

\\\`\\\`\\\`python
# 이상치를 경계값으로 대체
Q1, Q3 = df['income'].quantile([0.25, 0.75])
IQR = Q3 - Q1
lower, upper = Q1 - 1.5*IQR, Q3 + 1.5*IQR

df['income_capped'] = df['income'].apply(
    lambda x: upper if x > upper else (lower if x < lower else x)
)
\\\`\\\`\\\`

### 중앙값으로 대체

\\\`\\\`\\\`python
# 이상치를 중앙값으로 대체
median = df['income'].median()
mask = (df['income'] < lower) | (df['income'] > upper)
df.loc[mask, 'income'] = median
\\\`\\\`\\\`

## 4. 분리 (Separation)

### 별도 분석

\\\`\\\`\\\`python
# 이상치 플래그 추가
df['is_outlier'] = ((df['income'] < lower) | (df['income'] > upper)).astype(int)

# 정상 데이터와 이상치 분리
normal_data = df[df['is_outlier'] == 0]
outlier_data = df[df['is_outlier'] == 1]

# 각각 별도 모델 또는 분석
print(f"정상: {len(normal_data)}, 이상치: {len(outlier_data)}")
\\\`\\\`\\\`

## 처리 전략 선택 가이드

| 상황 | 권장 전략 |
|------|----------|
| 명확한 오류 | 제거 |
| 극단값 영향 완화 | Winsorizing/Clipping |
| 오른쪽 꼬리 분포 | 로그 변환 |
| 이상치도 정보 | 분리 후 별도 분석 |
| 모델 강건성 필요 | 로버스트 스케일링 |

## 주의사항

\\\`\\\`\\\`
1. 이상치 처리 전 원본 데이터 백업
2. 처리 방법과 근거를 문서화
3. 처리 전후 분포 비교
4. 이상치 탐지/처리는 학습 데이터에서만 (테스트 데이터 누수 방지)
\\\`\\\`\\\`
`,
      objectives: [
        '이상치 처리의 다양한 전략을 이해한다',
        '상황에 맞는 처리 방법을 선택할 수 있다',
        '처리 시 주의사항을 이해한다'
      ],
      keyPoints: [
        '제거: 명확한 오류, 데이터 손실 감수',
        '변환: 분포 조정, 정보 보존',
        '대체: 극단값을 합리적 값으로',
        '분리: 이상치도 의미 있을 때'
      ]
    }
  },
  {
    id: 'p2w2d3t3',
    type: 'code',
    title: '실습: 이상치 탐지 & 처리 파이프라인',
    duration: 45,
    content: {
      instructions: `# 이상치 탐지 & 처리 파이프라인 실습

## 목표
다양한 이상치 탐지 방법을 적용하고 적절한 처리 전략을 선택하세요.

## 요구사항

### 1. 이상치 탐지
- IQR 방법
- Z-score 방법
- 시각화 (박스플롯, 산점도)

### 2. 이상치 분석
- 탐지된 이상치 특성 분석
- 오류 vs 실제 극단값 판단

### 3. 처리 전략 적용
- 명확한 오류: 제거 또는 대체
- 극단값: Winsorizing 또는 로그 변환

### 4. 결과 검증
- 처리 전후 분포 비교
- 기술 통계량 변화 확인

## 제출물
- 완성된 Python 코드
- 처리 전후 시각화
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# 샘플 데이터 생성
np.random.seed(42)
n = 500

df = pd.DataFrame({
    'customer_id': range(1, n + 1),
    'age': np.concatenate([
        np.random.randint(20, 70, n - 10),
        [-5, 150, 200, 0, 999, -10, 180, 250, 1, 300]  # 이상치
    ]),
    'income': np.concatenate([
        np.random.normal(50000, 15000, n - 5),
        [500000, 1000000, -5000, 800000, 2000000]  # 이상치
    ]),
    'purchase_amount': np.random.exponential(200, n),  # 자연 발생 이상치
    'login_count': np.concatenate([
        np.random.poisson(10, n - 3),
        [500, 1000, 5000]  # 이상치
    ])
})

print("=== 원본 데이터 ===")
print(df.describe())

# TODO: 이상치 탐지 & 처리 파이프라인 구현

# 1. IQR 방법으로 이상치 탐지
def detect_iqr(df, column):
    """IQR 방법으로 이상치를 탐지합니다."""
    # 여기에 코드 작성
    pass

# 2. Z-score 방법으로 이상치 탐지
def detect_zscore(df, column, threshold=3):
    """Z-score 방법으로 이상치를 탐지합니다."""
    # 여기에 코드 작성
    pass

# 3. 이상치 시각화
def visualize_outliers(df, columns):
    """이상치를 시각화합니다."""
    # 여기에 코드 작성
    pass

# 4. 이상치 처리
def handle_outliers(df):
    """이상치를 처리합니다."""
    df_clean = df.copy()
    # 여기에 코드 작성
    return df_clean

# 5. 결과 검증
def validate_handling(df_original, df_clean):
    """처리 전후를 비교합니다."""
    # 여기에 코드 작성
    pass

# 실행
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from scipy.stats import mstats

# 샘플 데이터 생성
np.random.seed(42)
n = 500

df = pd.DataFrame({
    'customer_id': range(1, n + 1),
    'age': np.concatenate([
        np.random.randint(20, 70, n - 10),
        [-5, 150, 200, 0, 999, -10, 180, 250, 1, 300]
    ]),
    'income': np.concatenate([
        np.random.normal(50000, 15000, n - 5),
        [500000, 1000000, -5000, 800000, 2000000]
    ]),
    'purchase_amount': np.random.exponential(200, n),
    'login_count': np.concatenate([
        np.random.poisson(10, n - 3),
        [500, 1000, 5000]
    ])
})

print("=== 원본 데이터 ===")
print(df.describe())

# 1. IQR 방법으로 이상치 탐지
def detect_iqr(df, column):
    """IQR 방법으로 이상치를 탐지합니다."""
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR

    outliers = df[(df[column] < lower) | (df[column] > upper)]

    print(f"\\n[{column}] IQR 방법")
    print(f"  범위: [{lower:.2f}, {upper:.2f}]")
    print(f"  이상치: {len(outliers)}개 ({len(outliers)/len(df)*100:.1f}%)")

    return outliers, lower, upper

# 2. Z-score 방법으로 이상치 탐지
def detect_zscore(df, column, threshold=3):
    """Z-score 방법으로 이상치를 탐지합니다."""
    z_scores = np.abs(stats.zscore(df[column]))
    outliers = df[z_scores > threshold]

    print(f"\\n[{column}] Z-score 방법 (threshold={threshold})")
    print(f"  이상치: {len(outliers)}개 ({len(outliers)/len(df)*100:.1f}%)")

    return outliers

# 3. 이상치 시각화
def visualize_outliers(df, columns):
    """이상치를 시각화합니다."""
    print("\\n=== 이상치 시각화 ===")

    n_cols = len(columns)
    fig, axes = plt.subplots(2, n_cols, figsize=(5*n_cols, 8))

    for i, col in enumerate(columns):
        # 박스플롯
        axes[0, i].boxplot(df[col].dropna())
        axes[0, i].set_title(f'{col} - Box Plot')
        axes[0, i].set_ylabel(col)

        # 히스토그램
        axes[1, i].hist(df[col].dropna(), bins=50, edgecolor='black')
        axes[1, i].set_title(f'{col} - Histogram')
        axes[1, i].set_xlabel(col)

    plt.tight_layout()
    plt.savefig('outliers_visualization.png', dpi=100)
    print("시각화 저장 완료: outliers_visualization.png")

# 4. 이상치 처리
def handle_outliers(df):
    """이상치를 처리합니다."""
    print("\\n=== 이상치 처리 ===")
    df_clean = df.copy()

    # age: 도메인 지식 기반 처리 (0-120 범위)
    # 명확한 오류는 중앙값으로 대체
    invalid_age = (df_clean['age'] < 0) | (df_clean['age'] > 120)
    median_age = df_clean.loc[~invalid_age, 'age'].median()
    df_clean.loc[invalid_age, 'age'] = median_age
    print(f"[age] 유효하지 않은 값 {invalid_age.sum()}개를 중앙값({median_age})으로 대체")

    # income: Winsorizing (상하위 1%)
    df_clean['income'] = mstats.winsorize(df_clean['income'], limits=[0.01, 0.01])
    print("[income] Winsorizing (상하위 1%) 적용")

    # purchase_amount: 로그 변환 (오른쪽 꼬리 분포)
    df_clean['purchase_amount_log'] = np.log1p(df_clean['purchase_amount'])
    print("[purchase_amount] 로그 변환 적용 (purchase_amount_log 컬럼 추가)")

    # login_count: 상한 클리핑 (99 퍼센타일)
    upper_99 = df_clean['login_count'].quantile(0.99)
    df_clean['login_count'] = df_clean['login_count'].clip(upper=upper_99)
    print(f"[login_count] 상한 클리핑 (99 퍼센타일: {upper_99:.0f})")

    return df_clean

# 5. 결과 검증
def validate_handling(df_original, df_clean):
    """처리 전후를 비교합니다."""
    print("\\n=== 처리 전후 비교 ===")

    columns_to_compare = ['age', 'income', 'purchase_amount', 'login_count']

    for col in columns_to_compare:
        print(f"\\n[{col}]")
        print(f"  원본 - Mean: {df_original[col].mean():.2f}, Std: {df_original[col].std():.2f}")
        print(f"       - Min: {df_original[col].min():.2f}, Max: {df_original[col].max():.2f}")
        print(f"  처리 - Mean: {df_clean[col].mean():.2f}, Std: {df_clean[col].std():.2f}")
        print(f"       - Min: {df_clean[col].min():.2f}, Max: {df_clean[col].max():.2f}")

# 실행
print("\\n" + "="*50)
print("1. 이상치 탐지")
print("="*50)

columns = ['age', 'income', 'purchase_amount', 'login_count']
for col in columns:
    detect_iqr(df, col)

print("\\n" + "="*50)
print("2. 이상치 시각화")
print("="*50)
visualize_outliers(df, columns)

print("\\n" + "="*50)
print("3. 이상치 처리")
print("="*50)
df_clean = handle_outliers(df)

print("\\n" + "="*50)
print("4. 결과 검증")
print("="*50)
validate_handling(df, df_clean)

print("\\n처리 완료!")
`,
      hints: [
        'IQR = Q3 - Q1, 이상치 범위: [Q1-1.5*IQR, Q3+1.5*IQR]',
        'scipy.stats.zscore()로 Z-score를 계산합니다',
        'mstats.winsorize()로 상하위 퍼센타일을 경계값으로 대체합니다',
        'np.log1p()는 log(1+x)로 0을 포함한 값에도 적용 가능합니다'
      ]
    }
  },
  {
    id: 'p2w2d3t4',
    type: 'quiz',
    title: 'Day 3 퀴즈: 이상치 처리',
    duration: 10,
    content: {
      questions: [
        {
          question: 'IQR 방법에서 이상치로 판단하는 기준은?',
          options: ['평균 ± 2 표준편차', 'Q1 - 1.5*IQR ~ Q3 + 1.5*IQR 범위 밖', 'Z-score > 2', '상위/하위 5%'],
          answer: 1
        },
        {
          question: 'Winsorizing의 특징이 아닌 것은?',
          options: ['데이터 개수가 유지된다', '극단값을 경계값으로 대체한다', '분포 형태가 크게 변한다', '정보 손실이 적다'],
          answer: 2
        },
        {
          question: '오른쪽 꼬리가 긴 분포의 이상치 처리에 적합한 방법은?',
          options: ['Z-score 제거', '평균으로 대체', '로그 변환', 'IQR 제거'],
          answer: 2
        },
        {
          question: '다변량 이상치 탐지에 사용되는 거리 지표는?',
          options: ['유클리드 거리', '맨해튼 거리', '마할라노비스 거리', '코사인 유사도'],
          answer: 2
        },
        {
          question: 'Modified Z-score (MAD 기반)의 장점은?',
          options: ['계산이 빠르다', '이상치에 강건하다', '정규분포에 최적화되어 있다', '다변량 분석이 가능하다'],
          answer: 1
        }
      ]
    }
  }
]
