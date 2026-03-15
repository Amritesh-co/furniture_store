'use client'
import { useState, useEffect } from 'react'
import { Minus, Plus, RotateCcw } from 'lucide-react'

const stockBadge = (status) => ({
  inStock: 'bg-green-50 text-green-700 border border-green-100',
  lowStock: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
  outOfStock: 'bg-red-50 text-red-700 border border-red-100',
}[status] || 'bg-gray-50 text-gray-600 border border-gray-100')

export default function AdminInventoryPage() {
  const [products, setProducts] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [adjusting, setAdjusting] = useState(null)
  const [qty, setQty] = useState({})

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      fetch('/api/inventory').then(r => r.json()),
      fetch('/api/inventory/logs').then(r => r.json()),
    ]).then(([prods, logData]) => {
      setProducts(Array.isArray(prods.data) ? prods.data : [])
      setLogs(Array.isArray(logData.data) ? logData.data : [])
      setLoading(false)
    })
  }
  useEffect(fetchData, [])

  const adjust = async (productId, changeType) => {
    const q = parseInt(qty[productId] || 1)
    if (!q || q < 1) return
    setAdjusting(productId)
    await fetch('/api/inventory/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, changeType, quantity: q, reason: 'admin_edit' }),
    })
    setAdjusting(null)
    setQty(prev => ({ ...prev, [productId]: '' }))
    fetchData()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Inventory Management</h2>
        <p className="text-sm text-gray-500">Track and update product stock levels</p>
      </div>

      {/* Inventory Table */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Image', 'Product', 'Category', 'Stock', 'Status', 'Adjust Quantity'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? Array(6).fill(0).map((_, i) => (
              <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-10 bg-gray-50 rounded-lg animate-pulse" /></td></tr>
            )) : products.map(p => (
              <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                    <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 max-w-xs">
                  <p className="truncate">{p.name}</p>
                </td>
                <td className="px-6 py-4 text-gray-500">{p.category}</td>
                <td className="px-6 py-4 font-bold text-lg text-gray-900">{p.stock}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${stockBadge(p.status)}`}>
                    {p.status === 'inStock' ? 'In Stock' : p.status === 'lowStock' ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min="1"
                      value={qty[p._id] || ''}
                      onChange={e => setQty(prev => ({ ...prev, [p._id]: e.target.value }))}
                      placeholder="Qty"
                      className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    />
                    <button
                      onClick={() => adjust(p._id, 'increase')}
                      disabled={adjusting === p._id}
                      className="p-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors border border-green-100"
                      title="Increase Stock"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => adjust(p._id, 'decrease')}
                      disabled={adjusting === p._id}
                      className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                      title="Decrease Stock"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => adjust(p._id, 'manual_adjustment')}
                      disabled={adjusting === p._id}
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                      title="Set Stock to this value"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                  {adjusting === p._id && <p className="text-xs text-blue-600 mt-2 font-medium">Updating...</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inventory Logs */}
      <div>
        <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-4">Stock Change Log</h3>
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Product', 'Change', 'Qty', 'Before', 'After', 'Reason', 'Date'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500 text-sm">No inventory logs yet</td></tr>
              ) : logs.map(log => (
                <tr key={log._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 text-sm">{log.productName}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                      log.changeType === 'increase' ? 'bg-green-50 text-green-700 border border-green-100' :
                      log.changeType === 'decrease' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>{log.changeType}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{log.quantityChanged}</td>
                  <td className="px-6 py-4 text-gray-500">{log.previousStock}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{log.newStock}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 capitalize">{log.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
