'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Package, Layers, ShoppingCart, Users, BarChart2,
  LogOut, X, ChevronRight, Settings, MessageSquare
} from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Inventory', href: '/admin/inventory', icon: Layers },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Inquiries', href: '/admin/custom-inquiries', icon: MessageSquare },
  { label: 'Employees', href: '/admin/employees', icon: Users },
  { label: 'Attendance', href: '/admin/attendance', icon: BarChart2 },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-primary-dark">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
            <span className="text-primary text-sm font-bold">W</span>
          </div>
          <div>
            <span className="font-serif text-lg text-white tracking-wide">WOODCRAFT</span>
            <p className="text-[10px] text-[#F8F8F8] uppercase tracking-widest opacity-80">Admin Panel</p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-primary-dark rounded text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors group ${
                active
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-[#F8F8F8] hover:bg-primary-dark hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-4 h-4 opacity-70" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-5 border-t border-primary-dark space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm text-[#F8F8F8] hover:text-white hover:bg-primary-dark rounded-lg transition-colors">
          <Package className="w-5 h-5" /> View Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#F8F8F8] hover:text-red-300 hover:bg-primary-dark rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  )
}
