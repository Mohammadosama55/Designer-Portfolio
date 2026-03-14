'use client'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a25',
            color: '#f5f0e8',
            border: '1px solid rgba(245,158,11,0.3)',
          },
        }}
      />
    </SessionProvider>
  )
}
