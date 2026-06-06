import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
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
    <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1A2433] mb-2">Welcome back</h1>
        <p className="text-[#8A9AAA] font-body text-sm">
          {nextParam?.endsWith('/free')
            ? 'Sign in to access your free Module 1 preview.'
            : 'Sign in to continue your career training.'}
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-body font-medium text-[#4A5A6A] mb-1.5">Email address</label>
          <input type="email" className="input-field" placeholder="you@example.com"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required autoComplete="email" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-body font-medium text-[#4A5A6A]">Password</label>
            <Link to="/forgot-password" className="text-xs hover:underline font-body" style={{ color: '#C9A84C' }}>
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} className="input-field pr-11"
              placeholder="••••••••" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required autoComplete="current-password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9AAA] hover:text-[#4A5A6A]">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-body font-semibold text-[#1E2A38] transition-all hover:brightness-110 mt-2"
          style={{ background: '#C9A84C' }}>
          <LogIn size={17} />
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#8A9AAA] font-body">
        Don't have an account?{' '}
        <Link to={`/register${nextParam ? `?next=${nextParam}` : ''}`} className="font-medium hover:underline" style={{ color: '#C9A84C' }}>
          Create one free
        </Link>
      </p>
    </div>
  )
}
