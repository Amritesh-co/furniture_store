'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { SlidersHorizontal, X } from 'lucide-react'

const categories = ['All', 'Sofas', 'Chairs', 'Tables', 'Beds', 'Storage']
const materials = ['All', 'Teak Wood', 'Sheesham Wood', 'Mango Wood', 'Rattan', 'Fabric', 'Leather', 'Marble', 'Engineered Wood']
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'best-selling', label: 'Best Selling' },
]

function ShopContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''

  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [filters, setFilters] = useState({
    category: 'All', material: 'All', minPrice: '', maxPrice: '',
    available: false, sort: 'newest', page: 1, search: initialSearch,
  })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.category !== 'All') params.set('category', filters.category)
    if (filters.material !== 'All') params.set('material', filters.material)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.available) params.set('available', 'true')
    if (filters.search) params.set('search', filters.search)
    params.set('sort', filters.sort)
    params.set('page', filters.page)
    params.set('limit', '9')

    try {
      const res = await fetch(`/api/products?${params}`)
      const payload = await res.json()
      const data = payload.data || {}
      setProducts(data.products || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch { setProducts([]) }
    setLoading(false)
  }, [filters])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  useEffect(() => {
    // Update local filter state when URL search changes (e.g., from Navbar search)
    const currentSearch = searchParams.get('search') || ''
    setFilters(f => ({ ...f, search: currentSearch, page: 1 }))
  }, [searchParams])

  const updateFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const resetFilters = () => {
    setFilters({ category: 'All', material: 'All', minPrice: '', maxPrice: '', available: false, sort: 'newest', page: 1, search: '' })
    if (searchParams.has('search')) router.push('/shop')
  }

  const FilterSidebar = () => (
    <div className="w-64 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-bold text-gray-900">Filters</h3>
        <button onClick={resetFilters} className="text-sm font-medium text-primary hover:underline">Reset All</button>
      </div>

      {/* Category */}
      <div>
        <p className="text-sm font-bold text-gray-900 mb-3 tracking-wide">Category</p>
        <div className="space-y-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => updateFilter('category', cat)}
              className={`block w-full text-left text-sm px-4 py-2.5 transition-colors rounded-xl font-medium ${
                filters.category === cat 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-900 tracking-wide">Price (₹)</p>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">₹</span>
            <input
              type="number" placeholder="Min" min="0"
              value={filters.minPrice}
              onChange={e => {
                const val = e.target.value;
                if (val !== '' && Number(val) < 0) return;
                updateFilter('minPrice', val)
              }}
              className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">₹</span>
            <input
              type="number" placeholder="Max" min="0"
              value={filters.maxPrice}
              onChange={e => {
                const val = e.target.value;
                if (val !== '' && Number(val) < 0) return;
                updateFilter('maxPrice', val)
              }}
              className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Material */}
      <div>
        <p className="text-sm font-bold text-gray-900 mb-3 tracking-wide">Material</p>
        <div className="relative">
          <select
            value={filters.material}
            onChange={e => updateFilter('material', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50 transition-all cursor-pointer font-medium text-gray-700 appearance-none"
          >
            {materials.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-colors">
          <input
            type="checkbox"
            checked={filters.available}
            onChange={e => updateFilter('available', e.target.checked)}
            className="w-5 h-5 accent-primary rounded-md border-gray-300 focus:ring-primary/20 text-primary transition-all"
          />
          <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">In Stock Only</span>
        </label>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Page Header */}
      <div className="pt-20 lg:pt-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">
            <span>Shop</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500">{filters.category}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">
            {filters.search ? `Results for "${filters.search}"` : 'Shop Collection'}
          </h1>
          <p className="text-gray-500 text-lg mt-4 max-w-2xl leading-relaxed">
            {filters.search 
              ? `Found ${total} ${total === 1 ? 'product' : 'products'} matching your search.` 
              : `Explore ${total} perfectly crafted pieces bringing warmth and style to any contemporary home.`}
          </p>
        </div>
      </div>
      
      <div className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 text-sm font-bold border border-gray-200 bg-white rounded-xl px-5 py-2.5 hover:border-primary hover:text-primary transition-colors shadow-sm lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm font-bold text-gray-500 hidden sm:block uppercase tracking-widest">Sort by:</span>
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={e => updateFilter('sort', e.target.value)}
                  className="text-sm font-bold border border-gray-200 bg-white rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer shadow-sm transition-all appearance-none text-gray-700"
                >
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-10">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block shrink-0">
              <div className="sticky top-28">
                <FilterSidebar />
              </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
               <div className="fixed inset-0 z-50 lg:hidden flex">
                 <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
                 <div className="relative w-72 max-w-sm bg-background h-full shadow-2xl p-6 overflow-y-auto animate-slide-up sm:animate-none">
                   <div className="flex justify-between items-center mb-8">
                     <h3 className="font-bold text-xl text-gray-900 font-serif">Filters</h3>
                     <button onClick={() => setSidebarOpen(false)} className="p-2 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors">
                       <X className="w-5 h-5" />
                     </button>
                   </div>
                   <FilterSidebar />
                 </div>
               </div>
            )}

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {Array(9).fill(null).map((_, i) => (
                    <div key={i} className="h-80 bg-white animate-pulse rounded-2xl shadow-sm border border-gray-100" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <SlidersHorizontal className="w-8 h-8 opacity-80" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-gray-900 mb-3">No products found</p>
                  <p className="text-gray-500 text-base mb-8 max-w-sm mx-auto">We couldn't find anything matching your current filters. Try adjusting them.</p>
                  <button onClick={resetFilters} className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-md">
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {products.map(p => <ProductCard key={p._id} product={p} />)}
                  </div>

                  {/* Pagination */}
                  {pages > 1 && (
                    <div className="flex justify-center gap-2 mt-16 pb-8">
                      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                         <button
                           key={p}
                           onClick={() => setFilters(f => ({ ...f, page: p }))}
                           className={`w-12 h-12 text-sm font-bold rounded-xl transition-all duration-300 ${
                             filters.page === p
                               ? 'bg-primary text-white shadow-md shadow-primary/30 scale-105'
                               : 'bg-white border border-gray-100 text-gray-600 hover:border-primary hover:text-primary shadow-sm'
                           }`}
                         >
                           {p}
                         </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      <Footer />
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
