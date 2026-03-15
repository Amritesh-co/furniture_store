'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductGallery({ images = [], name }) {
  const [activeIdx, setActiveIdx] = useState(0)

  const goTo = (idx) => {
    if (idx < 0) idx = images.length - 1
    if (idx >= images.length) idx = 0
    setActiveIdx(idx)
  }

  const src = (img) => img || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative h-125 bg-gray-50 overflow-hidden group rounded-xl">
        <img
          src={src(images[activeIdx])}
          alt={`${name} — view ${activeIdx + 1}`}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'; }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIdx - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => goTo(activeIdx + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1">
            {activeIdx + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`shrink-0 w-20 h-20 overflow-hidden border-2 rounded-lg transition-all ${
                activeIdx === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src(img)} alt={`Thumbnail ${idx + 1}`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80'; }} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
