// Day 1: Entity Resolution 기초 - 중복 탐지와 병합

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

// ============================================
// Day 1: Entity Resolution 기초
// ============================================
// 학습 목표:
// 1. Entity Resolution의 개념과 필요성을 이해한다
// 2. 문자열 유사도 알고리즘을 활용한다
// 3. Python recordlinkage 라이브러리를 사용한다
// 4. Neo4j에서 중복 노드를 탐지하고 병합한다
// ============================================

export const day1EntityResolution: Day = {
  slug: 'entity-resolution-basics',
  title: 'Entity Resolution 기초',
  totalDuration: 240,
  tasks: [
    // Task 1: Entity Resolution 개요 (25분)
    createVideoTask(
      'w4d1-er-overview',
      'Entity Resolution 개요와 필요성',
      25,
      {
        introduction: `
# Entity Resolution 개요

## 학습 목표
- Entity Resolution이 무엇인지 이해한다
- 데이터 품질 문제와 ER의 필요성을 파악한다
- ER의 주요 기법을 개관한다

## Entity Resolution이란?

\`\`\`
Entity Resolution (ER)
= 같은 실세계 엔티티를 가리키는 다른 표현들을 식별하고 통합하는 과정
= Record Linkage, Deduplication, Entity Matching 등으로도 불림
\`\`\`

### 문제 상황

\`\`\`
데이터 소스 A:
┌─────────────────────────────────────┐
│ name: "삼성전자"                     │
│ industry: "전자"                     │
│ employees: 270000                    │
└─────────────────────────────────────┘

데이터 소스 B:
┌─────────────────────────────────────┐
│ name: "Samsung Electronics"          │
│ sector: "Technology"                 │
│ staff_count: 267000                  │
└─────────────────────────────────────┘

데이터 소스 C:
┌─────────────────────────────────────┐
│ company: "삼성전자주식회사"          │
│ type: "대기업"                       │
└─────────────────────────────────────┘

→ 모두 같은 회사! 하지만 기계는 모름
\`\`\`

## ER이 필요한 상황

| 상황 | 예시 |
|------|------|
| **데이터 통합** | 여러 DB/API의 고객 정보 통합 |
| **중복 제거** | CRM의 중복 고객 레코드 정리 |
| **지식 그래프** | 다중 소스에서 KG 구축 시 |
| **마스터 데이터** | 기업의 단일 진실 소스(SSOT) 구축 |

## ER 파이프라인

\`\`\`
1. Preprocessing (전처리)
   - 정규화 (대소문자, 공백, 특수문자)
   - 토큰화
   - 표준화 (날짜, 주소 형식)
       ↓
2. Blocking (블로킹)
   - 후보 쌍 생성
   - 전체 비교 대신 유사 그룹만 비교
   - n² → n log n 복잡도 감소
       ↓
3. Comparison (비교)
   - 유사도 계산
   - 여러 속성 비교
   - 가중치 적용
       ↓
4. Classification (분류)
   - Match / Non-match 판정
   - 임계값 또는 ML 모델
       ↓
5. Clustering (클러스터링)
   - 일치 쌍을 그룹으로 묶기
   - Transitive closure
       ↓
6. Merging (병합)
   - 대표 레코드 선정
   - 정보 통합
\`\`\`

## 주요 유사도 메트릭

| 메트릭 | 특징 | 적합한 경우 |
|--------|------|------------|
| **Jaro-Winkler** | 문자 순서 중시, 접두사 가중치 | 이름 매칭 |
| **Levenshtein** | 편집 거리 | 오타 처리 |
| **Jaccard** | 집합 유사도 | 토큰 비교 |
| **Cosine** | 벡터 각도 | TF-IDF 기반 |
| **Soundex/Metaphone** | 발음 기반 | 영어 이름 |

### Jaro-Winkler 예시

\`\`\`python
# Jaro-Winkler: 0 ~ 1 (높을수록 유사)

"MARTHA" vs "MARHTA" → 0.961  # 매우 유사
"김철수" vs "김철호" → 0.867    # 유사
"삼성" vs "Samsung" → 0.0     # 다른 언어, 낮음
\`\`\`

## Blocking 전략

\`\`\`
문제: n개 레코드 → n(n-1)/2 비교 필요
     100만 레코드 → 5000억 비교!

해결: Blocking으로 후보 축소

Blocking 방법:
1. Standard Blocking: 같은 키 값끼리만 비교
   - 예: 같은 도시, 같은 산업군

2. Sorted Neighborhood: 정렬 후 윈도우 내 비교
   - 예: 이름 정렬 후 인접 10개만 비교

3. LSH (Locality-Sensitive Hashing): 해시 충돌 기반
   - 예: MinHash로 유사 문서 그룹화
\`\`\`

## 실제 사례: Palantir

\`\`\`
Palantir Gotham의 핵심 기능:
- 다중 정보 소스 (SIGINT, HUMINT, OSINT 등) 통합
- Entity Resolution으로 동일 인물/조직 식별
- 관계 추론으로 네트워크 분석

예: "Muhammad" vs "Mohammed" vs "محمد"
    → 같은 사람? 다른 사람?
    → 추가 속성(생년월일, 위치 등)으로 판단
\`\`\`

## 핵심 포인트

1. **ER = 같은 엔티티의 다른 표현을 통합**
2. **Blocking으로 비교 대상 축소**
3. **유사도 메트릭으로 매칭 판단**
4. **Knowledge Graph 구축의 핵심 단계**
        `,
        keyPoints: [
          'Entity Resolution은 같은 엔티티의 다른 표현을 식별하고 통합',
          'Blocking으로 비교 대상을 축소하여 성능 확보',
          'Jaro-Winkler, Levenshtein 등 유사도 메트릭 활용',
          'KG 구축, 데이터 통합, 중복 제거에 필수',
        ],
        practiceGoal: 'Entity Resolution의 개념과 파이프라인을 이해한다',
      }
    ),

    // Task 2: 문자열 유사도 알고리즘 (35분)
    createCodeTask(
      'w4d1-string-similarity',
      '문자열 유사도 알고리즘 구현',
      35,
      {
        introduction: `
# 문자열 유사도 알고리즘

## 학습 목표
- 주요 문자열 유사도 알고리즘을 이해한다
- Python으로 유사도를 계산한다
- 적절한 메트릭을 선택할 수 있다

## Python 라이브러리 설치

\`\`\`bash
pip install jellyfish python-Levenshtein fuzzywuzzy
\`\`\`

## 1. Levenshtein Distance (편집 거리)

\`\`\`python
import Levenshtein

# 두 문자열 간 편집 거리
s1 = "삼성전자"
s2 = "삼성전자주식회사"

distance = Levenshtein.distance(s1, s2)
print(f"편집 거리: {distance}")  # 4

# 정규화된 유사도 (0~1)
ratio = Levenshtein.ratio(s1, s2)
print(f"유사도: {ratio:.3f}")  # 0.667
\`\`\`

### 편집 거리 시각화

\`\`\`
"삼성전자" → "삼성전자주식회사"

삽입: +주 +식 +회 +사 = 4회 편집
\`\`\`

## 2. Jaro-Winkler Similarity

\`\`\`python
import jellyfish

# Jaro similarity (0~1)
jaro = jellyfish.jaro_similarity("MARTHA", "MARHTA")
print(f"Jaro: {jaro:.3f}")  # 0.944

# Jaro-Winkler (접두사 가중치 추가)
jw = jellyfish.jaro_winkler_similarity("MARTHA", "MARHTA")
print(f"Jaro-Winkler: {jw:.3f}")  # 0.961

# 한글 예시
jw_ko = jellyfish.jaro_winkler_similarity("김철수", "김철호")
print(f"김철수 vs 김철호: {jw_ko:.3f}")  # 0.867
\`\`\`

### 언제 사용?
- 이름 매칭에 가장 적합
- 접두사가 같으면 더 높은 점수
- 오타에 강인함

## 3. Jaccard Similarity (토큰 기반)

\`\`\`python
def jaccard_similarity(s1, s2):
    """단어/문자 집합 기반 유사도"""
    set1 = set(s1.split())
    set2 = set(s2.split())

    intersection = len(set1 & set2)
    union = len(set1 | set2)

    return intersection / union if union > 0 else 0

# 예시
s1 = "Samsung Electronics Co Ltd"
s2 = "Samsung Electronics Corporation"

print(f"Jaccard: {jaccard_similarity(s1, s2):.3f}")  # 0.4

# 문자 단위 Jaccard
def char_jaccard(s1, s2):
    set1 = set(s1)
    set2 = set(s2)
    return len(set1 & set2) / len(set1 | set2)

print(f"Char Jaccard: {char_jaccard(s1, s2):.3f}")  # 0.64
\`\`\`

## 4. FuzzyWuzzy (종합 도구)

\`\`\`python
from fuzzywuzzy import fuzz, process

# 다양한 유사도 측정
s1 = "삼성전자 주식회사"
s2 = "삼성전자"

print(f"Simple Ratio: {fuzz.ratio(s1, s2)}")           # 73
print(f"Partial Ratio: {fuzz.partial_ratio(s1, s2)}")  # 100
print(f"Token Sort: {fuzz.token_sort_ratio(s1, s2)}")  # 73
print(f"Token Set: {fuzz.token_set_ratio(s1, s2)}")    # 100

# 최적 매칭 찾기
companies = ["삼성전자", "SK하이닉스", "LG전자", "현대자동차"]
query = "삼성"

best_match = process.extractOne(query, companies)
print(f"Best match: {best_match}")  # ('삼성전자', 90)

# 상위 N개 매칭
top_matches = process.extract(query, companies, limit=3)
print(f"Top 3: {top_matches}")
\`\`\`

## 5. 음성 기반 (Soundex, Metaphone)

\`\`\`python
import jellyfish

# Soundex: 영어 발음 기반 코드
print(jellyfish.soundex("Robert"))   # R163
print(jellyfish.soundex("Rupert"))   # R163 (같음!)

# Metaphone: 더 정교한 발음 코드
print(jellyfish.metaphone("Smith"))  # SM0
print(jellyfish.metaphone("Smyth"))  # SM0 (같음!)

# NYSIIS: 미국식 발음 코드
print(jellyfish.nysiis("Macintosh"))  # MCANT
print(jellyfish.nysiis("McIntosh"))   # MCANT
\`\`\`

## 6. 한글 특화 처리

\`\`\`python
from konlpy.tag import Okt
import jellyfish

okt = Okt()

def korean_similarity(s1, s2):
    """한글 토큰 기반 유사도"""
    # 형태소 분석으로 토큰 추출
    tokens1 = set(okt.morphs(s1))
    tokens2 = set(okt.morphs(s2))

    # Jaccard 유사도
    intersection = len(tokens1 & tokens2)
    union = len(tokens1 | tokens2)

    return intersection / union if union > 0 else 0

# 예시
s1 = "삼성전자 반도체 사업부"
s2 = "삼성 반도체"

print(f"Korean similarity: {korean_similarity(s1, s2):.3f}")

# 초성 추출
def get_chosung(text):
    """한글 초성 추출"""
    CHOSUNG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
               'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
    result = []
    for char in text:
        if '가' <= char <= '힣':
            code = ord(char) - ord('가')
            result.append(CHOSUNG[code // 588])
        else:
            result.append(char)
    return ''.join(result)

print(get_chosung("삼성전자"))  # ㅅㅅㅈㅈ
print(get_chosung("삼성"))      # ㅅㅅ
\`\`\`

## 유사도 메트릭 비교표

| 메트릭 | 장점 | 단점 | 적합한 경우 |
|--------|------|------|------------|
| Levenshtein | 직관적, 범용 | 느림 | 짧은 문자열, 오타 |
| Jaro-Winkler | 이름에 최적화 | 긴 문자열에 부적합 | 사람 이름 |
| Jaccard | 단어 순서 무관 | 짧은 문자열에 부정확 | 문서, 태그 |
| Soundex | 발음 기반 | 영어만 | 영어 이름 |
| FuzzyWuzzy | 다양한 옵션 | 느림 | 범용 |

## 핵심 포인트

1. **Jaro-Winkler** = 이름 매칭의 표준
2. **Jaccard** = 토큰/단어 기반 비교
3. **FuzzyWuzzy** = 다양한 상황에 대응
4. **한글** = 형태소 분석 + 초성 추출 활용
        `,
        keyPoints: [
          'Levenshtein은 편집 거리 기반, 오타 처리에 적합',
          'Jaro-Winkler는 이름 매칭에 최적화',
          'Jaccard는 토큰 집합 기반 유사도',
          '한글은 형태소 분석과 초성 추출 활용',
        ],
        practiceGoal: '다양한 문자열 유사도 알고리즘을 Python으로 구현하고 비교할 수 있다',
      }
    ),

    // Task 3: Python recordlinkage 라이브러리 (40분)
    createCodeTask(
      'w4d1-recordlinkage',
      'Python recordlinkage 라이브러리 실습',
      40,
      {
        introduction: `
# Python recordlinkage 라이브러리

## 학습 목표
- recordlinkage 라이브러리를 설치하고 사용한다
- Blocking, Comparison, Classification 파이프라인을 구현한다
- 실제 데이터로 중복 레코드를 탐지한다

## 설치

\`\`\`bash
pip install recordlinkage pandas
\`\`\`

## 기본 사용법

\`\`\`python
import recordlinkage
import pandas as pd

# 샘플 데이터
df = pd.DataFrame({
    'id': [1, 2, 3, 4, 5],
    'name': ['삼성전자', 'Samsung Electronics', '삼성', 'LG전자', 'LG Electronics'],
    'city': ['수원', 'Suwon', '수원', '서울', 'Seoul'],
    'employees': [270000, 267000, 270000, 75000, 74000]
})

print(df)
\`\`\`

## Step 1: Indexing (Blocking)

\`\`\`python
# 인덱서 생성
indexer = recordlinkage.Index()

# Blocking 전략 선택
# 1. Full: 모든 쌍 비교 (작은 데이터셋용)
indexer.full()

# 2. Block: 특정 열이 같은 것만 비교
# indexer.block('city')

# 3. Sorted Neighborhood: 정렬 후 윈도우 내 비교
# indexer.sortedneighbourhood('name', window=5)

# 후보 쌍 생성
candidate_pairs = indexer.index(df)
print(f"비교할 쌍 수: {len(candidate_pairs)}")
# 5C2 = 10쌍
\`\`\`

## Step 2: Comparison

\`\`\`python
# 비교기 생성
compare = recordlinkage.Compare()

# 각 속성별 비교 방법 설정
compare.string('name', 'name', method='jarowinkler', label='name_sim')
compare.string('city', 'city', method='levenshtein', label='city_sim')
compare.numeric('employees', 'employees', scale=10000, label='emp_sim')

# 비교 실행
features = compare.compute(candidate_pairs, df)
print(features)
\`\`\`

### 비교 결과 예시

\`\`\`
         name_sim  city_sim  emp_sim
(0, 1)     0.78      0.60    0.997
(0, 2)     0.67      1.00    1.000
(0, 3)     0.44      0.50    0.195
...
\`\`\`

## Step 3: Classification

\`\`\`python
# 방법 1: 임계값 기반
matches = features[features.sum(axis=1) >= 2.0]
print(f"매칭된 쌍: {len(matches)}")
print(matches)

# 방법 2: 개별 속성 임계값
matches = features[
    (features['name_sim'] > 0.6) &
    (features['city_sim'] > 0.5)
]

# 방법 3: 머신러닝 (지도 학습)
from recordlinkage.classifiers import LogisticRegression

# 학습 데이터 (정답 레이블 필요)
true_matches = pd.MultiIndex.from_tuples([(0, 1), (0, 2), (3, 4)])
true_nonmatches = pd.MultiIndex.from_tuples([(0, 3), (1, 3)])

classifier = LogisticRegression()
classifier.fit(features, true_matches)

# 예측
predictions = classifier.predict(features)
\`\`\`

## 완전한 예제: 기업 중복 탐지

\`\`\`python
import recordlinkage
import pandas as pd

# 기업 데이터 (실제로는 CSV에서 로드)
companies = pd.DataFrame({
    'id': range(10),
    'name': [
        '삼성전자', 'Samsung Electronics', '삼성전자주식회사',
        'LG전자', 'LG Electronics', 'LG전자 주식회사',
        'SK하이닉스', 'SK Hynix', 'SK 하이닉스',
        '현대자동차'
    ],
    'industry': [
        '전자', 'Electronics', '반도체',
        '전자', 'Electronics', '가전',
        '반도체', 'Semiconductor', '메모리',
        '자동차'
    ],
    'employees': [
        270000, 267000, 270000,
        75000, 74000, 75000,
        30000, 29000, 30000,
        120000
    ]
})

def find_duplicates(df, name_threshold=0.7, total_threshold=2.0):
    """중복 레코드 탐지"""

    # 1. Indexing
    indexer = recordlinkage.Index()
    indexer.full()  # 작은 데이터셋이므로 전체 비교
    pairs = indexer.index(df)

    # 2. Comparison
    compare = recordlinkage.Compare()
    compare.string('name', 'name', method='jarowinkler', label='name')
    compare.string('industry', 'industry', method='jarowinkler', label='industry')
    compare.numeric('employees', 'employees', scale=10000, label='employees')

    features = compare.compute(pairs, df)

    # 3. Classification
    matches = features[
        (features['name'] >= name_threshold) |
        (features.sum(axis=1) >= total_threshold)
    ]

    return matches, features

# 실행
matches, features = find_duplicates(companies)
print("\\n=== 중복 후보 ===")
for (i, j) in matches.index:
    print(f"{companies.loc[i, 'name']} ↔ {companies.loc[j, 'name']}")
    print(f"  유사도: {features.loc[(i, j)].to_dict()}")
    print()
\`\`\`

### 출력 예시

\`\`\`
=== 중복 후보 ===
삼성전자 ↔ Samsung Electronics
  유사도: {'name': 0.78, 'industry': 0.60, 'employees': 0.997}

삼성전자 ↔ 삼성전자주식회사
  유사도: {'name': 0.80, 'industry': 0.50, 'employees': 1.0}

LG전자 ↔ LG Electronics
  유사도: {'name': 0.72, 'industry': 0.60, 'employees': 0.99}
...
\`\`\`

## Blocking 성능 비교

\`\`\`python
import time

# 대규모 데이터 시뮬레이션
large_df = pd.concat([companies] * 100, ignore_index=True)
print(f"레코드 수: {len(large_df)}")

# Full indexing (모든 쌍)
indexer_full = recordlinkage.Index()
indexer_full.full()

start = time.time()
pairs_full = indexer_full.index(large_df)
print(f"Full: {len(pairs_full)} 쌍, {time.time()-start:.2f}초")

# Sorted Neighborhood
indexer_sn = recordlinkage.Index()
indexer_sn.sortedneighbourhood('name', window=5)

start = time.time()
pairs_sn = indexer_sn.index(large_df)
print(f"SortedNeighbourhood: {len(pairs_sn)} 쌍, {time.time()-start:.2f}초")
\`\`\`

## 핵심 포인트

1. **recordlinkage** = Python ER 표준 라이브러리
2. **3단계**: Indexing → Comparison → Classification
3. **Blocking**으로 비교 대상 축소
4. **임계값 또는 ML**로 매칭 판정
        `,
        keyPoints: [
          'recordlinkage는 Python Entity Resolution 표준 라이브러리',
          'Index(Blocking) → Compare → Classify 3단계 파이프라인',
          'Blocking으로 비교 대상을 줄여 성능 확보',
          '임계값 또는 머신러닝으로 매칭 판정',
        ],
        practiceGoal: 'recordlinkage로 중복 레코드를 탐지하는 파이프라인을 구현할 수 있다',
      }
    ),

    // Task 4: Neo4j에서 Entity Resolution (35분)
    createCodeTask(
      'w4d1-neo4j-er',
      'Neo4j에서 Entity Resolution 구현',
      35,
      {
        introduction: `
# Neo4j에서 Entity Resolution

## 학습 목표
- Neo4j에서 유사 노드를 탐지한다
- APOC을 활용한 문자열 유사도를 계산한다
- 중복 노드를 병합한다

## APOC 문자열 유사도 함수

\`\`\`cypher
// 설치 확인
RETURN apoc.text.jaroWinklerDistance("삼성전자", "삼성") AS similarity
// 0.867

// 다양한 유사도 함수
RETURN
  apoc.text.jaroWinklerDistance("Samsung", "Samsng") AS jaroWinkler,
  apoc.text.levenshteinDistance("Samsung", "Samsng") AS levenshtein,
  apoc.text.sorensenDiceSimilarity("Samsung Electronics", "Samsung") AS dice,
  apoc.text.fuzzyMatch("Samsung", "Samsng") AS fuzzy
\`\`\`

## 유사 노드 탐지

\`\`\`cypher
// 이름이 유사한 회사 쌍 찾기
MATCH (a:Company), (b:Company)
WHERE a.id < b.id  // 중복 쌍 방지
  AND apoc.text.jaroWinklerDistance(a.name, b.name) > 0.8
RETURN
  a.name AS company1,
  b.name AS company2,
  apoc.text.jaroWinklerDistance(a.name, b.name) AS similarity
ORDER BY similarity DESC
LIMIT 20
\`\`\`

## Blocking으로 성능 최적화

\`\`\`cypher
// 같은 산업군 내에서만 비교 (Blocking)
MATCH (a:Company), (b:Company)
WHERE a.id < b.id
  AND a.industry = b.industry  // Blocking 조건
  AND apoc.text.jaroWinklerDistance(a.name, b.name) > 0.8
RETURN a.name, b.name,
       apoc.text.jaroWinklerDistance(a.name, b.name) AS similarity
\`\`\`

## 노드 병합

### 방법 1: MERGE 사용

\`\`\`cypher
// 기존 노드의 관계를 새 노드로 이전
MATCH (old:Company {name: "Samsung Electronics"})
MATCH (new:Company {name: "삼성전자"})

// 관계 복사
MATCH (old)-[r:SUPPLIES_TO]->(target)
CREATE (new)-[:SUPPLIES_TO]->(target)

// 속성 병합
SET new.aliases = coalesce(new.aliases, []) + old.name
SET new.employees = CASE
  WHEN new.employees IS NULL THEN old.employees
  ELSE new.employees
END

// 오래된 노드 삭제
DETACH DELETE old
\`\`\`

### 방법 2: APOC mergeNodes 사용

\`\`\`cypher
// APOC으로 노드 병합
MATCH (a:Company {name: "삼성전자"})
MATCH (b:Company {name: "Samsung Electronics"})
CALL apoc.refactor.mergeNodes([a, b], {
  properties: 'combine',
  mergeRels: true
})
YIELD node
RETURN node
\`\`\`

### 속성 병합 전략

\`\`\`cypher
// properties 옵션:
// 'overwrite' - 마지막 노드의 값 사용
// 'discard' - 첫 노드의 값 유지
// 'combine' - 배열로 결합

CALL apoc.refactor.mergeNodes([a, b], {
  properties: {
    name: 'discard',          // 첫 번째 이름 유지
    aliases: 'combine',       // 별칭 배열로 결합
    employees: 'overwrite',   // 마지막 값 사용
    '*': 'discard'            // 나머지는 첫 번째 값
  },
  mergeRels: true
})
\`\`\`

## 배치 처리

\`\`\`cypher
// 유사 노드 쌍을 POTENTIAL_DUPLICATE 관계로 표시
MATCH (a:Company), (b:Company)
WHERE a.id < b.id
  AND apoc.text.jaroWinklerDistance(a.name, b.name) > 0.85
CREATE (a)-[:POTENTIAL_DUPLICATE {
  similarity: apoc.text.jaroWinklerDistance(a.name, b.name),
  detected_at: datetime()
}]->(b)

// 검토 후 병합
MATCH (a:Company)-[r:POTENTIAL_DUPLICATE]->(b:Company)
WHERE r.similarity > 0.9  // 자동 병합 임계값
CALL apoc.refactor.mergeNodes([a, b], {properties: 'combine'})
YIELD node
DELETE r
RETURN count(node) AS merged_count
\`\`\`

## 전체 파이프라인

\`\`\`cypher
// 1. 초기 데이터 로드
LOAD CSV WITH HEADERS FROM 'file:///companies.csv' AS row
CREATE (:Company {
  source_id: row.id,
  name: row.name,
  industry: row.industry,
  source: row.source
})

// 2. 인덱스 생성
CREATE INDEX company_name IF NOT EXISTS FOR (c:Company) ON (c.name)

// 3. 유사 노드 탐지
MATCH (a:Company), (b:Company)
WHERE a.source_id < b.source_id
  AND a.industry = b.industry
  AND apoc.text.jaroWinklerDistance(a.name, b.name) > 0.8
MERGE (a)-[:POTENTIAL_DUPLICATE {
  similarity: apoc.text.jaroWinklerDistance(a.name, b.name)
}]->(b)

// 4. 높은 신뢰도 병합
MATCH (a:Company)-[r:POTENTIAL_DUPLICATE]->(b:Company)
WHERE r.similarity > 0.95
WITH a, b, r
CALL apoc.refactor.mergeNodes([a, b], {
  properties: 'combine',
  mergeRels: true
}) YIELD node
DELETE r
RETURN count(node) AS auto_merged

// 5. 수동 검토 목록
MATCH (a:Company)-[r:POTENTIAL_DUPLICATE]->(b:Company)
RETURN a.name, b.name, r.similarity
ORDER BY r.similarity DESC
\`\`\`

## 핵심 포인트

1. **APOC** = Neo4j ER 도구 (jaroWinkler, mergeNodes)
2. **Blocking** = 같은 속성 내에서만 비교
3. **mergeNodes** = 노드 + 관계 + 속성 통합
4. **POTENTIAL_DUPLICATE** = 수동 검토용 관계
        `,
        keyPoints: [
          'APOC의 text 함수로 문자열 유사도 계산',
          'Blocking으로 비교 범위 축소하여 성능 확보',
          'apoc.refactor.mergeNodes로 노드 병합',
          'POTENTIAL_DUPLICATE 관계로 수동 검토 지원',
        ],
        practiceGoal: 'Neo4j에서 유사 노드를 탐지하고 병합하는 파이프라인을 구현할 수 있다',
      }
    ),

    // Task 5: 데이터 품질 관리 (25분)
    createReadingTask(
      'w4d1-data-quality',
      '데이터 품질 관리와 검증',
      25,
      {
        introduction: `
# 데이터 품질 관리와 검증

## 학습 목표
- Knowledge Graph의 데이터 품질 문제를 식별한다
- Neo4j에서 품질 검증 쿼리를 작성한다
- 데이터 정제 전략을 수립한다

## 데이터 품질 차원

| 차원 | 설명 | 예시 |
|------|------|------|
| **완전성** | 필수 속성 존재 | 이름 없는 회사 |
| **정확성** | 올바른 값 | 직원수가 음수 |
| **일관성** | 데이터 간 모순 없음 | 설립일 > 폐업일 |
| **유일성** | 중복 없음 | 같은 회사 2개 |
| **적시성** | 최신 데이터 | 5년 전 직원수 |
| **유효성** | 형식 준수 | 잘못된 이메일 형식 |

## Neo4j 품질 검증 쿼리

### 1. 완전성 검사

\`\`\`cypher
// 필수 속성 누락 노드
MATCH (c:Company)
WHERE c.name IS NULL OR c.name = ''
RETURN 'Missing name' AS issue, count(c) AS count

UNION

MATCH (c:Company)
WHERE NOT EXISTS((c)-[:LOCATED_IN]->(:City))
RETURN 'Missing location' AS issue, count(c) AS count

UNION

MATCH (c:Company)
WHERE c.employees IS NULL
RETURN 'Missing employees' AS issue, count(c) AS count
\`\`\`

### 2. 유효성 검사

\`\`\`cypher
// 비정상 값 탐지
MATCH (c:Company)
WHERE c.employees <= 0
RETURN c.name, c.employees AS invalid_employees

// 날짜 유효성
MATCH (c:Company)
WHERE c.founded_date > date()
RETURN c.name, c.founded_date AS future_date
\`\`\`

### 3. 일관성 검사

\`\`\`cypher
// 모순된 관계
MATCH (a:Company)-[:SUBSIDIARY_OF]->(b:Company)
MATCH (b)-[:SUBSIDIARY_OF]->(a)
RETURN a.name, b.name AS circular_reference

// 자기 참조
MATCH (c:Company)-[r]->(c)
RETURN c.name, type(r) AS self_reference
\`\`\`

### 4. 고아 노드

\`\`\`cypher
// 관계 없는 노드
MATCH (n)
WHERE NOT (n)--()
RETURN labels(n) AS label, count(n) AS orphan_count
ORDER BY orphan_count DESC
\`\`\`

### 5. 중복 관계

\`\`\`cypher
// 동일 타입의 중복 관계
MATCH (a)-[r1]->(b), (a)-[r2]->(b)
WHERE id(r1) < id(r2) AND type(r1) = type(r2)
RETURN a.name, b.name, type(r1), count(*) AS duplicate_count
\`\`\`

## 품질 대시보드 쿼리

\`\`\`cypher
// 전체 품질 점수 계산
CALL {
  MATCH (c:Company) RETURN count(c) AS total
}
CALL {
  MATCH (c:Company) WHERE c.name IS NOT NULL
  RETURN count(c) AS with_name
}
CALL {
  MATCH (c:Company) WHERE c.employees > 0
  RETURN count(c) AS valid_employees
}
CALL {
  MATCH (c:Company)-[:LOCATED_IN]->()
  RETURN count(DISTINCT c) AS with_location
}

RETURN
  total,
  round(with_name * 100.0 / total, 2) AS name_completeness,
  round(valid_employees * 100.0 / total, 2) AS employee_validity,
  round(with_location * 100.0 / total, 2) AS location_completeness
\`\`\`

## 데이터 정제 전략

### 자동 정제

\`\`\`cypher
// 공백 제거
MATCH (c:Company)
WHERE c.name CONTAINS '  ' OR c.name STARTS WITH ' '
SET c.name = trim(replace(c.name, '  ', ' '))

// 기본값 설정
MATCH (c:Company)
WHERE c.employees IS NULL
SET c.employees = 0, c.employees_unknown = true
\`\`\`

### 제약 조건

\`\`\`cypher
// 유일성 제약
CREATE CONSTRAINT company_name_unique IF NOT EXISTS
FOR (c:Company) REQUIRE c.name IS UNIQUE

// 필수 속성 제약 (Neo4j 5.0+)
CREATE CONSTRAINT company_name_exists IF NOT EXISTS
FOR (c:Company) REQUIRE c.name IS NOT NULL
\`\`\`

## 핵심 포인트

1. **6가지 품질 차원**: 완전성, 정확성, 일관성, 유일성, 적시성, 유효성
2. **검증 쿼리**로 문제 탐지
3. **제약 조건**으로 품질 강제
4. **자동 정제 + 수동 검토** 병행
        `,
        keyPoints: [
          '데이터 품질은 완전성, 정확성, 일관성, 유일성, 적시성, 유효성 6가지 차원',
          'Cypher 쿼리로 품질 문제를 탐지하고 대시보드 구축',
          '제약 조건(CONSTRAINT)으로 품질 규칙 강제',
          '자동 정제와 수동 검토를 병행',
        ],
        practiceGoal: 'Knowledge Graph의 데이터 품질을 검증하고 개선하는 방법을 이해한다',
      }
    ),

    // Task 6: 실습 - 기업 데이터 ER (30분)
    createCodeTask(
      'w4d1-er-practice',
      '실습: 기업 데이터 Entity Resolution',
      30,
      {
        introduction: `
# 실습: 기업 데이터 Entity Resolution

## 과제 개요

여러 소스의 기업 데이터를 통합하여 중복을 제거합니다.

## 데이터 준비

\`\`\`python
import pandas as pd

# 소스 1: 국내 기업 DB
source1 = pd.DataFrame({
    'id': ['K001', 'K002', 'K003', 'K004'],
    'name': ['삼성전자', 'SK하이닉스', 'LG전자', '현대자동차'],
    'industry': ['전자', '반도체', '전자', '자동차'],
    'employees': [270000, 30000, 75000, 120000],
    'source': ['domestic']
})

# 소스 2: 글로벌 기업 DB
source2 = pd.DataFrame({
    'id': ['G001', 'G002', 'G003', 'G004'],
    'name': ['Samsung Electronics', 'SK Hynix', 'LG Electronics', 'Hyundai Motor'],
    'industry': ['Electronics', 'Semiconductor', 'Electronics', 'Automotive'],
    'employees': [267000, 29000, 74000, 118000],
    'source': ['global']
})

# 소스 3: 뉴스 추출 데이터
source3 = pd.DataFrame({
    'id': ['N001', 'N002', 'N003'],
    'name': ['삼성전자주식회사', '삼성', '현대차'],
    'industry': ['테크', '전자', '자동차'],
    'employees': [None, None, None],
    'source': ['news']
})

# 통합
all_companies = pd.concat([source1, source2, source3], ignore_index=True)
print(f"총 레코드: {len(all_companies)}")
print(all_companies)
\`\`\`

## 요구사항

### 1. Python recordlinkage로 중복 탐지

\`\`\`python
import recordlinkage

def detect_duplicates(df):
    # Indexing
    indexer = recordlinkage.Index()
    indexer.full()
    pairs = indexer.index(df)

    # Comparison
    compare = recordlinkage.Compare()
    compare.string('name', 'name', method='jarowinkler', label='name_sim')
    compare.string('industry', 'industry', method='jarowinkler', label='industry_sim')
    compare.numeric('employees', 'employees', scale=10000, label='emp_sim', missing_value=0.5)

    features = compare.compute(pairs, df)

    # Classification (임계값 기반)
    matches = features[
        (features['name_sim'] > 0.7) |
        (features.sum(axis=1) > 1.8)
    ]

    return matches, features

# 실행
matches, features = detect_duplicates(all_companies)

# 결과 출력
print("\\n=== 중복 후보 ===")
for (i, j), row in matches.iterrows():
    print(f"{all_companies.loc[i, 'name']} ({all_companies.loc[i, 'source']})")
    print(f"  ↔ {all_companies.loc[j, 'name']} ({all_companies.loc[j, 'source']})")
    print(f"  유사도: name={row['name_sim']:.2f}, total={row.sum():.2f}")
    print()
\`\`\`

### 2. 클러스터링으로 그룹화

\`\`\`python
import networkx as nx

def cluster_matches(matches, df):
    """매칭 쌍을 클러스터로 그룹화"""
    G = nx.Graph()

    # 매칭 쌍을 엣지로 추가
    for (i, j) in matches.index:
        G.add_edge(i, j)

    # Connected components = 같은 엔티티 그룹
    clusters = list(nx.connected_components(G))

    # 클러스터별 정보 출력
    for cluster_id, cluster in enumerate(clusters):
        print(f"\\n=== 클러스터 {cluster_id + 1} ===")
        for idx in cluster:
            row = df.loc[idx]
            print(f"  {row['name']} ({row['source']}, {row['employees']})")

    return clusters

clusters = cluster_matches(matches, all_companies)
\`\`\`

### 3. 대표 레코드 선정 및 병합

\`\`\`python
def merge_cluster(cluster, df):
    """클러스터를 하나의 레코드로 병합"""
    records = df.loc[list(cluster)]

    # 대표 이름: 가장 짧은 한글 이름 또는 첫 번째
    korean_names = records[records['name'].str.contains('[가-힣]', regex=True)]
    if len(korean_names) > 0:
        main_name = korean_names.sort_values('name', key=lambda x: x.str.len()).iloc[0]['name']
    else:
        main_name = records.iloc[0]['name']

    # 별칭: 다른 모든 이름
    aliases = list(records['name'].unique())
    aliases.remove(main_name)

    # 직원수: 유효한 값 중 최대
    valid_employees = records['employees'].dropna()
    employees = int(valid_employees.max()) if len(valid_employees) > 0 else None

    return {
        'name': main_name,
        'aliases': aliases,
        'industry': records['industry'].mode().iloc[0],
        'employees': employees,
        'sources': list(records['source'].unique())
    }

# 병합 실행
merged_records = []
for cluster in clusters:
    merged = merge_cluster(cluster, all_companies)
    merged_records.append(merged)
    print(f"\\n병합 결과: {merged['name']}")
    print(f"  별칭: {merged['aliases']}")
    print(f"  직원수: {merged['employees']}")

# 단일 레코드 (매칭 없음) 추가
matched_indices = set()
for cluster in clusters:
    matched_indices.update(cluster)

for idx in all_companies.index:
    if idx not in matched_indices:
        row = all_companies.loc[idx]
        merged_records.append({
            'name': row['name'],
            'aliases': [],
            'industry': row['industry'],
            'employees': row['employees'],
            'sources': [row['source']]
        })
\`\`\`

### 4. 결과 검증

\`\`\`python
# 최종 통합 데이터
final_df = pd.DataFrame(merged_records)
print(f"\\n=== 최종 결과 ===")
print(f"원본: {len(all_companies)} 레코드")
print(f"통합 후: {len(final_df)} 레코드")
print(f"중복 제거: {len(all_companies) - len(final_df)}개")
print()
print(final_df)
\`\`\`

## 평가 기준

| 항목 | 배점 |
|------|------|
| 유사도 계산 정확성 | 25% |
| 중복 탐지 완전성 | 25% |
| 클러스터링 정확성 | 20% |
| 병합 전략 적절성 | 20% |
| 코드 품질 | 10% |
        `,
        keyPoints: [
          'recordlinkage로 중복 후보 탐지',
          'NetworkX로 매칭 쌍을 클러스터로 그룹화',
          '대표 레코드 선정 및 속성 병합 전략',
          '원본 대비 통합 결과 검증',
        ],
        practiceGoal: '여러 소스의 기업 데이터를 Entity Resolution으로 통합할 수 있다',
      }
    ),

    // Task 7: Quiz (20분)
    createQuizTask(
      'w4d1-quiz',
      'Day 1 복습 퀴즈',
      20,
      {
        introduction: `
# Day 1 복습 퀴즈

Entity Resolution에 대해 학습한 내용을 확인합니다.
        `,
        questions: [
          {
            id: 'w4d1-q1',
            question: 'Entity Resolution의 주요 목적은?',
            options: [
              '데이터 암호화',
              '같은 엔티티의 다른 표현을 식별하고 통합',
              '데이터 시각화',
              '쿼리 최적화',
            ],
            correctAnswer: 1,
            explanation: 'Entity Resolution은 다양한 표현(삼성전자, Samsung Electronics 등)이 같은 실세계 엔티티를 가리킴을 식별하고 통합하는 과정입니다.',
          },
          {
            id: 'w4d1-q2',
            question: 'Blocking의 목적은?',
            options: [
              '보안 강화',
              '데이터 암호화',
              '비교 대상 쌍을 줄여 성능 향상',
              '중복 데이터 삭제',
            ],
            correctAnswer: 2,
            explanation: 'Blocking은 전체 쌍 비교(n²) 대신 유사할 가능성이 있는 쌍만 비교하여 성능을 크게 향상시킵니다.',
          },
          {
            id: 'w4d1-q3',
            question: '이름 매칭에 가장 적합한 유사도 메트릭은?',
            options: [
              'Jaccard',
              'Cosine',
              'Jaro-Winkler',
              'Euclidean',
            ],
            correctAnswer: 2,
            explanation: 'Jaro-Winkler는 문자 순서를 고려하고 접두사에 가중치를 부여하여 사람/회사 이름 매칭에 가장 적합합니다.',
          },
          {
            id: 'w4d1-q4',
            question: 'recordlinkage의 3단계 파이프라인 순서는?',
            options: [
              'Compare → Index → Classify',
              'Index → Compare → Classify',
              'Classify → Compare → Index',
              'Index → Classify → Compare',
            ],
            correctAnswer: 1,
            explanation: 'recordlinkage는 Index(Blocking) → Compare(유사도 계산) → Classify(매칭 판정) 순서로 진행됩니다.',
          },
          {
            id: 'w4d1-q5',
            question: 'Neo4j에서 노드를 병합할 때 사용하는 APOC 함수는?',
            options: [
              'apoc.create.node',
              'apoc.refactor.mergeNodes',
              'apoc.algo.merge',
              'apoc.text.merge',
            ],
            correctAnswer: 1,
            explanation: 'apoc.refactor.mergeNodes는 여러 노드를 하나로 병합하고 관계와 속성을 통합합니다.',
          },
        ],
        keyPoints: [
          'ER은 같은 엔티티의 다른 표현을 통합',
          'Blocking으로 비교 대상 축소',
          'Jaro-Winkler는 이름 매칭에 최적',
          'recordlinkage: Index → Compare → Classify',
        ],
        practiceGoal: 'Entity Resolution의 핵심 개념을 확인한다',
      }
    ),
  ],

  // Day 1 Challenge
  challenge: createChallengeTask(
    'w4d1-challenge',
    'Challenge: 멀티소스 기업 ER 파이프라인',
    40,
    {
      introduction: `
# Challenge: 멀티소스 기업 ER 파이프라인

## 도전 과제

3개 이상의 데이터 소스에서 기업 정보를 수집하고, Entity Resolution 파이프라인을 구축하세요.

### 요구사항

1. **데이터 준비** (3개 소스)
   - 국내 기업 DB (한글)
   - 글로벌 기업 DB (영문)
   - 뉴스/웹 추출 데이터 (혼합)

2. **ER 파이프라인 구현**
   - Blocking 전략 설계
   - 다중 속성 유사도 계산
   - 임계값 튜닝

3. **결과 검증**
   - Precision / Recall 계산 (가능한 경우)
   - 오탐지 분석

4. **Neo4j 연동**
   - 통합 데이터 로드
   - POTENTIAL_DUPLICATE 관계 생성
   - 병합 쿼리 작성

### 평가 기준

| 항목 | 배점 |
|------|------|
| 데이터 소스 다양성 | 15% |
| Blocking 전략 | 20% |
| 유사도 메트릭 선택 | 20% |
| 클러스터링 및 병합 | 20% |
| Neo4j 연동 | 15% |
| 문서화 | 10% |
      `,
      keyPoints: [
        '다중 소스 데이터 통합',
        'Blocking과 유사도 메트릭 최적화',
        '클러스터링 및 병합 전략',
        'Neo4j로 결과 저장 및 검증',
      ],
      practiceGoal: '실제 멀티소스 데이터로 완전한 ER 파이프라인을 구축한다',
    }
  ),
}
