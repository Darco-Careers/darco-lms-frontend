import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-200 mt-auto">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="font-display font-bold text-white text-sm">D</span>
              </div>
              <span className="font-display font-bold text-white text-lg">DARCO Academy</span>
            </div>
            <p className="text-sm text-navy-300 font-body leading-relaxed">
              Cradle-to-career education for the Los Angeles community. 
              Real skills. Real careers. Real impact.
            </p>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-body font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Career Tracks
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Real Estate Foundation', '/courses/real-estate-foundation'],
                ['Electrician', '/courses/electrician'],
                ['Construction Painting', '/courses/construction-painting'],
                ['Apartment Leasing', '/courses/apartment-leasing'],
                ['Property Management', '/courses/real-estate-property-management'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-navy-300 hover:text-brand-400 transition-colors duration-200 font-body">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-body font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              About DARCO
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://darcoinc.org" target="_blank" rel="noopener noreferrer"
                  className="text-navy-300 hover:text-brand-400 transition-colors duration-200 font-body">
                  DARCO Inc.
                </a>
              </li>
              <li>
                <span className="text-navy-400 font-body">In partnership with Chabad SOLA</span>
              </li>
              <li>
                <Link to="/login" className="text-navy-300 hover:text-brand-400 transition-colors duration-200 font-body">
                  Student Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-navy-400 text-sm font-body">
            © {new Date().getFullYear()} DARCO Inc. All rights reserved.
          </p>
          <p className="text-navy-500 text-xs font-body">
            Los Angeles, California
          </p>
        </div>
      </div>
    </footer>
  )
}
