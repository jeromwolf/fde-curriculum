import Link from 'next/link'
import { PlayIcon, DocumentIcon, CodeIcon, QuizIcon, TrophyIcon } from './Icons'
import { getPhaseColors } from './constants'

interface CourseSidebarProps {
  phase: number
  practice: string
  contentCounts: Record<string, number>
}

export function CourseSidebar({ phase, practice, contentCounts }: CourseSidebarProps) {
  const colors = getPhaseColors(phase)

  return (
    <div className="space-y-8">
      {/* Course Includes */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">이 코스 포함 내용</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-gray-700">
            <span style={{ color: colors.primary }}><PlayIcon /></span>
            <span>{contentCounts.video || 0}개 영상 강의</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <span style={{ color: colors.primary }}><DocumentIcon /></span>
            <span>{contentCounts.reading || 0}개 읽기 자료</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <span style={{ color: colors.primary }}><CodeIcon /></span>
            <span>{contentCounts.code || 0}개 코드 실습</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <span style={{ color: colors.primary }}><QuizIcon /></span>
            <span>{contentCounts.quiz || 0}개 퀴즈</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <span className="text-amber-500"><TrophyIcon /></span>
            <span>{contentCounts.challenge || 0}개 챌린지</span>
          </li>
        </ul>
      </div>

      {/* Weekly Project */}
      <div
        className="rounded-xl p-6 border-2"
        style={{ borderColor: colors.primary, backgroundColor: colors.light }}
      >
        <h3 className="font-bold text-gray-900 mb-2">Weekly Project</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          {practice}
        </p>
      </div>

      {/* Support */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">도움이 필요하신가요?</h3>
        <p className="text-sm text-gray-600 mb-4">
          학습 중 질문이 있으시면 커뮤니티에서 도움을 받으세요.
        </p>
        <Link
          href="#"
          className="text-sm font-medium hover:underline"
          style={{ color: colors.primary }}
        >
          커뮤니티 바로가기 →
        </Link>
      </div>
    </div>
  )
}
