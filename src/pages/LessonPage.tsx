import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, BookOpen, ClipboardList, CheckCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { coursesApi } from '@/api/courses'
import { progressApi } from '@/api/progress'
import { COURSE_COLORS } from '@/types'

export default function LessonPage() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const theme = COURSE_COLORS[slug ?? ''] ?? COURSE_COLORS['real-estate-foundation']

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => coursesApi.lesson(Number(lessonId)),
    enabled: !!lessonId,
  })

  const completeMutation = useMutation({
    mutationFn: () => progressApi.completeModule(lesson!.module_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
  })

  if (isLoading) {
    return (
      <div className="page-container py-10 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-200 rounded w-1/3" />
          <div className="h-4 bg-surface-100 rounded" />
          <div className="h-4 bg-surface-100 rounded w-5/6" />
          <div className="h-48 bg-surface-200 rounded-xl mt-6" />
        </div>
      </div>
    )
  }

  if (!lesson) return null

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top nav bar */}
      <div
        className="sticky top-16 z-40 border-b border-surface-200 bg-white px-4 py-3"
      >
        <div className="page-container flex items-center justify-between gap-4">
          <Link
            to={`/courses/${slug}/progress`}
            className="flex items-center gap-2 text-surface-500 hover:text-surface-700 text-sm font-body transition-colors"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:block">Back to course</span>
          </Link>

          <div className="flex-1 text-center">
            <p className="text-xs font-body text-surface-400 truncate">{lesson.title}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/courses/${slug}/glossary`}
              className="btn-ghost text-xs py-1.5 px-3 hidden sm:flex"
            >
              <BookOpen size={14} />
              Glossary
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-container max-w-3xl mx-auto py-10 px-4">

        {/* YouTube embed */}
        {lesson.youtube_url && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-card aspect-video">
            <iframe
              src={lesson.youtube_url}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* Lesson body */}
        <article className="prose-darco">
          <ReactMarkdown>{lesson.body}</ReactMarkdown>
        </article>

        {/* Complete module CTA */}
        {lesson.next_lesson_id === null && (
          <div
            className="mt-10 p-6 rounded-xl border"
            style={{ background: `${theme.pale}`, borderColor: `${theme.light}40` }}
          >
            <h3 className="font-display font-bold text-navy-900 mb-2">Ready for the quiz?</h3>
            <p className="text-surface-500 font-body text-sm mb-4">
              You've reached the end of this module's lesson. Take the quiz to complete this module.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => completeMutation.mutate()}
                disabled={completeMutation.isPending || completeMutation.isSuccess}
                className="btn-secondary text-sm py-2"
              >
                {completeMutation.isSuccess ? (
                  <><CheckCircle size={15} className="text-emerald-500" /> Marked complete</>
                ) : (
                  'Mark lesson complete'
                )}
              </button>
              <Link
                to={`/courses/${slug}/quiz/${lesson.module_id}`}
                className="btn-primary text-sm py-2"
                style={{ background: theme.primary }}
              >
                <ClipboardList size={15} />
                Take the quiz
              </Link>
            </div>
          </div>
        )}

        {/* Prev / Next navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-surface-200">
          {lesson.prev_lesson_id ? (
            <Link
              to={`/courses/${slug}/lesson/${lesson.prev_lesson_id}`}
              className="btn-secondary text-sm py-2"
            >
              <ArrowLeft size={15} />
              Previous
            </Link>
          ) : <div />}

          {lesson.next_lesson_id ? (
            <Link
              to={`/courses/${slug}/lesson/${lesson.next_lesson_id}`}
              className="btn-primary text-sm py-2"
              style={{ background: theme.primary }}
            >
              Next lesson
              <ArrowRight size={15} />
            </Link>
          ) : (
            <Link
              to={`/courses/${slug}/quiz/${lesson.module_id}`}
              className="btn-primary text-sm py-2"
              style={{ background: theme.primary }}
            >
              Take the quiz
              <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
