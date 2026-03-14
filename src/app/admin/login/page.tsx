'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      console.log('=== LOGIN ATTEMPT ===')
      console.log('Email:', email)
      console.log('Password:', password ? '***' : '(empty)')
      
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important: include credentials for cookies
      })

      const data = await res.json()
      console.log('=== LOGIN RESPONSE ===')
      console.log('Status:', res.status)
      console.log('Data:', data)
      console.log('Headers:', Object.fromEntries(res.headers.entries()))
      
      // Check if cookie was set
      const cookieHeader = res.headers.get('set-cookie')
      console.log('Set-Cookie header:', cookieHeader ? 'PRESENT' : 'MISSING')
      if (cookieHeader) {
        console.log('Cookie value:', cookieHeader.substring(0, 100) + '...')
      }

      if (res.ok && data.success) {
        toast.success('Login successful!')
        console.log('Login successful, redirecting to /admin')
        
        // Try to get the token from cookie after login
        const checkCookie = () => {
          const token = document.cookie.split(';').find(c => c.includes('admin_token'))
          console.log('Token in cookie after login:', token ? 'FOUND' : 'NOT FOUND')
          if (token) {
            console.log('Token value (first 50 chars):', token.substring(0, 50))
          }
        }
        
        // Small delay to ensure cookie is set
        setTimeout(() => {
          checkCookie()
          console.log('Performing hard redirect to /admin...')
          window.location.href = '/admin'  // Hard redirect — forces browser to re-read cookie
        }, 800)
      } else {
        const errorMsg = data.error || 'Invalid credentials'
        console.error('Login failed:', errorMsg)
        toast.error(errorMsg)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
      <div className="w-full max-w-md p-8 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-black mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)', fontFamily: 'var(--font-display)' }}>
            AR
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)' }}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text)' }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-black disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-3 rounded-lg text-xs" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--amber)' }}>
          <strong>Default Credentials:</strong><br />
          Email: admin@yourdomain.com<br />
          Password: Admin@123456
        </div>
      </div>
    </div>
  )
}

