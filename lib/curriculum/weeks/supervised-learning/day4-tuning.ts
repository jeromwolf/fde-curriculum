// Week 13 Day 4: 하이퍼파라미터 튜닝
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'p2w5d4t1',
    type: 'video',
    title: '하이퍼파라미터 튜닝 전략',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 하이퍼파라미터 튜닝

## 하이퍼파라미터란?

모델 학습 전에 설정하는 값
- n_estimators, max_depth, learning_rate 등
- 데이터로부터 학습되지 않음
- 성능에 큰 영향

## 튜닝 방법

### 1. Grid Search

\`\`\`python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 5, 7, 10],
    'learning_rate': [0.01, 0.1, 0.3]
}

grid_search = GridSearchCV(
    estimator=xgb.XGBClassifier(random_state=42),
    param_grid=param_grid,
    cv=5,
    scoring='roc_auc',
    n_jobs=-1,
    verbose=1
)
grid_search.fit(X_train, y_train)

print(f"Best params: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.4f}")
\`\`\`

### 2. Random Search

\`\`\`python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint, uniform

param_dist = {
    'n_estimators': randint(50, 300),
    'max_depth': randint(3, 15),
    'learning_rate': uniform(0.01, 0.3),
    'subsample': uniform(0.6, 0.4),
    'colsample_bytree': uniform(0.6, 0.4)
}

random_search = RandomizedSearchCV(
    estimator=xgb.XGBClassifier(random_state=42),
    param_distributions=param_dist,
    n_iter=50,  # 시도 횟수
    cv=5,
    scoring='roc_auc',
    random_state=42,
    n_jobs=-1
)
random_search.fit(X_train, y_train)
\`\`\`

### 3. Optuna (권장)

\`\`\`python
import optuna

def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 50, 300),
        'max_depth': trial.suggest_int('max_depth', 3, 15),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
        'subsample': trial.suggest_float('subsample', 0.6, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
        'min_child_weight': trial.suggest_int('min_child_weight', 1, 10)
    }

    model = lgb.LGBMClassifier(**params, random_state=42, verbose=-1)

    # 교차 검증
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='roc_auc')
    return cv_scores.mean()

# 최적화 실행
study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=100, show_progress_bar=True)

print(f"Best params: {study.best_params}")
print(f"Best score: {study.best_value:.4f}")

# 최적 파라미터로 모델 학습
best_model = lgb.LGBMClassifier(**study.best_params, random_state=42)
best_model.fit(X_train, y_train)
\`\`\`

## 튜닝 방법 비교

| 방법 | 장점 | 단점 | 사용 시점 |
|------|------|------|----------|
| Grid Search | 완전 탐색 | 느림, 조합 폭발 | 파라미터 적을 때 |
| Random Search | 효율적 | 최적 보장 안됨 | 빠른 탐색 |
| Optuna | 효율적, 조기종료 | 설정 필요 | 대부분 상황 |

## Optuna 고급 기능

\`\`\`python
# Pruning (비효율적 시행 조기 종료)
def objective_with_pruning(trial):
    params = {...}
    model = lgb.LGBMClassifier(**params)

    # 조기 종료 콜백
    pruning_callback = optuna.integration.LightGBMPruningCallback(
        trial, 'auc'
    )

    model.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        callbacks=[pruning_callback]
    )

    return model.best_score_['valid_0']['auc']

# 시각화
optuna.visualization.plot_optimization_history(study)
optuna.visualization.plot_param_importances(study)
\`\`\`
`,
      objectives: [
        '하이퍼파라미터 튜닝 방법을 이해한다',
        'Grid Search vs Random Search 차이를 안다',
        'Optuna를 사용한 효율적 튜닝을 수행할 수 있다'
      ],
      keyPoints: [
        'Grid Search: 완전 탐색, 느림',
        'Random Search: 효율적, 빠름',
        'Optuna: Bayesian Optimization, 가장 효율적',
        'Pruning으로 비효율적 시행 조기 종료'
      ]
    }
  },
  {
    id: 'p2w5d4t2',
    type: 'code',
    title: '실습: Optuna 튜닝',
    duration: 40,
    content: {
      instructions: `# Optuna 하이퍼파라미터 튜닝 실습

## 목표
Optuna로 LightGBM 모델을 최적화하세요.

## 요구사항
1. objective 함수 정의
2. 50회 시행으로 최적화
3. 최적 파라미터 확인
4. 튜닝 전/후 성능 비교
`,
      starterCode: `import pandas as pd
import numpy as np
import optuna
import lightgbm as lgb
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import roc_auc_score

# 데이터 준비
np.random.seed(42)
n = 2000

df = pd.DataFrame({
    'feature_' + str(i): np.random.randn(n) for i in range(20)
})
df['target'] = (df['feature_0'] + df['feature_1'] * 2 + np.random.randn(n) * 0.5 > 0).astype(int)

X = df.drop('target', axis=1)
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"학습: {len(X_train)}, 테스트: {len(X_test)}")

# 베이스라인
baseline = lgb.LGBMClassifier(random_state=42, verbose=-1)
baseline.fit(X_train, y_train)
baseline_score = roc_auc_score(y_test, baseline.predict_proba(X_test)[:, 1])
print(f"\\n베이스라인 ROC-AUC: {baseline_score:.4f}")

# TODO: Optuna 튜닝
`,
      solutionCode: `import pandas as pd
import numpy as np
import optuna
import lightgbm as lgb
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import roc_auc_score

optuna.logging.set_verbosity(optuna.logging.WARNING)

np.random.seed(42)
n = 2000

df = pd.DataFrame({
    'feature_' + str(i): np.random.randn(n) for i in range(20)
})
df['target'] = (df['feature_0'] + df['feature_1'] * 2 + np.random.randn(n) * 0.5 > 0).astype(int)

X = df.drop('target', axis=1)
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 베이스라인
baseline = lgb.LGBMClassifier(random_state=42, verbose=-1)
baseline.fit(X_train, y_train)
baseline_score = roc_auc_score(y_test, baseline.predict_proba(X_test)[:, 1])
print(f"베이스라인 ROC-AUC: {baseline_score:.4f}")

# Optuna objective
def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 50, 300),
        'max_depth': trial.suggest_int('max_depth', 3, 12),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
        'num_leaves': trial.suggest_int('num_leaves', 10, 100),
        'min_child_samples': trial.suggest_int('min_child_samples', 5, 50),
        'subsample': trial.suggest_float('subsample', 0.6, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
        'reg_alpha': trial.suggest_float('reg_alpha', 1e-8, 10.0, log=True),
        'reg_lambda': trial.suggest_float('reg_lambda', 1e-8, 10.0, log=True)
    }

    model = lgb.LGBMClassifier(**params, random_state=42, verbose=-1)
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='roc_auc')
    return cv_scores.mean()

# 최적화 실행
print("\\nOptuna 최적화 시작...")
study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=50, show_progress_bar=False)

print(f"\\n=== 최적 파라미터 ===")
for key, value in study.best_params.items():
    print(f"  {key}: {value}")
print(f"\\nCV Best Score: {study.best_value:.4f}")

# 최적 모델 학습
best_model = lgb.LGBMClassifier(**study.best_params, random_state=42, verbose=-1)
best_model.fit(X_train, y_train)
tuned_score = roc_auc_score(y_test, best_model.predict_proba(X_test)[:, 1])

print(f"\\n=== 성능 비교 ===")
print(f"베이스라인: {baseline_score:.4f}")
print(f"튜닝 후:   {tuned_score:.4f}")
print(f"개선:      {(tuned_score - baseline_score) * 100:.2f}%p")
`,
      hints: [
        'trial.suggest_int(), trial.suggest_float() 사용',
        'log=True로 로그 스케일 탐색',
        'study.best_params로 최적 파라미터 접근',
        'optuna.logging.set_verbosity()로 출력 조절'
      ]
    }
  },
  {
    id: 'p2w5d4t3',
    type: 'quiz',
    title: 'Day 4 퀴즈: 튜닝',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Grid Search의 단점은?',
          options: ['최적해 못 찾음', '조합 폭발로 느림', '병렬 처리 불가', '교차 검증 불가'],
          answer: 1,
          explanation: 'Grid Search는 모든 조합을 시도하므로 파라미터가 늘어날수록 기하급수적으로 느려집니다. 예: 3개 파라미터 × 4값 = 64번, 5개 × 5값 = 3,125번'
        },
        {
          question: 'Optuna의 장점이 아닌 것은?',
          options: ['Bayesian Optimization', 'Pruning 지원', '완전 탐색 보장', '시각화 지원'],
          answer: 2,
          explanation: 'Optuna는 Bayesian Optimization을 사용해 효율적으로 탐색하지만, 완전 탐색은 하지 않습니다. 대신 유망한 영역에 집중하여 더 빠르게 좋은 결과를 찾습니다.'
        },
        {
          question: 'learning_rate에 log=True를 쓰는 이유는?',
          options: ['속도 향상', '0.01~0.1 범위 집중 탐색', '음수 방지', '정수 변환'],
          answer: 1,
          explanation: 'learning_rate는 보통 0.001~0.3 범위에서 작은 값들이 더 중요합니다. log=True로 설정하면 로그 스케일로 탐색하여 0.01~0.1 범위를 더 집중적으로 탐색합니다.'
        }
      ]
    }
  },
  {
    id: 'p2w5d4t4',
    type: 'video',
    title: 'Optuna 고급 기능과 시각화',
    duration: 18,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# Optuna 고급 기능과 시각화

## 1. Pruning (조기 종료)

비효율적인 시행을 중간에 종료하여 시간 절약

\`\`\`python
import optuna
from optuna.integration import LightGBMPruningCallback

def objective(trial):
    params = {
        'n_estimators': 1000,  # 많이 설정
        'max_depth': trial.suggest_int('max_depth', 3, 12),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
    }

    model = lgb.LGBMClassifier(**params, random_state=42, verbose=-1)

    # Pruning 콜백
    pruning_callback = LightGBMPruningCallback(trial, 'auc')

    model.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        callbacks=[
            pruning_callback,
            lgb.early_stopping(50)
        ]
    )

    return model.best_score_['valid_0']['auc']

# Pruner 설정
study = optuna.create_study(
    direction='maximize',
    pruner=optuna.pruners.MedianPruner(n_warmup_steps=10)
)
study.optimize(objective, n_trials=100)
\`\`\`

## 2. 시각화 기능

\`\`\`python
import optuna.visualization as vis

# 최적화 히스토리
fig = vis.plot_optimization_history(study)
fig.show()

# 파라미터 중요도
fig = vis.plot_param_importances(study)
fig.show()

# 파라미터 관계 (Contour)
fig = vis.plot_contour(study, params=['max_depth', 'learning_rate'])
fig.show()

# 슬라이스 플롯
fig = vis.plot_slice(study)
fig.show()

# 병렬 좌표
fig = vis.plot_parallel_coordinate(study)
fig.show()
\`\`\`

## 3. Study 저장/로드

\`\`\`python
import optuna

# SQLite에 저장
study = optuna.create_study(
    study_name='my-study',
    storage='sqlite:///optuna.db',
    direction='maximize',
    load_if_exists=True
)

# 이어서 최적화
study.optimize(objective, n_trials=50)

# 나중에 로드
loaded_study = optuna.load_study(
    study_name='my-study',
    storage='sqlite:///optuna.db'
)
print(f"Best params: {loaded_study.best_params}")
\`\`\`

## 4. Multi-Objective Optimization

\`\`\`python
def multi_objective(trial):
    params = {...}
    model = lgb.LGBMClassifier(**params)
    model.fit(X_train, y_train)

    # 두 가지 목표: 정확도 최대화, 학습 시간 최소화
    accuracy = cross_val_score(model, X_val, y_val, cv=3).mean()
    train_time = ...

    return accuracy, -train_time  # 둘 다 maximize

study = optuna.create_study(directions=['maximize', 'maximize'])
study.optimize(multi_objective, n_trials=50)

# Pareto front
for trial in study.best_trials:
    print(trial.values)
\`\`\`
`,
      objectives: [
        'Optuna Pruning으로 효율적 튜닝을 수행한다',
        'Study 시각화로 인사이트를 얻는다',
        'Study를 저장/로드하여 재사용한다'
      ],
      keyPoints: [
        'Pruning: 비효율적 시행 조기 종료',
        'plot_param_importances: 중요 파라미터 파악',
        'SQLite 저장으로 재사용 가능',
        'Multi-Objective로 여러 목표 동시 최적화'
      ]
    }
  },
  {
    id: 'p2w5d4t5',
    type: 'challenge',
    title: '도전과제: 튜닝 벤치마크',
    duration: 30,
    content: {
      instructions: `# 도전과제: 하이퍼파라미터 튜닝 벤치마크

## 목표
여러 튜닝 방법을 비교하여 효율성과 성능을 분석하세요.

## 요구사항

### 1. 3가지 튜닝 방법 비교
- Grid Search (소규모 그리드)
- Random Search (50 iterations)
- Optuna (50 trials)

### 2. 측정 지표
- 최종 성능 (ROC-AUC)
- 실행 시간 (초)
- 탐색 효율성 (성능/시간)

### 3. 분석 리포트
- 방법별 성능 비교 테이블
- 최적화 히스토리 비교 (가능한 경우)
- 어떤 상황에 어떤 방법이 적합한지 결론

## 평가 기준

| 항목 | 점수 |
|------|------|
| 구현 완성도 | 40점 |
| 분석 깊이 | 30점 |
| 결론 타당성 | 30점 |

## 보너스
- Optuna Pruning 적용: +10점
- 시각화 추가: +5점
`,
      starterCode: `"""
하이퍼파라미터 튜닝 벤치마크
Grid Search vs Random Search vs Optuna
"""

import pandas as pd
import numpy as np
import time
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV, RandomizedSearchCV
from sklearn.metrics import roc_auc_score
import lightgbm as lgb
import optuna
from scipy.stats import randint, uniform
import warnings
warnings.filterwarnings('ignore')
optuna.logging.set_verbosity(optuna.logging.WARNING)

# 데이터 준비
np.random.seed(42)
n = 3000

df = pd.DataFrame({f'feature_{i}': np.random.randn(n) for i in range(20)})
df['target'] = (df['feature_0'] * 2 + df['feature_1'] + np.random.randn(n) * 0.5 > 0).astype(int)

X = df.drop('target', axis=1)
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"데이터: {len(X_train)} train, {len(X_test)} test")

# 결과 저장
results = []

# =============================================================================
# 1. Grid Search
# =============================================================================
print("\\n=== 1. Grid Search ===")

param_grid = {
    'n_estimators': [50, 100, 150],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.05, 0.1, 0.2]
}

# TODO: Grid Search 구현 및 시간 측정

# =============================================================================
# 2. Random Search
# =============================================================================
print("\\n=== 2. Random Search ===")

param_dist = {
    'n_estimators': randint(50, 200),
    'max_depth': randint(3, 10),
    'learning_rate': uniform(0.01, 0.3)
}

# TODO: Random Search 구현 (n_iter=50)

# =============================================================================
# 3. Optuna
# =============================================================================
print("\\n=== 3. Optuna ===")

# TODO: Optuna 구현 (n_trials=50)

# =============================================================================
# 4. 결과 분석
# =============================================================================
print("\\n=== 4. 결과 비교 ===")

results_df = pd.DataFrame(results)
print(results_df.to_string(index=False))

# TODO: 분석 및 결론
`,
      hints: [
        'time.time()으로 시작/종료 시간 측정',
        'GridSearchCV(estimator, param_grid, cv=5, scoring="roc_auc")',
        'RandomizedSearchCV(estimator, param_dist, n_iter=50)',
        '탐색 효율성 = best_score / elapsed_time'
      ]
    }
  }
]
