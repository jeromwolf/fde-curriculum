// Phase 6, Week 1: 산업 도메인 선택 & 리서치
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'domain-overview',
  title: '산업 도메인 개요',
  totalDuration: 180,
  tasks: [
    {
      id: 'domain-intro-reading',
      type: 'reading',
      title: 'FDE와 산업 도메인 전문성',
      duration: 30,
      content: {
        objectives: [
          'FDE에게 도메인 전문성이 왜 중요한지 이해한다',
          '3개 핵심 산업 도메인의 특성을 파악한다',
          '자신에게 맞는 도메인 선택 기준을 수립한다'
        ],
        markdown: `
## FDE와 도메인 전문성

### Forward Deployed Engineer의 핵심 역량

\`\`\`
FDE = 기술 역량 + 도메인 전문성 + 문제 해결 능력
      (Phase 1-5)   (Phase 6)      (전 과정)
\`\`\`

Palantir FDE들이 성공하는 이유:
- 고객의 비즈니스를 깊이 이해
- 기술을 도메인 문제에 맞게 적용
- "데이터 엔지니어"가 아닌 "문제 해결사"

### 3대 핵심 산업 도메인

| 도메인 | 시장 규모 | 핵심 데이터 | 주요 기회 |
|--------|----------|------------|----------|
| **금융** | $12.5조 (글로벌) | 거래, 리스크, 규제 | 사기 탐지, 자동화 |
| **헬스케어** | $8.3조 | 임상, 유전체, 영상 | AI 진단, 신약 개발 |
| **제조** | $16조 | IoT, 생산, 품질 | 예측 정비, 최적화 |

### 도메인 선택 가이드

\`\`\`
자기 진단 질문:

1. 어떤 문제에 관심이 있는가?
   - 돈과 투자 → 금융
   - 건강과 생명 → 헬스케어
   - 만들기와 최적화 → 제조

2. 어떤 데이터에 익숙한가?
   - 정형 데이터, 실시간 → 금융
   - 비정형, 의료 용어 → 헬스케어
   - 시계열, 센서 → 제조

3. 어떤 커리어를 원하는가?
   - 핀테크, 퀀트 → 금융
   - 디지털 헬스케어 → 헬스케어
   - 스마트 팩토리 → 제조
\`\`\`

### 도메인별 취업 시장

**금융**:
- 국내: KB, 신한, 삼성증권, 토스, 카카오페이
- 글로벌: Goldman, JPMorgan, Two Sigma

**헬스케어**:
- 국내: 삼성서울병원, 뷰노, 루닛
- 글로벌: Epic, Tempus, Flatiron

**제조**:
- 국내: 삼성, LG, 현대, 포스코
- 글로벌: Siemens, GE, Rockwell
        `,
        externalLinks: [
          { title: 'Palantir FDE 채용 공고', url: 'https://www.palantir.com/careers/' },
          { title: 'FDE 역할 설명 (Medium)', url: 'https://medium.com/palantir/what-is-a-forward-deployed-engineer-6e5ddf21c46d' }
        ]
      }
    },
    {
      id: 'finance-domain-overview',
      type: 'reading',
      title: '금융 도메인 개요',
      duration: 40,
      content: {
        objectives: [
          '금융 산업의 데이터 특성을 이해한다',
          'FIBO 온톨로지의 구조를 파악한다',
          '주요 금융 데이터 소스를 알아본다'
        ],
        markdown: `
## 금융 도메인 심화

### 금융 데이터 생태계

\`\`\`
┌─────────────────────────────────────────────────────┐
│                금융 데이터 흐름                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [시장 데이터]          [거래 데이터]                 │
│  ├── 주가/지수          ├── 주문/체결                │
│  ├── 호가               ├── 포지션                   │
│  └── 뉴스/공시          └── 결제                     │
│         │                      │                     │
│         └──────────┬───────────┘                     │
│                    ▼                                 │
│            [분석 시스템]                              │
│            ├── 리스크 관리                           │
│            ├── 포트폴리오 최적화                     │
│            └── 규제 보고                             │
│                    │                                 │
│                    ▼                                 │
│            [Knowledge Graph]                         │
│            ├── 기업 관계                             │
│            ├── 이벤트 영향                           │
│            └── 투자 인사이트                         │
│                                                      │
└─────────────────────────────────────────────────────┘
\`\`\`

### FIBO (Financial Industry Business Ontology)

금융 산업 표준 온톨로지 - EDM Council에서 관리

\`\`\`
FIBO 구조:
├── FND (Foundations) - 기초 개념
├── BE (Business Entities) - 법인, 조직
├── FBC (Financial Business & Commerce) - 금융 거래
├── SEC (Securities) - 증권
├── DER (Derivatives) - 파생상품
├── LOAN (Loans) - 대출
├── IND (Indices & Indicators) - 지수
├── MD (Market Data) - 시장 데이터
└── CAE (Corporate Actions & Events) - 기업 이벤트
\`\`\`

**FIBO 클래스 예시**:
\`\`\`turtle
# 주식 정의
fibo-sec:Equity a owl:Class ;
    rdfs:subClassOf fibo-fbc:FinancialInstrument ;
    rdfs:label "Equity"@en .

# 기업 정의
fibo-be:Corporation a owl:Class ;
    rdfs:subClassOf fibo-be:LegalEntity ;
    rdfs:label "Corporation"@en .
\`\`\`

### 주요 GitHub 레퍼런스

| 레포지토리 | 설명 | 스타 |
|-----------|------|------|
| [edmcouncil/fibo](https://github.com/edmcouncil/fibo) | FIBO 온톨로지 공식 레포 | 300+ |
| [ranaroussi/yfinance](https://github.com/ranaroussi/yfinance) | Yahoo Finance 파이썬 래퍼 | 12k+ |
| [mrjbq7/ta-lib](https://github.com/mrjbq7/ta-lib) | 기술적 분석 라이브러리 | 9k+ |
| [AI4Finance-Foundation/FinRL](https://github.com/AI4Finance-Foundation/FinRL) | 강화학습 금융 트레이딩 | 9k+ |
| [OpenBB-finance/OpenBB](https://github.com/OpenBB-finance/OpenBB) | 오픈소스 투자 리서치 | 27k+ |
| [microsoft/finBERT](https://github.com/yiyanghkust/finBERT) | 금융 특화 BERT | 2k+ |

### 무료 데이터 소스

**실시간 시장 데이터**:
- [Yahoo Finance API](https://pypi.org/project/yfinance/) - 주가, 재무제표
- [Alpha Vantage](https://www.alphavantage.co/) - 무료 API (500회/일)
- [Finnhub](https://finnhub.io/) - 실시간 데이터

**한국 금융 데이터**:
- [KRX 정보데이터시스템](http://data.krx.co.kr/) - 거래소 데이터
- [DART API](https://opendart.fss.or.kr/) - 공시 정보
- [한국은행 API](https://ecos.bok.or.kr/) - 경제 지표

**뉴스 & 감성 분석**:
- [네이버 뉴스 API](https://developers.naver.com/docs/search/news/)
- [Financial News API](https://newsapi.org/)
        `,
        externalLinks: [
          { title: 'FIBO GitHub (공식)', url: 'https://github.com/edmcouncil/fibo' },
          { title: 'FIBO 브라우저', url: 'https://spec.edmcouncil.org/fibo/' },
          { title: 'OpenBB Terminal', url: 'https://github.com/OpenBB-finance/OpenBB' },
          { title: 'FinRL 강화학습', url: 'https://github.com/AI4Finance-Foundation/FinRL' }
        ]
      }
    },
    {
      id: 'healthcare-domain-overview',
      type: 'reading',
      title: '헬스케어 도메인 개요',
      duration: 40,
      content: {
        objectives: [
          '헬스케어 데이터의 특수성을 이해한다',
          'FHIR 표준과 주요 리소스를 파악한다',
          '의료 AI 프로젝트의 윤리적 고려사항을 알아본다'
        ],
        markdown: `
## 헬스케어 도메인 심화

### 헬스케어 데이터 특성

\`\`\`
헬스케어 데이터의 5가지 특징:

1. 민감성 (Sensitivity)
   - 개인 건강 정보 = 최고 수준 보호 필요
   - HIPAA, GDPR, 개인정보보호법 준수

2. 복잡성 (Complexity)
   - 다양한 데이터 유형 (정형, 비정형, 영상, 유전체)
   - 의료 용어 체계 (SNOMED-CT, ICD-10)

3. 상호운용성 (Interoperability)
   - 다양한 EMR 시스템 간 데이터 교환
   - FHIR 표준의 중요성

4. 정확성 요구 (Accuracy)
   - 생명과 직결 → 높은 정확도 필수
   - AI 진단 보조 시 규제 고려

5. 시간 민감성 (Time-sensitivity)
   - 응급 상황 → 실시간 처리 필요
\`\`\`

### FHIR (Fast Healthcare Interoperability Resources)

HL7에서 개발한 의료 데이터 교환 표준

\`\`\`
FHIR 핵심 리소스:

[환자 중심]
├── Patient - 환자 정보
├── Encounter - 진료 기록
├── Condition - 진단/상태
└── Observation - 검사 결과

[임상 데이터]
├── DiagnosticReport - 진단 리포트
├── Procedure - 시술/수술
├── MedicationRequest - 처방
└── Immunization - 예방접종

[관리 데이터]
├── Organization - 의료 기관
├── Practitioner - 의료진
└── Location - 위치 정보
\`\`\`

**FHIR JSON 예시**:
\`\`\`json
{
  "resourceType": "Patient",
  "id": "example",
  "name": [{
    "family": "김",
    "given": ["철수"]
  }],
  "gender": "male",
  "birthDate": "1990-01-15"
}
\`\`\`

### 주요 GitHub 레퍼런스

| 레포지토리 | 설명 | 스타 |
|-----------|------|------|
| [synthetichealth/synthea](https://github.com/synthetichealth/synthea) | 합성 환자 데이터 생성 | 2k+ |
| [smart-on-fhir/client-py](https://github.com/smart-on-fhir/client-py) | FHIR Python 클라이언트 | 500+ |
| [Microsoft/FHIR-Server](https://github.com/microsoft/fhir-server) | MS FHIR 서버 | 1k+ |
| [google/fhir](https://github.com/google/fhir) | Google FHIR 도구 | 800+ |
| [huggingface/BioBERT](https://github.com/dmis-lab/biobert) | 바이오 특화 BERT | 1.5k+ |
| [allenai/scispacy](https://github.com/allenai/scispacy) | 과학/의학 NLP | 1.6k+ |
| [PrimeKG](https://github.com/mims-harvard/PrimeKG) | 의학 Knowledge Graph | 500+ |

### 공개 데이터셋

**합성 데이터** (실습용):
- [Synthea](https://syntheticmass.mitre.org/) - 합성 환자 데이터
- [MIMIC-IV](https://mimic.mit.edu/) - MIT 중환자 데이터 (신청 필요)

**의학 지식 베이스**:
- [PubMed](https://pubmed.ncbi.nlm.nih.gov/) - 의학 논문 (3천만+)
- [SNOMED CT](https://browser.ihtsdotools.org/) - 의학 용어 표준
- [RxNorm](https://www.nlm.nih.gov/research/umls/rxnorm/) - 약물 데이터

**유전체 데이터**:
- [Gene Ontology](http://geneontology.org/) - 유전자 기능 분류
- [UniProt](https://www.uniprot.org/) - 단백질 데이터베이스

### 윤리적 고려사항

\`\`\`
의료 AI 프로젝트 체크리스트:

□ 데이터 익명화/가명화 완료
□ IRB (연구윤리심의) 승인 (실제 데이터 사용 시)
□ 모델 편향성 검토 (인종, 성별, 연령)
□ 설명 가능성 (Explainability) 고려
□ 사용 목적 명확화 (진단 보조 vs 자동 진단)
\`\`\`
        `,
        externalLinks: [
          { title: 'FHIR 공식 문서', url: 'https://www.hl7.org/fhir/' },
          { title: 'Synthea 합성 데이터', url: 'https://github.com/synthetichealth/synthea' },
          { title: 'PrimeKG 의학 KG', url: 'https://github.com/mims-harvard/PrimeKG' },
          { title: 'BioBERT', url: 'https://github.com/dmis-lab/biobert' }
        ]
      }
    },
    {
      id: 'manufacturing-domain-overview',
      type: 'reading',
      title: '제조 도메인 개요',
      duration: 40,
      content: {
        objectives: [
          '제조 IoT 데이터의 특성을 이해한다',
          'Digital Twin 개념을 파악한다',
          '예측 정비 시스템의 원리를 알아본다'
        ],
        markdown: `
## 제조 도메인 심화

### 스마트 제조 (Industry 4.0)

\`\`\`
스마트 팩토리 데이터 흐름:

[센서 레이어]
├── 온도, 압력, 진동 센서
├── PLC (Programmable Logic Controller)
└── SCADA 시스템
        │
        ▼
[Edge 레이어]
├── 데이터 전처리
├── 실시간 이상 탐지
└── 로컬 저장
        │
        ▼
[클라우드 레이어]
├── 시계열 DB (TimescaleDB, InfluxDB)
├── 분석 엔진 (Spark, Flink)
└── AI/ML 모델
        │
        ▼
[애플리케이션 레이어]
├── Digital Twin 시각화
├── 예측 정비 대시보드
└── 품질 관리 시스템
\`\`\`

### 핵심 기술 표준

**OPC-UA (Open Platform Communications Unified Architecture)**:
- 산업 통신 표준
- 보안, 신뢰성 내장
- 플랫폼 독립적

**ISA-95 (제조 통합 표준)**:
\`\`\`
ISA-95 레벨:
├── Level 4: 비즈니스 계획 (ERP)
├── Level 3: 제조 운영 관리 (MES)
├── Level 2: 감시 제어 (SCADA)
├── Level 1: 센싱 & 제어 (PLC)
└── Level 0: 물리적 프로세스
\`\`\`

### Digital Twin

\`\`\`
Digital Twin 구성요소:

[Physical Twin]  ←──────→  [Digital Twin]
    │                           │
    │  센서 데이터               │  시뮬레이션
    │  상태 정보                 │  예측 모델
    │  이벤트                    │  최적화
    │                           │
    └───────── 실시간 동기화 ─────┘
\`\`\`

**Digital Twin 활용 사례**:
- 설비 상태 모니터링
- 시뮬레이션 기반 최적화
- 예측 정비 (Predictive Maintenance)
- 가상 커미셔닝 (Virtual Commissioning)

### 주요 GitHub 레퍼런스

| 레포지토리 | 설명 | 스타 |
|-----------|------|------|
| [Azure/azure-digital-twins](https://github.com/Azure/azure-digital-twins-graph-viewer) | Azure Digital Twins | 200+ |
| [eclipse/ditto](https://github.com/eclipse/ditto) | 오픈소스 Digital Twin | 500+ |
| [influxdata/influxdb](https://github.com/influxdata/influxdb) | 시계열 DB | 28k+ |
| [timescale/timescaledb](https://github.com/timescale/timescaledb) | PostgreSQL 시계열 확장 | 17k+ |
| [apache/kafka](https://github.com/apache/kafka) | 스트리밍 플랫폼 | 27k+ |
| [apache/flink](https://github.com/apache/flink) | 스트림 처리 | 23k+ |
| [alibaba/ilogtail](https://github.com/alibaba/ilogtail) | 로그 수집기 | 1.5k+ |

### 공개 데이터셋

**예측 정비 데이터**:
- [NASA Turbofan Engine](https://data.nasa.gov/dataset/C-MAPSS-Aircraft-Engine-Simulator-Data/xaut-bemq) - 터보팬 엔진 열화
- [SECOM Manufacturing](https://archive.ics.uci.edu/ml/datasets/secom) - 반도체 품질

**IoT 센서 데이터**:
- [Bosch Production Line](https://www.kaggle.com/c/bosch-production-line-performance) - 생산 라인
- [Pump Sensor Data](https://www.kaggle.com/datasets/nphantawee/pump-sensor-data) - 펌프 센서

### 예측 정비 (Predictive Maintenance)

\`\`\`python
# 예측 정비 파이프라인 예시

# 1. 데이터 수집
sensor_data = collect_from_opcua(server_url)

# 2. 특징 추출
features = extract_features(
    sensor_data,
    window_size='1h',
    features=['mean', 'std', 'fft_peak']
)

# 3. 이상 탐지
anomaly_model = IsolationForest(contamination=0.01)
anomalies = anomaly_model.predict(features)

# 4. 잔여 수명 예측 (RUL)
rul_model = LSTMRegressor()
remaining_life = rul_model.predict(features)

# 5. 알림 생성
if remaining_life < threshold:
    send_maintenance_alert()
\`\`\`
        `,
        externalLinks: [
          { title: 'Eclipse Ditto (Digital Twin)', url: 'https://github.com/eclipse/ditto' },
          { title: 'TimescaleDB', url: 'https://github.com/timescale/timescaledb' },
          { title: 'Apache Flink', url: 'https://github.com/apache/flink' },
          { title: 'NASA Turbofan Dataset', url: 'https://data.nasa.gov/dataset/C-MAPSS-Aircraft-Engine-Simulator-Data/xaut-bemq' }
        ]
      }
    },
    {
      id: 'domain-comparison-quiz',
      type: 'quiz',
      title: '도메인 비교 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: 'FIBO (Financial Industry Business Ontology)는 어떤 조직에서 관리하는가?',
            options: ['ISO', 'EDM Council', 'HL7', 'OPC Foundation'],
            answer: 1,
            explanation: 'FIBO는 Enterprise Data Management (EDM) Council에서 관리하는 금융 산업 표준 온톨로지입니다.'
          },
          {
            question: 'FHIR 표준에서 환자의 진단 정보를 나타내는 리소스는?',
            options: ['Patient', 'Observation', 'Condition', 'Encounter'],
            answer: 2,
            explanation: 'Condition 리소스는 환자의 진단, 질병, 건강 상태를 나타냅니다. Observation은 검사 결과입니다.'
          },
          {
            question: '제조 분야에서 Digital Twin의 주요 목적이 아닌 것은?',
            options: ['실시간 모니터링', '예측 정비', '데이터 익명화', '시뮬레이션 최적화'],
            answer: 2,
            explanation: '데이터 익명화는 헬스케어 분야의 개인정보 보호 요구사항입니다. Digital Twin은 실시간 모니터링, 예측 정비, 시뮬레이션에 활용됩니다.'
          },
          {
            question: '합성 환자 데이터를 생성하는 도구는?',
            options: ['FIBO', 'Synthea', 'OPC-UA', 'SCADA'],
            answer: 1,
            explanation: 'Synthea는 MITRE에서 개발한 합성 환자 데이터 생성 도구입니다. 실제 환자 데이터 없이 헬스케어 시스템을 개발/테스트할 수 있습니다.'
          },
          {
            question: 'ISA-95에서 ERP 시스템이 속하는 레벨은?',
            options: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
            answer: 3,
            explanation: 'ISA-95에서 Level 4는 비즈니스 계획 및 로지스틱스 레벨로, ERP 시스템이 여기에 속합니다.'
          }
        ]
      }
    },
    {
      id: 'domain-selection-project',
      type: 'project',
      title: '도메인 선택 & 초기 리서치',
      duration: 15,
      content: {
        objectives: [
          '3개 도메인 중 캡스톤 프로젝트 도메인을 선택한다',
          '선택 근거를 문서화한다',
          '초기 리서치 계획을 수립한다'
        ],
        requirements: [
          '**Day 1 산출물**',
          '',
          '1. **도메인 선택 문서** (1페이지)',
          '   - 선택한 도메인: [금융 / 헬스케어 / 제조]',
          '   - 선택 이유 (3가지 이상)',
          '   - 관심 있는 구체적 문제',
          '   - 기존 경험/지식과의 연관성',
          '',
          '2. **초기 리서치 계획**',
          '   - 학습할 표준/온톨로지',
          '   - 확보할 데이터 소스',
          '   - 참고할 GitHub 프로젝트 (3개 이상)',
          '   - Day 2-4 학습 계획'
        ],
        evaluationCriteria: [
          '도메인 선택의 논리성',
          '리서치 계획의 구체성',
          '실현 가능성 고려'
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'domain-deep-dive-1',
  title: '도메인 심화 학습 (1)',
  totalDuration: 180,
  tasks: [
    {
      id: 'ontology-standards-reading',
      type: 'reading',
      title: '도메인별 온톨로지 & 표준 심화',
      duration: 60,
      content: {
        objectives: [
          '선택한 도메인의 핵심 온톨로지를 심층 학습한다',
          '실제 프로젝트에서의 활용 방법을 파악한다',
          '온톨로지 기반 데이터 모델링을 실습한다'
        ],
        markdown: `
## 도메인별 온톨로지 심화

### 금융: FIBO 상세 구조

\`\`\`turtle
# FIBO 핵심 클래스 계층

owl:Thing
├── fibo-fnd:IndependentThing
│   ├── fibo-fnd:Agreement
│   │   └── fibo-fbc:Contract
│   │       └── fibo-sec:FinancialInstrumentContract
│   │           ├── fibo-sec:EquityInstrument
│   │           └── fibo-der:DerivativeContract
│   │
│   ├── fibo-be:LegalEntity
│   │   ├── fibo-be:Corporation
│   │   └── fibo-be:GovernmentBody
│   │
│   └── fibo-fnd:Event
│       └── fibo-cae:CorporateAction
│           ├── fibo-cae:Dividend
│           └── fibo-cae:StockSplit
\`\`\`

**FIBO SPARQL 예시**:
\`\`\`sparql
PREFIX fibo-be: <https://spec.edmcouncil.org/fibo/ontology/BE/>
PREFIX fibo-sec: <https://spec.edmcouncil.org/fibo/ontology/SEC/>

# 특정 기업이 발행한 증권 조회
SELECT ?security ?securityType
WHERE {
  ?company a fibo-be:Corporation ;
           fibo-be:hasLegalName "삼성전자" .
  ?security fibo-sec:isIssuedBy ?company ;
            a ?securityType .
}
\`\`\`

### 헬스케어: FHIR 상세 구조

\`\`\`
FHIR 리소스 관계도:

Patient ────────── Encounter ────────── Condition
   │                   │                    │
   │                   │                    │
   ▼                   ▼                    ▼
Observation      Procedure          MedicationRequest
   │                   │                    │
   │                   │                    │
   ▼                   ▼                    ▼
DiagnosticReport  ServiceRequest    MedicationDispense
\`\`\`

**FHIR Search API**:
\`\`\`python
# FHIR Python 클라이언트 예시
from fhirclient import client
from fhirclient.models import patient, observation

# 서버 연결
settings = {
    'app_id': 'my_app',
    'api_base': 'https://hapi.fhir.org/baseR4'
}
smart = client.FHIRClient(settings=settings)

# 환자 검색
search = patient.Patient.where(struct={'family': 'Kim'})
patients = search.perform_resources(smart.server)

# 특정 환자의 관찰 기록
obs_search = observation.Observation.where(
    struct={'patient': patient_id, 'code': 'blood-pressure'}
)
observations = obs_search.perform_resources(smart.server)
\`\`\`

### 제조: OPC-UA & ISA-95

\`\`\`
OPC-UA 정보 모델:

AddressSpace
├── Objects
│   ├── Server (서버 정보)
│   ├── DeviceSet (디바이스 목록)
│   │   ├── PLC_001
│   │   │   ├── Temperature (Float)
│   │   │   ├── Pressure (Float)
│   │   │   └── Status (Enum)
│   │   └── Robot_001
│   │       ├── Position (Array)
│   │       └── Speed (Float)
│   └── Alarms (알람 목록)
│
├── Types
│   ├── ObjectTypes
│   └── VariableTypes
│
└── Views (사용자 정의 뷰)
\`\`\`

**OPC-UA Python 클라이언트**:
\`\`\`python
from opcua import Client

# OPC-UA 서버 연결
client = Client("opc.tcp://localhost:4840")
client.connect()

try:
    # 노드 읽기
    temp_node = client.get_node("ns=2;i=1001")
    temperature = temp_node.get_value()

    # 구독 설정 (실시간 모니터링)
    handler = SubHandler()
    sub = client.create_subscription(100, handler)
    handle = sub.subscribe_data_change(temp_node)

finally:
    client.disconnect()
\`\`\`

### 핵심 GitHub 프로젝트 상세

**금융 도메인**:
| 프로젝트 | 용도 | 학습 포인트 |
|---------|------|------------|
| [FinRL](https://github.com/AI4Finance-Foundation/FinRL) | RL 트레이딩 | 강화학습 + 금융 |
| [FinGPT](https://github.com/AI4Finance-Foundation/FinGPT) | 금융 LLM | RAG + 금융 뉴스 |
| [qlib](https://github.com/microsoft/qlib) | 퀀트 플랫폼 | 특징 추출, 백테스트 |

**헬스케어 도메인**:
| 프로젝트 | 용도 | 학습 포인트 |
|---------|------|------------|
| [MedCAT](https://github.com/CogStack/MedCAT) | 의료 NER | 의료 텍스트 분석 |
| [MONAI](https://github.com/Project-MONAI/MONAI) | 의료 영상 | PyTorch 의료 AI |
| [ClinicalBERT](https://github.com/kexinhuang12345/clinicalBERT) | 임상 NLP | 임상 노트 분석 |

**제조 도메인**:
| 프로젝트 | 용도 | 학습 포인트 |
|---------|------|------------|
| [freeopcua](https://github.com/FreeOpcUa/opcua-asyncio) | OPC-UA | 산업 통신 |
| [tsai](https://github.com/timeseriesAI/tsai) | 시계열 AI | 예측 정비 |
| [pyod](https://github.com/yzhao062/pyod) | 이상 탐지 | 품질 관리 |
        `,
        externalLinks: [
          { title: 'FIBO Vocabulary', url: 'https://spec.edmcouncil.org/fibo/' },
          { title: 'HAPI FHIR (테스트 서버)', url: 'https://hapi.fhir.org/' },
          { title: 'OPC-UA Python', url: 'https://github.com/FreeOpcUa/opcua-asyncio' },
          { title: 'FinGPT', url: 'https://github.com/AI4Finance-Foundation/FinGPT' }
        ]
      }
    },
    {
      id: 'data-sources-research',
      type: 'project',
      title: '데이터 소스 리서치 & 수집 계획',
      duration: 60,
      content: {
        objectives: [
          '캡스톤 프로젝트에 사용할 데이터 소스를 확정한다',
          '데이터 수집 파이프라인을 설계한다',
          '합성 데이터 생성 계획을 수립한다 (필요시)'
        ],
        requirements: [
          '**데이터 소스 리서치 문서**',
          '',
          '## 1. 주요 데이터 소스 목록',
          '',
          '| 데이터 소스 | 유형 | API/다운로드 | 비용 | 제한사항 |',
          '|------------|------|-------------|------|---------|',
          '| [소스 1] | 실시간/배치 | URL | 무료/유료 | Rate limit 등 |',
          '| [소스 2] | ... | ... | ... | ... |',
          '',
          '## 2. 데이터 스키마 분석',
          '- 각 소스의 데이터 형식 (JSON, CSV, XML)',
          '- 주요 필드 및 데이터 타입',
          '- 데이터 품질 이슈 예상',
          '',
          '## 3. 수집 파이프라인 설계',
          '- 배치 vs 스트리밍 결정',
          '- Airflow DAG 또는 스트리밍 아키텍처',
          '- 저장소 선택 (PostgreSQL, Neo4j, Vector Store)',
          '',
          '## 4. 합성 데이터 계획 (필요시)',
          '- 실제 데이터 부족 시 합성 데이터 생성 방안',
          '- Synthea (헬스케어), Faker (금융), 시뮬레이터 (제조)'
        ],
        evaluationCriteria: [
          '데이터 소스의 적절성',
          '수집 파이프라인의 실현 가능성',
          '데이터 품질 고려'
        ]
      }
    },
    {
      id: 'reference-project-analysis',
      type: 'project',
      title: '참고 프로젝트 분석',
      duration: 60,
      content: {
        objectives: [
          '유사 프로젝트의 GitHub 레포를 심층 분석한다',
          '아키텍처와 기술 스택을 파악한다',
          '벤치마킹 포인트를 도출한다'
        ],
        requirements: [
          '**참고 프로젝트 분석 문서**',
          '',
          '## 분석할 프로젝트 (3개 이상)',
          '',
          '### 프로젝트 1: [이름]',
          '- GitHub URL:',
          '- 스타 수:',
          '- 마지막 업데이트:',
          '',
          '**아키텍처 분석**:',
          '```',
          '[아키텍처 다이어그램]',
          '```',
          '',
          '**기술 스택**:',
          '- 백엔드:',
          '- 데이터베이스:',
          '- AI/ML:',
          '- 프론트엔드:',
          '',
          '**코드 구조**:',
          '```',
          '[디렉토리 구조]',
          '```',
          '',
          '**강점/약점**:',
          '- 강점:',
          '- 약점:',
          '- 우리 프로젝트에 적용할 점:',
          '',
          '## 벤치마킹 요약',
          '- 공통 패턴:',
          '- 차별화 포인트:',
          '- 피해야 할 안티패턴:'
        ],
        evaluationCriteria: [
          '분석의 깊이',
          '벤치마킹 포인트의 구체성',
          '프로젝트 적용 계획'
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'domain-deep-dive-2',
  title: '도메인 심화 학습 (2)',
  totalDuration: 180,
  tasks: [
    {
      id: 'industry-case-studies',
      type: 'reading',
      title: '산업별 성공 사례 분석',
      duration: 45,
      content: {
        objectives: [
          '각 도메인의 실제 성공 사례를 학습한다',
          'Palantir, Databricks 등 선도 기업의 접근 방식을 파악한다',
          '자신의 프로젝트에 적용할 인사이트를 도출한다'
        ],
        markdown: `
## 산업별 성공 사례

### 금융: Palantir Gotham → Foundry

**JP Morgan Chase 사례**:
- 문제: 분산된 데이터 사일로, 리스크 관리 어려움
- 솔루션: Foundry 기반 통합 데이터 플랫폼
- 결과: 리스크 분석 시간 90% 단축

**Two Sigma 사례**:
- 문제: 대규모 대체 데이터 처리
- 솔루션: 자체 데이터 플랫폼 + Knowledge Graph
- 결과: 투자 알파 생성 향상

**오픈소스 대안**:
\`\`\`
Palantir Foundry 대안 스택:

[데이터 수집]
├── Airbyte (데이터 통합)
├── Airflow (오케스트레이션)
└── Kafka (스트리밍)

[저장 & 처리]
├── Delta Lake (레이크하우스)
├── Spark (처리)
└── dbt (변환)

[AI & 분석]
├── LangChain (RAG)
├── Neo4j (Knowledge Graph)
└── MLflow (ML 관리)

[시각화]
├── Superset (BI)
├── Grafana (모니터링)
└── Next.js (대시보드)
\`\`\`

### 헬스케어: Tempus, Flatiron

**Tempus 사례**:
- 문제: 암 환자 데이터 단편화
- 솔루션: 임상 + 유전체 데이터 통합 플랫폼
- 결과: 정밀 의학 기반 치료 매칭

**Flatiron Health 사례**:
- 문제: 실제 임상 데이터 (RWD) 부족
- 솔루션: 전자 건강 기록 (EHR) 통합 플랫폼
- 결과: Roche에 $1.9B에 인수

**주요 GitHub 프로젝트**:
| 프로젝트 | 설명 |
|---------|------|
| [ehrapy](https://github.com/theislab/ehrapy) | EHR 분석 |
| [clinical-ml](https://github.com/clinical-ml) | 임상 ML 모델 |
| [hazyresearch/bootleg](https://github.com/HazyResearch/bootleg) | 엔티티 링킹 |

### 제조: Siemens MindSphere, PTC ThingWorx

**BMW 스마트 팩토리 사례**:
- 문제: 복잡한 생산 라인 품질 관리
- 솔루션: Digital Twin + AI 품질 예측
- 결과: 불량률 50% 감소

**Siemens MindSphere**:
\`\`\`
MindSphere 아키텍처:

[Edge]
└── MindConnect (데이터 수집)
        │
        ▼
[Platform]
├── Asset Management (자산 관리)
├── Time Series (시계열 저장)
└── Analytics (분석)
        │
        ▼
[Application]
├── Predictive Maintenance
├── Quality Management
└── Energy Optimization
\`\`\`

**오픈소스 대안**:
| 상용 솔루션 | 오픈소스 대안 |
|------------|--------------|
| MindSphere | Eclipse Ditto + TimescaleDB |
| ThingWorx | Node-RED + InfluxDB |
| AWS IoT | EMQX (MQTT) + Kafka |
        `,
        externalLinks: [
          { title: 'Palantir Foundry 소개', url: 'https://www.palantir.com/platforms/foundry/' },
          { title: 'Tempus Labs', url: 'https://www.tempus.com/' },
          { title: 'Siemens MindSphere', url: 'https://siemens.mindsphere.io/' },
          { title: 'Eclipse Ditto', url: 'https://www.eclipse.org/ditto/' }
        ]
      }
    },
    {
      id: 'technical-challenges',
      type: 'reading',
      title: '도메인별 기술적 도전과제',
      duration: 45,
      content: {
        objectives: [
          '각 도메인의 기술적 어려움을 이해한다',
          '해결 방안과 모범 사례를 파악한다',
          '자신의 프로젝트에서 예상되는 도전과제를 식별한다'
        ],
        markdown: `
## 도메인별 기술적 도전과제

### 금융 도메인

**도전과제 1: 실시간 처리**
\`\`\`
요구사항:
- 주문 처리: < 1ms
- 리스크 계산: < 100ms
- 규제 보고: 실시간

해결 방안:
- Kafka Streams / Flink (스트리밍)
- Redis (인메모리 캐시)
- LMAX Disruptor (초저지연)
\`\`\`

**도전과제 2: 규제 준수**
\`\`\`
규제 요구사항:
- Basel III/IV: 자본 요건
- MiFID II: 거래 보고
- KYC/AML: 고객 확인

해결 방안:
- 감사 추적 (Audit Trail) 필수
- 데이터 리니지 추적
- FIBO 기반 표준화
\`\`\`

### 헬스케어 도메인

**도전과제 1: 개인정보 보호**
\`\`\`
규제:
- HIPAA (미국)
- GDPR (유럽)
- 개인정보보호법 (한국)

해결 방안:
- 데이터 익명화 (k-anonymity, l-diversity)
- 차등 프라이버시 (Differential Privacy)
- 연합 학습 (Federated Learning)
\`\`\`

**도전과제 2: 데이터 상호운용성**
\`\`\`
문제:
- 병원마다 다른 EMR 시스템
- 용어 체계 불일치

해결 방안:
- FHIR 표준 준수
- SNOMED-CT, ICD-10 매핑
- NLP 기반 정규화
\`\`\`

### 제조 도메인

**도전과제 1: Edge vs Cloud**
\`\`\`
트레이드오프:
- Edge: 저지연, 오프라인, 제한된 리소스
- Cloud: 대규모 처리, 고급 분석, 네트워크 의존

해결 방안:
- Hybrid 아키텍처
- Edge: 실시간 이상 탐지, 전처리
- Cloud: 모델 학습, 장기 분석
\`\`\`

**도전과제 2: 노이즈 & 결측치**
\`\`\`
문제:
- 센서 노이즈
- 통신 장애로 인한 결측
- 드리프트 (센서 열화)

해결 방안:
- 칼만 필터 (Kalman Filter)
- 이동 평균 (Moving Average)
- 자동 캘리브레이션
\`\`\`

### 공통 도전과제

**1. 데이터 품질**
\`\`\`python
# 데이터 품질 검증 파이프라인
from great_expectations import DataContext

# 기대사항 정의
validator.expect_column_values_to_not_be_null("customer_id")
validator.expect_column_values_to_be_between("amount", 0, 1000000)
validator.expect_column_values_to_be_in_set("status", ["active", "inactive"])

# 검증 실행
results = validator.validate()
if not results.success:
    send_alert(results.results)
\`\`\`

**2. 모델 드리프트**
\`\`\`python
# 데이터/모델 드리프트 모니터링
from evidently import Report
from evidently.metrics import DataDriftTable

report = Report(metrics=[
    DataDriftTable(),
])
report.run(reference_data=train_data, current_data=prod_data)

if report.has_drift():
    trigger_retraining()
\`\`\`

**3. 설명 가능성**
\`\`\`python
# SHAP을 이용한 모델 설명
import shap

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# 특성 중요도 시각화
shap.summary_plot(shap_values, X_test)
\`\`\`
        `,
        externalLinks: [
          { title: 'Great Expectations (데이터 품질)', url: 'https://github.com/great-expectations/great_expectations' },
          { title: 'Evidently (ML 모니터링)', url: 'https://github.com/evidentlyai/evidently' },
          { title: 'SHAP (설명 가능 AI)', url: 'https://github.com/slundberg/shap' }
        ]
      }
    },
    {
      id: 'problem-definition-project',
      type: 'project',
      title: '캡스톤 문제 정의',
      duration: 90,
      content: {
        objectives: [
          '캡스톤 프로젝트의 구체적인 문제를 정의한다',
          '해결하고자 하는 비즈니스 가치를 명확히 한다',
          '기술적 접근 방법을 초안으로 작성한다'
        ],
        requirements: [
          '**문제 정의 문서 (Problem Statement)**',
          '',
          '## 1. 배경 (Background)',
          '- 도메인 컨텍스트',
          '- 현재 상황의 문제점',
          '- 왜 이 문제가 중요한가?',
          '',
          '## 2. 문제 정의 (Problem Statement)',
          '- 한 문장으로 정의:',
          '  "우리는 [타겟 사용자]를 위해 [핵심 문제]를 해결하여 [기대 가치]를 제공한다"',
          '',
          '## 3. 범위 (Scope)',
          '- MVP에 포함되는 것:',
          '- MVP에서 제외되는 것:',
          '- 가정 (Assumptions):',
          '',
          '## 4. 성공 기준 (Success Criteria)',
          '- 정량적 지표 (3개 이상):',
          '  - 예: RAG Faithfulness ≥ 0.8',
          '  - 예: API 응답 시간 < 2초',
          '- 정성적 기준:',
          '',
          '## 5. 기술적 접근 방법 (초안)',
          '- 데이터 파이프라인:',
          '- Knowledge Graph 설계:',
          '- AI/RAG 시스템:',
          '- 예상 기술 스택:',
          '',
          '## 6. 리스크 & 완화 방안',
          '| 리스크 | 영향도 | 확률 | 완화 방안 |',
          '|--------|-------|------|----------|',
          '| ... | 상/중/하 | 상/중/하 | ... |'
        ],
        evaluationCriteria: [
          '문제 정의의 명확성',
          '비즈니스 가치와 기술의 연결',
          '현실적인 범위 설정',
          '리스크 식별 능력'
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'domain-deep-dive-3',
  title: '도메인 심화 학습 (3)',
  totalDuration: 180,
  tasks: [
    {
      id: 'tech-stack-research',
      type: 'reading',
      title: '기술 스택 심화 리서치',
      duration: 60,
      content: {
        objectives: [
          '캡스톤 프로젝트에 사용할 기술 스택을 확정한다',
          '각 기술의 장단점과 대안을 파악한다',
          '기술 스택 간 통합 방법을 이해한다'
        ],
        markdown: `
## 캡스톤 기술 스택 가이드

### 추천 기술 스택 (도메인 공통)

\`\`\`
┌──────────────────────────────────────────────────────┐
│              FDE 캡스톤 기술 스택                      │
├──────────────────────────────────────────────────────┤
│                                                       │
│  [데이터 수집 & 오케스트레이션]                        │
│  ├── Airflow (배치) - github.com/apache/airflow       │
│  ├── Kafka (스트리밍) - github.com/apache/kafka       │
│  └── Airbyte (데이터 통합) - github.com/airbytehq     │
│                                                       │
│  [저장소]                                             │
│  ├── PostgreSQL (정형 데이터)                         │
│  ├── Neo4j (Knowledge Graph)                         │
│  ├── Pinecone/Chroma (Vector Store)                  │
│  └── MinIO/S3 (오브젝트 스토리지)                     │
│                                                       │
│  [AI/ML]                                              │
│  ├── LangChain/LangGraph - github.com/langchain-ai   │
│  ├── OpenAI/Claude API                               │
│  ├── HuggingFace - github.com/huggingface            │
│  └── MLflow (실험 관리) - github.com/mlflow          │
│                                                       │
│  [백엔드]                                             │
│  ├── FastAPI - github.com/tiangolo/fastapi           │
│  ├── Pydantic (데이터 검증)                          │
│  └── Redis (캐시)                                    │
│                                                       │
│  [프론트엔드]                                         │
│  ├── Next.js 14 (App Router)                         │
│  ├── Tailwind CSS                                    │
│  └── vis-network/D3.js (그래프 시각화)               │
│                                                       │
│  [인프라]                                             │
│  ├── Docker/Docker Compose                           │
│  ├── Kubernetes (선택)                               │
│  ├── Terraform (IaC)                                 │
│  └── GitHub Actions (CI/CD)                          │
│                                                       │
│  [모니터링]                                           │
│  ├── Grafana + Prometheus                            │
│  ├── LangSmith (LLM 모니터링)                        │
│  └── Sentry (에러 추적)                              │
│                                                       │
└──────────────────────────────────────────────────────┘
\`\`\`

### 도메인별 특화 기술

**금융**:
| 카테고리 | 기술 | GitHub |
|---------|------|--------|
| 시장 데이터 | yfinance | [ranaroussi/yfinance](https://github.com/ranaroussi/yfinance) |
| 백테스트 | backtrader | [mementum/backtrader](https://github.com/mementum/backtrader) |
| 기술적 분석 | TA-Lib | [mrjbq7/ta-lib](https://github.com/mrjbq7/ta-lib) |
| 금융 NLP | finBERT | [yiyanghkust/finBERT](https://github.com/yiyanghkust/finBERT) |
| 퀀트 플랫폼 | Qlib | [microsoft/qlib](https://github.com/microsoft/qlib) |

**헬스케어**:
| 카테고리 | 기술 | GitHub |
|---------|------|--------|
| FHIR 클라이언트 | fhir.resources | [nazrulworld/fhir.resources](https://github.com/nazrulworld/fhir.resources) |
| 의료 NLP | MedCAT | [CogStack/MedCAT](https://github.com/CogStack/MedCAT) |
| 바이오 NLP | scispaCy | [allenai/scispacy](https://github.com/allenai/scispacy) |
| 합성 데이터 | Synthea | [synthetichealth/synthea](https://github.com/synthetichealth/synthea) |
| 의료 KG | PrimeKG | [mims-harvard/PrimeKG](https://github.com/mims-harvard/PrimeKG) |

**제조**:
| 카테고리 | 기술 | GitHub |
|---------|------|--------|
| OPC-UA | opcua-asyncio | [FreeOpcUa/opcua-asyncio](https://github.com/FreeOpcUa/opcua-asyncio) |
| 시계열 | tsai | [timeseriesAI/tsai](https://github.com/timeseriesAI/tsai) |
| 이상 탐지 | pyod | [yzhao062/pyod](https://github.com/yzhao062/pyod) |
| 시계열 DB | TimescaleDB | [timescale/timescaledb](https://github.com/timescale/timescaledb) |
| Digital Twin | Eclipse Ditto | [eclipse/ditto](https://github.com/eclipse/ditto) |

### 기술 선택 의사결정 프레임워크

\`\`\`
기술 선택 체크리스트:

□ 문제 적합성
  - 이 기술이 우리 문제를 해결하는가?
  - 오버엔지니어링은 아닌가?

□ 학습 곡선
  - 2주 내 MVP 개발 가능한가?
  - 기존 경험/지식 활용 가능한가?

□ 커뮤니티 & 지원
  - GitHub 스타 1000+ ?
  - 최근 업데이트 (6개월 이내)?
  - 문서화 품질?

□ 확장성
  - 프로덕션 레벨로 확장 가능한가?
  - 비용 예측 가능한가?

□ 통합성
  - 다른 기술과 쉽게 통합되는가?
  - 표준 인터페이스 제공?
\`\`\`
        `,
        externalLinks: [
          { title: 'Awesome Data Engineering', url: 'https://github.com/igorbarinov/awesome-data-engineering' },
          { title: 'Awesome LLM Apps', url: 'https://github.com/Shubhamsaboo/awesome-llm-apps' },
          { title: 'Awesome Healthcare AI', url: 'https://github.com/medtorch/awesome-healthcare-ai' }
        ]
      }
    },
    {
      id: 'architecture-design-project',
      type: 'project',
      title: '아키텍처 초안 설계',
      duration: 90,
      content: {
        objectives: [
          '캡스톤 프로젝트의 전체 아키텍처를 설계한다',
          '데이터 흐름을 다이어그램으로 표현한다',
          '기술 스택을 확정하고 근거를 문서화한다'
        ],
        requirements: [
          '**아키텍처 설계 문서 (초안)**',
          '',
          '## 1. 시스템 아키텍처 다이어그램',
          '- Mermaid 또는 draw.io로 작성',
          '- 주요 컴포넌트와 연결 표시',
          '',
          '## 2. 데이터 흐름 다이어그램',
          '- 데이터 소스 → 수집 → 처리 → 저장 → 분석 → 서비스',
          '- 배치/스트리밍 구분',
          '',
          '## 3. 기술 스택 확정',
          '',
          '| 레이어 | 기술 | 선택 이유 | 대안 |',
          '|--------|------|----------|------|',
          '| 데이터 수집 | ... | ... | ... |',
          '| 저장소 | ... | ... | ... |',
          '| AI/ML | ... | ... | ... |',
          '| 백엔드 | ... | ... | ... |',
          '| 프론트엔드 | ... | ... | ... |',
          '| 인프라 | ... | ... | ... |',
          '',
          '## 4. 컴포넌트 상세',
          '',
          '### 4.1 데이터 파이프라인',
          '- DAG 설계 (Airflow)',
          '- 스케줄링 전략',
          '',
          '### 4.2 Knowledge Graph',
          '- 온톨로지 스키마',
          '- 노드/엣지 정의',
          '',
          '### 4.3 AI/RAG 시스템',
          '- RAG 파이프라인 설계',
          '- 프롬프트 전략',
          '',
          '## 5. 비기능 요구사항',
          '- 성능 목표 (응답 시간, 처리량)',
          '- 확장성 계획',
          '- 보안 고려사항'
        ],
        evaluationCriteria: [
          '아키텍처의 적절성',
          '기술 스택 선택 근거',
          '확장성/유지보수성 고려'
        ]
      }
    },
    {
      id: 'dev-environment-setup',
      type: 'code',
      title: '개발 환경 셋업',
      duration: 30,
      content: {
        objectives: [
          '캡스톤 프로젝트의 개발 환경을 구성한다',
          'Docker Compose로 로컬 개발 환경을 설정한다',
          'GitHub 저장소를 초기화한다'
        ],
        instructions: `
## 개발 환경 셋업

### 1. GitHub 저장소 생성

\`\`\`bash
# 저장소 생성 및 클론
git clone https://github.com/[username]/fde-capstone.git
cd fde-capstone

# 브랜치 전략
git checkout -b develop
\`\`\`

### 2. 프로젝트 구조 초기화

\`\`\`
fde-capstone/
├── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── data/           # 데이터 파이프라인
│   ├── graph/          # Knowledge Graph
│   ├── ai/             # AI/RAG
│   ├── api/            # Backend
│   └── web/            # Frontend
├── tests/
├── docs/
│   ├── ARCHITECTURE.md
│   └── API.md
└── infra/
    ├── terraform/
    └── k8s/
\`\`\`

### 3. Docker Compose 설정

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: capstone
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  neo4j:
    image: neo4j:5
    environment:
      NEO4J_AUTH: neo4j/\${NEO4J_PASSWORD}
    ports:
      - "7474:7474"
      - "7687:7687"
    volumes:
      - neo4j_data:/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # 선택: Airflow (개발용)
  # airflow:
  #   image: apache/airflow:2.7.0
  #   ...

volumes:
  postgres_data:
  neo4j_data:
\`\`\`

### 4. 환경 변수 설정

\`\`\`bash
# .env.example
POSTGRES_USER=capstone
POSTGRES_PASSWORD=your_password
NEO4J_PASSWORD=your_password
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
\`\`\`

### 5. 실행 확인

\`\`\`bash
# 서비스 시작
docker-compose up -d

# 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f
\`\`\`
        `,
        starterCode: `# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: capstone
      POSTGRES_USER: \${POSTGRES_USER:-capstone}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-capstone}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U capstone"]
      interval: 10s
      timeout: 5s
      retries: 5

  neo4j:
    image: neo4j:5
    environment:
      NEO4J_AUTH: neo4j/\${NEO4J_PASSWORD:-password}
      NEO4J_PLUGINS: '["apoc"]'
    ports:
      - "7474:7474"
      - "7687:7687"
    volumes:
      - neo4j_data:/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
  neo4j_data:
`,
        solutionCode: `# 완성된 docker-compose.yml은 프로젝트에 맞게 커스터마이징
# 도메인별 추가 서비스:
# - 금융: kafka, timescaledb
# - 헬스케어: fhir-server
# - 제조: influxdb, mosquitto (MQTT)
`
      }
    }
  ]
}

const day5: Day = {
  slug: 'domain-research-report',
  title: '도메인 리서치 리포트',
  totalDuration: 180,
  tasks: [
    {
      id: 'research-report-project',
      type: 'project',
      title: '도메인 리서치 리포트 작성',
      duration: 120,
      content: {
        objectives: [
          '선택한 도메인에 대한 종합적인 리서치 리포트를 작성한다',
          '캡스톤 프로젝트의 기반이 되는 문서를 완성한다',
          '멘토/동료 리뷰를 위한 준비를 한다'
        ],
        requirements: [
          '**도메인 리서치 리포트 (A4 10페이지 이상)**',
          '',
          '## 1. Executive Summary (1페이지)',
          '- 선택 도메인',
          '- 핵심 문제',
          '- 제안 솔루션 요약',
          '',
          '## 2. 도메인 분석 (2-3페이지)',
          '- 시장 현황 및 트렌드',
          '- 주요 플레이어 (기업, 기술)',
          '- 데이터 생태계',
          '- 규제 및 표준',
          '',
          '## 3. 기술 분석 (2-3페이지)',
          '- 핵심 온톨로지/표준 상세',
          '- 주요 기술 스택',
          '- 참고 GitHub 프로젝트 분석 (3개 이상)',
          '- 기술적 도전과제 및 해결 방안',
          '',
          '## 4. 캡스톤 프로젝트 제안 (2-3페이지)',
          '- 문제 정의',
          '- 제안 솔루션',
          '- 시스템 아키텍처 (다이어그램)',
          '- 기술 스택 및 선택 근거',
          '',
          '## 5. 실행 계획 (1-2페이지)',
          '- Week 2-8 마일스톤',
          '- 리스크 및 완화 방안',
          '- 데이터 확보 계획',
          '',
          '## 6. 참고 자료',
          '- GitHub 레포지토리 목록',
          '- 논문/문서 레퍼런스',
          '- 데이터 소스 목록'
        ],
        evaluationCriteria: [
          '도메인 이해도 (30%)',
          '기술적 분석 깊이 (25%)',
          '프로젝트 제안의 실현 가능성 (25%)',
          '문서 품질 (20%)'
        ],
        bonusPoints: [
          '실제 산업 전문가 인터뷰 포함',
          '경쟁 솔루션 심층 비교 분석',
          'PoC (Proof of Concept) 코드 포함'
        ]
      }
    },
    {
      id: 'week1-checkpoint',
      type: 'challenge',
      title: 'Week 1 체크포인트',
      duration: 60,
      content: {
        objectives: [
          'Week 1 산출물을 점검한다',
          '피드백을 반영하여 개선한다',
          'Week 2 계획을 확정한다'
        ],
        requirements: [
          '**Week 1 산출물 체크리스트**',
          '',
          '□ 도메인 선택 문서',
          '□ 데이터 소스 리서치 문서',
          '□ 참고 프로젝트 분석 문서',
          '□ 문제 정의 문서 (Problem Statement)',
          '□ 아키텍처 설계 초안',
          '□ 개발 환경 셋업 (Docker Compose)',
          '□ GitHub 저장소 초기화',
          '□ **도메인 리서치 리포트 (최종)**',
          '',
          '**Week 2 계획 수립**',
          '',
          '- PRD (Product Requirements Document) 작성 계획',
          '- 아키텍처 상세 설계 계획',
          '- 기술 스택 검증 (PoC) 계획'
        ],
        evaluationCriteria: [
          '산출물 완성도',
          '문서 품질',
          'Week 2 계획의 구체성'
        ]
      }
    }
  ]
}

export const industryDomainWeek: Week = {
  slug: 'industry-domain',
  week: 1,
  phase: 6,
  month: 11,
  access: 'pro',
  title: '산업 도메인 선택 & 리서치',
  topics: ['Domain Knowledge', 'FIBO', 'FHIR', 'OPC-UA', 'Digital Twin', 'Industry Research'],
  practice: '도메인 리서치 리포트',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
