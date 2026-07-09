import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Lock, BookOpen, CheckCircle, Loader2 } from 'lucide-react'
import { COURSE_COLORS } from '@/types'
import { enrollmentApi, freeEnrollmentApi } from '@/api/progress'
import { useAuthStore } from '@/store/authStore'

// Hardcoded catalog data — will be replaced by public API endpoint in a future backend batch
const CATALOG: Record<string, { price: number; modules: string[]; quizCount: number; glossaryCount: number; freeModules?: number }> = {
  'real-estate-foundation': {
    price: 299, quizCount: 100, glossaryCount: 80,
    freeModules: 2,
    modules: ['Orientation — What Is Real Estate?', 'Residential Agent & Broker Overview', 'Commercial Real Estate Overview', 'Real Estate Investing Overview', 'Property Management Overview', 'Apartment Leasing Overview', 'Development Overview', 'Mortgage & Lending Overview', 'Wholesaling Overview', 'Real Estate Photography Overview', 'Maintenance & Repair Overview'],
  },
  'real-estate-residential-agent': {
    price: 299, quizCount: 50, glossaryCount: 60,
    modules: ['The Residential Agent Role', 'Getting Your Real Estate License', 'Building Your Business', 'Working With Buyers', 'Working With Sellers'],
  },
  'real-estate-commercial': {
    price: 299, quizCount: 40, glossaryCount: 50,
    modules: ['Commercial Real Estate Overview', 'Commercial Leasing', 'Commercial Investment Analysis', 'Getting Started in Commercial'],
  },
  'real-estate-investing': {
    price: 299, quizCount: 40, glossaryCount: 50,
    modules: ['Investing Fundamentals', 'Analyzing Investment Properties', 'Financing Your Investments', 'Property Management for Investors'],
  },
  'real-estate-property-management': {
    price: 299, quizCount: 40, glossaryCount: 50,
    modules: ['Property Management Overview', 'Tenant Relations', 'Financial Management', 'Getting Your First PM Job'],
  },
  'real-estate-leasing': {
    price: 299, quizCount: 40, glossaryCount: 50,
    modules: ['The Leasing Consultant Role', 'Sales Skills for Leasing', 'The Apartment Market', 'Getting Hired as a Leasing Consultant'],
  },
  'real-estate-development': {
    price: 299, quizCount: 40, glossaryCount: 50,
    modules: ['Real Estate Development Overview', 'Site Selection and Feasibility', 'Development Finance', 'Getting Into Development'],
  },
  'real-estate-mortgage-lending': {
    price: 299, quizCount: 40, glossaryCount: 50,
    modules: ['The Mortgage Industry', 'Getting Your NMLS License', 'Mortgage Products and Underwriting', 'Building Your Mortgage Business'],
  },
  'real-estate-wholesaling': {
    price: 299, quizCount: 40, glossaryCount: 50,
    modules: ['Wholesaling Fundamentals', 'Finding Motivated Sellers', 'Analyzing and Contracting Deals', 'Building Your Buyers List'],
  },
  'real-estate-photography': {
    price: 299, quizCount: 40, glossaryCount: 50,
    modules: ['Real Estate Photography Overview', 'Equipment and Technical Skills', 'Shooting Techniques', 'Building Your Photography Business'],
  },
  'real-estate-maintenance-repair': {
    price: 299, quizCount: 40, glossaryCount: 50,
    modules: ['The Maintenance Career in Real Estate', 'Core Maintenance Skills', 'Getting Certified', 'Getting Hired or Going Independent'],
  },
}

const TRACKS = [
  {
    slug: 'real-estate-foundation',
    emoji: '🏛️', short: 'Core Foundation',
    tagline: 'Get a solid overview of the real estate career industry.',
    desc: "New to real estate and not sure which direction is right for you? The Real Estate Core Foundation gives you a comprehensive overview of the many career paths available in the industry. Explore each path, understand how they connect, and make an informed decision before committing to a specific track.",
    tags: ['Beginner friendly', 'All career paths covered', 'No license required'],
    license: false, noLicense: true,
    isFoundation: true,
  },
  {
    slug: 'real-estate-residential-agent',
    emoji: '🏠', short: 'Residential Agent',
    tagline: 'Help people buy, sell & find homes',
    desc: "You're the guide people trust when making the biggest purchase of their lives. List homes, show properties, negotiate deals, and help clients navigate one of the most emotional decisions they'll ever make.",
    tags: ['People skills', 'Flexible hours', 'High earning potential'],
    license: true, noLicense: false,
  },
  {
    slug: 'real-estate-commercial',
    emoji: '🏢', short: 'Commercial RE',
    tagline: 'Sales, leasing & investment properties',
    desc: 'Offices, shopping centers, apartment complexes, warehouses — commercial real estate deals are bigger, the commissions are larger, and the relationships run deep. This is where major wealth is built.',
    tags: ['High earning potential', 'Relationship-driven', 'Market analysis'],
    license: false, noLicense: false,
  },
  {
    slug: 'real-estate-investing',
    emoji: '🏘️', short: 'RE Investing',
    tagline: 'Apartments, multifamily & passive income',
    desc: 'Buy properties that generate monthly income. From a small duplex to a 50-unit apartment complex, investing in real estate is one of the most proven paths to financial independence.',
    tags: ['Passive income', 'Wealth building', 'Numbers focused'],
    license: false, noLicense: true,
  },
  {
    slug: 'real-estate-property-management',
    emoji: '🔑', short: 'Property Mgmt',
    tagline: 'Run & operate income-producing properties',
    desc: 'Property managers are the backbone of real estate ownership. Handle tenants, maintenance, rent collection, and day-to-day operations — keeping properties profitable and running smoothly.',
    tags: ['Organized', 'Problem solver', 'Steady income'],
    license: false, noLicense: false,
  },
  {
    slug: 'real-estate-leasing',
    emoji: '🏠', short: 'Apt Leasing',
    tagline: 'Lease, retain & build resident communities',
    desc: 'Leasing consultants are the front door of every apartment community — converting prospects into residents, guiding move-ins, and building long-term occupancy. No license required to start.',
    tags: ['Sales + service', 'No license needed'],
    license: false, noLicense: true,
  },
  {
    slug: 'real-estate-development',
    emoji: '🏗️', short: 'Development',
    tagline: 'Build, convert & create new properties',
    desc: "Developers take raw land or outdated buildings and transform them into something new — apartment complexes, shopping centers, mixed-use spaces. The entrepreneurial side of real estate at its most ambitious.",
    tags: ['High risk/reward', 'Visionary thinking', 'Long-term projects'],
    license: false, noLicense: false,
  },
  {
    slug: 'real-estate-mortgage-lending',
    emoji: '💵', short: 'Mortgage',
    tagline: 'Finance the deals that make real estate move',
    desc: "Without financing, most real estate deals don't happen. Mortgage brokers and loan officers connect buyers with the right lenders and loan products — and earn a fee on every deal that closes.",
    tags: ['Detail oriented', 'Finance minded', 'Transaction based'],
    license: false, noLicense: false,
  },
  {
    slug: 'real-estate-wholesaling',
    emoji: '🔄', short: 'Wholesaling',
    tagline: 'Find deals & flip contracts for profit',
    desc: "Wholesalers find undervalued properties, put them under contract, and assign that contract to another investor for a fee — often without ever owning the property themselves.",
    tags: ['Hustle required', 'Deal finding'],
    license: false, noLicense: true,
  },
  {
    slug: 'real-estate-photography',
    emoji: '📸', short: 'Photography',
    tagline: 'Visual marketing for properties & agents',
    desc: "In today's market, how a property looks online determines whether it gets shown. Professional real estate photographers are busy, well-paid, and work with agents and developers across the market.",
    tags: ['Creative eye', 'Flexible schedule', 'Tech driven'],
    license: false, noLicense: false,
  },
  {
    slug: 'real-estate-maintenance-repair',
    emoji: '🔧', short: 'Maintenance',
    tagline: 'Keep properties running & in top shape',
    desc: 'Every building needs maintenance. Skilled tradespeople — plumbers, electricians, HVAC techs, general contractors — are in constant demand in the real estate world and command excellent rates.',
    tags: ['Hands-on work', 'Always in demand', 'Trade skills'],
    license: false, noLicense: false,
  },
]

const PERSONALITY_TYPES = [
  { type: 'The People Person 🤝', desc: 'You light up in conversation. You build trust quickly and love helping people.', paths: ['Residential Agent', 'Commercial Broker', 'Property Management'] },
  { type: 'The Numbers Mind 📊', desc: 'You ask "does this make financial sense?" before anything else.', paths: ['RE Investing', 'Mortgage & Lending'] },
  { type: 'The Creative Eye 🎨', desc: 'You see potential where others see problems. You care about how spaces look.', paths: ['Photography', 'Development'] },
  { type: 'The Builder 🔨', desc: "You're hands-on. You'd rather fix something than talk about fixing it.", paths: ['Maintenance & Repair', 'Development'] },
  { type: 'The Organizer 📋', desc: 'Systems and checklists are your love language. Nothing falls through the cracks.', paths: ['Property Management', 'Mortgage Processing'] },
  { type: 'The Entrepreneur 🚀', desc: "You think big. Comfortable with risk. You want to own something.", paths: ['Investing', 'Development', 'Wholesaling'] },
  { type: 'The Researcher 🔍', desc: 'You dig deep before deciding. You only move when you understand the full picture.', paths: ['RE Investing', 'Appraiser'] },
  { type: 'The Hustler ⚡', desc: "You move fast, grind hard. You don't wait for opportunity — you create it.", paths: ['Wholesaling', 'Commercial Sales', 'Residential Agent'] },
]

export default function RealEstatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [activeIdx, setActiveIdx] = useState(() => {
    const trackParam = searchParams.get('track')
    if (trackParam) {
      const idx = TRACKS.findIndex(t => t.slug === trackParam)
      return idx >= 0 ? idx : 0
    }
    return 0
  })
  const [enrolling, setEnrolling] = useState(false)
  const [enrollingSlug, setEnrollingSlug] = useState<string | null>(null)
  const [freeEnrolling, setFreeEnrolling] = useState(false)
  const [freeEnrollingSlug, setFreeEnrollingSlug] = useState<string | null>(null)

  const handleFreeExplore = async (slug: string) => {
    if (!isAuthenticated) {
      navigate(`/register?next=/courses/${slug}/free`)
      return
    }
    setFreeEnrolling(true)
    setFreeEnrollingSlug(slug)
    try {
      const enrollment = await freeEnrollmentApi.enroll(slug)
      navigate(`/courses/${slug}/lesson/${enrollment.first_lesson_id}`)
    } catch {
      navigate(`/courses/${slug}`)
    } finally {
      setFreeEnrolling(false)
      setFreeEnrollingSlug(null)
    }
  }
  const handleDirectEnroll = async (slug: string) => {
    if (!isAuthenticated) {
      navigate(`/register?next=/courses/${slug}`)
      return
    }
    setEnrolling(true)
    setEnrollingSlug(slug)
    try {
      const session = await enrollmentApi.createCheckout(slug)
      if (session.enrolled) {
        navigate(`/courses/${slug}/progress`)
        return
      }
      if (session.checkout_url) {
        window.location.href = session.checkout_url
      }
    } catch {
      // fallback to course detail page on error
      navigate(`/courses/${slug}`)
    } finally {
      setEnrolling(false)
      setEnrollingSlug(null)
    }
  }
  const activeTrack = TRACKS[activeIdx]
  const theme = COURSE_COLORS[activeTrack.slug] ?? COURSE_COLORS['real-estate-foundation']
  const catalog = CATALOG[activeTrack.slug] ?? { price: 299, modules: [], quizCount: 0, glossaryCount: 0, freeModules: 1 }
  const modules = catalog.modules
  const freeModules = catalog.freeModules ?? 1

  return (
    <div className="bg-[#FAF8F5]">

      {/* ── PAGE HEADER ── */}
      <div
        className="py-14 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E2A38 0%, #2D3E52 100%)' }}
      >
        <div className="page-container relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[#8A9BB0] hover:text-white text-sm font-body mb-6 transition-colors">
            ← Back to all paths
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">Real Estate Academy</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">
            Every door leads <em className="text-[#C9A84C] not-italic">somewhere different</em>
          </h1>
          <p className="text-[#8A9BB0] font-body text-base max-w-xl leading-relaxed">
            Real estate isn't one career — it's a dozen careers under the same roof.
            Hover over any track to preview it. Module 1 of every track is <strong className="text-[#C9A84C]">free to explore.</strong>
          </p>
        </div>
      </div>

      {/* ── ECOSYSTEM ── */}
      <div className="bg-white py-12 px-4">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">The Big Picture</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#1A1A18] mb-2">
            Real estate is an <em className="text-[#C9A84C] not-italic">ecosystem</em>
          </h2>
          <p className="text-[#5A4A3A] font-body text-sm mb-6 max-w-lg">Every part plays a different role — but they all depend on each other.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { emoji: '🏗️', title: 'Creation', desc: 'Developers & contractors' },
              { emoji: '💰', title: 'Investment', desc: 'Investors & owners' },
              { emoji: '🤝', title: 'Transactions', desc: 'Agents & brokers' },
              { emoji: '🔧', title: 'Operations', desc: 'Property managers' },
              { emoji: '📊', title: 'Finance', desc: 'Mortgage brokers' },
              { emoji: '📸', title: 'Marketing', desc: 'Photographers' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-[#F5F0EB] border border-[#DDD5C8] rounded-xl p-4 text-center">
                <div className="text-xl mb-2">{emoji}</div>
                <div className="font-display font-bold text-[#1A1A18] text-xs mb-0.5">{title}</div>
                <div className="text-[#8A8070] text-xs">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CORE FOUNDATION BANNER ── */}
      <div className="bg-[#1A2433] py-10 px-4">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-8 bg-[#C9A84C]" />
                <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">Start Here</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Not sure which track is right for you?
              </h2>
              <p className="text-[#8A9BB0] font-body text-sm max-w-xl leading-relaxed">
                The <strong className="text-white">Real Estate Core Foundation</strong> is a free guided tour of the industry. Explore many real estate career opportunity paths, understand how they connect, and find the path that fits who you are — before you commit to anything.
              </p>
              <ul className="mt-4 space-y-1.5">
                {[
                  'Overview of all 10 real estate career tracks',
                  'Course overview is always free — no account needed',
                  'Helps you choose the right path with confidence',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm font-body text-[#8A9BB0]">
                    <CheckCircle size={14} className="text-[#C9A84C] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 min-w-[220px]">
              <Link
                to="/courses/real-estate-foundation"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-body font-semibold text-sm transition-all"
                style={{ background: '#C9A84C', color: '#1A1A18' }}
              >
                Explore Core Foundation <ArrowRight size={16} />
              </Link>
              <p className="text-center text-xs text-[#8A9BB0] font-body">Course overview is free — no payment needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS + CONTENT ── */}
      <div className="py-12 px-4">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">10 Career Tracks</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#1A1A18] mb-6">
            Choose your <em className="text-[#C9A84C] not-italic">career track</em>
          </h2>

          {/* TABS ROW */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TRACKS.map((track, idx) => {
              const trackTheme = COURSE_COLORS[track.slug]
              const isActive = idx === activeIdx
              const isFoundation = (track as any).isFoundation
              return (
                <div key={track.slug} className="relative group/tab">
                  <button
                    onClick={() => setActiveIdx(idx)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-body font-semibold transition-all duration-200 whitespace-nowrap"
                    style={isFoundation
                      ? isActive
                        ? { background: '#C9A84C', color: '#1A1A18', borderColor: 'transparent' }
                        : { background: '#FDF6E3', color: '#8a6a1a', borderColor: '#C9A84C' }
                      : isActive ? {
                          background: trackTheme?.primary ?? '#1B4D3E',
                          color: 'white',
                          borderColor: 'transparent',
                        } : {
                          background: 'white',
                          color: '#5A4A3A',
                          borderColor: '#DDD5C8',
                        }
                    }
                  >
                    <span>{track.emoji}</span>
                    <span>{track.short}</span>
                  </button>

                  {/* Hover tooltip */}
                  <div className="hidden group-hover/tab:block absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-56 bg-white rounded-xl shadow-xl border border-[#DDD5C8] p-4 pointer-events-none">
                    {/* Color accent bar */}
                    <div className="h-1 w-full rounded-full mb-3" style={{ background: trackTheme?.primary ?? '#1B4D3E' }} />
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg flex-shrink-0">{track.emoji}</span>
                      <div>
                        <div className="font-body font-semibold text-[#1A1A18] text-xs">{track.short}</div>
                        <div className="text-[#8A8070] text-xs mt-0.5">{track.tagline}</div>
                      </div>
                    </div>
                    <p className="text-[#5A4A3A] text-xs leading-relaxed mb-2 line-clamp-3">{track.desc}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {track.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-[#F5F0EB] text-[#5A4A3A] rounded border border-[#DDD5C8]">{tag}</span>
                      ))}
                      {track.noLicense && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#C9A84C]/10 text-[#8a6a1a] rounded border border-[#C9A84C]/25">No license needed</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: trackTheme?.primary }}>
                      <CheckCircle size={10} /> Free to explore
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ACTIVE CONTENT PANEL */}
          <div className="bg-white rounded-2xl border border-[#DDD5C8] overflow-hidden shadow-sm">
            {/* Top accent */}
            <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${theme.primary} 0%, ${theme.mid} 100%)` }} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Left: description */}
              <div className="lg:col-span-2 p-7 border-b lg:border-b-0 lg:border-r border-[#EDE8E2]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{activeTrack.emoji}</span>
                  <div>
                    <h3 className="font-display font-bold text-[#1A1A18] text-xl">{activeTrack.short}</h3>
                    <p className="text-[#8A8070] font-body text-sm">{activeTrack.tagline}</p>
                  </div>
                </div>

                <p className="text-[#5A4A3A] font-body text-sm leading-relaxed mb-5">{activeTrack.desc}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {activeTrack.tags.map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-[#F5F0EB] text-[#5A4A3A] border border-[#DDD5C8] font-body">{tag}</span>
                  ))}
                  {activeTrack.noLicense && (
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-[#C9A84C]/10 text-[#8a6a1a] border border-[#C9A84C]/25 font-body">No license needed</span>
                  )}
                  {activeTrack.license && (
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-[#C9A84C]/10 text-[#8a6a1a] border border-[#C9A84C]/25 font-body">License required</span>
                  )}
                </div>

                {/* Module list */}
                <div>
                  <p className="text-xs font-body font-semibold text-[#8A8070] uppercase tracking-wider mb-3">Course modules</p>
                  <div className="space-y-2">
                    {modules.slice(0, 4).map((title, idx) => (
                      <div key={title} className="flex items-center gap-3 p-3 rounded-lg border border-[#EDE8E2] bg-[#FAFAFA]">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={idx < freeModules
                            ? { background: theme.primary, color: 'white' }
                            : { background: '#F5F0EB', color: '#8A8070' }
                          }
                        >
                          {idx < freeModules ? <BookOpen size={13} /> : <Lock size={11} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-semibold text-[#1A1A18] text-xs truncate">{title}</p>
                          <p className="text-[#8A8070] text-xs">10 quiz questions</p>
                        </div>
                        {idx < freeModules
                          ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0"
                              style={{ color: theme.primary, background: `${theme.pale}`, borderColor: `${theme.primary}30` }}>
                              Free
                            </span>
                          : <span className="text-[10px] text-[#8A8070] flex-shrink-0">Enroll to unlock</span>
                        }
                      </div>
                    ))}
                    {modules.length > 4 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-[#DDD5C8]">
                        <div className="w-7 h-7 rounded-full bg-[#F5F0EB] flex items-center justify-center flex-shrink-0">
                          <Lock size={11} className="text-[#8A8070]" />
                        </div>
                        <p className="text-[#8A8070] font-body text-xs">
                          + {modules.length - 4} more {modules.length - 4 === 1 ? 'module' : 'modules'} — unlock with enrollment
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: enroll CTA */}
              <div className="p-7 flex flex-col">
                <div className="h-1 w-12 rounded-full mb-5" style={{ background: theme.primary }} />

                {activeTrack.isFoundation ? (
                  // Foundation has its own dedicated course page — send students there
                  // instead of duplicating the enrollment card here.
                  <>
                    <p className="text-[#5A4A3A] font-body text-sm leading-relaxed mb-6">
                      The Core Foundation is the starting point for every real estate career track.
                      Orientation and Module 1 are always free — no account needed to explore.
                    </p>
                    <Link
                      to="/courses/real-estate-foundation"
                      className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-lg font-body font-semibold text-white text-sm mb-3 transition-all hover:brightness-110 w-full"
                      style={{ background: theme.primary }}
                    >
                      View full course details <ArrowRight size={15} />
                    </Link>
                    <p className="text-center text-xs text-[#8A8070] font-body">
                      Orientation + Module 1 free · No account needed
                    </p>
                  </>
                ) : (
                  // All other tracks: show the full enrollment card
                  <>
                    <div className="font-display text-3xl font-bold text-[#1A1A18] mb-1">
                      ${catalog.price}
                    </div>
                    <p className="text-[#8A8070] text-sm font-body mb-5">One-time · 3 months access</p>

                    <button
                      onClick={() => handleDirectEnroll(activeTrack.slug)}
                      disabled={enrolling && enrollingSlug === activeTrack.slug}
                      className="flex items-center justify-center gap-2 py-3 px-5 rounded-lg font-body font-semibold text-white text-sm mb-3 transition-all hover:brightness-110 disabled:opacity-70 w-full"
                      style={{ background: theme.primary }}
                    >
                      {enrolling && enrollingSlug === activeTrack.slug
                        ? <><Loader2 size={15} className="animate-spin" /> Processing...</>
                        : <>Enroll now <ArrowRight size={15} /></>}
                    </button>

                    <button
                      onClick={() => handleFreeExplore(activeTrack.slug)}
                      disabled={freeEnrolling && freeEnrollingSlug === activeTrack.slug}
                      className="flex items-center justify-center gap-2 py-3 px-5 rounded-lg font-body font-semibold text-sm mb-6 border border-[#DDD5C8] text-[#5A4A3A] hover:bg-[#F5F0EB] transition-all w-full disabled:opacity-60"
                    >
                      {freeEnrolling && freeEnrollingSlug === activeTrack.slug
                        ? <><Loader2 size={14} className="animate-spin" /> Loading...</>
                        : <><BookOpen size={14} /> Explore free (Module 1)</>}
                    </button>

                    <div className="space-y-2 text-xs font-body text-[#5A4A3A]">
                      {[
                        `${catalog.modules.length} self-paced modules`,
                        `${catalog.quizCount} practice questions`,
                        `${catalog.glossaryCount} glossary terms`,
                        'Certificate of completion',
                        '3 months access',
                        'Module 1 always free',
                      ].map(item => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
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

      {/* ── PERSONALITY ── */}
      <div className="py-12 px-4 bg-white">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">Find Your Fit</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#1A1A18] mb-2">
            Which one <em className="text-[#C9A84C] not-italic">feels like you?</em>
          </h2>
          <p className="text-[#5A4A3A] font-body text-sm mb-6 max-w-lg">These aren't labels — they're starting points. Any personality can succeed in any path.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PERSONALITY_TYPES.map(({ type, desc, paths }) => (
              <div key={type} className="bg-[#F5F0EB] border border-[#DDD5C8] rounded-xl p-4">
                <h3 className="font-display font-bold text-[#1A1A18] text-sm mb-2">{type}</h3>
                <p className="text-[#5A4A3A] font-body text-xs leading-relaxed mb-3">{desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {paths.map(path => (
                    <span key={path} className="text-[10px] px-2 py-0.5 rounded bg-[#C9A84C]/10 text-[#8a6a1a] border border-[#C9A84C]/25 font-body">{path}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-[#F5F0EB] border border-[#DDD5C8] rounded-xl max-w-2xl">
            <p className="text-[#5A4A3A] font-body text-sm leading-relaxed">
              💡 <strong className="text-[#1A1A18]">Remember:</strong> These are suggestions, not rules. The most successful people in real estate are often a blend of several types. This is just a compass, not a cage.
            </p>
          </div>
        </div>
      </div>

      {/* ── START WITH FOUNDATION CTA ── */}
      <div className="py-14 px-4 bg-[#1E2A38]">
        <div className="page-container max-w-2xl mx-auto text-center">
          <div className="flex items-center gap-3 justify-center mb-5">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">Start Here</span>
            <div className="h-px w-8 bg-[#C9A84C]" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Not sure where to start?
          </h2>
          <p className="text-[#8A9BB0] font-body text-sm leading-relaxed mb-6">
            Begin with the Real Estate Core Foundation. It gives you the knowledge every path shares — and helps you decide which track is right for you. Module 1 is free.
          </p>
          <Link
            to="/courses/real-estate-foundation"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-body font-semibold text-[#1E2A38] transition-all hover:brightness-110"
            style={{ background: '#C9A84C' }}
          >
            Start with the Foundation <ArrowRight size={16} />
          </Link>
        </div>
      </div>

    </div>
  )
}
