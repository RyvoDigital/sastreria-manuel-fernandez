'use client'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1.5rem',
      padding: '2rem',
      background: '#0A1628',
      color: '#fff',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        fontWeight: 400,
        fontStyle: 'italic',
        color: '#C9A84C',
        margin: 0,
      }}>
        Algo salió mal
      </h1>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.6)',
        maxWidth: '400px',
        lineHeight: 1.6,
      }}>
        Ha ocurrido un error inesperado. Por favor, recarga la página o vuelve a intentarlo.
      </p>
      <button
        onClick={reset}
        style={{
          padding: '0.75rem 1.5rem',
          background: '#C9A84C',
          border: 'none',
          borderRadius: '4px',
          color: '#000',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        Recargar página
      </button>
    </div>
  )
}
