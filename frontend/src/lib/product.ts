import type { Product, ProductBadge } from '@/types'

export function badgeLabel(badge?: ProductBadge): string | null {
  if (!badge) return null
  const labels: Record<ProductBadge, string> = {
    new: 'New arrival',
    bestseller: 'Bestseller',
    limited: 'Limited edition',
  }
  return labels[badge]
}

export function productSearchText(p: Product): string {
  return [p.name, p.color, p.sku, p.category, p.material].join(' ').toLowerCase()
}

export function categoryLabel(category: Product['category']): string {
  const labels: Record<Product['category'], string> = {
    tees: 'T-Shirts',
    shirts: 'Shirts',
    bottoms: 'Trousers',
    jeans: 'Denim',
    knitwear: 'Knitwear',
    active: 'Activewear',
    accessories: 'Accessories',
    dresses: 'Dresses',
    coords: 'Co-ords',
  }
  return labels[category] || category
}
