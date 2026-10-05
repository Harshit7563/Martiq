import type { Category, Product } from '@/types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return (await res.json()) as T
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => ({}))) as T & { error?: string; devOtp?: string }
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed: ${res.status}`) as Error & {
      devOtp?: string
    }
    if (typeof data?.devOtp === 'string') err.devOtp = data.devOtp
    throw err
  }
  return data
}

export async function fetchCategories(): Promise<Category[]> {
  const data = await getJson<{ categories: Category[] }>('/api/categories')
  return data.categories
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await getJson<{ products: Product[] }>('/api/products')
  return data.products
}

export async function sendSignupOtp(name: string, email: string) {
  return postJson<{ ok: true; email: string; message: string; expiresInMinutes: number }>(
    '/api/auth/signup/send-otp',
    { name, email },
  )
}

export async function verifySignupOtp(email: string, otp: string) {
  return postJson<{ ok: true; email: string; name: string; emailVerified: true }>(
    '/api/auth/signup/verify-otp',
    { email, otp },
  )
}
