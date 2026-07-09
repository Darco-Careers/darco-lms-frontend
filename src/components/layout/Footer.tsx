import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#122840] text-[#7A9AB8]">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#1A3A5C] border border-[#2A5080] rounded-lg flex items-center justify-center">
                <span className="font-display font-bold text-[#E8C97A] text-base">D</span>
              </div>
              <div>
                <div className="font-display font-bold text-white text-base tracking-wide">Darco Academy</div>
                <div className="font-body text-[#7A9AB8] text-[10px] uppercase tracking-widest">Your Career. Your Path.</div>
              </div>
            </div>
            <p className="text-sm font-body leading-relaxed text-[#7A9AB8]">
              Serving anyone who wants to work hard and succeed.
              Real skills. Real careers. Real impact.
            </p>
          </div>

          {/* Career Tracks */}
          <div>
            <h4 className="font-body font-semibold text-white mb-4 text-xs uppercase tracking-wider">Career Tracks</h4>
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
                  <Link to={href} className="text-[#7A9AB8] hover:text-[#E8C97A] transition-colors duration-200 font-body">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body font-semibold text-white mb-4 text-xs uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-[#7A9AB8] hover:text-[#E8C97A] transition-colors font-body">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#7A9AB8] hover:text-[#E8C97A] transition-colors font-body">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="mailto:info@darcocenter.org" className="text-[#7A9AB8] hover:text-[#E8C97A] transition-colors font-body">
                  info@darcocenter.org
                </a>
              </li>
              <li>
                <a href="tel:+18186870188" className="text-[#7A9AB8] hover:text-[#E8C97A] transition-colors font-body">
                  (818) 687-0188
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-body font-semibold text-white mb-4 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://darcoacademy.com/about.html" target="_blank" rel="noopener noreferrer"
                  className="text-[#7A9AB8] hover:text-[#E8C97A] transition-colors font-body">
                  About & Philosophy
                </a>
              </li>
              <li>
                <a href="https://darcoinc.org" target="_blank" rel="noopener noreferrer"
                  className="text-[#7A9AB8] hover:text-[#E8C97A] transition-colors font-body">
                  DARCO Inc. (Parent Company)
                </a>
              </li>
              <li>
                <Link to="/login" className="text-[#7A9AB8] hover:text-[#E8C97A] transition-colors font-body">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-[#7A9AB8] hover:text-[#E8C97A] transition-colors font-body">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1E4A70] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-start gap-3">
          <p className="text-[#4A6A88] text-sm font-body flex-shrink-0">
            © {new Date().getFullYear()} DARCO Inc. All rights reserved.
          </p>
          <p className="text-[#4A6A88] text-xs font-body text-right">
            Educational content only. Course materials are for general informational purposes and do not constitute legal, professional, or licensing advice. Always verify current licensing requirements with your state or local authority. DARCO Academy makes no guarantees regarding employment outcomes.
          </p>
        </div>
      </div>
    </footer>
  )
}
