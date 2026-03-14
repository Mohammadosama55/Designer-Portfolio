'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface Testimonial {
  _id?: string
  name: string
  role: string
  company: string
  text: string
  rating: number
  approved: boolean
  featured: boolean
}

const emptyT: Testimonial = { name: '', role: '', company: '', text: '', rating: 5, approved: true, featured: false }

export function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [form, setForm] = useState<Testimonial>(emptyT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/admin/testimonials')
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch testimonials:', error)
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  const save = async () => {
    if (!form.name || !form.text) { toast.error('Name and review required'); return }
    const method = form._id ? 'PUT' : 'POST'
    try {
      const res = await fetch('/api/admin/testimonials', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success(form._id ? 'Updated!' : 'Added!')
        setForm(emptyT)
        const updatedItems = await fetch('/api/admin/testimonials').then(r => r.json())
        setItems(Array.isArray(updatedItems) ? updatedItems : [])
      } else {
        toast.error('Failed to save testimonial')
      }
    } catch (error) {
      console.error('Failed to save testimonial:', error)
      toast.error('Failed to save testimonial')
    }
  }

  const toggle = async (item: Testimonial) => {
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, approved: !item.approved }),
      })
      if (res.ok) {
        const updatedItems = await fetch('/api/admin/testimonials').then(r => r.json())
        setItems(Array.isArray(updatedItems) ? updatedItems : [])
      } else {
        toast.error('Failed to update testimonial')
      }
    } catch (error) {
      console.error('Failed to toggle testimonial:', error)
      toast.error('Failed to update testimonial')
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    try {
      const res = await fetch('/api/admin/testimonials', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id }) 
      })
      if (res.ok) {
        toast.success('Deleted')
        const updatedItems = await fetch('/api/admin/testimonials').then(r => r.json())
        setItems(Array.isArray(updatedItems) ? updatedItems : [])
      } else {
        toast.error('Failed to delete testimonial')
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error)
      toast.error('Failed to delete testimonial')
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm outline-none"
  const inputStyle = { background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)' }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Testimonials</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage client reviews ({items.length} total)</p>
      </div>

      {/* Add form */}
      <div className="p-6 rounded-2xl mb-8" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-base font-bold text-white mb-4">{form._id ? 'Edit' : 'Add'} Testimonial</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <input placeholder="Client Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} style={inputStyle} />
          <input placeholder="Role / Title" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={inputCls} style={inputStyle} />
          <input placeholder="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className={inputCls} style={inputStyle} />
        </div>
        <textarea placeholder="Review text *" value={form.text} rows={3} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} className={`${inputCls} resize-none mb-4`} style={inputStyle} />
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Rating:</span>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setForm(f => ({ ...f, rating: n }))}
                className="text-xl transition-transform hover:scale-110"
                style={{ color: form.rating >= n ? 'var(--amber)' : 'rgba(255,255,255,0.2)' }}>
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={save} className="px-5 py-2.5 rounded-xl text-sm font-bold text-black"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}>
            {form._id ? 'Update' : 'Add'} Testimonial
          </button>
          {form._id && (
            <button onClick={() => setForm(emptyT)} className="px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl skeleton" />)}</div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item._id} className="p-4 rounded-xl flex items-start gap-4"
              style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm text-black"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}>
                {item.name ? item.name[0].toUpperCase() : '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-semibold text-white">{item.name}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.role} {item.company ? `@ ${item.company}` : ''}</span>
                  <div className="flex gap-0.5">
                    {Array.from({length: item.rating}).map((_, j) => <span key={j} style={{ color: 'var(--amber)', fontSize: '11px' }}>★</span>)}
                  </div>
                </div>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.text}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${item.approved ? 'text-green-400' : 'text-red-400'}`}
                  style={{ background: item.approved ? 'rgba(52,211,153,0.1)' : 'rgba(244,63,94,0.1)' }}>
                  {item.approved ? 'Visible' : 'Hidden'}
                </span>
                <button onClick={() => toggle(item)} className="text-xs px-3 py-1 rounded-lg font-medium"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
                  {item.approved ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => setForm(item)} className="text-xs px-3 py-1 rounded-lg font-medium"
                  style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--amber)' }}>
                  Edit
                </button>
                <button onClick={() => deleteItem(item._id!)} className="text-xs px-3 py-1 rounded-lg font-medium"
                  style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
