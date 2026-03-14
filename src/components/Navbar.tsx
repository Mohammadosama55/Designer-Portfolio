'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Work', href: '#portfolio' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ hero }: { hero?: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: scrolled ? '10px 32px' : '18px 48px',
      transition: 'padding 0.4s ease',
    }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px',
        background: scrolled ? 'rgba(10,10,15,0.8)' : 'transparent',
        border: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        borderRadius: scrolled ? '50px' : '0',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.4s ease',
        boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
      }}>
        {/* Logo */}
        <a href="#" style={{
          fontFamily: 'var(--font-playfair)', fontWeight: 700, fontSize: 18,
          color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 28, height: 28, background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: 'var(--ink)', fontWeight: 800,
          }}>✦</span>
          {hero?.name?.split(' ')[0] || 'Portfolio'}
        </a>

        {/* Nav Links */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 30, padding: '5px 6px',
          backdropFilter: 'blur(12px)',
        }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href}
              onClick={() => setActive(l.href)}
              style={{
                color: active === l.href ? '#fff' : 'var(--muted)',
                textDecoration: 'none', fontSize: 13, fontWeight: 500,
                padding: '6px 16px', borderRadius: 20, transition: 'all 0.2s',
                background: active === l.href ? 'linear-gradient(135deg, var(--gold), var(--gold-light))' : 'transparent',
              }}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Admin */}
        <Link href="/admin" style={{
          background: 'rgba(201,168,76,0.1)', color: 'var(--gold)',
          border: '1px solid var(--border-gold)', padding: '8px 18px',
          borderRadius: 22, fontSize: 12, fontWeight: 700, textDecoration: 'none',
          transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6,
        }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.background = 'rgba(201,168,76,0.2)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = 'rgba(201,168,76,0.1)';
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" />
          </svg>
          Admin
        </Link>
      </nav>
    </div>
  );
}
