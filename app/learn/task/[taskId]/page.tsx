'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useRef, useState } from 'react'
import {
  getTaskById,
  getNextTask,
  getPrevTask,
  getTaskProgress,
  taskTypeIcons,
  taskTypeColors,
  type TaskContent,
  type QuizQuestion,
} from '@/lib/curriculum'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useProgress } from '@/lib/useProgress'

// FDE Logo
const FDELogo = ({ size = 32 }: { size?: number }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
    <rect x="5" y="5" width="90" height="90" rx="16" fill="#03EF62" />
    <g fill="#0a0a0a">
      <path d="M25 22 L25 78 L35 78 L35 55 L55 55 L55 45 L35 45 L35 32 L58 32 L58 22 Z" />
      <path d="M52 50 L72 50 L64 42 L68 42 L78 51 L68 60 L64 60 L72 52 L52 52 Z" opacity="0.7" />
    </g>
  </svg>
)

export default function TaskPage() {
  const params = useParams()
  const taskId = params.taskId as string
  const contentRef = useRef<HTMLDivElement>(null)
  const [isPdfGenerating, setIsPdfGenerating] = useState(false)

  const taskInfo = getTaskById(taskId)
  const weekSlug = taskInfo?.week.slug || ''

  const { isTaskComplete, toggleTaskComplete, loading } = useProgress(weekSlug)
  const completed = isTaskComplete(taskId)

  const handleToggleComplete = async () => {
    await toggleTaskComplete(taskId, weekSlug)
  }
  const prevTask = getPrevTask(taskId)
  const nextTask = getNextTask(taskId)
  const progress = getTaskProgress(taskId)

  // PDF 다운로드 함수
  const handleDownloadPDF = async () => {
    if (!contentRef.current || !taskInfo) return

    setIsPdfGenerating(true)
    try {
      // html2pdf.js는 클라이언트에서만 동작
      const html2pdf = (await import('html2pdf.js')).default

      const element = contentRef.current
      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `${taskInfo.task.title.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: {
          unit: 'mm' as const,
          format: 'a4' as const,
          orientation: 'portrait' as const
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as const }
      }

      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('PDF 생성 오류:', error)
      alert('PDF 생성 중 오류가 발생했습니다.')
    } finally {
      setIsPdfGenerating(false)
    }
  }

  if (!taskInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">태스크를 찾을 수 없습니다</h1>
          <Link href="/curriculum" className="text-[#03EF62] hover:underline">
            커리큘럼으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  const { task, week, day, dayIndex } = taskInfo

  const content = task.content

  // 학습 목표 렌더링
  const renderObjectives = () => {
    if (!content?.objectives?.length) return null
    return (
      <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 mb-6">
        <h3 className="text-purple-800 font-bold mb-2">🎯 학습 목표</h3>
        <ul className="text-purple-700 text-sm space-y-1">
          {content.objectives.map((obj, i) => (
            <li key={i}>• {obj}</li>
          ))}
        </ul>
      </div>
    )
  }

  // 핵심 포인트 렌더링
  const renderKeyPoints = () => {
    if (!content?.keyPoints?.length) return null
    return (
      <div className="bg-green-50 p-4 rounded-xl border border-green-200 mt-6">
        <h3 className="text-green-800 font-bold mb-2">✅ 핵심 포인트</h3>
        <ul className="text-green-700 text-sm space-y-1">
          {content.keyPoints.map((point, i) => (
            <li key={i}>• {point}</li>
          ))}
        </ul>
      </div>
    )
  }

  // 외부 링크 렌더링
  const renderExternalLinks = () => {
    if (!content?.externalLinks?.length) return null
    return (
      <div className="bg-gray-50 p-4 rounded-xl border mt-6">
        <h4 className="font-bold mb-2">📚 추가 자료</h4>
        <ul className="text-sm space-y-1">
          {content.externalLinks.map((link, i) => (
            <li key={i}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {link.title} →
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // 태스크 유형별 컨텐츠 렌더링
  const renderContent = () => {
    switch (task.type) {
      case 'video':
        return (
          <div className="space-y-6">
            {renderObjectives()}
            {/* 영상 플레이어 */}
            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">▶️</div>
                <p className="text-lg">영상 플레이어</p>
                <p className="text-sm text-gray-400 mt-2">{task.duration}분</p>
              </div>
            </div>
            {/* 영상 스크립트 (마크다운) */}
            {content?.transcript && (
              <div className="prose prose-sm max-w-none bg-gray-50 p-6 rounded-xl border">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.transcript}
                </ReactMarkdown>
              </div>
            )}
            {renderKeyPoints()}
          </div>
        )

      case 'reading':
        return (
          <div className="space-y-6">
            {renderObjectives()}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h3 className="text-blue-800 font-bold mb-2">📖 읽기 자료</h3>
              <p className="text-blue-700 text-sm">
                예상 소요 시간: {task.duration}분
              </p>
            </div>
            {/* 마크다운 콘텐츠 */}
            {content?.markdown ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.markdown}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-xl border">
                <p className="text-gray-600">문서 내용이 준비 중입니다...</p>
              </div>
            )}
            {renderExternalLinks()}
            {renderKeyPoints()}
          </div>
        )

      case 'code':
        return (
          <div className="space-y-6">
            {renderObjectives()}
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <h3 className="text-green-800 font-bold mb-2">💻 코드 실습</h3>
              <p className="text-green-700 text-sm">
                아래 에디터에서 코드를 작성하고 실행해보세요.
              </p>
            </div>
            {/* 실습 지시사항 */}
            {content?.instructions && (
              <div className="prose prose-sm max-w-none bg-blue-50 p-4 rounded-xl border border-blue-200">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.instructions}
                </ReactMarkdown>
              </div>
            )}
            {/* 시작 코드 */}
            <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm overflow-x-auto">
              <div className="text-gray-400 mb-2 text-xs">// 시작 코드</div>
              <pre className="text-green-400 whitespace-pre-wrap">
                {content?.starterCode || `// ${task.title}\n// 여기에 코드를 작성하세요`}
              </pre>
            </div>
            {/* 힌트 */}
            {content?.hints && content.hints.length > 0 && (
              <details className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <summary className="text-yellow-800 font-bold cursor-pointer">💡 힌트 보기</summary>
                <ul className="text-yellow-700 text-sm mt-2 space-y-1">
                  {content.hints.map((hint, i) => (
                    <li key={i}>• {hint}</li>
                  ))}
                </ul>
              </details>
            )}
            {/* 정답 코드 (접기) */}
            {content?.solutionCode && (
              <details className="bg-gray-100 rounded-xl border">
                <summary className="p-4 font-bold cursor-pointer">📝 정답 보기</summary>
                <div className="bg-gray-900 rounded-b-xl p-6 font-mono text-sm overflow-x-auto">
                  <pre className="text-green-400 whitespace-pre-wrap">{content.solutionCode}</pre>
                </div>
              </details>
            )}
          </div>
        )

      case 'quiz':
        const questions = content?.questions || []
        return (
          <div className="space-y-6">
            {renderObjectives()}
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <h3 className="text-yellow-800 font-bold mb-2">📝 퀴즈</h3>
              <p className="text-yellow-700 text-sm">
                학습한 내용을 확인하는 퀴즈입니다. ({questions.length}문제)
              </p>
            </div>
            <div className="space-y-4">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-white p-6 rounded-xl border border-gray-200">
                  <p className="font-medium mb-4">Q{qIndex + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => (
                      <label key={optIndex} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#03EF62] cursor-pointer transition">
                        <input type="radio" name={`q${qIndex}`} className="w-4 h-4 text-[#03EF62]" />
                        <span>{String.fromCharCode(65 + optIndex)}. {opt}</span>
                      </label>
                    ))}
                  </div>
                  {q.explanation && (
                    <details className="mt-4 bg-blue-50 p-3 rounded-lg">
                      <summary className="text-blue-800 text-sm cursor-pointer">정답 및 해설 보기</summary>
                      <p className="text-blue-700 text-sm mt-2">
                        <strong>정답: {String.fromCharCode(65 + q.answer)}</strong><br/>
                        {q.explanation}
                      </p>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 'challenge':
        return (
          <div className="space-y-6">
            {renderObjectives()}
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <h3 className="text-orange-800 font-bold mb-2">🏆 Challenge</h3>
              <p className="text-orange-700 text-sm">
                배운 내용을 종합하는 도전 과제입니다.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg mb-4">{task.title}</h4>
              {task.description && <p className="text-gray-600 mb-4">{task.description}</p>}
            </div>
            {/* 요구사항 */}
            {content?.requirements && content.requirements.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="text-blue-800 font-bold mb-2">📋 요구사항</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  {content.requirements.map((req, i) => (
                    <li key={i}>• {req}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* 평가 기준 */}
            {content?.evaluationCriteria && content.evaluationCriteria.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <h4 className="text-purple-800 font-bold mb-2">📊 평가 기준</h4>
                <ul className="text-purple-700 text-sm space-y-1">
                  {content.evaluationCriteria.map((crit, i) => (
                    <li key={i}>• {crit}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* 보너스 포인트 */}
            {content?.bonusPoints && content.bonusPoints.length > 0 && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h4 className="text-green-800 font-bold mb-2">⭐ 보너스 포인트</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  {content.bonusPoints.map((bonus, i) => (
                    <li key={i}>• {bonus}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* 상세 지시사항 */}
            {content?.instructions && (
              <div className="prose prose-sm max-w-none bg-gray-50 p-6 rounded-xl border">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.instructions}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )

      case 'project':
        return (
          <div className="space-y-6">
            {renderObjectives()}
            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <h3 className="text-red-800 font-bold mb-2">🚀 Weekly Project</h3>
              <p className="text-red-700 text-sm">
                이번 주 학습 내용을 종합하는 프로젝트입니다.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg mb-4">{task.title}</h4>
              {task.description && <p className="text-gray-600 mb-4">{task.description}</p>}
            </div>
            {content?.instructions && (
              <div className="prose prose-sm max-w-none bg-gray-50 p-6 rounded-xl border">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.instructions}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )

      default:
        return <div>Unknown task type</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <FDELogo size={32} />
            </Link>
            <span className="text-gray-300">/</span>
            <Link href={`/learn/week/${week.slug}`} className="text-gray-500 hover:text-gray-900 transition text-sm">
              {week.title}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 text-sm">Day {dayIndex + 1}</span>
          </div>
          <div className="flex items-center gap-2">
            {progress && (
              <span className="text-sm text-gray-500">
                {progress.current} / {progress.total}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-[#03EF62] transition-all duration-300"
          style={{ width: progress ? `${(progress.current / progress.total) * 100}%` : '0%' }}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {taskTypeIcons[task.type] && (
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${taskTypeColors[task.type]}`}>
                {taskTypeIcons[task.type]}
              </span>
            )}
            <span className="text-sm text-gray-500">{task.duration}분</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
          <p className="text-gray-600">{day.title}</p>
        </div>

        {/* Content */}
        <div ref={contentRef} className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 print:shadow-none print:border-none">
          {/* PDF용 헤더 (화면에서는 숨김) */}
          <div className="hidden print:block mb-6 pb-4 border-b">
            <h1 className="text-xl font-bold">{task.title}</h1>
            <p className="text-sm text-gray-500">{week.title} &gt; {day.title}</p>
          </div>
          {renderContent()}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={handleDownloadPDF}
            disabled={isPdfGenerating}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPdfGenerating ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                PDF 생성 중...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF 저장
              </>
            )}
          </button>
          <button
            onClick={handleToggleComplete}
            className={`px-8 py-3 rounded-xl font-semibold transition ${
              completed
                ? 'bg-[#03EF62] text-gray-900'
                : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            {completed ? '✓ 완료됨' : '완료 표시'}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {prevTask ? (
            <Link
              href={`/learn/task/${prevTask.task.id}`}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전
            </Link>
          ) : (
            <div />
          )}

          {nextTask ? (
            <Link
              href={`/learn/task/${nextTask.task.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-[#03EF62] text-gray-900 rounded-xl font-medium hover:bg-[#00D956] transition"
            >
              다음
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <Link
              href={`/learn/week/${week.slug}`}
              className="flex items-center gap-2 px-6 py-3 bg-[#03EF62] text-gray-900 rounded-xl font-medium hover:bg-[#00D956] transition"
            >
              Week 완료! 🎉
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
