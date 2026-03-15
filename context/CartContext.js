'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('woodcraft-cart')
    if (stored) {
      try { setCartItems(JSON.parse(stored)) } catch (e) { setCartItems([]) }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('woodcraft-cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isLoaded])

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item._id === product._id)
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }, [])

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(item => item._id !== id))
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return
    setCartItems(prev =>
      prev.map(item => item._id === id ? { ...item, quantity } : item)
    )
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity,
      clearCart, cartCount, cartTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
