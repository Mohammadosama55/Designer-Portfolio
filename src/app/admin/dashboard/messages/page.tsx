'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => { fetchMessages(); }, []);

  async function fetchMessages() {
    const res = await fetch('/api/admin/messages');
    const data = await res.json();
    setMessages(data.messages || []);
    setLoading(false);
  }

  async function markRead(id: string) {
    await fetch(`/api/admin/messages/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read: true }) });
    fetchMessages();
  }

  async function deleteMsg(id: string) {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    toast.success('Deleted');
    setSelected(null);
    fetchMessages();
  }

  function openMessage(msg: any) {
    setSelected(msg);
    if (!msg.read) markRead(msg._id);
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Messages</h1>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 32 }}>Contact form submissions</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* List */}
        <div>
          {loading ? (
            <div style={{ color: 'var(--muted)', padding: '40px 0', textAlign: 'center' }}>Loading...</div>
          ) : messages.length === 0 ? (
            <div style={{ color: 'var(--muted)', padding: '60px 0', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 16 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✉</div>
              No messages yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map((msg: any) => (
                <div key={msg._id} onClick={() => openMessage(msg)} className="hover-lift" style={{
                  padding: '16px', borderRadius: 12, cursor: 'pointer',
                  background: selected?._id === msg._id ? 'var(--gold-dim)' : 'var(--surface)',
                  border: selected?._id === msg._id ? '1px solid var(--border-gold)' : '1px solid var(--border)',
                  transition: 'all 0.2s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: msg.read ? 400 : 700, fontSize: 14 }}>{msg.name}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {!msg.read && (
                        <span style={{ width: 8, height: 8, background: 'var(--gold)', borderRadius: '50%', display: 'block' }} />
                      )}
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{msg.email}</div>
                  <div style={{ fontSize: 13, color: 'var(--soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.subject || msg.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div>
          {selected ? (
            <div className="glass" style={{ borderRadius: 16, padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 700 }}>{selected.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--gold)', marginTop: 4 }}>{selected.email}</div>
                </div>
                <button onClick={() => deleteMsg(selected._id)} style={{
                  padding: '6px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444', borderRadius: 8, cursor: 'pointer', fontSize: 12,
                }}>Delete</button>
              </div>
              {selected.subject && (
                <div style={{
                  fontSize: 13, color: 'var(--soft)', marginBottom: 16, padding: '8px 12px',
                  background: 'rgba(255,255,255,0.04)', borderRadius: 8,
                }}>
                  <strong>Subject:</strong> {selected.subject}
                </div>
              )}
              <div style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--soft)' }}>{selected.message}</div>
              <div style={{ marginTop: 20, fontSize: 11, color: 'var(--muted)' }}>
                Received: {new Date(selected.createdAt).toLocaleString()}
              </div>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                className="btn-gold" style={{ textDecoration: 'none', display: 'inline-block', marginTop: 20, fontSize: 13 }}>
                ↗ Reply via Email
              </a>
            </div>
          ) : (
            <div style={{
              height: '100%', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--muted)', fontSize: 14, border: '1px dashed var(--border)', borderRadius: 16,
            }}>
              Select a message to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
