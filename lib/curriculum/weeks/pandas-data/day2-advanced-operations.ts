// Day 2: 고급 pandas 연산
import type { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'multiindex-video',
    type: 'video',
    title: 'MultiIndex 완전 정복',
    duration: 15,
    content: {
      objectives: [
        'MultiIndex의 개념과 용도를 이해한다',
        'set_index, reset_index를 활용한다',
        'MultiIndex에서 데이터를 선택하는 방법을 익힌다'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=tcRGa2soc-c',
      transcript: `
## MultiIndex란?

**MultiIndex**는 DataFrame에 여러 레벨의 인덱스를 설정하는 기능입니다. 계층적 데이터를 효과적으로 표현하고 분석할 수 있습니다.

### 왜 MultiIndex를 사용하나?

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  MultiIndex 사용 시나리오                                    │
├─────────────────────────────────────────────────────────────┤
│  1. 시계열 + 지역: (날짜, 지역)별 매출                       │
│  2. 카테고리 계층: (대분류, 중분류, 소분류)                  │
│  3. 그룹별 분석: (부서, 직급)별 급여 분석                    │
│  4. 다차원 데이터: 피벗 테이블의 결과                        │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 생성 방법

\`\`\`python
# 방법 1: set_index로 생성
df.set_index(['region', 'date'], inplace=True)

# 방법 2: 직접 생성
index = pd.MultiIndex.from_tuples([
    ('Asia', '2024-01'), ('Asia', '2024-02'),
    ('Europe', '2024-01'), ('Europe', '2024-02')
])
df = pd.DataFrame({'sales': [100, 150, 200, 180]}, index=index)

# 방법 3: from_product
regions = ['Asia', 'Europe']
months = ['2024-01', '2024-02']
index = pd.MultiIndex.from_product([regions, months])
\`\`\`

### 데이터 선택

\`\`\`python
# .loc으로 선택
df.loc['Asia']  # 첫 번째 레벨
df.loc[('Asia', '2024-01')]  # 특정 조합
df.loc['Asia':'Europe']  # 슬라이싱

# xs()로 크로스 섹션 선택
df.xs('2024-01', level='date')  # 모든 지역의 2024-01
\`\`\`

### 핵심 메시지

> "MultiIndex는 **계층적 데이터**를 다루는 핵심 도구다. 시계열 + 카테고리 분석에 필수."
      `,
      keyPoints: [
        'MultiIndex = 다중 레벨 인덱스',
        'set_index()로 생성, reset_index()로 해제',
        '.loc[tuple]로 특정 조합 선택',
        'xs()로 특정 레벨 값 선택'
      ]
    }
  },
  {
    id: 'multiindex-code',
    type: 'code',
    title: 'MultiIndex 실습',
    duration: 20,
    content: {
      objectives: [
        'MultiIndex DataFrame을 생성하고 조작한다',
        '다양한 방법으로 데이터를 선택한다',
        '레벨별 집계를 수행한다'
      ],
      instructions: `
MultiIndex를 활용하여 지역별, 월별 매출 데이터를 분석합니다.

## 요구사항
1. (region, month) MultiIndex 생성
2. 특정 지역, 특정 월 데이터 선택
3. 지역별, 월별 집계 수행
      `,
      starterCode: `
import pandas as pd
import numpy as np

# 샘플 데이터 생성
np.random.seed(42)
regions = ['Asia', 'Europe', 'America']
months = ['2024-01', '2024-02', '2024-03']
products = ['A', 'B', 'C']

data = []
for region in regions:
    for month in months:
        for product in products:
            data.append({
                'region': region,
                'month': month,
                'product': product,
                'sales': np.random.randint(100, 1000),
                'quantity': np.random.randint(10, 100)
            })

df = pd.DataFrame(data)
print("원본 데이터:")
print(df.head(10))

# TODO: MultiIndex 설정
# df_multi = ...

# TODO: Asia 지역 데이터만 선택
# asia_data = ...

# TODO: 2024-01 데이터만 선택 (모든 지역)
# jan_data = ...

# TODO: 지역별 총 매출 계산
# region_sales = ...

# TODO: 지역별, 월별 총 매출 계산
# region_month_sales = ...
      `,
      solutionCode: `
import pandas as pd
import numpy as np

# 샘플 데이터 생성
np.random.seed(42)
regions = ['Asia', 'Europe', 'America']
months = ['2024-01', '2024-02', '2024-03']
products = ['A', 'B', 'C']

data = []
for region in regions:
    for month in months:
        for product in products:
            data.append({
                'region': region,
                'month': month,
                'product': product,
                'sales': np.random.randint(100, 1000),
                'quantity': np.random.randint(10, 100)
            })

df = pd.DataFrame(data)
print("원본 데이터:")
print(df.head(10))

# MultiIndex 설정
df_multi = df.set_index(['region', 'month', 'product'])
print("\\n=== MultiIndex DataFrame ===")
print(df_multi.head(10))

# Asia 지역 데이터만 선택
asia_data = df_multi.loc['Asia']
print("\\n=== Asia 지역 데이터 ===")
print(asia_data)

# 2024-01 데이터만 선택 (모든 지역) - xs() 사용
jan_data = df_multi.xs('2024-01', level='month')
print("\\n=== 2024-01 데이터 (모든 지역) ===")
print(jan_data)

# 지역별 총 매출 계산
region_sales = df_multi.groupby(level='region')['sales'].sum()
print("\\n=== 지역별 총 매출 ===")
print(region_sales)

# 지역별, 월별 총 매출 계산
region_month_sales = df_multi.groupby(level=['region', 'month'])['sales'].sum()
print("\\n=== 지역별, 월별 총 매출 ===")
print(region_month_sales)

# 보너스: unstack으로 피벗 형태로 변환
print("\\n=== 피벗 형태 (지역 × 월) ===")
print(region_month_sales.unstack())
      `,
      keyPoints: [
        'set_index([col1, col2])로 MultiIndex 생성',
        '.loc[value]로 첫 번째 레벨 선택',
        '.xs(value, level=name)로 특정 레벨 값 선택',
        'groupby(level=name)으로 레벨별 집계'
      ]
    }
  },
  {
    id: 'pivot-melt-video',
    type: 'video',
    title: 'Pivot & Melt: 데이터 형태 변환',
    duration: 15,
    content: {
      objectives: [
        'Wide vs Long 포맷의 차이를 이해한다',
        'pivot()과 melt()의 역할을 파악한다',
        '상황에 맞는 데이터 형태를 선택한다'
      ],
      transcript: `
## Wide vs Long 포맷

데이터는 **Wide(넓은)** 형태와 **Long(긴)** 형태로 표현할 수 있습니다.

### 형태 비교

\`\`\`
Wide 포맷 (분석/시각화에 적합):
┌─────────┬─────────┬─────────┬─────────┐
│  date   │ product_A│ product_B│ product_C│
├─────────┼─────────┼─────────┼─────────┤
│ 2024-01 │   100   │   200   │   150   │
│ 2024-02 │   120   │   180   │   160   │
└─────────┴─────────┴─────────┴─────────┘

Long 포맷 (저장/처리에 적합):
┌─────────┬─────────┬───────┐
│  date   │ product │ sales │
├─────────┼─────────┼───────┤
│ 2024-01 │    A    │  100  │
│ 2024-01 │    B    │  200  │
│ 2024-01 │    C    │  150  │
│ 2024-02 │    A    │  120  │
│ 2024-02 │    B    │  180  │
│ 2024-02 │    C    │  160  │
└─────────┴─────────┴───────┘
\`\`\`

### pivot(): Long → Wide

\`\`\`python
# Long → Wide
wide = df.pivot(
    index='date',      # 행 인덱스
    columns='product', # 열 헤더
    values='sales'     # 값
)
\`\`\`

### melt(): Wide → Long

\`\`\`python
# Wide → Long
long = wide.melt(
    ignore_index=False,  # 인덱스 유지
    var_name='product',  # 컬럼명 → 변수
    value_name='sales'   # 값 컬럼명
)
\`\`\`

### 언제 어떤 포맷을 사용?

| 포맷 | 장점 | 사용 시점 |
|------|------|----------|
| Wide | 한눈에 비교 가능 | 분석, 시각화 |
| Long | 유연한 쿼리 | 저장, 필터링, groupby |

### 핵심 메시지

> "데이터베이스는 Long, 분석/시각화는 Wide. **pivot()과 melt()**는 이 둘을 왔다갔다하는 도구다."
      `,
      keyPoints: [
        'Wide: 컬럼이 많고 행이 적음 (분석용)',
        'Long: 행이 많고 컬럼이 적음 (저장용)',
        'pivot(): Long → Wide',
        'melt(): Wide → Long'
      ]
    }
  },
  {
    id: 'pivot-melt-code',
    type: 'code',
    title: 'Pivot & Melt 실습',
    duration: 20,
    content: {
      objectives: [
        'pivot()으로 Long 데이터를 Wide로 변환한다',
        'melt()로 Wide 데이터를 Long으로 변환한다',
        'pivot_table()로 집계와 피벗을 동시에 수행한다'
      ],
      instructions: `
매출 데이터를 pivot과 melt를 사용하여 다양한 형태로 변환합니다.

## 요구사항
1. Long 포맷 → Wide 포맷 변환 (pivot)
2. Wide 포맷 → Long 포맷 변환 (melt)
3. 집계를 포함한 피벗 테이블 생성 (pivot_table)
      `,
      starterCode: `
import pandas as pd
import numpy as np

# 샘플 데이터 (Long 포맷)
np.random.seed(42)
dates = pd.date_range('2024-01-01', periods=12, freq='M')
products = ['A', 'B', 'C']

data = []
for date in dates:
    for product in products:
        data.append({
            'date': date.strftime('%Y-%m'),
            'product': product,
            'sales': np.random.randint(100, 500),
            'quantity': np.random.randint(10, 50)
        })

df_long = pd.DataFrame(data)
print("=== Long 포맷 (원본) ===")
print(df_long.head(9))

# TODO: pivot()으로 Wide 포맷 변환
# - 행: date
# - 열: product
# - 값: sales
# df_wide = ...

# TODO: melt()로 다시 Long 포맷 변환
# df_back_to_long = ...

# TODO: pivot_table()로 제품별, 분기별 평균 매출
# - 분기 계산 필요
# df_quarterly = ...
      `,
      solutionCode: `
import pandas as pd
import numpy as np

# 샘플 데이터 (Long 포맷)
np.random.seed(42)
dates = pd.date_range('2024-01-01', periods=12, freq='M')
products = ['A', 'B', 'C']

data = []
for date in dates:
    for product in products:
        data.append({
            'date': date.strftime('%Y-%m'),
            'product': product,
            'sales': np.random.randint(100, 500),
            'quantity': np.random.randint(10, 50)
        })

df_long = pd.DataFrame(data)
print("=== Long 포맷 (원본) ===")
print(df_long.head(9))

# pivot()으로 Wide 포맷 변환
df_wide = df_long.pivot(
    index='date',
    columns='product',
    values='sales'
)
print("\\n=== Wide 포맷 (pivot) ===")
print(df_wide)

# melt()로 다시 Long 포맷 변환
df_back_to_long = df_wide.melt(
    ignore_index=False,
    var_name='product',
    value_name='sales'
).reset_index()
print("\\n=== Long 포맷 (melt) ===")
print(df_back_to_long.head(9))

# 분기 컬럼 추가
df_long['quarter'] = pd.to_datetime(df_long['date']).dt.quarter
df_long['quarter'] = 'Q' + df_long['quarter'].astype(str)

# pivot_table()로 제품별, 분기별 평균 매출
df_quarterly = pd.pivot_table(
    df_long,
    values='sales',
    index='quarter',
    columns='product',
    aggfunc='mean'
).round(1)
print("\\n=== 분기별 평균 매출 (pivot_table) ===")
print(df_quarterly)

# 보너스: 여러 집계 함수 사용
df_multi_agg = pd.pivot_table(
    df_long,
    values='sales',
    index='quarter',
    columns='product',
    aggfunc=['mean', 'sum', 'count']
)
print("\\n=== 여러 집계 함수 ===")
print(df_multi_agg)
      `,
      keyPoints: [
        'pivot(index, columns, values)로 Long → Wide',
        'melt(var_name, value_name)로 Wide → Long',
        'pivot_table()은 집계 기능 포함',
        'aggfunc으로 다양한 집계 가능'
      ]
    }
  },
  {
    id: 'merge-join-video',
    type: 'video',
    title: 'Merge & Join: 데이터 결합',
    duration: 15,
    content: {
      objectives: [
        'merge()의 다양한 how 옵션을 이해한다',
        'left, right, inner, outer join의 차이를 파악한다',
        'validate 옵션으로 데이터 무결성을 검증한다'
      ],
      transcript: `
## 데이터 결합의 종류

pandas에서 두 DataFrame을 결합하는 방법은 **merge()**입니다.

### Join 유형

\`\`\`
┌────────────────────────────────────────────────────────────┐
│  A        B                                                │
│  ┌───┐    ┌───┐                                            │
│  │ 1 │    │ 2 │                                            │
│  │ 2 │    │ 3 │                                            │
│  │ 3 │    │ 4 │                                            │
│  └───┘    └───┘                                            │
├────────────────────────────────────────────────────────────┤
│  inner: {2, 3}     - 교집합                                │
│  left:  {1, 2, 3}  - A 기준 (B에 없으면 NaN)               │
│  right: {2, 3, 4}  - B 기준 (A에 없으면 NaN)               │
│  outer: {1, 2, 3, 4} - 합집합 (없으면 NaN)                 │
└────────────────────────────────────────────────────────────┘
\`\`\`

### 기본 문법

\`\`\`python
# 기본 inner join
result = df1.merge(df2, on='key')

# left join
result = df1.merge(df2, on='key', how='left')

# 컬럼명이 다를 때
result = df1.merge(df2, left_on='id', right_on='user_id')

# 여러 컬럼으로 join
result = df1.merge(df2, on=['region', 'date'])
\`\`\`

### validate 옵션 (중요!)

\`\`\`python
# 1:1 관계 검증
result = df1.merge(df2, on='id', validate='one_to_one')

# N:1 관계 검증 (df1이 N, df2가 1)
result = orders.merge(customers, on='customer_id', validate='many_to_one')

# 1:N 관계 검증
result = customers.merge(orders, on='customer_id', validate='one_to_many')
\`\`\`

### indicator 옵션

\`\`\`python
# join 결과 출처 표시
result = df1.merge(df2, on='key', how='outer', indicator=True)
# _merge 컬럼: 'left_only', 'right_only', 'both'
\`\`\`

### 핵심 메시지

> "**validate**는 실무에서 필수다. 의도치 않은 행 수 폭증을 막아준다."
      `,
      keyPoints: [
        'inner: 교집합, outer: 합집합',
        'left/right: 한쪽 기준 유지',
        'validate로 관계 검증 필수',
        'indicator로 결합 출처 확인'
      ]
    }
  },
  {
    id: 'merge-join-code',
    type: 'code',
    title: 'Merge & Join 실습',
    duration: 20,
    content: {
      objectives: [
        '다양한 join 유형을 실습한다',
        'validate로 데이터 무결성을 검증한다',
        'indicator로 결합 결과를 분석한다'
      ],
      instructions: `
주문(orders)과 고객(customers) 데이터를 다양한 방법으로 결합합니다.

## 요구사항
1. inner join으로 주문과 고객 정보 결합
2. left join으로 모든 주문에 고객 정보 추가
3. validate로 관계 검증
4. indicator로 결합 결과 분석
      `,
      starterCode: `
import pandas as pd

# 주문 데이터
orders = pd.DataFrame({
    'order_id': [1, 2, 3, 4, 5],
    'customer_id': [101, 102, 101, 103, 999],  # 999는 없는 고객
    'amount': [150, 200, 300, 120, 80]
})

# 고객 데이터
customers = pd.DataFrame({
    'customer_id': [101, 102, 103, 104],  # 104는 주문 없음
    'name': ['Alice', 'Bob', 'Charlie', 'Diana'],
    'tier': ['Gold', 'Silver', 'Gold', 'Bronze']
})

print("=== 주문 데이터 ===")
print(orders)
print("\\n=== 고객 데이터 ===")
print(customers)

# TODO: inner join
# inner_result = ...

# TODO: left join
# left_result = ...

# TODO: outer join with indicator
# outer_result = ...

# TODO: validate='many_to_one' 사용
# validated_result = ...
      `,
      solutionCode: `
import pandas as pd

# 주문 데이터
orders = pd.DataFrame({
    'order_id': [1, 2, 3, 4, 5],
    'customer_id': [101, 102, 101, 103, 999],  # 999는 없는 고객
    'amount': [150, 200, 300, 120, 80]
})

# 고객 데이터
customers = pd.DataFrame({
    'customer_id': [101, 102, 103, 104],  # 104는 주문 없음
    'name': ['Alice', 'Bob', 'Charlie', 'Diana'],
    'tier': ['Gold', 'Silver', 'Gold', 'Bronze']
})

print("=== 주문 데이터 ===")
print(orders)
print("\\n=== 고객 데이터 ===")
print(customers)

# inner join: 매칭되는 것만
inner_result = orders.merge(customers, on='customer_id', how='inner')
print("\\n=== Inner Join (교집합) ===")
print(inner_result)
print(f"행 수: {len(inner_result)} (999, 104 제외)")

# left join: 모든 주문 유지
left_result = orders.merge(customers, on='customer_id', how='left')
print("\\n=== Left Join (주문 기준) ===")
print(left_result)
print(f"행 수: {len(left_result)} (999 고객 정보는 NaN)")

# outer join with indicator
outer_result = orders.merge(
    customers,
    on='customer_id',
    how='outer',
    indicator=True
)
print("\\n=== Outer Join (합집합) ===")
print(outer_result)

# indicator 분석
print("\\n=== 결합 결과 분석 ===")
print(outer_result['_merge'].value_counts())

# validate='many_to_one' 사용
# orders의 customer_id는 중복 가능 (many)
# customers의 customer_id는 유일해야 함 (one)
validated_result = orders.merge(
    customers,
    on='customer_id',
    how='left',
    validate='many_to_one'  # 에러 발생 시 관계 이상
)
print("\\n=== Validate 통과 ===")
print(validated_result)

# 보너스: 주문 없는 고객 찾기
no_orders = outer_result[outer_result['_merge'] == 'right_only']
print("\\n=== 주문 없는 고객 ===")
print(no_orders[['customer_id', 'name']])
      `,
      keyPoints: [
        'inner: 양쪽 모두 있는 것만',
        'left: 왼쪽 기준, 없으면 NaN',
        'validate로 관계 검증 (에러 방지)',
        'indicator로 결합 출처 파악'
      ]
    }
  },
  {
    id: 'groupby-agg-video',
    type: 'video',
    title: 'GroupBy & 고급 집계',
    duration: 15,
    content: {
      objectives: [
        'groupby의 동작 원리를 이해한다',
        'agg()로 다양한 집계를 수행한다',
        'transform()과 apply()의 차이를 파악한다'
      ],
      transcript: `
## GroupBy의 동작 원리

**Split-Apply-Combine** 패턴입니다.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  Split → Apply → Combine                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  원본 데이터        Split         Apply        Combine      │
│  ┌───────────┐    ┌───────┐    ┌───────┐    ┌───────────┐  │
│  │ A  100    │    │ A 100 │    │       │    │ A  250    │  │
│  │ B  200    │ → │ A 150 │ → │  sum  │ → │ B  200    │  │
│  │ A  150    │    ├───────┤    │       │    └───────────┘  │
│  │ C  300    │    │ B 200 │    └───────┘                   │
│  └───────────┘    ├───────┤                                 │
│                   │ C 300 │                                 │
│                   └───────┘                                 │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### agg()로 다중 집계

\`\`\`python
# 단일 집계
df.groupby('category')['sales'].sum()

# 다중 집계 (리스트)
df.groupby('category')['sales'].agg(['sum', 'mean', 'count'])

# 컬럼별 다른 집계 (딕셔너리)
df.groupby('category').agg({
    'sales': 'sum',
    'quantity': 'mean',
    'order_id': 'count'
})

# Named aggregation (권장)
df.groupby('category').agg(
    total_sales=('sales', 'sum'),
    avg_quantity=('quantity', 'mean'),
    order_count=('order_id', 'count')
)
\`\`\`

### transform() vs apply()

| 메서드 | 반환 크기 | 용도 |
|--------|----------|------|
| agg() | 그룹당 1행 | 집계 결과 |
| transform() | 원본과 동일 | 그룹별 변환 (브로드캐스트) |
| apply() | 유연함 | 복잡한 처리 |

\`\`\`python
# transform: 그룹 평균으로 정규화
df['sales_normalized'] = df.groupby('category')['sales'].transform(
    lambda x: (x - x.mean()) / x.std()
)

# apply: 그룹 내 Top 3
df.groupby('category').apply(lambda x: x.nlargest(3, 'sales'))
\`\`\`

### 핵심 메시지

> "groupby의 본질은 **Split-Apply-Combine**. agg는 집계, transform은 브로드캐스트, apply는 자유형."
      `,
      keyPoints: [
        'Split-Apply-Combine 패턴',
        'agg(): 그룹당 1행 반환',
        'transform(): 원본 크기 유지 (브로드캐스트)',
        'Named aggregation 권장'
      ]
    }
  },
  {
    id: 'groupby-agg-code',
    type: 'code',
    title: 'GroupBy & 집계 실습',
    duration: 20,
    content: {
      objectives: [
        'agg()로 다양한 집계를 수행한다',
        'transform()으로 그룹별 정규화를 구현한다',
        '복잡한 그룹별 분석을 수행한다'
      ],
      instructions: `
판매 데이터를 다양한 방법으로 그룹화하고 집계합니다.

## 요구사항
1. Named aggregation으로 카테고리별 통계 계산
2. transform()으로 그룹 내 비율 계산
3. 그룹별 Top 2 추출
      `,
      starterCode: `
import pandas as pd
import numpy as np

# 샘플 데이터
np.random.seed(42)
df = pd.DataFrame({
    'category': np.random.choice(['Electronics', 'Clothing', 'Food'], 20),
    'product': [f'P{i:02d}' for i in range(20)],
    'sales': np.random.randint(100, 1000, 20),
    'quantity': np.random.randint(1, 50, 20),
    'date': pd.date_range('2024-01-01', periods=20)
})

print("=== 원본 데이터 ===")
print(df.head(10))

# TODO: Named aggregation으로 카테고리별 통계
# - total_sales: 총 매출
# - avg_sales: 평균 매출
# - product_count: 상품 수
# - max_quantity: 최대 수량
# category_stats = ...

# TODO: transform()으로 그룹 내 매출 비율 계산
# df['sales_pct'] = ...

# TODO: 카테고리별 매출 Top 2 추출
# top2_per_category = ...
      `,
      solutionCode: `
import pandas as pd
import numpy as np

# 샘플 데이터
np.random.seed(42)
df = pd.DataFrame({
    'category': np.random.choice(['Electronics', 'Clothing', 'Food'], 20),
    'product': [f'P{i:02d}' for i in range(20)],
    'sales': np.random.randint(100, 1000, 20),
    'quantity': np.random.randint(1, 50, 20),
    'date': pd.date_range('2024-01-01', periods=20)
})

print("=== 원본 데이터 ===")
print(df.head(10))

# Named aggregation으로 카테고리별 통계
category_stats = df.groupby('category').agg(
    total_sales=('sales', 'sum'),
    avg_sales=('sales', 'mean'),
    product_count=('product', 'count'),
    max_quantity=('quantity', 'max')
).round(2)

print("\\n=== 카테고리별 통계 ===")
print(category_stats)

# transform()으로 그룹 내 매출 비율 계산
df['category_total'] = df.groupby('category')['sales'].transform('sum')
df['sales_pct'] = (df['sales'] / df['category_total'] * 100).round(2)

print("\\n=== 그룹 내 매출 비율 ===")
print(df[['category', 'product', 'sales', 'category_total', 'sales_pct']].head(10))

# 카테고리별 매출 Top 2 추출
top2_per_category = df.groupby('category').apply(
    lambda x: x.nlargest(2, 'sales'),
    include_groups=False
).reset_index(drop=True)

print("\\n=== 카테고리별 매출 Top 2 ===")
print(top2_per_category[['category', 'product', 'sales']])

# 보너스: 복잡한 집계 (커스텀 함수)
def sales_range(x):
    return x.max() - x.min()

complex_stats = df.groupby('category').agg(
    total=('sales', 'sum'),
    range=('sales', sales_range),
    cv=('sales', lambda x: x.std() / x.mean())  # 변동 계수
).round(2)

print("\\n=== 복잡한 집계 (커스텀 함수) ===")
print(complex_stats)
      `,
      keyPoints: [
        'Named aggregation으로 결과 컬럼명 지정',
        'transform으로 원본 크기 유지하며 브로드캐스트',
        'apply + nlargest로 그룹별 Top N',
        '커스텀 함수로 복잡한 집계 가능'
      ]
    }
  },
  {
    id: 'advanced-ops-quiz',
    type: 'quiz',
    title: '고급 pandas 연산 퀴즈',
    duration: 5,
    content: {
      objectives: [
        '고급 pandas 연산을 이해했는지 확인한다'
      ],
      questions: [
        {
          question: 'Long 포맷 데이터를 Wide 포맷으로 변환하는 함수는?',
          options: [
            'melt()',
            'pivot()',
            'stack()',
            'merge()'
          ],
          answer: 1,
          explanation: 'pivot()은 Long → Wide 변환, melt()는 Wide → Long 변환입니다.'
        },
        {
          question: 'merge()의 validate="many_to_one" 옵션의 역할은?',
          options: [
            '결과를 1행으로 제한',
            '왼쪽이 N, 오른쪽이 1인 관계를 검증',
            '중복 키를 자동 제거',
            '모든 행을 포함'
          ],
          answer: 1,
          explanation: 'validate는 join 관계를 검증합니다. many_to_one은 왼쪽(N)과 오른쪽(1) 관계를 확인합니다.'
        },
        {
          question: 'groupby().transform()의 특징은?',
          options: [
            '그룹당 1행만 반환',
            '원본과 동일한 크기의 결과 반환',
            '그룹을 제거하고 결과 반환',
            '새로운 DataFrame 생성'
          ],
          answer: 1,
          explanation: 'transform()은 원본과 동일한 크기로 결과를 브로드캐스트합니다. agg()는 그룹당 1행입니다.'
        }
      ],
      keyPoints: [
        'pivot = Long → Wide',
        'validate로 관계 검증',
        'transform은 원본 크기 유지'
      ]
    }
  },
  {
    id: 'advanced-ops-challenge',
    type: 'code',
    title: '🏆 Daily Challenge: 판매 분석 리포트',
    duration: 30,
    content: {
      objectives: [
        'pivot, merge, groupby를 조합하여 분석한다',
        '복잡한 비즈니스 질문에 답하는 쿼리를 작성한다',
        '결과를 보기 좋은 형태로 정리한다'
      ],
      instructions: `
## 🏆 Daily Challenge

주문 데이터를 분석하여 종합 리포트를 생성하세요.

### 요구사항
1. 카테고리별 월간 매출 피벗 테이블
2. 고객 등급별 평균 주문 금액
3. 전월 대비 매출 성장률
4. 카테고리별 매출 1위 상품
      `,
      starterCode: `
import pandas as pd
import numpy as np

# 샘플 데이터 생성
np.random.seed(42)

# 주문 데이터
orders = pd.DataFrame({
    'order_id': range(1, 201),
    'customer_id': np.random.choice(range(1, 51), 200),
    'product_id': np.random.choice(range(1, 21), 200),
    'amount': np.random.randint(50, 500, 200),
    'date': pd.date_range('2024-01-01', periods=200, freq='D')
})

# 상품 데이터
products = pd.DataFrame({
    'product_id': range(1, 21),
    'product_name': [f'Product_{i}' for i in range(1, 21)],
    'category': np.random.choice(['Electronics', 'Clothing', 'Food', 'Home'], 20)
})

# 고객 데이터
customers = pd.DataFrame({
    'customer_id': range(1, 51),
    'tier': np.random.choice(['Gold', 'Silver', 'Bronze'], 50)
})

print("=== 데이터 미리보기 ===")
print("Orders:", orders.shape)
print("Products:", products.shape)
print("Customers:", customers.shape)

# TODO: 데이터 결합
# merged = ...

# TODO 1: 카테고리별 월간 매출 피벗 테이블
# monthly_category = ...

# TODO 2: 고객 등급별 평균 주문 금액
# tier_avg = ...

# TODO 3: 전월 대비 매출 성장률
# growth = ...

# TODO 4: 카테고리별 매출 1위 상품
# top_products = ...
      `,
      solutionCode: `
import pandas as pd
import numpy as np

# 샘플 데이터 생성
np.random.seed(42)

orders = pd.DataFrame({
    'order_id': range(1, 201),
    'customer_id': np.random.choice(range(1, 51), 200),
    'product_id': np.random.choice(range(1, 21), 200),
    'amount': np.random.randint(50, 500, 200),
    'date': pd.date_range('2024-01-01', periods=200, freq='D')
})

products = pd.DataFrame({
    'product_id': range(1, 21),
    'product_name': [f'Product_{i}' for i in range(1, 21)],
    'category': np.random.choice(['Electronics', 'Clothing', 'Food', 'Home'], 20)
})

customers = pd.DataFrame({
    'customer_id': range(1, 51),
    'tier': np.random.choice(['Gold', 'Silver', 'Bronze'], 50)
})

# 데이터 결합
merged = orders.merge(
    products, on='product_id', validate='many_to_one'
).merge(
    customers, on='customer_id', validate='many_to_one'
)
merged['month'] = merged['date'].dt.to_period('M')

print("=== 결합된 데이터 ===")
print(merged.head())

# 1. 카테고리별 월간 매출 피벗 테이블
monthly_category = pd.pivot_table(
    merged,
    values='amount',
    index='month',
    columns='category',
    aggfunc='sum',
    fill_value=0
)
print("\\n=== 1. 카테고리별 월간 매출 ===")
print(monthly_category)

# 2. 고객 등급별 평균 주문 금액
tier_avg = merged.groupby('tier').agg(
    avg_amount=('amount', 'mean'),
    total_orders=('order_id', 'count'),
    total_amount=('amount', 'sum')
).round(2).sort_values('avg_amount', ascending=False)
print("\\n=== 2. 고객 등급별 분석 ===")
print(tier_avg)

# 3. 전월 대비 매출 성장률
monthly_sales = merged.groupby('month')['amount'].sum()
growth = monthly_sales.pct_change().mul(100).round(2)
growth.name = 'growth_rate_%'
print("\\n=== 3. 전월 대비 성장률 ===")
print(pd.DataFrame({'sales': monthly_sales, 'growth': growth}))

# 4. 카테고리별 매출 1위 상품
product_sales = merged.groupby(['category', 'product_name'])['amount'].sum()
top_products = product_sales.groupby('category').idxmax()
top_amounts = product_sales.groupby('category').max()

top_df = pd.DataFrame({
    'top_product': [p[1] for p in top_products],
    'total_sales': top_amounts
})
print("\\n=== 4. 카테고리별 매출 1위 상품 ===")
print(top_df)

print("\\n" + "="*50)
print("📊 분석 완료!")
print("="*50)
      `,
      keyPoints: [
        '여러 테이블 merge로 결합',
        'pivot_table로 다차원 분석',
        'pct_change()로 성장률 계산',
        'idxmax()로 최대값 인덱스 추출'
      ]
    }
  }
]
