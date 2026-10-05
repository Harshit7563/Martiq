import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Product } from '@/types'
import { ProductCard } from '@/components/ProductCard'
import { productSearchText } from '@/lib/product'

function FilterChip({
  active,
  to,
  children,
}: {
  active: boolean
  to: string
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className={[
        'border px-3 py-1.5 text-sm transition',
        active ? 'mq-chip-active' : 'mq-chip',
      ].join(' ')}
    >
      {children}
    </Link>
  )
}

export function ProductsPage({ products }: { products: Product[] }) {
  const [params] = useSearchParams()
  const category = params.get('category')
  const gender = params.get('gender')
  const tag = params.get('tag')
  const q = params.get('q')?.trim().toLowerCase()
  const sort = params.get('sort') ?? 'popular'
  const price = params.get('price') ?? 'all'

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (tag === 'sale') {
        if (!p.mrp || p.mrp <= p.price) return false
      } else if (tag && p.badge !== tag) {
        return false
      }
      if (category && p.category !== category) return false
      if (gender && p.gender !== gender && p.gender !== 'Unisex') return false
      if (q && !productSearchText(p).includes(q)) return false
      if (price !== 'all') {
        if (price === 'under999' && p.price >= 999) return false
        if (price === '999to1499' && (p.price < 999 || p.price > 1499)) return false
        if (price === '1500plus' && p.price < 1500) return false
      }
      return true
    })

    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') list.sort((a, b) => b.price - a.price)
    return list
  }, [products, category, gender, tag, q, sort, price])

  const linkWith = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    next.set(key, value)
    return `/products?${next.toString()}`
  }

  return (
    <main className="mq-container py-8 pb-16">
      <div className="border-b border-mq-border pb-6">
        <p className="mq-section-title">Catalogue</p>
        <h1 className="mq-heading mt-1">
          {tag === 'sale' ? 'Sale' : tag === 'new' ? 'New Arrivals' : category ? 'Shop' : 'All Products'}
        </h1>
        <p className="mt-2 text-sm text-mq-muted">{filtered.length} pieces</p>
      </div>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="lg:sticky lg:top-32 lg:w-56 shrink-0 space-y-6">
          <div>
            <div className="mq-section-title !border-l-0 !pl-0">Sort</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <FilterChip active={sort === 'popular'} to={linkWith('sort', 'popular')}>
                Popular
              </FilterChip>
              <FilterChip active={sort === 'price_asc'} to={linkWith('sort', 'price_asc')}>
                Price ↑
              </FilterChip>
              <FilterChip active={sort === 'price_desc'} to={linkWith('sort', 'price_desc')}>
                Price ↓
              </FilterChip>
            </div>
          </div>
          <div>
            <div className="mq-section-title !border-l-0 !pl-0">Price</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'under999', label: '< ₹999' },
                { id: '999to1499', label: '₹999–1499' },
                { id: '1500plus', label: '₹1500+' },
              ].map((p) => (
                <FilterChip key={p.id} active={price === p.id} to={linkWith('price', p.id)}>
                  {p.label}
                </FilterChip>
              ))}
            </div>
          </div>
          <Link to="/products" className="mq-link text-sm font-medium">
            Clear filters
          </Link>
        </aside>

        <section className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <div className="mq-card p-10 text-center text-sm text-mq-muted">No pieces match your filters.</div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
