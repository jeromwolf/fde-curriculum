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
          answer: 1
        },
        {
          question: 'Silhouette Score 0.6의 의미는?',
          options: ['나쁜 클러스터링', '보통', '좋은 클러스터링', '최적'],
          answer: 2
        },
        {
          question: 'Elbow Method에서 찾는 것은?',
          options: ['최대 inertia', '기울기 급변점', '최소 K', '최대 K'],
          answer: 1
        }
      ]
    }
  }
]
