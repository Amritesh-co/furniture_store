'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download, FileText, Send, Printer } from 'lucide-react'

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processingAction, setProcessingAction] = useState(null)

  useEffect(() => {
    fetch(`/api/orders/${id}`).then(r => r.json()).then(d => {
      setOrder(d.data || null)
      setLoading(false)
    })
  }, [id])

  const handleAction = async (actionUrl, actionType, postBody = null) => {
    setProcessingAction(actionType)
    try {
      if (actionType === 'download') {
        const res = await fetch(actionUrl)
        if (res.ok) {
          const blob = await res.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `invoice_${id}.pdf`
          document.body.appendChild(a)
          a.click()
          a.remove()
        } else {
          alert('Failed to download invoice. Ensure it has been generated first.')
        }
      } else {
        const fetchOptions = {
          method: 'POST',
          ...(postBody ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(postBody) } : {})
        }
        const res = await fetch(actionUrl, fetchOptions)
        const data = await res.json()
        if (res.ok) {
          alert(data.data?.message || `Successfully executed ${actionType}`)
        } else {
          alert(`Error: ${data.error || 'Failed to process request.'}`)
        }
      }
    } catch (err) {
      alert(`Network error: ${err.message}`)
    }
    setProcessingAction(null)
  }

  const handlePrint = async () => {
    setProcessingAction('print')
    try {
      const res = await fetch(`/api/orders/${id}/invoice`)
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const printWindow = window.open(url)
        printWindow.onload = () => {
          printWindow.print()
        }
      } else {
        alert('Failed to load printable PDF. Generate it first.')
      }
    } catch (err) {
      alert('Error fetching invoice for print.')
    }
    setProcessingAction(null)
  }

  if (loading) return <div className="p-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
  if (!order) return <div className="p-8 text-red-600">Order not found.</div>

  const isGenerating = processingAction === 'generate'
  const isEmailing = processingAction === 'email'
  const isDownloading = processingAction === 'download'

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/admin/orders')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h2 className="font-serif text-3xl font-semibold text-gray-900">Order Details</h2>
          <p className="text-sm text-gray-500 font-mono">ID: {order.orderId || order._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Order Specifics */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div><p className="text-gray-500 text-xs uppercase tracking-wider">Name</p><p className="font-medium text-gray-900">{order.customerInfo.name}</p></div>
              <div><p className="text-gray-500 text-xs uppercase tracking-wider">Email</p><p className="font-medium text-gray-900">{order.customerInfo.email}</p></div>
              <div><p className="text-gray-500 text-xs uppercase tracking-wider">Phone</p><p className="font-medium text-gray-900">{order.customerInfo.phone}</p></div>
              <div className="col-span-2"><p className="text-gray-500 text-xs uppercase tracking-wider">Delivery Address</p><p className="font-medium text-gray-900">{`${order.customerInfo.address}, ${order.customerInfo.city}, ${order.customerInfo.state} - ${order.customerInfo.pincode}`}</p></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Items Purchased</h3>
            <div className="space-y-3">
              {order.products.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      {p.image ? <img src={p.image} className="w-full h-full object-cover" alt="Product" /> : <div className="w-full h-full bg-gray-200"></div>}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500 font-mono">ID: {p.productId?.slice(-8)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatPrice(p.price)} <span className="text-gray-400 font-normal">x {p.quantity}</span></p>
                    <p className="text-xs font-semibold text-primary">{formatPrice(p.price * p.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Summary & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Order Summary</h3>
            <div className="space-y-2 text-sm text-gray-600 border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-50 mt-2">
                <span>Total</span><span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
               <div className="flex justify-between text-sm items-center">
                 <span className="text-gray-500">Method</span>
                 <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-700">{order.paymentMethod}</span>
               </div>
               <div className="flex justify-between text-sm items-center">
                 <span className="text-gray-500">Status</span>
                 <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-700 capitalize">{order.status}</span>
               </div>
               <div className="flex justify-between text-sm items-center">
                 <span className="text-gray-500">Date</span>
                 <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
               </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-primary/20 shadow-sm bg-primary/2">
             <h3 className="text-lg font-semibold text-primary mb-4 border-b border-primary/10 pb-2 flex items-center gap-2"><FileText className="w-5 h-5"/> Invoice Actions</h3>
             
             <div className="space-y-3">
               <button 
                 onClick={() => handleAction(`/api/orders/${id}/invoice`, 'generate')}
                 disabled={processingAction !== null}
                 className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
               >
                 {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <FileText className="w-4 h-4"/> }
                 {isGenerating ? 'Generating...' : 'Generate New / Replace Invoice'}
               </button>

               <button 
                 onClick={() => handleAction(`/api/orders/${id}/invoice`, 'download')}
                 disabled={processingAction !== null}
                 className="w-full flex items-center justify-center gap-2 bg-white border border-primary text-primary py-2.5 rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50"
               >
                 {isDownloading ? <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"/> : <Download className="w-4 h-4"/> }
                 {isDownloading ? 'Downloading...' : 'Download PDF Invoice'}
               </button>

               <button 
                 onClick={() => handleAction(`/api/orders/${id}/email-invoice`, 'email')}
                 disabled={processingAction !== null}
                 className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
               >
                 {isEmailing ? <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"/> : <Send className="w-4 h-4"/> }
                 {isEmailing ? 'Sending Email...' : `Send to Customer (${order.customerInfo?.email})`}
               </button>

               <button 
                 onClick={handlePrint}
                 disabled={processingAction !== null}
                 className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 mt-4"
               >
                 {processingAction === 'print' ? <div className="w-4 h-4 border-2 border-gray-500/30 border-t-gray-500 rounded-full animate-spin"/> : <Printer className="w-4 h-4"/> }
                 Print Directly
               </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
