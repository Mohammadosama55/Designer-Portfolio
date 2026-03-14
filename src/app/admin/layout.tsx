export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout min-h-screen" style={{ background: 'var(--ink)' }}>
      {children}
    </div>
  )
}
