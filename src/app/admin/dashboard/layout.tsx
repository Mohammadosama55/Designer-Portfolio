'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const navItems = [
  { id: 'overview', label: 'Overview', icon: '⊞', href: '/admin/dashboard' },
  { id: 'portfolio', label: 'Portfolio', icon: '🖼', href: '/admin/dashboard/portfolio' },
  { id: 'hero', label: 'Hero Section', icon: '✦', href: '/admin/dashboard/hero' },
  { id: 'about', label: 'About', icon: '👤', href: '/admin/dashboard/about' },
  { id: 'services', label: 'Services', icon: '⚙', href: '/admin/dashboard/services' },
  { id: 'testimonials', label: 'Testimonials', icon: '⭐', href: '/admin/dashboard/testimonials' },
  { id: 'messages', label: 'Messages', icon: '✉', href: '/admin/dashboard/messages' },
  { id: 'contact', label: 'Contact Info', icon: '📍', href: '/admin/dashboard/contact' },
  { id: 'settings', label: 'Settings', icon: '🔧', href: '/admin/dashboard/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/admin/auth/me');
      if (!res.ok) router.push('/admin');
    } catch {
      router.push('/admin');
    } finally {
      setChecking(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    toast.success('Logged out');
    router.push('/admin');
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '2px solid rgba(201,168,76,0.2)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ink)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'sticky', top: 0, height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: 'var(--ink)', fontWeight: 800,
            }}>✦</div>
            <div>
              <div style={{ fontSize: 14, fontFamily: 'var(--font-playfair)', fontWeight: 700 }}>Admin</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>Portfolio Manager</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.id} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10, textDecoration: 'none',
                background: active ? 'var(--gold-dim)' : 'transparent',
                border: active ? '1px solid var(--border-gold)' : '1px solid transparent',
                color: active ? 'var(--gold)' : 'var(--soft)',
                fontSize: 13, fontWeight: active ? 600 : 400,
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <Link href="/" target="_blank" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 8, textDecoration: 'none',
            color: 'var(--muted)', fontSize: 12, marginBottom: 8,
          }}>
            🔗 View Portfolio
          </Link>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '8px 12px', borderRadius: 8, background: 'transparent',
            border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer',
            transition: 'color 0.2s',
          }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        {children}
      </main>
    </div>
  );
}
