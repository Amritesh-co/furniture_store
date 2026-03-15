'use client'
import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'

export default function AdminCustomersPage() {
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then(r => r.json()).catch(() => []),
      fetch('/api/orders').then(r => r.json()).catch(() => []),
    ]).then(([u, o]) => {
      setUsers(Array.isArray(u.data) ? u.data : [])
      setOrders(Array.isArray(o.data) ? o.data : [])
      setLoading(false)
    })
  }, [])

  const getOrderCount = (email) =>
    orders.filter(o => o.customerInfo?.email === email).length

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Customers</h2>
        <p className="text-sm text-gray-500">{users.filter(u => u.role !== 'admin').length} registered users</p>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Customer', 'Email', 'Phone', 'Orders', 'Role', 'Joined'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? Array(3).fill(0).map((_, i) => (
              <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-10 bg-gray-50 rounded-lg animate-pulse" /></td></tr>
            )) : users.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-base">No registered users yet</p>
              </td></tr>
            ) : users.map(u => (
              <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-base font-semibold shadow-sm">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{u.email}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{u.phone || '—'}</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-gray-900 border border-gray-100 bg-white rounded-md px-2.5 py-1 shadow-sm">{getOrderCount(u.email)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${u.role === 'admin' ? 'bg-primary bg-opacity-10 text-primary border-primary border-opacity-20' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
