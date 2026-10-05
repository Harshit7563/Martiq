import { hashString, mulberry32 } from '@/lib/hash'

export type SizeChartRow = {
  size: string
  waist: string
  hip: string
  inseam: string
}

/** Deterministic, slightly varied jeans size chart per product. */
export function sizeChartForProduct(productId: string, sizes: string[]): SizeChartRow[] {
  const rand = mulberry32(hashString(`sizechart:${productId}`))
  const list = sizes.length
    ? sizes
    : ['28', '30', '32', '34', '36', '38', '40']

  return list.map((size, idx) => {
    const n = Number(size)
    const isAlpha = !Number.isFinite(n)
    if (isAlpha) {
      // Letter sizes (S/M/L…) for kids or alternate sizing
      const base = 26 + idx * 2 + Math.floor(rand() * 2)
      return {
        size,
        waist: `${base}"–${base + 1}"`,
        hip: `${base + 8}"–${base + 10}"`,
        inseam: `${29 + (idx % 3)}"`,
      }
    }
    const waistJitter = Math.floor(rand() * 3) - 1 // -1..1
    const hipJitter = Math.floor(rand() * 3)
    const inseam = 30 + Math.floor(rand() * 3) // 30–32
    return {
      size,
      waist: `${n + waistJitter}"`,
      hip: `${n + 8 + hipJitter}"`,
      inseam: `${inseam}"`,
    }
  })
}
