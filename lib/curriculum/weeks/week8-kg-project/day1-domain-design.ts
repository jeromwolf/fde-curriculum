// Week 8 Day 1: 도메인 KG 설계

import type { Day } from './types'
import { createVideoTask, createReadingTask, createCodeTask } from './types'

const task1 = createVideoTask('w8d1-project-overview', '캡스톤 프로젝트 개요', 20, {
  introduction: `
## Phase 3 캡스톤 프로젝트

### 프로젝트 목표

Phase 3에서 학습한 모든 기술을 통합하여
**실제 도메인에 적용 가능한 Knowledge Graph 시스템**을 구축합니다.

### 선택 가능한 도메인

| 도메인 | 난이도 | 데이터 소스 |
|--------|--------|------------|
| 뉴스/미디어 | ★★☆ | 네이버 뉴스, RSS |
| 금융/투자 | ★★★ | DART, Yahoo Finance |
| 기술/오픈소스 | ★★☆ | GitHub, StackOverflow |
| 의료/헬스케어 | ★★★ | PubMed, 의약품 DB |
| 전자상거래 | ★★☆ | 상품 리뷰, 가격 비교 |

### 필수 구현 요소

1. **도메인 온톨로지 설계**
2. **데이터 수집 파이프라인**
3. **Knowledge Graph 구축**
4. **GraphRAG Q&A 시스템**
5. **웹 인터페이스 (Streamlit)**
6. **프로덕션 배포**

### 평가 기준

| 영역 | 비중 | 세부 항목 |
|------|------|----------|
| 설계 | 20% | 온톨로지, 스키마 |
| 구현 | 40% | KG 구축, RAG 통합 |
| 품질 | 20% | 테스트, 문서화 |
| 발표 | 20% | 데모, 설명 |
`,
  keyPoints: ['5개 도메인 중 선택', '6가지 필수 구현 요소', '20/40/20/20 평가 비중'],
  practiceGoal: '프로젝트 범위와 요구사항 이해',
})

const task2 = createReadingTask('w8d1-domain-selection', '도메인 선택 가이드', 25, {
  introduction: `
## 도메인 선택 가이드

### 도메인별 상세 분석

#### 1. 뉴스/미디어 도메인 (추천)

**온톨로지 설계**:
\`\`\`
Entity Types:
- Article (뉴스 기사)
- Person (인물)
- Organization (기관)
- Location (장소)
- Event (이벤트)
- Topic (주제)

Relations:
- Article → mentions → Person/Organization
- Person → affiliated_with → Organization
- Article → covers → Event
- Event → occurred_at → Location
\`\`\`

**데이터 소스**:
- 네이버 뉴스 API
- RSS 피드
- 웹 스크래핑

**강점**: 풍부한 데이터, 명확한 엔티티, NER 활용

#### 2. 금융/투자 도메인

**온톨로지 설계**:
\`\`\`
Entity Types:
- Company (기업)
- Industry (산업)
- FinancialMetric (재무지표)
- Analyst (애널리스트)
- Report (리포트)

Relations:
- Company → belongs_to → Industry
- Company → competes_with → Company
- Report → analyzes → Company
- Analyst → authored → Report
\`\`\`

**데이터 소스**:
- DART 전자공시
- Yahoo Finance API
- 증권사 리포트

**강점**: 구조화된 데이터, 정량적 분석 가능

#### 3. 기술/오픈소스 도메인

**온톨로지 설계**:
\`\`\`
Entity Types:
- Repository (저장소)
- Developer (개발자)
- Technology (기술)
- Issue (이슈)
- Commit (커밋)

Relations:
- Repository → uses → Technology
- Developer → contributes_to → Repository
- Issue → fixed_by → Commit
- Repository → depends_on → Repository
\`\`\`

**데이터 소스**:
- GitHub API
- StackOverflow API
- npm/PyPI

**강점**: API 접근 용이, 개발자 친화적
`,
  keyPoints: ['도메인별 온톨로지 구조', '주요 엔티티와 관계', '데이터 소스와 강점'],
  practiceGoal: '프로젝트 도메인 선택',
})

const task3 = createCodeTask('w8d1-ontology-design', '실습: 온톨로지 설계', 60, {
  introduction: `
## 왜 배우는가?

**문제**: 비구조화된 데이터(뉴스, 문서)에서 엔티티와 관계를 어떻게 체계적으로 표현할까?

온톨로지는 도메인 지식의 "설계도"입니다. 건축가가 건물을 짓기 전 설계도를 그리듯, KG를 구축하기 전 온톨로지를 설계합니다.

**비유**: 온톨로지 = 데이터베이스 스키마 + 의미론적 규칙
- 스키마: "어떤 테이블(엔티티), 어떤 컬럼(속성), 어떤 관계가 있나?"
- 의미론: "이 관계는 대칭적인가? 추이적인가?"

---

## 온톨로지 설계 실습

### 핵심 설계 원칙

\`\`\`python
# domain_ontology.py

from dataclasses import dataclass
from typing import List, Optional
from enum import Enum

# 📌 Step 1: 엔티티 타입 정의
class EntityType(Enum):
    """도메인 엔티티 타입"""
    ARTICLE = "Article"
    PERSON = "Person"
    ORGANIZATION = "Organization"
    LOCATION = "Location"

@dataclass
class Entity:
    """기본 엔티티 구조"""
    uri: str           # 고유 식별자 (예: news:Person_홍길동)
    type: EntityType
    name: str
    aliases: List[str] = None  # 별칭 (예: "삼성", "Samsung")
    properties: dict = None

# 📌 Step 2: 관계 타입 정의
class RelationType(Enum):
    """도메인 관계 타입"""
    MENTIONS = "mentions"
    AFFILIATED_WITH = "affiliated_with"
    COVERS = "covers"

@dataclass
class Relation:
    """관계 정의"""
    type: RelationType
    source_types: List[EntityType]  # 허용되는 주어 타입
    target_types: List[EntityType]  # 허용되는 목적어 타입
    description: str
    is_symmetric: bool = False      # 대칭적 관계인가?
    is_transitive: bool = False     # 추이적 관계인가?

# 📌 Step 3: 온톨로지 정의
DOMAIN_ONTOLOGY = {
    "name": "뉴스/미디어 Knowledge Graph",
    "version": "1.0.0",
    "entities": [
        Entity(
            uri="news:EntityType_Article",
            type=EntityType.ARTICLE,
            name="뉴스 기사",
            properties={"title": "str", "content": "str", "url": "str"}
        ),
        Entity(
            uri="news:EntityType_Person",
            type=EntityType.PERSON,
            name="인물",
            properties={"name": "str", "title": "str"}
        ),
    ],
    "relations": [
        Relation(
            type=RelationType.MENTIONS,
            source_types=[EntityType.ARTICLE],
            target_types=[EntityType.PERSON, EntityType.ORGANIZATION],
            description="기사가 특정 인물/기관을 언급"
        ),
    ]
}

# 📌 Step 4: Neo4j 스키마 자동 생성
def generate_neo4j_constraints():
    """Neo4j 제약조건 DDL 생성"""
    constraints = []
    for entity in DOMAIN_ONTOLOGY["entities"]:
        constraints.append(
            f"CREATE CONSTRAINT {entity.type.value.lower()}_uri "
            f"IF NOT EXISTS FOR (n:{entity.type.value}) REQUIRE n.uri IS UNIQUE"
        )
    return constraints
\`\`\`
`,
  keyPoints: [
    '🔑 Enum으로 타입 안전성 확보 - 오타 방지',
    '🏗️ dataclass로 구조 정의 - 명확한 스키마',
    '⚙️ Neo4j 스키마 자동 생성 - DRY 원칙',
    '🔄 대칭/추이적 관계 설정 - 추론 규칙 기반',
  ],
  practiceGoal: '도메인 온톨로지 설계 문서 작성',
  codeExample: `# 📌 Step 5: 온톨로지 검증
print("엔티티 타입:", [e.type.value for e in DOMAIN_ONTOLOGY["entities"]])
print("관계 타입:", [r.type.value for r in DOMAIN_ONTOLOGY["relations"]])

# Neo4j 스키마 생성
constraints = generate_neo4j_constraints()
print("\\nNeo4j 제약조건:")
for c in constraints[:2]:  # 처음 2개만 표시
    print(f"  {c}")`,
})

const task4 = createCodeTask('w8d1-schema-validation', '실습: 스키마 검증', 45, {
  introduction: `
## 왜 배우는가?

**문제**: 온톨로지 설계 실수(오타, 일관성 오류)를 프로덕션 전에 어떻게 발견할까?

**비유**: 스키마 검증 = 건축물 안전 검사
- 건축: 건물 완성 전 철근/콘크리트 강도 검사
- KG: 데이터 추가 전 온톨로지 무결성 검사

---

## 스키마 검증 시스템

\`\`\`python
from typing import List, Tuple

class OntologyValidator:
    """온톨로지 스키마 검증기"""

    def __init__(self, ontology: dict):
        self.ontology = ontology
        self.errors = []
        self.warnings = []

    # 📌 Step 1: 전체 검증
    def validate(self) -> Tuple[bool, List[str], List[str]]:
        """전체 검증 실행"""
        self._validate_entities()
        self._validate_relations()
        self._validate_coverage()

        is_valid = len(self.errors) == 0
        return is_valid, self.errors, self.warnings

    # 📌 Step 2: 엔티티 검증
    def _validate_entities(self):
        """엔티티 중복/누락 검사"""
        entity_types = set()
        for entity in self.ontology.get("entities", []):
            # 중복 검사
            if entity.type in entity_types:
                self.errors.append(f"중복 엔티티: {entity.type}")
            entity_types.add(entity.type)

            # 필수 속성 검사
            if not entity.name:
                self.errors.append(f"이름 누락: {entity.uri}")

    # 📌 Step 3: 관계 검증
    def _validate_relations(self):
        """관계 타입 일관성 검증"""
        entity_types = {e.type for e in self.ontology.get("entities", [])}

        for relation in self.ontology.get("relations", []):
            # 관계의 source/target이 정의된 엔티티인지 확인
            for src in relation.source_types:
                if src not in entity_types:
                    self.errors.append(
                        f"관계 '{relation.type}'의 source '{src}' 미정의"
                    )

    # 📌 Step 4: 커버리지 검증
    def _validate_coverage(self):
        """고립된 엔티티(관계 없는 엔티티) 찾기"""
        used_types = set()
        for relation in self.ontology.get("relations", []):
            used_types.update(relation.source_types)
            used_types.update(relation.target_types)

        all_types = {e.type for e in self.ontology.get("entities", [])}
        orphan_types = all_types - used_types

        if orphan_types:
            self.warnings.append(f"고립 엔티티: {orphan_types}")

# 📌 Step 5: 스키마 문서 자동 생성
def generate_schema_markdown(ontology: dict) -> str:
    """마크다운 형식 스키마 문서 생성"""
    lines = [
        f"# {ontology['name']}",
        f"",
        f"## 엔티티 타입",
        f"| 타입 | 이름 | 속성 |",
        f"|------|------|------|",
    ]

    for entity in ontology["entities"]:
        props = ", ".join(entity.properties.keys()) if entity.properties else "-"
        lines.append(f"| {entity.type.value} | {entity.name} | {props} |")

    return "\\n".join(lines)
\`\`\`
`,
  keyPoints: [
    '✅ 엔티티 중복/누락 자동 검사',
    '🔗 관계 타입 일관성 검증 - 참조 무결성',
    '📊 커버리지 검증 - 고립 엔티티 찾기',
    '📄 마크다운 문서 자동 생성',
  ],
  practiceGoal: '온톨로지 검증 시스템 구현',
  codeExample: `# 📌 Step 6: 검증 실행
validator = OntologyValidator(DOMAIN_ONTOLOGY)
is_valid, errors, warnings = validator.validate()

print(f"검증 결과: {'✅ 통과' if is_valid else '❌ 실패'}")
print(f"오류: {len(errors)}개, 경고: {len(warnings)}개")

# 스키마 문서 생성
doc = generate_schema_markdown(DOMAIN_ONTOLOGY)
print("\\n", doc[:200])  # 처음 200자만 표시`,
})

const task5 = createReadingTask('w8d1-project-setup', '프로젝트 환경 설정', 30, {
  introduction: `
## 프로젝트 환경 설정

### 디렉토리 구조

\`\`\`
my-kg-project/
├── README.md
├── requirements.txt
├── .env.example
├── .gitignore
│
├── ontology/
│   ├── __init__.py
│   ├── schema.py          # 온톨로지 정의
│   ├── validator.py       # 스키마 검증
│   └── SCHEMA.md          # 스키마 문서
│
├── data/
│   ├── __init__.py
│   ├── collectors/        # 데이터 수집
│   │   ├── news.py
│   │   └── api.py
│   ├── processors/        # 데이터 처리
│   │   ├── cleaner.py
│   │   └── extractor.py
│   └── raw/               # 원본 데이터
│
├── kg/
│   ├── __init__.py
│   ├── builder.py         # KG 구축
│   ├── query.py           # SPARQL-like 쿼리
│   └── visualizer.py      # 시각화
│
├── rag/
│   ├── __init__.py
│   ├── graphrag.py        # GraphRAG 엔진
│   ├── text2cypher.py     # Text2Cypher
│   └── response.py        # 응답 생성
│
├── app/
│   ├── streamlit_app.py   # 웹 UI
│   └── api.py             # REST API
│
├── tests/
│   ├── test_ontology.py
│   ├── test_kg.py
│   └── test_rag.py
│
└── scripts/
    ├── setup_neo4j.py
    ├── seed_data.py
    └── run_pipeline.py
\`\`\`

### requirements.txt

\`\`\`
# Core
python-dotenv>=1.0.0
pydantic>=2.0.0

# Neo4j
neo4j>=5.0.0

# LangChain
langchain>=0.1.0
langchain-openai>=0.0.5
langchain-community>=0.0.10

# Data Processing
pandas>=2.0.0
beautifulsoup4>=4.12.0
requests>=2.31.0

# Web UI
streamlit>=1.30.0
plotly>=5.0.0

# Visualization
pyvis>=0.3.0

# Testing
pytest>=7.0.0

# Development
black>=23.0.0
ruff>=0.1.0
\`\`\`

### .env.example

\`\`\`bash
# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

# OpenAI
OPENAI_API_KEY=sk-...

# Data Sources
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_secret
\`\`\`

### Git 초기화

\`\`\`bash
# 프로젝트 생성
mkdir my-kg-project && cd my-kg-project

# Git 초기화
git init

# .gitignore 설정
echo ".env
__pycache__/
*.pyc
.pytest_cache/
data/raw/
.vscode/" > .gitignore

# 초기 커밋
git add .
git commit -m "Initial project structure"
\`\`\`
`,
  keyPoints: ['모듈별 디렉토리 분리', 'requirements.txt 의존성 관리', '.env로 비밀 정보 관리'],
  practiceGoal: '프로젝트 환경 설정 완료',
})

export const day1DomainDesign: Day = {
  slug: 'domain-design',
  title: '도메인 KG 설계',
  totalDuration: 180,
  tasks: [task1, task2, task3, task4, task5],
}
