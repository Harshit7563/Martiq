import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Pill } from '@/components/Pill'

type Step = {
  title: string
  desc: string
  time: string
  done: boolean
}

function Timeline({ steps }: { steps: Step[] }) {
  return (
    <ol className="mt-6 space-y-0">
      {steps.map((s, idx) => (
        <li key={idx} className="relative flex gap-4 pb-8 last:pb-0">
          {idx < steps.length - 1 ? (
            <span
              className={['absolute left-[11px] top-6 h-[calc(100%-12px)] w-px', s.done ? 'bg-mq-primary' : 'bg-orange-100'].join(' ')}
            />
          ) : null}
          <span
            className={[
              'relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold',
              s.done ? 'border-mq-primary bg-mq-primary text-white' : 'border-orange-100 bg-white text-stone-400',
            ].join(' ')}
          >
            {s.done ? '✓' : idx + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium text-neutral-900">{s.title}</div>
              <div className="shrink-0 text-xs text-neutral-500">{s.time}</div>
            </div>
            <p className="mt-1 text-sm text-neutral-600">{s.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function OrderTrackingPage() {
  const [params, setParams] = useSearchParams()
  const [orderId, setOrderId] = useState(params.get('id') ?? '')
  const [searched, setSearched] = useState(Boolean(params.get('id')))

  const status = useMemo(() => {
    if (!searched) return null
    const id = orderId.trim().toUpperCase()
    if (!id) return null

    const variant = id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 3
    if (variant === 0) {
      return {
        badge: 'In transit',
        steps: [
          { title: 'Order confirmed', desc: 'We’ve received your order.', time: 'Today · 2:10 PM', done: true },
          { title: 'Packed', desc: 'Items packed and ready to ship.', time: 'Today · 5:20 PM', done: true },
          { title: 'Shipped', desc: 'Handed to courier.', time: 'Tomorrow', done: false },
          { title: 'Out for delivery', desc: 'Courier en route.', time: '—', done: false },
          { title: 'Delivered', desc: 'Delivered to your address.', time: '—', done: false },
        ] satisfies Step[],
      }
    }
    if (variant === 1) {
      return {
        badge: 'Delivered',
        steps: [
          { title: 'Order confirmed', desc: 'We’ve received your order.', time: 'May 26', done: true },
          { title: 'Packed', desc: 'Items packed.', time: 'May 26', done: true },
          { title: 'Shipped', desc: 'In transit.', time: 'May 27', done: true },
          { title: 'Out for delivery', desc: 'Courier en route.', time: 'May 28', done: true },
          { title: 'Delivered', desc: 'Delivered.', time: 'May 28', done: true },
        ] satisfies Step[],
      }
    }
    return {
      badge: 'Processing',
      steps: [
        { title: 'Order confirmed', desc: 'We’ve received your order.', time: 'Today', done: true },
        { title: 'Packed', desc: 'Packing your items.', time: '—', done: false },
        { title: 'Shipped', desc: 'Awaiting pickup.', time: '—', done: false },
        { title: 'Out for delivery', desc: '—', time: '—', done: false },
        { title: 'Delivered', desc: '—', time: '—', done: false },
      ] satisfies Step[],
    }
  }, [searched, orderId])

  return (
    <main className="mq-container py-8 pb-16">
      <h1 className="mq-heading">Track order</h1>
      <p className="mt-2 text-sm text-neutral-600">Enter your order ID from checkout confirmation.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="mq-card p-6">
          <label className="block">
            <span className="text-sm font-medium text-neutral-900">Order ID</span>
            <input
              className="mq-input mt-2 !rounded-xl"
              placeholder="MARTIQ-xxxxxx"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="mq-btn-primary mt-4 w-full"
            disabled={!orderId.trim()}
            onClick={() => {
              if (!orderId.trim()) return
              setSearched(true)
              const next = new URLSearchParams(params)
              next.set('id', orderId.trim())
              setParams(next, { replace: true })
            }}
          >
            Track
          </button>
          <p className="mt-4 text-xs text-neutral-500">
            Use the Order ID from your confirmation email or checkout receipt (e.g. MARTIQ-xxxxxx).
          </p>
        </section>

        <section className="mq-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="mq-section-title">Status</div>
              <div className="mt-1 text-xl font-semibold text-neutral-900">{status?.badge ?? '—'}</div>
            </div>
            {orderId.trim() ? <Pill>{orderId.trim().toUpperCase()}</Pill> : null}
          </div>
          {!status ? (
            <p className="mt-8 text-sm text-neutral-500">Enter an order ID to see updates.</p>
          ) : (
            <Timeline steps={status.steps} />
          )}
        </section>
      </div>
    </main>
  )
}
