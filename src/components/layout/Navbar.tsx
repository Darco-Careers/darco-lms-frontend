import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
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

  return (
    <nav className="bg-white border-b border-[#BCCAD8] sticky top-0 z-50 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo — matches darcoacademy.com exactly */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-[#1E2A38] rounded-lg flex items-center justify-center shadow-sm">
              <span className="font-display font-bold text-[#C9A84C] text-base">D</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-[#1A2433] text-base leading-tight tracking-wide">
                Darco Academy
              </div>
              <div className="font-body text-[#8A9AAA] text-[10px] uppercase tracking-widest leading-none">
                Your Career. Your Path.
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="/#paths" className="font-body font-medium text-sm text-[#4A5A6A] hover:text-[#1A2433] transition-colors">
              Career Paths
            </a>
            <Link to="/about" className="font-body font-medium text-sm text-[#4A5A6A] hover:text-[#1A2433] transition-colors">
              About & Philosophy
            </Link>
            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `font-body font-medium text-sm transition-colors ${isActive ? 'text-[#C9A84C]' : 'text-[#4A5A6A] hover:text-[#1A2433]'}`
                }
              >
                Dashboard
              </NavLink>
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-[#8A9AAA] font-body">
                  {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-body font-medium text-[#4A5A6A] hover:text-[#1A2433] transition-colors"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-body font-medium text-sm text-[#4A5A6A] hover:text-[#1A2433] transition-colors px-3 py-2"
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
            className="md:hidden p-2 text-[#4A5A6A] hover:text-[#1A2433]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#BCCAD8] bg-white">
          <div className="page-container py-4 space-y-1">
            <a href="/#paths" className="block px-3 py-2.5 rounded-lg text-[#4A5A6A] hover:bg-[#EEF2F6] font-body font-medium text-sm" onClick={() => setMobileOpen(false)}>
              Career Paths
            </a>
            {isAuthenticated && (
              <Link to="/dashboard" className="block px-3 py-2.5 rounded-lg text-[#4A5A6A] hover:bg-[#EEF2F6] font-body font-medium text-sm" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
            )}
            <div className="pt-3 border-t border-[#EEF2F6] mt-2 space-y-2">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-[#4A5A6A] hover:bg-[#EEF2F6] font-body font-medium text-sm flex items-center gap-2">
                  <LogOut size={16} /> Sign out
                </button>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2.5 rounded-lg text-[#4A5A6A] hover:bg-[#EEF2F6] font-body font-medium text-sm" onClick={() => setMobileOpen(false)}>
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
