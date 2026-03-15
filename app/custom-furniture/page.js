'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Send, CheckCircle, Clock, Phone, Mail, MapPin, Hammer } from 'lucide-react'
import { useBusinessSettings } from '@/lib/useBusinessSettings'

const FURNITURE_TYPES = ['Sofa', 'Bed', 'Table', 'Chair', 'Wardrobe', 'Other']

export default function CustomFurniturePage() {
  const { businessInfo, businessAddress } = useBusinessSettings()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', furnitureType: 'Sofa',
    budget: '', requirements: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const change = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/custom-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, budget: form.budget ? parseInt(form.budget) : undefined }),
      })
      if (res.ok) setSubmitted(true)
      else { const d = await res.json(); setError(d.error || 'Something went wrong') }
    } catch { setError('Network error. Please try again.') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 lg:pt-24">
        {/* Hero Banner */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1600&q=85"
            alt="Custom furniture workshop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/50 to-transparent flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3">Bespoke Craftsmanship</p>
              <h1 className="font-serif text-4xl sm:text-5xl text-white mb-3">Custom Furniture</h1>
              <p className="text-white/70 text-lg max-w-lg">
                Can't find what you're looking for? Let our master craftsmen build it for you.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="font-serif text-2xl text-primary mb-4">How It Works</h2>
                <div className="space-y-5">
                  {[
                    { icon: Send, step: '01', title: 'Submit Your Inquiry', desc: 'Tell us what you need — dimensions, material, style, budget.' },
                    { icon: Clock, step: '02', title: 'We Respond in 24hrs', desc: 'Our design team will contact you to discuss your requirements.' },
                    { icon: Hammer, step: '03', title: 'Crafted Just for You', desc: 'Your piece is handcrafted to your exact specifications.' },
                  ].map(({ icon: Icon, step, title, desc }) => (
                    <div key={step} className="flex gap-4">
                      <div className="w-10 h-10 bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-accent uppercase tracking-widest font-medium mb-0.5">Step {step}</p>
                        <p className="text-sm font-semibold text-primary">{title}</p>
                        <p className="text-xs text-muted mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral p-5">
                <p className="text-accent text-xs uppercase tracking-widest font-medium mb-4">Contact Us Directly</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-accent shrink-0" />
                    <span>{businessInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-accent shrink-0" />
                    <span>{businessInfo.email}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{businessAddress}</span>
                  </div>
                </div>
              </div>

              {/* Response promise */}
              <div className="border-l-4 border-accent pl-5 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <p className="text-sm font-semibold text-primary">Response Guaranteed</p>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  We respond to every custom inquiry within <strong className="text-primary">24 hours</strong>. Our craftsmen have been building bespoke furniture for India's finest homes since 2010.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-neutral p-10 text-center h-full flex flex-col items-center justify-center min-h-96">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="font-serif text-3xl text-primary mb-3">Thank You!</h2>
                  <p className="text-gray-600 text-lg mb-2">Your inquiry has been received.</p>
                  <p className="text-muted text-sm max-w-md">
                    Our team will review your requirements and get back to you within{' '}
                    <strong className="text-primary">24 hours</strong>. Keep an eye on <strong className="text-primary">{form.email}</strong>.
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-4 text-center text-sm overflow-hidden rounded-lg">
                    <div className="bg-white p-4">
                      <p className="text-xs text-muted uppercase tracking-widest mb-1">Furniture Type</p>
                      <p className="font-medium text-primary">{form.furnitureType}</p>
                    </div>
                    {form.budget && (
                      <div className="bg-white p-4">
                        <p className="text-xs text-muted uppercase tracking-widest mb-1">Budget</p>
                        <p className="font-medium text-primary">
                          ₹{parseInt(form.budget).toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setForm({
                        name: '', email: '', phone: '', furnitureType: 'Sofa',
                        budget: '', requirements: '',
                      })
                    }}
                    className="mt-10 text-primary font-medium border-b border-primary hover:text-accent hover:border-accent transition-colors pb-1"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <div className="bg-neutral p-8">
                  <h2 className="font-serif text-2xl text-primary mb-6">Submit Your Inquiry</h2>
                  {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 mb-4">{error}</div>}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Priya Sharma', required: true },
                        { key: 'email', label: 'Email', type: 'email', placeholder: 'priya@example.com', required: true },
                        { key: 'phone', label: 'Phone (+91)', type: 'tel', placeholder: '+91 98765 43210', required: true },
                        { key: 'budget', label: 'Approx. Budget (₹)', type: 'number', placeholder: '50000', required: false },
                      ].map(({ key, label, type, placeholder, required }) => (
                        <div key={key}>
                          <label className="block text-xs font-medium uppercase tracking-widest text-muted mb-1.5">
                            {label} {required && <span className="text-red-400">*</span>}
                          </label>
                          <input
                            type={type} required={required} placeholder={placeholder}
                            value={form[key]}
                            onChange={e => change(key, e.target.value)}
                            className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest text-muted mb-1.5">
                        Furniture Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={form.furnitureType}
                        onChange={e => change('furnitureType', e.target.value)}
                        className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                      >
                        {FURNITURE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest text-muted mb-1.5">
                        Description / Special Requirements <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        required rows={5} value={form.requirements}
                        onChange={e => change('requirements', e.target.value)}
                        placeholder="Describe what you need — dimensions (L x W x H), wood preference, colour/finish, style, any reference images, etc."
                        className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-accent resize-none"
                      />
                    </div>

                    <button
                      type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 text-sm uppercase tracking-widest font-medium hover:bg-accent transition-colors disabled:opacity-60"
                    >
                      {loading ? 'Submitting...' : <><Send className="w-4 h-4" /> Send Inquiry</>}
                    </button>
                    <p className="text-center text-xs text-muted">
                      We'll get back to you within <strong>24 hours</strong>
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
