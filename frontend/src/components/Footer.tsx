import { Link } from 'react-router-dom'
import { COMPANY } from '@/data/company'
import { POLICY_NAV } from '@/data/policies'

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-sm text-white/65 transition hover:text-white">
      {children}
    </Link>
  )
}

const TRUST = ['Free shipping over ₹999', 'Easy returns & exchanges', 'Secure checkout']
const PAYMENTS = ['UPI', 'Cards', 'Net Banking', 'Wallets', 'COD']

export function Footer() {
  return (
    <footer className="mt-8 bg-mq-ink text-white">
      <div className="border-b border-white/10 bg-[#0b0b0b]">
        <div className="mq-container flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
          {TRUST.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>

      <div className="mq-container grid gap-12 py-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="inline-block rounded bg-mq-primary px-2.5 py-2 text-sm font-black uppercase tracking-[0.12em] text-white">
            MARTIQ
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            Denim & everyday essentials from {COMPANY.legalName}. Fits and washes built for how you
            actually live.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-white/45">
            GSTIN {COMPANY.gstin}
            <br />
            {COMPANY.address}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/products?tag=new"
              className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white/80 hover:border-white hover:text-white"
            >
              New arrivals
            </Link>
            <Link
              to="/products?tag=sale"
              className="rounded-full border border-[#d4002a66] bg-[#d4002a22] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#ffb3c0]"
            >
              Sale
            </Link>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Shop</div>
            <div className="flex flex-col gap-2.5 pt-1">
              <FooterLink to="/products">All products</FooterLink>
              <FooterLink to="/products?tag=new">New arrivals</FooterLink>
              <FooterLink to="/products?category=jeans">Jeans</FooterLink>
              <FooterLink to="/products?gender=Men">Men</FooterLink>
              <FooterLink to="/products?gender=Women">Women</FooterLink>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Help</div>
            <div className="flex flex-col gap-2.5 pt-1">
              <FooterLink to="/orders">My orders</FooterLink>
              <FooterLink to="/track">Track order</FooterLink>
              <FooterLink to="/wishlist">Wishlist</FooterLink>
              <FooterLink to="/login">Sign in</FooterLink>
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-sm text-white/65 transition hover:text-white"
              >
                Contact support
              </a>
            </div>
          </div>

          <div className="space-y-3 sm:col-span-2 lg:col-span-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Policies
            </div>
            <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-2">
              {POLICY_NAV.map((p) => (
                <FooterLink key={p.slug} to={p.to}>
                  {p.title}
                </FooterLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mq-container flex flex-col gap-3 py-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-4">
            {PAYMENTS.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
