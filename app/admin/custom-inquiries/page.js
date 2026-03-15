'use client'
import { useEffect, useState } from 'react'
import { Mail, Phone, Clock, MessageSquare, CheckCircle, Trash2, ExternalLink } from 'lucide-react'

export default function CustomInquiriesAdmin() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/custom-inquiry')
      const data = await res.json()
      if (res.ok) {
        setInquiries(Array.isArray(data.data) ? data.data : [])
      } else {
        setError(data.error || 'Failed to fetch inquiries')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

  if (loading) return <div className="p-8 text-center text-gray-500">Loading inquiries...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Custom Furniture Inquiries</h2>
          <p className="text-base text-gray-500">Manage bespoke furniture requests from customers.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Total Inquiries</p>
          <p className="text-2xl font-bold text-primary">{inquiries.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Requirements</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Budget</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Date</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">No custom inquiries found yet.</td>
                </tr>
              ) : (
                inquiries.map((iq) => (
                  <tr key={iq._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{iq.name}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Mail className="w-3 h-3" /> {iq.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <Phone className="w-3 h-3" /> {iq.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase">{iq.furnitureType}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-md">{iq.requirements}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-primary">
                        {iq.budget ? formatPrice(iq.budget) : 'Not Specified'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(iq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        iq.status === 'new' ? 'bg-blue-100 text-blue-700' : 
                        iq.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {iq.status === 'new' && <div className="w-1 h-1 bg-current rounded-full" />}
                        {iq.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
