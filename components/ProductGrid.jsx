import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full text-center py-20">
        <p className="font-serif text-2xl text-gray-300 mb-2">No products found</p>
        <p className="text-muted text-sm">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
