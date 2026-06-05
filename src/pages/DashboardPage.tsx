import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, ArrowRight, Trophy, Clock } from 'lucide-react'
import { progressApi } from '@/api/progress'
import { COURSE_COLORS } from '@/types'
import { useAuthStore } from '@/store/authStore'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  const { data: progressList, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: progressApi.list,
  })

  const enrolled = progressList ?? []
  const completed = enrolled.filter(c => c.is_completed)
  const inProgress = enrolled.filter(c => !c.is_completed)

  return (
    <div className="page-container py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-navy-900 mb-1">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-surface-500 font-body">Here's where you left off.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { icon: BookOpen, label: 'Enrolled', value: enrolled.length },
          { icon: Clock, label: 'In progress', value: inProgress.length },
          { icon: Trophy, label: 'Completed', value: completed.length },
          {
            icon: ArrowRight,
            label: 'Avg progress',
            value: enrolled.length
              ? Math.round(enrolled.reduce((a, c) => a + c.progress_percentage, 0) / enrolled.length) + '%'
              : '—',
          },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center gap-2 text-surface-400 mb-2">
              <Icon size={15} />
              <span className="text-xs font-body uppercase tracking-wide">{label}</span>
            </div>
            <div className="font-display text-2xl font-bold text-navy-900">{value}</div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="card h-28 animate-pulse bg-surface-100" />
          ))}
        </div>
      )}

      {!isLoading && enrolled.length === 0 && (
        <div className="card p-10 text-center">
          <BookOpen size={36} className="text-surface-300 mx-auto mb-4" />
          <h3 className="font-display text-lg font-bold text-navy-900 mb-2">No courses yet</h3>
          <p className="text-surface-500 font-body text-sm mb-5">
            Browse our 13 career tracks and enroll in your first course.
          </p>
          <Link to="/" className="btn-primary">Browse courses</Link>
        </div>
      )}

      {/* In progress */}
      {inProgress.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-xl font-bold text-navy-900 mb-4">In progress</h2>
          <div className="space-y-4">
            {inProgress.map(course => {
              const theme = COURSE_COLORS[course.course_slug] ?? COURSE_COLORS['real-estate-foundation']
              return (
                <Link
                  key={course.course_id}
                  to={`/courses/${course.course_slug}/progress`}
                  className="card-hover flex items-center gap-5 p-5 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-display font-bold text-lg"
                    style={{ background: theme.heroGradient }}
                  >
                    {course.course_title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-navy-900 truncate">{course.course_title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="progress-bar flex-1">
                        <div
                          className="progress-fill"
                          style={{ width: `${course.progress_percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-surface-400 font-body whitespace-nowrap">
                        {course.modules_completed}/{course.modules_total} modules
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-surface-300 group-hover:text-surface-500 transition-colors flex-shrink-0"
                  />
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-navy-900 mb-4">Completed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {completed.map(course => {
              const theme = COURSE_COLORS[course.course_slug] ?? COURSE_COLORS['real-estate-foundation']
              return (
                <Link
                  key={course.course_id}
                  to={`/courses/${course.course_slug}/progress`}
                  className="card-hover p-5 flex items-center gap-4 group"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-display font-bold"
                    style={{ background: theme.primary }}
                  >
                    {course.course_title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-navy-900 text-sm truncate">{course.course_title}</p>
                    <p className="text-xs text-emerald-600 font-body mt-0.5 flex items-center gap-1">
                      <Trophy size={11} /> Completed
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
