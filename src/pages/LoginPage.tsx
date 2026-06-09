import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { freeEnrollmentApi } from '@/api/progress'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const nextParam = searchParams.get('next')
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await authApi.login(form)
      setAuth(data.user, data.token, data.refresh_token)

      // Handle free enrollment redirect
      if (nextParam && nextParam.endsWith('/free')) {
        const slug = nextParam.replace('/courses/', '').replace('/free', '')
        try {
          const enrollment = await freeEnrollmentApi.enroll(slug)
          navigate(`/courses/${slug}/lesson/${enrollment.first_lesson_id}`, { replace: true })
        } catch {
          navigate(`/courses/${slug}`, { replace: true })
        }
      } else if (nextParam) {
        navigate(nextParam, { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-6 bg-[#C9A84C]" />
          <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">
            Welcome back
          </span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#1A2433] mb-2">
          Sign in to continue
        </h1>
        <p className="text-[#8A9AAA] font-body text-sm">
          {nextParam?.endsWith('/free')
            ? 'Sign in to access your free Module 1 preview.'
            : 'Pick up right where you left off.'}
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-body font-medium text-[#4A5A6A] mb-1.5">
            Email address
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-[#BCCAD8] bg-white text-[#1A2433] font-body text-sm placeholder-[#B8C8D8] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-body font-medium text-[#4A5A6A]">Password</label>
            <Link to="/forgot-password" className="text-xs font-body font-medium hover:underline" style={{ color: '#C9A84C' }}>
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-3 rounded-xl border border-[#BCCAD8] bg-white text-[#1A2433] font-body text-sm placeholder-[#B8C8D8] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all pr-11"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A9AAA] hover:text-[#4A5A6A] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-semibold text-[#1E2A38] transition-all hover:brightness-110 mt-2 shadow-sm disabled:opacity-60"
          style={{ background: '#C9A84C' }}
        >
          {loading ? 'Signing in...' : (
            <>Sign in <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#EEF2F6] text-center">
        <p className="text-sm text-[#8A9AAA] font-body">
          Don't have an account?{' '}
          <Link
            to={`/register${nextParam ? `?next=${nextParam}` : ''}`}
            className="font-semibold hover:underline"
            style={{ color: '#C9A84C' }}
          >
            Create one free →
          </Link>
        </p>
      </div>
    </div>
  )
}
