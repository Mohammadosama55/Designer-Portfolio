'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminTestimonials() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', role: '', company: '', text: '', rating: 5 });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetch('/api/admin/testimonials').then(r => r.json()).then(d => setItems(d.testimonials || [])); }, []);

  async function add() {
    if (!form.name || !form.text) { toast.error('Name and review required'); return; }
    const res = await fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, approved: true }) });
    if (res.ok) { const d = await res.json(); setItems(p => [d.testimonial, ...p]); toast.success('Added!'); setShowForm(false); setForm({ name: '', role: '', company: '', text: '', rating: 5 }); }
    else toast.error('Failed');
  }

  async function toggle(id: string, approved: boolean) {
    await fetch(`/api/admin/testimonials/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: !approved }) });
    setItems(p => p.map(t => t._id === id ? { ...t, approved: !approved } : t));
  }

  async function del(id: string) {
    if (!confirm('Delete?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    setItems(p => p.filter(t => t._id !== id));
    toast.success('Deleted');
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 700 }}>Testimonials</h1>
        <button className="btn-gold" onClick={() => setShowForm(!showForm)}>{showForm ? '✕ Cancel' : '+ Add Testimonial'}</button>
      </div>

      {showForm && (
        <div className="glass" style={{ borderRadius: 16, padding: 24, marginBottom: 24, border: '1px solid var(--border-gold)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Name *</label>
              <input className="input-dark" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Client name" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Rating</label>
              <select className="input-dark" value={form.rating} onChange={e => setForm(p => ({ ...p, rating: Number(e.target.value) }))}>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars {'★'.repeat(r)}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Role</label>
              <input className="input-dark" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="CEO, Designer, etc." />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Company</label>
              <input className="input-dark" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Company name" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Review *</label>
            <textarea className="input-dark" rows={4} value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} placeholder="What they said about you..." style={{ resize: 'vertical' }} />
          </div>
          <button className="btn-gold" onClick={add}>+ Add Testimonial</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(t => (
          <div key={t._id} className="glass" style={{ borderRadius: 14, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,var(--gold),var(--gold-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--ink)', flexShrink: 0 }}>
              {t.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: s <= t.rating ? 'var(--gold)' : 'var(--border)', fontSize: 12 }}>★</span>)}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name} {t.role && <span style={{ color: 'var(--muted)', fontWeight: 400 }}>· {t.role}</span>}</div>
              <div style={{ fontSize: 13, color: 'var(--soft)', marginTop: 6, lineHeight: 1.5 }}>"{t.text}"</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => toggle(t._id, t.approved)} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', background: t.approved ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)', border: t.approved ? '1px solid rgba(34,197,94,0.3)' : '1px solid var(--border)', color: t.approved ? '#22c55e' : 'var(--muted)' }}>{t.approved ? '● Shown' : '○ Hidden'}</button>
              <button onClick={() => del(t._id)} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)', border: '1px dashed var(--border)', borderRadius: 16 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⭐</div>
            No testimonials yet
          </div>
        )}
      </div>
    </div>
  );
}
