import React, { createContext, useContext, useMemo, useReducer } from 'react'
import type { CartItem, Product } from '@/types'

type CartState = {
  items: Record<string, CartItem>
}

type CartAction =
  | { type: 'add'; product: Product; qty?: number }
  | { type: 'remove'; productId: string }
  | { type: 'setQty'; productId: string; qty: number }
  | { type: 'clear' }

const CartContext = createContext<{
  items: CartItem[]
  totalQty: number
  subtotal: number
  add: (product: Product, qty?: number) => void
  remove: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
} | null>(null)

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const qty = Math.max(1, action.qty ?? 1)
      const existing = state.items[action.product.id]
      return {
        items: {
          ...state.items,
          [action.product.id]: {
            product: action.product,
            qty: (existing?.qty ?? 0) + qty,
          },
        },
      }
    }
    case 'remove': {
      const next = { ...state.items }
      delete next[action.productId]
      return { items: next }
    }
    case 'setQty': {
      const qty = Math.max(1, Math.floor(action.qty))
      const existing = state.items[action.productId]
      if (!existing) return state
      return { items: { ...state.items, [action.productId]: { ...existing, qty } } }
    }
    case 'clear':
      return { items: {} }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: {} })

  const value = useMemo(() => {
    const items = Object.values(state.items)
    const totalQty = items.reduce((acc, it) => acc + it.qty, 0)
    const subtotal = items.reduce((acc, it) => acc + it.qty * it.product.price, 0)
    return {
      items,
      totalQty,
      subtotal,
      add: (product: Product, qty?: number) => dispatch({ type: 'add', product, qty }),
      remove: (productId: string) => dispatch({ type: 'remove', productId }),
      setQty: (productId: string, qty: number) => dispatch({ type: 'setQty', productId, qty }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [state.items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

