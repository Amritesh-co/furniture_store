'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Heart, Star } from 'lucide-react'
import { useState } from 'react'

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [wished, setWished] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const isOut = product.status === 'outOfStock' || product.stock === 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (isOut) return
    addToCart(product, 1)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative aspect-4/5 overflow-hidden bg-gray-50">
        <Link href={`/product/${product._id}`}>
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'}
            alt={product.name}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'; }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Wishlist button */}
        <button
          onClick={() => setWished(!wished)}
          className="absolute top-4 right-4 p-2 bg-white/85 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all"
        >
          <Heart className={`w-4 h-4 transition-colors ${wished ? 'fill-primary text-primary' : 'text-gray-500'}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isOut && (
            <span className="bg-gray-800/80 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              Sold Out
            </span>
          )}
          {product.isFeatured && !isOut && (
            <span className="bg-primary text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              Featured
            </span>
          )}
          {product.status === 'lowStock' && !isOut && (
            <span className="bg-amber-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              Low Stock
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        {/* Rating placeholder */}
        <div className="flex items-center gap-1 mb-2">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
          ))}
          <span className="text-xs text-gray-500 ml-1 font-medium">4.0</span>
        </div>

        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
        <Link href={`/product/${product._id}`}>
          <h3 className="font-serif text-base font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-auto">
          <p className="text-primary font-bold text-lg">{formatPrice(product.price)}</p>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOut}
          className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            isOut
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : justAdded
              ? 'bg-green-600 text-white'
              : 'bg-primary/10 hover:bg-primary text-primary hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {isOut ? 'Unavailable' : justAdded ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
