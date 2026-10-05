import { Link } from 'react-router-dom'
import { useCart } from '@/cart/CartContext'
import { formatINR } from '@/lib/format'

export function CartPage() {
  const cart = useCart()

  if (cart.items.length === 0) {
    return (
      <main className="mq-container py-16 text-center">
        <h1 className="mq-heading">Your bag is empty</h1>
        <p className="mt-2 text-sm text-neutral-600">Add something you like from the shop.</p>
        <Link to="/products" className="mq-btn-primary mt-8">
          Continue shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="mq-container py-8 pb-16">
      <h1 className="mq-heading">Bag</h1>
      <p className="mt-1 text-sm text-neutral-600">{cart.totalQty} items</p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-4">
          {cart.items.map((it) => (
            <div key={it.product.id} className="mq-card flex gap-4 p-4">
              <Link to={`/products/${it.product.id}`} className="shrink-0">
                <img
                  src={it.product.image}
                  alt=""
                  className="size-24 border border-stone-200 object-cover sm:size-28"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/products/${it.product.id}`} className="block hover:text-mq-primary">
                  <span className="text-base font-medium text-mq-ink">{it.product.name}</span>
                  <span className="mt-0.5 block text-xs uppercase tracking-[0.1em] text-stone-500">
                    {it.product.color}
                  </span>
                </Link>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-stone-400">{it.product.sku}</p>
                <div className="mt-1 text-sm text-stone-600">₹{formatINR(it.product.price)}</div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center border border-stone-200">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm hover:bg-neutral-50"
                      onClick={() => cart.setQty(it.product.id, Math.max(1, it.qty - 1))}
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-sm">{it.qty}</span>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm hover:bg-neutral-50"
                      onClick={() => cart.setQty(it.product.id, it.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm font-semibold">₹{formatINR(it.qty * it.product.price)}</div>
                </div>
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-neutral-500 hover:text-neutral-900"
                  onClick={() => cart.remove(it.product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="mq-card p-6 lg:sticky lg:top-32 lg:w-80">
          <div className="text-sm text-neutral-600">Subtotal</div>
          <div className="mt-1 text-2xl font-semibold text-neutral-900">₹{formatINR(cart.subtotal)}</div>
          <p className="mt-2 text-xs text-neutral-500">Shipping calculated at checkout.</p>
          <Link to="/checkout" className="mq-btn-primary mt-6 w-full">
            Checkout
          </Link>
          <button
            type="button"
            className="mt-3 w-full text-center text-sm font-medium text-neutral-500 hover:text-neutral-900"
            onClick={() => cart.clear()}
          >
            Clear bag
          </button>
        </aside>
      </div>
    </main>
  )
}
