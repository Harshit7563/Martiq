export type PincodePlace = {
  pincode: string
  city: string
  state: string
  district: string
  area: string
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export async function fetchPincode(pin: string): Promise<PincodePlace> {
  const clean = pin.replace(/\D/g, '').slice(0, 6)
  if (!/^[1-9][0-9]{5}$/.test(clean)) {
    throw new Error('Enter a valid 6-digit pincode.')
  }

  const res = await fetch(`${API_BASE}/api/pincode/${clean}`)
  const data = (await res.json().catch(() => ({}))) as {
    error?: string
    pincode?: string
    city?: string
    state?: string
    district?: string
    area?: string
  }
  if (!res.ok) throw new Error(data.error || 'Could not fetch pincode details.')
  return {
    pincode: data.pincode || clean,
    city: data.city || '',
    state: data.state || '',
    district: data.district || '',
    area: data.area || '',
  }
}
