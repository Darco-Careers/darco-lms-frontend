import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col">
      {/* Logo bar */}
      <div className="px-6 py-5">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center">
            <span className="font-display font-bold text-white text-sm">D</span>
          </div>
          <span className="font-display font-bold text-white text-xl">DARCO Academy</span>
        </Link>
      </div>

      {/* Auth card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Footer note */}
      <div className="px-6 py-4 text-center">
        <p className="text-navy-200 text-sm font-body">
          © {new Date().getFullYear()} DARCO Inc. — Cradle to Career
        </p>
      </div>
    </div>
  )
}
