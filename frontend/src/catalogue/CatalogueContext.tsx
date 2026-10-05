import React, { createContext, useContext, useMemo } from 'react'
import type { Category, Product } from '@/types'

type CatalogueContextValue = {
  products: Product[]
  categories: Category[]
}

const CatalogueContext = createContext<CatalogueContextValue | null>(null)

export function CatalogueProvider({
  products,
  categories,
  children,
}: {
  products: Product[]
  categories: Category[]
  children: React.ReactNode
}) {
  const value = useMemo(() => ({ products, categories }), [products, categories])
  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>
}

export function useCatalogue() {
  const ctx = useContext(CatalogueContext)
  if (!ctx) throw new Error('useCatalogue must be used within CatalogueProvider')
  return ctx
}
