// Week 10 Day 1: 데이터 소스 매핑 & 이해
import type { Task } from '../../types'

export const day1Tasks: Task[] = [
  {
    id: 'p2w2d1t1',
    type: 'video',
    title: '조직 내 데이터 소스 이해',
    duration: 20,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 조직 내 데이터 소스 이해

## 왜 데이터 소스 매핑이 중요한가?

FDE는 분석을 시작하기 전에 "어떤 데이터가 어디에 있는지"를 파악해야 합니다.

\\\`\\\`\\\`
잘못된 접근:
"분석 요청 받음 → 바로 코딩 시작 → 데이터 어디있지?"

올바른 접근:
"분석 요청 받음 → 필요한 데이터 정의 → 소스 파악 → 접근 권한 확인 → 분석"
\\\`\\\`\\\`

## 일반적인 조직의 데이터 구조

### 1. 운영 시스템 (Operational Systems)

| 시스템 | 데이터 유형 | 예시 |
|--------|------------|------|
| ERP (SAP, Oracle) | 재무, 재고, 구매 | 매출, 원가, 재고량 |
| CRM (Salesforce) | 고객, 영업 | 고객 정보, 거래 내역 |
| WMS (창고관리) | 물류, 배송 | 출고량, 배송 시간 |
| POS | 거래, 결제 | 실시간 판매 |

### 2. 웹/앱 데이터

| 소스 | 데이터 유형 | 활용 |
|------|------------|------|
| Google Analytics | 웹 행동 | 전환 퍼널, 이탈률 |
| Amplitude | 앱 이벤트 | 사용 패턴, 리텐션 |
| A/B 테스트 | 실험 결과 | 기능 효과 검증 |

### 3. 데이터 저장소

\\\`\\\`\\\`
Raw Data (S3, GCS)
    ↓ ETL
Data Lake (Delta Lake, Iceberg)
    ↓ Transform
Data Warehouse (Snowflake, BigQuery)
    ↓ Aggregate
Data Mart (부서별)
\\\`\\\`\\\`

## 데이터 카탈로그의 중요성

### 왜 데이터 카탈로그가 필요한가?

\\\`\\\`\\\`
문제 상황:
- "이 테이블 누가 관리해요?"
- "이 컬럼 의미가 뭐예요?"
- "최신 데이터가 언제까지예요?"
- "이 데이터 써도 되나요?"

해결책: 데이터 카탈로그
- 메타데이터 관리
- 데이터 소유자 명시
- 데이터 품질 지표
- 접근 권한 관리
\\\`\\\`\\\`

### 주요 데이터 카탈로그 도구

| 도구 | 특징 | 가격 |
|------|------|------|
| DataHub (LinkedIn) | 오픈소스, 확장성 | 무료 |
| Atlan | 협업 중심, 직관적 | 유료 |
| Alation | 엔터프라이즈 | 유료 |
| dbt Cloud | dbt 연동, 문서화 | 무료/유료 |

## FDE의 데이터 소스 접근법

### 1. 데이터 요구사항 정의

\\\`\\\`\\\`python
# 분석 목표: 고객 이탈 예측

필요한 데이터:
1. 고객 기본 정보 (CRM)
   - 가입일, 연령, 지역

2. 거래 내역 (ERP)
   - 구매 금액, 빈도, 최근 구매일

3. 서비스 이용 (웹 로그)
   - 로그인 빈도, 페이지 체류 시간

4. CS 상담 (CRM)
   - 문의 횟수, 불만 유형
\\\`\\\`\\\`

### 2. 데이터 소스 매핑

\\\`\\\`\\\`sql
-- 소스별 테이블 식별
SELECT
    source_system,
    table_name,
    column_name,
    data_type,
    last_updated
FROM data_catalog
WHERE business_domain = '고객'
\\\`\\\`\\\`

### 3. 데이터 조인 전략

\\\`\\\`\\\`
고객 ID로 연결:
CRM.customer_id
    ↔ ERP.customer_id
    ↔ WebLog.user_id (매핑 테이블 필요)
    ↔ CS.customer_id
\\\`\\\`\\\`
`,
      objectives: [
        '조직 내 데이터 소스 유형을 이해한다',
        '데이터 카탈로그의 필요성을 이해한다',
        '분석에 필요한 데이터 소스를 식별할 수 있다'
      ],
      keyPoints: [
        '분석 전 데이터 소스 매핑이 필수',
        'ERP, CRM, 웹 로그 등 다양한 소스 존재',
        '데이터 카탈로그로 메타데이터 관리',
        '조인 키 식별이 중요'
      ]
    }
  },
  {
    id: 'p2w2d1t2',
    type: 'video',
    title: '데이터 품질 6차원',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# 데이터 품질 6차원

## 데이터 품질이 왜 중요한가?

\\\`\\\`\\\`
"Garbage In, Garbage Out"

아무리 좋은 모델도 나쁜 데이터로는 좋은 결과를 낼 수 없습니다.
데이터 사이언스 프로젝트의 80%는 데이터 품질 문제로 실패합니다.
\\\`\\\`\\\`

## 6가지 데이터 품질 차원

### 1. 완전성 (Completeness)

**질문**: 필요한 데이터가 다 있는가?

\\\`\\\`\\\`python
import pandas as pd

# 결측률 확인
def check_completeness(df):
    missing = df.isnull().sum()
    missing_pct = (missing / len(df) * 100).round(2)

    report = pd.DataFrame({
        'missing_count': missing,
        'missing_pct': missing_pct
    })
    return report[report['missing_count'] > 0].sort_values('missing_pct', ascending=False)

# 결과 해석
# missing_pct > 50%: 컬럼 삭제 고려
# missing_pct > 20%: 원인 파악 필요
# missing_pct < 5%: 대체 가능
\\\`\\\`\\\`

### 2. 정확성 (Accuracy)

**질문**: 데이터가 실제와 일치하는가?

\\\`\\\`\\\`python
# 범위 검증
def check_accuracy(df):
    issues = []

    # 나이가 0-120 범위인지
    if 'age' in df.columns:
        invalid_age = df[(df['age'] < 0) | (df['age'] > 120)]
        if len(invalid_age) > 0:
            issues.append(f"Invalid age: {len(invalid_age)} rows")

    # 가격이 양수인지
    if 'price' in df.columns:
        negative_price = df[df['price'] < 0]
        if len(negative_price) > 0:
            issues.append(f"Negative price: {len(negative_price)} rows")

    return issues

# 샘플링 검증 (실제 값과 비교)
# 무작위로 100개 레코드 선택 → 원본 시스템과 비교
\\\`\\\`\\\`

### 3. 일관성 (Consistency)

**질문**: 시스템 간 데이터가 일치하는가?

\\\`\\\`\\\`python
# CRM과 ERP의 고객 수 비교
crm_customers = crm_df['customer_id'].nunique()
erp_customers = erp_df['customer_id'].nunique()

print(f"CRM 고객 수: {crm_customers}")
print(f"ERP 고객 수: {erp_customers}")
print(f"차이: {abs(crm_customers - erp_customers)}")

# 교집합 확인
common = set(crm_df['customer_id']) & set(erp_df['customer_id'])
only_crm = set(crm_df['customer_id']) - set(erp_df['customer_id'])
only_erp = set(erp_df['customer_id']) - set(crm_df['customer_id'])
\\\`\\\`\\\`

### 4. 적시성 (Timeliness)

**질문**: 데이터가 최신인가?

\\\`\\\`\\\`python
# 최종 업데이트 확인
def check_timeliness(df, date_col):
    latest = df[date_col].max()
    today = pd.Timestamp.now()
    delay = (today - latest).days

    print(f"최신 데이터: {latest}")
    print(f"현재: {today}")
    print(f"지연: {delay}일")

    if delay > 7:
        print("⚠️ 경고: 1주일 이상 지연")

    return delay
\\\`\\\`\\\`

### 5. 유효성 (Validity)

**질문**: 데이터 형식이 올바른가?

\\\`\\\`\\\`python
import re

def check_validity(df):
    issues = []

    # 이메일 형식 검증
    if 'email' in df.columns:
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        invalid_email = df[~df['email'].str.match(email_pattern, na=False)]
        if len(invalid_email) > 0:
            issues.append(f"Invalid email: {len(invalid_email)} rows")

    # 전화번호 형식
    if 'phone' in df.columns:
        phone_pattern = r'^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$'
        invalid_phone = df[~df['phone'].str.match(phone_pattern, na=False)]
        if len(invalid_phone) > 0:
            issues.append(f"Invalid phone: {len(invalid_phone)} rows")

    return issues
\\\`\\\`\\\`

### 6. 유일성 (Uniqueness)

**질문**: 중복이 없는가?

\\\`\\\`\\\`python
def check_uniqueness(df, key_cols):
    # 전체 중복
    total_dups = df.duplicated().sum()
    print(f"전체 중복 행: {total_dups}")

    # 키 기준 중복
    key_dups = df.duplicated(subset=key_cols).sum()
    print(f"키({key_cols}) 중복: {key_dups}")

    # 중복 레코드 확인
    if key_dups > 0:
        dup_records = df[df.duplicated(subset=key_cols, keep=False)]
        return dup_records.sort_values(key_cols)

    return None
\\\`\\\`\\\`

## 데이터 품질 리포트 자동화

\\\`\\\`\\\`python
def generate_quality_report(df):
    report = {
        'total_rows': len(df),
        'total_columns': len(df.columns),
        'completeness': {},
        'accuracy': [],
        'uniqueness': {}
    }

    # 완전성
    for col in df.columns:
        missing_pct = df[col].isnull().mean() * 100
        report['completeness'][col] = round(missing_pct, 2)

    # 유일성
    report['uniqueness']['total_duplicates'] = df.duplicated().sum()

    return report
\\\`\\\`\\\`
`,
      objectives: [
        '데이터 품질 6차원을 이해한다',
        '각 차원별 검증 방법을 적용할 수 있다',
        '데이터 품질 리포트를 자동화할 수 있다'
      ],
      keyPoints: [
        '완전성: 결측률 확인',
        '정확성: 범위 검증, 샘플 검증',
        '일관성: 시스템 간 비교',
        '적시성: 최신 데이터 확인',
        '유효성: 형식 검증 (정규식)',
        '유일성: 중복 탐지'
      ]
    }
  },
  {
    id: 'p2w2d1t3',
    type: 'code',
    title: '실습: 데이터 품질 프로파일링',
    duration: 45,
    content: {
      instructions: `# 데이터 품질 프로파일링 실습

## 목표
주어진 데이터셋에 대해 6가지 품질 차원을 평가하는 프로파일링 리포트를 작성하세요.

## 요구사항

### 1. 데이터 로드
- Kaggle의 "Spaceship Titanic" 데이터 또는 제공된 샘플 데이터 사용
- 기본 정보 출력 (shape, dtypes)

### 2. 완전성 (Completeness)
- 각 컬럼별 결측률 계산
- 결측률 10% 이상인 컬럼 식별
- missingno 라이브러리로 패턴 시각화

### 3. 정확성 (Accuracy)
- 수치형 컬럼 범위 검증 (min, max)
- 이상값 탐지 (IQR 방법)

### 4. 유효성 (Validity)
- 범주형 컬럼의 고유값 확인
- 예상치 못한 값 탐지

### 5. 유일성 (Uniqueness)
- 전체 중복 행 수
- ID 컬럼 기준 중복 확인

### 6. 종합 리포트
- 품질 점수 (0-100) 계산
- 개선 권고사항 도출

## 제출물
- 완성된 Python 코드
- 품질 리포트 출력
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 샘플 데이터 생성 (또는 실제 데이터 로드)
np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'customer_id': range(1, n + 1),
    'age': np.random.randint(18, 80, n),
    'income': np.random.normal(50000, 15000, n),
    'email': ['user' + str(i) + '@email.com' for i in range(n)],
    'category': np.random.choice(['A', 'B', 'C', None], n, p=[0.3, 0.3, 0.3, 0.1]),
    'purchase_amount': np.random.exponential(100, n)
})

# 의도적으로 품질 이슈 추가
df.loc[50:60, 'age'] = -5  # 잘못된 나이
df.loc[100:150, 'income'] = np.nan  # 결측치
df.loc[200:210, 'email'] = 'invalid-email'  # 잘못된 이메일
df = pd.concat([df, df.iloc[:20]])  # 중복 추가

print("=== 데이터 기본 정보 ===")
print(f"Shape: {df.shape}")
print(f"\\nDtypes:\\n{df.dtypes}")

# TODO: 아래에 품질 검사 코드 작성

# 1. 완전성 검사
def check_completeness(df):
    """각 컬럼별 결측률을 계산합니다."""
    # 여기에 코드 작성
    pass

# 2. 정확성 검사
def check_accuracy(df):
    """수치형 컬럼의 범위와 이상값을 검사합니다."""
    # 여기에 코드 작성
    pass

# 3. 유효성 검사
def check_validity(df):
    """데이터 형식이 올바른지 검사합니다."""
    # 여기에 코드 작성
    pass

# 4. 유일성 검사
def check_uniqueness(df, key_col='customer_id'):
    """중복 레코드를 탐지합니다."""
    # 여기에 코드 작성
    pass

# 5. 종합 리포트
def generate_quality_report(df):
    """종합 품질 리포트를 생성합니다."""
    # 여기에 코드 작성
    pass

# 실행
print("\\n=== 품질 검사 결과 ===")
# 각 함수 호출
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import re

# 샘플 데이터 생성
np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'customer_id': range(1, n + 1),
    'age': np.random.randint(18, 80, n),
    'income': np.random.normal(50000, 15000, n),
    'email': ['user' + str(i) + '@email.com' for i in range(n)],
    'category': np.random.choice(['A', 'B', 'C', None], n, p=[0.3, 0.3, 0.3, 0.1]),
    'purchase_amount': np.random.exponential(100, n)
})

# 품질 이슈 추가
df.loc[50:60, 'age'] = -5
df.loc[100:150, 'income'] = np.nan
df.loc[200:210, 'email'] = 'invalid-email'
df = pd.concat([df, df.iloc[:20]]).reset_index(drop=True)

print("=== 데이터 기본 정보 ===")
print(f"Shape: {df.shape}")
print(f"\\nDtypes:\\n{df.dtypes}")

# 1. 완전성 검사
def check_completeness(df):
    """각 컬럼별 결측률을 계산합니다."""
    print("\\n--- 1. 완전성 (Completeness) ---")

    missing = df.isnull().sum()
    missing_pct = (missing / len(df) * 100).round(2)

    report = pd.DataFrame({
        'missing_count': missing,
        'missing_pct': missing_pct
    }).sort_values('missing_pct', ascending=False)

    print(report)

    # 10% 이상 결측 컬럼
    high_missing = report[report['missing_pct'] >= 10]
    if len(high_missing) > 0:
        print(f"\\n⚠️ 결측률 10% 이상 컬럼: {list(high_missing.index)}")

    return report

# 2. 정확성 검사
def check_accuracy(df):
    """수치형 컬럼의 범위와 이상값을 검사합니다."""
    print("\\n--- 2. 정확성 (Accuracy) ---")

    numerical_cols = df.select_dtypes(include=[np.number]).columns
    issues = []

    for col in numerical_cols:
        print(f"\\n[{col}]")
        print(f"  Min: {df[col].min():.2f}, Max: {df[col].max():.2f}")
        print(f"  Mean: {df[col].mean():.2f}, Std: {df[col].std():.2f}")

        # 특정 컬럼 범위 검사
        if col == 'age':
            invalid = df[(df[col] < 0) | (df[col] > 120)]
            if len(invalid) > 0:
                issues.append(f"age: {len(invalid)} invalid values (< 0 or > 120)")

        # IQR 이상치
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        outliers = df[(df[col] < Q1 - 1.5*IQR) | (df[col] > Q3 + 1.5*IQR)]
        if len(outliers) > 0:
            print(f"  IQR 이상치: {len(outliers)}개 ({len(outliers)/len(df)*100:.1f}%)")

    if issues:
        print(f"\\n⚠️ 정확성 이슈:")
        for issue in issues:
            print(f"  - {issue}")

    return issues

# 3. 유효성 검사
def check_validity(df):
    """데이터 형식이 올바른지 검사합니다."""
    print("\\n--- 3. 유효성 (Validity) ---")

    issues = []

    # 이메일 검증
    if 'email' in df.columns:
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        invalid_email = df[~df['email'].astype(str).str.match(email_pattern)]
        print(f"\\n[email] 유효하지 않은 이메일: {len(invalid_email)}개")
        if len(invalid_email) > 0:
            issues.append(f"email: {len(invalid_email)} invalid format")
            print(f"  예시: {invalid_email['email'].head().tolist()}")

    # 범주형 고유값
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns
    for col in categorical_cols:
        if col != 'email':
            unique_vals = df[col].dropna().unique()
            print(f"\\n[{col}] 고유값: {unique_vals}")

    return issues

# 4. 유일성 검사
def check_uniqueness(df, key_col='customer_id'):
    """중복 레코드를 탐지합니다."""
    print("\\n--- 4. 유일성 (Uniqueness) ---")

    # 전체 중복
    total_dups = df.duplicated().sum()
    print(f"전체 중복 행: {total_dups}개 ({total_dups/len(df)*100:.1f}%)")

    # 키 기준 중복
    key_dups = df.duplicated(subset=[key_col]).sum()
    print(f"키({key_col}) 중복: {key_dups}개")

    if key_dups > 0:
        dup_ids = df[df.duplicated(subset=[key_col], keep=False)][key_col].unique()
        print(f"  중복된 ID 예시: {list(dup_ids[:5])}")

    return {'total_duplicates': total_dups, 'key_duplicates': key_dups}

# 5. 종합 리포트
def generate_quality_report(df):
    """종합 품질 리포트를 생성합니다."""
    print("\\n" + "="*50)
    print("=== 종합 데이터 품질 리포트 ===")
    print("="*50)

    scores = {}

    # 완전성 점수 (결측률 기반)
    completeness_score = (1 - df.isnull().mean().mean()) * 100
    scores['completeness'] = completeness_score

    # 유일성 점수 (중복률 기반)
    uniqueness_score = (1 - df.duplicated().mean()) * 100
    scores['uniqueness'] = uniqueness_score

    # 종합 점수
    overall_score = np.mean(list(scores.values()))

    print(f"\\n📊 품질 점수:")
    print(f"  - 완전성: {scores['completeness']:.1f}/100")
    print(f"  - 유일성: {scores['uniqueness']:.1f}/100")
    print(f"  ─────────────────")
    print(f"  - 종합: {overall_score:.1f}/100")

    # 권고사항
    print(f"\\n📋 개선 권고사항:")
    if scores['completeness'] < 90:
        print("  1. [완전성] 결측치 처리 필요 - KNN 또는 중앙값 대체 권장")
    if scores['uniqueness'] < 95:
        print("  2. [유일성] 중복 레코드 제거 필요")

    return scores

# 실행
print("\\n=== 품질 검사 결과 ===")
completeness = check_completeness(df)
accuracy = check_accuracy(df)
validity = check_validity(df)
uniqueness = check_uniqueness(df)
scores = generate_quality_report(df)
`,
      hints: [
        'df.isnull().sum()으로 결측치 수를 확인할 수 있습니다',
        'df.duplicated()로 중복 행을 탐지합니다',
        'str.match()로 정규식 패턴 검증이 가능합니다',
        'IQR = Q3 - Q1, 이상치는 Q1 - 1.5*IQR ~ Q3 + 1.5*IQR 범위 밖'
      ]
    }
  },
  {
    id: 'p2w2d1t4',
    type: 'quiz',
    title: 'Day 1 퀴즈: 데이터 소스 & 품질',
    duration: 10,
    content: {
      questions: [
        {
          question: '데이터 품질 6차원 중 "데이터가 실제와 일치하는가?"를 평가하는 차원은?',
          options: ['완전성 (Completeness)', '정확성 (Accuracy)', '일관성 (Consistency)', '유효성 (Validity)'],
          answer: 1,
          explanation: '정확성(Accuracy)은 데이터가 실제 값과 일치하는지를 평가합니다. 완전성은 결측치 여부, 일관성은 시스템 간 데이터 일치, 유효성은 형식이 올바른지를 평가합니다.'
        },
        {
          question: '결측률이 50% 이상인 컬럼에 대한 일반적인 권장 처리 방법은?',
          options: ['평균값으로 대체', '중앙값으로 대체', 'KNN 대체', '컬럼 삭제 고려'],
          answer: 3,
          explanation: '결측률이 50% 이상이면 대체 방법으로는 신뢰할 수 없는 값이 생성될 수 있어, 컬럼 삭제를 고려해야 합니다. 단, 해당 변수의 중요도와 비즈니스 맥락을 함께 고려해야 합니다.'
        },
        {
          question: '데이터 카탈로그의 주요 역할이 아닌 것은?',
          options: ['메타데이터 관리', '데이터 소유자 명시', '데이터 변환 수행', '접근 권한 관리'],
          answer: 2,
          explanation: '데이터 카탈로그는 메타데이터 관리, 데이터 소유자 명시, 접근 권한 관리를 담당합니다. 데이터 변환은 ETL 파이프라인이나 데이터 엔지니어링 도구에서 수행합니다.'
        },
        {
          question: 'CRM 시스템에서 일반적으로 관리하는 데이터 유형은?',
          options: ['재고, 구매', '고객, 영업', '물류, 배송', '재무, 원가'],
          answer: 1,
          explanation: 'CRM(Customer Relationship Management)은 고객 정보와 영업 데이터를 관리합니다. 재고/구매는 ERP, 물류/배송은 WMS, 재무/원가도 ERP에서 주로 관리합니다.'
        },
        {
          question: '이메일 형식 검증에 사용하는 기법은?',
          options: ['IQR 방법', '정규식 (Regex)', 'Z-score', 'KNN'],
          answer: 1,
          explanation: '정규식(Regular Expression)은 문자열 패턴을 정의하여 이메일, 전화번호 등의 형식을 검증합니다. IQR과 Z-score는 이상치 탐지, KNN은 결측치 대체에 사용됩니다.'
        }
      ]
    }
  }
]
