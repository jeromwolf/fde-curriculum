// Week 15 Day 3: Isolation Forest
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'p2w7d3t1',
    type: 'video',
    title: 'Isolation Forest 원리',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# Isolation Forest

## 핵심 아이디어

이상치는 "고립시키기 쉽다"
- 정상: 분리하려면 많은 분할 필요
- 이상: 적은 분할로 고립

\`\`\`
정상 데이터:
┌────────────────────┐
│  ●●●●●●●●●●●●●●●   │  → 분리 어려움
│  ●●●●●●●●●●●●●●●   │
└────────────────────┘

이상치:
┌────────────────────┐
│  ●●●●●●●           │
│                 ★  │  → 한두 번 분할로 고립
└────────────────────┘
\`\`\`

## 알고리즘

\`\`\`
1. 랜덤하게 피처 선택
2. 랜덤하게 분할점 선택 (min~max 사이)
3. 재귀적으로 분할
4. 각 점의 평균 경로 길이 계산
5. 경로 짧음 → 이상치
\`\`\`

## 장점

| 장점 | 설명 |
|------|------|
| 빠름 | O(n log n) |
| 확장성 | 대용량 처리 가능 |
| 고차원 | 피처 많아도 OK |
| 밀도 무관 | 분포 가정 없음 |

## 구현

\`\`\`python
from sklearn.ensemble import IsolationForest

# 모델 생성
iso_forest = IsolationForest(
    n_estimators=100,        # 트리 수
    contamination=0.05,      # 예상 이상치 비율
    max_samples='auto',      # 샘플 수 (256 권장)
    random_state=42,
    n_jobs=-1
)

# 학습 & 예측
df['iso_pred'] = iso_forest.fit_predict(X_scaled)  # -1: 이상
df['iso_score'] = -iso_forest.decision_function(X_scaled)  # 높을수록 이상

# 결과 확인
outliers = df[df['iso_pred'] == -1]
print(f"이상치: {len(outliers)} ({len(outliers)/len(df)*100:.1f}%)")
\`\`\`
`,
      objectives: [
        'Isolation Forest의 원리를 이해한다',
        '알고리즘 동작 방식을 설명할 수 있다',
        '장단점을 파악한다'
      ],
      keyPoints: [
        '이상치는 고립시키기 쉽다',
        '경로 길이가 짧으면 이상',
        'O(n log n) 빠른 속도',
        '고차원, 대용량에 적합'
      ]
    }
  },
  {
    id: 'p2w7d3t2',
    type: 'video',
    title: 'Isolation Forest 튜닝',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# Isolation Forest 튜닝

## 주요 파라미터

\`\`\`python
from sklearn.ensemble import IsolationForest

iso_forest = IsolationForest(
    n_estimators=100,        # 트리 수 (100-200)
    contamination=0.05,      # 이상치 비율 (중요!)
    max_samples=256,         # 각 트리 샘플 수 (256 권장)
    max_features=1.0,        # 피처 비율 (1.0 = 전체)
    bootstrap=False,         # 부트스트랩 샘플링
    random_state=42
)
\`\`\`

## contamination 결정

\`\`\`python
# 방법 1: 도메인 지식
# 사기 거래: 0.1-1%
# 설비 이상: 1-5%

# 방법 2: 점수 분포 분석
iso_forest = IsolationForest(n_estimators=100, contamination='auto')
iso_forest.fit(X_scaled)
scores = -iso_forest.decision_function(X_scaled)

# 점수 분포
import matplotlib.pyplot as plt
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.hist(scores, bins=50)
plt.xlabel('Anomaly Score')
plt.title('Score Distribution')

# 백분위수로 임계값
plt.subplot(1, 2, 2)
percentiles = [90, 95, 99]
for p in percentiles:
    threshold = np.percentile(scores, p)
    plt.axvline(threshold, label=f'{p}th: {threshold:.2f}')
plt.hist(scores, bins=50)
plt.legend()
plt.title('Threshold Selection')
plt.tight_layout()
\`\`\`

## 성능 평가

\`\`\`python
from sklearn.metrics import precision_recall_curve, roc_auc_score

# ROC-AUC
y_score = -iso_forest.decision_function(X_test)
auc = roc_auc_score(y_test, y_score)
print(f"ROC-AUC: {auc:.4f}")

# Precision-Recall Curve
precision, recall, thresholds = precision_recall_curve(y_test, y_score)

plt.figure(figsize=(8, 6))
plt.plot(recall, precision)
plt.xlabel('Recall')
plt.ylabel('Precision')
plt.title(f'Precision-Recall Curve (AUC: {auc:.4f})')
plt.show()
\`\`\`

## Extended Isolation Forest

\`\`\`python
# 기존 IF: 축에 평행한 분할만
# Extended IF: 임의 각도 분할 (더 정확)

# pip install eif
from eif import iForest

eif = iForest(
    X_scaled,
    ntrees=100,
    sample_size=256,
    ExtensionLevel=1  # 0: 기존, 1+: 확장
)
scores = eif.compute_paths(X_scaled)
\`\`\`
`,
      objectives: [
        'Isolation Forest를 튜닝할 수 있다',
        'contamination을 결정할 수 있다',
        '성능을 평가할 수 있다'
      ],
      keyPoints: [
        'n_estimators: 100-200',
        'max_samples: 256 권장',
        'contamination: 도메인 지식 또는 분포 분석',
        'Extended IF: 더 정확한 분할'
      ]
    }
  },
  {
    id: 'p2w7d3t3',
    type: 'code',
    title: '실습: Isolation Forest',
    duration: 45,
    content: {
      instructions: `# Isolation Forest 실습

## 목표
Isolation Forest로 이상탐지를 수행하세요.

## 요구사항
1. Isolation Forest 학습
2. contamination 튜닝
3. 점수 분포 분석
4. 임계값 결정
5. 성능 평가
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import precision_score, recall_score, f1_score

np.random.seed(42)

# 정상 데이터 (다변량 정규분포)
n_normal = 1000
X_normal = np.random.multivariate_normal(
    mean=[0, 0, 0],
    cov=[[1, 0.5, 0.3], [0.5, 1, 0.4], [0.3, 0.4, 1]],
    size=n_normal
)

# 이상치 (균등분포, 멀리)
n_outliers = 50
X_outliers = np.random.uniform(low=[-4, -4, -4], high=[4, 4, 4], size=(n_outliers, 3))

# 합치기
X = np.vstack([X_normal, X_outliers])
y_true = np.array([0]*n_normal + [1]*n_outliers)

# 스케일링
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

df = pd.DataFrame(X_scaled, columns=['f1', 'f2', 'f3'])
df['true_outlier'] = y_true

print(f"전체: {len(df)}, 이상치: {y_true.sum()} ({y_true.mean()*100:.1f}%)")

# TODO: Isolation Forest 이상탐지
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score

np.random.seed(42)

n_normal = 1000
X_normal = np.random.multivariate_normal(
    mean=[0, 0, 0],
    cov=[[1, 0.5, 0.3], [0.5, 1, 0.4], [0.3, 0.4, 1]],
    size=n_normal
)

n_outliers = 50
X_outliers = np.random.uniform(low=[-4, -4, -4], high=[4, 4, 4], size=(n_outliers, 3))

X = np.vstack([X_normal, X_outliers])
y_true = np.array([0]*n_normal + [1]*n_outliers)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

df = pd.DataFrame(X_scaled, columns=['f1', 'f2', 'f3'])
df['true_outlier'] = y_true

# 1. Isolation Forest 학습
print("=== 1. Isolation Forest ===")
iso_forest = IsolationForest(
    n_estimators=100,
    contamination=0.05,  # 실제 비율 ~4.8%
    max_samples=256,
    random_state=42
)
iso_forest.fit(X_scaled)

df['iso_pred'] = (iso_forest.predict(X_scaled) == -1).astype(int)
df['iso_score'] = -iso_forest.decision_function(X_scaled)

print(f"탐지된 이상치: {df['iso_pred'].sum()}")

# 2. contamination 튜닝
print("\\n=== 2. Contamination 튜닝 ===")
for cont in [0.03, 0.05, 0.07, 0.10]:
    iso = IsolationForest(n_estimators=100, contamination=cont, random_state=42)
    pred = (iso.fit_predict(X_scaled) == -1).astype(int)
    prec = precision_score(y_true, pred)
    rec = recall_score(y_true, pred)
    print(f"cont={cont}: 탐지={pred.sum()}, Precision={prec:.2f}, Recall={rec:.2f}")

# 3. 점수 분포 분석
print("\\n=== 3. 점수 분포 ===")
print(f"Score range: {df['iso_score'].min():.2f} ~ {df['iso_score'].max():.2f}")
print(f"정상 평균: {df[df['true_outlier']==0]['iso_score'].mean():.3f}")
print(f"이상 평균: {df[df['true_outlier']==1]['iso_score'].mean():.3f}")

# 4. 임계값 결정
print("\\n=== 4. 임계값 분석 ===")
for p in [90, 95, 97, 99]:
    threshold = np.percentile(df['iso_score'], p)
    pred = (df['iso_score'] > threshold).astype(int)
    prec = precision_score(y_true, pred)
    rec = recall_score(y_true, pred)
    print(f"{p}th percentile ({threshold:.3f}): Precision={prec:.2f}, Recall={rec:.2f}")

# 5. 최종 성능 평가
print("\\n=== 5. 최종 성능 ===")
y_pred = df['iso_pred']
y_score = df['iso_score']

print(f"Precision: {precision_score(y_true, y_pred):.4f}")
print(f"Recall: {recall_score(y_true, y_pred):.4f}")
print(f"F1: {f1_score(y_true, y_pred):.4f}")
print(f"ROC-AUC: {roc_auc_score(y_true, y_score):.4f}")
`,
      hints: [
        'IsolationForest(contamination=0.05)',
        'decision_function()으로 점수 얻기',
        'np.percentile()로 임계값',
        'roc_auc_score(y_true, scores)'
      ]
    }
  },
  {
    id: 'p2w7d3t4',
    type: 'quiz',
    title: 'Day 3 퀴즈: Isolation Forest',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Isolation Forest에서 이상치의 경로 길이는?',
          options: ['길다', '짧다', '평균과 같다', '무작위'],
          answer: 1,
          explanation: 'Isolation Forest의 핵심 아이디어는 "이상치는 고립시키기 쉽다"입니다. 이상치는 데이터 중심에서 떨어져 있어 적은 분할(짧은 경로)로 고립되고, 정상 데이터는 많은 분할이 필요합니다.'
        },
        {
          question: 'contamination 파라미터의 의미는?',
          options: ['트리 수', '최대 깊이', '예상 이상치 비율', '샘플 수'],
          answer: 2,
          explanation: 'contamination은 데이터셋에서 예상되는 이상치 비율을 지정합니다. 이 값에 따라 decision_function의 임계값이 결정되어, 해당 비율만큼의 데이터가 이상으로 분류됩니다.'
        },
        {
          question: 'Isolation Forest의 시간 복잡도는?',
          options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'],
          answer: 1,
          explanation: 'Isolation Forest는 O(n log n) 시간 복잡도로 매우 빠릅니다. 각 트리가 랜덤 분할로 log n 깊이를 가지고, n개 샘플을 처리하기 때문입니다. 대용량 데이터에 적합합니다.'
        }
      ]
    }
  }
]
