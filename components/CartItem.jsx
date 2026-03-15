'use client'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 group animate-fade-in">
      {/* Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-neutral overflow-hidden">
        <img
          src={item.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div>
            <p className="text-xs text-muted uppercase tracking-widest mb-0.5">{item.category}</p>
            <h4 className="font-serif text-base sm:text-lg text-primary leading-tight">{item.name}</h4>
          </div>
          <p className="text-accent font-semibold whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
        </div>

        <p className="text-sm text-muted mt-1">{formatPrice(item.price)} each</p>

        {/* Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200">
            <button
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center hover:bg-neutral disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-medium border-x border-gray-200 h-8 flex items-center justify-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-neutral transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => removeFromCart(item._id)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
