'use client'
import { useState } from 'react'
import Image from 'next/image'

interface PortfolioItem {
  _id: string
  title: string
  description: string
  category: string
  mediaUrl: string
  thumbnailUrl: string
  mediaType: 'image' | 'video'
  tags: string[]
  featured: boolean
}

const categories = [
  { id: 'all', label: 'All Work' },
  { id: 'image', label: 'Photography' },
  { id: 'video', label: 'Video' },
  { id: 'branding', label: 'Branding' },
  { id: 'motion', label: 'Motion' },
  { id: 'print', label: 'Print' },
]

export function PortfolioSection({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState('all')
  const [selected, setSelected] = useState<PortfolioItem | null>(null)

  const filtered = active === 'all' ? items : items.filter(i => i.category === active)


  return (
    <section id="work" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--amber)' }}>
              Selected Work
            </p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              Creative<br />
              <span className="gradient-text">Portfolio</span>
            </h2>
          </div>
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: active === c.id ? 'linear-gradient(135deg, #f59e0b, #f43f5e)' : 'rgba(255,255,255,0.05)',
                  color: active === c.id ? '#000' : 'var(--text-muted)',
                  border: active === c.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24" style={{ color: 'var(--text-muted)' }}>
            <div className="text-5xl mb-4">🎨</div>
            <p className="text-lg">No work added yet. Check back soon!</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((item, idx) => (
              <PortfolioCard key={item._id || idx} item={item} idx={idx} onClick={() => setSelected(item)} />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <Lightbox item={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}

function PortfolioCard({ item, idx, onClick }: { item: PortfolioItem; idx: number; onClick: () => void }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      className="break-inside-avoid cursor-pointer overflow-hidden rounded-2xl relative group"
      style={{
        background: 'var(--surface2)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative overflow-hidden">
        {item.mediaType === 'video' ? (
          <div className="relative aspect-video">
            <Image
              src={item.thumbnailUrl || item.mediaUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500"
              style={{ transform: hover ? 'scale(1.05)' : 'scale(1)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{ background: 'rgba(245,158,11,0.9)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative" style={{ minHeight: '200px' }}>
            <Image
              src={item.mediaUrl}
              alt={item.title}
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-transform duration-500"
              style={{ transform: hover ? 'scale(1.05)' : 'scale(1)' }}
            />
          </div>
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(10,10,15,0.9) 0%, transparent 60%)',
            opacity: hover ? 1 : 0,
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--amber)' }}>
            {item.category}
          </p>
          <h3 className="text-base font-bold text-white">{item.title}</h3>
        </div>
      </div>

      {/* Bottom info */}
      {item.featured && (
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(245,158,11,0.9)', color: '#000' }}>
          Featured
        </div>
      )}
    </div>
  )
}

function Lightbox({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          ✕
        </button>

        <div className="relative">
          {item.mediaType === 'video' ? (
            <video src={item.mediaUrl} controls className="w-full max-h-[70vh] object-contain" autoPlay />
          ) : (
            <Image src={item.mediaUrl} alt={item.title} width={1200} height={800} className="w-full object-contain max-h-[70vh]" />
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--amber)' }}>
              {item.category}
            </span>
            {item.tags.map(t => (
              <span key={t} className="text-xs px-2 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
                {t}
              </span>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
          {item.description && (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
