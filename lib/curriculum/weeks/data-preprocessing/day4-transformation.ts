// Week 10 Day 4: 데이터 변환 & 인코딩
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'p2w2d4t1',
    type: 'video',
    title: '수치형 데이터 스케일링',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 수치형 데이터 스케일링

## 왜 스케일링이 필요한가?

\\\`\\\`\\\`
문제 상황:
- income: 30,000 ~ 100,000 (범위: 70,000)
- age: 20 ~ 70 (범위: 50)

거리 기반 알고리즘 (KNN, K-means, SVM 등)에서는
income이 age보다 수천 배 더 큰 영향을 미침

→ 스케일링으로 모든 변수를 동등하게
\\\`\\\`\\\`

## 1. StandardScaler (Z-score 표준화)

\\\`\\\`\\\`python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
df_scaled = scaler.fit_transform(df[numerical_cols])

# 결과: 평균 0, 표준편차 1
print(f"Mean: {df_scaled.mean(axis=0)}")  # ≈ 0
print(f"Std: {df_scaled.std(axis=0)}")    # ≈ 1
\\\`\\\`\\\`

**수식**: X_scaled = (X - mean) / std

**장점**:
- 이상치가 적을 때 효과적
- 대부분의 알고리즘에 적합

**단점**:
- 이상치에 민감 (평균, 표준편차 왜곡)

**적합한 알고리즘**: SVM, 로지스틱 회귀, 신경망

## 2. MinMaxScaler (정규화)

\\\`\\\`\\\`python
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()  # 기본 범위: 0-1
df_scaled = scaler.fit_transform(df[numerical_cols])

# 커스텀 범위
scaler = MinMaxScaler(feature_range=(-1, 1))
\\\`\\\`\\\`

**수식**: X_scaled = (X - min) / (max - min)

**장점**:
- 원하는 범위로 정확히 스케일링
- 해석이 직관적 (0-1 사이)

**단점**:
- 이상치에 매우 민감

**적합한 상황**: 이미지 데이터, 신경망 입력

## 3. RobustScaler

\\\`\\\`\\\`python
from sklearn.preprocessing import RobustScaler

scaler = RobustScaler()
df_scaled = scaler.fit_transform(df[numerical_cols])
\\\`\\\`\\\`

**수식**: X_scaled = (X - median) / IQR

**장점**:
- 이상치에 강건 (중앙값, IQR 사용)
- 이상치가 있을 때 권장

**단점**:
- 범위가 StandardScaler보다 넓을 수 있음

**적합한 상황**: 이상치가 많은 데이터

## 4. 분포 변환 (Power Transformer)

\\\`\\\`\\\`python
from sklearn.preprocessing import PowerTransformer

# Box-Cox (양수만)
pt = PowerTransformer(method='box-cox')
df_transformed = pt.fit_transform(df[positive_cols])

# Yeo-Johnson (음수 포함 가능)
pt = PowerTransformer(method='yeo-johnson')
df_transformed = pt.fit_transform(df[numerical_cols])
\\\`\\\`\\\`

**목적**: 왜곡된 분포를 정규분포에 가깝게 변환

**시각화**:
\\\`\\\`\\\`python
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# 원본
axes[0].hist(df['income'], bins=50)
axes[0].set_title('Original')

# 로그 변환
axes[1].hist(np.log1p(df['income']), bins=50)
axes[1].set_title('Log Transform')

# Yeo-Johnson
pt = PowerTransformer(method='yeo-johnson')
transformed = pt.fit_transform(df[['income']])
axes[2].hist(transformed, bins=50)
axes[2].set_title('Yeo-Johnson')
\\\`\\\`\\\`

## 스케일러 선택 가이드

| 스케일러 | 이상치 | 분포 가정 | 적합한 알고리즘 |
|----------|--------|----------|----------------|
| Standard | 민감 | 정규분포 | SVM, LR, NN |
| MinMax | 매우 민감 | 없음 | 이미지, NN |
| Robust | 강건 | 없음 | 이상치 데이터 |
| Power | 적용 후 강건 | 변환 후 정규 | 선형 모델 |

## 주의사항: 데이터 누수 방지

\\\`\\\`\\\`python
from sklearn.model_selection import train_test_split

# 올바른 방법
X_train, X_test, y_train, y_test = train_test_split(X, y)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)  # fit은 train에만!
X_test_scaled = scaler.transform(X_test)        # transform만!

# 잘못된 방법 (데이터 누수!)
scaler.fit(X)  # 전체 데이터로 fit하면 안 됨!
\\\`\\\`\\\`
`,
      objectives: [
        '다양한 스케일링 방법의 차이를 이해한다',
        '상황에 맞는 스케일러를 선택할 수 있다',
        '데이터 누수를 방지하는 방법을 안다'
      ],
      keyPoints: [
        'StandardScaler: 평균 0, 표준편차 1',
        'MinMaxScaler: 0-1 범위, 이상치에 민감',
        'RobustScaler: 이상치에 강건',
        'fit은 train 데이터에만!'
      ]
    }
  },
  {
    id: 'p2w2d4t2',
    type: 'video',
    title: '범주형 데이터 인코딩',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 범주형 데이터 인코딩

## 왜 인코딩이 필요한가?

\\\`\\\`\\\`
머신러닝 모델은 숫자만 처리할 수 있음
"Red", "Blue", "Green" → 숫자로 변환 필요

주의: 잘못된 인코딩은 모델에 거짓 정보 제공
\\\`\\\`\\\`

## 1. Label Encoding

\\\`\\\`\\\`python
from sklearn.preprocessing import LabelEncoder

le = LabelEncoder()
df['size_encoded'] = le.fit_transform(df['size'])
# S → 0, M → 1, L → 2

# 역변환
original = le.inverse_transform([0, 1, 2])
\\\`\\\`\\\`

**적합한 경우**:
- 순서가 있는 범주 (Small < Medium < Large)
- 트리 기반 모델 (순서 정보를 활용)

**위험**:
- 순서 없는 범주에 사용하면 잘못된 관계 학습
- "Red=0, Blue=1, Green=2" → 모델이 Red < Blue < Green으로 해석

## 2. One-Hot Encoding

\\\`\\\`\\\`python
# pandas 방식
df_encoded = pd.get_dummies(df, columns=['color'], drop_first=True)

# sklearn 방식
from sklearn.preprocessing import OneHotEncoder
ohe = OneHotEncoder(sparse=False, drop='first')
encoded = ohe.fit_transform(df[['color']])
\\\`\\\`\\\`

**결과**:
\\\`\\\`\\\`
color    → color_Blue  color_Green  color_Red
Red      →     0           0            1
Blue     →     1           0            0
Green    →     0           1            0
\\\`\\\`\\\`

**장점**:
- 순서 정보 없음 (정확한 표현)
- 대부분의 모델에 적합

**단점**:
- 고카디널리티에서 차원 폭발
- 희소 행렬 생성

**drop='first' 이유**:
- 다중공선성 방지 (Red = 1 - Blue - Green)

## 3. Ordinal Encoding

\\\`\\\`\\\`python
from sklearn.preprocessing import OrdinalEncoder

# 순서 명시
categories = [['low', 'medium', 'high']]
oe = OrdinalEncoder(categories=categories)
df['level_encoded'] = oe.fit_transform(df[['level']])
# low → 0, medium → 1, high → 2
\\\`\\\`\\\`

**적합한 경우**:
- 명확한 순서가 있는 범주
- 교육 수준, 만족도 등급 등

## 4. Target Encoding

\\\`\\\`\\\`python
import category_encoders as ce

# 기본 타겟 인코딩
encoder = ce.TargetEncoder(cols=['category'])
df['category_encoded'] = encoder.fit_transform(df['category'], df['target'])
\\\`\\\`\\\`

**원리**: 각 범주를 해당 범주의 타겟 평균으로 대체

\\\`\\\`\\\`
category  target    → category_encoded
   A        1             0.7 (A의 타겟 평균)
   B        0             0.3 (B의 타겟 평균)
   A        1             0.7
\\\`\\\`\\\`

**장점**:
- 고카디널리티에 효과적
- 예측력 있는 정보 인코딩

**위험**:
- 과적합 가능 → CV 방식 사용

\\\`\\\`\\\`python
# CV 방식 타겟 인코딩 (과적합 방지)
from sklearn.model_selection import KFold

def target_encode_cv(df, col, target, n_splits=5):
    df = df.copy()
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    df[f'{col}_target'] = 0

    for train_idx, val_idx in kf.split(df):
        means = df.iloc[train_idx].groupby(col)[target].mean()
        df.loc[val_idx, f'{col}_target'] = df.loc[val_idx, col].map(means)

    return df
\\\`\\\`\\\`

## 5. Frequency Encoding

\\\`\\\`\\\`python
# 빈도 기반 인코딩
freq = df['category'].value_counts(normalize=True)
df['category_freq'] = df['category'].map(freq)
\\\`\\\`\\\`

**장점**:
- 단순, 빠름
- 타겟 누수 없음

## 6. Binary Encoding

\\\`\\\`\\\`python
import category_encoders as ce

encoder = ce.BinaryEncoder(cols=['high_cardinality_col'])
df_encoded = encoder.fit_transform(df)
\\\`\\\`\\\`

**원리**: 카테고리를 이진수로 변환
- 1000개 카테고리 → 10개 컬럼 (log2(1000) ≈ 10)

**장점**:
- One-Hot 대비 차원 크게 감소
- 고카디널리티에 효과적

## 인코딩 선택 가이드

| 상황 | 권장 인코딩 |
|------|------------|
| 순서 있는 범주 (교육 수준) | Ordinal |
| 순서 없음, 낮은 카디널리티 (<10) | One-Hot |
| 순서 없음, 높은 카디널리티 | Target 또는 Binary |
| 트리 기반 모델 | Label 또는 Target |
| 선형 모델 | One-Hot 또는 Target |
`,
      objectives: [
        '다양한 인코딩 방법의 차이를 이해한다',
        '상황에 맞는 인코딩을 선택할 수 있다',
        'Target Encoding의 과적합 위험을 이해한다'
      ],
      keyPoints: [
        'Label: 순서 있는 범주',
        'One-Hot: 순서 없음, 낮은 카디널리티',
        'Target: 고카디널리티, CV 필수',
        'Binary: 고카디널리티, 차원 절약'
      ]
    }
  },
  {
    id: 'p2w2d4t3',
    type: 'code',
    title: '실습: sklearn Pipeline 구축',
    duration: 45,
    content: {
      instructions: `# sklearn Pipeline 실습

## 목표
데이터 전처리를 재사용 가능한 sklearn Pipeline으로 구축하세요.

## 요구사항

### 1. ColumnTransformer 구성
- 수치형: 결측치 처리 + 스케일링
- 범주형: 결측치 처리 + 인코딩

### 2. Pipeline 구축
- 전처리 + 모델을 하나의 파이프라인으로

### 3. 교차 검증
- Pipeline 전체를 교차 검증

### 4. 새 데이터 예측
- 전처리와 예측을 한 번에

## 제출물
- 완성된 Pipeline 코드
- 교차 검증 결과
`,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier

# 샘플 데이터 생성
np.random.seed(42)
n = 500

df = pd.DataFrame({
    'age': np.random.randint(20, 70, n).astype(float),
    'income': np.random.normal(50000, 15000, n),
    'education': np.random.choice(['High School', 'Bachelor', 'Master', 'PhD'], n),
    'department': np.random.choice(['Sales', 'Engineering', 'HR', 'Marketing'], n),
    'experience': np.random.randint(0, 30, n).astype(float),
    'target': np.random.randint(0, 2, n)
})

# 결측치 추가
df.loc[np.random.choice(n, 30, replace=False), 'age'] = np.nan
df.loc[np.random.choice(n, 40, replace=False), 'income'] = np.nan
df.loc[np.random.choice(n, 20, replace=False), 'education'] = np.nan

print("=== 데이터 정보 ===")
print(df.info())
print(f"\\n결측치:\\n{df.isnull().sum()}")

# 피처와 타겟 분리
X = df.drop('target', axis=1)
y = df['target']

# TODO: Pipeline 구축

# 1. 컬럼 정의
numerical_cols = ['age', 'income', 'experience']
categorical_cols = ['education', 'department']

# 2. 수치형 전처리 파이프라인
numerical_pipeline = Pipeline([
    # 여기에 코드 작성
])

# 3. 범주형 전처리 파이프라인
categorical_pipeline = Pipeline([
    # 여기에 코드 작성
])

# 4. ColumnTransformer
preprocessor = ColumnTransformer([
    # 여기에 코드 작성
])

# 5. 전체 Pipeline (전처리 + 모델)
full_pipeline = Pipeline([
    # 여기에 코드 작성
])

# 6. 교차 검증
# 여기에 코드 작성

# 7. 학습 및 예측
# 여기에 코드 작성
`,
      solutionCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier

# 샘플 데이터 생성
np.random.seed(42)
n = 500

df = pd.DataFrame({
    'age': np.random.randint(20, 70, n).astype(float),
    'income': np.random.normal(50000, 15000, n),
    'education': np.random.choice(['High School', 'Bachelor', 'Master', 'PhD'], n),
    'department': np.random.choice(['Sales', 'Engineering', 'HR', 'Marketing'], n),
    'experience': np.random.randint(0, 30, n).astype(float),
    'target': np.random.randint(0, 2, n)
})

# 결측치 추가
df.loc[np.random.choice(n, 30, replace=False), 'age'] = np.nan
df.loc[np.random.choice(n, 40, replace=False), 'income'] = np.nan
df.loc[np.random.choice(n, 20, replace=False), 'education'] = np.nan

print("=== 데이터 정보 ===")
print(df.info())
print(f"\\n결측치:\\n{df.isnull().sum()}")

# 피처와 타겟 분리
X = df.drop('target', axis=1)
y = df['target']

# 1. 컬럼 정의
numerical_cols = ['age', 'income', 'experience']
categorical_cols = ['education', 'department']

# 2. 수치형 전처리 파이프라인
numerical_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# 3. 범주형 전처리 파이프라인
categorical_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

# 4. ColumnTransformer
preprocessor = ColumnTransformer([
    ('numerical', numerical_pipeline, numerical_cols),
    ('categorical', categorical_pipeline, categorical_cols)
])

# 5. 전체 Pipeline (전처리 + 모델)
full_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

print("\\n=== Pipeline 구조 ===")
print(full_pipeline)

# 6. 교차 검증
print("\\n=== 교차 검증 ===")
cv_scores = cross_val_score(full_pipeline, X, y, cv=5, scoring='accuracy')
print(f"CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std()*2:.4f})")
print(f"각 Fold 점수: {cv_scores}")

# 7. 학습 및 예측
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 학습
full_pipeline.fit(X_train, y_train)

# 예측
y_pred = full_pipeline.predict(X_test)

# 성능 평가
from sklearn.metrics import accuracy_score, classification_report
print(f"\\n=== 테스트 결과 ===")
print(f"Test Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(f"\\nClassification Report:")
print(classification_report(y_test, y_pred))

# 8. 새 데이터 예측 예시
print("\\n=== 새 데이터 예측 ===")
new_data = pd.DataFrame({
    'age': [35, np.nan],
    'income': [60000, 45000],
    'education': ['Bachelor', 'Master'],
    'department': ['Engineering', 'Sales'],
    'experience': [10, 5]
})
print("입력 데이터:")
print(new_data)

predictions = full_pipeline.predict(new_data)
print(f"\\n예측 결과: {predictions}")

# 9. 전처리 결과 확인
print("\\n=== 전처리된 피처 ===")
X_transformed = preprocessor.fit_transform(X_train)
print(f"변환 후 Shape: {X_transformed.shape}")

# 피처 이름 확인
feature_names = (
    numerical_cols +
    list(preprocessor.named_transformers_['categorical']
         .named_steps['encoder']
         .get_feature_names_out(categorical_cols))
)
print(f"피처 이름: {feature_names}")
`,
      hints: [
        'SimpleImputer(strategy="median")로 중앙값 대체',
        'OneHotEncoder(handle_unknown="ignore")로 새 카테고리 처리',
        'cross_val_score()에 Pipeline 전체를 전달하면 누수 없이 검증',
        'Pipeline.fit()과 Pipeline.predict()로 전체 과정 실행'
      ]
    }
  },
  {
    id: 'p2w2d4t4',
    type: 'quiz',
    title: 'Day 4 퀴즈: 변환 & 인코딩',
    duration: 10,
    content: {
      questions: [
        {
          question: '이상치에 가장 강건한 스케일러는?',
          options: ['StandardScaler', 'MinMaxScaler', 'RobustScaler', 'PowerTransformer'],
          answer: 2,
          explanation: 'RobustScaler는 중앙값과 IQR을 사용하여 스케일링하므로 이상치의 영향을 받지 않습니다. StandardScaler는 평균/표준편차, MinMaxScaler는 최소/최대값을 사용해 이상치에 민감합니다.'
        },
        {
          question: 'One-Hot Encoding에서 drop="first"를 사용하는 이유는?',
          options: ['계산 속도 향상', '메모리 절약', '다중공선성 방지', '결측치 처리'],
          answer: 2,
          explanation: 'One-Hot 인코딩된 컬럼들은 합이 항상 1이 되어 다중공선성(multicollinearity)을 발생시킵니다. 하나의 컬럼을 제거하면 나머지 컬럼들로 해당 카테고리를 추론할 수 있어 다중공선성을 방지합니다.'
        },
        {
          question: 'Target Encoding의 과적합을 방지하는 방법은?',
          options: ['더 많은 카테고리 사용', 'Cross-Validation 방식 적용', 'Label Encoding으로 대체', 'Standardization 적용'],
          answer: 1,
          explanation: 'Target Encoding은 타겟 값을 직접 사용하므로 과적합 위험이 있습니다. K-Fold CV 방식으로 각 fold에서 다른 fold의 타겟 평균을 사용하면 과적합을 방지할 수 있습니다.'
        },
        {
          question: '스케일러를 학습 데이터에만 fit해야 하는 이유는?',
          options: ['계산 속도', '메모리 효율', '데이터 누수 방지', '정확도 향상'],
          answer: 2,
          explanation: '테스트 데이터의 통계치(평균, 표준편차 등)가 모델 학습에 사용되면 데이터 누수가 발생합니다. 실제 예측 시점에는 미래 데이터를 알 수 없으므로, 학습 데이터에서만 fit하고 테스트 데이터에는 transform만 적용해야 합니다.'
        },
        {
          question: '1000개 카테고리를 가진 변수에 적합한 인코딩은?',
          options: ['One-Hot Encoding', 'Label Encoding', 'Binary Encoding', 'Ordinal Encoding'],
          answer: 2,
          explanation: 'Binary Encoding은 카테고리를 이진수로 변환하여 log₂(N)개의 컬럼만 필요합니다. 1000개 카테고리는 10개 컬럼으로 표현 가능해, One-Hot의 1000개 컬럼보다 훨씬 효율적입니다.'
        }
      ]
    }
  }
]
