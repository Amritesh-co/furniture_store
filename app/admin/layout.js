'use client'
import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Menu, Bell } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary border-r border-primary-dark shrink-0 text-white">
        <AdminSidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-primary text-white shadow-2xl flex flex-col">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-lg text-gray-500"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-xl font-medium text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {session?.user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
