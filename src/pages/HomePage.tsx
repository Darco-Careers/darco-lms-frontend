import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { coursesApi } from '@/api/courses'
import { COURSE_COLORS } from '@/types'
import type { Course } from '@/types'

// ── Career track data (from original darcoacademy.com) ──────────────────────
const CAREER_CARDS = [
  { slug: 'real-estate-foundation',          emoji: '🏛️', title: 'Real Estate Foundation',     tagline: 'The knowledge every path starts with',         tags: ['Start here', 'All tracks'],             noLicense: false },
  { slug: 'real-estate-residential-agent',   emoji: '🏠', title: 'Residential Agent',           tagline: 'Help people buy, sell & find homes',           tags: ['People skills', 'Commission-based'],    noLicense: false, license: true },
  { slug: 'real-estate-commercial',          emoji: '🏢', title: 'Commercial Real Estate',       tagline: 'Sales, leasing & investment properties',       tags: ['High earning', 'Relationship-driven'],  noLicense: false },
  { slug: 'real-estate-investing',           emoji: '🏘️', title: 'Real Estate Investing',        tagline: 'Apartments, multifamily & passive income',     tags: ['Passive income', 'Wealth building'],    noLicense: true },
  { slug: 'real-estate-property-management', emoji: '🔑', title: 'Property Management',         tagline: 'Run & operate income-producing properties',    tags: ['Organized', 'Steady income'],           noLicense: false },
  { slug: 'apartment-leasing',               emoji: '🏠', title: 'Apartment Leasing',            tagline: 'Lease, retain & build resident communities',   tags: ['Sales + service', 'LA market'],         noLicense: true },
  { slug: 'real-estate-development',         emoji: '🏗️', title: 'Real Estate Development',      tagline: 'Build, convert & create new properties',       tags: ['High risk/reward', 'Long-term'],        noLicense: false },
  { slug: 'real-estate-mortgage-lending',    emoji: '💵', title: 'Mortgage & Lending',           tagline: 'Finance the deals that make real estate move', tags: ['Detail oriented', 'Transaction based'], noLicense: false },
  { slug: 'real-estate-wholesaling',         emoji: '🔄', title: 'Wholesaling',                  tagline: 'Find deals & flip contracts for profit',       tags: ['Hustle required', 'Deal finding'],      noLicense: true },
  { slug: 'real-estate-maintenance-repair',  emoji: '🔧', title: 'Maintenance & Repair',         tagline: 'Keep properties running & in top shape',       tags: ['Hands-on work', 'Always in demand'],    noLicense: false },
  { slug: 'real-estate-photography',         emoji: '📸', title: 'Real Estate Photography',      tagline: 'Visual marketing for properties & agents',     tags: ['Creative', 'Flexible schedule'],        noLicense: false },
]

const TRADES_CARDS = [
  { slug: 'electrician',          emoji: '⚡', title: 'Electrician',           tagline: 'High demand, excellent pay. Wiring, panels, safety, and how to get hired.', color: '#1A2E4D' },
  { slug: 'construction-painting', emoji: '🖌️', title: 'Construction Painting', tagline: 'Professional painting of homes and commercial buildings — surface prep to finish.', color: '#4D2A1A' },
]

const PERSONALITY_TYPES = [
  { type: 'The People Person 🤝', desc: 'You light up in conversation. You remember names, build trust quickly, and love helping people.', paths: ['Residential Agent', 'Commercial Broker', 'Property Management'] },
  { type: 'The Numbers Mind 📊', desc: 'You love a good spreadsheet. You ask "does this make financial sense?" before anything else.', paths: ['RE Investing', 'Mortgage & Lending'] },
  { type: 'The Creative Eye 🎨', desc: 'You see potential where others see problems. You care deeply about how spaces look and feel.', paths: ['Photography', 'Development', 'Staging'] },
  { type: 'The Builder 🔨',       desc: "You're hands-on. You'd rather fix something than talk about fixing it.", paths: ['Maintenance & Repair', 'Electrician', 'Construction Painting'] },
  { type: 'The Organizer 📋',     desc: "Systems and checklists are your love language. Nothing falls through the cracks.", paths: ['Property Management', 'Mortgage Processing'] },
  { type: 'The Entrepreneur 🚀',  desc: "You think big. You're comfortable with risk. You want to own something, not just work for it.", paths: ['Investing', 'Development', 'Wholesaling'] },
  { type: 'The Researcher 🔍',    desc: 'You dig deep before deciding anything. You only move when you understand the full picture.', paths: ['RE Analysis', 'Appraiser', 'Investing'] },
  { type: 'The Hustler ⚡',       desc: "You move fast, grind hard, and thrive on the chase. You don't wait for opportunity.", paths: ['Wholesaling', 'Commercial Sales', 'Residential Agent'] },
]

function CourseCard({ card, course }: { card: typeof CAREER_CARDS[0]; course?: Course }) {
  const theme = COURSE_COLORS[card.slug]
  const isLight = card.slug === 'construction-painting'
  const borderColor = theme?.primary ?? '#1B4D3E'

  return (
    <Link
      to={`/courses/${card.slug}`}
      className="group bg-white rounded-xl border border-[#BCCAD8] hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col overflow-hidden"
    >
      <div className="h-1 w-full" style={{ backgroundColor: borderColor }} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">{card.emoji}</span>
          <div>
            <h3 className="font-display font-bold text-[#1A2433] text-sm leading-snug group-hover:text-[#1E2A38] transition-colors">
              {card.title}
            </h3>
            <p className="text-[#8A9AAA] text-xs mt-0.5">{card.tagline}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
          {card.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[#EEF2F6] text-[#4A5A6A] border border-[#BCCAD8]">
              {tag}
            </span>
          ))}
          {card.noLicense && (
            <span className="text-xs px-2 py-0.5 rounded bg-[#C9A84C]/10 text-[#8a6a1a] border border-[#C9A84C]/30">
              No license needed
            </span>
          )}
          {card.license && (
            <span className="text-xs px-2 py-0.5 rounded bg-[#C9A84C]/10 text-[#8a6a1a] border border-[#C9A84C]/30">
              License required
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#EEF2F6]">
          {course?.price && (
            <span className="font-display font-bold text-[#1E2A38] text-sm">${course.price}</span>
          )}
          <span className="flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2 ml-auto"
            style={{ color: borderColor }}>
            Dive deeper <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const { data } = useQuery({
    queryKey: ['courses'],
    queryFn: () => coursesApi.list(1, 20),
    staleTime: 60 * 60 * 1000,
  })

  const courses = data?.results ?? []
  const getCourse = (slug: string) => courses.find(c => c.slug === slug)

  return (
    <div className="bg-[#C8D4E0]">

      {/* ── HERO ── */}
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(120deg, rgba(20,30,48,0.88) 0%, rgba(20,30,48,0.70) 50%, rgba(20,30,48,0.40) 100%)'
          }}
        />

        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.4) 0%, transparent 60%)' }} />
        </div>

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
            <div className="mb-4">
              <div className="font-display italic text-5xl sm:text-6xl text-white font-normal leading-none">Darco</div>
              <div className="font-display text-5xl sm:text-7xl text-white font-bold leading-none">Academy</div>
            </div>

            <p className="font-display italic text-xl sm:text-2xl text-white/80 mb-5 font-normal">
              Build Your Foundation. Begin Your Journey.
            </p>

            <p className="font-body text-white/70 text-base leading-relaxed mb-8 max-w-lg">
              <strong className="text-white font-semibold">Darco gives you a foundation.</strong>{' '}
              Whether you're starting your first career or changing direction entirely — every path starts
              with the right preparation, the right mindset, and the courage to begin.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#paths"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-body font-semibold text-[#1E2A38] transition-all duration-200 hover:brightness-110"
                style={{ background: '#C9A84C' }}
              >
                Explore Career Paths <ArrowRight size={16} />
              </a>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-body font-semibold text-white border border-white/25 hover:bg-white/10 transition-all duration-200"
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #C8D4E0)' }} />
      </section>

      {/* ── INTRO STRIP ── */}
      <div className="bg-[#1E2A38] border-y border-[#2D3E52]">
        <div className="page-container py-4">
          <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center sm:justify-start">
            {[
              '13 career tracks',
              '1,160+ quiz questions',
              '700+ glossary terms',
              'No degree required',
              'Self-paced learning',
              'Los Angeles based',
            ].map(item => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                <span className="text-[#B8C8D8] text-xs font-body font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── REAL ESTATE ECOSYSTEM ── */}
      <section className="py-16 px-4 bg-white">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">The Big Picture</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-[#1A2433] mb-2">
            Real estate is an <em className="text-[#C9A84C] not-italic">ecosystem</em>
          </h2>
          <p className="text-[#4A5A6A] font-body mb-8 max-w-xl">
            Every part plays a different role — but they all depend on each other. No single person does everything.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { emoji: '🏗️', title: 'Creation',           desc: 'Developers, architects & contractors who conceive, design, and build the physical structures.' },
              { emoji: '💰', title: 'Investment',          desc: 'Investors & owners who purchase properties to generate income and build long-term wealth.' },
              { emoji: '🤝', title: 'Transactions',        desc: 'Agents, brokers & attorneys who facilitate the buying, selling, and leasing of property.' },
              { emoji: '🔧', title: 'Operations',          desc: 'Property managers & maintenance teams who keep buildings running and tenants happy.' },
              { emoji: '📊', title: 'Finance & Lending',   desc: 'Mortgage brokers & lenders who make it possible for people to afford real estate.' },
              { emoji: '📸', title: 'Marketing & Media',   desc: 'Photographers, marketers & stagers who present and sell real estate to the world.' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-[#EEF2F6] border border-[#BCCAD8] rounded-xl p-5 hover:border-[#C9A84C]/40 transition-colors">
                <div className="text-2xl mb-3">{emoji}</div>
                <h3 className="font-display font-bold text-[#1A2433] text-sm mb-1">{title}</h3>
                <p className="text-[#8A9AAA] text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREER PATHS ── */}
      <section id="paths" className="py-16 px-4 bg-[#C8D4E0]">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">Career Paths</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-[#1A2433] mb-2">
            Every door leads <em className="text-[#C9A84C] not-italic">somewhere different</em>
          </h2>
          <p className="text-[#4A5A6A] font-body mb-8 max-w-xl">
            Real estate isn't one career — it's a dozen careers that all live under the same roof.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAREER_CARDS.map(card => (
              <CourseCard key={card.slug} card={card} course={getCourse(card.slug)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TRADES ── */}
      <section className="py-16 px-4 bg-[#1E2A38]">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">Trades & Construction</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">
            Hands-on careers. <em className="text-[#C9A84C] not-italic">Always in demand.</em>
          </h2>
          <p className="text-[#8A9BB0] font-body mb-8 max-w-xl">
            Skilled tradespeople are needed everywhere in real estate — and they command excellent rates.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            {TRADES_CARDS.map(card => (
              <Link
                key={card.slug}
                to={`/courses/${card.slug}`}
                className="group rounded-xl p-6 border border-white/10 hover:border-[#C9A84C]/40 transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: card.color }}
              >
                <div className="text-2xl mb-3">{card.emoji}</div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{card.title}</h3>
                <p className="text-white/60 font-body text-sm leading-relaxed mb-4">{card.tagline}</p>
                <span className="flex items-center gap-1 text-xs font-semibold text-[#E8C97A] group-hover:gap-2 transition-all duration-200">
                  Explore track <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIND YOUR FIT ── */}
      <section className="py-16 px-4 bg-white">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">Find Your Fit</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-[#1A2433] mb-2">
            Which one <em className="text-[#C9A84C] not-italic">feels like you?</em>
          </h2>
          <p className="text-[#4A5A6A] font-body mb-8 max-w-xl">
            Every person brings something different. These aren't labels — they're starting points.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PERSONALITY_TYPES.map(({ type, desc, paths }) => (
              <div key={type} className="bg-[#EEF2F6] border border-[#BCCAD8] rounded-xl p-5">
                <h3 className="font-display font-bold text-[#1A2433] text-sm mb-2">{type}</h3>
                <p className="text-[#4A5A6A] font-body text-xs leading-relaxed mb-3">{desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {paths.map(path => (
                    <span key={path} className="text-xs px-2 py-0.5 rounded bg-[#C9A84C]/10 text-[#8a6a1a] border border-[#C9A84C]/25 font-body">
                      {path}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-[#EEF2F6] border border-[#BCCAD8] rounded-xl max-w-2xl">
            <p className="text-[#4A5A6A] font-body text-sm leading-relaxed">
              💡 <strong className="text-[#1A2433]">Important:</strong> These are suggestions, not rules.
              The most successful people in real estate are often a blend of several types.
              Any personality can succeed in any path. This is just a compass, not a cage.
            </p>
          </div>
        </div>
      </section>

      {/* ── PROMISE / CTA ── */}
      <section className="py-20 px-4 bg-[#1E2A38]">
        <div className="page-container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center gap-3 justify-center mb-6">
              <div className="h-px w-8 bg-[#C9A84C]" />
              <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">You're Ready</span>
              <div className="h-px w-8 bg-[#C9A84C]" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Now let's build your <em className="text-[#C9A84C] not-italic">foundation</em>
            </h2>
            <p className="text-[#8A9BB0] font-body text-base leading-relaxed mb-8">
              You've seen the full picture. You have a sense of the landscape, the careers, and where
              you might naturally fit. Now it's time to build the knowledge that every successful
              real estate professional shares — no matter which path they chose.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/courses/real-estate-foundation"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-body font-semibold text-[#1E2A38] transition-all hover:brightness-110"
                style={{ background: '#C9A84C' }}
              >
                Begin with the Foundation <ArrowRight size={16} />
              </Link>
              <a href="#paths" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-body font-semibold text-white border border-white/25 hover:bg-white/10 transition-all">
                Explore Career Paths
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 justify-center text-sm font-body text-[#8A9BB0]">
              {['Free to browse', 'No degree required', 'Self-paced', 'Certificate on completion'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#C9A84C]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
