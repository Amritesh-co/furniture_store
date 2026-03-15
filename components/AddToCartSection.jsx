'use client'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Minus, Plus, Check } from 'lucide-react'

export default function AddToCartSection({ product }) {
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const isOut = product.status === 'outOfStock' || product.stock === 0

  const handleAdd = () => {
    if (isOut) return
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Qty selector */}
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full sm:w-auto h-12">
        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600">
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-12 text-center font-medium border-x border-gray-300 h-full flex items-center justify-center text-gray-900">
          {qty}
        </span>
        <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={isOut} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 text-gray-600">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        disabled={isOut}
        className={`flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-base font-medium transition-all ${
          isOut ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : added ? 'bg-green-600 text-white'
          : 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg'
        }`}
      >
        {added ? <><Check className="w-4 h-4" /> Added to Cart</> : <><ShoppingBag className="w-4 h-4" /> {isOut ? 'Out of Stock' : 'Add to Cart'}</>}
      </button>
    </div>
  )
}
