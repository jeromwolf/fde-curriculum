'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sampleQueries, schemaExamples, type QueryExample } from '@/components/simulators/text2cypher/sampleQueries'

// 난이도별 색상
const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
}

const difficultyLabels = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움'
}

export default function Text2CypherPage() {
  const [selectedQuery, setSelectedQuery] = useState<QueryExample>(sampleQueries[0])
  const [customQuery, setCustomQuery] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [showCypher, setShowCypher] = useState(false)
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null)

  // 변환 시뮬레이션
  const handleConvert = async (query: QueryExample) => {
    setSelectedQuery(query)
    setShowCypher(false)
    setIsConverting(true)

    // 타이핑 효과 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsConverting(false)
    setShowCypher(true)
  }

  // 필터링된 쿼리 목록
  const filteredQueries = filterDifficulty
    ? sampleQueries.filter(q => q.difficulty === filterDifficulty)
    : sampleQueries

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                ← 돌아가기
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Text2Cypher Simulator
                </h1>
                <p className="text-sm text-gray-500">
                  Phase 3 Week 7 - 자연어 → Cypher 쿼리 변환
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 샘플 쿼리 목록 */}
          <div className="space-y-6">
            {/* 난이도 필터 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">🎯 난이도 필터</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterDifficulty(null)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterDifficulty === null
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  전체
                </button>
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilterDifficulty(d)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filterDifficulty === d
                        ? difficultyColors[d]
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {difficultyLabels[d]}
                  </button>
                ))}
              </div>
            </div>

            {/* 샘플 쿼리 목록 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📝 샘플 쿼리</h2>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredQueries.map((query) => (
                  <button
                    key={query.id}
                    onClick={() => handleConvert(query)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedQuery.id === query.id
                        ? 'bg-indigo-100 border-2 border-indigo-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm">{query.naturalLanguage}</span>
                      <span className={`px-2 py-0.5 rounded text-xs whitespace-nowrap ${difficultyColors[query.difficulty]}`}>
                        {difficultyLabels[query.difficulty]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 스키마 정보 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">🗄️ 그래프 스키마</h2>
              <div className="space-y-3">
                {Object.entries(schemaExamples).map(([key, schema]) => (
                  <div key={key} className="text-sm">
                    <h3 className="font-medium text-gray-700">{schema.name}</h3>
                    <div className="mt-1 text-xs text-gray-500">
                      <p>노드: {schema.nodes.join(', ')}</p>
                      <p>관계: {schema.relationships.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 변환 결과 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 자연어 입력 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">💬 자연어 질문</h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <p className="text-lg font-medium text-gray-800">
                  "{selectedQuery.naturalLanguage}"
                </p>
              </div>

              {/* 스키마 정보 */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">사용 스키마:</span>
                {selectedQuery.schema.nodes.map((node) => (
                  <span key={node} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                    :{node}
                  </span>
                ))}
                {selectedQuery.schema.relationships.map((rel) => (
                  <span key={rel} className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                    [{rel}]
                  </span>
                ))}
              </div>
            </div>

            {/* 변환 프로세스 */}
            {isConverting && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
                  <span className="text-gray-600">LLM이 Cypher 쿼리로 변환 중...</span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <p>1. 자연어 파싱 중...</p>
                  <p>2. 의도(Intent) 분석 중...</p>
                  <p>3. 엔티티 매핑 중...</p>
                  <p>4. Cypher 문법 생성 중...</p>
                </div>
              </div>
            )}

            {/* Cypher 결과 */}
            {showCypher && (
              <>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">⚡ 생성된 Cypher 쿼리</h2>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {selectedQuery.cypherQuery}
                    </pre>
                  </div>

                  {/* 복사 버튼 */}
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedQuery.cypherQuery)}
                    className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                  >
                    📋 쿼리 복사
                  </button>
                </div>

                {/* 설명 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">📖 쿼리 설명</h2>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-gray-700">{selectedQuery.explanation}</p>
                  </div>
                </div>
              </>
            )}

            {/* Cypher 문법 가이드 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📚 Text2Cypher 이해하기</h2>
              <div className="prose prose-sm max-w-none">
                <h3>Text2Cypher란?</h3>
                <p>
                  자연어 질문을 Neo4j의 Cypher 쿼리로 자동 변환하는 기술입니다.
                  LLM(Large Language Model)을 활용하여 사용자 의도를 파악하고
                  적절한 쿼리를 생성합니다.
                </p>

                <h3>핵심 기술 요소</h3>
                <ul>
                  <li><strong>Intent Recognition</strong>: 질문의 의도 파악 (검색, 집계, 경로 탐색 등)</li>
                  <li><strong>Entity Extraction</strong>: 노드/관계 타입 및 속성값 추출</li>
                  <li><strong>Schema Mapping</strong>: 추출된 정보를 그래프 스키마에 매핑</li>
                  <li><strong>Query Generation</strong>: Cypher 문법에 맞는 쿼리 생성</li>
                </ul>

                <h3>주요 Cypher 패턴</h3>
                <table className="text-xs">
                  <thead>
                    <tr>
                      <th>패턴</th>
                      <th>Cypher</th>
                      <th>설명</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>노드 검색</td>
                      <td><code>MATCH (n:Label)</code></td>
                      <td>특정 라벨의 노드</td>
                    </tr>
                    <tr>
                      <td>속성 필터</td>
                      <td><code>WHERE n.prop = value</code></td>
                      <td>조건 필터링</td>
                    </tr>
                    <tr>
                      <td>관계 탐색</td>
                      <td><code>(a)-[:REL]-&gt;(b)</code></td>
                      <td>연결된 노드 찾기</td>
                    </tr>
                    <tr>
                      <td>집계</td>
                      <td><code>count(), sum(), avg()</code></td>
                      <td>통계 계산</td>
                    </tr>
                    <tr>
                      <td>경로</td>
                      <td><code>shortestPath()</code></td>
                      <td>최단 경로 탐색</td>
                    </tr>
                  </tbody>
                </table>

                <h3>실무 활용</h3>
                <ul>
                  <li><strong>챗봇</strong>: 데이터베이스 질의를 자연어로</li>
                  <li><strong>BI 도구</strong>: 비개발자도 데이터 탐색 가능</li>
                  <li><strong>지식 그래프</strong>: 복잡한 관계 데이터 질의</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
