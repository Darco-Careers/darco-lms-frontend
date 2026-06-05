import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'

const TRACK_DOORS = [
  {
    slug: 'real-estate',
    href: '/real-estate',
    emoji: '🏠',
    label: 'Real Estate',
    tagline: '10 career tracks',
    desc: 'From residential agent to developer — explore every path in the real estate world. Start with the Core Foundation, then choose your career track.',
    color: '#1B4D3E',
    colorMid: '#2A6B56',
    colorPale: '#F0F7F4',
    tracks: ['Residential Agent', 'Commercial RE', 'Investing', 'Property Management', 'Apartment Leasing', 'Development', 'Mortgage', 'Wholesaling', 'Photography', 'Maintenance'],
  },
  {
    slug: 'electrician',
    href: '/courses/electrician',
    emoji: '⚡',
    label: 'Electrician',
    tagline: '1 career track',
    desc: 'High demand, excellent pay. Learn wiring, panels, safety codes, certifications, and exactly how to get hired as an electrician in the LA market.',
    color: '#1A2E4D',
    colorMid: '#2A4A7A',
    colorPale: '#EBF0F7',
    tracks: ['Safety & OSHA', 'Tools & Materials', 'Wiring & Circuits', 'Panels & Conduit', 'Getting Hired'],
  },
  {
    slug: 'construction-painting',
    href: '/courses/construction-painting',
    emoji: '🖌️',
    label: 'Construction Painting',
    tagline: '1 career track',
    desc: 'Professional painting of homes and commercial buildings. Surface prep, primers, coatings, tools, safety — and how to get on a job site with zero experience.',
    color: '#4D2A1A',
    colorMid: '#7A4228',
    colorPale: '#FAF0EA',
    tracks: ['The Trade', 'Safety & OSHA', 'Tools & Equipment', 'Surface Prep', 'Getting Hired'],
  },
]

export default function HomePage() {
  return (
    <div className="bg-[#C8D4E0]">

      {/* ── HERO ── */}
      <section
        className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(120deg, rgba(20,30,48,0.90) 0%, rgba(20,30,48,0.72) 50%, rgba(20,30,48,0.38) 100%)' }}
        />
        {/* Gold glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 15% 60%, rgba(201,168,76,0.12) 0%, transparent 55%)' }} />

        <div className="relative page-container py-20 z-10">
          <div className="max-w-2xl">
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8" style={{ background: '#C9A84C' }} />
              <span className="text-xs font-body font-semibold tracking-[3px] uppercase" style={{ color: '#C9A84C' }}>
                Career Foundation Training
              </span>
            </div>

            {/* Headline */}
            <div className="mb-5">
              <div className="font-display italic text-5xl sm:text-6xl lg:text-7xl text-white font-normal leading-none mb-1">
                Darco
              </div>
              <div className="font-display text-5xl sm:text-6xl lg:text-7xl text-white font-bold leading-none">
                Academy
              </div>
            </div>

            <p className="font-display italic text-xl sm:text-2xl text-white/80 mb-5 font-normal">
              Build Your Foundation. Begin Your Journey.
            </p>

            <p className="font-body text-white/65 text-base leading-relaxed mb-8 max-w-lg">
              <strong className="text-white font-semibold">Darco gives you a foundation.</strong>{' '}
              Whether you're starting your first career or changing direction entirely — every path
              starts with the right preparation, the right mindset, and the courage to begin.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#tracks"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-body font-semibold text-[#1E2A38] transition-all hover:brightness-110 shadow-lg"
                style={{ background: '#C9A84C' }}
              >
                Explore Career Paths <ArrowRight size={16} />
              </a>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-body font-semibold text-white border border-white/25 hover:bg-white/10 transition-all"
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade into bg color */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #C8D4E0)' }} />
      </section>

      {/* ── INTRO STRIP ── */}
      <div className="bg-[#1E2A38]">
        <div className="page-container py-4">
          <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center sm:justify-start">
            {['13 career tracks', '1,160+ quiz questions', '700+ glossary terms', 'Module 1 free on every course', 'Self-paced', 'Los Angeles based'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                <span className="text-[#B8C8D8] text-xs font-body font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── THREE TRACK DOORS ── */}
      <section id="tracks" className="py-16 px-4">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">
              Choose Your Path
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold text-[#1A2433] mb-2">
            Where do you want to <em className="text-[#C9A84C] not-italic">go?</em>
          </h2>
          <p className="text-[#4A5A6A] font-body mb-10 max-w-xl">
            Pick a career world. Explore free. Enroll when you're ready to start learning.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRACK_DOORS.map(track => (
              <Link
                key={track.slug}
                to={track.href}
                className="group relative rounded-2xl overflow-hidden border border-[#BCCAD8] bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Color header bar */}
                <div
                  className="h-2 w-full"
                  style={{ background: `linear-gradient(90deg, ${track.color} 0%, ${track.colorMid} 100%)` }}
                />

                <div className="p-6 flex flex-col flex-1">
                  {/* Emoji + label */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: track.colorPale }}
                    >
                      {track.emoji}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-[#1A2433] text-xl">{track.label}</h3>
                      <p className="text-xs font-body text-[#8A9AAA]">{track.tagline}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[#4A5A6A] font-body text-sm leading-relaxed mb-5 flex-1">
                    {track.desc}
                  </p>

                  {/* Sample tracks */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {track.tracks.slice(0, 5).map(t => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded font-body"
                        style={{ background: track.colorPale, color: track.color, border: `1px solid ${track.color}25` }}
                      >
                        {t}
                      </span>
                    ))}
                    {track.tracks.length > 5 && (
                      <span className="text-xs px-2 py-0.5 rounded font-body bg-[#EEF2F6] text-[#8A9AAA] border border-[#BCCAD8]">
                        +{track.tracks.length - 5} more
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <div
                    className="flex items-center justify-between pt-4 border-t"
                    style={{ borderColor: `${track.color}20` }}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-body text-[#8A9AAA]">
                      <CheckCircle size={12} className="text-emerald-500" />
                      Module 1 free
                    </div>
                    <span
                      className="flex items-center gap-1 text-sm font-body font-semibold group-hover:gap-2 transition-all duration-200"
                      style={{ color: track.color }}
                    >
                      Explore <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-4 bg-white">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">How It Works</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-[#1A2433] mb-10">
            Simple as <em className="text-[#C9A84C] not-italic">1, 2, 3</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            {[
              { num: '01', title: 'Choose your path', body: 'Browse the three career worlds. Click into Real Estate to explore all 10 tracks with free previews.' },
              { num: '02', title: 'Start for free', body: 'Module 1 of every course is completely free. Read the lessons, watch the videos, get a real feel for the career.' },
              { num: '03', title: 'Enroll & get hired', body: 'When you\'re ready, enroll to unlock all modules. Every course ends with a getting-hired module and certificate.' },
            ].map(({ num, title, body }) => (
              <div key={num} className="flex gap-5">
                <div
                  className="font-display text-4xl font-bold flex-shrink-0 leading-none"
                  style={{ color: '#C9A84C', opacity: 0.4 }}
                >
                  {num}
                </div>
                <div>
                  <h3 className="font-display font-bold text-[#1A2433] text-lg mb-2">{title}</h3>
                  <p className="text-[#4A5A6A] font-body text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-16 px-4 bg-[#1E2A38]">
        <div className="page-container max-w-3xl mx-auto text-center">
          <div className="flex items-center gap-3 justify-center mb-6">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">Our Mission</span>
            <div className="h-px w-8 bg-[#C9A84C]" />
          </div>
          <p className="font-display text-2xl sm:text-3xl font-medium text-white leading-relaxed mb-5">
            "DARCO exists to give every person in our community a clear, structured path from zero experience to a sustainable career."
          </p>
          <p className="text-[#8A9BB0] font-body text-sm">
            DARCO Inc. — Los Angeles · In partnership with Chabad SOLA
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href="#tracks"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-body font-semibold text-[#1E2A38] transition-all hover:brightness-110"
              style={{ background: '#C9A84C' }}
            >
              Begin Your Path <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
