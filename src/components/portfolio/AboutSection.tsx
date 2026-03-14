'use client'

interface AboutData {
  bio?: string
  skills?: string[]
  experience?: string
  location?: string
  email?: string
  resumeUrl?: string
}

export function AboutSection({ about }: { about: AboutData }) {
  const skills = about.skills || ['Adobe Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'Figma']

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-square max-w-sm mx-auto"
              style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {/* Decorative design element */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Rotating outer ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30"
                    style={{ borderColor: 'var(--amber)', animation: 'spin 20s linear infinite' }} />
                  <div className="absolute inset-4 rounded-full flex items-center justify-center text-6xl"
                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    🎨
                  </div>
                </div>
              </div>
              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg"
                style={{ borderColor: 'var(--amber)', opacity: 0.5 }} />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 rounded-br-lg"
                style={{ borderColor: 'var(--rose)', opacity: 0.5 }} />
            </div>

            {/* Experience card */}
            <div className="absolute -bottom-4 -right-4 glass rounded-2xl p-4 text-center">
              <div className="text-3xl font-black gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                {about.experience || '5+'}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Years Experience</div>
            </div>
          </div>

          {/* Right: content */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--amber)' }}>
              About Me
            </p>
            <h2 className="text-4xl font-black mb-6 leading-tight">
              The Creative<br />
              <span className="gradient-text">Behind the Work</span>
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
              {about.bio || "I'm a passionate graphic designer and motion artist with a love for bold aesthetics and purposeful design."}
            </p>

            {/* Skills */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold mb-3 text-white">Tools & Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s} className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: 'var(--amber)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Info row */}
            <div className="flex flex-wrap gap-6 mb-8">
              {about.location && (
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span>📍</span> {about.location}
                </div>
              )}
              {about.email && (
                <a href={`mailto:${about.email}`} className="flex items-center gap-2 text-sm hover:text-[var(--amber)] transition-colors"
                  style={{ color: 'var(--text-muted)' }}>
                  <span>✉️</span> {about.email}
                </a>
              )}
            </div>

            {about.resumeUrl && (
              <a
                href={about.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)', color: '#000' }}
              >
                Download Resume ↓
              </a>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}
