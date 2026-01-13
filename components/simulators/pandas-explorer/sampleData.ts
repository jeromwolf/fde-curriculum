// Pandas Explorer 샘플 데이터 및 작업

import { DatasetInfo, SampleOperation } from './types'

// 데이터셋 정보
export const datasets: DatasetInfo[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce 주문 데이터',
    description: '온라인 쇼핑몰의 고객 주문 데이터 (고객, 주문, 상품 정보 포함)',
    rows: 1000,
    columns: 12,
    size: '~100KB',
    category: 'ecommerce',
  },
  {
    id: 'timeseries',
    name: '일별 매출 데이터',
    description: '2년간의 일별 매출, 방문자, 전환율 데이터',
    rows: 730,
    columns: 8,
    size: '~50KB',
    category: 'timeseries',
  },
  {
    id: 'finance',
    name: '주식 가격 데이터',
    description: '5개 종목의 OHLCV 데이터',
    rows: 500,
    columns: 7,
    size: '~30KB',
    category: 'finance',
  },
]

// 데이터셋 생성 코드
export const datasetGenerators: Record<string, string> = {
  ecommerce: `
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

# 고객 데이터
n_orders = 1000
customers = [f"C{str(i).zfill(4)}" for i in range(1, 201)]
products = ["노트북", "스마트폰", "태블릿", "이어폰", "스마트워치", "키보드", "마우스", "모니터", "SSD", "RAM"]
categories = ["전자제품", "컴퓨터", "액세서리", "저장장치"]
cities = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "수원", "고양", "용인"]
genders = ["M", "F"]
tiers = ["Bronze", "Silver", "Gold", "Platinum"]

# 주문 데이터 생성
start_date = datetime(2023, 1, 1)
dates = [start_date + timedelta(days=np.random.randint(0, 365)) for _ in range(n_orders)]

df = pd.DataFrame({
    "order_id": [f"ORD{str(i).zfill(5)}" for i in range(1, n_orders + 1)],
    "order_date": dates,
    "customer_id": np.random.choice(customers, n_orders),
    "product": np.random.choice(products, n_orders),
    "category": np.random.choice(categories, n_orders),
    "quantity": np.random.randint(1, 5, n_orders),
    "unit_price": np.random.choice([29900, 49900, 99900, 199900, 299900, 499900, 999900, 1499900], n_orders),
    "city": np.random.choice(cities, n_orders),
    "gender": np.random.choice(genders, n_orders),
    "age": np.random.randint(20, 60, n_orders),
    "tier": np.random.choice(tiers, n_orders, p=[0.4, 0.3, 0.2, 0.1]),
    "is_member": np.random.choice([True, False], n_orders, p=[0.7, 0.3])
})

df["total_amount"] = df["quantity"] * df["unit_price"]
df["order_date"] = pd.to_datetime(df["order_date"])

# 일부 결측치 추가
df.loc[np.random.choice(df.index, 50), "age"] = np.nan
df.loc[np.random.choice(df.index, 30), "city"] = np.nan

print("E-Commerce 데이터셋 생성 완료!")
print(f"Shape: {df.shape}")
`,
  timeseries: `
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

# 날짜 범위 생성
start_date = datetime(2022, 1, 1)
dates = pd.date_range(start=start_date, periods=730, freq='D')

# 시계열 데이터 생성 (트렌드 + 계절성 + 노이즈)
n = len(dates)
trend = np.linspace(100000, 150000, n)
seasonal = 20000 * np.sin(np.linspace(0, 4*np.pi, n))  # 연간 계절성
weekly = 10000 * np.sin(np.arange(n) * 2 * np.pi / 7)  # 주간 계절성
noise = np.random.normal(0, 5000, n)

sales = trend + seasonal + weekly + noise
sales = np.maximum(sales, 50000)  # 최소값 보장

# 방문자 수 (매출과 상관관계)
visitors = (sales / 50 + np.random.normal(0, 100, n)).astype(int)
visitors = np.maximum(visitors, 500)

# 전환율
conversion_rate = (np.random.normal(3.5, 0.5, n) +
                   0.5 * np.sin(np.arange(n) * 2 * np.pi / 30))  # 월간 패턴
conversion_rate = np.clip(conversion_rate, 1.5, 6.0)

df = pd.DataFrame({
    "date": dates,
    "sales": sales.astype(int),
    "visitors": visitors,
    "orders": (visitors * conversion_rate / 100).astype(int),
    "conversion_rate": np.round(conversion_rate, 2),
    "avg_order_value": np.round(sales / (visitors * conversion_rate / 100), 0),
    "new_visitors_pct": np.round(np.random.normal(35, 5, n), 1),
    "day_of_week": dates.dayofweek
})

print("시계열 매출 데이터셋 생성 완료!")
print(f"Shape: {df.shape}")
`,
  finance: `
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

# 주식 종목
tickers = ["AAPL", "GOOGL", "MSFT", "AMZN", "NVDA"]
n_days = 100

all_data = []

for ticker in tickers:
    dates = pd.date_range(start="2024-01-01", periods=n_days, freq='B')

    # 시작 가격
    base_price = {"AAPL": 180, "GOOGL": 140, "MSFT": 370, "AMZN": 150, "NVDA": 500}[ticker]

    # 랜덤 워크로 가격 생성
    returns = np.random.normal(0.001, 0.02, n_days)
    prices = base_price * np.cumprod(1 + returns)

    # OHLCV 데이터
    for i, date in enumerate(dates):
        close = prices[i]
        high = close * (1 + abs(np.random.normal(0, 0.015)))
        low = close * (1 - abs(np.random.normal(0, 0.015)))
        open_price = np.random.uniform(low, high)
        volume = int(np.random.normal(10000000, 2000000))

        all_data.append({
            "date": date,
            "ticker": ticker,
            "open": round(open_price, 2),
            "high": round(high, 2),
            "low": round(low, 2),
            "close": round(close, 2),
            "volume": max(volume, 1000000)
        })

df = pd.DataFrame(all_data)
df["date"] = pd.to_datetime(df["date"])

print("주식 가격 데이터셋 생성 완료!")
print(f"Shape: {df.shape}")
`,
}

// 샘플 작업
export const sampleOperations: SampleOperation[] = [
  // Selection
  {
    id: 'sel-1',
    title: '기본 선택',
    description: '컬럼 선택과 행 슬라이싱',
    category: 'selection',
    difficulty: 'beginner',
    code: `# 단일 컬럼 선택
print("=== 단일 컬럼 ===")
print(df["product"].head())

# 여러 컬럼 선택
print("\\n=== 여러 컬럼 ===")
print(df[["customer_id", "product", "total_amount"]].head())

# 행 슬라이싱
print("\\n=== 처음 5행 ===")
print(df.head())

# loc: 라벨 기반 선택
print("\\n=== loc 선택 ===")
print(df.loc[0:2, ["order_id", "product", "total_amount"]])

# iloc: 인덱스 기반 선택
print("\\n=== iloc 선택 ===")
print(df.iloc[0:3, 0:4])`,
  },
  {
    id: 'sel-2',
    title: '조건부 선택',
    description: 'Boolean indexing으로 데이터 필터링',
    category: 'selection',
    difficulty: 'beginner',
    code: `# 단일 조건
print("=== 100만원 이상 주문 ===")
high_value = df[df["total_amount"] >= 1000000]
print(f"건수: {len(high_value)}")
print(high_value.head())

# 복합 조건 (AND)
print("\\n=== 서울 Gold 고객 ===")
seoul_gold = df[(df["city"] == "서울") & (df["tier"] == "Gold")]
print(f"건수: {len(seoul_gold)}")
print(seoul_gold.head())

# 복합 조건 (OR)
print("\\n=== 노트북 또는 스마트폰 ===")
devices = df[(df["product"] == "노트북") | (df["product"] == "스마트폰")]
print(f"건수: {len(devices)}")

# isin 사용
print("\\n=== isin 사용 ===")
major_cities = df[df["city"].isin(["서울", "부산", "대구"])]
print(f"주요 도시 주문: {len(major_cities)}건")`,
  },

  // Filtering
  {
    id: 'fil-1',
    title: 'query 메서드',
    description: 'SQL 스타일 쿼리로 필터링',
    category: 'filtering',
    difficulty: 'intermediate',
    code: `# query 메서드 사용
print("=== query 메서드 ===")

# 단순 조건
result1 = df.query("total_amount > 500000")
print(f"50만원 초과: {len(result1)}건")

# 문자열 조건 (백틱 사용)
result2 = df.query("city == '서울'")
print(f"서울: {len(result2)}건")

# 복합 조건
result3 = df.query("tier == 'Platinum' and quantity >= 3")
print(f"Platinum & 3개 이상: {len(result3)}건")

# 변수 참조 (@)
min_amount = 1000000
result4 = df.query("total_amount >= @min_amount")
print(f"100만원 이상: {len(result4)}건")

# 리스트 포함 여부
target_products = ["노트북", "태블릿"]
result5 = df.query("product in @target_products")
print(f"노트북/태블릿: {len(result5)}건")`,
  },
  {
    id: 'fil-2',
    title: '결측치 처리',
    description: 'NaN 값 탐지 및 처리',
    category: 'filtering',
    difficulty: 'beginner',
    code: `# 결측치 확인
print("=== 결측치 현황 ===")
print(df.isnull().sum())

# 결측치 비율
print("\\n=== 결측치 비율 ===")
missing_pct = (df.isnull().sum() / len(df) * 100).round(2)
print(missing_pct[missing_pct > 0])

# 결측치 있는 행 선택
print("\\n=== age 결측 행 (일부) ===")
missing_age = df[df["age"].isnull()]
print(f"건수: {len(missing_age)}")
print(missing_age.head())

# 결측치 제거
print("\\n=== 결측치 제거 후 ===")
df_clean = df.dropna()
print(f"원본: {len(df)}행 → 제거 후: {len(df_clean)}행")

# 결측치 대체
print("\\n=== 결측치 대체 ===")
df_filled = df.copy()
df_filled["age"] = df_filled["age"].fillna(df_filled["age"].median())
df_filled["city"] = df_filled["city"].fillna("Unknown")
print(f"결측치: {df_filled.isnull().sum().sum()}개")`,
  },

  // GroupBy
  {
    id: 'grp-1',
    title: '기본 그룹 집계',
    description: 'groupby로 그룹별 통계 계산',
    category: 'groupby',
    difficulty: 'beginner',
    code: `# 단일 컬럼 그룹화
print("=== 도시별 매출 ===")
city_sales = df.groupby("city")["total_amount"].sum().sort_values(ascending=False)
print(city_sales)

# 여러 집계 함수
print("\\n=== 상품별 통계 ===")
product_stats = df.groupby("product").agg({
    "total_amount": ["sum", "mean", "count"],
    "quantity": "sum"
}).round(0)
print(product_stats)

# 여러 컬럼 그룹화
print("\\n=== 도시-등급별 평균 주문액 ===")
city_tier = df.groupby(["city", "tier"])["total_amount"].mean().round(0)
print(city_tier.head(10))`,
  },
  {
    id: 'grp-2',
    title: '고급 그룹 연산',
    description: 'transform, apply, agg 활용',
    category: 'groupby',
    difficulty: 'advanced',
    code: `# transform: 그룹별 연산 결과를 원본 크기로 반환
print("=== transform: 그룹 평균 대비 비율 ===")
df_t = df.copy()
df_t["city_avg"] = df_t.groupby("city")["total_amount"].transform("mean")
df_t["vs_city_avg"] = (df_t["total_amount"] / df_t["city_avg"] * 100).round(1)
print(df_t[["city", "total_amount", "city_avg", "vs_city_avg"]].head())

# apply: 커스텀 함수 적용
print("\\n=== apply: 상위 3개 주문 ===")
def top_orders(group):
    return group.nlargest(3, "total_amount")

top3_by_city = df.groupby("city").apply(top_orders)[["city", "product", "total_amount"]]
print(top3_by_city.head(9))

# named aggregation
print("\\n=== Named Aggregation ===")
summary = df.groupby("tier").agg(
    total_sales=("total_amount", "sum"),
    avg_order=("total_amount", "mean"),
    order_count=("order_id", "count"),
    unique_customers=("customer_id", "nunique")
).round(0)
print(summary)`,
  },

  // Transform
  {
    id: 'trn-1',
    title: '컬럼 변환',
    description: '새 컬럼 생성 및 값 변환',
    category: 'transform',
    difficulty: 'beginner',
    code: `# 새 컬럼 생성
df_t = df.copy()

# 단가 계산
df_t["unit_price_k"] = df_t["unit_price"] / 1000  # 천원 단위

# 날짜 분해
df_t["year"] = df_t["order_date"].dt.year
df_t["month"] = df_t["order_date"].dt.month
df_t["day_of_week"] = df_t["order_date"].dt.day_name()

print("=== 새 컬럼 생성 ===")
print(df_t[["order_date", "year", "month", "day_of_week", "unit_price_k"]].head())

# 조건부 컬럼 (np.where)
df_t["order_size"] = np.where(df_t["total_amount"] >= 500000, "Large", "Small")
print("\\n=== 주문 크기 분포 ===")
print(df_t["order_size"].value_counts())

# 다중 조건 (np.select)
conditions = [
    df_t["total_amount"] >= 1000000,
    df_t["total_amount"] >= 500000,
    df_t["total_amount"] >= 100000,
]
choices = ["VIP", "High", "Medium"]
df_t["order_grade"] = np.select(conditions, choices, default="Low")
print("\\n=== 주문 등급 분포 ===")
print(df_t["order_grade"].value_counts())`,
  },
  {
    id: 'trn-2',
    title: 'apply & map',
    description: '함수 적용과 값 매핑',
    category: 'transform',
    difficulty: 'intermediate',
    code: `df_t = df.copy()

# map: 값 매핑
tier_points = {"Bronze": 1, "Silver": 2, "Gold": 3, "Platinum": 4}
df_t["tier_points"] = df_t["tier"].map(tier_points)
print("=== map: 등급 포인트 ===")
print(df_t[["tier", "tier_points"]].drop_duplicates())

# apply: 행/컬럼별 함수 적용
def categorize_age(age):
    if pd.isna(age):
        return "Unknown"
    elif age < 30:
        return "Young"
    elif age < 50:
        return "Middle"
    else:
        return "Senior"

df_t["age_group"] = df_t["age"].apply(categorize_age)
print("\\n=== apply: 연령대 분포 ===")
print(df_t["age_group"].value_counts())

# lambda 함수
df_t["product_short"] = df_t["product"].apply(lambda x: x[:3] + "...")
print("\\n=== lambda: 상품명 축약 ===")
print(df_t[["product", "product_short"]].drop_duplicates())

# 행 전체에 apply
def order_summary(row):
    return f"{row['customer_id']}: {row['product']} x {row['quantity']}"

df_t["summary"] = df_t.apply(order_summary, axis=1)
print("\\n=== 행 apply: 주문 요약 ===")
print(df_t["summary"].head())`,
  },

  // Pivot
  {
    id: 'pvt-1',
    title: 'Pivot Table',
    description: '피벗 테이블 생성',
    category: 'pivot',
    difficulty: 'intermediate',
    code: `# 기본 피벗 테이블
print("=== 도시-상품 매출 피벗 ===")
pivot1 = df.pivot_table(
    values="total_amount",
    index="city",
    columns="product",
    aggfunc="sum",
    fill_value=0
)
print(pivot1.iloc[:5, :5])  # 일부만 출력

# 다중 집계
print("\\n=== 등급별 통계 피벗 ===")
pivot2 = df.pivot_table(
    values="total_amount",
    index="tier",
    aggfunc=["sum", "mean", "count"]
).round(0)
print(pivot2)

# margins로 합계 추가
print("\\n=== 성별-등급 피벗 (합계 포함) ===")
pivot3 = df.pivot_table(
    values="total_amount",
    index="gender",
    columns="tier",
    aggfunc="sum",
    margins=True,
    margins_name="Total"
).round(0)
print(pivot3)`,
  },
  {
    id: 'pvt-2',
    title: 'Stack & Unstack',
    description: '데이터 재구조화',
    category: 'pivot',
    difficulty: 'advanced',
    code: `# 멀티인덱스 생성
print("=== 멀티인덱스 그룹 ===")
multi = df.groupby(["city", "tier"])["total_amount"].sum()
print(multi.head(10))

# unstack: 인덱스를 컬럼으로
print("\\n=== unstack: 등급을 컬럼으로 ===")
unstacked = multi.unstack(fill_value=0)
print(unstacked.head())

# stack: 컬럼을 인덱스로
print("\\n=== stack: 다시 인덱스로 ===")
stacked = unstacked.stack()
print(stacked.head(10))

# melt: wide to long
print("\\n=== melt: Wide → Long ===")
wide_df = df.pivot_table(
    values="total_amount",
    index="customer_id",
    columns="product",
    aggfunc="sum",
    fill_value=0
).head(5)
print("Wide format:")
print(wide_df.iloc[:, :3])

melted = wide_df.reset_index().melt(
    id_vars=["customer_id"],
    var_name="product",
    value_name="total"
)
print("\\nLong format:")
print(melted[melted["total"] > 0].head(10))`,
  },

  // Visualization
  {
    id: 'viz-1',
    title: '기본 통계 시각화',
    description: '히스토그램, 막대 차트 (텍스트)',
    category: 'visualization',
    difficulty: 'beginner',
    code: `# 분포 통계
print("=== 주문금액 분포 ===")
print(df["total_amount"].describe())

# 간단한 텍스트 히스토그램
def text_histogram(series, bins=10, width=40):
    counts, edges = np.histogram(series.dropna(), bins=bins)
    max_count = max(counts)
    for i, count in enumerate(counts):
        bar_len = int(count / max_count * width)
        label = f"{edges[i]/1000000:.1f}M-{edges[i+1]/1000000:.1f}M"
        print(f"{label:12} | {'█' * bar_len} ({count})")

print("\\n=== 주문금액 히스토그램 ===")
text_histogram(df["total_amount"], bins=8)

# 카테고리별 집계 시각화
print("\\n=== 도시별 주문 수 ===")
city_counts = df["city"].value_counts()
max_count = city_counts.max()
for city, count in city_counts.items():
    bar_len = int(count / max_count * 30)
    print(f"{city:6} | {'█' * bar_len} ({count})")`,
  },
  {
    id: 'viz-2',
    title: '시계열 분석',
    description: '날짜별 트렌드 분석',
    category: 'visualization',
    difficulty: 'intermediate',
    code: `# 월별 매출 트렌드
print("=== 월별 매출 ===")
df_t = df.copy()
df_t["month"] = df_t["order_date"].dt.to_period("M")
monthly = df_t.groupby("month")["total_amount"].agg(["sum", "count", "mean"])
monthly.columns = ["총매출", "주문수", "평균주문액"]
print(monthly.round(0))

# 요일별 패턴
print("\\n=== 요일별 주문 현황 ===")
df_t["weekday"] = df_t["order_date"].dt.day_name()
weekday_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
weekday_stats = df_t.groupby("weekday")["total_amount"].agg(["count", "sum", "mean"])
weekday_stats = weekday_stats.reindex(weekday_order)

for day in weekday_order:
    if day in weekday_stats.index:
        row = weekday_stats.loc[day]
        bar_len = int(row["count"] / weekday_stats["count"].max() * 20)
        print(f"{day[:3]:3} | {'█' * bar_len} 주문:{row['count']:.0f} 매출:{row['sum']/1000000:.1f}M")

# 이동 평균
print("\\n=== 7일 이동평균 (일별 매출) ===")
daily = df_t.groupby(df_t["order_date"].dt.date)["total_amount"].sum()
daily_ma = daily.rolling(7).mean()
print(pd.DataFrame({"일별매출": daily, "7일MA": daily_ma}).tail(10).round(0))`,
  },
]

// 카테고리 정보
export const categories = [
  { id: 'all', name: '전체', icon: '📚' },
  { id: 'selection', name: '선택', icon: '👆' },
  { id: 'filtering', name: '필터링', icon: '🔍' },
  { id: 'groupby', name: 'GroupBy', icon: '📊' },
  { id: 'transform', name: '변환', icon: '🔄' },
  { id: 'pivot', name: '피벗', icon: '🔀' },
  { id: 'visualization', name: '시각화', icon: '📈' },
]
