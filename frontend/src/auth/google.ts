export type GoogleProfile = {
  name: string
  email: string
  picture?: string
  sub?: string
}

type CredentialResponse = {
  credential?: string
  select_by?: string
}

type GoogleAccountsId = {
  initialize: (config: {
    client_id: string
    callback: (response: CredentialResponse) => void
    auto_select?: boolean
    cancel_on_tap_outside?: boolean
    use_fedcm_for_prompt?: boolean
  }) => void
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: 'outline' | 'filled_blue' | 'filled_black'
      size?: 'large' | 'medium' | 'small'
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
      shape?: 'rectangular' | 'pill' | 'circle' | 'square'
      width?: number
      logo_alignment?: 'left' | 'center'
    },
  ) => void
  prompt: (notification?: (n: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void
  disableAutoSelect: () => void
  revoke: (hint: string, done: (done: { successful: boolean }) => void) => void
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } }
  }
}

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client'
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

let scriptPromise: Promise<void> | null = null

export function getGoogleClientId() {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() || ''
}

export function loadGoogleScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'))
  if (window.google?.accounts?.id) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Google script')))
      if (window.google?.accounts?.id) resolve()
      return
    }

    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google script'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

/** Verify Google ID token on the Martiq backend (real OAuth). */
export async function verifyGoogleCredential(credential: string): Promise<GoogleProfile> {
  const res = await fetch(`${API_BASE}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  })

  const data = (await res.json().catch(() => ({}))) as {
    error?: string
    user?: {
      id?: string
      name?: string
      email?: string
      picture?: string | null
    }
  }

  if (!res.ok || !data.user?.email) {
    throw new Error(data.error || `Google sign-in failed (${res.status})`)
  }

  return {
    name: data.user.name || data.user.email.split('@')[0],
    email: data.user.email,
    picture: data.user.picture || undefined,
    sub: data.user.id,
  }
}
