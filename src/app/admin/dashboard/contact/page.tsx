'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminContact() {
  const [info, setInfo] = useState({ email: '', phone: '', location: '', availability: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/contact-info').then(r => r.json()).then(d => {
      if (d.contactInfo) setInfo(d.contactInfo);
    });
  }, []);

  async function save() {
    setSaving(true);
    const res = await fetch('/api/admin/contact-info', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(info) });
    if (res.ok) toast.success('Contact info saved!');
    else toast.error('Save failed');
    setSaving(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 700 }}>Contact Info</h1>
        <button className="btn-gold" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
      </div>
      <div className="glass" style={{ borderRadius: 16, padding: 24, maxWidth: 600 }}>
        {[
          ['email', 'Email Address', 'your@email.com'],
          ['phone', 'Phone Number', '+1 (555) 000-0000'],
          ['location', 'Location', 'New York, USA'],
          ['availability', 'Availability Status', 'Available for freelance'],
        ].map(([key, label, placeholder]) => (
          <div key={key} style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>{label}</label>
            <input className="input-dark" value={(info as any)[key] || ''} onChange={e => setInfo(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} />
          </div>
        ))}
      </div>
    </div>
  );
}
