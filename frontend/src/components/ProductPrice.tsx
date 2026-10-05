import { formatINR } from '@/lib/format'

export function ProductPrice({
  price,
  mrp,
  size = 'md',
}: {
  price: number
  mrp?: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const offPct = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : null

  const priceClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'mq-heading !text-3xl',
  }[size]

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={[priceClass, 'font-semibold text-mq-ink'].join(' ')}>₹{formatINR(price)}</span>
      {mrp && mrp > price ? (
        <span className="text-sm text-mq-muted line-through">₹{formatINR(mrp)}</span>
      ) : null}
      {offPct ? (
        <span className="text-xs font-semibold uppercase tracking-wide text-mq-primary">{offPct}% Off</span>
      ) : null}
    </div>
  )
}
