# Phase 2: 데이터 분석 & 컨설팅 (8주)

> 목표: 비즈니스 문제를 정의하고, 데이터에서 인사이트를 추출하며, ML 모델로 예측/분류/이상탐지를 수행하고, 경영진에게 효과적으로 전달할 수 있다.
>
> 기간: 2개월 (8주)
>
> 포트폴리오: 데이터 분석 프로젝트 + 경영진 보고서

---

## 🚀 Phase 2를 시작하며

Phase 1에서 데이터를 **수집, 처리, 저장**하는 파이프라인을 구축할 수 있게 되었습니다.

하지만 FDE는 단순히 "데이터를 다루는 사람"이 아닙니다.
**비즈니스 문제를 정의하고, 데이터로 해결책을 찾는 사람**입니다.

Phase 2에서는:
- **"무엇을"** 분석할지 정의하는 방법 (5 Whys, MECE)
- **"어떻게"** 인사이트를 도출할지 (EDA, ML)
- **"어떻게"** 전달할지 (Pyramid Principle, 경영진 발표)

를 배웁니다.

> **기술적 역량(Phase 1) + 비즈니스 역량(Phase 2) = FDE의 차별화된 가치**

---

## 💡 Phase 2의 핵심: "왜" + "어떻게"

Phase 1에서 데이터 엔지니어링 기초를 배웠다면, Phase 2에서는 **비즈니스 문제 해결** 관점을 추가합니다.

```
Phase 1: "데이터를 어떻게 다루는가?" (기술)
Phase 2: "왜 분석하는가?" + "어떻게 인사이트를 도출하는가?" (기술 + 비즈니스)
```

### FDE vs 일반 데이터 분석가

| 역할 | 시작점 | 핵심 질문 |
|------|--------|----------|
| **데이터 분석가** | "이 데이터 분석해주세요" | How? |
| **FDE** | "매출이 떨어지고 있어요" | Why? What? Then How? |

---

## Month 3: 문제 정의 & EDA

---

### Week 9: 비즈니스 문제 정의 & EDA 기초

#### 학습 목표
- [ ] 비즈니스 문제와 증상을 구분할 수 있다
- [ ] 5 Whys, MECE로 문제를 구조화할 수 있다
- [ ] 데이터의 분포, 중심 경향, 산포도를 분석할 수 있다
- [ ] 효과적인 시각화를 통해 인사이트를 전달할 수 있다

#### 핵심 개념

**1. 문제 정의 (분석 전 필수!)**

```
❌ 잘못된 접근:
"Python 배웠어요" → "Pandas 배웠어요" → "근데 뭘 분석해야 하죠?"

✅ 올바른 접근:
"고객 이탈이 문제예요" → "어떤 데이터가 있죠?" → "가설을 세워봅시다"
→ "이걸 검증하려면 이런 분석이 필요해요" → "Python으로 구현합니다"
```

**문제 vs 증상**
```
증상: "매출이 20% 감소했어요"
     ↓ Why?
문제: "신규 고객 유입은 동일한데 재구매율이 급감"
     ↓ Why?
근본 원인: "경쟁사 대비 배송 시간이 2배 → 고객 만족도 하락"
```

**5 Whys 기법**
```markdown
1. Why: 대시보드 데이터가 업데이트 안 됨 → ETL 작업 실패
2. Why: ETL 작업이 왜 실패? → 소스 DB 연결 타임아웃
3. Why: 왜 타임아웃? → 쿼리 실행 시간 30분 초과
4. Why: 왜 쿼리가 느려졌나? → 테이블 10배 증가, 인덱스 없음
5. Why: 왜 인덱스가 없나? → 초기 설계 시 예측 실패

→ 근본 원인: 데이터 모델링/용량 계획 부재
→ 해결책: 인덱스 추가 + 파티셔닝 + 모니터링
```

**MECE (Mutually Exclusive, Collectively Exhaustive)**
```
문제: "왜 고객이 이탈하는가?"

MECE 분해:
┌─────────────────────────────────────────────┐
│              고객 이탈 원인                  │
├─────────────┬─────────────┬─────────────────┤
│   제품 문제  │  서비스 문제 │   외부 요인     │
├─────────────┼─────────────┼─────────────────┤
│ • 품질 불만  │ • 배송 지연  │ • 경쟁사 프로모션│
│ • 가격 불만  │ • CS 불만족  │ • 경기 침체     │
│ • 기능 부족  │ • 반품 어려움│ • 계절적 요인   │
└─────────────┴─────────────┴─────────────────┘

✅ 상호 배타적: 각 카테고리가 겹치지 않음
✅ 전체 포괄적: 모든 가능한 원인 포함
```

**2. 통계 기초**
```python
import pandas as pd
import numpy as np

# 중심 경향
df['value'].mean()      # 평균 - 이상치에 민감
df['value'].median()    # 중앙값 - 이상치에 강건
df['value'].mode()      # 최빈값 - 범주형에 유용

# 산포도
df['value'].std()       # 표준편차
df['value'].var()       # 분산
df['value'].quantile([0.25, 0.5, 0.75])  # 사분위수
df['value'].max() - df['value'].min()    # 범위

# 분포 형태
from scipy.stats import skew, kurtosis
skew(df['value'])       # 왜도 (0: 대칭, >0: 오른쪽 꼬리)
kurtosis(df['value'])   # 첨도 (0: 정규분포)

# 상관관계
df.corr()               # 피어슨 상관계수
df.corr(method='spearman')  # 스피어만 (순위 기반)
```

| 지표 | 의미 | 사용 시점 |
|------|------|----------|
| 평균 vs 중앙값 | 차이 크면 왜곡된 분포 | 이상치 존재 파악 |
| 표준편차 | 데이터 퍼짐 정도 | 변동성 분석 |
| 왜도 | 분포 비대칭성 | 로그 변환 필요성 판단 |
| 상관계수 | 변수 간 선형 관계 | 피처 선택 |

**2. 시각화 (matplotlib, seaborn, plotly)**
```python
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px

# 분포 시각화
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
sns.histplot(df['value'], kde=True, ax=axes[0])  # 히스토그램
sns.boxplot(x=df['value'], ax=axes[1])           # 박스플롯
sns.violinplot(x=df['value'], ax=axes[2])        # 바이올린

# 관계 시각화
sns.scatterplot(x='feature1', y='target', hue='category', data=df)
sns.pairplot(df[numerical_cols])  # 모든 조합 산점도

# 상관관계 히트맵
plt.figure(figsize=(10, 8))
sns.heatmap(df.corr(), annot=True, cmap='RdBu_r', center=0)

# 인터랙티브 시각화 (Plotly)
fig = px.scatter(df, x='feature1', y='target', color='category',
                 hover_data=['id', 'date'], title='Feature vs Target')
fig.show()
```

| 차트 유형 | 용도 | 변수 유형 |
|----------|------|----------|
| 히스토그램 | 분포 | 수치형 1개 |
| 박스플롯 | 분포 + 이상치 | 수치형 1개 |
| 산점도 | 관계 | 수치형 2개 |
| 히트맵 | 상관관계 | 수치형 다수 |
| 막대 그래프 | 카운트/비교 | 범주형 |
| 라인 차트 | 추세 | 시계열 |

**3. 결측치 분석**
```python
# 결측치 현황
df.isnull().sum()
df.isnull().sum() / len(df) * 100  # 비율

# 결측치 시각화
import missingno as msno
msno.matrix(df)        # 결측 패턴 매트릭스
msno.heatmap(df)       # 결측 상관관계
msno.dendrogram(df)    # 결측 클러스터링

# 결측 유형 판단
# MCAR (완전 무작위): 결측이 다른 변수와 무관
# MAR (무작위): 관측된 변수와 관련
# MNAR (비무작위): 결측값 자체와 관련
```

| 결측 유형 | 특징 | 처리 방법 |
|----------|------|----------|
| MCAR | 완전 무작위 | 삭제 또는 대체 |
| MAR | 다른 변수와 관련 | 조건부 대체 |
| MNAR | 결측값 자체와 관련 | 도메인 지식 필요 |

**4. 이상치 탐지 (기초)**
```python
# IQR 방법
Q1 = df['value'].quantile(0.25)
Q3 = df['value'].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR
outliers = df[(df['value'] < lower) | (df['value'] > upper)]

# Z-score 방법
from scipy import stats
z_scores = np.abs(stats.zscore(df['value']))
outliers = df[z_scores > 3]

# 시각화
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
sns.boxplot(x=df['value'], ax=axes[0])
axes[0].set_title('Boxplot - Outliers')
sns.scatterplot(x=range(len(df)), y=df['value'], ax=axes[1])
axes[1].axhline(upper, color='r', linestyle='--')
axes[1].axhline(lower, color='r', linestyle='--')
```

#### 실습 과제

**과제: 실제 데이터셋 EDA 리포트**

```
데이터 선택 (1개):
1. Kaggle: House Prices (주택 가격 예측)
2. Kaggle: Titanic (생존 예측)
3. UCI: Adult Income (소득 분류)
4. 자체 수집 데이터

요구사항:
1. 데이터 개요 (shape, dtypes, 샘플)
2. 수치형 변수 분석:
   - 기술 통계량 (mean, std, min, max, percentiles)
   - 분포 시각화 (히스토그램, 박스플롯)
   - 왜도/첨도 분석
3. 범주형 변수 분석:
   - 카테고리별 빈도
   - 막대 그래프
4. 결측치 분석:
   - 결측 비율
   - 결측 패턴 (missingno)
   - 결측 유형 추정
5. 이상치 분석:
   - IQR / Z-score 탐지
   - 이상치 특성 분석
6. 변수 간 관계:
   - 상관관계 히트맵
   - 타겟과의 관계 시각화
7. 인사이트 요약 (3-5개)

산출물:
- Jupyter Notebook (코드 + 마크다운 설명)
- 최소 10개 시각화
- 인사이트 요약 섹션
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 완성도 | 7개 분석 항목 모두 포함 | 30% |
| 시각화 품질 | 명확한 제목, 레이블, 해석 | 25% |
| 인사이트 | 실행 가능한 발견 3개 이상 | 25% |
| 코드 품질 | 함수화, 주석, 재사용성 | 10% |
| 프레젠테이션 | 논리적 흐름 | 10% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 책 | Python for Data Analysis (Wes McKinney) | - |
| 코스 | Kaggle EDA Course | https://www.kaggle.com/learn/data-visualization |
| 영상 | StatQuest - Statistics | https://www.youtube.com/c/joshstarmer |
| 도구 | ydata-profiling (자동 EDA) | https://github.com/ydataai/ydata-profiling |
| 참고 | Kaggle 우승자 EDA 노트북 | https://www.kaggle.com/notebooks?sortBy=voteCount |

---

### Week 10: 데이터 이해 & 전처리

#### 학습 목표
- [ ] 조직 내 데이터 소스를 매핑할 수 있다
- [ ] 데이터 품질 6차원으로 평가할 수 있다
- [ ] 결측치를 적절한 방법으로 처리할 수 있다
- [ ] 이상치를 처리하는 다양한 전략을 적용할 수 있다

#### 핵심 개념

**1. 데이터 소스 매핑**

```
┌─────────────────────────────────────────────────────────────┐
│                    조직 데이터 맵                            │
├─────────────────────────────────────────────────────────────┤
│  [운영 시스템]                                               │
│  ├── ERP (SAP, Oracle)        → 재무, 재고, 구매            │
│  ├── CRM (Salesforce)         → 고객, 영업, 마케팅          │
│  ├── WMS (창고관리)           → 물류, 배송                  │
│  └── POS (매장)               → 거래, 결제                  │
│                                                              │
│  [웹/앱]                                                     │
│  ├── 웹 로그 (GA, Adobe)      → 행동, 전환                  │
│  ├── 앱 이벤트 (Amplitude)    → 사용 패턴                   │
│  └── A/B 테스트 (Optimizely)  → 실험 결과                   │
│                                                              │
│  [데이터 웨어하우스]                                         │
│  ├── Snowflake / BigQuery     → 통합 분석                   │
│  └── Data Lake (S3)           → 원시 데이터                 │
└─────────────────────────────────────────────────────────────┘
```

**2. 데이터 품질 6차원**

| 차원 | 질문 | 체크 방법 |
|------|------|----------|
| **완전성** (Completeness) | 필요한 데이터가 다 있나? | NULL 비율 체크 |
| **정확성** (Accuracy) | 데이터가 실제와 일치하나? | 샘플링 검증 |
| **일관성** (Consistency) | 시스템 간 데이터가 일치하나? | A vs B 비교 |
| **적시성** (Timeliness) | 데이터가 최신인가? | 최종 업데이트 확인 |
| **유효성** (Validity) | 데이터 형식이 올바른가? | 정규식 체크 |
| **유일성** (Uniqueness) | 중복이 없나? | 중복 레코드 탐지 |

```python
"""데이터 품질 기본 프로파일링"""
def profile_dataframe(df):
    profile = {
        'row_count': len(df),
        'column_count': len(df.columns),
        'columns': {}
    }

    for col in df.columns:
        col_profile = {
            'dtype': str(df[col].dtype),
            'null_pct': df[col].isnull().mean() * 100,
            'unique_count': df[col].nunique(),
        }

        # 수치형 컬럼 추가 통계
        if df[col].dtype in ['int64', 'float64']:
            col_profile.update({
                'min': df[col].min(),
                'max': df[col].max(),
                'mean': df[col].mean(),
            })

        profile['columns'][col] = col_profile

    return profile

# 품질 이슈 탐지
for col, stats in profile['columns'].items():
    if stats['null_pct'] > 10:
        print(f"⚠️ {col}: NULL 비율 {stats['null_pct']:.1f}%")
```

**3. 결측치 처리**
```python
# 삭제
df.dropna()                        # 전체 행 삭제
df.dropna(thresh=len(df)*0.5)      # 50% 이상 결측 시 삭제
df.drop(columns=['col_with_many_na'])  # 컬럼 삭제

# 대체 - 단순
df['num'].fillna(df['num'].mean())     # 평균
df['num'].fillna(df['num'].median())   # 중앙값
df['cat'].fillna(df['cat'].mode()[0])  # 최빈값
df['num'].fillna(method='ffill')       # 앞 값으로 (시계열)

# 대체 - 고급
from sklearn.impute import KNNImputer, SimpleImputer
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer

# KNN 대체
imputer = KNNImputer(n_neighbors=5)
df_imputed = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)

# 다중 대체 (MICE)
imputer = IterativeImputer(random_state=42)
df_imputed = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)

# 그룹별 대체
df['value'] = df.groupby('category')['value'].transform(
    lambda x: x.fillna(x.median())
)
```

| 방법 | 장점 | 단점 | 사용 시점 |
|------|------|------|----------|
| 삭제 | 단순 | 데이터 손실 | 결측 5% 미만, MCAR |
| 평균/중앙값 | 단순 | 분산 감소 | 수치형, 적은 결측 |
| KNN | 관계 고려 | 느림 | 중간 규모 데이터 |
| MICE | 불확실성 반영 | 복잡 | 다변량 결측 |

**2. 이상치 처리**
```python
# Winsorizing (극단값 클리핑)
from scipy.stats import mstats
df['value_winsorized'] = mstats.winsorize(df['value'], limits=[0.05, 0.05])

# Clipping (경계값으로 제한)
lower = df['value'].quantile(0.01)
upper = df['value'].quantile(0.99)
df['value_clipped'] = df['value'].clip(lower, upper)

# 로그 변환 (오른쪽 꼬리 축소)
df['value_log'] = np.log1p(df['value'])  # log(1+x) - 0 처리

# 삭제 (명확한 오류)
df = df[df['age'] <= 120]  # 비현실적 값 제거

# 별도 처리 (분리 모델링)
outliers = df[df['value'] > threshold]
normal = df[df['value'] <= threshold]
```

| 방법 | 장점 | 단점 | 사용 시점 |
|------|------|------|----------|
| 제거 | 단순 | 데이터 손실 | 명확한 오류 |
| Winsorize | 데이터 보존 | 정보 손실 | 극단값 축소 |
| 로그 변환 | 분포 정규화 | 해석 변화 | 오른쪽 꼬리 |
| 별도 모델 | 정보 보존 | 복잡 | 이상치가 의미 있을 때 |

**3. 데이터 변환**
```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler
from sklearn.preprocessing import PowerTransformer

# 표준화 (Z-score): 평균 0, 표준편차 1
scaler = StandardScaler()
df['value_std'] = scaler.fit_transform(df[['value']])

# 정규화 (Min-Max): 0~1 범위
scaler = MinMaxScaler()
df['value_norm'] = scaler.fit_transform(df[['value']])

# 로버스트 스케일링: 이상치에 강건 (중앙값, IQR 사용)
scaler = RobustScaler()
df['value_robust'] = scaler.fit_transform(df[['value']])

# 로그 변환
df['value_log'] = np.log1p(df['value'])

# Box-Cox / Yeo-Johnson: 정규분포에 가깝게
pt = PowerTransformer(method='yeo-johnson')  # 음수 포함 가능
df['value_transformed'] = pt.fit_transform(df[['value']])
```

| 변환 | 사용 시점 | 알고리즘 |
|------|----------|----------|
| StandardScaler | 대부분 | SVM, 선형 모델, 신경망 |
| MinMaxScaler | 0-1 범위 필요 | 이미지, 신경망 |
| RobustScaler | 이상치 존재 | 대부분 |
| Log/Box-Cox | 왜곡된 분포 | 선형 모델 |

**4. 범주형 인코딩**
```python
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import category_encoders as ce

# Label Encoding (순서 있는 범주)
le = LabelEncoder()
df['size_encoded'] = le.fit_transform(df['size'])  # S=0, M=1, L=2

# One-Hot Encoding (순서 없는 범주)
df_encoded = pd.get_dummies(df, columns=['color'], drop_first=True)

# Target Encoding (타겟과의 관계 활용)
encoder = ce.TargetEncoder(cols=['category'])
df['category_encoded'] = encoder.fit_transform(df['category'], df['target'])

# Frequency Encoding (빈도 기반)
freq = df['category'].value_counts(normalize=True)
df['category_freq'] = df['category'].map(freq)

# Binary Encoding (고카디널리티)
encoder = ce.BinaryEncoder(cols=['high_cardinality_col'])
df_encoded = encoder.fit_transform(df)
```

| 인코딩 | 카디널리티 | 장점 | 단점 |
|--------|-----------|------|------|
| One-Hot | 낮음 (<10) | 정보 보존 | 차원 폭발 |
| Label | 순서형 | 단순 | 순서 가정 |
| Target | 높음 | 예측력 좋음 | 과적합 위험 |
| Binary | 높음 | 차원 절약 | 정보 손실 |

#### 실습 과제

**과제: 지저분한 데이터 정제 파이프라인**

```
데이터: Kaggle "Spaceship Titanic" 또는 유사한 지저분한 데이터

요구사항:
1. 결측치 처리:
   - 결측 패턴 분석 후 전략 선택
   - 수치형: KNN 또는 그룹별 중앙값
   - 범주형: 최빈값 또는 별도 카테고리
2. 이상치 처리:
   - 탐지 (IQR, Z-score)
   - 전략 선택 및 적용 (근거 포함)
3. 데이터 변환:
   - 왜곡된 변수 식별
   - 적절한 변환 적용
   - 스케일링 적용
4. 인코딩:
   - 범주형 변수 분석
   - 적절한 인코딩 방법 선택
5. sklearn Pipeline으로 구성

산출물:
- Jupyter Notebook
- 처리 전/후 비교 시각화
- sklearn Pipeline 코드
- 각 결정에 대한 근거 문서화
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 결측치 처리 | 적절한 전략 + 근거 | 25% |
| 이상치 처리 | 탐지 + 처리 + 근거 | 25% |
| 변환/인코딩 | 올바른 방법 선택 | 20% |
| Pipeline | 재사용 가능한 코드 | 20% |
| 문서화 | 결정 근거 명확 | 10% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 책 | Feature Engineering for ML (Zheng & Casari) | O'Reilly |
| 코스 | Kaggle Feature Engineering | https://www.kaggle.com/learn/feature-engineering |
| 문서 | sklearn Preprocessing | https://scikit-learn.org/stable/modules/preprocessing.html |
| 라이브러리 | category_encoders | https://contrib.scikit-learn.org/category_encoders/ |

---

### Week 11: Feature Engineering

#### 학습 목표
- [ ] 수치형 피처에서 새로운 피처를 생성할 수 있다
- [ ] 범주형 피처를 효과적으로 변환할 수 있다
- [ ] 시간 피처를 추출하고 활용할 수 있다
- [ ] 텍스트에서 피처를 추출할 수 있다

#### 핵심 개념

**1. 수치형 피처 엔지니어링**
```python
# Binning (구간화)
df['age_group'] = pd.cut(df['age'], bins=[0, 18, 35, 55, 100],
                         labels=['청소년', '청년', '중년', '노년'])

# Polynomial Features (다항 특성)
from sklearn.preprocessing import PolynomialFeatures
poly = PolynomialFeatures(degree=2, include_bias=False)
poly_features = poly.fit_transform(df[['x1', 'x2']])
# x1, x2, x1^2, x1*x2, x2^2

# 상호작용 피처
df['price_per_sqft'] = df['price'] / df['sqft']
df['room_ratio'] = df['bedrooms'] / df['total_rooms']

# 집계 피처 (Groupby)
df['user_avg_spend'] = df.groupby('user_id')['amount'].transform('mean')
df['user_order_count'] = df.groupby('user_id')['order_id'].transform('count')
df['category_median_price'] = df.groupby('category')['price'].transform('median')
```

**Kaggle Grandmaster 팁 (자료조사 반영):**
```python
# Groupby Aggregations - 가장 강력한 기법
agg_features = df.groupby('user_id').agg({
    'amount': ['mean', 'std', 'min', 'max', 'sum', 'count'],
    'category': ['nunique'],
    'timestamp': ['min', 'max']
}).reset_index()
agg_features.columns = ['user_id'] + [f'user_{a}_{b}' for a, b in agg_features.columns[1:]]

# 순위 피처
df['amount_rank'] = df.groupby('category')['amount'].rank(pct=True)
```

**2. 범주형 피처 엔지니어링**
```python
# 희귀 카테고리 처리
freq = df['category'].value_counts(normalize=True)
rare_categories = freq[freq < 0.01].index
df['category_grouped'] = df['category'].replace(rare_categories, 'Other')

# 카테고리 조합
df['location_type'] = df['city'] + '_' + df['property_type']

# Target 통계 (주의: 데이터 누수 방지)
from sklearn.model_selection import KFold

def target_encode_cv(df, col, target, n_splits=5):
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    df[f'{col}_target_enc'] = 0

    for train_idx, val_idx in kf.split(df):
        means = df.iloc[train_idx].groupby(col)[target].mean()
        df.loc[val_idx, f'{col}_target_enc'] = df.loc[val_idx, col].map(means)

    return df
```

**3. 시간 피처**
```python
df['datetime'] = pd.to_datetime(df['timestamp'])

# 기본 추출
df['year'] = df['datetime'].dt.year
df['month'] = df['datetime'].dt.month
df['day'] = df['datetime'].dt.day
df['dayofweek'] = df['datetime'].dt.dayofweek  # 0=월요일
df['hour'] = df['datetime'].dt.hour
df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)

# 주기성 인코딩 (순환 피처)
df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)

# Lag 피처 (시계열)
df['sales_lag_1'] = df.groupby('product')['sales'].shift(1)
df['sales_lag_7'] = df.groupby('product')['sales'].shift(7)
df['sales_rolling_7'] = df.groupby('product')['sales'].transform(
    lambda x: x.shift(1).rolling(7).mean()
)
```

**4. 텍스트 피처**
```python
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer

# 기본 통계
df['text_len'] = df['text'].str.len()
df['word_count'] = df['text'].str.split().str.len()
df['avg_word_len'] = df['text'].apply(lambda x: np.mean([len(w) for w in x.split()]))

# TF-IDF
tfidf = TfidfVectorizer(max_features=100, ngram_range=(1, 2))
tfidf_features = tfidf.fit_transform(df['text'])
tfidf_df = pd.DataFrame(tfidf_features.toarray(),
                        columns=[f'tfidf_{w}' for w in tfidf.get_feature_names_out()])

# 특정 키워드 포함 여부
keywords = ['urgent', 'sale', 'free']
for kw in keywords:
    df[f'has_{kw}'] = df['text'].str.lower().str.contains(kw).astype(int)
```

#### 실습 과제

**과제: Kaggle 스타일 Feature Engineering**

```
데이터: Kaggle "House Prices" 또는 유사 테이블 데이터

요구사항:
1. 원본 피처 분석 (EDA 간략히)
2. 수치형 피처 엔지니어링:
   - 비율/조합 피처 5개 이상
   - Binning 2개 이상
   - Groupby 집계 3개 이상
3. 범주형 피처 엔지니어링:
   - 희귀 카테고리 처리
   - 카테고리 조합
   - Target Encoding (CV 방식)
4. 시간 피처 (해당 시):
   - 기본 추출
   - 순환 인코딩
5. 피처 중요도 분석:
   - 상관관계
   - RandomForest feature_importances_
6. 최종 피처 셋 선정 및 근거

산출물:
- Jupyter Notebook
- 피처 50개 이상 생성
- 최종 선정 피처 목록 + 근거
- 베이스라인 모델 성능 비교 (피처 전/후)
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 피처 수 | 50개 이상 생성 | 20% |
| 피처 품질 | 의미 있는 피처 비율 | 25% |
| 기법 다양성 | 4가지 유형 이상 활용 | 20% |
| 성능 개선 | 베이스라인 대비 개선 | 25% |
| 문서화 | 피처 설명 및 근거 | 10% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 노트북 | Kaggle 우승 FE 사례 | https://www.kaggle.com/code |
| 책 | Feature Engineering for ML | O'Reilly |
| 영상 | Abhishek Thakur - FE Tips | https://www.youtube.com/c/AbhishekThakurAbhi |
| 블로그 | NVIDIA Kaggle Grandmaster Tips | https://developer.nvidia.com/blog/kaggle-grandmasters-unveil-winning-strategies/ |

---

### Week 12: Feature Selection & 차원 축소

#### 학습 목표
- [ ] Filter, Wrapper, Embedded 방법으로 피처를 선택할 수 있다
- [ ] PCA를 적용하여 차원을 축소할 수 있다
- [ ] t-SNE, UMAP으로 고차원 데이터를 시각화할 수 있다
- [ ] 적절한 피처 수를 결정할 수 있다

#### 핵심 개념

**1. Filter Methods**
```python
from sklearn.feature_selection import SelectKBest, f_classif, mutual_info_classif

# 분산 기반
from sklearn.feature_selection import VarianceThreshold
selector = VarianceThreshold(threshold=0.01)
X_filtered = selector.fit_transform(X)

# 상관관계 기반
correlation_matrix = X.corr().abs()
upper = correlation_matrix.where(np.triu(np.ones(correlation_matrix.shape), k=1).astype(bool))
to_drop = [col for col in upper.columns if any(upper[col] > 0.95)]

# 통계 검정 (ANOVA F-value)
selector = SelectKBest(f_classif, k=20)
X_selected = selector.fit_transform(X, y)

# Mutual Information
selector = SelectKBest(mutual_info_classif, k=20)
X_selected = selector.fit_transform(X, y)
```

**2. Wrapper Methods**
```python
from sklearn.feature_selection import RFE, RFECV
from sklearn.ensemble import RandomForestClassifier

# Recursive Feature Elimination
estimator = RandomForestClassifier(n_estimators=100, random_state=42)
selector = RFE(estimator, n_features_to_select=20, step=1)
selector.fit(X, y)
selected_features = X.columns[selector.support_]

# RFE with Cross-Validation (최적 피처 수 자동 결정)
selector = RFECV(estimator, step=1, cv=5, scoring='accuracy')
selector.fit(X, y)
print(f"최적 피처 수: {selector.n_features_}")

# Sequential Feature Selection (Forward/Backward)
from sklearn.feature_selection import SequentialFeatureSelector
sfs = SequentialFeatureSelector(estimator, n_features_to_select=20, direction='forward')
sfs.fit(X, y)
```

**3. Embedded Methods**
```python
from sklearn.linear_model import LassoCV
from sklearn.ensemble import RandomForestClassifier

# Lasso (L1 Regularization)
lasso = LassoCV(cv=5, random_state=42)
lasso.fit(X, y)
selected_features = X.columns[lasso.coef_ != 0]

# Tree-based Feature Importance
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X, y)
importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)

# Permutation Importance (더 신뢰성 있음)
from sklearn.inspection import permutation_importance
perm_importance = permutation_importance(rf, X_test, y_test, n_repeats=10)
```

| 방법 | 장점 | 단점 | 사용 시점 |
|------|------|------|----------|
| Filter | 빠름, 모델 무관 | 피처 상호작용 무시 | 전처리, 빠른 감소 |
| Wrapper | 정확 | 느림, 과적합 가능 | 작은 피처셋 |
| Embedded | 빠름, 정확 | 모델 의존 | 대부분 상황 |

**4. 차원 축소**
```python
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import umap

# PCA
pca = PCA(n_components=0.95)  # 95% 분산 유지
X_pca = pca.fit_transform(X_scaled)
print(f"원본: {X.shape[1]} → PCA: {X_pca.shape[1]}")

# Explained Variance
plt.plot(np.cumsum(pca.explained_variance_ratio_))
plt.xlabel('Number of Components')
plt.ylabel('Cumulative Explained Variance')

# t-SNE (시각화용, 2D/3D)
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X_scaled)
plt.scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap='viridis')

# UMAP (t-SNE보다 빠르고 구조 보존 좋음)
reducer = umap.UMAP(n_components=2, random_state=42)
X_umap = reducer.fit_transform(X_scaled)
```

| 방법 | 용도 | 특징 |
|------|------|------|
| PCA | 피처 압축, 노이즈 제거 | 선형, 빠름 |
| t-SNE | 시각화 (2D/3D) | 비선형, 느림, 클러스터 강조 |
| UMAP | 시각화 + 피처 | 비선형, 빠름, 전역 구조 보존 |

#### 실습 과제

**과제: 고차원 데이터 피처 선택 & 시각화**

```
데이터: 고차원 데이터 (피처 50개 이상)
- Kaggle 대회 데이터
- 유전자 발현 데이터
- 센서 데이터

요구사항:
1. Filter Methods:
   - 분산, 상관관계 기반 필터링
   - 결과 비교 (제거된 피처 목록)
2. Wrapper Methods:
   - RFE 또는 SFS 적용
   - 최적 피처 수 결정
3. Embedded Methods:
   - Lasso 또는 Tree Importance
   - Permutation Importance 비교
4. 차원 축소:
   - PCA 적용 (explained variance plot)
   - t-SNE / UMAP 시각화
   - 클러스터 해석
5. 종합 비교:
   - 각 방법으로 선택된 피처 벤 다이어그램
   - 모델 성능 비교 (전체 vs 선택된 피처)

산출물:
- Jupyter Notebook
- 피처 선택 비교 표
- 2D 시각화 (t-SNE/UMAP)
- 최종 추천 피처셋
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| Filter 적용 | 2가지 이상 방법 | 20% |
| Wrapper 적용 | RFE/SFS 중 1개 | 20% |
| Embedded 적용 | Importance 분석 | 20% |
| 차원 축소 | PCA + 시각화 | 25% |
| 종합 분석 | 성능 비교 및 결론 | 15% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 문서 | sklearn Feature Selection | https://scikit-learn.org/stable/modules/feature_selection.html |
| 영상 | StatQuest - PCA | https://www.youtube.com/watch?v=FgakZw6K1QQ |
| 논문 | UMAP Paper | https://arxiv.org/abs/1802.03426 |
| 도구 | UMAP Documentation | https://umap-learn.readthedocs.io/ |

---

## Month 4: ML 모델링 & 이상탐지

---

### Week 13: 가설 기반 분석 & 분류/회귀

#### 학습 목표
- [ ] 가설 기반 분석 접근법을 적용할 수 있다
- [ ] 상관관계와 인과관계를 구분할 수 있다
- [ ] 분류/회귀 문제를 구분하고 적절한 알고리즘을 선택할 수 있다
- [ ] XGBoost, LightGBM을 효과적으로 사용할 수 있다

#### 핵심 개념

**1. 가설 기반 분석 (Hypothesis-Driven)**

모델링 전에 "왜 이 모델을 만드는가?"를 명확히 해야 합니다.

```
┌─────────────────────────────────────────────────────────────┐
│                  가설 기반 분석 프로세스                      │
├─────────────────────────────────────────────────────────────┤
│  1. 문제 정의                                                │
│     "재구매율이 30% 하락한 이유는?"                          │
│              │                                               │
│              ▼                                               │
│  2. 가설 수립                                                │
│     H1: 배송 시간 증가 → 만족도 하락 → 재구매 감소          │
│     H2: 경쟁사 프로모션 → 고객 이탈                         │
│     H3: 제품 품질 하락 → 반품 증가 → 재구매 감소            │
│              │                                               │
│              ▼                                               │
│  3. 데이터 분석 (검증)                                       │
│     각 가설에 대한 증거 수집                                 │
│              │                                               │
│              ▼                                               │
│  4. 결론 도출                                                │
│     "H1 지지: 배송 시간 3일→5일, 재구매율 -25%p 상관"       │
└─────────────────────────────────────────────────────────────┘
```

**좋은 가설의 조건**
- ✅ 구체적: "배송 3일 이상이면 재구매율 20% 하락"
- ✅ 측정 가능: 데이터로 검증 가능
- ✅ 행동 가능: 검증 결과에 따라 행동 가능
- ❌ 나쁜 예: "고객이 불만족해서 그렇다" (너무 모호)

**2. 상관관계 vs 인과관계**

```python
# 상관관계 ≠ 인과관계
# 예시: 아이스크림 판매량과 익사 사고 (상관계수 0.95)
# 하지만 인과관계? ❌
# 진짜 원인: 여름 (더운 날씨 → 수영 증가 + 아이스크림 소비 증가)

# 인과관계 판단 기준
# 1. 시간적 선후관계: 원인이 결과보다 먼저 발생
# 2. 상관관계: 통계적 연관성 존재
# 3. 다른 설명 배제: 교란변수 통제
# 4. 실험: 무작위 통제 실험 (Gold Standard)
```

**3. 분류 알고리즘**
```python
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import lightgbm as lgb

# Logistic Regression
lr = LogisticRegression(max_iter=1000, random_state=42)
lr.fit(X_train, y_train)

# Random Forest
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    random_state=42,
    n_jobs=-1
)

# XGBoost
xgb_model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    use_label_encoder=False,
    eval_metric='logloss'
)

# LightGBM (가장 빠름)
lgb_model = lgb.LGBMClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    num_leaves=31,
    random_state=42
)
```

**2. 회귀 알고리즘**
```python
from sklearn.linear_model import Ridge, Lasso, ElasticNet
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

# Ridge Regression (L2)
ridge = Ridge(alpha=1.0)

# Lasso (L1, 피처 선택 효과)
lasso = Lasso(alpha=0.1)

# ElasticNet (L1 + L2)
elastic = ElasticNet(alpha=0.1, l1_ratio=0.5)

# XGBoost Regressor
xgb_reg = xgb.XGBRegressor(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42
)
```

**3. 교차 검증 & 튜닝**
```python
from sklearn.model_selection import cross_val_score, GridSearchCV, RandomizedSearchCV
from sklearn.model_selection import StratifiedKFold
import optuna

# K-Fold Cross Validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=cv, scoring='f1')
print(f"F1: {scores.mean():.4f} (+/- {scores.std()*2:.4f})")

# Grid Search
param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [5, 10, 15],
    'learning_rate': [0.01, 0.1]
}
grid_search = GridSearchCV(xgb_model, param_grid, cv=5, scoring='f1', n_jobs=-1)
grid_search.fit(X_train, y_train)

# Optuna (더 효율적)
def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 50, 300),
        'max_depth': trial.suggest_int('max_depth', 3, 15),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
    }
    model = lgb.LGBMClassifier(**params, random_state=42)
    score = cross_val_score(model, X_train, y_train, cv=5, scoring='f1').mean()
    return score

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=100)
```

**4. 평가 지표**
```python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report,
    mean_squared_error, mean_absolute_error, r2_score
)

# 분류 지표
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, y_pred))
print(f"ROC-AUC: {roc_auc_score(y_test, y_prob):.4f}")

# Confusion Matrix 시각화
from sklearn.metrics import ConfusionMatrixDisplay
ConfusionMatrixDisplay.from_predictions(y_test, y_pred)

# 회귀 지표
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}")
print(f"MAE: {mean_absolute_error(y_test, y_pred):.4f}")
print(f"R²: {r2_score(y_test, y_pred):.4f}")
```

| 문제 유형 | 지표 | 사용 시점 |
|----------|------|----------|
| 분류 (균형) | Accuracy, F1 | 클래스 균형 |
| 분류 (불균형) | F1, AUC, Recall | 이상탐지, 사기탐지 |
| 회귀 | RMSE, MAE | 연속값 예측 |
| 랭킹 | NDCG, MRR | 추천, 검색 |

#### 실습 과제

**과제: 고객 이탈 예측 모델**

```
데이터: Telco Customer Churn 또는 유사 데이터

요구사항:
1. 데이터 전처리 (Week 10-12 기법 적용)
2. 베이스라인 모델 (Logistic Regression)
3. 앙상블 모델:
   - Random Forest
   - XGBoost
   - LightGBM
4. 하이퍼파라미터 튜닝 (Optuna 권장)
5. 모델 비교:
   - 5-Fold CV 성능
   - ROC Curve 비교
   - 혼동 행렬
6. 피처 중요도 분석
7. 최종 모델 선택 및 근거

산출물:
- Jupyter Notebook
- 모델 성능 비교 표
- ROC Curve 그래프
- 비즈니스 인사이트 (이탈 요인 분석)
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 전처리 | 체계적 파이프라인 | 15% |
| 모델링 | 3개 이상 모델 | 25% |
| 튜닝 | CV + 하이퍼파라미터 | 25% |
| 평가 | 적절한 지표 + 비교 | 20% |
| 해석 | 비즈니스 인사이트 | 15% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 문서 | XGBoost Documentation | https://xgboost.readthedocs.io/ |
| 문서 | LightGBM Documentation | https://lightgbm.readthedocs.io/ |
| 문서 | Optuna Tutorial | https://optuna.org/ |
| 영상 | StatQuest - XGBoost | https://www.youtube.com/watch?v=OtD8wVaFm6E |

---

### Week 14: 클러스터링 & 세그멘테이션

#### 학습 목표
- [ ] K-means 클러스터링을 적용하고 최적 K를 결정할 수 있다
- [ ] 계층적 클러스터링과 덴드로그램을 해석할 수 있다
- [ ] DBSCAN으로 밀도 기반 클러스터링을 수행할 수 있다
- [ ] RFM 분석으로 고객을 세그멘테이션할 수 있다

#### 핵심 개념

**1. K-means**
```python
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# Elbow Method
inertias = []
silhouettes = []
K_range = range(2, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)
    silhouettes.append(silhouette_score(X_scaled, kmeans.labels_))

# 시각화
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(K_range, inertias, 'bo-')
axes[0].set_title('Elbow Method')
axes[1].plot(K_range, silhouettes, 'ro-')
axes[1].set_title('Silhouette Score')

# 최종 모델
kmeans = KMeans(n_clusters=optimal_k, random_state=42)
df['cluster'] = kmeans.fit_predict(X_scaled)
```

**2. 계층적 클러스터링**
```python
from scipy.cluster.hierarchy import dendrogram, linkage, fcluster
from sklearn.cluster import AgglomerativeClustering

# Dendrogram
Z = linkage(X_scaled, method='ward')
plt.figure(figsize=(12, 6))
dendrogram(Z, truncate_mode='lastp', p=30)
plt.title('Hierarchical Clustering Dendrogram')

# 클러스터 추출
clusters = fcluster(Z, t=4, criterion='maxclust')  # 4개 클러스터

# sklearn 방식
agg = AgglomerativeClustering(n_clusters=4, linkage='ward')
df['cluster'] = agg.fit_predict(X_scaled)
```

**3. DBSCAN**
```python
from sklearn.cluster import DBSCAN
from sklearn.neighbors import NearestNeighbors

# eps 결정 (k-distance plot)
k = 5
nn = NearestNeighbors(n_neighbors=k)
nn.fit(X_scaled)
distances, _ = nn.kneighbors(X_scaled)
distances = np.sort(distances[:, k-1])
plt.plot(distances)
plt.title('K-Distance Plot (Elbow = eps)')

# DBSCAN
dbscan = DBSCAN(eps=0.5, min_samples=5)
df['cluster'] = dbscan.fit_predict(X_scaled)

# 노이즈 포인트
noise_points = df[df['cluster'] == -1]
print(f"노이즈: {len(noise_points)} ({len(noise_points)/len(df)*100:.1f}%)")
```

| 알고리즘 | 장점 | 단점 | 사용 시점 |
|----------|------|------|----------|
| K-means | 빠름, 확장성 | K 사전 지정, 구형 가정 | 대부분 상황 |
| 계층적 | 덴드로그램, K 불필요 | 느림, 대용량 불가 | 소규모, 탐색적 |
| DBSCAN | 임의 형태, 이상치 탐지 | 밀도 차이에 약함 | 노이즈 있는 데이터 |

**4. RFM 분석**
```python
# RFM 계산
snapshot_date = df['order_date'].max() + pd.Timedelta(days=1)

rfm = df.groupby('customer_id').agg({
    'order_date': lambda x: (snapshot_date - x.max()).days,  # Recency
    'order_id': 'count',                                      # Frequency
    'amount': 'sum'                                           # Monetary
}).rename(columns={
    'order_date': 'Recency',
    'order_id': 'Frequency',
    'amount': 'Monetary'
})

# 점수화 (1-5)
rfm['R_Score'] = pd.qcut(rfm['Recency'], 5, labels=[5,4,3,2,1])  # 낮을수록 좋음
rfm['F_Score'] = pd.qcut(rfm['Frequency'].rank(method='first'), 5, labels=[1,2,3,4,5])
rfm['M_Score'] = pd.qcut(rfm['Monetary'].rank(method='first'), 5, labels=[1,2,3,4,5])

rfm['RFM_Score'] = rfm['R_Score'].astype(str) + rfm['F_Score'].astype(str) + rfm['M_Score'].astype(str)

# 세그먼트 정의
def segment(row):
    r, f, m = int(row['R_Score']), int(row['F_Score']), int(row['M_Score'])
    if r >= 4 and f >= 4:
        return 'Champions'
    elif r >= 3 and f >= 3:
        return 'Loyal'
    elif r >= 4 and f <= 2:
        return 'New Customers'
    elif r <= 2 and f >= 3:
        return 'At Risk'
    elif r <= 2 and f <= 2:
        return 'Lost'
    else:
        return 'Others'

rfm['Segment'] = rfm.apply(segment, axis=1)
```

#### 실습 과제

**과제: 고객 세그멘테이션 프로젝트**

```
데이터: 이커머스 주문 데이터

요구사항:
1. RFM 분석:
   - RFM 점수 계산
   - 세그먼트 정의 (5개 이상)
   - 세그먼트별 특성 분석
2. 클러스터링:
   - K-means (Elbow, Silhouette)
   - 계층적 (Dendrogram)
   - DBSCAN (eps 결정)
3. 클러스터 프로파일링:
   - 각 클러스터 특성 요약
   - 시각화 (PCA/t-SNE 2D)
4. RFM vs 클러스터링 비교
5. 비즈니스 액션 제안:
   - 세그먼트별 마케팅 전략
   - 우선순위 고객 그룹

산출물:
- Jupyter Notebook
- 세그먼트 프로파일 테이블
- 클러스터 시각화
- 마케팅 전략 제안서
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| RFM 분석 | 점수화 + 세그먼트 | 25% |
| 클러스터링 | 3가지 방법 비교 | 25% |
| 프로파일링 | 클러스터 특성 명확 | 20% |
| 시각화 | 2D 시각화 + 해석 | 15% |
| 전략 제안 | 실행 가능한 제안 | 15% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 영상 | StatQuest - Clustering | https://www.youtube.com/watch?v=4b5d3muPQmA |
| 문서 | sklearn Clustering | https://scikit-learn.org/stable/modules/clustering.html |
| 블로그 | RFM Analysis Guide | https://clevertap.com/blog/rfm-analysis/ |

---

### Week 15: 이상 탐지 (Anomaly Detection)

#### 학습 목표
- [ ] 다양한 이상탐지 기법을 이해하고 적용할 수 있다
- [ ] Isolation Forest로 이상치를 탐지할 수 있다
- [ ] Autoencoder 기반 이상탐지를 구현할 수 있다
- [ ] 적절한 임계값을 설정할 수 있다

#### 핵심 개념

**1. 통계적 방법**
```python
# Z-score
from scipy import stats
z_scores = np.abs(stats.zscore(df[numerical_cols]))
outliers = (z_scores > 3).any(axis=1)

# IQR
Q1 = df[numerical_cols].quantile(0.25)
Q3 = df[numerical_cols].quantile(0.75)
IQR = Q3 - Q1
outliers = ((df[numerical_cols] < (Q1 - 1.5 * IQR)) |
            (df[numerical_cols] > (Q3 + 1.5 * IQR))).any(axis=1)

# Mahalanobis Distance (다변량)
from scipy.spatial.distance import mahalanobis
mean = df[numerical_cols].mean()
cov = df[numerical_cols].cov()
cov_inv = np.linalg.inv(cov)
df['mahalanobis'] = df[numerical_cols].apply(
    lambda x: mahalanobis(x, mean, cov_inv), axis=1
)
```

**2. 밀도 기반 (LOF, DBSCAN)**
```python
from sklearn.neighbors import LocalOutlierFactor

# Local Outlier Factor
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.05)
df['lof_outlier'] = lof.fit_predict(X_scaled)  # -1: 이상, 1: 정상
df['lof_score'] = -lof.negative_outlier_factor_  # 점수 (높을수록 이상)

# DBSCAN (노이즈 = 이상)
from sklearn.cluster import DBSCAN
dbscan = DBSCAN(eps=0.5, min_samples=5)
df['dbscan_outlier'] = dbscan.fit_predict(X_scaled)
outliers = df[df['dbscan_outlier'] == -1]
```

**3. Isolation Forest**
```python
from sklearn.ensemble import IsolationForest

# 학습
iso_forest = IsolationForest(
    n_estimators=100,
    contamination=0.05,  # 예상 이상치 비율
    random_state=42
)
df['iso_outlier'] = iso_forest.fit_predict(X_scaled)  # -1: 이상
df['iso_score'] = -iso_forest.decision_function(X_scaled)  # 점수

# 시각화
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
axes[0].scatter(X_scaled[:, 0], X_scaled[:, 1],
                c=df['iso_outlier'], cmap='RdBu')
axes[0].set_title('Isolation Forest Results')

# 점수 분포
axes[1].hist(df['iso_score'], bins=50)
axes[1].axvline(np.percentile(df['iso_score'], 95), color='r', linestyle='--')
axes[1].set_title('Anomaly Score Distribution')
```

**4. Autoencoder**
```python
import tensorflow as tf
from tensorflow.keras import layers, Model

# Autoencoder 정의
class Autoencoder(Model):
    def __init__(self, input_dim, latent_dim=8):
        super().__init__()
        self.encoder = tf.keras.Sequential([
            layers.Dense(32, activation='relu'),
            layers.Dense(16, activation='relu'),
            layers.Dense(latent_dim, activation='relu')
        ])
        self.decoder = tf.keras.Sequential([
            layers.Dense(16, activation='relu'),
            layers.Dense(32, activation='relu'),
            layers.Dense(input_dim, activation='sigmoid')
        ])

    def call(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

# 학습 (정상 데이터만)
autoencoder = Autoencoder(input_dim=X_train.shape[1])
autoencoder.compile(optimizer='adam', loss='mse')
autoencoder.fit(X_train_normal, X_train_normal,
                epochs=50, batch_size=32, validation_split=0.1)

# 이상 탐지 (재구성 오차)
reconstructed = autoencoder.predict(X_test)
mse = np.mean((X_test - reconstructed) ** 2, axis=1)
threshold = np.percentile(mse, 95)
df['ae_outlier'] = (mse > threshold).astype(int)
```

**실무 사례 (자료조사 반영):**

| 기업 | 방법 | 성과 |
|------|------|------|
| Mastercard | Decision Intelligence | 탐지율 300% 향상, 오탐 85% 감소 |
| PayPal | Isolation Forest | 수백만 사용자 보호 |
| 제조업 | Autoencoder | 다운타임 40% 감소 |

#### 실습 과제

**과제: 금융 사기 탐지 시스템**

```
데이터: Kaggle Credit Card Fraud Detection

요구사항:
1. 데이터 분석:
   - 클래스 불균형 확인
   - 정상 vs 사기 특성 비교
2. 이상탐지 모델:
   - Z-score / IQR (베이스라인)
   - Isolation Forest
   - LOF
   - Autoencoder
3. 모델 비교:
   - Precision, Recall, F1 (특히 Recall 중요)
   - ROC-AUC
   - Precision-Recall Curve
4. 임계값 조정:
   - 비즈니스 요구사항에 맞는 임계값
   - Precision-Recall 트레이드오프
5. 앙상블:
   - 여러 모델 결합
   - 투표 또는 스태킹

산출물:
- Jupyter Notebook
- 모델 성능 비교 표
- 임계값 분석 그래프
- 운영 가이드 (임계값 조정 방법)
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| 데이터 분석 | 불균형 처리 전략 | 15% |
| 모델 구현 | 4개 방법 모두 | 30% |
| 평가 | 적절한 지표 사용 | 20% |
| 임계값 | 비즈니스 관점 분석 | 20% |
| 앙상블 | 성능 개선 | 15% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 데이터 | Credit Card Fraud | https://www.kaggle.com/mlg-ulb/creditcardfraud |
| 문서 | PyOD Library | https://pyod.readthedocs.io/ |
| 논문 | Isolation Forest | https://cs.nju.edu.cn/zhouzh/zhouzh.files/publication/icdm08b.pdf |
| 영상 | Autoencoder for AD | https://www.youtube.com/watch?v=2K3ScZp1dXQ |

---

### Week 16: 시계열 분석

#### 학습 목표
- [ ] 시계열 데이터의 구성 요소를 분해할 수 있다
- [ ] 정상성을 검정하고 변환할 수 있다
- [ ] Prophet으로 예측 모델을 구축할 수 있다
- [ ] ML 기반 시계열 예측을 수행할 수 있다

#### 핵심 개념

**1. 시계열 분해**
```python
from statsmodels.tsa.seasonal import seasonal_decompose

# 시계열 분해
result = seasonal_decompose(df['value'], model='additive', period=7)

fig, axes = plt.subplots(4, 1, figsize=(12, 10))
result.observed.plot(ax=axes[0], title='Original')
result.trend.plot(ax=axes[1], title='Trend')
result.seasonal.plot(ax=axes[2], title='Seasonal')
result.resid.plot(ax=axes[3], title='Residual')
plt.tight_layout()
```

**2. 정상성 검정 & 변환**
```python
from statsmodels.tsa.stattools import adfuller, kpss

# ADF 검정 (귀무가설: 비정상)
result = adfuller(df['value'])
print(f"ADF Statistic: {result[0]:.4f}")
print(f"p-value: {result[1]:.4f}")  # < 0.05면 정상

# 차분 (differencing)
df['value_diff'] = df['value'].diff()
df['value_diff2'] = df['value'].diff().diff()

# 로그 변환 + 차분
df['value_log_diff'] = np.log(df['value']).diff()
```

**3. Prophet**
```python
from prophet import Prophet

# 데이터 준비 (Prophet 형식)
df_prophet = df.rename(columns={'date': 'ds', 'value': 'y'})

# 모델 학습
model = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=False,
    changepoint_prior_scale=0.05  # 트렌드 유연성
)
model.fit(df_prophet)

# 예측
future = model.make_future_dataframe(periods=30)
forecast = model.predict(future)

# 시각화
model.plot(forecast)
model.plot_components(forecast)

# 휴일 효과 추가
holidays = pd.DataFrame({
    'holiday': 'custom_holiday',
    'ds': pd.to_datetime(['2024-01-01', '2024-12-25']),
    'lower_window': 0,
    'upper_window': 1
})
model = Prophet(holidays=holidays)
```

**4. ML 기반 시계열 (Lag Features)**
```python
# Lag Features 생성
def create_lag_features(df, target_col, lags):
    for lag in lags:
        df[f'{target_col}_lag_{lag}'] = df[target_col].shift(lag)
    return df

df = create_lag_features(df, 'value', [1, 7, 14, 30])

# Rolling Features
df['value_rolling_7_mean'] = df['value'].shift(1).rolling(7).mean()
df['value_rolling_7_std'] = df['value'].shift(1).rolling(7).std()
df['value_rolling_30_mean'] = df['value'].shift(1).rolling(30).mean()

# 시간 특성
df['dayofweek'] = df['date'].dt.dayofweek
df['month'] = df['date'].dt.month
df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)

# TimeSeriesSplit
from sklearn.model_selection import TimeSeriesSplit
tscv = TimeSeriesSplit(n_splits=5)

scores = []
for train_idx, val_idx in tscv.split(X):
    X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
    y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]

    model.fit(X_train, y_train)
    pred = model.predict(X_val)
    scores.append(mean_absolute_error(y_val, pred))
```

**자료조사 반영 - 도구 비교:**

| 도구 | 특징 | 추천 상황 |
|------|------|----------|
| Prophet | 쉬움, 휴일/이벤트 처리 | 빠른 베이스라인 |
| NeuralProphet | Prophet + Deep Learning | 더 정확한 예측 |
| TimeGPT | Zero-shot, 사전학습 | 매우 빠른 프로토타입 |
| LightGBM + Lag | 유연성, 해석 가능 | 복잡한 피처 필요 시 |

#### 실습 과제

**과제: 수요 예측 모델 (포트폴리오 #2)**

```
데이터: 소매 판매 데이터 (Kaggle Store Sales 또는 유사)

요구사항:
1. 시계열 분석:
   - 분해 (추세, 계절성, 잔차)
   - 정상성 검정
   - ACF/PACF 분석
2. 전통 모델:
   - Prophet (기본)
   - Prophet + 휴일/이벤트
3. ML 모델:
   - Lag/Rolling 피처 생성
   - LightGBM + TimeSeriesSplit
4. 모델 비교:
   - MAE, MAPE
   - 시각화 (예측 vs 실제)
5. 비즈니스 활용:
   - 재고 관리 관점 해석
   - 신뢰 구간 활용

산출물:
- **포트폴리오 #2: 수요 예측 모델**
- Jupyter Notebook
- 모델 성능 비교
- 예측 대시보드 (Streamlit 선택)
```

#### 평가 기준

| 항목 | 통과 기준 | 배점 |
|------|----------|------|
| EDA | 분해 + 정상성 분석 | 20% |
| Prophet | 기본 + 휴일 모델 | 25% |
| ML 모델 | Lag 피처 + 교차검증 | 25% |
| 비교 분석 | 적절한 지표 + 시각화 | 20% |
| 비즈니스 | 실행 가능한 인사이트 | 10% |

#### 추천 자료

| 유형 | 제목 | 링크 |
|------|------|------|
| 문서 | Prophet Documentation | https://facebook.github.io/prophet/ |
| 문서 | NeuralProphet | https://neuralprophet.com/ |
| 영상 | StatQuest - Time Series | https://www.youtube.com/watch?v=DeORzP0go5I |
| Kaggle | Store Sales Competition | https://www.kaggle.com/c/store-sales-time-series-forecasting |

---

## 💬 데이터 커뮤니케이션 (Phase 2 전체 적용)

Phase 2의 모든 실습 과제에는 **발표/보고서** 요소가 포함됩니다.

### 기술 → 비즈니스 번역

```
❌ 기술 언어:
"Random Forest 모델의 AUC가 0.85로 Logistic Regression 대비
0.12 향상되었습니다."

✅ 비즈니스 언어:
"고객 이탈 예측 정확도가 85%입니다. 이탈 위험 고객 10명 중 8.5명을
정확히 식별할 수 있어, 선제적 리텐션 캠페인이 가능합니다."
```

### Pyramid Principle (결론 먼저)

```
전통적 방식 ❌:
"데이터를 수집했고, 정제했고, 분석했고... 결론은 X입니다."

Pyramid 방식 ✅:
"결론: 배송 시간을 2일 단축하면 재구매율이 15% 증가합니다.

왜냐하면:
1. 배송 시간과 재구매율의 상관관계 -0.6 (강한 음의 상관)
2. 고객 설문: 불만족 1위 = 배송 지연 (43%)
3. 경쟁사 비교: 우리 5일 vs 경쟁사 3일"
```

### 이해관계자별 커뮤니케이션

| 대상 | 관심사 | 형식 |
|------|--------|------|
| **경영진** | ROI, 리스크 | 1페이지 요약, 3분 발표 |
| **현업 팀** | 실행 가능성 | 구체적 가이드, 데모 |
| **기술 팀** | 구현 방법 | 기술 문서, 아키텍처 |

---

## Phase 2 완료 기준

### 필수 산출물
1. [ ] Week 9: 문제 정의서 + EDA 리포트
2. [ ] Week 10: 데이터 품질 평가 + 정제 파이프라인
3. [ ] Week 11: Feature Engineering 노트북
4. [ ] Week 12: 피처 선택 & 차원 축소 분석
5. [ ] Week 13: 가설 검증 + 고객 이탈 예측 모델
6. [ ] Week 14: 고객 세그멘테이션 + 마케팅 전략 제안
7. [ ] Week 15: 이상탐지 시스템
8. [ ] **Week 16: 포트폴리오 #2 - 수요 예측 모델 + 경영진 보고서**

### 역량 체크리스트

**분석 역량**
- [ ] 비즈니스 문제를 구조화하여 정의할 수 있다 (5 Whys, MECE)
- [ ] 가설 기반 분석 접근법을 적용할 수 있다
- [ ] 데이터에서 인사이트를 추출하고 시각화할 수 있다
- [ ] 결측치, 이상치를 적절히 처리할 수 있다
- [ ] 피처를 생성하고 선택할 수 있다

**모델링 역량**
- [ ] 분류/회귀 모델을 구축하고 평가할 수 있다
- [ ] 클러스터링으로 세그멘테이션을 수행할 수 있다
- [ ] 이상탐지 시스템을 구축할 수 있다
- [ ] 시계열 예측을 수행할 수 있다

**커뮤니케이션 역량**
- [ ] 기술 내용을 비즈니스 언어로 번역할 수 있다
- [ ] Pyramid Principle로 보고서를 작성할 수 있다
- [ ] 이해관계자 맞춤 발표를 할 수 있다

---

*Phase 2 완료 → Phase 3: Knowledge Graph로 이동*
