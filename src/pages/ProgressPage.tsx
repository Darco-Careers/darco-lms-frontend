import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Lock, PlayCircle, ClipboardList, BookOpen, ArrowRight } from 'lucide-react'
import { progressApi } from '@/api/progress'
import { coursesApi } from '@/api/courses'
import { COURSE_COLORS } from '@/types'
import clsx from 'clsx'

export default function ProgressPage() {
  const { slug } = useParams<{ slug: string }>()
  const theme = COURSE_COLORS[slug ?? ''] ?? COURSE_COLORS['real-estate-foundation']

  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress', slug],
    queryFn: () => progressApi.detail(slug!),
    enabled: !!slug,
  })

  const { data: modules } = useQuery({
    queryKey: ['modules', slug],
    queryFn: () => coursesApi.modules(slug!),
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <div className="page-container py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-200 rounded w-1/3" />
          <div className="h-3 bg-surface-100 rounded" />
          {[1,2,3].map(i => <div key={i} className="h-20 bg-surface-200 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!progress) return null

  return (
    <div className="page-container py-10 max-w-3xl">
      {/* Course header */}
      <div className="mb-8">
        <Link
          to={`/courses/${slug}`}
          className="text-sm font-body text-surface-400 hover:text-surface-600 mb-3 inline-flex items-center gap-1"
        >
          ← Course overview
        </Link>
        <h1 className="font-display text-2xl font-bold text-navy-900 mb-4">{progress.course_title}</h1>

        {/* Overall progress bar */}
        <div className="flex items-center gap-4">
          <div className="progress-bar flex-1">
            <div
              className="progress-fill"
              style={{ width: `${progress.progress_percentage}%`, background: theme.primary }}
            />
          </div>
          <span className="text-sm font-body font-semibold text-surface-600 whitespace-nowrap">
            {progress.progress_percentage}% complete
          </span>
        </div>

        {progress.is_completed && (
          <div className="mt-4 flex items-center gap-2 text-emerald-600 font-body font-semibold">
            <CheckCircle size={18} />
            Course complete!{' '}
            <Link to={`/courses/${slug}/progress`} className="underline text-sm">
              View certificate
            </Link>
          </div>
        )}
      </div>

      {/* Sidebar links */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          to={`/courses/${slug}/glossary`}
          className="btn-secondary text-sm py-2 px-4"
        >
          <BookOpen size={14} />
          Glossary
        </Link>
      </div>

      {/* Module list */}
      <div className="space-y-3">
        {(modules ?? []).map((mod, idx) => {
          const progressMod = progress.modules.find(m => m.id === mod.id)
          const isCompleted = progressMod?.is_completed ?? false
          const quizScore = progressMod?.quiz_score ?? null
          const firstLesson = progressMod?.lessons?.[0]

          return (
            <div
              key={mod.id}
              className={clsx(
                'card overflow-hidden transition-all duration-200',
                isCompleted && 'border-emerald-200'
              )}
            >
              {/* Module header */}
              <div className="flex items-center gap-4 p-4">
                <div
                  className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0',
                    isCompleted ? 'bg-emerald-100 text-emerald-700' : 'text-white'
                  )}
                  style={isCompleted ? {} : { background: theme.primary }}
                >
                  {isCompleted ? <CheckCircle size={18} /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-navy-900 text-sm">{mod.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-surface-400 font-body">
                      {mod.lessons_count} lessons
                    </span>
                    {quizScore !== null && (
                      <span
                        className={clsx(
                          'text-xs font-semibold font-body px-2 py-0.5 rounded-full',
                          quizScore >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                        )}
                      >
                        Quiz: {quizScore}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {firstLesson && (
                    <Link
                      to={`/courses/${slug}/lesson/${firstLesson.id}`}
                      className="flex items-center gap-1.5 text-xs font-body font-semibold transition-colors"
                      style={{ color: theme.primary }}
                    >
                      <PlayCircle size={15} />
                      <span className="hidden sm:block">{isCompleted ? 'Review' : 'Start'}</span>
                    </Link>
                  )}
                  <Link
                    to={`/courses/${slug}/quiz/${mod.id}`}
                    className="flex items-center gap-1.5 text-xs font-body font-semibold text-surface-400 hover:text-surface-600 transition-colors"
                  >
                    <ClipboardList size={15} />
                    <span className="hidden sm:block">Quiz</span>
                  </Link>
                </div>
              </div>

              {/* Lesson list (collapsed by default, shown when in progress) */}
              {!isCompleted && progressMod?.lessons && progressMod.lessons.length > 0 && (
                <div className="border-t border-surface-100 divide-y divide-surface-100">
                  {progressMod.lessons.map(lesson => (
                    <Link
                      key={lesson.id}
                      to={`/courses/${slug}/lesson/${lesson.id}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 transition-colors"
                    >
                      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        {lesson.is_completed
                          ? <CheckCircle size={14} className="text-emerald-500" />
                          : <div className="w-1.5 h-1.5 rounded-full bg-surface-300" />
                        }
                      </div>
                      <span className="text-sm font-body text-surface-600 flex-1">{lesson.title}</span>
                      <ArrowRight size={13} className="text-surface-300" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
