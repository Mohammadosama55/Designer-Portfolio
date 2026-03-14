'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const words = ['Graphic Designer', 'Motion Artist', 'Visual Storyteller', 'Brand Creator'];

export default function HeroSection({ hero }: { hero?: any }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  const name = hero?.name || 'Mohammad osama';
  const description = hero?.description || 'Award-winning graphic designer specializing in brand identity, motion graphics, and cinematic video production.';
  const available = hero?.availableForWork !== false;
  const stats = hero?.stats?.length ? hero.stats : [
    { value: '1+', label: 'Years Experience' },
    { value: '20+', label: 'Projects Done' },
    { value: '18+', label: 'Happy Clients' },
  ];
  const socials = hero?.socials || {};

  useEffect(() => {
    const word = words[wordIdx];
    let i = 0;
    if (typing) {
      const t = setInterval(() => {
        setDisplayed(word.slice(0, ++i));
        if (i >= word.length) { clearInterval(t); setTimeout(() => setTyping(false), 2000); }
      }, 80);
      return () => clearInterval(t);
    } else {
      const t = setInterval(() => {
        setDisplayed(prev => prev.slice(0, -1));
        if (displayed.length <= 1) {
          clearInterval(t);
          setWordIdx(p => (p + 1) % words.length);
          setTyping(true);
        }
      }, 40);
      return () => clearInterval(t);
    }
  }, [wordIdx, typing]);

  return (
    <section id="home" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '130px 80px 80px', minHeight: '100vh',
      gap: 60, position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', left: -200, top: '50%', transform: 'translateY(-50%)',
        width: 700, height: 700,
        background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: -100, top: '20%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Left */}
      <div style={{ flex: 1, maxWidth: 560, zIndex: 1 }}>
        {/* Available badge */}
        {available && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 20, padding: '6px 16px', fontSize: 12, fontWeight: 600,
            color: '#22c55e', marginBottom: 24,
          }}>
            <span className="pulse-dot" />
            Available for new projects
          </div>
        )}

        {/* Name */}
        <div style={{
          fontSize: 'clamp(48px, 6vw, 72px)', fontFamily: 'var(--font-playfair)',
          fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 8,
        }}>
          {name.split(' ')[0]}<br />
          <span style={{
            background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {name.split(' ').slice(1).join(' ')}
          </span>
        </div>

        {/* Typing */}
        <div style={{
          fontSize: 20, fontWeight: 300, color: 'var(--soft)',
          fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.02em',
          marginBottom: 20, height: 32,
        }}>
          {displayed}<span style={{ color: 'var(--gold)', animation: 'blink 0.9s step-end infinite' }}>|</span>
          <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
        </div>

        <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 32, maxWidth: 420 }}>
          {description}
        </p>

        {/* Socials */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          {socials.instagram && <SocialBtn href={socials.instagram} icon="instagram" />}
          {socials.behance && <SocialBtn href={socials.behance} icon="behance" />}
          {socials.youtube && <SocialBtn href={socials.youtube} icon="youtube" />}
          {socials.dribbble && <SocialBtn href={socials.dribbble} icon="dribbble" />}
          {socials.linkedin && <SocialBtn href={socials.linkedin} icon="linkedin" />}
          {socials.vimeo && <SocialBtn href={socials.vimeo} icon="vimeo" />}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 56 }}>
          <a href="#portfolio" className="btn-gold" style={{ textDecoration: 'none', display: 'inline-block' }}>
            {hero?.ctaPrimary || 'View Work'}
          </a>
          <a href="#contact" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-block' }}>
            {hero?.ctaSecondary || "Let's Talk"}
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 48 }}>
          {stats.map((s: any, i: number) => (
            <div key={i}>
              <div style={{
                fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700,
                background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Showreel / Profile */}
      <div style={{ flex: '0 0 auto', width: 460, zIndex: 1 }}>
        <div className="animate-float" style={{
          position: 'relative', borderRadius: 24,
          background: 'var(--surface)',
          border: '1px solid var(--border-gold)',
          overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1)',
        }}>
          {/* Window bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 16px', borderBottom: '1px solid var(--border)',
            background: 'var(--surface2)',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 8 }}>showreel_2024.mp4</span>
          </div>

          {/* Media */}
          {hero?.showreel ? (
            <video
              src={hero.showreel}
              autoPlay muted loop playsInline
              style={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }}
            />
          ) : hero?.profileImageUrl ? (
            <div style={{ position: 'relative', height: 340 }}>
              <Image src={hero.profileImageUrl} alt={name} fill style={{ objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{
              height: 300, background: 'linear-gradient(135deg, var(--surface2), var(--ink))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12,
            }}>
              <div style={{ fontSize: 48 }}>🎨</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Upload showreel in admin</div>
            </div>
          )}

          {/* Bottom bar */}
          <div style={{
            padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--surface2)',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Visual Designer</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
              color: 'var(--ink)', fontSize: 10, fontWeight: 800, padding: '4px 10px',
              borderRadius: 20, letterSpacing: '0.08em',
            }}>AVAILABLE</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialBtn({ href, icon }: { href: string; icon: string }) {
  const colors: any = {
    instagram: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366)',
    behance: '#1769ff',
    youtube: '#ff0000',
    dribbble: '#ea4c89',
    linkedin: '#0a66c2',
    vimeo: '#1ab7ea',
  };
  const icons: any = {
    instagram: '📸', behance: 'Bē', youtube: '▶', dribbble: '🏀', linkedin: 'in', vimeo: 'V',
  };
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      width: 38, height: 38, borderRadius: 10, background: colors[icon] || '#333',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none',
      transition: 'transform 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {icons[icon]}
    </a>
  );
}
