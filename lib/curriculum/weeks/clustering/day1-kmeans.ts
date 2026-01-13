// Week 14 Day 1: K-means 클러스터링
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'p2w6d1t1',
    type: 'video',
    title: 'K-means 클러스터링',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# K-means 클러스터링

## 비지도 학습이란?

타겟 변수 없이 데이터의 패턴을 찾는 방법
- 클러스터링: 유사한 데이터 그룹화
- 차원 축소: 피처 압축
- 이상탐지: 비정상 패턴 탐지

## K-means 알고리즘

\`\`\`python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# 스케일링 (필수!)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# K-means 학습
kmeans = KMeans(
    n_clusters=4,       # 클러스터 수
    random_state=42,
    n_init=10,          # 초기화 횟수
    max_iter=300        # 최대 반복
)
clusters = kmeans.fit_predict(X_scaled)

# 결과 저장
df['cluster'] = clusters

# 클러스터 중심
print(kmeans.cluster_centers_)
\`\`\`

## 최적 K 결정

### 1. Elbow Method

\`\`\`python
inertias = []
K_range = range(2, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)

plt.figure(figsize=(8, 5))
plt.plot(K_range, inertias, 'bo-')
plt.xlabel('Number of Clusters (K)')
plt.ylabel('Inertia')
plt.title('Elbow Method')
plt.show()

# Elbow: 기울기가 급격히 완만해지는 지점
\`\`\`

### 2. Silhouette Score

\`\`\`python
from sklearn.metrics import silhouette_score, silhouette_samples

silhouettes = []

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_scaled)
    score = silhouette_score(X_scaled, labels)
    silhouettes.append(score)

plt.figure(figsize=(8, 5))
plt.plot(K_range, silhouettes, 'ro-')
plt.xlabel('Number of Clusters (K)')
plt.ylabel('Silhouette Score')
plt.title('Silhouette Analysis')

# 가장 높은 점수의 K 선택
optimal_k = K_range[np.argmax(silhouettes)]
print(f"최적 K: {optimal_k}")
\`\`\`

## Silhouette Score 해석

\`\`\`
Silhouette Score 범위: -1 ~ 1

1에 가까움: 클러스터 잘 분리됨
0 근처: 클러스터 경계에 위치
음수: 잘못된 클러스터에 배정됨

일반적 기준:
> 0.5: 좋음
0.25 ~ 0.5: 보통
< 0.25: 나쁨
\`\`\`

## 클러스터 프로파일링

\`\`\`python
# 클러스터별 통계
cluster_profile = df.groupby('cluster').agg({
    'age': ['mean', 'std'],
    'income': ['mean', 'std'],
    'spending': ['mean', 'std']
}).round(2)

print(cluster_profile)

# 클러스터 크기
print(df['cluster'].value_counts())

# 시각화
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# 산점도
scatter = axes[0].scatter(X_scaled[:, 0], X_scaled[:, 1],
                          c=clusters, cmap='viridis', alpha=0.7)
axes[0].scatter(kmeans.cluster_centers_[:, 0],
                kmeans.cluster_centers_[:, 1],
                c='red', marker='X', s=200, label='Centers')
axes[0].set_title('K-means Clusters')
axes[0].legend()

# 클러스터별 평균
cluster_means = df.groupby('cluster')[['age', 'income', 'spending']].mean()
cluster_means.plot(kind='bar', ax=axes[1])
axes[1].set_title('Cluster Profiles')
plt.tight_layout()
\`\`\`
`,
      objectives: [
        'K-means 알고리즘을 이해한다',
        '최적 K를 결정할 수 있다',
        '클러스터 결과를 해석할 수 있다'
      ],
      keyPoints: [
        '스케일링 필수',
        'Elbow: inertia 기울기 변화',
        'Silhouette: 클러스터 품질 (0.5 이상 좋음)',
        '클러스터 프로파일링으로 해석'
      ]
    }
  },
  {
    id: 'p2w6d1t2',
    type: 'code',
    title: '실습: K-means 클러스터링',
    duration: 40,
    content: {
      instructions: `# K-means 실습

## 목표
고객 데이터를 클러스터링하고 최적 K를 찾으세요.

## 요구사항
1. 데이터 스케일링
2. Elbow Method로 K 후보 확인
3. Silhouette Score로 최적 K 결정
4. 클러스터 프로파일링
5. 결과 시각화
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

# 샘플 데이터
np.random.seed(42)
n = 500

df = pd.DataFrame({
    'age': np.concatenate([
        np.random.normal(25, 5, 150),
        np.random.normal(45, 8, 200),
        np.random.normal(65, 7, 150)
    ]),
    'income': np.concatenate([
        np.random.normal(30000, 8000, 150),
        np.random.normal(70000, 15000, 200),
        np.random.normal(50000, 12000, 150)
    ]),
    'spending_score': np.concatenate([
        np.random.normal(70, 15, 150),
        np.random.normal(50, 20, 200),
        np.random.normal(30, 10, 150)
    ])
})

print(f"Shape: {df.shape}")
print(df.describe())

# TODO: K-means 클러스터링
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

np.random.seed(42)
n = 500

df = pd.DataFrame({
    'age': np.concatenate([
        np.random.normal(25, 5, 150),
        np.random.normal(45, 8, 200),
        np.random.normal(65, 7, 150)
    ]),
    'income': np.concatenate([
        np.random.normal(30000, 8000, 150),
        np.random.normal(70000, 15000, 200),
        np.random.normal(50000, 12000, 150)
    ]),
    'spending_score': np.concatenate([
        np.random.normal(70, 15, 150),
        np.random.normal(50, 20, 200),
        np.random.normal(30, 10, 150)
    ])
})

# 스케일링
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df)

# Elbow & Silhouette
print("=== 최적 K 탐색 ===")
K_range = range(2, 8)
inertias = []
silhouettes = []

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_scaled)
    inertias.append(kmeans.inertia_)
    silhouettes.append(silhouette_score(X_scaled, labels))
    print(f"K={k}: Inertia={kmeans.inertia_:.0f}, Silhouette={silhouettes[-1]:.3f}")

optimal_k = K_range[np.argmax(silhouettes)]
print(f"\\n최적 K: {optimal_k} (Silhouette: {max(silhouettes):.3f})")

# 최종 클러스터링
kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
df['cluster'] = kmeans.fit_predict(X_scaled)

# 프로파일링
print("\\n=== 클러스터 프로파일 ===")
profile = df.groupby('cluster').agg({
    'age': 'mean',
    'income': 'mean',
    'spending_score': 'mean'
}).round(1)
print(profile)

print("\\n클러스터 크기:")
print(df['cluster'].value_counts().sort_index())

# 해석
print("\\n=== 클러스터 해석 ===")
for i in range(optimal_k):
    cluster_data = df[df['cluster'] == i]
    print(f"클러스터 {i}: 평균 나이 {cluster_data['age'].mean():.0f}세, "
          f"소득 \${cluster_data['income'].mean():,.0f}, "
          f"지출점수 {cluster_data['spending_score'].mean():.0f}")
`,
      hints: [
        'StandardScaler로 스케일링 필수',
        'silhouette_score(X, labels)로 품질 평가',
        'np.argmax()로 최대값 인덱스 찾기',
        'groupby().agg()로 프로파일링'
      ]
    }
  },
  {
    id: 'p2w6d1t3',
    type: 'quiz',
    title: 'Day 1 퀴즈: K-means',
    duration: 10,
    content: {
      questions: [
        {
          question: 'K-means에서 스케일링이 필요한 이유는?',
          options: ['속도 향상', '거리 계산 시 피처 영향 균등화', '과적합 방지', '결측치 처리'],
          answer: 1,
          explanation: 'K-means는 유클리드 거리를 사용하므로 스케일이 큰 피처가 과도하게 영향을 미칩니다. 스케일링으로 모든 피처의 영향을 균등하게 만들어야 합니다.'
        },
        {
          question: 'Silhouette Score 0.6의 의미는?',
          options: ['나쁜 클러스터링', '보통', '좋은 클러스터링', '최적'],
          answer: 2,
          explanation: 'Silhouette Score는 -1~1 범위로, 0.5 이상이면 좋은 클러스터링입니다. 0.6은 클러스터가 잘 분리되어 있음을 의미합니다.'
        },
        {
          question: 'Elbow Method에서 찾는 것은?',
          options: ['최대 inertia', '기울기 급변점', '최소 K', '최대 K'],
          answer: 1,
          explanation: 'Elbow Method는 K를 증가시키면서 inertia(클러스터 내 거리 합)를 그래프로 그립니다. 기울기가 급격히 완만해지는 "팔꿈치" 지점이 최적 K입니다.'
        }
      ]
    }
  },
  {
    id: 'p2w6d1t4',
    type: 'video',
    title: 'K-means 한계와 대안 알고리즘',
    duration: 18,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# K-means 한계와 대안 알고리즘

## K-means의 한계

\`\`\`
1. K를 사전에 지정해야 함
2. 구형 클러스터만 잘 찾음
3. 이상치에 민감
4. 초기값에 따라 결과 달라짐
5. 밀도가 다른 클러스터 처리 어려움
\`\`\`

## 대안 알고리즘 비교

### 1. K-means++
\`\`\`python
# K-means의 초기화 문제 개선
kmeans = KMeans(n_clusters=4, init='k-means++', n_init=10)
# init='k-means++'가 기본값 (sklearn 1.2+)
\`\`\`

### 2. Mini-Batch K-means
\`\`\`python
from sklearn.cluster import MiniBatchKMeans

# 대용량 데이터에 적합 (샘플링 사용)
mb_kmeans = MiniBatchKMeans(
    n_clusters=4,
    batch_size=100,
    random_state=42
)
# K-means보다 10배 이상 빠름, 결과는 유사
\`\`\`

### 3. DBSCAN (Day 2에서 상세)
\`\`\`python
from sklearn.cluster import DBSCAN

# K 지정 불필요, 임의 형태 클러스터
dbscan = DBSCAN(eps=0.5, min_samples=5)
# 이상치 자동 분리 (-1 라벨)
\`\`\`

### 4. Hierarchical Clustering
\`\`\`python
from sklearn.cluster import AgglomerativeClustering

# 덴드로그램으로 클러스터 구조 파악
hierarchical = AgglomerativeClustering(
    n_clusters=4,
    linkage='ward'  # 분산 최소화
)
\`\`\`

### 5. Gaussian Mixture Model (GMM)
\`\`\`python
from sklearn.mixture import GaussianMixture

# 확률적 클러스터링, 소프트 할당
gmm = GaussianMixture(
    n_components=4,
    covariance_type='full',
    random_state=42
)
gmm.fit(X_scaled)

# 각 클러스터에 속할 확률
probs = gmm.predict_proba(X_scaled)
print(probs[0])  # [0.1, 0.8, 0.05, 0.05]
\`\`\`

## 알고리즘 선택 가이드

| 상황 | 추천 알고리즘 |
|------|---------------|
| K를 모름 | DBSCAN, Hierarchical |
| 대용량 데이터 | Mini-Batch K-means |
| 임의 형태 클러스터 | DBSCAN, Spectral |
| 확률적 소속 필요 | GMM |
| 계층 구조 파악 | Hierarchical |
| 빠른 베이스라인 | K-means |
`,
      objectives: [
        'K-means의 한계를 이해한다',
        '상황에 맞는 대안 알고리즘을 선택할 수 있다'
      ],
      keyPoints: [
        'K-means: 빠르지만 K 필요, 구형만 처리',
        'DBSCAN: K 불필요, 이상치 분리',
        'GMM: 확률적 소속',
        'Mini-Batch: 대용량에 적합'
      ]
    }
  },
  {
    id: 'p2w6d1t5',
    type: 'challenge',
    title: '도전과제: 클러스터링 알고리즘 비교',
    duration: 30,
    content: {
      instructions: `# 도전과제: 클러스터링 알고리즘 비교

## 목표
같은 데이터에 여러 클러스터링 알고리즘을 적용하고 결과를 비교하세요.

## 요구사항

### 1. 3가지 알고리즘 비교
- K-means
- DBSCAN
- Gaussian Mixture Model (GMM)

### 2. 측정 지표
- Silhouette Score
- 클러스터 수
- 이상치/노이즈 비율 (DBSCAN)
- 실행 시간

### 3. 시각화
- 각 알고리즘별 클러스터링 결과 (2D PCA)
- 클러스터 크기 분포 비교

### 4. 분석 리포트
- 각 알고리즘의 장단점 정리
- 데이터 특성에 맞는 추천 알고리즘

## 평가 기준

| 항목 | 점수 |
|------|------|
| 구현 완성도 | 40점 |
| 비교 분석 | 30점 |
| 시각화 품질 | 30점 |

## 보너스
- Hierarchical Clustering 추가: +10점
- 3D 시각화: +5점
`,
      starterCode: `"""
클러스터링 알고리즘 비교 도전과제
"""

import pandas as pd
import numpy as np
import time
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, DBSCAN
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA

# 테스트 데이터 생성 (다양한 형태의 클러스터)
np.random.seed(42)
n = 500

# 3개의 다른 형태 클러스터
cluster1 = np.random.multivariate_normal([0, 0], [[1, 0], [0, 1]], 150)
cluster2 = np.random.multivariate_normal([5, 5], [[2, 0.5], [0.5, 1]], 200)
cluster3 = np.random.multivariate_normal([0, 8], [[0.5, 0], [0, 3]], 150)

X = np.vstack([cluster1, cluster2, cluster3])
true_labels = np.array([0]*150 + [1]*200 + [2]*150)

# 이상치 추가
outliers = np.random.uniform(-5, 15, (20, 2))
X = np.vstack([X, outliers])
true_labels = np.append(true_labels, [-1]*20)

print(f"데이터 Shape: {X.shape}")
print(f"실제 클러스터: 3개 + 이상치 20개")

# 스케일링
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 결과 저장
results = []

# =============================================================================
# 1. K-means
# =============================================================================
print("\\n=== 1. K-means ===")

# TODO: K-means 적용 (k=3)

# =============================================================================
# 2. DBSCAN
# =============================================================================
print("\\n=== 2. DBSCAN ===")

# TODO: DBSCAN 적용 (eps, min_samples 조정)

# =============================================================================
# 3. GMM
# =============================================================================
print("\\n=== 3. Gaussian Mixture ===")

# TODO: GMM 적용 (n_components=3)

# =============================================================================
# 4. 비교 시각화
# =============================================================================
print("\\n=== 4. 결과 비교 ===")

# TODO: PCA 2D 시각화, 결과 테이블 출력
`,
      hints: [
        'DBSCAN: eps=0.5, min_samples=5로 시작',
        'GMM: n_components=3, covariance_type="full"',
        'DBSCAN 노이즈는 label=-1로 표시됨',
        'time.time()으로 실행 시간 측정'
      ]
    }
  }
]
