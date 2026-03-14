'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

const CATEGORIES = ['Brand Identity', 'Motion Graphics', 'Video Production', 'Illustration', 'Photography', 'Print', 'Social Media', 'Web Design'];

export default function AdminPortfolio() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: CATEGORIES[0],
    tags: '', featured: false, published: true, mediaType: 'image' as 'image' | 'video',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/portfolio');
      const data = await res.json();
      setItems(data.items || []);
    } catch { toast.error('Failed to load portfolio'); }
    finally { setLoading(false); }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const isVideo = f.type.startsWith('video/');
    setForm(p => ({ ...p, mediaType: isVideo ? 'video' : 'image' }));
  }

  async function handleUpload() {
    if (!file || !form.title) { toast.error('Title and file are required'); return; }
    setUploading(true);
    setUploadProgress(0);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('tags', form.tags);
      fd.append('featured', String(form.featured));
      fd.append('published', String(form.published));
      fd.append('mediaType', form.mediaType);

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(p => Math.min(p + 10, 85));
      }, 400);

      const res = await fetch('/api/admin/portfolio/upload', { method: 'POST', body: fd });
      clearInterval(interval);
      setUploadProgress(100);

      if (res.ok) {
        toast.success('Portfolio item uploaded!');
        setShowForm(false);
        setFile(null);
        setPreview('');
        setForm({ title: '', description: '', category: CATEGORIES[0], tags: '', featured: false, published: true, mediaType: 'image' });
        fetchItems();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Upload failed');
      }
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); setUploadProgress(0); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return;
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Deleted'); fetchItems(); }
      else toast.error('Delete failed');
    } catch { toast.error('Delete failed'); }
  }

  async function togglePublish(id: string, published: boolean) {
    const res = await fetch(`/api/admin/portfolio/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    });
    if (res.ok) { fetchItems(); toast.success(published ? 'Unpublished' : 'Published'); }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 700 }}>Portfolio</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Manage your videos and images</p>
        </div>
        <button className="btn-gold" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Upload New Work'}
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="glass" style={{ borderRadius: 20, padding: '32px', marginBottom: 32, border: '1px solid var(--border-gold)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Upload New Work</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Left - File drop */}
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${file ? 'var(--gold)' : 'var(--border)'}`,
                  borderRadius: 16, padding: '32px 16px', textAlign: 'center',
                  cursor: 'pointer', transition: 'border-color 0.2s',
                  minHeight: 280, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexDirection: 'column', gap: 12,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {preview ? (
                  form.mediaType === 'video' ? (
                    <video src={preview} style={{ maxHeight: 220, borderRadius: 8 }} controls />
                  ) : (
                    <Image src={preview} alt="preview" width={300} height={220}
                      style={{ objectFit: 'contain', borderRadius: 8 }} />
                  )
                ) : (
                  <>
                    <div style={{ fontSize: 40 }}>📁</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Click to upload</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>Images (JPG, PNG, WebP) or Videos (MP4, MOV)</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>Max 100MB</div>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} />

              {/* Progress bar */}
              {uploading && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: 'var(--muted)' }}>Uploading to Cloudinary...</span>
                    <span style={{ color: 'var(--gold)' }}>{uploadProgress}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--border)', borderRadius: 4 }}>
                    <div style={{
                      height: '100%', width: `${uploadProgress}%`, borderRadius: 4,
                      background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              )}
            </div>

            {/* Right - Form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Title *</label>
                <input className="input-dark" placeholder="e.g. Brand Identity for Nike" value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Description</label>
                <textarea className="input-dark" rows={3} placeholder="Brief project description..."
                  value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Category</label>
                <select className="input-dark" value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--soft)', display: 'block', marginBottom: 6 }}>Tags (comma-separated)</label>
                <input className="input-dark" placeholder="branding, logo, minimal" value={form.tags}
                  onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured}
                    onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                    style={{ accentColor: 'var(--gold)' }} />
                  <span style={{ fontSize: 13 }}>Featured</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.published}
                    onChange={e => setForm(p => ({ ...p, published: e.target.checked }))}
                    style={{ accentColor: 'var(--gold)' }} />
                  <span style={{ fontSize: 13 }}>Published</span>
                </label>
              </div>
              <button className="btn-gold" onClick={handleUpload} disabled={uploading} style={{ marginTop: 8 }}>
                {uploading ? `Uploading ${uploadProgress}%...` : '↑ Upload to Cloudinary'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0', color: 'var(--muted)',
          border: '1px dashed var(--border)', borderRadius: 16,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎨</div>
          <p>No portfolio items yet. Upload your first work!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {items.map((item: any) => (
            <div key={item._id} className="glass hover-lift" style={{ borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--surface2)' }}>
                {item.mediaType === 'video' ? (
                  item.thumbnailUrl ? (
                    <Image src={item.thumbnailUrl} alt={item.title} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🎬</div>
                  )
                ) : (
                  <Image src={item.mediaUrl} alt={item.title} fill style={{ objectFit: 'cover' }} />
                )}
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  background: item.mediaType === 'video' ? '#ef4444' : '#3b82f6',
                  color: '#fff', fontSize: 10, fontWeight: 700,
                  padding: '3px 8px', borderRadius: 20, letterSpacing: '0.05em',
                }}>
                  {item.mediaType === 'video' ? '🎬 VIDEO' : '🖼 IMAGE'}
                </div>
                {!item.published && (
                  <div style={{
                    position: 'absolute', top: 8, left: 8,
                    background: 'rgba(0,0,0,0.7)', color: 'var(--muted)',
                    fontSize: 10, padding: '3px 8px', borderRadius: 20,
                  }}>Hidden</div>
                )}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, fontFamily: 'var(--font-playfair)' }}>{item.title}</div>
                <div style={{ fontSize: 11, color: 'var(--gold)', marginBottom: 12 }}>{item.category}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => togglePublish(item._id, item.published)} style={{
                    flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 11, fontWeight: 600,
                    background: item.published ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                    border: item.published ? '1px solid rgba(34,197,94,0.3)' : '1px solid var(--border)',
                    color: item.published ? '#22c55e' : 'var(--muted)', cursor: 'pointer',
                  }}>
                    {item.published ? '● Published' : '○ Hidden'}
                  </button>
                  <button onClick={() => handleDelete(item._id)} style={{
                    padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    color: '#ef4444', cursor: 'pointer',
                  }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
