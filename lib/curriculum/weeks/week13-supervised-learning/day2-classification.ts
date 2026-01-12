// Week 13 Day 2: 분류 알고리즘
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'p2w5d2t1',
    type: 'video',
    title: '분류 알고리즘 개요',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 분류 알고리즘 (Classification)

## 분류 문제란?

타겟 변수가 범주형일 때 사용하는 지도학습
- 이진 분류: 이탈/유지, 사기/정상, 클릭/미클릭
- 다중 분류: 고객 등급 (Gold/Silver/Bronze), 상품 카테고리

## 주요 분류 알고리즘

### 1. Logistic Regression (베이스라인)

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# 데이터 분할
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 모델 학습
lr = LogisticRegression(
    max_iter=1000,
    random_state=42,
    class_weight='balanced'  # 불균형 데이터 처리
)
lr.fit(X_train, y_train)

# 예측
y_pred = lr.predict(X_test)
y_prob = lr.predict_proba(X_test)[:, 1]

# 계수 해석
coef_df = pd.DataFrame({
    'feature': X.columns,
    'coefficient': lr.coef_[0]
}).sort_values('coefficient', key=abs, ascending=False)
\`\`\`

### 2. Random Forest

\`\`\`python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=100,      # 트리 수
    max_depth=10,          # 최대 깊이
    min_samples_split=5,   # 분할 최소 샘플
    min_samples_leaf=2,    # 리프 최소 샘플
    random_state=42,
    n_jobs=-1              # 병렬 처리
)
rf.fit(X_train, y_train)

# Feature Importance
importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)
\`\`\`

### 3. XGBoost

\`\`\`python
import xgboost as xgb

xgb_model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,           # 샘플링 비율
    colsample_bytree=0.8,    # 피처 샘플링
    random_state=42,
    use_label_encoder=False,
    eval_metric='logloss'
)
xgb_model.fit(X_train, y_train)

# 또는 조기 종료 사용
xgb_model.fit(
    X_train, y_train,
    eval_set=[(X_val, y_val)],
    early_stopping_rounds=10,
    verbose=False
)
\`\`\`

### 4. LightGBM (가장 빠름)

\`\`\`python
import lightgbm as lgb

lgb_model = lgb.LGBMClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    num_leaves=31,           # 2^max_depth보다 작게
    random_state=42,
    n_jobs=-1
)
lgb_model.fit(X_train, y_train)
\`\`\`

## 알고리즘 비교

| 알고리즘 | 장점 | 단점 | 사용 시점 |
|----------|------|------|----------|
| Logistic | 해석 가능, 빠름 | 비선형 한계 | 베이스라인 |
| Random Forest | 과적합 방지, 안정 | 느림, 메모리 | 범용 |
| XGBoost | 높은 성능 | 튜닝 필요 | 대회, 프로덕션 |
| LightGBM | 매우 빠름, 대용량 | 과적합 주의 | 대용량 데이터 |
`,
      objectives: [
        '주요 분류 알고리즘을 이해한다',
        '각 알고리즘의 장단점을 파악한다',
        '상황에 맞는 알고리즘을 선택할 수 있다'
      ],
      keyPoints: [
        'Logistic: 베이스라인, 해석 가능',
        'Random Forest: 안정적, 범용',
        'XGBoost/LightGBM: 고성능',
        'LightGBM: 대용량 데이터에 최적'
      ]
    }
  },
  {
    id: 'p2w5d2t2',
    type: 'video',
    title: '모델 평가 지표',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 분류 모델 평가 지표

## 혼동 행렬 (Confusion Matrix)

\`\`\`
              예측
           Positive  Negative
실제 Positive   TP        FN
     Negative   FP        TN

TP: True Positive (정탐)
FP: False Positive (오탐, Type I Error)
FN: False Negative (미탐, Type II Error)
TN: True Negative (정탐)
\`\`\`

## 주요 지표

\`\`\`python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, classification_report,
    confusion_matrix, ConfusionMatrixDisplay
)

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

# Accuracy: 전체 정확도
accuracy = accuracy_score(y_test, y_pred)

# Precision: 예측 Positive 중 실제 Positive 비율
# "Positive라고 예측한 것 중 얼마나 맞았나?"
precision = precision_score(y_test, y_pred)

# Recall (Sensitivity): 실제 Positive 중 예측 Positive 비율
# "실제 Positive를 얼마나 찾았나?"
recall = recall_score(y_test, y_pred)

# F1 Score: Precision과 Recall의 조화 평균
f1 = f1_score(y_test, y_pred)

# ROC-AUC: 임계값 독립적 성능
roc_auc = roc_auc_score(y_test, y_prob)

print(classification_report(y_test, y_pred))
\`\`\`

## 언제 어떤 지표를 사용하나?

\`\`\`
┌────────────────────────────────────────────────────────────┐
│ 상황별 지표 선택                                            │
├────────────────────────────────────────────────────────────┤
│ 클래스 균형 + 오류 비용 동일 → Accuracy, F1               │
│ 클래스 불균형 → F1, ROC-AUC                                │
│ FN 비용 큼 (암 진단, 사기 탐지) → Recall 중시              │
│ FP 비용 큼 (스팸 필터) → Precision 중시                    │
│ 임계값 조정 필요 → ROC-AUC, PR-AUC                        │
└────────────────────────────────────────────────────────────┘
\`\`\`

## 시각화

\`\`\`python
import matplotlib.pyplot as plt
from sklearn.metrics import RocCurveDisplay, PrecisionRecallDisplay

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# 1. Confusion Matrix
ConfusionMatrixDisplay.from_predictions(y_test, y_pred, ax=axes[0])
axes[0].set_title('Confusion Matrix')

# 2. ROC Curve
RocCurveDisplay.from_predictions(y_test, y_prob, ax=axes[1])
axes[1].set_title('ROC Curve')

# 3. Precision-Recall Curve
PrecisionRecallDisplay.from_predictions(y_test, y_prob, ax=axes[2])
axes[2].set_title('Precision-Recall Curve')

plt.tight_layout()
\`\`\`
`,
      objectives: [
        '혼동 행렬을 해석할 수 있다',
        'Precision, Recall, F1의 차이를 이해한다',
        '상황에 맞는 평가 지표를 선택할 수 있다'
      ],
      keyPoints: [
        '불균형 데이터: F1, ROC-AUC',
        'FN 비용 큼: Recall 중시',
        'FP 비용 큼: Precision 중시',
        'ROC-AUC: 임계값 독립적'
      ]
    }
  },
  {
    id: 'p2w5d2t3',
    type: 'code',
    title: '실습: 고객 이탈 예측 모델',
    duration: 45,
    content: {
      instructions: `# 분류 모델 실습

## 목표
여러 분류 알고리즘을 비교하고 최적 모델을 선택하세요.

## 요구사항
1. 데이터 전처리 (스케일링, 인코딩)
2. 베이스라인: Logistic Regression
3. 앙상블: Random Forest, XGBoost, LightGBM
4. 5-Fold CV로 성능 비교
5. 최종 모델 선택 및 근거
`,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import lightgbm as lgb
from sklearn.metrics import classification_report, roc_auc_score

# 샘플 데이터 생성
np.random.seed(42)
n = 2000

df = pd.DataFrame({
    'tenure': np.random.randint(1, 72, n),
    'monthly_charges': np.random.normal(65, 30, n),
    'total_charges': np.random.normal(2000, 1500, n),
    'contract_type': np.random.choice([0, 1, 2], n, p=[0.5, 0.3, 0.2]),
    'payment_method': np.random.choice([0, 1, 2, 3], n),
    'churn': np.random.binomial(1, 0.26, n)
})

# 이탈 패턴 추가
df.loc[(df['tenure'] < 12) & (df['contract_type'] == 0), 'churn'] = np.random.binomial(1, 0.45, sum((df['tenure'] < 12) & (df['contract_type'] == 0)))

X = df.drop('churn', axis=1)
y = df['churn']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print(f"학습 데이터: {len(X_train)}, 테스트: {len(X_test)}")
print(f"이탈률: {y.mean():.1%}")

# TODO: 모델 학습 및 비교
`,
      solutionCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import lightgbm as lgb
from sklearn.metrics import classification_report, roc_auc_score

np.random.seed(42)
n = 2000

df = pd.DataFrame({
    'tenure': np.random.randint(1, 72, n),
    'monthly_charges': np.random.normal(65, 30, n),
    'total_charges': np.random.normal(2000, 1500, n),
    'contract_type': np.random.choice([0, 1, 2], n, p=[0.5, 0.3, 0.2]),
    'payment_method': np.random.choice([0, 1, 2, 3], n),
    'churn': np.random.binomial(1, 0.26, n)
})

df.loc[(df['tenure'] < 12) & (df['contract_type'] == 0), 'churn'] = np.random.binomial(1, 0.45, sum((df['tenure'] < 12) & (df['contract_type'] == 0)))

X = df.drop('churn', axis=1)
y = df['churn']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# 스케일링
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 모델 정의
models = {
    'Logistic': LogisticRegression(max_iter=1000, random_state=42),
    'RandomForest': RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42),
    'XGBoost': xgb.XGBClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42, use_label_encoder=False, eval_metric='logloss'),
    'LightGBM': lgb.LGBMClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42, verbose=-1)
}

# 교차 검증
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
results = {}

print("=== 5-Fold 교차 검증 결과 ===\\n")
for name, model in models.items():
    # Logistic은 스케일링된 데이터
    X_cv = X_train_scaled if name == 'Logistic' else X_train

    scores = cross_val_score(model, X_cv, y_train, cv=cv, scoring='roc_auc')
    results[name] = {
        'mean': scores.mean(),
        'std': scores.std()
    }
    print(f"{name:15} ROC-AUC: {scores.mean():.4f} (+/- {scores.std()*2:.4f})")

# 최고 모델로 테스트 평가
print("\\n=== 테스트 데이터 평가 (LightGBM) ===")
best_model = models['LightGBM']
best_model.fit(X_train, y_train)

y_pred = best_model.predict(X_test)
y_prob = best_model.predict_proba(X_test)[:, 1]

print(f"\\nROC-AUC: {roc_auc_score(y_test, y_prob):.4f}")
print(f"\\n{classification_report(y_test, y_pred)}")

# Feature Importance
print("\\n=== Feature Importance ===")
importance = pd.DataFrame({
    'feature': X.columns,
    'importance': best_model.feature_importances_
}).sort_values('importance', ascending=False)
print(importance)
`,
      hints: [
        'cross_val_score(model, X, y, cv=5, scoring="roc_auc")',
        'Logistic Regression은 스케일링 필요',
        'StratifiedKFold로 클래스 비율 유지',
        'LightGBM은 verbose=-1로 경고 숨김'
      ]
    }
  },
  {
    id: 'p2w5d2t4',
    type: 'quiz',
    title: 'Day 2 퀴즈: 분류 알고리즘',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Recall이 중요한 상황은?',
          options: ['스팸 필터', '암 진단', '추천 시스템', '클릭률 예측'],
          answer: 1
        },
        {
          question: 'LightGBM의 주요 장점은?',
          options: ['해석 가능성', '빠른 속도와 대용량 처리', '과적합 방지', '선형 관계 학습'],
          answer: 1
        },
        {
          question: '불균형 데이터에서 적합하지 않은 지표는?',
          options: ['Accuracy', 'F1 Score', 'ROC-AUC', 'Recall'],
          answer: 0
        },
        {
          question: 'class_weight="balanced"의 역할은?',
          options: ['학습 속도 향상', '소수 클래스 가중치 증가', '과적합 방지', '피처 선택'],
          answer: 1
        }
      ]
    }
  }
]
