import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { COMPANY } from '@/data/company'
import { getPolicy, POLICY_NAV } from '@/data/policies'

export function PolicyPage() {
  const { slug = '' } = useParams()
  const policy = getPolicy(slug)

  useEffect(() => {
    if (policy) document.title = `${policy.title} | Martiq`
  }, [policy])

  if (!policy) return <Navigate to="/policies/privacy" replace />

  return (
    <main className="mq-container py-8 pb-20 sm:py-12">
      <nav className="text-[11px] uppercase tracking-[0.14em] text-mq-muted">
        <Link to="/" className="hover:text-mq-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-mq-ink">{policy.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mq-muted">
            Legal
          </p>
          <ul className="mt-3 space-y-1">
            {POLICY_NAV.map((item) => (
              <li key={item.slug}>
                <Link
                  to={item.to}
                  className={[
                    'block border-l-2 py-1.5 pl-3 text-sm transition',
                    item.slug === slug
                      ? 'border-mq-primary font-semibold text-mq-ink'
                      : 'border-transparent text-mq-muted hover:border-stone-300 hover:text-mq-ink',
                  ].join(' ')}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <article className="min-w-0">
          <h1 className="mq-heading text-3xl sm:text-4xl">{policy.title}</h1>
          <p className="mt-2 text-sm text-mq-muted">
            Operated by <strong className="text-mq-ink">{COMPANY.legalName}</strong>
          </p>
          <p className="mt-1 text-sm text-mq-muted">
            Effective {COMPANY.effectiveDate} · {COMPANY.website}
          </p>

          <p className="mt-6 text-sm leading-relaxed text-stone-700 sm:text-[15px]">{policy.intro}</p>

          <div className="mt-8 space-y-8">
            {policy.blocks.map((block) => (
              <section key={block.heading}>
                <h2 className="text-base font-bold text-mq-ink sm:text-lg">{block.heading}</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-stone-700 sm:text-[15px]">
                  {block.body.map((para) => (
                    <p key={para.slice(0, 48)}>{para}</p>
                  ))}
                  {block.bullets?.length ? (
                    <ul className="list-disc space-y-2 pl-5">
                      {block.bullets.map((b) => (
                        <li key={b.slice(0, 48)}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 border-t border-mq-border pt-6 text-sm text-mq-muted">
            <p className="font-semibold text-mq-ink">Registered business & contact</p>
            <p className="mt-2">{COMPANY.legalName}</p>
            <p>Brand: {COMPANY.brand}</p>
            <p>{COMPANY.address}</p>
            <p>GSTIN: {COMPANY.gstin}</p>
            <p>
              Email:{' '}
              <a className="text-mq-ink underline" href={`mailto:${COMPANY.email}`}>
                {COMPANY.email}
              </a>
            </p>
            <p>
              Phone:{' '}
              <a className="text-mq-ink underline" href={`tel:${COMPANY.phoneTel}`}>
                {COMPANY.phone}
              </a>
            </p>
            <p>
              Grievance:{' '}
              <a
                className="text-mq-ink underline"
                href={`mailto:${COMPANY.grievanceOfficer.email}`}
              >
                {COMPANY.grievanceOfficer.email}
              </a>
            </p>
            <p>
              Website:{' '}
              <a className="text-mq-ink underline" href={COMPANY.website} target="_blank" rel="noreferrer">
                {COMPANY.website}
              </a>
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}
