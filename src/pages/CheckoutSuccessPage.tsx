import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const courseSlug = searchParams.get('course')
  const queryClient = useQueryClient()

  useEffect(() => {
    // Invalidate progress and enrollment queries so dashboard refreshes
    queryClient.invalidateQueries({ queryKey: ['progress'] })
    queryClient.invalidateQueries({ queryKey: ['enrollments'] })
  }, [queryClient])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-up">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>

        <h1 className="font-display text-3xl font-bold text-navy-900 mb-3">
          You're enrolled!
        </h1>
        <p className="text-surface-500 font-body text-base mb-8 leading-relaxed">
          Your payment was successful. Your course is ready — start learning right now.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {courseSlug ? (
            <Link
              to={`/courses/${courseSlug}/progress`}
              className="btn-primary text-base px-8 py-3.5"
            >
              Start the course
              <ArrowRight size={17} />
            </Link>
          ) : (
            <Link to="/dashboard" className="btn-primary text-base px-8 py-3.5">
              Go to dashboard
              <ArrowRight size={17} />
            </Link>
          )}
          <Link to="/" className="btn-secondary text-base px-8 py-3.5">
            Browse more courses
          </Link>
        </div>
      </div>
    </div>
  )
}
