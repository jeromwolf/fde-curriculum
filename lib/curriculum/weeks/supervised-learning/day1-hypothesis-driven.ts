// Week 13 Day 1: 가설 기반 분석
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'p2w5d1t1',
    type: 'video',
    title: '가설 기반 분석 프로세스',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 가설 기반 분석 (Hypothesis-Driven Analysis)

## 모델링 전에 "왜"를 명확히

모델을 만들기 전에 반드시 물어야 할 질문:
- "왜 이 모델을 만드는가?"
- "이 모델이 비즈니스에 어떤 가치를 주는가?"

## 가설 기반 분석 프로세스

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  가설 기반 분석 프로세스                      │
├─────────────────────────────────────────────────────────────┤
│  1. 문제 정의                                                │
│     "재구매율이 30% 하락한 이유는?"                          │
│              │                                               │
│              ▼                                               │
│  2. 가설 수립                                                │
│     H1: 배송 시간 증가 → 만족도 하락 → 재구매 감소          │
│     H2: 경쟁사 프로모션 → 고객 이탈                         │
│     H3: 제품 품질 하락 → 반품 증가 → 재구매 감소            │
│              │                                               │
│              ▼                                               │
│  3. 데이터 분석 (검증)                                       │
│     각 가설에 대한 증거 수집                                 │
│              │                                               │
│              ▼                                               │
│  4. 결론 도출                                                │
│     "H1 지지: 배송 시간 3일→5일, 재구매율 -25%p 상관"       │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 좋은 가설의 조건

\`\`\`python
# 좋은 가설 vs 나쁜 가설

# ✅ 좋은 가설
hypothesis_good = {
    'statement': "배송 3일 이상이면 재구매율 20% 하락",
    'specific': True,        # 구체적
    'measurable': True,      # 측정 가능 (데이터로 검증)
    'actionable': True       # 행동 가능 (배송 개선)
}

# ❌ 나쁜 가설
hypothesis_bad = {
    'statement': "고객이 불만족해서 그렇다",
    'specific': False,       # 너무 모호
    'measurable': False,     # 어떻게 측정?
    'actionable': False      # 어떤 행동?
}
\`\`\`

## 실전 예제: 고객 이탈 분석

\`\`\`python
# 1. 문제 정의
problem = "월간 고객 이탈률이 5%에서 8%로 증가"

# 2. 가설 수립
hypotheses = [
    {
        'id': 'H1',
        'statement': '가격 인상 후 이탈 증가',
        'data_needed': ['price_change_date', 'churn_date'],
        'metric': '가격 인상 전후 이탈률 비교'
    },
    {
        'id': 'H2',
        'statement': 'CS 응답 시간 증가로 불만 → 이탈',
        'data_needed': ['cs_response_time', 'churn_flag'],
        'metric': 'CS 응답 시간과 이탈률 상관관계'
    },
    {
        'id': 'H3',
        'statement': '경쟁사 프로모션 시기와 이탈 증가',
        'data_needed': ['competitor_promo_dates', 'churn_date'],
        'metric': '프로모션 기간 이탈률 비교'
    }
]

# 3. 검증 우선순위 (영향도 × 검증 용이성)
priority = ['H1', 'H2', 'H3']  # 데이터 가용성 기준
\`\`\`

## 가설 검증 프레임워크

\`\`\`python
def validate_hypothesis(df, hypothesis):
    """가설 검증 프레임워크"""
    results = {
        'hypothesis': hypothesis['statement'],
        'supported': None,
        'evidence': [],
        'confidence': 0
    }

    # 1. 기술 통계
    stats = df.groupby('segment').agg({
        'churn': 'mean',
        'satisfaction': 'mean'
    })

    # 2. 상관관계 분석
    correlation = df['delivery_days'].corr(df['churn'])

    # 3. 통계 검정
    from scipy.stats import ttest_ind
    group_a = df[df['delivery_days'] <= 3]['churn']
    group_b = df[df['delivery_days'] > 3]['churn']
    t_stat, p_value = ttest_ind(group_a, group_b)

    # 4. 결론
    if p_value < 0.05 and correlation > 0.3:
        results['supported'] = True
        results['confidence'] = 0.9

    return results
\`\`\`
`,
      objectives: [
        '가설 기반 분석의 중요성을 이해한다',
        '좋은 가설의 조건을 판단할 수 있다',
        '가설 검증 프로세스를 적용할 수 있다'
      ],
      keyPoints: [
        '모델링 전 "왜"를 명확히',
        '가설: 구체적, 측정 가능, 행동 가능',
        '데이터로 가설 검증',
        '결론은 비즈니스 행동으로 연결'
      ]
    }
  },
  {
    id: 'p2w5d1t2',
    type: 'video',
    title: '상관관계 vs 인과관계',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 상관관계 vs 인과관계

## 핵심 원칙

\`\`\`
상관관계 ≠ 인과관계
Correlation ≠ Causation
\`\`\`

## 유명한 예시

\`\`\`python
# 아이스크림 판매량과 익사 사고
# 상관계수: 0.95 (매우 강한 양의 상관)

# 하지만 인과관계?
# 아이스크림 → 익사? ❌

# 진짜 원인: 여름 (교란변수)
# 여름 → 수영 증가 → 익사 증가
# 여름 → 더위 → 아이스크림 소비 증가

confounding_variable = "여름/더운 날씨"
\`\`\`

## 인과관계 판단 기준

\`\`\`python
# Bradford Hill Criteria (간략화)

causation_criteria = {
    '1_temporality': '원인이 결과보다 먼저 발생',
    '2_strength': '강한 연관성 (상관관계)',
    '3_consistency': '여러 상황에서 반복',
    '4_plausibility': '생물학적/논리적 타당성',
    '5_experiment': '실험으로 검증 (Gold Standard)'
}

# 실전 체크리스트
def check_causation(data, cause, effect):
    checks = {
        'temporal': False,    # 시간적 선후관계
        'correlation': False, # 통계적 연관성
        'no_confound': False, # 교란변수 배제
        'experiment': False   # 실험적 검증
    }

    # 1. 시간적 선후관계
    if data[cause].first_valid_index() < data[effect].first_valid_index():
        checks['temporal'] = True

    # 2. 상관관계
    corr = data[cause].corr(data[effect])
    if abs(corr) > 0.3:
        checks['correlation'] = True

    # 3. 교란변수 (회귀 분석으로 통제)
    # ... 다변량 분석 필요

    return checks
\`\`\`

## 인과관계 검증 방법

\`\`\`python
# 1. A/B 테스트 (실험)
# Gold Standard - 무작위 배정으로 교란변수 통제

# 2. 회귀 분석 (통제)
import statsmodels.api as sm

# 교란변수 통제
X = df[['delivery_days', 'age', 'income', 'region']]  # 통제 변수 포함
y = df['churn']
X = sm.add_constant(X)
model = sm.OLS(y, X).fit()
print(model.summary())

# 3. 성향 점수 매칭 (Propensity Score Matching)
# 관찰 데이터에서 인과 추론

# 4. 도구 변수 (Instrumental Variable)
# 교란변수와 무관한 변수 활용
\`\`\`

## 실무에서의 주의사항

\`\`\`
❌ 흔한 실수:
"광고비와 매출의 상관관계가 0.8이므로
광고비를 늘리면 매출이 늘어날 것이다"

🤔 고려해야 할 점:
- 역인과: 매출 좋을 때 광고비 증가?
- 교란변수: 계절성, 프로모션, 경쟁사?
- 실험 필요: A/B 테스트로 검증

✅ 올바른 접근:
"광고비와 매출의 상관관계 0.8 관찰.
계절성 통제 후에도 유의미.
A/B 테스트에서 광고 그룹 매출 15% 증가.
→ 인과관계 지지됨"
\`\`\`
`,
      objectives: [
        '상관관계와 인과관계를 구분할 수 있다',
        '교란변수의 영향을 이해한다',
        '인과관계 검증 방법을 알 수 있다'
      ],
      keyPoints: [
        '상관관계 ≠ 인과관계',
        '교란변수 항상 고려',
        'A/B 테스트 = 인과관계 검증의 Gold Standard',
        '관찰 데이터에서는 회귀/PSM으로 통제'
      ]
    }
  },
  {
    id: 'p2w5d1t3',
    type: 'code',
    title: '실습: 가설 수립 및 검증',
    duration: 40,
    content: {
      instructions: `# 가설 기반 분석 실습

## 목표
고객 이탈 데이터를 사용하여 가설을 수립하고 검증하세요.

## 요구사항
1. 문제 정의: 이탈률 증가 원인 파악
2. 가설 3개 수립 (구체적, 측정 가능)
3. 각 가설에 대한 데이터 분석
4. 통계적 검증 (t-test, 상관관계)
5. 결론 및 비즈니스 액션 제안
`,
      starterCode: `import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns

# 샘플 데이터 생성
np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'customer_id': range(n),
    'tenure_months': np.random.randint(1, 60, n),
    'monthly_charges': np.random.normal(70, 20, n),
    'support_calls': np.random.poisson(2, n),
    'contract_type': np.random.choice(['Month-to-month', '1 year', '2 year'], n, p=[0.5, 0.3, 0.2]),
    'churn': np.random.binomial(1, 0.2, n)
})

# 이탈과 관련된 패턴 추가
df.loc[df['tenure_months'] < 12, 'churn'] = np.random.binomial(1, 0.35, sum(df['tenure_months'] < 12))
df.loc[df['support_calls'] > 4, 'churn'] = np.random.binomial(1, 0.4, sum(df['support_calls'] > 4))

print("=== 데이터 기본 정보 ===")
print(f"총 고객 수: {len(df)}")
print(f"전체 이탈률: {df['churn'].mean():.1%}")

# TODO: 가설 수립 및 검증
`,
      solutionCode: `import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns

np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'customer_id': range(n),
    'tenure_months': np.random.randint(1, 60, n),
    'monthly_charges': np.random.normal(70, 20, n),
    'support_calls': np.random.poisson(2, n),
    'contract_type': np.random.choice(['Month-to-month', '1 year', '2 year'], n, p=[0.5, 0.3, 0.2]),
    'churn': np.random.binomial(1, 0.2, n)
})

df.loc[df['tenure_months'] < 12, 'churn'] = np.random.binomial(1, 0.35, sum(df['tenure_months'] < 12))
df.loc[df['support_calls'] > 4, 'churn'] = np.random.binomial(1, 0.4, sum(df['support_calls'] > 4))

print("=== 1. 문제 정의 ===")
print(f"전체 이탈률: {df['churn'].mean():.1%}")
print("문제: 이탈률이 예상(15%)보다 높음. 원인 파악 필요")

print("\\n=== 2. 가설 수립 ===")
hypotheses = [
    {
        'id': 'H1',
        'statement': '신규 고객(12개월 미만)의 이탈률이 기존 고객보다 높다',
        'metric': '그룹별 이탈률 비교'
    },
    {
        'id': 'H2',
        'statement': '고객 지원 문의가 많을수록 이탈률이 높다',
        'metric': 'support_calls와 churn 상관관계'
    },
    {
        'id': 'H3',
        'statement': '월 단위 계약 고객이 장기 계약보다 이탈률이 높다',
        'metric': '계약 유형별 이탈률'
    }
]

for h in hypotheses:
    print(f"[{h['id']}] {h['statement']}")

print("\\n=== 3. 가설 검증 ===")

# H1 검증: 신규 vs 기존 고객
print("\\n--- H1: 신규 고객 이탈률 ---")
df['is_new'] = df['tenure_months'] < 12
new_churn = df[df['is_new']]['churn'].mean()
old_churn = df[~df['is_new']]['churn'].mean()
print(f"신규 고객 이탈률: {new_churn:.1%}")
print(f"기존 고객 이탈률: {old_churn:.1%}")

t_stat, p_value = stats.ttest_ind(
    df[df['is_new']]['churn'],
    df[~df['is_new']]['churn']
)
print(f"T-test p-value: {p_value:.4f}")
print(f"→ H1 {'지지됨' if p_value < 0.05 else '기각'} (p < 0.05)")

# H2 검증: 고객 지원 문의와 이탈
print("\\n--- H2: 고객 지원 문의와 이탈 ---")
correlation = df['support_calls'].corr(df['churn'])
print(f"상관계수: {correlation:.3f}")

high_support = df[df['support_calls'] > 4]['churn'].mean()
low_support = df[df['support_calls'] <= 4]['churn'].mean()
print(f"고문의(>4) 이탈률: {high_support:.1%}")
print(f"저문의(≤4) 이탈률: {low_support:.1%}")
print(f"→ H2 {'지지됨' if correlation > 0.1 else '기각'}")

# H3 검증: 계약 유형별 이탈률
print("\\n--- H3: 계약 유형별 이탈률 ---")
contract_churn = df.groupby('contract_type')['churn'].mean()
print(contract_churn)

from scipy.stats import chi2_contingency
contingency = pd.crosstab(df['contract_type'], df['churn'])
chi2, p_value, dof, expected = chi2_contingency(contingency)
print(f"Chi-squared p-value: {p_value:.4f}")
print(f"→ H3 {'지지됨' if p_value < 0.05 else '기각'}")

print("\\n=== 4. 결론 및 액션 ===")
print("""
검증 결과:
- H1 지지: 신규 고객 이탈률 35% vs 기존 20%
- H2 지지: 고문의 고객 이탈률 40% vs 일반 18%
- H3 지지: 월 계약 이탈률 > 연간 계약

비즈니스 액션:
1. 신규 고객 온보딩 프로그램 강화 (첫 90일 집중 케어)
2. 고객 지원 품질 개선 (응답 시간 단축, 해결률 향상)
3. 장기 계약 전환 인센티브 제공
""")
`,
      hints: [
        'scipy.stats.ttest_ind()로 두 그룹 비교',
        'df.corr()로 상관관계 확인',
        'chi2_contingency()로 범주형 변수 관계 검정',
        'p-value < 0.05면 통계적으로 유의미'
      ]
    }
  },
  {
    id: 'p2w5d1t4',
    type: 'quiz',
    title: 'Day 1 퀴즈: 가설 기반 분석',
    duration: 10,
    content: {
      questions: [
        {
          question: '좋은 가설의 조건이 아닌 것은?',
          options: ['구체적이다', '측정 가능하다', '행동 가능하다', '복잡하다'],
          answer: 3
        },
        {
          question: '상관관계가 0.9일 때 반드시 성립하는 것은?',
          options: ['인과관계가 있다', '두 변수가 함께 변한다', '원인과 결과가 명확하다', 'A/B 테스트가 필요없다'],
          answer: 1
        },
        {
          question: '인과관계 검증의 Gold Standard는?',
          options: ['상관관계 분석', '회귀 분석', 'A/B 테스트', '기술 통계'],
          answer: 2
        },
        {
          question: '교란변수(Confounding Variable)란?',
          options: ['종속 변수', '원인과 결과 모두에 영향을 주는 제3의 변수', '측정 오류', '이상치'],
          answer: 1
        }
      ]
    }
  }
]
