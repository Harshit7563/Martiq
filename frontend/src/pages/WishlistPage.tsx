import { Link } from 'react-router-dom'
import { useCatalogue } from '@/catalogue/CatalogueContext'
import { useWishlist } from '@/wishlist/WishlistContext'
import { ProductCard } from '@/components/ProductCard'

export function WishlistPage() {
  const wishlist = useWishlist()
  const { products } = useCatalogue()
  const items = products.filter((p) => wishlist.ids.includes(p.id))

  if (!items.length) {
    return (
      <main className="mq-container py-16 text-center">
        <h1 className="mq-heading">Wishlist</h1>
        <p className="mt-2 text-sm text-mq-muted">No saved items yet — tap the heart on a product to save it.</p>
        <Link to="/products" className="mq-btn-primary mt-8">
          Browse products
        </Link>
      </main>
    )
  }

  return (
    <main className="mq-container py-8 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-mq-border pb-6">
        <div>
          <h1 className="mq-heading">Wishlist</h1>
          <p className="mt-1 text-sm text-mq-muted">
            {items.length} saved {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-mq-muted hover:text-mq-ink"
          onClick={() => wishlist.clear()}
        >
          Clear all
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  )
}
