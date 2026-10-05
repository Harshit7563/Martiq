import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { AuthShell } from '@/components/AuthShell'
import { getGoogleClientId } from '@/auth/google'
import { sendSignupOtp, verifySignupOtp } from '@/lib/api'

type Step = 'details' | 'otp'

export function SignupPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const returnUrl = params.get('returnUrl') || '/account'
  const [step, setStep] = useState<Step>('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const hasGoogleClient = Boolean(getGoogleClientId())

  useEffect(() => {
    document.title = 'Create account | Martiq'
  }, [])

  const handleGoogle = useCallback(
    (profile: { name: string; email: string; picture?: string }) => {
      auth.signIn({
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
        provider: 'google',
      })
      navigate(returnUrl, { replace: true })
    },
    [auth, navigate, returnUrl],
  )

  if (auth.isSignedIn) {
    return <Navigate to={returnUrl} replace />
  }

  async function requestOtp() {
    setBusy(true)
    setError('')
    setInfo('')
    try {
      const res = await sendSignupOtp(name, email)
      setStep('otp')
      setInfo(res.message || 'OTP sent to your email.')
    } catch (err) {
      const e = err as Error & { devOtp?: string }
      if (e.devOtp) {
        setStep('otp')
        setInfo(`Email service not fully configured yet. Use this test OTP: ${e.devOtp}`)
        setOtp(e.devOtp)
      } else {
        setError(e.message || 'Could not send OTP.')
      }
    } finally {
      setBusy(false)
    }
  }

  async function onDetailsSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const n = name.trim()
    const em = email.trim().toLowerCase()
    if (!n) return setError('Please enter your name.')
    if (!em.includes('@')) return setError('Enter a valid email address.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (auth.emailTaken(em)) {
      return setError('An account with this email already exists. Sign in instead.')
    }
    await requestOtp()
  }

  async function onOtpSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await verifySignupOtp(email, otp.trim())
      const result = auth.signup(name, email, password)
      if (!result.ok) {
        // If account was somehow created mid-flow, try login
        const login = auth.loginWithEmail(email, password)
        if (!login.ok) {
          setError(result.error)
          return
        }
      }
      navigate(returnUrl, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      tag="Sign up"
      title={step === 'details' ? 'Create your account' : 'Verify your email'}
      lead={
        step === 'details'
          ? 'Join Martiq with Google, or create an email account. We’ll send a one-time code to verify your email.'
          : `Enter the 6-digit OTP sent to ${email.trim().toLowerCase()}. Valid for 15 minutes.`
      }
      switchText="Already have an account?"
      switchTo={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
      switchLabel="Sign in"
    >
      {step === 'details' ? (
        <>
          <GoogleSignInButton onSuccess={handleGoogle} onError={setError} />
          {hasGoogleClient ? (
            <p className="mt-2 text-center text-[11px] text-mq-muted">
              Secured with Google Identity Services
            </p>
          ) : null}
          {error ? <p className="mt-2 text-center text-sm text-mq-primary">{error}</p> : null}

          <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-mq-muted">
            <span className="h-px flex-1 bg-mq-border" />
            or
            <span className="h-px flex-1 bg-mq-border" />
          </div>

          <form className="space-y-3" onSubmit={onDetailsSubmit}>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-mq-ink">Name</span>
              <input
                className="mq-input !rounded-lg"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-mq-ink">Email</span>
              <input
                className="mq-input !rounded-lg"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-mq-ink">Password</span>
              <input
                className="mq-input !rounded-lg"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </label>
            <button type="submit" className="mq-btn-primary mt-2 w-full" disabled={busy}>
              {busy ? 'Sending OTP…' : 'Continue — verify email'}
            </button>
          </form>
        </>
      ) : (
        <>
          {info ? <p className="mb-3 text-center text-sm text-mq-muted">{info}</p> : null}
          {error ? <p className="mb-3 text-center text-sm text-mq-primary">{error}</p> : null}

          <form className="space-y-3" onSubmit={onOtpSubmit}>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-mq-ink">One-time password</span>
              <input
                className="mq-input !rounded-lg tracking-[0.35em] text-center text-lg font-semibold"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
              />
            </label>
            <button type="submit" className="mq-btn-primary mt-2 w-full" disabled={busy || otp.length !== 6}>
              {busy ? 'Verifying…' : 'Verify & create account'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <button
              type="button"
              className="text-mq-muted underline underline-offset-4 hover:text-mq-ink"
              disabled={busy}
              onClick={() => {
                setStep('details')
                setOtp('')
                setError('')
                setInfo('')
              }}
            >
              Edit details
            </button>
            <button
              type="button"
              className="font-semibold text-mq-ink underline underline-offset-4"
              disabled={busy}
              onClick={() => void requestOtp()}
            >
              Resend OTP
            </button>
          </div>
        </>
      )}
    </AuthShell>
  )
}
