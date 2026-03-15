'use client'
import { useEffect, useState } from 'react'
import { Save, Mail, Phone, MapPin, Search } from 'lucide-react'
import { BUSINESS_INFO } from '@/lib/businessConfig'

const getInitialForm = () => ({
  brandName: BUSINESS_INFO.brandName,
  displayName: BUSINESS_INFO.displayName,
  legalName: BUSINESS_INFO.legalName,
  email: BUSINESS_INFO.email,
  phone: BUSINESS_INFO.phone,
  phoneDisplay: BUSINESS_INFO.phoneDisplay,
  addressLine1: BUSINESS_INFO.addressLine1,
  addressLine2: BUSINESS_INFO.addressLine2,
  shortAddress: BUSINESS_INFO.shortAddress,
  instagramUrl: BUSINESS_INFO.instagramUrl,
  instagramHandle: BUSINESS_INFO.instagramHandle,
  whatsappNumber: BUSINESS_INFO.whatsappNumber,
})

export default function AdminSettings() {
  const [form, setForm] = useState(getInitialForm)
  const [initialForm, setInitialForm] = useState(getInitialForm)
  
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings', { cache: 'no-store' })
        const payload = await res.json()
        if (!res.ok) {
          setError(payload.error || 'Failed to load global settings')
          return
        }

        const info = payload.data?.businessInfo
        if (info) {
          const nextForm = {
            brandName: info.brandName || '',
            displayName: info.displayName || '',
            legalName: info.legalName || '',
            email: info.email || '',
            phone: info.phone || '',
            phoneDisplay: info.phoneDisplay || '',
            addressLine1: info.addressLine1 || '',
            addressLine2: info.addressLine2 || '',
            shortAddress: info.shortAddress || '',
            instagramUrl: info.instagramUrl || '',
            instagramHandle: info.instagramHandle || '',
            whatsappNumber: info.whatsappNumber || '',
          }
          setForm(nextForm)
          setInitialForm(nextForm)
        }
      } catch {
        setError('Failed to load global settings')
      } finally {
        setLoadingInitial(false)
      }
    }

    loadSettings()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaved(false)
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessInfo: form }),
      })
      const payload = await res.json()
      if (!res.ok) {
        setError(payload.error || 'Failed to save settings')
        return
      }

      const info = payload.data?.businessInfo
      if (info) {
        const nextForm = {
          brandName: info.brandName || '',
          displayName: info.displayName || '',
          legalName: info.legalName || '',
          email: info.email || '',
          phone: info.phone || '',
          phoneDisplay: info.phoneDisplay || '',
          addressLine1: info.addressLine1 || '',
          addressLine2: info.addressLine2 || '',
          shortAddress: info.shortAddress || '',
          instagramUrl: info.instagramUrl || '',
          instagramHandle: info.instagramHandle || '',
          whatsappNumber: info.whatsappNumber || '',
        }
        setForm(nextForm)
        setInitialForm(nextForm)
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  if (loadingInitial) {
    return <div className="max-w-4xl mx-auto py-10 text-gray-500">Loading global settings...</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-2 text-sm">Manage your store's global configuration and contact details.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Store Contact Information</h2>
            <p className="text-sm text-gray-500">This information will be displayed globally across the website.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Name</label>
                <input
                  type="text"
                  value={form.brandName}
                  onChange={e => setForm({...form, brandName: e.target.value})}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={e => setForm({...form, displayName: e.target.value})}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex text-sm font-medium text-gray-700 mb-1.5 items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> Support Email
                </label>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="flex text-sm font-medium text-gray-700 mb-1.5 items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> Contact Number
                </label>
                <input 
                  type="text" 
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Phone</label>
                <input
                  type="text"
                  value={form.phoneDisplay}
                  onChange={e => setForm({...form, phoneDisplay: e.target.value})}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Legal Name</label>
                <input
                  type="text"
                  value={form.legalName}
                  onChange={e => setForm({...form, legalName: e.target.value})}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-1.5 items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Address Line 1
              </label>
              <input
                type="text"
                value={form.addressLine1}
                onChange={e => setForm({...form, addressLine1: e.target.value})}
                className="w-full border border-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 2</label>
              <input
                type="text"
                value={form.addressLine2}
                onChange={e => setForm({...form, addressLine2: e.target.value})}
                className="w-full border border-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Address</label>
              <input
                type="text"
                value={form.shortAddress}
                onChange={e => setForm({...form, shortAddress: e.target.value})}
                className="w-full border border-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-widest">Social Links & Integrations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex text-sm font-medium text-gray-700 mb-1.5 items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" /> Instagram Profile URL
                  </label>
                  <input 
                    type="url" 
                    value={form.instagramUrl}
                    onChange={e => setForm({...form, instagramUrl: e.target.value})}
                    className="w-full border border-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram Handle</label>
                  <input
                    type="text"
                    value={form.instagramHandle}
                    onChange={e => setForm({...form, instagramHandle: e.target.value})}
                    className="w-full border border-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="flex text-sm font-medium text-gray-700 mb-1.5 items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" /> WhatsApp Direct Chat Number
                  </label>
                  <input 
                    type="text" 
                    value={form.whatsappNumber}
                    onChange={e => setForm({...form, whatsappNumber: e.target.value})}
                    className="w-full border border-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Connected to floating widget and order assistance link.</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm p-4 rounded-lg border border-red-200 mt-4">
                {error}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForm(initialForm)
                setError('')
                setSaved(false)
              }}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Discard Changes
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-primary/20"
            >
              {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Configuration</>}
            </button>
          </div>
          
          {saved && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm text-center rounded-lg animate-fade-in border border-green-200">
              Global settings saved successfully.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}