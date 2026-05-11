'use client'

import React from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
          }}
        >
          <p style={{ color: '#C9A84C', marginBottom: '0.5rem' }}>Something went wrong.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              background: 'transparent',
              border: '1px solid rgba(201,168,76,0.3)',
              color: '#C9A84C',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
