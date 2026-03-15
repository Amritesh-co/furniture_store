import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative w-full h-162.5 flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=2000&q=90"
          alt="Luxury living room furniture"
          className="w-full h-full object-cover"
          style={{ animation: 'kenburns 20s ease-out forwards' }}
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl text-white">
          <p className="text-white/80 text-xs uppercase tracking-[0.3em] font-semibold mb-6 opacity-0 animate-slide-up">
            Premium Indian Craftsmanship
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 opacity-0 animate-slide-up delay-100">
            Design Your<br />
            <span className="italic font-light text-accent">Perfect</span> Living Space
          </h1>
          <p className="text-lg md:text-xl mb-10 text-white/85 leading-relaxed opacity-0 animate-slide-up delay-200">
            Comfortable, stylish, and durable furniture crafted for modern homes. Experience a blend of warmth and minimalism.
          </p>
          <div className="flex flex-wrap gap-4 opacity-0 animate-slide-up delay-300">
            <Link
              href="/shop"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/40 flex items-center gap-2 group"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/custom-furniture"
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/50 px-8 py-4 rounded-xl font-bold text-base transition-all"
            >
              Custom Request
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
