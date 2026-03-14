'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface AboutData { email?: string; location?: string }

export function ContactSection({ about }: { about: AboutData }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Message sent! I\'ll get back to you soon 🙌')
        setForm({ name: '', email: '', subject: '', message: '' })
      }
    } catch {
      toast.error('Something went wrong')
    }
    setSending(false)
  }

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--amber)' }}>Contact</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Let&apos;s Create<br />
            <span className="gradient-text">Something Great</span>
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
            Have a project in mind? I&apos;d love to hear about it.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Info */}
          <div className="md:col-span-2 space-y-6">
            {about.email && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--amber)' }}>Email</div>
                <a href={`mailto:${about.email}`} className="text-sm hover:text-[var(--amber)] transition-colors" style={{ color: 'var(--text-muted)' }}>
                  {about.email}
                </a>
              </div>
            )}
            {about.location && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--amber)' }}>Location</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{about.location}</div>
              </div>
            )}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--amber)' }}>Response Time</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Within 24 hours</div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name *"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="col-span-2 sm:col-span-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text)',
                }}
              />
              <input
                type="email"
                placeholder="Email address *"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="col-span-2 sm:col-span-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text)',
                }}
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--surface2)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text)',
              }}
            />
            <textarea
              rows={5}
              placeholder="Tell me about your project *"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{
                background: 'var(--surface2)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text)',
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={sending}
              className="w-full py-4 rounded-xl font-bold text-sm text-black transition-all hover:-translate-y-1 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}
            >
              {sending ? 'Sending...' : 'Send Message →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
