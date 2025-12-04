'use client'

import { useState } from 'react'

export default function CurriculumPage() {
  const [activeTab, setActiveTab] = useState<'main' | 'foundry'>('main')
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([1]))
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set(['1-2']))

  const togglePhase = (phase: number) => {
    setExpandedPhases(prev => {
      const newSet = new Set(prev)
      if (newSet.has(phase)) {
        newSet.delete(phase)
      } else {
        newSet.add(phase)
      }
      return newSet
    })
  }

  const toggleWeek = (week: string) => {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(week)) {
        newSet.delete(week)
      } else {
        newSet.add(week)
      }
      return newSet
    })
  }

  const mainCurriculum = [
    {
      phase: 1,
      title: '데이터 엔지니어링 기초',
      duration: '3개월',
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      lightBg: 'bg-blue-50',
      months: [
        {
          month: 1,
          title: 'Python 심화 & 데이터 처리',
          weeks: [
            { week: 1, title: 'Python 심화 문법', topics: ['제너레이터와 이터레이터', '데코레이터 패턴', '컨텍스트 매니저', 'Type Hints & mypy'], practice: '데코레이터 기반 로깅 시스템 구현' },
            { week: 2, title: 'pandas 고급 활용', topics: ['대용량 CSV 청크 처리', 'MultiIndex 활용', 'apply vs vectorize 성능', 'Dask 소개'], practice: '100GB 데이터셋 처리 파이프라인' },
            { week: 3, title: 'SQL 심화', topics: ['윈도우 함수 (ROW_NUMBER, LAG/LEAD)', 'CTE와 재귀 쿼리', '실행 계획 분석', '인덱스 최적화'], practice: 'SQL 쿼리 최적화 챌린지 20문제' },
            { week: 4, title: '데이터 모델링', topics: ['정규화 (1NF~3NF)', '스타 스키마 vs 스노우플레이크', 'SCD (Slowly Changing Dimension)', 'Data Vault 소개'], practice: '이커머스 데이터 웨어하우스 설계' }
          ],
          output: 'pandas 분석 프로젝트, SQL 쿼리 50개'
        },
        {
          month: 2,
          title: 'Apache Spark & 분산 처리',
          weeks: [
            { week: 1, title: 'Spark 아키텍처', topics: ['RDD vs DataFrame vs Dataset', 'Spark 실행 모델 (Driver, Executor)', 'Lazy Evaluation', '파티셔닝 전략'], practice: 'Local Spark 클러스터 구축' },
            { week: 2, title: 'PySpark 심화', topics: ['DataFrame API 마스터', 'UDF 작성법', '브로드캐스트 변수', 'Accumulator 활용'], practice: '대용량 로그 분석 파이프라인' },
            { week: 3, title: 'SparkSQL & 최적화', topics: ['SparkSQL vs DataFrame', 'Catalyst Optimizer', 'Tungsten 엔진', '파티션 pruning'], practice: '쿼리 성능 최적화 실습' },
            { week: 4, title: 'Spark ML 기초', topics: ['MLlib 파이프라인', 'Feature Engineering', '모델 학습 & 평가', 'Cross Validation'], practice: '추천 시스템 프로토타입' }
          ],
          output: 'PySpark 파이프라인 3개, Databricks 프로젝트'
        },
        {
          month: 3,
          title: '실시간 스트리밍 & 워크플로우',
          weeks: [
            { week: 1, title: 'Apache Kafka 기초', topics: ['Kafka 아키텍처 (Broker, Topic, Partition)', 'Producer & Consumer API', 'Consumer Group', 'Offset 관리'], practice: '실시간 이벤트 수집 시스템' },
            { week: 2, title: 'Kafka 심화 & 스트리밍', topics: ['Kafka Streams', 'Exactly-once 시맨틱', 'Schema Registry', 'KSQL 소개'], practice: '실시간 집계 대시보드' },
            { week: 3, title: 'Apache Airflow', topics: ['DAG 작성법', 'Operator 종류 (Python, Bash, Sensor)', 'XCom 통신', 'Task Dependencies'], practice: 'ETL 워크플로우 자동화' },
            { week: 4, title: 'E2E 파이프라인 프로젝트', topics: ['Kafka → Spark Streaming → Data Lake', 'Delta Lake 소개', '모니터링 & 알림', '에러 핸들링'], practice: '포트폴리오 #1: E2E 데이터 파이프라인' }
          ],
          output: '포트폴리오 #1: E2E 데이터 파이프라인'
        }
      ]
    },
    {
      phase: 2,
      title: '온톨로지 & 지식 그래프',
      duration: '2개월',
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
      lightBg: 'bg-purple-50',
      months: [
        {
          month: 4,
          title: '온톨로지 기초',
          weeks: [
            { week: 1, title: '온톨로지 개념 & RDF', topics: ['온톨로지란 무엇인가', 'RDF 트리플 (Subject-Predicate-Object)', 'URI와 IRI', 'Turtle 문법'], practice: 'RDF 트리플 50개 직접 작성' },
            { week: 2, title: 'RDFS & OWL', topics: ['RDFS 스키마 (Class, Property)', 'OWL 표현력 (Restriction, Cardinality)', 'Protégé 도구 활용', '추론 규칙'], practice: '도메인 온톨로지 설계' },
            { week: 3, title: 'SPARQL 쿼리', topics: ['SELECT, CONSTRUCT, ASK, DESCRIBE', 'FILTER와 OPTIONAL', 'Aggregation', 'Property Path'], practice: 'Wikidata SPARQL 쿼리 30개' },
            { week: 4, title: '공개 지식 그래프 활용', topics: ['Wikidata 구조 이해', 'DBpedia 탐색', 'FIBO (금융) 살펴보기', 'Schema.org 활용'], practice: '공개 KG 기반 질의응답 시스템' }
          ],
          output: 'RDF 트리플 100개, SPARQL 쿼리 30개'
        },
        {
          month: 5,
          title: '지식 그래프 & 추론',
          weeks: [
            { week: 1, title: '추론 엔진', topics: ['RDFS 추론 규칙', 'OWL 추론 (Transitive, Symmetric)', 'Forward vs Backward Chaining', 'Pellet/HermiT'], practice: '추론 규칙 기반 지식 확장' },
            { week: 2, title: '지식 그래프 구축', topics: ['Neo4j vs RDF Store', 'GraphDB/Virtuoso 설치', '지식 추출 (NER, RE)', '엔티티 연결'], practice: 'Neo4j 기반 KG 구축' },
            { week: 3, title: 'Knowledge Graph Embedding', topics: ['TransE, RotatE', 'Link Prediction', '지식 완성 (Knowledge Completion)', 'PyKEEN 실습'], practice: 'KG 임베딩 모델 학습' },
            { week: 4, title: 'KG 프로젝트', topics: ['데이터 수집 & 정제', '스키마 설계', 'Triple 추출 파이프라인', '시각화'], practice: 'Knowledge Graph 프로젝트 (100+ 노드)' }
          ],
          output: 'Knowledge Graph 프로젝트 (100+ 노드)'
        }
      ]
    },
    {
      phase: 3,
      title: '클라우드 & 인프라',
      duration: '2개월',
      color: 'bg-orange-500',
      borderColor: 'border-orange-500',
      lightBg: 'bg-orange-50',
      months: [
        {
          month: 6,
          title: 'AWS & 클라우드 기초',
          weeks: [
            { week: 1, title: '컴퓨팅 & 네트워크', topics: ['EC2 인스턴스 유형', 'VPC, Subnet, Security Group', 'Load Balancer (ALB, NLB)', 'Auto Scaling'], practice: '고가용성 웹 아키텍처 구축' },
            { week: 2, title: '스토리지 & 데이터베이스', topics: ['S3 버킷 정책 & Lifecycle', 'RDS vs Aurora', 'DynamoDB 설계 패턴', 'ElastiCache'], practice: '멀티티어 데이터 아키텍처' },
            { week: 3, title: '서버리스 & IAM', topics: ['Lambda 함수 작성', 'API Gateway', 'Step Functions', 'IAM 정책 작성'], practice: '서버리스 API 구축' },
            { week: 4, title: 'Terraform IaC', topics: ['HCL 문법', 'State 관리', '모듈화', 'Terraform Cloud'], practice: 'AWS SAA 자격증 준비' }
          ],
          output: 'AWS SAA 자격증'
        },
        {
          month: 7,
          title: '컨테이너 & Kubernetes',
          weeks: [
            { week: 1, title: 'Docker 심화', topics: ['Multi-stage Build', 'Docker Compose', '이미지 최적화', 'Registry 운영'], practice: '마이크로서비스 컨테이너화' },
            { week: 2, title: 'Kubernetes 기초', topics: ['Pod, Service, Deployment', 'ReplicaSet & Scaling', 'kubectl 마스터', 'YAML 매니페스트'], practice: 'K8s 클러스터 배포 실습' },
            { week: 3, title: 'Kubernetes 심화', topics: ['ConfigMap & Secret', 'PersistentVolume', 'Ingress Controller', 'Helm 차트'], practice: 'Helm 차트 작성' },
            { week: 4, title: 'EKS/GKE 프로덕션', topics: ['EKS 클러스터 구축', '모니터링 (Prometheus, Grafana)', 'CI/CD 파이프라인', 'GitOps (ArgoCD)'], practice: 'EKS 프로덕션 클러스터 배포' }
          ],
          output: 'K8s 매니페스트, EKS 클러스터 배포'
        }
      ]
    },
    {
      phase: 4,
      title: 'AI/ML & GenAI',
      duration: '2개월',
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      lightBg: 'bg-green-50',
      months: [
        {
          month: 8,
          title: 'LLM & 프롬프트 엔지니어링',
          weeks: [
            { week: 1, title: 'LLM 기초', topics: ['Transformer 아키텍처 이해', 'GPT vs Claude vs Gemini', 'API 사용법', '토큰과 비용 계산'], practice: 'OpenAI & Claude API 실습' },
            { week: 2, title: '프롬프트 엔지니어링', topics: ['Zero-shot vs Few-shot', 'Chain of Thought', 'System Prompt 설계', '프롬프트 템플릿'], practice: '프롬프트 라이브러리 구축' },
            { week: 3, title: '임베딩 & 벡터 DB', topics: ['Text Embedding 원리', 'OpenAI Embeddings', 'Pinecone/Weaviate/Chroma', '유사도 검색'], practice: '시맨틱 검색 엔진 구축' },
            { week: 4, title: 'LLM 평가', topics: ['BLEU, ROUGE, BERTScore', 'Human Evaluation', 'LLM-as-a-Judge', 'Hallucination 감지'], practice: '프롬프트 라이브러리 20개' }
          ],
          output: '프롬프트 라이브러리 20개'
        },
        {
          month: 9,
          title: 'RAG & AI 에이전트',
          weeks: [
            { week: 1, title: 'RAG 기초', topics: ['RAG 아키텍처', 'LangChain 기초', 'Document Loaders', 'Text Splitters'], practice: 'PDF 문서 Q&A 시스템' },
            { week: 2, title: 'RAG 심화', topics: ['하이브리드 검색 (BM25 + Dense)', 'Re-ranking', 'Multi-Query RAG', 'Self-RAG'], practice: '하이브리드 RAG 시스템' },
            { week: 3, title: 'AI 에이전트', topics: ['LangGraph 기초', 'Tool Use & Function Calling', '멀티 에이전트 시스템', 'ReAct 패턴'], practice: 'AI 에이전트 구축' },
            { week: 4, title: 'RAG 프로덕션', topics: ['FastAPI 서버', '캐싱 전략', '모니터링 & 로깅', 'A/B 테스팅'], practice: '포트폴리오 #2: RAG 애플리케이션' }
          ],
          output: '포트폴리오 #2: RAG 애플리케이션'
        }
      ]
    },
    {
      phase: 5,
      title: '산업별 심화',
      duration: '2개월',
      color: 'bg-red-500',
      borderColor: 'border-red-500',
      lightBg: 'bg-red-50',
      months: [
        {
          month: 10,
          title: '도메인 온톨로지 (택 1)',
          weeks: [
            { week: 1, title: '금융 도메인 - FIBO', topics: ['FIBO 구조 이해', '금융 상품 온톨로지', '규제 컴플라이언스', '리스크 모델링'], practice: 'FIBO 기반 투자 포트폴리오 분석' },
            { week: 2, title: '의료 도메인 - FHIR', topics: ['FHIR 리소스 구조', 'Patient, Observation, Condition', 'SMART on FHIR', 'CDS Hooks'], practice: 'FHIR 기반 환자 데이터 분석' },
            { week: 3, title: '국방/사이버 - BFO/ATT&CK', topics: ['BFO (Basic Formal Ontology)', 'MITRE ATT&CK Framework', '위협 인텔리전스', '사이버 킬체인'], practice: 'ATT&CK 기반 위협 분석' },
            { week: 4, title: '도메인 모델링 실습', topics: ['도메인 전문가 인터뷰', '요구사항 분석', '온톨로지 설계 패턴', '검증 및 테스트'], practice: '커스텀 도메인 온톨로지 설계' }
          ],
          output: '산업 표준 온톨로지 활용'
        },
        {
          month: 11,
          title: '미니 프로젝트',
          weeks: [
            { week: 1, title: '프로젝트 기획', topics: ['문제 정의', '데이터 소스 확보', '아키텍처 설계', '마일스톤 설정'], practice: '프로젝트 제안서 작성' },
            { week: 2, title: '데이터 파이프라인 구축', topics: ['데이터 수집', 'ETL 구현', 'KG 구축', 'API 개발'], practice: '백엔드 시스템 구축' },
            { week: 3, title: 'AI 기능 통합', topics: ['RAG 시스템 연동', 'LLM 통합', '추론 엔진 연결', 'UI 개발'], practice: '프론트엔드 & AI 통합' },
            { week: 4, title: '배포 & 문서화', topics: ['클라우드 배포', '성능 최적화', 'README 작성', '데모 영상'], practice: '포트폴리오 #3: 산업별 프로젝트' }
          ],
          output: '포트폴리오 #3: 산업별 프로젝트'
        }
      ]
    },
    {
      phase: 6,
      title: '실전 & 취업',
      duration: '1개월',
      color: 'bg-gray-500',
      borderColor: 'border-gray-500',
      lightBg: 'bg-gray-50',
      months: [
        {
          month: 12,
          title: '포트폴리오 & 면접',
          weeks: [
            { week: 1, title: '포트폴리오 정리', topics: ['GitHub 프로필 최적화', 'README 작성 가이드', '코드 리팩토링', '기술 블로그'], practice: 'GitHub 포트폴리오 완성' },
            { week: 2, title: '데모 & 프레젠테이션', topics: ['데모 영상 제작', '발표 스토리텔링', '기술 설명 연습', 'Q&A 대비'], practice: '5분 데모 영상 제작' },
            { week: 3, title: '기술 면접 준비', topics: ['시스템 디자인 면접', '코딩 테스트', 'SQL 면접 문제', 'ML 기초 문제'], practice: '모의 기술 면접 3회' },
            { week: 4, title: '행동 면접 & 취업', topics: ['STAR 기법', '자기소개 스크립트', '연봉 협상', '회사 리서치'], practice: '취업!' }
          ],
          output: '취업!'
        }
      ]
    }
  ]

  const foundryCurriculum = [
    {
      week: '1-2',
      title: 'Foundry Foundations',
      color: 'bg-cyan-500',
      borderColor: 'border-cyan-500',
      lightBg: 'bg-cyan-50',
      days: [
        { day: '1-3', title: '플랫폼 아키텍처', topics: ['Foundry 전체 아키텍처', 'Workspace Navigator', 'Compass 검색', 'Lineage 이해'], practice: '플랫폼 탐색 실습' },
        { day: '4-5', title: '데이터 탐색', topics: ['Dataset 구조', 'Contour 분석', '데이터 프리뷰', 'Metadata 관리'], practice: '샘플 데이터셋 분석' },
        { day: '6-8', title: '권한 모델', topics: ['Organization 구조', 'Project Roles', 'Marking 시스템', '접근 제어'], practice: '프로젝트 권한 설정' },
        { day: '9-10', title: 'Code Repositories 기초', topics: ['Git 통합', '브랜치 전략', 'Code Review', 'CI Checks'], practice: '첫 번째 Repository 생성' },
        { day: '11-14', title: 'Pipeline Builder 입문', topics: ['Transform 기초', '노드 연결', '스케줄링', '실행 모니터링'], practice: 'Foundations 배지 도전' }
      ],
      output: 'Foundations 배지'
    },
    {
      week: '3-4',
      title: 'Data Engineering Track',
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      lightBg: 'bg-blue-50',
      days: [
        { day: '1-3', title: 'Data Connection', topics: ['Source 연결 (JDBC, S3, API)', 'Sync 설정', '증분 로딩', '에러 핸들링'], practice: '외부 데이터 소스 연결' },
        { day: '4-6', title: 'Pipeline Builder 심화', topics: ['복잡한 Transform', 'Join 전략', '집계 함수', '조건부 로직'], practice: '복잡한 ETL 파이프라인' },
        { day: '7-8', title: '데이터 품질', topics: ['Data Expectations', '품질 규칙 정의', '모니터링 대시보드', '알림 설정'], practice: '품질 체크 구현' },
        { day: '9-11', title: 'Code Transforms (PySpark)', topics: ['PySpark in Foundry', '커스텀 함수', '파티셔닝', '성능 최적화'], practice: 'PySpark Transform 작성' },
        { day: '12-14', title: '멀티 입출력 & 테스트', topics: ['멀티 브랜치 파이프라인', '유닛 테스트', '통합 테스트', '디버깅'], practice: '데이터 파이프라인 프로젝트' }
      ],
      output: '데이터 파이프라인 프로젝트'
    },
    {
      week: '5-6',
      title: 'Ontology & Application',
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
      lightBg: 'bg-purple-50',
      days: [
        { day: '1-3', title: 'Ontology Manager', topics: ['Object Type 생성', 'Property 정의', 'Primary Key 설정', 'Backing Dataset'], practice: '도메인 온톨로지 설계' },
        { day: '4-5', title: 'Object Links & Actions', topics: ['Link Type 정의', '관계 매핑', 'Action 기초', '파라미터 설정'], practice: '엔티티 관계 모델링' },
        { day: '6-8', title: 'Workshop 기초', topics: ['Widget 종류', '레이아웃 설계', '데이터 바인딩', '필터링'], practice: '기본 대시보드 구축' },
        { day: '9-11', title: 'Workshop 심화', topics: ['Variables & Events', '조건부 렌더링', '커스텀 액션', 'Writeback'], practice: '인터랙티브 대시보드' },
        { day: '12-14', title: 'Quiver & Vertex', topics: ['그래프 시각화', '네트워크 분석', '패턴 탐지', '지도 시각화'], practice: '운영 애플리케이션' }
      ],
      output: '운영 애플리케이션'
    },
    {
      week: '7-8',
      title: 'AIP & Certification',
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      lightBg: 'bg-green-50',
      days: [
        { day: '1-3', title: 'AIP 개요 & Logic', topics: ['AIP 아키텍처', 'AIP Logic 함수', 'LLM 통합', '프롬프트 관리'], practice: 'AIP Logic 함수 작성' },
        { day: '4-6', title: 'Agentic Workflows', topics: ['에이전트 설계', 'Tool 정의', '워크플로우 체이닝', '에러 핸들링'], practice: 'AI 에이전트 구축' },
        { day: '7-8', title: 'PDF & 문서 처리', topics: ['Document AI', 'PDF 파싱', '정보 추출', '구조화'], practice: '문서 자동 처리 시스템' },
        { day: '9-11', title: '자격증 복습', topics: ['핵심 개념 정리', '실습 문제', '약점 보완', '팁 & 트릭'], practice: '영역별 복습 퀴즈' },
        { day: '12-14', title: '모의시험 & 시험', topics: ['모의시험 2회', '오답 분석', '최종 점검', '시험 응시'], practice: '공식 자격증!' }
      ],
      output: '공식 자격증!'
    }
  ]

  const certifications = [
    { name: 'AWS Solutions Architect Associate', month: 6, color: 'bg-orange-100 text-orange-700', details: '공식 시험 | $150' },
    { name: 'Databricks Data Engineer Associate', month: 3, color: 'bg-red-100 text-red-700', details: '공식 시험 | $200' }
  ]

  const foundryCertifications = [
    { name: 'Foundry Data Engineer', color: 'bg-blue-100 text-blue-700 border-blue-300', details: '60문제 | 70% 합격', topics: ['Data Connection', 'Pipeline Builder', 'Code Transforms', 'Data Quality'] },
    { name: 'Foundry Application Developer', color: 'bg-purple-100 text-purple-700 border-purple-300', details: '60문제 | 70% 합격', topics: ['Ontology Manager', 'Workshop', 'Quiver', 'Functions', 'OSDK'] }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className={`${activeTab === 'main' ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700' : 'bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600'} text-white`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            {activeTab === 'main' ? (
              <span className="px-3 py-1 bg-blue-500 rounded-full text-sm font-bold">MAIN COURSE</span>
            ) : (
              <span className="px-3 py-1 bg-purple-500 rounded-full text-sm font-bold">SPECIAL COURSE</span>
            )}
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">DRAFT v0.2</span>
          </div>
          <h1 className="text-4xl font-bold">{activeTab === 'main' ? 'FDE Academy' : 'Palantir Foundry 스페셜'}</h1>
          <p className={`${activeTab === 'main' ? 'text-blue-100' : 'text-purple-100'} mt-2 text-lg`}>
            {activeTab === 'main' ? 'Forward Deployed Engineer 양성 과정 | 12개월 풀타임' : 'Palantir Foundry 전문가 과정 | 2개월 집중 과정'}
          </p>
        </div>
      </header>

      <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            <button onClick={() => setActiveTab('main')} className={`px-8 py-4 font-bold transition-all border-b-4 ${activeTab === 'main' ? 'text-blue-600 border-blue-600 bg-blue-50' : 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${activeTab === 'main' ? 'bg-blue-600' : 'bg-gray-300'}`}>1</span>
                <div className="text-left">
                  <div>메인 과정</div>
                  <div className="text-xs font-normal opacity-70">12개월 | FDE 기초~실전</div>
                </div>
              </div>
            </button>
            <button onClick={() => setActiveTab('foundry')} className={`px-8 py-4 font-bold transition-all border-b-4 ${activeTab === 'foundry' ? 'text-purple-600 border-purple-600 bg-purple-50' : 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${activeTab === 'foundry' ? 'bg-purple-600' : 'bg-gray-300'}`}>2</span>
                <div className="text-left">
                  <div>Foundry 스페셜</div>
                  <div className="text-xs font-normal opacity-70">2개월 | Palantir 전문</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'main' ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="text-3xl font-bold text-blue-600">12개월</div>
                <div className="text-gray-600 mt-1">총 학습 기간</div>
              </div>
              <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                <div className="text-3xl font-bold text-green-600">6 Phases</div>
                <div className="text-gray-600 mt-1">단계별 학습</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                <div className="text-3xl font-bold text-purple-600">3개</div>
                <div className="text-gray-600 mt-1">포트폴리오 프로젝트</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                <div className="text-3xl font-bold text-orange-600">7천만~2억+</div>
                <div className="text-gray-600 mt-1">목표 연봉</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">커리큘럼 상세</h2>
            <div className="space-y-4">
              {mainCurriculum.map((phase) => (
                <div key={phase.phase} className={`bg-white rounded-xl overflow-hidden border-2 ${phase.borderColor}`}>
                  <button onClick={() => togglePhase(phase.phase)} className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl ${phase.color} flex items-center justify-center text-white font-bold text-lg`}>{phase.phase}</div>
                      <div className="text-left">
                        <span className="text-lg font-bold text-gray-900">Phase {phase.phase}: {phase.title}</span>
                        <span className="block text-gray-500 text-sm">{phase.duration}</span>
                      </div>
                    </div>
                    <span className={`text-2xl transition-transform ${expandedPhases.has(phase.phase) ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  {expandedPhases.has(phase.phase) && (
                    <div className={`px-6 pb-6 ${phase.lightBg}`}>
                      {phase.months.map((month) => (
                        <div key={month.month} className="mt-4">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 ${phase.color} text-white rounded-full text-sm font-medium`}>Month {month.month}</span>
                            <h4 className="font-bold text-lg">{month.title}</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {month.weeks.map((week) => (
                              <div key={week.week} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Week {week.week}</span>
                                <h5 className="font-semibold text-gray-900 mt-2 mb-2">{week.title}</h5>
                                <ul className="text-sm text-gray-600 space-y-1 mb-3">
                                  {week.topics.map((topic, i) => (
                                    <li key={i} className="flex items-start gap-1"><span className="text-gray-400">•</span><span>{topic}</span></li>
                                  ))}
                                </ul>
                                <div className="text-xs font-medium text-blue-600 pt-2 border-t border-gray-100">💻 {week.practice}</div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <span className="font-medium text-green-700">📦 산출물: {month.output}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6">자격증 로드맵</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <div key={cert.name} className={`px-5 py-4 rounded-xl ${cert.color} border`}>
                    <div className="font-bold text-lg">{cert.name}</div>
                    <div className="flex items-center gap-3 mt-2 text-sm opacity-80">
                      <span>Month {cert.month}</span><span>•</span><span>{cert.details}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8 border border-purple-200">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">Palantir Foundry 스페셜 과정</h2>
              <p className="text-gray-600">메인 과정 수료 후 선택 가능 | 2개월 (8주) | 공식 자격증 취득 목표</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-cyan-50 rounded-xl p-5 border border-cyan-100">
                <div className="text-3xl font-bold text-cyan-600">2개월</div>
                <div className="text-gray-600 mt-1">학습 기간</div>
              </div>
              <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                <div className="text-3xl font-bold text-green-600">4 Tracks</div>
                <div className="text-gray-600 mt-1">주차별 학습</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                <div className="text-3xl font-bold text-purple-600">2개</div>
                <div className="text-gray-600 mt-1">자격증 옵션</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="text-3xl font-bold text-blue-600">AIP</div>
                <div className="text-gray-600 mt-1">AI 플랫폼 포함</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">주차별 커리큘럼</h2>
            <div className="space-y-4">
              {foundryCurriculum.map((weekData) => (
                <div key={weekData.week} className={`bg-white rounded-xl overflow-hidden border-2 ${weekData.borderColor}`}>
                  <button onClick={() => toggleWeek(weekData.week)} className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl ${weekData.color} flex items-center justify-center text-white font-bold`}>W{weekData.week}</div>
                      <div className="text-left">
                        <span className="text-lg font-bold text-gray-900">{weekData.title}</span>
                        <span className="block text-gray-500 text-sm">Week {weekData.week}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-green-600">{weekData.output}</span>
                      <span className={`text-2xl transition-transform ${expandedWeeks.has(weekData.week) ? 'rotate-180' : ''}`}>▾</span>
                    </div>
                  </button>
                  {expandedWeeks.has(weekData.week) && (
                    <div className={`px-6 pb-6 ${weekData.lightBg}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {weekData.days.map((day) => (
                          <div key={day.day} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Day {day.day}</span>
                            <h5 className="font-semibold text-gray-900 mt-2 mb-2">{day.title}</h5>
                            <ul className="text-sm text-gray-600 space-y-1 mb-3">
                              {day.topics.map((topic, i) => (
                                <li key={i} className="flex items-start gap-1"><span className="text-gray-400">•</span><span>{topic}</span></li>
                              ))}
                            </ul>
                            <div className="text-xs font-medium text-purple-600 pt-2 border-t border-gray-100">💻 {day.practice}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6">Palantir 공식 자격증</h2>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {foundryCertifications.map((cert) => (
                  <div key={cert.name} className={`rounded-xl p-5 ${cert.color} border-2`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold">{cert.name}</h3>
                      <span className="px-2 py-1 bg-white/50 rounded text-xs">{cert.details}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cert.topics.map((topic, i) => (
                        <span key={i} className="px-2 py-1 bg-white/70 rounded text-xs">{topic}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm">
            <span>FDE Academy 커리큘럼</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>DRAFT v0.2</span>
          </div>
        </div>
      </main>
    </div>
  )
}
