import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'

export function AccountPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  if (!auth.isSignedIn || !auth.user) {
    return <Navigate to="/login?returnUrl=%2Faccount" replace />
  }

  return (
    <main className="mq-container py-10 pb-16">
      <h1 className="mq-heading">My account</h1>
      <p className="mt-2 text-sm text-mq-muted">Manage your profile, orders and wishlist.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="border border-mq-border bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-mq-muted">Profile</h2>
          <div className="mt-4 flex items-center gap-4">
            {auth.user.picture ? (
              <img
                src={auth.user.picture}
                alt=""
                className="size-14 rounded-full border border-mq-border object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-full bg-mq-surface text-lg font-bold text-mq-ink">
                {auth.user.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-semibold text-mq-ink">{auth.user.name}</div>
              <div className="text-sm text-mq-muted">{auth.user.email}</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-mq-muted">
                {auth.user.provider === 'google' ? 'Signed in with Google' : 'Email account'}
              </div>
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-mq-border pb-3">
              <dt className="text-mq-muted">Name</dt>
              <dd className="font-semibold text-mq-ink">{auth.user.name}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-mq-border pb-3">
              <dt className="text-mq-muted">Email</dt>
              <dd className="font-semibold text-mq-ink">{auth.user.email}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="mq-btn-secondary mt-6"
            onClick={() => {
              auth.signOut()
              navigate('/login')
            }}
          >
            Sign out
          </button>
        </section>

        <section className="grid gap-3">
          <Link to="/orders" className="border border-mq-border bg-white px-5 py-4 transition hover:border-mq-ink">
            <div className="text-sm font-bold text-mq-ink">My orders</div>
            <p className="mt-1 text-sm text-mq-muted">Track deliveries and view past orders.</p>
          </Link>
          <Link to="/wishlist" className="border border-mq-border bg-white px-5 py-4 transition hover:border-mq-ink">
            <div className="text-sm font-bold text-mq-ink">Wishlist</div>
            <p className="mt-1 text-sm text-mq-muted">Items you’ve saved for later.</p>
          </Link>
          <Link to="/cart" className="border border-mq-border bg-white px-5 py-4 transition hover:border-mq-ink">
            <div className="text-sm font-bold text-mq-ink">Bag</div>
            <p className="mt-1 text-sm text-mq-muted">Review items ready for checkout.</p>
          </Link>
        </section>
      </div>
    </main>
  )
}
