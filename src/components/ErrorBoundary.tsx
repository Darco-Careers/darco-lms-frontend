import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Global React ErrorBoundary — catches unhandled render errors and
 * displays a friendly recovery screen instead of a blank white page.
 *
 * Wrap the entire app (or individual routes) with this component.
 * In production, errors are logged to the console; a Sentry integration
 * can be added here when SENTRY_DSN is configured.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console in all environments; swap for Sentry.captureException when ready
    console.error('[ErrorBoundary] Uncaught render error:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#f9fafb',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{
            maxWidth: '480px',
            textAlign: 'center',
            background: '#fff',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.75rem' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              An unexpected error occurred. Your progress has been saved.
              Please return to the homepage and try again.
            </p>
            {this.state.error && (
              <details style={{
                textAlign: 'left',
                background: '#f3f4f6',
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                fontSize: '0.8rem',
                color: '#374151',
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                  Error details
                </summary>
                <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              style={{
                background: '#c9a84c',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Return to Homepage
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
