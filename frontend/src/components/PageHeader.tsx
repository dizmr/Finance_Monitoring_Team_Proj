import { useEffect, type ReactNode } from 'react'

type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
  showDraftStatus?: boolean
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  showDraftStatus = true,
}: PageHeaderProps) {
  useEffect(() => {
    document.title = `${title} | FinTrack`
  }, [title])

  return (
    <header className="page-header">
      <div className="page-header-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <div className="page-meta">
          <p>{description}</p>
          {showDraftStatus ? (
            <p className="draft-status" role="note">
              <strong>Draft mode</strong>
              <span>Not sent to Жени API</span>
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="page-header-action">{action}</div> : null}
    </header>
  )
}
