'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

export default function CartPage() {
  const { cartItems: cart, removeFromCart, updateQuantity, cartTotal } = useCart()
  const subtotal = cartTotal
  const shipping = subtotal >= 50000 ? 0 : 999
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="pt-20 lg:pt-24 flex-1">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14">
          <div className="mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 text-lg mt-3">Review your selected pieces before checkout.</p>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="w-10 h-10 text-primary" />
              </div>
              <p className="font-serif text-3xl font-bold text-gray-900 mb-4">Your cart is empty</p>
              <p className="text-gray-500 mb-10 max-w-sm mx-auto text-lg pt-2">Add some beautiful furniture to get started.</p>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
              >
                Explore Shop <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Cart Items Table Layout */}
              <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10">
                <div className="hidden sm:grid grid-cols-12 gap-4 pb-6 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                
                <div className="space-y-8 sm:space-y-0 divide-y divide-gray-100">
                  {cart.map(item => (
                    <div key={item._id} className="py-8 flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-6">
                      {/* Product */}
                      <div className="col-span-6 flex gap-6">
                        <Link href={`/product/${item._id}`} className="w-28 h-28 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-2xl bg-background border border-gray-100 group">
                          <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80'} alt={item.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80'; }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </Link>
                        <div className="flex flex-col justify-center">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">{item.category}</p>
                          <Link href={`/product/${item._id}`}>
                            <h3 className="font-serif text-lg font-bold text-gray-900 hover:text-primary transition-colors">{item.name}</h3>
                          </Link>
                          <button onClick={() => removeFromCart(item._id)} className="text-[13px] font-semibold text-gray-400 hover:text-red-500 mt-3 text-left w-fit flex items-center gap-1.5 transition-colors">
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                        </div>
                      </div>
                      
                      {/* Mobile Price Overlay */}
                      <div className="sm:hidden flex justify-between items-center border-t border-gray-100 pt-5 mt-2">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Price</span>
                        <span className="font-bold text-gray-900 text-lg">{formatPrice(item.price)}</span>
                      </div>

                      {/* Desktop Price */}
                      <div className="col-span-2 text-center hidden sm:block">
                        <span className="font-bold text-gray-600 text-[15px]">{formatPrice(item.price)}</span>
                      </div>
                      
                      {/* Quantity */}
                      <div className="col-span-2 flex justify-between sm:justify-center items-center">
                        <span className="text-sm font-bold text-gray-500 sm:hidden uppercase tracking-wider">Quantity</span>
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-11 bg-gray-50">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-10 h-full flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors text-gray-600">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 h-full flex items-center justify-center text-sm font-bold border-x border-gray-200 text-gray-900 bg-white">
                            {item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-10 h-full flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors text-gray-600">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="col-span-2 flex justify-between sm:justify-end items-center sm:text-right">
                        <span className="text-sm font-bold text-gray-500 sm:hidden uppercase tracking-wider">Total</span>
                        <span className="font-bold text-primary text-lg">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-100 shrink-0">
                <div className="sticky top-28 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-5">Order Summary</h3>
                  <div className="space-y-5 mb-8">
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="font-medium">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                      <span className="font-bold text-gray-900 text-lg">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="font-medium">Shipping</span>
                      <span className="font-bold text-gray-900">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>
                    {shipping > 0 && (
                      <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                        <p className="text-xs font-bold text-primary flex items-center gap-2">
                           <ShoppingBag className="w-3.5 h-3.5" />
                           Free shipping on orders over ₹50,000
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 pt-6 mb-8">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-gray-900 text-xl">Total</span>
                      <span className="text-3xl font-bold text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full bg-primary text-white py-4 rounded-xl text-base font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
