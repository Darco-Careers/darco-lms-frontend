import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Tag } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useTrackThemeStore } from '@/store/trackThemeStore'
import { authApi } from '@/api/auth'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user, clearAuth } = useAuthStore()
  const theme = useTrackThemeStore((s) => s.theme)
  const navigate = useNavigate()
  const location = useLocation()

  const handleCareerPaths = () => {
    setMobileOpen(false)
    if (location.pathname === '/') {
      const el = document.getElementById('tracks')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
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

  // Track-aware color tokens
  const isThemed = !!theme
  const navBg        = isThemed ? theme!.primary          : '#FFFFFF'
  const navBorder    = isThemed ? 'transparent'            : '#DDD5C8'
  const navShadow    = isThemed ? '0 2px 20px rgba(0,0,0,0.18)' : '0 1px 3px rgba(0,0,0,0.06)'
  const logoIconBg   = isThemed ? 'rgba(255,255,255,0.15)' : '#1E2A38'
  const logoIconBorder = isThemed ? 'rgba(255,255,255,0.25)' : 'transparent'
  const logoLetterColor = '#E8C97A'  // gold — works on both dark and light
  const brandNameColor  = isThemed ? '#FFFFFF'             : '#1A1A18'
  const taglineColor    = isThemed ? 'rgba(255,255,255,0.55)' : '#8A8070'
  const linkColor       = isThemed ? 'rgba(255,255,255,0.75)' : '#5A4A3A'
  const linkHoverColor  = isThemed ? '#E8C97A'             : '#1A1A18'
  const activeLinkColor = '#E8C97A'  // gold active state works on both
  const mobileMenuBg    = isThemed ? theme!.primary        : '#FFFFFF'
  const mobileDivider   = isThemed ? 'rgba(255,255,255,0.12)' : '#EDE8E2'
  const mobileHoverBg   = isThemed ? 'rgba(255,255,255,0.10)' : '#F5F0EB'
  const ctaBg           = '#C9A84C'  // gold CTA — consistent across themes
  const ctaText         = isThemed ? '#1A1A18'             : '#1E2A38'

  const navLinkClass = (isActive: boolean) =>
    `font-body font-medium text-sm transition-colors`

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: navBg,
        borderBottom: `1px solid ${navBorder}`,
        boxShadow: navShadow,
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0"
              style={{ background: logoIconBg, border: `1px solid ${logoIconBorder}` }}
            >
              <span className="font-display font-bold text-base" style={{ color: logoLetterColor }}>D</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-base leading-tight tracking-wide" style={{ color: brandNameColor }}>
                Darco Academy
              </div>
              <div className="font-body text-[10px] uppercase tracking-widest leading-none" style={{ color: taglineColor }}>
                Your Career. Your Path.
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={handleCareerPaths}
              className={navLinkClass(false)}
              style={{ color: linkColor }}
              onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
            >
              Career Paths
            </button>
            <NavLink
              to="/faq"
              className={({ isActive }) => navLinkClass(isActive)}
              style={({ isActive }) => ({ color: isActive ? activeLinkColor : linkColor })}
              onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
              onMouseLeave={(e) => {
                // Only reset if not active
                if (!e.currentTarget.getAttribute('aria-current')) {
                  e.currentTarget.style.color = linkColor
                }
              }}
            >
              FAQ
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => navLinkClass(isActive)}
              style={({ isActive }) => ({ color: isActive ? activeLinkColor : linkColor })}
              onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
              onMouseLeave={(e) => {
                if (!e.currentTarget.getAttribute('aria-current')) {
                  e.currentTarget.style.color = linkColor
                }
              }}
            >
              Contact
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) => navLinkClass(isActive)}
                style={({ isActive }) => ({ color: isActive ? activeLinkColor : linkColor })}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.getAttribute('aria-current')) {
                    e.currentTarget.style.color = linkColor
                  }
                }}
              >
                Dashboard
              </NavLink>
            )}
            {isAuthenticated && user && ['school_admin', 'platform_admin'].includes(user.role) && (
              <NavLink
                to="/admin/promo-codes"
                className={({ isActive }) => `flex items-center gap-1.5 ${navLinkClass(isActive)}`}
                style={({ isActive }) => ({ color: isActive ? activeLinkColor : linkColor })}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.getAttribute('aria-current')) {
                    e.currentTarget.style.color = linkColor
                  }
                }}
              >
                <Tag size={14} /> Promo Codes
              </NavLink>
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-body" style={{ color: taglineColor }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-body font-medium transition-colors"
                  style={{ color: linkColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
                >
                  <LogOut size={15} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-body font-medium text-sm px-3 py-2 transition-colors"
                  style={{ color: linkColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="font-body font-semibold text-sm px-5 py-2.5 rounded-lg transition-all hover:brightness-110"
                  style={{ background: ctaBg, color: ctaText }}
                >
                  Begin Your Path →
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 transition-colors"
            style={{ color: linkColor }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{ background: mobileMenuBg, borderTop: `1px solid ${mobileDivider}` }}
        >
          <div className="page-container py-4 space-y-1">
            <button
              onClick={handleCareerPaths}
              className="block w-full text-left px-3 py-2.5 rounded-lg font-body font-medium text-sm transition-colors"
              style={{ color: linkColor }}
              onMouseEnter={(e) => (e.currentTarget.style.background = mobileHoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Career Paths
            </button>
            <Link
              to="/faq"
              className="block px-3 py-2.5 rounded-lg font-body font-medium text-sm transition-colors"
              style={{ color: linkColor }}
              onClick={() => setMobileOpen(false)}
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2.5 rounded-lg font-body font-medium text-sm transition-colors"
              style={{ color: linkColor }}
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="block px-3 py-2.5 rounded-lg font-body font-medium text-sm transition-colors"
                style={{ color: linkColor }}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {isAuthenticated && user && ['school_admin', 'platform_admin'].includes(user.role) && (
              <Link
                to="/admin/promo-codes"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg font-body font-medium text-sm transition-colors"
                style={{ color: linkColor }}
                onClick={() => setMobileOpen(false)}
              >
                <Tag size={15} /> Promo Codes
              </Link>
            )}
            <div className="pt-3 mt-2 space-y-2" style={{ borderTop: `1px solid ${mobileDivider}` }}>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-lg font-body font-medium text-sm flex items-center gap-2 transition-colors"
                  style={{ color: linkColor }}
                >
                  <LogOut size={16} /> Sign out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2.5 rounded-lg font-body font-medium text-sm transition-colors"
                    style={{ color: linkColor }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center py-2.5 rounded-lg font-body font-semibold text-sm transition-all hover:brightness-110"
                    style={{ background: ctaBg, color: ctaText }}
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
