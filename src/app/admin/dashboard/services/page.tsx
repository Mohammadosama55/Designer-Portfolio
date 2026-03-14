'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const emptyService = { title: '', description: '', icon: '✦', features: [''], published: true };

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>(emptyService);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch('/api/admin/services').then(r => r.json()).then(d => setServices(d.services || [])); }, []);

  async function saveService() {
    setSaving(true);
    const res = await fetch('/api/admin/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { toast.success('Service added!'); setShowForm(false); setForm(emptyService); const data = await res.json(); setServices(p => [data.service, ...p]); }
    else toast.error('Failed');
    setSaving(false);
  }

  async function deleteService(id: string) {
    if (!confirm('Delete?')) return;
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    setServices(p => p.filter(s => s._id !== id));
    toast.success('Deleted');
  }

  async function toggle(id: string, published: boolean) {
    await fetch(`/api/admin/services/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: !published }) });
    setServices(p => p.map(s => s._id === id ? { ...s, published: !published } : s));
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 700 }}>Services</h1>
        <button className="btn-gold" onClick={() => setShowForm(!showForm)}>{showForm ? '✕ Cancel' : '+ Add Service'}</button>
      </div>

      {showForm && (
        <div className="glass" style={{ borderRadius: 16, padding: 24, marginBottom: 24, border: '1px solid var(--border-gold)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)', marginBottom: 20 }}>New Service</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Title</label>
              <input className="input-dark" value={form.title} onChange={e => setForm((p: any) => ({ ...p, title: e.target.value }))} placeholder="e.g. Brand Identity" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Icon (emoji)</label>
              <input className="input-dark" value={form.icon} onChange={e => setForm((p: any) => ({ ...p, icon: e.target.value }))} placeholder="✦" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea className="input-dark" rows={3} value={form.description} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Features (one per line)</label>
            <textarea className="input-dark" rows={4} value={form.features.join('\n')} onChange={e => setForm((p: any) => ({ ...p, features: e.target.value.split('\n') }))} placeholder="Logo Design&#10;Brand Guidelines&#10;Color Palette" style={{ resize: 'vertical' }} />
          </div>
          <button className="btn-gold" onClick={saveService} disabled={saving}>{saving ? 'Saving...' : '+ Add Service'}</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {services.map(s => (
          <div key={s._id} className="glass" style={{ borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-playfair)', marginBottom: 6 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>{s.description}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggle(s._id, s.published)} style={{
                flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                background: s.published ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                border: s.published ? '1px solid rgba(34,197,94,0.3)' : '1px solid var(--border)',
                color: s.published ? '#22c55e' : 'var(--muted)',
              }}>{s.published ? '● Shown' : '○ Hidden'}</button>
              <button onClick={() => deleteService(s._id)} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
