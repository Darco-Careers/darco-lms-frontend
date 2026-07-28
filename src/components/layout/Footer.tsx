import { Link } from 'react-router-dom'
import { useTrackThemeStore } from '@/store/trackThemeStore'

export default function Footer() {
  const theme = useTrackThemeStore((s) => s.theme)

  // When a track theme is active, use its primary color family.
  // Otherwise fall back to the default neutral palette.
  const bg        = theme ? theme.primary          : '#1A2332'
  const border    = theme ? 'rgba(255,255,255,0.08)' : '#1E3A55'
  const headingColor = '#FFFFFF'
  const linkColor    = theme ? 'rgba(255,255,255,0.65)' : '#7A9AB8'
  const linkHover    = theme ? theme.light           : '#E8C97A'
  const bodyText     = theme ? 'rgba(255,255,255,0.55)' : '#7A9AB8'
  const mutedText    = theme ? 'rgba(255,255,255,0.30)' : '#4A6A88'
  const logoBg       = theme ? 'rgba(255,255,255,0.12)' : '#1A3A5C'
  const logoBorder   = theme ? 'rgba(255,255,255,0.20)' : '#2A5080'
  const dividerColor = theme ? 'rgba(255,255,255,0.10)' : '#1E4A70'

  return (
    <footer style={{ background: bg, color: bodyText }}>
      <div className="page-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: logoBg, border: `1px solid ${logoBorder}` }}
              >
                <span className="font-display font-bold text-[#E8C97A] text-base">D</span>
              </div>
              <div>
                <div className="font-display font-bold text-base tracking-wide" style={{ color: headingColor }}>
                  Darco Academy
                </div>
                <div className="font-body text-[10px] uppercase tracking-widest" style={{ color: linkColor }}>
                  Your Career. Your Path.
                </div>
              </div>
            </div>
            <p className="text-sm font-body leading-relaxed" style={{ color: bodyText }}>
              Serving anyone who wants to work hard and succeed.
              Real skills. Real careers. Real impact.
            </p>
          </div>

          {/* Career Tracks */}
          <div>
            <h4 className="font-body font-semibold mb-4 text-xs uppercase tracking-wider" style={{ color: headingColor }}>
              Career Tracks
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Real Estate Foundation', '/real-estate'],
                ['Residential Agent', '/courses/real-estate-residential-agent'],
                ['Property Management', '/courses/real-estate-property-management'],
                ['Apartment Leasing', '/courses/real-estate-leasing'],
                ['Electrician', '/courses/electrician'],
                ['Construction Painting', '/courses/construction-painting'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="font-body transition-colors duration-200"
                    style={{ color: linkColor }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body font-semibold mb-4 text-xs uppercase tracking-wider" style={{ color: headingColor }}>
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'FAQ', to: '/faq', internal: true },
                { label: 'Contact Us', to: '/contact', internal: true },
                { label: 'info@darcocenter.org', to: 'mailto:info@darcocenter.org', internal: false },
                { label: '(818) 687-0188', to: 'tel:+18186870188', internal: false },
              ].map(({ label, to, internal }) => (
                <li key={to}>
                  {internal ? (
                    <Link
                      to={to}
                      className="font-body transition-colors"
                      style={{ color: linkColor }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={to}
                      className="font-body transition-colors"
                      style={{ color: linkColor }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-body font-semibold mb-4 text-xs uppercase tracking-wider" style={{ color: headingColor }}>
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://darcoacademy.com/about.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body transition-colors"
                  style={{ color: linkColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
                >
                  About &amp; Philosophy
                </a>
              </li>
              <li>
                <a
                  href="https://darcoinc.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body transition-colors"
                  style={{ color: linkColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
                >
                  DARCO Inc. (Parent Company)
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  className="font-body transition-colors"
                  style={{ color: linkColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
                >
                  Student Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="font-body transition-colors"
                  style={{ color: linkColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row justify-between items-start gap-3"
          style={{ borderTop: `1px solid ${dividerColor}` }}
        >
          <p className="text-sm font-body flex-shrink-0" style={{ color: mutedText }}>
            © {new Date().getFullYear()} DARCO Inc. All rights reserved.
          </p>
          <p className="text-xs font-body text-right" style={{ color: mutedText }}>
            Educational content only. Course materials are for general informational purposes and do not constitute
            legal, professional, or licensing advice. Always verify current licensing requirements with your state
            or local authority. DARCO Academy makes no guarantees regarding employment outcomes.
          </p>
        </div>
      </div>
    </footer>
  )
}
