import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { ProductCard } from '@/components/ProductCard'
import { IconArrow } from '@/components/icons'
import { photo } from '@/lib/images'

const QUICK_LINKS = [
  { label: 'Women', to: '/products?gender=Women' },
  { label: 'Men', to: '/products?gender=Men' },
  { label: 'Jeans', to: '/products?category=jeans' },
  { label: 'Kids', to: '/products?gender=Unisex' },
  { label: 'Sale', to: '/products?tag=sale', sale: true },
]

const CATEGORIES = [
  {
    title: 'Loose & Baggy',
    desc: 'Easy silhouettes, all-day comfort.',
    to: '/products?category=jeans',
    image: photo('photo-1541099649105-f69ad21f3246', 720),
  },
  {
    title: 'Women’s tops',
    desc: 'Layers that feel considered.',
    to: '/products?category=shirts',
    image: photo('photo-1434389677669-e08b4cac3105', 720),
  },
  {
    title: 'Overdyed denim',
    desc: 'Depth of colour, broken-in hand.',
    to: '/products?category=jeans',
    image: photo('photo-1542272604-787c3835535d', 720),
  },
  {
    title: 'Polos & knits',
    desc: 'Clean necklines, soft structure.',
    to: '/products?category=tees',
    image: photo('photo-1521572163474-6864f9cf17ab', 720),
  },
  {
    title: 'Shirts & overshirts',
    desc: 'Tailoring meets everyday ease.',
    to: '/products?category=shirts',
    image: photo('photo-1596755094514-f87e34085b2c', 720),
  },
]

function ProductRow({
  title,
  to,
  items,
}: {
  title: string
  to: string
  items: Product[]
}) {
  if (!items.length) return null
  return (
    <section className="py-10 sm:py-12">
      <div className="mb-3.5 flex items-end justify-between gap-3 border-b border-mq-border pb-3">
        <h2 className="font-display text-[1.45rem] font-normal tracking-[0.02em] text-mq-ink">{title}</h2>
        <Link to={to} className="text-sm text-mq-ink/90 hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

function ClassicHero() {
  return (
    <section className="mq-container grid grid-cols-1 items-stretch gap-4 py-5 sm:gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(260px,0.92fr)] lg:gap-7 lg:py-7">
      <div className="hero-panel relative flex flex-col justify-center border border-[#e8e4dc] px-5 py-6 shadow-[inset_0_1px_#ffffffe6,0_12px_40px_#1111110f] sm:px-7 sm:py-8 lg:px-8">
        <div className="mb-4 sm:mb-5">
          <p className="mb-2.5 flex flex-wrap items-baseline gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-mq-primary">EST.</span>
            <span className="font-display text-[clamp(1.35rem,2.8vw,1.75rem)] font-normal tracking-[0.06em] text-mq-ink">
              Martiq
            </span>
          </p>
          <h1 className="font-display mb-2.5 text-[clamp(2.1rem,4.5vw,3rem)] font-normal leading-[1.08] tracking-[-0.02em] text-mq-ink">
            Denim & essentials
          </h1>
          <p className="max-w-[40ch] text-[15px] leading-relaxed text-[#4b5563]">
            Built for everyday — fits, washes, and layers you&apos;ll wear on repeat.
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={[
                'rounded-full border px-3.5 py-2 text-xs font-bold tracking-[0.04em] transition',
                link.sale
                  ? 'border-[#d4002a59] bg-[#fff5f6] text-mq-primary hover:border-mq-primary hover:bg-mq-primary hover:text-white'
                  : 'border-mq-border bg-white text-mq-ink hover:border-mq-ink hover:bg-mq-ink hover:text-white',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-2.5">
          <Link
            to="/products?tag=new"
            className="inline-flex items-center gap-2 rounded-full bg-mq-ink px-5 py-3 text-xs font-extrabold uppercase tracking-[0.06em] text-white transition hover:brightness-95"
          >
            New arrivals
            <IconArrow />
          </Link>
          <Link
            to="/products?tag=sale"
            className="inline-flex items-center rounded-full border border-mq-ink px-[18px] py-3 text-xs font-extrabold uppercase tracking-[0.06em] text-mq-ink transition hover:bg-mq-ink hover:text-white"
          >
            Shop sale
          </Link>
        </div>

        <ul className="flex list-none flex-wrap gap-x-4 gap-y-1.5 border-t border-black/10 pt-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-mq-muted">
          <li>Free shipping ₹999+</li>
          <li>Easy returns</li>
          <li>Secure checkout</li>
        </ul>
      </div>

      <Link
        to="/products?category=jeans"
        className="group relative block min-h-[280px] overflow-hidden border border-mq-ink bg-[radial-gradient(90%_70%_at_70%_20%,#d4002a40,transparent_55%),linear-gradient(165deg,#2a3548_0%,#121820_55%,#0a0d12_100%)] text-white sm:min-h-[340px] lg:min-h-0"
      >
        <div
          className="absolute inset-0 scale-[1.02] bg-cover bg-[center_22%] transition duration-500 group-hover:scale-[1.06]"
          style={{ backgroundImage: 'url(/images/promo-1.jpg)' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(#00000026_0%,#0000008c_72%,#000000d1_100%),linear-gradient(90deg,#00000059_0%,transparent_45%)]" />
        <div className="pointer-events-none absolute inset-3.5 border border-white/22" />
        <div className="absolute inset-0 z-[2] flex flex-col items-start justify-end gap-2 p-5 sm:p-7">
          <div className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-none tracking-[0.12em] [text-shadow:0_4px_28px_#00000073]">
            501®
          </div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/88">
            Iconic straight fit
          </div>
          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-white/10 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] backdrop-blur-[6px] transition group-hover:border-white/55 group-hover:bg-white/18">
            Shop denim
            <IconArrow className="size-3 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </section>
  )
}

export function HomePage({ products }: { products: Product[] }) {
  const newDrops = products.filter((p) => p.badge === 'new').slice(0, 4)
  const bestsellers = products.filter((p) => p.badge === 'bestseller').slice(0, 4)
  const jeans = products.filter((p) => p.category === 'jeans').slice(0, 4)
  const sale = products.filter((p) => p.mrp && p.mrp > p.price).slice(0, 4)

  return (
    <main>
      <ClassicHero />

      <div className="mq-container pb-10">
        <section className="py-8 sm:py-10">
          <div className="mb-3.5 flex items-end justify-between gap-3 border-b border-mq-border pb-3">
            <h2 className="font-display text-[1.45rem] font-normal tracking-[0.02em] text-mq-ink">
              Shop by category
            </h2>
            <Link to="/products" className="text-sm text-mq-ink/90 hover:underline">
              All products
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-3.5">
            {CATEGORIES.map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="group block border border-mq-border bg-white p-3.5 transition hover:border-mq-ink/30 hover:bg-[#fafafa]"
              >
                <div className="relative mb-2.5 h-[140px] overflow-hidden border border-mq-border bg-gradient-to-br from-[#e8eaee] to-[#f9fafb]">
                  <img
                    src={c.image}
                    alt=""
                    className="h-full w-full scale-[1.02] object-cover transition duration-350 group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-sm font-medium text-mq-ink">{c.title}</h3>
                <p className="mt-1.5 text-sm text-mq-muted">{c.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <ProductRow
          title="New arrivals"
          to="/products?tag=new"
          items={newDrops.length ? newDrops : products.slice(0, 4)}
        />

        <section className="my-6 overflow-hidden border border-mq-border bg-[radial-gradient(900px_400px_at_20%_30%,#d4002a22,transparent_55%),linear-gradient(135deg,#f3f4f6,#fff)] px-6 py-10 sm:px-10 sm:py-12">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-mq-primary">Limited time</p>
          <h2 className="font-display mt-2 text-[clamp(2rem,4vw,2.75rem)] font-normal tracking-[-0.02em] text-mq-ink">
            Up to <span className="text-mq-primary">60%</span> off
          </h2>
          <p className="mt-2 max-w-md text-sm text-[#4b5563]">
            Selected denim, tops & essentials — while stocks last.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              to="/products?tag=sale"
              className="inline-flex rounded-full bg-mq-ink px-5 py-3 text-xs font-extrabold uppercase tracking-[0.06em] text-white"
            >
              Shop sale
            </Link>
            <Link
              to="/products?tag=new"
              className="inline-flex rounded-full border border-mq-ink px-[18px] py-3 text-xs font-extrabold uppercase tracking-[0.06em]"
            >
              New arrivals
            </Link>
          </div>
        </section>

        <ProductRow title="Sale picks" to="/products?tag=sale" items={sale} />
        <ProductRow
          title="In trend"
          to="/products?tag=bestseller"
          items={bestsellers.length ? bestsellers : products.slice(0, 4)}
        />
        <ProductRow title="Denim" to="/products?category=jeans" items={jeans} />

        <section className="grid gap-4 py-8 sm:py-10 lg:grid-cols-2">
          {[
            {
              head: 'Women’s',
              tagline: 'Denim, tops & layers',
              to: '/products?category=shirts',
              image: '/images/promo-2.png',
              items: [
                { label: 'Jeans', to: '/products?category=jeans' },
                { label: 'Shirts & tops', to: '/products?category=shirts' },
                { label: 'T-shirts & polos', to: '/products?category=tees' },
                { label: 'New arrivals', to: '/products?tag=new' },
              ],
            },
            {
              head: 'Men’s',
              tagline: 'Fits for every day',
              to: '/products?category=tees',
              image: '/images/promo-1.jpg',
              items: [
                { label: 'Jeans', to: '/products?category=jeans' },
                { label: 'Shirts', to: '/products?category=shirts' },
                { label: 'T-shirts & polos', to: '/products?category=tees' },
                { label: 'Sale', to: '/products?tag=sale', highlight: true },
              ],
            },
          ].map((dept) => (
            <article key={dept.head} className="overflow-hidden border border-mq-border bg-white">
              <Link to={dept.to} className="group relative block min-h-[220px] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]"
                  style={{ backgroundImage: `url(${dept.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">{dept.tagline}</p>
                  <h3 className="font-display mt-1 text-3xl font-normal">{dept.head}</h3>
                  <span className="mt-3 inline-flex text-xs font-extrabold uppercase tracking-[0.12em] underline underline-offset-4">
                    Shop department
                  </span>
                </div>
              </Link>
              <div className="flex flex-wrap gap-2 border-t border-mq-border p-4">
                {dept.items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={[
                      'rounded-full border px-3 py-1.5 text-xs font-bold tracking-[0.04em] transition',
                      item.highlight
                        ? 'border-[#d4002a59] bg-[#fff5f6] text-mq-primary'
                        : 'border-mq-border text-mq-ink hover:border-mq-ink',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
