import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { AuthShell } from '@/components/AuthShell'
import { getGoogleClientId } from '@/auth/google'

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const returnUrl = params.get('returnUrl') || '/account'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const hasGoogleClient = Boolean(getGoogleClientId())

  useEffect(() => {
    document.title = 'Sign in | Martiq'
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

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const result = auth.loginWithEmail(email, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(returnUrl, { replace: true })
  }

  return (
    <AuthShell
      tag="Sign in"
      title="Welcome back"
      lead="Continue with Google, or use email & password."
      switchText="New to Martiq?"
      switchTo={`/signup?returnUrl=${encodeURIComponent(returnUrl)}`}
      switchLabel="Create account"
    >
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

      <form className="space-y-3" onSubmit={onSubmit}>
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        <button type="submit" className="mq-btn-primary mt-2 w-full">
          Sign in
        </button>
      </form>
    </AuthShell>
  )
}
