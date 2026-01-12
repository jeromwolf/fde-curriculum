// RAG Pipeline Sample Documents
import type { RAGScenario, Document } from './types'

// 시나리오 1: 기술 문서
const techDocuments: Document[] = [
  {
    id: 'doc1',
    title: 'RAG 시스템 개요',
    content: `RAG(Retrieval-Augmented Generation)는 대규모 언어 모델의 한계를 극복하기 위한 기술입니다.
LLM은 학습 데이터에 없는 최신 정보나 특정 도메인 지식을 알지 못합니다.
RAG는 외부 지식 베이스에서 관련 정보를 검색하여 LLM에 제공함으로써 이 문제를 해결합니다.
RAG 시스템의 핵심 구성요소는 문서 저장소, 임베딩 모델, 벡터 데이터베이스, 그리고 LLM입니다.`,
    source: 'tech-docs/rag-overview.md'
  },
  {
    id: 'doc2',
    title: '벡터 데이터베이스 비교',
    content: `주요 벡터 데이터베이스를 비교해보겠습니다.
Pinecone: 완전 관리형 서비스로 설정이 간단하고 확장성이 뛰어납니다. 월 $70부터 시작합니다.
Milvus: 오픈소스로 자체 호스팅이 가능합니다. 대규모 데이터에 적합합니다.
Chroma: 경량 오픈소스로 개발 및 프로토타이핑에 적합합니다.
Weaviate: GraphQL API를 지원하며 하이브리드 검색이 가능합니다.
Qdrant: Rust로 작성되어 성능이 우수하고 필터링 기능이 강력합니다.`,
    source: 'tech-docs/vector-db-comparison.md'
  },
  {
    id: 'doc3',
    title: '청킹 전략',
    content: `효과적인 RAG를 위한 청킹 전략입니다.
고정 크기 청킹: 가장 단순한 방법으로 일정한 문자 수로 분할합니다. 구현이 쉽지만 문맥이 끊길 수 있습니다.
문장 기반 청킹: 문장 단위로 분할하여 의미 단위를 보존합니다.
의미 기반 청킹: 임베딩 유사도를 기반으로 의미적으로 연관된 문장들을 그룹화합니다.
재귀적 청킹: 문단, 문장, 단어 순으로 계층적으로 분할합니다.
최적의 청크 크기는 보통 200-500 토큰 사이입니다.`,
    source: 'tech-docs/chunking-strategies.md'
  }
]

// 시나리오 2: 회사 정책 문서
const policyDocuments: Document[] = [
  {
    id: 'policy1',
    title: '휴가 정책',
    content: `당사의 휴가 정책을 안내합니다.
연차휴가: 1년 근속 시 15일, 3년 이상 근속 시 매년 1일씩 추가됩니다. 최대 25일까지 가능합니다.
병가: 연간 10일의 유급 병가가 제공됩니다. 3일 이상 사용 시 진단서가 필요합니다.
경조사휴가: 본인 결혼 5일, 자녀 결혼 1일, 배우자 출산 10일이 제공됩니다.
휴가 신청은 최소 3일 전에 HR 시스템을 통해 해야 합니다.
미사용 연차는 다음 해로 이월되지 않으며, 퇴직 시 수당으로 지급됩니다.`,
    source: 'hr-policies/vacation.md'
  },
  {
    id: 'policy2',
    title: '재택근무 정책',
    content: `재택근무 관련 정책입니다.
모든 정규직 직원은 주 2회까지 재택근무가 가능합니다.
재택근무 시에도 코어타임(10:00-16:00)에는 연락 가능해야 합니다.
필요한 장비는 회사에서 지원하며, 인터넷 비용의 50%를 보조합니다.
보안상 민감한 업무는 사무실에서만 처리해야 합니다.
재택근무일에는 Slack 상태를 '재택근무'로 설정해주세요.`,
    source: 'hr-policies/remote-work.md'
  },
  {
    id: 'policy3',
    title: '비용 청구 정책',
    content: `업무 관련 비용 청구 절차입니다.
교통비: 대중교통 실비, 택시는 야간(22시 이후) 또는 출장 시에만 가능합니다.
식비: 야근 시(20시 이후) 1만원 한도로 저녁 식대가 지원됩니다.
출장비: 국내 일비 5만원, 해외 일비 10만원이 지급됩니다.
모든 비용은 영수증을 첨부하여 익월 5일까지 신청해야 합니다.
승인 권한: 10만원 이하 팀장, 50만원 이하 부서장, 그 이상은 CFO 승인이 필요합니다.`,
    source: 'hr-policies/expense.md'
  }
]

// 시나리오 3: 제품 매뉴얼
const productDocuments: Document[] = [
  {
    id: 'product1',
    title: 'SmartHome Hub 설치 가이드',
    content: `SmartHome Hub 설치 방법입니다.
1. 박스에서 Hub와 전원 어댑터, 이더넷 케이블을 꺼냅니다.
2. Hub를 라우터 근처에 배치하고 이더넷 케이블로 연결합니다.
3. 전원을 연결하면 LED가 파란색으로 깜빡입니다.
4. SmartHome 앱을 설치하고 계정을 생성합니다.
5. 앱에서 '새 기기 추가'를 선택하고 Hub의 QR 코드를 스캔합니다.
6. Wi-Fi 설정을 완료하면 LED가 녹색으로 바뀝니다.
설치가 완료되면 앱에서 다른 스마트 기기들을 추가할 수 있습니다.`,
    source: 'product-manual/hub-setup.md'
  },
  {
    id: 'product2',
    title: 'SmartHome Hub 문제 해결',
    content: `SmartHome Hub 문제 해결 가이드입니다.
LED가 빨간색인 경우: 인터넷 연결을 확인하세요. 라우터를 재시작해보세요.
LED가 주황색인 경우: 펌웨어 업데이트 중입니다. 전원을 끄지 마세요.
기기가 응답하지 않는 경우: Hub 뒷면의 리셋 버튼을 5초간 누르세요.
앱에서 Hub가 보이지 않는 경우: 앱을 삭제 후 재설치하고 다시 로그인하세요.
연결된 기기가 작동하지 않는 경우: 해당 기기를 삭제 후 다시 등록하세요.
문제가 지속되면 고객센터 1588-0000으로 연락해주세요.`,
    source: 'product-manual/troubleshooting.md'
  },
  {
    id: 'product3',
    title: 'SmartHome Hub 호환 기기',
    content: `SmartHome Hub와 호환되는 기기 목록입니다.
조명: Philips Hue, LIFX, Nanoleaf, Yeelight
플러그: TP-Link Kasa, Wemo, Meross
온도조절기: Nest, Ecobee, Honeywell
도어락: August, Yale, Schlage
카메라: Ring, Arlo, Wyze, Eufy
스피커: Amazon Echo, Google Home, Apple HomePod
모든 Zigbee 3.0 및 Z-Wave Plus 호환 기기도 지원됩니다.
Matter 프로토콜 기기는 펌웨어 2.0 이상에서 지원됩니다.`,
    source: 'product-manual/compatibility.md'
  }
]

export const ragScenarios: Record<string, RAGScenario> = {
  tech: {
    id: 'tech',
    name: '기술 문서',
    description: 'RAG, 벡터 DB, 청킹 관련 기술 문서',
    documents: techDocuments,
    sampleQueries: [
      'RAG란 무엇인가요?',
      '어떤 벡터 데이터베이스를 사용해야 하나요?',
      '최적의 청크 크기는?',
      'Pinecone 가격이 얼마인가요?'
    ],
    chunkSize: 150,
    topK: 3
  },
  policy: {
    id: 'policy',
    name: '회사 정책',
    description: '휴가, 재택근무, 비용 청구 정책',
    documents: policyDocuments,
    sampleQueries: [
      '연차휴가는 며칠인가요?',
      '재택근무는 주 몇 회 가능한가요?',
      '야근 식대는 얼마까지 지원되나요?',
      '출장비 승인 권한은?'
    ],
    chunkSize: 120,
    topK: 3
  },
  product: {
    id: 'product',
    name: '제품 매뉴얼',
    description: 'SmartHome Hub 설치 및 사용 가이드',
    documents: productDocuments,
    sampleQueries: [
      'Hub 설치 방법을 알려주세요',
      'LED가 빨간색이면 어떻게 하나요?',
      'Philips Hue 호환되나요?',
      '고객센터 번호가 뭔가요?'
    ],
    chunkSize: 130,
    topK: 3
  }
}

export type ScenarioKey = keyof typeof ragScenarios
