'use client';
import Image from 'next/image';

export default function AboutSection({ about }: { about?: any }) {
  const bio = about?.bio || 'I am a passionate visual designer with a deep love for crafting compelling narratives through imagery and motion. Every project is an opportunity to push creative boundaries.';
  const skills = about?.skills?.length ? about.skills : [
    { name: 'Brand Identity', level: 95 },
    { name: 'Motion Graphics', level: 90 },
    { name: 'Video Editing', level: 88 },
    { name: 'Illustration', level: 80 },
    { name: 'Color Grading', level: 92 },
  ];

  return (
    <section id="about" style={{ padding: '120px 80px', background: 'var(--surface)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        {/* Image */}
        <div style={{ position: 'relative' }}>
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            border: '1px solid var(--border-gold)',
            aspectRatio: '4/5',
            background: 'var(--surface2)',
            position: 'relative',
          }}>
            {about?.imageUrl ? (
              <Image src={about.imageUrl} alt="About" fill style={{ objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '100%', height: '100%', minHeight: 400,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 12, color: 'var(--muted)',
              }}>
                <span style={{ fontSize: 48 }}>🎨</span>
                <span style={{ fontSize: 13 }}>Add photo in admin</span>
              </div>
            )}
          </div>
          {/* Floating badge */}
          <div style={{
            position: 'absolute', bottom: -20, right: -20,
            background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
            color: 'var(--ink)', borderRadius: 16, padding: '16px 24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 800 }}>
              {about?.experience || '5+'}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>YEARS EXP</div>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="section-label" style={{ marginBottom: 12 }}>About Me</div>
          <h2 className="section-title" style={{ marginBottom: 24 }}>Crafting Visual<br /><em>Experiences</em></h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16 }}>{bio}</p>
          {about?.bio2 && (
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 32 }}>{about.bio2}</p>
          )}

          {/* Skills */}
          <div style={{ marginTop: 32 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--soft)', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Core Skills
            </div>
            {skills.map((s: any, i: number) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <span>{s.name}</span>
                  <span style={{ color: 'var(--gold)' }}>{s.level}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
                  <div style={{
                    height: '100%', width: `${s.level}%`, borderRadius: 4,
                    background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
