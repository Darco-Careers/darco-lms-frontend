import { useState } from 'react'
import { Mail, Phone, Send, CheckCircle } from 'lucide-react'
import { apiClient } from '@/api/client'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      await apiClient.post('/api/v1/contact/', form)
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(
        err?.response?.data?.error ||
        'Something went wrong. Please try again or email us directly.'
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      {/* Hero */}
      <div className="bg-[#1E2A38] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
            Get in Touch
          </h1>
          <p className="font-body text-[#BCCAD8] text-lg">
            Have a question about our courses, pricing, or anything else? We are here to help.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-10">

        {/* Contact info panel */}
        <div className="space-y-8">
          <div>
            <h2 className="font-display font-bold text-xl text-[#1A1A18] mb-2">Contact Information</h2>
            <p className="font-body text-[#5A4A3A] text-sm leading-relaxed">
              Reach out by email or phone and we will get back to you as soon as possible.
              Our team typically responds within one business day.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail size={18} className="text-[#C9A84C]" />
              </div>
              <div>
                <div className="font-body font-semibold text-sm text-[#1A1A18]">Email</div>
                <a
                  href="mailto:info@darcocenter.org"
                  className="font-body text-sm text-[#5A4A3A] hover:text-[#C9A84C] transition-colors"
                >
                  info@darcocenter.org
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Phone size={18} className="text-[#C9A84C]" />
              </div>
              <div>
                <div className="font-body font-semibold text-sm text-[#1A1A18]">Phone</div>
                <a
                  href="tel:+18186870188"
                  className="font-body text-sm text-[#5A4A3A] hover:text-[#C9A84C] transition-colors"
                >
                  (818) 687-0188
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#DDD5C8] p-5">
            <div className="font-body font-semibold text-sm text-[#1A1A18] mb-1">Office Hours</div>
            <p className="font-body text-sm text-[#5A4A3A]">Monday – Friday, 9:00 AM – 5:00 PM PT</p>
            <p className="font-body text-xs text-[#8A8070] mt-2">
              For urgent matters outside office hours, email us and we will respond the next business day.
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-2xl border border-[#DDD5C8] shadow-sm p-8">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <CheckCircle size={48} className="text-green-500 mb-4" />
              <h3 className="font-display font-bold text-xl text-[#1A1A18] mb-2">Message Sent!</h3>
              <p className="font-body text-[#5A4A3A] text-sm">
                Thank you for reaching out. We will get back to you within one business day.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 font-body font-semibold text-sm px-5 py-2.5 rounded-lg text-[#1E2A38] bg-[#C9A84C] hover:brightness-110 transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-display font-bold text-xl text-[#1A1A18] mb-1">Send Us a Message</h2>
              <p className="font-body text-sm text-[#8A8070] mb-4">
                Fill out the form below and we will be in touch shortly.
              </p>

              <div>
                <label className="block font-body font-medium text-sm text-[#1A1A18] mb-1.5">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Jane Smith"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#DDD5C8] bg-[#F4F7FA] font-body text-sm text-[#1A1A18] placeholder-[#8A9AAA] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition"
                />
              </div>

              <div>
                <label className="block font-body font-medium text-sm text-[#1A1A18] mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="jane@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#DDD5C8] bg-[#F4F7FA] font-body text-sm text-[#1A1A18] placeholder-[#8A9AAA] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition"
                />
              </div>

              <div>
                <label className="block font-body font-medium text-sm text-[#1A1A18] mb-1.5">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  maxLength={2000}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-2.5 rounded-lg border border-[#DDD5C8] bg-[#F4F7FA] font-body text-sm text-[#1A1A18] placeholder-[#8A9AAA] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition resize-none"
                />
                <div className="text-right font-body text-xs text-[#8A8070] mt-1">
                  {form.message.length}/2000
                </div>
              </div>

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 font-body text-sm text-red-600">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 font-body font-semibold text-sm px-5 py-3 rounded-lg text-[#1E2A38] bg-[#C9A84C] hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
