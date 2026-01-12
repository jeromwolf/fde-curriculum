// Week 15 Day 1: 통계적 이상탐지
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'p2w7d1t1',
    type: 'video',
    title: '이상탐지 개요',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 이상탐지 (Anomaly Detection)

## 이상탐지란?

정상 패턴에서 벗어난 데이터 포인트 탐지
- 사기 거래 탐지
- 설비 이상 감지
- 네트워크 침입 탐지
- 품질 관리

## 이상치 유형

\`\`\`
1. Point Anomaly (점 이상)
   - 개별 데이터가 정상 범위 벗어남
   - 예: 1일 소비 $10,000 (평소 $100)

2. Contextual Anomaly (문맥 이상)
   - 특정 맥락에서만 이상
   - 예: 여름에 난방비 급등

3. Collective Anomaly (집단 이상)
   - 개별은 정상이나 집합적으로 이상
   - 예: 동일 IP에서 1분간 100번 로그인 시도
\`\`\`

## 접근 방법

| 방법 | 특징 | 사용 시점 |
|------|------|----------|
| 통계적 | 단순, 해석 가능 | 저차원, 분포 알 때 |
| 거리/밀도 | 다차원 지원 | 클러스터 형태 데이터 |
| ML 기반 | 복잡한 패턴 | 대용량, 고차원 |
| 딥러닝 | 비선형 패턴 | 시퀀스, 이미지 |
`,
      objectives: [
        '이상탐지의 개념을 이해한다',
        '이상치 유형을 구분할 수 있다',
        '적절한 방법을 선택할 수 있다'
      ],
      keyPoints: [
        'Point, Contextual, Collective Anomaly',
        '통계적 방법이 가장 기본',
        '비즈니스 맥락 중요',
        'Precision-Recall 트레이드오프'
      ]
    }
  },
  {
    id: 'p2w7d1t2',
    type: 'video',
    title: '통계적 이상탐지',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 통계적 이상탐지

## 1. Z-score 방법

표준 정규분포 가정, |Z| > 3이면 이상

\`\`\`python
from scipy import stats
import numpy as np

# Z-score 계산
z_scores = stats.zscore(df['value'])

# 이상치 탐지 (|Z| > 3)
outliers = df[np.abs(z_scores) > 3]

print(f"이상치 수: {len(outliers)}")
print(f"이상치 비율: {len(outliers)/len(df)*100:.2f}%")

# 다변량 데이터
z_scores_all = np.abs(stats.zscore(df[numerical_cols]))
outliers = df[(z_scores_all > 3).any(axis=1)]
\`\`\`

## 2. IQR 방법

분포 가정 없이 사분위수 기반

\`\`\`python
# IQR 계산
Q1 = df['value'].quantile(0.25)
Q3 = df['value'].quantile(0.75)
IQR = Q3 - Q1

# 경계값
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR

# 이상치 탐지
outliers = df[(df['value'] < lower) | (df['value'] > upper)]

# 시각화
import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(10, 6))
ax.boxplot(df['value'])
ax.axhline(upper, color='r', linestyle='--', label=f'Upper: {upper:.2f}')
ax.axhline(lower, color='r', linestyle='--', label=f'Lower: {lower:.2f}')
ax.legend()
plt.show()
\`\`\`

## 3. Mahalanobis 거리

다변량 데이터의 중심으로부터 거리

\`\`\`python
from scipy.spatial.distance import mahalanobis
import numpy as np

# 데이터 준비
X = df[numerical_cols].values
mean = np.mean(X, axis=0)
cov = np.cov(X.T)
cov_inv = np.linalg.inv(cov)

# Mahalanobis 거리 계산
df['mahalanobis'] = df[numerical_cols].apply(
    lambda x: mahalanobis(x, mean, cov_inv), axis=1
)

# 카이제곱 분포로 임계값 (p=0.001)
from scipy.stats import chi2
threshold = chi2.ppf(0.999, df=len(numerical_cols))
outliers = df[df['mahalanobis'] > np.sqrt(threshold)]

print(f"임계값: {np.sqrt(threshold):.2f}")
print(f"이상치: {len(outliers)}")
\`\`\`

## 방법 비교

| 방법 | 장점 | 단점 |
|------|------|------|
| Z-score | 단순, 빠름 | 정규분포 가정 |
| IQR | 분포 무관 | 단변량만 |
| Mahalanobis | 다변량, 상관 고려 | 역행렬 계산 |
`,
      objectives: [
        'Z-score 방법을 적용할 수 있다',
        'IQR 방법을 적용할 수 있다',
        'Mahalanobis 거리를 계산할 수 있다'
      ],
      keyPoints: [
        'Z-score: |Z| > 3 (정규분포 가정)',
        'IQR: Q1-1.5*IQR ~ Q3+1.5*IQR',
        'Mahalanobis: 다변량, 상관관계 고려',
        '데이터 특성에 맞는 방법 선택'
      ]
    }
  },
  {
    id: 'p2w7d1t3',
    type: 'code',
    title: '실습: 통계적 이상탐지',
    duration: 40,
    content: {
      instructions: `# 통계적 이상탐지 실습

## 목표
Z-score, IQR, Mahalanobis 거리로 이상치를 탐지하세요.

## 요구사항
1. Z-score 방법 적용
2. IQR 방법 적용
3. Mahalanobis 거리 적용
4. 세 방법 결과 비교
5. 시각화
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
from scipy.spatial.distance import mahalanobis

np.random.seed(42)

# 정상 데이터 생성
n_normal = 500
normal_data = np.random.multivariate_normal(
    mean=[50, 100],
    cov=[[100, 50], [50, 200]],
    size=n_normal
)

# 이상치 추가
n_outliers = 20
outliers = np.random.uniform(low=[90, 200], high=[120, 300], size=(n_outliers, 2))

# 합치기
all_data = np.vstack([normal_data, outliers])
df = pd.DataFrame(all_data, columns=['feature1', 'feature2'])
df['true_label'] = ['normal'] * n_normal + ['outlier'] * n_outliers

print(f"전체 데이터: {len(df)}")
print(f"실제 이상치: {n_outliers}")

# TODO: 통계적 이상탐지
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
from scipy.spatial.distance import mahalanobis
from scipy.stats import chi2

np.random.seed(42)

n_normal = 500
normal_data = np.random.multivariate_normal(
    mean=[50, 100],
    cov=[[100, 50], [50, 200]],
    size=n_normal
)

n_outliers = 20
outliers = np.random.uniform(low=[90, 200], high=[120, 300], size=(n_outliers, 2))

all_data = np.vstack([normal_data, outliers])
df = pd.DataFrame(all_data, columns=['feature1', 'feature2'])
df['true_label'] = ['normal'] * n_normal + ['outlier'] * n_outliers

print("=== 1. Z-score 방법 ===")
z1 = np.abs(stats.zscore(df['feature1']))
z2 = np.abs(stats.zscore(df['feature2']))
df['zscore_outlier'] = ((z1 > 3) | (z2 > 3)).astype(int)
print(f"Z-score 이상치: {df['zscore_outlier'].sum()}")

print("\\n=== 2. IQR 방법 ===")
def iqr_outlier(series):
    Q1, Q3 = series.quantile([0.25, 0.75])
    IQR = Q3 - Q1
    return (series < Q1 - 1.5*IQR) | (series > Q3 + 1.5*IQR)

df['iqr_outlier'] = (iqr_outlier(df['feature1']) | iqr_outlier(df['feature2'])).astype(int)
print(f"IQR 이상치: {df['iqr_outlier'].sum()}")

print("\\n=== 3. Mahalanobis 거리 ===")
X = df[['feature1', 'feature2']].values
mean = np.mean(X, axis=0)
cov = np.cov(X.T)
cov_inv = np.linalg.inv(cov)

df['mahal_dist'] = [mahalanobis(x, mean, cov_inv) for x in X]
threshold = np.sqrt(chi2.ppf(0.99, df=2))
df['mahal_outlier'] = (df['mahal_dist'] > threshold).astype(int)
print(f"Mahalanobis 이상치: {df['mahal_outlier'].sum()}")
print(f"임계값: {threshold:.2f}")

print("\\n=== 4. 방법 비교 ===")
true_outliers = df['true_label'] == 'outlier'
methods = ['zscore_outlier', 'iqr_outlier', 'mahal_outlier']

for method in methods:
    detected = df[method] == 1
    tp = (detected & true_outliers).sum()
    fp = (detected & ~true_outliers).sum()
    fn = (~detected & true_outliers).sum()

    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0

    print(f"{method}: Precision={precision:.2f}, Recall={recall:.2f}")

print("\\n=== 5. 시각화 ===")
print("실제 이상치 20개 중:")
for method in methods:
    overlap = (df[method] == 1) & (df['true_label'] == 'outlier')
    print(f"  {method}: {overlap.sum()}개 탐지")
`,
      hints: [
        'stats.zscore()로 Z-score 계산',
        'quantile([0.25, 0.75])로 사분위수',
        'np.linalg.inv()로 역행렬',
        'chi2.ppf(0.99, df=2)로 임계값'
      ]
    }
  },
  {
    id: 'p2w7d1t4',
    type: 'quiz',
    title: 'Day 1 퀴즈: 통계적 이상탐지',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Z-score 방법의 가정은?',
          options: ['균등분포', '정규분포', '지수분포', '가정 없음'],
          answer: 1
        },
        {
          question: 'IQR 방법의 상한 경계값은?',
          options: ['Q3 + IQR', 'Q3 + 1.5*IQR', 'Q3 + 2*IQR', 'Q3 + 3*IQR'],
          answer: 1
        },
        {
          question: 'Mahalanobis 거리의 장점은?',
          options: ['계산 빠름', '단변량 전용', '변수 간 상관관계 고려', '정규분포 불필요'],
          answer: 2
        }
      ]
    }
  }
]
