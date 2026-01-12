// Sample Graphs for Algorithm Demonstrations

import type { Graph } from './types'

// Social Network Graph - 친구 관계 네트워크
export const socialNetworkGraph: Graph = {
  nodes: [
    { id: 'alice', label: 'Alice', group: 'influencer' },
    { id: 'bob', label: 'Bob', group: 'regular' },
    { id: 'charlie', label: 'Charlie', group: 'regular' },
    { id: 'david', label: 'David', group: 'bridge' },
    { id: 'eve', label: 'Eve', group: 'regular' },
    { id: 'frank', label: 'Frank', group: 'regular' },
    { id: 'grace', label: 'Grace', group: 'influencer' },
    { id: 'henry', label: 'Henry', group: 'regular' },
    { id: 'ivy', label: 'Ivy', group: 'regular' },
    { id: 'jack', label: 'Jack', group: 'regular' },
  ],
  edges: [
    { id: 'e1', from: 'alice', to: 'bob', weight: 1 },
    { id: 'e2', from: 'alice', to: 'charlie', weight: 1 },
    { id: 'e3', from: 'alice', to: 'david', weight: 1 },
    { id: 'e4', from: 'bob', to: 'charlie', weight: 1 },
    { id: 'e5', from: 'david', to: 'eve', weight: 1 },
    { id: 'e6', from: 'david', to: 'frank', weight: 1 },
    { id: 'e7', from: 'eve', to: 'frank', weight: 1 },
    { id: 'e8', from: 'frank', to: 'grace', weight: 1 },
    { id: 'e9', from: 'grace', to: 'henry', weight: 1 },
    { id: 'e10', from: 'grace', to: 'ivy', weight: 1 },
    { id: 'e11', from: 'grace', to: 'jack', weight: 1 },
    { id: 'e12', from: 'henry', to: 'ivy', weight: 1 },
    { id: 'e13', from: 'ivy', to: 'jack', weight: 1 },
    { id: 'e14', from: 'bob', to: 'david', weight: 1 },
  ],
}

// Karate Club Graph - 유명한 커뮤니티 탐지 예제
export const karateClubGraph: Graph = {
  nodes: [
    { id: '0', label: 'Mr. Hi', group: 'instructor' },
    { id: '1', label: '1', group: 'member' },
    { id: '2', label: '2', group: 'member' },
    { id: '3', label: '3', group: 'member' },
    { id: '4', label: '4', group: 'member' },
    { id: '5', label: '5', group: 'member' },
    { id: '6', label: '6', group: 'member' },
    { id: '7', label: '7', group: 'member' },
    { id: '8', label: '8', group: 'member' },
    { id: '9', label: '9', group: 'member' },
    { id: '10', label: '10', group: 'member' },
    { id: '11', label: '11', group: 'member' },
    { id: '33', label: 'Officer', group: 'officer' },
  ],
  edges: [
    { id: 'k1', from: '0', to: '1', weight: 1 },
    { id: 'k2', from: '0', to: '2', weight: 1 },
    { id: 'k3', from: '0', to: '3', weight: 1 },
    { id: 'k4', from: '0', to: '4', weight: 1 },
    { id: 'k5', from: '0', to: '5', weight: 1 },
    { id: 'k6', from: '0', to: '6', weight: 1 },
    { id: 'k7', from: '0', to: '7', weight: 1 },
    { id: 'k8', from: '0', to: '8', weight: 1 },
    { id: 'k9', from: '1', to: '2', weight: 1 },
    { id: 'k10', from: '1', to: '3', weight: 1 },
    { id: 'k11', from: '2', to: '3', weight: 1 },
    { id: 'k12', from: '4', to: '5', weight: 1 },
    { id: 'k13', from: '4', to: '6', weight: 1 },
    { id: 'k14', from: '5', to: '6', weight: 1 },
    { id: 'k15', from: '8', to: '33', weight: 1 },
    { id: 'k16', from: '9', to: '33', weight: 1 },
    { id: 'k17', from: '10', to: '33', weight: 1 },
    { id: 'k18', from: '11', to: '33', weight: 1 },
    { id: 'k19', from: '9', to: '10', weight: 1 },
    { id: 'k20', from: '10', to: '11', weight: 1 },
  ],
}

// City Road Network - 최단 경로 예제
export const cityRoadGraph: Graph = {
  nodes: [
    { id: 'seoul', label: '서울', group: 'capital' },
    { id: 'incheon', label: '인천', group: 'metro' },
    { id: 'suwon', label: '수원', group: 'city' },
    { id: 'daejeon', label: '대전', group: 'metro' },
    { id: 'daegu', label: '대구', group: 'metro' },
    { id: 'busan', label: '부산', group: 'metro' },
    { id: 'gwangju', label: '광주', group: 'metro' },
    { id: 'jeonju', label: '전주', group: 'city' },
  ],
  edges: [
    { id: 'r1', from: 'seoul', to: 'incheon', label: '40km', weight: 40 },
    { id: 'r2', from: 'seoul', to: 'suwon', label: '30km', weight: 30 },
    { id: 'r3', from: 'suwon', to: 'daejeon', label: '120km', weight: 120 },
    { id: 'r4', from: 'daejeon', to: 'daegu', label: '130km', weight: 130 },
    { id: 'r5', from: 'daegu', to: 'busan', label: '90km', weight: 90 },
    { id: 'r6', from: 'daejeon', to: 'jeonju', label: '60km', weight: 60 },
    { id: 'r7', from: 'jeonju', to: 'gwangju', label: '80km', weight: 80 },
    { id: 'r8', from: 'gwangju', to: 'busan', label: '200km', weight: 200 },
    { id: 'r9', from: 'seoul', to: 'daejeon', label: '160km', weight: 160 },
  ],
}

// Company Organization Graph - 조직도
export const companyOrgGraph: Graph = {
  nodes: [
    { id: 'ceo', label: 'CEO', group: 'executive' },
    { id: 'cto', label: 'CTO', group: 'executive' },
    { id: 'cfo', label: 'CFO', group: 'executive' },
    { id: 'cmo', label: 'CMO', group: 'executive' },
    { id: 'dev1', label: 'Dev Lead', group: 'manager' },
    { id: 'dev2', label: 'Backend', group: 'engineer' },
    { id: 'dev3', label: 'Frontend', group: 'engineer' },
    { id: 'dev4', label: 'DevOps', group: 'engineer' },
    { id: 'fin1', label: 'Accountant', group: 'staff' },
    { id: 'mkt1', label: 'Marketing', group: 'staff' },
    { id: 'mkt2', label: 'Sales', group: 'staff' },
  ],
  edges: [
    { id: 'o1', from: 'ceo', to: 'cto', weight: 1 },
    { id: 'o2', from: 'ceo', to: 'cfo', weight: 1 },
    { id: 'o3', from: 'ceo', to: 'cmo', weight: 1 },
    { id: 'o4', from: 'cto', to: 'dev1', weight: 1 },
    { id: 'o5', from: 'dev1', to: 'dev2', weight: 1 },
    { id: 'o6', from: 'dev1', to: 'dev3', weight: 1 },
    { id: 'o7', from: 'dev1', to: 'dev4', weight: 1 },
    { id: 'o8', from: 'cfo', to: 'fin1', weight: 1 },
    { id: 'o9', from: 'cmo', to: 'mkt1', weight: 1 },
    { id: 'o10', from: 'cmo', to: 'mkt2', weight: 1 },
    { id: 'o11', from: 'dev2', to: 'dev3', weight: 1 },
    { id: 'o12', from: 'mkt1', to: 'mkt2', weight: 1 },
  ],
}

export const sampleGraphs = {
  social: {
    name: '소셜 네트워크',
    description: '친구 관계 네트워크 - 중심성 분석에 적합',
    graph: socialNetworkGraph,
  },
  karate: {
    name: '가라테 클럽',
    description: '커뮤니티 탐지 벤치마크 데이터',
    graph: karateClubGraph,
  },
  city: {
    name: '도시 도로망',
    description: '가중치 그래프 - 최단 경로 분석에 적합',
    graph: cityRoadGraph,
  },
  company: {
    name: '회사 조직도',
    description: '계층 구조 그래프',
    graph: companyOrgGraph,
  },
}

export type SampleGraphKey = keyof typeof sampleGraphs
