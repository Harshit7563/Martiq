import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Product } from '@/types'
import { badgeLabel, categoryLabel } from '@/lib/product'
import { Pill } from '@/components/Pill'
import { ProductSpecs } from '@/components/ProductSpecs'
import { ProductPrice } from '@/components/ProductPrice'
import { useCart } from '@/cart/CartContext'
import { ProductCard } from '@/components/ProductCard'
import { sizeChartForProduct } from '@/lib/sizeChart'
import { averageRating, reviewsForProduct } from '@/lib/reviews'
import { fetchPincode } from '@/lib/pincode'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5 text-mq-primary" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < Math.round(rating) ? 'opacity-100' : 'opacity-25'}>
          ★
        </span>
      ))}
    </span>
  )
}

export function ProductDetailPage({ products }: { products: Product[] }) {
  const { id } = useParams()
  const cart = useCart()
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState<string>('')
  const [pincode, setPincode] = useState('')
  const [deliveryMsg, setDeliveryMsg] = useState<string | null>(null)
  const [pinBusy, setPinBusy] = useState(false)
  const [preview, setPreview] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(true)
  const [chartOpen, setChartOpen] = useState(false)
  const [reviewsOpen, setReviewsOpen] = useState(true)

  const product = useMemo(() => products.find((p) => p.id === id), [products, id])

  const gallery = useMemo(() => {
    if (!product) return []
    if (product.gallery?.length) return product.gallery
    return [product.image]
  }, [product])

  const availableSizes = useMemo(() => {
    if (!product) return []
    return product.sizes?.length ? product.sizes : ['28', '30', '32', '34', '36', '38']
  }, [product])

  const selectedSize = size || availableSizes[Math.min(2, availableSizes.length - 1)] || ''

  const chart = useMemo(
    () => (product ? sizeChartForProduct(product.id, availableSizes) : []),
    [product, availableSizes],
  )

  const reviews = useMemo(
    () => (product ? reviewsForProduct(product.id, product.rating) : []),
    [product],
  )
  const avg = useMemo(() => averageRating(reviews), [reviews])

  const youMayLike = useMemo(() => {
    if (!product) return products.slice(0, 4)
    return products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
  }, [products, product])

  if (!product) {
    return (
      <main className="mq-container py-16">
        <div className="mq-card p-8 text-center">
          <p className="font-medium text-stone-900">Product not found</p>
          <Link to="/products" className="mq-btn-primary mt-6">
            Return to shop
          </Link>
        </div>
      </main>
    )
  }

  const mainImage = gallery[preview] ?? product.image
  const label = badgeLabel(product.badge)
  const addToBag = () => cart.add(product, qty)

  async function checkPincode() {
    setPinBusy(true)
    setDeliveryMsg(null)
    try {
      const place = await fetchPincode(pincode)
      setDeliveryMsg(
        `Delivers to ${place.area || place.city}, ${place.district || place.city}, ${place.state} in 2–6 days. Free shipping above ₹999.`,
      )
    } catch (err) {
      setDeliveryMsg(err instanceof Error ? err.message : 'Could not check pincode.')
    } finally {
      setPinBusy(false)
    }
  }

  return (
    <main className="mq-container py-6 pb-24 md:pb-12">
      <nav className="text-xs uppercase tracking-[0.12em] text-stone-500">
        <Link to="/" className="hover:text-mq-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-mq-primary">
          {categoryLabel(product.category)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800 line-clamp-1">{product.name}</span>
      </nav>

      <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
        <div>
          <div className="overflow-hidden border border-stone-200 bg-stone-100">
            <img src={mainImage} alt={product.name} className="aspect-[3/4] w-full object-cover" />
          </div>
          {gallery.length > 1 ? (
            <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
              {gallery.slice(0, 8).map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPreview(i)}
                  className={[
                    'overflow-hidden border-2 bg-stone-100 transition',
                    preview === i ? 'border-mq-primary' : 'border-transparent opacity-70 hover:opacity-100',
                  ].join(' ')}
                >
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-stone-400">{product.sku}</span>
            {label ? (
              <span className="bg-mq-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-mq-primary">
                {label}
              </span>
            ) : null}
          </div>

          <h1 className="mq-heading mt-2 text-2xl sm:text-3xl lg:text-4xl">{product.name}</h1>
          <p className="mt-1 text-sm text-stone-600">{product.color}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <Stars rating={avg || product.rating || 4.4} />
            <span className="font-semibold text-mq-ink">{(avg || product.rating || 4.4).toFixed(1)}</span>
            <span className="text-stone-500">· {reviews.length} reviews</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-stone-600">
            <span className="border border-stone-200 px-2 py-1">{product.material}</span>
            <span className="border border-stone-200 px-2 py-1">{product.fit}</span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-stone-600">{product.description}</p>

          <div className="mt-6 border-y border-stone-200 py-4">
            <ProductPrice price={product.price} mrp={product.mrp} size="lg" />
            <p className="mt-1 text-xs text-stone-500">Inclusive of all taxes · Sold by Martiq</p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between gap-2">
                <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-700">
                  Size
                </label>
                <button
                  type="button"
                  className="text-[11px] font-semibold text-mq-primary underline underline-offset-2"
                  onClick={() => setChartOpen((o) => !o)}
                >
                  Size chart
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {availableSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={[
                      'min-w-11 border px-3 py-2 text-sm transition',
                      selectedSize === s
                        ? 'border-mq-primary bg-mq-primary text-white'
                        : 'border-stone-200 text-stone-700 hover:border-stone-400',
                    ].join(' ')}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-700">
                Quantity
              </label>
              <div className="mt-2 inline-flex w-full max-w-[8rem] border border-stone-200">
                <button
                  type="button"
                  className="flex-1 py-2 hover:bg-stone-50"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="flex min-w-10 flex-1 items-center justify-center border-x border-stone-200 text-sm">
                  {qty}
                </span>
                <button
                  type="button"
                  className="flex-1 py-2 hover:bg-stone-50"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {chartOpen ? (
            <div className="mt-4 overflow-x-auto border border-stone-200">
              <table className="w-full min-w-[320px] text-left text-xs sm:text-sm">
                <thead className="bg-mq-surface text-[11px] uppercase tracking-[0.1em] text-stone-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Size</th>
                    <th className="px-3 py-2 font-semibold">Waist</th>
                    <th className="px-3 py-2 font-semibold">Hip</th>
                    <th className="px-3 py-2 font-semibold">Inseam</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.map((row) => (
                    <tr
                      key={row.size}
                      className={[
                        'border-t border-stone-100',
                        row.size === selectedSize ? 'bg-red-50/60' : '',
                      ].join(' ')}
                    >
                      <td className="px-3 py-2 font-semibold">{row.size}</td>
                      <td className="px-3 py-2 text-stone-600">{row.waist}</td>
                      <td className="px-3 py-2 text-stone-600">{row.hip}</td>
                      <td className="px-3 py-2 text-stone-600">{row.inseam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-stone-100 px-3 py-2 text-[11px] text-stone-500">
                Chart unique to this Martiq style. Measure over undergarments for best fit.
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button type="button" className="mq-btn-primary flex-1" onClick={addToBag}>
              Add to bag
            </button>
            <Link to="/cart" className="mq-btn-secondary flex-1 text-center">
              View bag
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Pill>Free returns</Pill>
            <Pill>COD</Pill>
            <Pill>Ships in 48h</Pill>
          </div>

          <div className="mt-6 border border-stone-200 p-3">
            <div className="flex gap-2">
              <input
                className="mq-input flex-1 !py-2"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                placeholder="Delivery pincode"
                inputMode="numeric"
              />
              <button
                type="button"
                className="mq-btn-secondary shrink-0 !px-4 !py-2"
                disabled={pinBusy}
                onClick={() => void checkPincode()}
              >
                {pinBusy ? '…' : 'Check'}
              </button>
            </div>
            {deliveryMsg ? <p className="mt-2 text-xs text-stone-600">{deliveryMsg}</p> : null}
          </div>

          <div className="mt-8 border-t border-stone-200 pt-6">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left text-[11px] font-medium uppercase tracking-[0.18em] text-stone-700"
              onClick={() => setDetailsOpen((o) => !o)}
            >
              Product details
              <span className="text-stone-400">{detailsOpen ? '−' : '+'}</span>
            </button>
            {detailsOpen ? (
              <div className="mt-4">
                <ProductSpecs product={product} />
              </div>
            ) : null}
          </div>

          <div className="mt-6 border-t border-stone-200 pt-6">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left text-[11px] font-medium uppercase tracking-[0.18em] text-stone-700"
              onClick={() => setReviewsOpen((o) => !o)}
            >
              Reviews ({reviews.length})
              <span className="text-stone-400">{reviewsOpen ? '−' : '+'}</span>
            </button>
            {reviewsOpen ? (
              <ul className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <li key={r.id} className="border border-stone-200 p-3 sm:p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Stars rating={r.rating} />
                        <span className="text-sm font-semibold text-mq-ink">{r.title}</span>
                      </div>
                      <span className="text-[11px] text-stone-400">{r.date}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{r.body}</p>
                    <p className="mt-2 text-xs text-stone-500">
                      {r.name}
                      {r.verified ? (
                        <span className="ml-2 font-semibold text-emerald-700">Verified buyer</span>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mq-divider mt-12 pt-10">
        <div className="mq-section-title">Recommended</div>
        <h2 className="mq-heading mt-2">You may also like</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
          {youMayLike.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-mq-ink">{product.name}</p>
            <ProductPrice price={product.price} mrp={product.mrp} size="sm" />
          </div>
          <button type="button" className="mq-btn-primary shrink-0 !px-5" onClick={addToBag}>
            Add to bag
          </button>
        </div>
      </div>
    </main>
  )
}
