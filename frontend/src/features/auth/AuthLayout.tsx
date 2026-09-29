import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

type AuthLayoutProps = {
  title: string
  description: string
  children: ReactNode
  footerPrompt: string
  footerAction: string
  footerTo: '/login' | '/register'
}

export function AuthLayout({
  title,
  description,
  children,
  footerPrompt,
  footerAction,
  footerTo,
}: AuthLayoutProps) {
  useEffect(() => {
    document.title = `${title} | FinTrack`
  }, [title])

  return (
    <div className="auth-page">
      <header className="app-header">
        <Link className="brand" to="/login" aria-label="FinTrack home">
          <span className="brand-mark" aria-hidden="true">
            F
          </span>
          <span className="brand-name">FinTrack</span>
          <span className="brand-context">Personal finance</span>
        </Link>
      </header>

      <main className="auth-main">
        <section className="auth-section" aria-labelledby="auth-title">
          <div className="auth-heading">
            <p className="eyebrow">Account access</p>
            <h1 id="auth-title">{title}</h1>
            <p>{description}</p>
          </div>

          {children}

          <p className="auth-switch">
            {footerPrompt}{' '}
            <Link to={footerTo}>{footerAction}</Link>
          </p>
        </section>
      </main>

      <footer className="app-footer">
        <span>FinTrack</span>
        <span>Private account access</span>
      </footer>
    </div>
  )
}
