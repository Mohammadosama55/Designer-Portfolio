'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PortfolioItem {
  _id: string;
  title: string;
  description?: string;
  category: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  published?: boolean;
  order?: number;
}

export default function PortfolioSection({ items }: { items?: PortfolioItem[] }) {
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure items is an array and filter out any invalid items
  const portfolioItems = Array.isArray(items) 
    ? items.filter(item => item && item.title && item.mediaUrl && item.published !== false)
    : [];
  
  // Debug logging
  console.log('[PortfolioSection] Raw items:', items?.length || 0);
  console.log('[PortfolioSection] Filtered items:', portfolioItems.length);
  if (items && items.length > 0) {
    items.forEach((item, index) => {
      console.log(`[PortfolioSection] Item ${index}:`, {
        title: item?.title,
        hasMediaUrl: !!item?.mediaUrl,
        published: item?.published,
        category: item?.category
      });
    });
  }
  
  // Get unique categories, filter out invalid ones
  const categories = ['All', ...Array.from(new Set(
    portfolioItems
      .map(item => item.category)
      .filter((category): category is string => Boolean(category && typeof category === 'string'))
  ))];
  
  const filtered = filter === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <section id="portfolio" style={{ padding: '120px 80px', position: 'relative' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>— Selected Work —</div>
        <h2 className="section-title">Creative Portfolio</h2>
        <p style={{ 
          fontSize: 15, 
          color: 'var(--muted)', 
          marginTop: 16, 
          maxWidth: 480, 
          margin: '16px auto 0' 
        }}>
          A curated collection of visual projects spanning brand identity, motion graphics, and cinematic content.
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 1 && (
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          justifyContent: 'center', 
          marginBottom: 48, 
          flexWrap: 'wrap' 
        }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)} 
              style={{
                background: filter === cat 
                  ? 'linear-gradient(135deg, #f59e0b, #f43f5e)' 
                  : 'rgba(255,255,255,0.04)',
                color: filter === cat ? '#000000' : 'var(--soft)',
                border: filter === cat ? 'none' : '1px solid var(--border)',
                padding: '7px 20px', 
                borderRadius: 22, 
                fontSize: 13, 
                fontWeight: 600,
                cursor: 'pointer', 
                transition: 'all 0.2s',
              }}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', 
          padding: '80px 0', 
          color: 'var(--muted)',
          border: '1px dashed var(--border)', 
          borderRadius: 16,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎨</div>
          <p>No portfolio items yet. Add them in the admin dashboard.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {filtered.map((item) => (
            <PortfolioCard key={item._id} item={item} onClick={() => setLightbox(item)} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}

function PortfolioCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="portfolio-card hover-lift"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', 
        borderRadius: 16, 
        overflow: 'hidden',
        cursor: 'pointer', 
        aspectRatio: '4/3',
        background: 'var(--surface)',
        border: hovered ? '1px solid #f59e0b' : '1px solid var(--border)',
        transition: 'border-color 0.3s',
      }}
    >
      {/* Thumbnail */}
      {item.mediaType === 'video' ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {item.thumbnailUrl && !imageError ? (
            <Image 
              src={item.thumbnailUrl} 
              alt={item.title} 
              fill 
              style={{ objectFit: 'cover' }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div style={{
              width: '100%', 
              height: '100%', 
              background: 'var(--surface2)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 40,
            }}>
              🎬
            </div>
          )}
          {/* Play overlay */}
          <div style={{
            position: 'absolute', 
            inset: 0,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: hovered ? 'rgba(10,10,15,0.5)' : 'rgba(10,10,15,0.2)',
            transition: 'background 0.3s',
          }}>
            <div style={{ 
              transform: hovered ? 'scale(1.1)' : 'scale(1)', 
              transition: 'transform 0.3s',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {!imageError ? (
            <Image 
              src={item.mediaUrl} 
              alt={item.title} 
              fill 
              style={{ objectFit: 'cover' }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div style={{
              width: '100%', 
              height: '100%', 
              background: 'var(--surface2)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 40,
            }}>
              🖼️
            </div>
          )}
          <div className="portfolio-overlay" style={{ 
            opacity: hovered ? 1 : 0,
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
            transition: 'opacity 0.3s',
          }} />
        </div>
      )}

      {/* Info */}
      <div style={{
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: '20px 18px',
        background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, transparent 100%)',
        opacity: hovered ? 1 : 0, 
        transform: hovered ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          display: 'inline-block', 
          fontSize: 10, 
          fontWeight: 700, 
          letterSpacing: '0.1em',
          textTransform: 'uppercase', 
          color: '#f59e0b', 
          marginBottom: 4,
        }}>
          {item.category || 'Uncategorized'} · {item.mediaType === 'video' ? '🎬 Video' : '🖼 Image'}
        </div>
        <div style={{ 
          fontSize: 16, 
          fontWeight: 700, 
          fontFamily: 'var(--font-playfair, serif)' 
        }}>
          {item.title}
        </div>
        {item.description && (
          <div style={{ fontSize: 12, color: 'var(--soft)', marginTop: 4 }}>
            {item.description.length > 100 
              ? `${item.description.substring(0, 100)}...` 
              : item.description}
          </div>
        )}
      </div>
    </div>
  );
}

function Lightbox({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', 
        inset: 0, 
        zIndex: 9999,
        background: 'rgba(0,0,0,0.92)', 
        backdropFilter: 'blur(12px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', 
          borderRadius: 20,
          border: '1px solid #f59e0b',
          overflow: 'hidden', 
          maxWidth: 900, 
          width: '100%',
          maxHeight: '90vh',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '16px 20px', 
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface2)',
        }}>
          <div>
            <div style={{ 
              fontFamily: 'var(--font-playfair, serif)', 
              fontSize: 18, 
              fontWeight: 700 
            }}>
              {item.title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
              {item.category || 'Uncategorized'} · {item.mediaType === 'video' ? 'Video' : 'Image'}
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'rgba(255,255,255,0.08)', 
              border: 'none', 
              color: '#fff',
              width: 36, 
              height: 36, 
              borderRadius: '50%', 
              cursor: 'pointer',
              fontSize: 18, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Media */}
        <div style={{ maxHeight: 'calc(90vh - 120px)', overflow: 'auto' }}>
          {item.mediaType === 'video' ? (
            <video
              src={item.mediaUrl}
              controls
              autoPlay
              style={{ 
                width: '100%', 
                maxHeight: '70vh', 
                background: '#000', 
                display: 'block' 
              }}
            />
          ) : (
            <div style={{ position: 'relative', minHeight: 400 }}>
              {!imageError ? (
                <Image
                  src={item.mediaUrl} 
                  alt={item.title}
                  width={900} 
                  height={600}
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    display: 'block', 
                    objectFit: 'contain' 
                  }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: 400,
                  background: 'var(--surface2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                }}>
                  🖼️
                </div>
              )}
            </div>
          )}
          {item.description && (
            <div style={{ 
              padding: '20px', 
              color: 'var(--soft)', 
              fontSize: 14, 
              lineHeight: 1.6,
              borderTop: '1px solid var(--border)',
            }}>
              {item.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}