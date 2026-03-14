'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface Message {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchMessages() }, [])

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages')
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const markRead = async (msg: Message) => {
    if (msg.read) return
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: msg._id }),
      })
      if (res.ok) {
        fetchMessages()
      } else {
        toast.error('Failed to mark message as read')
      }
    } catch (error) {
      console.error('Failed to mark message as read:', error)
      toast.error('Failed to mark message as read')
    }
  }

  const deleteMsg = async (id: string) => {
    if (!confirm('Delete this message?')) return
    try {
      const res = await fetch('/api/admin/messages', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id }) 
      })
      if (res.ok) {
        toast.success('Deleted')
        setSelected(null)
        fetchMessages()
      } else {
        toast.error('Failed to delete message')
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
      toast.error('Failed to delete message')
    }
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Messages</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {messages.length} total · <span style={{ color: unread > 0 ? '#f43f5e' : 'var(--text-muted)' }}>{unread} unread</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* List */}
        <div className="space-y-2">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-16 rounded-xl skeleton" />)
          ) : messages.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
              <div className="text-4xl mb-3">✉️</div>
              <p>No messages yet</p>
            </div>
          ) : messages.map(msg => (
            <div key={msg._id}
              onClick={() => { setSelected(msg); markRead(msg) }}
              className="p-4 rounded-xl cursor-pointer transition-all hover:border-[rgba(245,158,11,0.3)]"
              style={{
                background: selected?._id === msg._id ? 'rgba(245,158,11,0.08)' : 'var(--surface)',
                border: `1px solid ${selected?._id === msg._id ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}`,
              }}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  {!msg.read && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--rose)' }} />}
                  {msg.name}
                </span>
                <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--amber)' }}>{msg.subject}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{msg.message}</p>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div>
          {selected ? (
            <div className="p-6 rounded-2xl h-full"
              style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{selected.subject}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    From: <span className="text-white">{selected.name}</span> · {selected.email}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => deleteMsg(selected._id)} className="text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e' }}>
                  Delete
                </button>
              </div>

              <div className="p-4 rounded-xl mb-6" style={{ background: 'var(--surface2)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{selected.message}</p>
              </div>

              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}>
                Reply via Email →
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
              <div className="text-center">
                <div className="text-4xl mb-3">👆</div>
                <p className="text-sm">Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
