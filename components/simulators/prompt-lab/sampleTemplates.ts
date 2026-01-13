import { PromptTemplate, PromptTechnique } from './types'

export const promptTemplates: PromptTemplate[] = [
  // Zero-Shot Templates
  {
    id: 'zero-shot-classification',
    name: '감정 분류 (Zero-Shot)',
    description: '예시 없이 텍스트의 감정을 분류합니다.',
    technique: 'zero-shot',
    category: 'classification',
    systemPrompt: '당신은 텍스트 감정 분석 전문가입니다. 주어진 텍스트의 감정을 정확하게 분류하세요.',
    userPromptTemplate: `다음 텍스트의 감정을 분류하세요.
텍스트: "{{text}}"

감정: [긍정/부정/중립] 중 하나만 선택하세요.`,
    variables: ['text'],
    tips: [
      '명확한 분류 기준을 제시하세요',
      '출력 형식을 구체적으로 지정하세요',
      '모호한 표현을 피하세요',
    ],
  },
  {
    id: 'zero-shot-summarization',
    name: '텍스트 요약 (Zero-Shot)',
    description: '긴 텍스트를 간결하게 요약합니다.',
    technique: 'zero-shot',
    category: 'summarization',
    systemPrompt: '당신은 전문 에디터입니다. 핵심 내용을 놓치지 않으면서 간결하게 요약하세요.',
    userPromptTemplate: `다음 텍스트를 3문장 이내로 요약하세요.

텍스트:
{{text}}

요약:`,
    variables: ['text'],
    tips: [
      '요약 길이를 명시하세요',
      '핵심 정보 유지를 강조하세요',
      '원문의 톤을 유지하도록 지시하세요',
    ],
  },

  // Few-Shot Templates
  {
    id: 'few-shot-ner',
    name: '개체명 인식 (Few-Shot)',
    description: '예시를 통해 텍스트에서 개체명을 추출합니다.',
    technique: 'few-shot',
    category: 'extraction',
    systemPrompt: '당신은 텍스트에서 개체명(인물, 조직, 장소)을 추출하는 전문가입니다.',
    userPromptTemplate: `텍스트에서 개체명을 추출하세요.

예시 1:
텍스트: "삼성전자 이재용 회장이 서울 삼성타운에서 기자회견을 열었다."
개체명:
- 인물: 이재용
- 조직: 삼성전자
- 장소: 서울, 삼성타운

예시 2:
텍스트: "네이버 김기사 CEO가 판교 그린팩토리에서 신제품을 발표했다."
개체명:
- 인물: 김기사
- 조직: 네이버
- 장소: 판교, 그린팩토리

이제 다음 텍스트에서 개체명을 추출하세요:
텍스트: "{{text}}"
개체명:`,
    variables: ['text'],
    examples: [
      {
        input: '삼성전자 이재용 회장이 서울 삼성타운에서 기자회견을 열었다.',
        output: '인물: 이재용, 조직: 삼성전자, 장소: 서울, 삼성타운',
      },
      {
        input: '네이버 김기사 CEO가 판교 그린팩토리에서 신제품을 발표했다.',
        output: '인물: 김기사, 조직: 네이버, 장소: 판교, 그린팩토리',
      },
    ],
    tips: [
      '일관된 형식의 예시를 제공하세요',
      '다양한 케이스를 커버하는 예시를 선택하세요',
      '3-5개의 예시가 적당합니다',
    ],
  },
  {
    id: 'few-shot-translation',
    name: '스타일 번역 (Few-Shot)',
    description: '특정 스타일로 번역하는 방법을 학습합니다.',
    technique: 'few-shot',
    category: 'translation',
    systemPrompt: '당신은 캐주얼한 말투로 번역하는 번역가입니다. 친근하고 자연스러운 한국어로 번역하세요.',
    userPromptTemplate: `영어를 캐주얼한 한국어로 번역하세요.

예시:
English: "I'm really excited about this project!"
한국어: "이 프로젝트 진짜 기대돼!"

English: "Could you please help me with this?"
한국어: "이거 좀 도와줄 수 있어?"

English: "That's an interesting perspective."
한국어: "오 그런 시각도 있구나!"

이제 번역하세요:
English: "{{text}}"
한국어:`,
    variables: ['text'],
    tips: [
      '원하는 스타일/톤을 예시로 명확히 보여주세요',
      '일관된 스타일의 예시를 제공하세요',
      '다양한 문장 구조를 커버하세요',
    ],
  },

  // Chain-of-Thought Templates
  {
    id: 'cot-math',
    name: '수학 문제 풀이 (CoT)',
    description: '단계별 추론으로 수학 문제를 해결합니다.',
    technique: 'chain-of-thought',
    category: 'reasoning',
    systemPrompt: '당신은 수학 교사입니다. 문제를 단계별로 풀이하며 설명하세요.',
    userPromptTemplate: `다음 수학 문제를 단계별로 풀어주세요.

문제: {{problem}}

풀이 과정을 단계별로 설명한 후, 최종 답을 제시하세요.

단계 1:
단계 2:
...
최종 답:`,
    variables: ['problem'],
    tips: [
      '"단계별로", "차근차근" 같은 표현을 사용하세요',
      '중간 과정을 명시적으로 요청하세요',
      '최종 답을 별도로 표시하게 하세요',
    ],
  },
  {
    id: 'cot-reasoning',
    name: '논리적 추론 (CoT)',
    description: '복잡한 논리 문제를 단계별로 해결합니다.',
    technique: 'chain-of-thought',
    category: 'reasoning',
    systemPrompt: '당신은 논리적 사고의 전문가입니다. 주어진 정보를 바탕으로 단계별로 추론하세요.',
    userPromptTemplate: `다음 상황을 분석하고 결론을 도출하세요.

상황: {{situation}}

다음 단계를 따라 추론하세요:
1. 주어진 사실 정리
2. 각 사실에서 도출할 수 있는 추론
3. 추론들을 종합한 결론

분석:`,
    variables: ['situation'],
    tips: [
      '추론 단계를 명시적으로 구조화하세요',
      '"Let\'s think step by step" 패턴이 효과적입니다',
      '중간 결론을 검증하도록 유도하세요',
    ],
  },

  // Role-Playing Templates
  {
    id: 'role-code-reviewer',
    name: '코드 리뷰어 (Role-Playing)',
    description: '시니어 개발자 역할로 코드를 리뷰합니다.',
    technique: 'role-playing',
    category: 'code-generation',
    systemPrompt: `당신은 10년 경력의 시니어 소프트웨어 엔지니어입니다.
FAANG 출신으로 코드 품질, 성능, 보안에 대한 깊은 이해를 가지고 있습니다.
친절하지만 엄격한 코드 리뷰를 제공합니다.`,
    userPromptTemplate: `다음 코드를 리뷰해주세요.

\`\`\`{{language}}
{{code}}
\`\`\`

다음 관점에서 리뷰해주세요:
1. 코드 품질 및 가독성
2. 잠재적 버그 또는 에러
3. 성능 개선점
4. 보안 취약점
5. 개선 제안

리뷰:`,
    variables: ['language', 'code'],
    tips: [
      '구체적인 전문성과 경력을 부여하세요',
      '역할의 성격과 스타일을 정의하세요',
      '맥락에 맞는 전문 지식을 활용하게 하세요',
    ],
  },
  {
    id: 'role-interviewer',
    name: '면접관 (Role-Playing)',
    description: '기술 면접관 역할로 질문하고 평가합니다.',
    technique: 'role-playing',
    category: 'reasoning',
    systemPrompt: `당신은 구글의 시니어 엔지니어링 매니저입니다.
기술 면접을 진행하며, 지원자의 문제 해결 능력과 사고 과정을 평가합니다.
힌트를 주며 지원자를 올바른 방향으로 유도할 수 있습니다.`,
    userPromptTemplate: `{{topic}} 주제로 기술 면접 질문을 3개 생성하고, 각 질문에 대한 모범 답안과 평가 기준을 제시해주세요.

난이도: {{difficulty}}

질문 1:
모범 답안:
평가 기준:

질문 2:
...`,
    variables: ['topic', 'difficulty'],
    tips: [
      '역할의 소속과 직책을 명시하세요',
      '역할이 가진 목표와 동기를 설정하세요',
      '상호작용 스타일을 정의하세요',
    ],
  },

  // Structured Output Templates
  {
    id: 'structured-json',
    name: 'JSON 구조화 출력',
    description: '정보를 JSON 형식으로 구조화하여 출력합니다.',
    technique: 'structured-output',
    category: 'extraction',
    systemPrompt: '당신은 데이터 구조화 전문가입니다. 주어진 정보를 정확한 JSON 형식으로 변환하세요.',
    userPromptTemplate: `다음 텍스트에서 정보를 추출하여 JSON 형식으로 출력하세요.

텍스트: "{{text}}"

다음 JSON 스키마를 따르세요:
{
  "name": "이름",
  "age": 나이(숫자),
  "occupation": "직업",
  "location": "위치",
  "skills": ["스킬1", "스킬2"]
}

JSON 출력:`,
    variables: ['text'],
    tips: [
      'JSON 스키마를 명시적으로 제공하세요',
      '데이터 타입을 명확히 지정하세요',
      '필수/선택 필드를 구분하세요',
    ],
  },
  {
    id: 'structured-markdown',
    name: 'Markdown 보고서',
    description: '정보를 Markdown 형식의 보고서로 구조화합니다.',
    technique: 'structured-output',
    category: 'text-generation',
    systemPrompt: '당신은 기술 문서 작성 전문가입니다. 명확하고 구조화된 Markdown 문서를 작성하세요.',
    userPromptTemplate: `다음 주제에 대한 기술 보고서를 Markdown 형식으로 작성하세요.

주제: {{topic}}

다음 구조를 따르세요:
# 제목
## 개요
## 주요 내용
### 섹션 1
### 섹션 2
## 결론
## 참고 자료

보고서:`,
    variables: ['topic'],
    tips: [
      '원하는 출력 형식을 템플릿으로 제시하세요',
      '각 섹션의 목적을 명시하세요',
      '예시 출력을 제공하면 더 효과적입니다',
    ],
  },

  // Creative Templates
  {
    id: 'creative-story',
    name: '창작 스토리',
    description: '주어진 요소로 창의적인 스토리를 생성합니다.',
    technique: 'zero-shot',
    category: 'creative',
    systemPrompt: '당신은 베스트셀러 소설가입니다. 몰입감 있고 감동적인 스토리를 작성하세요.',
    userPromptTemplate: `다음 요소를 포함한 짧은 스토리를 작성해주세요.

장르: {{genre}}
주인공: {{protagonist}}
배경: {{setting}}
갈등: {{conflict}}

스토리 (500자 내외):`,
    variables: ['genre', 'protagonist', 'setting', 'conflict'],
    tips: [
      '구체적인 제약 조건을 설정하세요',
      '창의성을 자극하는 요소를 제공하세요',
      '길이나 형식을 명시하세요',
    ],
  },
]

// Technique descriptions
export const techniqueDescriptions: Record<PromptTechnique, { title: string; description: string; bestFor: string[] }> = {
  'zero-shot': {
    title: 'Zero-Shot Prompting',
    description: '예시 없이 직접 지시만으로 작업을 수행합니다. 간단한 작업에 효과적입니다.',
    bestFor: ['간단한 분류', '텍스트 요약', '번역', '질문 답변'],
  },
  'few-shot': {
    title: 'Few-Shot Prompting',
    description: '몇 개의 예시를 제공하여 패턴을 학습하게 합니다. 복잡한 형식이 필요할 때 유용합니다.',
    bestFor: ['특정 형식 출력', '스타일 모방', '개체명 인식', '감정 분석'],
  },
  'chain-of-thought': {
    title: 'Chain-of-Thought (CoT)',
    description: '단계별 추론을 유도하여 복잡한 문제를 해결합니다. 수학, 논리 문제에 효과적입니다.',
    bestFor: ['수학 문제', '논리 추론', '의사결정', '복잡한 분석'],
  },
  'role-playing': {
    title: 'Role-Playing',
    description: '특정 역할을 부여하여 전문성과 일관된 관점을 유지하게 합니다.',
    bestFor: ['전문가 조언', '코드 리뷰', '교육 콘텐츠', '시뮬레이션'],
  },
  'structured-output': {
    title: 'Structured Output',
    description: '특정 형식(JSON, XML, Markdown 등)으로 출력을 구조화합니다.',
    bestFor: ['데이터 추출', 'API 응답', '문서 생성', '보고서'],
  },
  'self-consistency': {
    title: 'Self-Consistency',
    description: '같은 질문에 여러 번 답하게 하고 가장 일관된 답을 선택합니다.',
    bestFor: ['불확실한 추론', '정확도 향상', '검증이 필요한 작업'],
  },
  'tree-of-thought': {
    title: 'Tree-of-Thought (ToT)',
    description: '여러 추론 경로를 탐색하고 평가하여 최적의 해를 찾습니다.',
    bestFor: ['복잡한 문제 해결', '창의적 작업', '전략 수립'],
  },
}

// Prompt engineering best practices
export const bestPractices = [
  { title: '명확하고 구체적으로', description: '모호한 표현을 피하고 원하는 것을 정확히 설명하세요.' },
  { title: '출력 형식 지정', description: '원하는 출력 형식을 명시하면 일관된 결과를 얻을 수 있습니다.' },
  { title: '맥락 제공', description: '충분한 배경 정보를 제공하여 더 정확한 응답을 유도하세요.' },
  { title: '단계적 지시', description: '복잡한 작업은 여러 단계로 나누어 지시하세요.' },
  { title: '제약 조건 설정', description: '길이, 톤, 형식 등의 제약을 명시하세요.' },
  { title: '예시 활용', description: '원하는 출력의 예시를 제공하면 품질이 향상됩니다.' },
]

// Sample responses for simulation
export const sampleResponses: Record<string, string> = {
  'zero-shot-classification': '감정: 긍정\n\n분석: 해당 텍스트에서 긍정적인 어조와 만족감을 나타내는 표현이 사용되었습니다.',
  'zero-shot-summarization': '주어진 텍스트의 핵심 내용을 3문장으로 요약했습니다. 주요 논점과 결론을 포함하며, 원문의 의도를 유지했습니다.',
  'few-shot-ner': '- 인물: [추출된 인물명]\n- 조직: [추출된 조직명]\n- 장소: [추출된 장소명]',
  'cot-math': '단계 1: 문제에서 주어진 정보 정리\n단계 2: 필요한 공식 적용\n단계 3: 계산 수행\n단계 4: 검증\n\n최종 답: [계산 결과]',
  'role-code-reviewer': '## 코드 리뷰 결과\n\n### 1. 코드 품질\n- 가독성이 좋습니다.\n- 변수명이 명확합니다.\n\n### 2. 개선 제안\n- 에러 처리 추가 권장\n- 성능 최적화 가능',
}
