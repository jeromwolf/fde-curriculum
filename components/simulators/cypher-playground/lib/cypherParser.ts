/**
 * Cypher Query Parser & Executor
 * 순수 함수로 구현하여 프레임워크 독립적으로 사용 가능
 */

import type { Node, Relationship, PropertyGraph, QueryResult, CypherError } from '../types'

// ============================================
// 토큰화 및 파싱
// ============================================

interface Token {
  type: 'KEYWORD' | 'IDENTIFIER' | 'STRING' | 'NUMBER' | 'OPERATOR' | 'PUNCTUATION' | 'LABEL' | 'RELTYPE' | 'VARIABLE'
  value: string
  position: number
}

const KEYWORDS = [
  'MATCH', 'WHERE', 'RETURN', 'CREATE', 'DELETE', 'DETACH', 'SET', 'REMOVE',
  'ORDER', 'BY', 'LIMIT', 'SKIP', 'AS', 'AND', 'OR', 'NOT', 'IN', 'WITH',
  'OPTIONAL', 'MERGE', 'ON', 'DISTINCT', 'ASC', 'DESC', 'NULL', 'TRUE', 'FALSE'
]

export function tokenize(query: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < query.length) {
    // 공백 스킵
    if (/\s/.test(query[i])) {
      i++
      continue
    }

    // 주석 스킵
    if (query.slice(i, i + 2) === '//') {
      while (i < query.length && query[i] !== '\n') i++
      continue
    }

    // 문자열 리터럴
    if (query[i] === "'" || query[i] === '"') {
      const quote = query[i]
      const start = i
      i++
      while (i < query.length && query[i] !== quote) {
        if (query[i] === '\\') i++
        i++
      }
      i++
      tokens.push({ type: 'STRING', value: query.slice(start + 1, i - 1), position: start })
      continue
    }

    // 숫자
    if (/\d/.test(query[i]) || (query[i] === '-' && /\d/.test(query[i + 1]))) {
      const start = i
      if (query[i] === '-') i++
      while (i < query.length && /[\d.]/.test(query[i])) i++
      tokens.push({ type: 'NUMBER', value: query.slice(start, i), position: start })
      continue
    }

    // 레이블 (: 뒤에 오는 식별자)
    if (query[i] === ':') {
      const start = i
      i++
      while (i < query.length && /[\w]/.test(query[i])) i++
      const value = query.slice(start + 1, i)
      if (value) {
        tokens.push({ type: 'LABEL', value, position: start })
      } else {
        tokens.push({ type: 'PUNCTUATION', value: ':', position: start })
      }
      continue
    }

    // 관계 타입 [: 또는 [:
    if (query[i] === '[') {
      tokens.push({ type: 'PUNCTUATION', value: '[', position: i })
      i++
      continue
    }

    // 식별자 또는 키워드
    if (/[\w]/.test(query[i])) {
      const start = i
      while (i < query.length && /[\w]/.test(query[i])) i++
      const value = query.slice(start, i)
      const upper = value.toUpperCase()
      if (KEYWORDS.includes(upper)) {
        tokens.push({ type: 'KEYWORD', value: upper, position: start })
      } else {
        tokens.push({ type: 'IDENTIFIER', value, position: start })
      }
      continue
    }

    // 변수 ($ prefix)
    if (query[i] === '$') {
      const start = i
      i++
      while (i < query.length && /[\w]/.test(query[i])) i++
      tokens.push({ type: 'VARIABLE', value: query.slice(start, i), position: start })
      continue
    }

    // 연산자
    const ops = ['<>', '<=', '>=', '->', '<-', '=~', '<', '>', '=', '+', '-', '*', '/', '%']
    let matched = false
    for (const op of ops) {
      if (query.slice(i, i + op.length) === op) {
        tokens.push({ type: 'OPERATOR', value: op, position: i })
        i += op.length
        matched = true
        break
      }
    }
    if (matched) continue

    // 구두점
    if ('(){}[],.;|'.includes(query[i])) {
      tokens.push({ type: 'PUNCTUATION', value: query[i], position: i })
      i++
      continue
    }

    i++
  }

  return tokens
}

// ============================================
// 패턴 파싱
// ============================================

interface NodePattern {
  variable?: string
  labels: string[]
  properties: Record<string, any>
}

interface RelPattern {
  variable?: string
  types: string[]
  properties: Record<string, any>
  direction: 'outgoing' | 'incoming' | 'both'
  minHops?: number
  maxHops?: number
}

interface PathPattern {
  nodes: NodePattern[]
  relationships: RelPattern[]
}

export function parsePattern(patternStr: string): PathPattern {
  const nodes: NodePattern[] = []
  const relationships: RelPattern[] = []

  // 간단한 패턴 파싱: (a:Person)-[:KNOWS]->(b:Person)
  const nodeRegex = /\(([^)]*)\)/g
  const relRegex = /(-\[([^\]]*)\]->?|<-\[([^\]]*)\]-|--)/g

  let match
  while ((match = nodeRegex.exec(patternStr)) !== null) {
    const content = match[1].trim()
    const node: NodePattern = { labels: [], properties: {} }

    // 변수와 레이블 파싱
    const labelMatch = content.match(/^(\w+)?(?::(\w+))?/)
    if (labelMatch) {
      if (labelMatch[1]) node.variable = labelMatch[1]
      if (labelMatch[2]) node.labels.push(labelMatch[2])
    }

    // 속성 파싱 {name: 'value'}
    const propMatch = content.match(/\{([^}]+)\}/)
    if (propMatch) {
      const propStr = propMatch[1]
      const propPairs = propStr.split(',')
      for (const pair of propPairs) {
        const [key, value] = pair.split(':').map(s => s.trim())
        if (key && value) {
          // 따옴표 제거
          node.properties[key] = value.replace(/^['"]|['"]$/g, '')
        }
      }
    }

    nodes.push(node)
  }

  while ((match = relRegex.exec(patternStr)) !== null) {
    const rel: RelPattern = { types: [], properties: {}, direction: 'both' }

    if (match[0].startsWith('-[') && match[0].endsWith(']->')) {
      rel.direction = 'outgoing'
    } else if (match[0].startsWith('<-[') && match[0].endsWith(']-')) {
      rel.direction = 'incoming'
    }

    const content = match[2] || match[3] || ''
    const typeMatch = content.match(/:(\w+)/)
    if (typeMatch) {
      rel.types.push(typeMatch[1])
    }

    // 가변 길이 패턴 *1..3
    const hopsMatch = content.match(/\*(\d+)?\.\.(\d+)?/)
    if (hopsMatch) {
      rel.minHops = hopsMatch[1] ? parseInt(hopsMatch[1]) : 1
      rel.maxHops = hopsMatch[2] ? parseInt(hopsMatch[2]) : undefined
    }

    relationships.push(rel)
  }

  return { nodes, relationships }
}

// ============================================
// 쿼리 실행
// ============================================

export interface ExecuteOptions {
  graph: PropertyGraph
  variables?: Record<string, any>
}

export function executeCypher(query: string, options: ExecuteOptions): QueryResult | CypherError {
  const { graph } = options
  const tokens = tokenize(query)

  try {
    // 첫 키워드로 쿼리 타입 판단
    const firstKeyword = tokens.find(t => t.type === 'KEYWORD')?.value

    switch (firstKeyword) {
      case 'MATCH':
        return executeMatch(query, tokens, graph)
      case 'CREATE':
        return executeCreate(query, tokens, graph)
      case 'RETURN':
        // 단순 RETURN (예: RETURN 1+1)
        return executeSimpleReturn(query, tokens)
      default:
        return { message: `지원하지 않는 쿼리 타입: ${firstKeyword || 'UNKNOWN'}` }
    }
  } catch (error: any) {
    return { message: error.message || '쿼리 실행 중 오류 발생' }
  }
}

function executeMatch(query: string, tokens: Token[], graph: PropertyGraph): QueryResult | CypherError {
  const startTime = performance.now()

  // MATCH 절 추출
  const matchIdx = tokens.findIndex(t => t.value === 'MATCH')
  let endIdx = tokens.findIndex((t, i) => i > matchIdx && ['WHERE', 'RETURN', 'WITH'].includes(t.value))
  if (endIdx === -1) endIdx = tokens.length

  // WHERE 절 추출
  const whereIdx = tokens.findIndex(t => t.value === 'WHERE')
  const returnIdx = tokens.findIndex(t => t.value === 'RETURN')

  // RETURN 절의 변수들 추출
  const returnVars: string[] = []
  if (returnIdx !== -1) {
    for (let i = returnIdx + 1; i < tokens.length; i++) {
      const t = tokens[i]
      if (t.type === 'IDENTIFIER') {
        returnVars.push(t.value)
      } else if (t.value === ',' || t.value === '.') {
        continue
      } else if (t.type === 'KEYWORD') {
        break
      }
    }
  }

  // 패턴에서 노드 변수와 레이블 추출
  const nodeVarMap: Map<string, { labels: string[], props: Record<string, any> }> = new Map()
  const relVarMap: Map<string, { types: string[] }> = new Map()

  // 간단한 패턴 파싱
  const patternMatch = query.match(/MATCH\s+(.+?)(?=WHERE|RETURN|$)/i)
  if (patternMatch) {
    const pattern = parsePattern(patternMatch[1])
    pattern.nodes.forEach(n => {
      if (n.variable) {
        nodeVarMap.set(n.variable, { labels: n.labels, props: n.properties })
      }
    })
    pattern.relationships.forEach((r, i) => {
      const varName = `r${i}`
      relVarMap.set(varName, { types: r.types })
    })
  }

  // 노드 매칭
  const matchedBindings: Record<string, any>[] = []

  for (const [varName, constraints] of Array.from(nodeVarMap)) {
    const matchingNodes = graph.nodes.filter(node => {
      // 레이블 매칭
      if (constraints.labels.length > 0) {
        if (!constraints.labels.every(l => node.labels.includes(l))) {
          return false
        }
      }
      // 속성 매칭
      for (const [key, value] of Object.entries(constraints.props)) {
        if (node.properties[key] !== value) {
          return false
        }
      }
      return true
    })

    if (matchedBindings.length === 0) {
      matchingNodes.forEach(node => {
        matchedBindings.push({ [varName]: node })
      })
    } else {
      // Cross join with existing bindings
      const newBindings: Record<string, any>[] = []
      for (const binding of matchedBindings) {
        for (const node of matchingNodes) {
          newBindings.push({ ...binding, [varName]: node })
        }
      }
      matchedBindings.length = 0
      matchedBindings.push(...newBindings)
    }
  }

  // WHERE 절 필터링 (간단 구현)
  if (whereIdx !== -1 && returnIdx !== -1) {
    const whereClause = query.slice(
      query.toUpperCase().indexOf('WHERE') + 5,
      query.toUpperCase().indexOf('RETURN')
    ).trim()

    // 간단한 속성 비교 파싱: n.name = 'Alice'
    const propMatch = whereClause.match(/(\w+)\.(\w+)\s*=\s*['"]?([^'"]+)['"]?/i)
    if (propMatch) {
      const [, varName, propName, propValue] = propMatch
      const filtered = matchedBindings.filter(binding => {
        const node = binding[varName]
        if (!node) return false
        return String(node.properties[propName]) === propValue
      })
      matchedBindings.length = 0
      matchedBindings.push(...filtered)
    }
  }

  // RETURN 절 처리
  const columns = returnVars.length > 0 ? returnVars : Array.from(nodeVarMap.keys())
  const rows = matchedBindings.map(binding => {
    const row: Record<string, any> = {}
    for (const col of columns) {
      if (col.includes('.')) {
        const [varName, propName] = col.split('.')
        const node = binding[varName]
        row[col] = node?.properties?.[propName] ?? null
      } else {
        row[col] = binding[col] ?? null
      }
    }
    return row
  })

  return {
    columns,
    rows,
    executionTime: performance.now() - startTime
  }
}

function executeCreate(query: string, tokens: Token[], graph: PropertyGraph): QueryResult | CypherError {
  const startTime = performance.now()
  let nodesCreated = 0
  let relsCreated = 0

  // 패턴 추출
  const createMatch = query.match(/CREATE\s+(.+?)(?=RETURN|$)/i)
  if (!createMatch) {
    return { message: 'CREATE 패턴을 파싱할 수 없습니다' }
  }

  const pattern = parsePattern(createMatch[1])
  const createdNodes: Node[] = []

  // 노드 생성
  for (const nodePattern of pattern.nodes) {
    const node: Node = {
      id: `n${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      labels: nodePattern.labels,
      properties: nodePattern.properties
    }
    createdNodes.push(node)
    graph.nodes.push(node)
    nodesCreated++
  }

  // 관계 생성
  for (let i = 0; i < pattern.relationships.length; i++) {
    const relPattern = pattern.relationships[i]
    if (createdNodes[i] && createdNodes[i + 1]) {
      const rel: Relationship = {
        id: `r${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: relPattern.types[0] || 'RELATED_TO',
        startNodeId: createdNodes[i].id,
        endNodeId: createdNodes[i + 1].id,
        properties: relPattern.properties
      }
      graph.relationships.push(rel)
      relsCreated++
    }
  }

  return {
    columns: ['노드 생성', '관계 생성'],
    rows: [{ '노드 생성': nodesCreated, '관계 생성': relsCreated }],
    nodesAffected: nodesCreated,
    relationshipsAffected: relsCreated,
    executionTime: performance.now() - startTime
  }
}

function executeSimpleReturn(query: string, tokens: Token[]): QueryResult | CypherError {
  // 간단한 표현식 계산
  const returnIdx = tokens.findIndex(t => t.value === 'RETURN')
  if (returnIdx === -1) {
    return { message: 'RETURN 절을 찾을 수 없습니다' }
  }

  // 간단한 수식만 지원
  const expr = tokens.slice(returnIdx + 1).map(t => t.value).join(' ')

  try {
    // 안전한 수식만 평가 (숫자와 연산자만)
    if (/^[\d\s+\-*/().]+$/.test(expr)) {
      const result = eval(expr)
      return {
        columns: ['result'],
        rows: [{ result }]
      }
    }
    return {
      columns: ['expression'],
      rows: [{ expression: expr }]
    }
  } catch {
    return { message: '표현식을 평가할 수 없습니다' }
  }
}

// ============================================
// 유틸리티 함수
// ============================================

export function formatCypherResult(result: QueryResult): string {
  if (result.rows.length === 0) {
    return '(결과 없음)'
  }

  const colWidths = result.columns.map(col => {
    const values = result.rows.map(r => String(r[col] ?? '').length)
    return Math.max(col.length, ...values)
  })

  const header = result.columns.map((col, i) => col.padEnd(colWidths[i])).join(' | ')
  const separator = colWidths.map(w => '-'.repeat(w)).join('-+-')
  const rows = result.rows.map(row =>
    result.columns.map((col, i) => String(row[col] ?? '').padEnd(colWidths[i])).join(' | ')
  )

  return [header, separator, ...rows].join('\n')
}

export function validateCypher(query: string): CypherError | null {
  const tokens = tokenize(query)

  if (tokens.length === 0) {
    return { message: '빈 쿼리입니다' }
  }

  const firstKeyword = tokens.find(t => t.type === 'KEYWORD')
  if (!firstKeyword) {
    return { message: '유효한 Cypher 키워드를 찾을 수 없습니다' }
  }

  // 괄호 짝 검사
  let parenCount = 0
  let bracketCount = 0
  let braceCount = 0

  for (const token of tokens) {
    if (token.value === '(') parenCount++
    if (token.value === ')') parenCount--
    if (token.value === '[') bracketCount++
    if (token.value === ']') bracketCount--
    if (token.value === '{') braceCount++
    if (token.value === '}') braceCount--
  }

  if (parenCount !== 0) return { message: '괄호 ()가 짝이 맞지 않습니다' }
  if (bracketCount !== 0) return { message: '대괄호 []가 짝이 맞지 않습니다' }
  if (braceCount !== 0) return { message: '중괄호 {}가 짝이 맞지 않습니다' }

  return null
}
