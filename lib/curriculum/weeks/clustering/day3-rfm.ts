// Week 14 Day 3: RFM 분석
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'p2w6d3t1',
    type: 'video',
    title: 'RFM 분석 개요',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# RFM 분석

## RFM이란?

고객 가치를 3가지 지표로 평가하는 고전적 세그멘테이션 기법

\`\`\`
R (Recency): 최근성 - 마지막 구매로부터 경과 일수
F (Frequency): 빈도 - 구매 횟수
M (Monetary): 금액 - 총 구매 금액
\`\`\`

## RFM 계산

\`\`\`python
import pandas as pd

# 기준일 (분석 시점)
snapshot_date = df['order_date'].max() + pd.Timedelta(days=1)

# RFM 계산
rfm = df.groupby('customer_id').agg({
    'order_date': lambda x: (snapshot_date - x.max()).days,  # Recency
    'order_id': 'count',                                      # Frequency
    'amount': 'sum'                                           # Monetary
}).rename(columns={
    'order_date': 'Recency',
    'order_id': 'Frequency',
    'amount': 'Monetary'
})

print(rfm.head())
\`\`\`

## RFM 점수화

\`\`\`python
# 방법 1: 분위수 기반 (1-5점)
rfm['R_Score'] = pd.qcut(rfm['Recency'], 5, labels=[5,4,3,2,1])  # 낮을수록 좋음
rfm['F_Score'] = pd.qcut(rfm['Frequency'].rank(method='first'), 5, labels=[1,2,3,4,5])
rfm['M_Score'] = pd.qcut(rfm['Monetary'].rank(method='first'), 5, labels=[1,2,3,4,5])

# RFM 문자열 (예: "555", "111")
rfm['RFM_Score'] = (
    rfm['R_Score'].astype(str) +
    rfm['F_Score'].astype(str) +
    rfm['M_Score'].astype(str)
)

# RFM 합계 점수
rfm['RFM_Total'] = (
    rfm['R_Score'].astype(int) +
    rfm['F_Score'].astype(int) +
    rfm['M_Score'].astype(int)
)
\`\`\`

## 고객 세그먼트 정의

\`\`\`python
def segment_customer(row):
    r = int(row['R_Score'])
    f = int(row['F_Score'])
    m = int(row['M_Score'])

    # Champions: 최근 구매, 자주, 많이
    if r >= 4 and f >= 4 and m >= 4:
        return 'Champions'

    # Loyal Customers: 자주 구매
    elif f >= 4:
        return 'Loyal'

    # Potential Loyalists: 최근 구매, 중간 빈도
    elif r >= 4 and f >= 2:
        return 'Potential Loyalist'

    # New Customers: 최근 첫 구매
    elif r >= 4 and f == 1:
        return 'New Customers'

    # At Risk: 이전엔 자주 구매, 최근 없음
    elif r <= 2 and f >= 3:
        return 'At Risk'

    # Lost: 오래 전 구매, 적은 빈도
    elif r <= 2 and f <= 2:
        return 'Lost'

    else:
        return 'Others'

rfm['Segment'] = rfm.apply(segment_customer, axis=1)

print(rfm['Segment'].value_counts())
\`\`\`

## 세그먼트별 전략

| 세그먼트 | 특성 | 마케팅 전략 |
|----------|------|-------------|
| Champions | 최고 고객 | VIP 프로그램, 신제품 우선 |
| Loyal | 충성 고객 | 보상 프로그램, 업셀링 |
| Potential | 성장 잠재력 | 맴버십 권유, 교차판매 |
| New | 신규 고객 | 온보딩, 첫 구매 할인 |
| At Risk | 이탈 위험 | 재활성화 캠페인 |
| Lost | 이탈 고객 | 윈백 캠페인, 할인 쿠폰 |
`,
      objectives: [
        'RFM 분석의 개념을 이해한다',
        'RFM 점수를 계산할 수 있다',
        '고객 세그먼트를 정의할 수 있다'
      ],
      keyPoints: [
        'R: 최근성 (낮을수록 좋음)',
        'F: 빈도 (높을수록 좋음)',
        'M: 금액 (높을수록 좋음)',
        '세그먼트별 마케팅 전략 차별화'
      ]
    }
  },
  {
    id: 'p2w6d3t2',
    type: 'code',
    title: '실습: RFM 분석',
    duration: 45,
    content: {
      instructions: `# RFM 분석 실습

## 목표
주문 데이터로 RFM 분석을 수행하세요.

## 요구사항
1. RFM 지표 계산
2. 5분위 점수화
3. 세그먼트 정의
4. 세그먼트별 통계
5. 마케팅 전략 제안
`,
      starterCode: `import pandas as pd
import numpy as np

# 주문 데이터 생성
np.random.seed(42)
n_orders = 5000
n_customers = 500

orders = pd.DataFrame({
    'order_id': range(n_orders),
    'customer_id': np.random.randint(1, n_customers + 1, n_orders),
    'order_date': pd.date_range('2023-01-01', periods=n_orders, freq='H'),
    'amount': np.random.exponential(100, n_orders)
})

# 일부 VIP 고객 패턴
vip_customers = np.random.choice(range(1, 51), 20, replace=False)
for cust in vip_customers:
    mask = orders['customer_id'] == cust
    orders.loc[mask, 'amount'] *= 3

print(f"주문 수: {len(orders)}")
print(f"고객 수: {orders['customer_id'].nunique()}")
print(f"기간: {orders['order_date'].min()} ~ {orders['order_date'].max()}")

# TODO: RFM 분석
`,
      solutionCode: `import pandas as pd
import numpy as np

np.random.seed(42)
n_orders = 5000
n_customers = 500

orders = pd.DataFrame({
    'order_id': range(n_orders),
    'customer_id': np.random.randint(1, n_customers + 1, n_orders),
    'order_date': pd.date_range('2023-01-01', periods=n_orders, freq='H'),
    'amount': np.random.exponential(100, n_orders)
})

vip_customers = np.random.choice(range(1, 51), 20, replace=False)
for cust in vip_customers:
    mask = orders['customer_id'] == cust
    orders.loc[mask, 'amount'] *= 3

# 1. RFM 계산
print("=== 1. RFM 계산 ===")
snapshot_date = orders['order_date'].max() + pd.Timedelta(days=1)

rfm = orders.groupby('customer_id').agg({
    'order_date': lambda x: (snapshot_date - x.max()).days,
    'order_id': 'count',
    'amount': 'sum'
}).rename(columns={
    'order_date': 'Recency',
    'order_id': 'Frequency',
    'amount': 'Monetary'
})

print(rfm.describe().round(1))

# 2. 점수화
print("\\n=== 2. 점수화 ===")
rfm['R_Score'] = pd.qcut(rfm['Recency'], 5, labels=[5,4,3,2,1])
rfm['F_Score'] = pd.qcut(rfm['Frequency'].rank(method='first'), 5, labels=[1,2,3,4,5])
rfm['M_Score'] = pd.qcut(rfm['Monetary'].rank(method='first'), 5, labels=[1,2,3,4,5])

rfm['RFM_Score'] = rfm['R_Score'].astype(str) + rfm['F_Score'].astype(str) + rfm['M_Score'].astype(str)

# 3. 세그먼트 정의
def segment_customer(row):
    r, f, m = int(row['R_Score']), int(row['F_Score']), int(row['M_Score'])

    if r >= 4 and f >= 4:
        return 'Champions'
    elif f >= 4:
        return 'Loyal'
    elif r >= 4 and f >= 2:
        return 'Potential Loyalist'
    elif r >= 4 and f == 1:
        return 'New Customers'
    elif r <= 2 and f >= 3:
        return 'At Risk'
    elif r <= 2 and f <= 2:
        return 'Lost'
    else:
        return 'Others'

rfm['Segment'] = rfm.apply(segment_customer, axis=1)

# 4. 세그먼트별 통계
print("\\n=== 3. 세그먼트별 통계 ===")
segment_stats = rfm.groupby('Segment').agg({
    'Recency': 'mean',
    'Frequency': 'mean',
    'Monetary': ['mean', 'sum'],
    'R_Score': 'count'
}).round(1)
segment_stats.columns = ['Avg_Recency', 'Avg_Frequency', 'Avg_Monetary', 'Total_Revenue', 'Count']
print(segment_stats.sort_values('Avg_Monetary', ascending=False))

# 5. 마케팅 전략
print("\\n=== 4. 세그먼트별 마케팅 전략 ===")
strategies = {
    'Champions': 'VIP 프로그램, 신제품 우선 안내, 리뷰 요청',
    'Loyal': '보상 프로그램, 업셀링, 멤버십 혜택',
    'Potential Loyalist': '멤버십 가입 유도, 교차판매',
    'New Customers': '온보딩 이메일, 첫 구매 혜택',
    'At Risk': '재활성화 캠페인, 개인화 쿠폰',
    'Lost': '윈백 캠페인, 대폭 할인'
}

for segment, strategy in strategies.items():
    count = len(rfm[rfm['Segment'] == segment])
    print(f"[{segment}] ({count}명): {strategy}")
`,
      hints: [
        'snapshot_date는 분석 기준일',
        'qcut으로 균등 분위수 분할',
        'rank(method="first")로 동점 처리',
        '세그먼트별 전략은 비즈니스 맥락 고려'
      ]
    }
  },
  {
    id: 'p2w6d3t3',
    type: 'quiz',
    title: 'Day 3 퀴즈: RFM',
    duration: 10,
    content: {
      questions: [
        {
          question: 'RFM에서 R(Recency)이 낮을수록 의미하는 것은?',
          options: ['오래된 고객', '최근에 구매한 고객', '자주 구매하는 고객', '많이 구매하는 고객'],
          answer: 1
        },
        {
          question: 'At Risk 세그먼트의 특징은?',
          options: ['최근 구매, 높은 빈도', '이전엔 자주 구매, 최근 없음', '신규 고객', '최고 고객'],
          answer: 1
        },
        {
          question: 'Champions 세그먼트에 적합한 전략은?',
          options: ['대폭 할인', 'VIP 프로그램', '재활성화 캠페인', '온보딩 이메일'],
          answer: 1
        }
      ]
    }
  }
]
