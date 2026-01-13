// Week 15 Day 2: 밀도 기반 이상탐지 (LOF, DBSCAN)
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'p2w7d2t1',
    type: 'video',
    title: 'LOF (Local Outlier Factor)',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# LOF (Local Outlier Factor)

## LOF 개념

지역 밀도 기반 이상탐지
- 주변 이웃과 비교하여 밀도가 낮으면 이상
- 밀도가 다른 클러스터도 처리 가능

## LOF 계산 과정

\`\`\`
1. k-이웃 찾기
2. 각 점의 지역 밀도 계산 (LRD)
3. 이웃들의 밀도와 비교 (LOF)

LOF ≈ 1: 정상 (이웃과 밀도 비슷)
LOF >> 1: 이상 (이웃보다 밀도 낮음)
\`\`\`

## 구현

\`\`\`python
from sklearn.neighbors import LocalOutlierFactor

# LOF 모델
lof = LocalOutlierFactor(
    n_neighbors=20,           # 이웃 수 (보통 20)
    contamination=0.05,       # 예상 이상치 비율
    novelty=False             # 학습 데이터 내 탐지
)

# 예측 (-1: 이상, 1: 정상)
df['lof_pred'] = lof.fit_predict(X_scaled)

# LOF 점수 (높을수록 이상)
df['lof_score'] = -lof.negative_outlier_factor_

# 이상치 추출
outliers = df[df['lof_pred'] == -1]
print(f"이상치: {len(outliers)} ({len(outliers)/len(df)*100:.1f}%)")

# 점수 분포 시각화
import matplotlib.pyplot as plt
plt.figure(figsize=(10, 5))
plt.hist(df['lof_score'], bins=50)
plt.axvline(df['lof_score'].quantile(0.95), color='r', linestyle='--')
plt.xlabel('LOF Score')
plt.ylabel('Count')
plt.title('LOF Score Distribution')
plt.show()
\`\`\`

## n_neighbors 선택

\`\`\`python
# 다양한 k 값으로 테스트
k_values = [5, 10, 20, 30, 50]
results = []

for k in k_values:
    lof = LocalOutlierFactor(n_neighbors=k, contamination=0.05)
    labels = lof.fit_predict(X_scaled)
    n_outliers = (labels == -1).sum()
    results.append({'k': k, 'outliers': n_outliers})

print(pd.DataFrame(results))

# 일반적 권장: k = 20 또는 sqrt(n)
\`\`\`
`,
      objectives: [
        'LOF의 원리를 이해한다',
        'LOF를 구현하고 적용할 수 있다',
        'n_neighbors를 선택할 수 있다'
      ],
      keyPoints: [
        'LOF > 1: 이상 (이웃보다 희박)',
        'n_neighbors: 보통 20, sqrt(n)',
        'contamination: 예상 이상치 비율',
        '밀도 차이 있는 클러스터에 강함'
      ]
    }
  },
  {
    id: 'p2w7d2t2',
    type: 'video',
    title: 'DBSCAN 이상탐지',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# DBSCAN 이상탐지

## DBSCAN의 이상탐지 활용

밀도 기반 클러스터링 → 노이즈 = 이상치

\`\`\`python
from sklearn.cluster import DBSCAN
from sklearn.neighbors import NearestNeighbors

# eps 결정 (k-distance plot)
k = 5
nn = NearestNeighbors(n_neighbors=k)
nn.fit(X_scaled)
distances, _ = nn.kneighbors(X_scaled)
k_distances = np.sort(distances[:, k-1])

plt.figure(figsize=(10, 5))
plt.plot(k_distances)
plt.xlabel('Points')
plt.ylabel(f'{k}-th NN Distance')
plt.title('K-Distance Plot (Elbow = eps)')
plt.show()
\`\`\`

## DBSCAN 적용

\`\`\`python
# DBSCAN
dbscan = DBSCAN(
    eps=0.5,           # 이웃 반경
    min_samples=5      # 최소 이웃 수
)
df['dbscan_label'] = dbscan.fit_predict(X_scaled)

# 노이즈 = 이상치 (-1)
outliers = df[df['dbscan_label'] == -1]
clusters = df[df['dbscan_label'] != -1]

print(f"클러스터 수: {df['dbscan_label'].max() + 1}")
print(f"이상치 수: {len(outliers)} ({len(outliers)/len(df)*100:.1f}%)")

# 시각화
plt.figure(figsize=(10, 6))
plt.scatter(X_scaled[:, 0], X_scaled[:, 1],
            c=df['dbscan_label'], cmap='viridis', alpha=0.6)
plt.scatter(outliers[X_scaled[:, 0]], outliers[X_scaled[:, 1]],
            c='red', marker='x', s=100, label='Outliers')
plt.legend()
plt.title('DBSCAN Clustering & Outliers')
plt.show()
\`\`\`

## LOF vs DBSCAN

| 특성 | LOF | DBSCAN |
|------|-----|--------|
| 출력 | 점수 (연속) | 레이블 (-1/클러스터) |
| 임계값 | contamination | eps, min_samples |
| 강점 | 밀도 차이 클러스터 | 임의 형태 클러스터 |
| 약점 | 계산 비용 | 밀도 균일 가정 |

## 하이브리드 접근

\`\`\`python
# LOF + DBSCAN 조합
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.05)
dbscan = DBSCAN(eps=0.5, min_samples=5)

df['lof_outlier'] = (lof.fit_predict(X_scaled) == -1).astype(int)
df['dbscan_outlier'] = (dbscan.fit_predict(X_scaled) == -1).astype(int)

# 둘 다 이상으로 판단 (AND)
df['both_outlier'] = (df['lof_outlier'] & df['dbscan_outlier']).astype(int)

# 하나라도 이상으로 판단 (OR)
df['any_outlier'] = (df['lof_outlier'] | df['dbscan_outlier']).astype(int)

print(f"LOF only: {df['lof_outlier'].sum()}")
print(f"DBSCAN only: {df['dbscan_outlier'].sum()}")
print(f"Both: {df['both_outlier'].sum()}")
print(f"Any: {df['any_outlier'].sum()}")
\`\`\`
`,
      objectives: [
        'DBSCAN으로 이상탐지를 수행할 수 있다',
        'eps를 결정할 수 있다',
        'LOF와 DBSCAN을 비교할 수 있다'
      ],
      keyPoints: [
        'DBSCAN 노이즈(-1) = 이상치',
        'k-distance plot으로 eps 결정',
        'LOF: 점수, DBSCAN: 레이블',
        '하이브리드 접근으로 신뢰도 향상'
      ]
    }
  },
  {
    id: 'p2w7d2t3',
    type: 'code',
    title: '실습: LOF & DBSCAN 이상탐지',
    duration: 40,
    content: {
      instructions: `# 밀도 기반 이상탐지 실습

## 목표
LOF와 DBSCAN으로 이상치를 탐지하고 비교하세요.

## 요구사항
1. LOF 적용 (n_neighbors 튜닝)
2. DBSCAN 적용 (eps 결정)
3. 두 방법 결과 비교
4. 하이브리드 접근 (AND/OR)
5. 성능 평가
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.neighbors import LocalOutlierFactor, NearestNeighbors
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_moons, make_blobs

np.random.seed(42)

# 초승달 형태 + 이상치
X_moons, _ = make_moons(n_samples=300, noise=0.1, random_state=42)

# 이상치 추가
outliers = np.random.uniform(low=[-1.5, -1], high=[2.5, 2], size=(15, 2))
X = np.vstack([X_moons, outliers])
y_true = np.array([0]*300 + [1]*15)  # 0: 정상, 1: 이상

# 스케일링
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

df = pd.DataFrame(X_scaled, columns=['x', 'y'])
df['true_outlier'] = y_true

print(f"전체: {len(df)}, 실제 이상치: {y_true.sum()}")

# TODO: LOF & DBSCAN 이상탐지
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.neighbors import LocalOutlierFactor, NearestNeighbors
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_moons

np.random.seed(42)

X_moons, _ = make_moons(n_samples=300, noise=0.1, random_state=42)
outliers = np.random.uniform(low=[-1.5, -1], high=[2.5, 2], size=(15, 2))
X = np.vstack([X_moons, outliers])
y_true = np.array([0]*300 + [1]*15)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

df = pd.DataFrame(X_scaled, columns=['x', 'y'])
df['true_outlier'] = y_true

# 1. LOF
print("=== 1. LOF ===")
for k in [5, 10, 20]:
    lof = LocalOutlierFactor(n_neighbors=k, contamination=0.05)
    pred = (lof.fit_predict(X_scaled) == -1).astype(int)
    tp = ((pred == 1) & (y_true == 1)).sum()
    fp = ((pred == 1) & (y_true == 0)).sum()
    recall = tp / y_true.sum()
    print(f"k={k}: 탐지={pred.sum()}, TP={tp}, FP={fp}, Recall={recall:.2f}")

# 최적 k=10 사용
lof = LocalOutlierFactor(n_neighbors=10, contamination=0.05)
df['lof_outlier'] = (lof.fit_predict(X_scaled) == -1).astype(int)
df['lof_score'] = -lof.negative_outlier_factor_

# 2. DBSCAN eps 결정
print("\\n=== 2. DBSCAN ===")
nn = NearestNeighbors(n_neighbors=5)
nn.fit(X_scaled)
distances, _ = nn.kneighbors(X_scaled)
k_distances = np.sort(distances[:, 4])
print(f"k-distance 95th percentile: {np.percentile(k_distances, 95):.3f}")

# eps=0.4 선택
dbscan = DBSCAN(eps=0.4, min_samples=5)
df['dbscan_outlier'] = (dbscan.fit_predict(X_scaled) == -1).astype(int)
print(f"DBSCAN 이상치: {df['dbscan_outlier'].sum()}")

# 3. 비교
print("\\n=== 3. 방법 비교 ===")
for method in ['lof_outlier', 'dbscan_outlier']:
    pred = df[method]
    tp = ((pred == 1) & (df['true_outlier'] == 1)).sum()
    fp = ((pred == 1) & (df['true_outlier'] == 0)).sum()
    fn = ((pred == 0) & (df['true_outlier'] == 1)).sum()

    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0

    print(f"{method}: Precision={precision:.2f}, Recall={recall:.2f}")

# 4. 하이브리드
print("\\n=== 4. 하이브리드 ===")
df['both'] = (df['lof_outlier'] & df['dbscan_outlier']).astype(int)
df['any'] = (df['lof_outlier'] | df['dbscan_outlier']).astype(int)

for method in ['both', 'any']:
    pred = df[method]
    tp = ((pred == 1) & (df['true_outlier'] == 1)).sum()
    fp = ((pred == 1) & (df['true_outlier'] == 0)).sum()
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / df['true_outlier'].sum()
    print(f"{method}: 탐지={pred.sum()}, Precision={precision:.2f}, Recall={recall:.2f}")

print("\\n결론: AND는 높은 Precision, OR는 높은 Recall")
`,
      hints: [
        'LocalOutlierFactor(n_neighbors=k)',
        'fit_predict() 결과 -1이 이상치',
        'DBSCAN eps는 k-distance plot 참고',
        'AND: 확실한 이상, OR: 놓치지 않기'
      ]
    }
  },
  {
    id: 'p2w7d2t4',
    type: 'quiz',
    title: 'Day 2 퀴즈',
    duration: 10,
    content: {
      questions: [
        {
          question: 'LOF 점수가 1보다 훨씬 크면 의미는?',
          options: ['정상', '이웃보다 밀도 높음', '이상치 (이웃보다 밀도 낮음)', '클러스터 중심'],
          answer: 2,
          explanation: 'LOF(Local Outlier Factor)가 1보다 크면 주변 이웃보다 밀도가 낮다는 의미입니다. LOF ≈ 1은 이웃과 밀도가 비슷한 정상, LOF >> 1은 고립된 이상치를 나타냅니다.'
        },
        {
          question: 'DBSCAN에서 이상치의 레이블은?',
          options: ['0', '1', '-1', '999'],
          answer: 2,
          explanation: 'DBSCAN은 밀도 기반 클러스터링으로, 어떤 클러스터에도 속하지 않는 노이즈 포인트에 -1 레이블을 부여합니다. 이 노이즈가 곧 이상치로 활용됩니다.'
        },
        {
          question: 'LOF와 DBSCAN을 AND로 조합하면?',
          options: ['Recall 증가', 'Precision 증가', '속도 증가', '계산량 감소'],
          answer: 1,
          explanation: 'AND 조합은 두 방법 모두 이상으로 판단한 경우만 최종 이상으로 분류합니다. 이는 오탐(False Positive)을 줄여 Precision을 높이지만, 일부 이상치를 놓쳐 Recall은 감소합니다.'
        }
      ]
    }
  }
]
