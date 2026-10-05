import { Link } from 'react-router-dom'

export function AuthShell({
  tag,
  title,
  lead,
  children,
  switchText,
  switchTo,
  switchLabel,
}: {
  tag: string
  title: string
  lead: string
  children: React.ReactNode
  switchText: string
  switchTo: string
  switchLabel: string
}) {
  return (
    <main className="mq-container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-5 flex items-center gap-3">
          <span className="font-display text-xl tracking-[0.06em] text-mq-ink">Martiq</span>
          <span className="h-px flex-1 bg-mq-border" aria-hidden />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-mq-primary">{tag}</span>
        </div>

        <div className="border border-mq-border bg-white p-7 shadow-[var(--mq-shadow)]">
          <h1 className="font-display text-3xl font-normal text-mq-ink">{title}</h1>
          <p className="mt-2 text-sm text-mq-muted">{lead}</p>
          <div className="mt-6">{children}</div>
        </div>

        <p className="mt-5 text-center text-sm text-mq-muted">
          {switchText}{' '}
          <Link to={switchTo} className="font-semibold text-mq-ink underline underline-offset-4">
            {switchLabel}
          </Link>
        </p>
        <div className="mt-3 text-center">
          <Link to="/" className="text-sm text-mq-muted hover:text-mq-ink">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
