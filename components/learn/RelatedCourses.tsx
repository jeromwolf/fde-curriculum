import Link from 'next/link'
import { Week, formatDuration } from '@/lib/curriculum'
import { ClockIcon } from './Icons'

interface RelatedCoursesProps {
  courses: Week[]
}

export function RelatedCourses({ courses }: RelatedCoursesProps) {
  if (courses.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">관련 코스</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(course => (
          <Link
            key={course.slug}
            href={`/learn/week/${course.slug}`}
            className="group block p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {course.topics.slice(0, 2).join(', ')}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ClockIcon />
              <span>{formatDuration(course.totalDuration)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
