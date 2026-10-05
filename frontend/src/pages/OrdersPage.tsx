import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'

const MOCK_ORDERS = [
  {
    id: 'MQ-10482',
    date: '18 Sep 2026',
    status: 'Out for delivery',
    total: 2549,
    items: 'Mens 505 Mid Rise Straight Fit Jeans',
  },
  {
    id: 'MQ-10311',
    date: '02 Sep 2026',
    status: 'Delivered',
    total: 1248,
    items: 'Classic Crew Neck Tee × 2',
  },
  {
    id: 'MQ-10190',
    date: '21 Aug 2026',
    status: 'Delivered',
    total: 1799,
    items: 'Cotton Twill Shirt',
  },
]

export function OrdersPage() {
  const auth = useAuth()

  if (!auth.isSignedIn) {
    return (
      <main className="mq-container py-16 text-center">
        <h1 className="mq-heading">My orders</h1>
        <p className="mt-2 text-sm text-mq-muted">Sign in to see your order history.</p>
        <Link to="/login" className="mq-btn-primary mt-8">
          Sign in
        </Link>
      </main>
    )
  }

  return (
    <main className="mq-container py-8 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-mq-border pb-6">
        <div>
          <h1 className="mq-heading">My orders</h1>
          <p className="mt-1 text-sm text-mq-muted">Hi {auth.user?.name} — here’s what’s on the way and what’s done.</p>
        </div>
        <Link to="/track" className="text-sm font-medium text-mq-ink underline underline-offset-4">
          Track a package
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {MOCK_ORDERS.map((order) => (
          <article key={order.id} className="border border-mq-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-mq-ink">{order.id}</div>
                <p className="mt-1 text-sm text-mq-muted">{order.items}</p>
                <p className="mt-1 text-xs text-mq-muted">Placed {order.date}</p>
              </div>
              <div className="text-right">
                <span
                  className={[
                    'inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em]',
                    order.status === 'Delivered'
                      ? 'bg-[#f0fdf4] text-[#166534]'
                      : 'bg-[#fff5f6] text-mq-primary',
                  ].join(' ')}
                >
                  {order.status}
                </span>
                <div className="mt-2 text-sm font-semibold text-mq-ink">
                  ₹{order.total.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/track" className="text-xs font-bold uppercase tracking-[0.12em] text-mq-ink underline underline-offset-4">
                Track
              </Link>
              <Link to="/products" className="text-xs font-bold uppercase tracking-[0.12em] text-mq-muted hover:text-mq-ink">
                Buy again
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
