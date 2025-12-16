import { CheckCircleIcon } from './Icons'
import { getPhaseColors } from './constants'

interface LearningObjectivesProps {
  topics: string[]
  phase: number
}

export function LearningObjectives({ topics, phase }: LearningObjectivesProps) {
  const colors = getPhaseColors(phase)

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-6">학습 목표</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <span style={{ color: colors.primary }}>
              <CheckCircleIcon />
            </span>
            <span className="text-gray-700">{topic}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
