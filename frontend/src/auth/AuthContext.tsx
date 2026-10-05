import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const SESSION_KEY = 'martiq-auth'
const USERS_KEY = 'martiq-users'

export type AuthUser = {
  name: string
  email: string
  picture?: string
  provider?: 'email' | 'google'
}

type StoredUser = {
  name: string
  email: string
  password: string
}

type AuthResult = { ok: true } | { ok: false; error: string }

type AuthContextValue = {
  user: AuthUser | null
  isSignedIn: boolean
  signIn: (user: AuthUser) => void
  loginWithEmail: (email: string, password: string) => AuthResult
  signup: (name: string, email: string, password: string) => AuthResult
  emailTaken: (email: string) => boolean
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (parsed && typeof parsed.name === 'string' && typeof parsed.email === 'string') {
      return {
        name: parsed.name,
        email: parsed.email,
        picture: typeof parsed.picture === 'string' ? parsed.picture : undefined,
        provider: parsed.provider === 'google' ? 'google' : 'email',
      }
    }
    return null
  } catch {
    return null
  }
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    typeof window === 'undefined' ? null : readSession(),
  )

  useEffect(() => {
    localStorage.setItem(SESSION_KEY, user ? JSON.stringify(user) : '')
  }, [user])

  const signIn = useCallback((next: AuthUser) => setUser(next), [])

  const loginWithEmail = useCallback((email: string, password: string): AuthResult => {
    const e = email.trim().toLowerCase()
    if (!e.includes('@')) return { ok: false, error: 'Enter a valid email address.' }
    if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' }

    const users = readUsers()
    const found = users.find((u) => u.email.toLowerCase() === e)
    if (!found || found.password !== password) {
      return { ok: false, error: 'Incorrect email or password.' }
    }

    setUser({ name: found.name, email: found.email, provider: 'email' })
    return { ok: true }
  }, [])

  const emailTaken = useCallback((email: string) => {
    const e = email.trim().toLowerCase()
    return readUsers().some((u) => u.email.toLowerCase() === e)
  }, [])

  const signup = useCallback((name: string, email: string, password: string): AuthResult => {
    const n = name.trim()
    const e = email.trim().toLowerCase()
    if (!n) return { ok: false, error: 'Please enter your name.' }
    if (!e.includes('@')) return { ok: false, error: 'Enter a valid email address.' }
    if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' }

    const users = readUsers()
    if (users.some((u) => u.email.toLowerCase() === e)) {
      return { ok: false, error: 'An account with this email already exists. Sign in instead.' }
    }

    writeUsers([...users, { name: n, email: e, password }])
    setUser({ name: n, email: e, provider: 'email' })
    return { ok: true }
  }, [])

  const signOut = useCallback(() => setUser(null), [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isSignedIn: Boolean(user),
      signIn,
      loginWithEmail,
      signup,
      emailTaken,
      signOut,
    }),
    [user, signIn, loginWithEmail, signup, emailTaken, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
