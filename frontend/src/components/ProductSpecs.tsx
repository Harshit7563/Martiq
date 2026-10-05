import type { Product } from '@/types'
import { categoryLabel } from '@/lib/product'

export function ProductSpecs({ product }: { product: Product }) {
  const rows = [
    { label: 'Reference', value: product.sku },
    { label: 'Department', value: categoryLabel(product.category) },
    { label: 'Colour', value: product.color },
    { label: 'Composition', value: product.material },
    { label: 'Fit', value: product.fit },
    { label: 'Care instructions', value: product.care },
  ]

  return (
    <dl className="divide-y divide-stone-200 border border-stone-200 bg-white text-sm">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[9rem_1fr] gap-4 px-4 py-3 sm:grid-cols-[10rem_1fr]">
          <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-stone-500">{row.label}</dt>
          <dd className="text-stone-800">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
