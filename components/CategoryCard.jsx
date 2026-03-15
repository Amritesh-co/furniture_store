import Link from 'next/link'

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/shop?category=${category.name}`}
      className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
    >
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-white">
        <p className="text-[9px] uppercase tracking-[0.2em] font-medium text-white/70 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Explore
        </p>
        <h3 className="font-semibold text-sm">{category.name}</h3>
      </div>
    </Link>
  )
}
