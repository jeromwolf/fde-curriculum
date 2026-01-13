// Week 10 Day 5: Weekly Project - 데이터 정제 파이프라인
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'p2w2d5t1',
    type: 'reading',
    title: 'Weekly Project 가이드: 데이터 정제 파이프라인',
    duration: 15,
    content: {
      markdown: `# Weekly Project: 데이터 정제 파이프라인

## 프로젝트 개요

이번 주에 배운 데이터 품질, 결측치, 이상치, 변환 기법을 종합하여
**재사용 가능한 데이터 정제 파이프라인**을 구축합니다.

## 학습 목표

- 데이터 품질을 체계적으로 평가할 수 있다
- 결측치와 이상치를 적절히 처리할 수 있다
- sklearn Pipeline으로 전처리를 자동화할 수 있다
- 처리 결정의 근거를 문서화할 수 있다

## 데이터셋 선택

다음 중 하나를 선택하세요:

### 옵션 1: Spaceship Titanic (Kaggle)
- URL: https://www.kaggle.com/competitions/spaceship-titanic
- 특징: 다양한 결측 패턴, 범주형/수치형 혼합

### 옵션 2: Housing Prices (Kaggle)
- URL: https://www.kaggle.com/c/house-prices-advanced-regression-techniques
- 특징: 많은 결측치, 고카디널리티 범주형

### 옵션 3: 자체 데이터
- 실무 데이터 또는 수집한 데이터
- 최소 1000행, 10개 이상 컬럼 권장

## 요구사항

### 1. 데이터 품질 평가 (20%)

\\\`\\\`\\\`python
# 6차원 품질 평가
1. 완전성: 각 컬럼별 결측률
2. 정확성: 범위 검증, 비현실적 값 식별
3. 일관성: 컬럼 간 모순 확인
4. 유효성: 형식 검증 (이메일, 날짜 등)
5. 유일성: 중복 레코드 탐지
6. 적시성: 데이터 신선도 (해당 시)
\\\`\\\`\\\`

### 2. 결측치 처리 (25%)

\\\`\\\`\\\`python
# 결측 메커니즘 진단
- MCAR vs MAR 판단
- 각 컬럼별 처리 전략 선택
- 처리 근거 문서화

# 처리 방법 예시
- 수치형: 중앙값, KNN, 그룹별 대체
- 범주형: 최빈값, Unknown
- 높은 결측률: 컬럼 삭제 고려
\\\`\\\`\\\`

### 3. 이상치 처리 (20%)

\\\`\\\`\\\`python
# 이상치 탐지
- IQR 방법
- Z-score (해당 시)
- 시각화로 확인

# 처리 전략
- 명확한 오류: 제거 또는 대체
- 극단값: Winsorizing, 클리핑, 로그 변환
- 처리 근거 문서화
\\\`\\\`\\\`

### 4. 변환 & 인코딩 (20%)

\\\`\\\`\\\`python
# 수치형 변환
- 스케일링 방법 선택 및 적용
- 분포 변환 (필요시)

# 범주형 인코딩
- 카디널리티에 따른 방법 선택
- One-Hot vs Target vs Binary
\\\`\\\`\\\`

### 5. Pipeline 구축 (15%)

\\\`\\\`\\\`python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer

# ColumnTransformer로 수치형/범주형 분리 처리
# 전체 파이프라인 구축
# 새 데이터에 적용 가능한 형태
\\\`\\\`\\\`

## 산출물

1. **Jupyter Notebook** (또는 Python 스크립트)
   - 코드 + 마크다운 설명
   - 시각화 포함

2. **처리 전후 비교**
   - 결측률 변화
   - 분포 변화
   - 이상치 수 변화

3. **결정 근거 문서**
   - 각 처리 결정의 이유
   - 고려한 대안과 선택 이유

## 평가 기준

| 항목 | 배점 | 세부 기준 |
|------|------|----------|
| 품질 평가 | 20% | 6차원 모두 평가, 시각화 |
| 결측치 처리 | 25% | 메커니즘 진단, 적절한 방법 |
| 이상치 처리 | 20% | 탐지 + 처리 + 근거 |
| 변환/인코딩 | 20% | 상황에 맞는 선택 |
| Pipeline | 15% | 재사용 가능, 누수 없음 |

## 추천 구조

\\\`\\\`\\\`markdown
# 데이터 정제 파이프라인 프로젝트

## 1. 데이터 로드 및 탐색
- 기본 정보 (shape, dtypes)
- 샘플 확인

## 2. 데이터 품질 평가
- 6차원 평가 결과
- 주요 이슈 식별

## 3. 결측치 처리
- 결측 패턴 분석
- 처리 전략 및 적용
- 처리 전후 비교

## 4. 이상치 처리
- 탐지 결과
- 처리 전략 및 적용
- 처리 전후 비교

## 5. 변환 & 인코딩
- 수치형 스케일링
- 범주형 인코딩
- 최종 피처 확인

## 6. Pipeline 구축
- sklearn Pipeline 코드
- 새 데이터 적용 예시

## 7. 결론 및 권고사항
- 주요 발견
- 향후 개선점
\\\`\\\`\\\`
`,
      externalLinks: [
        { title: 'Spaceship Titanic (Kaggle)', url: 'https://www.kaggle.com/competitions/spaceship-titanic' },
        { title: 'Housing Prices (Kaggle)', url: 'https://www.kaggle.com/c/house-prices-advanced-regression-techniques' },
        { title: 'sklearn Pipeline Guide', url: 'https://scikit-learn.org/stable/modules/compose.html' }
      ]
    }
  },
  {
    id: 'p2w2d5t2',
    type: 'code',
    title: '프로젝트 템플릿',
    duration: 90,
    content: {
      instructions: `# 데이터 정제 파이프라인 프로젝트

아래 템플릿을 완성하여 데이터 정제 파이프라인을 구축하세요.

## 체크리스트

- [ ] 데이터 로드 및 기본 탐색
- [ ] 6차원 데이터 품질 평가
- [ ] 결측치 메커니즘 진단 및 처리
- [ ] 이상치 탐지 및 처리
- [ ] 수치형 스케일링
- [ ] 범주형 인코딩
- [ ] sklearn Pipeline 구축
- [ ] 처리 전후 비교 시각화
- [ ] 결정 근거 문서화
`,
      starterCode: `"""
데이터 정제 파이프라인 프로젝트
Week 10 Weekly Project
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, RobustScaler, OneHotEncoder
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.ensemble import RandomForestClassifier

# 시각화 설정
plt.style.use('seaborn-v0_8-whitegrid')
plt.rcParams['figure.figsize'] = (12, 6)

# =============================================================================
# 1. 데이터 로드 및 탐색
# =============================================================================
print("=" * 60)
print("1. 데이터 로드 및 탐색")
print("=" * 60)

# TODO: 데이터 로드
# df = pd.read_csv('your_data.csv')

# 샘플 데이터 생성 (실제 데이터로 교체)
np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'PassengerId': range(1, n + 1),
    'Age': np.random.randint(1, 80, n).astype(float),
    'Fare': np.random.exponential(50, n),
    'Cabin': np.random.choice(['A', 'B', 'C', 'D', None], n, p=[0.1, 0.1, 0.1, 0.1, 0.6]),
    'Embarked': np.random.choice(['S', 'C', 'Q', None], n, p=[0.6, 0.2, 0.15, 0.05]),
    'Pclass': np.random.choice([1, 2, 3], n),
    'VIP': np.random.choice([True, False], n),
    'Survived': np.random.randint(0, 2, n)
})

# 이상치 및 결측치 추가
df.loc[np.random.choice(n, 100, replace=False), 'Age'] = np.nan
df.loc[np.random.choice(n, 50, replace=False), 'Fare'] = np.nan
df.loc[10:15, 'Age'] = [-5, 150, 200, 0, 999, 180]
df.loc[20:25, 'Fare'] = [1000, 2000, 5000, -100, 3000, 10000]

print(f"Shape: {df.shape}")
print(f"\\nDtypes:\\n{df.dtypes}")
print(f"\\n처음 5행:\\n{df.head()}")

# =============================================================================
# 2. 데이터 품질 평가 (6차원)
# =============================================================================
print("\\n" + "=" * 60)
print("2. 데이터 품질 평가")
print("=" * 60)

def evaluate_data_quality(df):
    """6차원 데이터 품질 평가"""
    print("\\n--- 2.1 완전성 (Completeness) ---")
    missing = df.isnull().sum()
    missing_pct = (missing / len(df) * 100).round(2)
    print(pd.DataFrame({'missing': missing, 'pct': missing_pct}))

    print("\\n--- 2.2 정확성 (Accuracy) ---")
    # TODO: 범위 검증 구현
    pass

    print("\\n--- 2.3 유효성 (Validity) ---")
    # TODO: 형식 검증 구현
    pass

    print("\\n--- 2.4 유일성 (Uniqueness) ---")
    duplicates = df.duplicated().sum()
    print(f"중복 행: {duplicates}")

# TODO: 품질 평가 함수 완성 및 실행
evaluate_data_quality(df)

# =============================================================================
# 3. 결측치 처리
# =============================================================================
print("\\n" + "=" * 60)
print("3. 결측치 처리")
print("=" * 60)

def handle_missing_values(df):
    """결측치 처리"""
    df_clean = df.copy()

    # TODO: 결측 메커니즘 진단

    # TODO: 각 컬럼별 처리 전략 적용

    return df_clean

# TODO: 결측치 처리 함수 완성 및 실행
# df_no_missing = handle_missing_values(df)

# =============================================================================
# 4. 이상치 처리
# =============================================================================
print("\\n" + "=" * 60)
print("4. 이상치 처리")
print("=" * 60)

def handle_outliers(df):
    """이상치 처리"""
    df_clean = df.copy()

    # TODO: IQR 기반 이상치 탐지

    # TODO: 처리 전략 적용

    return df_clean

# TODO: 이상치 처리 함수 완성 및 실행
# df_no_outliers = handle_outliers(df_no_missing)

# =============================================================================
# 5. sklearn Pipeline 구축
# =============================================================================
print("\\n" + "=" * 60)
print("5. sklearn Pipeline 구축")
print("=" * 60)

# 컬럼 정의
numerical_cols = ['Age', 'Fare']
categorical_cols = ['Cabin', 'Embarked', 'Pclass']

# TODO: 수치형 파이프라인

# TODO: 범주형 파이프라인

# TODO: ColumnTransformer

# TODO: 전체 Pipeline (전처리 + 모델)

# =============================================================================
# 6. 결과 검증
# =============================================================================
print("\\n" + "=" * 60)
print("6. 결과 검증")
print("=" * 60)

# TODO: 처리 전후 비교

# TODO: 교차 검증

# =============================================================================
# 7. 결론
# =============================================================================
print("\\n" + "=" * 60)
print("7. 결론 및 권고사항")
print("=" * 60)

# TODO: 주요 발견 및 권고사항 정리
`,
      solutionCode: `"""
데이터 정제 파이프라인 프로젝트 - 완성본
Week 10 Weekly Project
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from scipy.stats import mstats
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, RobustScaler, OneHotEncoder
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.ensemble import RandomForestClassifier

# 시각화 설정
plt.style.use('seaborn-v0_8-whitegrid')
plt.rcParams['figure.figsize'] = (12, 6)

# =============================================================================
# 1. 데이터 로드 및 탐색
# =============================================================================
print("=" * 60)
print("1. 데이터 로드 및 탐색")
print("=" * 60)

np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'PassengerId': range(1, n + 1),
    'Age': np.random.randint(1, 80, n).astype(float),
    'Fare': np.random.exponential(50, n),
    'Cabin': np.random.choice(['A', 'B', 'C', 'D', None], n, p=[0.1, 0.1, 0.1, 0.1, 0.6]),
    'Embarked': np.random.choice(['S', 'C', 'Q', None], n, p=[0.6, 0.2, 0.15, 0.05]),
    'Pclass': np.random.choice([1, 2, 3], n),
    'VIP': np.random.choice([True, False], n),
    'Survived': np.random.randint(0, 2, n)
})

df.loc[np.random.choice(n, 100, replace=False), 'Age'] = np.nan
df.loc[np.random.choice(n, 50, replace=False), 'Fare'] = np.nan
df.loc[10:15, 'Age'] = [-5, 150, 200, 0, 999, 180]
df.loc[20:25, 'Fare'] = [1000, 2000, 5000, -100, 3000, 10000]

print(f"Shape: {df.shape}")
print(f"\\n원본 데이터 통계:\\n{df.describe()}")

# =============================================================================
# 2. 데이터 품질 평가 (6차원)
# =============================================================================
print("\\n" + "=" * 60)
print("2. 데이터 품질 평가")
print("=" * 60)

def evaluate_data_quality(df):
    """6차원 데이터 품질 평가"""
    scores = {}

    # 2.1 완전성
    print("\\n--- 2.1 완전성 (Completeness) ---")
    missing = df.isnull().sum()
    missing_pct = (missing / len(df) * 100).round(2)
    completeness = 100 - missing_pct.mean()
    scores['completeness'] = completeness
    print(f"평균 완전성 점수: {completeness:.1f}%")
    print(f"결측률 높은 컬럼: {list(missing_pct[missing_pct > 10].index)}")

    # 2.2 정확성
    print("\\n--- 2.2 정확성 (Accuracy) ---")
    issues = []
    if 'Age' in df.columns:
        invalid_age = df[(df['Age'] < 0) | (df['Age'] > 120)]['Age'].count()
        if invalid_age > 0:
            issues.append(f"Age: {invalid_age}개 유효하지 않은 값")
    if 'Fare' in df.columns:
        negative_fare = (df['Fare'] < 0).sum()
        if negative_fare > 0:
            issues.append(f"Fare: {negative_fare}개 음수 값")
    accuracy = 100 if not issues else 90
    scores['accuracy'] = accuracy
    print(f"정확성 이슈: {issues if issues else '없음'}")

    # 2.3 유일성
    print("\\n--- 2.3 유일성 (Uniqueness) ---")
    duplicates = df.duplicated().sum()
    uniqueness = (1 - duplicates / len(df)) * 100
    scores['uniqueness'] = uniqueness
    print(f"중복 행: {duplicates}개, 유일성: {uniqueness:.1f}%")

    # 종합 점수
    overall = np.mean(list(scores.values()))
    print(f"\\n>>> 종합 품질 점수: {overall:.1f}/100")

    return scores

quality_scores = evaluate_data_quality(df)

# =============================================================================
# 3. 결측치 처리
# =============================================================================
print("\\n" + "=" * 60)
print("3. 결측치 처리")
print("=" * 60)

def handle_missing_values(df):
    """결측치 처리"""
    df_clean = df.copy()

    print("\\n처리 전 결측치:")
    print(df_clean.isnull().sum())

    # Age: 중앙값 대체 (MCAR로 가정)
    if 'Age' in df_clean.columns:
        median_age = df_clean['Age'].median()
        df_clean['Age'] = df_clean['Age'].fillna(median_age)
        print(f"\\n[Age] 중앙값 {median_age:.1f}으로 대체")

    # Fare: 그룹별 중앙값 (Pclass에 따라 다를 수 있음)
    if 'Fare' in df_clean.columns and 'Pclass' in df_clean.columns:
        df_clean['Fare'] = df_clean.groupby('Pclass')['Fare'].transform(
            lambda x: x.fillna(x.median())
        )
        print("[Fare] Pclass별 중앙값으로 대체")

    # Cabin: 'Unknown'으로 대체 (높은 결측률)
    if 'Cabin' in df_clean.columns:
        df_clean['Cabin'] = df_clean['Cabin'].fillna('Unknown')
        print("[Cabin] 'Unknown'으로 대체")

    # Embarked: 최빈값 대체
    if 'Embarked' in df_clean.columns:
        mode_embarked = df_clean['Embarked'].mode()[0]
        df_clean['Embarked'] = df_clean['Embarked'].fillna(mode_embarked)
        print(f"[Embarked] 최빈값 '{mode_embarked}'으로 대체")

    print("\\n처리 후 결측치:")
    print(df_clean.isnull().sum())

    return df_clean

df_no_missing = handle_missing_values(df)

# =============================================================================
# 4. 이상치 처리
# =============================================================================
print("\\n" + "=" * 60)
print("4. 이상치 처리")
print("=" * 60)

def handle_outliers(df):
    """이상치 처리"""
    df_clean = df.copy()

    # Age: 도메인 지식 기반 클리핑 (0-100)
    if 'Age' in df_clean.columns:
        before = len(df_clean[(df_clean['Age'] < 0) | (df_clean['Age'] > 100)])
        df_clean['Age'] = df_clean['Age'].clip(0, 100)
        print(f"[Age] {before}개 이상치 클리핑 (0-100)")

    # Fare: Winsorizing (상하위 1%)
    if 'Fare' in df_clean.columns:
        Q1, Q3 = df_clean['Fare'].quantile([0.25, 0.75])
        IQR = Q3 - Q1
        before = len(df_clean[(df_clean['Fare'] < Q1 - 1.5*IQR) |
                              (df_clean['Fare'] > Q3 + 1.5*IQR)])
        df_clean['Fare'] = mstats.winsorize(df_clean['Fare'], limits=[0.01, 0.01])
        print(f"[Fare] {before}개 이상치 Winsorizing 처리")

    return df_clean

df_clean = handle_outliers(df_no_missing)

# =============================================================================
# 5. sklearn Pipeline 구축
# =============================================================================
print("\\n" + "=" * 60)
print("5. sklearn Pipeline 구축")
print("=" * 60)

# 피처와 타겟 분리
X = df_clean.drop(['PassengerId', 'Survived'], axis=1)
y = df_clean['Survived']

# 컬럼 정의
numerical_cols = ['Age', 'Fare']
categorical_cols = ['Cabin', 'Embarked', 'Pclass', 'VIP']

# 수치형 파이프라인
numerical_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', RobustScaler())
])

# 범주형 파이프라인
categorical_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

# ColumnTransformer
preprocessor = ColumnTransformer([
    ('numerical', numerical_pipeline, numerical_cols),
    ('categorical', categorical_pipeline, categorical_cols)
])

# 전체 Pipeline
full_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

print("Pipeline 구조:")
print(full_pipeline)

# =============================================================================
# 6. 결과 검증
# =============================================================================
print("\\n" + "=" * 60)
print("6. 결과 검증")
print("=" * 60)

# 처리 전후 비교
print("\\n--- 처리 전후 비교 ---")
print(f"\\n[Age]")
print(f"  원본 - Mean: {df['Age'].mean():.2f}, Std: {df['Age'].std():.2f}")
print(f"  처리 - Mean: {df_clean['Age'].mean():.2f}, Std: {df_clean['Age'].std():.2f}")

print(f"\\n[Fare]")
print(f"  원본 - Mean: {df['Fare'].mean():.2f}, Std: {df['Fare'].std():.2f}")
print(f"  처리 - Mean: {df_clean['Fare'].mean():.2f}, Std: {df_clean['Fare'].std():.2f}")

# 교차 검증
print("\\n--- 교차 검증 ---")
cv_scores = cross_val_score(full_pipeline, X, y, cv=5, scoring='accuracy')
print(f"CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std()*2:.4f})")

# =============================================================================
# 7. 결론
# =============================================================================
print("\\n" + "=" * 60)
print("7. 결론 및 권고사항")
print("=" * 60)

print("""
## 주요 발견

1. **결측치**
   - Cabin: 60% 결측 → 'Unknown' 범주로 처리
   - Age, Fare: 10% 미만 → 중앙값/그룹별 대체

2. **이상치**
   - Age: 비현실적 값 (음수, 120+ 세) → 클리핑
   - Fare: 극단적 고액 요금 → Winsorizing

3. **인코딩**
   - Pclass: 순서형이지만 One-Hot으로 처리 (클래스 간 동등 취급)
   - Cabin: 고카디널리티지만 Unknown 처리로 단순화

## 권고사항

1. 더 정교한 Cabin 처리 (첫 글자만 추출 등)
2. Age 결측 처리 시 성별/클래스별 그룹 대체 고려
3. Feature Engineering 추가 (가족 크기, 요금/인 등)
""")

print("\\n프로젝트 완료!")
`,
      hints: [
        '데이터 품질 평가는 처리 전에 수행하고 문서화합니다',
        '결측치 처리 전에 메커니즘(MCAR/MAR/MNAR)을 진단합니다',
        'sklearn Pipeline을 사용하면 전처리와 모델링을 한 번에 관리할 수 있습니다',
        '처리 전후 분포 비교로 편향 여부를 확인합니다'
      ]
    }
  },
  {
    id: 'p2w2d5t3',
    type: 'quiz',
    title: 'Week 10 종합 퀴즈',
    duration: 20,
    content: {
      questions: [
        {
          question: '데이터 품질 6차원에 포함되지 않는 것은?',
          options: ['완전성 (Completeness)', '정확성 (Accuracy)', '복잡성 (Complexity)', '일관성 (Consistency)'],
          answer: 2,
          explanation: '데이터 품질 6차원은 완전성, 정확성, 일관성, 적시성, 유효성, 유일성입니다. 복잡성은 품질 차원이 아니라 데이터 구조의 특성입니다.'
        },
        {
          question: '결측 메커니즘 중 "결측이 다른 관측 변수와 관련"인 것은?',
          options: ['MCAR', 'MAR', 'MNAR', 'Random'],
          answer: 1,
          explanation: 'MAR(Missing At Random)은 결측이 다른 관측 변수와 관련됩니다. 예: 남성이 여성보다 소득 미응답 비율이 높은 경우. MCAR은 완전 무작위, MNAR은 결측값 자체와 관련됩니다.'
        },
        {
          question: 'KNN Imputer의 특징이 아닌 것은?',
          options: ['유사한 행의 값으로 대체', '다변량 관계 고려', '범주형 변수에 직접 적용 가능', '대규모 데이터에서 느림'],
          answer: 2,
          explanation: 'KNN Imputer는 수치형 변수에만 직접 적용 가능합니다. 범주형 변수는 먼저 인코딩해야 합니다. 유사한 K개 행을 찾아 대체하며, 거리 계산으로 인해 대규모 데이터에서 느립니다.'
        },
        {
          question: '이상치에 강건한 스케일러는?',
          options: ['StandardScaler', 'MinMaxScaler', 'RobustScaler', 'MaxAbsScaler'],
          answer: 2,
          explanation: 'RobustScaler는 중앙값과 IQR을 사용하여 이상치의 영향을 받지 않습니다. StandardScaler는 평균/표준편차, MinMaxScaler와 MaxAbsScaler는 최소/최대값을 사용해 이상치에 민감합니다.'
        },
        {
          question: 'One-Hot Encoding의 단점은?',
          options: ['순서 정보 손실', '고카디널리티에서 차원 폭발', '범주 정보 손실', '해석 어려움'],
          answer: 1,
          explanation: 'One-Hot Encoding은 카테고리 수만큼 컬럼이 생성되어, 고카디널리티(많은 고유값)에서 차원이 폭발적으로 증가합니다. 1000개 카테고리 = 1000개 컬럼이 생성됩니다.'
        },
        {
          question: 'Target Encoding 시 과적합을 방지하는 방법은?',
          options: ['더 많은 카테고리 사용', 'CV 방식 적용', 'Standardization', 'Drop First'],
          answer: 1,
          explanation: 'Target Encoding은 타겟 정보를 직접 사용하므로 과적합 위험이 있습니다. K-Fold CV 방식으로 각 fold에서 다른 fold의 타겟 평균을 사용하면 과적합을 효과적으로 방지할 수 있습니다.'
        },
        {
          question: 'sklearn ColumnTransformer의 용도는?',
          options: ['모델 학습', '컬럼 유형별 다른 전처리 적용', '데이터 로드', '성능 평가'],
          answer: 1,
          explanation: 'ColumnTransformer는 수치형과 범주형 등 컬럼 유형별로 다른 전처리 파이프라인을 적용할 수 있게 해줍니다. 예: 수치형은 StandardScaler, 범주형은 OneHotEncoder.'
        },
        {
          question: '데이터 누수를 방지하기 위해 스케일러는 어디에서 fit해야 하는가?',
          options: ['전체 데이터', '학습 데이터만', '테스트 데이터만', '검증 데이터'],
          answer: 1,
          explanation: '스케일러는 학습 데이터에서만 fit해야 합니다. 테스트 데이터의 통계치가 모델 학습에 사용되면 데이터 누수가 발생하며, 실제 예측 상황을 반영하지 못합니다.'
        },
        {
          question: 'Winsorizing의 효과는?',
          options: ['결측치 대체', '극단값을 경계값으로 대체', '분포를 정규화', '차원 축소'],
          answer: 1,
          explanation: 'Winsorizing은 상하위 특정 퍼센타일(예: 1%, 99%)의 극단값을 해당 경계값으로 대체합니다. 데이터 개수를 유지하면서 극단값의 영향을 줄일 수 있습니다.'
        },
        {
          question: 'IQR 방법에서 이상치 판단 기준은?',
          options: ['평균 ± 3 표준편차', 'Q1-1.5*IQR ~ Q3+1.5*IQR 범위 밖', '상하위 1%', 'Z-score > 2'],
          answer: 1,
          explanation: 'IQR 방법은 Q1 - 1.5×IQR보다 작거나 Q3 + 1.5×IQR보다 큰 값을 이상치로 판단합니다. 분포 가정 없이 사용할 수 있어 가장 널리 쓰이는 이상치 탐지 방법입니다.'
        }
      ]
    }
  },
  {
    id: 'p2w2d5t4',
    type: 'challenge',
    title: '주간 도전과제: 실전 데이터 정제 경쟁',
    duration: 60,
    content: {
      instructions: `# 주간 도전과제: 실전 데이터 정제 경쟁

## 목표
실제 Kaggle 데이터셋을 선택하여 **데이터 정제 파이프라인**을 구축하고, 정제 품질을 정량적으로 측정하세요.

## 추천 데이터셋

| 데이터셋 | 난이도 | 특징 |
|---------|--------|------|
| [Spaceship Titanic](https://www.kaggle.com/competitions/spaceship-titanic) | 중 | 다양한 결측 패턴, 복합 컬럼 파싱 필요 |
| [House Prices](https://www.kaggle.com/c/house-prices-advanced-regression-techniques) | 상 | 79개 피처, 고카디널리티, 다양한 결측 |
| [Playground S4E1](https://www.kaggle.com/competitions/playground-series-s4e1) | 중 | 은행 이탈 예측, 범주형/수치형 혼합 |

## 요구사항

### 1. 데이터 품질 리포트 (20점)
- 6차원 품질 평가 수행
- 각 차원별 점수 산출 (0-100)
- 주요 품질 이슈 3개 이상 식별

### 2. 결측치 처리 전략 (25점)
- 결측 메커니즘 진단 (MCAR/MAR/MNAR)
- 컬럼별 처리 방법 선택 및 근거
- 처리 전후 통계량 비교

### 3. 이상치 처리 전략 (20점)
- 2가지 이상 탐지 방법 적용 (IQR, Z-score 등)
- 도메인 지식 기반 이상치 판단
- 처리 방법 선택 (제거/변환/유지) 및 근거

### 4. sklearn Pipeline 구축 (25점)
- ColumnTransformer로 수치형/범주형 분리 처리
- 전처리 + 모델 통합 파이프라인
- 5-Fold CV 성능 측정

### 5. 모델 성능 개선 측정 (10점)
- 원본 데이터 vs 정제 데이터 성능 비교
- 개선율 계산 및 해석

## 평가 기준

| 항목 | 배점 | 세부 기준 |
|------|------|----------|
| 품질 리포트 | 20점 | 6차원 평가, 시각화, 이슈 식별 |
| 결측치 처리 | 25점 | 메커니즘 진단, 적절한 방법, 문서화 |
| 이상치 처리 | 20점 | 다중 방법, 도메인 지식, 근거 |
| Pipeline | 25점 | 재사용성, 누수 방지, CV 성능 |
| 성능 개선 | 10점 | 정량적 비교, 해석 |

## 보너스 포인트 (+10점)

- Kaggle Notebook으로 공개하여 좋아요 1개 이상 획득
- Feature Engineering 추가 (예: Cabin 첫 글자 추출, 가족 크기)
- 3가지 이상 모델 성능 비교

## 제출 형식

\`\`\`
📁 week10-challenge/
├── data_cleaning_pipeline.ipynb  # 메인 노트북
├── pipeline.pkl                   # 저장된 Pipeline
└── quality_report.md             # 품질 리포트 요약
\`\`\`

## 힌트

- \`df.info()\`와 \`df.describe()\`로 데이터 개요 파악
- \`missingno\` 라이브러리로 결측 패턴 시각화
- \`scipy.stats.chi2_contingency\`로 MAR 진단
- \`joblib.dump(pipeline, 'pipeline.pkl')\`로 파이프라인 저장
`,
      starterCode: `"""
Week 10 도전과제: 실전 데이터 정제 경쟁
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, RobustScaler, OneHotEncoder
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.ensemble import RandomForestClassifier

# =============================================================================
# 1. 데이터 로드
# =============================================================================
# TODO: Kaggle 데이터 로드
# train = pd.read_csv('train.csv')

# 예시 데이터 (실제 Kaggle 데이터로 교체)
np.random.seed(42)
n = 2000
train = pd.DataFrame({
    'PassengerId': range(1, n + 1),
    'HomePlanet': np.random.choice(['Earth', 'Europa', 'Mars', None], n, p=[0.5, 0.2, 0.2, 0.1]),
    'CryoSleep': np.random.choice([True, False, None], n, p=[0.3, 0.6, 0.1]),
    'Cabin': [f"{np.random.choice(['A','B','C','D','E','F','G'])}/{np.random.randint(0, 2000)}/{np.random.choice(['P','S'])}"
              if np.random.random() > 0.3 else None for _ in range(n)],
    'Destination': np.random.choice(['TRAPPIST-1e', '55 Cancri e', 'PSO J318.5-22', None], n, p=[0.6, 0.2, 0.15, 0.05]),
    'Age': np.random.uniform(0, 80, n),
    'VIP': np.random.choice([True, False, None], n, p=[0.05, 0.9, 0.05]),
    'RoomService': np.random.exponential(200, n),
    'FoodCourt': np.random.exponential(300, n),
    'ShoppingMall': np.random.exponential(100, n),
    'Spa': np.random.exponential(250, n),
    'VRDeck': np.random.exponential(150, n),
    'Name': [f"Person_{i}" for i in range(n)],
    'Transported': np.random.choice([True, False], n)
})

# 결측치 및 이상치 추가
train.loc[np.random.choice(n, 200, replace=False), 'Age'] = np.nan
train.loc[10:20, 'Age'] = [-5, 150, 200, 0, 999, -10, 180, 250, 1, 300, 500]
train.loc[np.random.choice(n, 100, replace=False), 'RoomService'] = np.nan
train.loc[50:55, 'RoomService'] = [50000, 100000, -100, 80000, 200000, 150000]

print("=== 데이터 로드 완료 ===")
print(f"Shape: {train.shape}")
print(f"\\n컬럼:\\n{train.columns.tolist()}")

# =============================================================================
# 2. 데이터 품질 평가 (6차원)
# =============================================================================
def evaluate_quality_6d(df):
    """6차원 데이터 품질 평가"""
    scores = {}

    # TODO: 완전성, 정확성, 일관성, 적시성, 유효성, 유일성 평가

    return scores

# =============================================================================
# 3. 결측치 분석 및 처리
# =============================================================================
def analyze_and_impute(df):
    """결측치 분석 및 처리"""
    df_clean = df.copy()

    # TODO: 결측 메커니즘 진단
    # TODO: 컬럼별 처리 전략 적용

    return df_clean

# =============================================================================
# 4. 이상치 탐지 및 처리
# =============================================================================
def detect_and_handle_outliers(df):
    """이상치 탐지 및 처리"""
    df_clean = df.copy()

    # TODO: IQR 및 Z-score 이상치 탐지
    # TODO: 처리 전략 적용

    return df_clean

# =============================================================================
# 5. sklearn Pipeline 구축
# =============================================================================
def build_pipeline():
    """전처리 + 모델 파이프라인 구축"""

    # TODO: ColumnTransformer 정의
    # TODO: Pipeline 구축

    pass

# =============================================================================
# 6. 성능 비교
# =============================================================================
def compare_performance(df_original, df_cleaned, target_col):
    """원본 vs 정제 데이터 성능 비교"""

    # TODO: 원본 데이터로 CV 성능
    # TODO: 정제 데이터로 CV 성능
    # TODO: 개선율 계산

    pass

# =============================================================================
# 실행
# =============================================================================
print("\\n도전과제를 완성하세요!")
`,
      hints: [
        '품질 평가: df.isnull().mean(), df.duplicated().sum() 활용',
        '결측 메커니즘: chi2_contingency로 그룹별 결측률 차이 검정',
        'Cabin 파싱: deck/num/side = cabin.str.split("/", expand=True)',
        'Pipeline 저장: joblib.dump(pipeline, "pipeline.pkl")'
      ]
    }
  }
]
