'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats);
  }, []);

  const cards = [
    { label: 'Portfolio Items', value: stats?.portfolio ?? '—', icon: '🖼', href: '/admin/dashboard/portfolio', color: '#c9a84c' },
    { label: 'Services', value: stats?.services ?? '—', icon: '⚙', href: '/admin/dashboard/services', color: '#06b6d4' },
    { label: 'Testimonials', value: stats?.testimonials ?? '—', icon: '⭐', href: '/admin/dashboard/testimonials', color: '#22c55e' },
    { label: 'Messages', value: stats?.messages ?? '—', icon: '✉', href: '/admin/dashboard/messages', color: '#f97316' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>
          Welcome back. Here's an overview of your portfolio.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
        {cards.map(card => (
          <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
            <div className="hover-lift glass" style={{ borderRadius: 16, padding: '24px 20px' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${card.color}22`, border: `1px solid ${card.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, marginBottom: 16,
              }}>
                {card.icon}
              </div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: card.color }}>
                {card.value}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Upload New Work', href: '/admin/dashboard/portfolio', icon: '➕', desc: 'Add video or image to portfolio' },
          { label: 'Edit Hero', href: '/admin/dashboard/hero', icon: '✦', desc: 'Update name, bio, showreel' },
          { label: 'Read Messages', href: '/admin/dashboard/messages', icon: '✉', desc: 'View contact form submissions' },
        ].map(a => (
          <Link key={a.label} href={a.href} style={{ textDecoration: 'none' }}>
            <div className="hover-lift glass" style={{ borderRadius: 14, padding: '20px' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{a.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{a.label}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{a.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
