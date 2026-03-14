'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [pw, setPw] = useState({ current: '', newPass: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  async function changePassword() {
    if (!pw.current || !pw.newPass) { toast.error('Fill all fields'); return; }
    if (pw.newPass !== pw.confirm) { toast.error('New passwords do not match'); return; }
    if (pw.newPass.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    const res = await fetch('/api/admin/auth/change-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.newPass }),
    });
    if (res.ok) { toast.success('Password changed!'); setPw({ current: '', newPass: '', confirm: '' }); }
    else { const d = await res.json(); toast.error(d.error || 'Failed'); }
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 700, marginBottom: 32 }}>Settings</h1>

      <div className="glass" style={{ borderRadius: 16, padding: 24, maxWidth: 480 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)', marginBottom: 20 }}>Change Password</h2>
        {[
          ['current', 'Current Password', pw.current],
          ['newPass', 'New Password', pw.newPass],
          ['confirm', 'Confirm New Password', pw.confirm],
        ].map(([key, label, value]) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>{label}</label>
            <input className="input-dark" type="password" placeholder="••••••••" value={value as string}
              onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))} />
          </div>
        ))}
        <button className="btn-gold" onClick={changePassword} disabled={saving}>{saving ? 'Saving...' : 'Change Password'}</button>
      </div>
    </div>
  );
}
