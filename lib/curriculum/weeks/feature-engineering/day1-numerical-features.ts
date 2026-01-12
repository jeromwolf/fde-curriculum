// Week 11 Day 1: 수치형 피처 엔지니어링
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'p2w3d1t1',
    type: 'video',
    title: '수치형 피처 생성 기법',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 수치형 피처 생성 기법

## Feature Engineering이란?

\\\`\\\`\\\`
원시 데이터 → 모델이 학습하기 좋은 형태로 변환

"좋은 피처 하나가 복잡한 모델보다 낫다"
- Kaggle Grandmaster들의 공통 조언
\\\`\\\`\\\`

## 1. 비율/조합 피처

\\\`\\\`\\\`python
# 가격/면적 = 평당 가격
df['price_per_sqft'] = df['price'] / df['sqft']

# 침실/전체 방 = 침실 비율
df['bedroom_ratio'] = df['bedrooms'] / df['total_rooms']

# 빚/소득 = 부채 비율
df['debt_to_income'] = df['debt'] / df['income']
\\\`\\\`\\\`

## 2. Binning (구간화)

\\\`\\\`\\\`python
# 등간격 구간화
df['age_bin'] = pd.cut(df['age'],
                       bins=[0, 18, 35, 55, 100],
                       labels=['청소년', '청년', '중년', '노년'])

# 등분위 구간화
df['income_quantile'] = pd.qcut(df['income'],
                                q=5,
                                labels=['하위', '중하', '중', '중상', '상위'])
\\\`\\\`\\\`

## 3. Polynomial Features

\\\`\\\`\\\`python
from sklearn.preprocessing import PolynomialFeatures

poly = PolynomialFeatures(degree=2, include_bias=False)
poly_features = poly.fit_transform(df[['x1', 'x2']])

# 결과: x1, x2, x1^2, x1*x2, x2^2
\\\`\\\`\\\`

## 4. Groupby 집계 (가장 강력한 기법)

\\\`\\\`\\\`python
# 사용자별 평균 구매액
df['user_avg_amount'] = df.groupby('user_id')['amount'].transform('mean')

# 카테고리별 중앙값 가격
df['category_median_price'] = df.groupby('category')['price'].transform('median')

# 다중 집계
agg = df.groupby('user_id').agg({
    'amount': ['mean', 'std', 'min', 'max', 'sum', 'count'],
    'category': ['nunique']
})
agg.columns = ['_'.join(col) for col in agg.columns]
\\\`\\\`\\\`

## 5. 순위 피처

\\\`\\\`\\\`python
# 그룹 내 순위
df['amount_rank'] = df.groupby('category')['amount'].rank(pct=True)

# 전체 순위
df['income_percentile'] = df['income'].rank(pct=True)
\\\`\\\`\\\`
`,
      objectives: [
        '비율, 조합 피처를 생성할 수 있다',
        'Binning을 적절히 적용할 수 있다',
        'Groupby 집계로 강력한 피처를 만들 수 있다'
      ],
      keyPoints: [
        '비율/조합: 도메인 지식 활용',
        'Binning: 연속형을 범주형으로',
        'Groupby: Kaggle 최강 기법',
        '순위: 상대적 위치 표현'
      ]
    }
  },
  {
    id: 'p2w3d1t2',
    type: 'video',
    title: 'Groupby 집계 심화',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# Groupby 집계 심화

## 왜 Groupby가 강력한가?

\\\`\\\`\\\`
"고객 A의 이번 구매액은 50,000원이다"
→ 이것만으로는 많은지 적은지 알 수 없음

"고객 A의 평균 구매액은 30,000원이다"
→ 이번 구매가 평소보다 높음 → 특별 이벤트?

모델에게 맥락 정보를 제공!
\\\`\\\`\\\`

## 기본 집계 함수

\\\`\\\`\\\`python
aggregations = {
    'amount': ['mean', 'std', 'min', 'max', 'sum', 'count'],
    'quantity': ['mean', 'sum'],
    'category': ['nunique'],  # 고유값 수
    'date': ['min', 'max']    # 첫/마지막 날짜
}

user_features = df.groupby('user_id').agg(aggregations)
user_features.columns = ['_'.join(col) for col in user_features.columns]
\\\`\\\`\\\`

## 커스텀 집계 함수

\\\`\\\`\\\`python
# 람다 함수
df.groupby('user_id')['amount'].agg(
    lambda x: x.quantile(0.75) - x.quantile(0.25)  # IQR
)

# 여러 커스텀 함수
def range_diff(x):
    return x.max() - x.min()

def coef_var(x):
    return x.std() / x.mean() if x.mean() != 0 else 0

agg_funcs = {
    'amount': [range_diff, coef_var, 'skew']
}
\\\`\\\`\\\`

## 다중 그룹 집계

\\\`\\\`\\\`python
# 사용자 + 카테고리별 집계
user_category_stats = df.groupby(['user_id', 'category']).agg({
    'amount': 'mean',
    'quantity': 'sum'
}).reset_index()

# Pivot으로 변환
user_category_pivot = user_category_stats.pivot(
    index='user_id',
    columns='category',
    values='amount'
).fillna(0)
\\\`\\\`\\\`

## 시간 기반 집계

\\\`\\\`\\\`python
# 최근 30일 집계
recent = df[df['date'] >= df['date'].max() - pd.Timedelta(days=30)]
recent_stats = recent.groupby('user_id')['amount'].agg(['mean', 'sum'])

# 기간별 비교
df['month'] = df['date'].dt.to_period('M')
monthly_stats = df.groupby(['user_id', 'month'])['amount'].sum().unstack()
\\\`\\\`\\\`

## transform vs agg

\\\`\\\`\\\`python
# agg: 그룹별 하나의 값 (행 수 감소)
user_stats = df.groupby('user_id')['amount'].agg('mean')
# 결과: user_id별 1행

# transform: 원본 행 수 유지 (브로드캐스트)
df['user_avg'] = df.groupby('user_id')['amount'].transform('mean')
# 결과: 원본과 동일한 행 수
\\\`\\\`\\\`
`,
      objectives: [
        '다양한 집계 함수를 활용할 수 있다',
        '커스텀 집계 함수를 정의할 수 있다',
        'transform과 agg의 차이를 이해한다'
      ],
      keyPoints: [
        'mean, std, min, max, sum, count 기본 집계',
        'lambda로 커스텀 집계',
        'transform: 원본 행 수 유지',
        'agg: 그룹별 요약'
      ]
    }
  },
  {
    id: 'p2w3d1t3',
    type: 'code',
    title: '실습: 수치형 피처 엔지니어링',
    duration: 45,
    content: {
      instructions: `# 수치형 피처 엔지니어링 실습

## 목표
주어진 이커머스 데이터에서 수치형 피처를 생성하세요.

## 요구사항
1. 비율/조합 피처 3개 이상
2. Binning 피처 2개 이상
3. Groupby 집계 피처 5개 이상
4. 순위 피처 1개 이상
`,
      starterCode: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'order_id': range(1, n + 1),
    'user_id': np.random.randint(1, 100, n),
    'product_id': np.random.randint(1, 50, n),
    'category': np.random.choice(['Electronics', 'Clothing', 'Food', 'Books'], n),
    'price': np.random.uniform(10, 500, n),
    'quantity': np.random.randint(1, 10, n),
    'discount': np.random.uniform(0, 0.3, n),
    'order_date': pd.date_range('2024-01-01', periods=n, freq='H')
})

print("원본 데이터:")
print(df.head())
print(f"Shape: {df.shape}")

# TODO: 피처 엔지니어링 구현

# 1. 비율/조합 피처
# df['total_amount'] = ...

# 2. Binning 피처
# df['price_bin'] = ...

# 3. Groupby 집계 피처
# df['user_avg_amount'] = ...

# 4. 순위 피처
# df['amount_rank'] = ...
`,
      solutionCode: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'order_id': range(1, n + 1),
    'user_id': np.random.randint(1, 100, n),
    'product_id': np.random.randint(1, 50, n),
    'category': np.random.choice(['Electronics', 'Clothing', 'Food', 'Books'], n),
    'price': np.random.uniform(10, 500, n),
    'quantity': np.random.randint(1, 10, n),
    'discount': np.random.uniform(0, 0.3, n),
    'order_date': pd.date_range('2024-01-01', periods=n, freq='H')
})

print("원본 데이터:")
print(df.head())

# 1. 비율/조합 피처
df['total_amount'] = df['price'] * df['quantity']
df['final_amount'] = df['total_amount'] * (1 - df['discount'])
df['discount_amount'] = df['total_amount'] - df['final_amount']
df['avg_item_price'] = df['total_amount'] / df['quantity']

print("\\n비율/조합 피처 추가 완료")

# 2. Binning 피처
df['price_bin'] = pd.cut(df['price'], bins=[0, 50, 150, 300, 500],
                         labels=['저가', '중저가', '중고가', '고가'])
df['quantity_bin'] = pd.qcut(df['quantity'], q=3, labels=['소량', '중량', '대량'])

print("Binning 피처 추가 완료")

# 3. Groupby 집계 피처
# 사용자별 집계
df['user_avg_amount'] = df.groupby('user_id')['total_amount'].transform('mean')
df['user_total_orders'] = df.groupby('user_id')['order_id'].transform('count')
df['user_avg_discount'] = df.groupby('user_id')['discount'].transform('mean')

# 카테고리별 집계
df['category_median_price'] = df.groupby('category')['price'].transform('median')
df['category_avg_quantity'] = df.groupby('category')['quantity'].transform('mean')

# 사용자-카테고리별 집계
df['user_category_orders'] = df.groupby(['user_id', 'category'])['order_id'].transform('count')

print("Groupby 집계 피처 추가 완료")

# 4. 순위 피처
df['amount_rank_in_category'] = df.groupby('category')['total_amount'].rank(pct=True)
df['user_order_rank'] = df.groupby('user_id')['order_date'].rank()

print("순위 피처 추가 완료")

# 결과 확인
print(f"\\n최종 Shape: {df.shape}")
print(f"\\n새로 생성된 피처:")
new_features = [col for col in df.columns if col not in
                ['order_id', 'user_id', 'product_id', 'category',
                 'price', 'quantity', 'discount', 'order_date']]
print(new_features)
print(f"\\n총 {len(new_features)}개 피처 생성")
`,
      hints: [
        'total_amount = price * quantity',
        'pd.cut()으로 등간격 구간화',
        'transform()으로 원본 행 수 유지',
        'rank(pct=True)로 백분위 순위'
      ]
    }
  },
  {
    id: 'p2w3d1t4',
    type: 'quiz',
    title: 'Day 1 퀴즈: 수치형 피처',
    duration: 10,
    content: {
      questions: [
        {
          question: 'groupby().transform()과 groupby().agg()의 차이는?',
          options: ['transform은 더 빠르다', 'transform은 원본 행 수를 유지한다', 'agg는 커스텀 함수를 지원하지 않는다', 'transform은 여러 컬럼을 동시에 처리할 수 없다'],
          answer: 1
        },
        {
          question: 'pd.cut()과 pd.qcut()의 차이는?',
          options: ['cut은 문자열만 처리', 'cut은 등간격, qcut은 등분위', 'qcut은 범주형만 처리', 'cut은 결측치를 제거한다'],
          answer: 1
        },
        {
          question: 'Kaggle에서 가장 강력한 피처 엔지니어링 기법은?',
          options: ['One-Hot Encoding', 'Polynomial Features', 'Groupby Aggregations', 'Normalization'],
          answer: 2
        },
        {
          question: '비율 피처의 장점은?',
          options: ['계산이 빠르다', '스케일에 불변하다', '항상 정규분포를 따른다', '결측치가 발생하지 않는다'],
          answer: 1
        }
      ]
    }
  }
]
