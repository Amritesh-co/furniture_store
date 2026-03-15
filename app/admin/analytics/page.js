'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, Package, ShoppingCart, IndianRupee } from 'lucide-react'

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/products?limit=100').then(r => r.json()),
    ]).then(([s, o, p]) => {
      setStats(s.data || null)
      setOrders(Array.isArray(o.data) ? o.data : [])
      setProducts(p.data?.products || [])
      setLoading(false)
    })
  }, [])

  // Build last 7 days chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    const dayOrders = orders.filter(o => {
      const od = new Date(o.createdAt)
      return od.getDate() === d.getDate() && od.getMonth() === d.getMonth()
    })
    return {
      date: dateStr,
      orders: dayOrders.length,
      revenue: dayOrders.reduce((s, o) => s + (o.total || 0), 0),
    }
  })

  // Top selling products
  const topProducts = [...products].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 5)

  if (loading) return <div className="grid grid-cols-1 gap-4">{Array(4).fill(0).map((_, i) => <div key={i} className="h-32 bg-neutral animate-pulse" />)}</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Analytics</h2>
        <p className="text-sm text-gray-500">Sales and revenue overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: ShoppingCart, label: 'Total Orders', value: stats?.totalOrders || 0, color: 'bg-blue-50 text-blue-600' },
          { icon: IndianRupee, label: 'Total Revenue', value: formatPrice(stats?.revenue || 0), color: 'bg-green-50 text-green-600' },
          { icon: Package, label: 'Products', value: stats?.totalProducts || 0, color: 'bg-primary/10 text-primary' },
          { icon: TrendingUp, label: 'Avg. Order', value: orders.length ? formatPrice(stats?.revenue / orders.length) : '—', color: 'bg-purple-50 text-purple-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders per day */}
        <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg text-gray-900 mb-6 border-b border-gray-50 pb-4">Orders — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="orders" fill="#7A1E2C" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue per day */}
        <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg text-gray-900 mb-6 border-b border-gray-50 pb-4">Revenue (₹) — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
              <Tooltip formatter={(v) => formatPrice(v)} cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="revenue" fill="#1F1F1F" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
        <h3 className="font-semibold text-lg text-gray-900 mb-6 border-b border-gray-50 pb-4">Top Selling Products</h3>
        <div className="space-y-4">
          {topProducts.map((p, idx) => (
            <div key={p._id} className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-400 w-5 text-center">{idx + 1}</span>
              <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-primary">{formatPrice(p.price)}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.sales || 0} sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
