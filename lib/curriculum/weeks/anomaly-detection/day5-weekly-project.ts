// Week 15 Day 5: Weekly Project - 사기 탐지
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'p2w7d5t1',
    type: 'reading',
    title: 'Weekly Project 가이드',
    duration: 15,
    content: {
      markdown: `# Weekly Project: 금융 사기 탐지 시스템

## 프로젝트 개요

이번 주에 배운 이상탐지 기법을 종합하여
금융 사기를 탐지하는 시스템을 구축합니다.

## 데이터셋

### Credit Card Fraud Detection (Kaggle)
- 284,807 거래 중 492건 사기 (0.17%)
- PCA 변환된 28개 피처 (V1-V28)
- Time, Amount 원본 피처
- 극심한 클래스 불균형

## 요구사항

### 1. 데이터 분석 (15%)
- 클래스 불균형 확인
- 정상 vs 사기 특성 비교
- 피처 분포 분석

### 2. 통계적 방법 (15%)
- Z-score 또는 IQR
- 베이스라인으로 사용

### 3. ML 기반 방법 (40%)
- Isolation Forest
- LOF
- Autoencoder (선택)
- 각 모델 성능 비교

### 4. 임계값 튜닝 (15%)
- Precision-Recall 트레이드오프
- 비즈니스 관점 임계값 결정

### 5. 앙상블 (15%)
- 여러 모델 조합
- AND/OR 또는 투표

## 평가 기준

| 항목 | 배점 |
|------|------|
| 데이터 분석 | 15% |
| 통계적 방법 | 15% |
| ML 기반 방법 | 40% |
| 임계값 튜닝 | 15% |
| 앙상블 | 15% |

## 중요: 평가 지표

불균형 데이터에서 **Accuracy는 무의미!**

\`\`\`
예: 99.83% 정상, 0.17% 사기
→ "모두 정상" 예측해도 Accuracy 99.83%

올바른 지표:
- Recall (재현율): 실제 사기 중 얼마나 잡았나?
- Precision (정밀도): 사기라고 한 것 중 진짜 비율?
- F1 Score: Precision과 Recall의 조화평균
- PR-AUC: Precision-Recall Curve 아래 면적
\`\`\`
`,
      externalLinks: [
        { title: 'Credit Card Fraud Dataset', url: 'https://www.kaggle.com/mlg-ulb/creditcardfraud' },
        { title: 'PyOD Library', url: 'https://pyod.readthedocs.io/' },
        { title: 'Imbalanced Learning', url: 'https://imbalanced-learn.org/' }
      ]
    }
  },
  {
    id: 'p2w7d5t2',
    type: 'code',
    title: '프로젝트 템플릿',
    duration: 90,
    content: {
      instructions: `# 사기 탐지 시스템 프로젝트

종합 이상탐지 프로젝트를 완성하세요.

## 체크리스트
- [ ] 데이터 분석 (불균형 확인)
- [ ] 통계적 방법 (Z-score/IQR)
- [ ] Isolation Forest
- [ ] LOF
- [ ] 임계값 튜닝
- [ ] 앙상블 조합
- [ ] 최종 성능 평가
`,
      starterCode: `"""
금융 사기 탐지 시스템
Week 15 Weekly Project
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.metrics import (precision_score, recall_score, f1_score,
                             roc_auc_score, precision_recall_curve,
                             confusion_matrix, classification_report)
from scipy import stats

# =============================================================================
# 1. 데이터 로드 (샘플 데이터)
# =============================================================================
print("=== 1. 데이터 로드 ===")

np.random.seed(42)

# 정상 거래 (다변량 정규분포)
n_normal = 5000
X_normal = np.random.multivariate_normal(
    mean=[0]*10,
    cov=np.eye(10) * 0.5 + 0.5 * np.ones((10, 10)) * 0.2,
    size=n_normal
)

# 사기 거래 (다른 분포, 희귀)
n_fraud = 50  # 1%
X_fraud = np.random.uniform(low=-3, high=3, size=(n_fraud, 10))

# 합치기
X = np.vstack([X_normal, X_fraud])
y = np.array([0]*n_normal + [1]*n_fraud)

# 셔플
shuffle_idx = np.random.permutation(len(X))
X = X[shuffle_idx]
y = y[shuffle_idx]

feature_names = [f'V{i+1}' for i in range(10)]
df = pd.DataFrame(X, columns=feature_names)
df['Class'] = y

print(f"전체 거래: {len(df)}")
print(f"정상: {(y==0).sum()} ({(y==0).mean()*100:.2f}%)")
print(f"사기: {(y==1).sum()} ({(y==1).mean()*100:.2f}%)")

# =============================================================================
# 2. 데이터 분석
# =============================================================================
print("\\n=== 2. 데이터 분석 ===")

# TODO: 정상 vs 사기 특성 비교

# =============================================================================
# 3. 통계적 방법 (베이스라인)
# =============================================================================
print("\\n=== 3. 통계적 방법 ===")

# TODO: Z-score 또는 IQR

# =============================================================================
# 4. ML 기반 방법
# =============================================================================
print("\\n=== 4. ML 기반 방법 ===")

# TODO: Isolation Forest, LOF

# =============================================================================
# 5. 임계값 튜닝
# =============================================================================
print("\\n=== 5. 임계값 튜닝 ===")

# TODO: Precision-Recall 트레이드오프

# =============================================================================
# 6. 앙상블
# =============================================================================
print("\\n=== 6. 앙상블 ===")

# TODO: 모델 조합
`,
      solutionCode: `"""
금융 사기 탐지 시스템 - 완성본
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.metrics import (precision_score, recall_score, f1_score,
                             roc_auc_score, classification_report)
from scipy import stats

# 1. 데이터 로드
print("=== 1. 데이터 로드 ===")
np.random.seed(42)

n_normal = 5000
X_normal = np.random.multivariate_normal(
    mean=[0]*10,
    cov=np.eye(10) * 0.5 + 0.5 * np.ones((10, 10)) * 0.2,
    size=n_normal
)

n_fraud = 50
X_fraud = np.random.uniform(low=-3, high=3, size=(n_fraud, 10))

X = np.vstack([X_normal, X_fraud])
y = np.array([0]*n_normal + [1]*n_fraud)

shuffle_idx = np.random.permutation(len(X))
X, y = X[shuffle_idx], y[shuffle_idx]

print(f"정상: {(y==0).sum()}, 사기: {(y==1).sum()} ({y.mean()*100:.2f}%)")

# 스케일링
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 2. 데이터 분석
print("\\n=== 2. 데이터 분석 ===")
normal_mean = X[y==0].mean(axis=0)
fraud_mean = X[y==1].mean(axis=0)
print(f"정상 평균 (V1-V3): {normal_mean[:3].round(3)}")
print(f"사기 평균 (V1-V3): {fraud_mean[:3].round(3)}")

# 3. 통계적 방법
print("\\n=== 3. 통계적 방법 (Z-score) ===")
z_scores = np.abs(stats.zscore(X_scaled))
z_outlier = (z_scores > 3).any(axis=1).astype(int)

print(f"Z-score 탐지: {z_outlier.sum()}")
print(f"Precision: {precision_score(y, z_outlier):.3f}")
print(f"Recall: {recall_score(y, z_outlier):.3f}")

# 4. ML 기반 방법
print("\\n=== 4. ML 기반 방법 ===")

# 4-1. Isolation Forest
print("\\n[Isolation Forest]")
iso = IsolationForest(n_estimators=100, contamination=0.01, random_state=42)
iso_pred = (iso.fit_predict(X_scaled) == -1).astype(int)
iso_score = -iso.decision_function(X_scaled)

print(f"탐지: {iso_pred.sum()}")
print(f"Precision: {precision_score(y, iso_pred):.3f}")
print(f"Recall: {recall_score(y, iso_pred):.3f}")
print(f"F1: {f1_score(y, iso_pred):.3f}")

# 4-2. LOF
print("\\n[LOF]")
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.01)
lof_pred = (lof.fit_predict(X_scaled) == -1).astype(int)
lof_score = -lof.negative_outlier_factor_

print(f"탐지: {lof_pred.sum()}")
print(f"Precision: {precision_score(y, lof_pred):.3f}")
print(f"Recall: {recall_score(y, lof_pred):.3f}")
print(f"F1: {f1_score(y, lof_pred):.3f}")

# 5. 임계값 튜닝
print("\\n=== 5. 임계값 튜닝 (Isolation Forest) ===")
for p in [95, 97, 99]:
    threshold = np.percentile(iso_score, p)
    pred = (iso_score > threshold).astype(int)
    prec = precision_score(y, pred)
    rec = recall_score(y, pred)
    f1 = f1_score(y, pred)
    print(f"{p}th: 탐지={pred.sum()}, Precision={prec:.3f}, Recall={rec:.3f}, F1={f1:.3f}")

# 6. 앙상블
print("\\n=== 6. 앙상블 ===")

# AND: 둘 다 이상이면 사기
ensemble_and = (iso_pred & lof_pred).astype(int)
print(f"[AND] 탐지: {ensemble_and.sum()}")
print(f"  Precision: {precision_score(y, ensemble_and):.3f}")
print(f"  Recall: {recall_score(y, ensemble_and):.3f}")

# OR: 하나라도 이상이면 사기
ensemble_or = (iso_pred | lof_pred).astype(int)
print(f"\\n[OR] 탐지: {ensemble_or.sum()}")
print(f"  Precision: {precision_score(y, ensemble_or):.3f}")
print(f"  Recall: {recall_score(y, ensemble_or):.3f}")

# 점수 평균
avg_score = (iso_score + lof_score) / 2
avg_threshold = np.percentile(avg_score, 99)
ensemble_avg = (avg_score > avg_threshold).astype(int)
print(f"\\n[점수 평균] 탐지: {ensemble_avg.sum()}")
print(f"  Precision: {precision_score(y, ensemble_avg):.3f}")
print(f"  Recall: {recall_score(y, ensemble_avg):.3f}")
print(f"  ROC-AUC: {roc_auc_score(y, avg_score):.3f}")

# 최종 결과
print("\\n=== 최종 결과 ===")
print("\\n비즈니스 권장:")
print("- 높은 Recall 필요 (놓치면 안됨): OR 앙상블")
print("- 높은 Precision 필요 (오탐 비용 큼): AND 앙상블")
print("- 균형: 점수 평균 + 임계값 조정")
`,
      hints: [
        'contamination=0.01 (1% 사기율)',
        '불균형 데이터에서 Accuracy 무의미',
        'AND: 높은 Precision, OR: 높은 Recall',
        'ROC-AUC로 전체 성능 비교'
      ]
    }
  },
  {
    id: 'p2w7d5t3',
    type: 'quiz',
    title: 'Week 15 종합 퀴즈',
    duration: 20,
    content: {
      questions: [
        {
          question: '불균형 데이터에서 가장 적절한 지표는?',
          options: ['Accuracy', 'MSE', 'F1 Score / Recall', 'R²'],
          answer: 2,
          explanation: '불균형 데이터에서 Accuracy는 무의미합니다. 예를 들어 99% 정상, 1% 사기 데이터에서 "모두 정상" 예측해도 Accuracy는 99%입니다. F1 Score나 Recall이 실제 사기 탐지 성능을 나타냅니다.'
        },
        {
          question: 'Isolation Forest가 다른 방법보다 좋은 이유는?',
          options: ['항상 정확', '빠르고 대용량 가능', '레이블 필요', '선형 패턴만'],
          answer: 1,
          explanation: 'Isolation Forest는 O(n log n) 시간 복잡도로 매우 빠르고, 대용량 및 고차원 데이터에서도 효과적입니다. 거리 계산이 필요한 LOF나 학습이 오래 걸리는 Autoencoder보다 확장성이 뛰어납니다.'
        },
        {
          question: 'Autoencoder에서 재구성 오차가 높으면?',
          options: ['정상', '이상치', '과적합', '학습 성공'],
          answer: 1,
          explanation: '정상 데이터로만 학습된 Autoencoder는 정상 패턴은 잘 복원하지만, 학습하지 않은 이상 패턴은 복원하지 못합니다. 따라서 재구성 오차가 높으면 이상치일 가능성이 높습니다.'
        },
        {
          question: 'LOF 점수가 1보다 훨씬 크면?',
          options: ['밀도 높음', '밀도 낮음 (이상)', '정상', '클러스터 중심'],
          answer: 1,
          explanation: 'LOF(Local Outlier Factor)는 주변 이웃 대비 지역 밀도를 측정합니다. LOF ≈ 1은 이웃과 밀도가 비슷한 정상, LOF >> 1은 이웃보다 밀도가 낮은 고립된 이상치를 의미합니다.'
        },
        {
          question: 'AND 앙상블의 특징은?',
          options: ['Recall 높음', 'Precision 높음', '모든 이상 탐지', '속도 빠름'],
          answer: 1,
          explanation: 'AND 앙상블은 여러 모델이 모두 이상으로 판단한 경우만 최종 이상으로 분류합니다. 이는 오탐(False Positive)을 줄여 Precision을 높이지만, 일부 이상치를 놓칠 수 있어 Recall은 감소합니다.'
        },
        {
          question: 'contamination 파라미터의 역할은?',
          options: ['노이즈 제거', '예상 이상치 비율', '학습률', '클러스터 수'],
          answer: 1,
          explanation: 'contamination은 데이터셋에서 예상되는 이상치 비율을 지정합니다. Isolation Forest, LOF 등에서 이 값에 따라 임계값이 결정되어 해당 비율만큼의 데이터가 이상으로 분류됩니다.'
        }
      ]
    }
  },
  {
    id: 'p2w7d5t4',
    type: 'challenge',
    title: '주간 도전과제: 멀티모델 이상탐지 대회',
    duration: 60,
    content: {
      instructions: `# 주간 도전과제: 멀티모델 이상탐지 대회

## 목표
Kaggle Credit Card Fraud 데이터셋으로 **최고 성능의 사기 탐지 시스템**을 구축하세요.

## 데이터셋
**Credit Card Fraud Detection** (Kaggle)
- https://www.kaggle.com/mlg-ulb/creditcardfraud
- 284,807 거래 중 492건 사기 (0.17%)
- PCA 변환된 28개 피처 (V1-V28)
- Time, Amount 원본 피처

## 평가 기준

### 1. 다양한 방법 적용 (40점)
| 방법 | 점수 |
|------|------|
| 통계적 방법 (Z-score/IQR/Mahalanobis) | 10점 |
| Isolation Forest | 10점 |
| LOF | 10점 |
| Autoencoder (선택) | 10점 (보너스) |

### 2. 임계값 최적화 (20점)
- Precision-Recall 트레이드오프 분석 (10점)
- 비즈니스 관점 임계값 선택 근거 (10점)

### 3. 앙상블 전략 (25점)
| 전략 | 점수 |
|------|------|
| AND 앙상블 (높은 Precision) | 8점 |
| OR 앙상블 (높은 Recall) | 8점 |
| 점수 평균/가중 평균 | 9점 |

### 4. 성능 달성 (15점)
| 지표 | 기준 |
|------|------|
| Recall ≥ 0.80 | 5점 |
| Precision ≥ 0.50 | 5점 |
| F1 Score ≥ 0.60 | 5점 |

## 제출물
1. \`fraud_detection_pipeline.py\` (전체 코드)
2. 모델별 성능 비교표 (Precision, Recall, F1, ROC-AUC)
3. 앙상블 전략 선택 근거 (마크다운)

## 도전 힌트
- 극심한 불균형: contamination=0.0017 (실제 비율)
- Accuracy는 무의미! Recall과 Precision에 집중
- 사기 탐지는 Recall이 중요 (놓치면 실제 손실)
- 하지만 너무 낮은 Precision은 운영 비용 증가
`,
      starterCode: `"""
Week 15 도전과제: 멀티모델 이상탐지 대회
Credit Card Fraud Detection
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.metrics import (precision_score, recall_score, f1_score,
                             roc_auc_score, precision_recall_curve)
from scipy import stats

# ============================================================
# 1. 데이터 로드 (Kaggle에서 다운로드 필요)
# ============================================================
# df = pd.read_csv('creditcard.csv')
# X = df.drop(['Class', 'Time'], axis=1)
# y = df['Class']

# 샘플 데이터로 테스트 (실제는 Kaggle 데이터 사용)
np.random.seed(42)
n_normal, n_fraud = 5000, 50
X_normal = np.random.multivariate_normal([0]*10, np.eye(10)*0.5, n_normal)
X_fraud = np.random.uniform(-3, 3, (n_fraud, 10))
X = np.vstack([X_normal, X_fraud])
y = np.array([0]*n_normal + [1]*n_fraud)

print(f"정상: {(y==0).sum()}, 사기: {(y==1).sum()} ({y.mean()*100:.3f}%)")

# 스케일링
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ============================================================
# 2. 통계적 방법
# ============================================================
print("\\n=== 통계적 방법 ===")

# TODO: Z-score, IQR, Mahalanobis 중 선택


# ============================================================
# 3. Isolation Forest
# ============================================================
print("\\n=== Isolation Forest ===")

# TODO: Isolation Forest 적용


# ============================================================
# 4. LOF
# ============================================================
print("\\n=== LOF ===")

# TODO: LOF 적용


# ============================================================
# 5. Autoencoder (선택)
# ============================================================
print("\\n=== Autoencoder (선택) ===")

# TODO: sklearn MLPRegressor 또는 TensorFlow로 구현


# ============================================================
# 6. 임계값 최적화
# ============================================================
print("\\n=== 임계값 최적화 ===")

# TODO: Precision-Recall 트레이드오프 분석


# ============================================================
# 7. 앙상블
# ============================================================
print("\\n=== 앙상블 ===")

# TODO: AND, OR, 점수 평균 앙상블


# ============================================================
# 8. 최종 성능 비교
# ============================================================
print("\\n=== 최종 성능 비교 ===")

# TODO: 모든 방법 성능 비교표 출력
`,
      hints: [
        'contamination=0.01 (샘플) 또는 0.0017 (실제)',
        'Isolation Forest: decision_function()으로 점수',
        'LOF: negative_outlier_factor_ (음수, 클수록 이상)',
        'Autoencoder: 재구성 오차로 이상 점수',
        'AND: 높은 Precision, OR: 높은 Recall',
        'ROC-AUC로 전체 순위 비교'
      ]
    }
  }
]
