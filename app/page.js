import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import CategoryCard from '@/components/CategoryCard'
import ProductCard from '@/components/ProductCard'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Link from 'next/link'
import { ArrowRight, Truck, Award, Paintbrush, ShieldCheck } from 'lucide-react'

async function getFeaturedProducts() {
  try {
    await connectDB()
    const products = await Product.find({
      isFeatured: true,
      name: { $exists: true, $ne: '' },
      images: { $exists: true, $not: { $size: 0 } },
    }).limit(4).lean()
    return JSON.parse(JSON.stringify(products))
  } catch { return [] }
}

const categories = [
  { name: 'Sofas',   image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
  { name: 'Beds',    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80' },
  { name: 'Tables',  image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80' },
  { name: 'Chairs',  image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80' },
  { name: 'Storage', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
  { name: 'Custom',  image: 'https://images.unsplash.com/photo-1449247613801-ab06418e2861?w=600&q=80' },
]

const whyUs = [
  { icon: <Award className="w-7 h-7" />, title: 'High Quality Materials', desc: 'We use premium sustainable wood and fabrics for lasting durability.' },
  { icon: <ShieldCheck className="w-7 h-7" />, title: 'Affordable Pricing', desc: 'Direct-to-consumer model ensures luxury furniture at fair prices.' },
  { icon: <Paintbrush className="w-7 h-7" />, title: 'Modern Designs', desc: 'Curated designs to bring warmth and style to any contemporary home.' },
  { icon: <Truck className="w-7 h-7" />, title: 'Reliable Delivery', desc: 'White-glove delivery service right to your living room door.' },
]

const testimonials = [
  { name: 'Priya Sharma', initials: 'PS', text: 'The craftsmanship is unparalleled. Our dining table has become the centerpiece of our home.' },
  { name: 'Rahul Verma', initials: 'RV', text: 'Fast delivery and the white-glove service was amazing. They set everything up perfectly.' },
  { name: 'Anya Kapoor', initials: 'AK', text: 'Beautiful minimalist design that really opened up our apartment. Worth every rupee.' },
]

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Shop by Category */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">Collections</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-500 mt-2">Explore our curated collections for every room.</p>
          </div>
          <Link href="/shop" className="text-primary font-semibold flex items-center gap-1 hover:underline text-sm">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <CategoryCard key={cat.name} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-20 bg-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">Signatures</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Featured Furniture</h2>
              <p className="text-gray-500 mt-2">Handpicked pieces to transform your home.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-md"
              >
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">Why Woodcraft</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Built for the discerning home</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {whyUs.map(item => (
            <div key={item.title} className="text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                {item.icon}
              </div>
              <h4 className="font-bold text-base mb-2 text-gray-900">{item.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Room Inspirations */}
      <section className="py-20 bg-secondary-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">Inspirations</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Room Inspirations</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">See how our pieces create breathtaking spaces of comfort and warmth.</p>
          </div>
          <div className="grid grid-cols-12 grid-rows-2 gap-4 h-125">
            <div className="col-span-12 md:col-span-8 row-span-2 relative rounded-2xl overflow-hidden shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80"
                alt="Living Room Inspiration"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs uppercase tracking-widest font-medium text-white/70 mb-1">Living Room</p>
                <h3 className="font-serif text-2xl font-semibold">The Grand Collection</h3>
              </div>
            </div>
            <div className="col-span-6 md:col-span-4 relative rounded-2xl overflow-hidden shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80"
                alt="Dining Room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-sm">Dining</h3>
              </div>
            </div>
            <div className="col-span-6 md:col-span-4 relative rounded-2xl overflow-hidden shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"
                alt="Study Room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-sm">Study</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">Testimonials</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white border border-primary/10 p-8 rounded-2xl shadow-sm">
                <div className="flex text-yellow-400 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6 leading-relaxed text-sm">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center font-bold text-primary text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">Verified Patron</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-10 md:p-20 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 max-w-xl">
              <span className="text-white/70 text-xs uppercase tracking-[0.3em] font-bold mb-3 block">Join The Atrium</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Get Furniture Ideas & Exclusive Offers</h2>
              <p className="text-white/80 mb-8 text-base leading-relaxed">
                Join 10,000+ homeowners who get our weekly design inspiration and exclusive member discounts.
              </p>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 rounded-xl border-none px-6 py-4 text-gray-900 focus:ring-2 focus:ring-white focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
