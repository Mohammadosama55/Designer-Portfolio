'use client';

const defaultServices = [
  { title: 'Brand Identity', icon: '✦', description: 'Complete visual brand systems — logo, typography, color, and guidelines that define who you are.', features: ['Logo Design', 'Brand Guidelines', 'Typography System', 'Color Palette'] },
  { title: 'Motion Graphics', icon: '◈', description: 'Animated graphics and visual effects that bring stories to life across any platform or medium.', features: ['2D Animation', 'Title Sequences', 'Social Content', 'UI Animations'] },
  { title: 'Video Production', icon: '▶', description: 'Cinematic video content from concept to final cut — including color grading and sound design.', features: ['Cinematography', 'Color Grading', 'Video Editing', 'Sound Design'] },
  { title: 'Print & Editorial', icon: '⊡', description: 'Premium print design for magazines, books, packaging, and marketing collateral.', features: ['Magazine Layout', 'Book Design', 'Packaging', 'Posters & Ads'] },
];

export default function ServicesSection({ services }: { services?: any[] }) {
  const items = services?.length ? services : defaultServices;

  return (
    <section id="services" style={{ padding: '120px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>— What I Do —</div>
        <h2 className="section-title">Services</h2>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24,
        maxWidth: 1200, margin: '0 auto',
      }}>
        {items.map((s: any, i: number) => (
          <ServiceCard key={s._id || i} service={s} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: any }) {
  return (
    <div className="hover-lift glass" style={{ borderRadius: 20, padding: '32px 28px' }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'var(--gold-dim)', border: '1px solid var(--border-gold)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, marginBottom: 20, color: 'var(--gold)',
      }}>
        {service.icon || '✦'}
      </div>
      <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        {service.title}
      </h3>
      <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20 }}>
        {service.description}
      </p>
      {service.features?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {service.features.map((f: string, i: number) => (
            <span key={i} style={{
              fontSize: 11, color: 'var(--gold)', background: 'var(--gold-dim)',
              border: '1px solid var(--border-gold)', borderRadius: 20, padding: '3px 10px',
              fontWeight: 600,
            }}>{f}</span>
          ))}
        </div>
      )}
    </div>
  );
}
