'use client'
import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const statusColors = {
  pending: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
  processing: 'bg-blue-50 text-blue-700 border border-blue-100',
  shipped: 'bg-purple-50 text-purple-700 border border-purple-100',
  delivered: 'bg-green-50 text-green-700 border border-green-100',
  cancelled: 'bg-red-50 text-red-700 border border-red-100',
}

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)

  const fetchOrders = () => {
    fetch('/api/orders').then(r => r.json()).then(d => {
      setOrders(Array.isArray(d.data) ? d.data : [])
      setLoading(false)
    })
  }
  useEffect(fetchOrders, [])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setUpdating(null)
    fetchOrders()
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Orders</h2>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Order Details', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? Array(5).fill(0).map((_, i) => (
              <tr key={`loading-${i}`}><td colSpan={8} className="px-6 py-4"><div className="h-10 bg-gray-50 rounded-lg animate-pulse" /></td></tr>
            )) : orders.map(o => (
              <React.Fragment key={o._id}>
                <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">{o.orderId || o._id?.slice(-8).toUpperCase()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{o.customerInfo?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{o.customerInfo?.city}, {o.customerInfo?.state}</p>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">{o.products?.length}</td>
                  <td className="px-6 py-4 font-semibold text-primary">{formatPrice(o.total)}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500">{o.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <select
                      value={o.status}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      disabled={updating === o._id}
                      className={`text-xs font-medium px-2.5 py-1.5 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${statusColors[o.status]}`}
                    >
                      {STATUSES.map(s => <option key={s} value={s} className="bg-white text-gray-900">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(o.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <button
                      onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                      className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                      title="Quick Expand"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${expanded === o._id ? 'rotate-180' : ''}`} />
                    </button>
                    <a href={`/admin/orders/${o._id}`} className="text-xs font-semibold text-primary hover:underline whitespace-nowrap">View Details →</a>
                  </td>
                </tr>
                {expanded === o._id && (
                  <tr key={`${o._id}-detail`}>
                    <td colSpan={8} className="px-8 py-6 bg-gray-50 border-b border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="bg-white p-5 rounded-lg border border-gray-100">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Customer Info</p>
                          <div className="space-y-1.5 text-sm text-gray-700">
                            <p>{o.customerInfo?.email}</p>
                            <p>{o.customerInfo?.phone}</p>
                            <p className="pt-2 border-t border-gray-50">{o.customerInfo?.address}, {o.customerInfo?.city}</p>
                            <p>{o.customerInfo?.state} — {o.customerInfo?.pincode}</p>
                          </div>
                        </div>
                        <div className="bg-white p-5 rounded-lg border border-gray-100">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Products</p>
                          <div className="space-y-2">
                            {o.products?.map((p, i) => (
                              <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0 last:pb-0">
                                <span className="text-gray-700 font-medium">{p.name} <span className="text-gray-400 font-normal">×{p.quantity}</span></span>
                                <span className="font-semibold text-gray-900">{formatPrice(p.price * p.quantity)}</span>
                              </div>
                            ))}
                            <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-3 mt-3">
                              <span className="text-gray-900 text-base">Total</span>
                              <span className="text-primary text-base">{formatPrice(o.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
