'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export default function AdminAbout() {
  const [about, setAbout] = useState<any>({ bio: '', bio2: '', experience: '', projects: '', clients: '', skills: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchAbout(); }, []);

  async function fetchAbout() {
    const res = await fetch('/api/admin/about');
    const data = await res.json();
    if (data.about) setAbout(data.about);
    setLoading(false);
  }

  async function save() {
    setSaving(true);
    const res = await fetch('/api/admin/about', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(about),
    });
    if (res.ok) toast.success('About section saved!');
    else toast.error('Save failed');
    setSaving(false);
  }

  async function uploadImage(file: File) {
    setUploadingImg(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', 'about');
    const res = await fetch('/api/admin/about/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) {
      setAbout((p: any) => ({ ...p, imageUrl: data.url, imagePublicId: data.publicId }));
      toast.success('Image uploaded!');
    } else toast.error('Upload failed');
    setUploadingImg(false);
  }

  const addSkill = () => setAbout((p: any) => ({ ...p, skills: [...(p.skills || []), { name: '', level: 80 }] }));
  const updateSkill = (i: number, field: string, value: any) =>
    setAbout((p: any) => ({ ...p, skills: p.skills.map((s: any, j: number) => j === i ? { ...s, [field]: value } : s) }));
  const removeSkill = (i: number) =>
    setAbout((p: any) => ({ ...p, skills: p.skills.filter((_: any, j: number) => j !== i) }));

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 700 }}>About Section</h1>
        <button className="btn-gold" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
      </div>

      <div style={{ display: 'grid', gap: 20 }}>
        {/* Bio */}
        <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)', marginBottom: 20 }}>Bio</h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Primary Bio</label>
            <textarea className="input-dark" rows={4} value={about.bio || ''} onChange={e => setAbout((p: any) => ({ ...p, bio: e.target.value }))} style={{ resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Secondary Bio (optional)</label>
            <textarea className="input-dark" rows={3} value={about.bio2 || ''} onChange={e => setAbout((p: any) => ({ ...p, bio2: e.target.value }))} style={{ resize: 'vertical' }} />
          </div>
        </div>

        {/* Stats + Photo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)', marginBottom: 20 }}>Stats</h2>
            {[['experience', 'Years Experience (e.g. 5+)'], ['projects', 'Projects Done (e.g. 200+)'], ['clients', 'Happy Clients (e.g. 80+)']].map(([key, label]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>{label}</label>
                <input className="input-dark" value={about[key] || ''} onChange={e => setAbout((p: any) => ({ ...p, [key]: e.target.value }))} placeholder={label} />
              </div>
            ))}
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)', marginBottom: 20 }}>Profile Photo</h2>
            {about.imageUrl && <img src={about.imageUrl} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 12 }} />}
            <button className="btn-outline" style={{ width: '100%', fontSize: 13 }} onClick={() => imgRef.current?.click()} disabled={uploadingImg}>
              {uploadingImg ? 'Uploading...' : '↑ Upload Photo'}
            </button>
            <input ref={imgRef} type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} style={{ display: 'none' }} />
          </div>
        </div>

        {/* Skills */}
        <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)' }}>Skills</h2>
            <button onClick={addSkill} className="btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>+ Add Skill</button>
          </div>
          {(about.skills || []).map((skill: any, i: number) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 40px', gap: 10, marginBottom: 10, alignItems: 'center' }}>
              <input className="input-dark" placeholder="Skill name" value={skill.name} onChange={e => updateSkill(i, 'name', e.target.value)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="range" min={0} max={100} value={skill.level} onChange={e => updateSkill(i, 'level', Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--gold)' }} />
                <span style={{ fontSize: 12, color: 'var(--gold)', minWidth: 28 }}>{skill.level}%</span>
              </div>
              <button onClick={() => removeSkill(i)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 8, cursor: 'pointer', padding: '6px 10px', fontSize: 13 }}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
