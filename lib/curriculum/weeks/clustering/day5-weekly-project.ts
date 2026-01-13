// Week 14 Day 5: Weekly Project - 고객 세그멘테이션
import type { Task } from '../../types'

export const day5Tasks: Task[] = [
  {
    id: 'p2w6d5t1',
    type: 'reading',
    title: 'Weekly Project 가이드',
    duration: 15,
    content: {
      markdown: `# Weekly Project: 고객 세그멘테이션 & 마케팅 전략

## 프로젝트 개요

이번 주에 배운 클러스터링 기법을 종합하여
고객을 세그멘테이션하고 마케팅 전략을 도출합니다.

## 데이터셋 선택

### 옵션 1: Online Retail Dataset (UCI)
- 541,909 거래 기록
- 8개 국가, 4,372 고객
- RFM 분석에 최적

### 옵션 2: Mall Customer Segmentation (Kaggle)
- 200명 고객
- 연령, 소득, 지출 점수
- 입문용

### 옵션 3: E-commerce Data (자체)
- 실무 데이터 활용

## 요구사항

### 1. 데이터 전처리 (15%)
- 결측치 처리
- 이상치 탐지 및 처리
- 피처 스케일링

### 2. RFM 분석 (20%)
- RFM 지표 계산
- 분위수 기반 점수화
- RFM 세그먼트 정의

### 3. 클러스터링 비교 (25%)
- K-means (최적 K 탐색)
- DBSCAN
- 3가지 비교 및 선정

### 4. 클러스터 프로파일링 (20%)
- 클러스터별 통계
- PCA 시각화
- Radar Chart
- 클러스터 네이밍

### 5. 마케팅 전략 (20%)
- 세그먼트별 특성 분석
- 타겟 마케팅 전략 제안
- 예상 ROI 논의

## 평가 기준

| 항목 | 배점 |
|------|------|
| 데이터 전처리 | 15% |
| RFM 분석 | 20% |
| 클러스터링 비교 | 25% |
| 프로파일링 | 20% |
| 마케팅 전략 | 20% |
`,
      externalLinks: [
        { title: 'Online Retail Dataset', url: 'https://archive.ics.uci.edu/ml/datasets/Online+Retail' },
        { title: 'Mall Customers Dataset', url: 'https://www.kaggle.com/vjchoudhary7/customer-segmentation-tutorial-in-python' },
        { title: 'RFM Analysis Guide', url: 'https://clevertap.com/blog/rfm-analysis/' }
      ]
    }
  },
  {
    id: 'p2w6d5t2',
    type: 'code',
    title: '프로젝트 템플릿',
    duration: 90,
    content: {
      instructions: `# 고객 세그멘테이션 프로젝트

종합 클러스터링 프로젝트를 완성하세요.

## 체크리스트
- [ ] 데이터 전처리
- [ ] RFM 분석
- [ ] K-means 클러스터링
- [ ] DBSCAN 시도
- [ ] 클러스터 프로파일링
- [ ] PCA 시각화
- [ ] 마케팅 전략 도출
`,
      starterCode: `"""
고객 세그멘테이션 프로젝트
Week 14 Weekly Project
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA

# =============================================================================
# 1. 데이터 로드 & 전처리
# =============================================================================
print("=== 1. 데이터 로드 ===")

np.random.seed(42)
n_customers = 500
n_orders = 5000

# 주문 데이터 생성
orders = pd.DataFrame({
    'order_id': range(n_orders),
    'customer_id': np.random.randint(1, n_customers + 1, n_orders),
    'order_date': pd.date_range('2023-01-01', periods=n_orders, freq='2H'),
    'amount': np.abs(np.random.exponential(80, n_orders))
})

# VIP 고객 패턴 추가
vip_ids = np.random.choice(range(1, 51), 30, replace=False)
for cust in vip_ids:
    mask = orders['customer_id'] == cust
    orders.loc[mask, 'amount'] *= 2.5

print(f"주문 수: {len(orders)}")
print(f"고객 수: {orders['customer_id'].nunique()}")

# =============================================================================
# 2. RFM 분석
# =============================================================================
print("\\n=== 2. RFM 분석 ===")

# TODO: RFM 계산 및 점수화

# =============================================================================
# 3. 클러스터링
# =============================================================================
print("\\n=== 3. 클러스터링 ===")

# TODO: K-means, DBSCAN 비교

# =============================================================================
# 4. 프로파일링 & 시각화
# =============================================================================
print("\\n=== 4. 프로파일링 ===")

# TODO: 클러스터 프로파일, PCA 시각화

# =============================================================================
# 5. 마케팅 전략
# =============================================================================
print("\\n=== 5. 마케팅 전략 ===")

# TODO: 세그먼트별 전략 도출
`,
      solutionCode: `"""
고객 세그멘테이션 프로젝트 - 완성본
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA

# 1. 데이터 로드
print("=== 1. 데이터 로드 ===")
np.random.seed(42)
n_customers = 500
n_orders = 5000

orders = pd.DataFrame({
    'order_id': range(n_orders),
    'customer_id': np.random.randint(1, n_customers + 1, n_orders),
    'order_date': pd.date_range('2023-01-01', periods=n_orders, freq='2H'),
    'amount': np.abs(np.random.exponential(80, n_orders))
})

vip_ids = np.random.choice(range(1, 51), 30, replace=False)
for cust in vip_ids:
    mask = orders['customer_id'] == cust
    orders.loc[mask, 'amount'] *= 2.5

print(f"주문 수: {len(orders)}, 고객 수: {orders['customer_id'].nunique()}")

# 2. RFM 분석
print("\\n=== 2. RFM 분석 ===")
snapshot = orders['order_date'].max() + pd.Timedelta(days=1)

rfm = orders.groupby('customer_id').agg({
    'order_date': lambda x: (snapshot - x.max()).days,
    'order_id': 'count',
    'amount': 'sum'
}).rename(columns={
    'order_date': 'Recency',
    'order_id': 'Frequency',
    'amount': 'Monetary'
})

# RFM 점수화
rfm['R_Score'] = pd.qcut(rfm['Recency'], 5, labels=[5,4,3,2,1])
rfm['F_Score'] = pd.qcut(rfm['Frequency'].rank(method='first'), 5, labels=[1,2,3,4,5])
rfm['M_Score'] = pd.qcut(rfm['Monetary'].rank(method='first'), 5, labels=[1,2,3,4,5])

print(rfm[['Recency', 'Frequency', 'Monetary']].describe().round(1))

# 3. 클러스터링
print("\\n=== 3. 클러스터링 ===")

features = ['Recency', 'Frequency', 'Monetary']
scaler = StandardScaler()
X_scaled = scaler.fit_transform(rfm[features])

# K-means 최적 K 탐색
print("K-means 최적 K 탐색:")
silhouettes = []
for k in range(2, 7):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = km.fit_predict(X_scaled)
    sil = silhouette_score(X_scaled, labels)
    silhouettes.append(sil)
    print(f"  K={k}: Silhouette={sil:.3f}")

optimal_k = range(2, 7)[np.argmax(silhouettes)]
print(f"\\n최적 K: {optimal_k}")

# 최종 K-means
kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
rfm['cluster'] = kmeans.fit_predict(X_scaled)

# DBSCAN 시도
dbscan = DBSCAN(eps=0.8, min_samples=10)
db_labels = dbscan.fit_predict(X_scaled)
n_clusters_db = len(set(db_labels)) - (1 if -1 in db_labels else 0)
n_noise = (db_labels == -1).sum()
print(f"\\nDBSCAN: {n_clusters_db}개 클러스터, {n_noise}개 노이즈")

# 4. 프로파일링
print("\\n=== 4. 클러스터 프로파일 ===")
profile = rfm.groupby('cluster')[features].agg(['mean', 'count'])
print(profile.round(1))

# 클러스터 네이밍
print("\\n클러스터 해석:")
for c in range(optimal_k):
    cluster_data = rfm[rfm['cluster'] == c]
    r_avg = cluster_data['Recency'].mean()
    f_avg = cluster_data['Frequency'].mean()
    m_avg = cluster_data['Monetary'].mean()

    if r_avg < 100 and f_avg > 12:
        name = "Champions"
    elif f_avg > 10:
        name = "Loyal"
    elif r_avg > 200:
        name = "Lost"
    elif r_avg < 100 and f_avg < 8:
        name = "New"
    else:
        name = "At Risk"

    print(f"  클러스터 {c} ({name}): R={r_avg:.0f}, F={f_avg:.1f}, M=\${m_avg:,.0f}")

# PCA 시각화
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)
print(f"\\nPCA 설명 분산: {sum(pca.explained_variance_ratio_)*100:.1f}%")

# 5. 마케팅 전략
print("\\n=== 5. 마케팅 전략 ===")
strategies = {
    'Champions': '- VIP 프로그램 초대\\n- 신제품 우선 안내\\n- 리뷰/추천 요청',
    'Loyal': '- 멤버십 혜택 강화\\n- 업셀링 추천\\n- 충성도 보상',
    'New': '- 웰컴 시리즈 이메일\\n- 첫 구매 혜택\\n- 온보딩 콘텐츠',
    'At Risk': '- 재활성화 캠페인\\n- 개인화 쿠폰\\n- 이탈 방지 CS',
    'Lost': '- 윈백 할인 캠페인\\n- 새로운 가치 제안\\n- 마지막 시도 후 비활성화'
}

for segment, strategy in strategies.items():
    print(f"\\n[{segment}]")
    print(strategy)

# 세그먼트별 수익 기여
print("\\n=== 세그먼트별 수익 기여 ===")
for c in range(optimal_k):
    cluster_revenue = rfm[rfm['cluster'] == c]['Monetary'].sum()
    total_revenue = rfm['Monetary'].sum()
    pct = cluster_revenue / total_revenue * 100
    count = len(rfm[rfm['cluster'] == c])
    print(f"클러스터 {c}: \${cluster_revenue:,.0f} ({pct:.1f}%), {count}명")
`,
      hints: [
        'snapshot_date는 분석 기준일',
        'silhouette_score로 최적 K',
        '클러스터 특성 보고 비즈니스 네이밍',
        '전략은 실행 가능해야 함'
      ]
    }
  },
  {
    id: 'p2w6d5t3',
    type: 'quiz',
    title: 'Week 14 종합 퀴즈',
    duration: 20,
    content: {
      questions: [
        {
          question: 'K-means에서 스케일링이 필요한 이유는?',
          options: ['속도 향상', '거리 계산 시 피처 영향 균등화', '과적합 방지', '클러스터 수 결정'],
          answer: 1
        },
        {
          question: 'DBSCAN의 장점이 아닌 것은?',
          options: ['K 사전 지정 불필요', '이상치 자동 분리', '임의 형태 클러스터', '대용량에서 빠름'],
          answer: 3
        },
        {
          question: 'RFM에서 R(Recency) 점수가 높다는 것은?',
          options: ['오래전 구매', '최근 구매', '자주 구매', '많이 구매'],
          answer: 1
        },
        {
          question: 'Silhouette Score가 0.7이면?',
          options: ['나쁜 클러스터링', '보통', '좋은 클러스터링', '과적합'],
          answer: 2
        },
        {
          question: 'PCA 시각화의 목적은?',
          options: ['클러스터 수 결정', '고차원 데이터 2D 표현', '이상치 제거', '스케일링'],
          answer: 1
        },
        {
          question: 'At Risk 세그먼트에 적합한 전략은?',
          options: ['VIP 프로그램', '재활성화 캠페인', '온보딩 이메일', '신제품 안내'],
          answer: 1,
          explanation: 'At Risk는 이전에 활발했지만 최근 구매가 없는 고객입니다. 이탈 방지를 위해 재활성화 캠페인(개인화 쿠폰, 이탈 방지 CS 등)이 적합합니다.'
        }
      ]
    }
  },
  {
    id: 'p2w6d5t4',
    type: 'challenge',
    title: '주간 도전과제: 실제 데이터 세그멘테이션',
    duration: 60,
    content: {
      instructions: `# 주간 도전과제: 실제 데이터 세그멘테이션

## 목표
UCI Online Retail 데이터셋으로 실제 고객 세그멘테이션을 수행하세요.

## 데이터셋

### UCI Online Retail II Dataset
- 1,067,371 거래 기록
- 2009-2011년 UK 온라인 리테일
- 41개국 4,373 고객
- URL: archive.ics.uci.edu/ml/datasets/Online+Retail+II

## 요구사항

### 1. 데이터 전처리 (20점)
- 결측치 및 이상치 처리
- 환불/취소 거래 처리 (음수 수량)
- UK 고객만 또는 전체 선택
- 분석 기간 설정

### 2. RFM 분석 (30점)
- R, F, M 계산 및 분포 확인
- 이상치 처리 (상위 1% cap 등)
- 5분위 점수화
- 세그먼트 정의 및 명명

### 3. 클러스터링 비교 (25점)
- K-means (최적 K 탐색)
- RFM 점수 기반 vs 원시 RFM 값 비교
- Silhouette Score로 품질 평가

### 4. 인사이트 & 전략 (25점)
- 세그먼트별 고객 특성 분석
- 세그먼트별 매출 기여도
- 실행 가능한 마케팅 전략 제안
- 예상 ROI 논의

## 평가 기준

| 항목 | 점수 |
|------|------|
| 데이터 전처리 품질 | 20점 |
| RFM 분석 정확성 | 30점 |
| 클러스터링 결과 | 25점 |
| 비즈니스 인사이트 | 25점 |

## 보너스 포인트
- 국가별 세그먼트 비교: +10점
- 시계열 변화 분석 (분기별): +10점
- 대시보드 시각화 (Plotly): +5점

## 제출물
1. 분석 코드 (Jupyter Notebook)
2. 결과 리포트 (마크다운)
3. 세그먼트 프로파일 테이블

## 참고 자료
- UCI ML Repository
- Kaggle: Online Retail 분석 노트북
- RFM Analysis Best Practices
`,
      starterCode: `"""
Week 14 주간 도전과제: 실제 데이터 세그멘테이션
UCI Online Retail Dataset
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA
import warnings
warnings.filterwarnings('ignore')

# =============================================================================
# 1. 데이터 로드 (실제 데이터 다운로드 필요)
# =============================================================================
print("=== 1. 데이터 로드 ===")

# UCI 데이터 로드 (실제 파일 경로로 수정)
# df = pd.read_excel('Online Retail.xlsx')

# 데모용 합성 데이터 (실제 분석 시 위 코드 사용)
np.random.seed(42)
n_orders = 10000
n_customers = 800

df = pd.DataFrame({
    'InvoiceNo': [f'INV{i:06d}' for i in range(n_orders)],
    'StockCode': np.random.choice([f'SKU{i}' for i in range(200)], n_orders),
    'Description': np.random.choice(['Widget', 'Gadget', 'Tool', 'Part', 'Item'], n_orders),
    'Quantity': np.random.randint(1, 20, n_orders),
    'InvoiceDate': pd.date_range('2022-01-01', periods=n_orders, freq='52min'),
    'UnitPrice': np.random.exponential(5, n_orders) + 1,
    'CustomerID': np.random.randint(10000, 10000 + n_customers, n_orders),
    'Country': np.random.choice(['United Kingdom', 'Germany', 'France', 'USA'], n_orders,
                                p=[0.7, 0.1, 0.1, 0.1])
})

# 환불 데이터 추가 (일부 음수 수량)
refund_idx = np.random.choice(len(df), 500, replace=False)
df.loc[refund_idx, 'InvoiceNo'] = 'C' + df.loc[refund_idx, 'InvoiceNo']
df.loc[refund_idx, 'Quantity'] = -df.loc[refund_idx, 'Quantity']

# VIP 패턴
vip_customers = np.random.choice(df['CustomerID'].unique()[:50], 30, replace=False)
for cust in vip_customers:
    mask = df['CustomerID'] == cust
    df.loc[mask, 'Quantity'] *= 3
    df.loc[mask, 'UnitPrice'] *= 2

print(f"주문 수: {len(df)}")
print(f"고객 수: {df['CustomerID'].nunique()}")
print(f"국가 수: {df['Country'].nunique()}")

# =============================================================================
# 2. 데이터 전처리
# =============================================================================
print("\\n=== 2. 데이터 전처리 ===")

# TODO: 환불 처리, 결측치 제거, 금액 계산

# =============================================================================
# 3. RFM 분석
# =============================================================================
print("\\n=== 3. RFM 분석 ===")

# TODO: RFM 계산, 점수화, 세그먼트 정의

# =============================================================================
# 4. 클러스터링
# =============================================================================
print("\\n=== 4. 클러스터링 ===")

# TODO: K-means 최적 K 탐색, 클러스터링

# =============================================================================
# 5. 인사이트 & 전략
# =============================================================================
print("\\n=== 5. 인사이트 & 전략 ===")

# TODO: 세그먼트별 분석, 마케팅 전략 제안

print("\\n도전과제 완료!")
`,
      hints: [
        'InvoiceNo가 "C"로 시작하면 환불/취소',
        'TotalAmount = Quantity * UnitPrice',
        'CustomerID가 NaN인 행 제거 필요',
        'RFM 값 분포 확인 후 이상치 처리'
      ]
    }
  }
]
