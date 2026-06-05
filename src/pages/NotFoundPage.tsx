import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-display text-8xl font-bold text-surface-200 mb-4">404</div>
        <h1 className="font-display text-2xl font-bold text-navy-900 mb-3">Page not found</h1>
        <p className="text-surface-500 font-body mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">Back to courses</Link>
      </div>
    </div>
  )
}
