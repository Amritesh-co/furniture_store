'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, ShoppingBag, ArrowRight, Package, Truck, User, CreditCard } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useBusinessSettings } from '@/lib/useBusinessSettings'

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

export default function OrderSuccessPage() {
  const { businessInfo, businessMailto, businessWhatsappUrl } = useBusinessSettings()
  const params = useSearchParams()
  const orderId = params.get('id')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(payload => {
          setOrder(payload.data || null)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching order:', err)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading Order Details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8 max-w-md">We couldn't retrieve the details for this order. Please check your account or contact support.</p>
          <Link href="/shop" className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="pt-24 lg:pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-8 lg:p-12 text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-serif text-4xl font-semibold mb-3">Thank You for Your Purchase!</h1>
            <p className="text-white/80 text-lg">Your order has been successfully placed and is being processed.</p>
          </div>

          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 border-b border-gray-100 pb-12">
              {/* Order Info */}
              <div>
                <h2 className="flex items-center gap-2 font-serif text-xl font-semibold mb-6 text-gray-900">
                  <Package className="w-5 h-5 text-primary" /> Order Information
                </h2>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-mono font-medium text-gray-900">{order.orderId || order._id}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="font-medium text-gray-900">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium uppercase tracking-wider">{order.status}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div>
                <h2 className="flex items-center gap-2 font-serif text-xl font-semibold mb-6 text-gray-900">
                  <Truck className="w-5 h-5 text-primary" /> Shipping Details
                </h2>
                <div className="text-sm space-y-1 text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" /> {order.customerInfo.name}
                  </p>
                  <p>{order.customerInfo.email}</p>
                  <p className="pt-2">{order.customerInfo.address}</p>
                  <p>{order.customerInfo.city}, {order.customerInfo.state} - {order.customerInfo.pincode}</p>
                  <p className="pt-1">Phone: {order.customerInfo.phone}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-12">
              <h2 className="font-serif text-xl font-semibold mb-6 text-gray-900">Purchase Summary</h2>
              <div className="space-y-4 bg-white border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-[10px] tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4 text-left">Product</th>
                      <th className="px-6 py-4 text-center">Quantity</th>
                      <th className="px-6 py-4 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.products.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-gray-100">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-medium text-gray-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">{item.quantity}</td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50/50">
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-right text-gray-500">Subtotal</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{formatPrice(order.subtotal)}</td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-right text-gray-500">Shipping</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td colSpan="2" className="px-6 py-6 text-right font-serif text-xl font-semibold text-gray-900">Total Amount</td>
                      <td className="px-6 py-6 text-right font-serif text-2xl font-semibold text-primary">{formatPrice(order.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/shop" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-10 py-4 rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 text-lg">
                Continue Shopping <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/" className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 rounded-xl font-medium border border-gray-200 hover:border-primary hover:text-primary transition-colors text-lg text-gray-600">
                Back to Home
              </Link>
            </div>
          </div>
          
          {/* Support Section */}
          <div className="bg-gray-50 border-t border-gray-100 p-8 text-center">
            <h3 className="font-serif text-lg font-medium text-gray-900 mb-2">Need Help with Your Order?</h3>
            <p className="text-sm text-gray-600 mb-4">Reach out to us via email or WhatsApp and we'll be happy to assist you.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm">
                <a href={businessMailto} className="font-medium text-primary hover:text-primary-dark transition-colors">
                  {businessInfo.email}
              </a>
                <a href={businessWhatsappUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:text-primary-dark transition-colors">
                  WhatsApp us at {businessInfo.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
