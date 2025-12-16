// Week: Python 심화
import type { Week } from '../types'

export const pythonAdvancedWeek: Week = {
  slug: 'python-advanced',
  week: 1,
  phase: 1,
  month: 1,
  access: 'free',  // 첫 번째 Week은 무료 체험
  title: 'Python 심화',
  topics: ['제너레이터 & 이터레이터', '데코레이터 패턴', '컨텍스트 매니저', 'Type Hints & mypy'],
  practice: '데코레이터 기반 로깅 & 캐싱 시스템',
  totalDuration: 750,
  days: [
    {
      slug: 'iterators',
      title: '이터레이터 & 제너레이터',
      totalDuration: 150,
      tasks: [
        { id: 'iterator-protocol-video', type: 'video', title: '이터레이터 프로토콜 개념 (__iter__, __next__)', duration: 15 },
        { id: 'iterator-docs-reading', type: 'reading', title: 'Python 공식 문서: Iterator Types', duration: 10 },
        { id: 'custom-iterator-code', type: 'code', title: '커스텀 이터레이터 클래스 작성 (Range 구현)', duration: 15 },
        { id: 'iterator-quiz', type: 'quiz', title: '이터레이터 개념 퀴즈', duration: 5 },
        { id: 'generator-yield-video', type: 'video', title: 'yield 키워드와 제너레이터 동작 원리', duration: 15 },
        { id: 'generator-basic-code', type: 'code', title: '기본 제너레이터 작성 (피보나치, 소수 생성)', duration: 15 },
        { id: 'memory-comparison-code', type: 'code', title: '메모리 효율 비교 (리스트 vs 제너레이터)', duration: 10 },
        { id: 'generator-quiz', type: 'quiz', title: '제너레이터 퀴즈', duration: 5 },
        { id: 'generator-expression-video', type: 'video', title: '제너레이터 표현식, yield from', duration: 10 },
        { id: 'large-file-code', type: 'code', title: '대용량 파일 처리 (line by line)', duration: 15 },
        { id: 'advanced-generator-quiz', type: 'quiz', title: '고급 제너레이터 퀴즈', duration: 5 }
      ],
      challenge: {
        id: 'infinite-stream-challenge',
        type: 'challenge',
        title: '무한 데이터 스트림 제너레이터',
        duration: 30,
        description: 'infinite_counter, chunked_reader, pipeline 함수 구현'
      }
    },
    {
      slug: 'decorators',
      title: '데코레이터 패턴',
      totalDuration: 150,
      tasks: [
        { id: 'decorator-intro-video', type: 'video', title: '데코레이터란? (First-class function, Closure)', duration: 15 },
        { id: 'pep318-reading', type: 'reading', title: 'PEP 318: Decorators for Functions and Methods', duration: 10 },
        { id: 'timing-decorator-code', type: 'code', title: '간단한 데코레이터 작성 (실행 시간 측정)', duration: 15 },
        { id: 'decorator-basic-quiz', type: 'quiz', title: '데코레이터 기초 퀴즈', duration: 5 },
        { id: 'decorator-args-video', type: 'video', title: '인자를 받는 데코레이터', duration: 15 },
        { id: 'retry-decorator-code', type: 'code', title: '재시도 데코레이터 구현 (@retry(max_attempts=3))', duration: 15 },
        { id: 'class-decorator-code', type: 'code', title: '클래스 기반 데코레이터', duration: 10 },
        { id: 'decorator-advanced-quiz', type: 'quiz', title: '데코레이터 심화 퀴즈', duration: 5 },
        { id: 'practical-patterns-video', type: 'video', title: '실무 패턴 (캐싱, 인증, 로깅)', duration: 10 },
        { id: 'lru-cache-code', type: 'code', title: '@lru_cache 분석 및 커스텀 캐시 구현', duration: 15 },
        { id: 'practical-patterns-quiz', type: 'quiz', title: '실무 패턴 퀴즈', duration: 5 }
      ],
      challenge: {
        id: 'logging-decorator-challenge',
        type: 'challenge',
        title: '범용 로깅 데코레이터',
        duration: 30,
        description: '@log(level, include_args, include_result) 데코레이터 구현'
      }
    },
    {
      slug: 'context-managers',
      title: '컨텍스트 매니저',
      totalDuration: 120,
      tasks: [
        { id: 'context-intro-video', type: 'video', title: 'with 문과 컨텍스트 매니저 프로토콜', duration: 15 },
        { id: 'pep343-reading', type: 'reading', title: 'PEP 343: The "with" Statement', duration: 10 },
        { id: 'file-handler-code', type: 'code', title: '__enter__, __exit__ 구현 (파일 핸들러)', duration: 15 },
        { id: 'context-basic-quiz', type: 'quiz', title: '컨텍스트 매니저 퀴즈', duration: 5 },
        { id: 'contextlib-video', type: 'video', title: '@contextmanager 데코레이터', duration: 15 },
        { id: 'generator-context-code', type: 'code', title: '제너레이터 기반 컨텍스트 매니저 작성', duration: 15 },
        { id: 'exitstack-code', type: 'code', title: 'contextlib.ExitStack 활용', duration: 10 },
        { id: 'contextlib-quiz', type: 'quiz', title: 'contextlib 퀴즈', duration: 5 }
      ],
      challenge: {
        id: 'transaction-manager-challenge',
        type: 'challenge',
        title: '데이터베이스 트랜잭션 매니저',
        duration: 30,
        description: '자동 커밋/롤백, 중첩 트랜잭션(savepoint) 지원'
      }
    },
    {
      slug: 'type-hints',
      title: 'Type Hints & mypy',
      totalDuration: 150,
      tasks: [
        { id: 'typehints-intro-video', type: 'video', title: 'Type Hints 소개 (PEP 484)', duration: 15 },
        { id: 'typing-module-reading', type: 'reading', title: 'Python typing 모듈 문서', duration: 10 },
        { id: 'basic-typehints-code', type: 'code', title: '기본 타입 힌트 적용 (int, str, List, Dict)', duration: 15 },
        { id: 'typehints-basic-quiz', type: 'quiz', title: 'Type Hints 기초 퀴즈', duration: 5 },
        { id: 'generics-video', type: 'video', title: 'Generic, TypeVar, Protocol', duration: 15 },
        { id: 'generic-class-code', type: 'code', title: '제네릭 함수 및 클래스 작성', duration: 15 },
        { id: 'union-optional-code', type: 'code', title: 'Union, Optional, Literal 활용', duration: 10 },
        { id: 'advanced-typehints-quiz', type: 'quiz', title: '고급 타입 힌트 퀴즈', duration: 5 },
        { id: 'mypy-setup-video', type: 'video', title: 'mypy 설치 및 설정 (mypy.ini)', duration: 10 },
        { id: 'mypy-apply-code', type: 'code', title: '기존 코드에 mypy 적용 및 오류 수정', duration: 15 },
        { id: 'mypy-quiz', type: 'quiz', title: 'mypy 퀴즈', duration: 5 }
      ],
      challenge: {
        id: 'full-typehints-challenge',
        type: 'challenge',
        title: '완전 타입 힌트 적용',
        duration: 30,
        description: 'Day 1-3 코드에 Type Hints 적용, mypy --strict 통과'
      }
    },
    {
      slug: 'weekly-project',
      title: 'Weekly Project',
      totalDuration: 180,
      tasks: [
        { id: 'project-requirements-reading', type: 'reading', title: '프로젝트 요구사항 분석', duration: 15 },
        { id: 'logging-system-code', type: 'code', title: '로깅 시스템 구현', duration: 45 },
        { id: 'caching-system-code', type: 'code', title: '캐싱 시스템 구현 (TTL 지원)', duration: 45 },
        { id: 'integration-code', type: 'code', title: '통합 및 테스트', duration: 30 },
        { id: 'typehints-apply-code', type: 'code', title: 'Type Hints 적용 & mypy 통과', duration: 30 },
        { id: 'code-review-reading', type: 'reading', title: '코드 리뷰 체크리스트', duration: 15 }
      ]
    }
  ]
}
