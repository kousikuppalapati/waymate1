import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, User } from 'lucide-react';

const getInitials = (name = '') => {
  const str = typeof name === 'string' ? name : String(name || '');
  const parts = str.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getBackgroundColor = (name = '') => {
  const str = typeof name === 'string' ? name : String(name || '');
  const colors = [
    '#1B4332', '#2D6A4F', '#0D9488', '#2563EB', '#4F46E5',
    '#7C3AED', '#9333EA', '#C026D3', '#059669', '#0284C7'
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const UserAvatar = ({
  src,
  name = 'Member',
  size = 40,
  className = '',
  style = {},
  showBadge = false,
  isVerified = false,
  onClick = null,
  title = null
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = getInitials(name);
  const bg = getBackgroundColor(name);

  const containerStyle = {
    position: 'relative',
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  const badgeSize = Math.max(12, Math.round(size * 0.32));

  return (
    <div
      className={`user-avatar-wrapper ${className}`}
      style={containerStyle}
      onClick={onClick}
      title={title || name}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            display: 'block'
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: bg,
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: `${Math.max(10, Math.round(size * 0.38))}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            letterSpacing: '0.5px',
            userSelect: 'none'
          }}
        >
          {initials}
        </div>
      )}

      {showBadge && isVerified && (
        <span
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            width: `${badgeSize}px`,
            height: `${badgeSize}px`,
            borderRadius: '50%',
            backgroundColor: 'var(--primary, #1B4332)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
          }}
          title="Verified Community Member"
        >
          <CheckCircle2 size={Math.round(badgeSize * 0.7)} strokeWidth={2.8} />
        </span>
      )}
    </div>
  );
};
