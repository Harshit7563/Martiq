import type { Product } from '@/types'
import { badgeLabel } from '@/lib/product'
import { useCart } from '@/cart/CartContext'
import { useWishlist } from '@/wishlist/WishlistContext'
import { Link } from 'react-router-dom'
import { ProductPrice } from '@/components/ProductPrice'
import { IconHeart } from '@/components/icons'

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart()
  const wishlist = useWishlist()
  const wished = wishlist.has(product.id)
  const label = badgeLabel(product.badge)
  const offPct =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null

  return (
    <article className="group flex h-full flex-col">
      <div className="relative overflow-hidden bg-mq-surface">
        <Link to={`/products/${encodeURIComponent(product.id)}`} className="block aspect-[3/4]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </Link>

        {offPct ? (
          <span className="absolute left-0 top-0 bg-mq-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            {offPct}% Off
          </span>
        ) : label ? (
          <span className="absolute left-0 top-0 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-mq-ink">
            {label}
          </span>
        ) : null}

        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className={[
            'absolute right-2 top-2 inline-flex size-9 items-center justify-center rounded-full border bg-white/95 shadow-sm transition',
            wished
              ? 'border-[#d4002a66] text-mq-primary'
              : 'border-mq-border text-mq-ink hover:border-[#d4002a66] hover:text-mq-primary',
          ].join(' ')}
          onClick={(e) => {
            e.preventDefault()
            wishlist.toggle(product.id)
          }}
        >
          <IconHeart className="size-4" filled={wished} />
        </button>

        <button
          type="button"
          className="absolute inset-x-0 bottom-0 translate-y-full bg-mq-ink py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition duration-300 group-hover:translate-y-0"
          onClick={() => cart.add(product, 1)}
        >
          Quick add
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <Link
          to={`/products/${encodeURIComponent(product.id)}`}
          className="text-sm leading-snug text-mq-ink transition hover:text-mq-primary"
        >
          {product.name}
        </Link>
        <p className="mt-0.5 text-xs text-mq-muted">{product.color}</p>
        <div className="mt-2">
          <ProductPrice price={product.price} mrp={product.mrp} size="sm" />
        </div>
        <button
          type="button"
          className="mt-auto pt-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-mq-muted underline underline-offset-4 hover:text-mq-primary sm:hidden"
          onClick={() => cart.add(product, 1)}
        >
          Quick add
        </button>
      </div>
    </article>
  )
}
