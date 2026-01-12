// Week 12 Day 5: Weekly Project
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'p2w4d5t1',
    type: 'reading',
    title: 'Weekly Project 가이드',
    duration: 15,
    content: {
      markdown: `# Weekly Project: 피처 선택 & 차원 축소

## 프로젝트 개요

이번 주에 배운 피처 선택 기법과 차원 축소를 종합하여
고차원 데이터에서 최적의 피처셋을 선별합니다.

## 데이터셋 선택

### 옵션 1: Kaggle 대회 데이터
- 피처 50개 이상 권장

### 옵션 2: 유전자 발현 데이터
- 고차원 특화

### 옵션 3: 이전 주 FE 결과물
- Week 11에서 생성한 50개+ 피처

## 요구사항

### 1. Filter Methods (20%)
- 분산 기반 필터링
- 상관관계 기반 제거
- SelectKBest (F-test, MI)

### 2. Wrapper/Embedded (25%)
- RFE 또는 RFECV
- Lasso 또는 Tree Importance
- 최적 피처 수 결정

### 3. 차원 축소 (20%)
- PCA (95% 분산)
- t-SNE/UMAP 시각화

### 4. 종합 비교 (25%)
- 각 방법으로 선택된 피처 벤 다이어그램
- 모델 성능 비교 (원본 vs 선택)

### 5. 최종 추천 (10%)
- 최종 피처셋 선정
- 선정 근거 문서화

## 평가 기준

| 항목 | 배점 |
|------|------|
| Filter 적용 | 20% |
| Wrapper/Embedded | 25% |
| 차원 축소 | 20% |
| 성능 비교 | 25% |
| 최종 추천 | 10% |
`,
      externalLinks: [
        { title: 'sklearn Feature Selection', url: 'https://scikit-learn.org/stable/modules/feature_selection.html' },
        { title: 'PCA Tutorial', url: 'https://scikit-learn.org/stable/modules/decomposition.html#pca' }
      ]
    }
  },
  {
    id: 'p2w4d5t2',
    type: 'code',
    title: '프로젝트 템플릿',
    duration: 90,
    content: {
      instructions: `# 피처 선택 & 차원 축소 프로젝트

고차원 데이터에서 최적의 피처셋을 선별하세요.

## 체크리스트
- [ ] Filter Methods (분산, 상관관계, SelectKBest)
- [ ] Wrapper/Embedded (RFE, Lasso, Tree)
- [ ] PCA + 시각화
- [ ] 성능 비교
- [ ] 최종 피처셋 선정
`,
      starterCode: `"""
피처 선택 & 차원 축소 프로젝트
Week 12 Weekly Project
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import (
    VarianceThreshold, SelectKBest, f_classif, mutual_info_classif,
    RFE, SelectFromModel
)
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

# =============================================================================
# 1. 데이터 로드
# =============================================================================
print("=== 1. 데이터 로드 ===")

# 고차원 데이터 생성
X, y = make_classification(
    n_samples=500, n_features=100,
    n_informative=15, n_redundant=30,
    random_state=42
)
X = pd.DataFrame(X, columns=[f'feat_{i}' for i in range(100)])

print(f"Shape: {X.shape}")

# =============================================================================
# 2. Filter Methods
# =============================================================================
print("\\n=== 2. Filter Methods ===")

# TODO: 분산 필터

# TODO: 상관관계 필터

# TODO: SelectKBest

# =============================================================================
# 3. Wrapper/Embedded
# =============================================================================
print("\\n=== 3. Wrapper/Embedded ===")

# TODO: RFE 또는 RFECV

# TODO: Tree Importance

# =============================================================================
# 4. 차원 축소
# =============================================================================
print("\\n=== 4. 차원 축소 ===")

# TODO: PCA

# TODO: t-SNE 시각화

# =============================================================================
# 5. 성능 비교
# =============================================================================
print("\\n=== 5. 성능 비교 ===")

# TODO: 원본 vs 선택 후 성능 비교

# =============================================================================
# 6. 결론
# =============================================================================
print("\\n=== 6. 결론 ===")

# TODO: 최종 피처셋 선정 및 근거
`,
      solutionCode: `"""
피처 선택 & 차원 축소 프로젝트 - 완성본
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import (
    VarianceThreshold, SelectKBest, f_classif, mutual_info_classif,
    RFE, RFECV, SelectFromModel
)
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

# 1. 데이터 로드
print("=== 1. 데이터 로드 ===")
X, y = make_classification(n_samples=500, n_features=100, n_informative=15,
                           n_redundant=30, random_state=42)
X = pd.DataFrame(X, columns=[f'feat_{i}' for i in range(100)])
print(f"Shape: {X.shape}")

# 스케일링
scaler = StandardScaler()
X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)

# 2. Filter Methods
print("\\n=== 2. Filter Methods ===")

# 분산 필터
var_selector = VarianceThreshold(threshold=0.01)
var_selector.fit(X_scaled)
var_features = X.columns[var_selector.get_support()].tolist()
print(f"분산 필터: {len(var_features)} 피처")

# 상관관계 필터
corr_matrix = X_scaled.corr().abs()
upper = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool))
high_corr = [col for col in upper.columns if any(upper[col] > 0.9)]
corr_features = [f for f in X.columns if f not in high_corr]
print(f"상관관계 필터: {len(corr_features)} 피처 (제거: {len(high_corr)})")

# SelectKBest
f_selector = SelectKBest(f_classif, k=30)
f_selector.fit(X_scaled, y)
f_features = X.columns[f_selector.get_support()].tolist()
print(f"F-test Top 30: {len(f_features)} 피처")

# 3. Wrapper/Embedded
print("\\n=== 3. Wrapper/Embedded ===")

# Tree Importance
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_scaled, y)
importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)
tree_features = importance.head(30)['feature'].tolist()
print(f"Tree Top 30: {tree_features[:5]}...")

# SelectFromModel
sfm = SelectFromModel(rf, threshold='median')
sfm.fit(X_scaled, y)
sfm_features = X.columns[sfm.get_support()].tolist()
print(f"SelectFromModel: {len(sfm_features)} 피처")

# 4. 차원 축소
print("\\n=== 4. 차원 축소 ===")

pca = PCA(n_components=0.95)
X_pca = pca.fit_transform(X_scaled)
print(f"PCA: {X.shape[1]} → {X_pca.shape[1]} (95% 분산)")

tsne = TSNE(n_components=2, random_state=42, perplexity=30)
X_tsne = tsne.fit_transform(X_scaled)
print("t-SNE 완료")

# 5. 성능 비교
print("\\n=== 5. 성능 비교 ===")

lr = LogisticRegression(max_iter=1000)

# 원본
cv_original = cross_val_score(lr, X_scaled, y, cv=5).mean()
print(f"원본 (100 피처): {cv_original:.4f}")

# Filter 선택
X_filter = X_scaled[f_features]
cv_filter = cross_val_score(lr, X_filter, y, cv=5).mean()
print(f"Filter (30 피처): {cv_filter:.4f}")

# Tree 선택
X_tree = X_scaled[tree_features]
cv_tree = cross_val_score(lr, X_tree, y, cv=5).mean()
print(f"Tree (30 피처): {cv_tree:.4f}")

# PCA
cv_pca = cross_val_score(lr, X_pca, y, cv=5).mean()
print(f"PCA ({X_pca.shape[1]} 컴포넌트): {cv_pca:.4f}")

# 6. 결론
print("\\n=== 6. 결론 ===")
results = {
    'Original': cv_original,
    'Filter': cv_filter,
    'Tree': cv_tree,
    'PCA': cv_pca
}
best = max(results, key=results.get)
print(f"최고 성능: {best} ({results[best]:.4f})")

# 공통 피처
common = set(f_features) & set(tree_features)
print(f"\\nFilter & Tree 공통 피처: {len(common)}개")
print(f"추천 피처셋: {list(common)[:10]}...")

print("\\n프로젝트 완료!")
`,
      hints: [
        'VarianceThreshold로 분산 필터링',
        'SelectKBest(f_classif, k=30)으로 상위 30개',
        'PCA(n_components=0.95)로 95% 분산 유지',
        'cross_val_score로 성능 비교'
      ]
    }
  },
  {
    id: 'p2w4d5t3',
    type: 'quiz',
    title: 'Week 12 종합 퀴즈',
    duration: 20,
    content: {
      questions: [
        {
          question: 'Filter Methods의 특징은?',
          options: ['모델 의존적', '느림', '모델 독립적', '항상 최적'],
          answer: 2
        },
        {
          question: 'RFE의 동작 방식은?',
          options: ['중요 피처 추가', '약한 피처 제거', '랜덤 선택', '상관관계 기반'],
          answer: 1
        },
        {
          question: 'PCA 적용 전 필수 전처리는?',
          options: ['인코딩', '스케일링', '결측치 제거', '이상치 처리'],
          answer: 1
        },
        {
          question: 't-SNE의 주요 용도는?',
          options: ['피처 생성', '시각화', '예측', '클러스터링'],
          answer: 1
        },
        {
          question: 'Lasso가 피처 선택을 수행하는 이유는?',
          options: ['L2 규제', 'L1 규제로 계수를 0으로', '드롭아웃', '조기 종료'],
          answer: 1
        },
        {
          question: '샘플 500개일 때 권장 피처 수는?',
          options: ['500개', '50-100개', '1000개', '10개 미만'],
          answer: 1
        },
        {
          question: 'Mutual Information의 장점은?',
          options: ['빠름', '비선형 관계 포착', '단순함', '항상 정확'],
          answer: 1
        },
        {
          question: 'UMAP이 t-SNE보다 좋은 점은?',
          options: ['더 정확함', '전역 구조 보존 + 빠름', '해석 가능', '항상 같은 결과'],
          answer: 1
        }
      ]
    }
  }
]
