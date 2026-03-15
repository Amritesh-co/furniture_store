'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, User, Menu, X, Search, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { cartCount } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keep first server/client render identical, then hydrate interactive user/cart state.
  const safeCartCount = mounted ? cartCount : 0
  const safeSession = mounted ? session : null

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMenuOpen(false)
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Custom', href: '/custom-furniture' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm' : 'bg-white/90 backdrop-blur-md'
    } border-b border-primary/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
              <span className="text-white text-[11px] font-black tracking-[0.2em]">W</span>
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-primary uppercase">WOODCRAFT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-primary group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search furniture..."
                className="bg-primary/5 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none w-48 focus:w-56 transition-all duration-300"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </form>

            {/* Cart */}
            <Link href="/cart" className="relative p-2.5 hover:bg-primary/10 rounded-full transition-all active:scale-90">
              <ShoppingBag className="w-4.5 h-4.5 text-gray-700 hover:text-primary" />
              {safeCartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] rounded-full flex items-center justify-center font-bold shadow-sm">
                  {safeCartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {safeSession ? (
              <div className="relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-1.5 p-2 hover:bg-primary/10 rounded-full transition-colors active:scale-95"
                >
                  <div className="w-7 h-7 bg-primary/15 text-primary border border-primary/20 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {safeSession.user.name?.[0]?.toUpperCase()}
                  </div>
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white shadow-2xl border border-gray-100 rounded-xl py-2 animate-fade-in origin-top-right">
                    <div className="px-5 py-3 border-b border-gray-100 mb-1">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Account</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{safeSession.user.name}</p>
                    </div>
                    {safeSession.user.role === 'admin' ? (
                      <Link href="/admin" className="flex items-center px-5 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" onClick={() => setUserOpen(false)}>
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link href="/profile/orders" className="flex items-center px-5 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" onClick={() => setUserOpen(false)}>
                        My Orders
                      </Link>
                    )}
                    <button
                      onClick={() => { localStorage.removeItem('woodcraft-cart'); signOut(); setUserOpen(false) }}
                      className="w-full text-left px-5 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="p-2.5 hover:bg-primary/10 rounded-full transition-all active:scale-90">
                <User className="w-4.5 h-4.5 text-gray-700 hover:text-primary" />
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2.5 hover:bg-primary/10 rounded-full transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-6 bg-white animate-fade-in">
            <div className="px-2 mb-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              </form>
            </div>
            <div className="space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
