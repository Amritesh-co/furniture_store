'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CreditCard, Truck, CheckCircle, Lock } from 'lucide-react'
import { useSession } from 'next-auth/react'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
]

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '',
    city: '', state: '', pincode: '',
    paymentMethod: 'COD',
    cardNumber: '', cardExpiry: '', cardCvv: '',
  })
  const [errors, setErrors] = useState({})

  const shipping = cartTotal >= 50000 ? 0 : 999
  const total = cartTotal + shipping

  const validate = () => {
    const e = {}
    if (!form.name) e.name = 'Required'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone || !/^(\+91)?[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Valid Indian number required'
    if (!form.address) e.address = 'Required'
    if (!form.city) e.city = 'Required'
    if (!form.state) e.state = 'Required'
    if (!form.pincode || !/^\d{6}$/.test(form.pincode)) e.pincode = '6-digit pincode required'
    return e
  }

  // Effect to redirect when unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout')
    }
  }, [status, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo: {
            name: form.name, email: form.email, phone: form.phone,
            address: form.address, city: form.city, state: form.state, pincode: form.pincode,
          },
          products: cartItems.map(i => ({
            productId: i._id, name: i.name, price: i.price, quantity: i.quantity, image: i.images?.[0],
          })),
          subtotal: cartTotal,
          shipping,
          total,
          paymentMethod: form.paymentMethod === 'COD' && total > 10000 ? 'COD (20% Advance)' : form.paymentMethod,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        clearCart()
        const trackingId = data.data?.orderId || data.data?._id
        router.push(`/order-success?id=${trackingId}`)
      }
    } catch { setLoading(false) }
  }

  const change = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp = (field, label, props = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        {...props}
        value={form[field]}
        onChange={e => change(field, e.target.value)}
        className={`w-full border px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white transition-colors ${
          errors[field] ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary'
        }`}
      />
      {errors[field] && <p className="text-sm text-red-500 mt-1">{errors[field]}</p>}
    </div>
  )

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-32 bg-gray-50 rounded-xl border border-gray-100 max-w-2xl w-full mx-4">
          <p className="font-serif text-3xl font-semibold text-gray-900 mb-4">Your cart is empty</p>
          <p className="text-gray-500 mb-8">Add some beautiful furniture to get started.</p>
          <Link href="/shop" className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors">
            Explore Shop
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium tracking-wide">Securing Checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 lg:pt-24 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-semibold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your secure purchase</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Info */}
              <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-medium text-gray-900 mb-6 flex items-center gap-3">
                  <Truck className="w-6 h-6 text-primary" /> Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {inp('name', 'Full Name', { placeholder: 'Priya Sharma' })}
                  {inp('email', 'Email', { type: 'email', placeholder: 'priya@example.com' })}
                  {inp('phone', 'Phone (+91)', { placeholder: '+91 98765 43210' })}
                  <div className="sm:col-span-2">
                    {inp('address', 'Street Address', { placeholder: '42, MG Road, Indiranagar' })}
                  </div>
                  {inp('city', 'City', { placeholder: 'Bengaluru' })}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                    <select
                      value={form.state}
                      onChange={e => change('state', e.target.value)}
                      className={`w-full border px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white cursor-pointer ${
                        errors.state ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary'
                      }`}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
                  </div>
                  {inp('pincode', 'Pincode', { placeholder: '560038', maxLength: 6 })}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-medium text-gray-900 mb-6 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" /> Payment Method
                </h2>
                <div className="space-y-4 mb-6">
                  {[
                    { 
                      value: 'COD', 
                      label: 'Cash on Delivery', 
                      desc: total > 10000 ? `Pay 20% advance (${formatPrice(total * 0.20)}) now, rest on delivery` : 'Pay when your order arrives',
                      disabled: false
                    },
                    { value: 'Online', label: 'Online Payment', desc: 'Credit/Debit card, UPI, Net Banking', disabled: false },
                  ].map(opt => (
                    <label 
                      key={opt.value} 
                      className={`flex items-start gap-4 p-5 rounded-lg border-2 transition-colors ${
                        opt.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-100' : 
                        form.paymentMethod === opt.value ? 'border-primary bg-primary/5 cursor-pointer' : 
                        'border-gray-200 hover:border-gray-300 cursor-pointer'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        value={opt.value} 
                        checked={form.paymentMethod === opt.value} 
                        disabled={opt.disabled}
                        onChange={() => !opt.disabled && change('paymentMethod', opt.value)} 
                        className="mt-1 w-4 h-4 text-primary focus:ring-primary" 
                      />
                      <div>
                        <p className={`text-base font-medium ${opt.disabled ? 'text-gray-400' : 'text-gray-900'}`}>{opt.label}</p>
                        <p className="text-sm text-gray-500 mt-1">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {(form.paymentMethod === 'Online' || (form.paymentMethod === 'COD' && total > 10000)) && (
                  <div className="border border-dashed border-amber-300 bg-amber-50 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className="w-5 h-5 text-amber-600" />
                      <p className="text-sm font-medium text-amber-800">
                        {form.paymentMethod === 'COD' 
                          ? `Demo Mode — 20% Advance Payment (${formatPrice(total * 0.20)})`
                          : 'Demo Mode — No actual payment processed'
                        }
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <input placeholder="1234 5678 9012 3456" maxLength={19} className="w-full border border-amber-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white" />
                      </div>
                      <input placeholder="MM / YY" maxLength={5} className="border border-amber-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white" />
                      <input placeholder="CVV" maxLength={3} type="password" className="border border-amber-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm sticky top-28">
                <h2 className="font-serif text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex gap-4">
                      <div className="w-20 h-20 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                        <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-primary mt-1">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 border-t border-gray-100 pt-6 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-8">
                  <span className="font-semibold text-gray-900 text-lg">Total</span>
                  <span className="text-2xl font-semibold text-primary">{formatPrice(total)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-lg text-base font-medium hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : <><CheckCircle className="w-5 h-5" /> Place Order</>}
                </button>
                <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-1.5">
                  <Lock className="w-4 h-4" /> Secure checkout
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}
