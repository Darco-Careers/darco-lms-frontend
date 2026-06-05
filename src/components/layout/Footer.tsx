import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#1A2433] text-[#8A9BB0]">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#1E2A38] border border-[#2D3E52] rounded-lg flex items-center justify-center">
                <span className="font-display font-bold text-[#C9A84C] text-base">D</span>
              </div>
              <div>
                <div className="font-display font-bold text-white text-base tracking-wide">Darco Academy</div>
                <div className="font-body text-[#8A9AAA] text-[10px] uppercase tracking-widest">Your Career. Your Path.</div>
              </div>
            </div>
            <p className="text-sm font-body leading-relaxed text-[#8A9BB0]">
              Career foundation training for the Los Angeles community.
              Real skills. Real careers. Real impact.
            </p>
            <p className="text-xs text-[#4A5A6A] font-body mt-3">In partnership with Chabad SOLA</p>
          </div>

          {/* Career Paths */}
          <div>
            <h4 className="font-body font-semibold text-white mb-4 text-xs uppercase tracking-wider">Career Tracks</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Real Estate Foundation', '/courses/real-estate-foundation'],
                ['Residential Agent', '/courses/real-estate-residential-agent'],
                ['Property Management', '/courses/real-estate-property-management'],
                ['Apartment Leasing', '/courses/apartment-leasing'],
                ['Electrician', '/courses/electrician'],
                ['Construction Painting', '/courses/construction-painting'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-[#8A9BB0] hover:text-[#C9A84C] transition-colors duration-200 font-body">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-body font-semibold text-white mb-4 text-xs uppercase tracking-wider">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://darcoacademy.com/about.html" target="_blank" rel="noopener noreferrer"
                  className="text-[#8A9BB0] hover:text-[#C9A84C] transition-colors font-body">
                  About & Philosophy
                </a>
              </li>
              <li>
                <a href="https://darcoinc.org" target="_blank" rel="noopener noreferrer"
                  className="text-[#8A9BB0] hover:text-[#C9A84C] transition-colors font-body">
                  DARCO Inc.
                </a>
              </li>
              <li>
                <Link to="/login" className="text-[#8A9BB0] hover:text-[#C9A84C] transition-colors font-body">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-[#8A9BB0] hover:text-[#C9A84C] transition-colors font-body">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2D3E52] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[#4A5A6A] text-sm font-body">
            © {new Date().getFullYear()} DARCO Inc. All rights reserved.
          </p>
          <p className="text-[#4A5A6A] text-xs font-body">
            Educational content only. Always verify local licensing requirements.
          </p>
        </div>
      </div>
    </footer>
  )
}
