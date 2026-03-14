'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export default function AdminHero() {
  const [hero, setHero] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingShowreel, setUploadingShowreel] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const showreelRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState([{ value: '', label: '' }]);

  useEffect(() => { fetchHero(); }, []);

  async function fetchHero() {
    const res = await fetch('/api/admin/hero');
    const data = await res.json();
    setHero(data.hero || {});
    setStats(data.hero?.stats?.length ? data.hero.stats : [{ value: '', label: '' }]);
    setLoading(false);
  }

  async function saveHero() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...hero, stats: stats.filter(s => s.value && s.label) }),
      });
      if (res.ok) toast.success('Hero section updated!');
      else toast.error('Save failed');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  }

  async function uploadMedia(file: File, type: 'showreel' | 'photo') {
    const setter = type === 'showreel' ? setUploadingShowreel : setUploadingPhoto;
    setter(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', type);
      const res = await fetch('/api/admin/hero/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        if (type === 'showreel') setHero((p: any) => ({ ...p, showreel: data.url, showreelPublicId: data.publicId }));
        else setHero((p: any) => ({ ...p, profileImageUrl: data.url, profileImagePublicId: data.publicId }));
        toast.success(`${type === 'showreel' ? 'Showreel' : 'Photo'} uploaded!`);
      } else toast.error(data.error || 'Upload failed');
    } catch { toast.error('Upload failed'); }
    finally { setter(false); }
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading...</div>;

  const u = (field: string) => (e: any) => setHero((p: any) => ({ ...p, [field]: e.target.value }));
  const us = (field: string) => (e: any) => setHero((p: any) => ({ ...p, socials: { ...p.socials, [field]: e.target.value } }));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 700 }}>Hero Section</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Edit the main hero/header area</p>
        </div>
        <button className="btn-gold" onClick={saveHero} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: 24 }}>
        {/* Basic Info */}
        <Section title="Basic Information">
          <Row>
            <Field label="Full Name" value={hero.name || ''} onChange={u('name')} placeholder="Alex Rivera" />
            <Field label="Tagline" value={hero.tagline || ''} onChange={u('tagline')} placeholder="Visual Storyteller" />
          </Row>
          <Field label="Description" value={hero.description || ''} onChange={u('description')} multiline rows={3}
            placeholder="Award-winning graphic designer specializing in..." />
          <Row>
            <Field label="CTA Button 1" value={hero.ctaPrimary || ''} onChange={u('ctaPrimary')} placeholder="View Work" />
            <Field label="CTA Button 2" value={hero.ctaSecondary || ''} onChange={u('ctaSecondary')} placeholder="Let's Talk" />
          </Row>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={hero.availableForWork !== false}
              onChange={e => setHero((p: any) => ({ ...p, availableForWork: e.target.checked }))}
              style={{ accentColor: 'var(--gold)', width: 16, height: 16 }} />
            <span style={{ fontSize: 13 }}>Show "Available for work" badge</span>
          </label>
        </Section>

        {/* Stats */}
        <Section title="Stats">
          {stats.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <input className="input-dark" placeholder="Value (e.g. 5+)" value={s.value}
                onChange={e => setStats(p => p.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
                style={{ width: 120 }} />
              <input className="input-dark" placeholder="Label (e.g. Years Experience)" value={s.label}
                onChange={e => setStats(p => p.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                style={{ flex: 1 }} />
              <button onClick={() => setStats(p => p.filter((_, j) => j !== i))} style={{
                padding: '8px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444', borderRadius: 8, cursor: 'pointer', fontSize: 13,
              }}>✕</button>
            </div>
          ))}
          <button onClick={() => setStats(p => [...p, { value: '', label: '' }])} className="btn-outline" style={{ fontSize: 13, padding: '8px 16px' }}>
            + Add Stat
          </button>
        </Section>

        {/* Media */}
        <Section title="Media">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <MediaUploadCard
              label="Profile Photo"
              currentUrl={hero.profileImageUrl}
              type="photo"
              uploading={uploadingPhoto}
              inputRef={photoRef}
              onUpload={(f: File) => uploadMedia(f, 'photo')}
              accept="image/*"
              icon="👤"
            />
            <MediaUploadCard
              label="Hero Showreel (Video)"
              currentUrl={hero.showreel}
              type="showreel"
              uploading={uploadingShowreel}
              inputRef={showreelRef}
              onUpload={(f: File) => uploadMedia(f, 'showreel')}
              accept="video/*"
              icon="🎬"
              isVideo
            />
          </div>
        </Section>

        {/* Socials */}
        <Section title="Social Links">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {(['instagram', 'behance', 'dribbble', 'youtube', 'linkedin', 'vimeo'] as const).map(s => (
              <Field key={s} label={s.charAt(0).toUpperCase() + s.slice(1)}
                value={hero.socials?.[s] || ''} onChange={us(s)}
                placeholder={`https://${s}.com/yourprofile`} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass" style={{ borderRadius: 16, padding: '24px' }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: 'var(--gold)' }}>{title}</h2>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>{children}</div>;
}

function Field({ label, value, onChange, placeholder, multiline, rows }: any) {
  return (
    <div style={{ marginBottom: multiline ? 16 : 0 }}>
      <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>{label}</label>
      {multiline ? (
        <textarea className="input-dark" placeholder={placeholder} value={value} onChange={onChange} rows={rows || 3}
          style={{ resize: 'vertical' }} />
      ) : (
        <input className="input-dark" placeholder={placeholder} value={value} onChange={onChange} />
      )}
    </div>
  );
}

function MediaUploadCard({ label, currentUrl, uploading, inputRef, onUpload, accept, icon, isVideo }: any) {
  return (
    <div>
      <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 8 }}>{label}</label>
      <div style={{
        border: '1px dashed var(--border)', borderRadius: 12, overflow: 'hidden',
        background: 'var(--surface2)', minHeight: 160,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 8, position: 'relative',
      }}>
        {currentUrl ? (
          isVideo ? (
            <video src={currentUrl} style={{ width: '100%', height: 160, objectFit: 'cover' }} muted />
          ) : (
            <img src={currentUrl} alt="" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
          )
        ) : (
          <>
            <span style={{ fontSize: 32 }}>{icon}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>No {label.toLowerCase()} yet</span>
          </>
        )}
      </div>
      <button
        className="btn-outline"
        style={{ width: '100%', marginTop: 10, fontSize: 12, padding: '8px 0' }}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : `↑ Upload ${isVideo ? 'Video' : 'Image'}`}
      </button>
      <input ref={inputRef} type="file" accept={accept}
        onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])} style={{ display: 'none' }} />
    </div>
  );
}
