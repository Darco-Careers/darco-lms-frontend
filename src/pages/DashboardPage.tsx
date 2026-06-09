import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BookOpen, ArrowRight, Trophy, Clock, X, Eye } from 'lucide-react'
import { progressApi, cancelPreviewApi } from '@/api/progress'
import { COURSE_COLORS } from '@/types'
import { useAuthStore } from '@/store/authStore'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [cancelError, setCancelError] = useState<string | null>(null)

  const { data: progressList, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: progressApi.list,
  })

  const enrolled = progressList ?? []
  const completed = enrolled.filter(c => c.is_completed)
  const inProgress = enrolled.filter(c => !c.is_completed)
  const freePreviews = inProgress.filter(c => c.enrollment_status === 'free_preview')
  const paidInProgress = inProgress.filter(c => c.enrollment_status !== 'free_preview')

  const handleCancelPreview = async (enrollmentId: string, courseTitle: string) => {
    if (!confirm(`Cancel your free preview of "${courseTitle}"? You can start a new free preview on any other course after cancelling.`)) return
    setCancellingId(enrollmentId)
    setCancelError(null)
    try {
      await cancelPreviewApi.cancel(enrollmentId)
      await queryClient.invalidateQueries({ queryKey: ['progress'] })
    } catch (err: any) {
      setCancelError(err?.response?.data?.error || 'Failed to cancel. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

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

      {cancelError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3 font-body text-sm text-red-600">
          {cancelError}
        </div>
      )}

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
            Browse our career tracks and enroll in your first course.
          </p>
          <Link to="/" className="btn-primary">Browse courses</Link>
        </div>
      )}

      {/* Free Previews */}
      {freePreviews.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={16} className="text-[#C9A84C]" />
            <h2 className="font-display text-xl font-bold text-navy-900">Free Preview</h2>
            <span className="text-xs font-body text-[#8A9AAA] bg-[#EEF2F6] px-2 py-0.5 rounded-full">
              1 active at a time
            </span>
          </div>
          <div className="space-y-4">
            {freePreviews.map(course => {
              const theme = COURSE_COLORS[course.course_slug] ?? COURSE_COLORS['real-estate-foundation']
              const isCancelling = cancellingId === course.enrollment_id
              return (
                <div key={course.course_id} className="card flex items-center gap-5 p-5">
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-display font-bold text-lg"
                    style={{ background: theme.heroGradient }}
                  >
                    {course.course_title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-body font-semibold text-navy-900 truncate">{course.course_title}</p>
                      <span className="text-[10px] font-body font-semibold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0">
                        Free Preview
                      </span>
                    </div>
                    <p className="text-xs text-surface-400 font-body mt-0.5">
                      Module 1 unlocked — explore the content before committing
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/courses/${course.course_slug}`}
                      className="font-body font-semibold text-xs px-3 py-1.5 rounded-lg text-[#1E2A38] bg-[#C9A84C] hover:brightness-110 transition-all"
                    >
                      Continue
                    </Link>
                    <button
                      onClick={() => course.enrollment_id && handleCancelPreview(course.enrollment_id, course.course_title)}
                      disabled={isCancelling}
                      title="Cancel free preview"
                      className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {isCancelling
                        ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                        : <X size={16} />
                      }
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Paid courses in progress */}
      {paidInProgress.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-xl font-bold text-navy-900 mb-4">In progress</h2>
          <div className="space-y-4">
            {paidInProgress.map(course => {
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
