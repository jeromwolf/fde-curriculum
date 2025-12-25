/**
 * 샘플 Property Graph 데이터
 * 소셜 네트워크 + 회사 도메인
 */

import type { Node, Relationship, PropertyGraph, ExampleQuery } from '../types'

// ============================================
// 샘플 노드
// ============================================

export const sampleNodes: Node[] = [
  // Persons
  {
    id: 'p1',
    labels: ['Person'],
    properties: { name: 'Alice', age: 30, city: 'Seoul' }
  },
  {
    id: 'p2',
    labels: ['Person'],
    properties: { name: 'Bob', age: 28, city: 'Busan' }
  },
  {
    id: 'p3',
    labels: ['Person'],
    properties: { name: 'Charlie', age: 35, city: 'Seoul' }
  },
  {
    id: 'p4',
    labels: ['Person'],
    properties: { name: 'Diana', age: 32, city: 'Incheon' }
  },
  {
    id: 'p5',
    labels: ['Person'],
    properties: { name: 'Eve', age: 27, city: 'Seoul' }
  },

  // Companies
  {
    id: 'c1',
    labels: ['Company'],
    properties: { name: 'TechCorp', industry: 'IT', employees: 500 }
  },
  {
    id: 'c2',
    labels: ['Company'],
    properties: { name: 'DataInc', industry: 'AI', employees: 200 }
  },
  {
    id: 'c3',
    labels: ['Company'],
    properties: { name: 'WebStudio', industry: 'Design', employees: 50 }
  },

  // Cities
  {
    id: 'city1',
    labels: ['City'],
    properties: { name: 'Seoul', country: 'Korea', population: 10000000 }
  },
  {
    id: 'city2',
    labels: ['City'],
    properties: { name: 'Busan', country: 'Korea', population: 3500000 }
  },
  {
    id: 'city3',
    labels: ['City'],
    properties: { name: 'Incheon', country: 'Korea', population: 3000000 }
  },
]

// ============================================
// 샘플 관계
// ============================================

export const sampleRelationships: Relationship[] = [
  // KNOWS relationships
  { id: 'r1', type: 'KNOWS', startNodeId: 'p1', endNodeId: 'p2', properties: { since: 2020 } },
  { id: 'r2', type: 'KNOWS', startNodeId: 'p1', endNodeId: 'p3', properties: { since: 2019 } },
  { id: 'r3', type: 'KNOWS', startNodeId: 'p2', endNodeId: 'p4', properties: { since: 2021 } },
  { id: 'r4', type: 'KNOWS', startNodeId: 'p3', endNodeId: 'p5', properties: { since: 2022 } },
  { id: 'r5', type: 'KNOWS', startNodeId: 'p4', endNodeId: 'p5', properties: { since: 2020 } },

  // WORKS_AT relationships
  { id: 'r6', type: 'WORKS_AT', startNodeId: 'p1', endNodeId: 'c1', properties: { role: 'Engineer', since: 2018 } },
  { id: 'r7', type: 'WORKS_AT', startNodeId: 'p2', endNodeId: 'c1', properties: { role: 'Manager', since: 2017 } },
  { id: 'r8', type: 'WORKS_AT', startNodeId: 'p3', endNodeId: 'c2', properties: { role: 'Data Scientist', since: 2019 } },
  { id: 'r9', type: 'WORKS_AT', startNodeId: 'p4', endNodeId: 'c2', properties: { role: 'ML Engineer', since: 2020 } },
  { id: 'r10', type: 'WORKS_AT', startNodeId: 'p5', endNodeId: 'c3', properties: { role: 'Designer', since: 2021 } },

  // LIVES_IN relationships
  { id: 'r11', type: 'LIVES_IN', startNodeId: 'p1', endNodeId: 'city1', properties: {} },
  { id: 'r12', type: 'LIVES_IN', startNodeId: 'p2', endNodeId: 'city2', properties: {} },
  { id: 'r13', type: 'LIVES_IN', startNodeId: 'p3', endNodeId: 'city1', properties: {} },
  { id: 'r14', type: 'LIVES_IN', startNodeId: 'p4', endNodeId: 'city3', properties: {} },
  { id: 'r15', type: 'LIVES_IN', startNodeId: 'p5', endNodeId: 'city1', properties: {} },

  // LOCATED_IN relationships (Company -> City)
  { id: 'r16', type: 'LOCATED_IN', startNodeId: 'c1', endNodeId: 'city1', properties: {} },
  { id: 'r17', type: 'LOCATED_IN', startNodeId: 'c2', endNodeId: 'city1', properties: {} },
  { id: 'r18', type: 'LOCATED_IN', startNodeId: 'c3', endNodeId: 'city2', properties: {} },
]

// ============================================
// 샘플 그래프 생성
// ============================================

export function createSampleGraph(): PropertyGraph {
  return {
    nodes: [...sampleNodes],
    relationships: [...sampleRelationships]
  }
}

// ============================================
// 예제 쿼리
// ============================================

export const exampleQueries: ExampleQuery[] = [
  // READ 쿼리들
  {
    title: '모든 Person 조회',
    description: 'Person 레이블을 가진 모든 노드 조회',
    category: 'read',
    query: `// 모든 사람 조회
MATCH (p:Person)
RETURN p.name, p.age, p.city`
  },
  {
    title: 'Alice의 친구들',
    description: 'KNOWS 관계로 연결된 친구 찾기',
    category: 'read',
    query: `// Alice가 아는 사람들
MATCH (alice:Person {name: 'Alice'})-[:KNOWS]->(friend:Person)
RETURN friend.name, friend.age`
  },
  {
    title: '친구의 친구 (2단계)',
    description: '가변 길이 패턴으로 2단계 친구 찾기',
    category: 'pattern',
    query: `// Alice의 친구의 친구
MATCH (alice:Person {name: 'Alice'})-[:KNOWS*2]->(fof:Person)
RETURN fof.name`
  },
  {
    title: '특정 회사 직원',
    description: 'TechCorp에서 일하는 직원들',
    category: 'read',
    query: `// TechCorp 직원들
MATCH (p:Person)-[:WORKS_AT]->(c:Company {name: 'TechCorp'})
RETURN p.name, p.age`
  },
  {
    title: '서울 거주자',
    description: '서울에 사는 사람들 조회',
    category: 'read',
    query: `// 서울에 사는 사람들
MATCH (p:Person)-[:LIVES_IN]->(city:City {name: 'Seoul'})
RETURN p.name`
  },
  {
    title: '모든 관계 조회',
    description: '그래프의 모든 연결 관계',
    category: 'read',
    query: `// 모든 노드와 관계
MATCH (a)-[r]->(b)
RETURN a.name, type(r), b.name`
  },

  // CREATE 쿼리들
  {
    title: '새 Person 생성',
    description: '새로운 사람 노드 추가',
    category: 'create',
    query: `// 새 사람 추가
CREATE (p:Person {name: 'Frank', age: 29, city: 'Daegu'})`
  },
  {
    title: '관계 생성',
    description: '두 노드 사이에 관계 생성',
    category: 'create',
    query: `// 새 관계 추가
CREATE (a:Person {name: 'Grace'})-[:KNOWS {since: 2023}]->(b:Person {name: 'Henry'})`
  },

  // 패턴 매칭 쿼리들
  {
    title: '양방향 관계',
    description: '방향에 관계없이 연결된 노드',
    category: 'pattern',
    query: `// 양방향 KNOWS 관계
MATCH (a:Person)-[:KNOWS]-(b:Person)
RETURN a.name, b.name`
  },
  {
    title: '복합 패턴',
    description: '여러 조건을 조합한 쿼리',
    category: 'pattern',
    query: `// 같은 도시에 사는 친구
MATCH (a:Person)-[:KNOWS]->(b:Person),
      (a)-[:LIVES_IN]->(city:City),
      (b)-[:LIVES_IN]->(city)
RETURN a.name, b.name, city.name`
  },
]

// ============================================
// 빈 그래프 생성
// ============================================

export function createEmptyGraph(): PropertyGraph {
  return {
    nodes: [],
    relationships: []
  }
}

// ============================================
// 그래프 복사 (immutable 연산용)
// ============================================

export function cloneGraph(graph: PropertyGraph): PropertyGraph {
  return {
    nodes: graph.nodes.map(n => ({
      ...n,
      properties: { ...n.properties }
    })),
    relationships: graph.relationships.map(r => ({
      ...r,
      properties: { ...r.properties }
    }))
  }
}
