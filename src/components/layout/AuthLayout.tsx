import { Outlet, Link } from 'react-router-dom'

const QUOTES = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Every expert was once a beginner. Every professional was once an amateur.",
    author: "Robin Sharma",
  },
  {
    text: "Your career is a garden. Plant it with purpose, water it with effort.",
    author: "DARCO Academy",
  },
]

// Pick a stable quote based on the day so it doesn't flicker on re-render
const quote = QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length]

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL — hero image + quote ── */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between relative overflow-hidden"
        style={{
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(20,30,48,0.92) 0%, rgba(20,30,48,0.75) 60%, rgba(20,30,48,0.55) 100%)' }}
        />
        {/* Gold glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 20% 70%, rgba(201,168,76,0.15) 0%, transparent 55%)' }} />

        {/* Logo top-left */}
        <div className="relative z-10 p-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C9A84C] rounded-lg flex items-center justify-center shadow-lg">
              <span className="font-display font-bold text-[#1E2A38] text-lg">D</span>
            </div>
            <div>
              <div className="font-display font-bold text-white text-lg leading-tight">Darco Academy</div>
              <div className="font-body text-[#C9A84C] text-[10px] uppercase tracking-widest">Your Career. Your Path.</div>
            </div>
          </Link>
        </div>

        {/* Quote bottom-left */}
        <div className="relative z-10 p-8 pb-12">
          {/* Accent line */}
          <div className="w-10 h-0.5 bg-[#C9A84C] mb-5" />
          <blockquote className="font-display text-xl sm:text-2xl font-medium text-white leading-relaxed mb-4 max-w-sm">
            "{quote.text}"
          </blockquote>
          <p className="font-body text-[#C9A84C] text-sm font-semibold">— {quote.author}</p>

          {/* Stats strip */}
          <div className="mt-8 flex flex-wrap gap-5">
            {[
              { num: '13', label: 'Career Tracks' },
              { num: '100%', label: 'Self-Paced' },
              { num: 'Free', label: 'Module 1 Always' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-display text-2xl font-bold text-white">{num}</div>
                <div className="font-body text-[#8A9BB0] text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="flex-1 flex flex-col bg-[#F4F7FA]">
        {/* Mobile logo (only visible on small screens) */}
        <div className="lg:hidden px-6 py-5 bg-[#1E2A38]">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C9A84C] rounded-lg flex items-center justify-center">
              <span className="font-display font-bold text-[#1E2A38] text-sm">D</span>
            </div>
            <span className="font-display font-bold text-white text-xl">DARCO Academy</span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

        {/* Footer note */}
        <div className="px-6 py-4 text-center border-t border-[#DDD5C8]">
          <p className="text-[#8A8070] text-xs font-body">
            © {new Date().getFullYear()} DARCO Inc. — Serving anyone who wants to work hard and succeed.
          </p>
        </div>
      </div>
    </div>
  )
}
