import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Tag } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleCareerPaths = () => {
    setMobileOpen(false)
    if (location.pathname === '/') {
      // Already on homepage — just scroll
      const el = document.getElementById('tracks')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Navigate to homepage then scroll after render
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById('tracks')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  const handleLogout = async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    clearAuth()
    navigate('/')
    setMobileOpen(false)
  }

  return (
    <nav className="bg-white border-b border-[#DDD5C8] sticky top-0 z-50 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-[#1E2A38] rounded-lg flex items-center justify-center shadow-sm">
              <span className="font-display font-bold text-[#C9A84C] text-base">D</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-[#1A1A18] text-base leading-tight tracking-wide">
                Darco Academy
              </div>
              <div className="font-body text-[#8A8070] text-[10px] uppercase tracking-widest leading-none">
                Your Career. Your Path.
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={handleCareerPaths} className="font-body font-medium text-sm text-[#5A4A3A] hover:text-[#1A1A18] transition-colors">
              Career Paths
            </button>
            <NavLink
              to="/faq"
              className={({ isActive }) =>
                `font-body font-medium text-sm transition-colors ${isActive ? 'text-[#C9A84C]' : 'text-[#5A4A3A] hover:text-[#1A1A18]'}`
              }
            >
              FAQ
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `font-body font-medium text-sm transition-colors ${isActive ? 'text-[#C9A84C]' : 'text-[#5A4A3A] hover:text-[#1A1A18]'}`
              }
            >
              Contact
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `font-body font-medium text-sm transition-colors ${isActive ? 'text-[#C9A84C]' : 'text-[#5A4A3A] hover:text-[#1A1A18]'}`
                }
              >
                Dashboard
              </NavLink>
            )}
            {isAuthenticated && user && ['school_admin', 'platform_admin'].includes(user.role) && (
              <NavLink
                to="/admin/promo-codes"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 font-body font-medium text-sm transition-colors ${isActive ? 'text-[#C9A84C]' : 'text-[#5A4A3A] hover:text-[#1A1A18]'}`
                }
              >
                <Tag size={14} /> Promo Codes
              </NavLink>
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-[#8A8070] font-body">
                  {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-body font-medium text-[#5A4A3A] hover:text-[#1A1A18] transition-colors"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-body font-medium text-sm text-[#5A4A3A] hover:text-[#1A1A18] transition-colors px-3 py-2"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="font-body font-semibold text-sm px-5 py-2.5 rounded-lg text-[#1E2A38] transition-all hover:brightness-110"
                  style={{ background: '#C9A84C' }}
                >
                  Begin Your Path →
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#5A4A3A] hover:text-[#1A1A18]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#DDD5C8] bg-white">
          <div className="page-container py-4 space-y-1">
            <button onClick={handleCareerPaths} className="block w-full text-left px-3 py-2.5 rounded-lg text-[#5A4A3A] hover:bg-[#F5F0EB] font-body font-medium text-sm">
              Career Paths
            </button>
            <Link to="/faq" className="block px-3 py-2.5 rounded-lg text-[#5A4A3A] hover:bg-[#F5F0EB] font-body font-medium text-sm" onClick={() => setMobileOpen(false)}>
              FAQ
            </Link>
            <Link to="/contact" className="block px-3 py-2.5 rounded-lg text-[#5A4A3A] hover:bg-[#F5F0EB] font-body font-medium text-sm" onClick={() => setMobileOpen(false)}>
              Contact
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="block px-3 py-2.5 rounded-lg text-[#5A4A3A] hover:bg-[#F5F0EB] font-body font-medium text-sm" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
            )}
            {isAuthenticated && user && ['school_admin', 'platform_admin'].includes(user.role) && (
              <Link to="/admin/promo-codes" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[#5A4A3A] hover:bg-[#F5F0EB] font-body font-medium text-sm" onClick={() => setMobileOpen(false)}>
                <Tag size={15} /> Promo Codes
              </Link>
            )}
            <div className="pt-3 border-t border-[#EDE8E2] mt-2 space-y-2">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-[#5A4A3A] hover:bg-[#F5F0EB] font-body font-medium text-sm flex items-center gap-2">
                  <LogOut size={16} /> Sign out
                </button>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2.5 rounded-lg text-[#5A4A3A] hover:bg-[#F5F0EB] font-body font-medium text-sm" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center py-2.5 rounded-lg font-body font-semibold text-sm text-[#1E2A38]"
                    style={{ background: '#C9A84C' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Begin Your Path →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
