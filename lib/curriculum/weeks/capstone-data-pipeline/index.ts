// Phase 6, Week 3: 데이터 파이프라인 구축
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'data-source-integration',
  title: '데이터 소스 연동',
  totalDuration: 180,
  tasks: [
    {
      id: 'data-source-setup',
      type: 'project',
      title: '데이터 소스 연동 구현',
      duration: 120,
      content: {
        objectives: [
          '선택한 도메인의 데이터 소스를 연동한다',
          'API 인증 및 Rate Limiting을 처리한다',
          '데이터 수집 스크립트를 작성한다'
        ],
        requirements: [
          '**Day 1 마일스톤: 데이터 소스 연동**',
          '',
          '## 금융 도메인',
          '```python',
          '# Yahoo Finance',
          'import yfinance as yf',
          'ticker = yf.Ticker("005930.KS")',
          '',
          '# DART 공시 API',
          '# https://opendart.fss.or.kr/',
          '',
          '# 네이버 뉴스 API',
          '# https://developers.naver.com/docs/search/news/',
          '```',
          '',
          '## 헬스케어 도메인',
          '```bash',
          '# Synthea 환자 데이터 생성',
          'java -jar synthea.jar -p 1000 -s 12345',
          '```',
          '',
          '## 제조 도메인',
          '```python',
          '# 시뮬레이션 센서 데이터 생성',
          'import numpy as np',
          'data = generate_sensor_data(n=10000)',
          '```',
          '',
          '**산출물**:',
          '- [ ] 데이터 소스별 연동 스크립트',
          '- [ ] 환경 변수 설정 (.env)',
          '- [ ] 연동 테스트 통과'
        ],
        externalLinks: [
          { title: 'yfinance', url: 'https://github.com/ranaroussi/yfinance' },
          { title: 'DART API', url: 'https://opendart.fss.or.kr/' },
          { title: 'Synthea', url: 'https://github.com/synthetichealth/synthea' }
        ]
      }
    },
    {
      id: 'data-collection-script',
      type: 'code',
      title: '데이터 수집 스크립트 작성',
      duration: 60,
      content: {
        objectives: [
          '재사용 가능한 데이터 수집 모듈을 작성한다',
          '에러 핸들링과 재시도 로직을 구현한다'
        ],
        starterCode: `# src/data/collectors/base.py
from abc import ABC, abstractmethod
from typing import Any, Dict, List
import time
from functools import wraps

def retry(max_attempts: int = 3, delay: float = 1.0):
    """재시도 데코레이터"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay * (attempt + 1))
            return None
        return wrapper
    return decorator

class BaseCollector(ABC):
    """데이터 수집기 베이스 클래스"""

    @abstractmethod
    def collect(self, **kwargs) -> List[Dict[str, Any]]:
        """데이터 수집"""
        pass

    @abstractmethod
    def validate(self, data: List[Dict]) -> bool:
        """데이터 검증"""
        pass
`,
        solutionCode: `# 도메인별 구현은 프로젝트에 따라 다름
# 금융: YahooFinanceCollector, DartCollector, NaverNewsCollector
# 헬스케어: SyntheaCollector, FhirCollector
# 제조: SensorDataCollector, OpcuaCollector
`
      }
    }
  ]
}

const day2: Day = {
  slug: 'etl-pipeline',
  title: 'ETL 파이프라인 구현',
  totalDuration: 180,
  tasks: [
    {
      id: 'airflow-dag',
      type: 'project',
      title: 'Airflow DAG 구현',
      duration: 120,
      content: {
        objectives: [
          'Airflow DAG를 작성한다',
          'ETL 태스크를 정의한다',
          '스케줄링을 설정한다'
        ],
        requirements: [
          '**Day 2 마일스톤: ETL 파이프라인**',
          '',
          '## Airflow DAG 구조',
          '```python',
          '# dags/capstone_etl.py',
          'from airflow import DAG',
          'from airflow.operators.python import PythonOperator',
          'from datetime import datetime, timedelta',
          '',
          'default_args = {',
          '    "owner": "capstone",',
          '    "retries": 3,',
          '    "retry_delay": timedelta(minutes=5)',
          '}',
          '',
          'with DAG(',
          '    "capstone_etl",',
          '    default_args=default_args,',
          '    schedule_interval="@daily",',
          '    start_date=datetime(2024, 1, 1),',
          '    catchup=False',
          ') as dag:',
          '    ',
          '    extract = PythonOperator(',
          '        task_id="extract",',
          '        python_callable=extract_data',
          '    )',
          '    ',
          '    transform = PythonOperator(',
          '        task_id="transform",',
          '        python_callable=transform_data',
          '    )',
          '    ',
          '    load = PythonOperator(',
          '        task_id="load",',
          '        python_callable=load_data',
          '    )',
          '    ',
          '    extract >> transform >> load',
          '```',
          '',
          '**산출물**:',
          '- [ ] Airflow DAG 파일',
          '- [ ] ETL 함수 구현',
          '- [ ] DAG 테스트 통과'
        ],
        externalLinks: [
          { title: 'Airflow Documentation', url: 'https://airflow.apache.org/docs/' },
          { title: 'Airflow Best Practices', url: 'https://github.com/apache/airflow/blob/main/docs/apache-airflow/best-practices.rst' }
        ]
      }
    },
    {
      id: 'transformation-logic',
      type: 'code',
      title: '데이터 변환 로직 구현',
      duration: 60,
      content: {
        objectives: [
          '데이터 정제 및 변환 로직을 구현한다',
          'Triple 추출 로직을 구현한다 (Knowledge Graph용)'
        ],
        starterCode: `# src/data/transformers/triple_extractor.py
from typing import List, Dict, Tuple
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

class Triple(BaseModel):
    subject: str
    predicate: str
    object: str
    confidence: float

class TripleExtractor:
    """텍스트에서 Triple 추출"""

    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o-mini")

    def extract(self, text: str) -> List[Triple]:
        """텍스트에서 관계 Triple 추출"""
        # TODO: 구현
        pass

    def validate_triple(self, triple: Triple) -> bool:
        """Triple 유효성 검증"""
        # TODO: 구현
        pass
`
      }
    }
  ]
}

const day3: Day = {
  slug: 'data-quality',
  title: '데이터 품질 검증',
  totalDuration: 180,
  tasks: [
    {
      id: 'data-validation',
      type: 'project',
      title: '데이터 품질 검증 구현',
      duration: 120,
      content: {
        objectives: [
          'Great Expectations로 데이터 품질을 검증한다',
          '데이터 품질 리포트를 생성한다',
          '알림 시스템을 구축한다'
        ],
        requirements: [
          '**Day 3 마일스톤: 데이터 품질**',
          '',
          '## Great Expectations 설정',
          '```python',
          'import great_expectations as gx',
          '',
          '# Context 생성',
          'context = gx.get_context()',
          '',
          '# Expectation Suite 정의',
          'suite = context.add_expectation_suite("capstone_suite")',
          '',
          '# 기대사항 추가',
          'validator.expect_column_values_to_not_be_null("id")',
          'validator.expect_column_values_to_be_unique("id")',
          'validator.expect_column_values_to_be_between(',
          '    "confidence", min_value=0, max_value=1',
          ')',
          '```',
          '',
          '**산출물**:',
          '- [ ] Expectation Suite 정의',
          '- [ ] 검증 파이프라인 통합',
          '- [ ] 데이터 문서 (Data Docs)'
        ],
        externalLinks: [
          { title: 'Great Expectations', url: 'https://github.com/great-expectations/great_expectations' },
          { title: 'GX Documentation', url: 'https://docs.greatexpectations.io/' }
        ]
      }
    },
    {
      id: 'data-docs',
      type: 'project',
      title: '데이터 문서화',
      duration: 60,
      content: {
        objectives: [
          '데이터 카탈로그를 작성한다',
          '데이터 리니지를 문서화한다'
        ],
        requirements: [
          '**데이터 카탈로그**',
          '',
          '| 테이블/컬렉션 | 설명 | 소스 | 갱신 주기 |',
          '|--------------|------|------|----------|',
          '| raw.stocks | 주가 데이터 | Yahoo Finance | 실시간 |',
          '| raw.news | 뉴스 기사 | 네이버 | 1시간 |',
          '| ... | ... | ... | ... |',
          '',
          '**데이터 리니지**',
          '```',
          'Yahoo Finance → raw.stocks → staging.stocks → mart.stock_analysis',
          '                    ↓',
          '           Neo4j (triples)',
          '```'
        ]
      }
    }
  ]
}

const day4: Day = {
  slug: 'storage-setup',
  title: '저장소 구축',
  totalDuration: 180,
  tasks: [
    {
      id: 'database-setup',
      type: 'project',
      title: '데이터베이스 스키마 적용',
      duration: 90,
      content: {
        objectives: [
          'PostgreSQL 스키마를 적용한다',
          'Neo4j 초기 설정을 완료한다',
          'Vector Store를 설정한다'
        ],
        requirements: [
          '**Day 4 마일스톤: 저장소**',
          '',
          '## PostgreSQL',
          '```sql',
          '-- migrations/001_init.sql',
          'CREATE SCHEMA IF NOT EXISTS raw;',
          'CREATE SCHEMA IF NOT EXISTS staging;',
          'CREATE SCHEMA IF NOT EXISTS mart;',
          '',
          '-- 도메인별 테이블 생성',
          '```',
          '',
          '## Neo4j',
          '```cypher',
          '// 제약조건 생성',
          'CREATE CONSTRAINT company_id IF NOT EXISTS',
          'FOR (c:Company) REQUIRE c.id IS UNIQUE;',
          '',
          '// 인덱스 생성',
          'CREATE INDEX company_name IF NOT EXISTS',
          'FOR (c:Company) ON (c.name);',
          '```',
          '',
          '## Vector Store (Chroma/Pinecone)',
          '```python',
          'from langchain_community.vectorstores import Chroma',
          'vectorstore = Chroma(',
          '    persist_directory="./chroma_db",',
          '    embedding_function=embeddings',
          ')',
          '```',
          '',
          '**산출물**:',
          '- [ ] PostgreSQL 스키마 마이그레이션',
          '- [ ] Neo4j 제약조건/인덱스',
          '- [ ] Vector Store 초기화'
        ]
      }
    },
    {
      id: 'initial-data-load',
      type: 'project',
      title: '초기 데이터 로딩',
      duration: 90,
      content: {
        objectives: [
          '수집된 데이터를 저장소에 로드한다',
          '데이터 무결성을 확인한다'
        ],
        requirements: [
          '**초기 데이터 로딩 체크리스트**',
          '',
          '- [ ] raw 데이터 로딩 (PostgreSQL)',
          '- [ ] Triple 데이터 로딩 (Neo4j)',
          '- [ ] 문서 임베딩 (Vector Store)',
          '- [ ] 데이터 count 확인',
          '- [ ] 샘플 쿼리 테스트'
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
      id: 'pipeline-integration-test',
      type: 'project',
      title: '파이프라인 통합 테스트',
      duration: 90,
      content: {
        objectives: [
          'End-to-End 파이프라인을 테스트한다',
          '발견된 문제를 수정한다'
        ],
        requirements: [
          '**E2E 테스트 시나리오**',
          '',
          '1. 데이터 소스에서 데이터 수집',
          '2. ETL 파이프라인 실행',
          '3. 데이터 품질 검증',
          '4. 저장소 로딩',
          '5. 쿼리로 데이터 확인',
          '',
          '```bash',
          '# 전체 파이프라인 실행',
          'python -m src.data.pipeline --full-run',
          '',
          '# 또는 Airflow DAG 트리거',
          'airflow dags trigger capstone_etl',
          '```'
        ]
      }
    },
    {
      id: 'week3-review',
      type: 'challenge',
      title: 'Week 3 마일스톤 리뷰',
      duration: 90,
      content: {
        objectives: [
          'Week 3 산출물을 점검한다',
          'Week 4 계획을 수립한다'
        ],
        requirements: [
          '**Week 3 체크리스트**',
          '',
          '## 산출물',
          '- [ ] 데이터 소스 연동 완료',
          '- [ ] ETL 파이프라인 (Airflow DAG)',
          '- [ ] 데이터 품질 검증 (Great Expectations)',
          '- [ ] 데이터베이스 스키마 적용',
          '- [ ] 초기 데이터 로딩 완료',
          '- [ ] E2E 파이프라인 테스트 통과',
          '',
          '## GitHub',
          '- [ ] M1 마일스톤 이슈 완료',
          '- [ ] PR 머지',
          '- [ ] README 업데이트',
          '',
          '**Week 4 목표**:',
          '- Knowledge Graph 온톨로지 구현',
          '- Triple 데이터 로딩',
          '- 기본 추론 규칙'
        ],
        evaluationCriteria: [
          '파이프라인 동작 여부',
          '데이터 품질',
          '코드 품질'
        ]
      }
    }
  ]
}

export const capstoneDataPipelineWeek: Week = {
  slug: 'capstone-data-pipeline',
  week: 3,
  phase: 6,
  month: 11,
  access: 'pro',
  title: '데이터 파이프라인 구축',
  topics: ['ETL', 'Airflow', 'Data Quality', 'Great Expectations', 'PostgreSQL', 'Neo4j'],
  practice: 'End-to-End 데이터 파이프라인',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
