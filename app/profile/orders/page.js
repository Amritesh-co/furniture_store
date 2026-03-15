'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Download, ArrowRight, FileText } from 'lucide-react'

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

export default function MyOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetch('/api/orders/me')
        .then(r => r.json())
        .then(payload => {
          const ordersData = payload.data
          setOrders(Array.isArray(ordersData) ? ordersData : [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [status, router])

  const handleDownloadInvoice = async (orderId) => {
    setDownloadingId(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}/invoice`)
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice_${orderId}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
      } else {
        alert('Invoice generation is pending. Please wait until your order is confirmed.')
      }
    } catch (err) {
      alert('Error fetching invoice.')
    }
    setDownloadingId(null)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-primary mb-2">My Orders</h1>
        <p className="text-muted text-sm">View your past purchases and download invoices.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-neutral p-12 text-center rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-primary/50 shadow-sm">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-medium text-primary mb-2">No orders found</h2>
          <p className="text-muted text-sm mb-6 max-w-md mx-auto">Looks like you haven't placed any orders yet. Start exploring our premium furniture collection.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 text-sm font-medium uppercase tracking-wider hover:bg-primary-dark transition-colors rounded-sm">
            Browse Shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isConfirmed = ['processing', 'shipped', 'delivered'].includes(order.status)
            
            return (
              <div key={order._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between pointer-events-none">
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-1">Order Placed</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-1">Total</p>
                      <p className="text-sm font-medium text-primary">{formatPrice(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-1">Status</p>
                      <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold capitalize ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' || order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="pointer-events-auto text-right">
                    <p className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-1">Order ID</p>
                    <p className="font-mono text-sm text-gray-900">#{order.orderId || order._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.products.map((p, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 shrink-0 rounded-lg overflow-hidden border border-gray-200">
                           {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{p.name}</p>
                          <p className="text-sm text-gray-500 mt-0.5">Qty: {p.quantity}</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{formatPrice(p.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex border-t border-gray-100 pt-4 justify-end">
                    <button
                      onClick={() => handleDownloadInvoice(order._id)}
                      disabled={downloadingId === order._id || !isConfirmed}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
                        isConfirmed 
                        ? 'border-primary text-primary hover:bg-primary hover:text-white bg-white'
                        : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                      }`}
                      title={!isConfirmed ? "Invoice will be available once the order is confirmed" : "Download PDF Invoice"}
                    >
                      {downloadingId === order._id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      {downloadingId === order._id ? 'Downloading...' : 'Download Invoice'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
