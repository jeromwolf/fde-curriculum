// Week 14 Day 2: 계층적 클러스터링 & DBSCAN
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'p2w6d2t1',
    type: 'video',
    title: '계층적 클러스터링',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 계층적 클러스터링

## 개념

데이터를 트리 구조로 계층적으로 그룹화
- Agglomerative (상향식): 개별 → 병합
- Divisive (하향식): 전체 → 분할

## 구현

\`\`\`python
from scipy.cluster.hierarchy import dendrogram, linkage, fcluster
from sklearn.cluster import AgglomerativeClustering

# 1. Linkage 계산
Z = linkage(X_scaled, method='ward')

# method 옵션
# - 'ward': 분산 최소화 (가장 많이 사용)
# - 'complete': 최대 거리
# - 'average': 평균 거리
# - 'single': 최소 거리

# 2. 덴드로그램 시각화
plt.figure(figsize=(12, 6))
dendrogram(Z, truncate_mode='lastp', p=30,
           leaf_rotation=90, leaf_font_size=10)
plt.title('Hierarchical Clustering Dendrogram')
plt.xlabel('Sample Index')
plt.ylabel('Distance')
plt.axhline(y=5, color='r', linestyle='--', label='Cut line')
plt.show()
\`\`\`

## 클러스터 추출

\`\`\`python
# 방법 1: 클러스터 수로 자르기
clusters = fcluster(Z, t=4, criterion='maxclust')

# 방법 2: 거리로 자르기
clusters = fcluster(Z, t=5, criterion='distance')

# 방법 3: sklearn 사용
agg = AgglomerativeClustering(n_clusters=4, linkage='ward')
df['cluster'] = agg.fit_predict(X_scaled)
\`\`\`

## 덴드로그램 해석

\`\`\`
세로축: 클러스터 간 거리
가로축: 샘플 (또는 클러스터)

높이가 높을수록: 클러스터가 멀리 있음
수평선 자르기: 클러스터 수 결정

덴드로그램의 장점:
- K를 미리 지정할 필요 없음
- 데이터 구조 시각적으로 파악
- 다양한 수준의 클러스터 탐색 가능
\`\`\`
`,
      objectives: [
        '계층적 클러스터링의 원리를 이해한다',
        '덴드로그램을 해석할 수 있다',
        '적절한 클러스터 수를 결정할 수 있다'
      ],
      keyPoints: [
        'ward: 분산 최소화, 가장 많이 사용',
        '덴드로그램: 클러스터 구조 시각화',
        'fcluster: 클러스터 추출',
        'K 사전 지정 불필요'
      ]
    }
  },
  {
    id: 'p2w6d2t2',
    type: 'video',
    title: 'DBSCAN',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# DBSCAN (Density-Based Clustering)

## 개념

밀도 기반 클러스터링
- 밀집 영역을 클러스터로
- 희박 영역은 노이즈
- 임의 형태 클러스터 가능

## 핵심 파라미터

\`\`\`
eps: 이웃 정의 반경
min_samples: 코어 포인트 최소 이웃 수

포인트 유형:
- Core: min_samples 이상의 이웃
- Border: Core의 이웃이지만 자신은 Core 아님
- Noise: 어떤 클러스터에도 속하지 않음 (레이블 -1)
\`\`\`

## 구현

\`\`\`python
from sklearn.cluster import DBSCAN
from sklearn.neighbors import NearestNeighbors

# 1. eps 결정 (k-distance plot)
k = 5  # min_samples와 동일하게
nn = NearestNeighbors(n_neighbors=k)
nn.fit(X_scaled)
distances, _ = nn.kneighbors(X_scaled)
distances = np.sort(distances[:, k-1])

plt.figure(figsize=(8, 5))
plt.plot(distances)
plt.xlabel('Points')
plt.ylabel(f'{k}-th Nearest Neighbor Distance')
plt.title('K-Distance Plot (Elbow = eps)')
plt.show()
# Elbow 지점의 y값이 eps 후보

# 2. DBSCAN 적용
dbscan = DBSCAN(eps=0.5, min_samples=5)
df['cluster'] = dbscan.fit_predict(X_scaled)

# 3. 결과 확인
print(f"클러스터 수: {len(set(df['cluster'])) - 1}")  # -1(노이즈) 제외
print(f"노이즈 포인트: {(df['cluster'] == -1).sum()}")
\`\`\`

## K-means vs DBSCAN

| 특성 | K-means | DBSCAN |
|------|---------|--------|
| K 지정 | 필요 | 불필요 |
| 클러스터 형태 | 구형 | 임의 |
| 이상치 | 강제 배정 | 노이즈로 분리 |
| 밀도 차이 | 취약 | 강건 |
| 대용량 | 빠름 | 느림 |
`,
      objectives: [
        'DBSCAN의 원리를 이해한다',
        'eps, min_samples를 결정할 수 있다',
        'K-means와 DBSCAN을 비교할 수 있다'
      ],
      keyPoints: [
        'eps: 이웃 반경',
        'min_samples: 코어 포인트 조건',
        '-1: 노이즈 (이상치)',
        '임의 형태 클러스터 가능'
      ]
    }
  },
  {
    id: 'p2w6d2t3',
    type: 'code',
    title: '실습: 클러스터링 방법 비교',
    duration: 40,
    content: {
      instructions: `# 클러스터링 방법 비교 실습

## 목표
K-means, 계층적, DBSCAN을 비교하세요.

## 요구사항
1. K-means 클러스터링
2. 계층적 클러스터링 + 덴드로그램
3. DBSCAN (eps 결정)
4. 3가지 방법 비교
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from scipy.cluster.hierarchy import dendrogram, linkage

np.random.seed(42)

# 다양한 형태의 클러스터 데이터
from sklearn.datasets import make_moons, make_blobs

# 초승달 형태 (비선형)
X_moons, _ = make_moons(n_samples=300, noise=0.1, random_state=42)

# 구형 클러스터
X_blobs, _ = make_blobs(n_samples=300, centers=3, cluster_std=0.8, random_state=42)

print("데이터 생성 완료")

# TODO: 클러스터링 비교
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from scipy.cluster.hierarchy import dendrogram, linkage

np.random.seed(42)

from sklearn.datasets import make_moons, make_blobs

X_moons, _ = make_moons(n_samples=300, noise=0.1, random_state=42)
X_blobs, _ = make_blobs(n_samples=300, centers=3, cluster_std=0.8, random_state=42)

# 스케일링
scaler = StandardScaler()
X_moons_scaled = scaler.fit_transform(X_moons)
X_blobs_scaled = scaler.fit_transform(X_blobs)

print("=== 초승달 데이터 (비선형) ===")

# K-means
kmeans_moons = KMeans(n_clusters=2, random_state=42, n_init=10)
km_labels = kmeans_moons.fit_predict(X_moons_scaled)
print(f"K-means Silhouette: {silhouette_score(X_moons_scaled, km_labels):.3f}")

# 계층적
agg_moons = AgglomerativeClustering(n_clusters=2, linkage='ward')
agg_labels = agg_moons.fit_predict(X_moons_scaled)
print(f"계층적 Silhouette: {silhouette_score(X_moons_scaled, agg_labels):.3f}")

# DBSCAN
dbscan_moons = DBSCAN(eps=0.3, min_samples=5)
db_labels = dbscan_moons.fit_predict(X_moons_scaled)
n_clusters = len(set(db_labels)) - (1 if -1 in db_labels else 0)
print(f"DBSCAN 클러스터 수: {n_clusters}, 노이즈: {(db_labels == -1).sum()}")
if n_clusters > 1:
    mask = db_labels != -1
    print(f"DBSCAN Silhouette: {silhouette_score(X_moons_scaled[mask], db_labels[mask]):.3f}")

print("\\n=== 구형 데이터 ===")

# K-means
kmeans_blobs = KMeans(n_clusters=3, random_state=42, n_init=10)
km_labels_b = kmeans_blobs.fit_predict(X_blobs_scaled)
print(f"K-means Silhouette: {silhouette_score(X_blobs_scaled, km_labels_b):.3f}")

# 계층적
agg_blobs = AgglomerativeClustering(n_clusters=3, linkage='ward')
agg_labels_b = agg_blobs.fit_predict(X_blobs_scaled)
print(f"계층적 Silhouette: {silhouette_score(X_blobs_scaled, agg_labels_b):.3f}")

# DBSCAN
dbscan_blobs = DBSCAN(eps=0.5, min_samples=5)
db_labels_b = dbscan_blobs.fit_predict(X_blobs_scaled)
n_clusters_b = len(set(db_labels_b)) - (1 if -1 in db_labels_b else 0)
print(f"DBSCAN 클러스터 수: {n_clusters_b}")

print("\\n=== 결론 ===")
print("초승달 데이터: DBSCAN이 비선형 구조를 잘 찾음")
print("구형 데이터: K-means, 계층적 모두 잘 작동")
`,
      hints: [
        'make_moons: 초승달 형태 비선형 데이터',
        'DBSCAN eps=0.3이 초승달에 적합',
        'silhouette_score는 노이즈(-1) 제외 후 계산',
        '데이터 형태에 따라 최적 알고리즘 다름'
      ]
    }
  },
  {
    id: 'p2w6d2t4',
    type: 'quiz',
    title: 'Day 2 퀴즈',
    duration: 10,
    content: {
      questions: [
        {
          question: 'DBSCAN에서 레이블 -1의 의미는?',
          options: ['첫 번째 클러스터', '노이즈/이상치', '오류', '미분류'],
          answer: 1
        },
        {
          question: '계층적 클러스터링의 장점은?',
          options: ['속도가 빠름', 'K를 미리 지정 안 해도 됨', '대용량에 적합', '항상 최적'],
          answer: 1
        },
        {
          question: 'DBSCAN이 K-means보다 좋은 경우는?',
          options: ['구형 클러스터', '임의 형태 + 노이즈', '대용량 데이터', '클러스터 수 알 때'],
          answer: 1
        }
      ]
    }
  }
]
