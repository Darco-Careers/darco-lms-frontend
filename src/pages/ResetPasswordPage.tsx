import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'

export default function ResetPasswordPage() {
  const { uid, token } = useParams<{ uid: string; token: string }>()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword]       = useState(false)
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState('')
  const [success, setSuccess]                 = useState(false)

  // Guard: if URL params are missing, show an error immediately
  if (!uid || !token) {
    return (
      <div className="animate-fade-up">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-6 bg-[#C9A84C]" />
            <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">
              Reset Password
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[#1A1A18] mb-2">
            Invalid reset link
          </h1>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700 font-body">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-body font-semibold hover:underline"
            style={{ color: '#C9A84C' }}
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 10) {
      setError('Password must be at least 10 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const data = await authApi.resetPasswordConfirm(uid, token, newPassword)
      // Log the user in immediately with the fresh token pair
      setAuth(data.user, data.token, data.refresh_token)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000)
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        'This reset link is invalid or has expired. Please request a new one.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="animate-fade-up text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h1 className="font-display text-2xl font-bold text-[#1A1A18] mb-2">
          Password reset
        </h1>
        <p className="text-[#8A8070] font-body text-sm">
          Your password has been updated. Redirecting you to your dashboard…
        </p>
      </div>
    )
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-6 bg-[#C9A84C]" />
          <span className="text-xs font-body font-semibold tracking-[2px] uppercase text-[#C9A84C]">
            Reset Password
          </span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#1A1A18] mb-2">
          Choose a new password
        </h1>
        <p className="text-[#8A8070] font-body text-sm">
          Must be at least 10 characters. You'll be signed in automatically.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-sm font-body">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-body font-medium text-[#5A4A3A] mb-1.5">
            New password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-3 rounded-xl border border-[#DDD5C8] bg-white text-[#1A1A18] font-body text-sm placeholder-[#C8C0B0] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all pr-11"
              placeholder="At least 10 characters"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={10}
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
          <label className="block text-sm font-body font-medium text-[#5A4A3A] mb-1.5">
            Confirm new password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-3 rounded-xl border border-[#DDD5C8] bg-white text-[#1A1A18] font-body text-sm placeholder-[#C8C0B0] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all"
            placeholder="Repeat your new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-semibold text-[#1E2A38] transition-all hover:brightness-110 mt-2 shadow-sm disabled:opacity-60"
          style={{ background: '#C9A84C' }}
        >
          {loading ? 'Resetting…' : (
            <>Set new password <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#EDE8E2] text-center">
        <Link
          to="/login"
          className="text-sm font-body font-semibold hover:underline"
          style={{ color: '#C9A84C' }}
        >
          ← Back to sign in
        </Link>
      </div>
    </div>
  )
}
