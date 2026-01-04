// Week 8 Day 2: 데이터 수집 및 정제

import type { Day } from './types'
import { createVideoTask, createCodeTask, createReadingTask } from './types'

const task1 = createVideoTask('w8d2-data-sources', '도메인별 데이터 소스', 20, {
  introduction: `
## 도메인별 데이터 소스

### 뉴스/미디어 데이터 소스

| 소스 | 접근 방식 | 제한 사항 |
|------|----------|----------|
| 네이버 뉴스 API | REST API | 일 25,000건 |
| RSS 피드 | XML 파싱 | 최신 기사만 |
| 웹 스크래핑 | BeautifulSoup | robots.txt 준수 |

### 금융 데이터 소스

| 소스 | 접근 방식 | 제한 사항 |
|------|----------|----------|
| DART 전자공시 | REST API | 무료 |
| Yahoo Finance | yfinance 라이브러리 | 비공식 |
| KRX 한국거래소 | 웹 스크래핑 | 제한적 |

### 기술 데이터 소스

| 소스 | 접근 방식 | 제한 사항 |
|------|----------|----------|
| GitHub API | REST/GraphQL | 시간당 5,000건 |
| StackOverflow | API | 일 10,000건 |
| npm Registry | REST API | 무제한 |

### API 인증 방식

1. **API Key**: 네이버, OpenAI
2. **OAuth**: GitHub
3. **토큰 기반**: DART
4. **무인증**: RSS, 공개 API
`,
  keyPoints: ['도메인별 주요 데이터 소스', 'API 제한 사항 숙지', '인증 방식별 구현'],
  practiceGoal: '프로젝트 데이터 소스 결정',
})

const task2 = createCodeTask('w8d2-collector', '실습: 데이터 수집기 구현', 60, {
  introduction: `
## 왜 배우는가?

**문제**: 여러 API(네이버 뉴스, GitHub, RSS)에서 데이터를 수집할 때 중복 코드를 어떻게 줄일까?

**비유**: 데이터 수집기 = 전기 플러그 표준
- 모든 전자기기가 같은 플러그를 씀 → 벽 콘센트 하나로 충분
- 모든 수집기가 같은 인터페이스를 씀 → 공통 로직(rate limiting, retry) 재사용

---

## 데이터 수집기 구현

### 기본 수집기 클래스

\`\`\`python
# data/collectors/base.py

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import List
import time

# 📌 Step 1: 데이터 구조 정의
@dataclass
class CollectedItem:
    """수집된 데이터 아이템"""
    id: str
    source: str
    title: str
    content: str
    url: str
    published_date: datetime

# 📌 Step 2: 기본 수집기 클래스 (추상 클래스)
class BaseCollector(ABC):
    """데이터 수집기 기본 클래스"""

    def __init__(self, name: str, rate_limit: float = 1.0):
        self.name = name
        self.rate_limit = rate_limit  # 초당 요청 수
        self.last_request_time = 0

    def _rate_limit(self):
        """Rate limiting 적용"""
        elapsed = time.time() - self.last_request_time
        wait_time = (1 / self.rate_limit) - elapsed
        if wait_time > 0:
            time.sleep(wait_time)
        self.last_request_time = time.time()

    @abstractmethod
    def collect(self, query: str, limit: int = 100) -> List[CollectedItem]:
        """데이터 수집 (서브클래스에서 구현)"""
        pass

    # 📌 Step 3: 재시도 로직
    def collect_with_retry(self, query: str, limit: int = 100) -> List[CollectedItem]:
        """재시도 로직 포함 수집"""
        for attempt in range(3):
            try:
                self._rate_limit()
                return self.collect(query, limit)
            except Exception as e:
                if attempt < 2:
                    time.sleep(2 ** attempt)  # Exponential backoff
        return []

# 📌 Step 4: 네이버 뉴스 수집기 구현
import requests

class NaverNewsCollector(BaseCollector):
    """네이버 뉴스 수집기"""
    BASE_URL = "https://openapi.naver.com/v1/search/news.json"

    def __init__(self, client_id: str, client_secret: str):
        super().__init__("naver_news", rate_limit=10)
        self.headers = {
            "X-Naver-Client-Id": client_id,
            "X-Naver-Client-Secret": client_secret
        }

    def collect(self, query: str, limit: int = 100) -> List[CollectedItem]:
        items = []
        params = {"query": query, "display": min(limit, 100), "sort": "date"}

        response = requests.get(self.BASE_URL, headers=self.headers, params=params)
        response.raise_for_status()
        data = response.json()

        for item in data.get("items", []):
            items.append(CollectedItem(
                id=item.get("link"),
                source="naver_news",
                title=self._clean_html(item.get("title", "")),
                content=self._clean_html(item.get("description", "")),
                url=item.get("link", ""),
                published_date=datetime.now()
            ))

        return items[:limit]

    def _clean_html(self, text: str) -> str:
        """HTML 태그 제거"""
        import re
        return re.sub(r'<[^>]+>', '', text)
\`\`\`
`,
  keyPoints: [
    '🏗️ 추상 클래스로 공통 로직(rate limit, retry) 분리',
    '⏱️ Rate limiting 자동 적용 - API 제한 준수',
    '🔄 Exponential backoff 재시도 - 안정성 향상',
    '🔌 서브클래스는 collect()만 구현 - 재사용성',
  ],
  practiceGoal: '도메인에 맞는 수집기 구현',
  commonPitfalls: `
## 💥 Common Pitfalls (자주 하는 실수)

### 1. Rate Limiting 무시 → API 차단
**증상**: "429 Too Many Requests" 또는 API 키 정지

\`\`\`python
# ❌ 잘못된 예시: Rate limiting 없이 빠르게 호출
for query in queries:
    items.extend(collector.collect(query))  # 초당 100개 요청!

# ✅ 올바른 예시: Rate limiting 적용
class BaseCollector:
    def __init__(self, rate_limit: float = 1.0):  # 초당 1요청
        self.rate_limit = rate_limit
        self.last_request_time = 0

    def _rate_limit(self):
        elapsed = time.time() - self.last_request_time
        wait_time = (1 / self.rate_limit) - elapsed
        if wait_time > 0:
            time.sleep(wait_time)
        self.last_request_time = time.time()
\`\`\`

💡 **기억할 점**: 모든 API 호출 전 _rate_limit() 호출 필수

### 2. API 인증 정보 하드코딩
**증상**: GitHub에 푸시 후 API 키 노출

\`\`\`python
# ❌ 잘못된 예시: 코드에 직접 입력
collector = NaverNewsCollector(
    client_id="ABC123",  # 코드에 노출!
    client_secret="XYZ789"
)

# ✅ 올바른 예시: 환경 변수 사용
import os
from dotenv import load_dotenv
load_dotenv()

collector = NaverNewsCollector(
    client_id=os.getenv("NAVER_CLIENT_ID"),
    client_secret=os.getenv("NAVER_CLIENT_SECRET")
)
\`\`\`

💡 **기억할 점**: .env 파일 사용, .gitignore에 .env 추가

### 3. 예외 처리 누락으로 전체 파이프라인 중단
**증상**: 하나의 API 오류로 전체 수집 실패

\`\`\`python
# ❌ 잘못된 예시: 예외 처리 없음
def collect_all(queries):
    results = []
    for query in queries:
        items = collector.collect(query)  # 하나 실패하면 전체 중단
        results.extend(items)
    return results

# ✅ 올바른 예시: 개별 예외 처리 + 로깅
def collect_all(queries):
    results = []
    failed = []
    for query in queries:
        try:
            items = collector.collect_with_retry(query)
            results.extend(items)
        except Exception as e:
            failed.append({"query": query, "error": str(e)})
            continue  # 다음 쿼리 계속
    print(f"성공: {len(results)}, 실패: {len(failed)}")
    return results, failed
\`\`\`

💡 **기억할 점**: 개별 항목 실패는 로깅하고 계속 진행, 전체 실패만 중단
`,
  codeExample: `# 📌 Step 5: 수집기 사용
collector = NaverNewsCollector(
    client_id=os.getenv("NAVER_CLIENT_ID"),
    client_secret=os.getenv("NAVER_CLIENT_SECRET")
)

items = collector.collect_with_retry("삼성전자", limit=50)
print(f"✅ 수집 완료: {len(items)}개")
print(f"첫 번째 뉴스: {items[0].title}")`,
})

const task3 = createCodeTask('w8d2-cleaner', '실습: 데이터 정제기 구현', 50, {
  introduction: `
## 데이터 정제기 구현

### 텍스트 정제

\`\`\`python
# data/processors/cleaner.py

import re
from typing import List
from dataclasses import dataclass

@dataclass
class CleaningResult:
    """정제 결과"""
    original: str
    cleaned: str
    changes: List[str]

class TextCleaner:
    """텍스트 정제기"""

    def __init__(self):
        self.patterns = [
            (r'<[^>]+>', '', 'HTML 태그 제거'),
            (r'&[a-zA-Z]+;', ' ', 'HTML 엔티티 제거'),
            (r'http[s]?://\\S+', '', 'URL 제거'),
            (r'\\s+', ' ', '다중 공백 정리'),
            (r'^\\s+|\\s+$', '', '앞뒤 공백 제거'),
        ]

    def clean(self, text: str) -> CleaningResult:
        """텍스트 정제"""
        changes = []
        cleaned = text

        for pattern, replacement, description in self.patterns:
            if re.search(pattern, cleaned):
                cleaned = re.sub(pattern, replacement, cleaned)
                changes.append(description)

        return CleaningResult(
            original=text,
            cleaned=cleaned,
            changes=changes
        )

    def clean_batch(self, texts: List[str]) -> List[CleaningResult]:
        """배치 정제"""
        return [self.clean(text) for text in texts]
\`\`\`

### 중복 제거

\`\`\`python
# data/processors/deduplicator.py

from typing import List, Tuple
import hashlib
from difflib import SequenceMatcher

class Deduplicator:
    """중복 데이터 제거기"""

    def __init__(self, similarity_threshold: float = 0.9):
        self.threshold = similarity_threshold
        self.seen_hashes = set()

    def _get_hash(self, text: str) -> str:
        """텍스트 해시 생성"""
        normalized = text.lower().strip()
        return hashlib.md5(normalized.encode()).hexdigest()

    def _similarity(self, text1: str, text2: str) -> float:
        """텍스트 유사도 계산"""
        return SequenceMatcher(None, text1.lower(), text2.lower()).ratio()

    def is_duplicate(self, text: str) -> bool:
        """정확히 같은 텍스트 중복 검사"""
        hash_val = self._get_hash(text)
        if hash_val in self.seen_hashes:
            return True
        self.seen_hashes.add(hash_val)
        return False

    def deduplicate(
        self,
        items: List[dict],
        text_field: str = "content"
    ) -> Tuple[List[dict], List[dict]]:
        """중복 제거 (유사도 기반)"""
        unique = []
        duplicates = []

        for item in items:
            text = item.get(text_field, "")

            # 정확한 중복
            if self.is_duplicate(text):
                duplicates.append(item)
                continue

            # 유사도 기반 중복
            is_similar = False
            for unique_item in unique:
                if self._similarity(text, unique_item.get(text_field, "")) > self.threshold:
                    is_similar = True
                    duplicates.append(item)
                    break

            if not is_similar:
                unique.append(item)

        return unique, duplicates
\`\`\`

### 데이터 검증

\`\`\`python
# data/processors/validator.py

from typing import List, Tuple
from dataclasses import dataclass, field

@dataclass
class ValidationResult:
    """검증 결과"""
    is_valid: bool
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)

class DataValidator:
    """데이터 검증기"""

    def __init__(self, min_content_length: int = 50):
        self.min_content_length = min_content_length

    def validate_item(self, item: dict) -> ValidationResult:
        """단일 아이템 검증"""
        errors = []
        warnings = []

        # 필수 필드 검사
        required_fields = ["id", "title", "content"]
        for field in required_fields:
            if not item.get(field):
                errors.append(f"필수 필드 누락: {field}")

        # 콘텐츠 길이 검사
        content = item.get("content", "")
        if len(content) < self.min_content_length:
            warnings.append(f"콘텐츠 길이 부족: {len(content)}자")

        # URL 형식 검사
        url = item.get("url", "")
        if url and not url.startswith(("http://", "https://")):
            errors.append(f"잘못된 URL 형식: {url}")

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings
        )

    def validate_batch(
        self,
        items: List[dict]
    ) -> Tuple[List[dict], List[dict], List[ValidationResult]]:
        """배치 검증"""
        valid_items = []
        invalid_items = []
        results = []

        for item in items:
            result = self.validate_item(item)
            results.append(result)

            if result.is_valid:
                valid_items.append(item)
            else:
                invalid_items.append(item)

        return valid_items, invalid_items, results
\`\`\`
`,
  keyPoints: ['정규식 기반 텍스트 정제', '해시 + 유사도 기반 중복 제거', '필수 필드 검증'],
  practiceGoal: '데이터 정제 파이프라인 구축',
  codeExample: `# 정제 파이프라인
cleaner = TextCleaner()
deduplicator = Deduplicator(similarity_threshold=0.85)
validator = DataValidator(min_content_length=100)

# 1. 정제
cleaned_items = [cleaner.clean(item["content"]).cleaned for item in raw_items]

# 2. 중복 제거
unique, duplicates = deduplicator.deduplicate(items)
print(f"중복 제거: {len(duplicates)}개")

# 3. 검증
valid, invalid, _ = validator.validate_batch(unique)
print(f"유효 데이터: {len(valid)}개")`,
})

const task4 = createCodeTask('w8d2-entity-extraction', '실습: 엔티티 추출', 50, {
  introduction: `
## 왜 배우는가?

**문제**: 비구조화된 텍스트에서 엔티티(인물, 기관, 장소)와 관계를 어떻게 자동 추출할까?

**비유**: 엔티티 추출 = 형광펜으로 핵심 단어 표시
- 사람이 글을 읽으며 형광펜으로 중요 단어 표시
- LLM이 텍스트를 읽으며 엔티티/관계 태깅

---

## 엔티티 추출

### LLM 기반 NER

\`\`\`python
# data/processors/extractor.py

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from typing import List, Dict
import json

class EntityExtractor:
    """LLM 기반 엔티티 추출기"""

    def __init__(self, openai_key: str):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0,
            api_key=openai_key
        )

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """뉴스 텍스트에서 엔티티를 추출하세요.

추출할 엔티티 유형:
- Person: 인물 (이름, 직책 포함)
- Organization: 기업, 기관, 단체
- Location: 장소, 지역
- Event: 이벤트, 사건

JSON 형식으로 응답:
{{
    "entities": [
        {{"type": "Person", "name": "홍길동", "role": "CEO"}},
        {{"type": "Organization", "name": "삼성전자"}},
        ...
    ]
}}"""),
            ("human", "텍스트: {text}")
        ])

        self.chain = self.prompt | self.llm

    def extract(self, text: str) -> List[Dict]:
        """단일 텍스트에서 엔티티 추출"""
        try:
            result = self.chain.invoke({"text": text[:2000]})  # 토큰 제한
            data = json.loads(result.content)
            return data.get("entities", [])
        except Exception as e:
            print(f"추출 오류: {e}")
            return []

    def extract_batch(
        self,
        texts: List[str],
        batch_size: int = 5
    ) -> List[List[Dict]]:
        """배치 엔티티 추출"""
        all_entities = []

        for i in range(0, len(texts), batch_size):
            batch = texts[i:i+batch_size]

            for text in batch:
                entities = self.extract(text)
                all_entities.append(entities)

        return all_entities
\`\`\`

### 관계 추출

\`\`\`python
# data/processors/relation_extractor.py

class RelationExtractor:
    """LLM 기반 관계 추출기"""

    def __init__(self, openai_key: str, ontology_relations: List[str]):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0,
            api_key=openai_key
        )
        self.valid_relations = ontology_relations

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """텍스트와 엔티티 목록에서 관계를 추출하세요.

허용된 관계 유형:
{relations}

JSON 형식으로 응답:
{{
    "relations": [
        {{"subject": "삼성전자", "predicate": "affiliated_with", "object": "이재용"}},
        ...
    ]
}}

규칙:
- 허용된 관계 유형만 사용
- 텍스트에서 명시적으로 언급된 관계만 추출
- subject와 object는 엔티티 목록에 있어야 함"""),
            ("human", "텍스트: {text}\\n\\n엔티티: {entities}")
        ])

        self.chain = self.prompt | self.llm

    def extract(
        self,
        text: str,
        entities: List[Dict]
    ) -> List[Dict]:
        """텍스트에서 관계 추출"""
        try:
            entity_names = [e.get("name") for e in entities]
            result = self.chain.invoke({
                "text": text[:2000],
                "entities": json.dumps(entity_names, ensure_ascii=False),
                "relations": ", ".join(self.valid_relations)
            })
            data = json.loads(result.content)
            return data.get("relations", [])
        except Exception as e:
            print(f"관계 추출 오류: {e}")
            return []
\`\`\`

### Triple 생성

\`\`\`python
# data/processors/triple_builder.py

from dataclasses import dataclass
from typing import List
import hashlib

@dataclass
class Triple:
    """RDF Triple"""
    subject: str      # URI
    predicate: str    # URI
    object: str       # URI
    confidence: float
    source_url: str

class TripleBuilder:
    """Triple 생성기"""

    def __init__(self, namespace: str = "mykg"):
        self.namespace = namespace

    def _to_uri(self, entity_type: str, name: str) -> str:
        """엔티티를 URI로 변환"""
        safe_name = name.replace(" ", "_").replace("/", "_")
        return f"{self.namespace}:{entity_type}_{safe_name}"

    def build_triples(
        self,
        entities: List[Dict],
        relations: List[Dict],
        source_url: str,
        base_confidence: float = 0.8
    ) -> List[Triple]:
        """엔티티와 관계에서 Triple 생성"""
        triples = []

        # 엔티티 → URI 매핑
        entity_map = {}
        for entity in entities:
            uri = self._to_uri(entity["type"], entity["name"])
            entity_map[entity["name"]] = uri

        # 관계 → Triple
        for rel in relations:
            subject = entity_map.get(rel["subject"])
            obj = entity_map.get(rel["object"])

            if subject and obj:
                triples.append(Triple(
                    subject=subject,
                    predicate=f"{self.namespace}:{rel['predicate']}",
                    object=obj,
                    confidence=base_confidence,
                    source_url=source_url
                ))

        return triples
\`\`\`
`,
  keyPoints: ['GPT-4o-mini로 NER 수행', '온톨로지 기반 관계 추출', 'URI 형식 Triple 생성'],
  practiceGoal: '엔티티 및 관계 추출 파이프라인 구축',
  codeExample: `# 전체 추출 파이프라인
extractor = EntityExtractor(openai_key)
rel_extractor = RelationExtractor(openai_key, ["mentions", "affiliated_with"])
triple_builder = TripleBuilder("news")

# 뉴스에서 Triple 생성
entities = extractor.extract(news_content)
relations = rel_extractor.extract(news_content, entities)
triples = triple_builder.build_triples(entities, relations, news_url)

print(f"추출된 Triple: {len(triples)}개")`,
})

const task5 = createReadingTask('w8d2-pipeline', '데이터 파이프라인 통합', 30, {
  introduction: `
## 데이터 파이프라인 통합

### 전체 파이프라인

\`\`\`python
# scripts/run_pipeline.py

from data.collectors.news import NaverNewsCollector
from data.processors.cleaner import TextCleaner
from data.processors.deduplicator import Deduplicator
from data.processors.validator import DataValidator
from data.processors.extractor import EntityExtractor
from data.processors.relation_extractor import RelationExtractor
from data.processors.triple_builder import TripleBuilder
import os
from dotenv import load_dotenv

load_dotenv()

class DataPipeline:
    """통합 데이터 파이프라인"""

    def __init__(self):
        # 수집기
        self.collector = NaverNewsCollector(
            os.getenv("NAVER_CLIENT_ID"),
            os.getenv("NAVER_CLIENT_SECRET")
        )

        # 정제기
        self.cleaner = TextCleaner()
        self.deduplicator = Deduplicator()
        self.validator = DataValidator()

        # 추출기
        openai_key = os.getenv("OPENAI_API_KEY")
        self.entity_extractor = EntityExtractor(openai_key)
        self.relation_extractor = RelationExtractor(
            openai_key,
            ["mentions", "affiliated_with", "competes_with"]
        )
        self.triple_builder = TripleBuilder("news")

    def run(self, query: str, limit: int = 50) -> list:
        """파이프라인 실행"""
        print(f"[1/5] 데이터 수집: {query}")
        items = self.collector.collect_with_retry(query, limit)
        print(f"  → {len(items)}개 수집")

        print("[2/5] 텍스트 정제")
        for item in items:
            result = self.cleaner.clean(item.content)
            item.content = result.cleaned
        print(f"  → 정제 완료")

        print("[3/5] 중복 제거")
        items_dict = [{"id": i.id, "content": i.content} for i in items]
        unique, duplicates = self.deduplicator.deduplicate(items_dict)
        print(f"  → {len(unique)}개 유니크 ({len(duplicates)}개 중복)")

        print("[4/5] 엔티티/관계 추출")
        all_triples = []
        for item in items[:10]:  # 비용 제한
            entities = self.entity_extractor.extract(item.content)
            relations = self.relation_extractor.extract(item.content, entities)
            triples = self.triple_builder.build_triples(
                entities, relations, item.url
            )
            all_triples.extend(triples)
        print(f"  → {len(all_triples)}개 Triple 생성")

        print("[5/5] 검증")
        # Triple 검증 로직...

        return all_triples

if __name__ == "__main__":
    pipeline = DataPipeline()
    triples = pipeline.run("삼성전자", limit=20)

    print("\\n=== 생성된 Triple ===")
    for t in triples[:10]:
        print(f"  {t.subject} → {t.predicate} → {t.object}")
\`\`\`

### 배치 처리

\`\`\`python
# 일일 배치 처리
QUERIES = ["삼성전자", "SK하이닉스", "현대자동차", "LG화학"]

for query in QUERIES:
    triples = pipeline.run(query, limit=20)
    # DB 저장
    save_triples_to_neo4j(triples)
\`\`\`

### 모니터링

| 지표 | 목표 |
|------|------|
| 수집 성공률 | > 95% |
| 정제 후 유효율 | > 80% |
| 엔티티 추출율 | > 70% |
| Triple 생성율 | > 50% |
`,
  keyPoints: ['5단계 파이프라인 구조', '단계별 로깅과 통계', '배치 처리 지원'],
  practiceGoal: '통합 데이터 파이프라인 구축',
})

export const day2DataCollection: Day = {
  slug: 'data-collection',
  title: '데이터 수집 및 정제',
  totalDuration: 210,
  tasks: [task1, task2, task3, task4, task5],
}
