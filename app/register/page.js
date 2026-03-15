'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Lock, Phone } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-bold">W</span>
            </div>
            <span className="font-serif text-xl text-primary">WOODCRAFT</span>
          </Link>
          <h1 className="font-serif text-3xl text-primary mb-1">Create Account</h1>
          <p className="text-muted text-sm">Join Woodcraft India</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-sm space-y-4">
          {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>}

          {[
            { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Priya Sharma' },
            { key: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'priya@example.com' },
            { key: 'phone', label: 'Phone (+91)', icon: Phone, type: 'tel', placeholder: '+91 98765 43210' },
            { key: 'password', label: 'Password', icon: Lock, type: 'password', placeholder: 'Min 6 characters' },
          ].map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium uppercase tracking-widest text-muted mb-1.5">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={type} required
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          ))}

          <button
            type="submit" disabled={loading}
            className="w-full bg-primary text-white py-3.5 text-sm uppercase tracking-widest font-medium hover:bg-accent transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-muted pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:underline font-medium">Sign In</Link>
          </p>

          <div className="relative flex items-center py-2">
            <div className="grow border-t border-gray-200"></div>
            <span className="shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-widest">Or continue with</span>
            <div className="grow border-t border-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3.5 text-sm font-medium transition-colors rounded-none"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </form>
      </div>
    </div>
  )
}
