'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export function SettingsManager() {
  const [data, setData] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/content?section=settings')
        const data = await res.json()
        setData(data || {})
      } catch (error) {
        console.error('Failed to fetch settings:', error)
        setData({})
      }
    }
    fetchSettings()
  }, [])

  const set = (key: string, val: unknown) => setData(d => ({ ...d, [key]: val }))

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'settings', data }),
      })
      if (res.ok) {
        toast.success('Settings saved!')
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm outline-none"
  const inputStyle = { background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)' }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Settings</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Global site configuration</p>
      </div>

      <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Site Title</label>
            <input className={inputCls} style={inputStyle} value={(data.siteTitle as string) || ''} onChange={e => set('siteTitle', e.target.value)} placeholder="Alex Rivera — Visual Designer" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Logo Text</label>
            <input className={inputCls} style={inputStyle} value={(data.logoText as string) || ''} onChange={e => set('logoText', e.target.value)} placeholder="AR" maxLength={4} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Meta Description</label>
            <textarea className={`${inputCls} resize-none`} style={inputStyle} rows={2}
              value={(data.metaDescription as string) || ''} onChange={e => set('metaDescription', e.target.value)} />
          </div>
        </div>

        <h4 className="text-sm font-bold text-white mb-4">Section Visibility</h4>
        <div className="space-y-3 mb-6">
          {[
            { key: 'showTestimonials', label: 'Show Testimonials Section' },
            { key: 'showContact', label: 'Show Contact Section' },
          ].map(t => (
            <label key={t.key} className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-5 rounded-full relative transition-colors"
                style={{ background: data[t.key] !== false ? 'var(--amber)' : 'rgba(255,255,255,0.1)' }}
                onClick={() => set(t.key, data[t.key] === false ? true : false)}>
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all"
                  style={{ left: data[t.key] !== false ? '22px' : '2px' }} />
              </div>
              <span className="text-sm text-white">{t.label}</span>
            </label>
          ))}
        </div>

        <button onClick={save} disabled={saving}
          className="px-6 py-3 rounded-xl text-sm font-bold text-black disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
