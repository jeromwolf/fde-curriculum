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
    type: 'quiz',
    title: 'Day 2 퀴즈: 범주형 피처',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Target Encoding에서 CV 방식을 사용하는 이유는?',
          options: ['계산 속도 향상', '과적합 방지', '결측치 처리', '차원 축소'],
          answer: 1
        },
        {
          question: '희귀 카테고리를 처리하는 일반적인 방법은?',
          options: ['삭제', 'Other로 그룹화', 'NULL로 대체', 'One-Hot Encoding'],
          answer: 1
        },
        {
          question: 'Frequency Encoding의 장점은?',
          options: ['타겟 정보 포함', '타겟 누수 없음', '차원 증가', '해석 용이'],
          answer: 1
        }
      ]
    }
  }
]
