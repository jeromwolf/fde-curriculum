// Week 10 Day 2: 결측치 처리
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'p2w2d2t1',
    type: 'video',
    title: '결측치 유형과 메커니즘',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 결측치 유형과 메커니즘

## 왜 결측치가 발생하는가?

\\\`\\\`\\\`
결측치 발생 원인:
1. 데이터 수집 실패 (센서 오류, 네트워크 장애)
2. 사용자 미입력 (선택 항목)
3. 시스템 간 데이터 누락 (ETL 오류)
4. 의도적 비공개 (개인정보)
5. 해당 없음 (N/A) - 미혼자의 배우자 정보
\\\`\\\`\\\`

## 3가지 결측 메커니즘

### 1. MCAR (Missing Completely At Random)

**정의**: 결측이 완전히 무작위로 발생

\\\`\\\`\\\`
예시:
- 설문지 한 장이 바람에 날아감
- 서버 랜덤 다운으로 일부 로그 누락

특징:
- 결측 발생이 다른 변수와 무관
- 가장 처리하기 쉬움
- 단순 삭제해도 편향 없음
\\\`\\\`\\\`

### 2. MAR (Missing At Random)

**정의**: 결측이 다른 관측 변수와 관련

\\\`\\\`\\\`
예시:
- 남성이 여성보다 소득 미응답 비율 높음
- 젊은 층이 우편번호 미입력 비율 높음

특징:
- 결측 자체의 값과는 무관
- 관측된 다른 변수로 예측 가능
- 조건부 대체 방법 사용
\\\`\\\`\\\`

### 3. MNAR (Missing Not At Random)

**정의**: 결측이 결측값 자체와 관련

\\\`\\\`\\\`
예시:
- 고소득자가 소득 미공개 (실제 소득이 높을수록 미응답)
- 우울증 심한 환자가 설문 미응답 (증상이 심할수록 미응답)

특징:
- 가장 처리하기 어려움
- 도메인 지식 필요
- 단순 대체는 편향 발생
\\\`\\\`\\\`

## 결측 메커니즘 진단

\\\`\\\`\\\`python
import pandas as pd
import numpy as np
from scipy import stats

# 결측 패턴 분석
def analyze_missing_mechanism(df, target_col, group_col):
    """
    MAR vs MCAR 진단
    그룹별 결측 비율이 유의하게 다르면 MAR 가능성
    """
    # 그룹별 결측 비율
    missing_by_group = df.groupby(group_col)[target_col].apply(
        lambda x: x.isnull().mean()
    )
    print(f"\\n그룹별 {target_col} 결측 비율:")
    print(missing_by_group)

    # 카이제곱 검정
    contingency = pd.crosstab(
        df[group_col],
        df[target_col].isnull()
    )
    chi2, p_value, dof, expected = stats.chi2_contingency(contingency)

    print(f"\\n카이제곱 통계량: {chi2:.4f}")
    print(f"p-value: {p_value:.4f}")

    if p_value < 0.05:
        print("→ MAR 가능성 높음 (그룹 간 결측 비율 유의하게 다름)")
    else:
        print("→ MCAR 가능성 (그룹 간 결측 비율 차이 없음)")

# 예시: 성별에 따른 소득 결측 패턴
analyze_missing_mechanism(df, 'income', 'gender')
\\\`\\\`\\\`

## 결측 패턴 시각화

\\\`\\\`\\\`python
import missingno as msno

# 결측 매트릭스
msno.matrix(df)
plt.title('Missing Value Matrix')

# 결측 히트맵 (결측 간 상관관계)
msno.heatmap(df)
plt.title('Missing Value Correlation')

# 결측 덴드로그램 (결측 클러스터링)
msno.dendrogram(df)
plt.title('Missing Value Dendrogram')
\\\`\\\`\\\`
`,
      objectives: [
        'MCAR, MAR, MNAR의 차이를 이해한다',
        '결측 메커니즘을 진단하는 방법을 안다',
        'missingno로 결측 패턴을 시각화할 수 있다'
      ],
      keyPoints: [
        'MCAR: 완전 무작위 - 단순 삭제 가능',
        'MAR: 관측 변수와 관련 - 조건부 대체',
        'MNAR: 결측값 자체와 관련 - 도메인 지식 필요',
        '카이제곱 검정으로 MAR/MCAR 진단'
      ]
    }
  },
  {
    id: 'p2w2d2t2',
    type: 'video',
    title: '결측치 처리 방법 (삭제 & 대체)',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 결측치 처리 방법

## 1. 삭제 방법

### 행 삭제 (Listwise Deletion)

\\\`\\\`\\\`python
# 결측이 있는 행 전체 삭제
df_clean = df.dropna()

# 특정 컬럼에 결측이 있는 행만 삭제
df_clean = df.dropna(subset=['important_col1', 'important_col2'])

# 50% 이상 결측인 행만 삭제
threshold = len(df.columns) * 0.5
df_clean = df.dropna(thresh=threshold)
\\\`\\\`\\\`

**언제 사용?**
- MCAR이고 결측 비율 < 5%
- 데이터가 충분히 많을 때
- 분석에 필수적이지 않은 행일 때

### 열 삭제 (Variable Deletion)

\\\`\\\`\\\`python
# 결측 비율이 높은 컬럼 삭제
missing_ratio = df.isnull().mean()
cols_to_drop = missing_ratio[missing_ratio > 0.5].index
df_clean = df.drop(columns=cols_to_drop)
\\\`\\\`\\\`

**언제 사용?**
- 결측 비율 > 50%
- 해당 변수의 중요도가 낮을 때
- 대체가 의미 없을 때

## 2. 단순 대체 방법

### 평균/중앙값/최빈값 대체

\\\`\\\`\\\`python
from sklearn.impute import SimpleImputer

# 수치형: 평균 대체
num_imputer = SimpleImputer(strategy='mean')
df['income'] = num_imputer.fit_transform(df[['income']])

# 수치형: 중앙값 대체 (이상치에 강건)
num_imputer = SimpleImputer(strategy='median')
df['income'] = num_imputer.fit_transform(df[['income']])

# 범주형: 최빈값 대체
cat_imputer = SimpleImputer(strategy='most_frequent')
df['category'] = cat_imputer.fit_transform(df[['category']])

# 상수 대체
const_imputer = SimpleImputer(strategy='constant', fill_value='Unknown')
df['category'] = const_imputer.fit_transform(df[['category']])
\\\`\\\`\\\`

**장점**: 단순, 빠름
**단점**: 분산 감소, 상관관계 왜곡

### 그룹별 대체

\\\`\\\`\\\`python
# 그룹별 중앙값 대체
df['income'] = df.groupby('department')['income'].transform(
    lambda x: x.fillna(x.median())
)

# 그룹별 평균 대체
df['age'] = df.groupby('gender')['age'].transform(
    lambda x: x.fillna(x.mean())
)
\\\`\\\`\\\`

**장점**: MAR 패턴 반영
**단점**: 그룹이 작으면 불안정

## 3. 고급 대체 방법

### KNN Imputer

\\\`\\\`\\\`python
from sklearn.impute import KNNImputer

# K=5 이웃 기반 대체
knn_imputer = KNNImputer(n_neighbors=5, weights='distance')
df_imputed = pd.DataFrame(
    knn_imputer.fit_transform(df[numerical_cols]),
    columns=numerical_cols
)
\\\`\\\`\\\`

**원리**: 유사한 K개 행의 평균으로 대체
**장점**: 변수 간 관계 고려
**단점**: 느림, 대규모 데이터에 부적합

### Iterative Imputer (MICE)

\\\`\\\`\\\`python
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer

# 다중 대체 (MICE: Multiple Imputation by Chained Equations)
mice_imputer = IterativeImputer(
    max_iter=10,
    random_state=42,
    initial_strategy='median'
)
df_imputed = pd.DataFrame(
    mice_imputer.fit_transform(df[numerical_cols]),
    columns=numerical_cols
)
\\\`\\\`\\\`

**원리**: 각 변수를 다른 변수로 반복 예측
**장점**: 다변량 관계 반영, 불확실성 고려
**단점**: 느림, 복잡

## 4. 시계열 대체

\\\`\\\`\\\`python
# 앞 값으로 채우기 (Forward Fill)
df['value'] = df['value'].fillna(method='ffill')

# 뒤 값으로 채우기 (Backward Fill)
df['value'] = df['value'].fillna(method='bfill')

# 선형 보간
df['value'] = df['value'].interpolate(method='linear')

# 시간 가중 보간
df['value'] = df['value'].interpolate(method='time')
\\\`\\\`\\\`

## 방법 선택 가이드

| 상황 | 권장 방법 |
|------|----------|
| MCAR, 결측 < 5% | 행 삭제 |
| 수치형, 적은 결측 | 중앙값 대체 |
| 수치형, MAR | 그룹별 대체 또는 KNN |
| 범주형 | 최빈값 또는 "Unknown" |
| 다변량 결측 | Iterative Imputer |
| 시계열 | 보간법 |
| 결측 > 50% | 컬럼 삭제 |
`,
      objectives: [
        '삭제와 대체 방법의 차이를 이해한다',
        '상황에 맞는 결측치 처리 방법을 선택할 수 있다',
        'sklearn의 Imputer를 활용할 수 있다'
      ],
      keyPoints: [
        '삭제: MCAR이고 결측 비율 낮을 때',
        '단순 대체: 빠르지만 분산 감소',
        'KNN: 유사 데이터 기반, 중소 데이터에 적합',
        'MICE: 다변량 관계 반영, 가장 정교'
      ]
    }
  },
  {
    id: 'p2w2d2t3',
    type: 'code',
    title: '실습: 결측치 처리 파이프라인',
    duration: 45,
    content: {
      instructions: `# 결측치 처리 파이프라인 실습

## 목표
다양한 결측 패턴을 가진 데이터셋에서 적절한 결측치 처리 전략을 적용하세요.

## 요구사항

### 1. 결측 패턴 분석
- missingno로 결측 패턴 시각화
- 결측 메커니즘 진단 (MCAR vs MAR)

### 2. 처리 전략 수립
- 각 컬럼별 처리 방법 결정
- 결정 근거 문서화

### 3. 처리 적용
- 수치형: KNN 또는 그룹별 중앙값
- 범주형: 최빈값 또는 Unknown
- 높은 결측률 컬럼: 삭제 고려

### 4. 결과 검증
- 처리 전후 분포 비교
- 상관관계 변화 확인

## 제출물
- 완성된 Python 코드
- 처리 전후 비교 시각화
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.impute import SimpleImputer, KNNImputer

# 샘플 데이터 생성
np.random.seed(42)
n = 500

df = pd.DataFrame({
    'customer_id': range(1, n + 1),
    'gender': np.random.choice(['M', 'F'], n),
    'age': np.random.randint(20, 70, n).astype(float),
    'income': np.random.normal(50000, 15000, n),
    'education': np.random.choice(['High School', 'Bachelor', 'Master', 'PhD'], n),
    'purchase_amount': np.random.exponential(200, n),
    'loyalty_score': np.random.randint(1, 100, n).astype(float),
    'optional_field': np.random.choice(['A', 'B', 'C', None], n, p=[0.2, 0.2, 0.1, 0.5])
})

# 결측 패턴 추가 (MAR: 성별에 따라 소득 결측)
df.loc[(df['gender'] == 'M') & (np.random.random(n) < 0.3), 'income'] = np.nan
df.loc[(df['gender'] == 'F') & (np.random.random(n) < 0.1), 'income'] = np.nan

# MCAR: 무작위 결측
df.loc[np.random.choice(n, 50, replace=False), 'age'] = np.nan
df.loc[np.random.choice(n, 30, replace=False), 'loyalty_score'] = np.nan

print("=== 원본 데이터 정보 ===")
print(f"Shape: {df.shape}")
print(f"\\n결측치 현황:")
print(df.isnull().sum())
print(f"\\n결측 비율:")
print((df.isnull().sum() / len(df) * 100).round(2))

# TODO: 결측치 처리 파이프라인 구현

# 1. 결측 패턴 분석
def analyze_missing_pattern(df):
    """결측 패턴을 분석합니다."""
    # 여기에 코드 작성
    pass

# 2. 결측 메커니즘 진단
def diagnose_mechanism(df, target_col, group_col):
    """MAR vs MCAR를 진단합니다."""
    # 여기에 코드 작성
    pass

# 3. 결측치 처리
def impute_missing(df):
    """결측치를 처리합니다."""
    df_clean = df.copy()

    # 수치형 처리
    # TODO: 구현

    # 범주형 처리
    # TODO: 구현

    return df_clean

# 4. 결과 검증
def validate_imputation(df_original, df_imputed):
    """처리 전후를 비교합니다."""
    # 여기에 코드 작성
    pass

# 실행
analyze_missing_pattern(df)
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.impute import SimpleImputer, KNNImputer
from scipy import stats

# 샘플 데이터 생성
np.random.seed(42)
n = 500

df = pd.DataFrame({
    'customer_id': range(1, n + 1),
    'gender': np.random.choice(['M', 'F'], n),
    'age': np.random.randint(20, 70, n).astype(float),
    'income': np.random.normal(50000, 15000, n),
    'education': np.random.choice(['High School', 'Bachelor', 'Master', 'PhD'], n),
    'purchase_amount': np.random.exponential(200, n),
    'loyalty_score': np.random.randint(1, 100, n).astype(float),
    'optional_field': np.random.choice(['A', 'B', 'C', None], n, p=[0.2, 0.2, 0.1, 0.5])
})

# 결측 패턴 추가
df.loc[(df['gender'] == 'M') & (np.random.random(n) < 0.3), 'income'] = np.nan
df.loc[(df['gender'] == 'F') & (np.random.random(n) < 0.1), 'income'] = np.nan
df.loc[np.random.choice(n, 50, replace=False), 'age'] = np.nan
df.loc[np.random.choice(n, 30, replace=False), 'loyalty_score'] = np.nan

print("=== 원본 데이터 정보 ===")
print(f"Shape: {df.shape}")
print(f"\\n결측치 현황:")
print(df.isnull().sum())

# 1. 결측 패턴 분석
def analyze_missing_pattern(df):
    """결측 패턴을 분석합니다."""
    print("\\n=== 1. 결측 패턴 분석 ===")

    # 결측 비율
    missing_pct = (df.isnull().sum() / len(df) * 100).round(2)
    print("\\n결측 비율 (%):")
    print(missing_pct.sort_values(ascending=False))

    # 결측 패턴 시각화 (텍스트 버전)
    print("\\n결측 패턴 요약:")
    for col in df.columns:
        pct = missing_pct[col]
        bar = '█' * int(pct / 5) + '░' * (20 - int(pct / 5))
        print(f"  {col:20} [{bar}] {pct:.1f}%")

analyze_missing_pattern(df)

# 2. 결측 메커니즘 진단
def diagnose_mechanism(df, target_col, group_col):
    """MAR vs MCAR를 진단합니다."""
    print(f"\\n=== 2. 결측 메커니즘 진단: {target_col} by {group_col} ===")

    # 그룹별 결측 비율
    missing_by_group = df.groupby(group_col)[target_col].apply(
        lambda x: x.isnull().mean() * 100
    )
    print(f"\\n그룹별 {target_col} 결측 비율 (%):")
    print(missing_by_group)

    # 카이제곱 검정
    contingency = pd.crosstab(df[group_col], df[target_col].isnull())
    chi2, p_value, dof, expected = stats.chi2_contingency(contingency)

    print(f"\\n카이제곱 검정:")
    print(f"  chi2 = {chi2:.4f}, p-value = {p_value:.4f}")

    if p_value < 0.05:
        print(f"  → MAR: {group_col}에 따라 결측 패턴이 다름")
        return 'MAR'
    else:
        print(f"  → MCAR: {group_col}과 무관한 결측")
        return 'MCAR'

income_mechanism = diagnose_mechanism(df, 'income', 'gender')

# 3. 결측치 처리
def impute_missing(df):
    """결측치를 처리합니다."""
    print("\\n=== 3. 결측치 처리 ===")
    df_clean = df.copy()

    # 처리 전략 정의
    strategy = {
        'age': '중앙값 (MCAR, 수치형)',
        'income': '그룹별 중앙값 (MAR by gender)',
        'loyalty_score': 'KNN (수치형, 관계 고려)',
        'education': '최빈값 (범주형)',
        'optional_field': '삭제 (결측 50% 이상)'
    }

    print("\\n처리 전략:")
    for col, method in strategy.items():
        print(f"  {col}: {method}")

    # age: 중앙값 대체
    median_age = df_clean['age'].median()
    df_clean['age'] = df_clean['age'].fillna(median_age)
    print(f"\\n[age] 중앙값 {median_age:.1f}으로 대체 완료")

    # income: 그룹별 중앙값 대체 (MAR)
    df_clean['income'] = df_clean.groupby('gender')['income'].transform(
        lambda x: x.fillna(x.median())
    )
    print("[income] 성별 그룹별 중앙값으로 대체 완료")

    # loyalty_score: KNN Imputer
    numerical_for_knn = ['age', 'income', 'purchase_amount', 'loyalty_score']
    knn_imputer = KNNImputer(n_neighbors=5)
    df_clean[numerical_for_knn] = knn_imputer.fit_transform(df_clean[numerical_for_knn])
    print("[loyalty_score] KNN Imputer로 대체 완료")

    # education: 최빈값 대체 (결측 없지만 예시)
    mode_education = df_clean['education'].mode()[0]
    df_clean['education'] = df_clean['education'].fillna(mode_education)

    # optional_field: 결측 50% 이상이므로 삭제
    df_clean = df_clean.drop(columns=['optional_field'])
    print("[optional_field] 결측률 50% 초과로 컬럼 삭제")

    return df_clean

df_imputed = impute_missing(df)

# 4. 결과 검증
def validate_imputation(df_original, df_imputed):
    """처리 전후를 비교합니다."""
    print("\\n=== 4. 결과 검증 ===")

    # 결측치 확인
    print("\\n처리 후 결측치:")
    print(df_imputed.isnull().sum())

    # 분포 비교 (income)
    print("\\n[income] 분포 비교:")
    print(f"  원본 - Mean: {df_original['income'].mean():.2f}, Std: {df_original['income'].std():.2f}")
    print(f"  처리 후 - Mean: {df_imputed['income'].mean():.2f}, Std: {df_imputed['income'].std():.2f}")

    # 상관관계 비교
    original_corr = df_original[['age', 'income', 'purchase_amount']].corr()
    imputed_corr = df_imputed[['age', 'income', 'purchase_amount']].corr()

    print("\\n[상관관계 비교]")
    print("원본:")
    print(original_corr.round(3))
    print("\\n처리 후:")
    print(imputed_corr.round(3))

validate_imputation(df, df_imputed)

print("\\n" + "="*50)
print("결측치 처리 완료!")
print(f"원본: {df.shape} → 처리 후: {df_imputed.shape}")
`,
      hints: [
        'df.groupby().transform()으로 그룹별 대체가 가능합니다',
        'KNNImputer는 수치형 컬럼에만 적용됩니다',
        '결측 비율 50% 이상은 컬럼 삭제를 고려하세요',
        '처리 전후 분포 비교로 편향 여부를 확인합니다'
      ]
    }
  },
  {
    id: 'p2w2d2t4',
    type: 'quiz',
    title: 'Day 2 퀴즈: 결측치 처리',
    duration: 10,
    content: {
      questions: [
        {
          question: '결측값 자체가 결측 발생과 관련 있는 메커니즘은?',
          options: ['MCAR', 'MAR', 'MNAR', 'Random'],
          answer: 2
        },
        {
          question: 'KNN Imputer의 원리는?',
          options: ['전체 평균으로 대체', '유사한 K개 행의 평균으로 대체', '랜덤 값으로 대체', '이전 값으로 대체'],
          answer: 1
        },
        {
          question: 'MAR (Missing At Random) 상황에서 권장되는 처리 방법은?',
          options: ['행 삭제', '전체 평균 대체', '그룹별 대체 또는 조건부 대체', '컬럼 삭제'],
          answer: 2
        },
        {
          question: '시계열 데이터에서 결측치 처리에 적합한 방법은?',
          options: ['전체 평균 대체', 'KNN Imputer', '보간법 (Interpolation)', '최빈값 대체'],
          answer: 2
        },
        {
          question: 'Iterative Imputer (MICE)의 특징이 아닌 것은?',
          options: ['다변량 관계를 반영한다', '반복적으로 값을 예측한다', '가장 빠른 방법이다', '불확실성을 고려한다'],
          answer: 2
        }
      ]
    }
  }
]
