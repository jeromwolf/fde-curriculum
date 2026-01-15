// Phase 0, Week 6: 통계 기초
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'stats-day1',
  title: '기술 통계 기초',
  totalDuration: 90,
  tasks: [
    {
      id: 'stats-intro',
      type: 'reading',
      title: '통계의 기초 개념',
      duration: 30,
      content: {
        objectives: [
          '통계의 기본 개념을 이해한다',
          '모집단과 표본의 차이를 안다',
          '데이터 유형을 구분할 수 있다'
        ],
        markdown: `
## 통계란?

**통계(Statistics)**는 데이터를 수집, 정리, 분석하여 의미 있는 정보를 추출하는 학문입니다.

### 기술 통계 vs 추론 통계

| 구분 | 기술 통계 | 추론 통계 |
|------|----------|----------|
| 목적 | 데이터 요약/설명 | 전체 추정/예측 |
| 방법 | 평균, 분산, 그래프 | 가설검정, 신뢰구간 |
| 예시 | "평균 키는 170cm" | "전국 평균 키는 약 170cm일 것" |

## 모집단과 표본

### 모집단 (Population)
연구 대상이 되는 전체 집단

### 표본 (Sample)
모집단에서 추출한 일부 데이터

\`\`\`
예시: 한국 성인의 평균 키를 알고 싶을 때
- 모집단: 한국의 모든 성인 (약 4,000만 명)
- 표본: 설문 참여자 1,000명
\`\`\`

### 왜 표본을 사용하나?
- 모집단 전체 조사는 비용/시간 제약
- 표본으로 모집단 특성을 추정 가능

## 데이터 유형

### 범주형 데이터 (Categorical)

**명목형 (Nominal)**: 순서 없는 범주
\`\`\`
- 혈액형: A, B, O, AB
- 성별: 남, 여
- 직업: 개발자, 디자이너, 마케터
\`\`\`

**순서형 (Ordinal)**: 순서 있는 범주
\`\`\`
- 학력: 고졸 < 학사 < 석사 < 박사
- 만족도: 불만족 < 보통 < 만족
- 등급: Bronze < Silver < Gold
\`\`\`

### 수치형 데이터 (Numerical)

**이산형 (Discrete)**: 셀 수 있는 값
\`\`\`
- 자녀 수: 0, 1, 2, 3...
- 주문 횟수: 1, 5, 10...
- 오류 개수: 0, 1, 2...
\`\`\`

**연속형 (Continuous)**: 연속적인 값
\`\`\`
- 키: 165.5cm, 172.3cm...
- 온도: 23.5°C, 36.7°C...
- 시간: 2.5시간, 45.3분...
\`\`\`
`
      }
    },
    {
      id: 'central-tendency',
      type: 'reading',
      title: '중심 경향성: 평균, 중앙값, 최빈값',
      duration: 30,
      content: {
        objectives: [
          '평균, 중앙값, 최빈값을 계산할 수 있다',
          '각 지표의 특징과 사용 상황을 이해한다'
        ],
        markdown: `
## 중심 경향성 (Central Tendency)

데이터의 "대표값"을 나타내는 지표입니다.

## 평균 (Mean)

모든 값의 합을 개수로 나눈 값

\`\`\`python
데이터: [10, 20, 30, 40, 50]
평균 = (10 + 20 + 30 + 40 + 50) / 5 = 30
\`\`\`

### Python 계산
\`\`\`python
import numpy as np

data = [10, 20, 30, 40, 50]
mean = np.mean(data)  # 30.0

# 또는
mean = sum(data) / len(data)  # 30.0
\`\`\`

### 특징
- 모든 데이터를 반영
- **이상치(outlier)에 민감**

\`\`\`
예: [10, 20, 30, 40, 1000]
평균 = 220 (1000에 크게 영향 받음)
\`\`\`

## 중앙값 (Median)

데이터를 정렬했을 때 가운데 위치한 값

\`\`\`python
# 홀수 개
데이터: [10, 20, 30, 40, 50]
정렬: [10, 20, 30, 40, 50]
중앙값 = 30 (3번째 값)

# 짝수 개
데이터: [10, 20, 30, 40]
정렬: [10, 20, 30, 40]
중앙값 = (20 + 30) / 2 = 25
\`\`\`

### Python 계산
\`\`\`python
import numpy as np

data = [10, 20, 30, 40, 50]
median = np.median(data)  # 30.0
\`\`\`

### 특징
- **이상치에 강건(robust)**
- 순서 데이터에 적합

\`\`\`
예: [10, 20, 30, 40, 1000]
중앙값 = 30 (1000의 영향 없음)
\`\`\`

## 최빈값 (Mode)

가장 자주 나타나는 값

\`\`\`python
데이터: [1, 2, 2, 3, 3, 3, 4]
최빈값 = 3 (3번 출현)
\`\`\`

### Python 계산
\`\`\`python
from scipy import stats

data = [1, 2, 2, 3, 3, 3, 4]
mode = stats.mode(data, keepdims=True)
print(mode.mode[0])  # 3
\`\`\`

### 특징
- 범주형 데이터에 사용 가능
- 여러 개일 수 있음 (다봉분포)

## 언제 어떤 지표를 사용할까?

| 상황 | 추천 지표 |
|------|----------|
| 정규분포, 이상치 없음 | 평균 |
| 이상치 있음, 편향된 분포 | 중앙값 |
| 범주형 데이터 | 최빈값 |
| 소득, 집값 등 | 중앙값 |
`
      }
    },
    {
      id: 'stats-practice1',
      type: 'code',
      title: '실습: 중심 경향성 계산',
      duration: 30,
      content: {
        objectives: [
          'Python으로 평균, 중앙값, 최빈값을 계산한다',
          '이상치가 미치는 영향을 확인한다'
        ],
        markdown: `
## 실습: 중심 경향성 계산

### 기본 계산
\`\`\`python
import numpy as np
from scipy import stats

# 데이터
scores = [75, 82, 90, 88, 76, 95, 70, 85, 92, 78]

# 평균
mean = np.mean(scores)
print(f"평균: {mean:.2f}")  # 83.10

# 중앙값
median = np.median(scores)
print(f"중앙값: {median:.2f}")  # 83.50

# 최빈값 (이 경우 모두 1번씩 출현)
mode_result = stats.mode(scores, keepdims=True)
print(f"최빈값: {mode_result.mode[0]}")
\`\`\`

### 이상치의 영향

\`\`\`python
# 이상치 없는 데이터
normal_data = [30, 35, 32, 38, 31, 36, 34, 33, 37, 35]

# 이상치 있는 데이터
outlier_data = [30, 35, 32, 38, 31, 36, 34, 33, 37, 150]

print("이상치 없는 경우:")
print(f"  평균: {np.mean(normal_data):.2f}")    # 34.10
print(f"  중앙값: {np.median(normal_data):.2f}")  # 34.50

print("\\n이상치 있는 경우:")
print(f"  평균: {np.mean(outlier_data):.2f}")    # 45.60 (크게 증가!)
print(f"  중앙값: {np.median(outlier_data):.2f}")  # 34.50 (변화 없음)
\`\`\`

### 실전 예제: 직원 급여 분석

\`\`\`python
# 직원 급여 데이터 (만원)
salaries = [
    3500, 3800, 4000, 4200, 4500, 4800,
    5000, 5200, 5500, 12000  # CEO 급여
]

print("급여 통계:")
print(f"  평균 급여: {np.mean(salaries):,.0f}만원")
print(f"  중앙값 급여: {np.median(salaries):,.0f}만원")

# 결과:
# 평균 급여: 5,250만원 (CEO 급여에 영향)
# 중앙값 급여: 4,650만원 (더 현실적)
\`\`\`

### 연습 문제

1. 다음 데이터의 평균, 중앙값을 계산하세요:
   \`[22, 25, 27, 23, 28, 26, 24, 100]\`

2. 이상치(100)를 제거하면 평균이 어떻게 변하나요?

3. 온라인 쇼핑몰의 구매 금액 분석에서 평균보다 중앙값이 더 적합한 이유는?
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'stats-day2',
  title: '산포도와 분포',
  totalDuration: 90,
  tasks: [
    {
      id: 'dispersion',
      type: 'reading',
      title: '산포도: 범위, 분산, 표준편차',
      duration: 30,
      content: {
        objectives: [
          '산포도의 개념을 이해한다',
          '분산과 표준편차를 계산할 수 있다',
          '데이터의 퍼짐 정도를 해석한다'
        ],
        markdown: `
## 산포도 (Dispersion)

데이터가 얼마나 퍼져 있는지를 나타내는 지표입니다.

## 범위 (Range)

최대값 - 최소값

\`\`\`python
data = [10, 20, 30, 40, 50]
범위 = 50 - 10 = 40
\`\`\`

### Python 계산
\`\`\`python
data = [10, 20, 30, 40, 50]
range_val = max(data) - min(data)  # 40

# 또는
range_val = np.ptp(data)  # peak to peak
\`\`\`

### 특징
- 계산이 간단
- 이상치에 매우 민감

## 분산 (Variance)

각 데이터가 평균에서 얼마나 떨어져 있는지의 제곱 평균

\`\`\`
분산 = Σ(xi - 평균)² / n

예: [2, 4, 6, 8, 10]
평균 = 6

편차: [-4, -2, 0, 2, 4]
편차²: [16, 4, 0, 4, 16]
분산 = (16 + 4 + 0 + 4 + 16) / 5 = 8
\`\`\`

### Python 계산
\`\`\`python
import numpy as np

data = [2, 4, 6, 8, 10]

# 모분산 (n으로 나눔)
var_pop = np.var(data)  # 8.0

# 표본분산 (n-1로 나눔, 편향 보정)
var_sample = np.var(data, ddof=1)  # 10.0
\`\`\`

## 표준편차 (Standard Deviation)

분산의 제곱근 (원래 단위로 해석 가능)

\`\`\`python
import numpy as np

data = [2, 4, 6, 8, 10]

# 모표준편차
std_pop = np.std(data)  # 2.83

# 표본표준편차
std_sample = np.std(data, ddof=1)  # 3.16
\`\`\`

### 해석
- 표준편차가 작다 → 데이터가 평균 주위에 모여 있음
- 표준편차가 크다 → 데이터가 넓게 퍼져 있음

\`\`\`
데이터A: [48, 49, 50, 51, 52]  std ≈ 1.4
데이터B: [10, 30, 50, 70, 90]  std ≈ 28.3

두 데이터의 평균은 50으로 같지만,
B가 훨씬 더 퍼져 있음
\`\`\`

## 변동계수 (CV, Coefficient of Variation)

표준편차 / 평균 × 100%

다른 단위의 데이터 산포도를 비교할 때 사용

\`\`\`python
# 키 (cm)
height = [160, 170, 180, 175, 165]
cv_height = np.std(height) / np.mean(height) * 100  # 4.3%

# 몸무게 (kg)
weight = [50, 70, 80, 65, 55]
cv_weight = np.std(weight) / np.mean(weight) * 100  # 17.3%

# 결과: 몸무게가 더 큰 상대적 변동성을 보임
\`\`\`
`
      }
    },
    {
      id: 'distribution',
      type: 'reading',
      title: '정규분포와 분포 형태',
      duration: 30,
      content: {
        objectives: [
          '정규분포의 특징을 이해한다',
          '왜도와 첨도의 의미를 안다',
          '분포 형태를 해석할 수 있다'
        ],
        markdown: `
## 정규분포 (Normal Distribution)

"종 모양"의 대칭적인 분포로, 자연현상에서 자주 나타남

### 특징
- 평균 = 중앙값 = 최빈값
- 좌우 대칭
- 평균과 표준편차로 완전히 정의됨

### 68-95-99.7 규칙

\`\`\`
평균 ± 1σ: 약 68%의 데이터
평균 ± 2σ: 약 95%의 데이터
평균 ± 3σ: 약 99.7%의 데이터

예: IQ (평균=100, 표준편차=15)
- 85~115: 68%
- 70~130: 95%
- 55~145: 99.7%
\`\`\`

### Python에서 정규분포

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# 정규분포 샘플 생성
np.random.seed(42)
data = np.random.normal(loc=100, scale=15, size=1000)

print(f"평균: {np.mean(data):.2f}")
print(f"표준편차: {np.std(data):.2f}")

# 히스토그램
plt.hist(data, bins=30, density=True, alpha=0.7)
plt.title('정규분포 (μ=100, σ=15)')
plt.show()
\`\`\`

## 왜도 (Skewness)

분포의 비대칭 정도

\`\`\`
왜도 = 0: 대칭
왜도 > 0: 오른쪽 꼬리 (양의 왜도)
왜도 < 0: 왼쪽 꼬리 (음의 왜도)
\`\`\`

### 예시
\`\`\`
소득 분포: 양의 왜도
  - 대부분 중저소득, 소수의 고소득
  - 오른쪽으로 긴 꼬리

시험 점수 (쉬운 시험): 음의 왜도
  - 대부분 고득점, 소수의 저점
  - 왼쪽으로 긴 꼬리
\`\`\`

### Python 계산
\`\`\`python
from scipy import stats

data = [1, 2, 2, 3, 3, 3, 4, 4, 5, 10]  # 양의 왜도
skewness = stats.skew(data)
print(f"왜도: {skewness:.2f}")  # 양수 → 오른쪽 꼬리
\`\`\`

## 첨도 (Kurtosis)

분포의 뾰족한 정도

\`\`\`
첨도 > 0: 뾰족함 (꼬리가 두꺼움)
첨도 = 0: 정규분포와 유사
첨도 < 0: 평평함 (꼬리가 얇음)
\`\`\`

### Python 계산
\`\`\`python
from scipy import stats

data = np.random.normal(0, 1, 1000)
kurtosis = stats.kurtosis(data)
print(f"첨도: {kurtosis:.2f}")  # 0에 가까움 (정규분포)
\`\`\`
`
      }
    },
    {
      id: 'stats-practice2',
      type: 'code',
      title: '실습: 산포도와 분포 분석',
      duration: 30,
      content: {
        objectives: [
          'Python으로 산포도를 계산한다',
          '분포의 형태를 분석한다'
        ],
        markdown: `
## 실습: 산포도와 분포 분석

### 산포도 계산

\`\`\`python
import numpy as np
from scipy import stats

# 두 반의 시험 점수
class_a = [78, 82, 85, 79, 81, 83, 80, 84, 77, 82]
class_b = [60, 95, 75, 88, 70, 92, 65, 98, 72, 85]

# 통계 비교
for name, data in [("A반", class_a), ("B반", class_b)]:
    print(f"\\n{name}:")
    print(f"  평균: {np.mean(data):.2f}")
    print(f"  표준편차: {np.std(data, ddof=1):.2f}")
    print(f"  범위: {np.ptp(data)}")

# 결과:
# A반: 평균 81.10, 표준편차 2.64
# B반: 평균 80.00, 표준편차 13.14
# → 평균은 비슷하지만 B반이 훨씬 더 퍼져 있음
\`\`\`

### 분포 형태 분석

\`\`\`python
from scipy import stats
import numpy as np

# 소득 데이터 (만원, 양의 왜도 예상)
income = [250, 280, 300, 320, 350, 380, 400, 450,
          500, 600, 800, 1200, 2000]

print("소득 통계:")
print(f"  평균: {np.mean(income):,.0f}만원")
print(f"  중앙값: {np.median(income):,.0f}만원")
print(f"  표준편차: {np.std(income):,.0f}만원")
print(f"  왜도: {stats.skew(income):.2f}")
print(f"  첨도: {stats.kurtosis(income):.2f}")

# 평균 > 중앙값, 왜도 > 0 → 오른쪽으로 치우친 분포
\`\`\`

### 표준화 (Z-score)

\`\`\`python
# 서로 다른 시험 점수 비교
# 수학: 평균 70, 표준편차 10
# 영어: 평균 80, 표준편차 5

math_score = 85
english_score = 88

# Z-score = (값 - 평균) / 표준편차
z_math = (85 - 70) / 10  # 1.5
z_english = (88 - 80) / 5  # 1.6

print(f"수학 Z-score: {z_math}")
print(f"영어 Z-score: {z_english}")
# → 영어 점수가 상대적으로 더 좋음
\`\`\`

### 연습 문제

1. 다음 데이터의 분산과 표준편차를 계산하세요:
   \`[5, 7, 9, 11, 13]\`

2. 평균이 50이고 표준편차가 10인 데이터에서
   점수 70은 상위 몇 % 정도일까요?

3. 왜 소득 통계에서 평균보다 중앙값을 더 자주 사용하나요?
`
      }
    }
  ]
}

const day3: Day = {
  slug: 'stats-day3',
  title: '상관관계와 확률 기초',
  totalDuration: 90,
  tasks: [
    {
      id: 'correlation',
      type: 'reading',
      title: '상관관계',
      duration: 30,
      content: {
        objectives: [
          '상관관계의 개념을 이해한다',
          '상관계수를 해석할 수 있다',
          '상관관계와 인과관계를 구분한다'
        ],
        markdown: `
## 상관관계 (Correlation)

두 변수 간의 관련성을 나타내는 지표

### 상관계수 (Correlation Coefficient)

**피어슨 상관계수 (r)**: -1 ~ +1

\`\`\`
r = +1: 완벽한 양의 상관
r = 0: 상관 없음
r = -1: 완벽한 음의 상관
\`\`\`

### 해석 기준

| r 값 | 상관 정도 |
|------|----------|
| 0.0 ~ 0.3 | 약한 상관 |
| 0.3 ~ 0.7 | 중간 상관 |
| 0.7 ~ 1.0 | 강한 상관 |

### Python 계산

\`\`\`python
import numpy as np
from scipy import stats

# 키와 몸무게 데이터
height = [160, 165, 170, 175, 180, 185]
weight = [50, 55, 65, 70, 75, 80]

# 피어슨 상관계수
r, p_value = stats.pearsonr(height, weight)
print(f"상관계수: {r:.2f}")  # 약 0.98 (강한 양의 상관)

# NumPy로 계산
corr_matrix = np.corrcoef(height, weight)
print(f"상관계수: {corr_matrix[0,1]:.2f}")
\`\`\`

## 상관관계 ≠ 인과관계

### 중요한 구분

\`\`\`
예1: 아이스크림 판매량과 물놀이 사고
- 양의 상관관계 있음
- 인과관계? 아이스크림이 사고를 유발?
- 실제: 공통 원인(더운 날씨)이 둘 다 영향

예2: 신발 크기와 수학 점수 (아동)
- 양의 상관관계 있음
- 인과관계? 큰 신발이 수학 능력 향상?
- 실제: 나이(숨은 변수)가 둘 다 영향
\`\`\`

### 상관관계만으로 인과를 주장하면 안 되는 이유

1. **숨은 변수 (Confounding Variable)**
   - 두 변수에 모두 영향을 주는 제3의 변수

2. **역인과 가능성**
   - A→B인지 B→A인지 상관만으로는 알 수 없음

3. **우연의 일치**
   - 통계적 유의성 없는 상관

### 인과관계 확인 방법
- 무작위 통제 실험 (RCT)
- 시계열 분석 (선후 관계)
- 메커니즘 이해 (이론적 근거)
`
      }
    },
    {
      id: 'probability-basics',
      type: 'reading',
      title: '확률의 기초',
      duration: 30,
      content: {
        objectives: [
          '확률의 기본 개념을 이해한다',
          '조건부 확률을 계산할 수 있다',
          '베이즈 정리의 개념을 안다'
        ],
        markdown: `
## 확률의 기초

### 기본 개념

\`\`\`
확률 P(A) = 사건 A가 일어날 경우의 수 / 전체 경우의 수

예: 주사위에서 짝수가 나올 확률
P(짝수) = 3/6 = 0.5
\`\`\`

### 확률의 규칙

**덧셈 규칙 (OR)**
\`\`\`
P(A 또는 B) = P(A) + P(B) - P(A와 B)

예: 카드에서 빨간색 또는 킹을 뽑을 확률
P(빨간색) = 26/52
P(킹) = 4/52
P(빨간색 킹) = 2/52
P(빨간색 OR 킹) = 26/52 + 4/52 - 2/52 = 28/52
\`\`\`

**곱셈 규칙 (AND)**
\`\`\`
독립인 경우: P(A와 B) = P(A) × P(B)

예: 동전 2번 던져서 둘 다 앞면
P(앞면) × P(앞면) = 0.5 × 0.5 = 0.25
\`\`\`

## 조건부 확률

사건 B가 일어났을 때 A가 일어날 확률

\`\`\`
P(A|B) = P(A와 B) / P(B)
\`\`\`

### 예시

\`\`\`
설문 조사 결과:
         | 남성 | 여성 | 합계
---------|------|------|-----
찬성     | 30   | 40   | 70
반대     | 20   | 10   | 30
합계     | 50   | 50   | 100

Q: 남성일 때 찬성할 확률?
P(찬성|남성) = 30/50 = 0.6

Q: 여성일 때 찬성할 확률?
P(찬성|여성) = 40/50 = 0.8
\`\`\`

## 베이즈 정리 (개념)

새로운 증거를 바탕으로 확률을 업데이트

\`\`\`
P(A|B) = P(B|A) × P(A) / P(B)

직관적 설명:
- P(A): 사전 확률 (기존 믿음)
- P(B|A): 가능도 (증거)
- P(A|B): 사후 확률 (업데이트된 믿음)
\`\`\`

### 예시: 질병 진단

\`\`\`
- 질병 유병률: 1% (P(질병) = 0.01)
- 검사 정확도:
  - 양성일 때 질병: 99% (P(양성|질병) = 0.99)
  - 음성일 때 건강: 95% (P(음성|건강) = 0.95)

Q: 검사가 양성일 때 실제 질병일 확률?
→ 직관과 달리 약 17% (낮은 유병률 때문)
\`\`\`
`
      }
    },
    {
      id: 'stats-quiz',
      type: 'quiz',
      title: '통계 기초 퀴즈',
      duration: 30,
      content: {
        questions: [
          {
            question: '이상치(outlier)에 가장 강건한 중심 지표는?',
            options: ['평균', '중앙값', '범위', '분산'],
            answer: 1,
            explanation: '중앙값은 데이터를 정렬했을 때 가운데 값이므로 극단값의 영향을 받지 않습니다.'
          },
          {
            question: '표준편차가 크다는 것의 의미는?',
            options: [
              '평균이 크다',
              '데이터가 평균 주위에 모여 있다',
              '데이터가 넓게 퍼져 있다',
              '이상치가 있다'
            ],
            answer: 2,
            explanation: '표준편차는 데이터의 퍼짐 정도를 나타내며, 클수록 넓게 퍼져 있습니다.'
          },
          {
            question: '상관계수가 0.9라면?',
            options: [
              '두 변수는 관계가 없다',
              '강한 양의 상관관계가 있다',
              'A가 B의 원인이다',
              '두 변수가 같다'
            ],
            answer: 1,
            explanation: '0.9는 강한 양의 상관을 나타내지만, 인과관계를 의미하지는 않습니다.'
          },
          {
            question: '정규분포에서 평균 ± 2σ 범위에 포함되는 데이터는 약?',
            options: ['68%', '95%', '99%', '50%'],
            answer: 1,
            explanation: '68-95-99.7 규칙에서 ±2σ는 약 95%의 데이터를 포함합니다.'
          },
          {
            question: '왜도(skewness)가 양수일 때 분포 형태는?',
            options: [
              '왼쪽으로 꼬리가 긴 분포',
              '오른쪽으로 꼬리가 긴 분포',
              '대칭 분포',
              '평평한 분포'
            ],
            answer: 1,
            explanation: '양의 왜도는 오른쪽으로 긴 꼬리를 가진 분포(소득 분포 등)를 의미합니다.'
          }
        ]
      }
    }
  ]
}

export const prereqStatsWeek: Week = {
  slug: 'prereq-stats',
  week: 6,
  phase: 0,
  month: 0,
  access: 'free',
  title: '통계 기초',
  topics: ['기술 통계', '중심경향성', '산포도', '정규분포', '상관관계', '확률'],
  practice: '데이터 분포 분석',
  totalDuration: 270,
  days: [day1, day2, day3]
}
