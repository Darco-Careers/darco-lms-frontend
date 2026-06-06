import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { freeEnrollmentApi } from '@/api/progress'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const nextParam = searchParams.get('next') // e.g. /courses/real-estate-residential-agent/free
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    setError('')
    try {
      const data = await authApi.register({ name: form.name, email: form.email, password: form.password })
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
      setError(err?.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1A2433] mb-2">
          {nextParam?.endsWith('/free') ? 'Create a free account to start' : 'Start your career training'}
        </h1>
        <p className="text-[#8A9AAA] font-body text-sm">
          {nextParam?.endsWith('/free')
            ? 'Module 1 is free — no payment required.'
            : 'Free to create an account. Enroll in any course to get started.'}
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-body font-medium text-[#4A5A6A] mb-1.5">Full name</label>
          <input type="text" className="input-field" placeholder="Your full name"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required autoComplete="name" />
        </div>
        <div>
          <label className="block text-sm font-body font-medium text-[#4A5A6A] mb-1.5">Email address</label>
          <input type="email" className="input-field" placeholder="you@example.com"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required autoComplete="email" />
        </div>
        <div>
          <label className="block text-sm font-body font-medium text-[#4A5A6A] mb-1.5">Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} className="input-field pr-11"
              placeholder="At least 8 characters" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required autoComplete="new-password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9AAA] hover:text-[#4A5A6A]">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-body font-medium text-[#4A5A6A] mb-1.5">Confirm password</label>
          <input type={showPassword ? 'text' : 'password'} className="input-field"
            placeholder="Repeat your password" value={form.confirm}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            required autoComplete="new-password" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-body font-semibold text-[#1E2A38] transition-all hover:brightness-110 mt-2"
          style={{ background: '#C9A84C' }}>
          <UserPlus size={17} />
          {loading ? 'Creating account...' : nextParam?.endsWith('/free') ? 'Create account & start free' : 'Create free account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#8A9AAA] font-body">
        Already have an account?{' '}
        <Link to={`/login${nextParam ? `?next=${nextParam}` : ''}`} className="font-medium hover:underline" style={{ color: '#C9A84C' }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
