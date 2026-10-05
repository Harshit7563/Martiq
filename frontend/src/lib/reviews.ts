import { hashString, mulberry32 } from '@/lib/hash'

export type ProductReview = {
  id: string
  name: string
  rating: number
  title: string
  body: string
  date: string
  verified: boolean
}

const FIRST = [
  'Aarav', 'Diya', 'Rohan', 'Ananya', 'Kabir', 'Isha', 'Vivaan', 'Meera', 'Arjun', 'Saanvi',
  'Reyansh', 'Kiara', 'Advait', 'Myra', 'Shaurya', 'Aanya', 'Atharv', 'Pari', 'Yash', 'Nisha',
]
const LAST = ['Sharma', 'Patel', 'Singh', 'Reddy', 'Iyer', 'Khan', 'Das', 'Nair', 'Joshi', 'Gupta']
const TITLES = [
  'Great fit',
  'Worth the price',
  'Soft and sturdy',
  'True to size',
  'Daily wear favourite',
  'Looks premium',
  'Comfortable all day',
  'Colour as shown',
  'Good stretch',
  'Happy with quality',
]
const BODIES = [
  'Fabric feels solid and the stitching is neat. Wore it all day without discomfort.',
  'Length and rise are balanced. Ordered my usual size and it worked perfectly.',
  'Wash held up after a few washes. Colour stayed rich, no weird fading.',
  'Stretch is just right — not too tight, not baggy. Pairing with sneakers looks clean.',
  'Delivery was quick and packing was good. Product matched the photos closely.',
  'Comfortable for office and weekends. Value for money compared to other brands.',
  'Waist sits well and thighs have enough room. Would buy another wash.',
  'Soft hand-feel from day one. No itching or stiffness after unboxing.',
  'Hem and pockets are well finished. Looks more expensive than it costs.',
  'Kids/adult sizing was accurate for us. Happy with the overall build.',
]

export function reviewsForProduct(productId: string, countHint = 0): ProductReview[] {
  const rand = mulberry32(hashString(`reviews:${productId}`))
  const count = 3 + Math.floor(rand() * 4) // 3–6 reviews
  const reviews: ProductReview[] = []
  for (let i = 0; i < count; i++) {
    const name = `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)][0]}.`
    const rating = rand() > 0.18 ? 5 : rand() > 0.45 ? 4 : 3
    const day = 1 + Math.floor(rand() * 27)
    const month = 1 + Math.floor(rand() * 12)
    const year = 2025 + Math.floor(rand() * 2)
    reviews.push({
      id: `${productId}-r${i}`,
      name,
      rating,
      title: TITLES[Math.floor(rand() * TITLES.length)],
      body: BODIES[Math.floor(rand() * BODIES.length)],
      date: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
      verified: rand() > 0.25,
    })
  }
  // Slightly bias average near catalogue rating hint
  if (countHint > 0 && reviews.length) {
    reviews[0].rating = Math.min(5, Math.max(3, Math.round(countHint)))
  }
  return reviews
}

export function averageRating(reviews: ProductReview[]): number {
  if (!reviews.length) return 0
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}
