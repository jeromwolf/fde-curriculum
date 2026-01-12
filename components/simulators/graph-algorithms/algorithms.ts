// Graph Algorithm Implementations

import type { Graph, GraphNode, AlgorithmResult, AlgorithmConfig } from './types'

// 인접 리스트 생성 (양방향)
function buildAdjacencyList(graph: Graph): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>()

  graph.nodes.forEach(node => {
    adj.set(node.id, new Set())
  })

  graph.edges.forEach(edge => {
    adj.get(edge.from)?.add(edge.to)
    adj.get(edge.to)?.add(edge.from) // 무방향 그래프로 처리
  })

  return adj
}

// 가중치 인접 리스트
function buildWeightedAdjacencyList(graph: Graph): Map<string, Map<string, number>> {
  const adj = new Map<string, Map<string, number>>()

  graph.nodes.forEach(node => {
    adj.set(node.id, new Map())
  })

  graph.edges.forEach(edge => {
    const weight = edge.weight || 1
    adj.get(edge.from)?.set(edge.to, weight)
    adj.get(edge.to)?.set(edge.from, weight)
  })

  return adj
}

/**
 * Degree Centrality - 연결 수 기반 중심성
 * 공식: C_D(v) = deg(v) / (n-1)
 */
export function degreeCentrality(graph: Graph): AlgorithmResult {
  const startTime = performance.now()
  const adj = buildAdjacencyList(graph)
  const n = graph.nodes.length
  const scores = new Map<string, number>()

  graph.nodes.forEach(node => {
    const degree = adj.get(node.id)?.size || 0
    const centrality = n > 1 ? degree / (n - 1) : 0
    scores.set(node.id, centrality)
  })

  return {
    type: 'degree',
    nodes: scores,
    executionTime: performance.now() - startTime,
    description: 'Degree Centrality: 노드의 연결 수를 기반으로 중요도 측정. 높을수록 많은 노드와 직접 연결됨.',
  }
}

/**
 * PageRank - 구글의 페이지 랭킹 알고리즘
 * 공식: PR(p) = (1-d)/N + d * Σ(PR(q)/L(q))
 */
export function pageRank(graph: Graph, config?: AlgorithmConfig): AlgorithmResult {
  const startTime = performance.now()
  const d = config?.dampingFactor || 0.85
  const iterations = config?.iterations || 20
  const n = graph.nodes.length
  const adj = buildAdjacencyList(graph)

  // 초기화: 모든 노드에 1/n
  let scores = new Map<string, number>()
  graph.nodes.forEach(node => scores.set(node.id, 1 / n))

  // 반복 계산
  for (let i = 0; i < iterations; i++) {
    const newScores = new Map<string, number>()

    graph.nodes.forEach(node => {
      let rank = (1 - d) / n

      // 이 노드를 가리키는 모든 노드에서 기여분 합산
      adj.forEach((neighbors, sourceId) => {
        if (neighbors.has(node.id)) {
          const sourceOutDegree = neighbors.size
          const sourceRank = scores.get(sourceId) || 0
          rank += d * (sourceRank / sourceOutDegree)
        }
      })

      newScores.set(node.id, rank)
    })

    scores = newScores
  }

  return {
    type: 'pagerank',
    nodes: scores,
    executionTime: performance.now() - startTime,
    description: `PageRank (d=${d}, ${iterations}회 반복): 링크 구조 기반 중요도. 중요한 노드로부터 링크를 받으면 더 중요해짐.`,
  }
}

/**
 * Betweenness Centrality - 최단 경로 통과 빈도
 * 다른 노드 쌍의 최단 경로에 얼마나 자주 포함되는지
 */
export function betweennessCentrality(graph: Graph): AlgorithmResult {
  const startTime = performance.now()
  const adj = buildAdjacencyList(graph)
  const scores = new Map<string, number>()

  graph.nodes.forEach(node => scores.set(node.id, 0))

  // 모든 노드 쌍에 대해 최단 경로 계산
  graph.nodes.forEach(source => {
    const { paths, predecessors } = bfsShortestPaths(source.id, adj)

    // 각 목적지에서 역추적하며 betweenness 계산
    const delta = new Map<string, number>()
    graph.nodes.forEach(node => delta.set(node.id, 0))

    const sortedByDistance = Array.from(paths.entries())
      .sort((a, b) => b[1] - a[1])

    sortedByDistance.forEach(([nodeId]) => {
      if (nodeId !== source.id) {
        const preds = predecessors.get(nodeId) || []
        preds.forEach(pred => {
          const contribution = (1 + (delta.get(nodeId) || 0)) / preds.length
          delta.set(pred, (delta.get(pred) || 0) + contribution)
        })

        if (nodeId !== source.id) {
          scores.set(nodeId, (scores.get(nodeId) || 0) + (delta.get(nodeId) || 0))
        }
      }
    })
  })

  // 정규화
  const n = graph.nodes.length
  const normFactor = n > 2 ? 2 / ((n - 1) * (n - 2)) : 1
  scores.forEach((value, key) => {
    scores.set(key, value * normFactor)
  })

  return {
    type: 'betweenness',
    nodes: scores,
    executionTime: performance.now() - startTime,
    description: 'Betweenness Centrality: 다른 노드 쌍 사이의 최단 경로에 얼마나 자주 등장하는지. 브릿지 역할의 노드를 찾음.',
  }
}

// BFS로 최단 경로 및 선행자 계산
function bfsShortestPaths(source: string, adj: Map<string, Set<string>>) {
  const paths = new Map<string, number>()
  const predecessors = new Map<string, string[]>()
  const queue: string[] = [source]

  paths.set(source, 0)
  predecessors.set(source, [])

  while (queue.length > 0) {
    const current = queue.shift()!
    const currentDist = paths.get(current)!

    adj.get(current)?.forEach(neighbor => {
      if (!paths.has(neighbor)) {
        paths.set(neighbor, currentDist + 1)
        predecessors.set(neighbor, [current])
        queue.push(neighbor)
      } else if (paths.get(neighbor) === currentDist + 1) {
        predecessors.get(neighbor)?.push(current)
      }
    })
  }

  return { paths, predecessors }
}

/**
 * Closeness Centrality - 다른 노드까지의 평균 거리
 * 공식: C_C(v) = (n-1) / Σ d(v,u)
 */
export function closenessCentrality(graph: Graph): AlgorithmResult {
  const startTime = performance.now()
  const adj = buildAdjacencyList(graph)
  const n = graph.nodes.length
  const scores = new Map<string, number>()

  graph.nodes.forEach(node => {
    const { paths } = bfsShortestPaths(node.id, adj)

    let totalDistance = 0
    let reachable = 0

    paths.forEach((distance, targetId) => {
      if (targetId !== node.id && distance < Infinity) {
        totalDistance += distance
        reachable++
      }
    })

    // Closeness = (도달 가능한 노드 수) / (총 거리)
    const centrality = reachable > 0 ? reachable / totalDistance : 0
    scores.set(node.id, centrality)
  })

  return {
    type: 'closeness',
    nodes: scores,
    executionTime: performance.now() - startTime,
    description: 'Closeness Centrality: 다른 모든 노드까지의 평균 거리의 역수. 높을수록 네트워크 중심에 위치.',
  }
}

/**
 * Community Detection - Label Propagation
 * 이웃 노드들의 레이블 중 가장 빈번한 것을 채택
 */
export function communityDetection(graph: Graph): AlgorithmResult {
  const startTime = performance.now()
  const adj = buildAdjacencyList(graph)

  // 초기화: 각 노드에 고유 커뮤니티 ID
  const communities = new Map<string, number>()
  graph.nodes.forEach((node, index) => {
    communities.set(node.id, index)
  })

  // Label Propagation
  const maxIterations = 10
  let changed = true
  let iteration = 0

  while (changed && iteration < maxIterations) {
    changed = false
    iteration++

    // 노드 순서 랜덤화
    const shuffledNodes = [...graph.nodes].sort(() => Math.random() - 0.5)

    shuffledNodes.forEach(node => {
      const neighbors = adj.get(node.id)
      if (!neighbors || neighbors.size === 0) return

      // 이웃 커뮤니티 빈도 계산
      const communityCount = new Map<number, number>()
      neighbors.forEach(neighborId => {
        const comm = communities.get(neighborId)!
        communityCount.set(comm, (communityCount.get(comm) || 0) + 1)
      })

      // 가장 빈번한 커뮤니티 선택
      let maxCount = 0
      let maxComm = communities.get(node.id)!
      communityCount.forEach((count, comm) => {
        if (count > maxCount) {
          maxCount = count
          maxComm = comm
        }
      })

      if (maxComm !== communities.get(node.id)) {
        communities.set(node.id, maxComm)
        changed = true
      }
    })
  }

  // 커뮤니티 ID 재정렬 (0부터 시작)
  const uniqueComms: number[] = []
  communities.forEach((comm) => {
    if (!uniqueComms.includes(comm)) uniqueComms.push(comm)
  })
  const commMapping = new Map<number, number>()
  uniqueComms.forEach((comm, index) => commMapping.set(comm, index))

  const normalizedCommunities = new Map<string, number>()
  communities.forEach((comm, nodeId) => {
    normalizedCommunities.set(nodeId, commMapping.get(comm)!)
  })

  // 노드별 점수 (커뮤니티 크기 기반)
  const commSizes = new Map<number, number>()
  normalizedCommunities.forEach(comm => {
    commSizes.set(comm, (commSizes.get(comm) || 0) + 1)
  })

  const scores = new Map<string, number>()
  normalizedCommunities.forEach((comm, nodeId) => {
    scores.set(nodeId, commSizes.get(comm)! / graph.nodes.length)
  })

  return {
    type: 'community',
    nodes: scores,
    communities: normalizedCommunities,
    executionTime: performance.now() - startTime,
    description: `Community Detection (Label Propagation, ${iteration}회 반복): ${uniqueComms.length}개 커뮤니티 발견. 같은 색상의 노드는 같은 커뮤니티.`,
  }
}

/**
 * Dijkstra's Shortest Path
 */
export function shortestPath(graph: Graph, config: AlgorithmConfig): AlgorithmResult {
  const startTime = performance.now()
  const adj = buildWeightedAdjacencyList(graph)

  const source = config.sourceNode || graph.nodes[0]?.id
  const target = config.targetNode || graph.nodes[graph.nodes.length - 1]?.id

  if (!source || !target) {
    return {
      type: 'shortestPath',
      nodes: new Map(),
      path: [],
      pathLength: Infinity,
      executionTime: performance.now() - startTime,
      description: '출발지 또는 목적지가 지정되지 않았습니다.',
    }
  }

  // Dijkstra
  const distances = new Map<string, number>()
  const previous = new Map<string, string | null>()
  const visited = new Set<string>()

  graph.nodes.forEach(node => {
    distances.set(node.id, Infinity)
    previous.set(node.id, null)
  })
  distances.set(source, 0)

  while (visited.size < graph.nodes.length) {
    // 방문하지 않은 노드 중 최소 거리 노드 선택
    let minNode: string | null = null
    let minDist = Infinity
    distances.forEach((dist, nodeId) => {
      if (!visited.has(nodeId) && dist < minDist) {
        minDist = dist
        minNode = nodeId
      }
    })

    if (minNode === null || minDist === Infinity) break
    if (minNode === target) break

    visited.add(minNode)

    // 이웃 노드 거리 업데이트
    adj.get(minNode)?.forEach((weight, neighbor) => {
      if (!visited.has(neighbor)) {
        const newDist = distances.get(minNode!)! + weight
        if (newDist < distances.get(neighbor)!) {
          distances.set(neighbor, newDist)
          previous.set(neighbor, minNode)
        }
      }
    })
  }

  // 경로 역추적
  const path: string[] = []
  let current: string | null = target
  while (current !== null) {
    path.unshift(current)
    current = previous.get(current) || null
  }

  // 경로가 없는 경우
  if (path[0] !== source) {
    return {
      type: 'shortestPath',
      nodes: distances,
      path: [],
      pathLength: Infinity,
      executionTime: performance.now() - startTime,
      description: `${source}에서 ${target}까지의 경로가 없습니다.`,
    }
  }

  // 점수: 경로에 포함된 노드는 1, 아니면 거리에 따라
  const scores = new Map<string, number>()
  const pathSet = new Set(path)
  graph.nodes.forEach(node => {
    if (pathSet.has(node.id)) {
      scores.set(node.id, 1)
    } else {
      const dist = distances.get(node.id) || Infinity
      scores.set(node.id, dist < Infinity ? 0.3 : 0)
    }
  })

  return {
    type: 'shortestPath',
    nodes: scores,
    path,
    pathLength: distances.get(target) || Infinity,
    executionTime: performance.now() - startTime,
    description: `최단 경로 (${source} → ${target}): 거리 ${distances.get(target)}, 경로 길이 ${path.length}개 노드`,
  }
}

// 알고리즘 실행 헬퍼
export function runAlgorithm(
  algorithmType: string,
  graph: Graph,
  config?: AlgorithmConfig
): AlgorithmResult {
  switch (algorithmType) {
    case 'degree':
      return degreeCentrality(graph)
    case 'pagerank':
      return pageRank(graph, config)
    case 'betweenness':
      return betweennessCentrality(graph)
    case 'closeness':
      return closenessCentrality(graph)
    case 'community':
      return communityDetection(graph)
    case 'shortestPath':
      return shortestPath(graph, config || {})
    default:
      throw new Error(`Unknown algorithm: ${algorithmType}`)
  }
}
