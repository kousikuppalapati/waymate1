import React from 'react';
import { ShieldCheck, Star, Award, CheckCircle2 } from 'lucide-react';

export const TrustBadge = ({
  isVerified = true,
  rating = 0,
  reviewsCount,
  ridesCompleted,
  ridesShared,
  reliabilityScore,
  compact = false,
  showFullStats = false
}) => {
  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {isVerified && (
          <span className="badge badge-verified" title="Verified College/PG Community Member">
            <CheckCircle2 size={12} strokeWidth={2.5} />
            Verified
          </span>
        )}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: '600', color: 'var(--text-main)' }}>
          <Star size={13} fill="#F59E0B" color="#F59E0B" />
          {rating ? rating.toFixed(1) : 'New member'}
        </span>
        {reliabilityScore && (
          <span className="badge badge-subtle" style={{ fontSize: '11px' }}>
            {reliabilityScore} reliable
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {isVerified ? (
          <span className="badge badge-verified" style={{ padding: '4px 10px', fontSize: '12px' }}>
            <ShieldCheck size={14} strokeWidth={2.5} />
            ✓ Verified Community Member
          </span>
        ) : (
          <span className="badge badge-warning" style={{ padding: '4px 10px', fontSize: '12px' }}>
            Verification Pending
          </span>
        )}

        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
          <Star size={14} fill="#F59E0B" color="#F59E0B" />
          {rating ? rating.toFixed(1) : 'New member'}
          {reviewsCount && <span style={{ color: 'var(--text-tertiary)', fontWeight: '400', fontSize: '12px' }}>({reviewsCount})</span>}
        </span>
      </div>

      {showFullStats && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap', marginTop: '2px' }}>
          {ridesCompleted !== undefined && (
            <span>
              <strong>{ridesCompleted}</strong> rides completed
            </span>
          )}
          {ridesShared !== undefined && (
            <span>
              • <strong>{ridesShared}</strong> rides shared
            </span>
          )}
          {reliabilityScore && (
            <span>
              • <strong style={{ color: 'var(--primary)' }}>{reliabilityScore}</strong> on-time reliability
            </span>
          )}
        </div>
      )}
    </div>
  );
};
