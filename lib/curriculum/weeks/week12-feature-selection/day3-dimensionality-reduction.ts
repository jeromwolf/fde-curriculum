// Week 12 Day 3: 차원 축소 (PCA, t-SNE, UMAP)
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'p2w4d3t1',
    type: 'video',
    title: 'PCA (Principal Component Analysis)',
    duration: 30,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# PCA (Principal Component Analysis)

## PCA란?

고차원 데이터를 분산을 최대로 보존하며 저차원으로 변환

## 기본 사용법

\\\`\\\`\\\`python
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# 스케일링 (필수!)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# PCA 적용
pca = PCA(n_components=0.95)  # 95% 분산 유지
X_pca = pca.fit_transform(X_scaled)

print(f"원본: {X.shape[1]} → PCA: {X_pca.shape[1]}")
print(f"설명된 분산: {sum(pca.explained_variance_ratio_):.2%}")
\\\`\\\`\\\`

## Explained Variance 분석

\\\`\\\`\\\`python
# 누적 분산 비율 시각화
cumsum = np.cumsum(pca.explained_variance_ratio_)

plt.figure(figsize=(10, 5))
plt.plot(range(1, len(cumsum) + 1), cumsum, 'bo-')
plt.axhline(0.95, color='r', linestyle='--', label='95%')
plt.xlabel('Number of Components')
plt.ylabel('Cumulative Explained Variance')
plt.legend()
\\\`\\\`\\\`

## 최적 컴포넌트 수 결정

\\\`\\\`\\\`python
# 방법 1: 분산 비율
pca = PCA(n_components=0.95)

# 방법 2: 명시적 개수
pca = PCA(n_components=10)

# 방법 3: Elbow 방법
pca = PCA()
pca.fit(X_scaled)

# Scree Plot
plt.plot(pca.explained_variance_, 'bo-')
plt.xlabel('Component')
plt.ylabel('Explained Variance')
\\\`\\\`\\\`

## PCA 해석

\\\`\\\`\\\`python
# 주성분의 피처 기여도
components = pd.DataFrame(
    pca.components_.T,
    columns=[f'PC{i+1}' for i in range(pca.n_components_)],
    index=X.columns
)

# PC1에 가장 기여하는 피처
pc1_contributions = components['PC1'].abs().sort_values(ascending=False)
print(pc1_contributions.head(10))
\\\`\\\`\\\`
`,
      objectives: [
        'PCA의 원리를 이해한다',
        '최적 컴포넌트 수를 결정할 수 있다',
        'PCA 결과를 해석할 수 있다'
      ],
      keyPoints: [
        '스케일링 필수',
        'n_components로 분산 비율 또는 개수 지정',
        'Scree Plot으로 Elbow 확인',
        'components_로 피처 기여도 확인'
      ]
    }
  },
  {
    id: 'p2w4d3t2',
    type: 'video',
    title: 't-SNE & UMAP',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# t-SNE & UMAP

## t-SNE (t-Distributed Stochastic Neighbor Embedding)

고차원에서 가까운 점들이 저차원에서도 가깝도록

\\\`\\\`\\\`python
from sklearn.manifold import TSNE

# t-SNE 적용 (2D 시각화용)
tsne = TSNE(
    n_components=2,
    perplexity=30,      # 이웃 수 (5-50)
    n_iter=1000,
    random_state=42
)
X_tsne = tsne.fit_transform(X_scaled)

# 시각화
plt.scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap='viridis', alpha=0.7)
plt.colorbar()
plt.title('t-SNE Visualization')
\\\`\\\`\\\`

## UMAP (Uniform Manifold Approximation and Projection)

t-SNE보다 빠르고 전역 구조 보존 좋음

\\\`\\\`\\\`python
import umap

# UMAP 적용
reducer = umap.UMAP(
    n_components=2,
    n_neighbors=15,      # 이웃 수
    min_dist=0.1,        # 점 간 최소 거리
    random_state=42
)
X_umap = reducer.fit_transform(X_scaled)

# 시각화
plt.scatter(X_umap[:, 0], X_umap[:, 1], c=y, cmap='viridis', alpha=0.7)
plt.title('UMAP Visualization')
\\\`\\\`\\\`

## 방법 비교

| 방법 | 속도 | 전역 구조 | 지역 구조 | 용도 |
|------|------|----------|----------|------|
| PCA | 빠름 | 좋음 | 보통 | 피처 축소 |
| t-SNE | 느림 | 나쁨 | 좋음 | 시각화 |
| UMAP | 빠름 | 좋음 | 좋음 | 시각화/피처 |

## 주의사항

\\\`\\\`\\\`
1. t-SNE/UMAP은 주로 시각화용
2. 축의 의미 없음 (해석 불가)
3. perplexity/n_neighbors에 민감
4. 매번 결과가 다를 수 있음 (random_state 고정)
\\\`\\\`\\\`
`,
      objectives: [
        't-SNE와 UMAP의 차이를 이해한다',
        '고차원 데이터를 시각화할 수 있다',
        '하이퍼파라미터의 영향을 이해한다'
      ],
      keyPoints: [
        't-SNE: 지역 구조 강조, 느림',
        'UMAP: 전역+지역, 빠름',
        'perplexity/n_neighbors: 이웃 수',
        '시각화용, 축 해석 불가'
      ]
    }
  },
  {
    id: 'p2w4d3t3',
    type: 'code',
    title: '실습: 차원 축소 시각화',
    duration: 40,
    content: {
      instructions: `# 차원 축소 실습

## 목표
PCA, t-SNE, UMAP으로 고차원 데이터를 시각화하세요.

## 요구사항
1. PCA로 95% 분산 유지
2. t-SNE 2D 시각화
3. UMAP 2D 시각화
4. 방법 비교
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

# 샘플 데이터
X, y = make_classification(n_samples=500, n_features=50, n_informative=10,
                           n_redundant=20, n_clusters_per_class=2, random_state=42)

print(f"원본 Shape: {X.shape}")

# 스케일링
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# TODO: 차원 축소 및 시각화
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

X, y = make_classification(n_samples=500, n_features=50, n_informative=10,
                           n_redundant=20, n_clusters_per_class=2, random_state=42)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

print("=== 1. PCA ===")
pca = PCA(n_components=0.95)
X_pca = pca.fit_transform(X_scaled)
print(f"원본: {X.shape[1]} → PCA: {X_pca.shape[1]}")
print(f"설명된 분산: {sum(pca.explained_variance_ratio_):.2%}")

print("\\n=== 2. t-SNE ===")
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X_scaled)
print(f"t-SNE Shape: {X_tsne.shape}")

print("\\n=== 3. UMAP ===")
try:
    import umap
    reducer = umap.UMAP(n_components=2, random_state=42)
    X_umap = reducer.fit_transform(X_scaled)
    print(f"UMAP Shape: {X_umap.shape}")
except ImportError:
    print("UMAP 미설치 - pip install umap-learn")
    X_umap = X_tsne  # 대체

# 시각화
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# PCA (처음 2개 컴포넌트)
axes[0].scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='viridis', alpha=0.7)
axes[0].set_title('PCA')

# t-SNE
axes[1].scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap='viridis', alpha=0.7)
axes[1].set_title('t-SNE')

# UMAP
axes[2].scatter(X_umap[:, 0], X_umap[:, 1], c=y, cmap='viridis', alpha=0.7)
axes[2].set_title('UMAP')

plt.tight_layout()
plt.savefig('dimensionality_reduction.png', dpi=100)
print("\\n시각화 저장: dimensionality_reduction.png")
`,
      hints: [
        'PCA(n_components=0.95)로 95% 분산 유지',
        'TSNE(n_components=2)로 2D',
        'plt.scatter(X[:, 0], X[:, 1], c=y)로 레이블 색상'
      ]
    }
  },
  {
    id: 'p2w4d3t4',
    type: 'quiz',
    title: 'Day 3 퀴즈',
    duration: 10,
    content: {
      questions: [
        {
          question: 'PCA 적용 전 필수 전처리는?',
          options: ['결측치 제거', '스케일링', '인코딩', '샘플링'],
          answer: 1
        },
        {
          question: 't-SNE와 UMAP의 주요 용도는?',
          options: ['피처 생성', '시각화', '클러스터링', '예측'],
          answer: 1
        },
        {
          question: 'UMAP이 t-SNE보다 좋은 점은?',
          options: ['더 정확함', '전역 구조 보존 + 빠름', '항상 같은 결과', '해석 가능'],
          answer: 1
        }
      ]
    }
  }
]
