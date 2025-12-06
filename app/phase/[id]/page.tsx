import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const phaseInfo: Record<string, { title: string; color: string }> = {
  '1': { title: '데이터 엔지니어링 기초', color: 'blue' },
  '2': { title: '데이터 분석 & 컨설팅', color: 'teal' },
  '3': { title: '지식 그래프', color: 'purple' },
  '4': { title: '클라우드 & DevOps', color: 'green' },
  '5': { title: 'Generative AI', color: 'orange' },
  '6': { title: '산업별 프로젝트 & 취업', color: 'red' },
}

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ]
}

export default async function PhasePage({ params }: { params: { id: string } }) {
  const { id } = params
  const info = phaseInfo[id]

  if (!info) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Phase를 찾을 수 없습니다</h1>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  const filePath = path.join(process.cwd(), 'docs', `PHASE${id}_DETAILED.md`)
  let content = ''

  try {
    content = fs.readFileSync(filePath, 'utf-8')
  } catch {
    content = `# Phase ${id} 상세 커리큘럼\n\n준비 중입니다.`
  }

  const colorClasses: Record<string, string> = {
    blue: 'from-blue-600 to-blue-700',
    teal: 'from-teal-600 to-teal-700',
    purple: 'from-purple-600 to-purple-700',
    green: 'from-green-600 to-green-700',
    orange: 'from-orange-600 to-orange-700',
    red: 'from-red-600 to-red-700',
  }

  return (
    <div className="min-h-screen bg-white">
      <header className={`bg-gradient-to-r ${colorClasses[info.color]} text-white`}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            커리큘럼 홈
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">Phase {id}</span>
          </div>
          <h1 className="text-3xl font-bold mt-2">{info.title}</h1>
        </div>
      </header>

      <nav className="sticky top-0 bg-white border-b shadow-sm z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {Object.entries(phaseInfo).map(([phaseId, phaseData]) => (
            <Link
              key={phaseId}
              href={`/phase/${phaseId}`}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                phaseId === id
                  ? `bg-${phaseData.color}-100 text-${phaseData.color}-700 font-bold`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Phase {phaseId}
            </Link>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <article className="prose prose-lg max-w-none
          prose-headings:text-gray-900
          prose-p:text-gray-700
          prose-li:text-gray-700
          prose-strong:text-gray-900
          prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-pre:rounded-xl prose-pre:border prose-pre:border-gray-200 prose-pre:p-4
          [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm [&_pre_code]:text-gray-800
          [&_:not(pre)>code]:bg-gray-100 [&_:not(pre)>code]:text-gray-800 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded [&_:not(pre)>code]:text-sm
          prose-table:text-sm prose-table:border prose-table:border-gray-300
          prose-th:bg-gray-100 prose-th:px-4 prose-th:py-2 prose-th:border prose-th:border-gray-300 prose-th:text-left prose-th:font-semibold
          prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-gray-300
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-ul:list-disc prose-ol:list-decimal
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic
          prose-hr:border-gray-300
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      </main>

      <footer className="border-t bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">
            FDE Academy 커리큘럼
          </Link>
          {' '} | Phase {id}: {info.title}
        </div>
      </footer>
    </div>
  )
}
