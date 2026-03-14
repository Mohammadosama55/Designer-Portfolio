export default function Footer({ hero }: { hero?: any }) {
  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      padding: '40px 80px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28,
          background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
          borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: 'var(--ink)', fontWeight: 800,
        }}>✦</div>
        <span style={{ fontFamily: 'var(--font-playfair)', fontWeight: 700 }}>
          {hero?.name || 'Portfolio'}
        </span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--muted)' }}>
        © {new Date().getFullYear()} — All rights reserved
      </p>
      <p style={{ fontSize: 12, color: 'var(--muted)' }}>
        Crafted with passion
      </p>
    </footer>
  );
}
