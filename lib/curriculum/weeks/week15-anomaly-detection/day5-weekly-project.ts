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
          answer: 2
        },
        {
          question: 'Isolation Forest가 다른 방법보다 좋은 이유는?',
          options: ['항상 정확', '빠르고 대용량 가능', '레이블 필요', '선형 패턴만'],
          answer: 1
        },
        {
          question: 'Autoencoder에서 재구성 오차가 높으면?',
          options: ['정상', '이상치', '과적합', '학습 성공'],
          answer: 1
        },
        {
          question: 'LOF 점수가 1보다 훨씬 크면?',
          options: ['밀도 높음', '밀도 낮음 (이상)', '정상', '클러스터 중심'],
          answer: 1
        },
        {
          question: 'AND 앙상블의 특징은?',
          options: ['Recall 높음', 'Precision 높음', '모든 이상 탐지', '속도 빠름'],
          answer: 1
        },
        {
          question: 'contamination 파라미터의 역할은?',
          options: ['노이즈 제거', '예상 이상치 비율', '학습률', '클러스터 수'],
          answer: 1
        }
      ]
    }
  }
]
