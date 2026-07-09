import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { freeEnrollmentApi } from '@/api/progress'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const nextParam = searchParams.get('next')
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [disclaimer, setDisclaimer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!disclaimer) { setError('Please acknowledge the disclaimer to continue.'); return }
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
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-6 bg-[#C9A84C]" />
          <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">
            {nextParam?.endsWith('/free') ? 'Free access' : 'Get started free'}
          </span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#1A1A18] mb-2">
          {nextParam?.endsWith('/free') ? 'Create your free account' : 'Begin your career training'}
        </h1>
        <p className="text-[#8A8070] font-body text-sm">
          {nextParam?.endsWith('/free')
            ? 'Module 1 is completely free — no payment required.'
            : 'Free to join. Explore any course. Enroll when you\'re ready.'}
        </p>
      </div>

      {/* What you get */}
      {!nextParam?.endsWith('/free') && (
        <div className="bg-[#1E2A38] rounded-xl p-4 mb-6">
          <p className="text-[#C9A84C] text-xs font-body font-semibold uppercase tracking-wider mb-3">What you get for free</p>
          <div className="space-y-1.5">
            {[
              'Module 1 of every course — no credit card',
              'Access to 13 career tracks',
              'Quizzes, glossary, and lesson content',
            ].map(item => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle size={13} className="text-[#C9A84C] flex-shrink-0" />
                <span className="text-[#B8C8D8] text-xs font-body">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-body font-medium text-[#5A4A3A] mb-1.5">Full name</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-[#DDD5C8] bg-white text-[#1A1A18] font-body text-sm placeholder-[#C8C0B0] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all"
            placeholder="Your full name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            autoComplete="name"
          />
        </div>
        <div>
          <label className="block text-sm font-body font-medium text-[#5A4A3A] mb-1.5">Email address</label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-[#DDD5C8] bg-white text-[#1A1A18] font-body text-sm placeholder-[#C8C0B0] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-body font-medium text-[#5A4A3A] mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-3 rounded-xl border border-[#DDD5C8] bg-white text-[#1A1A18] font-body text-sm placeholder-[#C8C0B0] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all pr-11"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8070] hover:text-[#5A4A3A] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-body font-medium text-[#5A4A3A] mb-1.5">Confirm password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-3 rounded-xl border border-[#DDD5C8] bg-white text-[#1A1A18] font-body text-sm placeholder-[#C8C0B0] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all"
            placeholder="Repeat your password"
            value={form.confirm}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            required
            autoComplete="new-password"
          />
        </div>

        {/* Disclaimer checkbox */}
        <div className="flex items-start gap-3 pt-1">
          <input
            type="checkbox"
            id="disclaimer"
            checked={disclaimer}
            onChange={e => setDisclaimer(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-[#DDD5C8] accent-[#C9A84C] flex-shrink-0 cursor-pointer"
          />
          <label htmlFor="disclaimer" className="text-xs font-body text-[#8A8070] leading-relaxed cursor-pointer">
            I understand this course is for educational purposes only. Licensing requirements vary by state and locality. DARCO Academy does not guarantee employment or licensing outcomes.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !disclaimer}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-semibold text-[#1E2A38] transition-all hover:brightness-110 mt-1 shadow-sm disabled:opacity-60"
          style={{ background: '#C9A84C' }}
        >
          {loading ? 'Creating account...' : (
            <>
              {nextParam?.endsWith('/free') ? 'Create account & start free' : 'Create free account'}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#EDE8E2] text-center">
        <p className="text-sm text-[#8A8070] font-body">
          Already have an account?{' '}
          <Link
            to={`/login${nextParam ? `?next=${nextParam}` : ''}`}
            className="font-semibold hover:underline"
            style={{ color: '#C9A84C' }}
          >
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  )
}
