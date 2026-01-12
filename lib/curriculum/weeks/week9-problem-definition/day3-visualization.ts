// Day 3: 데이터 시각화 기초
import type { Task } from '../../types'

export const day3Tasks: Task[] = [
  {
    id: 'p2w1d3t1',
    type: 'video',
    title: '효과적인 시각화 원칙',
    duration: 20,
    content: {
      objectives: [
        '데이터 유형에 따른 적절한 차트를 선택할 수 있다',
        '시각화의 핵심 원칙을 이해한다',
        '인사이트 전달을 위한 시각화 설계를 할 수 있다'
      ],
      videoUrl: '',
      transcript: `# 효과적인 시각화 원칙

## 차트 선택 가이드

| 목적 | 데이터 유형 | 추천 차트 |
|------|------------|----------|
| 분포 확인 | 수치형 1개 | 히스토그램, 박스플롯, 바이올린 |
| 비교 | 범주형 | 막대 그래프, 점 그래프 |
| 관계 분석 | 수치형 2개 | 산점도, 회귀선 |
| 추세 파악 | 시계열 | 라인 차트, 영역 차트 |
| 구성 비율 | 범주형 | 파이 차트(비추천), 스택 막대 |
| 상관관계 | 수치형 다수 | 히트맵, 페어플롯 |

## 시각화 핵심 원칙

### 1. 데이터-잉크 비율 (Data-Ink Ratio)
\`\`\`
Edward Tufte의 원칙:
"불필요한 잉크를 제거하라"

❌ 나쁜 예: 3D 차트, 그림자, 과도한 그리드
✅ 좋은 예: 깔끔한 2D, 필요한 요소만
\`\`\`

### 2. 제목과 라벨 명확히
\`\`\`python
# 나쁜 예
plt.title('Data')
plt.xlabel('x')
plt.ylabel('y')

# 좋은 예
plt.title('월별 매출 추이 (2024년)')
plt.xlabel('월')
plt.ylabel('매출 (억원)')
\`\`\`

### 3. 색상 전략
\`\`\`
# 순차적 데이터: 단일 색상 그라데이션
# 발산적 데이터: 중심에서 양방향 색상
# 범주형 데이터: 구분되는 색상
\`\`\`

## 잘못된 시각화 예시

### 1. 파이 차트 (대부분의 경우)
\`\`\`
❌ 파이 차트 문제:
- 각도 비교가 어려움
- 5개 이상 범주 시 복잡
- 시간 변화 표현 불가

✅ 대안: 막대 그래프
\`\`\`

### 2. 잘린 Y축
\`\`\`
❌ Y축을 0에서 시작하지 않으면:
- 차이가 과장됨
- 오해 유발

✅ 0에서 시작하거나, 명확히 표시
\`\`\`

### 3. 이중 Y축
\`\`\`
❌ 이중 축 문제:
- 스케일 조작으로 관계 왜곡 가능
- 혼란 야기

✅ 대안: 별도 차트 또는 정규화
\`\`\`

## 핵심 메시지

> "좋은 시각화는 데이터가 스스로 말하게 합니다."
`,
      keyPoints: [
        '목적에 맞는 차트 유형 선택이 중요',
        '불필요한 요소 제거 (Data-Ink Ratio)',
        '명확한 제목, 축 라벨, 범례 필수',
        '파이 차트와 이중 Y축은 주의해서 사용'
      ]
    }
  },
  {
    id: 'p2w1d3t2',
    type: 'video',
    title: 'Matplotlib & Seaborn 기초',
    duration: 25,
    content: {
      objectives: [
        'Matplotlib으로 기본 차트를 생성할 수 있다',
        'Seaborn으로 통계적 시각화를 할 수 있다',
        '서브플롯을 활용하여 여러 차트를 배치할 수 있다'
      ],
      videoUrl: '',
      transcript: `# Matplotlib & Seaborn 기초

## Matplotlib 기본 구조

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Figure와 Axes 이해
fig, ax = plt.subplots(figsize=(10, 6))

# 데이터 플로팅
x = np.linspace(0, 10, 100)
ax.plot(x, np.sin(x), label='sin(x)')
ax.plot(x, np.cos(x), label='cos(x)')

# 꾸미기
ax.set_title('삼각함수', fontsize=14)
ax.set_xlabel('x')
ax.set_ylabel('y')
ax.legend()
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()
\`\`\`

## 서브플롯 (여러 차트 배치)

\`\`\`python
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 왼쪽 위
axes[0, 0].hist(data, bins=30)
axes[0, 0].set_title('히스토그램')

# 오른쪽 위
axes[0, 1].scatter(x, y)
axes[0, 1].set_title('산점도')

# 왼쪽 아래
axes[1, 0].bar(categories, values)
axes[1, 0].set_title('막대 그래프')

# 오른쪽 아래
axes[1, 1].plot(dates, sales)
axes[1, 1].set_title('라인 차트')

plt.tight_layout()
\`\`\`

## Seaborn 통계 시각화

\`\`\`python
import seaborn as sns

# 스타일 설정
sns.set_style('whitegrid')
sns.set_palette('husl')

# 분포 시각화
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# 히스토그램 + KDE
sns.histplot(df['value'], kde=True, ax=axes[0])

# 박스플롯
sns.boxplot(x='category', y='value', data=df, ax=axes[1])

# 바이올린 플롯
sns.violinplot(x='category', y='value', data=df, ax=axes[2])
\`\`\`

## Seaborn 관계 시각화

\`\`\`python
# 산점도 + 회귀선
sns.regplot(x='feature', y='target', data=df)

# 카테고리별 산점도
sns.scatterplot(x='x', y='y', hue='category',
                style='category', size='value', data=df)

# 페어플롯 (모든 조합)
sns.pairplot(df[numerical_cols], hue='category')

# 히트맵
plt.figure(figsize=(10, 8))
sns.heatmap(df.corr(), annot=True, cmap='RdBu_r', center=0)
\`\`\`

## 범주형 시각화

\`\`\`python
# 카운트 플롯
sns.countplot(x='category', data=df)

# 막대 플롯 (평균값)
sns.barplot(x='category', y='value', data=df, estimator=np.mean)

# 그룹별 박스플롯
sns.boxplot(x='category', y='value', hue='group', data=df)
\`\`\`

## 핵심 메시지

> "Matplotlib은 자유도가 높고, Seaborn은 통계적 시각화에 최적화되어 있습니다."
`,
      keyPoints: [
        'Matplotlib: fig, ax 구조 이해가 핵심',
        'Seaborn: 통계적 시각화에 특화 (histplot, boxplot, heatmap)',
        'subplots()로 여러 차트를 깔끔하게 배치',
        'tight_layout()으로 겹침 방지'
      ]
    }
  },
  {
    id: 'p2w1d3t3',
    type: 'video',
    title: 'Plotly 인터랙티브 시각화',
    duration: 20,
    content: {
      objectives: [
        'Plotly Express로 빠르게 인터랙티브 차트를 생성할 수 있다',
        '호버 정보를 커스터마이징할 수 있다',
        '대시보드용 시각화를 준비할 수 있다'
      ],
      videoUrl: '',
      transcript: `# Plotly 인터랙티브 시각화

## Plotly Express 기초

\`\`\`python
import plotly.express as px

# 산점도
fig = px.scatter(df, x='feature1', y='target',
                 color='category',
                 size='value',
                 hover_data=['id', 'date'],
                 title='Feature vs Target')
fig.show()
\`\`\`

## 다양한 차트 유형

\`\`\`python
# 라인 차트
fig = px.line(df, x='date', y='value', color='category',
              title='Time Series by Category')

# 막대 그래프
fig = px.bar(df, x='category', y='value', color='group',
             barmode='group',  # 'stack', 'group', 'overlay'
             title='Category Comparison')

# 히스토그램
fig = px.histogram(df, x='value', nbins=30, color='category',
                   marginal='box',  # 'rug', 'box', 'violin'
                   title='Distribution')

# 박스플롯
fig = px.box(df, x='category', y='value', color='group',
             points='all',  # 모든 포인트 표시
             title='Box Plot')
\`\`\`

## 호버 커스터마이징

\`\`\`python
fig = px.scatter(df, x='x', y='y',
                 hover_name='name',  # 제목
                 hover_data={
                     'x': ':.2f',     # 소수점 2자리
                     'y': ':.2f',
                     'category': True,
                     'hidden_col': False  # 숨기기
                 })

# 호버 템플릿 직접 지정
fig.update_traces(
    hovertemplate='<b>%{hovertext}</b><br>' +
                  'X: %{x:.2f}<br>' +
                  'Y: %{y:.2f}<br>' +
                  '<extra></extra>'  # 추가 정보 제거
)
\`\`\`

## 레이아웃 커스터마이징

\`\`\`python
fig.update_layout(
    title={
        'text': '차트 제목',
        'x': 0.5,
        'xanchor': 'center'
    },
    xaxis_title='X축 제목',
    yaxis_title='Y축 제목',
    legend_title='범례',
    template='plotly_white',  # 테마
    width=800,
    height=600
)
\`\`\`

## 서브플롯

\`\`\`python
from plotly.subplots import make_subplots
import plotly.graph_objects as go

fig = make_subplots(rows=2, cols=2,
                    subplot_titles=['Plot 1', 'Plot 2', 'Plot 3', 'Plot 4'])

fig.add_trace(go.Scatter(x=x, y=y1, name='Line 1'), row=1, col=1)
fig.add_trace(go.Bar(x=categories, y=values), row=1, col=2)
fig.add_trace(go.Histogram(x=data), row=2, col=1)
fig.add_trace(go.Box(y=data), row=2, col=2)

fig.update_layout(height=800, title='Dashboard')
\`\`\`

## HTML 저장 (공유용)

\`\`\`python
# HTML 파일로 저장 (인터랙티브 유지)
fig.write_html('chart.html')

# 이미지로 저장
fig.write_image('chart.png', scale=2)
\`\`\`

## 핵심 메시지

> "Plotly는 탐색적 분석과 공유에 최적화된 인터랙티브 시각화 도구입니다."
`,
      keyPoints: [
        'Plotly Express: 한 줄로 인터랙티브 차트 생성',
        'hover_data로 마우스 오버 시 추가 정보 표시',
        'template으로 일관된 스타일 적용',
        'write_html()로 인터랙티브 차트 공유'
      ]
    }
  },
  {
    id: 'p2w1d3t4',
    type: 'code',
    title: '실습: EDA 시각화 대시보드',
    duration: 50,
    content: {
      objectives: [
        '데이터셋에 대한 종합적인 시각화를 생성한다',
        '분포, 관계, 트렌드를 시각적으로 분석한다',
        '인사이트를 효과적으로 전달하는 차트를 만든다'
      ],
      instructions: `# EDA 시각화 대시보드 실습

이 실습에서는 데이터셋에 대한 종합적인 EDA 시각화 대시보드를 생성합니다.

## 목표
1. 분포 시각화 (히스토그램, 박스플롯)
2. 관계 시각화 (산점도, 상관관계 히트맵)
3. 범주별 비교
4. 인터랙티브 차트 (Plotly)
`,
      starterCode: `"""
EDA 시각화 대시보드 실습
"""
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
from plotly.subplots import make_subplots
import plotly.graph_objects as go

# 샘플 데이터 생성
np.random.seed(42)
n = 500

df = pd.DataFrame({
    'customer_id': range(1, n+1),
    'age': np.random.normal(35, 10, n).astype(int),
    'income': np.random.lognormal(11, 0.5, n),
    'spending_score': np.random.normal(50, 15, n),
    'tenure_months': np.random.exponential(24, n),
    'category': np.random.choice(['A', 'B', 'C', 'D'], n, p=[0.3, 0.35, 0.25, 0.1]),
    'region': np.random.choice(['서울', '경기', '부산', '기타'], n, p=[0.4, 0.3, 0.15, 0.15]),
    'churned': np.random.choice([0, 1], n, p=[0.85, 0.15])
})

# 이상치 추가
df.loc[df.sample(10).index, 'income'] *= 5

print(f"데이터셋 크기: {df.shape}")
print(df.head())

# ============================================================
# Part 1: 분포 시각화 (Matplotlib/Seaborn)
# ============================================================

def create_distribution_plots(df):
    """수치형 변수의 분포를 시각화합니다."""
    numerical_cols = ['age', 'income', 'spending_score', 'tenure_months']

    fig, axes = plt.subplots(2, 4, figsize=(16, 8))

    for i, col in enumerate(numerical_cols):
        # TODO: 첫 번째 행에 히스토그램 + KDE
        # axes[0, i]에 플로팅

        # TODO: 두 번째 행에 박스플롯
        # axes[1, i]에 플로팅
        pass

    plt.suptitle('수치형 변수 분포 분석', fontsize=14)
    plt.tight_layout()
    plt.savefig('distribution_plots.png', dpi=100)
    print("저장: distribution_plots.png")

# TODO: create_distribution_plots 호출


# ============================================================
# Part 2: 범주별 비교
# ============================================================

def create_categorical_plots(df):
    """범주형 변수와 수치형 변수의 관계를 시각화합니다."""
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))

    # TODO: 카테고리별 income 박스플롯 (axes[0, 0])

    # TODO: 지역별 고객 수 카운트플롯 (axes[0, 1])

    # TODO: 카테고리별 이탈률 막대그래프 (axes[1, 0])

    # TODO: 지역별 평균 spending_score (axes[1, 1])

    plt.suptitle('범주별 분석', fontsize=14)
    plt.tight_layout()
    plt.savefig('categorical_plots.png', dpi=100)
    print("저장: categorical_plots.png")

# TODO: create_categorical_plots 호출


# ============================================================
# Part 3: 상관관계 분석
# ============================================================

def create_correlation_heatmap(df):
    """상관관계 히트맵을 생성합니다."""
    numerical_cols = ['age', 'income', 'spending_score', 'tenure_months', 'churned']

    # TODO: 상관관계 행렬 계산

    # TODO: 히트맵 시각화

    plt.savefig('correlation_heatmap.png', dpi=100)
    print("저장: correlation_heatmap.png")

# TODO: create_correlation_heatmap 호출


# ============================================================
# Part 4: 산점도 행렬 (Pair Plot)
# ============================================================

def create_pairplot(df):
    """산점도 행렬을 생성합니다."""
    numerical_cols = ['age', 'income', 'spending_score']

    # TODO: seaborn pairplot 생성 (churned로 색상 구분)

    plt.savefig('pairplot.png', dpi=100)
    print("저장: pairplot.png")

# TODO: create_pairplot 호출


# ============================================================
# Part 5: Plotly 인터랙티브 차트
# ============================================================

def create_interactive_dashboard(df):
    """Plotly로 인터랙티브 대시보드를 생성합니다."""

    # TODO: 산점도 (income vs spending_score, category로 색상, churned로 기호)
    fig1 = None

    # TODO: 카테고리별 income 박스플롯
    fig2 = None

    # TODO: 지역별 고객 수 막대그래프
    fig3 = None

    # TODO: 각 figure를 HTML로 저장

    print("인터랙티브 차트 저장 완료")

# TODO: create_interactive_dashboard 호출


# ============================================================
# Part 6: 인사이트 요약
# ============================================================

def summarize_insights():
    """시각화를 통해 발견한 인사이트를 요약합니다."""
    print("\\n" + "=" * 60)
    print("📊 EDA 시각화 인사이트 요약")
    print("=" * 60)

    # TODO: 시각화에서 발견한 인사이트 3-5개 작성
    insights = [
        # "1. income 분포는 오른쪽으로 치우쳐 있어 로그 변환이 필요할 수 있음",
        # "2. 카테고리 D의 이탈률이 가장 높음 (XX%)",
        # ...
    ]

    for insight in insights:
        print(f"  • {insight}")

    print("\\n✅ 분석 완료!")

summarize_insights()
`,
      solutionCode: `"""
EDA 시각화 대시보드 실습 - 솔루션
"""
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
from plotly.subplots import make_subplots
import plotly.graph_objects as go
from scipy.stats import skew

# 한글 폰트 설정 (필요시)
plt.rcParams['font.family'] = 'AppleGothic'
plt.rcParams['axes.unicode_minus'] = False

# 샘플 데이터 생성
np.random.seed(42)
n = 500

df = pd.DataFrame({
    'customer_id': range(1, n+1),
    'age': np.random.normal(35, 10, n).astype(int),
    'income': np.random.lognormal(11, 0.5, n),
    'spending_score': np.random.normal(50, 15, n),
    'tenure_months': np.random.exponential(24, n),
    'category': np.random.choice(['A', 'B', 'C', 'D'], n, p=[0.3, 0.35, 0.25, 0.1]),
    'region': np.random.choice(['Seoul', 'Gyeonggi', 'Busan', 'Others'], n, p=[0.4, 0.3, 0.15, 0.15]),
    'churned': np.random.choice([0, 1], n, p=[0.85, 0.15])
})

df.loc[df.sample(10).index, 'income'] *= 5

print(f"Dataset size: {df.shape}")
print(df.head())


# ============================================================
# Part 1: 분포 시각화
# ============================================================

def create_distribution_plots(df):
    """수치형 변수의 분포를 시각화합니다."""
    numerical_cols = ['age', 'income', 'spending_score', 'tenure_months']

    fig, axes = plt.subplots(2, 4, figsize=(16, 8))

    for i, col in enumerate(numerical_cols):
        # 히스토그램 + KDE
        sns.histplot(df[col], kde=True, ax=axes[0, i])
        axes[0, i].set_title(f'{col}\\n(Skew: {skew(df[col]):.2f})')
        axes[0, i].axvline(df[col].mean(), color='r', linestyle='--', label='Mean')
        axes[0, i].axvline(df[col].median(), color='g', linestyle='--', label='Median')

        # 박스플롯
        sns.boxplot(x=df[col], ax=axes[1, i])
        axes[1, i].set_xlabel(col)

    axes[0, 0].legend()
    plt.suptitle('Numerical Variable Distribution Analysis', fontsize=14, y=1.02)
    plt.tight_layout()
    plt.savefig('distribution_plots.png', dpi=100, bbox_inches='tight')
    print("Saved: distribution_plots.png")

create_distribution_plots(df)


# ============================================================
# Part 2: 범주별 비교
# ============================================================

def create_categorical_plots(df):
    """범주형 변수와 수치형 변수의 관계를 시각화합니다."""
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))

    # 카테고리별 income 박스플롯
    sns.boxplot(x='category', y='income', data=df, ax=axes[0, 0])
    axes[0, 0].set_title('Income by Category')
    axes[0, 0].set_ylabel('Income')

    # 지역별 고객 수
    sns.countplot(x='region', data=df, ax=axes[0, 1], order=df['region'].value_counts().index)
    axes[0, 1].set_title('Customer Count by Region')
    axes[0, 1].set_ylabel('Count')

    # 카테고리별 이탈률
    churn_rate = df.groupby('category')['churned'].mean() * 100
    axes[1, 0].bar(churn_rate.index, churn_rate.values, color=['green', 'green', 'orange', 'red'])
    axes[1, 0].set_title('Churn Rate by Category')
    axes[1, 0].set_ylabel('Churn Rate (%)')
    axes[1, 0].axhline(df['churned'].mean() * 100, color='red', linestyle='--', label='Overall')

    # 지역별 평균 spending_score
    mean_score = df.groupby('region')['spending_score'].mean().sort_values(ascending=False)
    axes[1, 1].barh(mean_score.index, mean_score.values)
    axes[1, 1].set_title('Average Spending Score by Region')
    axes[1, 1].set_xlabel('Spending Score')

    plt.suptitle('Categorical Analysis', fontsize=14, y=1.02)
    plt.tight_layout()
    plt.savefig('categorical_plots.png', dpi=100, bbox_inches='tight')
    print("Saved: categorical_plots.png")

create_categorical_plots(df)


# ============================================================
# Part 3: 상관관계 분석
# ============================================================

def create_correlation_heatmap(df):
    """상관관계 히트맵을 생성합니다."""
    numerical_cols = ['age', 'income', 'spending_score', 'tenure_months', 'churned']
    corr_matrix = df[numerical_cols].corr()

    plt.figure(figsize=(8, 6))
    sns.heatmap(corr_matrix, annot=True, cmap='RdBu_r', center=0,
                vmin=-1, vmax=1, square=True,
                fmt='.2f', linewidths=0.5)
    plt.title('Correlation Heatmap')
    plt.tight_layout()
    plt.savefig('correlation_heatmap.png', dpi=100)
    print("Saved: correlation_heatmap.png")

    # 주요 상관관계 출력
    print("\\nStrong Correlations (|r| > 0.3):")
    for i in range(len(numerical_cols)):
        for j in range(i+1, len(numerical_cols)):
            r = corr_matrix.iloc[i, j]
            if abs(r) > 0.3:
                print(f"  {numerical_cols[i]} <-> {numerical_cols[j]}: {r:.3f}")

create_correlation_heatmap(df)


# ============================================================
# Part 4: 산점도 행렬
# ============================================================

def create_pairplot(df):
    """산점도 행렬을 생성합니다."""
    numerical_cols = ['age', 'income', 'spending_score']

    g = sns.pairplot(df[numerical_cols + ['churned']],
                     hue='churned',
                     palette={0: 'blue', 1: 'red'},
                     diag_kind='kde',
                     plot_kws={'alpha': 0.5})
    g.fig.suptitle('Pair Plot (Colored by Churn)', y=1.02)
    plt.savefig('pairplot.png', dpi=100, bbox_inches='tight')
    print("Saved: pairplot.png")

create_pairplot(df)


# ============================================================
# Part 5: Plotly 인터랙티브 차트
# ============================================================

def create_interactive_dashboard(df):
    """Plotly로 인터랙티브 대시보드를 생성합니다."""

    # 산점도
    fig1 = px.scatter(df, x='income', y='spending_score',
                      color='category',
                      symbol='churned',
                      size='tenure_months',
                      hover_data=['customer_id', 'age', 'region'],
                      title='Income vs Spending Score by Category')
    fig1.update_layout(template='plotly_white')
    fig1.write_html('scatter_interactive.html')

    # 박스플롯
    fig2 = px.box(df, x='category', y='income',
                  color='category',
                  points='outliers',
                  title='Income Distribution by Category')
    fig2.update_layout(template='plotly_white')
    fig2.write_html('boxplot_interactive.html')

    # 막대그래프
    region_counts = df['region'].value_counts().reset_index()
    region_counts.columns = ['region', 'count']
    fig3 = px.bar(region_counts, x='region', y='count',
                  color='region',
                  title='Customer Count by Region')
    fig3.update_layout(template='plotly_white')
    fig3.write_html('barplot_interactive.html')

    print("Saved: scatter_interactive.html, boxplot_interactive.html, barplot_interactive.html")

create_interactive_dashboard(df)


# ============================================================
# Part 6: 인사이트 요약
# ============================================================

def summarize_insights():
    """시각화를 통해 발견한 인사이트를 요약합니다."""
    print("\\n" + "=" * 60)
    print("EDA Visualization Insights Summary")
    print("=" * 60)

    # 인사이트 계산
    income_skew = skew(df['income'])
    churn_by_cat = df.groupby('category')['churned'].mean() * 100
    worst_cat = churn_by_cat.idxmax()
    worst_rate = churn_by_cat.max()

    insights = [
        f"1. Income distribution is right-skewed (skew={income_skew:.2f}), log transformation recommended",
        f"2. Category '{worst_cat}' has the highest churn rate ({worst_rate:.1f}%)",
        f"3. {len(df[df['income'] > df['income'].quantile(0.99)])} income outliers detected (>99th percentile)",
        f"4. Seoul has the most customers ({df['region'].value_counts()['Seoul']/len(df)*100:.1f}%)",
        f"5. tenure_months shows exponential distribution, indicating many new customers"
    ]

    for insight in insights:
        print(f"  {insight}")

    print("\\nAnalysis Complete!")

summarize_insights()
`,
      hints: [
        'seaborn의 histplot, boxplot, countplot 등을 활용하세요',
        '상관관계 히트맵에서 annot=True로 숫자를 표시하세요',
        'Plotly는 fig.write_html()로 인터랙티브 차트를 저장할 수 있습니다',
        'plt.tight_layout()으로 차트 간 겹침을 방지하세요'
      ]
    }
  },
  {
    id: 'p2w1d3t5',
    type: 'quiz',
    title: 'Day 3 퀴즈: 시각화',
    duration: 10,
    content: {
      questions: [
        {
          question: '시계열 데이터의 추세를 보여주기에 가장 적합한 차트는?',
          options: [
            '파이 차트',
            '라인 차트',
            '히스토그램',
            '박스플롯'
          ],
          answer: 1,
          explanation: '라인 차트는 시간에 따른 연속적인 변화(추세)를 보여주는 데 가장 적합합니다.'
        },
        {
          question: 'Edward Tufte의 "Data-Ink Ratio" 원칙의 핵심은?',
          options: [
            '더 많은 색상을 사용하라',
            '3D 차트를 활용하라',
            '불필요한 시각적 요소를 제거하라',
            '항상 파이 차트를 사용하라'
          ],
          answer: 2,
          explanation: 'Data-Ink Ratio 원칙은 데이터를 표현하는 데 필요하지 않은 잉크(시각적 요소)를 최소화하라는 것입니다.'
        },
        {
          question: '범주형 변수 5개 이상의 비율을 비교할 때 가장 적합한 차트는?',
          options: [
            '파이 차트',
            '막대 그래프',
            '라인 차트',
            '산점도'
          ],
          answer: 1,
          explanation: '파이 차트는 5개 이상의 범주에서 각도 비교가 어렵습니다. 막대 그래프가 더 정확한 비교를 가능하게 합니다.'
        },
        {
          question: 'Seaborn의 heatmap에서 center=0의 의미는?',
          options: [
            '데이터를 정규화한다',
            '0을 기준으로 색상을 양방향으로 나눈다',
            '0보다 작은 값을 제거한다',
            '히트맵을 화면 중앙에 배치한다'
          ],
          answer: 1,
          explanation: 'center=0은 0을 기준으로 양의 값과 음의 값에 다른 색상(예: 빨강/파랑)을 적용합니다.'
        },
        {
          question: 'Plotly의 가장 큰 장점은?',
          options: [
            '가장 빠른 렌더링 속도',
            '인터랙티브 기능 (줌, 호버, 필터)',
            '가장 많은 차트 유형',
            'Python 없이 사용 가능'
          ],
          answer: 1,
          explanation: 'Plotly의 핵심 장점은 인터랙티브 기능입니다. 사용자가 차트와 상호작용하며 데이터를 탐색할 수 있습니다.'
        }
      ]
    }
  }
]
