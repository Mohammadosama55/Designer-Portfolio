'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface HeroData {
  name?: string
  title?: string
  description?: string
  availableForWork?: boolean
  showreel?: string
  stats?: { value: string; label: string }[]
  socials?: { instagram?: string; behance?: string; dribbble?: string; linkedin?: string }
  heroImageUrl?: string
}

export function HeroSection({ hero }: { hero: HeroData }) {
  const [visible, setVisible] = useState(false)
  const words = ['Graphic Design', 'Motion Graphics', 'Brand Identity', 'Visual Storytelling']
  const [wordIdx, setWordIdx] = useState(0)

  useEffect(() => {
    setVisible(true)
    const interval = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2800)
    return () => clearInterval(interval)
  }, [])

  const stats = hero.stats || [
    { value: '120+', label: 'Projects Done' },
    { value: '40+', label: 'Happy Clients' },
    { value: '5+', label: 'Years Exp.' },
  ]

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-16 px-6 overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute left-[-200px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)' }} />
      <div className="absolute right-[-100px] top-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div
          className="z-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          {/* Available badge */}
          {hero.availableForWork !== false && (
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for Work
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-black leading-none mb-4" style={{ letterSpacing: '-2px' }}>
            {hero.name || 'Alex Rivera'}
          </h1>
          <div className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--text-muted)' }}>
            {hero.title || 'Visual Designer'}
          </div>

          {/* Animated specialty */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8" style={{ background: 'var(--amber)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--amber)' }}>
              {words[wordIdx]}
            </span>
          </div>

          <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: 'var(--text-muted)' }}>
            {hero.description || 'I create compelling brand identities, motion graphics, and visual experiences that leave a lasting impression.'}
          </p>

          {/* CTAs */}
          <div className="flex gap-4 flex-wrap mb-10">
            <a
              href="#work"
              className="px-6 py-3 rounded-xl text-sm font-bold text-black transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl text-sm font-semibold border transition-all hover:border-[var(--amber)] hover:bg-[var(--amber)]/10"
              style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--text)' }}
            >
              Get In Touch
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-10">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                  {s.value}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: showreel / hero image */}
        <div
          className="hidden md:block z-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(40px)',
            transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
          }}
        >
          <div className="relative">
            {/* Decorative frame */}
            <div className="absolute -inset-3 rounded-3xl opacity-30 blur-sm"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.4), rgba(244,63,94,0.3))' }} />
            
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]"
              style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {hero.heroImageUrl ? (
                <Image src={hero.heroImageUrl} alt="Hero" fill className="object-cover" />
              ) : (
                /* Placeholder creative display */
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <div className="w-full aspect-video rounded-xl mb-4 skeleton" />
                  <div className="w-3/4 h-3 rounded skeleton mb-3" />
                  <div className="w-1/2 h-3 rounded skeleton mb-6" />
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <div className="aspect-square rounded-xl skeleton" />
                    <div className="aspect-square rounded-xl skeleton" />
                  </div>
                </div>
              )}

              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}>🎨</div>
                <div>
                  <div className="text-xs font-semibold text-white">Latest Project</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Brand Identity • 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[var(--amber)] to-transparent" />
      </div>
    </section>
  )
}
