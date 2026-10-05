import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { useCart } from '@/cart/CartContext'
import { formatINR } from '@/lib/format'
import { Pill } from '@/components/Pill'
import { fetchPincode } from '@/lib/pincode'

type PayPanel = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'
type Step = 'address' | 'payment'

const BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra',
  'Punjab National Bank',
]
const WALLETS = ['Paytm Wallet', 'Amazon Pay', 'Mobikwik', 'Freecharge']
const UPI_APPS = ['PhonePe', 'Google Pay', 'Paytm', 'BHIM']

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled,
  inputMode,
  maxLength,
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  type?: string
  disabled?: boolean
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  maxLength?: number
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-neutral-900">{label}</div>
      <input
        className="mq-input mt-2 !rounded-xl disabled:bg-stone-50"
        placeholder={placeholder}
        value={value}
        type={type}
        disabled={disabled}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function CheckoutPage() {
  const auth = useAuth()
  const cart = useCart()
  const [step, setStep] = useState<Step>('address')
  const [panel, setPanel] = useState<PayPanel>('upi')
  const [placed, setPlaced] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [paidTotal, setPaidTotal] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [line1, setLine1] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [pincode, setPincode] = useState('')
  const [pinStatus, setPinStatus] = useState<string | null>(null)
  const [pinBusy, setPinBusy] = useState(false)

  const [upiApp] = useState(UPI_APPS[0])
  const [upiVpa, setUpiVpa] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [bank] = useState(BANKS[0])
  const [wallet, setWallet] = useState(WALLETS[0])

  const shipping = useMemo(
    () => (cart.subtotal >= 999 ? 0 : cart.items.length ? 79 : 0),
    [cart.subtotal, cart.items.length],
  )
  const total = cart.subtotal + shipping
  const codAllowed = total > 500

  useEffect(() => {
    if (!auth.user) return
    setName((prev) => prev || auth.user!.name)
    setEmail((prev) => prev || auth.user!.email)
  }, [auth.user])

  if (!auth.isSignedIn) {
    return <Navigate to="/login?returnUrl=%2Fcheckout" replace />
  }

  async function onPincodeChange(raw: string) {
    const next = raw.replace(/\D/g, '').slice(0, 6)
    setPincode(next)
    setPinStatus(null)
    if (next.length !== 6) return
    setPinBusy(true)
    try {
      const place = await fetchPincode(next)
      setCity(place.city || place.district)
      setDistrict(place.district)
      setState(place.state)
      setPinStatus(`Delivering to ${place.area || place.city}, ${place.state}`)
    } catch (err) {
      setPinStatus(err instanceof Error ? err.message : 'Invalid pincode')
    } finally {
      setPinBusy(false)
    }
  }

  const canContinueAddress =
    name.trim().length >= 2 &&
    phone.replace(/\D/g, '').length >= 10 &&
    email.includes('@') &&
    line1.trim().length >= 6 &&
    city.trim().length >= 2 &&
    state.trim().length >= 2 &&
    pincode.replace(/\D/g, '').length === 6

  function confirmOrder(methodLabel: string) {
    if (!auth.isSignedIn) {
      setProcessing(false)
      setPayError('Please sign in to place your order.')
      return
    }
    setPaidTotal(total)
    setOrderId(`MARTIQ-${Math.floor(100000 + Math.random() * 900000)}`)
    setPlaced(true)
    setProcessing(false)
    setPayError(null)
    sessionStorage.setItem('martiq-last-pay', methodLabel)
  }

  function markUnavailable(method: 'UPI' | 'Net Banking') {
    setProcessing(false)
    setPayError(
      `${method} payment is not available right now. Please place your order using Cash on Delivery (COD).`,
    )
    setPanel('cod')
  }

  function simulateOnlinePay(methodLabel: string) {
    setPayError(null)
    setProcessing(true)
    window.setTimeout(() => {
      if (Math.random() < 0.12) {
        setProcessing(false)
        setPayError('Payment declined by bank. No amount was deducted. Try another method or COD.')
        return
      }
      confirmOrder(methodLabel)
      cart.clear()
    }, 1600)
  }

  if (cart.items.length === 0 && !placed) {
    return (
      <main className="mq-container py-16 text-center">
        <h1 className="mq-heading">Checkout</h1>
        <p className="mt-2 text-sm text-neutral-600">Your bag is empty.</p>
        <Link to="/products" className="mq-btn-primary mt-8">
          Shop now
        </Link>
      </main>
    )
  }

  const lastPay = sessionStorage.getItem('martiq-last-pay') || panel.toUpperCase()

  return (
    <main className="mq-container py-6 pb-16 sm:py-8">
      <nav className="text-sm text-neutral-500">
        <Link to="/cart" className="hover:text-neutral-900">
          Bag
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">Checkout</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <h1 className="mq-heading">Checkout</h1>
        <div className="flex gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
          <span className={step === 'address' ? 'text-mq-primary' : 'text-stone-400'}>1 · Address</span>
          <span className="text-stone-300">/</span>
          <span className={step === 'payment' ? 'text-mq-primary' : 'text-stone-400'}>2 · Payment</span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
        <section className="lg:col-span-7 space-y-6">
          {step === 'address' ? (
            <div className="border border-mq-border bg-white p-4 sm:p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                Delivery address
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" placeholder="Your name" value={name} onChange={setName} />
                <Field
                  label="Phone"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(v) => setPhone(v.replace(/[^\d\s]/g, '').slice(0, 14))}
                  inputMode="tel"
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={setEmail}
                    type="email"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Address"
                    placeholder="House, street, area"
                    value={line1}
                    onChange={setLine1}
                  />
                </div>
                <Field
                  label="Pincode"
                  placeholder="400001"
                  value={pincode}
                  onChange={(v) => void onPincodeChange(v)}
                  inputMode="numeric"
                  maxLength={6}
                />
                <Field
                  label="City"
                  placeholder={pinBusy ? 'Fetching…' : 'Auto from pincode'}
                  value={city}
                  onChange={setCity}
                />
                <Field label="District" placeholder="District" value={district} onChange={setDistrict} />
                <Field label="State" placeholder="State" value={state} onChange={setState} />
              </div>
              {pinStatus ? (
                <p
                  className={[
                    'mt-3 text-xs',
                    pinStatus.startsWith('Delivering') ? 'text-emerald-700' : 'text-mq-primary',
                  ].join(' ')}
                >
                  {pinBusy ? 'Looking up pincode…' : pinStatus}
                </p>
              ) : (
                <p className="mt-3 text-xs text-neutral-500">
                  Enter pincode to auto-fill city & state (India Postal API).
                </p>
              )}
              <button
                type="button"
                className={['mq-btn-primary mt-6 w-full', !canContinueAddress && 'opacity-50'].join(' ')}
                disabled={!canContinueAddress}
                onClick={() => setStep('payment')}
              >
                Continue to payment
              </button>
            </div>
          ) : (
            <div className="overflow-hidden border border-mq-border bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-mq-border bg-[#faf8f6] px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="inline-grid h-8 w-8 place-items-center rounded bg-mq-primary text-sm font-black text-white">
                    M
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-mq-ink">Martiq Secure Checkout</p>
                    <p className="text-[11px] text-stone-500">256-bit encrypted payment</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-mq-primary underline"
                  onClick={() => setStep('address')}
                >
                  Edit address
                </button>
              </div>

              <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
                <nav className="flex gap-2 overflow-x-auto border-b border-mq-border p-3 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r">
                  {(
                    [
                      ['upi', 'UPI', 'Currently unavailable'],
                      ['card', 'Cards', 'Credit / Debit'],
                      ['netbanking', 'Net Banking', 'Currently unavailable'],
                      ['wallet', 'Wallets', 'Paytm · Amazon Pay'],
                      [
                        'cod',
                        'Cash on Delivery',
                        codAllowed ? 'Pay when delivered' : 'Min order ₹500+',
                      ],
                    ] as const
                  ).map(([id, label, sub]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setPanel(id)
                        setPayError(null)
                      }}
                      className={[
                        'min-w-[140px] flex-1 rounded-lg border px-3 py-2.5 text-left transition lg:min-w-0',
                        panel === id
                          ? 'border-mq-primary bg-red-50'
                          : 'border-stone-200 bg-white hover:border-stone-300',
                      ].join(' ')}
                    >
                      <div className="text-sm font-semibold text-mq-ink">{label}</div>
                      <div className="text-[11px] text-stone-500">{sub}</div>
                    </button>
                  ))}
                </nav>

                <div className="p-4 sm:p-6">
                  <div className="mb-4 rounded-lg bg-[#faf8f6] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-stone-500">
                      Amount payable
                    </p>
                    <p className="text-2xl font-bold text-mq-ink">
                      ₹{formatINR(placed ? paidTotal : total)}
                    </p>
                  </div>

                  {payError ? (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
                      {payError}
                    </div>
                  ) : null}

                  {panel === 'upi' ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Pay using UPI</h3>
                      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
                        UPI is not available right now. Please place your order on{' '}
                        <strong>Cash on Delivery</strong>.
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 opacity-50 pointer-events-none">
                        {UPI_APPS.map((app) => (
                          <button
                            key={app}
                            type="button"
                            className={[
                              'rounded-lg border px-3 py-2 text-sm font-medium',
                              upiApp === app
                                ? 'border-mq-primary bg-mq-primary text-white'
                                : 'border-stone-200',
                            ].join(' ')}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                      <Field
                        label="UPI ID (VPA)"
                        placeholder="yourname@upi"
                        value={upiVpa}
                        onChange={setUpiVpa}
                        disabled
                      />
                      <button
                        type="button"
                        className="mq-btn-primary w-full"
                        onClick={() => markUnavailable('UPI')}
                      >
                        Proceed to Pay ₹{formatINR(total)}
                      </button>
                      <button
                        type="button"
                        className="mq-btn-secondary w-full"
                        onClick={() => {
                          setPayError(null)
                          setPanel('cod')
                        }}
                      >
                        Place on COD instead
                      </button>
                    </div>
                  ) : null}

                  {panel === 'card' ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Pay using Card</h3>
                      <Field
                        label="Card Number"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={cardNumber}
                        onChange={(v) =>
                          setCardNumber(
                            v
                              .replace(/\D/g, '')
                              .slice(0, 16)
                              .replace(/(.{4})/g, '$1 ')
                              .trim(),
                          )
                        }
                        inputMode="numeric"
                      />
                      <Field
                        label="Name on Card"
                        placeholder="Cardholder name"
                        value={cardName}
                        onChange={setCardName}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Field
                          label="Expiry (MM/YY)"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(v) => {
                            const d = v.replace(/\D/g, '').slice(0, 4)
                            setCardExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
                          }}
                          inputMode="numeric"
                        />
                        <Field
                          label="CVV"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(v) => setCardCvv(v.replace(/\D/g, '').slice(0, 4))}
                          type="password"
                          inputMode="numeric"
                        />
                      </div>
                      <button
                        type="button"
                        className="mq-btn-primary w-full"
                        onClick={() => simulateOnlinePay('Card')}
                      >
                        Pay ₹{formatINR(total)}
                      </button>
                    </div>
                  ) : null}

                  {panel === 'netbanking' ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Net Banking</h3>
                      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
                        Net Banking is not available right now. Please place your order on{' '}
                        <strong>Cash on Delivery</strong>.
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 opacity-50 pointer-events-none">
                        {BANKS.map((b) => (
                          <label
                            key={b}
                            className={[
                              'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm',
                              bank === b ? 'border-mq-primary bg-red-50' : 'border-stone-200',
                            ].join(' ')}
                          >
                            <input type="radio" name="bank" checked={bank === b} readOnly />
                            {b}
                          </label>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="mq-btn-primary w-full"
                        onClick={() => markUnavailable('Net Banking')}
                      >
                        Continue to Bank
                      </button>
                      <button
                        type="button"
                        className="mq-btn-secondary w-full"
                        onClick={() => {
                          setPayError(null)
                          setPanel('cod')
                        }}
                      >
                        Place on COD instead
                      </button>
                    </div>
                  ) : null}

                  {panel === 'wallet' ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Wallets</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {WALLETS.map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setWallet(w)}
                            className={[
                              'rounded-lg border px-3 py-2.5 text-sm font-medium',
                              wallet === w
                                ? 'border-mq-primary bg-mq-primary text-white'
                                : 'border-stone-200',
                            ].join(' ')}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="mq-btn-primary w-full"
                        onClick={() => simulateOnlinePay(`Wallet · ${wallet}`)}
                      >
                        Pay with Wallet
                      </button>
                    </div>
                  ) : null}

                  {panel === 'cod' ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Cash on Delivery</h3>
                      <p className="text-sm text-stone-600">
                        Pay in cash when your order is delivered. Keep exact change ready if possible.
                      </p>
                      {codAllowed ? (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
                          COD available for this order (total ₹{formatINR(total)}).
                        </div>
                      ) : (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
                          COD is available only for orders above ₹500. Current total is ₹
                          {formatINR(total)}. Add more items to use COD.
                        </div>
                      )}
                      <button
                        type="button"
                        className={['mq-btn-primary w-full', !codAllowed && 'opacity-50'].join(' ')}
                        disabled={!codAllowed}
                        onClick={() => {
                          if (!codAllowed) return
                          confirmOrder('COD')
                          cart.clear()
                        }}
                      >
                        Place Order · Cash on Delivery
                      </button>
                    </div>
                  ) : null}

                  <p className="mt-6 text-xs text-stone-500">
                    Paying as <strong className="text-mq-ink">{name || 'Guest'}</strong>
                    {phone ? ` · ${phone}` : ''}
                    {email ? ` · ${email}` : ''}
                  </p>
                  <p className="mt-1 text-[11px] text-stone-400">
                    Merchant: MARTIQ E-COMMERCE PRIVATE LIMITED · Secure checkout
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="border border-mq-border bg-white p-4 sm:p-6 lg:col-span-5 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">Order summary</h2>
            <Link to="/cart" className="text-sm text-neutral-500 hover:text-neutral-900">
              Edit
            </Link>
          </div>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto">
            {cart.items.map((it) => (
              <li key={it.product.id} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-neutral-600">
                  {it.product.name} × {it.qty}
                </span>
                <span className="shrink-0 font-medium">₹{formatINR(it.qty * it.product.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 border-t border-neutral-100 pt-4 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>₹{formatINR(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `₹${formatINR(shipping)}`}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold text-neutral-900">
              <span>Total</span>
              <span>₹{formatINR(total)}</span>
            </div>
          </div>
          {shipping === 0 ? (
            <p className="mt-3 text-xs text-emerald-700">Free shipping applied.</p>
          ) : (
            <p className="mt-3 text-xs text-neutral-500">Add more for free shipping over ₹999.</p>
          )}
        </aside>
      </div>

      {processing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
          <div className="w-full max-w-sm border border-mq-border bg-white p-8 text-center shadow-xl">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-stone-200 border-t-mq-primary" />
            <h2 className="mt-4 text-lg font-semibold">Processing payment…</h2>
            <p className="mt-2 text-sm text-stone-500">Connecting securely to your bank.</p>
          </div>
        </div>
      ) : null}

      {placed ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md border border-mq-border bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-neutral-900">Thank you</h2>
            <p className="mt-2 text-sm text-neutral-600">Your Martiq order is confirmed.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {orderId ? <Pill>{orderId}</Pill> : null}
              <Pill>{lastPay}</Pill>
            </div>
            <p className="mt-3 text-xs text-stone-500">
              Ship to {line1}, {city}, {state} — {pincode}
            </p>
            <Link
              to={`/track?id=${encodeURIComponent(orderId ?? '')}`}
              className="mt-4 inline-block text-sm font-medium text-neutral-900 underline"
            >
              Track order →
            </Link>
            <div className="mt-6 flex gap-3">
              <Link to="/products" className="mq-btn-secondary flex-1 text-center">
                Shop more
              </Link>
              <button
                type="button"
                className="mq-btn-primary flex-1"
                onClick={() => {
                  setPlaced(false)
                  setOrderId(null)
                  setStep('address')
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
