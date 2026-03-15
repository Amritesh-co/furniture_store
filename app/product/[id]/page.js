import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import ProductGallery from '@/components/ProductGallery'
import ProductCard from '@/components/ProductCard'
import AddToCartSection from '@/components/AddToCartSection'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { Package, Ruler, Box, ShieldCheck, FileText, ChevronRight } from 'lucide-react'

async function getProduct(id) {
  try {
    await connectDB()
    const p = await Product.findById(id).lean()
    return p ? JSON.parse(JSON.stringify(p)) : null
  } catch { return null }
}

async function getRelated(category, currentId) {
  try {
    await connectDB()
    const products = await Product.find({ category, _id: { $ne: currentId } }).limit(4).lean()
    return JSON.parse(JSON.stringify(products))
  } catch { return [] }
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const product = await getProduct(id)
  return {
    title: product?.name || 'Product',
    description: product?.description?.substring(0, 160),
  }
}

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

export default async function ProductPage({ params }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-3xl font-bold text-gray-900 mb-4">Product not found</p>
          <Link href="/shop" className="text-primary font-semibold hover:underline">← Back to Shop</Link>
        </div>
      </div>
    )
  }

  const related = await getRelated(product.category, product._id)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="pt-20 lg:pt-28 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="text-sm font-medium text-gray-500 mb-10 flex items-center gap-2 uppercase tracking-wider">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-gray-300"><ChevronRight className="w-4 h-4" /></span>
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span className="text-gray-300"><ChevronRight className="w-4 h-4" /></span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
            <span className="text-gray-300"><ChevronRight className="w-4 h-4" /></span>
            <span className="text-primary truncate max-w-50">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Gallery */}
            <div className="lg:sticky lg:top-32 h-fit">
              <ProductGallery images={product.images} name={product.name} />
            </div>

            {/* Info */}
            <div className="flex flex-col space-y-8">
              <div>
                <p className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3">{product.category}</p>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                
                {/* Review Stars Mock */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-500">(24 reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 py-6 border-y border-gray-200/60">
                <p className="text-4xl font-bold text-primary">{formatPrice(product.price)}</p>
                {product.status === 'lowStock' && (
                  <span className="text-xs bg-amber-500/10 text-amber-700 font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    Only {product.stock} left
                  </span>
                )}
                {product.status === 'outOfStock' && (
                  <span className="text-xs bg-red-500/10 text-red-700 font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>

              {/* Add to Cart Component */}
              <div className="pt-2 pb-6">
                <AddToCartSection product={product} />
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-4 lg:gap-6 pt-8 border-t border-gray-200/60">
                <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <Package className="w-7 h-7 text-primary mb-3" />
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Material</p>
                  <p className="text-sm font-bold text-gray-900">{product.material}</p>
                </div>
                <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <Ruler className="w-7 h-7 text-primary mb-3" />
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Dimensions</p>
                  <p className="text-sm font-bold text-gray-900">{product.dimensions}</p>
                </div>
                <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <Box className="w-7 h-7 text-primary mb-3" />
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Stock</p>
                  <p className="text-sm font-bold text-gray-900">{product.stock} units</p>
                </div>
              </div>

              {/* Dynamic Warranty Section */}
              {product.warranty?.warrantyPeriod && (
                <div className="pt-10 border-t border-gray-200/60">
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <ShieldCheck className="w-7 h-7 text-primary" /> Warranty & Guarantee
                  </h3>
                  
                  <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Warranty</p>
                        <p className="text-base font-bold text-gray-900">{product.warranty.warrantyPeriod}</p>
                      </div>
                      {product.warranty.guaranteePeriod && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Guarantee</p>
                          <p className="text-base font-bold text-gray-900">{product.warranty.guaranteePeriod}</p>
                        </div>
                      )}
                    </div>
                    
                    {product.warranty.termsAndConditions && product.warranty.termsAndConditions.length > 0 && (
                      <div className="pt-6 border-t border-gray-100">
                        <p className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                           <FileText className="w-4 h-4 text-primary" /> Terms & Conditions
                        </p>
                        <ul className="space-y-3">
                          {product.warranty.termsAndConditions.map((term, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 bg-primary/50 rounded-full mt-2 shrink-0" />
                              <span className="leading-relaxed">{term}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-32 pt-16 lg:pt-24 border-t border-gray-200/60">
              <div className="mb-14 text-center">
                <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3 block">More to Love</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">Related Pieces</h2>
                <p className="text-gray-500 text-lg">Curated furniture to match your style.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {related.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
