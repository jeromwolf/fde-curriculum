// Sample Scenarios for GraphRAG Pipeline Demo

import type { SampleScenario } from './types'

export const companyScenario: SampleScenario = {
  id: 'company',
  name: '기업 관계 분석',
  description: '삼성전자와 관련된 기업 정보를 GraphRAG로 분석',
  query: '삼성전자의 주요 경쟁사와 협력사는 누구인가요?',
  expectedEntities: [
    { id: 'samsung', name: '삼성전자', type: 'organization' },
    { id: 'competitor', name: '경쟁사', type: 'concept' },
    { id: 'partner', name: '협력사', type: 'concept' },
  ],
  graphData: {
    entities: [
      { id: 'samsung', name: '삼성전자', type: 'organization', properties: { industry: '반도체/전자', founded: '1969' } },
      { id: 'apple', name: 'Apple', type: 'organization', properties: { industry: '전자/소프트웨어', founded: '1976' } },
      { id: 'skhynix', name: 'SK하이닉스', type: 'organization', properties: { industry: '반도체', founded: '1983' } },
      { id: 'tsmc', name: 'TSMC', type: 'organization', properties: { industry: '반도체 파운드리', founded: '1987' } },
      { id: 'qualcomm', name: 'Qualcomm', type: 'organization', properties: { industry: '반도체', founded: '1985' } },
      { id: 'google', name: 'Google', type: 'organization', properties: { industry: '소프트웨어/AI', founded: '1998' } },
    ],
    relationships: [
      { source: 'samsung', target: 'apple', type: 'competes_with', properties: { market: '스마트폰' } },
      { source: 'samsung', target: 'skhynix', type: 'competes_with', properties: { market: '메모리 반도체' } },
      { source: 'samsung', target: 'apple', type: 'supplies_to', properties: { product: '디스플레이, 메모리' } },
      { source: 'samsung', target: 'google', type: 'partners_with', properties: { project: 'Android OS' } },
      { source: 'tsmc', target: 'samsung', type: 'competes_with', properties: { market: '파운드리' } },
      { source: 'qualcomm', target: 'samsung', type: 'supplies_to', properties: { product: '모바일 AP' } },
    ],
    textChunks: [
      '삼성전자는 세계 최대의 메모리 반도체 제조업체로, SK하이닉스와 치열한 경쟁을 벌이고 있습니다.',
      'Apple은 삼성전자의 주요 경쟁사이면서 동시에 디스플레이와 메모리 칩의 주요 고객이기도 합니다.',
      '삼성전자는 Google과 Android 운영체제 개발에서 긴밀히 협력하고 있습니다.',
      'TSMC와 삼성전자는 반도체 파운드리 시장에서 1, 2위를 다투고 있습니다.',
    ],
  },
  expectedAnswer: `삼성전자의 주요 경쟁사와 협력사를 Knowledge Graph 분석을 통해 정리하면:

**경쟁사:**
- **Apple**: 스마트폰 시장에서 직접 경쟁 (그러나 부품 공급 관계도 존재)
- **SK하이닉스**: 메모리 반도체 시장 경쟁
- **TSMC**: 반도체 파운드리 시장 경쟁

**협력사:**
- **Google**: Android OS 개발 파트너
- **Apple**: 디스플레이, 메모리 칩 공급 (경쟁과 협력이 공존)
- **Qualcomm**: 모바일 AP 공급받음

특이한 점은 Apple과의 관계인데, 스마트폰 시장에서는 경쟁하면서도 핵심 부품을 공급하는 복잡한 관계를 맺고 있습니다.`,
}

export const movieScenario: SampleScenario = {
  id: 'movie',
  name: '영화 추천',
  description: '크리스토퍼 놀란 감독 영화 추천',
  query: '크리스토퍼 놀란 감독의 대표작과 비슷한 영화를 추천해주세요.',
  expectedEntities: [
    { id: 'nolan', name: '크리스토퍼 놀란', type: 'person' },
    { id: 'director', name: '감독', type: 'concept' },
    { id: 'movie', name: '영화', type: 'concept' },
  ],
  graphData: {
    entities: [
      { id: 'nolan', name: '크리스토퍼 놀란', type: 'person', properties: { role: '감독', nationality: '영국' } },
      { id: 'inception', name: '인셉션', type: 'event', properties: { year: '2010', genre: 'SF/스릴러' } },
      { id: 'interstellar', name: '인터스텔라', type: 'event', properties: { year: '2014', genre: 'SF/드라마' } },
      { id: 'tenet', name: '테넷', type: 'event', properties: { year: '2020', genre: 'SF/액션' } },
      { id: 'arrival', name: '컨택트', type: 'event', properties: { year: '2016', genre: 'SF/드라마' } },
      { id: 'villeneuve', name: '드니 빌뇌브', type: 'person', properties: { role: '감독', nationality: '캐나다' } },
      { id: 'matrix', name: '매트릭스', type: 'event', properties: { year: '1999', genre: 'SF/액션' } },
    ],
    relationships: [
      { source: 'nolan', target: 'inception', type: 'directed' },
      { source: 'nolan', target: 'interstellar', type: 'directed' },
      { source: 'nolan', target: 'tenet', type: 'directed' },
      { source: 'villeneuve', target: 'arrival', type: 'directed' },
      { source: 'inception', target: 'matrix', type: 'similar_to', properties: { reason: '현실과 가상의 경계' } },
      { source: 'interstellar', target: 'arrival', type: 'similar_to', properties: { reason: '우주, 시간, 인류' } },
    ],
    textChunks: [
      '크리스토퍼 놀란은 복잡한 서사 구조와 시간 조작을 특징으로 하는 감독입니다.',
      '인셉션은 꿈 속의 꿈을 다루며 현실과 환상의 경계를 탐구합니다.',
      '인터스텔라는 블랙홀과 시간 팽창을 과학적으로 다룬 SF 영화입니다.',
      '드니 빌뇌브의 컨택트는 외계인과의 소통을 통해 시간의 본질을 탐구합니다.',
    ],
  },
  expectedAnswer: `크리스토퍼 놀란 감독의 대표작과 유사한 영화를 추천드립니다.

**놀란 감독 대표작:**
- 인셉션 (2010): 꿈과 현실의 경계
- 인터스텔라 (2014): 우주와 시간
- 테넷 (2020): 시간 역행

**비슷한 영화 추천:**
1. **컨택트 (2016)** - 드니 빌뇌브 감독
   - 추천 이유: 인터스텔라처럼 시간과 인류의 미래를 철학적으로 다룸
   - 유사점: SF + 깊은 감정선

2. **매트릭스 (1999)** - 워쇼스키 감독
   - 추천 이유: 인셉션처럼 현실의 본질을 의심하게 만드는 구조
   - 유사점: 다층적 현실, 철학적 주제

공통 특징: 복잡한 서사, 시간/현실 조작, 과학과 철학의 결합`,
}

export const healthScenario: SampleScenario = {
  id: 'health',
  name: '의료 지식 QA',
  description: '당뇨병 관련 의료 지식 그래프 활용',
  query: '당뇨병의 합병증과 예방법을 알려주세요.',
  expectedEntities: [
    { id: 'diabetes', name: '당뇨병', type: 'concept' },
    { id: 'complication', name: '합병증', type: 'concept' },
    { id: 'prevention', name: '예방', type: 'concept' },
  ],
  graphData: {
    entities: [
      { id: 'diabetes', name: '당뇨병', type: 'concept', properties: { category: '대사질환' } },
      { id: 'retinopathy', name: '당뇨망막병증', type: 'concept', properties: { severity: '심각' } },
      { id: 'nephropathy', name: '당뇨신장병', type: 'concept', properties: { severity: '심각' } },
      { id: 'neuropathy', name: '당뇨신경병증', type: 'concept', properties: { severity: '중등도' } },
      { id: 'exercise', name: '규칙적 운동', type: 'concept', properties: { type: '예방법' } },
      { id: 'diet', name: '식이조절', type: 'concept', properties: { type: '예방법' } },
      { id: 'insulin', name: '인슐린', type: 'concept', properties: { type: '호르몬' } },
    ],
    relationships: [
      { source: 'diabetes', target: 'retinopathy', type: 'causes', properties: { timeframe: '10-15년' } },
      { source: 'diabetes', target: 'nephropathy', type: 'causes', properties: { timeframe: '10-20년' } },
      { source: 'diabetes', target: 'neuropathy', type: 'causes', properties: { timeframe: '5-10년' } },
      { source: 'exercise', target: 'diabetes', type: 'prevents' },
      { source: 'diet', target: 'diabetes', type: 'prevents' },
      { source: 'diabetes', target: 'insulin', type: 'affects', properties: { mechanism: '인슐린 저항성' } },
    ],
    textChunks: [
      '당뇨병은 혈당 조절 기능의 이상으로 발생하는 대사 질환입니다.',
      '당뇨망막병증은 눈의 망막 혈관이 손상되어 시력을 잃을 수 있는 심각한 합병증입니다.',
      '규칙적인 운동과 균형 잡힌 식단은 당뇨병 예방에 가장 효과적인 방법입니다.',
      '당뇨신장병은 신장 기능이 저하되는 합병증으로, 투석이 필요할 수 있습니다.',
    ],
  },
  expectedAnswer: `당뇨병의 합병증과 예방법을 Knowledge Graph 기반으로 정리합니다.

**주요 합병증:**
1. **당뇨망막병증** (10-15년 후 발생 가능)
   - 망막 혈관 손상으로 시력 저하/실명 위험
   - 정기적인 안과 검진 필요

2. **당뇨신장병** (10-20년 후 발생 가능)
   - 신장 기능 저하, 심하면 투석 필요
   - 혈압/혈당 관리가 중요

3. **당뇨신경병증** (5-10년 후 발생 가능)
   - 말초신경 손상으로 감각 이상
   - 발 관리 주의 필요

**예방법:**
1. **규칙적 운동**: 주 150분 이상 중등도 유산소 운동
2. **식이조절**: 정제 탄수화물 제한, 섬유질 섭취 증가
3. **체중 관리**: 적정 체중 유지
4. **정기 검진**: 혈당, HbA1c 정기 모니터링

⚠️ 이 정보는 참고용이며, 정확한 진단과 치료는 전문의와 상담하세요.`,
}

export const sampleScenarios = {
  company: companyScenario,
  movie: movieScenario,
  health: healthScenario,
}

export type ScenarioKey = keyof typeof sampleScenarios
