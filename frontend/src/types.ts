export type Category = {
  id: string
  name: string
}

export type ProductBadge = 'new' | 'bestseller' | 'limited'

export type ProductCategory =
  | 'tees'
  | 'shirts'
  | 'bottoms'
  | 'jeans'
  | 'knitwear'
  | 'active'
  | 'accessories'
  | 'dresses'
  | 'coords'

export type Product = {
  id: string
  name: string
  color: string
  category: ProductCategory
  sku: string
  image: string
  gallery?: string[]
  price: number
  mrp?: number
  badge?: ProductBadge
  description: string
  material: string
  fit: string
  care: string
  colorCount?: number
  gender?: 'Men' | 'Women' | 'Unisex' | string
  sizes?: string[]
  rating?: number
  ratingCount?: number
}

export type CartItem = {
  product: Product
  qty: number
}
