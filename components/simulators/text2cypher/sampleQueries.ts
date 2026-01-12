// Text2Cypher Sample Queries

export interface QueryExample {
  id: string
  naturalLanguage: string
  cypherQuery: string
  explanation: string
  schema: {
    nodes: string[]
    relationships: string[]
  }
  difficulty: 'easy' | 'medium' | 'hard'
}

export const sampleQueries: QueryExample[] = [
  // Easy
  {
    id: 'q1',
    naturalLanguage: '모든 사용자를 보여줘',
    cypherQuery: `MATCH (u:User)
RETURN u`,
    explanation: '가장 기본적인 쿼리입니다. User 라벨을 가진 모든 노드를 반환합니다.',
    schema: {
      nodes: ['User'],
      relationships: []
    },
    difficulty: 'easy'
  },
  {
    id: 'q2',
    naturalLanguage: '이름이 "김철수"인 사용자를 찾아줘',
    cypherQuery: `MATCH (u:User {name: '김철수'})
RETURN u`,
    explanation: '속성 필터링입니다. name 속성이 "김철수"인 User 노드를 찾습니다.',
    schema: {
      nodes: ['User'],
      relationships: []
    },
    difficulty: 'easy'
  },
  {
    id: 'q3',
    naturalLanguage: '사용자 수를 알려줘',
    cypherQuery: `MATCH (u:User)
RETURN count(u) AS userCount`,
    explanation: 'count() 집계 함수로 노드 수를 셉니다.',
    schema: {
      nodes: ['User'],
      relationships: []
    },
    difficulty: 'easy'
  },

  // Medium
  {
    id: 'q4',
    naturalLanguage: '김철수의 친구들을 보여줘',
    cypherQuery: `MATCH (u:User {name: '김철수'})-[:FRIENDS_WITH]->(friend:User)
RETURN friend`,
    explanation: '관계 탐색입니다. 김철수에서 FRIENDS_WITH 관계로 연결된 User를 찾습니다.',
    schema: {
      nodes: ['User'],
      relationships: ['FRIENDS_WITH']
    },
    difficulty: 'medium'
  },
  {
    id: 'q5',
    naturalLanguage: '가장 인기 있는 상품 5개를 보여줘',
    cypherQuery: `MATCH (p:Product)<-[:PURCHASED]-(u:User)
RETURN p.name AS product, count(u) AS purchaseCount
ORDER BY purchaseCount DESC
LIMIT 5`,
    explanation: '집계 + 정렬입니다. 구매 횟수로 정렬하여 상위 5개 상품을 반환합니다.',
    schema: {
      nodes: ['Product', 'User'],
      relationships: ['PURCHASED']
    },
    difficulty: 'medium'
  },
  {
    id: 'q6',
    naturalLanguage: '2024년에 가입한 사용자들과 그들이 작성한 리뷰',
    cypherQuery: `MATCH (u:User)-[:WROTE]->(r:Review)
WHERE u.joinedYear = 2024
RETURN u.name AS user, r.content AS review, r.rating AS rating`,
    explanation: 'WHERE 절로 연도 필터링 + 관계 탐색을 결합합니다.',
    schema: {
      nodes: ['User', 'Review'],
      relationships: ['WROTE']
    },
    difficulty: 'medium'
  },

  // Hard
  {
    id: 'q7',
    naturalLanguage: '친구의 친구 중에서 나와 공통 관심사가 있는 사람',
    cypherQuery: `MATCH (me:User {name: '나'})-[:FRIENDS_WITH*2]-(fof:User)
WHERE me <> fof
AND NOT (me)-[:FRIENDS_WITH]-(fof)
MATCH (me)-[:INTERESTED_IN]->(interest)<-[:INTERESTED_IN]-(fof)
RETURN DISTINCT fof.name AS friendOfFriend,
       collect(interest.name) AS commonInterests`,
    explanation: '2-hop 관계 탐색 + 공통 노드 찾기. 친구 추천 로직의 기초입니다.',
    schema: {
      nodes: ['User', 'Interest'],
      relationships: ['FRIENDS_WITH', 'INTERESTED_IN']
    },
    difficulty: 'hard'
  },
  {
    id: 'q8',
    naturalLanguage: '삼성전자와 2단계 이내로 연결된 모든 기업과 그 관계',
    cypherQuery: `MATCH path = (samsung:Company {name: '삼성전자'})-[r*1..2]-(related:Company)
WHERE samsung <> related
RETURN samsung.name AS source,
       [rel IN r | type(rel)] AS relationships,
       related.name AS target,
       length(path) AS hops`,
    explanation: '가변 길이 관계 탐색 (*1..2). 기업 네트워크 분석에 활용됩니다.',
    schema: {
      nodes: ['Company'],
      relationships: ['COMPETES_WITH', 'PARTNERS_WITH', 'SUPPLIES_TO']
    },
    difficulty: 'hard'
  },
  {
    id: 'q9',
    naturalLanguage: '최단 경로로 서울에서 부산까지 가는 방법',
    cypherQuery: `MATCH path = shortestPath(
  (start:City {name: '서울'})-[:CONNECTED_TO*]-(end:City {name: '부산'})
)
RETURN [node IN nodes(path) | node.name] AS route,
       length(path) AS totalHops,
       reduce(dist = 0, r IN relationships(path) | dist + r.distance) AS totalDistance`,
    explanation: 'shortestPath() 함수로 최단 경로 탐색. 경로 비용 계산도 포함합니다.',
    schema: {
      nodes: ['City'],
      relationships: ['CONNECTED_TO']
    },
    difficulty: 'hard'
  },
  {
    id: 'q10',
    naturalLanguage: 'PageRank가 높은 상위 10명의 인플루언서',
    cypherQuery: `CALL gds.pageRank.stream('socialNetwork')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS user, score
ORDER BY score DESC
LIMIT 10
RETURN user.name AS influencer,
       round(score, 4) AS pageRankScore,
       size((user)-[:FOLLOWS]->()) AS followers`,
    explanation: 'GDS(Graph Data Science) 라이브러리 사용. 그래프 알고리즘과 Cypher 결합.',
    schema: {
      nodes: ['User'],
      relationships: ['FOLLOWS']
    },
    difficulty: 'hard'
  }
]

export const schemaExamples = {
  social: {
    name: '소셜 네트워크',
    nodes: ['User', 'Post', 'Interest'],
    relationships: ['FRIENDS_WITH', 'POSTED', 'LIKES', 'INTERESTED_IN', 'FOLLOWS']
  },
  ecommerce: {
    name: '이커머스',
    nodes: ['User', 'Product', 'Order', 'Review', 'Category'],
    relationships: ['PURCHASED', 'REVIEWED', 'BELONGS_TO', 'VIEWED']
  },
  company: {
    name: '기업 네트워크',
    nodes: ['Company', 'Person', 'Product', 'Industry'],
    relationships: ['WORKS_AT', 'COMPETES_WITH', 'PARTNERS_WITH', 'SUPPLIES_TO', 'BELONGS_TO']
  }
}
