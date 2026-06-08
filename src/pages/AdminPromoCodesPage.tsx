import { useState, useEffect } from 'react'
import { Plus, Tag, ToggleLeft, ToggleRight, Trash2, Copy, Check, AlertCircle, Loader2 } from 'lucide-react'
import { promoCodesApi, type PromoCode, type CreatePromoCodePayload } from '@/api/promoCodes'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function discountLabel(code: PromoCode): string {
  if (code.discount_type === 'percent') return `${code.discount_value}% off`
  return `$${(code.discount_value / 100).toFixed(2)} off`
}

// ─── Create Form ──────────────────────────────────────────────────────────────

interface CreateFormProps {
  onCreated: (code: PromoCode) => void
  onCancel: () => void
}

function CreatePromoForm({ onCreated, onCancel }: CreateFormProps) {
  const [form, setForm] = useState<CreatePromoCodePayload>({
    code: '',
    discount_value: 100,
    discount_type: 'percent',
    course_slug: null,
    max_uses: null,
    expires_at: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const payload: CreatePromoCodePayload = {
        ...form,
        code: form.code.trim().toUpperCase(),
        discount_value: Number(form.discount_value),
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at || null,
        course_slug: form.course_slug || null,
      }
      const created = await promoCodesApi.create(payload)
      onCreated(created)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string; detail?: Record<string, string> } } }
      const detail = axiosErr?.response?.data?.detail
      if (detail && typeof detail === 'object') {
        setError(Object.values(detail).join(' '))
      } else {
        setError(axiosErr?.response?.data?.error || 'Failed to create promo code.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#BCCAD8] rounded-xl p-6 mb-6 shadow-sm">
      <h3 className="font-display font-bold text-[#1A2433] text-lg mb-5">Create New Promo Code</h3>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Code name */}
        <div>
          <label className="block text-sm font-body font-medium text-[#4A5A6A] mb-1.5">
            Promo Code Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="input-field uppercase"
            placeholder="e.g. WELCOME50"
            value={form.code}
            onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
            required
            maxLength={50}
          />
          <p className="text-xs text-[#8A9AAA] mt-1">Letters, numbers, and hyphens only. Will be uppercased automatically.</p>
        </div>

        {/* Discount value */}
        <div>
          <label className="block text-sm font-body font-medium text-[#4A5A6A] mb-1.5">
            Discount <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              className="input-field flex-1"
              placeholder="e.g. 50"
              value={form.discount_value}
              onChange={e => setForm(f => ({ ...f, discount_value: Number(e.target.value) }))}
              min={1}
              max={form.discount_type === 'percent' ? 100 : undefined}
              required
            />
            <select
              className="input-field w-32"
              value={form.discount_type}
              onChange={e => setForm(f => ({ ...f, discount_type: e.target.value as 'percent' | 'fixed' }))}
            >
              <option value="percent">% off</option>
              <option value="fixed">$ off</option>
            </select>
          </div>
          {form.discount_type === 'percent' && (
            <p className="text-xs text-[#8A9AAA] mt-1">
              {form.discount_value === 100
                ? '100% off = completely free enrollment (no payment needed)'
                : `${form.discount_value}% will be deducted from the course price`}
            </p>
          )}
        </div>

        {/* Max uses */}
        <div>
          <label className="block text-sm font-body font-medium text-[#4A5A6A] mb-1.5">
            Max Total Uses
          </label>
          <input
            type="number"
            className="input-field"
            placeholder="Leave blank for unlimited"
            value={form.max_uses ?? ''}
            onChange={e => setForm(f => ({ ...f, max_uses: e.target.value ? Number(e.target.value) : null }))}
            min={1}
          />
          <p className="text-xs text-[#8A9AAA] mt-1">Leave blank for unlimited uses.</p>
        </div>

        {/* Expiry date */}
        <div>
          <label className="block text-sm font-body font-medium text-[#4A5A6A] mb-1.5">
            Expiry Date
          </label>
          <input
            type="datetime-local"
            className="input-field"
            value={form.expires_at ? form.expires_at.slice(0, 16) : ''}
            onChange={e => {
              const val = e.target.value
              setForm(f => ({ ...f, expires_at: val && val.trim() !== '' ? new Date(val).toISOString() : null }))
            }}
            onBlur={e => {
              // If user clears the field, ensure expires_at is null
              if (!e.target.value || e.target.value.trim() === '') {
                setForm(f => ({ ...f, expires_at: null }))
              }
            }}
          />
          <p className="text-xs text-[#8A9AAA] mt-1">Leave blank — code never expires.</p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-body font-semibold text-sm text-[#1E2A38] transition-all hover:brightness-110 disabled:opacity-50"
          style={{ background: '#C9A84C' }}
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          {loading ? 'Creating…' : 'Create Code'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg font-body font-medium text-sm text-[#4A5A6A] border border-[#BCCAD8] hover:bg-[#EEF2F6] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadCodes()
  }, [])

  const loadCodes = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await promoCodesApi.list()
      setCodes(data)
    } catch {
      setError('Failed to load promo codes. Make sure you are logged in as an admin.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreated = (code: PromoCode) => {
    setCodes(prev => [code as PromoCode & { valid_from: string; uses_per_student: number; created_at: string; created_by: string | null }, ...prev])
    setShowForm(false)
  }

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleToggle = async (id: string) => {
    setTogglingId(id)
    try {
      const result = await promoCodesApi.toggle(id)
      setCodes(prev => prev.map(c => c.id === id ? { ...c, is_active: result.is_active } : c))
    } catch {
      alert('Failed to update promo code status.')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete promo code "${code}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      await promoCodesApi.delete(id)
      setCodes(prev => prev.filter(c => c.id !== id))
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      alert(axiosErr?.response?.data?.error || 'Failed to delete promo code.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page-container py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-[#1A2433] text-3xl mb-1">Promo Codes</h1>
          <p className="font-body text-[#4A5A6A] text-sm">
            Create and manage discount codes for your students. Codes can be 1–100% off.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-body font-semibold text-sm text-[#1E2A38] transition-all hover:brightness-110"
            style={{ background: '#C9A84C' }}
          >
            <Plus size={16} />
            New Code
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <CreatePromoForm
          onCreated={handleCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-[#8A9AAA]">
          <Loader2 size={24} className="animate-spin mr-3" />
          <span className="font-body text-sm">Loading promo codes…</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && codes.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#BCCAD8] rounded-xl">
          <Tag size={40} className="mx-auto text-[#BCCAD8] mb-4" />
          <h3 className="font-display font-bold text-[#1A2433] text-lg mb-2">No promo codes yet</h3>
          <p className="font-body text-[#8A9AAA] text-sm mb-6">
            Create your first code to give students a discount or free access.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-body font-semibold text-sm text-[#1E2A38]"
            style={{ background: '#C9A84C' }}
          >
            <Plus size={15} />
            Create First Code
          </button>
        </div>
      )}

      {/* Codes table */}
      {!loading && codes.length > 0 && (
        <div className="bg-white border border-[#BCCAD8] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#EEF2F6] bg-[#F7F9FB]">
                  <th className="text-left px-5 py-3.5 font-body font-semibold text-[#4A5A6A] text-xs uppercase tracking-wide">Code</th>
                  <th className="text-left px-5 py-3.5 font-body font-semibold text-[#4A5A6A] text-xs uppercase tracking-wide">Discount</th>
                  <th className="text-left px-5 py-3.5 font-body font-semibold text-[#4A5A6A] text-xs uppercase tracking-wide">Course</th>
                  <th className="text-left px-5 py-3.5 font-body font-semibold text-[#4A5A6A] text-xs uppercase tracking-wide">Uses</th>
                  <th className="text-left px-5 py-3.5 font-body font-semibold text-[#4A5A6A] text-xs uppercase tracking-wide">Expires</th>
                  <th className="text-left px-5 py-3.5 font-body font-semibold text-[#4A5A6A] text-xs uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code, idx) => (
                  <tr
                    key={code.id}
                    className={`border-b border-[#EEF2F6] last:border-0 transition-colors ${
                      !code.is_active ? 'opacity-50' : ''
                    } ${idx % 2 === 0 ? '' : 'bg-[#FAFBFC]'}`}
                  >
                    {/* Code + copy button */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1A2433] text-sm tracking-wider bg-[#EEF2F6] px-2.5 py-1 rounded">
                          {code.code}
                        </span>
                        <button
                          onClick={() => handleCopy(code.code, code.id)}
                          className="text-[#8A9AAA] hover:text-[#1A2433] transition-colors"
                          title="Copy code"
                        >
                          {copiedId === code.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>

                    {/* Discount */}
                    <td className="px-5 py-4">
                      <span className={`font-body font-semibold ${
                        code.discount_value === 100 && code.discount_type === 'percent'
                          ? 'text-green-600'
                          : 'text-[#1A2433]'
                      }`}>
                        {discountLabel(code)}
                      </span>
                    </td>

                    {/* Course */}
                    <td className="px-5 py-4 text-[#4A5A6A] font-body">
                      {code.course ?? <span className="text-[#8A9AAA] italic">All courses</span>}
                    </td>

                    {/* Uses */}
                    <td className="px-5 py-4 text-[#4A5A6A] font-body">
                      {code.times_used}
                      {code.max_uses ? ` / ${code.max_uses}` : ' / ∞'}
                    </td>

                    {/* Expires */}
                    <td className="px-5 py-4 text-[#4A5A6A] font-body">
                      {formatDate(code.expires_at)}
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-4">
                      {code.is_active && code.is_valid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body font-semibold bg-green-50 text-green-700 border border-green-200">
                          Active
                        </span>
                      ) : code.is_active && !code.is_valid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        {/* Toggle active/inactive */}
                        <button
                          onClick={() => handleToggle(code.id)}
                          disabled={togglingId === code.id}
                          className="text-[#8A9AAA] hover:text-[#1A2433] transition-colors disabled:opacity-50"
                          title={code.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {togglingId === code.id
                            ? <Loader2 size={16} className="animate-spin" />
                            : code.is_active
                              ? <ToggleRight size={18} className="text-green-500" />
                              : <ToggleLeft size={18} />
                          }
                        </button>

                        {/* Delete (only if never used) */}
                        {code.times_used === 0 && (
                          <button
                            onClick={() => handleDelete(code.id, code.code)}
                            disabled={deletingId === code.id}
                            className="text-[#8A9AAA] hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Delete code"
                          >
                            {deletingId === code.id
                              ? <Loader2 size={15} className="animate-spin" />
                              : <Trash2 size={15} />
                            }
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary footer */}
          <div className="px-5 py-3 bg-[#F7F9FB] border-t border-[#EEF2F6] text-xs text-[#8A9AAA] font-body">
            {codes.filter(c => c.is_active && c.is_valid).length} active code{codes.filter(c => c.is_active && c.is_valid).length !== 1 ? 's' : ''}
            {' · '}
            {codes.reduce((sum, c) => sum + c.times_used, 0)} total uses
          </div>
        </div>
      )}

      {/* Help text */}
      <div className="mt-8 bg-[#F7F9FB] border border-[#EEF2F6] rounded-xl px-5 py-4">
        <h4 className="font-body font-semibold text-[#1A2433] text-sm mb-2">How promo codes work</h4>
        <ul className="font-body text-[#4A5A6A] text-sm space-y-1.5">
          <li><span className="font-semibold">1–99% off</span> — student pays the discounted price through Stripe checkout.</li>
          <li><span className="font-semibold">100% off</span> — student is enrolled instantly for free, no payment required.</li>
          <li><span className="font-semibold">Max uses</span> — leave blank for unlimited. Once the limit is hit, the code stops working automatically.</li>
          <li><span className="font-semibold">Expiry</span> — leave blank for a code that never expires.</li>
          <li><span className="font-semibold">Deactivate</span> — use the toggle to turn a code off at any time without deleting it.</li>
        </ul>
      </div>
    </div>
  )
}
