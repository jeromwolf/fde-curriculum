// Week 2: Cypher 심화 & 데이터 모델링
// 모듈화된 버전 - 상세 콘텐츠는 week2-cypher-modeling/ 폴더에서 관리
//
// 구조:
// week2-cypher-modeling/
// ├── index.ts           - 통합 모듈 (이 파일에서 import)
// ├── types.ts           - 공유 타입 및 유틸리티
// ├── day1-cypher-advanced.ts   - Day 1: Cypher 고급 쿼리
// ├── day2-object-type.ts       - Day 2: Object Type 설계
// ├── day3-schema-patterns.ts   - Day 3: 스키마 패턴
// ├── day4-apoc.ts              - Day 4: APOC 라이브러리
// └── day5-weekly-project.ts    - Day 5: 주간 프로젝트
//
// 총 라인 수: ~3,700줄
// 총 Task 수: 52개
// 총 학습 시간: ~19시간

export { week2CypherModeling as cypherModelingWeek } from './week2-cypher-modeling'

// 개별 Day 모듈도 필요시 접근 가능
export {
  day1CypherAdvanced,
  day2ObjectType,
  day3SchemaPatterns,
  day4Apoc,
  day5WeeklyProject,
  WEEK2_META
} from './week2-cypher-modeling'
