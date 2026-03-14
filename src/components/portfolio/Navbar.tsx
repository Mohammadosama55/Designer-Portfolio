'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NavbarProps {
  settings: { logoText?: string; siteTitle?: string }
}

export function Navbar({ settings }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { href: '#work', label: 'Work' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500"
      style={{ paddingTop: scrolled ? '10px' : '20px' }}
    >
      <nav
        className={`max-w-6xl mx-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 ${
          scrolled ? 'glass shadow-2xl' : ''
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-black"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)', fontFamily: 'var(--font-display)' }}
          >
            {settings.logoText || 'AR'}
          </div>
          <span className="text-sm font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors hidden sm:block">
            Portfolio
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-1">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-1.5 rounded-full text-sm font-medium text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Admin link */}
        <Link
          href="/admin"
          className="hidden md:flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-[var(--amber)]/30 text-[var(--amber)] hover:bg-[var(--amber)]/10 transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Admin
        </Link>

        {/* Mobile menu */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden glass mx-4 mt-2 rounded-2xl p-4 flex flex-col gap-2">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all"
            >
              {l.label}
            </a>
          ))}
          <Link href="/admin" className="px-4 py-3 rounded-xl text-sm font-semibold text-[var(--amber)]">
            Admin Dashboard
          </Link>
        </div>
      )}
    </header>
  )
}
