interface Testimonial {
  _id: string
  name: string
  role: string
  company: string
  text: string
  rating: number
  avatarUrl?: string
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null

  return (
    <section id="testimonials" className="py-24 px-6" style={{ background: 'var(--surface)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--amber)' }}>Testimonials</p>
          <h2 className="text-4xl font-black">What Clients Say</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={t._id} className="p-6 rounded-2xl hover-lift"
              style={{
                background: 'var(--surface2)',
                border: '1px solid rgba(255,255,255,0.06)',
                animationDelay: `${i * 0.1}s`,
              }}>
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-sm" style={{ color: 'var(--amber)' }}>★</span>
                ))}
              </div>

              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}>
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {t.role}{t.company ? ` @ ${t.company}` : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
