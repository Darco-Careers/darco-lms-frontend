import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, BookOpen, LayoutDashboard, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    clearAuth()
    navigate('/')
    setMobileOpen(false)
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-body font-medium text-sm transition-colors duration-200 ${
      isActive ? 'text-brand-500' : 'text-surface-600 hover:text-surface-900'
    }`

  return (
    <nav className="bg-white border-b border-surface-200 sticky top-0 z-50">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="font-display font-bold text-white text-sm">D</span>
            </div>
            <span className="font-display font-bold text-navy-900 text-lg hidden sm:block">
              DARCO Academy
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>Courses</NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-surface-500 font-body">
                  {user?.name?.split(' ')[0]}
                </span>
                <button onClick={handleLogout} className="btn-ghost text-sm py-1.5">
                  <LogOut size={15} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm py-2">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-200 bg-white animate-fade-in">
          <div className="page-container py-4 space-y-1">
            <NavLink
              to="/"
              end
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-surface-700 hover:bg-surface-50 font-body font-medium"
              onClick={() => setMobileOpen(false)}
            >
              <BookOpen size={18} />
              Courses
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-surface-700 hover:bg-surface-50 font-body font-medium"
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>
            )}
            <div className="pt-2 border-t border-surface-100 mt-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 text-sm text-surface-500">
                    <User size={16} />
                    {user?.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-surface-700 hover:bg-surface-50 font-body font-medium"
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link to="/login" className="btn-secondary w-full" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                  <Link to="/register" className="btn-primary w-full" onClick={() => setMobileOpen(false)}>
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
