interface FooterProps {
  settings: { logoText?: string; siteTitle?: string }
  about: { email?: string }
}

export function Footer({ settings, about }: FooterProps) {
  return (
    <footer className="py-12 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-black"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)', fontFamily: 'var(--font-display)' }}>
            {settings.logoText || 'AR'}
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {settings.siteTitle || 'Visual Designer Portfolio'}
          </span>
        </div>
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} All rights reserved. Built with Next.js + Cloudinary + MongoDB
        </p>
        {about.email && (
          <a href={`mailto:${about.email}`} className="text-sm hover:text-[var(--amber)] transition-colors" style={{ color: 'var(--text-muted)' }}>
            {about.email}
          </a>
        )}
      </div>
    </footer>
  )
}
