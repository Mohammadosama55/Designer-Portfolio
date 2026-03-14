'use client';

export default function TestimonialsSection({ testimonials }: { testimonials?: any[] }) {
  const items = testimonials?.filter((t: any) => t.approved) || [];
  if (items.length === 0) return null;

  return (
    <section id="testimonials" style={{ padding: '120px 80px', background: 'var(--surface)' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>— Client Love —</div>
        <h2 className="section-title">Testimonials</h2>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 24, maxWidth: 1200, margin: '0 auto',
      }}>
        {items.map((t: any) => (
          <div key={t._id} className="hover-lift glass" style={{ borderRadius: 20, padding: '28px 24px' }}>
            {/* Stars */}
            <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < t.rating ? 'var(--gold)' : 'var(--border)', fontSize: 14 }}>★</span>
              ))}
            </div>
            <p style={{ fontSize: 14, color: 'var(--soft)', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>
              "{t.text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: 'var(--ink)',
              }}>
                {t.name[0]}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.role}{t.company ? ` @ ${t.company}` : ''}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
