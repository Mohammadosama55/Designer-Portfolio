'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'

export function ContentEditor() {
  const [activeTab, setActiveTab] = useState('hero')
  const [heroData, setHeroData] = useState<Record<string, unknown>>({})
  const [aboutData, setAboutData] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [heroRes, aboutRes] = await Promise.all([
          fetch('/api/admin/content?section=hero'),
          fetch('/api/admin/content?section=about')
        ])
        const heroData = await heroRes.json()
        const aboutData = await aboutRes.json()
        setHeroData(heroData || {})
        setAboutData(aboutData || {})
      } catch (error) {
        console.error('Failed to fetch content:', error)
        setHeroData({})
        setAboutData({})
      }
    }
    fetchContent()
  }, [])

  const saveSection = async (section: string, data: Record<string, unknown>) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      })
      if (res.ok) {
        toast.success(`${section} section saved!`)
      } else {
        toast.error('Save failed')
      }
    } catch (error) {
      console.error('Failed to save content:', error)
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'hero', label: '🏠 Hero' },
    { id: 'about', label: '👤 About' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Content Editor</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Edit all text content on your portfolio site</p>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeTab === t.id ? 'rgba(245,158,11,0.15)' : 'var(--surface)',
              color: activeTab === t.id ? 'var(--amber)' : 'var(--text-muted)',
              border: activeTab === t.id ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.06)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'hero' && (
        <HeroEditor data={heroData} setData={setHeroData} onSave={() => saveSection('hero', heroData)} saving={saving} />
      )}
      {activeTab === 'about' && (
        <AboutEditor data={aboutData} setData={setAboutData} onSave={() => saveSection('about', aboutData)} saving={saving} />
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-4 py-3 rounded-xl text-sm outline-none"
const inputStyle = { background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)' }

function HeroEditor({ data, setData, onSave, saving }: {
  data: Record<string, unknown>; setData: (d: Record<string, unknown>) => void
  onSave: () => void; saving: boolean
}) {
  const set = (key: string, val: unknown) => setData({ ...data, [key]: val })
  const stats = (data.stats as {value:string;label:string}[]) || [{value:'',label:''},{value:'',label:''},{value:'',label:''}]
  
  // Upload states
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false)
  const [uploadingShowreel, setUploadingShowreel] = useState(false)
  const heroImageRef = useRef<HTMLInputElement>(null)
  const showreelRef = useRef<HTMLInputElement>(null)

  const uploadHeroImage = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'hero')
    fd.append('resourceType', 'image')

    setUploadingHeroImage(true)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const uploadData = await res.json()
      if (res.ok) {
        set('heroImageUrl', uploadData.url)
        toast.success('Hero image uploaded!')
      } else {
        toast.error('Upload failed')
      }
    } catch {
      toast.error('Upload failed')
    }
    setUploadingHeroImage(false)
  }

  const uploadShowreel = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'showreel')
    fd.append('resourceType', 'video')

    setUploadingShowreel(true)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const uploadData = await res.json()
      if (res.ok) {
        set('showreel', uploadData.url)
        toast.success('Showreel uploaded!')
      } else {
        toast.error('Upload failed')
      }
    } catch {
      toast.error('Upload failed')
    }
    setUploadingShowreel(false)
  }

  return (
    <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="grid md:grid-cols-2 gap-x-6">
        <Field label="Your Name">
          <input className={inputCls} style={inputStyle} value={(data.name as string) || ''} onChange={e => set('name', e.target.value)} placeholder="Alex Rivera" />
        </Field>
        <Field label="Job Title">
          <input className={inputCls} style={inputStyle} value={(data.title as string) || ''} onChange={e => set('title', e.target.value)} placeholder="Visual Designer & Motion Artist" />
        </Field>
      </div>

      <Field label="Hero Description">
        <textarea className={`${inputCls} resize-none`} style={inputStyle} rows={3}
          value={(data.description as string) || ''} onChange={e => set('description', e.target.value)}
          placeholder="A brief description about yourself..." />
      </Field>

      <Field label="Hero Image">
        <div className="space-y-2">
          <input type="file" ref={heroImageRef} accept="image/*" className="hidden"
            onChange={e => e.target.files?.[0] && uploadHeroImage(e.target.files[0])} />
          <button onClick={() => heroImageRef.current?.click()} disabled={uploadingHeroImage}
            className="w-full py-3 rounded-xl text-sm font-medium border-dashed border-2 transition-all hover:border-[var(--amber)] flex flex-col items-center gap-2"
            style={{ 
              borderColor: data.heroImageUrl ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.15)', 
              color: data.heroImageUrl ? 'rgba(34,197,94,1)' : 'var(--text-muted)',
              background: data.heroImageUrl ? 'rgba(34,197,94,0.05)' : 'transparent'
            }}>
            <div className="text-2xl">
              {uploadingHeroImage ? '⏳' : data.heroImageUrl ? '✅' : '🖼️'}
            </div>
            <div>
              {uploadingHeroImage ? 'Uploading...' : data.heroImageUrl ? 'Hero image uploaded' : 'Click to upload hero image'}
            </div>
            <div className="text-xs opacity-70">
              Supports: JPG, PNG, GIF
            </div>
          </button>
          {typeof data.heroImageUrl === 'string' && data.heroImageUrl && (
            <div className="mt-2 p-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(34,197,94,1)' }}>
                <span>✅</span>
                <span>Hero image uploaded successfully</span>
              </div>
            </div>
          )}
          {/* Preview */}
          {typeof data.heroImageUrl === 'string' && data.heroImageUrl && (
            <div className="mt-2 rounded-xl overflow-hidden" style={{ maxHeight: '150px' }}>
              <Image src={data.heroImageUrl} alt="Hero preview" width={400} height={150} className="w-full object-cover" style={{ maxHeight: '150px' }} />
            </div>
          )}
        </div>
      </Field>

      <Field label="Showreel Video">
        <div className="space-y-2">
          <input type="file" ref={showreelRef} accept="video/*" className="hidden"
            onChange={e => e.target.files?.[0] && uploadShowreel(e.target.files[0])} />
          <button onClick={() => showreelRef.current?.click()} disabled={uploadingShowreel}
            className="w-full py-3 rounded-xl text-sm font-medium border-dashed border-2 transition-all hover:border-[var(--amber)] flex flex-col items-center gap-2"
            style={{ 
              borderColor: data.showreel ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.15)', 
              color: data.showreel ? 'rgba(34,197,94,1)' : 'var(--text-muted)',
              background: data.showreel ? 'rgba(34,197,94,0.05)' : 'transparent'
            }}>
            <div className="text-2xl">
              {uploadingShowreel ? '⏳' : data.showreel ? '✅' : '🎬'}
            </div>
            <div>
              {uploadingShowreel ? 'Uploading...' : data.showreel ? 'Showreel uploaded' : 'Click to upload showreel video'}
            </div>
            <div className="text-xs opacity-70">
              Supports: MP4, WebM, MOV
            </div>
          </button>
          {typeof data.showreel === 'string' && data.showreel && (
            <div className="mt-2 p-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(34,197,94,1)' }}>
                <span>✅</span>
                <span>Showreel video uploaded successfully</span>
              </div>
            </div>
          )}
          {/* Preview */}
          {typeof data.showreel === 'string' && data.showreel && (
            <div className="mt-2 rounded-xl overflow-hidden" style={{ maxHeight: '150px' }}>
              <video src={data.showreel} className="w-full object-cover" style={{ maxHeight: '150px' }} controls />
            </div>
          )}
        </div>
      </Field>

      <div className="mb-4">
        <label className="text-xs font-semibold uppercase tracking-wider block mb-3" style={{ color: 'var(--text-muted)' }}>Stats</label>
        {stats.map((s, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 mb-2">
            <input className={inputCls} style={inputStyle} value={s.value} placeholder="120+"
              onChange={e => { const n = [...stats]; n[i].value = e.target.value; set('stats', n) }} />
            <input className={inputCls} style={inputStyle} value={s.label} placeholder="Projects Done"
              onChange={e => { const n = [...stats]; n[i].label = e.target.value; set('stats', n) }} />
          </div>
        ))}
      </div>

      <Field label="Social Links">
        <div className="space-y-2">
          {['instagram','behance','dribbble','linkedin'].map(s => (
            <div key={s} className="flex items-center gap-3">
              <span className="text-xs font-semibold w-20 capitalize" style={{ color: 'var(--text-muted)' }}>{s}</span>
              <input className={`${inputCls} flex-1`} style={inputStyle}
                value={((data.socials as Record<string,string>) || {})[s] || ''}
                placeholder={`https://${s}.com/...`}
                onChange={e => set('socials', { ...((data.socials as Record<string,string>) || {}), [s]: e.target.value })} />
            </div>
          ))}
        </div>
      </Field>

      <label className="flex items-center gap-3 mb-6 cursor-pointer">
        <div className="w-10 h-5 rounded-full relative transition-colors"
          style={{ background: data.availableForWork ? 'var(--amber)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => set('availableForWork', !data.availableForWork)}>
          <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all"
            style={{ left: data.availableForWork ? '22px' : '2px' }} />
        </div>
        <span className="text-sm text-white">Show &ldquo;Available for Work&rdquo; badge</span>
      </label>

      <button onClick={onSave} disabled={saving}
        className="px-6 py-3 rounded-xl text-sm font-bold text-black disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}>
        {saving ? 'Saving...' : 'Save Hero Content'}
      </button>
    </div>
  )
}

function AboutEditor({ data, setData, onSave, saving }: {
  data: Record<string, unknown>; setData: (d: Record<string, unknown>) => void
  onSave: () => void; saving: boolean
}) {
  const set = (key: string, val: unknown) => setData({ ...data, [key]: val })
  const [skillInput, setSkillInput] = useState('')
  const skills = (data.skills as string[]) || []

  const addSkill = () => {
    if (skillInput.trim()) {
      set('skills', [...skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  return (
    <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <Field label="Bio / About Text">
        <textarea className={`${inputCls} resize-none`} style={inputStyle} rows={4}
          value={(data.bio as string) || ''} onChange={e => set('bio', e.target.value)}
          placeholder="Tell visitors about yourself..." />
      </Field>

      <div className="grid md:grid-cols-2 gap-x-6">
        <Field label="Experience">
          <input className={inputCls} style={inputStyle} value={(data.experience as string) || ''} onChange={e => set('experience', e.target.value)} placeholder="5+ Years" />
        </Field>
        <Field label="Location">
          <input className={inputCls} style={inputStyle} value={(data.location as string) || ''} onChange={e => set('location', e.target.value)} placeholder="Mumbai, India" />
        </Field>
        <Field label="Email">
          <input className={inputCls} style={inputStyle} value={(data.email as string) || ''} onChange={e => set('email', e.target.value)} placeholder="hello@yoursite.com" />
        </Field>
        <Field label="Resume URL">
          <input className={inputCls} style={inputStyle} value={(data.resumeUrl as string) || ''} onChange={e => set('resumeUrl', e.target.value)} placeholder="https://..." />
        </Field>
      </div>

      <Field label="Skills / Tools">
        <div className="flex gap-2 mb-3">
          <input className={`${inputCls} flex-1`} style={inputStyle} value={skillInput}
            onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()}
            placeholder="Add a skill..." />
          <button onClick={addSkill} className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--amber)' }}>
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((s, i) => (
            <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs"
              style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.2)' }}>
              {s}
              <button onClick={() => set('skills', skills.filter((_, j) => j !== i))}>✕</button>
            </span>
          ))}
        </div>
      </Field>

      <button onClick={onSave} disabled={saving}
        className="px-6 py-3 rounded-xl text-sm font-bold text-black disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}>
        {saving ? 'Saving...' : 'Save About Content'}
      </button>
    </div>
  )
}
