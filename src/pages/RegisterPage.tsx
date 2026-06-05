import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await authApi.register({ name: form.name, email: form.email, password: form.password })
      // Auto-login after register
      const data = await authApi.login({ email: form.email, password: form.password })
      setAuth(data.user, data.token, data.refresh_token)
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-navy-900 mb-2">Start your career training</h1>
        <p className="text-surface-500 font-body text-sm">Free to create an account. Enroll in any course to get started.</p>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Full name</label>
          <input
            type="text"
            className="input-field"
            placeholder="Your full name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            autoComplete="name"
          />
        </div>

        <div>
          <label className="label">Email address</label>
          <input
            type="email"
            className="input-field"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-11"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="label">Confirm password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="input-field"
            placeholder="Repeat your password"
            value={form.confirm}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          <UserPlus size={17} />
          {loading ? 'Creating account...' : 'Create free account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-surface-500 font-body">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}
