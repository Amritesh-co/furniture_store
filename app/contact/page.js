'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MapPin, Phone, Mail, Clock, Send, Instagram } from 'lucide-react'
import { useState } from 'react'
import { useBusinessSettings } from '@/lib/useBusinessSettings'

export default function ContactPage() {
  const { businessInfo, businessMailto } = useBusinessSettings()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSubmitted(true)
        setForm({ name: '', email: '', subject: '', message: '' }) // Reset form
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('An error occurred. Please check your network and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 lg:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-lg text-gray-600">Have a question about our furniture or need custom woodworking? We're here to help.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Information */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8">We'd love to hear from you. Visit our store or reach out through any of these channels.</p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-1">Our Location</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{businessInfo.addressLine1},<br/>{businessInfo.addressLine2}</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-1">Phone & WhatsApp</h3>
                    <p className="text-gray-600 text-sm">{businessInfo.phone}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-1">Email Us</h3>
                    <a href={businessMailto} className="text-primary hover:underline text-sm font-medium">{businessInfo.email}</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-1">Hours of Operation</h3>
                    <p className="text-gray-600 text-sm">Everyday: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
                    <Instagram className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-1">Social Media</h3>
                    <a href={businessInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-medium">{businessInfo.instagramHandle}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8 lg:p-10 border border-gray-100">
              <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-6">Send a Message</h2>
              {submitted ? (
                <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 text-center">
                  <h3 className="font-semibold text-lg mb-2">Message Sent!</h3>
                  <p className="text-sm">Thank you for reaching out. We will get back to you shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-4 text-primary font-medium text-sm hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
                      <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                      <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea required rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none" placeholder="Write your message here..." />
                  </div>
                  
                  {error && (
                    <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-70">
                    {loading ? 'Sending...' : <><Send className="w-5 h-5" /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
