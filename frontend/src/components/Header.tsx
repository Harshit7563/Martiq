import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import type { Category } from '@/types'
import { useCart } from '@/cart/CartContext'
import { useWishlist } from '@/wishlist/WishlistContext'
import { useAuth } from '@/auth/AuthContext'
import { IconBag, IconHeart, IconSearch, IconUser } from '@/components/icons'

const NAV = [
  { label: 'Men', to: '/products?gender=Men' },
  { label: 'Women', to: '/products?gender=Women' },
  { label: 'New', to: '/products?tag=new' },
  { label: 'Sale', to: '/products?tag=sale', sale: true },
  { label: 'Jeans', to: '/products?category=jeans' },
  { label: 'Kids', to: '/products?gender=Unisex' },
  { label: 'Collections', to: '/products' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Orders', to: '/orders' },
]

const iconBtn =
  'relative inline-flex size-[42px] items-center justify-center rounded-full border border-mq-border bg-white text-mq-ink transition hover:shadow-[var(--mq-shadow)]'

export function Header({
  categories: _categories,
  onSearchChange,
}: {
  categories: Category[]
  onSearchChange?: (q: string) => void
}) {
  void _categories
  const cart = useCart()
  const wishlist = useWishlist()
  const auth = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const bagLabel = cart.totalQty === 1 ? '1 item in bag' : `${cart.totalQty} items in bag`

  return (
    <header className="sticky top-0 z-30 border-b border-mq-border bg-white/90 backdrop-blur-[10px]">
      <div className="mq-container flex min-h-16 flex-wrap items-center gap-3 py-3 lg:flex-nowrap lg:gap-4">
        <Link
          to="/"
          className="shrink-0 rounded-lg bg-mq-primary px-2.5 py-2 text-sm font-black uppercase tracking-[0.12em] text-white"
        >
          MARTIQ
        </Link>

        <nav className="hidden items-center gap-3.5 xl:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }: { isActive: boolean }) =>
                [
                  'whitespace-nowrap text-sm transition hover:underline',
                  item.sale ? 'font-medium text-mq-primary' : 'text-mq-ink/90',
                  isActive ? 'underline' : '',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            {auth.isSignedIn ? (
              <>
                <span className="max-w-[100px] truncate text-xs font-bold">Hi, {auth.user?.name}</span>
                <button
                  type="button"
                  className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-mq-ink/80 hover:text-mq-ink"
                  onClick={() => auth.signOut()}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-mq-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-mq-ink hover:shadow-[var(--mq-shadow)]"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full border border-mq-ink bg-mq-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white hover:brightness-95"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <form
            className="hidden items-center md:flex"
            onSubmit={(e) => {
              e.preventDefault()
              const q = query.trim()
              onSearchChange?.(q)
              navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
            }}
          >
            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mq-muted" />
              <input
                className="w-[220px] rounded-full border border-mq-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-mq-muted focus:border-mq-ink lg:w-[260px]"
                placeholder="Search products..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  onSearchChange?.(e.target.value)
                }}
              />
            </div>
          </form>

          <div className="flex items-center gap-1">
            <Link
              to="/wishlist"
              className={[iconBtn, wishlist.count > 0 ? 'border-[#d4002a66] bg-[#d4002a0f] text-mq-primary' : ''].join(
                ' ',
              )}
              aria-label="Wishlist"
            >
              <IconHeart />
              {wishlist.count > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 min-w-[1.15rem] rounded-full border-2 border-white bg-mq-primary px-1.5 text-center text-[11px] font-semibold leading-[1.15rem] text-white">
                  {wishlist.count > 9 ? '9+' : wishlist.count}
                </span>
              ) : null}
            </Link>
            <Link to="/cart" className={iconBtn} aria-label={bagLabel}>
              <IconBag />
              {cart.totalQty > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 min-w-[1.15rem] rounded-full border-2 border-white bg-mq-primary px-1.5 text-center text-[11px] font-semibold leading-[1.15rem] text-white">
                  {cart.totalQty > 9 ? '9+' : cart.totalQty}
                </span>
              ) : null}
            </Link>
            <Link to={auth.isSignedIn ? '/account' : '/login'} className={iconBtn} aria-label="Account">
              <IconUser />
            </Link>
          </div>
        </div>

        <form
          className="flex w-full md:hidden"
          onSubmit={(e) => {
            e.preventDefault()
            const q = query.trim()
            onSearchChange?.(q)
            navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
          }}
        >
          <div className="relative w-full">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mq-muted" />
            <input
              className="w-full rounded-full border border-mq-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-mq-muted focus:border-mq-ink"
              placeholder="Search Martiq…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                onSearchChange?.(e.target.value)
              }}
            />
          </div>
        </form>

        <nav className="flex w-full gap-4 overflow-x-auto pb-1 scrollbar-none xl:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }: { isActive: boolean }) =>
                [
                  'shrink-0 whitespace-nowrap py-1 text-sm',
                  item.sale ? 'text-mq-primary' : 'text-mq-ink/80',
                  isActive ? 'underline' : '',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
