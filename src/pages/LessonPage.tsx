import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, BookOpen, ClipboardList, CheckCircle, Lock, Tag } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { coursesApi } from '@/api/courses'
import { progressApi, enrollmentApi } from '@/api/progress'
import { COURSE_COLORS } from '@/types'
import { useState, useEffect } from 'react'

export default function LessonPage() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const theme = COURSE_COLORS[slug ?? ''] ?? COURSE_COLORS['real-estate-foundation']
  const [upgradeRequired, setUpgradeRequired] = useState(false)

  // Promo code state (shared between both paywall screens)
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [enrolling, setEnrolling] = useState(false)

  // Fix #1 — scroll to top whenever the lesson changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [lessonId])

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

  // Detect upgrade_required 403 (free preview limit) vs not_enrolled 403.
  // The custom DRF exception handler wraps the original response data inside
  // a "detail" field: { error, code, status, detail: { upgrade_required, ... } }
  // So we must check both the top-level and the nested detail field.
  const lessonError = error as any
  const is403 = lessonError?.response?.status === 403
  const errData = lessonError?.response?.data ?? {}
  const isUpgradeRequired = is403 && (
    errData?.upgrade_required ||
    errData?.detail?.upgrade_required
  )
  const isNotEnrolled = is403 && !isUpgradeRequired

  const completeMutation = useMutation({
    mutationFn: () => progressApi.completeLesson(lesson!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
  })

  const handleEnroll = async (code?: string) => {
    setEnrolling(true)
    setPromoError('')
    try {
      const session = await enrollmentApi.createCheckout(slug!, code?.trim().toUpperCase() || undefined)
      if (session.enrolled) {
        // Already enrolled or 100% off promo — go to progress page
        navigate(`/courses/${slug}/progress`)
        return
      }
      if (session.checkout_url) window.location.href = session.checkout_url
    } catch (err: any) {
      // If already enrolled, redirect to progress page
      if (err?.response?.status === 409) {
        navigate(`/courses/${slug}/progress`)
        return
      }
      // Show promo code error inline
      const msg = err?.response?.data?.error || err?.response?.data?.detail?.error || ''
      if (msg && code) {
        setPromoError(msg)
      }
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

  // ── Shared promo code block ────────────────────────────────────────────────
  const PromoCodeBlock = () => (
    <div className="mt-4 pt-4 border-t border-[#EEF2F6]">
      <p className="text-xs font-body text-[#8A9AAA] mb-2 flex items-center gap-1">
        <Tag size={11} />
        Have a promo code?
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError('') }}
          placeholder="Enter code"
          className="flex-1 px-3 py-2 rounded-lg border border-[#BCCAD8] bg-[#F8FAFC] text-sm font-body text-[#1A2433] placeholder-[#BCCAD8] focus:outline-none focus:border-[#4A5A6A] transition-colors"
        />
        <button
          onClick={() => handleEnroll(promoCode)}
          disabled={enrolling || !promoCode.trim()}
          className="px-4 py-2 rounded-lg font-body font-semibold text-white text-sm transition-all hover:brightness-110 disabled:opacity-50"
          style={{ background: theme.primary }}
        >
          {enrolling ? '...' : 'Apply'}
        </button>
      </div>
      {promoError && (
        <p className="mt-2 text-xs font-body text-red-500">{promoError}</p>
      )}
    </div>
  )

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
            onClick={() => handleEnroll()}
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
          <PromoCodeBlock />
        </div>
      </div>
    )
  }

  // ── Not enrolled wall ─────────────────────────────────────────────────────
  if (isNotEnrolled) {
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
            Enroll to access this lesson
          </h2>
          <p className="text-[#4A5A6A] font-body text-sm leading-relaxed mb-6">
            This lesson is part of a paid course. Enroll to unlock all modules,
            quizzes, and your certificate of completion.
          </p>
          <button
            onClick={() => handleEnroll()}
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
          <PromoCodeBlock />
        </div>
      </div>
    )
  }

  if (isError && !isUpgradeRequired && !isNotEnrolled) {
    return (
      <div className="min-h-screen bg-[#C8D4E0] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-display text-xl font-bold text-[#1A2433] mb-2">Couldn't load this lesson</h2>
          <p className="text-[#4A5A6A] font-body text-sm mb-6">There was a problem loading this lesson. Please try refreshing or go back to the course.</p>
          <Link to={`/courses/${slug}/progress`} className="flex items-center gap-2 justify-center px-4 py-2 rounded-lg border border-[#BCCAD8] bg-white text-sm font-body font-semibold text-[#4A5A6A] hover:bg-[#EEF2F6] transition-all">
            <ArrowLeft size={14} />
            Back to course
          </Link>
        </div>
      </div>
    )
  }

  if (!lesson) return null

  // Fix #2 — derive lesson progress for the nav bar indicator
  const lessonPos = lesson.lesson_position ?? lesson.sequence_order
  const lessonTotal = lesson.lesson_total ?? null
  const progressPct = lessonTotal && lessonTotal > 0 ? Math.round((lessonPos / lessonTotal) * 100) : null

  // Fix #3 — quiz route must use module_id, not quiz_id
  // The QuizPage calls /student/modules/<id>/quiz/ so it needs the module UUID
  const quizRouteId = lesson.module_id

  // Fix #4 — detect when next module is locked for free preview students
  // When next_lesson_id is null AND next_module_lesson_id is null AND quiz_id is null
  // it means we're at the end of the last free module — show enroll CTA
  const isEndOfFreePreview =
    lesson.next_lesson_id === null &&
    lesson.next_module_lesson_id === null &&
    lesson.quiz_id === null

  return (
    <div className="min-h-screen bg-[#C8D4E0]">
      {/* Fix #2 — sticky nav bar with lesson progress indicator */}
      <div className="sticky top-16 z-40 bg-white border-b border-[#BCCAD8]">
        <div className="page-container flex items-center justify-between gap-4 px-4 py-3">
          <Link
            to={`/courses/${slug}/progress`}
            className="flex items-center gap-2 text-[#4A5A6A] hover:text-[#1A2433] text-sm font-body transition-colors"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:block">Back to course</span>
          </Link>

          <div className="flex-1 text-center min-w-0">
            <p className="text-xs font-body text-[#8A9AAA] truncate">
              {lesson.module_title ? `${lesson.module_title}` : lesson.title}
            </p>
            {progressPct !== null && (
              <div className="mt-1.5 flex items-center gap-2 justify-center">
                <div className="w-32 sm:w-48 h-1.5 bg-[#EEF2F6] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%`, background: theme.primary }}
                  />
                </div>
                <span className="text-[10px] font-body text-[#8A9AAA] whitespace-nowrap">
                  {lessonPos}/{lessonTotal}
                </span>
              </div>
            )}
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

      {/* Content — full-width for HTML lessons, constrained card for Markdown */}
      <div className={lesson.content_type === 'html' ? '' : 'page-container max-w-3xl mx-auto py-10 px-4'}>

        {/* YouTube embed — only for non-HTML lessons (HTML lessons embed video inside the body) */}
        {lesson.youtube_url && lesson.content_type !== 'html' && (
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
        <article className={lesson.content_type === 'html'
          ? 'lesson-fullbleed'
          : 'prose-darco bg-white rounded-2xl border border-[#BCCAD8] shadow-sm overflow-hidden'}>
          {lesson.content_type === 'html' ? (
            // Rich HTML content from original site — rendered with full CSS
            <div
              className="lesson-html-body"
              dangerouslySetInnerHTML={{ __html: lesson.body }}
            />
          ) : (
            // Plain Markdown content
            <div className="p-8">
              <ReactMarkdown>{lesson.body}</ReactMarkdown>
            </div>
          )}
        </article>

        {/* CTA + navigation — re-constrained for HTML lessons */}
        <div className={lesson.content_type === 'html' ? 'page-container max-w-3xl mx-auto px-4 pb-10' : ''}>

          {/* End of module CTA — only show when there IS a quiz */}
          {lesson.next_lesson_id === null && lesson.quiz_id !== null && (
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
                {/* Fix #3 — use module_id for the quiz route, not quiz_id */}
                <Link
                  to={`/courses/${slug}/quiz/${quizRouteId}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-body font-semibold text-white text-sm transition-all hover:brightness-110"
                  style={{ background: theme.primary }}
                >
                  <ClipboardList size={14} />
                  Take the quiz
                </Link>
              </div>
            </div>
          )}

          {/* Fix #4 — end of free preview: show enroll CTA instead of broken next-module button */}
          {isEndOfFreePreview && (
            <div
              className="mt-8 p-6 rounded-xl border"
              style={{ background: theme.pale, borderColor: `${theme.primary}25` }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${theme.primary}18` }}
                >
                  <Lock size={18} style={{ color: theme.primary }} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[#1A2433] mb-1">
                    You've completed the free preview!
                  </h3>
                  <p className="text-[#4A5A6A] font-body text-sm leading-relaxed">
                    Enroll to unlock all remaining modules, quizzes, and your certificate of completion.
                  </p>
                </div>
              </div>
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
                <button
                  onClick={() => handleEnroll()}
                  disabled={enrolling}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-body font-semibold text-white text-sm transition-all hover:brightness-110"
                  style={{ background: theme.primary }}
                >
                  {enrolling ? 'Redirecting...' : <>Enroll to continue <ArrowRight size={14} /></>}
                </button>
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
            ) : lesson.next_module_lesson_id ? (
              <Link
                to={`/courses/${slug}/lesson/${lesson.next_module_lesson_id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-body font-semibold text-white text-sm transition-all hover:brightness-110"
                style={{ background: theme.primary }}
              >
                Continue to next module <ArrowRight size={14} />
              </Link>
            ) : lesson.quiz_id ? (
              /* Fix #3 — use module_id for the quiz route in the bottom nav too */
              <Link
                to={`/courses/${slug}/quiz/${quizRouteId}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-body font-semibold text-white text-sm transition-all hover:brightness-110"
                style={{ background: theme.primary }}
              >
                Take the quiz <ArrowRight size={14} />
              </Link>
            ) : isEndOfFreePreview ? (
              /* Fix #4 — enroll CTA in the bottom nav for free preview end */
              <button
                onClick={() => handleEnroll()}
                disabled={enrolling}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-body font-semibold text-white text-sm transition-all hover:brightness-110"
                style={{ background: theme.primary }}
              >
                {enrolling ? 'Redirecting...' : <>Enroll to continue <ArrowRight size={14} /></>}
              </button>
            ) : (
              <Link
                to={`/courses/${slug}/progress`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#BCCAD8] bg-white text-sm font-body font-semibold text-[#4A5A6A] hover:bg-[#EEF2F6] transition-all"
              >
                Back to course <ArrowRight size={14} />
              </Link>
            )}
          </div>

        </div>{/* end CTA + nav wrapper */}
      </div>
    </div>
  )
}
