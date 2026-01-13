// Week 11 Day 2: 범주형 피처 엔지니어링
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'p2w3d2t1',
    type: 'video',
    title: '범주형 피처 고급 기법',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 범주형 피처 고급 기법

## 1. 희귀 카테고리 처리

\\\`\\\`\\\`python
# 빈도 1% 미만 카테고리를 'Other'로 그룹화
freq = df['category'].value_counts(normalize=True)
rare_categories = freq[freq < 0.01].index
df['category_grouped'] = df['category'].replace(rare_categories, 'Other')

print(f"원본 카테고리 수: {df['category'].nunique()}")
print(f"그룹화 후: {df['category_grouped'].nunique()}")
\\\`\\\`\\\`

## 2. 카테고리 조합

\\\`\\\`\\\`python
# 두 범주형 변수 조합
df['location_type'] = df['city'] + '_' + df['property_type']

# 여러 변수 조합 (해시)
df['combo_hash'] = (df['city'] + '_' + df['category'] + '_' +
                    df['brand']).apply(hash) % 1000
\\\`\\\`\\\`

## 3. Target Encoding (CV 방식)

\\\`\\\`\\\`python
from sklearn.model_selection import KFold

def target_encode_cv(df, col, target, n_splits=5):
    """과적합 방지 타겟 인코딩"""
    df = df.copy()
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    df[f'{col}_target'] = 0

    for train_idx, val_idx in kf.split(df):
        means = df.iloc[train_idx].groupby(col)[target].mean()
        df.loc[val_idx, f'{col}_target'] = df.loc[val_idx, col].map(means)

    # 전체 평균으로 NA 처리
    global_mean = df[target].mean()
    df[f'{col}_target'] = df[f'{col}_target'].fillna(global_mean)

    return df

df = target_encode_cv(df, 'category', 'target')
\\\`\\\`\\\`

## 4. Count/Frequency Encoding

\\\`\\\`\\\`python
# 빈도 인코딩
freq = df['category'].value_counts(normalize=True)
df['category_freq'] = df['category'].map(freq)

# 카운트 인코딩
counts = df['category'].value_counts()
df['category_count'] = df['category'].map(counts)
\\\`\\\`\\\`

## 5. 카테고리별 통계

\\\`\\\`\\\`python
# 카테고리별 타겟 통계
category_stats = df.groupby('category')['target'].agg(['mean', 'std', 'count'])
df = df.merge(category_stats, on='category', suffixes=('', '_cat_stat'))
\\\`\\\`\\\`
`,
      objectives: [
        '희귀 카테고리를 적절히 처리할 수 있다',
        'Target Encoding을 안전하게 적용할 수 있다',
        '카테고리 조합 피처를 생성할 수 있다'
      ],
      keyPoints: [
        '희귀 카테고리: Other로 그룹화',
        'Target Encoding: CV 필수 (과적합 방지)',
        'Frequency/Count: 타겟 누수 없음',
        '카테고리 조합: 상호작용 포착'
      ]
    }
  },
  {
    id: 'p2w3d2t2',
    type: 'code',
    title: '실습: 범주형 피처 엔지니어링',
    duration: 45,
    content: {
      instructions: `# 범주형 피처 엔지니어링 실습

## 목표
다양한 범주형 피처 엔지니어링 기법을 적용하세요.

## 요구사항
1. 희귀 카테고리 그룹화
2. 카테고리 조합 피처
3. Target Encoding (CV 방식)
4. Frequency Encoding
`,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import KFold

np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'user_id': range(1, n + 1),
    'city': np.random.choice(['Seoul', 'Busan', 'Incheon', 'Daegu',
                              'RareCity1', 'RareCity2', 'RareCity3'], n,
                             p=[0.4, 0.2, 0.15, 0.15, 0.03, 0.04, 0.03]),
    'category': np.random.choice(['A', 'B', 'C', 'D', 'E'], n),
    'device': np.random.choice(['mobile', 'desktop', 'tablet'], n, p=[0.6, 0.3, 0.1]),
    'target': np.random.randint(0, 2, n)
})

print("원본 데이터:")
print(df.head())

# TODO: 범주형 피처 엔지니어링 구현
`,
      solutionCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import KFold

np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'user_id': range(1, n + 1),
    'city': np.random.choice(['Seoul', 'Busan', 'Incheon', 'Daegu',
                              'RareCity1', 'RareCity2', 'RareCity3'], n,
                             p=[0.4, 0.2, 0.15, 0.15, 0.03, 0.04, 0.03]),
    'category': np.random.choice(['A', 'B', 'C', 'D', 'E'], n),
    'device': np.random.choice(['mobile', 'desktop', 'tablet'], n, p=[0.6, 0.3, 0.1]),
    'target': np.random.randint(0, 2, n)
})

# 1. 희귀 카테고리 그룹화
freq = df['city'].value_counts(normalize=True)
rare = freq[freq < 0.05].index
df['city_grouped'] = df['city'].replace(rare, 'Other')
print(f"City: {df['city'].nunique()} → {df['city_grouped'].nunique()} 카테고리")

# 2. 카테고리 조합
df['city_device'] = df['city_grouped'] + '_' + df['device']
df['category_device'] = df['category'] + '_' + df['device']

# 3. Target Encoding (CV 방식)
def target_encode_cv(df, col, target, n_splits=5):
    df = df.copy()
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    df[f'{col}_target'] = 0.0

    for train_idx, val_idx in kf.split(df):
        means = df.iloc[train_idx].groupby(col)[target].mean()
        df.loc[val_idx, f'{col}_target'] = df.loc[val_idx, col].map(means)

    global_mean = df[target].mean()
    df[f'{col}_target'] = df[f'{col}_target'].fillna(global_mean)
    return df

df = target_encode_cv(df, 'city_grouped', 'target')
df = target_encode_cv(df, 'category', 'target')

# 4. Frequency Encoding
for col in ['city_grouped', 'category', 'device']:
    freq = df[col].value_counts(normalize=True)
    df[f'{col}_freq'] = df[col].map(freq)

print(f"\\n최종 Shape: {df.shape}")
print(f"\\n새로운 피처:")
print(df.head())
`,
      hints: [
        'value_counts(normalize=True)로 비율 계산',
        'KFold로 CV 방식 Target Encoding',
        '문자열 연결로 카테고리 조합'
      ]
    }
  },
  {
    id: 'p2w3d2t3',
    type: 'video',
    title: 'One-Hot vs 기타 인코딩 비교',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 범주형 인코딩 방법 비교

## 1. One-Hot Encoding

\\\`\\\`\\\`python
from sklearn.preprocessing import OneHotEncoder
import pandas as pd

# One-Hot Encoding
ohe = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
encoded = ohe.fit_transform(df[['city']])

# 카테고리 수만큼 컬럼 생성
print(f"Original: 1 column → One-Hot: {encoded.shape[1]} columns")
\\\`\\\`\\\`

**장점**: 순서 정보 없음, 모든 모델에서 사용 가능
**단점**: 고카디널리티 시 차원 폭발

## 2. Label Encoding

\\\`\\\`\\\`python
from sklearn.preprocessing import LabelEncoder

le = LabelEncoder()
df['city_label'] = le.fit_transform(df['city'])

# 순서 정보가 부여됨 (주의!)
print(dict(zip(le.classes_, range(len(le.classes_)))))
\\\`\\\`\\\`

**장점**: 메모리 효율적
**단점**: 트리 기반 외 모델에서 순서로 해석될 수 있음

## 3. 선택 가이드

| 상황 | 추천 인코딩 |
|------|------------|
| 카테고리 < 10개 | One-Hot |
| 카테고리 10~50개 | Target/Frequency |
| 카테고리 > 50개 | Target Encoding (CV) |
| 트리 모델만 사용 | Label Encoding OK |
| 순서가 있는 범주 | Ordinal Encoding |

## 4. 고카디널리티 처리

\\\`\\\`\\\`python
# 1. 빈도 기반 그룹화
top_n = df['category'].value_counts().head(10).index
df['category_top10'] = df['category'].where(
    df['category'].isin(top_n), 'Other'
)

# 2. 해시 인코딩 (고정 차원)
from sklearn.feature_extraction import FeatureHasher
hasher = FeatureHasher(n_features=100, input_type='string')
hashed = hasher.transform(df['category'].apply(lambda x: [x]))
\\\`\\\`\\\`
`,
      objectives: [
        '상황에 맞는 인코딩 방법을 선택할 수 있다',
        '고카디널리티 범주를 효과적으로 처리할 수 있다',
        '각 인코딩의 장단점을 설명할 수 있다'
      ],
      keyPoints: [
        'One-Hot: 저카디널리티에 적합',
        'Target Encoding: 고카디널리티에 적합 (CV 필수)',
        'Label Encoding: 트리 모델 전용',
        '해시 인코딩: 차원 고정 가능'
      ]
    }
  },
  {
    id: 'p2w3d2t4',
    type: 'quiz',
    title: 'Day 2 퀴즈: 범주형 피처',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Target Encoding에서 CV 방식을 사용하는 이유는?',
          options: ['계산 속도 향상', '과적합 방지', '결측치 처리', '차원 축소'],
          answer: 1,
          explanation: 'CV 방식은 학습 데이터의 타겟 정보가 직접 인코딩에 사용되는 것을 방지하여 과적합을 줄입니다.'
        },
        {
          question: '희귀 카테고리를 처리하는 일반적인 방법은?',
          options: ['삭제', 'Other로 그룹화', 'NULL로 대체', 'One-Hot Encoding'],
          answer: 1,
          explanation: '희귀 카테고리는 통계적으로 불안정하므로 Other로 그룹화하여 일반화 성능을 높입니다.'
        },
        {
          question: 'Frequency Encoding의 장점은?',
          options: ['타겟 정보 포함', '타겟 누수 없음', '차원 증가', '해석 용이'],
          answer: 1,
          explanation: 'Frequency Encoding은 타겟 변수를 사용하지 않으므로 데이터 누수가 발생하지 않습니다.'
        },
        {
          question: '100개 이상의 카테고리를 가진 변수에 가장 적합한 인코딩은?',
          options: ['One-Hot Encoding', 'Label Encoding', 'Target Encoding (CV)', 'Ordinal Encoding'],
          answer: 2,
          explanation: '고카디널리티에서는 One-Hot이 차원 폭발을 일으키므로 Target Encoding(CV)이 적합합니다.'
        }
      ]
    }
  },
  {
    id: 'p2w3d2t5',
    type: 'challenge',
    title: '도전과제: 범주형 피처 최적화',
    duration: 25,
    content: {
      instructions: `# 도전과제: 범주형 피처 최적화

## 목표
주어진 데이터셋에서 범주형 변수를 최적으로 인코딩하여 모델 성능을 극대화하세요.

## 데이터
- 5개 범주형 변수 (카디널리티 다양)
- 이진 분류 타겟

## 요구사항
1. 각 변수의 카디널리티를 분석하고 적절한 인코딩 선택
2. 최소 3가지 다른 인코딩 기법 사용
3. 인코딩 전/후 모델 성능 비교 (LogisticRegression, RandomForest)
4. 최종 피처 조합의 근거 설명

## 평가 기준
- 인코딩 선택의 합리성 (30%)
- 모델 성능 개선율 (40%)
- 코드 품질 및 설명 (30%)

## 보너스
- Feature Importance로 인코딩 효과 분석
- 교차 검증으로 안정성 확인
`,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.metrics import roc_auc_score

np.random.seed(42)
n = 5000

# 다양한 카디널리티의 범주형 변수 생성
df = pd.DataFrame({
    'country': np.random.choice(['KR', 'US', 'JP', 'CN', 'DE'], n),  # 5개
    'city': np.random.choice([f'city_{i}' for i in range(50)], n),   # 50개
    'product_id': np.random.choice([f'p_{i}' for i in range(500)], n),  # 500개
    'device': np.random.choice(['mobile', 'desktop', 'tablet'], n),
    'browser': np.random.choice(['chrome', 'safari', 'firefox', 'edge', 'other'], n),
    'target': np.random.randint(0, 2, n)
})

# 일부 타겟과 상관관계 추가
df.loc[df['country'] == 'KR', 'target'] = np.random.choice([0, 1],
    size=len(df[df['country'] == 'KR']), p=[0.3, 0.7])

print("데이터 개요:")
print(df.head())
print(f"\\n각 변수의 카디널리티:")
for col in df.columns[:-1]:
    print(f"  {col}: {df[col].nunique()}")

# TODO: 범주형 피처 최적화 구현
# 1. 카디널리티별 인코딩 전략 수립
# 2. 인코딩 적용
# 3. 모델 성능 비교
`,
      hints: [
        '저카디널리티(country, device, browser): One-Hot 고려',
        '중카디널리티(city): Target Encoding 고려',
        '고카디널리티(product_id): Frequency + 그룹화 고려',
        'cross_val_score로 안정적인 성능 측정'
      ],
      evaluationCriteria: [
        '카디널리티 분석 정확성',
        '인코딩 선택 합리성',
        'AUC 기준 성능 개선',
        '코드 가독성'
      ],
      bonusPoints: [
        'Feature Importance 분석',
        '인코딩별 성능 비교표 작성',
        '최적 조합 찾기'
      ]
    }
  }
]
