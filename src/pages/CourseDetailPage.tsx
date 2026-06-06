import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Award, FileText, ChevronRight, Lock, CheckCircle, ArrowLeft } from 'lucide-react'
import { coursesApi } from '@/api/courses'
import { enrollmentApi } from '@/api/progress'
import { COURSE_COLORS } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [enrolling, setEnrolling] = useState(false)

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => coursesApi.detail(slug!),
    enabled: !!slug,
  })

  const { data: modules } = useQuery({
    queryKey: ['modules', slug],
    queryFn: () => coursesApi.modules(slug!),
    enabled: !!slug,
  })

  const theme = COURSE_COLORS[slug ?? ''] ?? COURSE_COLORS['real-estate-foundation']
  const isLight = slug === 'construction-painting'

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/register', { state: { from: { pathname: `/courses/${slug}` } } })
      return
    }
    setEnrolling(true)
    try {
      const session = await enrollmentApi.createCheckout(slug!)
      window.location.href = session.checkout_url
    } catch {
      setEnrolling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="page-container py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-surface-200 rounded-xl" />
          <div className="h-6 bg-surface-200 rounded w-1/2" />
          <div className="h-4 bg-surface-100 rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (!course) return null

  return (
    <div>
      {/* ── Hero banner ── */}
      <div
        className="py-14 px-4 relative overflow-hidden"
        style={{ background: theme.heroGradient }}
      >
        <div className="page-container relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 text-sm font-body mb-6 transition-colors"
          >
            <ArrowLeft size={15} />
            All courses
          </Link>

          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-body font-semibold uppercase tracking-widest mb-4"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            Career Track
          </div>

          <h1
            className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-4"
            style={{ color: isLight ? theme.primary : '#ffffff' }}
          >
            {course.title}
          </h1>

          <p
            className="font-body text-base leading-relaxed max-w-xl mb-8"
            style={{ color: isLight ? theme.mid : 'rgba(255,255,255,0.75)' }}
          >
            {course.description}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6">
            {[
              { icon: BookOpen, label: `${course.modules_count} modules` },
              { icon: Award, label: `${course.quiz_count} quiz questions` },
              { icon: FileText, label: `${course.glossary_terms_count} glossary terms` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={15} style={{ color: isLight ? theme.light : 'rgba(255,255,255,0.6)' }} />
                <span
                  className="text-sm font-body"
                  style={{ color: isLight ? theme.mid : 'rgba(255,255,255,0.7)' }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="page-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Module list */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-bold text-navy-900 mb-5">Course modules</h2>
            <div className="space-y-2">
              {(modules ?? []).map((mod, idx) => (
                <div
                  key={mod.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-surface-200 hover:border-surface-300 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0 text-white"
                    style={{ background: theme.primary }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-navy-900 text-sm truncate">{mod.title}</p>
                    <p className="text-surface-400 text-xs font-body mt-0.5">
                      {mod.lessons_count} lessons · 10 quiz questions
                    </p>
                  </div>
                  {course.is_enrolled ? (
                    mod.is_completed ? (
                      <CheckCircle size={17} className="text-emerald-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight size={17} className="text-surface-300 flex-shrink-0" />
                    )
                  ) : (
                    <Lock size={15} className="text-surface-300 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Enrollment card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div
                className="h-1 w-full rounded-full mb-5"
                style={{ background: theme.heroGradient }}
              />

              {course.is_enrolled ? (
                <>
                  <div className="flex items-center gap-2 text-emerald-600 font-body font-semibold mb-4">
                    <CheckCircle size={18} />
                    You're enrolled
                  </div>
                  <Link
                    to={`/courses/${slug}/progress`}
                    className="btn-primary w-full mb-3"
                    style={{ background: theme.primary }}
                  >
                    Continue learning
                  </Link>
                  <Link to={`/courses/${slug}/glossary`} className="btn-secondary w-full text-sm">
                    View glossary
                  </Link>
                </>
              ) : (
                <>
                  <div className="font-display text-3xl font-bold text-navy-900 mb-1">
                    ${course.price}
                  </div>
                  <p className="text-surface-400 text-sm font-body mb-5">One-time payment · 3 months access</p>

                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn-primary w-full mb-3 text-base py-3.5"
                    style={{ background: theme.primary }}
                  >
                    {enrolling ? 'Redirecting...' : 'Enroll now'}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-center text-xs text-surface-400 font-body">
                      You'll be asked to create a free account first
                    </p>
                  )}

                  <div className="mt-5 space-y-2 text-sm font-body text-surface-500">
                    {[
                      `${course.modules_count} self-paced modules`,
                      `${course.quiz_count} practice questions`,
                      `${course.glossary_terms_count} glossary terms`,
                      'Certificate of completion',
                      '3 months access',
                    ].map(item => (
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
