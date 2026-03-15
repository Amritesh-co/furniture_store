'use client'

import Link from 'next/link'
import { Instagram, MapPin, Phone, Mail } from 'lucide-react'
import { useBusinessSettings } from '@/lib/useBusinessSettings'

export default function Footer() {
  const { businessInfo, businessMailto } = useBusinessSettings()

  return (
    <footer className="bg-[#1d1815] text-slate-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">

          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-[11px] font-bold tracking-widest">W</span>
              </div>
              <span className="font-serif text-xl font-bold text-white uppercase tracking-tight">{businessInfo.brandName}</span>
            </div>
            <p className="text-sm leading-relaxed mb-8 max-w-xs text-slate-400">
              Crafting beautiful spaces since 2010. Premium handcrafted furniture from India, elevating modern homes with timeless design and exceptional materials.
            </p>
            <div className="flex gap-4">
              <a href={businessInfo.instagramUrl} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:border-primary transition-colors text-slate-400 hover:text-white">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={businessMailto}
                className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:border-primary transition-colors text-slate-400 hover:text-white">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-white font-bold mb-6 text-sm">Company</h5>
            <ul className="space-y-4 text-sm">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Shop Collection', href: '/shop' },
                { label: 'Custom Orders', href: '/custom-furniture' },
                { label: 'Contact', href: '/contact' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-white font-bold mb-6 text-sm">Categories</h5>
            <ul className="space-y-4 text-sm">
              {['Sofas', 'Beds', 'Tables', 'Chairs', 'Storage'].map(cat => (
                <li key={cat}>
                  <Link href={`/shop?category=${cat}`} className="hover:text-white transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-white font-bold mb-6 text-sm">Contact</h5>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>{businessInfo.phoneDisplay}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={businessMailto} className="hover:text-white transition-colors truncate">
                  {businessInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{businessInfo.shortAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {businessInfo.legalName} All rights reserved.</p>
          <div className="flex gap-8 uppercase tracking-widest">
            {['Privacy Policy', 'Terms of Service', 'Refunds'].map(t => (
              <a key={t} href="#" className="hover:text-white transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
