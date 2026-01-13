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
          answer: 1,
          explanation: 'Recency는 마지막 구매일로부터 경과한 일수입니다. 값이 낮을수록 최근에 구매했다는 의미로, 더 가치 있는 고객입니다.'
        },
        {
          question: 'At Risk 세그먼트의 특징은?',
          options: ['최근 구매, 높은 빈도', '이전엔 자주 구매, 최근 없음', '신규 고객', '최고 고객'],
          answer: 1,
          explanation: 'At Risk는 과거에는 자주 구매했지만(높은 F) 최근에는 구매가 없는(낮은 R) 고객입니다. 이탈 위험이 높아 재활성화 캠페인이 필요합니다.'
        },
        {
          question: 'Champions 세그먼트에 적합한 전략은?',
          options: ['대폭 할인', 'VIP 프로그램', '재활성화 캠페인', '온보딩 이메일'],
          answer: 1,
          explanation: 'Champions는 R,F,M 모두 높은 최고 가치 고객입니다. 할인보다는 VIP 프로그램, 신제품 우선 안내, 브랜드 앰배서더 역할 등으로 관계를 강화합니다.'
        }
      ]
    }
  },
  {
    id: 'p2w6d3t4',
    type: 'video',
    title: 'RFM 고급 기법과 실전 팁',
    duration: 18,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# RFM 고급 기법과 실전 팁

## 1. RFM + 클러스터링 결합

\`\`\`python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# RFM 값으로 클러스터링
features = ['Recency', 'Frequency', 'Monetary']
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(rfm[features])

# K-means 적용
kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
rfm['cluster'] = kmeans.fit_predict(rfm_scaled)

# 클러스터별 RFM 프로파일
cluster_profile = rfm.groupby('cluster')[features].mean()
print(cluster_profile.round(1))
\`\`\`

## 2. RFM 가중치 적용

비즈니스에 따라 R,F,M의 중요도가 다름

\`\`\`python
# 방법 1: 가중 합계
weights = {'R': 0.3, 'F': 0.3, 'M': 0.4}  # 금액 중시
rfm['weighted_score'] = (
    rfm['R_Score'].astype(int) * weights['R'] +
    rfm['F_Score'].astype(int) * weights['F'] +
    rfm['M_Score'].astype(int) * weights['M']
)

# 방법 2: FM 점수 (SaaS에서 자주 사용)
# Recency 제외, Frequency와 Monetary만 고려
rfm['FM_Score'] = rfm['F_Score'].astype(int) + rfm['M_Score'].astype(int)
\`\`\`

## 3. RFM 세그먼트 자동화

\`\`\`python
# 세그먼트 매핑 테이블
seg_map = {
    r'[4-5][4-5]': 'Champions',
    r'[2-5][4-5]': 'Loyal',
    r'[4-5][2-3]': 'Potential',
    r'[4-5][0-1]': 'New',
    r'[0-2][2-5]': 'At Risk',
    r'[0-2][0-1]': 'Lost'
}

# RF 점수로 세그먼트 결정
rfm['RF'] = rfm['R_Score'].astype(str) + rfm['F_Score'].astype(str)

def map_segment(rf):
    import re
    for pattern, segment in seg_map.items():
        if re.match(pattern, rf):
            return segment
    return 'Others'

rfm['segment'] = rfm['RF'].apply(map_segment)
\`\`\`

## 4. RFM 대시보드 지표

\`\`\`python
# 핵심 KPI
kpis = {
    '총 고객 수': len(rfm),
    'Champions 비율': f"{(rfm['segment']=='Champions').mean()*100:.1f}%",
    'At Risk 비율': f"{(rfm['segment']=='At Risk').mean()*100:.1f}%",
    'Champions 매출 기여': f"{rfm[rfm['segment']=='Champions']['Monetary'].sum() / rfm['Monetary'].sum() * 100:.1f}%",
    '평균 CLV': '$' + f"{rfm['Monetary'].mean():,.0f}"
}

for key, value in kpis.items():
    print(f"{key}: {value}")
\`\`\`

## 5. 실전 주의사항

\`\`\`
✅ 좋은 실천:
- 분석 기간 설정 (최근 1년? 2년?)
- 비즈니스 맥락에 맞는 세그먼트 정의
- 정기적 업데이트 (월간/분기별)
- A/B 테스트로 전략 검증

❌ 피해야 할 것:
- 단발성 분석으로 끝내기
- 모든 세그먼트에 같은 전략
- 과도한 세분화 (3-7개가 적당)
- 실행 없는 분석
\`\`\`
`,
      objectives: [
        'RFM과 클러스터링을 결합할 수 있다',
        'RFM 가중치를 비즈니스에 맞게 조정할 수 있다',
        'RFM 대시보드 KPI를 설계할 수 있다'
      ],
      keyPoints: [
        'RFM + K-means로 더 정교한 세그먼트',
        '가중치로 비즈니스 특성 반영',
        'Champions 매출 기여도 추적',
        '정기 업데이트와 A/B 테스트 필수'
      ]
    }
  },
  {
    id: 'p2w6d3t5',
    type: 'challenge',
    title: '도전과제: RFM 대시보드 구축',
    duration: 35,
    content: {
      instructions: `# 도전과제: RFM 분석 대시보드

## 목표
RFM 분석 결과를 시각화하는 종합 대시보드를 구축하세요.

## 요구사항

### 1. RFM 분석 (30점)
- RFM 계산 및 5분위 점수화
- 세그먼트 정의 (최소 6개)
- 세그먼트별 고객 수와 비율

### 2. 시각화 대시보드 (40점)
- 세그먼트별 파이 차트
- RFM 히트맵 (R점수 × F점수 매트릭스)
- 세그먼트별 Monetary 박스플롯
- 3D 산점도 (R, F, M 축)

### 3. 비즈니스 인사이트 (30점)
- 세그먼트별 매출 기여도 분석
- 이탈 위험 고객 리스트 (상위 20명)
- 세그먼트별 마케팅 전략 제안

## 평가 기준

| 항목 | 점수 |
|------|------|
| RFM 분석 정확성 | 30점 |
| 시각화 품질 | 40점 |
| 인사이트 실용성 | 30점 |

## 보너스
- RFM + K-means 결합 분석: +10점
- CLV 추정 추가: +5점
`,
      starterCode: `"""
RFM 대시보드 도전과제
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# 주문 데이터 생성
np.random.seed(42)
n_customers = 1000
n_orders = 15000

orders = pd.DataFrame({
    'order_id': range(n_orders),
    'customer_id': np.random.randint(1, n_customers + 1, n_orders),
    'order_date': pd.date_range('2022-01-01', periods=n_orders, freq='35min'),
    'amount': np.abs(np.random.exponential(75, n_orders))
})

# VIP 패턴
vip_ids = np.random.choice(range(1, 101), 50, replace=False)
for cust in vip_ids:
    mask = orders['customer_id'] == cust
    orders.loc[mask, 'amount'] *= 3

# 휴면 패턴
dormant_ids = np.random.choice(range(500, 700), 100, replace=False)
for cust in dormant_ids:
    mask = orders['customer_id'] == cust
    orders.loc[mask, 'order_date'] -= pd.Timedelta(days=180)

print(f"주문 수: {len(orders)}")
print(f"고객 수: {orders['customer_id'].nunique()}")
print(f"기간: {orders['order_date'].min()} ~ {orders['order_date'].max()}")

# =============================================================================
# 1. RFM 분석
# =============================================================================
print("\\n=== 1. RFM 분석 ===")

# TODO: RFM 계산 및 세그먼트 정의

# =============================================================================
# 2. 시각화 대시보드
# =============================================================================
print("\\n=== 2. 시각화 대시보드 ===")

# TODO: 4개 시각화 (파이, 히트맵, 박스플롯, 3D)

# =============================================================================
# 3. 비즈니스 인사이트
# =============================================================================
print("\\n=== 3. 비즈니스 인사이트 ===")

# TODO: 매출 기여도, 이탈 위험 고객, 마케팅 전략
`,
      hints: [
        'pd.qcut으로 5분위 점수화',
        'plt.subplot(2, 2, n)으로 대시보드 레이아웃',
        'pd.crosstab()으로 히트맵 데이터 생성',
        'fig.add_subplot(projection="3d")로 3D 플롯'
      ]
    }
  }
]
