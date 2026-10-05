import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HomePage } from '@/pages/HomePage'
import { ProductsPage } from '@/pages/ProductsPage'
import { CartPage } from '@/pages/CartPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { OrderTrackingPage } from '@/pages/OrderTrackingPage'
import { WishlistPage } from '@/pages/WishlistPage'
import { AccountPage } from '@/pages/AccountPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { PolicyPage } from '@/pages/PolicyPage'
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/data/mock'
import { CatalogueProvider } from '@/catalogue/CatalogueContext'
import { fetchCategories, fetchProducts } from '@/lib/api'
import { productSearchText } from '@/lib/product'
import type { Category, Product } from '@/types'

export default function App() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [nextProducts, nextCategories] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ])
        if (cancelled) return
        if (nextProducts.length) setProducts(nextProducts)
        if (nextCategories.length) setCategories(nextCategories)
        setLoadError(null)
      } catch (err) {
        if (cancelled) return
        setLoadError(err instanceof Error ? err.message : 'Failed to load catalogue')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const searchedProducts = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return products
    return products.filter((p) => productSearchText(p).includes(s))
  }, [q, products])

  return (
    <CatalogueProvider products={products} categories={categories}>
      <div className="flex min-h-screen flex-col">
        <Header
          categories={categories}
          onSearchChange={(next) => {
            const n = next.trim()
            if (!n) {
              params.delete('q')
              setParams(params, { replace: true })
              return
            }
            params.set('q', n)
            setParams(params, { replace: true })
          }}
        />

        {loadError ? (
          <p className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-800">
            Unable to load the latest catalogue. Please refresh in a moment. ({loadError})
          </p>
        ) : null}

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage products={searchedProducts} />} />
            <Route path="/products" element={<ProductsPage products={searchedProducts} />} />
            <Route path="/products/:id" element={<ProductDetailPage products={products} />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/track" element={<OrderTrackingPage />} />
            <Route path="/policies/:slug" element={<PolicyPage />} />
            <Route path="/privacy" element={<Navigate to="/policies/privacy" replace />} />
            <Route path="/terms" element={<Navigate to="/policies/terms" replace />} />
            <Route path="/shipping" element={<Navigate to="/policies/shipping" replace />} />
            <Route path="/returns" element={<Navigate to="/policies/returns" replace />} />
            <Route path="/refund" element={<Navigate to="/policies/returns" replace />} />
            <Route path="/disclaimer" element={<Navigate to="/policies/disclaimer" replace />} />
            <Route path="/grievance" element={<Navigate to="/policies/grievance" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </CatalogueProvider>
  )
}
