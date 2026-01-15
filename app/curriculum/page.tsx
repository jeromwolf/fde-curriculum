'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CurriculumPage() {
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([1]))

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

  const mainCurriculum = [
    {
      phase: 1,
      title: '데이터 엔지니어링 기초',
      duration: '2개월',
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      lightBg: 'bg-blue-50',
      months: [
        {
          month: 1,
          title: 'Python & SQL 심화',
          weeks: [
            { week: 1, title: 'Python 심화 + Docker 기초', slug: 'python-advanced', topics: ['제너레이터 & 이터레이터', '데코레이터 패턴', 'Type Hints & mypy', 'Docker 기초 (Dockerfile, Compose)'], practice: '로깅 시스템 + Python 앱 컨테이너화' },
            { week: 2, title: 'pandas & 데이터 처리', slug: 'pandas-data', topics: ['대용량 데이터 처리 (chunk)', '고급 pandas (MultiIndex, pivot)', '성능 최적화 (vectorize)', 'Polars 소개'], practice: '1GB+ CSV 처리 파이프라인' },
            { week: 3, title: 'SQL 심화', slug: 'sql-advanced', topics: ['윈도우 함수 (ROW_NUMBER, LAG/LEAD)', 'CTE & 재귀 쿼리', '실행 계획 분석 & 튜닝', '트랜잭션 & 락'], practice: '복잡한 분석 쿼리 20개' },
            { week: 4, title: '데이터 모델링', slug: 'data-modeling', topics: ['정규화 (1NF~3NF)', 'Star Schema vs Snowflake', 'SCD (Type 1/2/3)', '실무 설계 패턴'], practice: '이커머스 데이터 웨어하우스 설계' }
          ],
          output: 'SQL 쿼리 포트폴리오, ERD 설계'
        },
        {
          month: 2,
          title: 'Spark & 파이프라인',
          weeks: [
            { week: 1, title: 'Apache Spark', slug: 'spark', topics: ['Spark 아키텍처 (Driver, Executor)', 'DataFrame API 마스터', 'Catalyst & Tungsten 최적화', 'PySpark UDF'], practice: '대용량 로그 분석 파이프라인' },
            { week: 2, title: 'Spark 심화 & Delta Lake', slug: 'spark-advanced', topics: ['Structured Streaming', 'Delta Lake (ACID, Time Travel)', '성능 튜닝 (파티션, 캐싱)', 'Spark UI 모니터링'], practice: '실시간 처리 + Delta Lake 저장' },
            { week: 3, title: 'Airflow & dbt', slug: 'airflow', topics: ['Apache Airflow (DAG, Operator)', 'dbt 기초 (models, tests, docs)', 'Airflow + dbt 통합', '모니터링 & 알림'], practice: 'ETL + dbt transformation 레이어' },
            { week: 4, title: 'E2E 파이프라인 프로젝트', slug: 'e2e-pipeline', topics: ['아키텍처 설계', '데이터 품질 (Great Expectations)', '모니터링 & 로깅', '문서화'], practice: '포트폴리오 #1: E2E 데이터 파이프라인' }
          ],
          output: '포트폴리오 #1: E2E 데이터 파이프라인'
        }
      ]
    },
    {
      phase: 2,
      title: '데이터 분석 & 컨설팅',
      duration: '2개월',
      color: 'bg-teal-500',
      borderColor: 'border-teal-500',
      lightBg: 'bg-teal-50',
      isUpdated: true,
      months: [
        {
          month: 3,
          title: '문제 정의 & EDA',
          weeks: [
            { week: 1, title: '비즈니스 문제 정의 & EDA 기초', slug: 'problem-definition', topics: ['문제 vs 증상 구분', '5 Whys & MECE 분석', '통계 기초 (분포, 상관관계)', '시각화 (matplotlib, seaborn)'], practice: '문제 정의서 + EDA 리포트' },
            { week: 2, title: '데이터 이해 & 전처리', slug: 'data-preprocessing', topics: ['데이터 소스 매핑', '데이터 품질 6차원 평가', '결측치/이상치 처리', '인코딩 & 변환'], practice: '데이터 품질 평가 + 정제 파이프라인' },
            { week: 3, title: 'Feature Engineering', slug: 'feature-engineering', topics: ['수치형 피처 (binning, polynomial)', '범주형 피처 (희귀 카테고리 처리)', '시간 피처 (요일, 계절, lag)', '텍스트 피처 (TF-IDF, 길이)'], practice: 'Kaggle 피처 엔지니어링' },
            { week: 4, title: 'Feature Selection & 차원 축소', slug: 'feature-selection', topics: ['Filter 방법 (상관관계, 분산)', 'Wrapper 방법 (RFE, Forward/Backward)', 'Embedded 방법 (Lasso, Tree importance)', '차원 축소 (PCA, t-SNE, UMAP)'], practice: '고차원 데이터 시각화' }
          ],
          output: 'Feature Engineering 노트북'
        },
        {
          month: 4,
          title: 'ML 모델링 & 커뮤니케이션',
          weeks: [
            { week: 1, title: '가설 기반 분석 & 분류/회귀', slug: 'supervised-learning', topics: ['가설 기반 분석 접근', '상관관계 vs 인과관계', '앙상블 (XGBoost, LightGBM)', '평가 지표 (F1, AUC, RMSE)'], practice: '가설 검증 + 이탈 예측 모델' },
            { week: 2, title: '클러스터링 & 세그멘테이션', slug: 'clustering', topics: ['K-means (Elbow, Silhouette)', '계층적 클러스터링 (Dendrogram)', 'RFM 분석', 'Pyramid Principle 보고서'], practice: '세그멘테이션 + 전략 제안' },
            { week: 3, title: '이상 탐지 (Anomaly Detection)', slug: 'anomaly-detection', topics: ['통계적 방법 (Z-score, IQR)', 'Isolation Forest, Autoencoder', '임계값 설정', '비즈니스 언어 번역'], practice: '금융 사기 탐지 시스템' },
            { week: 4, title: '시계열 분석 & 발표', slug: 'time-series', topics: ['Prophet, ML 접근', '수요 예측 모델', '경영진 발표 기법', '데이터 스토리텔링'], practice: '포트폴리오 #2: 수요 예측 + 발표' }
          ],
          output: '포트폴리오 #2: 분석 프로젝트 + 경영진 보고서'
        }
      ]
    },
    {
      phase: 3,
      title: '지식 그래프 & GraphRAG',
      duration: '2개월',
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
      lightBg: 'bg-purple-50',
      isUpdated: true,
      months: [
        {
          month: 5,
          title: 'Neo4j & Cypher 마스터',
          weeks: [
            { week: 1, title: '그래프 이론 & Neo4j 입문', slug: 'graph-intro', topics: ['Ontology vs KG vs Graph DB', 'Property Graph 모델 (Node, Relationship)', 'Neo4j 설치 & Aura / Memgraph', 'Cypher 기초 (CRUD, 패턴 매칭)'], practice: 'Neo4j 환경 구축 + 소셜 네트워크 그래프' },
            { week: 2, title: 'Cypher 심화 & 데이터 모델링', slug: 'cypher-modeling', topics: ['Cypher 심화 (WITH, APOC, 서브쿼리)', '그래프 데이터 모델링 원칙', '관계형 → 그래프 마이그레이션', '성능 최적화 (인덱스, PROFILE)'], practice: '이커머스 Knowledge Graph 구축' },
            { week: 3, title: '그래프 알고리즘', slug: 'graph-algorithms', topics: ['중심성 (PageRank, Betweenness, Degree)', '커뮤니티 탐지 (Louvain, Label Propagation)', '유사도 & 링크 예측 (Jaccard, KNN)', '경로 탐색 (Dijkstra, All Paths)'], practice: '소셜 네트워크 분석 (인플루언서 찾기)' },
            { week: 4, title: 'Entity Resolution & Python', slug: 'entity-resolution', topics: ['Entity Resolution (중복 탐지, 병합)', 'Neo4j Python Driver & py2neo', 'NetworkX & PyVis 시각화', '다중 소스 KG 구축'], practice: '기업 Knowledge Graph + 시각화' }
          ],
          output: 'Cypher 치트시트, 도메인 KG'
        },
        {
          month: 6,
          title: 'GraphRAG & 프로젝트',
          weeks: [
            { week: 1, title: 'RAG 기초', slug: 'rag-basics', topics: ['RAG 아키텍처 개요', '임베딩 & 벡터 DB (Chroma, Pinecone)', '청킹 전략 & 검색 최적화', 'LangChain RAG 파이프라인'], practice: '문서 Q&A RAG 시스템' },
            { week: 2, title: 'GraphRAG', slug: 'graph-rag', topics: ['GraphRAG 개념 (왜 KG + RAG인가)', 'LangChain + Neo4j 구현', '하이브리드 검색 (벡터 + 그래프)', '멀티홉 추론 & 컨텍스트 확장'], practice: 'GraphRAG Q&A 챗봇 시스템' },
            { week: 3, title: '자연어 → Cypher', slug: 'text2cypher', topics: ['LLM 기반 Cypher 생성', '스키마 프롬프팅 기법', '쿼리 검증 & 에러 처리', '자연어 인터페이스 설계'], practice: 'Text2Cypher 인터페이스 구축' },
            { week: 4, title: '도메인 KG 프로젝트', slug: 'kg-project', topics: ['프로젝트 설계 (300+ 노드, 2+ 소스)', 'E2E 파이프라인 (수집→ER→KG→RAG)', 'Streamlit 앱 배포', '발표 & 문서화'], practice: '포트폴리오 #3: 도메인 KG + GraphRAG' }
          ],
          output: '포트폴리오 #3: 도메인 Knowledge Graph + GraphRAG 시스템'
        }
      ]
    },
    {
      phase: 4,
      title: '클라우드 & 인프라',
      duration: '2개월',
      color: 'bg-orange-500',
      borderColor: 'border-orange-500',
      lightBg: 'bg-orange-50',
      months: [
        {
          month: 7,
          title: 'AWS & IaC',
          weeks: [
            { week: 1, title: 'AWS 기초', slug: 'aws-fundamentals', topics: ['IAM (사용자, 그룹, 역할, 정책)', 'EC2 & VPC (서브넷, 보안 그룹)', 'S3 (스토리지 클래스, 수명 주기)', 'Lambda & 서버리스'], practice: '3-Tier 아키텍처 구축' },
            { week: 2, title: 'Terraform 인프라 자동화', slug: 'terraform', topics: ['IaC 개념 & HCL 문법', '모듈 & 워크스페이스', '원격 상태 관리 (S3+DynamoDB)', 'GitOps 워크플로우'], practice: 'AWS 인프라 IaC 구축' },
            { week: 3, title: 'Docker & Kubernetes', slug: 'docker-k8s', topics: ['Dockerfile & Multi-stage 빌드', 'K8s 아키텍처 (Pod, Deployment)', 'EKS & Helm 차트', 'HPA & 리소스 관리'], practice: 'K8s 클러스터 구축' },
            { week: 4, title: 'CI/CD 파이프라인', slug: 'cicd', topics: ['GitHub Actions (테스트, 빌드)', 'Docker 이미지 빌드 자동화', 'ArgoCD & GitOps', '배포 전략 (Blue-Green, Canary)'], practice: 'E2E CI/CD 파이프라인' }
          ],
          output: 'AWS SAA 자격증'
        },
        {
          month: 8,
          title: 'ML 인프라 & AI 서빙',
          weeks: [
            { week: 1, title: 'SageMaker ML 인프라', slug: 'sagemaker', topics: ['SageMaker Studio & Notebooks', 'Training Jobs & HPO', 'Endpoints & 배포', 'Pipelines & MLOps'], practice: 'E2E ML 파이프라인' },
            { week: 2, title: 'Vector DB 운영', slug: 'vector-db', topics: ['Pinecone & pgvector', 'ANN 알고리즘 (HNSW, IVF)', 'RAG 시스템 통합', '스케일링 & 성능 최적화'], practice: 'Production RAG 시스템' },
            { week: 3, title: 'LLM 서빙', slug: 'llm-serving', topics: ['vLLM & TGI', 'AWS Bedrock', 'API Gateway & LiteLLM', 'Langfuse 모니터링'], practice: 'Production LLM 서빙' },
            { week: 4, title: '인프라 프로젝트', slug: 'infra-project', topics: ['Terraform IaC 구축', 'EKS 마이크로서비스 배포', 'CI/CD 파이프라인', 'RAG + LLM 서빙 통합'], practice: '포트폴리오 #4: AI 인프라 플랫폼' }
          ],
          output: '포트폴리오 #4: 클라우드 AI 인프라'
        }
      ]
    },
    {
      phase: 5,
      title: 'GenAI & 에이전트',
      duration: '2개월',
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      lightBg: 'bg-green-50',
      months: [
        {
          month: 9,
          title: 'LLM & RAG',
          weeks: [
            { week: 1, title: 'LLM 기초', topics: ['Transformer 개념 (Attention, 토큰화)', '주요 모델 (GPT, Claude, Gemini, Llama)', 'API 사용 (OpenAI, Anthropic SDK)', '비용 관리 (토큰 계산, 최적화)'], practice: '다양한 LLM API 실험' },
            { week: 2, title: '프롬프트 엔지니어링', topics: ['기본 기법 (Zero-shot, Few-shot, CoT)', '고급 기법 (Self-consistency, ToT)', '시스템 프롬프트 & 가드레일', '평가 (일관성, 정확도, 안전성)'], practice: '프롬프트 라이브러리 구축' },
            { week: 3, title: '임베딩 & 벡터 DB', topics: ['텍스트 임베딩 (OpenAI, Cohere, 오픈소스)', '벡터 DB (Pinecone, Weaviate, Chroma)', '유사도 검색 & 하이브리드', '인덱싱 (HNSW, IVF, 성능 튜닝)'], practice: '시맨틱 검색 엔진' },
            { week: 4, title: 'RAG 시스템', topics: ['RAG 아키텍처 (Index → Retrieve → Generate)', '청킹 전략 (Fixed, Semantic, Parent-Child)', '검색 최적화 (Re-ranking, Query Expansion)', '평가 (Retrieval 정확도, 답변 품질)'], practice: '문서 Q&A RAG 시스템' }
          ],
          output: 'RAG 시스템, 프롬프트 라이브러리'
        },
        {
          month: 10,
          title: 'AI 에이전트 & 프로덕션',
          weeks: [
            { week: 1, title: 'AI 에이전트 기초', topics: ['에이전트 개념 (자율성, 도구 사용)', 'Function Calling (OpenAI, Claude)', 'ReAct 패턴 (Reasoning + Acting)', 'LangGraph (상태 기반 워크플로우)'], practice: '도구 사용 에이전트 구축' },
            { week: 2, title: '고급 에이전트 & MCP', topics: ['멀티 에이전트 (협업, 위임)', 'MCP (Model Context Protocol)', 'MCP 서버 구축 & 클라이언트 연동', '에이전트 평가'], practice: 'MCP 기반 도구 통합 시스템' },
            { week: 3, title: '프로덕션 배포', topics: ['FastAPI 서버 & 스트리밍', '캐싱 (Semantic 캐시, Redis)', '모니터링 (LangSmith, 비용 추적)', '보안 (Rate limiting, Input validation)'], practice: 'RAG API 서버 배포' },
            { week: 4, title: 'GenAI 프로젝트', topics: ['프로젝트 설계 & 아키텍처', 'RAG + Agent 통합', '평가 & 개선 (A/B 테스트)', '발표 & 문서화'], practice: '포트폴리오 #5: AI 애플리케이션' }
          ],
          output: '포트폴리오 #5: AI 애플리케이션'
        }
      ]
    },
    {
      phase: 6,
      title: '산업별 프로젝트 & 취업',
      duration: '2개월',
      color: 'bg-red-500',
      borderColor: 'border-red-500',
      lightBg: 'bg-red-50',
      months: [
        {
          month: 11,
          title: '도메인 심화 & 캡스톤',
          weeks: [
            { week: 1, title: '도메인 선택 (택 1)', topics: ['금융: 포트폴리오 분석, 사기 탐지', '의료: 환자 데이터, FHIR', '제조: 수요 예측, 예지 정비', '사이버보안: 위협 탐지, ATT&CK'], practice: '도메인 리서치 & 데이터 수집' },
            { week: 2, title: '도메인 심화', topics: ['산업 표준 & 규제 이해', '도메인 특화 데이터셋', '실무 사례 분석', '전문가 인터뷰 (가능 시)'], practice: '도메인 분석 리포트' },
            { week: 3, title: '캡스톤 프로젝트 (1)', topics: ['문제 정의 & 요구사항', '데이터 수집 & 파이프라인', 'KG 또는 ML 모델 구축', 'API & 백엔드 개발'], practice: '캡스톤 진행 (백엔드)' },
            { week: 4, title: '캡스톤 프로젝트 (2)', topics: ['AI 기능 통합 (RAG/Agent)', 'UI/대시보드 개발', '테스트 & 최적화', '문서화 & 발표 준비'], practice: '최종 포트폴리오 프로젝트' }
          ],
          output: '최종 포트폴리오 프로젝트'
        },
        {
          month: 12,
          title: '취업 준비',
          weeks: [
            { week: 1, title: '포트폴리오 완성', topics: ['GitHub 정리 (README, 라이선스)', '기술 블로그 (프로젝트 회고)', 'LinkedIn 프로필 최적화', '5분 데모 영상 제작'], practice: '포트폴리오 사이트 배포' },
            { week: 2, title: '기술 면접 준비', topics: ['Data Engineering (SQL, Spark, 파이프라인)', 'ML/AI (알고리즘, 평가 지표)', '시스템 디자인 (확장성, 가용성)', '코딩 테스트 (LeetCode Medium)'], practice: '모의 기술 면접 3회' },
            { week: 3, title: '행동 면접 & 지원', topics: ['STAR 기법 (상황-과제-행동-결과)', '자기소개 (30초, 1분, 3분)', '회사 리서치 & 지원', '이력서 & 커버레터'], practice: '실제 지원 시작' },
            { week: 4, title: '최종 준비 & 수료', topics: ['모의 면접 & 피드백', '연봉 협상 전략', '네트워킹 (커뮤니티, 밋업)', '수료식 & 발표'], practice: '취업!' }
          ],
          output: '취업!'
        }
      ]
    }
  ]

  const certifications = [
    { name: 'AWS Solutions Architect Associate', month: 7, color: 'bg-orange-100 text-orange-700', details: '공식 시험 | $150' },
    { name: 'Neo4j Certified Professional', month: 6, color: 'bg-purple-100 text-purple-700', details: '무료 시험 | 온라인' }
  ]

  const prerequisites = [
    { skill: 'Python 기초 1', level: '필수', description: '변수, 자료형, 조건문, 반복문', slug: 'prereq-python-1' },
    { skill: 'Python 기초 2', level: '필수', description: '함수, 클래스, 모듈, 파일 I/O', slug: 'prereq-python-2' },
    { skill: 'SQL 기초 1', level: '필수', description: 'SELECT, WHERE, ORDER BY', slug: 'prereq-sql-1' },
    { skill: 'SQL 기초 2', level: '필수', description: 'JOIN, GROUP BY, 서브쿼리', slug: 'prereq-sql-2' },
    { skill: 'Git 기초', level: '필수', description: 'clone, commit, push, branch 사용 가능', slug: 'prereq-git' },
    { skill: '영어 문서 독해', level: '권장', description: '기술 문서 읽기 가능 수준', slug: 'prereq-english' },
    { skill: '통계 기초', level: '권장', description: '평균, 분산, 분포 개념 이해', slug: 'prereq-stats' }
  ]

  const weeklySchedule = {
    totalHours: 40,
    breakdown: [
      { activity: '이론 학습 (강의/문서)', hours: 8 },
      { activity: '실습 & 코딩', hours: 20 },
      { activity: '프로젝트 작업', hours: 8 },
      { activity: '복습 & 퀴즈', hours: 4 }
    ]
  }

  const evaluationCriteria = {
    criteria: [
      { type: '주간 퀴즈', weight: 10, description: '매주 금요일, 객관식+단답형 20문제' },
      { type: '코딩 과제', weight: 30, description: '주 1-2회, GitHub 제출, 코드 리뷰' },
      { type: '월간 프로젝트', weight: 40, description: '매월 1개, 실무 시나리오 기반' },
      { type: '최종 포트폴리오', weight: 20, description: '6개 프로젝트 통합, 발표 평가' }
    ],
    passingScore: 70
  }

  const portfolios = [
    { num: 1, title: 'E2E 데이터 파이프라인', phase: 1, stack: 'Python, Spark, Airflow, Delta Lake' },
    { num: 2, title: '데이터 분석 & 컨설팅', phase: 2, stack: 'pandas, XGBoost, 경영진 발표' },
    { num: 3, title: '도메인 KG + GraphRAG 시스템', phase: 3, stack: 'Neo4j, Cypher, Python, LangChain, GraphRAG, Streamlit' },
    { num: 4, title: '클라우드 인프라', phase: 4, stack: 'AWS, Terraform, K8s, ArgoCD' },
    { num: 5, title: 'AI 애플리케이션', phase: 5, stack: 'RAG, AI Agent, FastAPI' },
    { num: 6, title: '캡스톤 (도메인 특화)', phase: 6, stack: '전체 기술 통합' }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-blue-500 rounded-full text-sm font-bold">MAIN COURSE</span>
            <span className="px-3 py-1 bg-green-500 rounded-full text-sm font-bold">v3.6</span>
          </div>
          <h1 className="text-4xl font-bold">FDE Academy</h1>
          <p className="text-blue-100 mt-2 text-lg">
            Forward Deployed Engineer 양성 과정 | 12개월 풀타임
          </p>
        </div>
      </header>

      <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-6 py-4">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-blue-600">1</span>
              <div className="text-left">
                <div className="font-bold text-blue-600">메인 과정</div>
                <div className="text-xs text-gray-500">12개월 | FDE 기초~실전</div>
              </div>
            </div>
            <Link
              href="/specials"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 hover:from-purple-200 hover:to-indigo-200 transition-all"
            >
              <span className="text-xl">🎯</span>
              <div className="text-left">
                <div className="font-bold">스페셜 과정</div>
                <div className="text-xs opacity-70">Foundry, AWS, LLM 심화</div>
              </div>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
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
                <div className="text-3xl font-bold text-purple-600">6개</div>
                <div className="text-gray-600 mt-1">포트폴리오 프로젝트</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                <div className="text-3xl font-bold text-orange-600">7천만~2억+</div>
                <div className="text-gray-600 mt-1">목표 연봉</div>
              </div>
            </div>

            {/* v3.6 변경 사항 하이라이트 */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 mb-8 border-2 border-green-200">
              <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <span className="px-2 py-1 bg-green-500 text-white rounded text-sm">v3.6</span>
                주요 변경 사항
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="text-blue-700 font-bold mb-1">Core 6개월</div>
                  <div className="text-sm text-gray-600">필수 과정 집중 학습</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="text-purple-600 font-bold mb-1">Phase 3 확장</div>
                  <div className="text-sm text-gray-600">6주 → 8주 (GraphRAG 심화)</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="text-teal-600 font-bold mb-1">AI-Native</div>
                  <div className="text-sm text-gray-600">Copilot/Claude Day 1부터 활용</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="text-orange-600 font-bold mb-1">Specialization</div>
                  <div className="text-sm text-gray-600">선택 과정으로 분리 (Foundry 등)</div>
                </div>
              </div>
            </div>

            {/* AI-Native 학습 안내 */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-violet-200">
              <h2 className="text-xl font-bold text-violet-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI-Native 학습 방식
              </h2>
              <p className="text-gray-700 mb-4">
                FDE Academy는 처음부터 AI 도구를 적극 활용합니다. 코드 작성, 디버깅, 문서화 모든 과정에서 AI와 협업하세요.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-violet-100">
                  <div className="font-bold text-violet-700 mb-2">GitHub Copilot</div>
                  <div className="text-sm text-gray-600">코드 자동완성, 리팩토링, 테스트 생성</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-violet-100">
                  <div className="font-bold text-violet-700 mb-2">Claude / ChatGPT</div>
                  <div className="text-sm text-gray-600">개념 설명, 디버깅, 아키텍처 설계</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-violet-100">
                  <div className="font-bold text-violet-700 mb-2">Cursor / Windsurf</div>
                  <div className="text-sm text-gray-600">AI 통합 IDE로 생산성 극대화</div>
                </div>
              </div>
            </div>

            {/* 선수 과목 섹션 */}
            <div className="bg-yellow-50 rounded-xl p-6 mb-8 border border-yellow-200">
              <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                <span>📋</span> 선수 과목 (Prerequisites)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {prerequisites.map((req) => {
                  const CardContent = (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${req.level === '필수' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                          {req.level}
                        </span>
                        <span className="font-semibold text-gray-900">{req.skill}</span>
                        {req.slug && <span className="text-xs text-[#03EF62] font-medium">학습하기 →</span>}
                      </div>
                      <p className="text-sm text-gray-600">{req.description}</p>
                    </>
                  )

                  return req.slug ? (
                    <Link
                      key={req.skill}
                      href={`/learn/week/${req.slug}`}
                      className="bg-white rounded-lg p-4 border border-yellow-100 hover:border-[#03EF62] hover:shadow-md transition-all cursor-pointer"
                    >
                      {CardContent}
                    </Link>
                  ) : (
                    <div key={req.skill} className="bg-white rounded-lg p-4 border border-yellow-100">
                      {CardContent}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 주간 학습 시간 섹션 */}
            <div className="bg-indigo-50 rounded-xl p-6 mb-8 border border-indigo-200">
              <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                <span>⏰</span> 주간 학습 시간
              </h2>
              <div className="flex items-center gap-6 mb-4">
                <div className="text-4xl font-bold text-indigo-600">{weeklySchedule.totalHours}시간</div>
                <div className="text-gray-600">/ 주 (풀타임 기준)</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weeklySchedule.breakdown.map((item) => (
                  <div key={item.activity} className="bg-white rounded-lg p-3 border border-indigo-100">
                    <div className="text-2xl font-bold text-indigo-600">{item.hours}h</div>
                    <div className="text-sm text-gray-600">{item.activity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 평가 기준 섹션 */}
            <div className="bg-emerald-50 rounded-xl p-6 mb-8 border border-emerald-200">
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span>📊</span> 평가 기준
              </h2>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-gray-600">수료 기준:</span>
                <span className="px-3 py-1 bg-emerald-600 text-white rounded-full font-bold">{evaluationCriteria.passingScore}% 이상</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {evaluationCriteria.criteria.map((criteria) => (
                  <div key={criteria.type} className="bg-white rounded-lg p-4 border border-emerald-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{criteria.type}</span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm font-bold">{criteria.weight}%</span>
                    </div>
                    <p className="text-sm text-gray-600">{criteria.description}</p>
                  </div>
                ))}
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
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">Phase {phase.phase}: {phase.title}</span>
                          {(phase as any).isNew && <span className="px-2 py-0.5 bg-teal-500 text-white text-xs rounded-full font-bold">NEW</span>}
                          {(phase as any).isFundamental && <span className="px-2 py-0.5 bg-slate-600 text-white text-xs rounded-full font-bold">핵심</span>}
                          {(phase as any).isUpdated && <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full font-bold">실무화</span>}
                        </div>
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
                            {month.weeks.map((week) => {
                              const weekSlug = (week as { slug?: string }).slug
                              const globalWeek = (month.month - 1) * 4 + week.week
                              const hasDetail = weekSlug !== undefined || globalWeek === 1
                              const linkHref = weekSlug ? `/learn/week/${weekSlug}` : '/learn/week/python-advanced'
                              return (
                              <div key={week.week} className={`bg-white rounded-lg p-4 border shadow-sm transition-all ${hasDetail ? 'border-[#03EF62] hover:shadow-md' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Week {week.week}</span>
                                  {hasDetail && <span className="text-xs font-medium text-[#03EF62]">상세 보기 →</span>}
                                </div>
                                <h5 className="font-semibold text-gray-900 mt-2 mb-2">{week.title}</h5>
                                <ul className="text-sm text-gray-600 space-y-1 mb-3">
                                  {week.topics.map((topic, i) => (
                                    <li key={i} className="flex items-start gap-1"><span className="text-gray-400">•</span><span>{topic}</span></li>
                                  ))}
                                </ul>
                                <div className="text-xs font-medium text-blue-600 pt-2 border-t border-gray-100">💻 {week.practice}</div>
                                {hasDetail && (
                                  <Link
                                    href={linkHref}
                                    className="mt-3 block w-full text-center px-4 py-2 bg-[#03EF62] text-gray-900 rounded-lg text-sm font-medium hover:bg-[#00D956] transition"
                                  >
                                    학습 시작
                                  </Link>
                                )}
                              </div>
                            )})}
                          </div>
                          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <span className="font-medium text-green-700">📦 산출물: {month.output}</span>
                          </div>
                        </div>
                      ))}
                      <div className="mt-6 text-center">
                        <Link
                          href={`/phase/${phase.phase}`}
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${phase.color} text-white font-medium hover:opacity-90 transition-opacity`}
                        >
                          <span>Phase {phase.phase} 학습 시작하기</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 포트폴리오 요약 */}
            <h2 className="text-2xl font-bold mt-12 mb-6">포트폴리오 로드맵</h2>
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolios.map((p) => (
                  <div key={p.num} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">#{p.num}</span>
                      <span className="font-bold text-gray-900">{p.title}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">Phase {p.phase}</div>
                    <div className="text-sm text-gray-600 bg-gray-50 rounded px-2 py-1">{p.stack}</div>
                  </div>
                ))}
              </div>
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

            {/* 비용 추정 가이드 */}
            <h2 className="text-2xl font-bold mt-12 mb-6">예상 비용 가이드</h2>
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💰</span>
                  <span className="text-lg font-bold text-amber-800">12개월 총 예상 비용</span>
                </div>
                <div className="text-3xl font-bold text-amber-700">$1,100 ~ $3,700</div>
                <div className="text-sm text-gray-600 mt-1">Free Tier 최대 활용 시 (약 150~500만원)</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">AWS</span>
                    <span className="text-amber-600 font-bold">$50-150/월</span>
                  </div>
                  <div className="text-sm text-gray-600">Phase 4 집중 사용</div>
                  <div className="text-xs text-gray-500 mt-1">Free Tier 12개월 활용 권장</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">OpenAI API</span>
                    <span className="text-amber-600 font-bold">$20-50/월</span>
                  </div>
                  <div className="text-sm text-gray-600">Phase 5 집중 사용</div>
                  <div className="text-xs text-gray-500 mt-1">GPT-4o-mini로 비용 절감</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Anthropic API</span>
                    <span className="text-amber-600 font-bold">$20-40/월</span>
                  </div>
                  <div className="text-sm text-gray-600">Phase 5 집중 사용</div>
                  <div className="text-xs text-gray-500 mt-1">Claude Haiku로 프로토타이핑</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Neo4j Aura</span>
                    <span className="text-green-600 font-bold">$0</span>
                  </div>
                  <div className="text-sm text-gray-600">Phase 3 사용</div>
                  <div className="text-xs text-gray-500 mt-1">Free Tier (50K 노드)</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Pinecone</span>
                    <span className="text-green-600 font-bold">$0-20/월</span>
                  </div>
                  <div className="text-sm text-gray-600">Phase 5 RAG 실습</div>
                  <div className="text-xs text-gray-500 mt-1">Free Tier 존재</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Databricks</span>
                    <span className="text-green-600 font-bold">$0</span>
                  </div>
                  <div className="text-sm text-gray-600">Phase 1 Spark 실습</div>
                  <div className="text-xs text-gray-500 mt-1">Community Edition 무료</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <div className="font-semibold text-amber-800 mb-3">💡 비용 절약 팁</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-600">AWS Free Tier 한도 모니터링 (Budgets 설정)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-600">학습 후 리소스 즉시 삭제 (terraform destroy)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-600">Spot Instances 활용 (최대 90% 할인)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-600">LLM API 캐싱 적용 (동일 질문 반복 방지)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-600">로컬 개발 최대한 활용 후 클라우드 배포</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-600">GitHub Student Pack 활용 (학생인 경우)</span>
                  </div>
                </div>
              </div>
            </div>
          </>

        {/* 스페셜 과정 CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-bold mb-4">
              <span>🎯</span> SPECIAL COURSES
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              전문 분야로 더 깊이 들어가세요
            </h2>
            <p className="text-white/90 mb-6">
              메인 과정 수료 후 또는 병행하여 수강할 수 있는 스페셜 과정이 준비되어 있습니다.
              Palantir Foundry 자격증, AWS 자격증, LLM 심화, 도메인 특화 과정까지!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/specials/foundry"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                <span>🔷</span>
                Foundry 스페셜 (8주)
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/specials"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/50 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                전체 스페셜 과정 보기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm">
            <span>FDE Academy 커리큘럼</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className="text-green-600 font-bold">v3.6</span>
          </div>
          <div className="mt-3 text-xs text-gray-400">
            마지막 업데이트: 2026-01-13 | 스페셜 과정 분리, Foundry 8주 상세 커리큘럼 추가
          </div>
        </div>
      </main>
    </div>
  )
}
