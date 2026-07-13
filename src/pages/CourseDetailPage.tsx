import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { BookOpen, Award, FileText, Lock, CheckCircle, ArrowLeft, Clock, Tag, X, Loader2 } from 'lucide-react'
import { coursesApi } from '@/api/courses'
import { enrollmentApi, freeEnrollmentApi } from '@/api/progress'
import { validatePromoCode, type ValidatePromoCodeResult } from '@/api/promoCodes'
import { COURSE_COLORS } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [enrolling, setEnrolling] = useState(false)
  const [promoInput, setPromoInput] = useState('')
  const [promoValidating, setPromoValidating] = useState(false)
  const [promoResult, setPromoResult] = useState<ValidatePromoCodeResult | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [showPromoField, setShowPromoField] = useState(false)

  const location = useLocation()
  // Detect if student came from Core Foundation flow
  const fromFoundation = location.state?.from === 'foundation' || document.referrer.includes('/courses/real-estate-foundation')

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => coursesApi.detail(slug!),
    enabled: !!slug,
  })

  // Use modules embedded in the course detail response (available to all users).
  // Only fall back to the separate modules endpoint if the course detail didn't include them.
  const modules = course?.modules ?? []

  const theme = COURSE_COLORS[slug ?? ''] ?? COURSE_COLORS['real-estate-foundation']
  const isLight = false // all trade courses now use dark hero themes

  const [previewLimitError, setPreviewLimitError] = useState<{ courseName: string } | null>(null)

  // Free enrollment mutation
  const freeMutation = useMutation({
    mutationFn: () => freeEnrollmentApi.enroll(slug!),
    onSuccess: (data) => {
      if (data.first_lesson_id) {
        navigate(`/courses/${slug}/lesson/${data.first_lesson_id}`)
      } else {
        // Fallback: go to progress page if no specific lesson ID returned
        navigate(`/courses/${slug}/progress`)
      }
    },
    onError: (err: any) => {
      if (err?.response?.data?.error === 'one_preview_limit') {
        setPreviewLimitError({
          courseName: err.response.data.active_preview?.course_title ?? 'another course',
        })
      }
    },
  })

  const handleFreePreview = () => {
    if (!isAuthenticated) {
      navigate(`/register?next=/courses/${slug}/free`)
      return
    }
    setPreviewLimitError(null)
    freeMutation.mutate()
  }

  const handleValidatePromo = async () => {
    if (!promoInput.trim()) return
    setPromoValidating(true)
    setPromoError(null)
    setPromoResult(null)
    try {
      const result = await validatePromoCode(promoInput.trim(), slug!)
      setPromoResult(result)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      setPromoError(axiosErr?.response?.data?.error || 'Invalid promo code.')
    } finally {
      setPromoValidating(false)
    }
  }

  const handleClearPromo = () => {
    setPromoInput('')
    setPromoResult(null)
    setPromoError(null)
  }

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate(`/register?next=/courses/${slug}`)
      return
    }
    setEnrolling(true)
    try {
      const session = await enrollmentApi.createCheckout(slug!, promoResult?.code)
      if (session.enrolled) {
        // 100% off — enrolled directly, redirect to progress page
        navigate(`/courses/${slug}/progress`)
        return
      }
      if (session.checkout_url) {
        window.location.href = session.checkout_url
      }
    } catch (err: any) {
      // If already enrolled, redirect to progress page
      if (err?.response?.status === 409) {
        navigate(`/courses/${slug}/progress`)
        return
      }
      setEnrolling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="page-container py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-[#DDD5C8] rounded-xl" />
          <div className="h-6 bg-[#DDD5C8] rounded w-1/2" />
          <div className="h-4 bg-[#F5F0EB] rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (!course) return null

  return (
    <div className="bg-[#FAF8F5]">
      {/* ── Hero ── */}
      <div
        className="py-14 px-4 relative overflow-hidden"
        style={{
          background: isLight
            ? 'linear-gradient(135deg, #f8f7f4 0%, #f0ede8 100%)'
            : theme.heroGradient
        }}
      >
        <div className="page-container relative">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to={slug?.startsWith('real-estate') || slug === 'real-estate-leasing' ? '/real-estate' : '/'}
              className="inline-flex items-center gap-2 text-sm font-body transition-colors"
              style={{ color: isLight ? theme.mid : 'rgba(255,255,255,0.6)' }}
            >
              <ArrowLeft size={15} />
              {slug?.startsWith('real-estate') || slug === 'real-estate-leasing'
                ? 'Real Estate tracks'
                : 'All paths'}
            </Link>
            {fromFoundation && (
              <Link
                to="/courses/real-estate-foundation"
                className="inline-flex items-center gap-2 text-sm font-body transition-colors"
                style={{ color: isLight ? theme.mid : 'rgba(255,255,255,0.6)' }}
              >
                · Back to Core Foundation
              </Link>
            )}
          </div>

          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-body font-semibold uppercase tracking-widest mb-4"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: isLight ? theme.primary : 'rgba(255,255,255,0.9)',
            }}
          >
            Career Track
          </div>

          <h1
            className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-4"
            style={{ color: isLight ? theme.primary : '#ffffff' }}
          >
            {slug === 'electrician' ? (() => {
              // Gold-italic accent: split at last em-dash or last word
              const title = course.title
              const dashIdx = title.lastIndexOf(' — ')
              if (dashIdx !== -1) {
                return (
                  <>
                    {title.slice(0, dashIdx + 3)}
                    <em style={{ color: theme.light, fontStyle: 'italic' }}>
                      {title.slice(dashIdx + 3)}
                    </em>
                  </>
                )
              }
              const words = title.split(' ')
              const lastWord = words.pop()
              return (
                <>
                  {words.join(' ')}{' '}
                  <em style={{ color: theme.light, fontStyle: 'italic' }}>{lastWord}</em>
                </>
              )
            })() : course.title}
          </h1>

          <p
            className="font-body text-base leading-relaxed max-w-xl mb-8"
            style={{ color: isLight ? theme.mid : 'rgba(255,255,255,0.75)' }}
          >
            {course.description}
          </p>

          <div className="flex flex-wrap gap-6">
            {[
              { icon: BookOpen, label: `${course.modules_count} modules` },
              { icon: Award,    label: `${course.quiz_count} quiz questions` },
              { icon: FileText, label: `${course.glossary_terms_count} glossary terms` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={15} style={{ color: isLight ? theme.light : 'rgba(255,255,255,0.6)' }} />
                <span className="text-sm font-body" style={{ color: isLight ? theme.mid : 'rgba(255,255,255,0.7)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="page-container py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Module list */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-bold text-[#1A1A18] mb-5">Course modules</h2>

            {/* Core Foundation entry point — shown on real-estate tracks only, NOT on trade courses */}
            {slug !== 'real-estate-foundation' && slug !== 'construction-painting' && slug !== 'electrician' && (
              <div className="flex items-center gap-3 p-4 mb-4 rounded-xl border-2 border-dashed bg-[#FFFBF0] cursor-pointer group"
                style={{ borderColor: '#C9A84C40' }}
                onClick={() => window.location.href = '/courses/real-estate-foundation'}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#C9A84C' }}>
                  <BookOpen size={15} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-sm" style={{ color: '#1A1A18' }}>
                    Core Foundation
                  </p>
                  <p className="text-xs font-body mt-0.5" style={{ color: '#8A8070' }}>
                    New to real estate? Start here — orientation is free
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full font-body whitespace-nowrap" style={{ background: '#FFF3D0', color: '#C9A84C', border: '1px solid #C9A84C30' }}>
                  Free
                </span>
              </div>
            )}

            <div className="space-y-2">
              {(modules ?? []).map((mod: any, idx: number) => {
                // Determine if this module is accessible (free preview = first 2 modules)
                const isFreeModule = idx <= 1
                const isAccessible = course.is_enrolled || isFreeModule
                const lessonTarget = mod.first_lesson_id
                  ? `/courses/${slug}/lesson/${mod.first_lesson_id}`
                  : course.is_enrolled ? `/courses/${slug}/progress` : null

                return (
                <div
                  key={mod.id}
                  className={`flex items-center gap-4 p-4 bg-white rounded-xl border border-[#DDD5C8] transition-colors ${isAccessible && lessonTarget ? 'cursor-pointer hover:bg-[#F5F0EB]' : ''}`}
                  style={idx === 0 ? { borderColor: `${theme.primary}40` } : {}}
                  onClick={() => {
                    if (isAccessible && lessonTarget) {
                      if (course.is_enrolled) {
                        navigate(lessonTarget)
                      } else {
                        // Trigger free preview enrollment then navigate
                        handleFreePreview()
                      }
                    }
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                    style={idx === 0
                      ? { background: theme.primary, color: 'white' }
                      : { background: '#F5F0EB', color: '#8A8070' }
                    }
                  >
                    {idx === 0 ? <BookOpen size={15} /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-[#1A1A18] text-sm truncate">{mod.title}</p>
                    <p className="text-[#8A8070] text-xs font-body mt-0.5">
                      {mod.lessons_total ?? mod.lessons_count ?? 0} lessons · {mod.quiz_count ?? 10} quiz questions
                    </p>
                  </div>
                  {course.is_enrolled ? (
                    mod.is_completed
                      ? <CheckCircle size={17} className="text-emerald-500 flex-shrink-0" />
                      : <span className="text-xs font-body text-[#5A4A3A] flex-shrink-0">Continue</span>
                  ) : isFreeModule ? (
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 font-body whitespace-nowrap"
                      style={{ background: `${theme.pale}`, color: theme.primary, border: `1px solid ${theme.primary}30` }}
                    >
                      Free preview
                    </span>
                  ) : (
                    <Lock size={14} className="text-[#8A8070] flex-shrink-0" />
                  )}
                </div>
                )
              })}
            </div>
          </div>

          {/* Enrollment card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#DDD5C8] p-6 sticky top-24 shadow-sm">
              <div className="h-1 w-full rounded-full mb-5"
                style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.mid})` }}
              />

              {course.is_enrolled ? (
                <>
                  <div className="flex items-center gap-2 text-emerald-600 font-body font-semibold mb-4">
                    <CheckCircle size={18} />
                    You're enrolled
                  </div>
                  <Link
                    to={`/courses/${slug}/progress`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-body font-semibold text-white text-sm mb-3 transition-all hover:brightness-110"
                    style={{ background: theme.primary }}
                  >
                    Continue learning
                  </Link>
                  <Link
                    to={`/courses/${slug}/glossary`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-body font-semibold text-sm border transition-all"
                    style={{ borderColor: `${theme.primary}40`, color: theme.primary, background: 'white' }}
                    onMouseEnter={e => (e.currentTarget.style.background = theme.pale)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                  >
                    View glossary
                  </Link>
                </>
              ) : (
                <>
                  {/* Price display */}
                  <div className="mb-1">
                    {promoResult ? (
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-3xl font-bold text-[#1A1A18]">
                          {promoResult.is_free ? 'Free' : `$${(promoResult.final_price_cents / 100).toFixed(2)}`}
                        </span>
                        <span className="font-display text-lg text-[#8A8070] line-through">
                          ${course.price}
                        </span>
                      </div>
                    ) : (
                      <div className="font-display text-3xl font-bold text-[#1A1A18]">${course.price}</div>
                    )}
                  </div>
                  <p className="text-[#8A8070] text-sm font-body mb-4">One-time payment</p>

                  {/* Promo code section — always visible */}
                  {!promoResult ? (
                    <div className="mb-4">
                      <label className="block text-xs font-body font-semibold text-[#8A8070] uppercase tracking-wide mb-1.5">
                        <Tag size={11} className="inline mr-1" />Promo Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-sm font-mono uppercase border border-[#DDD5C8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          placeholder="Enter promo code"
                          value={promoInput}
                          onChange={e => setPromoInput(e.target.value.toUpperCase())}
                          onKeyDown={e => e.key === 'Enter' && handleValidatePromo()}
                          maxLength={50}
                        />
                        <button
                          onClick={handleValidatePromo}
                          disabled={promoValidating || !promoInput.trim()}
                          className="px-3 py-2 rounded-lg text-xs font-body font-semibold disabled:opacity-50 transition-all hover:brightness-110"
                          style={{ background: theme.light, color: theme.mid }}
                        >
                          {promoValidating ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-xs text-red-500 font-body mt-1.5">{promoError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                        <span className="text-xs font-body font-semibold text-green-700">
                          {promoResult.discount_label} applied
                        </span>
                      </div>
                      <button onClick={handleClearPromo} className="text-[#8A8070] hover:text-[#1A1A18] transition-colors">
                        <X size={13} />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-3.5 rounded-lg font-body font-semibold text-white text-base mb-3 transition-all hover:brightness-110"
                    style={{ background: theme.primary }}
                  >
                    {enrolling
                      ? (promoResult?.is_free ? 'Enrolling...' : 'Redirecting...')
                      : promoResult?.is_free
                        ? 'Enroll for Free'
                        : 'Enroll now'
                    }
                  </button>

                  <button
                    onClick={handleFreePreview}
                    disabled={freeMutation.isPending}
                    className="w-full py-3 rounded-lg font-body font-semibold text-sm mb-5 border transition-all flex items-center justify-center gap-2"
                    style={{ borderColor: `${theme.primary}40`, color: theme.primary }}
                  >
                    <BookOpen size={14} />
                    {freeMutation.isPending ? 'Loading...' : 'Explore free — Orientation + Module 1 →'}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-center text-xs text-[#8A8070] font-body mb-5">
                      Free account required — takes 30 seconds
                    </p>
                  )}

                  {previewLimitError && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-3 text-xs font-body">
                      <p className="text-amber-800 font-semibold mb-1">You already have an active free preview</p>
                      <p className="text-amber-700 mb-2">
                        You're currently previewing <strong>{previewLimitError.courseName}</strong>. Cancel that preview first to start a new one.
                      </p>
                      <Link to="/dashboard" className="text-[#C9A84C] font-semibold hover:underline">
                        Go to Dashboard to cancel →
                      </Link>
                    </div>
                  )}

                  {freeMutation.isError && !previewLimitError && (
                    <p className="text-center text-xs text-red-500 font-body mb-3">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  {/* Access policy */}
                  <div className="rounded-xl p-4 mb-5 border" style={{ background: theme.pale, borderColor: `${theme.primary}20` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={14} style={{ color: theme.light }} className="flex-shrink-0" />
                      <span className="text-xs font-body font-semibold text-[#1A1A18]">Access policy</span>
                    </div>
                    <ul className="text-xs font-body space-y-1" style={{ color: theme.mid }}>
                      <li>• 3 months access after enrollment</li>
                      <li>• 1-click +2 month extension (free)</li>
                      <li>• Final +2 month extension on request</li>
                    </ul>
                  </div>

                  <div className="space-y-2 text-sm font-body" style={{ color: theme.mid }}>
                    {(slug === 'real-estate-foundation' ? [
                      'Orientation module (free)',
                      `${Math.max((course.modules_count ?? 1) - 1, 10)} course modules`,
                      `${course.quiz_count} practice questions`,
                      `${course.glossary_terms_count} glossary terms`,
                      'Certificate of completion',
                      'Orientation always free',
                    ] : [
                      `${course.modules_count} self-paced modules`,
                      `${course.quiz_count} practice questions`,
                      `${course.glossary_terms_count} glossary terms`,
                      'Certificate of completion',
                      'Module 1 always free',
                    ]).map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
