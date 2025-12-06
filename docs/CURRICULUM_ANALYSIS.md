# FDE Academy 커리큘럼 심층 분석

> 목적: 각 주차별로 "학생이 어디서 막히는가"를 분석하여 시뮬레이터 개발 스펙 도출
> 작성일: 2025-12-04
> 상태: 진행 중

---

## 분석 프레임워크

각 주차를 분석할 때 다음 질문에 답합니다:

1. **핵심 개념**: 이 주차에서 학생이 반드시 이해해야 하는 것은?
2. **막히는 지점**: 학생들이 보통 어디서 혼란을 느끼는가?
3. **손으로 해봐야 하는 것**: 읽기만으로 안 되고 직접 해봐야 이해되는 것은?
4. **필요한 도구/환경**: 실습을 위해 무엇이 필요한가?
5. **시뮬레이터 필요성**: 브라우저 기반 시뮬레이터가 학습에 도움이 되는가?
6. **대안**: 시뮬레이터 없이 해결 가능한 방법은?

---

## Phase 1: 데이터 엔지니어링 기초 (3개월)

### Month 1: Python 심화 & 데이터 처리

---

#### Week 1: Python 심화 문법

**토픽**: 제너레이터와 이터레이터, 데코레이터 패턴, 컨텍스트 매니저, Type Hints & mypy

**1. 핵심 개념**
- 제너레이터: 메모리 효율적인 이터레이션 (yield vs return)
- 데코레이터: 함수를 감싸서 기능 추가 (@ 문법)
- 컨텍스트 매니저: 리소스 관리 (with 문)
- Type Hints: 정적 타입 검사

**2. 막히는 지점**
- 제너레이터: "yield가 return과 뭐가 다른지 머리로는 알겠는데 언제 쓰는지 모르겠다"
- 데코레이터: "함수가 함수를 반환한다는 게 헷갈린다", "@ 문법이 내부적으로 뭘 하는지 모르겠다"
- 컨텍스트 매니저: "__enter__, __exit__가 언제 호출되는지 모르겠다"
- Type Hints: 실제 런타임에 영향이 없다는 게 혼란스럽다

**3. 손으로 해봐야 하는 것**
- 제너레이터로 대용량 파일 한 줄씩 읽어보기 vs 전체 읽기 메모리 비교
- 데코레이터로 함수 실행 시간 측정기 직접 만들기
- with 문 없이 파일 열고 닫기 vs with 문 사용 비교

**4. 필요한 도구/환경**
- Python 인터프리터 (Jupyter 또는 VS Code)
- 메모리 모니터링 도구 (memory_profiler)

**5. 시뮬레이터 필요성**: 낮음
- Python 자체가 이미 인터랙티브
- Jupyter Notebook이면 충분
- 단, **"데코레이터 실행 흐름 시각화"**는 유용할 수 있음
  - 함수가 어떤 순서로 호출되는지 애니메이션으로 보여주면 이해에 도움

**6. 대안**
- Jupyter Notebook + print문으로 실행 흐름 추적
- Python Tutor (pythontutor.com) - 실행 과정 시각화

**시뮬레이터 후보**:
- [ ] 데코레이터 실행 흐름 시각화 (우선순위: 낮음)

---

#### Week 2: pandas 고급 활용

**토픽**: 대용량 CSV 청크 처리, MultiIndex 활용, apply vs vectorize 성능, Dask 소개

**1. 핵심 개념**
- 청크 처리: 메모리에 안 올라가는 데이터 처리
- MultiIndex: 계층적 인덱스
- 벡터화: 루프 vs pandas 연산 성능 차이
- Dask: pandas의 분산 처리 버전

**2. 막히는 지점**
- 청크: "청크 크기를 어떻게 정해야 하는지 모르겠다"
- MultiIndex: "인덱싱 문법이 너무 복잡하다 (xs, loc, iloc 혼란)"
- 벡터화: "apply가 왜 느린지 체감이 안 된다"
- Dask: "pandas랑 뭐가 다른지 모르겠다"

**3. 손으로 해봐야 하는 것**
- 실제 1GB+ CSV 파일로 청크 처리 vs 전체 로드 메모리/시간 비교
- apply vs vectorize 성능 벤치마크 직접 돌려보기
- Dask로 같은 작업 해보기

**4. 필요한 도구/환경**
- Jupyter Notebook
- 대용량 샘플 데이터셋 (1GB+)
- %%timeit, memory_profiler

**5. 시뮬레이터 필요성**: 중간
- **대용량 데이터 제공이 핵심 문제**
- 학생이 1GB 파일을 어디서 구하나?
- 시뮬레이터보다는 **"샘플 데이터셋 생성기"**가 필요

**6. 대안**
- Kaggle 대용량 데이터셋 링크 제공
- 데이터 생성 스크립트 제공

**시뮬레이터 후보**:
- [ ] 대용량 CSV 생성기 (우선순위: 중간)
- [ ] pandas 성능 벤치마크 대시보드 (우선순위: 낮음)

---

#### Week 3: SQL 심화

**토픽**: 윈도우 함수 (ROW_NUMBER, LAG/LEAD), CTE와 재귀 쿼리, 실행 계획 분석, 인덱스 최적화

**1. 핵심 개념**
- 윈도우 함수: 그룹 내 순위, 이전/다음 행 참조
- CTE: WITH 절로 가독성 높은 쿼리 작성
- 재귀 CTE: 계층 구조 데이터 처리
- 실행 계획: EXPLAIN으로 쿼리 성능 분석

**2. 막히는 지점**
- 윈도우 함수: "PARTITION BY와 GROUP BY 차이가 헷갈린다"
- 재귀 CTE: "종료 조건이 어떻게 작동하는지 모르겠다"
- 실행 계획: "EXPLAIN 결과를 어떻게 읽는지 모르겠다"
- 인덱스: "어떤 컬럼에 인덱스를 걸어야 하는지 감이 안 온다"

**3. 손으로 해봐야 하는 것**
- 같은 결과를 GROUP BY vs 윈도우 함수로 작성해보기
- 재귀 CTE로 조직도/카테고리 트리 조회
- 인덱스 있을 때 vs 없을 때 실행 계획 비교

**4. 필요한 도구/환경**
- PostgreSQL (또는 MySQL, SQLite)
- 샘플 데이터베이스 (직원, 주문, 카테고리 등)
- DBeaver 또는 pgAdmin

**5. 시뮬레이터 필요성**: 높음 ⭐
- **환경 설정이 큰 장벽**: DB 설치, 접속 설정, 권한 문제
- **브라우저 기반 SQL 실습 환경**이 매우 유용
- 특히 **실행 계획 시각화**는 이해에 큰 도움

**6. 대안**
- SQLFiddle, DB Fiddle (외부 서비스)
- Docker로 PostgreSQL 컨테이너 제공
- 하지만 "우리 커리큘럼에 맞춘 데이터"가 없음

**시뮬레이터 후보**:
- [x] **SQL 실습 환경 (우선순위: 높음)** ⭐
  - 브라우저 기반 SQL 에디터
  - 커리큘럼에 맞는 샘플 데이터 내장
  - 실행 계획 시각화
  - 윈도우 함수 결과 단계별 시각화

---

#### Week 4: 데이터 모델링

**토픽**: 정규화 (1NF~3NF), 스타 스키마 vs 스노우플레이크, SCD (Slowly Changing Dimension), Data Vault 소개

**1. 핵심 개념**
- 정규화: 중복 제거, 이상 현상 방지
- 역정규화: 성능을 위한 의도적 중복
- 스타 스키마: Fact + Dimension 테이블
- SCD: 시간에 따라 변하는 데이터 처리

**2. 막히는 지점**
- 정규화: "2NF와 3NF 차이가 미묘하다"
- 스타 vs 스노우플레이크: "언제 어떤 걸 써야 하는지 모르겠다"
- SCD: "Type 1, 2, 3 중 어떤 걸 선택해야 하는지 감이 안 온다"

**3. 손으로 해봐야 하는 것**
- 비정규화된 테이블을 3NF까지 분해해보기
- 실제 비즈니스 시나리오로 스타 스키마 설계
- SCD Type 2 테이블 직접 구현

**4. 필요한 도구/환경**
- ERD 도구 (draw.io, dbdiagram.io)
- SQL 환경 (Week 3과 동일)

**5. 시뮬레이터 필요성**: 중간
- **ERD 시각화 도구**는 외부에 좋은 것들이 많음
- **정규화 단계별 변환 시각화**는 유용할 수 있음
- **SCD Type 2 시뮬레이터**는 독특한 가치 있음

**6. 대안**
- dbdiagram.io (ERD)
- 직접 SQL로 구현

**시뮬레이터 후보**:
- [ ] 정규화 단계별 변환 시각화 (우선순위: 낮음)
- [ ] SCD Type 2 시뮬레이터 (우선순위: 중간)

---

### Month 2: Apache Spark & 분산 처리

---

#### Week 5: Spark 아키텍처

**토픽**: RDD vs DataFrame vs Dataset, Spark 실행 모델 (Driver, Executor), Lazy Evaluation, 파티셔닝 전략

**1. 핵심 개념**
- RDD: 저수준 API, 타입 안전
- DataFrame: 고수준 API, 최적화
- Lazy Evaluation: 액션이 호출될 때까지 실행 안 함
- 파티셔닝: 데이터 분산 방식

**2. 막히는 지점**
- "RDD, DataFrame, Dataset 중 뭘 써야 하는지 모르겠다"
- Lazy Evaluation: "왜 바로 실행 안 하는지 이점을 모르겠다"
- 파티셔닝: "파티션 수를 어떻게 정해야 하는지 모르겠다"
- **환경 설정**: "로컬에 Spark 설치가 안 된다" ⭐

**3. 손으로 해봐야 하는 것**
- 같은 작업을 RDD vs DataFrame으로 해보고 성능 비교
- .explain()으로 실행 계획 확인
- repartition vs coalesce 차이 확인

**4. 필요한 도구/환경**
- Spark (로컬 또는 클라우드)
- Jupyter + PySpark
- 최소 8GB RAM 권장

**5. 시뮬레이터 필요성**: 매우 높음 ⭐⭐
- **Spark 설치가 가장 큰 장벽**
- 로컬 설치: Java, Spark, 환경변수, 메모리 설정...
- Databricks Community Edition은 무료지만 회원가입/대기 필요
- **브라우저 기반 Spark 환경**은 매우 가치 있음

**6. 대안**
- Databricks Community Edition (무료, 15GB 클러스터)
- Google Colab + PySpark (설치 필요하지만 가능)
- Docker 컨테이너

**시뮬레이터 후보**:
- [x] **Spark 실습 환경 (우선순위: 매우 높음)** ⭐⭐
  - 또는: Databricks Community Edition 가이드 + 템플릿 노트북 제공
  - 실행 계획 시각화 (DAG Visualization)
  - 파티션 분포 시각화

---

#### Week 6: PySpark 심화

**토픽**: DataFrame API 마스터, UDF 작성법, 브로드캐스트 변수, Accumulator 활용

**1. 핵심 개념**
- DataFrame API: select, filter, groupBy, join 등
- UDF: 사용자 정의 함수 (성능 주의)
- 브로드캐스트: 작은 데이터를 모든 노드에 복제
- Accumulator: 분산 환경에서 카운터

**2. 막히는 지점**
- UDF: "왜 UDF가 느린지 체감이 안 된다"
- 브로드캐스트: "언제 써야 하는지 감이 안 온다"
- "DataFrame API가 pandas와 비슷한데 미묘하게 다르다"

**3. 손으로 해봐야 하는 것**
- UDF vs 내장 함수 성능 비교
- 브로드캐스트 join vs 일반 join 성능 비교
- pandas API on Spark 사용해보기

**4. 필요한 도구/환경**
- Week 5와 동일 (Spark 환경)

**5. 시뮬레이터 필요성**: Week 5와 동일
- Spark 환경이 있으면 추가 시뮬레이터 불필요

**시뮬레이터 후보**: Week 5에 통합

---

#### Week 7: SparkSQL & 최적화

**토픽**: SparkSQL vs DataFrame, Catalyst Optimizer, Tungsten 엔진, 파티션 pruning

**1. 핵심 개념**
- SparkSQL: SQL 문법으로 DataFrame 조작
- Catalyst: 쿼리 최적화 엔진
- Tungsten: 메모리 최적화 엔진
- 파티션 pruning: 필요한 파티션만 읽기

**2. 막히는 지점**
- "Catalyst가 내부적으로 뭘 하는지 모르겠다"
- "실행 계획을 어떻게 읽어야 최적화할 수 있는지 모르겠다"

**3. 손으로 해봐야 하는 것**
- .explain(true)로 논리/물리 계획 비교
- 의도적으로 비효율적인 쿼리 작성 후 최적화
- 파티션된 데이터에서 필터 조건에 따른 성능 차이 확인

**4. 필요한 도구/환경**
- Week 5와 동일

**5. 시뮬레이터 필요성**: 중간
- **Spark 실행 계획 시각화**가 유용
- 하지만 Spark UI가 이미 제공함

**시뮬레이터 후보**:
- [ ] Catalyst 최적화 과정 시각화 (우선순위: 낮음) - 교육적 가치는 있으나 개발 복잡도 높음

---

#### Week 8: Spark ML 기초

**토픽**: MLlib 파이프라인, Feature Engineering, 모델 학습 & 평가, Cross Validation

**1. 핵심 개념**
- Pipeline: 전처리 → 학습 → 예측 단계 연결
- Transformer/Estimator 패턴
- 평가 메트릭: accuracy, precision, recall, AUC

**2. 막히는 지점**
- "scikit-learn이랑 API가 달라서 헷갈린다"
- "Transformer와 Estimator 차이가 뭔지 모르겠다"

**3. 손으로 해봐야 하는 것**
- 간단한 분류 모델 파이프라인 구축
- 하이퍼파라미터 튜닝
- 모델 저장/로드

**4. 필요한 도구/환경**
- Week 5와 동일

**5. 시뮬레이터 필요성**: 낮음
- Spark 환경이 있으면 충분
- ML은 결과 확인이 중요한데, 그건 Jupyter로 가능

---

### Month 3: 실시간 스트리밍 & 워크플로우

---

#### Week 9: Apache Kafka 기초

**토픽**: Kafka 아키텍처 (Broker, Topic, Partition), Producer & Consumer API, Consumer Group, Offset 관리

**1. 핵심 개념**
- Kafka: 분산 메시지 큐
- Topic: 메시지 카테고리
- Partition: 병렬 처리 단위
- Consumer Group: 부하 분산

**2. 막히는 지점**
- **환경 설정**: "Kafka, Zookeeper 설치가 복잡하다" ⭐
- "Partition과 Consumer의 관계가 헷갈린다"
- "Offset이 뭔지 모르겠다"

**3. 손으로 해봐야 하는 것**
- Producer로 메시지 보내고 Consumer로 받아보기
- Consumer Group에 Consumer 추가/제거 시 리밸런싱 확인
- Offset 수동 관리해보기

**4. 필요한 도구/환경**
- Kafka + Zookeeper (또는 KRaft 모드)
- kafka-console-producer, kafka-console-consumer

**5. 시뮬레이터 필요성**: 매우 높음 ⭐⭐
- **Kafka 설치가 Spark보다 더 어려움**
- Docker Compose로도 초보자에겐 복잡
- **브라우저 기반 Kafka 시뮬레이터**는 엄청난 가치
- 특히 **Partition-Consumer 매핑 시각화**, **Offset 시각화**

**6. 대안**
- Confluent Cloud (무료 티어)
- Docker Compose 템플릿 제공
- 하지만 "개념 이해"를 위한 시각화는 별도 필요

**시뮬레이터 후보**:
- [x] **Kafka 시뮬레이터 (우선순위: 매우 높음)** ⭐⭐
  - 토픽/파티션 생성 시각화
  - Producer → Partition → Consumer 메시지 흐름 애니메이션
  - Consumer Group 리밸런싱 시각화
  - Offset 개념 시각화

---

#### Week 10: Kafka 심화 & 스트리밍

**토픽**: Kafka Streams, Exactly-once 시맨틱, Schema Registry, KSQL 소개

**1. 핵심 개념**
- Kafka Streams: 스트림 처리 라이브러리
- Exactly-once: 메시지 중복 없는 처리
- Schema Registry: 스키마 버전 관리
- KSQL: SQL로 스트림 처리

**2. 막히는 지점**
- "At-least-once, At-most-once, Exactly-once 차이가 뭔지 모르겠다"
- "Schema Registry가 왜 필요한지 모르겠다"

**3. 손으로 해봐야 하는 것**
- Kafka Streams로 간단한 변환 애플리케이션 작성
- 스키마 변경 시 호환성 테스트

**4. 필요한 도구/환경**
- Week 9 + Schema Registry + KSQL

**5. 시뮬레이터 필요성**: 중간
- Week 9 시뮬레이터 확장
- **Exactly-once 시맨틱 시각화**는 교육적 가치 높음

**시뮬레이터 후보**:
- [ ] 메시지 전달 보장 시각화 (우선순위: 중간)
  - At-least-once: 재전송 시 중복 발생 시각화
  - Exactly-once: 트랜잭션 흐름 시각화

---

#### Week 11: Apache Airflow

**토픽**: DAG 작성법, Operator 종류, XCom 통신, Task Dependencies

**1. 핵심 개념**
- DAG: 방향성 비순환 그래프로 워크플로우 정의
- Operator: 실제 작업 수행 단위
- XCom: Task 간 데이터 전달
- 스케줄링: cron 표현식

**2. 막히는 지점**
- **환경 설정**: "Airflow 설치가 복잡하다 (메타데이터 DB, 웹서버, 스케줄러...)" ⭐
- "DAG가 언제 실행되는지 헷갈린다 (execution_date 개념)"
- "XCom으로 큰 데이터를 전달하면 안 되는 이유를 모르겠다"

**3. 손으로 해봐야 하는 것**
- 간단한 DAG 작성 (PythonOperator, BashOperator)
- Task 의존성 설정 (>> 연산자)
- 실패 시 재시도, 알림 설정

**4. 필요한 도구/환경**
- Airflow (Docker 권장)
- 웹 UI 접근

**5. 시뮬레이터 필요성**: 높음 ⭐
- **Airflow 설치가 복잡**
- Docker로 제공해도 초보자에겐 어려움
- **DAG 시각화 + 실행 시뮬레이션**이 유용
- 특히 **execution_date 개념 시각화**

**6. 대안**
- Astronomer (무료 티어)
- Docker Compose 템플릿
- Google Cloud Composer (무료 크레딧)

**시뮬레이터 후보**:
- [x] **Airflow DAG 시뮬레이터 (우선순위: 높음)** ⭐
  - DAG 시각화 (노드 + 엣지)
  - 실행 흐름 애니메이션
  - execution_date vs logical_date 시각화
  - 실패/재시도 시뮬레이션

---

#### Week 12: E2E 파이프라인 프로젝트

**토픽**: Kafka → Spark Streaming → Data Lake, Delta Lake 소개, 모니터링 & 알림, 에러 핸들링

**1. 핵심 개념**
- 엔드투엔드 파이프라인 통합
- Delta Lake: ACID 트랜잭션 지원 데이터 레이크
- 모니터링: 메트릭 수집, 알림

**2. 막히는 지점**
- "여러 시스템을 연결하는 게 어렵다"
- "에러가 어디서 발생했는지 추적이 어렵다"

**3. 손으로 해봐야 하는 것**
- Kafka → Spark Streaming → S3/Delta Lake 파이프라인 구축
- 장애 시나리오 테스트

**4. 필요한 도구/환경**
- Week 9 (Kafka) + Week 5 (Spark) + S3 또는 MinIO

**5. 시뮬레이터 필요성**: 낮음
- 이 주차는 "통합"이 목적
- 시뮬레이터보다는 **잘 구성된 Docker Compose 템플릿**이 유용

**시뮬레이터 후보**:
- [ ] E2E 파이프라인 아키텍처 시각화 (우선순위: 낮음)

---

## Phase 1 시뮬레이터 요약

| 우선순위 | 시뮬레이터 | 주차 | 이유 |
|----------|-----------|------|------|
| ⭐⭐ 매우 높음 | Kafka 시뮬레이터 | Week 9-10 | 설치 어려움 + 개념 복잡 |
| ⭐⭐ 매우 높음 | Spark 실습 환경 | Week 5-8 | 설치 어려움 + 리소스 필요 |
| ⭐ 높음 | SQL 실습 환경 | Week 3 | 환경 설정 장벽 + 실행 계획 시각화 |
| ⭐ 높음 | Airflow DAG 시뮬레이터 | Week 11 | 설치 복잡 + execution_date 개념 |
| 중간 | 대용량 CSV 생성기 | Week 2 | 샘플 데이터 제공 |
| 중간 | SCD Type 2 시뮬레이터 | Week 4 | 개념 시각화 |
| 낮음 | 데코레이터 실행 흐름 | Week 1 | Python Tutor로 대체 가능 |

---

## Phase 2: 온톨로지 & 지식 그래프 (2개월)

> 이 Phase는 FDE Academy의 **핵심 차별화 포인트**입니다.
> 시중에 온톨로지 교육 콘텐츠가 거의 없기 때문에 여기에 투자할 가치가 높습니다.

### Month 4: 온톨로지 기초

---

#### Week 13: 온톨로지 개념 & RDF

**토픽**: 온톨로지란 무엇인가, RDF 트리플 (Subject-Predicate-Object), URI와 IRI, Turtle 문법

**1. 핵심 개념**
- 온톨로지: 도메인의 개념과 관계를 명시적으로 정의한 것
- RDF (Resource Description Framework): 지식을 트리플로 표현
- 트리플: "삼성전자 - 경쟁사 - SK하이닉스" 같은 주어-술어-목적어 구조
- URI: 전 세계에서 유일하게 식별 가능한 이름
- Turtle: RDF를 사람이 읽기 쉽게 표현하는 문법

**2. 막히는 지점**
- "온톨로지가 대체 뭔지 모르겠다" - 추상적 개념 ⭐
- "왜 굳이 트리플로 표현해야 하는지 모르겠다" - 동기 부족
- "URI가 왜 필요한지 모르겠다, 그냥 이름 쓰면 안 되나?"
- "Turtle 문법에서 @prefix가 헷갈린다"
- **실습 환경 없음**: "RDF를 어디서 작성하고 확인하지?" ⭐⭐

**3. 손으로 해봐야 하는 것**
- 실제 도메인(회사, 사람, 제품)을 트리플로 표현해보기
- Turtle 파일 직접 작성
- 작성한 트리플을 시각화해서 그래프로 보기
- 잘못된 트리플 vs 올바른 트리플 비교

**4. 필요한 도구/환경**
- RDF 에디터
- 트리플 유효성 검사기
- 그래프 시각화 도구

**5. 시뮬레이터 필요성**: 매우 높음 ⭐⭐⭐
- **온톨로지 교육의 가장 큰 문제: 추상적임**
- 글로 읽으면 이해한 것 같은데 직접 못 만듦
- **"입력 → 즉시 시각화" 도구가 핵심**
- 시중에 이런 교육용 도구가 거의 없음

**6. 대안**
- Protégé: 너무 복잡하고 설치 필요
- RDF Validator (W3C): 유효성만 검사, 시각화 없음
- WebVOWL: 온톨로지 시각화만, 에디터 아님

**시뮬레이터 후보**:
- [x] **RDF Triple Editor & Visualizer (우선순위: 최상)** ⭐⭐⭐
  - 브라우저 기반 Turtle 에디터
  - 실시간 문법 검사
  - 입력 즉시 그래프 시각화
  - 트리플 추가/삭제 시 그래프 변화 애니메이션
  - 예제 템플릿 제공 (회사 관계, 영화 배우, 책-저자 등)
  - URI vs Literal 차이 시각화

---

#### Week 14: RDFS & OWL

**토픽**: RDFS 스키마 (Class, Property), OWL 표현력 (Restriction, Cardinality), Protégé 도구 활용, 추론 규칙

**1. 핵심 개념**
- RDFS: RDF의 스키마 정의 (클래스 계층, 프로퍼티 정의)
- rdfs:subClassOf: 클래스 상속
- rdfs:domain, rdfs:range: 프로퍼티의 주어/목적어 타입 제한
- OWL: 더 풍부한 표현력 (owl:equivalentClass, owl:inverseOf 등)
- 추론: 명시적으로 정의하지 않은 사실을 도출

**2. 막히는 지점**
- "RDFS와 OWL 차이가 뭔지 모르겠다" ⭐
- "왜 스키마가 필요한지 모르겠다, 트리플만 있으면 안 되나?"
- "Protégé UI가 너무 복잡하다" ⭐
- "추론이 어떻게 작동하는지 모르겠다"
- owl:Restriction, owl:someValuesFrom 같은 복잡한 표현

**3. 손으로 해봐야 하는 것**
- 클래스 계층 정의 (Person → Employee → Manager)
- 프로퍼티에 domain/range 설정하고 제약 조건 확인
- 추론 전/후 트리플 비교
- OWL로 inverse property 정의 (worksFor ↔ employs)

**4. 필요한 도구/환경**
- Protégé (또는 대안)
- 추론 엔진 (Pellet, HermiT)

**5. 시뮬레이터 필요성**: 매우 높음 ⭐⭐⭐
- Protégé는 학습 곡선이 너무 가파름
- **"RDFS/OWL 개념을 시각적으로 이해"**하는 것이 핵심
- 추론 과정을 단계별로 보여주는 것이 매우 유용

**6. 대안**
- Protégé: 설치 필요 + 복잡
- WebProtégé: 온라인이지만 여전히 복잡

**시뮬레이터 후보**:
- [x] **OWL Class Builder (우선순위: 최상)** ⭐⭐⭐
  - 시각적 클래스 계층 빌더 (드래그 & 드롭)
  - 프로퍼티 domain/range 시각화
  - **추론 시각화**: 새 사실이 도출되는 과정을 애니메이션으로
  - RDFS vs OWL 표현력 비교
  - 예제: "Person → Student, Student subClassOf Person,
    John rdf:type Student → 추론: John rdf:type Person"

---

#### Week 15: SPARQL 쿼리

**토픽**: SELECT, CONSTRUCT, ASK, DESCRIBE, FILTER와 OPTIONAL, Aggregation, Property Path

**1. 핵심 개념**
- SPARQL: RDF 데이터를 질의하는 언어 (SQL과 유사)
- SELECT: 변수 바인딩 조회
- CONSTRUCT: 새 트리플 생성
- FILTER: 조건 필터링
- OPTIONAL: 있으면 가져오고 없어도 OK
- Property Path: 경로 패턴 (친구의 친구의 친구)

**2. 막히는 지점**
- "SQL이랑 비슷한데 미묘하게 다르다" ⭐
- "Triple Pattern이 헷갈린다 (?s ?p ?o)"
- "OPTIONAL이 왜 필요한지 모르겠다"
- Property Path 문법 (*, +, /, |)
- **실습 환경 없음**: "SPARQL을 어디서 실행하지?" ⭐⭐

**3. 손으로 해봐야 하는 것**
- 간단한 SELECT 쿼리부터 시작
- 같은 질문을 SQL vs SPARQL로 비교
- Wikidata에서 실제 쿼리 실행
- Property Path로 "친구의 친구" 찾기

**4. 필요한 도구/환경**
- SPARQL 엔드포인트 (Wikidata, DBpedia)
- 로컬: Apache Jena Fuseki

**5. 시뮬레이터 필요성**: 매우 높음 ⭐⭐⭐
- Wikidata SPARQL은 데이터가 너무 복잡 (초보자에게 부담)
- **커리큘럼에 맞는 간단한 데이터셋**으로 연습 필요
- **쿼리 결과 시각화**가 학습에 큰 도움
- 특히 Property Path 결과를 그래프로 보여주면 이해도 급상승

**6. 대안**
- Wikidata Query Service (외부, 복잡한 데이터)
- Apache Jena Fuseki (설치 필요)
- RDFox, GraphDB 등 (설치 필요, 일부 유료)

**시뮬레이터 후보**:
- [x] **SPARQL Query Lab (우선순위: 최상)** ⭐⭐⭐
  - 브라우저 기반 SPARQL 에디터
  - **교육용 샘플 데이터셋** 내장 (회사, 영화, 책 등)
  - 실시간 문법 검사
  - 쿼리 결과를 테이블 + 그래프로 시각화
  - Property Path 결과를 그래프 위에 하이라이트
  - SQL ↔ SPARQL 변환 예제
  - 단계별 튜토리얼 (기초 → 고급)

---

#### Week 16: 공개 지식 그래프 활용

**토픽**: Wikidata 구조 이해, DBpedia 탐색, FIBO (금융) 살펴보기, Schema.org 활용

**1. 핵심 개념**
- Wikidata: 위키피디아의 구조화된 데이터
- DBpedia: 위키피디아에서 추출한 지식 그래프
- FIBO: 금융 산업 표준 온톨로지
- Schema.org: 웹 구조화 데이터 표준

**2. 막히는 지점**
- "Wikidata의 P31, Q5 같은 코드가 뭔지 모르겠다"
- "데이터가 너무 방대해서 어디서부터 시작할지 모르겠다"
- "FIBO가 너무 복잡하다"

**3. 손으로 해봐야 하는 것**
- Wikidata에서 특정 회사/인물 정보 조회
- DBpedia로 영화-배우 관계 탐색
- FIBO로 금융 상품 계층 구조 탐색
- Schema.org로 웹페이지에 구조화 데이터 추가

**4. 필요한 도구/환경**
- 각 KG의 SPARQL 엔드포인트
- Week 15의 SPARQL 실력

**5. 시뮬레이터 필요성**: 중간
- 외부 서비스 사용법 익히는 게 목표
- **가이드 문서 + 예제 쿼리 모음**이 더 유용
- 하지만 **FIBO 시각화**는 독자적 가치 있음 (너무 복잡해서)

**6. 대안**
- 각 KG 공식 쿼리 서비스

**시뮬레이터 후보**:
- [ ] Wikidata 탐색 가이드 (우선순위: 낮음)
- [x] **FIBO Explorer (우선순위: 중간)**
  - FIBO 클래스 계층 시각화
  - 금융 상품 관계 탐색
  - 실제 사용 사례 예제

---

### Month 5: 지식 그래프 & 추론

---

#### Week 17: 추론 엔진

**토픽**: RDFS 추론 규칙, OWL 추론 (Transitive, Symmetric), Forward vs Backward Chaining, Pellet/HermiT

**1. 핵심 개념**
- 추론: 명시적 사실로부터 암묵적 사실 도출
- RDFS 추론 예: A subClassOf B, x rdf:type A → x rdf:type B
- OWL 추론: transitive (조상의 조상도 조상), symmetric (친구의 친구도 친구?)
- Forward Chaining: 사실 → 결론 방향
- Backward Chaining: 질문 → 증거 방향

**2. 막히는 지점**
- "추론이 내부적으로 어떻게 작동하는지 모르겠다" ⭐
- "언제 forward, 언제 backward를 쓰는지 모르겠다"
- "Pellet, HermiT 설치가 어렵다"
- "추론 결과가 왜 이렇게 나왔는지 모르겠다" (설명 없음)

**3. 손으로 해봐야 하는 것**
- 간단한 온톨로지에서 추론 전/후 트리플 비교
- transitive property 예: locatedIn (서울 in 한국, 한국 in 아시아 → 서울 in 아시아)
- 추론 규칙 직접 적용해보기

**4. 필요한 도구/환경**
- 추론 엔진 (Pellet, HermiT, EYE)
- Protégé 또는 프로그래밍 환경

**5. 시뮬레이터 필요성**: 매우 높음 ⭐⭐⭐
- **추론 과정 시각화**가 핵심
- "왜 이 결론이 나왔는지" 단계별로 보여주는 것이 중요
- 설치 없이 브라우저에서 추론 실행

**시뮬레이터 후보**:
- [x] **Reasoning Engine Visualizer (우선순위: 높음)** ⭐⭐
  - 트리플 입력 → 추론 → 새 트리플 시각화
  - **추론 과정 단계별 애니메이션**
  - 각 추론 규칙이 어떻게 적용되었는지 설명
  - Forward vs Backward Chaining 비교 시각화
  - 예제: 가족 관계 추론 (조부모, 삼촌 등)

---

#### Week 18: 지식 그래프 구축

**토픽**: Neo4j vs RDF Store, GraphDB/Virtuoso 설치, 지식 추출 (NER, RE), 엔티티 연결

**1. 핵심 개념**
- Neo4j: Property Graph 모델 (노드와 엣지에 속성)
- RDF Store: 트리플 저장소 (표준 기반)
- NER (Named Entity Recognition): 텍스트에서 개체 추출
- RE (Relation Extraction): 개체 간 관계 추출
- Entity Linking: 추출된 개체를 KG와 연결

**2. 막히는 지점**
- "Neo4j vs RDF 중 어떤 걸 써야 하는지 모르겠다" ⭐
- "GraphDB, Virtuoso 설치가 어렵다"
- "NER은 어떻게 하는 거지?" (ML 필요)
- "Entity Linking이 어렵다"

**3. 손으로 해봐야 하는 것**
- 같은 데이터를 Neo4j vs RDF Store에 넣어보기
- spaCy로 NER 해보기
- GPT로 관계 추출 해보기
- 추출된 개체를 Wikidata와 연결해보기

**4. 필요한 도구/환경**
- Neo4j (Desktop 또는 Aura 무료)
- GraphDB Free 또는 Apache Jena Fuseki
- spaCy, Hugging Face Transformers

**5. 시뮬레이터 필요성**: 높음 ⭐⭐
- Neo4j Aura는 무료지만 회원가입 필요
- **Triple Extraction 시뮬레이터**가 유용
  - 텍스트 입력 → NER + RE → 트리플 추출 과정 시각화
  - 이미 KSS-Ontology에서 구현한 것 재활용 가능

**시뮬레이터 후보**:
- [x] **Triple Extraction Pipeline (우선순위: 높음)** ⭐⭐
  - 텍스트 입력
  - NER 결과 하이라이트
  - 관계 추출 결과 시각화
  - 생성된 트리플 미리보기
  - Entity Linking 시연 (Wikidata 연결)

---

#### Week 19: Knowledge Graph Embedding

**토픽**: TransE, RotatE, Link Prediction, 지식 완성 (Knowledge Completion), PyKEEN 실습

**1. 핵심 개념**
- KG Embedding: 엔티티와 관계를 벡터로 표현
- TransE: head + relation ≈ tail
- Link Prediction: 누락된 관계 예측
- Knowledge Completion: 불완전한 KG 채우기

**2. 막히는 지점**
- "임베딩이 왜 필요한지 모르겠다" ⭐
- "TransE 수식이 이해 안 된다"
- "PyKEEN 사용법이 어렵다"

**3. 손으로 해봐야 하는 것**
- 작은 KG로 TransE 학습
- Link Prediction 결과 확인
- 다른 모델 (RotatE, ComplEx) 비교

**4. 필요한 도구/환경**
- PyKEEN
- PyTorch
- Jupyter

**5. 시뮬레이터 필요성**: 중간
- PyKEEN 튜토리얼이 잘 되어 있음
- **임베딩 시각화**가 도움될 수 있음 (t-SNE/UMAP)
- 하지만 개념 자체가 ML 지식 필요

**시뮬레이터 후보**:
- [ ] KG Embedding Visualizer (우선순위: 낮음)
  - 임베딩 공간 시각화
  - 유사 엔티티 클러스터링

---

#### Week 20: KG 프로젝트

**토픽**: 데이터 수집 & 정제, 스키마 설계, Triple 추출 파이프라인, 시각화

**1. 핵심 개념**
- 엔드투엔드 KG 구축 경험
- 실제 데이터로 작업하는 어려움

**2. 막히는 지점**
- "어디서부터 시작할지 모르겠다"
- "데이터가 지저분하다"
- "스키마를 어떻게 설계해야 할지 모르겠다"

**3. 손으로 해봐야 하는 것**
- 특정 도메인 선택 (영화, 음악, 스포츠 등)
- 데이터 수집 (API, 스크래핑)
- 스키마 설계
- Triple 추출
- 시각화

**4. 필요한 도구/환경**
- 앞서 배운 모든 도구

**5. 시뮬레이터 필요성**: 낮음
- 이 주차는 통합 프로젝트
- 시뮬레이터보다 **템플릿/가이드**가 유용

**시뮬레이터 후보**:
- [ ] KG Project Template (우선순위: 낮음)

---

## Phase 2 시뮬레이터 요약

| 우선순위 | 시뮬레이터 | 주차 | 이유 |
|----------|-----------|------|------|
| ⭐⭐⭐ 최상 | **RDF Triple Editor & Visualizer** | Week 13 | 온톨로지 교육의 핵심, 시중에 없음 |
| ⭐⭐⭐ 최상 | **SPARQL Query Lab** | Week 15 | 교육용 데이터셋 + 시각화 필요 |
| ⭐⭐⭐ 최상 | **OWL Class Builder** | Week 14 | Protégé 대체, 추론 시각화 |
| ⭐⭐ 높음 | **Reasoning Engine Visualizer** | Week 17 | 추론 과정 이해에 필수 |
| ⭐⭐ 높음 | **Triple Extraction Pipeline** | Week 18 | KSS-Ontology 재활용 가능 |
| 중간 | FIBO Explorer | Week 16 | 금융 도메인 특화 |
| 낮음 | KG Embedding Visualizer | Week 19 | ML 지식 필요 |

---

## Phase 1 + Phase 2 통합 우선순위

**가장 먼저 개발해야 할 시뮬레이터 TOP 5:**

1. **RDF Triple Editor & Visualizer** - 온톨로지 교육의 기초, 차별화 포인트
2. **SPARQL Query Lab** - 실습 필수, 교육용 데이터셋 포함
3. **OWL Class Builder** - RDFS/OWL 개념 시각화, Protégé 대체
4. **Kafka 시뮬레이터** - 설치 장벽 해결, 개념 시각화
5. **SQL 실습 환경** - 기초 기술, 많은 학생이 혜택

---

## Phase 3: 클라우드 & 인프라 (2개월)

### Month 6: AWS & 클라우드 기초

---

#### Week 21: 컴퓨팅 & 네트워크

**토픽**: EC2 인스턴스 유형, VPC/Subnet/Security Group, Load Balancer, Auto Scaling

**1. 핵심 개념**
- EC2: 가상 서버, 인스턴스 유형 (t2, m5, c5 등)
- VPC: 가상 네트워크, 격리된 환경
- Security Group: 방화벽 규칙
- Load Balancer: 트래픽 분산
- Auto Scaling: 부하에 따른 자동 확장

**2. 막히는 지점**
- "인스턴스 유형이 너무 많아서 뭘 골라야 할지 모르겠다"
- "VPC, Subnet, CIDR 블록이 헷갈린다" ⭐
- "Security Group vs NACL 차이가 뭔지 모르겠다"
- **비용 부담**: "AWS 쓰다가 요금 폭탄 맞으면 어떡하지?" ⭐⭐

**3. 손으로 해봐야 하는 것**
- VPC 처음부터 구축 (서브넷, 라우팅 테이블, IGW)
- EC2 인스턴스 생성 및 SSH 접속
- ALB + Auto Scaling 구성
- Security Group 규칙 설정

**4. 필요한 도구/환경**
- AWS 계정 (Free Tier)
- AWS CLI
- SSH 클라이언트

**5. 시뮬레이터 필요성**: 중간
- AWS Free Tier가 1년간 무료
- **VPC 시각화 도구**가 유용할 수 있음
- 하지만 AWS 콘솔 자체가 이미 시각화 제공
- **비용 계산기/경고 시스템**이 더 실용적

**6. 대안**
- AWS Free Tier (실제 환경이 최고)
- LocalStack (로컬 AWS 에뮬레이터)

**시뮬레이터 후보**:
- [ ] VPC 아키텍처 시각화 (우선순위: 낮음) - AWS 콘솔이 이미 제공
- [x] **AWS 비용 계산기 & 모니터링 가이드 (우선순위: 중간)**
  - Free Tier 한도 알림
  - 예상 비용 계산
  - 비용 최적화 팁

---

#### Week 22: 스토리지 & 데이터베이스

**토픽**: S3 버킷 정책 & Lifecycle, RDS vs Aurora, DynamoDB 설계 패턴, ElastiCache

**1. 핵심 개념**
- S3: 객체 스토리지, 무제한 확장
- RDS: 관리형 관계형 DB
- Aurora: AWS 자체 고성능 DB
- DynamoDB: NoSQL, 서버리스
- ElastiCache: Redis/Memcached 관리형

**2. 막히는 지점**
- "S3 버킷 정책 JSON이 복잡하다" ⭐
- "RDS vs Aurora vs DynamoDB 중 뭘 써야 하는지 모르겠다"
- "DynamoDB 파티션 키, 정렬 키 설계가 어렵다" ⭐

**3. 손으로 해봐야 하는 것**
- S3 버킷 생성, 정책 설정, Lifecycle 규칙
- RDS 인스턴스 생성 및 접속
- DynamoDB 테이블 설계 및 CRUD

**4. 필요한 도구/환경**
- AWS 계정

**5. 시뮬레이터 필요성**: 중간
- **DynamoDB 데이터 모델링 도구**가 유용
- NoSQL Workbench가 있지만 설치 필요

**시뮬레이터 후보**:
- [ ] DynamoDB 스키마 디자이너 (우선순위: 낮음)
- [ ] S3 정책 생성기 (우선순위: 낮음) - AWS Policy Generator 존재

---

#### Week 23: 서버리스 & IAM

**토픽**: Lambda 함수 작성, API Gateway, Step Functions, IAM 정책 작성

**1. 핵심 개념**
- Lambda: 서버리스 함수, 이벤트 기반
- API Gateway: REST/HTTP API 관리
- Step Functions: 워크플로우 오케스트레이션
- IAM: 권한 관리, 최소 권한 원칙

**2. 막히는 지점**
- "Lambda 콜드 스타트가 뭔지, 어떻게 줄이는지 모르겠다"
- "IAM 정책 JSON이 복잡하다" ⭐
- "Step Functions 상태 머신이 헷갈린다"

**3. 손으로 해봐야 하는 것**
- Lambda 함수 생성 (Python/Node.js)
- API Gateway 연동
- IAM 역할/정책 생성

**4. 필요한 도구/환경**
- AWS 계정
- SAM CLI (선택)

**5. 시뮬레이터 필요성**: 낮음
- Lambda는 Free Tier 100만 요청/월 무료
- **IAM 정책 시뮬레이터**는 AWS가 이미 제공

**시뮬레이터 후보**:
- [ ] Step Functions 시각적 빌더 (우선순위: 낮음) - AWS가 이미 제공

---

#### Week 24: Terraform IaC

**토픽**: HCL 문법, State 관리, 모듈화, Terraform Cloud

**1. 핵심 개념**
- IaC: 인프라를 코드로 관리
- HCL: HashiCorp Configuration Language
- State: 인프라 상태 추적
- 모듈: 재사용 가능한 인프라 컴포넌트

**2. 막히는 지점**
- "HCL 문법이 JSON도 YAML도 아니라서 헷갈린다"
- "State 파일 관리가 어렵다 (특히 팀 환경)" ⭐
- "모듈화를 어떻게 해야 할지 모르겠다"

**3. 손으로 해봐야 하는 것**
- 간단한 인프라 (VPC + EC2) Terraform으로 생성
- terraform plan, apply, destroy 사이클
- 모듈 만들어서 재사용

**4. 필요한 도구/환경**
- Terraform CLI
- AWS 계정

**5. 시뮬레이터 필요성**: 낮음
- Terraform은 로컬에서 실행 가능
- `terraform plan`이 이미 시뮬레이션 역할
- **Terraform 시각화 도구**는 있으면 좋지만 필수 아님

**시뮬레이터 후보**:
- [ ] Terraform 아키텍처 시각화 (우선순위: 낮음)

---

### Month 7: 컨테이너 & Kubernetes

---

#### Week 25: Docker 심화

**토픽**: Multi-stage Build, Docker Compose, 이미지 최적화, Registry 운영

**1. 핵심 개념**
- Multi-stage Build: 빌드 환경과 런타임 분리
- Docker Compose: 멀티 컨테이너 애플리케이션
- 이미지 레이어: 캐싱 최적화
- Registry: 이미지 저장소

**2. 막히는 지점**
- "Dockerfile 작성 순서에 따라 빌드 시간이 달라지는 이유를 모르겠다"
- "Docker Compose 네트워크가 헷갈린다"
- "이미지 크기를 어떻게 줄이는지 모르겠다"

**3. 손으로 해봐야 하는 것**
- Multi-stage Dockerfile 작성
- Docker Compose로 웹 + DB + Redis 구성
- 이미지 크기 최적화 (alpine, distroless)

**4. 필요한 도구/환경**
- Docker Desktop

**5. 시뮬레이터 필요성**: 낮음
- Docker는 로컬 설치가 쉬움
- 실제 환경에서 하는 게 최고

**시뮬레이터 후보**: 없음

---

#### Week 26: Kubernetes 기초

**토픽**: Pod, Service, Deployment, ReplicaSet & Scaling, kubectl 마스터

**1. 핵심 개념**
- Pod: 컨테이너 그룹, 최소 배포 단위
- Service: Pod 네트워크 노출
- Deployment: 선언적 업데이트 관리
- ReplicaSet: 복제본 관리

**2. 막히는 지점**
- "Pod, Deployment, ReplicaSet 관계가 헷갈린다" ⭐
- "Service 유형 (ClusterIP, NodePort, LoadBalancer) 차이가 뭔지 모르겠다"
- **환경 설정**: "K8s 클러스터를 어디서 구하지?" ⭐⭐

**3. 손으로 해봐야 하는 것**
- Pod 생성 및 로그 확인
- Deployment 생성 및 스케일링
- Service로 외부 노출

**4. 필요한 도구/환경**
- Kubernetes 클러스터 (minikube, kind, Docker Desktop)
- kubectl

**5. 시뮬레이터 필요성**: 높음 ⭐⭐
- **K8s 클러스터 설정이 초보자에게 장벽**
- minikube도 리소스를 많이 먹음
- **브라우저 기반 K8s 플레이그라운드**가 유용
- 하지만 Killercoda, Play with Kubernetes 같은 무료 서비스 존재

**6. 대안**
- Killercoda (무료, 브라우저 기반)
- Play with Kubernetes (무료)
- minikube (로컬)

**시뮬레이터 후보**:
- [ ] K8s 개념 시각화 (우선순위: 중간)
  - Pod → ReplicaSet → Deployment 관계 애니메이션
  - Service 트래픽 흐름 시각화

---

#### Week 27: Kubernetes 심화

**토픽**: ConfigMap & Secret, PersistentVolume, Ingress Controller, Helm 차트

**1. 핵심 개념**
- ConfigMap: 설정 데이터 분리
- Secret: 민감 데이터 관리
- PV/PVC: 영구 스토리지
- Ingress: HTTP 라우팅
- Helm: K8s 패키지 매니저

**2. 막히는 지점**
- "ConfigMap vs Secret 언제 뭘 써야 하는지 모르겠다"
- "PV, PVC, StorageClass 관계가 복잡하다" ⭐
- "Helm 차트 구조가 헷갈린다"

**3. 손으로 해봐야 하는 것**
- ConfigMap으로 환경변수 주입
- PVC로 데이터 영속화
- Helm 차트 설치 및 커스터마이징

**4. 필요한 도구/환경**
- Week 26과 동일

**5. 시뮬레이터 필요성**: 중간
- **PV/PVC 시각화**가 도움될 수 있음
- Helm 차트 구조 시각화

**시뮬레이터 후보**:
- [ ] K8s 스토리지 시각화 (우선순위: 낮음)

---

#### Week 28: EKS/GKE 프로덕션

**토픽**: EKS 클러스터 구축, 모니터링 (Prometheus, Grafana), CI/CD 파이프라인, GitOps (ArgoCD)

**1. 핵심 개념**
- EKS: AWS 관리형 K8s
- Prometheus: 메트릭 수집
- Grafana: 시각화 대시보드
- ArgoCD: GitOps 기반 배포

**2. 막히는 지점**
- "EKS 비용이 부담된다" ⭐⭐
- "Prometheus 쿼리 언어 (PromQL)가 어렵다"
- "ArgoCD 설정이 복잡하다"

**3. 손으로 해봐야 하는 것**
- EKS 클러스터 생성 (eksctl)
- Prometheus + Grafana 설치
- ArgoCD로 GitOps 배포

**4. 필요한 도구/환경**
- AWS 계정 (EKS는 Free Tier 아님, 비용 발생)
- eksctl, kubectl, helm

**5. 시뮬레이터 필요성**: 낮음
- 실제 클라우드 환경에서 해야 의미 있음
- **비용 최소화 가이드**가 더 중요

**시뮬레이터 후보**:
- [ ] EKS 비용 계산기 (우선순위: 낮음)

---

## Phase 3 시뮬레이터 요약

| 우선순위 | 시뮬레이터 | 주차 | 이유 |
|----------|-----------|------|------|
| 중간 | AWS 비용 계산기 & 가이드 | Week 21 | 비용 부담 해소 |
| 중간 | K8s 개념 시각화 | Week 26-27 | 복잡한 관계 이해 |
| 낮음 | Terraform 시각화 | Week 24 | 있으면 좋지만 필수 아님 |

**Phase 3 특징:**
- 대부분 **실제 클라우드 환경**에서 해야 의미 있음
- 시뮬레이터보다 **가이드, 템플릿, 비용 관리**가 더 중요
- Free Tier 활용법, 비용 알림 설정이 핵심

---

## Phase 4: AI/ML & GenAI (2개월)

### Month 8: LLM & 프롬프트 엔지니어링

---

#### Week 29: LLM 기초

**토픽**: Transformer 아키텍처 이해, GPT vs Claude vs Gemini, API 사용법, 토큰과 비용 계산

**1. 핵심 개념**
- Transformer: Attention 메커니즘 기반 아키텍처
- LLM: 대규모 언어 모델
- 토큰: 텍스트 처리 단위
- API: OpenAI, Anthropic, Google 등

**2. 막히는 지점**
- "Transformer가 어떻게 작동하는지 모르겠다" (수학적)
- "토큰이 정확히 뭔지 모르겠다" ⭐
- "GPT-4 vs Claude 3 vs Gemini 중 뭘 써야 하는지 모르겠다"
- **비용 부담**: "API 쓰다가 요금 폭탄 맞으면?" ⭐

**3. 손으로 해봐야 하는 것**
- 각 LLM API 호출해보기
- 토큰 수 계산해보기
- 같은 프롬프트로 다른 모델 비교

**4. 필요한 도구/환경**
- OpenAI, Anthropic, Google AI API 키
- Python + requests 또는 SDK

**5. 시뮬레이터 필요성**: 중간
- **토큰 카운터 & 비용 계산기**가 유용
- 하지만 OpenAI Tokenizer가 이미 존재

**시뮬레이터 후보**:
- [x] **LLM 비용 비교 계산기 (우선순위: 중간)**
  - 입력 텍스트 → 토큰 수 계산
  - 모델별 비용 비교 (GPT-4, Claude, Gemini)
  - 월간 예상 비용

---

#### Week 30: 프롬프트 엔지니어링

**토픽**: Zero-shot vs Few-shot, Chain of Thought, System Prompt 설계, 프롬프트 템플릿

**1. 핵심 개념**
- Zero-shot: 예시 없이 지시만으로
- Few-shot: 몇 가지 예시 제공
- CoT: 단계별 추론 유도
- System Prompt: 모델 역할/성격 설정

**2. 막히는 지점**
- "어떤 프롬프트가 좋은 프롬프트인지 판단이 어렵다" ⭐
- "Few-shot 예시를 몇 개 넣어야 하는지 모르겠다"
- "프롬프트 결과가 일관성이 없다"

**3. 손으로 해봐야 하는 것**
- 같은 작업에 다양한 프롬프트 시도
- Zero-shot vs Few-shot 비교
- CoT 적용 전/후 비교

**4. 필요한 도구/환경**
- LLM API 또는 ChatGPT/Claude 웹

**5. 시뮬레이터 필요성**: 높음 ⭐⭐
- **프롬프트 A/B 테스트 도구**가 유용
- 여러 프롬프트 버전 비교, 결과 저장, 성능 측정

**시뮬레이터 후보**:
- [x] **Prompt Playground (우선순위: 높음)** ⭐⭐
  - 여러 프롬프트 버전 비교
  - 결과 저장 및 히스토리
  - 토큰 수 & 비용 실시간 표시
  - 템플릿 라이브러리

---

#### Week 31: 임베딩 & 벡터 DB

**토픽**: Text Embedding 원리, OpenAI Embeddings, Pinecone/Weaviate/Chroma, 유사도 검색

**1. 핵심 개념**
- 임베딩: 텍스트를 벡터로 변환
- 벡터 DB: 고차원 벡터 저장/검색
- 유사도: 코사인 유사도, 유클리드 거리
- ANN (Approximate Nearest Neighbor): 빠른 유사도 검색

**2. 막히는 지점**
- "임베딩이 왜 필요한지 모르겠다" ⭐
- "벡터 DB가 일반 DB와 뭐가 다른지 모르겠다"
- "Pinecone vs Weaviate vs Chroma 중 뭘 써야 하는지 모르겠다"

**3. 손으로 해봐야 하는 것**
- 텍스트를 임베딩으로 변환
- 벡터 DB에 저장하고 유사 문서 검색
- 유사도 점수 해석

**4. 필요한 도구/환경**
- OpenAI Embeddings API
- Chroma (로컬, 무료) 또는 Pinecone (무료 티어)

**5. 시뮬레이터 필요성**: 높음 ⭐⭐
- **임베딩 시각화**가 이해에 큰 도움
- 비슷한 문장이 벡터 공간에서 가까이 위치하는 것을 시각적으로 확인

**시뮬레이터 후보**:
- [x] **Embedding Visualizer (우선순위: 높음)** ⭐⭐
  - 텍스트 입력 → 임베딩 → 2D/3D 시각화
  - 여러 문장의 유사도를 공간에서 확인
  - 클러스터링 시각화

---

#### Week 32: LLM 평가

**토픽**: BLEU, ROUGE, BERTScore, Human Evaluation, LLM-as-a-Judge, Hallucination 감지

**1. 핵심 개념**
- BLEU/ROUGE: n-gram 기반 평가
- BERTScore: 의미 기반 평가
- Human Evaluation: 사람 평가
- LLM-as-a-Judge: LLM이 LLM 평가
- Hallucination: 사실이 아닌 내용 생성

**2. 막히는 지점**
- "평가 메트릭이 너무 많아서 뭘 써야 할지 모르겠다"
- "Hallucination을 어떻게 감지하는지 모르겠다" ⭐

**3. 손으로 해봐야 하는 것**
- 다양한 메트릭으로 생성 결과 평가
- 의도적으로 hallucination 유발하고 감지

**4. 필요한 도구/환경**
- evaluate 라이브러리 (Hugging Face)
- LLM API

**5. 시뮬레이터 필요성**: 중간
- **LLM 평가 대시보드**가 유용할 수 있음
- 하지만 이 단계는 코딩 실습이 더 중요

**시뮬레이터 후보**:
- [ ] LLM 평가 대시보드 (우선순위: 낮음)

---

### Month 9: RAG & AI 에이전트

---

#### Week 33: RAG 기초

**토픽**: RAG 아키텍처, LangChain 기초, Document Loaders, Text Splitters

**1. 핵심 개념**
- RAG: Retrieval-Augmented Generation
- 문서 로드 → 청킹 → 임베딩 → 저장 → 검색 → 생성
- LangChain: RAG 구축 프레임워크

**2. 막히는 지점**
- "RAG 파이프라인 전체 흐름이 복잡하다" ⭐
- "청크 크기를 어떻게 정해야 하는지 모르겠다"
- "LangChain 버전이 자주 바뀌어서 문서가 안 맞는다" ⭐

**3. 손으로 해봐야 하는 것**
- PDF/텍스트 문서로 RAG 구축
- 다양한 청킹 전략 비교
- 질문에 대한 답변 생성

**4. 필요한 도구/환경**
- LangChain
- 벡터 DB (Chroma)
- LLM API

**5. 시뮬레이터 필요성**: 높음 ⭐⭐
- **RAG 파이프라인 시각화**가 이해에 큰 도움
- 각 단계(로드 → 청킹 → 임베딩 → 검색 → 생성)가 어떻게 작동하는지

**시뮬레이터 후보**:
- [x] **RAG Pipeline Visualizer (우선순위: 높음)** ⭐⭐
  - 문서 업로드 → 청킹 시각화
  - 임베딩 과정 시각화
  - 검색 결과 하이라이트
  - 최종 프롬프트 구성 확인

---

#### Week 34: RAG 심화

**토픽**: 하이브리드 검색 (BM25 + Dense), Re-ranking, Multi-Query RAG, Self-RAG

**1. 핵심 개념**
- 하이브리드 검색: 키워드 + 의미 검색 결합
- Re-ranking: 검색 결과 재정렬
- Multi-Query: 질문을 여러 버전으로 변환
- Self-RAG: 검색 필요성 자체 판단

**2. 막히는 지점**
- "언제 하이브리드 검색을 써야 하는지 모르겠다"
- "Re-ranking이 왜 필요한지 모르겠다"

**3. 손으로 해봐야 하는 것**
- BM25 vs Dense vs Hybrid 비교
- Re-ranker 적용 전/후 비교

**4. 필요한 도구/환경**
- Week 33 + Cohere Rerank 또는 다른 Re-ranker

**5. 시뮬레이터 필요성**: 중간
- Week 33 시뮬레이터 확장

---

#### Week 35: AI 에이전트

**토픽**: LangGraph 기초, Tool Use & Function Calling, 멀티 에이전트 시스템, ReAct 패턴

**1. 핵심 개념**
- AI 에이전트: 자율적으로 도구 사용하여 작업 수행
- Tool/Function Calling: LLM이 외부 함수 호출
- ReAct: Reasoning + Acting 패턴
- 멀티 에이전트: 여러 에이전트 협업

**2. 막히는 지점**
- "에이전트가 예상대로 행동하지 않는다" ⭐
- "어떤 도구를 제공해야 하는지 설계가 어렵다"
- "LangGraph 그래프 구조가 복잡하다" ⭐

**3. 손으로 해봐야 하는 것**
- 간단한 도구 사용 에이전트 구축 (계산기, 검색)
- ReAct 패턴 구현
- LangGraph로 상태 기반 에이전트

**4. 필요한 도구/환경**
- LangGraph
- LLM API with Function Calling

**5. 시뮬레이터 필요성**: 높음 ⭐⭐
- **에이전트 실행 흐름 시각화**가 디버깅에 필수
- 어떤 도구를 왜 호출했는지 추적

**시뮬레이터 후보**:
- [x] **Agent Trace Visualizer (우선순위: 높음)** ⭐⭐
  - 에이전트 사고 과정 시각화
  - 도구 호출 히스토리
  - 상태 변화 추적
  - 실패 지점 디버깅

---

#### Week 36: RAG 프로덕션

**토픽**: FastAPI 서버, 캐싱 전략, 모니터링 & 로깅, A/B 테스팅

**1. 핵심 개념**
- FastAPI: 고성능 Python 웹 프레임워크
- 캐싱: 반복 질문 성능 최적화
- 모니터링: 응답 시간, 비용, 품질 추적

**2. 막히는 지점**
- "RAG를 API로 어떻게 배포하는지 모르겠다"
- "캐싱을 어디에 해야 하는지 모르겠다"

**3. 손으로 해봐야 하는 것**
- FastAPI로 RAG API 서버 구축
- Redis 캐싱 적용
- LangSmith 또는 다른 도구로 모니터링

**4. 필요한 도구/환경**
- FastAPI
- Redis
- LangSmith (선택)

**5. 시뮬레이터 필요성**: 낮음
- 실제 코딩 실습이 더 중요

---

## Phase 4 시뮬레이터 요약

| 우선순위 | 시뮬레이터 | 주차 | 이유 |
|----------|-----------|------|------|
| ⭐⭐ 높음 | **Prompt Playground** | Week 30 | 프롬프트 비교/테스트 필수 |
| ⭐⭐ 높음 | **Embedding Visualizer** | Week 31 | 임베딩 개념 이해에 필수 |
| ⭐⭐ 높음 | **RAG Pipeline Visualizer** | Week 33-34 | 복잡한 파이프라인 이해 |
| ⭐⭐ 높음 | **Agent Trace Visualizer** | Week 35 | 에이전트 디버깅 필수 |
| 중간 | LLM 비용 비교 계산기 | Week 29 | 비용 관리 |
| 낮음 | LLM 평가 대시보드 | Week 32 | 코딩 실습이 더 중요 |

---

## Phase 5: 산업별 심화 (2개월)

### Month 10: 도메인 온톨로지 (택 1)

---

#### Week 37: 금융 도메인 - FIBO

**토픽**: FIBO 구조 이해, 금융 상품 온톨로지, 규제 컴플라이언스, 리스크 모델링

**1. 핵심 개념**
- FIBO: Financial Industry Business Ontology
- 금융 상품 계층: Equity, Bond, Derivative 등
- 규제: Basel III, MiFID II, GDPR

**2. 막히는 지점**
- "FIBO가 너무 방대하다 (2,457개 클래스)" ⭐
- "금융 도메인 지식이 부족하다"
- "어디서부터 시작해야 할지 모르겠다"

**3. 손으로 해봐야 하는 것**
- FIBO 일부 모듈 탐색
- 실제 금융 데이터로 온톨로지 적용
- SPARQL로 금융 관계 질의

**4. 필요한 도구/환경**
- FIBO 온톨로지 파일
- SPARQL 환경

**5. 시뮬레이터 필요성**: 높음 ⭐⭐
- **FIBO Navigator**가 매우 유용
- 복잡한 계층 구조를 탐색 가능하게

**시뮬레이터 후보**:
- [x] **FIBO Explorer (우선순위: 높음, Phase 2에서 중간으로 언급)** ⭐⭐
  - 클래스 계층 탐색
  - 프로퍼티 검색
  - 실제 사용 사례

---

#### Week 38: 의료 도메인 - FHIR

**토픽**: FHIR 리소스 구조, Patient/Observation/Condition, SMART on FHIR, CDS Hooks

**1. 핵심 개념**
- FHIR: Fast Healthcare Interoperability Resources
- 리소스: Patient, Observation, Condition, Medication 등
- SMART on FHIR: OAuth 기반 앱 인증

**2. 막히는 지점**
- "FHIR 리소스가 너무 많다 (157개)" ⭐
- "의료 도메인 지식이 부족하다"
- "SMART on FHIR 인증 흐름이 복잡하다"

**3. 손으로 해봐야 하는 것**
- FHIR 테스트 서버에서 리소스 CRUD
- 환자 데이터 조회
- SMART on FHIR 앱 인증 플로우

**4. 필요한 도구/환경**
- HAPI FHIR 테스트 서버 (무료)
- FHIR 클라이언트 라이브러리

**5. 시뮬레이터 필요성**: 중간
- HAPI FHIR 테스트 서버가 이미 무료
- **FHIR 리소스 시각화**가 도움될 수 있음

**시뮬레이터 후보**:
- [ ] FHIR Resource Explorer (우선순위: 중간)

---

#### Week 39: 국방/사이버 - BFO/ATT&CK

**토픽**: BFO (Basic Formal Ontology), MITRE ATT&CK Framework, 위협 인텔리전스, 사이버 킬체인

**1. 핵심 개념**
- BFO: 상위 온톨로지 (모든 도메인 온톨로지의 기반)
- ATT&CK: 공격 기법 분류 체계
- 킬체인: 공격 단계 (정찰 → 침입 → 확산 → 탈취)

**2. 막히는 지점**
- "BFO가 너무 추상적이다" ⭐
- "ATT&CK 매트릭스가 방대하다"
- "실제 위협 데이터를 어디서 구하지?"

**3. 손으로 해봐야 하는 것**
- ATT&CK 매트릭스 탐색
- 실제 공격 사례를 ATT&CK에 매핑
- 위협 인텔리전스 보고서 분석

**4. 필요한 도구/환경**
- ATT&CK Navigator (MITRE 제공)
- STIX/TAXII 데이터

**5. 시뮬레이터 필요성**: 중간
- ATT&CK Navigator가 이미 훌륭함
- **킬체인 시각화**가 교육적 가치 있음

**시뮬레이터 후보**:
- [ ] Cyber Kill Chain Simulator (우선순위: 중간)

---

#### Week 40: 도메인 모델링 실습

**토픽**: 도메인 전문가 인터뷰, 요구사항 분석, 온톨로지 설계 패턴, 검증 및 테스트

**1. 핵심 개념**
- 도메인 전문가와 협업
- 역량 질문 (Competency Questions)
- 온톨로지 디자인 패턴

**2. 막히는 지점**
- "도메인 전문가를 어디서 구하지?"
- "어떤 질문을 해야 하는지 모르겠다"

**3. 손으로 해봐야 하는 것**
- 가상 시나리오로 요구사항 도출
- 역량 질문 작성
- 온톨로지 설계 및 검증

**4. 필요한 도구/환경**
- Phase 2에서 배운 도구들

**5. 시뮬레이터 필요성**: 낮음
- 실제 프로젝트 경험이 더 중요

---

### Month 11: 미니 프로젝트

Week 41-44는 프로젝트 주간으로, 시뮬레이터보다는 **템플릿과 가이드**가 더 유용합니다.

**필요한 것:**
- 프로젝트 템플릿 (구조, 체크리스트)
- 참고할 수 있는 완성된 예제 프로젝트
- 코드 리뷰 가이드

---

## Phase 5 시뮬레이터 요약

| 우선순위 | 시뮬레이터 | 주차 | 이유 |
|----------|-----------|------|------|
| ⭐⭐ 높음 | FIBO Explorer | Week 37 | 복잡한 온톨로지 탐색 |
| 중간 | FHIR Resource Explorer | Week 38 | HAPI FHIR로 대체 가능 |
| 중간 | Cyber Kill Chain Simulator | Week 39 | 교육적 가치 |
| 낮음 | 프로젝트 템플릿 | Week 41-44 | 문서로 충분 |

---

## Phase 6: 실전 & 취업 (1개월)

### Month 12: 포트폴리오 & 면접

Week 45-48은 취업 준비 주간으로, 시뮬레이터보다는 **가이드와 템플릿**이 핵심입니다.

**필요한 것:**
- GitHub 프로필 최적화 가이드
- README 작성 템플릿
- 기술 면접 질문 은행 (Data Engineering, Ontology, Cloud, AI)
- 시스템 디자인 면접 예제
- 모의 면접 체크리스트

**시뮬레이터 후보**:
- [ ] 기술 면접 퀴즈 시스템 (우선순위: 중간)
  - 랜덤 질문 출제
  - 답변 체크
  - 약점 분석

---

## 전체 커리큘럼 시뮬레이터 최종 정리

### 최우선 개발 (⭐⭐⭐ - 차별화 핵심)

| 순위 | 시뮬레이터 | Phase/Week | 개발 복잡도 | 가치 |
|------|-----------|------------|-------------|------|
| 1 | **RDF Triple Editor & Visualizer** | Phase 2 / Week 13 | 중간 | 최상 |
| 2 | **SPARQL Query Lab** | Phase 2 / Week 15 | 높음 | 최상 |
| 3 | **OWL Class Builder** | Phase 2 / Week 14 | 높음 | 최상 |

### 높은 우선순위 (⭐⭐ - 학습 효과 높음)

| 순위 | 시뮬레이터 | Phase/Week | 개발 복잡도 | 가치 |
|------|-----------|------------|-------------|------|
| 4 | **Kafka 시뮬레이터** | Phase 1 / Week 9-10 | 높음 | 높음 |
| 5 | **SQL 실습 환경** | Phase 1 / Week 3 | 중간 | 높음 |
| 6 | **Reasoning Engine Visualizer** | Phase 2 / Week 17 | 중간 | 높음 |
| 7 | **Prompt Playground** | Phase 4 / Week 30 | 중간 | 높음 |
| 8 | **Embedding Visualizer** | Phase 4 / Week 31 | 중간 | 높음 |
| 9 | **RAG Pipeline Visualizer** | Phase 4 / Week 33 | 중간 | 높음 |
| 10 | **Agent Trace Visualizer** | Phase 4 / Week 35 | 중간 | 높음 |

### 중간 우선순위 (필요하면 개발)

| 시뮬레이터 | Phase/Week | 비고 |
|-----------|------------|------|
| Airflow DAG 시뮬레이터 | Phase 1 / Week 11 | 개념 시각화 |
| Triple Extraction Pipeline | Phase 2 / Week 18 | KSS-Ontology 재활용 |
| FIBO Explorer | Phase 2,5 / Week 16,37 | 금융 도메인 |
| K8s 개념 시각화 | Phase 3 / Week 26 | 외부 대안 존재 |
| LLM 비용 계산기 | Phase 4 / Week 29 | 비용 관리 |

### 낮은 우선순위 (있으면 좋지만 필수 아님)

- Spark 환경: Databricks Community Edition으로 대체
- AWS 비용 계산기: AWS 자체 도구 존재
- Terraform 시각화: terraform graph로 대체
- 기술 면접 퀴즈: 문서로 충분

---

## 개발 로드맵 제안

### 1단계: 온톨로지 코어 (Phase 2 지원) - 최우선

1. **RDF Triple Editor & Visualizer**
2. **SPARQL Query Lab**
3. **OWL Class Builder**

이 3개가 FDE Academy의 **차별화 포인트**입니다.
시중에 교육용으로 잘 만들어진 도구가 없습니다.

### 2단계: 데이터 엔지니어링 (Phase 1 지원)

4. **SQL 실습 환경** (커리큘럼 맞춤 데이터셋 포함)
5. **Kafka 시뮬레이터** (개념 시각화 중심)

### 3단계: AI/ML (Phase 4 지원)

6. **Prompt Playground**
7. **Embedding Visualizer**
8. **RAG Pipeline Visualizer**

### 4단계: 고급 기능

9. **Reasoning Engine Visualizer**
10. **Agent Trace Visualizer**
11. **FIBO Explorer**

---

## 다음 액션

1. ✅ 커리큘럼 심층 분석 완료
2. 시뮬레이터 상세 스펙 작성 (각 시뮬레이터별)
3. 프로토타입 개발 시작 (RDF Triple Editor부터)
4. 유튜브 콘텐츠 기획 (시뮬레이터 시연 영상)
