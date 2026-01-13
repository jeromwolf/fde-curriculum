// Week 13 Day 5: Weekly Project
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'p2w5d5t1',
    type: 'reading',
    title: 'Weekly Project 가이드',
    duration: 15,
    content: {
      markdown: `# Weekly Project: 고객 이탈 예측 모델

## 프로젝트 개요

이번 주에 배운 지도학습 기법을 종합하여
고객 이탈을 예측하고 비즈니스 인사이트를 도출합니다.

## 데이터셋 선택

### 옵션 1: Telco Customer Churn (Kaggle)
- 7,043명 고객 데이터
- 20개 피처 (인구통계, 서비스, 계약)

### 옵션 2: Bank Customer Churn
- 은행 고객 이탈 데이터

### 옵션 3: 자체 데이터
- 실무 데이터 활용

## 요구사항

### 1. 데이터 전처리 (20%)
- 결측치 처리
- 범주형 인코딩
- 피처 스케일링
- sklearn Pipeline 구성

### 2. 베이스라인 (15%)
- Logistic Regression
- 성능 기록 (ROC-AUC, F1)

### 3. 앙상블 모델 (25%)
- Random Forest
- XGBoost
- LightGBM
- 5-Fold CV 비교

### 4. 하이퍼파라미터 튜닝 (20%)
- Optuna로 최적화
- 튜닝 전/후 비교

### 5. 모델 해석 (10%)
- Feature Importance
- 상위 5개 피처 분석

### 6. 비즈니스 인사이트 (10%)
- 이탈 위험 요인 정리
- 액션 플랜 제안

## 평가 기준

| 항목 | 배점 |
|------|------|
| 전처리 파이프라인 | 20% |
| 베이스라인 | 15% |
| 앙상블 모델링 | 25% |
| 튜닝 | 20% |
| 모델 해석 | 10% |
| 비즈니스 인사이트 | 10% |
`,
      externalLinks: [
        { title: 'Telco Customer Churn Dataset', url: 'https://www.kaggle.com/blastchar/telco-customer-churn' },
        { title: 'XGBoost Documentation', url: 'https://xgboost.readthedocs.io/' },
        { title: 'Optuna Tutorial', url: 'https://optuna.org/' }
      ]
    }
  },
  {
    id: 'p2w5d5t2',
    type: 'code',
    title: '프로젝트 템플릿',
    duration: 90,
    content: {
      instructions: `# 고객 이탈 예측 프로젝트

종합 지도학습 프로젝트를 완성하세요.

## 체크리스트
- [ ] 데이터 전처리 파이프라인
- [ ] 베이스라인 (Logistic)
- [ ] 앙상블 모델 (RF, XGB, LGBM)
- [ ] Optuna 튜닝
- [ ] Feature Importance
- [ ] 비즈니스 인사이트
`,
      starterCode: `"""
고객 이탈 예측 프로젝트
Week 13 Weekly Project
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import lightgbm as lgb
from sklearn.metrics import classification_report, roc_auc_score
import optuna

# =============================================================================
# 1. 데이터 로드
# =============================================================================
print("=== 1. 데이터 로드 ===")

# 샘플 데이터 생성
np.random.seed(42)
n = 3000

df = pd.DataFrame({
    'tenure': np.random.randint(1, 72, n),
    'monthly_charges': np.random.normal(65, 30, n),
    'total_charges': np.random.normal(2500, 2000, n),
    'contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], n, p=[0.5, 0.3, 0.2]),
    'payment_method': np.random.choice(['Electronic', 'Mailed', 'Bank', 'Credit'], n),
    'internet_service': np.random.choice(['DSL', 'Fiber', 'No'], n, p=[0.4, 0.4, 0.2]),
    'churn': np.random.binomial(1, 0.26, n)
})

# 이탈 패턴 추가
mask = (df['tenure'] < 12) & (df['contract'] == 'Month-to-month')
df.loc[mask, 'churn'] = np.random.binomial(1, 0.5, mask.sum())

print(f"Shape: {df.shape}")
print(f"이탈률: {df['churn'].mean():.1%}")

# =============================================================================
# 2. 데이터 전처리
# =============================================================================
print("\\n=== 2. 데이터 전처리 ===")

# TODO: 전처리 파이프라인 구성

# =============================================================================
# 3. 베이스라인 (Logistic)
# =============================================================================
print("\\n=== 3. 베이스라인 ===")

# TODO: Logistic Regression

# =============================================================================
# 4. 앙상블 모델
# =============================================================================
print("\\n=== 4. 앙상블 모델 ===")

# TODO: RF, XGBoost, LightGBM 비교

# =============================================================================
# 5. 하이퍼파라미터 튜닝
# =============================================================================
print("\\n=== 5. Optuna 튜닝 ===")

# TODO: 최고 모델 튜닝

# =============================================================================
# 6. 모델 해석 & 인사이트
# =============================================================================
print("\\n=== 6. 모델 해석 ===")

# TODO: Feature Importance, 비즈니스 인사이트
`,
      solutionCode: `"""
고객 이탈 예측 프로젝트 - 완성본
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import lightgbm as lgb
from sklearn.metrics import classification_report, roc_auc_score
import optuna
optuna.logging.set_verbosity(optuna.logging.WARNING)

# 1. 데이터 로드
print("=== 1. 데이터 로드 ===")
np.random.seed(42)
n = 3000

df = pd.DataFrame({
    'tenure': np.random.randint(1, 72, n),
    'monthly_charges': np.random.normal(65, 30, n),
    'total_charges': np.random.normal(2500, 2000, n),
    'contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], n, p=[0.5, 0.3, 0.2]),
    'payment_method': np.random.choice(['Electronic', 'Mailed', 'Bank', 'Credit'], n),
    'internet_service': np.random.choice(['DSL', 'Fiber', 'No'], n, p=[0.4, 0.4, 0.2]),
    'churn': np.random.binomial(1, 0.26, n)
})

mask = (df['tenure'] < 12) & (df['contract'] == 'Month-to-month')
df.loc[mask, 'churn'] = np.random.binomial(1, 0.5, mask.sum())

print(f"Shape: {df.shape}, 이탈률: {df['churn'].mean():.1%}")

# 2. 데이터 전처리
print("\\n=== 2. 데이터 전처리 ===")

# 피처/타겟 분리
X = df.drop('churn', axis=1)
y = df['churn']

# 컬럼 분류
num_cols = ['tenure', 'monthly_charges', 'total_charges']
cat_cols = ['contract', 'payment_method', 'internet_service']

# 전처리 파이프라인
preprocessor = ColumnTransformer([
    ('num', StandardScaler(), num_cols),
    ('cat', OneHotEncoder(drop='first', sparse_output=False), cat_cols)
])

X_processed = preprocessor.fit_transform(X)
feature_names = num_cols + list(preprocessor.named_transformers_['cat'].get_feature_names_out(cat_cols))

X_train, X_test, y_train, y_test = train_test_split(X_processed, y, test_size=0.2, random_state=42, stratify=y)
print(f"학습: {len(X_train)}, 테스트: {len(X_test)}")

# 3. 베이스라인
print("\\n=== 3. 베이스라인 (Logistic) ===")
lr = LogisticRegression(max_iter=1000, random_state=42)
lr_scores = cross_val_score(lr, X_train, y_train, cv=5, scoring='roc_auc')
print(f"CV ROC-AUC: {lr_scores.mean():.4f} (+/- {lr_scores.std()*2:.4f})")

# 4. 앙상블 모델
print("\\n=== 4. 앙상블 모델 비교 ===")
models = {
    'Logistic': LogisticRegression(max_iter=1000, random_state=42),
    'RandomForest': RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42),
    'XGBoost': xgb.XGBClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42, eval_metric='logloss'),
    'LightGBM': lgb.LGBMClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42, verbose=-1)
}

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
results = {}

for name, model in models.items():
    scores = cross_val_score(model, X_train, y_train, cv=cv, scoring='roc_auc')
    results[name] = scores.mean()
    print(f"{name:15} ROC-AUC: {scores.mean():.4f}")

best_model_name = max(results, key=results.get)
print(f"\\n최고 모델: {best_model_name}")

# 5. Optuna 튜닝
print("\\n=== 5. Optuna 튜닝 (LightGBM) ===")

def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 50, 200),
        'max_depth': trial.suggest_int('max_depth', 3, 10),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.2, log=True),
        'num_leaves': trial.suggest_int('num_leaves', 15, 50),
        'min_child_samples': trial.suggest_int('min_child_samples', 10, 50)
    }
    model = lgb.LGBMClassifier(**params, random_state=42, verbose=-1)
    return cross_val_score(model, X_train, y_train, cv=5, scoring='roc_auc').mean()

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=30, show_progress_bar=False)

print(f"Best CV Score: {study.best_value:.4f}")
print(f"개선: {(study.best_value - results['LightGBM'])*100:.2f}%p")

# 6. 최종 모델 & 해석
print("\\n=== 6. 최종 모델 & 해석 ===")
final_model = lgb.LGBMClassifier(**study.best_params, random_state=42, verbose=-1)
final_model.fit(X_train, y_train)

y_pred = final_model.predict(X_test)
y_prob = final_model.predict_proba(X_test)[:, 1]
print(f"테스트 ROC-AUC: {roc_auc_score(y_test, y_prob):.4f}")
print(f"\\n{classification_report(y_test, y_pred)}")

# Feature Importance
importance = pd.DataFrame({
    'feature': feature_names,
    'importance': final_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\\n=== Feature Importance (상위 5) ===")
print(importance.head())

print("\\n=== 비즈니스 인사이트 ===")
print("""
1. tenure(가입 기간)가 가장 중요 → 신규 고객 온보딩 강화
2. contract_Month-to-month → 장기 계약 전환 인센티브
3. monthly_charges → 가격 민감 고객 세그먼트 관리

액션 플랜:
- 가입 첫 12개월 집중 케어 프로그램
- 연간 계약 전환 시 20% 할인 프로모션
- 고위험군 고객 선제적 CS 연락
""")
`,
      hints: [
        'ColumnTransformer로 수치형/범주형 분리 처리',
        'StratifiedKFold로 클래스 비율 유지',
        'study.best_params로 최적 파라미터 접근',
        '비즈니스 인사이트는 실행 가능해야 함'
      ]
    }
  },
  {
    id: 'p2w5d5t3',
    type: 'quiz',
    title: 'Week 13 종합 퀴즈',
    duration: 20,
    content: {
      questions: [
        {
          question: '가설 기반 분석의 첫 단계는?',
          options: ['모델 학습', '문제 정의', '데이터 수집', '평가'],
          answer: 1
        },
        {
          question: '상관관계 0.9가 의미하는 것은?',
          options: ['인과관계 있음', '두 변수가 함께 변함', '원인-결과 확실', '모델 성능 90%'],
          answer: 1
        },
        {
          question: '불균형 데이터에서 권장되는 지표는?',
          options: ['Accuracy', 'F1 Score', 'MSE', 'R²'],
          answer: 1
        },
        {
          question: 'LightGBM의 장점은?',
          options: ['해석 가능성', '빠른 속도와 대용량 처리', '규제 효과', '선형 관계 학습'],
          answer: 1
        },
        {
          question: 'Lasso 규제의 효과는?',
          options: ['계수 증가', '피처 선택 (일부 계수 0)', '과적합 증가', '학습 속도 향상'],
          answer: 1,
          explanation: 'Lasso(L1 규제)는 일부 계수를 정확히 0으로 만들어 자동 피처 선택 효과가 있습니다. 불필요한 피처를 제거하여 모델을 단순화합니다.'
        },
        {
          question: 'Optuna의 장점이 아닌 것은?',
          options: ['Bayesian Optimization', 'Pruning', '완전 탐색 보장', '시각화'],
          answer: 2,
          explanation: 'Optuna는 효율적인 탐색을 위해 Bayesian Optimization을 사용하므로 완전 탐색은 보장하지 않습니다. 대신 유망한 영역을 집중 탐색합니다.'
        }
      ]
    }
  },
  {
    id: 'p2w5d5t4',
    type: 'challenge',
    title: '주간 도전과제: Kaggle Tabular 경쟁',
    duration: 60,
    content: {
      instructions: `# 주간 도전과제: Kaggle Tabular 분류 경쟁

## 목표
Kaggle Tabular 데이터셋에서 이번 주 배운 모든 기법을 종합하여 최고 성능을 달성하세요.

## 추천 데이터셋

### 옵션 1: Spaceship Titanic (권장)
- 13개 피처, 8,700 샘플
- 이진 분류 (승객 운송 예측)
- 혼합형 데이터 (수치형 + 범주형)
- URL: kaggle.com/c/spaceship-titanic

### 옵션 2: Playground Series
- 매달 새로운 Tabular 대회
- 다양한 도메인 경험

### 옵션 3: Home Credit Default Risk
- 고급 피처 엔지니어링 필요
- 실제 금융 데이터

## 요구사항

### 1. 전체 파이프라인 구축 (25점)
- 데이터 전처리 (결측치, 인코딩, 스케일링)
- sklearn Pipeline 사용
- 재현 가능한 코드

### 2. 다양한 모델 비교 (25점)
- Logistic Regression (베이스라인)
- Random Forest
- XGBoost / LightGBM
- 5-Fold CV 성능 비교

### 3. 하이퍼파라미터 튜닝 (25점)
- Optuna로 최적화 (최소 50 trials)
- 튜닝 전/후 성능 비교
- 시각화 (파라미터 중요도 등)

### 4. 최종 제출 & 분석 (25점)
- Kaggle 제출 및 순위 기록
- 모델 해석 (Feature Importance)
- 개선 방향 제시

## 평가 기준

| 항목 | 점수 |
|------|------|
| 파이프라인 품질 | 25점 |
| 모델 비교 분석 | 25점 |
| 튜닝 효과 | 25점 |
| 제출 & 인사이트 | 25점 |

## 보너스 포인트
- 상위 25% 진입: +15점
- Stacking/Blending 앙상블: +10점
- 노트북 공개 & 피드백 수집: +5점

## 제출물
1. 코드 (Jupyter Notebook 또는 Python)
2. 결과 리포트 (마크다운)
3. Kaggle 제출 스크린샷

## 참고 자료
- Kaggle Learn: Machine Learning 코스
- XGBoost/LightGBM 공식 문서
- Optuna 튜토리얼
`,
      starterCode: `"""
Week 13 주간 도전과제: Kaggle Tabular 경쟁
Spaceship Titanic 데이터셋
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
import xgboost as xgb
import lightgbm as lgb
from sklearn.metrics import classification_report, roc_auc_score, accuracy_score
import optuna
import warnings
warnings.filterwarnings('ignore')
optuna.logging.set_verbosity(optuna.logging.WARNING)

# =============================================================================
# 1. 데이터 로드 (Kaggle에서 다운로드 필요)
# =============================================================================
print("=== 1. 데이터 로드 ===")

# Kaggle 데이터 로드 (실제 파일 경로로 수정)
# train = pd.read_csv('spaceship-titanic/train.csv')
# test = pd.read_csv('spaceship-titanic/test.csv')

# 데모용 합성 데이터
np.random.seed(42)
n = 5000

df = pd.DataFrame({
    'HomePlanet': np.random.choice(['Earth', 'Europa', 'Mars', None], n, p=[0.5, 0.25, 0.2, 0.05]),
    'CryoSleep': np.random.choice([True, False, None], n, p=[0.3, 0.65, 0.05]),
    'Destination': np.random.choice(['TRAPPIST-1e', 'PSO J318.5-22', '55 Cancri e'], n),
    'Age': np.random.normal(30, 15, n).clip(0, 80),
    'VIP': np.random.choice([True, False], n, p=[0.1, 0.9]),
    'RoomService': np.random.exponential(200, n),
    'FoodCourt': np.random.exponential(300, n),
    'ShoppingMall': np.random.exponential(150, n),
    'Spa': np.random.exponential(250, n),
    'VRDeck': np.random.exponential(200, n),
})

# 타겟 생성 (일부 패턴 포함)
df['Transported'] = (
    (df['CryoSleep'] == True) * 0.3 +
    (df['Age'] < 25) * 0.2 +
    (df['RoomService'] < 100) * 0.2 +
    np.random.randn(n) * 0.3 > 0
).astype(int)

print(f"Shape: {df.shape}")
print(f"Transported 비율: {df['Transported'].mean():.1%}")

# =============================================================================
# 2. 데이터 전처리
# =============================================================================
print("\\n=== 2. 데이터 전처리 ===")

# TODO: 결측치 분석
# TODO: 수치형/범주형 분리
# TODO: 전처리 파이프라인 구축

# =============================================================================
# 3. 베이스라인 & 모델 비교
# =============================================================================
print("\\n=== 3. 모델 비교 ===")

# TODO: Logistic, RF, XGBoost, LightGBM 비교

# =============================================================================
# 4. Optuna 튜닝
# =============================================================================
print("\\n=== 4. Optuna 튜닝 ===")

# TODO: 최고 모델 튜닝 (50+ trials)

# =============================================================================
# 5. 최종 모델 & 분석
# =============================================================================
print("\\n=== 5. 최종 모델 ===")

# TODO: Feature Importance
# TODO: 예측 & Kaggle 제출 파일 생성

print("\\n도전과제 완료!")
`,
      hints: [
        'CryoSleep가 중요 피처 - True면 Transported 확률 높음',
        'RoomService 등 지출 피처 합산하여 새 피처 생성 고려',
        'ColumnTransformer로 수치형/범주형 분리 처리',
        'StratifiedKFold로 클래스 비율 유지'
      ]
    }
  }
]
