import { useEffect, useRef, useState } from 'react'
import {
  getGoogleClientId,
  loadGoogleScript,
  verifyGoogleCredential,
  type GoogleProfile,
} from '@/auth/google'

export function GoogleSignInButton({
  onSuccess,
  onError,
}: {
  onSuccess: (profile: GoogleProfile) => void
  onError?: (message: string) => void
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const clientId = getGoogleClientId()

  onSuccessRef.current = onSuccess
  onErrorRef.current = onError

  useEffect(() => {
    let cancelled = false

    async function setup() {
      if (!clientId) {
        setLoading(false)
        return
      }

      try {
        await loadGoogleScript()
        if (cancelled || !hostRef.current || !window.google?.accounts?.id) return

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              if (!response.credential) throw new Error('No credential returned from Google')
              setBusy(true)
              const profile = await verifyGoogleCredential(response.credential)
              onSuccessRef.current(profile)
            } catch (err) {
              onErrorRef.current?.(err instanceof Error ? err.message : 'Google sign-in failed')
            } finally {
              setBusy(false)
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          // FedCM is flaky on some browsers/hosts; classic GIS prompt is more reliable.
          use_fedcm_for_prompt: false,
        })

        hostRef.current.innerHTML = ''
        const width = Math.min(360, hostRef.current.parentElement?.clientWidth || 360)
        window.google.accounts.id.renderButton(hostRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width,
          logo_alignment: 'left',
        })
        setReady(true)
      } catch (err) {
        onErrorRef.current?.(err instanceof Error ? err.message : 'Could not load Google sign-in')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void setup()
    return () => {
      cancelled = true
    }
  }, [clientId])

  if (!clientId) {
    return (
      <div className="rounded-xl border border-dashed border-[#d4002a59] bg-[#fff5f6] px-4 py-4 text-sm text-mq-ink">
        <p className="font-semibold">Google Client ID missing</p>
        <p className="mt-1 text-mq-muted">
          Add <code className="text-mq-ink">VITE_GOOGLE_CLIENT_ID</code> in{' '}
          <code className="text-mq-ink">frontend/.env</code> and the same value as{' '}
          <code className="text-mq-ink">GOOGLE_CLIENT_ID</code> in{' '}
          <code className="text-mq-ink">backend/.env</code>, then restart both servers.
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {loading ? (
        <div className="flex h-11 w-full items-center justify-center rounded-full border border-mq-border bg-white text-sm text-mq-muted">
          Loading Google…
        </div>
      ) : null}
      <div
        ref={hostRef}
        className={['flex w-full justify-center', ready ? '' : 'hidden', busy ? 'pointer-events-none opacity-60' : ''].join(
          ' ',
        )}
      />
      {busy ? (
        <p className="mt-2 text-center text-xs font-medium text-mq-muted">Verifying with Google…</p>
      ) : null}
    </div>
  )
}
