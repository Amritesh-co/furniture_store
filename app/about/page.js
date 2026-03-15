import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { MapPin, Target, Shield, Heart } from 'lucide-react'
import { getBusinessInfo } from '@/lib/settingsService'

export const metadata = {
  title: 'About Us',
  description: 'Learn about Woodcraft India, our master craftsmen, and our premium furniture.',
}

export default async function AboutPage() {
  const businessInfo = await getBusinessInfo()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero */}
      <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1600&q=80" alt="Woodworking craftsman" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6">Our Story</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Crafting premium wooden furniture for Indian homes since 2010. Tradition meets modern elegance.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-16 h-1 bg-primary mb-8" />
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">Master Craftsmanship <br/> Born in Ranchi</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Woodcraft India started with a simple belief: furniture should be built to last generations, not just seasons. From our humble beginnings in Ranchi, we've grown into a trusted name for bespoke, premium wooden furniture across the country.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Every piece that leaves our workshop at {businessInfo.shortAddress}, is a testament to our dedication to the craft. We source only the finest sustainable timber, combining age-old joinery techniques with precision engineering.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-serif text-4xl font-semibold text-primary mb-2">10+</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">Years Experience</p>
                </div>
                <div>
                  <h4 className="font-serif text-4xl font-semibold text-primary mb-2">5k+</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">Happy Homes</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-4/5 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80" alt="Furniture workshop" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Proudly Made</h4>
                    <p className="text-sm text-gray-500">In Ranchi, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide every cut, joint, and finish.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Uncompromising Quality</h3>
              <p className="text-gray-600 leading-relaxed">We select the highest grade materials and never take shortcuts in our construction process.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Durability & Trust</h3>
              <p className="text-gray-600 leading-relaxed">Our pieces are engineered to withstand the test of time, backed by our comprehensive warranty and support.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-600 leading-relaxed">From first inquiry to final delivery, we ensure a seamless and delightful experience for every home.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-6">Ready to Transform Your Space?</h2>
          <p className="text-lg text-gray-600 mb-10">Explore our collection or reach out for custom requirements.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-dark transition-colors">
              Explore Collection
            </Link>
            <Link href="/custom-furniture" className="w-full sm:w-auto bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-medium hover:border-primary hover:text-primary transition-colors">
              Custom Requests
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
