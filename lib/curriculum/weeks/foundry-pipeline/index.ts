// Phase 7, Week 3: Pipeline Builder 심화
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'data-connection',
  title: 'Data Connection 심화',
  totalDuration: 180,
  tasks: [
    {
      id: 'data-connection-overview',
      type: 'reading',
      title: 'Data Connection 개요',
      duration: 40,
      content: {
        objectives: [
          'Data Connection의 역할을 이해한다',
          '지원되는 소스 유형을 파악한다',
          '동기화 옵션을 이해한다'
        ],
        markdown: `
## Data Connection 개요

### Data Connection이란?

\`\`\`
Data Connection = 외부 시스템과 Foundry 연결

역할:
├── 데이터 소스 연결
├── 스키마 추론
├── 증분/전체 동기화
└── 스케줄링
\`\`\`

### 지원 소스 유형

| 유형 | 예시 | 특징 |
|------|------|------|
| **Database** | PostgreSQL, Oracle, MySQL | SQL 쿼리 |
| **Cloud Storage** | S3, GCS, Azure Blob | 파일 기반 |
| **API** | REST, SOAP | 커스텀 |
| **Streaming** | Kafka | 실시간 |
| **SaaS** | Salesforce, SAP | 커넥터 |

### 동기화 모드

\`\`\`
1. Full Sync (전체 동기화)
   └── 매번 전체 데이터 복사
   └── 소규모 테이블에 적합

2. Incremental Sync (증분 동기화)
   └── 변경분만 복사
   └── 대용량에 적합
   └── 기준: timestamp, sequence, CDC

3. Append Only (추가만)
   └── 새 데이터만 추가
   └── 로그 데이터에 적합
\`\`\`

### 설정 예시

\`\`\`yaml
# PostgreSQL 연결 예시

Connection:
  name: sales_db_connection
  type: PostgreSQL
  host: db.example.com
  port: 5432
  database: sales
  credentials: vault://secrets/sales_db

Sync Configuration:
  tables:
    - name: orders
      sync_mode: incremental
      watermark_column: updated_at
      schedule: "0 */6 * * *"  # 6시간마다

    - name: products
      sync_mode: full
      schedule: "0 0 * * *"    # 매일
\`\`\`
        `,
        externalLinks: [
          { title: 'Data Connection 문서', url: 'https://learn.palantir.com/data-connection' }
        ]
      }
    },
    {
      id: 'data-connection-config',
      type: 'reading',
      title: 'Connection 설정 심화',
      duration: 40,
      content: {
        objectives: [
          '데이터베이스 연결 설정을 이해한다',
          '인증 및 보안 설정을 파악한다',
          '스케줄링을 설정한다'
        ],
        markdown: `
## Connection 설정 심화

### 데이터베이스 연결

\`\`\`
필수 정보:
├── Host/Port
├── Database name
├── Username/Password
└── SSL 설정

선택 정보:
├── Connection pool size
├── Query timeout
└── SSH tunnel (보안)
\`\`\`

### 인증 옵션

\`\`\`
1. Username/Password
   └── 기본, 보안 약함

2. Service Account
   └── 비밀번호 없는 인증

3. OAuth 2.0
   └── SaaS 연동

4. Vault Integration
   └── 비밀 중앙 관리
   └── 권장!
\`\`\`

### 스케줄링

\`\`\`
Cron 표현식:
┌───────── 분 (0-59)
│ ┌─────── 시 (0-23)
│ │ ┌───── 일 (1-31)
│ │ │ ┌─── 월 (1-12)
│ │ │ │ ┌─ 요일 (0-7)
│ │ │ │ │
* * * * *

예시:
├── "0 * * * *"    → 매시 정각
├── "0 0 * * *"    → 매일 자정
├── "0 */6 * * *"  → 6시간마다
├── "0 9 * * 1-5"  → 평일 오전 9시
└── "0 0 1 * *"    → 매월 1일
\`\`\`

### 오류 처리

\`\`\`
설정:
├── Retry count: 3
├── Retry interval: 5분
├── Alert on failure: ✅
└── Fallback behavior: skip/fail
\`\`\`
        `,
        externalLinks: [
          { title: 'Scheduling Guide', url: 'https://learn.palantir.com/scheduling' }
        ]
      }
    },
    {
      id: 'data-sync-exercise',
      type: 'code',
      title: 'Data Sync 설정 실습',
      duration: 60,
      content: {
        objectives: [
          '샘플 데이터 소스를 연결한다',
          '동기화를 설정하고 실행한다',
          '결과를 검증한다'
        ],
        instructions: `
## Data Sync 설정 실습

### 실습 환경

AIP Developer Tier에서 사용 가능한 연습:
- 샘플 연결 설정 검토
- 동기화 로그 분석
- 스케줄 설정 이해

### 실습 1: 연결 설정 검토

\`\`\`
1. Compass에서 Data Connection 찾기
2. 기존 연결 설정 확인
3. 스키마 추론 결과 검토
\`\`\`

### 실습 2: 동기화 이해

\`\`\`
동기화 로그 분석:
├── 시작/종료 시간
├── 처리된 행 수
├── 오류 발생 여부
└── 성능 메트릭
\`\`\`

### 실습 3: 설계 연습

자신의 데이터 소스에 대한 연결 설계:

\`\`\`yaml
# 설계 문서
Connection:
  name:
  type:
  sync_mode:
  schedule:
  tables:
    -
\`\`\`

### 체크리스트

- [ ] 샘플 연결 검토
- [ ] 동기화 로그 분석
- [ ] 연결 설계 문서 작성
        `,
        starterCode: `# Data Connection 설계

## 연결 정보
- Source Type:
- Connection Name:

## 테이블 목록
| 테이블 | Sync Mode | Schedule | 비고 |
|--------|-----------|----------|------|
| | | | |

## 보안 설정
- 인증 방식:
- SSL:
`,
        solutionCode: `# Data Connection 설계 예시

## 연결 정보
- Source Type: PostgreSQL
- Connection Name: erp_sales_connection

## 테이블 목록
| 테이블 | Sync Mode | Schedule | 비고 |
|--------|-----------|----------|------|
| orders | incremental | */6h | updated_at 기준 |
| customers | full | daily | 소규모 |
| products | full | daily | 마스터 데이터 |
| order_lines | incremental | */6h | order_id 참조 |

## 보안 설정
- 인증 방식: Vault (vault://secrets/erp)
- SSL: 필수
`
      }
    },
    {
      id: 'day1-quiz',
      type: 'quiz',
      title: 'Data Connection 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: '대용량 테이블에 권장되는 동기화 모드는?',
            options: ['Full Sync', 'Incremental Sync', 'Append Only', 'Manual'],
            answer: 1,
            explanation: 'Incremental Sync는 변경분만 처리하므로 대용량 테이블에 효율적입니다.'
          },
          {
            question: 'Cron "0 0 * * 1"의 의미는?',
            options: ['매시 정각', '매일 자정', '매주 월요일 자정', '매월 1일'],
            answer: 2,
            explanation: '마지막 필드 1은 월요일, 0 0은 자정을 의미합니다.'
          },
          {
            question: '권장되는 인증 방식은?',
            options: ['Username/Password', 'Vault Integration', 'SSH Key', 'Anonymous'],
            answer: 1,
            explanation: 'Vault Integration은 비밀을 중앙에서 안전하게 관리합니다.'
          }
        ]
      }
    },
    {
      id: 'day1-project',
      type: 'project',
      title: 'Data Connection 계획',
      duration: 25,
      content: {
        objectives: [
          '프로젝트에 필요한 Data Connection을 계획한다',
          '동기화 전략을 수립한다'
        ],
        requirements: [
          '**Data Connection 계획서**',
          '',
          '## 1. 필요한 데이터 소스',
          '| 소스 | 유형 | 우선순위 |',
          '|------|------|---------|',
          '| | | |',
          '',
          '## 2. 동기화 전략',
          '- Full vs Incremental 기준:',
          '- 스케줄 계획:',
          '',
          '## 3. 보안 고려사항',
          '- 인증 방식:',
          '- 네트워크 보안:'
        ],
        evaluationCriteria: [
          '데이터 소스 파악',
          '동기화 전략 적절성',
          '보안 고려'
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'pipeline-advanced',
  title: 'Pipeline Builder 고급 기능',
  totalDuration: 180,
  tasks: [
    {
      id: 'advanced-transforms',
      type: 'reading',
      title: '고급 변환 작업',
      duration: 45,
      content: {
        objectives: [
          '피벗, 언피벗, 윈도우 함수를 이해한다',
          '복잡한 조인 패턴을 파악한다',
          '조건부 로직을 적용한다'
        ],
        markdown: `
## 고급 변환 작업

### Pivot (피벗)

\`\`\`
행 → 열 변환

Before:
| date | category | amount |
|------|----------|--------|
| Jan  | A        | 100    |
| Jan  | B        | 200    |
| Feb  | A        | 150    |

After (Pivot on category):
| date | A   | B   |
|------|-----|-----|
| Jan  | 100 | 200 |
| Feb  | 150 | NULL|
\`\`\`

### Unpivot (언피벗)

\`\`\`
열 → 행 변환 (Pivot의 역)

Before:
| id | sales_q1 | sales_q2 |
|----|----------|----------|
| 1  | 100      | 150      |

After (Unpivot):
| id | quarter | sales |
|----|---------|-------|
| 1  | q1      | 100   |
| 1  | q2      | 150   |
\`\`\`

### Window Functions (윈도우 함수)

\`\`\`
용도: 행 그룹에 대한 계산

예시:
├── ROW_NUMBER(): 순번
├── RANK(): 순위
├── LAG/LEAD: 이전/다음 값
├── SUM OVER: 누적 합계
└── AVG OVER: 이동 평균

사용 예:
SELECT *,
  ROW_NUMBER() OVER (PARTITION BY category ORDER BY date) as row_num,
  SUM(amount) OVER (PARTITION BY category ORDER BY date) as running_total
FROM sales
\`\`\`

### 복잡한 조인 패턴

\`\`\`
1. Multi-way Join
   A → B → C (순차 조인)

2. Self Join
   A → A (자기 조인)
   예: 직원-관리자 관계

3. Cross Join with Filter
   A × B WHERE condition
   예: 날짜 범위 매핑

4. Anti Join
   A NOT IN B
   예: 누락 데이터 찾기
\`\`\`

### 조건부 로직

\`\`\`
CASE WHEN:
├── 단순 조건
│   CASE WHEN amount > 1000 THEN 'High' ELSE 'Low' END
│
└── 다중 조건
    CASE
      WHEN amount > 10000 THEN 'VIP'
      WHEN amount > 1000 THEN 'Premium'
      ELSE 'Standard'
    END
\`\`\`
        `,
        externalLinks: [
          { title: 'Advanced Transforms', url: 'https://learn.palantir.com/transforms-advanced' }
        ]
      }
    },
    {
      id: 'data-quality',
      type: 'reading',
      title: '데이터 품질 관리',
      duration: 35,
      content: {
        objectives: [
          '데이터 품질 규칙을 이해한다',
          '검증 및 알림 설정을 파악한다',
          '품질 모니터링 방법을 익힌다'
        ],
        markdown: `
## 데이터 품질 관리

### 품질 규칙 유형

\`\`\`
1. Completeness (완전성)
   └── NULL 비율 체크

2. Uniqueness (유일성)
   └── 중복 체크

3. Validity (유효성)
   └── 형식, 범위 체크

4. Consistency (일관성)
   └── 테이블 간 참조 무결성

5. Timeliness (적시성)
   └── 최신 데이터 여부
\`\`\`

### Pipeline Builder에서 품질 체크

\`\`\`
1. Filter 기반 검증
   ├── NULL 제거
   └── 유효하지 않은 값 제거

2. Aggregate 기반 검증
   ├── COUNT(*) vs COUNT(column)
   └── 중복 카운트

3. 기대값 설정
   ├── 예상 행 수
   └── 예상 NULL 비율
\`\`\`

### 알림 설정

\`\`\`
알림 조건:
├── 빌드 실패
├── 품질 임계값 초과
│   └── NULL > 5%
│   └── 중복 > 1%
├── 지연
│   └── 24시간 이상 미갱신
└── 이상 탐지
    └── 평소 대비 ±50%
\`\`\`

### 모니터링 대시보드

\`\`\`
주요 지표:
├── 데이터셋별 행 수 추이
├── NULL 비율 추이
├── 빌드 성공률
├── 평균 처리 시간
└── 이상치 발생 빈도
\`\`\`
        `,
        externalLinks: [
          { title: 'Data Quality', url: 'https://learn.palantir.com/data-quality' }
        ]
      }
    },
    {
      id: 'advanced-pipeline-exercise',
      type: 'code',
      title: '고급 Pipeline 실습',
      duration: 60,
      content: {
        objectives: [
          '고급 변환을 적용한다',
          '데이터 품질 체크를 구현한다',
          '복잡한 비즈니스 로직을 구현한다'
        ],
        instructions: `
## 고급 Pipeline 실습

### 시나리오
월별 카테고리별 매출 분석 파이프라인

### 요구사항

1. **데이터 정제**
   - NULL 처리
   - 중복 제거
   - 날짜 형식 변환

2. **고급 변환**
   - 피벗: 카테고리별 월간 매출
   - 윈도우: 월별 누적 합계
   - 조건: 성장률 계산

3. **품질 체크**
   - 예상 행 수 검증
   - NULL 비율 < 5%
   - 금액 양수 확인

### 단계별 구현

\`\`\`
1. Filter: status = 'completed', amount > 0
2. Transform: 날짜에서 연/월 추출
3. Aggregate: 카테고리, 월별 합계
4. Pivot: 카테고리를 열로
5. Window: 월별 누적 합계 추가
6. Output: 저장
\`\`\`

### 체크리스트

- [ ] NULL/중복 처리
- [ ] 피벗 적용
- [ ] 윈도우 함수 적용
- [ ] 품질 체크 구현
- [ ] 빌드 성공
        `,
        starterCode: `# 고급 Pipeline 설계

## 입력 데이터셋
-

## 변환 단계
1. 정제:
2. 집계:
3. 피벗:
4. 윈도우:

## 품질 규칙
- 규칙 1:
- 규칙 2:

## 출력
-
`,
        solutionCode: `# 고급 Pipeline 설계 예시

## 입력 데이터셋
- sales_transactions (일별 거래 데이터)

## 변환 단계
1. 정제: status='completed', amount>0, NULL 제거
2. 집계: SUM(amount) GROUP BY category, month
3. 피벗: 카테고리를 열로 (Electronics, Clothing, Food)
4. 윈도우: SUM() OVER (ORDER BY month) for 누적

## 품질 규칙
- NULL 비율 < 1%
- 행 수 > 0
- 모든 금액 >= 0

## 출력
- /curated/monthly_category_summary
`
      }
    },
    {
      id: 'day2-quiz',
      type: 'quiz',
      title: '고급 변환 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Pivot의 역할은?',
            options: ['열을 행으로', '행을 열로', '데이터 정렬', '중복 제거'],
            answer: 1,
            explanation: 'Pivot은 행 데이터를 열로 변환합니다. 카테고리별 집계 등에 사용됩니다.'
          },
          {
            question: 'LAG 윈도우 함수의 용도는?',
            options: ['다음 행 값 참조', '이전 행 값 참조', '순위 계산', '누적 합계'],
            answer: 1,
            explanation: 'LAG는 이전 행의 값을 참조합니다. 전월 대비 비교 등에 사용됩니다.'
          },
          {
            question: 'Anti Join은 언제 사용하는가?',
            options: ['모든 행 결합', '매칭되지 않는 행 찾기', '중복 행 찾기', '순서 정렬'],
            answer: 1,
            explanation: 'Anti Join은 조건에 매칭되지 않는 행을 찾습니다. 누락 데이터 확인에 유용합니다.'
          }
        ]
      }
    },
    {
      id: 'day2-project',
      type: 'project',
      title: '데이터 품질 계획',
      duration: 25,
      content: {
        objectives: [
          '프로젝트의 데이터 품질 전략을 수립한다',
          '품질 규칙과 알림을 정의한다'
        ],
        requirements: [
          '**데이터 품질 계획서**',
          '',
          '## 1. 품질 규칙',
          '| 데이터셋 | 규칙 | 임계값 |',
          '|---------|------|--------|',
          '| | | |',
          '',
          '## 2. 알림 설정',
          '- 알림 조건:',
          '- 수신자:',
          '',
          '## 3. 모니터링',
          '- 대시보드:',
          '- 리뷰 주기:'
        ],
        evaluationCriteria: [
          '품질 규칙 완성도',
          '알림 설정 적절성',
          '모니터링 계획'
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'scheduling-optimization',
  title: '스케줄링 & 최적화',
  totalDuration: 180,
  tasks: [
    {
      id: 'build-scheduling',
      type: 'reading',
      title: '빌드 스케줄링',
      duration: 40,
      content: {
        objectives: [
          '빌드 스케줄링 옵션을 이해한다',
          '의존성 관리를 파악한다',
          '최적 스케줄을 설계한다'
        ],
        markdown: `
## 빌드 스케줄링

### 스케줄링 옵션

\`\`\`
1. Manual (수동)
   └── 필요시 직접 실행

2. Scheduled (정기)
   └── Cron 표현식 기반

3. Event-driven (이벤트)
   └── 업스트림 변경 시 자동

4. Hybrid (혼합)
   └── 정기 + 이벤트 조합
\`\`\`

### 의존성 관리

\`\`\`
DAG (Directed Acyclic Graph):

Source A ──┐
           ├──→ Transform 1 ──→ Output 1
Source B ──┘                        │
                                    ▼
Source C ──────→ Transform 2 ──→ Output 2

빌드 순서:
1. Source A, B, C 동기화
2. Transform 1 (A, B 완료 후)
3. Transform 2 (C, Output 1 완료 후)
4. Output 2
\`\`\`

### 최적 스케줄 설계

\`\`\`
고려사항:

1. 데이터 신선도 요구
   ├── 실시간: 분 단위
   ├── Near real-time: 시간 단위
   └── Batch: 일 단위

2. 리소스 제약
   ├── 피크 시간 피하기
   └── 병렬 처리 제한

3. 비용
   ├── 클라우드 비용
   └── API 호출 비용

4. 의존성
   ├── 업스트림 완료 보장
   └── 적절한 버퍼 시간
\`\`\`

### 예시 스케줄

\`\`\`
[데이터 파이프라인 스케줄 예시]

00:00 - Source 동기화 (Full)
02:00 - Raw → Staging 변환
03:00 - Staging → Curated 변환
04:00 - Ontology 백킹 갱신
05:00 - 품질 검증 리포트
06:00 - 사용자 접근 가능
\`\`\`
        `,
        externalLinks: [
          { title: 'Build Scheduling', url: 'https://learn.palantir.com/builds' }
        ]
      }
    },
    {
      id: 'performance-optimization',
      type: 'reading',
      title: '성능 최적화',
      duration: 45,
      content: {
        objectives: [
          '파이프라인 성능 튜닝 방법을 이해한다',
          '파티셔닝과 캐싱을 파악한다',
          '병목 현상을 식별하고 해결한다'
        ],
        markdown: `
## 성능 최적화

### 파티셔닝

\`\`\`
용도: 대용량 데이터 분할

파티션 키 선택:
├── 날짜 (가장 일반적)
├── 지역/국가
└── 카테고리

예시:
/dataset/year=2024/month=01/day=15/data.parquet

장점:
├── 쿼리 성능 향상 (파티션 프루닝)
├── 병렬 처리 가능
└── 증분 처리 용이
\`\`\`

### 캐싱

\`\`\`
레벨:
├── 중간 결과 캐싱
├── 최종 결과 캐싱
└── 메타데이터 캐싱

권장 사항:
├── 자주 사용되는 조인 결과 캐싱
├── 비용 높은 집계 결과 캐싱
└── 캐시 무효화 전략 필요
\`\`\`

### 병목 현상 식별

\`\`\`
증상 & 해결:

1. 느린 조인
   ├── 증상: 조인 단계 장시간
   ├── 원인: 큰 테이블 전체 스캔
   └── 해결: 조인 전 필터, 파티셔닝

2. 메모리 부족
   ├── 증상: OOM 에러
   ├── 원인: 큰 shuffle, 비효율 집계
   └── 해결: 리파티셔닝, 2단계 집계

3. 느린 I/O
   ├── 증상: 읽기/쓰기 느림
   ├── 원인: 작은 파일 많음
   └── 해결: 파일 병합, Parquet 사용

4. 스케줄 지연
   ├── 증상: 예정 시간 초과
   ├── 원인: 업스트림 지연
   └── 해결: 버퍼 시간, 병렬 처리
\`\`\`

### 최적화 체크리스트

\`\`\`
□ Filter를 가능한 먼저 적용
□ 필요한 컬럼만 Select
□ 적절한 파티셔닝 적용
□ 조인 키 인덱싱
□ 불필요한 중간 데이터셋 제거
□ 캐싱 활용
□ 모니터링 설정
\`\`\`
        `,
        externalLinks: [
          { title: 'Performance Guide', url: 'https://learn.palantir.com/performance' }
        ]
      }
    },
    {
      id: 'optimization-exercise',
      type: 'code',
      title: '최적화 실습',
      duration: 55,
      content: {
        objectives: [
          '느린 파이프라인을 분석한다',
          '최적화 기법을 적용한다',
          '성능 개선을 측정한다'
        ],
        instructions: `
## 최적화 실습

### 시나리오
기존 파이프라인의 성능 개선

### 문제 상황

\`\`\`
Before:
├── 실행 시간: 45분
├── 처리 데이터: 10M rows
├── 문제: 조인 단계에서 대부분 시간 소요
\`\`\`

### 최적화 단계

1. **분석**
   - 각 단계별 시간 측정
   - 병목 식별

2. **최적화 적용**
   - 조인 전 필터 추가
   - 필요 컬럼만 선택
   - 파티셔닝 적용

3. **측정**
   - 실행 시간 비교
   - 리소스 사용량 비교

### 체크리스트

- [ ] 병목 식별
- [ ] 최적화 적용
- [ ] 성능 측정
- [ ] 문서화
        `,
        starterCode: `# 최적화 분석

## 현재 상태
- 실행 시간:
- 처리 데이터:
- 병목 지점:

## 최적화 계획
1.
2.
3.

## 예상 개선
- 목표 시간:
`,
        solutionCode: `# 최적화 분석 예시

## 현재 상태
- 실행 시간: 45분
- 처리 데이터: 10M rows
- 병목 지점: 조인 (35분), 집계 (8분)

## 최적화 계획
1. 조인 전 날짜 필터 추가 (최근 30일만)
2. 조인 키에 파티셔닝 적용
3. 필요한 컬럼만 Select

## 예상 개선
- 목표 시간: 15분 (70% 개선)
- 실제 결과: 12분 (73% 개선) ✅
`
      }
    },
    {
      id: 'day3-quiz',
      type: 'quiz',
      title: '스케줄링 & 최적화 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: '파티셔닝의 주요 장점은?',
            options: ['보안 강화', '쿼리 성능 향상', '저장 공간 절약', '권한 관리'],
            answer: 1,
            explanation: '파티셔닝은 파티션 프루닝을 통해 쿼리 성능을 향상시킵니다.'
          },
          {
            question: '가장 빠른 성능 최적화 방법은?',
            options: ['더 많은 서버', '가능한 먼저 Filter', '복잡한 알고리즘', '더 큰 메모리'],
            answer: 1,
            explanation: 'Filter를 먼저 적용하면 처리할 데이터 양이 줄어 가장 효과적입니다.'
          },
          {
            question: 'OOM 에러의 일반적 해결 방법은?',
            options: ['재시도', '리파티셔닝', '대기', '무시'],
            answer: 1,
            explanation: 'OOM은 메모리 부족으로, 리파티셔닝이나 2단계 집계로 해결합니다.'
          }
        ]
      }
    },
    {
      id: 'day3-project',
      type: 'project',
      title: '파이프라인 스케줄 설계',
      duration: 25,
      content: {
        objectives: [
          '프로젝트의 파이프라인 스케줄을 설계한다',
          '의존성과 최적화를 고려한다'
        ],
        requirements: [
          '**파이프라인 스케줄 설계서**',
          '',
          '## 1. 스케줄 개요',
          '```',
          '[타임라인 다이어그램]',
          '```',
          '',
          '## 2. 단계별 스케줄',
          '| 단계 | 시작 | 예상 소요 | 의존성 |',
          '|------|------|----------|--------|',
          '| | | | |',
          '',
          '## 3. 최적화 전략',
          '- 파티셔닝:',
          '- 캐싱:',
          '- 병렬화:'
        ],
        evaluationCriteria: [
          '스케줄 완성도',
          '의존성 관리',
          '최적화 전략'
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'pipeline-project',
  title: 'Pipeline 프로젝트',
  totalDuration: 180,
  tasks: [
    {
      id: 'complex-pipeline-project',
      type: 'project',
      title: '복합 파이프라인 프로젝트',
      duration: 120,
      content: {
        objectives: [
          '실제 비즈니스 시나리오의 파이프라인을 구축한다',
          '학습한 모든 기능을 종합 적용한다',
          '프로덕션 수준의 파이프라인을 설계한다'
        ],
        requirements: [
          '**복합 파이프라인 프로젝트**',
          '',
          '## 요구사항',
          '',
          '1. **데이터 수집**',
          '   - 3개 이상의 소스 데이터셋',
          '   - 동기화 전략 정의',
          '',
          '2. **데이터 정제**',
          '   - NULL/중복 처리',
          '   - 데이터 타입 변환',
          '   - 유효성 검증',
          '',
          '3. **고급 변환**',
          '   - 복수 조인',
          '   - 집계 및 피벗',
          '   - 윈도우 함수',
          '',
          '4. **품질 관리**',
          '   - 품질 규칙 정의',
          '   - 알림 설정',
          '',
          '5. **스케줄링**',
          '   - 자동화된 실행',
          '   - 의존성 관리',
          '',
          '## 산출물',
          '- [ ] 파이프라인 (빌드 성공)',
          '- [ ] 품질 규칙',
          '- [ ] 스케줄 설정',
          '- [ ] 문서'
        ],
        evaluationCriteria: [
          '파이프라인 완성도 (40%)',
          '고급 기능 활용 (25%)',
          '품질 관리 (20%)',
          '문서화 (15%)'
        ],
        bonusPoints: [
          '5개 이상 데이터셋 활용',
          '모니터링 대시보드',
          '에러 처리 및 알림'
        ]
      }
    },
    {
      id: 'pipeline-documentation',
      type: 'project',
      title: '파이프라인 문서화',
      duration: 45,
      content: {
        objectives: [
          '파이프라인을 완전히 문서화한다',
          '유지보수 가이드를 작성한다'
        ],
        requirements: [
          '**파이프라인 문서**',
          '',
          '## 1. 개요',
          '- 목적:',
          '- 입력:',
          '- 출력:',
          '',
          '## 2. 아키텍처',
          '```',
          '[파이프라인 다이어그램]',
          '```',
          '',
          '## 3. 변환 로직',
          '| 단계 | 입력 | 변환 | 출력 |',
          '|------|------|------|------|',
          '| | | | |',
          '',
          '## 4. 품질 규칙',
          '| 규칙 | 대상 | 임계값 |',
          '|------|------|--------|',
          '| | | |',
          '',
          '## 5. 운영 가이드',
          '- 스케줄:',
          '- 모니터링:',
          '- 문제 해결:'
        ],
        evaluationCriteria: [
          '문서 완성도',
          '명확성',
          '운영 정보 포함'
        ]
      }
    },
    {
      id: 'day4-review',
      type: 'quiz',
      title: 'Pipeline 종합 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: '프로덕션 파이프라인에 가장 중요한 것은?',
            options: ['빠른 속도', '안정성과 모니터링', '복잡한 로직', '많은 데이터셋'],
            answer: 1,
            explanation: '프로덕션 환경에서는 안정성과 모니터링이 가장 중요합니다.'
          },
          {
            question: '파이프라인 문서에 반드시 포함해야 하는 것은?',
            options: ['코드 전체', '입출력 및 변환 로직', '개발자 이력', '회의 기록'],
            answer: 1,
            explanation: '파이프라인 문서에는 입출력, 변환 로직, 스케줄, 품질 규칙이 포함되어야 합니다.'
          }
        ]
      }
    }
  ]
}

const day5: Day = {
  slug: 'week3-checkpoint',
  title: 'Week 3 체크포인트',
  totalDuration: 180,
  tasks: [
    {
      id: 'week3-review',
      type: 'project',
      title: 'Week 3 종합 리뷰',
      duration: 90,
      content: {
        objectives: [
          'Week 3 학습 내용을 정리한다',
          '파이프라인 프로젝트를 최종 점검한다',
          'Data Engineer 자격증 준비 상태를 확인한다'
        ],
        requirements: [
          '**Week 3 종합 리뷰**',
          '',
          '## 1. 학습 요약',
          '',
          '### Data Connection',
          '- 핵심 개념:',
          '- 실습 완료:',
          '',
          '### 고급 변환',
          '- 핵심 개념:',
          '- 실습 완료:',
          '',
          '### 최적화',
          '- 핵심 개념:',
          '- 실습 완료:',
          '',
          '## 2. 프로젝트 결과',
          '- 완성도:',
          '- 개선 사항:',
          '',
          '## 3. 자격증 준비',
          '- 학습 진도:',
          '- 부족한 영역:'
        ],
        evaluationCriteria: [
          '학습 정리',
          '프로젝트 완성',
          '자격증 준비'
        ]
      }
    },
    {
      id: 'week3-checkpoint-challenge',
      type: 'challenge',
      title: 'Week 3 체크포인트',
      duration: 90,
      content: {
        objectives: [
          'Week 3 산출물을 점검한다',
          'Week 4 계획을 확정한다'
        ],
        requirements: [
          '**Week 3 산출물 체크리스트**',
          '',
          '□ Data Connection 설계',
          '□ 고급 Pipeline (피벗, 윈도우)',
          '□ 품질 규칙 설정',
          '□ 스케줄 설정',
          '□ **복합 파이프라인 프로젝트**',
          '□ 파이프라인 문서',
          '',
          '**Week 4 계획: Code Transforms**',
          '',
          '- Python/PySpark 트랜스폼',
          '- 테스트 작성',
          '- CI/CD 설정'
        ],
        evaluationCriteria: [
          '산출물 완성도',
          '문서화 품질',
          'Week 4 계획'
        ]
      }
    }
  ]
}

export const foundryPipelineWeek: Week = {
  slug: 'foundry-pipeline',
  week: 3,
  phase: 7,
  month: 13,
  access: 'pro',
  title: 'Pipeline Builder 심화',
  topics: ['Data Connection', 'Advanced Transforms', 'Data Quality', 'Scheduling', 'Optimization'],
  practice: '복합 파이프라인 프로젝트',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
