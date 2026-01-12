// Week 11 Day 3: 시간 & 텍스트 피처
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'p2w3d3t1',
    type: 'video',
    title: '시간 피처 엔지니어링',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 시간 피처 엔지니어링

## 기본 시간 추출

\\\`\\\`\\\`python
df['datetime'] = pd.to_datetime(df['timestamp'])

# 기본 추출
df['year'] = df['datetime'].dt.year
df['month'] = df['datetime'].dt.month
df['day'] = df['datetime'].dt.day
df['dayofweek'] = df['datetime'].dt.dayofweek  # 0=월
df['hour'] = df['datetime'].dt.hour
df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)
\\\`\\\`\\\`

## 주기성 인코딩 (Cyclical Features)

\\\`\\\`\\\`python
# 시간의 주기성을 반영 (23시와 0시는 가까움)
df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)

df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)

df['dayofweek_sin'] = np.sin(2 * np.pi * df['dayofweek'] / 7)
df['dayofweek_cos'] = np.cos(2 * np.pi * df['dayofweek'] / 7)
\\\`\\\`\\\`

## 시계열 피처 (Lag & Rolling)

\\\`\\\`\\\`python
# Lag 피처 (과거 값)
df['sales_lag_1'] = df.groupby('product')['sales'].shift(1)
df['sales_lag_7'] = df.groupby('product')['sales'].shift(7)

# Rolling 피처 (이동 통계)
df['sales_rolling_7_mean'] = df.groupby('product')['sales'].transform(
    lambda x: x.shift(1).rolling(7).mean()
)
df['sales_rolling_7_std'] = df.groupby('product')['sales'].transform(
    lambda x: x.shift(1).rolling(7).std()
)

# Expanding (누적)
df['sales_expanding_mean'] = df.groupby('product')['sales'].transform(
    lambda x: x.shift(1).expanding().mean()
)
\\\`\\\`\\\`

## 경과 시간

\\\`\\\`\\\`python
# 첫 구매 이후 경과일
df['days_since_first'] = (df['datetime'] -
    df.groupby('user')['datetime'].transform('min')).dt.days

# 마지막 구매 이후 경과일 (Recency)
df['days_since_last'] = (df['datetime'].max() -
    df.groupby('user')['datetime'].transform('max')).dt.days
\\\`\\\`\\\`
`,
      objectives: [
        '시간 피처를 추출할 수 있다',
        '주기성 인코딩을 적용할 수 있다',
        'Lag/Rolling 피처를 생성할 수 있다'
      ],
      keyPoints: [
        '기본 추출: year, month, hour 등',
        '주기성: sin/cos 인코딩',
        'Lag: 과거 값 참조',
        'Rolling: 이동 통계'
      ]
    }
  },
  {
    id: 'p2w3d3t2',
    type: 'video',
    title: '텍스트 피처 엔지니어링',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 텍스트 피처 엔지니어링

## 기본 텍스트 통계

\\\`\\\`\\\`python
# 길이 피처
df['text_len'] = df['text'].str.len()
df['word_count'] = df['text'].str.split().str.len()
df['avg_word_len'] = df['text'].apply(
    lambda x: np.mean([len(w) for w in str(x).split()]) if x else 0
)

# 특수 문자 비율
df['punct_ratio'] = df['text'].apply(
    lambda x: sum(1 for c in str(x) if c in '!?.,;:') / max(len(str(x)), 1)
)

# 대문자 비율
df['upper_ratio'] = df['text'].apply(
    lambda x: sum(1 for c in str(x) if c.isupper()) / max(len(str(x)), 1)
)
\\\`\\\`\\\`

## TF-IDF 피처

\\\`\\\`\\\`python
from sklearn.feature_extraction.text import TfidfVectorizer

# 기본 TF-IDF
tfidf = TfidfVectorizer(max_features=100, ngram_range=(1, 2))
tfidf_matrix = tfidf.fit_transform(df['text'])

# DataFrame 변환
tfidf_df = pd.DataFrame(
    tfidf_matrix.toarray(),
    columns=[f'tfidf_{w}' for w in tfidf.get_feature_names_out()]
)
\\\`\\\`\\\`

## 키워드 포함 여부

\\\`\\\`\\\`python
keywords = ['urgent', 'sale', 'free', 'discount']
for kw in keywords:
    df[f'has_{kw}'] = df['text'].str.lower().str.contains(kw).astype(int)
\\\`\\\`\\\`
`,
      objectives: [
        '텍스트에서 통계 피처를 추출할 수 있다',
        'TF-IDF를 활용할 수 있다',
        '키워드 기반 피처를 생성할 수 있다'
      ],
      keyPoints: [
        '길이, 단어 수, 평균 단어 길이',
        'TF-IDF: 텍스트 벡터화',
        '키워드 플래그: 특정 단어 포함 여부'
      ]
    }
  },
  {
    id: 'p2w3d3t3',
    type: 'code',
    title: '실습: 시간 & 텍스트 피처',
    duration: 40,
    content: {
      instructions: `# 시간 & 텍스트 피처 엔지니어링 실습

## 요구사항
1. 시간 피처: 기본 추출 + 주기성 인코딩
2. Lag/Rolling 피처
3. 텍스트 통계 피처
`,
      starterCode: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 500

df = pd.DataFrame({
    'user_id': np.random.randint(1, 50, n),
    'timestamp': pd.date_range('2024-01-01', periods=n, freq='H'),
    'amount': np.random.uniform(10, 200, n),
    'review': np.random.choice([
        'Great product!',
        'Not bad, could be better.',
        'AMAZING!!! Best purchase ever!!!',
        'Poor quality, very disappointed.',
        'Average, nothing special'
    ], n)
})

print("원본 데이터:")
print(df.head())

# TODO: 시간 피처
# TODO: Lag/Rolling 피처
# TODO: 텍스트 피처
`,
      solutionCode: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 500

df = pd.DataFrame({
    'user_id': np.random.randint(1, 50, n),
    'timestamp': pd.date_range('2024-01-01', periods=n, freq='H'),
    'amount': np.random.uniform(10, 200, n),
    'review': np.random.choice([
        'Great product!',
        'Not bad, could be better.',
        'AMAZING!!! Best purchase ever!!!',
        'Poor quality, very disappointed.',
        'Average, nothing special'
    ], n)
})

# 시간 피처
df['hour'] = df['timestamp'].dt.hour
df['dayofweek'] = df['timestamp'].dt.dayofweek
df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)
df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)

# Lag/Rolling 피처
df = df.sort_values(['user_id', 'timestamp'])
df['amount_lag_1'] = df.groupby('user_id')['amount'].shift(1)
df['amount_rolling_3_mean'] = df.groupby('user_id')['amount'].transform(
    lambda x: x.shift(1).rolling(3, min_periods=1).mean()
)

# 텍스트 피처
df['review_len'] = df['review'].str.len()
df['word_count'] = df['review'].str.split().str.len()
df['exclamation_count'] = df['review'].str.count('!')
df['has_great'] = df['review'].str.lower().str.contains('great').astype(int)

print(f"최종 Shape: {df.shape}")
print(df.head())
`,
      hints: [
        'dt.hour, dt.dayofweek 등으로 시간 추출',
        'np.sin(2 * np.pi * x / period)로 주기성 인코딩',
        'str.len(), str.split().str.len() 등 문자열 메서드 활용'
      ]
    }
  },
  {
    id: 'p2w3d3t4',
    type: 'quiz',
    title: 'Day 3 퀴즈',
    duration: 10,
    content: {
      questions: [
        {
          question: '시간의 주기성을 표현하기 위해 사용하는 함수는?',
          options: ['log', 'exp', 'sin/cos', 'sqrt'],
          answer: 2
        },
        {
          question: 'Lag 피처를 생성할 때 주의해야 할 점은?',
          options: ['정규화 필요', '미래 데이터 누수 방지', '결측치 제거', '스케일링 필수'],
          answer: 1
        },
        {
          question: 'TF-IDF에서 TF의 의미는?',
          options: ['Total Frequency', 'Term Frequency', 'Text Feature', 'Transform Function'],
          answer: 1
        }
      ]
    }
  }
]
