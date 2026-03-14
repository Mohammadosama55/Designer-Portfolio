'use client'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { PortfolioManager } from './PortfolioManager'
import { TestimonialsManager } from './TestimonialsManager'
import { MessagesManager } from './MessagesManager'
import { ContentEditor } from './ContentEditor'
import { SettingsManager } from './SettingsManager'

interface Stats {
  portfolioCount: number
  testimonialCount: number
  messageCount: number
  unreadCount: number
}

const navItems = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'portfolio', icon: '🎨', label: 'Portfolio' },
  { id: 'content', icon: '✏️', label: 'Content' },
  { id: 'testimonials', icon: '⭐', label: 'Testimonials' },
  { id: 'messages', icon: '✉️', label: 'Messages' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
]

export function AdminDashboard({ stats }: { stats: Stats }) {
  const [activeSection, setActiveSection] = useState('overview')

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col py-6 px-4"
        style={{ background: 'var(--surface)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-black"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)', fontFamily: 'var(--font-display)' }}>
            AR
          </div>
          <div>
            <div className="text-sm font-bold text-white">Admin Panel</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Portfolio CMS</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeSection === item.id ? 'rgba(245,158,11,0.15)' : 'transparent',
                color: activeSection === item.id ? 'var(--amber)' : 'var(--text-muted)',
                border: activeSection === item.id ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
              }}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {item.id === 'messages' && stats.unreadCount > 0 && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ background: 'var(--rose)', color: '#fff' }}>
                  {stats.unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="space-y-2 mt-4">
          <a
            href="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
            style={{ color: 'var(--text-muted)' }}
          >
            <span>👁️</span> View Site
          </a>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-red-500/10"
            style={{ color: '#f43f5e' }}
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">
        {activeSection === 'overview' && <OverviewSection stats={stats} onNavigate={setActiveSection} />}
        {activeSection === 'portfolio' && <PortfolioManager />}
        {activeSection === 'content' && <ContentEditor />}
        {activeSection === 'testimonials' && <TestimonialsManager />}
        {activeSection === 'messages' && <MessagesManager />}
        {activeSection === 'settings' && <SettingsManager />}
      </main>
    </div>
  )
}

function OverviewSection({ stats, onNavigate }: { stats: Stats; onNavigate: (s: string) => void }) {
  const cards = [
    { label: 'Portfolio Items', value: stats.portfolioCount, icon: '🎨', section: 'portfolio', color: '#f59e0b' },
    { label: 'Testimonials', value: stats.testimonialCount, icon: '⭐', section: 'testimonials', color: '#a78bfa' },
    { label: 'Messages', value: stats.messageCount, icon: '✉️', section: 'messages', color: '#34d399' },
    { label: 'Unread', value: stats.unreadCount, icon: '🔔', section: 'messages', color: '#f43f5e' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Dashboard</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <button
            key={c.label}
            onClick={() => onNavigate(c.section)}
            className="p-5 rounded-2xl text-left hover-lift"
            style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="text-2xl mb-3">{c.icon}</div>
            <div className="text-3xl font-black mb-1" style={{ color: c.color, fontFamily: 'var(--font-display)' }}>
              {c.value}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.label}</div>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-base font-bold text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '+ Add Portfolio Item', section: 'portfolio' },
            { label: '✏️ Edit Hero Content', section: 'content' },
            { label: '+ Add Testimonial', section: 'testimonials' },
            { label: '📩 View Messages', section: 'messages' },
          ].map(a => (
            <button
              key={a.label}
              onClick={() => onNavigate(a.section)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[var(--amber)]/10"
              style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
