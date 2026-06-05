import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Users, Award, ArrowRight, CheckCircle } from 'lucide-react'
import { coursesApi } from '@/api/courses'
import { COURSE_COLORS } from '@/types'
import type { Course } from '@/types'

const CATEGORY_LABELS: Record<string, string> = {
  'real-estate': 'Real Estate',
  'trades': 'Trades',
}

function CourseCard({ course }: { course: Course }) {
  const theme = COURSE_COLORS[course.slug] ?? COURSE_COLORS['real-estate-foundation']
  const isLight = course.slug === 'construction-painting'

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="card-hover flex flex-col overflow-hidden group"
    >
      {/* Color header */}
      <div
        className="h-2 w-full"
        style={{ background: theme.heroGradient }}
      />
      <div className="p-5 flex flex-col flex-1">
        {/* Color dot + category */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: isLight ? theme.primary : theme.primary }}
          />
          <span className="text-xs font-body font-semibold text-surface-500 uppercase tracking-wider">
            {course.slug.includes('real-estate') || course.slug === 'apartment-leasing'
              ? 'Real Estate'
              : 'Trades'}
          </span>
        </div>

        <h3 className="font-display font-bold text-navy-900 text-base leading-snug mb-2 group-hover:text-navy-700 transition-colors">
          {course.title}
        </h3>

        <p className="text-surface-500 font-body text-sm leading-relaxed flex-1 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-surface-400 font-body mb-4">
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {course.modules_count} modules
          </span>
          <span className="flex items-center gap-1">
            <Award size={12} />
            {course.quiz_count} questions
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-100">
          <div>
            {course.is_enrolled ? (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <CheckCircle size={14} />
                Enrolled
              </span>
            ) : (
              <span className="font-display font-bold text-navy-900">
                ${course.price}
              </span>
            )}
          </div>
          <span
            className="flex items-center gap-1 text-xs font-semibold font-body transition-all duration-200 group-hover:gap-2"
            style={{ color: theme.primary }}
          >
            {course.is_enrolled ? 'Continue' : 'Learn more'}
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: () => coursesApi.list(1, 20),
    staleTime: 60 * 60 * 1000, // 1 hour
  })

  const courses = data?.results ?? []
  const reCourses = courses.filter(c =>
    c.slug.includes('real-estate') || c.slug === 'apartment-leasing'
  )
  const tradeCourses = courses.filter(c =>
    !c.slug.includes('real-estate') && c.slug !== 'apartment-leasing'
  )

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-hero-gradient text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-400 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-navy-400 blur-3xl" />
        </div>
        <div className="page-container relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-body font-semibold text-brand-300 uppercase tracking-widest mb-6">
              Los Angeles Career Training
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
              From zero experience<br />
              <em className="text-brand-400 not-italic">to a real career.</em>
            </h1>
            <p className="text-navy-200 font-body text-lg leading-relaxed mb-8 max-w-xl">
              DARCO Academy gives you the knowledge, quizzes, and career guidance to get hired in real estate, construction, and the trades — no degree required.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary text-base px-7 py-3.5">
                Start for free
              </Link>
              <a href="#courses" className="btn-secondary text-base px-7 py-3.5 bg-white/10 border-white/20 text-white hover:bg-white/20">
                Browse courses
              </a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="page-container mt-14 relative">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            {[
              { num: '13', label: 'Career tracks' },
              { num: '1,160+', label: 'Quiz questions' },
              { num: '700+', label: 'Glossary terms' },
              { num: '100%', label: 'Self-paced' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-display text-2xl font-bold text-brand-400">{num}</div>
                <div className="text-navy-300 text-xs font-body mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Course Catalog ── */}
      <section id="courses" className="py-16 px-4">
        <div className="page-container">

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card h-64 animate-pulse bg-surface-100" />
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-16 text-surface-500 font-body">
              Could not load courses. Please refresh the page.
            </div>
          )}

          {!isLoading && !isError && (
            <>
              {/* Real Estate tracks */}
              {reCourses.length > 0 && (
                <div className="mb-14">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="section-title">Real Estate Careers</h2>
                  </div>
                  <p className="text-surface-500 font-body mb-8">
                    Start with the Core Foundation, then choose your career track.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {reCourses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              )}

              {/* Trades */}
              {tradeCourses.length > 0 && (
                <div>
                  <h2 className="section-title mb-2">Trades & Construction</h2>
                  <p className="text-surface-500 font-body mb-8">
                    Hands-on career training for the skilled trades.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tradeCourses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Mission strip ── */}
      <section className="bg-navy-950 text-white py-14 px-4">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-display text-2xl font-medium text-white leading-relaxed mb-4">
              "DARCO exists to give every person in our community a clear, structured path from zero experience to a sustainable career."
            </p>
            <p className="text-navy-400 font-body text-sm">
              DARCO Inc. — Los Angeles · In partnership with Chabad SOLA
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 px-4 bg-surface-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">How DARCO Academy works</h2>
            <p className="text-surface-500 font-body max-w-xl mx-auto">
              Structured learning designed for working adults with no prior experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Choose your career track',
                body: 'Browse 13 career tracks across real estate and the trades. Each course was built around real books and real industry standards.',
              },
              {
                step: '02',
                title: 'Learn at your own pace',
                body: 'Read lessons, watch curated YouTube videos from industry experts, and test yourself with 10 questions per module.',
              },
              {
                step: '03',
                title: 'Get hired',
                body: 'Every course ends with a getting-hired module — resume tips, interview prep, and exactly where to apply.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="card p-6">
                <div className="font-display text-4xl font-bold text-brand-200 mb-3">{step}</div>
                <h3 className="font-display font-bold text-navy-900 text-lg mb-2">{title}</h3>
                <p className="text-surface-500 font-body text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
