'use client'
import { useEffect, useState } from 'react'
import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle, Clock, MessageSquare } from 'lucide-react'

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-2">{sub}</p>}
    </div>
  )
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => { setStats(d.data || null); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => <div key={i} className="bg-white h-28 animate-pulse" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Dashboard Overview</h2>
        <p className="text-base text-gray-500">Welcome back, Admin</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Package} label="Total Products" value={stats?.totalProducts || 0} color="bg-primary/10 text-primary" />
        <StatCard icon={MessageSquare} label="Custom Inquiries" value={stats?.totalInquiries || 0} color="bg-orange-50 text-orange-600" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats?.totalOrders || 0} color="bg-blue-50 text-blue-600" />
        <StatCard icon={TrendingUp} label="Revenue" value={formatPrice(stats?.revenue || 0)} color="bg-green-50 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock */}
        <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-medium text-lg text-gray-900">Low / Out of Stock</h3>
            <span className="ml-auto bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-md font-medium">
              {stats?.lowStockProducts?.length || 0} items
            </span>
          </div>
          {stats?.lowStockProducts?.length === 0 ? (
            <p className="text-sm text-gray-500">All products are well stocked ✓</p>
          ) : (
            <div className="space-y-4">
              {stats.lowStockProducts.map(p => (
                <div key={p._id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.category}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                    p.status === 'outOfStock' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-lg text-gray-900">Recent Orders</h3>
          </div>
          <div className="space-y-4">
            {stats?.recentOrders?.map(o => (
              <div key={o._id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{o.customerInfo?.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">{formatPrice(o.total)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium mt-1 inline-block ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
