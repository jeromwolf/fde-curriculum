// Week 14 Day 4: 클러스터 프로파일링 & 시각화
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'p2w6d4t1',
    type: 'video',
    title: '클러스터 프로파일링',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 클러스터 프로파일링

## 프로파일링이란?

클러스터의 특성을 분석하여 비즈니스 의미 부여

\`\`\`python
import pandas as pd
import numpy as np

# 클러스터별 기술 통계
profile = df.groupby('cluster').agg({
    'age': ['mean', 'std', 'min', 'max'],
    'income': ['mean', 'std'],
    'spending': ['mean', 'std'],
    'tenure': ['mean', 'std']
}).round(2)

print(profile)
\`\`\`

## 클러스터 중심 분석

\`\`\`python
# K-means 클러스터 중심
centers = pd.DataFrame(
    kmeans.cluster_centers_,
    columns=feature_names
)

# 원본 스케일로 역변환
centers_original = scaler.inverse_transform(centers)
centers_df = pd.DataFrame(centers_original, columns=feature_names)

print("=== 클러스터 중심 (원본 스케일) ===")
print(centers_df)
\`\`\`

## 클러스터 크기 및 비율

\`\`\`python
# 클러스터 크기
cluster_sizes = df['cluster'].value_counts().sort_index()
cluster_pct = (cluster_sizes / len(df) * 100).round(1)

print("=== 클러스터 분포 ===")
for c in cluster_sizes.index:
    print(f"클러스터 {c}: {cluster_sizes[c]:,}명 ({cluster_pct[c]}%)")
\`\`\`

## 피처별 클러스터 비교

\`\`\`python
# 히트맵용 정규화
cluster_means = df.groupby('cluster')[feature_names].mean()

# Z-score 정규화 (클러스터 간 비교 용이)
cluster_z = (cluster_means - cluster_means.mean()) / cluster_means.std()

import seaborn as sns
import matplotlib.pyplot as plt

plt.figure(figsize=(10, 6))
sns.heatmap(cluster_z, annot=True, cmap='RdYlGn', center=0,
            fmt='.2f', linewidths=0.5)
plt.title('Cluster Profile Heatmap (Z-scores)')
plt.xlabel('Features')
plt.ylabel('Cluster')
plt.show()
\`\`\`

## 클러스터 네이밍

\`\`\`python
# 분석 결과 기반 네이밍
cluster_names = {
    0: 'Young Budget',      # 젊은, 저소득, 저지출
    1: 'Middle Mainstream', # 중년, 중간 소득/지출
    2: 'Premium VIP',       # 고연령, 고소득, 고지출
    3: 'Young Active'       # 젊은, 중간 소득, 고지출
}

df['segment'] = df['cluster'].map(cluster_names)
print(df['segment'].value_counts())
\`\`\`
`,
      objectives: [
        '클러스터 프로파일링을 수행할 수 있다',
        '클러스터 중심을 해석할 수 있다',
        '비즈니스 의미를 부여할 수 있다'
      ],
      keyPoints: [
        'groupby().agg(): 클러스터별 통계',
        'cluster_centers_: 클러스터 중심',
        'Z-score 히트맵: 클러스터 비교',
        '네이밍으로 비즈니스 의미 부여'
      ]
    }
  },
  {
    id: 'p2w6d4t2',
    type: 'video',
    title: '클러스터 시각화',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 클러스터 시각화

## 2D 산점도 (2개 피처)

\`\`\`python
import matplotlib.pyplot as plt

plt.figure(figsize=(10, 6))
scatter = plt.scatter(df['age'], df['income'],
                      c=df['cluster'], cmap='viridis',
                      alpha=0.6, s=50)
plt.colorbar(scatter, label='Cluster')
plt.xlabel('Age')
plt.ylabel('Income')
plt.title('Customer Clusters')
plt.show()
\`\`\`

## PCA 시각화 (다차원 → 2D)

\`\`\`python
from sklearn.decomposition import PCA

# 2차원으로 축소
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# 설명된 분산
print(f"설명된 분산: {sum(pca.explained_variance_ratio_)*100:.1f}%")

# 시각화
plt.figure(figsize=(10, 6))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1],
                      c=df['cluster'], cmap='viridis',
                      alpha=0.6, s=50)
plt.colorbar(scatter, label='Cluster')
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]*100:.1f}%)')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]*100:.1f}%)')
plt.title('Clusters in PCA Space')
plt.show()
\`\`\`

## t-SNE 시각화

\`\`\`python
from sklearn.manifold import TSNE

# t-SNE 변환 (비선형)
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X_scaled)

plt.figure(figsize=(10, 6))
scatter = plt.scatter(X_tsne[:, 0], X_tsne[:, 1],
                      c=df['cluster'], cmap='viridis',
                      alpha=0.6, s=50)
plt.colorbar(scatter, label='Cluster')
plt.title('Clusters in t-SNE Space')
plt.show()

# 주의: t-SNE는 거리 해석 불가
# 클러스터 분리 확인용으로만 사용
\`\`\`

## Radar Chart (Spider Plot)

\`\`\`python
import numpy as np

# 클러스터별 평균 (정규화)
cluster_means = df.groupby('cluster')[feature_names].mean()
cluster_norm = (cluster_means - cluster_means.min()) / (cluster_means.max() - cluster_means.min())

# Radar Chart
from math import pi

categories = feature_names
N = len(categories)
angles = [n / float(N) * 2 * pi for n in range(N)]
angles += angles[:1]

fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))

for cluster in cluster_norm.index:
    values = cluster_norm.loc[cluster].tolist()
    values += values[:1]
    ax.plot(angles, values, linewidth=2, label=f'Cluster {cluster}')
    ax.fill(angles, values, alpha=0.25)

ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories)
ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1))
plt.title('Cluster Profiles (Radar Chart)')
plt.show()
\`\`\`
`,
      objectives: [
        'PCA로 고차원 클러스터를 시각화한다',
        't-SNE의 장단점을 이해한다',
        'Radar Chart로 프로파일을 비교한다'
      ],
      keyPoints: [
        'PCA: 선형 축소, 분산 보존',
        't-SNE: 비선형, 거리 해석 불가',
        'Radar Chart: 프로파일 비교',
        '목적에 맞는 시각화 선택'
      ]
    }
  },
  {
    id: 'p2w6d4t3',
    type: 'code',
    title: '실습: 클러스터 프로파일링 & 시각화',
    duration: 45,
    content: {
      instructions: `# 클러스터 프로파일링 실습

## 목표
클러스터링 결과를 분석하고 시각화하세요.

## 요구사항
1. K-means 클러스터링 수행
2. 클러스터 프로파일 (기술 통계)
3. PCA 시각화
4. Radar Chart
5. 클러스터 네이밍
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from math import pi

np.random.seed(42)
n = 600

# 고객 데이터 (4개 세그먼트)
df = pd.DataFrame({
    'age': np.concatenate([
        np.random.normal(25, 4, 150),
        np.random.normal(35, 6, 150),
        np.random.normal(50, 8, 150),
        np.random.normal(28, 5, 150)
    ]),
    'income': np.concatenate([
        np.random.normal(35000, 8000, 150),
        np.random.normal(55000, 12000, 150),
        np.random.normal(90000, 20000, 150),
        np.random.normal(45000, 10000, 150)
    ]),
    'spending': np.concatenate([
        np.random.normal(400, 100, 150),
        np.random.normal(600, 150, 150),
        np.random.normal(1200, 300, 150),
        np.random.normal(900, 200, 150)
    ]),
    'frequency': np.concatenate([
        np.random.poisson(3, 150),
        np.random.poisson(5, 150),
        np.random.poisson(8, 150),
        np.random.poisson(10, 150)
    ])
})

feature_names = ['age', 'income', 'spending', 'frequency']
print(f"Shape: {df.shape}")

# TODO: 클러스터 프로파일링
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from math import pi

np.random.seed(42)
n = 600

df = pd.DataFrame({
    'age': np.concatenate([
        np.random.normal(25, 4, 150),
        np.random.normal(35, 6, 150),
        np.random.normal(50, 8, 150),
        np.random.normal(28, 5, 150)
    ]),
    'income': np.concatenate([
        np.random.normal(35000, 8000, 150),
        np.random.normal(55000, 12000, 150),
        np.random.normal(90000, 20000, 150),
        np.random.normal(45000, 10000, 150)
    ]),
    'spending': np.concatenate([
        np.random.normal(400, 100, 150),
        np.random.normal(600, 150, 150),
        np.random.normal(1200, 300, 150),
        np.random.normal(900, 200, 150)
    ]),
    'frequency': np.concatenate([
        np.random.poisson(3, 150),
        np.random.poisson(5, 150),
        np.random.poisson(8, 150),
        np.random.poisson(10, 150)
    ])
})

feature_names = ['age', 'income', 'spending', 'frequency']

# 1. 클러스터링
print("=== 1. K-means 클러스터링 ===")
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df[feature_names])

kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
df['cluster'] = kmeans.fit_predict(X_scaled)

# 2. 프로파일링
print("\\n=== 2. 클러스터 프로파일 ===")
profile = df.groupby('cluster')[feature_names].agg(['mean', 'std']).round(1)
print(profile)

print("\\n클러스터 크기:")
sizes = df['cluster'].value_counts().sort_index()
for c, size in sizes.items():
    print(f"  클러스터 {c}: {size}명 ({size/len(df)*100:.1f}%)")

# 3. PCA 시각화
print("\\n=== 3. PCA 시각화 ===")
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)
print(f"설명된 분산: {sum(pca.explained_variance_ratio_)*100:.1f}%")

# 4. 클러스터 네이밍
print("\\n=== 4. 클러스터 네이밍 ===")
cluster_means = df.groupby('cluster')[feature_names].mean()
print(cluster_means.round(0))

# 특성 분석 후 네이밍
cluster_names = {}
for c in range(4):
    row = cluster_means.loc[c]
    if row['age'] < 30 and row['spending'] < 600:
        cluster_names[c] = 'Young Budget'
    elif row['income'] > 70000:
        cluster_names[c] = 'Premium VIP'
    elif row['frequency'] > 8:
        cluster_names[c] = 'Young Active'
    else:
        cluster_names[c] = 'Mainstream'

df['segment'] = df['cluster'].map(cluster_names)
print("\\n세그먼트 분포:")
print(df['segment'].value_counts())

# 5. Radar Chart 데이터 준비
print("\\n=== 5. 프로파일 비교 ===")
cluster_norm = (cluster_means - cluster_means.min()) / (cluster_means.max() - cluster_means.min())
print(cluster_norm.round(2))
`,
      hints: [
        'StandardScaler로 스케일링 후 클러스터링',
        'groupby().agg()로 프로파일',
        'PCA(n_components=2)로 2D 변환',
        '클러스터 특성 보고 의미 있는 이름 부여'
      ]
    }
  },
  {
    id: 'p2w6d4t4',
    type: 'quiz',
    title: 'Day 4 퀴즈',
    duration: 10,
    content: {
      questions: [
        {
          question: 'PCA 시각화의 장점은?',
          options: ['비선형 관계 포착', '선형 축소로 분산 보존', '거리 완벽 보존', '클러스터 자동 생성'],
          answer: 1
        },
        {
          question: 't-SNE 사용 시 주의점은?',
          options: ['빠른 속도', '거리 해석 불가', '항상 PCA보다 좋음', '대용량에 적합'],
          answer: 1
        },
        {
          question: 'Radar Chart의 용도는?',
          options: ['클러스터링 수행', '다차원 프로파일 비교', '이상치 탐지', '시계열 분석'],
          answer: 1
        }
      ]
    }
  }
]
