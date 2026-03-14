'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface PortfolioItem {
  _id?: string
  title: string
  description: string
  category: string
  tags: string[]
  mediaUrl: string
  thumbnailUrl: string
  cloudinaryPublicId: string
  cloudinaryThumbnailId: string
  mediaType: 'image' | 'video'
  featured: boolean
  published: boolean
  order: number
  clientName: string
}

const emptyItem: PortfolioItem = {
  title: '', description: '', category: 'image', tags: [],
  mediaUrl: '', thumbnailUrl: '', cloudinaryPublicId: '', cloudinaryThumbnailId: '',
  mediaType: 'image', featured: false, published: true, order: 0, clientName: '',
}

export function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [form, setForm] = useState<PortfolioItem>(emptyItem)
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tagInput, setTagInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const thumbRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/portfolio')
      const data = await res.json()
      // Ensure data is an array before setting
      if (Array.isArray(data)) {
        setItems(data)
      } else {
        setItems([])
      }
    } catch (error) {
      console.error('Failed to fetch portfolio items:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const uploadFile = async (file: File, isThumb = false) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'portfolio')
    fd.append('resourceType', file.type.startsWith('video') ? 'video' : 'image')

    if (isThumb) setUploadingThumb(true)
    else setUploading(true)

    try {
      console.log('Uploading file:', file.name, 'Type:', file.type)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      
      console.log('Upload response:', { status: res.status, data })
      
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }
      
      if (isThumb) {
        setForm(f => ({ ...f, thumbnailUrl: data.url, cloudinaryThumbnailId: data.publicId }))
      } else {
        setForm(f => ({
          ...f,
          mediaUrl: data.url,
          cloudinaryPublicId: data.publicId,
          mediaType: data.resourceType === 'video' ? 'video' : 'image',
          thumbnailUrl: data.resourceType !== 'video' ? data.url : f.thumbnailUrl,
          cloudinaryThumbnailId: data.resourceType !== 'video' ? data.publicId : f.cloudinaryThumbnailId,
        }))
        toast.success('File uploaded to Cloudinary!')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    }
    setUploading(false)
    setUploadingThumb(false)
  }

  const save = async () => {
    console.log('Save called with form:', { title: form.title, mediaUrl: form.mediaUrl, hasFile: !!form.mediaUrl })
    if (!form.title) { toast.error('Title is required'); return }
    if (!form.mediaUrl) { 
      toast.error('Please upload a file first (click the upload button)'); 
      console.error('mediaUrl is empty. Current form state:', form);
      return 
    }
    const method = form._id ? 'PUT' : 'POST'
    try {
      console.log('Saving portfolio item:', { ...form, method })
      const res = await fetch('/api/admin/portfolio', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (res.ok) {
        const savedItem = await res.json()
        console.log('Portfolio item saved successfully:', savedItem)
        toast.success(form._id ? 'Updated!' : 'Added!')
        setForm(emptyItem)
        setEditing(false)
        fetchItems()
      } else {
        console.error('Save failed with status:', res.status)
        toast.error('Failed to save portfolio item')
      }
    } catch (error) {
      console.error('Failed to save portfolio item:', error)
      toast.error('Failed to save portfolio item')
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item? This will also remove it from Cloudinary.')) return
    try {
      const res = await fetch('/api/admin/portfolio', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id }) 
      })
      if (res.ok) {
        toast.success('Deleted')
        fetchItems()
      } else {
        toast.error('Failed to delete portfolio item')
      }
    } catch (error) {
      console.error('Failed to delete portfolio item:', error)
      toast.error('Failed to delete portfolio item')
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Portfolio</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage your work items ({items.length} total)</p>
        </div>
        <button
          onClick={() => { setForm(emptyItem); setEditing(true) }}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-black"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}
        >
          + Add New Work
        </button>
      </div>

      {/* Add/Edit Form */}
      {editing && (
        <div className="mb-8 p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <h3 className="text-lg font-bold text-white mb-6">{form._id ? 'Edit' : 'Add'} Portfolio Item</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Title *" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)' }} />
            <input placeholder="Client Name" value={form.clientName}
              onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
              className="px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)' }} />
          </div>

          <textarea placeholder="Description" value={form.description} rows={2}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none mb-4"
            style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)' }} />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)' }}>
              {['image','video','branding','motion','print'].map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <input type="number" placeholder="Order (0=first)" value={form.order}
              onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
              className="px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)' }} />
          </div>

          {/* Tags */}
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <input placeholder="Add tag" value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag()}
                className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
                style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)' }} />
              <button onClick={addTag} className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--amber)' }}>
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map(t => (
                <span key={t} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--amber)' }}>
                  {t}
                  <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}>✕</button>
                </span>
              ))}
            </div>
          </div>

          {/* Upload */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--text-muted)' }}>
                📁 Main Media (Image/Video) *
              </label>
              <input type="file" ref={fileRef} accept="image/*,video/*" className="hidden"
                onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="w-full py-4 rounded-xl text-sm font-medium border-dashed border-2 transition-all hover:border-[var(--amber)] flex flex-col items-center gap-2"
                style={{ 
                  borderColor: form.mediaUrl ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.15)', 
                  color: form.mediaUrl ? 'rgba(34,197,94,1)' : 'var(--text-muted)',
                  background: form.mediaUrl ? 'rgba(34,197,94,0.05)' : 'transparent'
                }}>
                <div className="text-2xl">
                  {uploading ? '⏳' : form.mediaUrl ? '✅' : '📤'}
                </div>
                <div>
                  {uploading ? 'Uploading to Cloudinary...' : form.mediaUrl ? 'Media uploaded successfully' : 'Click to upload Image/Video'}
                </div>
                <div className="text-xs opacity-70">
                  Supports: JPG, PNG, GIF, MP4, WebM
                </div>
              </button>
              {form.mediaUrl && (
                <div className="mt-2 p-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(34,197,94,1)' }}>
                    <span>✅</span>
                    <span>{form.mediaType === 'video' ? 'Video uploaded' : 'Image uploaded'}</span>
                    {form.mediaType === 'video' && form.thumbnailUrl && <span>• Thumbnail set</span>}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--text-muted)' }}>
                🖼️ Video Thumbnail (videos only)
              </label>
              <input type="file" ref={thumbRef} accept="image/*" className="hidden"
                onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], true)} />
              <button onClick={() => thumbRef.current?.click()} disabled={uploadingThumb}
                className="w-full py-4 rounded-xl text-sm font-medium border-dashed border-2 transition-all hover:border-[var(--amber)] flex flex-col items-center gap-2"
                style={{ 
                  borderColor: form.thumbnailUrl && form.mediaType === 'video' ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.15)', 
                  color: form.thumbnailUrl && form.mediaType === 'video' ? 'rgba(34,197,94,1)' : 'var(--text-muted)',
                  background: form.thumbnailUrl && form.mediaType === 'video' ? 'rgba(34,197,94,0.05)' : 'transparent'
                }}>
                <div className="text-2xl">
                  {uploadingThumb ? '⏳' : form.thumbnailUrl && form.mediaType === 'video' ? '✅' : '🖼️'}
                </div>
                <div>
                  {uploadingThumb ? 'Uploading...' : form.thumbnailUrl && form.mediaType === 'video' ? 'Thumbnail uploaded' : 'Upload thumbnail for video'}
                </div>
                <div className="text-xs opacity-70">
                  Required for videos
                </div>
              </button>
            </div>
          </div>

          {/* Preview */}
          {form.mediaUrl && (
            <div className="mb-4 rounded-xl overflow-hidden" style={{ maxHeight: '200px' }}>
              {form.mediaType === 'video' ? (
                <video src={form.mediaUrl} className="w-full object-cover" style={{ maxHeight: '200px' }} />
              ) : (
                <Image src={form.mediaUrl} alt="Preview" width={400} height={200} className="w-full object-cover" style={{ maxHeight: '200px' }} />
              )}
            </div>
          )}

          {/* Toggles */}
          <div className="flex gap-6 mb-6">
            {[
              { key: 'featured', label: 'Featured' },
              { key: 'published', label: 'Published' },
            ].map(t => (
              <label key={t.key} className="flex items-center gap-2 cursor-pointer">
                <div
                  className="w-10 h-5 rounded-full relative transition-colors"
                  style={{ background: form[t.key as keyof PortfolioItem] ? 'var(--amber)' : 'rgba(255,255,255,0.1)' }}
                  onClick={() => setForm(f => ({ ...f, [t.key]: !f[t.key as keyof PortfolioItem] }))}
                >
                  <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all"
                    style={{ left: form[t.key as keyof PortfolioItem] ? '22px' : '2px' }} />
                </div>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{t.label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={save} className="px-6 py-2.5 rounded-xl text-sm font-bold text-black"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}>
              {form._id ? 'Update' : 'Save'} Item
            </button>
            <button onClick={() => { setEditing(false); setForm(emptyItem) }}
              className="px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="aspect-square rounded-2xl skeleton" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <div className="text-5xl mb-4">🎨</div>
          <p>No portfolio items yet. Add your first work above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item._id} className="rounded-2xl overflow-hidden group relative hover-lift"
              style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.thumbnailUrl || item.mediaUrl || '/placeholder.jpg'}
                  alt={item.title}
                  fill className="object-cover" />
                {item.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(245,158,11,0.9)' }}>
                      ▶
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                  style={{ background: 'rgba(0,0,0,0.7)' }}>
                  <button onClick={() => { setForm(item); setEditing(true) }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-black"
                    style={{ background: 'var(--amber)' }}>
                    Edit
                  </button>
                  <button onClick={() => deleteItem(item._id!)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                    style={{ background: '#f43f5e' }}>
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs" style={{ color: 'var(--amber)' }}>{item.category}</span>
                  {!item.published && <span className="text-xs text-red-400">Hidden</span>}
                  {item.featured && <span className="text-xs" style={{ color: 'var(--amber)' }}>★ Featured</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
