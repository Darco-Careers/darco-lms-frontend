import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, BookOpen, ClipboardList, CheckCircle, Lock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { coursesApi } from '@/api/courses'
import { progressApi, enrollmentApi } from '@/api/progress'
import { COURSE_COLORS } from '@/types'
import { useState } from 'react'

export default function LessonPage() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const theme = COURSE_COLORS[slug ?? ''] ?? COURSE_COLORS['real-estate-foundation']
  const [upgradeRequired, setUpgradeRequired] = useState(false)

  const { data: lesson, isLoading, isError, error } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => coursesApi.lesson(lessonId!),
    enabled: !!lessonId,
    retry: (failureCount, err: any) => {
      // Don't retry on 403 upgrade_required
      if (err?.response?.status === 403) return false
      return failureCount < 1
    },
  })

  // Detect upgrade_required 403
  const lessonError = error as any
  const is403 = lessonError?.response?.status === 403
  const isUpgradeRequired = is403 && lessonError?.response?.data?.upgrade_required

  const completeMutation = useMutation({
    mutationFn: () => progressApi.completeModule(lesson!.module_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
  })

  const [enrolling, setEnrolling] = useState(false)
  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      const session = await enrollmentApi.createCheckout(slug!)
      if (session.checkout_url) window.location.href = session.checkout_url
    } catch {
      setEnrolling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="page-container py-10 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#BCCAD8] rounded w-1/3" />
          <div className="h-4 bg-[#EEF2F6] rounded" />
          <div className="h-4 bg-[#EEF2F6] rounded w-5/6" />
          <div className="h-48 bg-[#BCCAD8] rounded-xl mt-6" />
        </div>
      </div>
    )
  }

  // ── Upgrade required wall ──────────────────────────────────────────────────
  if (isUpgradeRequired || upgradeRequired) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#C8D4E0]">
        <div className="bg-white rounded-2xl border border-[#BCCAD8] p-8 max-w-md w-full text-center shadow-sm">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: `${theme.pale}` }}
          >
            <Lock size={28} style={{ color: theme.primary }} />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#1A2433] mb-3">
            Module 1 complete — great work!
          </h2>
          <p className="text-[#4A5A6A] font-body text-sm leading-relaxed mb-6">
            You've finished the free preview. Enroll to unlock all remaining modules,
            quizzes, and your certificate of completion.
          </p>
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="w-full py-3.5 rounded-lg font-body font-semibold text-white mb-3 transition-all hover:brightness-110"
            style={{ background: theme.primary }}
          >
            {enrolling ? 'Redirecting to checkout...' : 'Enroll now — unlock everything'}
          </button>
          <Link
            to={`/courses/${slug}`}
            className="block text-sm font-body text-[#8A9AAA] hover:text-[#4A5A6A] transition-colors"
          >
            Back to course overview
          </Link>
          <div className="mt-5 pt-5 border-t border-[#EEF2F6] text-xs font-body text-[#8A9AAA]">
            One-time payment · 3 months access · Certificate included
          </div>
        </div>
      </div>
    )
  }

  if (!lesson) return null

  return (
    <div className="min-h-screen bg-[#C8D4E0]">
      {/* Top nav bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-[#BCCAD8] px-4 py-3">
        <div className="page-container flex items-center justify-between gap-4">
          <Link
            to={`/courses/${slug}/progress`}
            className="flex items-center gap-2 text-[#4A5A6A] hover:text-[#1A2433] text-sm font-body transition-colors"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:block">Back to course</span>
          </Link>

          <div className="flex-1 text-center">
            <p className="text-xs font-body text-[#8A9AAA] truncate">{lesson.title}</p>
          </div>

          <Link
            to={`/courses/${slug}/glossary`}
            className="hidden sm:flex items-center gap-1.5 text-xs font-body font-medium text-[#4A5A6A] hover:text-[#1A2433] transition-colors px-3 py-1.5 rounded-lg border border-[#BCCAD8] hover:bg-[#EEF2F6]"
          >
            <BookOpen size={13} />
            Glossary
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="page-container max-w-3xl mx-auto py-10 px-4">

        {/* YouTube embed */}
        {lesson.youtube_url && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-sm aspect-video">
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
        <article className="prose-darco bg-white rounded-2xl border border-[#BCCAD8] p-8 shadow-sm">
          <ReactMarkdown>{lesson.body}</ReactMarkdown>
        </article>

        {/* End of module CTA */}
        {lesson.next_lesson_id === null && (
          <div
            className="mt-8 p-6 rounded-xl border"
            style={{ background: theme.pale, borderColor: `${theme.primary}25` }}
          >
            <h3 className="font-display font-bold text-[#1A2433] mb-2">Ready for the quiz?</h3>
            <p className="text-[#4A5A6A] font-body text-sm mb-4">
              You've reached the end of this module's lessons. Take the quiz to complete this module.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => completeMutation.mutate()}
                disabled={completeMutation.isPending || completeMutation.isSuccess}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#BCCAD8] bg-white text-sm font-body font-semibold text-[#4A5A6A] hover:bg-[#EEF2F6] transition-all"
              >
                {completeMutation.isSuccess
                  ? <><CheckCircle size={14} className="text-emerald-500" /> Marked complete</>
                  : 'Mark lesson complete'
                }
              </button>
              <Link
                to={`/courses/${slug}/quiz/${lesson.module_id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-body font-semibold text-white text-sm transition-all hover:brightness-110"
                style={{ background: theme.primary }}
              >
                <ClipboardList size={14} />
                Take the quiz
              </Link>
            </div>
          </div>
        )}

        {/* Prev / Next navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#BCCAD8]">
          {lesson.prev_lesson_id ? (
            <Link
              to={`/courses/${slug}/lesson/${lesson.prev_lesson_id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#BCCAD8] bg-white text-sm font-body font-semibold text-[#4A5A6A] hover:bg-[#EEF2F6] transition-all"
            >
              <ArrowLeft size={14} /> Previous
            </Link>
          ) : <div />}

          {lesson.next_lesson_id ? (
            <Link
              to={`/courses/${slug}/lesson/${lesson.next_lesson_id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-body font-semibold text-white text-sm transition-all hover:brightness-110"
              style={{ background: theme.primary }}
            >
              Next lesson <ArrowRight size={14} />
            </Link>
          ) : (
            <Link
              to={`/courses/${slug}/quiz/${lesson.module_id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-body font-semibold text-white text-sm transition-all hover:brightness-110"
              style={{ background: theme.primary }}
            >
              Take the quiz <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
