import React from 'react';
import { UserAvatar } from './UserAvatar.jsx';
import { TrustBadge } from './TrustBadge.jsx';
import { ShieldCheck, Star, Bike, X, MapPin, Award, Calendar, CheckCircle2, MessageSquare } from 'lucide-react';

export const UserProfileModal = ({ user, reviews = [], onClose }) => {
  if (!user) return null;

  const userReviews = reviews.filter(r => r.targetUserId === user.id);
  const hasReviews = userReviews.length > 0 || (user.reviewsCount > 0);
  const displayRating = user.rating && user.rating > 0 ? user.rating.toFixed(1) : null;
  const reviewCount = userReviews.length > 0 ? userReviews.length : (user.reviewsCount || 0);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '520px', width: '92%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-verified" style={{ fontSize: '11px' }}>
              <ShieldCheck size={13} /> Campus Member
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              {user.generatedUserId || 'WM-ID'}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close profile modal"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '18px' }}>
          <UserAvatar
            src={user.avatar}
            name={user.name}
            size={72}
            showBadge
            isVerified={user.isVerified}
            style={{ border: '3px solid var(--primary)' }}
          />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                {user.name}
              </h2>
              {user.isVerified && (
                <span className="badge badge-verified" style={{ fontSize: '11px', padding: '2px 7px' }}>
                  ✓ Verified
                </span>
              )}
            </div>

            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
              {user.college || 'PVP Siddhartha Institute of Technology'}
            </div>
            {user.collegeId && (
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Reg: <strong>{user.collegeId}</strong>
              </div>
            )}
            <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', marginTop: '3px' }}>
              {user.community}
            </div>
          </div>
        </div>

        {/* Trust & Reputation Box */}
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge" style={{
                backgroundColor: user.trustLevel === 'Highly Trusted' ? '#DCFCE7' : user.trustLevel === 'Trusted Member' ? '#E0F2FE' : '#F3F4F6',
                color: user.trustLevel === 'Highly Trusted' ? '#15803D' : user.trustLevel === 'Trusted Member' ? '#0369A1' : '#4B5563',
                fontWeight: '700',
                fontSize: '11.5px',
                padding: '3px 8px'
              }}>
                {user.trustLevel || (hasReviews ? 'Trusted Member' : 'New Member')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '700' }}>
              {displayRating ? (
                <>
                  <Star size={14} fill="#F59E0B" color="#F59E0B" />
                  <span>{displayRating}</span>
                  <span style={{ color: 'var(--text-tertiary)', fontWeight: '400', fontSize: '12px' }}>
                    ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '500' }}>
                  No reviews yet
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span><strong>{user.ridesCompleted || 0}</strong> rides completed</span>
            <span>•</span>
            <span><strong>{user.ridesShared || 0}</strong> rides offered</span>
            {user.reliabilityScore && (
              <>
                <span>•</span>
                <span><strong style={{ color: 'var(--primary)' }}>{user.reliabilityScore}</strong> reliability</span>
              </>
            )}
          </div>
        </div>

        {/* Registered Vehicle Section */}
        <div style={{
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Vehicle Details
          </div>
          {user.vehicleModel || (user.vehicle && user.vehicle !== 'No vehicle registered') ? (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bike size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                  {user.vehicleModel || user.vehicle}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {user.bikeColour && <span>Colour: <strong>{user.bikeColour}</strong> · </span>}
                  <span>Fuel: <strong>{user.isEv ? 'Electric (EV)' : (user.fuelType || 'Petrol')}</strong></span>
                  {user.bikeNumber && <span> · Plate: <strong>{user.bikeNumber}</strong></span>}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
              No vehicle registered · Passenger member
            </div>
          )}
        </div>

        {/* Peer Reviews List */}
        {userReviews.length > 0 && (
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={13} />
              <span>Community Reviews ({userReviews.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {userReviews.map((rev, idx) => (
                <div key={rev.id || idx} style={{
                  padding: '10px 12px',
                  backgroundColor: '#FAFAFA',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>
                      {rev.reviewerName}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: '700', color: '#F59E0B' }}>
                      <Star size={11} fill="#F59E0B" /> {rev.rating}.0
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                    “{rev.comment}”
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ minWidth: '90px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
