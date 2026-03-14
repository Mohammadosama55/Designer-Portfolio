'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactSection({ contactInfo }: { contactInfo?: any }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Message sent! I'll get back to you soon 🙌");
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error('Failed to send. Please try again.');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" style={{ padding: '120px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
        {/* Left */}
        <div>
          <div className="section-label" style={{ marginBottom: 12 }}>Get In Touch</div>
          <h2 className="section-title" style={{ marginBottom: 24 }}>Let's Create<br /><em>Something Great</em></h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 40 }}>
            Have a project in mind? I'd love to hear about it. Send me a message and let's talk about making it happen.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {contactInfo?.email && (
              <ContactItem icon="✉" label="Email" value={contactInfo.email} />
            )}
            {contactInfo?.phone && (
              <ContactItem icon="📞" label="Phone" value={contactInfo.phone} />
            )}
            {contactInfo?.location && (
              <ContactItem icon="📍" label="Location" value={contactInfo.location} />
            )}
            {contactInfo?.availability && (
              <ContactItem icon="🟢" label="Status" value={contactInfo.availability} />
            )}
          </div>
        </div>

        {/* Form */}
        <div className="glass" style={{ borderRadius: 20, padding: '40px 36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Name *</label>
              <input className="input-dark" placeholder="Your name" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Email *</label>
              <input className="input-dark" placeholder="your@email.com" type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Subject</label>
            <input className="input-dark" placeholder="What's this about?" value={form.subject}
              onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Message *</label>
            <textarea className="input-dark" rows={5} placeholder="Tell me about your project..."
              value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              style={{ resize: 'vertical' }} />
          </div>
          <button className="btn-gold" style={{ width: '100%' }} onClick={handleSubmit} disabled={sending}>
            {sending ? 'Sending...' : 'Send Message →'}
          </button>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'var(--gold-dim)', border: '1px solid var(--border-gold)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}
